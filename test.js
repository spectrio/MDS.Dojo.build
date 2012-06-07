var fs = require("./lib/fs").fs;
var log = require("./lib/log").log('TEST', 1);

log('======================================================================================');

fs.copy('./tests/copyme', './tests/copyto');
