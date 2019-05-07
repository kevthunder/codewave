import {
  Wrapping
} from './Wrapping';

import {
  Replacement
} from './Replacement';

import {
  CommonHelper
} from '../helpers/CommonHelper';

export var PosCollection = class PosCollection {
  constructor(arr) {
    if (!Array.isArray(arr)) {
      arr = [arr];
    }
    CommonHelper.applyMixins(arr, [PosCollection]);
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
