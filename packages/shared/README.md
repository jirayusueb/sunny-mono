# @workspace/shared

Shared utilities, types, and constants used across web and server applications.

## Structure

```
packages/shared/
├── src/
│   ├── types/      # Shared TypeScript types and interfaces
│   ├── utils/      # Shared utility functions
│   ├── constants/  # Shared constants
│   └── index.ts    # Main barrel export
└── dist/           # Built output (generated)
```

## Usage

### In Web App

```typescript
import { API_VERSION } from "@workspace/shared/constants";
// or
import { API_VERSION } from "@workspace/shared";
```

### In Server App

```typescript
import { API_VERSION } from "@workspace/shared/constants";
// or
import { API_VERSION } from "@workspace/shared";
```

## Building

The package needs to be built before use:

```bash
bun run build
```

Or watch mode for development:

```bash
bun run dev
```

## Exports

The package provides subpath exports for better tree-shaking:

- `@workspace/shared` - Main export (everything)
- `@workspace/shared/types` - Types only
- `@workspace/shared/utils` - Utilities only
- `@workspace/shared/constants` - Constants only

