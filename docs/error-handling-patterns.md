# Error Handling Patterns Documentation

This document outlines the comprehensive error handling patterns used throughout the project to ensure robust, user-friendly error management across both frontend and backend.

## Overview

The project implements a multi-layered error handling strategy that combines:

- **Result Pattern** - Type-safe error handling without exceptions
- **Error Boundaries** - React error boundary components
- **Global Error Handling** - Server-side error interception
- **User-Friendly Messages** - Clear error communication
- **Logging and Monitoring** - Comprehensive error tracking

## Core Principles

### 1. Explicit Error Handling
All errors are explicit and part of the type system - no hidden exceptions.

### 2. User-Friendly Messages
Errors are translated into user-friendly messages with actionable guidance.

### 3. Graceful Degradation
The application continues to function even when errors occur.

### 4. Comprehensive Logging
All errors are logged for debugging and monitoring purposes.

## Result Pattern Implementation

### Core Result Type
```typescript
// shared/utils/result.ts
export type Result<T, E = Error> = Ok<T> | Err<E>;

export interface Ok<T> {
  success: true;
  data: T;
}

export interface Err<E> {
  success: false;
  error: E;
}

export function ok<T>(data: T): Ok<T> {
  return { success: true, data };
}

export function err<E>(error: E): Err<E> {
  return { success: false, error };
}
```

### Result Pattern Usage
```typescript
// Service layer with Result pattern
async function fetchUser(id: string): Promise<Result<User, DatabaseError>> {
  try {
    const user = await db.select().from(userTable).where(eq(userTable.id, id));

    if (!user[0]) {
      return err(new NotFoundError(`User ${id} not found`));
    }

    return ok(user[0]);
  } catch (error) {
    return err(new DatabaseError("Failed to fetch user", error));
  }
}

// Controller layer handling Results
async function getUser(req: Request): Promise<Response> {
  const result = await userService.fetchUser(req.params.id);

  if (result.success) {
    return Response.json({ user: result.data });
  } else {
    return Response.json(
      { error: result.error.message },
      { status: result.error.statusCode }
    );
  }
}
```

## Frontend Error Handling

### Error Boundary Pattern
```typescript
// components/error-boundary.tsx
import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    // Log error to monitoring service
    this.props.onError?.(error, errorInfo);

    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
```

### Query Error Handling
```typescript
// hooks/use-user.ts
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    onError: (error: Error) => {
      console.error("Failed to fetch user:", error);
      toast.error("Failed to load user data. Please try again.");
    },
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error.status === 404) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
  });
}
```

### Form Error Handling
```typescript
// components/forms/user-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function UserForm({ onSubmit }: UserFormProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const handleSubmit = async (data: UserFormData) => {
    try {
      await onSubmit(data);
      toast.success("User saved successfully");
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error("Failed to save user. Please try again.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## Backend Error Handling

### Global Error Interceptor
```typescript
// shared/interceptors/error/error.interceptor.ts
import { Elysia } from "elysia";
import { logger } from "@/shared/integrations/logger";

export const errorInterceptor = new Elysia({ name: "error" })
  .onError(({ error, set, request }) => {
    // Log error details
    logger.error("Server error occurred", {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });

    // Handle different error types
    if (error instanceof ValidationError) {
      set.status = 400;
      return {
        success: false,
        error: "Validation failed",
        details: error.details,
      };
    }

    if (error instanceof DatabaseError) {
      set.status = 500;
      return {
        success: false,
        error: "Database error occurred",
      };
    }

    if (error instanceof AuthenticationError) {
      set.status = 401;
      return {
        success: false,
        error: "Authentication required",
      };
    }

    if (error instanceof AuthorizationError) {
      set.status = 403;
      return {
        success: false,
        error: "Access denied",
      };
    }

    // Generic error response
    set.status = 500;
    return {
      success: false,
      error: "Internal server error",
    };
  });
