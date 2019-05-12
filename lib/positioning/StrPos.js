"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StrPos = void 0;
var StrPos = class StrPos {
  constructor(pos, str) {
    this.pos = pos;
    this.str = str;
  }

  end() {
    return this.pos + this.str.length;
  }

};
exports.StrPos = StrPos;
//# sourceMappingURL=../maps/positioning/StrPos.js.map
