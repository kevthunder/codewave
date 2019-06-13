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

  it ' can list all available commands', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~ls|~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.text()).to.contain('~~hello~~')
      expect(@codewave.editor.text()).to.contain('~~ls core~~')
      expect(@codewave.editor.text()).to.contain('~~core:help~~')
      expect(@codewave.editor.text()).to.contain('~~close~~')

  it ' can list commands avaiable in a namespace', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~ls help|~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.text()).to.contain('~~core:help:overview~~')
      expect(@codewave.editor.text()).to.contain('~~close~~')

  it ' can set a variable', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~set test hello|~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.vars).to.have.property('test');
      expect(@codewave.vars.test).to.eq('hello')

  it ' can set a variable from content', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~set test|~~hello~~/set~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.vars).to.have.property('test');
      expect(@codewave.vars.test).to.eq('hello')

  it ' can set a variable with path', ->
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~set test.test hello|~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.vars).to.have.property('test');
      expect(@codewave.vars.test).to.deep.eq({test:'hello'})

  it ' can get a variable', ->
    @codewave.vars.test = "hello"
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~get test|~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.text()).to.eq('hello')

  it ' can get a variable with path', ->
    @codewave.vars.test = {test:'hello'}
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~get test.test|~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.text()).to.eq('hello')
      
  it ' can get object variable as json', ->
    data = {test:'hello'}
    @codewave.vars.test = data
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~get test|~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.text()).to.eq(JSON.stringify(data,null,'  '))

  it ' can store json in a variable', ->
    json = {test:'hello'}
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~store_json test|~~#{JSON.stringify(json)}~~/store_json~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.vars).to.have.property('test');
      expect(@codewave.vars.test).to.deep.eq(json)
      
  it ' can render a template', ->
    data = {name:'world'}
    @codewave.vars.test = data
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~template test|~~Hello, ~~get name~~!~~/template~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.text()).to.eq("Hello, world!")

  it ' can render a template for an array', ->
    data = ['world','CodeWave']
    @codewave.vars.test = data
    @codewave.editor.setLang('html')
    setEditorContent @codewave.editor, 
      """~~template test|~~Hello, ~~get value~~!~~/template~~"""
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.text()).to.eq("Hello, world!\nHello, CodeWave!")



