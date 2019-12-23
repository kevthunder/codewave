"use strict";

const StringHelper = require("../../lib/helpers/StringHelper");

const chai = require("chai");

describe('StringHelper', function () {
  beforeEach(function () {});
  afterEach(function () {});
  it('should repeat string', function () {
    return (0, chai.expect)(StringHelper.StringHelper.repeat('+-', 3)).to.eql('+-+-+-');
  });
  it('should repeat string to length', function () {
    return (0, chai.expect)(StringHelper.StringHelper.repeatToLength('+-', 3)).to.eql('+-+');
  });
  return it('should reverse string', function () {
    return (0, chai.expect)(StringHelper.StringHelper.reverseStr('abcd')).to.eql('dcba');
  });
});

