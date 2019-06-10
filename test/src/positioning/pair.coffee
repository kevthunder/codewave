import { Pair } from '../../lib/positioning/Pair';
import { Pos } from '../../lib/positioning/Pos';
import {expect} from 'chai'

describe 'Pair', ->
  beforeEach ->
    @pair = null
    
  afterEach ->
    delete @pair

  it 'should find next opening', ->
    @pair = new Pair('1','2')
    text = "abc 1 2 1 2"
    res = @pair.matchAny(text)
    
    expect(res).to.exist
    expect(res.start()).to.eql(4)
    expect(res.name()).to.eql('opener')
    
  it 'should find after offset', ->
    @pair = new Pair('1','2')
    text = "abc 1 2 1 2"
    res = @pair.matchAny(text,5)
    
    expect(res).to.exist
    expect(res.start()).to.eql(6)
    expect(res.name()).to.eql('closer')
    
  it 'should find next regexp opening', ->
    @pair = new Pair(/\d/,/\$/)
    text = "abc 1 $ 1 $"
    res = @pair.matchAny(text)
    
    expect(res).to.exist
    expect(res.start()).to.eql(4)
    expect(res.name()).to.eql('opener')
    
  it 'should find last closing', ->
    @pair = new Pair('1','2')
    text = "abc 1 2 1 2"
    res = @pair.matchAnyLast(text)
    
    expect(res).to.exist
    expect(res.start()).to.eql(10)
    expect(res.name()).to.eql('closer')
    
  it 'should find last regexp closing', ->
    @pair = new Pair(/\d/,/\$/)
    text = "abc 1 $ 1 $"
    res = @pair.matchAnyLast(text)
    
    expect(res).to.exist
    expect(res.start()).to.eql(10)
    expect(res.name()).to.eql('closer') 
    
  it 'should match text openner and closer', ->
    @pair = new Pair('((','))')
    text = "abc (( def )) end"
    res = @pair.wrapperPos(new Pos(8),text)
    
    expect(res).to.exist
    expect(res.raw()).to.eql([4,13])
  
  it 'should return null on no match', ->
    @pair = new Pair('((','))')
    text = "abc (( def ) end"
    res = @pair.wrapperPos(new Pos(8),text)
    
    expect(res).to.not.exist
    
  it 'should match regexp openner and closer', ->
    @pair = new Pair(/#+-+/,/-+#+/)
    text = "abc ##-- def --## end"
    res = @pair.wrapperPos(new Pos(10),text)
    
    expect(res).to.exist
    expect(res.raw()).to.eql([4,17])
      
  it 'should match identical openner and closer', ->
    @pair = new Pair('##','##')
    text = "abc ## def ## end"
    res = @pair.wrapperPos(new Pos(8),text)
    
    expect(res).to.exist
    expect(res.raw()).to.eql([4,13])
    
  it 'should match identical regexp openner and closer', ->
    @pair = new Pair(/##/,/##/)
    text = "abc ## def ## end"
    res = @pair.wrapperPos(new Pos(8),text)
    
    expect(res).to.exist
    expect(res.raw()).to.eql([4,13])
    
  it 'should match with optionnal close', ->
    @pair = new Pair('((','))',{optionnal_end:true})
    text = "abc (( def end"
    res = @pair.wrapperPos(new Pos(8),text)
    
    expect(res).to.exist
    expect(res.raw()).to.eql([4,14])
    
  it 'should allow match validation', ->
    @pair = new Pair(/#+-+/,/-+#+/,{
      validMatch: (match) ->
        match.length() < 6
    })
    text = "abc ##-- def ---### --## end"
    res = @pair.wrapperPos(new Pos(10),text)
    
    expect(res).to.exist
    expect(res.raw()).to.eql([4,24])