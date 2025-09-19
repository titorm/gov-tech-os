# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./
COPY apps/api/package*.json ./apps/api/
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY turbo.json ./

# Build application
RUN pnpm build --filter=api

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./
COPY apps/api/package*.json ./apps/api/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Create non-root user
RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 nestjs

USER nestjs

EXPOSE 3001

ENV NODE_ENV production

CMD ["node", "apps/api/dist/main.js"]