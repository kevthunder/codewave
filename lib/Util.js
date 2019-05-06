// [pawa python]
//   replace Codewave.util. ''
var AddModule, OptionObject, Pair, PairMatch, Pos, Replacement, Size, StrPos, WrappedPos, Wrapping;

StrPos = class StrPos {
  constructor(pos1, str1) {
    this.pos = pos1;
    this.str = str1;
  }

  end() {
    return this.pos + this.str.length;
  }

};

Pos = class Pos {
  constructor(start1, end1) {
    this.start = start1;
    this.end = end1;
    if (this.end == null) {
      this.end = this.start;
    }
  }

  containsPt(pt) {
    return this.start <= pt && pt <= this.end;
  }

  containsPos(pos) {
    return this.start <= pos.start && pos.end <= this.end;
  }

  wrappedBy(prefix, suffix) {
    return new WrappedPos(this.start - prefix.length, this.start, this.end, this.end + suffix.length);
  }

  withEditor(val) {
    this._editor = val;
    return this;
  }

  editor() {
    if (this._editor == null) {
      throw new Error('No editor set');
    }
    return this._editor;
  }

  hasEditor() {
    return this._editor != null;
  }

  text() {
    return this.editor().textSubstr(this.start, this.end);
  }

  applyOffset(offset) {
    if (offset !== 0) {
      this.start += offset;
      this.end += offset;
    }
    return this;
  }

  prevEOL() {
    if (this._prevEOL == null) {
      this._prevEOL = this.editor().findLineStart(this.start);
    }
    return this._prevEOL;
  }

  nextEOL() {
    if (this._nextEOL == null) {
      this._nextEOL = this.editor().findLineEnd(this.end);
    }
    return this._nextEOL;
  }

  textWithFullLines() {
    if (this._textWithFullLines == null) {
      this._textWithFullLines = this.editor().textSubstr(this.prevEOL(), this.nextEOL());
    }
    return this._textWithFullLines;
  }

  sameLinesPrefix() {
    if (this._sameLinesPrefix == null) {
      this._sameLinesPrefix = this.editor().textSubstr(this.prevEOL(), this.start);
    }
    return this._sameLinesPrefix;
  }

  sameLinesSuffix() {
    if (this._sameLinesSuffix == null) {
      this._sameLinesSuffix = this.editor().textSubstr(this.end, this.nextEOL());
    }
    return this._sameLinesSuffix;
  }

  copy() {
    var res;
    res = new Pos(this.start, this.end);
    if (this.hasEditor()) {
      res.withEditor(this.editor());
    }
    return res;
  }

  raw() {
    return [this.start, this.end];
  }

};

WrappedPos = class WrappedPos extends Pos {
  constructor(start1, innerStart, innerEnd, end1) {
    super();
    this.start = start1;
    this.innerStart = innerStart;
    this.innerEnd = innerEnd;
    this.end = end1;
  }

  innerContainsPt(pt) {
    return this.innerStart <= pt && pt <= this.innerEnd;
  }

  innerContainsPos(pos) {
    return this.innerStart <= pos.start && pos.end <= this.innerEnd;
  }

  innerText() {
    return this.editor().textSubstr(this.innerStart, this.innerEnd);
  }

  setInnerLen(len) {
    return this.moveSufix(this.innerStart + len);
  }

  moveSuffix(pt) {
    var suffixLen;
    suffixLen = this.end - this.innerEnd;
    this.innerEnd = pt;
    return this.end = this.innerEnd + suffixLen;
  }

  copy() {
    return new WrappedPos(this.start, this.innerStart, this.innerEnd, this.end);
  }

};

Size = class Size {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

};

OptionObject = class OptionObject {
  setOpts(options, defaults) {
    var key, ref, results, val;
    this.defaults = defaults;
    ref = this.defaults;
    results = [];
    for (key in ref) {
      val = ref[key];
      if (key in options) {
        results.push(this.setOpt(key, options[key]));
      } else {
        results.push(this.setOpt(key, val));
      }
    }
    return results;
  }

  setOpt(key, val) {
    var ref;
    if (((ref = this[key]) != null ? ref.call : void 0) != null) {
      return this[key](val);
    } else {
      return this[key] = val;
    }
  }

  getOpt(key) {
    var ref;
    if (((ref = this[key]) != null ? ref.call : void 0) != null) {
      return this[key]();
    } else {
      return this[key];
    }
  }

  getOpts() {
    var key, opts, ref, val;
    opts = {};
    ref = this.defaults;
    for (key in ref) {
      val = ref[key];
      opts[key] = this.getOpt(key);
    }
    return opts;
  }

};

