import {
  Pos
} from './positioning/Pos';

import {
  StrPos
} from './positioning/StrPos';

export var Editor = class Editor {
  constructor() {
    this.namespace = null;
    this._lang = null;
  }

  bindedTo(codewave) {}

  
  text(val) {
    throw "Not Implemented";
  }

  textCharAt(pos) {
    throw "Not Implemented";
  }

  textLen() {
    throw "Not Implemented";
  }

  textSubstr(start, end) {
    throw "Not Implemented";
  }

  insertTextAt(text, pos) {
    throw "Not Implemented";
  }

  spliceText(start, end, text) {
    throw "Not Implemented";
  }

  getCursorPos() {
    throw "Not Implemented";
  }

  setCursorPos(start, end = null) {
    throw "Not Implemented";
  }

  beginUndoAction() {}

  
  endUndoAction() {}

  
  getLang() {
    return this._lang;
  }

  setLang(val) {
    return this._lang = val;
  }

  getEmmetContextObject() {
    return null;
  }

  allowMultiSelection() {
    return false;
  }

  setMultiSel(selections) {
    throw "Not Implemented";
  }

  getMultiSel() {
    throw "Not Implemented";
  }

  canListenToChange() {
    return false;
  }

  addChangeListener(callback) {
    throw "Not Implemented";
  }

  removeChangeListener(callback) {
    throw "Not Implemented";
  }

  getLineAt(pos) {
    return new Pos(this.findLineStart(pos), this.findLineEnd(pos));
  }

  findLineStart(pos) {
    var p;
    p = this.findAnyNext(pos, ["\n"], -1);
    if (p) {
      return p.pos + 1;
    } else {
      return 0;
    }
  }

  findLineEnd(pos) {
    var p;
    p = this.findAnyNext(pos, ["\n", "\r"]);
    if (p) {
      return p.pos;
    } else {
      return this.textLen();
    }
  }

  findAnyNext(start, strings, direction = 1) {
    var bestPos, bestStr, i, len, pos, stri, text;
    if (direction > 0) {
      text = this.textSubstr(start, this.textLen());
    } else {
      text = this.textSubstr(0, start);
    }
    bestPos = null;
    for (i = 0, len = strings.length; i < len; i++) {
      stri = strings[i];
      pos = direction > 0 ? text.indexOf(stri) : text.lastIndexOf(stri);
      if (pos !== -1) {
        if ((bestPos == null) || bestPos * direction > pos * direction) {
          bestPos = pos;
          bestStr = stri;
        }
      }
    }
    if (bestStr != null) {
      return new StrPos((direction > 0 ? bestPos + start : bestPos), bestStr);
    }
    return null;
  }

  applyReplacements(replacements) {
    var i, len, offset, repl, selections;
    selections = [];
    offset = 0;
    for (i = 0, len = replacements.length; i < len; i++) {
      repl = replacements[i];
      repl.withEditor(this);
      repl.applyOffset(offset);
      repl.apply();
      offset += repl.offsetAfter(this);
      selections = selections.concat(repl.selections);
    }
    return this.applyReplacementsSelections(selections);
  }

  applyReplacementsSelections(selections) {
    if (selections.length > 0) {
      if (this.allowMultiSelection()) {
        return this.setMultiSel(selections);
      } else {
        return this.setCursorPos(selections[0].start, selections[0].end);
      }
    }
  }

};

//# sourceMappingURL=maps/Editor.js.map
