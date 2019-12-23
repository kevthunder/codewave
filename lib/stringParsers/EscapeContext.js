

const Context = require("./Context").Context;

var EscapeContext = class EscapeContext extends Context {
  onChar(char) {
    this.parent.content += char;
    return this.end();
  }

  static test(char) {
    return char === '\\';
  }

};
exports.EscapeContext = EscapeContext;

