FROM node:18

# Install python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Install rembg
RUN pip3 install rembg

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir uploads outputs

EXPOSE 10000

CMD ["node", "server.js"]