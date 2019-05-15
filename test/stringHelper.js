"use strict";

var _StringHelper = require("../lib/helpers/StringHelper");

var _chai = require("chai");

describe('StringHelper', function () {
  beforeEach(function () {});
  afterEach(function () {});
  it('should repeat string', function () {
    return (0, _chai.expect)(_StringHelper.StringHelper.repeat('+-', 3)).to.eql('+-+-+-');
  });
  it('should repeat string to length', function () {
    return (0, _chai.expect)(_StringHelper.StringHelper.repeatToLength('+-', 3)).to.eql('+-+');
  });
  return it('should reverse string', function () {
    return (0, _chai.expect)(_StringHelper.StringHelper.reverseStr('abcd')).to.eql('dcba');
  });
});
//# sourceMappingURL=maps/stringHelper.js.map
