'use strict';

const childProcess = require("child_process");

module.exports = class WifiScanner {
    constructor(options, parser) {
        this.parser = parser;
        this.options = options;
	}	
    
	scan(callback, standardErrorCallback) {
        childProcess.exec(this.command,  (error, standardOut, standardError) => {
            if (standardError && typeof standardErrorCallback === "function") {
                standardErrorCallback(standardError);
            }
            callback(error, this.parse(standardOut.toString()));
        });
    }
	
	get command() {
		return this.options.binaryPath + " " + this.options.args;
	}

    parse(data) {
        return this.parser(data);
    }
}