export var StringHelper = class StringHelper {
  trimEmptyLine(txt) {
    return txt.replace(/^\s*\r?\n/, '').replace(/\r?\n\s*$/, '');
  }

  escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  repeatToLength(txt, length) {
    if (length <= 0) {
      return '';
    }
    return Array(Math.ceil(length / txt.length) + 1).join(txt).substring(0, length);
  }

  repeat(txt, nb) {
    return Array(nb + 1).join(txt);
  }

  getTxtSize(txt) {
    var j, l, len, lines, w;
    lines = txt.replace(/\r/g, '').split("\n"); // [pawa python] replace '/\r/g' "'\r'"
    w = 0;
    for (j = 0, len = lines.length; j < len; j++) {
      l = lines[j];
      w = Math.max(w, l.length);
    }
    return new Size(w, lines.length - 1);
  }

  indentNotFirst(text, nb = 1, spaces = '  ') {
    var reg;
    if (text != null) {
      reg = /\n/g; // [pawa python] replace '/\n/g' "re.compile(r'\n',re.M)"
      return text.replace(reg, "\n" + Codewave.util.repeat(spaces, nb));
    } else {
      return text;
    }
  }

  indent(text, nb = 1, spaces = '  ') {
    if (text != null) {
      return spaces + Codewave.util.indentNotFirst(text, nb, spaces);
    } else {
      return text;
    }
  }

  reverseStr(txt) {
    return txt.split("").reverse().join("");
  }

  removeCarret(txt, carretChar = '|') {
    var reCarret, reQuoted, reTmp, tmp;
    tmp = '[[[[quoted_carret]]]]';
    reCarret = new RegExp(Codewave.util.escapeRegExp(carretChar), "g");
    reQuoted = new RegExp(Codewave.util.escapeRegExp(carretChar + carretChar), "g");
    reTmp = new RegExp(Codewave.util.escapeRegExp(tmp), "g");
    return txt.replace(reQuoted, tmp).replace(reCarret, '').replace(reTmp, carretChar);
  }

  getAndRemoveFirstCarret(txt, carretChar = '|') {
    var pos;
    pos = Codewave.util.getCarretPos(txt, carretChar);
    if (pos != null) {
      txt = txt.substr(0, pos) + txt.substr(pos + carretChar.length);
      return [pos, txt];
    }
  }

  getCarretPos(txt, carretChar = '|') {
    var i, reQuoted;
    reQuoted = new RegExp(Codewave.util.escapeRegExp(carretChar + carretChar), "g");
    txt = txt.replace(reQuoted, ' '); // [pawa python] replace reQuoted carretChar+carretChar
    if ((i = txt.indexOf(carretChar)) > -1) {
      return i;
    }
  }

};

//# sourceMappingURL=maps/StringHelper.js.map
