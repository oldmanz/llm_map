# frontend/Dockerfile
FROM node:18

WORKDIR /app

ENV NODE_ENV=development

COPY package.json package-lock.json ./
RUN npm install && npm install -g webpack webpack-cli webpack-dev-server

COPY . .

EXPOSE 9001

CMD ["npm", "start"]