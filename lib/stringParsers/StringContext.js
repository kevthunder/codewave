"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringContext = void 0;

var _Context = require("./Context");

var _EscapeContext = require("./EscapeContext");

var _VariableContext = require("./VariableContext");

var StringContext = class StringContext extends _Context.Context {
  onChar(char) {
    if (this.testContext(_EscapeContext.EscapeContext)) {} else if (this.testContext(_VariableContext.VariableContext)) {} else if (StringContext.isDelimiter(char)) {
      return this.end();
    } else {
      return this.content += char;
    }
  }

  onEnd() {
    return this.parent.content += this.content;
  }

  static test(char) {
    return this.isDelimiter(char);
  }

  static isDelimiter(char) {
    return char === '"' || char === "'";
  }

};
exports.StringContext = StringContext;
//# sourceMappingURL=../maps/stringParsers/StringContext.js.map
