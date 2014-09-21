var async = require('async');

var collections = {};

exports.search = function (query, callback) {
  'use strict';

  var requestedCollections;
  if (! query.c || ! query.c instanceof Array) {
    requestedCollections = Object.keys(collections);
  } else {
    requestedCollections = query.c;
  }

  var results = {};

  var iterator = function (c, done) {
    if (c in collections) {
      collections[c].search(query.q, function (value) {
        results[c] = {data: value.data};
        done();
      });
    } else {
      results[c] = {error: 'Collection "' + c + '" does not exist'};
      done();
    }
  };

  var wrappedCallback = function () {
    callback(results);
  };

  async.each(requestedCollections, iterator, wrappedCallback);
};

exports.add = function (name, collector) {
  collections[name] = collector;
};