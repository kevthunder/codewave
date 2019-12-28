
const Detector = require('./Detector').Detector

var LangDetector = class LangDetector extends Detector {
  detect (finder) {
    var lang

    if (finder.codewave != null) {
      lang = finder.codewave.editor.getLang()

      if (lang != null) {
        return lang.toLowerCase()
      }
    }
  }
}
exports.LangDetector = LangDetector
