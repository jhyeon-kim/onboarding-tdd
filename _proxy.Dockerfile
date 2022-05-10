FROM nginx:latest

COPY app/docker/proxy/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80