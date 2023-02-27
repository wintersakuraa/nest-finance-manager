###################
# BUILD FOR DEVELOPMENT
###################

FROM node:16.17-alpine AS dev
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

CMD ["yarn", "start:dev"]
