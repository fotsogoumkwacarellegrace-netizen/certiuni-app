FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . .
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build npx prisma generate
RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build npx prisma generate

COPY --from=builder --chown=node:node /app/dist ./dist
COPY --chown=node:node scripts/prisma-migrate.cjs ./scripts/prisma-migrate.cjs
USER node

EXPOSE 3000

CMD ["sh", "-c", "npm run prisma:migrate:deploy && node dist/src/main.js"]
