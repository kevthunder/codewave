

const Context = require("./Context").Context;

const EscapeContext = require("./EscapeContext").EscapeContext;

const VariableContext = require("./VariableContext").VariableContext;

var StringContext = class StringContext extends Context {
  onChar(char) {
    if (this.testContext(EscapeContext)) {} else if (this.testContext(VariableContext)) {} else if (StringContext.isDelimiter(char)) {
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

