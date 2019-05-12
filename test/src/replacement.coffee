describe 'Replacement', ->
  beforeEach ->
    @replacement = null
    @editor = null
    
  afterEach ->
    delete @replacement
    delete @editor

  it 'editor should be settable', ->
    @editor = new Codewave.TextParser('lorem Ipsum')
    @replacement = new Codewave.util.Replacement(1,2,'a')
    expect(@replacement).to.respondTo('withEditor');
    expect(@replacement).to.respondTo('editor');
    @replacement.withEditor(@editor)
    expect(@replacement.editor()).to.eql(@editor)
    
  it 'should take prefix option', ->
    @editor = new Codewave.TextParser('lorem Ipsum')
    @replacement = new Codewave.util.Replacement(1,2,'a',{prefix:'test'}).withEditor(@editor)
    expect(@replacement.prefix).to.eql('test')
    
describe 'Wrapping', ->  
  beforeEach ->
    @wrapping = null
    @editor = null
    
  afterEach ->
    delete @wrapping
    delete @editor
    
  it 'editor should be settable', ->
    @editor = new Codewave.TextParser('lorem Ipsum')
    @wrapping = new Codewave.util.Wrapping(0,5,'(',')')
    expect(@wrapping).to.respondTo('withEditor');
    expect(@wrapping).to.respondTo('editor');
    @wrapping.withEditor(@editor)
    expect(@wrapping.editor()).to.eql(@editor)
    
    