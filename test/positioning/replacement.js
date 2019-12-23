"use strict";

const chai = require("chai");

const TextParser = require("../../lib/TextParser");

const Replacement = require("../../lib/positioning/Replacement");

describe('Replacement', function () {
  beforeEach(function () {
    this.replacement = null;
    return this.editor = null;
  });
  afterEach(function () {
    delete this.replacement;
    return delete this.editor;
  });
  it('editor should be settable', function () {
    this.editor = new TextParser.TextParser('lorem Ipsum');
    this.replacement = new Replacement.Replacement(1, 2, 'a');
    (0, chai.expect)(this.replacement).to.respondTo('withEditor');
    (0, chai.expect)(this.replacement).to.respondTo('editor');
    this.replacement.withEditor(this.editor);
    return (0, chai.expect)(this.replacement.editor()).to.eql(this.editor);
  });
  return it('should take prefix option', function () {
    this.editor = new TextParser.TextParser('lorem Ipsum');
    this.replacement = new Replacement.Replacement(1, 2, 'a', {
      prefix: 'test'
    }).withEditor(this.editor);
    return (0, chai.expect)(this.replacement.prefix).to.eql('test');
  });
});

