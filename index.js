var process = require('./parse');

var pullScripts = function (loggerFactory) {
    var logger = loggerFactory.create('preprocessor:pullscripts');

    return function (content, file, done) {
        process(content, logger, done);
    };
};

pullScripts.$inject = [ 'logger' ];

module.exports = {
    'preprocessor:pullscripts': [ 'factory', pullScripts ]
};