// class Proxy
// target: (val)->
// if val?
// @_target = val
// for name, funct of @_target.prototype
// unless this[name]?
// this[name] = ->
// @_target[name].call(@_target,arguments)
// return @_target
AddModule = function(self, module) {
  var key, ref, results, value;
  if (!module) {
    throw 'AddModule requires module';
  }
  ref = module.prototype;
  results = [];
  for (key in ref) {
    value = ref[key];
    results.push(self.prototype[key] = value);
  }
  return results;
};

Replacement = (function() {
  class Replacement extends Pos {
    constructor(start1, end1, text1, options1 = {}) {
      super();
      this.start = start1;
      this.end = end1;
      this.text = text1;
      this.options = options1;
      this.setOpts(this.options);
    }

    setOpts(options) {
      return OptionObject.prototype.setOpts.call(this, options, {
        prefix: '',
        suffix: '',
        selections: []
      });
    }

    resPosBeforePrefix() {
      return this.start + this.prefix.length + this.text.length;
    }

    resEnd() {
      return this.start + this.finalText().length;
    }

    apply() {
      return this.editor().spliceText(this.start, this.end, this.finalText());
    }

    necessary() {
      return this.finalText() !== this.originalText();
    }

    originalText() {
      return this.editor().textSubstr(this.start, this.end);
    }

    finalText() {
      return this.prefix + this.text + this.suffix;
    }

    offsetAfter() {
      return this.finalText().length - (this.end - this.start);
    }

    applyOffset(offset) {
      var len1, n, ref, sel;
      if (offset !== 0) {
        this.start += offset;
        this.end += offset;
        ref = this.selections;
        for (n = 0, len1 = ref.length; n < len1; n++) {
          sel = ref[n];
          sel.start += offset;
          sel.end += offset;
        }
      }
      return this;
    }

    selectContent() {
      this.selections = [new Pos(this.prefix.length + this.start, this.prefix.length + this.start + this.text.length)];
      return this;
    }

    carretToSel() {
      var pos, res, start, text;
      this.selections = [];
      text = this.finalText();
      this.prefix = Codewave.util.removeCarret(this.prefix);
      this.text = Codewave.util.removeCarret(this.text);
      this.suffix = Codewave.util.removeCarret(this.suffix);
      start = this.start;
      while ((res = Codewave.util.getAndRemoveFirstCarret(text)) != null) {
        [pos, text] = res;
        this.selections.push(new Pos(start + pos, start + pos));
      }
      return this;
    }

    copy() {
      var res;
      res = new Replacement(this.start, this.end, this.text, this.getOpts());
      if (this.hasEditor()) {
        res.withEditor(this.editor());
      }
      res.selections = this.selections.map(function(s) {
        return s.copy();
      });
      return res;
    }

  };

  AddModule(Replacement, OptionObject);

  return Replacement;

}).call(this);

Wrapping = class Wrapping extends Replacement {
  constructor(start1, end1, prefix = '', suffix = '', options1 = {}) {
    super();
    this.start = start1;
    this.end = end1;
    this.options = options1;
    this.setOpts(this.options);
    this.text = '';
    this.prefix = prefix;
    this.suffix = suffix;
  }

  apply() {
    this.adjustSel();
    return super.apply();
  }

  adjustSel() {
    var len1, n, offset, ref, results, sel;
    offset = this.originalText().length;
    ref = this.selections;
    results = [];
    for (n = 0, len1 = ref.length; n < len1; n++) {
      sel = ref[n];
      if (sel.start > this.start + this.prefix.length) {
        sel.start += offset;
      }
      if (sel.end >= this.start + this.prefix.length) {
        results.push(sel.end += offset);
      } else {
        results.push(void 0);
      }
    }
    return results;
  }

  finalText() {
    var text;
    if (this.hasEditor()) {
      text = this.originalText();
    } else {
      text = '';
    }
    return this.prefix + text + this.suffix;
  }

  offsetAfter() {
    return this.prefix.length + this.suffix.length;
  }

  copy() {
    var res;
    res = new Wrapping(this.start, this.end, this.prefix, this.suffix);
    res.selections = this.selections.map(function(s) {
      return s.copy();
    });
    return res;
  }

};

