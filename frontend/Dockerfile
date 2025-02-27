# frontend/Dockerfile
FROM node:16

WORKDIR /llm_map

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]