var async = require('async');

var collections = {};

exports.search = function (query, callback) {
  'use strict';

  var lastError;

  var requestedCollections;
  if (! query.collections || ! query.collections instanceof Array) {
    requestedCollections = Object.keys(collections);
  } else {
    requestedCollections = query.collections;
  }

  var maxResults = query.maxResults;

  var pluginCallback = query.pluginCallback;

  var results = [];

  var iterator = function (collection, done) {
    var myCollection = collections[collection];

    if (! myCollection) {
      return process.nextTick(function () {
        lastError = new Error('Collection "' + collection + '" does not exist');
        done();
      });
    }

    myCollection.search(query, function (err, value) {
      if (maxResults && value && value.data instanceof Array) {
        value.data = value.data.slice(0, maxResults);
      }

      if (value) {
        value.name = collection;
        results.push(value);
      }

      if (err) {
        lastError = err;
      }

      if (pluginCallback) {
        if (err) {
          pluginCallback(err);
        } else {
          pluginCallback(null, value);
        }
      }

      done();
    });
  };

  if (typeof callback !== 'function') {
    callback = function () {};
  }
  
  var wrappedCallback = function () {
    if (lastError) {
      callback(lastError);
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