FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm ci --only=production

COPY . .

EXPOSE 8080

# ToDo: Add something to trigger this from the aws cli
CMD [ "npm", "run", "migration.up" ]