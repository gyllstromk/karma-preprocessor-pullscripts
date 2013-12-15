var cheerio = require('cheerio'),
    request = require('request'),
    async   = require('async');

var process = module.exports = function (content, logger, callback) {
    var html    = cheerio.load(content),
        urls    = [];

    html('script').each(function (index, obj) {
        var src = obj.attribs.src,
            url = null;

        if (src) {
            if (src.match(/^http/)) {
                urls.push(src);
            } else if (src.match(/^\/\//)) {
                urls.push('http:' + src);
            }
        }
    });

    async.map(urls, function (each, callback) {
        request.get(each, function (err, resp, body) {
            if (err || (resp && resp.statusCode !== 200)) {
                err = err || resp.statusCode;
                logger.error('Failed to download', each, err);
                return callback(err);
            }

            callback(null, body);
        });
    }, function (err, content) {
        if (err) {
            return;
        }

        callback(content.join('\n'));
    });
};
