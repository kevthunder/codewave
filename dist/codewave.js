(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringHelper = require("./helpers/StringHelper").StringHelper;

var ArrayHelper = require("./helpers/ArrayHelper").ArrayHelper;

var Pair = require("./positioning/Pair").Pair;

var BoxHelper =
/*#__PURE__*/
function () {
  function BoxHelper(context) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, BoxHelper);

    var key, ref, val;
    this.context = context;
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

  _createClass(BoxHelper, [{
    key: "clone",
    value: function clone(text) {
      var key, opt, ref, val;
      opt = {};
      ref = this.defaults;

      for (key in ref) {
        val = ref[key];
        opt[key] = this[key];
      }

      return new BoxHelper(this.context, opt);
    }
  }, {
    key: "draw",
    value: function draw(text) {
      return this.startSep() + "\n" + this.lines(text) + "\n" + this.endSep();
    }
  }, {
    key: "wrapComment",
    value: function wrapComment(str) {
      return this.context.wrapComment(str);
    }
  }, {
    key: "separator",
    value: function separator() {
      var len;
      len = this.width + 2 * this.pad + 2 * this.deco.length;
      return this.wrapComment(this.decoLine(len));
    }
  }, {
    key: "startSep",
    value: function startSep() {
      var ln;
      ln = this.width + 2 * this.pad + 2 * this.deco.length - this.openText.length;
      return this.prefix + this.wrapComment(this.openText + this.decoLine(ln));
    }
  }, {
    key: "endSep",
    value: function endSep() {
      var ln;
      ln = this.width + 2 * this.pad + 2 * this.deco.length - this.closeText.length;
      return this.wrapComment(this.closeText + this.decoLine(ln)) + this.suffix;
    }
  }, {
    key: "decoLine",
    value: function decoLine(len) {
      return StringHelper.repeatToLength(this.deco, len);
    }
  }, {
    key: "padding",
    value: function padding() {
      return StringHelper.repeatToLength(" ", this.pad);
    }
  }, {
    key: "lines",
    value: function lines() {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var uptoHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var l, lines, x;
      text = text || '';
      lines = text.replace(/\r/g, '').split("\n");

      if (uptoHeight) {
        return function () {
          var i, ref, results;
          results = [];

          for (x = i = 0, ref = this.height; 0 <= ref ? i <= ref : i >= ref; x = 0 <= ref ? ++i : --i) {
            results.push(this.line(lines[x] || ''));
          }

          return results;
        }.call(this).join('\n');
      } else {
        return function () {
          var i, len1, results;
          results = [];

          for (i = 0, len1 = lines.length; i < len1; i++) {
            l = lines[i];
            results.push(this.line(l));
          }

          return results;
        }.call(this).join('\n');
      }
    }
  }, {
    key: "line",
    value: function line() {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return StringHelper.repeatToLength(" ", this.indent) + this.wrapComment(this.deco + this.padding() + text + StringHelper.repeatToLength(" ", this.width - this.removeIgnoredContent(text).length) + this.padding() + this.deco);
    }
  }, {
    key: "left",
    value: function left() {
      return this.context.wrapCommentLeft(this.deco + this.padding());
    }
  }, {
    key: "right",
    value: function right() {
      return this.context.wrapCommentRight(this.padding() + this.deco);
    }
  }, {
    key: "removeIgnoredContent",
    value: function removeIgnoredContent(text) {
      return this.context.codewave.removeMarkers(this.context.codewave.removeCarret(text));
    }
  }, {
    key: "textBounds",
    value: function textBounds(text) {
      return StringHelper.getTxtSize(this.removeIgnoredContent(text));
    }
  }, {
    key: "getBoxForPos",
    value: function getBoxForPos(pos) {
      var _this = this;

      var clone, curLeft, depth, endFind, left, pair, placeholder, res, startFind;
      depth = this.getNestedLvl(pos.start);

      if (depth > 0) {
        left = this.left();
        curLeft = StringHelper.repeat(left, depth - 1);
        clone = this.clone();
        placeholder = "###PlaceHolder###";
        clone.width = placeholder.length;
        clone.openText = clone.closeText = this.deco + this.deco + placeholder + this.deco + this.deco;
        startFind = RegExp(StringHelper.escapeRegExp(curLeft + clone.startSep()).replace(placeholder, '.*'));
        endFind = RegExp(StringHelper.escapeRegExp(curLeft + clone.endSep()).replace(placeholder, '.*'));
        pair = new Pair(startFind, endFind, {
          validMatch: function validMatch(match) {
            var f; // console.log(match,left)

            f = _this.context.codewave.findAnyNext(match.start(), [left, "\n", "\r"], -1);
            return f == null || f.str !== left;
          }
        });
        res = pair.wrapperPos(pos, this.context.codewave.editor.text());

        if (res != null) {
          res.start += curLeft.length;
          return res;
        }
      }
    }
  }, {
    key: "getNestedLvl",
    value: function getNestedLvl(index) {
      var depth, f, left;
      depth = 0;
      left = this.left();

      while ((f = this.context.codewave.findAnyNext(index, [left, "\n", "\r"], -1)) != null && f.str === left) {
        index = f.pos;
        depth++;
      }

      return depth;
    }
  }, {
    key: "getOptFromLine",
    value: function getOptFromLine(line) {
      var getPad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var endPos, rEnd, rStart, resEnd, resStart, startPos;
      rStart = new RegExp("(\\s*)(" + StringHelper.escapeRegExp(this.context.wrapCommentLeft(this.deco)) + ")(\\s*)");
      rEnd = new RegExp("(\\s*)(" + StringHelper.escapeRegExp(this.context.wrapCommentRight(this.deco)) + ")(\n|$)");
      resStart = rStart.exec(line);
      resEnd = rEnd.exec(line);

      if (resStart != null && resEnd != null) {
        if (getPad) {
          this.pad = Math.min(resStart[3].length, resEnd[1].length);
        }

        this.indent = resStart[1].length;
        startPos = resStart.index + resStart[1].length + resStart[2].length + this.pad;
        endPos = resEnd.index + resEnd[1].length - this.pad;
        this.width = endPos - startPos;
      }

      return this;
    }
  }, {
    key: "reformatLines",
    value: function reformatLines(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.lines(this.removeComment(text, options), false);
    }
  }, {
    key: "removeComment",
    value: function removeComment(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var defaults, ecl, ecr, ed, flag, opt, re1, re2;

      if (text != null) {
        defaults = {
          multiline: true
        };
        opt = Object.assign({}, defaults, options);
        ecl = StringHelper.escapeRegExp(this.context.wrapCommentLeft());
        ecr = StringHelper.escapeRegExp(this.context.wrapCommentRight());
        ed = StringHelper.escapeRegExp(this.deco);
        flag = options['multiline'] ? 'gm' : '';
        re1 = new RegExp("^\\s*".concat(ecl, "(?:").concat(ed, ")*\\s{0,").concat(this.pad, "}"), flag);
        re2 = new RegExp("\\s*(?:".concat(ed, ")*").concat(ecr, "\\s*$"), flag);
        return text.replace(re1, '').replace(re2, '');
      }
    }
  }]);

  return BoxHelper;
}();

exports.BoxHelper = BoxHelper;

},{"./helpers/ArrayHelper":29,"./helpers/StringHelper":34,"./positioning/Pair":35}],2:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PosCollection = require("./positioning/PosCollection").PosCollection;

var Replacement = require("./positioning/Replacement").Replacement;

var Pos = require("./positioning/Pos").Pos;

var OptionalPromise = require("./helpers/OptionalPromise");

var ClosingPromp =
/*#__PURE__*/
function () {
  function ClosingPromp(codewave1, selections) {
    _classCallCheck(this, ClosingPromp);

    this.codewave = codewave1;
    this.timeout = null;
    this._typed = null;
    this.started = false;
    this.nbChanges = 0;
    this.selections = new PosCollection(selections);
  }

  _createClass(ClosingPromp, [{
    key: "begin",
    value: function begin() {
      var _this = this;

      this.started = true;
      return (0, OptionalPromise.optionalPromise)(this.addCarrets()).then(function () {
        if (_this.codewave.editor.canListenToChange()) {
          _this.proxyOnChange = function () {
            var ch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            return _this.onChange(ch);
          };

          _this.codewave.editor.addChangeListener(_this.proxyOnChange);
        }

        return _this;
      }).result();
    }
  }, {
    key: "addCarrets",
    value: function addCarrets() {
      this.replacements = this.selections.wrap(this.codewave.brakets + this.codewave.carretChar + this.codewave.brakets + "\n", "\n" + this.codewave.brakets + this.codewave.closeChar + this.codewave.carretChar + this.codewave.brakets).map(function (p) {
        return p.carretToSel();
      });
      return this.codewave.editor.applyReplacements(this.replacements);
    }
  }, {
    key: "invalidTyped",
    value: function invalidTyped() {
      return this._typed = null;
    }
  }, {
    key: "onChange",
    value: function onChange() {
      var ch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
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
    }
  }, {
    key: "skipEvent",
    value: function skipEvent(ch) {
      return ch != null && ch.charCodeAt(0) !== 32;
    }
  }, {
    key: "resume",
    value: function resume() {}
  }, {
    key: "shouldStop",
    value: function shouldStop() {
      return this.typed() === false || this.typed().indexOf(' ') !== -1;
    }
  }, {
    key: "cleanClose",
    value: function cleanClose() {
      var end, j, len, repl, replacements, res, sel, selections, start;
      replacements = [];
      selections = this.getSelections();

      for (j = 0, len = selections.length; j < len; j++) {
        sel = selections[j];
        var pos = this.whithinOpenBounds(sel);

        if (pos) {
          start = sel;
        } else if ((end = this.whithinCloseBounds(sel)) && start != null) {
          res = end.withEditor(this.codewave.editor).innerText().split(' ')[0];
          repl = new Replacement(end.innerStart, end.innerEnd, res);
          repl.selections = [start];
          replacements.push(repl);
          start = null;
        }
      }

      return this.codewave.editor.applyReplacements(replacements);
    }
  }, {
    key: "getSelections",
    value: function getSelections() {
      return this.codewave.editor.getMultiSel();
    }
  }, {
    key: "stop",
    value: function stop() {
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
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.typed() !== false) {
        this.cancelSelections(this.getSelections());
      }

      return this.stop();
    }
  }, {
    key: "cancelSelections",
    value: function cancelSelections(selections) {
      var end, j, len, replacements, sel, start;
      replacements = [];
      start = null;

      for (j = 0, len = selections.length; j < len; j++) {
        sel = selections[j];
        var pos = this.whithinOpenBounds(sel);

        if (pos) {
          start = pos;
        } else if ((end = this.whithinCloseBounds(sel)) && start != null) {
          replacements.push(new Replacement(start.start, end.end, this.codewave.editor.textSubstr(start.end + 1, end.start - 1)).selectContent());
          start = null;
        }
      }

      return this.codewave.editor.applyReplacements(replacements);
    }
  }, {
    key: "typed",
    value: function typed() {
      var cpos, innerEnd, innerStart;

      if (this._typed == null) {
        cpos = this.codewave.editor.getCursorPos();
        innerStart = this.replacements[0].start + this.codewave.brakets.length;

        if (this.codewave.findPrevBraket(cpos.start) === this.replacements[0].start && (innerEnd = this.codewave.findNextBraket(innerStart)) != null && innerEnd >= cpos.end) {
          this._typed = this.codewave.editor.textSubstr(innerStart, innerEnd);
        } else {
          this._typed = false;
        }
      }

      return this._typed;
    }
  }, {
    key: "whithinOpenBounds",
    value: function whithinOpenBounds(pos) {
      var i, j, len, ref, repl, targetPos, targetText;
      ref = this.replacements;

      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        repl = ref[i];
        targetPos = this.startPosAt(i);
        targetText = this.codewave.brakets + this.typed() + this.codewave.brakets;

        if (targetPos.innerContainsPos(pos) && targetPos.withEditor(this.codewave.editor).text() === targetText) {
          return targetPos;
        }
      }

      return false;
    }
  }, {
    key: "whithinCloseBounds",
    value: function whithinCloseBounds(pos) {
      var i, j, len, ref, repl, targetPos, targetText;
      ref = this.replacements;

      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        repl = ref[i];
        targetPos = this.endPosAt(i);
        targetText = this.codewave.brakets + this.codewave.closeChar + this.typed() + this.codewave.brakets;

        if (targetPos.innerContainsPos(pos) && targetPos.withEditor(this.codewave.editor).text() === targetText) {
          return targetPos;
        }
      }

      return false;
    }
  }, {
    key: "startPosAt",
    value: function startPosAt(index) {
      return new Pos(this.replacements[index].selections[0].start + this.typed().length * (index * 2), this.replacements[index].selections[0].end + this.typed().length * (index * 2 + 1)).wrappedBy(this.codewave.brakets, this.codewave.brakets);
    }
  }, {
    key: "endPosAt",
    value: function endPosAt(index) {
      return new Pos(this.replacements[index].selections[1].start + this.typed().length * (index * 2 + 1), this.replacements[index].selections[1].end + this.typed().length * (index * 2 + 2)).wrappedBy(this.codewave.brakets + this.codewave.closeChar, this.codewave.brakets);
    }
  }]);

  return ClosingPromp;
}();

exports.ClosingPromp = ClosingPromp;

var SimulatedClosingPromp =
/*#__PURE__*/
function (_ClosingPromp) {
  _inherits(SimulatedClosingPromp, _ClosingPromp);

  function SimulatedClosingPromp() {
    _classCallCheck(this, SimulatedClosingPromp);

    return _possibleConstructorReturn(this, _getPrototypeOf(SimulatedClosingPromp).apply(this, arguments));
  }

  _createClass(SimulatedClosingPromp, [{
    key: "resume",
    value: function resume() {
      return this.simulateType();
    }
  }, {
    key: "simulateType",
    value: function simulateType() {
      var _this2 = this;

      if (this.timeout != null) {
        clearTimeout(this.timeout);
      }

      return this.timeout = setTimeout(function () {
        var curClose, repl, targetText;

        _this2.invalidTyped();

        targetText = _this2.codewave.brakets + _this2.codewave.closeChar + _this2.typed() + _this2.codewave.brakets;
        curClose = _this2.whithinCloseBounds(_this2.replacements[0].selections[1].copy().applyOffset(_this2.typed().length));

        if (curClose) {
          repl = new Replacement(curClose.start, curClose.end, targetText);

          if (repl.withEditor(_this2.codewave.editor).necessary()) {
            _this2.codewave.editor.applyReplacements([repl]);
          }
        } else {
          _this2.stop();
        }

        if (_this2.onTypeSimulated != null) {
          return _this2.onTypeSimulated();
        }
      }, 2);
    }
  }, {
    key: "skipEvent",
    value: function skipEvent() {
      return false;
    }
  }, {
    key: "getSelections",
    value: function getSelections() {
      return [this.codewave.editor.getCursorPos(), this.replacements[0].selections[1] + this.typed().length];
    }
  }, {
    key: "whithinCloseBounds",
    value: function whithinCloseBounds(pos) {
      var i, j, len, next, ref, repl, targetPos;
      ref = this.replacements;

      for (i = j = 0, len = ref.length; j < len; i = ++j) {
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
    }
  }]);

  return SimulatedClosingPromp;
}(ClosingPromp);

exports.SimulatedClosingPromp = SimulatedClosingPromp;

ClosingPromp.newFor = function (codewave, selections) {
  if (codewave.editor.allowMultiSelection()) {
    return new ClosingPromp(codewave, selections);
  } else {
    return new SimulatedClosingPromp(codewave, selections);
  }
};

},{"./helpers/OptionalPromise":32,"./positioning/Pos":37,"./positioning/PosCollection":38,"./positioning/Replacement":39}],3:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Context = require("./Context").Context;

var NamespaceHelper = require("./helpers/NamespaceHelper").NamespaceHelper;

var Command = require("./Command").Command;

var indexOf = [].indexOf;

var CmdFinder =
/*#__PURE__*/
function () {
  function CmdFinder(names, options) {
    _classCallCheck(this, CmdFinder);

    var defaults, key, val;

    if (typeof names === 'string') {
      names = [names];
    }

    defaults = {
      parent: null,
      namespaces: [],
      parentContext: null,
      context: null,
      root: Command.cmds,
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
      } else if (this.parent != null && key !== 'parent') {
        this[key] = this.parent[key];
      } else {
        this[key] = val;
      }
    }

    if (this.context == null) {
      this.context = new Context(this.codewave);
    }

    if (this.parentContext != null) {
      this.context.parent = this.parentContext;
    }

    if (this.namespaces != null) {
      this.context.addNamespaces(this.namespaces);
    }
  }

  _createClass(CmdFinder, [{
    key: "find",
    value: function find() {
      this.triggerDetectors();
      this.cmd = this.findIn(this.root);
      return this.cmd;
    } //  getPosibilities: ->
    //    @triggerDetectors()
    //    path = list(@path)
    //    return @findPosibilitiesIn(@root,path)

  }, {
    key: "getNamesWithPaths",
    value: function getNamesWithPaths() {
      var j, len, name, paths, ref, rest, space;
      paths = {};
      ref = this.names;

      for (j = 0, len = ref.length; j < len; j++) {
        name = ref[j];

        var _NamespaceHelper$spli = NamespaceHelper.splitFirst(name);

        var _NamespaceHelper$spli2 = _slicedToArray(_NamespaceHelper$spli, 2);

        space = _NamespaceHelper$spli2[0];
        rest = _NamespaceHelper$spli2[1];

        if (space != null && !(indexOf.call(this.context.getNameSpaces(), space) >= 0)) {
          if (!(space in paths)) {
            paths[space] = [];
          }

          paths[space].push(rest);
        }
      }

      return paths;
    }
  }, {
    key: "applySpaceOnNames",
    value: function applySpaceOnNames(namespace) {
      var rest, space;

      var _NamespaceHelper$spli3 = NamespaceHelper.splitFirst(namespace, true);

      var _NamespaceHelper$spli4 = _slicedToArray(_NamespaceHelper$spli3, 2);

      space = _NamespaceHelper$spli4[0];
      rest = _NamespaceHelper$spli4[1];
      return this.names.map(function (name) {
        var cur_rest, cur_space;

        var _NamespaceHelper$spli5 = NamespaceHelper.splitFirst(name);

        var _NamespaceHelper$spli6 = _slicedToArray(_NamespaceHelper$spli5, 2);

        cur_space = _NamespaceHelper$spli6[0];
        cur_rest = _NamespaceHelper$spli6[1];

        if (cur_space != null && cur_space === space) {
          name = cur_rest;
        }

        if (rest != null) {
          name = rest + ':' + name;
        }

        return name;
      });
    }
  }, {
    key: "getDirectNames",
    value: function getDirectNames() {
      var n;
      return function () {
        var j, len, ref, results;
        ref = this.names;
        results = [];

        for (j = 0, len = ref.length; j < len; j++) {
          n = ref[j];

          if (n.indexOf(":") === -1) {
            results.push(n);
          }
        }

        return results;
      }.call(this);
    }
  }, {
    key: "triggerDetectors",
    value: function triggerDetectors() {
      var cmd, detector, i, j, len, posibilities, ref, res, results;

      if (this.useDetectors) {
        this.useDetectors = false;
        posibilities = [this.root].concat(new CmdFinder(this.context.getNameSpaces(), {
          parent: this,
          mustExecute: false,
          useFallbacks: false
        }).findPosibilities());
        i = 0;
        results = [];

        while (i < posibilities.length) {
          cmd = posibilities[i];
          ref = cmd.detectors;

          for (j = 0, len = ref.length; j < len; j++) {
            detector = ref[j];
            res = detector.detect(this);

            if (res != null) {
              this.context.addNamespaces(res);
              posibilities = posibilities.concat(new CmdFinder(res, {
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
    }
  }, {
    key: "findIn",
    value: function findIn(cmd) {
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var best;

      if (cmd == null) {
        return null;
      }

      best = this.bestInPosibilities(this.findPosibilities());

      if (best != null) {
        return best;
      }
    }
  }, {
    key: "findPosibilities",
    value: function findPosibilities() {
      var direct, fallback, j, k, len, len1, name, names, nspc, nspcName, posibilities, ref, ref1, ref2, ref3, ref4, rest, space;

      if (this.root == null) {
        return [];
      }

      this.root.init();
      posibilities = [];

      if (((ref = this.codewave) != null ? (ref1 = ref.inInstance) != null ? ref1.cmd : void 0 : void 0) === this.root) {
        posibilities = posibilities.concat(this.getPosibilitiesFromCommand('in_instance'));
      }

      ref2 = this.getNamesWithPaths();

      for (space in ref2) {
        names = ref2[space];
        posibilities = posibilities.concat(this.getPosibilitiesFromCommand(space, names));
      }

      ref3 = this.context.getNameSpaces();

      for (j = 0, len = ref3.length; j < len; j++) {
        nspc = ref3[j];

        var _NamespaceHelper$spli7 = NamespaceHelper.splitFirst(nspc, true);

        var _NamespaceHelper$spli8 = _slicedToArray(_NamespaceHelper$spli7, 2);

        nspcName = _NamespaceHelper$spli8[0];
        rest = _NamespaceHelper$spli8[1];
        posibilities = posibilities.concat(this.getPosibilitiesFromCommand(nspcName, this.applySpaceOnNames(nspc)));
      }

      ref4 = this.getDirectNames();

      for (k = 0, len1 = ref4.length; k < len1; k++) {
        name = ref4[k];
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
    }
  }, {
    key: "getPosibilitiesFromCommand",
    value: function getPosibilitiesFromCommand(cmdName) {
      var names = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.names;
      var j, len, next, nexts, posibilities;
      posibilities = [];
      nexts = this.getCmdFollowAlias(cmdName);

      for (j = 0, len = nexts.length; j < len; j++) {
        next = nexts[j];
        posibilities = posibilities.concat(new CmdFinder(names, {
          parent: this,
          root: next
        }).findPosibilities());
      }

      return posibilities;
    }
  }, {
    key: "getCmdFollowAlias",
    value: function getCmdFollowAlias(name) {
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
    }
  }, {
    key: "cmdIsValid",
    value: function cmdIsValid(cmd) {
      if (cmd == null) {
        return false;
      }

      if (cmd.name !== 'fallback' && indexOf.call(this.ancestors(), cmd) >= 0) {
        return false;
      }

      return !this.mustExecute || this.cmdIsExecutable(cmd);
    }
  }, {
    key: "ancestors",
    value: function ancestors() {
      var ref;

      if (((ref = this.codewave) != null ? ref.inInstance : void 0) != null) {
        return this.codewave.inInstance.ancestorCmdsAndSelf();
      }

      return [];
    }
  }, {
    key: "cmdIsExecutable",
    value: function cmdIsExecutable(cmd) {
      var names;
      names = this.getDirectNames();

      if (names.length === 1) {
        return cmd.init().isExecutableWithName(names[0]);
      } else {
        return cmd.init().isExecutable();
      }
    }
  }, {
    key: "cmdScore",
    value: function cmdScore(cmd) {
      var score;
      score = cmd.depth;

      if (cmd.name === 'fallback') {
        score -= 1000;
      }

      return score;
    }
  }, {
    key: "bestInPosibilities",
    value: function bestInPosibilities(poss) {
      var best, bestScore, j, len, p, score;

      if (poss.length > 0) {
        best = null;
        bestScore = null;

        for (j = 0, len = poss.length; j < len; j++) {
          p = poss[j];
          score = this.cmdScore(p);

          if (best == null || score >= bestScore) {
            bestScore = score;
            best = p;
          }
        }

        return best;
      }
    }
  }]);

  return CmdFinder;
}();

exports.CmdFinder = CmdFinder;

},{"./Command":6,"./Context":7,"./helpers/NamespaceHelper":31}],4:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Context = require("./Context").Context;

var TextParser = require("./TextParser").TextParser;

var StringHelper = require("./helpers/StringHelper").StringHelper;

var OptionalPromise = require("./helpers/OptionalPromise");

var CmdInstance =
/*#__PURE__*/
function () {
  function CmdInstance(cmd1, context) {
    _classCallCheck(this, CmdInstance);

    this.cmd = cmd1;
    this.context = context;
  }

  _createClass(CmdInstance, [{
    key: "init",
    value: function init() {
      if (!(this.isEmpty() || this.inited)) {
        this.inited = true;

        this._getCmdObj();

        this._initParams();

        if (this.cmdObj != null) {
          this.cmdObj.init();
        }
      }

      return this;
    }
  }, {
    key: "setParam",
    value: function setParam(name, val) {
      return this.named[name] = val;
    }
  }, {
    key: "pushParam",
    value: function pushParam(val) {
      return this.params.push(val);
    }
  }, {
    key: "getContext",
    value: function getContext() {
      if (this.context == null) {
        this.context = new Context();
      }

      return this.context || new Context();
    }
  }, {
    key: "getFinder",
    value: function getFinder(cmdName) {
      var finder;
      finder = this.getContext().getFinder(cmdName, {
        namespaces: this._getParentNamespaces()
      });
      finder.instance = this;
      return finder;
    }
  }, {
    key: "_getCmdObj",
    value: function _getCmdObj() {
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
    }
  }, {
    key: "_initParams",
    value: function _initParams() {
      return this.named = this.getDefaults();
    }
  }, {
    key: "_getParentNamespaces",
    value: function _getParentNamespaces() {
      return [];
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.cmd != null;
    }
  }, {
    key: "resultIsAvailable",
    value: function resultIsAvailable() {
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
    }
  }, {
    key: "getDefaults",
    value: function getDefaults() {
      var aliased, res;

      if (this.cmd != null) {
        res = {};
        aliased = this.getAliased();

        if (aliased != null) {
          res = Object.assign(res, aliased.getDefaults());
        }

        res = Object.assign(res, this.cmd.defaults);

        if (this.cmdObj != null) {
          res = Object.assign(res, this.cmdObj.getDefaults());
        }

        return res;
      } else {
        return {};
      }
    }
  }, {
    key: "getAliased",
    value: function getAliased() {
      if (this.cmd != null) {
        if (this.aliasedCmd == null) {
          this.getAliasedFinal();
        }

        return this.aliasedCmd || null;
      }
    }
  }, {
    key: "getAliasedFinal",
    value: function getAliasedFinal() {
      var aliased;

      if (this.cmd != null) {
        if (this.aliasedFinalCmd != null) {
          return this.aliasedFinalCmd || null;
        }

        if (this.cmd.aliasOf != null) {
          aliased = this.cmd;

          while (aliased != null && aliased.aliasOf != null) {
            aliased = aliased._aliasedFromFinder(this.getFinder(this.alterAliasOf(aliased.aliasOf)));

            if (this.aliasedCmd == null) {
              this.aliasedCmd = aliased || false;
            }
          }

          this.aliasedFinalCmd = aliased || false;
          return aliased;
        }
      }
    }
  }, {
    key: "alterAliasOf",
    value: function alterAliasOf(aliasOf) {
      return aliasOf;
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      var opt;

      if (this.cmd != null) {
        if (this.cmdOptions != null) {
          return this.cmdOptions;
        }

        opt = this.cmd._optionsForAliased(this.getAliased());

        if (this.cmdObj != null) {
          opt = Object.assign(opt, this.cmdObj.getOptions());
        }

        this.cmdOptions = opt;
        return opt;
      }
    }
  }, {
    key: "getOption",
    value: function getOption(key) {
      var options;
      options = this.getOptions();

      if (options != null && key in options) {
        return options[key];
      }
    }
  }, {
    key: "getParam",
    value: function getParam(names) {
      var defVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var i, len, n, ref;

      if ((ref = _typeof(names)) === 'string' || ref === 'number') {
        names = [names];
      }

      for (i = 0, len = names.length; i < len; i++) {
        n = names[i];

        if (this.named[n] != null) {
          return this.named[n];
        }

        if (this.params[n] != null) {
          return this.params[n];
        }
      }

      return defVal;
    }
  }, {
    key: "getBoolParam",
    value: function getBoolParam(names) {
      var defVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var falseVals, val;
      falseVals = ["", "0", "false", "no", "none", false, null, 0];
      val = this.getParam(names, defVal);
      return !falseVals.includes(val);
    }
  }, {
    key: "ancestorCmds",
    value: function ancestorCmds() {
      var ref;

      if (((ref = this.context.codewave) != null ? ref.inInstance : void 0) != null) {
        return this.context.codewave.inInstance.ancestorCmdsAndSelf();
      }

      return [];
    }
  }, {
    key: "ancestorCmdsAndSelf",
    value: function ancestorCmdsAndSelf() {
      return this.ancestorCmds().concat([this.cmd]);
    }
  }, {
    key: "runExecuteFunct",
    value: function runExecuteFunct() {
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
    }
  }, {
    key: "rawResult",
    value: function rawResult() {
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
    }
  }, {
    key: "result",
    value: function result() {
      var _this = this;

      this.init();

      if (this.resultIsAvailable()) {
        return (0, OptionalPromise.optionalPromise)(this.rawResult()).then(function (res) {
          var parser;

          if (res != null) {
            res = _this.formatIndent(res);

            if (res.length > 0 && _this.getOption('parse', _this)) {
              parser = _this.getParserForText(res);
              res = parser.parseAll();
            }

            var alterFunct = _this.getOption('alterResult', _this);

            if (alterFunct) {
              res = alterFunct(res, _this);
            }

            return res;
          }
        }).result();
      }
    }
  }, {
    key: "getParserForText",
    value: function getParserForText() {
      var txt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var parser;
      parser = this.context.codewave.newInstance(new TextParser(txt), {
        inInstance: this
      });
      parser.checkCarret = false;
      return parser;
    }
  }, {
    key: "getIndent",
    value: function getIndent() {
      return 0;
    }
  }, {
    key: "formatIndent",
    value: function formatIndent(text) {
      if (text != null) {
        return text.replace(/\t/g, '  ');
      } else {
        return text;
      }
    }
  }, {
    key: "applyIndent",
    value: function applyIndent(text) {
      return StringHelper.indentNotFirst(text, this.getIndent(), " ");
    }
  }]);

  return CmdInstance;
}();

exports.CmdInstance = CmdInstance;

},{"./Context":7,"./TextParser":16,"./helpers/OptionalPromise":32,"./helpers/StringHelper":34}],5:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Process = require("./Process").Process;

var Context = require("./Context").Context;

var PositionedCmdInstance = require("./PositionedCmdInstance").PositionedCmdInstance;

var TextParser = require("./TextParser").TextParser;

var Command = require("./Command").Command;

var Logger = require("./Logger").Logger;

var PosCollection = require("./positioning/PosCollection").PosCollection;

var StringHelper = require("./helpers/StringHelper").StringHelper;

var ClosingPromp = require("./ClosingPromp").ClosingPromp;

var Codewave = function () {
  var Codewave =
  /*#__PURE__*/
  function () {
    function Codewave(editor) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Codewave);

      var defaults, key, val;
      this.editor = editor;
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
        } else if (this.parent != null && key !== 'parent') {
          this[key] = this.parent[key];
        } else {
          this[key] = val;
        }
      }

      if (this.editor != null) {
        this.editor.bindedTo(this);
      }

      this.context = new Context(this);

      if (this.inInstance != null) {
        this.context.parent = this.inInstance.context;
      }

      this.logger = new Logger();
    }

    _createClass(Codewave, [{
      key: "onActivationKey",
      value: function onActivationKey() {
        var _this = this;

        this.process = new Process();
        this.logger.log('activation key');
        return this.runAtCursorPos().then(function () {
          return _this.process = null;
        });
      }
    }, {
      key: "runAtCursorPos",
      value: function runAtCursorPos() {
        if (this.editor.allowMultiSelection()) {
          return this.runAtMultiPos(this.editor.getMultiSel());
        } else {
          return this.runAtPos(this.editor.getCursorPos());
        }
      }
    }, {
      key: "runAtPos",
      value: function runAtPos(pos) {
        if (pos == null) {
          throw new Error('Cursor Position is empty');
        }

        return this.runAtMultiPos([pos]);
      }
    }, {
      key: "runAtMultiPos",
      value: function runAtMultiPos(multiPos) {
        var _this2 = this;

        return Promise.resolve().then(function () {
          var cmd;

          if (multiPos.length > 0) {
            cmd = _this2.commandOnPos(multiPos[0].end);

            if (cmd != null) {
              if (multiPos.length > 1) {
                cmd.setMultiPos(multiPos);
              }

              cmd.init();

              _this2.logger.log(cmd);

              return cmd.execute();
            } else {
              if (multiPos[0].start === multiPos[0].end) {
                return _this2.addBrakets(multiPos);
              } else {
                return _this2.promptClosingCmd(multiPos);
              }
            }
          }
        });
      }
    }, {
      key: "commandOnPos",
      value: function commandOnPos(pos) {
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

          if (next == null || this.countPrevBraket(prev) % 2 !== 0) {
            return null;
          }
        }

        return new PositionedCmdInstance(this, prev, this.editor.textSubstr(prev, next + this.brakets.length));
      }
    }, {
      key: "nextCmd",
      value: function nextCmd() {
        var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var beginning, f, pos;
        pos = start;

        while (f = this.findAnyNext(pos, [this.brakets, "\n"])) {
          pos = f.pos + f.str.length;

          if (f.str === this.brakets) {
            if (typeof beginning !== "undefined" && beginning !== null) {
              return new PositionedCmdInstance(this, beginning, this.editor.textSubstr(beginning, f.pos + this.brakets.length));
            } else {
              beginning = f.pos;
            }
          } else {
            beginning = null;
          }
        }

        return null;
      }
    }, {
      key: "getEnclosingCmd",
      value: function getEnclosingCmd() {
        var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var closingPrefix, cpos, p;
        cpos = pos;
        closingPrefix = this.brakets + this.closeChar;

        while ((p = this.findNext(cpos, closingPrefix)) != null) {
          var cmd = this.commandOnPos(p + closingPrefix.length);

          if (cmd) {
            cpos = cmd.getEndPos();

            if (cmd.pos < pos) {
              return cmd;
            }
          } else {
            cpos = p + closingPrefix.length;
          }
        }

        return null;
      }
    }, {
      key: "precededByBrakets",
      value: function precededByBrakets(pos) {
        return this.editor.textSubstr(pos - this.brakets.length, pos) === this.brakets;
      }
    }, {
      key: "followedByBrakets",
      value: function followedByBrakets(pos) {
        return this.editor.textSubstr(pos, pos + this.brakets.length) === this.brakets;
      }
    }, {
      key: "countPrevBraket",
      value: function countPrevBraket(start) {
        var i;
        i = 0;

        while ((start = this.findPrevBraket(start)) != null) {
          i++;
        }

        return i;
      }
    }, {
      key: "isEndLine",
      value: function isEndLine(pos) {
        return this.editor.textSubstr(pos, pos + 1) === "\n" || pos + 1 >= this.editor.textLen();
      }
    }, {
      key: "findPrevBraket",
      value: function findPrevBraket(start) {
        return this.findNextBraket(start, -1);
      }
    }, {
      key: "findNextBraket",
      value: function findNextBraket(start) {
        var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var f;
        f = this.findAnyNext(start, [this.brakets, "\n"], direction);

        if (f && f.str === this.brakets) {
          return f.pos;
        }
      }
    }, {
      key: "findPrev",
      value: function findPrev(start, string) {
        return this.findNext(start, string, -1);
      }
    }, {
      key: "findNext",
      value: function findNext(start, string) {
        var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var f;
        f = this.findAnyNext(start, [string], direction);

        if (f) {
          return f.pos;
        }
      }
    }, {
      key: "findAnyNext",
      value: function findAnyNext(start, strings) {
        var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        return this.editor.findAnyNext(start, strings, direction);
      }
    }, {
      key: "findMatchingPair",
      value: function findMatchingPair(startPos, opening, closing) {
        var direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var f, nested, pos;
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
      }
    }, {
      key: "addBrakets",
      value: function addBrakets(pos) {
        var replacements;
        pos = new PosCollection(pos);
        replacements = pos.wrap(this.brakets, this.brakets).map(function (r) {
          return r.selectContent();
        });
        return this.editor.applyReplacements(replacements);
      }
    }, {
      key: "promptClosingCmd",
      value: function promptClosingCmd(selections) {
        if (this.closingPromp != null) {
          this.closingPromp.stop();
        }

        return this.closingPromp = ClosingPromp.newFor(this, selections).begin();
      }
    }, {
      key: "newInstance",
      value: function newInstance(editor, options) {
        return new Codewave(editor, options);
      }
    }, {
      key: "parseAll",
      value: function parseAll() {
        var recursive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var cmd, parser, pos, res;

        if (this.nested > 100) {
          throw "Infinite parsing Recursion";
        }

        pos = 0;

        while (cmd = this.nextCmd(pos)) {
          pos = cmd.getEndPos();
          this.editor.setCursorPos(pos); // console.log(cmd)

          cmd.init();

          if (recursive && cmd.content != null && (cmd.getCmd() == null || !cmd.getOption('preventParseAll'))) {
            parser = new Codewave(new TextParser(cmd.content), {
              parent: this
            });
            cmd.content = parser.parseAll();
          }

          res = cmd.execute();

          if (res != null) {
            if (res.then != null) {
              throw new Error('Async nested commands are not supported');
            }

            if (cmd.replaceEnd != null) {
              pos = cmd.replaceEnd;
            } else {
              pos = this.editor.getCursorPos().end;
            }
          }
        }

        return this.getText();
      }
    }, {
      key: "getText",
      value: function getText() {
        return this.editor.text();
      }
    }, {
      key: "isRoot",
      value: function isRoot() {
        return this.parent == null && (this.inInstance == null || this.inInstance.finder == null);
      }
    }, {
      key: "getRoot",
      value: function getRoot() {
        if (this.isRoot()) {
          return this;
        } else if (this.parent != null) {
          return this.parent.getRoot();
        } else if (this.inInstance != null) {
          return this.inInstance.codewave.getRoot();
        }
      }
    }, {
      key: "getFileSystem",
      value: function getFileSystem() {
        if (this.editor.fileSystem) {
          return this.editor.fileSystem;
        } else if (this.isRoot()) {
          return null;
        } else if (this.parent != null) {
          return this.parent.getRoot();
        } else if (this.inInstance != null) {
          return this.inInstance.codewave.getRoot();
        }
      }
    }, {
      key: "removeCarret",
      value: function removeCarret(txt) {
        return StringHelper.removeCarret(txt, this.carretChar);
      }
    }, {
      key: "getCarretPos",
      value: function getCarretPos(txt) {
        return StringHelper.getCarretPos(txt, this.carretChar);
      }
    }, {
      key: "regMarker",
      value: function regMarker() {
        var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "g";
        return new RegExp(StringHelper.escapeRegExp(this.marker), flags);
      }
    }, {
      key: "removeMarkers",
      value: function removeMarkers(text) {
        return text.replace(this.regMarker(), '');
      }
    }], [{
      key: "init",
      value: function init() {
        if (!this.inited) {
          this.inited = true;
          Command.initCmds();
          return Command.loadCmds();
        }
      }
    }]);

    return Codewave;
  }();

  ;
  Codewave.inited = false;
  return Codewave;
}.call(void 0);

exports.Codewave = Codewave;

},{"./ClosingPromp":2,"./Command":6,"./Context":7,"./Logger":10,"./PositionedCmdInstance":12,"./Process":13,"./TextParser":16,"./helpers/StringHelper":34,"./positioning/PosCollection":38}],6:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Context = require("./Context").Context;

var Storage = require("./Storage").Storage;

var NamespaceHelper = require("./helpers/NamespaceHelper").NamespaceHelper;

var _optKey;

_optKey = function _optKey(key, dict) {
  var defVal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  // optional Dictionary key
  if (key in dict) {
    return dict[key];
  } else {
    return defVal;
  }
};

var Command = function () {
  var Command =
  /*#__PURE__*/
  function () {
    function Command(name1) {
      var data1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      _classCallCheck(this, Command);

      this.name = name1;
      this.data = data1;
      this.cmds = [];
      this.detectors = [];
      this.executeFunct = this.resultFunct = this.resultStr = this.aliasOf = this.cls = null;
      this.aliased = null;
      this.fullName = this.name;
      this.depth = 0;
      var _ref = [null, false];
      this._parent = _ref[0];
      this._inited = _ref[1];
      this.setParent(parent);
      this.defaults = {};
      this.defaultOptions = {
        nameToParam: null,
        checkCarret: true,
        parse: false,
        beforeExecute: null,
        alterResult: null,
        preventParseAll: false,
        replaceBox: false,
        allowedNamed: null
      };
      this.options = {};
      this.finalOptions = null;
    }

    _createClass(Command, [{
      key: "parent",
      value: function parent() {
        return this._parent;
      }
    }, {
      key: "setParent",
      value: function setParent(value) {
        if (this._parent !== value) {
          this._parent = value;
          this.fullName = this._parent != null && this._parent.name != null ? this._parent.fullName + ':' + this.name : this.name;
          return this.depth = this._parent != null && this._parent.depth != null ? this._parent.depth + 1 : 0;
        }
      }
    }, {
      key: "init",
      value: function init() {
        if (!this._inited) {
          this._inited = true;
          this.parseData(this.data);
        }

        return this;
      }
    }, {
      key: "unregister",
      value: function unregister() {
        return this._parent.removeCmd(this);
      }
    }, {
      key: "isEditable",
      value: function isEditable() {
        return this.resultStr != null || this.aliasOf != null;
      }
    }, {
      key: "isExecutable",
      value: function isExecutable() {
        var aliased, j, len, p, ref;
        aliased = this.getAliased();

        if (aliased != null) {
          return aliased.init().isExecutable();
        }

        ref = ['resultStr', 'resultFunct', 'cls', 'executeFunct'];

        for (j = 0, len = ref.length; j < len; j++) {
          p = ref[j];

          if (this[p] != null) {
            return true;
          }
        }

        return false;
      }
    }, {
      key: "isExecutableWithName",
      value: function isExecutableWithName(name) {
        var aliasOf, aliased, context;

        if (this.aliasOf != null) {
          context = new Context();
          aliasOf = this.aliasOf.replace('%name%', name);
          aliased = this._aliasedFromFinder(context.getFinder(aliasOf));

          if (aliased != null) {
            return aliased.init().isExecutable();
          }

          return false;
        }

        return this.isExecutable();
      }
    }, {
      key: "resultIsAvailable",
      value: function resultIsAvailable() {
        var aliased, j, len, p, ref;
        aliased = this.getAliased();

        if (aliased != null) {
          return aliased.resultIsAvailable();
        }

        ref = ['resultStr', 'resultFunct'];

        for (j = 0, len = ref.length; j < len; j++) {
          p = ref[j];

          if (this[p] != null) {
            return true;
          }
        }

        return false;
      }
    }, {
      key: "getDefaults",
      value: function getDefaults() {
        var aliased, res;
        res = {};
        aliased = this.getAliased();

        if (aliased != null) {
          res = Object.assign(res, aliased.getDefaults());
        }

        res = Object.assign(res, this.defaults);
        return res;
      }
    }, {
      key: "_aliasedFromFinder",
      value: function _aliasedFromFinder(finder) {
        finder.useFallbacks = false;
        finder.mustExecute = false;
        finder.useDetectors = false;
        return finder.find();
      }
    }, {
      key: "getAliased",
      value: function getAliased() {
        var context;

        if (this.aliasOf != null) {
          context = new Context();
          return this._aliasedFromFinder(context.getFinder(this.aliasOf));
        }
      }
    }, {
      key: "getAliasedOrThis",
      value: function getAliasedOrThis() {
        return this.getAliased() || this;
      }
    }, {
      key: "setOptions",
      value: function setOptions(data) {
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
      }
    }, {
      key: "_optionsForAliased",
      value: function _optionsForAliased(aliased) {
        var opt;
        opt = {};
        opt = Object.assign(opt, this.defaultOptions);

        if (aliased != null) {
          opt = Object.assign(opt, aliased.getOptions());
        }

        return Object.assign(opt, this.options);
      }
    }, {
      key: "getOptions",
      value: function getOptions() {
        return this._optionsForAliased(this.getAliased());
      }
    }, {
      key: "getOption",
      value: function getOption(key) {
        var options;
        options = this.getOptions();

        if (key in options) {
          return options[key];
        }
      }
    }, {
      key: "help",
      value: function help() {
        var cmd;
        cmd = this.getCmd('help');

        if (cmd != null) {
          return cmd.init().resultStr;
        }
      }
    }, {
      key: "parseData",
      value: function parseData(data) {
        this.data = data;

        if (typeof data === 'string') {
          this.resultStr = data;
          this.options['parse'] = true;
          return true;
        } else if (data != null) {
          return this.parseDictData(data);
        }

        return false;
      }
    }, {
      key: "parseDictData",
      value: function parseDictData(data) {
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
      }
    }, {
      key: "addCmds",
      value: function addCmds(cmds) {
        var data, name, results;
        results = [];

        for (name in cmds) {
          data = cmds[name];
          results.push(this.addCmd(new Command(name, data, this)));
        }

        return results;
      }
    }, {
      key: "addCmd",
      value: function addCmd(cmd) {
        var exists;
        exists = this.getCmd(cmd.name);

        if (exists != null) {
          this.removeCmd(exists);
        }

        cmd.setParent(this);
        this.cmds.push(cmd);
        return cmd;
      }
    }, {
      key: "removeCmd",
      value: function removeCmd(cmd) {
        var i;

        if ((i = this.cmds.indexOf(cmd)) > -1) {
          this.cmds.splice(i, 1);
        }

        return cmd;
      }
    }, {
      key: "getCmd",
      value: function getCmd(fullname) {
        var cmd, j, len, name, ref, ref1, space;
        this.init();

        var _NamespaceHelper$spli = NamespaceHelper.splitFirst(fullname);

        var _NamespaceHelper$spli2 = _slicedToArray(_NamespaceHelper$spli, 2);

        space = _NamespaceHelper$spli2[0];
        name = _NamespaceHelper$spli2[1];

        if (space != null) {
          return (ref = this.getCmd(space)) != null ? ref.getCmd(name) : void 0;
        }

        ref1 = this.cmds;

        for (j = 0, len = ref1.length; j < len; j++) {
          cmd = ref1[j];

          if (cmd.name === name) {
            return cmd;
          }
        }
      }
    }, {
      key: "setCmdData",
      value: function setCmdData(fullname, data) {
        return this.setCmd(fullname, new Command(fullname.split(':').pop(), data));
      }
    }, {
      key: "setCmd",
      value: function setCmd(fullname, cmd) {
        var name, next, space;

        var _NamespaceHelper$spli3 = NamespaceHelper.splitFirst(fullname);

        var _NamespaceHelper$spli4 = _slicedToArray(_NamespaceHelper$spli3, 2);

        space = _NamespaceHelper$spli4[0];
        name = _NamespaceHelper$spli4[1];

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
      }
    }, {
      key: "addDetector",
      value: function addDetector(detector) {
        return this.detectors.push(detector);
      }
    }], [{
      key: "initCmds",
      value: function initCmds() {
        var j, len, provider, ref, results;
        Command.cmds = new Command(null, {
          'cmds': {
            'hello': {
              help: "\"Hello, world!\" is typically one of the simplest programs possible in\nmost programming languages, it is by tradition often (...) used to\nverify that a language or system is operating correctly -wikipedia",
              result: 'Hello, World!'
            }
          }
        });
        ref = this.providers;
        results = [];

        for (j = 0, len = ref.length; j < len; j++) {
          provider = ref[j];
          results.push(provider.register(Command.cmds));
        }

        return results;
      }
    }, {
      key: "saveCmd",
      value: function saveCmd(fullname, data) {
        var _this = this;

        return Promise.resolve().then(function () {
          return Command.cmds.setCmdData(fullname, data);
        }).then(function () {
          return _this.storage.saveInPath('cmds', fullname, data);
        });
      }
    }, {
      key: "loadCmds",
      value: function loadCmds() {
        var _this2 = this;

        return Promise.resolve().then(function () {
          var savedCmds;
          return savedCmds = _this2.storage.load('cmds');
        }).then(function (savedCmds) {
          var data, fullname, results;

          if (savedCmds != null) {
            results = [];

            for (fullname in savedCmds) {
              data = savedCmds[fullname];
              results.push(Command.cmds.setCmdData(fullname, data));
            }

            return results;
          }
        });
      }
    }, {
      key: "resetSaved",
      value: function resetSaved() {
        return this.storage.save('cmds', {});
      }
    }, {
      key: "makeVarCmd",
      value: function makeVarCmd(name) {
        var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        base.execute = function (instance) {
          var p, val;
          val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : void 0;

          if (val != null) {
            return instance.codewave.vars[name] = val;
          }
        };

        return base;
      }
    }, {
      key: "makeBoolVarCmd",
      value: function makeBoolVarCmd(name) {
        var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        base.execute = function (instance) {
          var p, val;
          val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : void 0;

          if (!(val != null && (val === '0' || val === 'false' || val === 'no'))) {
            return instance.codewave.vars[name] = true;
          }
        };

        return base;
      }
    }]);

    return Command;
  }();

  ;
  Command.providers = [];
  Command.storage = new Storage();
  return Command;
}.call(void 0);

exports.Command = Command;

var BaseCommand =
/*#__PURE__*/
function () {
  function BaseCommand(instance1) {
    _classCallCheck(this, BaseCommand);

    this.instance = instance1;
  }

  _createClass(BaseCommand, [{
    key: "init",
    value: function init() {}
  }, {
    key: "resultIsAvailable",
    value: function resultIsAvailable() {
      return this["result"] != null;
    }
  }, {
    key: "getDefaults",
    value: function getDefaults() {
      return {};
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      return {};
    }
  }]);

  return BaseCommand;
}();

exports.BaseCommand = BaseCommand;

},{"./Context":7,"./Storage":14,"./helpers/NamespaceHelper":31}],7:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ArrayHelper = require("./helpers/ArrayHelper").ArrayHelper;

var indexOf = [].indexOf;

var Context =
/*#__PURE__*/
function () {
  function Context(codewave) {
    _classCallCheck(this, Context);

    this.codewave = codewave;
    this.nameSpaces = [];
  }

  _createClass(Context, [{
    key: "addNameSpace",
    value: function addNameSpace(name) {
      if (indexOf.call(this.nameSpaces, name) < 0) {
        this.nameSpaces.push(name);
        return this._namespaces = null;
      }
    }
  }, {
    key: "addNamespaces",
    value: function addNamespaces(spaces) {
      var j, len, results, space;

      if (spaces) {
        if (typeof spaces === 'string') {
          spaces = [spaces];
        }

        results = [];

        for (j = 0, len = spaces.length; j < len; j++) {
          space = spaces[j];
          results.push(this.addNameSpace(space));
        }

        return results;
      }
    }
  }, {
    key: "removeNameSpace",
    value: function removeNameSpace(name) {
      return this.nameSpaces = this.nameSpaces.filter(function (n) {
        return n !== name;
      });
    }
  }, {
    key: "getNameSpaces",
    value: function getNameSpaces() {
      var npcs;

      if (this._namespaces == null) {
        npcs = this.nameSpaces;

        if (this.parent != null) {
          npcs = npcs.concat(this.parent.getNameSpaces());
        }

        this._namespaces = ArrayHelper.unique(npcs);
      }

      return this._namespaces;
    }
  }, {
    key: "getCmd",
    value: function getCmd(cmdName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var finder;
      finder = this.getFinder(cmdName, options);
      return finder.find();
    }
  }, {
    key: "getFinder",
    value: function getFinder(cmdName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new Context.cmdFinderClass(cmdName, Object.assign({
        namespaces: [],
        useDetectors: this.isRoot(),
        codewave: this.codewave,
        parentContext: this
      }, options));
    }
  }, {
    key: "isRoot",
    value: function isRoot() {
      return this.parent == null;
    }
  }, {
    key: "getParentOrRoot",
    value: function getParentOrRoot() {
      if (this.parent != null) {
        return this.parent;
      } else {
        return this;
      }
    }
  }, {
    key: "wrapComment",
    value: function wrapComment(str) {
      var cc;
      cc = this.getCommentChar();

      if (cc.indexOf('%s') > -1) {
        return cc.replace('%s', str);
      } else {
        return cc + ' ' + str + ' ' + cc;
      }
    }
  }, {
    key: "wrapCommentLeft",
    value: function wrapCommentLeft() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var cc, i;
      cc = this.getCommentChar();

      if ((i = cc.indexOf('%s')) > -1) {
        return cc.substr(0, i) + str;
      } else {
        return cc + ' ' + str;
      }
    }
  }, {
    key: "wrapCommentRight",
    value: function wrapCommentRight() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var cc, i;
      cc = this.getCommentChar();

      if ((i = cc.indexOf('%s')) > -1) {
        return str + cc.substr(i + 2);
      } else {
        return str + ' ' + cc;
      }
    }
  }, {
    key: "cmdInstanceFor",
    value: function cmdInstanceFor(cmd) {
      return new Context.cmdInstanceClass(cmd, this);
    }
  }, {
    key: "getCommentChar",
    value: function getCommentChar() {
      var _char, cmd, inst, res;

      if (this.commentChar != null) {
        return this.commentChar;
      }

      cmd = this.getCmd('comment');
      _char = '<!-- %s -->';

      if (cmd != null) {
        inst = this.cmdInstanceFor(cmd);
        inst.content = '%s';
        res = inst.result();

        if (res != null) {
          _char = res;
        }
      }

      this.commentChar = _char;
      return this.commentChar;
    }
  }]);

  return Context;
}();

exports.Context = Context;

},{"./helpers/ArrayHelper":29}],8:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Command = require("./Command").Command;

var EditCmdProp =
/*#__PURE__*/
function () {
  function EditCmdProp(name, options) {
    _classCallCheck(this, EditCmdProp);

    var defaults, i, key, len, ref, val;
    this.name = name;
    defaults = {
      'var': null,
      'opt': null,
      'funct': null,
      'dataName': null,
      'showEmpty': false,
      'carret': false
    };
    ref = ['var', 'opt', 'funct'];

    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];

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

  _createClass(EditCmdProp, [{
    key: "setCmd",
    value: function setCmd(cmds) {
      return cmds[this.name] = Command.makeVarCmd(this.name);
    }
  }, {
    key: "writeFor",
    value: function writeFor(parser, obj) {
      if (parser.vars[this.name] != null) {
        return obj[this.dataName] = parser.vars[this.name];
      }
    }
  }, {
    key: "valFromCmd",
    value: function valFromCmd(cmd) {
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
    }
  }, {
    key: "showForCmd",
    value: function showForCmd(cmd) {
      var val;
      val = this.valFromCmd(cmd);
      return this.showEmpty || val != null;
    }
  }, {
    key: "display",
    value: function display(cmd) {
      if (this.showForCmd(cmd)) {
        return "~~".concat(this.name, "~~\n").concat(this.valFromCmd(cmd) || "").concat(this.carret ? "|" : "", "\n~~/").concat(this.name, "~~");
      }
    }
  }]);

  return EditCmdProp;
}();

exports.EditCmdProp = EditCmdProp;

EditCmdProp.source =
/*#__PURE__*/
function (_EditCmdProp) {
  _inherits(source, _EditCmdProp);

  function source() {
    _classCallCheck(this, source);

    return _possibleConstructorReturn(this, _getPrototypeOf(source).apply(this, arguments));
  }

  _createClass(source, [{
    key: "valFromCmd",
    value: function valFromCmd(cmd) {
      var res;
      res = _get(_getPrototypeOf(source.prototype), "valFromCmd", this).call(this, cmd);

      if (res != null) {
        res = res.replace(/\|/g, '||');
      }

      return res;
    }
  }, {
    key: "setCmd",
    value: function setCmd(cmds) {
      return cmds[this.name] = Command.makeVarCmd(this.name, {
        'preventParseAll': true
      });
    }
  }, {
    key: "showForCmd",
    value: function showForCmd(cmd) {
      var val;
      val = this.valFromCmd(cmd);
      return this.showEmpty && !(cmd != null && cmd.aliasOf != null) || val != null;
    }
  }]);

  return source;
}(EditCmdProp);

EditCmdProp.string =
/*#__PURE__*/
function (_EditCmdProp2) {
  _inherits(string, _EditCmdProp2);

  function string() {
    _classCallCheck(this, string);

    return _possibleConstructorReturn(this, _getPrototypeOf(string).apply(this, arguments));
  }

  _createClass(string, [{
    key: "display",
    value: function display(cmd) {
      if (this.valFromCmd(cmd) != null) {
        return "~~!".concat(this.name, " '").concat(this.valFromCmd(cmd)).concat(this.carret ? "|" : "", "'~~");
      }
    }
  }]);

  return string;
}(EditCmdProp);

EditCmdProp.revBool =
/*#__PURE__*/
function (_EditCmdProp3) {
  _inherits(revBool, _EditCmdProp3);

  function revBool() {
    _classCallCheck(this, revBool);

    return _possibleConstructorReturn(this, _getPrototypeOf(revBool).apply(this, arguments));
  }

  _createClass(revBool, [{
    key: "setCmd",
    value: function setCmd(cmds) {
      return cmds[this.name] = Command.makeBoolVarCmd(this.name);
    }
  }, {
    key: "writeFor",
    value: function writeFor(parser, obj) {
      if (parser.vars[this.name] != null) {
        return obj[this.dataName] = !parser.vars[this.name];
      }
    }
  }, {
    key: "display",
    value: function display(cmd) {
      var val;
      val = this.valFromCmd(cmd);

      if (val != null && !val) {
        return "~~!".concat(this.name, "~~");
      }
    }
  }]);

  return revBool;
}(EditCmdProp);

EditCmdProp.bool =
/*#__PURE__*/
function (_EditCmdProp4) {
  _inherits(bool, _EditCmdProp4);

  function bool() {
    _classCallCheck(this, bool);

    return _possibleConstructorReturn(this, _getPrototypeOf(bool).apply(this, arguments));
  }

  _createClass(bool, [{
    key: "setCmd",
    value: function setCmd(cmds) {
      return cmds[this.name] = Command.makeBoolVarCmd(this.name);
    }
  }, {
    key: "display",
    value: function display(cmd) {
      if (this.valFromCmd(cmd)) {
        return "~~!".concat(this.name, "~~");
      }
    }
  }]);

  return bool;
}(EditCmdProp);

},{"./Command":6}],9:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Pos = require("./positioning/Pos").Pos;

var StrPos = require("./positioning/StrPos").StrPos;

var OptionalPromise = require("./helpers/OptionalPromise");

var Editor =
/*#__PURE__*/
function () {
  function Editor() {
    _classCallCheck(this, Editor);

    this.namespace = null;
    this._lang = null;
  }

  _createClass(Editor, [{
    key: "bindedTo",
    value: function bindedTo(codewave) {}
  }, {
    key: "text",
    value: function text(val) {
      throw "Not Implemented";
    }
  }, {
    key: "textCharAt",
    value: function textCharAt(pos) {
      throw "Not Implemented";
    }
  }, {
    key: "textLen",
    value: function textLen() {
      throw "Not Implemented";
    }
  }, {
    key: "textSubstr",
    value: function textSubstr(start, end) {
      throw "Not Implemented";
    }
  }, {
    key: "insertTextAt",
    value: function insertTextAt(text, pos) {
      throw "Not Implemented";
    }
  }, {
    key: "spliceText",
    value: function spliceText(start, end, text) {
      throw "Not Implemented";
    }
  }, {
    key: "getCursorPos",
    value: function getCursorPos() {
      throw "Not Implemented";
    }
  }, {
    key: "setCursorPos",
    value: function setCursorPos(start) {
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      throw "Not Implemented";
    }
  }, {
    key: "beginUndoAction",
    value: function beginUndoAction() {}
  }, {
    key: "endUndoAction",
    value: function endUndoAction() {}
  }, {
    key: "getLang",
    value: function getLang() {
      return this._lang;
    }
  }, {
    key: "setLang",
    value: function setLang(val) {
      return this._lang = val;
    }
  }, {
    key: "getEmmetContextObject",
    value: function getEmmetContextObject() {
      return null;
    }
  }, {
    key: "allowMultiSelection",
    value: function allowMultiSelection() {
      return false;
    }
  }, {
    key: "setMultiSel",
    value: function setMultiSel(selections) {
      throw "Not Implemented";
    }
  }, {
    key: "getMultiSel",
    value: function getMultiSel() {
      throw "Not Implemented";
    }
  }, {
    key: "canListenToChange",
    value: function canListenToChange() {
      return false;
    }
  }, {
    key: "addChangeListener",
    value: function addChangeListener(callback) {
      throw "Not Implemented";
    }
  }, {
    key: "removeChangeListener",
    value: function removeChangeListener(callback) {
      throw "Not Implemented";
    }
  }, {
    key: "getLineAt",
    value: function getLineAt(pos) {
      return new Pos(this.findLineStart(pos), this.findLineEnd(pos));
    }
  }, {
    key: "findLineStart",
    value: function findLineStart(pos) {
      var p;
      p = this.findAnyNext(pos, ["\n"], -1);

      if (p) {
        return p.pos + 1;
      } else {
        return 0;
      }
    }
  }, {
    key: "findLineEnd",
    value: function findLineEnd(pos) {
      var p;
      p = this.findAnyNext(pos, ["\n", "\r"]);

      if (p) {
        return p.pos;
      } else {
        return this.textLen();
      }
    }
  }, {
    key: "findAnyNext",
    value: function findAnyNext(start, strings) {
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var bestPos, bestStr, i, len, pos, stri, text;

      if (direction > 0) {
        text = this.textSubstr(start, this.textLen());
      } else {
        text = this.textSubstr(0, start);
      }

      bestPos = null;

      for (i = 0, len = strings.length; i < len; i++) {
        stri = strings[i];
        pos = direction > 0 ? text.indexOf(stri) : text.lastIndexOf(stri);

        if (pos !== -1) {
          if (bestPos == null || bestPos * direction > pos * direction) {
            bestPos = pos;
            bestStr = stri;
          }
        }
      }

      if (bestStr != null) {
        return new StrPos(direction > 0 ? bestPos + start : bestPos, bestStr);
      }

      return null;
    }
  }, {
    key: "applyReplacements",
    value: function applyReplacements(replacements) {
      var _this = this;

      return replacements.reduce(function (promise, repl) {
        return promise.then(function (opt) {
          repl.withEditor(_this);
          repl.applyOffset(opt.offset);
          return (0, OptionalPromise.optionalPromise)(repl.apply()).then(function () {
            return {
              selections: opt.selections.concat(repl.selections),
              offset: opt.offset + repl.offsetAfter(_this)
            };
          });
        });
      }, (0, OptionalPromise.optionalPromise)({
        selections: [],
        offset: 0
      })).then(function (opt) {
        return _this.applyReplacementsSelections(opt.selections);
      }).result();
    }
  }, {
    key: "applyReplacementsSelections",
    value: function applyReplacementsSelections(selections) {
      if (selections.length > 0) {
        if (this.allowMultiSelection()) {
          return this.setMultiSel(selections);
        } else {
          return this.setCursorPos(selections[0].start, selections[0].end);
        }
      }
    }
  }]);

  return Editor;
}();

exports.Editor = Editor;

},{"./helpers/OptionalPromise":32,"./positioning/Pos":37,"./positioning/StrPos":41}],10:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Logger = function () {
  var Logger =
  /*#__PURE__*/
  function () {
    function Logger() {
      _classCallCheck(this, Logger);
    }

    _createClass(Logger, [{
      key: "log",
      value: function log() {
        var i, len, msg, results;

        if (this.isEnabled()) {
          results = [];

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          for (i = 0, len = args.length; i < len; i++) {
            msg = args[i];
            results.push(console.log(msg));
          }

          return results;
        }
      }
    }, {
      key: "isEnabled",
      value: function isEnabled() {
        return (typeof console !== "undefined" && console !== null ? console.log : void 0) != null && this.enabled && Logger.enabled;
      }
    }, {
      key: "runtime",
      value: function runtime(funct) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "function";
        var res, t0, t1;
        t0 = performance.now();
        res = funct();
        t1 = performance.now();
        console.log("".concat(name, " took ").concat(t1 - t0, " milliseconds."));
        return res;
      }
    }, {
      key: "toMonitor",
      value: function toMonitor(obj, name) {
        var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var funct;
        funct = obj[name];
        return obj[name] = function () {
          var args;
          args = arguments;
          return this.monitor(function () {
            return funct.apply(obj, args);
          }, prefix + name);
        };
      }
    }, {
      key: "monitor",
      value: function monitor(funct, name) {
        var res, t0, t1;
        t0 = performance.now();
        res = funct();
        t1 = performance.now();

        if (this.monitorData[name] != null) {
          this.monitorData[name].count++;
          this.monitorData[name].total += t1 - t0;
        } else {
          this.monitorData[name] = {
            count: 1,
            total: t1 - t0
          };
        }

        return res;
      }
    }, {
      key: "resume",
      value: function resume() {
        return console.log(this.monitorData);
      }
    }]);

    return Logger;
  }();

  ;
  Logger.enabled = true;
  Logger.prototype.enabled = true;
  Logger.prototype.monitorData = {};
  return Logger;
}.call(void 0);

exports.Logger = Logger;

},{}],11:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OptionObject =
/*#__PURE__*/
function () {
  function OptionObject() {
    _classCallCheck(this, OptionObject);
  }

  _createClass(OptionObject, [{
    key: "setOpts",
    value: function setOpts(options, defaults) {
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
    }
  }, {
    key: "setOpt",
    value: function setOpt(key, val) {
      var ref;

      if (((ref = this[key]) != null ? ref.call : void 0) != null) {
        return this[key](val);
      } else {
        return this[key] = val;
      }
    }
  }, {
    key: "getOpt",
    value: function getOpt(key) {
      var ref;

      if (((ref = this[key]) != null ? ref.call : void 0) != null) {
        return this[key]();
      } else {
        return this[key];
      }
    }
  }, {
    key: "getOpts",
    value: function getOpts() {
      var key, opts, ref, val;
      opts = {};
      ref = this.defaults;

      for (key in ref) {
        val = ref[key];
        opts[key] = this.getOpt(key);
      }

      return opts;
    }
  }]);

  return OptionObject;
}();

exports.OptionObject = OptionObject;

},{}],12:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CmdInstance = require("./CmdInstance").CmdInstance;

var BoxHelper = require("./BoxHelper").BoxHelper;

var ParamParser = require("./stringParsers/ParamParser").ParamParser;

var Pos = require("./positioning/Pos").Pos;

var StrPos = require("./positioning/StrPos").StrPos;

var Replacement = require("./positioning/Replacement").Replacement;

var StringHelper = require("./helpers/StringHelper").StringHelper;

var NamespaceHelper = require("./helpers/NamespaceHelper").NamespaceHelper;

var Command = require("./Command").Command;

var OptionalPromise = require("./helpers/OptionalPromise");

var PositionedCmdInstance =
/*#__PURE__*/
function (_CmdInstance) {
  _inherits(PositionedCmdInstance, _CmdInstance);

  function PositionedCmdInstance(codewave, pos1, str1) {
    var _this;

    _classCallCheck(this, PositionedCmdInstance);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PositionedCmdInstance).call(this));
    _this.codewave = codewave;
    _this.pos = pos1;
    _this.str = str1;

    if (!_this.isEmpty()) {
      _this._checkCloser();

      _this.opening = _this.str;
      _this.noBracket = _this._removeBracket(_this.str);

      _this._splitComponents();

      _this._findClosing();

      _this._checkElongated();
    }

    return _this;
  }

  _createClass(PositionedCmdInstance, [{
    key: "_checkCloser",
    value: function _checkCloser() {
      var f, noBracket;
      noBracket = this._removeBracket(this.str);

      if (noBracket.substring(0, this.codewave.closeChar.length) === this.codewave.closeChar && (f = this._findOpeningPos())) {
        this.closingPos = new StrPos(this.pos, this.str);
        this.pos = f.pos;
        return this.str = f.str;
      }
    }
  }, {
    key: "_findOpeningPos",
    value: function _findOpeningPos() {
      var closing, cmdName, opening;
      cmdName = this._removeBracket(this.str).substring(this.codewave.closeChar.length);
      opening = this.codewave.brakets + cmdName;
      closing = this.str;
      var f = this.codewave.findMatchingPair(this.pos, opening, closing, -1);

      if (f) {
        f.str = this.codewave.editor.textSubstr(f.pos, this.codewave.findNextBraket(f.pos + f.str.length) + this.codewave.brakets.length);
        return f;
      }
    }
  }, {
    key: "_splitComponents",
    value: function _splitComponents() {
      var parts;
      parts = this.noBracket.split(" ");
      this.cmdName = parts.shift();
      return this.rawParams = parts.join(" ");
    }
  }, {
    key: "_parseParams",
    value: function _parseParams(params) {
      var nameToParam, parser;
      parser = new ParamParser(params, {
        allowedNamed: this.getOption('allowedNamed'),
        vars: this.codewave.vars
      });
      this.params = parser.params;
      this.named = Object.assign(this.getDefaults(), parser.named);

      if (this.cmd != null) {
        nameToParam = this.getOption('nameToParam');

        if (nameToParam != null) {
          return this.named[nameToParam] = this.cmdName;
        }
      }
    }
  }, {
    key: "_findClosing",
    value: function _findClosing() {
      var f = this._findClosingPos();

      if (f) {
        this.content = StringHelper.trimEmptyLine(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos));
        return this.str = this.codewave.editor.textSubstr(this.pos, f.pos + f.str.length);
      }
    }
  }, {
    key: "_findClosingPos",
    value: function _findClosingPos() {
      var closing, opening;

      if (this.closingPos != null) {
        return this.closingPos;
      }

      closing = this.codewave.brakets + this.codewave.closeChar + this.cmdName + this.codewave.brakets;
      opening = this.codewave.brakets + this.cmdName;
      var f = this.codewave.findMatchingPair(this.pos + this.str.length, opening, closing);

      if (f) {
        return this.closingPos = f;
      }
    }
  }, {
    key: "_checkElongated",
    value: function _checkElongated() {
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
  }, {
    key: "_checkBox",
    value: function _checkBox() {
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
  }, {
    key: "_removeCommentFromContent",
    value: function _removeCommentFromContent() {
      var ecl, ecr, ed, re1, re2, re3;

      if (this.content) {
        ecl = StringHelper.escapeRegExp(this.context.wrapCommentLeft());
        ecr = StringHelper.escapeRegExp(this.context.wrapCommentRight());
        ed = StringHelper.escapeRegExp(this.codewave.deco);
        re1 = new RegExp("^\\s*".concat(ecl, "(?:").concat(ed, ")+\\s*(.*?)\\s*(?:").concat(ed, ")+").concat(ecr, "$"), "gm");
        re2 = new RegExp("^\\s*(?:".concat(ed, ")*").concat(ecr, "\r?\n"));
        re3 = new RegExp("\n\\s*".concat(ecl, "(?:").concat(ed, ")*\\s*$"));
        return this.content = this.content.replace(re1, '$1').replace(re2, '').replace(re3, '');
      }
    }
  }, {
    key: "_getParentCmds",
    value: function _getParentCmds() {
      var ref;
      return this.parent = (ref = this.codewave.getEnclosingCmd(this.getEndPos())) != null ? ref.init() : void 0;
    }
  }, {
    key: "setMultiPos",
    value: function setMultiPos(multiPos) {
      return this.multiPos = multiPos;
    }
  }, {
    key: "_getCmdObj",
    value: function _getCmdObj() {
      this.getCmd();

      this._checkBox();

      this.content = this.removeIndentFromContent(this.content);
      return _get(_getPrototypeOf(PositionedCmdInstance.prototype), "_getCmdObj", this).call(this);
    }
  }, {
    key: "_initParams",
    value: function _initParams() {
      return this._parseParams(this.rawParams);
    }
  }, {
    key: "getContext",
    value: function getContext() {
      return this.context || this.codewave.context;
    }
  }, {
    key: "getCmd",
    value: function getCmd() {
      if (this.cmd == null) {
        this._getParentCmds();

        if (this.noBracket.substring(0, this.codewave.noExecuteChar.length) === this.codewave.noExecuteChar) {
          this.cmd = Command.cmds.getCmd('core:no_execute');
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
  }, {
    key: "getFinder",
    value: function getFinder(cmdName) {
      var finder;
      finder = this.codewave.context.getFinder(cmdName, {
        namespaces: this._getParentNamespaces()
      });
      finder.instance = this;
      return finder;
    }
  }, {
    key: "_getParentNamespaces",
    value: function _getParentNamespaces() {
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
  }, {
    key: "_removeBracket",
    value: function _removeBracket(str) {
      return str.substring(this.codewave.brakets.length, str.length - this.codewave.brakets.length);
    }
  }, {
    key: "alterAliasOf",
    value: function alterAliasOf(aliasOf) {
      var cmdName, nspc;

      var _NamespaceHelper$spli = NamespaceHelper.split(this.cmdName);

      var _NamespaceHelper$spli2 = _slicedToArray(_NamespaceHelper$spli, 2);

      nspc = _NamespaceHelper$spli2[0];
      cmdName = _NamespaceHelper$spli2[1];
      return aliasOf.replace('%name%', cmdName);
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.str === this.codewave.brakets + this.codewave.closeChar + this.codewave.brakets || this.str === this.codewave.brakets + this.codewave.brakets;
    }
  }, {
    key: "execute",
    value: function execute() {
      var _this2 = this;

      if (this.isEmpty()) {
        if (this.codewave.closingPromp != null && this.codewave.closingPromp.whithinOpenBounds(this.pos + this.codewave.brakets.length) != null) {
          return this.codewave.closingPromp.cancel();
        } else {
          return this.replaceWith('');
        }
      } else if (this.cmd != null) {
        var beforeFunct = this.getOption('beforeExecute');

        if (beforeFunct) {
          beforeFunct(this);
        }

        if (this.resultIsAvailable()) {
          return (0, OptionalPromise.optionalPromise)(this.result()).then(function (res) {
            if (res != null) {
              return _this2.replaceWith(res);
            }
          }).result();
        } else {
          return this.runExecuteFunct();
        }
      }
    }
  }, {
    key: "getEndPos",
    value: function getEndPos() {
      return this.pos + this.str.length;
    }
  }, {
    key: "getPos",
    value: function getPos() {
      return new Pos(this.pos, this.pos + this.str.length).withEditor(this.codewave.editor);
    }
  }, {
    key: "getOpeningPos",
    value: function getOpeningPos() {
      return new Pos(this.pos, this.pos + this.opening.length).withEditor(this.codewave.editor);
    }
  }, {
    key: "getIndent",
    value: function getIndent() {
      var helper;

      if (this.indentLen == null) {
        if (this.inBox != null) {
          helper = new BoxHelper(this.context);
          this.indentLen = helper.removeComment(this.getPos().sameLinesPrefix()).length;
        } else {
          this.indentLen = this.pos - this.getPos().prevEOL();
        }
      }

      return this.indentLen;
    }
  }, {
    key: "removeIndentFromContent",
    value: function removeIndentFromContent(text) {
      var reg;

      if (text != null) {
        reg = new RegExp('^\\s{' + this.getIndent() + '}', 'gm');
        return text.replace(reg, '');
      } else {
        return text;
      }
    }
  }, {
    key: "alterResultForBox",
    value: function alterResultForBox(repl) {
      var box, helper, original, res;
      original = repl.copy();
      helper = new BoxHelper(this.context);
      helper.getOptFromLine(original.textWithFullLines(), false);

      if (this.getOption('replaceBox')) {
        box = helper.getBoxForPos(original);
        var _ref = [box.start, box.end];
        repl.start = _ref[0];
        repl.end = _ref[1];
        this.indentLen = helper.indent;
        repl.text = this.applyIndent(repl.text);
      } else {
        repl.text = this.applyIndent(repl.text);
        repl.start = original.prevEOL();
        repl.end = original.nextEOL();
        res = helper.reformatLines(original.sameLinesPrefix() + this.codewave.marker + repl.text + this.codewave.marker + original.sameLinesSuffix(), {
          multiline: false
        });

        var _res$split = res.split(this.codewave.marker);

        var _res$split2 = _slicedToArray(_res$split, 3);

        repl.prefix = _res$split2[0];
        repl.text = _res$split2[1];
        repl.suffix = _res$split2[2];
      }

      return repl;
    }
  }, {
    key: "getCursorFromResult",
    value: function getCursorFromResult(repl) {
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
  }, {
    key: "checkMulti",
    value: function checkMulti(repl) {
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
  }, {
    key: "replaceWith",
    value: function replaceWith(text) {
      return this.applyReplacement(new Replacement(this.pos, this.getEndPos(), text));
    }
  }, {
    key: "applyReplacement",
    value: function applyReplacement(repl) {
      var cursorPos, replacements;
      repl.withEditor(this.codewave.editor);

      if (this.inBox != null) {
        this.alterResultForBox(repl);
      } else {
        repl.text = this.applyIndent(repl.text);
      }

      cursorPos = this.getCursorFromResult(repl);
      repl.selections = [new Pos(cursorPos, cursorPos)];
      replacements = this.checkMulti(repl);
      this.replaceStart = repl.start;
      this.replaceEnd = repl.resEnd();
      return this.codewave.editor.applyReplacements(replacements);
    }
  }]);

  return PositionedCmdInstance;
}(CmdInstance);

exports.PositionedCmdInstance = PositionedCmdInstance;

},{"./BoxHelper":1,"./CmdInstance":4,"./Command":6,"./helpers/NamespaceHelper":31,"./helpers/OptionalPromise":32,"./helpers/StringHelper":34,"./positioning/Pos":37,"./positioning/Replacement":39,"./positioning/StrPos":41,"./stringParsers/ParamParser":49}],13:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Process = function Process() {
  _classCallCheck(this, Process);
};

exports.Process = Process;

},{}],14:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Logger = require("./Logger").Logger;

var Storage =
/*#__PURE__*/
function () {
  function Storage(engine) {
    _classCallCheck(this, Storage);

    this.engine = engine;
  }

  _createClass(Storage, [{
    key: "save",
    value: function save(key, val) {
      if (this.engineAvailable()) {
        return this.engine.save(key, val);
      }
    }
  }, {
    key: "saveInPath",
    value: function saveInPath(path, key, val) {
      if (this.engineAvailable()) {
        return this.engine.saveInPath(path, key, val);
      }
    }
  }, {
    key: "load",
    value: function load(key) {
      if (this.engine != null) {
        return this.engine.load(key);
      }
    }
  }, {
    key: "engineAvailable",
    value: function engineAvailable() {
      if (this.engine != null) {
        return true;
      } else {
        this.logger = this.logger || new Logger();
        this.logger.log('No storage engine available');
        return false;
      }
    }
  }]);

  return Storage;
}();

exports.Storage = Storage;

},{"./Logger":10}],15:[function(require,module,exports){
"use strict";

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TextParser = require("./TextParser").TextParser;

var Pos = require("./positioning/Pos").Pos;

var isElement;

var DomKeyListener =
/*#__PURE__*/
function () {
  function DomKeyListener() {
    _classCallCheck(this, DomKeyListener);
  }

  _createClass(DomKeyListener, [{
    key: "startListening",
    value: function startListening(target) {
      var _this = this;

      var onkeydown, onkeypress, onkeyup, timeout;
      timeout = null;

      onkeydown = function onkeydown(e) {
        if ((Codewave.instances.length < 2 || _this.obj === document.activeElement) && e.keyCode === 69 && e.ctrlKey) {
          e.preventDefault();

          if (_this.onActivationKey != null) {
            return _this.onActivationKey();
          }
        }
      };

      onkeyup = function onkeyup(e) {
        if (_this.onAnyChange != null) {
          return _this.onAnyChange(e);
        }
      };

      onkeypress = function onkeypress(e) {
        if (timeout != null) {
          clearTimeout(timeout);
        }

        return timeout = setTimeout(function () {
          if (_this.onAnyChange != null) {
            return _this.onAnyChange(e);
          }
        }, 100);
      };

      if (target.addEventListener) {
        target.addEventListener("keydown", onkeydown);
        target.addEventListener("keyup", onkeyup);
        return target.addEventListener("keypress", onkeypress);
      } else if (target.attachEvent) {
        target.attachEvent("onkeydown", onkeydown);
        target.attachEvent("onkeyup", onkeyup);
        return target.attachEvent("onkeypress", onkeypress);
      }
    }
  }]);

  return DomKeyListener;
}();

exports.DomKeyListener = DomKeyListener;

isElement = function isElement(obj) {
  var e;

  try {
    // Using W3 DOM2 (works for FF, Opera and Chrom)
    return obj instanceof HTMLElement;
  } catch (error) {
    e = error; // Browsers not supporting W3 DOM2 don't have HTMLElement and
    // an exception is thrown and we end up here. Testing some
    // properties that all elements have. (works on IE7)

    return _typeof(obj) === "object" && obj.nodeType === 1 && _typeof(obj.style) === "object" && _typeof(obj.ownerDocument) === "object";
  }
};

var TextAreaEditor = function () {
  var TextAreaEditor =
  /*#__PURE__*/
  function (_TextParser) {
    _inherits(TextAreaEditor, _TextParser);

    function TextAreaEditor(target1) {
      var _this2;

      _classCallCheck(this, TextAreaEditor);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(TextAreaEditor).call(this));
      _this2.target = target1;
      _this2.obj = isElement(_this2.target) ? _this2.target : document.getElementById(_this2.target);

      if (_this2.obj == null) {
        throw "TextArea not found";
      }

      _this2.namespace = 'textarea';
      _this2.changeListeners = [];
      _this2._skipChangeEvent = 0;
      return _this2;
    }

    _createClass(TextAreaEditor, [{
      key: "onAnyChange",
      value: function onAnyChange(e) {
        var callback, j, len1, ref, results;

        if (this._skipChangeEvent <= 0) {
          ref = this.changeListeners;
          results = [];

          for (j = 0, len1 = ref.length; j < len1; j++) {
            callback = ref[j];
            results.push(callback());
          }

          return results;
        } else {
          this._skipChangeEvent--;

          if (this.onSkipedChange != null) {
            return this.onSkipedChange();
          }
        }
      }
    }, {
      key: "skipChangeEvent",
      value: function skipChangeEvent() {
        var nb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        return this._skipChangeEvent += nb;
      }
    }, {
      key: "bindedTo",
      value: function bindedTo(codewave) {
        this.onActivationKey = function () {
          return codewave.onActivationKey();
        };

        return this.startListening(document);
      }
    }, {
      key: "selectionPropExists",
      value: function selectionPropExists() {
        return "selectionStart" in this.obj;
      }
    }, {
      key: "hasFocus",
      value: function hasFocus() {
        return document.activeElement === this.obj;
      }
    }, {
      key: "text",
      value: function text(val) {
        if (val != null) {
          if (!this.textEventChange(val)) {
            this.obj.value = val;
          }
        }

        return this.obj.value;
      }
    }, {
      key: "spliceText",
      value: function spliceText(start, end, text) {
        return this.textEventChange(text, start, end) || this.spliceTextWithExecCommand(text, start, end) || _get(_getPrototypeOf(TextAreaEditor.prototype), "spliceText", this).call(this, start, end, text);
      }
    }, {
      key: "textEventChange",
      value: function textEventChange(text) {
        var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var event;

        if (document.createEvent != null) {
          event = document.createEvent('TextEvent');
        }

        if (event != null && event.initTextEvent != null && event.isTrusted !== false) {
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

          event.initTextEvent('textInput', true, true, null, text, 9); // @setCursorPos(start,end)

          this.obj.selectionStart = start;
          this.obj.selectionEnd = end;
          this.obj.dispatchEvent(event);
          this.skipChangeEvent();
          return true;
        } else {
          return false;
        }
      }
    }, {
      key: "spliceTextWithExecCommand",
      value: function spliceTextWithExecCommand(text) {
        var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        if (document.execCommand != null) {
          if (end == null) {
            end = this.textLen();
          }

          this.obj.selectionStart = start;
          this.obj.selectionEnd = end;
          return document.execCommand('insertText', false, text);
        } else {
          return false;
        }
      }
    }, {
      key: "getCursorPos",
      value: function getCursorPos() {
        if (this.tmpCursorPos != null) {
          return this.tmpCursorPos;
        }

        if (this.hasFocus) {
          if (this.selectionPropExists) {
            return new Pos(this.obj.selectionStart, this.obj.selectionEnd);
          } else {
            return this.getCursorPosFallback();
          }
        }
      }
    }, {
      key: "getCursorPosFallback",
      value: function getCursorPosFallback() {
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
            pos = new Pos(0, len);

            while (rng.compareEndPoints("EndToStart", rng) > 0) {
              pos.start++;
              pos.end++;
              rng.moveEnd("character", -1);
            }

            return pos;
          }
        }
      }
    }, {
      key: "setCursorPos",
      value: function setCursorPos(start, end) {
        var _this3 = this;

        if (arguments.length < 2) {
          end = start;
        }

        if (this.selectionPropExists) {
          this.tmpCursorPos = new Pos(start, end);
          this.obj.selectionStart = start;
          this.obj.selectionEnd = end;
          setTimeout(function () {
            _this3.tmpCursorPos = null;
            _this3.obj.selectionStart = start;
            return _this3.obj.selectionEnd = end;
          }, 1);
        } else {
          this.setCursorPosFallback(start, end);
        }
      }
    }, {
      key: "setCursorPosFallback",
      value: function setCursorPosFallback(start, end) {
        var rng;

        if (this.obj.createTextRange) {
          rng = this.obj.createTextRange();
          rng.moveStart("character", start);
          rng.collapse();
          rng.moveEnd("character", end - start);
          return rng.select();
        }
      }
    }, {
      key: "getLang",
      value: function getLang() {
        if (this._lang) {
          return this._lang;
        }

        if (this.obj.hasAttribute('data-lang')) {
          return this.obj.getAttribute('data-lang');
        }
      }
    }, {
      key: "setLang",
      value: function setLang(val) {
        this._lang = val;
        return this.obj.setAttribute('data-lang', val);
      }
    }, {
      key: "canListenToChange",
      value: function canListenToChange() {
        return true;
      }
    }, {
      key: "addChangeListener",
      value: function addChangeListener(callback) {
        return this.changeListeners.push(callback);
      }
    }, {
      key: "removeChangeListener",
      value: function removeChangeListener(callback) {
        var i;

        if ((i = this.changeListeners.indexOf(callback)) > -1) {
          return this.changeListeners.splice(i, 1);
        }
      }
    }, {
      key: "applyReplacements",
      value: function applyReplacements(replacements) {
        if (replacements.length > 0 && replacements[0].selections.length < 1) {
          replacements[0].selections = [this.getCursorPos()];
        }

        return _get(_getPrototypeOf(TextAreaEditor.prototype), "applyReplacements", this).call(this, replacements);
      }
    }]);

    return TextAreaEditor;
  }(TextParser);

  ;
  TextAreaEditor.prototype.startListening = DomKeyListener.prototype.startListening;
  return TextAreaEditor;
}.call(void 0);

exports.TextAreaEditor = TextAreaEditor;

},{"./TextParser":16,"./positioning/Pos":37}],16:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Editor = require("./Editor").Editor;

var Pos = require("./positioning/Pos").Pos;

var TextParser =
/*#__PURE__*/
function (_Editor) {
  _inherits(TextParser, _Editor);

  function TextParser(_text) {
    var _this;

    _classCallCheck(this, TextParser);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextParser).call(this));
    _this._text = _text;
    return _this;
  }

  _createClass(TextParser, [{
    key: "text",
    value: function text(val) {
      if (val != null) {
        this._text = val;
      }

      return this._text;
    }
  }, {
    key: "textCharAt",
    value: function textCharAt(pos) {
      return this.text()[pos];
    }
  }, {
    key: "textLen",
    value: function textLen(pos) {
      return this.text().length;
    }
  }, {
    key: "textSubstr",
    value: function textSubstr(start, end) {
      return this.text().substring(start, end);
    }
  }, {
    key: "insertTextAt",
    value: function insertTextAt(text, pos) {
      return this.text(this.text().substring(0, pos) + text + this.text().substring(pos, this.text().length));
    }
  }, {
    key: "spliceText",
    value: function spliceText(start, end, text) {
      return this.text(this.text().slice(0, start) + (text || "") + this.text().slice(end));
    }
  }, {
    key: "getCursorPos",
    value: function getCursorPos() {
      return this.target;
    }
  }, {
    key: "setCursorPos",
    value: function setCursorPos(start, end) {
      if (arguments.length < 2) {
        end = start;
      }

      return this.target = new Pos(start, end);
    }
  }]);

  return TextParser;
}(Editor);

exports.TextParser = TextParser;

},{"./Editor":9,"./positioning/Pos":37}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Codewave", {
  enumerable: true,
  get: function get() {
    return Codewave;
  }
});

var Codewave = require("./Codewave").Codewave;

var Command = require("./Command").Command;

var CoreCommandProvider = require("./cmds/CoreCommandProvider").CoreCommandProvider;

var JsCommandProvider = require("./cmds/JsCommandProvider").JsCommandProvider;

var PhpCommandProvider = require("./cmds/PhpCommandProvider").PhpCommandProvider;

var HtmlCommandProvider = require("./cmds/HtmlCommandProvider").HtmlCommandProvider;

var FileCommandProvider = require("./cmds/FileCommandProvider").FileCommandProvider;

var StringCommandProvider = require("./cmds/StringCommandProvider").StringCommandProvider;

var Pos = require("./positioning/Pos").Pos;

var WrappedPos = require("./positioning/WrappedPos").WrappedPos;

var LocalStorageEngine = require("./storageEngines/LocalStorageEngine").LocalStorageEngine;

var Context = require("./Context").Context;

var CmdInstance = require("./CmdInstance").CmdInstance;

var CmdFinder = require("./CmdFinder").CmdFinder;

Context.cmdInstanceClass = CmdInstance;
Context.cmdFinderClass = CmdFinder;
Pos.wrapClass = WrappedPos;
Codewave.instances = [];
Command.providers = [new CoreCommandProvider(), new JsCommandProvider(), new PhpCommandProvider(), new HtmlCommandProvider(), new FileCommandProvider(), new StringCommandProvider()];

if (typeof localStorage !== "undefined" && localStorage !== null) {
  Command.storage = new LocalStorageEngine();
}

},{"./CmdFinder":3,"./CmdInstance":4,"./Codewave":5,"./Command":6,"./Context":7,"./cmds/CoreCommandProvider":18,"./cmds/FileCommandProvider":19,"./cmds/HtmlCommandProvider":20,"./cmds/JsCommandProvider":21,"./cmds/PhpCommandProvider":22,"./cmds/StringCommandProvider":23,"./positioning/Pos":37,"./positioning/WrappedPos":42,"./storageEngines/LocalStorageEngine":44}],18:[function(require,module,exports){
"use strict";

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Command = require("../Command").Command;

var BaseCommand = require("../Command").BaseCommand;

var LangDetector = require("../detectors/LangDetector").LangDetector;

var AlwaysEnabled = require("../detectors/AlwaysEnabled").AlwaysEnabled;

var BoxHelper = require("../BoxHelper").BoxHelper;

var EditCmdProp = require("../EditCmdProp").EditCmdProp;

var StringHelper = require("../helpers/StringHelper").StringHelper;

var PathHelper = require("../helpers/PathHelper").PathHelper;

var Replacement = require("../positioning/Replacement").Replacement;

var BoxCmd, CloseCmd, EditCmd, EmmetCmd, NameSpaceCmd, TemplateCmd, aliasCommand, exec_parent, getCommand, getContent, getParam, help, listCommand, no_execute, quote_carret, removeCommand, renameCommand, setCommand, storeJsonCommand;

var CoreCommandProvider =
/*#__PURE__*/
function () {
  function CoreCommandProvider() {
    _classCallCheck(this, CoreCommandProvider);
  }

  _createClass(CoreCommandProvider, [{
    key: "register",
    value: function register(cmds) {
      var core;
      core = cmds.addCmd(new Command('core'));
      cmds.addDetector(new AlwaysEnabled('core'));
      core.addDetector(new LangDetector());
      return core.addCmds({
        'help': {
          'replaceBox': true,
          'result': help,
          'parse': true,
          'allowedNamed': ['cmd'],
          'help': "To get help on a pecific command, do :\n~~help hello~~ (hello being the command)",
          'cmds': {
            'overview': {
              'replaceBox': true,
              'result': "~~box~~\n~~quote_carret~~\n  ___         _   __      __\n / __|___  __| |__\\ \\    / /_ ___ ______\n/ /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/\n\\____\\___/\\__,_\\___|\\_/\\_/\\__,_|\\_/\\___|\nThe text editor helper\n~~/quote_carret~~\n\nWhen using Codewave you will be writing commands within \nyour text editor. These commands must be placed between two \npairs of \"~\" (tilde) and then, they can be executed by pressing \n\"ctrl\"+\"shift\"+\"e\", with your cursor inside the command\nEx: ~~!hello~~\n\nYou dont need to actually type any \"~\" (tilde). \nPressing \"ctrl\"+\"shift\"+\"e\" will add them if you are not already\nwithin a command.\n\nCodewave does not use UI to display any information. \nInstead, it uses text within code comments to mimic UIs. \nThe generated comment blocks will be referred to as windows \nin the help sections.\n\nTo close this window (i.e. remove this comment block), press \n\"ctrl\"+\"shift\"+\"e\" with your cursor on the line bellow.\n~~!close|~~\n\nUse the following command for a walkthrough of some of the many\nfeatures of Codewave\n~~!help:get_started~~ or ~~!help:demo~~\n\nList of all help subjects \n~~!help:subjects~~ or ~~!help:sub~~ \n\n~~!close~~\n~~/box~~"
            },
            'subjects': {
              'replaceBox': true,
              'result': "~~box~~\n~~!help~~\n~~!help:get_started~~ (~~!help:demo~~)\n~~!help:subjects~~ (~~!help:sub~~)\n~~!help:editing~~ (~~!help:edit~~)\n~~!close|~~\n~~/box~~"
            },
            'sub': {
              'aliasOf': 'core:help:subjects'
            },
            'get_started': {
              'replaceBox': true,
              'result': "~~box~~\nThe classic Hello World.\n~~!hello|~~\n\n~~help:editing:intro~~\n~~quote_carret~~\n\nFor more information on creating your own commands, see:\n~~!help:editing~~\n\nCodewave comes with many pre-existing commands. Here is an example\nof JavaScript abbreviations\n~~!js:f~~\n~~!js:if~~\n  ~~!js:log~~\"~~!hello~~\"~~!/js:log~~\n~~!/js:if~~\n~~!/js:f~~\n\nCodeWave comes with the excellent Emmet ( http://emmet.io/ ) to \nprovide event more abbreviations. Emmet abbreviations will be \nused automatically if you are in a HTML or CSS file.\n~~!ul>li~~ (if you are in a html doccument)\n~~!emmet ul>li~~\n~~!emmet m2 css~~\n\nCommands are stored in namespaces. The same command can have \ndifferent results depending on the namespace.\n~~!js:each~~\n~~!php:outer:each~~\n~~!php:inner:each~~\n\nSome of the namespaces are active depending on the context. The\nfollowing commands are the same and will display the currently\nactive namespace. The first command command works because the \ncore namespace is active.\n~~!namespace~~\n~~!core:namespace~~\n\nYou can make a namespace active with the following command.\n~~!namespace php~~\n\nCheck the namespaces again\n~~!namespace~~\n\nIn addition to detecting the document type, Codewave can detect the\ncontext from the surrounding text. In a PHP file, it means Codewave \nwill add the PHP tags when you need them.\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
            },
            'demo': {
              'aliasOf': 'core:help:get_started'
            },
            'editing': {
              'cmds': {
                'intro': {
                  'result': "Codewave allows you to make your own commands (or abbreviations) \nput your content inside \"source\" the do \"save\". Try adding any \ntext that is on your mind.\n~~!edit my_new_command|~~\n\nIf you did the last step right, you should see your text when you\ndo the following command. It is now saved and you can use it \nwhenever you want.\n~~!my_new_command~~"
                }
              },
              'replaceBox': true,
              'result': "~~box~~\n~~help:editing:intro~~\n\nAll the windows of Codewave are made with the command \"box\". \nThey are meant to display text that should not remain in your code. \nThey are valid comments so they won't break your code and the command \n\"close\" can be used to remove them rapidly. You can make your own \ncommands with them if you need to display some text temporarily.\n~~!box~~\nThe box will scale with the content you put in it\n~~!close|~~\n~~!/box~~\n\n~~quote_carret~~\nWhen you create a command, you may want to specify where the cursor \nwill be located once the command is expanded. To do that, use a \"|\" \n(Vertical bar). Use 2 of them if you want to print the actual \ncharacter.\n~~!box~~\none : | \ntwo : ||\n~~!/box~~\n\nYou can also use the \"escape_pipes\" command that will escape any \nvertical bars that are between its opening and closing tags\n~~!escape_pipes~~\n|\n~~!/escape_pipes~~\n\nCommands inside other commands will be expanded automatically.\nIf you want to print a command without having it expand when \nthe parent command is expanded, use a \"!\" (exclamation mark).\n~~!!hello~~\n\nFor commands that have both an opening and a closing tag, you can use\nthe \"content\" command. \"content\" will be replaced with the text\nthat is between the tags. Here is an example of how it can be used.\n~~!edit php:inner:if~~\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
            },
            'edit': {
              'aliasOf': 'core:help:editing'
            },
            'not_found': "~~box~~\nCommand not found\n~~!close|~~\n~~/box~~"
          }
        },
        'no_execute': {
          'result': no_execute,
          'help': "Prevent everything inside the open and close tag from executing"
        },
        'escape_pipes': {
          'result': quote_carret,
          'checkCarret': false,
          'help': "Escape all carrets (from \"|\" to \"||\")"
        },
        'quote_carret': {
          'aliasOf': 'core:escape_pipes'
        },
        'exec_parent': {
          'execute': exec_parent,
          'help': "Execute the first command that wrap this in it's open and close tag"
        },
        'content': {
          'result': getContent,
          'help': "Mainly used for command edition, \nthis will return what was between the open and close tag of a command"
        },
        'box': {
          'cls': BoxCmd,
          'help': "Create the apparence of a box composed from characters. \nUsually wrapped in a comment.\n\nThe box will try to ajust it's size from the content"
        },
        'close': {
          'cls': CloseCmd,
          'help': "Will close the first box around this"
        },
        'param': {
          'result': getParam,
          'help': "Mainly used for command edition, \nthis will return a parameter from this command call\n\nYou can pass a number, a string, or both. \nA number for a positioned argument and a string\nfor a named parameter"
        },
        'edit': {
          'cmds': EditCmd.setCmds({
            'save': {
              'aliasOf': 'core:exec_parent'
            }
          }),
          'cls': EditCmd,
          'allowedNamed': ['cmd'],
          'help': "Allows to edit a command. \nSee ~~!help:editing~~ for a quick tutorial"
        },
        'rename': {
          'cmds': {
            'not_applicable': "~~box~~\nYou can only rename commands that you created yourself.\n~~!close|~~\n~~/box~~",
            'not_found': "~~box~~\nCommand not found\n~~!close|~~\n~~/box~~"
          },
          'result': renameCommand,
          'parse': true,
          'allowedNamed': ['from', 'to'],
          'help': "Allows to rename a command and change it's namespace. \nYou can only rename commands that you created yourself.\n- The first param is the old name\n- Then second param is the new name, if it has no namespace,\n  it will use the one from the original command.\n\nex.: ~~!rename my_command my_command2~~"
        },
        'remove': {
          'cmds': {
            'not_applicable': "~~box~~\nYou can only remove commands that you created yourself.\n~~!close|~~\n~~/box~~",
            'not_found': "~~box~~\nCommand not found\n~~!close|~~\n~~/box~~"
          },
          'result': removeCommand,
          'parse': true,
          'allowedNamed': ['cmd'],
          'help': "Allows to remove a command. \nYou can only remove commands that you created yourself."
        },
        'alias': {
          'cmds': {
            'not_found': "~~box~~\nCommand not found\n~~!close|~~\n~~/box~~"
          },
          'result': aliasCommand,
          'parse': true
        },
        'namespace': {
          'cls': NameSpaceCmd,
          'help': "Show the current namespaces.\n\nA name space could be the name of the language\nor other kind of contexts\n\nIf you pass a param to this command, it will \nadd the param as a namespace for the current editor"
        },
        'nspc': {
          'aliasOf': 'core:namespace'
        },
        'list': {
          'result': listCommand,
          'allowedNamed': ['name', 'box', 'context'],
          'replaceBox': true,
          'parse': true,
          'help': "List available commands\n\nYou can use the first argument to choose a specific namespace, \nby default all curent namespace will be shown"
        },
        'ls': {
          'aliasOf': 'core:list'
        },
        'get': {
          'result': getCommand,
          'allowedNamed': ['name'],
          'help': "output the value of a variable"
        },
        'set': {
          'result': setCommand,
          'allowedNamed': ['name', 'value', 'val'],
          'help': "set the value of a variable"
        },
        'store_json': {
          'result': storeJsonCommand,
          'allowedNamed': ['name', 'json'],
          'help': "set a variable with some json data"
        },
        'json': {
          'aliasOf': 'core:store_json'
        },
        'template': {
          'cls': TemplateCmd,
          'allowedNamed': ['name', 'sep'],
          'help': "render a template for a variable\n\nIf the first param is not set it will use all variables \nfor the render\nIf the variable is an array the template will be repeated \nfor each items\nThe `sep` param define what will separate each item \nand default to a line break"
        },
        'emmet': {
          'cls': EmmetCmd,
          'help': "CodeWave comes with the excellent Emmet ( http://emmet.io/ ) to \nprovide event more abbreviations.\n\nPass the Emmet abbreviation as a param to expend it."
        }
      });
    }
  }]);

  return CoreCommandProvider;
}();

exports.CoreCommandProvider = CoreCommandProvider;

help = function help(instance) {
  var cmd, cmdName, helpCmd, subcommands, text;
  cmdName = instance.getParam([0, 'cmd']);

  if (cmdName != null) {
    cmd = instance.context.getParentOrRoot().getCmd(cmdName);

    if (cmd != null) {
      helpCmd = cmd.getCmd('help');
      text = helpCmd ? "~~".concat(helpCmd.fullName, "~~") : "This command has no help text";
      subcommands = cmd.cmds.length ? "\nSub-Commands :\n~~ls ".concat(cmd.fullName, " box:no context:no~~") : "";
      return "~~box~~\nHelp for ~~!".concat(cmd.fullName, "~~ :\n\n").concat(text, "\n").concat(subcommands, "\n\n~~!close|~~\n~~/box~~");
    } else {
      return "~~not_found~~";
    }
  } else {
    return '~~help:overview~~';
  }
};

no_execute = function no_execute(instance) {
  var reg;
  reg = new RegExp("^(" + StringHelper.escapeRegExp(instance.codewave.brakets) + ')' + StringHelper.escapeRegExp(instance.codewave.noExecuteChar));
  return instance.str.replace(reg, '$1');
};

quote_carret = function quote_carret(instance) {
  return instance.content.replace(/\|/g, '||');
};

exec_parent = function exec_parent(instance) {
  var res;

  if (instance.parent != null) {
    res = instance.parent.execute();
    instance.replaceStart = instance.parent.replaceStart;
    instance.replaceEnd = instance.parent.replaceEnd;
    return res;
  }
};

getContent = function getContent(instance) {
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

renameCommand = function renameCommand(instance) {
  return Promise.resolve().then(function () {
    var storage;
    storage = Command.storage;
    return storage.load('cmds');
  }).then(function (savedCmds) {
    var cmd, cmdData, newName, origninalName;
    origninalName = instance.getParam([0, 'from']);
    newName = instance.getParam([1, 'to']);

    if (origninalName != null && newName != null) {
      cmd = instance.context.getParentOrRoot().getCmd(origninalName);

      if (savedCmds[origninalName] != null && cmd != null) {
        if (!(newName.indexOf(':') > -1)) {
          newName = cmd.fullName.replace(origninalName, '') + newName;
        }

        cmdData = savedCmds[origninalName];
        Command.cmds.setCmdData(newName, cmdData);
        cmd.unregister();
        savedCmds[newName] = cmdData;
        delete savedCmds[origninalName];
        return Promise.resolve().then(function () {
          return storage.save('cmds', savedCmds);
        }).then(function () {
          return "";
        });
      } else if (cmd != null) {
        return "~~not_applicable~~";
      } else {
        return "~~not_found~~";
      }
    }
  });
};

removeCommand = function removeCommand(instance) {
  return Promise.resolve().then(function () {
    var name;
    name = instance.getParam([0, 'cmd']);

    if (name != null) {
      return Promise.resolve().then(function () {
        var savedCmds, storage;
        storage = Command.storage;
        return savedCmds = storage.load('cmds');
      }).then(function (savedCmds) {
        var cmd, cmdData;
        cmd = instance.context.getParentOrRoot().getCmd(name);

        if (savedCmds[name] != null && cmd != null) {
          cmdData = savedCmds[name];
          cmd.unregister();
          delete savedCmds[name];
          return Promise.resolve().then(function () {
            return storage.save('cmds', savedCmds);
          }).then(function () {
            return "";
          });
        } else if (cmd != null) {
          return "~~not_applicable~~";
        } else {
          return "~~not_found~~";
        }
      });
    }
  });
};

aliasCommand = function aliasCommand(instance) {
  var alias, cmd, name;
  name = instance.getParam([0, 'name']);
  alias = instance.getParam([1, 'alias']);

  if (name != null && alias != null) {
    cmd = instance.context.getCmd(name);

    if (cmd != null) {
      cmd = cmd.getAliased() || cmd; // unless alias.indexOf(':') > -1
      // alias = cmd.fullName.replace(name,'') + alias

      Command.saveCmd(alias, {
        aliasOf: cmd.fullName
      });
      return "";
    } else {
      return "~~not_found~~";
    }
  }
};

listCommand = function listCommand(instance) {
  var box, commands, context, name, namespaces, text, useContext;
  box = instance.getBoolParam(['box'], true);
  useContext = instance.getBoolParam(['context'], true);
  name = instance.getParam([0, 'name']);
  namespaces = name ? [name] : instance.context.getNameSpaces().filter(function (nspc) {
    return nspc !== instance.cmd.fullName;
  }).concat("_root");
  context = useContext ? instance.context.getParentOrRoot() : instance.codewave.getRoot().context;
  commands = namespaces.reduce(function (commands, nspc) {
    var cmd;
    cmd = nspc === "_root" ? Command.cmds : context.getCmd(nspc, {
      mustExecute: false
    });

    if (cmd != null) {
      cmd.init();

      if (cmd.cmds) {
        commands = commands.concat(cmd.cmds);
      }
    }

    return commands;
  }, []);
  text = commands.length ? commands.map(function (cmd) {
    cmd.init();
    return (cmd.isExecutable() ? '~~!' : '~~!ls ') + cmd.fullName + '~~';
  }).join("\n") : "This contains no sub-commands";

  if (box) {
    return "~~box~~\n".concat(text, "\n\n~~!close|~~\n~~/box~~");
  } else {
    return text;
  }
};

getCommand = function getCommand(instance) {
  var name, res;
  name = instance.getParam([0, 'name']);
  res = PathHelper.getPath(instance.codewave.vars, name);

  if (_typeof(res) === "object") {
    return JSON.stringify(res, null, '  ');
  } else {
    return res;
  }
};

setCommand = function setCommand(instance) {
  var name, p, val;
  name = instance.getParam([0, 'name']);
  val = (p = instance.getParam([1, 'value', 'val'])) != null ? p : instance.content ? instance.content : void 0;
  PathHelper.setPath(instance.codewave.vars, name, val);
  return '';
};

storeJsonCommand = function storeJsonCommand(instance) {
  var name, p, val;
  name = instance.getParam([0, 'name']);
  val = (p = instance.getParam([1, 'json'])) != null ? p : instance.content ? instance.content : void 0;
  PathHelper.setPath(instance.codewave.vars, name, JSON.parse(val));
  return '';
};

getParam = function getParam(instance) {
  if (instance.codewave.inInstance != null) {
    return instance.codewave.inInstance.getParam(instance.params, instance.getParam(['def', 'default']));
  }
};

BoxCmd =
/*#__PURE__*/
function (_BaseCommand) {
  _inherits(BoxCmd, _BaseCommand);

  function BoxCmd() {
    _classCallCheck(this, BoxCmd);

    return _possibleConstructorReturn(this, _getPrototypeOf(BoxCmd).apply(this, arguments));
  }

  _createClass(BoxCmd, [{
    key: "init",
    value: function init() {
      this.helper = new BoxHelper(this.instance.context);
      this.cmd = this.instance.getParam(['cmd']);

      if (this.cmd != null) {
        this.helper.openText = this.instance.codewave.brakets + this.cmd + this.instance.codewave.brakets;
        this.helper.closeText = this.instance.codewave.brakets + this.instance.codewave.closeChar + this.cmd.split(" ")[0] + this.instance.codewave.brakets;
      }

      this.helper.deco = this.instance.codewave.deco;
      this.helper.pad = 2;
      this.helper.prefix = this.instance.getParam(['prefix'], '');
      return this.helper.suffix = this.instance.getParam(['suffix'], '');
    }
  }, {
    key: "height",
    value: function height() {
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
    }
  }, {
    key: "width",
    value: function width() {
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
    }
  }, {
    key: "bounds",
    value: function bounds() {
      if (this.instance.content) {
        if (this._bounds == null) {
          this._bounds = this.helper.textBounds(this.instance.content);
        }

        return this._bounds;
      }
    }
  }, {
    key: "result",
    value: function result() {
      this.helper.height = this.height();
      this.helper.width = this.width();
      return this.helper.draw(this.instance.content);
    }
  }, {
    key: "minWidth",
    value: function minWidth() {
      if (this.cmd != null) {
        return this.cmd.length;
      } else {
        return 0;
      }
    }
  }]);

  return BoxCmd;
}(BaseCommand);

CloseCmd =
/*#__PURE__*/
function (_BaseCommand2) {
  _inherits(CloseCmd, _BaseCommand2);

  function CloseCmd() {
    _classCallCheck(this, CloseCmd);

    return _possibleConstructorReturn(this, _getPrototypeOf(CloseCmd).apply(this, arguments));
  }

  _createClass(CloseCmd, [{
    key: "init",
    value: function init() {
      return this.helper = new BoxHelper(this.instance.context);
    }
  }, {
    key: "execute",
    value: function execute() {
      var box, box2, depth, prefix, required_affixes, suffix;
      prefix = this.helper.prefix = this.instance.getParam(['prefix'], '');
      suffix = this.helper.suffix = this.instance.getParam(['suffix'], '');
      box = this.helper.getBoxForPos(this.instance.getPos());
      required_affixes = this.instance.getParam(['required_affixes'], true);

      if (!required_affixes) {
        this.helper.prefix = this.helper.suffix = '';
        box2 = this.helper.getBoxForPos(this.instance.getPos());

        if (box2 != null && (box == null || box.start < box2.start - prefix.length || box.end > box2.end + suffix.length)) {
          box = box2;
        }
      }

      if (box != null) {
        depth = this.helper.getNestedLvl(this.instance.getPos().start);

        if (depth < 2) {
          this.instance.inBox = null;
        }

        return this.instance.applyReplacement(new Replacement(box.start, box.end, ''));
      } else {
        return this.instance.replaceWith('');
      }
    }
  }]);

  return CloseCmd;
}(BaseCommand);

EditCmd =
/*#__PURE__*/
function (_BaseCommand3) {
  _inherits(EditCmd, _BaseCommand3);

  function EditCmd() {
    _classCallCheck(this, EditCmd);

    return _possibleConstructorReturn(this, _getPrototypeOf(EditCmd).apply(this, arguments));
  }

  _createClass(EditCmd, [{
    key: "init",
    value: function init() {
      var ref;
      this.cmdName = this.instance.getParam([0, 'cmd']);
      this.verbalize = (ref = this.instance.getParam([1])) === 'v' || ref === 'verbalize';

      if (this.cmdName != null) {
        this.finder = this.instance.context.getParentOrRoot().getFinder(this.cmdName);
        this.finder.useFallbacks = false;
        this.cmd = this.finder.find();
      }

      return this.editable = this.cmd != null ? this.cmd.isEditable() : true;
    }
  }, {
    key: "result",
    value: function result() {
      if (this.instance.content) {
        return this.resultWithContent();
      } else {
        return this.resultWithoutContent();
      }
    }
  }, {
    key: "resultWithContent",
    value: function resultWithContent() {
      var data, i, len, p, parser, ref;
      parser = this.instance.getParserForText(this.instance.content);
      parser.parseAll();
      data = {};
      ref = EditCmd.props;

      for (i = 0, len = ref.length; i < len; i++) {
        p = ref[i];
        p.writeFor(parser, data);
      }

      Command.saveCmd(this.cmdName, data);
      return '';
    }
  }, {
    key: "propsDisplay",
    value: function propsDisplay() {
      var cmd;
      cmd = this.cmd;
      return EditCmd.props.map(function (p) {
        return p.display(cmd);
      }).filter(function (p) {
        return p != null;
      }).join("\n");
    }
  }, {
    key: "resultWithoutContent",
    value: function resultWithoutContent() {
      var name, parser;

      if (!this.cmd || this.editable) {
        name = this.cmd ? this.cmd.fullName : this.cmdName;
        parser = this.instance.getParserForText("~~box cmd:\"".concat(this.instance.cmd.fullName, " ").concat(name, "\"~~\n").concat(this.propsDisplay(), "\n~~!save~~ ~~!close~~\n~~/box~~"));
        parser.checkCarret = false;

        if (this.verbalize) {
          return parser.getText();
        } else {
          return parser.parseAll();
        }
      }
    }
  }]);

  return EditCmd;
}(BaseCommand);

EditCmd.setCmds = function (base) {
  var i, inInstance, len, p, ref;
  inInstance = base.in_instance = {
    cmds: {}
  };
  ref = EditCmd.props;

  for (i = 0, len = ref.length; i < len; i++) {
    p = ref[i];
    p.setCmd(inInstance.cmds);
  } // p.setCmd(base)


  return base;
};

EditCmd.props = [new EditCmdProp.revBool('no_carret', {
  opt: 'checkCarret'
}), new EditCmdProp.revBool('no_parse', {
  opt: 'parse'
}), new EditCmdProp.bool('prevent_parse_all', {
  opt: 'preventParseAll'
}), new EditCmdProp.bool('replace_box', {
  opt: 'replaceBox'
}), new EditCmdProp.string('name_to_param', {
  opt: 'nameToParam'
}), new EditCmdProp.string('alias_of', {
  "var": 'aliasOf',
  carret: true
}), new EditCmdProp.source('help', {
  funct: 'help',
  showEmpty: true
}), new EditCmdProp.source('source', {
  "var": 'resultStr',
  dataName: 'result',
  showEmpty: true,
  carret: true
})];

NameSpaceCmd =
/*#__PURE__*/
function (_BaseCommand4) {
  _inherits(NameSpaceCmd, _BaseCommand4);

  function NameSpaceCmd() {
    _classCallCheck(this, NameSpaceCmd);

    return _possibleConstructorReturn(this, _getPrototypeOf(NameSpaceCmd).apply(this, arguments));
  }

  _createClass(NameSpaceCmd, [{
    key: "init",
    value: function init() {
      return this.name = this.instance.getParam([0]);
    }
  }, {
    key: "result",
    value: function result() {
      var i, len, namespaces, nspc, parser, txt;

      if (this.name != null) {
        this.instance.codewave.getRoot().context.addNameSpace(this.name);
        return '';
      } else {
        namespaces = this.instance.context.getNameSpaces();
        txt = '~~box~~\n';

        for (i = 0, len = namespaces.length; i < len; i++) {
          nspc = namespaces[i];

          if (nspc !== this.instance.cmd.fullName) {
            txt += nspc + '\n';
          }
        }

        txt += '~~!close|~~\n~~/box~~';
        parser = this.instance.getParserForText(txt);
        return parser.parseAll();
      }
    }
  }]);

  return NameSpaceCmd;
}(BaseCommand);

TemplateCmd =
/*#__PURE__*/
function (_BaseCommand5) {
  _inherits(TemplateCmd, _BaseCommand5);

  function TemplateCmd() {
    _classCallCheck(this, TemplateCmd);

    return _possibleConstructorReturn(this, _getPrototypeOf(TemplateCmd).apply(this, arguments));
  }

  _createClass(TemplateCmd, [{
    key: "init",
    value: function init() {
      this.name = this.instance.getParam([0, 'name']);
      return this.sep = this.instance.getParam(['sep'], "\n");
    }
  }, {
    key: "result",
    value: function result() {
      var _this = this;

      var data;
      data = this.name ? PathHelper.getPath(this.instance.codewave.vars, this.name) : this.instance.codewave.vars;

      if (this.instance.content && data != null && data !== false) {
        if (Array.isArray(data)) {
          return data.map(function (item) {
            return _this.renderTemplate(item);
          }).join(this.sep);
        } else {
          return this.renderTemplate(data);
        }
      } else {
        return '';
      }
    }
  }, {
    key: "renderTemplate",
    value: function renderTemplate(data) {
      var parser;
      parser = this.instance.getParserForText(this.instance.content);
      parser.vars = _typeof(data) === "object" ? data : {
        value: data
      };
      parser.checkCarret = false;
      return parser.parseAll();
    }
  }]);

  return TemplateCmd;
}(BaseCommand);

EmmetCmd =
/*#__PURE__*/
function (_BaseCommand6) {
  _inherits(EmmetCmd, _BaseCommand6);

  function EmmetCmd() {
    _classCallCheck(this, EmmetCmd);

    return _possibleConstructorReturn(this, _getPrototypeOf(EmmetCmd).apply(this, arguments));
  }

  _createClass(EmmetCmd, [{
    key: "init",
    value: function init() {
      this.abbr = this.instance.getParam([0, 'abbr', 'abbreviation']);
      return this.lang = this.instance.getParam([1, 'lang', 'language']);
    }
  }, {
    key: "result",
    value: function result() {
      var emmet, ex, res;

      emmet = function () {
        var ref, ref1;

        if ((typeof window !== "undefined" && window !== null ? window.emmet : void 0) != null) {
          return window.emmet;
        } else if ((typeof window !== "undefined" && window !== null ? (ref = window.self) != null ? ref.emmet : void 0 : void 0) != null) {
          return window.self.emmet;
        } else if ((typeof window !== "undefined" && window !== null ? (ref1 = window.global) != null ? ref1.emmet : void 0 : void 0) != null) {
          return window.global.emmet;
        } else if (typeof require !== "undefined" && require !== null) {
          try {
            return require('emmet');
          } catch (error) {
            ex = error;
            this.instance.codewave.logger.log('Emmet is not available, it may need to be installed manually');
            return null;
          }
        }
      }.call(this);

      if (emmet != null) {
        // emmet.require('./parser/abbreviation').expand('ul>li', {pastedContent:'lorem'})
        res = emmet.expandAbbreviation(this.abbr, this.lang);
        return res.replace(/\$\{0\}/g, '|');
      }
    }
  }]);

  return EmmetCmd;
}(BaseCommand);

},{"../BoxHelper":1,"../Command":6,"../EditCmdProp":8,"../detectors/AlwaysEnabled":24,"../detectors/LangDetector":26,"../helpers/PathHelper":33,"../helpers/StringHelper":34,"../positioning/Replacement":39,"emmet":"emmet"}],19:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Command = require("../Command").Command;

var BoxHelper = require("../BoxHelper").BoxHelper;

var EditCmdProp = require("../EditCmdProp").EditCmdProp;

var StringHelper = require("../helpers/StringHelper").StringHelper;

var PathHelper = require("../helpers/PathHelper").PathHelper;

var Replacement = require("../positioning/Replacement").Replacement;

var deleteCommand, readCommand, writeCommand;

var FileCommandProvider =
/*#__PURE__*/
function () {
  function FileCommandProvider() {
    _classCallCheck(this, FileCommandProvider);
  }

  _createClass(FileCommandProvider, [{
    key: "register",
    value: function register(cmds) {
      var core;
      core = cmds.addCmd(new Command('file'));
      return core.addCmds({
        "read": {
          'result': readCommand,
          'allowedNamed': ['file'],
          'help': "read the content of a file"
        },
        "write": {
          'result': writeCommand,
          'allowedNamed': ['file', 'content'],
          'help': "save into a file"
        },
        "delete": {
          'result': deleteCommand,
          'allowedNamed': ['file'],
          'help': "delete a file"
        }
      });
    }
  }]);

  return FileCommandProvider;
}();

exports.FileCommandProvider = FileCommandProvider;

readCommand = function readCommand(instance) {
  var file, fileSystem;
  fileSystem = instance.codewave.getFileSystem();
  file = instance.getParam([0, 'file']);

  if (fileSystem) {
    return fileSystem.readFile(file);
  }
};

writeCommand = function writeCommand(instance) {
  var content, file, fileSystem;
  fileSystem = instance.codewave.getFileSystem();
  file = instance.getParam([0, 'file']);
  content = instance.content || instance.getParam([1, 'content']);

  if (fileSystem) {
    return fileSystem.writeFile(file, content);
  }
};

deleteCommand = function deleteCommand(instance) {
  var file, fileSystem;
  fileSystem = instance.codewave.getFileSystem();
  file = instance.getParam([0, 'file']);

  if (fileSystem) {
    return fileSystem.deleteFile(file);
  }
};

},{"../BoxHelper":1,"../Command":6,"../EditCmdProp":8,"../helpers/PathHelper":33,"../helpers/StringHelper":34,"../positioning/Replacement":39}],20:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Command = require("../Command").Command;

var HtmlCommandProvider =
/*#__PURE__*/
function () {
  function HtmlCommandProvider() {
    _classCallCheck(this, HtmlCommandProvider);
  }

  _createClass(HtmlCommandProvider, [{
    key: "register",
    value: function register(cmds) {
      var css, html;
      html = cmds.addCmd(new Command('html'));
      html.addCmds({
        'fallback': {
          'aliasOf': 'core:emmet',
          'defaults': {
            'lang': 'html'
          },
          'nameToParam': 'abbr'
        }
      });
      css = cmds.addCmd(new Command('css'));
      return css.addCmds({
        'fallback': {
          'aliasOf': 'core:emmet',
          'defaults': {
            'lang': 'css'
          },
          'nameToParam': 'abbr'
        }
      });
    }
  }]);

  return HtmlCommandProvider;
}();

exports.HtmlCommandProvider = HtmlCommandProvider;

},{"../Command":6}],21:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Command = require("../Command").Command;

var JsCommandProvider =
/*#__PURE__*/
function () {
  function JsCommandProvider() {
    _classCallCheck(this, JsCommandProvider);
  }

  _createClass(JsCommandProvider, [{
    key: "register",
    value: function register(cmds) {
      var js;
      js = cmds.addCmd(new Command('js'));
      cmds.addCmd(new Command('javascript', {
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
        'forin': 'for (var val in |) {\n\t~~content~~\n}',
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
    }
  }]);

  return JsCommandProvider;
}();

exports.JsCommandProvider = JsCommandProvider;

},{"../Command":6}],22:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringHelper = require("../helpers/StringHelper").StringHelper;

var Command = require("../Command").Command;

var PairDetector = require("../detectors/PairDetector").PairDetector;

var wrapWithPhp;

var PhpCommandProvider =
/*#__PURE__*/
function () {
  function PhpCommandProvider() {
    _classCallCheck(this, PhpCommandProvider);
  }

  _createClass(PhpCommandProvider, [{
    key: "register",
    value: function register(cmds) {
      var php, phpInner, phpOuter;
      php = cmds.addCmd(new Command('php'));
      php.addDetector(new PairDetector({
        result: 'php:inner',
        opener: '<?php',
        closer: '?>',
        optionnal_end: true,
        'else': 'php:outer'
      }));
      phpOuter = php.addCmd(new Command('outer'));
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
      phpInner = php.addCmd(new Command('inner'));
      return phpInner.addCmds({
        'any_content': {
          aliasOf: 'core:content'
        },
        'comment': '/* ~~content~~ */',
        'if': 'if(|){\n\t~~any_content~~\n}',
        'info': 'phpinfo();',
        'echo': 'echo |',
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
    }
  }]);

  return PhpCommandProvider;
}();

exports.PhpCommandProvider = PhpCommandProvider;

wrapWithPhp = function wrapWithPhp(result, instance) {
  var inline, regClose, regOpen;
  inline = instance.getParam(['php_inline', 'inline'], true);

  if (inline) {
    regOpen = /<\?php\s([\\n\\r\s]+)/g;
    regClose = /([\n\r\s]+)\s\?>/g;
    return '<?php ' + result.replace(regOpen, '$1<?php ').replace(regClose, ' ?>$1') + ' ?>';
  } else {
    return '<?php\n' + StringHelper.indent(result) + '\n?>';
  }
}; // closePhpForContent = (instance) ->
//   instance.content = ' ?>'+(instance.content || '')+'<?php '

},{"../Command":6,"../detectors/PairDetector":27,"../helpers/StringHelper":34}],23:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Command = require("../Command").Command;

var AlwaysEnabled = require("../detectors/AlwaysEnabled").AlwaysEnabled;

var inflection = interopRequireWildcard(require("inflection"));

function interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

var StringCommandProvider =
/*#__PURE__*/
function () {
  function StringCommandProvider() {
    _classCallCheck(this, StringCommandProvider);
  }

  _createClass(StringCommandProvider, [{
    key: "register",
    value: function register(root) {
      var cmds;
      cmds = root.addCmd(new Command('string'));
      root.addCmd(new Command('str', {
        aliasOf: 'string'
      }));
      root.addDetector(new AlwaysEnabled('string'));
      return cmds.addCmds({
        'pluralize': {
          'result': function result(instance) {
            return inflection.pluralize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Pluralize a string"
        },
        'singularize': {
          'result': function result(instance) {
            return inflection.singularize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Singularize a string"
        },
        'camelize': {
          'result': function result(instance) {
            return inflection.camelize(instance.getParam([0, 'str']), !instance.getBoolParam([1, 'first'], true));
          },
          'allowedNamed': ['str', 'first'],
          'help': "Transforms a String from underscore to camelcase"
        },
        'underscore': {
          'result': function result(instance) {
            return inflection.underscore(instance.getParam([0, 'str']), instance.getBoolParam([1, 'upper']));
          },
          'allowedNamed': ['str', 'upper'],
          'help': "Transforms a String from camelcase to underscore."
        },
        'humanize': {
          'result': function result(instance) {
            return inflection.humanize(instance.getParam([0, 'str']), instance.getBoolParam([1, 'first']));
          },
          'allowedNamed': ['str', 'first'],
          'help': "Transforms a String to a human readable format"
        },
        'capitalize': {
          'result': function result(instance) {
            return inflection.capitalize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Make the first letter of a string upper"
        },
        'dasherize': {
          'result': function result(instance) {
            return inflection.dasherize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Replaces underscores with dashes in a string."
        },
        'titleize': {
          'result': function result(instance) {
            return inflection.titleize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Transforms a String to a human readable format with most words capitalized"
        },
        'tableize': {
          'result': function result(instance) {
            return inflection.tableize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Transforms a String to a table format"
        },
        'classify': {
          'result': function result(instance) {
            return inflection.classify(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Transforms a String to a class format"
        }
      });
    }
  }]);

  return StringCommandProvider;
}();

exports.StringCommandProvider = StringCommandProvider;

},{"../Command":6,"../detectors/AlwaysEnabled":24,"inflection":52}],24:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Detector = require("./Detector").Detector;

var AlwaysEnabled =
/*#__PURE__*/
function (_Detector) {
  _inherits(AlwaysEnabled, _Detector);

  function AlwaysEnabled(namespace) {
    var _this;

    _classCallCheck(this, AlwaysEnabled);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AlwaysEnabled).call(this));
    _this.namespace = namespace;
    return _this;
  }

  _createClass(AlwaysEnabled, [{
    key: "detect",
    value: function detect(finder) {
      return this.namespace;
    }
  }]);

  return AlwaysEnabled;
}(Detector);

exports.AlwaysEnabled = AlwaysEnabled;

},{"./Detector":25}],25:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Detector =
/*#__PURE__*/
function () {
  function Detector() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Detector);

    this.data = data;
  }

  _createClass(Detector, [{
    key: "detect",
    value: function detect(finder) {
      if (this.detected(finder)) {
        if (this.data.result != null) {
          return this.data.result;
        }
      } else {
        if (this.data["else"] != null) {
          return this.data["else"];
        }
      }
    }
  }, {
    key: "detected",
    value: function detected(finder) {}
  }]);

  return Detector;
}();

exports.Detector = Detector;

},{}],26:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Detector = require("./Detector").Detector;

var LangDetector =
/*#__PURE__*/
function (_Detector) {
  _inherits(LangDetector, _Detector);

  function LangDetector() {
    _classCallCheck(this, LangDetector);

    return _possibleConstructorReturn(this, _getPrototypeOf(LangDetector).apply(this, arguments));
  }

  _createClass(LangDetector, [{
    key: "detect",
    value: function detect(finder) {
      var lang;

      if (finder.codewave != null) {
        lang = finder.codewave.editor.getLang();

        if (lang != null) {
          return lang.toLowerCase();
        }
      }
    }
  }]);

  return LangDetector;
}(Detector);

exports.LangDetector = LangDetector;

},{"./Detector":25}],27:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Pair = require("../positioning/Pair").Pair;

var Detector = require("./Detector").Detector;

var PairDetector =
/*#__PURE__*/
function (_Detector) {
  _inherits(PairDetector, _Detector);

  function PairDetector() {
    _classCallCheck(this, PairDetector);

    return _possibleConstructorReturn(this, _getPrototypeOf(PairDetector).apply(this, arguments));
  }

  _createClass(PairDetector, [{
    key: "detected",
    value: function detected(finder) {
      var pair;

      if (this.data.opener != null && this.data.closer != null && finder.instance != null) {
        pair = new Pair(this.data.opener, this.data.closer, this.data);

        if (pair.isWapperOf(finder.instance.getPos(), finder.codewave.editor.text())) {
          return true;
        }
      }

      return false;
    }
  }]);

  return PairDetector;
}(Detector);

exports.PairDetector = PairDetector;

},{"../positioning/Pair":35,"./Detector":25}],28:[function(require,module,exports){
"use strict";

var bootstrap = require("./bootstrap");

var TextAreaEditor = require("./TextAreaEditor");

bootstrap.Codewave.detect = function (target) {
  var cw;
  cw = new bootstrap.Codewave(new TextAreaEditor.TextAreaEditor(target));
  bootstrap.Codewave.instances.push(cw);
  return cw;
};

bootstrap.Codewave.require = require;
window.Codewave = bootstrap.Codewave;

},{"./TextAreaEditor":15,"./bootstrap":17}],29:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ArrayHelper =
/*#__PURE__*/
function () {
  function ArrayHelper() {
    _classCallCheck(this, ArrayHelper);
  }

  _createClass(ArrayHelper, null, [{
    key: "isArray",
    value: function isArray(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    }
  }, {
    key: "union",
    value: function union(a1, a2) {
      return this.unique(a1.concat(a2));
    }
  }, {
    key: "unique",
    value: function unique(array) {
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
    }
  }]);

  return ArrayHelper;
}();

exports.ArrayHelper = ArrayHelper;

},{}],30:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CommonHelper =
/*#__PURE__*/
function () {
  function CommonHelper() {
    _classCallCheck(this, CommonHelper);
  }

  _createClass(CommonHelper, null, [{
    key: "merge",
    value: function merge() {
      for (var _len = arguments.length, xs = new Array(_len), _key = 0; _key < _len; _key++) {
        xs[_key] = arguments[_key];
      }

      if ((xs != null ? xs.length : void 0) > 0) {
        return this.tap({}, function (m) {
          var i, k, len, results, v, x;
          results = [];

          for (i = 0, len = xs.length; i < len; i++) {
            x = xs[i];
            results.push(function () {
              var results1;
              results1 = [];

              for (k in x) {
                v = x[k];
                results1.push(m[k] = v);
              }

              return results1;
            }());
          }

          return results;
        });
      }
    }
  }, {
    key: "tap",
    value: function tap(o, fn) {
      fn(o);
      return o;
    }
  }, {
    key: "applyMixins",
    value: function applyMixins(derivedCtor, baseCtors) {
      return baseCtors.forEach(function (baseCtor) {
        return Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
          return Object.defineProperty(derivedCtor, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
      });
    }
  }]);

  return CommonHelper;
}();

exports.CommonHelper = CommonHelper;

},{}],31:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NamespaceHelper =
/*#__PURE__*/
function () {
  function NamespaceHelper() {
    _classCallCheck(this, NamespaceHelper);
  }

  _createClass(NamespaceHelper, null, [{
    key: "splitFirst",
    value: function splitFirst(fullname) {
      var isSpace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var parts;

      if (fullname.indexOf(":") === -1 && !isSpace) {
        return [null, fullname];
      }

      parts = fullname.split(':');
      return [parts.shift(), parts.join(':') || null];
    }
  }, {
    key: "split",
    value: function split(fullname) {
      var name, parts;

      if (fullname.indexOf(":") === -1) {
        return [null, fullname];
      }

      parts = fullname.split(':');
      name = parts.pop();
      return [parts.join(':'), name];
    }
  }]);

  return NamespaceHelper;
}();

exports.NamespaceHelper = NamespaceHelper;

},{}],32:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OptionalPromise =
/*#__PURE__*/
function () {
  function OptionalPromise(val1) {
    _classCallCheck(this, OptionalPromise);

    this.val = val1;

    if (this.val != null && this.val.then != null && this.val.result != null) {
      this.val = this.val.result();
    }
  }

  _createClass(OptionalPromise, [{
    key: "then",
    value: function then(cb) {
      if (this.val != null && this.val.then != null) {
        return new OptionalPromise(this.val.then(cb));
      } else {
        return new OptionalPromise(cb(this.val));
      }
    }
  }, {
    key: "result",
    value: function result() {
      return this.val;
    }
  }]);

  return OptionalPromise;
}();

exports.OptionalPromise = OptionalPromise;

var optionalPromise = function optionalPromise(val) {
  return new OptionalPromise(val);
};

exports.optionalPromise = optionalPromise;

},{}],33:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PathHelper =
/*#__PURE__*/
function () {
  function PathHelper() {
    _classCallCheck(this, PathHelper);
  }

  _createClass(PathHelper, null, [{
    key: "getPath",
    value: function getPath(obj, path) {
      var sep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
      var cur, parts;
      parts = path.split(sep);
      cur = obj;
      parts.find(function (part) {
        cur = cur[part];
        return typeof cur === "undefined";
      });
      return cur;
    }
  }, {
    key: "setPath",
    value: function setPath(obj, path, val) {
      var sep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';
      var last, parts;
      parts = path.split(sep);
      last = parts.pop();
      return parts.reduce(function (cur, part) {
        if (cur[part] != null) {
          return cur[part];
        } else {
          return cur[part] = {};
        }
      }, obj)[last] = val;
    }
  }]);

  return PathHelper;
}();

exports.PathHelper = PathHelper;

},{}],34:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Size = require("../positioning/Size").Size;

var StringHelper =
/*#__PURE__*/
function () {
  function StringHelper() {
    _classCallCheck(this, StringHelper);
  }

  _createClass(StringHelper, null, [{
    key: "trimEmptyLine",
    value: function trimEmptyLine(txt) {
      return txt.replace(/^\s*\r?\n/, '').replace(/\r?\n\s*$/, '');
    }
  }, {
    key: "escapeRegExp",
    value: function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
  }, {
    key: "repeatToLength",
    value: function repeatToLength(txt, length) {
      if (length <= 0) {
        return '';
      }

      return Array(Math.ceil(length / txt.length) + 1).join(txt).substring(0, length);
    }
  }, {
    key: "repeat",
    value: function repeat(txt, nb) {
      return Array(nb + 1).join(txt);
    }
  }, {
    key: "getTxtSize",
    value: function getTxtSize(txt) {
      var j, l, len, lines, w;
      lines = txt.replace(/\r/g, '').split("\n");
      w = 0;

      for (j = 0, len = lines.length; j < len; j++) {
        l = lines[j];
        w = Math.max(w, l.length);
      }

      return new Size(w, lines.length - 1);
    }
  }, {
    key: "indentNotFirst",
    value: function indentNotFirst(text) {
      var nb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var spaces = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '  ';
      var reg;

      if (text != null) {
        reg = /\n/g;
        return text.replace(reg, "\n" + this.repeat(spaces, nb));
      } else {
        return text;
      }
    }
  }, {
    key: "indent",
    value: function indent(text) {
      var nb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var spaces = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '  ';

      if (text != null) {
        return spaces + this.indentNotFirst(text, nb, spaces);
      } else {
        return text;
      }
    }
  }, {
    key: "reverseStr",
    value: function reverseStr(txt) {
      return txt.split("").reverse().join("");
    }
  }, {
    key: "removeCarret",
    value: function removeCarret(txt) {
      var carretChar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '|';
      var reCarret, reQuoted, reTmp, tmp;
      tmp = '[[[[quoted_carret]]]]';
      reCarret = new RegExp(this.escapeRegExp(carretChar), "g");
      reQuoted = new RegExp(this.escapeRegExp(carretChar + carretChar), "g");
      reTmp = new RegExp(this.escapeRegExp(tmp), "g");
      return txt.replace(reQuoted, tmp).replace(reCarret, '').replace(reTmp, carretChar);
    }
  }, {
    key: "getAndRemoveFirstCarret",
    value: function getAndRemoveFirstCarret(txt) {
      var carretChar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '|';
      var pos;
      pos = this.getCarretPos(txt, carretChar);

      if (pos != null) {
        txt = txt.substr(0, pos) + txt.substr(pos + carretChar.length);
        return [pos, txt];
      }
    }
  }, {
    key: "getCarretPos",
    value: function getCarretPos(txt) {
      var carretChar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '|';
      var i, reQuoted;
      reQuoted = new RegExp(this.escapeRegExp(carretChar + carretChar), "g");
      txt = txt.replace(reQuoted, ' ');

      if ((i = txt.indexOf(carretChar)) > -1) {
        return i;
      }
    }
  }]);

  return StringHelper;
}();

exports.StringHelper = StringHelper;

},{"../positioning/Size":40}],35:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Pos = require("./Pos").Pos;

var StringHelper = require("../helpers/StringHelper").StringHelper;

var PairMatch = require("./PairMatch").PairMatch;

var Pair =
/*#__PURE__*/
function () {
  function Pair(opener, closer) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Pair);

    var defaults, key, val;
    this.opener = opener;
    this.closer = closer;
    this.options = options;
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

  _createClass(Pair, [{
    key: "openerReg",
    value: function openerReg() {
      if (typeof this.opener === 'string') {
        return new RegExp(StringHelper.escapeRegExp(this.opener));
      } else {
        return this.opener;
      }
    }
  }, {
    key: "closerReg",
    value: function closerReg() {
      if (typeof this.closer === 'string') {
        return new RegExp(StringHelper.escapeRegExp(this.closer));
      } else {
        return this.closer;
      }
    }
  }, {
    key: "matchAnyParts",
    value: function matchAnyParts() {
      return {
        opener: this.openerReg(),
        closer: this.closerReg()
      };
    }
  }, {
    key: "matchAnyPartKeys",
    value: function matchAnyPartKeys() {
      var key, keys, ref, reg;
      keys = [];
      ref = this.matchAnyParts();

      for (key in ref) {
        reg = ref[key];
        keys.push(key);
      }

      return keys;
    }
  }, {
    key: "matchAnyReg",
    value: function matchAnyReg() {
      var groups, key, ref, reg;
      groups = [];
      ref = this.matchAnyParts();

      for (key in ref) {
        reg = ref[key];
        groups.push('(' + reg.source + ')');
      }

      return new RegExp(groups.join('|'));
    }
  }, {
    key: "matchAny",
    value: function matchAny(text) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var match;

      while ((match = this._matchAny(text, offset)) != null && !match.valid()) {
        offset = match.end();
      }

      if (match != null && match.valid()) {
        return match;
      }
    }
  }, {
    key: "_matchAny",
    value: function _matchAny(text) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var match;

      if (offset) {
        text = text.substr(offset);
      }

      match = this.matchAnyReg().exec(text);

      if (match != null) {
        return new PairMatch(this, match, offset);
      }
    }
  }, {
    key: "matchAnyNamed",
    value: function matchAnyNamed(text) {
      return this._matchAnyGetName(this.matchAny(text));
    }
  }, {
    key: "matchAnyLast",
    value: function matchAnyLast(text) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var match, res;

      while (match = this.matchAny(text, offset)) {
        offset = match.end();

        if (!res || res.end() !== match.end()) {
          res = match;
        }
      }

      return res;
    }
  }, {
    key: "identical",
    value: function identical() {
      return this.opener === this.closer || this.opener.source != null && this.closer.source != null && this.opener.source === this.closer.source;
    }
  }, {
    key: "wrapperPos",
    value: function wrapperPos(pos, text) {
      var end, start;
      start = this.matchAnyLast(text.substr(0, pos.start));

      if (start != null && (this.identical() || start.name() === 'opener')) {
        end = this.matchAny(text, pos.end);

        if (end != null && (this.identical() || end.name() === 'closer')) {
          return new Pos(start.start(), end.end());
        } else if (this.optionnal_end) {
          return new Pos(start.start(), text.length);
        }
      }
    }
  }, {
    key: "isWapperOf",
    value: function isWapperOf(pos, text) {
      return this.wrapperPos(pos, text) != null;
    }
  }]);

  return Pair;
}();

exports.Pair = Pair;

},{"../helpers/StringHelper":34,"./PairMatch":36,"./Pos":37}],36:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PairMatch =
/*#__PURE__*/
function () {
  function PairMatch(pair, match) {
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, PairMatch);

    this.pair = pair;
    this.match = match;
    this.offset = offset;
  }

  _createClass(PairMatch, [{
    key: "name",
    value: function name() {
      var _name, group, i, j, len, ref;

      if (this.match) {
        if (typeof _name === "undefined" || _name === null) {
          ref = this.match;

          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            group = ref[i];

            if (i > 0 && group != null) {
              _name = this.pair.matchAnyPartKeys()[i - 1];
              return _name;
            }
          }

          _name = false;
        }

        return _name || null;
      }
    }
  }, {
    key: "start",
    value: function start() {
      return this.match.index + this.offset;
    }
  }, {
    key: "end",
    value: function end() {
      return this.match.index + this.match[0].length + this.offset;
    }
  }, {
    key: "valid",
    value: function valid() {
      return !this.pair.validMatch || this.pair.validMatch(this);
    }
  }, {
    key: "length",
    value: function length() {
      return this.match[0].length;
    }
  }]);

  return PairMatch;
}();

exports.PairMatch = PairMatch;

},{}],37:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Pos =
/*#__PURE__*/
function () {
  function Pos(start, end) {
    _classCallCheck(this, Pos);

    this.start = start;
    this.end = end;

    if (this.end == null) {
      this.end = this.start;
    }
  }

  _createClass(Pos, [{
    key: "containsPt",
    value: function containsPt(pt) {
      return this.start <= pt && pt <= this.end;
    }
  }, {
    key: "containsPos",
    value: function containsPos(pos) {
      return this.start <= pos.start && pos.end <= this.end;
    }
  }, {
    key: "wrappedBy",
    value: function wrappedBy(prefix, suffix) {
      return new Pos.wrapClass(this.start - prefix.length, this.start, this.end, this.end + suffix.length);
    }
  }, {
    key: "withEditor",
    value: function withEditor(val) {
      this._editor = val;
      return this;
    }
  }, {
    key: "editor",
    value: function editor() {
      if (this._editor == null) {
        throw new Error('No editor set');
      }

      return this._editor;
    }
  }, {
    key: "hasEditor",
    value: function hasEditor() {
      return this._editor != null;
    }
  }, {
    key: "text",
    value: function text() {
      return this.editor().textSubstr(this.start, this.end);
    }
  }, {
    key: "applyOffset",
    value: function applyOffset(offset) {
      if (offset !== 0) {
        this.start += offset;
        this.end += offset;
      }

      return this;
    }
  }, {
    key: "prevEOL",
    value: function prevEOL() {
      if (this._prevEOL == null) {
        this._prevEOL = this.editor().findLineStart(this.start);
      }

      return this._prevEOL;
    }
  }, {
    key: "nextEOL",
    value: function nextEOL() {
      if (this._nextEOL == null) {
        this._nextEOL = this.editor().findLineEnd(this.end);
      }

      return this._nextEOL;
    }
  }, {
    key: "textWithFullLines",
    value: function textWithFullLines() {
      if (this._textWithFullLines == null) {
        this._textWithFullLines = this.editor().textSubstr(this.prevEOL(), this.nextEOL());
      }

      return this._textWithFullLines;
    }
  }, {
    key: "sameLinesPrefix",
    value: function sameLinesPrefix() {
      if (this._sameLinesPrefix == null) {
        this._sameLinesPrefix = this.editor().textSubstr(this.prevEOL(), this.start);
      }

      return this._sameLinesPrefix;
    }
  }, {
    key: "sameLinesSuffix",
    value: function sameLinesSuffix() {
      if (this._sameLinesSuffix == null) {
        this._sameLinesSuffix = this.editor().textSubstr(this.end, this.nextEOL());
      }

      return this._sameLinesSuffix;
    }
  }, {
    key: "copy",
    value: function copy() {
      var res;
      res = new Pos(this.start, this.end);

      if (this.hasEditor()) {
        res.withEditor(this.editor());
      }

      return res;
    }
  }, {
    key: "raw",
    value: function raw() {
      return [this.start, this.end];
    }
  }]);

  return Pos;
}();

exports.Pos = Pos;

},{}],38:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Wrapping = require("./Wrapping").Wrapping;

var Replacement = require("./Replacement").Replacement;

var CommonHelper = require("../helpers/CommonHelper").CommonHelper;

var PosCollection =
/*#__PURE__*/
function () {
  function PosCollection(arr) {
    _classCallCheck(this, PosCollection);

    if (!Array.isArray(arr)) {
      arr = [arr];
    }

    CommonHelper.applyMixins(arr, [PosCollection]);
    return arr;
  }

  _createClass(PosCollection, [{
    key: "wrap",
    value: function wrap(prefix, suffix) {
      return this.map(function (p) {
        return new Wrapping(p.start, p.end, prefix, suffix);
      });
    }
  }, {
    key: "replace",
    value: function replace(txt) {
      return this.map(function (p) {
        return new Replacement(p.start, p.end, txt);
      });
    }
  }]);

  return PosCollection;
}();

exports.PosCollection = PosCollection;

},{"../helpers/CommonHelper":30,"./Replacement":39,"./Wrapping":43}],39:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Pos = require("./Pos").Pos;

var CommonHelper = require("../helpers/CommonHelper").CommonHelper;

var OptionObject = require("../OptionObject").OptionObject;

var StringHelper = require("../helpers/StringHelper").StringHelper;

var Replacement = function () {
  var Replacement =
  /*#__PURE__*/
  function (_Pos) {
    _inherits(Replacement, _Pos);

    function Replacement(start1, end, text1) {
      var _this;

      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      _classCallCheck(this, Replacement);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Replacement).call(this));
      _this.start = start1;
      _this.end = end;
      _this.text = text1;
      _this.options = options;

      _this.setOpts(_this.options, {
        prefix: '',
        suffix: '',
        selections: []
      });

      return _this;
    }

    _createClass(Replacement, [{
      key: "resPosBeforePrefix",
      value: function resPosBeforePrefix() {
        return this.start + this.prefix.length + this.text.length;
      }
    }, {
      key: "resEnd",
      value: function resEnd() {
        return this.start + this.finalText().length;
      }
    }, {
      key: "apply",
      value: function apply() {
        return this.editor().spliceText(this.start, this.end, this.finalText());
      }
    }, {
      key: "necessary",
      value: function necessary() {
        return this.finalText() !== this.originalText();
      }
    }, {
      key: "originalText",
      value: function originalText() {
        return this.editor().textSubstr(this.start, this.end);
      }
    }, {
      key: "finalText",
      value: function finalText() {
        return this.prefix + this.text + this.suffix;
      }
    }, {
      key: "offsetAfter",
      value: function offsetAfter() {
        return this.finalText().length - (this.end - this.start);
      }
    }, {
      key: "applyOffset",
      value: function applyOffset(offset) {
        var i, len, ref, sel;

        if (offset !== 0) {
          this.start += offset;
          this.end += offset;
          ref = this.selections;

          for (i = 0, len = ref.length; i < len; i++) {
            sel = ref[i];
            sel.start += offset;
            sel.end += offset;
          }
        }

        return this;
      }
    }, {
      key: "selectContent",
      value: function selectContent() {
        this.selections = [new Pos(this.prefix.length + this.start, this.prefix.length + this.start + this.text.length)];
        return this;
      }
    }, {
      key: "carretToSel",
      value: function carretToSel() {
        var pos, res, start, text;
        this.selections = [];
        text = this.finalText();
        this.prefix = StringHelper.removeCarret(this.prefix);
        this.text = StringHelper.removeCarret(this.text);
        this.suffix = StringHelper.removeCarret(this.suffix);
        start = this.start;

        while ((res = StringHelper.getAndRemoveFirstCarret(text)) != null) {
          var _res = res;

          var _res2 = _slicedToArray(_res, 2);

          pos = _res2[0];
          text = _res2[1];
          this.selections.push(new Pos(start + pos, start + pos));
        }

        return this;
      }
    }, {
      key: "copy",
      value: function copy() {
        var res;
        res = new Replacement(this.start, this.end, this.text, this.getOpts());

        if (this.hasEditor()) {
          res.withEditor(this.editor());
        }

        res.selections = this.selections.map(function (s) {
          return s.copy();
        });
        return res;
      }
    }]);

    return Replacement;
  }(Pos);

  ;
  CommonHelper.applyMixins(Replacement.prototype, [OptionObject]);
  return Replacement;
}.call(void 0);

exports.Replacement = Replacement;

},{"../OptionObject":11,"../helpers/CommonHelper":30,"../helpers/StringHelper":34,"./Pos":37}],40:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Size = function Size(width, height) {
  _classCallCheck(this, Size);

  this.width = width;
  this.height = height;
};

exports.Size = Size;

},{}],41:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StrPos =
/*#__PURE__*/
function () {
  function StrPos(pos, str) {
    _classCallCheck(this, StrPos);

    this.pos = pos;
    this.str = str;
  }

  _createClass(StrPos, [{
    key: "end",
    value: function end() {
      return this.pos + this.str.length;
    }
  }]);

  return StrPos;
}();

exports.StrPos = StrPos;

},{}],42:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Pos = require("./Pos").Pos;

var WrappedPos =
/*#__PURE__*/
function (_Pos) {
  _inherits(WrappedPos, _Pos);

  function WrappedPos(start, innerStart, innerEnd, end) {
    var _this;

    _classCallCheck(this, WrappedPos);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WrappedPos).call(this));
    _this.start = start;
    _this.innerStart = innerStart;
    _this.innerEnd = innerEnd;
    _this.end = end;
    return _this;
  }

  _createClass(WrappedPos, [{
    key: "innerContainsPt",
    value: function innerContainsPt(pt) {
      return this.innerStart <= pt && pt <= this.innerEnd;
    }
  }, {
    key: "innerContainsPos",
    value: function innerContainsPos(pos) {
      return this.innerStart <= pos.start && pos.end <= this.innerEnd;
    }
  }, {
    key: "innerText",
    value: function innerText() {
      return this.editor().textSubstr(this.innerStart, this.innerEnd);
    }
  }, {
    key: "setInnerLen",
    value: function setInnerLen(len) {
      return this.moveSufix(this.innerStart + len);
    }
  }, {
    key: "moveSuffix",
    value: function moveSuffix(pt) {
      var suffixLen;
      suffixLen = this.end - this.innerEnd;
      this.innerEnd = pt;
      return this.end = this.innerEnd + suffixLen;
    }
  }, {
    key: "copy",
    value: function copy() {
      return new WrappedPos(this.start, this.innerStart, this.innerEnd, this.end);
    }
  }]);

  return WrappedPos;
}(Pos);

exports.WrappedPos = WrappedPos;

},{"./Pos":37}],43:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Replacement = require("./Replacement").Replacement;

var Wrapping =
/*#__PURE__*/
function (_Replacement) {
  _inherits(Wrapping, _Replacement);

  function Wrapping(start, end) {
    var _this;

    var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    _classCallCheck(this, Wrapping);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Wrapping).call(this));
    _this.start = start;
    _this.end = end;
    _this.options = options;

    _this.setOpts(_this.options);

    _this.text = '';
    _this.prefix = prefix;
    _this.suffix = suffix;
    return _this;
  }

  _createClass(Wrapping, [{
    key: "apply",
    value: function apply() {
      this.adjustSel();
      return _get(_getPrototypeOf(Wrapping.prototype), "apply", this).call(this);
    }
  }, {
    key: "adjustSel",
    value: function adjustSel() {
      var i, len, offset, ref, results, sel;
      offset = this.originalText().length;
      ref = this.selections;
      results = [];

      for (i = 0, len = ref.length; i < len; i++) {
        sel = ref[i];

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
    }
  }, {
    key: "finalText",
    value: function finalText() {
      var text;

      if (this.hasEditor()) {
        text = this.originalText();
      } else {
        text = '';
      }

      return this.prefix + text + this.suffix;
    }
  }, {
    key: "offsetAfter",
    value: function offsetAfter() {
      return this.prefix.length + this.suffix.length;
    }
  }, {
    key: "copy",
    value: function copy() {
      var res;
      res = new Wrapping(this.start, this.end, this.prefix, this.suffix);
      res.selections = this.selections.map(function (s) {
        return s.copy();
      });
      return res;
    }
  }]);

  return Wrapping;
}(Replacement);

exports.Wrapping = Wrapping;

},{"./Replacement":39}],44:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LocalStorageEngine =
/*#__PURE__*/
function () {
  function LocalStorageEngine() {
    _classCallCheck(this, LocalStorageEngine);
  }

  _createClass(LocalStorageEngine, [{
    key: "save",
    value: function save(key, val) {
      if (typeof localStorage !== "undefined" && localStorage !== null) {
        return localStorage.setItem(this.fullKey(key), JSON.stringify(val));
      }
    }
  }, {
    key: "saveInPath",
    value: function saveInPath(path, key, val) {
      var data;
      data = this.load(path);

      if (data == null) {
        data = {};
      }

      data[key] = val;
      return this.save(path, data);
    }
  }, {
    key: "load",
    value: function load(key) {
      if (typeof localStorage !== "undefined" && localStorage !== null) {
        return JSON.parse(localStorage.getItem(this.fullKey(key)));
      }
    }
  }, {
    key: "fullKey",
    value: function fullKey(key) {
      return 'CodeWave_' + key;
    }
  }]);

  return LocalStorageEngine;
}();

exports.LocalStorageEngine = LocalStorageEngine;

},{}],45:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Context =
/*#__PURE__*/
function () {
  function Context(parser, parent) {
    _classCallCheck(this, Context);

    this.parser = parser;
    this.parent = parent;
    this.content = "";
  }

  _createClass(Context, [{
    key: "onStart",
    value: function onStart() {
      return this.startAt = this.parser.pos;
    }
  }, {
    key: "onChar",
    value: function onChar(_char) {}
  }, {
    key: "end",
    value: function end() {
      return this.parser.setContext(this.parent);
    }
  }, {
    key: "onEnd",
    value: function onEnd() {}
  }, {
    key: "testContext",
    value: function testContext(contextType) {
      if (contextType.test(this.parser["char"], this)) {
        return this.parser.setContext(new contextType(this.parser, this));
      }
    }
  }], [{
    key: "test",
    value: function test() {
      return false;
    }
  }]);

  return Context;
}();

exports.Context = Context;

},{}],46:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Context = require("./Context").Context;

var EscapeContext =
/*#__PURE__*/
function (_Context) {
  _inherits(EscapeContext, _Context);

  function EscapeContext() {
    _classCallCheck(this, EscapeContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(EscapeContext).apply(this, arguments));
  }

  _createClass(EscapeContext, [{
    key: "onChar",
    value: function onChar(_char) {
      this.parent.content += _char;
      return this.end();
    }
  }], [{
    key: "test",
    value: function test(_char2) {
      return _char2 === '\\';
    }
  }]);

  return EscapeContext;
}(Context);

exports.EscapeContext = EscapeContext;

},{"./Context":45}],47:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ParamContext = require("./ParamContext").ParamContext;

var indexOf = [].indexOf;

var NamedContext =
/*#__PURE__*/
function (_ParamContext) {
  _inherits(NamedContext, _ParamContext);

  function NamedContext() {
    _classCallCheck(this, NamedContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(NamedContext).apply(this, arguments));
  }

  _createClass(NamedContext, [{
    key: "onStart",
    value: function onStart() {
      return this.name = this.parent.content;
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      return this.parser.named[this.name] = this.content;
    }
  }], [{
    key: "test",
    value: function test(_char, parent) {
      var ref;
      return _char === ':' && (parent.parser.options.allowedNamed == null || (ref = parent.content, indexOf.call(parent.parser.options.allowedNamed, ref) >= 0));
    }
  }]);

  return NamedContext;
}(ParamContext);

exports.NamedContext = NamedContext;

},{"./ParamContext":48}],48:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Context = require("./Context").Context;

var StringContext = require("./StringContext").StringContext;

var VariableContext = require("./VariableContext").VariableContext;

var ParamContext =
/*#__PURE__*/
function (_Context) {
  _inherits(ParamContext, _Context);

  function ParamContext() {
    _classCallCheck(this, ParamContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(ParamContext).apply(this, arguments));
  }

  _createClass(ParamContext, [{
    key: "onChar",
    value: function onChar(_char) {
      if (this.testContext(StringContext)) {} else if (this.testContext(ParamContext.named)) {} else if (this.testContext(VariableContext)) {} else if (_char === ' ') {
        return this.parser.setContext(new ParamContext(this.parser));
      } else {
        return this.content += _char;
      }
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      return this.parser.params.push(this.content);
    }
  }]);

  return ParamContext;
}(Context);

exports.ParamContext = ParamContext;

},{"./Context":45,"./StringContext":50,"./VariableContext":51}],49:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ParamContext = require("./ParamContext").ParamContext;

var NamedContext = require("./NamedContext").NamedContext;

ParamContext.named = NamedContext;

var ParamParser =
/*#__PURE__*/
function () {
  function ParamParser(paramString) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, ParamParser);

    this.paramString = paramString;
    this.options = options;
    this.parse();
  }

  _createClass(ParamParser, [{
    key: "setContext",
    value: function setContext(context) {
      var oldContext;
      oldContext = this.context;
      this.context = context;

      if (oldContext != null && oldContext !== (context != null ? context.parent : void 0)) {
        oldContext.onEnd();
      }

      if (context != null) {
        context.onStart();
      }

      return this.context;
    }
  }, {
    key: "parse",
    value: function parse() {
      this.params = [];
      this.named = {};

      if (this.paramString.length) {
        this.setContext(new ParamContext(this));
        this.pos = 0;

        while (this.pos < this.paramString.length) {
          this["char"] = this.paramString[this.pos];
          this.context.onChar(this["char"]);
          this.pos++;
        }

        return this.setContext(null);
      }
    }
  }, {
    key: "take",
    value: function take(nb) {
      return this.paramString.substring(this.pos, this.pos + nb);
    }
  }, {
    key: "skip",
    value: function skip() {
      var nb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return this.pos += nb;
    }
  }]);

  return ParamParser;
}();

exports.ParamParser = ParamParser;

},{"./NamedContext":47,"./ParamContext":48}],50:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Context = require("./Context").Context;

var EscapeContext = require("./EscapeContext").EscapeContext;

var VariableContext = require("./VariableContext").VariableContext;

var StringContext =
/*#__PURE__*/
function (_Context) {
  _inherits(StringContext, _Context);

  function StringContext() {
    _classCallCheck(this, StringContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(StringContext).apply(this, arguments));
  }

  _createClass(StringContext, [{
    key: "onChar",
    value: function onChar(_char) {
      if (this.testContext(EscapeContext)) {} else if (this.testContext(VariableContext)) {} else if (StringContext.isDelimiter(_char)) {
        return this.end();
      } else {
        return this.content += _char;
      }
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      return this.parent.content += this.content;
    }
  }], [{
    key: "test",
    value: function test(_char2) {
      return this.isDelimiter(_char2);
    }
  }, {
    key: "isDelimiter",
    value: function isDelimiter(_char3) {
      return _char3 === '"' || _char3 === "'";
    }
  }]);

  return StringContext;
}(Context);

exports.StringContext = StringContext;

},{"./Context":45,"./EscapeContext":46,"./VariableContext":51}],51:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Context = require("./Context").Context;

var VariableContext =
/*#__PURE__*/
function (_Context) {
  _inherits(VariableContext, _Context);

  function VariableContext() {
    _classCallCheck(this, VariableContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(VariableContext).apply(this, arguments));
  }

  _createClass(VariableContext, [{
    key: "onStart",
    value: function onStart() {
      return this.parser.skip();
    }
  }, {
    key: "onChar",
    value: function onChar(_char) {
      if (_char === '}') {
        return this.end();
      } else {
        return this.content += _char;
      }
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      var ref;
      return this.parent.content += ((ref = this.parser.options.vars) != null ? ref[this.content] : void 0) || '';
    }
  }], [{
    key: "test",
    value: function test(_char2, parent) {
      return parent.parser.take(2) === '#{';
    }
  }]);

  return VariableContext;
}(Context);

exports.VariableContext = VariableContext;

},{"./Context":45}],52:[function(require,module,exports){
/*!
 * inflection
 * Copyright(c) 2011 Ben Lin <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * A port of inflection-js to node.js module.
 */

( function ( root, factory ){
  if( typeof define === 'function' && define.amd ){
    define([], factory );
  }else if( typeof exports === 'object' ){
    module.exports = factory();
  }else{
    root.inflection = factory();
  }
}( this, function (){

  /**
   * @description This is a list of nouns that use the same form for both singular and plural.
   *              This list should remain entirely in lower case to correctly match Strings.
   * @private
   */
  var uncountable_words = [
    // 'access',
    'accommodation',
    'adulthood',
    'advertising',
    'advice',
    'aggression',
    'aid',
    'air',
    'aircraft',
    'alcohol',
    'anger',
    'applause',
    'arithmetic',
    // 'art',
    'assistance',
    'athletics',
    // 'attention',

    'bacon',
    'baggage',
    // 'ballet',
    // 'beauty',
    'beef',
    // 'beer',
    // 'behavior',
    'biology',
    // 'billiards',
    'blood',
    'botany',
    // 'bowels',
    'bread',
    // 'business',
    'butter',

    'carbon',
    'cardboard',
    'cash',
    'chalk',
    'chaos',
    'chess',
    'crossroads',
    'countryside',

    // 'damage',
    'dancing',
    // 'danger',
    'deer',
    // 'delight',
    // 'dessert',
    'dignity',
    'dirt',
    // 'distribution',
    'dust',

    'economics',
    'education',
    'electricity',
    // 'employment',
    // 'energy',
    'engineering',
    'enjoyment',
    // 'entertainment',
    'envy',
    'equipment',
    'ethics',
    'evidence',
    'evolution',

    // 'failure',
    // 'faith',
    'fame',
    'fiction',
    // 'fish',
    'flour',
    'flu',
    'food',
    // 'freedom',
    // 'fruit',
    'fuel',
    'fun',
    // 'funeral',
    'furniture',

    'gallows',
    'garbage',
    'garlic',
    // 'gas',
    'genetics',
    // 'glass',
    'gold',
    'golf',
    'gossip',
    'grammar',
    // 'grass',
    'gratitude',
    'grief',
    // 'ground',
    'guilt',
    'gymnastics',

    // 'hair',
    'happiness',
    'hardware',
    'harm',
    'hate',
    'hatred',
    'health',
    'heat',
    // 'height',
    'help',
    'homework',
    'honesty',
    'honey',
    'hospitality',
    'housework',
    'humour',
    'hunger',
    'hydrogen',

    'ice',
    'importance',
    'inflation',
    'information',
    // 'injustice',
    'innocence',
    // 'intelligence',
    'iron',
    'irony',

    'jam',
    // 'jealousy',
    // 'jelly',
    'jewelry',
    // 'joy',
    'judo',
    // 'juice',
    // 'justice',

    'karate',
    // 'kindness',
    'knowledge',

    // 'labour',
    'lack',
    // 'land',
    'laughter',
    'lava',
    'leather',
    'leisure',
    'lightning',
    'linguine',
    'linguini',
    'linguistics',
    'literature',
    'litter',
    'livestock',
    'logic',
    'loneliness',
    // 'love',
    'luck',
    'luggage',

    'macaroni',
    'machinery',
    'magic',
    // 'mail',
    'management',
    'mankind',
    'marble',
    'mathematics',
    'mayonnaise',
    'measles',
    // 'meat',
    // 'metal',
    'methane',
    'milk',
    'minus',
    'money',
    // 'moose',
    'mud',
    'music',
    'mumps',

    'nature',
    'news',
    'nitrogen',
    'nonsense',
    'nurture',
    'nutrition',

    'obedience',
    'obesity',
    // 'oil',
    'oxygen',

    // 'paper',
    // 'passion',
    'pasta',
    'patience',
    // 'permission',
    'physics',
    'poetry',
    'pollution',
    'poverty',
    // 'power',
    'pride',
    // 'production',
    // 'progress',
    // 'pronunciation',
    'psychology',
    'publicity',
    'punctuation',

    // 'quality',
    // 'quantity',
    'quartz',

    'racism',
    // 'rain',
    // 'recreation',
    'relaxation',
    'reliability',
    'research',
    'respect',
    'revenge',
    'rice',
    'rubbish',
    'rum',

    'safety',
    // 'salad',
    // 'salt',
    // 'sand',
    // 'satire',
    'scenery',
    'seafood',
    'seaside',
    'series',
    'shame',
    'sheep',
    'shopping',
    // 'silence',
    'sleep',
    // 'slang'
    'smoke',
    'smoking',
    'snow',
    'soap',
    'software',
    'soil',
    // 'sorrow',
    // 'soup',
    'spaghetti',
    // 'speed',
    'species',
    // 'spelling',
    // 'sport',
    'steam',
    // 'strength',
    'stuff',
    'stupidity',
    // 'success',
    // 'sugar',
    'sunshine',
    'symmetry',

    // 'tea',
    'tennis',
    'thirst',
    'thunder',
    'timber',
    // 'time',
    // 'toast',
    // 'tolerance',
    // 'trade',
    'traffic',
    'transportation',
    // 'travel',
    'trust',

    // 'understanding',
    'underwear',
    'unemployment',
    'unity',
    // 'usage',

    'validity',
    'veal',
    'vegetation',
    'vegetarianism',
    'vengeance',
    'violence',
    // 'vision',
    'vitality',

    'warmth',
    // 'water',
    'wealth',
    'weather',
    // 'weight',
    'welfare',
    'wheat',
    // 'whiskey',
    // 'width',
    'wildlife',
    // 'wine',
    'wisdom',
    // 'wood',
    // 'wool',
    // 'work',

    // 'yeast',
    'yoga',

    'zinc',
    'zoology'
  ];

  /**
   * @description These rules translate from the singular form of a noun to its plural form.
   * @private
   */

  var regex = {
    plural : {
      men       : new RegExp( '^(m|wom)en$'                    , 'gi' ),
      people    : new RegExp( '(pe)ople$'                      , 'gi' ),
      children  : new RegExp( '(child)ren$'                    , 'gi' ),
      tia       : new RegExp( '([ti])a$'                       , 'gi' ),
      analyses  : new RegExp( '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi' ),
      hives     : new RegExp( '(hi|ti)ves$'                    , 'gi' ),
      curves    : new RegExp( '(curve)s$'                      , 'gi' ),
      lrves     : new RegExp( '([lr])ves$'                     , 'gi' ),
      aves      : new RegExp( '([a])ves$'                      , 'gi' ),
      foves     : new RegExp( '([^fo])ves$'                    , 'gi' ),
      movies    : new RegExp( '(m)ovies$'                      , 'gi' ),
      aeiouyies : new RegExp( '([^aeiouy]|qu)ies$'             , 'gi' ),
      series    : new RegExp( '(s)eries$'                      , 'gi' ),
      xes       : new RegExp( '(x|ch|ss|sh)es$'                , 'gi' ),
      mice      : new RegExp( '([m|l])ice$'                    , 'gi' ),
      buses     : new RegExp( '(bus)es$'                       , 'gi' ),
      oes       : new RegExp( '(o)es$'                         , 'gi' ),
      shoes     : new RegExp( '(shoe)s$'                       , 'gi' ),
      crises    : new RegExp( '(cris|ax|test)es$'              , 'gi' ),
      octopi    : new RegExp( '(octop|vir)i$'                  , 'gi' ),
      aliases   : new RegExp( '(alias|canvas|status|campus)es$', 'gi' ),
      summonses : new RegExp( '^(summons)es$'                  , 'gi' ),
      oxen      : new RegExp( '^(ox)en'                        , 'gi' ),
      matrices  : new RegExp( '(matr)ices$'                    , 'gi' ),
      vertices  : new RegExp( '(vert|ind)ices$'                , 'gi' ),
      feet      : new RegExp( '^feet$'                         , 'gi' ),
      teeth     : new RegExp( '^teeth$'                        , 'gi' ),
      geese     : new RegExp( '^geese$'                        , 'gi' ),
      quizzes   : new RegExp( '(quiz)zes$'                     , 'gi' ),
      whereases : new RegExp( '^(whereas)es$'                  , 'gi' ),
      criteria  : new RegExp( '^(criteri)a$'                   , 'gi' ),
      genera    : new RegExp( '^genera$'                       , 'gi' ),
      ss        : new RegExp( 'ss$'                            , 'gi' ),
      s         : new RegExp( 's$'                             , 'gi' )
    },

    singular : {
      man       : new RegExp( '^(m|wom)an$'                  , 'gi' ),
      person    : new RegExp( '(pe)rson$'                    , 'gi' ),
      child     : new RegExp( '(child)$'                     , 'gi' ),
      ox        : new RegExp( '^(ox)$'                       , 'gi' ),
      axis      : new RegExp( '(ax|test)is$'                 , 'gi' ),
      octopus   : new RegExp( '(octop|vir)us$'               , 'gi' ),
      alias     : new RegExp( '(alias|status|canvas|campus)$', 'gi' ),
      summons   : new RegExp( '^(summons)$'                  , 'gi' ),
      bus       : new RegExp( '(bu)s$'                       , 'gi' ),
      buffalo   : new RegExp( '(buffal|tomat|potat)o$'       , 'gi' ),
      tium      : new RegExp( '([ti])um$'                    , 'gi' ),
      sis       : new RegExp( 'sis$'                         , 'gi' ),
      ffe       : new RegExp( '(?:([^f])fe|([lr])f)$'        , 'gi' ),
      hive      : new RegExp( '(hi|ti)ve$'                   , 'gi' ),
      aeiouyy   : new RegExp( '([^aeiouy]|qu)y$'             , 'gi' ),
      x         : new RegExp( '(x|ch|ss|sh)$'                , 'gi' ),
      matrix    : new RegExp( '(matr)ix$'                    , 'gi' ),
      vertex    : new RegExp( '(vert|ind)ex$'                , 'gi' ),
      mouse     : new RegExp( '([m|l])ouse$'                 , 'gi' ),
      foot      : new RegExp( '^foot$'                       , 'gi' ),
      tooth     : new RegExp( '^tooth$'                      , 'gi' ),
      goose     : new RegExp( '^goose$'                      , 'gi' ),
      quiz      : new RegExp( '(quiz)$'                      , 'gi' ),
      whereas   : new RegExp( '^(whereas)$'                  , 'gi' ),
      criterion : new RegExp( '^(criteri)on$'                , 'gi' ),
      genus     : new RegExp( '^genus$'                      , 'gi' ),
      s         : new RegExp( 's$'                           , 'gi' ),
      common    : new RegExp( '$'                            , 'gi' )
    }
  };

  var plural_rules = [

    // do not replace if its already a plural word
    [ regex.plural.men       ],
    [ regex.plural.people    ],
    [ regex.plural.children  ],
    [ regex.plural.tia       ],
    [ regex.plural.analyses  ],
    [ regex.plural.hives     ],
    [ regex.plural.curves    ],
    [ regex.plural.lrves     ],
    [ regex.plural.foves     ],
    [ regex.plural.aeiouyies ],
    [ regex.plural.series    ],
    [ regex.plural.movies    ],
    [ regex.plural.xes       ],
    [ regex.plural.mice      ],
    [ regex.plural.buses     ],
    [ regex.plural.oes       ],
    [ regex.plural.shoes     ],
    [ regex.plural.crises    ],
    [ regex.plural.octopi    ],
    [ regex.plural.aliases   ],
    [ regex.plural.summonses ],
    [ regex.plural.oxen      ],
    [ regex.plural.matrices  ],
    [ regex.plural.feet      ],
    [ regex.plural.teeth     ],
    [ regex.plural.geese     ],
    [ regex.plural.quizzes   ],
    [ regex.plural.whereases ],
    [ regex.plural.criteria  ],
    [ regex.plural.genera    ],

    // original rule
    [ regex.singular.man      , '$1en' ],
    [ regex.singular.person   , '$1ople' ],
    [ regex.singular.child    , '$1ren' ],
    [ regex.singular.ox       , '$1en' ],
    [ regex.singular.axis     , '$1es' ],
    [ regex.singular.octopus  , '$1i' ],
    [ regex.singular.alias    , '$1es' ],
    [ regex.singular.summons  , '$1es' ],
    [ regex.singular.bus      , '$1ses' ],
    [ regex.singular.buffalo  , '$1oes' ],
    [ regex.singular.tium     , '$1a' ],
    [ regex.singular.sis      , 'ses' ],
    [ regex.singular.ffe      , '$1$2ves' ],
    [ regex.singular.hive     , '$1ves' ],
    [ regex.singular.aeiouyy  , '$1ies' ],
    [ regex.singular.matrix   , '$1ices' ],
    [ regex.singular.vertex   , '$1ices' ],
    [ regex.singular.x        , '$1es' ],
    [ regex.singular.mouse    , '$1ice' ],
    [ regex.singular.foot     , 'feet' ],
    [ regex.singular.tooth    , 'teeth' ],
    [ regex.singular.goose    , 'geese' ],
    [ regex.singular.quiz     , '$1zes' ],
    [ regex.singular.whereas  , '$1es' ],
    [ regex.singular.criterion, '$1a' ],
    [ regex.singular.genus    , 'genera' ],

    [ regex.singular.s     , 's' ],
    [ regex.singular.common, 's' ]
  ];

  /**
   * @description These rules translate from the plural form of a noun to its singular form.
   * @private
   */
  var singular_rules = [

    // do not replace if its already a singular word
    [ regex.singular.man     ],
    [ regex.singular.person  ],
    [ regex.singular.child   ],
    [ regex.singular.ox      ],
    [ regex.singular.axis    ],
    [ regex.singular.octopus ],
    [ regex.singular.alias   ],
    [ regex.singular.summons ],
    [ regex.singular.bus     ],
    [ regex.singular.buffalo ],
    [ regex.singular.tium    ],
    [ regex.singular.sis     ],
    [ regex.singular.ffe     ],
    [ regex.singular.hive    ],
    [ regex.singular.aeiouyy ],
    [ regex.singular.x       ],
    [ regex.singular.matrix  ],
    [ regex.singular.mouse   ],
    [ regex.singular.foot    ],
    [ regex.singular.tooth   ],
    [ regex.singular.goose   ],
    [ regex.singular.quiz    ],
    [ regex.singular.whereas ],
    [ regex.singular.criterion ],
    [ regex.singular.genus ],

    // original rule
    [ regex.plural.men      , '$1an' ],
    [ regex.plural.people   , '$1rson' ],
    [ regex.plural.children , '$1' ],
    [ regex.plural.genera   , 'genus'],
    [ regex.plural.criteria , '$1on'],
    [ regex.plural.tia      , '$1um' ],
    [ regex.plural.analyses , '$1$2sis' ],
    [ regex.plural.hives    , '$1ve' ],
    [ regex.plural.curves   , '$1' ],
    [ regex.plural.lrves    , '$1f' ],
    [ regex.plural.aves     , '$1ve' ],
    [ regex.plural.foves    , '$1fe' ],
    [ regex.plural.movies   , '$1ovie' ],
    [ regex.plural.aeiouyies, '$1y' ],
    [ regex.plural.series   , '$1eries' ],
    [ regex.plural.xes      , '$1' ],
    [ regex.plural.mice     , '$1ouse' ],
    [ regex.plural.buses    , '$1' ],
    [ regex.plural.oes      , '$1' ],
    [ regex.plural.shoes    , '$1' ],
    [ regex.plural.crises   , '$1is' ],
    [ regex.plural.octopi   , '$1us' ],
    [ regex.plural.aliases  , '$1' ],
    [ regex.plural.summonses, '$1' ],
    [ regex.plural.oxen     , '$1' ],
    [ regex.plural.matrices , '$1ix' ],
    [ regex.plural.vertices , '$1ex' ],
    [ regex.plural.feet     , 'foot' ],
    [ regex.plural.teeth    , 'tooth' ],
    [ regex.plural.geese    , 'goose' ],
    [ regex.plural.quizzes  , '$1' ],
    [ regex.plural.whereases, '$1' ],

    [ regex.plural.ss, 'ss' ],
    [ regex.plural.s , '' ]
  ];

  /**
   * @description This is a list of words that should not be capitalized for title case.
   * @private
   */
  var non_titlecased_words = [
    'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at','by',
    'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over', 'with', 'for'
  ];

  /**
   * @description These are regular expressions used for converting between String formats.
   * @private
   */
  var id_suffix         = new RegExp( '(_ids|_id)$', 'g' );
  var underbar          = new RegExp( '_', 'g' );
  var space_or_underbar = new RegExp( '[\ _]', 'g' );
  var uppercase         = new RegExp( '([A-Z])', 'g' );
  var underbar_prefix   = new RegExp( '^_' );

  var inflector = {

  /**
   * A helper method that applies rules based replacement to a String.
   * @private
   * @function
   * @param {String} str String to modify and return based on the passed rules.
   * @param {Array: [RegExp, String]} rules Regexp to match paired with String to use for replacement
   * @param {Array: [String]} skip Strings to skip if they match
   * @param {String} override String to return as though this method succeeded (used to conform to APIs)
   * @returns {String} Return passed String modified by passed rules.
   * @example
   *
   *     this._apply_rules( 'cows', singular_rules ); // === 'cow'
   */
    _apply_rules : function ( str, rules, skip, override ){
      if( override ){
        str = override;
      }else{
        var ignore = ( inflector.indexOf( skip, str.toLowerCase()) > -1 );

        if( !ignore ){
          var i = 0;
          var j = rules.length;

          for( ; i < j; i++ ){
            if( str.match( rules[ i ][ 0 ])){
              if( rules[ i ][ 1 ] !== undefined ){
                str = str.replace( rules[ i ][ 0 ], rules[ i ][ 1 ]);
              }
              break;
            }
          }
        }
      }

      return str;
    },



  /**
   * This lets us detect if an Array contains a given element.
   * @public
   * @function
   * @param {Array} arr The subject array.
   * @param {Object} item Object to locate in the Array.
   * @param {Number} from_index Starts checking from this position in the Array.(optional)
   * @param {Function} compare_func Function used to compare Array item vs passed item.(optional)
   * @returns {Number} Return index position in the Array of the passed item.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.indexOf([ 'hi','there' ], 'guys' ); // === -1
   *     inflection.indexOf([ 'hi','there' ], 'hi' ); // === 0
   */
    indexOf : function ( arr, item, from_index, compare_func ){
      if( !from_index ){
        from_index = -1;
      }

      var index = -1;
      var i     = from_index;
      var j     = arr.length;

      for( ; i < j; i++ ){
        if( arr[ i ]  === item || compare_func && compare_func( arr[ i ], item )){
          index = i;
          break;
        }
      }

      return index;
    },



  /**
   * This function adds pluralization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {String} plural Overrides normal output with said String.(optional)
   * @returns {String} Singular English language nouns are returned in plural form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.pluralize( 'person' ); // === 'people'
   *     inflection.pluralize( 'octopus' ); // === 'octopi'
   *     inflection.pluralize( 'Hat' ); // === 'Hats'
   *     inflection.pluralize( 'person', 'guys' ); // === 'guys'
   */
    pluralize : function ( str, plural ){
      return inflector._apply_rules( str, plural_rules, uncountable_words, plural );
    },



  /**
   * This function adds singularization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {String} singular Overrides normal output with said String.(optional)
   * @returns {String} Plural English language nouns are returned in singular form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.singularize( 'people' ); // === 'person'
   *     inflection.singularize( 'octopi' ); // === 'octopus'
   *     inflection.singularize( 'Hats' ); // === 'Hat'
   *     inflection.singularize( 'guys', 'person' ); // === 'person'
   */
    singularize : function ( str, singular ){
      return inflector._apply_rules( str, singular_rules, uncountable_words, singular );
    },


  /**
   * This function will pluralize or singularlize a String appropriately based on an integer value
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Number} count The number to base pluralization off of.
   * @param {String} singular Overrides normal output with said String.(optional)
   * @param {String} plural Overrides normal output with said String.(optional)
   * @returns {String} English language nouns are returned in the plural or singular form based on the count.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.inflect( 'people' 1 ); // === 'person'
   *     inflection.inflect( 'octopi' 1 ); // === 'octopus'
   *     inflection.inflect( 'Hats' 1 ); // === 'Hat'
   *     inflection.inflect( 'guys', 1 , 'person' ); // === 'person'
   *     inflection.inflect( 'person', 2 ); // === 'people'
   *     inflection.inflect( 'octopus', 2 ); // === 'octopi'
   *     inflection.inflect( 'Hat', 2 ); // === 'Hats'
   *     inflection.inflect( 'person', 2, null, 'guys' ); // === 'guys'
   */
    inflect : function ( str, count, singular, plural ){
      count = parseInt( count, 10 );

      if( isNaN( count )) return str;

      if( count === 0 || count > 1 ){
        return inflector._apply_rules( str, plural_rules, uncountable_words, plural );
      }else{
        return inflector._apply_rules( str, singular_rules, uncountable_words, singular );
      }
    },



  /**
   * This function adds camelization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Boolean} low_first_letter Default is to capitalize the first letter of the results.(optional)
   *                                 Passing true will lowercase it.
   * @returns {String} Lower case underscored words will be returned in camel case.
   *                  additionally '/' is translated to '::'
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.camelize( 'message_properties' ); // === 'MessageProperties'
   *     inflection.camelize( 'message_properties', true ); // === 'messageProperties'
   */
    camelize : function ( str, low_first_letter ){
      var str_path = str.split( '/' );
      var i        = 0;
      var j        = str_path.length;
      var str_arr, init_x, k, l, first;

      for( ; i < j; i++ ){
        str_arr = str_path[ i ].split( '_' );
        k       = 0;
        l       = str_arr.length;

        for( ; k < l; k++ ){
          if( k !== 0 ){
            str_arr[ k ] = str_arr[ k ].toLowerCase();
          }

          first = str_arr[ k ].charAt( 0 );
          first = low_first_letter && i === 0 && k === 0
            ? first.toLowerCase() : first.toUpperCase();
          str_arr[ k ] = first + str_arr[ k ].substring( 1 );
        }

        str_path[ i ] = str_arr.join( '' );
      }

      return str_path.join( '::' );
    },



  /**
   * This function adds underscore support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Boolean} all_upper_case Default is to lowercase and add underscore prefix.(optional)
   *                  Passing true will return as entered.
   * @returns {String} Camel cased words are returned as lower cased and underscored.
   *                  additionally '::' is translated to '/'.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.underscore( 'MessageProperties' ); // === 'message_properties'
   *     inflection.underscore( 'messageProperties' ); // === 'message_properties'
   *     inflection.underscore( 'MP', true ); // === 'MP'
   */
    underscore : function ( str, all_upper_case ){
      if( all_upper_case && str === str.toUpperCase()) return str;

      var str_path = str.split( '::' );
      var i        = 0;
      var j        = str_path.length;

      for( ; i < j; i++ ){
        str_path[ i ] = str_path[ i ].replace( uppercase, '_$1' );
        str_path[ i ] = str_path[ i ].replace( underbar_prefix, '' );
      }

      return str_path.join( '/' ).toLowerCase();
    },



  /**
   * This function adds humanize support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Boolean} low_first_letter Default is to capitalize the first letter of the results.(optional)
   *                                 Passing true will lowercase it.
   * @returns {String} Lower case underscored words will be returned in humanized form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.humanize( 'message_properties' ); // === 'Message properties'
   *     inflection.humanize( 'message_properties', true ); // === 'message properties'
   */
    humanize : function ( str, low_first_letter ){
      str = str.toLowerCase();
      str = str.replace( id_suffix, '' );
      str = str.replace( underbar, ' ' );

      if( !low_first_letter ){
        str = inflector.capitalize( str );
      }

      return str;
    },



  /**
   * This function adds capitalization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} All characters will be lower case and the first will be upper.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.capitalize( 'message_properties' ); // === 'Message_properties'
   *     inflection.capitalize( 'message properties', true ); // === 'Message properties'
   */
    capitalize : function ( str ){
      str = str.toLowerCase();

      return str.substring( 0, 1 ).toUpperCase() + str.substring( 1 );
    },



  /**
   * This function replaces underscores with dashes in the string.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Replaces all spaces or underscores with dashes.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.dasherize( 'message_properties' ); // === 'message-properties'
   *     inflection.dasherize( 'Message Properties' ); // === 'Message-Properties'
   */
    dasherize : function ( str ){
      return str.replace( space_or_underbar, '-' );
    },



  /**
   * This function adds titleize support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Capitalizes words as you would for a book title.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.titleize( 'message_properties' ); // === 'Message Properties'
   *     inflection.titleize( 'message properties to keep' ); // === 'Message Properties to Keep'
   */
    titleize : function ( str ){
      str         = str.toLowerCase().replace( underbar, ' ' );
      var str_arr = str.split( ' ' );
      var i       = 0;
      var j       = str_arr.length;
      var d, k, l;

      for( ; i < j; i++ ){
        d = str_arr[ i ].split( '-' );
        k = 0;
        l = d.length;

        for( ; k < l; k++){
          if( inflector.indexOf( non_titlecased_words, d[ k ].toLowerCase()) < 0 ){
            d[ k ] = inflector.capitalize( d[ k ]);
          }
        }

        str_arr[ i ] = d.join( '-' );
      }

      str = str_arr.join( ' ' );
      str = str.substring( 0, 1 ).toUpperCase() + str.substring( 1 );

      return str;
    },



  /**
   * This function adds demodulize support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Removes module names leaving only class names.(Ruby style)
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.demodulize( 'Message::Bus::Properties' ); // === 'Properties'
   */
    demodulize : function ( str ){
      var str_arr = str.split( '::' );

      return str_arr[ str_arr.length - 1 ];
    },



  /**
   * This function adds tableize support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Return camel cased words into their underscored plural form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.tableize( 'MessageBusProperty' ); // === 'message_bus_properties'
   */
    tableize : function ( str ){
      str = inflector.underscore( str );
      str = inflector.pluralize( str );

      return str;
    },



  /**
   * This function adds classification support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Underscored plural nouns become the camel cased singular form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.classify( 'message_bus_properties' ); // === 'MessageBusProperty'
   */
    classify : function ( str ){
      str = inflector.camelize( str );
      str = inflector.singularize( str );

      return str;
    },



  /**
   * This function adds foreign key support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Boolean} drop_id_ubar Default is to seperate id with an underbar at the end of the class name,
                                 you can pass true to skip it.(optional)
   * @returns {String} Underscored plural nouns become the camel cased singular form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.foreign_key( 'MessageBusProperty' ); // === 'message_bus_property_id'
   *     inflection.foreign_key( 'MessageBusProperty', true ); // === 'message_bus_propertyid'
   */
    foreign_key : function ( str, drop_id_ubar ){
      str = inflector.demodulize( str );
      str = inflector.underscore( str ) + (( drop_id_ubar ) ? ( '' ) : ( '_' )) + 'id';

      return str;
    },



  /**
   * This function adds ordinalize support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Return all found numbers their sequence like '22nd'.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.ordinalize( 'the 1 pitch' ); // === 'the 1st pitch'
   */
    ordinalize : function ( str ){
      var str_arr = str.split( ' ' );
      var i       = 0;
      var j       = str_arr.length;

      for( ; i < j; i++ ){
        var k = parseInt( str_arr[ i ], 10 );

        if( !isNaN( k )){
          var ltd = str_arr[ i ].substring( str_arr[ i ].length - 2 );
          var ld  = str_arr[ i ].substring( str_arr[ i ].length - 1 );
          var suf = 'th';

          if( ltd != '11' && ltd != '12' && ltd != '13' ){
            if( ld === '1' ){
              suf = 'st';
            }else if( ld === '2' ){
              suf = 'nd';
            }else if( ld === '3' ){
              suf = 'rd';
            }
          }

          str_arr[ i ] += suf;
        }
      }

      return str_arr.join( ' ' );
    },

  /**
   * This function performs multiple inflection methods on a string
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Array} arr An array of inflection methods.
   * @returns {String}
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.transform( 'all job', [ 'pluralize', 'capitalize', 'dasherize' ]); // === 'All-jobs'
   */
    transform : function ( str, arr ){
      var i = 0;
      var j = arr.length;

      for( ;i < j; i++ ){
        var method = arr[ i ];

        if( inflector.hasOwnProperty( method )){
          str = inflector[ method ]( str );
        }
      }

      return str;
    }
  };

/**
 * @public
 */
  inflector.version = '1.12.0';

  return inflector;
}));

},{}]},{},[28])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmpzIiwibGliL0Nsb3NpbmdQcm9tcC5qcyIsImxpYi9DbWRGaW5kZXIuanMiLCJsaWIvQ21kSW5zdGFuY2UuanMiLCJsaWIvQ29kZXdhdmUuanMiLCJsaWIvQ29tbWFuZC5qcyIsImxpYi9Db250ZXh0LmpzIiwibGliL0VkaXRDbWRQcm9wLmpzIiwibGliL0VkaXRvci5qcyIsImxpYi9Mb2dnZXIuanMiLCJsaWIvT3B0aW9uT2JqZWN0LmpzIiwibGliL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsImxpYi9Qcm9jZXNzLmpzIiwibGliL1N0b3JhZ2UuanMiLCJsaWIvVGV4dEFyZWFFZGl0b3IuanMiLCJsaWIvVGV4dFBhcnNlci5qcyIsImxpYi9ib290c3RyYXAuanMiLCJsaWIvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwibGliL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXIuanMiLCJsaWIvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1BocENvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZC5qcyIsImxpYi9kZXRlY3RvcnMvRGV0ZWN0b3IuanMiLCJsaWIvZGV0ZWN0b3JzL0xhbmdEZXRlY3Rvci5qcyIsImxpYi9kZXRlY3RvcnMvUGFpckRldGVjdG9yLmpzIiwibGliL2VudHJ5LmpzIiwibGliL2hlbHBlcnMvQXJyYXlIZWxwZXIuanMiLCJsaWIvaGVscGVycy9Db21tb25IZWxwZXIuanMiLCJsaWIvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCJsaWIvaGVscGVycy9PcHRpb25hbFByb21pc2UuanMiLCJsaWIvaGVscGVycy9QYXRoSGVscGVyLmpzIiwibGliL2hlbHBlcnMvU3RyaW5nSGVscGVyLmpzIiwibGliL3Bvc2l0aW9uaW5nL1BhaXIuanMiLCJsaWIvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwibGliL3Bvc2l0aW9uaW5nL1Bvcy5qcyIsImxpYi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmpzIiwibGliL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwibGliL3Bvc2l0aW9uaW5nL1NpemUuanMiLCJsaWIvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwibGliL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCJsaWIvcG9zaXRpb25pbmcvV3JhcHBpbmcuanMiLCJsaWIvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIiwibGliL3N0cmluZ1BhcnNlcnMvQ29udGV4dC5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL0VzY2FwZUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9OYW1lZENvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlci5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL1N0cmluZ0NvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9WYXJpYWJsZUNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvaW5mbGVjdGlvbi9saWIvaW5mbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDRUEsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUFELENBQVAsQ0FBa0MsWUFBdkQ7O0FBRUEsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQVAsQ0FBaUMsV0FBckQ7O0FBRUEsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQVAsQ0FBOEIsSUFBM0M7O0FBRUEsSUFBSSxTQUFTO0FBQUE7QUFBQTtBQUNYLHFCQUFZLE9BQVosRUFBbUM7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZShcIi4vaGVscGVycy9TdHJpbmdIZWxwZXJcIikuU3RyaW5nSGVscGVyO1xuXG5jb25zdCBBcnJheUhlbHBlciA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvQXJyYXlIZWxwZXJcIikuQXJyYXlIZWxwZXI7XG5cbmNvbnN0IFBhaXIgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9QYWlyXCIpLlBhaXI7XG5cbnZhciBCb3hIZWxwZXIgPSBjbGFzcyBCb3hIZWxwZXIge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIga2V5LCByZWYsIHZhbDtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBkZWNvOiB0aGlzLmNvbnRleHQuY29kZXdhdmUuZGVjbyxcbiAgICAgIHBhZDogMixcbiAgICAgIHdpZHRoOiA1MCxcbiAgICAgIGhlaWdodDogMyxcbiAgICAgIG9wZW5UZXh0OiAnJyxcbiAgICAgIGNsb3NlVGV4dDogJycsXG4gICAgICBwcmVmaXg6ICcnLFxuICAgICAgc3VmZml4OiAnJyxcbiAgICAgIGluZGVudDogMFxuICAgIH07XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvbmUodGV4dCkge1xuICAgIHZhciBrZXksIG9wdCwgcmVmLCB2YWw7XG4gICAgb3B0ID0ge307XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQsIG9wdCk7XG4gIH1cblxuICBkcmF3KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydFNlcCgpICsgXCJcXG5cIiArIHRoaXMubGluZXModGV4dCkgKyBcIlxcblwiICsgdGhpcy5lbmRTZXAoKTtcbiAgfVxuXG4gIHdyYXBDb21tZW50KHN0cikge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnQoc3RyKTtcbiAgfVxuXG4gIHNlcGFyYXRvcigpIHtcbiAgICB2YXIgbGVuO1xuICAgIGxlbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmRlY29MaW5lKGxlbikpO1xuICB9XG5cbiAgc3RhcnRTZXAoKSB7XG4gICAgdmFyIGxuO1xuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5vcGVuVGV4dC5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy53cmFwQ29tbWVudCh0aGlzLm9wZW5UZXh0ICsgdGhpcy5kZWNvTGluZShsbikpO1xuICB9XG5cbiAgZW5kU2VwKCkge1xuICAgIHZhciBsbjtcbiAgICBsbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aCAtIHRoaXMuY2xvc2VUZXh0Lmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmNsb3NlVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKSArIHRoaXMuc3VmZml4O1xuICB9XG5cbiAgZGVjb0xpbmUobGVuKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCh0aGlzLmRlY28sIGxlbik7XG4gIH1cblxuICBwYWRkaW5nKCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMucGFkKTtcbiAgfVxuXG4gIGxpbmVzKHRleHQgPSAnJywgdXB0b0hlaWdodCA9IHRydWUpIHtcbiAgICB2YXIgbCwgbGluZXMsIHg7XG4gICAgdGV4dCA9IHRleHQgfHwgJyc7XG4gICAgbGluZXMgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIik7XG5cbiAgICBpZiAodXB0b0hlaWdodCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIHJlZiwgcmVzdWx0cztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgIGZvciAoeCA9IGkgPSAwLCByZWYgPSB0aGlzLmhlaWdodDsgMCA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmOyB4ID0gMCA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5saW5lKGxpbmVzW3hdIHx8ICcnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0uY2FsbCh0aGlzKS5qb2luKCdcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIGxlbjEsIHJlc3VsdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4xID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuMTsgaSsrKSB7XG4gICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9LmNhbGwodGhpcykuam9pbignXFxuJyk7XG4gICAgfVxuICB9XG5cbiAgbGluZSh0ZXh0ID0gJycpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLmluZGVudCkgKyB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpICsgdGV4dCArIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy53aWR0aCAtIHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkubGVuZ3RoKSArIHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQodGhpcy5kZWNvICsgdGhpcy5wYWRkaW5nKCkpO1xuICB9XG5cbiAgcmlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnModGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZUNhcnJldCh0ZXh0KSk7XG4gIH1cblxuICB0ZXh0Qm91bmRzKHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldFR4dFNpemUodGhpcy5yZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSk7XG4gIH1cblxuICBnZXRCb3hGb3JQb3MocG9zKSB7XG4gICAgdmFyIGNsb25lLCBjdXJMZWZ0LCBkZXB0aCwgZW5kRmluZCwgbGVmdCwgcGFpciwgcGxhY2Vob2xkZXIsIHJlcywgc3RhcnRGaW5kO1xuICAgIGRlcHRoID0gdGhpcy5nZXROZXN0ZWRMdmwocG9zLnN0YXJ0KTtcblxuICAgIGlmIChkZXB0aCA+IDApIHtcbiAgICAgIGxlZnQgPSB0aGlzLmxlZnQoKTtcbiAgICAgIGN1ckxlZnQgPSBTdHJpbmdIZWxwZXIucmVwZWF0KGxlZnQsIGRlcHRoIC0gMSk7XG4gICAgICBjbG9uZSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiO1xuICAgICAgY2xvbmUud2lkdGggPSBwbGFjZWhvbGRlci5sZW5ndGg7XG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IHRoaXMuZGVjbyArIHRoaXMuZGVjbyArIHBsYWNlaG9sZGVyICsgdGhpcy5kZWNvICsgdGhpcy5kZWNvO1xuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKTtcbiAgICAgIGVuZEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuZW5kU2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKTtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcihzdGFydEZpbmQsIGVuZEZpbmQsIHtcbiAgICAgICAgdmFsaWRNYXRjaDogbWF0Y2ggPT4ge1xuICAgICAgICAgIHZhciBmOyAvLyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuXG4gICAgICAgICAgZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpLCBbbGVmdCwgXCJcXG5cIiwgXCJcXHJcIl0sIC0xKTtcbiAgICAgICAgICByZXR1cm4gZiA9PSBudWxsIHx8IGYuc3RyICE9PSBsZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKTtcblxuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGFydCArPSBjdXJMZWZ0Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXROZXN0ZWRMdmwoaW5kZXgpIHtcbiAgICB2YXIgZGVwdGgsIGYsIGxlZnQ7XG4gICAgZGVwdGggPSAwO1xuICAgIGxlZnQgPSB0aGlzLmxlZnQoKTtcblxuICAgIHdoaWxlICgoZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCwgW2xlZnQsIFwiXFxuXCIsIFwiXFxyXCJdLCAtMSkpICE9IG51bGwgJiYgZi5zdHIgPT09IGxlZnQpIHtcbiAgICAgIGluZGV4ID0gZi5wb3M7XG4gICAgICBkZXB0aCsrO1xuICAgIH1cblxuICAgIHJldHVybiBkZXB0aDtcbiAgfVxuXG4gIGdldE9wdEZyb21MaW5lKGxpbmUsIGdldFBhZCA9IHRydWUpIHtcbiAgICB2YXIgZW5kUG9zLCByRW5kLCByU3RhcnQsIHJlc0VuZCwgcmVzU3RhcnQsIHN0YXJ0UG9zO1xuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28pKSArIFwiKShcXFxccyopXCIpO1xuICAgIHJFbmQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMuZGVjbykpICsgXCIpKFxcbnwkKVwiKTtcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpO1xuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKTtcblxuICAgIGlmIChyZXNTdGFydCAhPSBudWxsICYmIHJlc0VuZCAhPSBudWxsKSB7XG4gICAgICBpZiAoZ2V0UGFkKSB7XG4gICAgICAgIHRoaXMucGFkID0gTWF0aC5taW4ocmVzU3RhcnRbM10ubGVuZ3RoLCByZXNFbmRbMV0ubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGg7XG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgdGhpcy5wYWQ7XG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gdGhpcy5wYWQ7XG4gICAgICB0aGlzLndpZHRoID0gZW5kUG9zIC0gc3RhcnRQb3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWZvcm1hdExpbmVzKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzKHRoaXMucmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zKSwgZmFsc2UpO1xuICB9XG5cbiAgcmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGVjbCwgZWNyLCBlZCwgZmxhZywgb3B0LCByZTEsIHJlMjtcblxuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH07XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuZGVjbyk7XG4gICAgICBmbGFnID0gb3B0aW9uc1snbXVsdGlsaW5lJ10gPyAnZ20nIDogJyc7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzezAsJHt0aGlzLnBhZH19YCwgZmxhZyk7XG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBcXFxccyooPzoke2VkfSkqJHtlY3J9XFxcXHMqJGAsIGZsYWcpO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsICcnKS5yZXBsYWNlKHJlMiwgJycpO1xuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5Cb3hIZWxwZXIgPSBCb3hIZWxwZXI7XG5cbiIsIlxuXG5jb25zdCBQb3NDb2xsZWN0aW9uID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvblwiKS5Qb3NDb2xsZWN0aW9uO1xuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50XCIpLlJlcGxhY2VtZW50O1xuXG5jb25zdCBQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9Qb3NcIikuUG9zO1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKFwiLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZVwiKTtcblxudmFyIENsb3NpbmdQcm9tcCA9IGNsYXNzIENsb3NpbmdQcm9tcCB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlMSwgc2VsZWN0aW9ucykge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTE7XG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLl90eXBlZCA9IG51bGw7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5uYkNoYW5nZXMgPSAwO1xuICAgIHRoaXMuc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uKHNlbGVjdGlvbnMpO1xuICB9XG5cbiAgYmVnaW4oKSB7XG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHRoaXMuYWRkQ2FycmV0cygpKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci5jYW5MaXN0ZW5Ub0NoYW5nZSgpKSB7XG4gICAgICAgIHRoaXMucHJveHlPbkNoYW5nZSA9IChjaCA9IG51bGwpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkNoYW5nZShjaCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5wcm94eU9uQ2hhbmdlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkucmVzdWx0KCk7XG4gIH1cblxuICBhZGRDYXJyZXRzKCkge1xuICAgIHRoaXMucmVwbGFjZW1lbnRzID0gdGhpcy5zZWxlY3Rpb25zLndyYXAodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgXCJcXG5cIiwgXCJcXG5cIiArIHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKS5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBwLmNhcnJldFRvU2VsKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHRoaXMucmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIGludmFsaWRUeXBlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZWQgPSBudWxsO1xuICB9XG5cbiAgb25DaGFuZ2UoY2ggPSBudWxsKSB7XG4gICAgdGhpcy5pbnZhbGlkVHlwZWQoKTtcblxuICAgIGlmICh0aGlzLnNraXBFdmVudChjaCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm5iQ2hhbmdlcysrO1xuXG4gICAgaWYgKHRoaXMuc2hvdWxkU3RvcCgpKSB7XG4gICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIHJldHVybiB0aGlzLmNsZWFuQ2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdW1lKCk7XG4gICAgfVxuICB9XG5cbiAgc2tpcEV2ZW50KGNoKSB7XG4gICAgcmV0dXJuIGNoICE9IG51bGwgJiYgY2guY2hhckNvZGVBdCgwKSAhPT0gMzI7XG4gIH1cblxuICByZXN1bWUoKSB7fVxuXG4gIHNob3VsZFN0b3AoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZWQoKSA9PT0gZmFsc2UgfHwgdGhpcy50eXBlZCgpLmluZGV4T2YoJyAnKSAhPT0gLTE7XG4gIH1cblxuICBjbGVhbkNsb3NlKCkge1xuICAgIHZhciBlbmQsIGosIGxlbiwgcmVwbCwgcmVwbGFjZW1lbnRzLCByZXMsIHNlbCwgc2VsZWN0aW9ucywgc3RhcnQ7XG4gICAgcmVwbGFjZW1lbnRzID0gW107XG4gICAgc2VsZWN0aW9ucyA9IHRoaXMuZ2V0U2VsZWN0aW9ucygpO1xuXG4gICAgZm9yIChqID0gMCwgbGVuID0gc2VsZWN0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgc2VsID0gc2VsZWN0aW9uc1tqXTtcblxuICAgICAgY29uc3QgcG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICBpZihwb3Mpe1xuICAgICAgICBzdGFydCA9IHNlbDtcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIHN0YXJ0ICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gZW5kLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLmlubmVyVGV4dCgpLnNwbGl0KCcgJylbMF07XG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoZW5kLmlubmVyU3RhcnQsIGVuZC5pbm5lckVuZCwgcmVzKTtcbiAgICAgICAgcmVwbC5zZWxlY3Rpb25zID0gW3N0YXJ0XTtcbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gocmVwbCk7XG4gICAgICAgIHN0YXJ0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPT09IHRoaXMpIHtcbiAgICAgIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm94eU9uQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy50eXBlZCgpICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jYW5jZWxTZWxlY3Rpb25zKHRoaXMuZ2V0U2VsZWN0aW9ucygpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdG9wKCk7XG4gIH1cblxuICBjYW5jZWxTZWxlY3Rpb25zKHNlbGVjdGlvbnMpIHtcbiAgICB2YXIgZW5kLCBqLCBsZW4sIHJlcGxhY2VtZW50cywgc2VsLCBzdGFydDtcbiAgICByZXBsYWNlbWVudHMgPSBbXTtcbiAgICBzdGFydCA9IG51bGw7XG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdO1xuXG4gICAgICBjb25zdCBwb3MgPSB0aGlzLndoaXRoaW5PcGVuQm91bmRzKHNlbClcbiAgICAgIGlmKHBvcyl7XG4gICAgICAgIHN0YXJ0ID0gcG9zO1xuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgc3RhcnQgIT0gbnVsbCkge1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXcgUmVwbGFjZW1lbnQoc3RhcnQuc3RhcnQsIGVuZC5lbmQsIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoc3RhcnQuZW5kICsgMSwgZW5kLnN0YXJ0IC0gMSkpLnNlbGVjdENvbnRlbnQoKSk7XG4gICAgICAgIHN0YXJ0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIHR5cGVkKCkge1xuICAgIHZhciBjcG9zLCBpbm5lckVuZCwgaW5uZXJTdGFydDtcblxuICAgIGlmICh0aGlzLl90eXBlZCA9PSBudWxsKSB7XG4gICAgICBjcG9zID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCk7XG4gICAgICBpbm5lclN0YXJ0ID0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoO1xuXG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PT0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgJiYgKGlubmVyRW5kID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChpbm5lclN0YXJ0KSkgIT0gbnVsbCAmJiBpbm5lckVuZCA+PSBjcG9zLmVuZCkge1xuICAgICAgICB0aGlzLl90eXBlZCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdHlwZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdHlwZWQ7XG4gIH1cblxuICB3aGl0aGluT3BlbkJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcblxuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5zdGFydFBvc0F0KGkpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcblxuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcblxuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5lbmRQb3NBdChpKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcblxuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXJ0UG9zQXQoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5zdGFydCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cywgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKTtcbiAgfVxuXG4gIGVuZFBvc0F0KGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDEpLCB0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5lbmQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDIpKS53cmFwcGVkQnkodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIsIHRoaXMuY29kZXdhdmUuYnJha2V0cyk7XG4gIH1cblxufTtcbmV4cG9ydHMuQ2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wO1xudmFyIFNpbXVsYXRlZENsb3NpbmdQcm9tcCA9IGNsYXNzIFNpbXVsYXRlZENsb3NpbmdQcm9tcCBleHRlbmRzIENsb3NpbmdQcm9tcCB7XG4gIHJlc3VtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaW11bGF0ZVR5cGUoKTtcbiAgfVxuXG4gIHNpbXVsYXRlVHlwZSgpIHtcbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHZhciBjdXJDbG9zZSwgcmVwbCwgdGFyZ2V0VGV4dDtcbiAgICAgIHRoaXMuaW52YWxpZFR5cGVkKCk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBjdXJDbG9zZSA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0uY29weSgpLmFwcGx5T2Zmc2V0KHRoaXMudHlwZWQoKS5sZW5ndGgpKTtcblxuICAgICAgaWYgKGN1ckNsb3NlKSB7XG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoY3VyQ2xvc2Uuc3RhcnQsIGN1ckNsb3NlLmVuZCwgdGFyZ2V0VGV4dCk7XG5cbiAgICAgICAgaWYgKHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KCkpIHtcbiAgICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25UeXBlU2ltdWxhdGVkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25UeXBlU2ltdWxhdGVkKCk7XG4gICAgICB9XG4gICAgfSwgMik7XG4gIH1cblxuICBza2lwRXZlbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucygpIHtcbiAgICByZXR1cm4gW3RoaXMuY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpLCB0aGlzLnJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdICsgdGhpcy50eXBlZCgpLmxlbmd0aF07XG4gIH1cblxuICB3aGl0aGluQ2xvc2VCb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV4dCwgcmVmLCByZXBsLCB0YXJnZXRQb3M7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG5cbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSk7XG4gICAgICBuZXh0ID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldCh0YXJnZXRQb3MuaW5uZXJTdGFydCk7XG5cbiAgICAgIGlmIChuZXh0ICE9IG51bGwpIHtcbiAgICAgICAgdGFyZ2V0UG9zLm1vdmVTdWZmaXgobmV4dCk7XG5cbiAgICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG5leHBvcnRzLlNpbXVsYXRlZENsb3NpbmdQcm9tcCA9IFNpbXVsYXRlZENsb3NpbmdQcm9tcDtcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IGZ1bmN0aW9uIChjb2Rld2F2ZSwgc2VsZWN0aW9ucykge1xuICBpZiAoY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFNpbXVsYXRlZENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucyk7XG4gIH1cbn07XG5cbiIsIlxuXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZShcIi4vQ29udGV4dFwiKS5Db250ZXh0O1xuXG5jb25zdCBOYW1lc3BhY2VIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlclwiKS5OYW1lc3BhY2VIZWxwZXI7XG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi9Db21tYW5kXCIpLkNvbW1hbmQ7XG5cbnZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxudmFyIENtZEZpbmRlciA9IGNsYXNzIENtZEZpbmRlciB7XG4gIGNvbnN0cnVjdG9yKG5hbWVzLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcblxuICAgIGlmICh0eXBlb2YgbmFtZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lcyA9IFtuYW1lc107XG4gICAgfVxuXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICBuYW1lc3BhY2VzOiBbXSxcbiAgICAgIHBhcmVudENvbnRleHQ6IG51bGwsXG4gICAgICBjb250ZXh0OiBudWxsLFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzLFxuICAgICAgbXVzdEV4ZWN1dGU6IHRydWUsXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWUsXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWUsXG4gICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfTtcbiAgICB0aGlzLm5hbWVzID0gbmFtZXM7XG4gICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcblxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsICYmIGtleSAhPT0gJ3BhcmVudCcpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMuY29kZXdhdmUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmVudENvbnRleHQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMucGFyZW50Q29udGV4dDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5uYW1lc3BhY2VzICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHRoaXMubmFtZXNwYWNlcyk7XG4gICAgfVxuICB9XG5cbiAgZmluZCgpIHtcbiAgICB0aGlzLnRyaWdnZXJEZXRlY3RvcnMoKTtcbiAgICB0aGlzLmNtZCA9IHRoaXMuZmluZEluKHRoaXMucm9vdCk7XG4gICAgcmV0dXJuIHRoaXMuY21kO1xuICB9IC8vICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4gIC8vICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiAgLy8gICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4gIC8vICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG5cblxuICBnZXROYW1lc1dpdGhQYXRocygpIHtcbiAgICB2YXIgaiwgbGVuLCBuYW1lLCBwYXRocywgcmVmLCByZXN0LCBzcGFjZTtcbiAgICBwYXRocyA9IHt9O1xuICAgIHJlZiA9IHRoaXMubmFtZXM7XG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5hbWUgPSByZWZbal07XG4gICAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG5cbiAgICAgIGlmIChzcGFjZSAhPSBudWxsICYmICEoaW5kZXhPZi5jYWxsKHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHNwYWNlKSA+PSAwKSkge1xuICAgICAgICBpZiAoIShzcGFjZSBpbiBwYXRocykpIHtcbiAgICAgICAgICBwYXRoc1tzcGFjZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXRocztcbiAgfVxuXG4gIGFwcGx5U3BhY2VPbk5hbWVzKG5hbWVzcGFjZSkge1xuICAgIHZhciByZXN0LCBzcGFjZTtcbiAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZXNwYWNlLCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcy5uYW1lcy5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBjdXJfcmVzdCwgY3VyX3NwYWNlO1xuICAgICAgW2N1cl9zcGFjZSwgY3VyX3Jlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG5cbiAgICAgIGlmIChjdXJfc3BhY2UgIT0gbnVsbCAmJiBjdXJfc3BhY2UgPT09IHNwYWNlKSB7XG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3QgIT0gbnVsbCkge1xuICAgICAgICBuYW1lID0gcmVzdCArICc6JyArIG5hbWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RGlyZWN0TmFtZXMoKSB7XG4gICAgdmFyIG47XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgIHJlZiA9IHRoaXMubmFtZXM7XG4gICAgICByZXN1bHRzID0gW107XG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBuID0gcmVmW2pdO1xuXG4gICAgICAgIGlmIChuLmluZGV4T2YoXCI6XCIpID09PSAtMSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChuKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9LmNhbGwodGhpcyk7XG4gIH1cblxuICB0cmlnZ2VyRGV0ZWN0b3JzKCkge1xuICAgIHZhciBjbWQsIGRldGVjdG9yLCBpLCBqLCBsZW4sIHBvc2liaWxpdGllcywgcmVmLCByZXMsIHJlc3VsdHM7XG5cbiAgICBpZiAodGhpcy51c2VEZXRlY3RvcnMpIHtcbiAgICAgIHRoaXMudXNlRGV0ZWN0b3JzID0gZmFsc2U7XG4gICAgICBwb3NpYmlsaXRpZXMgPSBbdGhpcy5yb290XS5jb25jYXQobmV3IENtZEZpbmRlcih0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCB7XG4gICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgICAgaSA9IDA7XG4gICAgICByZXN1bHRzID0gW107XG5cbiAgICAgIHdoaWxlIChpIDwgcG9zaWJpbGl0aWVzLmxlbmd0aCkge1xuICAgICAgICBjbWQgPSBwb3NpYmlsaXRpZXNbaV07XG4gICAgICAgIHJlZiA9IGNtZC5kZXRlY3RvcnM7XG5cbiAgICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgZGV0ZWN0b3IgPSByZWZbal07XG4gICAgICAgICAgcmVzID0gZGV0ZWN0b3IuZGV0ZWN0KHRoaXMpO1xuXG4gICAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyhyZXMpO1xuICAgICAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKHJlcywge1xuICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9XG5cbiAgZmluZEluKGNtZCwgcGF0aCA9IG51bGwpIHtcbiAgICB2YXIgYmVzdDtcblxuICAgIGlmIChjbWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgYmVzdCA9IHRoaXMuYmVzdEluUG9zaWJpbGl0aWVzKHRoaXMuZmluZFBvc2liaWxpdGllcygpKTtcblxuICAgIGlmIChiZXN0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBiZXN0O1xuICAgIH1cbiAgfVxuXG4gIGZpbmRQb3NpYmlsaXRpZXMoKSB7XG4gICAgdmFyIGRpcmVjdCwgZmFsbGJhY2ssIGosIGssIGxlbiwgbGVuMSwgbmFtZSwgbmFtZXMsIG5zcGMsIG5zcGNOYW1lLCBwb3NpYmlsaXRpZXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVzdCwgc3BhY2U7XG5cbiAgICBpZiAodGhpcy5yb290ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICB0aGlzLnJvb3QuaW5pdCgpO1xuICAgIHBvc2liaWxpdGllcyA9IFtdO1xuXG4gICAgaWYgKCgocmVmID0gdGhpcy5jb2Rld2F2ZSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmluSW5zdGFuY2UpICE9IG51bGwgPyByZWYxLmNtZCA6IHZvaWQgMCA6IHZvaWQgMCkgPT09IHRoaXMucm9vdCkge1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKCdpbl9pbnN0YW5jZScpKTtcbiAgICB9XG5cbiAgICByZWYyID0gdGhpcy5nZXROYW1lc1dpdGhQYXRocygpO1xuXG4gICAgZm9yIChzcGFjZSBpbiByZWYyKSB7XG4gICAgICBuYW1lcyA9IHJlZjJbc3BhY2VdO1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKHNwYWNlLCBuYW1lcykpO1xuICAgIH1cblxuICAgIHJlZjMgPSB0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpO1xuXG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmMy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbnNwYyA9IHJlZjNbal07XG4gICAgICBbbnNwY05hbWUsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobnNwYywgdHJ1ZSk7XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQobnNwY05hbWUsIHRoaXMuYXBwbHlTcGFjZU9uTmFtZXMobnNwYykpKTtcbiAgICB9XG5cbiAgICByZWY0ID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuXG4gICAgZm9yIChrID0gMCwgbGVuMSA9IHJlZjQubGVuZ3RoOyBrIDwgbGVuMTsgaysrKSB7XG4gICAgICBuYW1lID0gcmVmNFtrXTtcbiAgICAgIGRpcmVjdCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSk7XG5cbiAgICAgIGlmICh0aGlzLmNtZElzVmFsaWQoZGlyZWN0KSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnVzZUZhbGxiYWNrcykge1xuICAgICAgZmFsbGJhY2sgPSB0aGlzLnJvb3QuZ2V0Q21kKCdmYWxsYmFjaycpO1xuXG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGZhbGxiYWNrKSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjayk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXM7XG4gICAgcmV0dXJuIHBvc2liaWxpdGllcztcbiAgfVxuXG4gIGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKGNtZE5hbWUsIG5hbWVzID0gdGhpcy5uYW1lcykge1xuICAgIHZhciBqLCBsZW4sIG5leHQsIG5leHRzLCBwb3NpYmlsaXRpZXM7XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG4gICAgbmV4dHMgPSB0aGlzLmdldENtZEZvbGxvd0FsaWFzKGNtZE5hbWUpO1xuXG4gICAgZm9yIChqID0gMCwgbGVuID0gbmV4dHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5leHQgPSBuZXh0c1tqXTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIHJvb3Q6IG5leHRcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc2liaWxpdGllcztcbiAgfVxuXG4gIGdldENtZEZvbGxvd0FsaWFzKG5hbWUpIHtcbiAgICB2YXIgY21kO1xuICAgIGNtZCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSk7XG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KCk7XG5cbiAgICAgIGlmIChjbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbY21kLCBjbWQuZ2V0QWxpYXNlZCgpXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFtjbWRdO1xuICAgIH1cblxuICAgIHJldHVybiBbY21kXTtcbiAgfVxuXG4gIGNtZElzVmFsaWQoY21kKSB7XG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGNtZC5uYW1lICE9PSAnZmFsbGJhY2snICYmIGluZGV4T2YuY2FsbCh0aGlzLmFuY2VzdG9ycygpLCBjbWQpID49IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gIXRoaXMubXVzdEV4ZWN1dGUgfHwgdGhpcy5jbWRJc0V4ZWN1dGFibGUoY21kKTtcbiAgfVxuXG4gIGFuY2VzdG9ycygpIHtcbiAgICB2YXIgcmVmO1xuXG4gICAgaWYgKCgocmVmID0gdGhpcy5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjbWRJc0V4ZWN1dGFibGUoY21kKSB7XG4gICAgdmFyIG5hbWVzO1xuICAgIG5hbWVzID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuXG4gICAgaWYgKG5hbWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZXNbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGUoKTtcbiAgICB9XG4gIH1cblxuICBjbWRTY29yZShjbWQpIHtcbiAgICB2YXIgc2NvcmU7XG4gICAgc2NvcmUgPSBjbWQuZGVwdGg7XG5cbiAgICBpZiAoY21kLm5hbWUgPT09ICdmYWxsYmFjaycpIHtcbiAgICAgIHNjb3JlIC09IDEwMDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjb3JlO1xuICB9XG5cbiAgYmVzdEluUG9zaWJpbGl0aWVzKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlO1xuXG4gICAgaWYgKHBvc3MubGVuZ3RoID4gMCkge1xuICAgICAgYmVzdCA9IG51bGw7XG4gICAgICBiZXN0U2NvcmUgPSBudWxsO1xuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBwb3NzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSBwb3NzW2pdO1xuICAgICAgICBzY29yZSA9IHRoaXMuY21kU2NvcmUocCk7XG5cbiAgICAgICAgaWYgKGJlc3QgPT0gbnVsbCB8fCBzY29yZSA+PSBiZXN0U2NvcmUpIHtcbiAgICAgICAgICBiZXN0U2NvcmUgPSBzY29yZTtcbiAgICAgICAgICBiZXN0ID0gcDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxufTtcbmV4cG9ydHMuQ21kRmluZGVyID0gQ21kRmluZGVyO1xuXG4iLCJcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIikuQ29udGV4dDtcblxuY29uc3QgVGV4dFBhcnNlciA9IHJlcXVpcmUoXCIuL1RleHRQYXJzZXJcIikuVGV4dFBhcnNlcjtcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZShcIi4vaGVscGVycy9TdHJpbmdIZWxwZXJcIikuU3RyaW5nSGVscGVyO1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKFwiLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZVwiKTtcblxudmFyIENtZEluc3RhbmNlID0gY2xhc3MgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3RvcihjbWQxLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jbWQgPSBjbWQxO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICghKHRoaXMuaXNFbXB0eSgpIHx8IHRoaXMuaW5pdGVkKSkge1xuICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuXG4gICAgICB0aGlzLl9nZXRDbWRPYmooKTtcblxuICAgICAgdGhpcy5faW5pdFBhcmFtcygpO1xuXG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNtZE9iai5pbml0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRQYXJhbShuYW1lLCB2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lZFtuYW1lXSA9IHZhbDtcbiAgfVxuXG4gIHB1c2hQYXJhbSh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMucHVzaCh2YWwpO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCBuZXcgQ29udGV4dCgpO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUpIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuZ2V0Q29udGV4dCgpLmdldEZpbmRlcihjbWROYW1lLCB7XG4gICAgICBuYW1lc3BhY2VzOiB0aGlzLl9nZXRQYXJlbnROYW1lc3BhY2VzKClcbiAgICB9KTtcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzO1xuICAgIHJldHVybiBmaW5kZXI7XG4gIH1cblxuICBfZ2V0Q21kT2JqKCkge1xuICAgIHZhciBjbWQ7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jbWQuaW5pdCgpO1xuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuXG4gICAgICBpZiAoY21kLmNscyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqID0gbmV3IGNtZC5jbHModGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iajtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaW5pdFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lZCA9IHRoaXMuZ2V0RGVmYXVsdHMoKTtcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY21kICE9IG51bGw7XG4gIH1cblxuICByZXN1bHRJc0F2YWlsYWJsZSgpIHtcbiAgICB2YXIgYWxpYXNlZDtcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cblxuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCk7XG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY21kLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgdmFyIGFsaWFzZWQsIHJlcztcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgYWxpYXNlZC5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cblxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kLmRlZmF1bHRzKTtcblxuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kT2JqLmdldERlZmF1bHRzKCkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZCgpIHtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmFsaWFzZWRDbWQgfHwgbnVsbDtcbiAgICB9XG4gIH1cblxuICBnZXRBbGlhc2VkRmluYWwoKSB7XG4gICAgdmFyIGFsaWFzZWQ7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZEZpbmFsQ21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZEZpbmFsQ21kIHx8IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgYWxpYXNlZCA9IHRoaXMuY21kO1xuXG4gICAgICAgIHdoaWxlIChhbGlhc2VkICE9IG51bGwgJiYgYWxpYXNlZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgICBhbGlhc2VkID0gYWxpYXNlZC5fYWxpYXNlZEZyb21GaW5kZXIodGhpcy5nZXRGaW5kZXIodGhpcy5hbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmFsaWFzZWRDbWQgPSBhbGlhc2VkIHx8IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWxpYXNlZEZpbmFsQ21kID0gYWxpYXNlZCB8fCBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWx0ZXJBbGlhc09mKGFsaWFzT2YpIHtcbiAgICByZXR1cm4gYWxpYXNPZjtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgdmFyIG9wdDtcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPcHRpb25zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT3B0aW9ucztcbiAgICAgIH1cblxuICAgICAgb3B0ID0gdGhpcy5jbWQuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKTtcblxuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMuY21kT2JqLmdldE9wdGlvbnMoKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY21kT3B0aW9ucyA9IG9wdDtcbiAgICAgIHJldHVybiBvcHQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0aW9uKGtleSkge1xuICAgIHZhciBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcblxuICAgIGlmIChvcHRpb25zICE9IG51bGwgJiYga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV07XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyYW0obmFtZXMsIGRlZlZhbCA9IG51bGwpIHtcbiAgICB2YXIgaSwgbGVuLCBuLCByZWY7XG5cbiAgICBpZiAoKHJlZiA9IHR5cGVvZiBuYW1lcykgPT09ICdzdHJpbmcnIHx8IHJlZiA9PT0gJ251bWJlcicpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbiA9IG5hbWVzW2ldO1xuXG4gICAgICBpZiAodGhpcy5uYW1lZFtuXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVkW25dO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wYXJhbXNbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXNbbl07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZlZhbDtcbiAgfVxuXG4gIGdldEJvb2xQYXJhbShuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBmYWxzZVZhbHMsIHZhbDtcbiAgICBmYWxzZVZhbHMgPSBbXCJcIiwgXCIwXCIsIFwiZmFsc2VcIiwgXCJub1wiLCBcIm5vbmVcIiwgZmFsc2UsIG51bGwsIDBdO1xuICAgIHZhbCA9IHRoaXMuZ2V0UGFyYW0obmFtZXMsIGRlZlZhbCk7XG4gICAgcmV0dXJuICFmYWxzZVZhbHMuaW5jbHVkZXModmFsKTtcbiAgfVxuXG4gIGFuY2VzdG9yQ21kcygpIHtcbiAgICB2YXIgcmVmO1xuXG4gICAgaWYgKCgocmVmID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlKSAhPSBudWxsID8gcmVmLmluSW5zdGFuY2UgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgYW5jZXN0b3JDbWRzQW5kU2VsZigpIHtcbiAgICByZXR1cm4gdGhpcy5hbmNlc3RvckNtZHMoKS5jb25jYXQoW3RoaXMuY21kXSk7XG4gIH1cblxuICBydW5FeGVjdXRlRnVuY3QoKSB7XG4gICAgdmFyIGNtZDtcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmouZXhlY3V0ZSgpO1xuICAgICAgfVxuXG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcblxuICAgICAgaWYgKGNtZC5leGVjdXRlRnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByYXdSZXN1bHQoKSB7XG4gICAgdmFyIGNtZDtcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuXG4gICAgICBpZiAoY21kLnJlc3VsdEZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRGdW5jdCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNtZC5yZXN1bHRTdHIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0cjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdGhpcy5pbml0KCk7XG5cbiAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHRoaXMucmF3UmVzdWx0KCkpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgdmFyIHBhcnNlcjtcblxuICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICByZXMgPSB0aGlzLmZvcm1hdEluZGVudChyZXMpO1xuXG4gICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwICYmIHRoaXMuZ2V0T3B0aW9uKCdwYXJzZScsIHRoaXMpKSB7XG4gICAgICAgICAgICBwYXJzZXIgPSB0aGlzLmdldFBhcnNlckZvclRleHQocmVzKTtcbiAgICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGFsdGVyRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYWx0ZXJSZXN1bHQnLCB0aGlzKVxuICAgICAgICAgIGlmKGFsdGVyRnVuY3Qpe1xuICAgICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsIHRoaXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cbiAgICAgIH0pLnJlc3VsdCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldFBhcnNlckZvclRleHQodHh0ID0gJycpIHtcbiAgICB2YXIgcGFyc2VyO1xuICAgIHBhcnNlciA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5uZXdJbnN0YW5jZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7XG4gICAgICBpbkluc3RhbmNlOiB0aGlzXG4gICAgfSk7XG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG4gICAgcmV0dXJuIHBhcnNlcjtcbiAgfVxuXG4gIGdldEluZGVudCgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZvcm1hdEluZGVudCh0ZXh0KSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx0L2csICcgICcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhcHBseUluZGVudCh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5pbmRlbnROb3RGaXJzdCh0ZXh0LCB0aGlzLmdldEluZGVudCgpLCBcIiBcIik7XG4gIH1cblxufTtcbmV4cG9ydHMuQ21kSW5zdGFuY2UgPSBDbWRJbnN0YW5jZTtcblxuIiwiXG5cbmNvbnN0IFByb2Nlc3MgPSByZXF1aXJlKFwiLi9Qcm9jZXNzXCIpLlByb2Nlc3M7XG5cbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKFwiLi9Db250ZXh0XCIpLkNvbnRleHQ7XG5cbmNvbnN0IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSA9IHJlcXVpcmUoXCIuL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZVwiKS5Qb3NpdGlvbmVkQ21kSW5zdGFuY2U7XG5cbmNvbnN0IFRleHRQYXJzZXIgPSByZXF1aXJlKFwiLi9UZXh0UGFyc2VyXCIpLlRleHRQYXJzZXI7XG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi9Db21tYW5kXCIpLkNvbW1hbmQ7XG5cbmNvbnN0IExvZ2dlciA9IHJlcXVpcmUoXCIuL0xvZ2dlclwiKS5Mb2dnZXI7XG5cbmNvbnN0IFBvc0NvbGxlY3Rpb24gPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uXCIpLlBvc0NvbGxlY3Rpb247XG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvU3RyaW5nSGVscGVyXCIpLlN0cmluZ0hlbHBlcjtcblxuY29uc3QgQ2xvc2luZ1Byb21wID0gcmVxdWlyZShcIi4vQ2xvc2luZ1Byb21wXCIpLkNsb3NpbmdQcm9tcDtcblxudmFyIENvZGV3YXZlID0gZnVuY3Rpb24gKCkge1xuICBjbGFzcyBDb2Rld2F2ZSB7XG4gICAgY29uc3RydWN0b3IoZWRpdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICAgIENvZGV3YXZlLmluaXQoKTtcbiAgICAgIHRoaXMubWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSc7XG4gICAgICB0aGlzLnZhcnMgPSB7fTtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAnYnJha2V0cyc6ICd+ficsXG4gICAgICAgICdkZWNvJzogJ34nLFxuICAgICAgICAnY2xvc2VDaGFyJzogJy8nLFxuICAgICAgICAnbm9FeGVjdXRlQ2hhcic6ICchJyxcbiAgICAgICAgJ2NhcnJldENoYXInOiAnfCcsXG4gICAgICAgICdjaGVja0NhcnJldCc6IHRydWUsXG4gICAgICAgICdpbkluc3RhbmNlJzogbnVsbFxuICAgICAgfTtcbiAgICAgIHRoaXMucGFyZW50ID0gb3B0aW9uc1sncGFyZW50J107XG4gICAgICB0aGlzLm5lc3RlZCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC5uZXN0ZWQgKyAxIDogMDtcblxuICAgICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcblxuICAgICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZWRpdG9yICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5lZGl0b3IuYmluZGVkVG8odGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMpO1xuXG4gICAgICBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMuaW5JbnN0YW5jZS5jb250ZXh0O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcbiAgICB9XG5cbiAgICBvbkFjdGl2YXRpb25LZXkoKSB7XG4gICAgICB0aGlzLnByb2Nlc3MgPSBuZXcgUHJvY2VzcygpO1xuICAgICAgdGhpcy5sb2dnZXIubG9nKCdhY3RpdmF0aW9uIGtleScpO1xuICAgICAgcmV0dXJuIHRoaXMucnVuQXRDdXJzb3JQb3MoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2VzcyA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBydW5BdEN1cnNvclBvcygpIHtcbiAgICAgIGlmICh0aGlzLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuQXRNdWx0aVBvcyh0aGlzLmVkaXRvci5nZXRNdWx0aVNlbCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkF0UG9zKHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBydW5BdFBvcyhwb3MpIHtcbiAgICAgIGlmIChwb3MgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0N1cnNvciBQb3NpdGlvbiBpcyBlbXB0eScpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKFtwb3NdKTtcbiAgICB9XG5cbiAgICBydW5BdE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBjbWQ7XG5cbiAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpO1xuXG4gICAgICAgICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBjbWQuc2V0TXVsdGlQb3MobXVsdGlQb3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbWQuaW5pdCgpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGNtZCk7XG4gICAgICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zWzBdLnN0YXJ0ID09PSBtdWx0aVBvc1swXS5lbmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQnJha2V0cyhtdWx0aVBvcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9tcHRDbG9zaW5nQ21kKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbW1hbmRPblBvcyhwb3MpIHtcbiAgICAgIHZhciBuZXh0LCBwcmV2O1xuXG4gICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuZm9sbG93ZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMSkge1xuICAgICAgICBwcmV2ID0gcG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgbmV4dCA9IHBvcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnByZWNlZGVkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDApIHtcbiAgICAgICAgICBwb3MgLT0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXYgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHBvcyk7XG5cbiAgICAgICAgaWYgKHByZXYgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCA9IHRoaXMuZmluZE5leHRCcmFrZXQocG9zIC0gMSk7XG5cbiAgICAgICAgaWYgKG5leHQgPT0gbnVsbCB8fCB0aGlzLmNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT09IDApIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBwcmV2LCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHByZXYsIG5leHQgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSk7XG4gICAgfVxuXG4gICAgbmV4dENtZChzdGFydCA9IDApIHtcbiAgICAgIHZhciBiZWdpbm5pbmcsIGYsIHBvcztcbiAgICAgIHBvcyA9IHN0YXJ0O1xuXG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSkpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGJlZ2lubmluZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBiZWdpbm5pbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIGJlZ2lubmluZywgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvcztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmVnaW5uaW5nID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRFbmNsb3NpbmdDbWQocG9zID0gMCkge1xuICAgICAgdmFyIGNsb3NpbmdQcmVmaXgsIGNwb3MsIHA7XG4gICAgICBjcG9zID0gcG9zO1xuICAgICAgY2xvc2luZ1ByZWZpeCA9IHRoaXMuYnJha2V0cyArIHRoaXMuY2xvc2VDaGFyO1xuXG4gICAgICB3aGlsZSAoKHAgPSB0aGlzLmZpbmROZXh0KGNwb3MsIGNsb3NpbmdQcmVmaXgpKSAhPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGNtZCA9IHRoaXMuY29tbWFuZE9uUG9zKHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aClcbiAgICAgICAgaWYoY21kKXtcbiAgICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpO1xuXG4gICAgICAgICAgaWYgKGNtZC5wb3MgPCBwb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNwb3MgPSBwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHJlY2VkZWRCeUJyYWtldHMocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MgLSB0aGlzLmJyYWtldHMubGVuZ3RoLCBwb3MpID09PSB0aGlzLmJyYWtldHM7XG4gICAgfVxuXG4gICAgZm9sbG93ZWRCeUJyYWtldHMocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpID09PSB0aGlzLmJyYWtldHM7XG4gICAgfVxuXG4gICAgY291bnRQcmV2QnJha2V0KHN0YXJ0KSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGkgPSAwO1xuXG4gICAgICB3aGlsZSAoKHN0YXJ0ID0gdGhpcy5maW5kUHJldkJyYWtldChzdGFydCkpICE9IG51bGwpIHtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBpc0VuZExpbmUocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIDEpID09PSBcIlxcblwiIHx8IHBvcyArIDEgPj0gdGhpcy5lZGl0b3IudGV4dExlbigpO1xuICAgIH1cblxuICAgIGZpbmRQcmV2QnJha2V0KHN0YXJ0KSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dEJyYWtldChzdGFydCwgLTEpO1xuICAgIH1cblxuICAgIGZpbmROZXh0QnJha2V0KHN0YXJ0LCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZjtcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSwgZGlyZWN0aW9uKTtcblxuICAgICAgaWYgKGYgJiYgZi5zdHIgPT09IHRoaXMuYnJha2V0cykge1xuICAgICAgICByZXR1cm4gZi5wb3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZFByZXYoc3RhcnQsIHN0cmluZykge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHQoc3RhcnQsIHN0cmluZywgLTEpO1xuICAgIH1cblxuICAgIGZpbmROZXh0KHN0YXJ0LCBzdHJpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmO1xuICAgICAgZiA9IHRoaXMuZmluZEFueU5leHQoc3RhcnQsIFtzdHJpbmddLCBkaXJlY3Rpb24pO1xuXG4gICAgICBpZiAoZikge1xuICAgICAgICByZXR1cm4gZi5wb3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5maW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBmaW5kTWF0Y2hpbmdQYWlyKHN0YXJ0UG9zLCBvcGVuaW5nLCBjbG9zaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZiwgbmVzdGVkLCBwb3M7XG4gICAgICBwb3MgPSBzdGFydFBvcztcbiAgICAgIG5lc3RlZCA9IDA7XG5cbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtjbG9zaW5nLCBvcGVuaW5nXSwgZGlyZWN0aW9uKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIChkaXJlY3Rpb24gPiAwID8gZi5zdHIubGVuZ3RoIDogMCk7XG5cbiAgICAgICAgaWYgKGYuc3RyID09PSAoZGlyZWN0aW9uID4gMCA/IGNsb3NpbmcgOiBvcGVuaW5nKSkge1xuICAgICAgICAgIGlmIChuZXN0ZWQgPiAwKSB7XG4gICAgICAgICAgICBuZXN0ZWQtLTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGY7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5lc3RlZCsrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFkZEJyYWtldHMocG9zKSB7XG4gICAgICB2YXIgcmVwbGFjZW1lbnRzO1xuICAgICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKTtcbiAgICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKHRoaXMuYnJha2V0cywgdGhpcy5icmFrZXRzKS5tYXAoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgcmV0dXJuIHIuc2VsZWN0Q29udGVudCgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgICB9XG5cbiAgICBwcm9tcHRDbG9zaW5nQ21kKHNlbGVjdGlvbnMpIHtcbiAgICAgIGlmICh0aGlzLmNsb3NpbmdQcm9tcCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY2xvc2luZ1Byb21wLnN0b3AoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wLm5ld0Zvcih0aGlzLCBzZWxlY3Rpb25zKS5iZWdpbigpO1xuICAgIH1cblxuICAgIG5ld0luc3RhbmNlKGVkaXRvciwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBDb2Rld2F2ZShlZGl0b3IsIG9wdGlvbnMpXG4gICAgfVxuXG4gICAgcGFyc2VBbGwocmVjdXJzaXZlID0gdHJ1ZSkge1xuICAgICAgdmFyIGNtZCwgcGFyc2VyLCBwb3MsIHJlcztcblxuICAgICAgaWYgKHRoaXMubmVzdGVkID4gMTAwKSB7XG4gICAgICAgIHRocm93IFwiSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb25cIjtcbiAgICAgIH1cblxuICAgICAgcG9zID0gMDtcblxuICAgICAgd2hpbGUgKGNtZCA9IHRoaXMubmV4dENtZChwb3MpKSB7XG4gICAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKTtcbiAgICAgICAgdGhpcy5lZGl0b3Iuc2V0Q3Vyc29yUG9zKHBvcyk7IC8vIGNvbnNvbGUubG9nKGNtZClcblxuICAgICAgICBjbWQuaW5pdCgpO1xuXG4gICAgICAgIGlmIChyZWN1cnNpdmUgJiYgY21kLmNvbnRlbnQgIT0gbnVsbCAmJiAoY21kLmdldENtZCgpID09IG51bGwgfHwgIWNtZC5nZXRPcHRpb24oJ3ByZXZlbnRQYXJzZUFsbCcpKSkge1xuICAgICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcihjbWQuY29udGVudCksIHtcbiAgICAgICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNtZC5jb250ZW50ID0gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXMgPSBjbWQuZXhlY3V0ZSgpO1xuXG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIGlmIChyZXMudGhlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzeW5jIG5lc3RlZCBjb21tYW5kcyBhcmUgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjbWQucmVwbGFjZUVuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCkuZW5kO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZXRUZXh0KCk7XG4gICAgfVxuXG4gICAgZ2V0VGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0KCk7XG4gICAgfVxuXG4gICAgaXNSb290KCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50ID09IG51bGwgJiYgKHRoaXMuaW5JbnN0YW5jZSA9PSBudWxsIHx8IHRoaXMuaW5JbnN0YW5jZS5maW5kZXIgPT0gbnVsbCk7XG4gICAgfVxuXG4gICAgZ2V0Um9vdCgpIHtcbiAgICAgIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRSb290KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEZpbGVTeXN0ZW0oKSB7XG4gICAgICBpZiAodGhpcy5lZGl0b3IuZmlsZVN5c3RlbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lZGl0b3IuZmlsZVN5c3RlbTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Um9vdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVDYXJyZXQodHh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsIHRoaXMuY2FycmV0Q2hhcik7XG4gICAgfVxuXG4gICAgZ2V0Q2FycmV0UG9zKHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRDYXJyZXRQb3ModHh0LCB0aGlzLmNhcnJldENoYXIpO1xuICAgIH1cblxuICAgIHJlZ01hcmtlcihmbGFncyA9IFwiZ1wiKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMubWFya2VyKSwgZmxhZ3MpO1xuICAgIH1cblxuICAgIHJlbW92ZU1hcmtlcnModGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSh0aGlzLnJlZ01hcmtlcigpLCAnJyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXQoKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGVkKSB7XG4gICAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcblxuICAgICAgICBDb21tYW5kLmluaXRDbWRzKCk7XG5cbiAgICAgICAgcmV0dXJuIENvbW1hbmQubG9hZENtZHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIDtcbiAgQ29kZXdhdmUuaW5pdGVkID0gZmFsc2U7XG4gIHJldHVybiBDb2Rld2F2ZTtcbn0uY2FsbCh2b2lkIDApO1xuXG5leHBvcnRzLkNvZGV3YXZlID0gQ29kZXdhdmU7XG5cbiIsIlxuXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZShcIi4vQ29udGV4dFwiKS5Db250ZXh0O1xuXG5jb25zdCBTdG9yYWdlID0gcmVxdWlyZShcIi4vU3RvcmFnZVwiKS5TdG9yYWdlO1xuXG5jb25zdCBOYW1lc3BhY2VIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlclwiKS5OYW1lc3BhY2VIZWxwZXI7XG5cbnZhciBfb3B0S2V5O1xuXG5fb3B0S2V5ID0gZnVuY3Rpb24gKGtleSwgZGljdCwgZGVmVmFsID0gbnVsbCkge1xuICAvLyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICBpZiAoa2V5IGluIGRpY3QpIHtcbiAgICByZXR1cm4gZGljdFtrZXldO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkZWZWYWw7XG4gIH1cbn07XG5cbnZhciBDb21tYW5kID0gZnVuY3Rpb24gKCkge1xuICBjbGFzcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lMSwgZGF0YTEgPSBudWxsLCBwYXJlbnQgPSBudWxsKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lMTtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGExO1xuICAgICAgdGhpcy5jbWRzID0gW107XG4gICAgICB0aGlzLmRldGVjdG9ycyA9IFtdO1xuICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSB0aGlzLnJlc3VsdEZ1bmN0ID0gdGhpcy5yZXN1bHRTdHIgPSB0aGlzLmFsaWFzT2YgPSB0aGlzLmNscyA9IG51bGw7XG4gICAgICB0aGlzLmFsaWFzZWQgPSBudWxsO1xuICAgICAgdGhpcy5mdWxsTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgIHRoaXMuZGVwdGggPSAwO1xuICAgICAgW3RoaXMuX3BhcmVudCwgdGhpcy5faW5pdGVkXSA9IFtudWxsLCBmYWxzZV07XG4gICAgICB0aGlzLnNldFBhcmVudChwYXJlbnQpO1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IHt9O1xuICAgICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgICBwYXJzZTogZmFsc2UsXG4gICAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgICByZXBsYWNlQm94OiBmYWxzZSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBudWxsXG4gICAgICB9O1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgICB0aGlzLmZpbmFsT3B0aW9ucyA9IG51bGw7XG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICB9XG5cbiAgICBzZXRQYXJlbnQodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLl9wYXJlbnQgIT09IHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHZhbHVlO1xuICAgICAgICB0aGlzLmZ1bGxOYW1lID0gdGhpcy5fcGFyZW50ICE9IG51bGwgJiYgdGhpcy5fcGFyZW50Lm5hbWUgIT0gbnVsbCA/IHRoaXMuX3BhcmVudC5mdWxsTmFtZSArICc6JyArIHRoaXMubmFtZSA6IHRoaXMubmFtZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwdGggPSB0aGlzLl9wYXJlbnQgIT0gbnVsbCAmJiB0aGlzLl9wYXJlbnQuZGVwdGggIT0gbnVsbCA/IHRoaXMuX3BhcmVudC5kZXB0aCArIDEgOiAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoIXRoaXMuX2luaXRlZCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnBhcnNlRGF0YSh0aGlzLmRhdGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5yZW1vdmVDbWQodGhpcyk7XG4gICAgfVxuXG4gICAgaXNFZGl0YWJsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFN0ciAhPSBudWxsIHx8IHRoaXMuYWxpYXNPZiAhPSBudWxsO1xuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZSgpIHtcbiAgICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZjtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICB9XG5cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0JywgJ2NscycsICdleGVjdXRlRnVuY3QnXTtcblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal07XG5cbiAgICAgICAgaWYgKHRoaXNbcF0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpc0V4ZWN1dGFibGVXaXRoTmFtZShuYW1lKSB7XG4gICAgICB2YXIgYWxpYXNPZiwgYWxpYXNlZCwgY29udGV4dDtcblxuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgICBhbGlhc09mID0gdGhpcy5hbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIG5hbWUpO1xuICAgICAgICBhbGlhc2VkID0gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpO1xuXG4gICAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmlzRXhlY3V0YWJsZSgpO1xuICAgIH1cblxuICAgIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmO1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG5cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0J107XG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcmVmW2pdO1xuXG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgcmVzO1xuICAgICAgcmVzID0ge307XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG5cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgX2FsaWFzZWRGcm9tRmluZGVyKGZpbmRlcikge1xuICAgICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlO1xuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2U7XG4gICAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2U7XG4gICAgICByZXR1cm4gZmluZGVyLmZpbmQoKTtcbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkKCkge1xuICAgICAgdmFyIGNvbnRleHQ7XG5cbiAgICAgIGlmICh0aGlzLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKHRoaXMuYWxpYXNPZikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEFsaWFzZWRPclRoaXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRBbGlhc2VkKCkgfHwgdGhpcztcbiAgICB9XG5cbiAgICBzZXRPcHRpb25zKGRhdGEpIHtcbiAgICAgIHZhciBrZXksIHJlc3VsdHMsIHZhbDtcbiAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgICB2YWwgPSBkYXRhW2tleV07XG5cbiAgICAgICAgaWYgKGtleSBpbiB0aGlzLmRlZmF1bHRPcHRpb25zKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMub3B0aW9uc1trZXldID0gdmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBfb3B0aW9uc0ZvckFsaWFzZWQoYWxpYXNlZCkge1xuICAgICAgdmFyIG9wdDtcbiAgICAgIG9wdCA9IHt9O1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMuZGVmYXVsdE9wdGlvbnMpO1xuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCBhbGlhc2VkLmdldE9wdGlvbnMoKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5vcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb25zKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb24oa2V5KSB7XG4gICAgICB2YXIgb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcblxuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGVscCgpIHtcbiAgICAgIHZhciBjbWQ7XG4gICAgICBjbWQgPSB0aGlzLmdldENtZCgnaGVscCcpO1xuXG4gICAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5pbml0KCkucmVzdWx0U3RyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlRGF0YShkYXRhKSB7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gZGF0YTtcbiAgICAgICAgdGhpcy5vcHRpb25zWydwYXJzZSddID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGRhdGEgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURpY3REYXRhKGRhdGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcGFyc2VEaWN0RGF0YShkYXRhKSB7XG4gICAgICB2YXIgZXhlY3V0ZSwgcmVzO1xuICAgICAgcmVzID0gX29wdEtleSgncmVzdWx0JywgZGF0YSk7XG5cbiAgICAgIGlmICh0eXBlb2YgcmVzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRGdW5jdCA9IHJlcztcbiAgICAgIH0gZWxzZSBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRTdHIgPSByZXM7XG4gICAgICAgIHRoaXMub3B0aW9uc1sncGFyc2UnXSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJywgZGF0YSk7XG5cbiAgICAgIGlmICh0eXBlb2YgZXhlY3V0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0ZUZ1bmN0ID0gZXhlY3V0ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hbGlhc09mID0gX29wdEtleSgnYWxpYXNPZicsIGRhdGEpO1xuICAgICAgdGhpcy5jbHMgPSBfb3B0S2V5KCdjbHMnLCBkYXRhKTtcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSBfb3B0S2V5KCdkZWZhdWx0cycsIGRhdGEsIHRoaXMuZGVmYXVsdHMpO1xuICAgICAgdGhpcy5zZXRPcHRpb25zKGRhdGEpO1xuXG4gICAgICBpZiAoJ2hlbHAnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLCBkYXRhWydoZWxwJ10sIHRoaXMpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCdmYWxsYmFjaycgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLCBkYXRhWydmYWxsYmFjayddLCB0aGlzKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICgnY21kcycgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZHMoZGF0YVsnY21kcyddKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYWRkQ21kcyhjbWRzKSB7XG4gICAgICB2YXIgZGF0YSwgbmFtZSwgcmVzdWx0cztcbiAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgZm9yIChuYW1lIGluIGNtZHMpIHtcbiAgICAgICAgZGF0YSA9IGNtZHNbbmFtZV07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZENtZChuZXcgQ29tbWFuZChuYW1lLCBkYXRhLCB0aGlzKSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBhZGRDbWQoY21kKSB7XG4gICAgICB2YXIgZXhpc3RzO1xuICAgICAgZXhpc3RzID0gdGhpcy5nZXRDbWQoY21kLm5hbWUpO1xuXG4gICAgICBpZiAoZXhpc3RzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbWQoZXhpc3RzKTtcbiAgICAgIH1cblxuICAgICAgY21kLnNldFBhcmVudCh0aGlzKTtcbiAgICAgIHRoaXMuY21kcy5wdXNoKGNtZCk7XG4gICAgICByZXR1cm4gY21kO1xuICAgIH1cblxuICAgIHJlbW92ZUNtZChjbWQpIHtcbiAgICAgIHZhciBpO1xuXG4gICAgICBpZiAoKGkgPSB0aGlzLmNtZHMuaW5kZXhPZihjbWQpKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuY21kcy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjbWQ7XG4gICAgfVxuXG4gICAgZ2V0Q21kKGZ1bGxuYW1lKSB7XG4gICAgICB2YXIgY21kLCBqLCBsZW4sIG5hbWUsIHJlZiwgcmVmMSwgc3BhY2U7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG5cbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiAocmVmID0gdGhpcy5nZXRDbWQoc3BhY2UpKSAhPSBudWxsID8gcmVmLmdldENtZChuYW1lKSA6IHZvaWQgMDtcbiAgICAgIH1cblxuICAgICAgcmVmMSA9IHRoaXMuY21kcztcblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmMS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBjbWQgPSByZWYxW2pdO1xuXG4gICAgICAgIGlmIChjbWQubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRDbWQoZnVsbG5hbWUsIG5ldyBDb21tYW5kKGZ1bGxuYW1lLnNwbGl0KCc6JykucG9wKCksIGRhdGEpKTtcbiAgICB9XG5cbiAgICBzZXRDbWQoZnVsbG5hbWUsIGNtZCkge1xuICAgICAgdmFyIG5hbWUsIG5leHQsIHNwYWNlO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKTtcblxuICAgICAgaWYgKHNwYWNlICE9IG51bGwpIHtcbiAgICAgICAgbmV4dCA9IHRoaXMuZ2V0Q21kKHNwYWNlKTtcblxuICAgICAgICBpZiAobmV4dCA9PSBudWxsKSB7XG4gICAgICAgICAgbmV4dCA9IHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKHNwYWNlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSwgY21kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKGNtZCk7XG4gICAgICAgIHJldHVybiBjbWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkRGV0ZWN0b3IoZGV0ZWN0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmRldGVjdG9ycy5wdXNoKGRldGVjdG9yKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdENtZHMoKSB7XG4gICAgICB2YXIgaiwgbGVuLCBwcm92aWRlciwgcmVmLCByZXN1bHRzO1xuICAgICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCwge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnaGVsbG8nOiB7XG4gICAgICAgICAgICBoZWxwOiBcIlxcXCJIZWxsbywgd29ybGQhXFxcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxcbm1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xcbnZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYVwiLFxuICAgICAgICAgICAgcmVzdWx0OiAnSGVsbG8sIFdvcmxkISdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVmID0gdGhpcy5wcm92aWRlcnM7XG4gICAgICByZXN1bHRzID0gW107XG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwcm92aWRlciA9IHJlZltqXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHByb3ZpZGVyLnJlZ2lzdGVyKENvbW1hbmQuY21kcykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBzdGF0aWMgc2F2ZUNtZChmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZUluUGF0aCgnY21kcycsIGZ1bGxuYW1lLCBkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBsb2FkQ21kcygpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcztcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHRoaXMuc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gICAgICB9KS50aGVuKHNhdmVkQ21kcyA9PiB7XG4gICAgICAgIHZhciBkYXRhLCBmdWxsbmFtZSwgcmVzdWx0cztcblxuICAgICAgICBpZiAoc2F2ZWRDbWRzICE9IG51bGwpIHtcbiAgICAgICAgICByZXN1bHRzID0gW107XG5cbiAgICAgICAgICBmb3IgKGZ1bGxuYW1lIGluIHNhdmVkQ21kcykge1xuICAgICAgICAgICAgZGF0YSA9IHNhdmVkQ21kc1tmdWxsbmFtZV07XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0U2F2ZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNhdmUoJ2NtZHMnLCB7fSk7XG4gICAgfVxuXG4gICAgc3RhdGljIG1ha2VWYXJDbWQobmFtZSwgYmFzZSA9IHt9KSB7XG4gICAgICBiYXNlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHAsIHZhbDtcbiAgICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcblxuICAgICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIG1ha2VCb29sVmFyQ21kKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBwLCB2YWw7XG4gICAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG5cbiAgICAgICAgaWYgKCEodmFsICE9IG51bGwgJiYgKHZhbCA9PT0gJzAnIHx8IHZhbCA9PT0gJ2ZhbHNlJyB8fCB2YWwgPT09ICdubycpKSkge1xuICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuXG4gIH1cblxuICA7XG4gIENvbW1hbmQucHJvdmlkZXJzID0gW107XG4gIENvbW1hbmQuc3RvcmFnZSA9IG5ldyBTdG9yYWdlKCk7XG4gIHJldHVybiBDb21tYW5kO1xufS5jYWxsKHZvaWQgMCk7XG5cbmV4cG9ydHMuQ29tbWFuZCA9IENvbW1hbmQ7XG52YXIgQmFzZUNvbW1hbmQgPSBjbGFzcyBCYXNlQ29tbWFuZCB7XG4gIGNvbnN0cnVjdG9yKGluc3RhbmNlMSkge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTE7XG4gIH1cblxuICBpbml0KCkge31cblxuICByZXN1bHRJc0F2YWlsYWJsZSgpIHtcbiAgICByZXR1cm4gdGhpc1tcInJlc3VsdFwiXSAhPSBudWxsO1xuICB9XG5cbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxufTtcbmV4cG9ydHMuQmFzZUNvbW1hbmQgPSBCYXNlQ29tbWFuZDtcblxuIiwiY29uc3QgQXJyYXlIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL0FycmF5SGVscGVyXCIpLkFycmF5SGVscGVyO1xuXG52YXIgaW5kZXhPZiA9IFtdLmluZGV4T2Y7XG52YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSkge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTtcbiAgICB0aGlzLm5hbWVTcGFjZXMgPSBbXTtcbiAgfVxuXG4gIGFkZE5hbWVTcGFjZShuYW1lKSB7XG4gICAgaWYgKGluZGV4T2YuY2FsbCh0aGlzLm5hbWVTcGFjZXMsIG5hbWUpIDwgMCkge1xuICAgICAgdGhpcy5uYW1lU3BhY2VzLnB1c2gobmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYWRkTmFtZXNwYWNlcyhzcGFjZXMpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzLCBzcGFjZTtcblxuICAgIGlmIChzcGFjZXMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3BhY2VzID09PSAnc3RyaW5nJykge1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBzcGFjZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgc3BhY2UgPSBzcGFjZXNbal07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZE5hbWVTcGFjZShzcGFjZSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICByZW1vdmVOYW1lU3BhY2UobmFtZSkge1xuICAgIHJldHVybiB0aGlzLm5hbWVTcGFjZXMgPSB0aGlzLm5hbWVTcGFjZXMuZmlsdGVyKGZ1bmN0aW9uIChuKSB7XG4gICAgICByZXR1cm4gbiAhPT0gbmFtZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldE5hbWVTcGFjZXMoKSB7XG4gICAgdmFyIG5wY3M7XG5cbiAgICBpZiAodGhpcy5fbmFtZXNwYWNlcyA9PSBudWxsKSB7XG4gICAgICBucGNzID0gdGhpcy5uYW1lU3BhY2VzO1xuXG4gICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICBucGNzID0gbnBjcy5jb25jYXQodGhpcy5wYXJlbnQuZ2V0TmFtZVNwYWNlcygpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLnVuaXF1ZShucGNzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcztcbiAgfVxuXG4gIGdldENtZChjbWROYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMpO1xuICAgIHJldHVybiBmaW5kZXIuZmluZCgpO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgQ29udGV4dC5jbWRGaW5kZXJDbGFzcyhjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0aGlzLmlzUm9vdCgpLFxuICAgICAgY29kZXdhdmU6IHRoaXMuY29kZXdhdmUsXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSwgb3B0aW9ucykpO1xuICB9XG5cbiAgaXNSb290KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9PSBudWxsO1xuICB9XG5cbiAgZ2V0UGFyZW50T3JSb290KCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50KHN0cikge1xuICAgIHZhciBjYztcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcblxuICAgIGlmIChjYy5pbmRleE9mKCclcycpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsIHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50TGVmdChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcblxuICAgIGlmICgoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5zdWJzdHIoMCwgaSkgKyBzdHI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0cjtcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudFJpZ2h0KHN0ciA9ICcnKSB7XG4gICAgdmFyIGNjLCBpO1xuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpO1xuXG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIHN0ciArIGNjLnN1YnN0cihpICsgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdHIgKyAnICcgKyBjYztcbiAgICB9XG4gIH1cblxuICBjbWRJbnN0YW5jZUZvcihjbWQpIHtcbiAgICByZXR1cm4gbmV3IENvbnRleHQuY21kSW5zdGFuY2VDbGFzcyhjbWQsIHRoaXMpO1xuICB9XG5cbiAgZ2V0Q29tbWVudENoYXIoKSB7XG4gICAgdmFyIGNoYXIsIGNtZCwgaW5zdCwgcmVzO1xuXG4gICAgaWYgKHRoaXMuY29tbWVudENoYXIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tbWVudENoYXI7XG4gICAgfVxuXG4gICAgY21kID0gdGhpcy5nZXRDbWQoJ2NvbW1lbnQnKTtcbiAgICBjaGFyID0gJzwhLS0gJXMgLS0+JztcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaW5zdCA9IHRoaXMuY21kSW5zdGFuY2VGb3IoY21kKTtcbiAgICAgIGluc3QuY29udGVudCA9ICclcyc7XG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpO1xuXG4gICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgY2hhciA9IHJlcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbW1lbnRDaGFyID0gY2hhcjtcbiAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgfVxuXG59O1xuZXhwb3J0cy5Db250ZXh0ID0gQ29udGV4dDtcblxuIiwiXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi9Db21tYW5kXCIpLkNvbW1hbmQ7XG5cbnZhciBFZGl0Q21kUHJvcCA9IGNsYXNzIEVkaXRDbWRQcm9wIHtcbiAgY29uc3RydWN0b3IobmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywgaSwga2V5LCBsZW4sIHJlZiwgdmFsO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAndmFyJzogbnVsbCxcbiAgICAgICdvcHQnOiBudWxsLFxuICAgICAgJ2Z1bmN0JzogbnVsbCxcbiAgICAgICdkYXRhTmFtZSc6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JzogZmFsc2UsXG4gICAgICAnY2FycmV0JzogZmFsc2VcbiAgICB9O1xuICAgIHJlZiA9IFsndmFyJywgJ29wdCcsICdmdW5jdCddO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBrZXkgPSByZWZbaV07XG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBkZWZhdWx0c1snZGF0YU5hbWUnXSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcblxuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIHdyaXRlRm9yKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9ialt0aGlzLmRhdGFOYW1lXSA9IHBhcnNlci52YXJzW3RoaXMubmFtZV07XG4gICAgfVxuICB9XG5cbiAgdmFsRnJvbUNtZChjbWQpIHtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLm9wdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZ2V0T3B0aW9uKHRoaXMub3B0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kW3RoaXMuZnVuY3RdKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnZhciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy52YXJdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3dGb3JDbWQoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgfHwgdmFsICE9IG51bGw7XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnNob3dGb3JDbWQoY21kKSkge1xuICAgICAgcmV0dXJuIGB+fiR7dGhpcy5uYW1lfX5+XFxuJHt0aGlzLnZhbEZyb21DbWQoY21kKSB8fCBcIlwifSR7dGhpcy5jYXJyZXQgPyBcInxcIiA6IFwiXCJ9XFxufn4vJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5FZGl0Q21kUHJvcCA9IEVkaXRDbWRQcm9wO1xuRWRpdENtZFByb3Auc291cmNlID0gY2xhc3Mgc291cmNlIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICB2YWxGcm9tQ21kKGNtZCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gc3VwZXIudmFsRnJvbUNtZChjbWQpO1xuXG4gICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICByZXMgPSByZXMucmVwbGFjZSgvXFx8L2csICd8fCcpO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lLCB7XG4gICAgICAncHJldmVudFBhcnNlQWxsJzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgc2hvd0ZvckNtZChjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIHJldHVybiB0aGlzLnNob3dFbXB0eSAmJiAhKGNtZCAhPSBudWxsICYmIGNtZC5hbGlhc09mICE9IG51bGwpIHx8IHZhbCAhPSBudWxsO1xuICB9XG5cbn07XG5FZGl0Q21kUHJvcC5zdHJpbmcgPSBjbGFzcyBzdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9ICcke3RoaXMudmFsRnJvbUNtZChjbWQpfSR7dGhpcy5jYXJyZXQgPyBcInxcIiA6IFwiXCJ9J35+YDtcbiAgICB9XG4gIH1cblxufTtcbkVkaXRDbWRQcm9wLnJldkJvb2wgPSBjbGFzcyByZXZCb29sIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICB3cml0ZUZvcihwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbdGhpcy5uYW1lXTtcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG5cbiAgICBpZiAodmFsICE9IG51bGwgJiYgIXZhbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG5FZGl0Q21kUHJvcC5ib29sID0gY2xhc3MgYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG4iLCJcblxuY29uc3QgUG9zID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvUG9zXCIpLlBvcztcblxuY29uc3QgU3RyUG9zID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvU3RyUG9zXCIpLlN0clBvcztcblxuY29uc3QgT3B0aW9uYWxQcm9taXNlID0gcmVxdWlyZShcIi4vaGVscGVycy9PcHRpb25hbFByb21pc2VcIik7XG5cbnZhciBFZGl0b3IgPSBjbGFzcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG51bGw7XG4gICAgdGhpcy5fbGFuZyA9IG51bGw7XG4gIH1cblxuICBiaW5kZWRUbyhjb2Rld2F2ZSkge31cblxuICB0ZXh0KHZhbCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0TGVuKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0U3Vic3RyKHN0YXJ0LCBlbmQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgaW5zZXJ0VGV4dEF0KHRleHQsIHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCA9IG51bGwpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgYmVnaW5VbmRvQWN0aW9uKCkge31cblxuICBlbmRVbmRvQWN0aW9uKCkge31cblxuICBnZXRMYW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICB9XG5cbiAgc2V0TGFuZyh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFuZyA9IHZhbDtcbiAgfVxuXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdCgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFsbG93TXVsdGlTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2V0TXVsdGlTZWwoc2VsZWN0aW9ucykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRNdWx0aVNlbCgpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0TGluZUF0KHBvcykge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMuZmluZExpbmVTdGFydChwb3MpLCB0aGlzLmZpbmRMaW5lRW5kKHBvcykpO1xuICB9XG5cbiAgZmluZExpbmVTdGFydChwb3MpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtcIlxcblwiXSwgLTEpO1xuXG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcyArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRMaW5lRW5kKHBvcykge1xuICAgIHZhciBwO1xuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW1wiXFxuXCIsIFwiXFxyXCJdKTtcblxuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRMZW4oKTtcbiAgICB9XG4gIH1cblxuICBmaW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgIHZhciBiZXN0UG9zLCBiZXN0U3RyLCBpLCBsZW4sIHBvcywgc3RyaSwgdGV4dDtcblxuICAgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0LCB0aGlzLnRleHRMZW4oKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoMCwgc3RhcnQpO1xuICAgIH1cblxuICAgIGJlc3RQb3MgPSBudWxsO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gc3RyaW5ncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc3RyaSA9IHN0cmluZ3NbaV07XG4gICAgICBwb3MgPSBkaXJlY3Rpb24gPiAwID8gdGV4dC5pbmRleE9mKHN0cmkpIDogdGV4dC5sYXN0SW5kZXhPZihzdHJpKTtcblxuICAgICAgaWYgKHBvcyAhPT0gLTEpIHtcbiAgICAgICAgaWYgKGJlc3RQb3MgPT0gbnVsbCB8fCBiZXN0UG9zICogZGlyZWN0aW9uID4gcG9zICogZGlyZWN0aW9uKSB7XG4gICAgICAgICAgYmVzdFBvcyA9IHBvcztcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChiZXN0U3RyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3RyUG9zKGRpcmVjdGlvbiA+IDAgPyBiZXN0UG9zICsgc3RhcnQgOiBiZXN0UG9zLCBiZXN0U3RyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cykge1xuICAgIHJldHVybiByZXBsYWNlbWVudHMucmVkdWNlKChwcm9taXNlLCByZXBsKSA9PiB7XG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKG9wdCA9PiB7XG4gICAgICAgIHJlcGwud2l0aEVkaXRvcih0aGlzKTtcbiAgICAgICAgcmVwbC5hcHBseU9mZnNldChvcHQub2Zmc2V0KTtcbiAgICAgICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKShyZXBsLmFwcGx5KCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZWxlY3Rpb25zOiBvcHQuc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKSxcbiAgICAgICAgICAgIG9mZnNldDogb3B0Lm9mZnNldCArIHJlcGwub2Zmc2V0QWZ0ZXIodGhpcylcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh7XG4gICAgICBzZWxlY3Rpb25zOiBbXSxcbiAgICAgIG9mZnNldDogMFxuICAgIH0pKS50aGVuKG9wdCA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMob3B0LnNlbGVjdGlvbnMpO1xuICAgIH0pLnJlc3VsdCgpO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKHNlbGVjdGlvbnMpIHtcbiAgICBpZiAoc2VsZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TXVsdGlTZWwoc2VsZWN0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCwgc2VsZWN0aW9uc1swXS5lbmQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5FZGl0b3IgPSBFZGl0b3I7XG5cbiIsIlxuXG52YXIgTG9nZ2VyID0gZnVuY3Rpb24gKCkge1xuICBjbGFzcyBMb2dnZXIge1xuICAgIGxvZyguLi5hcmdzKSB7XG4gICAgICB2YXIgaSwgbGVuLCBtc2csIHJlc3VsdHM7XG5cbiAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbXNnID0gYXJnc1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY29uc29sZS5sb2cobXNnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICByZXR1cm4gKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUgIT09IG51bGwgPyBjb25zb2xlLmxvZyA6IHZvaWQgMCkgIT0gbnVsbCAmJiB0aGlzLmVuYWJsZWQgJiYgTG9nZ2VyLmVuYWJsZWQ7XG4gICAgfVxuXG4gICAgcnVudGltZShmdW5jdCwgbmFtZSA9IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgY29uc29sZS5sb2coYCR7bmFtZX0gdG9vayAke3QxIC0gdDB9IG1pbGxpc2Vjb25kcy5gKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgdG9Nb25pdG9yKG9iaiwgbmFtZSwgcHJlZml4ID0gJycpIHtcbiAgICAgIHZhciBmdW5jdDtcbiAgICAgIGZ1bmN0ID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIG9ialtuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbml0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBmdW5jdC5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgICB9LCBwcmVmaXggKyBuYW1lKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgbW9uaXRvcihmdW5jdCwgbmFtZSkge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICBpZiAodGhpcy5tb25pdG9yRGF0YVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrKztcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCArPSB0MSAtIHQwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHJlc3VtZSgpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyh0aGlzLm1vbml0b3JEYXRhKTtcbiAgICB9XG5cbiAgfVxuXG4gIDtcbiAgTG9nZ2VyLmVuYWJsZWQgPSB0cnVlO1xuICBMb2dnZXIucHJvdG90eXBlLmVuYWJsZWQgPSB0cnVlO1xuICBMb2dnZXIucHJvdG90eXBlLm1vbml0b3JEYXRhID0ge307XG4gIHJldHVybiBMb2dnZXI7XG59LmNhbGwodm9pZCAwKTtcblxuZXhwb3J0cy5Mb2dnZXIgPSBMb2dnZXI7XG5cbiIsIlxudmFyIE9wdGlvbk9iamVjdCA9IGNsYXNzIE9wdGlvbk9iamVjdCB7XG4gIHNldE9wdHMob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIga2V5LCByZWYsIHJlc3VsdHMsIHZhbDtcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICByZXN1bHRzID0gW107XG5cbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc2V0T3B0KGtleSwgb3B0aW9uc1trZXldKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCB2YWwpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIHNldE9wdChrZXksIHZhbCkge1xuICAgIHZhciByZWY7XG5cbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdChrZXkpIHtcbiAgICB2YXIgcmVmO1xuXG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XTtcbiAgICB9XG4gIH1cblxuICBnZXRPcHRzKCkge1xuICAgIHZhciBrZXksIG9wdHMsIHJlZiwgdmFsO1xuICAgIG9wdHMgPSB7fTtcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIG9wdHNba2V5XSA9IHRoaXMuZ2V0T3B0KGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdHM7XG4gIH1cblxufTtcbmV4cG9ydHMuT3B0aW9uT2JqZWN0ID0gT3B0aW9uT2JqZWN0O1xuXG4iLCJcblxuY29uc3QgQ21kSW5zdGFuY2UgPSByZXF1aXJlKFwiLi9DbWRJbnN0YW5jZVwiKS5DbWRJbnN0YW5jZTtcblxuY29uc3QgQm94SGVscGVyID0gcmVxdWlyZShcIi4vQm94SGVscGVyXCIpLkJveEhlbHBlcjtcblxuY29uc3QgUGFyYW1QYXJzZXIgPSByZXF1aXJlKFwiLi9zdHJpbmdQYXJzZXJzL1BhcmFtUGFyc2VyXCIpLlBhcmFtUGFyc2VyO1xuXG5jb25zdCBQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9Qb3NcIikuUG9zO1xuXG5jb25zdCBTdHJQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9TdHJQb3NcIikuU3RyUG9zO1xuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50XCIpLlJlcGxhY2VtZW50O1xuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL1N0cmluZ0hlbHBlclwiKS5TdHJpbmdIZWxwZXI7XG5cbmNvbnN0IE5hbWVzcGFjZUhlbHBlciA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyXCIpLk5hbWVzcGFjZUhlbHBlcjtcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuL0NvbW1hbmRcIikuQ29tbWFuZDtcblxuY29uc3QgT3B0aW9uYWxQcm9taXNlID0gcmVxdWlyZShcIi4vaGVscGVycy9PcHRpb25hbFByb21pc2VcIik7XG5cbnZhciBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgPSBjbGFzcyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgZXh0ZW5kcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlLCBwb3MxLCBzdHIxKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmU7XG4gICAgdGhpcy5wb3MgPSBwb3MxO1xuICAgIHRoaXMuc3RyID0gc3RyMTtcblxuICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHRoaXMuX2NoZWNrQ2xvc2VyKCk7XG5cbiAgICAgIHRoaXMub3BlbmluZyA9IHRoaXMuc3RyO1xuICAgICAgdGhpcy5ub0JyYWNrZXQgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKTtcblxuICAgICAgdGhpcy5fc3BsaXRDb21wb25lbnRzKCk7XG5cbiAgICAgIHRoaXMuX2ZpbmRDbG9zaW5nKCk7XG5cbiAgICAgIHRoaXMuX2NoZWNrRWxvbmdhdGVkKCk7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrQ2xvc2VyKCkge1xuICAgIHZhciBmLCBub0JyYWNrZXQ7XG4gICAgbm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cik7XG5cbiAgICBpZiAobm9CcmFja2V0LnN1YnN0cmluZygwLCB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciAmJiAoZiA9IHRoaXMuX2ZpbmRPcGVuaW5nUG9zKCkpKSB7XG4gICAgICB0aGlzLmNsb3NpbmdQb3MgPSBuZXcgU3RyUG9zKHRoaXMucG9zLCB0aGlzLnN0cik7XG4gICAgICB0aGlzLnBvcyA9IGYucG9zO1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gZi5zdHI7XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRPcGVuaW5nUG9zKCkge1xuICAgIHZhciBjbG9zaW5nLCBjbWROYW1lLCBvcGVuaW5nO1xuICAgIGNtZE5hbWUgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKS5zdWJzdHJpbmcodGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKTtcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgY21kTmFtZTtcbiAgICBjbG9zaW5nID0gdGhpcy5zdHI7XG5cbiAgICBjb25zdCBmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zLCBvcGVuaW5nLCBjbG9zaW5nLCAtMSlcbiAgICBpZihmKXtcbiAgICAgIGYuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihmLnBvcywgdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcyArIGYuc3RyLmxlbmd0aCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKTtcbiAgICAgIHJldHVybiBmO1xuICAgIH1cbiAgfVxuXG4gIF9zcGxpdENvbXBvbmVudHMoKSB7XG4gICAgdmFyIHBhcnRzO1xuICAgIHBhcnRzID0gdGhpcy5ub0JyYWNrZXQuc3BsaXQoXCIgXCIpO1xuICAgIHRoaXMuY21kTmFtZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHRoaXMucmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIik7XG4gIH1cblxuICBfcGFyc2VQYXJhbXMocGFyYW1zKSB7XG4gICAgdmFyIG5hbWVUb1BhcmFtLCBwYXJzZXI7XG4gICAgcGFyc2VyID0gbmV3IFBhcmFtUGFyc2VyKHBhcmFtcywge1xuICAgICAgYWxsb3dlZE5hbWVkOiB0aGlzLmdldE9wdGlvbignYWxsb3dlZE5hbWVkJyksXG4gICAgICB2YXJzOiB0aGlzLmNvZGV3YXZlLnZhcnNcbiAgICB9KTtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcnNlci5wYXJhbXM7XG4gICAgdGhpcy5uYW1lZCA9IE9iamVjdC5hc3NpZ24odGhpcy5nZXREZWZhdWx0cygpLCBwYXJzZXIubmFtZWQpO1xuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIG5hbWVUb1BhcmFtID0gdGhpcy5nZXRPcHRpb24oJ25hbWVUb1BhcmFtJyk7XG5cbiAgICAgIGlmIChuYW1lVG9QYXJhbSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVkW25hbWVUb1BhcmFtXSA9IHRoaXMuY21kTmFtZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmcoKSB7XG4gICAgY29uc3QgZiA9IHRoaXMuX2ZpbmRDbG9zaW5nUG9zKClcbiAgICBpZihmKXtcbiAgICAgIHRoaXMuY29udGVudCA9IFN0cmluZ0hlbHBlci50cmltRW1wdHlMaW5lKHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgsIGYucG9zKSk7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBmLnBvcyArIGYuc3RyLmxlbmd0aCk7XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRDbG9zaW5nUG9zKCkge1xuICAgIHZhciBjbG9zaW5nLCBvcGVuaW5nO1xuXG4gICAgaWYgKHRoaXMuY2xvc2luZ1BvcyAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUG9zO1xuICAgIH1cblxuICAgIGNsb3NpbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY21kTmFtZSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWROYW1lO1xuXG4gICAgY29uc3QgZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgb3BlbmluZywgY2xvc2luZylcbiAgICBpZihmKXtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3MgPSBmO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Vsb25nYXRlZCgpIHtcbiAgICB2YXIgZW5kUG9zLCBtYXgsIHJlZjtcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpO1xuICAgIG1heCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKTtcblxuICAgIHdoaWxlIChlbmRQb3MgPCBtYXggJiYgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmRlY28pIHtcbiAgICAgIGVuZFBvcyArPSB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoO1xuICAgIH1cblxuICAgIGlmIChlbmRQb3MgPj0gbWF4IHx8IChyZWYgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkpID09PSAnICcgfHwgcmVmID09PSBcIlxcblwiIHx8IHJlZiA9PT0gXCJcXHJcIikge1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKTtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tCb3goKSB7XG4gICAgdmFyIGNsLCBjciwgZW5kUG9zO1xuXG4gICAgaWYgKHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsICYmIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PT0gJ2NvbW1lbnQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2wgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCk7XG4gICAgY3IgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpO1xuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCkgKyBjci5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyAtIGNsLmxlbmd0aCwgdGhpcy5wb3MpID09PSBjbCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyAtIGNyLmxlbmd0aCwgZW5kUG9zKSA9PT0gY3IpIHtcbiAgICAgIHRoaXMucG9zID0gdGhpcy5wb3MgLSBjbC5sZW5ndGg7XG4gICAgICB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGVuZFBvcyk7XG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgJiYgdGhpcy5nZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xKSB7XG4gICAgICB0aGlzLmluQm94ID0gMTtcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCkge1xuICAgIHZhciBlY2wsIGVjciwgZWQsIHJlMSwgcmUyLCByZTM7XG5cbiAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29kZXdhdmUuZGVjbyk7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86JHtlZH0pKyR7ZWNyfSRgLCBcImdtXCIpO1xuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXlxcXFxzKig/OiR7ZWR9KSoke2Vjcn1cXHI/XFxuYCk7XG4gICAgICByZTMgPSBuZXcgUmVnRXhwKGBcXG5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHMqJGApO1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudC5yZXBsYWNlKHJlMSwgJyQxJykucmVwbGFjZShyZTIsICcnKS5yZXBsYWNlKHJlMywgJycpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRQYXJlbnRDbWRzKCkge1xuICAgIHZhciByZWY7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID0gKHJlZiA9IHRoaXMuY29kZXdhdmUuZ2V0RW5jbG9zaW5nQ21kKHRoaXMuZ2V0RW5kUG9zKCkpKSAhPSBudWxsID8gcmVmLmluaXQoKSA6IHZvaWQgMDtcbiAgfVxuXG4gIHNldE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlQb3MgPSBtdWx0aVBvcztcbiAgfVxuXG4gIF9nZXRDbWRPYmooKSB7XG4gICAgdGhpcy5nZXRDbWQoKTtcblxuICAgIHRoaXMuX2NoZWNrQm94KCk7XG5cbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnJlbW92ZUluZGVudEZyb21Db250ZW50KHRoaXMuY29udGVudCk7XG4gICAgcmV0dXJuIHN1cGVyLl9nZXRDbWRPYmooKTtcbiAgfVxuXG4gIF9pbml0UGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJzZVBhcmFtcyh0aGlzLnJhd1BhcmFtcyk7XG4gIH1cblxuICBnZXRDb250ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQgfHwgdGhpcy5jb2Rld2F2ZS5jb250ZXh0O1xuICB9XG5cbiAgZ2V0Q21kKCkge1xuICAgIGlmICh0aGlzLmNtZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9nZXRQYXJlbnRDbWRzKCk7XG5cbiAgICAgIGlmICh0aGlzLm5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikge1xuICAgICAgICB0aGlzLmNtZCA9IENvbW1hbmQuY21kcy5nZXRDbWQoJ2NvcmU6bm9fZXhlY3V0ZScpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSk7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZmluZGVyLmNvbnRleHQ7XG4gICAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmFkZE5hbWVTcGFjZSh0aGlzLmNtZC5mdWxsTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jbWQ7XG4gIH1cblxuICBnZXRGaW5kZXIoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXI7XG4gICAgZmluZGVyID0gdGhpcy5jb2Rld2F2ZS5jb250ZXh0LmdldEZpbmRlcihjbWROYW1lLCB7XG4gICAgICBuYW1lc3BhY2VzOiB0aGlzLl9nZXRQYXJlbnROYW1lc3BhY2VzKClcbiAgICB9KTtcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzO1xuICAgIHJldHVybiBmaW5kZXI7XG4gIH1cblxuICBfZ2V0UGFyZW50TmFtZXNwYWNlcygpIHtcbiAgICB2YXIgbnNwY3MsIG9iajtcbiAgICBuc3BjcyA9IFtdO1xuICAgIG9iaiA9IHRoaXM7XG5cbiAgICB3aGlsZSAob2JqLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICBvYmogPSBvYmoucGFyZW50O1xuXG4gICAgICBpZiAob2JqLmNtZCAhPSBudWxsICYmIG9iai5jbWQuZnVsbE5hbWUgIT0gbnVsbCkge1xuICAgICAgICBuc3Bjcy5wdXNoKG9iai5jbWQuZnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuc3BjcztcbiAgfVxuXG4gIF9yZW1vdmVCcmFja2V0KHN0cikge1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgsIHN0ci5sZW5ndGggLSB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKTtcbiAgfVxuXG4gIGFsdGVyQWxpYXNPZihhbGlhc09mKSB7XG4gICAgdmFyIGNtZE5hbWUsIG5zcGM7XG4gICAgW25zcGMsIGNtZE5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0KHRoaXMuY21kTmFtZSk7XG4gICAgcmV0dXJuIGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJywgY21kTmFtZSk7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgfHwgdGhpcy5zdHIgPT09IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgIT0gbnVsbCAmJiB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcC53aGl0aGluT3BlbkJvdW5kcyh0aGlzLnBvcyArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgoJycpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgY29uc3QgYmVmb3JlRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpXG4gICAgICBpZihiZWZvcmVGdW5jdCl7XG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICAgIHJldHVybiAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkodGhpcy5yZXN1bHQoKSkudGhlbihyZXMgPT4ge1xuICAgICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgocmVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnJlc3VsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRXhlY3V0ZUZ1bmN0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RW5kUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aDtcbiAgfVxuXG4gIGdldFBvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICB9XG5cbiAgZ2V0T3BlbmluZ1BvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLm9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcbiAgfVxuXG4gIGdldEluZGVudCgpIHtcbiAgICB2YXIgaGVscGVyO1xuXG4gICAgaWYgKHRoaXMuaW5kZW50TGVuID09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkpLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gdGhpcy5wb3MgLSB0aGlzLmdldFBvcygpLnByZXZFT0woKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbmRlbnRMZW47XG4gIH1cblxuICByZW1vdmVJbmRlbnRGcm9tQ29udGVudCh0ZXh0KSB7XG4gICAgdmFyIHJlZztcblxuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoJ15cXFxcc3snICsgdGhpcy5nZXRJbmRlbnQoKSArICd9JywgJ2dtJyk7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhbHRlclJlc3VsdEZvckJveChyZXBsKSB7XG4gICAgdmFyIGJveCwgaGVscGVyLCBvcmlnaW5hbCwgcmVzO1xuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KCk7XG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLCBmYWxzZSk7XG5cbiAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3JlcGxhY2VCb3gnKSkge1xuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbCk7XG4gICAgICBbcmVwbC5zdGFydCwgcmVwbC5lbmRdID0gW2JveC5zdGFydCwgYm94LmVuZF07XG4gICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5pbmRlbnQ7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKCk7XG4gICAgICByZXBsLmVuZCA9IG9yaWdpbmFsLm5leHRFT0woKTtcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyB0aGlzLmNvZGV3YXZlLm1hcmtlciArIG9yaWdpbmFsLnNhbWVMaW5lc1N1ZmZpeCgpLCB7XG4gICAgICAgIG11bHRpbGluZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgW3JlcGwucHJlZml4LCByZXBsLnRleHQsIHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdCh0aGlzLmNvZGV3YXZlLm1hcmtlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcGw7XG4gIH1cblxuICBnZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCBwO1xuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KCk7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCAmJiB0aGlzLmNvZGV3YXZlLmNoZWNrQ2FycmV0ICYmIHRoaXMuZ2V0T3B0aW9uKCdjaGVja0NhcnJldCcpKSB7XG4gICAgICBpZiAoKHAgPSB0aGlzLmNvZGV3YXZlLmdldENhcnJldFBvcyhyZXBsLnRleHQpKSAhPSBudWxsKSB7XG4gICAgICAgIGN1cnNvclBvcyA9IHJlcGwuc3RhcnQgKyByZXBsLnByZWZpeC5sZW5ndGggKyBwO1xuICAgICAgfVxuXG4gICAgICByZXBsLnRleHQgPSB0aGlzLmNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiBjdXJzb3JQb3M7XG4gIH1cblxuICBjaGVja011bHRpKHJlcGwpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXdSZXBsLCBvcmlnaW5hbFBvcywgb3JpZ2luYWxUZXh0LCBwb3MsIHJlZiwgcmVwbGFjZW1lbnRzO1xuXG4gICAgaWYgKHRoaXMubXVsdGlQb3MgIT0gbnVsbCAmJiB0aGlzLm11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJlcGxhY2VtZW50cyA9IFtyZXBsXTtcbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KCk7XG4gICAgICByZWYgPSB0aGlzLm11bHRpUG9zO1xuXG4gICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICBwb3MgPSByZWZbaV07XG5cbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0IC0gb3JpZ2luYWxQb3MpO1xuXG4gICAgICAgICAgaWYgKG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT09IG9yaWdpbmFsVGV4dCkge1xuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXBsYWNlbWVudHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbcmVwbF07XG4gICAgfVxuICB9XG5cbiAgcmVwbGFjZVdpdGgodGV4dCkge1xuICAgIHJldHVybiB0aGlzLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KHRoaXMucG9zLCB0aGlzLmdldEVuZFBvcygpLCB0ZXh0KSk7XG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50KHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCByZXBsYWNlbWVudHM7XG4gICAgcmVwbC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcblxuICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYWx0ZXJSZXN1bHRGb3JCb3gocmVwbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICB9XG5cbiAgICBjdXJzb3JQb3MgPSB0aGlzLmdldEN1cnNvckZyb21SZXN1bHQocmVwbCk7XG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBQb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXTtcbiAgICByZXBsYWNlbWVudHMgPSB0aGlzLmNoZWNrTXVsdGkocmVwbCk7XG4gICAgdGhpcy5yZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0O1xuICAgIHRoaXMucmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKCk7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxufTtcbmV4cG9ydHMuUG9zaXRpb25lZENtZEluc3RhbmNlID0gUG9zaXRpb25lZENtZEluc3RhbmNlO1xuXG4iLCJcbnZhciBQcm9jZXNzID0gY2xhc3MgUHJvY2VzcyB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxufTtcbmV4cG9ydHMuUHJvY2VzcyA9IFByb2Nlc3M7XG5cbiIsIlxuXG5jb25zdCBMb2dnZXIgPSByZXF1aXJlKFwiLi9Mb2dnZXJcIikuTG9nZ2VyO1xuXG52YXIgU3RvcmFnZSA9IGNsYXNzIFN0b3JhZ2Uge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgfVxuXG4gIHNhdmUoa2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmUoa2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuXG4gIGxvYWQoa2V5KSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5sb2FkKGtleSk7XG4gICAgfVxuICB9XG5cbiAgZW5naW5lQXZhaWxhYmxlKCkge1xuICAgIGlmICh0aGlzLmVuZ2luZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dnZXIgPSB0aGlzLmxvZ2dlciB8fCBuZXcgTG9nZ2VyKCk7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ05vIHN0b3JhZ2UgZW5naW5lIGF2YWlsYWJsZScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5TdG9yYWdlID0gU3RvcmFnZTtcblxuIiwiXG5cbmNvbnN0IFRleHRQYXJzZXIgPSByZXF1aXJlKFwiLi9UZXh0UGFyc2VyXCIpLlRleHRQYXJzZXI7XG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1Bvc1wiKS5Qb3M7XG5cbnZhciBpc0VsZW1lbnQ7XG52YXIgRG9tS2V5TGlzdGVuZXIgPSBjbGFzcyBEb21LZXlMaXN0ZW5lciB7XG4gIHN0YXJ0TGlzdGVuaW5nKHRhcmdldCkge1xuICAgIHZhciBvbmtleWRvd24sIG9ua2V5cHJlc3MsIG9ua2V5dXAsIHRpbWVvdXQ7XG4gICAgdGltZW91dCA9IG51bGw7XG5cbiAgICBvbmtleWRvd24gPSBlID0+IHtcbiAgICAgIGlmICgoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgfHwgdGhpcy5vYmogPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpICYmIGUua2V5Q29kZSA9PT0gNjkgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAodGhpcy5vbkFjdGl2YXRpb25LZXkgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQWN0aXZhdGlvbktleSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIG9ua2V5dXAgPSBlID0+IHtcbiAgICAgIGlmICh0aGlzLm9uQW55Q2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIG9ua2V5cHJlc3MgPSBlID0+IHtcbiAgICAgIGlmICh0aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMCk7XG4gICAgfTtcblxuICAgIGlmICh0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9ua2V5ZG93bik7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9ua2V5dXApO1xuICAgICAgcmV0dXJuIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgb25rZXlwcmVzcyk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuYXR0YWNoRXZlbnQpIHtcbiAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBvbmtleWRvd24pO1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXl1cFwiLCBvbmtleXVwKTtcbiAgICAgIHJldHVybiB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXByZXNzXCIsIG9ua2V5cHJlc3MpO1xuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5Eb21LZXlMaXN0ZW5lciA9IERvbUtleUxpc3RlbmVyO1xuXG5pc0VsZW1lbnQgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBlO1xuXG4gIHRyeSB7XG4gICAgLy8gVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb20pXG4gICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjsgLy8gQnJvd3NlcnMgbm90IHN1cHBvcnRpbmcgVzMgRE9NMiBkb24ndCBoYXZlIEhUTUxFbGVtZW50IGFuZFxuICAgIC8vIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG5cbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiBvYmoubm9kZVR5cGUgPT09IDEgJiYgdHlwZW9mIG9iai5zdHlsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT09IFwib2JqZWN0XCI7XG4gIH1cbn07XG5cbnZhciBUZXh0QXJlYUVkaXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQxKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQxO1xuICAgICAgdGhpcy5vYmogPSBpc0VsZW1lbnQodGhpcy50YXJnZXQpID8gdGhpcy50YXJnZXQgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldCk7XG5cbiAgICAgIGlmICh0aGlzLm9iaiA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubmFtZXNwYWNlID0gJ3RleHRhcmVhJztcbiAgICAgIHRoaXMuY2hhbmdlTGlzdGVuZXJzID0gW107XG4gICAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPSAwO1xuICAgIH1cblxuICAgIG9uQW55Q2hhbmdlKGUpIHtcbiAgICAgIHZhciBjYWxsYmFjaywgaiwgbGVuMSwgcmVmLCByZXN1bHRzO1xuXG4gICAgICBpZiAodGhpcy5fc2tpcENoYW5nZUV2ZW50IDw9IDApIHtcbiAgICAgICAgcmVmID0gdGhpcy5jaGFuZ2VMaXN0ZW5lcnM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIGNhbGxiYWNrID0gcmVmW2pdO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjYWxsYmFjaygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50LS07XG5cbiAgICAgICAgaWYgKHRoaXMub25Ta2lwZWRDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uU2tpcGVkQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBza2lwQ2hhbmdlRXZlbnQobmIgPSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2tpcENoYW5nZUV2ZW50ICs9IG5iO1xuICAgIH1cblxuICAgIGJpbmRlZFRvKGNvZGV3YXZlKSB7XG4gICAgICB0aGlzLm9uQWN0aXZhdGlvbktleSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNvZGV3YXZlLm9uQWN0aXZhdGlvbktleSgpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHRoaXMuc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpO1xuICAgIH1cblxuICAgIHNlbGVjdGlvblByb3BFeGlzdHMoKSB7XG4gICAgICByZXR1cm4gXCJzZWxlY3Rpb25TdGFydFwiIGluIHRoaXMub2JqO1xuICAgIH1cblxuICAgIGhhc0ZvY3VzKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMub2JqO1xuICAgIH1cblxuICAgIHRleHQodmFsKSB7XG4gICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHRFdmVudENoYW5nZSh2YWwpKSB7XG4gICAgICAgICAgdGhpcy5vYmoudmFsdWUgPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMub2JqLnZhbHVlO1xuICAgIH1cblxuICAgIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHRoaXMuc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSB8fCBzdXBlci5zcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpO1xuICAgIH1cblxuICAgIHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIHZhciBldmVudDtcblxuICAgICAgaWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50ICE9IG51bGwpIHtcbiAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudCAhPSBudWxsICYmIGV2ZW50LmluaXRUZXh0RXZlbnQgIT0gbnVsbCAmJiBldmVudC5pc1RydXN0ZWQgIT09IGZhbHNlKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIGlmIChzdGFydCAhPT0gMCkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihzdGFydCAtIDEsIHN0YXJ0KTtcbiAgICAgICAgICAgIHN0YXJ0LS07XG4gICAgICAgICAgfSBlbHNlIGlmIChlbmQgIT09IHRoaXMudGV4dExlbigpKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKGVuZCwgZW5kICsgMSk7XG4gICAgICAgICAgICBlbmQrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LmluaXRUZXh0RXZlbnQoJ3RleHRJbnB1dCcsIHRydWUsIHRydWUsIG51bGwsIHRleHQsIDkpOyAvLyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcblxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHRoaXMub2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLnNraXBDaGFuZ2VFdmVudCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgICAgaWYgKGRvY3VtZW50LmV4ZWNDb21tYW5kICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXJzb3JQb3MoKSB7XG4gICAgICBpZiAodGhpcy50bXBDdXJzb3JQb3MgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy50bXBDdXJzb3JQb3M7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmhhc0ZvY3VzKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFBvcyh0aGlzLm9iai5zZWxlY3Rpb25TdGFydCwgdGhpcy5vYmouc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJzb3JQb3NGYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKSB7XG4gICAgICB2YXIgbGVuLCBwb3MsIHJuZywgc2VsO1xuXG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuXG4gICAgICAgIGlmIChzZWwucGFyZW50RWxlbWVudCgpID09PSB0aGlzLm9iaikge1xuICAgICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayhzZWwuZ2V0Qm9va21hcmsoKSk7XG4gICAgICAgICAgbGVuID0gMDtcblxuICAgICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIGxlbisrO1xuICAgICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJuZy5zZXRFbmRQb2ludChcIlN0YXJ0VG9TdGFydFwiLCB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKSk7XG4gICAgICAgICAgcG9zID0gbmV3IFBvcygwLCBsZW4pO1xuXG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMCkge1xuICAgICAgICAgICAgcG9zLnN0YXJ0Kys7XG4gICAgICAgICAgICBwb3MuZW5kKys7XG4gICAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudG1wQ3Vyc29yUG9zID0gbnVsbDtcbiAgICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICAgIHJldHVybiB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIH0sIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKSB7XG4gICAgICB2YXIgcm5nO1xuXG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICBybmcubW92ZVN0YXJ0KFwiY2hhcmFjdGVyXCIsIHN0YXJ0KTtcbiAgICAgICAgcm5nLmNvbGxhcHNlKCk7XG4gICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIGVuZCAtIHN0YXJ0KTtcbiAgICAgICAgcmV0dXJuIHJuZy5zZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYW5nKCkge1xuICAgICAgaWYgKHRoaXMuX2xhbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmc7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldExhbmcodmFsKSB7XG4gICAgICB0aGlzLl9sYW5nID0gdmFsO1xuICAgICAgcmV0dXJuIHRoaXMub2JqLnNldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJywgdmFsKTtcbiAgICB9XG5cbiAgICBjYW5MaXN0ZW5Ub0NoYW5nZSgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgIHZhciBpO1xuXG4gICAgICBpZiAoKGkgPSB0aGlzLmNoYW5nZUxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cykge1xuICAgICAgaWYgKHJlcGxhY2VtZW50cy5sZW5ndGggPiAwICYmIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbdGhpcy5nZXRDdXJzb3JQb3MoKV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdXBlci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICAgIH1cblxuICB9XG5cbiAgO1xuICBUZXh0QXJlYUVkaXRvci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmcgPSBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmc7XG4gIHJldHVybiBUZXh0QXJlYUVkaXRvcjtcbn0uY2FsbCh2b2lkIDApO1xuXG5leHBvcnRzLlRleHRBcmVhRWRpdG9yID0gVGV4dEFyZWFFZGl0b3I7XG5cbiIsIlxuXG5jb25zdCBFZGl0b3IgPSByZXF1aXJlKFwiLi9FZGl0b3JcIikuRWRpdG9yO1xuXG5jb25zdCBQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9Qb3NcIikuUG9zO1xuXG52YXIgVGV4dFBhcnNlciA9IGNsYXNzIFRleHRQYXJzZXIgZXh0ZW5kcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcihfdGV4dCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fdGV4dCA9IF90ZXh0O1xuICB9XG5cbiAgdGV4dCh2YWwpIHtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHQgPSB2YWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKVtwb3NdO1xuICB9XG5cbiAgdGV4dExlbihwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkubGVuZ3RoO1xuICB9XG5cbiAgdGV4dFN1YnN0cihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgfVxuXG4gIGluc2VydFRleHRBdCh0ZXh0LCBwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnN1YnN0cmluZygwLCBwb3MpICsgdGV4dCArIHRoaXMudGV4dCgpLnN1YnN0cmluZyhwb3MsIHRoaXMudGV4dCgpLmxlbmd0aCkpO1xuICB9XG5cbiAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIHRoaXMudGV4dCgpLnNsaWNlKGVuZCkpO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnRhcmdldDtcbiAgfVxuXG4gIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBlbmQgPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy50YXJnZXQgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICB9XG5cbn07XG5leHBvcnRzLlRleHRQYXJzZXIgPSBUZXh0UGFyc2VyO1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkNvZGV3YXZlXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIENvZGV3YXZlO1xuICB9XG59KTtcblxuY29uc3QgQ29kZXdhdmUgPSByZXF1aXJlKFwiLi9Db2Rld2F2ZVwiKS5Db2Rld2F2ZTtcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuL0NvbW1hbmRcIikuQ29tbWFuZDtcblxuY29uc3QgQ29yZUNvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoXCIuL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlclwiKS5Db3JlQ29tbWFuZFByb3ZpZGVyO1xuXG5jb25zdCBKc0NvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoXCIuL2NtZHMvSnNDb21tYW5kUHJvdmlkZXJcIikuSnNDb21tYW5kUHJvdmlkZXI7XG5cbmNvbnN0IFBocENvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoXCIuL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyXCIpLlBocENvbW1hbmRQcm92aWRlcjtcblxuY29uc3QgSHRtbENvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoXCIuL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlclwiKS5IdG1sQ29tbWFuZFByb3ZpZGVyO1xuXG5jb25zdCBGaWxlQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZShcIi4vY21kcy9GaWxlQ29tbWFuZFByb3ZpZGVyXCIpLkZpbGVDb21tYW5kUHJvdmlkZXI7XG5cbmNvbnN0IFN0cmluZ0NvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoXCIuL2NtZHMvU3RyaW5nQ29tbWFuZFByb3ZpZGVyXCIpLlN0cmluZ0NvbW1hbmRQcm92aWRlcjtcblxuY29uc3QgUG9zID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvUG9zXCIpLlBvcztcblxuY29uc3QgV3JhcHBlZFBvcyA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3NcIikuV3JhcHBlZFBvcztcblxuY29uc3QgTG9jYWxTdG9yYWdlRW5naW5lID0gcmVxdWlyZShcIi4vc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lXCIpLkxvY2FsU3RvcmFnZUVuZ2luZTtcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIikuQ29udGV4dDtcblxuY29uc3QgQ21kSW5zdGFuY2UgPSByZXF1aXJlKFwiLi9DbWRJbnN0YW5jZVwiKS5DbWRJbnN0YW5jZTtcblxuY29uc3QgQ21kRmluZGVyID0gcmVxdWlyZShcIi4vQ21kRmluZGVyXCIpLkNtZEZpbmRlcjtcblxuQ29udGV4dC5jbWRJbnN0YW5jZUNsYXNzID0gQ21kSW5zdGFuY2VcbkNvbnRleHQuY21kRmluZGVyQ2xhc3MgPSBDbWRGaW5kZXJcblxuUG9zLndyYXBDbGFzcyA9IFdyYXBwZWRQb3M7XG5Db2Rld2F2ZS5pbnN0YW5jZXMgPSBbXTtcbkNvbW1hbmQucHJvdmlkZXJzID0gW25ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpLCBuZXcgUGhwQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBGaWxlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBTdHJpbmdDb21tYW5kUHJvdmlkZXIoKV07XG5cbmlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlRW5naW5lKCk7XG59XG5cbiIsIlxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZShcIi4uL0NvbW1hbmRcIikuQ29tbWFuZDtcbmNvbnN0IEJhc2VDb21tYW5kID0gcmVxdWlyZShcIi4uL0NvbW1hbmRcIikuQmFzZUNvbW1hbmQ7XG5cbmNvbnN0IExhbmdEZXRlY3RvciA9IHJlcXVpcmUoXCIuLi9kZXRlY3RvcnMvTGFuZ0RldGVjdG9yXCIpLkxhbmdEZXRlY3RvcjtcblxuY29uc3QgQWx3YXlzRW5hYmxlZCA9IHJlcXVpcmUoXCIuLi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZFwiKS5BbHdheXNFbmFibGVkO1xuXG5jb25zdCBCb3hIZWxwZXIgPSByZXF1aXJlKFwiLi4vQm94SGVscGVyXCIpLkJveEhlbHBlcjtcblxuY29uc3QgRWRpdENtZFByb3AgPSByZXF1aXJlKFwiLi4vRWRpdENtZFByb3BcIikuRWRpdENtZFByb3A7XG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL1N0cmluZ0hlbHBlclwiKS5TdHJpbmdIZWxwZXI7XG5cbmNvbnN0IFBhdGhIZWxwZXIgPSByZXF1aXJlKFwiLi4vaGVscGVycy9QYXRoSGVscGVyXCIpLlBhdGhIZWxwZXI7XG5cbmNvbnN0IFJlcGxhY2VtZW50ID0gcmVxdWlyZShcIi4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50XCIpLlJlcGxhY2VtZW50O1xuXG52YXIgQm94Q21kLCBDbG9zZUNtZCwgRWRpdENtZCwgRW1tZXRDbWQsIE5hbWVTcGFjZUNtZCwgVGVtcGxhdGVDbWQsIGFsaWFzQ29tbWFuZCwgZXhlY19wYXJlbnQsIGdldENvbW1hbmQsIGdldENvbnRlbnQsIGdldFBhcmFtLCBoZWxwLCBsaXN0Q29tbWFuZCwgbm9fZXhlY3V0ZSwgcXVvdGVfY2FycmV0LCByZW1vdmVDb21tYW5kLCByZW5hbWVDb21tYW5kLCBzZXRDb21tYW5kLCBzdG9yZUpzb25Db21tYW5kO1xudmFyIENvcmVDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBDb3JlQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBjb3JlO1xuICAgIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKTtcbiAgICBjbWRzLmFkZERldGVjdG9yKG5ldyBBbHdheXNFbmFibGVkKCdjb3JlJykpO1xuICAgIGNvcmUuYWRkRGV0ZWN0b3IobmV3IExhbmdEZXRlY3RvcigpKTtcbiAgICByZXR1cm4gY29yZS5hZGRDbWRzKHtcbiAgICAgICdoZWxwJzoge1xuICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICdyZXN1bHQnOiBoZWxwLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydjbWQnXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRvIGdldCBoZWxwIG9uIGEgcGVjaWZpYyBjb21tYW5kLCBkbyA6XFxufn5oZWxwIGhlbGxvfn4gKGhlbGxvIGJlaW5nIHRoZSBjb21tYW5kKVwiLFxuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnb3ZlcnZpZXcnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn5xdW90ZV9jYXJyZXR+flxcbiAgX19fICAgICAgICAgXyAgIF9fICAgICAgX19cXG4gLyBfX3xfX18gIF9ffCB8X19cXFxcIFxcXFwgICAgLyAvXyBfX18gX19fX19fXFxuLyAvX18vIF8gXFxcXC8gX2AgLyAtX1xcXFwgXFxcXC9cXFxcLyAvIF9gIFxcXFwgViAvIC1fL1xcblxcXFxfX19fXFxcXF9fXy9cXFxcX18sX1xcXFxfX198XFxcXF8vXFxcXF8vXFxcXF9fLF98XFxcXF8vXFxcXF9fX3xcXG5UaGUgdGV4dCBlZGl0b3IgaGVscGVyXFxufn4vcXVvdGVfY2FycmV0fn5cXG5cXG5XaGVuIHVzaW5nIENvZGV3YXZlIHlvdSB3aWxsIGJlIHdyaXRpbmcgY29tbWFuZHMgd2l0aGluIFxcbnlvdXIgdGV4dCBlZGl0b3IuIFRoZXNlIGNvbW1hbmRzIG11c3QgYmUgcGxhY2VkIGJldHdlZW4gdHdvIFxcbnBhaXJzIG9mIFxcXCJ+XFxcIiAodGlsZGUpIGFuZCB0aGVuLCB0aGV5IGNhbiBiZSBleGVjdXRlZCBieSBwcmVzc2luZyBcXG5cXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIsIHdpdGggeW91ciBjdXJzb3IgaW5zaWRlIHRoZSBjb21tYW5kXFxuRXg6IH5+IWhlbGxvfn5cXG5cXG5Zb3UgZG9udCBuZWVkIHRvIGFjdHVhbGx5IHR5cGUgYW55IFxcXCJ+XFxcIiAodGlsZGUpLiBcXG5QcmVzc2luZyBcXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XFxud2l0aGluIGEgY29tbWFuZC5cXG5cXG5Db2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxcbkluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxcblRoZSBnZW5lcmF0ZWQgY29tbWVudCBibG9ja3Mgd2lsbCBiZSByZWZlcnJlZCB0byBhcyB3aW5kb3dzIFxcbmluIHRoZSBoZWxwIHNlY3Rpb25zLlxcblxcblRvIGNsb3NlIHRoaXMgd2luZG93IChpLmUuIHJlbW92ZSB0aGlzIGNvbW1lbnQgYmxvY2spLCBwcmVzcyBcXG5cXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXFxufn4hY2xvc2V8fn5cXG5cXG5Vc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcXG5mZWF0dXJlcyBvZiBDb2Rld2F2ZVxcbn5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiBvciB+fiFoZWxwOmRlbW9+flxcblxcbkxpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXFxufn4haGVscDpzdWJqZWN0c35+IG9yIH5+IWhlbHA6c3Vifn4gXFxuXFxufn4hY2xvc2V+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdzdWJqZWN0cyc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fiFoZWxwfn5cXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxcbn5+IWhlbHA6c3ViamVjdHN+fiAofn4haGVscDpzdWJ+filcXG5+fiFoZWxwOmVkaXRpbmd+fiAofn4haGVscDplZGl0fn4pXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc3ViJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpoZWxwOnN1YmplY3RzJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2dldF9zdGFydGVkJzoge1xuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcblRoZSBjbGFzc2ljIEhlbGxvIFdvcmxkLlxcbn5+IWhlbGxvfH5+XFxuXFxufn5oZWxwOmVkaXRpbmc6aW50cm9+flxcbn5+cXVvdGVfY2FycmV0fn5cXG5cXG5Gb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBjcmVhdGluZyB5b3VyIG93biBjb21tYW5kcywgc2VlOlxcbn5+IWhlbHA6ZWRpdGluZ35+XFxuXFxuQ29kZXdhdmUgY29tZXMgd2l0aCBtYW55IHByZS1leGlzdGluZyBjb21tYW5kcy4gSGVyZSBpcyBhbiBleGFtcGxlXFxub2YgSmF2YVNjcmlwdCBhYmJyZXZpYXRpb25zXFxufn4hanM6Zn5+XFxufn4hanM6aWZ+flxcbiAgfn4hanM6bG9nfn5cXFwifn4haGVsbG9+flxcXCJ+fiEvanM6bG9nfn5cXG5+fiEvanM6aWZ+flxcbn5+IS9qczpmfn5cXG5cXG5Db2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXFxucHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuIEVtbWV0IGFiYnJldmlhdGlvbnMgd2lsbCBiZSBcXG51c2VkIGF1dG9tYXRpY2FsbHkgaWYgeW91IGFyZSBpbiBhIEhUTUwgb3IgQ1NTIGZpbGUuXFxufn4hdWw+bGl+fiAoaWYgeW91IGFyZSBpbiBhIGh0bWwgZG9jY3VtZW50KVxcbn5+IWVtbWV0IHVsPmxpfn5cXG5+fiFlbW1ldCBtMiBjc3N+flxcblxcbkNvbW1hbmRzIGFyZSBzdG9yZWQgaW4gbmFtZXNwYWNlcy4gVGhlIHNhbWUgY29tbWFuZCBjYW4gaGF2ZSBcXG5kaWZmZXJlbnQgcmVzdWx0cyBkZXBlbmRpbmcgb24gdGhlIG5hbWVzcGFjZS5cXG5+fiFqczplYWNofn5cXG5+fiFwaHA6b3V0ZXI6ZWFjaH5+XFxufn4hcGhwOmlubmVyOmVhY2h+flxcblxcblNvbWUgb2YgdGhlIG5hbWVzcGFjZXMgYXJlIGFjdGl2ZSBkZXBlbmRpbmcgb24gdGhlIGNvbnRleHQuIFRoZVxcbmZvbGxvd2luZyBjb21tYW5kcyBhcmUgdGhlIHNhbWUgYW5kIHdpbGwgZGlzcGxheSB0aGUgY3VycmVudGx5XFxuYWN0aXZlIG5hbWVzcGFjZS4gVGhlIGZpcnN0IGNvbW1hbmQgY29tbWFuZCB3b3JrcyBiZWNhdXNlIHRoZSBcXG5jb3JlIG5hbWVzcGFjZSBpcyBhY3RpdmUuXFxufn4hbmFtZXNwYWNlfn5cXG5+fiFjb3JlOm5hbWVzcGFjZX5+XFxuXFxuWW91IGNhbiBtYWtlIGEgbmFtZXNwYWNlIGFjdGl2ZSB3aXRoIHRoZSBmb2xsb3dpbmcgY29tbWFuZC5cXG5+fiFuYW1lc3BhY2UgcGhwfn5cXG5cXG5DaGVjayB0aGUgbmFtZXNwYWNlcyBhZ2Fpblxcbn5+IW5hbWVzcGFjZX5+XFxuXFxuSW4gYWRkaXRpb24gdG8gZGV0ZWN0aW5nIHRoZSBkb2N1bWVudCB0eXBlLCBDb2Rld2F2ZSBjYW4gZGV0ZWN0IHRoZVxcbmNvbnRleHQgZnJvbSB0aGUgc3Vycm91bmRpbmcgdGV4dC4gSW4gYSBQSFAgZmlsZSwgaXQgbWVhbnMgQ29kZXdhdmUgXFxud2lsbCBhZGQgdGhlIFBIUCB0YWdzIHdoZW4geW91IG5lZWQgdGhlbS5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2RlbW8nOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmhlbHA6Z2V0X3N0YXJ0ZWQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZWRpdGluZyc6IHtcbiAgICAgICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICAgICAnaW50cm8nOiB7XG4gICAgICAgICAgICAgICAgJ3Jlc3VsdCc6IFwiQ29kZXdhdmUgYWxsb3dzIHlvdSB0byBtYWtlIHlvdXIgb3duIGNvbW1hbmRzIChvciBhYmJyZXZpYXRpb25zKSBcXG5wdXQgeW91ciBjb250ZW50IGluc2lkZSBcXFwic291cmNlXFxcIiB0aGUgZG8gXFxcInNhdmVcXFwiLiBUcnkgYWRkaW5nIGFueSBcXG50ZXh0IHRoYXQgaXMgb24geW91ciBtaW5kLlxcbn5+IWVkaXQgbXlfbmV3X2NvbW1hbmR8fn5cXG5cXG5JZiB5b3UgZGlkIHRoZSBsYXN0IHN0ZXAgcmlnaHQsIHlvdSBzaG91bGQgc2VlIHlvdXIgdGV4dCB3aGVuIHlvdVxcbmRvIHRoZSBmb2xsb3dpbmcgY29tbWFuZC4gSXQgaXMgbm93IHNhdmVkIGFuZCB5b3UgY2FuIHVzZSBpdCBcXG53aGVuZXZlciB5b3Ugd2FudC5cXG5+fiFteV9uZXdfY29tbWFuZH5+XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxuXFxuQWxsIHRoZSB3aW5kb3dzIG9mIENvZGV3YXZlIGFyZSBtYWRlIHdpdGggdGhlIGNvbW1hbmQgXFxcImJveFxcXCIuIFxcblRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXFxuVGhleSBhcmUgdmFsaWQgY29tbWVudHMgc28gdGhleSB3b24ndCBicmVhayB5b3VyIGNvZGUgYW5kIHRoZSBjb21tYW5kIFxcblxcXCJjbG9zZVxcXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxcbmNvbW1hbmRzIHdpdGggdGhlbSBpZiB5b3UgbmVlZCB0byBkaXNwbGF5IHNvbWUgdGV4dCB0ZW1wb3JhcmlseS5cXG5+fiFib3h+flxcblRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcXG5+fiFjbG9zZXx+flxcbn5+IS9ib3h+flxcblxcbn5+cXVvdGVfY2FycmV0fn5cXG5XaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxcbndpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcXFwifFxcXCIgXFxuKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcXG5jaGFyYWN0ZXIuXFxufn4hYm94fn5cXG5vbmUgOiB8IFxcbnR3byA6IHx8XFxufn4hL2JveH5+XFxuXFxuWW91IGNhbiBhbHNvIHVzZSB0aGUgXFxcImVzY2FwZV9waXBlc1xcXCIgY29tbWFuZCB0aGF0IHdpbGwgZXNjYXBlIGFueSBcXG52ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xcbn5+IWVzY2FwZV9waXBlc35+XFxufFxcbn5+IS9lc2NhcGVfcGlwZXN+flxcblxcbkNvbW1hbmRzIGluc2lkZSBvdGhlciBjb21tYW5kcyB3aWxsIGJlIGV4cGFuZGVkIGF1dG9tYXRpY2FsbHkuXFxuSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxcbnRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXFxcIiFcXFwiIChleGNsYW1hdGlvbiBtYXJrKS5cXG5+fiEhaGVsbG9+flxcblxcbkZvciBjb21tYW5kcyB0aGF0IGhhdmUgYm90aCBhbiBvcGVuaW5nIGFuZCBhIGNsb3NpbmcgdGFnLCB5b3UgY2FuIHVzZVxcbnRoZSBcXFwiY29udGVudFxcXCIgY29tbWFuZC4gXFxcImNvbnRlbnRcXFwiIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGV4dFxcbnRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cXG5+fiFlZGl0IHBocDppbm5lcjppZn5+XFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdlZGl0Jzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpoZWxwOmVkaXRpbmcnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdub19leGVjdXRlJzoge1xuICAgICAgICAncmVzdWx0Jzogbm9fZXhlY3V0ZSxcbiAgICAgICAgJ2hlbHAnOiBcIlByZXZlbnQgZXZlcnl0aGluZyBpbnNpZGUgdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBmcm9tIGV4ZWN1dGluZ1wiXG4gICAgICB9LFxuICAgICAgJ2VzY2FwZV9waXBlcyc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHF1b3RlX2NhcnJldCxcbiAgICAgICAgJ2NoZWNrQ2FycmV0JzogZmFsc2UsXG4gICAgICAgICdoZWxwJzogXCJFc2NhcGUgYWxsIGNhcnJldHMgKGZyb20gXFxcInxcXFwiIHRvIFxcXCJ8fFxcXCIpXCJcbiAgICAgIH0sXG4gICAgICAncXVvdGVfY2FycmV0Jzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICAgIH0sXG4gICAgICAnZXhlY19wYXJlbnQnOiB7XG4gICAgICAgICdleGVjdXRlJzogZXhlY19wYXJlbnQsXG4gICAgICAgICdoZWxwJzogXCJFeGVjdXRlIHRoZSBmaXJzdCBjb21tYW5kIHRoYXQgd3JhcCB0aGlzIGluIGl0J3Mgb3BlbiBhbmQgY2xvc2UgdGFnXCJcbiAgICAgIH0sXG4gICAgICAnY29udGVudCc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGdldENvbnRlbnQsXG4gICAgICAgICdoZWxwJzogXCJNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIHdoYXQgd2FzIGJldHdlZW4gdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBvZiBhIGNvbW1hbmRcIlxuICAgICAgfSxcbiAgICAgICdib3gnOiB7XG4gICAgICAgICdjbHMnOiBCb3hDbWQsXG4gICAgICAgICdoZWxwJzogXCJDcmVhdGUgdGhlIGFwcGFyZW5jZSBvZiBhIGJveCBjb21wb3NlZCBmcm9tIGNoYXJhY3RlcnMuIFxcblVzdWFsbHkgd3JhcHBlZCBpbiBhIGNvbW1lbnQuXFxuXFxuVGhlIGJveCB3aWxsIHRyeSB0byBhanVzdCBpdCdzIHNpemUgZnJvbSB0aGUgY29udGVudFwiXG4gICAgICB9LFxuICAgICAgJ2Nsb3NlJzoge1xuICAgICAgICAnY2xzJzogQ2xvc2VDbWQsXG4gICAgICAgICdoZWxwJzogXCJXaWxsIGNsb3NlIHRoZSBmaXJzdCBib3ggYXJvdW5kIHRoaXNcIlxuICAgICAgfSxcbiAgICAgICdwYXJhbSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGdldFBhcmFtLFxuICAgICAgICAnaGVscCc6IFwiTWFpbmx5IHVzZWQgZm9yIGNvbW1hbmQgZWRpdGlvbiwgXFxudGhpcyB3aWxsIHJldHVybiBhIHBhcmFtZXRlciBmcm9tIHRoaXMgY29tbWFuZCBjYWxsXFxuXFxuWW91IGNhbiBwYXNzIGEgbnVtYmVyLCBhIHN0cmluZywgb3IgYm90aC4gXFxuQSBudW1iZXIgZm9yIGEgcG9zaXRpb25lZCBhcmd1bWVudCBhbmQgYSBzdHJpbmdcXG5mb3IgYSBuYW1lZCBwYXJhbWV0ZXJcIlxuICAgICAgfSxcbiAgICAgICdlZGl0Jzoge1xuICAgICAgICAnY21kcyc6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICAgJ3NhdmUnOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmV4ZWNfcGFyZW50J1xuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgICdjbHMnOiBFZGl0Q21kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydjbWQnXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byBlZGl0IGEgY29tbWFuZC4gXFxuU2VlIH5+IWhlbHA6ZWRpdGluZ35+IGZvciBhIHF1aWNrIHR1dG9yaWFsXCJcbiAgICAgIH0sXG4gICAgICAncmVuYW1lJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnbm90X2FwcGxpY2FibGUnOiBcIn5+Ym94fn5cXG5Zb3UgY2FuIG9ubHkgcmVuYW1lIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiLFxuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogcmVuYW1lQ29tbWFuZCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnZnJvbScsICd0byddLFxuICAgICAgICAnaGVscCc6IFwiQWxsb3dzIHRvIHJlbmFtZSBhIGNvbW1hbmQgYW5kIGNoYW5nZSBpdCdzIG5hbWVzcGFjZS4gXFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbi0gVGhlIGZpcnN0IHBhcmFtIGlzIHRoZSBvbGQgbmFtZVxcbi0gVGhlbiBzZWNvbmQgcGFyYW0gaXMgdGhlIG5ldyBuYW1lLCBpZiBpdCBoYXMgbm8gbmFtZXNwYWNlLFxcbiAgaXQgd2lsbCB1c2UgdGhlIG9uZSBmcm9tIHRoZSBvcmlnaW5hbCBjb21tYW5kLlxcblxcbmV4Ljogfn4hcmVuYW1lIG15X2NvbW1hbmQgbXlfY29tbWFuZDJ+flwiXG4gICAgICB9LFxuICAgICAgJ3JlbW92ZSc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9hcHBsaWNhYmxlJzogXCJ+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIixcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IHJlbW92ZUNvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2NtZCddLFxuICAgICAgICAnaGVscCc6IFwiQWxsb3dzIHRvIHJlbW92ZSBhIGNvbW1hbmQuIFxcbllvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cIlxuICAgICAgfSxcbiAgICAgICdhbGlhcyc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiBhbGlhc0NvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWVcbiAgICAgIH0sXG4gICAgICAnbmFtZXNwYWNlJzoge1xuICAgICAgICAnY2xzJzogTmFtZVNwYWNlQ21kLFxuICAgICAgICAnaGVscCc6IFwiU2hvdyB0aGUgY3VycmVudCBuYW1lc3BhY2VzLlxcblxcbkEgbmFtZSBzcGFjZSBjb3VsZCBiZSB0aGUgbmFtZSBvZiB0aGUgbGFuZ3VhZ2VcXG5vciBvdGhlciBraW5kIG9mIGNvbnRleHRzXFxuXFxuSWYgeW91IHBhc3MgYSBwYXJhbSB0byB0aGlzIGNvbW1hbmQsIGl0IHdpbGwgXFxuYWRkIHRoZSBwYXJhbSBhcyBhIG5hbWVzcGFjZSBmb3IgdGhlIGN1cnJlbnQgZWRpdG9yXCJcbiAgICAgIH0sXG4gICAgICAnbnNwYyc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpuYW1lc3BhY2UnXG4gICAgICB9LFxuICAgICAgJ2xpc3QnOiB7XG4gICAgICAgICdyZXN1bHQnOiBsaXN0Q29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZScsICdib3gnLCAnY29udGV4dCddLFxuICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdoZWxwJzogXCJMaXN0IGF2YWlsYWJsZSBjb21tYW5kc1xcblxcbllvdSBjYW4gdXNlIHRoZSBmaXJzdCBhcmd1bWVudCB0byBjaG9vc2UgYSBzcGVjaWZpYyBuYW1lc3BhY2UsIFxcbmJ5IGRlZmF1bHQgYWxsIGN1cmVudCBuYW1lc3BhY2Ugd2lsbCBiZSBzaG93blwiXG4gICAgICB9LFxuICAgICAgJ2xzJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmxpc3QnXG4gICAgICB9LFxuICAgICAgJ2dldCc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGdldENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnXSxcbiAgICAgICAgJ2hlbHAnOiBcIm91dHB1dCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZVwiXG4gICAgICB9LFxuICAgICAgJ3NldCc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHNldENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAndmFsdWUnLCAndmFsJ10sXG4gICAgICAgICdoZWxwJzogXCJzZXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcIlxuICAgICAgfSxcbiAgICAgICdzdG9yZV9qc29uJzoge1xuICAgICAgICAncmVzdWx0Jzogc3RvcmVKc29uQ29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZScsICdqc29uJ10sXG4gICAgICAgICdoZWxwJzogXCJzZXQgYSB2YXJpYWJsZSB3aXRoIHNvbWUganNvbiBkYXRhXCJcbiAgICAgIH0sXG4gICAgICAnanNvbic6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpzdG9yZV9qc29uJ1xuICAgICAgfSxcbiAgICAgICd0ZW1wbGF0ZSc6IHtcbiAgICAgICAgJ2Nscyc6IFRlbXBsYXRlQ21kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ3NlcCddLFxuICAgICAgICAnaGVscCc6IFwicmVuZGVyIGEgdGVtcGxhdGUgZm9yIGEgdmFyaWFibGVcXG5cXG5JZiB0aGUgZmlyc3QgcGFyYW0gaXMgbm90IHNldCBpdCB3aWxsIHVzZSBhbGwgdmFyaWFibGVzIFxcbmZvciB0aGUgcmVuZGVyXFxuSWYgdGhlIHZhcmlhYmxlIGlzIGFuIGFycmF5IHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIHJlcGVhdGVkIFxcbmZvciBlYWNoIGl0ZW1zXFxuVGhlIGBzZXBgIHBhcmFtIGRlZmluZSB3aGF0IHdpbGwgc2VwYXJhdGUgZWFjaCBpdGVtIFxcbmFuZCBkZWZhdWx0IHRvIGEgbGluZSBicmVha1wiXG4gICAgICB9LFxuICAgICAgJ2VtbWV0Jzoge1xuICAgICAgICAnY2xzJzogRW1tZXRDbWQsXG4gICAgICAgICdoZWxwJzogXCJDb2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXFxucHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuXFxuXFxuUGFzcyB0aGUgRW1tZXQgYWJicmV2aWF0aW9uIGFzIGEgcGFyYW0gdG8gZXhwZW5kIGl0LlwiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcbmV4cG9ydHMuQ29yZUNvbW1hbmRQcm92aWRlciA9IENvcmVDb21tYW5kUHJvdmlkZXI7XG5cbmhlbHAgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGNtZCwgY21kTmFtZSwgaGVscENtZCwgc3ViY29tbWFuZHMsIHRleHQ7XG4gIGNtZE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKTtcblxuICBpZiAoY21kTmFtZSAhPSBudWxsKSB7XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQoY21kTmFtZSk7XG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGhlbHBDbWQgPSBjbWQuZ2V0Q21kKCdoZWxwJyk7XG4gICAgICB0ZXh0ID0gaGVscENtZCA/IGB+fiR7aGVscENtZC5mdWxsTmFtZX1+fmAgOiBcIlRoaXMgY29tbWFuZCBoYXMgbm8gaGVscCB0ZXh0XCI7XG4gICAgICBzdWJjb21tYW5kcyA9IGNtZC5jbWRzLmxlbmd0aCA/IGBcXG5TdWItQ29tbWFuZHMgOlxcbn5+bHMgJHtjbWQuZnVsbE5hbWV9IGJveDpubyBjb250ZXh0Om5vfn5gIDogXCJcIjtcbiAgICAgIHJldHVybiBgfn5ib3h+flxcbkhlbHAgZm9yIH5+ISR7Y21kLmZ1bGxOYW1lfX5+IDpcXG5cXG4ke3RleHR9XFxuJHtzdWJjb21tYW5kc31cXG5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ35+aGVscDpvdmVydmlld35+JztcbiAgfVxufTtcblxubm9fZXhlY3V0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgcmVnO1xuICByZWcgPSBuZXcgUmVnRXhwKFwiXihcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cykgKyAnKScgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpKTtcbiAgcmV0dXJuIGluc3RhbmNlLnN0ci5yZXBsYWNlKHJlZywgJyQxJyk7XG59O1xuXG5xdW90ZV9jYXJyZXQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgcmV0dXJuIGluc3RhbmNlLmNvbnRlbnQucmVwbGFjZSgvXFx8L2csICd8fCcpO1xufTtcblxuZXhlY19wYXJlbnQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIHJlcztcblxuICBpZiAoaW5zdGFuY2UucGFyZW50ICE9IG51bGwpIHtcbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpO1xuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnQ7XG4gICAgaW5zdGFuY2UucmVwbGFjZUVuZCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlRW5kO1xuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbmdldENvbnRlbnQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGFmZml4ZXNfZW1wdHksIHByZWZpeCwgc3VmZml4O1xuICBhZmZpeGVzX2VtcHR5ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydhZmZpeGVzX2VtcHR5J10sIGZhbHNlKTtcbiAgcHJlZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICBzdWZmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG5cbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBwcmVmaXggKyAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5jb250ZW50IHx8ICcnKSArIHN1ZmZpeDtcbiAgfVxuXG4gIGlmIChhZmZpeGVzX2VtcHR5KSB7XG4gICAgcmV0dXJuIHByZWZpeCArIHN1ZmZpeDtcbiAgfVxufTtcblxucmVuYW1lQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIHN0b3JhZ2U7XG4gICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICByZXR1cm4gc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gIH0pLnRoZW4oc2F2ZWRDbWRzID0+IHtcbiAgICB2YXIgY21kLCBjbWREYXRhLCBuZXdOYW1lLCBvcmlnbmluYWxOYW1lO1xuICAgIG9yaWduaW5hbE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2Zyb20nXSk7XG4gICAgbmV3TmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAndG8nXSk7XG5cbiAgICBpZiAob3JpZ25pbmFsTmFtZSAhPSBudWxsICYmIG5ld05hbWUgIT0gbnVsbCkge1xuICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQob3JpZ25pbmFsTmFtZSk7XG5cbiAgICAgIGlmIChzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0gIT0gbnVsbCAmJiBjbWQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoIShuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xKSkge1xuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCAnJykgKyBuZXdOYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXTtcblxuICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShuZXdOYW1lLCBjbWREYXRhKTtcblxuICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhO1xuICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbnJlbW92ZUNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgIHZhciBuYW1lO1xuICAgIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKTtcblxuICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcywgc3RvcmFnZTtcbiAgICAgICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbihzYXZlZENtZHMgPT4ge1xuICAgICAgICB2YXIgY21kLCBjbWREYXRhO1xuICAgICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChuYW1lKTtcblxuICAgICAgICBpZiAoc2F2ZWRDbWRzW25hbWVdICE9IG51bGwgJiYgY21kICE9IG51bGwpIHtcbiAgICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW25hbWVdO1xuICAgICAgICAgIGNtZC51bnJlZ2lzdGVyKCk7XG4gICAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tuYW1lXTtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5zYXZlKCdjbWRzJywgc2F2ZWRDbWRzKTtcbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuYWxpYXNDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnYWxpYXMnXSk7XG5cbiAgaWYgKG5hbWUgIT0gbnVsbCAmJiBhbGlhcyAhPSBudWxsKSB7XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQobmFtZSk7XG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgfHwgY21kOyAvLyB1bmxlc3MgYWxpYXMuaW5kZXhPZignOicpID4gLTFcbiAgICAgIC8vIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuXG4gICAgICBDb21tYW5kLnNhdmVDbWQoYWxpYXMsIHtcbiAgICAgICAgYWxpYXNPZjogY21kLmZ1bGxOYW1lXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH1cbn07XG5cbmxpc3RDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBib3gsIGNvbW1hbmRzLCBjb250ZXh0LCBuYW1lLCBuYW1lc3BhY2VzLCB0ZXh0LCB1c2VDb250ZXh0O1xuICBib3ggPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydib3gnXSwgdHJ1ZSk7XG4gIHVzZUNvbnRleHQgPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydjb250ZXh0J10sIHRydWUpO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBuYW1lc3BhY2VzID0gbmFtZSA/IFtuYW1lXSA6IGluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLmZpbHRlcihuc3BjID0+IHtcbiAgICByZXR1cm4gbnNwYyAhPT0gaW5zdGFuY2UuY21kLmZ1bGxOYW1lO1xuICB9KS5jb25jYXQoXCJfcm9vdFwiKTtcbiAgY29udGV4dCA9IHVzZUNvbnRleHQgPyBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpIDogaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQ7XG4gIGNvbW1hbmRzID0gbmFtZXNwYWNlcy5yZWR1Y2UoKGNvbW1hbmRzLCBuc3BjKSA9PiB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSBuc3BjID09PSBcIl9yb290XCIgPyBDb21tYW5kLmNtZHMgOiBjb250ZXh0LmdldENtZChuc3BjLCB7XG4gICAgICBtdXN0RXhlY3V0ZTogZmFsc2VcbiAgICB9KTtcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKTtcblxuICAgICAgaWYgKGNtZC5jbWRzKSB7XG4gICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGNtZC5jbWRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29tbWFuZHM7XG4gIH0sIFtdKTtcbiAgdGV4dCA9IGNvbW1hbmRzLmxlbmd0aCA/IGNvbW1hbmRzLm1hcChjbWQgPT4ge1xuICAgIGNtZC5pbml0KCk7XG4gICAgcmV0dXJuIChjbWQuaXNFeGVjdXRhYmxlKCkgPyAnfn4hJyA6ICd+fiFscyAnKSArIGNtZC5mdWxsTmFtZSArICd+fic7XG4gIH0pLmpvaW4oXCJcXG5cIikgOiBcIlRoaXMgY29udGFpbnMgbm8gc3ViLWNvbW1hbmRzXCI7XG5cbiAgaWYgKGJveCkge1xuICAgIHJldHVybiBgfn5ib3h+flxcbiR7dGV4dH1cXG5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGV4dDtcbiAgfVxufTtcblxuZ2V0Q29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgbmFtZSwgcmVzO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICByZXMgPSBQYXRoSGVscGVyLmdldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSk7XG5cbiAgaWYgKHR5cGVvZiByZXMgPT09IFwib2JqZWN0XCIpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAnICAnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59O1xuXG5zZXRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWw7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd2YWx1ZScsICd2YWwnXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG5cbiAgUGF0aEhlbHBlci5zZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIG5hbWUsIHZhbCk7XG5cbiAgcmV0dXJuICcnO1xufTtcblxuc3RvcmVKc29uQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgbmFtZSwgcCwgdmFsO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnanNvbiddKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcblxuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSwgSlNPTi5wYXJzZSh2YWwpKTtcblxuICByZXR1cm4gJyc7XG59O1xuXG5nZXRQYXJhbSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICBpZiAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuZ2V0UGFyYW0oaW5zdGFuY2UucGFyYW1zLCBpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsICdkZWZhdWx0J10pKTtcbiAgfVxufTtcblxuQm94Q21kID0gY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpO1xuICAgIHRoaXMuY21kID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ2NtZCddKTtcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmhlbHBlci5vcGVuVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY21kICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgdGhpcy5oZWxwZXIuY2xvc2VUZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZC5zcGxpdChcIiBcIilbMF0gKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgfVxuXG4gICAgdGhpcy5oZWxwZXIuZGVjbyA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZGVjbztcbiAgICB0aGlzLmhlbHBlci5wYWQgPSAyO1xuICAgIHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICAgIHJldHVybiB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgfVxuXG4gIGhlaWdodCgpIHtcbiAgICB2YXIgaGVpZ2h0LCBwYXJhbXM7XG5cbiAgICBpZiAodGhpcy5ib3VuZHMoKSAhPSBudWxsKSB7XG4gICAgICBoZWlnaHQgPSB0aGlzLmJvdW5kcygpLmhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVpZ2h0ID0gMztcbiAgICB9XG5cbiAgICBwYXJhbXMgPSBbJ2hlaWdodCddO1xuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLnB1c2goMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCBoZWlnaHQpO1xuICB9XG5cbiAgd2lkdGgoKSB7XG4gICAgdmFyIHBhcmFtcywgd2lkdGg7XG5cbiAgICBpZiAodGhpcy5ib3VuZHMoKSAhPSBudWxsKSB7XG4gICAgICB3aWR0aCA9IHRoaXMuYm91bmRzKCkud2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpZHRoID0gMztcbiAgICB9XG5cbiAgICBwYXJhbXMgPSBbJ3dpZHRoJ107XG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSkge1xuICAgICAgcGFyYW1zLnB1c2goMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWF4KHRoaXMubWluV2lkdGgoKSwgdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSk7XG4gIH1cblxuICBib3VuZHMoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgaWYgKHRoaXMuX2JvdW5kcyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2JvdW5kcyA9IHRoaXMuaGVscGVyLnRleHRCb3VuZHModGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kcztcbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdGhpcy5oZWxwZXIuaGVpZ2h0ID0gdGhpcy5oZWlnaHQoKTtcbiAgICB0aGlzLmhlbHBlci53aWR0aCA9IHRoaXMud2lkdGgoKTtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuZHJhdyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICB9XG5cbiAgbWluV2lkdGgoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNtZC5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG59O1xuQ2xvc2VDbWQgPSBjbGFzcyBDbG9zZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuaW5zdGFuY2UuY29udGV4dCk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHZhciBib3gsIGJveDIsIGRlcHRoLCBwcmVmaXgsIHJlcXVpcmVkX2FmZml4ZXMsIHN1ZmZpeDtcbiAgICBwcmVmaXggPSB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgICBzdWZmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgICBib3ggPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSk7XG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydyZXF1aXJlZF9hZmZpeGVzJ10sIHRydWUpO1xuXG4gICAgaWYgKCFyZXF1aXJlZF9hZmZpeGVzKSB7XG4gICAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSAnJztcbiAgICAgIGJveDIgPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSk7XG5cbiAgICAgIGlmIChib3gyICE9IG51bGwgJiYgKGJveCA9PSBudWxsIHx8IGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIHx8IGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpKSB7XG4gICAgICAgIGJveCA9IGJveDI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJveCAhPSBudWxsKSB7XG4gICAgICBkZXB0aCA9IHRoaXMuaGVscGVyLmdldE5lc3RlZEx2bCh0aGlzLmluc3RhbmNlLmdldFBvcygpLnN0YXJ0KTtcblxuICAgICAgaWYgKGRlcHRoIDwgMikge1xuICAgICAgICB0aGlzLmluc3RhbmNlLmluQm94ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LCBib3guZW5kLCAnJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5yZXBsYWNlV2l0aCgnJyk7XG4gICAgfVxuICB9XG5cbn07XG5FZGl0Q21kID0gY2xhc3MgRWRpdENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB2YXIgcmVmO1xuICAgIHRoaXMuY21kTmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG4gICAgdGhpcy52ZXJiYWxpemUgPSAocmVmID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMV0pKSA9PT0gJ3YnIHx8IHJlZiA9PT0gJ3ZlcmJhbGl6ZSc7XG5cbiAgICBpZiAodGhpcy5jbWROYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpO1xuICAgICAgdGhpcy5maW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2U7XG4gICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lZGl0YWJsZSA9IHRoaXMuY21kICE9IG51bGwgPyB0aGlzLmNtZC5pc0VkaXRhYmxlKCkgOiB0cnVlO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhDb250ZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhvdXRDb250ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0V2l0aENvbnRlbnQoKSB7XG4gICAgdmFyIGRhdGEsIGksIGxlbiwgcCwgcGFyc2VyLCByZWY7XG4gICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgZGF0YSA9IHt9O1xuICAgIHJlZiA9IEVkaXRDbWQucHJvcHM7XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHAgPSByZWZbaV07XG4gICAgICBwLndyaXRlRm9yKHBhcnNlciwgZGF0YSk7XG4gICAgfVxuXG4gICAgQ29tbWFuZC5zYXZlQ21kKHRoaXMuY21kTmFtZSwgZGF0YSk7XG5cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBwcm9wc0Rpc3BsYXkoKSB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSB0aGlzLmNtZDtcbiAgICByZXR1cm4gRWRpdENtZC5wcm9wcy5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBwLmRpc3BsYXkoY21kKTtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBwICE9IG51bGw7XG4gICAgfSkuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHJlc3VsdFdpdGhvdXRDb250ZW50KCkge1xuICAgIHZhciBuYW1lLCBwYXJzZXI7XG5cbiAgICBpZiAoIXRoaXMuY21kIHx8IHRoaXMuZWRpdGFibGUpIHtcbiAgICAgIG5hbWUgPSB0aGlzLmNtZCA/IHRoaXMuY21kLmZ1bGxOYW1lIDogdGhpcy5jbWROYW1lO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KGB+fmJveCBjbWQ6XCIke3RoaXMuaW5zdGFuY2UuY21kLmZ1bGxOYW1lfSAke25hbWV9XCJ+flxcbiR7dGhpcy5wcm9wc0Rpc3BsYXkoKX1cXG5+fiFzYXZlfn4gfn4hY2xvc2V+flxcbn5+L2JveH5+YCk7XG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMudmVyYmFsaXplKSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIuZ2V0VGV4dCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kLnNldENtZHMgPSBmdW5jdGlvbiAoYmFzZSkge1xuICB2YXIgaSwgaW5JbnN0YW5jZSwgbGVuLCBwLCByZWY7XG4gIGluSW5zdGFuY2UgPSBiYXNlLmluX2luc3RhbmNlID0ge1xuICAgIGNtZHM6IHt9XG4gIH07XG4gIHJlZiA9IEVkaXRDbWQucHJvcHM7XG5cbiAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcCA9IHJlZltpXTtcbiAgICBwLnNldENtZChpbkluc3RhbmNlLmNtZHMpO1xuICB9IC8vIHAuc2V0Q21kKGJhc2UpXG5cblxuICByZXR1cm4gYmFzZTtcbn07XG5cbkVkaXRDbWQucHJvcHMgPSBbbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX2NhcnJldCcsIHtcbiAgb3B0OiAnY2hlY2tDYXJyZXQnXG59KSwgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJywge1xuICBvcHQ6ICdwYXJzZSdcbn0pLCBuZXcgRWRpdENtZFByb3AuYm9vbCgncHJldmVudF9wYXJzZV9hbGwnLCB7XG4gIG9wdDogJ3ByZXZlbnRQYXJzZUFsbCdcbn0pLCBuZXcgRWRpdENtZFByb3AuYm9vbCgncmVwbGFjZV9ib3gnLCB7XG4gIG9wdDogJ3JlcGxhY2VCb3gnXG59KSwgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnbmFtZV90b19wYXJhbScsIHtcbiAgb3B0OiAnbmFtZVRvUGFyYW0nXG59KSwgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnYWxpYXNfb2YnLCB7XG4gIHZhcjogJ2FsaWFzT2YnLFxuICBjYXJyZXQ6IHRydWVcbn0pLCBuZXcgRWRpdENtZFByb3Auc291cmNlKCdoZWxwJywge1xuICBmdW5jdDogJ2hlbHAnLFxuICBzaG93RW1wdHk6IHRydWVcbn0pLCBuZXcgRWRpdENtZFByb3Auc291cmNlKCdzb3VyY2UnLCB7XG4gIHZhcjogJ3Jlc3VsdFN0cicsXG4gIGRhdGFOYW1lOiAncmVzdWx0JyxcbiAgc2hvd0VtcHR5OiB0cnVlLFxuICBjYXJyZXQ6IHRydWVcbn0pXTtcbk5hbWVTcGFjZUNtZCA9IGNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMF0pO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBpLCBsZW4sIG5hbWVzcGFjZXMsIG5zcGMsIHBhcnNlciwgdHh0O1xuXG4gICAgaWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0LmFkZE5hbWVTcGFjZSh0aGlzLm5hbWUpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VzID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKTtcbiAgICAgIHR4dCA9ICd+fmJveH5+XFxuJztcblxuICAgICAgZm9yIChpID0gMCwgbGVuID0gbmFtZXNwYWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBuc3BjID0gbmFtZXNwYWNlc1tpXTtcblxuICAgICAgICBpZiAobnNwYyAhPT0gdGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWUpIHtcbiAgICAgICAgICB0eHQgKz0gbnNwYyArICdcXG4nO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHR4dCArPSAnfn4hY2xvc2V8fn5cXG5+fi9ib3h+fic7XG4gICAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodHh0KTtcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICB9XG4gIH1cblxufTtcblRlbXBsYXRlQ21kID0gY2xhc3MgVGVtcGxhdGVDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gICAgcmV0dXJuIHRoaXMuc2VwID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3NlcCddLCBcIlxcblwiKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0gdGhpcy5uYW1lID8gUGF0aEhlbHBlci5nZXRQYXRoKHRoaXMuaW5zdGFuY2UuY29kZXdhdmUudmFycywgdGhpcy5uYW1lKSA6IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUudmFycztcblxuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQgJiYgZGF0YSAhPSBudWxsICYmIGRhdGEgIT09IGZhbHNlKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICByZXR1cm4gZGF0YS5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVGVtcGxhdGUoaXRlbSk7XG4gICAgICAgIH0pLmpvaW4odGhpcy5zZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVGVtcGxhdGUoZGF0YSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cblxuICByZW5kZXJUZW1wbGF0ZShkYXRhKSB7XG4gICAgdmFyIHBhcnNlcjtcbiAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgICBwYXJzZXIudmFycyA9IHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiID8gZGF0YSA6IHtcbiAgICAgIHZhbHVlOiBkYXRhXG4gICAgfTtcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gIH1cblxufTtcbkVtbWV0Q21kID0gY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5hYmJyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2FiYnInLCAnYWJicmV2aWF0aW9uJ10pO1xuICAgIHJldHVybiB0aGlzLmxhbmcgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxLCAnbGFuZycsICdsYW5ndWFnZSddKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgZW1tZXQsIGV4LCByZXM7XG5cbiAgICBlbW1ldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG5cbiAgICAgIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyB3aW5kb3cuZW1tZXQgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5lbW1ldDtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsID8gKHJlZiA9IHdpbmRvdy5zZWxmKSAhPSBudWxsID8gcmVmLmVtbWV0IDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuc2VsZi5lbW1ldDtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsID8gKHJlZjEgPSB3aW5kb3cuZ2xvYmFsKSAhPSBudWxsID8gcmVmMS5lbW1ldCA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93Lmdsb2JhbC5lbW1ldDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlcXVpcmUgIT09IFwidW5kZWZpbmVkXCIgJiYgcmVxdWlyZSAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiByZXF1aXJlKCdlbW1ldCcpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGV4ID0gZXJyb3I7XG4gICAgICAgICAgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5sb2dnZXIubG9nKCdFbW1ldCBpcyBub3QgYXZhaWxhYmxlLCBpdCBtYXkgbmVlZCB0byBiZSBpbnN0YWxsZWQgbWFudWFsbHknKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0uY2FsbCh0aGlzKTtcblxuICAgIGlmIChlbW1ldCAhPSBudWxsKSB7XG4gICAgICAvLyBlbW1ldC5yZXF1aXJlKCcuL3BhcnNlci9hYmJyZXZpYXRpb24nKS5leHBhbmQoJ3VsPmxpJywge3Bhc3RlZENvbnRlbnQ6J2xvcmVtJ30pXG4gICAgICByZXMgPSBlbW1ldC5leHBhbmRBYmJyZXZpYXRpb24odGhpcy5hYmJyLCB0aGlzLmxhbmcpO1xuICAgICAgcmV0dXJuIHJlcy5yZXBsYWNlKC9cXCRcXHswXFx9L2csICd8Jyk7XG4gICAgfVxuICB9XG5cbn07XG5cbiIsIlxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZShcIi4uL0NvbW1hbmRcIikuQ29tbWFuZDtcblxuY29uc3QgQm94SGVscGVyID0gcmVxdWlyZShcIi4uL0JveEhlbHBlclwiKS5Cb3hIZWxwZXI7XG5cbmNvbnN0IEVkaXRDbWRQcm9wID0gcmVxdWlyZShcIi4uL0VkaXRDbWRQcm9wXCIpLkVkaXRDbWRQcm9wO1xuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKFwiLi4vaGVscGVycy9TdHJpbmdIZWxwZXJcIikuU3RyaW5nSGVscGVyO1xuXG5jb25zdCBQYXRoSGVscGVyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvUGF0aEhlbHBlclwiKS5QYXRoSGVscGVyO1xuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoXCIuLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudFwiKS5SZXBsYWNlbWVudDtcblxudmFyIGRlbGV0ZUNvbW1hbmQsIHJlYWRDb21tYW5kLCB3cml0ZUNvbW1hbmQ7XG52YXIgRmlsZUNvbW1hbmRQcm92aWRlciA9IGNsYXNzIEZpbGVDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNvcmU7XG4gICAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdmaWxlJykpO1xuICAgIHJldHVybiBjb3JlLmFkZENtZHMoe1xuICAgICAgXCJyZWFkXCI6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHJlYWRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydmaWxlJ10sXG4gICAgICAgICdoZWxwJzogXCJyZWFkIHRoZSBjb250ZW50IG9mIGEgZmlsZVwiXG4gICAgICB9LFxuICAgICAgXCJ3cml0ZVwiOiB7XG4gICAgICAgICdyZXN1bHQnOiB3cml0ZUNvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2ZpbGUnLCAnY29udGVudCddLFxuICAgICAgICAnaGVscCc6IFwic2F2ZSBpbnRvIGEgZmlsZVwiXG4gICAgICB9LFxuICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAncmVzdWx0JzogZGVsZXRlQ29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnZmlsZSddLFxuICAgICAgICAnaGVscCc6IFwiZGVsZXRlIGEgZmlsZVwiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcbmV4cG9ydHMuRmlsZUNvbW1hbmRQcm92aWRlciA9IEZpbGVDb21tYW5kUHJvdmlkZXI7XG5cbnJlYWRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtO1xuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpO1xuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pO1xuXG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0ucmVhZEZpbGUoZmlsZSk7XG4gIH1cbn07XG5cbndyaXRlQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgY29udGVudCwgZmlsZSwgZmlsZVN5c3RlbTtcbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKTtcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKTtcbiAgY29udGVudCA9IGluc3RhbmNlLmNvbnRlbnQgfHwgaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdjb250ZW50J10pO1xuXG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0ud3JpdGVGaWxlKGZpbGUsIGNvbnRlbnQpO1xuICB9XG59O1xuXG5kZWxldGVDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtO1xuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpO1xuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pO1xuXG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0uZGVsZXRlRmlsZShmaWxlKTtcbiAgfVxufTtcblxuIiwiXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi4vQ29tbWFuZFwiKS5Db21tYW5kO1xuXG52YXIgSHRtbENvbW1hbmRQcm92aWRlciA9IGNsYXNzIEh0bWxDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNzcywgaHRtbDtcbiAgICBodG1sID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2h0bWwnKSk7XG4gICAgaHRtbC5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplbW1ldCcsXG4gICAgICAgICdkZWZhdWx0cyc6IHtcbiAgICAgICAgICAnbGFuZyc6ICdodG1sJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjc3MgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY3NzJykpO1xuICAgIHJldHVybiBjc3MuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICAnZGVmYXVsdHMnOiB7XG4gICAgICAgICAgJ2xhbmcnOiAnY3NzJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuZXhwb3J0cy5IdG1sQ29tbWFuZFByb3ZpZGVyID0gSHRtbENvbW1hbmRQcm92aWRlcjtcblxuIiwiXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi4vQ29tbWFuZFwiKS5Db21tYW5kO1xuXG52YXIgSnNDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBKc0NvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIganM7XG4gICAganMgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnanMnKSk7XG4gICAgY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2phdmFzY3JpcHQnLCB7XG4gICAgICBhbGlhc09mOiAnanMnXG4gICAgfSkpO1xuICAgIHJldHVybiBqcy5hZGRDbWRzKHtcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgICdpZic6ICdpZih8KXtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2xvZyc6ICdpZih3aW5kb3cuY29uc29sZSl7XFxuXFx0Y29uc29sZS5sb2cofn5jb250ZW50fn58KVxcbn0nLFxuICAgICAgJ2Z1bmN0aW9uJzogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdmdW5jdCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2Zvcic6ICdmb3IgKHZhciBpID0gMDsgaSA8IHw7IGkrKykge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZm9yaW4nOiAnZm9yICh2YXIgdmFsIGluIHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2VhY2gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmb3JpbidcbiAgICAgIH0sXG4gICAgICAnZm9yZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgICd3aGlsZSc6ICd3aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICd3aGlsZWknOiAndmFyIGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcblxcdGkrKztcXG59JyxcbiAgICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgJ2lmZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmlmZWxzZSdcbiAgICAgIH0sXG4gICAgICAnc3dpdGNoJzogXCJzd2l0Y2goIHwgKSB7IFxcblxcdGNhc2UgOlxcblxcdFxcdH5+Y29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufVwiXG4gICAgfSk7XG4gIH1cblxufTtcbmV4cG9ydHMuSnNDb21tYW5kUHJvdmlkZXIgPSBKc0NvbW1hbmRQcm92aWRlcjtcblxuIiwiXG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL1N0cmluZ0hlbHBlclwiKS5TdHJpbmdIZWxwZXI7XG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi4vQ29tbWFuZFwiKS5Db21tYW5kO1xuXG5jb25zdCBQYWlyRGV0ZWN0b3IgPSByZXF1aXJlKFwiLi4vZGV0ZWN0b3JzL1BhaXJEZXRlY3RvclwiKS5QYWlyRGV0ZWN0b3I7XG5cbnZhciB3cmFwV2l0aFBocDtcbnZhciBQaHBDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBQaHBDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIHBocCwgcGhwSW5uZXIsIHBocE91dGVyO1xuICAgIHBocCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdwaHAnKSk7XG4gICAgcGhwLmFkZERldGVjdG9yKG5ldyBQYWlyRGV0ZWN0b3Ioe1xuICAgICAgcmVzdWx0OiAncGhwOmlubmVyJyxcbiAgICAgIG9wZW5lcjogJzw/cGhwJyxcbiAgICAgIGNsb3NlcjogJz8+JyxcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IHRydWUsXG4gICAgICAnZWxzZSc6ICdwaHA6b3V0ZXInXG4gICAgfSkpO1xuICAgIHBocE91dGVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnb3V0ZXInKSk7XG4gICAgcGhwT3V0ZXIuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdhbnlfY29udGVudCc6IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnLFxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgcHJlZml4OiAnID8+XFxuJyxcbiAgICAgICAgICAgICAgc3VmZml4OiAnXFxuPD9waHAgJyxcbiAgICAgICAgICAgICAgYWZmaXhlc19lbXB0eTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjolbmFtZSUnLFxuICAgICAgICBhbHRlclJlc3VsdDogd3JhcFdpdGhQaHBcbiAgICAgIH0sXG4gICAgICAnYm94Jzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpib3gnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgIHBocDogJzw/cGhwXFxuXFx0fn5jb250ZW50fn58XFxuPz4nXG4gICAgfSk7XG4gICAgcGhwSW5uZXIgPSBwaHAuYWRkQ21kKG5ldyBDb21tYW5kKCdpbm5lcicpKTtcbiAgICByZXR1cm4gcGhwSW5uZXIuYWRkQ21kcyh7XG4gICAgICAnYW55X2NvbnRlbnQnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnXG4gICAgICB9LFxuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgJ2lmJzogJ2lmKHwpe1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2luZm8nOiAncGhwaW5mbygpOycsXG4gICAgICAnZWNobyc6ICdlY2hvIHwnLFxuICAgICAgJ2UnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZWNobydcbiAgICAgIH0sXG4gICAgICAnY2xhc3MnOiB7XG4gICAgICAgIHJlc3VsdDogXCJjbGFzcyB+fnBhcmFtIDAgY2xhc3MgZGVmOnx+fiB7XFxuXFx0ZnVuY3Rpb24gX19jb25zdHJ1Y3QoKSB7XFxuXFx0XFx0fn5jb250ZW50fn58XFxuXFx0fVxcbn1cIixcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnYyc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpjbGFzcydcbiAgICAgIH0sXG4gICAgICAnZnVuY3Rpb24nOiB7XG4gICAgICAgIHJlc3VsdDogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnZnVuY3QnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2YnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2FycmF5JzogJyR8ID0gYXJyYXkoKTsnLFxuICAgICAgJ2EnOiAnYXJyYXkoKScsXG4gICAgICAnZm9yJzogJ2ZvciAoJGkgPSAwOyAkaSA8ICR8OyAkaSsrKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnZm9yZWFjaCc6ICdmb3JlYWNoICgkfCBhcyAka2V5ID0+ICR2YWwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZvcmVhY2gnXG4gICAgICB9LFxuICAgICAgJ3doaWxlJzogJ3doaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICd3aGlsZWknOiB7XG4gICAgICAgIHJlc3VsdDogJyRpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxuXFx0JGkrKztcXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgICAnaWZlJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmlmZWxzZSdcbiAgICAgIH0sXG4gICAgICAnc3dpdGNoJzoge1xuICAgICAgICByZXN1bHQ6IFwic3dpdGNoKCB8ICkgeyBcXG5cXHRjYXNlIDpcXG5cXHRcXHR+fmFueV9jb250ZW50fn5cXG5cXHRcXHRicmVhaztcXG5cXHRkZWZhdWx0IDpcXG5cXHRcXHRcXG5cXHRcXHRicmVhaztcXG59XCIsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Nsb3NlJzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjbG9zZScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nLFxuICAgICAgICAgIHN1ZmZpeDogJ1xcbj8+JyxcbiAgICAgICAgICByZXF1aXJlZF9hZmZpeGVzOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcbmV4cG9ydHMuUGhwQ29tbWFuZFByb3ZpZGVyID0gUGhwQ29tbWFuZFByb3ZpZGVyO1xuXG53cmFwV2l0aFBocCA9IGZ1bmN0aW9uIChyZXN1bHQsIGluc3RhbmNlKSB7XG4gIHZhciBpbmxpbmUsIHJlZ0Nsb3NlLCByZWdPcGVuO1xuICBpbmxpbmUgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3BocF9pbmxpbmUnLCAnaW5saW5lJ10sIHRydWUpO1xuXG4gIGlmIChpbmxpbmUpIHtcbiAgICByZWdPcGVuID0gLzxcXD9waHBcXHMoW1xcXFxuXFxcXHJcXHNdKykvZztcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZztcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnPD9waHBcXG4nICsgU3RyaW5nSGVscGVyLmluZGVudChyZXN1bHQpICsgJ1xcbj8+JztcbiAgfVxufTsgLy8gY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuLy8gICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnXG5cbiIsIlxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZShcIi4uL0NvbW1hbmRcIikuQ29tbWFuZDtcblxuY29uc3QgQWx3YXlzRW5hYmxlZCA9IHJlcXVpcmUoXCIuLi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZFwiKS5BbHdheXNFbmFibGVkO1xuXG52YXIgaW5mbGVjdGlvbiA9IGludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcImluZmxlY3Rpb25cIikpO1xuXG5mdW5jdGlvbiBpbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxudmFyIFN0cmluZ0NvbW1hbmRQcm92aWRlciA9IGNsYXNzIFN0cmluZ0NvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKHJvb3QpIHtcbiAgICB2YXIgY21kcztcbiAgICBjbWRzID0gcm9vdC5hZGRDbWQobmV3IENvbW1hbmQoJ3N0cmluZycpKTtcbiAgICByb290LmFkZENtZChuZXcgQ29tbWFuZCgnc3RyJywge1xuICAgICAgYWxpYXNPZjogJ3N0cmluZydcbiAgICB9KSk7XG4gICAgcm9vdC5hZGREZXRlY3RvcihuZXcgQWx3YXlzRW5hYmxlZCgnc3RyaW5nJykpO1xuICAgIHJldHVybiBjbWRzLmFkZENtZHMoe1xuICAgICAgJ3BsdXJhbGl6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnBsdXJhbGl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0ciddLFxuICAgICAgICAnaGVscCc6IFwiUGx1cmFsaXplIGEgc3RyaW5nXCJcbiAgICAgIH0sXG4gICAgICAnc2luZ3VsYXJpemUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5zaW5ndWxhcml6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0ciddLFxuICAgICAgICAnaGVscCc6IFwiU2luZ3VsYXJpemUgYSBzdHJpbmdcIlxuICAgICAgfSxcbiAgICAgICdjYW1lbGl6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmNhbWVsaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pLCAhaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsxLCAnZmlyc3QnXSwgdHJ1ZSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInLCAnZmlyc3QnXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRyYW5zZm9ybXMgYSBTdHJpbmcgZnJvbSB1bmRlcnNjb3JlIHRvIGNhbWVsY2FzZVwiXG4gICAgICB9LFxuICAgICAgJ3VuZGVyc2NvcmUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi51bmRlcnNjb3JlKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pLCBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsICd1cHBlciddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0cicsICd1cHBlciddLFxuICAgICAgICAnaGVscCc6IFwiVHJhbnNmb3JtcyBhIFN0cmluZyBmcm9tIGNhbWVsY2FzZSB0byB1bmRlcnNjb3JlLlwiXG4gICAgICB9LFxuICAgICAgJ2h1bWFuaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uaHVtYW5pemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSksIGluc3RhbmNlLmdldEJvb2xQYXJhbShbMSwgJ2ZpcnN0J10pKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnc3RyJywgJ2ZpcnN0J10sXG4gICAgICAgICdoZWxwJzogXCJUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgaHVtYW4gcmVhZGFibGUgZm9ybWF0XCJcbiAgICAgIH0sXG4gICAgICAnY2FwaXRhbGl6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmNhcGl0YWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInXSxcbiAgICAgICAgJ2hlbHAnOiBcIk1ha2UgdGhlIGZpcnN0IGxldHRlciBvZiBhIHN0cmluZyB1cHBlclwiXG4gICAgICB9LFxuICAgICAgJ2Rhc2hlcml6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmRhc2hlcml6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0ciddLFxuICAgICAgICAnaGVscCc6IFwiUmVwbGFjZXMgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMgaW4gYSBzdHJpbmcuXCJcbiAgICAgIH0sXG4gICAgICAndGl0bGVpemUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi50aXRsZWl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0ciddLFxuICAgICAgICAnaGVscCc6IFwiVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIGh1bWFuIHJlYWRhYmxlIGZvcm1hdCB3aXRoIG1vc3Qgd29yZHMgY2FwaXRhbGl6ZWRcIlxuICAgICAgfSxcbiAgICAgICd0YWJsZWl6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnRhYmxlaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnc3RyJ10sXG4gICAgICAgICdoZWxwJzogXCJUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgdGFibGUgZm9ybWF0XCJcbiAgICAgIH0sXG4gICAgICAnY2xhc3NpZnknOiB7XG4gICAgICAgICdyZXN1bHQnOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5jbGFzc2lmeShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0ciddLFxuICAgICAgICAnaGVscCc6IFwiVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIGNsYXNzIGZvcm1hdFwiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcbmV4cG9ydHMuU3RyaW5nQ29tbWFuZFByb3ZpZGVyID0gU3RyaW5nQ29tbWFuZFByb3ZpZGVyO1xuXG4iLCJcblxuY29uc3QgRGV0ZWN0b3IgPSByZXF1aXJlKFwiLi9EZXRlY3RvclwiKS5EZXRlY3RvcjtcblxudmFyIEFsd2F5c0VuYWJsZWQgPSBjbGFzcyBBbHdheXNFbmFibGVkIGV4dGVuZHMgRGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvcihuYW1lc3BhY2UpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICB9XG5cbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZTtcbiAgfVxuXG59O1xuZXhwb3J0cy5BbHdheXNFbmFibGVkID0gQWx3YXlzRW5hYmxlZDtcblxuIiwiXG52YXIgRGV0ZWN0b3IgPSBjbGFzcyBEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEgPSB7fSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cblxuICBkZXRlY3QoZmluZGVyKSB7XG4gICAgaWYgKHRoaXMuZGV0ZWN0ZWQoZmluZGVyKSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5yZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnJlc3VsdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZGF0YS5lbHNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5lbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRldGVjdGVkKGZpbmRlcikge31cblxufTtcbmV4cG9ydHMuRGV0ZWN0b3IgPSBEZXRlY3RvcjtcblxuIiwiXG5cbmNvbnN0IERldGVjdG9yID0gcmVxdWlyZShcIi4vRGV0ZWN0b3JcIikuRGV0ZWN0b3I7XG5cbnZhciBMYW5nRGV0ZWN0b3IgPSBjbGFzcyBMYW5nRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdChmaW5kZXIpIHtcbiAgICB2YXIgbGFuZztcblxuICAgIGlmIChmaW5kZXIuY29kZXdhdmUgIT0gbnVsbCkge1xuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpO1xuXG4gICAgICBpZiAobGFuZyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBsYW5nLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn07XG5leHBvcnRzLkxhbmdEZXRlY3RvciA9IExhbmdEZXRlY3RvcjtcblxuIiwiXG5cbmNvbnN0IFBhaXIgPSByZXF1aXJlKFwiLi4vcG9zaXRpb25pbmcvUGFpclwiKS5QYWlyO1xuXG5jb25zdCBEZXRlY3RvciA9IHJlcXVpcmUoXCIuL0RldGVjdG9yXCIpLkRldGVjdG9yO1xuXG52YXIgUGFpckRldGVjdG9yID0gY2xhc3MgUGFpckRldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3Ige1xuICBkZXRlY3RlZChmaW5kZXIpIHtcbiAgICB2YXIgcGFpcjtcblxuICAgIGlmICh0aGlzLmRhdGEub3BlbmVyICE9IG51bGwgJiYgdGhpcy5kYXRhLmNsb3NlciAhPSBudWxsICYmIGZpbmRlci5pbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICBwYWlyID0gbmV3IFBhaXIodGhpcy5kYXRhLm9wZW5lciwgdGhpcy5kYXRhLmNsb3NlciwgdGhpcy5kYXRhKTtcblxuICAgICAgaWYgKHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxufTtcbmV4cG9ydHMuUGFpckRldGVjdG9yID0gUGFpckRldGVjdG9yO1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgYm9vdHN0cmFwID0gcmVxdWlyZShcIi4vYm9vdHN0cmFwXCIpO1xuXG5jb25zdCBUZXh0QXJlYUVkaXRvciA9IHJlcXVpcmUoXCIuL1RleHRBcmVhRWRpdG9yXCIpO1xuXG5ib290c3RyYXAuQ29kZXdhdmUuZGV0ZWN0ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICB2YXIgY3c7XG4gIGN3ID0gbmV3IGJvb3RzdHJhcC5Db2Rld2F2ZShuZXcgVGV4dEFyZWFFZGl0b3IuVGV4dEFyZWFFZGl0b3IodGFyZ2V0KSk7XG5cbiAgYm9vdHN0cmFwLkNvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KTtcblxuICByZXR1cm4gY3c7XG59O1xuXG5ib290c3RyYXAuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmU7XG53aW5kb3cuQ29kZXdhdmUgPSBib290c3RyYXAuQ29kZXdhdmU7XG5cbiIsIlxudmFyIEFycmF5SGVscGVyID0gY2xhc3MgQXJyYXlIZWxwZXIge1xuICBzdGF0aWMgaXNBcnJheShhcnIpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH1cblxuICBzdGF0aWMgdW5pb24oYTEsIGEyKSB7XG4gICAgcmV0dXJuIHRoaXMudW5pcXVlKGExLmNvbmNhdChhMikpO1xuICB9XG5cbiAgc3RhdGljIHVuaXF1ZShhcnJheSkge1xuICAgIHZhciBhLCBpLCBqO1xuICAgIGEgPSBhcnJheS5jb25jYXQoKTtcbiAgICBpID0gMDtcblxuICAgIHdoaWxlIChpIDwgYS5sZW5ndGgpIHtcbiAgICAgIGogPSBpICsgMTtcblxuICAgICAgd2hpbGUgKGogPCBhLmxlbmd0aCkge1xuICAgICAgICBpZiAoYVtpXSA9PT0gYVtqXSkge1xuICAgICAgICAgIGEuc3BsaWNlKGotLSwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICArK2o7XG4gICAgICB9XG5cbiAgICAgICsraTtcbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbiAgfVxuXG59O1xuZXhwb3J0cy5BcnJheUhlbHBlciA9IEFycmF5SGVscGVyO1xuXG4iLCJcbnZhciBDb21tb25IZWxwZXIgPSBjbGFzcyBDb21tb25IZWxwZXIge1xuICBzdGF0aWMgbWVyZ2UoLi4ueHMpIHtcbiAgICBpZiAoKHhzICE9IG51bGwgPyB4cy5sZW5ndGggOiB2b2lkIDApID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFwKHt9LCBmdW5jdGlvbiAobSkge1xuICAgICAgICB2YXIgaSwgaywgbGVuLCByZXN1bHRzLCB2LCB4O1xuICAgICAgICByZXN1bHRzID0gW107XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0geHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB4ID0geHNbaV07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzMTtcbiAgICAgICAgICAgIHJlc3VsdHMxID0gW107XG5cbiAgICAgICAgICAgIGZvciAoayBpbiB4KSB7XG4gICAgICAgICAgICAgIHYgPSB4W2tdO1xuICAgICAgICAgICAgICByZXN1bHRzMS5wdXNoKG1ba10gPSB2KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMxO1xuICAgICAgICAgIH0oKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB0YXAobywgZm4pIHtcbiAgICBmbihvKTtcbiAgICByZXR1cm4gbztcbiAgfVxuXG4gIHN0YXRpYyBhcHBseU1peGlucyhkZXJpdmVkQ3RvciwgYmFzZUN0b3JzKSB7XG4gICAgcmV0dXJuIGJhc2VDdG9ycy5mb3JFYWNoKGJhc2VDdG9yID0+IHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVyaXZlZEN0b3IsIG5hbWUsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZUN0b3IucHJvdG90eXBlLCBuYW1lKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59O1xuZXhwb3J0cy5Db21tb25IZWxwZXIgPSBDb21tb25IZWxwZXI7XG5cbiIsIlxudmFyIE5hbWVzcGFjZUhlbHBlciA9IGNsYXNzIE5hbWVzcGFjZUhlbHBlciB7XG4gIHN0YXRpYyBzcGxpdEZpcnN0KGZ1bGxuYW1lLCBpc1NwYWNlID0gZmFsc2UpIHtcbiAgICB2YXIgcGFydHM7XG5cbiAgICBpZiAoZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT09IC0xICYmICFpc1NwYWNlKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXTtcbiAgICB9XG5cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6Jyk7XG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLCBwYXJ0cy5qb2luKCc6JykgfHwgbnVsbF07XG4gIH1cblxuICBzdGF0aWMgc3BsaXQoZnVsbG5hbWUpIHtcbiAgICB2YXIgbmFtZSwgcGFydHM7XG5cbiAgICBpZiAoZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT09IC0xKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXTtcbiAgICB9XG5cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6Jyk7XG4gICAgbmFtZSA9IHBhcnRzLnBvcCgpO1xuICAgIHJldHVybiBbcGFydHMuam9pbignOicpLCBuYW1lXTtcbiAgfVxuXG59O1xuZXhwb3J0cy5OYW1lc3BhY2VIZWxwZXIgPSBOYW1lc3BhY2VIZWxwZXI7XG5cbiIsIlxudmFyIE9wdGlvbmFsUHJvbWlzZSA9IGNsYXNzIE9wdGlvbmFsUHJvbWlzZSB7XG4gIGNvbnN0cnVjdG9yKHZhbDEpIHtcbiAgICB0aGlzLnZhbCA9IHZhbDE7XG5cbiAgICBpZiAodGhpcy52YWwgIT0gbnVsbCAmJiB0aGlzLnZhbC50aGVuICE9IG51bGwgJiYgdGhpcy52YWwucmVzdWx0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMudmFsID0gdGhpcy52YWwucmVzdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgdGhlbihjYikge1xuICAgIGlmICh0aGlzLnZhbCAhPSBudWxsICYmIHRoaXMudmFsLnRoZW4gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodGhpcy52YWwudGhlbihjYikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZShjYih0aGlzLnZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICByZXR1cm4gdGhpcy52YWw7XG4gIH1cblxufTtcbmV4cG9ydHMuT3B0aW9uYWxQcm9taXNlID0gT3B0aW9uYWxQcm9taXNlO1xuXG52YXIgb3B0aW9uYWxQcm9taXNlID0gZnVuY3Rpb24gKHZhbCkge1xuICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh2YWwpO1xufTtcblxuZXhwb3J0cy5vcHRpb25hbFByb21pc2UgPSBvcHRpb25hbFByb21pc2U7XG5cbiIsIlxudmFyIFBhdGhIZWxwZXIgPSBjbGFzcyBQYXRoSGVscGVyIHtcbiAgc3RhdGljIGdldFBhdGgob2JqLCBwYXRoLCBzZXAgPSAnLicpIHtcbiAgICB2YXIgY3VyLCBwYXJ0cztcbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKTtcbiAgICBjdXIgPSBvYmo7XG4gICAgcGFydHMuZmluZChwYXJ0ID0+IHtcbiAgICAgIGN1ciA9IGN1cltwYXJ0XTtcbiAgICAgIHJldHVybiB0eXBlb2YgY3VyID09PSBcInVuZGVmaW5lZFwiO1xuICAgIH0pO1xuICAgIHJldHVybiBjdXI7XG4gIH1cblxuICBzdGF0aWMgc2V0UGF0aChvYmosIHBhdGgsIHZhbCwgc2VwID0gJy4nKSB7XG4gICAgdmFyIGxhc3QsIHBhcnRzO1xuICAgIHBhcnRzID0gcGF0aC5zcGxpdChzZXApO1xuICAgIGxhc3QgPSBwYXJ0cy5wb3AoKTtcbiAgICByZXR1cm4gcGFydHMucmVkdWNlKChjdXIsIHBhcnQpID0+IHtcbiAgICAgIGlmIChjdXJbcGFydF0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY3VyW3BhcnRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGN1cltwYXJ0XSA9IHt9O1xuICAgICAgfVxuICAgIH0sIG9iailbbGFzdF0gPSB2YWw7XG4gIH1cblxufTtcbmV4cG9ydHMuUGF0aEhlbHBlciA9IFBhdGhIZWxwZXI7XG5cbiIsIlxuXG5jb25zdCBTaXplID0gcmVxdWlyZShcIi4uL3Bvc2l0aW9uaW5nL1NpemVcIikuU2l6ZTtcblxudmFyIFN0cmluZ0hlbHBlciA9IGNsYXNzIFN0cmluZ0hlbHBlciB7XG4gIHN0YXRpYyB0cmltRW1wdHlMaW5lKHR4dCkge1xuICAgIHJldHVybiB0eHQucmVwbGFjZSgvXlxccypcXHI/XFxuLywgJycpLnJlcGxhY2UoL1xccj9cXG5cXHMqJC8sICcnKTtcbiAgfVxuXG4gIHN0YXRpYyBlc2NhcGVSZWdFeHAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gIH1cblxuICBzdGF0aWMgcmVwZWF0VG9MZW5ndGgodHh0LCBsZW5ndGgpIHtcbiAgICBpZiAobGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gQXJyYXkoTWF0aC5jZWlsKGxlbmd0aCAvIHR4dC5sZW5ndGgpICsgMSkuam9pbih0eHQpLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuICB9XG5cbiAgc3RhdGljIHJlcGVhdCh0eHQsIG5iKSB7XG4gICAgcmV0dXJuIEFycmF5KG5iICsgMSkuam9pbih0eHQpO1xuICB9XG5cbiAgc3RhdGljIGdldFR4dFNpemUodHh0KSB7XG4gICAgdmFyIGosIGwsIGxlbiwgbGluZXMsIHc7XG4gICAgbGluZXMgPSB0eHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKTtcbiAgICB3ID0gMDtcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBsID0gbGluZXNbal07XG4gICAgICB3ID0gTWF0aC5tYXgodywgbC5sZW5ndGgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU2l6ZSh3LCBsaW5lcy5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnROb3RGaXJzdCh0ZXh0LCBuYiA9IDEsIHNwYWNlcyA9ICcgICcpIHtcbiAgICB2YXIgcmVnO1xuXG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gL1xcbi9nO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXFxuXCIgKyB0aGlzLnJlcGVhdChzcGFjZXMsIG5iKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnQodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNwYWNlcyArIHRoaXMuaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIsIHNwYWNlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZXZlcnNlU3RyKHR4dCkge1xuICAgIHJldHVybiB0eHQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIik7XG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlQ2FycmV0KHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciByZUNhcnJldCwgcmVRdW90ZWQsIHJlVG1wLCB0bXA7XG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSc7XG4gICAgcmVDYXJyZXQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHJlVG1wID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cCh0bXApLCBcImdcIik7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKHJlUXVvdGVkLCB0bXApLnJlcGxhY2UocmVDYXJyZXQsICcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcG9zO1xuICAgIHBvcyA9IHRoaXMuZ2V0Q2FycmV0UG9zKHR4dCwgY2FycmV0Q2hhcik7XG5cbiAgICBpZiAocG9zICE9IG51bGwpIHtcbiAgICAgIHR4dCA9IHR4dC5zdWJzdHIoMCwgcG9zKSArIHR4dC5zdWJzdHIocG9zICsgY2FycmV0Q2hhci5sZW5ndGgpO1xuICAgICAgcmV0dXJuIFtwb3MsIHR4dF07XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldENhcnJldFBvcyh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgaSwgcmVRdW90ZWQ7XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHR4dCA9IHR4dC5yZXBsYWNlKHJlUXVvdGVkLCAnICcpO1xuXG4gICAgaWYgKChpID0gdHh0LmluZGV4T2YoY2FycmV0Q2hhcikpID4gLTEpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5TdHJpbmdIZWxwZXIgPSBTdHJpbmdIZWxwZXI7XG5cbiIsIlxuXG5jb25zdCBQb3MgPSByZXF1aXJlKFwiLi9Qb3NcIikuUG9zO1xuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKFwiLi4vaGVscGVycy9TdHJpbmdIZWxwZXJcIikuU3RyaW5nSGVscGVyO1xuXG5jb25zdCBQYWlyTWF0Y2ggPSByZXF1aXJlKFwiLi9QYWlyTWF0Y2hcIikuUGFpck1hdGNoO1xuXG52YXIgUGFpciA9IGNsYXNzIFBhaXIge1xuICBjb25zdHJ1Y3RvcihvcGVuZXIsIGNsb3Nlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICB0aGlzLm9wZW5lciA9IG9wZW5lcjtcbiAgICB0aGlzLmNsb3NlciA9IGNsb3NlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2UsXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfTtcblxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuXG4gICAgICBpZiAoa2V5IGluIHRoaXMub3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSB0aGlzLm9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvcGVuZXJSZWcoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wZW5lciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5vcGVuZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMub3BlbmVyO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlclJlZygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuY2xvc2VyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNsb3NlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZXI7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BlbmVyOiB0aGlzLm9wZW5lclJlZygpLFxuICAgICAgY2xvc2VyOiB0aGlzLmNsb3NlclJlZygpXG4gICAgfTtcbiAgfVxuXG4gIG1hdGNoQW55UGFydEtleXMoKSB7XG4gICAgdmFyIGtleSwga2V5cywgcmVmLCByZWc7XG4gICAga2V5cyA9IFtdO1xuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpO1xuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XTtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBrZXlzO1xuICB9XG5cbiAgbWF0Y2hBbnlSZWcoKSB7XG4gICAgdmFyIGdyb3Vwcywga2V5LCByZWYsIHJlZztcbiAgICBncm91cHMgPSBbXTtcbiAgICByZWYgPSB0aGlzLm1hdGNoQW55UGFydHMoKTtcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV07XG4gICAgICBncm91cHMucHVzaCgnKCcgKyByZWcuc291cmNlICsgJyknKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChncm91cHMuam9pbignfCcpKTtcbiAgfVxuXG4gIG1hdGNoQW55KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2g7XG5cbiAgICB3aGlsZSAoKG1hdGNoID0gdGhpcy5fbWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkgIT0gbnVsbCAmJiAhbWF0Y2gudmFsaWQoKSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKCk7XG4gICAgfVxuXG4gICAgaWYgKG1hdGNoICE9IG51bGwgJiYgbWF0Y2gudmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgfVxuXG4gIF9tYXRjaEFueSh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoO1xuXG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKG9mZnNldCk7XG4gICAgfVxuXG4gICAgbWF0Y2ggPSB0aGlzLm1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KTtcblxuICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLCBtYXRjaCwgb2Zmc2V0KTtcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueU5hbWVkKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF0Y2hBbnlHZXROYW1lKHRoaXMubWF0Y2hBbnkodGV4dCkpO1xuICB9XG5cbiAgbWF0Y2hBbnlMYXN0KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2gsIHJlcztcblxuICAgIHdoaWxlIChtYXRjaCA9IHRoaXMubWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKCk7XG5cbiAgICAgIGlmICghcmVzIHx8IHJlcy5lbmQoKSAhPT0gbWF0Y2guZW5kKCkpIHtcbiAgICAgICAgcmVzID0gbWF0Y2g7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGlkZW50aWNhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZXIgPT09IHRoaXMuY2xvc2VyIHx8IHRoaXMub3BlbmVyLnNvdXJjZSAhPSBudWxsICYmIHRoaXMuY2xvc2VyLnNvdXJjZSAhPSBudWxsICYmIHRoaXMub3BlbmVyLnNvdXJjZSA9PT0gdGhpcy5jbG9zZXIuc291cmNlO1xuICB9XG5cbiAgd3JhcHBlclBvcyhwb3MsIHRleHQpIHtcbiAgICB2YXIgZW5kLCBzdGFydDtcbiAgICBzdGFydCA9IHRoaXMubWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAsIHBvcy5zdGFydCkpO1xuXG4gICAgaWYgKHN0YXJ0ICE9IG51bGwgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgc3RhcnQubmFtZSgpID09PSAnb3BlbmVyJykpIHtcbiAgICAgIGVuZCA9IHRoaXMubWF0Y2hBbnkodGV4dCwgcG9zLmVuZCk7XG5cbiAgICAgIGlmIChlbmQgIT0gbnVsbCAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBlbmQubmFtZSgpID09PSAnY2xvc2VyJykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgZW5kLmVuZCgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25uYWxfZW5kKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIHRleHQubGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc1dhcHBlck9mKHBvcywgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZXJQb3MocG9zLCB0ZXh0KSAhPSBudWxsO1xuICB9XG5cbn07XG5leHBvcnRzLlBhaXIgPSBQYWlyO1xuXG4iLCJcbnZhciBQYWlyTWF0Y2ggPSBjbGFzcyBQYWlyTWF0Y2gge1xuICBjb25zdHJ1Y3RvcihwYWlyLCBtYXRjaCwgb2Zmc2V0ID0gMCkge1xuICAgIHRoaXMucGFpciA9IHBhaXI7XG4gICAgdGhpcy5tYXRjaCA9IG1hdGNoO1xuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICB9XG5cbiAgbmFtZSgpIHtcbiAgICB2YXIgX25hbWUsIGdyb3VwLCBpLCBqLCBsZW4sIHJlZjtcblxuICAgIGlmICh0aGlzLm1hdGNoKSB7XG4gICAgICBpZiAodHlwZW9mIF9uYW1lID09PSBcInVuZGVmaW5lZFwiIHx8IF9uYW1lID09PSBudWxsKSB7XG4gICAgICAgIHJlZiA9IHRoaXMubWF0Y2g7XG5cbiAgICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgICBncm91cCA9IHJlZltpXTtcblxuICAgICAgICAgIGlmIChpID4gMCAmJiBncm91cCAhPSBudWxsKSB7XG4gICAgICAgICAgICBfbmFtZSA9IHRoaXMucGFpci5tYXRjaEFueVBhcnRLZXlzKClbaSAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuIF9uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9uYW1lID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfbmFtZSB8fCBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoLmluZGV4ICsgdGhpcy5vZmZzZXQ7XG4gIH1cblxuICBlbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm1hdGNoWzBdLmxlbmd0aCArIHRoaXMub2Zmc2V0O1xuICB9XG5cbiAgdmFsaWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLnBhaXIudmFsaWRNYXRjaCB8fCB0aGlzLnBhaXIudmFsaWRNYXRjaCh0aGlzKTtcbiAgfVxuXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaFswXS5sZW5ndGg7XG4gIH1cblxufTtcbmV4cG9ydHMuUGFpck1hdGNoID0gUGFpck1hdGNoO1xuXG4iLCJcbnZhciBQb3MgPSBjbGFzcyBQb3Mge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgZW5kKSB7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZW5kID0gZW5kO1xuXG4gICAgaWYgKHRoaXMuZW5kID09IG51bGwpIHtcbiAgICAgIHRoaXMuZW5kID0gdGhpcy5zdGFydDtcbiAgICB9XG4gIH1cblxuICBjb250YWluc1B0KHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5lbmQ7XG4gIH1cblxuICBjb250YWluc1Bvcyhwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmVuZDtcbiAgfVxuXG4gIHdyYXBwZWRCeShwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyh0aGlzLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCwgdGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZW5kICsgc3VmZml4Lmxlbmd0aCk7XG4gIH1cblxuICB3aXRoRWRpdG9yKHZhbCkge1xuICAgIHRoaXMuX2VkaXRvciA9IHZhbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGVkaXRvcigpIHtcbiAgICBpZiAodGhpcy5fZWRpdG9yID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZWRpdG9yIHNldCcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9lZGl0b3I7XG4gIH1cblxuICBoYXNFZGl0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvciAhPSBudWxsO1xuICB9XG5cbiAgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgfVxuXG4gIGFwcGx5T2Zmc2V0KG9mZnNldCkge1xuICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJldkVPTCgpIHtcbiAgICBpZiAodGhpcy5fcHJldkVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9wcmV2RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZVN0YXJ0KHRoaXMuc3RhcnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wcmV2RU9MO1xuICB9XG5cbiAgbmV4dEVPTCgpIHtcbiAgICBpZiAodGhpcy5fbmV4dEVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9uZXh0RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZUVuZCh0aGlzLmVuZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25leHRFT0w7XG4gIH1cblxuICB0ZXh0V2l0aEZ1bGxMaW5lcygpIHtcbiAgICBpZiAodGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGV4dFdpdGhGdWxsTGluZXM7XG4gIH1cblxuICBzYW1lTGluZXNQcmVmaXgoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNQcmVmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMuc3RhcnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNQcmVmaXg7XG4gIH1cblxuICBzYW1lTGluZXNTdWZmaXgoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNTdWZmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5lbmQsIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzU3VmZml4O1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBQb3ModGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuXG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICByYXcoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnN0YXJ0LCB0aGlzLmVuZF07XG4gIH1cblxufTtcbmV4cG9ydHMuUG9zID0gUG9zO1xuXG4iLCJcblxuY29uc3QgV3JhcHBpbmcgPSByZXF1aXJlKFwiLi9XcmFwcGluZ1wiKS5XcmFwcGluZztcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKFwiLi9SZXBsYWNlbWVudFwiKS5SZXBsYWNlbWVudDtcblxuY29uc3QgQ29tbW9uSGVscGVyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvQ29tbW9uSGVscGVyXCIpLkNvbW1vbkhlbHBlcjtcblxudmFyIFBvc0NvbGxlY3Rpb24gPSBjbGFzcyBQb3NDb2xsZWN0aW9uIHtcbiAgY29uc3RydWN0b3IoYXJyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIGFyciA9IFthcnJdO1xuICAgIH1cblxuICAgIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhhcnIsIFtQb3NDb2xsZWN0aW9uXSk7XG5cbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgd3JhcChwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIG5ldyBXcmFwcGluZyhwLnN0YXJ0LCBwLmVuZCwgcHJlZml4LCBzdWZmaXgpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVwbGFjZSh0eHQpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dCk7XG4gICAgfSk7XG4gIH1cblxufTtcbmV4cG9ydHMuUG9zQ29sbGVjdGlvbiA9IFBvc0NvbGxlY3Rpb247XG5cbiIsIlxuXG5jb25zdCBQb3MgPSByZXF1aXJlKFwiLi9Qb3NcIikuUG9zO1xuXG5jb25zdCBDb21tb25IZWxwZXIgPSByZXF1aXJlKFwiLi4vaGVscGVycy9Db21tb25IZWxwZXJcIikuQ29tbW9uSGVscGVyO1xuXG5jb25zdCBPcHRpb25PYmplY3QgPSByZXF1aXJlKFwiLi4vT3B0aW9uT2JqZWN0XCIpLk9wdGlvbk9iamVjdDtcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvU3RyaW5nSGVscGVyXCIpLlN0cmluZ0hlbHBlcjtcblxudmFyIFJlcGxhY2VtZW50ID0gZnVuY3Rpb24gKCkge1xuICBjbGFzcyBSZXBsYWNlbWVudCBleHRlbmRzIFBvcyB7XG4gICAgY29uc3RydWN0b3Ioc3RhcnQxLCBlbmQsIHRleHQxLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQxO1xuICAgICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgICB0aGlzLnRleHQgPSB0ZXh0MTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zLCB7XG4gICAgICAgIHByZWZpeDogJycsXG4gICAgICAgIHN1ZmZpeDogJycsXG4gICAgICAgIHNlbGVjdGlvbnM6IFtdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXNQb3NCZWZvcmVQcmVmaXgoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMudGV4dC5sZW5ndGg7XG4gICAgfVxuXG4gICAgcmVzRW5kKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLmZpbmFsVGV4dCgpLmxlbmd0aDtcbiAgICB9XG5cbiAgICBhcHBseSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnNwbGljZVRleHQodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZmluYWxUZXh0KCkpO1xuICAgIH1cblxuICAgIG5lY2Vzc2FyeSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmFsVGV4dCgpICE9PSB0aGlzLm9yaWdpbmFsVGV4dCgpO1xuICAgIH1cblxuICAgIG9yaWdpbmFsVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICAgIH1cblxuICAgIGZpbmFsVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMudGV4dCArIHRoaXMuc3VmZml4O1xuICAgIH1cblxuICAgIG9mZnNldEFmdGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoIC0gKHRoaXMuZW5kIC0gdGhpcy5zdGFydCk7XG4gICAgfVxuXG4gICAgYXBwbHlPZmZzZXQob2Zmc2V0KSB7XG4gICAgICB2YXIgaSwgbGVuLCByZWYsIHNlbDtcblxuICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgICAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnM7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgc2VsID0gcmVmW2ldO1xuICAgICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXQ7XG4gICAgICAgICAgc2VsLmVuZCArPSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2VsZWN0Q29udGVudCgpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3RhcnQsIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3RhcnQgKyB0aGlzLnRleHQubGVuZ3RoKV07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjYXJyZXRUb1NlbCgpIHtcbiAgICAgIHZhciBwb3MsIHJlcywgc3RhcnQsIHRleHQ7XG4gICAgICB0aGlzLnNlbGVjdGlvbnMgPSBbXTtcbiAgICAgIHRleHQgPSB0aGlzLmZpbmFsVGV4dCgpO1xuICAgICAgdGhpcy5wcmVmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMucHJlZml4KTtcbiAgICAgIHRoaXMudGV4dCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy50ZXh0KTtcbiAgICAgIHRoaXMuc3VmZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnN1ZmZpeCk7XG4gICAgICBzdGFydCA9IHRoaXMuc3RhcnQ7XG5cbiAgICAgIHdoaWxlICgocmVzID0gU3RyaW5nSGVscGVyLmdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHRleHQpKSAhPSBudWxsKSB7XG4gICAgICAgIFtwb3MsIHRleHRdID0gcmVzO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0ICsgcG9zLCBzdGFydCArIHBvcykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgdmFyIHJlcztcbiAgICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy50ZXh0LCB0aGlzLmdldE9wdHMoKSk7XG5cbiAgICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpO1xuICAgICAgfVxuXG4gICAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuIHMuY29weSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICB9XG5cbiAgO1xuXG4gIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhSZXBsYWNlbWVudC5wcm90b3R5cGUsIFtPcHRpb25PYmplY3RdKTtcblxuICByZXR1cm4gUmVwbGFjZW1lbnQ7XG59LmNhbGwodm9pZCAwKTtcblxuZXhwb3J0cy5SZXBsYWNlbWVudCA9IFJlcGxhY2VtZW50O1xuXG4iLCJcbnZhciBTaXplID0gY2xhc3MgU2l6ZSB7XG4gIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIH1cblxufTtcbmV4cG9ydHMuU2l6ZSA9IFNpemU7XG5cbiIsIlxudmFyIFN0clBvcyA9IGNsYXNzIFN0clBvcyB7XG4gIGNvbnN0cnVjdG9yKHBvcywgc3RyKSB7XG4gICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgdGhpcy5zdHIgPSBzdHI7XG4gIH1cblxuICBlbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoO1xuICB9XG5cbn07XG5leHBvcnRzLlN0clBvcyA9IFN0clBvcztcblxuIiwiXG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoXCIuL1Bvc1wiKS5Qb3M7XG5cbnZhciBXcmFwcGVkUG9zID0gY2xhc3MgV3JhcHBlZFBvcyBleHRlbmRzIFBvcyB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBpbm5lclN0YXJ0LCBpbm5lckVuZCwgZW5kKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5pbm5lclN0YXJ0ID0gaW5uZXJTdGFydDtcbiAgICB0aGlzLmlubmVyRW5kID0gaW5uZXJFbmQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gIH1cblxuICBpbm5lckNvbnRhaW5zUHQocHQpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclN0YXJ0IDw9IHB0ICYmIHB0IDw9IHRoaXMuaW5uZXJFbmQ7XG4gIH1cblxuICBpbm5lckNvbnRhaW5zUG9zKHBvcykge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcG9zLnN0YXJ0ICYmIHBvcy5lbmQgPD0gdGhpcy5pbm5lckVuZDtcbiAgfVxuXG4gIGlubmVyVGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCk7XG4gIH1cblxuICBzZXRJbm5lckxlbihsZW4pIHtcbiAgICByZXR1cm4gdGhpcy5tb3ZlU3VmaXgodGhpcy5pbm5lclN0YXJ0ICsgbGVuKTtcbiAgfVxuXG4gIG1vdmVTdWZmaXgocHQpIHtcbiAgICB2YXIgc3VmZml4TGVuO1xuICAgIHN1ZmZpeExlbiA9IHRoaXMuZW5kIC0gdGhpcy5pbm5lckVuZDtcbiAgICB0aGlzLmlubmVyRW5kID0gcHQ7XG4gICAgcmV0dXJuIHRoaXMuZW5kID0gdGhpcy5pbm5lckVuZCArIHN1ZmZpeExlbjtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKHRoaXMuc3RhcnQsIHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCwgdGhpcy5lbmQpO1xuICB9XG5cbn07XG5leHBvcnRzLldyYXBwZWRQb3MgPSBXcmFwcGVkUG9zO1xuXG4iLCJcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKFwiLi9SZXBsYWNlbWVudFwiKS5SZXBsYWNlbWVudDtcblxudmFyIFdyYXBwaW5nID0gY2xhc3MgV3JhcHBpbmcgZXh0ZW5kcyBSZXBsYWNlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBlbmQsIHByZWZpeCA9ICcnLCBzdWZmaXggPSAnJywgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zKTtcbiAgICB0aGlzLnRleHQgPSAnJztcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeDtcbiAgICB0aGlzLnN1ZmZpeCA9IHN1ZmZpeDtcbiAgfVxuXG4gIGFwcGx5KCkge1xuICAgIHRoaXMuYWRqdXN0U2VsKCk7XG4gICAgcmV0dXJuIHN1cGVyLmFwcGx5KCk7XG4gIH1cblxuICBhZGp1c3RTZWwoKSB7XG4gICAgdmFyIGksIGxlbiwgb2Zmc2V0LCByZWYsIHJlc3VsdHMsIHNlbDtcbiAgICBvZmZzZXQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpLmxlbmd0aDtcbiAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnM7XG4gICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzZWwgPSByZWZbaV07XG5cbiAgICAgIGlmIChzZWwuc3RhcnQgPiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWwuZW5kID49IHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHNlbC5lbmQgKz0gb2Zmc2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgZmluYWxUZXh0KCkge1xuICAgIHZhciB0ZXh0O1xuXG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHRleHQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGV4dCArIHRoaXMuc3VmZml4O1xuICB9XG5cbiAgb2Zmc2V0QWZ0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3VmZml4Lmxlbmd0aDtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBuZXcgV3JhcHBpbmcodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMucHJlZml4LCB0aGlzLnN1ZmZpeCk7XG4gICAgcmVzLnNlbGVjdGlvbnMgPSB0aGlzLnNlbGVjdGlvbnMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gcy5jb3B5KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG59O1xuZXhwb3J0cy5XcmFwcGluZyA9IFdyYXBwaW5nO1xuXG4iLCJcbnZhciBMb2NhbFN0b3JhZ2VFbmdpbmUgPSBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmUge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgc2F2ZShrZXksIHZhbCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKTtcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZGF0YSA9IHRoaXMubG9hZChwYXRoKTtcblxuICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICB9XG5cbiAgICBkYXRhW2tleV0gPSB2YWw7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZShwYXRoLCBkYXRhKTtcbiAgfVxuXG4gIGxvYWQoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmZ1bGxLZXkoa2V5KSkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bGxLZXkoa2V5KSB7XG4gICAgcmV0dXJuICdDb2RlV2F2ZV8nICsga2V5O1xuICB9XG5cbn07XG5leHBvcnRzLkxvY2FsU3RvcmFnZUVuZ2luZSA9IExvY2FsU3RvcmFnZUVuZ2luZTtcblxuIiwiXG52YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwYXJzZXIsIHBhcmVudCkge1xuICAgIHRoaXMucGFyc2VyID0gcGFyc2VyO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuY29udGVudCA9IFwiXCI7XG4gIH1cblxuICBvblN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0QXQgPSB0aGlzLnBhcnNlci5wb3M7XG4gIH1cblxuICBvbkNoYXIoY2hhcikge31cblxuICBlbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VyLnNldENvbnRleHQodGhpcy5wYXJlbnQpO1xuICB9XG5cbiAgb25FbmQoKSB7fVxuXG4gIHRlc3RDb250ZXh0KGNvbnRleHRUeXBlKSB7XG4gICAgaWYgKGNvbnRleHRUeXBlLnRlc3QodGhpcy5wYXJzZXIuY2hhciwgdGhpcykpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlci5zZXRDb250ZXh0KG5ldyBjb250ZXh0VHlwZSh0aGlzLnBhcnNlciwgdGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB0ZXN0KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG59O1xuZXhwb3J0cy5Db250ZXh0ID0gQ29udGV4dDtcblxuIiwiXG5cbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKFwiLi9Db250ZXh0XCIpLkNvbnRleHQ7XG5cbnZhciBFc2NhcGVDb250ZXh0ID0gY2xhc3MgRXNjYXBlQ29udGV4dCBleHRlbmRzIENvbnRleHQge1xuICBvbkNoYXIoY2hhcikge1xuICAgIHRoaXMucGFyZW50LmNvbnRlbnQgKz0gY2hhcjtcbiAgICByZXR1cm4gdGhpcy5lbmQoKTtcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0KGNoYXIpIHtcbiAgICByZXR1cm4gY2hhciA9PT0gJ1xcXFwnO1xuICB9XG5cbn07XG5leHBvcnRzLkVzY2FwZUNvbnRleHQgPSBFc2NhcGVDb250ZXh0O1xuXG4iLCJcblxuY29uc3QgUGFyYW1Db250ZXh0ID0gcmVxdWlyZShcIi4vUGFyYW1Db250ZXh0XCIpLlBhcmFtQ29udGV4dDtcblxudmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xudmFyIE5hbWVkQ29udGV4dCA9IGNsYXNzIE5hbWVkQ29udGV4dCBleHRlbmRzIFBhcmFtQ29udGV4dCB7XG4gIG9uU3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZSA9IHRoaXMucGFyZW50LmNvbnRlbnQ7XG4gIH1cblxuICBvbkVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZXIubmFtZWRbdGhpcy5uYW1lXSA9IHRoaXMuY29udGVudDtcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0KGNoYXIsIHBhcmVudCkge1xuICAgIHZhciByZWY7XG4gICAgcmV0dXJuIGNoYXIgPT09ICc6JyAmJiAocGFyZW50LnBhcnNlci5vcHRpb25zLmFsbG93ZWROYW1lZCA9PSBudWxsIHx8IChyZWYgPSBwYXJlbnQuY29udGVudCwgaW5kZXhPZi5jYWxsKHBhcmVudC5wYXJzZXIub3B0aW9ucy5hbGxvd2VkTmFtZWQsIHJlZikgPj0gMCkpO1xuICB9XG5cbn07XG5leHBvcnRzLk5hbWVkQ29udGV4dCA9IE5hbWVkQ29udGV4dDtcblxuIiwiXG5cbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKFwiLi9Db250ZXh0XCIpLkNvbnRleHQ7XG5cbmNvbnN0IFN0cmluZ0NvbnRleHQgPSByZXF1aXJlKFwiLi9TdHJpbmdDb250ZXh0XCIpLlN0cmluZ0NvbnRleHQ7XG5cbmNvbnN0IFZhcmlhYmxlQ29udGV4dCA9IHJlcXVpcmUoXCIuL1ZhcmlhYmxlQ29udGV4dFwiKS5WYXJpYWJsZUNvbnRleHQ7XG5cbnZhciBQYXJhbUNvbnRleHQgPSBjbGFzcyBQYXJhbUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25DaGFyKGNoYXIpIHtcbiAgICBpZiAodGhpcy50ZXN0Q29udGV4dChTdHJpbmdDb250ZXh0KSkge30gZWxzZSBpZiAodGhpcy50ZXN0Q29udGV4dChQYXJhbUNvbnRleHQubmFtZWQpKSB7fSBlbHNlIGlmICh0aGlzLnRlc3RDb250ZXh0KFZhcmlhYmxlQ29udGV4dCkpIHt9IGVsc2UgaWYgKGNoYXIgPT09ICcgJykge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLnNldENvbnRleHQobmV3IFBhcmFtQ29udGV4dCh0aGlzLnBhcnNlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ICs9IGNoYXI7XG4gICAgfVxuICB9XG5cbiAgb25FbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VyLnBhcmFtcy5wdXNoKHRoaXMuY29udGVudCk7XG4gIH1cblxufTtcbmV4cG9ydHMuUGFyYW1Db250ZXh0ID0gUGFyYW1Db250ZXh0O1xuXG4iLCJcblxuY29uc3QgUGFyYW1Db250ZXh0ID0gcmVxdWlyZShcIi4vUGFyYW1Db250ZXh0XCIpLlBhcmFtQ29udGV4dDtcblxuY29uc3QgTmFtZWRDb250ZXh0ID0gcmVxdWlyZShcIi4vTmFtZWRDb250ZXh0XCIpLk5hbWVkQ29udGV4dDtcblxuUGFyYW1Db250ZXh0Lm5hbWVkID0gTmFtZWRDb250ZXh0O1xudmFyIFBhcmFtUGFyc2VyID0gY2xhc3MgUGFyYW1QYXJzZXIge1xuICBjb25zdHJ1Y3RvcihwYXJhbVN0cmluZywgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5wYXJhbVN0cmluZyA9IHBhcmFtU3RyaW5nO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5wYXJzZSgpO1xuICB9XG5cbiAgc2V0Q29udGV4dChjb250ZXh0KSB7XG4gICAgdmFyIG9sZENvbnRleHQ7XG4gICAgb2xkQ29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgaWYgKG9sZENvbnRleHQgIT0gbnVsbCAmJiBvbGRDb250ZXh0ICE9PSAoY29udGV4dCAhPSBudWxsID8gY29udGV4dC5wYXJlbnQgOiB2b2lkIDApKSB7XG4gICAgICBvbGRDb250ZXh0Lm9uRW5kKCk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQgIT0gbnVsbCkge1xuICAgICAgY29udGV4dC5vblN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dDtcbiAgfVxuXG4gIHBhcnNlKCkge1xuICAgIHRoaXMucGFyYW1zID0gW107XG4gICAgdGhpcy5uYW1lZCA9IHt9O1xuXG4gICAgaWYgKHRoaXMucGFyYW1TdHJpbmcubGVuZ3RoKSB7XG4gICAgICB0aGlzLnNldENvbnRleHQobmV3IFBhcmFtQ29udGV4dCh0aGlzKSk7XG4gICAgICB0aGlzLnBvcyA9IDA7XG5cbiAgICAgIHdoaWxlICh0aGlzLnBvcyA8IHRoaXMucGFyYW1TdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY2hhciA9IHRoaXMucGFyYW1TdHJpbmdbdGhpcy5wb3NdO1xuICAgICAgICB0aGlzLmNvbnRleHQub25DaGFyKHRoaXMuY2hhcik7XG4gICAgICAgIHRoaXMucG9zKys7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNldENvbnRleHQobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgdGFrZShuYikge1xuICAgIHJldHVybiB0aGlzLnBhcmFtU3RyaW5nLnN1YnN0cmluZyh0aGlzLnBvcywgdGhpcy5wb3MgKyBuYik7XG4gIH1cblxuICBza2lwKG5iID0gMSkge1xuICAgIHJldHVybiB0aGlzLnBvcyArPSBuYjtcbiAgfVxuXG59O1xuZXhwb3J0cy5QYXJhbVBhcnNlciA9IFBhcmFtUGFyc2VyO1xuXG4iLCJcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIikuQ29udGV4dDtcblxuY29uc3QgRXNjYXBlQ29udGV4dCA9IHJlcXVpcmUoXCIuL0VzY2FwZUNvbnRleHRcIikuRXNjYXBlQ29udGV4dDtcblxuY29uc3QgVmFyaWFibGVDb250ZXh0ID0gcmVxdWlyZShcIi4vVmFyaWFibGVDb250ZXh0XCIpLlZhcmlhYmxlQ29udGV4dDtcblxudmFyIFN0cmluZ0NvbnRleHQgPSBjbGFzcyBTdHJpbmdDb250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uQ2hhcihjaGFyKSB7XG4gICAgaWYgKHRoaXMudGVzdENvbnRleHQoRXNjYXBlQ29udGV4dCkpIHt9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoVmFyaWFibGVDb250ZXh0KSkge30gZWxzZSBpZiAoU3RyaW5nQ29udGV4dC5pc0RlbGltaXRlcihjaGFyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgKz0gY2hhcjtcbiAgICB9XG4gIH1cblxuICBvbkVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuY29udGVudCArPSB0aGlzLmNvbnRlbnQ7XG4gIH1cblxuICBzdGF0aWMgdGVzdChjaGFyKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNEZWxpbWl0ZXIoY2hhcik7XG4gIH1cblxuICBzdGF0aWMgaXNEZWxpbWl0ZXIoY2hhcikge1xuICAgIHJldHVybiBjaGFyID09PSAnXCInIHx8IGNoYXIgPT09IFwiJ1wiO1xuICB9XG5cbn07XG5leHBvcnRzLlN0cmluZ0NvbnRleHQgPSBTdHJpbmdDb250ZXh0O1xuXG4iLCJcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIikuQ29udGV4dDtcblxudmFyIFZhcmlhYmxlQ29udGV4dCA9IGNsYXNzIFZhcmlhYmxlQ29udGV4dCBleHRlbmRzIENvbnRleHQge1xuICBvblN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5za2lwKCk7XG4gIH1cblxuICBvbkNoYXIoY2hhcikge1xuICAgIGlmIChjaGFyID09PSAnfScpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ICs9IGNoYXI7XG4gICAgfVxuICB9XG5cbiAgb25FbmQoKSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuY29udGVudCArPSAoKHJlZiA9IHRoaXMucGFyc2VyLm9wdGlvbnMudmFycykgIT0gbnVsbCA/IHJlZlt0aGlzLmNvbnRlbnRdIDogdm9pZCAwKSB8fCAnJztcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0KGNoYXIsIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQucGFyc2VyLnRha2UoMikgPT09ICcjeyc7XG4gIH1cblxufTtcbmV4cG9ydHMuVmFyaWFibGVDb250ZXh0ID0gVmFyaWFibGVDb250ZXh0O1xuXG4iLCIvKiFcbiAqIGluZmxlY3Rpb25cbiAqIENvcHlyaWdodChjKSAyMDExIEJlbiBMaW4gPGJlbkBkcmVhbWVyc2xhYi5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBBIHBvcnQgb2YgaW5mbGVjdGlvbi1qcyB0byBub2RlLmpzIG1vZHVsZS5cbiAqL1xuXG4oIGZ1bmN0aW9uICggcm9vdCwgZmFjdG9yeSApe1xuICBpZiggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICl7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5ICk7XG4gIH1lbHNlIGlmKCB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfWVsc2V7XG4gICAgcm9vdC5pbmZsZWN0aW9uID0gZmFjdG9yeSgpO1xuICB9XG59KCB0aGlzLCBmdW5jdGlvbiAoKXtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoaXMgaXMgYSBsaXN0IG9mIG5vdW5zIHRoYXQgdXNlIHRoZSBzYW1lIGZvcm0gZm9yIGJvdGggc2luZ3VsYXIgYW5kIHBsdXJhbC5cbiAgICogICAgICAgICAgICAgIFRoaXMgbGlzdCBzaG91bGQgcmVtYWluIGVudGlyZWx5IGluIGxvd2VyIGNhc2UgdG8gY29ycmVjdGx5IG1hdGNoIFN0cmluZ3MuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgdW5jb3VudGFibGVfd29yZHMgPSBbXG4gICAgLy8gJ2FjY2VzcycsXG4gICAgJ2FjY29tbW9kYXRpb24nLFxuICAgICdhZHVsdGhvb2QnLFxuICAgICdhZHZlcnRpc2luZycsXG4gICAgJ2FkdmljZScsXG4gICAgJ2FnZ3Jlc3Npb24nLFxuICAgICdhaWQnLFxuICAgICdhaXInLFxuICAgICdhaXJjcmFmdCcsXG4gICAgJ2FsY29ob2wnLFxuICAgICdhbmdlcicsXG4gICAgJ2FwcGxhdXNlJyxcbiAgICAnYXJpdGhtZXRpYycsXG4gICAgLy8gJ2FydCcsXG4gICAgJ2Fzc2lzdGFuY2UnLFxuICAgICdhdGhsZXRpY3MnLFxuICAgIC8vICdhdHRlbnRpb24nLFxuXG4gICAgJ2JhY29uJyxcbiAgICAnYmFnZ2FnZScsXG4gICAgLy8gJ2JhbGxldCcsXG4gICAgLy8gJ2JlYXV0eScsXG4gICAgJ2JlZWYnLFxuICAgIC8vICdiZWVyJyxcbiAgICAvLyAnYmVoYXZpb3InLFxuICAgICdiaW9sb2d5JyxcbiAgICAvLyAnYmlsbGlhcmRzJyxcbiAgICAnYmxvb2QnLFxuICAgICdib3RhbnknLFxuICAgIC8vICdib3dlbHMnLFxuICAgICdicmVhZCcsXG4gICAgLy8gJ2J1c2luZXNzJyxcbiAgICAnYnV0dGVyJyxcblxuICAgICdjYXJib24nLFxuICAgICdjYXJkYm9hcmQnLFxuICAgICdjYXNoJyxcbiAgICAnY2hhbGsnLFxuICAgICdjaGFvcycsXG4gICAgJ2NoZXNzJyxcbiAgICAnY3Jvc3Nyb2FkcycsXG4gICAgJ2NvdW50cnlzaWRlJyxcblxuICAgIC8vICdkYW1hZ2UnLFxuICAgICdkYW5jaW5nJyxcbiAgICAvLyAnZGFuZ2VyJyxcbiAgICAnZGVlcicsXG4gICAgLy8gJ2RlbGlnaHQnLFxuICAgIC8vICdkZXNzZXJ0JyxcbiAgICAnZGlnbml0eScsXG4gICAgJ2RpcnQnLFxuICAgIC8vICdkaXN0cmlidXRpb24nLFxuICAgICdkdXN0JyxcblxuICAgICdlY29ub21pY3MnLFxuICAgICdlZHVjYXRpb24nLFxuICAgICdlbGVjdHJpY2l0eScsXG4gICAgLy8gJ2VtcGxveW1lbnQnLFxuICAgIC8vICdlbmVyZ3knLFxuICAgICdlbmdpbmVlcmluZycsXG4gICAgJ2Vuam95bWVudCcsXG4gICAgLy8gJ2VudGVydGFpbm1lbnQnLFxuICAgICdlbnZ5JyxcbiAgICAnZXF1aXBtZW50JyxcbiAgICAnZXRoaWNzJyxcbiAgICAnZXZpZGVuY2UnLFxuICAgICdldm9sdXRpb24nLFxuXG4gICAgLy8gJ2ZhaWx1cmUnLFxuICAgIC8vICdmYWl0aCcsXG4gICAgJ2ZhbWUnLFxuICAgICdmaWN0aW9uJyxcbiAgICAvLyAnZmlzaCcsXG4gICAgJ2Zsb3VyJyxcbiAgICAnZmx1JyxcbiAgICAnZm9vZCcsXG4gICAgLy8gJ2ZyZWVkb20nLFxuICAgIC8vICdmcnVpdCcsXG4gICAgJ2Z1ZWwnLFxuICAgICdmdW4nLFxuICAgIC8vICdmdW5lcmFsJyxcbiAgICAnZnVybml0dXJlJyxcblxuICAgICdnYWxsb3dzJyxcbiAgICAnZ2FyYmFnZScsXG4gICAgJ2dhcmxpYycsXG4gICAgLy8gJ2dhcycsXG4gICAgJ2dlbmV0aWNzJyxcbiAgICAvLyAnZ2xhc3MnLFxuICAgICdnb2xkJyxcbiAgICAnZ29sZicsXG4gICAgJ2dvc3NpcCcsXG4gICAgJ2dyYW1tYXInLFxuICAgIC8vICdncmFzcycsXG4gICAgJ2dyYXRpdHVkZScsXG4gICAgJ2dyaWVmJyxcbiAgICAvLyAnZ3JvdW5kJyxcbiAgICAnZ3VpbHQnLFxuICAgICdneW1uYXN0aWNzJyxcblxuICAgIC8vICdoYWlyJyxcbiAgICAnaGFwcGluZXNzJyxcbiAgICAnaGFyZHdhcmUnLFxuICAgICdoYXJtJyxcbiAgICAnaGF0ZScsXG4gICAgJ2hhdHJlZCcsXG4gICAgJ2hlYWx0aCcsXG4gICAgJ2hlYXQnLFxuICAgIC8vICdoZWlnaHQnLFxuICAgICdoZWxwJyxcbiAgICAnaG9tZXdvcmsnLFxuICAgICdob25lc3R5JyxcbiAgICAnaG9uZXknLFxuICAgICdob3NwaXRhbGl0eScsXG4gICAgJ2hvdXNld29yaycsXG4gICAgJ2h1bW91cicsXG4gICAgJ2h1bmdlcicsXG4gICAgJ2h5ZHJvZ2VuJyxcblxuICAgICdpY2UnLFxuICAgICdpbXBvcnRhbmNlJyxcbiAgICAnaW5mbGF0aW9uJyxcbiAgICAnaW5mb3JtYXRpb24nLFxuICAgIC8vICdpbmp1c3RpY2UnLFxuICAgICdpbm5vY2VuY2UnLFxuICAgIC8vICdpbnRlbGxpZ2VuY2UnLFxuICAgICdpcm9uJyxcbiAgICAnaXJvbnknLFxuXG4gICAgJ2phbScsXG4gICAgLy8gJ2plYWxvdXN5JyxcbiAgICAvLyAnamVsbHknLFxuICAgICdqZXdlbHJ5JyxcbiAgICAvLyAnam95JyxcbiAgICAnanVkbycsXG4gICAgLy8gJ2p1aWNlJyxcbiAgICAvLyAnanVzdGljZScsXG5cbiAgICAna2FyYXRlJyxcbiAgICAvLyAna2luZG5lc3MnLFxuICAgICdrbm93bGVkZ2UnLFxuXG4gICAgLy8gJ2xhYm91cicsXG4gICAgJ2xhY2snLFxuICAgIC8vICdsYW5kJyxcbiAgICAnbGF1Z2h0ZXInLFxuICAgICdsYXZhJyxcbiAgICAnbGVhdGhlcicsXG4gICAgJ2xlaXN1cmUnLFxuICAgICdsaWdodG5pbmcnLFxuICAgICdsaW5ndWluZScsXG4gICAgJ2xpbmd1aW5pJyxcbiAgICAnbGluZ3Vpc3RpY3MnLFxuICAgICdsaXRlcmF0dXJlJyxcbiAgICAnbGl0dGVyJyxcbiAgICAnbGl2ZXN0b2NrJyxcbiAgICAnbG9naWMnLFxuICAgICdsb25lbGluZXNzJyxcbiAgICAvLyAnbG92ZScsXG4gICAgJ2x1Y2snLFxuICAgICdsdWdnYWdlJyxcblxuICAgICdtYWNhcm9uaScsXG4gICAgJ21hY2hpbmVyeScsXG4gICAgJ21hZ2ljJyxcbiAgICAvLyAnbWFpbCcsXG4gICAgJ21hbmFnZW1lbnQnLFxuICAgICdtYW5raW5kJyxcbiAgICAnbWFyYmxlJyxcbiAgICAnbWF0aGVtYXRpY3MnLFxuICAgICdtYXlvbm5haXNlJyxcbiAgICAnbWVhc2xlcycsXG4gICAgLy8gJ21lYXQnLFxuICAgIC8vICdtZXRhbCcsXG4gICAgJ21ldGhhbmUnLFxuICAgICdtaWxrJyxcbiAgICAnbWludXMnLFxuICAgICdtb25leScsXG4gICAgLy8gJ21vb3NlJyxcbiAgICAnbXVkJyxcbiAgICAnbXVzaWMnLFxuICAgICdtdW1wcycsXG5cbiAgICAnbmF0dXJlJyxcbiAgICAnbmV3cycsXG4gICAgJ25pdHJvZ2VuJyxcbiAgICAnbm9uc2Vuc2UnLFxuICAgICdudXJ0dXJlJyxcbiAgICAnbnV0cml0aW9uJyxcblxuICAgICdvYmVkaWVuY2UnLFxuICAgICdvYmVzaXR5JyxcbiAgICAvLyAnb2lsJyxcbiAgICAnb3h5Z2VuJyxcblxuICAgIC8vICdwYXBlcicsXG4gICAgLy8gJ3Bhc3Npb24nLFxuICAgICdwYXN0YScsXG4gICAgJ3BhdGllbmNlJyxcbiAgICAvLyAncGVybWlzc2lvbicsXG4gICAgJ3BoeXNpY3MnLFxuICAgICdwb2V0cnknLFxuICAgICdwb2xsdXRpb24nLFxuICAgICdwb3ZlcnR5JyxcbiAgICAvLyAncG93ZXInLFxuICAgICdwcmlkZScsXG4gICAgLy8gJ3Byb2R1Y3Rpb24nLFxuICAgIC8vICdwcm9ncmVzcycsXG4gICAgLy8gJ3Byb251bmNpYXRpb24nLFxuICAgICdwc3ljaG9sb2d5JyxcbiAgICAncHVibGljaXR5JyxcbiAgICAncHVuY3R1YXRpb24nLFxuXG4gICAgLy8gJ3F1YWxpdHknLFxuICAgIC8vICdxdWFudGl0eScsXG4gICAgJ3F1YXJ0eicsXG5cbiAgICAncmFjaXNtJyxcbiAgICAvLyAncmFpbicsXG4gICAgLy8gJ3JlY3JlYXRpb24nLFxuICAgICdyZWxheGF0aW9uJyxcbiAgICAncmVsaWFiaWxpdHknLFxuICAgICdyZXNlYXJjaCcsXG4gICAgJ3Jlc3BlY3QnLFxuICAgICdyZXZlbmdlJyxcbiAgICAncmljZScsXG4gICAgJ3J1YmJpc2gnLFxuICAgICdydW0nLFxuXG4gICAgJ3NhZmV0eScsXG4gICAgLy8gJ3NhbGFkJyxcbiAgICAvLyAnc2FsdCcsXG4gICAgLy8gJ3NhbmQnLFxuICAgIC8vICdzYXRpcmUnLFxuICAgICdzY2VuZXJ5JyxcbiAgICAnc2VhZm9vZCcsXG4gICAgJ3NlYXNpZGUnLFxuICAgICdzZXJpZXMnLFxuICAgICdzaGFtZScsXG4gICAgJ3NoZWVwJyxcbiAgICAnc2hvcHBpbmcnLFxuICAgIC8vICdzaWxlbmNlJyxcbiAgICAnc2xlZXAnLFxuICAgIC8vICdzbGFuZydcbiAgICAnc21va2UnLFxuICAgICdzbW9raW5nJyxcbiAgICAnc25vdycsXG4gICAgJ3NvYXAnLFxuICAgICdzb2Z0d2FyZScsXG4gICAgJ3NvaWwnLFxuICAgIC8vICdzb3Jyb3cnLFxuICAgIC8vICdzb3VwJyxcbiAgICAnc3BhZ2hldHRpJyxcbiAgICAvLyAnc3BlZWQnLFxuICAgICdzcGVjaWVzJyxcbiAgICAvLyAnc3BlbGxpbmcnLFxuICAgIC8vICdzcG9ydCcsXG4gICAgJ3N0ZWFtJyxcbiAgICAvLyAnc3RyZW5ndGgnLFxuICAgICdzdHVmZicsXG4gICAgJ3N0dXBpZGl0eScsXG4gICAgLy8gJ3N1Y2Nlc3MnLFxuICAgIC8vICdzdWdhcicsXG4gICAgJ3N1bnNoaW5lJyxcbiAgICAnc3ltbWV0cnknLFxuXG4gICAgLy8gJ3RlYScsXG4gICAgJ3Rlbm5pcycsXG4gICAgJ3RoaXJzdCcsXG4gICAgJ3RodW5kZXInLFxuICAgICd0aW1iZXInLFxuICAgIC8vICd0aW1lJyxcbiAgICAvLyAndG9hc3QnLFxuICAgIC8vICd0b2xlcmFuY2UnLFxuICAgIC8vICd0cmFkZScsXG4gICAgJ3RyYWZmaWMnLFxuICAgICd0cmFuc3BvcnRhdGlvbicsXG4gICAgLy8gJ3RyYXZlbCcsXG4gICAgJ3RydXN0JyxcblxuICAgIC8vICd1bmRlcnN0YW5kaW5nJyxcbiAgICAndW5kZXJ3ZWFyJyxcbiAgICAndW5lbXBsb3ltZW50JyxcbiAgICAndW5pdHknLFxuICAgIC8vICd1c2FnZScsXG5cbiAgICAndmFsaWRpdHknLFxuICAgICd2ZWFsJyxcbiAgICAndmVnZXRhdGlvbicsXG4gICAgJ3ZlZ2V0YXJpYW5pc20nLFxuICAgICd2ZW5nZWFuY2UnLFxuICAgICd2aW9sZW5jZScsXG4gICAgLy8gJ3Zpc2lvbicsXG4gICAgJ3ZpdGFsaXR5JyxcblxuICAgICd3YXJtdGgnLFxuICAgIC8vICd3YXRlcicsXG4gICAgJ3dlYWx0aCcsXG4gICAgJ3dlYXRoZXInLFxuICAgIC8vICd3ZWlnaHQnLFxuICAgICd3ZWxmYXJlJyxcbiAgICAnd2hlYXQnLFxuICAgIC8vICd3aGlza2V5JyxcbiAgICAvLyAnd2lkdGgnLFxuICAgICd3aWxkbGlmZScsXG4gICAgLy8gJ3dpbmUnLFxuICAgICd3aXNkb20nLFxuICAgIC8vICd3b29kJyxcbiAgICAvLyAnd29vbCcsXG4gICAgLy8gJ3dvcmsnLFxuXG4gICAgLy8gJ3llYXN0JyxcbiAgICAneW9nYScsXG5cbiAgICAnemluYycsXG4gICAgJ3pvb2xvZ3knXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBydWxlcyB0cmFuc2xhdGUgZnJvbSB0aGUgc2luZ3VsYXIgZm9ybSBvZiBhIG5vdW4gdG8gaXRzIHBsdXJhbCBmb3JtLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICB2YXIgcmVnZXggPSB7XG4gICAgcGx1cmFsIDoge1xuICAgICAgbWVuICAgICAgIDogbmV3IFJlZ0V4cCggJ14obXx3b20pZW4kJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBwZW9wbGUgICAgOiBuZXcgUmVnRXhwKCAnKHBlKW9wbGUkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNoaWxkcmVuICA6IG5ldyBSZWdFeHAoICcoY2hpbGQpcmVuJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdGlhICAgICAgIDogbmV3IFJlZ0V4cCggJyhbdGldKWEkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhbmFseXNlcyAgOiBuZXcgUmVnRXhwKCAnKChhKW5hbHl8KGIpYXwoZClpYWdub3wocClhcmVudGhlfChwKXJvZ25vfChzKXlub3B8KHQpaGUpc2VzJCcsJ2dpJyApLFxuICAgICAgaGl2ZXMgICAgIDogbmV3IFJlZ0V4cCggJyhoaXx0aSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjdXJ2ZXMgICAgOiBuZXcgUmVnRXhwKCAnKGN1cnZlKXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGxydmVzICAgICA6IG5ldyBSZWdFeHAoICcoW2xyXSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYXZlcyAgICAgIDogbmV3IFJlZ0V4cCggJyhbYV0pdmVzJCcgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBmb3ZlcyAgICAgOiBuZXcgUmVnRXhwKCAnKFteZm9dKXZlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1vdmllcyAgICA6IG5ldyBSZWdFeHAoICcobSlvdmllcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWVpb3V5aWVzIDogbmV3IFJlZ0V4cCggJyhbXmFlaW91eV18cXUpaWVzJCcgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzZXJpZXMgICAgOiBuZXcgUmVnRXhwKCAnKHMpZXJpZXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHhlcyAgICAgICA6IG5ldyBSZWdFeHAoICcoeHxjaHxzc3xzaCllcyQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWljZSAgICAgIDogbmV3IFJlZ0V4cCggJyhbbXxsXSlpY2UkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBidXNlcyAgICAgOiBuZXcgUmVnRXhwKCAnKGJ1cyllcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9lcyAgICAgICA6IG5ldyBSZWdFeHAoICcobyllcyQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc2hvZXMgICAgIDogbmV3IFJlZ0V4cCggJyhzaG9lKXMkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjcmlzZXMgICAgOiBuZXcgUmVnRXhwKCAnKGNyaXN8YXh8dGVzdCllcyQnICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9jdG9waSAgICA6IG5ldyBSZWdFeHAoICcob2N0b3B8dmlyKWkkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWxpYXNlcyAgIDogbmV3IFJlZ0V4cCggJyhhbGlhc3xjYW52YXN8c3RhdHVzfGNhbXB1cyllcyQnLCAnZ2knICksXG4gICAgICBzdW1tb25zZXMgOiBuZXcgUmVnRXhwKCAnXihzdW1tb25zKWVzJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG94ZW4gICAgICA6IG5ldyBSZWdFeHAoICdeKG94KWVuJyAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWF0cmljZXMgIDogbmV3IFJlZ0V4cCggJyhtYXRyKWljZXMkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB2ZXJ0aWNlcyAgOiBuZXcgUmVnRXhwKCAnKHZlcnR8aW5kKWljZXMkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZlZXQgICAgICA6IG5ldyBSZWdFeHAoICdeZmVldCQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdGVldGggICAgIDogbmV3IFJlZ0V4cCggJ150ZWV0aCQnICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBnZWVzZSAgICAgOiBuZXcgUmVnRXhwKCAnXmdlZXNlJCcgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHF1aXp6ZXMgICA6IG5ldyBSZWdFeHAoICcocXVpeil6ZXMkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgd2hlcmVhc2VzIDogbmV3IFJlZ0V4cCggJ14od2hlcmVhcyllcyQnICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjcml0ZXJpYSAgOiBuZXcgUmVnRXhwKCAnXihjcml0ZXJpKWEkJyAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlbmVyYSAgICA6IG5ldyBSZWdFeHAoICdeZ2VuZXJhJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc3MgICAgICAgIDogbmV3IFJlZ0V4cCggJ3NzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzICAgICAgICAgOiBuZXcgUmVnRXhwKCAncyQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKVxuICAgIH0sXG5cbiAgICBzaW5ndWxhciA6IHtcbiAgICAgIG1hbiAgICAgICA6IG5ldyBSZWdFeHAoICdeKG18d29tKWFuJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHBlcnNvbiAgICA6IG5ldyBSZWdFeHAoICcocGUpcnNvbiQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNoaWxkICAgICA6IG5ldyBSZWdFeHAoICcoY2hpbGQpJCcgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG94ICAgICAgICA6IG5ldyBSZWdFeHAoICdeKG94KSQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGF4aXMgICAgICA6IG5ldyBSZWdFeHAoICcoYXh8dGVzdClpcyQnICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9jdG9wdXMgICA6IG5ldyBSZWdFeHAoICcob2N0b3B8dmlyKXVzJCcgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFsaWFzICAgICA6IG5ldyBSZWdFeHAoICcoYWxpYXN8c3RhdHVzfGNhbnZhc3xjYW1wdXMpJCcsICdnaScgKSxcbiAgICAgIHN1bW1vbnMgICA6IG5ldyBSZWdFeHAoICdeKHN1bW1vbnMpJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1cyAgICAgICA6IG5ldyBSZWdFeHAoICcoYnUpcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1ZmZhbG8gICA6IG5ldyBSZWdFeHAoICcoYnVmZmFsfHRvbWF0fHBvdGF0KW8kJyAgICAgICAsICdnaScgKSxcbiAgICAgIHRpdW0gICAgICA6IG5ldyBSZWdFeHAoICcoW3RpXSl1bSQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHNpcyAgICAgICA6IG5ldyBSZWdFeHAoICdzaXMkJyAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZmZSAgICAgICA6IG5ldyBSZWdFeHAoICcoPzooW15mXSlmZXwoW2xyXSlmKSQnICAgICAgICAsICdnaScgKSxcbiAgICAgIGhpdmUgICAgICA6IG5ldyBSZWdFeHAoICcoaGl8dGkpdmUkJyAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFlaW91eXkgICA6IG5ldyBSZWdFeHAoICcoW15hZWlvdXldfHF1KXkkJyAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHggICAgICAgICA6IG5ldyBSZWdFeHAoICcoeHxjaHxzc3xzaCkkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1hdHJpeCAgICA6IG5ldyBSZWdFeHAoICcobWF0cilpeCQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHZlcnRleCAgICA6IG5ldyBSZWdFeHAoICcodmVydHxpbmQpZXgkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1vdXNlICAgICA6IG5ldyBSZWdFeHAoICcoW218bF0pb3VzZSQnICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZvb3QgICAgICA6IG5ldyBSZWdFeHAoICdeZm9vdCQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHRvb3RoICAgICA6IG5ldyBSZWdFeHAoICdedG9vdGgkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdvb3NlICAgICA6IG5ldyBSZWdFeHAoICdeZ29vc2UkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHF1aXogICAgICA6IG5ldyBSZWdFeHAoICcocXVpeikkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHdoZXJlYXMgICA6IG5ldyBSZWdFeHAoICdeKHdoZXJlYXMpJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXRlcmlvbiA6IG5ldyBSZWdFeHAoICdeKGNyaXRlcmkpb24kJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlbnVzICAgICA6IG5ldyBSZWdFeHAoICdeZ2VudXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHMgICAgICAgICA6IG5ldyBSZWdFeHAoICdzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNvbW1vbiAgICA6IG5ldyBSZWdFeHAoICckJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKVxuICAgIH1cbiAgfTtcblxuICB2YXIgcGx1cmFsX3J1bGVzID0gW1xuXG4gICAgLy8gZG8gbm90IHJlcGxhY2UgaWYgaXRzIGFscmVhZHkgYSBwbHVyYWwgd29yZFxuICAgIFsgcmVnZXgucGx1cmFsLm1lbiAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnBlb3BsZSAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNoaWxkcmVuICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnRpYSAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFuYWx5c2VzICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmhpdmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmN1cnZlcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmxydmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZvdmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFlaW91eWllcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNlcmllcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1vdmllcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnhlcyAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1pY2UgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmJ1c2VzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9lcyAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNob2VzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXNlcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9jdG9waSAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFsaWFzZXMgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnN1bW1vbnNlcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm94ZW4gICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1hdHJpY2VzICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZlZXQgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnRlZXRoICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlZXNlICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnF1aXp6ZXMgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLndoZXJlYXNlcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXRlcmlhICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlbmVyYSAgICBdLFxuXG4gICAgLy8gb3JpZ2luYWwgcnVsZVxuICAgIFsgcmVnZXguc2luZ3VsYXIubWFuICAgICAgLCAnJDFlbicgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnBlcnNvbiAgICwgJyQxb3BsZScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmNoaWxkICAgICwgJyQxcmVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub3ggICAgICAgLCAnJDFlbicgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmF4aXMgICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5vY3RvcHVzICAsICckMWknIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hbGlhcyAgICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc3VtbW9ucyAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmJ1cyAgICAgICwgJyQxc2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVmZmFsbyAgLCAnJDFvZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50aXVtICAgICAsICckMWEnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zaXMgICAgICAsICdzZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mZmUgICAgICAsICckMSQydmVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuaGl2ZSAgICAgLCAnJDF2ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hZWlvdXl5ICAsICckMWllcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm1hdHJpeCAgICwgJyQxaWNlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnZlcnRleCAgICwgJyQxaWNlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnggICAgICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tb3VzZSAgICAsICckMWljZScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmZvb3QgICAgICwgJ2ZlZXQnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50b290aCAgICAsICd0ZWV0aCcgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmdvb3NlICAgICwgJ2dlZXNlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucXVpeiAgICAgLCAnJDF6ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci53aGVyZWFzICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY3JpdGVyaW9uLCAnJDFhJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ2VudXMgICAgLCAnZ2VuZXJhJyBdLFxuXG4gICAgWyByZWdleC5zaW5ndWxhci5zICAgICAsICdzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY29tbW9uLCAncycgXVxuICBdO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhlc2UgcnVsZXMgdHJhbnNsYXRlIGZyb20gdGhlIHBsdXJhbCBmb3JtIG9mIGEgbm91biB0byBpdHMgc2luZ3VsYXIgZm9ybS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBzaW5ndWxhcl9ydWxlcyA9IFtcblxuICAgIC8vIGRvIG5vdCByZXBsYWNlIGlmIGl0cyBhbHJlYWR5IGEgc2luZ3VsYXIgd29yZFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWFuICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucGVyc29uICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY2hpbGQgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub3ggICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYXhpcyAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub2N0b3B1cyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYWxpYXMgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc3VtbW9ucyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVzICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVmZmFsbyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudGl1bSAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc2lzICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZmZlICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuaGl2ZSAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYWVpb3V5eSBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIueCAgICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWF0cml4ICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubW91c2UgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZm9vdCAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudG9vdGggICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ29vc2UgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucXVpeiAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIud2hlcmVhcyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY3JpdGVyaW9uIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nZW51cyBdLFxuXG4gICAgLy8gb3JpZ2luYWwgcnVsZVxuICAgIFsgcmVnZXgucGx1cmFsLm1lbiAgICAgICwgJyQxYW4nIF0sXG4gICAgWyByZWdleC5wbHVyYWwucGVvcGxlICAgLCAnJDFyc29uJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNoaWxkcmVuICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlbmVyYSAgICwgJ2dlbnVzJ10sXG4gICAgWyByZWdleC5wbHVyYWwuY3JpdGVyaWEgLCAnJDFvbiddLFxuICAgIFsgcmVnZXgucGx1cmFsLnRpYSAgICAgICwgJyQxdW0nIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYW5hbHlzZXMgLCAnJDEkMnNpcycgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5oaXZlcyAgICAsICckMXZlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmN1cnZlcyAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmxydmVzICAgICwgJyQxZicgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hdmVzICAgICAsICckMXZlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZvdmVzICAgICwgJyQxZmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubW92aWVzICAgLCAnJDFvdmllJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFlaW91eWllcywgJyQxeScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zZXJpZXMgICAsICckMWVyaWVzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnhlcyAgICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1pY2UgICAgICwgJyQxb3VzZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5idXNlcyAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5vZXMgICAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zaG9lcyAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5jcmlzZXMgICAsICckMWlzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9jdG9waSAgICwgJyQxdXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWxpYXNlcyAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc3VtbW9uc2VzLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwub3hlbiAgICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWF0cmljZXMgLCAnJDFpeCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC52ZXJ0aWNlcyAsICckMWV4JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZlZXQgICAgICwgJ2Zvb3QnIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGVldGggICAgLCAndG9vdGgnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2Vlc2UgICAgLCAnZ29vc2UnIF0sXG4gICAgWyByZWdleC5wbHVyYWwucXVpenplcyAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwud2hlcmVhc2VzLCAnJDEnIF0sXG5cbiAgICBbIHJlZ2V4LnBsdXJhbC5zcywgJ3NzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnMgLCAnJyBdXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGlzIGlzIGEgbGlzdCBvZiB3b3JkcyB0aGF0IHNob3VsZCBub3QgYmUgY2FwaXRhbGl6ZWQgZm9yIHRpdGxlIGNhc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgbm9uX3RpdGxlY2FzZWRfd29yZHMgPSBbXG4gICAgJ2FuZCcsICdvcicsICdub3InLCAnYScsICdhbicsICd0aGUnLCAnc28nLCAnYnV0JywgJ3RvJywgJ29mJywgJ2F0JywnYnknLFxuICAgICdmcm9tJywgJ2ludG8nLCAnb24nLCAnb250bycsICdvZmYnLCAnb3V0JywgJ2luJywgJ292ZXInLCAnd2l0aCcsICdmb3InXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBhcmUgcmVndWxhciBleHByZXNzaW9ucyB1c2VkIGZvciBjb252ZXJ0aW5nIGJldHdlZW4gU3RyaW5nIGZvcm1hdHMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgaWRfc3VmZml4ICAgICAgICAgPSBuZXcgUmVnRXhwKCAnKF9pZHN8X2lkKSQnLCAnZycgKTtcbiAgdmFyIHVuZGVyYmFyICAgICAgICAgID0gbmV3IFJlZ0V4cCggJ18nLCAnZycgKTtcbiAgdmFyIHNwYWNlX29yX3VuZGVyYmFyID0gbmV3IFJlZ0V4cCggJ1tcXCBfXScsICdnJyApO1xuICB2YXIgdXBwZXJjYXNlICAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFtBLVpdKScsICdnJyApO1xuICB2YXIgdW5kZXJiYXJfcHJlZml4ICAgPSBuZXcgUmVnRXhwKCAnXl8nICk7XG5cbiAgdmFyIGluZmxlY3RvciA9IHtcblxuICAvKipcbiAgICogQSBoZWxwZXIgbWV0aG9kIHRoYXQgYXBwbGllcyBydWxlcyBiYXNlZCByZXBsYWNlbWVudCB0byBhIFN0cmluZy5cbiAgICogQHByaXZhdGVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgU3RyaW5nIHRvIG1vZGlmeSBhbmQgcmV0dXJuIGJhc2VkIG9uIHRoZSBwYXNzZWQgcnVsZXMuXG4gICAqIEBwYXJhbSB7QXJyYXk6IFtSZWdFeHAsIFN0cmluZ119IHJ1bGVzIFJlZ2V4cCB0byBtYXRjaCBwYWlyZWQgd2l0aCBTdHJpbmcgdG8gdXNlIGZvciByZXBsYWNlbWVudFxuICAgKiBAcGFyYW0ge0FycmF5OiBbU3RyaW5nXX0gc2tpcCBTdHJpbmdzIHRvIHNraXAgaWYgdGhleSBtYXRjaFxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3ZlcnJpZGUgU3RyaW5nIHRvIHJldHVybiBhcyB0aG91Z2ggdGhpcyBtZXRob2Qgc3VjY2VlZGVkICh1c2VkIHRvIGNvbmZvcm0gdG8gQVBJcylcbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIHBhc3NlZCBTdHJpbmcgbW9kaWZpZWQgYnkgcGFzc2VkIHJ1bGVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdGhpcy5fYXBwbHlfcnVsZXMoICdjb3dzJywgc2luZ3VsYXJfcnVsZXMgKTsgLy8gPT09ICdjb3cnXG4gICAqL1xuICAgIF9hcHBseV9ydWxlcyA6IGZ1bmN0aW9uICggc3RyLCBydWxlcywgc2tpcCwgb3ZlcnJpZGUgKXtcbiAgICAgIGlmKCBvdmVycmlkZSApe1xuICAgICAgICBzdHIgPSBvdmVycmlkZTtcbiAgICAgIH1lbHNle1xuICAgICAgICB2YXIgaWdub3JlID0gKCBpbmZsZWN0b3IuaW5kZXhPZiggc2tpcCwgc3RyLnRvTG93ZXJDYXNlKCkpID4gLTEgKTtcblxuICAgICAgICBpZiggIWlnbm9yZSApe1xuICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICB2YXIgaiA9IHJ1bGVzLmxlbmd0aDtcblxuICAgICAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgICAgICBpZiggc3RyLm1hdGNoKCBydWxlc1sgaSBdWyAwIF0pKXtcbiAgICAgICAgICAgICAgaWYoIHJ1bGVzWyBpIF1bIDEgXSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoIHJ1bGVzWyBpIF1bIDAgXSwgcnVsZXNbIGkgXVsgMSBdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBsZXRzIHVzIGRldGVjdCBpZiBhbiBBcnJheSBjb250YWlucyBhIGdpdmVuIGVsZW1lbnQuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyciBUaGUgc3ViamVjdCBhcnJheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gT2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgQXJyYXkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tX2luZGV4IFN0YXJ0cyBjaGVja2luZyBmcm9tIHRoaXMgcG9zaXRpb24gaW4gdGhlIEFycmF5LihvcHRpb25hbClcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyZV9mdW5jIEZ1bmN0aW9uIHVzZWQgdG8gY29tcGFyZSBBcnJheSBpdGVtIHZzIHBhc3NlZCBpdGVtLihvcHRpb25hbClcbiAgICogQHJldHVybnMge051bWJlcn0gUmV0dXJuIGluZGV4IHBvc2l0aW9uIGluIHRoZSBBcnJheSBvZiB0aGUgcGFzc2VkIGl0ZW0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmRleE9mKFsgJ2hpJywndGhlcmUnIF0sICdndXlzJyApOyAvLyA9PT0gLTFcbiAgICogICAgIGluZmxlY3Rpb24uaW5kZXhPZihbICdoaScsJ3RoZXJlJyBdLCAnaGknICk7IC8vID09PSAwXG4gICAqL1xuICAgIGluZGV4T2YgOiBmdW5jdGlvbiAoIGFyciwgaXRlbSwgZnJvbV9pbmRleCwgY29tcGFyZV9mdW5jICl7XG4gICAgICBpZiggIWZyb21faW5kZXggKXtcbiAgICAgICAgZnJvbV9pbmRleCA9IC0xO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgIHZhciBpICAgICA9IGZyb21faW5kZXg7XG4gICAgICB2YXIgaiAgICAgPSBhcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBpZiggYXJyWyBpIF0gID09PSBpdGVtIHx8IGNvbXBhcmVfZnVuYyAmJiBjb21wYXJlX2Z1bmMoIGFyclsgaSBdLCBpdGVtICkpe1xuICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBwbHVyYWxpemF0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwbHVyYWwgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFNpbmd1bGFyIEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHBsdXJhbCBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAncGVyc29uJyApOyAvLyA9PT0gJ3Blb3BsZSdcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAnb2N0b3B1cycgKTsgLy8gPT09ICdvY3RvcGknXG4gICAqICAgICBpbmZsZWN0aW9uLnBsdXJhbGl6ZSggJ0hhdCcgKTsgLy8gPT09ICdIYXRzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdwZXJzb24nLCAnZ3V5cycgKTsgLy8gPT09ICdndXlzJ1xuICAgKi9cbiAgICBwbHVyYWxpemUgOiBmdW5jdGlvbiAoIHN0ciwgcGx1cmFsICl7XG4gICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBwbHVyYWxfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBwbHVyYWwgKTtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHNpbmd1bGFyaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2luZ3VsYXIgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFBsdXJhbCBFbmdsaXNoIGxhbmd1YWdlIG5vdW5zIGFyZSByZXR1cm5lZCBpbiBzaW5ndWxhciBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uc2luZ3VsYXJpemUoICdwZW9wbGUnICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ29jdG9waScgKTsgLy8gPT09ICdvY3RvcHVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ0hhdHMnICk7IC8vID09PSAnSGF0J1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ2d1eXMnLCAncGVyc29uJyApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICovXG4gICAgc2luZ3VsYXJpemUgOiBmdW5jdGlvbiAoIHN0ciwgc2luZ3VsYXIgKXtcbiAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHNpbmd1bGFyX3J1bGVzLCB1bmNvdW50YWJsZV93b3Jkcywgc2luZ3VsYXIgKTtcbiAgICB9LFxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBwbHVyYWxpemUgb3Igc2luZ3VsYXJsaXplIGEgU3RyaW5nIGFwcHJvcHJpYXRlbHkgYmFzZWQgb24gYW4gaW50ZWdlciB2YWx1ZVxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IFRoZSBudW1iZXIgdG8gYmFzZSBwbHVyYWxpemF0aW9uIG9mZiBvZi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpbmd1bGFyIE92ZXJyaWRlcyBub3JtYWwgb3V0cHV0IHdpdGggc2FpZCBTdHJpbmcuKG9wdGlvbmFsKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGx1cmFsIE92ZXJyaWRlcyBub3JtYWwgb3V0cHV0IHdpdGggc2FpZCBTdHJpbmcuKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBFbmdsaXNoIGxhbmd1YWdlIG5vdW5zIGFyZSByZXR1cm5lZCBpbiB0aGUgcGx1cmFsIG9yIHNpbmd1bGFyIGZvcm0gYmFzZWQgb24gdGhlIGNvdW50LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ3Blb3BsZScgMSApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ29jdG9waScgMSApOyAvLyA9PT0gJ29jdG9wdXMnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdIYXRzJyAxICk7IC8vID09PSAnSGF0J1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnZ3V5cycsIDEgLCAncGVyc29uJyApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ3BlcnNvbicsIDIgKTsgLy8gPT09ICdwZW9wbGUnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdvY3RvcHVzJywgMiApOyAvLyA9PT0gJ29jdG9waSdcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ0hhdCcsIDIgKTsgLy8gPT09ICdIYXRzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVyc29uJywgMiwgbnVsbCwgJ2d1eXMnICk7IC8vID09PSAnZ3V5cydcbiAgICovXG4gICAgaW5mbGVjdCA6IGZ1bmN0aW9uICggc3RyLCBjb3VudCwgc2luZ3VsYXIsIHBsdXJhbCApe1xuICAgICAgY291bnQgPSBwYXJzZUludCggY291bnQsIDEwICk7XG5cbiAgICAgIGlmKCBpc05hTiggY291bnQgKSkgcmV0dXJuIHN0cjtcblxuICAgICAgaWYoIGNvdW50ID09PSAwIHx8IGNvdW50ID4gMSApe1xuICAgICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBwbHVyYWxfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBwbHVyYWwgKTtcbiAgICAgIH1lbHNle1xuICAgICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBzaW5ndWxhcl9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHNpbmd1bGFyICk7XG4gICAgICB9XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBjYW1lbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBsb3dfZmlyc3RfbGV0dGVyIERlZmF1bHQgaXMgdG8gY2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSByZXN1bHRzLihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCBsb3dlcmNhc2UgaXQuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IExvd2VyIGNhc2UgdW5kZXJzY29yZWQgd29yZHMgd2lsbCBiZSByZXR1cm5lZCBpbiBjYW1lbCBjYXNlLlxuICAgKiAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxseSAnLycgaXMgdHJhbnNsYXRlZCB0byAnOjonXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5jYW1lbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlUHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uY2FtZWxpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZVByb3BlcnRpZXMnXG4gICAqL1xuICAgIGNhbWVsaXplIDogZnVuY3Rpb24gKCBzdHIsIGxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgIHZhciBzdHJfcGF0aCA9IHN0ci5zcGxpdCggJy8nICk7XG4gICAgICB2YXIgaSAgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgID0gc3RyX3BhdGgubGVuZ3RoO1xuICAgICAgdmFyIHN0cl9hcnIsIGluaXRfeCwgaywgbCwgZmlyc3Q7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIHN0cl9hcnIgPSBzdHJfcGF0aFsgaSBdLnNwbGl0KCAnXycgKTtcbiAgICAgICAgayAgICAgICA9IDA7XG4gICAgICAgIGwgICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcblxuICAgICAgICBmb3IoIDsgayA8IGw7IGsrKyApe1xuICAgICAgICAgIGlmKCBrICE9PSAwICl7XG4gICAgICAgICAgICBzdHJfYXJyWyBrIF0gPSBzdHJfYXJyWyBrIF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmaXJzdCA9IHN0cl9hcnJbIGsgXS5jaGFyQXQoIDAgKTtcbiAgICAgICAgICBmaXJzdCA9IGxvd19maXJzdF9sZXR0ZXIgJiYgaSA9PT0gMCAmJiBrID09PSAwXG4gICAgICAgICAgICA/IGZpcnN0LnRvTG93ZXJDYXNlKCkgOiBmaXJzdC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgIHN0cl9hcnJbIGsgXSA9IGZpcnN0ICsgc3RyX2FyclsgayBdLnN1YnN0cmluZyggMSApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyX3BhdGhbIGkgXSA9IHN0cl9hcnIuam9pbiggJycgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9wYXRoLmpvaW4oICc6OicgKTtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHVuZGVyc2NvcmUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGxfdXBwZXJfY2FzZSBEZWZhdWx0IGlzIHRvIGxvd2VyY2FzZSBhbmQgYWRkIHVuZGVyc2NvcmUgcHJlZml4LihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCByZXR1cm4gYXMgZW50ZXJlZC5cbiAgICogQHJldHVybnMge1N0cmluZ30gQ2FtZWwgY2FzZWQgd29yZHMgYXJlIHJldHVybmVkIGFzIGxvd2VyIGNhc2VkIGFuZCB1bmRlcnNjb3JlZC5cbiAgICogICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsbHkgJzo6JyBpcyB0cmFuc2xhdGVkIHRvICcvJy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdNZXNzYWdlUHJvcGVydGllcycgKTsgLy8gPT09ICdtZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdtZXNzYWdlUHJvcGVydGllcycgKTsgLy8gPT09ICdtZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdNUCcsIHRydWUgKTsgLy8gPT09ICdNUCdcbiAgICovXG4gICAgdW5kZXJzY29yZSA6IGZ1bmN0aW9uICggc3RyLCBhbGxfdXBwZXJfY2FzZSApe1xuICAgICAgaWYoIGFsbF91cHBlcl9jYXNlICYmIHN0ciA9PT0gc3RyLnRvVXBwZXJDYXNlKCkpIHJldHVybiBzdHI7XG5cbiAgICAgIHZhciBzdHJfcGF0aCA9IHN0ci5zcGxpdCggJzo6JyApO1xuICAgICAgdmFyIGkgICAgICAgID0gMDtcbiAgICAgIHZhciBqICAgICAgICA9IHN0cl9wYXRoLmxlbmd0aDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgc3RyX3BhdGhbIGkgXSA9IHN0cl9wYXRoWyBpIF0ucmVwbGFjZSggdXBwZXJjYXNlLCAnXyQxJyApO1xuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX3BhdGhbIGkgXS5yZXBsYWNlKCB1bmRlcmJhcl9wcmVmaXgsICcnICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJfcGF0aC5qb2luKCAnLycgKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgaHVtYW5pemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBsb3dfZmlyc3RfbGV0dGVyIERlZmF1bHQgaXMgdG8gY2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSByZXN1bHRzLihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCBsb3dlcmNhc2UgaXQuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IExvd2VyIGNhc2UgdW5kZXJzY29yZWQgd29yZHMgd2lsbCBiZSByZXR1cm5lZCBpbiBodW1hbml6ZWQgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmh1bWFuaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UgcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uaHVtYW5pemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBodW1hbml6ZSA6IGZ1bmN0aW9uICggc3RyLCBsb3dfZmlyc3RfbGV0dGVyICl7XG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCBpZF9zdWZmaXgsICcnICk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSggdW5kZXJiYXIsICcgJyApO1xuXG4gICAgICBpZiggIWxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgICAgc3RyID0gaW5mbGVjdG9yLmNhcGl0YWxpemUoIHN0ciApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgY2FwaXRhbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gQWxsIGNoYXJhY3RlcnMgd2lsbCBiZSBsb3dlciBjYXNlIGFuZCB0aGUgZmlyc3Qgd2lsbCBiZSB1cHBlci5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNhcGl0YWxpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZV9wcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5jYXBpdGFsaXplKCAnbWVzc2FnZSBwcm9wZXJ0aWVzJywgdHJ1ZSApOyAvLyA9PT0gJ01lc3NhZ2UgcHJvcGVydGllcydcbiAgICovXG4gICAgY2FwaXRhbGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcblxuICAgICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZyggMSApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHJlcGxhY2VzIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzIGluIHRoZSBzdHJpbmcuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXBsYWNlcyBhbGwgc3BhY2VzIG9yIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uZGFzaGVyaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2UtcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uZGFzaGVyaXplKCAnTWVzc2FnZSBQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UtUHJvcGVydGllcydcbiAgICovXG4gICAgZGFzaGVyaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSggc3BhY2Vfb3JfdW5kZXJiYXIsICctJyApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGl0bGVpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gQ2FwaXRhbGl6ZXMgd29yZHMgYXMgeW91IHdvdWxkIGZvciBhIGJvb2sgdGl0bGUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50aXRsZWl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlIFByb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnRpdGxlaXplKCAnbWVzc2FnZSBwcm9wZXJ0aWVzIHRvIGtlZXAnICk7IC8vID09PSAnTWVzc2FnZSBQcm9wZXJ0aWVzIHRvIEtlZXAnXG4gICAqL1xuICAgIHRpdGxlaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciAgICAgICAgID0gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSggdW5kZXJiYXIsICcgJyApO1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICcgJyApO1xuICAgICAgdmFyIGkgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcbiAgICAgIHZhciBkLCBrLCBsO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBkID0gc3RyX2FyclsgaSBdLnNwbGl0KCAnLScgKTtcbiAgICAgICAgayA9IDA7XG4gICAgICAgIGwgPSBkLmxlbmd0aDtcblxuICAgICAgICBmb3IoIDsgayA8IGw7IGsrKyl7XG4gICAgICAgICAgaWYoIGluZmxlY3Rvci5pbmRleE9mKCBub25fdGl0bGVjYXNlZF93b3JkcywgZFsgayBdLnRvTG93ZXJDYXNlKCkpIDwgMCApe1xuICAgICAgICAgICAgZFsgayBdID0gaW5mbGVjdG9yLmNhcGl0YWxpemUoIGRbIGsgXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RyX2FyclsgaSBdID0gZC5qb2luKCAnLScgKTtcbiAgICAgIH1cblxuICAgICAgc3RyID0gc3RyX2Fyci5qb2luKCAnICcgKTtcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZyggMSApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgZGVtb2R1bGl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZW1vdmVzIG1vZHVsZSBuYW1lcyBsZWF2aW5nIG9ubHkgY2xhc3MgbmFtZXMuKFJ1Ynkgc3R5bGUpXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5kZW1vZHVsaXplKCAnTWVzc2FnZTo6QnVzOjpQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ1Byb3BlcnRpZXMnXG4gICAqL1xuICAgIGRlbW9kdWxpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICc6OicgKTtcblxuICAgICAgcmV0dXJuIHN0cl9hcnJbIHN0cl9hcnIubGVuZ3RoIC0gMSBdO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGFibGVpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIGNhbWVsIGNhc2VkIHdvcmRzIGludG8gdGhlaXIgdW5kZXJzY29yZWQgcGx1cmFsIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50YWJsZWl6ZSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICB0YWJsZWl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IudW5kZXJzY29yZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IucGx1cmFsaXplKCBzdHIgKTtcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNsYXNzaWZpY2F0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFVuZGVyc2NvcmVkIHBsdXJhbCBub3VucyBiZWNvbWUgdGhlIGNhbWVsIGNhc2VkIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5jbGFzc2lmeSggJ21lc3NhZ2VfYnVzX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZUJ1c1Byb3BlcnR5J1xuICAgKi9cbiAgICBjbGFzc2lmeSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IuY2FtZWxpemUoIHN0ciApO1xuICAgICAgc3RyID0gaW5mbGVjdG9yLnNpbmd1bGFyaXplKCBzdHIgKTtcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGZvcmVpZ24ga2V5IHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZHJvcF9pZF91YmFyIERlZmF1bHQgaXMgdG8gc2VwZXJhdGUgaWQgd2l0aCBhbiB1bmRlcmJhciBhdCB0aGUgZW5kIG9mIHRoZSBjbGFzcyBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW91IGNhbiBwYXNzIHRydWUgdG8gc2tpcCBpdC4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFVuZGVyc2NvcmVkIHBsdXJhbCBub3VucyBiZWNvbWUgdGhlIGNhbWVsIGNhc2VkIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5mb3JlaWduX2tleSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0eV9pZCdcbiAgICogICAgIGluZmxlY3Rpb24uZm9yZWlnbl9rZXkoICdNZXNzYWdlQnVzUHJvcGVydHknLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZV9idXNfcHJvcGVydHlpZCdcbiAgICovXG4gICAgZm9yZWlnbl9rZXkgOiBmdW5jdGlvbiAoIHN0ciwgZHJvcF9pZF91YmFyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IuZGVtb2R1bGl6ZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IudW5kZXJzY29yZSggc3RyICkgKyAoKCBkcm9wX2lkX3ViYXIgKSA/ICggJycgKSA6ICggJ18nICkpICsgJ2lkJztcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIG9yZGluYWxpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIGFsbCBmb3VuZCBudW1iZXJzIHRoZWlyIHNlcXVlbmNlIGxpa2UgJzIybmQnLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24ub3JkaW5hbGl6ZSggJ3RoZSAxIHBpdGNoJyApOyAvLyA9PT0gJ3RoZSAxc3QgcGl0Y2gnXG4gICAqL1xuICAgIG9yZGluYWxpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICcgJyApO1xuICAgICAgdmFyIGkgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgdmFyIGsgPSBwYXJzZUludCggc3RyX2FyclsgaSBdLCAxMCApO1xuXG4gICAgICAgIGlmKCAhaXNOYU4oIGsgKSl7XG4gICAgICAgICAgdmFyIGx0ZCA9IHN0cl9hcnJbIGkgXS5zdWJzdHJpbmcoIHN0cl9hcnJbIGkgXS5sZW5ndGggLSAyICk7XG4gICAgICAgICAgdmFyIGxkICA9IHN0cl9hcnJbIGkgXS5zdWJzdHJpbmcoIHN0cl9hcnJbIGkgXS5sZW5ndGggLSAxICk7XG4gICAgICAgICAgdmFyIHN1ZiA9ICd0aCc7XG5cbiAgICAgICAgICBpZiggbHRkICE9ICcxMScgJiYgbHRkICE9ICcxMicgJiYgbHRkICE9ICcxMycgKXtcbiAgICAgICAgICAgIGlmKCBsZCA9PT0gJzEnICl7XG4gICAgICAgICAgICAgIHN1ZiA9ICdzdCc7XG4gICAgICAgICAgICB9ZWxzZSBpZiggbGQgPT09ICcyJyApe1xuICAgICAgICAgICAgICBzdWYgPSAnbmQnO1xuICAgICAgICAgICAgfWVsc2UgaWYoIGxkID09PSAnMycgKXtcbiAgICAgICAgICAgICAgc3VmID0gJ3JkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdHJfYXJyWyBpIF0gKz0gc3VmO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJfYXJyLmpvaW4oICcgJyApO1xuICAgIH0sXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gcGVyZm9ybXMgbXVsdGlwbGUgaW5mbGVjdGlvbiBtZXRob2RzIG9uIGEgc3RyaW5nXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnIgQW4gYXJyYXkgb2YgaW5mbGVjdGlvbiBtZXRob2RzLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24udHJhbnNmb3JtKCAnYWxsIGpvYicsIFsgJ3BsdXJhbGl6ZScsICdjYXBpdGFsaXplJywgJ2Rhc2hlcml6ZScgXSk7IC8vID09PSAnQWxsLWpvYnMnXG4gICAqL1xuICAgIHRyYW5zZm9ybSA6IGZ1bmN0aW9uICggc3RyLCBhcnIgKXtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHZhciBqID0gYXJyLmxlbmd0aDtcblxuICAgICAgZm9yKCA7aSA8IGo7IGkrKyApe1xuICAgICAgICB2YXIgbWV0aG9kID0gYXJyWyBpIF07XG5cbiAgICAgICAgaWYoIGluZmxlY3Rvci5oYXNPd25Qcm9wZXJ0eSggbWV0aG9kICkpe1xuICAgICAgICAgIHN0ciA9IGluZmxlY3RvclsgbWV0aG9kIF0oIHN0ciApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuICBpbmZsZWN0b3IudmVyc2lvbiA9ICcxLjEyLjAnO1xuXG4gIHJldHVybiBpbmZsZWN0b3I7XG59KSk7XG4iXX0=
