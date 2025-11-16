@echo off

echo 🔨 Building NestJS application locally...

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    pnpm install
)

REM Check if Prisma client is generated
if not exist "generated\prisma" (
    echo 🗄️ Generating Prisma client...
    pnpm prisma generate
)

REM Build the application
echo 🏗️ Building TypeScript to JavaScript...
pnpm run build

echo ✅ Local build completed!
echo 📁 Built files ready in 'dist/' and 'generated/' folders
echo.
echo 🐳 Next steps:
echo 1. Copy project to server
echo 2. Run: docker build -t ecommerce-app .
echo 3. Run: docker-compose -f docker-compose.prod.yml up