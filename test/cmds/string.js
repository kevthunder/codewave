"use strict";

const chai = require("chai");

const bootstrap = require("../../lib/bootstrap");

const Logger = require("../../lib/Logger");

const TextParser = require("../../lib/TextParser");

const test_utils = require("../testHelpers/test_utils");

describe('Codewave - string namespace', function () {
  beforeEach(function () {
    Logger.Logger.enabled = false;
    return this.codewave = new bootstrap.Codewave(new TextParser.TextParser());
  });
  afterEach(function () {
    return delete this.codewave;
  });
  it('can transforms a String from underscore to camelcase', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~camelize hello_world|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, "HelloWorld");
    });
  });
  return it('can camelize without first letter', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, '~~camelize hello_world first:no|~~');
    return this.codewave.onActivationKey().then(() => {
      return (0, test_utils.assertEditorResult)(this.codewave.editor, "helloWorld");
    });
  });
});

