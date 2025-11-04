# HTTP Status Constants Usage Guide

This guide demonstrates how to use the HTTP status constants throughout your Elysia.js server application.

## Importing Status Constants

```typescript
import { StatusCodes } from "@/consts";
```

> **Note:** This uses the barrel export system. See [Barrel Exports Documentation](./barrel-exports.md) for more details.

## Basic Usage in Routes

### Success Responses

```typescript
// 200 OK
.get("/users", ({ set }) => {
  set.status = StatusCodes.OK;
  return Response.ok(users);
})

// 201 Created
.post("/users", ({ body, set }) => {
  const user = createUser(body);
  set.status = StatusCodes.CREATED;
  return Response.ok(user, "User created successfully");
})

// 204 No Content
.delete("/users/:id", ({ params, set }) => {
  deleteUser(params.id);
  set.status = StatusCodes.NO_CONTENT;
  return Response.ok({ message: "User deleted" });
})
```

### Error Responses

```typescript
// 400 Bad Request
.post("/users", ({ body, set }) => {
  if (!body.email) {
    set.status = StatusCodes.BAD_REQUEST;
    return Response.badRequest("Email is required");
  }
})

// 401 Unauthorized
.get("/profile", ({ headers, set }) => {
  if (!isAuthenticated(headers)) {
    set.status = StatusCodes.UNAUTHORIZED;
    return Response.unauthorized("Authentication required");
  }
})

// 403 Forbidden
.delete("/admin/users/:id", ({ user, set }) => {
  if (user.role !== "admin") {
    set.status = StatusCodes.FORBIDDEN;
    return Response.forbidden("Admin access required");
  }
})

// 404 Not Found
.get("/users/:id", ({ params, set }) => {
  const user = findUser(params.id);
  if (!user) {
    set.status = StatusCodes.NOT_FOUND;
    return Response.notFound("User not found");
  }
})

// 409 Conflict
.post("/users", ({ body, set }) => {
  if (userExists(body.email)) {
    set.status = StatusCodes.CONFLICT;
    return Response.conflict("User already exists");
  }
})

// 422 Unprocessable Entity
.post("/users", ({ body, set }) => {
  const validation = validateUser(body);
  if (!validation.isValid) {
    set.status = StatusCodes.UNPROCESSABLE_ENTITY;
    return Response.unprocessableEntity(validation.errors);
  }
})

// 429 Too Many Requests
.get("/api/data", ({ set }) => {
  if (isRateLimited()) {
    set.status = StatusCodes.TOO_MANY_REQUESTS;
    return Response.tooManyRequests("Rate limit exceeded");
  }
})

// 500 Internal Server Error
.get("/users", ({ set }) => {
  try {
    const users = await fetchUsers();
    return Response.ok(users);
  } catch (error) {
    set.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Response.err("Internal server error");
  }
})
```

## Using with Custom Error Classes

```typescript
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError
} from "@/plugins/error-handler.plugin";

// In your route handlers
.get("/users/:id", ({ params }) => {
  const user = findUser(params.id);
  if (!user) {
    throw new NotFoundError("User");
  }
  return user;
})

.post("/users", ({ body }) => {
  const validation = validateUser(body);
  if (!validation.isValid) {
    throw new ValidationError("Invalid user data", "email");
  }
  return createUser(body);
})
```

## Common Status Code Patterns

### CRUD Operations

