
var Context = class Context {
  constructor (parser, parent) {
    this.parser = parser
    this.parent = parent
    this.content = ''
  }

  onStart () {
    this.startAt = this.parser.pos
  }

  onChar (char) {}

  end () {
    return this.parser.setContext(this.parent)
  }

  onEnd () {}

  testContext (ContextType) {
    if (ContextType.test(this.parser.char, this)) {
      return this.parser.setContext(new ContextType(this.parser, this))
    }
  }

  static test () {
    return false
  }
}
exports.Context = Context
