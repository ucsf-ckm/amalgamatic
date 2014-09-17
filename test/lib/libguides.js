/*jshint expr: true*/

var libguides = require('../../lib/libguides.js');

var nock = require('nock');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Lab.expect;
var describe = lab.experiment;
var it = lab.test;
var afterEach = lab.afterEach;

describe('libguides', function () {

	afterEach(function (done) {
		nock.cleanAll();
		done();
	});

	it('returns an empty result if no search term provided', function (done) {
		libguides.search('', function (result) {
			expect(result).to.deep.equal({data:[]});
			done();
		});
	});

	it('returns results if a non-ridiculous search term is provided', function (done) {
		nock('https://lgapi.libapps.com')
			.get('/widgets.php?site_id=407&widget_type=1&search_match=2&search_type=0&sort_by=count_hit&list_format=1&output_format=1&load_type=2&enable_description=0&enable_group_search_limit=0&enable_subject_search_limit=0&widget_embed_type=2&config_id=1410964327647&search_terms=medicine')
			.reply('200', '<ul><li><a href="http://example.com/1" target="_blank">Medicine</a></li><div class="s-lg-guide-list-info"></div><li><a href="http://example.com/2" target="_blank">Medicine2</a></li><div class="s-lg-guide-list-info"></div></ul>');

		libguides.search('medicine', function (result) {
			expect(result.data.length).to.equal(2);
			done();
		});
	});

	it('returns an empty result if ridiculous search term is provided', function (done) {
		nock('https://lgapi.libapps.com')
			.get('/widgets.php?site_id=407&widget_type=1&search_match=2&search_type=0&sort_by=count_hit&list_format=1&output_format=1&load_type=2&enable_description=0&enable_group_search_limit=0&enable_subject_search_limit=0&widget_embed_type=2&config_id=1410964327647&search_terms=fhqwhgads')
			.reply('200', '<div class="s-lg-guide-list-info"><i>No results match the request.</i></div>');

		libguides.search('fhqwhgads', function (result) {
			expect(result.data.length).to.equal(0);
			done();
		});
	});

	it('returns an error object if there was an HTTP error', function (done) {
		nock.disableNetConnect();
		libguides.search('medicine', function (result) {
			nock.enableNetConnect();
			expect(result.data).to.be.undefined;
			expect(result.error).to.equal('Nock: Not allow net connect for "lgapi.libapps.com:443"');
			done();
		});
	});
});
