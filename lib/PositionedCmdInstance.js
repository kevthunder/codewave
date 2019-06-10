"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PositionedCmdInstance = void 0;

var _CmdInstance = require("./CmdInstance");

var _BoxHelper = require("./BoxHelper");

var _Pos = require("./positioning/Pos");

var _StrPos = require("./positioning/StrPos");

var _Replacement = require("./positioning/Replacement");

var _StringHelper = require("./helpers/StringHelper");

var _NamespaceHelper = require("./helpers/NamespaceHelper");

var _Command = require("./Command");

var indexOf = [].indexOf;
var PositionedCmdInstance = class PositionedCmdInstance extends _CmdInstance.CmdInstance {
  constructor(codewave, pos1, str1) {
    super();
    this.codewave = codewave;
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

  _checkCloser() {
    var f, noBracket;
    noBracket = this._removeBracket(this.str);

    if (noBracket.substring(0, this.codewave.closeChar.length) === this.codewave.closeChar && (f = this._findOpeningPos())) {
      this.closingPos = new _StrPos.StrPos(this.pos, this.str);
      this.pos = f.pos;
      return this.str = f.str;
    }
  }

  _findOpeningPos() {
    var closing, cmdName, f, opening;
    cmdName = this._removeBracket(this.str).substring(this.codewave.closeChar.length);
    opening = this.codewave.brakets + cmdName;
    closing = this.str;

    if (f = this.codewave.findMatchingPair(this.pos, opening, closing, -1)) {
      f.str = this.codewave.editor.textSubstr(f.pos, this.codewave.findNextBraket(f.pos + f.str.length) + this.codewave.brakets.length);
      return f;
    }
  }

  _splitComponents() {
    var parts;
    parts = this.noBracket.split(" ");
    this.cmdName = parts.shift();
    return this.rawParams = parts.join(" ");
  }

  _parseParams(params) {
    var allowedNamed, chr, i, inStr, j, name, nameToParam, param, ref;
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
        allowedNamed = this.cmd.allowedNamed;
      }

      inStr = false;
      param = '';
      name = false;

      for (i = j = 0, ref = params.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
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
        } else if (chr === ':' && !name && !inStr && (allowedNamed == null || indexOf.call(allowedNamed, name) >= 0)) {
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
  }

  _findClosing() {
    var f;

    if (f = this._findClosingPos()) {
      this.content = _StringHelper.StringHelper.trimEmptyLine(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos));
      return this.str = this.codewave.editor.textSubstr(this.pos, f.pos + f.str.length);
    }
  }

  _findClosingPos() {
    var closing, f, opening;

    if (this.closingPos != null) {
      return this.closingPos;
    }

    closing = this.codewave.brakets + this.codewave.closeChar + this.cmdName + this.codewave.brakets;
    opening = this.codewave.brakets + this.cmdName;

    if (f = this.codewave.findMatchingPair(this.pos + this.str.length, opening, closing)) {
      return this.closingPos = f;
    }
  }

  _checkElongated() {
    var endPos, max, ref;
    endPos = this.getEndPos();
    max = this.codewave.editor.textLen();

    while (endPos < max && this.codewave.editor.textSubstr(endPos, endPos + this.codewave.deco.length) === this.codewave.deco) {
      endPos += this.codewave.deco.length;
    }

    if (endPos >= max || (ref = this.codewave.editor.textSubstr(endPos, endPos + this.codewave.deco.length)) === ' ' || ref === "\n" || ref === "\r") {
      return this.str = this.codewave.editor.textSubstr(this.pos, endPos);
    }
  }

  _checkBox() {
    var cl, cr, endPos;

    if (this.codewave.inInstance != null && this.codewave.inInstance.cmd.name === 'comment') {
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
  }

  _removeCommentFromContent() {
    var ecl, ecr, ed, re1, re2, re3;

    if (this.content) {
      ecl = _StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentLeft());
      ecr = _StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentRight());
      ed = _StringHelper.StringHelper.escapeRegExp(this.codewave.deco);
      re1 = new RegExp(`^\\s*${ecl}(?:${ed})+\\s*(.*?)\\s*(?:${ed})+${ecr}$`, "gm");
      re2 = new RegExp(`^\\s*(?:${ed})*${ecr}\r?\n`);
      re3 = new RegExp(`\n\\s*${ecl}(?:${ed})*\\s*$`);
      return this.content = this.content.replace(re1, '$1').replace(re2, '').replace(re3, '');
    }
  }

  _getParentCmds() {
    var ref;
    return this.parent = (ref = this.codewave.getEnclosingCmd(this.getEndPos())) != null ? ref.init() : void 0;
  }

  setMultiPos(multiPos) {
    return this.multiPos = multiPos;
  }

  _getCmdObj() {
    this.getCmd();

    this._checkBox();

    this.content = this.removeIndentFromContent(this.content);
    return super._getCmdObj();
  }

  _initParams() {
    return this._parseParams(this.rawParams);
  }

  getContext() {
    return this.context || this.codewave.context;
  }

  getCmd() {
    if (this.cmd == null) {
      this._getParentCmds();

      if (this.noBracket.substring(0, this.codewave.noExecuteChar.length) === this.codewave.noExecuteChar) {
        this.cmd = _Command.Command.cmds.getCmd('core:no_execute');
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
  }

  getFinder(cmdName) {
    var finder;
    finder = this.codewave.context.getFinder(cmdName, {
      namespaces: this._getParentNamespaces()
    });
    finder.instance = this;
    return finder;
  }

  _getParentNamespaces() {
    var nspcs, obj;
    nspcs = [];
    obj = this;

    while (obj.parent != null) {
      obj = obj.parent;

      if (obj.cmd != null && obj.cmd.fullName != null) {
        nspcs.push(obj.cmd.fullName);
      }
    }

    return nspcs;
  }

  _removeBracket(str) {
    return str.substring(this.codewave.brakets.length, str.length - this.codewave.brakets.length);
  }

  alterAliasOf(aliasOf) {
    var cmdName, nspc;
    [nspc, cmdName] = _NamespaceHelper.NamespaceHelper.split(this.cmdName);
    return aliasOf.replace('%name%', cmdName);
  }

  isEmpty() {
    return this.str === this.codewave.brakets + this.codewave.closeChar + this.codewave.brakets || this.str === this.codewave.brakets + this.codewave.brakets;
  }

  execute() {
    var beforeFunct, res;

    if (this.isEmpty()) {
      if (this.codewave.closingPromp != null && this.codewave.closingPromp.whithinOpenBounds(this.pos + this.codewave.brakets.length) != null) {
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
          return this.replaceWith(res);
        }
      } else {
        return this.runExecuteFunct();
      }
    }
  }

  getEndPos() {
    return this.pos + this.str.length;
  }

  getPos() {
    return new _Pos.Pos(this.pos, this.pos + this.str.length).withEditor(this.codewave.editor);
  }

  getOpeningPos() {
    return new _Pos.Pos(this.pos, this.pos + this.opening.length).withEditor(this.codewave.editor);
  }

  getIndent() {
    var helper;

    if (this.indentLen == null) {
      if (this.inBox != null) {
        helper = new _BoxHelper.BoxHelper(this.context);
        this.indentLen = helper.removeComment(this.getPos().sameLinesPrefix()).length;
      } else {
        this.indentLen = this.pos - this.getPos().prevEOL();
      }
    }

    return this.indentLen;
  }

  removeIndentFromContent(text) {
    var reg;

    if (text != null) {
      reg = new RegExp('^\\s{' + this.getIndent() + '}', 'gm');
      return text.replace(reg, '');
    } else {
      return text;
    }
  }

  alterResultForBox(repl) {
    var box, helper, original, res;
    original = repl.copy();
    helper = new _BoxHelper.BoxHelper(this.context);
    helper.getOptFromLine(original.textWithFullLines(), false);

    if (this.getOption('replaceBox')) {
      box = helper.getBoxForPos(original);
      [repl.start, repl.end] = [box.start, box.end];
      this.indentLen = helper.indent;
      repl.text = this.applyIndent(repl.text);
    } else {
      repl.text = this.applyIndent(repl.text);
      repl.start = original.prevEOL();
      repl.end = original.nextEOL();
      res = helper.reformatLines(original.sameLinesPrefix() + this.codewave.marker + repl.text + this.codewave.marker + original.sameLinesSuffix(), {
        multiline: false
      });
      [repl.prefix, repl.text, repl.suffix] = res.split(this.codewave.marker);
    }

    return repl;
  }

  getCursorFromResult(repl) {
    var cursorPos, p;
    cursorPos = repl.resPosBeforePrefix();

    if (this.cmd != null && this.codewave.checkCarret && this.getOption('checkCarret')) {
      if ((p = this.codewave.getCarretPos(repl.text)) != null) {
        cursorPos = repl.start + repl.prefix.length + p;
      }

      repl.text = this.codewave.removeCarret(repl.text);
    }

    return cursorPos;
  }

  checkMulti(repl) {
    var i, j, len, newRepl, originalPos, originalText, pos, ref, replacements;

    if (this.multiPos != null && this.multiPos.length > 1) {
      replacements = [repl];
      originalText = repl.originalText();
      ref = this.multiPos;

      for (i = j = 0, len = ref.length; j < len; i = ++j) {
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
  }

  replaceWith(text) {
    return this.applyReplacement(new _Replacement.Replacement(this.pos, this.getEndPos(), text));
  }

  applyReplacement(repl) {
    var cursorPos, replacements;
    repl.withEditor(this.codewave.editor);

    if (this.inBox != null) {
      this.alterResultForBox(repl);
    } else {
      repl.text = this.applyIndent(repl.text);
    }

    cursorPos = this.getCursorFromResult(repl);
    repl.selections = [new _Pos.Pos(cursorPos, cursorPos)];
    replacements = this.checkMulti(repl);
    this.replaceStart = repl.start;
    this.replaceEnd = repl.resEnd();
    return this.codewave.editor.applyReplacements(replacements);
  }

};
exports.PositionedCmdInstance = PositionedCmdInstance;
//# sourceMappingURL=maps/PositionedCmdInstance.js.map
