"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlwaysEnabled = void 0;

var _Detector = require("./Detector");

var AlwaysEnabled = class AlwaysEnabled extends _Detector.Detector {
  constructor(namespace) {
    super();
    this.namespace = namespace;
  }

  detect(finder) {
    return this.namespace;
  }

};
exports.AlwaysEnabled = AlwaysEnabled;
//# sourceMappingURL=../maps/detectors/AlwaysEnabled.js.map
