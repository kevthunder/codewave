
import {expect} from 'chai'
import {TextParser} from '../../lib/TextParser'
import { Wrapping } from '../../lib/positioning/Wrapping';

describe 'Wrapping', ->  
  beforeEach ->
    @wrapping = null
    @editor = null
    
  afterEach ->
    delete @wrapping
    delete @editor
    
  it 'editor should be settable', ->
    @editor = new TextParser('lorem Ipsum')
    @wrapping = new Wrapping(0,5,'(',')')
    expect(@wrapping).to.respondTo('withEditor');
    expect(@wrapping).to.respondTo('editor');
    @wrapping.withEditor(@editor)
    expect(@wrapping.editor()).to.eql(@editor)
    
    