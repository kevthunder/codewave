describe 'Editor', ->
  beforeEach ->
    createTextArea('Editor')
    Codewave.logger.enabled = false;
    @codewave = Codewave.detect('Editor')
    

  afterEach ->
    delete @codewave
    removeTextArea('Editor')

  it 'should set cursor pos', ->
    @codewave.editor.text('lorem')
    @codewave.editor.setCursorPos(2)
    expect(@codewave.editor.getCursorPos()).to.respondTo('raw');
    expect(@codewave.editor.getCursorPos().raw()).to.eql([2,2])