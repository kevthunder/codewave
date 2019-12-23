"use strict";

const LocalFiles = require("../../lib/fileSystem/LocalFiles");

const chai = require("chai");

const path = require("path");

const util = require("util");

const fs = require("fs");

describe('LocalFiles', function () {
  beforeEach(function () {
    this.root = (0, path.resolve)("./test/tmp/");
    return this.storage = new LocalFiles.LocalFiles(this.root);
  });
  afterEach(function () {
    delete this.storage;
    return (0, util.promisify)(fs.unlink)(this.file).catch(() => {
      return null;
    });
  });
  return it('does not allow to use a path ousite the root folder', function () {
    return (0, chai.expect)(this.storage.realpath('../')).to.eq(this.root + '/');
  });
});

