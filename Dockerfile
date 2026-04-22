FROM node:22-bookworm

WORKDIR /app

# Switched to PostgreSQL - no native modules needed
# PostgreSQL provides bulletproof Docker deployment

# Install build dependencies (minimal, just in case)
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./

# Install dependencies
RUN npm cache clean --force && \
    npm ci

# Copy backend application (.env is excluded via .dockerignore)
COPY backend/ .
RUN mv .env.production .env

# Expose port (matches PORT=3000 in .env.production)
EXPOSE 3000

# Start application
CMD ["npm", "start"]
