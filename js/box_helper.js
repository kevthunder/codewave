// Generated by CoffeeScript 1.8.0
(function() {
  this.Codewave.util.BoxHelper = (function() {
    function BoxHelper(codewave, options) {
      var defaults, key, val;
      this.codewave = codewave;
      if (options == null) {
        options = {};
      }
      defaults = {
        deco: codewave.deco,
        pad: 2,
        width: 50,
        height: 3,
        openText: '',
        closeText: '',
        indent: 0
      };
      for (key in defaults) {
        val = defaults[key];
        if (key in options) {
          this[key] = options[key];
        } else {
          this[key] = val;
        }
      }
    }

    BoxHelper.prototype.draw = function(text) {
      return this.startSep() + "\n" + this.lines(text) + "\n" + this.endSep();
    };

    BoxHelper.prototype.wrapComment = function(str) {
      return this.codewave.wrapComment(str);
    };

    BoxHelper.prototype.separator = function() {
      var len;
      len = this.width + 2 * this.pad + 2 * this.deco.length;
      return this.wrapComment(this.decoLine(len));
    };

    BoxHelper.prototype.startSep = function() {
      var ln;
      ln = this.width + 2 * this.pad + 2 * this.deco.length - this.openText.length;
      return this.wrapComment(this.openText + this.decoLine(ln));
    };

    BoxHelper.prototype.endSep = function() {
      var ln;
      ln = this.width + 2 * this.pad + 2 * this.deco.length - this.closeText.length;
      return this.wrapComment(this.closeText + this.decoLine(ln));
    };

    BoxHelper.prototype.decoLine = function(len) {
      return Codewave.util.repeatToLength(this.deco, len);
    };

    BoxHelper.prototype.padding = function() {
      return Codewave.util.repeatToLength(" ", this.pad);
    };

    BoxHelper.prototype.lines = function(text, toHeight) {
      var l, lines, x;
      if (text == null) {
        text = '';
      }
      if (toHeight == null) {
        toHeight = true;
      }
      text = text || '';
      lines = text.replace(/\r/g, '').split("\n");
      if (toHeight) {
        return ((function() {
          var _i, _ref, _results;
          _results = [];
          for (x = _i = 0, _ref = this.height; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
            _results.push(this.line(lines[x] || ''));
          }
          return _results;
        }).call(this)).join('\n');
      } else {
        return ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = lines.length; _i < _len; _i++) {
            l = lines[_i];
            _results.push(this.line(l));
          }
          return _results;
        }).call(this)).join('\n');
      }
    };

    BoxHelper.prototype.line = function(text) {
      if (text == null) {
        text = '';
      }
      return Codewave.util.repeatToLength(" ", this.indent) + this.wrapComment(this.deco + this.padding() + text + Codewave.util.repeatToLength(" ", this.width - this.removeIgnoredContent(text).length) + this.padding() + this.deco);
    };

    BoxHelper.prototype.removeIgnoredContent = function(text) {
      console.log(text, this.codewave.removeMarkers(text));
      return this.codewave.removeMarkers(this.codewave.removeCarret(text));
    };

    BoxHelper.prototype.textBounds = function(text) {
      return Codewave.util.getTxtSize(this.removeIgnoredContent(text));
    };

    BoxHelper.prototype.getBoxForPos = function(pos) {
      var end, endFind, start, startFind;
      startFind = this.codewave.wrapCommentLeft(this.deco + this.deco);
      endFind = this.codewave.wrapCommentRight(this.deco + this.deco);
      start = this.codewave.findPrev(pos.start, startFind);
      end = this.codewave.findNext(pos.end, endFind);
      if ((start != null) && (end != null)) {
        return new Codewave.util.Pos(start, end + endFind.length);
      }
    };

    BoxHelper.prototype.getOptFromLine = function(line, getPad) {
      var endPos, rEnd, rStart, resEnd, resStart, startPos;
      if (getPad == null) {
        getPad = true;
      }
      rStart = new RegExp("(\\s*)(" + this.codewave.wrapCommentLeft(this.deco) + ")(\\s*)");
      rEnd = new RegExp("(\\s*)(" + this.codewave.wrapCommentRight(this.deco) + ")");
      resStart = rStart.exec(line);
      resEnd = rEnd.exec(line);
      if (getPad) {
        this.pad = Math.min(resStart[3].length, resEnd[1].length);
      }
      this.indent = resStart[1].length;
      startPos = resStart.index + resStart[1].length + resStart[2].length + this.pad;
      endPos = resEnd.index + resEnd[1].length - this.pad;
      this.width = endPos - startPos;
      return this;
    };

    BoxHelper.prototype.reformatLines = function(text, options) {
      if (options == null) {
        options = {};
      }
      return this.lines(this.removeComment(text, options), false);
    };

    BoxHelper.prototype.removeComment = function(text, options) {
      var defaults, ecl, ecr, ed, flag, opt, re1, re2;
      if (options == null) {
        options = {};
      }
      if (text != null) {
        defaults = {
          multiline: true
        };
        opt = Codewave.util.merge(defaults, options);
        ecl = Codewave.util.escapeRegExp(this.codewave.wrapCommentLeft());
        ecr = Codewave.util.escapeRegExp(this.codewave.wrapCommentRight());
        ed = Codewave.util.escapeRegExp(this.deco);
        flag = options['multiline'] ? 'gm' : '';
        re1 = new RegExp("^\\s*" + ecl + "(?:" + ed + ")*\\s{0," + this.pad + "}", flag);
        re2 = new RegExp("\\s*(?:" + ed + ")*" + ecr + "\\s*$", flag);
        return text = text.replace(re1, '').replace(re2, '');
      }
    };

    return BoxHelper;

  })();

}).call(this);

//# sourceMappingURL=box_helper.js.map