const bootstrap = require('../../lib/bootstrap')

const Logger = require('../../lib/Logger').Logger

const TextParser = require('../../lib/TextParser').TextParser

const testUtils = require('../testHelpers/testUtils')

describe('Codewave for PHP', function () {
  beforeEach(function () {
    Logger.enabled = false
    this.codewave = new bootstrap.Codewave(new TextParser())
  })
  afterEach(function () {
    delete this.codewave
  })
  it('should create php tag', function () {
    this.codewave.editor.setLang('php')
    testUtils.setEditorContent(this.codewave.editor, '~~php|~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '<?php\n  |\n?>')
    })
  })
  it('should expand if', function () {
    this.codewave.editor.setLang('php')
    testUtils.setEditorContent(this.codewave.editor, '<?php \n~~if|~~\n?>')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '<?php \nif(|){\n  \n}\n?>')
    })
  })
  it('should add php tags to executable code', function () {
    this.codewave.editor.setLang('php')
    testUtils.setEditorContent(this.codewave.editor, '~~if|~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '<?php if(|){ ?>\n  \n  \n  \n<?php } ?>')
    })
  })
  it('should add no inner php tags to functions', function () {
    this.codewave.editor.setLang('php')
    testUtils.setEditorContent(this.codewave.editor, '~~f|~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '<?php\n  function |() {\n    \n  }\n?>')
    })
  })
  it('should add php tag to boxes', function () {
    this.codewave.editor.setLang('php')
    testUtils.setEditorContent(this.codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '<?php\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~   Lorem Ipsum ~~close~~   ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n?>|')
    })
  })
  it('should remove php tag when closing box', function () {
    this.codewave.editor.setLang('php')
    testUtils.setEditorContent(this.codewave.editor, '<?php\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~   Lorem Ipsum ~~close|~~   ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n?>')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '|')
    })
  })
})
