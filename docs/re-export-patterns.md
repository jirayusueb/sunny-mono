# Re-export Patterns Documentation

This document outlines the re-export patterns used throughout the project to maintain clean imports and organized code structure.

## Overview

Re-export patterns (also known as barrel exports) are a key organizational strategy that allows us to:
- Create clean, consistent import paths
- Hide internal file structure from consumers
- Provide a single entry point for modules
- Enable easier refactoring and reorganization

## Core Principles

### 1. One Entry Point Per Directory
Every directory should have an `index.ts` file that serves as the public API for that module.

### 2. Consistent Export Patterns
Use consistent patterns for different types of exports:
- **Default exports**: Use `export { default as Name }` pattern
- **Named exports**: Use `export { Name }` pattern
- **Re-exports**: Use `export * from` for multiple exports

### 3. Clear Naming Conventions
- Use descriptive names that match the file purpose
- Maintain consistency across similar modules
- Avoid abbreviations and unclear names

## Pattern Examples

### Component Re-exports

#### Basic Component Pattern
```typescript
// components/index.ts
export { default as Button } from "./button";
export { default as Card } from "./card";
export { default as Input } from "./input";
export { default as Modal } from "./modal";
```

#### UI Component Pattern
```typescript
// components/ui/index.ts
export { Button } from "./button";
export { Card } from "./card";
export { Input } from "./input";
export { Select } from "./select";
export { Textarea } from "./textarea";
```

#### Feature Component Pattern
```typescript
// containers/login/components/index.ts
export { default as SignInForm } from "./sign-in-form";
export { default as SignUpForm } from "./sign-up-form";
export { default as AuthProvider } from "./auth-provider";
```

### Hook Re-exports

#### Global Hooks Pattern
```typescript
// hooks/index.ts
export { default as useMobile } from "./use-mobile";
export { default as useLocalStorage } from "./use-local-storage";
export { default as useDebounce } from "./use-debounce";
```

#### Feature Hooks Pattern
```typescript
// features/auth/hooks/index.ts
export { default as useSignIn } from "./use-sign-in";
export { default as useSignOut } from "./use-sign-out";
export { default as useSignUp } from "./use-sign-up";
export { default as useAuth } from "./use-auth";
```

#### Common Hooks Pattern
```typescript
// features/common/hooks/index.ts
export { default as useHealthCheck } from "./use-health-check";
export { default as useApiCall } from "./use-api-call";
```

### Utility Re-exports

#### Library Utilities Pattern
```typescript
// lib/index.ts
export * from "./auth-client";
export * from "./client";
export * from "./query-client";
export * from "./utils";
```

#### Container Utilities Pattern
```typescript
// containers/home/utils/index.ts
export { formatUserData } from "./format-user-data";
export { validateInput } from "./validate-input";
export { generateId } from "./generate-id";
```

### Constants Re-exports

#### Feature Constants Pattern
```typescript
// features/consts/index.ts
export { HEALTH_KEY } from "./health-key.const";
export { API_ENDPOINTS } from "./api-endpoints.const";
export { VALIDATION_RULES } from "./validation-rules.const";
```

## Advanced Patterns

### Conditional Re-exports
```typescript
// lib/index.ts
export * from "./auth-client";
export * from "./client";
export * from "./query-client";
export * from "./utils";

// Development-only exports
if (process.env.NODE_ENV === "development") {
  export { devTools } from "./dev-tools";
  export { mockData } from "./mock-data";
}
```

### Type and Value Separation
```typescript
// types/index.ts
export type { User, CreateUserData, UpdateUserData } from "./user.types";
export type { Session, SessionData } from "./session.types";
export type { ApiResponse, ApiError } from "./api.types";

// services/index.ts
export { UserService } from "./user.service";
export { SessionService } from "./session.service";
export { ApiService } from "./api.service";
```

### Nested Barrel Files
```typescript
// components/index.ts
export * from "./ui";
export * from "./forms";
export { Header } from "./header";
export { Footer } from "./footer";

// components/ui/index.ts
export { Button } from "./button";
export { Card } from "./card";
export { Input } from "./input";

// components/forms/index.ts
export { LoginForm } from "./login-form";
export { SignupForm } from "./signup-form";
export { ContactForm } from "./contact-form";
```

## Import Usage Patterns

### Clean Component Imports
```typescript
// ✅ Good: Clean, organized imports
import { Button, Card, Input } from "@/components";
import { useMobile, useLocalStorage } from "@/hooks";
import { authClient, queryClient } from "@/lib";

// ❌ Bad: Direct file imports
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { useMobile } from "@/hooks/use-mobile";
```

