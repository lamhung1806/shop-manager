# Manual Deployment Commands

# 1. Build image

docker build -t nest-app .

# 2. Start database

docker-compose -f docker-compose.prod.yml up -d postgres redis

# 3. Wait for database to be ready

sleep 30

# 4. Start app

docker-compose -f docker-compose.prod.yml up -d app

# 5. Run migrations

docker-compose -f docker-compose.prod.yml exec app pnpm prisma db push

# 6. Check status

docker-compose -f docker-compose.prod.yml ps
