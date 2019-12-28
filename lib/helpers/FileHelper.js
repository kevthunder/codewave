
const fs = require('fs')
const util = require('util')
const path = require('path')

var FileHelper = class FileHelper {
  static checkFolder (filePath) {
    var dirname
    dirname = path.dirname(filePath)
    return util.promisify(fs.stat)(dirname).catch(() => {
      return this.checkFolder(dirname).then(() => {
        return util.promisify(fs.mkdir)(dirname)
      })
    })
  }
}
exports.FileHelper = FileHelper
