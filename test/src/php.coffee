import {expect} from 'chai'
import {Codewave} from '../lib/bootstrap'
import {Logger} from '../lib/Logger'
import {TextParser} from '../lib/TextParser'
import {setEditorContent, assertEditorResult} from './testHelpers/test_utils'

describe 'Codewave for PHP', ->
  beforeEach ->
    Logger.enabled = false;
    @codewave = new Codewave(new TextParser())
    

  afterEach ->
    delete @codewave

  it 'should create php tag', ->
    @codewave.editor.setLang('php')
    setEditorContent @codewave.editor, 
      """~~php|~~"""
    @codewave.onActivationKey().then =>
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
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 
        """<?php 
        if(|){
          
        }
        ?>"""
         
  it 'should add php tags to executable code', ->
    @codewave.editor.setLang('php')
    setEditorContent @codewave.editor, '~~if|~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 
        """<?php if(|){ ?>
            
            
            
          <?php } ?>"""
         
  it 'should add no inner php tags to functions', ->
    @codewave.editor.setLang('php')
    setEditorContent @codewave.editor, '~~f|~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 
        """<?php
            function |() {
              
            }
          ?>"""
      
  it ' should add php tag to boxes', ->
    @codewave.editor.setLang('php')
    setEditorContent @codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 
        """<?php
          /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
          /* ~   Lorem Ipsum ~~close~~   ~ */
          /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
          ?>|"""
         
  it 'should remove php tag when closing box', ->
    @codewave.editor.setLang('php')
    setEditorContent @codewave.editor, 
      """<?php
         /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
         /* ~   Lorem Ipsum ~~close|~~   ~ */
         /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
         ?>"""
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '|'