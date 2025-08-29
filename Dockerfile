# Usa Nginx oficial como base
FROM nginx:alpine

# Borra la configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/

# Copia la carpeta de build de Vite a la ruta que Nginx sirve
COPY dist/ /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Arranca Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
