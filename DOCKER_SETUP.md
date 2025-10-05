# Docker Environment Setup

This project supports both **development** and **production** Docker environments.

## 🚀 Quick Start

### Development (with hot reload)
```bash
# Option 1: Using the script
./scripts/dev.sh

# Option 2: Direct command
docker-compose -f docker-compose.dev.yml up --build -d
```

### Production (optimized build)
```bash
# Option 1: Using the script
./scripts/prod.sh

# Option 2: Direct command
docker-compose up --build -d
```

## 📋 Environment Comparison

| Feature | Development | Production |
|---------|-------------|------------|
| **Hot Reload** | ✅ Yes | ❌ No |
| **File Watching** | ✅ Yes | ❌ No |
| **Build Optimization** | ❌ No | ✅ Yes |
| **Volume Mounts** | ✅ Yes | ❌ No |
| **Source Maps** | ✅ Yes | ❌ No |
| **Bundle Size** | Large | Optimized |

## 🔧 Development Environment

### Features:
- **Frontend**: Hot reload with Next.js dev server
- **Backend**: Auto-reload with FastAPI `--reload` flag
- **Volume Mounts**: Live code changes without rebuilds
- **Debug Mode**: Full debugging capabilities

### Services:
- Frontend: `http://localhost:3000` (with hot reload)
- Backend: `http://localhost:8000` (with auto-reload)
- MongoDB: `localhost:27017`
- Redis: `localhost:6379`

### Usage:
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

## 🏭 Production Environment

### Features:
- **Frontend**: Optimized Next.js build with standalone output
- **Backend**: Production FastAPI server
- **Security**: Non-root users, minimal attack surface
- **Performance**: Multi-stage builds, optimized images

### Services:
- Frontend: `http://localhost:3000` (optimized build)
- Backend: `http://localhost:8000` (production build)
- MongoDB: `localhost:27017`
- Redis: `localhost:6379`

### Usage:
```bash
# Start production environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop production environment
docker-compose down
```

## 📁 File Structure

```
├── docker-compose.yml          # Production compose
├── docker-compose.dev.yml      # Development compose
├── scripts/
│   ├── dev.sh                  # Development script
│   └── prod.sh                 # Production script
├── backend/
│   ├── Dockerfile              # Production backend
│   └── Dockerfile.dev          # Development backend
└── frontend/
    ├── Dockerfile              # Production frontend
    └── Dockerfile.dev          # Development frontend
```

## 🛠️ Development Workflow

1. **Start Development Environment**:
   ```bash
   ./scripts/dev.sh
   ```

2. **Make Code Changes**:
   - Frontend changes: Automatically reloaded
   - Backend changes: Automatically reloaded
   - No need to rebuild containers

3. **Test Changes**:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000/api/v1/health`

4. **Stop Development**:
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## 🚀 Production Deployment

1. **Build Production Images**:
   ```bash
   docker-compose build
   ```

2. **Start Production Services**:
   ```bash
   docker-compose up -d
   ```

3. **Verify Services**:
   ```bash
   curl http://localhost:8000/api/v1/health
   curl http://localhost:3000
   ```

## 🔍 Troubleshooting

### Development Issues:
- **Port conflicts**: Check if ports 3000, 8000, 27017, 6379 are free
- **Volume issues**: Ensure file permissions are correct
- **Hot reload not working**: Check if volumes are properly mounted

### Production Issues:
- **Build failures**: Check Dockerfile syntax and dependencies
- **Performance**: Monitor resource usage with `docker stats`
- **Security**: Ensure non-root users are properly configured

## 📊 Monitoring

### View Container Status:
```bash
# Development
docker-compose -f docker-compose.dev.yml ps

# Production
docker-compose ps
```

### View Logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f api
```

### Resource Usage:
```bash
docker stats
```
