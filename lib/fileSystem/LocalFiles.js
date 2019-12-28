const fs = require('fs')
const util = require('util')
const path = require('path')
const FileHelper = require('../helpers/FileHelper').FileHelper

class LocalFiles {
  constructor (root) {
    this.root = root
  }

  realpath (file) {
    return path.normalize(this.root + path.normalize('/' + file))
  }

  readFile (file) {
    const realpath = this.realpath(file)
    return util.promisify(fs.readFile)(realpath).then(raw => {
      return raw.toString()
    })
  }

  writeFile (file, content) {
    const realpath = this.realpath(file)
    return FileHelper.checkFolder(realpath).then(() => {
      return util.promisify(fs.writeFile)(realpath, content)
    })
  }

  deleteFile (file) {
    const realpath = this.realpath(file)
    return util.promisify(fs.unlink)(realpath)
  }
};
exports.LocalFiles = LocalFiles