```

### Custom Error Classes
```typescript
// shared/errors/http.error.ts
export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class ValidationError extends HttpError {
  constructor(message: string, public details: Record<string, string[]>) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends HttpError {
  constructor(message: string, public originalError?: Error) {
    super(message, 500);
    this.name = "DatabaseError";
  }
}

export class AuthenticationError extends HttpError {
  constructor(message: string = "Authentication required") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends HttpError {
  constructor(message: string = "Access denied") {
    super(message, 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends HttpError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}
```

### Service Layer Error Handling
```typescript
// services/user.service.ts
import { Result, ok, err } from "@/shared/utils/result";
import { DatabaseError, NotFoundError } from "@/shared/errors/http.error";

export class UserService {
  async getUser(id: string): Promise<Result<User, HttpError>> {
    try {
      const user = await this.db.select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .limit(1);

      if (!user[0]) {
        return err(new NotFoundError("User"));
      }

      return ok(user[0]);
    } catch (error) {
      return err(new DatabaseError("Failed to fetch user", error as Error));
    }
  }

  async createUser(userData: CreateUserData): Promise<Result<User, HttpError>> {
    try {
      // Validate input
      const validationResult = this.validateUserData(userData);
      if (!validationResult.isValid) {
        return err(new ValidationError("Invalid user data", validationResult.errors));
      }

      // Check if user already exists
      const existingUser = await this.db.select()
        .from(userTable)
        .where(eq(userTable.email, userData.email))
        .limit(1);

      if (existingUser[0]) {
        return err(new ValidationError("User already exists", {
          email: ["Email address is already in use"]
        }));
      }

      // Create user
      const [newUser] = await this.db.insert(userTable)
        .values(userData)
        .returning();

      return ok(newUser);
    } catch (error) {
      return err(new DatabaseError("Failed to create user", error as Error));
    }
  }
}
```

## API Error Response Patterns

### Standardized Error Response
```typescript
// shared/utils/response.ts
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
  timestamp: string;
  path: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export function createErrorResponse(
  error: string,
  details?: unknown,
  path?: string
): ApiErrorResponse {
  return {
    success: false,
    error,
    details,
    timestamp: new Date().toISOString(),
    path: path || "",
  };
}

export function createSuccessResponse<T>(
  data: T,
  path?: string
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    path: path || "",
  };
}
```

### Router Error Handling
```typescript
// routers/user.router.ts
import { Elysia } from "elysia";
import { UserService } from "@/services/user.service";
import { createErrorResponse, createSuccessResponse } from "@/shared/utils/response";

export const userRouter = new Elysia({ prefix: "/users" })
  .get("/:id", async ({ params, set }) => {
    const result = await userService.getUser(params.id);

    if (result.success) {
      set.status = 200;
      return createSuccessResponse(result.data, `/users/${params.id}`);
    } else {
      set.status = result.error.statusCode;
      return createErrorResponse(
        result.error.message,
        result.error.details,
        `/users/${params.id}`
      );
    }
  })
  .post("/", async ({ body, set }) => {
    const result = await userService.createUser(body);

    if (result.success) {
      set.status = 201;
      return createSuccessResponse(result.data, "/users");
    } else {
      set.status = result.error.statusCode;
      return createErrorResponse(
        result.error.message,
        result.error.details,
        "/users"
      );
    }
  });
```

## Validation Error Handling

### Input Validation
```typescript
// shared/utils/validation.ts
import { z } from "zod";

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Result<T, ValidationError> {
  try {
    const validatedData = schema.parse(data);
    return ok(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};

      error.errors.forEach((err) => {
        const field = err.path.join(".");
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(err.message);
      });

      return err(new ValidationError("Validation failed", fieldErrors));
    }

    return err(new ValidationError("Invalid input format"));
  }
}
```

### Form Validation Hook
```typescript
// hooks/use-form-validation.ts
import { useState, useCallback } from "react";
import { z } from "zod";

export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const validate = useCallback((data: unknown) => {
    try {
      const validatedData = schema.parse(data);
      setErrors({});
      return { isValid: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string[]> = {};

        error.errors.forEach((err) => {
          const field = err.path.join(".");
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field].push(err.message);
        });

        setErrors(fieldErrors);
        return { isValid: false, errors: fieldErrors };
      }

      return { isValid: false };
    }
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    validate,
    errors,
    clearErrors,
  };
}
```

## Logging and Monitoring

### Error Logging
```typescript
// shared/integrations/logger/logger.ts
import { logger } from "pino";

export const logger = logger({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export function logError(error: Error, context?: Record<string, unknown>) {
  logger.error({
    error: error.message,
    stack: error.stack,
    ...context,
  });
}

export function logApiError(
  error: Error,
  request: Request,
  response?: Response
) {
  logger.error({
    error: error.message,
    stack: error.stack,
    method: request.method,
    url: request.url,
    statusCode: response?.status,
    timestamp: new Date().toISOString(),
  });
}
```

### Error Monitoring Integration
```typescript
// shared/integrations/monitoring/error-monitoring.ts
export class ErrorMonitoring {
  static captureException(error: Error, context?: Record<string, unknown>) {
    // Integration with monitoring service (e.g., Sentry, DataDog)
    console.error("Error captured:", {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  static captureMessage(message: string, level: "info" | "warning" | "error") {
    console.log(`[${level.toUpperCase()}] ${message}`, {
      timestamp: new Date().toISOString(),
    });
  }
}
```

## Best Practices

### 1. Error Message Guidelines
- Use clear, actionable error messages
- Avoid technical jargon in user-facing messages
- Provide specific guidance on how to resolve errors
- Include relevant context when helpful

### 2. Error Recovery
- Implement retry mechanisms for transient errors
- Provide fallback UI for critical failures
- Allow users to retry failed operations
- Gracefully degrade functionality when possible

### 3. Error Logging
- Log all errors with sufficient context
- Include user ID, request details, and stack traces
- Use structured logging for better analysis
- Implement log rotation and retention policies

### 4. Testing Error Scenarios
- Test all error paths and edge cases
- Mock external dependencies to simulate failures
- Verify error messages are user-friendly
- Ensure error boundaries work correctly

### 5. Performance Considerations
- Don't let error handling impact performance
- Use async error handling where appropriate
- Implement circuit breakers for external services
- Monitor error rates and response times

This comprehensive error handling system ensures that errors are managed gracefully throughout the application, providing a better user experience while maintaining system reliability and observability.
