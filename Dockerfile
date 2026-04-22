FROM node:22-bookworm

WORKDIR /app

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

# Copy backend application
COPY backend/ .

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
