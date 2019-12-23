

const Pos = require("./Pos");

const StringHelper = require("../helpers/StringHelper");

const PairMatch = require("./PairMatch");

var Pair = class Pair {
  constructor(opener, closer, options = {}) {
    var defaults, key, val;
    this.opener = opener;
    this.closer = closer;
    this.options = options;
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
      return new RegExp(StringHelper.StringHelper.escapeRegExp(this.opener));
    } else {
      return this.opener;
    }
  }

  closerReg() {
    if (typeof this.closer === 'string') {
      return new RegExp(StringHelper.StringHelper.escapeRegExp(this.closer));
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
      groups.push('(' + reg.source + ')');
    }

    return new RegExp(groups.join('|'));
  }

  matchAny(text, offset = 0) {
    var match;

    while ((match = this._matchAny(text, offset)) != null && !match.valid()) {
      offset = match.end();
    }

    if (match != null && match.valid()) {
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
      return new PairMatch.PairMatch(this, match, offset);
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
    return this.opener === this.closer || this.opener.source != null && this.closer.source != null && this.opener.source === this.closer.source;
  }

  wrapperPos(pos, text) {
    var end, start;
    start = this.matchAnyLast(text.substr(0, pos.start));

    if (start != null && (this.identical() || start.name() === 'opener')) {
      end = this.matchAny(text, pos.end);

      if (end != null && (this.identical() || end.name() === 'closer')) {
        return new Pos.Pos(start.start(), end.end());
      } else if (this.optionnal_end) {
        return new Pos.Pos(start.start(), text.length);
      }
    }
  }

  isWapperOf(pos, text) {
    return this.wrapperPos(pos, text) != null;
  }

};
exports.Pair = Pair;

