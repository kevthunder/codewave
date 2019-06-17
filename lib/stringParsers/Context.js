"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = void 0;
var Context = class Context {
  constructor(parser, parent) {
    this.parser = parser;
    this.parent = parent;
    this.content = "";
  }

  onStart() {
    return this.startAt = this.parser.pos;
  }

  onChar(char) {}

  end() {
    return this.parser.setContext(this.parent);
  }

  onEnd() {}

  testContext(contextType) {
    if (contextType.test(this.parser.char, this)) {
      return this.parser.setContext(new contextType(this.parser, this));
    }
  }

  static test() {
    return false;
  }

};
exports.Context = Context;
//# sourceMappingURL=../maps/stringParsers/Context.js.map
