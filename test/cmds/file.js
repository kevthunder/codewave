"use strict";

const chai = require("chai");

const bootstrap = require("../../lib/bootstrap");

const Logger = require("../../lib/Logger");

const TextParser = require("../../lib/TextParser");

const test_utils = require("../testHelpers/test_utils");

const StringHelper = require("../../lib/helpers/StringHelper");

const path = require("path");

const util = require("util");

const fs = require("fs");

const LocalFiles = require("../../lib/fileSystem/LocalFiles");

describe('Codewave - file namespace', function () {
  beforeEach(function () {
    Logger.Logger.enabled = false;
    this.root = (0, path.resolve)("./test/tmp/");
    this.storage = new LocalFiles.LocalFiles(this.root);
    this.editor = new TextParser.TextParser();
    this.editor.fileSystem = this.storage;
    return this.codewave = new bootstrap.Codewave(this.editor);
  });
  afterEach(function () {
    delete this.codewave;
    delete this.storage;
    return (0, util.promisify)(fs.unlink)(this.file).catch(() => {
      return null;
    });
  });
  it('read a file', function () {
    return this.storage.writeFile('hello', 'Hello, world!').then(() => {
      (0, test_utils.setEditorContent)(this.codewave.editor, "~~file:read hello|~~");
      return this.codewave.onActivationKey();
    }).then(() => {
      return (0, chai.expect)(this.codewave.editor.text()).to.eq("Hello, world!");
    });
  });
  return it('write a file', function () {
    (0, test_utils.setEditorContent)(this.codewave.editor, "~~file:write hello Hello|~~");
    return this.codewave.onActivationKey().then(() => {
      return this.storage.readFile('hello');
    }).then(content => {
      return (0, chai.expect)(content).to.eq("Hello");
    });
  });
});

