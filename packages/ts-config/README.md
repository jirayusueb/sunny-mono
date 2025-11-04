# @workspace/ts-config

Shared TypeScript configuration files for the monorepo.

## Available Configs

- `base.json` - Base TypeScript configuration with strict settings
- `nextjs.json` - Configuration for Next.js applications
- `server.json` - Configuration for server/Elysia applications
- `vitest.json` - Configuration for Vitest test files

## Usage

### Next.js App

```json
{
  "extends": "@workspace/ts-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Server App

```json
{
  "extends": "@workspace/ts-config/server.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### Vitest Tests

```json
{
  "extends": "@workspace/ts-config/vitest.json"
}
```

