
import { ParamParser } from '../../lib/stringParsers/ParamParser';
import {expect} from 'chai'

describe.only 'ParamParser', ->
  it 'can see positionned params', ->
    parser = new ParamParser('hello world');
    expect(parser.params).to.deep.eq(['hello','world'])
    expect(parser.named).to.deep.eq({})

  it 'can see named params', ->
    parser = new ParamParser('greeting:hello who:world');
    expect(parser.params).to.deep.eq([])
    expect(parser.named).to.deep.eq({greeting:'hello', who:'world'})

  it 'can see named and positionned params', ->
    parser = new ParamParser('hello who:world');
    expect(parser.params).to.deep.eq(['hello'])
    expect(parser.named).to.deep.eq({who:'world'})

  it 'can see positionned params with named first', ->
    parser = new ParamParser('who:world hello');
    expect(parser.params).to.deep.eq(['hello'])
    expect(parser.named).to.deep.eq({who:'world'})

  it 'sees not allowed named as positionned', ->
    parser = new ParamParser('hello:world', {
      allowedNamed: []
    });
    expect(parser.params).to.deep.eq(['hello:world'])
    expect(parser.named).to.deep.eq({})

  it 'sees allowed named', ->
    parser = new ParamParser('who:world hello', {
      allowedNamed: ['who']
    });
    expect(parser.params).to.deep.eq(['hello'])
    expect(parser.named).to.deep.eq({who:'world'})

  it 'can see explicit string', ->
    parser = new ParamParser('"hello there" world');
    expect(parser.params).to.deep.eq(['hello there','world'])
    expect(parser.named).to.deep.eq({})

  it 'can see escaped quote in string', ->
    parser = new ParamParser('"hello \\"there" world');
    expect(parser.params).to.deep.eq(['hello "there','world'])
    expect(parser.named).to.deep.eq({})

  it 'can see explicit string in named', ->
    parser = new ParamParser('world greeting:"hello there"');
    expect(parser.params).to.deep.eq(['world'])
    expect(parser.named).to.deep.eq({greeting:'hello there'})

  it 'can use variable placeholder', ->
    parser = new ParamParser('hello #{who}',{
      vars: {who:'world'}
    });
    expect(parser.params).to.deep.eq(['hello','world'])
    expect(parser.named).to.deep.eq({})

  it 'can use variable placeholder in string', ->
    parser = new ParamParser('hello "beautiful #{who}"',{
      vars: {who:'world'}
    });
    expect(parser.params).to.deep.eq(['hello','beautiful world'])
    expect(parser.named).to.deep.eq({})

  it 'can use empty variable placeholder', ->
    parser = new ParamParser('hello "#{quality} world"',{
      vars: {}
    });
    expect(parser.params).to.deep.eq(['hello',' world'])
    expect(parser.named).to.deep.eq({})
