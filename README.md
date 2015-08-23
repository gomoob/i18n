# i18n

> Polyglot.js extended to load JSON translation files and cache them.

`gomoob.i18n` is an extension to the AirBnb [Polyglot.js](http://airbnb.io/polyglot.js/ "Polyglot.js")  translation 
library. 

## Quick start

The main goal of `gomoob.i18n` is to provide a very simple solution to dynamically load translations and re-configure 
a `Polyglot` instance using several JSON translation files.

Here is a simple sample.

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

#### Bower

#### Node

### Use

#### Browserify

#### RequireJS

## Usage

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

## Release history

### 0.1.0 (2015-08-23)
 * First release
