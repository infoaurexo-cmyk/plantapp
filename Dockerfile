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

# Install dependencies from scratch without pre-built binaries
RUN npm cache clean --force && \
    npm install --only=production --no-optional

# Copy backend application (excluding .env, use .env.production instead)
COPY backend/ .
RUN rm -f .env && mv .env.production .env

# Expose port (matches PORT=3000 in .env.production)
EXPOSE 3000

# Start application
CMD ["npm", "start"]
