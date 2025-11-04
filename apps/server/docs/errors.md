# Error Handling Documentation

This document explains the error handling system in the server application, including custom error classes and their usage patterns.

## Overview

The error handling system provides structured error classes that map to appropriate HTTP status codes and provide consistent error responses throughout the application.

## Error Classes

### HTTP Errors (`@/errors`)

All HTTP-related error classes are available through the barrel export:

```typescript
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from "@/errors";
```

#### ValidationError (422 Unprocessable Entity)

Used for input validation errors:

```typescript
import { ValidationError } from "@/errors";

// Basic validation error
throw new ValidationError("Email is required");

// Field-specific validation error
throw new ValidationError("Invalid email format", "email");
```

**Usage Examples:**
```typescript
// In route handlers
.post("/users", ({ body }) => {
  if (!body.email) {
    throw new ValidationError("Email is required", "email");
  }
  
  if (!isValidEmail(body.email)) {
    throw new ValidationError("Invalid email format", "email");
  }
  
  return createUser(body);
})
```

#### NotFoundError (404 Not Found)

Used when a requested resource doesn't exist:

```typescript
import { NotFoundError } from "@/errors";

// Resource not found
throw new NotFoundError("User");
throw new NotFoundError("Product");
throw new NotFoundError("Order");
```

**Usage Examples:**
```typescript
// In service methods
async getUserById(id: string) {
  const user = await db.findUser(id);
  if (!user) {
    throw new NotFoundError("User");
  }
  return user;
}

// In route handlers
.get("/users/:id", ({ params }) => {
  const user = findUser(params.id);
  if (!user) {
    throw new NotFoundError("User");
  }
  return user;
})
```

#### UnauthorizedError (401 Unauthorized)

Used when authentication is required:

```typescript
import { UnauthorizedError } from "@/errors";

// Default message
throw new UnauthorizedError();

// Custom message
throw new UnauthorizedError("Invalid credentials");
throw new UnauthorizedError("Token expired");
```

**Usage Examples:**
```typescript
// Authentication middleware
const authMiddleware = new Elysia({ name: "auth" })
  .derive(({ headers }) => {
    const token = headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new UnauthorizedError("Authentication required");
    }
    
    const user = verifyToken(token);
    if (!user) {
      throw new UnauthorizedError("Invalid token");
    }
    
    return { user };
  });
```

#### ForbiddenError (403 Forbidden)

Used when the user is authenticated but lacks permission:

```typescript
import { ForbiddenError } from "@/errors";

// Default message
throw new ForbiddenError();

// Custom message
throw new ForbiddenError("Admin access required");
throw new ForbiddenError("Insufficient permissions");
```

**Usage Examples:**
```typescript
// Authorization checks
.get("/admin/users", ({ user }) => {
  if (user.role !== "admin") {
    throw new ForbiddenError("Admin access required");
  }
  return getUsers();
})

// Resource-specific permissions
.delete("/users/:id", ({ params, user }) => {
  if (user.id !== params.id && user.role !== "admin") {
    throw new ForbiddenError("Cannot delete other users");
  }
  return deleteUser(params.id);
})
```

#### ConflictError (409 Conflict)

Used when there's a conflict with the current state:

```typescript
import { ConflictError } from "@/errors";

// Resource conflicts
throw new ConflictError("User already exists");
throw new ConflictError("Email already registered");
throw new ConflictError("Resource is locked");
```

**Usage Examples:**
```typescript
// Duplicate resource creation
.post("/users", ({ body }) => {
  if (await userExists(body.email)) {
    throw new ConflictError("User already exists");
  }
  return createUser(body);
})

// State conflicts
.patch("/orders/:id/cancel", ({ params }) => {
  const order = await getOrder(params.id);
  if (order.status === "cancelled") {
    throw new ConflictError("Order already cancelled");
  }
  return cancelOrder(params.id);
})
```

## Error Handling Patterns

### 1. Throwing Errors in Route Handlers

```typescript
import { NotFoundError, ValidationError } from "@/errors";

.get("/users/:id", ({ params }) => {
  const user = findUser(params.id);
  if (!user) {
    throw new NotFoundError("User");
  }
  return user;
})

.post("/users", ({ body }) => {
  if (!body.email) {
    throw new ValidationError("Email is required", "email");
  }
  return createUser(body);
})
```

### 2. Throwing Errors in Service Methods

