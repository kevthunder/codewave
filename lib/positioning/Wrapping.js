"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapping = void 0;

var _Replacement = require("./Replacement");

var Wrapping = class Wrapping extends _Replacement.Replacement {
  constructor(start, end, prefix = '', suffix = '', options = {}) {
    super();
    this.start = start;
    this.end = end;
    this.options = options;
    this.setOpts(this.options);
    this.text = '';
    this.prefix = prefix;
    this.suffix = suffix;
  }

  apply() {
    this.adjustSel();
    return super.apply();
  }

  adjustSel() {
    var i, len, offset, ref, results, sel;
    offset = this.originalText().length;
    ref = this.selections;
    results = [];

    for (i = 0, len = ref.length; i < len; i++) {
      sel = ref[i];

      if (sel.start > this.start + this.prefix.length) {
        sel.start += offset;
      }

      if (sel.end >= this.start + this.prefix.length) {
        results.push(sel.end += offset);
      } else {
        results.push(void 0);
      }
    }

    return results;
  }

  finalText() {
    var text;

    if (this.hasEditor()) {
      text = this.originalText();
    } else {
      text = '';
    }

    return this.prefix + text + this.suffix;
  }

  offsetAfter() {
    return this.prefix.length + this.suffix.length;
  }

  copy() {
    var res;
    res = new Wrapping(this.start, this.end, this.prefix, this.suffix);
    res.selections = this.selections.map(function (s) {
      return s.copy();
    });
    return res;
  }

};
exports.Wrapping = Wrapping;
//# sourceMappingURL=../maps/positioning/Wrapping.js.map
