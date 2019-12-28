
const Context = require('./Context').Context

var VariableContext = class VariableContext extends Context {
  onStart () {
    return this.parser.skip()
  }

  onChar (char) {
    if (char === '}') {
      return this.end()
    } else {
      return this.content += char
    }
  }

  onEnd () {
    var ref
    return this.parent.content += ((ref = this.parser.options.vars) != null ? ref[this.content] : void 0) || ''
  }

  static test (char, parent) {
    return parent.parser.take(2) === '#{'
  }
}
exports.VariableContext = VariableContext
