"use strict";

const chai = require("chai");

const TextParser = require("../../lib/TextParser");

const Wrapping = require("../../lib/positioning/Wrapping");

describe('Wrapping', function () {
  beforeEach(function () {
    this.wrapping = null;
    return this.editor = null;
  });
  afterEach(function () {
    delete this.wrapping;
    return delete this.editor;
  });
  return it('editor should be settable', function () {
    this.editor = new TextParser.TextParser('lorem Ipsum');
    this.wrapping = new Wrapping.Wrapping(0, 5, '(', ')');
    (0, chai.expect)(this.wrapping).to.respondTo('withEditor');
    (0, chai.expect)(this.wrapping).to.respondTo('editor');
    this.wrapping.withEditor(this.editor);
    return (0, chai.expect)(this.wrapping.editor()).to.eql(this.editor);
  });
});

