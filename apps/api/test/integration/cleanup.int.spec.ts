import { Client } from 'pg';
import { spawnSync } from 'child_process';
import path from 'path';

const SCRIPT_PATH = path.resolve(__dirname, '../../../../scripts/cleanup_refresh_tokens.js');

// This integration test requires a running Postgres. In CI we provide a postgres service.
// The test will:
// - Create a temporary table `refresh_tokens` (if not exists)
// - Insert N expired tokens and M valid tokens
// - Run the cleanup script with --batch-size and --limit and verify the expected deletes

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test';

function makeTimestamp(offsetMs: number) {
  const d = new Date(Date.now() + offsetMs);
  return d.toISOString();
}

describe('cleanup_refresh_tokens integration', () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    // create table if not exists (minimal schema used by script)
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid,
        jti uuid,
        revoked boolean DEFAULT false,
        created_at timestamptz DEFAULT now(),
        expires_at timestamptz
      );
    `);
    // clean table
    await client.query('TRUNCATE refresh_tokens');
  }, 30000);

  afterAll(async () => {
    if (client) {
      await client.end();
    }
  });

  it(
    'deletes expired tokens in batches',
    async () => {
      // insert 3500 expired rows and 100 not-expired
      const expired = 3500;
      const notExpired = 100;
      const insertExpiredText = `INSERT INTO refresh_tokens (user_id, jti, expires_at) VALUES ($1, $2, $3)`;

      for (let i = 0; i < expired; i++) {
        await client.query(insertExpiredText, [
          '00000000-0000-0000-0000-000000000000',
          null,
          makeTimestamp(-1000 * 60 * 60 * 24),
        ]);
      }
      for (let i = 0; i < notExpired; i++) {
        await client.query(insertExpiredText, [
          '00000000-0000-0000-0000-000000000000',
          null,
          makeTimestamp(1000 * 60 * 60 * 24),
        ]);
      }

      // run the script to delete up to 3000 rows in batches of 1000
      const args = ['--batch-size', '1000', '--limit', '3000'];
      const res = spawnSync('node', [SCRIPT_PATH, ...args], {
        env: { ...process.env, DATABASE_URL },
        stdio: 'inherit',
        timeout: 5 * 60 * 1000,
      });

      expect(res.status).toBe(0);

      const countRes = await client.query(
        'SELECT COUNT(*) as cnt FROM refresh_tokens WHERE expires_at IS NOT NULL AND expires_at < now()'
      );
      const remainingExpired = parseInt(countRes.rows[0].cnt, 10);
      // originally 3500 expired, we asked to delete 3000 -> remaining should be 500
      expect(remainingExpired).toBeGreaterThanOrEqual(499);
      expect(remainingExpired).toBeLessThanOrEqual(501);
    },
    10 * 60 * 1000
  );
});
