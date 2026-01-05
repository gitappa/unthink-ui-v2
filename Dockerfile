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
FROM node:18 AS builder
WORKDIR /

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# Export static files
RUN npm run export

FROM nginx:alpine

ENV PORT=8080
ENV HOST=0.0.0.0
COPY /nginx/default.conf /etc/nginx/conf.d/configfile.template
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY /out /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
