# Build stage
FROM node:18 AS builder
WORKDIR /packages/web-client-next

# Copy package files
COPY packages/web-client-next/package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and build
COPY packages/web-client-next ./
RUN npm run build

# Production stage
FROM nginx:alpine
WORKDIR /packages/web-client-next
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy nginx config
COPY packages/web-client-next/nginx/default.conf /etc/nginx/conf.d/configfile.template
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"

# Copy built Next.js app
COPY --from=builder /packages/web-client-next/out /usr/share/nginx/html
COPY --from=builder /packages/web-client-next/public /usr/share/nginx/html/public

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
 
 