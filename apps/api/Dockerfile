FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json and install ALL dependencies (including devDependencies for build)
COPY package.json ./
RUN npm install --include=dev

# Copy source, generate Prisma client, and build
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image — only production dependencies
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
EXPOSE 8080
CMD ["node", "dist/index.js"]
