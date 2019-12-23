

const Size = require("../positioning/Size");

var StringHelper = class StringHelper {
  static trimEmptyLine(txt) {
    return txt.replace(/^\s*\r?\n/, '').replace(/\r?\n\s*$/, '');
  }

  static escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  static repeatToLength(txt, length) {
    if (length <= 0) {
      return '';
    }

    return Array(Math.ceil(length / txt.length) + 1).join(txt).substring(0, length);
  }

  static repeat(txt, nb) {
    return Array(nb + 1).join(txt);
  }

  static getTxtSize(txt) {
    var j, l, len, lines, w;
    lines = txt.replace(/\r/g, '').split("\n");
    w = 0;

    for (j = 0, len = lines.length; j < len; j++) {
      l = lines[j];
      w = Math.max(w, l.length);
    }

    return new Size.Size(w, lines.length - 1);
  }

  static indentNotFirst(text, nb = 1, spaces = '  ') {
    var reg;

    if (text != null) {
      reg = /\n/g;
      return text.replace(reg, "\n" + this.repeat(spaces, nb));
    } else {
      return text;
    }
  }

  static indent(text, nb = 1, spaces = '  ') {
    if (text != null) {
      return spaces + this.indentNotFirst(text, nb, spaces);
    } else {
      return text;
    }
  }

  static reverseStr(txt) {
    return txt.split("").reverse().join("");
  }

  static removeCarret(txt, carretChar = '|') {
    var reCarret, reQuoted, reTmp, tmp;
    tmp = '[[[[quoted_carret]]]]';
    reCarret = new RegExp(this.escapeRegExp(carretChar), "g");
    reQuoted = new RegExp(this.escapeRegExp(carretChar + carretChar), "g");
    reTmp = new RegExp(this.escapeRegExp(tmp), "g");
    return txt.replace(reQuoted, tmp).replace(reCarret, '').replace(reTmp, carretChar);
  }

  static getAndRemoveFirstCarret(txt, carretChar = '|') {
    var pos;
    pos = this.getCarretPos(txt, carretChar);

    if (pos != null) {
      txt = txt.substr(0, pos) + txt.substr(pos + carretChar.length);
      return [pos, txt];
    }
  }

  static getCarretPos(txt, carretChar = '|') {
    var i, reQuoted;
    reQuoted = new RegExp(this.escapeRegExp(carretChar + carretChar), "g");
    txt = txt.replace(reQuoted, ' ');

    if ((i = txt.indexOf(carretChar)) > -1) {
      return i;
    }
  }

};
exports.StringHelper = StringHelper;

