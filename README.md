# fitnessband-frontend 
React application that displays health data

### Installation
Application requires [Node.js](https://nodejs.org/) .

Install the dependencies and devDependencies and start the server.

Clone Repo
```sh
$ git clone https://github.com/BrentGammon/fitnessband-frontend.git
```

Run app
```sh
$ cd react
$ npm install 
$ npm start
$ application will run on default port of localhost:3000, but will run on idfferent port if a application is already on that port 
```

Testing
```sh
$ cd react
$ npm test
```


Running in Docker
install docker toolbox from [Docker](https://www.docker.com/products/docker-toolbox)

You will need to add http://192.168.99.100/ to firebase Authorized Domains in Authentication

running docker on windows will require to port forward to be able to view the application 
```sh
$ start docker
$ cd fitnessband-frontend
$ docker-compose build
$ docker-compose up
$ application will be running on  http://192.168.99.100:9000/
```
