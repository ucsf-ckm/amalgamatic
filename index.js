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

  var pluginCallback = query.pluginCallback;

  var results = {};

  var iterator = function (collection, done) {
    if (collection in collections) {
      collections[collection].search(query, function (err, value) {
        if (maxResults && value.data instanceof Array) {
          value.data = value.data.slice(0, maxResults);
        }

        if (pluginCallback) {
          if (err) {
            pluginCallback(err);
          } else {
            var result = {name: collection};
            result.data = value.data;
            pluginCallback(null, result);
          }
        }

        results[collection] = value;
        done(err);
      });
    } else {
      done(new Error('Collection "' + collection + '" does not exist'));
    }
  };

  if (typeof callback !== 'function') {
    callback = function () {};
  }
  
  var wrappedCallback = function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  };

  async.each(requestedCollections, iterator, wrappedCallback);
};

exports.add = function (name, plugin) {
  'use strict';
  
  collections[name] = plugin;
};