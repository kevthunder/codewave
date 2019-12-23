

const Pair = require("../positioning/Pair");

const Detector = require("./Detector");

var PairDetector = class PairDetector extends Detector.Detector {
  detected(finder) {
    var pair;

    if (this.data.opener != null && this.data.closer != null && finder.instance != null) {
      pair = new Pair.Pair(this.data.opener, this.data.closer, this.data);

      if (pair.isWapperOf(finder.instance.getPos(), finder.codewave.editor.text())) {
        return true;
      }
    }

    return false;
  }

};
exports.PairDetector = PairDetector;

