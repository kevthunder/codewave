import {expect} from 'chai'
import {Codewave} from '../lib/bootstrap'
import {Logger} from '../lib/Logger'
import {TestMultiEditor} from './testHelpers/TestMultiEditor'
import {TestMonoEditor} from './testHelpers/TestMonoEditor'
import {setEditorContent, assertEditorResult} from './testHelpers/test_utils'

describe 'ClosingPromp', ->
  beforeEach ->
    Logger.enabled = false;
    @codewave = new Codewave(new TestMultiEditor())
    

  afterEach ->
    delete @codewave
    
    
  it 'should add listener', ->
    expect(@codewave.editor.changeListeners).property('length', 0)
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.changeListeners).property('length', 1)
    
  it 'should create ref in Codewave obj', ->
    expect(@codewave.editor.changeListeners).property('length', 0)
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      expect(@codewave.closingPromp).to.exist
    
  it 'should remove ref when stopping', ->
    expect(@codewave.editor.changeListeners).property('length', 0)
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      expect(@codewave.closingPromp).to.exist
      @codewave.closingPromp.stop()
      expect(@codewave.closingPromp).to.not.exist
    
  it 'should remove listener when stopping', ->
    expect(@codewave.editor.changeListeners).property('length', 0)
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      expect(@codewave.editor.changeListeners).property('length', 1)
      @codewave.closingPromp.stop()
      expect(@codewave.editor.changeListeners).property('length', 0)
    
  it 'should create 2 selections', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
    
  it 'should revert when empty', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
      @codewave.onActivationKey()
    .then =>
      assertEditorResult  @codewave.editor, '|[lorem ipsum]'
    
  it 'ref should stay the same', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      closingPromp = @codewave.closingPromp
      expect(closingPromp).property('nbChanges', 0)
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
      setEditorContent @codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~'
      @codewave.editor.onAnyChange()
      expect(@codewave.closingPromp).to.eql(closingPromp)
    
  it 'should react to change', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      closingPromp = @codewave.closingPromp
      expect(closingPromp).property('nbChanges', 0)
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
      setEditorContent @codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~'
      @codewave.editor.onAnyChange()
      expect(closingPromp).property('nbChanges', 1)
    
  it 'should keep going after one letter', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      closingPromp = @codewave.closingPromp
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
      setEditorContent @codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~'
      @codewave.editor.onAnyChange()
      expect(closingPromp).to.exist
    
  it 'should detect typed text', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      closingPromp = @codewave.closingPromp
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
      setEditorContent @codewave.editor, '~~test|~~\nlorem ipsum\n~~/test|~~'
      @codewave.editor.onAnyChange()
      expect(closingPromp.typed()).to.eql('test')
    
  it 'should stop after space', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      closingPromp = @codewave.closingPromp
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
      setEditorContent @codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~'
      @codewave.editor.onAnyChange()
      expect(closingPromp.shouldStop()).to.eql(true)
      expect(closingPromp).property('started', false)
    
  it 'should remove space after stop', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      closingPromp = @codewave.closingPromp
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
      setEditorContent @codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~'
      @codewave.editor.onAnyChange()
      expect(closingPromp).property('started', false)
      assertEditorResult @codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~'


describe 'SimulatedClosingPromp', ->
  beforeEach ->
    Logger.enabled = false;
    @codewave = new Codewave(new TestMonoEditor())
    

  afterEach ->
    delete @codewave
    
  it 'should react to change', ->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      closingPromp = @codewave.closingPromp
      expect(closingPromp).property('nbChanges', 0)
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
      setEditorContent @codewave.editor, '~~e|~~\nlorem ipsum\n~~/~~'
      @codewave.editor.onAnyChange()
      expect(closingPromp).property('nbChanges', 1)
    
    
  it 'should replicate changes', (done)->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      closingPromp = @codewave.closingPromp
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
      setEditorContent @codewave.editor, '~~test|~~\nlorem ipsum\n~~/~~'
      closingPromp.onTypeSimulated = =>
        assertEditorResult @codewave.editor, '~~test|~~\nlorem ipsum\n~~/test~~'
        done()
      @codewave.editor.onAnyChange()
    null
    
    
  it 'should stop after space', (done)->
    setEditorContent @codewave.editor, '|[lorem ipsum]'
    @codewave.onActivationKey().then =>
      closingPromp = @codewave.closingPromp
      assertEditorResult @codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~'
      setEditorContent @codewave.editor, '~~test|~~\nlorem ipsum\n~~/~~'
      closingPromp.onTypeSimulated = =>
        expect(closingPromp).property('started', true)
        assertEditorResult @codewave.editor, '~~test|~~\nlorem ipsum\n~~/test~~'
        setEditorContent @codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~'
        @codewave.editor.onAnyChange()
        expect(closingPromp).property('started', false)
        done()
      @codewave.editor.onAnyChange()
    null