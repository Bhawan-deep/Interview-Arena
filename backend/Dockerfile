FROM node:22

RUN apt-get update && apt-get install -y \
    python3 \
    g++ \
    default-jdk

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
