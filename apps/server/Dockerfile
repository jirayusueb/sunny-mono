FROM oven/bun:1.3-alpine AS base
ARG app=server

# Install turbo globally
RUN bunx turbo --version || bun add -g turbo

FROM base AS builder
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace
RUN bunx turbo prune --scope=@workspace/${app} --docker

# Install dependencies
FROM base AS installer
ARG app=server

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lock* ./bun.lock*
RUN bun install

# Build the project
COPY --from=builder /app/out/full/ .
RUN bunx turbo run build --filter=@workspace/${app}

# Production runner
FROM oven/bun:1.3-alpine AS runner
ARG app=server
ENV APP=${app}

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 server

# Copy built application
COPY --from=installer --chown=server:nodejs /app/apps/${app}/api ./api
COPY --from=installer --chown=server:nodejs /app/apps/${app}/package.json ./
COPY --from=installer --chown=server:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=server:nodejs /app/packages ./packages

USER server

EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:3001/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["bun", "run", "api/index.js"]
