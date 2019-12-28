
const ParamContext = require('./ParamContext').ParamContext

const NamedContext = require('./NamedContext').NamedContext

ParamContext.named = NamedContext
var ParamParser = class ParamParser {
  constructor (paramString, options = {}) {
    this.paramString = paramString
    this.options = options
    this.parse()
  }

  setContext (context) {
    var oldContext
    oldContext = this.context
    this.context = context

    if (oldContext != null && oldContext !== (context != null ? context.parent : null)) {
      oldContext.onEnd()
    }

    if (context != null) {
      context.onStart()
    }

    return this.context
  }

  parse () {
    this.params = []
    this.named = {}

    if (this.paramString.length) {
      this.setContext(new ParamContext(this))
      this.pos = 0

      while (this.pos < this.paramString.length) {
        this.char = this.paramString[this.pos]
        this.context.onChar(this.char)
        this.pos++
      }

      return this.setContext(null)
    }
  }

  take (nb) {
    return this.paramString.substring(this.pos, this.pos + nb)
  }

  skip (nb = 1) {
    return this.pos += nb
  }
}
exports.ParamParser = ParamParser
