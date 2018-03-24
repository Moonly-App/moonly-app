var liveServer = require('live-server');

var params = {
    logLevel: 2,
    port: 9001,
    root: './.ignore/coverage/PhantomJS 2.1.1 (Mac OS X 0.0.0)/lcov-report',
    open: false,
    wait: 500,
};

liveServer.start(params);
