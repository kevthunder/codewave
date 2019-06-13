"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalFiles = void 0;
var fs, path, util;
fs = require('fs');
util = require('util');
path = require('path');
var LocalFiles = class LocalFiles {
  constructor(root) {
    this.root = root;
  }

  realpath(file) {
    return path.normalize(this.root + path.normalize('/' + file));
  }

  readFile(file) {
    var realpath;
    realpath = this.realpath(file);
    return util.promisify(fs.readFile)(realpath).then(raw => {
      return raw.toString();
    });
  }

  writeFile(file, content) {
    var realpath;
    realpath = this.realpath(file);
    return this.checkFolder(realpath).then(() => {
      return util.promisify(fs.writeFile)(realpath, content);
    });
  }

  deleteFile(file) {
    var realpath;
    realpath = this.realpath(file);
    return util.promisify(fs.unlink)(realpath);
  }

  checkFolder(filePath) {
    var dirname;
    dirname = path.dirname(filePath);
    return util.promisify(fs.exists)(dirname).then(exists => {
      if (!exists) {
        return this.checkFolder(dirname).then(() => {
          return util.promisify(fs.mkdir)(dirname);
        });
      }
    });
  }

};
exports.LocalFiles = LocalFiles;
//# sourceMappingURL=../maps/fileSystem/LocalFiles.js.map
