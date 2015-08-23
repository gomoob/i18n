# i18n

> Polyglot.js extended to load JSON translation files and cache them.

`gomoob.i18n` is an extension to the AirBnb [Polyglot.js](http://airbnb.io/polyglot.js/ "Polyglot.js")  translation 
library. 

## Quick start

The main goals of `gomoob.i18n` are : 
 * Provide an easy to use `load` method to dynamically load translation files using ajax HTTP requests and reconfigure 
   Polyglot automatically ; 
 * Manage translations embedded in a DOM node to speedup first page display, then switch to translation loading using 
   HTTP ; 
 * Cache translation files on client side, in memory, in the Local Storage or using a custom cache manager. Version your 
   translation files to only reload translations when its needed ; 
 * Easy management of several translations, for example an application could have a set of translations per module or 
   per sub-application.

Here is a simple sample used to load a JSON translation file using the library.

```javascript
// Configure a Polyglot instance with URL builder used to locate JSON translation files on a particular server
var polyglot = new Polyglot(
    {
        urlBuilder : function(type, locale, version) {
            return 'https://myserver.com/i18n/' + type + '/' + locale + '.json?v=' + version;
        }
    }
);

// Loads French translations from 'https://myserver.com/i18n/connected/fr.json?v=0.1.0'
polyglot.load(
    {
        type : 'connected',
        locale : 'fr',
        version : '0.1.0', 
        success : function(data, textStatus, jqXHR) { ... }, 
        error : function(jqXHR, textStatus, errorThrown) { ... }           
    }
);
```

Here the `fr.json` file will be automatically fetched, then the polyglot instance will be reconfigured with the fetched 
translations. 

`gomoob.i18n` uses a client side cache to persist the translations, by default if you call the the `load` method two 
times successively then the first call will get the JSON translations and put them into the cache. The second call will 
check if their is a cache key for the tuple `{type, locale, version}`, if their is then the translations are pulled from 
the cache.

## Setup

### Install

Bower is available on bower.io and npmjs.org.

#### Bower

```
bower install gomoob.i18n
`

#### Node

```
npm i gomoob.i18n --save
```

### Use

`gomoob.i18n` is an UMD module, so its very easy to use it.

#### Browserify

Use `gomoob.i18n` with Browserify.

```javascript
var polyglot = require('gomoob.i18n');

...

```

#### RequireJS

Use `gomoob.i18n` with [RequireJS](http://requirejs.org "RequireJS").

```javascript
define(['gomoob.i18n'], function(Polyglot) {

   ...
   
});
```

#### Old school

```html
<script type="text/javascript" src="js/libs/polyglot.min.js" />
<script type="text/javascript" src="js/libs/gomoob.i18n.min.js" />
```

```javascript
var polyglot = new Polyglot();
...
```

## Additional Polyglot methods

### `cache(type, locale, version, phrases)` 

TODO

### `load(options)`

Loads translations associated to the `type`, `locale` and `version` parameters, internally this method will build a URL 
using the URL builder configures in the Polyglot instance. 

Each time translations are successfully fetched they are put in a translation cache by default, so subsequent calls to 
the method and for the same `{type, locale, version}` tuple will not perform not necessary HTTP requests and pull 
translations from the cache.

If for good reasons your need to force a refresh of a cache entry you can call the method with the `forceReload` option.

The input parameters of the `load(options)` method are documented in the following sub-sections.

#### `error`

TODO

#### `forceReload`

TODO

#### `locale`

TODO

#### `success`

TODO

#### `type` 

TODO

#### `version`

TODO

### `type(newType)`

TODO

### `version(newVersion)`

TODO

## Build commands

```
gulp
```

## Best practices & recipies

This section describe useful best practices we use everyday inside our JS projects.

### Use a polyglot singleton

TODO

### Speedup first time display

```javascript
/**
 * The first time the 'index.html' file is loaded all the translations required by public pages are embedded into an 
 * `i18n` DOM element in the page. 
 * 
 * This `i18n` element MUST HAVE 3 `data-` attributes defined : 
 *  * `locale`  : The name of the locale associated to translations, in most cases this will be equal to the `lang` 
 *                attribute but its not an obligation. For example the server could implement a custom language 
 *                detection while the `index.html` page is requested and inject a `locale` which is the result of a 
 *                custom heuristic ;
 *  * `phrases` : The dictionary which contains the translations, this is called `phrases` because Polyglot.js uses this 
 *                term ; 
 *  * `type`    : An arbitrary string which defines the type of the translation dictionary, this can then be used in 
 *                the application to manage multiple dictionaries. For example we could define a specific dictionary for 
 *                sub-application or sub-modules. 
 */
var i18nElement = $('#i18n');

// Create a singleton Polyglot instance which will be used everywhere in the application
console.log('Loading public transaltions...');
var polyglot = new Polyglot(
    {
        locale : i18nElement.data('locale'),
        phrases: i18nElement.data('phrases'), 
        type : i18nElement.data('type'), 
        version : '__default__',
        urlBuilder : function(type, locale, version) {
            return config.translationsUrl + type + '/' + locale + '.json?v=' + version;
        }
    }
);
console.log('Public translations loaded.');
```

### Translation files versionning

TODO

### Caching large translation files

TODO

### Using common translation files in several projects

TODO

### Create JSON translation files with Gulp and Browserify

TODO

### Embed translation in a DOM node with Gulp and Preprocess

TODO

## Release history

### 1.0.0 (2015-08-23)
 * First release
