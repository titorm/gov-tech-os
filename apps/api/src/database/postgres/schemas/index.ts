// Re-export centralized schemas from the shared db package.
// This keeps existing import paths in the API codebase working while
// the canonical schema definitions live in `packages/db`.
export * from '@gov-tech/db';