PairMatch = class PairMatch {
  constructor(pair, match1, offset1 = 0) {
    this.pair = pair;
    this.match = match1;
    this.offset = offset1;
  }

  name() {
    var _name, group, i, len1, n, ref;
    if (this.match) {
      if (typeof _name === "undefined" || _name === null) {
        ref = this.match;
        for (i = n = 0, len1 = ref.length; n < len1; i = ++n) {
          group = ref[i];
          if (i > 0 && (group != null)) {
            _name = this.pair.matchAnyPartKeys()[i - 1];
            return _name;
          }
        }
        _name = false;
      }
      return _name || null;
    }
  }

  start() {
    return this.match.index + this.offset;
  }

  end() {
    return this.match.index + this.match[0].length + this.offset;
  }

  valid() {
    return !this.pair.validMatch || this.pair.validMatch(this);
  }

  length() {
    return this.match[0].length;
  }

};

Pair = class Pair {
  constructor(opener, closer, options1 = {}) {
    var defaults, key, val;
    this.opener = opener;
    this.closer = closer;
    this.options = options1;
    defaults = {
      optionnal_end: false,
      validMatch: null
    };
    for (key in defaults) {
      val = defaults[key];
      if (key in this.options) {
        this[key] = this.options[key];
      } else {
        this[key] = val;
      }
    }
  }

  openerReg() {
    if (typeof this.opener === 'string') {
      return new RegExp(Codewave.util.escapeRegExp(this.opener));
    } else {
      return this.opener;
    }
  }

  closerReg() {
    if (typeof this.closer === 'string') {
      return new RegExp(Codewave.util.escapeRegExp(this.closer));
    } else {
      return this.closer;
    }
  }

  matchAnyParts() {
    return {
      opener: this.openerReg(),
      closer: this.closerReg()
    };
  }

  matchAnyPartKeys() {
    var key, keys, ref, reg;
    keys = [];
    ref = this.matchAnyParts();
    for (key in ref) {
      reg = ref[key];
      keys.push(key);
    }
    return keys;
  }

  matchAnyReg() {
    var groups, key, ref, reg;
    groups = [];
    ref = this.matchAnyParts();
    for (key in ref) {
      reg = ref[key];
      groups.push('(' + reg.source + ')'); // [pawa python] replace reg.source reg.pattern
    }
    return new RegExp(groups.join('|'));
  }

  matchAny(text, offset = 0) {
    var match;
    while (((match = this._matchAny(text, offset)) != null) && !match.valid()) {
      offset = match.end();
    }
    if ((match != null) && match.valid()) {
      return match;
    }
  }

  _matchAny(text, offset = 0) {
    var match;
    if (offset) {
      text = text.substr(offset);
    }
    match = this.matchAnyReg().exec(text);
    if (match != null) {
      return new PairMatch(this, match, offset);
    }
  }

  matchAnyNamed(text) {
    return this._matchAnyGetName(this.matchAny(text));
  }

  matchAnyLast(text, offset = 0) {
    var match, res;
    while (match = this.matchAny(text, offset)) {
      offset = match.end();
      if (!res || res.end() !== match.end()) {
        res = match;
      }
    }
    return res;
  }

  identical() {
    return this.opener === this.closer || ((this.opener.source != null) && (this.closer.source != null) && this.opener.source === this.closer.source);
  }

  wrapperPos(pos, text) {
    var end, start;
    start = this.matchAnyLast(text.substr(0, pos.start));
    if ((start != null) && (this.identical() || start.name() === 'opener')) {
      end = this.matchAny(text, pos.end);
      if ((end != null) && (this.identical() || end.name() === 'closer')) {
        return new Codewave.util.Pos(start.start(), end.end());
      } else if (this.optionnal_end) {
        return new Codewave.util.Pos(start.start(), text.length);
      }
    }
  }

  isWapperOf(pos, text) {
    return this.wrapperPos(pos, text) != null;
  }

};

