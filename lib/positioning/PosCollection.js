

const Wrapping = require("./Wrapping");

const Replacement = require("./Replacement");

const CommonHelper = require("../helpers/CommonHelper");

var PosCollection = class PosCollection {
  constructor(arr) {
    if (!Array.isArray(arr)) {
      arr = [arr];
    }

    CommonHelper.CommonHelper.applyMixins(arr, [PosCollection]);

    return arr;
  }

  wrap(prefix, suffix) {
    return this.map(function (p) {
      return new Wrapping.Wrapping(p.start, p.end, prefix, suffix);
    });
  }

  replace(txt) {
    return this.map(function (p) {
      return new Replacement.Replacement(p.start, p.end, txt);
    });
  }

};
exports.PosCollection = PosCollection;

