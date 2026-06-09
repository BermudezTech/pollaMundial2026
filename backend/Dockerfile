FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build
# Compile the seed script to JS for production runtime without devDependencies (like ts-node)
RUN npx tsc prisma/seed.ts --esModuleInterop --module commonjs --target es2020 --resolveJsonModule

# Production image
FROM node:20-alpine

# Set timezone to Bogota
RUN apk add --no-cache tzdata
ENV TZ=America/Bogota

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/prisma/seed.js ./prisma/
COPY --from=builder /usr/src/app/prisma/matches.json ./prisma/
COPY --from=builder /usr/src/app/prisma/users.json ./prisma/

EXPOSE 3000

ENV NODE_ENV=production

# Push the schema to the SQLite database, run database seed, then start the server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node prisma/seed.js && node dist/main"]
