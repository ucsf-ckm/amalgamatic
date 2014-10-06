[![Build Status](https://travis-ci.org/ucsf-ckm/amalgamatic.svg?branch=master)](https://travis-ci.org/ucsf-ckm/amalgamatic)

amalgamatic
===========

Amalgamatic is a pluggable metasearch tool. It let's you choose a series of 
sources to search and then search them.

Search all the things!

## Quickstart

````
// Load amalgamatic
var amalgamatic = require('amalgamatic');

// Load some plugins to search SFX and PubMed.
var sfx = require('amalgamatic-sfx');
var pubmed = require('amalgamatic-pubmed');

// Add the plugins to amalgamatic.
amalgamatic.add('sfx', sfx);
amalgamatic.add('pubmed', pubmed);

// Do a search!
amalgamatic.search({searchTerm: 'medicine'}, function (results) {
	console.dir(results);
});
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

## Writing plugins

See [How To Write an Amalgamatic Plugin](https://github.com/ucsf-ckm/amalgamatic/wiki/How-to-write-an-amalgamatic-plugin) on the wiki.