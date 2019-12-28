'use strict'

const expect = require('chai').expect

const bootstrap = require('../lib/bootstrap')

const Logger = require('../lib/Logger').Logger

const TextParser = require('../lib/TextParser').TextParser

const testUtils = require('./testHelpers/testUtils')

describe('Codewave', function () {
  beforeEach(function () {
    Logger.enabled = false
    this.codewave = new bootstrap.Codewave(new TextParser())
  })
  afterEach(function () {
    delete this.codewave
  })
  it('should use tilde brakets', function () {
    return expect(this.codewave).property('brakets', '~~')
  })
  it('should create brakets', function () {
    testUtils.setEditorContent(this.codewave.editor, 'lo|rem')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, 'lo~~|~~rem')
    })
  })
  it('should create brakets at begining', function () {
    testUtils.setEditorContent(this.codewave.editor, '|lorem')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '~~|~~lorem')
    })
  })
  it('should wrap selection with brakets', function () {
    testUtils.setEditorContent(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/~~')
    })
  })
  it('should create brakets at end', function () {
    testUtils.setEditorContent(this.codewave.editor, 'lorem|')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, 'lorem~~|~~')
    })
  })
  it('should reduce brakets', function () {
    testUtils.setEditorContent(this.codewave.editor, 'lorem~~|~~ipsum')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, 'lorem|ipsum')
    })
  })
  it('should reduce brakets at begining', function () {
    testUtils.setEditorContent(this.codewave.editor, '~~|~~lorem')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '|lorem')
    })
  })
  it('should expand hello', function () {
    testUtils.setEditorContent(this.codewave.editor, '- ~~|hello~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('should expand hello (cursor middle)', function () {
    testUtils.setEditorContent(this.codewave.editor, '- ~~hel|lo~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('should expand hello (cursor end)', function () {
    testUtils.setEditorContent(this.codewave.editor, '- ~~hello|~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('should expand hello (cursor middle end bracket)', function () {
    testUtils.setEditorContent(this.codewave.editor, '- ~~hello~|~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('should expand hello (cursor after)', function () {
    testUtils.setEditorContent(this.codewave.editor, '- ~~hello~~|')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('should expand hello at begining', function () {
    testUtils.setEditorContent(this.codewave.editor, '~~|hello~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, 'Hello, World!|')
    })
  })
  it('should expand on closing tag', function () {
    testUtils.setEditorContent(this.codewave.editor, '- ~~hello~~ ~~/hello|~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('non exiting commands should not change', function () {
    testUtils.setEditorContent(this.codewave.editor, '- ~~non_exiting_command|~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '- ~~non_exiting_command|~~')
    })
  })
  it('escaped commands should unescape', function () {
    testUtils.setEditorContent(this.codewave.editor, '~~!hello|~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '~~hello~~|')
    })
  })
  it('should follow alias with name wildcard', function () {
    this.codewave.editor.setLang('html')
    testUtils.setEditorContent(this.codewave.editor, '~~php:outer:f|~~')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '<?php\n  function |() {\n    \n  }\n?>')
    })
  })
  it('should replace box on option replaceBox', function () {
    this.codewave.editor.setLang('js')
    testUtils.setEditorContent(this.codewave.editor, '/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~  ~~test:replace_box|~~  ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */')
    return this.codewave.onActivationKey().then(() => {
      return testUtils.assertEditorResult(this.codewave.editor, '/* ~~~~~~~~~~~~~~~~~ */\n/* ~  Lorem ipsum  ~ */\n/* ~~~~~~~~~~~~~~~~~ */|')
    })
  })
}) //  it 'should replace nested box on option replaceBox', ->
//    @codewave.editor.setLang('js')
//    setEditorContent @codewave.editor,
//      """/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//         /* ~  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */  ~ */
//         /* ~  /* ~  ~~test:replace_box|~~  ~ */  ~ */
//         /* ~  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */  ~ */
//         /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */"""
//    @codewave.onActivationKey()
//    assertEditorResult @codewave.editor,
//      """/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//         /* ~  /* ~~~~~~~~~~~~~~~~~ */  ~ */
//         /* ~  /* ~  Lorem ipsum  ~ */  ~ */
//         /* ~  /* ~~~~~~~~~~~~~~~~~ */  ~ */
//         /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */|"""
