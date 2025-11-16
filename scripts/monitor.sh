#!/bin/bash

# Monitoring script

echo "📊 Container Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "💾 Disk Usage:"
df -h

echo ""
echo "🔍 App Logs (last 50 lines):"
docker-compose -f docker-compose.prod.yml logs --tail=50 app

echo ""
echo "🗄️  Database Status:"
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U postgres