FROM node:22.13-slim AS base

# Prisma için gerekli kütüphaneleri yükleyelim
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Bütün paketleri (tipler dahil) kur
RUN npm install --include=dev

COPY . .

# Prisma client üret ve TS derle
RUN npx prisma generate
RUN npm run build

# Production aşaması
FROM node:22.13-slim AS runner
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package*.json ./
COPY --from=base /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
