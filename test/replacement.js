"use strict";

var _chai = require("chai");

var _TextParser = require("../lib/TextParser");

var _Replacement = require("../lib/positioning/Replacement");

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
    this.editor = new _TextParser.TextParser('lorem Ipsum');
    this.replacement = new _Replacement.Replacement(1, 2, 'a');
    (0, _chai.expect)(this.replacement).to.respondTo('withEditor');
    (0, _chai.expect)(this.replacement).to.respondTo('editor');
    this.replacement.withEditor(this.editor);
    return (0, _chai.expect)(this.replacement.editor()).to.eql(this.editor);
  });
  return it('should take prefix option', function () {
    this.editor = new _TextParser.TextParser('lorem Ipsum');
    this.replacement = new _Replacement.Replacement(1, 2, 'a', {
      prefix: 'test'
    }).withEditor(this.editor);
    return (0, _chai.expect)(this.replacement.prefix).to.eql('test');
  });
});
//# sourceMappingURL=maps/replacement.js.map
