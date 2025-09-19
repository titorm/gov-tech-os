# API Documentation

This document provides comprehensive information about the NestJS API built with Fastify, Drizzle ORM, and modern security practices.

## 🏗️ Architecture Overview

The API follows a modular architecture with the following key components:

- **NestJS Framework**: Provides dependency injection, decorators, and module system
- **Fastify**: High-performance HTTP server (2x faster than Express)
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **MongoDB**: Document storage for logs and analytics
- **Redis**: Caching layer with @nestjs/cache-manager
- **Socket.IO**: Real-time WebSocket communication

## 📡 Base URL

- **Development**: `http://localhost:3001/api/v1`
- **Production**: `https://your-domain.com/api/v1`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication with the following features:

- **Access Tokens**: Short-lived tokens for API access (7 days default)
- **Refresh Tokens**: Long-lived tokens for obtaining new access tokens
- **Role-Based Access Control**: Admin, user, and moderator roles
- **Secure Storage**: Tokens should be stored securely (httpOnly cookies recommended)

### Authentication Flow

1. **Login/Register**: `POST /auth/login` or `POST /auth/register`
2. **Receive Tokens**: Access token and refresh token returned
3. **Use Access Token**: Include in `Authorization: Bearer <token>` header
4. **Refresh Token**: Use `POST /auth/refresh` when access token expires
5. **Logout**: Call `POST /auth/logout` to invalidate tokens

## 📚 API Modules

### Authentication (`/auth`)
- User registration and login
- JWT token management
- Password reset functionality
- Profile management

### Users (`/users`)
- User CRUD operations
- Profile updates
- Role management
- User search and filtering

### Subscriptions (`/subscriptions`)
- Subscription management
- Stripe integration
- Plan upgrades/downgrades
- Billing history

### Logs (`/logs`)
- System logging
- User activity tracking
- Error reporting
- Analytics data

## 🔒 Security Features

### Helmet Integration
```typescript
await app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [`'self'`, `'unsafe-inline'`],
      scriptSrc: [`'self'`],
      objectSrc: [`'none'`],
      upgradeInsecureRequests: [],
    },
  },
});
```

### Rate Limiting
```typescript
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000,
    limit: 3,
  },
  {
    name: 'medium', 
    ttl: 10000,
    limit: 20,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 100,
  },
])
```

### Input Validation
- All endpoints use `class-validator` decorators
- Automatic validation with `ValidationPipe`
- Sanitization of user inputs
- SQL injection prevention through Drizzle ORM

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    // Response data here
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/v1/users"
}
```

### Paginated Response
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "data": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🏃‍♂️ Getting Started

1. **Install Dependencies**:
   ```bash
   cd apps/api
   pnpm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**:
   ```bash
   # Start PostgreSQL, MongoDB, Redis
   docker-compose -f docker-compose.dev.yml up -d
   
   # Push database schema
   pnpm db:push
   ```

4. **Start Development Server**:
   ```bash
   pnpm dev
   ```

## 🧪 Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

## 📖 Related Documentation

- [Authentication Guide](./authentication.md)
- [API Endpoints Reference](./endpoints.md)
- [WebSocket Documentation](./websocket.md)
- [Rate Limiting Configuration](./rate-limiting.md)
- [Database Schema](../database/postgres.md)

## 🔧 Development Tools

- **Drizzle Studio**: `pnpm db:studio` - Database GUI
- **API Documentation**: Swagger/OpenAPI (available at `/docs`)
- **Logging**: Winston with MongoDB integration
- **Debugging**: VS Code debugger configuration included

## 🚀 Performance Optimizations

- **Fastify**: ~2x faster than Express
- **Redis Caching**: Automatic response caching
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Compression**: Automatic response compression
