var assert = require('assert');


describe('pullscripts', function () {
    var request = require('request');
    var fs = require('fs');
    
    var parse = require('./parse');
    
    var html = '<html>' +
                   '<head>' +
                        '<script src="http://firstUrl.com"></script>' +
                        '<script src="//secondUrl.com"></script>' +
                        '<script src="./localFileIncluded.js"></script>' +
                   '</head>' +
               '</html>';

    var urls = [ 'http://firstUrl.com', 'http://secondUrl.com', 'dist/./localFileIncluded.js' ];
    var config = { filePrefix: 'dist/' };

    var logger = {
	error: function () {  },
	debug: function() {}
    };
    
    it('downloads eligible script files', function (done) {
        request.get = function (url, callback) {
            callback(null, { statusCode: 200 }, url);
        };
	fs.readFile = function(url, callback) {
	    callback(null, url);
	};

        parse(config, html, logger, function (content) {
            assert.equal(content, urls.join('\n'));
            done();
        });
    });

    it('logs error', function (done) {
        request.get = function (url, callback) {
            callback(null, { statusCode: 404 }, url);
        };
	fs.readFile = function(url, callback) {
	    callback('Fail', null);
	};



        var expectedErrors = urls.slice();
	
	logger.error = function () {
	    var url = expectedErrors.shift();
	    if (url.match(/^http/)) {
		assert.equal(arguments[0], 'Failed to download');
		assert.equal(arguments[1], url);
		assert.equal(arguments[2], 404);
	    } else {
		assert.equal(arguments[0], 'Failed to read');
		assert.equal(arguments[1], url);
		assert.equal(arguments[2], 'Fail');
	    }

	    if (expectedErrors.length === 0) {
		done();
	    }
	}
	
        parse(config, html, logger, function (content) {
            assert(false, 'Shouldn\'t hit callback due to download errors');
        });
    });
});
