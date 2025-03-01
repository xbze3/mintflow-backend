FROM node:20.13.1

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 8081

CMD ["node", "server.js"]
