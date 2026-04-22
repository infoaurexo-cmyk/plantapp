FROM node:22-bookworm

WORKDIR /app

# SQLite3 native module compilation fix for Linux
# Rebuild: 2026-04-22

# Install build dependencies for SQLite and other native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./

# Install dependencies from scratch - rebuild all native modules for Linux
# Force build from source to ensure SQLite3 compiles for Linux, not using macOS prebuilt binaries
RUN npm cache clean --force && \
    npm ci --build-from-source && \
    npm rebuild sqlite3 --build-from-source

# Copy backend application (.env is excluded via .dockerignore)
# Remove node_modules from copied files - use the freshly built ones
COPY backend/ .
RUN rm -rf node_modules && \
    mv .env.production .env

# Expose port (matches PORT=3000 in .env.production)
EXPOSE 3000

# Start application
CMD ["npm", "start"]
