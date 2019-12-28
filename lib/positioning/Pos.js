
var Pos = class Pos {
  constructor (start, end) {
    this.start = start
    this.end = end

    if (this.end == null) {
      this.end = this.start
    }
  }

  containsPt (pt) {
    return this.start <= pt && pt <= this.end
  }

  containsPos (pos) {
    return this.start <= pos.start && pos.end <= this.end
  }

  wrappedBy (prefix, suffix) {
    return new Pos.wrapClass(this.start - prefix.length, this.start, this.end, this.end + suffix.length)
  }

  withEditor (val) {
    this._editor = val
    return this
  }

  editor () {
    if (this._editor == null) {
      throw new Error('No editor set')
    }

    return this._editor
  }

  hasEditor () {
    return this._editor != null
  }

  text () {
    return this.editor().textSubstr(this.start, this.end)
  }

  applyOffset (offset) {
    if (offset !== 0) {
      this.start += offset
      this.end += offset
    }

    return this
  }

  prevEOL () {
    if (this._prevEOL == null) {
      this._prevEOL = this.editor().findLineStart(this.start)
    }

    return this._prevEOL
  }

  nextEOL () {
    if (this._nextEOL == null) {
      this._nextEOL = this.editor().findLineEnd(this.end)
    }

    return this._nextEOL
  }

  textWithFullLines () {
    if (this._textWithFullLines == null) {
      this._textWithFullLines = this.editor().textSubstr(this.prevEOL(), this.nextEOL())
    }

    return this._textWithFullLines
  }

  sameLinesPrefix () {
    if (this._sameLinesPrefix == null) {
      this._sameLinesPrefix = this.editor().textSubstr(this.prevEOL(), this.start)
    }

    return this._sameLinesPrefix
  }

  sameLinesSuffix () {
    if (this._sameLinesSuffix == null) {
      this._sameLinesSuffix = this.editor().textSubstr(this.end, this.nextEOL())
    }

    return this._sameLinesSuffix
  }

  copy () {
    var res
    res = new Pos(this.start, this.end)

    if (this.hasEditor()) {
      res.withEditor(this.editor())
    }

    return res
  }

  raw () {
    return [this.start, this.end]
  }
}
exports.Pos = Pos
