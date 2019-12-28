
const Editor = require('./Editor').Editor

const Pos = require('./positioning/Pos').Pos

var TextParser = class TextParser extends Editor {
  constructor (_text) {
    super()
    this._text = _text
  }

  text (val) {
    if (val != null) {
      this._text = val
    }

    return this._text
  }

  textCharAt (pos) {
    return this.text()[pos]
  }

  textLen (pos) {
    return this.text().length
  }

  textSubstr (start, end) {
    return this.text().substring(start, end)
  }

  insertTextAt (text, pos) {
    return this.text(this.text().substring(0, pos) + text + this.text().substring(pos, this.text().length))
  }

  spliceText (start, end, text) {
    return this.text(this.text().slice(0, start) + (text || '') + this.text().slice(end))
  }

  getCursorPos () {
    return this.target
  }

  setCursorPos (start, end) {
    if (arguments.length < 2) {
      end = start
    }

    this.target = new Pos(start, end)
    return this.target
  }
}
exports.TextParser = TextParser
