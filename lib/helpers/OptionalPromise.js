"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionalPromise = exports.OptionalPromise = void 0;
var OptionalPromise = class OptionalPromise {
  constructor(val1) {
    this.val = val1;

    if (this.val.then != null && this.val.result != null) {
      this.val = this.val.result();
    }
  }

  then(cb) {
    if (this.val.then != null) {
      return new OptionalPromise(this.val.then(cb));
    } else {
      return new OptionalPromise(cb(this.val));
    }
  }

  result() {
    return this.val;
  }

};
exports.OptionalPromise = OptionalPromise;

var optionalPromise = function (val) {
  return new OptionalPromise(val);
};

exports.optionalPromise = optionalPromise;
//# sourceMappingURL=../maps/helpers/OptionalPromise.js.map
