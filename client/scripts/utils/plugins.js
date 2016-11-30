var relayPlugin = require('../../plugins/relay');

var start = function() {
    return Promise.all([
        (relayPlugin.isEnabled()) ? relayPlugin.start() : false,
    ])
}

var build = function() {
    return Promise.all([
        (relayPlugin.isEnabled()) ? relayPlugin.build() : false,
    ])
}

module.exports = {
    start: start,
    build: build,
}
