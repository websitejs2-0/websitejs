## ComponentHandler
The ComponentHandler registers, instantiates and initializes the object and component classes used in WebsiteJS. It is a global instance which holds all component instances. This way we prevent long lists of instance generation and init method calls.

 > Classes without a view, like for instance a shoppingcart CRUD (Create, Retrieve, Update, Delete) controller, still needs to be instantiated and initialized in the main script (scripts.js).

### How the ComponentHandler works
1. The ComponentHandler itself is created with an empty register. 
2. Classes for objects and components are added to the code. Each class registers itself to the ComponentHandler's registry. Registering is done by css classname and js classname. The css classname should not contain any styling, it is purely used as a hook for the ComponentHandler.
3. The ```ComponentHandler.upgradeAllRegistered()``` method is called to initialize the objects and components. Queries for all registered css classes are done on all documents nodes. Then it loops over those and instantiates them one-by-one by calling their ```.init()``` method. When the upgrade is done on a node, the upgraded object is added to the dataset and to a data-attribute on the upgraded node.

#### Basic example
To create a header component, add a html file into a folder called 'header' in the 'components' folder. This html document should contain an element with a hook-class for the ComponentHandler. For instance 'js-header'.
```
<header class="header js-header"></header>
```
Then, in the same folder, create a 'header.js' file. A basic class for a component could be as follows:
```
'use strict';

var Header = function($element) {
    this.init = function() {
        console.log('Header init!');
        return this;
    };
};
``` 
Now you have a basic 'header' class. To register this class to the ComponentHandler you should add a register snippet to the contents of the 'header' class. Like this:
```
ComponentHandler.register({
    constructor: Header,
    classAsString: 'Header',
    cssClass: 'js-header'
});
```
So your complete file looks like this:
```
'use strict';

var Header = function($element) {
    this.init = function() {
        console.log('Header init!');
        return this;
    };
};

ComponentHandler.register({
    constructor: Header,
    classAsString: 'Header',
    cssClass: 'js-header'
});
```
Now the 'header' class will register itself to the ComponentHandler with the 'js-header' class as hook. This means that whenever the ComponentHandler finds a document node with the 'js-header' hook, it instantiates and initializes the 'header' class on that node.

The current node (and all its children) which has been upgraded is passed into the instance as jQuery Element and is available in the '$element' parameter within the class. So, within the class $element contains ```<header class="header js-header"></header>``` as jQuery Element in this example.

### Calling methods after element upgrades
The ComponentHandler has some methods to use when some more advanced use is needed. Lets say we want to resize a component after resizing the browserwindow. To do this, we need to call a method on a already initialized instance for the component we need to resize. The ComponentHandler globally holds all instances of the classes to facilitate this.

The ```ComponentHandler.getCreatedItems()``` method returns an array with all currently created instances of the classes. As an optional parameter you can add the classname you need, for instance 'Header'. When called the ```ComponentHandler.getCreatedItems('Header')``` method will return an array with all 'Header' instances. Generally you can call a method on your instance by doing some sort of the following:
```
$(document).on('resize', function() {
    var instances = ComponentHandler.getCreatedItems('Header');
    var Header = instances[0];
    Header.doResize();
});
```
The same goes for calling methods from other components.

### Available methods
#### .findRegisteredItem(jsClass)
Finds a registered item by javascript classname.
#### .upgradeAllRegistered()
Upgrades all registered classes. Usually this will be the one method called on pageload.
#### .upgradeElement($element, jsClass)
Upgrades jQuery Element and instantiates jsClass. Optional jsClass to overide javascript classname.
#### .upgradeElements($elements)
Upgrades an array of jQuery Elements by calling ```.upgradeElement()``` for each array index.
#### .getRegisteredItems()
Returns an array of registered classes.
#### .getCreatedItems(className)
Returns an array of class instances. Optional className parameter to filter instances of className.

 > There are some more methods available. For more information see the docs or view the sourcecode of the ComponentHandler.
 