"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VariableContext = void 0;

var _Context = require("./Context");

var VariableContext = class VariableContext extends _Context.Context {
  onStart() {
    return this.parser.skip();
  }

  onChar(char) {
    if (char === '}') {
      return this.end();
    } else {
      return this.content += char;
    }
  }

  onEnd() {
    var ref;
    return this.parent.content += ((ref = this.parser.options.vars) != null ? ref[this.content] : void 0) || '';
  }

  static test(char, parent) {
    return parent.parser.take(2) === '#{';
  }

};
exports.VariableContext = VariableContext;
//# sourceMappingURL=../maps/stringParsers/VariableContext.js.map
