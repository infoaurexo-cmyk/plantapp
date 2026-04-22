FROM node:22-bookworm

WORKDIR /app

# Switched to better-sqlite3 for reliable Docker deployment
# better-sqlite3 has superior native module compilation support
# Updated: 2026-04-22T13:35:00Z

# Install build dependencies for SQLite and other native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./

# Install dependencies from scratch
# better-sqlite3 has better Docker support and more reliable native compilation
RUN npm cache clean --force && \
    npm ci

# Copy backend application (.env is excluded via .dockerignore)
# Remove node_modules from copied files - use the freshly built ones
COPY backend/ .
RUN rm -rf node_modules && \
    mv .env.production .env

# Expose port (matches PORT=3000 in .env.production)
EXPOSE 3000

# Start application
CMD ["npm", "start"]
