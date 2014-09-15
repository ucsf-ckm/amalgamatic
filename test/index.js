/*jshint expr: true*/

var amalgamatic = require('../index.js');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Lab.expect;
var describe = lab.experiment;
var it = lab.test;

describe('amalgamatic', function () {

	it('should have a search property', function (done) {
		expect(typeof amalgamatic.search).to.equal('function');
		done();
	});
});
