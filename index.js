var AddrV4 = require('./lib/addrv4').Addr;

module.exports = {
  /*! Implementation of IPv4/CIDR */
  AddrV4: AddrV4,
  /*! Wrapper class to implement both IPv4 and IPv6 */
  Addr: AddrV4,
};
