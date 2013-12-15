var assert = require('assert');

describe('pullscripts', function () {
    var request = require('request');
    var parse = require('./parse');

    var html = '<html>' +
                   '<head>' +
                        '<script src="http://firstUrl.com"></script>' +
                        '<script src="//secondUrl.com"></script>' +
                        '<script src="./ignoredLocalUrl"></script>' +
                   '</head>' +
               '</html>';

    var urls = [ 'http://firstUrl.com', 'http://secondUrl.com' ];

    it('downloads eligible script files', function (done) {
        request.get = function (url, callback) {
            callback(null, { statusCode: 200 }, url);
        };

        parse(html, {}, function (content) {
            assert.equal(content, urls.join('\n'));
            done();
        });
    });

    it('logs error', function (done) {
        request.get = function (url, callback) {
            callback(null, { statusCode: 404 }, url);
        };

        var expectedErrors = urls.slice();

        var logger = {
            error: function () {
                assert.equal(arguments[0], 'Failed to download');
                assert.equal(arguments[1], expectedErrors.shift());
                assert.equal(arguments[2], 404);
                if (expectedErrors.length === 0) {
                    done();
                }
            }
        };

        parse(html, logger, function (content) {
            assert(false, 'Shouldn\'t hit callback due to download errors');
        });
    });
});
