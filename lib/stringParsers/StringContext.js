

const Context = require("./Context");

const EscapeContext = require("./EscapeContext");

const VariableContext = require("./VariableContext");

var StringContext = class StringContext extends Context.Context {
  onChar(char) {
    if (this.testContext(EscapeContext.EscapeContext)) {} else if (this.testContext(VariableContext.VariableContext)) {} else if (StringContext.isDelimiter(char)) {
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

