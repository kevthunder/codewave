"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LangDetector = void 0;

var _Detector = require("./Detector");

var LangDetector = class LangDetector extends _Detector.Detector {
  detect(finder) {
    var lang;

    if (finder.codewave != null) {
      lang = finder.codewave.editor.getLang();

      if (lang != null) {
        return lang.toLowerCase();
      }
    }
  }

};
exports.LangDetector = LangDetector;
//# sourceMappingURL=../maps/detectors/LangDetector.js.map
