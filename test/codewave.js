'use strict'

const expect = require('chai').expect

const bootstrap = require('../lib/bootstrap')

const Logger = require('../lib/Logger').Logger

const TextParser = require('../lib/TextParser').TextParser

const test_utils = require('./testHelpers/test_utils')

const StringHelper = require('../lib/helpers/StringHelper').StringHelper

describe('Codewave', function () {
  beforeEach(function () {
    Logger.enabled = false
    return this.codewave = new bootstrap.Codewave(new TextParser())
  })
  afterEach(function () {
    return delete this.codewave
  })
  it('should use tilde brakets', function () {
    return expect(this.codewave).property('brakets', '~~')
  })
  it('should create brakets', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, 'lo|rem')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, 'lo~~|~~rem')
    })
  })
  it('should create brakets at begining', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|lorem')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~lorem')
    })
  })
  it('should wrap selection with brakets', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/~~')
    })
  })
  it('should create brakets at end', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, 'lorem|')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, 'lorem~~|~~')
    })
  })
  it('should reduce brakets', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, 'lorem~~|~~ipsum')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, 'lorem|ipsum')
    })
  })
  it('should reduce brakets at begining', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~|~~lorem')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '|lorem')
    })
  })
  it('should expand hello', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '- ~~|hello~~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('should expand hello (cursor middle)', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '- ~~hel|lo~~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('should expand hello (cursor end)', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '- ~~hello|~~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('should expand hello (cursor middle end bracket)', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '- ~~hello~|~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('should expand hello (cursor after)', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '- ~~hello~~|')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('should expand hello at begining', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~|hello~~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, 'Hello, World!|')
    })
  })
  it('should expand on closing tag', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '- ~~hello~~ ~~/hello|~~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|')
    })
  })
  it('non exiting commands should not change', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '- ~~non_exiting_command|~~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '- ~~non_exiting_command|~~')
    })
  })
  it('escaped commands should unescape', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~!hello|~~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '~~hello~~|')
    })
  })
  it('should follow alias with name wildcard', function () {
    this.codewave.editor.setLang('html');
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~php:outer:f|~~')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '<?php\n  function |() {\n    \n  }\n?>')
    })
  })
  it('should replace box on option replaceBox', function () {
    this.codewave.editor.setLang('js');
    (0, test_utils.setEditorContent)(this.codewave.editor, '/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~  ~~test:replace_box|~~  ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */')
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '/* ~~~~~~~~~~~~~~~~~ */\n/* ~  Lorem ipsum  ~ */\n/* ~~~~~~~~~~~~~~~~~ */|')
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
