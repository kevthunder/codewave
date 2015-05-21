# [pawa]
#   replace /it 'should (.*)', ->/ 'def test_${slug}(self):' alter:$1,slug,/[\s()]/,'_' 
#   replace /it '(.*)', ->/ 'def test_${slug}(self):' alter:$1,slug,/[\s()]/,'_' 
#   replace /setEditorContent @(.*)$/ 'test_helper.setEditorContent(self.$1)'
#   replace /assertEditorResult @(.*)$/ 'test_helper.assertEditorResult(self,self.$1)'

describe 'Codewave', ->
  beforeEach ->
    createTextArea('Editor')
    Codewave.logger.enabled = false;
    @codewave = Codewave.detect('Editor')
    

  afterEach ->
    delete @codewave
    removeTextArea('Editor')

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
    
  it 'should wrap selection with brakets', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/~~'
    
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
    
  it 'non exiting commands should not change', ->
    setEditorContent @codewave.editor, '- ~~non_exiting_command|~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '- ~~non_exiting_command|~~'
    
  it 'escaped commands should unescape', ->
    setEditorContent @codewave.editor, '~~!hello|~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, '~~hello~~|'
    
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
    expect(@codewave.editor.text()).to.match(
      RegExp('^'+Codewave.util.escapeRegExp(
        """<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
           <!-- ~  Lorem ipsum dolor                     ~ -->
           <!-- ~  ##spaces## ~ -->
           <!-- ~  adipiscing elit.                      ~ -->
           <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->"""
      ).replace('##spaces##','\\s*')+'$'))
  
  it 'closed nested box should be aligned', ->
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
    matchExp = RegExp('^'+Codewave.util.escapeRegExp(
        """<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
           <!-- ~  Lorem ipsum dolor                     ~ -->
           <!-- ~  ##spaces##  ~ -->
           <!-- ~  adipiscing elit.                      ~ -->
           <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->"""
      ).replace('##spaces##','(\\s*)')+'$')
    expect(@codewave.editor.text()).to.match(matchExp)
    match = @codewave.editor.text().match(matchExp)
    expect(match[1]).property('length', 36)
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
    
  
  it 'should replace box on option replaceBox', ->
    @codewave.editor.setLang('js')
    setEditorContent @codewave.editor, 
      """/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */
         /* ~  ~~test:replace_box|~~  ~ */
         /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */"""
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 
      """/* ~~~~~~~~~~~~~~~~~ */
         /* ~  Lorem ipsum  ~ */
         /* ~~~~~~~~~~~~~~~~~ */|"""
         
#  it 'should replace nested box on option replaceBox', ->
#    @codewave.editor.setLang('js')
#    setEditorContent @codewave.editor, 
#      """/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
#         /* ~  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */  ~ */
#         /* ~  /* ~  ~~test:replace_box|~~  ~ */  ~ */
#         /* ~  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */  ~ */
#         /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */"""
#    @codewave.onActivationKey()
#    assertEditorResult @codewave.editor, 
#      """/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
#         /* ~  /* ~~~~~~~~~~~~~~~~~ */  ~ */
#         /* ~  /* ~  Lorem ipsum  ~ */  ~ */
#         /* ~  /* ~~~~~~~~~~~~~~~~~ */  ~ */
#         /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */|"""
    
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
         
  
  it 'should display help', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~help|~~"""
    @codewave.onActivationKey()
    expect(@codewave.editor.text()).to.contain('~~~~~~~~~~')
    expect(@codewave.editor.text()).to.contain('Codewave')
    expect(@codewave.editor.text()).to.contain('/ /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/') # slice from the ascii logo
    expect(@codewave.editor.text()).to.contain('~~close~~')
    
  it ' help demo should expend editing intro', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~help:demo|~~"""
    @codewave.onActivationKey()
    expect(@codewave.editor.text()).to.contain('~~~~~~~~~~')
    expect(@codewave.editor.text()).to.contain('~~close~~')
    expect(@codewave.editor.text()).to.not.contain('~~help:editing:intro~~')
    expect(@codewave.editor.text()).to.contain('Codewave allows you to make your own commands')