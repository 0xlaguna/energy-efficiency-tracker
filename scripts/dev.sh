#!/bin/bash

# Development environment script
echo "🚀 Starting development environment..."

# Change to project root directory
cd ..

# Stop any existing containers
docker-compose -f docker-compose.dev.yml down

# Build and start development services
docker-compose -f docker-compose.dev.yml up --build -d

echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:3000 (with hot reload)"
echo "🔧 Backend: http://localhost:8000 (with auto-reload)"
echo "🗄️ MongoDB: localhost:27017"
echo "⚡ Redis: localhost:6379"
