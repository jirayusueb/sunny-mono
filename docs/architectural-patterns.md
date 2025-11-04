# Architectural Patterns Documentation

This document outlines the key architectural patterns used throughout the project to maintain consistency, scalability, and maintainability.

## Overview

This project follows several core architectural patterns that work together to create a robust, type-safe, and maintainable codebase:

- **Monorepo Architecture** - Turborepo-based workspace management
- **Clean Architecture** - Separation of concerns with clear boundaries
- **Result Pattern** - Functional error handling without exceptions
- **Plugin Architecture** - Modular, composable server components
- **Container Pattern** - Feature-based organization with clear responsibilities

## Core Architectural Principles

### 1. Separation of Concerns
Each layer has a specific responsibility and clear boundaries:

```
Frontend (Next.js)     Backend (Elysia)
├── UI Components     ├── API Routes
├── Containers        ├── Services
├── Hooks            ├── Database Layer
├── Utils            ├── Middleware
└── Types            └── Shared Logic
```

### 2. Feature-Based Organization
Code is organized by feature rather than by technical layer:

```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── dashboard/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── common/
    ├── components/
    ├── hooks/
    └── utils/
```

### 3. Type Safety First
TypeScript is used throughout with strict type checking and proper interfaces.

## Monorepo Architecture

### Workspace Structure
```
template-mono/
├── apps/
│   ├── web/          # Next.js frontend
│   └── server/       # Elysia backend
├── docs/             # Documentation
├── package.json      # Root workspace config
├── turbo.json       # Turborepo config
└── tsconfig.json    # Root TypeScript config
```

### Benefits
- **Shared Dependencies**: Common packages managed at root level
- **Build Optimization**: Turborepo handles caching and parallel execution
- **Type Sharing**: Shared types between frontend and backend
- **Consistent Tooling**: Unified linting, formatting, and testing

### Turborepo Configuration
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Clean Architecture

### Layer Separation

#### Frontend Layers
1. **Presentation Layer** (`/components`, `/containers`)
   - UI components and user interactions
   - State management and data flow
   - Form handling and validation

2. **Business Logic Layer** (`/features`, `/hooks`)
   - Business rules and domain logic
   - Data transformation and validation
   - API communication logic

3. **Data Layer** (`/lib`, `/services`)
   - API clients and data fetching
   - Caching and state management
   - External service integration

#### Backend Layers
1. **API Layer** (`/routers`)
   - HTTP request/response handling
   - Route definitions and middleware
   - Input validation and serialization

2. **Business Logic Layer** (`/services`)
   - Core business logic and rules
   - Data processing and transformation
   - External service integration

3. **Data Layer** (`/db`, `/shared`)
   - Database operations and queries
   - Data persistence and retrieval
   - Schema management and migrations

### Dependency Flow
```
Frontend: Components → Containers → Features → Services → API
Backend:  Routers → Services → Database → External Services
```

## Result Pattern Architecture

### Core Concept
The Result pattern provides type-safe error handling without exceptions:

```typescript
type Result<T, E = Error> = Ok<T> | Err<E>;

interface Ok<T> {
  success: true;
  data: T;
}

interface Err<E> {
  success: false;
  error: E;
}
```

### Implementation Pattern
```typescript
// Service layer returns Results
async function fetchUser(id: string): Promise<Result<User, DatabaseError>> {
  try {
    const user = await db.select().from(userTable).where(eq(userTable.id, id));
    return user[0] ? ok(user[0]) : err(new NotFoundError(`User ${id} not found`));
  } catch (error) {
    return err(new DatabaseError("Failed to fetch user", error));
  }
}

// Controller layer handles Results
async function getUser(req: Request): Promise<Response> {
  const result = await userService.fetchUser(req.params.id);

  if (result.success) {
    return Response.json({ user: result.data });
  } else {
    return Response.json({ error: result.error.message }, { status: 404 });
  }
}
```

### Benefits
- **Type Safety**: Errors are part of the type system
- **Explicit Error Handling**: Forces developers to handle errors
- **Composable**: Results can be chained and combined
- **No Hidden Exceptions**: All error paths are explicit

## Plugin Architecture (Backend)

### Core Pattern
The server uses a plugin-based architecture for modularity:

```typescript
// Main server setup
const app = new Elysia()
  .use(loggerIntegration)      // Logging
  .use(openapiIntegration)     // API documentation
  .use(errorInterceptor)       // Error handling
  .use(corsMiddleware)         // CORS
  .use(authMiddleware)         // Authentication
  .use(routers)               // API routes
  .listen(PORT);
```

### Plugin Structure
```typescript
// Example: Database plugin
export const databasePlugin = new Elysia({ name: "database" })
  .decorate("db", database)
  .onRequest(({ db }) => {
    // Database connection logic
  });

// Example: Auth plugin
export const authPlugin = new Elysia({ name: "auth" })
  .macro({
    auth: {
      async resolve({ request }) {
        const session = await auth.api.getSession({
          headers: request.headers
        });
        return session ? { user: session.user } : null;
      }
    }
  });
```

