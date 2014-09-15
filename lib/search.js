var async = require('async');
var sfx = require('./search/sfx.js');

var collections = {
    sfx: sfx
};

module.exports = function (req, res) {
    'use strict';

    var requestedCollections;
    if (! req.query.c || ! req.query.c instanceof Array) {
        requestedCollections = Object.keys(collections);
    } else {
        requestedCollections = req.query.c;
    }

    var results = {};

    var iterator = function (c, done) {
        if (c in collections) {
            collections[c].search(req.query.q, function (value) {
                results[c] = {data: value.data};
                done();
            });
        } else {
            results[c] = {error: 'Collection "' + c + '" does not exist'};
            done();
        }
    };

    var callback = function () {
        res.json(results);
    };

    async.each(requestedCollections, iterator, callback);
};