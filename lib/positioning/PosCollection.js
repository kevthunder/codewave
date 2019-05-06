import {
  Wrapping
} from './Wrapping';

import {
  Replacement
} from './Replacement';

export var PosCollection = class PosCollection {
  constructor(arr) {
    if (!Codewave.util.isArray(arr)) {
      arr = [arr];
    }
    Object.assign(arr, PosCollection.prototype);
    return arr;
  }

  wrap(prefix, suffix) {
    return this.map(function(p) {
      return new Wrapping(p.start, p.end, prefix, suffix);
    });
  }

  replace(txt) {
    return this.map(function(p) {
      return new Replacement(p.start, p.end, txt);
    });
  }

};

//# sourceMappingURL=../maps/positioning/PosCollection.js.map
