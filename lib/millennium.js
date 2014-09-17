var querystring = require('querystring');
var cheerio = require('cheerio');
var http = require('http');
var url = require('url');

exports.search = function (query, callback) {
    'use strict';

    if (! query) {
        callback({data: []});
        return;
    }

    var options = {
        host: 'ucsfcat.library.ucsf.edu',
        path: '/search/X?' + querystring.stringify({SEARCH: query}) + '&SORT=D'
    };

    http.get(options, function (res) {
        var rawData = '';

        res.on('data', function (chunk) {
            rawData += chunk;
        });

        res.on('end', function () {
            var $ = cheerio.load(rawData);
            var result = [];

            //if there is not a .briefcitTitle a, it is a single record and that uses .bibInfoData strong
            var rawResults = $('.briefcitTitle a');
            if (rawResults.length === 0) {
                $('.bibInfoData strong').each(function () {
                    result.push({
                        name: $(this).text(),
                        url: url.format(options)
                    });
                });
            } else {
                rawResults.each(function () {
                    result.push({
                        name: $(this).text(),
                        url: url.resolve(url.format(options), $(this).attr('href'))
                    });
                });
            }

            callback({data: result});
        });
    }).on('error', function (e) {
        callback({error: e.message});
    });
};