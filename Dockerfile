# Étape 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installation des dépendances et génération du client Prisma
RUN npm ci
RUN npx prisma generate

# Copie du reste du code
COPY . .

# Étape 2 : Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/

# Installation uniquement des dépendances de production
RUN npm ci --only=production
RUN npx prisma generate

# Copie du code compilé ou des fichiers sources
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000

# Exécution des migrations Prisma et démarrage du serveur Express
CMD ["npx", "tsx", "src/server.ts"]