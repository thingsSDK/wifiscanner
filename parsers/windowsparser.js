'use strict';

const common = require('./common');

module.exports = function parse(data) {
    let cells = data.split(/SSID \d{1,2} : /g);
    cells = cells.filter(cell => cell.indexOf("Interface name") == -1)
    return cells.map(cell => common.parseCell(cell, cellLinesToJSON));
}

function cellLinesToJSON(cellLines) {
    return {
        ssid:       cellLines[0],
        mac:        cellLines.filter(common.findMac).map(common.extractMac)[0],
        channel:    cellLines.filter(findChannel).map(extractChannel)[0],
        security:   cellLines.map(findSecurity).filter(value => value).map(extractSecurity)
    }
}

function findChannel(line) {
    const channelPattern  = /Channel\s+:?\s+(\d+)/gi;
    return channelPattern.test(line);
}

function extractChannel(line) {
    const channelPattern  = /Channel\s+:?\s+(\d+)/gi;
    return channelPattern.exec(line)[1];
}

function findSecurity(line, index, lines) {
    if(~line.indexOf("Authentication")) {
        return `${lines[index]}\n${lines[index + 1]}`;
    } 
}

function extractSecurity(line) {
    const noEncryption = /None/gi;
    const wpa1 = /wpa-/gi;
    const wpa2 = /wpa2-/gi;

    if(noEncryption.test(line))
        return "None";
    else if(wpa1.test(line))
        return "WPA";
    else if(wpa2.test(line))
        return "WPA2";
    else
        return "WEP";
}