describe 'Codewave', ->
  beforeEach ->
    @codewave = Codewave.detect('Editor')
    

  afterEach ->
    delete @codewave

  it 'should use tilde brakets', ->
    expect(@codewave).property('brakets', '~~')
    
  it 'should create brakets', ->
    setEditorContent @codewave.editor, 'lo|rem'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 'lo~~|~~rem'
    
  it 'should create brakets at begining', ->
    setEditorContent @codewave.editor, '|lorem'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '~~|~~lorem'
    
  it 'should create brakets at end', ->
    setEditorContent @codewave.editor, 'lorem|'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 'lorem~~|~~'
    
  it 'should reduce brakets', ->
    setEditorContent @codewave.editor, 'lorem~~|~~ipsum'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 'lorem|ipsum'
    
  it 'should reduce brakets at begining', ->
    setEditorContent @codewave.editor, '~~|~~lorem'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '|lorem'
    
  it 'should expand hello', ->
    setEditorContent @codewave.editor, '- ~~|hello~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'should expand hello (cursor middle)', ->
    setEditorContent @codewave.editor, '- ~~hel|lo~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'should expand hello (cursor end)', ->
    setEditorContent @codewave.editor, '- ~~hello|~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'should expand hello (cursor middle end bracket)', ->
    setEditorContent @codewave.editor, '- ~~hello~|~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'should expand hello (cursor after)', ->
    setEditorContent @codewave.editor, '- ~~hello~~|'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'should expand hello at begining', ->
    setEditorContent @codewave.editor, '~~|hello~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 'Hello, World!|'
    
  it 'should expand on closing tag', ->
    setEditorContent @codewave.editor, '- ~~hello~~ ~~/hello|~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'should create box', ->
    setEditorContent @codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 
      """<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
         <!-- ~   Lorem Ipsum ~~close~~   ~ -->
         <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|"""
         
  it ' boxes should use different comment style', ->
    @codewave.editor.setLang('js')
    setEditorContent @codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 
      """/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
         /* ~   Lorem Ipsum ~~close~~   ~ */
         /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */|"""
    
  it 'should close box', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
         <!-- ~   Lorem Ipsum ~~close|~~   ~ -->
         <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->"""
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '|'
    
  
  it 'should create nested box', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
    """<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
       <!-- ~  Lorem ipsum dolor                     ~ -->
       <!-- ~  ~~box|~~                               ~ -->
       <!-- ~  sit amet, consectetur                 ~ -->
       <!-- ~  ~~/box~~                              ~ -->
       <!-- ~  adipiscing elit.                      ~ -->
       <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->"""
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 
    """<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
       <!-- ~  Lorem ipsum dolor                     ~ -->
       <!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->
       <!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->
       <!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|  ~ -->
       <!-- ~  adipiscing elit.                      ~ -->
       <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->"""
       
  
  it 'should close nested box', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
    """<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
       <!-- ~  Lorem ipsum dolor                     ~ -->
       <!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->
       <!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->
       <!-- ~  <!-- ~  ~~close|~~              ~ -->  ~ -->
       <!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->
       <!-- ~  adipiscing elit.                      ~ -->
       <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->"""
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 
    """<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
       <!-- ~  Lorem ipsum dolor                     ~ -->
       <!-- ~  |                                      ~ -->
       <!-- ~  adipiscing elit.                      ~ -->
       <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->"""
       
  it 'should close parent of nested box', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
    """<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
       <!-- ~  Lorem ipsum dolor                     ~ -->
       <!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->
       <!-- ~  <!-- ~  sit amet, consectetur  ~ -->  ~ -->
       <!-- ~  <!-- ~  ~~close~~              ~ -->  ~ -->
       <!-- ~  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->  ~ -->
       <!-- ~  adipiscing elit.                      ~ -->
       <!-- ~  ~~close|~~                             ~ -->
       <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->"""
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '|'
    
    
  it 'should follow alias with name wildcard', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, '~~php:outer:f|~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 
      """<?php
          function |() {
            
          }
        ?>"""
    
  it 'should be able to use emmet', ->
    # console.log(module)
    # console.log(define)
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, '~~ul>li|~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 
      """<ul>
           <li>|</li>
         </ul>"""