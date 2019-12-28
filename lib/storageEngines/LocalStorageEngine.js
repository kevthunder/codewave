/* eslint-disable no-undef */

var LocalStorageEngine = class LocalStorageEngine {
  save (key, val) {
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      return localStorage.setItem(this.fullKey(key), JSON.stringify(val))
    }
  }

  saveInPath (path, key, val) {
    var data
    data = this.load(path)

    if (data == null) {
      data = {}
    }

    data[key] = val
    return this.save(path, data)
  }

  load (key) {
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      return JSON.parse(localStorage.getItem(this.fullKey(key)))
    }
  }

  fullKey (key) {
    return 'CodeWave_' + key
  }
}
exports.LocalStorageEngine = LocalStorageEngine
