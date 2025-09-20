-- Migration: add index on refresh_tokens.token and ensure expires_at column exists

-- Ensure expires_at column exists (no-op if already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='refresh_tokens' AND column_name='expires_at'
  ) THEN
    ALTER TABLE refresh_tokens ADD COLUMN expires_at timestamptz;
  END IF;
END$$;

-- Create index on token (jti) for fast lookups
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens (token);

-- Optionally, remove duplicate expired tokens (no-op comment, manual cleanup recommended)
-- DELETE FROM refresh_tokens WHERE expires_at IS NOT NULL AND expires_at < now();
