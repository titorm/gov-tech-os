#!/usr/bin/env node
// Simple cleanup script to remove expired refresh tokens. Use with care.
// Usage: node scripts/cleanup_refresh_tokens.js [--dry-run] [DATABASE_URL]

async function main() {
  const args = process.argv.slice(2);
  const dryRunIndex = args.findIndex(a => a === '--dry' || a === '--dry-run');
  const dryRun = dryRunIndex !== -1;
  // parse optional flags: --batch-size <n> and --limit <n>
  const batchSizeIndex = args.findIndex(a => a === '--batch-size');
  const limitIndex = args.findIndex(a => a === '--limit');
  const pauseMsIndex = args.findIndex(a => a === '--pause-ms');
  const batchSize = batchSizeIndex !== -1 && args[batchSizeIndex + 1] ? parseInt(args[batchSizeIndex + 1], 10) : 1000;
  const limit = limitIndex !== -1 && args[limitIndex + 1] ? parseInt(args[limitIndex + 1], 10) : null;
  const pauseMs = pauseMsIndex !== -1 && args[pauseMsIndex + 1] ? parseInt(args[pauseMsIndex + 1], 10) : 0;

  // determine db url (first positional arg not a flag)
  const positional = args.filter(
    a => !['--dry', '--dry-run', '--batch-size', '--limit'].includes(a) && !/^-\d+$/.test(a)
  );
  const dbUrl = positional[0] || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error(
      'DATABASE_URL required as positional arg or via the DATABASE_URL environment variable (CI: set secrets.DATABASE_URL)'
    );
    // exit code 2 indicates missing required configuration
    process.exit(2);
  }
  // Delay importing pg until after we validate configuration so local runs without pg
  // installed can fail-fast when DATABASE_URL is missing.
  const { Client } = require('pg');
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    if (dryRun) {
      const res = await client.query(
        `SELECT COUNT(*) AS cnt FROM refresh_tokens WHERE expires_at IS NOT NULL AND expires_at < now()`
      );
      const cnt = res.rows[0] ? parseInt(res.rows[0].cnt, 10) : 0;
      const effectiveLimit = limit ? Math.min(limit, cnt) : cnt;
      const estimatedBatches = Math.ceil(effectiveLimit / batchSize || 1);
      console.log('[dry-run] Would delete', effectiveLimit, 'expired refresh tokens');
      console.log('[dry-run] Using batch size:', batchSize, '-> estimated batches:', estimatedBatches);
      // if pauseMs not explicitly provided, compute an automatic pause heuristic
      if (pauseMs === 0 && estimatedBatches > 1) {
        let autoPause = 0;
        if (batchSize <= 500) autoPause = 0;
        else if (batchSize <= 2000) autoPause = 50;
        else if (batchSize <= 5000) autoPause = 200;
        else autoPause = 500;
        console.log('[dry-run] Auto-pause heuristic -> pause-ms:', autoPause);
      }
      // show a small sample of ids (up to 10) for verification
      const sample = await client.query(
        `SELECT id, user_id, expires_at FROM refresh_tokens WHERE expires_at IS NOT NULL AND expires_at < now() ORDER BY expires_at DESC LIMIT 10`
      );
      if (sample.rows.length) {
        console.log('[dry-run] Sample rows:');
        console.table(sample.rows);
      }
      return;
    }

    // Perform batched deletes to avoid long table locks
    let totalDeleted = 0;
    // If pauseMs wasn't set explicitly, we can compute an automatic pause.
    let effectivePauseMs = pauseMs;
    if (effectivePauseMs === 0) {
      if (batchSize <= 500) effectivePauseMs = 0;
      else if (batchSize <= 2000) effectivePauseMs = 50;
      else if (batchSize <= 5000) effectivePauseMs = 200;
      else effectivePauseMs = 500;
    }
    while (true) {
      // respect total limit if provided
      const remaining = limit ? Math.max(limit - totalDeleted, 0) : null;
      const thisBatch = remaining !== null ? Math.max(Math.min(batchSize, remaining), 0) : batchSize;
      if (thisBatch === 0) break;

      // delete using a subselect to apply LIMIT
      const delRes = await client.query(
        `DELETE FROM refresh_tokens WHERE id IN (
          SELECT id FROM refresh_tokens WHERE expires_at IS NOT NULL AND expires_at < now() ORDER BY expires_at DESC LIMIT $1
        ) RETURNING id`,
        [thisBatch]
      );

      const deletedCount = delRes.rowCount || 0;
      totalDeleted += deletedCount;
      console.log('Deleted', deletedCount, 'rows in this batch (total so far:', totalDeleted + ')');

      if (effectivePauseMs > 0) {
        // sleep between batches to reduce DB pressure
        await new Promise(resolve => setTimeout(resolve, effectivePauseMs));
      }

      if (deletedCount < thisBatch) break; // no more rows
      if (limit && totalDeleted >= limit) break; // reached requested limit
    }

    console.log('Finished cleanup. Total deleted:', totalDeleted);
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
