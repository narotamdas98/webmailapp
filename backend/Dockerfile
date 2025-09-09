FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system deps required by Prisma + native modules
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    python3 \
    make \
    g++

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Environment
ENV NODE_ENV=development

# Start in watch mode (dev)
CMD ["npm", "run", "start:dev"]
