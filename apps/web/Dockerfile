FROM oven/bun:1.3-alpine AS base
ARG app=web

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
ARG app=web

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lock* ./bun.lock*
RUN bun install

ENV SKIP_ENV_VALIDATION=true

# Build the project
COPY --from=builder /app/out/full/ .
RUN bunx turbo run build --filter=@workspace/${app}

# Production runner
FROM oven/bun:1.3-alpine AS runner
ARG app=web
ENV APP=${app}

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=installer /app/apps/${app}/next.config.ts .
COPY --from=installer /app/apps/${app}/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/${app}/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/${app}/.next/static ./apps/${app}/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/${app}/public ./apps/${app}/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["sh", "-c", "bun run ./apps/${APP}/server.js"]
