
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

