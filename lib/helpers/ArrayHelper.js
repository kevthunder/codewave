"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrayHelper = void 0;
var ArrayHelper = class ArrayHelper {
  static isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  }

  static union(a1, a2) {
    return this.unique(a1.concat(a2));
  }

  static unique(array) {
    var a, i, j;
    a = array.concat();
    i = 0;

    while (i < a.length) {
      j = i + 1;

      while (j < a.length) {
        if (a[i] === a[j]) {
          a.splice(j--, 1);
        }

        ++j;
      }

      ++i;
    }

    return a;
  }

};
exports.ArrayHelper = ArrayHelper;
//# sourceMappingURL=../maps/helpers/ArrayHelper.js.map
