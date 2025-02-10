# Base image
FROM node:18-alpine

# Install pnpm
RUN npm i -g pnpm@9.14.2

# Create app directory
WORKDIR /app

# Copy package files
# COPY package.json pnpm-lock.yaml ./

# Copy application source
COPY . .

# Install dependencies
RUN pnpm install



# Generate Prisma Client
RUN pnpm prisma generate

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pm2-runtime", "start", "pm2.config.js"]
