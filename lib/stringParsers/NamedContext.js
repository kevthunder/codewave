
const ParamContext = require('./ParamContext').ParamContext

var indexOf = [].indexOf
var NamedContext = class NamedContext extends ParamContext {
  onStart () {
    return this.name = this.parent.content
  }

  onEnd () {
    return this.parser.named[this.name] = this.content
  }

  static test (char, parent) {
    var ref
    return char === ':' && (parent.parser.options.allowedNamed == null || (ref = parent.content, indexOf.call(parent.parser.options.allowedNamed, ref) >= 0))
  }
}
exports.NamedContext = NamedContext
