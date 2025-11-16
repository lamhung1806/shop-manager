# Use Node.js version 20 as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml for production dependencies
COPY package*.json pnpm-lock.yaml ./

# Install pnpm and production dependencies only
RUN npm install -g pnpm
RUN pnpm install --prod --no-frozen-lockfile

# Copy pre-built application (built locally)
COPY dist ./dist
COPY generated ./generated

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Run the application
CMD ["node", "dist/main.js"]
