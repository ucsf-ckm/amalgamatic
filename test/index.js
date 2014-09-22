/*jshint expr: true*/

var amalgamatic = require('../index.js');

var pluginTestDouble = {
	search: function (query, callback) {
		if (query === 'error') {
			callback({error: 'There was an error! Oh noes!'});
		} else {
			callback({data: [
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

	it('returns only specified collection', function (done) {
		amalgamatic.search({searchTerm: 'medicine', collections: ['plugin']}, function (results) {
			expect(results.plugin.data.length > 0).to.be.true;
			expect(results.plugin.error).to.be.undefined;
			done();
		});
	});

	it('returns an error if an invalid collection is specified', function (done) {
		amalgamatic.search({searchTerm: 'medicine', collections: ['fhqwhgads']}, function (results) {
			expect(results.fhqwhgads.data).to.be.undefined;
			expect(results.fhqwhgads.error).to.equal('Collection "fhqwhgads" does not exist');
			done();
		});
	});

	it('returns multiple collections if specified', function (done) {
		amalgamatic.search({searchTerm: 'medicine', collections: ['plugin', 'fhqwhgads']}, function (results) {
			expect(results.plugin.data).to.be.ok;
			expect(results.fhqwhgads.error).to.be.ok;
			done();
		});
	});

	it('returns all collections if no collection specified', function (done) {
		amalgamatic.search({searchTerm: 'medicine'}, function (results) {
			expect(results.plugin.data).to.be.ok;
			done();
		});
	});

	it('returns errors returned by the plugin', function (done) {
		amalgamatic.search({searchTerm: 'error', collections: ['plugin']}, function (results) {
			expect(results.plugin.data).to.be.undefined;
			expect(results.plugin.error).to.equal('There was an error! Oh noes!');
			done();
		});
	});

	it('returns limits results to sepcified maxResults', function (done) {
		amalgamatic.search({searchTerm: 'medicine', maxResults: 1}, function (results) {
			expect(results.plugin.error).to.be.undeinfed;
			expect(results.plugin.data.length).to.equal(1);
			done();
		});
	});

	it('runs pluginCallback for each plugin before runnning its own callback', function (done) {
		var pluginCallbackRan = false;

		var pluginCallback = function (value) {
			expect(value.data.length).to.equal(2);
			pluginCallbackRan = true;
		};

		amalgamatic.search({searchTerm: 'medicine', pluginCallback: pluginCallback}, function () {
			expect(pluginCallbackRan).to.be.ok;
			done();
		});
	});
});

