"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NamespaceHelper = void 0;
var NamespaceHelper = class NamespaceHelper {
  static splitFirst(fullname, isSpace = false) {
    var parts;

    if (fullname.indexOf(":") === -1 && !isSpace) {
      return [null, fullname];
    }

    parts = fullname.split(':');
    return [parts.shift(), parts.join(':') || null];
  }

  static split(fullname) {
    var name, parts;

    if (fullname.indexOf(":") === -1) {
      return [null, fullname];
    }

    parts = fullname.split(':');
    name = parts.pop();
    return [parts.join(':'), name];
  }

};
exports.NamespaceHelper = NamespaceHelper;
//# sourceMappingURL=../maps/helpers/NamespaceHelper.js.map
