// [pawa python]
//   replace /data.(\w+)/ data['$1']
//   replace codewave.editor.text() codewave.editor.text
var LangDetector, PairDetector;

export var Detector = class Detector {
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


LangDetector = class LangDetector extends Detector {
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

PairDetector = class PairDetector extends Detector {
  detected(finder) {
    var pair;
    if ((this.data.opener != null) && (this.data.closer != null) && (finder.instance != null)) {
      pair = new Codewave.util.Pair(this.data.opener, this.data.closer, this.data);
      if (pair.isWapperOf(finder.instance.getPos(), finder.codewave.editor.text())) {
        return true;
      }
    }
    return false;
  }

};

//# sourceMappingURL=maps/Detector.js.map
