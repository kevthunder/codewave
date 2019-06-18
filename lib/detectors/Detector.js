"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Detector = void 0;
var Detector = class Detector {
  constructor(data = {}) {
    this.data = data;
  }

  detect(finder) {
    if (this.detected(finder)) {
      if (this.data.result != null) {
        return this.data.result;
      }
    } else {
      if (this.data.else != null) {
        return this.data.else;
      }
    }
  }

  detected(finder) {}

};
exports.Detector = Detector;
//# sourceMappingURL=../maps/detectors/Detector.js.map
