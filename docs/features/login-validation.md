# Login Validation

## Overview

This document describes the expected request and validation error shape for the login endpoint `POST /auth/login`.

## Request payload

The login endpoint expects a JSON body with the following fields:

- `email` (string): A valid email address.
- `password` (string): Minimum length 6 characters.

Example:

```json
{
  "email": "user@example.com",
  "password": "s3cr3t"
}
```

## Validation errors

When the payload fails validation, the API will return HTTP 400 with a JSON body in this shape:

```json
{
  "ok": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "constraints": {
        "isEmail": "email must be an email"
      }
    }
  ]
}
```

Notes:

- `errors` is an array of violations. Each violation indicates the `field` and a `constraints` object mapping constraint
  keys to human-readable messages.
- This format is produced by a global `ValidationPipe` with a custom `exceptionFactory`.

## Implementation

- The `LoginDto` is defined in `apps/api/src/modules/auth/dto/login.dto.ts`.
- The global `ValidationPipe` with a custom `exceptionFactory` will be registered in `apps/api/src/main.ts`.

## Testing

- Add an e2e test that sends an invalid payload (e.g., missing `email` or improperly formatted `email`) and assert the
  400 body matches the shape above.

## Refresh token expiry

When refresh tokens are issued the server generates a `jti` and signs the refresh token including the `jti` claim. The
server stores the `jti` (not the full token) in the database along with an `expiresAt` timestamp computed from
`JWT_REFRESH_EXPIRES_IN`. The `POST /auth/refresh` flow verifies the token signature, extracts `jti`, looks up the
persisted `jti` to ensure it's not revoked and not expired, then rotates the refresh token.

### Backfill & cleanup

If you already have refresh tokens in the DB without `expires_at`, you can backfill a reasonable default using the
provided migration `packages/db/migrations/003_backfill_refresh_expires_at.sql`. Adjust the interval in the SQL file if
your intended refresh window differs from 7 days.

To remove expired refresh tokens, a helper script is provided: `scripts/cleanup_refresh_tokens.js` — run it with
`node scripts/cleanup_refresh_tokens.js <DATABASE_URL>` or set `DATABASE_URL` in the environment.
