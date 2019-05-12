"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PosCollection = void 0;

var _Wrapping = require("./Wrapping");

var _Replacement = require("./Replacement");

var _CommonHelper = require("../helpers/CommonHelper");

var PosCollection = class PosCollection {
  constructor(arr) {
    if (!Array.isArray(arr)) {
      arr = [arr];
    }

    _CommonHelper.CommonHelper.applyMixins(arr, [PosCollection]);

    return arr;
  }

  wrap(prefix, suffix) {
    return this.map(function (p) {
      return new _Wrapping.Wrapping(p.start, p.end, prefix, suffix);
    });
  }

  replace(txt) {
    return this.map(function (p) {
      return new _Replacement.Replacement(p.start, p.end, txt);
    });
  }

};
exports.PosCollection = PosCollection;
//# sourceMappingURL=../maps/positioning/PosCollection.js.map
