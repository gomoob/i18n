(function(root, factory) {
    
    if (root && typeof define === 'function' && define.amd) {
        
        define(['jquery', 'node-polyglot'], function($, Polyglot) {

            return (root.Editor = factory(root, $, Polyglot));

        });

    }
  
    else if (typeof exports !== 'undefined') {

        var $ = require('jquery');
        var Polyglot = require('node-polyglot');
        
        module.exports = factory(root, $, Polyglot);

    }
    else {
        root.Editor = factory(root, root._, root.Polyglot);
    }
}(this, function(root, $, Polyglot) {

    'use strict';

    /**
     * Overwrites the Polyglot.js constructor to be able to manage additional options.
     * 
     * @param {Object} options Options used to configure Polyglot.js.
     * @param {Object} options.phrases The dictionary which contains the translations.
     * @param {Object} options.locale The locale associated to the translations.
     * @param {Object} options.type An arbitrary string which defines the type of the translation dictionary, this can 
     *        then be used in the application to manage multiple dictionaries. For example we could define a specific 
     *        dictionary for sub-application or sub-modules. 
     * @param {Function) options.urlBuilder A callback function used to build URLs where to load the translation files.
     */
    var oldPrototype = Polyglot.prototype;
    Polyglot = function(options) {
    
        // Same code as the standard Polyglot constructor
        options = options || {};
        this.phrases = {};
        this.extend(options.phrases || {});
        this.currentLocale = options.locale || 'en';
        this.allowMissing = !!options.allowMissing;
        this.urlBuilder = options.urlBuilder;
        
        this.warn = options.warn || function(message) {
            console.warn('WARNING: ' + message);
        };

        /**
         * A cache used to cache translations on client side, this cache allows to not request the server each time the 
         * `load` method is called.
         */
        this.phrasesCache = {};
        this.currentType = (options && options.type) ? options.type : '__default__';
        this.currentVersion = (options && options.version) ? options.version : '__default__';
    
        // Cache the first loaded translations
        this.cache(this.currentType, this.currentLocale, this.currentVersion, this.phrases);
    
    };
    Polyglot.prototype = oldPrototype;
    
    /**
     * Get / set the type of the dictionary in use / to use.
     * 
     * @param {String} newType The type of dictionary to use.
     * 
     * @return {String} The type of dictionary in use.
     */
    Polyglot.prototype.type = function(newType) {
        if (newType) this.currentType = newType;
        return this.currentType;  
    };
    
    /**
     * Get / set the version of the dictionary in use / to use.
     * 
     * @param {String} newVersion The version of dictionary to use.
     * 
     * @return {String} The version of dictionary in use.
     */
    Polyglot.prototype.version = function(newVersion) {
        if (newVersion) this.currentVersion = newVersion;
        return this.currentVersion;  
    };
    
    Polyglot.prototype.cache = function(type, locale, version, phrases) {
    
        if(!this.phrasesCache[type]) {
            this.phrasesCache[type] = {};
        }
        
        if(!this.phrasesCache[type][locale]) {
            this.phrasesCache[type][locale] = {};
        }
        
        this.phrasesCache[type][locale][version] = phrases;
    
    },
    
    /**
     * Function used to load new translations from a JSON file.
     * 
     * @param {Object} options Options used to configure the loading.
     * @param {Object} options.type The type of dictionary to load.
     * @param {Object} options.locale The locale associated to the disctionary to load.
     * @param {Object} options.version The version of the dictionary to load.
     * @param {Object} options.forceReload Boolean used to indicate if the function should by-pass the translations 
     *        cache and always reload the translations using an HTTP request.
     */
    Polyglot.prototype.load = function(options) {

        var locale = options.locale || 'en',
            type = options.type || '__default__', 
            version = options.version || '__default__';
    
        // If the 'forceReload' option is false we try to find the translations from the cache
        if(!options.forceReload) {
            
            // If translations are available in the cache
            if(this.phrasesCache[type] && this.phrasesCache[type][locale]) {
    
                // If a version is provided and this version is not the one used in the cache we have to request 
                // translations again
                if(version && !this.phrasesCache[type][locale][version]) {
    
                    // Be sure we remove the translations from the cache
                    delete this.phrasesCache[type][local];
    
                } 
                
                // Otherwise get the translations from the cache, call the 'success' method and exist
                else {
                    
                    // Replace the translations in use
                    this.replace(this.phrasesCache[type][locale][version]);
    
                    // If a 'success' method has been provided
                    if(options && options.success) {
    
                        options.success(this.phrasesCache[type][locale][version]);
                        
                        return;
                    
                    }
    
                }
    
            }
            
        }
        
        // A URL builder must have been defined
        if(!this.urlBuilder) {
            throw new Error('No \'urlBuilder\' has been defined !');
        }
    
        // We can be here if
        //  - The 'forceReload' option is true
        //  - No translations have been found in the cache
        //  - Translations have been found in the cache but the associated version is not the same as the provided 
        //    version
        $.ajax(
            {
                dataType : 'json',
                url : this.urlBuilder(options.type, options.locale, options.version), 
                success : $.proxy(
                    function(data, textStatus, jqXHR) {
    
                        // Replace the translations in use
                        this.replace(data);
                        
                        // Updates the translations cache
                        this.cache(type, locale, version, data);
    
                        // If a 'success' method has been provided
                        if(options && options.success) {
                            
                            options.success(data, textStatus, jqXHR);
                        
                        }
    
                    },
                    this
                ),
                error : function(jqXHR, textStatus, errorThrown) {
                    
                    // If an 'error' method has been provided
                    if(options && options.error) {
                        
                        options.error(jqXHR, textStatus, errorThrown);
                        
                    }
    
                }
            }
        );
        
    };
    
    return Polyglot;

}));
