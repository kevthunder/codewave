describe 'Codewave', ->
  beforeEach ->
    createTextArea('Editor')
    Codewave.logger.enabled = false;
    Codewave.Command.resetSaved()
    @codewave = Codewave.detect('Editor')
    

  afterEach ->
    delete @codewave
    Codewave.Command.resetSaved()
    removeTextArea('Editor')

  it 'should show edit box for new command', ->
    @codewave.editor.setLang('js')
    setEditorContent @codewave.editor, '~~e|dit new_cmd~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, """
      /* ~~core:edit new_cmd~~~~~ */
      /* ~  ~~help~~            ~ */
      /* ~                      ~ */
      /* ~  ~~/help~~           ~ */
      /* ~  ~~source~~          ~ */
      /* ~  |                    ~ */
      /* ~  ~~/source~~         ~ */
      /* ~  ~~save~~ ~~close~~  ~ */
      /* ~~/core:edit~~~~~~~~~~~~ */
      """
      
  it 'should save new command', ->
    expect(@codewave.context.getCmd('new_cmd')).to.not.exist
    @codewave.editor.setLang('js')
    setEditorContent @codewave.editor, """
      /* ~~core:edit new_cmd~~~~~ */
      /* ~  ~~help~~            ~ */
      /* ~                      ~ */
      /* ~  ~~/help~~           ~ */
      /* ~  ~~source~~          ~ */
      /* ~  Lorem ipsum         ~ */
      /* ~  ~~/source~~         ~ */
      /* ~  ~~|save~~ ~~close~~  ~ */
      /* ~~/core:edit~~~~~~~~~~~~ */
      """
    @codewave.onActivationKey()
    expect(@codewave.context.getCmd('new_cmd')).to.exist
    assertEditorResult @codewave.editor, '|'
    
  
  it 'new command should expand', ->
    @codewave.editor.setLang('js')
    setEditorContent @codewave.editor, """
      /* ~~core:edit new_cmd~~~~~ */
      /* ~  ~~help~~            ~ */
      /* ~                      ~ */
      /* ~  ~~/help~~           ~ */
      /* ~  ~~source~~          ~ */
      /* ~  Lorem ipsum         ~ */
      /* ~  ~~/source~~         ~ */
      /* ~  ~~|save~~ ~~close~~  ~ */
      /* ~~/core:edit~~~~~~~~~~~~ */
      """
    @codewave.onActivationKey()
    setEditorContent @codewave.editor, """~~new_cmd|~~"""
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 'Lorem ipsum|'
    
  it 'should allow command alias', ->
    @codewave.editor.setLang('js')
    setEditorContent @codewave.editor, '~~alias hello hello2|~~'
    @codewave.onActivationKey()
    setEditorContent @codewave.editor, """~~hello2|~~"""
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 'Hello, World!|'