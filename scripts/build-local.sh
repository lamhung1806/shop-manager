#!/bin/bash

echo "🔨 Building NestJS application locally..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Check if Prisma client is generated
if [ ! -d "generated/prisma" ]; then
    echo "🗄️ Generating Prisma client..."
    pnpm prisma generate
fi

# Build the application
echo "🏗️ Building TypeScript to JavaScript..."
pnpm run build

echo "✅ Local build completed!"
echo "📁 Built files ready in 'dist/' and 'generated/' folders"
echo ""
echo "🐳 Next steps:"
echo "1. Copy project to server"
echo "2. Run: docker build -t ecommerce-app ."
echo "3. Run: docker-compose -f docker-compose.prod.yml up"