# # Multi-stage build optimized for Railway
# FROM node:18-alpine AS base

# # Install dependencies only when needed
# FROM base AS deps
# WORKDIR /app

# # Copy package files
# COPY package*.json ./
# COPY server/package*.json ./server/
# COPY client/package*.json ./client/

# # Install dependencies
# RUN npm ci --only=production
# RUN cd server && npm ci --only=production
# RUN cd client && npm ci --only=production

# # Build client
# FROM base AS client-builder
# WORKDIR /app/client

# COPY client/package*.json ./
# RUN npm ci

# COPY client/ ./
# RUN npm run build

# # Production server
# FROM base AS runner
# WORKDIR /app

# # Copy server dependencies
# COPY --from=deps /app/server/node_modules ./server/node_modules
# COPY server/ ./server/

# # Copy built client
# COPY --from=client-builder /app/client/build ./server/public

# # Create uploads directory
# RUN mkdir -p /tmp/uploads

# # Set environment
# ENV NODE_ENV=production
# ENV PORT=5000

# # Expose port
# EXPOSE 5000

# # Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD node server/healthcheck.js || exit 1

# # Start server
# CMD ["node", "server/src/server.js"]

# Multi-stage build optimized for Railway
FROM node:18-alpine AS base

# ---- Dependencies Stage ----
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install server dependencies
RUN cd server && npm install --omit=dev

# Install client dependencies
RUN cd client && npm install --omit=dev

# ---- Client Build Stage ----
FROM base AS client-builder
WORKDIR /app/client

# Copy again for clean build context
COPY client/package*.json ./
COPY client/ ./

# Install dev dependencies and build
RUN npm install
RUN npm run build

# ---- Production Stage ----
FROM base AS runner
WORKDIR /app

# Copy server code and its dependencies
COPY server/ ./server/
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy built frontend into server/public
COPY --from=client-builder /app/client/build ./server/public

# Create uploads directory
RUN mkdir -p /tmp/uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Optional Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node server/healthcheck.js || exit 1

# Start the Node.js server
CMD ["node", "server/src/server.js"]
