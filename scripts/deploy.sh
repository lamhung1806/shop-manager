#!/bin/bash

# Deploy script for production

echo "🚀 Deploying NestJS App to Production..."

# Stop existing containers
echo "⏹️  Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Pull latest code (if using Git)
echo "📥 Pulling latest code..."
git pull origin main

# Build new image
echo "🔨 Building new Docker image..."
docker build -t nest-app .

# Start services
echo "▶️  Starting services..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml exec app pnpm prisma db push

# Show status
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

echo "✅ Deployment completed!"
echo "🌐 App is running on port 80"