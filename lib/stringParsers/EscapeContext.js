"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EscapeContext = void 0;

var _Context = require("./Context");

var EscapeContext = class EscapeContext extends _Context.Context {
  onChar(char) {
    this.parent.content += char;
    return this.end();
  }

  static test(char) {
    return char === '\\';
  }

};
exports.EscapeContext = EscapeContext;
//# sourceMappingURL=../maps/stringParsers/EscapeContext.js.map