this.Codewave.util = {
  splitFirstNamespace: function(fullname, isSpace = false) {
    var parts;
    if (fullname.indexOf(":") === -1 && !isSpace) {
      return [null, fullname];
    }
    parts = fullname.split(':');
    return [parts.shift(), parts.join(':') || null];
  },
  splitNamespace: function(fullname) {
    var name, parts;
    if (fullname.indexOf(":") === -1) {
      return [null, fullname];
    }
    parts = fullname.split(':');
    name = parts.pop();
    return [parts.join(':'), name];
  },
  trimEmptyLine: function(txt) {
    return txt.replace(/^\s*\r?\n/, '').replace(/\r?\n\s*$/, '');
  },
  escapeRegExp: function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  },
  repeatToLength: function(txt, length) {
    if (length <= 0) {
      return '';
    }
    return Array(Math.ceil(length / txt.length) + 1).join(txt).substring(0, length);
  },
  repeat: function(txt, nb) {
    return Array(nb + 1).join(txt);
  },
  getTxtSize: function(txt) {
    var l, len1, lines, n, w;
    lines = txt.replace(/\r/g, '').split("\n"); // [pawa python] replace '/\r/g' "'\r'"
    w = 0;
    for (n = 0, len1 = lines.length; n < len1; n++) {
      l = lines[n];
      w = Math.max(w, l.length);
    }
    return new Size(w, lines.length - 1);
  },
  indentNotFirst: function(text, nb = 1, spaces = '  ') {
    var reg;
    if (text != null) {
      reg = /\n/g; // [pawa python] replace '/\n/g' "re.compile(r'\n',re.M)"
      return text.replace(reg, "\n" + Codewave.util.repeat(spaces, nb));
    } else {
      return text;
    }
  },
  indent: function(text, nb = 1, spaces = '  ') {
    if (text != null) {
      return spaces + Codewave.util.indentNotFirst(text, nb, spaces);
    } else {
      return text;
    }
  },
  reverseStr: function(txt) {
    return txt.split("").reverse().join("");
  },
  removeCarret: function(txt, carretChar = '|') {
    var reCarret, reQuoted, reTmp, tmp;
    tmp = '[[[[quoted_carret]]]]';
    reCarret = new RegExp(Codewave.util.escapeRegExp(carretChar), "g");
    reQuoted = new RegExp(Codewave.util.escapeRegExp(carretChar + carretChar), "g");
    reTmp = new RegExp(Codewave.util.escapeRegExp(tmp), "g");
    return txt.replace(reQuoted, tmp).replace(reCarret, '').replace(reTmp, carretChar);
  },
  getAndRemoveFirstCarret: function(txt, carretChar = '|') {
    var pos;
    pos = Codewave.util.getCarretPos(txt, carretChar);
    if (pos != null) {
      txt = txt.substr(0, pos) + txt.substr(pos + carretChar.length);
      return [pos, txt];
    }
  },
  getCarretPos: function(txt, carretChar = '|') {
    var i, reQuoted;
    reQuoted = new RegExp(Codewave.util.escapeRegExp(carretChar + carretChar), "g");
    txt = txt.replace(reQuoted, ' '); // [pawa python] replace reQuoted carretChar+carretChar
    if ((i = txt.indexOf(carretChar)) > -1) {
      return i;
    }
  },
  isArray: function(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  },
  posCollection: function(arr) {
    if (!Codewave.util.isArray(arr)) {
      arr === [arr];
    }
    arr.wrap = function(prefix, suffix) {
      return this.map(function(p) {
        return new Wrapping(p.start, p.end, prefix, suffix);
      });
    };
    arr.replace = function(txt) {
      return this.map(function(p) {
        return new Replacement(p.start, p.end, txt);
      });
    };
    return arr;
  },
  StrPos: StrPos,
  Pos: Pos,
  WrappedPos: WrappedPos,
  Size: Size,
  Pair: Pair,
  Replacement: Replacement,
  Wrapping: Wrapping,
  union: function(a1, a2) {
    return Codewave.util.unique(a1.concat(a2));
  },
  unique: function(array) {
    var a, i, j;
    a = array.concat();
    i = 0;
    while (i < a.length) {
      j = i + 1;
      while (j < a.length) {
        if (a[i] === a[j]) {
          a.splice(j--, 1);
        }
        ++j;
      }
      ++i;
    }
    return a;
  },
  merge: function(...xs) {
    if ((xs != null ? xs.length : void 0) > 0) {
      return Codewave.util.tap({}, function(m) {
        var k, len1, n, results, v, x;
        results = [];
        for (n = 0, len1 = xs.length; n < len1; n++) {
          x = xs[n];
          results.push((function() {
            var results1;
            results1 = [];
            for (k in x) {
              v = x[k];
              results1.push(m[k] = v);
            }
            return results1;
          })());
        }
        return results;
      });
    }
  },
  tap: function(o, fn) {
    fn(o);
    return o;
  }
};

//# sourceMappingURL=maps/Util.js.map
