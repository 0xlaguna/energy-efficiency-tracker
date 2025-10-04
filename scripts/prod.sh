#!/bin/bash

# Production environment script
echo "🚀 Starting production environment..."

# Change to project root directory
cd "$(dirname "$0")/.."

# Stop any existing containers
docker-compose down

# Build and start production services
docker-compose up --build -d

echo "✅ Production environment started!"
echo "📱 Frontend: http://localhost:3000 (optimized build)"
echo "🔧 Backend: http://localhost:8000 (production build)"
echo "🗄️ MongoDB: localhost:27017"
echo "⚡ Redis: localhost:6379"
