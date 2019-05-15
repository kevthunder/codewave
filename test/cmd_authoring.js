"use strict";

var _chai = require("chai");

var _bootstrap = require("../lib/bootstrap");

var _Logger = require("../lib/Logger");

var _Command = require("../lib/Command");

var _TextParser = require("../lib/TextParser");

var _test_utils = require("./testHelpers/test_utils");

describe('Codewave - Command Authoring', function () {
  beforeEach(function () {
    _Logger.Logger.enabled = false;
    return this.codewave = new _bootstrap.Codewave(new _TextParser.TextParser());
  });
  afterEach(function () {
    delete this.codewave;
    return _Command.Command.resetSaved();
  });
  it('should show edit box for new command', function () {
    this.codewave.editor.setLang('js');
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~e|dit new_cmd~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "/* ~~core:edit new_cmd~~~~~ */\n/* ~  ~~help~~            ~ */\n/* ~                      ~ */\n/* ~  ~~/help~~           ~ */\n/* ~  ~~source~~          ~ */\n/* ~  |                    ~ */\n/* ~  ~~/source~~         ~ */\n/* ~  ~~save~~ ~~close~~  ~ */\n/* ~~/core:edit~~~~~~~~~~~~ */");
    });
  });
  it('should save new command', function () {
    (0, _chai.expect)(this.codewave.context.getCmd('new_cmd')).to.not.exist;
    this.codewave.editor.setLang('js');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "/* ~~core:edit new_cmd~~~~~ */\n/* ~  ~~help~~            ~ */\n/* ~                      ~ */\n/* ~  ~~/help~~           ~ */\n/* ~  ~~source~~          ~ */\n/* ~  Lorem ipsum         ~ */\n/* ~  ~~/source~~         ~ */\n/* ~  ~~|save~~ ~~close~~  ~ */\n/* ~~/core:edit~~~~~~~~~~~~ */");
    return this.codewave.onActivationKey().then(() => {
      (0, _chai.expect)(this.codewave.context.getCmd('new_cmd')).to.exist;
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '|');
    });
  });
  it('new command should expand', function () {
    this.codewave.editor.setLang('js');
    (0, _test_utils.setEditorContent)(this.codewave.editor, "/* ~~core:edit new_cmd~~~~~ */\n/* ~  ~~help~~            ~ */\n/* ~                      ~ */\n/* ~  ~~/help~~           ~ */\n/* ~  ~~source~~          ~ */\n/* ~  Lorem ipsum         ~ */\n/* ~  ~~/source~~         ~ */\n/* ~  ~~|save~~ ~~close~~  ~ */\n/* ~~/core:edit~~~~~~~~~~~~ */");
    return this.codewave.onActivationKey().then(() => {
      (0, _test_utils.setEditorContent)(this.codewave.editor, "~~new_cmd|~~");
      return this.codewave.onActivationKey();
    }).then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, 'Lorem ipsum|');
    });
  });
  return it('should allow command alias', function () {
    this.codewave.editor.setLang('js');
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~alias hello hello2|~~');
    return this.codewave.onActivationKey().then(() => {
      (0, _test_utils.setEditorContent)(this.codewave.editor, "~~hello2|~~");
      return this.codewave.onActivationKey();
    }).then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, 'Hello, World!|');
    });
  });
});
//# sourceMappingURL=maps/cmd_authoring.js.map
