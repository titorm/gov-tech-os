# PostgreSQL Schema Documentation

## Overview

PostgreSQL serves as the primary relational database using Drizzle ORM for type-safe operations. It stores structured data including users, subscriptions, and other relational entities.

## Database Configuration

```typescript
// Connection setup
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
```

## Schema Definitions

### Users Table

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  avatar: text('avatar'),
  role: userRoleEnum('role').default('user').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'moderator']);
```

**Indexes:**
```sql
CREATE UNIQUE INDEX users_email_idx ON users (email);
CREATE INDEX users_role_idx ON users (role);
CREATE INDEX users_created_at_idx ON users (created_at);
CREATE INDEX users_is_active_idx ON users (is_active);
```

### Subscriptions Table

```typescript
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  plan: subscriptionPlanEnum('plan').default('free').notNull(),
  status: subscriptionStatusEnum('status').default('active').notNull(),
  priceId: varchar('price_id', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('usd'),
  interval: varchar('interval', { length: 20 }),
  intervalCount: integer('interval_count').default(1),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  canceledAt: timestamp('canceled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subscriptionPlanEnum = pgEnum('subscription_plan', [
  'free', 'basic', 'pro', 'enterprise'
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active', 'canceled', 'past_due', 'unpaid'
]);
```

**Indexes:**
```sql
CREATE INDEX subscriptions_user_id_idx ON subscriptions (user_id);
CREATE INDEX subscriptions_status_idx ON subscriptions (status);
CREATE INDEX subscriptions_stripe_customer_id_idx ON subscriptions (stripe_customer_id);
CREATE INDEX subscriptions_current_period_end_idx ON subscriptions (current_period_end);
```

## Drizzle ORM Operations

### Basic Queries

```typescript
// Select users
const users = await db.select().from(usersTable);

// Select with conditions
const activeUsers = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.isActive, true));

// Select with joins
const usersWithSubscriptions = await db
  .select({
    user: usersTable,
    subscription: subscriptionsTable,
  })
  .from(usersTable)
  .leftJoin(subscriptionsTable, eq(usersTable.id, subscriptionsTable.userId));
```

### Insert Operations

```typescript
// Insert single user
const newUser = await db
  .insert(usersTable)
  .values({
    email: 'user@example.com',
    password: hashedPassword,
    firstName: 'John',
    lastName: 'Doe',
  })
  .returning();

// Insert multiple users
const newUsers = await db
  .insert(usersTable)
  .values([
    { email: 'user1@example.com', password: hash1 },
    { email: 'user2@example.com', password: hash2 },
  ])
  .returning();
```

### Update Operations

```typescript
// Update user
const updatedUser = await db
  .update(usersTable)
  .set({
    firstName: 'Jane',
    updatedAt: new Date(),
  })
  .where(eq(usersTable.id, userId))
  .returning();

// Conditional update
await db
  .update(usersTable)
  .set({ isEmailVerified: true })
  .where(
    and(
      eq(usersTable.email, email),
      eq(usersTable.isActive, true)
    )
  );
```

### Delete Operations

```typescript
// Soft delete (update status)
await db
  .update(usersTable)
  .set({ 
    isActive: false,
    updatedAt: new Date(),
  })
  .where(eq(usersTable.id, userId));

// Hard delete
await db
  .delete(usersTable)
  .where(eq(usersTable.id, userId));
```

### Complex Queries

```typescript
// Pagination with search
const result = await db
  .select({
    id: usersTable.id,
    email: usersTable.email,
    firstName: usersTable.firstName,
    lastName: usersTable.lastName,
    role: usersTable.role,
    createdAt: usersTable.createdAt,
  })
  .from(usersTable)
  .where(
    and(
      eq(usersTable.isActive, true),
      or(
        ilike(usersTable.firstName, `%${search}%`),
        ilike(usersTable.lastName, `%${search}%`),
        ilike(usersTable.email, `%${search}%`)
      )
    )
  )
  .orderBy(desc(usersTable.createdAt))
  .limit(limit)
  .offset((page - 1) * limit);

// Aggregate queries
const stats = await db
  .select({
    totalUsers: count(usersTable.id),
    activeUsers: count(
      case()
        .when(eq(usersTable.isActive, true), usersTable.id)
        .else(null)
    ),
  })
  .from(usersTable);
