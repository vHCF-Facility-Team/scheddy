FROM oven/bun:1 as builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source files
COPY . .

# Build the application
RUN bun run build

# Create a minimal production image
FROM node:20-slim

WORKDIR /app

# Copy built files and necessary runtime files
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the default port
EXPOSE 3000

CMD ["node", "build/index.js"]