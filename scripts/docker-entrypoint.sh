#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
until pg_isready -h postgres -U postgres; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is up - executing command"

# Run Prisma migrations
pnpm prisma migrate deploy

# Start the application
exec "$@"