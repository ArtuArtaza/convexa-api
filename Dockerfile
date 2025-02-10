# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm (using corepack for better version management)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy pnpm specific files
COPY pnpm-lock.yaml ./

# Install dependencies only if package.json changes
COPY package.json ./

# Install all dependencies (including devDependencies)
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN pnpm prisma generate

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy pnpm specific files
COPY pnpm-lock.yaml ./

# Copy package.json (needed for pnpm start:prod)
COPY package.json ./

# Install production dependencies only
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Copy Prisma client and built application from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist

# Copy prisma schema (needed for migrations)
COPY prisma ./prisma/

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Change ownership of the working directory to the non-root user
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose the port the app runs on
EXPOSE 3000

# Start the application using pnpm start:prod
CMD ["pnpm", "start:prod"]
