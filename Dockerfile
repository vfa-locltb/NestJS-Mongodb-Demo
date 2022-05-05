# syntax:docker/dockerfile:1

FROM node:16.14.2-alpine As development

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g npm@8.8.0
RUN npm install -g @nestjs/cli
RUN npm install --only=development --force
COPY . .
RUN npm run build


FROM node:16.14.2-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g npm@8.8.0
RUN npm install --only=production --force
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/package.json .
COPY --from=development /usr/src/app/.env .

CMD ["node","dist/main"]

# docker build --no-cache -t nestjs-mongodb-demo .
# docker run --detach --publish 3000:3000 nestjs-mongodb-demo