# Database Documentation

## Overview

The application uses a hybrid database approach combining the strengths of different database types:

- **PostgreSQL + Drizzle ORM**: Primary relational database for structured data
- **MongoDB + Mongoose**: Document database for logs and analytics
- **Redis**: In-memory cache for performance optimization

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     MongoDB      │    │      Redis      │
│                 │    │                  │    │                 │
│ • Users         │    │ • Logs           │    │ • Sessions      │
│ • Subscriptions │    │ • Analytics      │    │ • Cache         │
│ • Structured    │    │ • Unstructured   │    │ • Temporary     │
│   Data          │    │   Data           │    │   Data          │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────┐
                    │     NestJS API      │
                    │                     │
                    │ • Drizzle ORM       │
                    │ • Mongoose          │
                    │ • Cache Manager     │
                    └─────────────────────┘
```

## Database Connections

### PostgreSQL Configuration
```typescript
// Drizzle connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
```

### MongoDB Configuration
```typescript
// Mongoose connection
MongooseModule.forRoot(process.env.MONGODB_URI!, {
  connectionName: 'logs',
});
```

### Redis Configuration
```typescript
// Cache Manager with Redis
CacheModule.registerAsync({
  isGlobal: true,
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });
    return { store, ttl: 300 * 1000 }; // 5 minutes
  },
});
```

## Environment Variables

```bash
# PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"

# MongoDB  
MONGODB_URI="mongodb://localhost:27017/myapp-logs"

# Redis
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT="6379"
```

## Data Flow

### Write Operations
1. **User Action** → API Endpoint
2. **Validation** → Business Logic
3. **PostgreSQL** ← Structured Data (Users, Subscriptions)
4. **MongoDB** ← Log Entry (Activity, Errors)
5. **Redis** ← Cache Invalidation

### Read Operations
1. **API Request** → Check Redis Cache
2. **Cache Hit** → Return Cached Data
3. **Cache Miss** → Query Database
4. **Database Response** → Update Cache
5. **Return Data** → Client

## Database Schema Management

### Drizzle Schema
```bash
# Generate migration
pnpm db:generate

# Push schema to database
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

### Migrations
```typescript
// Create new migration
import { sql } from 'drizzle-orm';

export async function up(db: PostgresJsDatabase) {
  await db.execute(sql`
    ALTER TABLE users ADD COLUMN avatar TEXT;
  `);
}

export async function down(db: PostgresJsDatabase) {
  await db.execute(sql`
    ALTER TABLE users DROP COLUMN avatar;
  `);
}
```

## Performance Optimization

### Indexing Strategy
```sql
-- User queries
CREATE INDEX users_email_idx ON users (email);
CREATE INDEX users_role_idx ON users (role);
CREATE INDEX users_created_at_idx ON users (created_at);

-- Subscription queries
CREATE INDEX subscriptions_user_id_idx ON subscriptions (user_id);
CREATE INDEX subscriptions_status_idx ON subscriptions (status);
CREATE INDEX subscriptions_stripe_customer_id_idx ON subscriptions (stripe_customer_id);
```

### MongoDB Indexes
```javascript
// Log collection indexes
db.logs.createIndex({ timestamp: -1, level: 1 });
db.logs.createIndex({ userId: 1, timestamp: -1 });
db.logs.createIndex({ endpoint: 1, method: 1 });
```

### Redis Caching
```typescript
// Cache user profile for 5 minutes
@UseInterceptors(CacheInterceptor)
@CacheTTL(300)
@Get('profile')
async getProfile(@CurrentUser() user: User) {
  return this.userService.getProfile(user.id);
}
```

## Backup and Recovery

### PostgreSQL Backup
```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql $DATABASE_URL < backup_20240101_120000.sql
```

### MongoDB Backup
```bash
# Create backup
mongodump --uri=$MONGODB_URI --out=./backup_$(date +%Y%m%d_%H%M%S)

# Restore backup
mongorestore --uri=$MONGODB_URI ./backup_20240101_120000
```

### Redis Backup
```bash
# Redis automatically creates snapshots
# Manual backup
redis-cli --rdb dump.rdb

# Restore
cp dump.rdb /var/lib/redis/
```

## Monitoring

### Database Health Checks
```typescript
@Injectable()
export class HealthService {
  @HealthCheck()
  @Get('database')
  async checkDatabase() {
    return this.health.check([
      () => this.db.pingCheck('postgres', { timeout: 1500 }),
      () => this.mongo.pingCheck('mongodb', { timeout: 1500 }),
      () => this.redis.pingCheck('redis', { timeout: 1500 }),
    ]);
  }
}
```

### Performance Metrics
- Connection pool utilization
- Query execution times
- Cache hit/miss ratios
- Database size growth
- Index usage statistics

## Development Workflow

### Local Setup
```bash
# Start databases
docker-compose -f docker-compose.dev.yml up -d

# Verify connections
pnpm db:studio  # PostgreSQL GUI
mongosh $MONGODB_URI  # MongoDB shell
redis-cli  # Redis CLI
```

### Database Seeding
```bash
# Run seed script
pnpm db:seed

# Reset and seed
pnpm db:reset && pnpm db:seed
```

## Related Documentation

- [PostgreSQL Schema](./postgres.md) - Detailed table schemas
- [MongoDB Collections](./mongodb.md) - Document structures  
- [Redis Configuration](./redis.md) - Caching strategies
- [Migrations](./migrations.md) - Schema versioning
- [API Documentation](../api/README.md) - Database interactions
