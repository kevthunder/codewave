'use strict'

const chai = require('chai')

const bootstrap = require('../lib/bootstrap')

const Logger = require('../lib/Logger').Logger

const TestMultiEditor = require('./testHelpers/TestMultiEditor')

const TestMonoEditor = require('./testHelpers/TestMonoEditor')

const test_utils = require('./testHelpers/test_utils')

describe('ClosingPromp', function () {
  beforeEach(function () {
    Logger.enabled = false
    return this.codewave = new bootstrap.Codewave(new TestMultiEditor.TestMultiEditor())
  })
  afterEach(function () {
    return delete this.codewave
  })
  it('should add listener', function () {
    (0, chai.expect)(this.codewave.editor.changeListeners).property('length', 0);
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      return (0, chai.expect)(this.codewave.editor.changeListeners).property('length', 1)
    })
  })
  it('should create ref in Codewave obj', function () {
    (0, chai.expect)(this.codewave.editor.changeListeners).property('length', 0);
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      return (0, chai.expect)(this.codewave.closingPromp).to.exist
    })
  })
  it('should remove ref when stopping', function () {
    (0, chai.expect)(this.codewave.editor.changeListeners).property('length', 0);
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      (0, chai.expect)(this.codewave.closingPromp).to.exist
      this.codewave.closingPromp.stop()
      return (0, chai.expect)(this.codewave.closingPromp).to.not.exist
    })
  })
  it('should remove listener when stopping', function () {
    (0, chai.expect)(this.codewave.editor.changeListeners).property('length', 0);
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      (0, chai.expect)(this.codewave.editor.changeListeners).property('length', 1)
      this.codewave.closingPromp.stop()
      return (0, chai.expect)(this.codewave.editor.changeListeners).property('length', 0)
    })
  })
  it('should create 2 selections', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
    })
  })
  it('should revert when empty', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~')
      return this.codewave.onActivationKey()
    }).then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '|[lorem ipsum]')
    })
  })
  it('ref should stay the same', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp;
      (0, chai.expect)(closingPromp).property('nbChanges', 0);
      (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, test_utils.setEditorContent)(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~')
      this.codewave.editor.onAnyChange()
      return (0, chai.expect)(this.codewave.closingPromp).to.eql(closingPromp)
    })
  })
  it('should react to change', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp;
      (0, chai.expect)(closingPromp).property('nbChanges', 0);
      (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, test_utils.setEditorContent)(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~')
      this.codewave.editor.onAnyChange()
      return (0, chai.expect)(closingPromp).property('nbChanges', 1)
    })
  })
  it('should keep going after one letter', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp;
      (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, test_utils.setEditorContent)(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~')
      this.codewave.editor.onAnyChange()
      return (0, chai.expect)(closingPromp).to.exist
    })
  })
  it('should detect typed text', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp;
      (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, test_utils.setEditorContent)(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/test|~~')
      this.codewave.editor.onAnyChange()
      return (0, chai.expect)(closingPromp.typed()).to.eql('test')
    })
  })
  it('should stop after space', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp;
      (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, test_utils.setEditorContent)(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~')
      this.codewave.editor.onAnyChange();
      (0, chai.expect)(closingPromp.shouldStop()).to.eql(true)
      return (0, chai.expect)(closingPromp).property('started', false)
    })
  })
  return it('should remove space after stop', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp;
      (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, test_utils.setEditorContent)(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~')
      this.codewave.editor.onAnyChange();
      (0, chai.expect)(closingPromp).property('started', false)
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~')
    })
  })
})
describe('SimulatedClosingPromp', function () {
  beforeEach(function () {
    Logger.enabled = false
    return this.codewave = new bootstrap.Codewave(new TestMonoEditor.TestMonoEditor())
  })
  afterEach(function () {
    return delete this.codewave
  })
  it('should react to change', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp;
      (0, chai.expect)(closingPromp).property('nbChanges', 0);
      (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, test_utils.setEditorContent)(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/~~')
      this.codewave.editor.onAnyChange()
      return (0, chai.expect)(closingPromp).property('nbChanges', 1)
    })
  })
  it('should replicate changes', function (done) {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp;
      (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, test_utils.setEditorContent)(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/~~')

      closingPromp.onTypeSimulated = () => {
        (0, test_utils.assertEditorResult)(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/test~~')
        return done()
      }

      return this.codewave.editor.onAnyChange()
    })
    return null
  })
  return it('should stop after space', function (done) {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    this.codewave.onActivationKey().then(() => {
      var closingPromp
      closingPromp = this.codewave.closingPromp;
      (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, test_utils.setEditorContent)(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/~~')

      closingPromp.onTypeSimulated = () => {
        (0, chai.expect)(closingPromp).property('started', true);
        (0, test_utils.assertEditorResult)(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/test~~');
        (0, test_utils.setEditorContent)(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~')
        this.codewave.editor.onAnyChange();
        (0, chai.expect)(closingPromp).property('started', false)
        return done()
      }

      return this.codewave.editor.onAnyChange()
    })
    return null
  })
})
