# netaddr.js

Node.js utility package for working with IP addresses and CIDR ranges.

## Installation

```
$ npm install netaddr --save
```

## Usage

``` javascript
var Addr = require('netaddr').Addr;

// Create a fixed IP address from a string
var localhost = Addr('127.0.0.1');

// Create  CIDR range from a string
var subnet = Addr('10.0.0.0/16');

// Create a CIDR range from an integer and prefix
var subnet = Addr(167772160, 16);

// Convert an IP address to an integer
var intval = Addr('127.0.0.1').toInt();

// Get the network address
var network = subnet.network();

// Get the broadcast address
var broadcast = subnet.broadcast();

// Check if one CIDR contains another CIDR or IP
subnet.contains(Addr('10.0.3.0/24')); // true

// Check where two CIDRs intersect
subnet.intersect(Addr('10.0.3.0/24'));

// Increment an address (non-mutating)
localhost.increment();

// Decrement an address (non-mutating)
localhost.decrement();
```

Attempts to create an invalid `Addr` will throw an `Error`.

## Copyright & License

Copyright © 2015 Chris Corbyn. See the LICENSE file for details.