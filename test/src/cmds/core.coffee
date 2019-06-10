import {expect} from 'chai'
import {Codewave} from '../../lib/bootstrap'
import {Logger} from '../../lib/Logger'
import {TextParser} from '../../lib/TextParser'
import {setEditorContent, assertEditorResult} from '../testHelpers/test_utils'
import { StringHelper } from '../../lib/helpers/StringHelper';

describe 'Codewave - Core namespace', ->
  beforeEach ->
    Logger.enabled = false;
    @codewave = new Codewave(new TextParser())
    

  afterEach ->
    delete @codewave
    
  it 'should create box', ->
    setEditorContent @codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 
        """<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
          <!-- ~   Lorem Ipsum ~~close~~   ~ -->
          <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->|"""
         
  it ' boxes should use different comment style', ->
    @codewave.editor.setLang('js')
    setEditorContent @codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~'
    @codewave.onActivationKey().then =>
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
    @codewave.onActivationKey().then =>
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
    @codewave.onActivationKey().then =>
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
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.text()).to.match(
        RegExp('^'+StringHelper.escapeRegExp(
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
    @codewave.onActivationKey().then =>
      matchExp = RegExp('^'+StringHelper.escapeRegExp(
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
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '|'
    
  it 'should be able to use emmet', ->
    # console.log(module)
    # console.log(define)
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, '~~ul>li|~~'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, 
        """<ul>
            <li>|</li>
          </ul>"""
         
  
  it 'should display help', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~help|~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.text()).to.contain('~~~~~~~~~~')
      expect(@codewave.editor.text()).to.contain('Codewave')
      expect(@codewave.editor.text()).to.contain('/ /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/') # slice from the ascii logo
      expect(@codewave.editor.text()).to.contain('~~close~~')
    
  it ' help demo should expend editing intro', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~help:demo|~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.text()).to.contain('~~~~~~~~~~')
      expect(@codewave.editor.text()).to.contain('~~close~~')
      expect(@codewave.editor.text()).to.not.contain('~~help:editing:intro~~')
      expect(@codewave.editor.text()).to.contain('Codewave allows you to make your own commands')

  it ' can get help for the edit command', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~help edit|~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.text()).to.contain('~~close~~')
      expect(@codewave.editor.text()).to.contain('Allows to edit a command')


