# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /usr/src/app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend
FROM node:20-alpine AS backend-builder
WORKDIR /usr/src/app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npx prisma generate
RUN npm run build
# Compile the seed script to JS for production runtime without devDependencies (like ts-node)
RUN npx tsc prisma/seed.ts --esModuleInterop --module commonjs --target es2020 --resolveJsonModule

# Stage 3: Final production image (single service)
FROM node:20-alpine

# Set timezone to Bogota, install openssl and libc compatibility libraries for Prisma engine
RUN apk add --no-cache tzdata openssl libc6-compat
ENV TZ=America/Bogota

WORKDIR /usr/src/app

COPY backend/package*.json ./
COPY backend/prisma/schema.prisma ./prisma/

RUN npm ci --only=production

COPY --from=backend-builder /usr/src/app/backend/dist ./dist
COPY --from=backend-builder /usr/src/app/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=backend-builder /usr/src/app/backend/prisma/seed.js ./prisma/
COPY --from=backend-builder /usr/src/app/backend/prisma/matches.json ./prisma/
COPY --from=backend-builder /usr/src/app/backend/prisma/users.json ./prisma/

# Copy frontend build to backend's dist/client directory
COPY --from=frontend-builder /usr/src/app/frontend/dist ./dist/client

EXPOSE 3000

ENV NODE_ENV=production

# Push the schema to the SQLite database, run database seed, then start the server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node prisma/seed.js && node dist/src/main"]
