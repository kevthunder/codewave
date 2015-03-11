// Generated by CoffeeScript 1.8.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Codewave.Detector = (function() {
    function Detector(data) {
      this.data = data != null ? data : {};
    }

    Detector.prototype.detect = function(finder) {
      if (this.detected(finder)) {
        if (this.data.result != null) {
          return this.data.result;
        }
      } else {
        if (this.data["else"] != null) {
          return this.data["else"];
        }
      }
    };

    Detector.prototype.detected = function(finder) {};

    return Detector;

  })();

  this.Codewave.LangDetector = (function(_super) {
    __extends(LangDetector, _super);

    function LangDetector() {
      return LangDetector.__super__.constructor.apply(this, arguments);
    }

    LangDetector.prototype.detect = function(finder) {
      var lang;
      if (finder.codewave != null) {
        lang = finder.codewave.editor.getLang();
        if (lang != null) {
          return lang.toLowerCase();
        }
      }
    };

    return LangDetector;

  })(Codewave.Detector);

  this.Codewave.PairDetector = (function(_super) {
    __extends(PairDetector, _super);

    function PairDetector() {
      return PairDetector.__super__.constructor.apply(this, arguments);
    }

    PairDetector.prototype.detected = function(finder) {
      var pair;
      if ((this.data.opener != null) && (this.data.closer != null) && (finder.instance != null)) {
        pair = new Codewave.util.Pair(this.data.opener, this.data.closer, this.data);
        if (pair.isWapperOf(finder.instance.getPos(), finder.codewave.editor.text())) {
          return true;
        }
      }
      return false;
    };

    return PairDetector;

  })(Codewave.Detector);

}).call(this);

//# sourceMappingURL=detector.js.map