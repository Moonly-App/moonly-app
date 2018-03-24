var liveServer = require('live-server');

var params = {
    logLevel: 2,
    port: 9000,
    root: './.ignore/sandbox',
    open: false,
    wait: 0,
};

liveServer.start(params);
