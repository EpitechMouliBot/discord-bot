FROM node:19-alpine
WORKDIR /app/discord-bot
COPY ["package*.json", "./"]
RUN npm install
COPY . .
CMD ["node", "src/index.js"]
