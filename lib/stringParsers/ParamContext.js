
const Context = require('./Context').Context

const StringContext = require('./StringContext').StringContext

const VariableContext = require('./VariableContext').VariableContext

var ParamContext = class ParamContext extends Context {
  onChar (char) {
    if (this.testContext(StringContext)) {} else if (this.testContext(ParamContext.named)) {} else if (this.testContext(VariableContext)) {} else if (char === ' ') {
      return this.parser.setContext(new ParamContext(this.parser))
    } else {
      return this.content += char
    }
  }

  onEnd () {
    return this.parser.params.push(this.content)
  }
}
exports.ParamContext = ParamContext
