

const Detector = require("./Detector").Detector;

var AlwaysEnabled = class AlwaysEnabled extends Detector {
  constructor(namespace) {
    super();
    this.namespace = namespace;
  }

  detect(finder) {
    return this.namespace;
  }

};
exports.AlwaysEnabled = AlwaysEnabled;

