# WebsiteJS
A modular project kickstarter


 > This project is under heavy construction and cannot be used yet in any production environment.

 ## Installation
 Make sure you have [NodeJS](http://nodejs.org) version 7 or higher installed and
 install global dependencies:
 ```sh
 $ npm install -g npm node-gyp rimraf jshint sass-lint nodemon gulp-cli jasmine
 ```

 Install project dependencies:
```sh
$ npm install 
```

## Architecture

#### Styles
WebsiteJs uses the Atomic Design priciple (not to be confused with the methodology). The sass architecture is based on ITCSS and uses the BEM methodology.
This way it is modular, scalable, flexible and maintainable. Based on the article [better css with atomic, itcss and bem](https://www.silverstripe.org/blog/better-css-putting-it-together-with-atomic-itcss-and-bem/). Must read!

## Building
To view all defined tasks run
```sh
$ gulp --tasks
```
or
```sh
$ gulp --tasks-simple
```
 > NOTE: WebsiteJS uses [Gulp 4](https://github.com/gulpjs/gulp/tree/4.0).

To start a build:

```sh
$ gulp (specific task)
```
or
```sh
$ npm run build
```
### Debug mode
```sh
$ gulp (specific task) --debug
```
### Production mode
```sh
$ gulp (specific task) --production
```
or
```sh
$ npm run build-production
```
 > You can use both --debug and --production flags independend from each other or at the same time. E.g: ``` $ gulp --debug --production```


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

## Supported browsers
WebsiteJS uses [Browserslist](https://github.com/ai/browserslist) which can be configured in the `.browserslistrc` file in the root of the project.

## Vendor packages
To add vendor scripts and styles to the project use NPM where possible, so the vendor package is in the node_modules folder.
After adding the package you'll have to add the script and/or css files to the corresponding array in the `vendor config file` found in the Frontend/vendor folder.

 > You can use both minified (*.min.*) and non-minified files to add to the arrays. Websitejs will sort them and add all files minified to the vendor scripts or vendor styles files.

### Vendor packages not in NPM
Vendor packages which aren't available via npm can be added to the Frontend/vendor folder. Create a folder for your package and add the necessary js and css files.
Try to avoid packages which you have to download manually as much as possible, but this way you can still add them. These files will be picked up automatically, no need to add them in the config file.

## SVG icon system
The svg icon system combine svg files into one 'svg spritesheet' with `<symbol>` elements based on the [CSS Tricks article](http://css-tricks.com/svg-symbol-good-choice-icons/). Nested directories that may have files with the same name, are concatenated by relative path with the name of the file, e.g. `src/assets/icons/svg/social/facebook.svg` becomes `#social-facebook`.

### Using an icon
If you want to use and insert an icon, use the id ```"#foldername-svgname"``` inside a ```<use>```-tag. SVG Icons should always have an ```<svg>```-tag with the minimum base class "icon".
```sh
<svg class="icon">
    <use xlink:href="#foldername-svgname"></use>
</svg>
```

### Adding an icon
Normally the icons will be created in Illustrator and the default export from illustrator should be fine. The sources files will be minified/cleaned up when building, so comments etc will not be an issue.

If you decide to make your own, create an svg-file inside the svg-icons folder. In there the minimum code should be as follows.
```sh
<svg viewBox="0 0 48 48">
    <path d=""></path>
</svg>
```
 > Make sure to not add a ```<symbol>``` tag around the path or the svg, then your icon won't work.

#### Titles and groups
Ideally you'll want to add a ```<title>``` to your icon, screenreaders will read the defined title.
Optionally you can add a ```<g>``` (group) to isolate multiple paths or fills as a grouped icon.
```sh
<svg viewBox="0 0 48 48">
    <g>
        <title>Download</title>
        <path d=""></path>
    </g>
</svg>
```
