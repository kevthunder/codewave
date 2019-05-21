"use strict";

var _FileStorageEngine = require("../lib/storageEngines/FileStorageEngine");

var _chai = require("chai");

var _path = require("path");

var _util = require("util");

var _fs = require("fs");

describe('FileStorageEngine', function () {
  beforeEach(function () {
    this.file = (0, _path.resolve)("./test/tmp/test.json");
    return this.storage = new _FileStorageEngine.FileStorageEngine(this.file);
  });
  afterEach(function () {
    delete this.storage;
    return (0, _util.promisify)(_fs.unlink)(this.file).catch(() => {
      return null;
    });
  });
  it('can save a key val pair', function () {
    return this.storage.load('foo').then(res => {
      (0, _chai.expect)(res).to.not.exist;
      return this.storage.save('foo', "bar");
    }).then(() => {
      this.storage = new _FileStorageEngine.FileStorageEngine(this.file);
      return this.storage.load('foo');
    }).then(res => {
      (0, _chai.expect)(res).to.eql("bar");
      return (0, _util.promisify)(_fs.exists)(this.file);
    }).then(exists => {
      return (0, _chai.expect)(exists).to.be.true;
    });
  });
  return it('can delete everything stored', function () {
    return this.storage.load('foo').then(res => {
      (0, _chai.expect)(res).to.not.exist;
      return this.storage.save('foo', "bar");
    }).then(() => {
      return this.storage.load('foo');
    }).then(res => {
      (0, _chai.expect)(res).to.eql("bar");
      return this.storage.deleteFile();
    }).then(() => {
      return this.storage.load('foo');
    }).then(res => {
      (0, _chai.expect)(res).to.not.exist;
      return (0, _util.promisify)(_fs.exists)(this.file);
    }).then(exists => {
      return (0, _chai.expect)(exists).to.be.false;
    });
  });
});
//# sourceMappingURL=maps/fileStorageEngine.js.map
