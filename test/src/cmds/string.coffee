import {expect} from 'chai'
import {Codewave} from '../../lib/bootstrap'
import {Logger} from '../../lib/Logger'
import {TextParser} from '../../lib/TextParser'
import {setEditorContent, assertEditorResult} from '../testHelpers/test_utils'

describe 'Codewave - string namespace', ->
  beforeEach ->
    Logger.enabled = false;
    @codewave = new Codewave(new TextParser())
    

  afterEach ->
    delete @codewave
    
  it 'can transforms a String from underscore to camelcase', ->
    setEditorContent @codewave.editor, '~~camelize hello_world|~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 
        """HelloWorld"""
        
  it 'can camelize without first letter', ->
    setEditorContent @codewave.editor, '~~camelize hello_world first:no|~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 
        """helloWorld"""
         