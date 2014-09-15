var querystring = require('querystring');
var cheerio = require('cheerio');
var http = require('http');

exports.search = function (query, callback) {
    'use strict';

    if (! query) {
        callback({data: []});
        return;
    }

    var options = {
        host: 'ucelinks.cdlib.org',
        port: 8888,
        path: '/sfx_ucsf/az?param_textSearchType_value=startsWith&' +
            querystring.stringify({param_pattern_value: query}),
    };

    http.get(options, function (resp) {
        var rawData = '';

        resp.on('data', function (chunk) {
            rawData += chunk;
        });

        resp.on('end', function () {
            var $ = cheerio.load(rawData);
            var result = [];
            $('a.Results').each(function () {
                result.push({
                    'name': $(this).text(),
                    'url': $(this).attr('href')
                });
            });

            callback({data: result});
        });
    }).on('error', function (e) {
        callback({error: e.message});
    });
};