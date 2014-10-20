[![Build Status](https://travis-ci.org/ucsf-ckm/amalgamatic.svg?branch=master)](https://travis-ci.org/ucsf-ckm/amalgamatic)

Amalgamatic
===========

Amalgamatic is a pluggable metasearch/federated search tool. It let's you choose a series of 
sources to search and then search them.

Search all the things!

## Installation

Install Amalgamatic and plugins with `npm`. For example:

````
# npm install --save amalgamatic amalgamatic-sfx amalgamatic-pubmed
````

## Quickstart

````
// Load Amalgamatic
var amalgamatic = require('amalgamatic');

// Load some plugins to search SFX and PubMed.
var sfx = require('amalgamatic-sfx');
var pubmed = require('amalgamatic-pubmed');

// Add the plugins to Amalgamatic.
amalgamatic.add('sfx', sfx);
amalgamatic.add('pubmed', pubmed);

var callback = function (err, results) {
	if (err) {
		console.log(err);
	} else {
		console.log(results);
	}
};

// Do a search!
amalgamatic.search({searchTerm: 'medicine'}, callback);
````

## API

### amalgamatic.add(name, plugin)

Add (register) a plugin for a collection.
* `name`: A string that will be used to identify the collection.
* `plugin`: A plugin object.

### amalgamatic.search(query, callback)
 
Execute a search query.
* `query`: An object optionally containing the following properties
    * `searchTerm`: String containing the search term(s). Default is empty string which returns no results.
    * `collections`: Array of strings representing the plugins you wish to search. Default is to use all registered plugins.
    * `maxResults`: Integer representing the maximum number of results to return from each plugin. Use 0 or a negative number (or omit the property altogether) to return the default number of results from each plugin.
    * `pluginCallback`: A function to execute after each plugin returns a result. It is called with two parameters.
    		* `error`: An Error object or `null` if no error occurred.
        * `results`: An object containing the results from the plugin.
* `callback`: A function to execute after all plugins have returned results. It is called with two parameters.
		* `error`: An Error object or `null` if no error occurred.
    * `results`: An object containing all the results from all the plugins.

## Plugins

* [A list of plugin modules published via npm](https://www.npmjs.org/browse/keyword/amalgamatic-plugin)

* [How To Write an Amalgamatic Plugin](https://github.com/ucsf-ckm/amalgamatic/wiki/How-to-write-an-amalgamatic-plugin)

## Browserify

If you want to use Amalgamatic in the browser, most plugins will work fine with [Browserify](http://browserify.org/) but they may need to be run through a CORS proxy. Fortunately, we've set up a demo.

* [Amalgamatic + Browserify Demo](http://trott.github.io/demo-amalgamatic-browserify/)