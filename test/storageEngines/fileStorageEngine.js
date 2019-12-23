"use strict";

const FileStorageEngine = require("../../lib/storageEngines/FileStorageEngine");

const chai = require("chai");

const path = require("path");

const util = require("util");

const fs = require("fs");

describe('FileStorageEngine', function () {
  beforeEach(function () {
    this.file = (0, path.resolve)("./test/tmp/test.json");
    return this.storage = new FileStorageEngine.FileStorageEngine(this.file);
  });
  afterEach(function () {
    delete this.storage;
    return (0, util.promisify)(fs.unlink)(this.file).catch(() => {
      return null;
    });
  });
  it('can save a key val pair', function () {
    return this.storage.load('foo').then(res => {
      (0, chai.expect)(res).to.not.exist;
      return this.storage.save('foo', "bar");
    }).then(() => {
      this.storage = new FileStorageEngine.FileStorageEngine(this.file);
      return this.storage.load('foo');
    }).then(res => {
      (0, chai.expect)(res).to.eql("bar");
      return (0, util.promisify)(fs.exists)(this.file);
    }).then(exists => {
      return (0, chai.expect)(exists).to.be.true;
    });
  });
  it('can delete everything stored', function () {
    return this.storage.load('foo').then(res => {
      (0, chai.expect)(res).to.not.exist;
      return this.storage.save('foo', "bar");
    }).then(() => {
      return this.storage.load('foo');
    }).then(res => {
      (0, chai.expect)(res).to.eql("bar");
      return this.storage.deleteFile();
    }).then(() => {
      return this.storage.load('foo');
    }).then(res => {
      (0, chai.expect)(res).to.not.exist;
      return (0, util.promisify)(fs.exists)(this.file);
    }).then(exists => {
      return (0, chai.expect)(exists).to.be.false;
    });
  });
  return it('can save in a given path', function () {
    return this.storage.load('foo').then(res => {
      (0, chai.expect)(res).to.not.exist;
      return this.storage.saveInPath('foo', 'baz', "bar");
    }).then(() => {
      return this.storage.load('foo');
    }).then(res => {
      (0, chai.expect)(res).to.deep.eql({
        baz: "bar"
      });
      return this.storage.saveInPath('foo', 'foobar', "bar");
    }).then(() => {
      return this.storage.load('foo');
    }).then(res => {
      return (0, chai.expect)(res).to.deep.eql({
        baz: "bar",
        foobar: "bar"
      });
    });
  });
});

