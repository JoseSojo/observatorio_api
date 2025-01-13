
FROM node:20

WORKDIR /app

COPY . /app/

RUN npm install --production --silent && mv node_modules ../
RUN npm install

RUN npm i -g prisma

COPY .env ./.env
COPY prisma ./prisma/

ENV DATABASE_URL="mysql://root:root@unerg_library:3306/biblioteca_unerg"

RUN npx prisma generate --schema ./prisma/schema.prisma
RUN npm run build

# Exponemos el puerto donde corre la aplicación
EXPOSE 3005

# Comando por defecto que se ejecutará al iniciar el contenedor
CMD [ "npm", "run", "start:prod" ]
