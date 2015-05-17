describe 'ClosingPromp', ->
  beforeEach ->
    createTextArea('Editor')
    Codewave.logger.enabled = false;
    @codewave = new Codewave(new Codewave.TestEditor('Editor'))
    

  afterEach ->
    delete @codewave
    removeTextArea('Editor')
    
    
  it 'should add listener', ->
    expect(@codewave.editor.changeListeners).property('length', 0)
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    expect(@codewave.editor.changeListeners).property('length', 1)
    
  it 'should create ref in Codewave obj', ->
    expect(@codewave.editor.changeListeners).property('length', 0)
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    expect(@codewave.closingPromp).to.exist
    
  it 'should remove ref when stopping', ->
    expect(@codewave.editor.changeListeners).property('length', 0)
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    expect(@codewave.closingPromp).to.exist
    @codewave.closingPromp.stop()
    expect(@codewave.closingPromp).to.not.exist
    
  it 'should remove listener when stopping', ->
    expect(@codewave.editor.changeListeners).property('length', 0)
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    expect(@codewave.editor.changeListeners).property('length', 1)
    @codewave.closingPromp.stop()
    expect(@codewave.editor.changeListeners).property('length', 0)
    
  it 'should create 2 selections', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    
  it 'should revert when empty', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    @codewave.onActivationKey()
    assertEditorResult  @codewave.editor, '|[lorem ipsum]'
    
  it 'ref should stay the same', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    closingPromp = @codewave.closingPromp
    expect(closingPromp).property('nbChanges', 0)
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    setEditorContent @codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~'
    @codewave.editor.onAnyChange()
    expect(@codewave.closingPromp).to.eql(closingPromp)
    
  it 'should react to change', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    closingPromp = @codewave.closingPromp
    expect(closingPromp).property('nbChanges', 0)
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    setEditorContent @codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~'
    @codewave.editor.onAnyChange()
    expect(closingPromp).property('nbChanges', 1)
    
  it 'should keep going after one letter', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    closingPromp = @codewave.closingPromp
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    setEditorContent @codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~'
    @codewave.editor.onAnyChange()
    expect(closingPromp).to.exist
    
  it 'should detect typed text', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    closingPromp = @codewave.closingPromp
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    setEditorContent @codewave.editor, '~~test|~~\nlorem ipsum\n~~/test|~~'
    @codewave.editor.onAnyChange()
    expect(closingPromp.typed()).to.eql('test')
    
  it 'should stop after space', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    closingPromp = @codewave.closingPromp
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    setEditorContent @codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~'
    @codewave.editor.onAnyChange()
    expect(closingPromp.shouldStop()).to.eql(true)
    expect(closingPromp).property('started', false)
    
  it 'should remove space after stop', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    closingPromp = @codewave.closingPromp
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    setEditorContent @codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~'
    @codewave.editor.onAnyChange()
    expect(closingPromp).property('started', false)
    assertEditorResult @codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~'


describe 'SimulatedClosingPromp', ->
  beforeEach ->
    createTextArea('Editor')
    Codewave.logger.enabled = false;
    @codewave = Codewave.detect('Editor')
    

  afterEach ->
    delete @codewave
    removeTextArea('Editor')
    
  it 'should react to change', (done) ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    closingPromp = @codewave.closingPromp
    expect(closingPromp).property('nbChanges', 0)
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    setEditorContent @codewave.editor, '~~e|~~\nlorem ipsum\n~~/~~'
    @codewave.editor.onSkipedChange = =>
      @codewave.editor.onAnyChange()
      expect(closingPromp).property('nbChanges', 1)
      done()
    @codewave.editor.onAnyChange()
    
    
  it 'should replicate changes', (done)->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    closingPromp = @codewave.closingPromp
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    setEditorContent @codewave.editor, '~~test|~~\nlorem ipsum\n~~/~~'
    @codewave.editor.onSkipedChange = =>
      @codewave.editor.onAnyChange()
    closingPromp.onTypeSimulated = =>
      assertEditorResult @codewave.editor, '~~test|~~\nlorem ipsum\n~~/test~~'
      done()
    @codewave.editor.onAnyChange()
    
    
  it 'should stop after space', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    closingPromp = @codewave.closingPromp
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    setEditorContent @codewave.editor, '~~test |~~\nlorem ipsum\n~~/~~'
    @codewave.editor.onSkipedChange = =>
      @codewave.editor.onAnyChange()
    closingPromp.onTypeSimulated = =>
      assertEditorResult @codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~'
      expect(closingPromp).property('started', false)
      done()
    @codewave.editor.onAnyChange()