const fs = require('fs')
const util = require('util')
const FileHelper = require('../helpers/FileHelper').FileHelper

var FileStorageEngine = class FileStorageEngine {
  constructor (file) {
    this.file = file
  }

  save (key, val) {
    return this.readFile().catch(() => {
      return {}
    }).then(content => {
      content[key] = val
      return this.writeFile(content)
    })
  }

  saveInPath (path, key, val) {
    return this.readFile().catch(() => {
      return {}
    }).then(content => {
      var cur, i, len, part, parts
      parts = path.split('.')
      cur = content

      for (i = 0, len = parts.length; i < len; i++) {
        part = parts[i]

        if (typeof cur[part] !== 'object') {
          cur = cur[part] = {}
        } else {
          cur = cur[part]
        }
      }

      cur[key] = val
      return this.writeFile(content)
    })
  }

  load (key) {
    return this.readFile().then(content => {
      return content[key]
    }).catch(() => {
      return null
    })
  }

  loadInPath (path, key) {
    return this.readFile().then(content => {
      var cur, i, len, part, parts
      parts = path.split('.')
      parts.push(key)
      cur = content

      for (i = 0, len = parts.length; i < len; i++) {
        part = parts[i]

        if (typeof cur[part] === 'undefined') {
          return null
        } else {
          cur = cur[part]
        }
      }
    })
  }

  readFile () {
    return util.promisify(fs.readFile)(this.file).then(raw => {
      return JSON.parse(raw)
    })
  }

  writeFile (content1) {
    this.content = content1
    return FileHelper.checkFolder(this.file).then(() => {
      return util.promisify(fs.writeFile)(this.file, JSON.stringify(this.content))
    })
  }

  deleteFile () {
    return util.promisify(fs.unlink)(this.file)
  }
}
exports.FileStorageEngine = FileStorageEngine
