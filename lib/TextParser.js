  // [pawa python]
  //   replace (Editor) (editor.Editor)
  //   replace @text()  self.text
import {
  Editor
} from './Editor';

export var TextParser = class TextParser extends Editor {
  constructor(_text) {
    super();
    this._text = _text;
    self.namespace = 'text_parser';
  }

  text(val) {
    if (val != null) {
      this._text = val;
    }
    return this._text;
  }

  textCharAt(pos) {
    return this.text()[pos];
  }

  textLen(pos) {
    return this.text().length;
  }

  textSubstr(start, end) {
    return this.text().substring(start, end);
  }

  insertTextAt(text, pos) {
    return this.text(this.text().substring(0, pos) + text + this.text().substring(pos, this.text().length));
  }

  spliceText(start, end, text) {
    return this.text(this.text().slice(0, start) + (text || "") + this.text().slice(end));
  }

  getCursorPos() {
    return this.target;
  }

  setCursorPos(start, end) {
    if (arguments.length < 2) {
      end = start;
    }
    return this.target = {
      start: start,
      end: end
    };
  }

};

//# sourceMappingURL=maps/TextParser.js.map
