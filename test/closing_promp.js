'use strict'

const expect = require('chai').expect

const bootstrap = require('../lib/bootstrap')

const Logger = require('../lib/Logger').Logger

const TestMultiEditor = require('./testHelpers/TestMultiEditor')

const TestMonoEditor = require('./testHelpers/TestMonoEditor')

const testUtils = require('./testHelpers/testUtils')

describe('ClosingPromp', function () {
  beforeEach(function () {
    Logger.enabled = false
    this.codewave = new bootstrap.Codewave(new TestMultiEditor.TestMultiEditor())
  })
  afterEach(function () {
    delete this.codewave
  })
  it('should add listener', function () {
    expect(this.codewave.editor.changeListeners).property('length', 0)
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      return expect(this.codewave.editor.changeListeners).property('length', 1)
    })
  })
  it('should create ref in Codewave obj', function () {
    expect(this.codewave.editor.changeListeners).property('length', 0)
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      return expect(this.codewave.closingPromp).to.exist
    })
  })
  it('should remove ref when stopping', function () {
    expect(this.codewave.editor.changeListeners).property('length', 0)
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      expect(this.codewave.closingPromp).to.exist
      this.codewave.closingPromp.stop()
      return expect(this.codewave.closingPromp).to.not.exist
    })
  })
  it('should remove listener when stopping', function () {
    expect(this.codewave.editor.changeListeners).property('length', 0)
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      expect(this.codewave.editor.changeListeners).property('length', 1)
      this.codewave.closingPromp.stop()
      return expect(this.codewave.editor.changeListeners).property('length', 0)
    })
  })
  it('should create 2 selections', function () {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
    })
  })
  it('should revert when empty', function () {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
      return this.codewave.onActivationKey()
    }).then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '|[lorem ipsum]')
    })
  })
  it('ref should stay the same', function () {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp
      expect(closingPromp).property('nbChanges', 0)
      testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
      testUtils.setEditorContent(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~')
      this.codewave.editor.onAnyChange()
      return expect(this.codewave.closingPromp).to.eql(closingPromp)
    })
  })
  it('should react to change', function () {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp
      expect(closingPromp).property('nbChanges', 0)
      testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
      testUtils.setEditorContent(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~')
      this.codewave.editor.onAnyChange()
      return expect(closingPromp).property('nbChanges', 1)
    })
  })
  it('should keep going after one letter', function () {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp
      testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
      testUtils.setEditorContent(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~')
      this.codewave.editor.onAnyChange()
      return expect(closingPromp).to.exist
    })
  })
  it('should detect typed text', function () {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp
      testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
      testUtils.setEditorContent(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/test|~~')
      this.codewave.editor.onAnyChange()
      return expect(closingPromp.typed()).to.eql('test')
    })
  })
  it('should stop after space', function () {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp
      testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
      testUtils.setEditorContent(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~')
      this.codewave.editor.onAnyChange()
      expect(closingPromp.shouldStop()).to.eql(true)
      return expect(closingPromp).property('started', false)
    })
  })
  it('should remove space after stop', function () {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp
      testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
      testUtils.setEditorContent(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~')
      this.codewave.editor.onAnyChange()
      expect(closingPromp).property('started', false)
      return testUtils.assertEditorResult(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~')
    })
  })
})
describe('SimulatedClosingPromp', function () {
  beforeEach(function () {
    Logger.enabled = false
    this.codewave = new bootstrap.Codewave(new TestMonoEditor.TestMonoEditor())
  })
  afterEach(function () {
    delete this.codewave
  })
  it('should react to change', function () {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp
      expect(closingPromp).property('nbChanges', 0)
      testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
      testUtils.setEditorContent(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/~~')
      this.codewave.editor.onAnyChange()
      return expect(closingPromp).property('nbChanges', 1)
    })
  })
  it('should replicate changes', function (done) {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp
      testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
      testUtils.setEditorContent(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/~~')

      closingPromp.onTypeSimulated = () => {
        testUtils.assertEditorResult(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/test~~')
        return done()
      }

      return this.codewave.editor.onAnyChange()
    })
    return null
  })
  it('should stop after space', function (done) {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp
      testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
      testUtils.setEditorContent(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/~~')

      closingPromp.onTypeSimulated = () => {
        expect(closingPromp).property('started', true)
        testUtils.assertEditorResult(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/test~~')
        testUtils.setEditorContent(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~')
        this.codewave.editor.onAnyChange()
        expect(closingPromp).property('started', false)
        return done()
      }

      return this.codewave.editor.onAnyChange()
    })
    return null
  })
})
