# Authentication System

## Overview

The API uses a robust JWT-based authentication system with the following features:

- **JWT Access Tokens**: Short-lived tokens for API access
- **Refresh Tokens**: Long-lived tokens for token renewal
- **Role-Based Access Control**: Fine-grained permission system
- **Secure Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Protection against brute force attacks

## JWT Configuration

```typescript
// JWT Configuration
{
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  issuer: 'api.yourapp.com',
  audience: 'yourapp.com',
}
```

## User Roles

### Admin
- Full system access
- User management
- System configuration
- Analytics access

### Moderator  
- Content moderation
- User support
- Limited analytics

### User
- Personal data access
- Subscription management
- Profile updates

## Authentication Endpoints

### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "isEmailVerified": false
    }
  }
}
```

### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Get User Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

### Refresh Token
```http
POST /api/v1/auth/refresh
Authorization: Bearer <refresh-token>
```

### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

## Guards and Decorators

### JWT Auth Guard
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected-route')
getProtectedData() {
  return { message: 'This is protected' };
}
```

### Roles Guard
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'moderator')
@Get('admin-only')
getAdminData() {
  return { message: 'Admin only data' };
}
```

### Public Routes
```typescript
@Public()
@Get('public-route')
getPublicData() {
  return { message: 'This is public' };
}
```

### Current User Decorator
```typescript
@Get('my-profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: User) {
  return user;
}
```

## Password Security

### Hashing
```typescript
import * as bcrypt from 'bcryptjs';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};
```

### Validation
```typescript
const validatePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

## Rate Limiting

### Login Attempts
```typescript
@Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
@Post('login')
async login(@Body() loginDto: LoginDto) {
  // Login logic
}
```

### Registration
```typescript
@Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 registrations per hour
@Post('register')
async register(@Body() registerDto: RegisterDto) {
  // Registration logic
}
```

## JWT Payload Structure

```typescript
interface JwtPayload {
  sub: string;        // User ID
  email: string;      // User email
  role: string;       // User role
  iat: number;        // Issued at
  exp: number;        // Expires at
  iss: string;        // Issuer
  aud: string;        // Audience
}
```

## Security Best Practices

### Environment Variables
```bash
# Use strong, randomly generated secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-chars
JWT_EXPIRES_IN=7d

# Different secrets for different environments
JWT_REFRESH_SECRET=different-secret-for-refresh-tokens
```

### Token Storage (Client-Side)
```typescript
// ❌ Don't store in localStorage
localStorage.setItem('token', token);

// ✅ Use httpOnly cookies or secure storage
// Server should set httpOnly cookies
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number
- At least 1 special character

## Error Handling

### Common Authentication Errors

```typescript
// Invalid credentials
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}

// Token expired
{
  "statusCode": 401,
  "message": "Token expired",
  "error": "Unauthorized"
}

// Insufficient permissions
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}

// Invalid token format
{
  "statusCode": 401,
  "message": "Invalid token format",
  "error": "Unauthorized"
}
```

## Testing Authentication

### Unit Tests
```typescript
describe('AuthService', () => {
  it('should validate correct password', async () => {
    const password = 'SecurePass123!';
    const hash = await authService.hashPassword(password);
    const isValid = await authService.validatePassword(password, hash);
    expect(isValid).toBe(true);
  });
});
```

### E2E Tests
```typescript
describe('/auth (e2e)', () => {
  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200)
      .expect(res => {
        expect(res.body.data.token).toBeDefined();
        expect(res.body.data.user.email).toBe('test@example.com');
      });
  });
});
```

## Monitoring and Logging

### Authentication Events
- Login attempts (successful/failed)
- Registration events
- Token refresh events
- Password change events
- Account lockouts

### Log Format
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "level": "info",
  "message": "User login successful",
  "userId": "uuid-here",
  "email": "user@example.com",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```
