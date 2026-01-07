# Use Node.js to build the Next.js app first
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npm run build

#### Production server environment
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Do not hardcode PORT: Cloud Run sets the `PORT` env var at runtime.
# Copy the standalone server and static files (requires `next.config.js` with `output: 'standalone'`)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]