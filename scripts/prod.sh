#!/bin/bash

# Production utilities script

case $1 in
  "deploy")
    echo "🚀 Deploying to production..."
    docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build -d
    echo "✅ Production deployment completed!"
    ;;
  
  "start")
    echo "▶️  Starting production services..."
    docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
    ;;
  
  "stop")
    echo "⏹️  Stopping production services..."
    docker-compose -f docker-compose.prod.yml down
    ;;
  
  "restart")
    echo "🔄 Restarting production services..."
    docker-compose -f docker-compose.prod.yml restart
    ;;
  
  "logs")
    SERVICE=${2:-app}
    echo "📋 Viewing $SERVICE logs..."
    docker-compose -f docker-compose.prod.yml logs -f $SERVICE
    ;;
  
  "status")
    echo "📊 Production status:"
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    echo "💾 Disk usage:"
    df -h
    ;;
  
  "backup")
    echo "💾 Creating production backup..."
    docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres ecommerce > prod_backup_$(date +%Y%m%d_%H%M%S).sql
    echo "✅ Production backup created!"
    ;;
  
  "migrate")
    echo "🗄️  Running database migrations..."
    docker-compose -f docker-compose.prod.yml exec app pnpm prisma db push
    ;;
  
  "shell")
    SERVICE=${2:-app}
    echo "🐚 Opening shell for $SERVICE..."
    docker-compose -f docker-compose.prod.yml exec $SERVICE sh
    ;;
  
  "update")
    echo "📥 Updating production..."
    git pull origin main
    docker-compose -f docker-compose.prod.yml up --build -d
    ;;
  
  *)
    echo "Usage: $0 {deploy|start|stop|restart|logs|status|backup|migrate|shell|update} [service]"
    echo ""
    echo "Commands:"
    echo "  deploy    - Build and deploy to production"
    echo "  start     - Start production services"
    echo "  stop      - Stop production services" 
    echo "  restart   - Restart production services"
    echo "  logs      - View logs [service]"
    echo "  status    - Show production status"
    echo "  backup    - Create database backup"
    echo "  migrate   - Run database migrations"
    echo "  shell     - Open shell [service]"
    echo "  update    - Pull code and redeploy"
    ;;
esac