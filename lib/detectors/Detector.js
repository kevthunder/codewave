
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

