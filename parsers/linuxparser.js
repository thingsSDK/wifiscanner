'use strict';

const common = require('./common');

module.exports = function parse(data) {
    const cells = data.split(/Cell \d{2} - /g);
    if(~cells[0].toLocaleLowerCase().indexOf("scan complete")) {
        cells.shift();
    }
    return cells.map(cell => common.parseCell(cell,cellLinesToJSON));
}

function cellLinesToJSON(cellLines) {
    return {
        ssid:       cellLines.filter(findSsid).map(extractSsid)[0],
        mac:        cellLines.filter(common.findMac).map(common.extractMac)[0],
        channel:    cellLines.filter(findChannel).map(extractChannel)[0],
        security:   cellLines.filter(findSecurity).map(extractSecurity)
    };
}

function findSsid(line) {
    return ~line.toLowerCase().indexOf("essid");
}

function extractSsid(line) {
    const ssidPattern = /\essid:"(.*)\"/gi;
    return ssidPattern.exec(line)[1];
}

function findChannel(line) {
    const channelPattern  = /Channel (\d+)/gi;
    return channelPattern.test(line);
}

function extractChannel(line) {
    const channelPattern  = /Channel (\d+)/gi;
    return channelPattern.exec(line)[1];
}

function findSecurity(line) {
    const encryptionPattern = /(encryption key:off|wpa(\d)? version|wep)/gi;
    return encryptionPattern.test(line);
}

function extractSecurity(line){
    const noEncryption = /Encryption key:off/gi;
    const wpa1 = /wpa version/gi;
    const wpa2 = /wpa2 version/gi;

    if(noEncryption.test(line))
        return "None";
    else if(wpa1.test(line))
        return "WPA";
    else if(wpa2.test(line))
        return "WPA2";
    else
        return "WEP";
}