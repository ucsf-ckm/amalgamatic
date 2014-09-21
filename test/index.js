/*jshint expr: true*/

var amalgamatic = require('../index.js');
var sfx = require('amalgamatic-sfx');

amalgamatic.add('sfx', sfx);

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Lab.expect;
var describe = lab.experiment;
var it = lab.test;

var nock = require('nock');
nock.disableNetConnect();

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

describe('exports', function () {
	var emitEnd = function (value) {
		emitter.emit('end', value);
	};

	var searchHelper = function (q, c, callback) {
		var query = {
			q: q,
			c: c
		};

		emitter.once('end', callback);

		amalgamatic.search(query, emitEnd);
	};

	it('should have a search property', function (done) {
		expect(typeof amalgamatic.search).to.equal('function');
		done();
	});

	it('returns only specified collection', function (done) {
		nock('http://ucelinks.cdlib.org:8888')
			.get('/sfx_ucsf/az?param_textSearchType_value=startsWith&param_pattern_value=medicine')
			.reply('200', '<a class="Results" href="#">Medicine</a><a class="Results" href="#">Medicine</a>');

		searchHelper('medicine', ['sfx'], function (results) {
			expect(results.sfx.data.length > 0).to.be.true;
			expect(results.sfx.error).to.be.undefined;
			done();
		});
	});

	it('returns an error if an invalid collection is specified', function (done) {
		searchHelper('medicine', ['fhqwhgads'], function (results) {
			expect(results.fhqwhgads.data).to.be.undefined;
			expect(results.fhqwhgads.error).to.equal('Collection "fhqwhgads" does not exist');
			done();
		});
	});

	it('returns multiple collections if specified', function (done) {
		nock('http://ucelinks.cdlib.org:8888')
			.get('/sfx_ucsf/az?param_textSearchType_value=startsWith&param_pattern_value=medicine')
			.reply('200', '<a class="Results" href="#">Medicine</a><a class="Results" href="#">Medicine</a>');

		searchHelper('medicine', ['sfx', 'fhqwhgads'], function (results) {
			expect(results.sfx.data).to.be.ok;
			expect(results.fhqwhgads.error).to.be.ok;
			done();
		});
	});

	it('returns all collections if no collection specified', function (done) {
		nock('http://ucelinks.cdlib.org:8888')
			.get('/sfx_ucsf/az?param_textSearchType_value=startsWith&param_pattern_value=medicine')
			.reply('200', '<a class="Results" href="#">Medicine</a><a class="Results" href="#">Medicine</a>');

		searchHelper('medicine', null, function (results) {
			expect(results.sfx.data).to.be.ok;
			done();
		});
	});
});

