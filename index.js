'use strict';

const WiFiScanner = require('./scanners/wifiscanner');
const darwinparser = require('./parsers/darwinparser');
const linuxparser = require('./parsers/linuxparser');
const windowsparser = require('./parsers/windowsparser');
const nconf = require("nconf");

function platformSelect(options) {
    let platform;
    if(options && options.platform) {
        platform = options.platform;
        delete options.platform;
    }
    return platform || process.platform;
}

function scanner(options) {
    options = options || {}
    const platform = platformSelect(options);
    nconf.file(`${__dirname}/config/${platform}.json`);
    
    let parser;
    switch(platform) {
        case "linux":
            parser = linuxparser;
        break;        
        case "darwin":
            parser = darwinparser;
        break;
        case "win32":
            parser = windowsparser;
        break;
    }
    
    const scannerOptions = {
        binaryPath: options.binaryPath || nconf.get("binaryPath"),
        args: options.args || nconf.get("args"),
    }
    return new WiFiScanner(scannerOptions, parser);
};

module.exports = scanner;