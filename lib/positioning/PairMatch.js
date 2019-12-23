
var PairMatch = class PairMatch {
  constructor(pair, match, offset = 0) {
    this.pair = pair;
    this.match = match;
    this.offset = offset;
  }

  name() {
    var _name, group, i, j, len, ref;

    if (this.match) {
      if (typeof _name === "undefined" || _name === null) {
        ref = this.match;

        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          group = ref[i];

          if (i > 0 && group != null) {
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
exports.PairMatch = PairMatch;

