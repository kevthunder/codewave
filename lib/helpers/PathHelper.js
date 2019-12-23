
var PathHelper = class PathHelper {
  static getPath(obj, path, sep = '.') {
    var cur, parts;
    parts = path.split(sep);
    cur = obj;
    parts.find(part => {
      cur = cur[part];
      return typeof cur === "undefined";
    });
    return cur;
  }

  static setPath(obj, path, val, sep = '.') {
    var last, parts;
    parts = path.split(sep);
    last = parts.pop();
    return parts.reduce((cur, part) => {
      if (cur[part] != null) {
        return cur[part];
      } else {
        return cur[part] = {};
      }
    }, obj)[last] = val;
  }

};
exports.PathHelper = PathHelper;

