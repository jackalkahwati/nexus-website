FROM node:20-alpine AS builder
WORKDIR /app

# Copy needed files
COPY package.json ./
COPY . .

# Install dependencies
RUN npm install -g serve

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/ .

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]