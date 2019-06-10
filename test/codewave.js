"use strict";

var _chai = require("chai");

var _bootstrap = require("../lib/bootstrap");

var _Logger = require("../lib/Logger");

var _TextParser = require("../lib/TextParser");

var _test_utils = require("./testHelpers/test_utils");

var _StringHelper = require("../lib/helpers/StringHelper");

describe('Codewave', function () {
  beforeEach(function () {
    _Logger.Logger.enabled = false;
    return this.codewave = new _bootstrap.Codewave(new _TextParser.TextParser());
  });
  afterEach(function () {
    return delete this.codewave;
  });
  it('should use tilde brakets', function () {
    return (0, _chai.expect)(this.codewave).property('brakets', '~~');
  });
  it('should create brakets', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, 'lo|rem');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, 'lo~~|~~rem');
    });
  });
  it('should create brakets at begining', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|lorem');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~lorem');
    });
  });
  it('should wrap selection with brakets', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/~~');
    });
  });
  it('should create brakets at end', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, 'lorem|');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, 'lorem~~|~~');
    });
  });
  it('should reduce brakets', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, 'lorem~~|~~ipsum');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, 'lorem|ipsum');
    });
  });
  it('should reduce brakets at begining', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~|~~lorem');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '|lorem');
    });
  });
  it('should expand hello', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~|hello~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('should expand hello (cursor middle)', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~hel|lo~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('should expand hello (cursor end)', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~hello|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('should expand hello (cursor middle end bracket)', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~hello~|~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('should expand hello (cursor after)', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~hello~~|');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('should expand hello at begining', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~|hello~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, 'Hello, World!|');
    });
  });
  it('should expand on closing tag', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~hello~~ ~~/hello|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- Hello, World!|');
    });
  });
  it('non exiting commands should not change', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '- ~~non_exiting_command|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '- ~~non_exiting_command|~~');
    });
  });
  it('escaped commands should unescape', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~!hello|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~hello~~|');
    });
  });
  it('should follow alias with name wildcard', function () {
    this.codewave.editor.setLang('html');
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~php:outer:f|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "<?php\n  function |() {\n    \n  }\n?>");
    });
  });
  return it('should replace box on option replaceBox', function () {
    this.codewave.editor.setLang('js');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~  ~~test:replace_box|~~  ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */");
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "/* ~~~~~~~~~~~~~~~~~ */\n/* ~  Lorem ipsum  ~ */\n/* ~~~~~~~~~~~~~~~~~ */|");
    });
  });
}); //  it 'should replace nested box on option replaceBox', ->
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
//# sourceMappingURL=maps/codewave.js.map
