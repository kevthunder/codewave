(function() {
  var AddModule, BoxCmd, CloseCmd, EditCmd, EmmetCmd, NameSpaceCmd, OptionObject, Pair, PairMatch, Pos, Replacement, Size, StrPos, WrappedPos, Wrapping, _optKey, aliasCommand, exec_parent, getContent, getParam, initCmds, no_execute, quote_carret, removeCommand, renameCommand, wrapWithPhp,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.Codewave = (function() {
    function Codewave(editor, options) {
      var defaults, key, val;
      this.editor = editor;
      if (options == null) {
        options = {};
      }
      Codewave.init();
      this.marker = '[[[[codewave_marquer]]]]';
      this.vars = {};
      defaults = {
        'brakets': '~~',
        'deco': '~',
        'closeChar': '/',
        'noExecuteChar': '!',
        'carretChar': '|',
        'checkCarret': true,
        'inInstance': null
      };
      this.parent = options['parent'];
      this.nested = this.parent != null ? this.parent.nested + 1 : 0;
      for (key in defaults) {
        val = defaults[key];
        if (key in options) {
          this[key] = options[key];
        } else if ((this.parent != null) && key !== 'parent') {
          this[key] = this.parent[key];
        } else {
          this[key] = val;
        }
      }
      if (this.editor != null) {
        this.editor.bindedTo(this);
      }
      this.context = new Codewave.Context(this);
      if (this.inInstance != null) {
        this.context.parent = this.inInstance.context;
      }
    }

    Codewave.prototype.onActivationKey = function() {
      this.process = new Codewave.Process();
      Codewave.logger.log('activation key');
      this.runAtCursorPos();
      return this.process = null;
    };

    Codewave.prototype.runAtCursorPos = function() {
      if (this.editor.allowMultiSelection()) {
        return this.runAtMultiPos(this.editor.getMultiSel());
      } else {
        return this.runAtPos(this.editor.getCursorPos());
      }
    };

    Codewave.prototype.runAtPos = function(pos) {
      return this.runAtMultiPos([pos]);
    };

    Codewave.prototype.runAtMultiPos = function(multiPos) {
      var cmd;
      if (multiPos.length > 0) {
        cmd = this.commandOnPos(multiPos[0].end);
        if (cmd != null) {
          if (multiPos.length > 1) {
            cmd.setMultiPos(multiPos);
          }
          cmd.init();
          Codewave.logger.log(cmd);
          return cmd.execute();
        } else {
          if (multiPos[0].start === multiPos[0].end) {
            return this.addBrakets(multiPos);
          } else {
            return this.promptClosingCmd(multiPos);
          }
        }
      }
    };

    Codewave.prototype.commandOnPos = function(pos) {
      var next, prev;
      if (this.precededByBrakets(pos) && this.followedByBrakets(pos) && this.countPrevBraket(pos) % 2 === 1) {
        prev = pos - this.brakets.length;
        next = pos;
      } else {
        if (this.precededByBrakets(pos) && this.countPrevBraket(pos) % 2 === 0) {
          pos -= this.brakets.length;
        }
        prev = this.findPrevBraket(pos);
        if (prev == null) {
          return null;
        }
        next = this.findNextBraket(pos - 1);
        if ((next == null) || this.countPrevBraket(prev) % 2 !== 0) {
          return null;
        }
      }
      return new Codewave.PositionedCmdInstance(this, prev, this.editor.textSubstr(prev, next + this.brakets.length));
    };

    Codewave.prototype.nextCmd = function(start) {
      var beginning, f, pos;
      if (start == null) {
        start = 0;
      }
      pos = start;
      while (f = this.findAnyNext(pos, [this.brakets, "\n"])) {
        pos = f.pos + f.str.length;
        if (f.str === this.brakets) {
          if (typeof beginning !== "undefined" && beginning !== null) {
            return new Codewave.PositionedCmdInstance(this, beginning, this.editor.textSubstr(beginning, f.pos + this.brakets.length));
          } else {
            beginning = f.pos;
          }
        } else {
          beginning = null;
        }
      }
      return null;
    };

    Codewave.prototype.getEnclosingCmd = function(pos) {
      var closingPrefix, cmd, cpos, p;
      if (pos == null) {
        pos = 0;
      }
      cpos = pos;
      closingPrefix = this.brakets + this.closeChar;
      while ((p = this.findNext(cpos, closingPrefix)) != null) {
        if (cmd = this.commandOnPos(p + closingPrefix.length)) {
          cpos = cmd.getEndPos();
          if (cmd.pos < pos) {
            return cmd;
          }
        } else {
          cpos = p + closingPrefix.length;
        }
      }
      return null;
    };

    Codewave.prototype.precededByBrakets = function(pos) {
      return this.editor.textSubstr(pos - this.brakets.length, pos) === this.brakets;
    };

    Codewave.prototype.followedByBrakets = function(pos) {
      return this.editor.textSubstr(pos, pos + this.brakets.length) === this.brakets;
    };

    Codewave.prototype.countPrevBraket = function(start) {
      var i;
      i = 0;
      while ((start = this.findPrevBraket(start)) != null) {
        i++;
      }
      return i;
    };

    Codewave.prototype.isEndLine = function(pos) {
      return this.editor.textSubstr(pos, pos + 1) === "\n" || pos + 1 >= this.editor.textLen();
    };

    Codewave.prototype.findPrevBraket = function(start) {
      return this.findNextBraket(start, -1);
    };

    Codewave.prototype.findNextBraket = function(start, direction) {
      var f;
      if (direction == null) {
        direction = 1;
      }
      f = this.findAnyNext(start, [this.brakets, "\n"], direction);
      if (f && f.str === this.brakets) {
        return f.pos;
      }
    };

    Codewave.prototype.findPrev = function(start, string) {
      return this.findNext(start, string, -1);
    };

    Codewave.prototype.findNext = function(start, string, direction) {
      var f;
      if (direction == null) {
        direction = 1;
      }
      f = this.findAnyNext(start, [string], direction);
      if (f) {
        return f.pos;
      }
    };

    Codewave.prototype.findAnyNext = function(start, strings, direction) {
      if (direction == null) {
        direction = 1;
      }
      return this.editor.findAnyNext(start, strings, direction);
    };

    Codewave.prototype.findMatchingPair = function(startPos, opening, closing, direction) {
      var f, nested, pos;
      if (direction == null) {
        direction = 1;
      }
      pos = startPos;
      nested = 0;
      while (f = this.findAnyNext(pos, [closing, opening], direction)) {
        pos = f.pos + (direction > 0 ? f.str.length : 0);
        if (f.str === (direction > 0 ? closing : opening)) {
          if (nested > 0) {
            nested--;
          } else {
            return f;
          }
        } else {
          nested++;
        }
      }
      return null;
    };

    Codewave.prototype.addBrakets = function(pos) {
      var replacements;
      pos = Codewave.util.posCollection(pos);
      replacements = pos.wrap(this.brakets, this.brakets).map(function(r) {
        return r.selectContent();
      });
      return this.editor.applyReplacements(replacements);
    };

    Codewave.prototype.promptClosingCmd = function(selections) {
      if (this.closingPromp != null) {
        this.closingPromp.stop();
      }
      return this.closingPromp = Codewave.ClosingPromp.newFor(this, selections).begin();
    };

    Codewave.prototype.parseAll = function(recursive) {
      var cmd, parser, pos;
      if (recursive == null) {
        recursive = true;
      }
      if (this.nested > 100) {
        throw "Infinite parsing Recursion";
      }
      pos = 0;
      while (cmd = this.nextCmd(pos)) {
        pos = cmd.getEndPos();
        this.editor.setCursorPos(pos);
        cmd.init();
        if (recursive && (cmd.content != null) && ((cmd.getCmd() == null) || !cmd.getOption('preventParseAll'))) {
          parser = new Codewave(new Codewave.TextParser(cmd.content), {
            parent: this
          });
          cmd.content = parser.parseAll();
        }
        if (cmd.execute() != null) {
          if (cmd.replaceEnd != null) {
            pos = cmd.replaceEnd;
          } else {
            pos = this.editor.getCursorPos().end;
          }
        }
      }
      return this.getText();
    };

    Codewave.prototype.getText = function() {
      return this.editor.text();
    };

    Codewave.prototype.isRoot = function() {
      return (this.parent == null) && ((this.inInstance == null) || (this.inInstance.finder == null));
    };

    Codewave.prototype.getRoot = function() {
      if (this.isRoot) {
        return this;
      } else if (this.parent != null) {
        return this.parent.getRoot();
      } else if (this.inInstance != null) {
        return this.inInstance.codewave.getRoot();
      }
    };

    Codewave.prototype.removeCarret = function(txt) {
      return Codewave.util.removeCarret(txt, this.carretChar);
    };

    Codewave.prototype.getCarretPos = function(txt) {
      return Codewave.util.getCarretPos(txt, this.carretChar);
    };

    Codewave.prototype.regMarker = function(flags) {
      if (flags == null) {
        flags = "g";
      }
      return new RegExp(Codewave.util.escapeRegExp(this.marker), flags);
    };

    Codewave.prototype.removeMarkers = function(text) {
      return text.replace(this.regMarker(), '');
    };

    return Codewave;

  })();

  this.Codewave.inited = false;

  this.Codewave.init = function() {
    if (!Codewave.inited) {
      Codewave.inited = true;
      Codewave.Command.initCmds();
      return Codewave.Command.loadCmds();
    }
  };

  StrPos = (function() {
    function StrPos(pos1, str1) {
      this.pos = pos1;
      this.str = str1;
    }

    StrPos.prototype.end = function() {
      return this.pos + this.str.length;
    };

    return StrPos;

  })();

  Pos = (function() {
    function Pos(start1, end1) {
      this.start = start1;
      this.end = end1;
      if (this.end == null) {
        this.end = this.start;
      }
    }

    Pos.prototype.containsPt = function(pt) {
      return this.start <= pt && pt <= this.end;
    };

    Pos.prototype.containsPos = function(pos) {
      return this.start <= pos.start && pos.end <= this.end;
    };

    Pos.prototype.wrappedBy = function(prefix, suffix) {
      return new WrappedPos(this.start - prefix.length, this.start, this.end, this.end + suffix.length);
    };

    Pos.prototype.withEditor = function(val) {
      this._editor = val;
      return this;
    };

    Pos.prototype.editor = function() {
      if (this._editor == null) {
        throw new Error('No editor set');
      }
      return this._editor;
    };

    Pos.prototype.hasEditor = function() {
      return this._editor != null;
    };

    Pos.prototype.text = function() {
      return this.editor().textSubstr(this.start, this.end);
    };

    Pos.prototype.applyOffset = function(offset) {
      if (offset !== 0) {
        this.start += offset;
        this.end += offset;
      }
      return this;
    };

    Pos.prototype.prevEOL = function() {
      if (this._prevEOL == null) {
        this._prevEOL = this.editor().findLineStart(this.start);
      }
      return this._prevEOL;
    };

    Pos.prototype.nextEOL = function() {
      if (this._nextEOL == null) {
        this._nextEOL = this.editor().findLineEnd(this.end);
      }
      return this._nextEOL;
    };

    Pos.prototype.textWithFullLines = function() {
      if (this._textWithFullLines == null) {
        this._textWithFullLines = this.editor().textSubstr(this.prevEOL(), this.nextEOL());
      }
      return this._textWithFullLines;
    };

    Pos.prototype.sameLinesPrefix = function() {
      if (this._sameLinesPrefix == null) {
        this._sameLinesPrefix = this.editor().textSubstr(this.prevEOL(), this.start);
      }
      return this._sameLinesPrefix;
    };

    Pos.prototype.sameLinesSuffix = function() {
      if (this._sameLinesSuffix == null) {
        this._sameLinesSuffix = this.editor().textSubstr(this.end, this.nextEOL());
      }
      return this._sameLinesSuffix;
    };

    Pos.prototype.copy = function() {
      var res;
      res = new Pos(this.start, this.end);
      if (this.hasEditor()) {
        res.withEditor(this.editor());
      }
      return res;
    };

    Pos.prototype.raw = function() {
      return [this.start, this.end];
    };

    return Pos;

  })();

  WrappedPos = (function(superClass) {
    extend(WrappedPos, superClass);

    function WrappedPos(start1, innerStart1, innerEnd1, end1) {
      this.start = start1;
      this.innerStart = innerStart1;
      this.innerEnd = innerEnd1;
      this.end = end1;
    }

    WrappedPos.prototype.innerContainsPt = function(pt) {
      return this.innerStart <= pt && pt <= this.innerEnd;
    };

    WrappedPos.prototype.innerContainsPos = function(pos) {
      return this.innerStart <= pos.start && pos.end <= this.innerEnd;
    };

    WrappedPos.prototype.innerText = function() {
      return this.editor().textSubstr(this.innerStart, this.innerEnd);
    };

    WrappedPos.prototype.setInnerLen = function(len) {
      return this.moveSufix(this.innerStart + len);
    };

    WrappedPos.prototype.moveSuffix = function(pt) {
      var suffixLen;
      suffixLen = this.end - this.innerEnd;
      this.innerEnd = pt;
      return this.end = this.innerEnd + suffixLen;
    };

    WrappedPos.prototype.copy = function() {
      return new WrappedPos(this.start, this.innerStart, this.innerEnd, this.end);
    };

    return WrappedPos;

  })(Pos);

  Size = (function() {
    function Size(width1, height1) {
      this.width = width1;
      this.height = height1;
    }

    return Size;

  })();

  OptionObject = (function() {
    function OptionObject() {}

    OptionObject.prototype.setOpts = function(options, defaults) {
      var key, ref, results, val;
      this.defaults = defaults;
      ref = this.defaults;
      results = [];
      for (key in ref) {
        val = ref[key];
        if (key in options) {
          results.push(this.setOpt(key, options[key]));
        } else {
          results.push(this.setOpt(key, val));
        }
      }
      return results;
    };

    OptionObject.prototype.setOpt = function(key, val) {
      var ref;
      if (((ref = this[key]) != null ? ref.call : void 0) != null) {
        return this[key](val);
      } else {
        return this[key] = val;
      }
    };

    OptionObject.prototype.getOpt = function(key) {
      var ref;
      if (((ref = this[key]) != null ? ref.call : void 0) != null) {
        return this[key]();
      } else {
        return this[key];
      }
    };

    OptionObject.prototype.getOpts = function() {
      var key, opts, ref, val;
      opts = {};
      ref = this.defaults;
      for (key in ref) {
        val = ref[key];
        opts[key] = this.getOpt(key);
      }
      return opts;
    };

    return OptionObject;

  })();

  AddModule = function(self, module) {
    var key, ref, results, value;
    if (!module) {
      throw 'AddModule requires module';
    }
    ref = module.prototype;
    results = [];
    for (key in ref) {
      value = ref[key];
      results.push(self.prototype[key] = value);
    }
    return results;
  };

  Replacement = (function(superClass) {
    extend(Replacement, superClass);

    AddModule(Replacement, OptionObject);

    function Replacement(start1, end1, text1, options1) {
      this.start = start1;
      this.end = end1;
      this.text = text1;
      this.options = options1 != null ? options1 : {};
      this.setOpts(this.options);
    }

    Replacement.prototype.setOpts = function(options) {
      return OptionObject.prototype.setOpts.call(this, options, {
        prefix: '',
        suffix: '',
        selections: []
      });
    };

    Replacement.prototype.resPosBeforePrefix = function() {
      return this.start + this.prefix.length + this.text.length;
    };

    Replacement.prototype.resEnd = function() {
      return this.start + this.finalText().length;
    };

    Replacement.prototype.apply = function() {
      return this.editor().spliceText(this.start, this.end, this.finalText());
    };

    Replacement.prototype.necessary = function() {
      return this.finalText() !== this.originalText();
    };

    Replacement.prototype.originalText = function() {
      return this.editor().textSubstr(this.start, this.end);
    };

    Replacement.prototype.finalText = function() {
      return this.prefix + this.text + this.suffix;
    };

    Replacement.prototype.offsetAfter = function() {
      return this.finalText().length - (this.end - this.start);
    };

    Replacement.prototype.applyOffset = function(offset) {
      var len1, q, ref, sel;
      if (offset !== 0) {
        this.start += offset;
        this.end += offset;
        ref = this.selections;
        for (q = 0, len1 = ref.length; q < len1; q++) {
          sel = ref[q];
          sel.start += offset;
          sel.end += offset;
        }
      }
      return this;
    };

    Replacement.prototype.selectContent = function() {
      this.selections = [new Pos(this.prefix.length + this.start, this.prefix.length + this.start + this.text.length)];
      return this;
    };

    Replacement.prototype.carretToSel = function() {
      var pos, res, start, text;
      this.selections = [];
      text = this.finalText();
      this.prefix = Codewave.util.removeCarret(this.prefix);
      this.text = Codewave.util.removeCarret(this.text);
      this.suffix = Codewave.util.removeCarret(this.suffix);
      start = this.start;
      while ((res = Codewave.util.getAndRemoveFirstCarret(text)) != null) {
        pos = res[0], text = res[1];
        this.selections.push(new Pos(start + pos, start + pos));
      }
      return this;
    };

    Replacement.prototype.copy = function() {
      var res;
      res = new Replacement(this.start, this.end, this.text, this.getOpts());
      if (this.hasEditor()) {
        res.withEditor(this.editor());
      }
      res.selections = this.selections.map(function(s) {
        return s.copy();
      });
      return res;
    };

    return Replacement;

  })(Pos);

  Wrapping = (function(superClass) {
    extend(Wrapping, superClass);

    function Wrapping(start1, end1, prefix, suffix, options1) {
      this.start = start1;
      this.end = end1;
      if (prefix == null) {
        prefix = '';
      }
      if (suffix == null) {
        suffix = '';
      }
      this.options = options1 != null ? options1 : {};
      this.setOpts(this.options);
      this.text = '';
      this.prefix = prefix;
      this.suffix = suffix;
    }

    Wrapping.prototype.apply = function() {
      this.adjustSel();
      return Wrapping.__super__.apply.apply(this, arguments);
    };

    Wrapping.prototype.adjustSel = function() {
      var len1, offset, q, ref, results, sel;
      offset = this.originalText().length;
      ref = this.selections;
      results = [];
      for (q = 0, len1 = ref.length; q < len1; q++) {
        sel = ref[q];
        if (sel.start > this.start + this.prefix.length) {
          sel.start += offset;
        }
        if (sel.end >= this.start + this.prefix.length) {
          results.push(sel.end += offset);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Wrapping.prototype.finalText = function() {
      var text;
      if (this.hasEditor()) {
        text = this.originalText();
      } else {
        text = '';
      }
      return this.prefix + text + this.suffix;
    };

    Wrapping.prototype.offsetAfter = function() {
      return this.prefix.length + this.suffix.length;
    };

    Wrapping.prototype.copy = function() {
      var res;
      res = new Wrapping(this.start, this.end, this.prefix, this.suffix);
      res.selections = this.selections.map(function(s) {
        return s.copy();
      });
      return res;
    };

    return Wrapping;

  })(Replacement);

  PairMatch = (function() {
    function PairMatch(pair1, match1, offset1) {
      this.pair = pair1;
      this.match = match1;
      this.offset = offset1 != null ? offset1 : 0;
    }

    PairMatch.prototype.name = function() {
      var _name, group, i, len1, q, ref;
      if (this.match) {
        if (typeof _name === "undefined" || _name === null) {
          ref = this.match;
          for (i = q = 0, len1 = ref.length; q < len1; i = ++q) {
            group = ref[i];
            if (i > 0 && (group != null)) {
              _name = this.pair.matchAnyPartKeys()[i - 1];
              return _name;
            }
          }
          _name = false;
        }
        return _name || null;
      }
    };

    PairMatch.prototype.start = function() {
      return this.match.index + this.offset;
    };

    PairMatch.prototype.end = function() {
      return this.match.index + this.match[0].length + this.offset;
    };

    PairMatch.prototype.valid = function() {
      return !this.pair.validMatch || this.pair.validMatch(this);
    };

    PairMatch.prototype.length = function() {
      return this.match[0].length;
    };

    return PairMatch;

  })();

  Pair = (function() {
    function Pair(opener, closer, options1) {
      var defaults, key, val;
      this.opener = opener;
      this.closer = closer;
      this.options = options1 != null ? options1 : {};
      defaults = {
        optionnal_end: false,
        validMatch: null
      };
      for (key in defaults) {
        val = defaults[key];
        if (key in this.options) {
          this[key] = this.options[key];
        } else {
          this[key] = val;
        }
      }
    }

    Pair.prototype.openerReg = function() {
      if (typeof this.opener === 'string') {
        return new RegExp(Codewave.util.escapeRegExp(this.opener));
      } else {
        return this.opener;
      }
    };

    Pair.prototype.closerReg = function() {
      if (typeof this.closer === 'string') {
        return new RegExp(Codewave.util.escapeRegExp(this.closer));
      } else {
        return this.closer;
      }
    };

    Pair.prototype.matchAnyParts = function() {
      return {
        opener: this.openerReg(),
        closer: this.closerReg()
      };
    };

    Pair.prototype.matchAnyPartKeys = function() {
      var key, keys, ref, reg;
      keys = [];
      ref = this.matchAnyParts();
      for (key in ref) {
        reg = ref[key];
        keys.push(key);
      }
      return keys;
    };

    Pair.prototype.matchAnyReg = function() {
      var groups, key, ref, reg;
      groups = [];
      ref = this.matchAnyParts();
      for (key in ref) {
        reg = ref[key];
        groups.push('(' + reg.source + ')');
      }
      return new RegExp(groups.join('|'));
    };

    Pair.prototype.matchAny = function(text, offset) {
      var match;
      if (offset == null) {
        offset = 0;
      }
      while (((match = this._matchAny(text, offset)) != null) && !match.valid()) {
        offset = match.end();
      }
      if ((match != null) && match.valid()) {
        return match;
      }
    };

    Pair.prototype._matchAny = function(text, offset) {
      var match;
      if (offset == null) {
        offset = 0;
      }
      if (offset) {
        text = text.substr(offset);
      }
      match = this.matchAnyReg().exec(text);
      if (match != null) {
        return new PairMatch(this, match, offset);
      }
    };

    Pair.prototype.matchAnyNamed = function(text) {
      return this._matchAnyGetName(this.matchAny(text));
    };

    Pair.prototype.matchAnyLast = function(text, offset) {
      var match, res;
      if (offset == null) {
        offset = 0;
      }
      while (match = this.matchAny(text, offset)) {
        offset = match.end();
        if (!res || res.end() !== match.end()) {
          res = match;
        }
      }
      return res;
    };

    Pair.prototype.identical = function() {
      return this.opener === this.closer || ((this.opener.source != null) && (this.closer.source != null) && this.opener.source === this.closer.source);
    };

    Pair.prototype.wrapperPos = function(pos, text) {
      var end, start;
      start = this.matchAnyLast(text.substr(0, pos.start));
      if ((start != null) && (this.identical() || start.name() === 'opener')) {
        end = this.matchAny(text, pos.end);
        if ((end != null) && (this.identical() || end.name() === 'closer')) {
          return new Codewave.util.Pos(start.start(), end.end());
        } else if (this.optionnal_end) {
          return new Codewave.util.Pos(start.start(), text.length);
        }
      }
    };

    Pair.prototype.isWapperOf = function(pos, text) {
      return this.wrapperPos(pos, text) != null;
    };

    return Pair;

  })();

  this.Codewave.util = {
    splitFirstNamespace: function(fullname, isSpace) {
      var parts;
      if (isSpace == null) {
        isSpace = false;
      }
      if (fullname.indexOf(":") === -1 && !isSpace) {
        return [null, fullname];
      }
      parts = fullname.split(':');
      return [parts.shift(), parts.join(':') || null];
    },
    splitNamespace: function(fullname) {
      var name, parts;
      if (fullname.indexOf(":") === -1) {
        return [null, fullname];
      }
      parts = fullname.split(':');
      name = parts.pop();
      return [parts.join(':'), name];
    },
    trimEmptyLine: function(txt) {
      return txt.replace(/^\s*\r?\n/, '').replace(/\r?\n\s*$/, '');
    },
    escapeRegExp: function(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    repeatToLength: function(txt, length) {
      if (length <= 0) {
        return '';
      }
      return Array(Math.ceil(length / txt.length) + 1).join(txt).substring(0, length);
    },
    repeat: function(txt, nb) {
      return Array(nb + 1).join(txt);
    },
    getTxtSize: function(txt) {
      var l, len1, lines, q, w;
      lines = txt.replace(/\r/g, '').split("\n");
      w = 0;
      for (q = 0, len1 = lines.length; q < len1; q++) {
        l = lines[q];
        w = Math.max(w, l.length);
      }
      return new Size(w, lines.length - 1);
    },
    indentNotFirst: function(text, nb, spaces) {
      var reg;
      if (nb == null) {
        nb = 1;
      }
      if (spaces == null) {
        spaces = '  ';
      }
      if (text != null) {
        reg = /\n/g;
        return text.replace(reg, "\n" + Codewave.util.repeat(spaces, nb));
      } else {
        return text;
      }
    },
    indent: function(text, nb, spaces) {
      if (nb == null) {
        nb = 1;
      }
      if (spaces == null) {
        spaces = '  ';
      }
      if (text != null) {
        return spaces + Codewave.util.indentNotFirst(text, nb, spaces);
      } else {
        return text;
      }
    },
    reverseStr: function(txt) {
      return txt.split("").reverse().join("");
    },
    removeCarret: function(txt, carretChar) {
      var reCarret, reQuoted, reTmp, tmp;
      if (carretChar == null) {
        carretChar = '|';
      }
      tmp = '[[[[quoted_carret]]]]';
      reCarret = new RegExp(Codewave.util.escapeRegExp(carretChar), "g");
      reQuoted = new RegExp(Codewave.util.escapeRegExp(carretChar + carretChar), "g");
      reTmp = new RegExp(Codewave.util.escapeRegExp(tmp), "g");
      return txt.replace(reQuoted, tmp).replace(reCarret, '').replace(reTmp, carretChar);
    },
    getAndRemoveFirstCarret: function(txt, carretChar) {
      var pos;
      if (carretChar == null) {
        carretChar = '|';
      }
      pos = Codewave.util.getCarretPos(txt, carretChar);
      if (pos != null) {
        txt = txt.substr(0, pos) + txt.substr(pos + carretChar.length);
        return [pos, txt];
      }
    },
    getCarretPos: function(txt, carretChar) {
      var i, reQuoted;
      if (carretChar == null) {
        carretChar = '|';
      }
      reQuoted = new RegExp(Codewave.util.escapeRegExp(carretChar + carretChar), "g");
      txt = txt.replace(reQuoted, ' ');
      if ((i = txt.indexOf(carretChar)) > -1) {
        return i;
      }
    },
    isArray: function(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    },
    posCollection: function(arr) {
      if (!Codewave.util.isArray(arr)) {
        arr === [arr];
      }
      arr.wrap = function(prefix, suffix) {
        return this.map(function(p) {
          return new Wrapping(p.start, p.end, prefix, suffix);
        });
      };
      arr.replace = function(txt) {
        return this.map(function(p) {
          return new Replacement(p.start, p.end, txt);
        });
      };
      return arr;
    },
    StrPos: StrPos,
    Pos: Pos,
    WrappedPos: WrappedPos,
    Size: Size,
    Pair: Pair,
    Replacement: Replacement,
    Wrapping: Wrapping,
    union: function(a1, a2) {
      return Codewave.util.unique(a1.concat(a2));
    },
    unique: function(array) {
      var a, i, j;
      a = array.concat();
      i = 0;
      while (i < a.length) {
        j = i + 1;
        while (j < a.length) {
          if (a[i] === a[j]) {
            a.splice(j--, 1);
          }
          ++j;
        }
        ++i;
      }
      return a;
    },
    merge: function() {
      var xs;
      xs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if ((xs != null ? xs.length : void 0) > 0) {
        return Codewave.util.tap({}, function(m) {
          var k, len1, q, results, v, x;
          results = [];
          for (q = 0, len1 = xs.length; q < len1; q++) {
            x = xs[q];
            results.push((function() {
              var results1;
              results1 = [];
              for (k in x) {
                v = x[k];
                results1.push(m[k] = v);
              }
              return results1;
            })());
          }
          return results;
        });
      }
    },
    tap: function(o, fn) {
      fn(o);
      return o;
    }
  };

  this.Codewave.storage = new ((function() {
    function _Class() {}

    _Class.prototype.save = function(key, val) {
      return localStorage.setItem(this.fullKey(key), JSON.stringify(val));
    };

    _Class.prototype.load = function(key) {
      return JSON.parse(localStorage.getItem(this.fullKey(key)));
    };

    _Class.prototype.fullKey = function(key) {
      return 'CodeWave_' + key;
    };

    return _Class;

  })());

  this.Codewave.Editor = (function() {
    function Editor() {
      this.namespace = null;
      this._lang = null;
    }

    Editor.prototype.bindedTo = function(codewave) {};

    Editor.prototype.text = function(val) {
      throw "Not Implemented";
    };

    Editor.prototype.textCharAt = function(pos) {
      throw "Not Implemented";
    };

    Editor.prototype.textLen = function() {
      throw "Not Implemented";
    };

    Editor.prototype.textSubstr = function(start, end) {
      throw "Not Implemented";
    };

    Editor.prototype.insertTextAt = function(text, pos) {
      throw "Not Implemented";
    };

    Editor.prototype.spliceText = function(start, end, text) {
      throw "Not Implemented";
    };

    Editor.prototype.getCursorPos = function() {
      throw "Not Implemented";
    };

    Editor.prototype.setCursorPos = function(start, end) {
      if (end == null) {
        end = null;
      }
      throw "Not Implemented";
    };

    Editor.prototype.beginUndoAction = function() {};

    Editor.prototype.endUndoAction = function() {};

    Editor.prototype.getLang = function() {
      return this._lang;
    };

    Editor.prototype.setLang = function(val) {
      return this._lang = val;
    };

    Editor.prototype.getEmmetContextObject = function() {
      return null;
    };

    Editor.prototype.allowMultiSelection = function() {
      return false;
    };

    Editor.prototype.setMultiSel = function(selections) {
      throw "Not Implemented";
    };

    Editor.prototype.getMultiSel = function() {
      throw "Not Implemented";
    };

    Editor.prototype.canListenToChange = function() {
      return false;
    };

    Editor.prototype.addChangeListener = function(callback) {
      throw "Not Implemented";
    };

    Editor.prototype.removeChangeListener = function(callback) {
      throw "Not Implemented";
    };

    Editor.prototype.getLineAt = function(pos) {
      return new Codewave.util.Pos(this.findLineStart(pos), this.findLineEnd(pos));
    };

    Editor.prototype.findLineStart = function(pos) {
      var p;
      p = this.findAnyNext(pos, ["\n"], -1);
      if (p) {
        return p.pos + 1;
      } else {
        return 0;
      }
    };

    Editor.prototype.findLineEnd = function(pos) {
      var p;
      p = this.findAnyNext(pos, ["\n", "\r"]);
      if (p) {
        return p.pos;
      } else {
        return this.textLen();
      }
    };

    Editor.prototype.findAnyNext = function(start, strings, direction) {
      var bestPos, bestStr, len1, pos, q, stri, text;
      if (direction == null) {
        direction = 1;
      }
      if (direction > 0) {
        text = this.textSubstr(start, this.textLen());
      } else {
        text = this.textSubstr(0, start);
      }
      bestPos = null;
      for (q = 0, len1 = strings.length; q < len1; q++) {
        stri = strings[q];
        pos = direction > 0 ? text.indexOf(stri) : text.lastIndexOf(stri);
        if (pos !== -1) {
          if ((bestPos == null) || bestPos * direction > pos * direction) {
            bestPos = pos;
            bestStr = stri;
          }
        }
      }
      if (bestStr != null) {
        return new Codewave.util.StrPos((direction > 0 ? bestPos + start : bestPos), bestStr);
      }
      return null;
    };

    Editor.prototype.applyReplacements = function(replacements) {
      var len1, offset, q, repl, selections;
      selections = [];
      offset = 0;
      for (q = 0, len1 = replacements.length; q < len1; q++) {
        repl = replacements[q];
        repl.withEditor(this);
        repl.applyOffset(offset);
        repl.apply();
        offset += repl.offsetAfter(this);
        selections = selections.concat(repl.selections);
      }
      return this.applyReplacementsSelections(selections);
    };

    Editor.prototype.applyReplacementsSelections = function(selections) {
      if (selections.length > 0) {
        if (this.allowMultiSelection()) {
          return this.setMultiSel(selections);
        } else {
          return this.setCursorPos(selections[0].start, selections[0].end);
        }
      }
    };

    return Editor;

  })();

  this.Codewave.TextParser = (function(superClass) {
    extend(TextParser, superClass);

    function TextParser(_text) {
      this._text = _text;
      self.namespace = 'text_parser';
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
        start: start,
        end: end
      };
    };

    return TextParser;

  })(this.Codewave.Editor);

  this.Codewave.EditCmdProp = (function() {
    function EditCmdProp(name1, options) {
      var defaults, key, len1, q, ref, val;
      this.name = name1;
      defaults = {
        'var': null,
        'opt': null,
        'funct': null,
        'dataName': null,
        'showEmpty': false,
        'carret': false
      };
      ref = ['var', 'opt', 'funct'];
      for (q = 0, len1 = ref.length; q < len1; q++) {
        key = ref[q];
        if (key in options) {
          defaults['dataName'] = options[key];
        }
      }
      for (key in defaults) {
        val = defaults[key];
        if (key in options) {
          this[key] = options[key];
        } else {
          this[key] = val;
        }
      }
    }

    EditCmdProp.prototype.setCmd = function(cmds) {
      return cmds[this.name] = Codewave.Command.setVarCmd(this.name);
    };

    EditCmdProp.prototype.writeFor = function(parser, obj) {
      if (parser.vars[this.name] != null) {
        return obj[this.dataName] = parser.vars[this.name];
      }
    };

    EditCmdProp.prototype.valFromCmd = function(cmd) {
      if (cmd != null) {
        if (this.opt != null) {
          return cmd.getOption(this.opt);
        }
        if (this.funct != null) {
          return cmd[this.funct]();
        }
        if (this["var"] != null) {
          return cmd[this["var"]];
        }
      }
    };

    EditCmdProp.prototype.showForCmd = function(cmd) {
      var val;
      val = this.valFromCmd(cmd);
      return this.showEmpty || (val != null);
    };

    EditCmdProp.prototype.display = function(cmd) {
      if (this.showForCmd(cmd)) {
        return "~~" + this.name + "~~\n" + (this.valFromCmd(cmd) || "") + (this.carret ? "|" : "") + "\n~~/" + this.name + "~~";
      }
    };

    return EditCmdProp;

  })();

  this.Codewave.EditCmdProp.source = (function(superClass) {
    extend(source, superClass);

    function source() {
      return source.__super__.constructor.apply(this, arguments);
    }

    source.prototype.valFromCmd = function(cmd) {
      var res;
      res = source.__super__.valFromCmd.call(this, cmd);
      if (res != null) {
        res = res.replace(/\|/g, '||');
      }
      return res;
      return {
        setCmd: function(cmds) {
          return cmds[this.name] = Codewave.Command.setVarCmd(this.name, {
            'preventParseAll': true
          });
        },
        showForCmd: function(cmd) {
          var val;
          val = this.valFromCmd(cmd);
          return (this.showEmpty && !((cmd != null) && (cmd.aliasOf != null))) || (val != null);
        }
      };
    };

    return source;

  })(this.Codewave.EditCmdProp);

  this.Codewave.EditCmdProp.string = (function(superClass) {
    extend(string, superClass);

    function string() {
      return string.__super__.constructor.apply(this, arguments);
    }

    string.prototype.display = function(cmd) {
      if (this.valFromCmd(cmd) != null) {
        return "~~!" + this.name + " '" + (this.valFromCmd(cmd)) + (this.carret ? "|" : "") + "'~~";
      }
    };

    return string;

  })(this.Codewave.EditCmdProp);

  this.Codewave.EditCmdProp.revBool = (function(superClass) {
    extend(revBool, superClass);

    function revBool() {
      return revBool.__super__.constructor.apply(this, arguments);
    }

    revBool.prototype.setCmd = function(cmds) {
      return cmds[this.name] = Codewave.Command.setBoolVarCmd(this.name);
    };

    revBool.prototype.writeFor = function(parser, obj) {
      if (parser.vars[this.name] != null) {
        return obj[this.dataName] = !parser.vars[this.name];
      }
    };

    revBool.prototype.display = function(cmd) {
      var val;
      val = this.valFromCmd(cmd);
      if ((val != null) && !val) {
        return "~~!" + this.name + "~~";
      }
    };

    return revBool;

  })(this.Codewave.EditCmdProp);

  this.Codewave.EditCmdProp.bool = (function(superClass) {
    extend(bool, superClass);

    function bool() {
      return bool.__super__.constructor.apply(this, arguments);
    }

    bool.prototype.setCmd = function(cmds) {
      return cmds[this.name] = Codewave.Command.setBoolVarCmd(this.name);
    };

    bool.prototype.display = function(cmd) {
      if (this.valFromCmd(cmd)) {
        return "~~!" + this.name + "~~";
      }
    };

    return bool;

  })(this.Codewave.EditCmdProp);

  this.Codewave.DomKeyListener = (function() {
    function DomKeyListener() {}

    DomKeyListener.prototype.startListening = function(target) {
      var onkeydown, onkeypress, onkeyup, timeout;
      timeout = null;
      onkeydown = (function(_this) {
        return function(e) {
          if (e.keyCode === 69 && e.ctrlKey) {
            e.preventDefault();
            if (_this.onActivationKey != null) {
              return _this.onActivationKey();
            }
          }
        };
      })(this);
      onkeyup = (function(_this) {
        return function(e) {
          if (_this.onAnyChange != null) {
            return _this.onAnyChange(e);
          }
        };
      })(this);
      onkeypress = (function(_this) {
        return function(e) {
          if (timeout != null) {
            clearTimeout(timeout);
          }
          return timeout = setTimeout((function() {
            if (_this.onAnyChange != null) {
              return _this.onAnyChange(e);
            }
          }), 100);
        };
      })(this);
      if (target.addEventListener) {
        target.addEventListener("keydown", onkeydown);
        target.addEventListener("keyup", onkeyup);
        return target.addEventListener("keypress", onkeypress);
      } else if (target.attachEvent) {
        target.attachEvent("onkeydown", onkeydown);
        target.attachEvent("onkeyup", onkeyup);
        return target.attachEvent("onkeypress", onkeypress);
      }
    };

    return DomKeyListener;

  })();

  this.Codewave.TextAreaEditor = (function(superClass) {
    extend(TextAreaEditor, superClass);

    function TextAreaEditor(target1) {
      this.target = target1;
      this.obj = document.getElementById(this.target);
      if (this.obj == null) {
        throw "TextArea not found";
      }
      this.namespace = 'textarea';
      this.changeListeners = [];
      this._skipChangeEvent = 0;
    }

    TextAreaEditor.prototype.startListening = Codewave.DomKeyListener.prototype.startListening;

    TextAreaEditor.prototype.onAnyChange = function(e) {
      var callback, len1, q, ref, results;
      if (this._skipChangeEvent <= 0) {
        ref = this.changeListeners;
        results = [];
        for (q = 0, len1 = ref.length; q < len1; q++) {
          callback = ref[q];
          results.push(callback());
        }
        return results;
      } else {
        this._skipChangeEvent--;
        if (this.onSkipedChange != null) {
          return this.onSkipedChange();
        }
      }
    };

    TextAreaEditor.prototype.skipChangeEvent = function(nb) {
      if (nb == null) {
        nb = 1;
      }
      return this._skipChangeEvent += nb;
    };

    TextAreaEditor.prototype.bindedTo = function(codewave) {
      this.onActivationKey = function() {
        return codewave.onActivationKey();
      };
      return this.startListening(document);
    };

    TextAreaEditor.prototype.selectionPropExists = function() {
      return "selectionStart" in this.obj;
    };

    TextAreaEditor.prototype.hasFocus = function() {
      return document.activeElement === this.obj;
    };

    TextAreaEditor.prototype.text = function(val) {
      if (val != null) {
        if (!this.textEventChange(val)) {
          this.obj.value = val;
        }
      }
      return this.obj.value;
    };

    TextAreaEditor.prototype.spliceText = function(start, end, text) {
      return this.textEventChange(text, start, end) || TextAreaEditor.__super__.spliceText.call(this, start, end, text);
    };

    TextAreaEditor.prototype.textEventChange = function(text, start, end) {
      var event;
      if (start == null) {
        start = 0;
      }
      if (end == null) {
        end = null;
      }
      if (document.createEvent != null) {
        event = document.createEvent('TextEvent');
      }
      if ((event != null) && (event.initTextEvent != null)) {
        if (end == null) {
          end = this.textLen();
        }
        if (text.length < 1) {
          if (start !== 0) {
            text = this.textSubstr(start - 1, start);
            start--;
          } else if (end !== this.textLen()) {
            text = this.textSubstr(end, end + 1);
            end++;
          } else {
            return false;
          }
        }
        event.initTextEvent('textInput', true, true, null, text, 9);
        this.obj.selectionStart = start;
        this.obj.selectionEnd = end;
        this.obj.dispatchEvent(event);
        this.skipChangeEvent();
        return true;
      } else {
        return false;
      }
    };

    TextAreaEditor.prototype.getCursorPos = function() {
      if (this.tmpCursorPos != null) {
        return this.tmpCursorPos;
      }
      if (this.hasFocus) {
        if (this.selectionPropExists) {
          return new Codewave.util.Pos(this.obj.selectionStart, this.obj.selectionEnd);
        } else {
          return this.getCursorPosFallback();
        }
      }
    };

    TextAreaEditor.prototype.getCursorPosFallback = function() {
      var len, pos, rng, sel;
      if (this.obj.createTextRange) {
        sel = document.selection.createRange();
        if (sel.parentElement() === this.obj) {
          rng = this.obj.createTextRange();
          rng.moveToBookmark(sel.getBookmark());
          len = 0;
          while (rng.compareEndPoints("EndToStart", rng) > 0) {
            len++;
            rng.moveEnd("character", -1);
          }
          rng.setEndPoint("StartToStart", this.obj.createTextRange());
          pos = new Codewave.util.Pos(0, len);
          while (rng.compareEndPoints("EndToStart", rng) > 0) {
            pos.start++;
            pos.end++;
            rng.moveEnd("character", -1);
          }
          return pos;
        }
      }
    };

    TextAreaEditor.prototype.setCursorPos = function(start, end) {
      if (arguments.length < 2) {
        end = start;
      }
      if (this.selectionPropExists) {
        this.tmpCursorPos = new Codewave.util.Pos(start, end);
        this.obj.selectionStart = start;
        this.obj.selectionEnd = end;
        setTimeout(((function(_this) {
          return function() {
            _this.tmpCursorPos = null;
            _this.obj.selectionStart = start;
            return _this.obj.selectionEnd = end;
          };
        })(this)), 1);
      } else {
        this.setCursorPosFallback(start, end);
      }
    };

    TextAreaEditor.prototype.setCursorPosFallback = function(start, end) {
      var rng;
      if (this.obj.createTextRange) {
        rng = this.obj.createTextRange();
        rng.moveStart("character", start);
        rng.collapse();
        rng.moveEnd("character", end - start);
        return rng.select();
      }
    };

    TextAreaEditor.prototype.getLang = function() {
      if (this._lang) {
        return this._lang;
      }
      if (this.obj.hasAttribute('data-lang')) {
        return this.obj.getAttribute('data-lang');
      }
    };

    TextAreaEditor.prototype.setLang = function(val) {
      this._lang = val;
      return this.obj.setAttribute('data-lang', val);
    };

    TextAreaEditor.prototype.canListenToChange = function() {
      return true;
    };

    TextAreaEditor.prototype.addChangeListener = function(callback) {
      return this.changeListeners.push(callback);
    };

    TextAreaEditor.prototype.removeChangeListener = function(callback) {
      var i;
      if ((i = this.changeListeners.indexOf(callback)) > -1) {
        return this.changeListeners.splice(i, 1);
      }
    };

    TextAreaEditor.prototype.applyReplacements = function(replacements) {
      if (replacements.length > 0 && replacements[0].selections.length < 1) {
        replacements[0].selections = [this.getCursorPos()];
      }
      return TextAreaEditor.__super__.applyReplacements.call(this, replacements);
    };

    return TextAreaEditor;

  })(Codewave.TextParser);

  this.Codewave.util.BoxHelper = (function() {
    function BoxHelper(context1, options) {
      var key, ref, val;
      this.context = context1;
      if (options == null) {
        options = {};
      }
      this.defaults = {
        deco: this.context.codewave.deco,
        pad: 2,
        width: 50,
        height: 3,
        openText: '',
        closeText: '',
        prefix: '',
        suffix: '',
        indent: 0
      };
      ref = this.defaults;
      for (key in ref) {
        val = ref[key];
        if (key in options) {
          this[key] = options[key];
        } else {
          this[key] = val;
        }
      }
    }

    BoxHelper.prototype.clone = function(text) {
      var key, opt, ref, val;
      opt = {};
      ref = this.defaults;
      for (key in ref) {
        val = ref[key];
        opt[key] = this[key];
      }
      return new Codewave.util.BoxHelper(this.context, opt);
    };

    BoxHelper.prototype.draw = function(text) {
      return this.startSep() + "\n" + this.lines(text) + "\n" + this.endSep();
    };

    BoxHelper.prototype.wrapComment = function(str) {
      return this.context.wrapComment(str);
    };

    BoxHelper.prototype.separator = function() {
      var len;
      len = this.width + 2 * this.pad + 2 * this.deco.length;
      return this.wrapComment(this.decoLine(len));
    };

    BoxHelper.prototype.startSep = function() {
      var ln;
      ln = this.width + 2 * this.pad + 2 * this.deco.length - this.openText.length;
      return this.prefix + this.wrapComment(this.openText + this.decoLine(ln));
    };

    BoxHelper.prototype.endSep = function() {
      var ln;
      ln = this.width + 2 * this.pad + 2 * this.deco.length - this.closeText.length;
      return this.wrapComment(this.closeText + this.decoLine(ln)) + this.suffix;
    };

    BoxHelper.prototype.decoLine = function(len) {
      return Codewave.util.repeatToLength(this.deco, len);
    };

    BoxHelper.prototype.padding = function() {
      return Codewave.util.repeatToLength(" ", this.pad);
    };

    BoxHelper.prototype.lines = function(text, uptoHeight) {
      var l, lines, x;
      if (text == null) {
        text = '';
      }
      if (uptoHeight == null) {
        uptoHeight = true;
      }
      text = text || '';
      lines = text.replace(/\r/g, '').split("\n");
      if (uptoHeight) {
        return ((function() {
          var q, ref, results;
          results = [];
          for (x = q = 0, ref = this.height; 0 <= ref ? q <= ref : q >= ref; x = 0 <= ref ? ++q : --q) {
            results.push(this.line(lines[x] || ''));
          }
          return results;
        }).call(this)).join('\n');
      } else {
        return ((function() {
          var len1, q, results;
          results = [];
          for (q = 0, len1 = lines.length; q < len1; q++) {
            l = lines[q];
            results.push(this.line(l));
          }
          return results;
        }).call(this)).join('\n');
      }
    };

    BoxHelper.prototype.line = function(text) {
      if (text == null) {
        text = '';
      }
      return Codewave.util.repeatToLength(" ", this.indent) + this.wrapComment(this.deco + this.padding() + text + Codewave.util.repeatToLength(" ", this.width - this.removeIgnoredContent(text).length) + this.padding() + this.deco);
    };

    BoxHelper.prototype.left = function() {
      return this.context.wrapCommentLeft(this.deco + this.padding());
    };

    BoxHelper.prototype.right = function() {
      return this.context.wrapCommentRight(this.padding() + this.deco);
    };

    BoxHelper.prototype.removeIgnoredContent = function(text) {
      return this.context.codewave.removeMarkers(this.context.codewave.removeCarret(text));
    };

    BoxHelper.prototype.textBounds = function(text) {
      return Codewave.util.getTxtSize(this.removeIgnoredContent(text));
    };

    BoxHelper.prototype.getBoxForPos = function(pos) {
      var clone, curLeft, depth, endFind, left, pair, placeholder, res, startFind;
      depth = this.getNestedLvl(pos.start);
      if (depth > 0) {
        left = this.left();
        curLeft = Codewave.util.repeat(left, depth - 1);
        clone = this.clone();
        placeholder = "###PlaceHolder###";
        clone.width = placeholder.length;
        clone.openText = clone.closeText = this.deco + this.deco + placeholder + this.deco + this.deco;
        startFind = RegExp(Codewave.util.escapeRegExp(curLeft + clone.startSep()).replace(placeholder, '.*'));
        endFind = RegExp(Codewave.util.escapeRegExp(curLeft + clone.endSep()).replace(placeholder, '.*'));
        pair = new Codewave.util.Pair(startFind, endFind, {
          validMatch: (function(_this) {
            return function(match) {
              var f;
              f = _this.context.codewave.findAnyNext(match.start(), [left, "\n", "\r"], -1);
              return (f == null) || f.str !== left;
            };
          })(this)
        });
        res = pair.wrapperPos(pos, this.context.codewave.editor.text());
        if (res != null) {
          res.start += curLeft.length;
          return res;
        }
      }
    };

    BoxHelper.prototype.getNestedLvl = function(index) {
      var depth, f, left;
      depth = 0;
      left = this.left();
      while (((f = this.context.codewave.findAnyNext(index, [left, "\n", "\r"], -1)) != null) && f.str === left) {
        index = f.pos;
        depth++;
      }
      return depth;
    };

    BoxHelper.prototype.getOptFromLine = function(line, getPad) {
      var endPos, rEnd, rStart, resEnd, resStart, startPos;
      if (getPad == null) {
        getPad = true;
      }
      rStart = new RegExp("(\\s*)(" + Codewave.util.escapeRegExp(this.context.wrapCommentLeft(this.deco)) + ")(\\s*)");
      rEnd = new RegExp("(\\s*)(" + Codewave.util.escapeRegExp(this.context.wrapCommentRight(this.deco)) + ")(\n|$)");
      resStart = rStart.exec(line);
      resEnd = rEnd.exec(line);
      if ((resStart != null) && (resEnd != null)) {
        if (getPad) {
          this.pad = Math.min(resStart[3].length, resEnd[1].length);
        }
        this.indent = resStart[1].length;
        startPos = resStart.index + resStart[1].length + resStart[2].length + this.pad;
        endPos = resEnd.index + resEnd[1].length - this.pad;
        this.width = endPos - startPos;
      }
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
        ecl = Codewave.util.escapeRegExp(this.context.wrapCommentLeft());
        ecr = Codewave.util.escapeRegExp(this.context.wrapCommentRight());
        ed = Codewave.util.escapeRegExp(this.deco);
        flag = options['multiline'] ? 'gm' : '';
        re1 = new RegExp("^\\s*" + ecl + "(?:" + ed + ")*\\s{0," + this.pad + "}", flag);
        re2 = new RegExp("\\s*(?:" + ed + ")*" + ecr + "\\s*$", flag);
        return text.replace(re1, '').replace(re2, '');
      }
    };

    return BoxHelper;

  })();

  this.Codewave.ClosingPromp = (function() {
    function ClosingPromp(codewave1, selections) {
      this.codewave = codewave1;
      this.timeout = null;
      this._typed = null;
      this.started = false;
      this.nbChanges = 0;
      this.selections = Codewave.util.posCollection(selections);
    }

    ClosingPromp.prototype.begin = function() {
      this.started = true;
      this.addCarrets();
      if (this.codewave.editor.canListenToChange()) {
        this.proxyOnChange = (function(_this) {
          return function(ch) {
            if (ch == null) {
              ch = null;
            }
            return _this.onChange(ch);
          };
        })(this);
        this.codewave.editor.addChangeListener(this.proxyOnChange);
      }
      return this;
    };

    ClosingPromp.prototype.addCarrets = function() {
      this.replacements = this.selections.wrap(this.codewave.brakets + this.codewave.carretChar + this.codewave.brakets + "\n", "\n" + this.codewave.brakets + this.codewave.closeChar + this.codewave.carretChar + this.codewave.brakets).map(function(p) {
        return p.carretToSel();
      });
      return this.codewave.editor.applyReplacements(this.replacements);
    };

    ClosingPromp.prototype.invalidTyped = function() {
      return this._typed = null;
    };

    ClosingPromp.prototype.onChange = function(ch) {
      if (ch == null) {
        ch = null;
      }
      this.invalidTyped();
      if (this.skipEvent(ch)) {
        return;
      }
      this.nbChanges++;
      if (this.shouldStop()) {
        this.stop();
        return this.cleanClose();
      } else {
        return this.resume();
      }
    };

    ClosingPromp.prototype.skipEvent = function(ch) {
      return (ch != null) && ch.charCodeAt(0) !== 32;
    };

    ClosingPromp.prototype.resume = function() {};

    ClosingPromp.prototype.shouldStop = function() {
      return this.typed() === false || this.typed().indexOf(' ') !== -1;
    };

    ClosingPromp.prototype.cleanClose = function() {
      var end, len1, pos, q, repl, replacements, res, sel, selections, start;
      replacements = [];
      selections = this.getSelections();
      for (q = 0, len1 = selections.length; q < len1; q++) {
        sel = selections[q];
        if (pos = this.whithinOpenBounds(sel)) {
          start = sel;
        } else if ((end = this.whithinCloseBounds(sel)) && (start != null)) {
          res = end.withEditor(this.codewave.editor).innerText().split(' ')[0];
          repl = new Codewave.util.Replacement(end.innerStart, end.innerEnd, res);
          repl.selections = [start];
          replacements.push(repl);
          start = null;
        }
      }
      return this.codewave.editor.applyReplacements(replacements);
    };

    ClosingPromp.prototype.getSelections = function() {
      return this.codewave.editor.getMultiSel();
    };

    ClosingPromp.prototype.stop = function() {
      this.started = false;
      if (this.timeout != null) {
        clearTimeout(this.timeout);
      }
      if (this.codewave.closingPromp === this) {
        this.codewave.closingPromp = null;
      }
      if (this.proxyOnChange != null) {
        return this.codewave.editor.removeChangeListener(this.proxyOnChange);
      }
    };

    ClosingPromp.prototype.cancel = function() {
      if (this.typed() !== false) {
        this.cancelSelections(this.getSelections());
      }
      return this.stop();
    };

    ClosingPromp.prototype.cancelSelections = function(selections) {
      var end, len1, pos, q, replacements, sel, start;
      replacements = [];
      start = null;
      for (q = 0, len1 = selections.length; q < len1; q++) {
        sel = selections[q];
        if (pos = this.whithinOpenBounds(sel)) {
          start = pos;
        } else if ((end = this.whithinCloseBounds(sel)) && (start != null)) {
          replacements.push(new Codewave.util.Replacement(start.start, end.end, this.codewave.editor.textSubstr(start.end + 1, end.start - 1)).selectContent());
          start = null;
        }
      }
      return this.codewave.editor.applyReplacements(replacements);
    };

    ClosingPromp.prototype.typed = function() {
      var cpos, innerEnd, innerStart;
      if (this._typed == null) {
        cpos = this.codewave.editor.getCursorPos();
        innerStart = this.replacements[0].start + this.codewave.brakets.length;
        if (this.codewave.findPrevBraket(cpos.start) === this.replacements[0].start && ((innerEnd = this.codewave.findNextBraket(innerStart)) != null) && innerEnd >= cpos.end) {
          this._typed = this.codewave.editor.textSubstr(innerStart, innerEnd);
        } else {
          this._typed = false;
        }
      }
      return this._typed;
    };

    ClosingPromp.prototype.whithinOpenBounds = function(pos) {
      var i, len1, q, ref, repl, targetPos, targetText;
      ref = this.replacements;
      for (i = q = 0, len1 = ref.length; q < len1; i = ++q) {
        repl = ref[i];
        targetPos = this.startPosAt(i);
        targetText = this.codewave.brakets + this.typed() + this.codewave.brakets;
        if (targetPos.innerContainsPos(pos) && targetPos.withEditor(this.codewave.editor).text() === targetText) {
          return targetPos;
        }
      }
      return false;
    };

    ClosingPromp.prototype.whithinCloseBounds = function(pos) {
      var i, len1, q, ref, repl, targetPos, targetText;
      ref = this.replacements;
      for (i = q = 0, len1 = ref.length; q < len1; i = ++q) {
        repl = ref[i];
        targetPos = this.endPosAt(i);
        targetText = this.codewave.brakets + this.codewave.closeChar + this.typed() + this.codewave.brakets;
        if (targetPos.innerContainsPos(pos) && targetPos.withEditor(this.codewave.editor).text() === targetText) {
          return targetPos;
        }
      }
      return false;
    };

    ClosingPromp.prototype.startPosAt = function(index) {
      return new Codewave.util.Pos(this.replacements[index].selections[0].start + this.typed().length * (index * 2), this.replacements[index].selections[0].end + this.typed().length * (index * 2 + 1)).wrappedBy(this.codewave.brakets, this.codewave.brakets);
    };

    ClosingPromp.prototype.endPosAt = function(index) {
      return new Codewave.util.Pos(this.replacements[index].selections[1].start + this.typed().length * (index * 2 + 1), this.replacements[index].selections[1].end + this.typed().length * (index * 2 + 2)).wrappedBy(this.codewave.brakets + this.codewave.closeChar, this.codewave.brakets);
    };

    return ClosingPromp;

  })();

  this.Codewave.SimulatedClosingPromp = (function(superClass) {
    extend(SimulatedClosingPromp, superClass);

    function SimulatedClosingPromp() {
      return SimulatedClosingPromp.__super__.constructor.apply(this, arguments);
    }

    SimulatedClosingPromp.prototype.resume = function() {
      return this.simulateType();
    };

    SimulatedClosingPromp.prototype.simulateType = function() {
      if (this.timeout != null) {
        clearTimeout(this.timeout);
      }
      return this.timeout = setTimeout(((function(_this) {
        return function() {
          var curClose, repl, targetText;
          _this.invalidTyped();
          targetText = _this.codewave.brakets + _this.codewave.closeChar + _this.typed() + _this.codewave.brakets;
          curClose = _this.whithinCloseBounds(_this.replacements[0].selections[1].copy().applyOffset(_this.typed().length));
          if (curClose) {
            repl = new Codewave.util.Replacement(curClose.start, curClose.end, targetText);
            if (repl.withEditor(_this.codewave.editor).necessary()) {
              _this.codewave.editor.applyReplacements([repl]);
            }
          } else {
            _this.stop();
          }
          if (_this.onTypeSimulated != null) {
            return _this.onTypeSimulated();
          }
        };
      })(this)), 2);
    };

    SimulatedClosingPromp.prototype.skipEvent = function() {
      return false;
    };

    SimulatedClosingPromp.prototype.getSelections = function() {
      return [this.codewave.editor.getCursorPos(), this.replacements[0].selections[1] + this.typed().length];
    };

    SimulatedClosingPromp.prototype.whithinCloseBounds = function(pos) {
      var i, len1, next, q, ref, repl, targetPos;
      ref = this.replacements;
      for (i = q = 0, len1 = ref.length; q < len1; i = ++q) {
        repl = ref[i];
        targetPos = this.endPosAt(i);
        next = this.codewave.findNextBraket(targetPos.innerStart);
        if (next != null) {
          targetPos.moveSuffix(next);
          if (targetPos.innerContainsPos(pos)) {
            return targetPos;
          }
        }
      }
      return false;
    };

    return SimulatedClosingPromp;

  })(Codewave.ClosingPromp);

  this.Codewave.ClosingPromp.newFor = function(codewave, selections) {
    if (codewave.editor.allowMultiSelection()) {
      return new Codewave.ClosingPromp(codewave, selections);
    } else {
      return new Codewave.SimulatedClosingPromp(codewave, selections);
    }
  };

  this.Codewave.CmdFinder = (function() {
    function CmdFinder(names, options) {
      var defaults, key, val;
      if (typeof names === 'string') {
        names = [names];
      }
      defaults = {
        parent: null,
        namespaces: [],
        parentContext: null,
        context: null,
        root: Codewave.Command.cmds,
        mustExecute: true,
        useDetectors: true,
        useFallbacks: true,
        instance: null,
        codewave: null
      };
      this.names = names;
      this.parent = options['parent'];
      for (key in defaults) {
        val = defaults[key];
        if (key in options) {
          this[key] = options[key];
        } else if ((this.parent != null) && key !== 'parent') {
          this[key] = this.parent[key];
        } else {
          this[key] = val;
        }
      }
      if (this.context == null) {
        this.context = new Codewave.Context(this.codewave);
      }
      if (this.parentContext != null) {
        this.context.parent = this.parentContext;
      }
      if (this.namespaces != null) {
        this.context.addNamespaces(this.namespaces);
      }
    }

    CmdFinder.prototype.find = function() {
      this.triggerDetectors();
      this.cmd = this.findIn(this.root);
      return this.cmd;
    };

    CmdFinder.prototype.getNamesWithPaths = function() {
      var len1, name, paths, q, ref, ref1, rest, space;
      paths = {};
      ref = this.names;
      for (q = 0, len1 = ref.length; q < len1; q++) {
        name = ref[q];
        ref1 = Codewave.util.splitFirstNamespace(name), space = ref1[0], rest = ref1[1];
        if ((space != null) && !(indexOf.call(this.context.getNameSpaces(), space) >= 0)) {
          if (!(space in paths)) {
            paths[space] = [];
          }
          paths[space].push(rest);
        }
      }
      return paths;
    };

    CmdFinder.prototype.applySpaceOnNames = function(namespace) {
      var ref, rest, space;
      ref = Codewave.util.splitFirstNamespace(namespace, true), space = ref[0], rest = ref[1];
      return this.names.map(function(name) {
        var cur_rest, cur_space, ref1;
        ref1 = Codewave.util.splitFirstNamespace(name), cur_space = ref1[0], cur_rest = ref1[1];
        if ((cur_space != null) && cur_space === space) {
          name = cur_rest;
        }
        if (rest != null) {
          name = rest + ':' + name;
        }
        return name;
      });
    };

    CmdFinder.prototype.getDirectNames = function() {
      var n;
      return (function() {
        var len1, q, ref, results;
        ref = this.names;
        results = [];
        for (q = 0, len1 = ref.length; q < len1; q++) {
          n = ref[q];
          if (n.indexOf(":") === -1) {
            results.push(n);
          }
        }
        return results;
      }).call(this);
    };

    CmdFinder.prototype.triggerDetectors = function() {
      var cmd, detector, i, len1, posibilities, q, ref, res, results;
      if (this.useDetectors) {
        this.useDetectors = false;
        posibilities = new Codewave.CmdFinder(this.context.getNameSpaces(), {
          parent: this,
          mustExecute: false,
          useFallbacks: false
        }).findPosibilities();
        i = 0;
        results = [];
        while (i < posibilities.length) {
          cmd = posibilities[i];
          ref = cmd.detectors;
          for (q = 0, len1 = ref.length; q < len1; q++) {
            detector = ref[q];
            res = detector.detect(this);
            if (res != null) {
              this.context.addNamespaces(res);
              posibilities = posibilities.concat(new Codewave.CmdFinder(res, {
                parent: this,
                mustExecute: false,
                useFallbacks: false
              }).findPosibilities());
            }
          }
          results.push(i++);
        }
        return results;
      }
    };

    CmdFinder.prototype.findIn = function(cmd, path) {
      var best;
      if (path == null) {
        path = null;
      }
      if (cmd == null) {
        return null;
      }
      best = this.bestInPosibilities(this.findPosibilities());
      if (best != null) {
        return best;
      }
    };

    CmdFinder.prototype.findPosibilities = function() {
      var direct, fallback, len1, len2, len3, len4, name, names, next, nexts, nspc, nspcName, posibilities, q, ref, ref1, ref2, ref3, rest, space, t, u, y;
      if (this.root == null) {
        return [];
      }
      this.root.init();
      posibilities = [];
      ref = this.getNamesWithPaths();
      for (space in ref) {
        names = ref[space];
        nexts = this.getCmdFollowAlias(space);
        for (q = 0, len1 = nexts.length; q < len1; q++) {
          next = nexts[q];
          posibilities = posibilities.concat(new Codewave.CmdFinder(names, {
            parent: this,
            root: next
          }).findPosibilities());
        }
      }
      ref1 = this.context.getNameSpaces();
      for (t = 0, len2 = ref1.length; t < len2; t++) {
        nspc = ref1[t];
        ref2 = Codewave.util.splitFirstNamespace(nspc, true), nspcName = ref2[0], rest = ref2[1];
        nexts = this.getCmdFollowAlias(nspcName);
        for (u = 0, len3 = nexts.length; u < len3; u++) {
          next = nexts[u];
          posibilities = posibilities.concat(new Codewave.CmdFinder(this.applySpaceOnNames(nspc), {
            parent: this,
            root: next
          }).findPosibilities());
        }
      }
      ref3 = this.getDirectNames();
      for (y = 0, len4 = ref3.length; y < len4; y++) {
        name = ref3[y];
        direct = this.root.getCmd(name);
        if (this.cmdIsValid(direct)) {
          posibilities.push(direct);
        }
      }
      if (this.useFallbacks) {
        fallback = this.root.getCmd('fallback');
        if (this.cmdIsValid(fallback)) {
          posibilities.push(fallback);
        }
      }
      this.posibilities = posibilities;
      return posibilities;
    };

    CmdFinder.prototype.getCmdFollowAlias = function(name) {
      var cmd;
      cmd = this.root.getCmd(name);
      if (cmd != null) {
        cmd.init();
        if (cmd.aliasOf != null) {
          return [cmd, cmd.getAliased()];
        }
        return [cmd];
      }
      return [cmd];
    };

    CmdFinder.prototype.cmdIsValid = function(cmd) {
      if (cmd == null) {
        return false;
      }
      if (cmd.name !== 'fallback' && indexOf.call(this.ancestors(), cmd) >= 0) {
        return false;
      }
      return !this.mustExecute || this.cmdIsExecutable(cmd);
    };

    CmdFinder.prototype.ancestors = function() {
      var ref;
      if (((ref = this.codewave) != null ? ref.inInstance : void 0) != null) {
        return this.codewave.inInstance.ancestorCmdsAndSelf();
      }
      return [];
    };

    CmdFinder.prototype.cmdIsExecutable = function(cmd) {
      var names;
      names = this.getDirectNames();
      if (names.length === 1) {
        return cmd.init().isExecutableWithName(names[0]);
      } else {
        return cmd.init().isExecutable();
      }
    };

    CmdFinder.prototype.cmdScore = function(cmd) {
      var score;
      score = cmd.depth;
      if (cmd.name === 'fallback') {
        score -= 1000;
      }
      return score;
    };

    CmdFinder.prototype.bestInPosibilities = function(poss) {
      var best, bestScore, len1, p, q, score;
      if (poss.length > 0) {
        best = null;
        bestScore = null;
        for (q = 0, len1 = poss.length; q < len1; q++) {
          p = poss[q];
          score = this.cmdScore(p);
          if ((best == null) || score >= bestScore) {
            bestScore = score;
            best = p;
          }
        }
        return best;
      }
    };

    return CmdFinder;

  })();

  this.Codewave.CmdInstance = (function() {
    function CmdInstance(cmd1, context1) {
      this.cmd = cmd1;
      this.context = context1 != null ? context1 : None;
    }

    CmdInstance.prototype.init = function() {
      if (!(this.isEmpty() || this.inited)) {
        this.inited = true;
        this._getCmdObj();
        this._initParams();
        if (this.cmdObj != null) {
          this.cmdObj.init();
        }
      }
      return this;
    };

    CmdInstance.prototype.setParam = function(name, val) {
      return this.named[name] = val;
    };

    CmdInstance.prototype.pushParam = function(val) {
      return this.params.push(val);
    };

    CmdInstance.prototype.getContext = function() {
      if (this.context == null) {
        this.context = new Codewave.Context();
      }
      return this.context || new Codewave.Context();
    };

    CmdInstance.prototype.getFinder = function(cmdName) {
      var finder;
      finder = this.getContext().getFinder(cmdName, this._getParentNamespaces());
      finder.instance = this;
      return finder;
    };

    CmdInstance.prototype._getCmdObj = function() {
      var cmd;
      if (this.cmd != null) {
        this.cmd.init();
        cmd = this.getAliased() || this.cmd;
        cmd.init();
        if (cmd.cls != null) {
          this.cmdObj = new cmd.cls(this);
          return this.cmdObj;
        }
      }
    };

    CmdInstance.prototype._initParams = function() {
      return this.named = this.getDefaults();
    };

    CmdInstance.prototype._getParentNamespaces = function() {
      return [];
    };

    CmdInstance.prototype.isEmpty = function() {
      return this.cmd != null;
    };

    CmdInstance.prototype.resultIsAvailable = function() {
      var aliased;
      if (this.cmd != null) {
        if (this.cmdObj != null) {
          return this.cmdObj.resultIsAvailable();
        }
        aliased = this.getAliasedFinal();
        if (aliased != null) {
          return aliased.resultIsAvailable();
        }
        return this.cmd.resultIsAvailable();
      }
      return false;
    };

    CmdInstance.prototype.getDefaults = function() {
      var aliased, res;
      if (this.cmd != null) {
        res = {};
        aliased = this.getAliased();
        if (aliased != null) {
          res = Codewave.util.merge(res, aliased.getDefaults());
        }
        res = Codewave.util.merge(res, this.cmd.defaults);
        if (this.cmdObj != null) {
          res = Codewave.util.merge(res, this.cmdObj.getDefaults());
        }
        return res;
      }
    };

    CmdInstance.prototype.getAliased = function() {
      if (this.cmd != null) {
        if (this.aliasedCmd == null) {
          this.getAliasedFinal();
        }
        return this.aliasedCmd || null;
      }
    };

    CmdInstance.prototype.getAliasedFinal = function() {
      var aliased;
      if (this.cmd != null) {
        if (this.aliasedFinalCmd != null) {
          return this.aliasedFinalCmd || null;
        }
        if (this.cmd.aliasOf != null) {
          aliased = this.cmd;
          while ((aliased != null) && (aliased.aliasOf != null)) {
            aliased = aliased._aliasedFromFinder(this.getFinder(this.alterAliasOf(aliased.aliasOf)));
            if (this.aliasedCmd == null) {
              this.aliasedCmd = aliased || false;
            }
          }
          this.aliasedFinalCmd = aliased || false;
          return aliased;
        }
      }
    };

    CmdInstance.prototype.alterAliasOf = function(aliasOf) {
      return aliasOf;
    };

    CmdInstance.prototype.getOptions = function() {
      var opt;
      if (this.cmd != null) {
        if (this.cmdOptions != null) {
          return this.cmdOptions;
        }
        opt = this.cmd._optionsForAliased(this.getAliased());
        if (this.cmdObj != null) {
          opt = Codewave.util.merge(opt, this.cmdObj.getOptions());
        }
        this.cmdOptions = opt;
        return opt;
      }
    };

    CmdInstance.prototype.getOption = function(key) {
      var options;
      options = this.getOptions();
      if ((options != null) && key in options) {
        return options[key];
      }
    };

    CmdInstance.prototype.getParam = function(names, defVal) {
      var len1, n, q, ref;
      if (defVal == null) {
        defVal = null;
      }
      if (((ref = typeof names) === 'string' || ref === 'number')) {
        names = [names];
      }
      for (q = 0, len1 = names.length; q < len1; q++) {
        n = names[q];
        if (this.named[n] != null) {
          return this.named[n];
        }
        if (this.params[n] != null) {
          return this.params[n];
        }
      }
      return defVal;
    };

    CmdInstance.prototype.ancestorCmds = function() {
      var ref;
      if (((ref = this.context.codewave) != null ? ref.inInstance : void 0) != null) {
        return this.context.codewave.inInstance.ancestorCmdsAndSelf();
      }
      return [];
    };

    CmdInstance.prototype.ancestorCmdsAndSelf = function() {
      return this.ancestorCmds().concat([this.cmd]);
    };

    CmdInstance.prototype.runExecuteFunct = function() {
      var cmd;
      if (this.cmd != null) {
        if (this.cmdObj != null) {
          return this.cmdObj.execute();
        }
        cmd = this.getAliasedFinal() || this.cmd;
        cmd.init();
        if (cmd.executeFunct != null) {
          return cmd.executeFunct(this);
        }
      }
    };

    CmdInstance.prototype.rawResult = function() {
      var cmd;
      if (this.cmd != null) {
        if (this.cmdObj != null) {
          return this.cmdObj.result();
        }
        cmd = this.getAliasedFinal() || this.cmd;
        cmd.init();
        if (cmd.resultFunct != null) {
          return cmd.resultFunct(this);
        }
        if (cmd.resultStr != null) {
          return cmd.resultStr;
        }
      }
    };

    CmdInstance.prototype.result = function() {
      var alterFunct, parser, res;
      this.init();
      if (this.resultIsAvailable()) {
        if ((res = this.rawResult()) != null) {
          res = this.formatIndent(res);
          if (res.length > 0 && this.getOption('parse', this)) {
            parser = this.getParserForText(res);
            res = parser.parseAll();
          }
          if (alterFunct = this.getOption('alterResult', this)) {
            res = alterFunct(res, this);
          }
          return res;
        }
      }
    };

    CmdInstance.prototype.getParserForText = function(txt) {
      var parser;
      if (txt == null) {
        txt = '';
      }
      parser = new Codewave(new Codewave.TextParser(txt), {
        inInstance: this
      });
      parser.checkCarret = false;
      return parser;
    };

    CmdInstance.prototype.getIndent = function() {
      return 0;
    };

    CmdInstance.prototype.formatIndent = function(text) {
      if (text != null) {
        return text.replace(/\t/g, '  ');
      } else {
        return text;
      }
    };

    CmdInstance.prototype.applyIndent = function(text) {
      return Codewave.util.indentNotFirst(text, this.getIndent(), " ");
    };

    return CmdInstance;

  })();

  _optKey = function(key, dict, defVal) {
    if (defVal == null) {
      defVal = null;
    }
    if (key in dict) {
      return dict[key];
    } else {
      return defVal;
    }
  };

  this.Codewave.Command = (function() {
    function Command(name1, data1, parent1) {
      var ref;
      this.name = name1;
      this.data = data1 != null ? data1 : null;
      this.parent = parent1 != null ? parent1 : null;
      this.cmds = [];
      this.detectors = [];
      this.executeFunct = this.resultFunct = this.resultStr = this.aliasOf = this.cls = null;
      this.aliased = null;
      this.fullName = this.name;
      this.depth = 0;
      ref = [null, false], this._parent = ref[0], this._inited = ref[1];
      this.setParent(parent);
      this.defaults = {};
      this.defaultOptions = {
        nameToParam: null,
        checkCarret: true,
        parse: false,
        beforeExecute: null,
        alterResult: null,
        preventParseAll: false,
        replaceBox: false
      };
      this.options = {};
      this.finalOptions = null;
    }

    Command.prototype.parent = function() {
      return this._parent;
    };

    Command.prototype.setParent = function(value) {
      if (this._parent !== value) {
        this._parent = value;
        this.fullName = ((this._parent != null) && (this._parent.name != null) ? this._parent.fullName + ':' + this.name : this.name);
        return this.depth = ((this._parent != null) && (this._parent.depth != null) ? this._parent.depth + 1 : 0);
      }
    };

    Command.prototype.init = function() {
      if (!this._inited) {
        this._inited = true;
        this.parseData(this.data);
      }
      return this;
    };

    Command.prototype.unregister = function() {
      return this._parent.removeCmd(this);
    };

    Command.prototype.isEditable = function() {
      return (this.resultStr != null) || (this.aliasOf != null);
    };

    Command.prototype.isExecutable = function() {
      var aliased, len1, p, q, ref;
      aliased = this.getAliased();
      if (aliased != null) {
        return aliased.init().isExecutable();
      }
      ref = ['resultStr', 'resultFunct', 'cls', 'executeFunct'];
      for (q = 0, len1 = ref.length; q < len1; q++) {
        p = ref[q];
        if (this[p] != null) {
          return true;
        }
      }
      return false;
    };

    Command.prototype.isExecutableWithName = function(name) {
      var aliasOf, aliased, context;
      if (this.aliasOf != null) {
        context = new Codewave.Context();
        aliasOf = this.aliasOf.replace('%name%', name);
        aliased = this._aliasedFromFinder(context.getFinder(aliasOf));
        if (aliased != null) {
          return aliased.init().isExecutable();
        }
        return false;
      }
      return this.isExecutable();
    };

    Command.prototype.resultIsAvailable = function() {
      var aliased, len1, p, q, ref;
      aliased = this.getAliased();
      if (aliased != null) {
        return aliased.resultIsAvailable();
      }
      ref = ['resultStr', 'resultFunct'];
      for (q = 0, len1 = ref.length; q < len1; q++) {
        p = ref[q];
        if (this[p] != null) {
          return true;
        }
      }
      return false;
    };

    Command.prototype.getDefaults = function() {
      var aliased, res;
      res = {};
      aliased = this.getAliased();
      if (aliased != null) {
        res = Codewave.util.merge(res, aliased.getDefaults());
      }
      res = Codewave.util.merge(res, this.defaults);
      return res;
    };

    Command.prototype._aliasedFromFinder = function(finder) {
      finder.useFallbacks = false;
      finder.mustExecute = false;
      finder.useDetectors = false;
      return finder.find();
    };

    Command.prototype.getAliased = function() {
      var context;
      if (this.aliasOf != null) {
        context = new Codewave.Context();
        return this._aliasedFromFinder(context.getFinder(this.aliasOf));
      }
    };

    Command.prototype.setOptions = function(data) {
      var key, results, val;
      results = [];
      for (key in data) {
        val = data[key];
        if (key in this.defaultOptions) {
          results.push(this.options[key] = val);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Command.prototype._optionsForAliased = function(aliased) {
      var opt;
      opt = {};
      opt = Codewave.util.merge(opt, this.defaultOptions);
      if (aliased != null) {
        opt = Codewave.util.merge(opt, aliased.getOptions());
      }
      return Codewave.util.merge(opt, this.options);
    };

    Command.prototype.getOptions = function() {
      return this._optionsForAliased(this.getAliased());
    };

    Command.prototype.getOption = function(key) {
      var options;
      options = this.getOptions();
      if (key in options) {
        return options[key];
      }
    };

    Command.prototype.help = function() {
      var cmd;
      cmd = this.getCmd('help');
      if (cmd != null) {
        return cmd.init().resultStr;
      }
    };

    Command.prototype.parseData = function(data) {
      this.data = data;
      if (typeof data === 'string') {
        this.resultStr = data;
        this.options['parse'] = true;
        return true;
      } else if (data != null) {
        return this.parseDictData(data);
      }
      return false;
    };

    Command.prototype.parseDictData = function(data) {
      var execute, res;
      res = _optKey('result', data);
      if (typeof res === "function") {
        this.resultFunct = res;
      } else if (res != null) {
        this.resultStr = res;
        this.options['parse'] = true;
      }
      execute = _optKey('execute', data);
      if (typeof execute === "function") {
        this.executeFunct = execute;
      }
      this.aliasOf = _optKey('aliasOf', data);
      this.cls = _optKey('cls', data);
      this.defaults = _optKey('defaults', data, this.defaults);
      this.setOptions(data);
      if ('help' in data) {
        this.addCmd(new Command('help', data['help'], this));
      }
      if ('fallback' in data) {
        this.addCmd(new Command('fallback', data['fallback'], this));
      }
      if ('cmds' in data) {
        this.addCmds(data['cmds']);
      }
      return true;
    };

    Command.prototype.addCmds = function(cmds) {
      var data, name, results;
      results = [];
      for (name in cmds) {
        data = cmds[name];
        results.push(this.addCmd(new Command(name, data, this)));
      }
      return results;
    };

    Command.prototype.addCmd = function(cmd) {
      var exists;
      exists = this.getCmd(cmd.name);
      if (exists != null) {
        this.removeCmd(exists);
      }
      cmd.setParent(this);
      this.cmds.push(cmd);
      return cmd;
    };

    Command.prototype.removeCmd = function(cmd) {
      var i;
      if ((i = this.cmds.indexOf(cmd)) > -1) {
        this.cmds.splice(i, 1);
      }
      return cmd;
    };

    Command.prototype.getCmd = function(fullname) {
      var cmd, len1, name, q, ref, ref1, space;
      this.init();
      ref = Codewave.util.splitFirstNamespace(fullname), space = ref[0], name = ref[1];
      if (space != null) {
        return this.getCmd(space).getCmd(name);
      }
      ref1 = this.cmds;
      for (q = 0, len1 = ref1.length; q < len1; q++) {
        cmd = ref1[q];
        if (cmd.name === name) {
          return cmd;
        }
      }
    };

    Command.prototype.setCmdData = function(fullname, data) {
      return this.setCmd(fullname, new Codewave.Command(fullname.split(':').pop(), data));
    };

    Command.prototype.setCmd = function(fullname, cmd) {
      var name, next, ref, space;
      ref = Codewave.util.splitFirstNamespace(fullname), space = ref[0], name = ref[1];
      if (space != null) {
        next = this.getCmd(space);
        if (next == null) {
          next = this.addCmd(new Command(space));
        }
        return next.setCmd(name, cmd);
      } else {
        this.addCmd(cmd);
        return cmd;
      }
    };

    Command.prototype.addDetector = function(detector) {
      return this.detectors.push(detector);
    };

    return Command;

  })();

  this.Codewave.Command.cmdInitialisers = [];

  this.Codewave.Command.initCmds = function() {
    var initialiser, len1, q, ref, results;
    Codewave.Command.cmds = new Codewave.Command(null, {
      'cmds': {
        'hello': {
          help: "\"Hello, world!\" is typically one of the simplest programs possible in\nmost programming languages, it is by tradition often (...) used to\nverify that a language or system is operating correctly -wikipedia",
          result: 'Hello, World!'
        }
      }
    });
    ref = Codewave.Command.cmdInitialisers;
    results = [];
    for (q = 0, len1 = ref.length; q < len1; q++) {
      initialiser = ref[q];
      results.push(initialiser());
    }
    return results;
  };

  this.Codewave.Command.saveCmd = function(fullname, data) {
    var savedCmds;
    Codewave.Command.cmds.setCmdData(fullname, data);
    savedCmds = Codewave.storage.load('cmds');
    if (savedCmds == null) {
      savedCmds = {};
    }
    savedCmds[fullname] = data;
    return Codewave.storage.save('cmds', savedCmds);
  };

  this.Codewave.Command.loadCmds = function() {
    var data, fullname, results, savedCmds;
    savedCmds = Codewave.storage.load('cmds');
    if (savedCmds != null) {
      results = [];
      for (fullname in savedCmds) {
        data = savedCmds[fullname];
        results.push(Codewave.Command.cmds.setCmdData(fullname, data));
      }
      return results;
    }
  };

  this.Codewave.Command.resetSaved = function() {
    return Codewave.storage.save('cmds', {});
  };

  this.Codewave.BaseCommand = (function() {
    function BaseCommand(instance1) {
      this.instance = instance1;
    }

    BaseCommand.prototype.init = function() {};

    BaseCommand.prototype.resultIsAvailable = function() {
      return this["result"] != null;
    };

    BaseCommand.prototype.getDefaults = function() {
      return {};
    };

    BaseCommand.prototype.getOptions = function() {
      return {};
    };

    return BaseCommand;

  })();

  this.Codewave.Context = (function() {
    function Context(codewave1) {
      this.codewave = codewave1;
      this.nameSpaces = [];
    }

    Context.prototype.addNameSpace = function(name) {
      if (indexOf.call(this.nameSpaces, name) < 0) {
        this.nameSpaces.push(name);
        return this._namespaces = null;
      }
    };

    Context.prototype.addNamespaces = function(spaces) {
      var len1, q, results, space;
      if (spaces) {
        if (typeof spaces === 'string') {
          spaces = [spaces];
        }
        results = [];
        for (q = 0, len1 = spaces.length; q < len1; q++) {
          space = spaces[q];
          results.push(this.addNameSpace(space));
        }
        return results;
      }
    };

    Context.prototype.removeNameSpace = function(name) {
      return this.nameSpaces = this.nameSpaces.filter(function(n) {
        return n !== name;
      });
    };

    Context.prototype.getNameSpaces = function() {
      var npcs;
      if (this._namespaces == null) {
        npcs = ['core'].concat(this.nameSpaces);
        if (this.parent != null) {
          npcs = npcs.concat(this.parent.getNameSpaces());
        }
        this._namespaces = Codewave.util.unique(npcs);
      }
      return this._namespaces;
    };

    Context.prototype.getCmd = function(cmdName, nameSpaces) {
      var finder;
      if (nameSpaces == null) {
        nameSpaces = [];
      }
      finder = this.getFinder(cmdName, nameSpaces);
      return finder.find();
    };

    Context.prototype.getFinder = function(cmdName, nameSpaces) {
      if (nameSpaces == null) {
        nameSpaces = [];
      }
      return new Codewave.CmdFinder(cmdName, {
        namespaces: nameSpaces,
        useDetectors: this.isRoot(),
        codewave: this.codewave,
        parentContext: this
      });
    };

    Context.prototype.isRoot = function() {
      return this.parent == null;
    };

    Context.prototype.wrapComment = function(str) {
      var cc;
      cc = this.getCommentChar();
      if (cc.indexOf('%s') > -1) {
        return cc.replace('%s', str);
      } else {
        return cc + ' ' + str + ' ' + cc;
      }
    };

    Context.prototype.wrapCommentLeft = function(str) {
      var cc, i;
      if (str == null) {
        str = '';
      }
      cc = this.getCommentChar();
      if ((i = cc.indexOf('%s')) > -1) {
        return cc.substr(0, i) + str;
      } else {
        return cc + ' ' + str;
      }
    };

    Context.prototype.wrapCommentRight = function(str) {
      var cc, i;
      if (str == null) {
        str = '';
      }
      cc = this.getCommentChar();
      if ((i = cc.indexOf('%s')) > -1) {
        return str + cc.substr(i + 2);
      } else {
        return str + ' ' + cc;
      }
    };

    Context.prototype.cmdInstanceFor = function(cmd) {
      return new Codewave.CmdInstance(cmd, this);
    };

    Context.prototype.getCommentChar = function() {
      var char, cmd, inst, res;
      if (this.commentChar != null) {
        return this.commentChar;
      }
      cmd = this.getCmd('comment');
      char = '<!-- %s -->';
      if (cmd != null) {
        inst = this.cmdInstanceFor(cmd);
        inst.content = '%s';
        res = inst.result();
        if (res != null) {
          char = res;
        }
      }
      this.commentChar = char;
      return this.commentChar;
    };

    return Context;

  })();

  this.Codewave.Detector = (function() {
    function Detector(data1) {
      this.data = data1 != null ? data1 : {};
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

  this.Codewave.LangDetector = (function(superClass) {
    extend(LangDetector, superClass);

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

  this.Codewave.PairDetector = (function(superClass) {
    extend(PairDetector, superClass);

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

  this.Codewave.logger = {
    log: function() {
      var args, len1, msg, q, results;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (window.console && Codewave.logger.enabled) {
        results = [];
        for (q = 0, len1 = args.length; q < len1; q++) {
          msg = args[q];
          results.push(console.log(msg));
        }
        return results;
      }
    },
    enabled: true,
    runtime: function(funct, name) {
      var res, t0, t1;
      if (name == null) {
        name = "function";
      }
      t0 = performance.now();
      res = funct();
      t1 = performance.now();
      console.log(name + " took " + (t1 - t0) + " milliseconds.");
      return res;
    },
    minitorData: {},
    toMonitor: function(obj, name, prefix) {
      var funct;
      if (prefix == null) {
        prefix = '';
      }
      funct = obj[name];
      return obj[name] = function() {
        var args;
        args = arguments;
        return Codewave.logger.monitor((function() {
          return funct.apply(obj, args);
        }), prefix + name);
      };
    },
    monitor: function(funct, name) {
      var res, t0, t1;
      t0 = performance.now();
      res = funct();
      t1 = performance.now();
      if (Codewave.logger.minitorData[name] != null) {
        Codewave.logger.minitorData[name].count++;
        Codewave.logger.minitorData[name].total += t1 - t0;
      } else {
        Codewave.logger.minitorData[name] = {
          count: 1,
          total: t1 - t0
        };
      }
      return res;
    },
    resume: function() {
      return console.log(Codewave.logger.minitorData);
    }
  };

  this.Codewave.PositionedCmdInstance = (function(superClass) {
    extend(PositionedCmdInstance, superClass);

    function PositionedCmdInstance(codewave1, pos1, str1) {
      this.codewave = codewave1;
      this.pos = pos1;
      this.str = str1;
      if (!this.isEmpty()) {
        this._checkCloser();
        this.opening = this.str;
        this.noBracket = this._removeBracket(this.str);
        this._splitComponents();
        this._findClosing();
        this._checkElongated();
      }
    }

    PositionedCmdInstance.prototype._checkCloser = function() {
      var f, noBracket;
      noBracket = this._removeBracket(this.str);
      if (noBracket.substring(0, this.codewave.closeChar.length) === this.codewave.closeChar && (f = this._findOpeningPos())) {
        this.closingPos = new Codewave.util.StrPos(this.pos, this.str);
        this.pos = f.pos;
        return this.str = f.str;
      }
    };

    PositionedCmdInstance.prototype._findOpeningPos = function() {
      var closing, cmdName, f, opening;
      cmdName = this._removeBracket(this.str).substring(this.codewave.closeChar.length);
      opening = this.codewave.brakets + cmdName;
      closing = this.str;
      if (f = this.codewave.findMatchingPair(this.pos, opening, closing, -1)) {
        f.str = this.codewave.editor.textSubstr(f.pos, this.codewave.findNextBraket(f.pos + f.str.length) + this.codewave.brakets.length);
        return f;
      }
    };

    PositionedCmdInstance.prototype._splitComponents = function() {
      var parts;
      parts = this.noBracket.split(" ");
      this.cmdName = parts.shift();
      return this.rawParams = parts.join(" ");
    };

    PositionedCmdInstance.prototype._parseParams = function(params) {
      var allowedNamed, chr, i, inStr, name, nameToParam, param, q, ref;
      this.params = [];
      this.named = this.getDefaults();
      if (this.cmd != null) {
        nameToParam = this.getOption('nameToParam');
        if (nameToParam != null) {
          this.named[nameToParam] = this.cmdName;
        }
      }
      if (params.length) {
        if (this.cmd != null) {
          allowedNamed = this.getOption('allowedNamed');
        }
        inStr = false;
        param = '';
        name = false;
        for (i = q = 0, ref = params.length - 1; 0 <= ref ? q <= ref : q >= ref; i = 0 <= ref ? ++q : --q) {
          chr = params[i];
          if (chr === ' ' && !inStr) {
            if (name) {
              this.named[name] = param;
            } else {
              this.params.push(param);
            }
            param = '';
            name = false;
          } else if ((chr === '"' || chr === "'") && (i === 0 || params[i - 1] !== '\\')) {
            inStr = !inStr;
          } else if (chr === ':' && !name && !inStr && ((allowedNamed == null) || indexOf.call(allowedNamed, name) >= 0)) {
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

    PositionedCmdInstance.prototype._findClosing = function() {
      var f;
      if (f = this._findClosingPos()) {
        this.content = Codewave.util.trimEmptyLine(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos));
        return this.str = this.codewave.editor.textSubstr(this.pos, f.pos + f.str.length);
      }
    };

    PositionedCmdInstance.prototype._findClosingPos = function() {
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

    PositionedCmdInstance.prototype._checkElongated = function() {
      var endPos, max, ref;
      endPos = this.getEndPos();
      max = this.codewave.editor.textLen();
      while (endPos < max && this.codewave.editor.textSubstr(endPos, endPos + this.codewave.deco.length) === this.codewave.deco) {
        endPos += this.codewave.deco.length;
      }
      if (endPos >= max || ((ref = this.codewave.editor.textSubstr(endPos, endPos + this.codewave.deco.length)) === ' ' || ref === "\n" || ref === "\r")) {
        return this.str = this.codewave.editor.textSubstr(this.pos, endPos);
      }
    };

    PositionedCmdInstance.prototype._checkBox = function() {
      var cl, cr, endPos;
      if ((this.codewave.inInstance != null) && this.codewave.inInstance.cmd.name === 'comment') {
        return;
      }
      cl = this.context.wrapCommentLeft();
      cr = this.context.wrapCommentRight();
      endPos = this.getEndPos() + cr.length;
      if (this.codewave.editor.textSubstr(this.pos - cl.length, this.pos) === cl && this.codewave.editor.textSubstr(endPos - cr.length, endPos) === cr) {
        this.pos = this.pos - cl.length;
        this.str = this.codewave.editor.textSubstr(this.pos, endPos);
        return this._removeCommentFromContent();
      } else if (this.getPos().sameLinesPrefix().indexOf(cl) > -1 && this.getPos().sameLinesSuffix().indexOf(cr) > -1) {
        this.inBox = 1;
        return this._removeCommentFromContent();
      }
    };

    PositionedCmdInstance.prototype._removeCommentFromContent = function() {
      var ecl, ecr, ed, re1, re2, re3;
      if (this.content) {
        ecl = Codewave.util.escapeRegExp(this.context.wrapCommentLeft());
        ecr = Codewave.util.escapeRegExp(this.context.wrapCommentRight());
        ed = Codewave.util.escapeRegExp(this.codewave.deco);
        re1 = new RegExp("^\\s*" + ecl + "(?:" + ed + ")+\\s*(.*?)\\s*(?:" + ed + ")+" + ecr + "$", "gm");
        re2 = new RegExp("^\\s*(?:" + ed + ")*" + ecr + "\r?\n");
        re3 = new RegExp("\n\\s*" + ecl + "(?:" + ed + ")*\\s*$");
        return this.content = this.content.replace(re1, '$1').replace(re2, '').replace(re3, '');
      }
    };

    PositionedCmdInstance.prototype._getParentCmds = function() {
      var ref;
      return this.parent = (ref = this.codewave.getEnclosingCmd(this.getEndPos())) != null ? ref.init() : void 0;
    };

    PositionedCmdInstance.prototype.setMultiPos = function(multiPos) {
      return this.multiPos = multiPos;
    };

    PositionedCmdInstance.prototype._getCmdObj = function() {
      this.getCmd();
      this._checkBox();
      this.content = this.removeIndentFromContent(this.content);
      return PositionedCmdInstance.__super__._getCmdObj.apply(this, arguments);
    };

    PositionedCmdInstance.prototype._initParams = function() {
      return this._parseParams(this.rawParams);
    };

    PositionedCmdInstance.prototype.getContext = function() {
      return this.context || this.codewave.context;
    };

    PositionedCmdInstance.prototype.getCmd = function() {
      if (this.cmd == null) {
        this._getParentCmds();
        if (this.noBracket.substring(0, this.codewave.noExecuteChar.length) === this.codewave.noExecuteChar) {
          this.cmd = Codewave.Command.cmds.getCmd('core:no_execute');
          this.context = this.codewave.context;
        } else {
          this.finder = this.getFinder(this.cmdName);
          this.context = this.finder.context;
          this.cmd = this.finder.find();
          if (this.cmd != null) {
            this.context.addNameSpace(this.cmd.fullName);
          }
        }
      }
      return this.cmd;
    };

    PositionedCmdInstance.prototype.getFinder = function(cmdName) {
      var finder;
      finder = this.codewave.context.getFinder(cmdName, this._getParentNamespaces());
      finder.instance = this;
      return finder;
    };

    PositionedCmdInstance.prototype._getParentNamespaces = function() {
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

    PositionedCmdInstance.prototype._removeBracket = function(str) {
      return str.substring(this.codewave.brakets.length, str.length - this.codewave.brakets.length);
    };

    PositionedCmdInstance.prototype.alterAliasOf = function(aliasOf) {
      var cmdName, nspc, ref;
      ref = Codewave.util.splitNamespace(this.cmdName), nspc = ref[0], cmdName = ref[1];
      return aliasOf.replace('%name%', cmdName);
    };

    PositionedCmdInstance.prototype.isEmpty = function() {
      return this.str === this.codewave.brakets + this.codewave.closeChar + this.codewave.brakets || this.str === this.codewave.brakets + this.codewave.brakets;
    };

    PositionedCmdInstance.prototype.execute = function() {
      var beforeFunct, res;
      if (this.isEmpty()) {
        if ((this.codewave.closingPromp != null) && (this.codewave.closingPromp.whithinOpenBounds(this.pos + this.codewave.brakets.length) != null)) {
          return this.codewave.closingPromp.cancel();
        } else {
          return this.replaceWith('');
        }
      } else if (this.cmd != null) {
        if (beforeFunct = this.getOption('beforeExecute')) {
          beforeFunct(this);
        }
        if (this.resultIsAvailable()) {
          if ((res = this.result()) != null) {
            this.replaceWith(res);
            return true;
          }
        } else {
          return this.runExecuteFunct();
        }
      }
    };

    PositionedCmdInstance.prototype.getEndPos = function() {
      return this.pos + this.str.length;
    };

    PositionedCmdInstance.prototype.getPos = function() {
      return new Codewave.util.Pos(this.pos, this.pos + this.str.length).withEditor(this.codewave.editor);
    };

    PositionedCmdInstance.prototype.getOpeningPos = function() {
      return new Codewave.util.Pos(this.pos, this.pos + this.opening.length).withEditor(this.codewave.editor);
    };

    PositionedCmdInstance.prototype.getIndent = function() {
      var helper;
      if (this.indentLen == null) {
        if (this.inBox != null) {
          helper = new Codewave.util.BoxHelper(this.context);
          this.indentLen = helper.removeComment(this.getPos().sameLinesPrefix()).length;
        } else {
          this.indentLen = this.pos - this.getPos().prevEOL();
        }
      }
      return this.indentLen;
    };

    PositionedCmdInstance.prototype.removeIndentFromContent = function(text) {
      var reg;
      if (text != null) {
        reg = new RegExp('^\\s{' + this.getIndent() + '}', 'gm');
        return text.replace(reg, '');
      } else {
        return text;
      }
    };

    PositionedCmdInstance.prototype.alterResultForBox = function(repl) {
      var box, helper, original, ref, ref1, res;
      original = repl.copy();
      helper = new Codewave.util.BoxHelper(this.context);
      helper.getOptFromLine(original.textWithFullLines(), false);
      if (this.getOption('replaceBox')) {
        box = helper.getBoxForPos(original);
        ref = [box.start, box.end], repl.start = ref[0], repl.end = ref[1];
        this.indentLen = helper.indent;
        repl.text = this.applyIndent(repl.text);
      } else {
        repl.text = this.applyIndent(repl.text);
        repl.start = original.prevEOL();
        repl.end = original.nextEOL();
        res = helper.reformatLines(original.sameLinesPrefix() + this.codewave.marker + repl.text + this.codewave.marker + original.sameLinesSuffix(), {
          multiline: false
        });
        ref1 = res.split(this.codewave.marker), repl.prefix = ref1[0], repl.text = ref1[1], repl.suffix = ref1[2];
      }
      return repl;
    };

    PositionedCmdInstance.prototype.getCursorFromResult = function(repl) {
      var cursorPos, p;
      cursorPos = repl.resPosBeforePrefix();
      if ((this.cmd != null) && this.codewave.checkCarret && this.getOption('checkCarret')) {
        if ((p = this.codewave.getCarretPos(repl.text)) != null) {
          cursorPos = repl.start + repl.prefix.length + p;
        }
        repl.text = this.codewave.removeCarret(repl.text);
      }
      return cursorPos;
    };

    PositionedCmdInstance.prototype.checkMulti = function(repl) {
      var i, len1, newRepl, originalPos, originalText, pos, q, ref, replacements;
      if ((this.multiPos != null) && this.multiPos.length > 1) {
        replacements = [repl];
        originalText = repl.originalText();
        ref = this.multiPos;
        for (i = q = 0, len1 = ref.length; q < len1; i = ++q) {
          pos = ref[i];
          if (i === 0) {
            originalPos = pos.start;
          } else {
            newRepl = repl.copy().applyOffset(pos.start - originalPos);
            if (newRepl.originalText() === originalText) {
              replacements.push(newRepl);
            }
          }
        }
        return replacements;
      } else {
        return [repl];
      }
    };

    PositionedCmdInstance.prototype.replaceWith = function(text) {
      return this.applyReplacement(new Codewave.util.Replacement(this.pos, this.getEndPos(), text));
    };

    PositionedCmdInstance.prototype.applyReplacement = function(repl) {
      var cursorPos, replacements;
      repl.withEditor(this.codewave.editor);
      if (this.inBox != null) {
        this.alterResultForBox(repl);
      } else {
        repl.text = this.applyIndent(repl.text);
      }
      cursorPos = this.getCursorFromResult(repl);
      repl.selections = [new Codewave.util.Pos(cursorPos, cursorPos)];
      replacements = this.checkMulti(repl);
      this.codewave.editor.applyReplacements(replacements);
      this.replaceStart = repl.start;
      return this.replaceEnd = repl.resEnd();
    };

    return PositionedCmdInstance;

  })(this.Codewave.CmdInstance);

  this.Codewave.Process = (function() {
    function Process() {}

    return Process;

  })();

  this.Codewave.TestEditor = (function(superClass) {
    extend(TestEditor, superClass);

    function TestEditor(target) {
      TestEditor.__super__.constructor.call(this, target);
      this.selections = [];
    }

    TestEditor.prototype.allowMultiSelection = function() {
      return true;
    };

    TestEditor.prototype.setCursorPos = function(start, end) {
      var old;
      if (arguments.length < 2) {
        end = start;
      }
      old = this.getCursorPos();
      if (start !== old.start || end !== old.end) {
        TestEditor.__super__.setCursorPos.call(this, start, end);
        return this.selections = [new Codewave.util.Pos(start, end)];
      }
    };

    TestEditor.prototype.setMultiSel = function(selections) {
      if (selections.length > 0) {
        this.setCursorPos(selections[0].start, selections[0].end);
      }
      return this.selections = selections.map(function(s) {
        return s.copy();
      });
    };

    TestEditor.prototype.textEventChange = function() {
      return false;
    };

    TestEditor.prototype.getMultiSel = function() {
      var selections;
      selections = this.selections;
      selections[0] = this.getCursorPos();
      return selections;
    };

    TestEditor.prototype.addSel = function(start, end) {
      return this.selections.push(new Codewave.util.Pos(start, end));
    };

    TestEditor.prototype.resetSel = function(start, end) {
      return this.selections = [this.getCursorPos()];
    };

    return TestEditor;

  })(Codewave.TextAreaEditor);

  initCmds = function() {
    var core;
    core = Codewave.Command.cmds.addCmd(new Codewave.Command('core'));
    core.addDetector(new Codewave.LangDetector());
    return core.addCmds({
      'help': {
        'replaceBox': true,
        'result': "~~box~~\n~~quote_carret~~\n  ___         _   __      __\n / __|___  __| |__\\ \\    / /_ ___ ______\n/ /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/\n\\____\\___/\\__,_\\___|\\_/\\_/\\__,_|\\_/\\___|\nThe text editor helper\n~~/quote_carret~~\n\nWhen using Codewave you will be writing commands directly within \nyour text editor editing windows. These commands must be placed\nbetween two pairs of \"~\" (tilde) and then with you text either \ninside or at the command, they can be executed by pressing \n\"ctrl\"+\"shift\"+\"e\".\nEx: ~~!hello~~\n\nOne good thing about codewave is that you dont need to actually\ntype any \"~\" (tilde), because pressing \"ctrl\"+\"shift\"+\"e\" will\nadd them if you are not allready within a command\n\nCodewave does not relly use UI to display any information. \ninstead, it uses text within code comments to mimic UIs. The \ngenerated comment blocks will be refered as windows in the help\nsections.\n\nTo close this window (ie. remove this comment bloc), press \n\"ctrl\"+\"shift\"+\"e\" with you cursor on the line bellow.\n~~!close|~~\n\nUse the following command for a walkthrough of some of many\nfeatures of codewave\n~~!help:get_started~~ or ~~!help:demo~~\n\nList of all helps subjects \n~~!help:subjects~~ or ~~!help:sub~~ \n\n~~!close~~\n~~/box~~",
        'cmds': {
          'subjects': {
            'replaceBox': true,
            'result': "~~box~~\n~~!help~~\n~~!help:get_started~~ (~~!help:demo~~)\n~~!help:subjects~~ (~~!help:sub~~)\n~~!help:editing~~ (~~!help:edit~~)\n~~!close|~~\n~~/box~~"
          },
          'sub': {
            'aliasOf': 'help:subjects'
          },
          'get_started': {
            'replaceBox': true,
            'result': "~~box~~\nThe classic Hello World.\n~~!hello|~~\n\n~~help:editing:intro~~\n~~quote_carret~~\n\nfor more information on creating your own commands, see:\n~~!help:editing~~\n\nCodewave come with many prexisting commands. Here an example of \njavascript abreviations\n~~!js:f~~\n~~!js:if~~\n  ~~!js:log~~\"~~!hello~~\"~~!/js:log~~\n~~!/js:if~~\n~~!/js:f~~\n\nCodeWave come with the exellent Emmet ( http://emmet.io/ ) to \nprovide event more abreviations. Emmet will fire automaticaly if\nyou are in a html or css file and no other command of the same \nname were defined.\n~~!ul>li~~ (if you are in a html doccument)\n~~!emmet ul>li~~\n~~!emmet m2 css~~\n\nCommands are stored in name spaces and some of the namespaces are\nactive depending of the context or they can be called explicitly. \nThe two following commands are the same and will display the \ncurrently  active namespace. The first command command works \nbecause the core namespace is active.\n~~!namespace~~\n~~!core:namespace~~\n\nyou can make an namespace active with the following command.\n~~!namespace php~~\n\nCheck the namespaces again\n~~!namespace~~\n\nAll the dialogs(windows) of codewave are made with the command \n\"box\" and you can use it in your own commands. you can also use a\n\"close\" command to make it easy to get rid of the window.\n~~!box~~\nThe box will scale with the content you put in it\n~~!close|~~\n~~!/box~~\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
          },
          'demo': {
            'aliasOf': 'help:get_started'
          },
          'editing': {
            'cmds': {
              'intro': {
                'result': "Codewave allows you to make your own commands (or abbreviations) \nput your content inside \"source\" the do \"save\". Try adding any \ntext that is on your mind.\n~~!edit my_new_command|~~\n\nIf you did the last step right, you should see your text when you\ndo the following command. It is now saved and you can use it \nwhenever you want.\n~~!my_new_command~~"
              }
            },
            'replaceBox': true,
            'result': "~~box~~\n~~help:editing:intro~~\n\n~~quote_carret~~\nWhen you make your command you may need to tell where the text cursor \nwill be located once the command is executed. To do that, use a \"|\" \n(Vertical bar). Use 2 of them if you want to print the actual \ncharacter.\n~~!box~~\none : | \ntwo : ||\n~~!/box~~\n\nIf you want to print a command without having it evalute when \nthe command is executed, use a \"!\" exclamation mark.\n~~!!hello~~\n\nfor commands that have both a openig and a closing tag, you can use\nthe \"content\" command. \"content\" will be replaced with the text\nthat is between tha tags. Look at the code of the following command\nfor en example of how it can be used.\n~~!edit php:inner:if~~\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
          },
          'edit': {
            'aliasOf': 'help:editing'
          }
        }
      },
      'no_execute': {
        'result': no_execute
      },
      'quote_carret': {
        'result': quote_carret,
        'checkCarret': false
      },
      'exec_parent': {
        'execute': exec_parent
      },
      'content': {
        'result': getContent
      },
      'box': {
        'cls': BoxCmd
      },
      'close': {
        'cls': CloseCmd
      },
      'param': {
        'result': getParam
      },
      'edit': {
        'cmds': EditCmd.setCmds({
          'save': {
            'aliasOf': 'core:exec_parent'
          }
        }),
        'cls': EditCmd
      },
      'rename': {
        'cmds': {
          'not_applicable': "~~box~~\nYou cant rename a command you did not create yourself.\n~~!close|~~\n~~/box~~",
          'not_found': "~~box~~\nCommand not found\n~~!close|~~\n~~/box~~"
        },
        'result': renameCommand,
        'parse': true
      },
      'remove': {
        'cmds': {
          'not_applicable': "~~box~~\nYou cant remove a command you did not create yourself.\n~~!close|~~\n~~/box~~",
          'not_found': "~~box~~\nCommand not found\n~~!close|~~\n~~/box~~"
        },
        'result': removeCommand,
        'parse': true
      },
      'alias': {
        'cmds': {
          'not_found': "~~box~~\nCommand not found\n~~!close|~~\n~~/box~~"
        },
        'result': aliasCommand,
        'parse': true
      },
      'namespace': {
        'cls': NameSpaceCmd
      },
      'nspc': {
        'aliasOf': 'core:namespace'
      },
      'emmet': {
        'cls': EmmetCmd
      }
    });
  };

  this.Codewave.Command.cmdInitialisers.push(initCmds);

  this.Codewave.Command.setVarCmd = function(name, base) {
    if (base == null) {
      base = {};
    }
    base.execute = function(instance) {
      var p, val;
      val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : void 0;
      if (val != null) {
        return instance.codewave.vars[name] = val;
      }
    };
    return base;
  };

  this.Codewave.Command.setBoolVarCmd = function(name, base) {
    if (base == null) {
      base = {};
    }
    base.execute = function(instance) {
      var p, val;
      val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : void 0;
      if (!((val != null) && (val === '0' || val === 'false' || val === 'no'))) {
        return instance.codewave.vars[name] = true;
      }
    };
    return base;
  };

  no_execute = function(instance) {
    var reg;
    reg = new RegExp("^(" + Codewave.util.escapeRegExp(instance.codewave.brakets) + ')' + Codewave.util.escapeRegExp(instance.codewave.noExecuteChar));
    return instance.str.replace(reg, '$1');
  };

  quote_carret = function(instance) {
    return instance.content.replace(/\|/g, '||');
  };

  exec_parent = function(instance) {
    var res;
    if (instance.parent != null) {
      res = instance.parent.execute();
      instance.replaceStart = instance.parent.replaceStart;
      instance.replaceEnd = instance.parent.replaceEnd;
      return res;
    }
  };

  getContent = function(instance) {
    var affixes_empty, prefix, suffix;
    affixes_empty = instance.getParam(['affixes_empty'], false);
    prefix = instance.getParam(['prefix'], '');
    suffix = instance.getParam(['suffix'], '');
    if (instance.codewave.inInstance != null) {
      return prefix + (instance.codewave.inInstance.content || '') + suffix;
    }
    if (affixes_empty) {
      return prefix + suffix;
    }
  };

  renameCommand = function(instance) {
    var cmd, cmdData, newName, origninalName, savedCmds;
    savedCmds = Codewave.storage.load('cmds');
    origninalName = instance.getParam([0, 'from']);
    newName = instance.getParam([1, 'to']);
    if ((origninalName != null) && (newName != null)) {
      cmd = instance.context.getCmd(origninalName);
      if ((savedCmds[origninalName] != null) && (cmd != null)) {
        if (!(newName.indexOf(':') > -1)) {
          newName = cmd.fullName.replace(origninalName, '') + newName;
        }
        cmdData = savedCmds[origninalName];
        Codewave.Command.cmds.setCmdData(newName, cmdData);
        cmd.unregister();
        savedCmds[newName] = cmdData;
        delete savedCmds[origninalName];
        Codewave.storage.save('cmds', savedCmds);
        return "";
      } else if (cmd != null) {
        return "~~not_applicable~~";
      } else {
        return "~~not_found~~";
      }
    }
  };

  removeCommand = function(instance) {
    var cmd, cmdData, name, savedCmds;
    name = instance.getParam([0, 'name']);
    if (name != null) {
      savedCmds = Codewave.storage.load('cmds');
      cmd = instance.context.getCmd(name);
      if ((savedCmds[name] != null) && (cmd != null)) {
        cmdData = savedCmds[name];
        cmd.unregister();
        delete savedCmds[name];
        Codewave.storage.save('cmds', savedCmds);
        return "";
      } else if (cmd != null) {
        return "~~not_applicable~~";
      } else {
        return "~~not_found~~";
      }
    }
  };

  aliasCommand = function(instance) {
    var alias, cmd, name;
    name = instance.getParam([0, 'name']);
    alias = instance.getParam([1, 'alias']);
    if ((name != null) && (alias != null)) {
      cmd = instance.context.getCmd(name);
      if (cmd != null) {
        cmd = cmd.getAliased() || cmd;
        Codewave.Command.saveCmd(alias, {
          aliasOf: cmd.fullName
        });
        return "";
      } else {
        return "~~not_found~~";
      }
    }
  };

  getParam = function(instance) {
    if (instance.codewave.inInstance != null) {
      return instance.codewave.inInstance.getParam(instance.params, instance.getParam(['def', 'default']));
    }
  };

  BoxCmd = (function(superClass) {
    extend(BoxCmd, superClass);

    function BoxCmd() {
      return BoxCmd.__super__.constructor.apply(this, arguments);
    }

    BoxCmd.prototype.init = function() {
      this.helper = new Codewave.util.BoxHelper(this.instance.context);
      this.cmd = this.instance.getParam(['cmd']);
      if (this.cmd != null) {
        this.helper.openText = this.instance.codewave.brakets + this.cmd + this.instance.codewave.brakets;
        this.helper.closeText = this.instance.codewave.brakets + this.instance.codewave.closeChar + this.cmd.split(" ")[0] + this.instance.codewave.brakets;
      }
      this.helper.deco = this.instance.codewave.deco;
      this.helper.pad = 2;
      this.helper.prefix = this.instance.getParam(['prefix'], '');
      return this.helper.suffix = this.instance.getParam(['suffix'], '');
    };

    BoxCmd.prototype.height = function() {
      var height, params;
      if (this.bounds() != null) {
        height = this.bounds().height;
      } else {
        height = 3;
      }
      params = ['height'];
      if (this.instance.params.length > 1) {
        params.push(1);
      } else if (this.instance.params.length > 0) {
        params.push(0);
      }
      return this.instance.getParam(params, height);
    };

    BoxCmd.prototype.width = function() {
      var params, width;
      if (this.bounds() != null) {
        width = this.bounds().width;
      } else {
        width = 3;
      }
      params = ['width'];
      if (this.instance.params.length > 1) {
        params.push(0);
      }
      return Math.max(this.minWidth(), this.instance.getParam(params, width));
    };

    BoxCmd.prototype.bounds = function() {
      if (this.instance.content) {
        if (this._bounds == null) {
          this._bounds = this.helper.textBounds(this.instance.content);
        }
        return this._bounds;
      }
    };

    BoxCmd.prototype.result = function() {
      this.helper.height = this.height();
      this.helper.width = this.width();
      return this.helper.draw(this.instance.content);
    };

    BoxCmd.prototype.minWidth = function() {
      if (this.cmd != null) {
        return this.cmd.length;
      } else {
        return 0;
      }
    };

    return BoxCmd;

  })(Codewave.BaseCommand);

  CloseCmd = (function(superClass) {
    extend(CloseCmd, superClass);

    function CloseCmd() {
      return CloseCmd.__super__.constructor.apply(this, arguments);
    }

    CloseCmd.prototype.init = function() {
      return this.helper = new Codewave.util.BoxHelper(this.instance.context);
    };

    CloseCmd.prototype.execute = function() {
      var box, box2, depth, prefix, required_affixes, suffix;
      prefix = this.helper.prefix = this.instance.getParam(['prefix'], '');
      suffix = this.helper.suffix = this.instance.getParam(['suffix'], '');
      box = this.helper.getBoxForPos(this.instance.getPos());
      required_affixes = this.instance.getParam(['required_affixes'], true);
      if (!required_affixes) {
        this.helper.prefix = this.helper.suffix = '';
        box2 = this.helper.getBoxForPos(this.instance.getPos());
        if ((box2 != null) && ((box == null) || box.start < box2.start - prefix.length || box.end > box2.end + suffix.length)) {
          box = box2;
        }
      }
      if (box != null) {
        depth = this.helper.getNestedLvl(this.instance.getPos().start);
        if (depth < 2) {
          this.instance.inBox = null;
        }
        return this.instance.applyReplacement(new Codewave.util.Replacement(box.start, box.end, ''));
      } else {
        return this.instance.replaceWith('');
      }
    };

    return CloseCmd;

  })(Codewave.BaseCommand);

  EditCmd = (function(superClass) {
    extend(EditCmd, superClass);

    function EditCmd() {
      return EditCmd.__super__.constructor.apply(this, arguments);
    }

    EditCmd.prototype.init = function() {
      var ref;
      this.cmdName = this.instance.getParam([0, 'cmd']);
      this.verbalize = (ref = this.instance.getParam([1])) === 'v' || ref === 'verbalize';
      if (this.cmdName != null) {
        this.finder = this.instance.context.getFinder(this.cmdName);
        this.finder.useFallbacks = false;
        this.cmd = this.finder.find();
      }
      return this.editable = this.cmd != null ? this.cmd.isEditable() : true;
    };

    EditCmd.prototype.getOptions = function() {
      return {
        allowedNamed: ['cmd']
      };
    };

    EditCmd.prototype.result = function() {
      if (this.instance.content) {
        return this.resultWithContent();
      } else {
        return this.resultWithoutContent();
      }
    };

    EditCmd.prototype.resultWithContent = function() {
      var data, len1, p, parser, q, ref;
      parser = this.instance.getParserForText(this.instance.content);
      parser.parseAll();
      data = {};
      ref = EditCmd.props;
      for (q = 0, len1 = ref.length; q < len1; q++) {
        p = ref[q];
        p.writeFor(parser, data);
      }
      Codewave.Command.saveCmd(this.cmdName, data);
      return '';
    };

    EditCmd.prototype.propsDisplay = function() {
      var cmd;
      cmd = this.cmd;
      return EditCmd.props.map(function(p) {
        return p.display(cmd);
      }).filter(function(p) {
        return p != null;
      }).join("\n");
    };

    EditCmd.prototype.resultWithoutContent = function() {
      var name, parser;
      if (!this.cmd || this.editable) {
        name = this.cmd ? this.cmd.fullName : this.cmdName;
        parser = this.instance.getParserForText("~~box cmd:\"" + this.instance.cmd.fullName + " " + name + "\"~~\n" + (this.propsDisplay()) + "\n~~save~~ ~~!close~~\n~~/box~~");
        parser.checkCarret = false;
        if (this.verbalize) {
          return parser.getText();
        } else {
          return parser.parseAll();
        }
      }
    };

    return EditCmd;

  })(Codewave.BaseCommand);

  EditCmd.setCmds = function(base) {
    var len1, p, q, ref;
    ref = EditCmd.props;
    for (q = 0, len1 = ref.length; q < len1; q++) {
      p = ref[q];
      p.setCmd(base);
    }
    return base;
  };

  EditCmd.props = [
    new Codewave.EditCmdProp.revBool('no_carret', {
      opt: 'checkCarret'
    }), new Codewave.EditCmdProp.revBool('no_parse', {
      opt: 'parse'
    }), new Codewave.EditCmdProp.bool('prevent_parse_all', {
      opt: 'preventParseAll'
    }), new Codewave.EditCmdProp.bool('replace_box', {
      opt: 'replaceBox'
    }), new Codewave.EditCmdProp.string('name_to_param', {
      opt: 'nameToParam'
    }), new Codewave.EditCmdProp.string('alias_of', {
      "var": 'aliasOf',
      carret: true
    }), new Codewave.EditCmdProp.source('help', {
      funct: 'help',
      showEmpty: true
    }), new Codewave.EditCmdProp.source('source', {
      "var": 'resultStr',
      dataName: 'result',
      showEmpty: true,
      carret: true
    })
  ];

  NameSpaceCmd = (function(superClass) {
    extend(NameSpaceCmd, superClass);

    function NameSpaceCmd() {
      return NameSpaceCmd.__super__.constructor.apply(this, arguments);
    }

    NameSpaceCmd.prototype.init = function() {
      return this.name = this.instance.getParam([0]);
    };

    NameSpaceCmd.prototype.result = function() {
      var len1, namespaces, nspc, parser, q, txt;
      if (this.name != null) {
        this.instance.codewave.getRoot().context.addNameSpace(this.name);
        return '';
      } else {
        namespaces = this.instance.context.getNameSpaces();
        txt = '~~box~~\n';
        for (q = 0, len1 = namespaces.length; q < len1; q++) {
          nspc = namespaces[q];
          if (nspc !== this.instance.cmd.fullName) {
            txt += nspc + '\n';
          }
        }
        txt += '~~!close|~~\n~~/box~~';
        parser = this.instance.getParserForText(txt);
        return parser.parseAll();
      }
    };

    return NameSpaceCmd;

  })(Codewave.BaseCommand);

  EmmetCmd = (function(superClass) {
    extend(EmmetCmd, superClass);

    function EmmetCmd() {
      return EmmetCmd.__super__.constructor.apply(this, arguments);
    }

    EmmetCmd.prototype.init = function() {
      this.abbr = this.instance.getParam([0, 'abbr', 'abbreviation']);
      return this.lang = this.instance.getParam([1, 'lang', 'language']);
    };

    EmmetCmd.prototype.result = function() {
      var emmet, ref, ref1, res;
      emmet = window.emmet != null ? window.emmet : ((ref = window.self) != null ? ref.emmet : void 0) != null ? window.self.emmet : ((ref1 = window.global) != null ? ref1.emmet : void 0) != null ? window.global.emmet : void 0;
      if (emmet != null) {
        res = emmet.expandAbbreviation(this.abbr, this.lang);
        return res.replace(/\$\{0\}/g, '|');
      }
    };

    return EmmetCmd;

  })(this.Codewave.BaseCommand);

  initCmds = function() {
    var css, html;
    html = Codewave.Command.cmds.addCmd(new Codewave.Command('html'));
    html.addCmds({
      'fallback': {
        'aliasOf': 'core:emmet',
        'defaults': {
          'lang': 'html'
        },
        'nameToParam': 'abbr'
      }
    });
    css = Codewave.Command.cmds.addCmd(new Codewave.Command('css'));
    return css.addCmds({
      'fallback': {
        'aliasOf': 'core:emmet',
        'defaults': {
          'lang': 'css'
        },
        'nameToParam': 'abbr'
      }
    });
  };

  this.Codewave.Command.cmdInitialisers.push(initCmds);

  initCmds = function() {
    var js;
    js = Codewave.Command.cmds.addCmd(new Codewave.Command('js'));
    Codewave.Command.cmds.addCmd(new Codewave.Command('javascript', {
      aliasOf: 'js'
    }));
    return js.addCmds({
      'comment': '/* ~~content~~ */',
      'if': 'if(|){\n\t~~content~~\n}',
      'log': 'if(window.console){\n\tconsole.log(~~content~~|)\n}',
      'function': 'function |() {\n\t~~content~~\n}',
      'funct': {
        aliasOf: 'js:function'
      },
      'f': {
        aliasOf: 'js:function'
      },
      'for': 'for (var i = 0; i < |; i++) {\n\t~~content~~\n}',
      'forin': 'foreach (var val in |) {\n\t~~content~~\n}',
      'each': {
        aliasOf: 'js:forin'
      },
      'foreach': {
        aliasOf: 'js:forin'
      },
      'while': 'while(|) {\n\t~~content~~\n}',
      'whilei': 'var i = 0;\nwhile(|) {\n\t~~content~~\n\ti++;\n}',
      'ifelse': 'if( | ) {\n\t~~content~~\n} else {\n\t\n}',
      'ife': {
        aliasOf: 'js:ifelse'
      },
      'switch': "switch( | ) { \n\tcase :\n\t\t~~content~~\n\t\tbreak;\n\tdefault :\n\t\t\n\t\tbreak;\n}"
    });
  };

  this.Codewave.Command.cmdInitialisers.push(initCmds);

  initCmds = function() {
    var php, phpInner, phpOuter;
    php = Codewave.Command.cmds.addCmd(new Codewave.Command('php'));
    php.addDetector(new Codewave.PairDetector({
      result: 'php:inner',
      opener: '<?php',
      closer: '?>',
      optionnal_end: true,
      'else': 'php:outer'
    }));
    phpOuter = php.addCmd(new Codewave.Command('outer'));
    phpOuter.addCmds({
      'fallback': {
        'cmds': {
          'any_content': {
            aliasOf: 'core:content',
            defaults: {
              prefix: ' ?>\n',
              suffix: '\n<?php ',
              affixes_empty: true
            }
          }
        },
        aliasOf: 'php:inner:%name%',
        alterResult: wrapWithPhp
      },
      'box': {
        aliasOf: 'core:box',
        defaults: {
          prefix: '<?php\n',
          suffix: '\n?>'
        }
      },
      'comment': '/* ~~content~~ */',
      php: '<?php\n\t~~content~~|\n?>'
    });
    phpInner = php.addCmd(new Codewave.Command('inner'));
    return phpInner.addCmds({
      'any_content': {
        aliasOf: 'core:content'
      },
      'comment': '/* ~~content~~ */',
      'if': 'if(|){\n\t~~any_content~~\n}',
      'info': 'phpinfo();',
      'echo': 'echo ${id}',
      'e': {
        aliasOf: 'php:inner:echo'
      },
      'class': {
        result: "class ~~param 0 class def:|~~ {\n\tfunction __construct() {\n\t\t~~content~~|\n\t}\n}",
        defaults: {
          inline: false
        }
      },
      'c': {
        aliasOf: 'php:inner:class'
      },
      'function': {
        result: 'function |() {\n\t~~content~~\n}',
        defaults: {
          inline: false
        }
      },
      'funct': {
        aliasOf: 'php:inner:function'
      },
      'f': {
        aliasOf: 'php:inner:function'
      },
      'array': '$| = array();',
      'a': 'array()',
      'for': 'for ($i = 0; $i < $|; $i++) {\n\t~~any_content~~\n}',
      'foreach': 'foreach ($| as $key => $val) {\n\t~~any_content~~\n}',
      'each': {
        aliasOf: 'php:inner:foreach'
      },
      'while': 'while(|) {\n\t~~any_content~~\n}',
      'whilei': {
        result: '$i = 0;\nwhile(|) {\n\t~~any_content~~\n\t$i++;\n}',
        defaults: {
          inline: false
        }
      },
      'ifelse': 'if( | ) {\n\t~~any_content~~\n} else {\n\t\n}',
      'ife': {
        aliasOf: 'php:inner:ifelse'
      },
      'switch': {
        result: "switch( | ) { \n\tcase :\n\t\t~~any_content~~\n\t\tbreak;\n\tdefault :\n\t\t\n\t\tbreak;\n}",
        defaults: {
          inline: false
        }
      },
      'close': {
        aliasOf: 'core:close',
        defaults: {
          prefix: '<?php\n',
          suffix: '\n?>',
          required_affixes: false
        }
      }
    });
  };

  this.Codewave.Command.cmdInitialisers.push(initCmds);

  wrapWithPhp = function(result, instance) {
    var inline, regClose, regOpen;
    inline = instance.getParam(['php_inline', 'inline'], true);
    if (inline) {
      regOpen = /<\?php\s([\\n\\r\s]+)/g;
      regClose = /([\n\r\s]+)\s\?>/g;
      return '<?php ' + result.replace(regOpen, '$1<?php ').replace(regClose, ' ?>$1') + ' ?>';
    } else {
      return '<?php\n' + Codewave.util.indent(result) + '\n?>';
    }
  };

  Codewave.detect = function(target) {
    return new Codewave(new Codewave.TextAreaEditor(target));
  };

}).call(this);

//# sourceMappingURL=codewave.js.map
