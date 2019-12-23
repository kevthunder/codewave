"use strict";

const chai = require("chai");

const bootstrap = require("../../lib/bootstrap");

const Logger = require("../../lib/Logger").Logger;

const Command = require("../../lib/Command").Command;

const TextParser = require("../../lib/TextParser").TextParser;

const test_utils = require("../testHelpers/test_utils");

describe('Codewave - Command Authoring', function () {
  beforeEach(function () {
    Logger.enabled = false;
    return this.codewave = new bootstrap.Codewave(new TextParser());
  });
  afterEach(function () {
    delete this.codewave;
    return Command.resetSaved();
  });
  it('should show edit box for new command', function () {
    this.codewave.editor.setLang('js');
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~e|dit new_cmd~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, "/* ~~core:edit new_cmd~~~~~ */\n/* ~  ~~help~~            ~ */\n/* ~                      ~ */\n/* ~  ~~/help~~           ~ */\n/* ~  ~~source~~          ~ */\n/* ~  |                    ~ */\n/* ~  ~~/source~~         ~ */\n/* ~  ~~save~~ ~~close~~  ~ */\n/* ~~/core:edit~~~~~~~~~~~~ */");
    });
  });
  it('should save new command', function () {
    (0, chai.expect)(this.codewave.context.getCmd('new_cmd')).to.not.exist;
    this.codewave.editor.setLang('js');
    (0, test_utils.setEditorContent)(this.codewave.editor, "/* ~~core:edit new_cmd~~~~~ */\n/* ~  ~~help~~            ~ */\n/* ~                      ~ */\n/* ~  ~~/help~~           ~ */\n/* ~  ~~source~~          ~ */\n/* ~  Lorem ipsum         ~ */\n/* ~  ~~/source~~         ~ */\n/* ~  ~~|save~~ ~~close~~  ~ */\n/* ~~/core:edit~~~~~~~~~~~~ */");
    return this.codewave.onActivationKey().then(() => {
      (0, chai.expect)(this.codewave.context.getCmd('new_cmd')).to.exist;
      return (0, test_utils.assertEditorResult)(this.codewave.editor, '|');
    });
  });
  it('new command should expand', function () {
    this.codewave.editor.setLang('js');
    (0, test_utils.setEditorContent)(this.codewave.editor, "/* ~~core:edit new_cmd~~~~~ */\n/* ~  ~~help~~            ~ */\n/* ~                      ~ */\n/* ~  ~~/help~~           ~ */\n/* ~  ~~source~~          ~ */\n/* ~  Lorem ipsum         ~ */\n/* ~  ~~/source~~         ~ */\n/* ~  ~~|save~~ ~~close~~  ~ */\n/* ~~/core:edit~~~~~~~~~~~~ */");
    return this.codewave.onActivationKey().then(() => {
      (0, test_utils.setEditorContent)(this.codewave.editor, "~~new_cmd|~~");
      return this.codewave.onActivationKey();
    }).then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, 'Lorem ipsum|');
    });
  });
  return it('should allow command alias', function () {
    this.codewave.editor.setLang('js');
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~alias hello hello2|~~');
    return this.codewave.onActivationKey().then(() => {
      (0, test_utils.setEditorContent)(this.codewave.editor, "~~hello2|~~");
      return this.codewave.onActivationKey();
    }).then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, 'Hello, World!|');
    });
  });
});

