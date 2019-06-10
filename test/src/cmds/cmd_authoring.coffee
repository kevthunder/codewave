
import {expect} from 'chai'
import {Codewave} from '../../lib/bootstrap'
import {Logger} from '../../lib/Logger'
import {Command} from '../../lib/Command'
import {TextParser} from '../../lib/TextParser'
import {setEditorContent, assertEditorResult} from '../testHelpers/test_utils'


describe 'Codewave - Command Authoring', ->
  beforeEach ->
    Logger.enabled = false;
    @codewave = new Codewave(new TextParser())
    

  afterEach ->
    delete @codewave
    Command.resetSaved()

  it 'should show edit box for new command', ->
    @codewave.editor.setLang('js')
    setEditorContent @codewave.editor, '~~e|dit new_cmd~~'
    @codewave.onActivationKey().then =>
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
    @codewave.onActivationKey().then =>
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
    @codewave.onActivationKey().then =>
      setEditorContent @codewave.editor, """~~new_cmd|~~"""
      @codewave.onActivationKey()
    .then =>
      assertEditorResult @codewave.editor, 'Lorem ipsum|'
    
  it 'should allow command alias', ->
    @codewave.editor.setLang('js')
    setEditorContent @codewave.editor, '~~alias hello hello2|~~'
    @codewave.onActivationKey().then =>
      setEditorContent @codewave.editor, """~~hello2|~~"""
      @codewave.onActivationKey()
    .then =>
      assertEditorResult @codewave.editor, 'Hello, World!|'