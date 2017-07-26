# WebsiteJS
A modular project kickstarter


 > This project is under heavy construction and cannot be used yet in any production environment.

 ## Installation
 Make sure you have [NodeJS](http://nodejs.org) version 7 or higher installed and
 install global dependencies:
 ```sh
 $ npm install -g npm node-gyp rimraf jshint nodemon gulp-cli jasmine
 ```

 Install project dependencies:
```sh
$ npm install 
```

 > NOTE: WebsiteJS uses [Gulp 4](https://github.com/gulpjs/gulp/tree/4.0).

## Building
```sh
$ gulp
```
or
```sh
$ npm build
```

## Localhost Development Server
The development server is an NodeJS Express server based on BrowserSync and is kept alive by Nodemon.
It uses Handlebars to render templates and updates on the fly. No preprocessing neccessary.
The server watches all project files and will auto-reload when changes are detected.
To start the server use
```sh
$ npm start
``` 
The server auto-detects a free port (from port number 3000 and up) and is run in development (NODE_ENV) mode.

## Jasmine testing
To start unit tests run
```sh
$ npm test
```

