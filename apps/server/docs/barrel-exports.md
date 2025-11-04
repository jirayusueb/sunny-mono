# Barrel Exports Documentation

This document explains the barrel export system used in the server application to provide clean, simplified imports.

## Overview

Barrel exports allow you to import multiple related modules from a single entry point, making imports cleaner and more maintainable.

## Available Barrel Exports

### `@/consts` - Constants

Import all constants from a single location:

```typescript
import { StatusCodes } from "@/consts";
```

**Available exports:**
- `StatusCodes` - HTTP status code constants

**Example usage:**
```typescript
import { StatusCodes } from "@/consts";

// Use in route handlers
.get("/users", ({ set }) => {
  set.status = StatusCodes.OK;
  return Response.ok(users);
})
```

### `@/utils` - Utility Functions

Import all utility functions from a single location:

```typescript
import { Response, ok, err, Result } from "@/utils";
```

**Available exports:**
- `Response` - API response helper object
- `ok` - Result pattern success function
- `err` - Result pattern error function  
- `Result` - Result pattern type
- `generateId` - UUID generation function

### `@/errors` - Error Classes

Import all error classes from a single location:

```typescript
import { ValidationError, NotFoundError, UnauthorizedError } from "@/errors";
```

**Available exports:**
- `ValidationError` - Input validation errors (422)
- `NotFoundError` - Resource not found errors (404)
- `UnauthorizedError` - Authentication errors (401)
- `ForbiddenError` - Authorization errors (403)
- `ConflictError` - Resource conflict errors (409)

**Example usage:**
```typescript
import { Response, ok, err, Result } from "@/utils";

// API responses
return Response.ok(data);
return Response.badRequest("Invalid input");

// Result pattern
const result: Result<User, Error> = ok(user);
if (result.isOk()) {
  return Response.ok(result.value);
}
```

## Import Patterns

### Single Import
```typescript
import { StatusCodes } from "@/consts";
import { Response } from "@/utils";
```

### Multiple Imports
```typescript
import { StatusCodes } from "@/consts";
import { Response, ok, err, Result } from "@/utils";
```

### Destructured Imports
```typescript
import { StatusCodes } from "@/consts";
import {
  Response,
  ok,
  err,
  Result,
  generateId
} from "@/utils";
```

## Benefits of Barrel Exports

### 1. **Cleaner Imports**
```typescript
// ❌ Before: Long, specific paths
import { StatusCodes } from "@/consts/http-status.const";
import { Response } from "@/utils/response";
import { ok, err } from "@/utils/result";

// ✅ After: Clean, short paths
import { StatusCodes } from "@/consts";
import { Response, ok, err } from "@/utils";
```

### 2. **Easier Refactoring**
- Move files without updating imports
- Rename directories without breaking imports
- Reorganize code structure easily

### 3. **Better Developer Experience**
- Autocomplete shows all available exports
- IDE can provide better IntelliSense
- Easier to discover available utilities

### 4. **Consistent Import Patterns**
- All imports follow the same pattern
- Easier to remember import paths
- Reduces cognitive load

## File Structure

```
src/
├── consts/
│   ├── index.ts          # Barrel export for constants
│   └── http-status.const.ts
├── utils/
│   ├── index.ts          # Barrel export for utilities
│   ├── response.ts
│   ├── result.ts
│   └── uuid.ts
└── docs/
    └── barrel-exports.md # This documentation
```

## Barrel Export Implementation

### Constants Barrel (`@/consts/index.ts`)
```typescript
export * from "./http-status.const";
```

### Utils Barrel (`@/utils/index.ts`)
```typescript
export * from "./response";
export * from "./result";
export * from "./uuid";
```

## Migration Guide

### From Specific Imports to Barrel Exports

**Before:**
```typescript
import { StatusCodes } from "@/consts/http-status.const";
import { Response } from "@/utils/response";
import { ok, err } from "@/utils/result";
```

**After:**
```typescript
import { StatusCodes } from "@/consts";
import { Response, ok, err } from "@/utils";
```

### Step-by-Step Migration

1. **Update consts imports:**
   ```typescript
   // Change this:
   import { StatusCodes } from "@/consts/http-status.const";

   // To this:
   import { StatusCodes } from "@/consts";
   ```

2. **Update utils imports:**
   ```typescript
   // Change this:
   import { Response } from "@/utils/response";
   import { ok, err } from "@/utils/result";

   // To this:
   import { Response, ok, err } from "@/utils";
   ```

3. **Combine multiple imports:**
   ```typescript
   // Instead of multiple import lines:
   import { Response } from "@/utils/response";
   import { ok, err } from "@/utils/result";

   // Use single import:
   import { Response, ok, err } from "@/utils";
   ```

## Best Practices

### 1. **Use Barrel Exports for Related Modules**
```typescript
// ✅ Good: Related utilities
import { Response, ok, err, Result } from "@/utils";

// ❌ Bad: Unrelated imports
import { Response } from "@/utils";
import { StatusCodes } from "@/consts";
import { SomeOtherThing } from "@/somewhere-else";
```

### 2. **Group Imports by Source**
```typescript
// ✅ Good: Grouped by barrel export
import { StatusCodes } from "@/consts";
import { Response, ok, err, Result } from "@/utils";
import { Elysia } from "elysia";

// ❌ Bad: Mixed sources
import { StatusCodes } from "@/consts";
import { Elysia } from "elysia";
import { Response } from "@/utils";
```

### 3. **Use Destructuring for Multiple Exports**
```typescript
// ✅ Good: Clear destructuring
import {
  Response,
  ok,
  err,
  Result,
} from "@/utils";

// ❌ Bad: Single import for multiple uses
import * as Utils from "@/utils";
```

### 4. **Keep Imports Organized**
```typescript
// ✅ Good: Organized imports
import { Elysia } from "elysia";
import { StatusCodes } from "@/consts";
import { Response, ok, err } from "@/utils";
import { routers } from "@/routers";

// ❌ Bad: Random order
import { Response } from "@/utils";
import { Elysia } from "elysia";
import { routers } from "@/routers";
import { StatusCodes } from "@/consts";
```

## Type Safety

Barrel exports maintain full type safety:

```typescript
import { Response, Result } from "@/utils";

// TypeScript knows the exact types
const response: ApiResponse<User> = Response.ok(user);
const result: Result<User, Error> = ok(user);
```

## Performance Considerations

- Barrel exports have minimal performance impact
- Tree-shaking still works correctly
- No runtime overhead
- Better for bundle optimization

## Troubleshooting

### Common Issues

1. **Circular Dependencies**
   ```typescript
   // ❌ Avoid: Circular imports
   // file-a.ts
   import { something } from "./file-b";

   // file-b.ts
   import { something } from "./file-a";
   ```

2. **Missing Exports**
   ```typescript
   // ❌ Error: Export not found
   import { NonExistent } from "@/utils";

   // ✅ Solution: Check barrel export file
   // Add to @/utils/index.ts:
   export * from "./your-module";
   ```

3. **Import Resolution**
   ```typescript
   // ❌ Error: Module not found
   import { StatusCodes } from "@/consts/http-status.const";

   // ✅ Solution: Use barrel export
   import { StatusCodes } from "@/consts";
   ```

## Future Enhancements

The barrel export system can be extended to include:

- **Services barrel** (`@/services`)
- **Types barrel** (`@/types`)
- **Schemas barrel** (`@/schemas`)
- **Middleware barrel** (`@/middleware`)

This provides a scalable pattern for organizing and importing code throughout the application.
