## Compiling components
When using the [local development server](./developmentserver.md) components get rendered on the fly. They will not be compiled to static html.
Compiling to html is done by using the ```gulp compile``` task and must be ran by hand.

 > WebsiteJS uses the Handlebars template engine.

#### Basic example
To compile a component run the following task
```gulp compile --c <componentname>``` or ```gulp compile --component <componentname>```

For instance:
```
gulp compile --c header
``` 
The compile task will render and compile the template to plain html and places the created file in the ```/static/components``` folder. This location can be altered by updating the ```folder.build.component``` variable in the ```project.config.js``` file.

#### Compile all components
To compile all components, run
```gulp compile --c``` or ```gulp compile --component```

Just leave out a component name.
 