### Feature-Specific Imports
```typescript
// ✅ Good: Feature-specific imports
import { SignInForm, SignUpForm } from "@/containers/login/components";
import { useSignIn, useSignOut } from "@/features/auth/hooks";
import { useHealthCheck } from "@/features/common/hooks";

// ❌ Bad: Mixed import sources
import { SignInForm } from "@/containers/login/components/sign-in-form";
import { useSignIn } from "@/features/auth/hooks/use-sign-in";
```

### Type Imports
```typescript
// ✅ Good: Separate type imports
import type { User, CreateUserData } from "@/types";
import { UserService } from "@/services";
import { Button } from "@/components";

// ❌ Bad: Mixed type and value imports
import { User, UserService, Button } from "@/types";
```

## Best Practices

### 1. Consistent Export Patterns
```typescript
// ✅ Good: Consistent pattern
export { default as ComponentName } from "./component-name";
export { default as HookName } from "./hook-name";
export { default as UtilName } from "./util-name";

// ❌ Bad: Inconsistent patterns
export { default as ComponentName } from "./component-name";
export { HookName } from "./hook-name";
export { default as UtilName } from "./util-name";
```

### 2. Clear Naming
```typescript
// ✅ Good: Clear, descriptive names
export { default as useUserAuthentication } from "./use-user-authentication";
export { default as useDataValidation } from "./use-data-validation";

// ❌ Bad: Unclear abbreviations
export { default as useAuth } from "./use-auth";
export { default as useVal } from "./use-val";
```

### 3. Logical Grouping
```typescript
// ✅ Good: Logical grouping with comments
// components/index.ts

// UI Components
export { Button } from "./button";
export { Card } from "./card";
export { Input } from "./input";

// Layout Components
export { Header } from "./header";
export { Footer } from "./footer";
export { Sidebar } from "./sidebar";

// Feature Components
export { UserMenu } from "./user-menu";
export { ThemeToggle } from "./theme-toggle";
```

### 4. Avoid Circular Dependencies
```typescript
// ✅ Good: Clear dependency hierarchy
// components/index.ts
export { Button } from "./button";
export { Card } from "./card";

// containers/home/index.ts
import { Button, Card } from "@/components";
export { HomeContainer } from "./home.container";

// ❌ Bad: Circular dependency
// components/index.ts
export { Button } from "./button";
export { HomeContainer } from "../containers/home";

// containers/home/index.ts
import { Button } from "@/components";
```

## Common Anti-Patterns

### 1. Missing Barrel Files
```typescript
// ❌ Bad: No barrel file
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";

// ✅ Good: With barrel file
import { Button, Card, Input } from "@/components";
```

### 2. Inconsistent Export Patterns
```typescript
// ❌ Bad: Mixed export patterns
export { Button } from "./button";
export { default as Card } from "./card";
export * from "./input";

// ✅ Good: Consistent pattern
export { Button } from "./button";
export { Card } from "./card";
export { Input } from "./input";
```

### 3. Over-exporting
```typescript
// ❌ Bad: Exporting everything
export * from "./button";
export * from "./card";
export * from "./input";
export * from "./internal-utils";
export * from "./debug-helpers";

// ✅ Good: Selective exports
export { Button } from "./button";
export { Card } from "./card";
export { Input } from "./input";
```

### 4. Deep Nesting
```typescript
// ❌ Bad: Too many nested barrel files
import { Button } from "@/components/ui/forms/input/button";

// ✅ Good: Flatter structure
import { Button } from "@/components";
```

## Migration Strategies

### Adding New Exports
1. Add the new export to the appropriate barrel file
2. Update any dependent barrel files
3. Test imports to ensure they work correctly

### Refactoring Exports
1. Update the barrel file with new export patterns
2. Update all import statements that use the old pattern
3. Test thoroughly to ensure no broken imports

### Removing Exports
1. Remove the export from the barrel file
2. Update all files that import the removed export
3. Consider if the functionality should be moved elsewhere

## Tools and Automation

### IDE Support
- Configure your IDE to use barrel exports for auto-imports
- Set up path mapping for clean imports
- Use TypeScript's module resolution for better IntelliSense

### Build Tools
- Ensure build tools understand barrel exports
- Configure bundlers to optimize barrel exports
- Use tree-shaking to remove unused exports

### Testing
- Test that all barrel exports work correctly
- Ensure imports resolve to the correct files
- Verify that refactoring doesn't break imports

This re-export pattern system provides a clean, maintainable way to organize code while keeping imports simple and consistent throughout the project.

