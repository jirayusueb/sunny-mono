# File Structure Documentation

This document outlines the project's file structure, organization patterns, and best practices for maintaining a clean, scalable codebase.

## Project Overview

This is a Next.js monorepo with a clear separation between frontend (web) and backend (server) applications, following modern React and TypeScript patterns.

## Root Structure

```
template-mono/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── server/       # Elysia backend application
├── docs/             # Project documentation
├── package.json      # Root package.json for workspace management
├── turbo.json       # Turborepo configuration
└── tsconfig.json    # Root TypeScript configuration
```

## Frontend Structure (`apps/web/src/`)

### Core Directories

#### `/app/` - Next.js App Router
```
app/
├── layout.tsx        # Root layout component
├── page.tsx          # Home page
├── not-found.tsx     # 404 error page
├── login/
│   └── page.tsx      # Login page
└── favicon.ico       # Site favicon
```

**Purpose**: Contains Next.js App Router pages and layouts
**Pattern**: Each route has its own directory with a `page.tsx` file

#### `/components/` - Reusable UI Components
```
components/
├── index.ts          # Barrel export file
├── loader.tsx        # Loading component
├── mode-toggle.tsx   # Theme toggle component
├── providers.tsx     # Context providers
├── theme-provider.tsx # Theme context provider
├── user-menu.tsx     # User menu component
└── ui/               # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── ... (40+ UI components)
```

**Purpose**: Reusable UI components and design system
**Pattern**: Each component in its own file with barrel exports

#### `/containers/` - Feature Containers
```
containers/
├── home/
│   ├── index.ts              # Barrel export
│   ├── home.container.tsx    # Main container component
│   └── utils/                # Container-specific utilities
└── login/
    ├── index.ts
    ├── login.container.tsx
    ├── components/           # Login-specific components
    │   ├── index.ts
    │   ├── sign-in-form.tsx
    │   └── sign-up-form.tsx
    └── hooks/                # Login-specific hooks
        ├── index.ts
        ├── use-sign-in-form-schema.ts
        └── use-sign-up-form-schema.ts
```

**Purpose**: Feature-specific containers that combine components and logic
**Pattern**: Each feature has its own directory with components, hooks, and utilities

#### `/features/` - Feature Logic
```
features/
├── auth/
│   └── hooks/
│       ├── index.ts
│       ├── use-sign-in.ts
│       ├── use-sign-out.ts
│       └── use-sign-up.ts
├── common/
│   └── hooks/
│       ├── index.ts
│       └── use-health-check.ts
└── consts/
    ├── index.ts
    └── health-key.const.ts
```

**Purpose**: Shared business logic and constants
**Pattern**: Organized by feature with shared utilities in `common/`

#### `/hooks/` - Global Custom Hooks
```
hooks/
├── index.ts          # Barrel export
└── use-mobile.ts     # Mobile detection hook
```

**Purpose**: Global custom hooks used across the application
**Pattern**: One hook per file with barrel exports

#### `/lib/` - Utility Libraries
```
lib/
├── index.ts          # Barrel export
├── auth-client.ts    # Authentication client
├── client.ts         # API client
├── query-client.ts   # React Query client
└── utils.ts          # Utility functions
```

**Purpose**: Core utilities and client configurations
**Pattern**: Each utility in its own file with barrel exports

## Backend Structure (`apps/server/src/`)

### Core Directories

#### `/db/` - Database Layer
```
db/
├── index.ts          # Database connection
├── migrations/       # Database migrations
└── schema/           # Database schemas
    ├── index.ts
    └── auth.ts
```

**Purpose**: Database configuration, schemas, and migrations
**Pattern**: Schema-first approach with Drizzle ORM

#### `/routers/` - API Routes
```
routers/
├── index.ts          # Router registration
├── health/
│   ├── index.ts
│   └── health.router.ts
```

**Purpose**: API route handlers organized by feature
**Pattern**: Each router in its own directory with index file

#### `/shared/` - Shared Backend Code
```
shared/
├── config/           # Configuration files
├── const/            # Constants
├── errors/           # Error classes
├── integrations/     # Third-party integrations
├── interceptors/     # Request/response interceptors
├── lib/              # Utility libraries
├── middleware/       # Express middleware
└── utils/            # Utility functions
```

**Purpose**: Shared backend utilities and configurations
**Pattern**: Organized by concern with clear separation

## File Naming Conventions

### Components
- **PascalCase**: `Button.tsx`, `UserMenu.tsx`
- **kebab-case for directories**: `user-menu/`, `sign-in-form/`

### Hooks
- **camelCase with use prefix**: `useMobile.ts`, `useSignIn.ts`

### Utilities
- **camelCase**: `utils.ts`, `authClient.ts`

### Constants
- **camelCase with .const suffix**: `healthKey.const.ts`

### Types
- **PascalCase with .types suffix**: `user.types.ts`

## Import Patterns

### Barrel Exports
Every directory should have an `index.ts` file for clean imports:

```typescript
// ✅ Good: Clean imports
import { Button, Card } from "@/components";
import { useMobile } from "@/hooks";
import { authClient } from "@/lib";

// ❌ Bad: Direct file imports
import { Button } from "@/components/button";
import { useMobile } from "@/hooks/use-mobile";
```

### Path Aliases
- `@/components` - UI components
- `@/hooks` - Custom hooks
- `@/lib` - Utilities
- `@/features` - Feature logic
- `@/containers` - Feature containers

## Directory Organization Principles

### 1. Feature-Based Organization
Group related files by feature rather than by file type:

```
✅ Good:
features/auth/
├── hooks/
├── components/
└── utils/

❌ Bad:
hooks/
├── auth-hooks/
├── user-hooks/
└── ...
```

### 2. Separation of Concerns
- **Components**: Pure UI components
- **Containers**: Business logic and state management
- **Hooks**: Reusable stateful logic
- **Utils**: Pure functions and utilities

### 3. Scalability
Structure should support growth:
- Easy to add new features
- Clear boundaries between modules
- Minimal coupling between features

## Best Practices

### 1. Consistent File Structure
Every feature directory should follow the same pattern:
```
feature-name/
├── index.ts          # Barrel export
├── feature.container.tsx  # Main component
├── components/       # Feature-specific components
├── hooks/           # Feature-specific hooks
└── utils/           # Feature-specific utilities
```

### 2. Barrel Exports
Always create `index.ts` files for clean imports:
```typescript
// components/index.ts
export { Button } from "./button";
export { Card } from "./card";
export { Input } from "./input";
```

### 3. Type Safety
Use TypeScript interfaces for all props and data structures:
```typescript
interface ComponentProps {
  title: string;
  isVisible: boolean;
  onAction: () => void;
}
```

### 4. Error Boundaries
Implement error boundaries for robust error handling:
```typescript
// components/error-boundary.tsx
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  // Error boundary implementation
}
```

## Migration and Evolution

### Adding New Features
1. Create feature directory in appropriate location
2. Add components, hooks, and utilities
3. Create barrel export file
4. Update main barrel exports if needed

### Refactoring Guidelines
- Maintain backward compatibility during refactors
- Update all imports when moving files
- Update documentation when structure changes
- Test thoroughly after structural changes

## Tools and Automation

### Code Generation
- Use `bunx create-better-t-stack add` for new features
- Leverage Turborepo for build optimization
- Use Biome for consistent formatting

### Development Commands
```bash
bun dev              # Start all apps
bun dev:web          # Start frontend only
bun dev:server       # Start backend only
bun db:push          # Push database changes
bun db:studio        # Open database studio
```

This structure provides a solid foundation for scalable, maintainable applications while following modern React and TypeScript best practices.

