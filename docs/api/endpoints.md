# API Endpoints Reference

## Base URL
- Development: `http://localhost:3001/api/v1`
- Production: `https://your-domain.com/api/v1`

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
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
      "role": "user"
    }
  }
}
```

### POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com", 
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

### GET /auth/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "uuid-here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### POST /auth/logout
Logout user and invalidate token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Logout successful"
}
```

## User Management Endpoints

### GET /users
Get list of users (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `search` (string): Search term
- `role` (string): Filter by role
- `status` (string): Filter by status

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "uuid-here",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "user",
        "isActive": true,
        "createdAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### GET /users/:id
Get user by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "uuid-here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true
  }
}
```

### PUT /users/:id
Update user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "id": "uuid-here",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "avatar": "https://example.com/avatar.jpg",
    "role": "user"
  }
}
```

### DELETE /users/:id
Delete user (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "User deleted successfully"
}
```

## Subscription Endpoints

### GET /subscriptions
Get user subscriptions.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid-here",
      "plan": "pro",
      "status": "active",
      "amount": 29.99,
      "currency": "usd",
      "currentPeriodEnd": "2024-02-01T12:00:00.000Z",
      "cancelAtPeriodEnd": false
    }
  ]
}
```

### POST /subscriptions
Create new subscription.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "plan": "pro",
  "priceId": "price_1234567890"
}
```

**Response:** `201 Created`
```json
{
  "statusCode": 201,
  "message": "Subscription created successfully",
  "data": {
    "id": "uuid-here",
    "plan": "pro",
    "status": "active",
    "amount": 29.99,
    "currency": "usd"
  }
}
```

### PUT /subscriptions/:id
Update subscription.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "plan": "enterprise",
  "cancelAtPeriodEnd": false
}
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Subscription updated successfully",
  "data": {
    "id": "uuid-here",
    "plan": "enterprise",
    "status": "active"
  }
}
```

### DELETE /subscriptions/:id/cancel
Cancel subscription.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "statusCode": 200,
  "message": "Subscription cancelled successfully",
  "data": {
    "id": "uuid-here",
    "status": "canceled",
    "canceledAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid token",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded",
  "error": "Too Many Requests"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Rate Limiting

### Default Limits
- **Short**: 3 requests per second
- **Medium**: 20 requests per 10 seconds  
- **Long**: 100 requests per minute

### Endpoint-Specific Limits
- **Login**: 5 attempts per minute
- **Register**: 3 registrations per hour
- **Password Reset**: 3 attempts per hour

### Headers
Rate limit information is returned in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

For endpoints that return lists, use these query parameters:

- `page`: Page number (1-based)
- `limit`: Items per page (max 100)
- `sortBy`: Field to sort by
- `sortOrder`: 'asc' or 'desc'

**Example:**
```
GET /users?page=2&limit=20&sortBy=createdAt&sortOrder=desc
```

## Filtering

Many endpoints support filtering:

- `search`: Text search across relevant fields
- `status`: Filter by status
- `role`: Filter by user role
- `dateFrom`: Filter from date (ISO format)
- `dateTo`: Filter to date (ISO format)

**Example:**
```
GET /users?search=john&role=user&status=active
```
