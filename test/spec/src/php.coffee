describe 'Codewave for PHP', ->
  beforeEach ->
    @codewave = Codewave.detect('Editor')
    

  afterEach ->
    delete @codewave

  it 'should create php tag', ->
    @codewave.editor.setLang('php')
    setEditorContent @codewave.editor, 
      """~~php|~~"""
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 
      """<?php
           |
         ?>"""
      
  it 'should expand if', ->
    @codewave.editor.setLang('php')
    setEditorContent @codewave.editor, 
      """<?php 
      ~~if|~~
      ?>"""
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 
      """<?php 
      if(|){
        
      }
      ?>"""
         
  it 'should add php tags to executable code', ->
    @codewave.editor.setLang('php')
    setEditorContent @codewave.editor, '~~if|~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 
      """<?php if(|){ ?>
           
           
           
         <?php } ?>"""
         
  it 'should add no inner php tags to functions', ->
    @codewave.editor.setLang('php')
    setEditorContent @codewave.editor, '~~f|~~'
    @codewave.onActivationKey()
    assertEditorResult @codewave.editor, 
      """<?php
          function |() {
            
          }
        ?>"""
      
    