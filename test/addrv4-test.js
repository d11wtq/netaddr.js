'use strict';

var assert = require('assert')
  , Addr = require('../lib/addrv4').Addr
  ;

describe('addrv4', function(){
  describe('#octets', function(){
    describe('with a string', function(){
      it('returns the parsed octets', function(){
        assert.deepEqual([10, 0, 52, 138], new Addr('10.0.52.138').octets);
      });
    });

    describe('with a number', function(){
      it('returns the computed octets', function(){
        assert.deepEqual([127, 0, 0, 1], new Addr(2130706433).octets);
      });
    });
  });

  describe('#prefix', function(){
    describe('when part of the cidr', function(){
      it('returns the decimal value', function(){
        assert.equal(24, new Addr('1.1.1.1/24').prefix);
      });
    });

    describe('when explicitly provided', function(){
      it('returns the decimal value', function(){
        assert.equal(22, new Addr('1.1.1.1/24', 22).prefix);
      });
    });

    describe('when unspecified', function(){
      it('returns 32', function(){
        assert.equal(32, new Addr('1.1.1.1').prefix);
      });
    });
  });

  describe('#toInt()', function(){
    it('returns the numeric value', function(){
      assert.deepEqual(2130706433, new Addr('127.0.0.1').toInt());
    });
  });

  describe('#toString()', function(){
    it('returns the dotted notation with the prefix', function(){
      assert.equal('127.0.0.1/18', new Addr(2130706433, 18).toString());
    });
  });

  describe('#equals', function(){
    describe('with the same address and prefix', function(){
      it('returns true', function(){
        assert(
          new Addr('127.0.0.1/16')
            .equals(new Addr(2130706433, 16))
        );
      });
    });

    describe('with a different address', function(){
      it('returns false', function(){
        assert(
          !new Addr('127.0.0.1/16')
            .equals(new Addr(2000000000, 16))
        );
      });
    });

    describe('with a different prefix', function(){
      it('returns false', function(){
        assert(
          !new Addr('127.0.0.1/16')
            .equals(new Addr(2130706433, 15))
        );
      });
    });

    describe('with a non Addr', function(){
      it('returns false', function(){
        assert(!new Addr('127.0.0.1/16').equals(42));
      });
    });
  });

  describe('#netmask()', function(){
    describe('at prefix zero', function(){
      it('returns the Addr of the mask', function(){
        assert.equal(
          '0.0.0.0/32',
          new Addr('1.1.1.1/0').netmask().toString()
        );
      });
    });

    describe('at prefix 32', function(){
      it('returns the Addr of the mask', function(){
        assert.equal(
          '255.255.255.255/32',
          new Addr('1.1.1.1/32').netmask().toString()
        );
      });
    });

    describe('at prefix 1-31', function(){
      it('returns the Addr of the mask', function(){
        assert.equal(
          '255.255.252.0/32',
          new Addr('1.1.1.1/22').netmask().toString()
        );
      });
    });
  });

  describe('#network()', function(){
    describe('at prefix zero', function(){
      it('returns the Addr of the network', function(){
        assert.equal(
          '0.0.0.0/32',
          new Addr('1.1.1.1/0').network().toString()
        );
      });
    });

    describe('at prefix 32', function(){
      it('returns the Addr of the network', function(){
        assert.equal(
          '1.1.1.1/32',
          new Addr('1.1.1.1/32').network().toString()
        );
      });
    });

    describe('at prefix 1-31', function(){
      it('returns the Addr of the network', function(){
        assert.equal(
          '10.3.0.0/32',
          new Addr('10.3.0.1/16').network().toString()
        );
      });
    });
  });

  describe('#broadcast', function(){
    describe('at prefix zero', function(){
      it('returns the Addr of the broadcast address', function(){
        assert.equal(
          '255.255.255.255/32',
          new Addr('1.1.1.1/0').broadcast().toString()
        );
      });
    });

    describe('at prefix 32', function(){
      it('returns the Addr of the broadcast address', function(){
        assert.equal(
          '1.1.1.1/32',
          new Addr('1.1.1.1/32').broadcast().toString()
        );
      });
    });

    describe('at prefix 1-31', function(){
      it('returns the Addr of the broadcast address', function(){
        assert.equal(
          '10.3.255.255/32',
          new Addr('10.3.0.1/16').broadcast().toString()
        );
      });
    });
  });

  describe('#contains()', function(){
    describe('with an Addr inside the network range', function(){
      it('returns true', function(){
        assert(new Addr('10.0.0.0/16').contains(new Addr('10.0.3.0/24')));
      });
    });

    describe('with an Addr larger than the network range', function(){
      it('returns false', function(){
        assert(!new Addr('10.0.0.0/24').contains(new Addr('10.0.0.3/16')));
      });
    });

    describe('with an Addr outside the network range', function(){
      it('returns false', function(){
        assert(!new Addr('10.0.0.0/24').contains(new Addr('10.3.0.0/24')));
      });
    });
  });
});
