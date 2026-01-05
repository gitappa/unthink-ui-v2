# server environment
FROM nginx:alpine
WORKDIR /packages/web-client-next
ENV PORT=3000
ENV HOST=0.0.0.0
COPY packages/web-client-next/nginx/default.conf /etc/nginx/conf.d/configfile.template
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY packages/web-client-next/public /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