```typescript
import { NotFoundError, ConflictError } from "@/errors";

class UserService {
  async getUserById(id: string) {
    const user = await this.db.findUser(id);
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  }

  async createUser(userData: CreateUserData) {
    if (await this.userExists(userData.email)) {
      throw new ConflictError("User already exists");
    }
    return await this.db.createUser(userData);
  }
}
```

### 3. Error Handling in Middleware

```typescript
import { UnauthorizedError, ForbiddenError } from "@/errors";

const authMiddleware = new Elysia({ name: "auth" })
  .derive(({ headers }) => {
    const token = headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new UnauthorizedError("Authentication required");
    }
    
    const user = verifyToken(token);
    if (!user) {
      throw new UnauthorizedError("Invalid token");
    }
    
    return { user };
  });

const adminMiddleware = new Elysia({ name: "admin" })
  .derive(({ user }) => {
    if (user.role !== "admin") {
      throw new ForbiddenError("Admin access required");
    }
    return { user };
  });
```

## Automatic Error Handling

The error handler plugin automatically catches these custom errors and converts them to appropriate HTTP responses:

```typescript
// These errors are automatically handled:
throw new ValidationError("Invalid input");        // → 422 Unprocessable Entity
throw new NotFoundError("User");                   // → 404 Not Found
throw new UnauthorizedError("Auth required");     // → 401 Unauthorized
throw new ForbiddenError("Access denied");        // → 403 Forbidden
throw new ConflictError("Resource conflict");     // → 409 Conflict
```

## Best Practices

### 1. Use Specific Error Types

```typescript
// ✅ Good: Specific error types
if (!user) {
  throw new NotFoundError("User");
}

if (!isAuthenticated) {
  throw new UnauthorizedError("Authentication required");
}

// ❌ Bad: Generic errors
if (!user) {
  throw new Error("User not found");
}
```

### 2. Provide Meaningful Messages

```typescript
// ✅ Good: Descriptive messages
throw new ValidationError("Email must be a valid email address", "email");
throw new NotFoundError("User with ID 123 not found");

// ❌ Bad: Generic messages
throw new ValidationError("Invalid input");
throw new NotFoundError("Not found");
```

### 3. Use Field-Specific Validation Errors

```typescript
// ✅ Good: Field-specific errors
if (!email) {
  throw new ValidationError("Email is required", "email");
}

if (!isValidEmail(email)) {
  throw new ValidationError("Invalid email format", "email");
}

// ❌ Bad: Generic validation errors
if (!email || !isValidEmail(email)) {
  throw new ValidationError("Email is invalid");
}
```

### 4. Handle Errors at the Right Level

```typescript
// ✅ Good: Handle in service layer
class UserService {
  async getUserById(id: string) {
    const user = await this.db.findUser(id);
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  }
}

// Route handler just calls service
.get("/users/:id", ({ params }) => {
  return userService.getUserById(params.id);
})
```

### 5. Use Error Classes Consistently

```typescript
// ✅ Good: Consistent error handling
const processUser = (userData: UserData) => {
  if (!userData.email) {
    throw new ValidationError("Email is required", "email");
  }
  
  if (userExists(userData.email)) {
    throw new ConflictError("User already exists");
  }
  
  return createUser(userData);
};
```

## Error Response Format

All custom errors are automatically converted to consistent API responses:

```typescript
// ValidationError response
{
  "success": false,
  "error": "Email is required"
}

// NotFoundError response
{
  "success": false,
  "error": "User not found"
}

// UnauthorizedError response
{
  "success": false,
  "error": "Authentication required"
}
```

## Testing Error Handling

```typescript
import { NotFoundError, ValidationError } from "@/errors";

describe("User Service", () => {
  it("should throw NotFoundError when user not found", async () => {
    await expect(userService.getUserById("nonexistent"))
      .rejects
      .toThrow(NotFoundError);
  });

  it("should throw ValidationError for invalid email", async () => {
    await expect(userService.createUser({ email: "invalid" }))
      .rejects
      .toThrow(ValidationError);
  });
});
```

## File Structure

```
src/
├── errors/
│   ├── index.ts          # Barrel export for all errors
│   └── http.error.ts     # HTTP-related error classes
├── plugins/
│   └── error-handler.plugin.ts  # Error handling middleware
└── docs/
    └── errors.md         # This documentation
```

## Future Enhancements

The error system can be extended with additional error types:

- **Database errors** - Connection, query, transaction errors
- **External service errors** - API, third-party service errors
- **Business logic errors** - Domain-specific validation errors
- **Rate limiting errors** - Too many requests, quota exceeded

This provides a scalable foundation for comprehensive error handling throughout the application.