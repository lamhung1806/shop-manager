#!/bin/bash

echo "🚀 Deploying pre-built NestJS application..."

# Check if built files exist
if [ ! -d "dist" ]; then
    echo "❌ Error: 'dist' folder not found!"
    echo "Please run build script locally first:"
    echo "  ./scripts/build-local.sh"
    exit 1
fi

if [ ! -d "generated" ]; then
    echo "❌ Error: 'generated' folder not found!"
    echo "Please run build script locally first:"
    echo "  ./scripts/build-local.sh"
    exit 1
fi

# Stop existing containers
echo "⏹️ Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build new Docker image with pre-built files
echo "🔨 Building Docker image with pre-built application..."
docker build -t ecommerce-app .

# Start services
echo "▶️ Starting production services..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Show status
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

echo "✅ Deployment completed!"
echo "🌐 App should be running on port 8080"