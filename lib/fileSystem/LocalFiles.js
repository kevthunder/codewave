const fs = require('fs');
const util = require('util');
const path = require('path');

class LocalFiles {
  constructor(root) {
    this.root = root;
  }

  realpath(file) {
    return path.normalize(this.root + path.normalize('/' + file));
  }

  readFile(file) {
    const realpath = this.realpath(file);
    return util.promisify(fs.readFile)(realpath).then(raw => {
      return raw.toString();
    });
  }

  writeFile(file, content) {
    const realpath = this.realpath(file);
    return this.checkFolder(realpath).then(() => {
      return util.promisify(fs.writeFile)(realpath, content);
    });
  }

  deleteFile(file) {
    const realpath = this.realpath(file);
    return util.promisify(fs.unlink)(realpath);
  }

  checkFolder(filePath) {
    const dirname = path.dirname(filePath);
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

