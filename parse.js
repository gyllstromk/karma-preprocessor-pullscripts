var cheerio = require('cheerio'),
    request = require('request'),
    fs      = require('fs');
    async   = require('async');

var process = module.exports = function (config, content, logger, callback) {
    var html    = cheerio.load(content),
    urls    = [],
    filePrefix = config.filePrefix ? config.filePrefix: '';


    html('script').each(function (index, obj) {
        var src = obj.attribs.src;

        if (src) {
            if (src.match(/^http/)) {
                urls.push(src);
            } else if (src.match(/^\/\//)) {
                urls.push('http:' + src);
            } else {
		        urls.push(filePrefix + src);
	        }
        }
    });

    function getUrl(url, callback) {
        request.get(url, function (err, resp, body) {
            if (err || (resp && resp.statusCode !== 200)) {
                err = err || resp.statusCode;
                logger.error('Failed to download', url, err);
                return callback(err);
            }
            callback(null, body);
        });
    }

    function getFile(url, callback) {
        fs.readFile(url, function(err, data) {
            if (err) {
                logger.error('Failed to read', url, err);
                return callback(err);
            }
            callback(null, data);
        });

    }

    async.map(urls, function (each, callback) {
        logger.debug(each);
        if (each.match(/^http/)) {
            getUrl(each, callback);
        } else {
            getFile(each, callback);
        }
    }, function (err, content) {
        if (err) {
            return;
        }

        var s = content.join('\n');
        callback(s);
    });

};
