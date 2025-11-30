# -------------------------
# 1. BUILD STAGE
# -------------------------
FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install

# Copy source code (bao gồm thư mục prisma)
COPY . .

# ✅ Generate Prisma Client
RUN npx prisma generate

# Build NestJS
RUN pnpm build



# -------------------------
# 2. RUN STAGE
# -------------------------
FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

# ✅ Copy Prisma schema (nếu cần migrations sau này)
COPY --from=builder /app/prisma ./prisma

# ✅ Copy generated Prisma Client
COPY --from=builder /app/node_modules ./node_modules

# ✅ Copy generated folder
COPY --from=builder /app/generated ./generated

# Copy dist code
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
