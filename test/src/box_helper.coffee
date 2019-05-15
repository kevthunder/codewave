
import {expect} from 'chai'
import {extractSelections} from './testHelpers/test_utils'
import {TextParser} from '../lib/TextParser'
import { BoxHelper } from '../lib/BoxHelper';
import {Codewave} from '../lib/bootstrap'


describe 'BoxHelper', ->
  beforeEach ->
    @boxHelper = null
    @codewave = null
    
  afterEach ->
    delete @boxHelper
    delete @codewave
    
  it 'should detect box position', ->
    [text,sels] = extractSelections(
      """Lorem ipsum dolor
         |<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
         <!-- ~  |Lorem ipsum dolor                     ~ -->
         <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|
         Lorem ipsum dolor""")
    @codewave = new Codewave(new TextParser(text))
    @boxHelper = new BoxHelper(@codewave.context)
    expect(@boxHelper.getBoxForPos(sels[1]).raw()).to.eql([sels[0].start,sels[2].start])
    
  it 'should detect box position when nested', ->
    [text,sels] = extractSelections(
      """Lorem ipsum dolor
         <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
         <!-- ~  |<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~ -->    ~ -->
         <!-- ~  <!-- ~  |Lorem ipsum dolor    ~ -->    ~ -->
         <!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~ -->|    ~ -->
         <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
         Lorem ipsum dolor""")
    @codewave = new Codewave(new TextParser(text))
    @boxHelper = new BoxHelper(@codewave.context)
    expect(@boxHelper.getBoxForPos(sels[1]).raw()).to.eql([sels[0].start,sels[2].start])
    
    
  it 'should detect box width', ->
    @codewave = new Codewave(new TextParser(''))
    @boxHelper = new BoxHelper(@codewave.context)
    @boxHelper.getOptFromLine('<!-- ~  123456789  ~ -->',false)
    expect(@boxHelper).property('width', 9)
    
    
  it 'should detect nested box outer width', ->
    @codewave = new Codewave(new TextParser(''))
    @boxHelper = new BoxHelper(@codewave.context)
    @boxHelper.getOptFromLine('<!-- ~  <!-- ~  123456789  ~ -->  ~ -->',false)
    expect(@boxHelper).property('width', 24)