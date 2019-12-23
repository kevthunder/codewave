"use strict";

const chai = require("chai");

const bootstrap = require("../../lib/bootstrap");

const Logger = require("../../lib/Logger").Logger;

const TextParser = require("../../lib/TextParser").TextParser;

const test_utils = require("../testHelpers/test_utils");

describe('Codewave for PHP', function () {
  beforeEach(function () {
    Logger.enabled = false;
    return this.codewave = new bootstrap.Codewave(new TextParser());
  });
  afterEach(function () {
    return delete this.codewave;
  });
  it('should create php tag', function () {
    this.codewave.editor.setLang('php');
    (0, test_utils.setEditorContent)(this.codewave.editor, "~~php|~~");
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, "<?php\n  |\n?>");
    });
  });
  it('should expand if', function () {
    this.codewave.editor.setLang('php');
    (0, test_utils.setEditorContent)(this.codewave.editor, "<?php \n~~if|~~\n?>");
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, "<?php \nif(|){\n  \n}\n?>");
    });
  });
  it('should add php tags to executable code', function () {
    this.codewave.editor.setLang('php');
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~if|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, "<?php if(|){ ?>\n  \n  \n  \n<?php } ?>");
    });
  });
  it('should add no inner php tags to functions', function () {
    this.codewave.editor.setLang('php');
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~f|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, "<?php\n  function |() {\n    \n  }\n?>");
    });
  });
  it('should add php tag to boxes', function () {
    this.codewave.editor.setLang('php');
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~box|~~ Lorem Ipsum ~~close~~ ~~/box~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, "<?php\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~   Lorem Ipsum ~~close~~   ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n?>|");
    });
  });
  return it('should remove php tag when closing box', function () {
    this.codewave.editor.setLang('php');
    (0, test_utils.setEditorContent)(this.codewave.editor, "<?php\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n/* ~   Lorem Ipsum ~~close|~~   ~ */\n/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */\n?>");
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '|');
    });
  });
});

