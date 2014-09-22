var async = require('async');

var collections = {};

exports.search = function (query, callback) {
  'use strict';

  var requestedCollections;
  if (! query.collections || ! query.collections instanceof Array) {
    requestedCollections = Object.keys(collections);
  } else {
    requestedCollections = query.collections;
  }

  var maxResults = query.maxResults;

  var results = {};

  var iterator = function (collection, done) {
    if (collection in collections) {
      collections[collection].search(query.searchTerm, function (value) {
        if (maxResults && value.data instanceof Array) {
          value.data = value.data.slice(0, maxResults);
        }
        results[collection] = value;
        done();
      });
    } else {
      results[collection] = {error: 'Collection "' + collection + '" does not exist'};
      done();
    }
  };

  var wrappedCallback = function () {
    callback(results);
  };

  async.each(requestedCollections, iterator, wrappedCallback);
};

exports.add = function (name, plugin) {
  collections[name] = plugin;
};