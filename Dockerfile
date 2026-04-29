FROM node:24-alpine

WORKDIR /opt/app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

CMD ["npm", "run", "build-dev"]
