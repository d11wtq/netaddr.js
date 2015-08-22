'use strict';

var util = require('util');

/**
 * Representation of an IP address or CIDR.
 *
 * @constructor
 *
 * @param {Object} address
 *   either a string or an integer
 *
 * @param {Number} prefix, optional
 *   the length of the netmask prefix
 *
 * @throws {Error}
 *   if the address is not valid
 */
module.exports.Addr = function(address, prefix) {
  var self = this
    /*! The address used when not specified */
    , DEFAULT_ADDRESS = 0
    /*! The prefix length used when not specified */
    , DEFAULT_PREFIX = 32
    /* Internal cache of the integer value */
    , cache = undefined
    ;

  /**
   * Replace this Addr with an new value.
   *
   * @param {Object} address
   *   either a string or an integer
   *
   * @param {Number} prefix, optional
   *   the length of the netmask prefix
   *
   * @return {Addr}
   *   returns `this` so operations can be chained
   *
   * @throws {Error}
   *   if the address if not valid
   */
  self.set = function(address, prefix) {
    try {
      switch (typeof address) {
        case 'undefined':
          return self.set(DEFAULT_ADDRESS, prefix);

        case 'string':
          return parseString(address, prefix);

        case 'number':
          return parseNumber(address, prefix);

        default:
          throw new Error(
            util.format(
              'Invalid Addr type: %s',
              (typeof address)
            )
          );
      }
    } catch (e) {
      throw new Error(util.format('Invalid Addr: %s', address));
    }
  };

  /**
   * Return the integer representation of this Addr.
   *
   * @return {Number}
   *   the integer value of the Addr
   */
  self.toInt = function() {
    if (typeof cache == 'undefined') {
      cache = Array.apply([], self.octets)
        .reverse()
        .map(function(octet, offset){
          return octet * (1 << offset * 8);
        })
        .reduce(function(x, y){
          return x + y;
        });
    }

    return cache;
  };

  /*! Set the initial value */
  self.set(address, prefix);

  // -- Private

  /*! Set the internal parsed structures */
  function setInternal(octets, prefix) {
    cache = undefined;
    setProperty('octets', octets);
    setProperty('prefix', prefix);
    return self;
  }

  /*! Define a read-only property */
  function setProperty(key, value) {
    Object.defineProperty(self, key, {value: value, enumerable: true});
  }

  /*! Parse an IPv4 address string with optional prefix */
  function parseString(address, prefix) {
    var parts = address.split('/')
      , prefix = (
        typeof prefix == 'undefined'
          ? (parts[1] || DEFAULT_PREFIX)
          : prefix
      );

    if (parts.length > 2) {
      throw new Error(util.format('Invalid Addr: %s', address));
    }

    return setInternal(
      parts[0].split('.').map(function(n){
        return parseByte(n, 255)
      }),
      parseByte(prefix, 32)
    );
  }

  /*! Parse an IPv4 address integer with optional prefix */
  function parseNumber(address, prefix) {
    var prefix = (
        typeof prefix == 'undefined'
          ? DEFAULT_PREFIX
          : prefix
      );

    if (address > 0xFFFFFFFF || address < 0) {
      throw new Error(util.format('Invalid Addr: %s', address));
    }

    return setInternal(
      [255, 255, 255, 255]
        .map(function(octet, offset){
          return (address >>> (offset * 8)) & octet;
        })
        .reverse(),
      parseByte(prefix, 32)
    );
  }
};

/**
 * Perform a parseInt(), only if a valid byte value with an optional max.
 *
 * @param {String} n
 *   the value to parse
 *
 * @param {Number} max
 *   the maximum allowed value
 *
 * @return {Number}
 *   the parsed integer
 */
function parseByte(n, max) {
  max = max || 255;

  if (/^[0-9]+$/.test(n)) {
    var m = parseInt(n);
    if (m <= max) {
      return m;
    }
  }

  throw new Error(
    util.format(
      '%s: must be a decimal value <= %d',
      n,
      max
    )
  );
}
