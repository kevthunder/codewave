'use strict'

const expect = require('chai').expect

const testUtils = require('./testHelpers/testUtils')

const TextParser = require('../lib/TextParser').TextParser

const BoxHelper = require('../lib/BoxHelper').BoxHelper

const bootstrap = require('../lib/bootstrap')

describe('BoxHelper', function () {
  beforeEach(function () {
    this.boxHelper = null
    this.codewave = null
  })
  afterEach(function () {
    delete this.boxHelper
    delete this.codewave
  })
  it('should detect box position', function () {
    var sels, text;
    [text, sels] = testUtils.extractSelections('Lorem ipsum dolor\n|<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  |Lorem ipsum dolor                     ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|\nLorem ipsum dolor')
    this.codewave = new bootstrap.Codewave(new TextParser(text))
    this.boxHelper = new BoxHelper(this.codewave.context)
    return expect(this.boxHelper.getBoxForPos(sels[1]).raw()).to.eql([sels[0].start, sels[2].start])
  })
  it('should detect box position when nested', function () {
    var sels, text;
    [text, sels] = testUtils.extractSelections('Lorem ipsum dolor\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  |<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~ -->    ~ -->\n<!-- ~  <!-- ~  |Lorem ipsum dolor    ~ -->    ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~ -->|    ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\nLorem ipsum dolor')
    this.codewave = new bootstrap.Codewave(new TextParser(text))
    this.boxHelper = new BoxHelper(this.codewave.context)
    return expect(this.boxHelper.getBoxForPos(sels[1]).raw()).to.eql([sels[0].start, sels[2].start])
  })
  it('should detect box width', function () {
    this.codewave = new bootstrap.Codewave(new TextParser(''))
    this.boxHelper = new BoxHelper(this.codewave.context)
    this.boxHelper.getOptFromLine('<!-- ~  123456789  ~ -->', false)
    return expect(this.boxHelper).property('width', 9)
  })
  it('should detect nested box outer width', function () {
    this.codewave = new bootstrap.Codewave(new TextParser(''))
    this.boxHelper = new BoxHelper(this.codewave.context)
    this.boxHelper.getOptFromLine('<!-- ~  <!-- ~  123456789  ~ -->  ~ -->', false)
    return expect(this.boxHelper).property('width', 24)
  })
})
