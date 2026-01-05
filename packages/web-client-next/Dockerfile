# server environment
FROM nginx:alpine
ENV PORT=8080
ENV HOST=0.0.0.0
COPY ./nginx/default.conf /etc/nginx/conf.d/configfile.template
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY ./public /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
