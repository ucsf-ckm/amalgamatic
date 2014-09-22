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
amalgamatic.search('medicine', function (results) {
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
    * `q`: String containing the actual query. In other words, the search terms.
    * `c`: Array of strings representing the plugins you wish to search. Default is to use all registered plugins.
* `callback`: A function to execute after all plugins have returned results. It is called with one parameter.
    * `results`: An object containing all the results from the plugins.