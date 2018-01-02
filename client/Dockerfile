FROM node:latest
#https://stackoverflow.com/questions/38758361/create-react-app-with-docker
# Create app directory
RUN mkdir -p /src/app
WORKDIR /src/app

# Install app dependencies
COPY package.json /src/app/
RUN npm install && \
    npm install -g pushstate-server

# Bundle app source
COPY . /src/app

# Build and optimize react app
RUN npm run build

EXPOSE 9000

# defined in package.json
CMD [ "npm", "run", "start:prod" ]