```

## Database Migrations

### Initial Migration

```sql
-- 0001_initial.sql
CREATE TYPE "user_role" AS ENUM('admin', 'user', 'moderator');
CREATE TYPE "subscription_status" AS ENUM('active', 'canceled', 'past_due', 'unpaid');
CREATE TYPE "subscription_plan" AS ENUM('free', 'basic', 'pro', 'enterprise');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "password" varchar(255) NOT NULL,
  "first_name" varchar(100),
  "last_name" varchar(100),
  "avatar" text,
  "role" "user_role" DEFAULT 'user' NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "is_email_verified" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "subscriptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "stripe_customer_id" varchar(255),
  "stripe_subscription_id" varchar(255),
  "plan" "subscription_plan" DEFAULT 'free' NOT NULL,
  "status" "subscription_status" DEFAULT 'active' NOT NULL,
  "price_id" varchar(255),
  "amount" numeric(10, 2),
  "currency" varchar(3) DEFAULT 'usd',
  "interval" varchar(20),
  "interval_count" integer DEFAULT 1,
  "trial_start" timestamp,
  "trial_end" timestamp,
  "current_period_start" timestamp,
  "current_period_end" timestamp,
  "cancel_at_period_end" boolean DEFAULT false,
  "canceled_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "subscriptions" 
ADD CONSTRAINT "subscriptions_user_id_users_id_fk" 
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;

-- Indexes
CREATE INDEX "users_email_idx" ON "users" ("email");
CREATE INDEX "users_role_idx" ON "users" ("role");
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" ("user_id");
CREATE INDEX "subscriptions_status_idx" ON "subscriptions" ("status");
```

### Running Migrations

```bash
# Generate migration from schema changes
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Apply migrations (production)
pnpm db:migrate
```

## Performance Optimization

### Query Optimization

```typescript
// Use select specific fields
const users = await db
  .select({
    id: usersTable.id,
    email: usersTable.email,
    firstName: usersTable.firstName,
  })
  .from(usersTable);

// Use indexes effectively
const user = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.email, email)) // Uses index
  .limit(1);

// Batch operations
const users = await db
  .insert(usersTable)
  .values(userData) // Array of objects
  .returning();
```

### Connection Pooling

```typescript
// PostgreSQL connection with pool settings
const client = postgres(connectionString, {
  max: 20,          // Maximum connections
  idle_timeout: 30, // Idle timeout in seconds
  connect_timeout: 60, // Connection timeout
});
```

## Data Validation

### Schema Validation

```typescript
// Drizzle schema with constraints
export const users = pgTable('users', {
  email: varchar('email', { length: 255 })
    .unique()
    .notNull(),
  password: varchar('password', { length: 255 })
    .notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
}, (table) => {
  return {
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
  };
});
```

### Application-Level Validation

```typescript
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
});
```

## Backup and Maintenance

### Backup Strategy

```bash
# Daily backup
pg_dump $DATABASE_URL --no-owner --no-acl > backup_$(date +%Y%m%d).sql

# Backup with compression
pg_dump $DATABASE_URL --no-owner --no-acl | gzip > backup_$(date +%Y%m%d).sql.gz

# Point-in-time recovery setup
# Enable WAL archiving in postgresql.conf
archive_mode = on
archive_command = 'cp %p /path/to/archive/%f'
```

### Maintenance Tasks

```sql
-- Analyze tables for query optimization
ANALYZE users;
ANALYZE subscriptions;

-- Vacuum to reclaim space
VACUUM ANALYZE users;
VACUUM ANALYZE subscriptions;

-- Reindex if needed
REINDEX TABLE users;
REINDEX TABLE subscriptions;
```

## Monitoring

### Performance Queries

```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname, 
  tablename, 
  indexname, 
  idx_scan, 
  idx_tup_read, 
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Health Checks

```typescript
@Injectable()
export class DatabaseHealthService {
  async checkPostgresHealth(): Promise<boolean> {
    try {
      await this.db.execute(sql`SELECT 1`);
      return true;
    } catch (error) {
      console.error('PostgreSQL health check failed:', error);
      return false;
    }
  }
}
```