### Benefits
- **Modularity**: Each plugin has a single responsibility
- **Composability**: Plugins can be combined in different ways
- **Testability**: Plugins can be tested in isolation
- **Reusability**: Plugins can be shared across projects

## Container Pattern (Frontend)

### Container Structure
```typescript
// containers/feature-name/
├── index.ts                    # Barrel export
├── feature-name.container.tsx  # Main container
├── components/                 # Feature-specific components
│   ├── index.ts
│   ├── component-a.tsx
│   └── component-b.tsx
├── hooks/                      # Feature-specific hooks
│   ├── index.ts
│   ├── use-feature-a.ts
│   └── use-feature-b.ts
└── utils/                      # Feature-specific utilities
    ├── index.ts
    ├── util-a.ts
    └── util-b.ts
```

### Container Responsibilities
1. **State Management**: Local state and data fetching
2. **Business Logic**: Feature-specific logic and rules
3. **Component Composition**: Combining components and hooks
4. **API Integration**: Data fetching and caching

### Example Container
```typescript
// containers/dashboard/dashboard.container.tsx
interface DashboardContainerProps {
  userId: string;
}

export function DashboardContainer({ userId }: DashboardContainerProps) {
  const { data: user, isLoading } = useUser(userId);
  const { data: stats } = useUserStats(userId);
  const { mutate: updateProfile } = useUpdateProfile();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dashboard">
      <UserProfile user={user} onUpdate={updateProfile} />
      <StatsWidget stats={stats} />
      <RecentActivity userId={userId} />
    </div>
  );
}
```

## Data Flow Architecture

### Frontend Data Flow
```
User Interaction → Container → Hook → Service → API → Backend
                ↓
UI Update ← State Update ← Data Processing ← Response ← Database
```

### Backend Data Flow
```
HTTP Request → Router → Middleware → Service → Database
             ↓
HTTP Response ← Serialization ← Business Logic ← Data Processing
```

### State Management
- **Server State**: TanStack Query for API data
- **Client State**: React hooks for UI state
- **Form State**: React Hook Form for form management
- **Global State**: Context API for app-wide state

## Error Handling Architecture

### Frontend Error Handling
```typescript
// Error boundary for unexpected errors
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryProvider>
      {children}
    </ErrorBoundaryProvider>
  );
}

// Result pattern for expected errors
const { data, error, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  onError: (error) => {
    toast.error(`Failed to fetch user: ${error.message}`);
  }
});
```

### Backend Error Handling
```typescript
// Global error interceptor
export const errorInterceptor = new Elysia({ name: "error" })
  .onError(({ error, set }) => {
    console.error("Server error:", error);

    if (error instanceof ValidationError) {
      set.status = 400;
      return { error: "Validation failed", details: error.details };
    }

    if (error instanceof DatabaseError) {
      set.status = 500;
      return { error: "Database error" };
    }

    set.status = 500;
    return { error: "Internal server error" };
  });
```

## Development Architecture

### Code Organization Strategy
- **Container Pattern**: Feature-based frontend organization
- **Plugin Architecture**: Modular server components
- **Result Pattern**: Type-safe error handling
- **Barrel Exports**: Clean import organization

## Performance Architecture

### Frontend Performance
- **Code Splitting**: Dynamic imports for route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Caching**: TanStack Query for API data caching
- **Optimization**: React.memo, useMemo, useCallback

### Backend Performance
- **Database Optimization**: Proper indexing and query optimization
- **Caching**: Redis for frequently accessed data
- **Connection Pooling**: Database connection management
- **Rate Limiting**: API rate limiting and throttling

## Security Architecture

### Authentication Flow
```
1. User submits credentials
2. Frontend sends to /api/auth/signin
3. Backend validates credentials
4. Session created and stored
5. Secure cookie set
6. Subsequent requests include session
```

### Authorization
- **Route Protection**: Middleware checks session validity
- **API Protection**: Authentication required for protected endpoints
- **Role-Based Access**: User roles determine access levels

## Deployment Architecture

### Development
- **Local Development**: SQLite database, local services
- **Hot Reloading**: Fast development iteration
- **Type Checking**: Real-time TypeScript validation

### Production
- **Database**: PostgreSQL or MySQL for production
- **Caching**: Redis for session and data caching
- **CDN**: Static asset delivery
- **Monitoring**: Application performance monitoring

## Best Practices

### 1. Consistent Patterns
- Use the same patterns across similar features
- Follow established conventions for naming and structure
- Maintain consistency in error handling and data flow

### 2. Clear Boundaries
- Keep layers separate with clear responsibilities
- Avoid tight coupling between modules
- Use interfaces to define contracts

### 3. Type Safety
- Use TypeScript interfaces for all data structures
- Leverage type inference where possible
- Validate data at boundaries

### 4. Error Handling
- Use Result pattern for expected errors
- Implement error boundaries for unexpected errors
- Provide meaningful error messages to users

### 5. Code Quality
- Use Biome for linting and formatting
- Follow Ultracite code quality standards
- Maintain type safety throughout
- Use consistent patterns across the codebase

This architectural pattern system provides a solid foundation for building scalable, maintainable applications while following modern best practices and maintaining type safety throughout the stack.
