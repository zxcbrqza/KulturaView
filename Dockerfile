# ✅ Base Node.js image
FROM node:18-alpine AS base

# ================================
# ✅ Dependencies Stage
# ================================
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install server dependencies (production only)
RUN cd server && npm install --omit=dev

# Install client dependencies (production only)
RUN cd client && npm install --omit=dev

# ================================
# ✅ Client Build Stage
# ================================
FROM base AS client-builder
WORKDIR /app/client

# Copy client code and install dev dependencies
COPY client/package*.json ./
COPY client/ ./

RUN npm install
RUN npm run build

# ================================
# ✅ Production Server Stage
# ================================
FROM base AS runner
WORKDIR /app

# Copy server source and dependencies
COPY server/ ./server/
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy built client into the correct location
COPY --from=client-builder /app/client/build ./client/build

# Create uploads directory
RUN mkdir -p /tmp/uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose app port
EXPOSE 5000

# Optional healthcheck script
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node server/healthcheck.js || exit 1

# Start the server
CMD ["node", "server/src/server.js"]
