# Creation of the Node + Express + MongoDB image
# Version: 1.0.0
# Author: Daniel Boj Cobos
# Under License: CC-0:1.0

FROM node:19
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
EXPOSE 3000

# Start the app -> Run the app with the command npm start
# Dev mode: Comment for deployment
CMD [ "npm", "run", "dev"]
# Production mode: Uncomment for deployment
# CMD [ "npm", "serverstart"]

# Build the image
# docker build -t myapp .