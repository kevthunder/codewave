
import { StringHelper } from '../lib/helpers/StringHelper';
import {expect} from 'chai'

describe 'StringHelper', ->
  beforeEach ->
    
  afterEach ->

  it 'should repeat string', ->
    expect(StringHelper.repeat('+-',3)).to.eql('+-+-+-')
    
  it 'should repeat string to length', ->
    expect(StringHelper.repeatToLength('+-',3)).to.eql('+-+')
    
  it 'should reverse string', ->
    expect(StringHelper.reverseStr('abcd')).to.eql('dcba')
    