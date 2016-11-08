# WiFi Scanner

[![Build Status](https://travis-ci.org/thingsSDK/wifiscanner.svg?branch=master)](https://travis-ci.org/thingsSDK/wifiscanner)
[![Dependency Status](https://david-dm.org/thingssdk/wifiscanner.svg)](https://david-dm.org/thingssdk/wifiscanner)
[![devDependency Status](https://david-dm.org/thingssdk/wifiscanner/dev-status.svg)](https://david-dm.org/thingssdk/wifiscanner#info=devDependencies)

A simple Node.js WiFi Scanner for Windows, Linux and macOS. Works great on embedded devices like the Raspberry Pi.

## Installation

```
npm install wifiscanner
```

## Basic Usage

1. Require `wifiscanner`
2. Create an instance of a `scanner`
3. Call `scan` with a callback with two parameters
4. Profit?

```javascript
const wifiscanner = require("wifiscanner");

//Returns appropriate instance of a wifi scanner
const scanner = wifiscanner();

scanner.scan((error, networks) => {
    if(error) {
        console.error(error);
    } else {
        console.dir(networks);
    }
});

```

Network is an `Array` of nearby networks. Each network will have the following keys:

* ssid
* mac
* channel
* security (`Array` e.g `[ 'WPA', 'WPA2' ]`)


### JSON Sample Output

```
[
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
]
```

There is a limitation on _Windows_. If there is a network that is both `WPA` and `WPA2` security, only `WPA2` will be reported.

## Less Basic Usage

### Custom binaries and arguments

You can specify binary (`binaryPath`) and arguments (`args`) in a set of `options`.

```javascript
const wifiscanner = require("wifiscanner");


//Options
const options = {
    args: "wlan2 scan",
    binaryPath: "/path/to/iwlist"
}

const scanner = wifiscanner(options);

scanner.scan(function(error, networks){
    if(error) {
        console.error(error);
    } else {
        console.dir(networks);
    }
});

```

### Handling stderr

Standard error can is more of a warning. For example, if you're on Linux with `wlan0`, `en0` and `lo`
and you run the `iwlist scan` command you get both the `stdout` of the networks on the `wlan0` network interface
(which is parsed in to the `networks` `Array`) and the `stderr` of:

```
lo        Interface doesn't support scanning.

eth0      Interface doesn't support scanning.
```

The default behavior from this module is to do nothing. However, you can pass in a second _optional_ callback to the
`scan` method and do what you want with it.

```javascript
const wifiscanner = require("wifiscanner");


//Options
const options = {
    args: "wlan2 scan",
    binaryPath: "/path/to/iwlist"
}

const scanner = wifiscanner(options);

scanner.scan(function(error, networks){
    //...
}, function(standardError){
    console.error(standardError);
});

```