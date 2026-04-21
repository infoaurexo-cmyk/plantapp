FROM node:22-bookworm

WORKDIR /app

# Install build dependencies for SQLite
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (clear cache and rebuild from source)
RUN npm cache clean --force && \
    npm ci --only=production && \
    npm rebuild --build-from-source

# Copy application
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
