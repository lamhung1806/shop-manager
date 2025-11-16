#!/bin/bash

# Development utilities script

case $1 in
  "start")
    echo "🚀 Starting development environment..."
    docker-compose -f docker-compose.db.yml up -d
    echo "✅ Database started on localhost:5432"
    echo "✅ Redis started on localhost:6379"
    ;;
  
  "stop")
    echo "⏹️  Stopping development environment..."
    docker-compose -f docker-compose.db.yml down
    ;;
  
  "logs")
    echo "📋 Viewing logs..."
    docker-compose -f docker-compose.db.yml logs -f
    ;;
  
  "restart")
    echo "🔄 Restarting services..."
    docker-compose -f docker-compose.db.yml restart
    ;;
  
  "clean")
    echo "🧹 Cleaning up..."
    docker-compose -f docker-compose.db.yml down -v
    docker system prune -f
    ;;
  
  "backup")
    echo "💾 Creating database backup..."
    docker-compose -f docker-compose.db.yml exec postgres pg_dump -U postgres ecommerce > backup_$(date +%Y%m%d_%H%M%S).sql
    echo "✅ Backup created!"
    ;;
  
  "db")
    echo "🗄️  Connecting to database..."
    docker-compose -f docker-compose.db.yml exec postgres psql -U postgres -d ecommerce
    ;;
  
  *)
    echo "Usage: $0 {start|stop|logs|restart|clean|backup|db}"
    echo ""
    echo "Commands:"
    echo "  start   - Start development database"
    echo "  stop    - Stop all services"
    echo "  logs    - View service logs"
    echo "  restart - Restart all services"
    echo "  clean   - Stop and remove all data"
    echo "  backup  - Create database backup"
    echo "  db      - Connect to database"
    ;;
esac