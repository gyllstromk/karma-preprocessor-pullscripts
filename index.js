var process = require('./parse');

var pullScripts = function (loggerFactory, config) {
    var logger = loggerFactory.create('preprocessor:pullscripts');
    config = typeof config === 'object' ? config : {};

    return function (content, file, done) {
        process(config, content, logger, done);
    };
};

pullScripts.$inject = [ 'logger', 'config.pullscripts' ];

module.exports = {
    'preprocessor:pullscripts': [ 'factory', pullScripts ]
};
