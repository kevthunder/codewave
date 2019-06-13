"use strict";

var _chai = require("chai");

var _bootstrap = require("../../lib/bootstrap");

var _Logger = require("../../lib/Logger");

var _TextParser = require("../../lib/TextParser");

var _test_utils = require("../testHelpers/test_utils");

var _StringHelper = require("../../lib/helpers/StringHelper");

var _path = require("path");

var _util = require("util");

var _fs = require("fs");

var _LocalFiles = require("../../lib/fileSystem/LocalFiles");

describe('Codewave - file namespace', function () {
  beforeEach(function () {
    _Logger.Logger.enabled = false;
    this.root = (0, _path.resolve)("./test/tmp/");
    this.storage = new _LocalFiles.LocalFiles(this.root);
    this.editor = new _TextParser.TextParser();
    this.editor.fileSystem = this.storage;
    return this.codewave = new _bootstrap.Codewave(this.editor);
  });
  afterEach(function () {
    delete this.codewave;
    delete this.storage;
    return (0, _util.promisify)(_fs.unlink)(this.file).catch(() => {
      return null;
    });
  });
  it('read a file', function () {
    return this.storage.writeFile('hello', 'Hello, world!').then(() => {
      (0, _test_utils.setEditorContent)(this.codewave.editor, "~~file:read hello|~~");
      return this.codewave.onActivationKey();
    }).then(() => {
      return (0, _chai.expect)(this.codewave.editor.text()).to.eq("Hello, world!");
    });
  });
  return it('write a file', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, "~~file:write hello Hello|~~");
    return this.codewave.onActivationKey().then(() => {
      return this.storage.readFile('hello');
    }).then(content => {
      return (0, _chai.expect)(content).to.eq("Hello");
    });
  });
});
//# sourceMappingURL=../maps/cmds/file.js.map
