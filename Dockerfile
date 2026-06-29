FROM httpd:2.4

RUN apt-get update && apt-get install -y npm

COPY package.json .

RUN npm install

RUN tailwindcss -i ./css/input.css -o ./css/style.css --minify

COPY . /usr/local/apache2/htdocs/