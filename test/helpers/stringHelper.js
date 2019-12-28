'use strict'

const StringHelper = require('../../lib/helpers/StringHelper').StringHelper

const expect = require('chai').expect

describe('StringHelper', function () {
  beforeEach(function () {})
  afterEach(function () {})
  it('should repeat string', function () {
    return expect(StringHelper.repeat('+-', 3)).to.eql('+-+-+-')
  })
  it('should repeat string to length', function () {
    return expect(StringHelper.repeatToLength('+-', 3)).to.eql('+-+')
  })
  it('should reverse string', function () {
    return expect(StringHelper.reverseStr('abcd')).to.eql('dcba')
  })
})
