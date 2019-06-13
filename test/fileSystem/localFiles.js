"use strict";

var _LocalFiles = require("../../lib/fileSystem/LocalFiles");

var _chai = require("chai");

var _path = require("path");

var _util = require("util");

var _fs = require("fs");

describe('LocalFiles', function () {
  beforeEach(function () {
    this.root = (0, _path.resolve)("./test/tmp/");
    return this.storage = new _LocalFiles.LocalFiles(this.root);
  });
  afterEach(function () {
    delete this.storage;
    return (0, _util.promisify)(_fs.unlink)(this.file).catch(() => {
      return null;
    });
  });
  return it('does not allow to use a path ousite the root folder', function () {
    return (0, _chai.expect)(this.storage.realpath('../')).to.eq(this.root + '/');
  });
});
//# sourceMappingURL=../maps/fileSystem/localFiles.js.map
