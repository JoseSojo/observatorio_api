FROM node:20

WORKDIR /app

COPY . /app/

RUN npm install --production --silent && mv node_modules ../
RUN npm install

RUN npm i -g prisma

COPY .env ./.env
COPY prisma ./prisma/

ENV DATABASE_URL="mysql://root:root@localhost:3306/biblioteca_unerg"

RUN npx prisma generate --schema ./prisma/schema.prisma
RUN npm run build

EXPOSE 3005

CMD [ "npm", "run", "start:prod" ]
