# Use Node.js to build the Next.js app first
FROM node:18-alpine AS builder
WORKDIR /app
COPY packages/web-client-next/package*.json ./
RUN npm ci --legacy-peer-deps
COPY packages/web-client-next/ .
RUN npm run build

#### Production server environment
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Do not hardcode PORT: Cloud Run sets the `PORT` env var at runtime.

# Copy the standalone Next.js server
COPY --from=builder /app/.next/standalone ./

# Copy static assets and CSS (Next.js compiled CSS is in .next/static)
COPY --from=builder /app/.next/static ./.next/static

# Copy public directory (static files like images)
COPY --from=builder /app/public ./public

# Copy package.json for reference
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["node", "server.js"]