'use strict';

function cleanCellLine(cellLine) {
    return cellLine.trim();
}

function parseCell(cell, cellLinesToJSON) {
    const cellLines = cell.split("\n").map(cleanCellLine);
    return cellLinesToJSON(cellLines);
}

function findMac(line){
    const macPattern = /([0-9A-F]{2}[:-]){5}([0-9A-F]{2})/ig;
    return macPattern.test(line.toLowerCase());
}

function extractMac(line) {
    const macPattern = /([0-9A-F]{2}[:-]){5}([0-9A-F]{2})/ig;
    return macPattern.exec(line.toLowerCase())[0];
}

module.exports = {
    cleanCellLine,
    parseCell,
    findMac,
    extractMac
};