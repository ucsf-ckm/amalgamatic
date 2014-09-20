amalgamatic
===========

Amalgamatic let's you choose a series of sources to search and then search them.

Like so:

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

Search all the things!
