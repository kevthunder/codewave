"use strict";

var _chai = require("chai");

var _bootstrap = require("../../lib/bootstrap");

var _Logger = require("../../lib/Logger");

var _TextParser = require("../../lib/TextParser");

var _test_utils = require("../testHelpers/test_utils");

describe('Codewave for PHP', function () {
  beforeEach(function () {
    _Logger.Logger.enabled = false;
    return this.codewave = new _bootstrap.Codewave(new _TextParser.TextParser());
  });
  afterEach(function () {
    return delete this.codewave;
  });
  it('should create php tag', function () {
    this.codewave.editor.setLang('php');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "~~php|~~");
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "<?php\n  |\n?>");
    });
  });
  it('should expand if', function () {
    this.codewave.editor.setLang('php');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "<?php \n~~if|~~\n?>");
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "<?php \nif(|){\n  \n}\n?>");
    });
  });
  it('should add php tags to executable code', function () {
    this.codewave.editor.setLang('php');
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~if|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "<?php if(|){ ?>\n  \n  \n  \n<?php } ?>");
    });
  });
  it('should add no inner php tags to functions', function () {
    this.codewave.editor.setLang('php');
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~f|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "<?php\n  function |() {\n    \n  }\n?>");
    });
  });
  it(' should add php tag to boxes', function () {
    this.codewave.editor.setLang('php');
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "<?php\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~   Lorem Ipsum ~~close~~   ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n?>|");
    });
  });
  return it('should remove php tag when closing box', function () {
    this.codewave.editor.setLang('php');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "<?php\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~   Lorem Ipsum ~~close|~~   ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n?>");
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '|');
    });
  });
});
//# sourceMappingURL=../maps/cmds/php.js.map
