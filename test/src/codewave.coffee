import {expect} from 'chai'
import {Codewave} from '../lib/bootstrap'
import {Logger} from '../lib/Logger'
import {TextParser} from '../lib/TextParser'
import {setEditorContent, assertEditorResult} from './testHelpers/test_utils'
import { StringHelper } from '../lib/helpers/StringHelper';

describe 'Codewave', ->
  beforeEach ->
    Logger.enabled = false;
    @codewave = new Codewave(new TextParser())
    

  afterEach ->
    delete @codewave

  it 'should use tilde brakets', ->
    expect(@codewave).property('brakets', '~~')
    
  it 'should create brakets', ->
    setEditorContent @codewave.editor, 'lo|rem'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 'lo~~|~~rem'
    
  it 'should create brakets at begining', ->
    setEditorContent @codewave.editor, '|lorem'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '~~|~~lorem'
    
  it 'should wrap selection with brakets', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/~~'
    
  it 'should create brakets at end', ->
    setEditorContent @codewave.editor, 'lorem|'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 'lorem~~|~~'
    
  it 'should reduce brakets', ->
    setEditorContent @codewave.editor, 'lorem~~|~~ipsum'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 'lorem|ipsum'
    
  it 'should reduce brakets at begining', ->
    setEditorContent @codewave.editor, '~~|~~lorem'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '|lorem'
    
  it 'should expand hello', ->
    setEditorContent @codewave.editor, '- ~~|hello~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'should expand hello (cursor middle)', ->
    setEditorContent @codewave.editor, '- ~~hel|lo~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'should expand hello (cursor end)', ->
    setEditorContent @codewave.editor, '- ~~hello|~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'should expand hello (cursor middle end bracket)', ->
    setEditorContent @codewave.editor, '- ~~hello~|~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'should expand hello (cursor after)', ->
    setEditorContent @codewave.editor, '- ~~hello~~|'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'should expand hello at begining', ->
    setEditorContent @codewave.editor, '~~|hello~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 'Hello, World!|'
    
  it 'should expand on closing tag', ->
    setEditorContent @codewave.editor, '- ~~hello~~ ~~/hello|~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '- Hello, World!|'
    
  it 'non exiting commands should not change', ->
    setEditorContent @codewave.editor, '- ~~non_exiting_command|~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '- ~~non_exiting_command|~~'
    
  it 'escaped commands should unescape', ->
    setEditorContent @codewave.editor, '~~!hello|~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '~~hello~~|'
    
  it 'should follow alias with name wildcard', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, '~~php:outer:f|~~'
    @codewave.onActivationKey().then =>
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
    @codewave.onActivationKey().then =>
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