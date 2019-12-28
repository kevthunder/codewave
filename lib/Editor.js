
const Pos = require('./positioning/Pos').Pos

const StrPos = require('./positioning/StrPos').StrPos

const OptionalPromise = require('./helpers/OptionalPromise')

var Editor = class Editor {
  constructor () {
    this.namespace = null
    this._lang = null
  }

  bindedTo (codewave) {}

  text (val) {
    throw new Error('Not Implemented')
  }

  textCharAt (pos) {
    throw new Error('Not Implemented')
  }

  textLen () {
    throw new Error('Not Implemented')
  }

  textSubstr (start, end) {
    throw new Error('Not Implemented')
  }

  insertTextAt (text, pos) {
    throw new Error('Not Implemented')
  }

  spliceText (start, end, text) {
    throw new Error('Not Implemented')
  }

  getCursorPos () {
    throw new Error('Not Implemented')
  }

  setCursorPos (start, end = null) {
    throw new Error('Not Implemented')
  }

  beginUndoAction () {}

  endUndoAction () {}

  getLang () {
    return this._lang
  }

  setLang (val) {
    this._lang = val
  }

  getEmmetContextObject () {
    return null
  }

  allowMultiSelection () {
    return false
  }

  setMultiSel (selections) {
    throw new Error('Not Implemented')
  }

  getMultiSel () {
    throw new Error('Not Implemented')
  }

  canListenToChange () {
    return false
  }

  addChangeListener (callback) {
    throw new Error('Not Implemented')
  }

  removeChangeListener (callback) {
    throw new Error('Not Implemented')
  }

  getLineAt (pos) {
    return new Pos(this.findLineStart(pos), this.findLineEnd(pos))
  }

  findLineStart (pos) {
    var p
    p = this.findAnyNext(pos, ['\n'], -1)

    if (p) {
      return p.pos + 1
    } else {
      return 0
    }
  }

  findLineEnd (pos) {
    var p
    p = this.findAnyNext(pos, ['\n', '\r'])

    if (p) {
      return p.pos
    } else {
      return this.textLen()
    }
  }

  findAnyNext (start, strings, direction = 1) {
    var bestPos, bestStr, i, len, pos, stri, text

    if (direction > 0) {
      text = this.textSubstr(start, this.textLen())
    } else {
      text = this.textSubstr(0, start)
    }

    bestPos = null

    for (i = 0, len = strings.length; i < len; i++) {
      stri = strings[i]
      pos = direction > 0 ? text.indexOf(stri) : text.lastIndexOf(stri)

      if (pos !== -1) {
        if (bestPos == null || bestPos * direction > pos * direction) {
          bestPos = pos
          bestStr = stri
        }
      }
    }

    if (bestStr != null) {
      return new StrPos(direction > 0 ? bestPos + start : bestPos, bestStr)
    }

    return null
  }

  applyReplacements (replacements) {
    return replacements.reduce((promise, repl) => {
      return promise.then(opt => {
        repl.withEditor(this)
        repl.applyOffset(opt.offset)
        return (0, OptionalPromise.optionalPromise)(repl.apply()).then(() => {
          return {
            selections: opt.selections.concat(repl.selections),
            offset: opt.offset + repl.offsetAfter(this)
          }
        })
      })
    }, (0, OptionalPromise.optionalPromise)({
      selections: [],
      offset: 0
    })).then(opt => {
      return this.applyReplacementsSelections(opt.selections)
    }).result()
  }

  applyReplacementsSelections (selections) {
    if (selections.length > 0) {
      if (this.allowMultiSelection()) {
        return this.setMultiSel(selections)
      } else {
        return this.setCursorPos(selections[0].start, selections[0].end)
      }
    }
  }
}
exports.Editor = Editor
