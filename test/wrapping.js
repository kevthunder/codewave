"use strict";

var _chai = require("chai");

var _TextParser = require("../lib/TextParser");

var _Wrapping = require("../lib/positioning/Wrapping");

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
    this.editor = new _TextParser.TextParser('lorem Ipsum');
    this.wrapping = new _Wrapping.Wrapping(0, 5, '(', ')');
    (0, _chai.expect)(this.wrapping).to.respondTo('withEditor');
    (0, _chai.expect)(this.wrapping).to.respondTo('editor');
    this.wrapping.withEditor(this.editor);
    return (0, _chai.expect)(this.wrapping.editor()).to.eql(this.editor);
  });
});
//# sourceMappingURL=maps/wrapping.js.map
