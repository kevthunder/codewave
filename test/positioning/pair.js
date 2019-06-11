"use strict";

var _Pair = require("../../lib/positioning/Pair");

var _Pos = require("../../lib/positioning/Pos");

var _chai = require("chai");

describe('Pair', function () {
  beforeEach(function () {
    return this.pair = null;
  });
  afterEach(function () {
    return delete this.pair;
  });
  it('should find next opening', function () {
    var res, text;
    this.pair = new _Pair.Pair('1', '2');
    text = "abc 1 2 1 2";
    res = this.pair.matchAny(text);
    (0, _chai.expect)(res).to.exist;
    (0, _chai.expect)(res.start()).to.eql(4);
    return (0, _chai.expect)(res.name()).to.eql('opener');
  });
  it('should find after offset', function () {
    var res, text;
    this.pair = new _Pair.Pair('1', '2');
    text = "abc 1 2 1 2";
    res = this.pair.matchAny(text, 5);
    (0, _chai.expect)(res).to.exist;
    (0, _chai.expect)(res.start()).to.eql(6);
    return (0, _chai.expect)(res.name()).to.eql('closer');
  });
  it('should find next regexp opening', function () {
    var res, text;
    this.pair = new _Pair.Pair(/\d/, /\$/);
    text = "abc 1 $ 1 $";
    res = this.pair.matchAny(text);
    (0, _chai.expect)(res).to.exist;
    (0, _chai.expect)(res.start()).to.eql(4);
    return (0, _chai.expect)(res.name()).to.eql('opener');
  });
  it('should find last closing', function () {
    var res, text;
    this.pair = new _Pair.Pair('1', '2');
    text = "abc 1 2 1 2";
    res = this.pair.matchAnyLast(text);
    (0, _chai.expect)(res).to.exist;
    (0, _chai.expect)(res.start()).to.eql(10);
    return (0, _chai.expect)(res.name()).to.eql('closer');
  });
  it('should find last regexp closing', function () {
    var res, text;
    this.pair = new _Pair.Pair(/\d/, /\$/);
    text = "abc 1 $ 1 $";
    res = this.pair.matchAnyLast(text);
    (0, _chai.expect)(res).to.exist;
    (0, _chai.expect)(res.start()).to.eql(10);
    return (0, _chai.expect)(res.name()).to.eql('closer');
  });
  it('should match text openner and closer', function () {
    var res, text;
    this.pair = new _Pair.Pair('((', '))');
    text = "abc (( def )) end";
    res = this.pair.wrapperPos(new _Pos.Pos(8), text);
    (0, _chai.expect)(res).to.exist;
    return (0, _chai.expect)(res.raw()).to.eql([4, 13]);
  });
  it('should return null on no match', function () {
    var res, text;
    this.pair = new _Pair.Pair('((', '))');
    text = "abc (( def ) end";
    res = this.pair.wrapperPos(new _Pos.Pos(8), text);
    return (0, _chai.expect)(res).to.not.exist;
  });
  it('should match regexp openner and closer', function () {
    var res, text;
    this.pair = new _Pair.Pair(/#+-+/, /-+#+/);
    text = "abc ##-- def --## end";
    res = this.pair.wrapperPos(new _Pos.Pos(10), text);
    (0, _chai.expect)(res).to.exist;
    return (0, _chai.expect)(res.raw()).to.eql([4, 17]);
  });
  it('should match identical openner and closer', function () {
    var res, text;
    this.pair = new _Pair.Pair('##', '##');
    text = "abc ## def ## end";
    res = this.pair.wrapperPos(new _Pos.Pos(8), text);
    (0, _chai.expect)(res).to.exist;
    return (0, _chai.expect)(res.raw()).to.eql([4, 13]);
  });
  it('should match identical regexp openner and closer', function () {
    var res, text;
    this.pair = new _Pair.Pair(/##/, /##/);
    text = "abc ## def ## end";
    res = this.pair.wrapperPos(new _Pos.Pos(8), text);
    (0, _chai.expect)(res).to.exist;
    return (0, _chai.expect)(res.raw()).to.eql([4, 13]);
  });
  it('should match with optionnal close', function () {
    var res, text;
    this.pair = new _Pair.Pair('((', '))', {
      optionnal_end: true
    });
    text = "abc (( def end";
    res = this.pair.wrapperPos(new _Pos.Pos(8), text);
    (0, _chai.expect)(res).to.exist;
    return (0, _chai.expect)(res.raw()).to.eql([4, 14]);
  });
  return it('should allow match validation', function () {
    var res, text;
    this.pair = new _Pair.Pair(/#+-+/, /-+#+/, {
      validMatch: function (match) {
        return match.length() < 6;
      }
    });
    text = "abc ##-- def ---### --## end";
    res = this.pair.wrapperPos(new _Pos.Pos(10), text);
    (0, _chai.expect)(res).to.exist;
    return (0, _chai.expect)(res.raw()).to.eql([4, 24]);
  });
});
//# sourceMappingURL=../maps/positioning/pair.js.map