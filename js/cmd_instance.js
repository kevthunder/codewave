// Generated by CoffeeScript 1.8.0
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.Codewave.CmdInstance = (function() {
    function CmdInstance(codewave, pos, str) {
      this.codewave = codewave;
      this.pos = pos;
      this.str = str;
      if (!this.isEmpty()) {
        this._checkCloser();
        this.opening = this.str;
        this.noBracket = this._removeBracket(this.str);
        this._splitComponents();
        this._findClosing();
        this._checkElongated();
        this._checkBox();
        this.content = this.removeIndentFromContent(this.content);
      }
    }

    CmdInstance.prototype.init = function() {
      if (!(this.isEmpty() || this.inited)) {
        this.inited = true;
        this.getCmd();
        this._getCmdObj();
        this._parseParams(this.rawParams);
        if (this.cmdObj != null) {
          this.cmdObj.init();
        }
      }
      return this;
    };

    CmdInstance.prototype._checkCloser = function() {
      var f, noBracket;
      noBracket = this._removeBracket(this.str);
      if (noBracket.substring(0, this.codewave.closeChar.length) === this.codewave.closeChar && (f = this._findOpeningPos())) {
        this.closingPos = new Codewave.util.StrPos(this.pos, this.str);
        this.pos = f.pos;
        return this.str = f.str;
      }
    };

    CmdInstance.prototype._findOpeningPos = function() {
      var closing, cmdName, f, opening;
      cmdName = this._removeBracket(this.str).substring(this.codewave.closeChar.length);
      opening = this.codewave.brakets + cmdName;
      closing = this.str;
      if (f = this.codewave.findMatchingPair(this.pos, opening, closing, -1)) {
        f.str = this.codewave.editor.textSubstr(f.pos, this.codewave.findNextBraket(f.pos + f.str.length) + this.codewave.brakets.length);
        return f;
      }
    };

    CmdInstance.prototype._splitComponents = function() {
      var parts;
      parts = this.noBracket.split(" ");
      this.cmdName = parts.shift();
      return this.rawParams = parts.join(" ");
    };

    CmdInstance.prototype._parseParams = function(params) {
      var allowedNamed, chr, i, inStr, name, nameToParam, param, _i, _ref;
      this.params = [];
      this.named = {};
      if (this.cmd != null) {
        this.named = Codewave.util.merge(this.named, this.cmd.getDefaults(this));
        nameToParam = this.cmd.getOption('nameToParam', this);
        if (nameToParam != null) {
          this.named[nameToParam] = this.cmdName;
        }
      }
      if (params.length) {
        allowedNamed = this.cmd.getOption('allowedNamed', this);
        inStr = false;
        param = '';
        name = false;
        for (i = _i = 0, _ref = params.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          chr = params[i];
          if (chr === ' ' && !inStr) {
            if (name) {
              this.named[name] = param;
            } else {
              this.params.push(param);
            }
            param = '';
            name = false;
          } else if (chr === '"' && (i === 0 || params[i - 1] !== '\\')) {
            inStr = !inStr;
          } else if (chr === ':' && !name && !inStr && ((allowedNamed == null) || __indexOf.call(allowedNamed, name) >= 0)) {
            name = param;
            param = '';
          } else {
            param += chr;
          }
        }
        if (param.length) {
          if (name) {
            return this.named[name] = param;
          } else {
            return this.params.push(param);
          }
        }
      }
    };

    CmdInstance.prototype._findClosing = function() {
      var f;
      if (f = this._findClosingPos()) {
        console.log(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos).replace(/\n/g, '\\n'));
        console.log(Codewave.util.trimEmptyLine(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos)).replace(/\n/g, '\\n'));
        this.content = Codewave.util.trimEmptyLine(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos));
        return this.str = this.codewave.editor.textSubstr(this.pos, f.pos + f.str.length);
      }
    };

    CmdInstance.prototype._findClosingPos = function() {
      var closing, f, opening;
      if (this.closingPos != null) {
        return this.closingPos;
      }
      closing = this.codewave.brakets + this.codewave.closeChar + this.cmdName + this.codewave.brakets;
      opening = this.codewave.brakets + this.cmdName;
      if (f = this.codewave.findMatchingPair(this.pos + this.str.length, opening, closing)) {
        return this.closingPos = f;
      }
    };

    CmdInstance.prototype._checkElongated = function() {
      var endPos, max, _ref;
      endPos = this.getEndPos();
      max = this.codewave.editor.textLen();
      while (endPos < max && this.codewave.editor.textSubstr(endPos, endPos + this.codewave.deco.length) === this.codewave.deco) {
        endPos += this.codewave.deco.length;
      }
      if (endPos >= max || ((_ref = this.codewave.editor.textSubstr(endPos, endPos + this.codewave.deco.length)) === ' ' || _ref === "\n" || _ref === "\r")) {
        return this.str = this.codewave.editor.textSubstr(this.pos, endPos);
      }
    };

    CmdInstance.prototype._checkBox = function() {
      var cl, cr, endPos;
      cl = this.codewave.wrapCommentLeft();
      cr = this.codewave.wrapCommentRight();
      endPos = this.getEndPos() + cr.length;
      if (this.codewave.editor.textSubstr(this.pos - cl.length, this.pos) === cl && this.codewave.editor.textSubstr(endPos - cr.length, endPos) === cr) {
        this.pos = this.pos - cl.length;
        this.str = this.codewave.editor.textSubstr(this.pos, endPos);
        return this._removeCommentFromContent();
      } else if (this.sameLinesPrefix().indexOf(cl) > -1 && this.sameLinesSuffix().indexOf(cr) > -1) {
        this.inBox = 1;
        return this._removeCommentFromContent();
      }
    };

    CmdInstance.prototype._removeCommentFromContent = function() {
      var ecl, ecr, ed, re1, re2, re3;
      if (this.content) {
        ecl = Codewave.util.escapeRegExp(this.codewave.wrapCommentLeft());
        ecr = Codewave.util.escapeRegExp(this.codewave.wrapCommentRight());
        ed = Codewave.util.escapeRegExp(this.codewave.deco);
        re1 = new RegExp("^\\s*" + ecl + "(?:" + ed + ")+\\s*(.*?)\\s*(?:" + ed + ")+" + ecr + "$", "gm");
        re2 = new RegExp("^\\s*(?:" + ed + ")*" + ecr + "\r?\n");
        re3 = new RegExp("\n\\s*" + ecl + "(?:" + ed + ")*\\s*$");
        return this.content = this.content.replace(re1, '$1').replace(re2, '').replace(re3, '');
      }
    };

    CmdInstance.prototype._getParentCmds = function() {
      var _ref;
      return this.parent = (_ref = this.codewave.getEnclosingCmd(this.getEndPos())) != null ? _ref.init() : void 0;
    };

    CmdInstance.prototype.prevEOL = function() {
      if (this._prevEOL == null) {
        this._prevEOL = this.codewave.findLineStart(this.pos);
      }
      return this._prevEOL;
    };

    CmdInstance.prototype.nextEOL = function() {
      if (this._nextEOL == null) {
        this._nextEOL = this.codewave.findLineEnd(this.getEndPos());
      }
      return this._nextEOL;
    };

    CmdInstance.prototype.rawWithFullLines = function() {
      if (this._rawWithFullLines == null) {
        this._rawWithFullLines = this.codewave.editor.textSubstr(this.prevEOL(), this.nextEOL());
      }
      return this._rawWithFullLines;
    };

    CmdInstance.prototype.sameLinesPrefix = function() {
      if (this._sameLinesPrefix == null) {
        this._sameLinesPrefix = this.codewave.editor.textSubstr(this.prevEOL(), this.pos);
      }
      return this._sameLinesPrefix;
    };

    CmdInstance.prototype.sameLinesSuffix = function() {
      if (this._sameLinesSuffix == null) {
        this._sameLinesSuffix = this.codewave.editor.textSubstr(this.getEndPos(), this.nextEOL());
      }
      return this._sameLinesSuffix;
    };

    CmdInstance.prototype.getCmd = function() {
      if (this.cmd == null) {
        this._getParentCmds();
        if (this.noBracket.substring(0, this.codewave.noExecuteChar.length) === this.codewave.noExecuteChar) {
          this.cmd = Codewave.Command.cmds.getCmd('core:no_execute');
        } else {
          this.finder = this._getFinder(this.cmdName);
          this.cmd = this.finder.find();
        }
      }
      return this.cmd;
    };

    CmdInstance.prototype._getFinder = function(cmdName) {
      var finder;
      finder = this.codewave.getFinder(cmdName, this._getParentNamespaces());
      finder.instance = this;
      return finder;
    };

    CmdInstance.prototype._getCmdObj = function() {
      if (this.cmd != null) {
        return this.cmdObj = this.cmd.getExecutableObj(this);
      }
    };

    CmdInstance.prototype._getParentNamespaces = function() {
      var nspcs, obj;
      nspcs = [];
      obj = this;
      while (obj.parent != null) {
        obj = obj.parent;
        if ((obj.cmd != null) && (obj.cmd.fullName != null)) {
          nspcs.push(obj.cmd.fullName);
        }
      }
      return nspcs;
    };

    CmdInstance.prototype._removeBracket = function(str) {
      return str.substring(this.codewave.brakets.length, str.length - this.codewave.brakets.length);
    };

    CmdInstance.prototype.isEmpty = function() {
      return this.str === this.codewave.brakets + this.codewave.closeChar + this.codewave.brakets || this.str === this.codewave.brakets + this.codewave.brakets;
    };

    CmdInstance.prototype.getParam = function(names, defVal) {
      var n, _i, _len;
      if (defVal == null) {
        defVal = null;
      }
      if (typeof names === 'string') {
        names = [names];
      }
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        n = names[_i];
        if (this.named[n] != null) {
          return this.named[n];
        }
        if (this.params[n] != null) {
          return this.params[n];
        }
      }
      return defVal;
    };

    CmdInstance.prototype.execute = function() {
      var alterFunct, beforeFunct, parser, res;
      if (this.isEmpty()) {
        if ((this.codewave.closingPromp != null) && (this.codewave.closingPromp.whithinOpenBounds(this.pos + this.codewave.brakets.length) != null)) {
          return this.codewave.closingPromp.cancel();
        } else {
          return this.replaceWith('');
        }
      } else if (this.cmd != null) {
        if (beforeFunct = this.cmd.getOption('beforeExecute', this)) {
          beforeFunct(this);
        }
        if (this.cmd.resultIsAvailable(this)) {
          if ((res = this.cmd.result(this)) != null) {
            res = this.formatIndent(res);
            if (this.cmd.getOption('parse', this)) {
              parser = this.getParserForText(res);
              res = parser.parseAll();
            }
            if (alterFunct = this.cmd.getOption('alterResult', this)) {
              res = alterFunct(res, this);
            }
            this.replaceWith(res);
            return true;
          }
        } else {
          return this.cmd.execute(this);
        }
      }
    };

    CmdInstance.prototype.result = function() {
      if (this.cmd.resultIsAvailable()) {
        return this.formatIndent(this.cmd.result(this));
      }
    };

    CmdInstance.prototype.getParserForText = function(txt) {
      var parser;
      parser = new Codewave(new Codewave.TextParser(txt));
      parser.context = this;
      parser.checkCarret = false;
      return parser;
    };

    CmdInstance.prototype.getEndPos = function() {
      return this.pos + this.str.length;
    };

    CmdInstance.prototype.getPos = function() {
      return new Codewave.util.Pos(this.pos, this.pos + this.str.length);
    };

    CmdInstance.prototype.getIndent = function() {
      var helper;
      if (this.indentLen == null) {
        if (this.inBox != null) {
          helper = new Codewave.util.BoxHelper(this.codewave);
          this.indentLen = helper.removeComment(this.sameLinesPrefix()).length;
        } else {
          this.indentLen = this.pos - this.codewave.findLineStart(this.pos);
        }
      }
      return this.indentLen;
    };

    CmdInstance.prototype.formatIndent = function(text) {
      if (text != null) {
        return text.replace(/\t/g, '  ');
      } else {
        return text;
      }
    };

    CmdInstance.prototype.applyIndent = function(text) {
      var reg;
      if (text != null) {
        reg = /\n/g;
        return text.replace(reg, "\n" + Codewave.util.repeatToLength(" ", this.getIndent()));
      } else {
        return text;
      }
    };

    CmdInstance.prototype.removeIndentFromContent = function(text) {
      var reg;
      if (text != null) {
        reg = new RegExp('^\\s{' + this.getIndent() + '}', 'gm');
        return text.replace(reg, '');
      } else {
        return text;
      }
    };

    CmdInstance.prototype.replaceWith = function(text) {
      var cursorPos, end, helper, p, prefix, res, start, suffix, _ref;
      prefix = suffix = '';
      start = this.pos;
      end = this.getEndPos();
      text = this.applyIndent(text);
      if (this.inBox != null) {
        start = this.prevEOL();
        end = this.nextEOL();
        helper = new Codewave.util.BoxHelper(this.codewave).getOptFromLine(this.rawWithFullLines(), false);
        res = helper.reformatLines(this.sameLinesPrefix() + this.codewave.marker + text + this.codewave.marker + this.sameLinesSuffix(), {
          multiline: false
        });
        _ref = res.split(this.codewave.marker), prefix = _ref[0], text = _ref[1], suffix = _ref[2];
      }
      cursorPos = start + prefix.length + text.length;
      if ((this.cmd != null) && this.codewave.checkCarret && this.cmd.getOption('checkCarret', this)) {
        if ((p = this.codewave.getCarretPos(text)) != null) {
          cursorPos = start + prefix.length + p;
        }
        text = this.codewave.removeCarret(text);
      }
      this.codewave.editor.spliceText(start, end, prefix + text + suffix);
      this.codewave.editor.setCursorPos(cursorPos);
      this.replaceStart = start;
      return this.replaceEnd = start + prefix.length + text.length + suffix.length;
    };

    return CmdInstance;

  })();

}).call(this);

//# sourceMappingURL=cmd_instance.js.map
