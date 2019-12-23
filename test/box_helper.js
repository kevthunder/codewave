"use strict";

const chai = require("chai");

const test_utils = require("./testHelpers/test_utils");

const TextParser = require("../lib/TextParser");

const BoxHelper = require("../lib/BoxHelper");

const bootstrap = require("../lib/bootstrap");

describe('BoxHelper', function () {
  beforeEach(function () {
    this.boxHelper = null;
    return this.codewave = null;
  });
  afterEach(function () {
    delete this.boxHelper;
    return delete this.codewave;
  });
  it('should detect box position', function () {
    var sels, text;
    [text, sels] = (0, test_utils.extractSelections)("Lorem ipsum dolor\n|<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  |Lorem ipsum dolor                     ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|\nLorem ipsum dolor");
    this.codewave = new bootstrap.Codewave(new TextParser.TextParser(text));
    this.boxHelper = new BoxHelper.BoxHelper(this.codewave.context);
    return (0, chai.expect)(this.boxHelper.getBoxForPos(sels[1]).raw()).to.eql([sels[0].start, sels[2].start]);
  });
  it('should detect box position when nested', function () {
    var sels, text;
    [text, sels] = (0, test_utils.extractSelections)("Lorem ipsum dolor\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\n<!-- ~  |<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~ -->    ~ -->\n<!-- ~  <!-- ~  |Lorem ipsum dolor    ~ -->    ~ -->\n<!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~ -->|    ~ -->\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->\nLorem ipsum dolor");
    this.codewave = new bootstrap.Codewave(new TextParser.TextParser(text));
    this.boxHelper = new BoxHelper.BoxHelper(this.codewave.context);
    return (0, chai.expect)(this.boxHelper.getBoxForPos(sels[1]).raw()).to.eql([sels[0].start, sels[2].start]);
  });
  it('should detect box width', function () {
    this.codewave = new bootstrap.Codewave(new TextParser.TextParser(''));
    this.boxHelper = new BoxHelper.BoxHelper(this.codewave.context);
    this.boxHelper.getOptFromLine('<!-- ~  123456789  ~ -->', false);
    return (0, chai.expect)(this.boxHelper).property('width', 9);
  });
  return it('should detect nested box outer width', function () {
    this.codewave = new bootstrap.Codewave(new TextParser.TextParser(''));
    this.boxHelper = new BoxHelper.BoxHelper(this.codewave.context);
    this.boxHelper.getOptFromLine('<!-- ~  <!-- ~  123456789  ~ -->  ~ -->', false);
    return (0, chai.expect)(this.boxHelper).property('width', 24);
  });
});

