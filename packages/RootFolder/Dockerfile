# server environment
#FROM nginx:alpine
#ENV PORT=8080
#ENV HOST=0.0.0.0
#COPY ./nginx/default.conf /etc/nginx/conf.d/configfile.template
#RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
#COPY ./public /usr/share/nginx/html
#EXPOSE 8080
#CMD ["nginx", "-g", "daemon off;"]



#FROM node:18 AS builder
#WORKDIR /packages/web-client-gatsby

# Copy package.json & lock files first for better caching
#COPY package*.json ./

#RUN npm install

# Copy all source files
#COPY . .

# Build Gatsby site (generates /public)
#RUN npm run build

#FROM nginx:alpine
#COPY /packages/web-client-gatsby/nginx/default.conf /etc/nginx/conf.d/configfile.template
#ENV PORT=8080
#ENV HOST=0.0.0.0

# Replace env vars in nginx config
#RUN sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"

# Copy built static files from builder stage
#COPY --from=builder /packages/web-client-gatsby/public /usr/share/nginx/html

# Expose port (matches PORT in your config)
#EXPOSE 8080

# Start nginx
#CMD ["nginx", "-g", "daemon off;"]


# server environment
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
