# Deployment Guide for Render

This guide explains how to deploy the sunny-mono application to Render using Docker.

## Prerequisites

- Render account
- Git repository with the code
- Environment variables ready

## Architecture

The application consists of two services:

1. **Backend Server** (`apps/server`) - Elysia.js API server running on Bun 1.3.0
2. **Frontend Web** (`apps/web`) - Next.js application running on Node.js 24

## Deployment Steps

### 1. Prepare Environment Variables

Before deploying, ensure you have the following environment variables configured in Render:

#### Backend Server (`sunny-mono-server`)
- `DATABASE_URL` - SQLite database path (e.g., `./production.db`)
- `BETTER_AUTH_SECRET` - Secret key for Better-Auth (generate a secure random string)
- `CORS_ORIGIN` - Frontend URL (e.g., `https://your-web-app.onrender.com`)
- `PORT` - Server port (default: 3001, Render sets this automatically)
- `NODE_ENV` - Set to `production`
- `RUNTIME` - Set to `docker`
- `SKIP_ENV_VALIDATION` - Set to `true` for Docker builds

#### Frontend Web (`sunny-mono-web`)
- `NEXT_PUBLIC_SERVER_URL` - Backend API URL (e.g., `https://your-server.onrender.com`)
- `PORT` - Server port (default: 3000, Render sets this automatically)
- `NODE_ENV` - Set to `production`
- `RUNTIME` - Set to `docker`
- `SKIP_ENV_VALIDATION` - Set to `true` for Docker builds

### 2. Deploy Using render.yaml

Render supports automatic deployment from a `render.yaml` file:

1. Push your code to GitHub/GitLab/Bitbucket
2. In Render dashboard, create a new "Blueprint" from your repository
3. Render will automatically detect `render.yaml` and create both services

### 3. Manual Deployment

If you prefer to set up services manually:

#### Backend Server

1. Create a new **Web Service** in Render
2. Connect your repository
3. Configure:
   - **Name**: `sunny-mono-server`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./apps/server/Dockerfile`
   - **Docker Context**: `.` (root directory)
   - **Health Check Path**: `/health`
   - **Plan**: Starter (or higher)
   - **Region**: Choose your preferred region

4. Add environment variables (see above)
5. Deploy

#### Frontend Web

1. Create a new **Web Service** in Render
2. Connect your repository
3. Configure:
   - **Name**: `sunny-mono-web`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./apps/web/Dockerfile`
   - **Docker Context**: `.` (root directory)
   - **Health Check Path**: `/`
   - **Plan**: Starter (or higher)
   - **Region**: Same as backend (recommended)

4. Add environment variables (see above)
5. Deploy

## Local Testing with Docker Compose

Test the Docker setup locally before deploying:

```bash
# Build and start services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Database Considerations

The current setup uses SQLite, which is suitable for development and small deployments. For production:

1. **SQLite on Render**: Works but has limitations (ephemeral storage)
2. **PostgreSQL (Recommended)**:
   - Create a PostgreSQL database in Render
   - Update `DATABASE_URL` to PostgreSQL connection string
   - Update `drizzle.config.ts` to use PostgreSQL dialect
   - Run migrations: `bun db:push`

## Build Process

### Backend Build
1. Installs dependencies using Bun
2. Builds shared packages
3. Builds server with `tsdown` (outputs to `api/` directory)
4. Runs with Bun runtime

### Frontend Build
1. Installs dependencies using Bun
2. Builds shared packages
3. Builds Next.js app in standalone mode
4. Runs with Node.js runtime

## Troubleshooting

### Build Failures

1. **Missing dependencies**: Ensure all workspace packages are properly configured
2. **Environment variables**: Set `SKIP_ENV_VALIDATION=true` during build
3. **Build context**: Ensure Docker context is set to repository root (`.`)

### Runtime Issues

1. **Port conflicts**: Render sets `PORT` automatically, ensure your app uses it
2. **Database path**: Ensure `DATABASE_URL` points to a writable location
3. **CORS errors**: Verify `CORS_ORIGIN` matches your frontend URL exactly

### Health Check Failures

- Backend: Verify `/health` endpoint returns 200
- Frontend: Verify root `/` is accessible
- Check logs: `docker-compose logs` or Render logs dashboard

## Performance Optimization

### For Production

1. **Use PostgreSQL**: SQLite doesn't scale well for production
2. **Enable caching**: Configure Next.js caching strategies
3. **Database pooling**: Configure connection pooling for PostgreSQL
4. **CDN**: Use Render's CDN for static assets

### Resource Limits

- **Starter Plan**: 512MB RAM, 0.5 CPU
- **Standard Plan**: 2GB RAM, 1 CPU (recommended for production)
- **Pro Plan**: 4GB+ RAM, 2+ CPUs (for high traffic)

## Security Checklist

- [ ] Use strong `BETTER_AUTH_SECRET` (32+ characters, random)
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (Render provides automatically)
- [ ] Configure CORS properly
- [ ] Use PostgreSQL for production (not SQLite)
- [ ] Enable database backups
- [ ] Review and limit exposed endpoints
- [ ] Set up monitoring and alerts

## Monitoring

Render provides:
- Built-in logging
- Metrics dashboard
- Health check monitoring
- Automatic restarts on failure

Additional monitoring options:
- Add application-level logging
- Integrate with external monitoring services
- Set up error tracking (Sentry, etc.)

## Rollback

If deployment fails:
1. Go to Render dashboard
2. Select the service
3. Navigate to "Manual Deployments"
4. Select previous successful deployment
5. Click "Rollback"

## Support

For issues:
1. Check Render logs dashboard
2. Review Docker build logs
3. Test locally with `docker-compose`
4. Check environment variables are set correctly

