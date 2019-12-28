'use strict'

const ParamParser = require('../../lib/stringParsers/ParamParser').ParamParser

const chai = require('chai')

describe('ParamParser', function () {
  it('can see positionned params', function () {
    var parser
    parser = new ParamParser('hello world');
    (0, chai.expect)(parser.params).to.deep.eq(['hello', 'world'])
    return (0, chai.expect)(parser.named).to.deep.eq({})
  })
  it('can see named params', function () {
    var parser
    parser = new ParamParser('greeting:hello who:world');
    (0, chai.expect)(parser.params).to.deep.eq([])
    return (0, chai.expect)(parser.named).to.deep.eq({
      greeting: 'hello',
      who: 'world'
    })
  })
  it('can see named and positionned params', function () {
    var parser
    parser = new ParamParser('hello who:world');
    (0, chai.expect)(parser.params).to.deep.eq(['hello'])
    return (0, chai.expect)(parser.named).to.deep.eq({
      who: 'world'
    })
  })
  it('can see positionned params with named first', function () {
    var parser
    parser = new ParamParser('who:world hello');
    (0, chai.expect)(parser.params).to.deep.eq(['hello'])
    return (0, chai.expect)(parser.named).to.deep.eq({
      who: 'world'
    })
  })
  it('sees not allowed named as positionned', function () {
    var parser
    parser = new ParamParser('hello:world', {
      allowedNamed: []
    });
    (0, chai.expect)(parser.params).to.deep.eq(['hello:world'])
    return (0, chai.expect)(parser.named).to.deep.eq({})
  })
  it('sees allowed named', function () {
    var parser
    parser = new ParamParser('who:world hello', {
      allowedNamed: ['who']
    });
    (0, chai.expect)(parser.params).to.deep.eq(['hello'])
    return (0, chai.expect)(parser.named).to.deep.eq({
      who: 'world'
    })
  })
  it('can see explicit string', function () {
    var parser
    parser = new ParamParser('"hello there" world');
    (0, chai.expect)(parser.params).to.deep.eq(['hello there', 'world'])
    return (0, chai.expect)(parser.named).to.deep.eq({})
  })
  it('can see escaped quote in string', function () {
    var parser
    parser = new ParamParser('"hello \\"there" world');
    (0, chai.expect)(parser.params).to.deep.eq(['hello "there', 'world'])
    return (0, chai.expect)(parser.named).to.deep.eq({})
  })
  it('can see explicit string in named', function () {
    var parser
    parser = new ParamParser('world greeting:"hello there"');
    (0, chai.expect)(parser.params).to.deep.eq(['world'])
    return (0, chai.expect)(parser.named).to.deep.eq({
      greeting: 'hello there'
    })
  })
  it('can use variable placeholder', function () {
    var parser
    parser = new ParamParser('hello #{who}', {
      vars: {
        who: 'world'
      }
    });
    (0, chai.expect)(parser.params).to.deep.eq(['hello', 'world'])
    return (0, chai.expect)(parser.named).to.deep.eq({})
  })
  it('can use variable placeholder in string', function () {
    var parser
    parser = new ParamParser('hello "beautiful #{who}"', {
      vars: {
        who: 'world'
      }
    });
    (0, chai.expect)(parser.params).to.deep.eq(['hello', 'beautiful world'])
    return (0, chai.expect)(parser.named).to.deep.eq({})
  })
  it('can use empty variable placeholder', function () {
    var parser
    parser = new ParamParser('hello "#{quality} world"', {
      vars: {}
    });
    (0, chai.expect)(parser.params).to.deep.eq(['hello', ' world'])
    return (0, chai.expect)(parser.named).to.deep.eq({})
  })
})
