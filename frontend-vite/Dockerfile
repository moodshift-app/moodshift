# Build stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM nginx:stable-alpine AS production

# Install necessary packages for SSL and troubleshooting
RUN apk add --no-cache openssl curl ca-certificates

# Create directory for SSL certificates
RUN mkdir -p /etc/letsencrypt/live/moodshift.fuadfakhruz.id

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Create directories for logs
RUN mkdir -p /var/log/nginx && \
    touch /var/log/nginx/access.log && \
    touch /var/log/nginx/error.log && \
    chmod 644 /var/log/nginx/access.log && \
    chmod 644 /var/log/nginx/error.log

# Expose both HTTP and HTTPS ports
EXPOSE 80 443

# Health check (use only HTTP internally, as SSL certs will be provided externally)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

# Run nginx
CMD ["nginx", "-g", "daemon off;"]