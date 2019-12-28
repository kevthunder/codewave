'use strict'

const ParamParser = require('../../lib/stringParsers/ParamParser').ParamParser

const expect = require('chai').expect

describe('ParamParser', function () {
  it('can see positionned params', function () {
    var parser
    parser = new ParamParser('hello world')
    expect(parser.params).to.deep.eq(['hello', 'world'])
    return expect(parser.named).to.deep.eq({})
  })
  it('can see named params', function () {
    var parser
    parser = new ParamParser('greeting:hello who:world')
    expect(parser.params).to.deep.eq([])
    return expect(parser.named).to.deep.eq({
      greeting: 'hello',
      who: 'world'
    })
  })
  it('can see named and positionned params', function () {
    var parser
    parser = new ParamParser('hello who:world')
    expect(parser.params).to.deep.eq(['hello'])
    return expect(parser.named).to.deep.eq({
      who: 'world'
    })
  })
  it('can see positionned params with named first', function () {
    var parser
    parser = new ParamParser('who:world hello')
    expect(parser.params).to.deep.eq(['hello'])
    return expect(parser.named).to.deep.eq({
      who: 'world'
    })
  })
  it('sees not allowed named as positionned', function () {
    var parser
    parser = new ParamParser('hello:world', {
      allowedNamed: []
    })
    expect(parser.params).to.deep.eq(['hello:world'])
    return expect(parser.named).to.deep.eq({})
  })
  it('sees allowed named', function () {
    var parser
    parser = new ParamParser('who:world hello', {
      allowedNamed: ['who']
    })
    expect(parser.params).to.deep.eq(['hello'])
    return expect(parser.named).to.deep.eq({
      who: 'world'
    })
  })
  it('can see explicit string', function () {
    var parser
    parser = new ParamParser('"hello there" world')
    expect(parser.params).to.deep.eq(['hello there', 'world'])
    return expect(parser.named).to.deep.eq({})
  })
  it('can see escaped quote in string', function () {
    var parser
    parser = new ParamParser('"hello \\"there" world')
    expect(parser.params).to.deep.eq(['hello "there', 'world'])
    return expect(parser.named).to.deep.eq({})
  })
  it('can see explicit string in named', function () {
    var parser
    parser = new ParamParser('world greeting:"hello there"')
    expect(parser.params).to.deep.eq(['world'])
    return expect(parser.named).to.deep.eq({
      greeting: 'hello there'
    })
  })
  it('can use variable placeholder', function () {
    var parser
    parser = new ParamParser('hello #{who}', {
      vars: {
        who: 'world'
      }
    })
    expect(parser.params).to.deep.eq(['hello', 'world'])
    return expect(parser.named).to.deep.eq({})
  })
  it('can use variable placeholder in string', function () {
    var parser
    parser = new ParamParser('hello "beautiful #{who}"', {
      vars: {
        who: 'world'
      }
    })
    expect(parser.params).to.deep.eq(['hello', 'beautiful world'])
    return expect(parser.named).to.deep.eq({})
  })
  it('can use empty variable placeholder', function () {
    var parser
    parser = new ParamParser('hello "#{quality} world"', {
      vars: {}
    })
    expect(parser.params).to.deep.eq(['hello', ' world'])
    return expect(parser.named).to.deep.eq({})
  })
})
