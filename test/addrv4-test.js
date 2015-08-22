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
});
