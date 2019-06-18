"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PairDetector = void 0;

var _Pair = require("../positioning/Pair");

var _Detector = require("./Detector");

var PairDetector = class PairDetector extends _Detector.Detector {
  detected(finder) {
    var pair;

    if (this.data.opener != null && this.data.closer != null && finder.instance != null) {
      pair = new _Pair.Pair(this.data.opener, this.data.closer, this.data);

      if (pair.isWapperOf(finder.instance.getPos(), finder.codewave.editor.text())) {
        return true;
      }
    }

    return false;
  }

};
exports.PairDetector = PairDetector;
//# sourceMappingURL=../maps/detectors/PairDetector.js.map
