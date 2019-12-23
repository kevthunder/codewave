

const Detector = require("./Detector");

var AlwaysEnabled = class AlwaysEnabled extends Detector.Detector {
  constructor(namespace) {
    super();
    this.namespace = namespace;
  }

  detect(finder) {
    return this.namespace;
  }

};
exports.AlwaysEnabled = AlwaysEnabled;

