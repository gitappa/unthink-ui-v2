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
# Copy the entire .next directory structure for standalone mode
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Also copy package.json for any runtime dependencies
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["node", "server.js"]