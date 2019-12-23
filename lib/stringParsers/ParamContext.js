

const Context = require("./Context");

const StringContext = require("./StringContext");

const VariableContext = require("./VariableContext");

var ParamContext = class ParamContext extends Context.Context {
  onChar(char) {
    if (this.testContext(StringContext.StringContext)) {} else if (this.testContext(ParamContext.named)) {} else if (this.testContext(VariableContext.VariableContext)) {} else if (char === ' ') {
      return this.parser.setContext(new ParamContext(this.parser));
    } else {
      return this.content += char;
    }
  }

  onEnd() {
    return this.parser.params.push(this.content);
  }

};
exports.ParamContext = ParamContext;

