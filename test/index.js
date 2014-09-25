/*jshint expr: true*/

var amalgamatic = require('../index.js');

var pluginTestDouble = {
	search: function (query, callback) {
		if (query.searchTerm === 'error') {
			callback(new Error('There was an error! Oh noes!'));
		} else if (query.searchTerm === 'options') {
			callback(null, query);
		} else {
			callback(null, {data: [
				{name: 'Result 1', url: 'http://example.com/1'},
				{name: 'Result 2', url: 'http://example.com/2'}
			]});
		}
	}
};

amalgamatic.add('plugin', pluginTestDouble);

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Lab.expect;
var describe = lab.experiment;
var it = lab.test;

describe('exports', function () {
	it('should have a search property', function (done) {
		expect(typeof amalgamatic.search).to.equal('function');
		done();
	});

	it('should pass the entire query object to the plugin', function (done) {
		var query = {searchTerm: 'options', fhqwhgads: 'fhqwhgads'};
		amalgamatic.search(query, function (err, results) {
			expect(results).to.deep.equal({plugin: query});
			done();
		});
	});

	it('returns only specified collection', function (done) {
		amalgamatic.search({searchTerm: 'medicine', collections: ['plugin']}, function (err, results) {
			expect(results.plugin.data.length > 0).to.be.true;
			expect(err).to.be.not.ok;
			done();
		});
	});

	it('returns an error if an invalid collection is specified', function (done) {
		amalgamatic.search({searchTerm: 'medicine', collections: ['fhqwhgads']}, function (err, results) {
			expect(results).to.be.not.ok;
			expect(err).to.deep.equal(new Error('Collection "fhqwhgads" does not exist'));
			done();
		});
	});

	it('returns multiple collections if specified', function (done) {
		amalgamatic.search({searchTerm: 'medicine', collections: ['plugin', 'fhqwhgads']}, function (err, results) {
			expect(results).to.be.not.ok;
			expect(err).to.be.ok;
			done();
		});
	});

	it('returns all collections if no collection specified', function (done) {
		amalgamatic.search({searchTerm: 'medicine'}, function (err, results) {
			expect(results.plugin.data).to.be.ok;
			done();
		});
	});

	it('provides the main callback with errors that are returned by the plugin', function (done) {
		amalgamatic.search({searchTerm: 'error', collections: ['plugin']}, function (err, results) {
			expect(results).to.be.not.ok;
			expect(err).to.deep.equal(new Error('There was an error! Oh noes!'));
			done();
		});
	});

	it('provides the plugin callbacks with errors that are returned by the plugin', function (done) {
		var pluginCallback = function (err, value) {
			expect(err).to.be.ok;
			expect(value).to.be.not.ok;
			done();
		};

		amalgamatic.search({searchTerm: 'error', pluginCallback: pluginCallback});
	});

	it('returns limits results to sepcified maxResults', function (done) {
		amalgamatic.search({searchTerm: 'medicine', maxResults: 1}, function (err, results) {
			expect(err).to.be.null;
			expect(results.plugin.data.length).to.equal(1);
			done();
		});
	});

	it('runs pluginCallback for each plugin before runnning its own callback', function (done) {
		var pluginCallbackRan = false;

		var pluginCallback = function (err, value) {
			expect(value.data.length).to.equal(2);
			pluginCallbackRan = true;
		};

		amalgamatic.search({searchTerm: 'medicine', pluginCallback: pluginCallback}, function () {
			expect(pluginCallbackRan).to.be.ok;
			done();
		});
	});

	it('should include the plugin name in the value for pluginCallback', function (done) {
		var pluginCallback = function (err, value) {
			expect(value.name).to.equal('plugin');
			done();
		};

		amalgamatic.search({searchTerm: 'medicine', pluginCallback: pluginCallback});
	});

	it('should run with a null callback as the user can still send a plugin-level callback', function (done) {
		amalgamatic.search({searchTerm: 'medicine'});
		done();
	});
});

