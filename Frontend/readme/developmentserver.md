## Localhost Development Server
The development server is an NodeJS Express server based on BrowserSync and is kept alive by Nodemon.
It uses Handlebars to render templates and updates on the fly. No preprocessing neccessary.
The server watches all project files and will auto-reload when changes are detected.
To start the server use
```sh
$ gulp serve [--production, --debug]
``` 
The server auto-detects a free port (from port number 3000 and up) and is run by default in development (NODE_ENV) mode.

To start the server only use ```$ gulp server``` or ```$ npm start```
