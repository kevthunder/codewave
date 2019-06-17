"use strict";

var _ParamParser = require("../lib/ParamParser");

var _chai = require("chai");

describe('ParamParser', function () {
  it('can see positionned params', function () {
    var parser;
    parser = new _ParamParser.ParamParser('hello world');
    (0, _chai.expect)(parser.params).to.deep.eq(['hello', 'world']);
    return (0, _chai.expect)(parser.named).to.deep.eq({});
  });
  it('can see named params', function () {
    var parser;
    parser = new _ParamParser.ParamParser('greeting:hello who:world');
    (0, _chai.expect)(parser.params).to.deep.eq([]);
    return (0, _chai.expect)(parser.named).to.deep.eq({
      greeting: 'hello',
      who: 'world'
    });
  });
  it('can see named and positionned params', function () {
    var parser;
    parser = new _ParamParser.ParamParser('hello who:world');
    (0, _chai.expect)(parser.params).to.deep.eq(['hello']);
    return (0, _chai.expect)(parser.named).to.deep.eq({
      who: 'world'
    });
  });
  it('can see positionned params with named first', function () {
    var parser;
    parser = new _ParamParser.ParamParser('who:world hello');
    (0, _chai.expect)(parser.params).to.deep.eq(['hello']);
    return (0, _chai.expect)(parser.named).to.deep.eq({
      who: 'world'
    });
  });
  it('sees not allowed named as positionned', function () {
    var parser;
    parser = new _ParamParser.ParamParser('hello:world', {
      allowedNamed: []
    });
    (0, _chai.expect)(parser.params).to.deep.eq(['hello:world']);
    return (0, _chai.expect)(parser.named).to.deep.eq({});
  });
  it('sees allowed named', function () {
    var parser;
    parser = new _ParamParser.ParamParser('who:world hello', {
      allowedNamed: ['who']
    });
    (0, _chai.expect)(parser.params).to.deep.eq(['hello']);
    return (0, _chai.expect)(parser.named).to.deep.eq({
      who: 'world'
    });
  });
  it('can see explicit string', function () {
    var parser;
    parser = new _ParamParser.ParamParser('"hello there" world');
    (0, _chai.expect)(parser.params).to.deep.eq(['hello there', 'world']);
    return (0, _chai.expect)(parser.named).to.deep.eq({});
  }); //   it 'can see escaped quote in string', ->
  //     parser = new ParamParser('"hello \\"there" world');
  //     expect(parser.params).to.deep.eq(['hello "there','world'])
  //     expect(parser.named).to.deep.eq({})

  return it('can see explicit string in named', function () {
    var parser;
    parser = new _ParamParser.ParamParser('greeting:"hello there" world');
    (0, _chai.expect)(parser.params).to.deep.eq(['world']);
    return (0, _chai.expect)(parser.named).to.deep.eq({
      greeting: 'hello there'
    });
  });
});
//# sourceMappingURL=maps/paramParser.js.map
