

const Context = require("./Context");

var EscapeContext = class EscapeContext extends Context.Context {
  onChar(char) {
    this.parent.content += char;
    return this.end();
  }

  static test(char) {
    return char === '\\';
  }

};
exports.EscapeContext = EscapeContext;

