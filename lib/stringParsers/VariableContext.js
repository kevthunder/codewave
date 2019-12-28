
const Context = require('./Context').Context

var VariableContext = class VariableContext extends Context {
  onStart () {
    this.parser.skip()
  }

  onChar (char) {
    if (char === '}') {
      this.end()
    } else {
      this.content += char
    }
  }

  onEnd () {
    var ref
    this.parent.content += ((ref = this.parser.options.vars) != null ? ref[this.content] : null) || ''
  }

  static test (char, parent) {
    return parent.parser.take(2) === '#{'
  }
}
exports.VariableContext = VariableContext