```typescript
// GET - Retrieve resource
.get("/users/:id", ({ params, set }) => {
  const user = findUser(params.id);
  if (!user) {
    set.status = StatusCodes.NOT_FOUND;
    return Response.notFound("User not found");
  }
  set.status = StatusCodes.OK;
  return Response.ok(user);
})

// POST - Create resource
.post("/users", ({ body, set }) => {
  if (userExists(body.email)) {
    set.status = StatusCodes.CONFLICT;
    return Response.conflict("User already exists");
  }
  const user = createUser(body);
  set.status = StatusCodes.CREATED;
  return Response.ok(user, "User created successfully");
})

// PUT - Update resource
.put("/users/:id", ({ params, body, set }) => {
  const user = findUser(params.id);
  if (!user) {
    set.status = StatusCodes.NOT_FOUND;
    return Response.notFound("User not found");
  }
  const updatedUser = updateUser(params.id, body);
  set.status = StatusCodes.OK;
  return Response.ok(updatedUser, "User updated successfully");
})

// DELETE - Remove resource
.delete("/users/:id", ({ params, set }) => {
  const user = findUser(params.id);
  if (!user) {
    set.status = StatusCodes.NOT_FOUND;
    return Response.notFound("User not found");
  }
  deleteUser(params.id);
  set.status = StatusCodes.NO_CONTENT;
  return Response.ok({ message: "User deleted successfully" });
})
```

### Authentication & Authorization

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

// Authorization check
.get("/admin/users", ({ user, set }) => {
  if (user.role !== "admin") {
    set.status = StatusCodes.FORBIDDEN;
    return Response.forbidden("Admin access required");
  }
  // Admin logic here
})
```

### Validation Patterns

```typescript
// Input validation
.post("/users", ({ body, set }) => {
  const validation = validateUserInput(body);
  if (!validation.isValid) {
    set.status = StatusCodes.UNPROCESSABLE_ENTITY;
    return Response.unprocessableEntity(validation.errors);
  }
  // Process valid data
})

// Query parameter validation
.get("/users", ({ query, set }) => {
  const { page, limit } = query;
  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    set.status = StatusCodes.BAD_REQUEST;
    return Response.badRequest("Invalid page parameter");
  }
  // Process valid query
})
```

## Best Practices

### 1. Always Set Status Codes Explicitly

```typescript
// ✅ Good
.get("/users", ({ set }) => {
  set.status = StatusCodes.OK;
  return Response.ok(users);
})

// ❌ Bad - Let Elysia default to 200
.get("/users", () => {
  return Response.ok(users);
})
```

### 2. Use Appropriate Status Codes

```typescript
// ✅ Good - Use 422 for validation errors
.post("/users", ({ body, set }) => {
  if (!body.email) {
    set.status = StatusCodes.UNPROCESSABLE_ENTITY;
    return Response.unprocessableEntity("Email is required");
  }
})

// ❌ Bad - Use 400 for validation errors
.post("/users", ({ body, set }) => {
  if (!body.email) {
    set.status = StatusCodes.BAD_REQUEST;
    return Response.badRequest("Email is required");
  }
})
```

### 3. Consistent Error Handling

```typescript
// ✅ Good - Use custom error classes
.get("/users/:id", ({ params }) => {
  const user = findUser(params.id);
  if (!user) {
    throw new NotFoundError("User");
  }
  return user;
})

// ❌ Bad - Inconsistent error handling
.get("/users/:id", ({ params, set }) => {
  const user = findUser(params.id);
  if (!user) {
    set.status = StatusCodes.NOT_FOUND;
    return { error: "User not found" };
  }
  return user;
})
```

### 4. Use Helper Methods

```typescript
// ✅ Good - Use Response helpers
.get("/users", ({ set }) => {
  set.status = StatusCodes.OK;
  return Response.ok(users);
})

// ❌ Bad - Manual response construction
.get("/users", ({ set }) => {
  set.status = StatusCodes.OK;
  return {
    success: true,
    data: users
  };
})
```

## Available Status Codes

The `StatusCodes` object includes all standard HTTP status codes:

- **1xx Informational**: `CONTINUE`, `SWITCHING_PROTOCOLS`, etc.
- **2xx Success**: `OK`, `CREATED`, `NO_CONTENT`, etc.
- **3xx Redirection**: `MOVED_PERMANENTLY`, `NOT_MODIFIED`, etc.
- **4xx Client Error**: `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, etc.
- **5xx Server Error**: `INTERNAL_SERVER_ERROR`, `BAD_GATEWAY`, `SERVICE_UNAVAILABLE`, etc.

Each status code includes comprehensive documentation and follows RFC standards.
