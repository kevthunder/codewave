  // [pawa]
  //   replace 'replace(/\r/g' "replace('\r'"
import {
  StringHelper
} from './helpers/StringHelper';

import {
  ArrayHelper
} from './helpers/ArrayHelper';

import {
  Pair
} from './positioning/Pair';

export var BoxHelper = class BoxHelper {
  constructor(context, options = {}) {
    var key, ref, val;
    this.context = context;
    this.defaults = {
      deco: this.context.codewave.deco,
      pad: 2,
      width: 50,
      height: 3,
      openText: '',
      closeText: '',
      prefix: '',
      suffix: '',
      indent: 0
    };
    ref = this.defaults;
    for (key in ref) {
      val = ref[key];
      if (key in options) {
        this[key] = options[key];
      } else {
        this[key] = val;
      }
    }
  }

  clone(text) {
    var key, opt, ref, val;
    opt = {};
    ref = this.defaults;
    for (key in ref) {
      val = ref[key];
      opt[key] = this[key];
    }
    return new BoxHelper(this.context, opt);
  }

  draw(text) {
    return this.startSep() + "\n" + this.lines(text) + "\n" + this.endSep();
  }

  wrapComment(str) {
    return this.context.wrapComment(str);
  }

  separator() {
    var len;
    len = this.width + 2 * this.pad + 2 * this.deco.length;
    return this.wrapComment(this.decoLine(len));
  }

  startSep() {
    var ln;
    ln = this.width + 2 * this.pad + 2 * this.deco.length - this.openText.length;
    return this.prefix + this.wrapComment(this.openText + this.decoLine(ln));
  }

  endSep() {
    var ln;
    ln = this.width + 2 * this.pad + 2 * this.deco.length - this.closeText.length;
    return this.wrapComment(this.closeText + this.decoLine(ln)) + this.suffix;
  }

  decoLine(len) {
    return StringHelper.repeatToLength(this.deco, len);
  }

  padding() {
    return StringHelper.repeatToLength(" ", this.pad);
  }

  lines(text = '', uptoHeight = true) {
    var l, lines, x;
    text = text || '';
    lines = text.replace(/\r/g, '').split("\n");
    if (uptoHeight) {
      return ((function() {
        var i, ref, results;
        results = [];
        for (x = i = 0, ref = this.height; (0 <= ref ? i <= ref : i >= ref); x = 0 <= ref ? ++i : --i) {
          results.push(this.line(lines[x] || ''));
        }
        return results;
      }).call(this)).join('\n');
    } else {
      return ((function() {
        var i, len1, results;
        results = [];
        for (i = 0, len1 = lines.length; i < len1; i++) {
          l = lines[i];
          results.push(this.line(l));
        }
        return results;
      }).call(this)).join('\n');
    }
  }

  line(text = '') {
    return StringHelper.repeatToLength(" ", this.indent) + this.wrapComment(this.deco + this.padding() + text + StringHelper.repeatToLength(" ", this.width - this.removeIgnoredContent(text).length) + this.padding() + this.deco);
  }

  left() {
    return this.context.wrapCommentLeft(this.deco + this.padding());
  }

  right() {
    return this.context.wrapCommentRight(this.padding() + this.deco);
  }

  removeIgnoredContent(text) {
    return this.context.codewave.removeMarkers(this.context.codewave.removeCarret(text));
  }

  textBounds(text) {
    return StringHelper.getTxtSize(this.removeIgnoredContent(text));
  }

  getBoxForPos(pos) {
    var clone, curLeft, depth, endFind, left, pair, placeholder, res, startFind;
    depth = this.getNestedLvl(pos.start);
    if (depth > 0) {
      left = this.left();
      curLeft = StringHelper.repeat(left, depth - 1);
      clone = this.clone();
      placeholder = "###PlaceHolder###";
      clone.width = placeholder.length;
      clone.openText = clone.closeText = this.deco + this.deco + placeholder + this.deco + this.deco;
      startFind = RegExp(StringHelper.escapeRegExp(curLeft + clone.startSep()).replace(placeholder, '.*'));
      endFind = RegExp(StringHelper.escapeRegExp(curLeft + clone.endSep()).replace(placeholder, '.*'));
      pair = new Pair(startFind, endFind, {
        validMatch: (match) => {
          var f;
          // console.log(match,left)
          f = this.context.codewave.findAnyNext(match.start(), [left, "\n", "\r"], -1);
          return (f == null) || f.str !== left;
        }
      });
      res = pair.wrapperPos(pos, this.context.codewave.editor.text());
      if (res != null) {
        res.start += curLeft.length;
        return res;
      }
    }
  }

  getNestedLvl(index) {
    var depth, f, left;
    depth = 0;
    left = this.left();
    while (((f = this.context.codewave.findAnyNext(index, [left, "\n", "\r"], -1)) != null) && f.str === left) {
      index = f.pos;
      depth++;
    }
    return depth;
  }

  getOptFromLine(line, getPad = true) {
    var endPos, rEnd, rStart, resEnd, resStart, startPos;
    rStart = new RegExp("(\\s*)(" + StringHelper.escapeRegExp(this.context.wrapCommentLeft(this.deco)) + ")(\\s*)");
    rEnd = new RegExp("(\\s*)(" + StringHelper.escapeRegExp(this.context.wrapCommentRight(this.deco)) + ")(\n|$)");
    resStart = rStart.exec(line);
    resEnd = rEnd.exec(line);
    if ((resStart != null) && (resEnd != null)) {
      if (getPad) {
        this.pad = Math.min(resStart[3].length, resEnd[1].length);
      }
      this.indent = resStart[1].length;
      startPos = resStart.index + resStart[1].length + resStart[2].length + this.pad; // [pawa python] replace 'resStart.index + resStart[1].length + resStart[2].length' resStart.end(2)
      endPos = resEnd.index + resEnd[1].length - this.pad; // [pawa python] replace 'resEnd.index + resEnd[1].length' resEnd.start(2)
      this.width = endPos - startPos;
    }
    return this;
  }

  reformatLines(text, options = {}) {
    return this.lines(this.removeComment(text, options), false);
  }

  removeComment(text, options = {}) {
    var defaults, ecl, ecr, ed, flag, opt, re1, re2;
    if (text != null) {
      defaults = {
        multiline: true
      };
      opt = Object.assign({}, defaults, options);
      ecl = StringHelper.escapeRegExp(this.context.wrapCommentLeft());
      ecr = StringHelper.escapeRegExp(this.context.wrapCommentRight());
      ed = StringHelper.escapeRegExp(this.deco);
      flag = options['multiline'] ? 'gm' : ''; // [pawa python] replace "'gm'" re.M
      re1 = new RegExp(`^\\s*${ecl}(?:${ed})*\\s{0,${this.pad}}`, flag); // [pawa python] replace #{@pad} '"+str(self.pad)+"'
      re2 = new RegExp(`\\s*(?:${ed})*${ecr}\\s*$`, flag);
      return text.replace(re1, '').replace(re2, '');
    }
  }

};

//# sourceMappingURL=maps/BoxHelper.js.map
