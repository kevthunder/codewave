"use strict";

var _chai = require("chai");

var _bootstrap = require("../../lib/bootstrap");

var _Logger = require("../../lib/Logger");

var _TextParser = require("../../lib/TextParser");

var _test_utils = require("../testHelpers/test_utils");

describe('Codewave - string namespace', function () {
  beforeEach(function () {
    _Logger.Logger.enabled = false;
    return this.codewave = new _bootstrap.Codewave(new _TextParser.TextParser());
  });
  afterEach(function () {
    return delete this.codewave;
  });
  it('can transforms a String from underscore to camelcase', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~camelize hello_world|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "HelloWorld");
    });
  });
  return it('can camelize without first letter', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '~~camelize hello_world first:no|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, "helloWorld");
    });
  });
});
//# sourceMappingURL=../maps/cmds/string.js.map
