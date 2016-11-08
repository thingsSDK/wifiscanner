'use strict';

const assert = require("chai").assert;
const path = require("path")
const wifiscanner = require("../");
const binaryPath = process.platform === "win32" ? "type" : "cat";

const NETWORKS = [
    {
        ssid: 'wifi with-n0-s3cur1ty!',
        mac: '16:0d:7f:49:da:e1',
        channel: '1',
        security: ['None']
    },
    {
        ssid: 'WEP enabled',
        mac: '16:0d:7f:49:da:e2',
        channel: '1',
        security: ['WEP']
    },
    {
        ssid: 'WPA1 Enabled',
        mac: '16:0d:7f:49:da:e3',
        channel: '1',
        security: ['WPA']
    },
    {
        ssid: 'WPA1+WPA2',
        mac: '16:0d:7f:49:da:e4',
        channel: '1',
        security: ['WPA', 'WPA2'],
    },
    {
        ssid: 'WPA2 Only',
        mac: '16:0d:7f:49:da:e5',
        channel: '1',
        security: ['WPA2']
    }
];

const NETWORKS_WIN32 = [
    {
        ssid: 'wifi with-n0-s3cur1ty!',
        mac: '16:0d:7f:49:da:e1',
        channel: '1',
        security: ['None']
    },
    {
        ssid: 'WEP enabled',
        mac: '16:0d:7f:49:da:e2',
        channel: '1',
        security: ['WEP']
    },
    {
        ssid: 'WPA1 Enabled',
        mac: '16:0d:7f:49:da:e3',
        channel: '1',
        security: ['WPA']
    },
    {
        ssid: 'WPA1+WPA2',
        mac: '16:0d:7f:49:da:e4',
        channel: '1',
        security: ['WPA2'],
    },
    {
        ssid: 'WPA2 Only',
        mac: '16:0d:7f:49:da:e5',
        channel: '1',
        security: ['WPA2']
    }
];

function sortBySSIDs(network, otherNetowrk) {
    if (network.ssid < otherNetowrk.ssid)
        return -1;
    else if (network.ssid > otherNetowrk.ssid)
        return 1;
    else return 0;
}

function crossPlatformTest(error, networks, expected_networks, done) {
    assert.isArray(networks, "should be an array");
    assert.lengthOf(networks, 5, "The networks array should be 5 in length");
    assert.deepEqual(networks.sort(sortBySSIDs), expected_networks.sort(sortBySSIDs), "Networks were not as expected");
    done();
}

describe("WifiScanner", () => {
    describe("scan",  () => {
        it("on a mac", done => {
            var scanner = wifiscanner({ platform: "darwin", args: path.join("test", "darwin.txt"), binaryPath });
            scanner.scan(function (error, networks) {
                crossPlatformTest(error, networks, NETWORKS, done);
            });
        });

        it("on a linux", done => {
            var scanner = wifiscanner({ platform: "linux", args: path.join("test", "linux.stdout.txt"), binaryPath });
            scanner.scan((error, networks) => {
                crossPlatformTest(error, networks, NETWORKS, done);
            });
        });

        it("on a win32", function (done) {
            var scanner = wifiscanner({ platform: "win32", args: path.join("test", "win32.txt"), binaryPath });
            scanner.scan((error, networks) => {
                crossPlatformTest(error, networks, NETWORKS_WIN32, done);
            });
        });

        it("should handle standard errors", function (done) {
            var scanner = wifiscanner({ platform: "linux", args: path.join("test", "iwlist_mock.js"),  binaryPath: "node" });
            scanner.scan((error, networks) => {

            }, standardError => {
                assert.typeOf(standardError, 'string');
                done();
            });
        });
    });
});
