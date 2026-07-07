# --- Build stage ---
FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

RUN npx tailwindcss -i ./css/input.css -o ./css/style.css --minify

# --- Runtime stage ---
FROM httpd:2.4

# Enable .htaccess support
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /usr/local/apache2/conf/httpd.conf \&& sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/g' /usr/local/apache2/conf/httpd.conf
  
COPY --from=build /app/ /usr/local/apache2/htdocs/
