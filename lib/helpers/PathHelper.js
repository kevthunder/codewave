
var PathHelper = class PathHelper {
  static getPath (obj, path, sep = '.') {
    var cur, parts
    parts = path.split(sep)
    cur = obj
    parts.find(part => {
      cur = cur[part]
      return typeof cur === 'undefined'
    })
    return cur
  }

  static setPath (obj, path, val, sep = '.') {
    var last, parts
    parts = path.split(sep)
    last = parts.pop()
    const target = parts.reduce((cur, part) => {
      if (cur[part] == null) {
        cur[part] = {}
      }
      return cur[part]
    }, obj)
    target[last] = val
    return val
  }
}
exports.PathHelper = PathHelper
