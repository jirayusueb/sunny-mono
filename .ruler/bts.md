# Better-T-Stack Project Rules

This is a nextjs-elysia-template project created with Better-T-Stack CLI.

## Project Structure

This is a monorepo with the following structure:

- **`apps/web/`** - Frontend application (Next.js 15)
- **`apps/server/`** - Backend server (Elysia.js)
- **`docs/`** - Comprehensive project documentation

## Available Scripts

### Development
- `bun dev` - Start all apps in development mode
- `bun dev:web` - Start only the frontend (port 3001)
- `bun dev:server` - Start only the backend (port 3000)

### Database Commands
All database operations should be run from the root:

- `bun db:push` - Push schema changes to database
- `bun db:studio` - Open Drizzle Studio
- `bun db:generate` - Generate Drizzle migration files
- `bun db:migrate` - Run database migrations

Database schema files are located in `apps/server/src/db/schema/`

### Code Quality
- `bun check` - Lint and format code with Biome
- `bun check-types` - TypeScript type checking
- `bun build` - Build all applications

## Authentication

Authentication is enabled in this project using Better-Auth:
- Server auth logic is in `apps/server/src/shared/lib/auth.ts`
- Frontend auth client is in `apps/web/src/lib/auth-client.ts`
- Authentication flow: Sign-in/Sign-up forms → Better-Auth → Session management

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible component library
- **TanStack Query** - Server state management
- **TanStack Form** - Form state management
- **Eden Treaty** - Type-safe API client

### Backend
- **Elysia.js** - High-performance TypeScript backend
- **Better-Auth** - Modern authentication system
- **Drizzle ORM** - Type-safe database operations
- **SQLite** - Development database
- **Result Pattern** - Functional error handling

### Development Tools
- **Bun** - Fast JavaScript runtime and package manager
- **Turborepo** - Monorepo build optimization
- **Biome** - Fast linting and formatting
- **Ultracite** - Code quality enforcement
- **Drizzle Studio** - Database visualization

## Architecture Patterns

### Container Pattern (Frontend)
Features are organized using containers:
```
containers/feature-name/
├── index.ts                    # Barrel export
├── feature-name.container.tsx  # Main container
├── components/                 # Feature-specific components
├── hooks/                      # Feature-specific hooks
└── utils/                      # Feature-specific utilities
```

### Plugin Architecture (Backend)
Server uses modular plugins:
```typescript
const app = new Elysia()
  .use(loggerIntegration)
  .use(openapiIntegration)
  .use(errorInterceptor)
  .use(corsMiddleware)
  .use(routers)
  .listen(PORT);
```

### Result Pattern (Error Handling)
Type-safe error handling without exceptions:
```typescript
const result = await fetchUser(id);
if (result.isOk()) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

## Adding More Features

You can add additional addons or deployment options to your project using:

```bash
bunx create-better-t-stack add
```

Available addons you can add:
- **Documentation**: Starlight, Fumadocs
- **Linting**: Biome, Oxlint, Ultracite
- **Other**: Ruler, Turborepo, PWA, Tauri, Husky

You can also add web deployment configurations like Cloudflare Workers support.

## Project Configuration

This project includes a `bts.jsonc` configuration file that stores your Better-T-Stack settings:

- Contains your selected stack configuration (database, ORM, backend, frontend, etc.)
- Used by the CLI to understand your project structure
- Safe to delete if not needed
- Updated automatically when using the `add` command

## Key Points

- This is a Turborepo monorepo using bun workspaces
- Each app has its own `package.json` and dependencies
- Run commands from the root to execute across all workspaces
- Run workspace-specific commands with `bun run command-name`
- Turborepo handles build caching and parallel execution
- Use `bunx create-better-t-stack add` to add more features later
- Follow the Result pattern for error handling
- Use container pattern for feature organization
- Maintain type safety throughout the stack
