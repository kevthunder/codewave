
import {expect} from 'chai'
import {TextParser} from '../lib/TextParser'
import { Replacement } from '../lib/positioning/Replacement';

describe 'Replacement', ->
  beforeEach ->
    @replacement = null
    @editor = null
    
  afterEach ->
    delete @replacement
    delete @editor

  it 'editor should be settable', ->
    @editor = new TextParser('lorem Ipsum')
    @replacement = new Replacement(1,2,'a')
    expect(@replacement).to.respondTo('withEditor');
    expect(@replacement).to.respondTo('editor');
    @replacement.withEditor(@editor)
    expect(@replacement.editor()).to.eql(@editor)
    
  it 'should take prefix option', ->
    @editor = new TextParser('lorem Ipsum')
    @replacement = new Replacement(1,2,'a',{prefix:'test'}).withEditor(@editor)
    expect(@replacement.prefix).to.eql('test')

    