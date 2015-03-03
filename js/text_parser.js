// Generated by CoffeeScript 1.8.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Codewave.TextParser = (function(_super) {
    __extends(TextParser, _super);

    function TextParser(_text) {
      this._text = _text;
    }

    TextParser.prototype.text = function(val) {
      if (val != null) {
        this._text = val;
      }
      return this._text;
    };

    TextParser.prototype.textCharAt = function(pos) {
      return this.text()[pos];
    };

    TextParser.prototype.textLen = function(pos) {
      return this.text().length;
    };

    TextParser.prototype.textSubstr = function(start, end) {
      return this.text().substring(start, end);
    };

    TextParser.prototype.insertTextAt = function(text, pos) {
      return this.text(this.text().substring(0, pos) + text + this.text().substring(pos, this.text().length));
    };

    TextParser.prototype.spliceText = function(start, end, text) {
      return this.text(this.text().slice(0, start) + (text || "") + this.text().slice(end));
    };

    TextParser.prototype.getCursorPos = function() {
      return this.target;
    };

    TextParser.prototype.setCursorPos = function(start, end) {
      if (arguments.length < 2) {
        end = start;
      }
      return this.target = {
        start: end,
        end: end
      };
    };

    return TextParser;

  })(this.Codewave.Editor);

}).call(this);

//# sourceMappingURL=text_parser.js.map
