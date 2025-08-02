# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN yarn install

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the project
RUN yarn build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma


# Generate Prisma client again just in case (optional)
RUN npx prisma generate

# Expose port (optional, based on your service)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
