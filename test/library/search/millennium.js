/*jshint expr: true*/

var millennium = require('../../../lib/library/search/millennium.js');

var nock = require('nock');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Lab.expect;
var describe = lab.experiment;
var it = lab.test;
var afterEach = lab.afterEach;

describe('millennium', function () {

	afterEach(function (done) {
		nock.cleanAll();
		done();
	});

	it('returns an empty result if no search term provided', function (done) {
		millennium.search('', function (result) {
			expect(result).to.deep.equal({data:[]});
			done();
		});
	});

	it('returns results if a non-ridiculous search term is provided', function (done) {
		nock('http://ucsfcat.library.ucsf.edu')
			.get('/search/X?SEARCH=medicine&SORT=D')
			.reply('200', '<span class="briefcitTitle"><a href="#">Medicine</a></span><span class="briefcitTitle"><a class="Results" href="#">Medicine</a></span>');

		millennium.search('medicine', function (result) {
			expect(result.data.length).to.equal(2);
			done();
		});
	});

	it('returns an empty result if ridiculous search term is provided', function (done) {
		nock('http://ucsfcat.library.ucsf.edu')
			.get('/search/X?SEARCH=fhqwhgads&SORT=D')
			.reply('200', '<html></html>');

		millennium.search('fhqwhgads', function (result) {
			expect(result.data.length).to.equal(0);
			done();
		});
	});

	it('returns a single result for insanely specific search', function (done) {
		nock('http://ucelinks.cdlib.org:8888')
			.get('/search/X?SEARCH=cardenas%20gano&SORT=D')
			.reply('200', '<div class="bibInfoData"><strong>El Pueblo Voto. ¡ Y Cardenas Gano! [electronic resource]</strong></div>');
		millennium.search('cardenas gano', function (result) {
			expect(result.data.length).to.equal(1);
			done();
		});
	});

	it('returns an error object if there was an HTTP error', function (done) {
		nock.disableNetConnect();
		millennium.search('medicine', function (result) {
			nock.enableNetConnect();
			expect(result.data).to.be.undefined;
			expect(result.error).to.equal('Nock: Not allow net connect for "ucsfcat.library.ucsf.edu:80"');
			done();
		});
	});
});
