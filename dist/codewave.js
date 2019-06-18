(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoxHelper = void 0;

var _StringHelper = require("./helpers/StringHelper");

var _ArrayHelper = require("./helpers/ArrayHelper");

var _Pair = require("./positioning/Pair");

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
      return _StringHelper.StringHelper.repeatToLength(this.deco, len);
    }
  }, {
    key: "padding",
    value: function padding() {
      return _StringHelper.StringHelper.repeatToLength(" ", this.pad);
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
      return _StringHelper.StringHelper.repeatToLength(" ", this.indent) + this.wrapComment(this.deco + this.padding() + text + _StringHelper.StringHelper.repeatToLength(" ", this.width - this.removeIgnoredContent(text).length) + this.padding() + this.deco);
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
      return _StringHelper.StringHelper.getTxtSize(this.removeIgnoredContent(text));
    }
  }, {
    key: "getBoxForPos",
    value: function getBoxForPos(pos) {
      var _this = this;

      var clone, curLeft, depth, endFind, left, pair, placeholder, res, startFind;
      depth = this.getNestedLvl(pos.start);

      if (depth > 0) {
        left = this.left();
        curLeft = _StringHelper.StringHelper.repeat(left, depth - 1);
        clone = this.clone();
        placeholder = "###PlaceHolder###";
        clone.width = placeholder.length;
        clone.openText = clone.closeText = this.deco + this.deco + placeholder + this.deco + this.deco;
        startFind = RegExp(_StringHelper.StringHelper.escapeRegExp(curLeft + clone.startSep()).replace(placeholder, '.*'));
        endFind = RegExp(_StringHelper.StringHelper.escapeRegExp(curLeft + clone.endSep()).replace(placeholder, '.*'));
        pair = new _Pair.Pair(startFind, endFind, {
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
      rStart = new RegExp("(\\s*)(" + _StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentLeft(this.deco)) + ")(\\s*)");
      rEnd = new RegExp("(\\s*)(" + _StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentRight(this.deco)) + ")(\n|$)");
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
        ecl = _StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentLeft());
        ecr = _StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentRight());
        ed = _StringHelper.StringHelper.escapeRegExp(this.deco);
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimulatedClosingPromp = exports.ClosingPromp = void 0;

var _PosCollection = require("./positioning/PosCollection");

var _Replacement = require("./positioning/Replacement");

var _Pos = require("./positioning/Pos");

var _OptionalPromise = require("./helpers/OptionalPromise");

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
    this.selections = new _PosCollection.PosCollection(selections);
  }

  _createClass(ClosingPromp, [{
    key: "begin",
    value: function begin() {
      var _this = this;

      this.started = true;
      return (0, _OptionalPromise.optionalPromise)(this.addCarrets()).then(function () {
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
      var end, j, len, pos, repl, replacements, res, sel, selections, start;
      replacements = [];
      selections = this.getSelections();

      for (j = 0, len = selections.length; j < len; j++) {
        sel = selections[j];

        if (pos = this.whithinOpenBounds(sel)) {
          start = sel;
        } else if ((end = this.whithinCloseBounds(sel)) && start != null) {
          res = end.withEditor(this.codewave.editor).innerText().split(' ')[0];
          repl = new _Replacement.Replacement(end.innerStart, end.innerEnd, res);
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
      var end, j, len, pos, replacements, sel, start;
      replacements = [];
      start = null;

      for (j = 0, len = selections.length; j < len; j++) {
        sel = selections[j];

        if (pos = this.whithinOpenBounds(sel)) {
          start = pos;
        } else if ((end = this.whithinCloseBounds(sel)) && start != null) {
          replacements.push(new _Replacement.Replacement(start.start, end.end, this.codewave.editor.textSubstr(start.end + 1, end.start - 1)).selectContent());
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
      return new _Pos.Pos(this.replacements[index].selections[0].start + this.typed().length * (index * 2), this.replacements[index].selections[0].end + this.typed().length * (index * 2 + 1)).wrappedBy(this.codewave.brakets, this.codewave.brakets);
    }
  }, {
    key: "endPosAt",
    value: function endPosAt(index) {
      return new _Pos.Pos(this.replacements[index].selections[1].start + this.typed().length * (index * 2 + 1), this.replacements[index].selections[1].end + this.typed().length * (index * 2 + 2)).wrappedBy(this.codewave.brakets + this.codewave.closeChar, this.codewave.brakets);
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
          repl = new _Replacement.Replacement(curClose.start, curClose.end, targetText);

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CmdFinder = void 0;

var _Context = require("./Context");

var _NamespaceHelper = require("./helpers/NamespaceHelper");

var _Command = require("./Command");

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
      root: _Command.Command.cmds,
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
      this.context = new _Context.Context(this.codewave);
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

        var _NamespaceHelper$Name = _NamespaceHelper.NamespaceHelper.splitFirst(name);

        var _NamespaceHelper$Name2 = _slicedToArray(_NamespaceHelper$Name, 2);

        space = _NamespaceHelper$Name2[0];
        rest = _NamespaceHelper$Name2[1];

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

      var _NamespaceHelper$Name3 = _NamespaceHelper.NamespaceHelper.splitFirst(namespace, true);

      var _NamespaceHelper$Name4 = _slicedToArray(_NamespaceHelper$Name3, 2);

      space = _NamespaceHelper$Name4[0];
      rest = _NamespaceHelper$Name4[1];
      return this.names.map(function (name) {
        var cur_rest, cur_space;

        var _NamespaceHelper$Name5 = _NamespaceHelper.NamespaceHelper.splitFirst(name);

        var _NamespaceHelper$Name6 = _slicedToArray(_NamespaceHelper$Name5, 2);

        cur_space = _NamespaceHelper$Name6[0];
        cur_rest = _NamespaceHelper$Name6[1];

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

        var _NamespaceHelper$Name7 = _NamespaceHelper.NamespaceHelper.splitFirst(nspc, true);

        var _NamespaceHelper$Name8 = _slicedToArray(_NamespaceHelper$Name7, 2);

        nspcName = _NamespaceHelper$Name8[0];
        rest = _NamespaceHelper$Name8[1];
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CmdInstance = void 0;

var _Context = require("./Context");

var _Codewave = require("./Codewave");

var _TextParser = require("./TextParser");

var _StringHelper = require("./helpers/StringHelper");

var _OptionalPromise = require("./helpers/OptionalPromise");

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
        this.context = new _Context.Context();
      }

      return this.context || new _Context.Context();
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
        return (0, _OptionalPromise.optionalPromise)(this.rawResult()).then(function (res) {
          var alterFunct, parser;

          if (res != null) {
            res = _this.formatIndent(res);

            if (res.length > 0 && _this.getOption('parse', _this)) {
              parser = _this.getParserForText(res);
              res = parser.parseAll();
            }

            if (alterFunct = _this.getOption('alterResult', _this)) {
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
      parser = new _Codewave.Codewave(new _TextParser.TextParser(txt), {
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
      return _StringHelper.StringHelper.indentNotFirst(text, this.getIndent(), " ");
    }
  }]);

  return CmdInstance;
}();

exports.CmdInstance = CmdInstance;

},{"./Codewave":5,"./Context":7,"./TextParser":16,"./helpers/OptionalPromise":32,"./helpers/StringHelper":34}],5:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Codewave = void 0;

var _Process = require("./Process");

var _Context = require("./Context");

var _PositionedCmdInstance = require("./PositionedCmdInstance");

var _TextParser = require("./TextParser");

var _Command = require("./Command");

var _Logger = require("./Logger");

var _PosCollection = require("./positioning/PosCollection");

var _StringHelper = require("./helpers/StringHelper");

var _ClosingPromp = require("./ClosingPromp");

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

      this.context = new _Context.Context(this);

      if (this.inInstance != null) {
        this.context.parent = this.inInstance.context;
      }

      this.logger = new _Logger.Logger();
    }

    _createClass(Codewave, [{
      key: "onActivationKey",
      value: function onActivationKey() {
        var _this = this;

        this.process = new _Process.Process();
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

        return new _PositionedCmdInstance.PositionedCmdInstance(this, prev, this.editor.textSubstr(prev, next + this.brakets.length));
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
              return new _PositionedCmdInstance.PositionedCmdInstance(this, beginning, this.editor.textSubstr(beginning, f.pos + this.brakets.length));
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
        var closingPrefix, cmd, cpos, p;
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
        pos = new _PosCollection.PosCollection(pos);
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

        return this.closingPromp = _ClosingPromp.ClosingPromp.newFor(this, selections).begin();
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
            parser = new Codewave(new _TextParser.TextParser(cmd.content), {
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
        return _StringHelper.StringHelper.removeCarret(txt, this.carretChar);
      }
    }, {
      key: "getCarretPos",
      value: function getCarretPos(txt) {
        return _StringHelper.StringHelper.getCarretPos(txt, this.carretChar);
      }
    }, {
      key: "regMarker",
      value: function regMarker() {
        var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "g";
        return new RegExp(_StringHelper.StringHelper.escapeRegExp(this.marker), flags);
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

          _Command.Command.initCmds();

          return _Command.Command.loadCmds();
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseCommand = exports.Command = void 0;

var _Context = require("./Context");

var _Storage = require("./Storage");

var _NamespaceHelper = require("./helpers/NamespaceHelper");

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
          context = new _Context.Context();
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
          context = new _Context.Context();
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

        var _NamespaceHelper$Name = _NamespaceHelper.NamespaceHelper.splitFirst(fullname);

        var _NamespaceHelper$Name2 = _slicedToArray(_NamespaceHelper$Name, 2);

        space = _NamespaceHelper$Name2[0];
        name = _NamespaceHelper$Name2[1];

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

        var _NamespaceHelper$Name3 = _NamespaceHelper.NamespaceHelper.splitFirst(fullname);

        var _NamespaceHelper$Name4 = _slicedToArray(_NamespaceHelper$Name3, 2);

        space = _NamespaceHelper$Name4[0];
        name = _NamespaceHelper$Name4[1];

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
  Command.storage = new _Storage.Storage();
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = void 0;

var _CmdFinder = require("./CmdFinder");

var _CmdInstance = require("./CmdInstance");

var _ArrayHelper = require("./helpers/ArrayHelper");

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

        this._namespaces = _ArrayHelper.ArrayHelper.unique(npcs);
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
      return new _CmdFinder.CmdFinder(cmdName, Object.assign({
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
      return new _CmdInstance.CmdInstance(cmd, this);
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

},{"./CmdFinder":3,"./CmdInstance":4,"./helpers/ArrayHelper":29}],8:[function(require,module,exports){
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditCmdProp = void 0;

var _Command = require("./Command");

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
      return cmds[this.name] = _Command.Command.makeVarCmd(this.name);
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
      return cmds[this.name] = _Command.Command.makeVarCmd(this.name, {
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
      return cmds[this.name] = _Command.Command.makeBoolVarCmd(this.name);
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
      return cmds[this.name] = _Command.Command.makeBoolVarCmd(this.name);
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = void 0;

var _Pos = require("./positioning/Pos");

var _StrPos = require("./positioning/StrPos");

var _OptionalPromise = require("./helpers/OptionalPromise");

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
      return new _Pos.Pos(this.findLineStart(pos), this.findLineEnd(pos));
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
        return new _StrPos.StrPos(direction > 0 ? bestPos + start : bestPos, bestStr);
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
          return (0, _OptionalPromise.optionalPromise)(repl.apply()).then(function () {
            return {
              selections: opt.selections.concat(repl.selections),
              offset: opt.offset + repl.offsetAfter(_this)
            };
          });
        });
      }, (0, _OptionalPromise.optionalPromise)({
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptionObject = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PositionedCmdInstance = void 0;

var _CmdInstance = require("./CmdInstance");

var _BoxHelper = require("./BoxHelper");

var _ParamParser = require("./stringParsers/ParamParser");

var _Pos = require("./positioning/Pos");

var _StrPos = require("./positioning/StrPos");

var _Replacement = require("./positioning/Replacement");

var _StringHelper = require("./helpers/StringHelper");

var _NamespaceHelper = require("./helpers/NamespaceHelper");

var _Command = require("./Command");

var _OptionalPromise = require("./helpers/OptionalPromise");

var PositionedCmdInstance =
/*#__PURE__*/
function (_CmdInstance$CmdInsta) {
  _inherits(PositionedCmdInstance, _CmdInstance$CmdInsta);

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
        this.closingPos = new _StrPos.StrPos(this.pos, this.str);
        this.pos = f.pos;
        return this.str = f.str;
      }
    }
  }, {
    key: "_findOpeningPos",
    value: function _findOpeningPos() {
      var closing, cmdName, f, opening;
      cmdName = this._removeBracket(this.str).substring(this.codewave.closeChar.length);
      opening = this.codewave.brakets + cmdName;
      closing = this.str;

      if (f = this.codewave.findMatchingPair(this.pos, opening, closing, -1)) {
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
      parser = new _ParamParser.ParamParser(params, {
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
      var f;

      if (f = this._findClosingPos()) {
        this.content = _StringHelper.StringHelper.trimEmptyLine(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos));
        return this.str = this.codewave.editor.textSubstr(this.pos, f.pos + f.str.length);
      }
    }
  }, {
    key: "_findClosingPos",
    value: function _findClosingPos() {
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
        ecl = _StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentLeft());
        ecr = _StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentRight());
        ed = _StringHelper.StringHelper.escapeRegExp(this.codewave.deco);
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

      var _NamespaceHelper$Name = _NamespaceHelper.NamespaceHelper.split(this.cmdName);

      var _NamespaceHelper$Name2 = _slicedToArray(_NamespaceHelper$Name, 2);

      nspc = _NamespaceHelper$Name2[0];
      cmdName = _NamespaceHelper$Name2[1];
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

      var beforeFunct;

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
          return (0, _OptionalPromise.optionalPromise)(this.result()).then(function (res) {
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
      return new _Pos.Pos(this.pos, this.pos + this.str.length).withEditor(this.codewave.editor);
    }
  }, {
    key: "getOpeningPos",
    value: function getOpeningPos() {
      return new _Pos.Pos(this.pos, this.pos + this.opening.length).withEditor(this.codewave.editor);
    }
  }, {
    key: "getIndent",
    value: function getIndent() {
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
      helper = new _BoxHelper.BoxHelper(this.context);
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
      return this.applyReplacement(new _Replacement.Replacement(this.pos, this.getEndPos(), text));
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
      repl.selections = [new _Pos.Pos(cursorPos, cursorPos)];
      replacements = this.checkMulti(repl);
      this.replaceStart = repl.start;
      this.replaceEnd = repl.resEnd();
      return this.codewave.editor.applyReplacements(replacements);
    }
  }]);

  return PositionedCmdInstance;
}(_CmdInstance.CmdInstance);

exports.PositionedCmdInstance = PositionedCmdInstance;

},{"./BoxHelper":1,"./CmdInstance":4,"./Command":6,"./helpers/NamespaceHelper":31,"./helpers/OptionalPromise":32,"./helpers/StringHelper":34,"./positioning/Pos":37,"./positioning/Replacement":39,"./positioning/StrPos":41,"./stringParsers/ParamParser":49}],13:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Process = void 0;

var Process = function Process() {
  _classCallCheck(this, Process);
};

exports.Process = Process;

},{}],14:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Storage = void 0;

var _Logger = require("./Logger");

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
        this.logger = this.logger || new _Logger.Logger();
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextAreaEditor = exports.DomKeyListener = void 0;

var _TextParser = require("./TextParser");

var _Pos = require("./positioning/Pos");

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
  function (_TextParser$TextParse) {
    _inherits(TextAreaEditor, _TextParser$TextParse);

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
            return new _Pos.Pos(this.obj.selectionStart, this.obj.selectionEnd);
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
            pos = new _Pos.Pos(0, len);

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
          this.tmpCursorPos = new _Pos.Pos(start, end);
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
  }(_TextParser.TextParser);

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextParser = void 0;

var _Editor = require("./Editor");

var _Pos = require("./positioning/Pos");

var TextParser =
/*#__PURE__*/
function (_Editor$Editor) {
  _inherits(TextParser, _Editor$Editor);

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

      return this.target = new _Pos.Pos(start, end);
    }
  }]);

  return TextParser;
}(_Editor.Editor);

exports.TextParser = TextParser;

},{"./Editor":9,"./positioning/Pos":37}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Codewave", {
  enumerable: true,
  get: function get() {
    return _Codewave.Codewave;
  }
});

var _Codewave = require("./Codewave");

var _Command = require("./Command");

var _CoreCommandProvider = require("./cmds/CoreCommandProvider");

var _JsCommandProvider = require("./cmds/JsCommandProvider");

var _PhpCommandProvider = require("./cmds/PhpCommandProvider");

var _HtmlCommandProvider = require("./cmds/HtmlCommandProvider");

var _FileCommandProvider = require("./cmds/FileCommandProvider");

var _StringCommandProvider = require("./cmds/StringCommandProvider");

var _Pos = require("./positioning/Pos");

var _WrappedPos = require("./positioning/WrappedPos");

var _LocalStorageEngine = require("./storageEngines/LocalStorageEngine");

_Pos.Pos.wrapClass = _WrappedPos.WrappedPos;
_Codewave.Codewave.instances = [];
_Command.Command.providers = [new _CoreCommandProvider.CoreCommandProvider(), new _JsCommandProvider.JsCommandProvider(), new _PhpCommandProvider.PhpCommandProvider(), new _HtmlCommandProvider.HtmlCommandProvider(), new _FileCommandProvider.FileCommandProvider(), new _StringCommandProvider.StringCommandProvider()];

if (typeof localStorage !== "undefined" && localStorage !== null) {
  _Command.Command.storage = new _LocalStorageEngine.LocalStorageEngine();
}

},{"./Codewave":5,"./Command":6,"./cmds/CoreCommandProvider":18,"./cmds/FileCommandProvider":19,"./cmds/HtmlCommandProvider":20,"./cmds/JsCommandProvider":21,"./cmds/PhpCommandProvider":22,"./cmds/StringCommandProvider":23,"./positioning/Pos":37,"./positioning/WrappedPos":42,"./storageEngines/LocalStorageEngine":44}],18:[function(require,module,exports){
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreCommandProvider = void 0;

var _Command = require("../Command");

var _LangDetector = require("../detectors/LangDetector");

var _AlwaysEnabled = require("../detectors/AlwaysEnabled");

var _BoxHelper = require("../BoxHelper");

var _EditCmdProp = require("../EditCmdProp");

var _StringHelper = require("../helpers/StringHelper");

var _PathHelper = require("../helpers/PathHelper");

var _Replacement = require("../positioning/Replacement");

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
      core = cmds.addCmd(new _Command.Command('core'));
      cmds.addDetector(new _AlwaysEnabled.AlwaysEnabled('core'));
      core.addDetector(new _LangDetector.LangDetector());
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
  reg = new RegExp("^(" + _StringHelper.StringHelper.escapeRegExp(instance.codewave.brakets) + ')' + _StringHelper.StringHelper.escapeRegExp(instance.codewave.noExecuteChar));
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
    storage = _Command.Command.storage;
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

        _Command.Command.cmds.setCmdData(newName, cmdData);

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
        storage = _Command.Command.storage;
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

      _Command.Command.saveCmd(alias, {
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
    cmd = nspc === "_root" ? _Command.Command.cmds : context.getCmd(nspc, {
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
  res = _PathHelper.PathHelper.getPath(instance.codewave.vars, name);

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

  _PathHelper.PathHelper.setPath(instance.codewave.vars, name, val);

  return '';
};

storeJsonCommand = function storeJsonCommand(instance) {
  var name, p, val;
  name = instance.getParam([0, 'name']);
  val = (p = instance.getParam([1, 'json'])) != null ? p : instance.content ? instance.content : void 0;

  _PathHelper.PathHelper.setPath(instance.codewave.vars, name, JSON.parse(val));

  return '';
};

getParam = function getParam(instance) {
  if (instance.codewave.inInstance != null) {
    return instance.codewave.inInstance.getParam(instance.params, instance.getParam(['def', 'default']));
  }
};

BoxCmd =
/*#__PURE__*/
function (_Command$BaseCommand) {
  _inherits(BoxCmd, _Command$BaseCommand);

  function BoxCmd() {
    _classCallCheck(this, BoxCmd);

    return _possibleConstructorReturn(this, _getPrototypeOf(BoxCmd).apply(this, arguments));
  }

  _createClass(BoxCmd, [{
    key: "init",
    value: function init() {
      this.helper = new _BoxHelper.BoxHelper(this.instance.context);
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
}(_Command.BaseCommand);

CloseCmd =
/*#__PURE__*/
function (_Command$BaseCommand2) {
  _inherits(CloseCmd, _Command$BaseCommand2);

  function CloseCmd() {
    _classCallCheck(this, CloseCmd);

    return _possibleConstructorReturn(this, _getPrototypeOf(CloseCmd).apply(this, arguments));
  }

  _createClass(CloseCmd, [{
    key: "init",
    value: function init() {
      return this.helper = new _BoxHelper.BoxHelper(this.instance.context);
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

        return this.instance.applyReplacement(new _Replacement.Replacement(box.start, box.end, ''));
      } else {
        return this.instance.replaceWith('');
      }
    }
  }]);

  return CloseCmd;
}(_Command.BaseCommand);

EditCmd =
/*#__PURE__*/
function (_Command$BaseCommand3) {
  _inherits(EditCmd, _Command$BaseCommand3);

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

      _Command.Command.saveCmd(this.cmdName, data);

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
}(_Command.BaseCommand);

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

EditCmd.props = [new _EditCmdProp.EditCmdProp.revBool('no_carret', {
  opt: 'checkCarret'
}), new _EditCmdProp.EditCmdProp.revBool('no_parse', {
  opt: 'parse'
}), new _EditCmdProp.EditCmdProp.bool('prevent_parse_all', {
  opt: 'preventParseAll'
}), new _EditCmdProp.EditCmdProp.bool('replace_box', {
  opt: 'replaceBox'
}), new _EditCmdProp.EditCmdProp.string('name_to_param', {
  opt: 'nameToParam'
}), new _EditCmdProp.EditCmdProp.string('alias_of', {
  "var": 'aliasOf',
  carret: true
}), new _EditCmdProp.EditCmdProp.source('help', {
  funct: 'help',
  showEmpty: true
}), new _EditCmdProp.EditCmdProp.source('source', {
  "var": 'resultStr',
  dataName: 'result',
  showEmpty: true,
  carret: true
})];

NameSpaceCmd =
/*#__PURE__*/
function (_Command$BaseCommand4) {
  _inherits(NameSpaceCmd, _Command$BaseCommand4);

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
}(_Command.BaseCommand);

TemplateCmd =
/*#__PURE__*/
function (_Command$BaseCommand5) {
  _inherits(TemplateCmd, _Command$BaseCommand5);

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
      data = this.name ? _PathHelper.PathHelper.getPath(this.instance.codewave.vars, this.name) : this.instance.codewave.vars;

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
}(_Command.BaseCommand);

EmmetCmd =
/*#__PURE__*/
function (_Command$BaseCommand6) {
  _inherits(EmmetCmd, _Command$BaseCommand6);

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
}(_Command.BaseCommand);

},{"../BoxHelper":1,"../Command":6,"../EditCmdProp":8,"../detectors/AlwaysEnabled":24,"../detectors/LangDetector":26,"../helpers/PathHelper":33,"../helpers/StringHelper":34,"../positioning/Replacement":39,"emmet":"emmet"}],19:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileCommandProvider = void 0;

var _Command = require("../Command");

var _BoxHelper = require("../BoxHelper");

var _EditCmdProp = require("../EditCmdProp");

var _StringHelper = require("../helpers/StringHelper");

var _PathHelper = require("../helpers/PathHelper");

var _Replacement = require("../positioning/Replacement");

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
      core = cmds.addCmd(new _Command.Command('file'));
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HtmlCommandProvider = void 0;

var _Command = require("../Command");

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
      html = cmds.addCmd(new _Command.Command('html'));
      html.addCmds({
        'fallback': {
          'aliasOf': 'core:emmet',
          'defaults': {
            'lang': 'html'
          },
          'nameToParam': 'abbr'
        }
      });
      css = cmds.addCmd(new _Command.Command('css'));
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsCommandProvider = void 0;

var _Command = require("../Command");

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
      js = cmds.addCmd(new _Command.Command('js'));
      cmds.addCmd(new _Command.Command('javascript', {
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhpCommandProvider = void 0;

var _StringHelper = require("../helpers/StringHelper");

var _Command = require("../Command");

var _PairDetector = require("../detectors/PairDetector");

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
      php = cmds.addCmd(new _Command.Command('php'));
      php.addDetector(new _PairDetector.PairDetector({
        result: 'php:inner',
        opener: '<?php',
        closer: '?>',
        optionnal_end: true,
        'else': 'php:outer'
      }));
      phpOuter = php.addCmd(new _Command.Command('outer'));
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
      phpInner = php.addCmd(new _Command.Command('inner'));
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
    return '<?php\n' + _StringHelper.StringHelper.indent(result) + '\n?>';
  }
}; // closePhpForContent = (instance) ->
//   instance.content = ' ?>'+(instance.content || '')+'<?php '

},{"../Command":6,"../detectors/PairDetector":27,"../helpers/StringHelper":34}],23:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringCommandProvider = void 0;

var _Command = require("../Command");

var _AlwaysEnabled = require("../detectors/AlwaysEnabled");

var inflection = _interopRequireWildcard(require("inflection"));

function _interopRequireWildcard(obj) {
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
      cmds = root.addCmd(new _Command.Command('string'));
      root.addCmd(new _Command.Command('str', {
        aliasOf: 'string'
      }));
      root.addDetector(new _AlwaysEnabled.AlwaysEnabled('string'));
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlwaysEnabled = void 0;

var _Detector = require("./Detector");

var AlwaysEnabled =
/*#__PURE__*/
function (_Detector$Detector) {
  _inherits(AlwaysEnabled, _Detector$Detector);

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
}(_Detector.Detector);

exports.AlwaysEnabled = AlwaysEnabled;

},{"./Detector":25}],25:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Detector = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LangDetector = void 0;

var _Detector = require("./Detector");

var LangDetector =
/*#__PURE__*/
function (_Detector$Detector) {
  _inherits(LangDetector, _Detector$Detector);

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
}(_Detector.Detector);

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PairDetector = void 0;

var _Pair = require("../positioning/Pair");

var _Detector = require("./Detector");

var PairDetector =
/*#__PURE__*/
function (_Detector$Detector) {
  _inherits(PairDetector, _Detector$Detector);

  function PairDetector() {
    _classCallCheck(this, PairDetector);

    return _possibleConstructorReturn(this, _getPrototypeOf(PairDetector).apply(this, arguments));
  }

  _createClass(PairDetector, [{
    key: "detected",
    value: function detected(finder) {
      var pair;

      if (this.data.opener != null && this.data.closer != null && finder.instance != null) {
        pair = new _Pair.Pair(this.data.opener, this.data.closer, this.data);

        if (pair.isWapperOf(finder.instance.getPos(), finder.codewave.editor.text())) {
          return true;
        }
      }

      return false;
    }
  }]);

  return PairDetector;
}(_Detector.Detector);

exports.PairDetector = PairDetector;

},{"../positioning/Pair":35,"./Detector":25}],28:[function(require,module,exports){
"use strict";

var _bootstrap = require("./bootstrap");

var _TextAreaEditor = require("./TextAreaEditor");

_bootstrap.Codewave.detect = function (target) {
  var cw;
  cw = new _bootstrap.Codewave(new _TextAreaEditor.TextAreaEditor(target));

  _bootstrap.Codewave.instances.push(cw);

  return cw;
};

_bootstrap.Codewave.require = require;
window.Codewave = _bootstrap.Codewave;

},{"./TextAreaEditor":15,"./bootstrap":17}],29:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrayHelper = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommonHelper = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NamespaceHelper = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionalPromise = exports.OptionalPromise = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PathHelper = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringHelper = void 0;

var _Size = require("../positioning/Size");

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

      return new _Size.Size(w, lines.length - 1);
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pair = void 0;

var _Pos = require("./Pos");

var _StringHelper = require("../helpers/StringHelper");

var _PairMatch = require("./PairMatch");

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
        return new RegExp(_StringHelper.StringHelper.escapeRegExp(this.opener));
      } else {
        return this.opener;
      }
    }
  }, {
    key: "closerReg",
    value: function closerReg() {
      if (typeof this.closer === 'string') {
        return new RegExp(_StringHelper.StringHelper.escapeRegExp(this.closer));
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
        return new _PairMatch.PairMatch(this, match, offset);
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
          return new _Pos.Pos(start.start(), end.end());
        } else if (this.optionnal_end) {
          return new _Pos.Pos(start.start(), text.length);
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PairMatch = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pos = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PosCollection = void 0;

var _Wrapping = require("./Wrapping");

var _Replacement = require("./Replacement");

var _CommonHelper = require("../helpers/CommonHelper");

var PosCollection =
/*#__PURE__*/
function () {
  function PosCollection(arr) {
    _classCallCheck(this, PosCollection);

    if (!Array.isArray(arr)) {
      arr = [arr];
    }

    _CommonHelper.CommonHelper.applyMixins(arr, [PosCollection]);

    return arr;
  }

  _createClass(PosCollection, [{
    key: "wrap",
    value: function wrap(prefix, suffix) {
      return this.map(function (p) {
        return new _Wrapping.Wrapping(p.start, p.end, prefix, suffix);
      });
    }
  }, {
    key: "replace",
    value: function replace(txt) {
      return this.map(function (p) {
        return new _Replacement.Replacement(p.start, p.end, txt);
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Replacement = void 0;

var _Pos = require("./Pos");

var _CommonHelper = require("../helpers/CommonHelper");

var _OptionObject = require("../OptionObject");

var _StringHelper = require("../helpers/StringHelper");

var Replacement = function () {
  var Replacement =
  /*#__PURE__*/
  function (_Pos$Pos) {
    _inherits(Replacement, _Pos$Pos);

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
        this.selections = [new _Pos.Pos(this.prefix.length + this.start, this.prefix.length + this.start + this.text.length)];
        return this;
      }
    }, {
      key: "carretToSel",
      value: function carretToSel() {
        var pos, res, start, text;
        this.selections = [];
        text = this.finalText();
        this.prefix = _StringHelper.StringHelper.removeCarret(this.prefix);
        this.text = _StringHelper.StringHelper.removeCarret(this.text);
        this.suffix = _StringHelper.StringHelper.removeCarret(this.suffix);
        start = this.start;

        while ((res = _StringHelper.StringHelper.getAndRemoveFirstCarret(text)) != null) {
          var _res = res;

          var _res2 = _slicedToArray(_res, 2);

          pos = _res2[0];
          text = _res2[1];
          this.selections.push(new _Pos.Pos(start + pos, start + pos));
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
  }(_Pos.Pos);

  ;

  _CommonHelper.CommonHelper.applyMixins(Replacement.prototype, [_OptionObject.OptionObject]);

  return Replacement;
}.call(void 0);

exports.Replacement = Replacement;

},{"../OptionObject":11,"../helpers/CommonHelper":30,"../helpers/StringHelper":34,"./Pos":37}],40:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Size = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StrPos = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WrappedPos = void 0;

var _Pos = require("./Pos");

var WrappedPos =
/*#__PURE__*/
function (_Pos$Pos) {
  _inherits(WrappedPos, _Pos$Pos);

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
}(_Pos.Pos);

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapping = void 0;

var _Replacement = require("./Replacement");

var Wrapping =
/*#__PURE__*/
function (_Replacement$Replacem) {
  _inherits(Wrapping, _Replacement$Replacem);

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
}(_Replacement.Replacement);

exports.Wrapping = Wrapping;

},{"./Replacement":39}],44:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalStorageEngine = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = void 0;

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EscapeContext = void 0;

var _Context = require("./Context");

var EscapeContext =
/*#__PURE__*/
function (_Context$Context) {
  _inherits(EscapeContext, _Context$Context);

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
}(_Context.Context);

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NamedContext = void 0;

var _ParamContext = require("./ParamContext");

var indexOf = [].indexOf;

var NamedContext =
/*#__PURE__*/
function (_ParamContext$ParamCo) {
  _inherits(NamedContext, _ParamContext$ParamCo);

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
}(_ParamContext.ParamContext);

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParamContext = void 0;

var _Context = require("./Context");

var _StringContext = require("./StringContext");

var _VariableContext = require("./VariableContext");

var ParamContext =
/*#__PURE__*/
function (_Context$Context) {
  _inherits(ParamContext, _Context$Context);

  function ParamContext() {
    _classCallCheck(this, ParamContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(ParamContext).apply(this, arguments));
  }

  _createClass(ParamContext, [{
    key: "onChar",
    value: function onChar(_char) {
      if (this.testContext(_StringContext.StringContext)) {} else if (this.testContext(ParamContext.named)) {} else if (this.testContext(_VariableContext.VariableContext)) {} else if (_char === ' ') {
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
}(_Context.Context);

exports.ParamContext = ParamContext;

},{"./Context":45,"./StringContext":50,"./VariableContext":51}],49:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParamParser = void 0;

var _ParamContext = require("./ParamContext");

var _NamedContext = require("./NamedContext");

_ParamContext.ParamContext.named = _NamedContext.NamedContext;

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
        this.setContext(new _ParamContext.ParamContext(this));
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringContext = void 0;

var _Context = require("./Context");

var _EscapeContext = require("./EscapeContext");

var _VariableContext = require("./VariableContext");

var StringContext =
/*#__PURE__*/
function (_Context$Context) {
  _inherits(StringContext, _Context$Context);

  function StringContext() {
    _classCallCheck(this, StringContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(StringContext).apply(this, arguments));
  }

  _createClass(StringContext, [{
    key: "onChar",
    value: function onChar(_char) {
      if (this.testContext(_EscapeContext.EscapeContext)) {} else if (this.testContext(_VariableContext.VariableContext)) {} else if (StringContext.isDelimiter(_char)) {
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
}(_Context.Context);

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VariableContext = void 0;

var _Context = require("./Context");

var VariableContext =
/*#__PURE__*/
function (_Context$Context) {
  _inherits(VariableContext, _Context$Context);

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
}(_Context.Context);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvQm94SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9Cb3hIZWxwZXIuanMiLCIuLi9zcmMvQ2xvc2luZ1Byb21wLmNvZmZlZSIsIi4uL3NyYy9DbG9zaW5nUHJvbXAuanMiLCIuLi9zcmMvQ21kRmluZGVyLmNvZmZlZSIsIi4uL3NyYy9DbWRGaW5kZXIuanMiLCIuLi9zcmMvQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL0NtZEluc3RhbmNlLmpzIiwiLi4vc3JjL0NvZGV3YXZlLmNvZmZlZSIsIi4uL3NyYy9Db2Rld2F2ZS5qcyIsIi4uL3NyYy9Db21tYW5kLmNvZmZlZSIsIi4uL3NyYy9Db21tYW5kLmpzIiwiLi4vc3JjL0NvbnRleHQuY29mZmVlIiwiLi4vc3JjL0NvbnRleHQuanMiLCIuLi9zcmMvRWRpdENtZFByb3AuY29mZmVlIiwiLi4vc3JjL0VkaXRDbWRQcm9wLmpzIiwiLi4vc3JjL0VkaXRvci5jb2ZmZWUiLCIuLi9zcmMvRWRpdG9yLmpzIiwiLi4vc3JjL0xvZ2dlci5jb2ZmZWUiLCIuLi9zcmMvTG9nZ2VyLmpzIiwiLi4vc3JjL09wdGlvbk9iamVjdC5jb2ZmZWUiLCIuLi9zcmMvT3B0aW9uT2JqZWN0LmpzIiwiLi4vc3JjL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5jb2ZmZWUiLCIuLi9zcmMvUG9zaXRpb25lZENtZEluc3RhbmNlLmpzIiwiLi4vc3JjL1Byb2Nlc3MuY29mZmVlIiwiLi4vc3JjL1N0b3JhZ2UuY29mZmVlIiwiLi4vc3JjL1N0b3JhZ2UuanMiLCIuLi9zcmMvVGV4dEFyZWFFZGl0b3IuY29mZmVlIiwiLi4vc3JjL1RleHRBcmVhRWRpdG9yLmpzIiwiLi4vc3JjL1RleHRQYXJzZXIuY29mZmVlIiwiLi4vc3JjL1RleHRQYXJzZXIuanMiLCIuLi9zcmMvYm9vdHN0cmFwLmNvZmZlZSIsIi4uL3NyYy9ib290c3RyYXAuanMiLCIuLi9zcmMvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmNvZmZlZSIsIi4uL3NyYy9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9GaWxlQ29tbWFuZFByb3ZpZGVyLmNvZmZlZSIsIi4uL3NyYy9jbWRzL0ZpbGVDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyLmNvZmZlZSIsIi4uL3NyYy9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5qcyIsIi4uL3NyYy9jbWRzL1BocENvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9QaHBDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9TdHJpbmdDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvU3RyaW5nQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2RldGVjdG9ycy9BbHdheXNFbmFibGVkLmNvZmZlZSIsIi4uL3NyYy9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZC5qcyIsIi4uL3NyYy9kZXRlY3RvcnMvRGV0ZWN0b3IuY29mZmVlIiwiLi4vc3JjL2RldGVjdG9ycy9EZXRlY3Rvci5qcyIsIi4uL3NyYy9kZXRlY3RvcnMvTGFuZ0RldGVjdG9yLmNvZmZlZSIsIi4uL3NyYy9kZXRlY3RvcnMvTGFuZ0RldGVjdG9yLmpzIiwiLi4vc3JjL2RldGVjdG9ycy9QYWlyRGV0ZWN0b3IuY29mZmVlIiwiLi4vc3JjL2RldGVjdG9ycy9QYWlyRGV0ZWN0b3IuanMiLCIuLi9zcmMvZW50cnkuY29mZmVlIiwiLi4vc3JjL2VudHJ5LmpzIiwiLi4vc3JjL2hlbHBlcnMvQXJyYXlIZWxwZXIuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvQXJyYXlIZWxwZXIuanMiLCIuLi9zcmMvaGVscGVycy9Db21tb25IZWxwZXIuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvQ29tbW9uSGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL05hbWVzcGFjZUhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZS5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9PcHRpb25hbFByb21pc2UuanMiLCIuLi9zcmMvaGVscGVycy9QYXRoSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL1BhdGhIZWxwZXIuanMiLCIuLi9zcmMvaGVscGVycy9TdHJpbmdIZWxwZXIuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvU3RyaW5nSGVscGVyLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1BhaXIuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1BhaXIuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpck1hdGNoLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyTWF0Y2guanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUG9zLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9Qb3MuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbi5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbi5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9SZXBsYWNlbWVudC5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvU2l6ZS5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvU3RyUG9zLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9TdHJQb3MuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvV3JhcHBlZFBvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvV3JhcHBlZFBvcy5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9XcmFwcGluZy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvV3JhcHBpbmcuanMiLCIuLi9zcmMvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmNvZmZlZSIsIi4uL3NyYy9zdG9yYWdlRW5naW5lcy9Mb2NhbFN0b3JhZ2VFbmdpbmUuanMiLCIuLi9zcmMvc3RyaW5nUGFyc2Vycy9Db250ZXh0LmNvZmZlZSIsIi4uL3NyYy9zdHJpbmdQYXJzZXJzL0NvbnRleHQuanMiLCIuLi9zcmMvc3RyaW5nUGFyc2Vycy9Fc2NhcGVDb250ZXh0LmNvZmZlZSIsIi4uL3NyYy9zdHJpbmdQYXJzZXJzL0VzY2FwZUNvbnRleHQuanMiLCIuLi9zcmMvc3RyaW5nUGFyc2Vycy9OYW1lZENvbnRleHQuY29mZmVlIiwiLi4vc3JjL3N0cmluZ1BhcnNlcnMvTmFtZWRDb250ZXh0LmpzIiwiLi4vc3JjL3N0cmluZ1BhcnNlcnMvUGFyYW1Db250ZXh0LmNvZmZlZSIsIi4uL3NyYy9zdHJpbmdQYXJzZXJzL1BhcmFtQ29udGV4dC5qcyIsIi4uL3NyYy9zdHJpbmdQYXJzZXJzL1BhcmFtUGFyc2VyLmNvZmZlZSIsIi4uL3NyYy9zdHJpbmdQYXJzZXJzL1BhcmFtUGFyc2VyLmpzIiwiLi4vc3JjL3N0cmluZ1BhcnNlcnMvU3RyaW5nQ29udGV4dC5jb2ZmZWUiLCIuLi9zcmMvc3RyaW5nUGFyc2Vycy9TdHJpbmdDb250ZXh0LmpzIiwiLi4vc3JjL3N0cmluZ1BhcnNlcnMvVmFyaWFibGVDb250ZXh0LmNvZmZlZSIsIi4uL3NyYy9zdHJpbmdQYXJzZXJzL1ZhcmlhYmxlQ29udGV4dC5qcyIsIm5vZGVfbW9kdWxlcy9pbmZsZWN0aW9uL2xpYi9pbmZsZWN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSx1QkFBQSxDQUFBOztBQUNBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxvQkFBQSxDQUFBOztBQUVBLElBQWEsU0FBTjtBQUFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcbmltcG9ydCB7IFBhaXIgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgY2xhc3MgQm94SGVscGVyXG4gIGNvbnN0cnVjdG9yOiAoQGNvbnRleHQsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBAZGVmYXVsdHMgPSB7XG4gICAgICBkZWNvOiBAY29udGV4dC5jb2Rld2F2ZS5kZWNvXG4gICAgICBwYWQ6IDJcbiAgICAgIHdpZHRoOiA1MFxuICAgICAgaGVpZ2h0OiAzXG4gICAgICBvcGVuVGV4dDogJydcbiAgICAgIGNsb3NlVGV4dDogJydcbiAgICAgIHByZWZpeDogJydcbiAgICAgIHN1ZmZpeDogJydcbiAgICAgIGluZGVudDogMFxuICAgIH1cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gIGNsb25lOiAodGV4dCkgLT5cbiAgICBvcHQgPSB7fVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIG9wdFtrZXldID0gdGhpc1trZXldXG4gICAgcmV0dXJuIG5ldyBCb3hIZWxwZXIoQGNvbnRleHQsb3B0KVxuICBkcmF3OiAodGV4dCkgLT5cbiAgICByZXR1cm4gQHN0YXJ0U2VwKCkgKyBcIlxcblwiICsgQGxpbmVzKHRleHQpICsgXCJcXG5cIisgQGVuZFNlcCgpXG4gIHdyYXBDb21tZW50OiAoc3RyKSAtPlxuICAgIHJldHVybiBAY29udGV4dC53cmFwQ29tbWVudChzdHIpXG4gIHNlcGFyYXRvcjogLT5cbiAgICBsZW4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGhcbiAgICByZXR1cm4gQHdyYXBDb21tZW50KEBkZWNvTGluZShsZW4pKVxuICBzdGFydFNlcDogLT5cbiAgICBsbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aCAtIEBvcGVuVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gQHByZWZpeCArIEB3cmFwQ29tbWVudChAb3BlblRleHQrQGRlY29MaW5lKGxuKSlcbiAgZW5kU2VwOiAtPlxuICAgIGxuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoIC0gQGNsb3NlVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gQHdyYXBDb21tZW50KEBjbG9zZVRleHQrQGRlY29MaW5lKGxuKSkgKyBAc3VmZml4XG4gIGRlY29MaW5lOiAobGVuKSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoQGRlY28sIGxlbilcbiAgcGFkZGluZzogLT4gXG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgQHBhZClcbiAgbGluZXM6ICh0ZXh0ID0gJycsIHVwdG9IZWlnaHQ9dHJ1ZSkgLT5cbiAgICB0ZXh0ID0gdGV4dCBvciAnJ1xuICAgIGxpbmVzID0gdGV4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpXG4gICAgaWYgdXB0b0hlaWdodFxuICAgICAgcmV0dXJuIChAbGluZShsaW5lc1t4XSBvciAnJykgZm9yIHggaW4gWzAuLkBoZWlnaHRdKS5qb2luKCdcXG4nKSBcbiAgICBlbHNlXG4gICAgICByZXR1cm4gKEBsaW5lKGwpIGZvciBsIGluIGxpbmVzKS5qb2luKCdcXG4nKSBcbiAgbGluZTogKHRleHQgPSAnJykgLT5cbiAgICByZXR1cm4gKFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIixAaW5kZW50KSArXG4gICAgICBAd3JhcENvbW1lbnQoXG4gICAgICAgIEBkZWNvICtcbiAgICAgICAgQHBhZGRpbmcoKSArXG4gICAgICAgIHRleHQgK1xuICAgICAgICBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIEB3aWR0aCAtIEByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KS5sZW5ndGgpICsgXG4gICAgICAgIEBwYWRkaW5nKCkgK1xuICAgICAgICBAZGVjb1xuICAgICAgKSlcbiAgbGVmdDogLT5cbiAgICBAY29udGV4dC53cmFwQ29tbWVudExlZnQoQGRlY28gKyBAcGFkZGluZygpKVxuICByaWdodDogLT5cbiAgICBAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KEBwYWRkaW5nKCkgKyBAZGVjbylcbiAgcmVtb3ZlSWdub3JlZENvbnRlbnQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKEBjb250ZXh0LmNvZGV3YXZlLnJlbW92ZUNhcnJldCh0ZXh0KSlcbiAgdGV4dEJvdW5kczogKHRleHQpIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRUeHRTaXplKEByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSlcbiAgZ2V0Qm94Rm9yUG9zOiAocG9zKSAtPlxuICAgIGRlcHRoID0gQGdldE5lc3RlZEx2bChwb3Muc3RhcnQpXG4gICAgaWYgZGVwdGggPiAwXG4gICAgICBsZWZ0ID0gQGxlZnQoKVxuICAgICAgY3VyTGVmdCA9IFN0cmluZ0hlbHBlci5yZXBlYXQobGVmdCxkZXB0aC0xKVxuICAgICAgXG4gICAgICBjbG9uZSA9IEBjbG9uZSgpXG4gICAgICBwbGFjZWhvbGRlciA9IFwiIyMjUGxhY2VIb2xkZXIjIyNcIlxuICAgICAgY2xvbmUud2lkdGggPSBwbGFjZWhvbGRlci5sZW5ndGhcbiAgICAgIGNsb25lLm9wZW5UZXh0ID0gY2xvbmUuY2xvc2VUZXh0ID0gQGRlY28gKyBAZGVjbyArIHBsYWNlaG9sZGVyICsgQGRlY28gKyBAZGVjb1xuICAgICAgXG4gICAgICBzdGFydEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuc3RhcnRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwnLionKSlcbiAgICAgIGVuZEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuZW5kU2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsJy4qJykpXG4gICAgICBcbiAgICAgIHBhaXIgPSBuZXcgUGFpcihzdGFydEZpbmQsZW5kRmluZCx7XG4gICAgICAgIHZhbGlkTWF0Y2g6IChtYXRjaCk9PlxuICAgICAgICAgICMgY29uc29sZS5sb2cobWF0Y2gsbGVmdClcbiAgICAgICAgICBmID0gQGNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQobWF0Y2guc3RhcnQoKSAsW2xlZnQsXCJcXG5cIixcIlxcclwiXSwtMSlcbiAgICAgICAgICByZXR1cm4gIWY/IG9yIGYuc3RyICE9IGxlZnRcbiAgICAgIH0pXG4gICAgICByZXMgPSBwYWlyLndyYXBwZXJQb3MocG9zLEBjb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG4gICAgICBpZiByZXM/XG4gICAgICAgIHJlcy5zdGFydCArPSBjdXJMZWZ0Lmxlbmd0aFxuICAgICAgICByZXR1cm4gcmVzXG4gICAgXG4gIGdldE5lc3RlZEx2bDogKGluZGV4KSAtPlxuICAgIGRlcHRoID0gMFxuICAgIGxlZnQgPSBAbGVmdCgpXG4gICAgd2hpbGUgKGYgPSBAY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCAsW2xlZnQsXCJcXG5cIixcIlxcclwiXSwtMSkpPyAmJiBmLnN0ciA9PSBsZWZ0XG4gICAgICBpbmRleCA9IGYucG9zXG4gICAgICBkZXB0aCsrXG4gICAgcmV0dXJuIGRlcHRoXG4gIGdldE9wdEZyb21MaW5lOiAobGluZSxnZXRQYWQ9dHJ1ZSkgLT5cbiAgICByU3RhcnQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIrU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoQGRlY28pKStcIikoXFxcXHMqKVwiKVxuICAgIHJFbmQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIrU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KEBkZWNvKSkrXCIpKFxcbnwkKVwiKVxuICAgIHJlc1N0YXJ0ID0gclN0YXJ0LmV4ZWMobGluZSlcbiAgICByZXNFbmQgPSByRW5kLmV4ZWMobGluZSlcbiAgICBpZiByZXNTdGFydD8gYW5kIHJlc0VuZD9cbiAgICAgIGlmIGdldFBhZFxuICAgICAgICBAcGFkID0gTWF0aC5taW4ocmVzU3RhcnRbM10ubGVuZ3RoLHJlc0VuZFsxXS5sZW5ndGgpXG4gICAgICBAaW5kZW50ID0gcmVzU3RhcnRbMV0ubGVuZ3RoXG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgQHBhZFxuICAgICAgZW5kUG9zID0gcmVzRW5kLmluZGV4ICsgcmVzRW5kWzFdLmxlbmd0aCAtIEBwYWRcbiAgICAgIEB3aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zXG4gICAgcmV0dXJuIHRoaXNcbiAgcmVmb3JtYXRMaW5lczogKHRleHQsb3B0aW9ucz17fSkgLT5cbiAgICByZXR1cm4gQGxpbmVzKEByZW1vdmVDb21tZW50KHRleHQsb3B0aW9ucyksZmFsc2UpXG4gIHJlbW92ZUNvbW1lbnQ6ICh0ZXh0LG9wdGlvbnM9e30pLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIG11bHRpbGluZTogdHJ1ZVxuICAgICAgfVxuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSxkZWZhdWx0cyxvcHRpb25zKVxuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKVxuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBkZWNvKVxuICAgICAgZmxhZyA9IGlmIG9wdGlvbnNbJ211bHRpbGluZSddIHRoZW4gJ2dtJyBlbHNlICcnXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKiN7ZWNsfSg/OiN7ZWR9KSpcXFxcc3swLCN7QHBhZH19XCIsIGZsYWcpXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXFxcXHMqKD86I3tlZH0pKiN7ZWNyfVxcXFxzKiRcIiwgZmxhZylcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmUxLCcnKS5yZXBsYWNlKHJlMiwnJylcbiAgIFxuICAiLCJpbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIEFycmF5SGVscGVyXG59IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhaXJcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9QYWlyJztcblxuZXhwb3J0IHZhciBCb3hIZWxwZXIgPSBjbGFzcyBCb3hIZWxwZXIge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIga2V5LCByZWYsIHZhbDtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBkZWNvOiB0aGlzLmNvbnRleHQuY29kZXdhdmUuZGVjbyxcbiAgICAgIHBhZDogMixcbiAgICAgIHdpZHRoOiA1MCxcbiAgICAgIGhlaWdodDogMyxcbiAgICAgIG9wZW5UZXh0OiAnJyxcbiAgICAgIGNsb3NlVGV4dDogJycsXG4gICAgICBwcmVmaXg6ICcnLFxuICAgICAgc3VmZml4OiAnJyxcbiAgICAgIGluZGVudDogMFxuICAgIH07XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9uZSh0ZXh0KSB7XG4gICAgdmFyIGtleSwgb3B0LCByZWYsIHZhbDtcbiAgICBvcHQgPSB7fTtcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0LCBvcHQpO1xuICB9XG5cbiAgZHJhdyh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRTZXAoKSArIFwiXFxuXCIgKyB0aGlzLmxpbmVzKHRleHQpICsgXCJcXG5cIiArIHRoaXMuZW5kU2VwKCk7XG4gIH1cblxuICB3cmFwQ29tbWVudChzdHIpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50KHN0cik7XG4gIH1cblxuICBzZXBhcmF0b3IoKSB7XG4gICAgdmFyIGxlbjtcbiAgICBsZW4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMud3JhcENvbW1lbnQodGhpcy5kZWNvTGluZShsZW4pKTtcbiAgfVxuXG4gIHN0YXJ0U2VwKCkge1xuICAgIHZhciBsbjtcbiAgICBsbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aCAtIHRoaXMub3BlblRleHQubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMud3JhcENvbW1lbnQodGhpcy5vcGVuVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKTtcbiAgfVxuXG4gIGVuZFNlcCgpIHtcbiAgICB2YXIgbG47XG4gICAgbG4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGggLSB0aGlzLmNsb3NlVGV4dC5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMud3JhcENvbW1lbnQodGhpcy5jbG9zZVRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSkgKyB0aGlzLnN1ZmZpeDtcbiAgfVxuXG4gIGRlY29MaW5lKGxlbikge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgodGhpcy5kZWNvLCBsZW4pO1xuICB9XG5cbiAgcGFkZGluZygpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLnBhZCk7XG4gIH1cblxuICBsaW5lcyh0ZXh0ID0gJycsIHVwdG9IZWlnaHQgPSB0cnVlKSB7XG4gICAgdmFyIGwsIGxpbmVzLCB4O1xuICAgIHRleHQgPSB0ZXh0IHx8ICcnO1xuICAgIGxpbmVzID0gdGV4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpO1xuICAgIGlmICh1cHRvSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gKChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGksIHJlZiwgcmVzdWx0cztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKHggPSBpID0gMCwgcmVmID0gdGhpcy5oZWlnaHQ7ICgwIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWYpOyB4ID0gMCA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5saW5lKGxpbmVzW3hdIHx8ICcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLCBsZW4xLCByZXN1bHRzO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbjEgPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW4xOyBpKyspIHtcbiAgICAgICAgICBsID0gbGluZXNbaV07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKTtcbiAgICB9XG4gIH1cblxuICBsaW5lKHRleHQgPSAnJykge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMuaW5kZW50KSArIHRoaXMud3JhcENvbW1lbnQodGhpcy5kZWNvICsgdGhpcy5wYWRkaW5nKCkgKyB0ZXh0ICsgU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLndpZHRoIC0gdGhpcy5yZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KS5sZW5ndGgpICsgdGhpcy5wYWRkaW5nKCkgKyB0aGlzLmRlY28pO1xuICB9XG5cbiAgbGVmdCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28gKyB0aGlzLnBhZGRpbmcoKSk7XG4gIH1cblxuICByaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQodGhpcy5wYWRkaW5nKCkgKyB0aGlzLmRlY28pO1xuICB9XG5cbiAgcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQuY29kZXdhdmUucmVtb3ZlTWFya2Vycyh0aGlzLmNvbnRleHQuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHRleHQpKTtcbiAgfVxuXG4gIHRleHRCb3VuZHModGV4dCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0VHh0U2l6ZSh0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpKTtcbiAgfVxuXG4gIGdldEJveEZvclBvcyhwb3MpIHtcbiAgICB2YXIgY2xvbmUsIGN1ckxlZnQsIGRlcHRoLCBlbmRGaW5kLCBsZWZ0LCBwYWlyLCBwbGFjZWhvbGRlciwgcmVzLCBzdGFydEZpbmQ7XG4gICAgZGVwdGggPSB0aGlzLmdldE5lc3RlZEx2bChwb3Muc3RhcnQpO1xuICAgIGlmIChkZXB0aCA+IDApIHtcbiAgICAgIGxlZnQgPSB0aGlzLmxlZnQoKTtcbiAgICAgIGN1ckxlZnQgPSBTdHJpbmdIZWxwZXIucmVwZWF0KGxlZnQsIGRlcHRoIC0gMSk7XG4gICAgICBjbG9uZSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiO1xuICAgICAgY2xvbmUud2lkdGggPSBwbGFjZWhvbGRlci5sZW5ndGg7XG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IHRoaXMuZGVjbyArIHRoaXMuZGVjbyArIHBsYWNlaG9sZGVyICsgdGhpcy5kZWNvICsgdGhpcy5kZWNvO1xuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKTtcbiAgICAgIGVuZEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuZW5kU2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKTtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcihzdGFydEZpbmQsIGVuZEZpbmQsIHtcbiAgICAgICAgdmFsaWRNYXRjaDogKG1hdGNoKSA9PiB7XG4gICAgICAgICAgdmFyIGY7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2cobWF0Y2gsbGVmdClcbiAgICAgICAgICBmID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KG1hdGNoLnN0YXJ0KCksIFtsZWZ0LCBcIlxcblwiLCBcIlxcclwiXSwgLTEpO1xuICAgICAgICAgIHJldHVybiAoZiA9PSBudWxsKSB8fCBmLnN0ciAhPT0gbGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXMgPSBwYWlyLndyYXBwZXJQb3MocG9zLCB0aGlzLmNvbnRleHQuY29kZXdhdmUuZWRpdG9yLnRleHQoKSk7XG4gICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgcmVzLnN0YXJ0ICs9IGN1ckxlZnQubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE5lc3RlZEx2bChpbmRleCkge1xuICAgIHZhciBkZXB0aCwgZiwgbGVmdDtcbiAgICBkZXB0aCA9IDA7XG4gICAgbGVmdCA9IHRoaXMubGVmdCgpO1xuICAgIHdoaWxlICgoKGYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQoaW5kZXgsIFtsZWZ0LCBcIlxcblwiLCBcIlxcclwiXSwgLTEpKSAhPSBudWxsKSAmJiBmLnN0ciA9PT0gbGVmdCkge1xuICAgICAgaW5kZXggPSBmLnBvcztcbiAgICAgIGRlcHRoKys7XG4gICAgfVxuICAgIHJldHVybiBkZXB0aDtcbiAgfVxuXG4gIGdldE9wdEZyb21MaW5lKGxpbmUsIGdldFBhZCA9IHRydWUpIHtcbiAgICB2YXIgZW5kUG9zLCByRW5kLCByU3RhcnQsIHJlc0VuZCwgcmVzU3RhcnQsIHN0YXJ0UG9zO1xuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28pKSArIFwiKShcXFxccyopXCIpO1xuICAgIHJFbmQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMuZGVjbykpICsgXCIpKFxcbnwkKVwiKTtcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpO1xuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKTtcbiAgICBpZiAoKHJlc1N0YXJ0ICE9IG51bGwpICYmIChyZXNFbmQgIT0gbnVsbCkpIHtcbiAgICAgIGlmIChnZXRQYWQpIHtcbiAgICAgICAgdGhpcy5wYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgsIHJlc0VuZFsxXS5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGg7XG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgdGhpcy5wYWQ7XG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gdGhpcy5wYWQ7XG4gICAgICB0aGlzLndpZHRoID0gZW5kUG9zIC0gc3RhcnRQb3M7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVmb3JtYXRMaW5lcyh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5saW5lcyh0aGlzLnJlbW92ZUNvbW1lbnQodGV4dCwgb3B0aW9ucyksIGZhbHNlKTtcbiAgfVxuXG4gIHJlbW92ZUNvbW1lbnQodGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzLCBlY2wsIGVjciwgZWQsIGZsYWcsIG9wdCwgcmUxLCByZTI7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIG11bHRpbGluZTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCgpKTtcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSk7XG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5kZWNvKTtcbiAgICAgIGZsYWcgPSBvcHRpb25zWydtdWx0aWxpbmUnXSA/ICdnbScgOiAnJztcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHN7MCwke3RoaXMucGFkfX1gLCBmbGFnKTtcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoYFxcXFxzKig/OiR7ZWR9KSoke2Vjcn1cXFxccyokYCwgZmxhZyk7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlMSwgJycpLnJlcGxhY2UocmUyLCAnJyk7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3NDb2xsZWN0aW9uIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBvcHRpb25hbFByb21pc2UgfSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IGNsYXNzIENsb3NpbmdQcm9tcFxuICBjb25zdHJ1Y3RvcjogKEBjb2Rld2F2ZSxzZWxlY3Rpb25zKSAtPlxuICAgIEB0aW1lb3V0ID0gbnVsbFxuICAgIEBfdHlwZWQgPSBudWxsXG4gICAgQHN0YXJ0ZWQgPSBmYWxzZVxuICAgIEBuYkNoYW5nZXMgPSAwXG4gICAgQHNlbGVjdGlvbnMgPSBuZXcgUG9zQ29sbGVjdGlvbihzZWxlY3Rpb25zKVxuICBiZWdpbjogLT5cbiAgICBAc3RhcnRlZCA9IHRydWVcbiAgICBvcHRpb25hbFByb21pc2UoQGFkZENhcnJldHMoKSkudGhlbiA9PlxuICAgICAgaWYgQGNvZGV3YXZlLmVkaXRvci5jYW5MaXN0ZW5Ub0NoYW5nZSgpXG4gICAgICAgIEBwcm94eU9uQ2hhbmdlID0gKGNoPW51bGwpPT4gQG9uQ2hhbmdlKGNoKVxuICAgICAgICBAY29kZXdhdmUuZWRpdG9yLmFkZENoYW5nZUxpc3RlbmVyKCBAcHJveHlPbkNoYW5nZSApXG4gICAgICByZXR1cm4gdGhpc1xuICAgIC5yZXN1bHQoKVxuICBhZGRDYXJyZXRzOiAtPlxuICAgIEByZXBsYWNlbWVudHMgPSBAc2VsZWN0aW9ucy53cmFwKFxuICAgICAgQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2FycmV0Q2hhciArIEBjb2Rld2F2ZS5icmFrZXRzICsgXCJcXG5cIixcbiAgICAgIFwiXFxuXCIgKyBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY29kZXdhdmUuY2FycmV0Q2hhciArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgKS5tYXAoIChwKSAtPiBwLmNhcnJldFRvU2VsKCkgKVxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoQHJlcGxhY2VtZW50cylcbiAgaW52YWxpZFR5cGVkOiAtPlxuICAgIEBfdHlwZWQgPSBudWxsXG4gIG9uQ2hhbmdlOiAoY2ggPSBudWxsKS0+XG4gICAgQGludmFsaWRUeXBlZCgpXG4gICAgaWYgQHNraXBFdmVudChjaClcbiAgICAgIHJldHVyblxuICAgIEBuYkNoYW5nZXMrK1xuICAgIGlmIEBzaG91bGRTdG9wKClcbiAgICAgIEBzdG9wKClcbiAgICAgIEBjbGVhbkNsb3NlKClcbiAgICBlbHNlXG4gICAgICBAcmVzdW1lKClcbiAgICAgIFxuICBza2lwRXZlbnQ6IChjaCkgLT5cbiAgICByZXR1cm4gY2g/IGFuZCBjaC5jaGFyQ29kZUF0KDApICE9IDMyXG4gIFxuICByZXN1bWU6IC0+XG4gICAgI1xuICAgIFxuICBzaG91bGRTdG9wOiAtPlxuICAgIHJldHVybiBAdHlwZWQoKSA9PSBmYWxzZSBvciBAdHlwZWQoKS5pbmRleE9mKCcgJykgIT0gLTFcbiAgXG4gIGNsZWFuQ2xvc2U6IC0+XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzZWxlY3Rpb25zID0gQGdldFNlbGVjdGlvbnMoKVxuICAgIGZvciBzZWwgaW4gc2VsZWN0aW9uc1xuICAgICAgaWYgcG9zID0gQHdoaXRoaW5PcGVuQm91bmRzKHNlbClcbiAgICAgICAgc3RhcnQgPSBzZWxcbiAgICAgIGVsc2UgaWYgKGVuZCA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgYW5kIHN0YXJ0P1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS5pbm5lclRleHQoKS5zcGxpdCgnICcpWzBdXG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoZW5kLmlubmVyU3RhcnQsZW5kLmlubmVyRW5kLHJlcylcbiAgICAgICAgcmVwbC5zZWxlY3Rpb25zID0gW3N0YXJ0XVxuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgZ2V0U2VsZWN0aW9uczogLT5cbiAgICByZXR1cm4gQGNvZGV3YXZlLmVkaXRvci5nZXRNdWx0aVNlbCgpXG4gIHN0b3A6IC0+XG4gICAgQHN0YXJ0ZWQgPSBmYWxzZVxuICAgIGNsZWFyVGltZW91dChAdGltZW91dCkgaWYgQHRpbWVvdXQ/XG4gICAgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGwgaWYgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9PSB0aGlzXG4gICAgaWYgQHByb3h5T25DaGFuZ2U/XG4gICAgICBAY29kZXdhdmUuZWRpdG9yLnJlbW92ZUNoYW5nZUxpc3RlbmVyKEBwcm94eU9uQ2hhbmdlKVxuICBjYW5jZWw6IC0+XG4gICAgaWYgQHR5cGVkKCkgIT0gZmFsc2VcbiAgICAgIEBjYW5jZWxTZWxlY3Rpb25zKEBnZXRTZWxlY3Rpb25zKCkpXG4gICAgQHN0b3AoKVxuICBjYW5jZWxTZWxlY3Rpb25zOiAoc2VsZWN0aW9ucykgLT5cbiAgICByZXBsYWNlbWVudHMgPSBbXVxuICAgIHN0YXJ0ID0gbnVsbFxuICAgIGZvciBzZWwgaW4gc2VsZWN0aW9uc1xuICAgICAgaWYgcG9zID0gQHdoaXRoaW5PcGVuQm91bmRzKHNlbClcbiAgICAgICAgc3RhcnQgPSBwb3NcbiAgICAgIGVsc2UgaWYgKGVuZCA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgYW5kIHN0YXJ0P1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXcgUmVwbGFjZW1lbnQoc3RhcnQuc3RhcnQsZW5kLmVuZCxAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoc3RhcnQuZW5kKzEsIGVuZC5zdGFydC0xKSkuc2VsZWN0Q29udGVudCgpKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgdHlwZWQ6IC0+XG4gICAgdW5sZXNzIEBfdHlwZWQ/XG4gICAgICBjcG9zID0gQGNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKVxuICAgICAgaW5uZXJTdGFydCA9IEByZXBsYWNlbWVudHNbMF0uc3RhcnQgKyBAY29kZXdhdmUuYnJha2V0cy5sZW5ndGhcbiAgICAgIGlmIEBjb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PSBAcmVwbGFjZW1lbnRzWzBdLnN0YXJ0IGFuZCAoaW5uZXJFbmQgPSBAY29kZXdhdmUuZmluZE5leHRCcmFrZXQoaW5uZXJTdGFydCkpPyBhbmQgaW5uZXJFbmQgPj0gY3Bvcy5lbmRcbiAgICAgICAgQF90eXBlZCA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihpbm5lclN0YXJ0LCBpbm5lckVuZClcbiAgICAgIGVsc2VcbiAgICAgICAgQF90eXBlZCA9IGZhbHNlXG4gICAgcmV0dXJuIEBfdHlwZWRcbiAgd2hpdGhpbk9wZW5Cb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQHN0YXJ0UG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09IHRhcmdldFRleHRcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuICB3aGl0aGluQ2xvc2VCb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQGVuZFBvc0F0KGkpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT0gdGFyZ2V0VGV4dFxuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG4gIHN0YXJ0UG9zQXQ6IChpbmRleCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5zdGFydCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyKSxcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5lbmQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMSlcbiAgICAgICkud3JhcHBlZEJ5KEBjb2Rld2F2ZS5icmFrZXRzLCBAY29kZXdhdmUuYnJha2V0cylcbiAgZW5kUG9zQXQ6IChpbmRleCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5zdGFydCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsxKSxcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5lbmQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMilcbiAgICAgICkud3JhcHBlZEJ5KEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciwgQGNvZGV3YXZlLmJyYWtldHMpXG5cbmV4cG9ydCBjbGFzcyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgZXh0ZW5kcyBDbG9zaW5nUHJvbXBcbiAgcmVzdW1lOiAtPlxuICAgIEBzaW11bGF0ZVR5cGUoKVxuICBzaW11bGF0ZVR5cGU6IC0+XG4gICAgY2xlYXJUaW1lb3V0KEB0aW1lb3V0KSBpZiBAdGltZW91dD9cbiAgICBAdGltZW91dCA9IHNldFRpbWVvdXQgKD0+XG4gICAgICBAaW52YWxpZFR5cGVkKClcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBjdXJDbG9zZSA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoQHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdLmNvcHkoKS5hcHBseU9mZnNldChAdHlwZWQoKS5sZW5ndGgpKVxuICAgICAgaWYgY3VyQ2xvc2VcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChjdXJDbG9zZS5zdGFydCxjdXJDbG9zZS5lbmQsdGFyZ2V0VGV4dClcbiAgICAgICAgaWYgcmVwbC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLm5lY2Vzc2FyeSgpXG4gICAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pXG4gICAgICBlbHNlXG4gICAgICAgIEBzdG9wKClcbiAgICAgIEBvblR5cGVTaW11bGF0ZWQoKSBpZiBAb25UeXBlU2ltdWxhdGVkP1xuICAgICksIDJcbiAgc2tpcEV2ZW50OiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBnZXRTZWxlY3Rpb25zOiAtPlxuICAgIHJldHVybiBbXG4gICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKClcbiAgICAgICAgQHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdICsgQHR5cGVkKCkubGVuZ3RoXG4gICAgICBdXG4gIHdoaXRoaW5DbG9zZUJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAZW5kUG9zQXQoaSlcbiAgICAgIG5leHQgPSBAY29kZXdhdmUuZmluZE5leHRCcmFrZXQodGFyZ2V0UG9zLmlubmVyU3RhcnQpXG4gICAgICBpZiBuZXh0P1xuICAgICAgICB0YXJnZXRQb3MubW92ZVN1ZmZpeChuZXh0KVxuICAgICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuXG5DbG9zaW5nUHJvbXAubmV3Rm9yID0gKGNvZGV3YXZlLHNlbGVjdGlvbnMpIC0+XG4gIGlmIGNvZGV3YXZlLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICByZXR1cm4gbmV3IENsb3NpbmdQcm9tcChjb2Rld2F2ZSxzZWxlY3Rpb25zKVxuICBlbHNlXG4gICAgcmV0dXJuIG5ldyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAoY29kZXdhdmUsc2VsZWN0aW9ucykiLCJpbXBvcnQge1xuICBQb3NDb2xsZWN0aW9uXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5pbXBvcnQge1xuICBvcHRpb25hbFByb21pc2Vcbn0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCB2YXIgQ2xvc2luZ1Byb21wID0gY2xhc3MgQ2xvc2luZ1Byb21wIHtcbiAgY29uc3RydWN0b3IoY29kZXdhdmUxLCBzZWxlY3Rpb25zKSB7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlMTtcbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuX3R5cGVkID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLm5iQ2hhbmdlcyA9IDA7XG4gICAgdGhpcy5zZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucyk7XG4gIH1cblxuICBiZWdpbigpIHtcbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgIHJldHVybiBvcHRpb25hbFByb21pc2UodGhpcy5hZGRDYXJyZXRzKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuZWRpdG9yLmNhbkxpc3RlblRvQ2hhbmdlKCkpIHtcbiAgICAgICAgdGhpcy5wcm94eU9uQ2hhbmdlID0gKGNoID0gbnVsbCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQ2hhbmdlKGNoKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5wcm94eU9uQ2hhbmdlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pLnJlc3VsdCgpO1xuICB9XG5cbiAgYWRkQ2FycmV0cygpIHtcbiAgICB0aGlzLnJlcGxhY2VtZW50cyA9IHRoaXMuc2VsZWN0aW9ucy53cmFwKHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2FycmV0Q2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cyArIFwiXFxuXCIsIFwiXFxuXCIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY29kZXdhdmUuY2FycmV0Q2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cykubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBwLmNhcnJldFRvU2VsKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHRoaXMucmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIGludmFsaWRUeXBlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZWQgPSBudWxsO1xuICB9XG5cbiAgb25DaGFuZ2UoY2ggPSBudWxsKSB7XG4gICAgdGhpcy5pbnZhbGlkVHlwZWQoKTtcbiAgICBpZiAodGhpcy5za2lwRXZlbnQoY2gpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubmJDaGFuZ2VzKys7XG4gICAgaWYgKHRoaXMuc2hvdWxkU3RvcCgpKSB7XG4gICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIHJldHVybiB0aGlzLmNsZWFuQ2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdW1lKCk7XG4gICAgfVxuICB9XG5cbiAgc2tpcEV2ZW50KGNoKSB7XG4gICAgcmV0dXJuIChjaCAhPSBudWxsKSAmJiBjaC5jaGFyQ29kZUF0KDApICE9PSAzMjtcbiAgfVxuXG4gIHJlc3VtZSgpIHt9XG5cbiAgXG4gIHNob3VsZFN0b3AoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZWQoKSA9PT0gZmFsc2UgfHwgdGhpcy50eXBlZCgpLmluZGV4T2YoJyAnKSAhPT0gLTE7XG4gIH1cblxuICBjbGVhbkNsb3NlKCkge1xuICAgIHZhciBlbmQsIGosIGxlbiwgcG9zLCByZXBsLCByZXBsYWNlbWVudHMsIHJlcywgc2VsLCBzZWxlY3Rpb25zLCBzdGFydDtcbiAgICByZXBsYWNlbWVudHMgPSBbXTtcbiAgICBzZWxlY3Rpb25zID0gdGhpcy5nZXRTZWxlY3Rpb25zKCk7XG4gICAgZm9yIChqID0gMCwgbGVuID0gc2VsZWN0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgc2VsID0gc2VsZWN0aW9uc1tqXTtcbiAgICAgIGlmIChwb3MgPSB0aGlzLndoaXRoaW5PcGVuQm91bmRzKHNlbCkpIHtcbiAgICAgICAgc3RhcnQgPSBzZWw7XG4gICAgICB9IGVsc2UgaWYgKChlbmQgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSAmJiAoc3RhcnQgIT0gbnVsbCkpIHtcbiAgICAgICAgcmVzID0gZW5kLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLmlubmVyVGV4dCgpLnNwbGl0KCcgJylbMF07XG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoZW5kLmlubmVyU3RhcnQsIGVuZC5pbm5lckVuZCwgcmVzKTtcbiAgICAgICAgcmVwbC5zZWxlY3Rpb25zID0gW3N0YXJ0XTtcbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gocmVwbCk7XG4gICAgICAgIHN0YXJ0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxuICBnZXRTZWxlY3Rpb25zKCkge1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRNdWx0aVNlbCgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPT09IHRoaXMpIHtcbiAgICAgIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJveHlPbkNoYW5nZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5wcm94eU9uQ2hhbmdlKTtcbiAgICB9XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMudHlwZWQoKSAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuY2FuY2VsU2VsZWN0aW9ucyh0aGlzLmdldFNlbGVjdGlvbnMoKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0b3AoKTtcbiAgfVxuXG4gIGNhbmNlbFNlbGVjdGlvbnMoc2VsZWN0aW9ucykge1xuICAgIHZhciBlbmQsIGosIGxlbiwgcG9zLCByZXBsYWNlbWVudHMsIHNlbCwgc3RhcnQ7XG4gICAgcmVwbGFjZW1lbnRzID0gW107XG4gICAgc3RhcnQgPSBudWxsO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNlbGVjdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNlbCA9IHNlbGVjdGlvbnNbal07XG4gICAgICBpZiAocG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpKSB7XG4gICAgICAgIHN0YXJ0ID0gcG9zO1xuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgKHN0YXJ0ICE9IG51bGwpKSB7XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ldyBSZXBsYWNlbWVudChzdGFydC5zdGFydCwgZW5kLmVuZCwgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihzdGFydC5lbmQgKyAxLCBlbmQuc3RhcnQgLSAxKSkuc2VsZWN0Q29udGVudCgpKTtcbiAgICAgICAgc3RhcnQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIHR5cGVkKCkge1xuICAgIHZhciBjcG9zLCBpbm5lckVuZCwgaW5uZXJTdGFydDtcbiAgICBpZiAodGhpcy5fdHlwZWQgPT0gbnVsbCkge1xuICAgICAgY3BvcyA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpO1xuICAgICAgaW5uZXJTdGFydCA9IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aDtcbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmZpbmRQcmV2QnJha2V0KGNwb3Muc3RhcnQpID09PSB0aGlzLnJlcGxhY2VtZW50c1swXS5zdGFydCAmJiAoKGlubmVyRW5kID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChpbm5lclN0YXJ0KSkgIT0gbnVsbCkgJiYgaW5uZXJFbmQgPj0gY3Bvcy5lbmQpIHtcbiAgICAgICAgdGhpcy5fdHlwZWQgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGlubmVyU3RhcnQsIGlubmVyRW5kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3R5cGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90eXBlZDtcbiAgfVxuXG4gIHdoaXRoaW5PcGVuQm91bmRzKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIHJlZiwgcmVwbCwgdGFyZ2V0UG9zLCB0YXJnZXRUZXh0O1xuICAgIHJlZiA9IHRoaXMucmVwbGFjZW1lbnRzO1xuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5zdGFydFBvc0F0KGkpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT09IHRhcmdldFRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvcztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgd2hpdGhpbkNsb3NlQm91bmRzKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIHJlZiwgcmVwbCwgdGFyZ2V0UG9zLCB0YXJnZXRUZXh0O1xuICAgIHJlZiA9IHRoaXMucmVwbGFjZW1lbnRzO1xuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5lbmRQb3NBdChpKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT09IHRhcmdldFRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvcztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhcnRQb3NBdChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLnN0YXJ0ICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIpLCB0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5lbmQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDEpKS53cmFwcGVkQnkodGhpcy5jb2Rld2F2ZS5icmFrZXRzLCB0aGlzLmNvZGV3YXZlLmJyYWtldHMpO1xuICB9XG5cbiAgZW5kUG9zQXQoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5zdGFydCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMikpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciwgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKTtcbiAgfVxuXG59O1xuXG5leHBvcnQgdmFyIFNpbXVsYXRlZENsb3NpbmdQcm9tcCA9IGNsYXNzIFNpbXVsYXRlZENsb3NpbmdQcm9tcCBleHRlbmRzIENsb3NpbmdQcm9tcCB7XG4gIHJlc3VtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaW11bGF0ZVR5cGUoKTtcbiAgfVxuXG4gIHNpbXVsYXRlVHlwZSgpIHtcbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKCkgPT4ge1xuICAgICAgdmFyIGN1ckNsb3NlLCByZXBsLCB0YXJnZXRUZXh0O1xuICAgICAgdGhpcy5pbnZhbGlkVHlwZWQoKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIGN1ckNsb3NlID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHModGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXS5jb3B5KCkuYXBwbHlPZmZzZXQodGhpcy50eXBlZCgpLmxlbmd0aCkpO1xuICAgICAgaWYgKGN1ckNsb3NlKSB7XG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoY3VyQ2xvc2Uuc3RhcnQsIGN1ckNsb3NlLmVuZCwgdGFyZ2V0VGV4dCk7XG4gICAgICAgIGlmIChyZXBsLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLm5lY2Vzc2FyeSgpKSB7XG4gICAgICAgICAgdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoW3JlcGxdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vblR5cGVTaW11bGF0ZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vblR5cGVTaW11bGF0ZWQoKTtcbiAgICAgIH1cbiAgICB9KSwgMik7XG4gIH1cblxuICBza2lwRXZlbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucygpIHtcbiAgICByZXR1cm4gW3RoaXMuY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpLCB0aGlzLnJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdICsgdGhpcy50eXBlZCgpLmxlbmd0aF07XG4gIH1cblxuICB3aGl0aGluQ2xvc2VCb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV4dCwgcmVmLCByZXBsLCB0YXJnZXRQb3M7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV07XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLmVuZFBvc0F0KGkpO1xuICAgICAgbmV4dCA9IHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQodGFyZ2V0UG9zLmlubmVyU3RhcnQpO1xuICAgICAgaWYgKG5leHQgIT0gbnVsbCkge1xuICAgICAgICB0YXJnZXRQb3MubW92ZVN1ZmZpeChuZXh0KTtcbiAgICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG59O1xuXG5DbG9zaW5nUHJvbXAubmV3Rm9yID0gZnVuY3Rpb24oY29kZXdhdmUsIHNlbGVjdGlvbnMpIHtcbiAgaWYgKGNvZGV3YXZlLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICByZXR1cm4gbmV3IENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAoY29kZXdhdmUsIHNlbGVjdGlvbnMpO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgQ21kRmluZGVyXG4gIGNvbnN0cnVjdG9yOiAobmFtZXMsIG9wdGlvbnMpIC0+XG4gICAgaWYgdHlwZW9mIG5hbWVzID09ICdzdHJpbmcnXG4gICAgICBuYW1lcyA9IFtuYW1lc11cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIHBhcmVudDogbnVsbFxuICAgICAgbmFtZXNwYWNlczogW11cbiAgICAgIHBhcmVudENvbnRleHQ6IG51bGxcbiAgICAgIGNvbnRleHQ6IG51bGxcbiAgICAgIHJvb3Q6IENvbW1hbmQuY21kc1xuICAgICAgbXVzdEV4ZWN1dGU6IHRydWVcbiAgICAgIHVzZURldGVjdG9yczogdHJ1ZVxuICAgICAgdXNlRmFsbGJhY2tzOiB0cnVlXG4gICAgICBpbnN0YW5jZTogbnVsbFxuICAgICAgY29kZXdhdmU6IG51bGxcbiAgICB9XG4gICAgQG5hbWVzID0gbmFtZXNcbiAgICBAcGFyZW50ID0gb3B0aW9uc1sncGFyZW50J11cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZSBpZiBAcGFyZW50PyBhbmQga2V5ICE9ICdwYXJlbnQnXG4gICAgICAgIHRoaXNba2V5XSA9IEBwYXJlbnRba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICB1bmxlc3MgQGNvbnRleHQ/XG4gICAgICBAY29udGV4dCA9IG5ldyBDb250ZXh0KEBjb2Rld2F2ZSlcbiAgICBpZiBAcGFyZW50Q29udGV4dD9cbiAgICAgIEBjb250ZXh0LnBhcmVudCA9IEBwYXJlbnRDb250ZXh0XG4gICAgaWYgQG5hbWVzcGFjZXM/XG4gICAgICBAY29udGV4dC5hZGROYW1lc3BhY2VzKEBuYW1lc3BhY2VzKVxuICBmaW5kOiAtPlxuICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiAgICBAY21kID0gQGZpbmRJbihAcm9vdClcbiAgICByZXR1cm4gQGNtZFxuIyAgZ2V0UG9zaWJpbGl0aWVzOiAtPlxuIyAgICBAdHJpZ2dlckRldGVjdG9ycygpXG4jICAgIHBhdGggPSBsaXN0KEBwYXRoKVxuIyAgICByZXR1cm4gQGZpbmRQb3NpYmlsaXRpZXNJbihAcm9vdCxwYXRoKVxuICBnZXROYW1lc1dpdGhQYXRoczogLT5cbiAgICBwYXRocyA9IHt9XG4gICAgZm9yIG5hbWUgaW4gQG5hbWVzIFxuICAgICAgW3NwYWNlLHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSlcbiAgICAgIGlmIHNwYWNlPyBhbmQgIShzcGFjZSBpbiBAY29udGV4dC5nZXROYW1lU3BhY2VzKCkpXG4gICAgICAgIHVubGVzcyBzcGFjZSBvZiBwYXRocyBcbiAgICAgICAgICBwYXRoc1tzcGFjZV0gPSBbXVxuICAgICAgICBwYXRoc1tzcGFjZV0ucHVzaChyZXN0KVxuICAgIHJldHVybiBwYXRoc1xuICBhcHBseVNwYWNlT25OYW1lczogKG5hbWVzcGFjZSkgLT5cbiAgICBbc3BhY2UscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lc3BhY2UsdHJ1ZSlcbiAgICBAbmFtZXMubWFwKCAobmFtZSkgLT5cbiAgICAgIFtjdXJfc3BhY2UsY3VyX3Jlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSlcbiAgICAgIGlmIGN1cl9zcGFjZT8gYW5kIGN1cl9zcGFjZSA9PSBzcGFjZVxuICAgICAgICBuYW1lID0gY3VyX3Jlc3RcbiAgICAgIGlmIHJlc3Q/XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZVxuICAgICAgcmV0dXJuIG5hbWVcbiAgICApXG4gIGdldERpcmVjdE5hbWVzOiAtPlxuICAgIHJldHVybiAobiBmb3IgbiBpbiBAbmFtZXMgd2hlbiBuLmluZGV4T2YoXCI6XCIpID09IC0xKVxuICB0cmlnZ2VyRGV0ZWN0b3JzOiAtPlxuICAgIGlmIEB1c2VEZXRlY3RvcnMgXG4gICAgICBAdXNlRGV0ZWN0b3JzID0gZmFsc2VcbiAgICAgIHBvc2liaWxpdGllcyA9IFtAcm9vdF0uY29uY2F0KG5ldyBDbWRGaW5kZXIoQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCB7cGFyZW50OiB0aGlzLCBtdXN0RXhlY3V0ZTogZmFsc2UsIHVzZUZhbGxiYWNrczogZmFsc2V9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IHBvc2liaWxpdGllcy5sZW5ndGhcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldXG4gICAgICAgIGZvciBkZXRlY3RvciBpbiBjbWQuZGV0ZWN0b3JzIFxuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKVxuICAgICAgICAgIGlmIHJlcz9cbiAgICAgICAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMocmVzKVxuICAgICAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKHJlcywge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgICAgICBpKytcbiAgZmluZEluOiAoY21kLHBhdGggPSBudWxsKSAtPlxuICAgIHVubGVzcyBjbWQ/XG4gICAgICByZXR1cm4gbnVsbFxuICAgIGJlc3QgPSBAYmVzdEluUG9zaWJpbGl0aWVzKEBmaW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgaWYgYmVzdD9cbiAgICAgIHJldHVybiBiZXN0XG4gIGZpbmRQb3NpYmlsaXRpZXM6IC0+XG4gICAgdW5sZXNzIEByb290P1xuICAgICAgcmV0dXJuIFtdXG4gICAgQHJvb3QuaW5pdCgpXG4gICAgcG9zaWJpbGl0aWVzID0gW11cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/LmNtZCA9PSBAcm9vdFxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChAZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoJ2luX2luc3RhbmNlJykpXG4gICAgZm9yIHNwYWNlLCBuYW1lcyBvZiBAZ2V0TmFtZXNXaXRoUGF0aHMoKVxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChAZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoc3BhY2UsIG5hbWVzKSlcbiAgICBmb3IgbnNwYyBpbiBAY29udGV4dC5nZXROYW1lU3BhY2VzKClcbiAgICAgIFtuc3BjTmFtZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsdHJ1ZSlcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQoQGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKG5zcGNOYW1lLCBAYXBwbHlTcGFjZU9uTmFtZXMobnNwYykpKVxuICAgIGZvciBuYW1lIGluIEBnZXREaXJlY3ROYW1lcygpXG4gICAgICBkaXJlY3QgPSBAcm9vdC5nZXRDbWQobmFtZSlcbiAgICAgIGlmIEBjbWRJc1ZhbGlkKGRpcmVjdClcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZGlyZWN0KVxuICAgIGlmIEB1c2VGYWxsYmFja3NcbiAgICAgIGZhbGxiYWNrID0gQHJvb3QuZ2V0Q21kKCdmYWxsYmFjaycpXG4gICAgICBpZiBAY21kSXNWYWxpZChmYWxsYmFjaylcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZmFsbGJhY2spXG4gICAgQHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllc1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXNcbiAgZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQ6IChjbWROYW1lLCBuYW1lcyA9IEBuYW1lcykgLT5cbiAgICBwb3NpYmlsaXRpZXMgPSBbXTtcbiAgICBuZXh0cyA9IEBnZXRDbWRGb2xsb3dBbGlhcyhjbWROYW1lKVxuICAgIGZvciBuZXh0IGluIG5leHRzXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgcG9zaWJpbGl0aWVzXG4gIGdldENtZEZvbGxvd0FsaWFzOiAobmFtZSkgLT5cbiAgICBjbWQgPSBAcm9vdC5nZXRDbWQobmFtZSlcbiAgICBpZiBjbWQ/IFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmFsaWFzT2Y/XG4gICAgICAgIHJldHVybiBbY21kLGNtZC5nZXRBbGlhc2VkKCldXG4gICAgICByZXR1cm4gW2NtZF1cbiAgICByZXR1cm4gW2NtZF1cbiAgY21kSXNWYWxpZDogKGNtZCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgaWYgY21kLm5hbWUgIT0gJ2ZhbGxiYWNrJyAmJiBjbWQgaW4gQGFuY2VzdG9ycygpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gIUBtdXN0RXhlY3V0ZSBvciBAY21kSXNFeGVjdXRhYmxlKGNtZClcbiAgYW5jZXN0b3JzOiAtPlxuICAgIGlmIEBjb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICByZXR1cm4gW11cbiAgY21kSXNFeGVjdXRhYmxlOiAoY21kKSAtPlxuICAgIG5hbWVzID0gQGdldERpcmVjdE5hbWVzKClcbiAgICBpZiBuYW1lcy5sZW5ndGggPT0gMVxuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZXNbMF0pXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgY21kU2NvcmU6IChjbWQpIC0+XG4gICAgc2NvcmUgPSBjbWQuZGVwdGhcbiAgICBpZiBjbWQubmFtZSA9PSAnZmFsbGJhY2snIFxuICAgICAgICBzY29yZSAtPSAxMDAwXG4gICAgcmV0dXJuIHNjb3JlXG4gIGJlc3RJblBvc2liaWxpdGllczogKHBvc3MpIC0+XG4gICAgaWYgcG9zcy5sZW5ndGggPiAwXG4gICAgICBiZXN0ID0gbnVsbFxuICAgICAgYmVzdFNjb3JlID0gbnVsbFxuICAgICAgZm9yIHAgaW4gcG9zc1xuICAgICAgICBzY29yZSA9IEBjbWRTY29yZShwKVxuICAgICAgICBpZiAhYmVzdD8gb3Igc2NvcmUgPj0gYmVzdFNjb3JlXG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmVcbiAgICAgICAgICBiZXN0ID0gcFxuICAgICAgcmV0dXJuIGJlc3Q7IiwidmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xuXG5pbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIE5hbWVzcGFjZUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIENtZEZpbmRlciA9IGNsYXNzIENtZEZpbmRlciB7XG4gIGNvbnN0cnVjdG9yKG5hbWVzLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdO1xuICAgIH1cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgcGFyZW50Q29udGV4dDogbnVsbCxcbiAgICAgIGNvbnRleHQ6IG51bGwsXG4gICAgICByb290OiBDb21tYW5kLmNtZHMsXG4gICAgICBtdXN0RXhlY3V0ZTogdHJ1ZSxcbiAgICAgIHVzZURldGVjdG9yczogdHJ1ZSxcbiAgICAgIHVzZUZhbGxiYWNrczogdHJ1ZSxcbiAgICAgIGluc3RhbmNlOiBudWxsLFxuICAgICAgY29kZXdhdmU6IG51bGxcbiAgICB9O1xuICAgIHRoaXMubmFtZXMgPSBuYW1lcztcbiAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddO1xuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSBpZiAoKHRoaXMucGFyZW50ICE9IG51bGwpICYmIGtleSAhPT0gJ3BhcmVudCcpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzLmNvZGV3YXZlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGFyZW50Q29udGV4dCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5wYXJlbnRDb250ZXh0O1xuICAgIH1cbiAgICBpZiAodGhpcy5uYW1lc3BhY2VzICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHRoaXMubmFtZXNwYWNlcyk7XG4gICAgfVxuICB9XG5cbiAgZmluZCgpIHtcbiAgICB0aGlzLnRyaWdnZXJEZXRlY3RvcnMoKTtcbiAgICB0aGlzLmNtZCA9IHRoaXMuZmluZEluKHRoaXMucm9vdCk7XG4gICAgcmV0dXJuIHRoaXMuY21kO1xuICB9XG5cbiAgLy8gIGdldFBvc2liaWxpdGllczogLT5cbiAgLy8gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAvLyAgICBwYXRoID0gbGlzdChAcGF0aClcbiAgLy8gICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcbiAgZ2V0TmFtZXNXaXRoUGF0aHMoKSB7XG4gICAgdmFyIGosIGxlbiwgbmFtZSwgcGF0aHMsIHJlZiwgcmVzdCwgc3BhY2U7XG4gICAgcGF0aHMgPSB7fTtcbiAgICByZWYgPSB0aGlzLm5hbWVzO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmFtZSA9IHJlZltqXTtcbiAgICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKTtcbiAgICAgIGlmICgoc3BhY2UgIT0gbnVsbCkgJiYgIShpbmRleE9mLmNhbGwodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwgc3BhY2UpID49IDApKSB7XG4gICAgICAgIGlmICghKHNwYWNlIGluIHBhdGhzKSkge1xuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGF0aHM7XG4gIH1cblxuICBhcHBseVNwYWNlT25OYW1lcyhuYW1lc3BhY2UpIHtcbiAgICB2YXIgcmVzdCwgc3BhY2U7XG4gICAgW3NwYWNlLCByZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMubmFtZXMubWFwKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBjdXJfcmVzdCwgY3VyX3NwYWNlO1xuICAgICAgW2N1cl9zcGFjZSwgY3VyX3Jlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG4gICAgICBpZiAoKGN1cl9zcGFjZSAhPSBudWxsKSAmJiBjdXJfc3BhY2UgPT09IHNwYWNlKSB7XG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXN0ICE9IG51bGwpIHtcbiAgICAgICAgbmFtZSA9IHJlc3QgKyAnOicgKyBuYW1lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXREaXJlY3ROYW1lcygpIHtcbiAgICB2YXIgbjtcbiAgICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgcmVmID0gdGhpcy5uYW1lcztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBuID0gcmVmW2pdO1xuICAgICAgICBpZiAobi5pbmRleE9mKFwiOlwiKSA9PT0gLTEpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gobik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0pLmNhbGwodGhpcyk7XG4gIH1cblxuICB0cmlnZ2VyRGV0ZWN0b3JzKCkge1xuICAgIHZhciBjbWQsIGRldGVjdG9yLCBpLCBqLCBsZW4sIHBvc2liaWxpdGllcywgcmVmLCByZXMsIHJlc3VsdHM7XG4gICAgaWYgKHRoaXMudXNlRGV0ZWN0b3JzKSB7XG4gICAgICB0aGlzLnVzZURldGVjdG9ycyA9IGZhbHNlO1xuICAgICAgcG9zaWJpbGl0aWVzID0gW3RoaXMucm9vdF0uY29uY2F0KG5ldyBDbWRGaW5kZXIodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICAgIGkgPSAwO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgd2hpbGUgKGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoKSB7XG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXTtcbiAgICAgICAgcmVmID0gY21kLmRldGVjdG9ycztcbiAgICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgZGV0ZWN0b3IgPSByZWZbal07XG4gICAgICAgICAgcmVzID0gZGV0ZWN0b3IuZGV0ZWN0KHRoaXMpO1xuICAgICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmFkZE5hbWVzcGFjZXMocmVzKTtcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtcbiAgICAgICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgICAgICBtdXN0RXhlY3V0ZTogZmFsc2UsXG4gICAgICAgICAgICAgIHVzZUZhbGxiYWNrczogZmFsc2VcbiAgICAgICAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHMucHVzaChpKyspO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9XG5cbiAgZmluZEluKGNtZCwgcGF0aCA9IG51bGwpIHtcbiAgICB2YXIgYmVzdDtcbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBiZXN0ID0gdGhpcy5iZXN0SW5Qb3NpYmlsaXRpZXModGhpcy5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgIGlmIChiZXN0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBiZXN0O1xuICAgIH1cbiAgfVxuXG4gIGZpbmRQb3NpYmlsaXRpZXMoKSB7XG4gICAgdmFyIGRpcmVjdCwgZmFsbGJhY2ssIGosIGssIGxlbiwgbGVuMSwgbmFtZSwgbmFtZXMsIG5zcGMsIG5zcGNOYW1lLCBwb3NpYmlsaXRpZXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVzdCwgc3BhY2U7XG4gICAgaWYgKHRoaXMucm9vdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHRoaXMucm9vdC5pbml0KCk7XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG4gICAgaWYgKCgocmVmID0gdGhpcy5jb2Rld2F2ZSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmluSW5zdGFuY2UpICE9IG51bGwgPyByZWYxLmNtZCA6IHZvaWQgMCA6IHZvaWQgMCkgPT09IHRoaXMucm9vdCkge1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKCdpbl9pbnN0YW5jZScpKTtcbiAgICB9XG4gICAgcmVmMiA9IHRoaXMuZ2V0TmFtZXNXaXRoUGF0aHMoKTtcbiAgICBmb3IgKHNwYWNlIGluIHJlZjIpIHtcbiAgICAgIG5hbWVzID0gcmVmMltzcGFjZV07XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoc3BhY2UsIG5hbWVzKSk7XG4gICAgfVxuICAgIHJlZjMgPSB0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZjMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5zcGMgPSByZWYzW2pdO1xuICAgICAgW25zcGNOYW1lLCByZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsIHRydWUpO1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKG5zcGNOYW1lLCB0aGlzLmFwcGx5U3BhY2VPbk5hbWVzKG5zcGMpKSk7XG4gICAgfVxuICAgIHJlZjQgPSB0aGlzLmdldERpcmVjdE5hbWVzKCk7XG4gICAgZm9yIChrID0gMCwgbGVuMSA9IHJlZjQubGVuZ3RoOyBrIDwgbGVuMTsgaysrKSB7XG4gICAgICBuYW1lID0gcmVmNFtrXTtcbiAgICAgIGRpcmVjdCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSk7XG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGRpcmVjdCkpIHtcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZGlyZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMudXNlRmFsbGJhY2tzKSB7XG4gICAgICBmYWxsYmFjayA9IHRoaXMucm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJyk7XG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGZhbGxiYWNrKSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjayk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzO1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXM7XG4gIH1cblxuICBnZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChjbWROYW1lLCBuYW1lcyA9IHRoaXMubmFtZXMpIHtcbiAgICB2YXIgaiwgbGVuLCBuZXh0LCBuZXh0cywgcG9zaWJpbGl0aWVzO1xuICAgIHBvc2liaWxpdGllcyA9IFtdO1xuICAgIG5leHRzID0gdGhpcy5nZXRDbWRGb2xsb3dBbGlhcyhjbWROYW1lKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBuZXh0cy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmV4dCA9IG5leHRzW2pdO1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKG5hbWVzLCB7XG4gICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgcm9vdDogbmV4dFxuICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICB9XG4gICAgcmV0dXJuIHBvc2liaWxpdGllcztcbiAgfVxuXG4gIGdldENtZEZvbGxvd0FsaWFzKG5hbWUpIHtcbiAgICB2YXIgY21kO1xuICAgIGNtZCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSk7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtjbWQsIGNtZC5nZXRBbGlhc2VkKCldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtjbWRdO1xuICAgIH1cbiAgICByZXR1cm4gW2NtZF07XG4gIH1cblxuICBjbWRJc1ZhbGlkKGNtZCkge1xuICAgIGlmIChjbWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoY21kLm5hbWUgIT09ICdmYWxsYmFjaycgJiYgaW5kZXhPZi5jYWxsKHRoaXMuYW5jZXN0b3JzKCksIGNtZCkgPj0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gIXRoaXMubXVzdEV4ZWN1dGUgfHwgdGhpcy5jbWRJc0V4ZWN1dGFibGUoY21kKTtcbiAgfVxuXG4gIGFuY2VzdG9ycygpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyByZWYuaW5JbnN0YW5jZSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKCk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNtZElzRXhlY3V0YWJsZShjbWQpIHtcbiAgICB2YXIgbmFtZXM7XG4gICAgbmFtZXMgPSB0aGlzLmdldERpcmVjdE5hbWVzKCk7XG4gICAgaWYgKG5hbWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZXNbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGUoKTtcbiAgICB9XG4gIH1cblxuICBjbWRTY29yZShjbWQpIHtcbiAgICB2YXIgc2NvcmU7XG4gICAgc2NvcmUgPSBjbWQuZGVwdGg7XG4gICAgaWYgKGNtZC5uYW1lID09PSAnZmFsbGJhY2snKSB7XG4gICAgICBzY29yZSAtPSAxMDAwO1xuICAgIH1cbiAgICByZXR1cm4gc2NvcmU7XG4gIH1cblxuICBiZXN0SW5Qb3NpYmlsaXRpZXMocG9zcykge1xuICAgIHZhciBiZXN0LCBiZXN0U2NvcmUsIGosIGxlbiwgcCwgc2NvcmU7XG4gICAgaWYgKHBvc3MubGVuZ3RoID4gMCkge1xuICAgICAgYmVzdCA9IG51bGw7XG4gICAgICBiZXN0U2NvcmUgPSBudWxsO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcG9zcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcG9zc1tqXTtcbiAgICAgICAgc2NvcmUgPSB0aGlzLmNtZFNjb3JlKHApO1xuICAgICAgICBpZiAoKGJlc3QgPT0gbnVsbCkgfHwgc2NvcmUgPj0gYmVzdFNjb3JlKSB7XG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmU7XG4gICAgICAgICAgYmVzdCA9IHA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBiZXN0O1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vQ29kZXdhdmUnO1xuaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IG9wdGlvbmFsUHJvbWlzZSB9IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgY2xhc3MgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY21kLEBjb250ZXh0KSAtPlxuICBcbiAgaW5pdDogLT5cbiAgICB1bmxlc3MgQGlzRW1wdHkoKSBvciBAaW5pdGVkXG4gICAgICBAaW5pdGVkID0gdHJ1ZVxuICAgICAgQF9nZXRDbWRPYmooKVxuICAgICAgQF9pbml0UGFyYW1zKClcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIEBjbWRPYmouaW5pdCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgc2V0UGFyYW06KG5hbWUsdmFsKS0+XG4gICAgQG5hbWVkW25hbWVdID0gdmFsXG4gIHB1c2hQYXJhbToodmFsKS0+XG4gICAgQHBhcmFtcy5wdXNoKHZhbClcbiAgZ2V0Q29udGV4dDogLT5cbiAgICB1bmxlc3MgQGNvbnRleHQ/XG4gICAgICBAY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICByZXR1cm4gQGNvbnRleHQgb3IgbmV3IENvbnRleHQoKVxuICBnZXRGaW5kZXI6IChjbWROYW1lKS0+XG4gICAgZmluZGVyID0gQGdldENvbnRleHQoKS5nZXRGaW5kZXIoY21kTmFtZSxuYW1lc3BhY2VzOkBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRDbWRPYmo6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIEBjbWQuaW5pdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5jbHM/XG4gICAgICAgIEBjbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKVxuICAgICAgICByZXR1cm4gQGNtZE9ialxuICBfaW5pdFBhcmFtczogLT5cbiAgICBAbmFtZWQgPSBAZ2V0RGVmYXVsdHMoKVxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICByZXR1cm4gW11cbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQGNtZD9cbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIHJldHVybiBAY21kLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJlcyA9IHt9XG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGNtZC5kZWZhdWx0cylcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBjbWRPYmouZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJldHVybiByZXNcbiAgICBlbHNlXG4gICAgICB7fVxuICBnZXRBbGlhc2VkOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICB1bmxlc3MgQGFsaWFzZWRDbWQ/XG4gICAgICAgIEBnZXRBbGlhc2VkRmluYWwoKVxuICAgICAgcmV0dXJuIEBhbGlhc2VkQ21kIG9yIG51bGxcbiAgZ2V0QWxpYXNlZEZpbmFsOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAYWxpYXNlZEZpbmFsQ21kP1xuICAgICAgICByZXR1cm4gQGFsaWFzZWRGaW5hbENtZCBvciBudWxsXG4gICAgICBpZiBAY21kLmFsaWFzT2Y/XG4gICAgICAgIGFsaWFzZWQgPSBAY21kXG4gICAgICAgIHdoaWxlIGFsaWFzZWQ/IGFuZCBhbGlhc2VkLmFsaWFzT2Y/XG4gICAgICAgICAgYWxpYXNlZCA9IGFsaWFzZWQuX2FsaWFzZWRGcm9tRmluZGVyKEBnZXRGaW5kZXIoQGFsdGVyQWxpYXNPZihhbGlhc2VkLmFsaWFzT2YpKSlcbiAgICAgICAgICB1bmxlc3MgQGFsaWFzZWRDbWQ/XG4gICAgICAgICAgICBAYWxpYXNlZENtZCA9IGFsaWFzZWQgb3IgZmFsc2VcbiAgICAgICAgQGFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgb3IgZmFsc2VcbiAgICAgICAgcmV0dXJuIGFsaWFzZWRcbiAgYWx0ZXJBbGlhc09mOiAoYWxpYXNPZiktPlxuICAgIGFsaWFzT2ZcbiAgZ2V0T3B0aW9uczogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9wdGlvbnM/XG4gICAgICAgIHJldHVybiBAY21kT3B0aW9uc1xuICAgICAgb3B0ID0gQGNtZC5fb3B0aW9uc0ZvckFsaWFzZWQoQGdldEFsaWFzZWQoKSlcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LEBjbWRPYmouZ2V0T3B0aW9ucygpKVxuICAgICAgQGNtZE9wdGlvbnMgPSBvcHRcbiAgICAgIHJldHVybiBvcHRcbiAgZ2V0T3B0aW9uOiAoa2V5KSAtPlxuICAgIG9wdGlvbnMgPSBAZ2V0T3B0aW9ucygpXG4gICAgaWYgb3B0aW9ucz8gYW5kIGtleSBvZiBvcHRpb25zXG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gIGdldFBhcmFtOiAobmFtZXMsIGRlZlZhbCA9IG51bGwpIC0+XG4gICAgbmFtZXMgPSBbbmFtZXNdIGlmICh0eXBlb2YgbmFtZXMgaW4gWydzdHJpbmcnLCdudW1iZXInXSlcbiAgICBmb3IgbiBpbiBuYW1lc1xuICAgICAgcmV0dXJuIEBuYW1lZFtuXSBpZiBAbmFtZWRbbl0/XG4gICAgICByZXR1cm4gQHBhcmFtc1tuXSBpZiBAcGFyYW1zW25dP1xuICAgIHJldHVybiBkZWZWYWxcbiAgZ2V0Qm9vbFBhcmFtOiAobmFtZXMsIGRlZlZhbCA9IG51bGwpIC0+XG4gICAgZmFsc2VWYWxzID0gW1wiXCIsXCIwXCIsXCJmYWxzZVwiLFwibm9cIixcIm5vbmVcIixmYWxzZSxudWxsLDBdXG4gICAgdmFsID0gQGdldFBhcmFtKG5hbWVzLCBkZWZWYWwpXG4gICAgIWZhbHNlVmFscy5pbmNsdWRlcyh2YWwpXG4gIGFuY2VzdG9yQ21kczogLT5cbiAgICBpZiBAY29udGV4dC5jb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKVxuICAgIHJldHVybiBbXVxuICBhbmNlc3RvckNtZHNBbmRTZWxmOiAtPlxuICAgIHJldHVybiBAYW5jZXN0b3JDbWRzKCkuY29uY2F0KFtAY21kXSlcbiAgcnVuRXhlY3V0ZUZ1bmN0OiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5leGVjdXRlKClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkRmluYWwoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuZXhlY3V0ZUZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKVxuICByYXdSZXN1bHQ6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZEZpbmFsKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLnJlc3VsdEZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpXG4gICAgICBpZiBjbWQucmVzdWx0U3RyP1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0clxuICByZXN1bHQ6IC0+IFxuICAgIEBpbml0KClcbiAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgb3B0aW9uYWxQcm9taXNlKEByYXdSZXN1bHQoKSkudGhlbiAocmVzKT0+XG4gICAgICAgIGlmIHJlcz9cbiAgICAgICAgICByZXMgPSBAZm9ybWF0SW5kZW50KHJlcylcbiAgICAgICAgICBpZiByZXMubGVuZ3RoID4gMCBhbmQgQGdldE9wdGlvbigncGFyc2UnLHRoaXMpIFxuICAgICAgICAgICAgcGFyc2VyID0gQGdldFBhcnNlckZvclRleHQocmVzKVxuICAgICAgICAgICAgcmVzID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgICAgICBpZiBhbHRlckZ1bmN0ID0gQGdldE9wdGlvbignYWx0ZXJSZXN1bHQnLHRoaXMpXG4gICAgICAgICAgICByZXMgPSBhbHRlckZ1bmN0KHJlcyx0aGlzKVxuICAgICAgICAgIHJldHVybiByZXNcbiAgICAgIC5yZXN1bHQoKVxuICBnZXRQYXJzZXJGb3JUZXh0OiAodHh0PScnKSAtPlxuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7aW5JbnN0YW5jZTp0aGlzfSlcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuICAgIHJldHVybiBwYXJzZXJcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHJldHVybiAwXG4gIGZvcm1hdEluZGVudDogKHRleHQpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcdC9nLCcgICcpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYXBwbHlJbmRlbnQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuaW5kZW50Tm90Rmlyc3QodGV4dCxAZ2V0SW5kZW50KCksXCIgXCIpIiwiaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBDb2Rld2F2ZVxufSBmcm9tICcuL0NvZGV3YXZlJztcblxuaW1wb3J0IHtcbiAgVGV4dFBhcnNlclxufSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIG9wdGlvbmFsUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IHZhciBDbWRJbnN0YW5jZSA9IGNsYXNzIENtZEluc3RhbmNlIHtcbiAgY29uc3RydWN0b3IoY21kMSwgY29udGV4dCkge1xuICAgIHRoaXMuY21kID0gY21kMTtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoISh0aGlzLmlzRW1wdHkoKSB8fCB0aGlzLmluaXRlZCkpIHtcbiAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2dldENtZE9iaigpO1xuICAgICAgdGhpcy5faW5pdFBhcmFtcygpO1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbWRPYmouaW5pdCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldFBhcmFtKG5hbWUsIHZhbCkge1xuICAgIHJldHVybiB0aGlzLm5hbWVkW25hbWVdID0gdmFsO1xuICB9XG5cbiAgcHVzaFBhcmFtKHZhbCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5wdXNoKHZhbCk7XG4gIH1cblxuICBnZXRDb250ZXh0KCkge1xuICAgIGlmICh0aGlzLmNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCBuZXcgQ29udGV4dCgpO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUpIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuZ2V0Q29udGV4dCgpLmdldEZpbmRlcihjbWROYW1lLCB7XG4gICAgICBuYW1lc3BhY2VzOiB0aGlzLl9nZXRQYXJlbnROYW1lc3BhY2VzKClcbiAgICB9KTtcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzO1xuICAgIHJldHVybiBmaW5kZXI7XG4gIH1cblxuICBfZ2V0Q21kT2JqKCkge1xuICAgIHZhciBjbWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY21kLmluaXQoKTtcbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuY2xzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9pbml0UGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWVkID0gdGhpcy5nZXREZWZhdWx0cygpO1xuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5jbWQgIT0gbnVsbDtcbiAgfVxuXG4gIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgIHZhciBhbGlhc2VkO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY21kLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldERlZmF1bHRzKCkge1xuICAgIHZhciBhbGlhc2VkLCByZXM7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJlcyA9IHt9O1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgYWxpYXNlZC5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZC5kZWZhdWx0cyk7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5jbWRPYmouZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZCgpIHtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5hbGlhc2VkQ21kIHx8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZEZpbmFsKCkge1xuICAgIHZhciBhbGlhc2VkO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkRmluYWxDbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGlhc2VkRmluYWxDbWQgfHwgbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgYWxpYXNlZCA9IHRoaXMuY21kO1xuICAgICAgICB3aGlsZSAoKGFsaWFzZWQgIT0gbnVsbCkgJiYgKGFsaWFzZWQuYWxpYXNPZiAhPSBudWxsKSkge1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcih0aGlzLmdldEZpbmRlcih0aGlzLmFsdGVyQWxpYXNPZihhbGlhc2VkLmFsaWFzT2YpKSk7XG4gICAgICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmFsaWFzZWRDbWQgPSBhbGlhc2VkIHx8IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgfHwgZmFsc2U7XG4gICAgICAgIHJldHVybiBhbGlhc2VkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFsdGVyQWxpYXNPZihhbGlhc09mKSB7XG4gICAgcmV0dXJuIGFsaWFzT2Y7XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHZhciBvcHQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPcHRpb25zO1xuICAgICAgfVxuICAgICAgb3B0ID0gdGhpcy5jbWQuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKTtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmNtZE9iai5nZXRPcHRpb25zKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbWRPcHRpb25zID0gb3B0O1xuICAgICAgcmV0dXJuIG9wdDtcbiAgICB9XG4gIH1cblxuICBnZXRPcHRpb24oa2V5KSB7XG4gICAgdmFyIG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIGlmICgob3B0aW9ucyAhPSBudWxsKSAmJiBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICBnZXRQYXJhbShuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBpLCBsZW4sIG4sIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0eXBlb2YgbmFtZXMpID09PSAnc3RyaW5nJyB8fCByZWYgPT09ICdudW1iZXInKSkge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbiA9IG5hbWVzW2ldO1xuICAgICAgaWYgKHRoaXMubmFtZWRbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lZFtuXTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBhcmFtc1tuXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtc1tuXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlZlZhbDtcbiAgfVxuXG4gIGdldEJvb2xQYXJhbShuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBmYWxzZVZhbHMsIHZhbDtcbiAgICBmYWxzZVZhbHMgPSBbXCJcIiwgXCIwXCIsIFwiZmFsc2VcIiwgXCJub1wiLCBcIm5vbmVcIiwgZmFsc2UsIG51bGwsIDBdO1xuICAgIHZhbCA9IHRoaXMuZ2V0UGFyYW0obmFtZXMsIGRlZlZhbCk7XG4gICAgcmV0dXJuICFmYWxzZVZhbHMuaW5jbHVkZXModmFsKTtcbiAgfVxuXG4gIGFuY2VzdG9yQ21kcygpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBhbmNlc3RvckNtZHNBbmRTZWxmKCkge1xuICAgIHJldHVybiB0aGlzLmFuY2VzdG9yQ21kcygpLmNvbmNhdChbdGhpcy5jbWRdKTtcbiAgfVxuXG4gIHJ1bkV4ZWN1dGVGdW5jdCgpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmouZXhlY3V0ZSgpO1xuICAgICAgfVxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmV4ZWN1dGVGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZUZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJhd1Jlc3VsdCgpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0KCk7XG4gICAgICB9XG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQucmVzdWx0RnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKGNtZC5yZXN1bHRTdHIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0cjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgaWYgKHRoaXMucmVzdWx0SXNBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbmFsUHJvbWlzZSh0aGlzLnJhd1Jlc3VsdCgpKS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgdmFyIGFsdGVyRnVuY3QsIHBhcnNlcjtcbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzID0gdGhpcy5mb3JtYXRJbmRlbnQocmVzKTtcbiAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDAgJiYgdGhpcy5nZXRPcHRpb24oJ3BhcnNlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHBhcnNlciA9IHRoaXMuZ2V0UGFyc2VyRm9yVGV4dChyZXMpO1xuICAgICAgICAgICAgcmVzID0gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhbHRlckZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2FsdGVyUmVzdWx0JywgdGhpcykpIHtcbiAgICAgICAgICAgIHJlcyA9IGFsdGVyRnVuY3QocmVzLCB0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuICAgICAgfSkucmVzdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyc2VyRm9yVGV4dCh0eHQgPSAnJykge1xuICAgIHZhciBwYXJzZXI7XG4gICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKHR4dCksIHtcbiAgICAgIGluSW5zdGFuY2U6IHRoaXNcbiAgICB9KTtcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICByZXR1cm4gcGFyc2VyO1xuICB9XG5cbiAgZ2V0SW5kZW50KCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZm9ybWF0SW5kZW50KHRleHQpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywgJyAgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5SW5kZW50KHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmluZGVudE5vdEZpcnN0KHRleHQsIHRoaXMuZ2V0SW5kZW50KCksIFwiIFwiKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUHJvY2VzcyB9IGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSB9IGZyb20gJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcic7XG5pbXBvcnQgeyBQb3NDb2xsZWN0aW9uIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQ2xvc2luZ1Byb21wIH0gZnJvbSAnLi9DbG9zaW5nUHJvbXAnO1xuXG5leHBvcnQgY2xhc3MgQ29kZXdhdmVcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBvcHRpb25zID0ge30pIC0+XG4gICAgQ29kZXdhdmUuaW5pdCgpXG4gICAgQG1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nXG4gICAgQHZhcnMgPSB7fVxuICAgIFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ2JyYWtldHMnIDogJ35+JyxcbiAgICAgICdkZWNvJyA6ICd+JyxcbiAgICAgICdjbG9zZUNoYXInIDogJy8nLFxuICAgICAgJ25vRXhlY3V0ZUNoYXInIDogJyEnLFxuICAgICAgJ2NhcnJldENoYXInIDogJ3wnLFxuICAgICAgJ2NoZWNrQ2FycmV0JyA6IHRydWUsXG4gICAgICAnaW5JbnN0YW5jZScgOiBudWxsXG4gICAgfVxuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIFxuICAgIEBuZXN0ZWQgPSBpZiBAcGFyZW50PyB0aGVuIEBwYXJlbnQubmVzdGVkKzEgZWxzZSAwXG4gICAgXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgQGVkaXRvci5iaW5kZWRUbyh0aGlzKSBpZiBAZWRpdG9yP1xuICAgIFxuICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQodGhpcylcbiAgICBpZiBAaW5JbnN0YW5jZT9cbiAgICAgIEBjb250ZXh0LnBhcmVudCA9IEBpbkluc3RhbmNlLmNvbnRleHRcblxuICAgIEBsb2dnZXIgPSBuZXcgTG9nZ2VyKClcblxuICBvbkFjdGl2YXRpb25LZXk6IC0+XG4gICAgQHByb2Nlc3MgPSBuZXcgUHJvY2VzcygpXG4gICAgQGxvZ2dlci5sb2coJ2FjdGl2YXRpb24ga2V5JylcbiAgICBAcnVuQXRDdXJzb3JQb3MoKS50aGVuID0+XG4gICAgICBAcHJvY2VzcyA9IG51bGxcbiAgcnVuQXRDdXJzb3JQb3M6IC0+XG4gICAgaWYgQGVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICAgIEBydW5BdE11bHRpUG9zKEBlZGl0b3IuZ2V0TXVsdGlTZWwoKSlcbiAgICBlbHNlXG4gICAgICBAcnVuQXRQb3MoQGVkaXRvci5nZXRDdXJzb3JQb3MoKSlcbiAgcnVuQXRQb3M6IChwb3MpLT5cbiAgICB1bmxlc3MgcG9zP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDdXJzb3IgUG9zaXRpb24gaXMgZW1wdHknKVxuICAgIEBydW5BdE11bHRpUG9zKFtwb3NdKVxuICBydW5BdE11bHRpUG9zOiAobXVsdGlQb3MpLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBpZiBtdWx0aVBvcy5sZW5ndGggPiAwXG4gICAgICAgIGNtZCA9IEBjb21tYW5kT25Qb3MobXVsdGlQb3NbMF0uZW5kKVxuICAgICAgICBpZiBjbWQ/XG4gICAgICAgICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgICAgICAgY21kLnNldE11bHRpUG9zKG11bHRpUG9zKVxuICAgICAgICAgIGNtZC5pbml0KClcbiAgICAgICAgICBAbG9nZ2VyLmxvZyhjbWQpXG4gICAgICAgICAgY21kLmV4ZWN1dGUoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbXVsdGlQb3NbMF0uc3RhcnQgPT0gbXVsdGlQb3NbMF0uZW5kXG4gICAgICAgICAgICBAYWRkQnJha2V0cyhtdWx0aVBvcylcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcylcbiAgY29tbWFuZE9uUG9zOiAocG9zKSAtPlxuICAgIGlmIEBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIGFuZCBAZm9sbG93ZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAxIFxuICAgICAgcHJldiA9IHBvcy1AYnJha2V0cy5sZW5ndGhcbiAgICAgIG5leHQgPSBwb3NcbiAgICBlbHNlXG4gICAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAwXG4gICAgICAgIHBvcyAtPSBAYnJha2V0cy5sZW5ndGhcbiAgICAgIHByZXYgPSBAZmluZFByZXZCcmFrZXQocG9zKVxuICAgICAgdW5sZXNzIHByZXY/XG4gICAgICAgIHJldHVybiBudWxsIFxuICAgICAgbmV4dCA9IEBmaW5kTmV4dEJyYWtldChwb3MtMSlcbiAgICAgIGlmICFuZXh0PyBvciBAY291bnRQcmV2QnJha2V0KHByZXYpICUgMiAhPSAwIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMscHJldixAZWRpdG9yLnRleHRTdWJzdHIocHJldixuZXh0K0BicmFrZXRzLmxlbmd0aCkpXG4gIG5leHRDbWQ6IChzdGFydCA9IDApIC0+XG4gICAgcG9zID0gc3RhcnRcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyAsW0BicmFrZXRzLFwiXFxuXCJdKVxuICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGhcbiAgICAgIGlmIGYuc3RyID09IEBicmFrZXRzXG4gICAgICAgIGlmIGJlZ2lubmluZz9cbiAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIEBlZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zK0BicmFrZXRzLmxlbmd0aCkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvc1xuICAgICAgZWxzZVxuICAgICAgICBiZWdpbm5pbmcgPSBudWxsXG4gICAgbnVsbFxuICBnZXRFbmNsb3NpbmdDbWQ6IChwb3MgPSAwKSAtPlxuICAgIGNwb3MgPSBwb3NcbiAgICBjbG9zaW5nUHJlZml4ID0gQGJyYWtldHMgKyBAY2xvc2VDaGFyXG4gICAgd2hpbGUgKHAgPSBAZmluZE5leHQoY3BvcyxjbG9zaW5nUHJlZml4KSk/XG4gICAgICBpZiBjbWQgPSBAY29tbWFuZE9uUG9zKHArY2xvc2luZ1ByZWZpeC5sZW5ndGgpXG4gICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgICAgaWYgY21kLnBvcyA8IHBvc1xuICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgIGVsc2VcbiAgICAgICAgY3BvcyA9IHArY2xvc2luZ1ByZWZpeC5sZW5ndGhcbiAgICBudWxsXG4gIHByZWNlZGVkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLUBicmFrZXRzLmxlbmd0aCxwb3MpID09IEBicmFrZXRzXG4gIGZvbGxvd2VkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLHBvcytAYnJha2V0cy5sZW5ndGgpID09IEBicmFrZXRzXG4gIGNvdW50UHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICBpID0gMFxuICAgIHdoaWxlIChzdGFydCA9IEBmaW5kUHJldkJyYWtldChzdGFydCkpP1xuICAgICAgaSsrXG4gICAgcmV0dXJuIGlcbiAgaXNFbmRMaW5lOiAocG9zKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrMSkgPT0gXCJcXG5cIiBvciBwb3MgKyAxID49IEBlZGl0b3IudGV4dExlbigpXG4gIGZpbmRQcmV2QnJha2V0OiAoc3RhcnQpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHRCcmFrZXQoc3RhcnQsLTEpXG4gIGZpbmROZXh0QnJha2V0OiAoc3RhcnQsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW0BicmFrZXRzLFwiXFxuXCJdLCBkaXJlY3Rpb24pXG4gICAgXG4gICAgZi5wb3MgaWYgZiBhbmQgZi5zdHIgPT0gQGJyYWtldHNcbiAgZmluZFByZXY6IChzdGFydCxzdHJpbmcpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHQoc3RhcnQsc3RyaW5nLC0xKVxuICBmaW5kTmV4dDogKHN0YXJ0LHN0cmluZyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBmID0gQGZpbmRBbnlOZXh0KHN0YXJ0ICxbc3RyaW5nXSwgZGlyZWN0aW9uKVxuICAgIGYucG9zIGlmIGZcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci5maW5kQW55TmV4dChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbilcbiAgICBcbiAgZmluZE1hdGNoaW5nUGFpcjogKHN0YXJ0UG9zLG9wZW5pbmcsY2xvc2luZyxkaXJlY3Rpb24gPSAxKSAtPlxuICAgIHBvcyA9IHN0YXJ0UG9zXG4gICAgbmVzdGVkID0gMFxuICAgIHdoaWxlIGYgPSBAZmluZEFueU5leHQocG9zLFtjbG9zaW5nLG9wZW5pbmddLGRpcmVjdGlvbilcbiAgICAgIHBvcyA9IGYucG9zICsgKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBmLnN0ci5sZW5ndGggZWxzZSAwKVxuICAgICAgaWYgZi5zdHIgPT0gKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBjbG9zaW5nIGVsc2Ugb3BlbmluZylcbiAgICAgICAgaWYgbmVzdGVkID4gMFxuICAgICAgICAgIG5lc3RlZC0tXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZlxuICAgICAgZWxzZVxuICAgICAgICBuZXN0ZWQrK1xuICAgIG51bGxcbiAgYWRkQnJha2V0czogKHBvcykgLT5cbiAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpXG4gICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAoQGJyYWtldHMsQGJyYWtldHMpLm1hcCggKHIpLT5yLnNlbGVjdENvbnRlbnQoKSApXG4gICAgQGVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIHByb21wdENsb3NpbmdDbWQ6IChzZWxlY3Rpb25zKSAtPlxuICAgIEBjbG9zaW5nUHJvbXAuc3RvcCgpIGlmIEBjbG9zaW5nUHJvbXA/XG4gICAgQGNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcC5uZXdGb3IodGhpcyxzZWxlY3Rpb25zKS5iZWdpbigpXG4gIHBhcnNlQWxsOiAocmVjdXJzaXZlID0gdHJ1ZSkgLT5cbiAgICBpZiBAbmVzdGVkID4gMTAwXG4gICAgICB0aHJvdyBcIkluZmluaXRlIHBhcnNpbmcgUmVjdXJzaW9uXCJcbiAgICBwb3MgPSAwXG4gICAgd2hpbGUgY21kID0gQG5leHRDbWQocG9zKVxuICAgICAgcG9zID0gY21kLmdldEVuZFBvcygpXG4gICAgICBAZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpXG4gICAgICAjIGNvbnNvbGUubG9nKGNtZClcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIHJlY3Vyc2l2ZSBhbmQgY21kLmNvbnRlbnQ/IGFuZCAoIWNtZC5nZXRDbWQoKT8gb3IgIWNtZC5nZXRPcHRpb24oJ3ByZXZlbnRQYXJzZUFsbCcpKVxuICAgICAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIoY21kLmNvbnRlbnQpLCB7cGFyZW50OiB0aGlzfSlcbiAgICAgICAgY21kLmNvbnRlbnQgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgcmVzID0gIGNtZC5leGVjdXRlKClcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgaWYgcmVzLnRoZW4/XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3luYyBuZXN0ZWQgY29tbWFuZHMgYXJlIG5vdCBzdXBwb3J0ZWQnKVxuICAgICAgICBpZiBjbWQucmVwbGFjZUVuZD9cbiAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcG9zID0gQGVkaXRvci5nZXRDdXJzb3JQb3MoKS5lbmRcbiAgICByZXR1cm4gQGdldFRleHQoKVxuICBnZXRUZXh0OiAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHQoKVxuICBpc1Jvb3Q6IC0+XG4gICAgcmV0dXJuICFAcGFyZW50PyBhbmQgKCFAaW5JbnN0YW5jZT8gb3IgIUBpbkluc3RhbmNlLmZpbmRlcj8pXG4gIGdldFJvb3Q6IC0+XG4gICAgaWYgQGlzUm9vdCgpXG4gICAgICByZXR1cm4gdGhpc1xuICAgIGVsc2UgaWYgQHBhcmVudD9cbiAgICAgIHJldHVybiBAcGFyZW50LmdldFJvb3QoKVxuICAgIGVsc2UgaWYgQGluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpXG4gIGdldEZpbGVTeXN0ZW06IC0+XG4gICAgaWYgQGVkaXRvci5maWxlU3lzdGVtXG4gICAgICByZXR1cm4gQGVkaXRvci5maWxlU3lzdGVtXG4gICAgZWxzZSBpZiBAaXNSb290KClcbiAgICAgIHJldHVybiBudWxsXG4gICAgZWxzZSBpZiBAcGFyZW50P1xuICAgICAgcmV0dXJuIEBwYXJlbnQuZ2V0Um9vdCgpXG4gICAgZWxzZSBpZiBAaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KClcbiAgcmVtb3ZlQ2FycmV0OiAodHh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHR4dCxAY2FycmV0Q2hhcilcbiAgZ2V0Q2FycmV0UG9zOiAodHh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCxAY2FycmV0Q2hhcilcbiAgcmVnTWFya2VyOiAoZmxhZ3M9XCJnXCIpIC0+XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAbWFya2VyKSwgZmxhZ3MpXG4gIHJlbW92ZU1hcmtlcnM6ICh0ZXh0KSAtPlxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoQHJlZ01hcmtlcigpLCcnKVxuXG4gIEBpbml0OiAtPlxuICAgIHVubGVzcyBAaW5pdGVkXG4gICAgICBAaW5pdGVkID0gdHJ1ZVxuICAgICAgQ29tbWFuZC5pbml0Q21kcygpXG4gICAgICBDb21tYW5kLmxvYWRDbWRzKClcblxuICBAaW5pdGVkOiBmYWxzZSIsImltcG9ydCB7XG4gIFByb2Nlc3Ncbn0gZnJvbSAnLi9Qcm9jZXNzJztcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBQb3NpdGlvbmVkQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UnO1xuXG5pbXBvcnQge1xuICBUZXh0UGFyc2VyXG59IGZyb20gJy4vVGV4dFBhcnNlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgTG9nZ2VyXG59IGZyb20gJy4vTG9nZ2VyJztcblxuaW1wb3J0IHtcbiAgUG9zQ29sbGVjdGlvblxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIENsb3NpbmdQcm9tcFxufSBmcm9tICcuL0Nsb3NpbmdQcm9tcCc7XG5cbmV4cG9ydCB2YXIgQ29kZXdhdmUgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIENvZGV3YXZlIHtcbiAgICBjb25zdHJ1Y3RvcihlZGl0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgICAgQ29kZXdhdmUuaW5pdCgpO1xuICAgICAgdGhpcy5tYXJrZXIgPSAnW1tbW2NvZGV3YXZlX21hcnF1ZXJdXV1dJztcbiAgICAgIHRoaXMudmFycyA9IHt9O1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICdicmFrZXRzJzogJ35+JyxcbiAgICAgICAgJ2RlY28nOiAnficsXG4gICAgICAgICdjbG9zZUNoYXInOiAnLycsXG4gICAgICAgICdub0V4ZWN1dGVDaGFyJzogJyEnLFxuICAgICAgICAnY2FycmV0Q2hhcic6ICd8JyxcbiAgICAgICAgJ2NoZWNrQ2FycmV0JzogdHJ1ZSxcbiAgICAgICAgJ2luSW5zdGFuY2UnOiBudWxsXG4gICAgICB9O1xuICAgICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcbiAgICAgIHRoaXMubmVzdGVkID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50Lm5lc3RlZCArIDEgOiAwO1xuICAgICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICB9IGVsc2UgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVkaXRvciAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLmJpbmRlZFRvKHRoaXMpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcyk7XG4gICAgICBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMuaW5JbnN0YW5jZS5jb250ZXh0O1xuICAgICAgfVxuICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG4gICAgfVxuXG4gICAgb25BY3RpdmF0aW9uS2V5KCkge1xuICAgICAgdGhpcy5wcm9jZXNzID0gbmV3IFByb2Nlc3MoKTtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKTtcbiAgICAgIHJldHVybiB0aGlzLnJ1bkF0Q3Vyc29yUG9zKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3MgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcnVuQXRDdXJzb3JQb3MoKSB7XG4gICAgICBpZiAodGhpcy5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkF0TXVsdGlQb3ModGhpcy5lZGl0b3IuZ2V0TXVsdGlTZWwoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdFBvcyh0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcnVuQXRQb3MocG9zKSB7XG4gICAgICBpZiAocG9zID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDdXJzb3IgUG9zaXRpb24gaXMgZW1wdHknKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJ1bkF0TXVsdGlQb3MoW3Bvc10pO1xuICAgIH1cblxuICAgIHJ1bkF0TXVsdGlQb3MobXVsdGlQb3MpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIGNtZDtcbiAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpO1xuICAgICAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgY21kLnNldE11bHRpUG9zKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNtZC5pbml0KCk7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coY21kKTtcbiAgICAgICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobXVsdGlQb3NbMF0uc3RhcnQgPT09IG11bHRpUG9zWzBdLmVuZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGRCcmFrZXRzKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21wdENsb3NpbmdDbWQobXVsdGlQb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29tbWFuZE9uUG9zKHBvcykge1xuICAgICAgdmFyIG5leHQsIHByZXY7XG4gICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuZm9sbG93ZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMSkge1xuICAgICAgICBwcmV2ID0gcG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgbmV4dCA9IHBvcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnByZWNlZGVkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDApIHtcbiAgICAgICAgICBwb3MgLT0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2ID0gdGhpcy5maW5kUHJldkJyYWtldChwb3MpO1xuICAgICAgICBpZiAocHJldiA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dCA9IHRoaXMuZmluZE5leHRCcmFrZXQocG9zIC0gMSk7XG4gICAgICAgIGlmICgobmV4dCA9PSBudWxsKSB8fCB0aGlzLmNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT09IDApIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgcHJldiwgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwcmV2LCBuZXh0ICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpO1xuICAgIH1cblxuICAgIG5leHRDbWQoc3RhcnQgPSAwKSB7XG4gICAgICB2YXIgYmVnaW5uaW5nLCBmLCBwb3M7XG4gICAgICBwb3MgPSBzdGFydDtcbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFt0aGlzLmJyYWtldHMsIFwiXFxuXCJdKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIGYuc3RyLmxlbmd0aDtcbiAgICAgICAgaWYgKGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGJlZ2lubmluZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBiZWdpbm5pbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIGJlZ2lubmluZywgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvcztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmVnaW5uaW5nID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0RW5jbG9zaW5nQ21kKHBvcyA9IDApIHtcbiAgICAgIHZhciBjbG9zaW5nUHJlZml4LCBjbWQsIGNwb3MsIHA7XG4gICAgICBjcG9zID0gcG9zO1xuICAgICAgY2xvc2luZ1ByZWZpeCA9IHRoaXMuYnJha2V0cyArIHRoaXMuY2xvc2VDaGFyO1xuICAgICAgd2hpbGUgKChwID0gdGhpcy5maW5kTmV4dChjcG9zLCBjbG9zaW5nUHJlZml4KSkgIT0gbnVsbCkge1xuICAgICAgICBpZiAoY21kID0gdGhpcy5jb21tYW5kT25Qb3MocCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoKSkge1xuICAgICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKCk7XG4gICAgICAgICAgaWYgKGNtZC5wb3MgPCBwb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNwb3MgPSBwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByZWNlZGVkQnlCcmFrZXRzKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aCwgcG9zKSA9PT0gdGhpcy5icmFrZXRzO1xuICAgIH1cblxuICAgIGZvbGxvd2VkQnlCcmFrZXRzKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSA9PT0gdGhpcy5icmFrZXRzO1xuICAgIH1cblxuICAgIGNvdW50UHJldkJyYWtldChzdGFydCkge1xuICAgICAgdmFyIGk7XG4gICAgICBpID0gMDtcbiAgICAgIHdoaWxlICgoc3RhcnQgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHN0YXJ0KSkgIT0gbnVsbCkge1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBpc0VuZExpbmUocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIDEpID09PSBcIlxcblwiIHx8IHBvcyArIDEgPj0gdGhpcy5lZGl0b3IudGV4dExlbigpO1xuICAgIH1cblxuICAgIGZpbmRQcmV2QnJha2V0KHN0YXJ0KSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dEJyYWtldChzdGFydCwgLTEpO1xuICAgIH1cblxuICAgIGZpbmROZXh0QnJha2V0KHN0YXJ0LCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZjtcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSwgZGlyZWN0aW9uKTtcbiAgICAgIGlmIChmICYmIGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgcmV0dXJuIGYucG9zO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRQcmV2KHN0YXJ0LCBzdHJpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmROZXh0KHN0YXJ0LCBzdHJpbmcsIC0xKTtcbiAgICB9XG5cbiAgICBmaW5kTmV4dChzdGFydCwgc3RyaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZjtcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbc3RyaW5nXSwgZGlyZWN0aW9uKTtcbiAgICAgIGlmIChmKSB7XG4gICAgICAgIHJldHVybiBmLnBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIGZpbmRNYXRjaGluZ1BhaXIoc3RhcnRQb3MsIG9wZW5pbmcsIGNsb3NpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmLCBuZXN0ZWQsIHBvcztcbiAgICAgIHBvcyA9IHN0YXJ0UG9zO1xuICAgICAgbmVzdGVkID0gMDtcbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtjbG9zaW5nLCBvcGVuaW5nXSwgZGlyZWN0aW9uKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIChkaXJlY3Rpb24gPiAwID8gZi5zdHIubGVuZ3RoIDogMCk7XG4gICAgICAgIGlmIChmLnN0ciA9PT0gKGRpcmVjdGlvbiA+IDAgPyBjbG9zaW5nIDogb3BlbmluZykpIHtcbiAgICAgICAgICBpZiAobmVzdGVkID4gMCkge1xuICAgICAgICAgICAgbmVzdGVkLS07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXN0ZWQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgYWRkQnJha2V0cyhwb3MpIHtcbiAgICAgIHZhciByZXBsYWNlbWVudHM7XG4gICAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpO1xuICAgICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAodGhpcy5icmFrZXRzLCB0aGlzLmJyYWtldHMpLm1hcChmdW5jdGlvbihyKSB7XG4gICAgICAgIHJldHVybiByLnNlbGVjdENvbnRlbnQoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gICAgfVxuXG4gICAgcHJvbXB0Q2xvc2luZ0NtZChzZWxlY3Rpb25zKSB7XG4gICAgICBpZiAodGhpcy5jbG9zaW5nUHJvbXAgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNsb3NpbmdQcm9tcC5zdG9wKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUHJvbXAgPSBDbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsIHNlbGVjdGlvbnMpLmJlZ2luKCk7XG4gICAgfVxuXG4gICAgcGFyc2VBbGwocmVjdXJzaXZlID0gdHJ1ZSkge1xuICAgICAgdmFyIGNtZCwgcGFyc2VyLCBwb3MsIHJlcztcbiAgICAgIGlmICh0aGlzLm5lc3RlZCA+IDEwMCkge1xuICAgICAgICB0aHJvdyBcIkluZmluaXRlIHBhcnNpbmcgUmVjdXJzaW9uXCI7XG4gICAgICB9XG4gICAgICBwb3MgPSAwO1xuICAgICAgd2hpbGUgKGNtZCA9IHRoaXMubmV4dENtZChwb3MpKSB7XG4gICAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKTtcbiAgICAgICAgdGhpcy5lZGl0b3Iuc2V0Q3Vyc29yUG9zKHBvcyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGNtZClcbiAgICAgICAgY21kLmluaXQoKTtcbiAgICAgICAgaWYgKHJlY3Vyc2l2ZSAmJiAoY21kLmNvbnRlbnQgIT0gbnVsbCkgJiYgKChjbWQuZ2V0Q21kKCkgPT0gbnVsbCkgfHwgIWNtZC5nZXRPcHRpb24oJ3ByZXZlbnRQYXJzZUFsbCcpKSkge1xuICAgICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcihjbWQuY29udGVudCksIHtcbiAgICAgICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNtZC5jb250ZW50ID0gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gY21kLmV4ZWN1dGUoKTtcbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgaWYgKHJlcy50aGVuICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN5bmMgbmVzdGVkIGNvbW1hbmRzIGFyZSBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjbWQucmVwbGFjZUVuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCkuZW5kO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VGV4dCgpO1xuICAgIH1cblxuICAgIGdldFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dCgpO1xuICAgIH1cblxuICAgIGlzUm9vdCgpIHtcbiAgICAgIHJldHVybiAodGhpcy5wYXJlbnQgPT0gbnVsbCkgJiYgKCh0aGlzLmluSW5zdGFuY2UgPT0gbnVsbCkgfHwgKHRoaXMuaW5JbnN0YW5jZS5maW5kZXIgPT0gbnVsbCkpO1xuICAgIH1cblxuICAgIGdldFJvb3QoKSB7XG4gICAgICBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Um9vdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRGaWxlU3lzdGVtKCkge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmZpbGVTeXN0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbGVTeXN0ZW07XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNSb290KCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2FycmV0KHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodHh0LCB0aGlzLmNhcnJldENoYXIpO1xuICAgIH1cblxuICAgIGdldENhcnJldFBvcyh0eHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCwgdGhpcy5jYXJyZXRDaGFyKTtcbiAgICB9XG5cbiAgICByZWdNYXJrZXIoZmxhZ3MgPSBcImdcIikge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm1hcmtlciksIGZsYWdzKTtcbiAgICB9XG5cbiAgICByZW1vdmVNYXJrZXJzKHRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UodGhpcy5yZWdNYXJrZXIoKSwgJycpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRlZCkge1xuICAgICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICAgIENvbW1hbmQuaW5pdENtZHMoKTtcbiAgICAgICAgcmV0dXJuIENvbW1hbmQubG9hZENtZHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfTtcblxuICBDb2Rld2F2ZS5pbml0ZWQgPSBmYWxzZTtcblxuICByZXR1cm4gQ29kZXdhdmU7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgU3RvcmFnZSB9IGZyb20gJy4vU3RvcmFnZSc7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuXG5fb3B0S2V5ID0gKGtleSxkaWN0LGRlZlZhbCA9IG51bGwpIC0+XG4gICMgb3B0aW9uYWwgRGljdGlvbmFyeSBrZXlcbiAgcmV0dXJuIGlmIGtleSBvZiBkaWN0IHRoZW4gZGljdFtrZXldIGVsc2UgZGVmVmFsXG5cblxuZXhwb3J0IGNsYXNzIENvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAbmFtZSxAZGF0YT1udWxsLHBhcmVudD1udWxsKSAtPlxuICAgIEBjbWRzID0gW11cbiAgICBAZGV0ZWN0b3JzID0gW11cbiAgICBAZXhlY3V0ZUZ1bmN0ID0gQHJlc3VsdEZ1bmN0ID0gQHJlc3VsdFN0ciA9IEBhbGlhc09mID0gQGNscyA9IG51bGxcbiAgICBAYWxpYXNlZCA9IG51bGxcbiAgICBAZnVsbE5hbWUgPSBAbmFtZVxuICAgIEBkZXB0aCA9IDBcbiAgICBbQF9wYXJlbnQsIEBfaW5pdGVkXSA9IFtudWxsLCBmYWxzZV1cbiAgICBAc2V0UGFyZW50KHBhcmVudClcbiAgICBAZGVmYXVsdHMgPSB7fVxuICAgIFxuICAgIEBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgY2hlY2tDYXJyZXQ6IHRydWUsXG4gICAgICBwYXJzZTogZmFsc2UsXG4gICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgYWx0ZXJSZXN1bHQ6IG51bGwsXG4gICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgICBhbGxvd2VkTmFtZWQ6IG51bGxcbiAgICB9XG4gICAgQG9wdGlvbnMgPSB7fVxuICAgIEBmaW5hbE9wdGlvbnMgPSBudWxsXG4gIHBhcmVudDogLT5cbiAgICByZXR1cm4gQF9wYXJlbnRcbiAgc2V0UGFyZW50OiAodmFsdWUpIC0+XG4gICAgaWYgQF9wYXJlbnQgIT0gdmFsdWVcbiAgICAgIEBfcGFyZW50ID0gdmFsdWVcbiAgICAgIEBmdWxsTmFtZSA9IChcbiAgICAgICAgaWYgQF9wYXJlbnQ/IGFuZCBAX3BhcmVudC5uYW1lP1xuICAgICAgICAgIEBfcGFyZW50LmZ1bGxOYW1lICsgJzonICsgQG5hbWUgXG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgQG5hbWVcbiAgICAgIClcbiAgICAgIEBkZXB0aCA9IChcbiAgICAgICAgaWYgQF9wYXJlbnQ/IGFuZCBAX3BhcmVudC5kZXB0aD9cbiAgICAgICAgdGhlbiBAX3BhcmVudC5kZXB0aCArIDFcbiAgICAgICAgZWxzZSAwXG4gICAgICApXG4gIGluaXQ6IC0+XG4gICAgaWYgIUBfaW5pdGVkXG4gICAgICBAX2luaXRlZCA9IHRydWVcbiAgICAgIEBwYXJzZURhdGEoQGRhdGEpXG4gICAgcmV0dXJuIHRoaXNcbiAgdW5yZWdpc3RlcjogLT5cbiAgICBAX3BhcmVudC5yZW1vdmVDbWQodGhpcylcbiAgaXNFZGl0YWJsZTogLT5cbiAgICByZXR1cm4gQHJlc3VsdFN0cj8gb3IgQGFsaWFzT2Y/XG4gIGlzRXhlY3V0YWJsZTogLT5cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICBmb3IgcCBpbiBbJ3Jlc3VsdFN0cicsJ3Jlc3VsdEZ1bmN0JywnY2xzJywnZXhlY3V0ZUZ1bmN0J11cbiAgICAgIGlmIHRoaXNbcF0/XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIGlzRXhlY3V0YWJsZVdpdGhOYW1lOiAobmFtZSkgLT5cbiAgICBpZiBAYWxpYXNPZj9cbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICBhbGlhc09mID0gQGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJyxuYW1lKVxuICAgICAgYWxpYXNlZCA9IEBfYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBAaXNFeGVjdXRhYmxlKClcbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgIGZvciBwIGluIFsncmVzdWx0U3RyJywncmVzdWx0RnVuY3QnXVxuICAgICAgaWYgdGhpc1twXT9cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgcmVzID0ge31cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGRlZmF1bHRzKVxuICAgIHJldHVybiByZXNcbiAgX2FsaWFzZWRGcm9tRmluZGVyOiAoZmluZGVyKSAtPlxuICAgICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlXG4gICAgICBmaW5kZXIubXVzdEV4ZWN1dGUgPSBmYWxzZVxuICAgICAgZmluZGVyLnVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICByZXR1cm4gZmluZGVyLmZpbmQoKVxuICBnZXRBbGlhc2VkOiAtPlxuICAgIGlmIEBhbGlhc09mP1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgIHJldHVybiBAX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKEBhbGlhc09mKSlcbiAgZ2V0QWxpYXNlZE9yVGhpczogLT5cbiAgICBAZ2V0QWxpYXNlZCgpIHx8IHRoaXNcbiAgc2V0T3B0aW9uczogKGRhdGEpIC0+XG4gICAgZm9yIGtleSwgdmFsIG9mIGRhdGFcbiAgICAgIGlmIGtleSBvZiBAZGVmYXVsdE9wdGlvbnNcbiAgICAgICAgQG9wdGlvbnNba2V5XSA9IHZhbFxuICBfb3B0aW9uc0ZvckFsaWFzZWQ6IChhbGlhc2VkKSAtPlxuICAgIG9wdCA9IHt9XG4gICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsQGRlZmF1bHRPcHRpb25zKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxhbGlhc2VkLmdldE9wdGlvbnMoKSlcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihvcHQsQG9wdGlvbnMpXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIEBfb3B0aW9uc0ZvckFsaWFzZWQoQGdldEFsaWFzZWQoKSlcbiAgZ2V0T3B0aW9uOiAoa2V5KSAtPlxuICAgIG9wdGlvbnMgPSBAZ2V0T3B0aW9ucygpXG4gICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV1cbiAgaGVscDogLT5cbiAgICBjbWQgPSBAZ2V0Q21kKCdoZWxwJylcbiAgICBpZiBjbWQ/XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHJcbiAgcGFyc2VEYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IGRhdGFcbiAgICBpZiB0eXBlb2YgZGF0YSA9PSAnc3RyaW5nJ1xuICAgICAgQHJlc3VsdFN0ciA9IGRhdGFcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlIGlmIGRhdGE/XG4gICAgICByZXR1cm4gQHBhcnNlRGljdERhdGEoZGF0YSlcbiAgICByZXR1cm4gZmFsc2VcbiAgcGFyc2VEaWN0RGF0YTogKGRhdGEpIC0+XG4gICAgcmVzID0gX29wdEtleSgncmVzdWx0JyxkYXRhKVxuICAgIGlmIHR5cGVvZiByZXMgPT0gXCJmdW5jdGlvblwiXG4gICAgICBAcmVzdWx0RnVuY3QgPSByZXNcbiAgICBlbHNlIGlmIHJlcz9cbiAgICAgIEByZXN1bHRTdHIgPSByZXNcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJyxkYXRhKVxuICAgIGlmIHR5cGVvZiBleGVjdXRlID09IFwiZnVuY3Rpb25cIlxuICAgICAgQGV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGVcbiAgICBAYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLGRhdGEpXG4gICAgQGNscyA9IF9vcHRLZXkoJ2NscycsZGF0YSlcbiAgICBAZGVmYXVsdHMgPSBfb3B0S2V5KCdkZWZhdWx0cycsZGF0YSxAZGVmYXVsdHMpXG4gICAgXG4gICAgQHNldE9wdGlvbnMoZGF0YSlcbiAgICBcbiAgICBpZiAnaGVscCcgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsZGF0YVsnaGVscCddLHRoaXMpKVxuICAgIGlmICdmYWxsYmFjaycgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLGRhdGFbJ2ZhbGxiYWNrJ10sdGhpcykpXG4gICAgICBcbiAgICBpZiAnY21kcycgb2YgZGF0YVxuICAgICAgQGFkZENtZHMoZGF0YVsnY21kcyddKVxuICAgIHJldHVybiB0cnVlXG4gIGFkZENtZHM6IChjbWRzKSAtPlxuICAgIGZvciBuYW1lLCBkYXRhIG9mIGNtZHNcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQobmFtZSxkYXRhLHRoaXMpKVxuICBhZGRDbWQ6IChjbWQpIC0+XG4gICAgZXhpc3RzID0gQGdldENtZChjbWQubmFtZSlcbiAgICBpZiBleGlzdHM/XG4gICAgICBAcmVtb3ZlQ21kKGV4aXN0cylcbiAgICBjbWQuc2V0UGFyZW50KHRoaXMpXG4gICAgQGNtZHMucHVzaChjbWQpXG4gICAgcmV0dXJuIGNtZFxuICByZW1vdmVDbWQ6IChjbWQpIC0+XG4gICAgaWYgKGkgPSBAY21kcy5pbmRleE9mKGNtZCkpID4gLTFcbiAgICAgIEBjbWRzLnNwbGljZShpLCAxKVxuICAgIHJldHVybiBjbWRcbiAgZ2V0Q21kOiAoZnVsbG5hbWUpIC0+XG4gICAgQGluaXQoKVxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgcmV0dXJuIEBnZXRDbWQoc3BhY2UpPy5nZXRDbWQobmFtZSlcbiAgICBmb3IgY21kIGluIEBjbWRzXG4gICAgICBpZiBjbWQubmFtZSA9PSBuYW1lXG4gICAgICAgIHJldHVybiBjbWRcbiAgc2V0Q21kRGF0YTogKGZ1bGxuYW1lLGRhdGEpIC0+XG4gICAgQHNldENtZChmdWxsbmFtZSxuZXcgQ29tbWFuZChmdWxsbmFtZS5zcGxpdCgnOicpLnBvcCgpLGRhdGEpKVxuICBzZXRDbWQ6IChmdWxsbmFtZSxjbWQpIC0+XG4gICAgW3NwYWNlLG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpXG4gICAgaWYgc3BhY2U/XG4gICAgICBuZXh0ID0gQGdldENtZChzcGFjZSlcbiAgICAgIHVubGVzcyBuZXh0P1xuICAgICAgICBuZXh0ID0gQGFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpXG4gICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSxjbWQpXG4gICAgZWxzZVxuICAgICAgQGFkZENtZChjbWQpXG4gICAgICByZXR1cm4gY21kXG4gIGFkZERldGVjdG9yOiAoZGV0ZWN0b3IpIC0+XG4gICAgQGRldGVjdG9ycy5wdXNoKGRldGVjdG9yKVxuICAgIFxuICBAcHJvdmlkZXJzID0gW11cblxuICBAc3RvcmFnZSA9IG5ldyBTdG9yYWdlKClcblxuICBAaW5pdENtZHM6IC0+XG4gICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCx7XG4gICAgICAnY21kcyc6e1xuICAgICAgICAnaGVsbG8nOntcbiAgICAgICAgICBoZWxwOiBcIlwiXCJcbiAgICAgICAgICBcIkhlbGxvLCB3b3JsZCFcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxuICAgICAgICAgIG1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xuICAgICAgICAgIHZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYVxuICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGZvciBwcm92aWRlciBpbiBAcHJvdmlkZXJzXG4gICAgICBwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpXG5cbiAgQHNhdmVDbWQ6IChmdWxsbmFtZSwgZGF0YSkgLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSxkYXRhKVxuICAgIC50aGVuID0+XG4gICAgICBAc3RvcmFnZS5zYXZlSW5QYXRoKCdjbWRzJywgZnVsbG5hbWUsIGRhdGEpXG5cbiAgQGxvYWRDbWRzOiAtPlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgIHNhdmVkQ21kcyA9IEBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgIC50aGVuIChzYXZlZENtZHMpPT5cbiAgICAgIGlmIHNhdmVkQ21kcz8gXG4gICAgICAgIGZvciBmdWxsbmFtZSwgZGF0YSBvZiBzYXZlZENtZHNcbiAgICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSlcblxuICBAcmVzZXRTYXZlZDogLT5cbiAgICBAc3RvcmFnZS5zYXZlKCdjbWRzJyx7fSlcblxuICBAbWFrZVZhckNtZCA9IChuYW1lLGJhc2U9e30pIC0+IFxuICAgIGJhc2UuZXhlY3V0ZSA9IChpbnN0YW5jZSkgLT5cbiAgICAgIHZhbCA9IGlmIChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpP1xuICAgICAgICBwXG4gICAgICBlbHNlIGlmIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgICAgaW5zdGFuY2UuY29udGVudFxuICAgICAgaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHZhbCBpZiB2YWw/XG4gICAgcmV0dXJuIGJhc2VcblxuICBAbWFrZUJvb2xWYXJDbWQgPSAobmFtZSxiYXNlPXt9KSAtPiBcbiAgICBiYXNlLmV4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHVubGVzcyB2YWw/IGFuZCB2YWwgaW4gWycwJywnZmFsc2UnLCdubyddXG4gICAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlXG4gICAgcmV0dXJuIGJhc2VcbiAgXG5cbmV4cG9ydCBjbGFzcyBCYXNlQ29tbWFuZFxuICBjb25zdHJ1Y3RvcjogKEBpbnN0YW5jZSkgLT5cbiAgaW5pdDogLT5cbiAgICAjXG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIHJldHVybiB0aGlzW1wicmVzdWx0XCJdP1xuICBnZXREZWZhdWx0czogLT5cbiAgICByZXR1cm4ge31cbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4ge31cbiAgICAgICIsInZhciBfb3B0S2V5O1xuXG5pbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIFN0b3JhZ2Vcbn0gZnJvbSAnLi9TdG9yYWdlJztcblxuaW1wb3J0IHtcbiAgTmFtZXNwYWNlSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5fb3B0S2V5ID0gZnVuY3Rpb24oa2V5LCBkaWN0LCBkZWZWYWwgPSBudWxsKSB7XG4gIC8vIG9wdGlvbmFsIERpY3Rpb25hcnkga2V5XG4gIGlmIChrZXkgaW4gZGljdCkge1xuICAgIHJldHVybiBkaWN0W2tleV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRlZlZhbDtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBDb21tYW5kID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lMSwgZGF0YTEgPSBudWxsLCBwYXJlbnQgPSBudWxsKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lMTtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGExO1xuICAgICAgdGhpcy5jbWRzID0gW107XG4gICAgICB0aGlzLmRldGVjdG9ycyA9IFtdO1xuICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSB0aGlzLnJlc3VsdEZ1bmN0ID0gdGhpcy5yZXN1bHRTdHIgPSB0aGlzLmFsaWFzT2YgPSB0aGlzLmNscyA9IG51bGw7XG4gICAgICB0aGlzLmFsaWFzZWQgPSBudWxsO1xuICAgICAgdGhpcy5mdWxsTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgIHRoaXMuZGVwdGggPSAwO1xuICAgICAgW3RoaXMuX3BhcmVudCwgdGhpcy5faW5pdGVkXSA9IFtudWxsLCBmYWxzZV07XG4gICAgICB0aGlzLnNldFBhcmVudChwYXJlbnQpO1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IHt9O1xuICAgICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgICBwYXJzZTogZmFsc2UsXG4gICAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgICByZXBsYWNlQm94OiBmYWxzZSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBudWxsXG4gICAgICB9O1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgICB0aGlzLmZpbmFsT3B0aW9ucyA9IG51bGw7XG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICB9XG5cbiAgICBzZXRQYXJlbnQodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLl9wYXJlbnQgIT09IHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHZhbHVlO1xuICAgICAgICB0aGlzLmZ1bGxOYW1lID0gKCh0aGlzLl9wYXJlbnQgIT0gbnVsbCkgJiYgKHRoaXMuX3BhcmVudC5uYW1lICE9IG51bGwpID8gdGhpcy5fcGFyZW50LmZ1bGxOYW1lICsgJzonICsgdGhpcy5uYW1lIDogdGhpcy5uYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwdGggPSAoKHRoaXMuX3BhcmVudCAhPSBudWxsKSAmJiAodGhpcy5fcGFyZW50LmRlcHRoICE9IG51bGwpID8gdGhpcy5fcGFyZW50LmRlcHRoICsgMSA6IDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoIXRoaXMuX2luaXRlZCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnBhcnNlRGF0YSh0aGlzLmRhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpO1xuICAgIH1cblxuICAgIGlzRWRpdGFibGUoKSB7XG4gICAgICByZXR1cm4gKHRoaXMucmVzdWx0U3RyICE9IG51bGwpIHx8ICh0aGlzLmFsaWFzT2YgIT0gbnVsbCk7XG4gICAgfVxuXG4gICAgaXNFeGVjdXRhYmxlKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmO1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICB9XG4gICAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCcsICdjbHMnLCAnZXhlY3V0ZUZ1bmN0J107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHJlZltqXTtcbiAgICAgICAgaWYgKHRoaXNbcF0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZSkge1xuICAgICAgdmFyIGFsaWFzT2YsIGFsaWFzZWQsIGNvbnRleHQ7XG4gICAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICAgIGFsaWFzT2YgPSB0aGlzLmFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJywgbmFtZSk7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLl9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihhbGlhc09mKSk7XG4gICAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaXNFeGVjdXRhYmxlKCk7XG4gICAgfVxuXG4gICAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgaiwgbGVuLCBwLCByZWY7XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG4gICAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCddO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal07XG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldERlZmF1bHRzKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIHJlcztcbiAgICAgIHJlcyA9IHt9O1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgYWxpYXNlZC5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgX2FsaWFzZWRGcm9tRmluZGVyKGZpbmRlcikge1xuICAgICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlO1xuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2U7XG4gICAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2U7XG4gICAgICByZXR1cm4gZmluZGVyLmZpbmQoKTtcbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkKCkge1xuICAgICAgdmFyIGNvbnRleHQ7XG4gICAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcih0aGlzLmFsaWFzT2YpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkT3JUaGlzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxpYXNlZCgpIHx8IHRoaXM7XG4gICAgfVxuXG4gICAgc2V0T3B0aW9ucyhkYXRhKSB7XG4gICAgICB2YXIga2V5LCByZXN1bHRzLCB2YWw7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG4gICAgICAgIHZhbCA9IGRhdGFba2V5XTtcbiAgICAgICAgaWYgKGtleSBpbiB0aGlzLmRlZmF1bHRPcHRpb25zKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMub3B0aW9uc1trZXldID0gdmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgX29wdGlvbnNGb3JBbGlhc2VkKGFsaWFzZWQpIHtcbiAgICAgIHZhciBvcHQ7XG4gICAgICBvcHQgPSB7fTtcbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmRlZmF1bHRPcHRpb25zKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIGFsaWFzZWQuZ2V0T3B0aW9ucygpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5vcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb25zKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb24oa2V5KSB7XG4gICAgICB2YXIgb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhlbHAoKSB7XG4gICAgICB2YXIgY21kO1xuICAgICAgY21kID0gdGhpcy5nZXRDbWQoJ2hlbHAnKTtcbiAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VEYXRhKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gZGF0YTtcbiAgICAgICAgdGhpcy5vcHRpb25zWydwYXJzZSddID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGRhdGEgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURpY3REYXRhKGRhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHBhcnNlRGljdERhdGEoZGF0YSkge1xuICAgICAgdmFyIGV4ZWN1dGUsIHJlcztcbiAgICAgIHJlcyA9IF9vcHRLZXkoJ3Jlc3VsdCcsIGRhdGEpO1xuICAgICAgaWYgKHR5cGVvZiByZXMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLnJlc3VsdEZ1bmN0ID0gcmVzO1xuICAgICAgfSBlbHNlIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IHJlcztcbiAgICAgICAgdGhpcy5vcHRpb25zWydwYXJzZSddID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJywgZGF0YSk7XG4gICAgICBpZiAodHlwZW9mIGV4ZWN1dGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLmV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGU7XG4gICAgICB9XG4gICAgICB0aGlzLmFsaWFzT2YgPSBfb3B0S2V5KCdhbGlhc09mJywgZGF0YSk7XG4gICAgICB0aGlzLmNscyA9IF9vcHRLZXkoJ2NscycsIGRhdGEpO1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IF9vcHRLZXkoJ2RlZmF1bHRzJywgZGF0YSwgdGhpcy5kZWZhdWx0cyk7XG4gICAgICB0aGlzLnNldE9wdGlvbnMoZGF0YSk7XG4gICAgICBpZiAoJ2hlbHAnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLCBkYXRhWydoZWxwJ10sIHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIGlmICgnZmFsbGJhY2snIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2ZhbGxiYWNrJywgZGF0YVsnZmFsbGJhY2snXSwgdGhpcykpO1xuICAgICAgfVxuICAgICAgaWYgKCdjbWRzJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kcyhkYXRhWydjbWRzJ10pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYWRkQ21kcyhjbWRzKSB7XG4gICAgICB2YXIgZGF0YSwgbmFtZSwgcmVzdWx0cztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAobmFtZSBpbiBjbWRzKSB7XG4gICAgICAgIGRhdGEgPSBjbWRzW25hbWVdO1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGRDbWQobmV3IENvbW1hbmQobmFtZSwgZGF0YSwgdGhpcykpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIGFkZENtZChjbWQpIHtcbiAgICAgIHZhciBleGlzdHM7XG4gICAgICBleGlzdHMgPSB0aGlzLmdldENtZChjbWQubmFtZSk7XG4gICAgICBpZiAoZXhpc3RzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbWQoZXhpc3RzKTtcbiAgICAgIH1cbiAgICAgIGNtZC5zZXRQYXJlbnQodGhpcyk7XG4gICAgICB0aGlzLmNtZHMucHVzaChjbWQpO1xuICAgICAgcmV0dXJuIGNtZDtcbiAgICB9XG5cbiAgICByZW1vdmVDbWQoY21kKSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmICgoaSA9IHRoaXMuY21kcy5pbmRleE9mKGNtZCkpID4gLTEpIHtcbiAgICAgICAgdGhpcy5jbWRzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjbWQ7XG4gICAgfVxuXG4gICAgZ2V0Q21kKGZ1bGxuYW1lKSB7XG4gICAgICB2YXIgY21kLCBqLCBsZW4sIG5hbWUsIHJlZiwgcmVmMSwgc3BhY2U7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gKHJlZiA9IHRoaXMuZ2V0Q21kKHNwYWNlKSkgIT0gbnVsbCA/IHJlZi5nZXRDbWQobmFtZSkgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgICByZWYxID0gdGhpcy5jbWRzO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmMS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBjbWQgPSByZWYxW2pdO1xuICAgICAgICBpZiAoY21kLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gY21kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0Q21kKGZ1bGxuYW1lLCBuZXcgQ29tbWFuZChmdWxsbmFtZS5zcGxpdCgnOicpLnBvcCgpLCBkYXRhKSk7XG4gICAgfVxuXG4gICAgc2V0Q21kKGZ1bGxuYW1lLCBjbWQpIHtcbiAgICAgIHZhciBuYW1lLCBuZXh0LCBzcGFjZTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgICBuZXh0ID0gdGhpcy5nZXRDbWQoc3BhY2UpO1xuICAgICAgICBpZiAobmV4dCA9PSBudWxsKSB7XG4gICAgICAgICAgbmV4dCA9IHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKHNwYWNlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5leHQuc2V0Q21kKG5hbWUsIGNtZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFkZENtZChjbWQpO1xuICAgICAgICByZXR1cm4gY21kO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZERldGVjdG9yKGRldGVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXRlY3RvcnMucHVzaChkZXRlY3Rvcik7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXRDbWRzKCkge1xuICAgICAgdmFyIGosIGxlbiwgcHJvdmlkZXIsIHJlZiwgcmVzdWx0cztcbiAgICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwsIHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ2hlbGxvJzoge1xuICAgICAgICAgICAgaGVscDogXCJcXFwiSGVsbG8sIHdvcmxkIVxcXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cXG5tb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cXG52ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWFcIixcbiAgICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlZiA9IHRoaXMucHJvdmlkZXJzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHByb3ZpZGVyID0gcmVmW2pdO1xuICAgICAgICByZXN1bHRzLnB1c2gocHJvdmlkZXIucmVnaXN0ZXIoQ29tbWFuZC5jbWRzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBzdGF0aWMgc2F2ZUNtZChmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZUluUGF0aCgnY21kcycsIGZ1bGxuYW1lLCBkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBsb2FkQ21kcygpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcztcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHRoaXMuc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gICAgICB9KS50aGVuKChzYXZlZENtZHMpID0+IHtcbiAgICAgICAgdmFyIGRhdGEsIGZ1bGxuYW1lLCByZXN1bHRzO1xuICAgICAgICBpZiAoc2F2ZWRDbWRzICE9IG51bGwpIHtcbiAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChmdWxsbmFtZSBpbiBzYXZlZENtZHMpIHtcbiAgICAgICAgICAgIGRhdGEgPSBzYXZlZENtZHNbZnVsbG5hbWVdO1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXRTYXZlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZSgnY21kcycsIHt9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZVZhckNtZChuYW1lLCBiYXNlID0ge30pIHtcbiAgICAgIGJhc2UuZXhlY3V0ZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBwLCB2YWw7XG4gICAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gICAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIG1ha2VCb29sVmFyQ21kKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHAsIHZhbDtcbiAgICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcbiAgICAgICAgaWYgKCEoKHZhbCAhPSBudWxsKSAmJiAodmFsID09PSAnMCcgfHwgdmFsID09PSAnZmFsc2UnIHx8IHZhbCA9PT0gJ25vJykpKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuXG4gIH07XG5cbiAgQ29tbWFuZC5wcm92aWRlcnMgPSBbXTtcblxuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpO1xuXG4gIHJldHVybiBDb21tYW5kO1xuXG59KS5jYWxsKHRoaXMpO1xuXG5leHBvcnQgdmFyIEJhc2VDb21tYW5kID0gY2xhc3MgQmFzZUNvbW1hbmQge1xuICBjb25zdHJ1Y3RvcihpbnN0YW5jZTEpIHtcbiAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2UxO1xuICB9XG5cbiAgaW5pdCgpIHt9XG5cbiAgXG4gIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgIHJldHVybiB0aGlzW1wicmVzdWx0XCJdICE9IG51bGw7XG4gIH1cblxuICBnZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDbWRGaW5kZXIgfSBmcm9tICcuL0NtZEZpbmRlcic7XG5pbXBvcnQgeyBDbWRJbnN0YW5jZSB9IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgQ29udGV4dFxuICBjb25zdHJ1Y3RvcjogKEBjb2Rld2F2ZSkgLT5cbiAgICBAbmFtZVNwYWNlcyA9IFtdXG4gIFxuICBhZGROYW1lU3BhY2U6IChuYW1lKSAtPlxuICAgIGlmIG5hbWUgbm90IGluIEBuYW1lU3BhY2VzIFxuICAgICAgQG5hbWVTcGFjZXMucHVzaChuYW1lKVxuICAgICAgQF9uYW1lc3BhY2VzID0gbnVsbFxuICBhZGROYW1lc3BhY2VzOiAoc3BhY2VzKSAtPlxuICAgIGlmIHNwYWNlcyBcbiAgICAgIGlmIHR5cGVvZiBzcGFjZXMgPT0gJ3N0cmluZydcbiAgICAgICAgc3BhY2VzID0gW3NwYWNlc11cbiAgICAgIGZvciBzcGFjZSBpbiBzcGFjZXMgXG4gICAgICAgIEBhZGROYW1lU3BhY2Uoc3BhY2UpXG4gIHJlbW92ZU5hbWVTcGFjZTogKG5hbWUpIC0+XG4gICAgQG5hbWVTcGFjZXMgPSBAbmFtZVNwYWNlcy5maWx0ZXIgKG4pIC0+IG4gaXNudCBuYW1lXG5cbiAgZ2V0TmFtZVNwYWNlczogLT5cbiAgICB1bmxlc3MgQF9uYW1lc3BhY2VzP1xuICAgICAgbnBjcyA9IEBuYW1lU3BhY2VzXG4gICAgICBpZiBAcGFyZW50P1xuICAgICAgICBucGNzID0gbnBjcy5jb25jYXQoQHBhcmVudC5nZXROYW1lU3BhY2VzKCkpXG4gICAgICBAX25hbWVzcGFjZXMgPSBBcnJheUhlbHBlci51bmlxdWUobnBjcylcbiAgICByZXR1cm4gQF9uYW1lc3BhY2VzXG4gIGdldENtZDogKGNtZE5hbWUsb3B0aW9ucyA9IHt9KSAtPlxuICAgIGZpbmRlciA9IEBnZXRGaW5kZXIoY21kTmFtZSxvcHRpb25zKVxuICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUsb3B0aW9ucyA9IHt9KSAtPlxuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgbmFtZXNwYWNlczogW11cbiAgICAgIHVzZURldGVjdG9yczogQGlzUm9vdCgpXG4gICAgICBjb2Rld2F2ZTogQGNvZGV3YXZlXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSxvcHRpb25zKSlcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD9cbiAgZ2V0UGFyZW50T3JSb290OiAoKSAtPlxuICAgIGlmIEBwYXJlbnQ/XG4gICAgICBAcGFyZW50XG4gICAgZWxzZVxuICAgICAgdGhpc1xuICB3cmFwQ29tbWVudDogKHN0cikgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgY2MuaW5kZXhPZignJXMnKSA+IC0xXG4gICAgICByZXR1cm4gY2MucmVwbGFjZSgnJXMnLHN0cilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHIgKyAnICcgKyBjY1xuICB3cmFwQ29tbWVudExlZnQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gY2Muc3Vic3RyKDAsaSkgKyBzdHJcbiAgICBlbHNlXG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHJcbiAgd3JhcENvbW1lbnRSaWdodDogKHN0ciA9ICcnKSAtPlxuICAgIGNjID0gQGdldENvbW1lbnRDaGFyKClcbiAgICBpZiAoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTFcbiAgICAgIHJldHVybiBzdHIgKyBjYy5zdWJzdHIoaSsyKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBzdHIgKyAnICcgKyBjY1xuICBjbWRJbnN0YW5jZUZvcjogKGNtZCkgLT5cbiAgICByZXR1cm4gbmV3IENtZEluc3RhbmNlKGNtZCx0aGlzKVxuICBnZXRDb21tZW50Q2hhcjogLT5cbiAgICBpZiBAY29tbWVudENoYXI/XG4gICAgICByZXR1cm4gQGNvbW1lbnRDaGFyXG4gICAgY21kID0gQGdldENtZCgnY29tbWVudCcpXG4gICAgY2hhciA9ICc8IS0tICVzIC0tPidcbiAgICBpZiBjbWQ/XG4gICAgICBpbnN0ID0gQGNtZEluc3RhbmNlRm9yKGNtZClcbiAgICAgIGluc3QuY29udGVudCA9ICclcydcbiAgICAgIHJlcyA9IGluc3QucmVzdWx0KClcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgY2hhciA9IHJlc1xuICAgIEBjb21tZW50Q2hhciA9IGNoYXJcbiAgICByZXR1cm4gQGNvbW1lbnRDaGFyIiwidmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xuXG5pbXBvcnQge1xuICBDbWRGaW5kZXJcbn0gZnJvbSAnLi9DbWRGaW5kZXInO1xuXG5pbXBvcnQge1xuICBDbWRJbnN0YW5jZVxufSBmcm9tICcuL0NtZEluc3RhbmNlJztcblxuaW1wb3J0IHtcbiAgQXJyYXlIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcblxuZXhwb3J0IHZhciBDb250ZXh0ID0gY2xhc3MgQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlKSB7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlO1xuICAgIHRoaXMubmFtZVNwYWNlcyA9IFtdO1xuICB9XG5cbiAgYWRkTmFtZVNwYWNlKG5hbWUpIHtcbiAgICBpZiAoaW5kZXhPZi5jYWxsKHRoaXMubmFtZVNwYWNlcywgbmFtZSkgPCAwKSB7XG4gICAgICB0aGlzLm5hbWVTcGFjZXMucHVzaChuYW1lKTtcbiAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2VzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGROYW1lc3BhY2VzKHNwYWNlcykge1xuICAgIHZhciBqLCBsZW4sIHJlc3VsdHMsIHNwYWNlO1xuICAgIGlmIChzcGFjZXMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3BhY2VzID09PSAnc3RyaW5nJykge1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHNwYWNlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBzcGFjZSA9IHNwYWNlc1tqXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuYWRkTmFtZVNwYWNlKHNwYWNlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICByZW1vdmVOYW1lU3BhY2UobmFtZSkge1xuICAgIHJldHVybiB0aGlzLm5hbWVTcGFjZXMgPSB0aGlzLm5hbWVTcGFjZXMuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuICE9PSBuYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TmFtZVNwYWNlcygpIHtcbiAgICB2YXIgbnBjcztcbiAgICBpZiAodGhpcy5fbmFtZXNwYWNlcyA9PSBudWxsKSB7XG4gICAgICBucGNzID0gdGhpcy5uYW1lU3BhY2VzO1xuICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KHRoaXMucGFyZW50LmdldE5hbWVTcGFjZXMoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9uYW1lc3BhY2VzID0gQXJyYXlIZWxwZXIudW5pcXVlKG5wY3MpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcztcbiAgfVxuXG4gIGdldENtZChjbWROYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMpO1xuICAgIHJldHVybiBmaW5kZXIuZmluZCgpO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgbmFtZXNwYWNlczogW10sXG4gICAgICB1c2VEZXRlY3RvcnM6IHRoaXMuaXNSb290KCksXG4gICAgICBjb2Rld2F2ZTogdGhpcy5jb2Rld2F2ZSxcbiAgICAgIHBhcmVudENvbnRleHQ6IHRoaXNcbiAgICB9LCBvcHRpb25zKSk7XG4gIH1cblxuICBpc1Jvb3QoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09IG51bGw7XG4gIH1cblxuICBnZXRQYXJlbnRPclJvb3QoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnQoc3RyKSB7XG4gICAgdmFyIGNjO1xuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpO1xuICAgIGlmIChjYy5pbmRleE9mKCclcycpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsIHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50TGVmdChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gY2Muc3Vic3RyKDAsIGkpICsgc3RyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHI7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnRSaWdodChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkgKyAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIGNtZEluc3RhbmNlRm9yKGNtZCkge1xuICAgIHJldHVybiBuZXcgQ21kSW5zdGFuY2UoY21kLCB0aGlzKTtcbiAgfVxuXG4gIGdldENvbW1lbnRDaGFyKCkge1xuICAgIHZhciBjaGFyLCBjbWQsIGluc3QsIHJlcztcbiAgICBpZiAodGhpcy5jb21tZW50Q2hhciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgICB9XG4gICAgY21kID0gdGhpcy5nZXRDbWQoJ2NvbW1lbnQnKTtcbiAgICBjaGFyID0gJzwhLS0gJXMgLS0+JztcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGluc3QgPSB0aGlzLmNtZEluc3RhbmNlRm9yKGNtZCk7XG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnO1xuICAgICAgcmVzID0gaW5zdC5yZXN1bHQoKTtcbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICBjaGFyID0gcmVzO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbW1lbnRDaGFyID0gY2hhcjtcbiAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0Q21kUHJvcFxuICBjb25zdHJ1Y3RvcjogKEBuYW1lLG9wdGlvbnMpIC0+XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAndmFyJyA6IG51bGwsXG4gICAgICAnb3B0JyA6IG51bGwsXG4gICAgICAnZnVuY3QnIDogbnVsbCxcbiAgICAgICdkYXRhTmFtZScgOiBudWxsLFxuICAgICAgJ3Nob3dFbXB0eScgOiBmYWxzZSxcbiAgICAgICdjYXJyZXQnIDogZmFsc2UsXG4gICAgfVxuICAgIGZvciBrZXkgaW4gWyd2YXInLCdvcHQnLCdmdW5jdCddXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICBkZWZhdWx0c1snZGF0YU5hbWUnXSA9IG9wdGlvbnNba2V5XVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgICAgICBcbiAgc2V0Q21kOiAoY21kcykgLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZChAbmFtZSlcbiAgXG4gIHdyaXRlRm9yOiAocGFyc2VyLG9iaikgLT5cbiAgICBpZiBwYXJzZXIudmFyc1tAbmFtZV0/XG4gICAgICBvYmpbQGRhdGFOYW1lXSA9IHBhcnNlci52YXJzW0BuYW1lXVxuICB2YWxGcm9tQ21kOiAoY21kKSAtPlxuICAgIGlmIGNtZD9cbiAgICAgIGlmIEBvcHQ/XG4gICAgICAgIHJldHVybiBjbWQuZ2V0T3B0aW9uKEBvcHQpXG4gICAgICBpZiBAZnVuY3Q/XG4gICAgICAgIHJldHVybiBjbWRbQGZ1bmN0XSgpXG4gICAgICBpZiBAdmFyP1xuICAgICAgICByZXR1cm4gY21kW0B2YXJdXG4gIHNob3dGb3JDbWQ6IChjbWQpIC0+XG4gICAgdmFsID0gQHZhbEZyb21DbWQoY21kKVxuICAgIHJldHVybiBAc2hvd0VtcHR5IG9yIHZhbD9cbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICBpZiBAc2hvd0ZvckNtZChjbWQpXG4gICAgICBcIlwiXCJcbiAgICAgIH5+I3tAbmFtZX1+flxuICAgICAgI3tAdmFsRnJvbUNtZChjbWQpIG9yIFwiXCJ9I3tpZiBAY2FycmV0IHRoZW4gXCJ8XCIgZWxzZSBcIlwifVxuICAgICAgfn4vI3tAbmFtZX1+flxuICAgICAgXCJcIlwiXG4gICAgXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5zb3VyY2UgZXh0ZW5kcyBFZGl0Q21kUHJvcCBcbiAgdmFsRnJvbUNtZDogKGNtZCktPlxuICAgIHJlcyA9IHN1cGVyKGNtZClcbiAgICBpZiByZXM/XG4gICAgICByZXMgPSByZXMucmVwbGFjZSgvXFx8L2csICd8fCcpXG4gICAgcmV0dXJuIHJlc1xuICBzZXRDbWQ6IChjbWRzKS0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQoQG5hbWUseydwcmV2ZW50UGFyc2VBbGwnIDogdHJ1ZX0pXG4gIHNob3dGb3JDbWQ6IChjbWQpIC0+XG4gICAgdmFsID0gQHZhbEZyb21DbWQoY21kKVxuICAgIHJldHVybiAoQHNob3dFbXB0eSBhbmQgIShjbWQ/IGFuZCBjbWQuYWxpYXNPZj8pKSBvciB2YWw/XG4gICAgXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5zdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIGlmIEB2YWxGcm9tQ21kKGNtZCk/XG4gICAgICByZXR1cm4gXCJ+fiEje0BuYW1lfSAnI3tAdmFsRnJvbUNtZChjbWQpfSN7aWYgQGNhcnJldCB0aGVuIFwifFwiIGVsc2UgXCJcIn0nfn5cIlxuICAgIFxuICAgIFxuY2xhc3MgRWRpdENtZFByb3AucmV2Qm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIHNldENtZDogKGNtZHMpIC0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKEBuYW1lKVxuICB3cml0ZUZvcjogKHBhcnNlcixvYmopIC0+XG4gICAgaWYgcGFyc2VyLnZhcnNbQG5hbWVdP1xuICAgICAgb2JqW0BkYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbQG5hbWVdXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgdmFsID0gQHZhbEZyb21DbWQoY21kKVxuICAgIGlmIHZhbD8gYW5kICF2YWxcbiAgICAgIHJldHVybiBcIn5+ISN7QG5hbWV9fn5cIlxuXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5ib29sIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgc2V0Q21kOiAoY21kcykgLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQoQG5hbWUpXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgXCJ+fiEje0BuYW1lfX5+XCIgaWYgQHZhbEZyb21DbWQoY21kKSIsImltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBFZGl0Q21kUHJvcCA9IGNsYXNzIEVkaXRDbWRQcm9wIHtcbiAgY29uc3RydWN0b3IobmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywgaSwga2V5LCBsZW4sIHJlZiwgdmFsO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAndmFyJzogbnVsbCxcbiAgICAgICdvcHQnOiBudWxsLFxuICAgICAgJ2Z1bmN0JzogbnVsbCxcbiAgICAgICdkYXRhTmFtZSc6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JzogZmFsc2UsXG4gICAgICAnY2FycmV0JzogZmFsc2VcbiAgICB9O1xuICAgIHJlZiA9IFsndmFyJywgJ29wdCcsICdmdW5jdCddO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAga2V5ID0gcmVmW2ldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGRlZmF1bHRzWydkYXRhTmFtZSddID0gb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICB3cml0ZUZvcihwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSBwYXJzZXIudmFyc1t0aGlzLm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHZhbEZyb21DbWQoY21kKSB7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5vcHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmdldE9wdGlvbih0aGlzLm9wdCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5mdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy5mdW5jdF0oKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnZhciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy52YXJdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3dGb3JDbWQoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgfHwgKHZhbCAhPSBudWxsKTtcbiAgfVxuXG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMuc2hvd0ZvckNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+JHt0aGlzLm5hbWV9fn5cXG4ke3RoaXMudmFsRnJvbUNtZChjbWQpIHx8IFwiXCJ9JHsodGhpcy5jYXJyZXQgPyBcInxcIiA6IFwiXCIpfVxcbn5+LyR7dGhpcy5uYW1lfX5+YDtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZFByb3Auc291cmNlID0gY2xhc3Mgc291cmNlIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICB2YWxGcm9tQ21kKGNtZCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gc3VwZXIudmFsRnJvbUNtZChjbWQpO1xuICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgcmVzID0gcmVzLnJlcGxhY2UoL1xcfC9nLCAnfHwnKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZCh0aGlzLm5hbWUsIHtcbiAgICAgICdwcmV2ZW50UGFyc2VBbGwnOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBzaG93Rm9yQ21kKGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG4gICAgcmV0dXJuICh0aGlzLnNob3dFbXB0eSAmJiAhKChjbWQgIT0gbnVsbCkgJiYgKGNtZC5hbGlhc09mICE9IG51bGwpKSkgfHwgKHZhbCAhPSBudWxsKTtcbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5zdHJpbmcgPSBjbGFzcyBzdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9ICcke3RoaXMudmFsRnJvbUNtZChjbWQpfSR7KHRoaXMuY2FycmV0ID8gXCJ8XCIgOiBcIlwiKX0nfn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5yZXZCb29sID0gY2xhc3MgcmV2Qm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgd3JpdGVGb3IocGFyc2VyLCBvYmopIHtcbiAgICBpZiAocGFyc2VyLnZhcnNbdGhpcy5uYW1lXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gb2JqW3RoaXMuZGF0YU5hbWVdID0gIXBhcnNlci52YXJzW3RoaXMubmFtZV07XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIGlmICgodmFsICE9IG51bGwpICYmICF2YWwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5ib29sID0gY2xhc3MgYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgU3RyUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuaW1wb3J0IHsgb3B0aW9uYWxQcm9taXNlIH0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQG5hbWVzcGFjZSA9IG51bGxcbiAgICBAX2xhbmcgPSBudWxsXG4gIGJpbmRlZFRvOiAoY29kZXdhdmUpIC0+XG4gICAgI1xuICB0ZXh0OiAodmFsKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRMZW46IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCA9IG51bGwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBiZWdpblVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBlbmRVbmRvQWN0aW9uOiAtPlxuICAgICNcbiAgZ2V0TGFuZzogLT5cbiAgICByZXR1cm4gQF9sYW5nXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdDogLT5cbiAgICByZXR1cm4gbnVsbFxuICBhbGxvd011bHRpU2VsZWN0aW9uOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBzZXRNdWx0aVNlbDogKHNlbGVjdGlvbnMpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRNdWx0aVNlbDogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGNhbkxpc3RlblRvQ2hhbmdlOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIFxuICBnZXRMaW5lQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQGZpbmRMaW5lU3RhcnQocG9zKSxAZmluZExpbmVFbmQocG9zKSlcbiAgZmluZExpbmVTdGFydDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiXSwgLTEpXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcysxIGVsc2UgMFxuICBmaW5kTGluZUVuZDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiLFwiXFxyXCJdKVxuICAgIHJldHVybiBpZiBwIHRoZW4gcC5wb3MgZWxzZSBAdGV4dExlbigpXG4gIFxuICBmaW5kQW55TmV4dDogKHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgaWYgZGlyZWN0aW9uID4gMFxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LEB0ZXh0TGVuKCkpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKDAsc3RhcnQpXG4gICAgYmVzdFBvcyA9IG51bGxcbiAgICBmb3Igc3RyaSBpbiBzdHJpbmdzXG4gICAgICBwb3MgPSBpZiBkaXJlY3Rpb24gPiAwIHRoZW4gdGV4dC5pbmRleE9mKHN0cmkpIGVsc2UgdGV4dC5sYXN0SW5kZXhPZihzdHJpKVxuICAgICAgaWYgcG9zICE9IC0xXG4gICAgICAgIGlmICFiZXN0UG9zPyBvciBiZXN0UG9zKmRpcmVjdGlvbiA+IHBvcypkaXJlY3Rpb25cbiAgICAgICAgICBiZXN0UG9zID0gcG9zXG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmlcbiAgICBpZiBiZXN0U3RyP1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBiZXN0UG9zICsgc3RhcnQgZWxzZSBiZXN0UG9zKSxiZXN0U3RyKVxuICAgIHJldHVybiBudWxsXG4gIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICByZXBsYWNlbWVudHMucmVkdWNlKChwcm9taXNlLHJlcGwpPT5cbiAgICAgICAgcHJvbWlzZS50aGVuIChvcHQpPT5cbiAgICAgICAgICByZXBsLndpdGhFZGl0b3IodGhpcylcbiAgICAgICAgICByZXBsLmFwcGx5T2Zmc2V0KG9wdC5vZmZzZXQpXG4gICAgICAgICAgb3B0aW9uYWxQcm9taXNlKHJlcGwuYXBwbHkoKSkudGhlbiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzZWxlY3Rpb25zOiBvcHQuc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKSxcbiAgICAgICAgICAgICAgb2Zmc2V0OiBvcHQub2Zmc2V0K3JlcGwub2Zmc2V0QWZ0ZXIodGhpcykgXG4gICAgICAgICAgICB9XG4gICAgICAsIG9wdGlvbmFsUHJvbWlzZSh7c2VsZWN0aW9uczogW10sb2Zmc2V0OiAwfSkpXG4gICAgLnRoZW4gKG9wdCk9PlxuICAgICAgQGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhvcHQuc2VsZWN0aW9ucylcbiAgICAucmVzdWx0KClcbiAgICBcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnM6IChzZWxlY3Rpb25zKSAtPlxuICAgIGlmIHNlbGVjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgaWYgQGFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgICAgICBAc2V0TXVsdGlTZWwoc2VsZWN0aW9ucylcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldEN1cnNvclBvcyhzZWxlY3Rpb25zWzBdLnN0YXJ0LHNlbGVjdGlvbnNbMF0uZW5kKSIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFN0clBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5cbmltcG9ydCB7XG4gIG9wdGlvbmFsUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IHZhciBFZGl0b3IgPSBjbGFzcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG51bGw7XG4gICAgdGhpcy5fbGFuZyA9IG51bGw7XG4gIH1cblxuICBiaW5kZWRUbyhjb2Rld2F2ZSkge31cblxuICBcbiAgdGV4dCh2YWwpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dENoYXJBdChwb3MpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dExlbigpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dFN1YnN0cihzdGFydCwgZW5kKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGluc2VydFRleHRBdCh0ZXh0LCBwb3MpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGdldEN1cnNvclBvcygpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQgPSBudWxsKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGJlZ2luVW5kb0FjdGlvbigpIHt9XG5cbiAgXG4gIGVuZFVuZG9BY3Rpb24oKSB7fVxuXG4gIFxuICBnZXRMYW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICB9XG5cbiAgc2V0TGFuZyh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFuZyA9IHZhbDtcbiAgfVxuXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdCgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFsbG93TXVsdGlTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2V0TXVsdGlTZWwoc2VsZWN0aW9ucykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRNdWx0aVNlbCgpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0TGluZUF0KHBvcykge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMuZmluZExpbmVTdGFydChwb3MpLCB0aGlzLmZpbmRMaW5lRW5kKHBvcykpO1xuICB9XG5cbiAgZmluZExpbmVTdGFydChwb3MpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtcIlxcblwiXSwgLTEpO1xuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3MgKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICBmaW5kTGluZUVuZChwb3MpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtcIlxcblwiLCBcIlxcclwiXSk7XG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dExlbigpO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgdmFyIGJlc3RQb3MsIGJlc3RTdHIsIGksIGxlbiwgcG9zLCBzdHJpLCB0ZXh0O1xuICAgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0LCB0aGlzLnRleHRMZW4oKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoMCwgc3RhcnQpO1xuICAgIH1cbiAgICBiZXN0UG9zID0gbnVsbDtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzdHJpbmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzdHJpID0gc3RyaW5nc1tpXTtcbiAgICAgIHBvcyA9IGRpcmVjdGlvbiA+IDAgPyB0ZXh0LmluZGV4T2Yoc3RyaSkgOiB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpO1xuICAgICAgaWYgKHBvcyAhPT0gLTEpIHtcbiAgICAgICAgaWYgKChiZXN0UG9zID09IG51bGwpIHx8IGJlc3RQb3MgKiBkaXJlY3Rpb24gPiBwb3MgKiBkaXJlY3Rpb24pIHtcbiAgICAgICAgICBiZXN0UG9zID0gcG9zO1xuICAgICAgICAgIGJlc3RTdHIgPSBzdHJpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChiZXN0U3RyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3RyUG9zKChkaXJlY3Rpb24gPiAwID8gYmVzdFBvcyArIHN0YXJ0IDogYmVzdFBvcyksIGJlc3RTdHIpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cykge1xuICAgIHJldHVybiByZXBsYWNlbWVudHMucmVkdWNlKChwcm9taXNlLCByZXBsKSA9PiB7XG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKChvcHQpID0+IHtcbiAgICAgICAgcmVwbC53aXRoRWRpdG9yKHRoaXMpO1xuICAgICAgICByZXBsLmFwcGx5T2Zmc2V0KG9wdC5vZmZzZXQpO1xuICAgICAgICByZXR1cm4gb3B0aW9uYWxQcm9taXNlKHJlcGwuYXBwbHkoKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnM6IG9wdC5zZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpLFxuICAgICAgICAgICAgb2Zmc2V0OiBvcHQub2Zmc2V0ICsgcmVwbC5vZmZzZXRBZnRlcih0aGlzKVxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSwgb3B0aW9uYWxQcm9taXNlKHtcbiAgICAgIHNlbGVjdGlvbnM6IFtdLFxuICAgICAgb2Zmc2V0OiAwXG4gICAgfSkpLnRoZW4oKG9wdCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKG9wdC5zZWxlY3Rpb25zKTtcbiAgICB9KS5yZXN1bHQoKTtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhzZWxlY3Rpb25zKSB7XG4gICAgaWYgKHNlbGVjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHRoaXMuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldE11bHRpU2VsKHNlbGVjdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q3Vyc29yUG9zKHNlbGVjdGlvbnNbMF0uc3RhcnQsIHNlbGVjdGlvbnNbMF0uZW5kKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBMb2dnZXJcbiAgQGVuYWJsZWQgPSB0cnVlXG4gIGxvZzogKGFyZ3MuLi4pIC0+XG4gICAgaWYgQGlzRW5hYmxlZCgpXG4gICAgICBmb3IgbXNnIGluIGFyZ3NcbiAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICBpc0VuYWJsZWQ6IC0+XG4gICAgY29uc29sZT8ubG9nPyBhbmQgdGhpcy5lbmFibGVkIGFuZCBMb2dnZXIuZW5hYmxlZFxuICBlbmFibGVkOiB0cnVlXG4gIHJ1bnRpbWU6IChmdW5jdCxuYW1lID0gXCJmdW5jdGlvblwiKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGNvbnNvbGUubG9nKFwiI3tuYW1lfSB0b29rICN7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLlwiKVxuICAgIHJlc1xuICBtb25pdG9yRGF0YToge31cbiAgdG9Nb25pdG9yOiAob2JqLG5hbWUscHJlZml4PScnKSAtPlxuICAgIGZ1bmN0ID0gb2JqW25hbWVdXG4gICAgb2JqW25hbWVdID0gLT4gXG4gICAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgICB0aGlzLm1vbml0b3IoKC0+IGZ1bmN0LmFwcGx5KG9iaixhcmdzKSkscHJlZml4K25hbWUpXG4gIG1vbml0b3I6IChmdW5jdCxuYW1lKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGlmIHRoaXMubW9uaXRvckRhdGFbbmFtZV0/XG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLmNvdW50KytcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwrPSB0MSAtIHQwXG4gICAgZWxzZVxuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgY291bnQ6IDFcbiAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgIH1cbiAgICByZXNcbiAgcmVzdW1lOiAtPlxuICAgIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpXG4iLCJleHBvcnQgdmFyIExvZ2dlciA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgTG9nZ2VyIHtcbiAgICBsb2coLi4uYXJncykge1xuICAgICAgdmFyIGksIGxlbiwgbXNnLCByZXN1bHRzO1xuICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbXNnID0gYXJnc1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY29uc29sZS5sb2cobXNnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgcmV0dXJuICgodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZSAhPT0gbnVsbCA/IGNvbnNvbGUubG9nIDogdm9pZCAwKSAhPSBudWxsKSAmJiB0aGlzLmVuYWJsZWQgJiYgTG9nZ2VyLmVuYWJsZWQ7XG4gICAgfVxuXG4gICAgcnVudGltZShmdW5jdCwgbmFtZSA9IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgY29uc29sZS5sb2coYCR7bmFtZX0gdG9vayAke3QxIC0gdDB9IG1pbGxpc2Vjb25kcy5gKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgdG9Nb25pdG9yKG9iaiwgbmFtZSwgcHJlZml4ID0gJycpIHtcbiAgICAgIHZhciBmdW5jdDtcbiAgICAgIGZ1bmN0ID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIG9ialtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgcmV0dXJuIHRoaXMubW9uaXRvcigoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0LmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgIH0pLCBwcmVmaXggKyBuYW1lKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgbW9uaXRvcihmdW5jdCwgbmFtZSkge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgaWYgKHRoaXMubW9uaXRvckRhdGFbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLmNvdW50Kys7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwgKz0gdDEgLSB0MDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0gPSB7XG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgcmVzdW1lKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpO1xuICAgIH1cblxuICB9O1xuXG4gIExvZ2dlci5lbmFibGVkID0gdHJ1ZTtcblxuICBMb2dnZXIucHJvdG90eXBlLmVuYWJsZWQgPSB0cnVlO1xuXG4gIExvZ2dlci5wcm90b3R5cGUubW9uaXRvckRhdGEgPSB7fTtcblxuICByZXR1cm4gTG9nZ2VyO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiZXhwb3J0IGNsYXNzIE9wdGlvbk9iamVjdFxuICBzZXRPcHRzOiAob3B0aW9ucyxkZWZhdWx0cyktPlxuICAgIEBkZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgQHNldE9wdChrZXksb3B0aW9uc1trZXldKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0T3B0KGtleSx2YWwpXG4gICAgICAgIFxuICBzZXRPcHQ6IChrZXksIHZhbCktPlxuICAgIGlmIHRoaXNba2V5XT8uY2FsbD9cbiAgICAgIHRoaXNba2V5XSh2YWwpXG4gICAgZWxzZVxuICAgICAgdGhpc1trZXldPSB2YWxcbiAgICAgICAgXG4gIGdldE9wdDogKGtleSktPlxuICAgIGlmIHRoaXNba2V5XT8uY2FsbD9cbiAgICAgIHJldHVybiB0aGlzW2tleV0oKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0aGlzW2tleV1cbiAgXG4gIGdldE9wdHM6IC0+XG4gICAgb3B0cyA9IHt9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgb3B0c1trZXldID0gQGdldE9wdChrZXkpXG4gICAgcmV0dXJuIG9wdHMiLCJleHBvcnQgdmFyIE9wdGlvbk9iamVjdCA9IGNsYXNzIE9wdGlvbk9iamVjdCB7XG4gIHNldE9wdHMob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIga2V5LCByZWYsIHJlc3VsdHMsIHZhbDtcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCBvcHRpb25zW2tleV0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIHZhbCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIHNldE9wdChrZXksIHZhbCkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0odmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBnZXRPcHQoa2V5KSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdHMoKSB7XG4gICAgdmFyIGtleSwgb3B0cywgcmVmLCB2YWw7XG4gICAgb3B0cyA9IHt9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIG9wdHNba2V5XSA9IHRoaXMuZ2V0T3B0KGtleSk7XG4gICAgfVxuICAgIHJldHVybiBvcHRzO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDbWRJbnN0YW5jZSB9IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi9Cb3hIZWxwZXInO1xuaW1wb3J0IHsgUGFyYW1QYXJzZXIgfSBmcm9tICcuL3N0cmluZ1BhcnNlcnMvUGFyYW1QYXJzZXInO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgU3RyUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcbmltcG9ydCB7IG9wdGlvbmFsUHJvbWlzZSB9IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsQHBvcyxAc3RyKSAtPlxuICAgIHN1cGVyKClcbiAgICB1bmxlc3MgQGlzRW1wdHkoKVxuICAgICAgQF9jaGVja0Nsb3NlcigpXG4gICAgICBAb3BlbmluZyA9IEBzdHJcbiAgICAgIEBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICAgIEBfc3BsaXRDb21wb25lbnRzKClcbiAgICAgIEBfZmluZENsb3NpbmcoKVxuICAgICAgQF9jaGVja0Vsb25nYXRlZCgpXG4gIF9jaGVja0Nsb3NlcjogLT5cbiAgICBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICBpZiBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5jbG9zZUNoYXIgYW5kIGYgPSBAX2ZpbmRPcGVuaW5nUG9zKClcbiAgICAgIEBjbG9zaW5nUG9zID0gbmV3IFN0clBvcyhAcG9zLCBAc3RyKVxuICAgICAgQHBvcyA9IGYucG9zXG4gICAgICBAc3RyID0gZi5zdHJcbiAgX2ZpbmRPcGVuaW5nUG9zOiAtPlxuICAgIGNtZE5hbWUgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cikuc3Vic3RyaW5nKEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKVxuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWVcbiAgICBjbG9zaW5nID0gQHN0clxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zLG9wZW5pbmcsY2xvc2luZywtMSlcbiAgICAgIGYuc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcytmLnN0ci5sZW5ndGgpK0Bjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgICAgIHJldHVybiBmXG4gIF9zcGxpdENvbXBvbmVudHM6IC0+XG4gICAgcGFydHMgPSBAbm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICBAY21kTmFtZSA9IHBhcnRzLnNoaWZ0KClcbiAgICBAcmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIilcbiAgX3BhcnNlUGFyYW1zOihwYXJhbXMpIC0+XG4gICAgcGFyc2VyID0gbmV3IFBhcmFtUGFyc2VyKHBhcmFtcywge1xuICAgICAgYWxsb3dlZE5hbWVkOiBAZ2V0T3B0aW9uKCdhbGxvd2VkTmFtZWQnKSxcbiAgICAgIHZhcnM6IEBjb2Rld2F2ZS52YXJzXG4gICAgfSlcbiAgICBAcGFyYW1zID0gcGFyc2VyLnBhcmFtc1xuICAgIEBuYW1lZCA9IE9iamVjdC5hc3NpZ24oQGdldERlZmF1bHRzKCksIHBhcnNlci5uYW1lZClcbiAgICBpZiBAY21kP1xuICAgICAgbmFtZVRvUGFyYW0gPSBAZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpXG4gICAgICBpZiBuYW1lVG9QYXJhbT8gXG4gICAgICAgIEBuYW1lZFtuYW1lVG9QYXJhbV0gPSBAY21kTmFtZVxuICBfZmluZENsb3Npbmc6IC0+XG4gICAgaWYgZiA9IEBfZmluZENsb3NpbmdQb3MoKVxuICAgICAgQGNvbnRlbnQgPSBTdHJpbmdIZWxwZXIudHJpbUVtcHR5TGluZShAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcytAc3RyLmxlbmd0aCxmLnBvcykpXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZi5wb3MrZi5zdHIubGVuZ3RoKVxuICBfZmluZENsb3NpbmdQb3M6IC0+XG4gICAgcmV0dXJuIEBjbG9zaW5nUG9zIGlmIEBjbG9zaW5nUG9zP1xuICAgIGNsb3NpbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY21kTmFtZSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgb3BlbmluZyA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNtZE5hbWVcbiAgICBpZiBmID0gQGNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIoQHBvcytAc3RyLmxlbmd0aCwgb3BlbmluZywgY2xvc2luZylcbiAgICAgIHJldHVybiBAY2xvc2luZ1BvcyA9IGZcbiAgX2NoZWNrRWxvbmdhdGVkOiAtPlxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKVxuICAgIG1heCA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpXG4gICAgd2hpbGUgZW5kUG9zIDwgbWF4IGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLGVuZFBvcytAY29kZXdhdmUuZGVjby5sZW5ndGgpID09IEBjb2Rld2F2ZS5kZWNvXG4gICAgICBlbmRQb3MrPUBjb2Rld2F2ZS5kZWNvLmxlbmd0aFxuICAgIGlmIGVuZFBvcyA+PSBtYXggb3IgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSBpbiBbJyAnLFwiXFxuXCIsXCJcXHJcIl1cbiAgICAgIEBzdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyxlbmRQb3MpXG4gIF9jaGVja0JveDogLT5cbiAgICBpZiBAY29kZXdhdmUuaW5JbnN0YW5jZT8gYW5kIEBjb2Rld2F2ZS5pbkluc3RhbmNlLmNtZC5uYW1lID09ICdjb21tZW50J1xuICAgICAgcmV0dXJuXG4gICAgY2wgPSBAY29udGV4dC53cmFwQ29tbWVudExlZnQoKVxuICAgIGNyID0gQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpXG4gICAgZW5kUG9zID0gQGdldEVuZFBvcygpICsgY3IubGVuZ3RoXG4gICAgaWYgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MgLSBjbC5sZW5ndGgsQHBvcykgPT0gY2wgYW5kIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MgLSBjci5sZW5ndGgsZW5kUG9zKSA9PSBjclxuICAgICAgQHBvcyA9IEBwb3MgLSBjbC5sZW5ndGhcbiAgICAgIEBzdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyxlbmRQb3MpXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gICAgZWxzZSBpZiBAZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkuaW5kZXhPZihjbCkgPiAtMSBhbmQgQGdldFBvcygpLnNhbWVMaW5lc1N1ZmZpeCgpLmluZGV4T2YoY3IpID4gLTFcbiAgICAgIEBpbkJveCA9IDFcbiAgICAgIEBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KClcbiAgX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudDogLT5cbiAgICBpZiBAY29udGVudFxuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKVxuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb2Rld2F2ZS5kZWNvKVxuICAgICAgcmUxID0gbmV3IFJlZ0V4cChcIl5cXFxccyoje2VjbH0oPzoje2VkfSkrXFxcXHMqKC4qPylcXFxccyooPzoje2VkfSkrI3tlY3J9JFwiLCBcImdtXCIpXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXHI/XFxuXCIpXG4gICAgICByZTMgPSBuZXcgUmVnRXhwKFwiXFxuXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzKiRcIilcbiAgICAgIEBjb250ZW50ID0gQGNvbnRlbnQucmVwbGFjZShyZTEsJyQxJykucmVwbGFjZShyZTIsJycpLnJlcGxhY2UocmUzLCcnKVxuICBfZ2V0UGFyZW50Q21kczogLT5cbiAgICBAcGFyZW50ID0gQGNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZChAZ2V0RW5kUG9zKCkpPy5pbml0KClcbiAgc2V0TXVsdGlQb3M6IChtdWx0aVBvcykgLT5cbiAgICBAbXVsdGlQb3MgPSBtdWx0aVBvc1xuICBfZ2V0Q21kT2JqOiAtPlxuICAgIEBnZXRDbWQoKVxuICAgIEBfY2hlY2tCb3goKVxuICAgIEBjb250ZW50ID0gQHJlbW92ZUluZGVudEZyb21Db250ZW50KEBjb250ZW50KVxuICAgIHN1cGVyKClcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQF9wYXJzZVBhcmFtcyhAcmF3UGFyYW1zKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHJldHVybiBAY29udGV4dCBvciBAY29kZXdhdmUuY29udGV4dFxuICBnZXRDbWQ6IC0+XG4gICAgdW5sZXNzIEBjbWQ/XG4gICAgICBAX2dldFBhcmVudENtZHMoKVxuICAgICAgaWYgQG5vQnJhY2tldC5zdWJzdHJpbmcoMCxAY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyXG4gICAgICAgIEBjbWQgPSBDb21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKVxuICAgICAgICBAY29udGV4dCA9IEBjb2Rld2F2ZS5jb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIEBmaW5kZXIgPSBAZ2V0RmluZGVyKEBjbWROYW1lKVxuICAgICAgICBAY29udGV4dCA9IEBmaW5kZXIuY29udGV4dFxuICAgICAgICBAY21kID0gQGZpbmRlci5maW5kKClcbiAgICAgICAgaWYgQGNtZD9cbiAgICAgICAgICBAY29udGV4dC5hZGROYW1lU3BhY2UoQGNtZC5mdWxsTmFtZSlcbiAgICByZXR1cm4gQGNtZFxuICBnZXRGaW5kZXI6IChjbWROYW1lKS0+XG4gICAgZmluZGVyID0gQGNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsbmFtZXNwYWNlczpAX2dldFBhcmVudE5hbWVzcGFjZXMoKSlcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzXG4gICAgcmV0dXJuIGZpbmRlclxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICBuc3BjcyA9IFtdXG4gICAgb2JqID0gdGhpc1xuICAgIHdoaWxlIG9iai5wYXJlbnQ/XG4gICAgICBvYmogPSBvYmoucGFyZW50XG4gICAgICBuc3Bjcy5wdXNoKG9iai5jbWQuZnVsbE5hbWUpIGlmIG9iai5jbWQ/IGFuZCBvYmouY21kLmZ1bGxOYW1lP1xuICAgIHJldHVybiBuc3Bjc1xuICBfcmVtb3ZlQnJhY2tldDogKHN0ciktPlxuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCxzdHIubGVuZ3RoLUBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgYWx0ZXJBbGlhc09mOiAoYWxpYXNPZiktPlxuICAgIFtuc3BjLCBjbWROYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdChAY21kTmFtZSlcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLGNtZE5hbWUpXG4gIGlzRW1wdHk6IC0+XG4gICAgcmV0dXJuIEBzdHIgPT0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNvZGV3YXZlLmJyYWtldHMgb3IgQHN0ciA9PSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5icmFrZXRzXG4gIGV4ZWN1dGU6IC0+XG4gICAgaWYgQGlzRW1wdHkoKVxuICAgICAgaWYgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcD8gYW5kIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAud2hpdGhpbk9wZW5Cb3VuZHMoQHBvcyArIEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk/XG4gICAgICAgIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAuY2FuY2VsKClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlcGxhY2VXaXRoKCcnKVxuICAgIGVsc2UgaWYgQGNtZD9cbiAgICAgIGlmIGJlZm9yZUZ1bmN0ID0gQGdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpXG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpXG4gICAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgICBvcHRpb25hbFByb21pc2UoQHJlc3VsdCgpKS50aGVuIChyZXMpPT5cbiAgICAgICAgICBpZiByZXM/XG4gICAgICAgICAgICBAcmVwbGFjZVdpdGgocmVzKVxuICAgICAgICAucmVzdWx0KClcbiAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gQHJ1bkV4ZWN1dGVGdW5jdCgpXG4gIGdldEVuZFBvczogLT5cbiAgICByZXR1cm4gQHBvcytAc3RyLmxlbmd0aFxuICBnZXRQb3M6IC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQHBvcyxAcG9zK0BzdHIubGVuZ3RoKS53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gIGdldE9wZW5pbmdQb3M6IC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQHBvcyxAcG9zK0BvcGVuaW5nLmxlbmd0aCkud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICBnZXRJbmRlbnQ6IC0+XG4gICAgdW5sZXNzIEBpbmRlbnRMZW4/XG4gICAgICBpZiBAaW5Cb3g/XG4gICAgICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGNvbnRleHQpXG4gICAgICAgIEBpbmRlbnRMZW4gPSBoZWxwZXIucmVtb3ZlQ29tbWVudChAZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkpLmxlbmd0aFxuICAgICAgZWxzZVxuICAgICAgICBAaW5kZW50TGVuID0gQHBvcyAtIEBnZXRQb3MoKS5wcmV2RU9MKClcbiAgICByZXR1cm4gQGluZGVudExlblxuICByZW1vdmVJbmRlbnRGcm9tQ29udGVudDogKHRleHQpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoJ15cXFxcc3snK0BnZXRJbmRlbnQoKSsnfScsJ2dtJylcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCcnKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gIGFsdGVyUmVzdWx0Rm9yQm94OiAocmVwbCkgLT5cbiAgICBvcmlnaW5hbCA9IHJlcGwuY29weSgpXG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlcihAY29udGV4dClcbiAgICBoZWxwZXIuZ2V0T3B0RnJvbUxpbmUob3JpZ2luYWwudGV4dFdpdGhGdWxsTGluZXMoKSxmYWxzZSlcbiAgICBpZiBAZ2V0T3B0aW9uKCdyZXBsYWNlQm94JylcbiAgICAgIGJveCA9IGhlbHBlci5nZXRCb3hGb3JQb3Mob3JpZ2luYWwpXG4gICAgICBbcmVwbC5zdGFydCwgcmVwbC5lbmRdID0gW2JveC5zdGFydCwgYm94LmVuZF1cbiAgICAgIEBpbmRlbnRMZW4gPSBoZWxwZXIuaW5kZW50XG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgIGVsc2VcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgICByZXBsLnN0YXJ0ID0gb3JpZ2luYWwucHJldkVPTCgpXG4gICAgICByZXBsLmVuZCA9IG9yaWdpbmFsLm5leHRFT0woKVxuICAgICAgcmVzID0gaGVscGVyLnJlZm9ybWF0TGluZXMob3JpZ2luYWwuc2FtZUxpbmVzUHJlZml4KCkgKyBAY29kZXdhdmUubWFya2VyICsgcmVwbC50ZXh0ICsgQGNvZGV3YXZlLm1hcmtlciArIG9yaWdpbmFsLnNhbWVMaW5lc1N1ZmZpeCgpLCB7bXVsdGlsaW5lOmZhbHNlfSlcbiAgICAgIFtyZXBsLnByZWZpeCxyZXBsLnRleHQscmVwbC5zdWZmaXhdID0gcmVzLnNwbGl0KEBjb2Rld2F2ZS5tYXJrZXIpXG4gICAgcmV0dXJuIHJlcGxcbiAgZ2V0Q3Vyc29yRnJvbVJlc3VsdDogKHJlcGwpIC0+XG4gICAgY3Vyc29yUG9zID0gcmVwbC5yZXNQb3NCZWZvcmVQcmVmaXgoKVxuICAgIGlmIEBjbWQ/IGFuZCBAY29kZXdhdmUuY2hlY2tDYXJyZXQgYW5kIEBnZXRPcHRpb24oJ2NoZWNrQ2FycmV0JylcbiAgICAgIGlmIChwID0gQGNvZGV3YXZlLmdldENhcnJldFBvcyhyZXBsLnRleHQpKT8gXG4gICAgICAgIGN1cnNvclBvcyA9IHJlcGwuc3RhcnQrcmVwbC5wcmVmaXgubGVuZ3RoK3BcbiAgICAgIHJlcGwudGV4dCA9IEBjb2Rld2F2ZS5yZW1vdmVDYXJyZXQocmVwbC50ZXh0KVxuICAgIHJldHVybiBjdXJzb3JQb3NcbiAgY2hlY2tNdWx0aTogKHJlcGwpIC0+XG4gICAgaWYgQG11bHRpUG9zPyBhbmQgQG11bHRpUG9zLmxlbmd0aCA+IDFcbiAgICAgIHJlcGxhY2VtZW50cyA9IFtyZXBsXVxuICAgICAgb3JpZ2luYWxUZXh0ID0gcmVwbC5vcmlnaW5hbFRleHQoKVxuICAgICAgZm9yIHBvcywgaSBpbiBAbXVsdGlQb3NcbiAgICAgICAgaWYgaSA9PSAwXG4gICAgICAgICAgb3JpZ2luYWxQb3MgPSBwb3Muc3RhcnRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5ld1JlcGwgPSByZXBsLmNvcHkoKS5hcHBseU9mZnNldChwb3Muc3RhcnQtb3JpZ2luYWxQb3MpXG4gICAgICAgICAgaWYgbmV3UmVwbC5vcmlnaW5hbFRleHQoKSA9PSBvcmlnaW5hbFRleHRcbiAgICAgICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ld1JlcGwpXG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRzXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFtyZXBsXVxuICByZXBsYWNlV2l0aDogKHRleHQpIC0+XG4gICAgQGFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KEBwb3MsQGdldEVuZFBvcygpLHRleHQpKVxuICBhcHBseVJlcGxhY2VtZW50OiAocmVwbCkgLT5cbiAgICByZXBsLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgICBpZiBAaW5Cb3g/XG4gICAgICBAYWx0ZXJSZXN1bHRGb3JCb3gocmVwbClcbiAgICBlbHNlXG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgIGN1cnNvclBvcyA9IEBnZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpXG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBQb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXVxuICAgIHJlcGxhY2VtZW50cyA9IEBjaGVja011bHRpKHJlcGwpXG4gICAgQHJlcGxhY2VTdGFydCA9IHJlcGwuc3RhcnRcbiAgICBAcmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKClcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgICAiLCJpbXBvcnQge1xuICBDbWRJbnN0YW5jZVxufSBmcm9tICcuL0NtZEluc3RhbmNlJztcblxuaW1wb3J0IHtcbiAgQm94SGVscGVyXG59IGZyb20gJy4vQm94SGVscGVyJztcblxuaW1wb3J0IHtcbiAgUGFyYW1QYXJzZXJcbn0gZnJvbSAnLi9zdHJpbmdQYXJzZXJzL1BhcmFtUGFyc2VyJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgU3RyUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgTmFtZXNwYWNlSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIG9wdGlvbmFsUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IHZhciBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgPSBjbGFzcyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgZXh0ZW5kcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlLCBwb3MxLCBzdHIxKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmU7XG4gICAgdGhpcy5wb3MgPSBwb3MxO1xuICAgIHRoaXMuc3RyID0gc3RyMTtcbiAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aGlzLl9jaGVja0Nsb3NlcigpO1xuICAgICAgdGhpcy5vcGVuaW5nID0gdGhpcy5zdHI7XG4gICAgICB0aGlzLm5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpO1xuICAgICAgdGhpcy5fc3BsaXRDb21wb25lbnRzKCk7XG4gICAgICB0aGlzLl9maW5kQ2xvc2luZygpO1xuICAgICAgdGhpcy5fY2hlY2tFbG9uZ2F0ZWQoKTtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tDbG9zZXIoKSB7XG4gICAgdmFyIGYsIG5vQnJhY2tldDtcbiAgICBub0JyYWNrZXQgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKTtcbiAgICBpZiAobm9CcmFja2V0LnN1YnN0cmluZygwLCB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciAmJiAoZiA9IHRoaXMuX2ZpbmRPcGVuaW5nUG9zKCkpKSB7XG4gICAgICB0aGlzLmNsb3NpbmdQb3MgPSBuZXcgU3RyUG9zKHRoaXMucG9zLCB0aGlzLnN0cik7XG4gICAgICB0aGlzLnBvcyA9IGYucG9zO1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gZi5zdHI7XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRPcGVuaW5nUG9zKCkge1xuICAgIHZhciBjbG9zaW5nLCBjbWROYW1lLCBmLCBvcGVuaW5nO1xuICAgIGNtZE5hbWUgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKS5zdWJzdHJpbmcodGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKTtcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgY21kTmFtZTtcbiAgICBjbG9zaW5nID0gdGhpcy5zdHI7XG4gICAgaWYgKGYgPSB0aGlzLmNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIodGhpcy5wb3MsIG9wZW5pbmcsIGNsb3NpbmcsIC0xKSkge1xuICAgICAgZi5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLCB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGYucG9zICsgZi5zdHIubGVuZ3RoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpO1xuICAgICAgcmV0dXJuIGY7XG4gICAgfVxuICB9XG5cbiAgX3NwbGl0Q29tcG9uZW50cygpIHtcbiAgICB2YXIgcGFydHM7XG4gICAgcGFydHMgPSB0aGlzLm5vQnJhY2tldC5zcGxpdChcIiBcIik7XG4gICAgdGhpcy5jbWROYW1lID0gcGFydHMuc2hpZnQoKTtcbiAgICByZXR1cm4gdGhpcy5yYXdQYXJhbXMgPSBwYXJ0cy5qb2luKFwiIFwiKTtcbiAgfVxuXG4gIF9wYXJzZVBhcmFtcyhwYXJhbXMpIHtcbiAgICB2YXIgbmFtZVRvUGFyYW0sIHBhcnNlcjtcbiAgICBwYXJzZXIgPSBuZXcgUGFyYW1QYXJzZXIocGFyYW1zLCB7XG4gICAgICBhbGxvd2VkTmFtZWQ6IHRoaXMuZ2V0T3B0aW9uKCdhbGxvd2VkTmFtZWQnKSxcbiAgICAgIHZhcnM6IHRoaXMuY29kZXdhdmUudmFyc1xuICAgIH0pO1xuICAgIHRoaXMucGFyYW1zID0gcGFyc2VyLnBhcmFtcztcbiAgICB0aGlzLm5hbWVkID0gT2JqZWN0LmFzc2lnbih0aGlzLmdldERlZmF1bHRzKCksIHBhcnNlci5uYW1lZCk7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIG5hbWVUb1BhcmFtID0gdGhpcy5nZXRPcHRpb24oJ25hbWVUb1BhcmFtJyk7XG4gICAgICBpZiAobmFtZVRvUGFyYW0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lZFtuYW1lVG9QYXJhbV0gPSB0aGlzLmNtZE5hbWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRDbG9zaW5nKCkge1xuICAgIHZhciBmO1xuICAgIGlmIChmID0gdGhpcy5fZmluZENsb3NpbmdQb3MoKSkge1xuICAgICAgdGhpcy5jb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgZi5wb3MpKTtcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGYucG9zICsgZi5zdHIubGVuZ3RoKTtcbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmdQb3MoKSB7XG4gICAgdmFyIGNsb3NpbmcsIGYsIG9wZW5pbmc7XG4gICAgaWYgKHRoaXMuY2xvc2luZ1BvcyAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUG9zO1xuICAgIH1cbiAgICBjbG9zaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZE5hbWUgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY21kTmFtZTtcbiAgICBpZiAoZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgb3BlbmluZywgY2xvc2luZykpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3MgPSBmO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Vsb25nYXRlZCgpIHtcbiAgICB2YXIgZW5kUG9zLCBtYXgsIHJlZjtcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpO1xuICAgIG1heCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKTtcbiAgICB3aGlsZSAoZW5kUG9zIDwgbWF4ICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5kZWNvKSB7XG4gICAgICBlbmRQb3MgKz0gdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKGVuZFBvcyA+PSBtYXggfHwgKChyZWYgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkpID09PSAnICcgfHwgcmVmID09PSBcIlxcblwiIHx8IHJlZiA9PT0gXCJcXHJcIikpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGVuZFBvcyk7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrQm94KCkge1xuICAgIHZhciBjbCwgY3IsIGVuZFBvcztcbiAgICBpZiAoKHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSAmJiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuY21kLm5hbWUgPT09ICdjb21tZW50Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjbCA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKTtcbiAgICBjciA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCk7XG4gICAgZW5kUG9zID0gdGhpcy5nZXRFbmRQb3MoKSArIGNyLmxlbmd0aDtcbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyAtIGNsLmxlbmd0aCwgdGhpcy5wb3MpID09PSBjbCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyAtIGNyLmxlbmd0aCwgZW5kUG9zKSA9PT0gY3IpIHtcbiAgICAgIHRoaXMucG9zID0gdGhpcy5wb3MgLSBjbC5sZW5ndGg7XG4gICAgICB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGVuZFBvcyk7XG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgJiYgdGhpcy5nZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xKSB7XG4gICAgICB0aGlzLmluQm94ID0gMTtcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCkge1xuICAgIHZhciBlY2wsIGVjciwgZWQsIHJlMSwgcmUyLCByZTM7XG4gICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpO1xuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKTtcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvZGV3YXZlLmRlY28pO1xuICAgICAgcmUxID0gbmV3IFJlZ0V4cChgXlxcXFxzKiR7ZWNsfSg/OiR7ZWR9KStcXFxccyooLio/KVxcXFxzKig/OiR7ZWR9KSske2Vjcn0kYCwgXCJnbVwiKTtcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoYF5cXFxccyooPzoke2VkfSkqJHtlY3J9XFxyP1xcbmApO1xuICAgICAgcmUzID0gbmV3IFJlZ0V4cChgXFxuXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzKiRgKTtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRlbnQucmVwbGFjZShyZTEsICckMScpLnJlcGxhY2UocmUyLCAnJykucmVwbGFjZShyZTMsICcnKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0UGFyZW50Q21kcygpIHtcbiAgICB2YXIgcmVmO1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9IChyZWYgPSB0aGlzLmNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZCh0aGlzLmdldEVuZFBvcygpKSkgIT0gbnVsbCA/IHJlZi5pbml0KCkgOiB2b2lkIDA7XG4gIH1cblxuICBzZXRNdWx0aVBvcyhtdWx0aVBvcykge1xuICAgIHJldHVybiB0aGlzLm11bHRpUG9zID0gbXVsdGlQb3M7XG4gIH1cblxuICBfZ2V0Q21kT2JqKCkge1xuICAgIHRoaXMuZ2V0Q21kKCk7XG4gICAgdGhpcy5fY2hlY2tCb3goKTtcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnJlbW92ZUluZGVudEZyb21Db250ZW50KHRoaXMuY29udGVudCk7XG4gICAgcmV0dXJuIHN1cGVyLl9nZXRDbWRPYmooKTtcbiAgfVxuXG4gIF9pbml0UGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJzZVBhcmFtcyh0aGlzLnJhd1BhcmFtcyk7XG4gIH1cblxuICBnZXRDb250ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQgfHwgdGhpcy5jb2Rld2F2ZS5jb250ZXh0O1xuICB9XG5cbiAgZ2V0Q21kKCkge1xuICAgIGlmICh0aGlzLmNtZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9nZXRQYXJlbnRDbWRzKCk7XG4gICAgICBpZiAodGhpcy5ub0JyYWNrZXQuc3Vic3RyaW5nKDAsIHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpIHtcbiAgICAgICAgdGhpcy5jbWQgPSBDb21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jb2Rld2F2ZS5jb250ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmZpbmRlci5jb250ZXh0O1xuICAgICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKTtcbiAgICAgICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZVNwYWNlKHRoaXMuY21kLmZ1bGxOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jbWQ7XG4gIH1cblxuICBnZXRGaW5kZXIoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXI7XG4gICAgZmluZGVyID0gdGhpcy5jb2Rld2F2ZS5jb250ZXh0LmdldEZpbmRlcihjbWROYW1lLCB7XG4gICAgICBuYW1lc3BhY2VzOiB0aGlzLl9nZXRQYXJlbnROYW1lc3BhY2VzKClcbiAgICB9KTtcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzO1xuICAgIHJldHVybiBmaW5kZXI7XG4gIH1cblxuICBfZ2V0UGFyZW50TmFtZXNwYWNlcygpIHtcbiAgICB2YXIgbnNwY3MsIG9iajtcbiAgICBuc3BjcyA9IFtdO1xuICAgIG9iaiA9IHRoaXM7XG4gICAgd2hpbGUgKG9iai5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgb2JqID0gb2JqLnBhcmVudDtcbiAgICAgIGlmICgob2JqLmNtZCAhPSBudWxsKSAmJiAob2JqLmNtZC5mdWxsTmFtZSAhPSBudWxsKSkge1xuICAgICAgICBuc3Bjcy5wdXNoKG9iai5jbWQuZnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnNwY3M7XG4gIH1cblxuICBfcmVtb3ZlQnJhY2tldChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoLCBzdHIubGVuZ3RoIC0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk7XG4gIH1cblxuICBhbHRlckFsaWFzT2YoYWxpYXNPZikge1xuICAgIHZhciBjbWROYW1lLCBuc3BjO1xuICAgIFtuc3BjLCBjbWROYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdCh0aGlzLmNtZE5hbWUpO1xuICAgIHJldHVybiBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIGNtZE5hbWUpO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdHIgPT09IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzIHx8IHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHZhciBiZWZvcmVGdW5jdDtcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIGlmICgodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgIT0gbnVsbCkgJiYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKHRoaXMucG9zICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCkgIT0gbnVsbCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgoJycpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKGJlZm9yZUZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKSkge1xuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbmFsUHJvbWlzZSh0aGlzLnJlc3VsdCgpKS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoKHJlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5yZXN1bHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkV4ZWN1dGVGdW5jdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldEVuZFBvcygpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGg7XG4gIH1cblxuICBnZXRQb3MoKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5wb3MsIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcbiAgfVxuXG4gIGdldE9wZW5pbmdQb3MoKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5wb3MsIHRoaXMucG9zICsgdGhpcy5vcGVuaW5nLmxlbmd0aCkud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcik7XG4gIH1cblxuICBnZXRJbmRlbnQoKSB7XG4gICAgdmFyIGhlbHBlcjtcbiAgICBpZiAodGhpcy5pbmRlbnRMZW4gPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuaW5Cb3ggIT0gbnVsbCkge1xuICAgICAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dCk7XG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gaGVscGVyLnJlbW92ZUNvbW1lbnQodGhpcy5nZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKSkubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbmRlbnRMZW4gPSB0aGlzLnBvcyAtIHRoaXMuZ2V0UG9zKCkucHJldkVPTCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbmRlbnRMZW47XG4gIH1cblxuICByZW1vdmVJbmRlbnRGcm9tQ29udGVudCh0ZXh0KSB7XG4gICAgdmFyIHJlZztcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKCdeXFxcXHN7JyArIHRoaXMuZ2V0SW5kZW50KCkgKyAnfScsICdnbScpO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgYWx0ZXJSZXN1bHRGb3JCb3gocmVwbCkge1xuICAgIHZhciBib3gsIGhlbHBlciwgb3JpZ2luYWwsIHJlcztcbiAgICBvcmlnaW5hbCA9IHJlcGwuY29weSgpO1xuICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0KTtcbiAgICBoZWxwZXIuZ2V0T3B0RnJvbUxpbmUob3JpZ2luYWwudGV4dFdpdGhGdWxsTGluZXMoKSwgZmFsc2UpO1xuICAgIGlmICh0aGlzLmdldE9wdGlvbigncmVwbGFjZUJveCcpKSB7XG4gICAgICBib3ggPSBoZWxwZXIuZ2V0Qm94Rm9yUG9zKG9yaWdpbmFsKTtcbiAgICAgIFtyZXBsLnN0YXJ0LCByZXBsLmVuZF0gPSBbYm94LnN0YXJ0LCBib3guZW5kXTtcbiAgICAgIHRoaXMuaW5kZW50TGVuID0gaGVscGVyLmluZGVudDtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpO1xuICAgICAgcmVwbC5zdGFydCA9IG9yaWdpbmFsLnByZXZFT0woKTtcbiAgICAgIHJlcGwuZW5kID0gb3JpZ2luYWwubmV4dEVPTCgpO1xuICAgICAgcmVzID0gaGVscGVyLnJlZm9ybWF0TGluZXMob3JpZ2luYWwuc2FtZUxpbmVzUHJlZml4KCkgKyB0aGlzLmNvZGV3YXZlLm1hcmtlciArIHJlcGwudGV4dCArIHRoaXMuY29kZXdhdmUubWFya2VyICsgb3JpZ2luYWwuc2FtZUxpbmVzU3VmZml4KCksIHtcbiAgICAgICAgbXVsdGlsaW5lOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBbcmVwbC5wcmVmaXgsIHJlcGwudGV4dCwgcmVwbC5zdWZmaXhdID0gcmVzLnNwbGl0KHRoaXMuY29kZXdhdmUubWFya2VyKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcGw7XG4gIH1cblxuICBnZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCBwO1xuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KCk7XG4gICAgaWYgKCh0aGlzLmNtZCAhPSBudWxsKSAmJiB0aGlzLmNvZGV3YXZlLmNoZWNrQ2FycmV0ICYmIHRoaXMuZ2V0T3B0aW9uKCdjaGVja0NhcnJldCcpKSB7XG4gICAgICBpZiAoKHAgPSB0aGlzLmNvZGV3YXZlLmdldENhcnJldFBvcyhyZXBsLnRleHQpKSAhPSBudWxsKSB7XG4gICAgICAgIGN1cnNvclBvcyA9IHJlcGwuc3RhcnQgKyByZXBsLnByZWZpeC5sZW5ndGggKyBwO1xuICAgICAgfVxuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQocmVwbC50ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnNvclBvcztcbiAgfVxuXG4gIGNoZWNrTXVsdGkocmVwbCkge1xuICAgIHZhciBpLCBqLCBsZW4sIG5ld1JlcGwsIG9yaWdpbmFsUG9zLCBvcmlnaW5hbFRleHQsIHBvcywgcmVmLCByZXBsYWNlbWVudHM7XG4gICAgaWYgKCh0aGlzLm11bHRpUG9zICE9IG51bGwpICYmIHRoaXMubXVsdGlQb3MubGVuZ3RoID4gMSkge1xuICAgICAgcmVwbGFjZW1lbnRzID0gW3JlcGxdO1xuICAgICAgb3JpZ2luYWxUZXh0ID0gcmVwbC5vcmlnaW5hbFRleHQoKTtcbiAgICAgIHJlZiA9IHRoaXMubXVsdGlQb3M7XG4gICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICBwb3MgPSByZWZbaV07XG4gICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgb3JpZ2luYWxQb3MgPSBwb3Muc3RhcnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3UmVwbCA9IHJlcGwuY29weSgpLmFwcGx5T2Zmc2V0KHBvcy5zdGFydCAtIG9yaWdpbmFsUG9zKTtcbiAgICAgICAgICBpZiAobmV3UmVwbC5vcmlnaW5hbFRleHQoKSA9PT0gb3JpZ2luYWxUZXh0KSB7XG4gICAgICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXdSZXBsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXBsYWNlbWVudHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbcmVwbF07XG4gICAgfVxuICB9XG5cbiAgcmVwbGFjZVdpdGgodGV4dCkge1xuICAgIHJldHVybiB0aGlzLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KHRoaXMucG9zLCB0aGlzLmdldEVuZFBvcygpLCB0ZXh0KSk7XG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50KHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCByZXBsYWNlbWVudHM7XG4gICAgcmVwbC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcbiAgICBpZiAodGhpcy5pbkJveCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgfVxuICAgIGN1cnNvclBvcyA9IHRoaXMuZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKTtcbiAgICByZXBsLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyhjdXJzb3JQb3MsIGN1cnNvclBvcyldO1xuICAgIHJlcGxhY2VtZW50cyA9IHRoaXMuY2hlY2tNdWx0aShyZXBsKTtcbiAgICB0aGlzLnJlcGxhY2VTdGFydCA9IHJlcGwuc3RhcnQ7XG4gICAgdGhpcy5yZXBsYWNlRW5kID0gcmVwbC5yZXNFbmQoKTtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIFByb2Nlc3NcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgIyIsIlxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9Mb2dnZXInO1xuXG5leHBvcnQgY2xhc3MgU3RvcmFnZVxuICBjb25zdHJ1Y3RvcjogKEBlbmdpbmUpIC0+XG5cbiAgc2F2ZTogKGtleSx2YWwpIC0+XG4gICAgaWYgQGVuZ2luZUF2YWlsYWJsZSgpXG4gICAgICBAZW5naW5lLnNhdmUoa2V5LHZhbClcblxuICBzYXZlSW5QYXRoOiAocGF0aCwga2V5LCB2YWwpIC0+XG4gICAgaWYgQGVuZ2luZUF2YWlsYWJsZSgpXG4gICAgICBAZW5naW5lLnNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpXG5cbiAgbG9hZDogKGtleSkgLT5cbiAgICBpZiBAZW5naW5lP1xuICAgICAgQGVuZ2luZS5sb2FkKGtleSlcblxuICBlbmdpbmVBdmFpbGFibGU6ICgpIC0+XG4gICAgaWYgQGVuZ2luZT9cbiAgICAgIHRydWVcbiAgICBlbHNlXG4gICAgICBAbG9nZ2VyID0gQGxvZ2dlciB8fCBuZXcgTG9nZ2VyKClcbiAgICAgIEBsb2dnZXIubG9nKCdObyBzdG9yYWdlIGVuZ2luZSBhdmFpbGFibGUnKVxuICAgICAgZmFsc2VcbiAgICAiLCJpbXBvcnQge1xuICBMb2dnZXJcbn0gZnJvbSAnLi9Mb2dnZXInO1xuXG5leHBvcnQgdmFyIFN0b3JhZ2UgPSBjbGFzcyBTdG9yYWdlIHtcbiAgY29uc3RydWN0b3IoZW5naW5lKSB7XG4gICAgdGhpcy5lbmdpbmUgPSBlbmdpbmU7XG4gIH1cblxuICBzYXZlKGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5zYXZlKGtleSwgdmFsKTtcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5zYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKTtcbiAgICB9XG4gIH1cblxuICBsb2FkKGtleSkge1xuICAgIGlmICh0aGlzLmVuZ2luZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUubG9hZChrZXkpO1xuICAgIH1cbiAgfVxuXG4gIGVuZ2luZUF2YWlsYWJsZSgpIHtcbiAgICBpZiAodGhpcy5lbmdpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9nZ2VyID0gdGhpcy5sb2dnZXIgfHwgbmV3IExvZ2dlcigpO1xuICAgICAgdGhpcy5sb2dnZXIubG9nKCdObyBzdG9yYWdlIGVuZ2luZSBhdmFpbGFibGUnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5leHBvcnQgY2xhc3MgRG9tS2V5TGlzdGVuZXJcbiAgc3RhcnRMaXN0ZW5pbmc6ICh0YXJnZXQpIC0+XG4gIFxuICAgIHRpbWVvdXQgPSBudWxsXG4gICAgXG4gICAgb25rZXlkb3duID0gKGUpID0+IFxuICAgICAgaWYgKENvZGV3YXZlLmluc3RhbmNlcy5sZW5ndGggPCAyIG9yIEBvYmogPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgYW5kIGUua2V5Q29kZSA9PSA2OSAmJiBlLmN0cmxLZXlcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGlmIEBvbkFjdGl2YXRpb25LZXk/XG4gICAgICAgICAgQG9uQWN0aXZhdGlvbktleSgpXG4gICAgb25rZXl1cCA9IChlKSA9PiBcbiAgICAgIGlmIEBvbkFueUNoYW5nZT9cbiAgICAgICAgQG9uQW55Q2hhbmdlKGUpXG4gICAgb25rZXlwcmVzcyA9IChlKSA9PiBcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KSBpZiB0aW1lb3V0P1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQgKD0+XG4gICAgICAgIGlmIEBvbkFueUNoYW5nZT9cbiAgICAgICAgICBAb25BbnlDaGFuZ2UoZSlcbiAgICAgICksIDEwMFxuICAgICAgICAgICAgXG4gICAgaWYgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXJcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9ua2V5ZG93bilcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBvbmtleXVwKVxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIG9ua2V5cHJlc3MpXG4gICAgZWxzZSBpZiB0YXJnZXQuYXR0YWNoRXZlbnRcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlkb3duXCIsIG9ua2V5ZG93bilcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXl1cFwiLCBvbmtleXVwKVxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXByZXNzXCIsIG9ua2V5cHJlc3MpXG5cbmlzRWxlbWVudCA9IChvYmopIC0+XG4gIHRyeVxuICAgICMgVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb20pXG4gICAgb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcbiAgY2F0Y2ggZVxuICAgICMgQnJvd3NlcnMgbm90IHN1cHBvcnRpbmcgVzMgRE9NMiBkb24ndCBoYXZlIEhUTUxFbGVtZW50IGFuZFxuICAgICMgYW4gZXhjZXB0aW9uIGlzIHRocm93biBhbmQgd2UgZW5kIHVwIGhlcmUuIFRlc3Rpbmcgc29tZVxuICAgICMgcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuICAgIHJldHVybiAodHlwZW9mIG9iaj09XCJvYmplY3RcIikgJiZcbiAgICAgIChvYmoubm9kZVR5cGU9PTEpICYmICh0eXBlb2Ygb2JqLnN0eWxlID09IFwib2JqZWN0XCIpICYmXG4gICAgICAodHlwZW9mIG9iai5vd25lckRvY3VtZW50ID09XCJvYmplY3RcIilcblxuICAgICAgICBcbmV4cG9ydCBjbGFzcyBUZXh0QXJlYUVkaXRvciBleHRlbmRzIFRleHRQYXJzZXJcbiAgY29uc3RydWN0b3I6IChAdGFyZ2V0KSAtPlxuICAgIHN1cGVyKClcbiAgICBAb2JqID0gaWYgaXNFbGVtZW50KEB0YXJnZXQpIHRoZW4gQHRhcmdldCBlbHNlIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEB0YXJnZXQpXG4gICAgdW5sZXNzIEBvYmo/XG4gICAgICB0aHJvdyBcIlRleHRBcmVhIG5vdCBmb3VuZFwiXG4gICAgQG5hbWVzcGFjZSA9ICd0ZXh0YXJlYSdcbiAgICBAY2hhbmdlTGlzdGVuZXJzID0gW11cbiAgICBAX3NraXBDaGFuZ2VFdmVudCA9IDBcbiAgc3RhcnRMaXN0ZW5pbmc6IERvbUtleUxpc3RlbmVyLnByb3RvdHlwZS5zdGFydExpc3RlbmluZ1xuICBvbkFueUNoYW5nZTogKGUpIC0+XG4gICAgaWYgQF9za2lwQ2hhbmdlRXZlbnQgPD0gMFxuICAgICAgZm9yIGNhbGxiYWNrIGluIEBjaGFuZ2VMaXN0ZW5lcnNcbiAgICAgICAgY2FsbGJhY2soKVxuICAgIGVsc2VcbiAgICAgIEBfc2tpcENoYW5nZUV2ZW50LS1cbiAgICAgIEBvblNraXBlZENoYW5nZSgpIGlmIEBvblNraXBlZENoYW5nZT9cbiAgc2tpcENoYW5nZUV2ZW50OiAobmIgPSAxKSAtPlxuICAgIEBfc2tpcENoYW5nZUV2ZW50ICs9IG5iXG4gIGJpbmRlZFRvOiAoY29kZXdhdmUpIC0+XG4gICAgQG9uQWN0aXZhdGlvbktleSA9IC0+IGNvZGV3YXZlLm9uQWN0aXZhdGlvbktleSgpXG4gICAgQHN0YXJ0TGlzdGVuaW5nKGRvY3VtZW50KVxuICBzZWxlY3Rpb25Qcm9wRXhpc3RzOiAtPlxuICAgIFwic2VsZWN0aW9uU3RhcnRcIiBvZiBAb2JqXG4gIGhhc0ZvY3VzOiAtPiBcbiAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGlzIEBvYmpcbiAgdGV4dDogKHZhbCkgLT5cbiAgICBpZiB2YWw/XG4gICAgICB1bmxlc3MgQHRleHRFdmVudENoYW5nZSh2YWwpXG4gICAgICAgIEBvYmoudmFsdWUgPSB2YWxcbiAgICBAb2JqLnZhbHVlXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIEB0ZXh0RXZlbnRDaGFuZ2UodGV4dCwgc3RhcnQsIGVuZCkgb3IgQHNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQodGV4dCwgc3RhcnQsIGVuZCkgb3Igc3VwZXIoc3RhcnQsIGVuZCwgdGV4dClcbiAgdGV4dEV2ZW50Q2hhbmdlOiAodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSAtPlxuICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RleHRFdmVudCcpIGlmIGRvY3VtZW50LmNyZWF0ZUV2ZW50P1xuICAgIGlmIGV2ZW50PyBhbmQgZXZlbnQuaW5pdFRleHRFdmVudD8gYW5kIGV2ZW50LmlzVHJ1c3RlZCAhPSBmYWxzZVxuICAgICAgZW5kID0gQHRleHRMZW4oKSB1bmxlc3MgZW5kP1xuICAgICAgaWYgdGV4dC5sZW5ndGggPCAxXG4gICAgICAgIGlmIHN0YXJ0ICE9IDBcbiAgICAgICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoc3RhcnQtMSxzdGFydClcbiAgICAgICAgICBzdGFydC0tXG4gICAgICAgIGVsc2UgaWYgZW5kICE9IEB0ZXh0TGVuKClcbiAgICAgICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoZW5kLGVuZCsxKVxuICAgICAgICAgIGVuZCsrXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIGV2ZW50LmluaXRUZXh0RXZlbnQoJ3RleHRJbnB1dCcsIHRydWUsIHRydWUsIG51bGwsIHRleHQsIDkpXG4gICAgICAjIEBzZXRDdXJzb3JQb3Moc3RhcnQsZW5kKVxuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgQG9iai5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgICAgQHNraXBDaGFuZ2VFdmVudCgpXG4gICAgICB0cnVlXG4gICAgZWxzZSBcbiAgICAgIGZhbHNlXG4gIHNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQ6ICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIC0+XG4gICAgaWYgZG9jdW1lbnQuZXhlY0NvbW1hbmQ/XG4gICAgICBlbmQgPSBAdGV4dExlbigpIHVubGVzcyBlbmQ/XG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0ZXh0KTtcbiAgICBlbHNlIFxuICAgICAgZmFsc2VcblxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgcmV0dXJuIEB0bXBDdXJzb3JQb3MgaWYgQHRtcEN1cnNvclBvcz9cbiAgICBpZiBAaGFzRm9jdXNcbiAgICAgIGlmIEBzZWxlY3Rpb25Qcm9wRXhpc3RzXG4gICAgICAgIG5ldyBQb3MoQG9iai5zZWxlY3Rpb25TdGFydCxAb2JqLnNlbGVjdGlvbkVuZClcbiAgICAgIGVsc2VcbiAgICAgICAgQGdldEN1cnNvclBvc0ZhbGxiYWNrKClcbiAgZ2V0Q3Vyc29yUG9zRmFsbGJhY2s6IC0+XG4gICAgaWYgQG9iai5jcmVhdGVUZXh0UmFuZ2VcbiAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpXG4gICAgICBpZiBzZWwucGFyZW50RWxlbWVudCgpIGlzIEBvYmpcbiAgICAgICAgcm5nID0gQG9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgICBybmcubW92ZVRvQm9va21hcmsgc2VsLmdldEJvb2ttYXJrKClcbiAgICAgICAgbGVuID0gMFxuXG4gICAgICAgIHdoaWxlIHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMFxuICAgICAgICAgIGxlbisrXG4gICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpXG4gICAgICAgIHJuZy5zZXRFbmRQb2ludCBcIlN0YXJ0VG9TdGFydFwiLCBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHBvcyA9IG5ldyBQb3MoMCxsZW4pXG4gICAgICAgIHdoaWxlIHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMFxuICAgICAgICAgIHBvcy5zdGFydCsrXG4gICAgICAgICAgcG9zLmVuZCsrXG4gICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpXG4gICAgICAgIHJldHVybiBwb3NcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCkgLT5cbiAgICBlbmQgPSBzdGFydCBpZiBhcmd1bWVudHMubGVuZ3RoIDwgMlxuICAgIGlmIEBzZWxlY3Rpb25Qcm9wRXhpc3RzXG4gICAgICBAdG1wQ3Vyc29yUG9zID0gbmV3IFBvcyhzdGFydCxlbmQpXG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBzZXRUaW1lb3V0ICg9PlxuICAgICAgICBAdG1wQ3Vyc29yUG9zID0gbnVsbFxuICAgICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgICksIDFcbiAgICBlbHNlIFxuICAgICAgQHNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpXG4gICAgcmV0dXJuXG4gIHNldEN1cnNvclBvc0ZhbGxiYWNrOiAoc3RhcnQsIGVuZCkgLT5cbiAgICBpZiBAb2JqLmNyZWF0ZVRleHRSYW5nZVxuICAgICAgcm5nID0gQG9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgcm5nLm1vdmVTdGFydCBcImNoYXJhY3RlclwiLCBzdGFydFxuICAgICAgcm5nLmNvbGxhcHNlKClcbiAgICAgIHJuZy5tb3ZlRW5kIFwiY2hhcmFjdGVyXCIsIGVuZCAtIHN0YXJ0XG4gICAgICBybmcuc2VsZWN0KClcbiAgZ2V0TGFuZzogLT5cbiAgICByZXR1cm4gQF9sYW5nIGlmIEBfbGFuZ1xuICAgIEBvYmouZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKSBpZiBAb2JqLmhhc0F0dHJpYnV0ZSgnZGF0YS1sYW5nJylcbiAgc2V0TGFuZzogKHZhbCkgLT5cbiAgICBAX2xhbmcgPSB2YWxcbiAgICBAb2JqLnNldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJyx2YWwpXG4gIGNhbkxpc3RlblRvQ2hhbmdlOiAtPlxuICAgIHJldHVybiB0cnVlXG4gIGFkZENoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgQGNoYW5nZUxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKVxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIGlmIChpID0gQGNoYW5nZUxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgPiAtMVxuICAgICAgQGNoYW5nZUxpc3RlbmVycy5zcGxpY2UoaSwgMSlcbiAgICAgIFxuICAgICAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzOiAocmVwbGFjZW1lbnRzKSAtPlxuICAgIGlmIHJlcGxhY2VtZW50cy5sZW5ndGggPiAwIGFuZCByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucy5sZW5ndGggPCAxXG4gICAgICByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucyA9IFtAZ2V0Q3Vyc29yUG9zKCldXG4gICAgc3VwZXIocmVwbGFjZW1lbnRzKTtcbiAgICAgICIsInZhciBpc0VsZW1lbnQ7XG5cbmltcG9ydCB7XG4gIFRleHRQYXJzZXJcbn0gZnJvbSAnLi9UZXh0UGFyc2VyJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IHZhciBEb21LZXlMaXN0ZW5lciA9IGNsYXNzIERvbUtleUxpc3RlbmVyIHtcbiAgc3RhcnRMaXN0ZW5pbmcodGFyZ2V0KSB7XG4gICAgdmFyIG9ua2V5ZG93biwgb25rZXlwcmVzcywgb25rZXl1cCwgdGltZW91dDtcbiAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICBvbmtleWRvd24gPSAoZSkgPT4ge1xuICAgICAgaWYgKChDb2Rld2F2ZS5pbnN0YW5jZXMubGVuZ3RoIDwgMiB8fCB0aGlzLm9iaiA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgJiYgZS5rZXlDb2RlID09PSA2OSAmJiBlLmN0cmxLZXkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAodGhpcy5vbkFjdGl2YXRpb25LZXkgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQWN0aXZhdGlvbktleSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBvbmtleXVwID0gKGUpID0+IHtcbiAgICAgIGlmICh0aGlzLm9uQW55Q2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBvbmtleXByZXNzID0gKGUpID0+IHtcbiAgICAgIGlmICh0aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9uQW55Q2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFueUNoYW5nZShlKTtcbiAgICAgICAgfVxuICAgICAgfSksIDEwMCk7XG4gICAgfTtcbiAgICBpZiAodGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbmtleWRvd24pO1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBvbmtleXVwKTtcbiAgICAgIHJldHVybiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIG9ua2V5cHJlc3MpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmF0dGFjaEV2ZW50KSB7XG4gICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleWRvd25cIiwgb25rZXlkb3duKTtcbiAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5dXBcIiwgb25rZXl1cCk7XG4gICAgICByZXR1cm4gdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlwcmVzc1wiLCBvbmtleXByZXNzKTtcbiAgICB9XG4gIH1cblxufTtcblxuaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBlO1xuICB0cnkge1xuICAgIC8vIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tKVxuICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgLy8gQnJvd3NlcnMgbm90IHN1cHBvcnRpbmcgVzMgRE9NMiBkb24ndCBoYXZlIEhUTUxFbGVtZW50IGFuZFxuICAgIC8vIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG4gICAgcmV0dXJuICh0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiKSAmJiAob2JqLm5vZGVUeXBlID09PSAxKSAmJiAodHlwZW9mIG9iai5zdHlsZSA9PT0gXCJvYmplY3RcIikgJiYgKHR5cGVvZiBvYmoub3duZXJEb2N1bWVudCA9PT0gXCJvYmplY3RcIik7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgVGV4dEFyZWFFZGl0b3IgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIFRleHRBcmVhRWRpdG9yIGV4dGVuZHMgVGV4dFBhcnNlciB7XG4gICAgY29uc3RydWN0b3IodGFyZ2V0MSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0MTtcbiAgICAgIHRoaXMub2JqID0gaXNFbGVtZW50KHRoaXMudGFyZ2V0KSA/IHRoaXMudGFyZ2V0IDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXQpO1xuICAgICAgaWYgKHRoaXMub2JqID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgXCJUZXh0QXJlYSBub3QgZm91bmRcIjtcbiAgICAgIH1cbiAgICAgIHRoaXMubmFtZXNwYWNlID0gJ3RleHRhcmVhJztcbiAgICAgIHRoaXMuY2hhbmdlTGlzdGVuZXJzID0gW107XG4gICAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPSAwO1xuICAgIH1cblxuICAgIG9uQW55Q2hhbmdlKGUpIHtcbiAgICAgIHZhciBjYWxsYmFjaywgaiwgbGVuMSwgcmVmLCByZXN1bHRzO1xuICAgICAgaWYgKHRoaXMuX3NraXBDaGFuZ2VFdmVudCA8PSAwKSB7XG4gICAgICAgIHJlZiA9IHRoaXMuY2hhbmdlTGlzdGVuZXJzO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgY2FsbGJhY2sgPSByZWZbal07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKGNhbGxiYWNrKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50LS07XG4gICAgICAgIGlmICh0aGlzLm9uU2tpcGVkQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vblNraXBlZENoYW5nZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2tpcENoYW5nZUV2ZW50KG5iID0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NraXBDaGFuZ2VFdmVudCArPSBuYjtcbiAgICB9XG5cbiAgICBiaW5kZWRUbyhjb2Rld2F2ZSkge1xuICAgICAgdGhpcy5vbkFjdGl2YXRpb25LZXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvZGV3YXZlLm9uQWN0aXZhdGlvbktleSgpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0TGlzdGVuaW5nKGRvY3VtZW50KTtcbiAgICB9XG5cbiAgICBzZWxlY3Rpb25Qcm9wRXhpc3RzKCkge1xuICAgICAgcmV0dXJuIFwic2VsZWN0aW9uU3RhcnRcIiBpbiB0aGlzLm9iajtcbiAgICB9XG5cbiAgICBoYXNGb2N1cygpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLm9iajtcbiAgICB9XG5cbiAgICB0ZXh0KHZhbCkge1xuICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy50ZXh0RXZlbnRDaGFuZ2UodmFsKSkge1xuICAgICAgICAgIHRoaXMub2JqLnZhbHVlID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmoudmFsdWU7XG4gICAgfVxuXG4gICAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0RXZlbnRDaGFuZ2UodGV4dCwgc3RhcnQsIGVuZCkgfHwgdGhpcy5zcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHN1cGVyLnNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCk7XG4gICAgfVxuXG4gICAgdGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgICAgdmFyIGV2ZW50O1xuICAgICAgaWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50ICE9IG51bGwpIHtcbiAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50Jyk7XG4gICAgICB9XG4gICAgICBpZiAoKGV2ZW50ICE9IG51bGwpICYmIChldmVudC5pbml0VGV4dEV2ZW50ICE9IG51bGwpICYmIGV2ZW50LmlzVHJ1c3RlZCAhPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRleHQubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIGlmIChzdGFydCAhPT0gMCkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihzdGFydCAtIDEsIHN0YXJ0KTtcbiAgICAgICAgICAgIHN0YXJ0LS07XG4gICAgICAgICAgfSBlbHNlIGlmIChlbmQgIT09IHRoaXMudGV4dExlbigpKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKGVuZCwgZW5kICsgMSk7XG4gICAgICAgICAgICBlbmQrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBldmVudC5pbml0VGV4dEV2ZW50KCd0ZXh0SW5wdXQnLCB0cnVlLCB0cnVlLCBudWxsLCB0ZXh0LCA5KTtcbiAgICAgICAgLy8gQHNldEN1cnNvclBvcyhzdGFydCxlbmQpXG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZDtcbiAgICAgICAgdGhpcy5vYmouZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIHRoaXMuc2tpcENoYW5nZUV2ZW50KCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSB7XG4gICAgICBpZiAoZG9jdW1lbnQuZXhlY0NvbW1hbmQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgICAgICBlbmQgPSB0aGlzLnRleHRMZW4oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXJzb3JQb3MoKSB7XG4gICAgICBpZiAodGhpcy50bXBDdXJzb3JQb3MgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy50bXBDdXJzb3JQb3M7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5oYXNGb2N1cykge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25Qcm9wRXhpc3RzKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQb3ModGhpcy5vYmouc2VsZWN0aW9uU3RhcnQsIHRoaXMub2JqLnNlbGVjdGlvbkVuZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldEN1cnNvclBvc0ZhbGxiYWNrKCkge1xuICAgICAgdmFyIGxlbiwgcG9zLCBybmcsIHNlbDtcbiAgICAgIGlmICh0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIGlmIChzZWwucGFyZW50RWxlbWVudCgpID09PSB0aGlzLm9iaikge1xuICAgICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayhzZWwuZ2V0Qm9va21hcmsoKSk7XG4gICAgICAgICAgbGVuID0gMDtcbiAgICAgICAgICB3aGlsZSAocm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwKSB7XG4gICAgICAgICAgICBsZW4rKztcbiAgICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcm5nLnNldEVuZFBvaW50KFwiU3RhcnRUb1N0YXJ0XCIsIHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpKTtcbiAgICAgICAgICBwb3MgPSBuZXcgUG9zKDAsIGxlbik7XG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMCkge1xuICAgICAgICAgICAgcG9zLnN0YXJ0Kys7XG4gICAgICAgICAgICBwb3MuZW5kKys7XG4gICAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwb3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgIGVuZCA9IHN0YXJ0O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJvcEV4aXN0cykge1xuICAgICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG5ldyBQb3Moc3RhcnQsIGVuZCk7XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZDtcbiAgICAgICAgc2V0VGltZW91dCgoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudG1wQ3Vyc29yUG9zID0gbnVsbDtcbiAgICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICAgIHJldHVybiB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIH0pLCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZCkge1xuICAgICAgdmFyIHJuZztcbiAgICAgIGlmICh0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgcm5nID0gdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgIHJuZy5tb3ZlU3RhcnQoXCJjaGFyYWN0ZXJcIiwgc3RhcnQpO1xuICAgICAgICBybmcuY29sbGFwc2UoKTtcbiAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgZW5kIC0gc3RhcnQpO1xuICAgICAgICByZXR1cm4gcm5nLnNlbGVjdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldExhbmcoKSB7XG4gICAgICBpZiAodGhpcy5fbGFuZykge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFuZztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldExhbmcodmFsKSB7XG4gICAgICB0aGlzLl9sYW5nID0gdmFsO1xuICAgICAgcmV0dXJuIHRoaXMub2JqLnNldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJywgdmFsKTtcbiAgICB9XG5cbiAgICBjYW5MaXN0ZW5Ub0NoYW5nZSgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgIHZhciBpO1xuICAgICAgaWYgKChpID0gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpIHtcbiAgICAgIGlmIChyZXBsYWNlbWVudHMubGVuZ3RoID4gMCAmJiByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zID0gW3RoaXMuZ2V0Q3Vyc29yUG9zKCldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cGVyLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gICAgfVxuXG4gIH07XG5cbiAgVGV4dEFyZWFFZGl0b3IucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nID0gRG9tS2V5TGlzdGVuZXIucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nO1xuXG4gIHJldHVybiBUZXh0QXJlYUVkaXRvcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsImltcG9ydCB7IEVkaXRvciB9IGZyb20gJy4vRWRpdG9yJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IGNsYXNzIFRleHRQYXJzZXIgZXh0ZW5kcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IChAX3RleHQpIC0+XG4gICAgc3VwZXIoKVxuICB0ZXh0OiAodmFsKSAtPlxuICAgIEBfdGV4dCA9IHZhbCBpZiB2YWw/XG4gICAgQF90ZXh0XG4gIHRleHRDaGFyQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KClbcG9zXVxuICB0ZXh0TGVuOiAocG9zKSAtPlxuICAgIHJldHVybiBAdGV4dCgpLmxlbmd0aFxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICByZXR1cm4gQHRleHQoKS5zdWJzdHJpbmcoc3RhcnQsIGVuZClcbiAgaW5zZXJ0VGV4dEF0OiAodGV4dCwgcG9zKSAtPlxuICAgIEB0ZXh0KEB0ZXh0KCkuc3Vic3RyaW5nKDAsIHBvcykrdGV4dCtAdGV4dCgpLnN1YnN0cmluZyhwb3MsQHRleHQoKS5sZW5ndGgpKVxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICBAdGV4dChAdGV4dCgpLnNsaWNlKDAsIHN0YXJ0KSArICh0ZXh0IHx8IFwiXCIpICsgQHRleHQoKS5zbGljZShlbmQpKVxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgcmV0dXJuIEB0YXJnZXRcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCkgLT5cbiAgICBlbmQgPSBzdGFydCBpZiBhcmd1bWVudHMubGVuZ3RoIDwgMlxuICAgIEB0YXJnZXQgPSBuZXcgUG9zKCBzdGFydCwgZW5kICkiLCJpbXBvcnQge1xuICBFZGl0b3Jcbn0gZnJvbSAnLi9FZGl0b3InO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5leHBvcnQgdmFyIFRleHRQYXJzZXIgPSBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yIHtcbiAgY29uc3RydWN0b3IoX3RleHQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3RleHQgPSBfdGV4dDtcbiAgfVxuXG4gIHRleHQodmFsKSB7XG4gICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl90ZXh0ID0gdmFsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdGV4dDtcbiAgfVxuXG4gIHRleHRDaGFyQXQocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpW3Bvc107XG4gIH1cblxuICB0ZXh0TGVuKHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS5sZW5ndGg7XG4gIH1cblxuICB0ZXh0U3Vic3RyKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xuICB9XG5cbiAgaW5zZXJ0VGV4dEF0KHRleHQsIHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQodGhpcy50ZXh0KCkuc3Vic3RyaW5nKDAsIHBvcykgKyB0ZXh0ICsgdGhpcy50ZXh0KCkuc3Vic3RyaW5nKHBvcywgdGhpcy50ZXh0KCkubGVuZ3RoKSk7XG4gIH1cblxuICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnNsaWNlKDAsIHN0YXJ0KSArICh0ZXh0IHx8IFwiXCIpICsgdGhpcy50ZXh0KCkuc2xpY2UoZW5kKSk7XG4gIH1cblxuICBnZXRDdXJzb3JQb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0O1xuICB9XG5cbiAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIGVuZCA9IHN0YXJ0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50YXJnZXQgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vQ29kZXdhdmUnO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBDb3JlQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgSnNDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvSnNDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgUGhwQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL1BocENvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBIdG1sQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgRmlsZUNvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9GaWxlQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IFN0cmluZ0NvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9TdHJpbmdDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgV3JhcHBlZFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvV3JhcHBlZFBvcyc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VFbmdpbmUgfSBmcm9tICcuL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZSc7XG5cblBvcy53cmFwQ2xhc3MgPSBXcmFwcGVkUG9zXG5cbkNvZGV3YXZlLmluc3RhbmNlcyA9IFtdXG5cbkNvbW1hbmQucHJvdmlkZXJzID0gW1xuICBuZXcgQ29yZUNvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBQaHBDb21tYW5kUHJvdmlkZXIoKVxuICBuZXcgSHRtbENvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBGaWxlQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IFN0cmluZ0NvbW1hbmRQcm92aWRlcigpXG5dXG5cbmlmIGxvY2FsU3RvcmFnZT9cbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZUVuZ2luZSgpXG5cbmV4cG9ydCB7IENvZGV3YXZlIH0iLCJpbXBvcnQge1xuICBDb2Rld2F2ZVxufSBmcm9tICcuL0NvZGV3YXZlJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBDb3JlQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgSnNDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgUGhwQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9QaHBDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBIdG1sQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgRmlsZUNvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0NvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvU3RyaW5nQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgV3JhcHBlZFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MnO1xuXG5pbXBvcnQge1xuICBMb2NhbFN0b3JhZ2VFbmdpbmVcbn0gZnJvbSAnLi9zdG9yYWdlRW5naW5lcy9Mb2NhbFN0b3JhZ2VFbmdpbmUnO1xuXG5Qb3Mud3JhcENsYXNzID0gV3JhcHBlZFBvcztcblxuQ29kZXdhdmUuaW5zdGFuY2VzID0gW107XG5cbkNvbW1hbmQucHJvdmlkZXJzID0gW25ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpLCBuZXcgUGhwQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBGaWxlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBTdHJpbmdDb21tYW5kUHJvdmlkZXIoKV07XG5cbmlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlRW5naW5lKCk7XG59XG5cbmV4cG9ydCB7XG4gIENvZGV3YXZlXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kLCBCYXNlQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgTGFuZ0RldGVjdG9yIH0gZnJvbSAnLi4vZGV0ZWN0b3JzL0xhbmdEZXRlY3Rvcic7XG5pbXBvcnQgeyBBbHdheXNFbmFibGVkIH0gZnJvbSAnLi4vZGV0ZWN0b3JzL0Fsd2F5c0VuYWJsZWQnO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi4vQm94SGVscGVyJztcbmltcG9ydCB7IEVkaXRDbWRQcm9wIH0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGF0aEhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvUGF0aEhlbHBlcic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKVxuICBjbWRzLmFkZERldGVjdG9yKG5ldyBBbHdheXNFbmFibGVkKCdjb3JlJykpXG4gIGNvcmUuYWRkRGV0ZWN0b3IobmV3IExhbmdEZXRlY3RvcigpKVxuICBcbiAgY29yZS5hZGRDbWRzKHtcbiAgICAnaGVscCc6e1xuICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICdyZXN1bHQnIDogaGVscCxcbiAgICAgICdwYXJzZScgOiB0cnVlLFxuICAgICAgJ2FsbG93ZWROYW1lZCcgOiBbJ2NtZCddLFxuICAgICAgJ2hlbHAnIDogXCJcIlwiXG4gICAgICAgIFRvIGdldCBoZWxwIG9uIGEgcGVjaWZpYyBjb21tYW5kLCBkbyA6XG4gICAgICAgIH5+aGVscCBoZWxsb35+IChoZWxsbyBiZWluZyB0aGUgY29tbWFuZClcbiAgICAgICAgXCJcIlwiIFxuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnb3ZlcnZpZXcnOntcbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICAgIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXG4gICAgICAgICAgICAgLyBfX3xfX18gIF9ffCB8X19cXFxcIFxcXFwgICAgLyAvXyBfX18gX19fX19fXG4gICAgICAgICAgICAvIC9fXy8gXyBcXFxcLyBfYCAvIC1fXFxcXCBcXFxcL1xcXFwvIC8gX2AgXFxcXCBWIC8gLV8vXG4gICAgICAgICAgICBcXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XG4gICAgICAgICAgICBUaGUgdGV4dCBlZGl0b3IgaGVscGVyXG4gICAgICAgICAgICB+fi9xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBXaGVuIHVzaW5nIENvZGV3YXZlIHlvdSB3aWxsIGJlIHdyaXRpbmcgY29tbWFuZHMgd2l0aGluIFxuICAgICAgICAgICAgeW91ciB0ZXh0IGVkaXRvci4gVGhlc2UgY29tbWFuZHMgbXVzdCBiZSBwbGFjZWQgYmV0d2VlbiB0d28gXG4gICAgICAgICAgICBwYWlycyBvZiBcIn5cIiAodGlsZGUpIGFuZCB0aGVuLCB0aGV5IGNhbiBiZSBleGVjdXRlZCBieSBwcmVzc2luZyBcbiAgICAgICAgICAgIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiwgd2l0aCB5b3VyIGN1cnNvciBpbnNpZGUgdGhlIGNvbW1hbmRcbiAgICAgICAgICAgIEV4OiB+fiFoZWxsb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFlvdSBkb250IG5lZWQgdG8gYWN0dWFsbHkgdHlwZSBhbnkgXCJ+XCIgKHRpbGRlKS4gXG4gICAgICAgICAgICBQcmVzc2luZyBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XG4gICAgICAgICAgICB3aXRoaW4gYSBjb21tYW5kLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxuICAgICAgICAgICAgSW5zdGVhZCwgaXQgdXNlcyB0ZXh0IHdpdGhpbiBjb2RlIGNvbW1lbnRzIHRvIG1pbWljIFVJcy4gXG4gICAgICAgICAgICBUaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcbiAgICAgICAgICAgIGluIHRoZSBoZWxwIHNlY3Rpb25zLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBUbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXG4gICAgICAgICAgICBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBVc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcbiAgICAgICAgICAgIGZlYXR1cmVzIG9mIENvZGV3YXZlXG4gICAgICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgTGlzdCBvZiBhbGwgaGVscCBzdWJqZWN0cyBcbiAgICAgICAgICAgIH5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fiFjbG9zZX5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ3N1YmplY3RzJzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn4haGVscH5+XG4gICAgICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxuICAgICAgICAgICAgfn4haGVscDpzdWJqZWN0c35+ICh+fiFoZWxwOnN1Yn5+KVxuICAgICAgICAgICAgfn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnc3ViJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpoZWxwOnN1YmplY3RzJ1xuICAgICAgICB9XG4gICAgICAgICdnZXRfc3RhcnRlZCc6e1xuICAgICAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICAgIFRoZSBjbGFzc2ljIEhlbGxvIFdvcmxkLlxuICAgICAgICAgICAgfn4haGVsbG98fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn5oZWxwOmVkaXRpbmc6aW50cm9+flxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBjcmVhdGluZyB5b3VyIG93biBjb21tYW5kcywgc2VlOlxuICAgICAgICAgICAgfn4haGVscDplZGl0aW5nfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29kZXdhdmUgY29tZXMgd2l0aCBtYW55IHByZS1leGlzdGluZyBjb21tYW5kcy4gSGVyZSBpcyBhbiBleGFtcGxlXG4gICAgICAgICAgICBvZiBKYXZhU2NyaXB0IGFiYnJldmlhdGlvbnNcbiAgICAgICAgICAgIH5+IWpzOmZ+flxuICAgICAgICAgICAgfn4hanM6aWZ+flxuICAgICAgICAgICAgICB+fiFqczpsb2d+flwifn4haGVsbG9+flwifn4hL2pzOmxvZ35+XG4gICAgICAgICAgICB+fiEvanM6aWZ+flxuICAgICAgICAgICAgfn4hL2pzOmZ+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXG4gICAgICAgICAgICBwcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxuICAgICAgICAgICAgdXNlZCBhdXRvbWF0aWNhbGx5IGlmIHlvdSBhcmUgaW4gYSBIVE1MIG9yIENTUyBmaWxlLlxuICAgICAgICAgICAgfn4hdWw+bGl+fiAoaWYgeW91IGFyZSBpbiBhIGh0bWwgZG9jY3VtZW50KVxuICAgICAgICAgICAgfn4hZW1tZXQgdWw+bGl+flxuICAgICAgICAgICAgfn4hZW1tZXQgbTIgY3Nzfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxuICAgICAgICAgICAgZGlmZmVyZW50IHJlc3VsdHMgZGVwZW5kaW5nIG9uIHRoZSBuYW1lc3BhY2UuXG4gICAgICAgICAgICB+fiFqczplYWNofn5cbiAgICAgICAgICAgIH5+IXBocDpvdXRlcjplYWNofn5cbiAgICAgICAgICAgIH5+IXBocDppbm5lcjplYWNofn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXG4gICAgICAgICAgICBmb2xsb3dpbmcgY29tbWFuZHMgYXJlIHRoZSBzYW1lIGFuZCB3aWxsIGRpc3BsYXkgdGhlIGN1cnJlbnRseVxuICAgICAgICAgICAgYWN0aXZlIG5hbWVzcGFjZS4gVGhlIGZpcnN0IGNvbW1hbmQgY29tbWFuZCB3b3JrcyBiZWNhdXNlIHRoZSBcbiAgICAgICAgICAgIGNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZX5+XG4gICAgICAgICAgICB+fiFjb3JlOm5hbWVzcGFjZX5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFlvdSBjYW4gbWFrZSBhIG5hbWVzcGFjZSBhY3RpdmUgd2l0aCB0aGUgZm9sbG93aW5nIGNvbW1hbmQuXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2UgcGhwfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ2hlY2sgdGhlIG5hbWVzcGFjZXMgYWdhaW5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZX5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEluIGFkZGl0aW9uIHRvIGRldGVjdGluZyB0aGUgZG9jdW1lbnQgdHlwZSwgQ29kZXdhdmUgY2FuIGRldGVjdCB0aGVcbiAgICAgICAgICAgIGNvbnRleHQgZnJvbSB0aGUgc3Vycm91bmRpbmcgdGV4dC4gSW4gYSBQSFAgZmlsZSwgaXQgbWVhbnMgQ29kZXdhdmUgXG4gICAgICAgICAgICB3aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fi9xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnZGVtbyc6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6aGVscDpnZXRfc3RhcnRlZCdcbiAgICAgICAgfVxuICAgICAgICAnZWRpdGluZyc6e1xuICAgICAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgICAgICdpbnRybyc6e1xuICAgICAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgICAgIENvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXG4gICAgICAgICAgICAgICAgcHV0IHlvdXIgY29udGVudCBpbnNpZGUgXCJzb3VyY2VcIiB0aGUgZG8gXCJzYXZlXCIuIFRyeSBhZGRpbmcgYW55IFxuICAgICAgICAgICAgICAgIHRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXG4gICAgICAgICAgICAgICAgfn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIElmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XG4gICAgICAgICAgICAgICAgZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxuICAgICAgICAgICAgICAgIHdoZW5ldmVyIHlvdSB3YW50LlxuICAgICAgICAgICAgICAgIH5+IW15X25ld19jb21tYW5kfn5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn5oZWxwOmVkaXRpbmc6aW50cm9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBBbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcImJveFwiLiBcbiAgICAgICAgICAgIFRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXG4gICAgICAgICAgICBUaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXG4gICAgICAgICAgICBcImNsb3NlXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxuICAgICAgICAgICAgY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5LlxuICAgICAgICAgICAgfn4hYm94fn5cbiAgICAgICAgICAgIFRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgV2hlbiB5b3UgY3JlYXRlIGEgY29tbWFuZCwgeW91IG1heSB3YW50IHRvIHNwZWNpZnkgd2hlcmUgdGhlIGN1cnNvciBcbiAgICAgICAgICAgIHdpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcInxcIiBcbiAgICAgICAgICAgIChWZXJ0aWNhbCBiYXIpLiBVc2UgMiBvZiB0aGVtIGlmIHlvdSB3YW50IHRvIHByaW50IHRoZSBhY3R1YWwgXG4gICAgICAgICAgICBjaGFyYWN0ZXIuXG4gICAgICAgICAgICB+fiFib3h+flxuICAgICAgICAgICAgb25lIDogfCBcbiAgICAgICAgICAgIHR3byA6IHx8XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgWW91IGNhbiBhbHNvIHVzZSB0aGUgXCJlc2NhcGVfcGlwZXNcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxuICAgICAgICAgICAgdmVydGljYWwgYmFycyB0aGF0IGFyZSBiZXR3ZWVuIGl0cyBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3NcbiAgICAgICAgICAgIH5+IWVzY2FwZV9waXBlc35+XG4gICAgICAgICAgICB8XG4gICAgICAgICAgICB+fiEvZXNjYXBlX3BpcGVzfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cbiAgICAgICAgICAgIElmIHlvdSB3YW50IHRvIHByaW50IGEgY29tbWFuZCB3aXRob3V0IGhhdmluZyBpdCBleHBhbmQgd2hlbiBcbiAgICAgICAgICAgIHRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXCIhXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxuICAgICAgICAgICAgfn4hIWhlbGxvfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXG4gICAgICAgICAgICB0aGUgXCJjb250ZW50XCIgY29tbWFuZC4gXCJjb250ZW50XCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XG4gICAgICAgICAgICB0aGF0IGlzIGJldHdlZW4gdGhlIHRhZ3MuIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBob3cgaXQgY2FuIGJlIHVzZWQuXG4gICAgICAgICAgICB+fiFlZGl0IHBocDppbm5lcjppZn5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdlZGl0Jzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpoZWxwOmVkaXRpbmcnXG4gICAgICAgIH1cbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgfSxcbiAgICAnbm9fZXhlY3V0ZSc6e1xuICAgICAgJ3Jlc3VsdCcgOiBub19leGVjdXRlXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBQcmV2ZW50IGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgZnJvbSBleGVjdXRpbmdcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnZXNjYXBlX3BpcGVzJzp7XG4gICAgICAncmVzdWx0JyA6IHF1b3RlX2NhcnJldCxcbiAgICAgICdjaGVja0NhcnJldCcgOiBmYWxzZVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgRXNjYXBlIGFsbCBjYXJyZXRzIChmcm9tIFwifFwiIHRvIFwifHxcIilcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncXVvdGVfY2FycmV0Jzp7XG4gICAgICAnYWxpYXNPZic6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICB9XG4gICAgJ2V4ZWNfcGFyZW50Jzp7XG4gICAgICAnZXhlY3V0ZScgOiBleGVjX3BhcmVudFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1xuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdjb250ZW50Jzp7XG4gICAgICAncmVzdWx0JyA6IGdldENvbnRlbnRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIE1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxuICAgICAgICB0aGlzIHdpbGwgcmV0dXJuIHdoYXQgd2FzIGJldHdlZW4gdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBvZiBhIGNvbW1hbmRcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnYm94Jzp7XG4gICAgICAnY2xzJyA6IEJveENtZFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQ3JlYXRlIHRoZSBhcHBhcmVuY2Ugb2YgYSBib3ggY29tcG9zZWQgZnJvbSBjaGFyYWN0ZXJzLiBcbiAgICAgICAgVXN1YWxseSB3cmFwcGVkIGluIGEgY29tbWVudC5cblxuICAgICAgICBUaGUgYm94IHdpbGwgdHJ5IHRvIGFqdXN0IGl0J3Mgc2l6ZSBmcm9tIHRoZSBjb250ZW50XG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2Nsb3NlJzp7XG4gICAgICAnY2xzJyA6IENsb3NlQ21kXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBXaWxsIGNsb3NlIHRoZSBmaXJzdCBib3ggYXJvdW5kIHRoaXNcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncGFyYW0nOntcbiAgICAgICdyZXN1bHQnIDogZ2V0UGFyYW1cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIE1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxuICAgICAgICB0aGlzIHdpbGwgcmV0dXJuIGEgcGFyYW1ldGVyIGZyb20gdGhpcyBjb21tYW5kIGNhbGxcblxuICAgICAgICBZb3UgY2FuIHBhc3MgYSBudW1iZXIsIGEgc3RyaW5nLCBvciBib3RoLiBcbiAgICAgICAgQSBudW1iZXIgZm9yIGEgcG9zaXRpb25lZCBhcmd1bWVudCBhbmQgYSBzdHJpbmdcbiAgICAgICAgZm9yIGEgbmFtZWQgcGFyYW1ldGVyXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2VkaXQnOntcbiAgICAgICdjbWRzJyA6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICdzYXZlJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAnY2xzJyA6IEVkaXRDbWQsXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2NtZCddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxuICAgICAgICBTZWUgfn4haGVscDplZGl0aW5nfn4gZm9yIGEgcXVpY2sgdHV0b3JpYWxcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncmVuYW1lJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfYXBwbGljYWJsZScgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCIsXG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiByZW5hbWVDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWUsXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2Zyb20nLCd0byddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBBbGxvd3MgdG8gcmVuYW1lIGEgY29tbWFuZCBhbmQgY2hhbmdlIGl0J3MgbmFtZXNwYWNlLiBcbiAgICAgICAgWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAtIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcbiAgICAgICAgLSBUaGVuIHNlY29uZCBwYXJhbSBpcyB0aGUgbmV3IG5hbWUsIGlmIGl0IGhhcyBubyBuYW1lc3BhY2UsXG4gICAgICAgICAgaXQgd2lsbCB1c2UgdGhlIG9uZSBmcm9tIHRoZSBvcmlnaW5hbCBjb21tYW5kLlxuXG4gICAgICAgIGV4Ljogfn4hcmVuYW1lIG15X2NvbW1hbmQgbXlfY29tbWFuZDJ+flxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdyZW1vdmUnOntcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ25vdF9hcHBsaWNhYmxlJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBZb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIixcbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgICAncmVzdWx0JyA6IHJlbW92ZUNvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydjbWQnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQWxsb3dzIHRvIHJlbW92ZSBhIGNvbW1hbmQuIFxuICAgICAgICBZb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2FsaWFzJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiBhbGlhc0NvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgIH0sXG4gICAgJ25hbWVzcGFjZSc6e1xuICAgICAgJ2NscycgOiBOYW1lU3BhY2VDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIFNob3cgdGhlIGN1cnJlbnQgbmFtZXNwYWNlcy5cblxuICAgICAgICBBIG5hbWUgc3BhY2UgY291bGQgYmUgdGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlXG4gICAgICAgIG9yIG90aGVyIGtpbmQgb2YgY29udGV4dHNcblxuICAgICAgICBJZiB5b3UgcGFzcyBhIHBhcmFtIHRvIHRoaXMgY29tbWFuZCwgaXQgd2lsbCBcbiAgICAgICAgYWRkIHRoZSBwYXJhbSBhcyBhIG5hbWVzcGFjZSBmb3IgdGhlIGN1cnJlbnQgZWRpdG9yXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ25zcGMnOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOm5hbWVzcGFjZSdcbiAgICB9LFxuICAgICdsaXN0Jzp7XG4gICAgICAncmVzdWx0JyA6IGxpc3RDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCdib3gnLCdjb250ZXh0J11cbiAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcblxuICAgICAgICBZb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcbiAgICAgICAgYnkgZGVmYXVsdCBhbGwgY3VyZW50IG5hbWVzcGFjZSB3aWxsIGJlIHNob3duXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2xzJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTpsaXN0J1xuICAgIH0sXG4gICAgJ2dldCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBnZXRDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgb3V0cHV0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3NldCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBzZXRDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCd2YWx1ZScsJ3ZhbCddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBzZXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnc3RvcmVfanNvbic6e1xuICAgICAgJ3Jlc3VsdCcgOiBzdG9yZUpzb25Db21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCdqc29uJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHNldCBhIHZhcmlhYmxlIHdpdGggc29tZSBqc29uIGRhdGFcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnanNvbic6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6c3RvcmVfanNvbidcbiAgICB9LFxuICAgICd0ZW1wbGF0ZSc6e1xuICAgICAgJ2NscycgOiBUZW1wbGF0ZUNtZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJywnc2VwJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHJlbmRlciBhIHRlbXBsYXRlIGZvciBhIHZhcmlhYmxlXG5cbiAgICAgICAgSWYgdGhlIGZpcnN0IHBhcmFtIGlzIG5vdCBzZXQgaXQgd2lsbCB1c2UgYWxsIHZhcmlhYmxlcyBcbiAgICAgICAgZm9yIHRoZSByZW5kZXJcbiAgICAgICAgSWYgdGhlIHZhcmlhYmxlIGlzIGFuIGFycmF5IHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIHJlcGVhdGVkIFxuICAgICAgICBmb3IgZWFjaCBpdGVtc1xuICAgICAgICBUaGUgYHNlcGAgcGFyYW0gZGVmaW5lIHdoYXQgd2lsbCBzZXBhcmF0ZSBlYWNoIGl0ZW0gXG4gICAgICAgIGFuZCBkZWZhdWx0IHRvIGEgbGluZSBicmVha1xuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdlbW1ldCc6e1xuICAgICAgJ2NscycgOiBFbW1ldENtZFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxuICAgICAgICBwcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy5cblxuICAgICAgICBQYXNzIHRoZSBFbW1ldCBhYmJyZXZpYXRpb24gYXMgYSBwYXJhbSB0byBleHBlbmQgaXQuXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgXG4gIH0pXG4gIFxuaGVscCA9IChpbnN0YW5jZSkgLT5cbiAgY21kTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgaWYgY21kTmFtZT9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChjbWROYW1lKVxuICAgIGlmIGNtZD9cbiAgICAgIGhlbHBDbWQgPSBjbWQuZ2V0Q21kKCdoZWxwJylcbiAgICAgIHRleHQgPSBpZiBoZWxwQ21kIHRoZW4gXCJ+fiN7aGVscENtZC5mdWxsTmFtZX1+flwiIGVsc2UgXCJUaGlzIGNvbW1hbmQgaGFzIG5vIGhlbHAgdGV4dFwiXG4gICAgICBzdWJjb21tYW5kcyA9IGlmIGNtZC5jbWRzLmxlbmd0aFxuICAgICAgICBcIlwiXCJcblxuICAgICAgICBTdWItQ29tbWFuZHMgOlxuICAgICAgICB+fmxzICN7Y21kLmZ1bGxOYW1lfSBib3g6bm8gY29udGV4dDpub35+XG4gICAgICAgIFwiXCJcIlxuICAgICAgZWxzZSBcbiAgICAgICAgXCJcIlxuICAgICAgcmV0dXJuIFwiXCJcIlxuICAgICAgICB+fmJveH5+XG4gICAgICAgIEhlbHAgZm9yIH5+ISN7Y21kLmZ1bGxOYW1lfX5+IDpcblxuICAgICAgICAje3RleHR9XG4gICAgICAgICN7c3ViY29tbWFuZHN9XG5cbiAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgfn4vYm94fn5cbiAgICAgICAgXCJcIlwiXG4gICAgZWxzZSBcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIlxuICBlbHNlXG4gICAgcmV0dXJuICd+fmhlbHA6b3ZlcnZpZXd+fidcblxubm9fZXhlY3V0ZSA9IChpbnN0YW5jZSkgLT5cbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIrU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzKSArICcpJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikpXG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsJyQxJylcbiAgXG5xdW90ZV9jYXJyZXQgPSAoaW5zdGFuY2UpIC0+XG4gIHJldHVybiBpbnN0YW5jZS5jb250ZW50LnJlcGxhY2UoL1xcfC9nLCAnfHwnKVxuZXhlY19wYXJlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGlmIGluc3RhbmNlLnBhcmVudD9cbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpXG4gICAgaW5zdGFuY2UucmVwbGFjZVN0YXJ0ID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VTdGFydFxuICAgIGluc3RhbmNlLnJlcGxhY2VFbmQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZUVuZFxuICAgIHJldHVybiByZXNcbmdldENvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSxmYWxzZSlcbiAgcHJlZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgc3VmZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgaWYgaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZT9cbiAgICByZXR1cm4gcHJlZml4ICsgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuY29udGVudCBvciAnJykgKyBzdWZmaXhcbiAgaWYgYWZmaXhlc19lbXB0eVxuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXhcbnJlbmFtZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG4gICAgc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgLnRoZW4gKHNhdmVkQ21kcyk9PlxuICAgIG9yaWduaW5hbE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZnJvbSddKVxuICAgIG5ld05hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwndG8nXSlcbiAgICBpZiBvcmlnbmluYWxOYW1lPyBhbmQgbmV3TmFtZT9cbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG9yaWduaW5hbE5hbWUpXG4gICAgICBpZiBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0/IGFuZCBjbWQ/XG4gICAgICAgIHVubGVzcyBuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAgICAgbmV3TmFtZSA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG9yaWduaW5hbE5hbWUsJycpICsgbmV3TmFtZVxuICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsY21kRGF0YSlcbiAgICAgICAgY21kLnVucmVnaXN0ZXIoKVxuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhXG4gICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgICAudGhlbiA9PlxuICAgICAgICAgIHJldHVybiBcIlwiXG4gICAgICBlbHNlIGlmIGNtZD8gXG4gICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiXG4gICAgICBlbHNlIFxuICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbnJlbW92ZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2NtZCddKVxuICAgIGlmIG5hbWU/XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICAgIHN0b3JhZ2UgPSBDb21tYW5kLnN0b3JhZ2VcbiAgICAgICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAgIC50aGVuIChzYXZlZENtZHMpPT5cbiAgICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQobmFtZSlcbiAgICAgICAgaWYgc2F2ZWRDbWRzW25hbWVdPyBhbmQgY21kP1xuICAgICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbbmFtZV1cbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpXG4gICAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tuYW1lXVxuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgICAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgICAgIC50aGVuID0+XG4gICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBlbHNlIGlmIGNtZD8gXG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCJcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbmFsaWFzQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIGFsaWFzID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2FsaWFzJ10pXG4gIGlmIG5hbWU/IGFuZCBhbGlhcz9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuICAgIGlmIGNtZD9cbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgb3IgY21kXG4gICAgICAjIHVubGVzcyBhbGlhcy5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgICAjIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7IGFsaWFzT2Y6IGNtZC5mdWxsTmFtZSB9KVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIFxuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5cbmxpc3RDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBib3ggPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydib3gnXSx0cnVlKVxuICB1c2VDb250ZXh0ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnY29udGV4dCddLHRydWUpXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICBuYW1lc3BhY2VzID0gaWYgbmFtZSBcbiAgICBbbmFtZV0gXG4gIGVsc2UgXG4gICAgaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCkuZmlsdGVyKChuc3BjKSA9PiBuc3BjICE9IGluc3RhbmNlLmNtZC5mdWxsTmFtZSkuY29uY2F0KFwiX3Jvb3RcIilcblxuICBjb250ZXh0ID0gaWYgdXNlQ29udGV4dFxuICAgIGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KClcbiAgZWxzZVxuICAgIGluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0XG5cbiAgY29tbWFuZHMgPSBuYW1lc3BhY2VzLnJlZHVjZSAoY29tbWFuZHMsIG5zcGMpID0+IFxuICAgICAgY21kID0gaWYgbnNwYyA9PSBcIl9yb290XCIgdGhlbiBDb21tYW5kLmNtZHMgZWxzZSBjb250ZXh0LmdldENtZChuc3BjLG11c3RFeGVjdXRlOmZhbHNlKVxuICAgICAgaWYgY21kP1xuICAgICAgICBjbWQuaW5pdCgpXG4gICAgICAgIGlmIGNtZC5jbWRzXG4gICAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5jb25jYXQoY21kLmNtZHMpXG4gICAgICBjb21tYW5kc1xuICAgICwgW11cblxuICB0ZXh0ID0gaWYgY29tbWFuZHMubGVuZ3RoIFxuICAgIGNvbW1hbmRzLm1hcCgoY21kKT0+IFxuICAgICAgY21kLmluaXQoKVxuICAgICAgKGlmIGNtZC5pc0V4ZWN1dGFibGUoKSB0aGVuICd+fiEnIGVsc2UgJ35+IWxzICcpK2NtZC5mdWxsTmFtZSsnfn4nXG4gICAgKS5qb2luKFwiXFxuXCIpXG4gIGVsc2VcbiAgICBcIlRoaXMgY29udGFpbnMgbm8gc3ViLWNvbW1hbmRzXCJcblxuICBpZiBib3hcbiAgICBcIlwiXCJcbiAgICAgIH5+Ym94fn5cbiAgICAgICN7dGV4dH1cblxuICAgICAgfn4hY2xvc2V8fn5cbiAgICAgIH5+L2JveH5+XG4gICAgICBcIlwiXCJcbiAgZWxzZVxuICAgIHRleHRcbiAgXG5nZXRDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgcmVzID0gUGF0aEhlbHBlci5nZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsbmFtZSlcbiAgaWYgdHlwZW9mIHJlcyA9PSBcIm9iamVjdFwiXG4gICAgSlNPTi5zdHJpbmdpZnkocmVzLG51bGwsJyAgJylcbiAgZWxzZVxuICAgIHJlc1xuXG5zZXRDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwndmFsdWUnLCd2YWwnXSkpP1xuICAgIHBcbiAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgaW5zdGFuY2UuY29udGVudFxuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycyxuYW1lLHZhbClcbiAgJydcblxuc3RvcmVKc29uQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIHZhbCA9IGlmIChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2pzb24nXSkpP1xuICAgIHBcbiAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgaW5zdGFuY2UuY29udGVudFxuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycyxuYW1lLCBKU09OLnBhcnNlKHZhbCkpXG4gICcnXG5cbmdldFBhcmFtID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlP1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcyxpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsJ2RlZmF1bHQnXSkpXG4gIFxuY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAaGVscGVyID0gbmV3IEJveEhlbHBlcihAaW5zdGFuY2UuY29udGV4dClcbiAgICBAY21kID0gQGluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pXG4gICAgaWYgQGNtZD9cbiAgICAgIEBoZWxwZXIub3BlblRleHQgID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAY21kICsgQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIEBoZWxwZXIuY2xvc2VUZXh0ID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZC5zcGxpdChcIiBcIilbMF0gKyBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgIEBoZWxwZXIuZGVjbyA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5kZWNvXG4gICAgQGhlbHBlci5wYWQgPSAyXG4gICAgQGhlbHBlci5wcmVmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgICBAaGVscGVyLnN1ZmZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCcnKVxuICAgIFxuICBoZWlnaHQ6IC0+XG4gICAgaWYgQGJvdW5kcygpP1xuICAgICAgaGVpZ2h0ID0gQGJvdW5kcygpLmhlaWdodFxuICAgIGVsc2VcbiAgICAgIGhlaWdodCA9IDNcbiAgICAgIFxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J11cbiAgICBpZiBAaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEgXG4gICAgICBwYXJhbXMucHVzaCgxKVxuICAgIGVsc2UgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAwXG4gICAgICBwYXJhbXMucHVzaCgwKVxuICAgIHJldHVybiBAaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLGhlaWdodClcbiAgICAgIFxuICB3aWR0aDogLT5cbiAgICBpZiBAYm91bmRzKCk/XG4gICAgICB3aWR0aCA9IEBib3VuZHMoKS53aWR0aFxuICAgIGVsc2VcbiAgICAgIHdpZHRoID0gM1xuICAgICAgXG4gICAgcGFyYW1zID0gWyd3aWR0aCddXG4gICAgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxIFxuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICByZXR1cm4gTWF0aC5tYXgoQG1pbldpZHRoKCksIEBpbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSlcblxuICBcbiAgYm91bmRzOiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgQF9ib3VuZHM/XG4gICAgICAgIEBfYm91bmRzID0gQGhlbHBlci50ZXh0Qm91bmRzKEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcmV0dXJuIEBfYm91bmRzXG4gICAgICBcbiAgcmVzdWx0OiAtPlxuICAgIEBoZWxwZXIuaGVpZ2h0ID0gQGhlaWdodCgpXG4gICAgQGhlbHBlci53aWR0aCA9IEB3aWR0aCgpXG4gICAgcmV0dXJuIEBoZWxwZXIuZHJhdyhAaW5zdGFuY2UuY29udGVudClcbiAgbWluV2lkdGg6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJldHVybiBAY21kLmxlbmd0aFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwXG4gIFxuY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBpbnN0YW5jZS5jb250ZXh0KVxuICBleGVjdXRlOiAtPlxuICAgIHByZWZpeCA9IEBoZWxwZXIucHJlZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gICAgc3VmZml4ID0gQGhlbHBlci5zdWZmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgICBib3ggPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3JlcXVpcmVkX2FmZml4ZXMnXSx0cnVlKVxuICAgIGlmICFyZXF1aXJlZF9hZmZpeGVzXG4gICAgICBAaGVscGVyLnByZWZpeCA9IEBoZWxwZXIuc3VmZml4ID0gJydcbiAgICAgIGJveDIgPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgICBpZiBib3gyPyBhbmQgKCFib3g/IG9yIGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIG9yIGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpXG4gICAgICAgIGJveCA9IGJveDJcbiAgICBpZiBib3g/XG4gICAgICBkZXB0aCA9IEBoZWxwZXIuZ2V0TmVzdGVkTHZsKEBpbnN0YW5jZS5nZXRQb3MoKS5zdGFydClcbiAgICAgIGlmIGRlcHRoIDwgMlxuICAgICAgICBAaW5zdGFuY2UuaW5Cb3ggPSBudWxsXG4gICAgICBAaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LGJveC5lbmQsJycpKVxuICAgIGVsc2VcbiAgICAgIEBpbnN0YW5jZS5yZXBsYWNlV2l0aCgnJylcbiAgICAgICAgICBcbmNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBjbWROYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgICBAdmVyYmFsaXplID0gQGluc3RhbmNlLmdldFBhcmFtKFsxXSkgaW4gWyd2JywndmVyYmFsaXplJ11cbiAgICBpZiBAY21kTmFtZT9cbiAgICAgIEBmaW5kZXIgPSBAaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRGaW5kZXIoQGNtZE5hbWUpIFxuICAgICAgQGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgQGVkaXRhYmxlID0gaWYgQGNtZD8gdGhlbiBAY21kLmlzRWRpdGFibGUoKSBlbHNlIHRydWVcbiAgcmVzdWx0OiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICByZXR1cm4gQHJlc3VsdFdpdGhDb250ZW50KClcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQHJlc3VsdFdpdGhvdXRDb250ZW50KClcbiAgcmVzdWx0V2l0aENvbnRlbnQ6IC0+XG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChAaW5zdGFuY2UuY29udGVudClcbiAgICAgIHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICBkYXRhID0ge31cbiAgICAgIGZvciBwIGluIEVkaXRDbWQucHJvcHNcbiAgICAgICAgcC53cml0ZUZvcihwYXJzZXIsZGF0YSlcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChAY21kTmFtZSwgZGF0YSlcbiAgICAgIHJldHVybiAnJ1xuICBwcm9wc0Rpc3BsYXk6IC0+XG4gICAgICBjbWQgPSBAY21kXG4gICAgICByZXR1cm4gRWRpdENtZC5wcm9wcy5tYXAoIChwKS0+IHAuZGlzcGxheShjbWQpICkuZmlsdGVyKCAocCktPiBwPyApLmpvaW4oXCJcXG5cIilcbiAgcmVzdWx0V2l0aG91dENvbnRlbnQ6IC0+XG4gICAgaWYgIUBjbWQgb3IgQGVkaXRhYmxlXG4gICAgICBuYW1lID0gaWYgQGNtZCB0aGVuIEBjbWQuZnVsbE5hbWUgZWxzZSBAY21kTmFtZVxuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQoXG4gICAgICAgIFwiXCJcIlxuICAgICAgICB+fmJveCBjbWQ6XCIje0BpbnN0YW5jZS5jbWQuZnVsbE5hbWV9ICN7bmFtZX1cIn5+XG4gICAgICAgICN7QHByb3BzRGlzcGxheSgpfVxuICAgICAgICB+fiFzYXZlfn4gfn4hY2xvc2V+flxuICAgICAgICB+fi9ib3h+flxuICAgICAgICBcIlwiXCIpXG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBub1xuICAgICAgcmV0dXJuIGlmIEB2ZXJiYWxpemUgdGhlbiBwYXJzZXIuZ2V0VGV4dCgpIGVsc2UgcGFyc2VyLnBhcnNlQWxsKClcbkVkaXRDbWQuc2V0Q21kcyA9IChiYXNlKSAtPlxuICBpbkluc3RhbmNlID0gYmFzZS5pbl9pbnN0YW5jZSA9IHtjbWRzOnt9fVxuICBmb3IgcCBpbiBFZGl0Q21kLnByb3BzXG4gICAgcC5zZXRDbWQoaW5JbnN0YW5jZS5jbWRzKVxuICAgICMgcC5zZXRDbWQoYmFzZSlcbiAgcmV0dXJuIGJhc2VcbkVkaXRDbWQucHJvcHMgPSBbXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19jYXJyZXQnLCAgICAgICAgIHtvcHQ6J2NoZWNrQ2FycmV0J30pLFxuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fcGFyc2UnLCAgICAgICAgICB7b3B0OidwYXJzZSd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woICAgJ3ByZXZlbnRfcGFyc2VfYWxsJywge29wdDoncHJldmVudFBhcnNlQWxsJ30pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCggICAncmVwbGFjZV9ib3gnLCAgICAgICB7b3B0OidyZXBsYWNlQm94J30pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCAnbmFtZV90b19wYXJhbScsICAgICB7b3B0OiduYW1lVG9QYXJhbSd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZyggJ2FsaWFzX29mJywgICAgICAgICAge3ZhcjonYWxpYXNPZicsIGNhcnJldDp0cnVlfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoICdoZWxwJywgICAgICAgICAgICAgIHtmdW5jdDonaGVscCcsIHNob3dFbXB0eTp0cnVlfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoICdzb3VyY2UnLCAgICAgICAgICAgIHt2YXI6J3Jlc3VsdFN0cicsIGRhdGFOYW1lOidyZXN1bHQnLCBzaG93RW1wdHk6dHJ1ZSwgY2FycmV0OnRydWV9KSxcbl1cbmNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQG5hbWUgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzBdKVxuICByZXN1bHQ6IC0+XG4gICAgaWYgQG5hbWU/XG4gICAgICBAaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQuYWRkTmFtZVNwYWNlKEBuYW1lKVxuICAgICAgcmV0dXJuICcnXG4gICAgZWxzZVxuICAgICAgbmFtZXNwYWNlcyA9IEBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKVxuICAgICAgdHh0ID0gJ35+Ym94fn5cXG4nXG4gICAgICBmb3IgbnNwYyBpbiBuYW1lc3BhY2VzIFxuICAgICAgICBpZiBuc3BjICE9IEBpbnN0YW5jZS5jbWQuZnVsbE5hbWVcbiAgICAgICAgICB0eHQgKz0gbnNwYysnXFxuJ1xuICAgICAgdHh0ICs9ICd+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQodHh0KVxuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpXG5cblxuY2xhc3MgVGVtcGxhdGVDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBuYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gICAgQHNlcCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3NlcCddLFwiXFxuXCIpXG4gIHJlc3VsdDogLT5cbiAgICBkYXRhID0gaWYgQG5hbWUgdGhlbiBQYXRoSGVscGVyLmdldFBhdGgoQGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIEBuYW1lKSBlbHNlIEBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzXG4gICAgaWYgQGluc3RhbmNlLmNvbnRlbnQgYW5kIGRhdGE/IGFuZCBkYXRhICE9IGZhbHNlXG4gICAgICBpZiBBcnJheS5pc0FycmF5KGRhdGEpXG4gICAgICAgIGRhdGEubWFwIChpdGVtKT0+QHJlbmRlclRlbXBsYXRlKGl0ZW0pXG4gICAgICAgICAgLmpvaW4oQHNlcClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlbmRlclRlbXBsYXRlKGRhdGEpXG4gICAgZWxzZVxuICAgICAgJydcbiAgcmVuZGVyVGVtcGxhdGU6IChkYXRhKSAtPlxuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQoQGluc3RhbmNlLmNvbnRlbnQpXG4gICAgICBwYXJzZXIudmFycyA9IGlmIHR5cGVvZiBkYXRhID09IFwib2JqZWN0XCIgdGhlbiBkYXRhIGVsc2Uge3ZhbHVlOmRhdGF9XG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBub1xuICAgICAgcGFyc2VyLnBhcnNlQWxsKClcblxuXG5jbGFzcyBFbW1ldENtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGFiYnIgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2FiYnInLCdhYmJyZXZpYXRpb24nXSlcbiAgICBAbGFuZyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMSwnbGFuZycsJ2xhbmd1YWdlJ10pXG4gIHJlc3VsdDogLT5cbiAgICBlbW1ldCA9IGlmIHdpbmRvdz8uZW1tZXQ/XG4gICAgICB3aW5kb3cuZW1tZXRcbiAgICBlbHNlIGlmIHdpbmRvdz8uc2VsZj8uZW1tZXQ/XG4gICAgICB3aW5kb3cuc2VsZi5lbW1ldFxuICAgIGVsc2UgaWYgd2luZG93Py5nbG9iYWw/LmVtbWV0P1xuICAgICAgd2luZG93Lmdsb2JhbC5lbW1ldFxuICAgIGVsc2UgaWYgcmVxdWlyZT8gXG4gICAgICB0cnkgXG4gICAgICAgIHJlcXVpcmUoJ2VtbWV0JylcbiAgICAgIGNhdGNoIGV4XG4gICAgICAgIEBpbnN0YW5jZS5jb2Rld2F2ZS5sb2dnZXIubG9nKCdFbW1ldCBpcyBub3QgYXZhaWxhYmxlLCBpdCBtYXkgbmVlZCB0byBiZSBpbnN0YWxsZWQgbWFudWFsbHknKVxuICAgICAgICBudWxsXG4gICAgaWYgZW1tZXQ/XG4gICAgICAjIGVtbWV0LnJlcXVpcmUoJy4vcGFyc2VyL2FiYnJldmlhdGlvbicpLmV4cGFuZCgndWw+bGknLCB7cGFzdGVkQ29udGVudDonbG9yZW0nfSlcbiAgICAgIHJlcyA9IGVtbWV0LmV4cGFuZEFiYnJldmlhdGlvbihAYWJiciwgQGxhbmcpXG4gICAgICByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpXG5cblxuXG4iLCJ2YXIgQm94Q21kLCBDbG9zZUNtZCwgRWRpdENtZCwgRW1tZXRDbWQsIE5hbWVTcGFjZUNtZCwgVGVtcGxhdGVDbWQsIGFsaWFzQ29tbWFuZCwgZXhlY19wYXJlbnQsIGdldENvbW1hbmQsIGdldENvbnRlbnQsIGdldFBhcmFtLCBoZWxwLCBsaXN0Q29tbWFuZCwgbm9fZXhlY3V0ZSwgcXVvdGVfY2FycmV0LCByZW1vdmVDb21tYW5kLCByZW5hbWVDb21tYW5kLCBzZXRDb21tYW5kLCBzdG9yZUpzb25Db21tYW5kO1xuXG5pbXBvcnQge1xuICBDb21tYW5kLFxuICBCYXNlQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgTGFuZ0RldGVjdG9yXG59IGZyb20gJy4uL2RldGVjdG9ycy9MYW5nRGV0ZWN0b3InO1xuXG5pbXBvcnQge1xuICBBbHdheXNFbmFibGVkXG59IGZyb20gJy4uL2RldGVjdG9ycy9BbHdheXNFbmFibGVkJztcblxuaW1wb3J0IHtcbiAgQm94SGVscGVyXG59IGZyb20gJy4uL0JveEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIEVkaXRDbWRQcm9wXG59IGZyb20gJy4uL0VkaXRDbWRQcm9wJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgUGF0aEhlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1BhdGhIZWxwZXInO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCB2YXIgQ29yZUNvbW1hbmRQcm92aWRlciA9IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNvcmU7XG4gICAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjb3JlJykpO1xuICAgIGNtZHMuYWRkRGV0ZWN0b3IobmV3IEFsd2F5c0VuYWJsZWQoJ2NvcmUnKSk7XG4gICAgY29yZS5hZGREZXRlY3RvcihuZXcgTGFuZ0RldGVjdG9yKCkpO1xuICAgIHJldHVybiBjb3JlLmFkZENtZHMoe1xuICAgICAgJ2hlbHAnOiB7XG4gICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgJ3Jlc3VsdCc6IGhlbHAsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2NtZCddLFxuICAgICAgICAnaGVscCc6IFwiVG8gZ2V0IGhlbHAgb24gYSBwZWNpZmljIGNvbW1hbmQsIGRvIDpcXG5+fmhlbHAgaGVsbG9+fiAoaGVsbG8gYmVpbmcgdGhlIGNvbW1hbmQpXCIsXG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdvdmVydmlldyc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuICBfX18gICAgICAgICBfICAgX18gICAgICBfX1xcbiAvIF9ffF9fXyAgX198IHxfX1xcXFwgXFxcXCAgICAvIC9fIF9fXyBfX19fX19cXG4vIC9fXy8gXyBcXFxcLyBfYCAvIC1fXFxcXCBcXFxcL1xcXFwvIC8gX2AgXFxcXCBWIC8gLV8vXFxuXFxcXF9fX19cXFxcX19fL1xcXFxfXyxfXFxcXF9fX3xcXFxcXy9cXFxcXy9cXFxcX18sX3xcXFxcXy9cXFxcX19ffFxcblRoZSB0ZXh0IGVkaXRvciBoZWxwZXJcXG5+fi9xdW90ZV9jYXJyZXR+flxcblxcbldoZW4gdXNpbmcgQ29kZXdhdmUgeW91IHdpbGwgYmUgd3JpdGluZyBjb21tYW5kcyB3aXRoaW4gXFxueW91ciB0ZXh0IGVkaXRvci4gVGhlc2UgY29tbWFuZHMgbXVzdCBiZSBwbGFjZWQgYmV0d2VlbiB0d28gXFxucGFpcnMgb2YgXFxcIn5cXFwiICh0aWxkZSkgYW5kIHRoZW4sIHRoZXkgY2FuIGJlIGV4ZWN1dGVkIGJ5IHByZXNzaW5nIFxcblxcXCJjdHJsXFxcIitcXFwic2hpZnRcXFwiK1xcXCJlXFxcIiwgd2l0aCB5b3VyIGN1cnNvciBpbnNpZGUgdGhlIGNvbW1hbmRcXG5FeDogfn4haGVsbG9+flxcblxcbllvdSBkb250IG5lZWQgdG8gYWN0dWFsbHkgdHlwZSBhbnkgXFxcIn5cXFwiICh0aWxkZSkuIFxcblByZXNzaW5nIFxcXCJjdHJsXFxcIitcXFwic2hpZnRcXFwiK1xcXCJlXFxcIiB3aWxsIGFkZCB0aGVtIGlmIHlvdSBhcmUgbm90IGFscmVhZHlcXG53aXRoaW4gYSBjb21tYW5kLlxcblxcbkNvZGV3YXZlIGRvZXMgbm90IHVzZSBVSSB0byBkaXNwbGF5IGFueSBpbmZvcm1hdGlvbi4gXFxuSW5zdGVhZCwgaXQgdXNlcyB0ZXh0IHdpdGhpbiBjb2RlIGNvbW1lbnRzIHRvIG1pbWljIFVJcy4gXFxuVGhlIGdlbmVyYXRlZCBjb21tZW50IGJsb2NrcyB3aWxsIGJlIHJlZmVycmVkIHRvIGFzIHdpbmRvd3MgXFxuaW4gdGhlIGhlbHAgc2VjdGlvbnMuXFxuXFxuVG8gY2xvc2UgdGhpcyB3aW5kb3cgKGkuZS4gcmVtb3ZlIHRoaXMgY29tbWVudCBibG9jayksIHByZXNzIFxcblxcXCJjdHJsXFxcIitcXFwic2hpZnRcXFwiK1xcXCJlXFxcIiB3aXRoIHlvdXIgY3Vyc29yIG9uIHRoZSBsaW5lIGJlbGxvdy5cXG5+fiFjbG9zZXx+flxcblxcblVzZSB0aGUgZm9sbG93aW5nIGNvbW1hbmQgZm9yIGEgd2Fsa3Rocm91Z2ggb2Ygc29tZSBvZiB0aGUgbWFueVxcbmZlYXR1cmVzIG9mIENvZGV3YXZlXFxufn4haGVscDpnZXRfc3RhcnRlZH5+IG9yIH5+IWhlbHA6ZGVtb35+XFxuXFxuTGlzdCBvZiBhbGwgaGVscCBzdWJqZWN0cyBcXG5+fiFoZWxwOnN1YmplY3Rzfn4gb3Igfn4haGVscDpzdWJ+fiBcXG5cXG5+fiFjbG9zZX5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3N1YmplY3RzJzoge1xuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+IWhlbHB+flxcbn5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiAofn4haGVscDpkZW1vfn4pXFxufn4haGVscDpzdWJqZWN0c35+ICh+fiFoZWxwOnN1Yn5+KVxcbn5+IWhlbHA6ZWRpdGluZ35+ICh+fiFoZWxwOmVkaXR+filcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdzdWInOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmhlbHA6c3ViamVjdHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZ2V0X3N0YXJ0ZWQnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxuVGhlIGNsYXNzaWMgSGVsbG8gV29ybGQuXFxufn4haGVsbG98fn5cXG5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxufn5xdW90ZV9jYXJyZXR+flxcblxcbkZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGNyZWF0aW5nIHlvdXIgb3duIGNvbW1hbmRzLCBzZWU6XFxufn4haGVscDplZGl0aW5nfn5cXG5cXG5Db2Rld2F2ZSBjb21lcyB3aXRoIG1hbnkgcHJlLWV4aXN0aW5nIGNvbW1hbmRzLiBIZXJlIGlzIGFuIGV4YW1wbGVcXG5vZiBKYXZhU2NyaXB0IGFiYnJldmlhdGlvbnNcXG5+fiFqczpmfn5cXG5+fiFqczppZn5+XFxuICB+fiFqczpsb2d+flxcXCJ+fiFoZWxsb35+XFxcIn5+IS9qczpsb2d+flxcbn5+IS9qczppZn5+XFxufn4hL2pzOmZ+flxcblxcbkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxcbnVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cXG5+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXFxufn4hZW1tZXQgdWw+bGl+flxcbn5+IWVtbWV0IG0yIGNzc35+XFxuXFxuQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxcbmRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxcbn5+IWpzOmVhY2h+flxcbn5+IXBocDpvdXRlcjplYWNofn5cXG5+fiFwaHA6aW5uZXI6ZWFjaH5+XFxuXFxuU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXFxuZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcXG5hY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxcbmNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cXG5+fiFuYW1lc3BhY2V+flxcbn5+IWNvcmU6bmFtZXNwYWNlfn5cXG5cXG5Zb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxcbn5+IW5hbWVzcGFjZSBwaHB+flxcblxcbkNoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXFxufn4hbmFtZXNwYWNlfn5cXG5cXG5JbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXFxuY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcXG53aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxcblxcbn5+L3F1b3RlX2NhcnJldH5+XFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZGVtbyc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6aGVscDpnZXRfc3RhcnRlZCdcbiAgICAgICAgICB9LFxuICAgICAgICAgICdlZGl0aW5nJzoge1xuICAgICAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgICAgICdpbnRybyc6IHtcbiAgICAgICAgICAgICAgICAncmVzdWx0JzogXCJDb2Rld2F2ZSBhbGxvd3MgeW91IHRvIG1ha2UgeW91ciBvd24gY29tbWFuZHMgKG9yIGFiYnJldmlhdGlvbnMpIFxcbnB1dCB5b3VyIGNvbnRlbnQgaW5zaWRlIFxcXCJzb3VyY2VcXFwiIHRoZSBkbyBcXFwic2F2ZVxcXCIuIFRyeSBhZGRpbmcgYW55IFxcbnRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXFxufn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxcblxcbklmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XFxuZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxcbndoZW5ldmVyIHlvdSB3YW50Llxcbn5+IW15X25ld19jb21tYW5kfn5cIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5cXG5BbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcXFwiYm94XFxcIi4gXFxuVGhleSBhcmUgbWVhbnQgdG8gZGlzcGxheSB0ZXh0IHRoYXQgc2hvdWxkIG5vdCByZW1haW4gaW4geW91ciBjb2RlLiBcXG5UaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXFxuXFxcImNsb3NlXFxcIiBjYW4gYmUgdXNlZCB0byByZW1vdmUgdGhlbSByYXBpZGx5LiBZb3UgY2FuIG1ha2UgeW91ciBvd24gXFxuY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5Llxcbn5+IWJveH5+XFxuVGhlIGJveCB3aWxsIHNjYWxlIHdpdGggdGhlIGNvbnRlbnQgeW91IHB1dCBpbiBpdFxcbn5+IWNsb3NlfH5+XFxufn4hL2JveH5+XFxuXFxufn5xdW90ZV9jYXJyZXR+flxcbldoZW4geW91IGNyZWF0ZSBhIGNvbW1hbmQsIHlvdSBtYXkgd2FudCB0byBzcGVjaWZ5IHdoZXJlIHRoZSBjdXJzb3IgXFxud2lsbCBiZSBsb2NhdGVkIG9uY2UgdGhlIGNvbW1hbmQgaXMgZXhwYW5kZWQuIFRvIGRvIHRoYXQsIHVzZSBhIFxcXCJ8XFxcIiBcXG4oVmVydGljYWwgYmFyKS4gVXNlIDIgb2YgdGhlbSBpZiB5b3Ugd2FudCB0byBwcmludCB0aGUgYWN0dWFsIFxcbmNoYXJhY3Rlci5cXG5+fiFib3h+flxcbm9uZSA6IHwgXFxudHdvIDogfHxcXG5+fiEvYm94fn5cXG5cXG5Zb3UgY2FuIGFsc28gdXNlIHRoZSBcXFwiZXNjYXBlX3BpcGVzXFxcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxcbnZlcnRpY2FsIGJhcnMgdGhhdCBhcmUgYmV0d2VlbiBpdHMgb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzXFxufn4hZXNjYXBlX3BpcGVzfn5cXG58XFxufn4hL2VzY2FwZV9waXBlc35+XFxuXFxuQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cXG5JZiB5b3Ugd2FudCB0byBwcmludCBhIGNvbW1hbmQgd2l0aG91dCBoYXZpbmcgaXQgZXhwYW5kIHdoZW4gXFxudGhlIHBhcmVudCBjb21tYW5kIGlzIGV4cGFuZGVkLCB1c2UgYSBcXFwiIVxcXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxcbn5+ISFoZWxsb35+XFxuXFxuRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXFxudGhlIFxcXCJjb250ZW50XFxcIiBjb21tYW5kLiBcXFwiY29udGVudFxcXCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XFxudGhhdCBpcyBiZXR3ZWVuIHRoZSB0YWdzLiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgaG93IGl0IGNhbiBiZSB1c2VkLlxcbn5+IWVkaXQgcGhwOmlubmVyOmlmfn5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2VkaXQnOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmhlbHA6ZWRpdGluZydcbiAgICAgICAgICB9LFxuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ25vX2V4ZWN1dGUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBub19leGVjdXRlLFxuICAgICAgICAnaGVscCc6IFwiUHJldmVudCBldmVyeXRoaW5nIGluc2lkZSB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIGZyb20gZXhlY3V0aW5nXCJcbiAgICAgIH0sXG4gICAgICAnZXNjYXBlX3BpcGVzJzoge1xuICAgICAgICAncmVzdWx0JzogcXVvdGVfY2FycmV0LFxuICAgICAgICAnY2hlY2tDYXJyZXQnOiBmYWxzZSxcbiAgICAgICAgJ2hlbHAnOiBcIkVzY2FwZSBhbGwgY2FycmV0cyAoZnJvbSBcXFwifFxcXCIgdG8gXFxcInx8XFxcIilcIlxuICAgICAgfSxcbiAgICAgICdxdW90ZV9jYXJyZXQnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXNjYXBlX3BpcGVzJ1xuICAgICAgfSxcbiAgICAgICdleGVjX3BhcmVudCc6IHtcbiAgICAgICAgJ2V4ZWN1dGUnOiBleGVjX3BhcmVudCxcbiAgICAgICAgJ2hlbHAnOiBcIkV4ZWN1dGUgdGhlIGZpcnN0IGNvbW1hbmQgdGhhdCB3cmFwIHRoaXMgaW4gaXQncyBvcGVuIGFuZCBjbG9zZSB0YWdcIlxuICAgICAgfSxcbiAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAncmVzdWx0JzogZ2V0Q29udGVudCxcbiAgICAgICAgJ2hlbHAnOiBcIk1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gd2hhdCB3YXMgYmV0d2VlbiB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIG9mIGEgY29tbWFuZFwiXG4gICAgICB9LFxuICAgICAgJ2JveCc6IHtcbiAgICAgICAgJ2Nscyc6IEJveENtZCxcbiAgICAgICAgJ2hlbHAnOiBcIkNyZWF0ZSB0aGUgYXBwYXJlbmNlIG9mIGEgYm94IGNvbXBvc2VkIGZyb20gY2hhcmFjdGVycy4gXFxuVXN1YWxseSB3cmFwcGVkIGluIGEgY29tbWVudC5cXG5cXG5UaGUgYm94IHdpbGwgdHJ5IHRvIGFqdXN0IGl0J3Mgc2l6ZSBmcm9tIHRoZSBjb250ZW50XCJcbiAgICAgIH0sXG4gICAgICAnY2xvc2UnOiB7XG4gICAgICAgICdjbHMnOiBDbG9zZUNtZCxcbiAgICAgICAgJ2hlbHAnOiBcIldpbGwgY2xvc2UgdGhlIGZpcnN0IGJveCBhcm91bmQgdGhpc1wiXG4gICAgICB9LFxuICAgICAgJ3BhcmFtJzoge1xuICAgICAgICAncmVzdWx0JzogZ2V0UGFyYW0sXG4gICAgICAgICdoZWxwJzogXCJNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIGEgcGFyYW1ldGVyIGZyb20gdGhpcyBjb21tYW5kIGNhbGxcXG5cXG5Zb3UgY2FuIHBhc3MgYSBudW1iZXIsIGEgc3RyaW5nLCBvciBib3RoLiBcXG5BIG51bWJlciBmb3IgYSBwb3NpdGlvbmVkIGFyZ3VtZW50IGFuZCBhIHN0cmluZ1xcbmZvciBhIG5hbWVkIHBhcmFtZXRlclwiXG4gICAgICB9LFxuICAgICAgJ2VkaXQnOiB7XG4gICAgICAgICdjbWRzJzogRWRpdENtZC5zZXRDbWRzKHtcbiAgICAgICAgICAnc2F2ZSc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXhlY19wYXJlbnQnXG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgJ2Nscyc6IEVkaXRDbWQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2NtZCddLFxuICAgICAgICAnaGVscCc6IFwiQWxsb3dzIHRvIGVkaXQgYSBjb21tYW5kLiBcXG5TZWUgfn4haGVscDplZGl0aW5nfn4gZm9yIGEgcXVpY2sgdHV0b3JpYWxcIlxuICAgICAgfSxcbiAgICAgICdyZW5hbWUnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfYXBwbGljYWJsZSc6IFwifn5ib3h+flxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCIsXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiByZW5hbWVDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydmcm9tJywgJ3RvJ10sXG4gICAgICAgICdoZWxwJzogXCJBbGxvd3MgdG8gcmVuYW1lIGEgY29tbWFuZCBhbmQgY2hhbmdlIGl0J3MgbmFtZXNwYWNlLiBcXG5Zb3UgY2FuIG9ubHkgcmVuYW1lIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxuLSBUaGUgZmlyc3QgcGFyYW0gaXMgdGhlIG9sZCBuYW1lXFxuLSBUaGVuIHNlY29uZCBwYXJhbSBpcyB0aGUgbmV3IG5hbWUsIGlmIGl0IGhhcyBubyBuYW1lc3BhY2UsXFxuICBpdCB3aWxsIHVzZSB0aGUgb25lIGZyb20gdGhlIG9yaWdpbmFsIGNvbW1hbmQuXFxuXFxuZXguOiB+fiFyZW5hbWUgbXlfY29tbWFuZCBteV9jb21tYW5kMn5+XCJcbiAgICAgIH0sXG4gICAgICAncmVtb3ZlJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnbm90X2FwcGxpY2FibGUnOiBcIn5+Ym94fn5cXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiLFxuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogcmVtb3ZlQ29tbWFuZCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJBbGxvd3MgdG8gcmVtb3ZlIGEgY29tbWFuZC4gXFxuWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlwiXG4gICAgICB9LFxuICAgICAgJ2FsaWFzJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IGFsaWFzQ29tbWFuZCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZVxuICAgICAgfSxcbiAgICAgICduYW1lc3BhY2UnOiB7XG4gICAgICAgICdjbHMnOiBOYW1lU3BhY2VDbWQsXG4gICAgICAgICdoZWxwJzogXCJTaG93IHRoZSBjdXJyZW50IG5hbWVzcGFjZXMuXFxuXFxuQSBuYW1lIHNwYWNlIGNvdWxkIGJlIHRoZSBuYW1lIG9mIHRoZSBsYW5ndWFnZVxcbm9yIG90aGVyIGtpbmQgb2YgY29udGV4dHNcXG5cXG5JZiB5b3UgcGFzcyBhIHBhcmFtIHRvIHRoaXMgY29tbWFuZCwgaXQgd2lsbCBcXG5hZGQgdGhlIHBhcmFtIGFzIGEgbmFtZXNwYWNlIGZvciB0aGUgY3VycmVudCBlZGl0b3JcIlxuICAgICAgfSxcbiAgICAgICduc3BjJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOm5hbWVzcGFjZSdcbiAgICAgIH0sXG4gICAgICAnbGlzdCc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGxpc3RDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ2JveCcsICdjb250ZXh0J10sXG4gICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2hlbHAnOiBcIkxpc3QgYXZhaWxhYmxlIGNvbW1hbmRzXFxuXFxuWW91IGNhbiB1c2UgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGNob29zZSBhIHNwZWNpZmljIG5hbWVzcGFjZSwgXFxuYnkgZGVmYXVsdCBhbGwgY3VyZW50IG5hbWVzcGFjZSB3aWxsIGJlIHNob3duXCJcbiAgICAgIH0sXG4gICAgICAnbHMnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6bGlzdCdcbiAgICAgIH0sXG4gICAgICAnZ2V0Jzoge1xuICAgICAgICAncmVzdWx0JzogZ2V0Q29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZSddLFxuICAgICAgICAnaGVscCc6IFwib3V0cHV0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXCJcbiAgICAgIH0sXG4gICAgICAnc2V0Jzoge1xuICAgICAgICAncmVzdWx0Jzogc2V0Q29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZScsICd2YWx1ZScsICd2YWwnXSxcbiAgICAgICAgJ2hlbHAnOiBcInNldCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZVwiXG4gICAgICB9LFxuICAgICAgJ3N0b3JlX2pzb24nOiB7XG4gICAgICAgICdyZXN1bHQnOiBzdG9yZUpzb25Db21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ2pzb24nXSxcbiAgICAgICAgJ2hlbHAnOiBcInNldCBhIHZhcmlhYmxlIHdpdGggc29tZSBqc29uIGRhdGFcIlxuICAgICAgfSxcbiAgICAgICdqc29uJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOnN0b3JlX2pzb24nXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlJzoge1xuICAgICAgICAnY2xzJzogVGVtcGxhdGVDbWQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnc2VwJ10sXG4gICAgICAgICdoZWxwJzogXCJyZW5kZXIgYSB0ZW1wbGF0ZSBmb3IgYSB2YXJpYWJsZVxcblxcbklmIHRoZSBmaXJzdCBwYXJhbSBpcyBub3Qgc2V0IGl0IHdpbGwgdXNlIGFsbCB2YXJpYWJsZXMgXFxuZm9yIHRoZSByZW5kZXJcXG5JZiB0aGUgdmFyaWFibGUgaXMgYW4gYXJyYXkgdGhlIHRlbXBsYXRlIHdpbGwgYmUgcmVwZWF0ZWQgXFxuZm9yIGVhY2ggaXRlbXNcXG5UaGUgYHNlcGAgcGFyYW0gZGVmaW5lIHdoYXQgd2lsbCBzZXBhcmF0ZSBlYWNoIGl0ZW0gXFxuYW5kIGRlZmF1bHQgdG8gYSBsaW5lIGJyZWFrXCJcbiAgICAgIH0sXG4gICAgICAnZW1tZXQnOiB7XG4gICAgICAgICdjbHMnOiBFbW1ldENtZCxcbiAgICAgICAgJ2hlbHAnOiBcIkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy5cXG5cXG5QYXNzIHRoZSBFbW1ldCBhYmJyZXZpYXRpb24gYXMgYSBwYXJhbSB0byBleHBlbmQgaXQuXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuXG5oZWxwID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGNtZCwgY21kTmFtZSwgaGVscENtZCwgc3ViY29tbWFuZHMsIHRleHQ7XG4gIGNtZE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKTtcbiAgaWYgKGNtZE5hbWUgIT0gbnVsbCkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKGNtZE5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaGVscENtZCA9IGNtZC5nZXRDbWQoJ2hlbHAnKTtcbiAgICAgIHRleHQgPSBoZWxwQ21kID8gYH5+JHtoZWxwQ21kLmZ1bGxOYW1lfX5+YCA6IFwiVGhpcyBjb21tYW5kIGhhcyBubyBoZWxwIHRleHRcIjtcbiAgICAgIHN1YmNvbW1hbmRzID0gY21kLmNtZHMubGVuZ3RoID8gYFxcblN1Yi1Db21tYW5kcyA6XFxufn5scyAke2NtZC5mdWxsTmFtZX0gYm94Om5vIGNvbnRleHQ6bm9+fmAgOiBcIlwiO1xuICAgICAgcmV0dXJuIGB+fmJveH5+XFxuSGVscCBmb3Igfn4hJHtjbWQuZnVsbE5hbWV9fn4gOlxcblxcbiR7dGV4dH1cXG4ke3N1YmNvbW1hbmRzfVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiAnfn5oZWxwOm92ZXJ2aWV3fn4nO1xuICB9XG59O1xuXG5ub19leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIHJlZztcbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSk7XG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsICckMScpO1xufTtcblxucXVvdGVfY2FycmV0ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgcmV0dXJuIGluc3RhbmNlLmNvbnRlbnQucmVwbGFjZSgvXFx8L2csICd8fCcpO1xufTtcblxuZXhlY19wYXJlbnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgcmVzO1xuICBpZiAoaW5zdGFuY2UucGFyZW50ICE9IG51bGwpIHtcbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpO1xuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnQ7XG4gICAgaW5zdGFuY2UucmVwbGFjZUVuZCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlRW5kO1xuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbmdldENvbnRlbnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgYWZmaXhlc19lbXB0eSwgcHJlZml4LCBzdWZmaXg7XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSwgZmFsc2UpO1xuICBwcmVmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gIHN1ZmZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBwcmVmaXggKyAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5jb250ZW50IHx8ICcnKSArIHN1ZmZpeDtcbiAgfVxuICBpZiAoYWZmaXhlc19lbXB0eSkge1xuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXg7XG4gIH1cbn07XG5cbnJlbmFtZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIHN0b3JhZ2U7XG4gICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICByZXR1cm4gc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gIH0pLnRoZW4oKHNhdmVkQ21kcykgPT4ge1xuICAgIHZhciBjbWQsIGNtZERhdGEsIG5ld05hbWUsIG9yaWduaW5hbE5hbWU7XG4gICAgb3JpZ25pbmFsTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZnJvbSddKTtcbiAgICBuZXdOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd0byddKTtcbiAgICBpZiAoKG9yaWduaW5hbE5hbWUgIT0gbnVsbCkgJiYgKG5ld05hbWUgIT0gbnVsbCkpIHtcbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG9yaWduaW5hbE5hbWUpO1xuICAgICAgaWYgKChzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0gIT0gbnVsbCkgJiYgKGNtZCAhPSBudWxsKSkge1xuICAgICAgICBpZiAoIShuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xKSkge1xuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCAnJykgKyBuZXdOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV07XG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsIGNtZERhdGEpO1xuICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhO1xuICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbnJlbW92ZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIG5hbWU7XG4gICAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcywgc3RvcmFnZTtcbiAgICAgICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbigoc2F2ZWRDbWRzKSA9PiB7XG4gICAgICAgIHZhciBjbWQsIGNtZERhdGE7XG4gICAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG5hbWUpO1xuICAgICAgICBpZiAoKHNhdmVkQ21kc1tuYW1lXSAhPSBudWxsKSAmJiAoY21kICE9IG51bGwpKSB7XG4gICAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tuYW1lXTtcbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV07XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFsaWFzQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnYWxpYXMnXSk7XG4gIGlmICgobmFtZSAhPSBudWxsKSAmJiAoYWxpYXMgIT0gbnVsbCkpIHtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgfHwgY21kO1xuICAgICAgLy8gdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAvLyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChhbGlhcywge1xuICAgICAgICBhbGlhc09mOiBjbWQuZnVsbE5hbWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH1cbn07XG5cbmxpc3RDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGJveCwgY29tbWFuZHMsIGNvbnRleHQsIG5hbWUsIG5hbWVzcGFjZXMsIHRleHQsIHVzZUNvbnRleHQ7XG4gIGJveCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2JveCddLCB0cnVlKTtcbiAgdXNlQ29udGV4dCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2NvbnRleHQnXSwgdHJ1ZSk7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIG5hbWVzcGFjZXMgPSBuYW1lID8gW25hbWVdIDogaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCkuZmlsdGVyKChuc3BjKSA9PiB7XG4gICAgcmV0dXJuIG5zcGMgIT09IGluc3RhbmNlLmNtZC5mdWxsTmFtZTtcbiAgfSkuY29uY2F0KFwiX3Jvb3RcIik7XG4gIGNvbnRleHQgPSB1c2VDb250ZXh0ID8gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKSA6IGluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0O1xuICBjb21tYW5kcyA9IG5hbWVzcGFjZXMucmVkdWNlKChjb21tYW5kcywgbnNwYykgPT4ge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gbnNwYyA9PT0gXCJfcm9vdFwiID8gQ29tbWFuZC5jbWRzIDogY29udGV4dC5nZXRDbWQobnNwYywge1xuICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlXG4gICAgfSk7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5jbWRzKSB7XG4gICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGNtZC5jbWRzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbW1hbmRzO1xuICB9LCBbXSk7XG4gIHRleHQgPSBjb21tYW5kcy5sZW5ndGggPyBjb21tYW5kcy5tYXAoKGNtZCkgPT4ge1xuICAgIGNtZC5pbml0KCk7XG4gICAgcmV0dXJuIChjbWQuaXNFeGVjdXRhYmxlKCkgPyAnfn4hJyA6ICd+fiFscyAnKSArIGNtZC5mdWxsTmFtZSArICd+fic7XG4gIH0pLmpvaW4oXCJcXG5cIikgOiBcIlRoaXMgY29udGFpbnMgbm8gc3ViLWNvbW1hbmRzXCI7XG4gIGlmIChib3gpIHtcbiAgICByZXR1cm4gYH5+Ym94fn5cXG4ke3RleHR9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbn07XG5cbmdldENvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgbmFtZSwgcmVzO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICByZXMgPSBQYXRoSGVscGVyLmdldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSk7XG4gIGlmICh0eXBlb2YgcmVzID09PSBcIm9iamVjdFwiKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlcywgbnVsbCwgJyAgJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufTtcblxuc2V0Q29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWw7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd2YWx1ZScsICd2YWwnXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lLCB2YWwpO1xuICByZXR1cm4gJyc7XG59O1xuXG5zdG9yZUpzb25Db21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHAsIHZhbDtcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2pzb24nXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lLCBKU09OLnBhcnNlKHZhbCkpO1xuICByZXR1cm4gJyc7XG59O1xuXG5nZXRQYXJhbSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGlmIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5nZXRQYXJhbShpbnN0YW5jZS5wYXJhbXMsIGluc3RhbmNlLmdldFBhcmFtKFsnZGVmJywgJ2RlZmF1bHQnXSkpO1xuICB9XG59O1xuXG5Cb3hDbWQgPSBjbGFzcyBCb3hDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5oZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuaW5zdGFuY2UuY29udGV4dCk7XG4gICAgdGhpcy5jbWQgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmhlbHBlci5vcGVuVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY21kICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgdGhpcy5oZWxwZXIuY2xvc2VUZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZC5zcGxpdChcIiBcIilbMF0gKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgfVxuICAgIHRoaXMuaGVscGVyLmRlY28gPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmRlY287XG4gICAgdGhpcy5oZWxwZXIucGFkID0gMjtcbiAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuc3VmZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG4gIH1cblxuICBoZWlnaHQoKSB7XG4gICAgdmFyIGhlaWdodCwgcGFyYW1zO1xuICAgIGlmICh0aGlzLmJvdW5kcygpICE9IG51bGwpIHtcbiAgICAgIGhlaWdodCA9IHRoaXMuYm91bmRzKCkuaGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWlnaHQgPSAzO1xuICAgIH1cbiAgICBwYXJhbXMgPSBbJ2hlaWdodCddO1xuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgxKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIGhlaWdodCk7XG4gIH1cblxuICB3aWR0aCgpIHtcbiAgICB2YXIgcGFyYW1zLCB3aWR0aDtcbiAgICBpZiAodGhpcy5ib3VuZHMoKSAhPSBudWxsKSB7XG4gICAgICB3aWR0aCA9IHRoaXMuYm91bmRzKCkud2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpZHRoID0gMztcbiAgICB9XG4gICAgcGFyYW1zID0gWyd3aWR0aCddO1xuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgwKTtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgubWF4KHRoaXMubWluV2lkdGgoKSwgdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSk7XG4gIH1cblxuICBib3VuZHMoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgaWYgKHRoaXMuX2JvdW5kcyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2JvdW5kcyA9IHRoaXMuaGVscGVyLnRleHRCb3VuZHModGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9ib3VuZHM7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHRoaXMuaGVscGVyLmhlaWdodCA9IHRoaXMuaGVpZ2h0KCk7XG4gICAgdGhpcy5oZWxwZXIud2lkdGggPSB0aGlzLndpZHRoKCk7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVyLmRyYXcodGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgfVxuXG4gIG1pbldpZHRoKCkge1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbWQubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxufTtcblxuQ2xvc2VDbWQgPSBjbGFzcyBDbG9zZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuaW5zdGFuY2UuY29udGV4dCk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHZhciBib3gsIGJveDIsIGRlcHRoLCBwcmVmaXgsIHJlcXVpcmVkX2FmZml4ZXMsIHN1ZmZpeDtcbiAgICBwcmVmaXggPSB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgICBzdWZmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgICBib3ggPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSk7XG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydyZXF1aXJlZF9hZmZpeGVzJ10sIHRydWUpO1xuICAgIGlmICghcmVxdWlyZWRfYWZmaXhlcykge1xuICAgICAgdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5oZWxwZXIuc3VmZml4ID0gJyc7XG4gICAgICBib3gyID0gdGhpcy5oZWxwZXIuZ2V0Qm94Rm9yUG9zKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkpO1xuICAgICAgaWYgKChib3gyICE9IG51bGwpICYmICgoYm94ID09IG51bGwpIHx8IGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIHx8IGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpKSB7XG4gICAgICAgIGJveCA9IGJveDI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChib3ggIT0gbnVsbCkge1xuICAgICAgZGVwdGggPSB0aGlzLmhlbHBlci5nZXROZXN0ZWRMdmwodGhpcy5pbnN0YW5jZS5nZXRQb3MoKS5zdGFydCk7XG4gICAgICBpZiAoZGVwdGggPCAyKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UuaW5Cb3ggPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LCBib3guZW5kLCAnJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5yZXBsYWNlV2l0aCgnJyk7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWQgPSBjbGFzcyBFZGl0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHZhciByZWY7XG4gICAgdGhpcy5jbWROYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKTtcbiAgICB0aGlzLnZlcmJhbGl6ZSA9IChyZWYgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxXSkpID09PSAndicgfHwgcmVmID09PSAndmVyYmFsaXplJztcbiAgICBpZiAodGhpcy5jbWROYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpO1xuICAgICAgdGhpcy5maW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2U7XG4gICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZWRpdGFibGUgPSB0aGlzLmNtZCAhPSBudWxsID8gdGhpcy5jbWQuaXNFZGl0YWJsZSgpIDogdHJ1ZTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRoQ29udGVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRob3V0Q29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdFdpdGhDb250ZW50KCkge1xuICAgIHZhciBkYXRhLCBpLCBsZW4sIHAsIHBhcnNlciwgcmVmO1xuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgIHBhcnNlci5wYXJzZUFsbCgpO1xuICAgIGRhdGEgPSB7fTtcbiAgICByZWYgPSBFZGl0Q21kLnByb3BzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgcCA9IHJlZltpXTtcbiAgICAgIHAud3JpdGVGb3IocGFyc2VyLCBkYXRhKTtcbiAgICB9XG4gICAgQ29tbWFuZC5zYXZlQ21kKHRoaXMuY21kTmFtZSwgZGF0YSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcHJvcHNEaXNwbGF5KCkge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gdGhpcy5jbWQ7XG4gICAgcmV0dXJuIEVkaXRDbWQucHJvcHMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBwLmRpc3BsYXkoY21kKTtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHAgIT0gbnVsbDtcbiAgICB9KS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmVzdWx0V2l0aG91dENvbnRlbnQoKSB7XG4gICAgdmFyIG5hbWUsIHBhcnNlcjtcbiAgICBpZiAoIXRoaXMuY21kIHx8IHRoaXMuZWRpdGFibGUpIHtcbiAgICAgIG5hbWUgPSB0aGlzLmNtZCA/IHRoaXMuY21kLmZ1bGxOYW1lIDogdGhpcy5jbWROYW1lO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KGB+fmJveCBjbWQ6XCIke3RoaXMuaW5zdGFuY2UuY21kLmZ1bGxOYW1lfSAke25hbWV9XCJ+flxcbiR7dGhpcy5wcm9wc0Rpc3BsYXkoKX1cXG5+fiFzYXZlfn4gfn4hY2xvc2V+flxcbn5+L2JveH5+YCk7XG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLnZlcmJhbGl6ZSkge1xuICAgICAgICByZXR1cm4gcGFyc2VyLmdldFRleHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZC5zZXRDbWRzID0gZnVuY3Rpb24oYmFzZSkge1xuICB2YXIgaSwgaW5JbnN0YW5jZSwgbGVuLCBwLCByZWY7XG4gIGluSW5zdGFuY2UgPSBiYXNlLmluX2luc3RhbmNlID0ge1xuICAgIGNtZHM6IHt9XG4gIH07XG4gIHJlZiA9IEVkaXRDbWQucHJvcHM7XG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHAgPSByZWZbaV07XG4gICAgcC5zZXRDbWQoaW5JbnN0YW5jZS5jbWRzKTtcbiAgfVxuICAvLyBwLnNldENtZChiYXNlKVxuICByZXR1cm4gYmFzZTtcbn07XG5cbkVkaXRDbWQucHJvcHMgPSBbXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19jYXJyZXQnLFxuICB7XG4gICAgb3B0OiAnY2hlY2tDYXJyZXQnXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fcGFyc2UnLFxuICB7XG4gICAgb3B0OiAncGFyc2UnXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCgncHJldmVudF9wYXJzZV9hbGwnLFxuICB7XG4gICAgb3B0OiAncHJldmVudFBhcnNlQWxsJ1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3JlcGxhY2VfYm94JyxcbiAge1xuICAgIG9wdDogJ3JlcGxhY2VCb3gnXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCduYW1lX3RvX3BhcmFtJyxcbiAge1xuICAgIG9wdDogJ25hbWVUb1BhcmFtJ1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnYWxpYXNfb2YnLFxuICB7XG4gICAgdmFyOiAnYWxpYXNPZicsXG4gICAgY2FycmV0OiB0cnVlXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCdoZWxwJyxcbiAge1xuICAgIGZ1bmN0OiAnaGVscCcsXG4gICAgc2hvd0VtcHR5OiB0cnVlXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCdzb3VyY2UnLFxuICB7XG4gICAgdmFyOiAncmVzdWx0U3RyJyxcbiAgICBkYXRhTmFtZTogJ3Jlc3VsdCcsXG4gICAgc2hvd0VtcHR5OiB0cnVlLFxuICAgIGNhcnJldDogdHJ1ZVxuICB9KVxuXTtcblxuTmFtZVNwYWNlQ21kID0gY2xhc3MgTmFtZVNwYWNlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHJldHVybiB0aGlzLm5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswXSk7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdmFyIGksIGxlbiwgbmFtZXNwYWNlcywgbnNwYywgcGFyc2VyLCB0eHQ7XG4gICAgaWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0LmFkZE5hbWVTcGFjZSh0aGlzLm5hbWUpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VzID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKTtcbiAgICAgIHR4dCA9ICd+fmJveH5+XFxuJztcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IG5hbWVzcGFjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbnNwYyA9IG5hbWVzcGFjZXNbaV07XG4gICAgICAgIGlmIChuc3BjICE9PSB0aGlzLmluc3RhbmNlLmNtZC5mdWxsTmFtZSkge1xuICAgICAgICAgIHR4dCArPSBuc3BjICsgJ1xcbic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHR4dCArPSAnfn4hY2xvc2V8fn5cXG5+fi9ib3h+fic7XG4gICAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodHh0KTtcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICB9XG4gIH1cblxufTtcblxuVGVtcGxhdGVDbWQgPSBjbGFzcyBUZW1wbGF0ZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgICByZXR1cm4gdGhpcy5zZXAgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc2VwJ10sIFwiXFxuXCIpO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBkYXRhO1xuICAgIGRhdGEgPSB0aGlzLm5hbWUgPyBQYXRoSGVscGVyLmdldFBhdGgodGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCB0aGlzLm5hbWUpIDogdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzO1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQgJiYgKGRhdGEgIT0gbnVsbCkgJiYgZGF0YSAhPT0gZmFsc2UpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBkYXRhLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclRlbXBsYXRlKGl0ZW0pO1xuICAgICAgICB9KS5qb2luKHRoaXMuc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclRlbXBsYXRlKGRhdGEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVGVtcGxhdGUoZGF0YSkge1xuICAgIHZhciBwYXJzZXI7XG4gICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgcGFyc2VyLnZhcnMgPSB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiA/IGRhdGEgOiB7XG4gICAgICB2YWx1ZTogZGF0YVxuICAgIH07XG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG4gICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpO1xuICB9XG5cbn07XG5cbkVtbWV0Q21kID0gY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5hYmJyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2FiYnInLCAnYWJicmV2aWF0aW9uJ10pO1xuICAgIHJldHVybiB0aGlzLmxhbmcgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxLCAnbGFuZycsICdsYW5ndWFnZSddKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgZW1tZXQsIGV4LCByZXM7XG4gICAgZW1tZXQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IHdpbmRvdy5lbW1ldCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmID0gd2luZG93LnNlbGYpICE9IG51bGwgPyByZWYuZW1tZXQgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZWxmLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmMSA9IHdpbmRvdy5nbG9iYWwpICE9IG51bGwgPyByZWYxLmVtbWV0IDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2xvYmFsLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiByZXF1aXJlICE9PSBudWxsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJ2VtbWV0Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmxvZ2dlci5sb2coJ0VtbWV0IGlzIG5vdCBhdmFpbGFibGUsIGl0IG1heSBuZWVkIHRvIGJlIGluc3RhbGxlZCBtYW51YWxseScpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkuY2FsbCh0aGlzKTtcbiAgICBpZiAoZW1tZXQgIT0gbnVsbCkge1xuICAgICAgLy8gZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKHRoaXMuYWJiciwgdGhpcy5sYW5nKTtcbiAgICAgIHJldHVybiByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kLCBCYXNlQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi4vQm94SGVscGVyJztcbmltcG9ydCB7IEVkaXRDbWRQcm9wIH0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGF0aEhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvUGF0aEhlbHBlcic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIEZpbGVDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnZmlsZScpKVxuICBcbiAgY29yZS5hZGRDbWRzKHtcbiAgICBcInJlYWRcIjoge1xuICAgICAgJ3Jlc3VsdCcgOiByZWFkQ29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydmaWxlJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHJlYWQgdGhlIGNvbnRlbnQgb2YgYSBmaWxlXG4gICAgICAgIFwiXCJcIlxuICAgIH1cbiAgICBcIndyaXRlXCI6IHtcbiAgICAgICdyZXN1bHQnIDogd3JpdGVDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2ZpbGUnLCdjb250ZW50J11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHNhdmUgaW50byBhIGZpbGVcbiAgICAgICAgXCJcIlwiXG4gICAgfVxuICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICdyZXN1bHQnIDogZGVsZXRlQ29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydmaWxlJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIGRlbGV0ZSBhIGZpbGVcbiAgICAgICAgXCJcIlwiXG4gICAgfVxuICB9KVxuXG5yZWFkQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKVxuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2ZpbGUnXSlcbiAgaWYgZmlsZVN5c3RlbVxuICAgIGZpbGVTeXN0ZW0ucmVhZEZpbGUoZmlsZSlcblxud3JpdGVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZmlsZSddKVxuICBjb250ZW50ID0gaW5zdGFuY2UuY29udGVudCBvciBpbnN0YW5jZS5nZXRQYXJhbShbMSwnY29udGVudCddKVxuICBpZiBmaWxlU3lzdGVtXG4gICAgZmlsZVN5c3RlbS53cml0ZUZpbGUoZmlsZSxjb250ZW50KVxuICAgICAgXG5kZWxldGVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZmlsZSddKVxuICBpZiBmaWxlU3lzdGVtXG4gICAgZmlsZVN5c3RlbS5kZWxldGVGaWxlKGZpbGUpIiwidmFyIGRlbGV0ZUNvbW1hbmQsIHJlYWRDb21tYW5kLCB3cml0ZUNvbW1hbmQ7XG5cbmltcG9ydCB7XG4gIENvbW1hbmQsXG4gIEJhc2VDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBCb3hIZWxwZXJcbn0gZnJvbSAnLi4vQm94SGVscGVyJztcblxuaW1wb3J0IHtcbiAgRWRpdENtZFByb3Bcbn0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYXRoSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvUGF0aEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IHZhciBGaWxlQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgRmlsZUNvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgY29yZTtcbiAgICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2ZpbGUnKSk7XG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICBcInJlYWRcIjoge1xuICAgICAgICAncmVzdWx0JzogcmVhZENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2ZpbGUnXSxcbiAgICAgICAgJ2hlbHAnOiBcInJlYWQgdGhlIGNvbnRlbnQgb2YgYSBmaWxlXCJcbiAgICAgIH0sXG4gICAgICBcIndyaXRlXCI6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHdyaXRlQ29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnZmlsZScsICdjb250ZW50J10sXG4gICAgICAgICdoZWxwJzogXCJzYXZlIGludG8gYSBmaWxlXCJcbiAgICAgIH0sXG4gICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICdyZXN1bHQnOiBkZWxldGVDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydmaWxlJ10sXG4gICAgICAgICdoZWxwJzogXCJkZWxldGUgYSBmaWxlXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuXG5yZWFkQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtO1xuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpO1xuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pO1xuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLnJlYWRGaWxlKGZpbGUpO1xuICB9XG59O1xuXG53cml0ZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgY29udGVudCwgZmlsZSwgZmlsZVN5c3RlbTtcbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKTtcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKTtcbiAgY29udGVudCA9IGluc3RhbmNlLmNvbnRlbnQgfHwgaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdjb250ZW50J10pO1xuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLndyaXRlRmlsZShmaWxlLCBjb250ZW50KTtcbiAgfVxufTtcblxuZGVsZXRlQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtO1xuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpO1xuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pO1xuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLmRlbGV0ZUZpbGUoZmlsZSk7XG4gIH1cbn07XG4iLCJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEh0bWxDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGh0bWwgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnaHRtbCcpKVxuICBodG1sLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6ZW1tZXQnLFxuICAgICAgJ2RlZmF1bHRzJyA6IHsnbGFuZyc6J2h0bWwnfSxcbiAgICAgICduYW1lVG9QYXJhbScgOiAnYWJicidcbiAgICB9LFxuICB9KVxuICBcbiAgY3NzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NzcycpKVxuICBjc3MuYWRkQ21kcyh7XG4gICAgJ2ZhbGxiYWNrJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTplbW1ldCcsXG4gICAgICAnZGVmYXVsdHMnIDogeydsYW5nJzonY3NzJ30sXG4gICAgICAnbmFtZVRvUGFyYW0nIDogJ2FiYnInXG4gICAgfSxcbiAgfSlcblxuIiwiaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBIdG1sQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSHRtbENvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgY3NzLCBodG1sO1xuICAgIGh0bWwgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnaHRtbCcpKTtcbiAgICBodG1sLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmVtbWV0JyxcbiAgICAgICAgJ2RlZmF1bHRzJzoge1xuICAgICAgICAgICdsYW5nJzogJ2h0bWwnXG4gICAgICAgIH0sXG4gICAgICAgICduYW1lVG9QYXJhbSc6ICdhYmJyJ1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNzcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjc3MnKSk7XG4gICAgcmV0dXJuIGNzcy5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplbW1ldCcsXG4gICAgICAgICdkZWZhdWx0cyc6IHtcbiAgICAgICAgICAnbGFuZyc6ICdjc3MnXG4gICAgICAgIH0sXG4gICAgICAgICduYW1lVG9QYXJhbSc6ICdhYmJyJ1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEpzQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBqcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqcycpKVxuICBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnamF2YXNjcmlwdCcseyBhbGlhc09mOiAnanMnIH0pKVxuICBqcy5hZGRDbWRzKHtcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgJ2lmJzogICdpZih8KXtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdsb2cnOiAgJ2lmKHdpbmRvdy5jb25zb2xlKXtcXG5cXHRjb25zb2xlLmxvZyh+fmNvbnRlbnR+fnwpXFxufScsXG4gICAgJ2Z1bmN0aW9uJzpcdCdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2Z1bmN0Jzp7IGFsaWFzT2Y6ICdqczpmdW5jdGlvbicgfSxcbiAgICAnZic6eyAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJyB9LFxuICAgICdmb3InOiBcdFx0J2ZvciAodmFyIGkgPSAwOyBpIDwgfDsgaSsrKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnZm9yaW4nOidmb3IgKHZhciB2YWwgaW4gfCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2VhY2gnOnsgIGFsaWFzT2Y6ICdqczpmb3JpbicgfSxcbiAgICAnZm9yZWFjaCc6eyAgYWxpYXNPZjogJ2pzOmZvcmluJyB9LFxuICAgICd3aGlsZSc6ICAnd2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ3doaWxlaSc6ICd2YXIgaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxuXFx0aSsrO1xcbn0nLFxuICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICdpZmUnOnsgICBhbGlhc09mOiAnanM6aWZlbHNlJyB9LFxuICAgICdzd2l0Y2gnOlx0XCJcIlwiXG4gICAgICBzd2l0Y2goIHwgKSB7IFxuICAgICAgXFx0Y2FzZSA6XG4gICAgICBcXHRcXHR+fmNvbnRlbnR+flxuICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICBcXHRkZWZhdWx0IDpcbiAgICAgIFxcdFxcdFxuICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICB9XG4gICAgICBcIlwiXCIsXG4gIH0pXG4iLCJpbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIEpzQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSnNDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGpzO1xuICAgIGpzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2pzJykpO1xuICAgIGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqYXZhc2NyaXB0Jywge1xuICAgICAgYWxpYXNPZjogJ2pzJ1xuICAgIH0pKTtcbiAgICByZXR1cm4ganMuYWRkQ21kcyh7XG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICAnaWYnOiAnaWYofCl7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdsb2cnOiAnaWYod2luZG93LmNvbnNvbGUpe1xcblxcdGNvbnNvbGUubG9nKH5+Y29udGVudH5+fClcXG59JyxcbiAgICAgICdmdW5jdGlvbic6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZnVuY3QnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZic6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmb3InOiAnZm9yICh2YXIgaSA9IDA7IGkgPCB8OyBpKyspIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2ZvcmluJzogJ2ZvciAodmFyIHZhbCBpbiB8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgJ2ZvcmVhY2gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmb3JpbidcbiAgICAgIH0sXG4gICAgICAnd2hpbGUnOiAnd2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnd2hpbGVpJzogJ3ZhciBpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG5cXHRpKys7XFxufScsXG4gICAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+Y29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAgICdpZmUnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczppZmVsc2UnXG4gICAgICB9LFxuICAgICAgJ3N3aXRjaCc6IFwic3dpdGNoKCB8ICkgeyBcXG5cXHRjYXNlIDpcXG5cXHRcXHR+fmNvbnRlbnR+flxcblxcdFxcdGJyZWFrO1xcblxcdGRlZmF1bHQgOlxcblxcdFxcdFxcblxcdFxcdGJyZWFrO1xcbn1cIlxuICAgIH0pO1xuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcbmltcG9ydCB7IFBhaXJEZXRlY3RvciB9IGZyb20gJy4uL2RldGVjdG9ycy9QYWlyRGV0ZWN0b3InO1xuXG5leHBvcnQgY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpXG4gIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICByZXN1bHQ6ICdwaHA6aW5uZXInLFxuICAgIG9wZW5lcjogJzw/cGhwJyxcbiAgICBjbG9zZXI6ICc/PicsXG4gICAgb3B0aW9ubmFsX2VuZDogdHJ1ZSxcbiAgICAnZWxzZSc6ICdwaHA6b3V0ZXInXG4gIH0pKSBcblxuICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpXG4gIHBocE91dGVyLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnYW55X2NvbnRlbnQnOiB7IFxuICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnIFxuICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBwcmVmaXg6ICcgPz5cXG4nXG4gICAgICAgICAgICBzdWZmaXg6ICdcXG48P3BocCAnXG4gICAgICAgICAgICBhZmZpeGVzX2VtcHR5OiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjolbmFtZSUnLFxuICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgfSxcbiAgICAnYm94JzogeyBcbiAgICAgIGFsaWFzT2Y6ICdjb3JlOmJveCcgXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBwcmVmaXg6ICc8P3BocFxcbidcbiAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICB9XG4gICAgfSxcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgcGhwOiAnPD9waHBcXG5cXHR+fmNvbnRlbnR+fnxcXG4/PicsXG4gIH0pXG4gIFxuICBwaHBJbm5lciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ2lubmVyJykpXG4gIHBocElubmVyLmFkZENtZHMoe1xuICAgICdhbnlfY29udGVudCc6IHsgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcgfSxcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgJ2lmJzogICAnaWYofCl7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ2luZm8nOiAncGhwaW5mbygpOycsXG4gICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAnZSc6eyAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZWNobycgfSxcbiAgICAnY2xhc3MnOntcbiAgICAgIHJlc3VsdCA6IFwiXCJcIlxuICAgICAgICBjbGFzcyB+fnBhcmFtIDAgY2xhc3MgZGVmOnx+fiB7XG4gICAgICAgIFxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xuICAgICAgICBcXHRcXHR+fmNvbnRlbnR+fnxcbiAgICAgICAgXFx0fVxuICAgICAgICB9XG4gICAgICAgIFwiXCJcIixcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdjJzp7ICAgICBhbGlhc09mOiAncGhwOmlubmVyOmNsYXNzJyB9LFxuICAgICdmdW5jdGlvbic6XHR7XG4gICAgICByZXN1bHQgOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAnZnVuY3QnOnsgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbicgfSxcbiAgICAnZic6eyAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbicgfSxcbiAgICAnYXJyYXknOiAgJyR8ID0gYXJyYXkoKTsnLFxuICAgICdhJzpcdCAgICAnYXJyYXkoKScsXG4gICAgJ2Zvcic6IFx0XHQnZm9yICgkaSA9IDA7ICRpIDwgJHw7ICRpKyspIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnZm9yZWFjaCc6J2ZvcmVhY2ggKCR8IGFzICRrZXkgPT4gJHZhbCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICdlYWNoJzp7ICBhbGlhc09mOiAncGhwOmlubmVyOmZvcmVhY2gnIH0sXG4gICAgJ3doaWxlJzogICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ3doaWxlaSc6IHtcbiAgICAgIHJlc3VsdCA6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgJ2lmZSc6eyAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6aWZlbHNlJyB9LFxuICAgICdzd2l0Y2gnOlx0e1xuICAgICAgcmVzdWx0IDogXCJcIlwiXG4gICAgICAgIHN3aXRjaCggfCApIHsgXG4gICAgICAgIFxcdGNhc2UgOlxuICAgICAgICBcXHRcXHR+fmFueV9jb250ZW50fn5cbiAgICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICAgIFxcdGRlZmF1bHQgOlxuICAgICAgICBcXHRcXHRcbiAgICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiLFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICAnY2xvc2UnOiB7IFxuICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnIFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nXG4gICAgICAgIHN1ZmZpeDogJ1xcbj8+J1xuICAgICAgICByZXF1aXJlZF9hZmZpeGVzOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gIH0pXG4gIFxuXG53cmFwV2l0aFBocCA9IChyZXN1bHQsaW5zdGFuY2UpIC0+XG4gIGlubGluZSA9IGluc3RhbmNlLmdldFBhcmFtKFsncGhwX2lubGluZScsJ2lubGluZSddLHRydWUpXG4gIGlmIGlubGluZVxuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nXG4gICAgcmVnQ2xvc2UgPSAvKFtcXG5cXHJcXHNdKylcXHNcXD8+L2dcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nXG4gIGVsc2VcbiAgICAnPD9waHBcXG4nICsgU3RyaW5nSGVscGVyLmluZGVudChyZXN1bHQpICsgJ1xcbj8+J1xuXG4jIGNsb3NlUGhwRm9yQ29udGVudCA9IChpbnN0YW5jZSkgLT5cbiMgICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnIiwidmFyIHdyYXBXaXRoUGhwO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBQYWlyRGV0ZWN0b3Jcbn0gZnJvbSAnLi4vZGV0ZWN0b3JzL1BhaXJEZXRlY3Rvcic7XG5cbmV4cG9ydCB2YXIgUGhwQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBwaHAsIHBocElubmVyLCBwaHBPdXRlcjtcbiAgICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpO1xuICAgIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgICBvcGVuZXI6ICc8P3BocCcsXG4gICAgICBjbG9zZXI6ICc/PicsXG4gICAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICAgJ2Vsc2UnOiAncGhwOm91dGVyJ1xuICAgIH0pKTtcbiAgICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpO1xuICAgIHBocE91dGVyLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnYW55X2NvbnRlbnQnOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50JyxcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbicsXG4gICAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICcsXG4gICAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6JW5hbWUlJyxcbiAgICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgICB9LFxuICAgICAgJ2JveCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+J1xuICAgIH0pO1xuICAgIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSk7XG4gICAgcmV0dXJuIHBocElubmVyLmFkZENtZHMoe1xuICAgICAgJ2FueV9jb250ZW50Jzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50J1xuICAgICAgfSxcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgICdpZic6ICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdpbmZvJzogJ3BocGluZm8oKTsnLFxuICAgICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAgICdlJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmVjaG8nXG4gICAgICB9LFxuICAgICAgJ2NsYXNzJzoge1xuICAgICAgICByZXN1bHQ6IFwiY2xhc3Mgfn5wYXJhbSAwIGNsYXNzIGRlZjp8fn4ge1xcblxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xcblxcdFxcdH5+Y29udGVudH5+fFxcblxcdH1cXG59XCIsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2MnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnXG4gICAgICB9LFxuICAgICAgJ2Z1bmN0aW9uJzoge1xuICAgICAgICByZXN1bHQ6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdhcnJheSc6ICckfCA9IGFycmF5KCk7JyxcbiAgICAgICdhJzogJ2FycmF5KCknLFxuICAgICAgJ2Zvcic6ICdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2ZvcmVhY2gnOiAnZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmb3JlYWNoJ1xuICAgICAgfSxcbiAgICAgICd3aGlsZSc6ICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnd2hpbGVpJzoge1xuICAgICAgICByZXN1bHQ6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgJ2lmZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnXG4gICAgICB9LFxuICAgICAgJ3N3aXRjaCc6IHtcbiAgICAgICAgcmVzdWx0OiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5hbnlfY29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufVwiLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PicsXG4gICAgICAgICAgcmVxdWlyZWRfYWZmaXhlczogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbndyYXBXaXRoUGhwID0gZnVuY3Rpb24ocmVzdWx0LCBpbnN0YW5jZSkge1xuICB2YXIgaW5saW5lLCByZWdDbG9zZSwgcmVnT3BlbjtcbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywgJ2lubGluZSddLCB0cnVlKTtcbiAgaWYgKGlubGluZSkge1xuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nO1xuICAgIHJlZ0Nsb3NlID0gLyhbXFxuXFxyXFxzXSspXFxzXFw/Pi9nO1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/Pic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nO1xuICB9XG59O1xuXG4vLyBjbG9zZVBocEZvckNvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4vLyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICdcbiIsIlxuaW1wb3J0IHsgQ29tbWFuZCwgQmFzZUNvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcbmltcG9ydCB7IEFsd2F5c0VuYWJsZWQgfSBmcm9tICcuLi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZCc7XG5pbXBvcnQgKiBhcyBpbmZsZWN0aW9uIGZyb20gJ2luZmxlY3Rpb24nO1xuXG5leHBvcnQgY2xhc3MgU3RyaW5nQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChyb290KS0+IFxuICBjbWRzID0gcm9vdC5hZGRDbWQobmV3IENvbW1hbmQoJ3N0cmluZycpKVxuXG4gIHJvb3QuYWRkQ21kKG5ldyBDb21tYW5kKCdzdHInLHsgYWxpYXNPZjogJ3N0cmluZycgfSkpXG4gIHJvb3QuYWRkRGV0ZWN0b3IobmV3IEFsd2F5c0VuYWJsZWQoJ3N0cmluZycpKVxuICBcbiAgY21kcy5hZGRDbWRzKHtcbiAgICAncGx1cmFsaXplJzp7XG4gICAgICAncmVzdWx0JyA6IChpbnN0YW5jZSkgLT4gaW5mbGVjdGlvbi5wbHVyYWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ3N0ciddKSlcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnc3RyJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIFBsdXJhbGl6ZSBhIHN0cmluZ1xuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdzaW5ndWxhcml6ZSc6e1xuICAgICAgJ3Jlc3VsdCcgOiAoaW5zdGFuY2UpIC0+IGluZmxlY3Rpb24uc2luZ3VsYXJpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ3N0ciddKSlcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnc3RyJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIFNpbmd1bGFyaXplIGEgc3RyaW5nXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2NhbWVsaXplJzp7XG4gICAgICAncmVzdWx0JyA6IChpbnN0YW5jZSkgLT4gaW5mbGVjdGlvbi5jYW1lbGl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwnc3RyJ10pLCFpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsJ2ZpcnN0J10sdHJ1ZSkpXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ3N0cicsJ2ZpcnN0J11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIFRyYW5zZm9ybXMgYSBTdHJpbmcgZnJvbSB1bmRlcnNjb3JlIHRvIGNhbWVsY2FzZVxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICd1bmRlcnNjb3JlJzp7XG4gICAgICAncmVzdWx0JyA6IChpbnN0YW5jZSkgLT4gaW5mbGVjdGlvbi51bmRlcnNjb3JlKGluc3RhbmNlLmdldFBhcmFtKFswLCdzdHInXSksaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsxLCd1cHBlciddKSlcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnc3RyJywndXBwZXInXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgVHJhbnNmb3JtcyBhIFN0cmluZyBmcm9tIGNhbWVsY2FzZSB0byB1bmRlcnNjb3JlLlxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdodW1hbml6ZSc6e1xuICAgICAgJ3Jlc3VsdCcgOiAoaW5zdGFuY2UpIC0+IGluZmxlY3Rpb24uaHVtYW5pemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ3N0ciddKSxpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsJ2ZpcnN0J10pKVxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydzdHInLCdmaXJzdCddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgaHVtYW4gcmVhZGFibGUgZm9ybWF0XG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2NhcGl0YWxpemUnOntcbiAgICAgICdyZXN1bHQnIDogKGluc3RhbmNlKSAtPiBpbmZsZWN0aW9uLmNhcGl0YWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ3N0ciddKSlcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnc3RyJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIE1ha2UgdGhlIGZpcnN0IGxldHRlciBvZiBhIHN0cmluZyB1cHBlclxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdkYXNoZXJpemUnOntcbiAgICAgICdyZXN1bHQnIDogKGluc3RhbmNlKSAtPiBpbmZsZWN0aW9uLmRhc2hlcml6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwnc3RyJ10pKVxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydzdHInXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgUmVwbGFjZXMgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMgaW4gYSBzdHJpbmcuXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3RpdGxlaXplJzp7XG4gICAgICAncmVzdWx0JyA6IChpbnN0YW5jZSkgLT4gaW5mbGVjdGlvbi50aXRsZWl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwnc3RyJ10pKVxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydzdHInXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIGh1bWFuIHJlYWRhYmxlIGZvcm1hdCB3aXRoIG1vc3Qgd29yZHMgY2FwaXRhbGl6ZWRcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAndGFibGVpemUnOntcbiAgICAgICdyZXN1bHQnIDogKGluc3RhbmNlKSAtPiBpbmZsZWN0aW9uLnRhYmxlaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCdzdHInXSkpXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ3N0ciddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgdGFibGUgZm9ybWF0XG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2NsYXNzaWZ5Jzp7XG4gICAgICAncmVzdWx0JyA6IChpbnN0YW5jZSkgLT4gaW5mbGVjdGlvbi5jbGFzc2lmeShpbnN0YW5jZS5nZXRQYXJhbShbMCwnc3RyJ10pKVxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydzdHInXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIGNsYXNzIGZvcm1hdFxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICB9KVxuICAiLCJpbXBvcnQge1xuICBDb21tYW5kLFxuICBCYXNlQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgQWx3YXlzRW5hYmxlZFxufSBmcm9tICcuLi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZCc7XG5cbmltcG9ydCAqIGFzIGluZmxlY3Rpb24gZnJvbSAnaW5mbGVjdGlvbic7XG5cbmV4cG9ydCB2YXIgU3RyaW5nQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgU3RyaW5nQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIocm9vdCkge1xuICAgIHZhciBjbWRzO1xuICAgIGNtZHMgPSByb290LmFkZENtZChuZXcgQ29tbWFuZCgnc3RyaW5nJykpO1xuICAgIHJvb3QuYWRkQ21kKG5ldyBDb21tYW5kKCdzdHInLCB7XG4gICAgICBhbGlhc09mOiAnc3RyaW5nJ1xuICAgIH0pKTtcbiAgICByb290LmFkZERldGVjdG9yKG5ldyBBbHdheXNFbmFibGVkKCdzdHJpbmcnKSk7XG4gICAgcmV0dXJuIGNtZHMuYWRkQ21kcyh7XG4gICAgICAncGx1cmFsaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5wbHVyYWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlBsdXJhbGl6ZSBhIHN0cmluZ1wiXG4gICAgICB9LFxuICAgICAgJ3Npbmd1bGFyaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5zaW5ndWxhcml6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0ciddLFxuICAgICAgICAnaGVscCc6IFwiU2luZ3VsYXJpemUgYSBzdHJpbmdcIlxuICAgICAgfSxcbiAgICAgICdjYW1lbGl6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2FtZWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSksICFpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsICdmaXJzdCddLCB0cnVlKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0cicsICdmaXJzdCddLFxuICAgICAgICAnaGVscCc6IFwiVHJhbnNmb3JtcyBhIFN0cmluZyBmcm9tIHVuZGVyc2NvcmUgdG8gY2FtZWxjYXNlXCJcbiAgICAgIH0sXG4gICAgICAndW5kZXJzY29yZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24udW5kZXJzY29yZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSwgaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsxLCAndXBwZXInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInLCAndXBwZXInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRyYW5zZm9ybXMgYSBTdHJpbmcgZnJvbSBjYW1lbGNhc2UgdG8gdW5kZXJzY29yZS5cIlxuICAgICAgfSxcbiAgICAgICdodW1hbml6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uaHVtYW5pemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSksIGluc3RhbmNlLmdldEJvb2xQYXJhbShbMSwgJ2ZpcnN0J10pKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnc3RyJywgJ2ZpcnN0J10sXG4gICAgICAgICdoZWxwJzogXCJUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgaHVtYW4gcmVhZGFibGUgZm9ybWF0XCJcbiAgICAgIH0sXG4gICAgICAnY2FwaXRhbGl6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2FwaXRhbGl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0ciddLFxuICAgICAgICAnaGVscCc6IFwiTWFrZSB0aGUgZmlyc3QgbGV0dGVyIG9mIGEgc3RyaW5nIHVwcGVyXCJcbiAgICAgIH0sXG4gICAgICAnZGFzaGVyaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5kYXNoZXJpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlJlcGxhY2VzIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzIGluIGEgc3RyaW5nLlwiXG4gICAgICB9LFxuICAgICAgJ3RpdGxlaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi50aXRsZWl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0ciddLFxuICAgICAgICAnaGVscCc6IFwiVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIGh1bWFuIHJlYWRhYmxlIGZvcm1hdCB3aXRoIG1vc3Qgd29yZHMgY2FwaXRhbGl6ZWRcIlxuICAgICAgfSxcbiAgICAgICd0YWJsZWl6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24udGFibGVpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSB0YWJsZSBmb3JtYXRcIlxuICAgICAgfSxcbiAgICAgICdjbGFzc2lmeSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2xhc3NpZnkoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSBjbGFzcyBmb3JtYXRcIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBEZXRlY3RvciB9IGZyb20gJy4vRGV0ZWN0b3InO1xuXG5leHBvcnQgY2xhc3MgQWx3YXlzRW5hYmxlZCBleHRlbmRzIERldGVjdG9yXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWVzcGFjZSkgLT5cbiAgICBzdXBlcigpXG4gIGRldGVjdDogKGZpbmRlcikgLT5cbiAgICByZXR1cm4gQG5hbWVzcGFjZSIsImltcG9ydCB7XG4gIERldGVjdG9yXG59IGZyb20gJy4vRGV0ZWN0b3InO1xuXG5leHBvcnQgdmFyIEFsd2F5c0VuYWJsZWQgPSBjbGFzcyBBbHdheXNFbmFibGVkIGV4dGVuZHMgRGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvcihuYW1lc3BhY2UpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICB9XG5cbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZTtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIERldGVjdG9yXG4gIGNvbnN0cnVjdG9yOiAoQGRhdGE9e30pIC0+XG4gIGRldGVjdDogKGZpbmRlcikgLT5cbiAgICBpZiBAZGV0ZWN0ZWQoZmluZGVyKVxuICAgICAgcmV0dXJuIEBkYXRhLnJlc3VsdCBpZiBAZGF0YS5yZXN1bHQ/XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBkYXRhLmVsc2UgaWYgQGRhdGEuZWxzZT9cbiAgZGV0ZWN0ZWQ6IChmaW5kZXIpIC0+XG4gICAgI1xuIiwiZXhwb3J0IHZhciBEZXRlY3RvciA9IGNsYXNzIERldGVjdG9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSA9IHt9KSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGRldGVjdChmaW5kZXIpIHtcbiAgICBpZiAodGhpcy5kZXRlY3RlZChmaW5kZXIpKSB7XG4gICAgICBpZiAodGhpcy5kYXRhLnJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucmVzdWx0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5kYXRhLmVsc2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmVsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGV0ZWN0ZWQoZmluZGVyKSB7fVxuXG59O1xuXG5cbiIsImltcG9ydCB7IERldGVjdG9yIH0gZnJvbSAnLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCBjbGFzcyBMYW5nRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvclxuICBkZXRlY3Q6IChmaW5kZXIpIC0+XG4gICAgaWYgZmluZGVyLmNvZGV3YXZlPyBcbiAgICAgIGxhbmcgPSBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLmdldExhbmcoKVxuICAgICAgaWYgbGFuZz8gXG4gICAgICAgIHJldHVybiBsYW5nLnRvTG93ZXJDYXNlKCkiLCJpbXBvcnQge1xuICBEZXRlY3RvclxufSBmcm9tICcuL0RldGVjdG9yJztcblxuZXhwb3J0IHZhciBMYW5nRGV0ZWN0b3IgPSBjbGFzcyBMYW5nRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdChmaW5kZXIpIHtcbiAgICB2YXIgbGFuZztcbiAgICBpZiAoZmluZGVyLmNvZGV3YXZlICE9IG51bGwpIHtcbiAgICAgIGxhbmcgPSBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLmdldExhbmcoKTtcbiAgICAgIGlmIChsYW5nICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBhaXIgfSBmcm9tICcuLi9wb3NpdGlvbmluZy9QYWlyJztcbmltcG9ydCB7IERldGVjdG9yIH0gZnJvbSAnLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvclxuICBkZXRlY3RlZDogKGZpbmRlcikgLT5cbiAgICBpZiBAZGF0YS5vcGVuZXI/IGFuZCBAZGF0YS5jbG9zZXI/IGFuZCBmaW5kZXIuaW5zdGFuY2U/XG4gICAgICBwYWlyID0gbmV3IFBhaXIoQGRhdGEub3BlbmVyLCBAZGF0YS5jbG9zZXIsIEBkYXRhKVxuICAgICAgaWYgcGFpci5pc1dhcHBlck9mKGZpbmRlci5pbnN0YW5jZS5nZXRQb3MoKSwgZmluZGVyLmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gICAgICAiLCJpbXBvcnQge1xuICBQYWlyXG59IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5pbXBvcnQge1xuICBEZXRlY3RvclxufSBmcm9tICcuL0RldGVjdG9yJztcblxuZXhwb3J0IHZhciBQYWlyRGV0ZWN0b3IgPSBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdGVkKGZpbmRlcikge1xuICAgIHZhciBwYWlyO1xuICAgIGlmICgodGhpcy5kYXRhLm9wZW5lciAhPSBudWxsKSAmJiAodGhpcy5kYXRhLmNsb3NlciAhPSBudWxsKSAmJiAoZmluZGVyLmluc3RhbmNlICE9IG51bGwpKSB7XG4gICAgICBwYWlyID0gbmV3IFBhaXIodGhpcy5kYXRhLm9wZW5lciwgdGhpcy5kYXRhLmNsb3NlciwgdGhpcy5kYXRhKTtcbiAgICAgIGlmIChwYWlyLmlzV2FwcGVyT2YoZmluZGVyLmluc3RhbmNlLmdldFBvcygpLCBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLnRleHQoKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL2Jvb3RzdHJhcCc7XG5pbXBvcnQgeyBUZXh0QXJlYUVkaXRvciB9IGZyb20gJy4vVGV4dEFyZWFFZGl0b3InO1xuXG5Db2Rld2F2ZS5kZXRlY3QgPSAodGFyZ2V0KSAtPlxuICBjdyA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dEFyZWFFZGl0b3IodGFyZ2V0KSlcbiAgQ29kZXdhdmUuaW5zdGFuY2VzLnB1c2goY3cpXG4gIGN3XG5cbkNvZGV3YXZlLnJlcXVpcmUgPSByZXF1aXJlXG5cbndpbmRvdy5Db2Rld2F2ZSA9IENvZGV3YXZlXG5cbiAgIiwiaW1wb3J0IHtcbiAgQ29kZXdhdmVcbn0gZnJvbSAnLi9ib290c3RyYXAnO1xuXG5pbXBvcnQge1xuICBUZXh0QXJlYUVkaXRvclxufSBmcm9tICcuL1RleHRBcmVhRWRpdG9yJztcblxuQ29kZXdhdmUuZGV0ZWN0ID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gIHZhciBjdztcbiAgY3cgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRBcmVhRWRpdG9yKHRhcmdldCkpO1xuICBDb2Rld2F2ZS5pbnN0YW5jZXMucHVzaChjdyk7XG4gIHJldHVybiBjdztcbn07XG5cbkNvZGV3YXZlLnJlcXVpcmUgPSByZXF1aXJlO1xuXG53aW5kb3cuQ29kZXdhdmUgPSBDb2Rld2F2ZTtcbiIsImV4cG9ydCBjbGFzcyBBcnJheUhlbHBlclxuICBAaXNBcnJheTogKGFycikgLT5cbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCBhcnIgKSA9PSAnW29iamVjdCBBcnJheV0nXG4gIFxuICBAdW5pb246IChhMSxhMikgLT5cbiAgICBAdW5pcXVlKGExLmNvbmNhdChhMikpXG4gICAgXG4gIEB1bmlxdWU6IChhcnJheSkgLT5cbiAgICBhID0gYXJyYXkuY29uY2F0KClcbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCBhLmxlbmd0aFxuICAgICAgaiA9IGkgKyAxXG4gICAgICB3aGlsZSBqIDwgYS5sZW5ndGhcbiAgICAgICAgaWYgYVtpXSA9PSBhW2pdXG4gICAgICAgICAgYS5zcGxpY2Uoai0tLCAxKVxuICAgICAgICArK2pcbiAgICAgICsraVxuICAgIGEiLCJleHBvcnQgdmFyIEFycmF5SGVscGVyID0gY2xhc3MgQXJyYXlIZWxwZXIge1xuICBzdGF0aWMgaXNBcnJheShhcnIpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH1cblxuICBzdGF0aWMgdW5pb24oYTEsIGEyKSB7XG4gICAgcmV0dXJuIHRoaXMudW5pcXVlKGExLmNvbmNhdChhMikpO1xuICB9XG5cbiAgc3RhdGljIHVuaXF1ZShhcnJheSkge1xuICAgIHZhciBhLCBpLCBqO1xuICAgIGEgPSBhcnJheS5jb25jYXQoKTtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IGEubGVuZ3RoKSB7XG4gICAgICBqID0gaSArIDE7XG4gICAgICB3aGlsZSAoaiA8IGEubGVuZ3RoKSB7XG4gICAgICAgIGlmIChhW2ldID09PSBhW2pdKSB7XG4gICAgICAgICAgYS5zcGxpY2Uoai0tLCAxKTtcbiAgICAgICAgfVxuICAgICAgICArK2o7XG4gICAgICB9XG4gICAgICArK2k7XG4gICAgfVxuICAgIHJldHVybiBhO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgQ29tbW9uSGVscGVyXG5cbiAgQG1lcmdlOiAoeHMuLi4pIC0+XG4gICAgaWYgeHM/Lmxlbmd0aCA+IDBcbiAgICAgIEB0YXAge30sIChtKSAtPiBtW2tdID0gdiBmb3IgaywgdiBvZiB4IGZvciB4IGluIHhzXG4gXG4gIEB0YXA6IChvLCBmbikgLT4gXG4gICAgZm4obylcbiAgICBvXG5cbiAgQGFwcGx5TWl4aW5zOiAoZGVyaXZlZEN0b3IsIGJhc2VDdG9ycykgLT4gXG4gICAgYmFzZUN0b3JzLmZvckVhY2ggKGJhc2VDdG9yKSA9PiBcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2VDdG9yLnByb3RvdHlwZSkuZm9yRWFjaCAobmFtZSk9PiBcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVyaXZlZEN0b3IsIG5hbWUsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZUN0b3IucHJvdG90eXBlLCBuYW1lKSkiLCJleHBvcnQgdmFyIENvbW1vbkhlbHBlciA9IGNsYXNzIENvbW1vbkhlbHBlciB7XG4gIHN0YXRpYyBtZXJnZSguLi54cykge1xuICAgIGlmICgoeHMgIT0gbnVsbCA/IHhzLmxlbmd0aCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy50YXAoe30sIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgdmFyIGksIGssIGxlbiwgcmVzdWx0cywgdiwgeDtcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB4cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHggPSB4c1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMxO1xuICAgICAgICAgICAgcmVzdWx0czEgPSBbXTtcbiAgICAgICAgICAgIGZvciAoayBpbiB4KSB7XG4gICAgICAgICAgICAgIHYgPSB4W2tdO1xuICAgICAgICAgICAgICByZXN1bHRzMS5wdXNoKG1ba10gPSB2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzMTtcbiAgICAgICAgICB9KSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB0YXAobywgZm4pIHtcbiAgICBmbihvKTtcbiAgICByZXR1cm4gbztcbiAgfVxuXG4gIHN0YXRpYyBhcHBseU1peGlucyhkZXJpdmVkQ3RvciwgYmFzZUN0b3JzKSB7XG4gICAgcmV0dXJuIGJhc2VDdG9ycy5mb3JFYWNoKChiYXNlQ3RvcikgPT4ge1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2VDdG9yLnByb3RvdHlwZSkuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLCBuYW1lLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2VDdG9yLnByb3RvdHlwZSwgbmFtZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxufTtcbiIsIlxuZXhwb3J0IGNsYXNzIE5hbWVzcGFjZUhlbHBlclxuXG4gIEBzcGxpdEZpcnN0OiAoZnVsbG5hbWUsaXNTcGFjZSA9IGZhbHNlKSAtPlxuICAgIGlmIGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09IC0xIGFuZCAhaXNTcGFjZVxuICAgICAgcmV0dXJuIFtudWxsLGZ1bGxuYW1lXVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIHJldHVybiBbcGFydHMuc2hpZnQoKSxwYXJ0cy5qb2luKCc6JykgfHwgbnVsbF1cblxuICBAc3BsaXQ6IChmdWxsbmFtZSkgLT5cbiAgICBpZiBmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PSAtMVxuICAgICAgcmV0dXJuIFtudWxsLGZ1bGxuYW1lXVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIG5hbWUgPSBwYXJ0cy5wb3AoKVxuICAgIFtwYXJ0cy5qb2luKCc6JyksbmFtZV0iLCJleHBvcnQgdmFyIE5hbWVzcGFjZUhlbHBlciA9IGNsYXNzIE5hbWVzcGFjZUhlbHBlciB7XG4gIHN0YXRpYyBzcGxpdEZpcnN0KGZ1bGxuYW1lLCBpc1NwYWNlID0gZmFsc2UpIHtcbiAgICB2YXIgcGFydHM7XG4gICAgaWYgKGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09PSAtMSAmJiAhaXNTcGFjZSkge1xuICAgICAgcmV0dXJuIFtudWxsLCBmdWxsbmFtZV07XG4gICAgfVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKTtcbiAgICByZXR1cm4gW3BhcnRzLnNoaWZ0KCksIHBhcnRzLmpvaW4oJzonKSB8fCBudWxsXTtcbiAgfVxuXG4gIHN0YXRpYyBzcGxpdChmdWxsbmFtZSkge1xuICAgIHZhciBuYW1lLCBwYXJ0cztcbiAgICBpZiAoZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT09IC0xKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXTtcbiAgICB9XG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpO1xuICAgIG5hbWUgPSBwYXJ0cy5wb3AoKTtcbiAgICByZXR1cm4gW3BhcnRzLmpvaW4oJzonKSwgbmFtZV07XG4gIH1cblxufTtcbiIsIlxuZXhwb3J0IGNsYXNzIE9wdGlvbmFsUHJvbWlzZVxuICAgIGNvbnN0cnVjdG9yOiAoQHZhbCkgLT5cbiAgICAgICAgaWYgQHZhbD8gYW5kIEB2YWwudGhlbj8gYW5kIEB2YWwucmVzdWx0P1xuICAgICAgICAgICAgQHZhbCA9IEB2YWwucmVzdWx0KClcbiAgICB0aGVuOiAoY2IpIC0+XG4gICAgICAgIGlmIEB2YWw/IGFuZCBAdmFsLnRoZW4/XG4gICAgICAgICAgICBuZXcgT3B0aW9uYWxQcm9taXNlKEB2YWwudGhlbihjYikpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ldyBPcHRpb25hbFByb21pc2UoY2IoQHZhbCkpXG4gICAgcmVzdWx0OiAtPlxuICAgICAgICBAdmFsXG5cbmV4cG9ydCBvcHRpb25hbFByb21pc2UgPSAodmFsKS0+IFxuICAgIG5ldyBPcHRpb25hbFByb21pc2UodmFsKVxuXG5cbiIsImV4cG9ydCB2YXIgT3B0aW9uYWxQcm9taXNlID0gY2xhc3MgT3B0aW9uYWxQcm9taXNlIHtcbiAgY29uc3RydWN0b3IodmFsMSkge1xuICAgIHRoaXMudmFsID0gdmFsMTtcbiAgICBpZiAoKHRoaXMudmFsICE9IG51bGwpICYmICh0aGlzLnZhbC50aGVuICE9IG51bGwpICYmICh0aGlzLnZhbC5yZXN1bHQgIT0gbnVsbCkpIHtcbiAgICAgIHRoaXMudmFsID0gdGhpcy52YWwucmVzdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgdGhlbihjYikge1xuICAgIGlmICgodGhpcy52YWwgIT0gbnVsbCkgJiYgKHRoaXMudmFsLnRoZW4gIT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKHRoaXMudmFsLnRoZW4oY2IpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UoY2IodGhpcy52YWwpKTtcbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsO1xuICB9XG5cbn07XG5cbmV4cG9ydCB2YXIgb3B0aW9uYWxQcm9taXNlID0gZnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKHZhbCk7XG59O1xuIiwiZXhwb3J0IGNsYXNzIFBhdGhIZWxwZXJcbiAgQGdldFBhdGg6IChvYmoscGF0aCxzZXA9Jy4nKSAtPlxuICAgIHBhcnRzID0gcGF0aC5zcGxpdChzZXApXG4gICAgY3VyID0gb2JqXG4gICAgcGFydHMuZmluZCAocGFydCkgPT5cbiAgICAgIGN1ciA9IGN1cltwYXJ0XVxuICAgICAgdHlwZW9mIGN1ciA9PSBcInVuZGVmaW5lZFwiXG4gICAgY3VyXG4gICAgXG4gIFxuICBAc2V0UGF0aDogKG9iaixwYXRoLHZhbCxzZXA9Jy4nKSAtPlxuICAgIHBhcnRzID0gcGF0aC5zcGxpdChzZXApXG4gICAgbGFzdCA9IHBhcnRzLnBvcCgpXG4gICAgcGFydHMucmVkdWNlKChjdXIscGFydCkgPT5cbiAgICAgIGlmIGN1cltwYXJ0XT9cbiAgICAgICAgY3VyW3BhcnRdXG4gICAgICBlbHNlXG4gICAgICAgIGN1cltwYXJ0XSA9IHt9XG4gICAgLCBvYmopW2xhc3RdID0gdmFsXG4gICAgIiwiZXhwb3J0IHZhciBQYXRoSGVscGVyID0gY2xhc3MgUGF0aEhlbHBlciB7XG4gIHN0YXRpYyBnZXRQYXRoKG9iaiwgcGF0aCwgc2VwID0gJy4nKSB7XG4gICAgdmFyIGN1ciwgcGFydHM7XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcCk7XG4gICAgY3VyID0gb2JqO1xuICAgIHBhcnRzLmZpbmQoKHBhcnQpID0+IHtcbiAgICAgIGN1ciA9IGN1cltwYXJ0XTtcbiAgICAgIHJldHVybiB0eXBlb2YgY3VyID09PSBcInVuZGVmaW5lZFwiO1xuICAgIH0pO1xuICAgIHJldHVybiBjdXI7XG4gIH1cblxuICBzdGF0aWMgc2V0UGF0aChvYmosIHBhdGgsIHZhbCwgc2VwID0gJy4nKSB7XG4gICAgdmFyIGxhc3QsIHBhcnRzO1xuICAgIHBhcnRzID0gcGF0aC5zcGxpdChzZXApO1xuICAgIGxhc3QgPSBwYXJ0cy5wb3AoKTtcbiAgICByZXR1cm4gcGFydHMucmVkdWNlKChjdXIsIHBhcnQpID0+IHtcbiAgICAgIGlmIChjdXJbcGFydF0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY3VyW3BhcnRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGN1cltwYXJ0XSA9IHt9O1xuICAgICAgfVxuICAgIH0sIG9iailbbGFzdF0gPSB2YWw7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFNpemUgfSBmcm9tICcuLi9wb3NpdGlvbmluZy9TaXplJztcblxuZXhwb3J0IGNsYXNzIFN0cmluZ0hlbHBlclxuICBAdHJpbUVtcHR5TGluZTogKHR4dCkgLT5cbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJylcblxuICBAZXNjYXBlUmVnRXhwOiAoc3RyKSAtPlxuICAgIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIilcblxuICBAcmVwZWF0VG9MZW5ndGg6ICh0eHQsIGxlbmd0aCkgLT5cbiAgICByZXR1cm4gJycgaWYgbGVuZ3RoIDw9IDBcbiAgICBBcnJheShNYXRoLmNlaWwobGVuZ3RoL3R4dC5sZW5ndGgpKzEpLmpvaW4odHh0KS5zdWJzdHJpbmcoMCxsZW5ndGgpXG4gICAgXG4gIEByZXBlYXQ6ICh0eHQsIG5iKSAtPlxuICAgIEFycmF5KG5iKzEpLmpvaW4odHh0KVxuICAgIFxuICBAZ2V0VHh0U2l6ZTogKHR4dCkgLT5cbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywnJykuc3BsaXQoXCJcXG5cIilcbiAgICB3ID0gMFxuICAgIGZvciBsIGluIGxpbmVzXG4gICAgICB3ID0gTWF0aC5tYXgodyxsLmxlbmd0aClcbiAgICByZXR1cm4gbmV3IFNpemUodyxsaW5lcy5sZW5ndGgtMSlcblxuICBAaW5kZW50Tm90Rmlyc3Q6ICh0ZXh0LG5iPTEsc3BhY2VzPScgICcpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJlZyA9IC9cXG4vZ1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXFxuXCIgKyBAcmVwZWF0KHNwYWNlcywgbmIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgICBcbiAgQGluZGVudDogKHRleHQsbmI9MSxzcGFjZXM9JyAgJykgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmV0dXJuIHNwYWNlcyArIEBpbmRlbnROb3RGaXJzdCh0ZXh0LG5iLHNwYWNlcylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBcbiAgQHJldmVyc2VTdHI6ICh0eHQpIC0+XG4gICAgcmV0dXJuIHR4dC5zcGxpdChcIlwiKS5yZXZlcnNlKCkuam9pbihcIlwiKVxuICBcbiAgXG4gIEByZW1vdmVDYXJyZXQ6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSdcbiAgICByZUNhcnJldCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhcitjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgcmVUbXAgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAodG1wKSwgXCJnXCIpXG4gICAgdHh0LnJlcGxhY2UocmVRdW90ZWQsdG1wKS5yZXBsYWNlKHJlQ2FycmV0LCcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKVxuICAgIFxuICBAZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQ6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgcG9zID0gQGdldENhcnJldFBvcyh0eHQsY2FycmV0Q2hhcilcbiAgICBpZiBwb3M/XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAscG9zKSArIHR4dC5zdWJzdHIocG9zK2NhcnJldENoYXIubGVuZ3RoKVxuICAgICAgcmV0dXJuIFtwb3MsdHh0XVxuICAgICAgXG4gIEBnZXRDYXJyZXRQb3M6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhcitjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgdHh0ID0gdHh0LnJlcGxhY2UocmVRdW90ZWQsICcgJylcbiAgICBpZiAoaSA9IHR4dC5pbmRleE9mKGNhcnJldENoYXIpKSA+IC0xXG4gICAgICByZXR1cm4gaSIsImltcG9ydCB7XG4gIFNpemVcbn0gZnJvbSAnLi4vcG9zaXRpb25pbmcvU2l6ZSc7XG5cbmV4cG9ydCB2YXIgU3RyaW5nSGVscGVyID0gY2xhc3MgU3RyaW5nSGVscGVyIHtcbiAgc3RhdGljIHRyaW1FbXB0eUxpbmUodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKC9eXFxzKlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyP1xcblxccyokLywgJycpO1xuICB9XG5cbiAgc3RhdGljIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXRUb0xlbmd0aCh0eHQsIGxlbmd0aCkge1xuICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkoTWF0aC5jZWlsKGxlbmd0aCAvIHR4dC5sZW5ndGgpICsgMSkuam9pbih0eHQpLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuICB9XG5cbiAgc3RhdGljIHJlcGVhdCh0eHQsIG5iKSB7XG4gICAgcmV0dXJuIEFycmF5KG5iICsgMSkuam9pbih0eHQpO1xuICB9XG5cbiAgc3RhdGljIGdldFR4dFNpemUodHh0KSB7XG4gICAgdmFyIGosIGwsIGxlbiwgbGluZXMsIHc7XG4gICAgbGluZXMgPSB0eHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKTtcbiAgICB3ID0gMDtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbCA9IGxpbmVzW2pdO1xuICAgICAgdyA9IE1hdGgubWF4KHcsIGwubGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTaXplKHcsIGxpbmVzLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgc3RhdGljIGluZGVudE5vdEZpcnN0KHRleHQsIG5iID0gMSwgc3BhY2VzID0gJyAgJykge1xuICAgIHZhciByZWc7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gL1xcbi9nO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXFxuXCIgKyB0aGlzLnJlcGVhdChzcGFjZXMsIG5iKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnQodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNwYWNlcyArIHRoaXMuaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIsIHNwYWNlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZXZlcnNlU3RyKHR4dCkge1xuICAgIHJldHVybiB0eHQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIik7XG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlQ2FycmV0KHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciByZUNhcnJldCwgcmVRdW90ZWQsIHJlVG1wLCB0bXA7XG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSc7XG4gICAgcmVDYXJyZXQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHJlVG1wID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cCh0bXApLCBcImdcIik7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKHJlUXVvdGVkLCB0bXApLnJlcGxhY2UocmVDYXJyZXQsICcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcG9zO1xuICAgIHBvcyA9IHRoaXMuZ2V0Q2FycmV0UG9zKHR4dCwgY2FycmV0Q2hhcik7XG4gICAgaWYgKHBvcyAhPSBudWxsKSB7XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAsIHBvcykgKyB0eHQuc3Vic3RyKHBvcyArIGNhcnJldENoYXIubGVuZ3RoKTtcbiAgICAgIHJldHVybiBbcG9zLCB0eHRdO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXRDYXJyZXRQb3ModHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIGksIHJlUXVvdGVkO1xuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKTtcbiAgICBpZiAoKGkgPSB0eHQuaW5kZXhPZihjYXJyZXRDaGFyKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IFBhaXJNYXRjaCB9IGZyb20gJy4vUGFpck1hdGNoJztcblxuZXhwb3J0IGNsYXNzIFBhaXJcbiAgY29uc3RydWN0b3I6IChAb3BlbmVyLEBjbG9zZXIsQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IGZhbHNlXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIEBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IEBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gIG9wZW5lclJlZzogLT5cbiAgICBpZiB0eXBlb2YgQG9wZW5lciA9PSAnc3RyaW5nJyBcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQG9wZW5lcikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBvcGVuZXJcbiAgY2xvc2VyUmVnOiAtPlxuICAgIGlmIHR5cGVvZiBAY2xvc2VyID09ICdzdHJpbmcnIFxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY2xvc2VyKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQGNsb3NlclxuICBtYXRjaEFueVBhcnRzOiAtPlxuICAgIHJldHVybiB7XG4gICAgICBvcGVuZXI6IEBvcGVuZXJSZWcoKVxuICAgICAgY2xvc2VyOiBAY2xvc2VyUmVnKClcbiAgICB9XG4gIG1hdGNoQW55UGFydEtleXM6IC0+XG4gICAga2V5cyA9IFtdXG4gICAgZm9yIGtleSwgcmVnIG9mIEBtYXRjaEFueVBhcnRzKClcbiAgICAgIGtleXMucHVzaChrZXkpXG4gICAgcmV0dXJuIGtleXNcbiAgbWF0Y2hBbnlSZWc6IC0+XG4gICAgZ3JvdXBzID0gW11cbiAgICBmb3Iga2V5LCByZWcgb2YgQG1hdGNoQW55UGFydHMoKVxuICAgICAgZ3JvdXBzLnB1c2goJygnK3JlZy5zb3VyY2UrJyknKVxuICAgIHJldHVybiBuZXcgUmVnRXhwKGdyb3Vwcy5qb2luKCd8JykpXG4gIG1hdGNoQW55OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICB3aGlsZSAobWF0Y2ggPSBAX21hdGNoQW55KHRleHQsb2Zmc2V0KSk/IGFuZCAhbWF0Y2gudmFsaWQoKVxuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKClcbiAgICByZXR1cm4gbWF0Y2ggaWYgbWF0Y2g/IGFuZCBtYXRjaC52YWxpZCgpXG4gIF9tYXRjaEFueTogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgaWYgb2Zmc2V0XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KVxuICAgIG1hdGNoID0gQG1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KVxuICAgIGlmIG1hdGNoP1xuICAgICAgcmV0dXJuIG5ldyBQYWlyTWF0Y2godGhpcyxtYXRjaCxvZmZzZXQpXG4gIG1hdGNoQW55TmFtZWQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAX21hdGNoQW55R2V0TmFtZShAbWF0Y2hBbnkodGV4dCkpXG4gIG1hdGNoQW55TGFzdDogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgd2hpbGUgbWF0Y2ggPSBAbWF0Y2hBbnkodGV4dCxvZmZzZXQpXG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgICAgaWYgIXJlcyBvciByZXMuZW5kKCkgIT0gbWF0Y2guZW5kKClcbiAgICAgICAgcmVzID0gbWF0Y2hcbiAgICByZXR1cm4gcmVzXG4gIGlkZW50aWNhbDogLT5cbiAgICBAb3BlbmVyID09IEBjbG9zZXIgb3IgKFxuICAgICAgQG9wZW5lci5zb3VyY2U/IGFuZCBcbiAgICAgIEBjbG9zZXIuc291cmNlPyBhbmQgXG4gICAgICBAb3BlbmVyLnNvdXJjZSA9PSBAY2xvc2VyLnNvdXJjZVxuICAgIClcbiAgd3JhcHBlclBvczogKHBvcyx0ZXh0KSAtPlxuICAgIHN0YXJ0ID0gQG1hdGNoQW55TGFzdCh0ZXh0LnN1YnN0cigwLHBvcy5zdGFydCkpXG4gICAgaWYgc3RhcnQ/IGFuZCAoQGlkZW50aWNhbCgpIG9yIHN0YXJ0Lm5hbWUoKSA9PSAnb3BlbmVyJylcbiAgICAgIGVuZCA9IEBtYXRjaEFueSh0ZXh0LHBvcy5lbmQpXG4gICAgICBpZiBlbmQ/IGFuZCAoQGlkZW50aWNhbCgpIG9yIGVuZC5uYW1lKCkgPT0gJ2Nsb3NlcicpXG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksZW5kLmVuZCgpKVxuICAgICAgZWxzZSBpZiBAb3B0aW9ubmFsX2VuZFxuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLHRleHQubGVuZ3RoKVxuICBpc1dhcHBlck9mOiAocG9zLHRleHQpIC0+XG4gICAgcmV0dXJuIEB3cmFwcGVyUG9zKHBvcyx0ZXh0KT8iLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYWlyTWF0Y2hcbn0gZnJvbSAnLi9QYWlyTWF0Y2gnO1xuXG5leHBvcnQgdmFyIFBhaXIgPSBjbGFzcyBQYWlyIHtcbiAgY29uc3RydWN0b3Iob3BlbmVyLCBjbG9zZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgdGhpcy5vcGVuZXIgPSBvcGVuZXI7XG4gICAgdGhpcy5jbG9zZXIgPSBjbG9zZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IGZhbHNlLFxuICAgICAgdmFsaWRNYXRjaDogbnVsbFxuICAgIH07XG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICBpZiAoa2V5IGluIHRoaXMub3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSB0aGlzLm9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvcGVuZXJSZWcoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wZW5lciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5vcGVuZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMub3BlbmVyO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlclJlZygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuY2xvc2VyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNsb3NlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZXI7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BlbmVyOiB0aGlzLm9wZW5lclJlZygpLFxuICAgICAgY2xvc2VyOiB0aGlzLmNsb3NlclJlZygpXG4gICAgfTtcbiAgfVxuXG4gIG1hdGNoQW55UGFydEtleXMoKSB7XG4gICAgdmFyIGtleSwga2V5cywgcmVmLCByZWc7XG4gICAga2V5cyA9IFtdO1xuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV07XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG4gIH1cblxuICBtYXRjaEFueVJlZygpIHtcbiAgICB2YXIgZ3JvdXBzLCBrZXksIHJlZiwgcmVnO1xuICAgIGdyb3VwcyA9IFtdO1xuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV07XG4gICAgICBncm91cHMucHVzaCgnKCcgKyByZWcuc291cmNlICsgJyknKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoZ3JvdXBzLmpvaW4oJ3wnKSk7XG4gIH1cblxuICBtYXRjaEFueSh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoO1xuICAgIHdoaWxlICgoKG1hdGNoID0gdGhpcy5fbWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkgIT0gbnVsbCkgJiYgIW1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpO1xuICAgIH1cbiAgICBpZiAoKG1hdGNoICE9IG51bGwpICYmIG1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9XG4gIH1cblxuICBfbWF0Y2hBbnkodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaDtcbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KTtcbiAgICB9XG4gICAgbWF0Y2ggPSB0aGlzLm1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KTtcbiAgICBpZiAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBQYWlyTWF0Y2godGhpcywgbWF0Y2gsIG9mZnNldCk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlOYW1lZCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuX21hdGNoQW55R2V0TmFtZSh0aGlzLm1hdGNoQW55KHRleHQpKTtcbiAgfVxuXG4gIG1hdGNoQW55TGFzdCh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoLCByZXM7XG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKTtcbiAgICAgIGlmICghcmVzIHx8IHJlcy5lbmQoKSAhPT0gbWF0Y2guZW5kKCkpIHtcbiAgICAgICAgcmVzID0gbWF0Y2g7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBpZGVudGljYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVyID09PSB0aGlzLmNsb3NlciB8fCAoKHRoaXMub3BlbmVyLnNvdXJjZSAhPSBudWxsKSAmJiAodGhpcy5jbG9zZXIuc291cmNlICE9IG51bGwpICYmIHRoaXMub3BlbmVyLnNvdXJjZSA9PT0gdGhpcy5jbG9zZXIuc291cmNlKTtcbiAgfVxuXG4gIHdyYXBwZXJQb3MocG9zLCB0ZXh0KSB7XG4gICAgdmFyIGVuZCwgc3RhcnQ7XG4gICAgc3RhcnQgPSB0aGlzLm1hdGNoQW55TGFzdCh0ZXh0LnN1YnN0cigwLCBwb3Muc3RhcnQpKTtcbiAgICBpZiAoKHN0YXJ0ICE9IG51bGwpICYmICh0aGlzLmlkZW50aWNhbCgpIHx8IHN0YXJ0Lm5hbWUoKSA9PT0gJ29wZW5lcicpKSB7XG4gICAgICBlbmQgPSB0aGlzLm1hdGNoQW55KHRleHQsIHBvcy5lbmQpO1xuICAgICAgaWYgKChlbmQgIT0gbnVsbCkgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgZW5kLm5hbWUoKSA9PT0gJ2Nsb3NlcicpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIGVuZC5lbmQoKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ubmFsX2VuZCkge1xuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLCB0ZXh0Lmxlbmd0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNXYXBwZXJPZihwb3MsIHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy53cmFwcGVyUG9zKHBvcywgdGV4dCkgIT0gbnVsbDtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIFBhaXJNYXRjaFxuICBjb25zdHJ1Y3RvcjogKEBwYWlyLEBtYXRjaCxAb2Zmc2V0ID0gMCkgLT5cbiAgbmFtZTogLT5cbiAgICBpZiBAbWF0Y2hcbiAgICAgIHVubGVzcyBfbmFtZT9cbiAgICAgICAgZm9yIGdyb3VwLCBpIGluIEBtYXRjaFxuICAgICAgICAgIGlmIGkgPiAwIGFuZCBncm91cD9cbiAgICAgICAgICAgIF9uYW1lID0gQHBhaXIubWF0Y2hBbnlQYXJ0S2V5cygpW2ktMV1cbiAgICAgICAgICAgIHJldHVybiBfbmFtZVxuICAgICAgICBfbmFtZSA9IGZhbHNlXG4gICAgICByZXR1cm4gX25hbWUgfHwgbnVsbFxuICBzdGFydDogLT5cbiAgICBAbWF0Y2guaW5kZXggKyBAb2Zmc2V0XG4gIGVuZDogLT5cbiAgICBAbWF0Y2guaW5kZXggKyBAbWF0Y2hbMF0ubGVuZ3RoICsgQG9mZnNldFxuICB2YWxpZDogLT5cbiAgICByZXR1cm4gIUBwYWlyLnZhbGlkTWF0Y2ggfHwgQHBhaXIudmFsaWRNYXRjaCh0aGlzKVxuICBsZW5ndGg6IC0+XG4gICAgQG1hdGNoWzBdLmxlbmd0aCIsImV4cG9ydCB2YXIgUGFpck1hdGNoID0gY2xhc3MgUGFpck1hdGNoIHtcbiAgY29uc3RydWN0b3IocGFpciwgbWF0Y2gsIG9mZnNldCA9IDApIHtcbiAgICB0aGlzLnBhaXIgPSBwYWlyO1xuICAgIHRoaXMubWF0Y2ggPSBtYXRjaDtcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgfVxuXG4gIG5hbWUoKSB7XG4gICAgdmFyIF9uYW1lLCBncm91cCwgaSwgaiwgbGVuLCByZWY7XG4gICAgaWYgKHRoaXMubWF0Y2gpIHtcbiAgICAgIGlmICh0eXBlb2YgX25hbWUgPT09IFwidW5kZWZpbmVkXCIgfHwgX25hbWUgPT09IG51bGwpIHtcbiAgICAgICAgcmVmID0gdGhpcy5tYXRjaDtcbiAgICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgICBncm91cCA9IHJlZltpXTtcbiAgICAgICAgICBpZiAoaSA+IDAgJiYgKGdyb3VwICE9IG51bGwpKSB7XG4gICAgICAgICAgICBfbmFtZSA9IHRoaXMucGFpci5tYXRjaEFueVBhcnRLZXlzKClbaSAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuIF9uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfbmFtZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9uYW1lIHx8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm9mZnNldDtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMubWF0Y2hbMF0ubGVuZ3RoICsgdGhpcy5vZmZzZXQ7XG4gIH1cblxuICB2YWxpZCgpIHtcbiAgICByZXR1cm4gIXRoaXMucGFpci52YWxpZE1hdGNoIHx8IHRoaXMucGFpci52YWxpZE1hdGNoKHRoaXMpO1xuICB9XG5cbiAgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoWzBdLmxlbmd0aDtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIFBvc1xuICBjb25zdHJ1Y3RvcjogKEBzdGFydCxAZW5kKSAtPlxuICAgIEBlbmQgPSBAc3RhcnQgdW5sZXNzIEBlbmQ/XG4gIGNvbnRhaW5zUHQ6IChwdCkgLT5cbiAgICByZXR1cm4gQHN0YXJ0IDw9IHB0IGFuZCBwdCA8PSBAZW5kXG4gIGNvbnRhaW5zUG9zOiAocG9zKSAtPlxuICAgIHJldHVybiBAc3RhcnQgPD0gcG9zLnN0YXJ0IGFuZCBwb3MuZW5kIDw9IEBlbmRcbiAgd3JhcHBlZEJ5OiAocHJlZml4LHN1ZmZpeCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcy53cmFwQ2xhc3MoQHN0YXJ0LXByZWZpeC5sZW5ndGgsQHN0YXJ0LEBlbmQsQGVuZCtzdWZmaXgubGVuZ3RoKVxuICB3aXRoRWRpdG9yOiAodmFsKS0+XG4gICAgQF9lZGl0b3IgPSB2YWxcbiAgICByZXR1cm4gdGhpc1xuICBlZGl0b3I6IC0+XG4gICAgdW5sZXNzIEBfZWRpdG9yP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0JylcbiAgICByZXR1cm4gQF9lZGl0b3JcbiAgaGFzRWRpdG9yOiAtPlxuICAgIHJldHVybiBAX2VkaXRvcj9cbiAgdGV4dDogLT5cbiAgICBAZWRpdG9yKCkudGV4dFN1YnN0cihAc3RhcnQsIEBlbmQpXG4gIGFwcGx5T2Zmc2V0OiAob2Zmc2V0KS0+XG4gICAgaWYgb2Zmc2V0ICE9IDBcbiAgICAgIEBzdGFydCArPSBvZmZzZXRcbiAgICAgIEBlbmQgKz0gb2Zmc2V0XG4gICAgcmV0dXJuIHRoaXNcbiAgcHJldkVPTDogLT5cbiAgICB1bmxlc3MgQF9wcmV2RU9MP1xuICAgICAgQF9wcmV2RU9MID0gQGVkaXRvcigpLmZpbmRMaW5lU3RhcnQoQHN0YXJ0KVxuICAgIHJldHVybiBAX3ByZXZFT0xcbiAgbmV4dEVPTDogLT5cbiAgICB1bmxlc3MgQF9uZXh0RU9MP1xuICAgICAgQF9uZXh0RU9MID0gQGVkaXRvcigpLmZpbmRMaW5lRW5kKEBlbmQpXG4gICAgcmV0dXJuIEBfbmV4dEVPTFxuICB0ZXh0V2l0aEZ1bGxMaW5lczogLT5cbiAgICB1bmxlc3MgQF90ZXh0V2l0aEZ1bGxMaW5lcz9cbiAgICAgIEBfdGV4dFdpdGhGdWxsTGluZXMgPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAcHJldkVPTCgpLEBuZXh0RU9MKCkpXG4gICAgcmV0dXJuIEBfdGV4dFdpdGhGdWxsTGluZXNcbiAgc2FtZUxpbmVzUHJlZml4OiAtPlxuICAgIHVubGVzcyBAX3NhbWVMaW5lc1ByZWZpeD9cbiAgICAgIEBfc2FtZUxpbmVzUHJlZml4ID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQHByZXZFT0woKSxAc3RhcnQpXG4gICAgcmV0dXJuIEBfc2FtZUxpbmVzUHJlZml4XG4gIHNhbWVMaW5lc1N1ZmZpeDogLT5cbiAgICB1bmxlc3MgQF9zYW1lTGluZXNTdWZmaXg/XG4gICAgICBAX3NhbWVMaW5lc1N1ZmZpeCA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBlbmQsQG5leHRFT0woKSlcbiAgICByZXR1cm4gQF9zYW1lTGluZXNTdWZmaXhcbiAgY29weTogLT5cbiAgICByZXMgPSBuZXcgUG9zKEBzdGFydCxAZW5kKVxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgcmVzLndpdGhFZGl0b3IoQGVkaXRvcigpKVxuICAgIHJldHVybiByZXNcbiAgcmF3OiAtPlxuICAgIFtAc3RhcnQsQGVuZF0iLCJleHBvcnQgdmFyIFBvcyA9IGNsYXNzIFBvcyB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBlbmQpIHtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgaWYgKHRoaXMuZW5kID09IG51bGwpIHtcbiAgICAgIHRoaXMuZW5kID0gdGhpcy5zdGFydDtcbiAgICB9XG4gIH1cblxuICBjb250YWluc1B0KHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5lbmQ7XG4gIH1cblxuICBjb250YWluc1Bvcyhwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmVuZDtcbiAgfVxuXG4gIHdyYXBwZWRCeShwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyh0aGlzLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCwgdGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZW5kICsgc3VmZml4Lmxlbmd0aCk7XG4gIH1cblxuICB3aXRoRWRpdG9yKHZhbCkge1xuICAgIHRoaXMuX2VkaXRvciA9IHZhbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGVkaXRvcigpIHtcbiAgICBpZiAodGhpcy5fZWRpdG9yID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZWRpdG9yIHNldCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yO1xuICB9XG5cbiAgaGFzRWRpdG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9lZGl0b3IgIT0gbnVsbDtcbiAgfVxuXG4gIHRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gIH1cblxuICBhcHBseU9mZnNldChvZmZzZXQpIHtcbiAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgIHRoaXMuZW5kICs9IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcmV2RU9MKCkge1xuICAgIGlmICh0aGlzLl9wcmV2RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3ByZXZFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lU3RhcnQodGhpcy5zdGFydCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9wcmV2RU9MO1xuICB9XG5cbiAgbmV4dEVPTCgpIHtcbiAgICBpZiAodGhpcy5fbmV4dEVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9uZXh0RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZUVuZCh0aGlzLmVuZCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9uZXh0RU9MO1xuICB9XG5cbiAgdGV4dFdpdGhGdWxsTGluZXMoKSB7XG4gICAgaWYgKHRoaXMuX3RleHRXaXRoRnVsbExpbmVzID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHRXaXRoRnVsbExpbmVzID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMucHJldkVPTCgpLCB0aGlzLm5leHRFT0woKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcztcbiAgfVxuXG4gIHNhbWVMaW5lc1ByZWZpeCgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzUHJlZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5zdGFydCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNQcmVmaXg7XG4gIH1cblxuICBzYW1lTGluZXNTdWZmaXgoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNTdWZmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5lbmQsIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NhbWVMaW5lc1N1ZmZpeDtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBuZXcgUG9zKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICByYXcoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnN0YXJ0LCB0aGlzLmVuZF07XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFdyYXBwaW5nIH0gZnJvbSAnLi9XcmFwcGluZyc7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgQ29tbW9uSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUG9zQ29sbGVjdGlvblxuICBjb25zdHJ1Y3RvcjogKGFycikgLT5cbiAgICBpZiAhQXJyYXkuaXNBcnJheShhcnIpXG4gICAgICBhcnIgPSBbYXJyXVxuICAgIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhhcnIsW1Bvc0NvbGxlY3Rpb25dKVxuICAgIHJldHVybiBhcnJcbiAgICBcbiAgd3JhcDogKHByZWZpeCxzdWZmaXgpLT5cbiAgICAgIHJldHVybiBAbWFwKCAocCkgLT4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeCkpXG4gIHJlcGxhY2U6ICh0eHQpLT5cbiAgICAgIHJldHVybiBAbWFwKCAocCkgLT4gbmV3IFJlcGxhY2VtZW50KHAuc3RhcnQsIHAuZW5kLCB0eHQpKSIsImltcG9ydCB7XG4gIFdyYXBwaW5nXG59IGZyb20gJy4vV3JhcHBpbmcnO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuaW1wb3J0IHtcbiAgQ29tbW9uSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcblxuZXhwb3J0IHZhciBQb3NDb2xsZWN0aW9uID0gY2xhc3MgUG9zQ29sbGVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGFycikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICBhcnIgPSBbYXJyXTtcbiAgICB9XG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFyciwgW1Bvc0NvbGxlY3Rpb25dKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgd3JhcChwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeCk7XG4gICAgfSk7XG4gIH1cblxuICByZXBsYWNlKHR4dCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gbmV3IFJlcGxhY2VtZW50KHAuc3RhcnQsIHAuZW5kLCB0eHQpO1xuICAgIH0pO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL1Bvcyc7XG5pbXBvcnQgeyBDb21tb25IZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5pbXBvcnQgeyBPcHRpb25PYmplY3QgfSBmcm9tICcuLi9PcHRpb25PYmplY3QnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUmVwbGFjZW1lbnQgZXh0ZW5kcyBQb3NcbiAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKHRoaXMucHJvdG90eXBlLFtPcHRpb25PYmplY3RdKVxuICBjb25zdHJ1Y3RvcjogKEBzdGFydCwgQGVuZCwgQHRleHQsIEBvcHRpb25zID0ge30pIC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRPcHRzKEBvcHRpb25zLHtcbiAgICAgIHByZWZpeDogJydcbiAgICAgIHN1ZmZpeDogJydcbiAgICAgIHNlbGVjdGlvbnM6IFtdXG4gICAgfSlcbiAgcmVzUG9zQmVmb3JlUHJlZml4OiAtPlxuICAgIHJldHVybiBAc3RhcnQrQHByZWZpeC5sZW5ndGgrQHRleHQubGVuZ3RoXG4gIHJlc0VuZDogLT4gXG4gICAgcmV0dXJuIEBzdGFydCtAZmluYWxUZXh0KCkubGVuZ3RoXG4gIGFwcGx5OiAtPlxuICAgIEBlZGl0b3IoKS5zcGxpY2VUZXh0KEBzdGFydCwgQGVuZCwgQGZpbmFsVGV4dCgpKVxuICBuZWNlc3Nhcnk6IC0+XG4gICAgcmV0dXJuIEBmaW5hbFRleHQoKSAhPSBAb3JpZ2luYWxUZXh0KClcbiAgb3JpZ2luYWxUZXh0OiAtPlxuICAgIHJldHVybiBAZWRpdG9yKCkudGV4dFN1YnN0cihAc3RhcnQsIEBlbmQpXG4gIGZpbmFsVGV4dDogLT5cbiAgICByZXR1cm4gQHByZWZpeCtAdGV4dCtAc3VmZml4XG4gIG9mZnNldEFmdGVyOiAoKSAtPiBcbiAgICByZXR1cm4gQGZpbmFsVGV4dCgpLmxlbmd0aCAtIChAZW5kIC0gQHN0YXJ0KVxuICBhcHBseU9mZnNldDogKG9mZnNldCktPlxuICAgIGlmIG9mZnNldCAhPSAwXG4gICAgICBAc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBAZW5kICs9IG9mZnNldFxuICAgICAgZm9yIHNlbCBpbiBAc2VsZWN0aW9uc1xuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0XG4gICAgcmV0dXJuIHRoaXNcbiAgc2VsZWN0Q29udGVudDogLT4gXG4gICAgQHNlbGVjdGlvbnMgPSBbbmV3IFBvcyhAcHJlZml4Lmxlbmd0aCtAc3RhcnQsIEBwcmVmaXgubGVuZ3RoK0BzdGFydCtAdGV4dC5sZW5ndGgpXVxuICAgIHJldHVybiB0aGlzXG4gIGNhcnJldFRvU2VsOiAtPlxuICAgIEBzZWxlY3Rpb25zID0gW11cbiAgICB0ZXh0ID0gQGZpbmFsVGV4dCgpXG4gICAgQHByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHByZWZpeClcbiAgICBAdGV4dCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHRleHQpXG4gICAgQHN1ZmZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHN1ZmZpeClcbiAgICBzdGFydCA9IEBzdGFydFxuICAgIFxuICAgIHdoaWxlIChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpP1xuICAgICAgW3Bvcyx0ZXh0XSA9IHJlc1xuICAgICAgQHNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0K3Bvcywgc3RhcnQrcG9zKSlcbiAgICAgIFxuICAgIHJldHVybiB0aGlzXG4gIGNvcHk6IC0+IFxuICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudChAc3RhcnQsIEBlbmQsIEB0ZXh0LCBAZ2V0T3B0cygpKVxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgcmVzLndpdGhFZGl0b3IoQGVkaXRvcigpKVxuICAgIHJlcy5zZWxlY3Rpb25zID0gQHNlbGVjdGlvbnMubWFwKCAocyktPnMuY29weSgpIClcbiAgICByZXR1cm4gcmVzIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vUG9zJztcblxuaW1wb3J0IHtcbiAgQ29tbW9uSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcblxuaW1wb3J0IHtcbiAgT3B0aW9uT2JqZWN0XG59IGZyb20gJy4uL09wdGlvbk9iamVjdCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCB2YXIgUmVwbGFjZW1lbnQgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIFJlcGxhY2VtZW50IGV4dGVuZHMgUG9zIHtcbiAgICBjb25zdHJ1Y3RvcihzdGFydDEsIGVuZCwgdGV4dDEsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDE7XG4gICAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICAgIHRoaXMudGV4dCA9IHRleHQxO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgcHJlZml4OiAnJyxcbiAgICAgICAgc3VmZml4OiAnJyxcbiAgICAgICAgc2VsZWN0aW9uczogW11cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc1Bvc0JlZm9yZVByZWZpeCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy50ZXh0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXNFbmQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoO1xuICAgIH1cblxuICAgIGFwcGx5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkuc3BsaWNlVGV4dCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5maW5hbFRleHQoKSk7XG4gICAgfVxuXG4gICAgbmVjZXNzYXJ5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkgIT09IHRoaXMub3JpZ2luYWxUZXh0KCk7XG4gICAgfVxuXG4gICAgb3JpZ2luYWxUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gICAgfVxuXG4gICAgZmluYWxUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy50ZXh0ICsgdGhpcy5zdWZmaXg7XG4gICAgfVxuXG4gICAgb2Zmc2V0QWZ0ZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKS5sZW5ndGggLSAodGhpcy5lbmQgLSB0aGlzLnN0YXJ0KTtcbiAgICB9XG5cbiAgICBhcHBseU9mZnNldChvZmZzZXQpIHtcbiAgICAgIHZhciBpLCBsZW4sIHJlZiwgc2VsO1xuICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgICAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnM7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHNlbCA9IHJlZltpXTtcbiAgICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZWxlY3RDb250ZW50KCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW25ldyBQb3ModGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCwgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCArIHRoaXMudGV4dC5sZW5ndGgpXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNhcnJldFRvU2VsKCkge1xuICAgICAgdmFyIHBvcywgcmVzLCBzdGFydCwgdGV4dDtcbiAgICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtdO1xuICAgICAgdGV4dCA9IHRoaXMuZmluYWxUZXh0KCk7XG4gICAgICB0aGlzLnByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5wcmVmaXgpO1xuICAgICAgdGhpcy50ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnRleHQpO1xuICAgICAgdGhpcy5zdWZmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMuc3VmZml4KTtcbiAgICAgIHN0YXJ0ID0gdGhpcy5zdGFydDtcbiAgICAgIHdoaWxlICgocmVzID0gU3RyaW5nSGVscGVyLmdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHRleHQpKSAhPSBudWxsKSB7XG4gICAgICAgIFtwb3MsIHRleHRdID0gcmVzO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0ICsgcG9zLCBzdGFydCArIHBvcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgIHZhciByZXM7XG4gICAgICByZXMgPSBuZXcgUmVwbGFjZW1lbnQodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMudGV4dCwgdGhpcy5nZXRPcHRzKCkpO1xuICAgICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSk7XG4gICAgICB9XG4gICAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcy5jb3B5KCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gIH07XG5cbiAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKFJlcGxhY2VtZW50LnByb3RvdHlwZSwgW09wdGlvbk9iamVjdF0pO1xuXG4gIHJldHVybiBSZXBsYWNlbWVudDtcblxufSkuY2FsbCh0aGlzKTtcbiIsImV4cG9ydCBjbGFzcyBTaXplXG4gIGNvbnN0cnVjdG9yOiAoQHdpZHRoLEBoZWlnaHQpIC0+IiwiZXhwb3J0IGNsYXNzIFN0clBvc1xuICBjb25zdHJ1Y3RvcjogKEBwb3MsQHN0cikgLT5cbiAgZW5kOiAtPlxuICAgIEBwb3MgKyBAc3RyLmxlbmd0aCIsImV4cG9ydCB2YXIgU3RyUG9zID0gY2xhc3MgU3RyUG9zIHtcbiAgY29uc3RydWN0b3IocG9zLCBzdHIpIHtcbiAgICB0aGlzLnBvcyA9IHBvcztcbiAgICB0aGlzLnN0ciA9IHN0cjtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGg7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcblxuZXhwb3J0IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3NcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIC0+XG4gICAgc3VwZXIoKVxuICBpbm5lckNvbnRhaW5zUHQ6IChwdCkgLT5cbiAgICByZXR1cm4gQGlubmVyU3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBpbm5lckVuZFxuICBpbm5lckNvbnRhaW5zUG9zOiAocG9zKSAtPlxuICAgIHJldHVybiBAaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGlubmVyRW5kXG4gIGlubmVyVGV4dDogLT5cbiAgICBAZWRpdG9yKCkudGV4dFN1YnN0cihAaW5uZXJTdGFydCwgQGlubmVyRW5kKVxuICBzZXRJbm5lckxlbjogKGxlbikgLT5cbiAgICBAbW92ZVN1Zml4KEBpbm5lclN0YXJ0ICsgbGVuKVxuICBtb3ZlU3VmZml4OiAocHQpIC0+XG4gICAgc3VmZml4TGVuID0gQGVuZCAtIEBpbm5lckVuZFxuICAgIEBpbm5lckVuZCA9IHB0XG4gICAgQGVuZCA9IEBpbm5lckVuZCArIHN1ZmZpeExlblxuICBjb3B5OiAtPlxuICAgIHJldHVybiBuZXcgV3JhcHBlZFBvcyhAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vUG9zJztcblxuZXhwb3J0IHZhciBXcmFwcGVkUG9zID0gY2xhc3MgV3JhcHBlZFBvcyBleHRlbmRzIFBvcyB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBpbm5lclN0YXJ0LCBpbm5lckVuZCwgZW5kKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5pbm5lclN0YXJ0ID0gaW5uZXJTdGFydDtcbiAgICB0aGlzLmlubmVyRW5kID0gaW5uZXJFbmQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gIH1cblxuICBpbm5lckNvbnRhaW5zUHQocHQpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclN0YXJ0IDw9IHB0ICYmIHB0IDw9IHRoaXMuaW5uZXJFbmQ7XG4gIH1cblxuICBpbm5lckNvbnRhaW5zUG9zKHBvcykge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcG9zLnN0YXJ0ICYmIHBvcy5lbmQgPD0gdGhpcy5pbm5lckVuZDtcbiAgfVxuXG4gIGlubmVyVGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCk7XG4gIH1cblxuICBzZXRJbm5lckxlbihsZW4pIHtcbiAgICByZXR1cm4gdGhpcy5tb3ZlU3VmaXgodGhpcy5pbm5lclN0YXJ0ICsgbGVuKTtcbiAgfVxuXG4gIG1vdmVTdWZmaXgocHQpIHtcbiAgICB2YXIgc3VmZml4TGVuO1xuICAgIHN1ZmZpeExlbiA9IHRoaXMuZW5kIC0gdGhpcy5pbm5lckVuZDtcbiAgICB0aGlzLmlubmVyRW5kID0gcHQ7XG4gICAgcmV0dXJuIHRoaXMuZW5kID0gdGhpcy5pbm5lckVuZCArIHN1ZmZpeExlbjtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKHRoaXMuc3RhcnQsIHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCwgdGhpcy5lbmQpO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgY2xhc3MgV3JhcHBpbmcgZXh0ZW5kcyBSZXBsYWNlbWVudFxuICBjb25zdHJ1Y3RvcjogKEBzdGFydCwgQGVuZCwgcHJlZml4ID0nJywgc3VmZml4ID0gJycsIEBvcHRpb25zID0ge30pIC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRPcHRzKEBvcHRpb25zKVxuICAgIEB0ZXh0ID0gJydcbiAgICBAcHJlZml4ID0gcHJlZml4XG4gICAgQHN1ZmZpeCA9IHN1ZmZpeFxuICBhcHBseTogLT5cbiAgICBAYWRqdXN0U2VsKClcbiAgICBzdXBlcigpXG4gIGFkanVzdFNlbDogLT5cbiAgICBvZmZzZXQgPSBAb3JpZ2luYWxUZXh0KCkubGVuZ3RoXG4gICAgZm9yIHNlbCBpbiBAc2VsZWN0aW9uc1xuICAgICAgaWYgc2VsLnN0YXJ0ID4gQHN0YXJ0K0BwcmVmaXgubGVuZ3RoXG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgIGlmIHNlbC5lbmQgPj0gQHN0YXJ0K0BwcmVmaXgubGVuZ3RoXG4gICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0XG4gIGZpbmFsVGV4dDogLT5cbiAgICBpZiBAaGFzRWRpdG9yKClcbiAgICAgIHRleHQgPSBAb3JpZ2luYWxUZXh0KClcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gJydcbiAgICByZXR1cm4gQHByZWZpeCt0ZXh0K0BzdWZmaXhcbiAgb2Zmc2V0QWZ0ZXI6ICgpIC0+IFxuICAgIHJldHVybiBAcHJlZml4Lmxlbmd0aCtAc3VmZml4Lmxlbmd0aFxuICAgICAgICAgIFxuICBjb3B5OiAtPiBcbiAgICByZXMgPSBuZXcgV3JhcHBpbmcoQHN0YXJ0LCBAZW5kLCBAcHJlZml4LCBAc3VmZml4KVxuICAgIHJlcy5zZWxlY3Rpb25zID0gQHNlbGVjdGlvbnMubWFwKCAocyktPnMuY29weSgpIClcbiAgICByZXR1cm4gcmVzIiwiaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCB2YXIgV3JhcHBpbmcgPSBjbGFzcyBXcmFwcGluZyBleHRlbmRzIFJlcGxhY2VtZW50IHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGVuZCwgcHJlZml4ID0gJycsIHN1ZmZpeCA9ICcnLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMudGV4dCA9ICcnO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4O1xuICAgIHRoaXMuc3VmZml4ID0gc3VmZml4O1xuICB9XG5cbiAgYXBwbHkoKSB7XG4gICAgdGhpcy5hZGp1c3RTZWwoKTtcbiAgICByZXR1cm4gc3VwZXIuYXBwbHkoKTtcbiAgfVxuXG4gIGFkanVzdFNlbCgpIHtcbiAgICB2YXIgaSwgbGVuLCBvZmZzZXQsIHJlZiwgcmVzdWx0cywgc2VsO1xuICAgIG9mZnNldCA9IHRoaXMub3JpZ2luYWxUZXh0KCkubGVuZ3RoO1xuICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9ucztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzZWwgPSByZWZbaV07XG4gICAgICBpZiAoc2VsLnN0YXJ0ID4gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgfVxuICAgICAgaWYgKHNlbC5lbmQgPj0gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHRzLnB1c2goc2VsLmVuZCArPSBvZmZzZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgZmluYWxUZXh0KCkge1xuICAgIHZhciB0ZXh0O1xuICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICB0ZXh0ID0gdGhpcy5vcmlnaW5hbFRleHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9ICcnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0ZXh0ICsgdGhpcy5zdWZmaXg7XG4gIH1cblxuICBvZmZzZXRBZnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdWZmaXgubGVuZ3RoO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBXcmFwcGluZyh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5wcmVmaXgsIHRoaXMuc3VmZml4KTtcbiAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24ocykge1xuICAgICAgcmV0dXJuIHMuY29weSgpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxufTtcbiIsIlxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZUVuZ2luZVxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgc2F2ZTogKGtleSx2YWwpIC0+XG4gICAgaWYgbG9jYWxTdG9yYWdlP1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oQGZ1bGxLZXkoa2V5KSwgSlNPTi5zdHJpbmdpZnkodmFsKSlcbiAgc2F2ZUluUGF0aDogKHBhdGgsIGtleSwgdmFsKSAtPlxuICAgIGRhdGEgPSBAbG9hZChwYXRoKVxuICAgIHVubGVzcyBkYXRhP1xuICAgICAgZGF0YSA9IHt9XG4gICAgZGF0YVtrZXldID0gdmFsXG4gICAgQHNhdmUocGF0aCxkYXRhKVxuICBsb2FkOiAoa2V5KSAtPlxuICAgIGlmIGxvY2FsU3RvcmFnZT9cbiAgICAgIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oQGZ1bGxLZXkoa2V5KSkpXG4gIGZ1bGxLZXk6IChrZXkpIC0+XG4gICAgJ0NvZGVXYXZlXycra2V5IiwiZXhwb3J0IHZhciBMb2NhbFN0b3JhZ2VFbmdpbmUgPSBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmUge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgc2F2ZShrZXksIHZhbCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKTtcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZGF0YSA9IHRoaXMubG9hZChwYXRoKTtcbiAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfVxuICAgIGRhdGFba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gdGhpcy5zYXZlKHBhdGgsIGRhdGEpO1xuICB9XG5cbiAgbG9hZChrZXkpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpKSk7XG4gICAgfVxuICB9XG5cbiAgZnVsbEtleShrZXkpIHtcbiAgICByZXR1cm4gJ0NvZGVXYXZlXycgKyBrZXk7XG4gIH1cblxufTtcbiIsIlxuZXhwb3J0IGNsYXNzIENvbnRleHRcbiAgY29uc3RydWN0b3I6IChAcGFyc2VyLCBAcGFyZW50KSAtPlxuICAgIEBjb250ZW50ID0gXCJcIlxuXG4gIG9uU3RhcnQ6IC0+XG4gICAgQHN0YXJ0QXQgPSBAcGFyc2VyLnBvc1xuXG4gIG9uQ2hhcjogKGNoYXIpLT5cblxuICBlbmQ6IC0+XG4gICAgQHBhcnNlci5zZXRDb250ZXh0KEBwYXJlbnQpXG5cbiAgb25FbmQ6IC0+XG5cbiAgdGVzdENvbnRleHQ6IChjb250ZXh0VHlwZSktPlxuICAgIGlmIGNvbnRleHRUeXBlLnRlc3QoQHBhcnNlci5jaGFyLCB0aGlzKVxuICAgICAgQHBhcnNlci5zZXRDb250ZXh0KG5ldyBjb250ZXh0VHlwZShAcGFyc2VyLHRoaXMpKVxuXG4gIEB0ZXN0OiAtPiBmYWxzZVxuIiwiZXhwb3J0IHZhciBDb250ZXh0ID0gY2xhc3MgQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBhcnNlciwgcGFyZW50KSB7XG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZXI7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5jb250ZW50ID0gXCJcIjtcbiAgfVxuXG4gIG9uU3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRBdCA9IHRoaXMucGFyc2VyLnBvcztcbiAgfVxuXG4gIG9uQ2hhcihjaGFyKSB7fVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2V0Q29udGV4dCh0aGlzLnBhcmVudCk7XG4gIH1cblxuICBvbkVuZCgpIHt9XG5cbiAgdGVzdENvbnRleHQoY29udGV4dFR5cGUpIHtcbiAgICBpZiAoY29udGV4dFR5cGUudGVzdCh0aGlzLnBhcnNlci5jaGFyLCB0aGlzKSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLnNldENvbnRleHQobmV3IGNvbnRleHRUeXBlKHRoaXMucGFyc2VyLCB0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRlc3QoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcblxuZXhwb3J0IGNsYXNzIEVzY2FwZUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0XG4gIG9uQ2hhcjogKGNoYXIpLT5cbiAgICBAcGFyZW50LmNvbnRlbnQgKz0gY2hhclxuICAgIEBlbmQoKVxuXG4gIEB0ZXN0OiAoY2hhciktPlxuICAgIGNoYXIgPT0gJ1xcXFwnIiwiaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5leHBvcnQgdmFyIEVzY2FwZUNvbnRleHQgPSBjbGFzcyBFc2NhcGVDb250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uQ2hhcihjaGFyKSB7XG4gICAgdGhpcy5wYXJlbnQuY29udGVudCArPSBjaGFyO1xuICAgIHJldHVybiB0aGlzLmVuZCgpO1xuICB9XG5cbiAgc3RhdGljIHRlc3QoY2hhcikge1xuICAgIHJldHVybiBjaGFyID09PSAnXFxcXCc7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBhcmFtQ29udGV4dCB9IGZyb20gJy4vUGFyYW1Db250ZXh0JztcblxuZXhwb3J0IGNsYXNzIE5hbWVkQ29udGV4dCBleHRlbmRzIFBhcmFtQ29udGV4dFxuICBvblN0YXJ0OiAoKS0+XG4gICAgQG5hbWUgPSBAcGFyZW50LmNvbnRlbnRcblxuICBvbkVuZDogLT5cbiAgICBAcGFyc2VyLm5hbWVkW0BuYW1lXSA9IEBjb250ZW50XG5cbiAgQHRlc3Q6IChjaGFyLHBhcmVudCktPlxuICAgIGNoYXIgPT0gJzonIGFuZCAoIXBhcmVudC5wYXJzZXIub3B0aW9ucy5hbGxvd2VkTmFtZWQ/IG9yIHBhcmVudC5jb250ZW50IGluIHBhcmVudC5wYXJzZXIub3B0aW9ucy5hbGxvd2VkTmFtZWQpXG4iLCJ2YXIgaW5kZXhPZiA9IFtdLmluZGV4T2Y7XG5cbmltcG9ydCB7XG4gIFBhcmFtQ29udGV4dFxufSBmcm9tICcuL1BhcmFtQ29udGV4dCc7XG5cbmV4cG9ydCB2YXIgTmFtZWRDb250ZXh0ID0gY2xhc3MgTmFtZWRDb250ZXh0IGV4dGVuZHMgUGFyYW1Db250ZXh0IHtcbiAgb25TdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5wYXJlbnQuY29udGVudDtcbiAgfVxuXG4gIG9uRW5kKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5uYW1lZFt0aGlzLm5hbWVdID0gdGhpcy5jb250ZW50O1xuICB9XG5cbiAgc3RhdGljIHRlc3QoY2hhciwgcGFyZW50KSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gY2hhciA9PT0gJzonICYmICgocGFyZW50LnBhcnNlci5vcHRpb25zLmFsbG93ZWROYW1lZCA9PSBudWxsKSB8fCAocmVmID0gcGFyZW50LmNvbnRlbnQsIGluZGV4T2YuY2FsbChwYXJlbnQucGFyc2VyLm9wdGlvbnMuYWxsb3dlZE5hbWVkLCByZWYpID49IDApKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBTdHJpbmdDb250ZXh0IH0gZnJvbSAnLi9TdHJpbmdDb250ZXh0JztcbmltcG9ydCB7IFZhcmlhYmxlQ29udGV4dCB9IGZyb20gJy4vVmFyaWFibGVDb250ZXh0JztcblxuZXhwb3J0IGNsYXNzIFBhcmFtQ29udGV4dCBleHRlbmRzIENvbnRleHRcbiAgb25DaGFyOiAoY2hhciktPlxuICAgIGlmIEB0ZXN0Q29udGV4dChTdHJpbmdDb250ZXh0KVxuICAgIGVsc2UgaWYgQHRlc3RDb250ZXh0KFBhcmFtQ29udGV4dC5uYW1lZClcbiAgICBlbHNlIGlmIEB0ZXN0Q29udGV4dChWYXJpYWJsZUNvbnRleHQpXG4gICAgZWxzZSBpZiBjaGFyID09ICcgJ1xuICAgICAgQHBhcnNlci5zZXRDb250ZXh0KG5ldyBQYXJhbUNvbnRleHQoQHBhcnNlcikpXG4gICAgZWxzZVxuICAgICAgQGNvbnRlbnQgKz0gY2hhclxuXG4gIG9uRW5kOiAtPlxuICAgIEBwYXJzZXIucGFyYW1zLnB1c2goQGNvbnRlbnQpIiwiaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdDb250ZXh0XG59IGZyb20gJy4vU3RyaW5nQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIFZhcmlhYmxlQ29udGV4dFxufSBmcm9tICcuL1ZhcmlhYmxlQ29udGV4dCc7XG5cbmV4cG9ydCB2YXIgUGFyYW1Db250ZXh0ID0gY2xhc3MgUGFyYW1Db250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uQ2hhcihjaGFyKSB7XG4gICAgaWYgKHRoaXMudGVzdENvbnRleHQoU3RyaW5nQ29udGV4dCkpIHtcblxuICAgIH0gZWxzZSBpZiAodGhpcy50ZXN0Q29udGV4dChQYXJhbUNvbnRleHQubmFtZWQpKSB7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoVmFyaWFibGVDb250ZXh0KSkge1xuXG4gICAgfSBlbHNlIGlmIChjaGFyID09PSAnICcpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlci5zZXRDb250ZXh0KG5ldyBQYXJhbUNvbnRleHQodGhpcy5wYXJzZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCArPSBjaGFyO1xuICAgIH1cbiAgfVxuXG4gIG9uRW5kKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5wYXJhbXMucHVzaCh0aGlzLmNvbnRlbnQpO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQYXJhbUNvbnRleHQgfSBmcm9tICcuL1BhcmFtQ29udGV4dCc7XG5pbXBvcnQgeyBOYW1lZENvbnRleHQgfSBmcm9tICcuL05hbWVkQ29udGV4dCc7XG5cblBhcmFtQ29udGV4dC5uYW1lZCA9IE5hbWVkQ29udGV4dFxuXG5leHBvcnQgY2xhc3MgUGFyYW1QYXJzZXJcbiAgY29uc3RydWN0b3I6IChAcGFyYW1TdHJpbmcsIEBvcHRpb25zPXt9KSAtPlxuICAgIEBwYXJzZSgpXG5cbiAgc2V0Q29udGV4dDogKGNvbnRleHQpLT5cbiAgICBvbGRDb250ZXh0ID0gQGNvbnRleHRcbiAgICBAY29udGV4dCA9IGNvbnRleHRcbiAgICBpZiBvbGRDb250ZXh0PyBhbmQgb2xkQ29udGV4dCAhPSBjb250ZXh0Py5wYXJlbnRcbiAgICAgIG9sZENvbnRleHQub25FbmQoKVxuICAgIGlmIGNvbnRleHQ/XG4gICAgICBjb250ZXh0Lm9uU3RhcnQoKVxuICAgIEBjb250ZXh0XG5cbiAgcGFyc2U6IC0+XG4gICAgQHBhcmFtcyA9IFtdXG4gICAgQG5hbWVkID0ge31cbiAgICBpZiBAcGFyYW1TdHJpbmcubGVuZ3RoXG4gICAgICBAc2V0Q29udGV4dChuZXcgUGFyYW1Db250ZXh0KHRoaXMpKVxuICAgICAgQHBvcyA9IDBcbiAgICAgIHdoaWxlIEBwb3MgPCBAcGFyYW1TdHJpbmcubGVuZ3RoXG4gICAgICAgIEBjaGFyID0gQHBhcmFtU3RyaW5nW0Bwb3NdXG4gICAgICAgIEBjb250ZXh0Lm9uQ2hhcihAY2hhcilcbiAgICAgICAgQHBvcysrXG4gICAgICBAc2V0Q29udGV4dChudWxsKVxuXG4gIHRha2U6KG5iKS0+XG4gICAgQHBhcmFtU3RyaW5nLnN1YnN0cmluZyhAcG9zLCBAcG9zICsgbmIpXG5cbiAgc2tpcDoobmI9MSktPlxuICAgIEBwb3MgKz0gbmJcblxuICAgICAgXG4iLCJpbXBvcnQge1xuICBQYXJhbUNvbnRleHRcbn0gZnJvbSAnLi9QYXJhbUNvbnRleHQnO1xuXG5pbXBvcnQge1xuICBOYW1lZENvbnRleHRcbn0gZnJvbSAnLi9OYW1lZENvbnRleHQnO1xuXG5QYXJhbUNvbnRleHQubmFtZWQgPSBOYW1lZENvbnRleHQ7XG5cbmV4cG9ydCB2YXIgUGFyYW1QYXJzZXIgPSBjbGFzcyBQYXJhbVBhcnNlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtU3RyaW5nLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnBhcmFtU3RyaW5nID0gcGFyYW1TdHJpbmc7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnBhcnNlKCk7XG4gIH1cblxuICBzZXRDb250ZXh0KGNvbnRleHQpIHtcbiAgICB2YXIgb2xkQ29udGV4dDtcbiAgICBvbGRDb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgaWYgKChvbGRDb250ZXh0ICE9IG51bGwpICYmIG9sZENvbnRleHQgIT09IChjb250ZXh0ICE9IG51bGwgPyBjb250ZXh0LnBhcmVudCA6IHZvaWQgMCkpIHtcbiAgICAgIG9sZENvbnRleHQub25FbmQoKTtcbiAgICB9XG4gICAgaWYgKGNvbnRleHQgIT0gbnVsbCkge1xuICAgICAgY29udGV4dC5vblN0YXJ0KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRleHQ7XG4gIH1cblxuICBwYXJzZSgpIHtcbiAgICB0aGlzLnBhcmFtcyA9IFtdO1xuICAgIHRoaXMubmFtZWQgPSB7fTtcbiAgICBpZiAodGhpcy5wYXJhbVN0cmluZy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0Q29udGV4dChuZXcgUGFyYW1Db250ZXh0KHRoaXMpKTtcbiAgICAgIHRoaXMucG9zID0gMDtcbiAgICAgIHdoaWxlICh0aGlzLnBvcyA8IHRoaXMucGFyYW1TdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY2hhciA9IHRoaXMucGFyYW1TdHJpbmdbdGhpcy5wb3NdO1xuICAgICAgICB0aGlzLmNvbnRleHQub25DaGFyKHRoaXMuY2hhcik7XG4gICAgICAgIHRoaXMucG9zKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5zZXRDb250ZXh0KG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIHRha2UobmIpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbVN0cmluZy5zdWJzdHJpbmcodGhpcy5wb3MsIHRoaXMucG9zICsgbmIpO1xuICB9XG5cbiAgc2tpcChuYiA9IDEpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKz0gbmI7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgRXNjYXBlQ29udGV4dCB9IGZyb20gJy4vRXNjYXBlQ29udGV4dCc7XG5pbXBvcnQgeyBWYXJpYWJsZUNvbnRleHQgfSBmcm9tICcuL1ZhcmlhYmxlQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdDb250ZXh0IGV4dGVuZHMgQ29udGV4dFxuICBvbkNoYXI6IChjaGFyKS0+XG4gICAgaWYgQHRlc3RDb250ZXh0KEVzY2FwZUNvbnRleHQpXG4gICAgZWxzZSBpZiBAdGVzdENvbnRleHQoVmFyaWFibGVDb250ZXh0KVxuICAgIGVsc2UgaWYgU3RyaW5nQ29udGV4dC5pc0RlbGltaXRlcihjaGFyKVxuICAgICAgQGVuZCgpXG4gICAgZWxzZVxuICAgICAgQGNvbnRlbnQgKz0gY2hhclxuXG4gIG9uRW5kOiAtPlxuICAgIEBwYXJlbnQuY29udGVudCArPSBAY29udGVudFxuXG4gIEB0ZXN0OiAoY2hhciktPlxuICAgIEBpc0RlbGltaXRlcihjaGFyKVxuXG4gIEBpc0RlbGltaXRlcjogIChjaGFyKS0+XG4gICAgY2hhciBpbiBbJ1wiJyxcIidcIl0iLCJpbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIEVzY2FwZUNvbnRleHRcbn0gZnJvbSAnLi9Fc2NhcGVDb250ZXh0JztcblxuaW1wb3J0IHtcbiAgVmFyaWFibGVDb250ZXh0XG59IGZyb20gJy4vVmFyaWFibGVDb250ZXh0JztcblxuZXhwb3J0IHZhciBTdHJpbmdDb250ZXh0ID0gY2xhc3MgU3RyaW5nQ29udGV4dCBleHRlbmRzIENvbnRleHQge1xuICBvbkNoYXIoY2hhcikge1xuICAgIGlmICh0aGlzLnRlc3RDb250ZXh0KEVzY2FwZUNvbnRleHQpKSB7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoVmFyaWFibGVDb250ZXh0KSkge1xuXG4gICAgfSBlbHNlIGlmIChTdHJpbmdDb250ZXh0LmlzRGVsaW1pdGVyKGNoYXIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCArPSBjaGFyO1xuICAgIH1cbiAgfVxuXG4gIG9uRW5kKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5jb250ZW50ICs9IHRoaXMuY29udGVudDtcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0KGNoYXIpIHtcbiAgICByZXR1cm4gdGhpcy5pc0RlbGltaXRlcihjaGFyKTtcbiAgfVxuXG4gIHN0YXRpYyBpc0RlbGltaXRlcihjaGFyKSB7XG4gICAgcmV0dXJuIGNoYXIgPT09ICdcIicgfHwgY2hhciA9PT0gXCInXCI7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgVmFyaWFibGVDb250ZXh0IGV4dGVuZHMgQ29udGV4dFxuICBvblN0YXJ0OiAoKS0+XG4gICAgQHBhcnNlci5za2lwKClcblxuICBvbkNoYXI6IChjaGFyKS0+XG4gICAgaWYgY2hhciA9PSAnfSdcbiAgICAgIEBlbmQoKVxuICAgIGVsc2VcbiAgICAgIEBjb250ZW50ICs9IGNoYXJcblxuICBvbkVuZDogLT5cbiAgICBAcGFyZW50LmNvbnRlbnQgKz0gQHBhcnNlci5vcHRpb25zLnZhcnM/W0Bjb250ZW50XSBvciAnJ1xuXG4gIEB0ZXN0OiAoY2hhcixwYXJlbnQpLT5cbiAgICBwYXJlbnQucGFyc2VyLnRha2UoMikgPT0gJyN7JyIsImltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuZXhwb3J0IHZhciBWYXJpYWJsZUNvbnRleHQgPSBjbGFzcyBWYXJpYWJsZUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25TdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2tpcCgpO1xuICB9XG5cbiAgb25DaGFyKGNoYXIpIHtcbiAgICBpZiAoY2hhciA9PT0gJ30nKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCArPSBjaGFyO1xuICAgIH1cbiAgfVxuXG4gIG9uRW5kKCkge1xuICAgIHZhciByZWY7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmNvbnRlbnQgKz0gKChyZWYgPSB0aGlzLnBhcnNlci5vcHRpb25zLnZhcnMpICE9IG51bGwgPyByZWZbdGhpcy5jb250ZW50XSA6IHZvaWQgMCkgfHwgJyc7XG4gIH1cblxuICBzdGF0aWMgdGVzdChjaGFyLCBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50LnBhcnNlci50YWtlKDIpID09PSAnI3snO1xuICB9XG5cbn07XG4iLCIvKiFcbiAqIGluZmxlY3Rpb25cbiAqIENvcHlyaWdodChjKSAyMDExIEJlbiBMaW4gPGJlbkBkcmVhbWVyc2xhYi5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBBIHBvcnQgb2YgaW5mbGVjdGlvbi1qcyB0byBub2RlLmpzIG1vZHVsZS5cbiAqL1xuXG4oIGZ1bmN0aW9uICggcm9vdCwgZmFjdG9yeSApe1xuICBpZiggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICl7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5ICk7XG4gIH1lbHNlIGlmKCB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfWVsc2V7XG4gICAgcm9vdC5pbmZsZWN0aW9uID0gZmFjdG9yeSgpO1xuICB9XG59KCB0aGlzLCBmdW5jdGlvbiAoKXtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoaXMgaXMgYSBsaXN0IG9mIG5vdW5zIHRoYXQgdXNlIHRoZSBzYW1lIGZvcm0gZm9yIGJvdGggc2luZ3VsYXIgYW5kIHBsdXJhbC5cbiAgICogICAgICAgICAgICAgIFRoaXMgbGlzdCBzaG91bGQgcmVtYWluIGVudGlyZWx5IGluIGxvd2VyIGNhc2UgdG8gY29ycmVjdGx5IG1hdGNoIFN0cmluZ3MuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgdW5jb3VudGFibGVfd29yZHMgPSBbXG4gICAgLy8gJ2FjY2VzcycsXG4gICAgJ2FjY29tbW9kYXRpb24nLFxuICAgICdhZHVsdGhvb2QnLFxuICAgICdhZHZlcnRpc2luZycsXG4gICAgJ2FkdmljZScsXG4gICAgJ2FnZ3Jlc3Npb24nLFxuICAgICdhaWQnLFxuICAgICdhaXInLFxuICAgICdhaXJjcmFmdCcsXG4gICAgJ2FsY29ob2wnLFxuICAgICdhbmdlcicsXG4gICAgJ2FwcGxhdXNlJyxcbiAgICAnYXJpdGhtZXRpYycsXG4gICAgLy8gJ2FydCcsXG4gICAgJ2Fzc2lzdGFuY2UnLFxuICAgICdhdGhsZXRpY3MnLFxuICAgIC8vICdhdHRlbnRpb24nLFxuXG4gICAgJ2JhY29uJyxcbiAgICAnYmFnZ2FnZScsXG4gICAgLy8gJ2JhbGxldCcsXG4gICAgLy8gJ2JlYXV0eScsXG4gICAgJ2JlZWYnLFxuICAgIC8vICdiZWVyJyxcbiAgICAvLyAnYmVoYXZpb3InLFxuICAgICdiaW9sb2d5JyxcbiAgICAvLyAnYmlsbGlhcmRzJyxcbiAgICAnYmxvb2QnLFxuICAgICdib3RhbnknLFxuICAgIC8vICdib3dlbHMnLFxuICAgICdicmVhZCcsXG4gICAgLy8gJ2J1c2luZXNzJyxcbiAgICAnYnV0dGVyJyxcblxuICAgICdjYXJib24nLFxuICAgICdjYXJkYm9hcmQnLFxuICAgICdjYXNoJyxcbiAgICAnY2hhbGsnLFxuICAgICdjaGFvcycsXG4gICAgJ2NoZXNzJyxcbiAgICAnY3Jvc3Nyb2FkcycsXG4gICAgJ2NvdW50cnlzaWRlJyxcblxuICAgIC8vICdkYW1hZ2UnLFxuICAgICdkYW5jaW5nJyxcbiAgICAvLyAnZGFuZ2VyJyxcbiAgICAnZGVlcicsXG4gICAgLy8gJ2RlbGlnaHQnLFxuICAgIC8vICdkZXNzZXJ0JyxcbiAgICAnZGlnbml0eScsXG4gICAgJ2RpcnQnLFxuICAgIC8vICdkaXN0cmlidXRpb24nLFxuICAgICdkdXN0JyxcblxuICAgICdlY29ub21pY3MnLFxuICAgICdlZHVjYXRpb24nLFxuICAgICdlbGVjdHJpY2l0eScsXG4gICAgLy8gJ2VtcGxveW1lbnQnLFxuICAgIC8vICdlbmVyZ3knLFxuICAgICdlbmdpbmVlcmluZycsXG4gICAgJ2Vuam95bWVudCcsXG4gICAgLy8gJ2VudGVydGFpbm1lbnQnLFxuICAgICdlbnZ5JyxcbiAgICAnZXF1aXBtZW50JyxcbiAgICAnZXRoaWNzJyxcbiAgICAnZXZpZGVuY2UnLFxuICAgICdldm9sdXRpb24nLFxuXG4gICAgLy8gJ2ZhaWx1cmUnLFxuICAgIC8vICdmYWl0aCcsXG4gICAgJ2ZhbWUnLFxuICAgICdmaWN0aW9uJyxcbiAgICAvLyAnZmlzaCcsXG4gICAgJ2Zsb3VyJyxcbiAgICAnZmx1JyxcbiAgICAnZm9vZCcsXG4gICAgLy8gJ2ZyZWVkb20nLFxuICAgIC8vICdmcnVpdCcsXG4gICAgJ2Z1ZWwnLFxuICAgICdmdW4nLFxuICAgIC8vICdmdW5lcmFsJyxcbiAgICAnZnVybml0dXJlJyxcblxuICAgICdnYWxsb3dzJyxcbiAgICAnZ2FyYmFnZScsXG4gICAgJ2dhcmxpYycsXG4gICAgLy8gJ2dhcycsXG4gICAgJ2dlbmV0aWNzJyxcbiAgICAvLyAnZ2xhc3MnLFxuICAgICdnb2xkJyxcbiAgICAnZ29sZicsXG4gICAgJ2dvc3NpcCcsXG4gICAgJ2dyYW1tYXInLFxuICAgIC8vICdncmFzcycsXG4gICAgJ2dyYXRpdHVkZScsXG4gICAgJ2dyaWVmJyxcbiAgICAvLyAnZ3JvdW5kJyxcbiAgICAnZ3VpbHQnLFxuICAgICdneW1uYXN0aWNzJyxcblxuICAgIC8vICdoYWlyJyxcbiAgICAnaGFwcGluZXNzJyxcbiAgICAnaGFyZHdhcmUnLFxuICAgICdoYXJtJyxcbiAgICAnaGF0ZScsXG4gICAgJ2hhdHJlZCcsXG4gICAgJ2hlYWx0aCcsXG4gICAgJ2hlYXQnLFxuICAgIC8vICdoZWlnaHQnLFxuICAgICdoZWxwJyxcbiAgICAnaG9tZXdvcmsnLFxuICAgICdob25lc3R5JyxcbiAgICAnaG9uZXknLFxuICAgICdob3NwaXRhbGl0eScsXG4gICAgJ2hvdXNld29yaycsXG4gICAgJ2h1bW91cicsXG4gICAgJ2h1bmdlcicsXG4gICAgJ2h5ZHJvZ2VuJyxcblxuICAgICdpY2UnLFxuICAgICdpbXBvcnRhbmNlJyxcbiAgICAnaW5mbGF0aW9uJyxcbiAgICAnaW5mb3JtYXRpb24nLFxuICAgIC8vICdpbmp1c3RpY2UnLFxuICAgICdpbm5vY2VuY2UnLFxuICAgIC8vICdpbnRlbGxpZ2VuY2UnLFxuICAgICdpcm9uJyxcbiAgICAnaXJvbnknLFxuXG4gICAgJ2phbScsXG4gICAgLy8gJ2plYWxvdXN5JyxcbiAgICAvLyAnamVsbHknLFxuICAgICdqZXdlbHJ5JyxcbiAgICAvLyAnam95JyxcbiAgICAnanVkbycsXG4gICAgLy8gJ2p1aWNlJyxcbiAgICAvLyAnanVzdGljZScsXG5cbiAgICAna2FyYXRlJyxcbiAgICAvLyAna2luZG5lc3MnLFxuICAgICdrbm93bGVkZ2UnLFxuXG4gICAgLy8gJ2xhYm91cicsXG4gICAgJ2xhY2snLFxuICAgIC8vICdsYW5kJyxcbiAgICAnbGF1Z2h0ZXInLFxuICAgICdsYXZhJyxcbiAgICAnbGVhdGhlcicsXG4gICAgJ2xlaXN1cmUnLFxuICAgICdsaWdodG5pbmcnLFxuICAgICdsaW5ndWluZScsXG4gICAgJ2xpbmd1aW5pJyxcbiAgICAnbGluZ3Vpc3RpY3MnLFxuICAgICdsaXRlcmF0dXJlJyxcbiAgICAnbGl0dGVyJyxcbiAgICAnbGl2ZXN0b2NrJyxcbiAgICAnbG9naWMnLFxuICAgICdsb25lbGluZXNzJyxcbiAgICAvLyAnbG92ZScsXG4gICAgJ2x1Y2snLFxuICAgICdsdWdnYWdlJyxcblxuICAgICdtYWNhcm9uaScsXG4gICAgJ21hY2hpbmVyeScsXG4gICAgJ21hZ2ljJyxcbiAgICAvLyAnbWFpbCcsXG4gICAgJ21hbmFnZW1lbnQnLFxuICAgICdtYW5raW5kJyxcbiAgICAnbWFyYmxlJyxcbiAgICAnbWF0aGVtYXRpY3MnLFxuICAgICdtYXlvbm5haXNlJyxcbiAgICAnbWVhc2xlcycsXG4gICAgLy8gJ21lYXQnLFxuICAgIC8vICdtZXRhbCcsXG4gICAgJ21ldGhhbmUnLFxuICAgICdtaWxrJyxcbiAgICAnbWludXMnLFxuICAgICdtb25leScsXG4gICAgLy8gJ21vb3NlJyxcbiAgICAnbXVkJyxcbiAgICAnbXVzaWMnLFxuICAgICdtdW1wcycsXG5cbiAgICAnbmF0dXJlJyxcbiAgICAnbmV3cycsXG4gICAgJ25pdHJvZ2VuJyxcbiAgICAnbm9uc2Vuc2UnLFxuICAgICdudXJ0dXJlJyxcbiAgICAnbnV0cml0aW9uJyxcblxuICAgICdvYmVkaWVuY2UnLFxuICAgICdvYmVzaXR5JyxcbiAgICAvLyAnb2lsJyxcbiAgICAnb3h5Z2VuJyxcblxuICAgIC8vICdwYXBlcicsXG4gICAgLy8gJ3Bhc3Npb24nLFxuICAgICdwYXN0YScsXG4gICAgJ3BhdGllbmNlJyxcbiAgICAvLyAncGVybWlzc2lvbicsXG4gICAgJ3BoeXNpY3MnLFxuICAgICdwb2V0cnknLFxuICAgICdwb2xsdXRpb24nLFxuICAgICdwb3ZlcnR5JyxcbiAgICAvLyAncG93ZXInLFxuICAgICdwcmlkZScsXG4gICAgLy8gJ3Byb2R1Y3Rpb24nLFxuICAgIC8vICdwcm9ncmVzcycsXG4gICAgLy8gJ3Byb251bmNpYXRpb24nLFxuICAgICdwc3ljaG9sb2d5JyxcbiAgICAncHVibGljaXR5JyxcbiAgICAncHVuY3R1YXRpb24nLFxuXG4gICAgLy8gJ3F1YWxpdHknLFxuICAgIC8vICdxdWFudGl0eScsXG4gICAgJ3F1YXJ0eicsXG5cbiAgICAncmFjaXNtJyxcbiAgICAvLyAncmFpbicsXG4gICAgLy8gJ3JlY3JlYXRpb24nLFxuICAgICdyZWxheGF0aW9uJyxcbiAgICAncmVsaWFiaWxpdHknLFxuICAgICdyZXNlYXJjaCcsXG4gICAgJ3Jlc3BlY3QnLFxuICAgICdyZXZlbmdlJyxcbiAgICAncmljZScsXG4gICAgJ3J1YmJpc2gnLFxuICAgICdydW0nLFxuXG4gICAgJ3NhZmV0eScsXG4gICAgLy8gJ3NhbGFkJyxcbiAgICAvLyAnc2FsdCcsXG4gICAgLy8gJ3NhbmQnLFxuICAgIC8vICdzYXRpcmUnLFxuICAgICdzY2VuZXJ5JyxcbiAgICAnc2VhZm9vZCcsXG4gICAgJ3NlYXNpZGUnLFxuICAgICdzZXJpZXMnLFxuICAgICdzaGFtZScsXG4gICAgJ3NoZWVwJyxcbiAgICAnc2hvcHBpbmcnLFxuICAgIC8vICdzaWxlbmNlJyxcbiAgICAnc2xlZXAnLFxuICAgIC8vICdzbGFuZydcbiAgICAnc21va2UnLFxuICAgICdzbW9raW5nJyxcbiAgICAnc25vdycsXG4gICAgJ3NvYXAnLFxuICAgICdzb2Z0d2FyZScsXG4gICAgJ3NvaWwnLFxuICAgIC8vICdzb3Jyb3cnLFxuICAgIC8vICdzb3VwJyxcbiAgICAnc3BhZ2hldHRpJyxcbiAgICAvLyAnc3BlZWQnLFxuICAgICdzcGVjaWVzJyxcbiAgICAvLyAnc3BlbGxpbmcnLFxuICAgIC8vICdzcG9ydCcsXG4gICAgJ3N0ZWFtJyxcbiAgICAvLyAnc3RyZW5ndGgnLFxuICAgICdzdHVmZicsXG4gICAgJ3N0dXBpZGl0eScsXG4gICAgLy8gJ3N1Y2Nlc3MnLFxuICAgIC8vICdzdWdhcicsXG4gICAgJ3N1bnNoaW5lJyxcbiAgICAnc3ltbWV0cnknLFxuXG4gICAgLy8gJ3RlYScsXG4gICAgJ3Rlbm5pcycsXG4gICAgJ3RoaXJzdCcsXG4gICAgJ3RodW5kZXInLFxuICAgICd0aW1iZXInLFxuICAgIC8vICd0aW1lJyxcbiAgICAvLyAndG9hc3QnLFxuICAgIC8vICd0b2xlcmFuY2UnLFxuICAgIC8vICd0cmFkZScsXG4gICAgJ3RyYWZmaWMnLFxuICAgICd0cmFuc3BvcnRhdGlvbicsXG4gICAgLy8gJ3RyYXZlbCcsXG4gICAgJ3RydXN0JyxcblxuICAgIC8vICd1bmRlcnN0YW5kaW5nJyxcbiAgICAndW5kZXJ3ZWFyJyxcbiAgICAndW5lbXBsb3ltZW50JyxcbiAgICAndW5pdHknLFxuICAgIC8vICd1c2FnZScsXG5cbiAgICAndmFsaWRpdHknLFxuICAgICd2ZWFsJyxcbiAgICAndmVnZXRhdGlvbicsXG4gICAgJ3ZlZ2V0YXJpYW5pc20nLFxuICAgICd2ZW5nZWFuY2UnLFxuICAgICd2aW9sZW5jZScsXG4gICAgLy8gJ3Zpc2lvbicsXG4gICAgJ3ZpdGFsaXR5JyxcblxuICAgICd3YXJtdGgnLFxuICAgIC8vICd3YXRlcicsXG4gICAgJ3dlYWx0aCcsXG4gICAgJ3dlYXRoZXInLFxuICAgIC8vICd3ZWlnaHQnLFxuICAgICd3ZWxmYXJlJyxcbiAgICAnd2hlYXQnLFxuICAgIC8vICd3aGlza2V5JyxcbiAgICAvLyAnd2lkdGgnLFxuICAgICd3aWxkbGlmZScsXG4gICAgLy8gJ3dpbmUnLFxuICAgICd3aXNkb20nLFxuICAgIC8vICd3b29kJyxcbiAgICAvLyAnd29vbCcsXG4gICAgLy8gJ3dvcmsnLFxuXG4gICAgLy8gJ3llYXN0JyxcbiAgICAneW9nYScsXG5cbiAgICAnemluYycsXG4gICAgJ3pvb2xvZ3knXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBydWxlcyB0cmFuc2xhdGUgZnJvbSB0aGUgc2luZ3VsYXIgZm9ybSBvZiBhIG5vdW4gdG8gaXRzIHBsdXJhbCBmb3JtLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICB2YXIgcmVnZXggPSB7XG4gICAgcGx1cmFsIDoge1xuICAgICAgbWVuICAgICAgIDogbmV3IFJlZ0V4cCggJ14obXx3b20pZW4kJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBwZW9wbGUgICAgOiBuZXcgUmVnRXhwKCAnKHBlKW9wbGUkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNoaWxkcmVuICA6IG5ldyBSZWdFeHAoICcoY2hpbGQpcmVuJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdGlhICAgICAgIDogbmV3IFJlZ0V4cCggJyhbdGldKWEkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhbmFseXNlcyAgOiBuZXcgUmVnRXhwKCAnKChhKW5hbHl8KGIpYXwoZClpYWdub3wocClhcmVudGhlfChwKXJvZ25vfChzKXlub3B8KHQpaGUpc2VzJCcsJ2dpJyApLFxuICAgICAgaGl2ZXMgICAgIDogbmV3IFJlZ0V4cCggJyhoaXx0aSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjdXJ2ZXMgICAgOiBuZXcgUmVnRXhwKCAnKGN1cnZlKXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGxydmVzICAgICA6IG5ldyBSZWdFeHAoICcoW2xyXSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYXZlcyAgICAgIDogbmV3IFJlZ0V4cCggJyhbYV0pdmVzJCcgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBmb3ZlcyAgICAgOiBuZXcgUmVnRXhwKCAnKFteZm9dKXZlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1vdmllcyAgICA6IG5ldyBSZWdFeHAoICcobSlvdmllcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWVpb3V5aWVzIDogbmV3IFJlZ0V4cCggJyhbXmFlaW91eV18cXUpaWVzJCcgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzZXJpZXMgICAgOiBuZXcgUmVnRXhwKCAnKHMpZXJpZXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHhlcyAgICAgICA6IG5ldyBSZWdFeHAoICcoeHxjaHxzc3xzaCllcyQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWljZSAgICAgIDogbmV3IFJlZ0V4cCggJyhbbXxsXSlpY2UkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBidXNlcyAgICAgOiBuZXcgUmVnRXhwKCAnKGJ1cyllcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9lcyAgICAgICA6IG5ldyBSZWdFeHAoICcobyllcyQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc2hvZXMgICAgIDogbmV3IFJlZ0V4cCggJyhzaG9lKXMkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjcmlzZXMgICAgOiBuZXcgUmVnRXhwKCAnKGNyaXN8YXh8dGVzdCllcyQnICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9jdG9waSAgICA6IG5ldyBSZWdFeHAoICcob2N0b3B8dmlyKWkkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWxpYXNlcyAgIDogbmV3IFJlZ0V4cCggJyhhbGlhc3xjYW52YXN8c3RhdHVzfGNhbXB1cyllcyQnLCAnZ2knICksXG4gICAgICBzdW1tb25zZXMgOiBuZXcgUmVnRXhwKCAnXihzdW1tb25zKWVzJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG94ZW4gICAgICA6IG5ldyBSZWdFeHAoICdeKG94KWVuJyAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWF0cmljZXMgIDogbmV3IFJlZ0V4cCggJyhtYXRyKWljZXMkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB2ZXJ0aWNlcyAgOiBuZXcgUmVnRXhwKCAnKHZlcnR8aW5kKWljZXMkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZlZXQgICAgICA6IG5ldyBSZWdFeHAoICdeZmVldCQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdGVldGggICAgIDogbmV3IFJlZ0V4cCggJ150ZWV0aCQnICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBnZWVzZSAgICAgOiBuZXcgUmVnRXhwKCAnXmdlZXNlJCcgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHF1aXp6ZXMgICA6IG5ldyBSZWdFeHAoICcocXVpeil6ZXMkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgd2hlcmVhc2VzIDogbmV3IFJlZ0V4cCggJ14od2hlcmVhcyllcyQnICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjcml0ZXJpYSAgOiBuZXcgUmVnRXhwKCAnXihjcml0ZXJpKWEkJyAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlbmVyYSAgICA6IG5ldyBSZWdFeHAoICdeZ2VuZXJhJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc3MgICAgICAgIDogbmV3IFJlZ0V4cCggJ3NzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzICAgICAgICAgOiBuZXcgUmVnRXhwKCAncyQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKVxuICAgIH0sXG5cbiAgICBzaW5ndWxhciA6IHtcbiAgICAgIG1hbiAgICAgICA6IG5ldyBSZWdFeHAoICdeKG18d29tKWFuJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHBlcnNvbiAgICA6IG5ldyBSZWdFeHAoICcocGUpcnNvbiQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNoaWxkICAgICA6IG5ldyBSZWdFeHAoICcoY2hpbGQpJCcgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG94ICAgICAgICA6IG5ldyBSZWdFeHAoICdeKG94KSQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGF4aXMgICAgICA6IG5ldyBSZWdFeHAoICcoYXh8dGVzdClpcyQnICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9jdG9wdXMgICA6IG5ldyBSZWdFeHAoICcob2N0b3B8dmlyKXVzJCcgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFsaWFzICAgICA6IG5ldyBSZWdFeHAoICcoYWxpYXN8c3RhdHVzfGNhbnZhc3xjYW1wdXMpJCcsICdnaScgKSxcbiAgICAgIHN1bW1vbnMgICA6IG5ldyBSZWdFeHAoICdeKHN1bW1vbnMpJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1cyAgICAgICA6IG5ldyBSZWdFeHAoICcoYnUpcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1ZmZhbG8gICA6IG5ldyBSZWdFeHAoICcoYnVmZmFsfHRvbWF0fHBvdGF0KW8kJyAgICAgICAsICdnaScgKSxcbiAgICAgIHRpdW0gICAgICA6IG5ldyBSZWdFeHAoICcoW3RpXSl1bSQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHNpcyAgICAgICA6IG5ldyBSZWdFeHAoICdzaXMkJyAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZmZSAgICAgICA6IG5ldyBSZWdFeHAoICcoPzooW15mXSlmZXwoW2xyXSlmKSQnICAgICAgICAsICdnaScgKSxcbiAgICAgIGhpdmUgICAgICA6IG5ldyBSZWdFeHAoICcoaGl8dGkpdmUkJyAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFlaW91eXkgICA6IG5ldyBSZWdFeHAoICcoW15hZWlvdXldfHF1KXkkJyAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHggICAgICAgICA6IG5ldyBSZWdFeHAoICcoeHxjaHxzc3xzaCkkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1hdHJpeCAgICA6IG5ldyBSZWdFeHAoICcobWF0cilpeCQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHZlcnRleCAgICA6IG5ldyBSZWdFeHAoICcodmVydHxpbmQpZXgkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1vdXNlICAgICA6IG5ldyBSZWdFeHAoICcoW218bF0pb3VzZSQnICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZvb3QgICAgICA6IG5ldyBSZWdFeHAoICdeZm9vdCQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHRvb3RoICAgICA6IG5ldyBSZWdFeHAoICdedG9vdGgkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdvb3NlICAgICA6IG5ldyBSZWdFeHAoICdeZ29vc2UkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHF1aXogICAgICA6IG5ldyBSZWdFeHAoICcocXVpeikkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHdoZXJlYXMgICA6IG5ldyBSZWdFeHAoICdeKHdoZXJlYXMpJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXRlcmlvbiA6IG5ldyBSZWdFeHAoICdeKGNyaXRlcmkpb24kJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlbnVzICAgICA6IG5ldyBSZWdFeHAoICdeZ2VudXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHMgICAgICAgICA6IG5ldyBSZWdFeHAoICdzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNvbW1vbiAgICA6IG5ldyBSZWdFeHAoICckJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKVxuICAgIH1cbiAgfTtcblxuICB2YXIgcGx1cmFsX3J1bGVzID0gW1xuXG4gICAgLy8gZG8gbm90IHJlcGxhY2UgaWYgaXRzIGFscmVhZHkgYSBwbHVyYWwgd29yZFxuICAgIFsgcmVnZXgucGx1cmFsLm1lbiAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnBlb3BsZSAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNoaWxkcmVuICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnRpYSAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFuYWx5c2VzICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmhpdmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmN1cnZlcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmxydmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZvdmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFlaW91eWllcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNlcmllcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1vdmllcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnhlcyAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1pY2UgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmJ1c2VzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9lcyAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNob2VzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXNlcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9jdG9waSAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFsaWFzZXMgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnN1bW1vbnNlcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm94ZW4gICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1hdHJpY2VzICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZlZXQgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnRlZXRoICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlZXNlICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnF1aXp6ZXMgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLndoZXJlYXNlcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXRlcmlhICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlbmVyYSAgICBdLFxuXG4gICAgLy8gb3JpZ2luYWwgcnVsZVxuICAgIFsgcmVnZXguc2luZ3VsYXIubWFuICAgICAgLCAnJDFlbicgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnBlcnNvbiAgICwgJyQxb3BsZScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmNoaWxkICAgICwgJyQxcmVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub3ggICAgICAgLCAnJDFlbicgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmF4aXMgICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5vY3RvcHVzICAsICckMWknIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hbGlhcyAgICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc3VtbW9ucyAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmJ1cyAgICAgICwgJyQxc2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVmZmFsbyAgLCAnJDFvZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50aXVtICAgICAsICckMWEnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zaXMgICAgICAsICdzZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mZmUgICAgICAsICckMSQydmVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuaGl2ZSAgICAgLCAnJDF2ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hZWlvdXl5ICAsICckMWllcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm1hdHJpeCAgICwgJyQxaWNlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnZlcnRleCAgICwgJyQxaWNlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnggICAgICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tb3VzZSAgICAsICckMWljZScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmZvb3QgICAgICwgJ2ZlZXQnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50b290aCAgICAsICd0ZWV0aCcgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmdvb3NlICAgICwgJ2dlZXNlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucXVpeiAgICAgLCAnJDF6ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci53aGVyZWFzICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY3JpdGVyaW9uLCAnJDFhJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ2VudXMgICAgLCAnZ2VuZXJhJyBdLFxuXG4gICAgWyByZWdleC5zaW5ndWxhci5zICAgICAsICdzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY29tbW9uLCAncycgXVxuICBdO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhlc2UgcnVsZXMgdHJhbnNsYXRlIGZyb20gdGhlIHBsdXJhbCBmb3JtIG9mIGEgbm91biB0byBpdHMgc2luZ3VsYXIgZm9ybS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBzaW5ndWxhcl9ydWxlcyA9IFtcblxuICAgIC8vIGRvIG5vdCByZXBsYWNlIGlmIGl0cyBhbHJlYWR5IGEgc2luZ3VsYXIgd29yZFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWFuICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucGVyc29uICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY2hpbGQgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub3ggICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYXhpcyAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub2N0b3B1cyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYWxpYXMgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc3VtbW9ucyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVzICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVmZmFsbyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudGl1bSAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc2lzICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZmZlICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuaGl2ZSAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYWVpb3V5eSBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIueCAgICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWF0cml4ICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubW91c2UgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZm9vdCAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudG9vdGggICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ29vc2UgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucXVpeiAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIud2hlcmVhcyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY3JpdGVyaW9uIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nZW51cyBdLFxuXG4gICAgLy8gb3JpZ2luYWwgcnVsZVxuICAgIFsgcmVnZXgucGx1cmFsLm1lbiAgICAgICwgJyQxYW4nIF0sXG4gICAgWyByZWdleC5wbHVyYWwucGVvcGxlICAgLCAnJDFyc29uJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNoaWxkcmVuICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlbmVyYSAgICwgJ2dlbnVzJ10sXG4gICAgWyByZWdleC5wbHVyYWwuY3JpdGVyaWEgLCAnJDFvbiddLFxuICAgIFsgcmVnZXgucGx1cmFsLnRpYSAgICAgICwgJyQxdW0nIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYW5hbHlzZXMgLCAnJDEkMnNpcycgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5oaXZlcyAgICAsICckMXZlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmN1cnZlcyAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmxydmVzICAgICwgJyQxZicgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hdmVzICAgICAsICckMXZlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZvdmVzICAgICwgJyQxZmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubW92aWVzICAgLCAnJDFvdmllJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFlaW91eWllcywgJyQxeScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zZXJpZXMgICAsICckMWVyaWVzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnhlcyAgICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1pY2UgICAgICwgJyQxb3VzZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5idXNlcyAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5vZXMgICAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zaG9lcyAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5jcmlzZXMgICAsICckMWlzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9jdG9waSAgICwgJyQxdXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWxpYXNlcyAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc3VtbW9uc2VzLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwub3hlbiAgICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWF0cmljZXMgLCAnJDFpeCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC52ZXJ0aWNlcyAsICckMWV4JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZlZXQgICAgICwgJ2Zvb3QnIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGVldGggICAgLCAndG9vdGgnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2Vlc2UgICAgLCAnZ29vc2UnIF0sXG4gICAgWyByZWdleC5wbHVyYWwucXVpenplcyAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwud2hlcmVhc2VzLCAnJDEnIF0sXG5cbiAgICBbIHJlZ2V4LnBsdXJhbC5zcywgJ3NzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnMgLCAnJyBdXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGlzIGlzIGEgbGlzdCBvZiB3b3JkcyB0aGF0IHNob3VsZCBub3QgYmUgY2FwaXRhbGl6ZWQgZm9yIHRpdGxlIGNhc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgbm9uX3RpdGxlY2FzZWRfd29yZHMgPSBbXG4gICAgJ2FuZCcsICdvcicsICdub3InLCAnYScsICdhbicsICd0aGUnLCAnc28nLCAnYnV0JywgJ3RvJywgJ29mJywgJ2F0JywnYnknLFxuICAgICdmcm9tJywgJ2ludG8nLCAnb24nLCAnb250bycsICdvZmYnLCAnb3V0JywgJ2luJywgJ292ZXInLCAnd2l0aCcsICdmb3InXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBhcmUgcmVndWxhciBleHByZXNzaW9ucyB1c2VkIGZvciBjb252ZXJ0aW5nIGJldHdlZW4gU3RyaW5nIGZvcm1hdHMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgaWRfc3VmZml4ICAgICAgICAgPSBuZXcgUmVnRXhwKCAnKF9pZHN8X2lkKSQnLCAnZycgKTtcbiAgdmFyIHVuZGVyYmFyICAgICAgICAgID0gbmV3IFJlZ0V4cCggJ18nLCAnZycgKTtcbiAgdmFyIHNwYWNlX29yX3VuZGVyYmFyID0gbmV3IFJlZ0V4cCggJ1tcXCBfXScsICdnJyApO1xuICB2YXIgdXBwZXJjYXNlICAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFtBLVpdKScsICdnJyApO1xuICB2YXIgdW5kZXJiYXJfcHJlZml4ICAgPSBuZXcgUmVnRXhwKCAnXl8nICk7XG5cbiAgdmFyIGluZmxlY3RvciA9IHtcblxuICAvKipcbiAgICogQSBoZWxwZXIgbWV0aG9kIHRoYXQgYXBwbGllcyBydWxlcyBiYXNlZCByZXBsYWNlbWVudCB0byBhIFN0cmluZy5cbiAgICogQHByaXZhdGVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgU3RyaW5nIHRvIG1vZGlmeSBhbmQgcmV0dXJuIGJhc2VkIG9uIHRoZSBwYXNzZWQgcnVsZXMuXG4gICAqIEBwYXJhbSB7QXJyYXk6IFtSZWdFeHAsIFN0cmluZ119IHJ1bGVzIFJlZ2V4cCB0byBtYXRjaCBwYWlyZWQgd2l0aCBTdHJpbmcgdG8gdXNlIGZvciByZXBsYWNlbWVudFxuICAgKiBAcGFyYW0ge0FycmF5OiBbU3RyaW5nXX0gc2tpcCBTdHJpbmdzIHRvIHNraXAgaWYgdGhleSBtYXRjaFxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3ZlcnJpZGUgU3RyaW5nIHRvIHJldHVybiBhcyB0aG91Z2ggdGhpcyBtZXRob2Qgc3VjY2VlZGVkICh1c2VkIHRvIGNvbmZvcm0gdG8gQVBJcylcbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIHBhc3NlZCBTdHJpbmcgbW9kaWZpZWQgYnkgcGFzc2VkIHJ1bGVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdGhpcy5fYXBwbHlfcnVsZXMoICdjb3dzJywgc2luZ3VsYXJfcnVsZXMgKTsgLy8gPT09ICdjb3cnXG4gICAqL1xuICAgIF9hcHBseV9ydWxlcyA6IGZ1bmN0aW9uICggc3RyLCBydWxlcywgc2tpcCwgb3ZlcnJpZGUgKXtcbiAgICAgIGlmKCBvdmVycmlkZSApe1xuICAgICAgICBzdHIgPSBvdmVycmlkZTtcbiAgICAgIH1lbHNle1xuICAgICAgICB2YXIgaWdub3JlID0gKCBpbmZsZWN0b3IuaW5kZXhPZiggc2tpcCwgc3RyLnRvTG93ZXJDYXNlKCkpID4gLTEgKTtcblxuICAgICAgICBpZiggIWlnbm9yZSApe1xuICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICB2YXIgaiA9IHJ1bGVzLmxlbmd0aDtcblxuICAgICAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgICAgICBpZiggc3RyLm1hdGNoKCBydWxlc1sgaSBdWyAwIF0pKXtcbiAgICAgICAgICAgICAgaWYoIHJ1bGVzWyBpIF1bIDEgXSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoIHJ1bGVzWyBpIF1bIDAgXSwgcnVsZXNbIGkgXVsgMSBdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBsZXRzIHVzIGRldGVjdCBpZiBhbiBBcnJheSBjb250YWlucyBhIGdpdmVuIGVsZW1lbnQuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyciBUaGUgc3ViamVjdCBhcnJheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gT2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgQXJyYXkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tX2luZGV4IFN0YXJ0cyBjaGVja2luZyBmcm9tIHRoaXMgcG9zaXRpb24gaW4gdGhlIEFycmF5LihvcHRpb25hbClcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyZV9mdW5jIEZ1bmN0aW9uIHVzZWQgdG8gY29tcGFyZSBBcnJheSBpdGVtIHZzIHBhc3NlZCBpdGVtLihvcHRpb25hbClcbiAgICogQHJldHVybnMge051bWJlcn0gUmV0dXJuIGluZGV4IHBvc2l0aW9uIGluIHRoZSBBcnJheSBvZiB0aGUgcGFzc2VkIGl0ZW0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmRleE9mKFsgJ2hpJywndGhlcmUnIF0sICdndXlzJyApOyAvLyA9PT0gLTFcbiAgICogICAgIGluZmxlY3Rpb24uaW5kZXhPZihbICdoaScsJ3RoZXJlJyBdLCAnaGknICk7IC8vID09PSAwXG4gICAqL1xuICAgIGluZGV4T2YgOiBmdW5jdGlvbiAoIGFyciwgaXRlbSwgZnJvbV9pbmRleCwgY29tcGFyZV9mdW5jICl7XG4gICAgICBpZiggIWZyb21faW5kZXggKXtcbiAgICAgICAgZnJvbV9pbmRleCA9IC0xO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgIHZhciBpICAgICA9IGZyb21faW5kZXg7XG4gICAgICB2YXIgaiAgICAgPSBhcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBpZiggYXJyWyBpIF0gID09PSBpdGVtIHx8IGNvbXBhcmVfZnVuYyAmJiBjb21wYXJlX2Z1bmMoIGFyclsgaSBdLCBpdGVtICkpe1xuICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBwbHVyYWxpemF0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwbHVyYWwgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFNpbmd1bGFyIEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHBsdXJhbCBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAncGVyc29uJyApOyAvLyA9PT0gJ3Blb3BsZSdcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAnb2N0b3B1cycgKTsgLy8gPT09ICdvY3RvcGknXG4gICAqICAgICBpbmZsZWN0aW9uLnBsdXJhbGl6ZSggJ0hhdCcgKTsgLy8gPT09ICdIYXRzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdwZXJzb24nLCAnZ3V5cycgKTsgLy8gPT09ICdndXlzJ1xuICAgKi9cbiAgICBwbHVyYWxpemUgOiBmdW5jdGlvbiAoIHN0ciwgcGx1cmFsICl7XG4gICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBwbHVyYWxfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBwbHVyYWwgKTtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHNpbmd1bGFyaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2luZ3VsYXIgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFBsdXJhbCBFbmdsaXNoIGxhbmd1YWdlIG5vdW5zIGFyZSByZXR1cm5lZCBpbiBzaW5ndWxhciBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uc2luZ3VsYXJpemUoICdwZW9wbGUnICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ29jdG9waScgKTsgLy8gPT09ICdvY3RvcHVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ0hhdHMnICk7IC8vID09PSAnSGF0J1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ2d1eXMnLCAncGVyc29uJyApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICovXG4gICAgc2luZ3VsYXJpemUgOiBmdW5jdGlvbiAoIHN0ciwgc2luZ3VsYXIgKXtcbiAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHNpbmd1bGFyX3J1bGVzLCB1bmNvdW50YWJsZV93b3Jkcywgc2luZ3VsYXIgKTtcbiAgICB9LFxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBwbHVyYWxpemUgb3Igc2luZ3VsYXJsaXplIGEgU3RyaW5nIGFwcHJvcHJpYXRlbHkgYmFzZWQgb24gYW4gaW50ZWdlciB2YWx1ZVxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IFRoZSBudW1iZXIgdG8gYmFzZSBwbHVyYWxpemF0aW9uIG9mZiBvZi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpbmd1bGFyIE92ZXJyaWRlcyBub3JtYWwgb3V0cHV0IHdpdGggc2FpZCBTdHJpbmcuKG9wdGlvbmFsKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGx1cmFsIE92ZXJyaWRlcyBub3JtYWwgb3V0cHV0IHdpdGggc2FpZCBTdHJpbmcuKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBFbmdsaXNoIGxhbmd1YWdlIG5vdW5zIGFyZSByZXR1cm5lZCBpbiB0aGUgcGx1cmFsIG9yIHNpbmd1bGFyIGZvcm0gYmFzZWQgb24gdGhlIGNvdW50LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ3Blb3BsZScgMSApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ29jdG9waScgMSApOyAvLyA9PT0gJ29jdG9wdXMnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdIYXRzJyAxICk7IC8vID09PSAnSGF0J1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnZ3V5cycsIDEgLCAncGVyc29uJyApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ3BlcnNvbicsIDIgKTsgLy8gPT09ICdwZW9wbGUnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdvY3RvcHVzJywgMiApOyAvLyA9PT0gJ29jdG9waSdcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ0hhdCcsIDIgKTsgLy8gPT09ICdIYXRzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVyc29uJywgMiwgbnVsbCwgJ2d1eXMnICk7IC8vID09PSAnZ3V5cydcbiAgICovXG4gICAgaW5mbGVjdCA6IGZ1bmN0aW9uICggc3RyLCBjb3VudCwgc2luZ3VsYXIsIHBsdXJhbCApe1xuICAgICAgY291bnQgPSBwYXJzZUludCggY291bnQsIDEwICk7XG5cbiAgICAgIGlmKCBpc05hTiggY291bnQgKSkgcmV0dXJuIHN0cjtcblxuICAgICAgaWYoIGNvdW50ID09PSAwIHx8IGNvdW50ID4gMSApe1xuICAgICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBwbHVyYWxfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBwbHVyYWwgKTtcbiAgICAgIH1lbHNle1xuICAgICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBzaW5ndWxhcl9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHNpbmd1bGFyICk7XG4gICAgICB9XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBjYW1lbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBsb3dfZmlyc3RfbGV0dGVyIERlZmF1bHQgaXMgdG8gY2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSByZXN1bHRzLihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCBsb3dlcmNhc2UgaXQuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IExvd2VyIGNhc2UgdW5kZXJzY29yZWQgd29yZHMgd2lsbCBiZSByZXR1cm5lZCBpbiBjYW1lbCBjYXNlLlxuICAgKiAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxseSAnLycgaXMgdHJhbnNsYXRlZCB0byAnOjonXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5jYW1lbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlUHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uY2FtZWxpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZVByb3BlcnRpZXMnXG4gICAqL1xuICAgIGNhbWVsaXplIDogZnVuY3Rpb24gKCBzdHIsIGxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgIHZhciBzdHJfcGF0aCA9IHN0ci5zcGxpdCggJy8nICk7XG4gICAgICB2YXIgaSAgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgID0gc3RyX3BhdGgubGVuZ3RoO1xuICAgICAgdmFyIHN0cl9hcnIsIGluaXRfeCwgaywgbCwgZmlyc3Q7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIHN0cl9hcnIgPSBzdHJfcGF0aFsgaSBdLnNwbGl0KCAnXycgKTtcbiAgICAgICAgayAgICAgICA9IDA7XG4gICAgICAgIGwgICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcblxuICAgICAgICBmb3IoIDsgayA8IGw7IGsrKyApe1xuICAgICAgICAgIGlmKCBrICE9PSAwICl7XG4gICAgICAgICAgICBzdHJfYXJyWyBrIF0gPSBzdHJfYXJyWyBrIF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmaXJzdCA9IHN0cl9hcnJbIGsgXS5jaGFyQXQoIDAgKTtcbiAgICAgICAgICBmaXJzdCA9IGxvd19maXJzdF9sZXR0ZXIgJiYgaSA9PT0gMCAmJiBrID09PSAwXG4gICAgICAgICAgICA/IGZpcnN0LnRvTG93ZXJDYXNlKCkgOiBmaXJzdC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgIHN0cl9hcnJbIGsgXSA9IGZpcnN0ICsgc3RyX2FyclsgayBdLnN1YnN0cmluZyggMSApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyX3BhdGhbIGkgXSA9IHN0cl9hcnIuam9pbiggJycgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9wYXRoLmpvaW4oICc6OicgKTtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHVuZGVyc2NvcmUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGxfdXBwZXJfY2FzZSBEZWZhdWx0IGlzIHRvIGxvd2VyY2FzZSBhbmQgYWRkIHVuZGVyc2NvcmUgcHJlZml4LihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCByZXR1cm4gYXMgZW50ZXJlZC5cbiAgICogQHJldHVybnMge1N0cmluZ30gQ2FtZWwgY2FzZWQgd29yZHMgYXJlIHJldHVybmVkIGFzIGxvd2VyIGNhc2VkIGFuZCB1bmRlcnNjb3JlZC5cbiAgICogICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsbHkgJzo6JyBpcyB0cmFuc2xhdGVkIHRvICcvJy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdNZXNzYWdlUHJvcGVydGllcycgKTsgLy8gPT09ICdtZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdtZXNzYWdlUHJvcGVydGllcycgKTsgLy8gPT09ICdtZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdNUCcsIHRydWUgKTsgLy8gPT09ICdNUCdcbiAgICovXG4gICAgdW5kZXJzY29yZSA6IGZ1bmN0aW9uICggc3RyLCBhbGxfdXBwZXJfY2FzZSApe1xuICAgICAgaWYoIGFsbF91cHBlcl9jYXNlICYmIHN0ciA9PT0gc3RyLnRvVXBwZXJDYXNlKCkpIHJldHVybiBzdHI7XG5cbiAgICAgIHZhciBzdHJfcGF0aCA9IHN0ci5zcGxpdCggJzo6JyApO1xuICAgICAgdmFyIGkgICAgICAgID0gMDtcbiAgICAgIHZhciBqICAgICAgICA9IHN0cl9wYXRoLmxlbmd0aDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgc3RyX3BhdGhbIGkgXSA9IHN0cl9wYXRoWyBpIF0ucmVwbGFjZSggdXBwZXJjYXNlLCAnXyQxJyApO1xuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX3BhdGhbIGkgXS5yZXBsYWNlKCB1bmRlcmJhcl9wcmVmaXgsICcnICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJfcGF0aC5qb2luKCAnLycgKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgaHVtYW5pemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBsb3dfZmlyc3RfbGV0dGVyIERlZmF1bHQgaXMgdG8gY2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSByZXN1bHRzLihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCBsb3dlcmNhc2UgaXQuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IExvd2VyIGNhc2UgdW5kZXJzY29yZWQgd29yZHMgd2lsbCBiZSByZXR1cm5lZCBpbiBodW1hbml6ZWQgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmh1bWFuaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UgcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uaHVtYW5pemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBodW1hbml6ZSA6IGZ1bmN0aW9uICggc3RyLCBsb3dfZmlyc3RfbGV0dGVyICl7XG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCBpZF9zdWZmaXgsICcnICk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSggdW5kZXJiYXIsICcgJyApO1xuXG4gICAgICBpZiggIWxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgICAgc3RyID0gaW5mbGVjdG9yLmNhcGl0YWxpemUoIHN0ciApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgY2FwaXRhbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gQWxsIGNoYXJhY3RlcnMgd2lsbCBiZSBsb3dlciBjYXNlIGFuZCB0aGUgZmlyc3Qgd2lsbCBiZSB1cHBlci5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNhcGl0YWxpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZV9wcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5jYXBpdGFsaXplKCAnbWVzc2FnZSBwcm9wZXJ0aWVzJywgdHJ1ZSApOyAvLyA9PT0gJ01lc3NhZ2UgcHJvcGVydGllcydcbiAgICovXG4gICAgY2FwaXRhbGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcblxuICAgICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZyggMSApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHJlcGxhY2VzIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzIGluIHRoZSBzdHJpbmcuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXBsYWNlcyBhbGwgc3BhY2VzIG9yIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uZGFzaGVyaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2UtcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uZGFzaGVyaXplKCAnTWVzc2FnZSBQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UtUHJvcGVydGllcydcbiAgICovXG4gICAgZGFzaGVyaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSggc3BhY2Vfb3JfdW5kZXJiYXIsICctJyApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGl0bGVpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gQ2FwaXRhbGl6ZXMgd29yZHMgYXMgeW91IHdvdWxkIGZvciBhIGJvb2sgdGl0bGUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50aXRsZWl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlIFByb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnRpdGxlaXplKCAnbWVzc2FnZSBwcm9wZXJ0aWVzIHRvIGtlZXAnICk7IC8vID09PSAnTWVzc2FnZSBQcm9wZXJ0aWVzIHRvIEtlZXAnXG4gICAqL1xuICAgIHRpdGxlaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciAgICAgICAgID0gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSggdW5kZXJiYXIsICcgJyApO1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICcgJyApO1xuICAgICAgdmFyIGkgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcbiAgICAgIHZhciBkLCBrLCBsO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBkID0gc3RyX2FyclsgaSBdLnNwbGl0KCAnLScgKTtcbiAgICAgICAgayA9IDA7XG4gICAgICAgIGwgPSBkLmxlbmd0aDtcblxuICAgICAgICBmb3IoIDsgayA8IGw7IGsrKyl7XG4gICAgICAgICAgaWYoIGluZmxlY3Rvci5pbmRleE9mKCBub25fdGl0bGVjYXNlZF93b3JkcywgZFsgayBdLnRvTG93ZXJDYXNlKCkpIDwgMCApe1xuICAgICAgICAgICAgZFsgayBdID0gaW5mbGVjdG9yLmNhcGl0YWxpemUoIGRbIGsgXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RyX2FyclsgaSBdID0gZC5qb2luKCAnLScgKTtcbiAgICAgIH1cblxuICAgICAgc3RyID0gc3RyX2Fyci5qb2luKCAnICcgKTtcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZyggMSApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgZGVtb2R1bGl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZW1vdmVzIG1vZHVsZSBuYW1lcyBsZWF2aW5nIG9ubHkgY2xhc3MgbmFtZXMuKFJ1Ynkgc3R5bGUpXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5kZW1vZHVsaXplKCAnTWVzc2FnZTo6QnVzOjpQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ1Byb3BlcnRpZXMnXG4gICAqL1xuICAgIGRlbW9kdWxpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICc6OicgKTtcblxuICAgICAgcmV0dXJuIHN0cl9hcnJbIHN0cl9hcnIubGVuZ3RoIC0gMSBdO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGFibGVpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIGNhbWVsIGNhc2VkIHdvcmRzIGludG8gdGhlaXIgdW5kZXJzY29yZWQgcGx1cmFsIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50YWJsZWl6ZSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICB0YWJsZWl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IudW5kZXJzY29yZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IucGx1cmFsaXplKCBzdHIgKTtcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNsYXNzaWZpY2F0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFVuZGVyc2NvcmVkIHBsdXJhbCBub3VucyBiZWNvbWUgdGhlIGNhbWVsIGNhc2VkIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5jbGFzc2lmeSggJ21lc3NhZ2VfYnVzX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZUJ1c1Byb3BlcnR5J1xuICAgKi9cbiAgICBjbGFzc2lmeSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IuY2FtZWxpemUoIHN0ciApO1xuICAgICAgc3RyID0gaW5mbGVjdG9yLnNpbmd1bGFyaXplKCBzdHIgKTtcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGZvcmVpZ24ga2V5IHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZHJvcF9pZF91YmFyIERlZmF1bHQgaXMgdG8gc2VwZXJhdGUgaWQgd2l0aCBhbiB1bmRlcmJhciBhdCB0aGUgZW5kIG9mIHRoZSBjbGFzcyBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW91IGNhbiBwYXNzIHRydWUgdG8gc2tpcCBpdC4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFVuZGVyc2NvcmVkIHBsdXJhbCBub3VucyBiZWNvbWUgdGhlIGNhbWVsIGNhc2VkIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5mb3JlaWduX2tleSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0eV9pZCdcbiAgICogICAgIGluZmxlY3Rpb24uZm9yZWlnbl9rZXkoICdNZXNzYWdlQnVzUHJvcGVydHknLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZV9idXNfcHJvcGVydHlpZCdcbiAgICovXG4gICAgZm9yZWlnbl9rZXkgOiBmdW5jdGlvbiAoIHN0ciwgZHJvcF9pZF91YmFyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IuZGVtb2R1bGl6ZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IudW5kZXJzY29yZSggc3RyICkgKyAoKCBkcm9wX2lkX3ViYXIgKSA/ICggJycgKSA6ICggJ18nICkpICsgJ2lkJztcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIG9yZGluYWxpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIGFsbCBmb3VuZCBudW1iZXJzIHRoZWlyIHNlcXVlbmNlIGxpa2UgJzIybmQnLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24ub3JkaW5hbGl6ZSggJ3RoZSAxIHBpdGNoJyApOyAvLyA9PT0gJ3RoZSAxc3QgcGl0Y2gnXG4gICAqL1xuICAgIG9yZGluYWxpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICcgJyApO1xuICAgICAgdmFyIGkgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgdmFyIGsgPSBwYXJzZUludCggc3RyX2FyclsgaSBdLCAxMCApO1xuXG4gICAgICAgIGlmKCAhaXNOYU4oIGsgKSl7XG4gICAgICAgICAgdmFyIGx0ZCA9IHN0cl9hcnJbIGkgXS5zdWJzdHJpbmcoIHN0cl9hcnJbIGkgXS5sZW5ndGggLSAyICk7XG4gICAgICAgICAgdmFyIGxkICA9IHN0cl9hcnJbIGkgXS5zdWJzdHJpbmcoIHN0cl9hcnJbIGkgXS5sZW5ndGggLSAxICk7XG4gICAgICAgICAgdmFyIHN1ZiA9ICd0aCc7XG5cbiAgICAgICAgICBpZiggbHRkICE9ICcxMScgJiYgbHRkICE9ICcxMicgJiYgbHRkICE9ICcxMycgKXtcbiAgICAgICAgICAgIGlmKCBsZCA9PT0gJzEnICl7XG4gICAgICAgICAgICAgIHN1ZiA9ICdzdCc7XG4gICAgICAgICAgICB9ZWxzZSBpZiggbGQgPT09ICcyJyApe1xuICAgICAgICAgICAgICBzdWYgPSAnbmQnO1xuICAgICAgICAgICAgfWVsc2UgaWYoIGxkID09PSAnMycgKXtcbiAgICAgICAgICAgICAgc3VmID0gJ3JkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdHJfYXJyWyBpIF0gKz0gc3VmO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJfYXJyLmpvaW4oICcgJyApO1xuICAgIH0sXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gcGVyZm9ybXMgbXVsdGlwbGUgaW5mbGVjdGlvbiBtZXRob2RzIG9uIGEgc3RyaW5nXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnIgQW4gYXJyYXkgb2YgaW5mbGVjdGlvbiBtZXRob2RzLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24udHJhbnNmb3JtKCAnYWxsIGpvYicsIFsgJ3BsdXJhbGl6ZScsICdjYXBpdGFsaXplJywgJ2Rhc2hlcml6ZScgXSk7IC8vID09PSAnQWxsLWpvYnMnXG4gICAqL1xuICAgIHRyYW5zZm9ybSA6IGZ1bmN0aW9uICggc3RyLCBhcnIgKXtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHZhciBqID0gYXJyLmxlbmd0aDtcblxuICAgICAgZm9yKCA7aSA8IGo7IGkrKyApe1xuICAgICAgICB2YXIgbWV0aG9kID0gYXJyWyBpIF07XG5cbiAgICAgICAgaWYoIGluZmxlY3Rvci5oYXNPd25Qcm9wZXJ0eSggbWV0aG9kICkpe1xuICAgICAgICAgIHN0ciA9IGluZmxlY3RvclsgbWV0aG9kIF0oIHN0ciApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuICBpbmZsZWN0b3IudmVyc2lvbiA9ICcxLjEyLjAnO1xuXG4gIHJldHVybiBpbmZsZWN0b3I7XG59KSk7XG4iXX0=
