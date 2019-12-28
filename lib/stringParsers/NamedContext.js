
const ParamContext = require('./ParamContext').ParamContext

var NamedContext = class NamedContext extends ParamContext {
  onStart () {
    this.name = this.parent.content
  }

  onEnd () {
    this.parser.named[this.name] = this.content
  }

  static test (char, parent) {
    return char === ':' && (parent.parser.options.allowedNamed == null || parent.parser.options.allowedNamed.indexOf(parent.content) >= 0)
  }
}
exports.NamedContext = NamedContext
