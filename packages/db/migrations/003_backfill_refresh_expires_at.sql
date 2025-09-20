-- Migration: backfill expires_at for existing refresh tokens
-- This will set expires_at = created_at + INTERVAL '7 days' for rows where expires_at is NULL.
-- Adjust the interval as needed before running in production.

UPDATE refresh_tokens
SET expires_at = created_at + INTERVAL '7 days'
WHERE expires_at IS NULL;

-- Note: If you want to use a different duration, edit this file before applying.
