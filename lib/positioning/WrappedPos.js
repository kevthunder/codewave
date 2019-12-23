

const Pos = require("./Pos");

var WrappedPos = class WrappedPos extends Pos.Pos {
  constructor(start, innerStart, innerEnd, end) {
    super();
    this.start = start;
    this.innerStart = innerStart;
    this.innerEnd = innerEnd;
    this.end = end;
  }

  innerContainsPt(pt) {
    return this.innerStart <= pt && pt <= this.innerEnd;
  }

  innerContainsPos(pos) {
    return this.innerStart <= pos.start && pos.end <= this.innerEnd;
  }

  innerText() {
    return this.editor().textSubstr(this.innerStart, this.innerEnd);
  }

  setInnerLen(len) {
    return this.moveSufix(this.innerStart + len);
  }

  moveSuffix(pt) {
    var suffixLen;
    suffixLen = this.end - this.innerEnd;
    this.innerEnd = pt;
    return this.end = this.innerEnd + suffixLen;
  }

  copy() {
    return new WrappedPos(this.start, this.innerStart, this.innerEnd, this.end);
  }

};
exports.WrappedPos = WrappedPos;

