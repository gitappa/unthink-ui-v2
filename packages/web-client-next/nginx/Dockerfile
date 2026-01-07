# nginx Dockerfile for serving a static `next export` site
# Usage: run `npm ci && npm run build && npm run export` to produce the `out/` folder,
# then build this image from the repo root so `out/` and `nginx/default.conf` are available.
FROM nginx:stable-alpine

# Replace nginx default config with our config (listens on port 3000)
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy exported static site
COPY out /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
