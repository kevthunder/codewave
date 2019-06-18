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

},{"./helpers/ArrayHelper":28,"./helpers/StringHelper":33,"./positioning/Pair":34}],2:[function(require,module,exports){
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

},{"./helpers/OptionalPromise":31,"./positioning/Pos":36,"./positioning/PosCollection":37,"./positioning/Replacement":38}],3:[function(require,module,exports){
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

},{"./Command":6,"./Context":7,"./helpers/NamespaceHelper":30}],4:[function(require,module,exports){
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

},{"./Codewave":5,"./Context":7,"./TextParser":16,"./helpers/OptionalPromise":31,"./helpers/StringHelper":33}],5:[function(require,module,exports){
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

},{"./ClosingPromp":2,"./Command":6,"./Context":7,"./Logger":10,"./PositionedCmdInstance":12,"./Process":13,"./TextParser":16,"./helpers/StringHelper":33,"./positioning/PosCollection":37}],6:[function(require,module,exports){
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

},{"./Context":7,"./Storage":14,"./helpers/NamespaceHelper":30}],7:[function(require,module,exports){
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

},{"./CmdFinder":3,"./CmdInstance":4,"./helpers/ArrayHelper":28}],8:[function(require,module,exports){
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

},{"./helpers/OptionalPromise":31,"./positioning/Pos":36,"./positioning/StrPos":40}],10:[function(require,module,exports){
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

},{"./BoxHelper":1,"./CmdInstance":4,"./Command":6,"./helpers/NamespaceHelper":30,"./helpers/OptionalPromise":31,"./helpers/StringHelper":33,"./positioning/Pos":36,"./positioning/Replacement":38,"./positioning/StrPos":40,"./stringParsers/ParamParser":48}],13:[function(require,module,exports){
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

},{"./TextParser":16,"./positioning/Pos":36}],16:[function(require,module,exports){
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

},{"./Editor":9,"./positioning/Pos":36}],17:[function(require,module,exports){
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

var _Pos = require("./positioning/Pos");

var _WrappedPos = require("./positioning/WrappedPos");

var _LocalStorageEngine = require("./storageEngines/LocalStorageEngine");

_Pos.Pos.wrapClass = _WrappedPos.WrappedPos;
_Codewave.Codewave.instances = [];
_Command.Command.providers = [new _CoreCommandProvider.CoreCommandProvider(), new _JsCommandProvider.JsCommandProvider(), new _PhpCommandProvider.PhpCommandProvider(), new _HtmlCommandProvider.HtmlCommandProvider(), new _FileCommandProvider.FileCommandProvider()];

if (typeof localStorage !== "undefined" && localStorage !== null) {
  _Command.Command.storage = new _LocalStorageEngine.LocalStorageEngine();
}

},{"./Codewave":5,"./Command":6,"./cmds/CoreCommandProvider":18,"./cmds/FileCommandProvider":19,"./cmds/HtmlCommandProvider":20,"./cmds/JsCommandProvider":21,"./cmds/PhpCommandProvider":22,"./positioning/Pos":36,"./positioning/WrappedPos":41,"./storageEngines/LocalStorageEngine":43}],18:[function(require,module,exports){
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

},{"../BoxHelper":1,"../Command":6,"../EditCmdProp":8,"../detectors/AlwaysEnabled":23,"../detectors/LangDetector":25,"../helpers/PathHelper":32,"../helpers/StringHelper":33,"../positioning/Replacement":38,"emmet":"emmet"}],19:[function(require,module,exports){
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

},{"../BoxHelper":1,"../Command":6,"../EditCmdProp":8,"../helpers/PathHelper":32,"../helpers/StringHelper":33,"../positioning/Replacement":38}],20:[function(require,module,exports){
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

},{"../Command":6,"../detectors/PairDetector":26,"../helpers/StringHelper":33}],23:[function(require,module,exports){
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

},{"./Detector":24}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"./Detector":24}],26:[function(require,module,exports){
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

},{"../positioning/Pair":34,"./Detector":24}],27:[function(require,module,exports){
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

},{"./TextAreaEditor":15,"./bootstrap":17}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"../positioning/Size":39}],34:[function(require,module,exports){
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

},{"../helpers/StringHelper":33,"./PairMatch":35,"./Pos":36}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{"../helpers/CommonHelper":29,"./Replacement":38,"./Wrapping":42}],38:[function(require,module,exports){
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

},{"../OptionObject":11,"../helpers/CommonHelper":29,"../helpers/StringHelper":33,"./Pos":36}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{"./Pos":36}],42:[function(require,module,exports){
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

},{"./Replacement":38}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
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

},{"./Context":44}],46:[function(require,module,exports){
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

},{"./ParamContext":47}],47:[function(require,module,exports){
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

},{"./Context":44,"./StringContext":49,"./VariableContext":50}],48:[function(require,module,exports){
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

},{"./NamedContext":46,"./ParamContext":47}],49:[function(require,module,exports){
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

},{"./Context":44,"./EscapeContext":45,"./VariableContext":50}],50:[function(require,module,exports){
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

},{"./Context":44}]},{},[27])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvQm94SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9Cb3hIZWxwZXIuanMiLCIuLi9zcmMvQ2xvc2luZ1Byb21wLmNvZmZlZSIsIi4uL3NyYy9DbG9zaW5nUHJvbXAuanMiLCIuLi9zcmMvQ21kRmluZGVyLmNvZmZlZSIsIi4uL3NyYy9DbWRGaW5kZXIuanMiLCIuLi9zcmMvQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL0NtZEluc3RhbmNlLmpzIiwiLi4vc3JjL0NvZGV3YXZlLmNvZmZlZSIsIi4uL3NyYy9Db2Rld2F2ZS5qcyIsIi4uL3NyYy9Db21tYW5kLmNvZmZlZSIsIi4uL3NyYy9Db21tYW5kLmpzIiwiLi4vc3JjL0NvbnRleHQuY29mZmVlIiwiLi4vc3JjL0NvbnRleHQuanMiLCIuLi9zcmMvRWRpdENtZFByb3AuY29mZmVlIiwiLi4vc3JjL0VkaXRDbWRQcm9wLmpzIiwiLi4vc3JjL0VkaXRvci5jb2ZmZWUiLCIuLi9zcmMvRWRpdG9yLmpzIiwiLi4vc3JjL0xvZ2dlci5jb2ZmZWUiLCIuLi9zcmMvTG9nZ2VyLmpzIiwiLi4vc3JjL09wdGlvbk9iamVjdC5jb2ZmZWUiLCIuLi9zcmMvT3B0aW9uT2JqZWN0LmpzIiwiLi4vc3JjL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5jb2ZmZWUiLCIuLi9zcmMvUG9zaXRpb25lZENtZEluc3RhbmNlLmpzIiwiLi4vc3JjL1Byb2Nlc3MuY29mZmVlIiwiLi4vc3JjL1N0b3JhZ2UuY29mZmVlIiwiLi4vc3JjL1N0b3JhZ2UuanMiLCIuLi9zcmMvVGV4dEFyZWFFZGl0b3IuY29mZmVlIiwiLi4vc3JjL1RleHRBcmVhRWRpdG9yLmpzIiwiLi4vc3JjL1RleHRQYXJzZXIuY29mZmVlIiwiLi4vc3JjL1RleHRQYXJzZXIuanMiLCIuLi9zcmMvYm9vdHN0cmFwLmNvZmZlZSIsIi4uL3NyYy9ib290c3RyYXAuanMiLCIuLi9zcmMvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmNvZmZlZSIsIi4uL3NyYy9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9GaWxlQ29tbWFuZFByb3ZpZGVyLmNvZmZlZSIsIi4uL3NyYy9jbWRzL0ZpbGVDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyLmNvZmZlZSIsIi4uL3NyYy9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5qcyIsIi4uL3NyYy9jbWRzL1BocENvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9QaHBDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvZGV0ZWN0b3JzL0Fsd2F5c0VuYWJsZWQuY29mZmVlIiwiLi4vc3JjL2RldGVjdG9ycy9BbHdheXNFbmFibGVkLmpzIiwiLi4vc3JjL2RldGVjdG9ycy9EZXRlY3Rvci5jb2ZmZWUiLCIuLi9zcmMvZGV0ZWN0b3JzL0RldGVjdG9yLmpzIiwiLi4vc3JjL2RldGVjdG9ycy9MYW5nRGV0ZWN0b3IuY29mZmVlIiwiLi4vc3JjL2RldGVjdG9ycy9MYW5nRGV0ZWN0b3IuanMiLCIuLi9zcmMvZGV0ZWN0b3JzL1BhaXJEZXRlY3Rvci5jb2ZmZWUiLCIuLi9zcmMvZGV0ZWN0b3JzL1BhaXJEZXRlY3Rvci5qcyIsIi4uL3NyYy9lbnRyeS5jb2ZmZWUiLCIuLi9zcmMvZW50cnkuanMiLCIuLi9zcmMvaGVscGVycy9BcnJheUhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9BcnJheUhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL0NvbW1vbkhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9Db21tb25IZWxwZXIuanMiLCIuLi9zcmMvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZS5qcyIsIi4uL3NyYy9oZWxwZXJzL1BhdGhIZWxwZXIuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvUGF0aEhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL1N0cmluZ0hlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9TdHJpbmdIZWxwZXIuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpci5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpci5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyTWF0Y2guY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1BhaXJNYXRjaC5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9Qb3MuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvcy5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9SZXBsYWNlbWVudC5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9TaXplLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9TdHJQb3MuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1N0clBvcy5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9XcmFwcGVkUG9zLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9XcmFwcGVkUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwaW5nLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9XcmFwcGluZy5qcyIsIi4uL3NyYy9zdG9yYWdlRW5naW5lcy9Mb2NhbFN0b3JhZ2VFbmdpbmUuY29mZmVlIiwiLi4vc3JjL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZS5qcyIsIi4uL3NyYy9zdHJpbmdQYXJzZXJzL0NvbnRleHQuY29mZmVlIiwiLi4vc3JjL3N0cmluZ1BhcnNlcnMvQ29udGV4dC5qcyIsIi4uL3NyYy9zdHJpbmdQYXJzZXJzL0VzY2FwZUNvbnRleHQuY29mZmVlIiwiLi4vc3JjL3N0cmluZ1BhcnNlcnMvRXNjYXBlQ29udGV4dC5qcyIsIi4uL3NyYy9zdHJpbmdQYXJzZXJzL05hbWVkQ29udGV4dC5jb2ZmZWUiLCIuLi9zcmMvc3RyaW5nUGFyc2Vycy9OYW1lZENvbnRleHQuanMiLCIuLi9zcmMvc3RyaW5nUGFyc2Vycy9QYXJhbUNvbnRleHQuY29mZmVlIiwiLi4vc3JjL3N0cmluZ1BhcnNlcnMvUGFyYW1Db250ZXh0LmpzIiwiLi4vc3JjL3N0cmluZ1BhcnNlcnMvUGFyYW1QYXJzZXIuY29mZmVlIiwiLi4vc3JjL3N0cmluZ1BhcnNlcnMvUGFyYW1QYXJzZXIuanMiLCIuLi9zcmMvc3RyaW5nUGFyc2Vycy9TdHJpbmdDb250ZXh0LmNvZmZlZSIsIi4uL3NyYy9zdHJpbmdQYXJzZXJzL1N0cmluZ0NvbnRleHQuanMiLCIuLi9zcmMvc3RyaW5nUGFyc2Vycy9WYXJpYWJsZUNvbnRleHQuY29mZmVlIiwiLi4vc3JjL3N0cmluZ1BhcnNlcnMvVmFyaWFibGVDb250ZXh0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSx1QkFBQSxDQUFBOztBQUNBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxvQkFBQSxDQUFBOztBQUVBLElBQWEsU0FBTjtBQUFBO0FBQUE7QUFDTCxxQkFBYSxPQUFiLEVBQWE7QUFBQSxRQUFXLE9BQVgsdUVBQUEsRUFBQTs7QUFBQTs7QUFDWCxRQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQURZLFNBQUEsT0FBQSxHQUFBLE9BQUE7QUFDWixTQUFBLFFBQUEsR0FBWTtBQUNWLE1BQUEsSUFBQSxFQUFNLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FESSxJQUFBO0FBRVYsTUFBQSxHQUFBLEVBRlUsQ0FBQTtBQUdWLE1BQUEsS0FBQSxFQUhVLEVBQUE7QUFJVixNQUFBLE1BQUEsRUFKVSxDQUFBO0FBS1YsTUFBQSxRQUFBLEVBTFUsRUFBQTtBQU1WLE1BQUEsU0FBQSxFQU5VLEVBQUE7QUFPVixNQUFBLE1BQUEsRUFQVSxFQUFBO0FBUVYsTUFBQSxNQUFBLEVBUlUsRUFBQTtBQVNWLE1BQUEsTUFBQSxFQUFRO0FBVEUsS0FBWjtBQVdBLElBQUEsR0FBQSxHQUFBLEtBQUEsUUFBQTs7QUFBQSxTQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUE7QUNZRSxNQUFBLEdBQUcsR0FBRyxHQUFHLENBQVQsR0FBUyxDQUFUOztBRFhBLFVBQUcsR0FBQSxJQUFILE9BQUEsRUFBQTtBQUNFLGFBQUEsR0FBQSxJQUFZLE9BQVEsQ0FBcEIsR0FBb0IsQ0FBcEI7QUFERixPQUFBLE1BQUE7QUFHRSxhQUFBLEdBQUEsSUFBQSxHQUFBO0FDYUQ7QURqQkg7QUFaVzs7QUFEUjtBQUFBO0FBQUEsMEJBa0JFLElBbEJGLEVBa0JFO0FBQ0wsVUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQUEsRUFBQTtBQUNBLE1BQUEsR0FBQSxHQUFBLEtBQUEsUUFBQTs7QUFBQSxXQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUE7QUNtQkUsUUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFULEdBQVMsQ0FBVDtBRGxCQSxRQUFBLEdBQUksQ0FBSixHQUFJLENBQUosR0FBVyxLQUFYLEdBQVcsQ0FBWDtBQURGOztBQUVBLGFBQU8sSUFBQSxTQUFBLENBQWMsS0FBZCxPQUFBLEVBQVAsR0FBTyxDQUFQO0FBSks7QUFsQkY7QUFBQTtBQUFBLHlCQXVCQyxJQXZCRCxFQXVCQztBQUNKLGFBQU8sS0FBQSxRQUFBLEtBQUEsSUFBQSxHQUFxQixLQUFBLEtBQUEsQ0FBckIsSUFBcUIsQ0FBckIsR0FBQSxJQUFBLEdBQTBDLEtBQWpELE1BQWlELEVBQWpEO0FBREk7QUF2QkQ7QUFBQTtBQUFBLGdDQXlCUSxHQXpCUixFQXlCUTtBQUNYLGFBQU8sS0FBQSxPQUFBLENBQUEsV0FBQSxDQUFQLEdBQU8sQ0FBUDtBQURXO0FBekJSO0FBQUE7QUFBQSxnQ0EyQk07QUFDVCxVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxLQUFBLEtBQUEsR0FBUyxJQUFJLEtBQWIsR0FBQSxHQUFvQixJQUFJLEtBQUEsSUFBQSxDQUE5QixNQUFBO0FBQ0EsYUFBTyxLQUFBLFdBQUEsQ0FBYSxLQUFBLFFBQUEsQ0FBcEIsR0FBb0IsQ0FBYixDQUFQO0FBRlM7QUEzQk47QUFBQTtBQUFBLCtCQThCSztBQUNSLFVBQUEsRUFBQTtBQUFBLE1BQUEsRUFBQSxHQUFLLEtBQUEsS0FBQSxHQUFTLElBQUksS0FBYixHQUFBLEdBQW9CLElBQUksS0FBQSxJQUFBLENBQXhCLE1BQUEsR0FBdUMsS0FBQSxRQUFBLENBQTVDLE1BQUE7QUFDQSxhQUFPLEtBQUEsTUFBQSxHQUFVLEtBQUEsV0FBQSxDQUFhLEtBQUEsUUFBQSxHQUFVLEtBQUEsUUFBQSxDQUF4QyxFQUF3QyxDQUF2QixDQUFqQjtBQUZRO0FBOUJMO0FBQUE7QUFBQSw2QkFpQ0c7QUFDTixVQUFBLEVBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxLQUFBLEtBQUEsR0FBUyxJQUFJLEtBQWIsR0FBQSxHQUFvQixJQUFJLEtBQUEsSUFBQSxDQUF4QixNQUFBLEdBQXVDLEtBQUEsU0FBQSxDQUE1QyxNQUFBO0FBQ0EsYUFBTyxLQUFBLFdBQUEsQ0FBYSxLQUFBLFNBQUEsR0FBVyxLQUFBLFFBQUEsQ0FBeEIsRUFBd0IsQ0FBeEIsSUFBeUMsS0FBaEQsTUFBQTtBQUZNO0FBakNIO0FBQUE7QUFBQSw2QkFvQ0ssR0FwQ0wsRUFvQ0s7QUFDUixhQUFPLGFBQUEsQ0FBQSxZQUFBLENBQUEsY0FBQSxDQUE0QixLQUE1QixJQUFBLEVBQVAsR0FBTyxDQUFQO0FBRFE7QUFwQ0w7QUFBQTtBQUFBLDhCQXNDSTtBQUNQLGFBQU8sYUFBQSxDQUFBLFlBQUEsQ0FBQSxjQUFBLENBQUEsR0FBQSxFQUFpQyxLQUF4QyxHQUFPLENBQVA7QUFETztBQXRDSjtBQUFBO0FBQUEsNEJBd0NFO0FBQUEsVUFBQyxJQUFELHVFQUFBLEVBQUE7QUFBQSxVQUFZLFVBQVosdUVBQUEsSUFBQTtBQUNMLFVBQUEsQ0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBQSxJQUFQLEVBQUE7QUFDQSxNQUFBLEtBQUEsR0FBUSxJQUFJLENBQUosT0FBQSxDQUFBLEtBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxDQUFSLElBQVEsQ0FBUjs7QUFDQSxVQUFBLFVBQUEsRUFBQTtBQUNFLGVBQU8sWUFBQTtBQ3lDTCxjQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQTtBRHpDNEIsVUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxlQUFTLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxLQUFULE1BQUEsRUFBUyxLQUFBLEdBQUEsR0FBQSxDQUFBLElBQUEsR0FBQSxHQUFBLENBQUEsSUFBVCxHQUFBLEVBQVMsQ0FBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQVQsQ0FBQSxFQUFBO0FDNEMxQixZQUFBLE9BQU8sQ0FBUCxJQUFBLENENUNJLEtBQUEsSUFBQSxDQUFNLEtBQU0sQ0FBTixDQUFNLENBQU4sSUFBTixFQUFBLENDNENKO0FENUMwQjs7QUM4QzVCLGlCQUFBLE9BQUE7QUQ5Q0ssU0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQUFQLElBQU8sQ0FBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sWUFBQTtBQ2dETCxjQUFBLENBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTtBRGhEZSxVQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDbURiLFlBQUEsQ0FBQyxHQUFHLEtBQUssQ0FBVCxDQUFTLENBQVQ7QUFDQSxZQUFBLE9BQU8sQ0FBUCxJQUFBLENEcERJLEtBQUEsSUFBQSxDQUFBLENBQUEsQ0NvREo7QURwRGE7O0FDc0RmLGlCQUFBLE9BQUE7QUR0REssU0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQUFQLElBQU8sQ0FBUDtBQ3dERDtBRDlESTtBQXhDRjtBQUFBO0FBQUEsMkJBK0NDO0FBQUEsVUFBQyxJQUFELHVFQUFBLEVBQUE7QUFDSixhQUFRLGFBQUEsQ0FBQSxZQUFBLENBQUEsY0FBQSxDQUFBLEdBQUEsRUFBZ0MsS0FBaEMsTUFBQSxJQUNOLEtBQUEsV0FBQSxDQUNFLEtBQUEsSUFBQSxHQUNBLEtBREEsT0FDQSxFQURBLEdBQUEsSUFBQSxHQUdBLGFBQUEsQ0FBQSxZQUFBLENBQUEsY0FBQSxDQUFBLEdBQUEsRUFBaUMsS0FBQSxLQUFBLEdBQVMsS0FBQSxvQkFBQSxDQUFBLElBQUEsRUFIMUMsTUFHQSxDQUhBLEdBSUEsS0FKQSxPQUlBLEVBSkEsR0FLQSxLQVBKLElBQ0UsQ0FERjtBQURJO0FBL0NEO0FBQUE7QUFBQSwyQkF5REM7QUNxREosYURwREEsS0FBQSxPQUFBLENBQUEsZUFBQSxDQUF5QixLQUFBLElBQUEsR0FBUSxLQUFqQyxPQUFpQyxFQUFqQyxDQ29EQTtBRHJESTtBQXpERDtBQUFBO0FBQUEsNEJBMkRFO0FDdURMLGFEdERBLEtBQUEsT0FBQSxDQUFBLGdCQUFBLENBQTBCLEtBQUEsT0FBQSxLQUFhLEtBQXZDLElBQUEsQ0NzREE7QUR2REs7QUEzREY7QUFBQTtBQUFBLHlDQTZEaUIsSUE3RGpCLEVBNkRpQjtBQUNwQixhQUFPLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxhQUFBLENBQWdDLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxZQUFBLENBQXZDLElBQXVDLENBQWhDLENBQVA7QUFEb0I7QUE3RGpCO0FBQUE7QUFBQSwrQkErRE8sSUEvRFAsRUErRE87QUFDVixhQUFPLGFBQUEsQ0FBQSxZQUFBLENBQUEsVUFBQSxDQUF3QixLQUFBLG9CQUFBLENBQS9CLElBQStCLENBQXhCLENBQVA7QUFEVTtBQS9EUDtBQUFBO0FBQUEsaUNBaUVTLEdBakVULEVBaUVTO0FBQUE7O0FBQ1osVUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsR0FBQSxFQUFBLFNBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxLQUFBLFlBQUEsQ0FBYyxHQUFHLENBQXpCLEtBQVEsQ0FBUjs7QUFDQSxVQUFHLEtBQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxLQUFQLElBQU8sRUFBUDtBQUNBLFFBQUEsT0FBQSxHQUFVLGFBQUEsQ0FBQSxZQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsRUFBeUIsS0FBQSxHQUFuQyxDQUFVLENBQVY7QUFFQSxRQUFBLEtBQUEsR0FBUSxLQUFSLEtBQVEsRUFBUjtBQUNBLFFBQUEsV0FBQSxHQUFBLG1CQUFBO0FBQ0EsUUFBQSxLQUFLLENBQUwsS0FBQSxHQUFjLFdBQVcsQ0FBekIsTUFBQTtBQUNBLFFBQUEsS0FBSyxDQUFMLFFBQUEsR0FBaUIsS0FBSyxDQUFMLFNBQUEsR0FBa0IsS0FBQSxJQUFBLEdBQVEsS0FBUixJQUFBLEdBQUEsV0FBQSxHQUE4QixLQUE5QixJQUFBLEdBQXNDLEtBQXpFLElBQUE7QUFFQSxRQUFBLFNBQUEsR0FBWSxNQUFBLENBQU8sYUFBQSxDQUFBLFlBQUEsQ0FBQSxZQUFBLENBQTBCLE9BQUEsR0FBVSxLQUFLLENBQXpDLFFBQW9DLEVBQXBDLEVBQUEsT0FBQSxDQUFBLFdBQUEsRUFBbkIsSUFBbUIsQ0FBUCxDQUFaO0FBQ0EsUUFBQSxPQUFBLEdBQVUsTUFBQSxDQUFPLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixPQUFBLEdBQVUsS0FBSyxDQUF6QyxNQUFvQyxFQUFwQyxFQUFBLE9BQUEsQ0FBQSxXQUFBLEVBQWpCLElBQWlCLENBQVAsQ0FBVjtBQUVBLFFBQUEsSUFBQSxHQUFPLElBQUksS0FBQSxDQUFKLElBQUEsQ0FBQSxTQUFBLEVBQUEsT0FBQSxFQUEyQjtBQUNoQyxVQUFBLFVBQUEsRUFBYSxvQkFBQSxLQUFELEVBQUE7QUFFVixnQkFGVSxDQUVWLENBRlUsQ0M0RFY7O0FEMURBLFlBQUEsQ0FBQSxHQUFJLEtBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBOEIsS0FBSyxDQUFuQyxLQUE4QixFQUE5QixFQUE2QyxDQUFBLElBQUEsRUFBQSxJQUFBLEVBQTdDLElBQTZDLENBQTdDLEVBQThELENBQWxFLENBQUksQ0FBSjtBQUNBLG1CQUFRLENBQUEsSUFBQSxJQUFBLElBQU0sQ0FBQyxDQUFELEdBQUEsS0FBZCxJQUFBO0FBSFU7QUFEb0IsU0FBM0IsQ0FBUDtBQU1BLFFBQUEsR0FBQSxHQUFNLElBQUksQ0FBSixVQUFBLENBQUEsR0FBQSxFQUFvQixLQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxDQUExQixJQUEwQixFQUFwQixDQUFOOztBQUNBLFlBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsR0FBRyxDQUFILEtBQUEsSUFBYSxPQUFPLENBQXBCLE1BQUE7QUFDQSxpQkFBQSxHQUFBO0FBckJKO0FDbUZDO0FEckZXO0FBakVUO0FBQUE7QUFBQSxpQ0EwRlMsS0ExRlQsRUEwRlM7QUFDWixVQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQTtBQUFBLE1BQUEsS0FBQSxHQUFBLENBQUE7QUFDQSxNQUFBLElBQUEsR0FBTyxLQUFQLElBQU8sRUFBUDs7QUFDQSxhQUFNLENBQUEsQ0FBQSxHQUFBLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsS0FBQSxFQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLElBQUEsSUFBb0UsQ0FBQyxDQUFELEdBQUEsS0FBMUUsSUFBQSxFQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsQ0FBQyxDQUFULEdBQUE7QUFDQSxRQUFBLEtBQUE7QUFGRjs7QUFHQSxhQUFBLEtBQUE7QUFOWTtBQTFGVDtBQUFBO0FBQUEsbUNBaUdXLElBakdYLEVBaUdXO0FBQUEsVUFBTSxNQUFOLHVFQUFBLElBQUE7QUFDZCxVQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsUUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUEsTUFBQSxDQUFXLFlBQVUsYUFBQSxDQUFBLFlBQUEsQ0FBQSxZQUFBLENBQTBCLEtBQUEsT0FBQSxDQUFBLGVBQUEsQ0FBeUIsS0FBN0QsSUFBb0MsQ0FBMUIsQ0FBVixHQUFwQixTQUFTLENBQVQ7QUFDQSxNQUFBLElBQUEsR0FBTyxJQUFBLE1BQUEsQ0FBVyxZQUFVLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixLQUFBLE9BQUEsQ0FBQSxnQkFBQSxDQUEwQixLQUE5RCxJQUFvQyxDQUExQixDQUFWLEdBQWxCLFNBQU8sQ0FBUDtBQUNBLE1BQUEsUUFBQSxHQUFXLE1BQU0sQ0FBTixJQUFBLENBQVgsSUFBVyxDQUFYO0FBQ0EsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFKLElBQUEsQ0FBVCxJQUFTLENBQVQ7O0FBQ0EsVUFBRyxRQUFBLElBQUEsSUFBQSxJQUFjLE1BQUEsSUFBakIsSUFBQSxFQUFBO0FBQ0UsWUFBQSxNQUFBLEVBQUE7QUFDRSxlQUFBLEdBQUEsR0FBTyxJQUFJLENBQUosR0FBQSxDQUFTLFFBQVMsQ0FBVCxDQUFTLENBQVQsQ0FBVCxNQUFBLEVBQTRCLE1BQU8sQ0FBUCxDQUFPLENBQVAsQ0FBbkMsTUFBTyxDQUFQO0FDcUVEOztBRHBFRCxhQUFBLE1BQUEsR0FBVSxRQUFTLENBQVQsQ0FBUyxDQUFULENBQVYsTUFBQTtBQUNBLFFBQUEsUUFBQSxHQUFXLFFBQVEsQ0FBUixLQUFBLEdBQWlCLFFBQVMsQ0FBVCxDQUFTLENBQVQsQ0FBakIsTUFBQSxHQUFzQyxRQUFTLENBQVQsQ0FBUyxDQUFULENBQXRDLE1BQUEsR0FBMkQsS0FBdEUsR0FBQTtBQUNBLFFBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBTixLQUFBLEdBQWUsTUFBTyxDQUFQLENBQU8sQ0FBUCxDQUFmLE1BQUEsR0FBa0MsS0FBM0MsR0FBQTtBQUNBLGFBQUEsS0FBQSxHQUFTLE1BQUEsR0FBVCxRQUFBO0FDc0VEOztBRHJFRCxhQUFBLElBQUE7QUFaYztBQWpHWDtBQUFBO0FBQUEsa0NBOEdVLElBOUdWLEVBOEdVO0FBQUEsVUFBTSxPQUFOLHVFQUFBLEVBQUE7QUFDYixhQUFPLEtBQUEsS0FBQSxDQUFPLEtBQUEsYUFBQSxDQUFBLElBQUEsRUFBUCxPQUFPLENBQVAsRUFBUCxLQUFPLENBQVA7QUFEYTtBQTlHVjtBQUFBO0FBQUEsa0NBZ0hVLElBaEhWLEVBZ0hVO0FBQUEsVUFBTSxPQUFOLHVFQUFBLEVBQUE7QUFDYixVQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBOztBQUFBLFVBQUcsSUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsUUFBQSxHQUFXO0FBQ1QsVUFBQSxTQUFBLEVBQVc7QUFERixTQUFYO0FBR0EsUUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFOLE1BQUEsQ0FBQSxFQUFBLEVBQUEsUUFBQSxFQUFOLE9BQU0sQ0FBTjtBQUNBLFFBQUEsR0FBQSxHQUFNLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixLQUFBLE9BQUEsQ0FBaEMsZUFBZ0MsRUFBMUIsQ0FBTjtBQUNBLFFBQUEsR0FBQSxHQUFNLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixLQUFBLE9BQUEsQ0FBaEMsZ0JBQWdDLEVBQTFCLENBQU47QUFDQSxRQUFBLEVBQUEsR0FBSyxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBMEIsS0FBL0IsSUFBSyxDQUFMO0FBQ0EsUUFBQSxJQUFBLEdBQVUsT0FBUSxDQUFSLFdBQVEsQ0FBUixHQUFBLElBQUEsR0FBVixFQUFBO0FBQ0EsUUFBQSxHQUFBLEdBQU0sSUFBQSxNQUFBLGdCQUFtQixHQUFuQixnQkFBNEIsRUFBNUIscUJBQXlDLEtBQXpDLEdBQUEsUUFBTixJQUFNLENBQU47QUFDQSxRQUFBLEdBQUEsR0FBTSxJQUFBLE1BQUEsa0JBQXFCLEVBQXJCLGVBQUEsR0FBQSxZQUFOLElBQU0sQ0FBTjtBQUNBLGVBQU8sSUFBSSxDQUFKLE9BQUEsQ0FBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQVAsRUFBTyxDQUFQO0FDNEVEO0FEeEZZO0FBaEhWOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFSkEsSUFBQSxjQUFBLEdBQUEsT0FBQSxDQUFBLDZCQUFBLENBQUE7O0FBQ0EsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLDJCQUFBLENBQUE7O0FBQ0EsSUFBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUE7O0FBQ0EsSUFBQSxnQkFBQSxHQUFBLE9BQUEsQ0FBQSwyQkFBQSxDQUFBOztBQUVBLElBQWEsWUFBTjtBQUFBO0FBQUE7QUFDTCx3QkFBYSxTQUFiLEVBQWEsVUFBYixFQUFhO0FBQUE7O0FBQUMsU0FBQSxRQUFBLEdBQUEsU0FBQTtBQUNaLFNBQUEsT0FBQSxHQUFBLElBQUE7QUFDQSxTQUFBLE1BQUEsR0FBQSxJQUFBO0FBQ0EsU0FBQSxPQUFBLEdBQUEsS0FBQTtBQUNBLFNBQUEsU0FBQSxHQUFBLENBQUE7QUFDQSxTQUFBLFVBQUEsR0FBYyxJQUFJLGNBQUEsQ0FBSixhQUFBLENBQWQsVUFBYyxDQUFkO0FBTFc7O0FBRFI7QUFBQTtBQUFBLDRCQU9FO0FBQUE7O0FBQ0wsV0FBQSxPQUFBLEdBQUEsSUFBQTtBQ2VBLGFEZEEsQ0FBQSxHQUFBLGdCQUFBLENBQUEsZUFBQSxFQUFnQixLQUFoQixVQUFnQixFQUFoQixFQUFBLElBQUEsQ0FBb0MsWUFBQTtBQUNsQyxZQUFHLEtBQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxDQUFILGlCQUFHLEVBQUgsRUFBQTtBQUNFLFVBQUEsS0FBQSxDQUFBLGFBQUEsR0FBaUIsWUFBQTtBQUFBLGdCQUFDLEVBQUQsdUVBQUEsSUFBQTtBQ2VmLG1CRGYyQixLQUFBLENBQUEsUUFBQSxDQUFBLEVBQUEsQ0NlM0I7QURmRixXQUFBOztBQUNBLFVBQUEsS0FBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsaUJBQUEsQ0FBb0MsS0FBQSxDQUFwQyxhQUFBO0FDaUJEOztBRGhCRCxlQUFBLEtBQUE7QUFKRixPQUFBLEVBQUEsTUFBQSxFQ2NBO0FEaEJLO0FBUEY7QUFBQTtBQUFBLGlDQWVPO0FBQ1YsV0FBQSxZQUFBLEdBQWdCLEtBQUEsVUFBQSxDQUFBLElBQUEsQ0FDZCxLQUFBLFFBQUEsQ0FBQSxPQUFBLEdBQW9CLEtBQUEsUUFBQSxDQUFwQixVQUFBLEdBQTJDLEtBQUEsUUFBQSxDQUEzQyxPQUFBLEdBRGMsSUFBQSxFQUVkLE9BQU8sS0FBQSxRQUFBLENBQVAsT0FBQSxHQUEyQixLQUFBLFFBQUEsQ0FBM0IsU0FBQSxHQUFpRCxLQUFBLFFBQUEsQ0FBakQsVUFBQSxHQUF3RSxLQUFBLFFBQUEsQ0FGMUQsT0FBQSxFQUFBLEdBQUEsQ0FHVCxVQUFBLENBQUEsRUFBQTtBQ2lCTCxlRGpCWSxDQUFDLENBQUQsV0FBQSxFQ2lCWjtBRHBCRixPQUFnQixDQUFoQjtBQ3NCQSxhRGxCQSxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsaUJBQUEsQ0FBbUMsS0FBbkMsWUFBQSxDQ2tCQTtBRHZCVTtBQWZQO0FBQUE7QUFBQSxtQ0FxQlM7QUNxQlosYURwQkEsS0FBQSxNQUFBLEdBQVUsSUNvQlY7QURyQlk7QUFyQlQ7QUFBQTtBQUFBLCtCQXVCSztBQUFBLFVBQUMsRUFBRCx1RUFBQSxJQUFBO0FBQ1IsV0FBQSxZQUFBOztBQUNBLFVBQUcsS0FBQSxTQUFBLENBQUgsRUFBRyxDQUFILEVBQUE7QUFDRTtBQ3VCRDs7QUR0QkQsV0FBQSxTQUFBOztBQUNBLFVBQUcsS0FBSCxVQUFHLEVBQUgsRUFBQTtBQUNFLGFBQUEsSUFBQTtBQ3dCQSxlRHZCQSxLQUFBLFVBQUEsRUN1QkE7QUR6QkYsT0FBQSxNQUFBO0FDMkJFLGVEdkJBLEtBQUEsTUFBQSxFQ3VCQTtBQUNEO0FEakNPO0FBdkJMO0FBQUE7QUFBQSw4QkFrQ00sRUFsQ04sRUFrQ007QUFDVCxhQUFPLEVBQUEsSUFBQSxJQUFBLElBQVEsRUFBRSxDQUFGLFVBQUEsQ0FBQSxDQUFBLE1BQWYsRUFBQTtBQURTO0FBbENOO0FBQUE7QUFBQSw2QkFxQ0csQ0FBQTtBQXJDSDtBQUFBO0FBQUEsaUNBd0NPO0FBQ1YsYUFBTyxLQUFBLEtBQUEsT0FBQSxLQUFBLElBQXFCLEtBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQXlCLENBQXJELENBQUE7QUFEVTtBQXhDUDtBQUFBO0FBQUEsaUNBMkNPO0FBQ1YsVUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLFlBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLFVBQUEsRUFBQSxLQUFBO0FBQUEsTUFBQSxZQUFBLEdBQUEsRUFBQTtBQUNBLE1BQUEsVUFBQSxHQUFhLEtBQWIsYUFBYSxFQUFiOztBQUNBLFdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsVUFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDNkJFLFFBQUEsR0FBRyxHQUFHLFVBQVUsQ0FBaEIsQ0FBZ0IsQ0FBaEI7O0FENUJBLFlBQUcsR0FBQSxHQUFNLEtBQUEsaUJBQUEsQ0FBVCxHQUFTLENBQVQsRUFBQTtBQUNFLFVBQUEsS0FBQSxHQUFBLEdBQUE7QUFERixTQUFBLE1BRUssSUFBRyxDQUFDLEdBQUEsR0FBTSxLQUFBLGtCQUFBLENBQVAsR0FBTyxDQUFQLEtBQXFDLEtBQUEsSUFBeEMsSUFBQSxFQUFBO0FBQ0gsVUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFILFVBQUEsQ0FBZSxLQUFBLFFBQUEsQ0FBZixNQUFBLEVBQUEsU0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQU4sQ0FBTSxDQUFOO0FBQ0EsVUFBQSxJQUFBLEdBQU8sSUFBSSxZQUFBLENBQUosV0FBQSxDQUFnQixHQUFHLENBQW5CLFVBQUEsRUFBK0IsR0FBRyxDQUFsQyxRQUFBLEVBQVAsR0FBTyxDQUFQO0FBQ0EsVUFBQSxJQUFJLENBQUosVUFBQSxHQUFrQixDQUFsQixLQUFrQixDQUFsQjtBQUNBLFVBQUEsWUFBWSxDQUFaLElBQUEsQ0FBQSxJQUFBO0FBQ0EsVUFBQSxLQUFBLEdBQUEsSUFBQTtBQzhCRDtBRHRDSDs7QUN3Q0EsYUQvQkEsS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLGlCQUFBLENBQUEsWUFBQSxDQytCQTtBRDNDVTtBQTNDUDtBQUFBO0FBQUEsb0NBd0RVO0FBQ2IsYUFBTyxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQVAsV0FBTyxFQUFQO0FBRGE7QUF4RFY7QUFBQTtBQUFBLDJCQTBEQztBQUNKLFdBQUEsT0FBQSxHQUFBLEtBQUE7O0FBQ0EsVUFBMEIsS0FBQSxPQUFBLElBQTFCLElBQUEsRUFBQTtBQUFBLFFBQUEsWUFBQSxDQUFhLEtBQWIsT0FBQSxDQUFBO0FDcUNDOztBRHBDRCxVQUFpQyxLQUFBLFFBQUEsQ0FBQSxZQUFBLEtBQWpDLElBQUEsRUFBQTtBQUFBLGFBQUEsUUFBQSxDQUFBLFlBQUEsR0FBQSxJQUFBO0FDdUNDOztBRHRDRCxVQUFHLEtBQUEsYUFBQSxJQUFILElBQUEsRUFBQTtBQ3dDRSxlRHZDQSxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsb0JBQUEsQ0FBc0MsS0FBdEMsYUFBQSxDQ3VDQTtBQUNEO0FEN0NHO0FBMUREO0FBQUE7QUFBQSw2QkFnRUc7QUFDTixVQUFHLEtBQUEsS0FBQSxPQUFILEtBQUEsRUFBQTtBQUNFLGFBQUEsZ0JBQUEsQ0FBa0IsS0FBbEIsYUFBa0IsRUFBbEI7QUMyQ0Q7O0FBQ0QsYUQzQ0EsS0FBQSxJQUFBLEVDMkNBO0FEOUNNO0FBaEVIO0FBQUE7QUFBQSxxQ0FvRWEsVUFwRWIsRUFvRWE7QUFDaEIsVUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsWUFBQSxFQUFBLEdBQUEsRUFBQSxLQUFBO0FBQUEsTUFBQSxZQUFBLEdBQUEsRUFBQTtBQUNBLE1BQUEsS0FBQSxHQUFBLElBQUE7O0FBQ0EsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxVQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUMrQ0UsUUFBQSxHQUFHLEdBQUcsVUFBVSxDQUFoQixDQUFnQixDQUFoQjs7QUQ5Q0EsWUFBRyxHQUFBLEdBQU0sS0FBQSxpQkFBQSxDQUFULEdBQVMsQ0FBVCxFQUFBO0FBQ0UsVUFBQSxLQUFBLEdBQUEsR0FBQTtBQURGLFNBQUEsTUFFSyxJQUFHLENBQUMsR0FBQSxHQUFNLEtBQUEsa0JBQUEsQ0FBUCxHQUFPLENBQVAsS0FBcUMsS0FBQSxJQUF4QyxJQUFBLEVBQUE7QUFDSCxVQUFBLFlBQVksQ0FBWixJQUFBLENBQWtCLElBQUksWUFBQSxDQUFKLFdBQUEsQ0FBZ0IsS0FBSyxDQUFyQixLQUFBLEVBQTRCLEdBQUcsQ0FBL0IsR0FBQSxFQUFvQyxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUE0QixLQUFLLENBQUwsR0FBQSxHQUE1QixDQUFBLEVBQXlDLEdBQUcsQ0FBSCxLQUFBLEdBQTdFLENBQW9DLENBQXBDLEVBQWxCLGFBQWtCLEVBQWxCO0FBQ0EsVUFBQSxLQUFBLEdBQUEsSUFBQTtBQ2dERDtBRHJESDs7QUN1REEsYURqREEsS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLGlCQUFBLENBQUEsWUFBQSxDQ2lEQTtBRDFEZ0I7QUFwRWI7QUFBQTtBQUFBLDRCQThFRTtBQUNMLFVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxVQUFBOztBQUFBLFVBQU8sS0FBQSxNQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFQLFlBQU8sRUFBUDtBQUNBLFFBQUEsVUFBQSxHQUFhLEtBQUEsWUFBQSxDQUFBLENBQUEsRUFBQSxLQUFBLEdBQXlCLEtBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBdEMsTUFBQTs7QUFDQSxZQUFHLEtBQUEsUUFBQSxDQUFBLGNBQUEsQ0FBeUIsSUFBSSxDQUE3QixLQUFBLE1BQXdDLEtBQUEsWUFBQSxDQUFBLENBQUEsRUFBeEMsS0FBQSxJQUFtRSxDQUFBLFFBQUEsR0FBQSxLQUFBLFFBQUEsQ0FBQSxjQUFBLENBQUEsVUFBQSxDQUFBLEtBQW5FLElBQUEsSUFBMEgsUUFBQSxJQUFZLElBQUksQ0FBN0ksR0FBQSxFQUFBO0FBQ0UsZUFBQSxNQUFBLEdBQVUsS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSxVQUFBLEVBQVYsUUFBVSxDQUFWO0FBREYsU0FBQSxNQUFBO0FBR0UsZUFBQSxNQUFBLEdBQUEsS0FBQTtBQU5KO0FDNERDOztBRHJERCxhQUFPLEtBQVAsTUFBQTtBQVJLO0FBOUVGO0FBQUE7QUFBQSxzQ0F1RmMsR0F2RmQsRUF1RmM7QUFDakIsVUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxVQUFBO0FBQUEsTUFBQSxHQUFBLEdBQUEsS0FBQSxZQUFBOztBQUFBLFdBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUMyREUsUUFBQSxJQUFJLEdBQUcsR0FBRyxDQUFWLENBQVUsQ0FBVjtBRDFEQSxRQUFBLFNBQUEsR0FBWSxLQUFBLFVBQUEsQ0FBWixDQUFZLENBQVo7QUFDQSxRQUFBLFVBQUEsR0FBYSxLQUFBLFFBQUEsQ0FBQSxPQUFBLEdBQW9CLEtBQXBCLEtBQW9CLEVBQXBCLEdBQStCLEtBQUEsUUFBQSxDQUE1QyxPQUFBOztBQUNBLFlBQUcsU0FBUyxDQUFULGdCQUFBLENBQUEsR0FBQSxLQUFtQyxTQUFTLENBQVQsVUFBQSxDQUFxQixLQUFBLFFBQUEsQ0FBckIsTUFBQSxFQUFBLElBQUEsT0FBdEMsVUFBQSxFQUFBO0FBQ0UsaUJBQUEsU0FBQTtBQzRERDtBRGhFSDs7QUFLQSxhQUFBLEtBQUE7QUFOaUI7QUF2RmQ7QUFBQTtBQUFBLHVDQThGZSxHQTlGZixFQThGZTtBQUNsQixVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUE7QUFBQSxNQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTtBQ2tFRSxRQUFBLElBQUksR0FBRyxHQUFHLENBQVYsQ0FBVSxDQUFWO0FEakVBLFFBQUEsU0FBQSxHQUFZLEtBQUEsUUFBQSxDQUFaLENBQVksQ0FBWjtBQUNBLFFBQUEsVUFBQSxHQUFhLEtBQUEsUUFBQSxDQUFBLE9BQUEsR0FBb0IsS0FBQSxRQUFBLENBQXBCLFNBQUEsR0FBMEMsS0FBMUMsS0FBMEMsRUFBMUMsR0FBcUQsS0FBQSxRQUFBLENBQWxFLE9BQUE7O0FBQ0EsWUFBRyxTQUFTLENBQVQsZ0JBQUEsQ0FBQSxHQUFBLEtBQW1DLFNBQVMsQ0FBVCxVQUFBLENBQXFCLEtBQUEsUUFBQSxDQUFyQixNQUFBLEVBQUEsSUFBQSxPQUF0QyxVQUFBLEVBQUE7QUFDRSxpQkFBQSxTQUFBO0FDbUVEO0FEdkVIOztBQUtBLGFBQUEsS0FBQTtBQU5rQjtBQTlGZjtBQUFBO0FBQUEsK0JBcUdPLEtBckdQLEVBcUdPO0FBQ1YsYUFBTyxJQUFJLElBQUEsQ0FBSixHQUFBLENBQ0gsS0FBQSxZQUFBLENBQUEsS0FBQSxFQUFBLFVBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxHQUEyQyxLQUFBLEtBQUEsR0FBQSxNQUFBLElBQW1CLEtBQUEsR0FEM0QsQ0FDd0MsQ0FEeEMsRUFFSCxLQUFBLFlBQUEsQ0FBQSxLQUFBLEVBQUEsVUFBQSxDQUFBLENBQUEsRUFBQSxHQUFBLEdBQXlDLEtBQUEsS0FBQSxHQUFBLE1BQUEsSUFBbUIsS0FBQSxHQUFBLENBQUEsR0FGekQsQ0FFc0MsQ0FGdEMsRUFBQSxTQUFBLENBR08sS0FBQSxRQUFBLENBSFAsT0FBQSxFQUcwQixLQUFBLFFBQUEsQ0FIakMsT0FBTyxDQUFQO0FBRFU7QUFyR1A7QUFBQTtBQUFBLDZCQTBHSyxLQTFHTCxFQTBHSztBQUNSLGFBQU8sSUFBSSxJQUFBLENBQUosR0FBQSxDQUNILEtBQUEsWUFBQSxDQUFBLEtBQUEsRUFBQSxVQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsR0FBMkMsS0FBQSxLQUFBLEdBQUEsTUFBQSxJQUFtQixLQUFBLEdBQUEsQ0FBQSxHQUQzRCxDQUN3QyxDQUR4QyxFQUVILEtBQUEsWUFBQSxDQUFBLEtBQUEsRUFBQSxVQUFBLENBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBeUMsS0FBQSxLQUFBLEdBQUEsTUFBQSxJQUFtQixLQUFBLEdBQUEsQ0FBQSxHQUZ6RCxDQUVzQyxDQUZ0QyxFQUFBLFNBQUEsQ0FHTyxLQUFBLFFBQUEsQ0FBQSxPQUFBLEdBQW9CLEtBQUEsUUFBQSxDQUgzQixTQUFBLEVBR2dELEtBQUEsUUFBQSxDQUh2RCxPQUFPLENBQVA7QUFEUTtBQTFHTDs7QUFBQTtBQUFBLEdBQVA7Ozs7QUFnSEEsSUFBYSxxQkFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDZCQUNHO0FDc0VOLGFEckVBLEtBQUEsWUFBQSxFQ3FFQTtBRHRFTTtBQURIO0FBQUE7QUFBQSxtQ0FHUztBQUFBOztBQUNaLFVBQTBCLEtBQUEsT0FBQSxJQUExQixJQUFBLEVBQUE7QUFBQSxRQUFBLFlBQUEsQ0FBYSxLQUFiLE9BQUEsQ0FBQTtBQ3lFQzs7QUFDRCxhRHpFQSxLQUFBLE9BQUEsR0FBVyxVQUFBLENBQVksWUFBQTtBQUNyQixZQUFBLFFBQUEsRUFBQSxJQUFBLEVBQUEsVUFBQTs7QUFBQSxRQUFBLE1BQUEsQ0FBQSxZQUFBOztBQUNBLFFBQUEsVUFBQSxHQUFhLE1BQUEsQ0FBQSxRQUFBLENBQUEsT0FBQSxHQUFvQixNQUFBLENBQUEsUUFBQSxDQUFwQixTQUFBLEdBQTBDLE1BQUEsQ0FBMUMsS0FBMEMsRUFBMUMsR0FBcUQsTUFBQSxDQUFBLFFBQUEsQ0FBbEUsT0FBQTtBQUNBLFFBQUEsUUFBQSxHQUFXLE1BQUEsQ0FBQSxrQkFBQSxDQUFvQixNQUFBLENBQUEsWUFBQSxDQUFBLENBQUEsRUFBQSxVQUFBLENBQUEsQ0FBQSxFQUFBLElBQUEsR0FBQSxXQUFBLENBQWtELE1BQUEsQ0FBQSxLQUFBLEdBQWpGLE1BQStCLENBQXBCLENBQVg7O0FBQ0EsWUFBQSxRQUFBLEVBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxJQUFJLFlBQUEsQ0FBSixXQUFBLENBQWdCLFFBQVEsQ0FBeEIsS0FBQSxFQUErQixRQUFRLENBQXZDLEdBQUEsRUFBUCxVQUFPLENBQVA7O0FBQ0EsY0FBRyxJQUFJLENBQUosVUFBQSxDQUFnQixNQUFBLENBQUEsUUFBQSxDQUFoQixNQUFBLEVBQUgsU0FBRyxFQUFILEVBQUE7QUFDRSxZQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLGlCQUFBLENBQW1DLENBQW5DLElBQW1DLENBQW5DO0FBSEo7QUFBQSxTQUFBLE1BQUE7QUFLRSxVQUFBLE1BQUEsQ0FBQSxJQUFBO0FDNEVEOztBRDNFRCxZQUFzQixNQUFBLENBQUEsZUFBQSxJQUF0QixJQUFBLEVBQUE7QUM2RUUsaUJEN0VGLE1BQUEsQ0FBQSxlQUFBLEVDNkVFO0FBQ0Q7QUR4RlEsT0FBQSxFQUFBLENBQUEsQ0N5RVg7QUQzRVk7QUFIVDtBQUFBO0FBQUEsZ0NBaUJNO0FBQ1QsYUFBQSxLQUFBO0FBRFM7QUFqQk47QUFBQTtBQUFBLG9DQW1CVTtBQUNiLGFBQU8sQ0FDSCxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBREcsWUFDSCxFQURHLEVBRUgsS0FBQSxZQUFBLENBQUEsQ0FBQSxFQUFBLFVBQUEsQ0FBQSxDQUFBLElBQWlDLEtBQUEsS0FBQSxHQUZyQyxNQUFPLENBQVA7QUFEYTtBQW5CVjtBQUFBO0FBQUEsdUNBd0JlLEdBeEJmLEVBd0JlO0FBQ2xCLFVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFBLEtBQUEsWUFBQTs7QUFBQSxXQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBO0FDb0ZFLFFBQUEsSUFBSSxHQUFHLEdBQUcsQ0FBVixDQUFVLENBQVY7QURuRkEsUUFBQSxTQUFBLEdBQVksS0FBQSxRQUFBLENBQVosQ0FBWSxDQUFaO0FBQ0EsUUFBQSxJQUFBLEdBQU8sS0FBQSxRQUFBLENBQUEsY0FBQSxDQUF5QixTQUFTLENBQXpDLFVBQU8sQ0FBUDs7QUFDQSxZQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLFNBQVMsQ0FBVCxVQUFBLENBQUEsSUFBQTs7QUFDQSxjQUFHLFNBQVMsQ0FBVCxnQkFBQSxDQUFILEdBQUcsQ0FBSCxFQUFBO0FBQ0UsbUJBQUEsU0FBQTtBQUhKO0FDeUZDO0FENUZIOztBQU9BLGFBQUEsS0FBQTtBQVJrQjtBQXhCZjs7QUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFQOzs7O0FBa0NBLFlBQVksQ0FBWixNQUFBLEdBQXNCLFVBQUEsUUFBQSxFQUFBLFVBQUEsRUFBQTtBQUNwQixNQUFHLFFBQVEsQ0FBUixNQUFBLENBQUgsbUJBQUcsRUFBSCxFQUFBO0FBQ0UsV0FBTyxJQUFBLFlBQUEsQ0FBQSxRQUFBLEVBQVAsVUFBTyxDQUFQO0FBREYsR0FBQSxNQUFBO0FBR0UsV0FBTyxJQUFBLHFCQUFBLENBQUEsUUFBQSxFQUFQLFVBQU8sQ0FBUDtBQzJGRDtBRC9GSCxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUV2SkEsSUFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLFdBQUEsQ0FBQTs7QUFDQSxJQUFBLGdCQUFBLEdBQUEsT0FBQSxDQUFBLDJCQUFBLENBQUE7O0FBQ0EsSUFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLFdBQUEsQ0FBQTs7QUFGQSxJQUFBLE9BQUEsR0FBQSxHQUFBLE9BQUE7O0FBSUEsSUFBYSxTQUFOO0FBQUE7QUFBQTtBQUNMLHFCQUFhLEtBQWIsRUFBYSxPQUFiLEVBQWE7QUFBQTs7QUFDWCxRQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTs7QUFBQSxRQUFHLE9BQUEsS0FBQSxLQUFILFFBQUEsRUFBQTtBQUNFLE1BQUEsS0FBQSxHQUFRLENBQVIsS0FBUSxDQUFSO0FDWUQ7O0FEWEQsSUFBQSxRQUFBLEdBQVc7QUFDVCxNQUFBLE1BQUEsRUFEUyxJQUFBO0FBRVQsTUFBQSxVQUFBLEVBRlMsRUFBQTtBQUdULE1BQUEsYUFBQSxFQUhTLElBQUE7QUFJVCxNQUFBLE9BQUEsRUFKUyxJQUFBO0FBS1QsTUFBQSxJQUFBLEVBQU0sUUFBQSxDQUFBLE9BQUEsQ0FMRyxJQUFBO0FBTVQsTUFBQSxXQUFBLEVBTlMsSUFBQTtBQU9ULE1BQUEsWUFBQSxFQVBTLElBQUE7QUFRVCxNQUFBLFlBQUEsRUFSUyxJQUFBO0FBU1QsTUFBQSxRQUFBLEVBVFMsSUFBQTtBQVVULE1BQUEsUUFBQSxFQUFVO0FBVkQsS0FBWDtBQVlBLFNBQUEsS0FBQSxHQUFBLEtBQUE7QUFDQSxTQUFBLE1BQUEsR0FBVSxPQUFRLENBQWxCLFFBQWtCLENBQWxCOztBQUNBLFNBQUEsR0FBQSxJQUFBLFFBQUEsRUFBQTtBQ2FFLE1BQUEsR0FBRyxHQUFHLFFBQVEsQ0FBZCxHQUFjLENBQWQ7O0FEWkEsVUFBRyxHQUFBLElBQUgsT0FBQSxFQUFBO0FBQ0UsYUFBQSxHQUFBLElBQVksT0FBUSxDQUFwQixHQUFvQixDQUFwQjtBQURGLE9BQUEsTUFFSyxJQUFHLEtBQUEsTUFBQSxJQUFBLElBQUEsSUFBYSxHQUFBLEtBQWhCLFFBQUEsRUFBQTtBQUNILGFBQUEsR0FBQSxJQUFZLEtBQUEsTUFBQSxDQUFaLEdBQVksQ0FBWjtBQURHLE9BQUEsTUFBQTtBQUdILGFBQUEsR0FBQSxJQUFBLEdBQUE7QUNjRDtBRHBCSDs7QUFPQSxRQUFPLEtBQUEsT0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLFdBQUEsT0FBQSxHQUFXLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBWSxLQUF2QixRQUFXLENBQVg7QUNnQkQ7O0FEZkQsUUFBRyxLQUFBLGFBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxXQUFBLE9BQUEsQ0FBQSxNQUFBLEdBQWtCLEtBQWxCLGFBQUE7QUNpQkQ7O0FEaEJELFFBQUcsS0FBQSxVQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsV0FBQSxPQUFBLENBQUEsYUFBQSxDQUF1QixLQUF2QixVQUFBO0FDa0JEO0FEL0NVOztBQURSO0FBQUE7QUFBQSwyQkErQkM7QUFDSixXQUFBLGdCQUFBO0FBQ0EsV0FBQSxHQUFBLEdBQU8sS0FBQSxNQUFBLENBQVEsS0FBZixJQUFPLENBQVA7QUFDQSxhQUFPLEtBQVAsR0FBQTtBQWxDRyxLQUFBLENDeURMO0FBQ0E7QUFDQTtBQUNBOztBRDVESztBQUFBO0FBQUEsd0NBdUNjO0FBQ2pCLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFBLEVBQUE7QUFDQSxNQUFBLEdBQUEsR0FBQSxLQUFBLEtBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUN5QkUsUUFBQSxJQUFJLEdBQUcsR0FBRyxDQUFWLENBQVUsQ0FBVjs7QUR6QkYsb0NBQ2lCLGdCQUFBLENBQUEsZUFBQSxDQUFBLFVBQUEsQ0FBZixJQUFlLENBRGpCOztBQUFBOztBQUNFLFFBQUEsS0FERjtBQUNFLFFBQUEsSUFERjs7QUFFRSxZQUFHLEtBQUEsSUFBQSxJQUFBLElBQVcsRUFBRSxPQUFBLENBQUEsSUFBQSxDQUFTLEtBQUEsT0FBQSxDQUFULGFBQVMsRUFBVCxFQUFBLEtBQUEsS0FBaEIsQ0FBYyxDQUFkLEVBQUE7QUFDRSxjQUFBLEVBQU8sS0FBQSxJQUFQLEtBQUEsQ0FBQSxFQUFBO0FBQ0UsWUFBQSxLQUFNLENBQU4sS0FBTSxDQUFOLEdBQUEsRUFBQTtBQzBCRDs7QUR6QkQsVUFBQSxLQUFNLENBQU4sS0FBTSxDQUFOLENBQUEsSUFBQSxDQUFBLElBQUE7QUMyQkQ7QURoQ0g7O0FBTUEsYUFBQSxLQUFBO0FBUmlCO0FBdkNkO0FBQUE7QUFBQSxzQ0FnRGMsU0FoRGQsRUFnRGM7QUFDakIsVUFBQSxJQUFBLEVBQUEsS0FBQTs7QUFEaUIsbUNBQ0YsZ0JBQUEsQ0FBQSxlQUFBLENBQUEsVUFBQSxDQUFBLFNBQUEsRUFBZixJQUFlLENBREU7O0FBQUE7O0FBQ2pCLE1BQUEsS0FEaUI7QUFDakIsTUFBQSxJQURpQjtBQ2lDakIsYUQvQkEsS0FBQSxLQUFBLENBQUEsR0FBQSxDQUFZLFVBQUEsSUFBQSxFQUFBO0FBQ1YsWUFBQSxRQUFBLEVBQUEsU0FBQTs7QUFEVSxxQ0FDYSxnQkFBQSxDQUFBLGVBQUEsQ0FBQSxVQUFBLENBQXZCLElBQXVCLENBRGI7O0FBQUE7O0FBQ1YsUUFBQSxTQURVO0FBQ1YsUUFBQSxRQURVOztBQUVWLFlBQUcsU0FBQSxJQUFBLElBQUEsSUFBZSxTQUFBLEtBQWxCLEtBQUEsRUFBQTtBQUNFLFVBQUEsSUFBQSxHQUFBLFFBQUE7QUNpQ0Q7O0FEaENELFlBQUcsSUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsSUFBQSxHQUFPLElBQUEsR0FBQSxHQUFBLEdBQVAsSUFBQTtBQ2tDRDs7QURqQ0QsZUFBQSxJQUFBO0FBTkYsT0FBQSxDQytCQTtBRGpDaUI7QUFoRGQ7QUFBQTtBQUFBLHFDQTBEVztBQUNkLFVBQUEsQ0FBQTtBQUFBLGFBQUEsWUFBQTtBQ3NDRSxZQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUE7QUR0Q1EsUUFBQSxHQUFBLEdBQUEsS0FBQSxLQUFBO0FBQUEsUUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQzBDTixVQUFBLENBQUMsR0FBRyxHQUFHLENBQVAsQ0FBTyxDQUFQOztBQUNBLGNEM0MyQixDQUFDLENBQUQsT0FBQSxDQUFBLEdBQUEsTUFBa0IsQ0FBQyxDQzJDOUMsRUQzQzhDO0FDNEM1QyxZQUFBLE9BQU8sQ0FBUCxJQUFBLENENUNFLENDNENGO0FBQ0Q7QUQ3Q0s7O0FDK0NSLGVBQUEsT0FBQTtBRC9DRixPQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQTtBQURjO0FBMURYO0FBQUE7QUFBQSx1Q0E0RGE7QUFDaEIsVUFBQSxHQUFBLEVBQUEsUUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLFlBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUE7O0FBQUEsVUFBRyxLQUFILFlBQUEsRUFBQTtBQUNFLGFBQUEsWUFBQSxHQUFBLEtBQUE7QUFDQSxRQUFBLFlBQUEsR0FBZSxDQUFDLEtBQUQsSUFBQSxFQUFBLE1BQUEsQ0FBZSxJQUFBLFNBQUEsQ0FBYyxLQUFBLE9BQUEsQ0FBZCxhQUFjLEVBQWQsRUFBd0M7QUFBQyxVQUFBLE1BQUEsRUFBRCxJQUFBO0FBQWUsVUFBQSxXQUFBLEVBQWYsS0FBQTtBQUFtQyxVQUFBLFlBQUEsRUFBYztBQUFqRCxTQUF4QyxFQUE5QixnQkFBOEIsRUFBZixDQUFmO0FBQ0EsUUFBQSxDQUFBLEdBQUEsQ0FBQTtBQUNBLFFBQUEsT0FBQSxHQUFBLEVBQUE7O0FDd0RBLGVEeERNLENBQUEsR0FBSSxZQUFZLENBQUMsTUN3RHZCLEVEeERBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sWUFBYSxDQUFuQixDQUFtQixDQUFuQjtBQUNBLFVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxTQUFBOztBQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDMERFLFlBQUEsUUFBUSxHQUFHLEdBQUcsQ0FBZCxDQUFjLENBQWQ7QUR6REEsWUFBQSxHQUFBLEdBQU0sUUFBUSxDQUFSLE1BQUEsQ0FBTixJQUFNLENBQU47O0FBQ0EsZ0JBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLG1CQUFBLE9BQUEsQ0FBQSxhQUFBLENBQUEsR0FBQTtBQUNBLGNBQUEsWUFBQSxHQUFlLFlBQVksQ0FBWixNQUFBLENBQW9CLElBQUEsU0FBQSxDQUFBLEdBQUEsRUFBbUI7QUFBQyxnQkFBQSxNQUFBLEVBQUQsSUFBQTtBQUFlLGdCQUFBLFdBQUEsRUFBZixLQUFBO0FBQW1DLGdCQUFBLFlBQUEsRUFBYztBQUFqRCxlQUFuQixFQUFuQyxnQkFBbUMsRUFBcEIsQ0FBZjtBQytERDtBRG5FSDs7QUNxRUEsVUFBQSxPQUFPLENBQVAsSUFBQSxDRGhFQSxDQUFBLEVDZ0VBO0FEdkVGOztBQ3lFQSxlQUFBLE9BQUE7QUFDRDtBRC9FZTtBQTVEYjtBQUFBO0FBQUEsMkJBeUVHLEdBekVILEVBeUVHO0FBQUEsVUFBSyxJQUFMLHVFQUFBLElBQUE7QUFDTixVQUFBLElBQUE7O0FBQUEsVUFBTyxHQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsZUFBQSxJQUFBO0FDdUVEOztBRHRFRCxNQUFBLElBQUEsR0FBTyxLQUFBLGtCQUFBLENBQW9CLEtBQTNCLGdCQUEyQixFQUFwQixDQUFQOztBQUNBLFVBQUcsSUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGVBQUEsSUFBQTtBQ3dFRDtBRDdFSztBQXpFSDtBQUFBO0FBQUEsdUNBK0VhO0FBQ2hCLFVBQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsUUFBQSxFQUFBLFlBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBOztBQUFBLFVBQU8sS0FBQSxJQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsZUFBQSxFQUFBO0FDNEVEOztBRDNFRCxXQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0EsTUFBQSxZQUFBLEdBQUEsRUFBQTs7QUFDQSxVQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsS0FBQSxRQUFBLEtBQUEsSUFBQSxHQUFBLENBQUEsSUFBQSxHQUFBLEdBQUEsQ0FBQSxVQUFBLEtBQUEsSUFBQSxHQUFBLElBQXdCLENBQXhCLEdBQUEsR0FBMEIsS0FBMUIsQ0FBQSxHQUEwQixLQUExQixDQUFBLE1BQWlDLEtBQWpDLElBQUEsRUFBQTtBQUNFLFFBQUEsWUFBQSxHQUFlLFlBQVksQ0FBWixNQUFBLENBQW9CLEtBQUEsMEJBQUEsQ0FBbkMsYUFBbUMsQ0FBcEIsQ0FBZjtBQzZFRDs7QUQ1RUQsTUFBQSxJQUFBLEdBQUEsS0FBQSxpQkFBQSxFQUFBOztBQUFBLFdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQTtBQytFRSxRQUFBLEtBQUssR0FBRyxJQUFJLENBQVosS0FBWSxDQUFaO0FEOUVBLFFBQUEsWUFBQSxHQUFlLFlBQVksQ0FBWixNQUFBLENBQW9CLEtBQUEsMEJBQUEsQ0FBQSxLQUFBLEVBQW5DLEtBQW1DLENBQXBCLENBQWY7QUFERjs7QUFFQSxNQUFBLElBQUEsR0FBQSxLQUFBLE9BQUEsQ0FBQSxhQUFBLEVBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNrRkUsUUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFYLENBQVcsQ0FBWDs7QURsRkYscUNBQ29CLGdCQUFBLENBQUEsZUFBQSxDQUFBLFVBQUEsQ0FBQSxJQUFBLEVBQWxCLElBQWtCLENBRHBCOztBQUFBOztBQUNFLFFBQUEsUUFERjtBQUNFLFFBQUEsSUFERjtBQUVFLFFBQUEsWUFBQSxHQUFlLFlBQVksQ0FBWixNQUFBLENBQW9CLEtBQUEsMEJBQUEsQ0FBQSxRQUFBLEVBQXNDLEtBQUEsaUJBQUEsQ0FBekUsSUFBeUUsQ0FBdEMsQ0FBcEIsQ0FBZjtBQUZGOztBQUdBLE1BQUEsSUFBQSxHQUFBLEtBQUEsY0FBQSxFQUFBOztBQUFBLFdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxJQUFBLEdBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDcUZFLFFBQUEsSUFBSSxHQUFHLElBQUksQ0FBWCxDQUFXLENBQVg7QURwRkEsUUFBQSxNQUFBLEdBQVMsS0FBQSxJQUFBLENBQUEsTUFBQSxDQUFULElBQVMsQ0FBVDs7QUFDQSxZQUFHLEtBQUEsVUFBQSxDQUFILE1BQUcsQ0FBSCxFQUFBO0FBQ0UsVUFBQSxZQUFZLENBQVosSUFBQSxDQUFBLE1BQUE7QUNzRkQ7QUR6Rkg7O0FBSUEsVUFBRyxLQUFILFlBQUEsRUFBQTtBQUNFLFFBQUEsUUFBQSxHQUFXLEtBQUEsSUFBQSxDQUFBLE1BQUEsQ0FBWCxVQUFXLENBQVg7O0FBQ0EsWUFBRyxLQUFBLFVBQUEsQ0FBSCxRQUFHLENBQUgsRUFBQTtBQUNFLFVBQUEsWUFBWSxDQUFaLElBQUEsQ0FBQSxRQUFBO0FBSEo7QUM0RkM7O0FEeEZELFdBQUEsWUFBQSxHQUFBLFlBQUE7QUFDQSxhQUFBLFlBQUE7QUFyQmdCO0FBL0ViO0FBQUE7QUFBQSwrQ0FxR3VCLE9Bckd2QixFQXFHdUI7QUFBQSxVQUFVLEtBQVYsdUVBQWtCLEtBQWxCLEtBQUE7QUFDMUIsVUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsWUFBQTtBQUFBLE1BQUEsWUFBQSxHQUFBLEVBQUE7QUFDQSxNQUFBLEtBQUEsR0FBUSxLQUFBLGlCQUFBLENBQVIsT0FBUSxDQUFSOztBQUNBLFdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDNkZFLFFBQUEsSUFBSSxHQUFHLEtBQUssQ0FBWixDQUFZLENBQVo7QUQ1RkEsUUFBQSxZQUFBLEdBQWUsWUFBWSxDQUFaLE1BQUEsQ0FBb0IsSUFBQSxTQUFBLENBQUEsS0FBQSxFQUFxQjtBQUFDLFVBQUEsTUFBQSxFQUFELElBQUE7QUFBZSxVQUFBLElBQUEsRUFBTTtBQUFyQixTQUFyQixFQUFuQyxnQkFBbUMsRUFBcEIsQ0FBZjtBQURGOztBQ21HQSxhRGpHQSxZQ2lHQTtBRHRHMEI7QUFyR3ZCO0FBQUE7QUFBQSxzQ0EyR2MsSUEzR2QsRUEyR2M7QUFDakIsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sS0FBQSxJQUFBLENBQUEsTUFBQSxDQUFOLElBQU0sQ0FBTjs7QUFDQSxVQUFHLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLEdBQUcsQ0FBSCxJQUFBOztBQUNBLFlBQUcsR0FBQSxDQUFBLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxDQUFBLEdBQUEsRUFBSyxHQUFHLENBQWYsVUFBWSxFQUFMLENBQVA7QUNxR0Q7O0FEcEdELGVBQU8sQ0FBUCxHQUFPLENBQVA7QUNzR0Q7O0FEckdELGFBQU8sQ0FBUCxHQUFPLENBQVA7QUFQaUI7QUEzR2Q7QUFBQTtBQUFBLCtCQW1ITyxHQW5IUCxFQW1ITztBQUNWLFVBQU8sR0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGVBQUEsS0FBQTtBQ3lHRDs7QUR4R0QsVUFBRyxHQUFHLENBQUgsSUFBQSxLQUFBLFVBQUEsSUFBMEIsT0FBQSxDQUFBLElBQUEsQ0FBTyxLQUFQLFNBQU8sRUFBUCxFQUFBLEdBQUEsS0FBN0IsQ0FBQSxFQUFBO0FBQ0UsZUFBQSxLQUFBO0FDMEdEOztBRHpHRCxhQUFPLENBQUMsS0FBRCxXQUFBLElBQWlCLEtBQUEsZUFBQSxDQUF4QixHQUF3QixDQUF4QjtBQUxVO0FBbkhQO0FBQUE7QUFBQSxnQ0F5SE07QUFDVCxVQUFBLEdBQUE7O0FBQUEsVUFBRyxDQUFBLENBQUEsR0FBQSxHQUFBLEtBQUEsUUFBQSxLQUFBLElBQUEsR0FBQSxHQUFBLENBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQSxLQUFILElBQUEsRUFBQTtBQUNFLGVBQU8sS0FBQSxRQUFBLENBQUEsVUFBQSxDQUFQLG1CQUFPLEVBQVA7QUM4R0Q7O0FEN0dELGFBQUEsRUFBQTtBQUhTO0FBekhOO0FBQUE7QUFBQSxvQ0E2SFksR0E3SFosRUE2SFk7QUFDZixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxLQUFSLGNBQVEsRUFBUjs7QUFDQSxVQUFHLEtBQUssQ0FBTCxNQUFBLEtBQUgsQ0FBQSxFQUFBO0FBQ0UsZUFBTyxHQUFHLENBQUgsSUFBQSxHQUFBLG9CQUFBLENBQWdDLEtBQU0sQ0FBN0MsQ0FBNkMsQ0FBdEMsQ0FBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sR0FBRyxDQUFILElBQUEsR0FBUCxZQUFPLEVBQVA7QUNrSEQ7QUR2SGM7QUE3SFo7QUFBQTtBQUFBLDZCQW1JSyxHQW5JTCxFQW1JSztBQUNSLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUcsQ0FBWCxLQUFBOztBQUNBLFVBQUcsR0FBRyxDQUFILElBQUEsS0FBSCxVQUFBLEVBQUE7QUFDSSxRQUFBLEtBQUEsSUFBQSxJQUFBO0FDc0hIOztBRHJIRCxhQUFBLEtBQUE7QUFKUTtBQW5JTDtBQUFBO0FBQUEsdUNBd0llLElBeElmLEVBd0llO0FBQ2xCLFVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxLQUFBOztBQUFBLFVBQUcsSUFBSSxDQUFKLE1BQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBQSxJQUFBO0FBQ0EsUUFBQSxTQUFBLEdBQUEsSUFBQTs7QUFDQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQzBIRSxVQUFBLENBQUMsR0FBRyxJQUFJLENBQVIsQ0FBUSxDQUFSO0FEekhBLFVBQUEsS0FBQSxHQUFRLEtBQUEsUUFBQSxDQUFSLENBQVEsQ0FBUjs7QUFDQSxjQUFJLElBQUEsSUFBQSxJQUFBLElBQVMsS0FBQSxJQUFiLFNBQUEsRUFBQTtBQUNFLFlBQUEsU0FBQSxHQUFBLEtBQUE7QUFDQSxZQUFBLElBQUEsR0FBQSxDQUFBO0FDMkhEO0FEL0hIOztBQUtBLGVBQUEsSUFBQTtBQzZIRDtBRHRJaUI7QUF4SWY7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUpBLElBQUEsUUFBQSxHQUFBLE9BQUEsQ0FBQSxXQUFBLENBQUE7O0FBQ0EsSUFBQSxTQUFBLEdBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQTs7QUFDQSxJQUFBLFdBQUEsR0FBQSxPQUFBLENBQUEsY0FBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsZ0JBQUEsR0FBQSxPQUFBLENBQUEsMkJBQUEsQ0FBQTs7QUFFQSxJQUFhLFdBQU47QUFBQTtBQUFBO0FBQ0wsdUJBQWEsSUFBYixFQUFhLE9BQWIsRUFBYTtBQUFBOztBQUFDLFNBQUEsR0FBQSxHQUFBLElBQUE7QUFBSyxTQUFBLE9BQUEsR0FBQSxPQUFBO0FBQU47O0FBRFI7QUFBQTtBQUFBLDJCQUdDO0FBQ0osVUFBQSxFQUFPLEtBQUEsT0FBQSxNQUFjLEtBQXJCLE1BQUEsQ0FBQSxFQUFBO0FBQ0UsYUFBQSxNQUFBLEdBQUEsSUFBQTs7QUFDQSxhQUFBLFVBQUE7O0FBQ0EsYUFBQSxXQUFBOztBQUNBLFlBQUcsS0FBQSxNQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBQSxNQUFBLENBQUEsSUFBQTtBQUxKO0FDd0JDOztBRGxCRCxhQUFBLElBQUE7QUFQSTtBQUhEO0FBQUE7QUFBQSw2QkFXSSxJQVhKLEVBV0ksR0FYSixFQVdJO0FDc0JQLGFEckJBLEtBQUEsS0FBQSxDQUFBLElBQUEsSUFBZSxHQ3FCZjtBRHRCTztBQVhKO0FBQUE7QUFBQSw4QkFhSyxHQWJMLEVBYUs7QUN3QlIsYUR2QkEsS0FBQSxNQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0N1QkE7QUR4QlE7QUFiTDtBQUFBO0FBQUEsaUNBZU87QUFDVixVQUFPLEtBQUEsT0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGFBQUEsT0FBQSxHQUFXLElBQUksUUFBQSxDQUFmLE9BQVcsRUFBWDtBQzBCRDs7QUR6QkQsYUFBTyxLQUFBLE9BQUEsSUFBWSxJQUFJLFFBQUEsQ0FBdkIsT0FBbUIsRUFBbkI7QUFIVTtBQWZQO0FBQUE7QUFBQSw4QkFtQk0sT0FuQk4sRUFtQk07QUFDVCxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxLQUFBLFVBQUEsR0FBQSxTQUFBLENBQUEsT0FBQSxFQUFnQztBQUFBLFFBQUEsVUFBQSxFQUFXLEtBQUEsb0JBQUE7QUFBWCxPQUFoQyxDQUFUO0FBQ0EsTUFBQSxNQUFNLENBQU4sUUFBQSxHQUFBLElBQUE7QUFDQSxhQUFBLE1BQUE7QUFIUztBQW5CTjtBQUFBO0FBQUEsaUNBdUJPO0FBQ1YsVUFBQSxHQUFBOztBQUFBLFVBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsYUFBQSxHQUFBLENBQUEsSUFBQTtBQUNBLFFBQUEsR0FBQSxHQUFNLEtBQUEsVUFBQSxNQUFpQixLQUF2QixHQUFBO0FBQ0EsUUFBQSxHQUFHLENBQUgsSUFBQTs7QUFDQSxZQUFHLEdBQUEsQ0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBQSxNQUFBLEdBQVUsSUFBSSxHQUFHLENBQVAsR0FBQSxDQUFWLElBQVUsQ0FBVjtBQUNBLGlCQUFPLEtBQVAsTUFBQTtBQU5KO0FDMENDO0FEM0NTO0FBdkJQO0FBQUE7QUFBQSxrQ0ErQlE7QUN1Q1gsYUR0Q0EsS0FBQSxLQUFBLEdBQVMsS0FBQSxXQUFBLEVDc0NUO0FEdkNXO0FBL0JSO0FBQUE7QUFBQSwyQ0FpQ2lCO0FBQ3BCLGFBQUEsRUFBQTtBQURvQjtBQWpDakI7QUFBQTtBQUFBLDhCQW1DSTtBQUNQLGFBQU8sS0FBQSxHQUFBLElBQVAsSUFBQTtBQURPO0FBbkNKO0FBQUE7QUFBQSx3Q0FxQ2M7QUFDakIsVUFBQSxPQUFBOztBQUFBLFVBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsWUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxLQUFBLE1BQUEsQ0FBUCxpQkFBTyxFQUFQO0FDOENEOztBRDdDRCxRQUFBLE9BQUEsR0FBVSxLQUFWLGVBQVUsRUFBVjs7QUFDQSxZQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxPQUFPLENBQWQsaUJBQU8sRUFBUDtBQytDRDs7QUQ5Q0QsZUFBTyxLQUFBLEdBQUEsQ0FBUCxpQkFBTyxFQUFQO0FDZ0REOztBRC9DRCxhQUFBLEtBQUE7QUFSaUI7QUFyQ2Q7QUFBQTtBQUFBLGtDQThDUTtBQUNYLFVBQUEsT0FBQSxFQUFBLEdBQUE7O0FBQUEsVUFBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBQSxFQUFBO0FBQ0EsUUFBQSxPQUFBLEdBQVUsS0FBVixVQUFVLEVBQVY7O0FBQ0EsWUFBRyxPQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFOLE1BQUEsQ0FBQSxHQUFBLEVBQWtCLE9BQU8sQ0FBL0IsV0FBd0IsRUFBbEIsQ0FBTjtBQ29ERDs7QURuREQsUUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFOLE1BQUEsQ0FBQSxHQUFBLEVBQWtCLEtBQUEsR0FBQSxDQUF4QixRQUFNLENBQU47O0FBQ0EsWUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsS0FBQSxNQUFBLENBQXhCLFdBQXdCLEVBQWxCLENBQU47QUNxREQ7O0FEcERELGVBQUEsR0FBQTtBQVJGLE9BQUEsTUFBQTtBQytERSxlRHJEQSxFQ3FEQTtBQUNEO0FEakVVO0FBOUNSO0FBQUE7QUFBQSxpQ0EwRE87QUFDVixVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFlBQU8sS0FBQSxVQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsZUFBQSxlQUFBO0FDeUREOztBRHhERCxlQUFPLEtBQUEsVUFBQSxJQUFQLElBQUE7QUMwREQ7QUQ5RFM7QUExRFA7QUFBQTtBQUFBLHNDQStEWTtBQUNmLFVBQUEsT0FBQTs7QUFBQSxVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFlBQUcsS0FBQSxlQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sS0FBQSxlQUFBLElBQVAsSUFBQTtBQzhERDs7QUQ3REQsWUFBRyxLQUFBLEdBQUEsQ0FBQSxPQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsVUFBQSxPQUFBLEdBQVUsS0FBVixHQUFBOztBQUNBLGlCQUFNLE9BQUEsSUFBQSxJQUFBLElBQWEsT0FBQSxDQUFBLE9BQUEsSUFBbkIsSUFBQSxFQUFBO0FBQ0UsWUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFQLGtCQUFBLENBQTJCLEtBQUEsU0FBQSxDQUFXLEtBQUEsWUFBQSxDQUFjLE9BQU8sQ0FBckUsT0FBZ0QsQ0FBWCxDQUEzQixDQUFWOztBQUNBLGdCQUFPLEtBQUEsVUFBQSxJQUFQLElBQUEsRUFBQTtBQUNFLG1CQUFBLFVBQUEsR0FBYyxPQUFBLElBQWQsS0FBQTtBQytERDtBRGxFSDs7QUFJQSxlQUFBLGVBQUEsR0FBbUIsT0FBQSxJQUFuQixLQUFBO0FBQ0EsaUJBQUEsT0FBQTtBQVZKO0FDNEVDO0FEN0VjO0FBL0RaO0FBQUE7QUFBQSxpQ0EyRVMsT0EzRVQsRUEyRVM7QUNxRVosYURwRUEsT0NvRUE7QURyRVk7QUEzRVQ7QUFBQTtBQUFBLGlDQTZFTztBQUNWLFVBQUEsR0FBQTs7QUFBQSxVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFlBQUcsS0FBQSxVQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sS0FBUCxVQUFBO0FDd0VEOztBRHZFRCxRQUFBLEdBQUEsR0FBTSxLQUFBLEdBQUEsQ0FBQSxrQkFBQSxDQUF3QixLQUE5QixVQUE4QixFQUF4QixDQUFOOztBQUNBLFlBQUcsS0FBQSxNQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFOLE1BQUEsQ0FBQSxHQUFBLEVBQWtCLEtBQUEsTUFBQSxDQUF4QixVQUF3QixFQUFsQixDQUFOO0FDeUVEOztBRHhFRCxhQUFBLFVBQUEsR0FBQSxHQUFBO0FBQ0EsZUFBQSxHQUFBO0FDMEVEO0FEbEZTO0FBN0VQO0FBQUE7QUFBQSw4QkFzRk0sR0F0Rk4sRUFzRk07QUFDVCxVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxLQUFWLFVBQVUsRUFBVjs7QUFDQSxVQUFHLE9BQUEsSUFBQSxJQUFBLElBQWEsR0FBQSxJQUFoQixPQUFBLEVBQUE7QUFDRSxlQUFPLE9BQVEsQ0FBZixHQUFlLENBQWY7QUM4RUQ7QURqRlE7QUF0Rk47QUFBQTtBQUFBLDZCQTBGSyxLQTFGTCxFQTBGSztBQUFBLFVBQVEsTUFBUix1RUFBQSxJQUFBO0FBQ1IsVUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBOztBQUFBLFVBQW1CLENBQUEsR0FBQSxXQUFBLEtBQUEsQ0FBQSxNQUFBLFFBQUEsSUFBQyxHQUFBLEtBQXBCLFFBQUEsRUFBQTtBQUFBLFFBQUEsS0FBQSxHQUFRLENBQVIsS0FBUSxDQUFSO0FDbUZDOztBRGxGRCxXQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQ29GRSxRQUFBLENBQUMsR0FBRyxLQUFLLENBQVQsQ0FBUyxDQUFUOztBRG5GQSxZQUFvQixLQUFBLEtBQUEsQ0FBQSxDQUFBLEtBQXBCLElBQUEsRUFBQTtBQUFBLGlCQUFPLEtBQUEsS0FBQSxDQUFQLENBQU8sQ0FBUDtBQ3NGQzs7QURyRkQsWUFBcUIsS0FBQSxNQUFBLENBQUEsQ0FBQSxLQUFyQixJQUFBLEVBQUE7QUFBQSxpQkFBTyxLQUFBLE1BQUEsQ0FBUCxDQUFPLENBQVA7QUN3RkM7QUQxRkg7O0FBR0EsYUFBQSxNQUFBO0FBTFE7QUExRkw7QUFBQTtBQUFBLGlDQWdHUyxLQWhHVCxFQWdHUztBQUFBLFVBQVEsTUFBUix1RUFBQSxJQUFBO0FBQ1osVUFBQSxTQUFBLEVBQUEsR0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLENBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFaLENBQVksQ0FBWjtBQUNBLE1BQUEsR0FBQSxHQUFNLEtBQUEsUUFBQSxDQUFBLEtBQUEsRUFBTixNQUFNLENBQU47QUM2RkEsYUQ1RkEsQ0FBQyxTQUFTLENBQVQsUUFBQSxDQUFBLEdBQUEsQ0M0RkQ7QUQvRlk7QUFoR1Q7QUFBQTtBQUFBLG1DQW9HUztBQUNaLFVBQUEsR0FBQTs7QUFBQSxVQUFHLENBQUEsQ0FBQSxHQUFBLEdBQUEsS0FBQSxPQUFBLENBQUEsUUFBQSxLQUFBLElBQUEsR0FBQSxHQUFBLENBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQSxLQUFILElBQUEsRUFBQTtBQUNFLGVBQU8sS0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBLFVBQUEsQ0FBUCxtQkFBTyxFQUFQO0FDZ0dEOztBRC9GRCxhQUFBLEVBQUE7QUFIWTtBQXBHVDtBQUFBO0FBQUEsMENBd0dnQjtBQUNuQixhQUFPLEtBQUEsWUFBQSxHQUFBLE1BQUEsQ0FBdUIsQ0FBQyxLQUEvQixHQUE4QixDQUF2QixDQUFQO0FBRG1CO0FBeEdoQjtBQUFBO0FBQUEsc0NBMEdZO0FBQ2YsVUFBQSxHQUFBOztBQUFBLFVBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsWUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxLQUFBLE1BQUEsQ0FBUCxPQUFPLEVBQVA7QUNzR0Q7O0FEckdELFFBQUEsR0FBQSxHQUFNLEtBQUEsZUFBQSxNQUFzQixLQUE1QixHQUFBO0FBQ0EsUUFBQSxHQUFHLENBQUgsSUFBQTs7QUFDQSxZQUFHLEdBQUEsQ0FBQSxZQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sR0FBRyxDQUFILFlBQUEsQ0FBUCxJQUFPLENBQVA7QUFOSjtBQzhHQztBRC9HYztBQTFHWjtBQUFBO0FBQUEsZ0NBa0hNO0FBQ1QsVUFBQSxHQUFBOztBQUFBLFVBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsWUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxLQUFBLE1BQUEsQ0FBUCxNQUFPLEVBQVA7QUM0R0Q7O0FEM0dELFFBQUEsR0FBQSxHQUFNLEtBQUEsZUFBQSxNQUFzQixLQUE1QixHQUFBO0FBQ0EsUUFBQSxHQUFHLENBQUgsSUFBQTs7QUFDQSxZQUFHLEdBQUEsQ0FBQSxXQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sR0FBRyxDQUFILFdBQUEsQ0FBUCxJQUFPLENBQVA7QUM2R0Q7O0FENUdELFlBQUcsR0FBQSxDQUFBLFNBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxHQUFHLENBQVYsU0FBQTtBQVJKO0FDdUhDO0FEeEhRO0FBbEhOO0FBQUE7QUFBQSw2QkE0SEc7QUFBQTs7QUFDTixXQUFBLElBQUE7O0FBQ0EsVUFBRyxLQUFILGlCQUFHLEVBQUgsRUFBQTtBQ2tIRSxlRGpIQSxDQUFBLEdBQUEsZ0JBQUEsQ0FBQSxlQUFBLEVBQWdCLEtBQWhCLFNBQWdCLEVBQWhCLEVBQUEsSUFBQSxDQUFvQyxVQUFBLEdBQUQsRUFBQTtBQUNqQyxjQUFBLFVBQUEsRUFBQSxNQUFBOztBQUFBLGNBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFlBQUEsR0FBQSxHQUFNLEtBQUEsQ0FBQSxZQUFBLENBQU4sR0FBTSxDQUFOOztBQUNBLGdCQUFHLEdBQUcsQ0FBSCxNQUFBLEdBQUEsQ0FBQSxJQUFtQixLQUFBLENBQUEsU0FBQSxDQUFBLE9BQUEsRUFBdEIsS0FBc0IsQ0FBdEIsRUFBQTtBQUNFLGNBQUEsTUFBQSxHQUFTLEtBQUEsQ0FBQSxnQkFBQSxDQUFULEdBQVMsQ0FBVDtBQUNBLGNBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBWixRQUFNLEVBQU47QUNtSEQ7O0FEbEhELGdCQUFHLFVBQUEsR0FBYSxLQUFBLENBQUEsU0FBQSxDQUFBLGFBQUEsRUFBaEIsS0FBZ0IsQ0FBaEIsRUFBQTtBQUNFLGNBQUEsR0FBQSxHQUFNLFVBQUEsQ0FBQSxHQUFBLEVBQU4sS0FBTSxDQUFOO0FDb0hEOztBRG5IRCxtQkFBQSxHQUFBO0FDcUhEO0FEN0hILFNBQUEsRUFBQSxNQUFBLEVDaUhBO0FBY0Q7QURsSUs7QUE1SEg7QUFBQTtBQUFBLHVDQXlJYTtBQUFBLFVBQUMsR0FBRCx1RUFBQSxFQUFBO0FBQ2hCLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksU0FBQSxDQUFKLFFBQUEsQ0FBYSxJQUFJLFdBQUEsQ0FBSixVQUFBLENBQWIsR0FBYSxDQUFiLEVBQWtDO0FBQUMsUUFBQSxVQUFBLEVBQVc7QUFBWixPQUFsQyxDQUFUO0FBQ0EsTUFBQSxNQUFNLENBQU4sV0FBQSxHQUFBLEtBQUE7QUFDQSxhQUFBLE1BQUE7QUFIZ0I7QUF6SWI7QUFBQTtBQUFBLGdDQTZJTTtBQUNULGFBQUEsQ0FBQTtBQURTO0FBN0lOO0FBQUE7QUFBQSxpQ0ErSVMsSUEvSVQsRUErSVM7QUFDWixVQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLElBQUksQ0FBSixPQUFBLENBQUEsS0FBQSxFQUFQLElBQU8sQ0FBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQUEsSUFBQTtBQ2dJRDtBRHBJVztBQS9JVDtBQUFBO0FBQUEsZ0NBb0pRLElBcEpSLEVBb0pRO0FBQ1gsYUFBTyxhQUFBLENBQUEsWUFBQSxDQUFBLGNBQUEsQ0FBQSxJQUFBLEVBQWlDLEtBQWpDLFNBQWlDLEVBQWpDLEVBQVAsR0FBTyxDQUFQO0FBRFc7QUFwSlI7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVOQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsV0FBQSxDQUFBOztBQUNBLElBQUEsUUFBQSxHQUFBLE9BQUEsQ0FBQSxXQUFBLENBQUE7O0FBQ0EsSUFBQSxzQkFBQSxHQUFBLE9BQUEsQ0FBQSx5QkFBQSxDQUFBOztBQUNBLElBQUEsV0FBQSxHQUFBLE9BQUEsQ0FBQSxjQUFBLENBQUE7O0FBQ0EsSUFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLFdBQUEsQ0FBQTs7QUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLENBQUEsVUFBQSxDQUFBOztBQUNBLElBQUEsY0FBQSxHQUFBLE9BQUEsQ0FBQSw2QkFBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSxnQkFBQSxDQUFBOztBQUVBLElBQWEsUUFBQSxHQUFBLFlBQUE7QUFBQSxNQUFOLFFBQU07QUFBQTtBQUFBO0FBQ1gsc0JBQWEsTUFBYixFQUFhO0FBQUEsVUFBVSxPQUFWLHVFQUFBLEVBQUE7O0FBQUE7O0FBQ1gsVUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFEWSxXQUFBLE1BQUEsR0FBQSxNQUFBO0FBQ1osTUFBQSxRQUFRLENBQVIsSUFBQTtBQUNBLFdBQUEsTUFBQSxHQUFBLDBCQUFBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsRUFBQTtBQUVBLE1BQUEsUUFBQSxHQUFXO0FBQ1QsbUJBRFMsSUFBQTtBQUVULGdCQUZTLEdBQUE7QUFHVCxxQkFIUyxHQUFBO0FBSVQseUJBSlMsR0FBQTtBQUtULHNCQUxTLEdBQUE7QUFNVCx1QkFOUyxJQUFBO0FBT1Qsc0JBQWU7QUFQTixPQUFYO0FBU0EsV0FBQSxNQUFBLEdBQVUsT0FBUSxDQUFsQixRQUFrQixDQUFsQjtBQUVBLFdBQUEsTUFBQSxHQUFhLEtBQUEsTUFBQSxJQUFBLElBQUEsR0FBYyxLQUFBLE1BQUEsQ0FBQSxNQUFBLEdBQWQsQ0FBQSxHQUFiLENBQUE7O0FBRUEsV0FBQSxHQUFBLElBQUEsUUFBQSxFQUFBO0FDMkJJLFFBQUEsR0FBRyxHQUFHLFFBQVEsQ0FBZCxHQUFjLENBQWQ7O0FEMUJGLFlBQUcsR0FBQSxJQUFILE9BQUEsRUFBQTtBQUNFLGVBQUEsR0FBQSxJQUFZLE9BQVEsQ0FBcEIsR0FBb0IsQ0FBcEI7QUFERixTQUFBLE1BRUssSUFBRyxLQUFBLE1BQUEsSUFBQSxJQUFBLElBQWEsR0FBQSxLQUFoQixRQUFBLEVBQUE7QUFDSCxlQUFBLEdBQUEsSUFBWSxLQUFBLE1BQUEsQ0FBWixHQUFZLENBQVo7QUFERyxTQUFBLE1BQUE7QUFHSCxlQUFBLEdBQUEsSUFBQSxHQUFBO0FDNEJDO0FEbENMOztBQU9BLFVBQTBCLEtBQUEsTUFBQSxJQUExQixJQUFBLEVBQUE7QUFBQSxhQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsSUFBQTtBQytCRzs7QUQ3QkgsV0FBQSxPQUFBLEdBQVcsSUFBSSxRQUFBLENBQUosT0FBQSxDQUFYLElBQVcsQ0FBWDs7QUFDQSxVQUFHLEtBQUEsVUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGFBQUEsT0FBQSxDQUFBLE1BQUEsR0FBa0IsS0FBQSxVQUFBLENBQWxCLE9BQUE7QUMrQkM7O0FEN0JILFdBQUEsTUFBQSxHQUFVLElBQUksT0FBQSxDQUFkLE1BQVUsRUFBVjtBQS9CVzs7QUFERjtBQUFBO0FBQUEsd0NBa0NNO0FBQUE7O0FBQ2YsYUFBQSxPQUFBLEdBQVcsSUFBSSxRQUFBLENBQWYsT0FBVyxFQUFYO0FBQ0EsYUFBQSxNQUFBLENBQUEsR0FBQSxDQUFBLGdCQUFBO0FDZ0NFLGVEL0JGLEtBQUEsY0FBQSxHQUFBLElBQUEsQ0FBdUIsWUFBQTtBQ2dDbkIsaUJEL0JGLEtBQUEsQ0FBQSxPQUFBLEdBQVcsSUMrQlQ7QURoQ0osU0FBQSxDQytCRTtBRGxDYTtBQWxDTjtBQUFBO0FBQUEsdUNBdUNLO0FBQ2QsWUFBRyxLQUFBLE1BQUEsQ0FBSCxtQkFBRyxFQUFILEVBQUE7QUNtQ0ksaUJEbENGLEtBQUEsYUFBQSxDQUFlLEtBQUEsTUFBQSxDQUFmLFdBQWUsRUFBZixDQ2tDRTtBRG5DSixTQUFBLE1BQUE7QUNxQ0ksaUJEbENGLEtBQUEsUUFBQSxDQUFVLEtBQUEsTUFBQSxDQUFWLFlBQVUsRUFBVixDQ2tDRTtBQUNEO0FEdkNXO0FBdkNMO0FBQUE7QUFBQSwrQkE0Q0QsR0E1Q0MsRUE0Q0Q7QUFDUixZQUFPLEdBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxnQkFBTSxJQUFBLEtBQUEsQ0FBTiwwQkFBTSxDQUFOO0FDc0NDOztBQUNELGVEdENGLEtBQUEsYUFBQSxDQUFlLENBQWYsR0FBZSxDQUFmLENDc0NFO0FEekNNO0FBNUNDO0FBQUE7QUFBQSxvQ0FnREksUUFoREosRUFnREk7QUFBQTs7QUN5Q1gsZUR4Q0YsT0FBTyxDQUFQLE9BQUEsR0FBQSxJQUFBLENBQXVCLFlBQUE7QUFDckIsY0FBQSxHQUFBOztBQUFBLGNBQUcsUUFBUSxDQUFSLE1BQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxZQUFBLEdBQUEsR0FBTSxNQUFBLENBQUEsWUFBQSxDQUFjLFFBQVMsQ0FBVCxDQUFTLENBQVQsQ0FBcEIsR0FBTSxDQUFOOztBQUNBLGdCQUFHLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxrQkFBRyxRQUFRLENBQVIsTUFBQSxHQUFILENBQUEsRUFBQTtBQUNFLGdCQUFBLEdBQUcsQ0FBSCxXQUFBLENBQUEsUUFBQTtBQzBDQzs7QUR6Q0gsY0FBQSxHQUFHLENBQUgsSUFBQTs7QUFDQSxjQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxDQUFBLEdBQUE7O0FDMkNFLHFCRDFDRixHQUFHLENBQUgsT0FBQSxFQzBDRTtBRC9DSixhQUFBLE1BQUE7QUFPRSxrQkFBRyxRQUFTLENBQVQsQ0FBUyxDQUFULENBQUEsS0FBQSxLQUFxQixRQUFTLENBQVQsQ0FBUyxDQUFULENBQXhCLEdBQUEsRUFBQTtBQzJDSSx1QkQxQ0YsTUFBQSxDQUFBLFVBQUEsQ0FBQSxRQUFBLENDMENFO0FEM0NKLGVBQUEsTUFBQTtBQzZDSSx1QkQxQ0YsTUFBQSxDQUFBLGdCQUFBLENBQUEsUUFBQSxDQzBDRTtBRHBETjtBQUZGO0FDeURHO0FEMURMLFNBQUEsQ0N3Q0U7QUR6Q1c7QUFoREo7QUFBQTtBQUFBLG1DQStERyxHQS9ESCxFQStERztBQUNaLFlBQUEsSUFBQSxFQUFBLElBQUE7O0FBQUEsWUFBRyxLQUFBLGlCQUFBLENBQUEsR0FBQSxLQUE0QixLQUFBLGlCQUFBLENBQTVCLEdBQTRCLENBQTVCLElBQXdELEtBQUEsZUFBQSxDQUFBLEdBQUEsSUFBQSxDQUFBLEtBQTNELENBQUEsRUFBQTtBQUNFLFVBQUEsSUFBQSxHQUFPLEdBQUEsR0FBSSxLQUFBLE9BQUEsQ0FBWCxNQUFBO0FBQ0EsVUFBQSxJQUFBLEdBQUEsR0FBQTtBQUZGLFNBQUEsTUFBQTtBQUlFLGNBQUcsS0FBQSxpQkFBQSxDQUFBLEdBQUEsS0FBNEIsS0FBQSxlQUFBLENBQUEsR0FBQSxJQUFBLENBQUEsS0FBL0IsQ0FBQSxFQUFBO0FBQ0UsWUFBQSxHQUFBLElBQU8sS0FBQSxPQUFBLENBQVAsTUFBQTtBQ2tEQzs7QURqREgsVUFBQSxJQUFBLEdBQU8sS0FBQSxjQUFBLENBQVAsR0FBTyxDQUFQOztBQUNBLGNBQU8sSUFBQSxJQUFQLElBQUEsRUFBQTtBQUNFLG1CQUFBLElBQUE7QUNtREM7O0FEbERILFVBQUEsSUFBQSxHQUFPLEtBQUEsY0FBQSxDQUFnQixHQUFBLEdBQXZCLENBQU8sQ0FBUDs7QUFDQSxjQUFJLElBQUEsSUFBQSxJQUFBLElBQVMsS0FBQSxlQUFBLENBQUEsSUFBQSxJQUFBLENBQUEsS0FBYixDQUFBLEVBQUE7QUFDRSxtQkFBQSxJQUFBO0FBWEo7QUNnRUc7O0FEcERILGVBQU8sSUFBSSxzQkFBQSxDQUFKLHFCQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBb0MsS0FBQSxNQUFBLENBQUEsVUFBQSxDQUFBLElBQUEsRUFBd0IsSUFBQSxHQUFLLEtBQUEsT0FBQSxDQUF4RSxNQUEyQyxDQUFwQyxDQUFQO0FBYlk7QUEvREg7QUFBQTtBQUFBLGdDQTZFRjtBQUFBLFlBQUMsS0FBRCx1RUFBQSxDQUFBO0FBQ1AsWUFBQSxTQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUE7QUFBQSxRQUFBLEdBQUEsR0FBQSxLQUFBOztBQUNBLGVBQU0sQ0FBQSxHQUFJLEtBQUEsV0FBQSxDQUFBLEdBQUEsRUFBa0IsQ0FBQyxLQUFELE9BQUEsRUFBNUIsSUFBNEIsQ0FBbEIsQ0FBVixFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFELEdBQUEsR0FBUSxDQUFDLENBQUQsR0FBQSxDQUFkLE1BQUE7O0FBQ0EsY0FBRyxDQUFDLENBQUQsR0FBQSxLQUFTLEtBQVosT0FBQSxFQUFBO0FBQ0UsZ0JBQUcsT0FBQSxTQUFBLEtBQUEsV0FBQSxJQUFBLFNBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxxQkFBTyxJQUFJLHNCQUFBLENBQUoscUJBQUEsQ0FBQSxJQUFBLEVBQUEsU0FBQSxFQUEyQyxLQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsU0FBQSxFQUE4QixDQUFDLENBQUQsR0FBQSxHQUFNLEtBQUEsT0FBQSxDQUF0RixNQUFrRCxDQUEzQyxDQUFQO0FBREYsYUFBQSxNQUFBO0FBR0UsY0FBQSxTQUFBLEdBQVksQ0FBQyxDQUFiLEdBQUE7QUFKSjtBQUFBLFdBQUEsTUFBQTtBQU1FLFlBQUEsU0FBQSxHQUFBLElBQUE7QUMwREM7QURsRUw7O0FDb0VFLGVEM0RGLElDMkRFO0FEdEVLO0FBN0VFO0FBQUE7QUFBQSx3Q0F5Rk07QUFBQSxZQUFDLEdBQUQsdUVBQUEsQ0FBQTtBQUNmLFlBQUEsYUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQTtBQUFBLFFBQUEsSUFBQSxHQUFBLEdBQUE7QUFDQSxRQUFBLGFBQUEsR0FBZ0IsS0FBQSxPQUFBLEdBQVcsS0FBM0IsU0FBQTs7QUFDQSxlQUFNLENBQUEsQ0FBQSxHQUFBLEtBQUEsUUFBQSxDQUFBLElBQUEsRUFBQSxhQUFBLENBQUEsS0FBTixJQUFBLEVBQUE7QUFDRSxjQUFHLEdBQUEsR0FBTSxLQUFBLFlBQUEsQ0FBYyxDQUFBLEdBQUUsYUFBYSxDQUF0QyxNQUFTLENBQVQsRUFBQTtBQUNFLFlBQUEsSUFBQSxHQUFPLEdBQUcsQ0FBVixTQUFPLEVBQVA7O0FBQ0EsZ0JBQUcsR0FBRyxDQUFILEdBQUEsR0FBSCxHQUFBLEVBQUE7QUFDRSxxQkFBQSxHQUFBO0FBSEo7QUFBQSxXQUFBLE1BQUE7QUFLRSxZQUFBLElBQUEsR0FBTyxDQUFBLEdBQUUsYUFBYSxDQUF0QixNQUFBO0FDZ0VDO0FEdEVMOztBQ3dFRSxlRGpFRixJQ2lFRTtBRDNFYTtBQXpGTjtBQUFBO0FBQUEsd0NBb0dRLEdBcEdSLEVBb0dRO0FBQ2pCLGVBQU8sS0FBQSxNQUFBLENBQUEsVUFBQSxDQUFtQixHQUFBLEdBQUksS0FBQSxPQUFBLENBQXZCLE1BQUEsRUFBQSxHQUFBLE1BQStDLEtBQXRELE9BQUE7QUFEaUI7QUFwR1I7QUFBQTtBQUFBLHdDQXNHUSxHQXRHUixFQXNHUTtBQUNqQixlQUFPLEtBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLEVBQXVCLEdBQUEsR0FBSSxLQUFBLE9BQUEsQ0FBM0IsTUFBQSxNQUErQyxLQUF0RCxPQUFBO0FBRGlCO0FBdEdSO0FBQUE7QUFBQSxzQ0F3R00sS0F4R04sRUF3R007QUFDZixZQUFBLENBQUE7QUFBQSxRQUFBLENBQUEsR0FBQSxDQUFBOztBQUNBLGVBQU0sQ0FBQSxLQUFBLEdBQUEsS0FBQSxjQUFBLENBQUEsS0FBQSxDQUFBLEtBQU4sSUFBQSxFQUFBO0FBQ0UsVUFBQSxDQUFBO0FBREY7O0FBRUEsZUFBQSxDQUFBO0FBSmU7QUF4R047QUFBQTtBQUFBLGdDQTZHQSxHQTdHQSxFQTZHQTtBQUNULGVBQU8sS0FBQSxNQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsRUFBdUIsR0FBQSxHQUF2QixDQUFBLE1BQUEsSUFBQSxJQUF5QyxHQUFBLEdBQUEsQ0FBQSxJQUFXLEtBQUEsTUFBQSxDQUEzRCxPQUEyRCxFQUEzRDtBQURTO0FBN0dBO0FBQUE7QUFBQSxxQ0ErR0ssS0EvR0wsRUErR0s7QUFDZCxlQUFPLEtBQUEsY0FBQSxDQUFBLEtBQUEsRUFBc0IsQ0FBN0IsQ0FBTyxDQUFQO0FBRGM7QUEvR0w7QUFBQTtBQUFBLHFDQWlISyxLQWpITCxFQWlISztBQUFBLFlBQU8sU0FBUCx1RUFBQSxDQUFBO0FBQ2QsWUFBQSxDQUFBO0FBQUEsUUFBQSxDQUFBLEdBQUksS0FBQSxXQUFBLENBQUEsS0FBQSxFQUFvQixDQUFDLEtBQUQsT0FBQSxFQUFwQixJQUFvQixDQUFwQixFQUFKLFNBQUksQ0FBSjs7QUFFQSxZQUFTLENBQUEsSUFBTSxDQUFDLENBQUQsR0FBQSxLQUFTLEtBQXhCLE9BQUEsRUFBQTtBQ2dGSSxpQkRoRkosQ0FBQyxDQUFDLEdDZ0ZFO0FBQ0Q7QURwRlc7QUFqSEw7QUFBQTtBQUFBLCtCQXFIRCxLQXJIQyxFQXFIRCxNQXJIQyxFQXFIRDtBQUNSLGVBQU8sS0FBQSxRQUFBLENBQUEsS0FBQSxFQUFBLE1BQUEsRUFBdUIsQ0FBOUIsQ0FBTyxDQUFQO0FBRFE7QUFySEM7QUFBQTtBQUFBLCtCQXVIRCxLQXZIQyxFQXVIRCxNQXZIQyxFQXVIRDtBQUFBLFlBQWMsU0FBZCx1RUFBQSxDQUFBO0FBQ1IsWUFBQSxDQUFBO0FBQUEsUUFBQSxDQUFBLEdBQUksS0FBQSxXQUFBLENBQUEsS0FBQSxFQUFvQixDQUFwQixNQUFvQixDQUFwQixFQUFKLFNBQUksQ0FBSjs7QUFDQSxZQUFBLENBQUEsRUFBQTtBQ3VGSSxpQkR2RkosQ0FBQyxDQUFDLEdDdUZFO0FBQ0Q7QUQxRks7QUF2SEM7QUFBQTtBQUFBLGtDQTJIRSxLQTNIRixFQTJIRSxPQTNIRixFQTJIRTtBQUFBLFlBQWUsU0FBZix1RUFBQSxDQUFBO0FBQ1gsZUFBTyxLQUFBLE1BQUEsQ0FBQSxXQUFBLENBQUEsS0FBQSxFQUFBLE9BQUEsRUFBUCxTQUFPLENBQVA7QUFEVztBQTNIRjtBQUFBO0FBQUEsdUNBOEhPLFFBOUhQLEVBOEhPLE9BOUhQLEVBOEhPLE9BOUhQLEVBOEhPO0FBQUEsWUFBMEIsU0FBMUIsdUVBQUEsQ0FBQTtBQUNoQixZQUFBLENBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQTtBQUFBLFFBQUEsR0FBQSxHQUFBLFFBQUE7QUFDQSxRQUFBLE1BQUEsR0FBQSxDQUFBOztBQUNBLGVBQU0sQ0FBQSxHQUFJLEtBQUEsV0FBQSxDQUFBLEdBQUEsRUFBaUIsQ0FBQSxPQUFBLEVBQWpCLE9BQWlCLENBQWpCLEVBQVYsU0FBVSxDQUFWLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxDQUFDLENBQUQsR0FBQSxJQUFZLFNBQUEsR0FBQSxDQUFBLEdBQW1CLENBQUMsQ0FBRCxHQUFBLENBQW5CLE1BQUEsR0FBbEIsQ0FBTSxDQUFOOztBQUNBLGNBQUcsQ0FBQyxDQUFELEdBQUEsTUFBYSxTQUFBLEdBQUEsQ0FBQSxHQUFBLE9BQUEsR0FBaEIsT0FBRyxDQUFILEVBQUE7QUFDRSxnQkFBRyxNQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0UsY0FBQSxNQUFBO0FBREYsYUFBQSxNQUFBO0FBR0UscUJBQUEsQ0FBQTtBQUpKO0FBQUEsV0FBQSxNQUFBO0FBTUUsWUFBQSxNQUFBO0FDNkZDO0FEckdMOztBQ3VHRSxlRDlGRixJQzhGRTtBRDFHYztBQTlIUDtBQUFBO0FBQUEsaUNBMklDLEdBM0lELEVBMklDO0FBQ1YsWUFBQSxZQUFBO0FBQUEsUUFBQSxHQUFBLEdBQU0sSUFBSSxjQUFBLENBQUosYUFBQSxDQUFOLEdBQU0sQ0FBTjtBQUNBLFFBQUEsWUFBQSxHQUFlLEdBQUcsQ0FBSCxJQUFBLENBQVMsS0FBVCxPQUFBLEVBQWtCLEtBQWxCLE9BQUEsRUFBQSxHQUFBLENBQWlDLFVBQUEsQ0FBQSxFQUFBO0FDa0c1QyxpQkRsR2lELENBQUMsQ0FBRCxhQUFBLEVDa0dqRDtBRGxHSixTQUFlLENBQWY7QUNvR0UsZURuR0YsS0FBQSxNQUFBLENBQUEsaUJBQUEsQ0FBQSxZQUFBLENDbUdFO0FEdEdRO0FBM0lEO0FBQUE7QUFBQSx1Q0ErSU8sVUEvSVAsRUErSU87QUFDaEIsWUFBd0IsS0FBQSxZQUFBLElBQXhCLElBQUEsRUFBQTtBQUFBLGVBQUEsWUFBQSxDQUFBLElBQUE7QUN1R0c7O0FBQ0QsZUR2R0YsS0FBQSxZQUFBLEdBQWdCLGFBQUEsQ0FBQSxZQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsS0FBQSxFQ3VHZDtBRHpHYztBQS9JUDtBQUFBO0FBQUEsaUNBa0pEO0FBQUEsWUFBQyxTQUFELHVFQUFBLElBQUE7QUFDUixZQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7O0FBQUEsWUFBRyxLQUFBLE1BQUEsR0FBSCxHQUFBLEVBQUE7QUFDRSxnQkFBQSw0QkFBQTtBQzJHQzs7QUQxR0gsUUFBQSxHQUFBLEdBQUEsQ0FBQTs7QUFDQSxlQUFNLEdBQUEsR0FBTSxLQUFBLE9BQUEsQ0FBWixHQUFZLENBQVosRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFNLEdBQUcsQ0FBVCxTQUFNLEVBQU47QUFDQSxlQUFBLE1BQUEsQ0FBQSxZQUFBLENBRkYsR0FFRSxFQUZGLENDOEdJOztBRDFHRixVQUFBLEdBQUcsQ0FBSCxJQUFBOztBQUNBLGNBQUcsU0FBQSxJQUFjLEdBQUEsQ0FBQSxPQUFBLElBQWQsSUFBQSxLQUFpQyxHQUFBLENBQUEsTUFBQSxNQUFBLElBQUEsSUFBaUIsQ0FBQyxHQUFHLENBQUgsU0FBQSxDQUF0RCxpQkFBc0QsQ0FBbkQsQ0FBSCxFQUFBO0FBQ0UsWUFBQSxNQUFBLEdBQVMsSUFBQSxRQUFBLENBQWEsSUFBSSxXQUFBLENBQUosVUFBQSxDQUFlLEdBQUcsQ0FBL0IsT0FBYSxDQUFiLEVBQTBDO0FBQUMsY0FBQSxNQUFBLEVBQVE7QUFBVCxhQUExQyxDQUFUO0FBQ0EsWUFBQSxHQUFHLENBQUgsT0FBQSxHQUFjLE1BQU0sQ0FBcEIsUUFBYyxFQUFkO0FDOEdDOztBRDdHSCxVQUFBLEdBQUEsR0FBTyxHQUFHLENBQVYsT0FBTyxFQUFQOztBQUNBLGNBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGdCQUFHLEdBQUEsQ0FBQSxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0Usb0JBQU0sSUFBQSxLQUFBLENBQU4seUNBQU0sQ0FBTjtBQytHQzs7QUQ5R0gsZ0JBQUcsR0FBQSxDQUFBLFVBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxjQUFBLEdBQUEsR0FBTSxHQUFHLENBQVQsVUFBQTtBQURGLGFBQUEsTUFBQTtBQUdFLGNBQUEsR0FBQSxHQUFNLEtBQUEsTUFBQSxDQUFBLFlBQUEsR0FBTixHQUFBO0FBTko7QUN1SEc7QURoSUw7O0FBZ0JBLGVBQU8sS0FBUCxPQUFPLEVBQVA7QUFwQlE7QUFsSkM7QUFBQTtBQUFBLGdDQXVLRjtBQUNQLGVBQU8sS0FBQSxNQUFBLENBQVAsSUFBTyxFQUFQO0FBRE87QUF2S0U7QUFBQTtBQUFBLCtCQXlLSDtBQUNOLGVBQVEsS0FBQSxNQUFBLElBQUEsSUFBQSxLQUFlLEtBQUEsVUFBQSxJQUFBLElBQUEsSUFBaUIsS0FBQSxVQUFBLENBQUEsTUFBQSxJQUF4QyxJQUFRLENBQVI7QUFETTtBQXpLRztBQUFBO0FBQUEsZ0NBMktGO0FBQ1AsWUFBRyxLQUFILE1BQUcsRUFBSCxFQUFBO0FBQ0UsaUJBQUEsSUFBQTtBQURGLFNBQUEsTUFFSyxJQUFHLEtBQUEsTUFBQSxJQUFILElBQUEsRUFBQTtBQUNILGlCQUFPLEtBQUEsTUFBQSxDQUFQLE9BQU8sRUFBUDtBQURHLFNBQUEsTUFFQSxJQUFHLEtBQUEsVUFBQSxJQUFILElBQUEsRUFBQTtBQUNILGlCQUFPLEtBQUEsVUFBQSxDQUFBLFFBQUEsQ0FBUCxPQUFPLEVBQVA7QUN5SEM7QUQvSEk7QUEzS0U7QUFBQTtBQUFBLHNDQWtMSTtBQUNiLFlBQUcsS0FBQSxNQUFBLENBQUgsVUFBQSxFQUFBO0FBQ0UsaUJBQU8sS0FBQSxNQUFBLENBQVAsVUFBQTtBQURGLFNBQUEsTUFFSyxJQUFHLEtBQUgsTUFBRyxFQUFILEVBQUE7QUFDSCxpQkFBQSxJQUFBO0FBREcsU0FBQSxNQUVBLElBQUcsS0FBQSxNQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0gsaUJBQU8sS0FBQSxNQUFBLENBQVAsT0FBTyxFQUFQO0FBREcsU0FBQSxNQUVBLElBQUcsS0FBQSxVQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0gsaUJBQU8sS0FBQSxVQUFBLENBQUEsUUFBQSxDQUFQLE9BQU8sRUFBUDtBQzRIQztBRHBJVTtBQWxMSjtBQUFBO0FBQUEsbUNBMkxHLEdBM0xILEVBMkxHO0FBQ1osZUFBTyxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQThCLEtBQXJDLFVBQU8sQ0FBUDtBQURZO0FBM0xIO0FBQUE7QUFBQSxtQ0E2TEcsR0E3TEgsRUE2TEc7QUFDWixlQUFPLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUFBLEdBQUEsRUFBOEIsS0FBckMsVUFBTyxDQUFQO0FBRFk7QUE3TEg7QUFBQTtBQUFBLGtDQStMQTtBQUFBLFlBQUMsS0FBRCx1RUFBQSxHQUFBO0FBQ1QsZUFBTyxJQUFBLE1BQUEsQ0FBVyxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBMEIsS0FBckMsTUFBVyxDQUFYLEVBQVAsS0FBTyxDQUFQO0FBRFM7QUEvTEE7QUFBQTtBQUFBLG9DQWlNSSxJQWpNSixFQWlNSTtBQUNiLGVBQU8sSUFBSSxDQUFKLE9BQUEsQ0FBYSxLQUFiLFNBQWEsRUFBYixFQUFQLEVBQU8sQ0FBUDtBQURhO0FBak1KO0FBQUE7QUFBQSw2QkFvTUo7QUFDTCxZQUFBLENBQU8sS0FBUCxNQUFBLEVBQUE7QUFDRSxlQUFBLE1BQUEsR0FBQSxJQUFBOztBQUNBLFVBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBOztBQ3NJRSxpQkRySUYsUUFBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLEVDcUlFO0FBQ0Q7QUQxSUU7QUFwTUk7O0FBQUE7QUFBQTs7QUFBTjtBQTBNTCxFQUFBLFFBQUMsQ0FBRCxNQUFBLEdBQUEsS0FBQTtBQzJJQSxTQUFBLFFBQUE7QURyVlcsQ0FBQSxDQUFBLElBQUEsQ0FBQSxLQUFiLENBQWEsQ0FBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVUQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsV0FBQSxDQUFBOztBQUNBLElBQUEsUUFBQSxHQUFBLE9BQUEsQ0FBQSxXQUFBLENBQUE7O0FBQ0EsSUFBQSxnQkFBQSxHQUFBLE9BQUEsQ0FBQSwyQkFBQSxDQUFBOztBQUZBLElBQUEsT0FBQTs7QUFLQSxPQUFBLEdBQVUsaUJBQUEsR0FBQSxFQUFBLElBQUEsRUFBQTtBQUFBLE1BQVUsTUFBVix1RUFBQSxJQUFBOztBQ1NSO0FEUE8sTUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FDU0wsV0RUeUIsSUFBSyxDQUFBLEdBQUEsQ0NTOUI7QURUSyxHQUFBLE1BQUE7QUNXTCxXRFh3QyxNQ1d4QztBQUNEO0FEZEgsQ0FBQTs7QUFLQSxJQUFhLE9BQUEsR0FBQSxZQUFBO0FBQUEsTUFBTixPQUFNO0FBQUE7QUFBQTtBQUNYLHFCQUFhLEtBQWIsRUFBYTtBQUFBLFVBQUEsS0FBQSx1RUFBQSxJQUFBO0FBQUEsVUFBa0IsTUFBbEIsdUVBQUEsSUFBQTs7QUFBQTs7QUFBQyxXQUFBLElBQUEsR0FBQSxLQUFBO0FBQU0sV0FBQSxJQUFBLEdBQUEsS0FBQTtBQUNsQixXQUFBLElBQUEsR0FBQSxFQUFBO0FBQ0EsV0FBQSxTQUFBLEdBQUEsRUFBQTtBQUNBLFdBQUEsWUFBQSxHQUFnQixLQUFBLFdBQUEsR0FBZSxLQUFBLFNBQUEsR0FBYSxLQUFBLE9BQUEsR0FBVyxLQUFBLEdBQUEsR0FBdkQsSUFBQTtBQUNBLFdBQUEsT0FBQSxHQUFBLElBQUE7QUFDQSxXQUFBLFFBQUEsR0FBWSxLQUFaLElBQUE7QUFDQSxXQUFBLEtBQUEsR0FBQSxDQUFBO0FBTlcsaUJBT1ksQ0FBQSxJQUFBLEVBQXZCLEtBQXVCLENBUFo7QUFPVixXQUFELE9BUFc7QUFPQSxXQUFYLE9BUFc7QUFRWCxXQUFBLFNBQUEsQ0FBQSxNQUFBO0FBQ0EsV0FBQSxRQUFBLEdBQUEsRUFBQTtBQUVBLFdBQUEsY0FBQSxHQUFrQjtBQUNoQixRQUFBLFdBQUEsRUFEZ0IsSUFBQTtBQUVoQixRQUFBLFdBQUEsRUFGZ0IsSUFBQTtBQUdoQixRQUFBLEtBQUEsRUFIZ0IsS0FBQTtBQUloQixRQUFBLGFBQUEsRUFKZ0IsSUFBQTtBQUtoQixRQUFBLFdBQUEsRUFMZ0IsSUFBQTtBQU1oQixRQUFBLGVBQUEsRUFOZ0IsS0FBQTtBQU9oQixRQUFBLFVBQUEsRUFQZ0IsS0FBQTtBQVFoQixRQUFBLFlBQUEsRUFBYztBQVJFLE9BQWxCO0FBVUEsV0FBQSxPQUFBLEdBQUEsRUFBQTtBQUNBLFdBQUEsWUFBQSxHQUFBLElBQUE7QUF0Qlc7O0FBREY7QUFBQTtBQUFBLCtCQXdCSDtBQUNOLGVBQU8sS0FBUCxPQUFBO0FBRE07QUF4Qkc7QUFBQTtBQUFBLGdDQTBCQSxLQTFCQSxFQTBCQTtBQUNULFlBQUcsS0FBQSxPQUFBLEtBQUgsS0FBQSxFQUFBO0FBQ0UsZUFBQSxPQUFBLEdBQUEsS0FBQTtBQUNBLGVBQUEsUUFBQSxHQUNLLEtBQUEsT0FBQSxJQUFBLElBQUEsSUFBYyxLQUFBLE9BQUEsQ0FBQSxJQUFBLElBQWQsSUFBQSxHQUNELEtBQUEsT0FBQSxDQUFBLFFBQUEsR0FBQSxHQUFBLEdBQTBCLEtBRHpCLElBQUEsR0FHRCxLQUpKLElBQUE7QUNtQkUsaUJEYkYsS0FBQSxLQUFBLEdBQ0ssS0FBQSxPQUFBLElBQUEsSUFBQSxJQUFjLEtBQUEsT0FBQSxDQUFBLEtBQUEsSUFBZCxJQUFBLEdBQ0UsS0FBQSxPQUFBLENBQUEsS0FBQSxHQURGLENBQUEsR0FFRSxDQ1VMO0FBQ0Q7QUR2Qk07QUExQkE7QUFBQTtBQUFBLDZCQXdDTDtBQUNKLFlBQUcsQ0FBQyxLQUFKLE9BQUEsRUFBQTtBQUNFLGVBQUEsT0FBQSxHQUFBLElBQUE7QUFDQSxlQUFBLFNBQUEsQ0FBVyxLQUFYLElBQUE7QUNhQzs7QURaSCxlQUFBLElBQUE7QUFKSTtBQXhDSztBQUFBO0FBQUEsbUNBNkNDO0FDZ0JSLGVEZkYsS0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0NlRTtBRGhCUTtBQTdDRDtBQUFBO0FBQUEsbUNBK0NDO0FBQ1YsZUFBTyxLQUFBLFNBQUEsSUFBQSxJQUFBLElBQWUsS0FBQSxPQUFBLElBQXRCLElBQUE7QUFEVTtBQS9DRDtBQUFBO0FBQUEscUNBaURHO0FBQ1osWUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQTtBQUFBLFFBQUEsT0FBQSxHQUFVLEtBQVYsVUFBVSxFQUFWOztBQUNBLFlBQUcsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLE9BQU8sQ0FBUCxJQUFBLEdBQVAsWUFBTyxFQUFQO0FDcUJDOztBRHBCSCxRQUFBLEdBQUEsR0FBQSxDQUFBLFdBQUEsRUFBQSxhQUFBLEVBQUEsS0FBQSxFQUFBLGNBQUEsQ0FBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQ3VCSSxVQUFBLENBQUMsR0FBRyxHQUFHLENBQVAsQ0FBTyxDQUFQOztBRHRCRixjQUFHLEtBQUEsQ0FBQSxLQUFILElBQUEsRUFBQTtBQUNFLG1CQUFBLElBQUE7QUN3QkM7QUQxQkw7O0FBR0EsZUFBQSxLQUFBO0FBUFk7QUFqREg7QUFBQTtBQUFBLDJDQXlEVyxJQXpEWCxFQXlEVztBQUNwQixZQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTs7QUFBQSxZQUFHLEtBQUEsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsT0FBQSxHQUFVLElBQUksUUFBQSxDQUFkLE9BQVUsRUFBVjtBQUNBLFVBQUEsT0FBQSxHQUFVLEtBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLEVBQVYsSUFBVSxDQUFWO0FBQ0EsVUFBQSxPQUFBLEdBQVUsS0FBQSxrQkFBQSxDQUFvQixPQUFPLENBQVAsU0FBQSxDQUE5QixPQUE4QixDQUFwQixDQUFWOztBQUNBLGNBQUcsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLG1CQUFPLE9BQU8sQ0FBUCxJQUFBLEdBQVAsWUFBTyxFQUFQO0FDNkJDOztBRDVCSCxpQkFBQSxLQUFBO0FDOEJDOztBRDdCSCxlQUFPLEtBQVAsWUFBTyxFQUFQO0FBUm9CO0FBekRYO0FBQUE7QUFBQSwwQ0FrRVE7QUFDakIsWUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQTtBQUFBLFFBQUEsT0FBQSxHQUFVLEtBQVYsVUFBVSxFQUFWOztBQUNBLFlBQUcsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLE9BQU8sQ0FBZCxpQkFBTyxFQUFQO0FDa0NDOztBRGpDSCxRQUFBLEdBQUEsR0FBQSxDQUFBLFdBQUEsRUFBQSxhQUFBLENBQUE7O0FBQUEsYUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNvQ0ksVUFBQSxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQU8sQ0FBUDs7QURuQ0YsY0FBRyxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxtQkFBQSxJQUFBO0FDcUNDO0FEdkNMOztBQUdBLGVBQUEsS0FBQTtBQVBpQjtBQWxFUjtBQUFBO0FBQUEsb0NBMEVFO0FBQ1gsWUFBQSxPQUFBLEVBQUEsR0FBQTtBQUFBLFFBQUEsR0FBQSxHQUFBLEVBQUE7QUFDQSxRQUFBLE9BQUEsR0FBVSxLQUFWLFVBQVUsRUFBVjs7QUFDQSxZQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsT0FBTyxDQUEvQixXQUF3QixFQUFsQixDQUFOO0FDMENDOztBRHpDSCxRQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsS0FBeEIsUUFBTSxDQUFOO0FBQ0EsZUFBQSxHQUFBO0FBTlc7QUExRUY7QUFBQTtBQUFBLHlDQWlGUyxNQWpGVCxFQWlGUztBQUNoQixRQUFBLE1BQU0sQ0FBTixZQUFBLEdBQUEsS0FBQTtBQUNBLFFBQUEsTUFBTSxDQUFOLFdBQUEsR0FBQSxLQUFBO0FBQ0EsUUFBQSxNQUFNLENBQU4sWUFBQSxHQUFBLEtBQUE7QUFDQSxlQUFPLE1BQU0sQ0FBYixJQUFPLEVBQVA7QUFKZ0I7QUFqRlQ7QUFBQTtBQUFBLG1DQXNGQztBQUNWLFlBQUEsT0FBQTs7QUFBQSxZQUFHLEtBQUEsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsT0FBQSxHQUFVLElBQUksUUFBQSxDQUFkLE9BQVUsRUFBVjtBQUNBLGlCQUFPLEtBQUEsa0JBQUEsQ0FBb0IsT0FBTyxDQUFQLFNBQUEsQ0FBa0IsS0FBN0MsT0FBMkIsQ0FBcEIsQ0FBUDtBQ2dEQztBRG5ETztBQXRGRDtBQUFBO0FBQUEseUNBMEZPO0FDbURkLGVEbERGLEtBQUEsVUFBQSxNQUFpQixJQ2tEZjtBRG5EYztBQTFGUDtBQUFBO0FBQUEsaUNBNEZDLElBNUZELEVBNEZDO0FBQ1YsWUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUE7QUFBQSxRQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGFBQUEsR0FBQSxJQUFBLElBQUEsRUFBQTtBQ3VESSxVQUFBLEdBQUcsR0FBRyxJQUFJLENBQVYsR0FBVSxDQUFWOztBRHRERixjQUFHLEdBQUEsSUFBTyxLQUFWLGNBQUEsRUFBQTtBQ3dESSxZQUFBLE9BQU8sQ0FBUCxJQUFBLENEdkRGLEtBQUEsT0FBQSxDQUFBLEdBQUEsSUFBZ0IsR0N1RGQ7QUR4REosV0FBQSxNQUFBO0FDMERJLFlBQUEsT0FBTyxDQUFQLElBQUEsQ0FBYSxLQUFiLENBQUE7QUFDRDtBRDVETDs7QUM4REUsZUFBQSxPQUFBO0FEL0RRO0FBNUZEO0FBQUE7QUFBQSx5Q0FnR1MsT0FoR1QsRUFnR1M7QUFDbEIsWUFBQSxHQUFBO0FBQUEsUUFBQSxHQUFBLEdBQUEsRUFBQTtBQUNBLFFBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBTixNQUFBLENBQUEsR0FBQSxFQUFrQixLQUF4QixjQUFNLENBQU47O0FBQ0EsWUFBRyxPQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFOLE1BQUEsQ0FBQSxHQUFBLEVBQWtCLE9BQU8sQ0FBL0IsVUFBd0IsRUFBbEIsQ0FBTjtBQ2dFQzs7QUQvREgsZUFBTyxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsS0FBekIsT0FBTyxDQUFQO0FBTGtCO0FBaEdUO0FBQUE7QUFBQSxtQ0FzR0M7QUFDVixlQUFPLEtBQUEsa0JBQUEsQ0FBb0IsS0FBM0IsVUFBMkIsRUFBcEIsQ0FBUDtBQURVO0FBdEdEO0FBQUE7QUFBQSxnQ0F3R0EsR0F4R0EsRUF3R0E7QUFDVCxZQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBVSxLQUFWLFVBQVUsRUFBVjs7QUFDQSxZQUFHLEdBQUEsSUFBSCxPQUFBLEVBQUE7QUFDRSxpQkFBTyxPQUFRLENBQWYsR0FBZSxDQUFmO0FDc0VDO0FEekVNO0FBeEdBO0FBQUE7QUFBQSw2QkE0R0w7QUFDSixZQUFBLEdBQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxLQUFBLE1BQUEsQ0FBTixNQUFNLENBQU47O0FBQ0EsWUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sR0FBRyxDQUFILElBQUEsR0FBUCxTQUFBO0FDMEVDO0FEN0VDO0FBNUdLO0FBQUE7QUFBQSxnQ0FnSEEsSUFoSEEsRUFnSEE7QUFDVCxhQUFBLElBQUEsR0FBQSxJQUFBOztBQUNBLFlBQUcsT0FBQSxJQUFBLEtBQUgsUUFBQSxFQUFBO0FBQ0UsZUFBQSxTQUFBLEdBQUEsSUFBQTtBQUNBLGVBQUEsT0FBQSxDQUFBLE9BQUEsSUFBQSxJQUFBO0FBQ0EsaUJBQUEsSUFBQTtBQUhGLFNBQUEsTUFJSyxJQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDSCxpQkFBTyxLQUFBLGFBQUEsQ0FBUCxJQUFPLENBQVA7QUM2RUM7O0FENUVILGVBQUEsS0FBQTtBQVJTO0FBaEhBO0FBQUE7QUFBQSxvQ0F5SEksSUF6SEosRUF5SEk7QUFDYixZQUFBLE9BQUEsRUFBQSxHQUFBO0FBQUEsUUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFBLFFBQUEsRUFBTixJQUFNLENBQU47O0FBQ0EsWUFBRyxPQUFBLEdBQUEsS0FBSCxVQUFBLEVBQUE7QUFDRSxlQUFBLFdBQUEsR0FBQSxHQUFBO0FBREYsU0FBQSxNQUVLLElBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNILGVBQUEsU0FBQSxHQUFBLEdBQUE7QUFDQSxlQUFBLE9BQUEsQ0FBQSxPQUFBLElBQUEsSUFBQTtBQ2lGQzs7QURoRkgsUUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFBLFNBQUEsRUFBVixJQUFVLENBQVY7O0FBQ0EsWUFBRyxPQUFBLE9BQUEsS0FBSCxVQUFBLEVBQUE7QUFDRSxlQUFBLFlBQUEsR0FBQSxPQUFBO0FDa0ZDOztBRGpGSCxhQUFBLE9BQUEsR0FBVyxPQUFBLENBQUEsU0FBQSxFQUFYLElBQVcsQ0FBWDtBQUNBLGFBQUEsR0FBQSxHQUFPLE9BQUEsQ0FBQSxLQUFBLEVBQVAsSUFBTyxDQUFQO0FBQ0EsYUFBQSxRQUFBLEdBQVksT0FBQSxDQUFBLFVBQUEsRUFBQSxJQUFBLEVBQXdCLEtBQXBDLFFBQVksQ0FBWjtBQUVBLGFBQUEsVUFBQSxDQUFBLElBQUE7O0FBRUEsWUFBRyxVQUFILElBQUEsRUFBQTtBQUNFLGVBQUEsTUFBQSxDQUFRLElBQUEsT0FBQSxDQUFBLE1BQUEsRUFBbUIsSUFBSyxDQUF4QixNQUF3QixDQUF4QixFQUFSLElBQVEsQ0FBUjtBQ2lGQzs7QURoRkgsWUFBRyxjQUFILElBQUEsRUFBQTtBQUNFLGVBQUEsTUFBQSxDQUFRLElBQUEsT0FBQSxDQUFBLFVBQUEsRUFBdUIsSUFBSyxDQUE1QixVQUE0QixDQUE1QixFQUFSLElBQVEsQ0FBUjtBQ2tGQzs7QURoRkgsWUFBRyxVQUFILElBQUEsRUFBQTtBQUNFLGVBQUEsT0FBQSxDQUFTLElBQUssQ0FBZCxNQUFjLENBQWQ7QUNrRkM7O0FEakZILGVBQUEsSUFBQTtBQXZCYTtBQXpISjtBQUFBO0FBQUEsOEJBaUpGLElBakpFLEVBaUpGO0FBQ1AsWUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGFBQUEsSUFBQSxJQUFBLElBQUEsRUFBQTtBQ3VGSSxVQUFBLElBQUksR0FBRyxJQUFJLENBQVgsSUFBVyxDQUFYO0FBQ0EsVUFBQSxPQUFPLENBQVAsSUFBQSxDRHZGRixLQUFBLE1BQUEsQ0FBUSxJQUFBLE9BQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFSLElBQVEsQ0FBUixDQ3VGRTtBRHhGSjs7QUMwRkUsZUFBQSxPQUFBO0FEM0ZLO0FBakpFO0FBQUE7QUFBQSw2QkFvSkgsR0FwSkcsRUFvSkg7QUFDTixZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxLQUFBLE1BQUEsQ0FBUSxHQUFHLENBQXBCLElBQVMsQ0FBVDs7QUFDQSxZQUFHLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFBLFNBQUEsQ0FBQSxNQUFBO0FDNkZDOztBRDVGSCxRQUFBLEdBQUcsQ0FBSCxTQUFBLENBQUEsSUFBQTtBQUNBLGFBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBO0FBQ0EsZUFBQSxHQUFBO0FBTk07QUFwSkc7QUFBQTtBQUFBLGdDQTJKQSxHQTNKQSxFQTJKQTtBQUNULFlBQUEsQ0FBQTs7QUFBQSxZQUFHLENBQUMsQ0FBQSxHQUFJLEtBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBTCxHQUFLLENBQUwsSUFBMkIsQ0FBOUIsQ0FBQSxFQUFBO0FBQ0UsZUFBQSxJQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBO0FDaUdDOztBRGhHSCxlQUFBLEdBQUE7QUFIUztBQTNKQTtBQUFBO0FBQUEsNkJBK0pILFFBL0pHLEVBK0pIO0FBQ04sWUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxLQUFBO0FBQUEsYUFBQSxJQUFBOztBQURNLG9DQUVTLGdCQUFBLENBQUEsZUFBQSxDQUFBLFVBQUEsQ0FBZixRQUFlLENBRlQ7O0FBQUE7O0FBRU4sUUFBQSxLQUZNO0FBRU4sUUFBQSxJQUZNOztBQUdOLFlBQUcsS0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFBLENBQUEsR0FBQSxHQUFBLEtBQUEsTUFBQSxDQUFBLEtBQUEsQ0FBQSxLQUFBLElBQUEsR0FBQSxHQUFxQixDQUFyQixNQUFBLENBQUEsSUFBQSxDQUFBLEdBQU8sS0FBUCxDQUFBO0FDcUdDOztBRHBHSCxRQUFBLElBQUEsR0FBQSxLQUFBLElBQUE7O0FBQUEsYUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUN1R0ksVUFBQSxHQUFHLEdBQUcsSUFBSSxDQUFWLENBQVUsQ0FBVjs7QUR0R0YsY0FBRyxHQUFHLENBQUgsSUFBQSxLQUFILElBQUEsRUFBQTtBQUNFLG1CQUFBLEdBQUE7QUN3R0M7QUQxR0w7QUFMTTtBQS9KRztBQUFBO0FBQUEsaUNBdUtDLFFBdktELEVBdUtDLElBdktELEVBdUtDO0FDNEdSLGVEM0dGLEtBQUEsTUFBQSxDQUFBLFFBQUEsRUFBaUIsSUFBQSxPQUFBLENBQVksUUFBUSxDQUFSLEtBQUEsQ0FBQSxHQUFBLEVBQVosR0FBWSxFQUFaLEVBQWpCLElBQWlCLENBQWpCLENDMkdFO0FENUdRO0FBdktEO0FBQUE7QUFBQSw2QkF5S0gsUUF6S0csRUF5S0gsR0F6S0csRUF5S0g7QUFDTixZQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQTs7QUFETSxxQ0FDUyxnQkFBQSxDQUFBLGVBQUEsQ0FBQSxVQUFBLENBQWYsUUFBZSxDQURUOztBQUFBOztBQUNOLFFBQUEsS0FETTtBQUNOLFFBQUEsSUFETTs7QUFFTixZQUFHLEtBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxLQUFBLE1BQUEsQ0FBUCxLQUFPLENBQVA7O0FBQ0EsY0FBTyxJQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsWUFBQSxJQUFBLEdBQU8sS0FBQSxNQUFBLENBQVEsSUFBQSxPQUFBLENBQWYsS0FBZSxDQUFSLENBQVA7QUMrR0M7O0FEOUdILGlCQUFPLElBQUksQ0FBSixNQUFBLENBQUEsSUFBQSxFQUFQLEdBQU8sQ0FBUDtBQUpGLFNBQUEsTUFBQTtBQU1FLGVBQUEsTUFBQSxDQUFBLEdBQUE7QUFDQSxpQkFBQSxHQUFBO0FDZ0hDO0FEekhHO0FBektHO0FBQUE7QUFBQSxrQ0FtTEUsUUFuTEYsRUFtTEU7QUNtSFQsZURsSEYsS0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBLFFBQUEsQ0NrSEU7QURuSFM7QUFuTEY7QUFBQTtBQUFBLGlDQTBMQTtBQUNULFlBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUE7QUFBQSxRQUFBLE9BQU8sQ0FBUCxJQUFBLEdBQWUsSUFBQSxPQUFBLENBQUEsSUFBQSxFQUFpQjtBQUM5QixrQkFBTztBQUNMLHFCQUFRO0FBQ04sY0FBQSxJQUFBLEVBRE0saU5BQUE7QUFNTixjQUFBLE1BQUEsRUFBUTtBQU5GO0FBREg7QUFEdUIsU0FBakIsQ0FBZjtBQVlBLFFBQUEsR0FBQSxHQUFBLEtBQUEsU0FBQTtBQUFBLFFBQUEsT0FBQSxHQUFBLEVBQUE7O0FBQUEsYUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUMrR0ksVUFBQSxRQUFRLEdBQUcsR0FBRyxDQUFkLENBQWMsQ0FBZDtBQUNBLFVBQUEsT0FBTyxDQUFQLElBQUEsQ0QvR0YsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsT0FBTyxDQUF6QixJQUFBLENDK0dFO0FEaEhKOztBQ2tIRSxlQUFBLE9BQUE7QUQvSE87QUExTEE7QUFBQTtBQUFBLDhCQTBNRCxRQTFNQyxFQTBNRCxJQTFNQyxFQTBNRDtBQUFBOztBQ21ITixlRGxIRixPQUFPLENBQVAsT0FBQSxHQUFBLElBQUEsQ0FBdUIsWUFBQTtBQ21IbkIsaUJEbEhGLE9BQU8sQ0FBUCxJQUFBLENBQUEsVUFBQSxDQUFBLFFBQUEsRUFBQSxJQUFBLENDa0hFO0FEbkhKLFNBQUEsRUFBQSxJQUFBLENBRU0sWUFBQTtBQ21IRixpQkRsSEYsS0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBLENBQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLENDa0hFO0FEckhKLFNBQUEsQ0NrSEU7QURuSE07QUExTUM7QUFBQTtBQUFBLGlDQWdOQTtBQUFBOztBQ3FIUCxlRHBIRixPQUFPLENBQVAsT0FBQSxHQUFBLElBQUEsQ0FBdUIsWUFBQTtBQUNyQixjQUFBLFNBQUE7QUNxSEUsaUJEckhGLFNBQUEsR0FBWSxNQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLENDcUhWO0FEdEhKLFNBQUEsRUFBQSxJQUFBLENBRU8sVUFBQSxTQUFELEVBQUE7QUFDSixjQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsT0FBQTs7QUFBQSxjQUFHLFNBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxZQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGlCQUFBLFFBQUEsSUFBQSxTQUFBLEVBQUE7QUN3SEksY0FBQSxJQUFJLEdBQUcsU0FBUyxDQUFoQixRQUFnQixDQUFoQjtBQUNBLGNBQUEsT0FBTyxDQUFQLElBQUEsQ0R4SEYsT0FBTyxDQUFQLElBQUEsQ0FBQSxVQUFBLENBQUEsUUFBQSxFQUFBLElBQUEsQ0N3SEU7QUR6SEo7O0FDMkhFLG1CQUFBLE9BQUE7QUFDRDtBRGhJTCxTQUFBLENDb0hFO0FEckhPO0FBaE5BO0FBQUE7QUFBQSxtQ0F3TkU7QUM4SFQsZUQ3SEYsS0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxFQUFBLENDNkhFO0FEOUhTO0FBeE5GO0FBQUE7QUFBQSxpQ0EyTkcsSUEzTkgsRUEyTkc7QUFBQSxZQUFNLElBQU4sdUVBQUEsRUFBQTs7QUFDWixRQUFBLElBQUksQ0FBSixPQUFBLEdBQWUsVUFBQSxRQUFBLEVBQUE7QUFDYixjQUFBLENBQUEsRUFBQSxHQUFBO0FBQUEsVUFBQSxHQUFBLEdBQVMsQ0FBQSxDQUFBLEdBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxJQUFBLEdBQUEsQ0FBQSxHQUVELFFBQVEsQ0FBUixPQUFBLEdBQ04sUUFBUSxDQURGLE9BQUEsR0FBSCxLQUZMLENBQUE7O0FBSUEsY0FBc0MsR0FBQSxJQUF0QyxJQUFBLEVBQUE7QUM2SEksbUJEN0hKLFFBQVEsQ0FBUixRQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsSUFBK0IsR0M2SDNCO0FBQ0Q7QURuSUwsU0FBQTs7QUFNQSxlQUFBLElBQUE7QUFQWTtBQTNOSDtBQUFBO0FBQUEscUNBb09PLElBcE9QLEVBb09PO0FBQUEsWUFBTSxJQUFOLHVFQUFBLEVBQUE7O0FBQ2hCLFFBQUEsSUFBSSxDQUFKLE9BQUEsR0FBZSxVQUFBLFFBQUEsRUFBQTtBQUNiLGNBQUEsQ0FBQSxFQUFBLEdBQUE7QUFBQSxVQUFBLEdBQUEsR0FBUyxDQUFBLENBQUEsR0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLElBQUEsR0FBQSxDQUFBLEdBRUQsUUFBUSxDQUFSLE9BQUEsR0FDTixRQUFRLENBREYsT0FBQSxHQUFILEtBRkwsQ0FBQTs7QUFJQSxjQUFBLEVBQU8sR0FBQSxJQUFBLElBQUEsS0FBUyxHQUFBLEtBQUEsR0FBQSxJQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsR0FBQSxLQUFoQixJQUFPLENBQVAsQ0FBQSxFQUFBO0FDK0hJLG1CRDlIRixRQUFRLENBQVIsUUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLElBQStCLElDOEg3QjtBQUNEO0FEcklMLFNBQUE7O0FBT0EsZUFBQSxJQUFBO0FBUmdCO0FBcE9QOztBQUFBO0FBQUE7O0FBQU47QUFzTEwsRUFBQSxPQUFDLENBQUQsU0FBQSxHQUFBLEVBQUE7QUFFQSxFQUFBLE9BQUMsQ0FBRCxPQUFBLEdBQVcsSUFBSSxRQUFBLENBQWYsT0FBVyxFQUFYO0FDNkxBLFNBQUEsT0FBQTtBRHJYVyxDQUFBLENBQUEsSUFBQSxDQUFBLEtBQWIsQ0FBYSxDQUFiOzs7O0FBK09BLElBQWEsV0FBTjtBQUFBO0FBQUE7QUFDTCx1QkFBYSxTQUFiLEVBQWE7QUFBQTs7QUFBQyxTQUFBLFFBQUEsR0FBQSxTQUFBO0FBQUQ7O0FBRFI7QUFBQTtBQUFBLDJCQUVDLENBQUE7QUFGRDtBQUFBO0FBQUEsd0NBSWM7QUFDakIsYUFBTyxLQUFBLFFBQUEsS0FBUCxJQUFBO0FBRGlCO0FBSmQ7QUFBQTtBQUFBLGtDQU1RO0FBQ1gsYUFBQSxFQUFBO0FBRFc7QUFOUjtBQUFBO0FBQUEsaUNBUU87QUFDVixhQUFBLEVBQUE7QUFEVTtBQVJQOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFelBBLElBQUEsVUFBQSxHQUFBLE9BQUEsQ0FBQSxhQUFBLENBQUE7O0FBQ0EsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLGVBQUEsQ0FBQTs7QUFDQSxJQUFBLFlBQUEsR0FBQSxPQUFBLENBQUEsdUJBQUEsQ0FBQTs7QUFGQSxJQUFBLE9BQUEsR0FBQSxHQUFBLE9BQUE7O0FBSUEsSUFBYSxPQUFOO0FBQUE7QUFBQTtBQUNMLG1CQUFhLFFBQWIsRUFBYTtBQUFBOztBQUFDLFNBQUEsUUFBQSxHQUFBLFFBQUE7QUFDWixTQUFBLFVBQUEsR0FBQSxFQUFBO0FBRFc7O0FBRFI7QUFBQTtBQUFBLGlDQUlTLElBSlQsRUFJUztBQUNaLFVBQUcsT0FBQSxDQUFBLElBQUEsQ0FBWSxLQUFaLFVBQUEsRUFBQSxJQUFBLElBQUgsQ0FBQSxFQUFBO0FBQ0UsYUFBQSxVQUFBLENBQUEsSUFBQSxDQUFBLElBQUE7QUNZQSxlRFhBLEtBQUEsV0FBQSxHQUFlLElDV2Y7QUFDRDtBRGZXO0FBSlQ7QUFBQTtBQUFBLGtDQVFVLE1BUlYsRUFRVTtBQUNiLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTs7QUFBQSxVQUFBLE1BQUEsRUFBQTtBQUNFLFlBQUcsT0FBQSxNQUFBLEtBQUgsUUFBQSxFQUFBO0FBQ0UsVUFBQSxNQUFBLEdBQVMsQ0FBVCxNQUFTLENBQVQ7QUNnQkQ7O0FEZkQsUUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQ2tCRSxVQUFBLEtBQUssR0FBRyxNQUFNLENBQWQsQ0FBYyxDQUFkO0FBQ0EsVUFBQSxPQUFPLENBQVAsSUFBQSxDRGxCQSxLQUFBLFlBQUEsQ0FBQSxLQUFBLENDa0JBO0FEbkJGOztBQ3FCQSxlQUFBLE9BQUE7QUFDRDtBRDFCWTtBQVJWO0FBQUE7QUFBQSxvQ0FjWSxJQWRaLEVBY1k7QUN3QmYsYUR2QkEsS0FBQSxVQUFBLEdBQWMsS0FBQSxVQUFBLENBQUEsTUFBQSxDQUFtQixVQUFBLENBQUEsRUFBQTtBQ3dCL0IsZUR4QnNDLENBQUEsS0FBTyxJQ3dCN0M7QUR4QlksT0FBQSxDQ3VCZDtBRHhCZTtBQWRaO0FBQUE7QUFBQSxvQ0FpQlU7QUFDYixVQUFBLElBQUE7O0FBQUEsVUFBTyxLQUFBLFdBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxLQUFQLFVBQUE7O0FBQ0EsWUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxJQUFJLENBQUosTUFBQSxDQUFZLEtBQUEsTUFBQSxDQUFuQixhQUFtQixFQUFaLENBQVA7QUM0QkQ7O0FEM0JELGFBQUEsV0FBQSxHQUFlLFlBQUEsQ0FBQSxXQUFBLENBQUEsTUFBQSxDQUFmLElBQWUsQ0FBZjtBQzZCRDs7QUQ1QkQsYUFBTyxLQUFQLFdBQUE7QUFOYTtBQWpCVjtBQUFBO0FBQUEsMkJBd0JHLE9BeEJILEVBd0JHO0FBQUEsVUFBUyxPQUFULHVFQUFBLEVBQUE7QUFDTixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxLQUFBLFNBQUEsQ0FBQSxPQUFBLEVBQVQsT0FBUyxDQUFUO0FBQ0EsYUFBTyxNQUFNLENBQWIsSUFBTyxFQUFQO0FBRk07QUF4Qkg7QUFBQTtBQUFBLDhCQTJCTSxPQTNCTixFQTJCTTtBQUFBLFVBQVMsT0FBVCx1RUFBQSxFQUFBO0FBQ1QsYUFBTyxJQUFJLFVBQUEsQ0FBSixTQUFBLENBQUEsT0FBQSxFQUF1QixNQUFNLENBQU4sTUFBQSxDQUFjO0FBQzFDLFFBQUEsVUFBQSxFQUQwQyxFQUFBO0FBRTFDLFFBQUEsWUFBQSxFQUFjLEtBRjRCLE1BRTVCLEVBRjRCO0FBRzFDLFFBQUEsUUFBQSxFQUFVLEtBSGdDLFFBQUE7QUFJMUMsUUFBQSxhQUFBLEVBQWU7QUFKMkIsT0FBZCxFQUE5QixPQUE4QixDQUF2QixDQUFQO0FBRFM7QUEzQk47QUFBQTtBQUFBLDZCQWtDRztBQUNOLGFBQVEsS0FBQSxNQUFBLElBQVIsSUFBQTtBQURNO0FBbENIO0FBQUE7QUFBQSxzQ0FvQ1k7QUFDZixVQUFHLEtBQUEsTUFBQSxJQUFILElBQUEsRUFBQTtBQ3VDRSxlRHRDQSxLQUFDLE1Dc0NEO0FEdkNGLE9BQUEsTUFBQTtBQ3lDRSxlRHRDQSxJQ3NDQTtBQUNEO0FEM0NjO0FBcENaO0FBQUE7QUFBQSxnQ0F5Q1EsR0F6Q1IsRUF5Q1E7QUFDWCxVQUFBLEVBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxLQUFMLGNBQUssRUFBTDs7QUFDQSxVQUFHLEVBQUUsQ0FBRixPQUFBLENBQUEsSUFBQSxJQUFtQixDQUF0QixDQUFBLEVBQUE7QUFDRSxlQUFPLEVBQUUsQ0FBRixPQUFBLENBQUEsSUFBQSxFQUFQLEdBQU8sQ0FBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sRUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFQLEVBQUE7QUMyQ0Q7QURoRFU7QUF6Q1I7QUFBQTtBQUFBLHNDQStDWTtBQUFBLFVBQUMsR0FBRCx1RUFBQSxFQUFBO0FBQ2YsVUFBQSxFQUFBLEVBQUEsQ0FBQTtBQUFBLE1BQUEsRUFBQSxHQUFLLEtBQUwsY0FBSyxFQUFMOztBQUNBLFVBQUcsQ0FBQyxDQUFBLEdBQUksRUFBRSxDQUFGLE9BQUEsQ0FBTCxJQUFLLENBQUwsSUFBeUIsQ0FBNUIsQ0FBQSxFQUFBO0FBQ0UsZUFBTyxFQUFFLENBQUYsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLElBQVAsR0FBQTtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sRUFBQSxHQUFBLEdBQUEsR0FBUCxHQUFBO0FDK0NEO0FEcERjO0FBL0NaO0FBQUE7QUFBQSx1Q0FxRGE7QUFBQSxVQUFDLEdBQUQsdUVBQUEsRUFBQTtBQUNoQixVQUFBLEVBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssS0FBTCxjQUFLLEVBQUw7O0FBQ0EsVUFBRyxDQUFDLENBQUEsR0FBSSxFQUFFLENBQUYsT0FBQSxDQUFMLElBQUssQ0FBTCxJQUF5QixDQUE1QixDQUFBLEVBQUE7QUFDRSxlQUFPLEdBQUEsR0FBTSxFQUFFLENBQUYsTUFBQSxDQUFVLENBQUEsR0FBdkIsQ0FBYSxDQUFiO0FBREYsT0FBQSxNQUFBO0FBR0UsZUFBTyxHQUFBLEdBQUEsR0FBQSxHQUFQLEVBQUE7QUNtREQ7QUR4RGU7QUFyRGI7QUFBQTtBQUFBLG1DQTJEVyxHQTNEWCxFQTJEVztBQUNkLGFBQU8sSUFBSSxZQUFBLENBQUosV0FBQSxDQUFBLEdBQUEsRUFBUCxJQUFPLENBQVA7QUFEYztBQTNEWDtBQUFBO0FBQUEscUNBNkRXO0FBQ2QsVUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBOztBQUFBLFVBQUcsS0FBQSxXQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBTyxLQUFQLFdBQUE7QUN5REQ7O0FEeERELE1BQUEsR0FBQSxHQUFNLEtBQUEsTUFBQSxDQUFOLFNBQU0sQ0FBTjtBQUNBLE1BQUEsS0FBQSxHQUFBLGFBQUE7O0FBQ0EsVUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sS0FBQSxjQUFBLENBQVAsR0FBTyxDQUFQO0FBQ0EsUUFBQSxJQUFJLENBQUosT0FBQSxHQUFBLElBQUE7QUFDQSxRQUFBLEdBQUEsR0FBTSxJQUFJLENBQVYsTUFBTSxFQUFOOztBQUNBLFlBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsS0FBQSxHQUFBLEdBQUE7QUFMSjtBQ2dFQzs7QUQxREQsV0FBQSxXQUFBLEdBQUEsS0FBQTtBQUNBLGFBQU8sS0FBUCxXQUFBO0FBWmM7QUE3RFg7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFTEEsSUFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLFdBQUEsQ0FBQTs7QUFFQSxJQUFhLFdBQU47QUFBQTtBQUFBO0FBQ0wsdUJBQWEsSUFBYixFQUFhLE9BQWIsRUFBYTtBQUFBOztBQUNYLFFBQUEsUUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBO0FBRFksU0FBQSxJQUFBLEdBQUEsSUFBQTtBQUNaLElBQUEsUUFBQSxHQUFXO0FBQ1QsYUFEUyxJQUFBO0FBRVQsYUFGUyxJQUFBO0FBR1QsZUFIUyxJQUFBO0FBSVQsa0JBSlMsSUFBQTtBQUtULG1CQUxTLEtBQUE7QUFNVCxnQkFBVztBQU5GLEtBQVg7QUFRQSxJQUFBLEdBQUEsR0FBQSxDQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxDQUFBOztBQUFBLFNBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDTUUsTUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFULENBQVMsQ0FBVDs7QURMQSxVQUFHLEdBQUEsSUFBSCxPQUFBLEVBQUE7QUFDRSxRQUFBLFFBQVMsQ0FBVCxVQUFTLENBQVQsR0FBdUIsT0FBUSxDQUEvQixHQUErQixDQUEvQjtBQ09EO0FEVEg7O0FBR0EsU0FBQSxHQUFBLElBQUEsUUFBQSxFQUFBO0FDU0UsTUFBQSxHQUFHLEdBQUcsUUFBUSxDQUFkLEdBQWMsQ0FBZDs7QURSQSxVQUFHLEdBQUEsSUFBSCxPQUFBLEVBQUE7QUFDRSxhQUFBLEdBQUEsSUFBWSxPQUFRLENBQXBCLEdBQW9CLENBQXBCO0FBREYsT0FBQSxNQUFBO0FBR0UsYUFBQSxHQUFBLElBQUEsR0FBQTtBQ1VEO0FEZEg7QUFaVzs7QUFEUjtBQUFBO0FBQUEsMkJBbUJHLElBbkJILEVBbUJHO0FDYU4sYURaQSxJQUFLLENBQUEsS0FBTCxJQUFLLENBQUwsR0FBYyxRQUFBLENBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBbUIsS0FBbkIsSUFBQSxDQ1lkO0FEYk07QUFuQkg7QUFBQTtBQUFBLDZCQXNCSyxNQXRCTCxFQXNCSyxHQXRCTCxFQXNCSztBQUNSLFVBQUcsTUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLElBQUEsS0FBSCxJQUFBLEVBQUE7QUNjRSxlRGJBLEdBQUksQ0FBQSxLQUFKLFFBQUksQ0FBSixHQUFpQixNQUFNLENBQU4sSUFBQSxDQUFZLEtBQVosSUFBQSxDQ2FqQjtBQUNEO0FEaEJPO0FBdEJMO0FBQUE7QUFBQSwrQkF5Qk8sR0F6QlAsRUF5Qk87QUFDVixVQUFHLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxZQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLEdBQUcsQ0FBSCxTQUFBLENBQWMsS0FBckIsR0FBTyxDQUFQO0FDaUJEOztBRGhCRCxZQUFHLEtBQUEsS0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLEdBQUksQ0FBQSxLQUFYLEtBQVcsQ0FBSixFQUFQO0FDa0JEOztBRGpCRCxZQUFHLGVBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sR0FBSSxDQUFYLFdBQVcsQ0FBWDtBQU5KO0FDMEJDO0FEM0JTO0FBekJQO0FBQUE7QUFBQSwrQkFpQ08sR0FqQ1AsRUFpQ087QUFDVixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxLQUFBLFVBQUEsQ0FBTixHQUFNLENBQU47QUFDQSxhQUFPLEtBQUEsU0FBQSxJQUFjLEdBQUEsSUFBckIsSUFBQTtBQUZVO0FBakNQO0FBQUE7QUFBQSw0QkFvQ0ksR0FwQ0osRUFvQ0k7QUFDUCxVQUFHLEtBQUEsVUFBQSxDQUFILEdBQUcsQ0FBSCxFQUFBO0FBQ0UsMkJBQ0ksS0FBQyxJQURMLGlCQUVFLEtBQUEsVUFBQSxDQUFBLEdBQUEsS0FGRixFQUFBLFNBRThCLEtBQUEsTUFBQSxHQUFBLEdBQUEsR0FBc0IsRUFGcEQsa0JBR0ssS0FBQyxJQUhOO0FDMEJEO0FENUJNO0FBcENKOztBQUFBO0FBQUEsR0FBUDs7OztBQTZDTSxXQUFXLENBQWpCLE1BQU07QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwrQkFDUSxHQURSLEVBQ1E7QUFDVixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBREYsMEVBQ0UsR0FERixDQUNFOztBQUNBLFVBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLEdBQUcsQ0FBSCxPQUFBLENBQUEsS0FBQSxFQUFOLElBQU0sQ0FBTjtBQzBCRDs7QUR6QkQsYUFBQSxHQUFBO0FBSlU7QUFEUjtBQUFBO0FBQUEsMkJBTUksSUFOSixFQU1JO0FDNkJOLGFENUJBLElBQUssQ0FBQSxLQUFMLElBQUssQ0FBTCxHQUFjLFFBQUEsQ0FBQSxPQUFBLENBQUEsVUFBQSxDQUFtQixLQUFuQixJQUFBLEVBQXlCO0FBQUMsMkJBQW9CO0FBQXJCLE9BQXpCLENDNEJkO0FEN0JNO0FBTko7QUFBQTtBQUFBLCtCQVFRLEdBUlIsRUFRUTtBQUNWLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLEtBQUEsVUFBQSxDQUFOLEdBQU0sQ0FBTjtBQUNBLGFBQVEsS0FBQSxTQUFBLElBQWUsRUFBRSxHQUFBLElBQUEsSUFBQSxJQUFTLEdBQUEsQ0FBQSxPQUFBLElBQTNCLElBQWdCLENBQWYsSUFBNEMsR0FBQSxJQUFwRCxJQUFBO0FBRlU7QUFSUjs7QUFBQTtBQUFBLEVBQU4sV0FBTTs7QUFhQSxXQUFXLENBQWpCLE1BQU07QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw0QkFDSyxHQURMLEVBQ0s7QUFDUCxVQUFHLEtBQUEsVUFBQSxDQUFBLEdBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSw0QkFBYSxLQUFDLElBQWQsZUFBdUIsS0FBQSxVQUFBLENBQWhCLEdBQWdCLENBQXZCLFNBQTZDLEtBQUEsTUFBQSxHQUFBLEdBQUEsR0FBN0MsRUFBQTtBQ29DRDtBRHRDTTtBQURMOztBQUFBO0FBQUEsRUFBTixXQUFNOztBQU1BLFdBQVcsQ0FBakIsT0FBTTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNJLElBREosRUFDSTtBQ3VDTixhRHRDQSxJQUFLLENBQUEsS0FBTCxJQUFLLENBQUwsR0FBYyxRQUFBLENBQUEsT0FBQSxDQUFBLGNBQUEsQ0FBdUIsS0FBdkIsSUFBQSxDQ3NDZDtBRHZDTTtBQURKO0FBQUE7QUFBQSw2QkFHTSxNQUhOLEVBR00sR0FITixFQUdNO0FBQ1IsVUFBRyxNQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsSUFBQSxLQUFILElBQUEsRUFBQTtBQ3lDRSxlRHhDQSxHQUFJLENBQUEsS0FBSixRQUFJLENBQUosR0FBaUIsQ0FBQyxNQUFNLENBQU4sSUFBQSxDQUFZLEtBQVosSUFBQSxDQ3dDbEI7QUFDRDtBRDNDTztBQUhOO0FBQUE7QUFBQSw0QkFNSyxHQU5MLEVBTUs7QUFDUCxVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxLQUFBLFVBQUEsQ0FBTixHQUFNLENBQU47O0FBQ0EsVUFBRyxHQUFBLElBQUEsSUFBQSxJQUFTLENBQVosR0FBQSxFQUFBO0FBQ0UsNEJBQWEsS0FBYixJQUFBO0FDNkNEO0FEaERNO0FBTkw7O0FBQUE7QUFBQSxFQUFOLFdBQU07O0FBWUEsV0FBVyxDQUFqQixJQUFNO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMkJBQ0ksSUFESixFQUNJO0FDZ0ROLGFEL0NBLElBQUssQ0FBQSxLQUFMLElBQUssQ0FBTCxHQUFjLFFBQUEsQ0FBQSxPQUFBLENBQUEsY0FBQSxDQUF1QixLQUF2QixJQUFBLENDK0NkO0FEaERNO0FBREo7QUFBQTtBQUFBLDRCQUdLLEdBSEwsRUFHSztBQUNQLFVBQW1CLEtBQUEsVUFBQSxDQUFuQixHQUFtQixDQUFuQixFQUFBO0FBQUEsNEJBQU0sS0FBQyxJQUFQO0FDbURDO0FEcERNO0FBSEw7O0FBQUE7QUFBQSxFQUFOLFdBQU07Ozs7Ozs7Ozs7Ozs7Ozs7QUU5RU4sSUFBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUE7O0FBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxDQUFBLHNCQUFBLENBQUE7O0FBQ0EsSUFBQSxnQkFBQSxHQUFBLE9BQUEsQ0FBQSwyQkFBQSxDQUFBOztBQUVBLElBQWEsTUFBTjtBQUFBO0FBQUE7QUFDTCxvQkFBYTtBQUFBOztBQUNYLFNBQUEsU0FBQSxHQUFBLElBQUE7QUFDQSxTQUFBLEtBQUEsR0FBQSxJQUFBO0FBRlc7O0FBRFI7QUFBQTtBQUFBLDZCQUlLLFFBSkwsRUFJSyxDQUFBO0FBSkw7QUFBQTtBQUFBLHlCQU1DLEdBTkQsRUFNQztBQUNKLFlBQUEsaUJBQUE7QUFESTtBQU5EO0FBQUE7QUFBQSwrQkFRTyxHQVJQLEVBUU87QUFDVixZQUFBLGlCQUFBO0FBRFU7QUFSUDtBQUFBO0FBQUEsOEJBVUk7QUFDUCxZQUFBLGlCQUFBO0FBRE87QUFWSjtBQUFBO0FBQUEsK0JBWU8sS0FaUCxFQVlPLEdBWlAsRUFZTztBQUNWLFlBQUEsaUJBQUE7QUFEVTtBQVpQO0FBQUE7QUFBQSxpQ0FjUyxJQWRULEVBY1MsR0FkVCxFQWNTO0FBQ1osWUFBQSxpQkFBQTtBQURZO0FBZFQ7QUFBQTtBQUFBLCtCQWdCTyxLQWhCUCxFQWdCTyxHQWhCUCxFQWdCTyxJQWhCUCxFQWdCTztBQUNWLFlBQUEsaUJBQUE7QUFEVTtBQWhCUDtBQUFBO0FBQUEsbUNBa0JTO0FBQ1osWUFBQSxpQkFBQTtBQURZO0FBbEJUO0FBQUE7QUFBQSxpQ0FvQlMsS0FwQlQsRUFvQlM7QUFBQSxVQUFRLEdBQVIsdUVBQUEsSUFBQTtBQUNaLFlBQUEsaUJBQUE7QUFEWTtBQXBCVDtBQUFBO0FBQUEsc0NBc0JZLENBQUE7QUF0Qlo7QUFBQTtBQUFBLG9DQXdCVSxDQUFBO0FBeEJWO0FBQUE7QUFBQSw4QkEwQkk7QUFDUCxhQUFPLEtBQVAsS0FBQTtBQURPO0FBMUJKO0FBQUE7QUFBQSw0QkE0QkksR0E1QkosRUE0Qkk7QUNnQ1AsYUQvQkEsS0FBQSxLQUFBLEdBQVMsR0MrQlQ7QURoQ087QUE1Qko7QUFBQTtBQUFBLDRDQThCa0I7QUFDckIsYUFBQSxJQUFBO0FBRHFCO0FBOUJsQjtBQUFBO0FBQUEsMENBZ0NnQjtBQUNuQixhQUFBLEtBQUE7QUFEbUI7QUFoQ2hCO0FBQUE7QUFBQSxnQ0FrQ1EsVUFsQ1IsRUFrQ1E7QUFDWCxZQUFBLGlCQUFBO0FBRFc7QUFsQ1I7QUFBQTtBQUFBLGtDQW9DUTtBQUNYLFlBQUEsaUJBQUE7QUFEVztBQXBDUjtBQUFBO0FBQUEsd0NBc0NjO0FBQ2pCLGFBQUEsS0FBQTtBQURpQjtBQXRDZDtBQUFBO0FBQUEsc0NBd0NjLFFBeENkLEVBd0NjO0FBQ2pCLFlBQUEsaUJBQUE7QUFEaUI7QUF4Q2Q7QUFBQTtBQUFBLHlDQTBDaUIsUUExQ2pCLEVBMENpQjtBQUNwQixZQUFBLGlCQUFBO0FBRG9CO0FBMUNqQjtBQUFBO0FBQUEsOEJBNkNNLEdBN0NOLEVBNkNNO0FBQ1QsYUFBTyxJQUFJLElBQUEsQ0FBSixHQUFBLENBQVEsS0FBQSxhQUFBLENBQVIsR0FBUSxDQUFSLEVBQTRCLEtBQUEsV0FBQSxDQUFuQyxHQUFtQyxDQUE1QixDQUFQO0FBRFM7QUE3Q047QUFBQTtBQUFBLGtDQStDVSxHQS9DVixFQStDVTtBQUNiLFVBQUEsQ0FBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLEtBQUEsV0FBQSxDQUFBLEdBQUEsRUFBa0IsQ0FBbEIsSUFBa0IsQ0FBbEIsRUFBMEIsQ0FBOUIsQ0FBSSxDQUFKOztBQUNPLFVBQUEsQ0FBQSxFQUFBO0FDa0RMLGVEbERlLENBQUMsQ0FBRCxHQUFBLEdBQU0sQ0NrRHJCO0FEbERLLE9BQUEsTUFBQTtBQ29ETCxlRHBENEIsQ0NvRDVCO0FBQ0Q7QUR2RFk7QUEvQ1Y7QUFBQTtBQUFBLGdDQWtEUSxHQWxEUixFQWtEUTtBQUNYLFVBQUEsQ0FBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLEtBQUEsV0FBQSxDQUFBLEdBQUEsRUFBa0IsQ0FBQSxJQUFBLEVBQXRCLElBQXNCLENBQWxCLENBQUo7O0FBQ08sVUFBQSxDQUFBLEVBQUE7QUN5REwsZUR6RGUsQ0FBQyxDQUFDLEdDeURqQjtBRHpESyxPQUFBLE1BQUE7QUMyREwsZUQzRDBCLEtBQUEsT0FBQSxFQzJEMUI7QUFDRDtBRDlEVTtBQWxEUjtBQUFBO0FBQUEsZ0NBc0RRLEtBdERSLEVBc0RRLE9BdERSLEVBc0RRO0FBQUEsVUFBZSxTQUFmLHVFQUFBLENBQUE7QUFDWCxVQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLElBQUE7O0FBQUEsVUFBRyxTQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sS0FBQSxVQUFBLENBQUEsS0FBQSxFQUFrQixLQUF6QixPQUF5QixFQUFsQixDQUFQO0FBREYsT0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFBLEdBQU8sS0FBQSxVQUFBLENBQUEsQ0FBQSxFQUFQLEtBQU8sQ0FBUDtBQytERDs7QUQ5REQsTUFBQSxPQUFBLEdBQUEsSUFBQTs7QUFDQSxXQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLE9BQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQ2dFRSxRQUFBLElBQUksR0FBRyxPQUFPLENBQWQsQ0FBYyxDQUFkO0FEL0RBLFFBQUEsR0FBQSxHQUFTLFNBQUEsR0FBQSxDQUFBLEdBQW1CLElBQUksQ0FBSixPQUFBLENBQW5CLElBQW1CLENBQW5CLEdBQTJDLElBQUksQ0FBSixXQUFBLENBQXBELElBQW9ELENBQXBEOztBQUNBLFlBQUcsR0FBQSxLQUFPLENBQVYsQ0FBQSxFQUFBO0FBQ0UsY0FBSSxPQUFBLElBQUEsSUFBQSxJQUFZLE9BQUEsR0FBQSxTQUFBLEdBQW9CLEdBQUEsR0FBcEMsU0FBQSxFQUFBO0FBQ0UsWUFBQSxPQUFBLEdBQUEsR0FBQTtBQUNBLFlBQUEsT0FBQSxHQUFBLElBQUE7QUFISjtBQ3FFQztBRHZFSDs7QUFNQSxVQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLElBQUksT0FBQSxDQUFKLE1BQUEsQ0FBZSxTQUFBLEdBQUEsQ0FBQSxHQUFtQixPQUFBLEdBQW5CLEtBQUEsR0FBZixPQUFBLEVBQVAsT0FBTyxDQUFQO0FDb0VEOztBRG5FRCxhQUFBLElBQUE7QUFkVztBQXREUjtBQUFBO0FBQUEsc0NBc0VjLFlBdEVkLEVBc0VjO0FBQUE7O0FDc0VqQixhRHJFQSxZQUFZLENBQVosTUFBQSxDQUFvQixVQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUE7QUNzRWxCLGVEckVFLE9BQU8sQ0FBUCxJQUFBLENBQWMsVUFBQSxHQUFELEVBQUE7QUFDWCxVQUFBLElBQUksQ0FBSixVQUFBLENBQUEsS0FBQTtBQUNBLFVBQUEsSUFBSSxDQUFKLFdBQUEsQ0FBaUIsR0FBRyxDQUFwQixNQUFBO0FDc0VGLGlCRHJFRSxDQUFBLEdBQUEsZ0JBQUEsQ0FBQSxlQUFBLEVBQWdCLElBQUksQ0FBcEIsS0FBZ0IsRUFBaEIsRUFBQSxJQUFBLENBQW1DLFlBQUE7QUNzRW5DLG1CRHJFRTtBQUNFLGNBQUEsVUFBQSxFQUFZLEdBQUcsQ0FBSCxVQUFBLENBQUEsTUFBQSxDQUFzQixJQUFJLENBRHhDLFVBQ2MsQ0FEZDtBQUVFLGNBQUEsTUFBQSxFQUFRLEdBQUcsQ0FBSCxNQUFBLEdBQVcsSUFBSSxDQUFKLFdBQUEsQ0FBQSxLQUFBO0FBRnJCLGFDcUVGO0FEdEVBLFdBQUEsQ0NxRUY7QUR4RUEsU0FBQSxDQ3FFRjtBRHRFRixPQUFBLEVBU0ksQ0FBQSxHQUFBLGdCQUFBLENBQUEsZUFBQSxFQUFnQjtBQUFDLFFBQUEsVUFBQSxFQUFELEVBQUE7QUFBZ0IsUUFBQSxNQUFBLEVBQVE7QUFBeEIsT0FBaEIsQ0FUSixFQUFBLElBQUEsQ0FVTyxVQUFBLEdBQUQsRUFBQTtBQzBFSixlRHpFQSxLQUFBLENBQUEsMkJBQUEsQ0FBNkIsR0FBRyxDQUFoQyxVQUFBLENDeUVBO0FEcEZGLE9BQUEsRUFBQSxNQUFBLEVDcUVBO0FEdEVpQjtBQXRFZDtBQUFBO0FBQUEsZ0RBc0Z3QixVQXRGeEIsRUFzRndCO0FBQzNCLFVBQUcsVUFBVSxDQUFWLE1BQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxZQUFHLEtBQUgsbUJBQUcsRUFBSCxFQUFBO0FDMEVFLGlCRHpFQSxLQUFBLFdBQUEsQ0FBQSxVQUFBLENDeUVBO0FEMUVGLFNBQUEsTUFBQTtBQzRFRSxpQkR6RUEsS0FBQSxZQUFBLENBQWMsVUFBVyxDQUFYLENBQVcsQ0FBWCxDQUFkLEtBQUEsRUFBa0MsVUFBVyxDQUFYLENBQVcsQ0FBWCxDQUFsQyxHQUFBLENDeUVBO0FEN0VKO0FDK0VDO0FEaEYwQjtBQXRGeEI7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVKQSxJQUFhLE1BQUEsR0FBQSxZQUFBO0FBQUEsTUFBTixNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNEJBRU47QUFDSCxZQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUE7O0FBQUEsWUFBRyxLQUFILFNBQUcsRUFBSCxFQUFBO0FBQ0UsVUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFERiw0Q0FERyxJQUNIO0FBREcsWUFBQSxJQUNIO0FBQUE7O0FBQ0UsZUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNHSSxZQUFBLEdBQUcsR0FBRyxJQUFJLENBQVYsQ0FBVSxDQUFWO0FBQ0EsWUFBQSxPQUFPLENBQVAsSUFBQSxDREhGLE9BQU8sQ0FBUCxHQUFBLENBQUEsR0FBQSxDQ0dFO0FESko7O0FDTUUsaUJBQUEsT0FBQTtBQUNEO0FEVEE7QUFGTTtBQUFBO0FBQUEsa0NBTUE7QUNTUCxlRFJGLENBQUEsT0FBQSxPQUFBLEtBQUEsV0FBQSxJQUFBLE9BQUEsS0FBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLENBQUEsS0FBQSxJQUFBLElBQWtCLEtBQWxCLE9BQUEsSUFBbUMsTUFBTSxDQUFDLE9DUXhDO0FEVE87QUFOQTtBQUFBO0FBQUEsOEJBU0YsS0FURSxFQVNGO0FBQUEsWUFBTyxJQUFQLHVFQUFBLFVBQUE7QUFDUCxZQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQTtBQUFBLFFBQUEsRUFBQSxHQUFLLFdBQVcsQ0FBaEIsR0FBSyxFQUFMO0FBQ0EsUUFBQSxHQUFBLEdBQU0sS0FBTixFQUFBO0FBQ0EsUUFBQSxFQUFBLEdBQUssV0FBVyxDQUFoQixHQUFLLEVBQUw7QUFDQSxRQUFBLE9BQU8sQ0FBUCxHQUFBLFdBQWUsSUFBZixtQkFBNEIsRUFBQSxHQUE1QixFQUFBO0FDV0UsZURWRixHQ1VFO0FEZks7QUFURTtBQUFBO0FBQUEsZ0NBZ0JBLEdBaEJBLEVBZ0JBLElBaEJBLEVBZ0JBO0FBQUEsWUFBVSxNQUFWLHVFQUFBLEVBQUE7QUFDVCxZQUFBLEtBQUE7QUFBQSxRQUFBLEtBQUEsR0FBUSxHQUFJLENBQVosSUFBWSxDQUFaO0FDYUUsZURaRixHQUFJLENBQUosSUFBSSxDQUFKLEdBQVksWUFBQTtBQUNWLGNBQUEsSUFBQTtBQUFBLFVBQUEsSUFBQSxHQUFBLFNBQUE7QUNjRSxpQkRiRixLQUFBLE9BQUEsQ0FBYyxZQUFBO0FDY1YsbUJEZGEsS0FBSyxDQUFMLEtBQUEsQ0FBQSxHQUFBLEVBQUEsSUFBQSxDQ2NiO0FEZEosV0FBQSxFQUF3QyxNQUFBLEdBQXhDLElBQUEsQ0NhRTtBQUhGLFNBQUE7QURkTztBQWhCQTtBQUFBO0FBQUEsOEJBcUJGLEtBckJFLEVBcUJGLElBckJFLEVBcUJGO0FBQ1AsWUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUE7QUFBQSxRQUFBLEVBQUEsR0FBSyxXQUFXLENBQWhCLEdBQUssRUFBTDtBQUNBLFFBQUEsR0FBQSxHQUFNLEtBQU4sRUFBQTtBQUNBLFFBQUEsRUFBQSxHQUFLLFdBQVcsQ0FBaEIsR0FBSyxFQUFMOztBQUNBLFlBQUcsS0FBQSxXQUFBLENBQUEsSUFBQSxLQUFILElBQUEsRUFBQTtBQUNFLGVBQUEsV0FBQSxDQUFBLElBQUEsRUFBQSxLQUFBO0FBQ0EsZUFBQSxXQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsSUFBK0IsRUFBQSxHQUEvQixFQUFBO0FBRkYsU0FBQSxNQUFBO0FBSUUsZUFBQSxXQUFBLENBQUEsSUFBQSxJQUF5QjtBQUN2QixZQUFBLEtBQUEsRUFEdUIsQ0FBQTtBQUV2QixZQUFBLEtBQUEsRUFBTyxFQUFBLEdBQUs7QUFGVyxXQUF6QjtBQ3VCQzs7QUFDRCxlRHBCRixHQ29CRTtBRGhDSztBQXJCRTtBQUFBO0FBQUEsK0JBa0NIO0FDdUJKLGVEdEJGLE9BQU8sQ0FBUCxHQUFBLENBQVksS0FBWixXQUFBLENDc0JFO0FEdkJJO0FBbENHOztBQUFBO0FBQUE7O0FBQU47QUFDTCxFQUFBLE1BQUMsQ0FBRCxPQUFBLEdBQUEsSUFBQTtBQytEQSxFQUFBLE1BQU0sQ0FBTixTQUFBLENEeERBLE9Dd0RBLEdEeERTLElDd0RUO0FBRUEsRUFBQSxNQUFNLENBQU4sU0FBQSxDRG5EQSxXQ21EQSxHRG5EYSxFQ21EYjtBQUVBLFNBQUEsTUFBQTtBRHBFVyxDQUFBLENBQUEsSUFBQSxDQUFBLEtBQWIsQ0FBYSxDQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVBQSxJQUFhLFlBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw0QkFDSSxPQURKLEVBQ0ksUUFESixFQUNJO0FBQ1AsVUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBO0FBQUEsV0FBQSxRQUFBLEdBQUEsUUFBQTtBQUNBLE1BQUEsR0FBQSxHQUFBLEtBQUEsUUFBQTtBQUFBLE1BQUEsT0FBQSxHQUFBLEVBQUE7O0FBQUEsV0FBQSxHQUFBLElBQUEsR0FBQSxFQUFBO0FDSUUsUUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFULEdBQVMsQ0FBVDs7QURIQSxZQUFHLEdBQUEsSUFBSCxPQUFBLEVBQUE7QUNLRSxVQUFBLE9BQU8sQ0FBUCxJQUFBLENESkEsS0FBQSxNQUFBLENBQUEsR0FBQSxFQUFZLE9BQVEsQ0FBcEIsR0FBb0IsQ0FBcEIsQ0NJQTtBRExGLFNBQUEsTUFBQTtBQ09FLFVBQUEsT0FBTyxDQUFQLElBQUEsQ0RKQSxLQUFBLE1BQUEsQ0FBQSxHQUFBLEVBQUEsR0FBQSxDQ0lBO0FBQ0Q7QURUSDs7QUNXQSxhQUFBLE9BQUE7QURiTztBQURKO0FBQUE7QUFBQSwyQkFTRyxHQVRILEVBU0csR0FUSCxFQVNHO0FBQ04sVUFBQSxHQUFBOztBQUFBLFVBQUcsQ0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUEsQ0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLENBQUEsSUFBQSxHQUFBLEtBQUEsQ0FBQSxLQUFILElBQUEsRUFBQTtBQ1VFLGVEVEEsS0FBQSxHQUFBLEVBQUEsR0FBQSxDQ1NBO0FEVkYsT0FBQSxNQUFBO0FDWUUsZURUQSxLQUFBLEdBQUEsSUFBVyxHQ1NYO0FBQ0Q7QURkSztBQVRIO0FBQUE7QUFBQSwyQkFlRyxHQWZILEVBZUc7QUFDTixVQUFBLEdBQUE7O0FBQUEsVUFBRyxDQUFBLENBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQSxDQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsQ0FBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLEtBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBTyxLQUFQLEdBQU8sR0FBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sS0FBUCxHQUFPLENBQVA7QUNhRDtBRGpCSztBQWZIO0FBQUE7QUFBQSw4QkFxQkk7QUFDUCxVQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLElBQUEsR0FBQSxFQUFBO0FBQ0EsTUFBQSxHQUFBLEdBQUEsS0FBQSxRQUFBOztBQUFBLFdBQUEsR0FBQSxJQUFBLEdBQUEsRUFBQTtBQ2lCRSxRQUFBLEdBQUcsR0FBRyxHQUFHLENBQVQsR0FBUyxDQUFUO0FEaEJBLFFBQUEsSUFBSyxDQUFMLEdBQUssQ0FBTCxHQUFZLEtBQUEsTUFBQSxDQUFaLEdBQVksQ0FBWjtBQURGOztBQUVBLGFBQUEsSUFBQTtBQUpPO0FBckJKOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQUEsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLGVBQUEsQ0FBQTs7QUFDQSxJQUFBLFVBQUEsR0FBQSxPQUFBLENBQUEsYUFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSw2QkFBQSxDQUFBOztBQUNBLElBQUEsSUFBQSxHQUFBLE9BQUEsQ0FBQSxtQkFBQSxDQUFBOztBQUNBLElBQUEsT0FBQSxHQUFBLE9BQUEsQ0FBQSxzQkFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSwyQkFBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsZ0JBQUEsR0FBQSxPQUFBLENBQUEsMkJBQUEsQ0FBQTs7QUFDQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsV0FBQSxDQUFBOztBQUNBLElBQUEsZ0JBQUEsR0FBQSxPQUFBLENBQUEsMkJBQUEsQ0FBQTs7QUFFQSxJQUFhLHFCQUFOO0FBQUE7QUFBQTtBQUFBOztBQUNMLGlDQUFhLFFBQWIsRUFBYSxJQUFiLEVBQWEsSUFBYixFQUFhO0FBQUE7O0FBQUE7O0FDOEJYO0FEOUJZLFVBQUEsUUFBQSxHQUFBLFFBQUE7QUFBVSxVQUFBLEdBQUEsR0FBQSxJQUFBO0FBQUssVUFBQSxHQUFBLEdBQUEsSUFBQTs7QUFFM0IsUUFBQSxDQUFPLE1BQVAsT0FBTyxFQUFQLEVBQUE7QUFDRSxZQUFBLFlBQUE7O0FBQ0EsWUFBQSxPQUFBLEdBQVcsTUFBWCxHQUFBO0FBQ0EsWUFBQSxTQUFBLEdBQWEsTUFBQSxjQUFBLENBQWdCLE1BQTdCLEdBQWEsQ0FBYjs7QUFDQSxZQUFBLGdCQUFBOztBQUNBLFlBQUEsWUFBQTs7QUFDQSxZQUFBLGVBQUE7QUNpQ0Q7O0FEekNVO0FBQUE7O0FBRFI7QUFBQTtBQUFBLG1DQVVTO0FBQ1osVUFBQSxDQUFBLEVBQUEsU0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLEtBQUEsY0FBQSxDQUFnQixLQUE1QixHQUFZLENBQVo7O0FBQ0EsVUFBRyxTQUFTLENBQVQsU0FBQSxDQUFBLENBQUEsRUFBc0IsS0FBQSxRQUFBLENBQUEsU0FBQSxDQUF0QixNQUFBLE1BQXFELEtBQUEsUUFBQSxDQUFyRCxTQUFBLEtBQTZFLENBQUEsR0FBSSxLQUFwRixlQUFvRixFQUFqRixDQUFILEVBQUE7QUFDRSxhQUFBLFVBQUEsR0FBYyxJQUFJLE9BQUEsQ0FBSixNQUFBLENBQVcsS0FBWCxHQUFBLEVBQWlCLEtBQS9CLEdBQWMsQ0FBZDtBQUNBLGFBQUEsR0FBQSxHQUFPLENBQUMsQ0FBUixHQUFBO0FDcUNBLGVEcENBLEtBQUEsR0FBQSxHQUFPLENBQUMsQ0FBQyxHQ29DVDtBQUNEO0FEMUNXO0FBVlQ7QUFBQTtBQUFBLHNDQWdCWTtBQUNmLFVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEtBQUEsY0FBQSxDQUFnQixLQUFoQixHQUFBLEVBQUEsU0FBQSxDQUFnQyxLQUFBLFFBQUEsQ0FBQSxTQUFBLENBQTFDLE1BQVUsQ0FBVjtBQUNBLE1BQUEsT0FBQSxHQUFVLEtBQUEsUUFBQSxDQUFBLE9BQUEsR0FBVixPQUFBO0FBQ0EsTUFBQSxPQUFBLEdBQVUsS0FBVixHQUFBOztBQUNBLFVBQUcsQ0FBQSxHQUFJLEtBQUEsUUFBQSxDQUFBLGdCQUFBLENBQTJCLEtBQTNCLEdBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFnRCxDQUF2RCxDQUFPLENBQVAsRUFBQTtBQUNFLFFBQUEsQ0FBQyxDQUFELEdBQUEsR0FBUSxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUE0QixDQUFDLENBQTdCLEdBQUEsRUFBa0MsS0FBQSxRQUFBLENBQUEsY0FBQSxDQUF5QixDQUFDLENBQUQsR0FBQSxHQUFNLENBQUMsQ0FBRCxHQUFBLENBQS9CLE1BQUEsSUFBNkMsS0FBQSxRQUFBLENBQUEsT0FBQSxDQUF2RixNQUFRLENBQVI7QUFDQSxlQUFBLENBQUE7QUN5Q0Q7QUQvQ2M7QUFoQlo7QUFBQTtBQUFBLHVDQXVCYTtBQUNoQixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxLQUFBLFNBQUEsQ0FBQSxLQUFBLENBQVIsR0FBUSxDQUFSO0FBQ0EsV0FBQSxPQUFBLEdBQVcsS0FBSyxDQUFoQixLQUFXLEVBQVg7QUM2Q0EsYUQ1Q0EsS0FBQSxTQUFBLEdBQWEsS0FBSyxDQUFMLElBQUEsQ0FBQSxHQUFBLENDNENiO0FEL0NnQjtBQXZCYjtBQUFBO0FBQUEsaUNBMkJRLE1BM0JSLEVBMkJRO0FBQ1gsVUFBQSxXQUFBLEVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksWUFBQSxDQUFKLFdBQUEsQ0FBQSxNQUFBLEVBQXdCO0FBQy9CLFFBQUEsWUFBQSxFQUFjLEtBQUEsU0FBQSxDQURpQixjQUNqQixDQURpQjtBQUUvQixRQUFBLElBQUEsRUFBTSxLQUFBLFFBQUEsQ0FBVTtBQUZlLE9BQXhCLENBQVQ7QUFJQSxXQUFBLE1BQUEsR0FBVSxNQUFNLENBQWhCLE1BQUE7QUFDQSxXQUFBLEtBQUEsR0FBUyxNQUFNLENBQU4sTUFBQSxDQUFjLEtBQWQsV0FBYyxFQUFkLEVBQThCLE1BQU0sQ0FBN0MsS0FBUyxDQUFUOztBQUNBLFVBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxXQUFBLEdBQWMsS0FBQSxTQUFBLENBQWQsYUFBYyxDQUFkOztBQUNBLFlBQUcsV0FBQSxJQUFILElBQUEsRUFBQTtBQ2dERSxpQkQvQ0EsS0FBQSxLQUFBLENBQUEsV0FBQSxJQUFzQixLQUFDLE9DK0N2QjtBRGxESjtBQ29EQztBRDNEVTtBQTNCUjtBQUFBO0FBQUEsbUNBc0NTO0FBQ1osVUFBQSxDQUFBOztBQUFBLFVBQUcsQ0FBQSxHQUFJLEtBQVAsZUFBTyxFQUFQLEVBQUE7QUFDRSxhQUFBLE9BQUEsR0FBVyxhQUFBLENBQUEsWUFBQSxDQUFBLGFBQUEsQ0FBMkIsS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBNEIsS0FBQSxHQUFBLEdBQUssS0FBQSxHQUFBLENBQWpDLE1BQUEsRUFBNkMsQ0FBQyxDQUFwRixHQUFzQyxDQUEzQixDQUFYO0FDcURBLGVEcERBLEtBQUEsR0FBQSxHQUFPLEtBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQTRCLEtBQTVCLEdBQUEsRUFBaUMsQ0FBQyxDQUFELEdBQUEsR0FBTSxDQUFDLENBQUQsR0FBQSxDQUF2QyxNQUFBLENDb0RQO0FBQ0Q7QUR4RFc7QUF0Q1Q7QUFBQTtBQUFBLHNDQTBDWTtBQUNmLFVBQUEsT0FBQSxFQUFBLENBQUEsRUFBQSxPQUFBOztBQUFBLFVBQXNCLEtBQUEsVUFBQSxJQUF0QixJQUFBLEVBQUE7QUFBQSxlQUFPLEtBQVAsVUFBQTtBQzBEQzs7QUR6REQsTUFBQSxPQUFBLEdBQVUsS0FBQSxRQUFBLENBQUEsT0FBQSxHQUFvQixLQUFBLFFBQUEsQ0FBcEIsU0FBQSxHQUEwQyxLQUExQyxPQUFBLEdBQXFELEtBQUEsUUFBQSxDQUEvRCxPQUFBO0FBQ0EsTUFBQSxPQUFBLEdBQVUsS0FBQSxRQUFBLENBQUEsT0FBQSxHQUFvQixLQUE5QixPQUFBOztBQUNBLFVBQUcsQ0FBQSxHQUFJLEtBQUEsUUFBQSxDQUFBLGdCQUFBLENBQTJCLEtBQUEsR0FBQSxHQUFLLEtBQUEsR0FBQSxDQUFoQyxNQUFBLEVBQUEsT0FBQSxFQUFQLE9BQU8sQ0FBUCxFQUFBO0FBQ0UsZUFBTyxLQUFBLFVBQUEsR0FBUCxDQUFBO0FDMkREO0FEaEVjO0FBMUNaO0FBQUE7QUFBQSxzQ0FnRFk7QUFDZixVQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEtBQVQsU0FBUyxFQUFUO0FBQ0EsTUFBQSxHQUFBLEdBQU0sS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFOLE9BQU0sRUFBTjs7QUFDQSxhQUFNLE1BQUEsR0FBQSxHQUFBLElBQWlCLEtBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsTUFBQSxFQUFtQyxNQUFBLEdBQU8sS0FBQSxRQUFBLENBQUEsSUFBQSxDQUExQyxNQUFBLE1BQW9FLEtBQUEsUUFBQSxDQUEzRixJQUFBLEVBQUE7QUFDRSxRQUFBLE1BQUEsSUFBUSxLQUFBLFFBQUEsQ0FBQSxJQUFBLENBQVIsTUFBQTtBQURGOztBQUVBLFVBQUcsTUFBQSxJQUFBLEdBQUEsSUFBaUIsQ0FBQSxHQUFBLEdBQUEsS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSxNQUFBLEVBQW9DLE1BQUEsR0FBUyxLQUFBLFFBQUEsQ0FBQSxJQUFBLENBQTdDLE1BQUEsQ0FBQSxNQUFBLEdBQWpCLElBQWlCLEdBQUEsS0FBQSxJQUFqQixJQUFpQixHQUFBLEtBQXBCLElBQUEsRUFBQTtBQ2dFRSxlRC9EQSxLQUFBLEdBQUEsR0FBTyxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUE0QixLQUE1QixHQUFBLEVBQUEsTUFBQSxDQytEUDtBQUNEO0FEdEVjO0FBaERaO0FBQUE7QUFBQSxnQ0F1RE07QUFDVCxVQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsTUFBQTs7QUFBQSxVQUFHLEtBQUEsUUFBQSxDQUFBLFVBQUEsSUFBQSxJQUFBLElBQTBCLEtBQUEsUUFBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLENBQUEsSUFBQSxLQUE3QixTQUFBLEVBQUE7QUFDRTtBQ29FRDs7QURuRUQsTUFBQSxFQUFBLEdBQUssS0FBQSxPQUFBLENBQUwsZUFBSyxFQUFMO0FBQ0EsTUFBQSxFQUFBLEdBQUssS0FBQSxPQUFBLENBQUwsZ0JBQUssRUFBTDtBQUNBLE1BQUEsTUFBQSxHQUFTLEtBQUEsU0FBQSxLQUFlLEVBQUUsQ0FBMUIsTUFBQTs7QUFDQSxVQUFHLEtBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQTRCLEtBQUEsR0FBQSxHQUFPLEVBQUUsQ0FBckMsTUFBQSxFQUE2QyxLQUE3QyxHQUFBLE1BQUEsRUFBQSxJQUE2RCxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUE0QixNQUFBLEdBQVMsRUFBRSxDQUF2QyxNQUFBLEVBQUEsTUFBQSxNQUFoRSxFQUFBLEVBQUE7QUFDRSxhQUFBLEdBQUEsR0FBTyxLQUFBLEdBQUEsR0FBTyxFQUFFLENBQWhCLE1BQUE7QUFDQSxhQUFBLEdBQUEsR0FBTyxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUE0QixLQUE1QixHQUFBLEVBQVAsTUFBTyxDQUFQO0FDcUVBLGVEcEVBLEtBQUEseUJBQUEsRUNvRUE7QUR2RUYsT0FBQSxNQUlLLElBQUcsS0FBQSxNQUFBLEdBQUEsZUFBQSxHQUFBLE9BQUEsQ0FBQSxFQUFBLElBQTBDLENBQTFDLENBQUEsSUFBaUQsS0FBQSxNQUFBLEdBQUEsZUFBQSxHQUFBLE9BQUEsQ0FBQSxFQUFBLElBQTBDLENBQTlGLENBQUEsRUFBQTtBQUNILGFBQUEsS0FBQSxHQUFBLENBQUE7QUNxRUEsZURwRUEsS0FBQSx5QkFBQSxFQ29FQTtBQUNEO0FEakZRO0FBdkROO0FBQUE7QUFBQSxnREFvRXNCO0FBQ3pCLFVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBOztBQUFBLFVBQUcsS0FBSCxPQUFBLEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBTSxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBMEIsS0FBQSxPQUFBLENBQWhDLGVBQWdDLEVBQTFCLENBQU47QUFDQSxRQUFBLEdBQUEsR0FBTSxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBMEIsS0FBQSxPQUFBLENBQWhDLGdCQUFnQyxFQUExQixDQUFOO0FBQ0EsUUFBQSxFQUFBLEdBQUssYUFBQSxDQUFBLFlBQUEsQ0FBQSxZQUFBLENBQTBCLEtBQUEsUUFBQSxDQUEvQixJQUFLLENBQUw7QUFDQSxRQUFBLEdBQUEsR0FBTSxJQUFBLE1BQUEsZ0JBQW1CLEdBQW5CLGdCQUE0QixFQUE1QiwrQkFBbUQsRUFBbkQsZUFBQSxHQUFBLFFBQU4sSUFBTSxDQUFOO0FBQ0EsUUFBQSxHQUFBLEdBQU0sSUFBQSxNQUFBLG1CQUFzQixFQUF0QixlQUFOLEdBQU0sV0FBTjtBQUNBLFFBQUEsR0FBQSxHQUFNLElBQUEsTUFBQSxpQkFBb0IsR0FBcEIsZ0JBQU4sRUFBTSxhQUFOO0FDeUVBLGVEeEVBLEtBQUEsT0FBQSxHQUFXLEtBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQUEsRUFBQSxDQ3dFWDtBQUNEO0FEakZ3QjtBQXBFdEI7QUFBQTtBQUFBLHFDQTZFVztBQUNkLFVBQUEsR0FBQTtBQzRFQSxhRDVFQSxLQUFBLE1BQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLFFBQUEsQ0FBQSxlQUFBLENBQUEsS0FBQSxTQUFBLEVBQUEsQ0FBQSxLQUFBLElBQUEsR0FBQSxHQUFpRCxDQUFqRCxJQUFBLEVBQUEsR0FBVSxLQUFBLENDNEVWO0FEN0VjO0FBN0VYO0FBQUE7QUFBQSxnQ0ErRVEsUUEvRVIsRUErRVE7QUMrRVgsYUQ5RUEsS0FBQSxRQUFBLEdBQVksUUM4RVo7QUQvRVc7QUEvRVI7QUFBQTtBQUFBLGlDQWlGTztBQUNWLFdBQUEsTUFBQTs7QUFDQSxXQUFBLFNBQUE7O0FBQ0EsV0FBQSxPQUFBLEdBQVcsS0FBQSx1QkFBQSxDQUF5QixLQUFwQyxPQUFXLENBQVg7QUFIRjtBQUFZO0FBakZQO0FBQUE7QUFBQSxrQ0FzRlE7QUNtRlgsYURsRkEsS0FBQSxZQUFBLENBQWMsS0FBZCxTQUFBLENDa0ZBO0FEbkZXO0FBdEZSO0FBQUE7QUFBQSxpQ0F3Rk87QUFDVixhQUFPLEtBQUEsT0FBQSxJQUFZLEtBQUEsUUFBQSxDQUFuQixPQUFBO0FBRFU7QUF4RlA7QUFBQTtBQUFBLDZCQTBGRztBQUNOLFVBQU8sS0FBQSxHQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsYUFBQSxjQUFBOztBQUNBLFlBQUcsS0FBQSxTQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsRUFBdUIsS0FBQSxRQUFBLENBQUEsYUFBQSxDQUF2QixNQUFBLE1BQTBELEtBQUEsUUFBQSxDQUE3RCxhQUFBLEVBQUE7QUFDRSxlQUFBLEdBQUEsR0FBTyxRQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLENBQVAsaUJBQU8sQ0FBUDtBQUNBLGVBQUEsT0FBQSxHQUFXLEtBQUEsUUFBQSxDQUFYLE9BQUE7QUFGRixTQUFBLE1BQUE7QUFJRSxlQUFBLE1BQUEsR0FBVSxLQUFBLFNBQUEsQ0FBVyxLQUFyQixPQUFVLENBQVY7QUFDQSxlQUFBLE9BQUEsR0FBVyxLQUFBLE1BQUEsQ0FBWCxPQUFBO0FBQ0EsZUFBQSxHQUFBLEdBQU8sS0FBQSxNQUFBLENBQVAsSUFBTyxFQUFQOztBQUNBLGNBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBc0IsS0FBQSxHQUFBLENBQXRCLFFBQUE7QUFSSjtBQUZGO0FDbUdDOztBRHhGRCxhQUFPLEtBQVAsR0FBQTtBQVpNO0FBMUZIO0FBQUE7QUFBQSw4QkF1R00sT0F2R04sRUF1R007QUFDVCxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxLQUFBLFFBQUEsQ0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLE9BQUEsRUFBb0M7QUFBQSxRQUFBLFVBQUEsRUFBVyxLQUFBLG9CQUFBO0FBQVgsT0FBcEMsQ0FBVDtBQUNBLE1BQUEsTUFBTSxDQUFOLFFBQUEsR0FBQSxJQUFBO0FBQ0EsYUFBQSxNQUFBO0FBSFM7QUF2R047QUFBQTtBQUFBLDJDQTJHaUI7QUFDcEIsVUFBQSxLQUFBLEVBQUEsR0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFBLEVBQUE7QUFDQSxNQUFBLEdBQUEsR0FBQSxJQUFBOztBQUNBLGFBQU0sR0FBQSxDQUFBLE1BQUEsSUFBTixJQUFBLEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBTSxHQUFHLENBQVQsTUFBQTs7QUFDQSxZQUFnQyxHQUFBLENBQUEsR0FBQSxJQUFBLElBQUEsSUFBYSxHQUFBLENBQUEsR0FBQSxDQUFBLFFBQUEsSUFBN0MsSUFBQSxFQUFBO0FBQUEsVUFBQSxLQUFLLENBQUwsSUFBQSxDQUFXLEdBQUcsQ0FBSCxHQUFBLENBQVgsUUFBQTtBQ21HQztBRHJHSDs7QUFHQSxhQUFBLEtBQUE7QUFOb0I7QUEzR2pCO0FBQUE7QUFBQSxtQ0FrSFcsR0FsSFgsRUFrSFc7QUFDZCxhQUFPLEdBQUcsQ0FBSCxTQUFBLENBQWMsS0FBQSxRQUFBLENBQUEsT0FBQSxDQUFkLE1BQUEsRUFBdUMsR0FBRyxDQUFILE1BQUEsR0FBVyxLQUFBLFFBQUEsQ0FBQSxPQUFBLENBQXpELE1BQU8sQ0FBUDtBQURjO0FBbEhYO0FBQUE7QUFBQSxpQ0FvSFMsT0FwSFQsRUFvSFM7QUFDWixVQUFBLE9BQUEsRUFBQSxJQUFBOztBQURZLGtDQUNNLGdCQUFBLENBQUEsZUFBQSxDQUFBLEtBQUEsQ0FBc0IsS0FBeEMsT0FBa0IsQ0FETjs7QUFBQTs7QUFDWixNQUFBLElBRFk7QUFDWixNQUFBLE9BRFk7QUFFWixhQUFPLE9BQU8sQ0FBUCxPQUFBLENBQUEsUUFBQSxFQUFQLE9BQU8sQ0FBUDtBQUZZO0FBcEhUO0FBQUE7QUFBQSw4QkF1SEk7QUFDUCxhQUFPLEtBQUEsR0FBQSxLQUFRLEtBQUEsUUFBQSxDQUFBLE9BQUEsR0FBb0IsS0FBQSxRQUFBLENBQXBCLFNBQUEsR0FBMEMsS0FBQSxRQUFBLENBQWxELE9BQUEsSUFBdUUsS0FBQSxHQUFBLEtBQVEsS0FBQSxRQUFBLENBQUEsT0FBQSxHQUFvQixLQUFBLFFBQUEsQ0FBMUcsT0FBQTtBQURPO0FBdkhKO0FBQUE7QUFBQSw4QkF5SEk7QUFBQTs7QUFDUCxVQUFBLFdBQUE7O0FBQUEsVUFBRyxLQUFILE9BQUcsRUFBSCxFQUFBO0FBQ0UsWUFBRyxLQUFBLFFBQUEsQ0FBQSxZQUFBLElBQUEsSUFBQSxJQUE0QixLQUFBLFFBQUEsQ0FBQSxZQUFBLENBQUEsaUJBQUEsQ0FBQSxLQUFBLEdBQUEsR0FBQSxLQUFBLFFBQUEsQ0FBQSxPQUFBLENBQUEsTUFBQSxLQUEvQixJQUFBLEVBQUE7QUMrR0UsaUJEOUdBLEtBQUEsUUFBQSxDQUFBLFlBQUEsQ0FBQSxNQUFBLEVDOEdBO0FEL0dGLFNBQUEsTUFBQTtBQ2lIRSxpQkQ5R0EsS0FBQSxXQUFBLENBQUEsRUFBQSxDQzhHQTtBRGxISjtBQUFBLE9BQUEsTUFLSyxJQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNILFlBQUcsV0FBQSxHQUFjLEtBQUEsU0FBQSxDQUFqQixlQUFpQixDQUFqQixFQUFBO0FBQ0UsVUFBQSxXQUFBLENBQUEsSUFBQSxDQUFBO0FDZ0hEOztBRC9HRCxZQUFHLEtBQUgsaUJBQUcsRUFBSCxFQUFBO0FDaUhFLGlCRGhIQSxDQUFBLEdBQUEsZ0JBQUEsQ0FBQSxlQUFBLEVBQWdCLEtBQWhCLE1BQWdCLEVBQWhCLEVBQUEsSUFBQSxDQUFpQyxVQUFBLEdBQUQsRUFBQTtBQUM5QixnQkFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FDaUhFLHFCRGhIQSxNQUFBLENBQUEsV0FBQSxDQUFBLEdBQUEsQ0NnSEE7QUFDRDtBRG5ISCxXQUFBLEVBQUEsTUFBQSxFQ2dIQTtBRGpIRixTQUFBLE1BQUE7QUFNSSxpQkFBTyxLQUFQLGVBQU8sRUFBUDtBQVREO0FDNEhKO0FEbElNO0FBekhKO0FBQUE7QUFBQSxnQ0F5SU07QUFDVCxhQUFPLEtBQUEsR0FBQSxHQUFLLEtBQUEsR0FBQSxDQUFaLE1BQUE7QUFEUztBQXpJTjtBQUFBO0FBQUEsNkJBMklHO0FBQ04sYUFBTyxJQUFJLElBQUEsQ0FBSixHQUFBLENBQVEsS0FBUixHQUFBLEVBQWEsS0FBQSxHQUFBLEdBQUssS0FBQSxHQUFBLENBQWxCLE1BQUEsRUFBQSxVQUFBLENBQTBDLEtBQUEsUUFBQSxDQUFqRCxNQUFPLENBQVA7QUFETTtBQTNJSDtBQUFBO0FBQUEsb0NBNklVO0FBQ2IsYUFBTyxJQUFJLElBQUEsQ0FBSixHQUFBLENBQVEsS0FBUixHQUFBLEVBQWEsS0FBQSxHQUFBLEdBQUssS0FBQSxPQUFBLENBQWxCLE1BQUEsRUFBQSxVQUFBLENBQThDLEtBQUEsUUFBQSxDQUFyRCxNQUFPLENBQVA7QUFEYTtBQTdJVjtBQUFBO0FBQUEsZ0NBK0lNO0FBQ1QsVUFBQSxNQUFBOztBQUFBLFVBQU8sS0FBQSxTQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsWUFBRyxLQUFBLEtBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLE1BQUEsR0FBUyxJQUFJLFVBQUEsQ0FBSixTQUFBLENBQWMsS0FBdkIsT0FBUyxDQUFUO0FBQ0EsZUFBQSxTQUFBLEdBQWEsTUFBTSxDQUFOLGFBQUEsQ0FBcUIsS0FBQSxNQUFBLEdBQXJCLGVBQXFCLEVBQXJCLEVBQWIsTUFBQTtBQUZGLFNBQUEsTUFBQTtBQUlFLGVBQUEsU0FBQSxHQUFhLEtBQUEsR0FBQSxHQUFPLEtBQUEsTUFBQSxHQUFwQixPQUFvQixFQUFwQjtBQUxKO0FDbUlDOztBRDdIRCxhQUFPLEtBQVAsU0FBQTtBQVBTO0FBL0lOO0FBQUE7QUFBQSw0Q0F1Sm9CLElBdkpwQixFQXVKb0I7QUFDdkIsVUFBQSxHQUFBOztBQUFBLFVBQUcsSUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLElBQUEsTUFBQSxDQUFXLFVBQVEsS0FBUixTQUFRLEVBQVIsR0FBWCxHQUFBLEVBQU4sSUFBTSxDQUFOO0FBQ0EsZUFBTyxJQUFJLENBQUosT0FBQSxDQUFBLEdBQUEsRUFBUCxFQUFPLENBQVA7QUFGRixPQUFBLE1BQUE7QUFJRSxlQUFBLElBQUE7QUNrSUQ7QUR2SXNCO0FBdkpwQjtBQUFBO0FBQUEsc0NBNkpjLElBN0pkLEVBNkpjO0FBQ2pCLFVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsR0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUksQ0FBZixJQUFXLEVBQVg7QUFDQSxNQUFBLE1BQUEsR0FBUyxJQUFJLFVBQUEsQ0FBSixTQUFBLENBQWMsS0FBdkIsT0FBUyxDQUFUO0FBQ0EsTUFBQSxNQUFNLENBQU4sY0FBQSxDQUFzQixRQUFRLENBQTlCLGlCQUFzQixFQUF0QixFQUFBLEtBQUE7O0FBQ0EsVUFBRyxLQUFBLFNBQUEsQ0FBSCxZQUFHLENBQUgsRUFBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBTixZQUFBLENBQU4sUUFBTSxDQUFOO0FBREYsbUJBRTJCLENBQUMsR0FBRyxDQUFKLEtBQUEsRUFBWSxHQUFHLENBQXhDLEdBQXlCLENBRjNCO0FBRUcsUUFBQSxJQUFJLENBQUwsS0FGRjtBQUVlLFFBQUEsSUFBSSxDQUFqQixHQUZGO0FBR0UsYUFBQSxTQUFBLEdBQWEsTUFBTSxDQUFuQixNQUFBO0FBQ0EsUUFBQSxJQUFJLENBQUosSUFBQSxHQUFZLEtBQUEsV0FBQSxDQUFhLElBQUksQ0FBN0IsSUFBWSxDQUFaO0FBSkYsT0FBQSxNQUFBO0FBTUUsUUFBQSxJQUFJLENBQUosSUFBQSxHQUFZLEtBQUEsV0FBQSxDQUFhLElBQUksQ0FBN0IsSUFBWSxDQUFaO0FBQ0EsUUFBQSxJQUFJLENBQUosS0FBQSxHQUFhLFFBQVEsQ0FBckIsT0FBYSxFQUFiO0FBQ0EsUUFBQSxJQUFJLENBQUosR0FBQSxHQUFXLFFBQVEsQ0FBbkIsT0FBVyxFQUFYO0FBQ0EsUUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFOLGFBQUEsQ0FBcUIsUUFBUSxDQUFSLGVBQUEsS0FBNkIsS0FBQSxRQUFBLENBQTdCLE1BQUEsR0FBZ0QsSUFBSSxDQUFwRCxJQUFBLEdBQTRELEtBQUEsUUFBQSxDQUE1RCxNQUFBLEdBQStFLFFBQVEsQ0FBNUcsZUFBb0csRUFBcEcsRUFBZ0k7QUFBQyxVQUFBLFNBQUEsRUFBVTtBQUFYLFNBQWhJLENBQU47O0FBVEYseUJBVXdDLEdBQUcsQ0FBSCxLQUFBLENBQVUsS0FBQSxRQUFBLENBQWhELE1BQXNDLENBVnhDOztBQUFBOztBQVVHLFFBQUEsSUFBSSxDQUFMLE1BVkY7QUFVZSxRQUFBLElBQUksQ0FBakIsSUFWRjtBQVV5QixRQUFBLElBQUksQ0FBM0IsTUFWRjtBQ2tKQzs7QUR2SUQsYUFBQSxJQUFBO0FBZmlCO0FBN0pkO0FBQUE7QUFBQSx3Q0E2S2dCLElBN0toQixFQTZLZ0I7QUFDbkIsVUFBQSxTQUFBLEVBQUEsQ0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLElBQUksQ0FBaEIsa0JBQVksRUFBWjs7QUFDQSxVQUFHLEtBQUEsR0FBQSxJQUFBLElBQUEsSUFBVSxLQUFBLFFBQUEsQ0FBVixXQUFBLElBQW9DLEtBQUEsU0FBQSxDQUF2QyxhQUF1QyxDQUF2QyxFQUFBO0FBQ0UsWUFBRyxDQUFBLENBQUEsR0FBQSxLQUFBLFFBQUEsQ0FBQSxZQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsU0FBQSxHQUFZLElBQUksQ0FBSixLQUFBLEdBQVcsSUFBSSxDQUFKLE1BQUEsQ0FBWCxNQUFBLEdBQVosQ0FBQTtBQzRJRDs7QUQzSUQsUUFBQSxJQUFJLENBQUosSUFBQSxHQUFZLEtBQUEsUUFBQSxDQUFBLFlBQUEsQ0FBdUIsSUFBSSxDQUF2QyxJQUFZLENBQVo7QUM2SUQ7O0FENUlELGFBQUEsU0FBQTtBQU5tQjtBQTdLaEI7QUFBQTtBQUFBLCtCQW9MTyxJQXBMUCxFQW9MTztBQUNWLFVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLFdBQUEsRUFBQSxZQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxZQUFBOztBQUFBLFVBQUcsS0FBQSxRQUFBLElBQUEsSUFBQSxJQUFlLEtBQUEsUUFBQSxDQUFBLE1BQUEsR0FBbEIsQ0FBQSxFQUFBO0FBQ0UsUUFBQSxZQUFBLEdBQWUsQ0FBZixJQUFlLENBQWY7QUFDQSxRQUFBLFlBQUEsR0FBZSxJQUFJLENBQW5CLFlBQWUsRUFBZjtBQUNBLFFBQUEsR0FBQSxHQUFBLEtBQUEsUUFBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBO0FDa0pFLFVBQUEsR0FBRyxHQUFHLEdBQUcsQ0FBVCxDQUFTLENBQVQ7O0FEakpBLGNBQUcsQ0FBQSxLQUFILENBQUEsRUFBQTtBQUNFLFlBQUEsV0FBQSxHQUFjLEdBQUcsQ0FBakIsS0FBQTtBQURGLFdBQUEsTUFBQTtBQUdFLFlBQUEsT0FBQSxHQUFVLElBQUksQ0FBSixJQUFBLEdBQUEsV0FBQSxDQUF3QixHQUFHLENBQUgsS0FBQSxHQUFsQyxXQUFVLENBQVY7O0FBQ0EsZ0JBQUcsT0FBTyxDQUFQLFlBQUEsT0FBSCxZQUFBLEVBQUE7QUFDRSxjQUFBLFlBQVksQ0FBWixJQUFBLENBQUEsT0FBQTtBQUxKO0FDeUpDO0FEMUpIOztBQU9BLGVBQUEsWUFBQTtBQVZGLE9BQUEsTUFBQTtBQVlFLGVBQU8sQ0FBUCxJQUFPLENBQVA7QUNzSkQ7QURuS1M7QUFwTFA7QUFBQTtBQUFBLGdDQWtNUSxJQWxNUixFQWtNUTtBQ3lKWCxhRHhKQSxLQUFBLGdCQUFBLENBQWtCLElBQUksWUFBQSxDQUFKLFdBQUEsQ0FBZ0IsS0FBaEIsR0FBQSxFQUFxQixLQUFyQixTQUFxQixFQUFyQixFQUFsQixJQUFrQixDQUFsQixDQ3dKQTtBRHpKVztBQWxNUjtBQUFBO0FBQUEscUNBb01hLElBcE1iLEVBb01hO0FBQ2hCLFVBQUEsU0FBQSxFQUFBLFlBQUE7QUFBQSxNQUFBLElBQUksQ0FBSixVQUFBLENBQWdCLEtBQUEsUUFBQSxDQUFoQixNQUFBOztBQUNBLFVBQUcsS0FBQSxLQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsYUFBQSxpQkFBQSxDQUFBLElBQUE7QUFERixPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUksQ0FBSixJQUFBLEdBQVksS0FBQSxXQUFBLENBQWEsSUFBSSxDQUE3QixJQUFZLENBQVo7QUM0SkQ7O0FEM0pELE1BQUEsU0FBQSxHQUFZLEtBQUEsbUJBQUEsQ0FBWixJQUFZLENBQVo7QUFDQSxNQUFBLElBQUksQ0FBSixVQUFBLEdBQWtCLENBQUMsSUFBSSxJQUFBLENBQUosR0FBQSxDQUFBLFNBQUEsRUFBbkIsU0FBbUIsQ0FBRCxDQUFsQjtBQUNBLE1BQUEsWUFBQSxHQUFlLEtBQUEsVUFBQSxDQUFmLElBQWUsQ0FBZjtBQUNBLFdBQUEsWUFBQSxHQUFnQixJQUFJLENBQXBCLEtBQUE7QUFDQSxXQUFBLFVBQUEsR0FBYyxJQUFJLENBQWxCLE1BQWMsRUFBZDtBQzZKQSxhRDVKQSxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsaUJBQUEsQ0FBQSxZQUFBLENDNEpBO0FEdktnQjtBQXBNYjs7QUFBQTtBQUFBLEVBQW9DLFlBQUEsQ0FBcEMsV0FBQSxDQUFQOzs7Ozs7Ozs7Ozs7OztBRVhBLElBQWEsT0FBTixHQUNMLG1CQUFhO0FBQUE7QUFBQSxDQURmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLENBQUEsVUFBQSxDQUFBOztBQUVBLElBQWEsT0FBTjtBQUFBO0FBQUE7QUFDTCxtQkFBYSxNQUFiLEVBQWE7QUFBQTs7QUFBQyxTQUFBLE1BQUEsR0FBQSxNQUFBO0FBQUQ7O0FBRFI7QUFBQTtBQUFBLHlCQUdDLEdBSEQsRUFHQyxHQUhELEVBR0M7QUFDSixVQUFHLEtBQUgsZUFBRyxFQUFILEVBQUE7QUNJRSxlREhBLEtBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLEVBQUEsR0FBQSxDQ0dBO0FBQ0Q7QURORztBQUhEO0FBQUE7QUFBQSwrQkFPTyxJQVBQLEVBT08sR0FQUCxFQU9PLEdBUFAsRUFPTztBQUNWLFVBQUcsS0FBSCxlQUFHLEVBQUgsRUFBQTtBQ01FLGVETEEsS0FBQSxNQUFBLENBQUEsVUFBQSxDQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxDQ0tBO0FBQ0Q7QURSUztBQVBQO0FBQUE7QUFBQSx5QkFXQyxHQVhELEVBV0M7QUFDSixVQUFHLEtBQUEsTUFBQSxJQUFILElBQUEsRUFBQTtBQ1FFLGVEUEEsS0FBQSxNQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0NPQTtBQUNEO0FEVkc7QUFYRDtBQUFBO0FBQUEsc0NBZVk7QUFDZixVQUFHLEtBQUEsTUFBQSxJQUFILElBQUEsRUFBQTtBQ1VFLGVEVEEsSUNTQTtBRFZGLE9BQUEsTUFBQTtBQUdFLGFBQUEsTUFBQSxHQUFVLEtBQUEsTUFBQSxJQUFXLElBQUksT0FBQSxDQUF6QixNQUFxQixFQUFyQjtBQUNBLGFBQUEsTUFBQSxDQUFBLEdBQUEsQ0FBQSw2QkFBQTtBQ1VBLGVEVEEsS0NTQTtBQUNEO0FEaEJjO0FBZlo7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFSEEsSUFBQSxXQUFBLEdBQUEsT0FBQSxDQUFBLGNBQUEsQ0FBQTs7QUFDQSxJQUFBLElBQUEsR0FBQSxPQUFBLENBQUEsbUJBQUEsQ0FBQTs7QUFEQSxJQUFBLFNBQUE7O0FBR0EsSUFBYSxjQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsbUNBQ1csTUFEWCxFQUNXO0FBQUE7O0FBRWQsVUFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQUEsSUFBQTs7QUFFQSxNQUFBLFNBQUEsR0FBYSxtQkFBQSxDQUFELEVBQUE7QUFDVixZQUFHLENBQUMsUUFBUSxDQUFSLFNBQUEsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxJQUFpQyxLQUFBLENBQUEsR0FBQSxLQUFRLFFBQVEsQ0FBbEQsYUFBQSxLQUFzRSxDQUFDLENBQUQsT0FBQSxLQUF0RSxFQUFBLElBQXlGLENBQUMsQ0FBN0YsT0FBQSxFQUFBO0FBQ0UsVUFBQSxDQUFDLENBQUQsY0FBQTs7QUFDQSxjQUFHLEtBQUEsQ0FBQSxlQUFBLElBQUgsSUFBQSxFQUFBO0FDT0UsbUJETkEsS0FBQSxDQUFBLGVBQUEsRUNNQTtBRFRKO0FDV0M7QURaSCxPQUFBOztBQUtBLE1BQUEsT0FBQSxHQUFXLGlCQUFBLENBQUQsRUFBQTtBQUNSLFlBQUcsS0FBQSxDQUFBLFdBQUEsSUFBSCxJQUFBLEVBQUE7QUNVRSxpQkRUQSxLQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsQ0NTQTtBQUNEO0FEWkgsT0FBQTs7QUFHQSxNQUFBLFVBQUEsR0FBYyxvQkFBQSxDQUFELEVBQUE7QUFDWCxZQUF5QixPQUFBLElBQXpCLElBQUEsRUFBQTtBQUFBLFVBQUEsWUFBQSxDQUFBLE9BQUEsQ0FBQTtBQ2FDOztBQUNELGVEYkEsT0FBQSxHQUFVLFVBQUEsQ0FBWSxZQUFBO0FBQ3BCLGNBQUcsS0FBQSxDQUFBLFdBQUEsSUFBSCxJQUFBLEVBQUE7QUNjRSxtQkRiQSxLQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsQ0NhQTtBQUNEO0FEaEJPLFNBQUEsRUFBQSxHQUFBLENDYVY7QURmRixPQUFBOztBQU9BLFVBQUcsTUFBTSxDQUFULGdCQUFBLEVBQUE7QUFDSSxRQUFBLE1BQU0sQ0FBTixnQkFBQSxDQUFBLFNBQUEsRUFBQSxTQUFBO0FBQ0EsUUFBQSxNQUFNLENBQU4sZ0JBQUEsQ0FBQSxPQUFBLEVBQUEsT0FBQTtBQ2VGLGVEZEUsTUFBTSxDQUFOLGdCQUFBLENBQUEsVUFBQSxFQUFBLFVBQUEsQ0NjRjtBRGpCRixPQUFBLE1BSUssSUFBRyxNQUFNLENBQVQsV0FBQSxFQUFBO0FBQ0QsUUFBQSxNQUFNLENBQU4sV0FBQSxDQUFBLFdBQUEsRUFBQSxTQUFBO0FBQ0EsUUFBQSxNQUFNLENBQU4sV0FBQSxDQUFBLFNBQUEsRUFBQSxPQUFBO0FDZUYsZURkRSxNQUFNLENBQU4sV0FBQSxDQUFBLFlBQUEsRUFBQSxVQUFBLENDY0Y7QUFDRDtBRHpDYTtBQURYOztBQUFBO0FBQUEsR0FBUDs7OztBQTZCQSxTQUFBLEdBQVksbUJBQUEsR0FBQSxFQUFBO0FBQ1YsTUFBQSxDQUFBOztBQUFBLE1BQUE7QUNvQkU7QUFDQSxXRG5CQSxHQUFBLFlBQWUsV0NtQmY7QURyQkYsR0FBQSxDQUFBLE9BQUEsS0FBQSxFQUFBO0FBR00sSUFBQSxDQUFBLEdBSE4sS0FHTSxDQUhOLENDd0JFO0FBQ0E7QUFDQTs7QURuQkEsV0FBUSxRQUFBLEdBQUEsTUFBRCxRQUFDLElBQ0wsR0FBRyxDQUFILFFBQUEsS0FESSxDQUFDLElBQ2dCLFFBQU8sR0FBRyxDQUFWLEtBQUEsTUFEakIsUUFBQyxJQUVMLFFBQU8sR0FBRyxDQUFWLGFBQUEsTUFGSCxRQUFBO0FDcUJEO0FEN0JILENBQUE7O0FBYUEsSUFBYSxjQUFBLEdBQUEsWUFBQTtBQUFBLE1BQU4sY0FBTTtBQUFBO0FBQUE7QUFBQTs7QUFDWCw0QkFBYSxPQUFiLEVBQWE7QUFBQTs7QUFBQTs7QUNxQlQ7QURyQlUsYUFBQSxNQUFBLEdBQUEsT0FBQTtBQUVaLGFBQUEsR0FBQSxHQUFVLFNBQUEsQ0FBVSxPQUFWLE1BQUEsQ0FBQSxHQUF3QixPQUF4QixNQUFBLEdBQXFDLFFBQVEsQ0FBUixjQUFBLENBQXdCLE9BQXZFLE1BQStDLENBQS9DOztBQUNBLFVBQU8sT0FBQSxHQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsY0FBQSxvQkFBQTtBQ3NCQzs7QURyQkgsYUFBQSxTQUFBLEdBQUEsVUFBQTtBQUNBLGFBQUEsZUFBQSxHQUFBLEVBQUE7QUFDQSxhQUFBLGdCQUFBLEdBQUEsQ0FBQTtBQVBXO0FBQUE7O0FBREY7QUFBQTtBQUFBLGtDQVVFLENBVkYsRUFVRTtBQUNYLFlBQUEsUUFBQSxFQUFBLENBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUE7O0FBQUEsWUFBRyxLQUFBLGdCQUFBLElBQUgsQ0FBQSxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQUEsS0FBQSxlQUFBO0FBQUEsVUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxlQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsSUFBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQzJCSSxZQUFBLFFBQVEsR0FBRyxHQUFHLENBQWQsQ0FBYyxDQUFkO0FBQ0EsWUFBQSxPQUFPLENBQVAsSUFBQSxDRDNCRixRQUFBLEVDMkJFO0FENUJKOztBQzhCRSxpQkFBQSxPQUFBO0FEL0JKLFNBQUEsTUFBQTtBQUlFLGVBQUEsZ0JBQUE7O0FBQ0EsY0FBcUIsS0FBQSxjQUFBLElBQXJCLElBQUEsRUFBQTtBQzhCSSxtQkQ5QkosS0FBQSxjQUFBLEVDOEJJO0FEbkNOO0FDcUNHO0FEdENRO0FBVkY7QUFBQTtBQUFBLHdDQWlCTTtBQUFBLFlBQUMsRUFBRCx1RUFBQSxDQUFBO0FDbUNiLGVEbENGLEtBQUEsZ0JBQUEsSUFBcUIsRUNrQ25CO0FEbkNhO0FBakJOO0FBQUE7QUFBQSwrQkFtQkQsUUFuQkMsRUFtQkQ7QUFDUixhQUFBLGVBQUEsR0FBbUIsWUFBQTtBQ3FDZixpQkRyQ2tCLFFBQVEsQ0FBUixlQUFBLEVDcUNsQjtBRHJDSixTQUFBOztBQ3VDRSxlRHRDRixLQUFBLGNBQUEsQ0FBQSxRQUFBLENDc0NFO0FEeENNO0FBbkJDO0FBQUE7QUFBQSw0Q0FzQlU7QUN5Q2pCLGVEeENGLG9CQUFvQixLQUFDLEdDd0NuQjtBRHpDaUI7QUF0QlY7QUFBQTtBQUFBLGlDQXdCRDtBQzJDTixlRDFDRixRQUFRLENBQVIsYUFBQSxLQUEwQixLQUFDLEdDMEN6QjtBRDNDTTtBQXhCQztBQUFBO0FBQUEsMkJBMEJMLEdBMUJLLEVBMEJMO0FBQ0osWUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsY0FBQSxDQUFPLEtBQUEsZUFBQSxDQUFQLEdBQU8sQ0FBUCxFQUFBO0FBQ0UsaUJBQUEsR0FBQSxDQUFBLEtBQUEsR0FBQSxHQUFBO0FBRko7QUNnREc7O0FBQ0QsZUQ5Q0YsS0FBQSxHQUFBLENBQUssS0M4Q0g7QURsREU7QUExQks7QUFBQTtBQUFBLGlDQStCQyxLQS9CRCxFQStCQyxHQS9CRCxFQStCQyxJQS9CRCxFQStCQztBQ2lEUixlRGhERixLQUFBLGVBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUEsS0FBc0MsS0FBQSx5QkFBQSxDQUFBLElBQUEsRUFBQSxLQUFBLEVBRHhDLEdBQ3dDLENBQXRDLG1GQUFBLEtBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxDQ2dERTtBRGpEUTtBQS9CRDtBQUFBO0FBQUEsc0NBaUNNLElBakNOLEVBaUNNO0FBQUEsWUFBTyxLQUFQLHVFQUFBLENBQUE7QUFBQSxZQUFrQixHQUFsQix1RUFBQSxJQUFBO0FBQ2YsWUFBQSxLQUFBOztBQUFBLFlBQTZDLFFBQUEsQ0FBQSxXQUFBLElBQTdDLElBQUEsRUFBQTtBQUFBLFVBQUEsS0FBQSxHQUFRLFFBQVEsQ0FBUixXQUFBLENBQVIsV0FBUSxDQUFSO0FDcURHOztBRHBESCxZQUFHLEtBQUEsSUFBQSxJQUFBLElBQVcsS0FBQSxDQUFBLGFBQUEsSUFBWCxJQUFBLElBQW9DLEtBQUssQ0FBTCxTQUFBLEtBQXZDLEtBQUEsRUFBQTtBQUNFLGNBQXdCLEdBQUEsSUFBeEIsSUFBQSxFQUFBO0FBQUEsWUFBQSxHQUFBLEdBQU0sS0FBTixPQUFNLEVBQU47QUN1REc7O0FEdERILGNBQUcsSUFBSSxDQUFKLE1BQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxnQkFBRyxLQUFBLEtBQUgsQ0FBQSxFQUFBO0FBQ0UsY0FBQSxJQUFBLEdBQU8sS0FBQSxVQUFBLENBQVksS0FBQSxHQUFaLENBQUEsRUFBUCxLQUFPLENBQVA7QUFDQSxjQUFBLEtBQUE7QUFGRixhQUFBLE1BR0ssSUFBRyxHQUFBLEtBQU8sS0FBVixPQUFVLEVBQVYsRUFBQTtBQUNILGNBQUEsSUFBQSxHQUFPLEtBQUEsVUFBQSxDQUFBLEdBQUEsRUFBZ0IsR0FBQSxHQUF2QixDQUFPLENBQVA7QUFDQSxjQUFBLEdBQUE7QUFGRyxhQUFBLE1BQUE7QUFJSCxxQkFBQSxLQUFBO0FBUko7QUNpRUc7O0FEeERILFVBQUEsS0FBSyxDQUFMLGFBQUEsQ0FBQSxXQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQVhGLENBV0UsRUFYRixDQ3FFSTs7QUR4REYsZUFBQSxHQUFBLENBQUEsY0FBQSxHQUFBLEtBQUE7QUFDQSxlQUFBLEdBQUEsQ0FBQSxZQUFBLEdBQUEsR0FBQTtBQUNBLGVBQUEsR0FBQSxDQUFBLGFBQUEsQ0FBQSxLQUFBO0FBQ0EsZUFBQSxlQUFBO0FDMERFLGlCRHpERixJQ3lERTtBRDFFSixTQUFBLE1BQUE7QUM0RUksaUJEekRGLEtDeURFO0FBQ0Q7QUQvRVk7QUFqQ047QUFBQTtBQUFBLGdEQXVEZ0IsSUF2RGhCLEVBdURnQjtBQUFBLFlBQU8sS0FBUCx1RUFBQSxDQUFBO0FBQUEsWUFBa0IsR0FBbEIsdUVBQUEsSUFBQTs7QUFDekIsWUFBRyxRQUFBLENBQUEsV0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGNBQXdCLEdBQUEsSUFBeEIsSUFBQSxFQUFBO0FBQUEsWUFBQSxHQUFBLEdBQU0sS0FBTixPQUFNLEVBQU47QUM4REc7O0FEN0RILGVBQUEsR0FBQSxDQUFBLGNBQUEsR0FBQSxLQUFBO0FBQ0EsZUFBQSxHQUFBLENBQUEsWUFBQSxHQUFBLEdBQUE7QUMrREUsaUJEOURGLFFBQVEsQ0FBUixXQUFBLENBQUEsWUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLENDOERFO0FEbEVKLFNBQUEsTUFBQTtBQ29FSSxpQkQ5REYsS0M4REU7QUFDRDtBRHRFc0I7QUF2RGhCO0FBQUE7QUFBQSxxQ0FnRUc7QUFDWixZQUF3QixLQUFBLFlBQUEsSUFBeEIsSUFBQSxFQUFBO0FBQUEsaUJBQU8sS0FBUCxZQUFBO0FDa0VHOztBRGpFSCxZQUFHLEtBQUgsUUFBQSxFQUFBO0FBQ0UsY0FBRyxLQUFILG1CQUFBLEVBQUE7QUNtRUksbUJEbEVGLElBQUksSUFBQSxDQUFKLEdBQUEsQ0FBUSxLQUFBLEdBQUEsQ0FBUixjQUFBLEVBQTRCLEtBQUEsR0FBQSxDQUE1QixZQUFBLENDa0VFO0FEbkVKLFdBQUEsTUFBQTtBQ3FFSSxtQkRsRUYsS0FBQSxvQkFBQSxFQ2tFRTtBRHRFTjtBQ3dFRztBRDFFUztBQWhFSDtBQUFBO0FBQUEsNkNBdUVXO0FBQ3BCLFlBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTs7QUFBQSxZQUFHLEtBQUEsR0FBQSxDQUFILGVBQUEsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFNLFFBQVEsQ0FBUixTQUFBLENBQU4sV0FBTSxFQUFOOztBQUNBLGNBQUcsR0FBRyxDQUFILGFBQUEsT0FBdUIsS0FBMUIsR0FBQSxFQUFBO0FBQ0UsWUFBQSxHQUFBLEdBQU0sS0FBQSxHQUFBLENBQU4sZUFBTSxFQUFOO0FBQ0EsWUFBQSxHQUFHLENBQUgsY0FBQSxDQUFtQixHQUFHLENBQXRCLFdBQW1CLEVBQW5CO0FBQ0EsWUFBQSxHQUFBLEdBQUEsQ0FBQTs7QUFFQSxtQkFBTSxHQUFHLENBQUgsZ0JBQUEsQ0FBQSxZQUFBLEVBQUEsR0FBQSxJQUFOLENBQUEsRUFBQTtBQUNFLGNBQUEsR0FBQTtBQUNBLGNBQUEsR0FBRyxDQUFILE9BQUEsQ0FBQSxXQUFBLEVBQXlCLENBQXpCLENBQUE7QUFGRjs7QUFHQSxZQUFBLEdBQUcsQ0FBSCxXQUFBLENBQUEsY0FBQSxFQUFnQyxLQUFBLEdBQUEsQ0FBaEMsZUFBZ0MsRUFBaEM7QUFDQSxZQUFBLEdBQUEsR0FBTSxJQUFJLElBQUEsQ0FBSixHQUFBLENBQUEsQ0FBQSxFQUFOLEdBQU0sQ0FBTjs7QUFDQSxtQkFBTSxHQUFHLENBQUgsZ0JBQUEsQ0FBQSxZQUFBLEVBQUEsR0FBQSxJQUFOLENBQUEsRUFBQTtBQUNFLGNBQUEsR0FBRyxDQUFILEtBQUE7QUFDQSxjQUFBLEdBQUcsQ0FBSCxHQUFBO0FBQ0EsY0FBQSxHQUFHLENBQUgsT0FBQSxDQUFBLFdBQUEsRUFBeUIsQ0FBekIsQ0FBQTtBQUhGOztBQUlBLG1CQUFBLEdBQUE7QUFoQko7QUMwRkc7QUQzRmlCO0FBdkVYO0FBQUE7QUFBQSxtQ0F5RkcsS0F6RkgsRUF5RkcsR0F6RkgsRUF5Rkc7QUFBQTs7QUFDWixZQUFlLFNBQVMsQ0FBVCxNQUFBLEdBQWYsQ0FBQSxFQUFBO0FBQUEsVUFBQSxHQUFBLEdBQUEsS0FBQTtBQzhFRzs7QUQ3RUgsWUFBRyxLQUFILG1CQUFBLEVBQUE7QUFDRSxlQUFBLFlBQUEsR0FBZ0IsSUFBSSxJQUFBLENBQUosR0FBQSxDQUFBLEtBQUEsRUFBaEIsR0FBZ0IsQ0FBaEI7QUFDQSxlQUFBLEdBQUEsQ0FBQSxjQUFBLEdBQUEsS0FBQTtBQUNBLGVBQUEsR0FBQSxDQUFBLFlBQUEsR0FBQSxHQUFBO0FBQ0EsVUFBQSxVQUFBLENBQVksWUFBQTtBQUNWLFlBQUEsTUFBQSxDQUFBLFlBQUEsR0FBQSxJQUFBO0FBQ0EsWUFBQSxNQUFBLENBQUEsR0FBQSxDQUFBLGNBQUEsR0FBQSxLQUFBO0FDK0VFLG1CRDlFRixNQUFBLENBQUEsR0FBQSxDQUFBLFlBQUEsR0FBb0IsR0M4RWxCO0FEakZKLFdBQUEsRUFBQSxDQUFBLENBQUE7QUFKRixTQUFBLE1BQUE7QUFVRSxlQUFBLG9CQUFBLENBQUEsS0FBQSxFQUFBLEdBQUE7QUMrRUM7QUQzRlM7QUF6Rkg7QUFBQTtBQUFBLDJDQXVHVyxLQXZHWCxFQXVHVyxHQXZHWCxFQXVHVztBQUNwQixZQUFBLEdBQUE7O0FBQUEsWUFBRyxLQUFBLEdBQUEsQ0FBSCxlQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxLQUFBLEdBQUEsQ0FBTixlQUFNLEVBQU47QUFDQSxVQUFBLEdBQUcsQ0FBSCxTQUFBLENBQUEsV0FBQSxFQUFBLEtBQUE7QUFDQSxVQUFBLEdBQUcsQ0FBSCxRQUFBO0FBQ0EsVUFBQSxHQUFHLENBQUgsT0FBQSxDQUFBLFdBQUEsRUFBeUIsR0FBQSxHQUF6QixLQUFBO0FDa0ZFLGlCRGpGRixHQUFHLENBQUgsTUFBQSxFQ2lGRTtBQUNEO0FEeEZpQjtBQXZHWDtBQUFBO0FBQUEsZ0NBOEdGO0FBQ1AsWUFBaUIsS0FBakIsS0FBQSxFQUFBO0FBQUEsaUJBQU8sS0FBUCxLQUFBO0FDc0ZHOztBRHJGSCxZQUFrQyxLQUFBLEdBQUEsQ0FBQSxZQUFBLENBQWxDLFdBQWtDLENBQWxDLEVBQUE7QUN1RkksaUJEdkZKLEtBQUEsR0FBQSxDQUFBLFlBQUEsQ0FBQSxXQUFBLENDdUZJO0FBQ0Q7QUQxRkk7QUE5R0U7QUFBQTtBQUFBLDhCQWlIRixHQWpIRSxFQWlIRjtBQUNQLGFBQUEsS0FBQSxHQUFBLEdBQUE7QUMyRkUsZUQxRkYsS0FBQSxHQUFBLENBQUEsWUFBQSxDQUFBLFdBQUEsRUFBQSxHQUFBLENDMEZFO0FENUZLO0FBakhFO0FBQUE7QUFBQSwwQ0FvSFE7QUFDakIsZUFBQSxJQUFBO0FBRGlCO0FBcEhSO0FBQUE7QUFBQSx3Q0FzSFEsUUF0SFIsRUFzSFE7QUMrRmYsZUQ5RkYsS0FBQSxlQUFBLENBQUEsSUFBQSxDQUFBLFFBQUEsQ0M4RkU7QUQvRmU7QUF0SFI7QUFBQTtBQUFBLDJDQXdIVyxRQXhIWCxFQXdIVztBQUNwQixZQUFBLENBQUE7O0FBQUEsWUFBRyxDQUFDLENBQUEsR0FBSSxLQUFBLGVBQUEsQ0FBQSxPQUFBLENBQUwsUUFBSyxDQUFMLElBQTJDLENBQTlDLENBQUEsRUFBQTtBQ2tHSSxpQkRqR0YsS0FBQSxlQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLENDaUdFO0FBQ0Q7QURwR2lCO0FBeEhYO0FBQUE7QUFBQSx3Q0E2SFEsWUE3SFIsRUE2SFE7QUFDakIsWUFBRyxZQUFZLENBQVosTUFBQSxHQUFBLENBQUEsSUFBNEIsWUFBYSxDQUFiLENBQWEsQ0FBYixDQUFBLFVBQUEsQ0FBQSxNQUFBLEdBQS9CLENBQUEsRUFBQTtBQUNFLFVBQUEsWUFBYSxDQUFiLENBQWEsQ0FBYixDQUFBLFVBQUEsR0FBNkIsQ0FBQyxLQUE5QixZQUE4QixFQUFELENBQTdCO0FDbUdDOztBRHJHTCxxR0FHUSxZQUhSO0FBQW1CO0FBN0hSOztBQUFBO0FBQUEsSUFBdUIsV0FBQSxDQUE3QixVQUFNOztBQUFOO0FDd09MLEVBQUEsY0FBYyxDQUFkLFNBQUEsQ0QvTkEsY0MrTkEsR0QvTmdCLGNBQWMsQ0FBZCxTQUFBLENBQXlCLGNDK056QztBQUVBLFNBQUEsY0FBQTtBRDFPVyxDQUFBLENBQUEsSUFBQSxDQUFBLEtBQWIsQ0FBYSxDQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUU3Q0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBQTs7QUFDQSxJQUFBLElBQUEsR0FBQSxPQUFBLENBQUEsbUJBQUEsQ0FBQTs7QUFFQSxJQUFhLFVBQU47QUFBQTtBQUFBO0FBQUE7O0FBQ0wsc0JBQWEsS0FBYixFQUFhO0FBQUE7O0FBQUE7O0FDTVg7QUROWSxVQUFBLEtBQUEsR0FBQSxLQUFBO0FBQUQ7QUFBQTs7QUFEUjtBQUFBO0FBQUEseUJBR0MsR0FIRCxFQUdDO0FBQ0osVUFBZ0IsR0FBQSxJQUFoQixJQUFBLEVBQUE7QUFBQSxhQUFBLEtBQUEsR0FBQSxHQUFBO0FDVUM7O0FBQ0QsYURWQSxLQUFDLEtDVUQ7QURaSTtBQUhEO0FBQUE7QUFBQSwrQkFNTyxHQU5QLEVBTU87QUFDVixhQUFPLEtBQUEsSUFBQSxHQUFQLEdBQU8sQ0FBUDtBQURVO0FBTlA7QUFBQTtBQUFBLDRCQVFJLEdBUkosRUFRSTtBQUNQLGFBQU8sS0FBQSxJQUFBLEdBQVAsTUFBQTtBQURPO0FBUko7QUFBQTtBQUFBLCtCQVVPLEtBVlAsRUFVTyxHQVZQLEVBVU87QUFDVixhQUFPLEtBQUEsSUFBQSxHQUFBLFNBQUEsQ0FBQSxLQUFBLEVBQVAsR0FBTyxDQUFQO0FBRFU7QUFWUDtBQUFBO0FBQUEsaUNBWVMsSUFaVCxFQVlTLEdBWlQsRUFZUztBQ21CWixhRGxCQSxLQUFBLElBQUEsQ0FBTSxLQUFBLElBQUEsR0FBQSxTQUFBLENBQUEsQ0FBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLEdBQStCLEtBQUEsSUFBQSxHQUFBLFNBQUEsQ0FBQSxHQUFBLEVBQXNCLEtBQUEsSUFBQSxHQUEzRCxNQUFxQyxDQUFyQyxDQ2tCQTtBRG5CWTtBQVpUO0FBQUE7QUFBQSwrQkFjTyxLQWRQLEVBY08sR0FkUCxFQWNPLElBZFAsRUFjTztBQ3FCVixhRHBCQSxLQUFBLElBQUEsQ0FBTSxLQUFBLElBQUEsR0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsS0FBMkIsSUFBQSxJQUEzQixFQUFBLElBQXlDLEtBQUEsSUFBQSxHQUFBLEtBQUEsQ0FBL0MsR0FBK0MsQ0FBL0MsQ0NvQkE7QURyQlU7QUFkUDtBQUFBO0FBQUEsbUNBZ0JTO0FBQ1osYUFBTyxLQUFQLE1BQUE7QUFEWTtBQWhCVDtBQUFBO0FBQUEsaUNBa0JTLEtBbEJULEVBa0JTLEdBbEJULEVBa0JTO0FBQ1osVUFBZSxTQUFTLENBQVQsTUFBQSxHQUFmLENBQUEsRUFBQTtBQUFBLFFBQUEsR0FBQSxHQUFBLEtBQUE7QUMwQkM7O0FBQ0QsYUQxQkEsS0FBQSxNQUFBLEdBQVUsSUFBSSxJQUFBLENBQUosR0FBQSxDQUFBLEtBQUEsRUFBQSxHQUFBLENDMEJWO0FENUJZO0FBbEJUOztBQUFBO0FBQUEsRUFBeUIsT0FBQSxDQUF6QixNQUFBLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFSEEsSUFBQSxTQUFBLEdBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQTs7QUFDQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsV0FBQSxDQUFBOztBQUNBLElBQUEsb0JBQUEsR0FBQSxPQUFBLENBQUEsNEJBQUEsQ0FBQTs7QUFDQSxJQUFBLGtCQUFBLEdBQUEsT0FBQSxDQUFBLDBCQUFBLENBQUE7O0FBQ0EsSUFBQSxtQkFBQSxHQUFBLE9BQUEsQ0FBQSwyQkFBQSxDQUFBOztBQUNBLElBQUEsb0JBQUEsR0FBQSxPQUFBLENBQUEsNEJBQUEsQ0FBQTs7QUFDQSxJQUFBLG9CQUFBLEdBQUEsT0FBQSxDQUFBLDRCQUFBLENBQUE7O0FBQ0EsSUFBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUE7O0FBQ0EsSUFBQSxXQUFBLEdBQUEsT0FBQSxDQUFBLDBCQUFBLENBQUE7O0FBQ0EsSUFBQSxtQkFBQSxHQUFBLE9BQUEsQ0FBQSxxQ0FBQSxDQUFBOztBQUVBLElBQUEsQ0FBQSxHQUFBLENBQUEsU0FBQSxHQUFnQixXQUFBLENBQWhCLFVBQUE7QUFFQSxTQUFBLENBQUEsUUFBQSxDQUFBLFNBQUEsR0FBQSxFQUFBO0FBRUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLEdBQW9CLENBQ2xCLElBQUksb0JBQUEsQ0FEYyxtQkFDbEIsRUFEa0IsRUFFbEIsSUFBSSxrQkFBQSxDQUZjLGlCQUVsQixFQUZrQixFQUdsQixJQUFJLG1CQUFBLENBSGMsa0JBR2xCLEVBSGtCLEVBSWxCLElBQUksb0JBQUEsQ0FKYyxtQkFJbEIsRUFKa0IsRUFLbEIsSUFBSSxvQkFBQSxDQUxOLG1CQUtFLEVBTGtCLENBQXBCOztBQVFBLElBQUcsT0FBQSxZQUFBLEtBQUEsV0FBQSxJQUFBLFlBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxFQUFBLFFBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxHQUFrQixJQUFJLG1CQUFBLENBQXRCLGtCQUFrQixFQUFsQjtBQ3dCRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9DRCxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsWUFBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSwyQkFBQSxDQUFBOztBQUNBLElBQUEsY0FBQSxHQUFBLE9BQUEsQ0FBQSw0QkFBQSxDQUFBOztBQUNBLElBQUEsVUFBQSxHQUFBLE9BQUEsQ0FBQSxjQUFBLENBQUE7O0FBQ0EsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLGdCQUFBLENBQUE7O0FBQ0EsSUFBQSxhQUFBLEdBQUEsT0FBQSxDQUFBLHlCQUFBLENBQUE7O0FBQ0EsSUFBQSxXQUFBLEdBQUEsT0FBQSxDQUFBLHVCQUFBLENBQUE7O0FBQ0EsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLDRCQUFBLENBQUE7O0FBUEEsSUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsWUFBQSxFQUFBLFdBQUEsRUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQSxVQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFlBQUEsRUFBQSxhQUFBLEVBQUEsYUFBQSxFQUFBLFVBQUEsRUFBQSxnQkFBQTs7QUFTQSxJQUFhLG1CQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNkJBQ0ksSUFESixFQUNJO0FBQ1QsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFKLE1BQUEsQ0FBWSxJQUFJLFFBQUEsQ0FBSixPQUFBLENBQW5CLE1BQW1CLENBQVosQ0FBUDtBQUNBLE1BQUEsSUFBSSxDQUFKLFdBQUEsQ0FBaUIsSUFBSSxjQUFBLENBQUosYUFBQSxDQUFqQixNQUFpQixDQUFqQjtBQUNBLE1BQUEsSUFBSSxDQUFKLFdBQUEsQ0FBaUIsSUFBSSxhQUFBLENBQXJCLFlBQWlCLEVBQWpCO0FDMkJFLGFEekJGLElBQUksQ0FBSixPQUFBLENBQWE7QUFDWCxnQkFBTztBQUNMLHdCQURLLElBQUE7QUFFTCxvQkFGSyxJQUFBO0FBR0wsbUJBSEssSUFBQTtBQUlMLDBCQUFpQixDQUpaLEtBSVksQ0FKWjtBQUtMLGtCQUxLLGtGQUFBO0FBU0wsa0JBQVM7QUFDUCx3QkFBVztBQUNULDRCQURTLElBQUE7QUFFVCx3QkFBVztBQUZGLGFBREo7QUEyQ1Asd0JBQVc7QUFDVCw0QkFEUyxJQUFBO0FBRVQsd0JBQVc7QUFGRixhQTNDSjtBQXVEUCxtQkFBTTtBQUNKLHlCQUFXO0FBRFAsYUF2REM7QUEwRFAsMkJBQWM7QUFDWiw0QkFEWSxJQUFBO0FBRVosd0JBQVc7QUFGQyxhQTFEUDtBQWtIUCxvQkFBTztBQUNMLHlCQUFXO0FBRE4sYUFsSEE7QUFxSFAsdUJBQVU7QUFDUixzQkFBUztBQUNQLHlCQUFRO0FBQ04sNEJBQVc7QUFETDtBQURELGVBREQ7QUFnQlIsNEJBaEJRLElBQUE7QUFpQlIsd0JBQVc7QUFqQkgsYUFySEg7QUFtTFAsb0JBQU87QUFDTCx5QkFBVztBQUROLGFBbkxBO0FBc0xQLHlCQUFjO0FBdExQO0FBVEosU0FESTtBQXdNWCxzQkFBYTtBQUNYLG9CQURXLFVBQUE7QUFFWCxrQkFBUTtBQUZHLFNBeE1GO0FBOE1YLHdCQUFlO0FBQ2Isb0JBRGEsWUFBQTtBQUViLHlCQUZhLEtBQUE7QUFHYixrQkFBUTtBQUhLLFNBOU1KO0FBcU5YLHdCQUFlO0FBQ2IscUJBQVc7QUFERSxTQXJOSjtBQXdOWCx1QkFBYztBQUNaLHFCQURZLFdBQUE7QUFFWixrQkFBUTtBQUZJLFNBeE5IO0FBOE5YLG1CQUFVO0FBQ1Isb0JBRFEsVUFBQTtBQUVSLGtCQUFRO0FBRkEsU0E5TkM7QUFxT1gsZUFBTTtBQUNKLGlCQURJLE1BQUE7QUFFSixrQkFBUTtBQUZKLFNBck9LO0FBOE9YLGlCQUFRO0FBQ04saUJBRE0sUUFBQTtBQUVOLGtCQUFRO0FBRkYsU0E5T0c7QUFvUFgsaUJBQVE7QUFDTixvQkFETSxRQUFBO0FBRU4sa0JBQVE7QUFGRixTQXBQRztBQStQWCxnQkFBTztBQUNMLGtCQUFTLE9BQU8sQ0FBUCxPQUFBLENBQWdCO0FBQ3ZCLG9CQUFPO0FBQ0wseUJBQVc7QUFETjtBQURnQixXQUFoQixDQURKO0FBTUwsaUJBTkssT0FBQTtBQU9MLDBCQUFlLENBUFYsS0FPVSxDQVBWO0FBUUwsa0JBQVE7QUFSSCxTQS9QSTtBQTRRWCxrQkFBUztBQUNQLGtCQUFTO0FBQ1AsOEJBRE8seUZBQUE7QUFPUCx5QkFBYztBQVBQLFdBREY7QUFlUCxvQkFmTyxhQUFBO0FBZ0JQLG1CQWhCTyxJQUFBO0FBaUJQLDBCQUFlLENBQUEsTUFBQSxFQWpCUixJQWlCUSxDQWpCUjtBQWtCUCxrQkFBUTtBQWxCRCxTQTVRRTtBQXdTWCxrQkFBUztBQUNQLGtCQUFTO0FBQ1AsOEJBRE8seUZBQUE7QUFPUCx5QkFBYztBQVBQLFdBREY7QUFlUCxvQkFmTyxhQUFBO0FBZ0JQLG1CQWhCTyxJQUFBO0FBaUJQLDBCQUFlLENBakJSLEtBaUJRLENBakJSO0FBa0JQLGtCQUFRO0FBbEJELFNBeFNFO0FBK1RYLGlCQUFRO0FBQ04sa0JBQVM7QUFDUCx5QkFBYztBQURQLFdBREg7QUFTTixvQkFUTSxZQUFBO0FBVU4sbUJBQVU7QUFWSixTQS9URztBQTJVWCxxQkFBWTtBQUNWLGlCQURVLFlBQUE7QUFFVixrQkFBUTtBQUZFLFNBM1VEO0FBdVZYLGdCQUFPO0FBQ0wscUJBQVk7QUFEUCxTQXZWSTtBQTBWWCxnQkFBTztBQUNMLG9CQURLLFdBQUE7QUFFTCwwQkFBZSxDQUFBLE1BQUEsRUFBQSxLQUFBLEVBRlYsU0FFVSxDQUZWO0FBR0wsd0JBSEssSUFBQTtBQUlMLG1CQUpLLElBQUE7QUFLTCxrQkFBUTtBQUxILFNBMVZJO0FBc1dYLGNBQUs7QUFDSCxxQkFBWTtBQURULFNBdFdNO0FBeVdYLGVBQU07QUFDSixvQkFESSxVQUFBO0FBRUosMEJBQWUsQ0FGWCxNQUVXLENBRlg7QUFHSixrQkFBUTtBQUhKLFNBeldLO0FBZ1hYLGVBQU07QUFDSixvQkFESSxVQUFBO0FBRUosMEJBQWUsQ0FBQSxNQUFBLEVBQUEsT0FBQSxFQUZYLEtBRVcsQ0FGWDtBQUdKLGtCQUFRO0FBSEosU0FoWEs7QUF1WFgsc0JBQWE7QUFDWCxvQkFEVyxnQkFBQTtBQUVYLDBCQUFlLENBQUEsTUFBQSxFQUZKLE1BRUksQ0FGSjtBQUdYLGtCQUFRO0FBSEcsU0F2WEY7QUE4WFgsZ0JBQU87QUFDTCxxQkFBWTtBQURQLFNBOVhJO0FBaVlYLG9CQUFXO0FBQ1QsaUJBRFMsV0FBQTtBQUVULDBCQUFlLENBQUEsTUFBQSxFQUZOLEtBRU0sQ0FGTjtBQUdULGtCQUFRO0FBSEMsU0FqWUE7QUErWVgsaUJBQVE7QUFDTixpQkFETSxRQUFBO0FBRU4sa0JBQVE7QUFGRjtBQS9ZRyxPQUFiLENDeUJFO0FEOUJPO0FBREo7O0FBQUE7QUFBQSxHQUFQOzs7O0FBaWFBLElBQUEsR0FBTyxjQUFBLFFBQUEsRUFBQTtBQUNMLE1BQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsV0FBQSxFQUFBLElBQUE7QUFBQSxFQUFBLE9BQUEsR0FBVSxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBNUIsS0FBNEIsQ0FBbEIsQ0FBVjs7QUFDQSxNQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxJQUFBLEdBQUEsR0FBTSxRQUFRLENBQVIsT0FBQSxDQUFBLGVBQUEsR0FBQSxNQUFBLENBQU4sT0FBTSxDQUFOOztBQUNBLFFBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLE1BQUEsT0FBQSxHQUFVLEdBQUcsQ0FBSCxNQUFBLENBQVYsTUFBVSxDQUFWO0FBQ0EsTUFBQSxJQUFBLEdBQVUsT0FBSCxlQUFxQixPQUFPLENBQTVCLFFBQUEsVUFBUCwrQkFBQTtBQUNBLE1BQUEsV0FBQSxHQUFpQixHQUFHLENBQUgsSUFBQSxDQUFBLE1BQUEsb0NBSVIsR0FBRyxDQUpLLFFBQUEsNEJBQWpCLEVBQUE7QUFRQSw0Q0FFZ0IsR0FBRyxDQUFDLFFBRnBCLHFCQUlJLElBSkosZUFBQSxXQUFBO0FBWEYsS0FBQSxNQUFBO0FBc0JFLGFBQUEsZUFBQTtBQXhCSjtBQUFBLEdBQUEsTUFBQTtBQTBCRSxXQUFBLG1CQUFBO0FDaFBEO0FEb05ILENBQUE7O0FBOEJBLFVBQUEsR0FBYSxvQkFBQSxRQUFBLEVBQUE7QUFDWCxNQUFBLEdBQUE7QUFBQSxFQUFBLEdBQUEsR0FBTSxJQUFBLE1BQUEsQ0FBVyxPQUFLLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixRQUFRLENBQVIsUUFBQSxDQUEvQixPQUFLLENBQUwsR0FBQSxHQUFBLEdBQWtFLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixRQUFRLENBQVIsUUFBQSxDQUE3RyxhQUFtRixDQUE3RSxDQUFOO0FBQ0EsU0FBTyxRQUFRLENBQVIsR0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQVAsSUFBTyxDQUFQO0FBRkYsQ0FBQTs7QUFJQSxZQUFBLEdBQWUsc0JBQUEsUUFBQSxFQUFBO0FBQ2IsU0FBTyxRQUFRLENBQVIsT0FBQSxDQUFBLE9BQUEsQ0FBQSxLQUFBLEVBQVAsSUFBTyxDQUFQO0FBREYsQ0FBQTs7QUFFQSxXQUFBLEdBQWMscUJBQUEsUUFBQSxFQUFBO0FBQ1osTUFBQSxHQUFBOztBQUFBLE1BQUcsUUFBQSxDQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxJQUFBLEdBQUEsR0FBTSxRQUFRLENBQVIsTUFBQSxDQUFOLE9BQU0sRUFBTjtBQUNBLElBQUEsUUFBUSxDQUFSLFlBQUEsR0FBd0IsUUFBUSxDQUFSLE1BQUEsQ0FBeEIsWUFBQTtBQUNBLElBQUEsUUFBUSxDQUFSLFVBQUEsR0FBc0IsUUFBUSxDQUFSLE1BQUEsQ0FBdEIsVUFBQTtBQUNBLFdBQUEsR0FBQTtBQ3pPRDtBRG9PSCxDQUFBOztBQU1BLFVBQUEsR0FBYSxvQkFBQSxRQUFBLEVBQUE7QUFDWCxNQUFBLGFBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQTtBQUFBLEVBQUEsYUFBQSxHQUFnQixRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFsQixlQUFrQixDQUFsQixFQUFoQixLQUFnQixDQUFoQjtBQUNBLEVBQUEsTUFBQSxHQUFTLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQWxCLFFBQWtCLENBQWxCLEVBQVQsRUFBUyxDQUFUO0FBQ0EsRUFBQSxNQUFBLEdBQVMsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBbEIsUUFBa0IsQ0FBbEIsRUFBVCxFQUFTLENBQVQ7O0FBQ0EsTUFBRyxRQUFBLENBQUEsUUFBQSxDQUFBLFVBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxXQUFPLE1BQUEsSUFBVSxRQUFRLENBQVIsUUFBQSxDQUFBLFVBQUEsQ0FBQSxPQUFBLElBQVYsRUFBQSxDQUFBLEdBQVAsTUFBQTtBQ3JPRDs7QURzT0QsTUFBQSxhQUFBLEVBQUE7QUFDRSxXQUFPLE1BQUEsR0FBUCxNQUFBO0FDcE9EO0FENk5ILENBQUE7O0FBUUEsYUFBQSxHQUFnQix1QkFBQSxRQUFBLEVBQUE7QUNqT2QsU0RrT0EsT0FBTyxDQUFQLE9BQUEsR0FBQSxJQUFBLENBQXVCLFlBQUE7QUFDckIsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsUUFBQSxDQUFBLE9BQUEsQ0FBVixPQUFBO0FDaE9BLFdEaU9BLE9BQU8sQ0FBUCxJQUFBLENBQUEsTUFBQSxDQ2pPQTtBRCtORixHQUFBLEVBQUEsSUFBQSxDQUdPLFVBQUEsU0FBRCxFQUFBO0FBQ0osUUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxhQUFBO0FBQUEsSUFBQSxhQUFBLEdBQWdCLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQUEsQ0FBQSxFQUFsQyxNQUFrQyxDQUFsQixDQUFoQjtBQUNBLElBQUEsT0FBQSxHQUFVLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQUEsQ0FBQSxFQUE1QixJQUE0QixDQUFsQixDQUFWOztBQUNBLFFBQUcsYUFBQSxJQUFBLElBQUEsSUFBbUIsT0FBQSxJQUF0QixJQUFBLEVBQUE7QUFDRSxNQUFBLEdBQUEsR0FBTSxRQUFRLENBQVIsT0FBQSxDQUFBLGVBQUEsR0FBQSxNQUFBLENBQU4sYUFBTSxDQUFOOztBQUNBLFVBQUcsU0FBQSxDQUFBLGFBQUEsQ0FBQSxJQUFBLElBQUEsSUFBOEIsR0FBQSxJQUFqQyxJQUFBLEVBQUE7QUFDRSxZQUFBLEVBQU8sT0FBTyxDQUFQLE9BQUEsQ0FBQSxHQUFBLElBQXVCLENBQTlCLENBQUEsQ0FBQSxFQUFBO0FBQ0UsVUFBQSxPQUFBLEdBQVUsR0FBRyxDQUFILFFBQUEsQ0FBQSxPQUFBLENBQUEsYUFBQSxFQUFBLEVBQUEsSUFBVixPQUFBO0FDL05EOztBRGdPRCxRQUFBLE9BQUEsR0FBVSxTQUFVLENBQXBCLGFBQW9CLENBQXBCOztBQUNBLFFBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxDQUFBLE9BQUEsRUFBQSxPQUFBOztBQUNBLFFBQUEsR0FBRyxDQUFILFVBQUE7QUFDQSxRQUFBLFNBQVUsQ0FBVixPQUFVLENBQVYsR0FBQSxPQUFBO0FBQ0EsZUFBTyxTQUFVLENBQWpCLGFBQWlCLENBQWpCO0FDOU5BLGVEK05BLE9BQU8sQ0FBUCxPQUFBLEdBQUEsSUFBQSxDQUF1QixZQUFBO0FDOU5yQixpQkQrTkEsT0FBTyxDQUFQLElBQUEsQ0FBQSxNQUFBLEVBQUEsU0FBQSxDQy9OQTtBRDhORixTQUFBLEVBQUEsSUFBQSxDQUVNLFlBQUE7QUFDSixpQkFBQSxFQUFBO0FBSEYsU0FBQSxDQy9OQTtBRHVORixPQUFBLE1BWUssSUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0gsZUFBQSxvQkFBQTtBQURHLE9BQUEsTUFBQTtBQUdILGVBQUEsZUFBQTtBQWpCSjtBQzNNQztBRHFNSCxHQUFBLENDbE9BO0FEaU9GLENBQUE7O0FBeUJBLGFBQUEsR0FBZ0IsdUJBQUEsUUFBQSxFQUFBO0FDeE5kLFNEeU5BLE9BQU8sQ0FBUCxPQUFBLEdBQUEsSUFBQSxDQUF1QixZQUFBO0FBQ3JCLFFBQUEsSUFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQUEsQ0FBQSxFQUF6QixLQUF5QixDQUFsQixDQUFQOztBQUNBLFFBQUcsSUFBQSxJQUFILElBQUEsRUFBQTtBQ3ZORSxhRHdOQSxPQUFPLENBQVAsT0FBQSxHQUFBLElBQUEsQ0FBdUIsWUFBQTtBQUNyQixZQUFBLFNBQUEsRUFBQSxPQUFBO0FBQUEsUUFBQSxPQUFBLEdBQVUsUUFBQSxDQUFBLE9BQUEsQ0FBVixPQUFBO0FDdE5BLGVEdU5BLFNBQUEsR0FBWSxPQUFPLENBQVAsSUFBQSxDQUFBLE1BQUEsQ0N2Tlo7QURxTkYsT0FBQSxFQUFBLElBQUEsQ0FHTyxVQUFBLFNBQUQsRUFBQTtBQUNKLFlBQUEsR0FBQSxFQUFBLE9BQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxRQUFRLENBQVIsT0FBQSxDQUFBLGVBQUEsR0FBQSxNQUFBLENBQU4sSUFBTSxDQUFOOztBQUNBLFlBQUcsU0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBcUIsR0FBQSxJQUF4QixJQUFBLEVBQUE7QUFDRSxVQUFBLE9BQUEsR0FBVSxTQUFVLENBQXBCLElBQW9CLENBQXBCO0FBQ0EsVUFBQSxHQUFHLENBQUgsVUFBQTtBQUNBLGlCQUFPLFNBQVUsQ0FBakIsSUFBaUIsQ0FBakI7QUNyTkEsaUJEc05BLE9BQU8sQ0FBUCxPQUFBLEdBQUEsSUFBQSxDQUF1QixZQUFBO0FDck5yQixtQkRzTkEsT0FBTyxDQUFQLElBQUEsQ0FBQSxNQUFBLEVBQUEsU0FBQSxDQ3ROQTtBRHFORixXQUFBLEVBQUEsSUFBQSxDQUVNLFlBQUE7QUFDSixtQkFBQSxFQUFBO0FBSEYsV0FBQSxDQ3ROQTtBRGtORixTQUFBLE1BUUssSUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0gsaUJBQUEsb0JBQUE7QUFERyxTQUFBLE1BQUE7QUFHSCxpQkFBQSxlQUFBO0FDcE5EO0FEb01ILE9BQUEsQ0N4TkE7QUFzQkQ7QUQrTEgsR0FBQSxDQ3pOQTtBRHdORixDQUFBOztBQXFCQSxZQUFBLEdBQWUsc0JBQUEsUUFBQSxFQUFBO0FBQ2IsTUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLElBQUE7QUFBQSxFQUFBLElBQUEsR0FBTyxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBekIsTUFBeUIsQ0FBbEIsQ0FBUDtBQUNBLEVBQUEsS0FBQSxHQUFRLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQUEsQ0FBQSxFQUExQixPQUEwQixDQUFsQixDQUFSOztBQUNBLE1BQUcsSUFBQSxJQUFBLElBQUEsSUFBVSxLQUFBLElBQWIsSUFBQSxFQUFBO0FBQ0UsSUFBQSxHQUFBLEdBQU0sUUFBUSxDQUFSLE9BQUEsQ0FBQSxNQUFBLENBQU4sSUFBTSxDQUFOOztBQUNBLFFBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLE1BQUEsR0FBQSxHQUFNLEdBQUcsQ0FBSCxVQUFBLE1BRFIsR0FDRSxDQURGLENDNU1FO0FBQ0E7O0FEK01BLE1BQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxFQUF1QjtBQUFFLFFBQUEsT0FBQSxFQUFTLEdBQUcsQ0FBQztBQUFmLE9BQXZCOztBQUNBLGFBQUEsRUFBQTtBQUxGLEtBQUEsTUFBQTtBQU9FLGFBQUEsZUFBQTtBQVRKO0FDak1DO0FEOExILENBQUE7O0FBY0EsV0FBQSxHQUFjLHFCQUFBLFFBQUEsRUFBQTtBQUNaLE1BQUEsR0FBQSxFQUFBLFFBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUEsVUFBQTtBQUFBLEVBQUEsR0FBQSxHQUFNLFFBQVEsQ0FBUixZQUFBLENBQXNCLENBQXRCLEtBQXNCLENBQXRCLEVBQU4sSUFBTSxDQUFOO0FBQ0EsRUFBQSxVQUFBLEdBQWEsUUFBUSxDQUFSLFlBQUEsQ0FBc0IsQ0FBdEIsU0FBc0IsQ0FBdEIsRUFBYixJQUFhLENBQWI7QUFDQSxFQUFBLElBQUEsR0FBTyxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBekIsTUFBeUIsQ0FBbEIsQ0FBUDtBQUNBLEVBQUEsVUFBQSxHQUFnQixJQUFILEdBQ1gsQ0FEVyxJQUNYLENBRFcsR0FHWCxRQUFRLENBQVIsT0FBQSxDQUFBLGFBQUEsR0FBQSxNQUFBLENBQXlDLFVBQUEsSUFBRCxFQUFBO0FDMU14QyxXRDBNa0QsSUFBQSxLQUFRLFFBQVEsQ0FBUixHQUFBLENBQWEsUUMxTXZFO0FEME1BLEdBQUEsRUFBQSxNQUFBLENBSEYsT0FHRSxDQUhGO0FBS0EsRUFBQSxPQUFBLEdBQWEsVUFBSCxHQUNSLFFBQVEsQ0FBUixPQUFBLENBRFEsZUFDUixFQURRLEdBR1IsUUFBUSxDQUFSLFFBQUEsQ0FBQSxPQUFBLEdBSEYsT0FBQTtBQUtBLEVBQUEsUUFBQSxHQUFXLFVBQVUsQ0FBVixNQUFBLENBQWtCLFVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQTtBQUN6QixRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBUyxJQUFBLEtBQUEsT0FBQSxHQUFxQixRQUFBLENBQUEsT0FBQSxDQUFyQixJQUFBLEdBQXVDLE9BQU8sQ0FBUCxNQUFBLENBQUEsSUFBQSxFQUFvQjtBQUFBLE1BQUEsV0FBQSxFQUFZO0FBQVosS0FBcEIsQ0FBaEQ7O0FBQ0EsUUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsTUFBQSxHQUFHLENBQUgsSUFBQTs7QUFDQSxVQUFHLEdBQUcsQ0FBTixJQUFBLEVBQUE7QUFDRSxRQUFBLFFBQUEsR0FBVyxRQUFRLENBQVIsTUFBQSxDQUFnQixHQUFHLENBQTlCLElBQVcsQ0FBWDtBQUhKO0FDdE1EOztBQUNELFdEeU1FLFFDek1GO0FEbU1TLEdBQUEsRUFBWCxFQUFXLENBQVg7QUFTQSxFQUFBLElBQUEsR0FBVSxRQUFRLENBQVIsTUFBQSxHQUNSLFFBQVEsQ0FBUixHQUFBLENBQWMsVUFBQSxHQUFELEVBQUE7QUFDWCxJQUFBLEdBQUcsQ0FBSCxJQUFBO0FDMU1GLFdEMk1FLENBQUksR0FBRyxDQUFILFlBQUEsS0FBQSxLQUFBLEdBQUosUUFBQSxJQUFpRCxHQUFHLENBQXBELFFBQUEsR0FBOEQsSUMzTWhFO0FEeU1BLEdBQUEsRUFBQSxJQUFBLENBRFEsSUFDUixDQURRLEdBQVYsK0JBQUE7O0FBUUEsTUFBQSxHQUFBLEVBQUE7QUFDRSw4QkFFSSxJQUZKO0FBREYsR0FBQSxNQUFBO0FDM01FLFdEb05BLElDcE5BO0FBQ0Q7QUQyS0gsQ0FBQTs7QUEwQ0EsVUFBQSxHQUFhLG9CQUFBLFFBQUEsRUFBQTtBQUNYLE1BQUEsSUFBQSxFQUFBLEdBQUE7QUFBQSxFQUFBLElBQUEsR0FBTyxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBekIsTUFBeUIsQ0FBbEIsQ0FBUDtBQUNBLEVBQUEsR0FBQSxHQUFNLFdBQUEsQ0FBQSxVQUFBLENBQUEsT0FBQSxDQUFtQixRQUFRLENBQVIsUUFBQSxDQUFuQixJQUFBLEVBQU4sSUFBTSxDQUFOOztBQUNBLE1BQUcsUUFBQSxHQUFBLE1BQUgsUUFBQSxFQUFBO0FDaE5FLFdEaU5BLElBQUksQ0FBSixTQUFBLENBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENDak5BO0FEZ05GLEdBQUEsTUFBQTtBQzlNRSxXRGlOQSxHQ2pOQTtBQUNEO0FEME1ILENBQUE7O0FBUUEsVUFBQSxHQUFhLG9CQUFBLFFBQUEsRUFBQTtBQUNYLE1BQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBO0FBQUEsRUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBQSxDQUFBLEVBQXpCLE1BQXlCLENBQWxCLENBQVA7QUFDQSxFQUFBLEdBQUEsR0FBUyxDQUFBLENBQUEsR0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLENBQUEsQ0FBQSxLQUFBLElBQUEsR0FBQSxDQUFBLEdBRUQsUUFBUSxDQUFSLE9BQUEsR0FDTixRQUFRLENBREYsT0FBQSxHQUFILEtBRkwsQ0FBQTs7QUFJQSxFQUFBLFdBQUEsQ0FBQSxVQUFBLENBQUEsT0FBQSxDQUFtQixRQUFRLENBQVIsUUFBQSxDQUFuQixJQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUE7O0FDaE5BLFNEaU5BLEVDak5BO0FEME1GLENBQUE7O0FBU0EsZ0JBQUEsR0FBbUIsMEJBQUEsUUFBQSxFQUFBO0FBQ2pCLE1BQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBO0FBQUEsRUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBQSxDQUFBLEVBQXpCLE1BQXlCLENBQWxCLENBQVA7QUFDQSxFQUFBLEdBQUEsR0FBUyxDQUFBLENBQUEsR0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBLEtBQUEsSUFBQSxHQUFBLENBQUEsR0FFRCxRQUFRLENBQVIsT0FBQSxHQUNOLFFBQVEsQ0FERixPQUFBLEdBQUgsS0FGTCxDQUFBOztBQUlBLEVBQUEsV0FBQSxDQUFBLFVBQUEsQ0FBQSxPQUFBLENBQW1CLFFBQVEsQ0FBUixRQUFBLENBQW5CLElBQUEsRUFBQSxJQUFBLEVBQWdELElBQUksQ0FBSixLQUFBLENBQWhELEdBQWdELENBQWhEOztBQ2pOQSxTRGtOQSxFQ2xOQTtBRDJNRixDQUFBOztBQVNBLFFBQUEsR0FBVyxrQkFBQSxRQUFBLEVBQUE7QUFDVCxNQUFHLFFBQUEsQ0FBQSxRQUFBLENBQUEsVUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFdBQU8sUUFBUSxDQUFSLFFBQUEsQ0FBQSxVQUFBLENBQUEsUUFBQSxDQUFzQyxRQUFRLENBQTlDLE1BQUEsRUFBc0QsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBQSxLQUFBLEVBQS9FLFNBQStFLENBQWxCLENBQXRELENBQVA7QUNoTkQ7QUQ4TUgsQ0FBQTs7QUFJTSxNQUFOO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMkJBQ1E7QUFDSixXQUFBLE1BQUEsR0FBVSxJQUFJLFVBQUEsQ0FBSixTQUFBLENBQWMsS0FBQSxRQUFBLENBQXhCLE9BQVUsQ0FBVjtBQUNBLFdBQUEsR0FBQSxHQUFPLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBbUIsQ0FBMUIsS0FBMEIsQ0FBbkIsQ0FBUDs7QUFDQSxVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGFBQUEsTUFBQSxDQUFBLFFBQUEsR0FBb0IsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLE9BQUEsR0FBNkIsS0FBN0IsR0FBQSxHQUFvQyxLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQXhELE9BQUE7QUFDQSxhQUFBLE1BQUEsQ0FBQSxTQUFBLEdBQW9CLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxPQUFBLEdBQTZCLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBN0IsU0FBQSxHQUE0RCxLQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxFQUE1RCxDQUE0RCxDQUE1RCxHQUFpRixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQXJHLE9BQUE7QUM5TUQ7O0FEK01ELFdBQUEsTUFBQSxDQUFBLElBQUEsR0FBZSxLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQWYsSUFBQTtBQUNBLFdBQUEsTUFBQSxDQUFBLEdBQUEsR0FBQSxDQUFBO0FBQ0EsV0FBQSxNQUFBLENBQUEsTUFBQSxHQUFpQixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW1CLENBQW5CLFFBQW1CLENBQW5CLEVBQWpCLEVBQWlCLENBQWpCO0FDN01BLGFEOE1BLEtBQUEsTUFBQSxDQUFBLE1BQUEsR0FBaUIsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFuQixRQUFtQixDQUFuQixFQUFBLEVBQUEsQ0M5TWpCO0FEcU1JO0FBRFI7QUFBQTtBQUFBLDZCQVlVO0FBQ04sVUFBQSxNQUFBLEVBQUEsTUFBQTs7QUFBQSxVQUFHLEtBQUEsTUFBQSxNQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsTUFBQSxHQUFTLEtBQUEsTUFBQSxHQUFULE1BQUE7QUFERixPQUFBLE1BQUE7QUFHRSxRQUFBLE1BQUEsR0FBQSxDQUFBO0FDM01EOztBRDZNRCxNQUFBLE1BQUEsR0FBUyxDQUFULFFBQVMsQ0FBVDs7QUFDQSxVQUFHLEtBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxNQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0UsUUFBQSxNQUFNLENBQU4sSUFBQSxDQUFBLENBQUE7QUFERixPQUFBLE1BRUssSUFBRyxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxHQUFILENBQUEsRUFBQTtBQUNILFFBQUEsTUFBTSxDQUFOLElBQUEsQ0FBQSxDQUFBO0FDM01EOztBRDRNRCxhQUFPLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLEVBQVAsTUFBTyxDQUFQO0FBWE07QUFaVjtBQUFBO0FBQUEsNEJBeUJTO0FBQ0wsVUFBQSxNQUFBLEVBQUEsS0FBQTs7QUFBQSxVQUFHLEtBQUEsTUFBQSxNQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsS0FBQSxHQUFRLEtBQUEsTUFBQSxHQUFSLEtBQUE7QUFERixPQUFBLE1BQUE7QUFHRSxRQUFBLEtBQUEsR0FBQSxDQUFBO0FDeE1EOztBRDBNRCxNQUFBLE1BQUEsR0FBUyxDQUFULE9BQVMsQ0FBVDs7QUFDQSxVQUFHLEtBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxNQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0UsUUFBQSxNQUFNLENBQU4sSUFBQSxDQUFBLENBQUE7QUN4TUQ7O0FEeU1ELGFBQU8sSUFBSSxDQUFKLEdBQUEsQ0FBUyxLQUFULFFBQVMsRUFBVCxFQUFzQixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxFQUE3QixLQUE2QixDQUF0QixDQUFQO0FBVEs7QUF6QlQ7QUFBQTtBQUFBLDZCQXFDVTtBQUNOLFVBQUcsS0FBQSxRQUFBLENBQUgsT0FBQSxFQUFBO0FBQ0UsWUFBTyxLQUFBLE9BQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxlQUFBLE9BQUEsR0FBVyxLQUFBLE1BQUEsQ0FBQSxVQUFBLENBQW1CLEtBQUEsUUFBQSxDQUE5QixPQUFXLENBQVg7QUN2TUQ7O0FEd01ELGVBQU8sS0FBUCxPQUFBO0FDdE1EO0FEa01LO0FBckNWO0FBQUE7QUFBQSw2QkEyQ1U7QUFDTixXQUFBLE1BQUEsQ0FBQSxNQUFBLEdBQWlCLEtBQWpCLE1BQWlCLEVBQWpCO0FBQ0EsV0FBQSxNQUFBLENBQUEsS0FBQSxHQUFnQixLQUFoQixLQUFnQixFQUFoQjtBQUNBLGFBQU8sS0FBQSxNQUFBLENBQUEsSUFBQSxDQUFhLEtBQUEsUUFBQSxDQUFwQixPQUFPLENBQVA7QUFITTtBQTNDVjtBQUFBO0FBQUEsK0JBK0NZO0FBQ1IsVUFBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLEtBQUEsR0FBQSxDQUFQLE1BQUE7QUFERixPQUFBLE1BQUE7QUFHRSxlQUFBLENBQUE7QUNsTUQ7QUQ4TE87QUEvQ1o7O0FBQUE7QUFBQSxFQUFxQixRQUFBLENBQXJCLFdBQUEsQ0FBTTs7QUFxREEsUUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNRO0FDOUxKLGFEK0xBLEtBQUEsTUFBQSxHQUFVLElBQUksVUFBQSxDQUFKLFNBQUEsQ0FBYyxLQUFBLFFBQUEsQ0FBZCxPQUFBLENDL0xWO0FEOExJO0FBRFI7QUFBQTtBQUFBLDhCQUdXO0FBQ1AsVUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsZ0JBQUEsRUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxNQUFBLENBQUEsTUFBQSxHQUFpQixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW1CLENBQW5CLFFBQW1CLENBQW5CLEVBQTFCLEVBQTBCLENBQTFCO0FBQ0EsTUFBQSxNQUFBLEdBQVMsS0FBQSxNQUFBLENBQUEsTUFBQSxHQUFpQixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW1CLENBQW5CLFFBQW1CLENBQW5CLEVBQTFCLEVBQTBCLENBQTFCO0FBQ0EsTUFBQSxHQUFBLEdBQU0sS0FBQSxNQUFBLENBQUEsWUFBQSxDQUFxQixLQUFBLFFBQUEsQ0FBM0IsTUFBMkIsRUFBckIsQ0FBTjtBQUNBLE1BQUEsZ0JBQUEsR0FBbUIsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFuQixrQkFBbUIsQ0FBbkIsRUFBbkIsSUFBbUIsQ0FBbkI7O0FBQ0EsVUFBRyxDQUFILGdCQUFBLEVBQUE7QUFDRSxhQUFBLE1BQUEsQ0FBQSxNQUFBLEdBQWlCLEtBQUEsTUFBQSxDQUFBLE1BQUEsR0FBakIsRUFBQTtBQUNBLFFBQUEsSUFBQSxHQUFPLEtBQUEsTUFBQSxDQUFBLFlBQUEsQ0FBcUIsS0FBQSxRQUFBLENBQTVCLE1BQTRCLEVBQXJCLENBQVA7O0FBQ0EsWUFBRyxJQUFBLElBQUEsSUFBQSxLQUFZLEdBQUEsSUFBQSxJQUFBLElBQVEsR0FBRyxDQUFILEtBQUEsR0FBWSxJQUFJLENBQUosS0FBQSxHQUFhLE1BQU0sQ0FBdkMsTUFBQSxJQUFrRCxHQUFHLENBQUgsR0FBQSxHQUFVLElBQUksQ0FBSixHQUFBLEdBQVcsTUFBTSxDQUE1RixNQUFHLENBQUgsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFBLElBQUE7QUFKSjtBQ3RMQzs7QUQyTEQsVUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsS0FBQSxNQUFBLENBQUEsWUFBQSxDQUFxQixLQUFBLFFBQUEsQ0FBQSxNQUFBLEdBQTdCLEtBQVEsQ0FBUjs7QUFDQSxZQUFHLEtBQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxlQUFBLFFBQUEsQ0FBQSxLQUFBLEdBQUEsSUFBQTtBQ3pMRDs7QUFDRCxlRHlMQSxLQUFBLFFBQUEsQ0FBQSxnQkFBQSxDQUEyQixJQUFJLFlBQUEsQ0FBSixXQUFBLENBQWdCLEdBQUcsQ0FBbkIsS0FBQSxFQUEwQixHQUFHLENBQTdCLEdBQUEsRUFBM0IsRUFBMkIsQ0FBM0IsQ0N6TEE7QURxTEYsT0FBQSxNQUFBO0FDbkxFLGVEeUxBLEtBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxFQUFBLENDekxBO0FBQ0Q7QUR3S007QUFIWDs7QUFBQTtBQUFBLEVBQXVCLFFBQUEsQ0FBdkIsV0FBQSxDQUFNOztBQXFCQSxPQUFOO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMkJBQ1E7QUFDSixVQUFBLEdBQUE7QUFBQSxXQUFBLE9BQUEsR0FBVyxLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW1CLENBQUEsQ0FBQSxFQUE5QixLQUE4QixDQUFuQixDQUFYO0FBQ0EsV0FBQSxTQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQWEsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFoQyxDQUFnQyxDQUFuQixDQUFiLE1BQUEsR0FBQSxJQUFhLEdBQUEsS0FBYixXQUFBOztBQUNBLFVBQUcsS0FBQSxPQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsYUFBQSxNQUFBLEdBQVUsS0FBQSxRQUFBLENBQUEsT0FBQSxDQUFBLGVBQUEsR0FBQSxTQUFBLENBQThDLEtBQXhELE9BQVUsQ0FBVjtBQUNBLGFBQUEsTUFBQSxDQUFBLFlBQUEsR0FBQSxLQUFBO0FBQ0EsYUFBQSxHQUFBLEdBQU8sS0FBQSxNQUFBLENBQVAsSUFBTyxFQUFQO0FDbkxEOztBQUNELGFEbUxBLEtBQUEsUUFBQSxHQUFlLEtBQUEsR0FBQSxJQUFBLElBQUEsR0FBVyxLQUFBLEdBQUEsQ0FBWCxVQUFXLEVBQVgsR0FBa0MsSUNuTGpEO0FENEtJO0FBRFI7QUFBQTtBQUFBLDZCQVNVO0FBQ04sVUFBRyxLQUFBLFFBQUEsQ0FBSCxPQUFBLEVBQUE7QUFDRSxlQUFPLEtBQVAsaUJBQU8sRUFBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sS0FBUCxvQkFBTyxFQUFQO0FDaExEO0FENEtLO0FBVFY7QUFBQTtBQUFBLHdDQWNxQjtBQUNmLFVBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxRQUFBLENBQUEsZ0JBQUEsQ0FBMkIsS0FBQSxRQUFBLENBQXBDLE9BQVMsQ0FBVDtBQUNBLE1BQUEsTUFBTSxDQUFOLFFBQUE7QUFDQSxNQUFBLElBQUEsR0FBQSxFQUFBO0FBQ0EsTUFBQSxHQUFBLEdBQUEsT0FBQSxDQUFBLEtBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUMzS0EsUUFBQSxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQU8sQ0FBUDtBRDRLRSxRQUFBLENBQUMsQ0FBRCxRQUFBLENBQUEsTUFBQSxFQUFBLElBQUE7QUFERjs7QUFFQSxNQUFBLFFBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFnQixLQUFoQixPQUFBLEVBQUEsSUFBQTs7QUFDQSxhQUFBLEVBQUE7QUFQZTtBQWRyQjtBQUFBO0FBQUEsbUNBc0JnQjtBQUNWLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLEtBQU4sR0FBQTtBQUNBLGFBQU8sT0FBTyxDQUFQLEtBQUEsQ0FBQSxHQUFBLENBQW1CLFVBQUEsQ0FBQSxFQUFBO0FDdEsxQixlRHNLZ0MsQ0FBQyxDQUFELE9BQUEsQ0FBQSxHQUFBLENDdEtoQztBRHNLTyxPQUFBLEVBQUEsTUFBQSxDQUFrRCxVQUFBLENBQUEsRUFBQTtBQ3BLekQsZURvSytELENBQUEsSUFBQSxJQ3BLL0Q7QURvS08sT0FBQSxFQUFBLElBQUEsQ0FBUCxJQUFPLENBQVA7QUFGVTtBQXRCaEI7QUFBQTtBQUFBLDJDQXlCd0I7QUFDcEIsVUFBQSxJQUFBLEVBQUEsTUFBQTs7QUFBQSxVQUFHLENBQUMsS0FBRCxHQUFBLElBQVMsS0FBWixRQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBVSxLQUFBLEdBQUEsR0FBVSxLQUFBLEdBQUEsQ0FBVixRQUFBLEdBQTZCLEtBQXZDLE9BQUE7QUFDQSxRQUFBLE1BQUEsR0FBUyxLQUFBLFFBQUEsQ0FBQSxnQkFBQSx1QkFFTSxLQUFBLFFBQUEsQ0FBQSxHQUFBLENBRGIsUUFETyxjQUVnQyxJQUZoQyxtQkFHTCxLQUhKLFlBR0ksRUFISyxzQ0FBVDtBQU9BLFFBQUEsTUFBTSxDQUFOLFdBQUEsR0FBQSxLQUFBOztBQUNPLFlBQUcsS0FBSCxTQUFBLEVBQUE7QUNyS0wsaUJEcUt3QixNQUFNLENBQU4sT0FBQSxFQ3JLeEI7QURxS0ssU0FBQSxNQUFBO0FDbktMLGlCRG1LOEMsTUFBTSxDQUFOLFFBQUEsRUNuSzlDO0FEeUpKO0FDdkpDO0FEc0ptQjtBQXpCeEI7O0FBQUE7QUFBQSxFQUFzQixRQUFBLENBQXRCLFdBQUEsQ0FBTTs7QUFxQ04sT0FBTyxDQUFQLE9BQUEsR0FBa0IsVUFBQSxJQUFBLEVBQUE7QUFDaEIsTUFBQSxDQUFBLEVBQUEsVUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQTtBQUFBLEVBQUEsVUFBQSxHQUFhLElBQUksQ0FBSixXQUFBLEdBQW1CO0FBQUMsSUFBQSxJQUFBLEVBQUs7QUFBTixHQUFoQztBQUNBLEVBQUEsR0FBQSxHQUFBLE9BQUEsQ0FBQSxLQUFBOztBQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDeEpFLElBQUEsQ0FBQyxHQUFHLEdBQUcsQ0FBUCxDQUFPLENBQVA7QUR5SkEsSUFBQSxDQUFDLENBQUQsTUFBQSxDQUFTLFVBQVUsQ0FBbkIsSUFBQTtBQUhjLEdBQUEsQ0NuSmhCOzs7QUR3SkEsU0FBQSxJQUFBO0FBTEYsQ0FBQTs7QUFNQSxPQUFPLENBQVAsS0FBQSxHQUFnQixDQUNkLElBQUksWUFBQSxDQUFBLFdBQUEsQ0FBSixPQUFBLENBQUEsV0FBQSxFQUE2QztBQUFDLEVBQUEsR0FBQSxFQUFJO0FBQUwsQ0FBN0MsQ0FEYyxFQUVkLElBQUksWUFBQSxDQUFBLFdBQUEsQ0FBSixPQUFBLENBQUEsVUFBQSxFQUE2QztBQUFDLEVBQUEsR0FBQSxFQUFJO0FBQUwsQ0FBN0MsQ0FGYyxFQUdkLElBQUksWUFBQSxDQUFBLFdBQUEsQ0FBSixJQUFBLENBQUEsbUJBQUEsRUFBNkM7QUFBQyxFQUFBLEdBQUEsRUFBSTtBQUFMLENBQTdDLENBSGMsRUFJZCxJQUFJLFlBQUEsQ0FBQSxXQUFBLENBQUosSUFBQSxDQUFBLGFBQUEsRUFBNkM7QUFBQyxFQUFBLEdBQUEsRUFBSTtBQUFMLENBQTdDLENBSmMsRUFLZCxJQUFJLFlBQUEsQ0FBQSxXQUFBLENBQUosTUFBQSxDQUFBLGVBQUEsRUFBNkM7QUFBQyxFQUFBLEdBQUEsRUFBSTtBQUFMLENBQTdDLENBTGMsRUFNZCxJQUFJLFlBQUEsQ0FBQSxXQUFBLENBQUosTUFBQSxDQUFBLFVBQUEsRUFBNkM7QUFBQyxTQUFELFNBQUE7QUFBZ0IsRUFBQSxNQUFBLEVBQU87QUFBdkIsQ0FBN0MsQ0FOYyxFQU9kLElBQUksWUFBQSxDQUFBLFdBQUEsQ0FBSixNQUFBLENBQUEsTUFBQSxFQUE2QztBQUFDLEVBQUEsS0FBQSxFQUFELE1BQUE7QUFBZSxFQUFBLFNBQUEsRUFBVTtBQUF6QixDQUE3QyxDQVBjLEVBUWQsSUFBSSxZQUFBLENBQUEsV0FBQSxDQUFKLE1BQUEsQ0FBQSxRQUFBLEVBQTZDO0FBQUMsU0FBRCxXQUFBO0FBQWtCLEVBQUEsUUFBQSxFQUFsQixRQUFBO0FBQXFDLEVBQUEsU0FBQSxFQUFyQyxJQUFBO0FBQXFELEVBQUEsTUFBQSxFQUFPO0FBQTVELENBQTdDLENBUmMsQ0FBaEI7O0FBVU0sWUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNRO0FDdEhKLGFEdUhBLEtBQUEsSUFBQSxHQUFRLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBbUIsQ0FBbkIsQ0FBbUIsQ0FBbkIsQ0N2SFI7QURzSEk7QUFEUjtBQUFBO0FBQUEsNkJBR1U7QUFDTixVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQTs7QUFBQSxVQUFHLEtBQUEsSUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGFBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxPQUFBLEdBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBa0QsS0FBbEQsSUFBQTtBQUNBLGVBQUEsRUFBQTtBQUZGLE9BQUEsTUFBQTtBQUlFLFFBQUEsVUFBQSxHQUFhLEtBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBYixhQUFhLEVBQWI7QUFDQSxRQUFBLEdBQUEsR0FBQSxXQUFBOztBQUNBLGFBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsVUFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDbkhFLFVBQUEsSUFBSSxHQUFHLFVBQVUsQ0FBakIsQ0FBaUIsQ0FBakI7O0FEb0hBLGNBQUcsSUFBQSxLQUFRLEtBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBWCxRQUFBLEVBQUE7QUFDRSxZQUFBLEdBQUEsSUFBTyxJQUFBLEdBQVAsSUFBQTtBQ2xIRDtBRGdISDs7QUFHQSxRQUFBLEdBQUEsSUFBQSx1QkFBQTtBQUNBLFFBQUEsTUFBQSxHQUFTLEtBQUEsUUFBQSxDQUFBLGdCQUFBLENBQVQsR0FBUyxDQUFUO0FBQ0EsZUFBTyxNQUFNLENBQWIsUUFBTyxFQUFQO0FDaEhEO0FEb0dLO0FBSFY7O0FBQUE7QUFBQSxFQUEyQixRQUFBLENBQTNCLFdBQUEsQ0FBTTs7QUFrQkEsV0FBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNRO0FBQ0osV0FBQSxJQUFBLEdBQVEsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFBLENBQUEsRUFBM0IsTUFBMkIsQ0FBbkIsQ0FBUjtBQzdHQSxhRDhHQSxLQUFBLEdBQUEsR0FBTyxLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW1CLENBQW5CLEtBQW1CLENBQW5CLEVBQUEsSUFBQSxDQzlHUDtBRDRHSTtBQURSO0FBQUE7QUFBQSw2QkFJVTtBQUFBOztBQUNOLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFVLEtBQUEsSUFBQSxHQUFXLFdBQUEsQ0FBQSxVQUFBLENBQUEsT0FBQSxDQUFtQixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW5CLElBQUEsRUFBNEMsS0FBdkQsSUFBVyxDQUFYLEdBQW1FLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBN0UsSUFBQTs7QUFDQSxVQUFHLEtBQUEsUUFBQSxDQUFBLE9BQUEsSUFBc0IsSUFBQSxJQUF0QixJQUFBLElBQWdDLElBQUEsS0FBbkMsS0FBQSxFQUFBO0FBQ0UsWUFBRyxLQUFLLENBQUwsT0FBQSxDQUFILElBQUcsQ0FBSCxFQUFBO0FDMUdFLGlCRDJHQSxJQUFJLENBQUosR0FBQSxDQUFVLFVBQUEsSUFBRCxFQUFBO0FDMUdQLG1CRDBHZSxLQUFBLENBQUEsY0FBQSxDQUFBLElBQUEsQ0MxR2Y7QUQwR0YsV0FBQSxFQUFBLElBQUEsQ0FDUSxLQURSLEdBQUEsQ0MzR0E7QUQwR0YsU0FBQSxNQUFBO0FDdEdFLGlCRDBHQSxLQUFBLGNBQUEsQ0FBQSxJQUFBLENDMUdBO0FEcUdKO0FBQUEsT0FBQSxNQUFBO0FDbEdFLGVEeUdBLEVDekdBO0FBQ0Q7QUQrRks7QUFKVjtBQUFBO0FBQUEsbUNBY2tCLElBZGxCLEVBY2tCO0FBQ1osVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxRQUFBLENBQUEsZ0JBQUEsQ0FBMkIsS0FBQSxRQUFBLENBQXBDLE9BQVMsQ0FBVDtBQUNBLE1BQUEsTUFBTSxDQUFOLElBQUEsR0FBaUIsUUFBQSxJQUFBLE1BQUEsUUFBQSxHQUFBLElBQUEsR0FBdUM7QUFBQyxRQUFBLEtBQUEsRUFBTTtBQUFQLE9BQXhEO0FBQ0EsTUFBQSxNQUFNLENBQU4sV0FBQSxHQUFBLEtBQUE7QUNsR0YsYURtR0UsTUFBTSxDQUFOLFFBQUEsRUNuR0Y7QUQrRmM7QUFkbEI7O0FBQUE7QUFBQSxFQUEwQixRQUFBLENBQTFCLFdBQUEsQ0FBTTs7QUFxQkEsUUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNRO0FBQ0osV0FBQSxJQUFBLEdBQVEsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFBLENBQUEsRUFBQSxNQUFBLEVBQTNCLGNBQTJCLENBQW5CLENBQVI7QUNoR0EsYURpR0EsS0FBQSxJQUFBLEdBQVEsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFBLENBQUEsRUFBQSxNQUFBLEVBQW5CLFVBQW1CLENBQW5CLENDakdSO0FEK0ZJO0FBRFI7QUFBQTtBQUFBLDZCQUlVO0FBQ04sVUFBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUE7O0FBQUEsTUFBQSxLQUFBLEdBQUEsWUFBQTtBQzdGRSxZQUFBLEdBQUEsRUFBQSxJQUFBOztBRDZGTSxZQUFHLENBQUEsT0FBQSxNQUFBLEtBQUEsV0FBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxDQUFBLEtBQUEsR0FBQSxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUMzRkosaUJENEZGLE1BQU0sQ0FBQyxLQzVGTDtBRDJGSSxTQUFBLE1BRUgsSUFBRyxDQUFBLE9BQUEsTUFBQSxLQUFBLFdBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxHQUFBLENBQUEsR0FBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsQ0FBQSxLQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEtBQUgsSUFBQSxFQUFBO0FDM0ZELGlCRDRGRixNQUFNLENBQU4sSUFBQSxDQUFZLEtDNUZWO0FEMkZDLFNBQUEsTUFFQSxJQUFHLENBQUEsT0FBQSxNQUFBLEtBQUEsV0FBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsQ0FBQSxJQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUMzRkQsaUJENEZGLE1BQU0sQ0FBTixNQUFBLENBQWMsS0M1Rlo7QUQyRkMsU0FBQSxNQUVBLElBQUcsT0FBQSxPQUFBLEtBQUEsV0FBQSxJQUFBLE9BQUEsS0FBSCxJQUFBLEVBQUE7QUFDSCxjQUFBO0FDM0ZJLG1CRDRGRixPQUFBLENBQUEsT0FBQSxDQzVGRTtBRDJGSixXQUFBLENBQUEsT0FBQSxLQUFBLEVBQUE7QUFFTSxZQUFBLEVBQUEsR0FBQSxLQUFBO0FBQ0osaUJBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxDQUFBLDhEQUFBO0FDMUZFLG1CRDJGRixJQzNGRTtBRHNGRDtBQ3BGRjtBRDhFSCxPQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQTs7QUFZQSxVQUFHLEtBQUEsSUFBSCxJQUFBLEVBQUE7QUN2RkU7QUR5RkEsUUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFMLGtCQUFBLENBQXlCLEtBQXpCLElBQUEsRUFBZ0MsS0FBdEMsSUFBTSxDQUFOO0FDdkZBLGVEd0ZBLEdBQUcsQ0FBSCxPQUFBLENBQUEsVUFBQSxFQUFBLEdBQUEsQ0N4RkE7QUFDRDtBRHVFSztBQUpWOztBQUFBO0FBQUEsRUFBdUIsUUFBQSxDQUF2QixXQUFBLENBQU07Ozs7Ozs7Ozs7Ozs7Ozs7QUV0d0JOLElBQUEsUUFBQSxHQUFBLE9BQUEsQ0FBQSxZQUFBLENBQUE7O0FBQ0EsSUFBQSxVQUFBLEdBQUEsT0FBQSxDQUFBLGNBQUEsQ0FBQTs7QUFDQSxJQUFBLFlBQUEsR0FBQSxPQUFBLENBQUEsZ0JBQUEsQ0FBQTs7QUFDQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEseUJBQUEsQ0FBQTs7QUFDQSxJQUFBLFdBQUEsR0FBQSxPQUFBLENBQUEsdUJBQUEsQ0FBQTs7QUFDQSxJQUFBLFlBQUEsR0FBQSxPQUFBLENBQUEsNEJBQUEsQ0FBQTs7QUFMQSxJQUFBLGFBQUEsRUFBQSxXQUFBLEVBQUEsWUFBQTs7QUFPQSxJQUFhLG1CQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNkJBQ0ksSUFESixFQUNJO0FBQ1QsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFKLE1BQUEsQ0FBWSxJQUFJLFFBQUEsQ0FBSixPQUFBLENBQW5CLE1BQW1CLENBQVosQ0FBUDtBQ3FCRSxhRG5CRixJQUFJLENBQUosT0FBQSxDQUFhO0FBQ1gsZ0JBQVE7QUFDTixvQkFETSxXQUFBO0FBRU4sMEJBQWUsQ0FGVCxNQUVTLENBRlQ7QUFHTixrQkFBUTtBQUhGLFNBREc7QUFRWCxpQkFBUztBQUNQLG9CQURPLFlBQUE7QUFFUCwwQkFBZSxDQUFBLE1BQUEsRUFGUixTQUVRLENBRlI7QUFHUCxrQkFBUTtBQUhELFNBUkU7QUFlWCxrQkFBVTtBQUNSLG9CQURRLGFBQUE7QUFFUiwwQkFBZSxDQUZQLE1BRU8sQ0FGUDtBQUdSLGtCQUFRO0FBSEE7QUFmQyxPQUFiLENDbUJFO0FEdEJPO0FBREo7O0FBQUE7QUFBQSxHQUFQOzs7O0FBNEJBLFdBQUEsR0FBYyxxQkFBQSxRQUFBLEVBQUE7QUFDWixNQUFBLElBQUEsRUFBQSxVQUFBO0FBQUEsRUFBQSxVQUFBLEdBQWEsUUFBUSxDQUFSLFFBQUEsQ0FBYixhQUFhLEVBQWI7QUFDQSxFQUFBLElBQUEsR0FBTyxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBekIsTUFBeUIsQ0FBbEIsQ0FBUDs7QUFDQSxNQUFBLFVBQUEsRUFBQTtBQ2tCRSxXRGpCQSxVQUFVLENBQVYsUUFBQSxDQUFBLElBQUEsQ0NpQkE7QUFDRDtBRHRCSCxDQUFBOztBQU1BLFlBQUEsR0FBZSxzQkFBQSxRQUFBLEVBQUE7QUFDYixNQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsVUFBQTtBQUFBLEVBQUEsVUFBQSxHQUFhLFFBQVEsQ0FBUixRQUFBLENBQWIsYUFBYSxFQUFiO0FBQ0EsRUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBQSxDQUFBLEVBQXpCLE1BQXlCLENBQWxCLENBQVA7QUFDQSxFQUFBLE9BQUEsR0FBVSxRQUFRLENBQVIsT0FBQSxJQUFvQixRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBaEQsU0FBZ0QsQ0FBbEIsQ0FBOUI7O0FBQ0EsTUFBQSxVQUFBLEVBQUE7QUNxQkUsV0RwQkEsVUFBVSxDQUFWLFNBQUEsQ0FBQSxJQUFBLEVBQUEsT0FBQSxDQ29CQTtBQUNEO0FEMUJILENBQUE7O0FBT0EsYUFBQSxHQUFnQix1QkFBQSxRQUFBLEVBQUE7QUFDZCxNQUFBLElBQUEsRUFBQSxVQUFBO0FBQUEsRUFBQSxVQUFBLEdBQWEsUUFBUSxDQUFSLFFBQUEsQ0FBYixhQUFhLEVBQWI7QUFDQSxFQUFBLElBQUEsR0FBTyxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBekIsTUFBeUIsQ0FBbEIsQ0FBUDs7QUFDQSxNQUFBLFVBQUEsRUFBQTtBQ3dCRSxXRHZCQSxVQUFVLENBQVYsVUFBQSxDQUFBLElBQUEsQ0N1QkE7QUFDRDtBRDVCSCxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FFaERBLElBQUEsUUFBQSxHQUFBLE9BQUEsQ0FBQSxZQUFBLENBQUE7O0FBRUEsSUFBYSxtQkFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDZCQUNJLElBREosRUFDSTtBQUNULFVBQUEsR0FBQSxFQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFJLENBQUosTUFBQSxDQUFZLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBbkIsTUFBbUIsQ0FBWixDQUFQO0FBQ0EsTUFBQSxJQUFJLENBQUosT0FBQSxDQUFhO0FBQ1gsb0JBQVc7QUFDVCxxQkFEUyxZQUFBO0FBRVQsc0JBQWE7QUFBQyxvQkFBTztBQUFSLFdBRko7QUFHVCx5QkFBZ0I7QUFIUDtBQURBLE9BQWI7QUFRQSxNQUFBLEdBQUEsR0FBTSxJQUFJLENBQUosTUFBQSxDQUFZLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBbEIsS0FBa0IsQ0FBWixDQUFOO0FDSUUsYURIRixHQUFHLENBQUgsT0FBQSxDQUFZO0FBQ1Ysb0JBQVc7QUFDVCxxQkFEUyxZQUFBO0FBRVQsc0JBQWE7QUFBQyxvQkFBTztBQUFSLFdBRko7QUFHVCx5QkFBZ0I7QUFIUDtBQURELE9BQVosQ0NHRTtBRGRPO0FBREo7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVGQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsWUFBQSxDQUFBOztBQUVBLElBQWEsaUJBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw2QkFDSSxJQURKLEVBQ0k7QUFDVCxVQUFBLEVBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxJQUFJLENBQUosTUFBQSxDQUFZLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBakIsSUFBaUIsQ0FBWixDQUFMO0FBQ0EsTUFBQSxJQUFJLENBQUosTUFBQSxDQUFZLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBQSxZQUFBLEVBQXlCO0FBQUUsUUFBQSxPQUFBLEVBQVM7QUFBWCxPQUF6QixDQUFaO0FDS0UsYURKRixFQUFFLENBQUYsT0FBQSxDQUFXO0FBQ1QsbUJBRFMsbUJBQUE7QUFFVCxjQUZTLDBCQUFBO0FBR1QsZUFIUyxxREFBQTtBQUlULG9CQUpTLGtDQUFBO0FBS1QsaUJBQVE7QUFBRSxVQUFBLE9BQUEsRUFBUztBQUFYLFNBTEM7QUFNVCxhQUFJO0FBQU0sVUFBQSxPQUFBLEVBQVM7QUFBZixTQU5LO0FBT1QsZUFQUyxpREFBQTtBQVFULGlCQVJTLHdDQUFBO0FBU1QsZ0JBQU87QUFBRyxVQUFBLE9BQUEsRUFBUztBQUFaLFNBVEU7QUFVVCxtQkFBVTtBQUFHLFVBQUEsT0FBQSxFQUFTO0FBQVosU0FWRDtBQVdULGlCQVhTLDhCQUFBO0FBWVQsa0JBWlMsa0RBQUE7QUFhVCxrQkFiUywyQ0FBQTtBQWNULGVBQU07QUFBSSxVQUFBLE9BQUEsRUFBUztBQUFiLFNBZEc7QUFlVCxrQkFBVTtBQWZELE9BQVgsQ0NJRTtBRFBPO0FBREo7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVGQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEseUJBQUEsQ0FBQTs7QUFDQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsWUFBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSwyQkFBQSxDQUFBOztBQUZBLElBQUEsV0FBQTs7QUFJQSxJQUFhLGtCQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNkJBQ0ksSUFESixFQUNJO0FBQ1QsVUFBQSxHQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFJLENBQUosTUFBQSxDQUFZLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBbEIsS0FBa0IsQ0FBWixDQUFOO0FBQ0EsTUFBQSxHQUFHLENBQUgsV0FBQSxDQUFnQixJQUFJLGFBQUEsQ0FBSixZQUFBLENBQWlCO0FBQy9CLFFBQUEsTUFBQSxFQUQrQixXQUFBO0FBRS9CLFFBQUEsTUFBQSxFQUYrQixPQUFBO0FBRy9CLFFBQUEsTUFBQSxFQUgrQixJQUFBO0FBSS9CLFFBQUEsYUFBQSxFQUorQixJQUFBO0FBSy9CLGdCQUFRO0FBTHVCLE9BQWpCLENBQWhCO0FBUUEsTUFBQSxRQUFBLEdBQVcsR0FBRyxDQUFILE1BQUEsQ0FBVyxJQUFJLFFBQUEsQ0FBSixPQUFBLENBQXRCLE9BQXNCLENBQVgsQ0FBWDtBQUNBLE1BQUEsUUFBUSxDQUFSLE9BQUEsQ0FBaUI7QUFDZixvQkFBVztBQUNULGtCQUFTO0FBQ1AsMkJBQWU7QUFDYixjQUFBLE9BQUEsRUFEYSxjQUFBO0FBRWIsY0FBQSxRQUFBLEVBQVU7QUFDUixnQkFBQSxNQUFBLEVBRFEsT0FBQTtBQUVSLGdCQUFBLE1BQUEsRUFGUSxVQUFBO0FBR1IsZ0JBQUEsYUFBQSxFQUFlO0FBSFA7QUFGRztBQURSLFdBREE7QUFXVCxVQUFBLE9BQUEsRUFYUyxrQkFBQTtBQVlULFVBQUEsV0FBQSxFQUFhO0FBWkosU0FESTtBQWVmLGVBQU87QUFDTCxVQUFBLE9BQUEsRUFESyxVQUFBO0FBRUwsVUFBQSxRQUFBLEVBQVU7QUFDUixZQUFBLE1BQUEsRUFEUSxTQUFBO0FBRVIsWUFBQSxNQUFBLEVBQVE7QUFGQTtBQUZMLFNBZlE7QUFzQmYsbUJBdEJlLG1CQUFBO0FBdUJmLFFBQUEsR0FBQSxFQUFLO0FBdkJVLE9BQWpCO0FBMEJBLE1BQUEsUUFBQSxHQUFXLEdBQUcsQ0FBSCxNQUFBLENBQVcsSUFBSSxRQUFBLENBQUosT0FBQSxDQUF0QixPQUFzQixDQUFYLENBQVg7QUNTRSxhRFJGLFFBQVEsQ0FBUixPQUFBLENBQWlCO0FBQ2YsdUJBQWU7QUFBRSxVQUFBLE9BQUEsRUFBUztBQUFYLFNBREE7QUFFZixtQkFGZSxtQkFBQTtBQUdmLGNBSGUsOEJBQUE7QUFJZixnQkFKZSxZQUFBO0FBS2YsZ0JBTGUsUUFBQTtBQU1mLGFBQUk7QUFBSSxVQUFBLE9BQUEsRUFBUztBQUFiLFNBTlc7QUFPZixpQkFBUTtBQUNOLFVBQUEsTUFBQSxFQURNLHVGQUFBO0FBUU4sVUFBQSxRQUFBLEVBQVU7QUFDUixZQUFBLE1BQUEsRUFBUTtBQURBO0FBUkosU0FQTztBQW1CZixhQUFJO0FBQU0sVUFBQSxPQUFBLEVBQVM7QUFBZixTQW5CVztBQW9CZixvQkFBWTtBQUNWLFVBQUEsTUFBQSxFQURVLGtDQUFBO0FBRVYsVUFBQSxRQUFBLEVBQVU7QUFDUixZQUFBLE1BQUEsRUFBUTtBQURBO0FBRkEsU0FwQkc7QUEwQmYsaUJBQVE7QUFBRSxVQUFBLE9BQUEsRUFBUztBQUFYLFNBMUJPO0FBMkJmLGFBQUk7QUFBTSxVQUFBLE9BQUEsRUFBUztBQUFmLFNBM0JXO0FBNEJmLGlCQTVCZSxlQUFBO0FBNkJmLGFBN0JlLFNBQUE7QUE4QmYsZUE5QmUscURBQUE7QUErQmYsbUJBL0JlLHNEQUFBO0FBZ0NmLGdCQUFPO0FBQUcsVUFBQSxPQUFBLEVBQVM7QUFBWixTQWhDUTtBQWlDZixpQkFqQ2Usa0NBQUE7QUFrQ2Ysa0JBQVU7QUFDUixVQUFBLE1BQUEsRUFEUSxvREFBQTtBQUVSLFVBQUEsUUFBQSxFQUFVO0FBQ1IsWUFBQSxNQUFBLEVBQVE7QUFEQTtBQUZGLFNBbENLO0FBd0NmLGtCQXhDZSwrQ0FBQTtBQXlDZixlQUFNO0FBQUksVUFBQSxPQUFBLEVBQVM7QUFBYixTQXpDUztBQTBDZixrQkFBVTtBQUNSLFVBQUEsTUFBQSxFQURRLDZGQUFBO0FBV1IsVUFBQSxRQUFBLEVBQVU7QUFDUixZQUFBLE1BQUEsRUFBUTtBQURBO0FBWEYsU0ExQ0s7QUF5RGYsaUJBQVM7QUFDUCxVQUFBLE9BQUEsRUFETyxZQUFBO0FBRVAsVUFBQSxRQUFBLEVBQVU7QUFDUixZQUFBLE1BQUEsRUFEUSxTQUFBO0FBRVIsWUFBQSxNQUFBLEVBRlEsTUFBQTtBQUdSLFlBQUEsZ0JBQUEsRUFBa0I7QUFIVjtBQUZIO0FBekRNLE9BQWpCLENDUUU7QUQ5Q087QUFESjs7QUFBQTtBQUFBLEdBQVA7Ozs7QUEyR0EsV0FBQSxHQUFjLHFCQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUE7QUFDWixNQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsT0FBQTtBQUFBLEVBQUEsTUFBQSxHQUFTLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQUEsWUFBQSxFQUFsQixRQUFrQixDQUFsQixFQUFULElBQVMsQ0FBVDs7QUFDQSxNQUFBLE1BQUEsRUFBQTtBQUNFLElBQUEsT0FBQSxHQUFBLHdCQUFBO0FBQ0EsSUFBQSxRQUFBLEdBQUEsbUJBQUE7QUFDQSxXQUFPLFdBQVcsTUFBTSxDQUFOLE9BQUEsQ0FBQSxPQUFBLEVBQUEsVUFBQSxFQUFBLE9BQUEsQ0FBQSxRQUFBLEVBQVgsT0FBVyxDQUFYLEdBQVAsS0FBQTtBQUhGLEdBQUEsTUFBQTtBQ2VFLFdEVkEsWUFBWSxhQUFBLENBQUEsWUFBQSxDQUFBLE1BQUEsQ0FBWixNQUFZLENBQVosR0FBMEMsTUNVMUM7QUFDRDtBRGxCSCxDQUFBLEMsQ0EvR0E7QUNxSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0SUEsSUFBQSxTQUFBLEdBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQTs7QUFFQSxJQUFhLGFBQU47QUFBQTtBQUFBO0FBQUE7O0FBQ0wseUJBQWEsU0FBYixFQUFhO0FBQUE7O0FBQUE7O0FDR1g7QURIWSxVQUFBLFNBQUEsR0FBQSxTQUFBO0FBQUQ7QUFBQTs7QUFEUjtBQUFBO0FBQUEsMkJBR0csTUFISCxFQUdHO0FBQ04sYUFBTyxLQUFQLFNBQUE7QUFETTtBQUhIOztBQUFBO0FBQUEsRUFBNEIsU0FBQSxDQUE1QixRQUFBLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUZBLElBQWEsUUFBTjtBQUFBO0FBQUE7QUFDTCxzQkFBYTtBQUFBLFFBQUEsSUFBQSx1RUFBQSxFQUFBOztBQUFBOztBQUFDLFNBQUEsSUFBQSxHQUFBLElBQUE7QUFBRDs7QUFEUjtBQUFBO0FBQUEsMkJBRUcsTUFGSCxFQUVHO0FBQ04sVUFBRyxLQUFBLFFBQUEsQ0FBSCxNQUFHLENBQUgsRUFBQTtBQUNFLFlBQXVCLEtBQUEsSUFBQSxDQUFBLE1BQUEsSUFBdkIsSUFBQSxFQUFBO0FBQUEsaUJBQU8sS0FBQSxJQUFBLENBQVAsTUFBQTtBQURGO0FBQUEsT0FBQSxNQUFBO0FBR0UsWUFBcUIsS0FBQSxJQUFBLFlBQXJCLElBQUEsRUFBQTtBQUFBLGlCQUFPLEtBQVAsSUFBTyxRQUFQO0FBSEY7QUNXQztBRFpLO0FBRkg7QUFBQTtBQUFBLDZCQU9LLE1BUEwsRUFPSyxDQUFBO0FBUEw7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVBQSxJQUFBLFNBQUEsR0FBQSxPQUFBLENBQUEsWUFBQSxDQUFBOztBQUVBLElBQWEsWUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNHLE1BREgsRUFDRztBQUNOLFVBQUEsSUFBQTs7QUFBQSxVQUFHLE1BQUEsQ0FBQSxRQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFOLFFBQUEsQ0FBQSxNQUFBLENBQVAsT0FBTyxFQUFQOztBQUNBLFlBQUcsSUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLElBQUksQ0FBWCxXQUFPLEVBQVA7QUFISjtBQ1FDO0FEVEs7QUFESDs7QUFBQTtBQUFBLEVBQTJCLFNBQUEsQ0FBM0IsUUFBQSxDQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVGQSxJQUFBLEtBQUEsR0FBQSxPQUFBLENBQUEscUJBQUEsQ0FBQTs7QUFDQSxJQUFBLFNBQUEsR0FBQSxPQUFBLENBQUEsWUFBQSxDQUFBOztBQUVBLElBQWEsWUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDZCQUNLLE1BREwsRUFDSztBQUNSLFVBQUEsSUFBQTs7QUFBQSxVQUFHLEtBQUEsSUFBQSxDQUFBLE1BQUEsSUFBQSxJQUFBLElBQWtCLEtBQUEsSUFBQSxDQUFBLE1BQUEsSUFBbEIsSUFBQSxJQUFvQyxNQUFBLENBQUEsUUFBQSxJQUF2QyxJQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFJLEtBQUEsQ0FBSixJQUFBLENBQVMsS0FBQSxJQUFBLENBQVQsTUFBQSxFQUF1QixLQUFBLElBQUEsQ0FBdkIsTUFBQSxFQUFxQyxLQUE1QyxJQUFPLENBQVA7O0FBQ0EsWUFBRyxJQUFJLENBQUosVUFBQSxDQUFnQixNQUFNLENBQU4sUUFBQSxDQUFoQixNQUFnQixFQUFoQixFQUEwQyxNQUFNLENBQU4sUUFBQSxDQUFBLE1BQUEsQ0FBN0MsSUFBNkMsRUFBMUMsQ0FBSCxFQUFBO0FBQ0UsaUJBQUEsSUFBQTtBQUhKO0FDV0M7O0FEUEQsYUFBQSxLQUFBO0FBTFE7QUFETDs7QUFBQTtBQUFBLEVBQTJCLFNBQUEsQ0FBM0IsUUFBQSxDQUFQOzs7Ozs7O0FFSEEsSUFBQSxVQUFBLEdBQUEsT0FBQSxDQUFBLGFBQUEsQ0FBQTs7QUFDQSxJQUFBLGVBQUEsR0FBQSxPQUFBLENBQUEsa0JBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsUUFBQSxDQUFBLE1BQUEsR0FBa0IsVUFBQSxNQUFBLEVBQUE7QUFDaEIsTUFBQSxFQUFBO0FBQUEsRUFBQSxFQUFBLEdBQUssSUFBSSxVQUFBLENBQUosUUFBQSxDQUFhLElBQUksZUFBQSxDQUFKLGNBQUEsQ0FBbEIsTUFBa0IsQ0FBYixDQUFMOztBQUNBLEVBQUEsVUFBQSxDQUFBLFFBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBLEVBQUE7O0FDT0EsU0ROQSxFQ01BO0FEVEYsQ0FBQTs7QUFLQSxVQUFBLENBQUEsUUFBQSxDQUFBLE9BQUEsR0FBQSxPQUFBO0FBRUEsTUFBTSxDQUFOLFFBQUEsR0FBa0IsVUFBQSxDQUFsQixRQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FFVkEsSUFBYSxXQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNEJBQ0ssR0FETCxFQUNLO0FBQ1IsYUFBTyxNQUFNLENBQU4sU0FBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxNQUFQLGdCQUFBO0FBRFE7QUFETDtBQUFBO0FBQUEsMEJBSUcsRUFKSCxFQUlHLEVBSkgsRUFJRztBQ0VOLGFEREEsS0FBQSxNQUFBLENBQVEsRUFBRSxDQUFGLE1BQUEsQ0FBUixFQUFRLENBQVIsQ0NDQTtBREZNO0FBSkg7QUFBQTtBQUFBLDJCQU9JLEtBUEosRUFPSTtBQUNQLFVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxDQUFBLEdBQUksS0FBSyxDQUFULE1BQUksRUFBSjtBQUNBLE1BQUEsQ0FBQSxHQUFBLENBQUE7O0FBQ0EsYUFBTSxDQUFBLEdBQUksQ0FBQyxDQUFYLE1BQUEsRUFBQTtBQUNFLFFBQUEsQ0FBQSxHQUFJLENBQUEsR0FBSixDQUFBOztBQUNBLGVBQU0sQ0FBQSxHQUFJLENBQUMsQ0FBWCxNQUFBLEVBQUE7QUFDRSxjQUFHLENBQUUsQ0FBRixDQUFFLENBQUYsS0FBUSxDQUFFLENBQWIsQ0FBYSxDQUFiLEVBQUE7QUFDRSxZQUFBLENBQUMsQ0FBRCxNQUFBLENBQVMsQ0FBVCxFQUFBLEVBQUEsQ0FBQTtBQ0lEOztBREhELFlBQUEsQ0FBQTtBQUhGOztBQUlBLFVBQUEsQ0FBQTtBQU5GOztBQ2FBLGFETkEsQ0NNQTtBRGhCTztBQVBKOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQUEsSUFBYSxZQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNEJBRUc7QUFBQSx3Q0FBQSxFQUFBO0FBQUEsUUFBQSxFQUFBO0FBQUE7O0FBQ04sVUFBQSxDQUFBLEVBQUEsSUFBQSxJQUFBLEdBQUcsRUFBRSxDQUFMLE1BQUEsR0FBTyxLQUFQLENBQUEsSUFBQSxDQUFBLEVBQUE7QUNBRSxlRENBLEtBQUEsR0FBQSxDQUFBLEVBQUEsRUFBUyxVQUFBLENBQUEsRUFBQTtBQUFPLGNBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBO0FBQXVCLFVBQUEsT0FBQSxHQUFBLEVBQUE7O0FBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNHbkMsWUFBQSxDQUFDLEdBQUcsRUFBRSxDQUFOLENBQU0sQ0FBTjtBQUNBLFlBQUEsT0FBTyxDQUFQLElBQUEsQ0FBYyxZQUFXO0FBQ3ZCLGtCQUFBLFFBQUE7QURMbUIsY0FBQSxRQUFBLEdBQUEsRUFBQTs7QUFBQSxtQkFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBO0FDUWpCLGdCQUFBLENBQUMsR0FBRyxDQUFDLENBQUwsQ0FBSyxDQUFMO0FBQ0EsZ0JBQUEsUUFBUSxDQUFSLElBQUEsQ0RUUSxDQUFFLENBQUYsQ0FBRSxDQUFGLEdBQU8sQ0NTZjtBRFRpQjs7QUNXbkIscUJBQUEsUUFBQTtBQVBGLGFBQWMsRUFBZDtBREptQzs7QUNjckMsaUJBQUEsT0FBQTtBRGRGLFNBQUEsQ0NEQTtBQWlCRDtBRGxCSztBQUZIO0FBQUE7QUFBQSx3QkFNQyxDQU5ELEVBTUMsRUFORCxFQU1DO0FBQ0osTUFBQSxFQUFBLENBQUEsQ0FBQSxDQUFBO0FDa0JBLGFEakJBLENDaUJBO0FEbkJJO0FBTkQ7QUFBQTtBQUFBLGdDQVVTLFdBVlQsRUFVUyxTQVZULEVBVVM7QUNtQlosYURsQkEsU0FBUyxDQUFULE9BQUEsQ0FBbUIsVUFBQSxRQUFELEVBQUE7QUNtQmhCLGVEbEJBLE1BQU0sQ0FBTixtQkFBQSxDQUEyQixRQUFRLENBQW5DLFNBQUEsRUFBQSxPQUFBLENBQXdELFVBQUEsSUFBRCxFQUFBO0FDbUJyRCxpQkRsQkUsTUFBTSxDQUFOLGNBQUEsQ0FBQSxXQUFBLEVBQUEsSUFBQSxFQUF5QyxNQUFNLENBQU4sd0JBQUEsQ0FBZ0MsUUFBUSxDQUF4QyxTQUFBLEVBQXpDLElBQXlDLENBQXpDLENDa0JGO0FEbkJGLFNBQUEsQ0NrQkE7QURuQkYsT0FBQSxDQ2tCQTtBRG5CWTtBQVZUOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQ0EsSUFBYSxlQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsK0JBRVEsUUFGUixFQUVRO0FBQUEsVUFBVSxPQUFWLHVFQUFBLEtBQUE7QUFDWCxVQUFBLEtBQUE7O0FBQUEsVUFBRyxRQUFRLENBQVIsT0FBQSxDQUFBLEdBQUEsTUFBeUIsQ0FBekIsQ0FBQSxJQUFnQyxDQUFuQyxPQUFBLEVBQUE7QUFDRSxlQUFPLENBQUEsSUFBQSxFQUFQLFFBQU8sQ0FBUDtBQ0FEOztBRENELE1BQUEsS0FBQSxHQUFRLFFBQVEsQ0FBUixLQUFBLENBQVIsR0FBUSxDQUFSO0FBQ0EsYUFBTyxDQUFDLEtBQUssQ0FBTixLQUFDLEVBQUQsRUFBZSxLQUFLLENBQUwsSUFBQSxDQUFBLEdBQUEsS0FBdEIsSUFBTyxDQUFQO0FBSlc7QUFGUjtBQUFBO0FBQUEsMEJBUUcsUUFSSCxFQVFHO0FBQ04sVUFBQSxJQUFBLEVBQUEsS0FBQTs7QUFBQSxVQUFHLFFBQVEsQ0FBUixPQUFBLENBQUEsR0FBQSxNQUF5QixDQUE1QixDQUFBLEVBQUE7QUFDRSxlQUFPLENBQUEsSUFBQSxFQUFQLFFBQU8sQ0FBUDtBQ0dEOztBREZELE1BQUEsS0FBQSxHQUFRLFFBQVEsQ0FBUixLQUFBLENBQVIsR0FBUSxDQUFSO0FBQ0EsTUFBQSxJQUFBLEdBQU8sS0FBSyxDQUFaLEdBQU8sRUFBUDtBQ0lBLGFESEEsQ0FBQyxLQUFLLENBQUwsSUFBQSxDQUFELEdBQUMsQ0FBRCxFQUFBLElBQUEsQ0NHQTtBRFJNO0FBUkg7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVBQSxJQUFhLGVBQU47QUFBQTtBQUFBO0FBQ0gsMkJBQWEsSUFBYixFQUFhO0FBQUE7O0FBQUMsU0FBQSxHQUFBLEdBQUEsSUFBQTs7QUFDVixRQUFHLEtBQUEsR0FBQSxJQUFBLElBQUEsSUFBVSxLQUFBLEdBQUEsQ0FBQSxJQUFBLElBQVYsSUFBQSxJQUF5QixLQUFBLEdBQUEsQ0FBQSxNQUFBLElBQTVCLElBQUEsRUFBQTtBQUNJLFdBQUEsR0FBQSxHQUFPLEtBQUEsR0FBQSxDQUFQLE1BQU8sRUFBUDtBQ0NQO0FESFk7O0FBRFY7QUFBQTtBQUFBLHlCQUlHLEVBSkgsRUFJRztBQUNGLFVBQUcsS0FBQSxHQUFBLElBQUEsSUFBQSxJQUFVLEtBQUEsR0FBQSxDQUFBLElBQUEsSUFBYixJQUFBLEVBQUE7QUNJRixlREhNLElBQUEsZUFBQSxDQUFvQixLQUFBLEdBQUEsQ0FBQSxJQUFBLENBQXBCLEVBQW9CLENBQXBCLENDR047QURKRSxPQUFBLE1BQUE7QUNNRixlREhNLElBQUEsZUFBQSxDQUFvQixFQUFBLENBQUcsS0FBdkIsR0FBb0IsQ0FBcEIsQ0NHTjtBQUNEO0FEUks7QUFKSDtBQUFBO0FBQUEsNkJBU0s7QUNPUixhRE5JLEtBQUMsR0NNTDtBRFBRO0FBVEw7O0FBQUE7QUFBQSxHQUFQOzs7O0FBWUEsSUFBTyxlQUFQLEdBQXlCLFNBQWxCLGVBQWtCLENBQUEsR0FBQSxFQUFBO0FDVXZCLFNEVEUsSUFBQSxlQUFBLENBQUEsR0FBQSxDQ1NGO0FEVkYsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFYkEsSUFBYSxVQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNEJBQ0ssR0FETCxFQUNLLElBREwsRUFDSztBQUFBLFVBQVUsR0FBVix1RUFBQSxHQUFBO0FBQ1IsVUFBQSxHQUFBLEVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLElBQUksQ0FBSixLQUFBLENBQVIsR0FBUSxDQUFSO0FBQ0EsTUFBQSxHQUFBLEdBQUEsR0FBQTtBQUNBLE1BQUEsS0FBSyxDQUFMLElBQUEsQ0FBWSxVQUFBLElBQUQsRUFBQTtBQUNULFFBQUEsR0FBQSxHQUFNLEdBQUksQ0FBVixJQUFVLENBQVY7QUNFQSxlRERBLE9BQUEsR0FBQSxLQUFjLFdDQ2Q7QURIRixPQUFBO0FDS0EsYURGQSxHQ0VBO0FEUlE7QUFETDtBQUFBO0FBQUEsNEJBVUssR0FWTCxFQVVLLElBVkwsRUFVSyxHQVZMLEVBVUs7QUFBQSxVQUFjLEdBQWQsdUVBQUEsR0FBQTtBQUNSLFVBQUEsSUFBQSxFQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFJLENBQUosS0FBQSxDQUFSLEdBQVEsQ0FBUjtBQUNBLE1BQUEsSUFBQSxHQUFPLEtBQUssQ0FBWixHQUFPLEVBQVA7QUNJQSxhREhBLEtBQUssQ0FBTCxNQUFBLENBQWEsVUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBO0FBQ1gsWUFBRyxHQUFBLENBQUEsSUFBQSxDQUFBLElBQUgsSUFBQSxFQUFBO0FDSUUsaUJESEEsR0FBSSxDQUFBLElBQUEsQ0NHSjtBREpGLFNBQUEsTUFBQTtBQ01FLGlCREhBLEdBQUksQ0FBSixJQUFJLENBQUosR0FBWSxFQ0daO0FBQ0Q7QURSSCxPQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsSUFLZSxHQ0ZmO0FETlE7QUFWTDs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUFBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxxQkFBQSxDQUFBOztBQUVBLElBQWEsWUFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGtDQUNXLEdBRFgsRUFDVztBQUNkLGFBQU8sR0FBRyxDQUFILE9BQUEsQ0FBQSxXQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxXQUFBLEVBQVAsRUFBTyxDQUFQO0FBRGM7QUFEWDtBQUFBO0FBQUEsaUNBSVUsR0FKVixFQUlVO0FDSWIsYURIQSxHQUFHLENBQUgsT0FBQSxDQUFBLHFDQUFBLEVBQUEsTUFBQSxDQ0dBO0FESmE7QUFKVjtBQUFBO0FBQUEsbUNBT1ksR0FQWixFQU9ZLE1BUFosRUFPWTtBQUNmLFVBQWEsTUFBQSxJQUFiLENBQUEsRUFBQTtBQUFBLGVBQUEsRUFBQTtBQ01DOztBQUNELGFETkEsS0FBQSxDQUFNLElBQUksQ0FBSixJQUFBLENBQVUsTUFBQSxHQUFPLEdBQUcsQ0FBcEIsTUFBQSxJQUFOLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLEVBQUEsU0FBQSxDQUFBLENBQUEsRUFBQSxNQUFBLENDTUE7QURSZTtBQVBaO0FBQUE7QUFBQSwyQkFXSSxHQVhKLEVBV0ksRUFYSixFQVdJO0FDUVAsYURQQSxLQUFBLENBQU0sRUFBQSxHQUFOLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENDT0E7QURSTztBQVhKO0FBQUE7QUFBQSwrQkFjUSxHQWRSLEVBY1E7QUFDWCxVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBRyxDQUFILE9BQUEsQ0FBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsQ0FBUixJQUFRLENBQVI7QUFDQSxNQUFBLENBQUEsR0FBQSxDQUFBOztBQUNBLFdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDVUUsUUFBQSxDQUFDLEdBQUcsS0FBSyxDQUFULENBQVMsQ0FBVDtBRFRBLFFBQUEsQ0FBQSxHQUFJLElBQUksQ0FBSixHQUFBLENBQUEsQ0FBQSxFQUFXLENBQUMsQ0FBaEIsTUFBSSxDQUFKO0FBREY7O0FBRUEsYUFBTyxJQUFJLEtBQUEsQ0FBSixJQUFBLENBQUEsQ0FBQSxFQUFXLEtBQUssQ0FBTCxNQUFBLEdBQWxCLENBQU8sQ0FBUDtBQUxXO0FBZFI7QUFBQTtBQUFBLG1DQXFCWSxJQXJCWixFQXFCWTtBQUFBLFVBQU0sRUFBTix1RUFBQSxDQUFBO0FBQUEsVUFBVyxNQUFYLHVFQUFBLElBQUE7QUFDZixVQUFBLEdBQUE7O0FBQUEsVUFBRyxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxHQUFBLEdBQUEsS0FBQTtBQUNBLGVBQU8sSUFBSSxDQUFKLE9BQUEsQ0FBQSxHQUFBLEVBQWtCLE9BQU8sS0FBQSxNQUFBLENBQUEsTUFBQSxFQUFoQyxFQUFnQyxDQUF6QixDQUFQO0FBRkYsT0FBQSxNQUFBO0FBSUUsZUFBQSxJQUFBO0FDY0Q7QURuQmM7QUFyQlo7QUFBQTtBQUFBLDJCQTRCSSxJQTVCSixFQTRCSTtBQUFBLFVBQU0sRUFBTix1RUFBQSxDQUFBO0FBQUEsVUFBVyxNQUFYLHVFQUFBLElBQUE7O0FBQ1AsVUFBRyxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBTyxNQUFBLEdBQVMsS0FBQSxjQUFBLENBQUEsSUFBQSxFQUFBLEVBQUEsRUFBaEIsTUFBZ0IsQ0FBaEI7QUFERixPQUFBLE1BQUE7QUFHRSxlQUFBLElBQUE7QUNnQkQ7QURwQk07QUE1Qko7QUFBQTtBQUFBLCtCQWtDUSxHQWxDUixFQWtDUTtBQUNYLGFBQU8sR0FBRyxDQUFILEtBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBQSxHQUFBLElBQUEsQ0FBUCxFQUFPLENBQVA7QUFEVztBQWxDUjtBQUFBO0FBQUEsaUNBc0NVLEdBdENWLEVBc0NVO0FBQUEsVUFBTSxVQUFOLHVFQUFBLEdBQUE7QUFDYixVQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBQSx1QkFBQTtBQUNBLE1BQUEsUUFBQSxHQUFXLElBQUEsTUFBQSxDQUFXLEtBQUEsWUFBQSxDQUFYLFVBQVcsQ0FBWCxFQUFYLEdBQVcsQ0FBWDtBQUNBLE1BQUEsUUFBQSxHQUFXLElBQUEsTUFBQSxDQUFXLEtBQUEsWUFBQSxDQUFjLFVBQUEsR0FBekIsVUFBVyxDQUFYLEVBQVgsR0FBVyxDQUFYO0FBQ0EsTUFBQSxLQUFBLEdBQVEsSUFBQSxNQUFBLENBQVcsS0FBQSxZQUFBLENBQVgsR0FBVyxDQUFYLEVBQVIsR0FBUSxDQUFSO0FDbUJBLGFEbEJBLEdBQUcsQ0FBSCxPQUFBLENBQUEsUUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsUUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLENBQUEsS0FBQSxFQUFBLFVBQUEsQ0NrQkE7QUR2QmE7QUF0Q1Y7QUFBQTtBQUFBLDRDQTZDcUIsR0E3Q3JCLEVBNkNxQjtBQUFBLFVBQU0sVUFBTix1RUFBQSxHQUFBO0FBQ3hCLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLEtBQUEsWUFBQSxDQUFBLEdBQUEsRUFBTixVQUFNLENBQU47O0FBQ0EsVUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFILE1BQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxJQUFvQixHQUFHLENBQUgsTUFBQSxDQUFXLEdBQUEsR0FBSSxVQUFVLENBQW5ELE1BQTBCLENBQTFCO0FBQ0EsZUFBTyxDQUFBLEdBQUEsRUFBUCxHQUFPLENBQVA7QUNxQkQ7QUR6QnVCO0FBN0NyQjtBQUFBO0FBQUEsaUNBbURVLEdBbkRWLEVBbURVO0FBQUEsVUFBTSxVQUFOLHVFQUFBLEdBQUE7QUFDYixVQUFBLENBQUEsRUFBQSxRQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBQSxNQUFBLENBQVcsS0FBQSxZQUFBLENBQWMsVUFBQSxHQUF6QixVQUFXLENBQVgsRUFBWCxHQUFXLENBQVg7QUFDQSxNQUFBLEdBQUEsR0FBTSxHQUFHLENBQUgsT0FBQSxDQUFBLFFBQUEsRUFBTixHQUFNLENBQU47O0FBQ0EsVUFBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUgsT0FBQSxDQUFMLFVBQUssQ0FBTCxJQUFnQyxDQUFuQyxDQUFBLEVBQUE7QUFDRSxlQUFBLENBQUE7QUN3QkQ7QUQ1Qlk7QUFuRFY7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVEQSxJQUFBLElBQUEsR0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx5QkFBQSxDQUFBOztBQUNBLElBQUEsVUFBQSxHQUFBLE9BQUEsQ0FBQSxhQUFBLENBQUE7O0FBRUEsSUFBYSxJQUFOO0FBQUE7QUFBQTtBQUNMLGdCQUFhLE1BQWIsRUFBYSxNQUFiLEVBQWE7QUFBQSxRQUFBLE9BQUEsdUVBQUEsRUFBQTs7QUFBQTs7QUFDWCxRQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQURZLFNBQUEsTUFBQSxHQUFBLE1BQUE7QUFBUSxTQUFBLE1BQUEsR0FBQSxNQUFBO0FBQVEsU0FBQSxPQUFBLEdBQUEsT0FBQTtBQUM1QixJQUFBLFFBQUEsR0FBVztBQUNULE1BQUEsYUFBQSxFQURTLEtBQUE7QUFFVCxNQUFBLFVBQUEsRUFBWTtBQUZILEtBQVg7O0FBSUEsU0FBQSxHQUFBLElBQUEsUUFBQSxFQUFBO0FDWUUsTUFBQSxHQUFHLEdBQUcsUUFBUSxDQUFkLEdBQWMsQ0FBZDs7QURYQSxVQUFHLEdBQUEsSUFBTyxLQUFWLE9BQUEsRUFBQTtBQUNFLGFBQUEsR0FBQSxJQUFZLEtBQUEsT0FBQSxDQUFaLEdBQVksQ0FBWjtBQURGLE9BQUEsTUFBQTtBQUdFLGFBQUEsR0FBQSxJQUFBLEdBQUE7QUNhRDtBRGpCSDtBQUxXOztBQURSO0FBQUE7QUFBQSxnQ0FXTTtBQUNULFVBQUcsT0FBTyxLQUFQLE1BQUEsS0FBSCxRQUFBLEVBQUE7QUFDRSxlQUFPLElBQUEsTUFBQSxDQUFXLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixLQUE1QyxNQUFrQixDQUFYLENBQVA7QUFERixPQUFBLE1BQUE7QUFHRSxlQUFPLEtBQVAsTUFBQTtBQ2lCRDtBRHJCUTtBQVhOO0FBQUE7QUFBQSxnQ0FnQk07QUFDVCxVQUFHLE9BQU8sS0FBUCxNQUFBLEtBQUgsUUFBQSxFQUFBO0FBQ0UsZUFBTyxJQUFBLE1BQUEsQ0FBVyxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBMEIsS0FBNUMsTUFBa0IsQ0FBWCxDQUFQO0FBREYsT0FBQSxNQUFBO0FBR0UsZUFBTyxLQUFQLE1BQUE7QUNvQkQ7QUR4QlE7QUFoQk47QUFBQTtBQUFBLG9DQXFCVTtBQUNiLGFBQU87QUFDTCxRQUFBLE1BQUEsRUFBUSxLQURILFNBQ0csRUFESDtBQUVMLFFBQUEsTUFBQSxFQUFRLEtBQUEsU0FBQTtBQUZILE9BQVA7QUFEYTtBQXJCVjtBQUFBO0FBQUEsdUNBMEJhO0FBQ2hCLFVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFBLEVBQUE7QUFDQSxNQUFBLEdBQUEsR0FBQSxLQUFBLGFBQUEsRUFBQTs7QUFBQSxXQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUE7QUMyQkUsUUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFULEdBQVMsQ0FBVDtBRDFCQSxRQUFBLElBQUksQ0FBSixJQUFBLENBQUEsR0FBQTtBQURGOztBQUVBLGFBQUEsSUFBQTtBQUpnQjtBQTFCYjtBQUFBO0FBQUEsa0NBK0JRO0FBQ1gsVUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBLEdBQUEsRUFBQTtBQUNBLE1BQUEsR0FBQSxHQUFBLEtBQUEsYUFBQSxFQUFBOztBQUFBLFdBQUEsR0FBQSxJQUFBLEdBQUEsRUFBQTtBQ2lDRSxRQUFBLEdBQUcsR0FBRyxHQUFHLENBQVQsR0FBUyxDQUFUO0FEaENBLFFBQUEsTUFBTSxDQUFOLElBQUEsQ0FBWSxNQUFJLEdBQUcsQ0FBUCxNQUFBLEdBQVosR0FBQTtBQURGOztBQUVBLGFBQU8sSUFBQSxNQUFBLENBQVcsTUFBTSxDQUFOLElBQUEsQ0FBbEIsR0FBa0IsQ0FBWCxDQUFQO0FBSlc7QUEvQlI7QUFBQTtBQUFBLDZCQW9DSyxJQXBDTCxFQW9DSztBQUFBLFVBQU0sTUFBTix1RUFBQSxDQUFBO0FBQ1IsVUFBQSxLQUFBOztBQUFBLGFBQU0sQ0FBQSxLQUFBLEdBQUEsS0FBQSxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsQ0FBQSxLQUFBLElBQUEsSUFBdUMsQ0FBQyxLQUFLLENBQW5ELEtBQThDLEVBQTlDLEVBQUE7QUFDRSxRQUFBLE1BQUEsR0FBUyxLQUFLLENBQWQsR0FBUyxFQUFUO0FBREY7O0FBRUEsVUFBZ0IsS0FBQSxJQUFBLElBQUEsSUFBVyxLQUFLLENBQWhDLEtBQTJCLEVBQTNCLEVBQUE7QUFBQSxlQUFBLEtBQUE7QUN3Q0M7QUQzQ087QUFwQ0w7QUFBQTtBQUFBLDhCQXdDTSxJQXhDTixFQXdDTTtBQUFBLFVBQU0sTUFBTix1RUFBQSxDQUFBO0FBQ1QsVUFBQSxLQUFBOztBQUFBLFVBQUEsTUFBQSxFQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFKLE1BQUEsQ0FBUCxNQUFPLENBQVA7QUM0Q0Q7O0FEM0NELE1BQUEsS0FBQSxHQUFRLEtBQUEsV0FBQSxHQUFBLElBQUEsQ0FBUixJQUFRLENBQVI7O0FBQ0EsVUFBRyxLQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBTyxJQUFJLFVBQUEsQ0FBSixTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsRUFBUCxNQUFPLENBQVA7QUM2Q0Q7QURsRFE7QUF4Q047QUFBQTtBQUFBLGtDQThDVSxJQTlDVixFQThDVTtBQUNiLGFBQU8sS0FBQSxnQkFBQSxDQUFrQixLQUFBLFFBQUEsQ0FBekIsSUFBeUIsQ0FBbEIsQ0FBUDtBQURhO0FBOUNWO0FBQUE7QUFBQSxpQ0FnRFMsSUFoRFQsRUFnRFM7QUFBQSxVQUFNLE1BQU4sdUVBQUEsQ0FBQTtBQUNaLFVBQUEsS0FBQSxFQUFBLEdBQUE7O0FBQUEsYUFBTSxLQUFBLEdBQVEsS0FBQSxRQUFBLENBQUEsSUFBQSxFQUFkLE1BQWMsQ0FBZCxFQUFBO0FBQ0UsUUFBQSxNQUFBLEdBQVMsS0FBSyxDQUFkLEdBQVMsRUFBVDs7QUFDQSxZQUFHLENBQUEsR0FBQSxJQUFRLEdBQUcsQ0FBSCxHQUFBLE9BQWEsS0FBSyxDQUE3QixHQUF3QixFQUF4QixFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQUEsS0FBQTtBQ21ERDtBRHRESDs7QUFJQSxhQUFBLEdBQUE7QUFMWTtBQWhEVDtBQUFBO0FBQUEsZ0NBc0RNO0FDdURULGFEdERBLEtBQUEsTUFBQSxLQUFXLEtBQVgsTUFBQSxJQUNFLEtBQUEsTUFBQSxDQUFBLE1BQUEsSUFBQSxJQUFBLElBQ0EsS0FBQSxNQUFBLENBQUEsTUFBQSxJQURBLElBQUEsSUFFQSxLQUFBLE1BQUEsQ0FBQSxNQUFBLEtBQWtCLEtBQUEsTUFBQSxDQUFRLE1DbUQ1QjtBRHZEUztBQXRETjtBQUFBO0FBQUEsK0JBNERPLEdBNURQLEVBNERPLElBNURQLEVBNERPO0FBQ1YsVUFBQSxHQUFBLEVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEtBQUEsWUFBQSxDQUFjLElBQUksQ0FBSixNQUFBLENBQUEsQ0FBQSxFQUFjLEdBQUcsQ0FBdkMsS0FBc0IsQ0FBZCxDQUFSOztBQUNBLFVBQUcsS0FBQSxJQUFBLElBQUEsS0FBWSxLQUFBLFNBQUEsTUFBZ0IsS0FBSyxDQUFMLElBQUEsT0FBL0IsUUFBRyxDQUFILEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBTSxLQUFBLFFBQUEsQ0FBQSxJQUFBLEVBQWUsR0FBRyxDQUF4QixHQUFNLENBQU47O0FBQ0EsWUFBRyxHQUFBLElBQUEsSUFBQSxLQUFVLEtBQUEsU0FBQSxNQUFnQixHQUFHLENBQUgsSUFBQSxPQUE3QixRQUFHLENBQUgsRUFBQTtBQUNFLGlCQUFPLElBQUksSUFBQSxDQUFKLEdBQUEsQ0FBUSxLQUFLLENBQWIsS0FBUSxFQUFSLEVBQXNCLEdBQUcsQ0FBaEMsR0FBNkIsRUFBdEIsQ0FBUDtBQURGLFNBQUEsTUFFSyxJQUFHLEtBQUgsYUFBQSxFQUFBO0FBQ0gsaUJBQU8sSUFBSSxJQUFBLENBQUosR0FBQSxDQUFRLEtBQUssQ0FBYixLQUFRLEVBQVIsRUFBc0IsSUFBSSxDQUFqQyxNQUFPLENBQVA7QUFMSjtBQzREQztBRDlEUztBQTVEUDtBQUFBO0FBQUEsK0JBb0VPLEdBcEVQLEVBb0VPLElBcEVQLEVBb0VPO0FBQ1YsYUFBTyxLQUFBLFVBQUEsQ0FBQSxHQUFBLEVBQUEsSUFBQSxLQUFQLElBQUE7QUFEVTtBQXBFUDs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUxBLElBQWEsU0FBTjtBQUFBO0FBQUE7QUFDTCxxQkFBYSxJQUFiLEVBQWEsS0FBYixFQUFhO0FBQUEsUUFBQSxNQUFBLHVFQUFBLENBQUE7O0FBQUE7O0FBQUMsU0FBQSxJQUFBLEdBQUEsSUFBQTtBQUFNLFNBQUEsS0FBQSxHQUFBLEtBQUE7QUFBTyxTQUFBLE1BQUEsR0FBQSxNQUFBO0FBQWQ7O0FBRFI7QUFBQTtBQUFBLDJCQUVDO0FBQ0osVUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7O0FBQUEsVUFBRyxLQUFILEtBQUEsRUFBQTtBQUNFLFlBQU8sT0FBQSxLQUFBLEtBQUEsV0FBQSxJQUFBLEtBQUEsS0FBUCxJQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBQSxLQUFBLEtBQUE7O0FBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTtBQ1FFLFlBQUEsS0FBSyxHQUFHLEdBQUcsQ0FBWCxDQUFXLENBQVg7O0FEUEEsZ0JBQUcsQ0FBQSxHQUFBLENBQUEsSUFBVSxLQUFBLElBQWIsSUFBQSxFQUFBO0FBQ0UsY0FBQSxLQUFBLEdBQVEsS0FBQSxJQUFBLENBQUEsZ0JBQUEsR0FBeUIsQ0FBQSxHQUFqQyxDQUFRLENBQVI7QUFDQSxxQkFBQSxLQUFBO0FDU0Q7QURaSDs7QUFJQSxVQUFBLEtBQUEsR0FBQSxLQUFBO0FDV0Q7O0FEVkQsZUFBTyxLQUFBLElBQVAsSUFBQTtBQ1lEO0FEcEJHO0FBRkQ7QUFBQTtBQUFBLDRCQVdFO0FDZUwsYURkQSxLQUFBLEtBQUEsQ0FBQSxLQUFBLEdBQWUsS0FBQyxNQ2NoQjtBRGZLO0FBWEY7QUFBQTtBQUFBLDBCQWFBO0FDaUJILGFEaEJBLEtBQUEsS0FBQSxDQUFBLEtBQUEsR0FBZSxLQUFBLEtBQUEsQ0FBQSxDQUFBLEVBQWYsTUFBQSxHQUFrQyxLQUFDLE1DZ0JuQztBRGpCRztBQWJBO0FBQUE7QUFBQSw0QkFlRTtBQUNMLGFBQU8sQ0FBQyxLQUFBLElBQUEsQ0FBRCxVQUFBLElBQXFCLEtBQUEsSUFBQSxDQUFBLFVBQUEsQ0FBNUIsSUFBNEIsQ0FBNUI7QUFESztBQWZGO0FBQUE7QUFBQSw2QkFpQkc7QUNxQk4sYURwQkEsS0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFVLE1Db0JWO0FEckJNO0FBakJIOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQUEsSUFBYSxHQUFOO0FBQUE7QUFBQTtBQUNMLGVBQWEsS0FBYixFQUFhLEdBQWIsRUFBYTtBQUFBOztBQUFDLFNBQUEsS0FBQSxHQUFBLEtBQUE7QUFBTyxTQUFBLEdBQUEsR0FBQSxHQUFBOztBQUNuQixRQUFxQixLQUFBLEdBQUEsSUFBckIsSUFBQSxFQUFBO0FBQUEsV0FBQSxHQUFBLEdBQU8sS0FBUCxLQUFBO0FDSUM7QURMVTs7QUFEUjtBQUFBO0FBQUEsK0JBR08sRUFIUCxFQUdPO0FBQ1YsYUFBTyxLQUFBLEtBQUEsSUFBQSxFQUFBLElBQWlCLEVBQUEsSUFBTSxLQUE5QixHQUFBO0FBRFU7QUFIUDtBQUFBO0FBQUEsZ0NBS1EsR0FMUixFQUtRO0FBQ1gsYUFBTyxLQUFBLEtBQUEsSUFBVSxHQUFHLENBQWIsS0FBQSxJQUF3QixHQUFHLENBQUgsR0FBQSxJQUFXLEtBQTFDLEdBQUE7QUFEVztBQUxSO0FBQUE7QUFBQSw4QkFPTSxNQVBOLEVBT00sTUFQTixFQU9NO0FBQ1QsYUFBTyxJQUFJLEdBQUcsQ0FBUCxTQUFBLENBQWtCLEtBQUEsS0FBQSxHQUFPLE1BQU0sQ0FBL0IsTUFBQSxFQUF1QyxLQUF2QyxLQUFBLEVBQThDLEtBQTlDLEdBQUEsRUFBbUQsS0FBQSxHQUFBLEdBQUssTUFBTSxDQUFyRSxNQUFPLENBQVA7QUFEUztBQVBOO0FBQUE7QUFBQSwrQkFTTyxHQVRQLEVBU087QUFDVixXQUFBLE9BQUEsR0FBQSxHQUFBO0FBQ0EsYUFBQSxJQUFBO0FBRlU7QUFUUDtBQUFBO0FBQUEsNkJBWUc7QUFDTixVQUFPLEtBQUEsT0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGNBQU0sSUFBQSxLQUFBLENBQU4sZUFBTSxDQUFOO0FDZUQ7O0FEZEQsYUFBTyxLQUFQLE9BQUE7QUFITTtBQVpIO0FBQUE7QUFBQSxnQ0FnQk07QUFDVCxhQUFPLEtBQUEsT0FBQSxJQUFQLElBQUE7QUFEUztBQWhCTjtBQUFBO0FBQUEsMkJBa0JDO0FDb0JKLGFEbkJBLEtBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBcUIsS0FBckIsS0FBQSxFQUE2QixLQUE3QixHQUFBLENDbUJBO0FEcEJJO0FBbEJEO0FBQUE7QUFBQSxnQ0FvQlEsTUFwQlIsRUFvQlE7QUFDWCxVQUFHLE1BQUEsS0FBSCxDQUFBLEVBQUE7QUFDRSxhQUFBLEtBQUEsSUFBQSxNQUFBO0FBQ0EsYUFBQSxHQUFBLElBQUEsTUFBQTtBQ3NCRDs7QURyQkQsYUFBQSxJQUFBO0FBSlc7QUFwQlI7QUFBQTtBQUFBLDhCQXlCSTtBQUNQLFVBQU8sS0FBQSxRQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsYUFBQSxRQUFBLEdBQVksS0FBQSxNQUFBLEdBQUEsYUFBQSxDQUF3QixLQUFwQyxLQUFZLENBQVo7QUN5QkQ7O0FEeEJELGFBQU8sS0FBUCxRQUFBO0FBSE87QUF6Qko7QUFBQTtBQUFBLDhCQTZCSTtBQUNQLFVBQU8sS0FBQSxRQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsYUFBQSxRQUFBLEdBQVksS0FBQSxNQUFBLEdBQUEsV0FBQSxDQUFzQixLQUFsQyxHQUFZLENBQVo7QUM0QkQ7O0FEM0JELGFBQU8sS0FBUCxRQUFBO0FBSE87QUE3Qko7QUFBQTtBQUFBLHdDQWlDYztBQUNqQixVQUFPLEtBQUEsa0JBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxhQUFBLGtCQUFBLEdBQXNCLEtBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBcUIsS0FBckIsT0FBcUIsRUFBckIsRUFBZ0MsS0FBdEQsT0FBc0QsRUFBaEMsQ0FBdEI7QUMrQkQ7O0FEOUJELGFBQU8sS0FBUCxrQkFBQTtBQUhpQjtBQWpDZDtBQUFBO0FBQUEsc0NBcUNZO0FBQ2YsVUFBTyxLQUFBLGdCQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsYUFBQSxnQkFBQSxHQUFvQixLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLE9BQXFCLEVBQXJCLEVBQWdDLEtBQXBELEtBQW9CLENBQXBCO0FDa0NEOztBRGpDRCxhQUFPLEtBQVAsZ0JBQUE7QUFIZTtBQXJDWjtBQUFBO0FBQUEsc0NBeUNZO0FBQ2YsVUFBTyxLQUFBLGdCQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsYUFBQSxnQkFBQSxHQUFvQixLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLEdBQUEsRUFBMEIsS0FBOUMsT0FBOEMsRUFBMUIsQ0FBcEI7QUNxQ0Q7O0FEcENELGFBQU8sS0FBUCxnQkFBQTtBQUhlO0FBekNaO0FBQUE7QUFBQSwyQkE2Q0M7QUFDSixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFBLEdBQUEsQ0FBUSxLQUFSLEtBQUEsRUFBZSxLQUFyQixHQUFNLENBQU47O0FBQ0EsVUFBRyxLQUFILFNBQUcsRUFBSCxFQUFBO0FBQ0UsUUFBQSxHQUFHLENBQUgsVUFBQSxDQUFlLEtBQWYsTUFBZSxFQUFmO0FDeUNEOztBRHhDRCxhQUFBLEdBQUE7QUFKSTtBQTdDRDtBQUFBO0FBQUEsMEJBa0RBO0FDNENILGFEM0NBLENBQUMsS0FBRCxLQUFBLEVBQVEsS0FBUixHQUFBLENDMkNBO0FENUNHO0FBbERBOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQUEsSUFBQSxTQUFBLEdBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQTs7QUFDQSxJQUFBLFlBQUEsR0FBQSxPQUFBLENBQUEsZUFBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx5QkFBQSxDQUFBOztBQUVBLElBQWEsYUFBTjtBQUFBO0FBQUE7QUFDTCx5QkFBYSxHQUFiLEVBQWE7QUFBQTs7QUFDWCxRQUFHLENBQUMsS0FBSyxDQUFMLE9BQUEsQ0FBSixHQUFJLENBQUosRUFBQTtBQUNFLE1BQUEsR0FBQSxHQUFNLENBQU4sR0FBTSxDQUFOO0FDU0Q7O0FEUkQsSUFBQSxhQUFBLENBQUEsWUFBQSxDQUFBLFdBQUEsQ0FBQSxHQUFBLEVBQTZCLENBQTdCLGFBQTZCLENBQTdCOztBQUNBLFdBQUEsR0FBQTtBQUpXOztBQURSO0FBQUE7QUFBQSx5QkFPQyxNQVBELEVBT0MsTUFQRCxFQU9DO0FBQ0YsYUFBTyxLQUFBLEdBQUEsQ0FBTSxVQUFBLENBQUEsRUFBQTtBQ1diLGVEWG9CLElBQUksU0FBQSxDQUFKLFFBQUEsQ0FBYSxDQUFDLENBQWQsS0FBQSxFQUFzQixDQUFDLENBQXZCLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxDQ1dwQjtBRFhBLE9BQU8sQ0FBUDtBQURFO0FBUEQ7QUFBQTtBQUFBLDRCQVNJLEdBVEosRUFTSTtBQUNMLGFBQU8sS0FBQSxHQUFBLENBQU0sVUFBQSxDQUFBLEVBQUE7QUNlYixlRGZvQixJQUFJLFlBQUEsQ0FBSixXQUFBLENBQWdCLENBQUMsQ0FBakIsS0FBQSxFQUF5QixDQUFDLENBQTFCLEdBQUEsRUFBQSxHQUFBLENDZXBCO0FEZkEsT0FBTyxDQUFQO0FBREs7QUFUSjs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFSkEsSUFBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQTs7QUFDQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEseUJBQUEsQ0FBQTs7QUFDQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEsaUJBQUEsQ0FBQTs7QUFDQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEseUJBQUEsQ0FBQTs7QUFFQSxJQUFhLFdBQUEsR0FBQSxZQUFBO0FBQUEsTUFBTixXQUFNO0FBQUE7QUFBQTtBQUFBOztBQUVYLHlCQUFhLE1BQWIsRUFBYSxHQUFiLEVBQWEsS0FBYixFQUFhO0FBQUE7O0FBQUEsVUFBQSxPQUFBLHVFQUFBLEVBQUE7O0FBQUE7O0FDWVQ7QURaVSxZQUFBLEtBQUEsR0FBQSxNQUFBO0FBQVEsWUFBQSxHQUFBLEdBQUEsR0FBQTtBQUFNLFlBQUEsSUFBQSxHQUFBLEtBQUE7QUFBTyxZQUFBLE9BQUEsR0FBQSxPQUFBOztBQUVqQyxZQUFBLE9BQUEsQ0FBUyxNQUFULE9BQUEsRUFBa0I7QUFDaEIsUUFBQSxNQUFBLEVBRGdCLEVBQUE7QUFFaEIsUUFBQSxNQUFBLEVBRmdCLEVBQUE7QUFHaEIsUUFBQSxVQUFBLEVBQVk7QUFISSxPQUFsQjs7QUFGVztBQUFBOztBQUZGO0FBQUE7QUFBQSwyQ0FTUztBQUNsQixlQUFPLEtBQUEsS0FBQSxHQUFPLEtBQUEsTUFBQSxDQUFQLE1BQUEsR0FBc0IsS0FBQSxJQUFBLENBQTdCLE1BQUE7QUFEa0I7QUFUVDtBQUFBO0FBQUEsK0JBV0g7QUFDTixlQUFPLEtBQUEsS0FBQSxHQUFPLEtBQUEsU0FBQSxHQUFkLE1BQUE7QUFETTtBQVhHO0FBQUE7QUFBQSw4QkFhSjtBQ3NCSCxlRHJCRixLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLEtBQUEsRUFBNkIsS0FBN0IsR0FBQSxFQUFtQyxLQUFuQyxTQUFtQyxFQUFuQyxDQ3FCRTtBRHRCRztBQWJJO0FBQUE7QUFBQSxrQ0FlQTtBQUNULGVBQU8sS0FBQSxTQUFBLE9BQWdCLEtBQXZCLFlBQXVCLEVBQXZCO0FBRFM7QUFmQTtBQUFBO0FBQUEscUNBaUJHO0FBQ1osZUFBTyxLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLEtBQUEsRUFBNkIsS0FBcEMsR0FBTyxDQUFQO0FBRFk7QUFqQkg7QUFBQTtBQUFBLGtDQW1CQTtBQUNULGVBQU8sS0FBQSxNQUFBLEdBQVEsS0FBUixJQUFBLEdBQWMsS0FBckIsTUFBQTtBQURTO0FBbkJBO0FBQUE7QUFBQSxvQ0FxQkU7QUFDWCxlQUFPLEtBQUEsU0FBQSxHQUFBLE1BQUEsSUFBdUIsS0FBQSxHQUFBLEdBQU8sS0FBckMsS0FBTyxDQUFQO0FBRFc7QUFyQkY7QUFBQTtBQUFBLGtDQXVCRSxNQXZCRixFQXVCRTtBQUNYLFlBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTs7QUFBQSxZQUFHLE1BQUEsS0FBSCxDQUFBLEVBQUE7QUFDRSxlQUFBLEtBQUEsSUFBQSxNQUFBO0FBQ0EsZUFBQSxHQUFBLElBQUEsTUFBQTtBQUNBLFVBQUEsR0FBQSxHQUFBLEtBQUEsVUFBQTs7QUFBQSxlQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQ2tDSSxZQUFBLEdBQUcsR0FBRyxHQUFHLENBQVQsQ0FBUyxDQUFUO0FEakNGLFlBQUEsR0FBRyxDQUFILEtBQUEsSUFBQSxNQUFBO0FBQ0EsWUFBQSxHQUFHLENBQUgsR0FBQSxJQUFBLE1BQUE7QUFMSjtBQ3lDRzs7QURuQ0gsZUFBQSxJQUFBO0FBUFc7QUF2QkY7QUFBQTtBQUFBLHNDQStCSTtBQUNiLGFBQUEsVUFBQSxHQUFjLENBQUMsSUFBSSxJQUFBLENBQUosR0FBQSxDQUFRLEtBQUEsTUFBQSxDQUFBLE1BQUEsR0FBZSxLQUF2QixLQUFBLEVBQStCLEtBQUEsTUFBQSxDQUFBLE1BQUEsR0FBZSxLQUFmLEtBQUEsR0FBc0IsS0FBQSxJQUFBLENBQXBFLE1BQWUsQ0FBRCxDQUFkO0FBQ0EsZUFBQSxJQUFBO0FBRmE7QUEvQko7QUFBQTtBQUFBLG9DQWtDRTtBQUNYLFlBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQTtBQUFBLGFBQUEsVUFBQSxHQUFBLEVBQUE7QUFDQSxRQUFBLElBQUEsR0FBTyxLQUFQLFNBQU8sRUFBUDtBQUNBLGFBQUEsTUFBQSxHQUFVLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixLQUFwQyxNQUFVLENBQVY7QUFDQSxhQUFBLElBQUEsR0FBUSxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBMEIsS0FBbEMsSUFBUSxDQUFSO0FBQ0EsYUFBQSxNQUFBLEdBQVUsYUFBQSxDQUFBLFlBQUEsQ0FBQSxZQUFBLENBQTBCLEtBQXBDLE1BQVUsQ0FBVjtBQUNBLFFBQUEsS0FBQSxHQUFRLEtBQVIsS0FBQTs7QUFFQSxlQUFNLENBQUEsR0FBQSxHQUFBLGFBQUEsQ0FBQSxZQUFBLENBQUEsdUJBQUEsQ0FBQSxJQUFBLENBQUEsS0FBTixJQUFBLEVBQUE7QUFBQSxxQkFDRSxHQURGOztBQUFBOztBQUNFLFVBQUEsR0FERjtBQUNFLFVBQUEsSUFERjtBQUVFLGVBQUEsVUFBQSxDQUFBLElBQUEsQ0FBaUIsSUFBSSxJQUFBLENBQUosR0FBQSxDQUFRLEtBQUEsR0FBUixHQUFBLEVBQW1CLEtBQUEsR0FBcEMsR0FBaUIsQ0FBakI7QUFGRjs7QUFJQSxlQUFBLElBQUE7QUFaVztBQWxDRjtBQUFBO0FBQUEsNkJBK0NMO0FBQ0osWUFBQSxHQUFBO0FBQUEsUUFBQSxHQUFBLEdBQU0sSUFBQSxXQUFBLENBQWdCLEtBQWhCLEtBQUEsRUFBd0IsS0FBeEIsR0FBQSxFQUE4QixLQUE5QixJQUFBLEVBQXFDLEtBQTNDLE9BQTJDLEVBQXJDLENBQU47O0FBQ0EsWUFBRyxLQUFILFNBQUcsRUFBSCxFQUFBO0FBQ0UsVUFBQSxHQUFHLENBQUgsVUFBQSxDQUFlLEtBQWYsTUFBZSxFQUFmO0FDNENDOztBRDNDSCxRQUFBLEdBQUcsQ0FBSCxVQUFBLEdBQWlCLEtBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBaUIsVUFBQSxDQUFBLEVBQUE7QUM2QzlCLGlCRDdDbUMsQ0FBQyxDQUFELElBQUEsRUM2Q25DO0FEN0NKLFNBQWlCLENBQWpCO0FBQ0EsZUFBQSxHQUFBO0FBTEk7QUEvQ0s7O0FBQUE7QUFBQSxJQUFvQixJQUFBLENBQTFCLEdBQU07O0FBQU47O0FBQ0wsRUFBQSxhQUFBLENBQUEsWUFBQSxDQUFBLFdBQUEsQ0FBeUIsV0FBSSxDQUE3QixTQUFBLEVBQXdDLENBQUMsYUFBQSxDQUF6QyxZQUF3QyxDQUF4Qzs7QUN3R0EsU0FBQSxXQUFBO0FEekdXLENBQUEsQ0FBQSxJQUFBLENBQUEsS0FBYixDQUFhLENBQWI7Ozs7Ozs7Ozs7Ozs7O0FFTEEsSUFBYSxJQUFOLEdBQ0wsY0FBYSxLQUFiLEVBQWEsTUFBYixFQUFhO0FBQUE7O0FBQUMsT0FBQSxLQUFBLEdBQUEsS0FBQTtBQUFPLE9BQUEsTUFBQSxHQUFBLE1BQUE7QUFBUixDQURmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxJQUFhLE1BQU47QUFBQTtBQUFBO0FBQ0wsa0JBQWEsR0FBYixFQUFhLEdBQWIsRUFBYTtBQUFBOztBQUFDLFNBQUEsR0FBQSxHQUFBLEdBQUE7QUFBSyxTQUFBLEdBQUEsR0FBQSxHQUFBO0FBQU47O0FBRFI7QUFBQTtBQUFBLDBCQUVBO0FDS0gsYURKQSxLQUFBLEdBQUEsR0FBTyxLQUFBLEdBQUEsQ0FBSyxNQ0laO0FETEc7QUFGQTs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUFBLElBQUEsSUFBQSxHQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUE7O0FBRUEsSUFBYSxVQUFOO0FBQUE7QUFBQTtBQUFBOztBQUNMLHNCQUFhLEtBQWIsRUFBYSxVQUFiLEVBQWEsUUFBYixFQUFhLEdBQWIsRUFBYTtBQUFBOztBQUFBOztBQ0dYO0FESFksVUFBQSxLQUFBLEdBQUEsS0FBQTtBQUFPLFVBQUEsVUFBQSxHQUFBLFVBQUE7QUFBWSxVQUFBLFFBQUEsR0FBQSxRQUFBO0FBQVUsVUFBQSxHQUFBLEdBQUEsR0FBQTtBQUE5QjtBQUFBOztBQURSO0FBQUE7QUFBQSxvQ0FHWSxFQUhaLEVBR1k7QUFDZixhQUFPLEtBQUEsVUFBQSxJQUFBLEVBQUEsSUFBc0IsRUFBQSxJQUFNLEtBQW5DLFFBQUE7QUFEZTtBQUhaO0FBQUE7QUFBQSxxQ0FLYSxHQUxiLEVBS2E7QUFDaEIsYUFBTyxLQUFBLFVBQUEsSUFBZSxHQUFHLENBQWxCLEtBQUEsSUFBNkIsR0FBRyxDQUFILEdBQUEsSUFBVyxLQUEvQyxRQUFBO0FBRGdCO0FBTGI7QUFBQTtBQUFBLGdDQU9NO0FDYVQsYURaQSxLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLFVBQUEsRUFBa0MsS0FBbEMsUUFBQSxDQ1lBO0FEYlM7QUFQTjtBQUFBO0FBQUEsZ0NBU1EsR0FUUixFQVNRO0FDZVgsYURkQSxLQUFBLFNBQUEsQ0FBVyxLQUFBLFVBQUEsR0FBWCxHQUFBLENDY0E7QURmVztBQVRSO0FBQUE7QUFBQSwrQkFXTyxFQVhQLEVBV087QUFDVixVQUFBLFNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxLQUFBLEdBQUEsR0FBTyxLQUFuQixRQUFBO0FBQ0EsV0FBQSxRQUFBLEdBQUEsRUFBQTtBQ2tCQSxhRGpCQSxLQUFBLEdBQUEsR0FBTyxLQUFBLFFBQUEsR0FBWSxTQ2lCbkI7QURwQlU7QUFYUDtBQUFBO0FBQUEsMkJBZUM7QUFDSixhQUFPLElBQUEsVUFBQSxDQUFlLEtBQWYsS0FBQSxFQUFzQixLQUF0QixVQUFBLEVBQWtDLEtBQWxDLFFBQUEsRUFBNEMsS0FBbkQsR0FBTyxDQUFQO0FBREk7QUFmRDs7QUFBQTtBQUFBLEVBQXlCLElBQUEsQ0FBekIsR0FBQSxDQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFRkEsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLGVBQUEsQ0FBQTs7QUFFQSxJQUFhLFFBQU47QUFBQTtBQUFBO0FBQUE7O0FBQ0wsb0JBQWEsS0FBYixFQUFhLEdBQWIsRUFBYTtBQUFBOztBQUFBLFFBQWUsTUFBZix1RUFBQSxFQUFBO0FBQUEsUUFBMkIsTUFBM0IsdUVBQUEsRUFBQTtBQUFBLFFBQUEsT0FBQSx1RUFBQSxFQUFBOztBQUFBOztBQ0dYO0FESFksVUFBQSxLQUFBLEdBQUEsS0FBQTtBQUFRLFVBQUEsR0FBQSxHQUFBLEdBQUE7QUFBK0IsVUFBQSxPQUFBLEdBQUEsT0FBQTs7QUFFbkQsVUFBQSxPQUFBLENBQVMsTUFBVCxPQUFBOztBQUNBLFVBQUEsSUFBQSxHQUFBLEVBQUE7QUFDQSxVQUFBLE1BQUEsR0FBQSxNQUFBO0FBQ0EsVUFBQSxNQUFBLEdBQUEsTUFBQTtBQUxXO0FBQUE7O0FBRFI7QUFBQTtBQUFBLDRCQU9FO0FBQ0wsV0FBQSxTQUFBO0FBREY7QUFBTztBQVBGO0FBQUE7QUFBQSxnQ0FVTTtBQUNULFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxZQUFBLEdBQVQsTUFBQTtBQUNBLE1BQUEsR0FBQSxHQUFBLEtBQUEsVUFBQTtBQUFBLE1BQUEsT0FBQSxHQUFBLEVBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNhRSxRQUFBLEdBQUcsR0FBRyxHQUFHLENBQVQsQ0FBUyxDQUFUOztBRFpBLFlBQUcsR0FBRyxDQUFILEtBQUEsR0FBWSxLQUFBLEtBQUEsR0FBTyxLQUFBLE1BQUEsQ0FBdEIsTUFBQSxFQUFBO0FBQ0UsVUFBQSxHQUFHLENBQUgsS0FBQSxJQUFBLE1BQUE7QUNjRDs7QURiRCxZQUFHLEdBQUcsQ0FBSCxHQUFBLElBQVcsS0FBQSxLQUFBLEdBQU8sS0FBQSxNQUFBLENBQXJCLE1BQUEsRUFBQTtBQ2VFLFVBQUEsT0FBTyxDQUFQLElBQUEsQ0RkQSxHQUFHLENBQUgsR0FBQSxJQUFXLE1DY1g7QURmRixTQUFBLE1BQUE7QUNpQkUsVUFBQSxPQUFPLENBQVAsSUFBQSxDQUFhLEtBQWIsQ0FBQTtBQUNEO0FEckJIOztBQ3VCQSxhQUFBLE9BQUE7QUR6QlM7QUFWTjtBQUFBO0FBQUEsZ0NBaUJNO0FBQ1QsVUFBQSxJQUFBOztBQUFBLFVBQUcsS0FBSCxTQUFHLEVBQUgsRUFBQTtBQUNFLFFBQUEsSUFBQSxHQUFPLEtBQVAsWUFBTyxFQUFQO0FBREYsT0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFBLEdBQUEsRUFBQTtBQ3VCRDs7QUR0QkQsYUFBTyxLQUFBLE1BQUEsR0FBQSxJQUFBLEdBQWEsS0FBcEIsTUFBQTtBQUxTO0FBakJOO0FBQUE7QUFBQSxrQ0F1QlE7QUFDWCxhQUFPLEtBQUEsTUFBQSxDQUFBLE1BQUEsR0FBZSxLQUFBLE1BQUEsQ0FBdEIsTUFBQTtBQURXO0FBdkJSO0FBQUE7QUFBQSwyQkEwQkM7QUFDSixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFBLFFBQUEsQ0FBYSxLQUFiLEtBQUEsRUFBcUIsS0FBckIsR0FBQSxFQUEyQixLQUEzQixNQUFBLEVBQW9DLEtBQTFDLE1BQU0sQ0FBTjtBQUNBLE1BQUEsR0FBRyxDQUFILFVBQUEsR0FBaUIsS0FBQSxVQUFBLENBQUEsR0FBQSxDQUFpQixVQUFBLENBQUEsRUFBQTtBQzRCaEMsZUQ1QnFDLENBQUMsQ0FBRCxJQUFBLEVDNEJyQztBRDVCRixPQUFpQixDQUFqQjtBQUNBLGFBQUEsR0FBQTtBQUhJO0FBMUJEOztBQUFBO0FBQUEsRUFBdUIsWUFBQSxDQUF2QixXQUFBLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRURBLElBQWEsa0JBQU47QUFBQTtBQUFBO0FBQ0wsZ0NBQWE7QUFBQTtBQUFBOztBQURSO0FBQUE7QUFBQSx5QkFFQyxHQUZELEVBRUMsR0FGRCxFQUVDO0FBQ0osVUFBRyxPQUFBLFlBQUEsS0FBQSxXQUFBLElBQUEsWUFBQSxLQUFILElBQUEsRUFBQTtBQ0NFLGVEQUEsWUFBWSxDQUFaLE9BQUEsQ0FBcUIsS0FBQSxPQUFBLENBQXJCLEdBQXFCLENBQXJCLEVBQW9DLElBQUksQ0FBSixTQUFBLENBQXBDLEdBQW9DLENBQXBDLENDQUE7QUFDRDtBREhHO0FBRkQ7QUFBQTtBQUFBLCtCQUtPLElBTFAsRUFLTyxHQUxQLEVBS08sR0FMUCxFQUtPO0FBQ1YsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sS0FBQSxJQUFBLENBQVAsSUFBTyxDQUFQOztBQUNBLFVBQU8sSUFBQSxJQUFQLElBQUEsRUFBQTtBQUNFLFFBQUEsSUFBQSxHQUFBLEVBQUE7QUNLRDs7QURKRCxNQUFBLElBQUssQ0FBTCxHQUFLLENBQUwsR0FBQSxHQUFBO0FDTUEsYURMQSxLQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQ0tBO0FEVlU7QUFMUDtBQUFBO0FBQUEseUJBV0MsR0FYRCxFQVdDO0FBQ0osVUFBRyxPQUFBLFlBQUEsS0FBQSxXQUFBLElBQUEsWUFBQSxLQUFILElBQUEsRUFBQTtBQ1FFLGVEUEEsSUFBSSxDQUFKLEtBQUEsQ0FBVyxZQUFZLENBQVosT0FBQSxDQUFxQixLQUFBLE9BQUEsQ0FBaEMsR0FBZ0MsQ0FBckIsQ0FBWCxDQ09BO0FBQ0Q7QURWRztBQVhEO0FBQUE7QUFBQSw0QkFjSSxHQWRKLEVBY0k7QUNXUCxhRFZBLGNBQVksR0NVWjtBRFhPO0FBZEo7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVBQSxJQUFhLE9BQU47QUFBQTtBQUFBO0FBQ0wsbUJBQWEsTUFBYixFQUFhLE1BQWIsRUFBYTtBQUFBOztBQUFDLFNBQUEsTUFBQSxHQUFBLE1BQUE7QUFBUyxTQUFBLE1BQUEsR0FBQSxNQUFBO0FBQ3JCLFNBQUEsT0FBQSxHQUFBLEVBQUE7QUFEVzs7QUFEUjtBQUFBO0FBQUEsOEJBSUk7QUNHUCxhREZBLEtBQUEsT0FBQSxHQUFXLEtBQUEsTUFBQSxDQUFRLEdDRW5CO0FESE87QUFKSjtBQUFBO0FBQUEsMkJBT0csS0FQSCxFQU9HLENBQUE7QUFQSDtBQUFBO0FBQUEsMEJBU0E7QUNJSCxhREhBLEtBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBbUIsS0FBbkIsTUFBQSxDQ0dBO0FESkc7QUFUQTtBQUFBO0FBQUEsNEJBWUUsQ0FBQTtBQVpGO0FBQUE7QUFBQSxnQ0FjUSxXQWRSLEVBY1E7QUFDWCxVQUFHLFdBQVcsQ0FBWCxJQUFBLENBQWlCLEtBQWpCLE1BQWlCLFFBQWpCLEVBQUgsSUFBRyxDQUFILEVBQUE7QUNLRSxlREpBLEtBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBbUIsSUFBQSxXQUFBLENBQWdCLEtBQWhCLE1BQUEsRUFBbkIsSUFBbUIsQ0FBbkIsQ0NJQTtBQUNEO0FEUFU7QUFkUjtBQUFBO0FBQUEsMkJBa0JFO0FDT0wsYURQUSxLQ09SO0FEUEs7QUFsQkY7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVEQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsV0FBQSxDQUFBOztBQUVBLElBQWEsYUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNHLEtBREgsRUFDRztBQUNOLFdBQUEsTUFBQSxDQUFBLE9BQUEsSUFBQSxLQUFBO0FDR0EsYURGQSxLQUFBLEdBQUEsRUNFQTtBREpNO0FBREg7QUFBQTtBQUFBLHlCQUtFLE1BTEYsRUFLRTtBQ0lMLGFESEEsTUFBQSxLQUFRLElDR1I7QURKSztBQUxGOztBQUFBO0FBQUEsRUFBNEIsUUFBQSxDQUE1QixPQUFBLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUZBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSxnQkFBQSxDQUFBOztBQUFBLElBQUEsT0FBQSxHQUFBLEdBQUEsT0FBQTs7QUFFQSxJQUFhLFlBQU47QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw4QkFDSTtBQ0tQLGFESkEsS0FBQSxJQUFBLEdBQVEsS0FBQSxNQUFBLENBQVEsT0NJaEI7QURMTztBQURKO0FBQUE7QUFBQSw0QkFJRTtBQ01MLGFETEEsS0FBQSxNQUFBLENBQUEsS0FBQSxDQUFjLEtBQWQsSUFBQSxJQUF1QixLQUFDLE9DS3hCO0FETks7QUFKRjtBQUFBO0FBQUEseUJBT0UsS0FQRixFQU9FLE1BUEYsRUFPRTtBQUNMLFVBQUEsR0FBQTtBQ09BLGFEUEEsS0FBQSxLQUFBLEdBQUEsS0FBa0IsTUFBQSxDQUFBLE1BQUEsQ0FBQSxPQUFBLENBQUEsWUFBQSxJQUFBLElBQUEsS0FBdUMsR0FBQSxHQUFBLE1BQU0sQ0FBTixPQUFBLEVBQUEsT0FBQSxDQUFBLElBQUEsQ0FBa0IsTUFBTSxDQUFOLE1BQUEsQ0FBQSxPQUFBLENBQWxCLFlBQUEsRUFBQSxHQUFBLEtBQXpELENBQWtCLENBQWxCLENDT0E7QURSSztBQVBGOztBQUFBO0FBQUEsRUFBMkIsYUFBQSxDQUEzQixZQUFBLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUZBLElBQUEsUUFBQSxHQUFBLE9BQUEsQ0FBQSxXQUFBLENBQUE7O0FBQ0EsSUFBQSxjQUFBLEdBQUEsT0FBQSxDQUFBLGlCQUFBLENBQUE7O0FBQ0EsSUFBQSxnQkFBQSxHQUFBLE9BQUEsQ0FBQSxtQkFBQSxDQUFBOztBQUVBLElBQWEsWUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNHLEtBREgsRUFDRztBQUNOLFVBQUcsS0FBQSxXQUFBLENBQWEsY0FBQSxDQUFoQixhQUFHLENBQUgsRUFBQSxDQUFBLENBQUEsTUFDSyxJQUFHLEtBQUEsV0FBQSxDQUFhLFlBQVksQ0FBNUIsS0FBRyxDQUFILEVBQUEsQ0FBQSxDQUFBLE1BQ0EsSUFBRyxLQUFBLFdBQUEsQ0FBYSxnQkFBQSxDQUFoQixlQUFHLENBQUgsRUFBQSxDQUFBLENBQUEsTUFDQSxJQUFHLEtBQUEsS0FBSCxHQUFBLEVBQUE7QUNZSCxlRFhBLEtBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBbUIsSUFBQSxZQUFBLENBQWlCLEtBQXBDLE1BQW1CLENBQW5CLENDV0E7QURaRyxPQUFBLE1BQUE7QUNjSCxlRFhBLEtBQUEsT0FBQSxJQUFZLEtDV1o7QUFDRDtBRG5CSztBQURIO0FBQUE7QUFBQSw0QkFVRTtBQ2NMLGFEYkEsS0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsQ0FBb0IsS0FBcEIsT0FBQSxDQ2FBO0FEZEs7QUFWRjs7QUFBQTtBQUFBLEVBQTJCLFFBQUEsQ0FBM0IsT0FBQSxDQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVKQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEsZ0JBQUEsQ0FBQTs7QUFDQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEsZ0JBQUEsQ0FBQTs7QUFFQSxhQUFBLENBQUEsWUFBQSxDQUFBLEtBQUEsR0FBcUIsYUFBQSxDQUFyQixZQUFBOztBQUVBLElBQWEsV0FBTjtBQUFBO0FBQUE7QUFDTCx1QkFBYSxXQUFiLEVBQWE7QUFBQSxRQUFBLE9BQUEsdUVBQUEsRUFBQTs7QUFBQTs7QUFBQyxTQUFBLFdBQUEsR0FBQSxXQUFBO0FBQWMsU0FBQSxPQUFBLEdBQUEsT0FBQTtBQUMxQixTQUFBLEtBQUE7QUFEVzs7QUFEUjtBQUFBO0FBQUEsK0JBSU8sT0FKUCxFQUlPO0FBQ1YsVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsS0FBYixPQUFBO0FBQ0EsV0FBQSxPQUFBLEdBQUEsT0FBQTs7QUFDQSxVQUFHLFVBQUEsSUFBQSxJQUFBLElBQWdCLFVBQUEsTUFBQSxPQUFBLElBQUEsSUFBQSxHQUFjLE9BQU8sQ0FBckIsTUFBQSxHQUF1QixLQUExQyxDQUFtQixDQUFuQixFQUFBO0FBQ0UsUUFBQSxVQUFVLENBQVYsS0FBQTtBQ1VEOztBRFRELFVBQUcsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsT0FBTyxDQUFQLE9BQUE7QUNXRDs7QUFDRCxhRFhBLEtBQUMsT0NXRDtBRGxCVTtBQUpQO0FBQUE7QUFBQSw0QkFhRTtBQUNMLFdBQUEsTUFBQSxHQUFBLEVBQUE7QUFDQSxXQUFBLEtBQUEsR0FBQSxFQUFBOztBQUNBLFVBQUcsS0FBQSxXQUFBLENBQUgsTUFBQSxFQUFBO0FBQ0UsYUFBQSxVQUFBLENBQVksSUFBSSxhQUFBLENBQUosWUFBQSxDQUFaLElBQVksQ0FBWjtBQUNBLGFBQUEsR0FBQSxHQUFBLENBQUE7O0FBQ0EsZUFBTSxLQUFBLEdBQUEsR0FBTyxLQUFBLFdBQUEsQ0FBYixNQUFBLEVBQUE7QUFDRSx5QkFBUSxLQUFBLFdBQUEsQ0FBYSxLQUFyQixHQUFRLENBQVI7QUFDQSxlQUFBLE9BQUEsQ0FBQSxNQUFBLENBQUEsWUFBQTtBQUNBLGVBQUEsR0FBQTtBQUhGOztBQ2lCQSxlRGJBLEtBQUEsVUFBQSxDQUFBLElBQUEsQ0NhQTtBQUNEO0FEeEJJO0FBYkY7QUFBQTtBQUFBLHlCQXlCQSxFQXpCQSxFQXlCQTtBQ2dCSCxhRGZBLEtBQUEsV0FBQSxDQUFBLFNBQUEsQ0FBdUIsS0FBdkIsR0FBQSxFQUE2QixLQUFBLEdBQUEsR0FBN0IsRUFBQSxDQ2VBO0FEaEJHO0FBekJBO0FBQUE7QUFBQSwyQkE0QkE7QUFBQSxVQUFDLEVBQUQsdUVBQUEsQ0FBQTtBQ2lCSCxhRGhCQSxLQUFBLEdBQUEsSUFBUSxFQ2dCUjtBRGpCRztBQTVCQTs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUxBLElBQUEsUUFBQSxHQUFBLE9BQUEsQ0FBQSxXQUFBLENBQUE7O0FBQ0EsSUFBQSxjQUFBLEdBQUEsT0FBQSxDQUFBLGlCQUFBLENBQUE7O0FBQ0EsSUFBQSxnQkFBQSxHQUFBLE9BQUEsQ0FBQSxtQkFBQSxDQUFBOztBQUVBLElBQWEsYUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNHLEtBREgsRUFDRztBQUNOLFVBQUcsS0FBQSxXQUFBLENBQWEsY0FBQSxDQUFoQixhQUFHLENBQUgsRUFBQSxDQUFBLENBQUEsTUFDSyxJQUFHLEtBQUEsV0FBQSxDQUFhLGdCQUFBLENBQWhCLGVBQUcsQ0FBSCxFQUFBLENBQUEsQ0FBQSxNQUNBLElBQUcsYUFBYSxDQUFiLFdBQUEsQ0FBSCxLQUFHLENBQUgsRUFBQTtBQ1dILGVEVkEsS0FBQSxHQUFBLEVDVUE7QURYRyxPQUFBLE1BQUE7QUNhSCxlRFZBLEtBQUEsT0FBQSxJQUFZLEtDVVo7QUFDRDtBRGpCSztBQURIO0FBQUE7QUFBQSw0QkFTRTtBQ2FMLGFEWkEsS0FBQSxNQUFBLENBQUEsT0FBQSxJQUFtQixLQUFDLE9DWXBCO0FEYks7QUFURjtBQUFBO0FBQUEseUJBWUUsTUFaRixFQVlFO0FDY0wsYURiQSxLQUFBLFdBQUEsQ0FBQSxNQUFBLENDYUE7QURkSztBQVpGO0FBQUE7QUFBQSxnQ0FlVSxNQWZWLEVBZVU7QUNlYixhRGRBLE1BQUEsS0FBQSxHQUFBLElBQUEsTUFBQSxLQUFhLEdDY2I7QURmYTtBQWZWOztBQUFBO0FBQUEsRUFBNEIsUUFBQSxDQUE1QixPQUFBLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUpBLElBQUEsUUFBQSxHQUFBLE9BQUEsQ0FBQSxXQUFBLENBQUE7O0FBRUEsSUFBYSxlQUFOO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsOEJBQ0k7QUNHUCxhREZBLEtBQUEsTUFBQSxDQUFBLElBQUEsRUNFQTtBREhPO0FBREo7QUFBQTtBQUFBLDJCQUlHLEtBSkgsRUFJRztBQUNOLFVBQUcsS0FBQSxLQUFILEdBQUEsRUFBQTtBQ0lFLGVESEEsS0FBQSxHQUFBLEVDR0E7QURKRixPQUFBLE1BQUE7QUNNRSxlREhBLEtBQUEsT0FBQSxJQUFZLEtDR1o7QUFDRDtBRFJLO0FBSkg7QUFBQTtBQUFBLDRCQVVFO0FBQ0wsVUFBQSxHQUFBO0FDTUEsYUROQSxLQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLE1BQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxLQUFBLElBQUEsR0FBQSxHQUF5QyxDQUFBLEtBQXpDLE9BQXlDLENBQXpDLEdBQXlDLEtBQXpDLENBQUEsS0FBc0QsRUNNdEQ7QURQSztBQVZGO0FBQUE7QUFBQSx5QkFhRSxNQWJGLEVBYUUsTUFiRixFQWFFO0FDUUwsYURQQSxNQUFNLENBQU4sTUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLE1BQXlCLElDT3pCO0FEUks7QUFiRjs7QUFBQTtBQUFBLEVBQThCLFFBQUEsQ0FBOUIsT0FBQSxDQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5pbXBvcnQgeyBQYWlyIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9QYWlyJztcblxuZXhwb3J0IGNsYXNzIEJveEhlbHBlclxuICBjb25zdHJ1Y3RvcjogKEBjb250ZXh0LCBvcHRpb25zID0ge30pIC0+XG4gICAgQGRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogQGNvbnRleHQuY29kZXdhdmUuZGVjb1xuICAgICAgcGFkOiAyXG4gICAgICB3aWR0aDogNTBcbiAgICAgIGhlaWdodDogM1xuICAgICAgb3BlblRleHQ6ICcnXG4gICAgICBjbG9zZVRleHQ6ICcnXG4gICAgICBwcmVmaXg6ICcnXG4gICAgICBzdWZmaXg6ICcnXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICBjbG9uZTogKHRleHQpIC0+XG4gICAgb3B0ID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XVxuICAgIHJldHVybiBuZXcgQm94SGVscGVyKEBjb250ZXh0LG9wdClcbiAgZHJhdzogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBzdGFydFNlcCgpICsgXCJcXG5cIiArIEBsaW5lcyh0ZXh0KSArIFwiXFxuXCIrIEBlbmRTZXAoKVxuICB3cmFwQ29tbWVudDogKHN0cikgLT5cbiAgICByZXR1cm4gQGNvbnRleHQud3JhcENvbW1lbnQoc3RyKVxuICBzZXBhcmF0b3I6IC0+XG4gICAgbGVuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAZGVjb0xpbmUobGVuKSlcbiAgc3RhcnRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAb3BlblRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEBwcmVmaXggKyBAd3JhcENvbW1lbnQoQG9wZW5UZXh0K0BkZWNvTGluZShsbikpXG4gIGVuZFNlcDogLT5cbiAgICBsbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aCAtIEBjbG9zZVRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAY2xvc2VUZXh0K0BkZWNvTGluZShsbikpICsgQHN1ZmZpeFxuICBkZWNvTGluZTogKGxlbikgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKEBkZWNvLCBsZW4pXG4gIHBhZGRpbmc6IC0+IFxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIEBwYWQpXG4gIGxpbmVzOiAodGV4dCA9ICcnLCB1cHRvSGVpZ2h0PXRydWUpIC0+XG4gICAgdGV4dCA9IHRleHQgb3IgJydcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKVxuICAgIGlmIHVwdG9IZWlnaHRcbiAgICAgIHJldHVybiAoQGxpbmUobGluZXNbeF0gb3IgJycpIGZvciB4IGluIFswLi5AaGVpZ2h0XSkuam9pbignXFxuJykgXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIChAbGluZShsKSBmb3IgbCBpbiBsaW5lcykuam9pbignXFxuJykgXG4gIGxpbmU6ICh0ZXh0ID0gJycpIC0+XG4gICAgcmV0dXJuIChTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsQGluZGVudCkgK1xuICAgICAgQHdyYXBDb21tZW50KFxuICAgICAgICBAZGVjbyArXG4gICAgICAgIEBwYWRkaW5nKCkgK1xuICAgICAgICB0ZXh0ICtcbiAgICAgICAgU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCBAd2lkdGggLSBAcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkubGVuZ3RoKSArIFxuICAgICAgICBAcGFkZGluZygpICtcbiAgICAgICAgQGRlY29cbiAgICAgICkpXG4gIGxlZnQ6IC0+XG4gICAgQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KEBkZWNvICsgQHBhZGRpbmcoKSlcbiAgcmlnaHQ6IC0+XG4gICAgQGNvbnRleHQud3JhcENvbW1lbnRSaWdodChAcGFkZGluZygpICsgQGRlY28pXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50OiAodGV4dCkgLT5cbiAgICByZXR1cm4gQGNvbnRleHQuY29kZXdhdmUucmVtb3ZlTWFya2VycyhAY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpXG4gIHRleHRCb3VuZHM6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0VHh0U2l6ZShAcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpXG4gIGdldEJveEZvclBvczogKHBvcykgLT5cbiAgICBkZXB0aCA9IEBnZXROZXN0ZWRMdmwocG9zLnN0YXJ0KVxuICAgIGlmIGRlcHRoID4gMFxuICAgICAgbGVmdCA9IEBsZWZ0KClcbiAgICAgIGN1ckxlZnQgPSBTdHJpbmdIZWxwZXIucmVwZWF0KGxlZnQsZGVwdGgtMSlcbiAgICAgIFxuICAgICAgY2xvbmUgPSBAY2xvbmUoKVxuICAgICAgcGxhY2Vob2xkZXIgPSBcIiMjI1BsYWNlSG9sZGVyIyMjXCJcbiAgICAgIGNsb25lLndpZHRoID0gcGxhY2Vob2xkZXIubGVuZ3RoXG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IEBkZWNvICsgQGRlY28gKyBwbGFjZWhvbGRlciArIEBkZWNvICsgQGRlY29cbiAgICAgIFxuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsJy4qJykpXG4gICAgICBlbmRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLmVuZFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgXG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLGVuZEZpbmQse1xuICAgICAgICB2YWxpZE1hdGNoOiAobWF0Y2gpPT5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nKG1hdGNoLGxlZnQpXG4gICAgICAgICAgZiA9IEBjb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KG1hdGNoLnN0YXJ0KCkgLFtsZWZ0LFwiXFxuXCIsXCJcXHJcIl0sLTEpXG4gICAgICAgICAgcmV0dXJuICFmPyBvciBmLnN0ciAhPSBsZWZ0XG4gICAgICB9KVxuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcyxAY29udGV4dC5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKVxuICAgICAgaWYgcmVzP1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIFxuICBnZXROZXN0ZWRMdmw6IChpbmRleCkgLT5cbiAgICBkZXB0aCA9IDBcbiAgICBsZWZ0ID0gQGxlZnQoKVxuICAgIHdoaWxlIChmID0gQGNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQoaW5kZXggLFtsZWZ0LFwiXFxuXCIsXCJcXHJcIl0sLTEpKT8gJiYgZi5zdHIgPT0gbGVmdFxuICAgICAgaW5kZXggPSBmLnBvc1xuICAgICAgZGVwdGgrK1xuICAgIHJldHVybiBkZXB0aFxuICBnZXRPcHRGcm9tTGluZTogKGxpbmUsZ2V0UGFkPXRydWUpIC0+XG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KEBkZWNvKSkrXCIpKFxcXFxzKilcIilcbiAgICByRW5kID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodChAZGVjbykpK1wiKShcXG58JClcIilcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpXG4gICAgcmVzRW5kID0gckVuZC5leGVjKGxpbmUpXG4gICAgaWYgcmVzU3RhcnQ/IGFuZCByZXNFbmQ/XG4gICAgICBpZiBnZXRQYWRcbiAgICAgICAgQHBhZCA9IE1hdGgubWluKHJlc1N0YXJ0WzNdLmxlbmd0aCxyZXNFbmRbMV0ubGVuZ3RoKVxuICAgICAgQGluZGVudCA9IHJlc1N0YXJ0WzFdLmxlbmd0aFxuICAgICAgc3RhcnRQb3MgPSByZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCArIEBwYWRcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSBAcGFkXG4gICAgICBAd2lkdGggPSBlbmRQb3MgLSBzdGFydFBvc1xuICAgIHJldHVybiB0aGlzXG4gIHJlZm9ybWF0TGluZXM6ICh0ZXh0LG9wdGlvbnM9e30pIC0+XG4gICAgcmV0dXJuIEBsaW5lcyhAcmVtb3ZlQ29tbWVudCh0ZXh0LG9wdGlvbnMpLGZhbHNlKVxuICByZW1vdmVDb21tZW50OiAodGV4dCxvcHRpb25zPXt9KS0+XG4gICAgaWYgdGV4dD9cbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH1cbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24oe30sZGVmYXVsdHMsb3B0aW9ucylcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAZGVjbylcbiAgICAgIGZsYWcgPSBpZiBvcHRpb25zWydtdWx0aWxpbmUnXSB0aGVuICdnbScgZWxzZSAnJ1xuICAgICAgcmUxID0gbmV3IFJlZ0V4cChcIl5cXFxccyoje2VjbH0oPzoje2VkfSkqXFxcXHN7MCwje0BwYWR9fVwiLCBmbGFnKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChcIlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXFxccyokXCIsIGZsYWcpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlMSwnJykucmVwbGFjZShyZTIsJycpXG4gICBcbiAgIiwiaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBBcnJheUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYWlyXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCB2YXIgQm94SGVscGVyID0gY2xhc3MgQm94SGVscGVyIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGtleSwgcmVmLCB2YWw7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogdGhpcy5jb250ZXh0LmNvZGV3YXZlLmRlY28sXG4gICAgICBwYWQ6IDIsXG4gICAgICB3aWR0aDogNTAsXG4gICAgICBoZWlnaHQ6IDMsXG4gICAgICBvcGVuVGV4dDogJycsXG4gICAgICBjbG9zZVRleHQ6ICcnLFxuICAgICAgcHJlZml4OiAnJyxcbiAgICAgIHN1ZmZpeDogJycsXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvbmUodGV4dCkge1xuICAgIHZhciBrZXksIG9wdCwgcmVmLCB2YWw7XG4gICAgb3B0ID0ge307XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgb3B0W2tleV0gPSB0aGlzW2tleV07XG4gICAgfVxuICAgIHJldHVybiBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dCwgb3B0KTtcbiAgfVxuXG4gIGRyYXcodGV4dCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0U2VwKCkgKyBcIlxcblwiICsgdGhpcy5saW5lcyh0ZXh0KSArIFwiXFxuXCIgKyB0aGlzLmVuZFNlcCgpO1xuICB9XG5cbiAgd3JhcENvbW1lbnQoc3RyKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudChzdHIpO1xuICB9XG5cbiAgc2VwYXJhdG9yKCkge1xuICAgIHZhciBsZW47XG4gICAgbGVuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjb0xpbmUobGVuKSk7XG4gIH1cblxuICBzdGFydFNlcCgpIHtcbiAgICB2YXIgbG47XG4gICAgbG4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGggLSB0aGlzLm9wZW5UZXh0Lmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLndyYXBDb21tZW50KHRoaXMub3BlblRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSk7XG4gIH1cblxuICBlbmRTZXAoKSB7XG4gICAgdmFyIGxuO1xuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5jbG9zZVRleHQubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLndyYXBDb21tZW50KHRoaXMuY2xvc2VUZXh0ICsgdGhpcy5kZWNvTGluZShsbikpICsgdGhpcy5zdWZmaXg7XG4gIH1cblxuICBkZWNvTGluZShsZW4pIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKHRoaXMuZGVjbywgbGVuKTtcbiAgfVxuXG4gIHBhZGRpbmcoKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy5wYWQpO1xuICB9XG5cbiAgbGluZXModGV4dCA9ICcnLCB1cHRvSGVpZ2h0ID0gdHJ1ZSkge1xuICAgIHZhciBsLCBsaW5lcywgeDtcbiAgICB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKTtcbiAgICBpZiAodXB0b0hlaWdodCkge1xuICAgICAgcmV0dXJuICgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLCByZWYsIHJlc3VsdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yICh4ID0gaSA9IDAsIHJlZiA9IHRoaXMuaGVpZ2h0OyAoMCA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmKTsgeCA9IDAgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsaW5lc1t4XSB8fCAnJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSkuY2FsbCh0aGlzKSkuam9pbignXFxuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSwgbGVuMSwgcmVzdWx0cztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4xID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuMTsgaSsrKSB7XG4gICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSkuY2FsbCh0aGlzKSkuam9pbignXFxuJyk7XG4gICAgfVxuICB9XG5cbiAgbGluZSh0ZXh0ID0gJycpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLmluZGVudCkgKyB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpICsgdGV4dCArIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy53aWR0aCAtIHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkubGVuZ3RoKSArIHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQodGhpcy5kZWNvICsgdGhpcy5wYWRkaW5nKCkpO1xuICB9XG5cbiAgcmlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnModGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZUNhcnJldCh0ZXh0KSk7XG4gIH1cblxuICB0ZXh0Qm91bmRzKHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldFR4dFNpemUodGhpcy5yZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSk7XG4gIH1cblxuICBnZXRCb3hGb3JQb3MocG9zKSB7XG4gICAgdmFyIGNsb25lLCBjdXJMZWZ0LCBkZXB0aCwgZW5kRmluZCwgbGVmdCwgcGFpciwgcGxhY2Vob2xkZXIsIHJlcywgc3RhcnRGaW5kO1xuICAgIGRlcHRoID0gdGhpcy5nZXROZXN0ZWRMdmwocG9zLnN0YXJ0KTtcbiAgICBpZiAoZGVwdGggPiAwKSB7XG4gICAgICBsZWZ0ID0gdGhpcy5sZWZ0KCk7XG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LCBkZXB0aCAtIDEpO1xuICAgICAgY2xvbmUgPSB0aGlzLmNsb25lKCk7XG4gICAgICBwbGFjZWhvbGRlciA9IFwiIyMjUGxhY2VIb2xkZXIjIyNcIjtcbiAgICAgIGNsb25lLndpZHRoID0gcGxhY2Vob2xkZXIubGVuZ3RoO1xuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSB0aGlzLmRlY28gKyB0aGlzLmRlY28gKyBwbGFjZWhvbGRlciArIHRoaXMuZGVjbyArIHRoaXMuZGVjbztcbiAgICAgIHN0YXJ0RmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCAnLionKSk7XG4gICAgICBlbmRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLmVuZFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCAnLionKSk7XG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLCBlbmRGaW5kLCB7XG4gICAgICAgIHZhbGlkTWF0Y2g6IChtYXRjaCkgPT4ge1xuICAgICAgICAgIHZhciBmO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1hdGNoLGxlZnQpXG4gICAgICAgICAgZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpLCBbbGVmdCwgXCJcXG5cIiwgXCJcXHJcIl0sIC0xKTtcbiAgICAgICAgICByZXR1cm4gKGYgPT0gbnVsbCkgfHwgZi5zdHIgIT09IGxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcywgdGhpcy5jb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpO1xuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGFydCArPSBjdXJMZWZ0Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXROZXN0ZWRMdmwoaW5kZXgpIHtcbiAgICB2YXIgZGVwdGgsIGYsIGxlZnQ7XG4gICAgZGVwdGggPSAwO1xuICAgIGxlZnQgPSB0aGlzLmxlZnQoKTtcbiAgICB3aGlsZSAoKChmID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KGluZGV4LCBbbGVmdCwgXCJcXG5cIiwgXCJcXHJcIl0sIC0xKSkgIT0gbnVsbCkgJiYgZi5zdHIgPT09IGxlZnQpIHtcbiAgICAgIGluZGV4ID0gZi5wb3M7XG4gICAgICBkZXB0aCsrO1xuICAgIH1cbiAgICByZXR1cm4gZGVwdGg7XG4gIH1cblxuICBnZXRPcHRGcm9tTGluZShsaW5lLCBnZXRQYWQgPSB0cnVlKSB7XG4gICAgdmFyIGVuZFBvcywgckVuZCwgclN0YXJ0LCByZXNFbmQsIHJlc1N0YXJ0LCBzdGFydFBvcztcbiAgICByU3RhcnQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQodGhpcy5kZWNvKSkgKyBcIikoXFxcXHMqKVwiKTtcbiAgICByRW5kID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLmRlY28pKSArIFwiKShcXG58JClcIik7XG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKTtcbiAgICByZXNFbmQgPSByRW5kLmV4ZWMobGluZSk7XG4gICAgaWYgKChyZXNTdGFydCAhPSBudWxsKSAmJiAocmVzRW5kICE9IG51bGwpKSB7XG4gICAgICBpZiAoZ2V0UGFkKSB7XG4gICAgICAgIHRoaXMucGFkID0gTWF0aC5taW4ocmVzU3RhcnRbM10ubGVuZ3RoLCByZXNFbmRbMV0ubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5kZW50ID0gcmVzU3RhcnRbMV0ubGVuZ3RoO1xuICAgICAgc3RhcnRQb3MgPSByZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCArIHRoaXMucGFkO1xuICAgICAgZW5kUG9zID0gcmVzRW5kLmluZGV4ICsgcmVzRW5kWzFdLmxlbmd0aCAtIHRoaXMucGFkO1xuICAgICAgdGhpcy53aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlZm9ybWF0TGluZXModGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMubGluZXModGhpcy5yZW1vdmVDb21tZW50KHRleHQsIG9wdGlvbnMpLCBmYWxzZSk7XG4gIH1cblxuICByZW1vdmVDb21tZW50KHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywgZWNsLCBlY3IsIGVkLCBmbGFnLCBvcHQsIHJlMSwgcmUyO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH07XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuZGVjbyk7XG4gICAgICBmbGFnID0gb3B0aW9uc1snbXVsdGlsaW5lJ10gPyAnZ20nIDogJyc7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzezAsJHt0aGlzLnBhZH19YCwgZmxhZyk7XG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBcXFxccyooPzoke2VkfSkqJHtlY3J9XFxcXHMqJGAsIGZsYWcpO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsICcnKS5yZXBsYWNlKHJlMiwgJycpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zQ29sbGVjdGlvbiB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgb3B0aW9uYWxQcm9taXNlIH0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCBjbGFzcyBDbG9zaW5nUHJvbXBcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsc2VsZWN0aW9ucykgLT5cbiAgICBAdGltZW91dCA9IG51bGxcbiAgICBAX3R5cGVkID0gbnVsbFxuICAgIEBzdGFydGVkID0gZmFsc2VcbiAgICBAbmJDaGFuZ2VzID0gMFxuICAgIEBzZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucylcbiAgYmVnaW46IC0+XG4gICAgQHN0YXJ0ZWQgPSB0cnVlXG4gICAgb3B0aW9uYWxQcm9taXNlKEBhZGRDYXJyZXRzKCkpLnRoZW4gPT5cbiAgICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKVxuICAgICAgICBAcHJveHlPbkNoYW5nZSA9IChjaD1udWxsKT0+IEBvbkNoYW5nZShjaClcbiAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lciggQHByb3h5T25DaGFuZ2UgKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICAucmVzdWx0KClcbiAgYWRkQ2FycmV0czogLT5cbiAgICBAcmVwbGFjZW1lbnRzID0gQHNlbGVjdGlvbnMud3JhcChcbiAgICAgIEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNhcnJldENoYXIgKyBAY29kZXdhdmUuYnJha2V0cyArIFwiXFxuXCIsXG4gICAgICBcIlxcblwiICsgQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNvZGV3YXZlLmNhcnJldENoYXIgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICkubWFwKCAocCkgLT4gcC5jYXJyZXRUb1NlbCgpIClcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKEByZXBsYWNlbWVudHMpXG4gIGludmFsaWRUeXBlZDogLT5cbiAgICBAX3R5cGVkID0gbnVsbFxuICBvbkNoYW5nZTogKGNoID0gbnVsbCktPlxuICAgIEBpbnZhbGlkVHlwZWQoKVxuICAgIGlmIEBza2lwRXZlbnQoY2gpXG4gICAgICByZXR1cm5cbiAgICBAbmJDaGFuZ2VzKytcbiAgICBpZiBAc2hvdWxkU3RvcCgpXG4gICAgICBAc3RvcCgpXG4gICAgICBAY2xlYW5DbG9zZSgpXG4gICAgZWxzZVxuICAgICAgQHJlc3VtZSgpXG4gICAgICBcbiAgc2tpcEV2ZW50OiAoY2gpIC0+XG4gICAgcmV0dXJuIGNoPyBhbmQgY2guY2hhckNvZGVBdCgwKSAhPSAzMlxuICBcbiAgcmVzdW1lOiAtPlxuICAgICNcbiAgICBcbiAgc2hvdWxkU3RvcDogLT5cbiAgICByZXR1cm4gQHR5cGVkKCkgPT0gZmFsc2Ugb3IgQHR5cGVkKCkuaW5kZXhPZignICcpICE9IC0xXG4gIFxuICBjbGVhbkNsb3NlOiAtPlxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc2VsZWN0aW9ucyA9IEBnZXRTZWxlY3Rpb25zKClcbiAgICBmb3Igc2VsIGluIHNlbGVjdGlvbnNcbiAgICAgIGlmIHBvcyA9IEB3aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICAgIHN0YXJ0ID0gc2VsXG4gICAgICBlbHNlIGlmIChlbmQgPSBAd2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpIGFuZCBzdGFydD9cbiAgICAgICAgcmVzID0gZW5kLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXVxuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LGVuZC5pbm5lckVuZCxyZXMpXG4gICAgICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtzdGFydF1cbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gocmVwbClcbiAgICAgICAgc3RhcnQgPSBudWxsXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIGdldFNlbGVjdGlvbnM6IC0+XG4gICAgcmV0dXJuIEBjb2Rld2F2ZS5lZGl0b3IuZ2V0TXVsdGlTZWwoKVxuICBzdG9wOiAtPlxuICAgIEBzdGFydGVkID0gZmFsc2VcbiAgICBjbGVhclRpbWVvdXQoQHRpbWVvdXQpIGlmIEB0aW1lb3V0P1xuICAgIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPSBudWxsIGlmIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPT0gdGhpc1xuICAgIGlmIEBwcm94eU9uQ2hhbmdlP1xuICAgICAgQGNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcihAcHJveHlPbkNoYW5nZSlcbiAgY2FuY2VsOiAtPlxuICAgIGlmIEB0eXBlZCgpICE9IGZhbHNlXG4gICAgICBAY2FuY2VsU2VsZWN0aW9ucyhAZ2V0U2VsZWN0aW9ucygpKVxuICAgIEBzdG9wKClcbiAgY2FuY2VsU2VsZWN0aW9uczogKHNlbGVjdGlvbnMpIC0+XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzdGFydCA9IG51bGxcbiAgICBmb3Igc2VsIGluIHNlbGVjdGlvbnNcbiAgICAgIGlmIHBvcyA9IEB3aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICAgIHN0YXJ0ID0gcG9zXG4gICAgICBlbHNlIGlmIChlbmQgPSBAd2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpIGFuZCBzdGFydD9cbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3IFJlcGxhY2VtZW50KHN0YXJ0LnN0YXJ0LGVuZC5lbmQsQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHN0YXJ0LmVuZCsxLCBlbmQuc3RhcnQtMSkpLnNlbGVjdENvbnRlbnQoKSlcbiAgICAgICAgc3RhcnQgPSBudWxsXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIHR5cGVkOiAtPlxuICAgIHVubGVzcyBAX3R5cGVkP1xuICAgICAgY3BvcyA9IEBjb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKClcbiAgICAgIGlubmVyU3RhcnQgPSBAcmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICsgQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoXG4gICAgICBpZiBAY29kZXdhdmUuZmluZFByZXZCcmFrZXQoY3Bvcy5zdGFydCkgPT0gQHJlcGxhY2VtZW50c1swXS5zdGFydCBhbmQgKGlubmVyRW5kID0gQGNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGlubmVyU3RhcnQpKT8gYW5kIGlubmVyRW5kID49IGNwb3MuZW5kXG4gICAgICAgIEBfdHlwZWQgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpXG4gICAgICBlbHNlXG4gICAgICAgIEBfdHlwZWQgPSBmYWxzZVxuICAgIHJldHVybiBAX3R5cGVkXG4gIHdoaXRoaW5PcGVuQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBzdGFydFBvc0F0KGkpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PSB0YXJnZXRUZXh0XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcbiAgd2hpdGhpbkNsb3NlQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBlbmRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09IHRhcmdldFRleHRcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuICBzdGFydFBvc0F0OiAoaW5kZXgpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiksXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uZW5kICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzEpXG4gICAgICApLndyYXBwZWRCeShAY29kZXdhdmUuYnJha2V0cywgQGNvZGV3YXZlLmJyYWtldHMpXG4gIGVuZFBvc0F0OiAoaW5kZXgpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uc3RhcnQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMSksXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzIpXG4gICAgICApLndyYXBwZWRCeShAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIsIEBjb2Rld2F2ZS5icmFrZXRzKVxuXG5leHBvcnQgY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wXG4gIHJlc3VtZTogLT5cbiAgICBAc2ltdWxhdGVUeXBlKClcbiAgc2ltdWxhdGVUeXBlOiAtPlxuICAgIGNsZWFyVGltZW91dChAdGltZW91dCkgaWYgQHRpbWVvdXQ/XG4gICAgQHRpbWVvdXQgPSBzZXRUaW1lb3V0ICg9PlxuICAgICAgQGludmFsaWRUeXBlZCgpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgY3VyQ2xvc2UgPSBAd2hpdGhpbkNsb3NlQm91bmRzKEByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXS5jb3B5KCkuYXBwbHlPZmZzZXQoQHR5cGVkKCkubGVuZ3RoKSlcbiAgICAgIGlmIGN1ckNsb3NlXG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoY3VyQ2xvc2Uuc3RhcnQsY3VyQ2xvc2UuZW5kLHRhcmdldFRleHQpXG4gICAgICAgIGlmIHJlcGwud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS5uZWNlc3NhcnkoKVxuICAgICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoW3JlcGxdKVxuICAgICAgZWxzZVxuICAgICAgICBAc3RvcCgpXG4gICAgICBAb25UeXBlU2ltdWxhdGVkKCkgaWYgQG9uVHlwZVNpbXVsYXRlZD9cbiAgICApLCAyXG4gIHNraXBFdmVudDogLT5cbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0U2VsZWN0aW9uczogLT5cbiAgICByZXR1cm4gW1xuICAgICAgICBAY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpXG4gICAgICAgIEByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXSArIEB0eXBlZCgpLmxlbmd0aFxuICAgICAgXVxuICB3aGl0aGluQ2xvc2VCb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQGVuZFBvc0F0KGkpXG4gICAgICBuZXh0ID0gQGNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KVxuICAgICAgaWYgbmV4dD9cbiAgICAgICAgdGFyZ2V0UG9zLm1vdmVTdWZmaXgobmV4dClcbiAgICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKVxuICAgICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IChjb2Rld2F2ZSxzZWxlY3Rpb25zKSAtPlxuICBpZiBjb2Rld2F2ZS5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgcmV0dXJuIG5ldyBDbG9zaW5nUHJvbXAoY29kZXdhdmUsc2VsZWN0aW9ucylcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLHNlbGVjdGlvbnMpIiwiaW1wb3J0IHtcbiAgUG9zQ29sbGVjdGlvblxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgb3B0aW9uYWxQcm9taXNlXG59IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgdmFyIENsb3NpbmdQcm9tcCA9IGNsYXNzIENsb3NpbmdQcm9tcCB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlMSwgc2VsZWN0aW9ucykge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTE7XG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLl90eXBlZCA9IG51bGw7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5uYkNoYW5nZXMgPSAwO1xuICAgIHRoaXMuc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uKHNlbGVjdGlvbnMpO1xuICB9XG5cbiAgYmVnaW4oKSB7XG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gb3B0aW9uYWxQcm9taXNlKHRoaXMuYWRkQ2FycmV0cygpKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci5jYW5MaXN0ZW5Ub0NoYW5nZSgpKSB7XG4gICAgICAgIHRoaXMucHJveHlPbkNoYW5nZSA9IChjaCA9IG51bGwpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkNoYW5nZShjaCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMucHJveHlPbkNoYW5nZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KS5yZXN1bHQoKTtcbiAgfVxuXG4gIGFkZENhcnJldHMoKSB7XG4gICAgdGhpcy5yZXBsYWNlbWVudHMgPSB0aGlzLnNlbGVjdGlvbnMud3JhcCh0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyBcIlxcblwiLCBcIlxcblwiICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMpLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gcC5jYXJyZXRUb1NlbCgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyh0aGlzLnJlcGxhY2VtZW50cyk7XG4gIH1cblxuICBpbnZhbGlkVHlwZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkID0gbnVsbDtcbiAgfVxuXG4gIG9uQ2hhbmdlKGNoID0gbnVsbCkge1xuICAgIHRoaXMuaW52YWxpZFR5cGVkKCk7XG4gICAgaWYgKHRoaXMuc2tpcEV2ZW50KGNoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm5iQ2hhbmdlcysrO1xuICAgIGlmICh0aGlzLnNob3VsZFN0b3AoKSkge1xuICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICByZXR1cm4gdGhpcy5jbGVhbkNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VtZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNraXBFdmVudChjaCkge1xuICAgIHJldHVybiAoY2ggIT0gbnVsbCkgJiYgY2guY2hhckNvZGVBdCgwKSAhPT0gMzI7XG4gIH1cblxuICByZXN1bWUoKSB7fVxuXG4gIFxuICBzaG91bGRTdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGVkKCkgPT09IGZhbHNlIHx8IHRoaXMudHlwZWQoKS5pbmRleE9mKCcgJykgIT09IC0xO1xuICB9XG5cbiAgY2xlYW5DbG9zZSgpIHtcbiAgICB2YXIgZW5kLCBqLCBsZW4sIHBvcywgcmVwbCwgcmVwbGFjZW1lbnRzLCByZXMsIHNlbCwgc2VsZWN0aW9ucywgc3RhcnQ7XG4gICAgcmVwbGFjZW1lbnRzID0gW107XG4gICAgc2VsZWN0aW9ucyA9IHRoaXMuZ2V0U2VsZWN0aW9ucygpO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNlbGVjdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNlbCA9IHNlbGVjdGlvbnNbal07XG4gICAgICBpZiAocG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpKSB7XG4gICAgICAgIHN0YXJ0ID0gc2VsO1xuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgKHN0YXJ0ICE9IG51bGwpKSB7XG4gICAgICAgIHJlcyA9IGVuZC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS5pbm5lclRleHQoKS5zcGxpdCgnICcpWzBdO1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LCBlbmQuaW5uZXJFbmQsIHJlcyk7XG4gICAgICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtzdGFydF07XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKHJlcGwpO1xuICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0TXVsdGlTZWwoKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID09PSB0aGlzKSB7XG4gICAgICB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3h5T25DaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMucHJveHlPbkNoYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIGlmICh0aGlzLnR5cGVkKCkgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmNhbmNlbFNlbGVjdGlvbnModGhpcy5nZXRTZWxlY3Rpb25zKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdG9wKCk7XG4gIH1cblxuICBjYW5jZWxTZWxlY3Rpb25zKHNlbGVjdGlvbnMpIHtcbiAgICB2YXIgZW5kLCBqLCBsZW4sIHBvcywgcmVwbGFjZW1lbnRzLCBzZWwsIHN0YXJ0O1xuICAgIHJlcGxhY2VtZW50cyA9IFtdO1xuICAgIHN0YXJ0ID0gbnVsbDtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdO1xuICAgICAgaWYgKHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKSkge1xuICAgICAgICBzdGFydCA9IHBvcztcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIChzdGFydCAhPSBudWxsKSkge1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXcgUmVwbGFjZW1lbnQoc3RhcnQuc3RhcnQsIGVuZC5lbmQsIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoc3RhcnQuZW5kICsgMSwgZW5kLnN0YXJ0IC0gMSkpLnNlbGVjdENvbnRlbnQoKSk7XG4gICAgICAgIHN0YXJ0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxuICB0eXBlZCgpIHtcbiAgICB2YXIgY3BvcywgaW5uZXJFbmQsIGlubmVyU3RhcnQ7XG4gICAgaWYgKHRoaXMuX3R5cGVkID09IG51bGwpIHtcbiAgICAgIGNwb3MgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKTtcbiAgICAgIGlubmVyU3RhcnQgPSB0aGlzLnJlcGxhY2VtZW50c1swXS5zdGFydCArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGg7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PT0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgJiYgKChpbm5lckVuZCA9IHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoaW5uZXJTdGFydCkpICE9IG51bGwpICYmIGlubmVyRW5kID49IGNwb3MuZW5kKSB7XG4gICAgICAgIHRoaXMuX3R5cGVkID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihpbm5lclN0YXJ0LCBpbm5lckVuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl90eXBlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHlwZWQ7XG4gIH1cblxuICB3aGl0aGluT3BlbkJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuc3RhcnRQb3NBdChpKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXJ0UG9zQXQoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5zdGFydCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cywgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKTtcbiAgfVxuXG4gIGVuZFBvc0F0KGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDEpLCB0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5lbmQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDIpKS53cmFwcGVkQnkodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIsIHRoaXMuY29kZXdhdmUuYnJha2V0cyk7XG4gIH1cblxufTtcblxuZXhwb3J0IHZhciBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgPSBjbGFzcyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgZXh0ZW5kcyBDbG9zaW5nUHJvbXAge1xuICByZXN1bWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2ltdWxhdGVUeXBlKCk7XG4gIH1cblxuICBzaW11bGF0ZVR5cGUoKSB7XG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgIHZhciBjdXJDbG9zZSwgcmVwbCwgdGFyZ2V0VGV4dDtcbiAgICAgIHRoaXMuaW52YWxpZFR5cGVkKCk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBjdXJDbG9zZSA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0uY29weSgpLmFwcGx5T2Zmc2V0KHRoaXMudHlwZWQoKS5sZW5ndGgpKTtcbiAgICAgIGlmIChjdXJDbG9zZSkge1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LCBjdXJDbG9zZS5lbmQsIHRhcmdldFRleHQpO1xuICAgICAgICBpZiAocmVwbC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS5uZWNlc3NhcnkoKSkge1xuICAgICAgICAgIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKFtyZXBsXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub25UeXBlU2ltdWxhdGVkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25UeXBlU2ltdWxhdGVkKCk7XG4gICAgICB9XG4gICAgfSksIDIpO1xuICB9XG5cbiAgc2tpcEV2ZW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIFt0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKSwgdGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXSArIHRoaXMudHlwZWQoKS5sZW5ndGhdO1xuICB9XG5cbiAgd2hpdGhpbkNsb3NlQm91bmRzKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIG5leHQsIHJlZiwgcmVwbCwgdGFyZ2V0UG9zO1xuICAgIHJlZiA9IHRoaXMucmVwbGFjZW1lbnRzO1xuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5lbmRQb3NBdChpKTtcbiAgICAgIG5leHQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KTtcbiAgICAgIGlmIChuZXh0ICE9IG51bGwpIHtcbiAgICAgICAgdGFyZ2V0UG9zLm1vdmVTdWZmaXgobmV4dCk7XG4gICAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldFBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxufTtcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IGZ1bmN0aW9uKGNvZGV3YXZlLCBzZWxlY3Rpb25zKSB7XG4gIGlmIChjb2Rld2F2ZS5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgcmV0dXJuIG5ldyBDbG9zaW5nUHJvbXAoY29kZXdhdmUsIHNlbGVjdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIENtZEZpbmRlclxuICBjb25zdHJ1Y3RvcjogKG5hbWVzLCBvcHRpb25zKSAtPlxuICAgIGlmIHR5cGVvZiBuYW1lcyA9PSAnc3RyaW5nJ1xuICAgICAgbmFtZXMgPSBbbmFtZXNdXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGxcbiAgICAgIG5hbWVzcGFjZXM6IFtdXG4gICAgICBwYXJlbnRDb250ZXh0OiBudWxsXG4gICAgICBjb250ZXh0OiBudWxsXG4gICAgICByb290OiBDb21tYW5kLmNtZHNcbiAgICAgIG11c3RFeGVjdXRlOiB0cnVlXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWVcbiAgICAgIHVzZUZhbGxiYWNrczogdHJ1ZVxuICAgICAgaW5zdGFuY2U6IG51bGxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfVxuICAgIEBuYW1lcyA9IG5hbWVzXG4gICAgQHBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dChAY29kZXdhdmUpXG4gICAgaWYgQHBhcmVudENvbnRleHQ/XG4gICAgICBAY29udGV4dC5wYXJlbnQgPSBAcGFyZW50Q29udGV4dFxuICAgIGlmIEBuYW1lc3BhY2VzP1xuICAgICAgQGNvbnRleHQuYWRkTmFtZXNwYWNlcyhAbmFtZXNwYWNlcylcbiAgZmluZDogLT5cbiAgICBAdHJpZ2dlckRldGVjdG9ycygpXG4gICAgQGNtZCA9IEBmaW5kSW4oQHJvb3QpXG4gICAgcmV0dXJuIEBjbWRcbiMgIGdldFBvc2liaWxpdGllczogLT5cbiMgICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuIyAgICBwYXRoID0gbGlzdChAcGF0aClcbiMgICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcbiAgZ2V0TmFtZXNXaXRoUGF0aHM6IC0+XG4gICAgcGF0aHMgPSB7fVxuICAgIGZvciBuYW1lIGluIEBuYW1lcyBcbiAgICAgIFtzcGFjZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG4gICAgICBpZiBzcGFjZT8gYW5kICEoc3BhY2UgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgICB1bmxlc3Mgc3BhY2Ugb2YgcGF0aHMgXG4gICAgICAgICAgcGF0aHNbc3BhY2VdID0gW11cbiAgICAgICAgcGF0aHNbc3BhY2VdLnB1c2gocmVzdClcbiAgICByZXR1cm4gcGF0aHNcbiAgYXBwbHlTcGFjZU9uTmFtZXM6IChuYW1lc3BhY2UpIC0+XG4gICAgW3NwYWNlLHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZXNwYWNlLHRydWUpXG4gICAgQG5hbWVzLm1hcCggKG5hbWUpIC0+XG4gICAgICBbY3VyX3NwYWNlLGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG4gICAgICBpZiBjdXJfc3BhY2U/IGFuZCBjdXJfc3BhY2UgPT0gc3BhY2VcbiAgICAgICAgbmFtZSA9IGN1cl9yZXN0XG4gICAgICBpZiByZXN0P1xuICAgICAgICBuYW1lID0gcmVzdCArICc6JyArIG5hbWVcbiAgICAgIHJldHVybiBuYW1lXG4gICAgKVxuICBnZXREaXJlY3ROYW1lczogLT5cbiAgICByZXR1cm4gKG4gZm9yIG4gaW4gQG5hbWVzIHdoZW4gbi5pbmRleE9mKFwiOlwiKSA9PSAtMSlcbiAgdHJpZ2dlckRldGVjdG9yczogLT5cbiAgICBpZiBAdXNlRGV0ZWN0b3JzIFxuICAgICAgQHVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICBwb3NpYmlsaXRpZXMgPSBbQHJvb3RdLmNvbmNhdChuZXcgQ21kRmluZGVyKEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoXG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXVxuICAgICAgICBmb3IgZGV0ZWN0b3IgaW4gY21kLmRldGVjdG9ycyBcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcylcbiAgICAgICAgICBpZiByZXM/XG4gICAgICAgICAgICBAY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcylcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICAgICAgaSsrXG4gIGZpbmRJbjogKGNtZCxwYXRoID0gbnVsbCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIG51bGxcbiAgICBiZXN0ID0gQGJlc3RJblBvc2liaWxpdGllcyhAZmluZFBvc2liaWxpdGllcygpKVxuICAgIGlmIGJlc3Q/XG4gICAgICByZXR1cm4gYmVzdFxuICBmaW5kUG9zaWJpbGl0aWVzOiAtPlxuICAgIHVubGVzcyBAcm9vdD9cbiAgICAgIHJldHVybiBbXVxuICAgIEByb290LmluaXQoKVxuICAgIHBvc2liaWxpdGllcyA9IFtdXG4gICAgaWYgQGNvZGV3YXZlPy5pbkluc3RhbmNlPy5jbWQgPT0gQHJvb3RcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQoQGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKCdpbl9pbnN0YW5jZScpKVxuICAgIGZvciBzcGFjZSwgbmFtZXMgb2YgQGdldE5hbWVzV2l0aFBhdGhzKClcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQoQGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKHNwYWNlLCBuYW1lcykpXG4gICAgZm9yIG5zcGMgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICBbbnNwY05hbWUscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLHRydWUpXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KEBnZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChuc3BjTmFtZSwgQGFwcGx5U3BhY2VPbk5hbWVzKG5zcGMpKSlcbiAgICBmb3IgbmFtZSBpbiBAZ2V0RGlyZWN0TmFtZXMoKVxuICAgICAgZGlyZWN0ID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgICBpZiBAY21kSXNWYWxpZChkaXJlY3QpXG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdClcbiAgICBpZiBAdXNlRmFsbGJhY2tzXG4gICAgICBmYWxsYmFjayA9IEByb290LmdldENtZCgnZmFsbGJhY2snKVxuICAgICAgaWYgQGNtZElzVmFsaWQoZmFsbGJhY2spXG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGZhbGxiYWNrKVxuICAgIEBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXNcbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzXG4gIGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kOiAoY21kTmFtZSwgbmFtZXMgPSBAbmFtZXMpIC0+XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG4gICAgbmV4dHMgPSBAZ2V0Q21kRm9sbG93QWxpYXMoY21kTmFtZSlcbiAgICBmb3IgbmV4dCBpbiBuZXh0c1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKG5hbWVzLCB7cGFyZW50OiB0aGlzLCByb290OiBuZXh0fSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgIHBvc2liaWxpdGllc1xuICBnZXRDbWRGb2xsb3dBbGlhczogKG5hbWUpIC0+XG4gICAgY21kID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgaWYgY21kPyBcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5hbGlhc09mP1xuICAgICAgICByZXR1cm4gW2NtZCxjbWQuZ2V0QWxpYXNlZCgpXVxuICAgICAgcmV0dXJuIFtjbWRdXG4gICAgcmV0dXJuIFtjbWRdXG4gIGNtZElzVmFsaWQ6IChjbWQpIC0+XG4gICAgdW5sZXNzIGNtZD9cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIGNtZC5uYW1lICE9ICdmYWxsYmFjaycgJiYgY21kIGluIEBhbmNlc3RvcnMoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuICFAbXVzdEV4ZWN1dGUgb3IgQGNtZElzRXhlY3V0YWJsZShjbWQpXG4gIGFuY2VzdG9yczogLT5cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGNtZElzRXhlY3V0YWJsZTogKGNtZCkgLT5cbiAgICBuYW1lcyA9IEBnZXREaXJlY3ROYW1lcygpXG4gICAgaWYgbmFtZXMubGVuZ3RoID09IDFcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gIGNtZFNjb3JlOiAoY21kKSAtPlxuICAgIHNjb3JlID0gY21kLmRlcHRoXG4gICAgaWYgY21kLm5hbWUgPT0gJ2ZhbGxiYWNrJyBcbiAgICAgICAgc2NvcmUgLT0gMTAwMFxuICAgIHJldHVybiBzY29yZVxuICBiZXN0SW5Qb3NpYmlsaXRpZXM6IChwb3NzKSAtPlxuICAgIGlmIHBvc3MubGVuZ3RoID4gMFxuICAgICAgYmVzdCA9IG51bGxcbiAgICAgIGJlc3RTY29yZSA9IG51bGxcbiAgICAgIGZvciBwIGluIHBvc3NcbiAgICAgICAgc2NvcmUgPSBAY21kU2NvcmUocClcbiAgICAgICAgaWYgIWJlc3Q/IG9yIHNjb3JlID49IGJlc3RTY29yZVxuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlXG4gICAgICAgICAgYmVzdCA9IHBcbiAgICAgIHJldHVybiBiZXN0OyIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBOYW1lc3BhY2VIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBDbWRGaW5kZXIgPSBjbGFzcyBDbWRGaW5kZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lcywgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXTtcbiAgICB9XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICBuYW1lc3BhY2VzOiBbXSxcbiAgICAgIHBhcmVudENvbnRleHQ6IG51bGwsXG4gICAgICBjb250ZXh0OiBudWxsLFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzLFxuICAgICAgbXVzdEV4ZWN1dGU6IHRydWUsXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWUsXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWUsXG4gICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfTtcbiAgICB0aGlzLm5hbWVzID0gbmFtZXM7XG4gICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2UgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcy5jb2Rld2F2ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmVudENvbnRleHQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMucGFyZW50Q29udGV4dDtcbiAgICB9XG4gICAgaWYgKHRoaXMubmFtZXNwYWNlcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyh0aGlzLm5hbWVzcGFjZXMpO1xuICAgIH1cbiAgfVxuXG4gIGZpbmQoKSB7XG4gICAgdGhpcy50cmlnZ2VyRGV0ZWN0b3JzKCk7XG4gICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRJbih0aGlzLnJvb3QpO1xuICAgIHJldHVybiB0aGlzLmNtZDtcbiAgfVxuXG4gIC8vICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4gIC8vICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiAgLy8gICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4gIC8vICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzKCkge1xuICAgIHZhciBqLCBsZW4sIG5hbWUsIHBhdGhzLCByZWYsIHJlc3QsIHNwYWNlO1xuICAgIHBhdGhzID0ge307XG4gICAgcmVmID0gdGhpcy5uYW1lcztcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5hbWUgPSByZWZbal07XG4gICAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG4gICAgICBpZiAoKHNwYWNlICE9IG51bGwpICYmICEoaW5kZXhPZi5jYWxsKHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHNwYWNlKSA+PSAwKSkge1xuICAgICAgICBpZiAoIShzcGFjZSBpbiBwYXRocykpIHtcbiAgICAgICAgICBwYXRoc1tzcGFjZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBwYXRoc1tzcGFjZV0ucHVzaChyZXN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGhzO1xuICB9XG5cbiAgYXBwbHlTcGFjZU9uTmFtZXMobmFtZXNwYWNlKSB7XG4gICAgdmFyIHJlc3QsIHNwYWNlO1xuICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lc3BhY2UsIHRydWUpO1xuICAgIHJldHVybiB0aGlzLm5hbWVzLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgY3VyX3Jlc3QsIGN1cl9zcGFjZTtcbiAgICAgIFtjdXJfc3BhY2UsIGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpO1xuICAgICAgaWYgKChjdXJfc3BhY2UgIT0gbnVsbCkgJiYgY3VyX3NwYWNlID09PSBzcGFjZSkge1xuICAgICAgICBuYW1lID0gY3VyX3Jlc3Q7XG4gICAgICB9XG4gICAgICBpZiAocmVzdCAhPSBudWxsKSB7XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RGlyZWN0TmFtZXMoKSB7XG4gICAgdmFyIG47XG4gICAgcmV0dXJuIChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgIHJlZiA9IHRoaXMubmFtZXM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgbiA9IHJlZltqXTtcbiAgICAgICAgaWYgKG4uaW5kZXhPZihcIjpcIikgPT09IC0xKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9KS5jYWxsKHRoaXMpO1xuICB9XG5cbiAgdHJpZ2dlckRldGVjdG9ycygpIHtcbiAgICB2YXIgY21kLCBkZXRlY3RvciwgaSwgaiwgbGVuLCBwb3NpYmlsaXRpZXMsIHJlZiwgcmVzLCByZXN1bHRzO1xuICAgIGlmICh0aGlzLnVzZURldGVjdG9ycykge1xuICAgICAgdGhpcy51c2VEZXRlY3RvcnMgPSBmYWxzZTtcbiAgICAgIHBvc2liaWxpdGllcyA9IFt0aGlzLnJvb3RdLmNvbmNhdChuZXcgQ21kRmluZGVyKHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHtcbiAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICBtdXN0RXhlY3V0ZTogZmFsc2UsXG4gICAgICAgIHVzZUZhbGxiYWNrczogZmFsc2VcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgICBpID0gMDtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIHdoaWxlIChpIDwgcG9zaWJpbGl0aWVzLmxlbmd0aCkge1xuICAgICAgICBjbWQgPSBwb3NpYmlsaXRpZXNbaV07XG4gICAgICAgIHJlZiA9IGNtZC5kZXRlY3RvcnM7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIGRldGVjdG9yID0gcmVmW2pdO1xuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKTtcbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcyk7XG4gICAgICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIocmVzLCB7XG4gICAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICAgICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRJbihjbWQsIHBhdGggPSBudWxsKSB7XG4gICAgdmFyIGJlc3Q7XG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgYmVzdCA9IHRoaXMuYmVzdEluUG9zaWJpbGl0aWVzKHRoaXMuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICBpZiAoYmVzdCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxuICBmaW5kUG9zaWJpbGl0aWVzKCkge1xuICAgIHZhciBkaXJlY3QsIGZhbGxiYWNrLCBqLCBrLCBsZW4sIGxlbjEsIG5hbWUsIG5hbWVzLCBuc3BjLCBuc3BjTmFtZSwgcG9zaWJpbGl0aWVzLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlc3QsIHNwYWNlO1xuICAgIGlmICh0aGlzLnJvb3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICB0aGlzLnJvb3QuaW5pdCgpO1xuICAgIHBvc2liaWxpdGllcyA9IFtdO1xuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyAocmVmMSA9IHJlZi5pbkluc3RhbmNlKSAhPSBudWxsID8gcmVmMS5jbWQgOiB2b2lkIDAgOiB2b2lkIDApID09PSB0aGlzLnJvb3QpIHtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZCgnaW5faW5zdGFuY2UnKSk7XG4gICAgfVxuICAgIHJlZjIgPSB0aGlzLmdldE5hbWVzV2l0aFBhdGhzKCk7XG4gICAgZm9yIChzcGFjZSBpbiByZWYyKSB7XG4gICAgICBuYW1lcyA9IHJlZjJbc3BhY2VdO1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKHNwYWNlLCBuYW1lcykpO1xuICAgIH1cbiAgICByZWYzID0gdGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuc3BjID0gcmVmM1tqXTtcbiAgICAgIFtuc3BjTmFtZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLCB0cnVlKTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChuc3BjTmFtZSwgdGhpcy5hcHBseVNwYWNlT25OYW1lcyhuc3BjKSkpO1xuICAgIH1cbiAgICByZWY0ID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuICAgIGZvciAoayA9IDAsIGxlbjEgPSByZWY0Lmxlbmd0aDsgayA8IGxlbjE7IGsrKykge1xuICAgICAgbmFtZSA9IHJlZjRba107XG4gICAgICBkaXJlY3QgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpO1xuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChkaXJlY3QpKSB7XG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnVzZUZhbGxiYWNrcykge1xuICAgICAgZmFsbGJhY2sgPSB0aGlzLnJvb3QuZ2V0Q21kKCdmYWxsYmFjaycpO1xuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChmYWxsYmFjaykpIHtcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZmFsbGJhY2spO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcztcbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzO1xuICB9XG5cbiAgZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoY21kTmFtZSwgbmFtZXMgPSB0aGlzLm5hbWVzKSB7XG4gICAgdmFyIGosIGxlbiwgbmV4dCwgbmV4dHMsIHBvc2liaWxpdGllcztcbiAgICBwb3NpYmlsaXRpZXMgPSBbXTtcbiAgICBuZXh0cyA9IHRoaXMuZ2V0Q21kRm9sbG93QWxpYXMoY21kTmFtZSk7XG4gICAgZm9yIChqID0gMCwgbGVuID0gbmV4dHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5leHQgPSBuZXh0c1tqXTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIHJvb3Q6IG5leHRcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgfVxuICAgIHJldHVybiBwb3NpYmlsaXRpZXM7XG4gIH1cblxuICBnZXRDbWRGb2xsb3dBbGlhcyhuYW1lKSB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbY21kLCBjbWQuZ2V0QWxpYXNlZCgpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbY21kXTtcbiAgICB9XG4gICAgcmV0dXJuIFtjbWRdO1xuICB9XG5cbiAgY21kSXNWYWxpZChjbWQpIHtcbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGNtZC5uYW1lICE9PSAnZmFsbGJhY2snICYmIGluZGV4T2YuY2FsbCh0aGlzLmFuY2VzdG9ycygpLCBjbWQpID49IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLm11c3RFeGVjdXRlIHx8IHRoaXMuY21kSXNFeGVjdXRhYmxlKGNtZCk7XG4gIH1cblxuICBhbmNlc3RvcnMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gcmVmLmluSW5zdGFuY2UgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjbWRJc0V4ZWN1dGFibGUoY21kKSB7XG4gICAgdmFyIG5hbWVzO1xuICAgIG5hbWVzID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgfVxuICB9XG5cbiAgY21kU2NvcmUoY21kKSB7XG4gICAgdmFyIHNjb3JlO1xuICAgIHNjb3JlID0gY21kLmRlcHRoO1xuICAgIGlmIChjbWQubmFtZSA9PT0gJ2ZhbGxiYWNrJykge1xuICAgICAgc2NvcmUgLT0gMTAwMDtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3JlO1xuICB9XG5cbiAgYmVzdEluUG9zaWJpbGl0aWVzKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlO1xuICAgIGlmIChwb3NzLmxlbmd0aCA+IDApIHtcbiAgICAgIGJlc3QgPSBudWxsO1xuICAgICAgYmVzdFNjb3JlID0gbnVsbDtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHBvc3MubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHBvc3Nbal07XG4gICAgICAgIHNjb3JlID0gdGhpcy5jbWRTY29yZShwKTtcbiAgICAgICAgaWYgKChiZXN0ID09IG51bGwpIHx8IHNjb3JlID49IGJlc3RTY29yZSkge1xuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlO1xuICAgICAgICAgIGJlc3QgPSBwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBvcHRpb25hbFByb21pc2UgfSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IGNsYXNzIENtZEluc3RhbmNlXG4gIGNvbnN0cnVjdG9yOiAoQGNtZCxAY29udGV4dCkgLT5cbiAgXG4gIGluaXQ6IC0+XG4gICAgdW5sZXNzIEBpc0VtcHR5KCkgb3IgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIEBfZ2V0Q21kT2JqKClcbiAgICAgIEBfaW5pdFBhcmFtcygpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBAY21kT2JqLmluaXQoKVxuICAgIHJldHVybiB0aGlzXG4gIHNldFBhcmFtOihuYW1lLHZhbCktPlxuICAgIEBuYW1lZFtuYW1lXSA9IHZhbFxuICBwdXNoUGFyYW06KHZhbCktPlxuICAgIEBwYXJhbXMucHVzaCh2YWwpXG4gIGdldENvbnRleHQ6IC0+XG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgcmV0dXJuIEBjb250ZXh0IG9yIG5ldyBDb250ZXh0KClcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBnZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsbmFtZXNwYWNlczpAX2dldFBhcmVudE5hbWVzcGFjZXMoKSlcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzXG4gICAgcmV0dXJuIGZpbmRlclxuICBfZ2V0Q21kT2JqOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBAY21kLmluaXQoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWQoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuY2xzP1xuICAgICAgICBAY21kT2JqID0gbmV3IGNtZC5jbHModGhpcylcbiAgICAgICAgcmV0dXJuIEBjbWRPYmpcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQG5hbWVkID0gQGdldERlZmF1bHRzKClcbiAgX2dldFBhcmVudE5hbWVzcGFjZXM6IC0+XG4gICAgcmV0dXJuIFtdXG4gIGlzRW1wdHk6IC0+XG4gICAgcmV0dXJuIEBjbWQ/XG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWRGaW5hbCgpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICByZXR1cm4gQGNtZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldERlZmF1bHRzOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICByZXMgPSB7fVxuICAgICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBjbWQuZGVmYXVsdHMpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxAY21kT2JqLmdldERlZmF1bHRzKCkpXG4gICAgICByZXR1cm4gcmVzXG4gICAgZWxzZVxuICAgICAge31cbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIHJldHVybiBAYWxpYXNlZENtZCBvciBudWxsXG4gIGdldEFsaWFzZWRGaW5hbDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGFsaWFzZWRGaW5hbENtZD9cbiAgICAgICAgcmV0dXJuIEBhbGlhc2VkRmluYWxDbWQgb3IgbnVsbFxuICAgICAgaWYgQGNtZC5hbGlhc09mP1xuICAgICAgICBhbGlhc2VkID0gQGNtZFxuICAgICAgICB3aGlsZSBhbGlhc2VkPyBhbmQgYWxpYXNlZC5hbGlhc09mP1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcihAZ2V0RmluZGVyKEBhbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG4gICAgICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICAgICAgQGFsaWFzZWRDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIEBhbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIHJldHVybiBhbGlhc2VkXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBhbGlhc09mXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPcHRpb25zP1xuICAgICAgICByZXR1cm4gQGNtZE9wdGlvbnNcbiAgICAgIG9wdCA9IEBjbWQuX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxAY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIEBjbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIG9wdGlvbnM/IGFuZCBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBnZXRQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIG5hbWVzID0gW25hbWVzXSBpZiAodHlwZW9mIG5hbWVzIGluIFsnc3RyaW5nJywnbnVtYmVyJ10pXG4gICAgZm9yIG4gaW4gbmFtZXNcbiAgICAgIHJldHVybiBAbmFtZWRbbl0gaWYgQG5hbWVkW25dP1xuICAgICAgcmV0dXJuIEBwYXJhbXNbbl0gaWYgQHBhcmFtc1tuXT9cbiAgICByZXR1cm4gZGVmVmFsXG4gIGdldEJvb2xQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIGZhbHNlVmFscyA9IFtcIlwiLFwiMFwiLFwiZmFsc2VcIixcIm5vXCIsXCJub25lXCIsZmFsc2UsbnVsbCwwXVxuICAgIHZhbCA9IEBnZXRQYXJhbShuYW1lcywgZGVmVmFsKVxuICAgICFmYWxzZVZhbHMuaW5jbHVkZXModmFsKVxuICBhbmNlc3RvckNtZHM6IC0+XG4gICAgaWYgQGNvbnRleHQuY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvbnRleHQuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICByZXR1cm4gW11cbiAgYW5jZXN0b3JDbWRzQW5kU2VsZjogLT5cbiAgICByZXR1cm4gQGFuY2VzdG9yQ21kcygpLmNvbmNhdChbQGNtZF0pXG4gIHJ1bkV4ZWN1dGVGdW5jdDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmV0dXJuIEBjbWRPYmouZXhlY3V0ZSgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZEZpbmFsKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmV4ZWN1dGVGdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlRnVuY3QodGhpcylcbiAgcmF3UmVzdWx0OiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5yZXN1bHQoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWRGaW5hbCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5yZXN1bHRGdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRGdW5jdCh0aGlzKVxuICAgICAgaWYgY21kLnJlc3VsdFN0cj9cbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRTdHJcbiAgcmVzdWx0OiAtPiBcbiAgICBAaW5pdCgpXG4gICAgaWYgQHJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIG9wdGlvbmFsUHJvbWlzZShAcmF3UmVzdWx0KCkpLnRoZW4gKHJlcyk9PlxuICAgICAgICBpZiByZXM/XG4gICAgICAgICAgcmVzID0gQGZvcm1hdEluZGVudChyZXMpXG4gICAgICAgICAgaWYgcmVzLmxlbmd0aCA+IDAgYW5kIEBnZXRPcHRpb24oJ3BhcnNlJyx0aGlzKSBcbiAgICAgICAgICAgIHBhcnNlciA9IEBnZXRQYXJzZXJGb3JUZXh0KHJlcylcbiAgICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICAgICAgaWYgYWx0ZXJGdW5jdCA9IEBnZXRPcHRpb24oJ2FsdGVyUmVzdWx0Jyx0aGlzKVxuICAgICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsdGhpcylcbiAgICAgICAgICByZXR1cm4gcmVzXG4gICAgICAucmVzdWx0KClcbiAgZ2V0UGFyc2VyRm9yVGV4dDogKHR4dD0nJykgLT5cbiAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIodHh0KSwge2luSW5zdGFuY2U6dGhpc30pXG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2VcbiAgICByZXR1cm4gcGFyc2VyXG4gIGdldEluZGVudDogLT5cbiAgICByZXR1cm4gMFxuICBmb3JtYXRJbmRlbnQ6ICh0ZXh0KSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywnICAnKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gIGFwcGx5SW5kZW50OiAodGV4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmluZGVudE5vdEZpcnN0KHRleHQsQGdldEluZGVudCgpLFwiIFwiKSIsImltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgQ29kZXdhdmVcbn0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5cbmltcG9ydCB7XG4gIFRleHRQYXJzZXJcbn0gZnJvbSAnLi9UZXh0UGFyc2VyJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBvcHRpb25hbFByb21pc2Vcbn0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCB2YXIgQ21kSW5zdGFuY2UgPSBjbGFzcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yKGNtZDEsIGNvbnRleHQpIHtcbiAgICB0aGlzLmNtZCA9IGNtZDE7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCEodGhpcy5pc0VtcHR5KCkgfHwgdGhpcy5pbml0ZWQpKSB7XG4gICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICB0aGlzLl9nZXRDbWRPYmooKTtcbiAgICAgIHRoaXMuX2luaXRQYXJhbXMoKTtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqLmluaXQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRQYXJhbShuYW1lLCB2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lZFtuYW1lXSA9IHZhbDtcbiAgfVxuXG4gIHB1c2hQYXJhbSh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMucHVzaCh2YWwpO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRleHQgfHwgbmV3IENvbnRleHQoKTtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmdldENvbnRleHQoKS5nZXRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogdGhpcy5fZ2V0UGFyZW50TmFtZXNwYWNlcygpXG4gICAgfSk7XG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gZmluZGVyO1xuICB9XG5cbiAgX2dldENtZE9iaigpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNtZC5pbml0KCk7XG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWQoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmNscyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqID0gbmV3IGNtZC5jbHModGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iajtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaW5pdFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lZCA9IHRoaXMuZ2V0RGVmYXVsdHMoKTtcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY21kICE9IG51bGw7XG4gIH1cblxuICByZXN1bHRJc0F2YWlsYWJsZSgpIHtcbiAgICB2YXIgYWxpYXNlZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNtZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXREZWZhdWx0cygpIHtcbiAgICB2YXIgYWxpYXNlZCwgcmVzO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5jbWQuZGVmYXVsdHMpO1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kT2JqLmdldERlZmF1bHRzKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmdldEFsaWFzZWRGaW5hbCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZENtZCB8fCBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWRGaW5hbCgpIHtcbiAgICB2YXIgYWxpYXNlZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZEZpbmFsQ21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZEZpbmFsQ21kIHx8IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLmNtZDtcbiAgICAgICAgd2hpbGUgKChhbGlhc2VkICE9IG51bGwpICYmIChhbGlhc2VkLmFsaWFzT2YgIT0gbnVsbCkpIHtcbiAgICAgICAgICBhbGlhc2VkID0gYWxpYXNlZC5fYWxpYXNlZEZyb21GaW5kZXIodGhpcy5nZXRGaW5kZXIodGhpcy5hbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpO1xuICAgICAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hbGlhc2VkQ21kID0gYWxpYXNlZCB8fCBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIHx8IGZhbHNlO1xuICAgICAgICByZXR1cm4gYWxpYXNlZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhbHRlckFsaWFzT2YoYWxpYXNPZikge1xuICAgIHJldHVybiBhbGlhc09mO1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICB2YXIgb3B0O1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPcHRpb25zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT3B0aW9ucztcbiAgICAgIH1cbiAgICAgIG9wdCA9IHRoaXMuY21kLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSk7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5jbWRPYmouZ2V0T3B0aW9ucygpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY21kT3B0aW9ucyA9IG9wdDtcbiAgICAgIHJldHVybiBvcHQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0aW9uKGtleSkge1xuICAgIHZhciBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICBpZiAoKG9wdGlvbnMgIT0gbnVsbCkgJiYga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV07XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyYW0obmFtZXMsIGRlZlZhbCA9IG51bGwpIHtcbiAgICB2YXIgaSwgbGVuLCBuLCByZWY7XG4gICAgaWYgKCgocmVmID0gdHlwZW9mIG5hbWVzKSA9PT0gJ3N0cmluZycgfHwgcmVmID09PSAnbnVtYmVyJykpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXTtcbiAgICB9XG4gICAgZm9yIChpID0gMCwgbGVuID0gbmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG4gPSBuYW1lc1tpXTtcbiAgICAgIGlmICh0aGlzLm5hbWVkW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbl07XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wYXJhbXNbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXNbbl07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWZWYWw7XG4gIH1cblxuICBnZXRCb29sUGFyYW0obmFtZXMsIGRlZlZhbCA9IG51bGwpIHtcbiAgICB2YXIgZmFsc2VWYWxzLCB2YWw7XG4gICAgZmFsc2VWYWxzID0gW1wiXCIsIFwiMFwiLCBcImZhbHNlXCIsIFwibm9cIiwgXCJub25lXCIsIGZhbHNlLCBudWxsLCAwXTtcbiAgICB2YWwgPSB0aGlzLmdldFBhcmFtKG5hbWVzLCBkZWZWYWwpO1xuICAgIHJldHVybiAhZmFsc2VWYWxzLmluY2x1ZGVzKHZhbCk7XG4gIH1cblxuICBhbmNlc3RvckNtZHMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUpICE9IG51bGwgPyByZWYuaW5JbnN0YW5jZSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgYW5jZXN0b3JDbWRzQW5kU2VsZigpIHtcbiAgICByZXR1cm4gdGhpcy5hbmNlc3RvckNtZHMoKS5jb25jYXQoW3RoaXMuY21kXSk7XG4gIH1cblxuICBydW5FeGVjdXRlRnVuY3QoKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLmV4ZWN1dGUoKTtcbiAgICAgIH1cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5leGVjdXRlRnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByYXdSZXN1bHQoKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdCgpO1xuICAgICAgfVxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLnJlc3VsdEZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjbWQucmVzdWx0U3RyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRTdHI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25hbFByb21pc2UodGhpcy5yYXdSZXN1bHQoKSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgIHZhciBhbHRlckZ1bmN0LCBwYXJzZXI7XG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIHJlcyA9IHRoaXMuZm9ybWF0SW5kZW50KHJlcyk7XG4gICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwICYmIHRoaXMuZ2V0T3B0aW9uKCdwYXJzZScsIHRoaXMpKSB7XG4gICAgICAgICAgICBwYXJzZXIgPSB0aGlzLmdldFBhcnNlckZvclRleHQocmVzKTtcbiAgICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYWx0ZXJGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdhbHRlclJlc3VsdCcsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXMgPSBhbHRlckZ1bmN0KHJlcywgdGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cbiAgICAgIH0pLnJlc3VsdCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldFBhcnNlckZvclRleHQodHh0ID0gJycpIHtcbiAgICB2YXIgcGFyc2VyO1xuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7XG4gICAgICBpbkluc3RhbmNlOiB0aGlzXG4gICAgfSk7XG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG4gICAgcmV0dXJuIHBhcnNlcjtcbiAgfVxuXG4gIGdldEluZGVudCgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZvcm1hdEluZGVudCh0ZXh0KSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx0L2csICcgICcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhcHBseUluZGVudCh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5pbmRlbnROb3RGaXJzdCh0ZXh0LCB0aGlzLmdldEluZGVudCgpLCBcIiBcIik7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFByb2Nlc3MgfSBmcm9tICcuL1Byb2Nlc3MnO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgfSBmcm9tICcuL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9Mb2dnZXInO1xuaW1wb3J0IHsgUG9zQ29sbGVjdGlvbiB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IENsb3NpbmdQcm9tcCB9IGZyb20gJy4vQ2xvc2luZ1Byb21wJztcblxuZXhwb3J0IGNsYXNzIENvZGV3YXZlXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIENvZGV3YXZlLmluaXQoKVxuICAgIEBtYXJrZXIgPSAnW1tbW2NvZGV3YXZlX21hcnF1ZXJdXV1dJ1xuICAgIEB2YXJzID0ge31cbiAgICBcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICdicmFrZXRzJyA6ICd+ficsXG4gICAgICAnZGVjbycgOiAnficsXG4gICAgICAnY2xvc2VDaGFyJyA6ICcvJyxcbiAgICAgICdub0V4ZWN1dGVDaGFyJyA6ICchJyxcbiAgICAgICdjYXJyZXRDaGFyJyA6ICd8JyxcbiAgICAgICdjaGVja0NhcnJldCcgOiB0cnVlLFxuICAgICAgJ2luSW5zdGFuY2UnIDogbnVsbFxuICAgIH1cbiAgICBAcGFyZW50ID0gb3B0aW9uc1sncGFyZW50J11cbiAgICBcbiAgICBAbmVzdGVkID0gaWYgQHBhcmVudD8gdGhlbiBAcGFyZW50Lm5lc3RlZCsxIGVsc2UgMFxuICAgIFxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIEBlZGl0b3IuYmluZGVkVG8odGhpcykgaWYgQGVkaXRvcj9cbiAgICBcbiAgICBAY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMpXG4gICAgaWYgQGluSW5zdGFuY2U/XG4gICAgICBAY29udGV4dC5wYXJlbnQgPSBAaW5JbnN0YW5jZS5jb250ZXh0XG5cbiAgICBAbG9nZ2VyID0gbmV3IExvZ2dlcigpXG5cbiAgb25BY3RpdmF0aW9uS2V5OiAtPlxuICAgIEBwcm9jZXNzID0gbmV3IFByb2Nlc3MoKVxuICAgIEBsb2dnZXIubG9nKCdhY3RpdmF0aW9uIGtleScpXG4gICAgQHJ1bkF0Q3Vyc29yUG9zKCkudGhlbiA9PlxuICAgICAgQHByb2Nlc3MgPSBudWxsXG4gIHJ1bkF0Q3Vyc29yUG9zOiAtPlxuICAgIGlmIEBlZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgICBAcnVuQXRNdWx0aVBvcyhAZWRpdG9yLmdldE11bHRpU2VsKCkpXG4gICAgZWxzZVxuICAgICAgQHJ1bkF0UG9zKEBlZGl0b3IuZ2V0Q3Vyc29yUG9zKCkpXG4gIHJ1bkF0UG9zOiAocG9zKS0+XG4gICAgdW5sZXNzIHBvcz9cbiAgICAgIHRocm93IG5ldyBFcnJvcignQ3Vyc29yIFBvc2l0aW9uIGlzIGVtcHR5JylcbiAgICBAcnVuQXRNdWx0aVBvcyhbcG9zXSlcbiAgcnVuQXRNdWx0aVBvczogKG11bHRpUG9zKS0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMFxuICAgICAgICBjbWQgPSBAY29tbWFuZE9uUG9zKG11bHRpUG9zWzBdLmVuZClcbiAgICAgICAgaWYgY21kP1xuICAgICAgICAgIGlmIG11bHRpUG9zLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcylcbiAgICAgICAgICBjbWQuaW5pdCgpXG4gICAgICAgICAgQGxvZ2dlci5sb2coY21kKVxuICAgICAgICAgIGNtZC5leGVjdXRlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIG11bHRpUG9zWzBdLnN0YXJ0ID09IG11bHRpUG9zWzBdLmVuZFxuICAgICAgICAgICAgQGFkZEJyYWtldHMobXVsdGlQb3MpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHByb21wdENsb3NpbmdDbWQobXVsdGlQb3MpXG4gIGNvbW1hbmRPblBvczogKHBvcykgLT5cbiAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGZvbGxvd2VkQnlCcmFrZXRzKHBvcykgYW5kIEBjb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT0gMSBcbiAgICAgIHByZXYgPSBwb3MtQGJyYWtldHMubGVuZ3RoXG4gICAgICBuZXh0ID0gcG9zXG4gICAgZWxzZVxuICAgICAgaWYgQHByZWNlZGVkQnlCcmFrZXRzKHBvcykgYW5kIEBjb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT0gMFxuICAgICAgICBwb3MgLT0gQGJyYWtldHMubGVuZ3RoXG4gICAgICBwcmV2ID0gQGZpbmRQcmV2QnJha2V0KHBvcylcbiAgICAgIHVubGVzcyBwcmV2P1xuICAgICAgICByZXR1cm4gbnVsbCBcbiAgICAgIG5leHQgPSBAZmluZE5leHRCcmFrZXQocG9zLTEpXG4gICAgICBpZiAhbmV4dD8gb3IgQGNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT0gMCBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLHByZXYsQGVkaXRvci50ZXh0U3Vic3RyKHByZXYsbmV4dCtAYnJha2V0cy5sZW5ndGgpKVxuICBuZXh0Q21kOiAoc3RhcnQgPSAwKSAtPlxuICAgIHBvcyA9IHN0YXJ0XG4gICAgd2hpbGUgZiA9IEBmaW5kQW55TmV4dChwb3MgLFtAYnJha2V0cyxcIlxcblwiXSlcbiAgICAgIHBvcyA9IGYucG9zICsgZi5zdHIubGVuZ3RoXG4gICAgICBpZiBmLnN0ciA9PSBAYnJha2V0c1xuICAgICAgICBpZiBiZWdpbm5pbmc/XG4gICAgICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgYmVnaW5uaW5nLCBAZWRpdG9yLnRleHRTdWJzdHIoYmVnaW5uaW5nLCBmLnBvcytAYnJha2V0cy5sZW5ndGgpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYmVnaW5uaW5nID0gZi5wb3NcbiAgICAgIGVsc2VcbiAgICAgICAgYmVnaW5uaW5nID0gbnVsbFxuICAgIG51bGxcbiAgZ2V0RW5jbG9zaW5nQ21kOiAocG9zID0gMCkgLT5cbiAgICBjcG9zID0gcG9zXG4gICAgY2xvc2luZ1ByZWZpeCA9IEBicmFrZXRzICsgQGNsb3NlQ2hhclxuICAgIHdoaWxlIChwID0gQGZpbmROZXh0KGNwb3MsY2xvc2luZ1ByZWZpeCkpP1xuICAgICAgaWYgY21kID0gQGNvbW1hbmRPblBvcyhwK2Nsb3NpbmdQcmVmaXgubGVuZ3RoKVxuICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpXG4gICAgICAgIGlmIGNtZC5wb3MgPCBwb3NcbiAgICAgICAgICByZXR1cm4gY21kXG4gICAgICBlbHNlXG4gICAgICAgIGNwb3MgPSBwK2Nsb3NpbmdQcmVmaXgubGVuZ3RoXG4gICAgbnVsbFxuICBwcmVjZWRlZEJ5QnJha2V0czogKHBvcykgLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcy1AYnJha2V0cy5sZW5ndGgscG9zKSA9PSBAYnJha2V0c1xuICBmb2xsb3dlZEJ5QnJha2V0czogKHBvcykgLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrQGJyYWtldHMubGVuZ3RoKSA9PSBAYnJha2V0c1xuICBjb3VudFByZXZCcmFrZXQ6IChzdGFydCkgLT4gXG4gICAgaSA9IDBcbiAgICB3aGlsZSAoc3RhcnQgPSBAZmluZFByZXZCcmFrZXQoc3RhcnQpKT9cbiAgICAgIGkrK1xuICAgIHJldHVybiBpXG4gIGlzRW5kTGluZTogKHBvcykgLT4gXG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dFN1YnN0cihwb3MscG9zKzEpID09IFwiXFxuXCIgb3IgcG9zICsgMSA+PSBAZWRpdG9yLnRleHRMZW4oKVxuICBmaW5kUHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICByZXR1cm4gQGZpbmROZXh0QnJha2V0KHN0YXJ0LC0xKVxuICBmaW5kTmV4dEJyYWtldDogKHN0YXJ0LGRpcmVjdGlvbiA9IDEpIC0+IFxuICAgIGYgPSBAZmluZEFueU5leHQoc3RhcnQgLFtAYnJha2V0cyxcIlxcblwiXSwgZGlyZWN0aW9uKVxuICAgIFxuICAgIGYucG9zIGlmIGYgYW5kIGYuc3RyID09IEBicmFrZXRzXG4gIGZpbmRQcmV2OiAoc3RhcnQsc3RyaW5nKSAtPiBcbiAgICByZXR1cm4gQGZpbmROZXh0KHN0YXJ0LHN0cmluZywtMSlcbiAgZmluZE5leHQ6IChzdGFydCxzdHJpbmcsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW3N0cmluZ10sIGRpcmVjdGlvbilcbiAgICBmLnBvcyBpZiBmXG4gIFxuICBmaW5kQW55TmV4dDogKHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgcmV0dXJuIEBlZGl0b3IuZmluZEFueU5leHQoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24pXG4gICAgXG4gIGZpbmRNYXRjaGluZ1BhaXI6IChzdGFydFBvcyxvcGVuaW5nLGNsb3NpbmcsZGlyZWN0aW9uID0gMSkgLT5cbiAgICBwb3MgPSBzdGFydFBvc1xuICAgIG5lc3RlZCA9IDBcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyxbY2xvc2luZyxvcGVuaW5nXSxkaXJlY3Rpb24pXG4gICAgICBwb3MgPSBmLnBvcyArIChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gZi5zdHIubGVuZ3RoIGVsc2UgMClcbiAgICAgIGlmIGYuc3RyID09IChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gY2xvc2luZyBlbHNlIG9wZW5pbmcpXG4gICAgICAgIGlmIG5lc3RlZCA+IDBcbiAgICAgICAgICBuZXN0ZWQtLVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGZcbiAgICAgIGVsc2VcbiAgICAgICAgbmVzdGVkKytcbiAgICBudWxsXG4gIGFkZEJyYWtldHM6IChwb3MpIC0+XG4gICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKVxuICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKEBicmFrZXRzLEBicmFrZXRzKS5tYXAoIChyKS0+ci5zZWxlY3RDb250ZW50KCkgKVxuICAgIEBlZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICBwcm9tcHRDbG9zaW5nQ21kOiAoc2VsZWN0aW9ucykgLT5cbiAgICBAY2xvc2luZ1Byb21wLnN0b3AoKSBpZiBAY2xvc2luZ1Byb21wP1xuICAgIEBjbG9zaW5nUHJvbXAgPSBDbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsc2VsZWN0aW9ucykuYmVnaW4oKVxuICBwYXJzZUFsbDogKHJlY3Vyc2l2ZSA9IHRydWUpIC0+XG4gICAgaWYgQG5lc3RlZCA+IDEwMFxuICAgICAgdGhyb3cgXCJJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvblwiXG4gICAgcG9zID0gMFxuICAgIHdoaWxlIGNtZCA9IEBuZXh0Q21kKHBvcylcbiAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKVxuICAgICAgQGVkaXRvci5zZXRDdXJzb3JQb3MocG9zKVxuICAgICAgIyBjb25zb2xlLmxvZyhjbWQpXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiByZWN1cnNpdmUgYW5kIGNtZC5jb250ZW50PyBhbmQgKCFjbWQuZ2V0Q21kKCk/IG9yICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSlcbiAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge3BhcmVudDogdGhpc30pXG4gICAgICAgIGNtZC5jb250ZW50ID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIHJlcyA9ICBjbWQuZXhlY3V0ZSgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGlmIHJlcy50aGVuP1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN5bmMgbmVzdGVkIGNvbW1hbmRzIGFyZSBub3Qgc3VwcG9ydGVkJylcbiAgICAgICAgaWYgY21kLnJlcGxhY2VFbmQ/XG4gICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBvcyA9IEBlZGl0b3IuZ2V0Q3Vyc29yUG9zKCkuZW5kXG4gICAgcmV0dXJuIEBnZXRUZXh0KClcbiAgZ2V0VGV4dDogLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0KClcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD8gYW5kICghQGluSW5zdGFuY2U/IG9yICFAaW5JbnN0YW5jZS5maW5kZXI/KVxuICBnZXRSb290OiAtPlxuICAgIGlmIEBpc1Jvb3QoKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICBlbHNlIGlmIEBwYXJlbnQ/XG4gICAgICByZXR1cm4gQHBhcmVudC5nZXRSb290KClcbiAgICBlbHNlIGlmIEBpbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBpbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICBnZXRGaWxlU3lzdGVtOiAtPlxuICAgIGlmIEBlZGl0b3IuZmlsZVN5c3RlbVxuICAgICAgcmV0dXJuIEBlZGl0b3IuZmlsZVN5c3RlbVxuICAgIGVsc2UgaWYgQGlzUm9vdCgpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIGVsc2UgaWYgQHBhcmVudD9cbiAgICAgIHJldHVybiBAcGFyZW50LmdldFJvb3QoKVxuICAgIGVsc2UgaWYgQGluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpXG4gIHJlbW92ZUNhcnJldDogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsQGNhcnJldENoYXIpXG4gIGdldENhcnJldFBvczogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldENhcnJldFBvcyh0eHQsQGNhcnJldENoYXIpXG4gIHJlZ01hcmtlcjogKGZsYWdzPVwiZ1wiKSAtPlxuICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQG1hcmtlciksIGZsYWdzKVxuICByZW1vdmVNYXJrZXJzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKEByZWdNYXJrZXIoKSwnJylcblxuICBAaW5pdDogLT5cbiAgICB1bmxlc3MgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIENvbW1hbmQuaW5pdENtZHMoKVxuICAgICAgQ29tbWFuZC5sb2FkQ21kcygpXG5cbiAgQGluaXRlZDogZmFsc2UiLCJpbXBvcnQge1xuICBQcm9jZXNzXG59IGZyb20gJy4vUHJvY2Vzcyc7XG5cbmltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgUG9zaXRpb25lZENtZEluc3RhbmNlXG59IGZyb20gJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJztcblxuaW1wb3J0IHtcbiAgVGV4dFBhcnNlclxufSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIExvZ2dlclxufSBmcm9tICcuL0xvZ2dlcic7XG5cbmltcG9ydCB7XG4gIFBvc0NvbGxlY3Rpb25cbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDbG9zaW5nUHJvbXBcbn0gZnJvbSAnLi9DbG9zaW5nUHJvbXAnO1xuXG5leHBvcnQgdmFyIENvZGV3YXZlID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBDb2Rld2F2ZSB7XG4gICAgY29uc3RydWN0b3IoZWRpdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICAgIENvZGV3YXZlLmluaXQoKTtcbiAgICAgIHRoaXMubWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSc7XG4gICAgICB0aGlzLnZhcnMgPSB7fTtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAnYnJha2V0cyc6ICd+ficsXG4gICAgICAgICdkZWNvJzogJ34nLFxuICAgICAgICAnY2xvc2VDaGFyJzogJy8nLFxuICAgICAgICAnbm9FeGVjdXRlQ2hhcic6ICchJyxcbiAgICAgICAgJ2NhcnJldENoYXInOiAnfCcsXG4gICAgICAgICdjaGVja0NhcnJldCc6IHRydWUsXG4gICAgICAgICdpbkluc3RhbmNlJzogbnVsbFxuICAgICAgfTtcbiAgICAgIHRoaXMucGFyZW50ID0gb3B0aW9uc1sncGFyZW50J107XG4gICAgICB0aGlzLm5lc3RlZCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC5uZXN0ZWQgKyAxIDogMDtcbiAgICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgfSBlbHNlIGlmICgodGhpcy5wYXJlbnQgIT0gbnVsbCkgJiYga2V5ICE9PSAncGFyZW50Jykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lZGl0b3IgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmVkaXRvci5iaW5kZWRUbyh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMpO1xuICAgICAgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5wYXJlbnQgPSB0aGlzLmluSW5zdGFuY2UuY29udGV4dDtcbiAgICAgIH1cbiAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgIH1cblxuICAgIG9uQWN0aXZhdGlvbktleSgpIHtcbiAgICAgIHRoaXMucHJvY2VzcyA9IG5ldyBQcm9jZXNzKCk7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ2FjdGl2YXRpb24ga2V5Jyk7XG4gICAgICByZXR1cm4gdGhpcy5ydW5BdEN1cnNvclBvcygpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJ1bkF0Q3Vyc29yUG9zKCkge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKHRoaXMuZWRpdG9yLmdldE11bHRpU2VsKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuQXRQb3ModGhpcy5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJ1bkF0UG9zKHBvcykge1xuICAgICAgaWYgKHBvcyA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ3Vyc29yIFBvc2l0aW9uIGlzIGVtcHR5Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKFtwb3NdKTtcbiAgICB9XG5cbiAgICBydW5BdE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBjbWQ7XG4gICAgICAgIGlmIChtdWx0aVBvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY21kID0gdGhpcy5jb21tYW5kT25Qb3MobXVsdGlQb3NbMF0uZW5kKTtcbiAgICAgICAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbWQuaW5pdCgpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGNtZCk7XG4gICAgICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zWzBdLnN0YXJ0ID09PSBtdWx0aVBvc1swXS5lbmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQnJha2V0cyhtdWx0aVBvcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9tcHRDbG9zaW5nQ21kKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbW1hbmRPblBvcyhwb3MpIHtcbiAgICAgIHZhciBuZXh0LCBwcmV2O1xuICAgICAgaWYgKHRoaXMucHJlY2VkZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmZvbGxvd2VkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDEpIHtcbiAgICAgICAgcHJldiA9IHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGg7XG4gICAgICAgIG5leHQgPSBwb3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09PSAwKSB7XG4gICAgICAgICAgcG9zIC09IHRoaXMuYnJha2V0cy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IHRoaXMuZmluZFByZXZCcmFrZXQocG9zKTtcbiAgICAgICAgaWYgKHByZXYgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIG5leHQgPSB0aGlzLmZpbmROZXh0QnJha2V0KHBvcyAtIDEpO1xuICAgICAgICBpZiAoKG5leHQgPT0gbnVsbCkgfHwgdGhpcy5jb3VudFByZXZCcmFrZXQocHJldikgJSAyICE9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIHByZXYsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocHJldiwgbmV4dCArIHRoaXMuYnJha2V0cy5sZW5ndGgpKTtcbiAgICB9XG5cbiAgICBuZXh0Q21kKHN0YXJ0ID0gMCkge1xuICAgICAgdmFyIGJlZ2lubmluZywgZiwgcG9zO1xuICAgICAgcG9zID0gc3RhcnQ7XG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSkpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGg7XG4gICAgICAgIGlmIChmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBiZWdpbm5pbmcgIT09IFwidW5kZWZpbmVkXCIgJiYgYmVnaW5uaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIoYmVnaW5uaW5nLCBmLnBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmVnaW5uaW5nID0gZi5wb3M7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJlZ2lubmluZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldEVuY2xvc2luZ0NtZChwb3MgPSAwKSB7XG4gICAgICB2YXIgY2xvc2luZ1ByZWZpeCwgY21kLCBjcG9zLCBwO1xuICAgICAgY3BvcyA9IHBvcztcbiAgICAgIGNsb3NpbmdQcmVmaXggPSB0aGlzLmJyYWtldHMgKyB0aGlzLmNsb3NlQ2hhcjtcbiAgICAgIHdoaWxlICgocCA9IHRoaXMuZmluZE5leHQoY3BvcywgY2xvc2luZ1ByZWZpeCkpICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGNtZCA9IHRoaXMuY29tbWFuZE9uUG9zKHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aCkpIHtcbiAgICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpO1xuICAgICAgICAgIGlmIChjbWQucG9zIDwgcG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gY21kO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcG9zID0gcCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGgsIHBvcykgPT09IHRoaXMuYnJha2V0cztcbiAgICB9XG5cbiAgICBmb2xsb3dlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcywgcG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkgPT09IHRoaXMuYnJha2V0cztcbiAgICB9XG5cbiAgICBjb3VudFByZXZCcmFrZXQoc3RhcnQpIHtcbiAgICAgIHZhciBpO1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoKHN0YXJ0ID0gdGhpcy5maW5kUHJldkJyYWtldChzdGFydCkpICE9IG51bGwpIHtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuXG4gICAgaXNFbmRMaW5lKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyAxKSA9PT0gXCJcXG5cIiB8fCBwb3MgKyAxID49IHRoaXMuZWRpdG9yLnRleHRMZW4oKTtcbiAgICB9XG5cbiAgICBmaW5kUHJldkJyYWtldChzdGFydCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHRCcmFrZXQoc3RhcnQsIC0xKTtcbiAgICB9XG5cbiAgICBmaW5kTmV4dEJyYWtldChzdGFydCwgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGY7XG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3RoaXMuYnJha2V0cywgXCJcXG5cIl0sIGRpcmVjdGlvbik7XG4gICAgICBpZiAoZiAmJiBmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgIHJldHVybiBmLnBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldihzdGFydCwgc3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dChzdGFydCwgc3RyaW5nLCAtMSk7XG4gICAgfVxuXG4gICAgZmluZE5leHQoc3RhcnQsIHN0cmluZywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGY7XG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3N0cmluZ10sIGRpcmVjdGlvbik7XG4gICAgICBpZiAoZikge1xuICAgICAgICByZXR1cm4gZi5wb3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5maW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBmaW5kTWF0Y2hpbmdQYWlyKHN0YXJ0UG9zLCBvcGVuaW5nLCBjbG9zaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZiwgbmVzdGVkLCBwb3M7XG4gICAgICBwb3MgPSBzdGFydFBvcztcbiAgICAgIG5lc3RlZCA9IDA7XG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbY2xvc2luZywgb3BlbmluZ10sIGRpcmVjdGlvbikpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyAoZGlyZWN0aW9uID4gMCA/IGYuc3RyLmxlbmd0aCA6IDApO1xuICAgICAgICBpZiAoZi5zdHIgPT09IChkaXJlY3Rpb24gPiAwID8gY2xvc2luZyA6IG9wZW5pbmcpKSB7XG4gICAgICAgICAgaWYgKG5lc3RlZCA+IDApIHtcbiAgICAgICAgICAgIG5lc3RlZC0tO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmVzdGVkKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFkZEJyYWtldHMocG9zKSB7XG4gICAgICB2YXIgcmVwbGFjZW1lbnRzO1xuICAgICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKTtcbiAgICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKHRoaXMuYnJha2V0cywgdGhpcy5icmFrZXRzKS5tYXAoZnVuY3Rpb24ocikge1xuICAgICAgICByZXR1cm4gci5zZWxlY3RDb250ZW50KCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICAgIH1cblxuICAgIHByb21wdENsb3NpbmdDbWQoc2VsZWN0aW9ucykge1xuICAgICAgaWYgKHRoaXMuY2xvc2luZ1Byb21wICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbG9zaW5nUHJvbXAuc3RvcCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wLm5ld0Zvcih0aGlzLCBzZWxlY3Rpb25zKS5iZWdpbigpO1xuICAgIH1cblxuICAgIHBhcnNlQWxsKHJlY3Vyc2l2ZSA9IHRydWUpIHtcbiAgICAgIHZhciBjbWQsIHBhcnNlciwgcG9zLCByZXM7XG4gICAgICBpZiAodGhpcy5uZXN0ZWQgPiAxMDApIHtcbiAgICAgICAgdGhyb3cgXCJJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvblwiO1xuICAgICAgfVxuICAgICAgcG9zID0gMDtcbiAgICAgIHdoaWxlIChjbWQgPSB0aGlzLm5leHRDbWQocG9zKSkge1xuICAgICAgICBwb3MgPSBjbWQuZ2V0RW5kUG9zKCk7XG4gICAgICAgIHRoaXMuZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhjbWQpXG4gICAgICAgIGNtZC5pbml0KCk7XG4gICAgICAgIGlmIChyZWN1cnNpdmUgJiYgKGNtZC5jb250ZW50ICE9IG51bGwpICYmICgoY21kLmdldENtZCgpID09IG51bGwpIHx8ICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSkpIHtcbiAgICAgICAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIoY21kLmNvbnRlbnQpLCB7XG4gICAgICAgICAgICBwYXJlbnQ6IHRoaXNcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IGNtZC5leGVjdXRlKCk7XG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIGlmIChyZXMudGhlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzeW5jIG5lc3RlZCBjb21tYW5kcyBhcmUgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY21kLnJlcGxhY2VFbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldFRleHQoKTtcbiAgICB9XG5cbiAgICBnZXRUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHQoKTtcbiAgICB9XG5cbiAgICBpc1Jvb3QoKSB7XG4gICAgICByZXR1cm4gKHRoaXMucGFyZW50ID09IG51bGwpICYmICgodGhpcy5pbkluc3RhbmNlID09IG51bGwpIHx8ICh0aGlzLmluSW5zdGFuY2UuZmluZGVyID09IG51bGwpKTtcbiAgICB9XG5cbiAgICBnZXRSb290KCkge1xuICAgICAgaWYgKHRoaXMuaXNSb290KCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RmlsZVN5c3RlbSgpIHtcbiAgICAgIGlmICh0aGlzLmVkaXRvci5maWxlU3lzdGVtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVkaXRvci5maWxlU3lzdGVtO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRSb290KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUNhcnJldCh0eHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHR4dCwgdGhpcy5jYXJyZXRDaGFyKTtcbiAgICB9XG5cbiAgICBnZXRDYXJyZXRQb3ModHh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldENhcnJldFBvcyh0eHQsIHRoaXMuY2FycmV0Q2hhcik7XG4gICAgfVxuXG4gICAgcmVnTWFya2VyKGZsYWdzID0gXCJnXCIpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5tYXJrZXIpLCBmbGFncyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWFya2Vycyh0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHRoaXMucmVnTWFya2VyKCksICcnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdCgpIHtcbiAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgICBDb21tYW5kLmluaXRDbWRzKCk7XG4gICAgICAgIHJldHVybiBDb21tYW5kLmxvYWRDbWRzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gIH07XG5cbiAgQ29kZXdhdmUuaW5pdGVkID0gZmFsc2U7XG5cbiAgcmV0dXJuIENvZGV3YXZlO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFN0b3JhZ2UgfSBmcm9tICcuL1N0b3JhZ2UnO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cblxuX29wdEtleSA9IChrZXksZGljdCxkZWZWYWwgPSBudWxsKSAtPlxuICAjIG9wdGlvbmFsIERpY3Rpb25hcnkga2V5XG4gIHJldHVybiBpZiBrZXkgb2YgZGljdCB0aGVuIGRpY3Rba2V5XSBlbHNlIGRlZlZhbFxuXG5cbmV4cG9ydCBjbGFzcyBDb21tYW5kXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsQGRhdGE9bnVsbCxwYXJlbnQ9bnVsbCkgLT5cbiAgICBAY21kcyA9IFtdXG4gICAgQGRldGVjdG9ycyA9IFtdXG4gICAgQGV4ZWN1dGVGdW5jdCA9IEByZXN1bHRGdW5jdCA9IEByZXN1bHRTdHIgPSBAYWxpYXNPZiA9IEBjbHMgPSBudWxsXG4gICAgQGFsaWFzZWQgPSBudWxsXG4gICAgQGZ1bGxOYW1lID0gQG5hbWVcbiAgICBAZGVwdGggPSAwXG4gICAgW0BfcGFyZW50LCBAX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdXG4gICAgQHNldFBhcmVudChwYXJlbnQpXG4gICAgQGRlZmF1bHRzID0ge31cbiAgICBcbiAgICBAZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBuYW1lVG9QYXJhbTogbnVsbCxcbiAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgYmVmb3JlRXhlY3V0ZTogbnVsbCxcbiAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgIHJlcGxhY2VCb3g6IGZhbHNlLFxuICAgICAgYWxsb3dlZE5hbWVkOiBudWxsXG4gICAgfVxuICAgIEBvcHRpb25zID0ge31cbiAgICBAZmluYWxPcHRpb25zID0gbnVsbFxuICBwYXJlbnQ6IC0+XG4gICAgcmV0dXJuIEBfcGFyZW50XG4gIHNldFBhcmVudDogKHZhbHVlKSAtPlxuICAgIGlmIEBfcGFyZW50ICE9IHZhbHVlXG4gICAgICBAX3BhcmVudCA9IHZhbHVlXG4gICAgICBAZnVsbE5hbWUgPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQubmFtZT9cbiAgICAgICAgICBAX3BhcmVudC5mdWxsTmFtZSArICc6JyArIEBuYW1lIFxuICAgICAgICBlbHNlIFxuICAgICAgICAgIEBuYW1lXG4gICAgICApXG4gICAgICBAZGVwdGggPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQuZGVwdGg/XG4gICAgICAgIHRoZW4gQF9wYXJlbnQuZGVwdGggKyAxXG4gICAgICAgIGVsc2UgMFxuICAgICAgKVxuICBpbml0OiAtPlxuICAgIGlmICFAX2luaXRlZFxuICAgICAgQF9pbml0ZWQgPSB0cnVlXG4gICAgICBAcGFyc2VEYXRhKEBkYXRhKVxuICAgIHJldHVybiB0aGlzXG4gIHVucmVnaXN0ZXI6IC0+XG4gICAgQF9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpXG4gIGlzRWRpdGFibGU6IC0+XG4gICAgcmV0dXJuIEByZXN1bHRTdHI/IG9yIEBhbGlhc09mP1xuICBpc0V4ZWN1dGFibGU6IC0+XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgZm9yIHAgaW4gWydyZXN1bHRTdHInLCdyZXN1bHRGdW5jdCcsJ2NscycsJ2V4ZWN1dGVGdW5jdCddXG4gICAgICBpZiB0aGlzW3BdP1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICBpc0V4ZWN1dGFibGVXaXRoTmFtZTogKG5hbWUpIC0+XG4gICAgaWYgQGFsaWFzT2Y/XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgYWxpYXNPZiA9IEBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsbmFtZSlcbiAgICAgIGFsaWFzZWQgPSBAX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKGFsaWFzT2YpKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gQGlzRXhlY3V0YWJsZSgpXG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICBmb3IgcCBpbiBbJ3Jlc3VsdFN0cicsJ3Jlc3VsdEZ1bmN0J11cbiAgICAgIGlmIHRoaXNbcF0/XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldERlZmF1bHRzOiAtPlxuICAgIHJlcyA9IHt9XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBkZWZhdWx0cylcbiAgICByZXR1cm4gcmVzXG4gIF9hbGlhc2VkRnJvbUZpbmRlcjogKGZpbmRlcikgLT5cbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2VcbiAgICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAYWxpYXNPZj9cbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICByZXR1cm4gQF9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihAYWxpYXNPZikpXG4gIGdldEFsaWFzZWRPclRoaXM6IC0+XG4gICAgQGdldEFsaWFzZWQoKSB8fCB0aGlzXG4gIHNldE9wdGlvbnM6IChkYXRhKSAtPlxuICAgIGZvciBrZXksIHZhbCBvZiBkYXRhXG4gICAgICBpZiBrZXkgb2YgQGRlZmF1bHRPcHRpb25zXG4gICAgICAgIEBvcHRpb25zW2tleV0gPSB2YWxcbiAgX29wdGlvbnNGb3JBbGlhc2VkOiAoYWxpYXNlZCkgLT5cbiAgICBvcHQgPSB7fVxuICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LEBkZWZhdWx0T3B0aW9ucylcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsYWxpYXNlZC5nZXRPcHRpb25zKCkpXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0LEBvcHRpb25zKVxuICBnZXRPcHRpb25zOiAtPlxuICAgIHJldHVybiBAX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gIGhlbHA6IC0+XG4gICAgY21kID0gQGdldENtZCgnaGVscCcpXG4gICAgaWYgY21kP1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkucmVzdWx0U3RyXG4gIHBhcnNlRGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBkYXRhXG4gICAgaWYgdHlwZW9mIGRhdGEgPT0gJ3N0cmluZydcbiAgICAgIEByZXN1bHRTdHIgPSBkYXRhXG4gICAgICBAb3B0aW9uc1sncGFyc2UnXSA9IHRydWVcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZSBpZiBkYXRhP1xuICAgICAgcmV0dXJuIEBwYXJzZURpY3REYXRhKGRhdGEpXG4gICAgcmV0dXJuIGZhbHNlXG4gIHBhcnNlRGljdERhdGE6IChkYXRhKSAtPlxuICAgIHJlcyA9IF9vcHRLZXkoJ3Jlc3VsdCcsZGF0YSlcbiAgICBpZiB0eXBlb2YgcmVzID09IFwiZnVuY3Rpb25cIlxuICAgICAgQHJlc3VsdEZ1bmN0ID0gcmVzXG4gICAgZWxzZSBpZiByZXM/XG4gICAgICBAcmVzdWx0U3RyID0gcmVzXG4gICAgICBAb3B0aW9uc1sncGFyc2UnXSA9IHRydWVcbiAgICBleGVjdXRlID0gX29wdEtleSgnZXhlY3V0ZScsZGF0YSlcbiAgICBpZiB0eXBlb2YgZXhlY3V0ZSA9PSBcImZ1bmN0aW9uXCJcbiAgICAgIEBleGVjdXRlRnVuY3QgPSBleGVjdXRlXG4gICAgQGFsaWFzT2YgPSBfb3B0S2V5KCdhbGlhc09mJyxkYXRhKVxuICAgIEBjbHMgPSBfb3B0S2V5KCdjbHMnLGRhdGEpXG4gICAgQGRlZmF1bHRzID0gX29wdEtleSgnZGVmYXVsdHMnLGRhdGEsQGRlZmF1bHRzKVxuICAgIFxuICAgIEBzZXRPcHRpb25zKGRhdGEpXG4gICAgXG4gICAgaWYgJ2hlbHAnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLGRhdGFbJ2hlbHAnXSx0aGlzKSlcbiAgICBpZiAnZmFsbGJhY2snIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2ZhbGxiYWNrJyxkYXRhWydmYWxsYmFjayddLHRoaXMpKVxuICAgICAgXG4gICAgaWYgJ2NtZHMnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWRzKGRhdGFbJ2NtZHMnXSlcbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDbWRzOiAoY21kcykgLT5cbiAgICBmb3IgbmFtZSwgZGF0YSBvZiBjbWRzXG4gICAgICBAYWRkQ21kKG5ldyBDb21tYW5kKG5hbWUsZGF0YSx0aGlzKSlcbiAgYWRkQ21kOiAoY21kKSAtPlxuICAgIGV4aXN0cyA9IEBnZXRDbWQoY21kLm5hbWUpXG4gICAgaWYgZXhpc3RzP1xuICAgICAgQHJlbW92ZUNtZChleGlzdHMpXG4gICAgY21kLnNldFBhcmVudCh0aGlzKVxuICAgIEBjbWRzLnB1c2goY21kKVxuICAgIHJldHVybiBjbWRcbiAgcmVtb3ZlQ21kOiAoY21kKSAtPlxuICAgIGlmIChpID0gQGNtZHMuaW5kZXhPZihjbWQpKSA+IC0xXG4gICAgICBAY21kcy5zcGxpY2UoaSwgMSlcbiAgICByZXR1cm4gY21kXG4gIGdldENtZDogKGZ1bGxuYW1lKSAtPlxuICAgIEBpbml0KClcbiAgICBbc3BhY2UsbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSlcbiAgICBpZiBzcGFjZT9cbiAgICAgIHJldHVybiBAZ2V0Q21kKHNwYWNlKT8uZ2V0Q21kKG5hbWUpXG4gICAgZm9yIGNtZCBpbiBAY21kc1xuICAgICAgaWYgY21kLm5hbWUgPT0gbmFtZVxuICAgICAgICByZXR1cm4gY21kXG4gIHNldENtZERhdGE6IChmdWxsbmFtZSxkYXRhKSAtPlxuICAgIEBzZXRDbWQoZnVsbG5hbWUsbmV3IENvbW1hbmQoZnVsbG5hbWUuc3BsaXQoJzonKS5wb3AoKSxkYXRhKSlcbiAgc2V0Q21kOiAoZnVsbG5hbWUsY21kKSAtPlxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgbmV4dCA9IEBnZXRDbWQoc3BhY2UpXG4gICAgICB1bmxlc3MgbmV4dD9cbiAgICAgICAgbmV4dCA9IEBhZGRDbWQobmV3IENvbW1hbmQoc3BhY2UpKVxuICAgICAgcmV0dXJuIG5leHQuc2V0Q21kKG5hbWUsY21kKVxuICAgIGVsc2VcbiAgICAgIEBhZGRDbWQoY21kKVxuICAgICAgcmV0dXJuIGNtZFxuICBhZGREZXRlY3RvcjogKGRldGVjdG9yKSAtPlxuICAgIEBkZXRlY3RvcnMucHVzaChkZXRlY3RvcilcbiAgICBcbiAgQHByb3ZpZGVycyA9IFtdXG5cbiAgQHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG5cbiAgQGluaXRDbWRzOiAtPlxuICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwse1xuICAgICAgJ2NtZHMnOntcbiAgICAgICAgJ2hlbGxvJzp7XG4gICAgICAgICAgaGVscDogXCJcIlwiXG4gICAgICAgICAgXCJIZWxsbywgd29ybGQhXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cbiAgICAgICAgICBtb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cbiAgICAgICAgICB2ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWFcbiAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICByZXN1bHQ6ICdIZWxsbywgV29ybGQhJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBmb3IgcHJvdmlkZXIgaW4gQHByb3ZpZGVyc1xuICAgICAgcHJvdmlkZXIucmVnaXN0ZXIoQ29tbWFuZC5jbWRzKVxuXG4gIEBzYXZlQ21kOiAoZnVsbG5hbWUsIGRhdGEpIC0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsZGF0YSlcbiAgICAudGhlbiA9PlxuICAgICAgQHN0b3JhZ2Uuc2F2ZUluUGF0aCgnY21kcycsIGZ1bGxuYW1lLCBkYXRhKVxuXG4gIEBsb2FkQ21kczogLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBzYXZlZENtZHMgPSBAc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAudGhlbiAoc2F2ZWRDbWRzKT0+XG4gICAgICBpZiBzYXZlZENtZHM/IFxuICAgICAgICBmb3IgZnVsbG5hbWUsIGRhdGEgb2Ygc2F2ZWRDbWRzXG4gICAgICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpXG5cbiAgQHJlc2V0U2F2ZWQ6IC0+XG4gICAgQHN0b3JhZ2Uuc2F2ZSgnY21kcycse30pXG5cbiAgQG1ha2VWYXJDbWQgPSAobmFtZSxiYXNlPXt9KSAtPiBcbiAgICBiYXNlLmV4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWwgaWYgdmFsP1xuICAgIHJldHVybiBiYXNlXG5cbiAgQG1ha2VCb29sVmFyQ21kID0gKG5hbWUsYmFzZT17fSkgLT4gXG4gICAgYmFzZS5leGVjdXRlID0gKGluc3RhbmNlKSAtPlxuICAgICAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSk/XG4gICAgICAgIHBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UuY29udGVudFxuICAgICAgICBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgdmFsPyBhbmQgdmFsIGluIFsnMCcsJ2ZhbHNlJywnbm8nXVxuICAgICAgICBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdHJ1ZVxuICAgIHJldHVybiBiYXNlXG4gIFxuXG5leHBvcnQgY2xhc3MgQmFzZUNvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAaW5zdGFuY2UpIC0+XG4gIGluaXQ6IC0+XG4gICAgI1xuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICByZXR1cm4gdGhpc1tcInJlc3VsdFwiXT9cbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgcmV0dXJuIHt9XG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIHt9XG4gICAgICAiLCJ2YXIgX29wdEtleTtcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBTdG9yYWdlXG59IGZyb20gJy4vU3RvcmFnZSc7XG5cbmltcG9ydCB7XG4gIE5hbWVzcGFjZUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuX29wdEtleSA9IGZ1bmN0aW9uKGtleSwgZGljdCwgZGVmVmFsID0gbnVsbCkge1xuICAvLyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICBpZiAoa2V5IGluIGRpY3QpIHtcbiAgICByZXR1cm4gZGljdFtrZXldO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkZWZWYWw7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgQ29tbWFuZCA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IobmFtZTEsIGRhdGExID0gbnVsbCwgcGFyZW50ID0gbnVsbCkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTE7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhMTtcbiAgICAgIHRoaXMuY21kcyA9IFtdO1xuICAgICAgdGhpcy5kZXRlY3RvcnMgPSBbXTtcbiAgICAgIHRoaXMuZXhlY3V0ZUZ1bmN0ID0gdGhpcy5yZXN1bHRGdW5jdCA9IHRoaXMucmVzdWx0U3RyID0gdGhpcy5hbGlhc09mID0gdGhpcy5jbHMgPSBudWxsO1xuICAgICAgdGhpcy5hbGlhc2VkID0gbnVsbDtcbiAgICAgIHRoaXMuZnVsbE5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICB0aGlzLmRlcHRoID0gMDtcbiAgICAgIFt0aGlzLl9wYXJlbnQsIHRoaXMuX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdO1xuICAgICAgdGhpcy5zZXRQYXJlbnQocGFyZW50KTtcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSB7fTtcbiAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgICBhbHRlclJlc3VsdDogbnVsbCxcbiAgICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgICAgIGFsbG93ZWROYW1lZDogbnVsbFxuICAgICAgfTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgICAgdGhpcy5maW5hbE9wdGlvbnMgPSBudWxsO1xuICAgIH1cblxuICAgIHBhcmVudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgfVxuXG4gICAgc2V0UGFyZW50KHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5fcGFyZW50ICE9PSB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5mdWxsTmFtZSA9ICgodGhpcy5fcGFyZW50ICE9IG51bGwpICYmICh0aGlzLl9wYXJlbnQubmFtZSAhPSBudWxsKSA/IHRoaXMuX3BhcmVudC5mdWxsTmFtZSArICc6JyArIHRoaXMubmFtZSA6IHRoaXMubmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlcHRoID0gKCh0aGlzLl9wYXJlbnQgIT0gbnVsbCkgJiYgKHRoaXMuX3BhcmVudC5kZXB0aCAhPSBudWxsKSA/IHRoaXMuX3BhcmVudC5kZXB0aCArIDEgOiAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wYXJzZURhdGEodGhpcy5kYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50LnJlbW92ZUNtZCh0aGlzKTtcbiAgICB9XG5cbiAgICBpc0VkaXRhYmxlKCkge1xuICAgICAgcmV0dXJuICh0aGlzLnJlc3VsdFN0ciAhPSBudWxsKSB8fCAodGhpcy5hbGlhc09mICE9IG51bGwpO1xuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZSgpIHtcbiAgICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZjtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgICAgfVxuICAgICAgcmVmID0gWydyZXN1bHRTdHInLCAncmVzdWx0RnVuY3QnLCAnY2xzJywgJ2V4ZWN1dGVGdW5jdCddO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal07XG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWUpIHtcbiAgICAgIHZhciBhbGlhc09mLCBhbGlhc2VkLCBjb250ZXh0O1xuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgICBhbGlhc09mID0gdGhpcy5hbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIG5hbWUpO1xuICAgICAgICBhbGlhc2VkID0gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpO1xuICAgICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmlzRXhlY3V0YWJsZSgpO1xuICAgIH1cblxuICAgIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmO1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuICAgICAgcmVmID0gWydyZXN1bHRTdHInLCAncmVzdWx0RnVuY3QnXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcmVmW2pdO1xuICAgICAgICBpZiAodGhpc1twXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXREZWZhdWx0cygpIHtcbiAgICAgIHZhciBhbGlhc2VkLCByZXM7XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5kZWZhdWx0cyk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIF9hbGlhc2VkRnJvbUZpbmRlcihmaW5kZXIpIHtcbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZTtcbiAgICAgIGZpbmRlci5tdXN0RXhlY3V0ZSA9IGZhbHNlO1xuICAgICAgZmluZGVyLnVzZURldGVjdG9ycyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKCk7XG4gICAgfVxuXG4gICAgZ2V0QWxpYXNlZCgpIHtcbiAgICAgIHZhciBjb250ZXh0O1xuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIodGhpcy5hbGlhc09mKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QWxpYXNlZE9yVGhpcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEFsaWFzZWQoKSB8fCB0aGlzO1xuICAgIH1cblxuICAgIHNldE9wdGlvbnMoZGF0YSkge1xuICAgICAgdmFyIGtleSwgcmVzdWx0cywgdmFsO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgICB2YWwgPSBkYXRhW2tleV07XG4gICAgICAgIGlmIChrZXkgaW4gdGhpcy5kZWZhdWx0T3B0aW9ucykge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLm9wdGlvbnNba2V5XSA9IHZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIF9vcHRpb25zRm9yQWxpYXNlZChhbGlhc2VkKSB7XG4gICAgICB2YXIgb3B0O1xuICAgICAgb3B0ID0ge307XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5kZWZhdWx0T3B0aW9ucyk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCBhbGlhc2VkLmdldE9wdGlvbnMoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9ucygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSk7XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9uKGtleSkge1xuICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoZWxwKCkge1xuICAgICAgdmFyIGNtZDtcbiAgICAgIGNtZCA9IHRoaXMuZ2V0Q21kKCdoZWxwJyk7XG4gICAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5pbml0KCkucmVzdWx0U3RyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlRGF0YShkYXRhKSB7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IGRhdGE7XG4gICAgICAgIHRoaXMub3B0aW9uc1sncGFyc2UnXSA9IHRydWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChkYXRhICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEaWN0RGF0YShkYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwYXJzZURpY3REYXRhKGRhdGEpIHtcbiAgICAgIHZhciBleGVjdXRlLCByZXM7XG4gICAgICByZXMgPSBfb3B0S2V5KCdyZXN1bHQnLCBkYXRhKTtcbiAgICAgIGlmICh0eXBlb2YgcmVzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRGdW5jdCA9IHJlcztcbiAgICAgIH0gZWxzZSBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRTdHIgPSByZXM7XG4gICAgICAgIHRoaXMub3B0aW9uc1sncGFyc2UnXSA9IHRydWU7XG4gICAgICB9XG4gICAgICBleGVjdXRlID0gX29wdEtleSgnZXhlY3V0ZScsIGRhdGEpO1xuICAgICAgaWYgKHR5cGVvZiBleGVjdXRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSBleGVjdXRlO1xuICAgICAgfVxuICAgICAgdGhpcy5hbGlhc09mID0gX29wdEtleSgnYWxpYXNPZicsIGRhdGEpO1xuICAgICAgdGhpcy5jbHMgPSBfb3B0S2V5KCdjbHMnLCBkYXRhKTtcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSBfb3B0S2V5KCdkZWZhdWx0cycsIGRhdGEsIHRoaXMuZGVmYXVsdHMpO1xuICAgICAgdGhpcy5zZXRPcHRpb25zKGRhdGEpO1xuICAgICAgaWYgKCdoZWxwJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKCdoZWxwJywgZGF0YVsnaGVscCddLCB0aGlzKSk7XG4gICAgICB9XG4gICAgICBpZiAoJ2ZhbGxiYWNrJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKCdmYWxsYmFjaycsIGRhdGFbJ2ZhbGxiYWNrJ10sIHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIGlmICgnY21kcycgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZHMoZGF0YVsnY21kcyddKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFkZENtZHMoY21kcykge1xuICAgICAgdmFyIGRhdGEsIG5hbWUsIHJlc3VsdHM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKG5hbWUgaW4gY21kcykge1xuICAgICAgICBkYXRhID0gY21kc1tuYW1lXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKG5hbWUsIGRhdGEsIHRoaXMpKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBhZGRDbWQoY21kKSB7XG4gICAgICB2YXIgZXhpc3RzO1xuICAgICAgZXhpc3RzID0gdGhpcy5nZXRDbWQoY21kLm5hbWUpO1xuICAgICAgaWYgKGV4aXN0cyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ21kKGV4aXN0cyk7XG4gICAgICB9XG4gICAgICBjbWQuc2V0UGFyZW50KHRoaXMpO1xuICAgICAgdGhpcy5jbWRzLnB1c2goY21kKTtcbiAgICAgIHJldHVybiBjbWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ21kKGNtZCkge1xuICAgICAgdmFyIGk7XG4gICAgICBpZiAoKGkgPSB0aGlzLmNtZHMuaW5kZXhPZihjbWQpKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuY21kcy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY21kO1xuICAgIH1cblxuICAgIGdldENtZChmdWxsbmFtZSkge1xuICAgICAgdmFyIGNtZCwgaiwgbGVuLCBuYW1lLCByZWYsIHJlZjEsIHNwYWNlO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgICBbc3BhY2UsIG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpO1xuICAgICAgaWYgKHNwYWNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIChyZWYgPSB0aGlzLmdldENtZChzcGFjZSkpICE9IG51bGwgPyByZWYuZ2V0Q21kKG5hbWUpIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgcmVmMSA9IHRoaXMuY21kcztcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgY21kID0gcmVmMVtqXTtcbiAgICAgICAgaWYgKGNtZC5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGNtZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldENtZChmdWxsbmFtZSwgbmV3IENvbW1hbmQoZnVsbG5hbWUuc3BsaXQoJzonKS5wb3AoKSwgZGF0YSkpO1xuICAgIH1cblxuICAgIHNldENtZChmdWxsbmFtZSwgY21kKSB7XG4gICAgICB2YXIgbmFtZSwgbmV4dCwgc3BhY2U7XG4gICAgICBbc3BhY2UsIG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpO1xuICAgICAgaWYgKHNwYWNlICE9IG51bGwpIHtcbiAgICAgICAgbmV4dCA9IHRoaXMuZ2V0Q21kKHNwYWNlKTtcbiAgICAgICAgaWYgKG5leHQgPT0gbnVsbCkge1xuICAgICAgICAgIG5leHQgPSB0aGlzLmFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXh0LnNldENtZChuYW1lLCBjbWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hZGRDbWQoY21kKTtcbiAgICAgICAgcmV0dXJuIGNtZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZGREZXRlY3RvcihkZXRlY3Rvcikge1xuICAgICAgcmV0dXJuIHRoaXMuZGV0ZWN0b3JzLnB1c2goZGV0ZWN0b3IpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbml0Q21kcygpIHtcbiAgICAgIHZhciBqLCBsZW4sIHByb3ZpZGVyLCByZWYsIHJlc3VsdHM7XG4gICAgICBDb21tYW5kLmNtZHMgPSBuZXcgQ29tbWFuZChudWxsLCB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdoZWxsbyc6IHtcbiAgICAgICAgICAgIGhlbHA6IFwiXFxcIkhlbGxvLCB3b3JsZCFcXFwiIGlzIHR5cGljYWxseSBvbmUgb2YgdGhlIHNpbXBsZXN0IHByb2dyYW1zIHBvc3NpYmxlIGluXFxubW9zdCBwcm9ncmFtbWluZyBsYW5ndWFnZXMsIGl0IGlzIGJ5IHRyYWRpdGlvbiBvZnRlbiAoLi4uKSB1c2VkIHRvXFxudmVyaWZ5IHRoYXQgYSBsYW5ndWFnZSBvciBzeXN0ZW0gaXMgb3BlcmF0aW5nIGNvcnJlY3RseSAtd2lraXBlZGlhXCIsXG4gICAgICAgICAgICByZXN1bHQ6ICdIZWxsbywgV29ybGQhJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZWYgPSB0aGlzLnByb3ZpZGVycztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwcm92aWRlciA9IHJlZltqXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHByb3ZpZGVyLnJlZ2lzdGVyKENvbW1hbmQuY21kcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgc3RhdGljIHNhdmVDbWQoZnVsbG5hbWUsIGRhdGEpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKTtcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNhdmVJblBhdGgoJ2NtZHMnLCBmdWxsbmFtZSwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbG9hZENtZHMoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBzYXZlZENtZHM7XG4gICAgICAgIHJldHVybiBzYXZlZENtZHMgPSB0aGlzLnN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbigoc2F2ZWRDbWRzKSA9PiB7XG4gICAgICAgIHZhciBkYXRhLCBmdWxsbmFtZSwgcmVzdWx0cztcbiAgICAgICAgaWYgKHNhdmVkQ21kcyAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoZnVsbG5hbWUgaW4gc2F2ZWRDbWRzKSB7XG4gICAgICAgICAgICBkYXRhID0gc2F2ZWRDbWRzW2Z1bGxuYW1lXTtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0U2F2ZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNhdmUoJ2NtZHMnLCB7fSk7XG4gICAgfVxuXG4gICAgc3RhdGljIG1ha2VWYXJDbWQobmFtZSwgYmFzZSA9IHt9KSB7XG4gICAgICBiYXNlLmV4ZWN1dGUgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICB2YXIgcCwgdmFsO1xuICAgICAgICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuICAgICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYWtlQm9vbFZhckNtZChuYW1lLCBiYXNlID0ge30pIHtcbiAgICAgIGJhc2UuZXhlY3V0ZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBwLCB2YWw7XG4gICAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gICAgICAgIGlmICghKCh2YWwgIT0gbnVsbCkgJiYgKHZhbCA9PT0gJzAnIHx8IHZhbCA9PT0gJ2ZhbHNlJyB8fCB2YWwgPT09ICdubycpKSkge1xuICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH1cblxuICB9O1xuXG4gIENvbW1hbmQucHJvdmlkZXJzID0gW107XG5cbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IFN0b3JhZ2UoKTtcblxuICByZXR1cm4gQ29tbWFuZDtcblxufSkuY2FsbCh0aGlzKTtcblxuZXhwb3J0IHZhciBCYXNlQ29tbWFuZCA9IGNsYXNzIEJhc2VDb21tYW5kIHtcbiAgY29uc3RydWN0b3IoaW5zdGFuY2UxKSB7XG4gICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlMTtcbiAgfVxuXG4gIGluaXQoKSB7fVxuXG4gIFxuICByZXN1bHRJc0F2YWlsYWJsZSgpIHtcbiAgICByZXR1cm4gdGhpc1tcInJlc3VsdFwiXSAhPSBudWxsO1xuICB9XG5cbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgQ21kRmluZGVyIH0gZnJvbSAnLi9DbWRGaW5kZXInO1xuaW1wb3J0IHsgQ21kSW5zdGFuY2UgfSBmcm9tICcuL0NtZEluc3RhbmNlJztcbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcblxuZXhwb3J0IGNsYXNzIENvbnRleHRcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUpIC0+XG4gICAgQG5hbWVTcGFjZXMgPSBbXVxuICBcbiAgYWRkTmFtZVNwYWNlOiAobmFtZSkgLT5cbiAgICBpZiBuYW1lIG5vdCBpbiBAbmFtZVNwYWNlcyBcbiAgICAgIEBuYW1lU3BhY2VzLnB1c2gobmFtZSlcbiAgICAgIEBfbmFtZXNwYWNlcyA9IG51bGxcbiAgYWRkTmFtZXNwYWNlczogKHNwYWNlcykgLT5cbiAgICBpZiBzcGFjZXMgXG4gICAgICBpZiB0eXBlb2Ygc3BhY2VzID09ICdzdHJpbmcnXG4gICAgICAgIHNwYWNlcyA9IFtzcGFjZXNdXG4gICAgICBmb3Igc3BhY2UgaW4gc3BhY2VzIFxuICAgICAgICBAYWRkTmFtZVNwYWNlKHNwYWNlKVxuICByZW1vdmVOYW1lU3BhY2U6IChuYW1lKSAtPlxuICAgIEBuYW1lU3BhY2VzID0gQG5hbWVTcGFjZXMuZmlsdGVyIChuKSAtPiBuIGlzbnQgbmFtZVxuXG4gIGdldE5hbWVTcGFjZXM6IC0+XG4gICAgdW5sZXNzIEBfbmFtZXNwYWNlcz9cbiAgICAgIG5wY3MgPSBAbmFtZVNwYWNlc1xuICAgICAgaWYgQHBhcmVudD9cbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KEBwYXJlbnQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgQF9uYW1lc3BhY2VzID0gQXJyYXlIZWxwZXIudW5pcXVlKG5wY3MpXG4gICAgcmV0dXJuIEBfbmFtZXNwYWNlc1xuICBnZXRDbWQ6IChjbWROYW1lLG9wdGlvbnMgPSB7fSkgLT5cbiAgICBmaW5kZXIgPSBAZ2V0RmluZGVyKGNtZE5hbWUsb3B0aW9ucylcbiAgICByZXR1cm4gZmluZGVyLmZpbmQoKVxuICBnZXRGaW5kZXI6IChjbWROYW1lLG9wdGlvbnMgPSB7fSkgLT5cbiAgICByZXR1cm4gbmV3IENtZEZpbmRlcihjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdXG4gICAgICB1c2VEZXRlY3RvcnM6IEBpc1Jvb3QoKVxuICAgICAgY29kZXdhdmU6IEBjb2Rld2F2ZVxuICAgICAgcGFyZW50Q29udGV4dDogdGhpc1xuICAgIH0sb3B0aW9ucykpXG4gIGlzUm9vdDogLT5cbiAgICByZXR1cm4gIUBwYXJlbnQ/XG4gIGdldFBhcmVudE9yUm9vdDogKCkgLT5cbiAgICBpZiBAcGFyZW50P1xuICAgICAgQHBhcmVudFxuICAgIGVsc2VcbiAgICAgIHRoaXNcbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIGNjLmluZGV4T2YoJyVzJykgPiAtMVxuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJyxzdHIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgd3JhcENvbW1lbnRMZWZ0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLGkpICsgc3RyXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gIHdyYXBDb21tZW50UmlnaHQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkrMilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2NcbiAgY21kSW5zdGFuY2VGb3I6IChjbWQpIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsdGhpcylcbiAgZ2V0Q29tbWVudENoYXI6IC0+XG4gICAgaWYgQGNvbW1lbnRDaGFyP1xuICAgICAgcmV0dXJuIEBjb21tZW50Q2hhclxuICAgIGNtZCA9IEBnZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG4gICAgaWYgY21kP1xuICAgICAgaW5zdCA9IEBjbWRJbnN0YW5jZUZvcihjbWQpXG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnXG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICBAY29tbWVudENoYXIgPSBjaGFyXG4gICAgcmV0dXJuIEBjb21tZW50Q2hhciIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgQ21kRmluZGVyXG59IGZyb20gJy4vQ21kRmluZGVyJztcblxuaW1wb3J0IHtcbiAgQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5cbmltcG9ydCB7XG4gIEFycmF5SGVscGVyXG59IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5cbmV4cG9ydCB2YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSkge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTtcbiAgICB0aGlzLm5hbWVTcGFjZXMgPSBbXTtcbiAgfVxuXG4gIGFkZE5hbWVTcGFjZShuYW1lKSB7XG4gICAgaWYgKGluZGV4T2YuY2FsbCh0aGlzLm5hbWVTcGFjZXMsIG5hbWUpIDwgMCkge1xuICAgICAgdGhpcy5uYW1lU3BhY2VzLnB1c2gobmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYWRkTmFtZXNwYWNlcyhzcGFjZXMpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzLCBzcGFjZTtcbiAgICBpZiAoc3BhY2VzKSB7XG4gICAgICBpZiAodHlwZW9mIHNwYWNlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3BhY2VzID0gW3NwYWNlc107XG4gICAgICB9XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBzcGFjZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgc3BhY2UgPSBzcGFjZXNbal07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZE5hbWVTcGFjZShzcGFjZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTmFtZVNwYWNlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lU3BhY2VzID0gdGhpcy5uYW1lU3BhY2VzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbiAhPT0gbmFtZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldE5hbWVTcGFjZXMoKSB7XG4gICAgdmFyIG5wY3M7XG4gICAgaWYgKHRoaXMuX25hbWVzcGFjZXMgPT0gbnVsbCkge1xuICAgICAgbnBjcyA9IHRoaXMubmFtZVNwYWNlcztcbiAgICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIG5wY3MgPSBucGNzLmNvbmNhdCh0aGlzLnBhcmVudC5nZXROYW1lU3BhY2VzKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLnVuaXF1ZShucGNzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZXM7XG4gIH1cblxuICBnZXRDbWQoY21kTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmdldEZpbmRlcihjbWROYW1lLCBvcHRpb25zKTtcbiAgICByZXR1cm4gZmluZGVyLmZpbmQoKTtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IENtZEZpbmRlcihjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0aGlzLmlzUm9vdCgpLFxuICAgICAgY29kZXdhdmU6IHRoaXMuY29kZXdhdmUsXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSwgb3B0aW9ucykpO1xuICB9XG5cbiAgaXNSb290KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9PSBudWxsO1xuICB9XG5cbiAgZ2V0UGFyZW50T3JSb290KCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50KHN0cikge1xuICAgIHZhciBjYztcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoY2MuaW5kZXhPZignJXMnKSA+IC0xKSB7XG4gICAgICByZXR1cm4gY2MucmVwbGFjZSgnJXMnLCBzdHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHIgKyAnICcgKyBjYztcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudExlZnQoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGk7XG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKCk7XG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLCBpKSArIHN0cjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50UmlnaHQoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGk7XG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKCk7XG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIHN0ciArIGNjLnN1YnN0cihpICsgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdHIgKyAnICcgKyBjYztcbiAgICB9XG4gIH1cblxuICBjbWRJbnN0YW5jZUZvcihjbWQpIHtcbiAgICByZXR1cm4gbmV3IENtZEluc3RhbmNlKGNtZCwgdGhpcyk7XG4gIH1cblxuICBnZXRDb21tZW50Q2hhcigpIHtcbiAgICB2YXIgY2hhciwgY21kLCBpbnN0LCByZXM7XG4gICAgaWYgKHRoaXMuY29tbWVudENoYXIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tbWVudENoYXI7XG4gICAgfVxuICAgIGNtZCA9IHRoaXMuZ2V0Q21kKCdjb21tZW50Jyk7XG4gICAgY2hhciA9ICc8IS0tICVzIC0tPic7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBpbnN0ID0gdGhpcy5jbWRJbnN0YW5jZUZvcihjbWQpO1xuICAgICAgaW5zdC5jb250ZW50ID0gJyVzJztcbiAgICAgIHJlcyA9IGluc3QucmVzdWx0KCk7XG4gICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgY2hhciA9IHJlcztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb21tZW50Q2hhciA9IGNoYXI7XG4gICAgcmV0dXJuIHRoaXMuY29tbWVudENoYXI7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgRWRpdENtZFByb3BcbiAgY29uc3RydWN0b3I6IChAbmFtZSxvcHRpb25zKSAtPlxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ3ZhcicgOiBudWxsLFxuICAgICAgJ29wdCcgOiBudWxsLFxuICAgICAgJ2Z1bmN0JyA6IG51bGwsXG4gICAgICAnZGF0YU5hbWUnIDogbnVsbCxcbiAgICAgICdzaG93RW1wdHknIDogZmFsc2UsXG4gICAgICAnY2FycmV0JyA6IGZhbHNlLFxuICAgIH1cbiAgICBmb3Iga2V5IGluIFsndmFyJywnb3B0JywnZnVuY3QnXVxuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgZGVmYXVsdHNbJ2RhdGFOYW1lJ10gPSBvcHRpb25zW2tleV1cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgICAgXG4gIHNldENtZDogKGNtZHMpIC0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQoQG5hbWUpXG4gIFxuICB3cml0ZUZvcjogKHBhcnNlcixvYmopIC0+XG4gICAgaWYgcGFyc2VyLnZhcnNbQG5hbWVdP1xuICAgICAgb2JqW0BkYXRhTmFtZV0gPSBwYXJzZXIudmFyc1tAbmFtZV1cbiAgdmFsRnJvbUNtZDogKGNtZCkgLT5cbiAgICBpZiBjbWQ/XG4gICAgICBpZiBAb3B0P1xuICAgICAgICByZXR1cm4gY21kLmdldE9wdGlvbihAb3B0KVxuICAgICAgaWYgQGZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kW0BmdW5jdF0oKVxuICAgICAgaWYgQHZhcj9cbiAgICAgICAgcmV0dXJuIGNtZFtAdmFyXVxuICBzaG93Rm9yQ21kOiAoY21kKSAtPlxuICAgIHZhbCA9IEB2YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gQHNob3dFbXB0eSBvciB2YWw/XG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgaWYgQHNob3dGb3JDbWQoY21kKVxuICAgICAgXCJcIlwiXG4gICAgICB+fiN7QG5hbWV9fn5cbiAgICAgICN7QHZhbEZyb21DbWQoY21kKSBvciBcIlwifSN7aWYgQGNhcnJldCB0aGVuIFwifFwiIGVsc2UgXCJcIn1cbiAgICAgIH5+LyN7QG5hbWV9fn5cbiAgICAgIFwiXCJcIlxuICAgIFxuICAgIFxuY2xhc3MgRWRpdENtZFByb3Auc291cmNlIGV4dGVuZHMgRWRpdENtZFByb3AgXG4gIHZhbEZyb21DbWQ6IChjbWQpLT5cbiAgICByZXMgPSBzdXBlcihjbWQpXG4gICAgaWYgcmVzP1xuICAgICAgcmVzID0gcmVzLnJlcGxhY2UoL1xcfC9nLCAnfHwnKVxuICAgIHJldHVybiByZXNcbiAgc2V0Q21kOiAoY21kcyktPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKEBuYW1lLHsncHJldmVudFBhcnNlQWxsJyA6IHRydWV9KVxuICBzaG93Rm9yQ21kOiAoY21kKSAtPlxuICAgIHZhbCA9IEB2YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gKEBzaG93RW1wdHkgYW5kICEoY21kPyBhbmQgY21kLmFsaWFzT2Y/KSkgb3IgdmFsP1xuICAgIFxuICAgIFxuY2xhc3MgRWRpdENtZFByb3Auc3RyaW5nIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICBpZiBAdmFsRnJvbUNtZChjbWQpP1xuICAgICAgcmV0dXJuIFwifn4hI3tAbmFtZX0gJyN7QHZhbEZyb21DbWQoY21kKX0je2lmIEBjYXJyZXQgdGhlbiBcInxcIiBlbHNlIFwiXCJ9J35+XCJcbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnJldkJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZChAbmFtZSlcbiAgd3JpdGVGb3I6IChwYXJzZXIsb2JqKSAtPlxuICAgIGlmIHBhcnNlci52YXJzW0BuYW1lXT9cbiAgICAgIG9ialtAZGF0YU5hbWVdID0gIXBhcnNlci52YXJzW0BuYW1lXVxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIHZhbCA9IEB2YWxGcm9tQ21kKGNtZClcbiAgICBpZiB2YWw/IGFuZCAhdmFsXG4gICAgICByZXR1cm4gXCJ+fiEje0BuYW1lfX5+XCJcblxuICAgIFxuY2xhc3MgRWRpdENtZFByb3AuYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIHNldENtZDogKGNtZHMpIC0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKEBuYW1lKVxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIFwifn4hI3tAbmFtZX1+flwiIGlmIEB2YWxGcm9tQ21kKGNtZCkiLCJpbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgRWRpdENtZFByb3AgPSBjbGFzcyBFZGl0Q21kUHJvcCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMsIGksIGtleSwgbGVuLCByZWYsIHZhbDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ3Zhcic6IG51bGwsXG4gICAgICAnb3B0JzogbnVsbCxcbiAgICAgICdmdW5jdCc6IG51bGwsXG4gICAgICAnZGF0YU5hbWUnOiBudWxsLFxuICAgICAgJ3Nob3dFbXB0eSc6IGZhbHNlLFxuICAgICAgJ2NhcnJldCc6IGZhbHNlXG4gICAgfTtcbiAgICByZWYgPSBbJ3ZhcicsICdvcHQnLCAnZnVuY3QnXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGtleSA9IHJlZltpXTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBkZWZhdWx0c1snZGF0YU5hbWUnXSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgd3JpdGVGb3IocGFyc2VyLCBvYmopIHtcbiAgICBpZiAocGFyc2VyLnZhcnNbdGhpcy5uYW1lXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gb2JqW3RoaXMuZGF0YU5hbWVdID0gcGFyc2VyLnZhcnNbdGhpcy5uYW1lXTtcbiAgICB9XG4gIH1cblxuICB2YWxGcm9tQ21kKGNtZCkge1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMub3B0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5nZXRPcHRpb24odGhpcy5vcHQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kW3RoaXMuZnVuY3RdKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy52YXIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kW3RoaXMudmFyXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzaG93Rm9yQ21kKGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0VtcHR5IHx8ICh2YWwgIT0gbnVsbCk7XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnNob3dGb3JDbWQoY21kKSkge1xuICAgICAgcmV0dXJuIGB+fiR7dGhpcy5uYW1lfX5+XFxuJHt0aGlzLnZhbEZyb21DbWQoY21kKSB8fCBcIlwifSR7KHRoaXMuY2FycmV0ID8gXCJ8XCIgOiBcIlwiKX1cXG5+fi8ke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLnNvdXJjZSA9IGNsYXNzIHNvdXJjZSBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgdmFsRnJvbUNtZChjbWQpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IHN1cGVyLnZhbEZyb21DbWQoY21kKTtcbiAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKC9cXHwvZywgJ3x8Jyk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lLCB7XG4gICAgICAncHJldmVudFBhcnNlQWxsJzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgc2hvd0ZvckNtZChjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIHJldHVybiAodGhpcy5zaG93RW1wdHkgJiYgISgoY21kICE9IG51bGwpICYmIChjbWQuYWxpYXNPZiAhPSBudWxsKSkpIHx8ICh2YWwgIT0gbnVsbCk7XG4gIH1cblxufTtcblxuRWRpdENtZFByb3Auc3RyaW5nID0gY2xhc3Mgc3RyaW5nIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnZhbEZyb21DbWQoY21kKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfSAnJHt0aGlzLnZhbEZyb21DbWQoY21kKX0keyh0aGlzLmNhcnJldCA/IFwifFwiIDogXCJcIil9J35+YDtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZFByb3AucmV2Qm9vbCA9IGNsYXNzIHJldkJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIHdyaXRlRm9yKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9ialt0aGlzLmRhdGFOYW1lXSA9ICFwYXJzZXIudmFyc1t0aGlzLm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXkoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICBpZiAoKHZhbCAhPSBudWxsKSAmJiAhdmFsKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfX5+YDtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZFByb3AuYm9vbCA9IGNsYXNzIGJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfX5+YDtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IFN0clBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcbmltcG9ydCB7IG9wdGlvbmFsUHJvbWlzZSB9IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgY2xhc3MgRWRpdG9yXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBuYW1lc3BhY2UgPSBudWxsXG4gICAgQF9sYW5nID0gbnVsbFxuICBiaW5kZWRUbzogKGNvZGV3YXZlKSAtPlxuICAgICNcbiAgdGV4dDogKHZhbCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRDaGFyQXQ6IChwb3MpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0TGVuOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dFN1YnN0cjogKHN0YXJ0LCBlbmQpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBpbnNlcnRUZXh0QXQ6ICh0ZXh0LCBwb3MpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGdldEN1cnNvclBvczogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQgPSBudWxsKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgYmVnaW5VbmRvQWN0aW9uOiAtPlxuICAgICNcbiAgZW5kVW5kb0FjdGlvbjogLT5cbiAgICAjXG4gIGdldExhbmc6IC0+XG4gICAgcmV0dXJuIEBfbGFuZ1xuICBzZXRMYW5nOiAodmFsKSAtPlxuICAgIEBfbGFuZyA9IHZhbFxuICBnZXRFbW1ldENvbnRleHRPYmplY3Q6IC0+XG4gICAgcmV0dXJuIG51bGxcbiAgYWxsb3dNdWx0aVNlbGVjdGlvbjogLT5cbiAgICByZXR1cm4gZmFsc2VcbiAgc2V0TXVsdGlTZWw6IChzZWxlY3Rpb25zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgZ2V0TXVsdGlTZWw6IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBjYW5MaXN0ZW5Ub0NoYW5nZTogLT5cbiAgICByZXR1cm4gZmFsc2VcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBcbiAgZ2V0TGluZUF0OiAocG9zKSAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBmaW5kTGluZVN0YXJ0KHBvcyksQGZpbmRMaW5lRW5kKHBvcykpXG4gIGZpbmRMaW5lU3RhcnQ6IChwb3MpIC0+IFxuICAgIHAgPSBAZmluZEFueU5leHQocG9zICxbXCJcXG5cIl0sIC0xKVxuICAgIHJldHVybiBpZiBwIHRoZW4gcC5wb3MrMSBlbHNlIDBcbiAgZmluZExpbmVFbmQ6IChwb3MpIC0+IFxuICAgIHAgPSBAZmluZEFueU5leHQocG9zICxbXCJcXG5cIixcIlxcclwiXSlcbiAgICByZXR1cm4gaWYgcCB0aGVuIHAucG9zIGVsc2UgQHRleHRMZW4oKVxuICBcbiAgZmluZEFueU5leHQ6IChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbiA9IDEpIC0+IFxuICAgIGlmIGRpcmVjdGlvbiA+IDBcbiAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihzdGFydCxAdGV4dExlbigpKVxuICAgIGVsc2VcbiAgICAgIHRleHQgPSBAdGV4dFN1YnN0cigwLHN0YXJ0KVxuICAgIGJlc3RQb3MgPSBudWxsXG4gICAgZm9yIHN0cmkgaW4gc3RyaW5nc1xuICAgICAgcG9zID0gaWYgZGlyZWN0aW9uID4gMCB0aGVuIHRleHQuaW5kZXhPZihzdHJpKSBlbHNlIHRleHQubGFzdEluZGV4T2Yoc3RyaSlcbiAgICAgIGlmIHBvcyAhPSAtMVxuICAgICAgICBpZiAhYmVzdFBvcz8gb3IgYmVzdFBvcypkaXJlY3Rpb24gPiBwb3MqZGlyZWN0aW9uXG4gICAgICAgICAgYmVzdFBvcyA9IHBvc1xuICAgICAgICAgIGJlc3RTdHIgPSBzdHJpXG4gICAgaWYgYmVzdFN0cj9cbiAgICAgIHJldHVybiBuZXcgU3RyUG9zKChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gYmVzdFBvcyArIHN0YXJ0IGVsc2UgYmVzdFBvcyksYmVzdFN0cilcbiAgICByZXR1cm4gbnVsbFxuICBcbiAgYXBwbHlSZXBsYWNlbWVudHM6IChyZXBsYWNlbWVudHMpIC0+XG4gICAgcmVwbGFjZW1lbnRzLnJlZHVjZSgocHJvbWlzZSxyZXBsKT0+XG4gICAgICAgIHByb21pc2UudGhlbiAob3B0KT0+XG4gICAgICAgICAgcmVwbC53aXRoRWRpdG9yKHRoaXMpXG4gICAgICAgICAgcmVwbC5hcHBseU9mZnNldChvcHQub2Zmc2V0KVxuICAgICAgICAgIG9wdGlvbmFsUHJvbWlzZShyZXBsLmFwcGx5KCkpLnRoZW4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc2VsZWN0aW9uczogb3B0LnNlbGVjdGlvbnMuY29uY2F0KHJlcGwuc2VsZWN0aW9ucyksXG4gICAgICAgICAgICAgIG9mZnNldDogb3B0Lm9mZnNldCtyZXBsLm9mZnNldEFmdGVyKHRoaXMpIFxuICAgICAgICAgICAgfVxuICAgICAgLCBvcHRpb25hbFByb21pc2Uoe3NlbGVjdGlvbnM6IFtdLG9mZnNldDogMH0pKVxuICAgIC50aGVuIChvcHQpPT5cbiAgICAgIEBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMob3B0LnNlbGVjdGlvbnMpXG4gICAgLnJlc3VsdCgpXG4gICAgXG4gICAgICBcbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zOiAoc2VsZWN0aW9ucykgLT5cbiAgICBpZiBzZWxlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgIGlmIEBhbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICAgICAgQHNldE11bHRpU2VsKHNlbGVjdGlvbnMpXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCxzZWxlY3Rpb25zWzBdLmVuZCkiLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5pbXBvcnQge1xuICBTdHJQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuXG5pbXBvcnQge1xuICBvcHRpb25hbFByb21pc2Vcbn0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCB2YXIgRWRpdG9yID0gY2xhc3MgRWRpdG9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5uYW1lc3BhY2UgPSBudWxsO1xuICAgIHRoaXMuX2xhbmcgPSBudWxsO1xuICB9XG5cbiAgYmluZGVkVG8oY29kZXdhdmUpIHt9XG5cbiAgXG4gIHRleHQodmFsKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHRleHRDaGFyQXQocG9zKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHRleHRMZW4oKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHRleHRTdWJzdHIoc3RhcnQsIGVuZCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBpbnNlcnRUZXh0QXQodGV4dCwgcG9zKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRDdXJzb3JQb3MoKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHNldEN1cnNvclBvcyhzdGFydCwgZW5kID0gbnVsbCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBiZWdpblVuZG9BY3Rpb24oKSB7fVxuXG4gIFxuICBlbmRVbmRvQWN0aW9uKCkge31cblxuICBcbiAgZ2V0TGFuZygpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFuZztcbiAgfVxuXG4gIHNldExhbmcodmFsKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhbmcgPSB2YWw7XG4gIH1cblxuICBnZXRFbW1ldENvbnRleHRPYmplY3QoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhbGxvd011bHRpU2VsZWN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNldE11bHRpU2VsKHNlbGVjdGlvbnMpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0TXVsdGlTZWwoKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGNhbkxpc3RlblRvQ2hhbmdlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGdldExpbmVBdChwb3MpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLmZpbmRMaW5lU3RhcnQocG9zKSwgdGhpcy5maW5kTGluZUVuZChwb3MpKTtcbiAgfVxuXG4gIGZpbmRMaW5lU3RhcnQocG9zKSB7XG4gICAgdmFyIHA7XG4gICAgcCA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbXCJcXG5cIl0sIC0xKTtcbiAgICBpZiAocCkge1xuICAgICAgcmV0dXJuIHAucG9zICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG5cbiAgZmluZExpbmVFbmQocG9zKSB7XG4gICAgdmFyIHA7XG4gICAgcCA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbXCJcXG5cIiwgXCJcXHJcIl0pO1xuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRMZW4oKTtcbiAgICB9XG4gIH1cblxuICBmaW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgIHZhciBiZXN0UG9zLCBiZXN0U3RyLCBpLCBsZW4sIHBvcywgc3RyaSwgdGV4dDtcbiAgICBpZiAoZGlyZWN0aW9uID4gMCkge1xuICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihzdGFydCwgdGhpcy50ZXh0TGVuKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKDAsIHN0YXJ0KTtcbiAgICB9XG4gICAgYmVzdFBvcyA9IG51bGw7XG4gICAgZm9yIChpID0gMCwgbGVuID0gc3RyaW5ncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc3RyaSA9IHN0cmluZ3NbaV07XG4gICAgICBwb3MgPSBkaXJlY3Rpb24gPiAwID8gdGV4dC5pbmRleE9mKHN0cmkpIDogdGV4dC5sYXN0SW5kZXhPZihzdHJpKTtcbiAgICAgIGlmIChwb3MgIT09IC0xKSB7XG4gICAgICAgIGlmICgoYmVzdFBvcyA9PSBudWxsKSB8fCBiZXN0UG9zICogZGlyZWN0aW9uID4gcG9zICogZGlyZWN0aW9uKSB7XG4gICAgICAgICAgYmVzdFBvcyA9IHBvcztcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYmVzdFN0ciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFN0clBvcygoZGlyZWN0aW9uID4gMCA/IGJlc3RQb3MgKyBzdGFydCA6IGJlc3RQb3MpLCBiZXN0U3RyKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpIHtcbiAgICByZXR1cm4gcmVwbGFjZW1lbnRzLnJlZHVjZSgocHJvbWlzZSwgcmVwbCkgPT4ge1xuICAgICAgcmV0dXJuIHByb21pc2UudGhlbigob3B0KSA9PiB7XG4gICAgICAgIHJlcGwud2l0aEVkaXRvcih0aGlzKTtcbiAgICAgICAgcmVwbC5hcHBseU9mZnNldChvcHQub2Zmc2V0KTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbmFsUHJvbWlzZShyZXBsLmFwcGx5KCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZWxlY3Rpb25zOiBvcHQuc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKSxcbiAgICAgICAgICAgIG9mZnNldDogb3B0Lm9mZnNldCArIHJlcGwub2Zmc2V0QWZ0ZXIodGhpcylcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sIG9wdGlvbmFsUHJvbWlzZSh7XG4gICAgICBzZWxlY3Rpb25zOiBbXSxcbiAgICAgIG9mZnNldDogMFxuICAgIH0pKS50aGVuKChvcHQpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhvcHQuc2VsZWN0aW9ucyk7XG4gICAgfSkucmVzdWx0KCk7XG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMoc2VsZWN0aW9ucykge1xuICAgIGlmIChzZWxlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0aGlzLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRNdWx0aVNlbChzZWxlY3Rpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEN1cnNvclBvcyhzZWxlY3Rpb25zWzBdLnN0YXJ0LCBzZWxlY3Rpb25zWzBdLmVuZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgTG9nZ2VyXG4gIEBlbmFibGVkID0gdHJ1ZVxuICBsb2c6IChhcmdzLi4uKSAtPlxuICAgIGlmIEBpc0VuYWJsZWQoKVxuICAgICAgZm9yIG1zZyBpbiBhcmdzXG4gICAgICAgIGNvbnNvbGUubG9nKG1zZylcbiAgaXNFbmFibGVkOiAtPlxuICAgIGNvbnNvbGU/LmxvZz8gYW5kIHRoaXMuZW5hYmxlZCBhbmQgTG9nZ2VyLmVuYWJsZWRcbiAgZW5hYmxlZDogdHJ1ZVxuICBydW50aW1lOiAoZnVuY3QsbmFtZSA9IFwiZnVuY3Rpb25cIikgLT5cbiAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgcmVzID0gZnVuY3QoKVxuICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICBjb25zb2xlLmxvZyhcIiN7bmFtZX0gdG9vayAje3QxIC0gdDB9IG1pbGxpc2Vjb25kcy5cIilcbiAgICByZXNcbiAgbW9uaXRvckRhdGE6IHt9XG4gIHRvTW9uaXRvcjogKG9iaixuYW1lLHByZWZpeD0nJykgLT5cbiAgICBmdW5jdCA9IG9ialtuYW1lXVxuICAgIG9ialtuYW1lXSA9IC0+IFxuICAgICAgYXJncyA9IGFyZ3VtZW50c1xuICAgICAgdGhpcy5tb25pdG9yKCgtPiBmdW5jdC5hcHBseShvYmosYXJncykpLHByZWZpeCtuYW1lKVxuICBtb25pdG9yOiAoZnVuY3QsbmFtZSkgLT5cbiAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgcmVzID0gZnVuY3QoKVxuICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICBpZiB0aGlzLm1vbml0b3JEYXRhW25hbWVdP1xuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS5jb3VudCsrXG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLnRvdGFsKz0gdDEgLSB0MFxuICAgIGVsc2VcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0gPSB7XG4gICAgICAgIGNvdW50OiAxXG4gICAgICAgIHRvdGFsOiB0MSAtIHQwXG4gICAgICB9XG4gICAgcmVzXG4gIHJlc3VtZTogLT5cbiAgICBjb25zb2xlLmxvZyh0aGlzLm1vbml0b3JEYXRhKVxuIiwiZXhwb3J0IHZhciBMb2dnZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIExvZ2dlciB7XG4gICAgbG9nKC4uLmFyZ3MpIHtcbiAgICAgIHZhciBpLCBsZW4sIG1zZywgcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIG1zZyA9IGFyZ3NbaV07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKGNvbnNvbGUubG9nKG1zZykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgIHJldHVybiAoKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUgIT09IG51bGwgPyBjb25zb2xlLmxvZyA6IHZvaWQgMCkgIT0gbnVsbCkgJiYgdGhpcy5lbmFibGVkICYmIExvZ2dlci5lbmFibGVkO1xuICAgIH1cblxuICAgIHJ1bnRpbWUoZnVuY3QsIG5hbWUgPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhciByZXMsIHQwLCB0MTtcbiAgICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICByZXMgPSBmdW5jdCgpO1xuICAgICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIGNvbnNvbGUubG9nKGAke25hbWV9IHRvb2sgJHt0MSAtIHQwfSBtaWxsaXNlY29uZHMuYCk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHRvTW9uaXRvcihvYmosIG5hbWUsIHByZWZpeCA9ICcnKSB7XG4gICAgICB2YXIgZnVuY3Q7XG4gICAgICBmdW5jdCA9IG9ialtuYW1lXTtcbiAgICAgIHJldHVybiBvYmpbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbml0b3IoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBmdW5jdC5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgICB9KSwgcHJlZml4ICsgbmFtZSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIG1vbml0b3IoZnVuY3QsIG5hbWUpIHtcbiAgICAgIHZhciByZXMsIHQwLCB0MTtcbiAgICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICByZXMgPSBmdW5jdCgpO1xuICAgICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIGlmICh0aGlzLm1vbml0b3JEYXRhW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS5jb3VudCsrO1xuICAgICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLnRvdGFsICs9IHQxIC0gdDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdID0ge1xuICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgIHRvdGFsOiB0MSAtIHQwXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHJlc3VtZSgpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyh0aGlzLm1vbml0b3JEYXRhKTtcbiAgICB9XG5cbiAgfTtcblxuICBMb2dnZXIuZW5hYmxlZCA9IHRydWU7XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5lbmFibGVkID0gdHJ1ZTtcblxuICBMb2dnZXIucHJvdG90eXBlLm1vbml0b3JEYXRhID0ge307XG5cbiAgcmV0dXJuIExvZ2dlcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsImV4cG9ydCBjbGFzcyBPcHRpb25PYmplY3RcbiAgc2V0T3B0czogKG9wdGlvbnMsZGVmYXVsdHMpLT5cbiAgICBAZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIEBzZXRPcHQoa2V5LG9wdGlvbnNba2V5XSlcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldE9wdChrZXksdmFsKVxuICAgICAgICBcbiAgc2V0T3B0OiAoa2V5LCB2YWwpLT5cbiAgICBpZiB0aGlzW2tleV0/LmNhbGw/XG4gICAgICB0aGlzW2tleV0odmFsKVxuICAgIGVsc2VcbiAgICAgIHRoaXNba2V5XT0gdmFsXG4gICAgICAgIFxuICBnZXRPcHQ6IChrZXkpLT5cbiAgICBpZiB0aGlzW2tleV0/LmNhbGw/XG4gICAgICByZXR1cm4gdGhpc1trZXldKClcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGhpc1trZXldXG4gIFxuICBnZXRPcHRzOiAtPlxuICAgIG9wdHMgPSB7fVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIG9wdHNba2V5XSA9IEBnZXRPcHQoa2V5KVxuICAgIHJldHVybiBvcHRzIiwiZXhwb3J0IHZhciBPcHRpb25PYmplY3QgPSBjbGFzcyBPcHRpb25PYmplY3Qge1xuICBzZXRPcHRzKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gICAgdmFyIGtleSwgcmVmLCByZXN1bHRzLCB2YWw7XG4gICAgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc2V0T3B0KGtleSwgb3B0aW9uc1trZXldKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCB2YWwpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBzZXRPcHQoa2V5LCB2YWwpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXNba2V5XSkgIT0gbnVsbCA/IHJlZi5jYWxsIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0KGtleSkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XTtcbiAgICB9XG4gIH1cblxuICBnZXRPcHRzKCkge1xuICAgIHZhciBrZXksIG9wdHMsIHJlZiwgdmFsO1xuICAgIG9wdHMgPSB7fTtcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBvcHRzW2tleV0gPSB0aGlzLmdldE9wdChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gb3B0cztcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ21kSW5zdGFuY2UgfSBmcm9tICcuL0NtZEluc3RhbmNlJztcbmltcG9ydCB7IEJveEhlbHBlciB9IGZyb20gJy4vQm94SGVscGVyJztcbmltcG9ydCB7IFBhcmFtUGFyc2VyIH0gZnJvbSAnLi9zdHJpbmdQYXJzZXJzL1BhcmFtUGFyc2VyJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IFN0clBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBvcHRpb25hbFByb21pc2UgfSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSBleHRlbmRzIENtZEluc3RhbmNlXG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlLEBwb3MsQHN0cikgLT5cbiAgICBzdXBlcigpXG4gICAgdW5sZXNzIEBpc0VtcHR5KClcbiAgICAgIEBfY2hlY2tDbG9zZXIoKVxuICAgICAgQG9wZW5pbmcgPSBAc3RyXG4gICAgICBAbm9CcmFja2V0ID0gQF9yZW1vdmVCcmFja2V0KEBzdHIpXG4gICAgICBAX3NwbGl0Q29tcG9uZW50cygpXG4gICAgICBAX2ZpbmRDbG9zaW5nKClcbiAgICAgIEBfY2hlY2tFbG9uZ2F0ZWQoKVxuICBfY2hlY2tDbG9zZXI6IC0+XG4gICAgbm9CcmFja2V0ID0gQF9yZW1vdmVCcmFja2V0KEBzdHIpXG4gICAgaWYgbm9CcmFja2V0LnN1YnN0cmluZygwLEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PSBAY29kZXdhdmUuY2xvc2VDaGFyIGFuZCBmID0gQF9maW5kT3BlbmluZ1BvcygpXG4gICAgICBAY2xvc2luZ1BvcyA9IG5ldyBTdHJQb3MoQHBvcywgQHN0cilcbiAgICAgIEBwb3MgPSBmLnBvc1xuICAgICAgQHN0ciA9IGYuc3RyXG4gIF9maW5kT3BlbmluZ1BvczogLT5cbiAgICBjbWROYW1lID0gQF9yZW1vdmVCcmFja2V0KEBzdHIpLnN1YnN0cmluZyhAY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aClcbiAgICBvcGVuaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBjbWROYW1lXG4gICAgY2xvc2luZyA9IEBzdHJcbiAgICBpZiBmID0gQGNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIoQHBvcyxvcGVuaW5nLGNsb3NpbmcsLTEpXG4gICAgICBmLnN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihmLnBvcyxAY29kZXdhdmUuZmluZE5leHRCcmFrZXQoZi5wb3MrZi5zdHIubGVuZ3RoKStAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gICAgICByZXR1cm4gZlxuICBfc3BsaXRDb21wb25lbnRzOiAtPlxuICAgIHBhcnRzID0gQG5vQnJhY2tldC5zcGxpdChcIiBcIik7XG4gICAgQGNtZE5hbWUgPSBwYXJ0cy5zaGlmdCgpXG4gICAgQHJhd1BhcmFtcyA9IHBhcnRzLmpvaW4oXCIgXCIpXG4gIF9wYXJzZVBhcmFtczoocGFyYW1zKSAtPlxuICAgIHBhcnNlciA9IG5ldyBQYXJhbVBhcnNlcihwYXJhbXMsIHtcbiAgICAgIGFsbG93ZWROYW1lZDogQGdldE9wdGlvbignYWxsb3dlZE5hbWVkJyksXG4gICAgICB2YXJzOiBAY29kZXdhdmUudmFyc1xuICAgIH0pXG4gICAgQHBhcmFtcyA9IHBhcnNlci5wYXJhbXNcbiAgICBAbmFtZWQgPSBPYmplY3QuYXNzaWduKEBnZXREZWZhdWx0cygpLCBwYXJzZXIubmFtZWQpXG4gICAgaWYgQGNtZD9cbiAgICAgIG5hbWVUb1BhcmFtID0gQGdldE9wdGlvbignbmFtZVRvUGFyYW0nKVxuICAgICAgaWYgbmFtZVRvUGFyYW0/IFxuICAgICAgICBAbmFtZWRbbmFtZVRvUGFyYW1dID0gQGNtZE5hbWVcbiAgX2ZpbmRDbG9zaW5nOiAtPlxuICAgIGlmIGYgPSBAX2ZpbmRDbG9zaW5nUG9zKClcbiAgICAgIEBjb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUoQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MrQHN0ci5sZW5ndGgsZi5wb3MpKVxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGYucG9zK2Yuc3RyLmxlbmd0aClcbiAgX2ZpbmRDbG9zaW5nUG9zOiAtPlxuICAgIHJldHVybiBAY2xvc2luZ1BvcyBpZiBAY2xvc2luZ1Bvcz9cbiAgICBjbG9zaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZE5hbWUgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjbWROYW1lXG4gICAgaWYgZiA9IEBjb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKEBwb3MrQHN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpXG4gICAgICByZXR1cm4gQGNsb3NpbmdQb3MgPSBmXG4gIF9jaGVja0Vsb25nYXRlZDogLT5cbiAgICBlbmRQb3MgPSBAZ2V0RW5kUG9zKClcbiAgICBtYXggPSBAY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKVxuICAgIHdoaWxlIGVuZFBvcyA8IG1heCBhbmQgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyxlbmRQb3MrQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PSBAY29kZXdhdmUuZGVjb1xuICAgICAgZW5kUG9zKz1AY29kZXdhdmUuZGVjby5sZW5ndGhcbiAgICBpZiBlbmRQb3MgPj0gbWF4IG9yIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIEBjb2Rld2F2ZS5kZWNvLmxlbmd0aCkgaW4gWycgJyxcIlxcblwiLFwiXFxyXCJdXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICBfY2hlY2tCb3g6IC0+XG4gICAgaWYgQGNvZGV3YXZlLmluSW5zdGFuY2U/IGFuZCBAY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PSAnY29tbWVudCdcbiAgICAgIHJldHVyblxuICAgIGNsID0gQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KClcbiAgICBjciA9IEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKVxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKSArIGNyLmxlbmd0aFxuICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zIC0gY2wubGVuZ3RoLEBwb3MpID09IGNsIGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLGVuZFBvcykgPT0gY3JcbiAgICAgIEBwb3MgPSBAcG9zIC0gY2wubGVuZ3RoXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICAgICAgQF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICAgIGVsc2UgaWYgQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgYW5kIEBnZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xXG4gICAgICBAaW5Cb3ggPSAxXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQ6IC0+XG4gICAgaWYgQGNvbnRlbnRcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29kZXdhdmUuZGVjbylcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86I3tlZH0pKyN7ZWNyfSRcIiwgXCJnbVwiKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChcIl5cXFxccyooPzoje2VkfSkqI3tlY3J9XFxyP1xcblwiKVxuICAgICAgcmUzID0gbmV3IFJlZ0V4cChcIlxcblxcXFxzKiN7ZWNsfSg/OiN7ZWR9KSpcXFxccyokXCIpXG4gICAgICBAY29udGVudCA9IEBjb250ZW50LnJlcGxhY2UocmUxLCckMScpLnJlcGxhY2UocmUyLCcnKS5yZXBsYWNlKHJlMywnJylcbiAgX2dldFBhcmVudENtZHM6IC0+XG4gICAgQHBhcmVudCA9IEBjb2Rld2F2ZS5nZXRFbmNsb3NpbmdDbWQoQGdldEVuZFBvcygpKT8uaW5pdCgpXG4gIHNldE11bHRpUG9zOiAobXVsdGlQb3MpIC0+XG4gICAgQG11bHRpUG9zID0gbXVsdGlQb3NcbiAgX2dldENtZE9iajogLT5cbiAgICBAZ2V0Q21kKClcbiAgICBAX2NoZWNrQm94KClcbiAgICBAY29udGVudCA9IEByZW1vdmVJbmRlbnRGcm9tQ29udGVudChAY29udGVudClcbiAgICBzdXBlcigpXG4gIF9pbml0UGFyYW1zOiAtPlxuICAgIEBfcGFyc2VQYXJhbXMoQHJhd1BhcmFtcylcbiAgZ2V0Q29udGV4dDogLT5cbiAgICByZXR1cm4gQGNvbnRleHQgb3IgQGNvZGV3YXZlLmNvbnRleHRcbiAgZ2V0Q21kOiAtPlxuICAgIHVubGVzcyBAY21kP1xuICAgICAgQF9nZXRQYXJlbnRDbWRzKClcbiAgICAgIGlmIEBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIubGVuZ3RoKSA9PSBAY29kZXdhdmUubm9FeGVjdXRlQ2hhclxuICAgICAgICBAY21kID0gQ29tbWFuZC5jbWRzLmdldENtZCgnY29yZTpub19leGVjdXRlJylcbiAgICAgICAgQGNvbnRleHQgPSBAY29kZXdhdmUuY29udGV4dFxuICAgICAgZWxzZVxuICAgICAgICBAZmluZGVyID0gQGdldEZpbmRlcihAY21kTmFtZSlcbiAgICAgICAgQGNvbnRleHQgPSBAZmluZGVyLmNvbnRleHRcbiAgICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgICAgIGlmIEBjbWQ/XG4gICAgICAgICAgQGNvbnRleHQuYWRkTmFtZVNwYWNlKEBjbWQuZnVsbE5hbWUpXG4gICAgcmV0dXJuIEBjbWRcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBjb2Rld2F2ZS5jb250ZXh0LmdldEZpbmRlcihjbWROYW1lLG5hbWVzcGFjZXM6QF9nZXRQYXJlbnROYW1lc3BhY2VzKCkpXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgX2dldFBhcmVudE5hbWVzcGFjZXM6IC0+XG4gICAgbnNwY3MgPSBbXVxuICAgIG9iaiA9IHRoaXNcbiAgICB3aGlsZSBvYmoucGFyZW50P1xuICAgICAgb2JqID0gb2JqLnBhcmVudFxuICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKSBpZiBvYmouY21kPyBhbmQgb2JqLmNtZC5mdWxsTmFtZT9cbiAgICByZXR1cm4gbnNwY3NcbiAgX3JlbW92ZUJyYWNrZXQ6IChzdHIpLT5cbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyhAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgsc3RyLmxlbmd0aC1AY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQoQGNtZE5hbWUpXG4gICAgcmV0dXJuIGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJyxjbWROYW1lKVxuICBpc0VtcHR5OiAtPlxuICAgIHJldHVybiBAc3RyID09IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjb2Rld2F2ZS5icmFrZXRzIG9yIEBzdHIgPT0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuYnJha2V0c1xuICBleGVjdXRlOiAtPlxuICAgIGlmIEBpc0VtcHR5KClcbiAgICAgIGlmIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXA/IGFuZCBAY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKEBwb3MgKyBAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpP1xuICAgICAgICBAY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpXG4gICAgICBlbHNlXG4gICAgICAgIEByZXBsYWNlV2l0aCgnJylcbiAgICBlbHNlIGlmIEBjbWQ/XG4gICAgICBpZiBiZWZvcmVGdW5jdCA9IEBnZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKVxuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKVxuICAgICAgaWYgQHJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgICAgb3B0aW9uYWxQcm9taXNlKEByZXN1bHQoKSkudGhlbiAocmVzKT0+XG4gICAgICAgICAgaWYgcmVzP1xuICAgICAgICAgICAgQHJlcGxhY2VXaXRoKHJlcylcbiAgICAgICAgLnJlc3VsdCgpXG4gICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIEBydW5FeGVjdXRlRnVuY3QoKVxuICBnZXRFbmRQb3M6IC0+XG4gICAgcmV0dXJuIEBwb3MrQHN0ci5sZW5ndGhcbiAgZ2V0UG9zOiAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBwb3MsQHBvcytAc3RyLmxlbmd0aCkud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICBnZXRPcGVuaW5nUG9zOiAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBwb3MsQHBvcytAb3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHVubGVzcyBAaW5kZW50TGVuP1xuICAgICAgaWYgQGluQm94P1xuICAgICAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgICAgICBAaW5kZW50TGVuID0gaGVscGVyLnJlbW92ZUNvbW1lbnQoQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGhcbiAgICAgIGVsc2VcbiAgICAgICAgQGluZGVudExlbiA9IEBwb3MgLSBAZ2V0UG9zKCkucHJldkVPTCgpXG4gICAgcmV0dXJuIEBpbmRlbnRMZW5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQ6ICh0ZXh0KSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKCdeXFxcXHN7JytAZ2V0SW5kZW50KCkrJ30nLCdnbScpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywnJylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBhbHRlclJlc3VsdEZvckJveDogKHJlcGwpIC0+XG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKVxuICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGNvbnRleHQpXG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksZmFsc2UpXG4gICAgaWYgQGdldE9wdGlvbigncmVwbGFjZUJveCcpXG4gICAgICBib3ggPSBoZWxwZXIuZ2V0Qm94Rm9yUG9zKG9yaWdpbmFsKVxuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdXG4gICAgICBAaW5kZW50TGVuID0gaGVscGVyLmluZGVudFxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBlbHNlXG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgICAgcmVwbC5zdGFydCA9IG9yaWdpbmFsLnByZXZFT0woKVxuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKClcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgQGNvZGV3YXZlLm1hcmtlciArIHJlcGwudGV4dCArIEBjb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge211bHRpbGluZTpmYWxzZX0pXG4gICAgICBbcmVwbC5wcmVmaXgscmVwbC50ZXh0LHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdChAY29kZXdhdmUubWFya2VyKVxuICAgIHJldHVybiByZXBsXG4gIGdldEN1cnNvckZyb21SZXN1bHQ6IChyZXBsKSAtPlxuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KClcbiAgICBpZiBAY21kPyBhbmQgQGNvZGV3YXZlLmNoZWNrQ2FycmV0IGFuZCBAZ2V0T3B0aW9uKCdjaGVja0NhcnJldCcpXG4gICAgICBpZiAocCA9IEBjb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSk/IFxuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0K3JlcGwucHJlZml4Lmxlbmd0aCtwXG4gICAgICByZXBsLnRleHQgPSBAY29kZXdhdmUucmVtb3ZlQ2FycmV0KHJlcGwudGV4dClcbiAgICByZXR1cm4gY3Vyc29yUG9zXG4gIGNoZWNrTXVsdGk6IChyZXBsKSAtPlxuICAgIGlmIEBtdWx0aVBvcz8gYW5kIEBtdWx0aVBvcy5sZW5ndGggPiAxXG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF1cbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KClcbiAgICAgIGZvciBwb3MsIGkgaW4gQG11bHRpUG9zXG4gICAgICAgIGlmIGkgPT0gMFxuICAgICAgICAgIG9yaWdpbmFsUG9zID0gcG9zLnN0YXJ0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0LW9yaWdpbmFsUG9zKVxuICAgICAgICAgIGlmIG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT0gb3JpZ2luYWxUZXh0XG4gICAgICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXdSZXBsKVxuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50c1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBbcmVwbF1cbiAgcmVwbGFjZVdpdGg6ICh0ZXh0KSAtPlxuICAgIEBhcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChAcG9zLEBnZXRFbmRQb3MoKSx0ZXh0KSlcbiAgYXBwbHlSZXBsYWNlbWVudDogKHJlcGwpIC0+XG4gICAgcmVwbC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gICAgaWYgQGluQm94P1xuICAgICAgQGFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBjdXJzb3JQb3MgPSBAZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKVxuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKGN1cnNvclBvcywgY3Vyc29yUG9zKV1cbiAgICByZXBsYWNlbWVudHMgPSBAY2hlY2tNdWx0aShyZXBsKVxuICAgIEByZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0XG4gICAgQHJlcGxhY2VFbmQgPSByZXBsLnJlc0VuZCgpXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gICAgIiwiaW1wb3J0IHtcbiAgQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5cbmltcG9ydCB7XG4gIEJveEhlbHBlclxufSBmcm9tICcuL0JveEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhcmFtUGFyc2VyXG59IGZyb20gJy4vc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFN0clBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIE5hbWVzcGFjZUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBvcHRpb25hbFByb21pc2Vcbn0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCB2YXIgUG9zaXRpb25lZENtZEluc3RhbmNlID0gY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSwgcG9zMSwgc3RyMSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlO1xuICAgIHRoaXMucG9zID0gcG9zMTtcbiAgICB0aGlzLnN0ciA9IHN0cjE7XG4gICAgaWYgKCF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgdGhpcy5fY2hlY2tDbG9zZXIoKTtcbiAgICAgIHRoaXMub3BlbmluZyA9IHRoaXMuc3RyO1xuICAgICAgdGhpcy5ub0JyYWNrZXQgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKTtcbiAgICAgIHRoaXMuX3NwbGl0Q29tcG9uZW50cygpO1xuICAgICAgdGhpcy5fZmluZENsb3NpbmcoKTtcbiAgICAgIHRoaXMuX2NoZWNrRWxvbmdhdGVkKCk7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrQ2xvc2VyKCkge1xuICAgIHZhciBmLCBub0JyYWNrZXQ7XG4gICAgbm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cik7XG4gICAgaWYgKG5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgJiYgKGYgPSB0aGlzLl9maW5kT3BlbmluZ1BvcygpKSkge1xuICAgICAgdGhpcy5jbG9zaW5nUG9zID0gbmV3IFN0clBvcyh0aGlzLnBvcywgdGhpcy5zdHIpO1xuICAgICAgdGhpcy5wb3MgPSBmLnBvcztcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IGYuc3RyO1xuICAgIH1cbiAgfVxuXG4gIF9maW5kT3BlbmluZ1BvcygpIHtcbiAgICB2YXIgY2xvc2luZywgY21kTmFtZSwgZiwgb3BlbmluZztcbiAgICBjbWROYW1lID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cikuc3Vic3RyaW5nKHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCk7XG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWU7XG4gICAgY2xvc2luZyA9IHRoaXMuc3RyO1xuICAgIGlmIChmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zLCBvcGVuaW5nLCBjbG9zaW5nLCAtMSkpIHtcbiAgICAgIGYuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihmLnBvcywgdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcyArIGYuc3RyLmxlbmd0aCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKTtcbiAgICAgIHJldHVybiBmO1xuICAgIH1cbiAgfVxuXG4gIF9zcGxpdENvbXBvbmVudHMoKSB7XG4gICAgdmFyIHBhcnRzO1xuICAgIHBhcnRzID0gdGhpcy5ub0JyYWNrZXQuc3BsaXQoXCIgXCIpO1xuICAgIHRoaXMuY21kTmFtZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHRoaXMucmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIik7XG4gIH1cblxuICBfcGFyc2VQYXJhbXMocGFyYW1zKSB7XG4gICAgdmFyIG5hbWVUb1BhcmFtLCBwYXJzZXI7XG4gICAgcGFyc2VyID0gbmV3IFBhcmFtUGFyc2VyKHBhcmFtcywge1xuICAgICAgYWxsb3dlZE5hbWVkOiB0aGlzLmdldE9wdGlvbignYWxsb3dlZE5hbWVkJyksXG4gICAgICB2YXJzOiB0aGlzLmNvZGV3YXZlLnZhcnNcbiAgICB9KTtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcnNlci5wYXJhbXM7XG4gICAgdGhpcy5uYW1lZCA9IE9iamVjdC5hc3NpZ24odGhpcy5nZXREZWZhdWx0cygpLCBwYXJzZXIubmFtZWQpO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBuYW1lVG9QYXJhbSA9IHRoaXMuZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpO1xuICAgICAgaWYgKG5hbWVUb1BhcmFtICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZVRvUGFyYW1dID0gdGhpcy5jbWROYW1lO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9maW5kQ2xvc2luZygpIHtcbiAgICB2YXIgZjtcbiAgICBpZiAoZiA9IHRoaXMuX2ZpbmRDbG9zaW5nUG9zKCkpIHtcbiAgICAgIHRoaXMuY29udGVudCA9IFN0cmluZ0hlbHBlci50cmltRW1wdHlMaW5lKHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgsIGYucG9zKSk7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBmLnBvcyArIGYuc3RyLmxlbmd0aCk7XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRDbG9zaW5nUG9zKCkge1xuICAgIHZhciBjbG9zaW5nLCBmLCBvcGVuaW5nO1xuICAgIGlmICh0aGlzLmNsb3NpbmdQb3MgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1BvcztcbiAgICB9XG4gICAgY2xvc2luZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWROYW1lICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgIG9wZW5pbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZE5hbWU7XG4gICAgaWYgKGYgPSB0aGlzLmNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIodGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUG9zID0gZjtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tFbG9uZ2F0ZWQoKSB7XG4gICAgdmFyIGVuZFBvcywgbWF4LCByZWY7XG4gICAgZW5kUG9zID0gdGhpcy5nZXRFbmRQb3MoKTtcbiAgICBtYXggPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0TGVuKCk7XG4gICAgd2hpbGUgKGVuZFBvcyA8IG1heCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUuZGVjbykge1xuICAgICAgZW5kUG9zICs9IHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGg7XG4gICAgfVxuICAgIGlmIChlbmRQb3MgPj0gbWF4IHx8ICgocmVmID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGgpKSA9PT0gJyAnIHx8IHJlZiA9PT0gXCJcXG5cIiB8fCByZWYgPT09IFwiXFxyXCIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBlbmRQb3MpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0JveCgpIHtcbiAgICB2YXIgY2wsIGNyLCBlbmRQb3M7XG4gICAgaWYgKCh0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkgJiYgdGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlLmNtZC5uYW1lID09PSAnY29tbWVudCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2wgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCk7XG4gICAgY3IgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpO1xuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCkgKyBjci5sZW5ndGg7XG4gICAgaWYgKHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MgLSBjbC5sZW5ndGgsIHRoaXMucG9zKSA9PT0gY2wgJiYgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MgLSBjci5sZW5ndGgsIGVuZFBvcykgPT09IGNyKSB7XG4gICAgICB0aGlzLnBvcyA9IHRoaXMucG9zIC0gY2wubGVuZ3RoO1xuICAgICAgdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBlbmRQb3MpO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5nZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKS5pbmRleE9mKGNsKSA+IC0xICYmIHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzU3VmZml4KCkuaW5kZXhPZihjcikgPiAtMSkge1xuICAgICAgdGhpcy5pbkJveCA9IDE7XG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpIHtcbiAgICB2YXIgZWNsLCBlY3IsIGVkLCByZTEsIHJlMiwgcmUzO1xuICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCgpKTtcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSk7XG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb2Rld2F2ZS5kZWNvKTtcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2VjbH0oPzoke2VkfSkrXFxcXHMqKC4qPylcXFxccyooPzoke2VkfSkrJHtlY3J9JGAsIFwiZ21cIik7XG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBeXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxccj9cXG5gKTtcbiAgICAgIHJlMyA9IG5ldyBSZWdFeHAoYFxcblxcXFxzKiR7ZWNsfSg/OiR7ZWR9KSpcXFxccyokYCk7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ID0gdGhpcy5jb250ZW50LnJlcGxhY2UocmUxLCAnJDEnKS5yZXBsYWNlKHJlMiwgJycpLnJlcGxhY2UocmUzLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgX2dldFBhcmVudENtZHMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQgPSAocmVmID0gdGhpcy5jb2Rld2F2ZS5nZXRFbmNsb3NpbmdDbWQodGhpcy5nZXRFbmRQb3MoKSkpICE9IG51bGwgPyByZWYuaW5pdCgpIDogdm9pZCAwO1xuICB9XG5cbiAgc2V0TXVsdGlQb3MobXVsdGlQb3MpIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0aVBvcyA9IG11bHRpUG9zO1xuICB9XG5cbiAgX2dldENtZE9iaigpIHtcbiAgICB0aGlzLmdldENtZCgpO1xuICAgIHRoaXMuX2NoZWNrQm94KCk7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5yZW1vdmVJbmRlbnRGcm9tQ29udGVudCh0aGlzLmNvbnRlbnQpO1xuICAgIHJldHVybiBzdXBlci5fZ2V0Q21kT2JqKCk7XG4gIH1cblxuICBfaW5pdFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2VQYXJhbXModGhpcy5yYXdQYXJhbXMpO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IHRoaXMuY29kZXdhdmUuY29udGV4dDtcbiAgfVxuXG4gIGdldENtZCgpIHtcbiAgICBpZiAodGhpcy5jbWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fZ2V0UGFyZW50Q21kcygpO1xuICAgICAgaWYgKHRoaXMubm9CcmFja2V0LnN1YnN0cmluZygwLCB0aGlzLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSB7XG4gICAgICAgIHRoaXMuY21kID0gQ29tbWFuZC5jbWRzLmdldENtZCgnY29yZTpub19leGVjdXRlJyk7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY29kZXdhdmUuY29udGV4dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5nZXRGaW5kZXIodGhpcy5jbWROYW1lKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5maW5kZXIuY29udGV4dDtcbiAgICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKCk7XG4gICAgICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmFkZE5hbWVTcGFjZSh0aGlzLmNtZC5mdWxsTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY21kO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUpIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuY29kZXdhdmUuY29udGV4dC5nZXRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogdGhpcy5fZ2V0UGFyZW50TmFtZXNwYWNlcygpXG4gICAgfSk7XG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gZmluZGVyO1xuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMoKSB7XG4gICAgdmFyIG5zcGNzLCBvYmo7XG4gICAgbnNwY3MgPSBbXTtcbiAgICBvYmogPSB0aGlzO1xuICAgIHdoaWxlIChvYmoucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IG9iai5wYXJlbnQ7XG4gICAgICBpZiAoKG9iai5jbWQgIT0gbnVsbCkgJiYgKG9iai5jbWQuZnVsbE5hbWUgIT0gbnVsbCkpIHtcbiAgICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5zcGNzO1xuICB9XG5cbiAgX3JlbW92ZUJyYWNrZXQoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcodGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCwgc3RyLmxlbmd0aCAtIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpO1xuICB9XG5cbiAgYWx0ZXJBbGlhc09mKGFsaWFzT2YpIHtcbiAgICB2YXIgY21kTmFtZSwgbnNwYztcbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQodGhpcy5jbWROYW1lKTtcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBjbWROYW1lKTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cyB8fCB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgYmVmb3JlRnVuY3Q7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICBpZiAoKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wICE9IG51bGwpICYmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcC53aGl0aGluT3BlbkJvdW5kcyh0aGlzLnBvcyArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpICE9IG51bGwpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcC5jYW5jZWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoKCcnKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmIChiZWZvcmVGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdiZWZvcmVFeGVjdXRlJykpIHtcbiAgICAgICAgYmVmb3JlRnVuY3QodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25hbFByb21pc2UodGhpcy5yZXN1bHQoKSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aChyZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkucmVzdWx0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5FeGVjdXRlRnVuY3QoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRFbmRQb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoO1xuICB9XG5cbiAgZ2V0UG9zKCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCkud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcik7XG4gIH1cblxuICBnZXRPcGVuaW5nUG9zKCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMub3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICB9XG5cbiAgZ2V0SW5kZW50KCkge1xuICAgIHZhciBoZWxwZXI7XG4gICAgaWYgKHRoaXMuaW5kZW50TGVuID09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkpLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gdGhpcy5wb3MgLSB0aGlzLmdldFBvcygpLnByZXZFT0woKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5kZW50TGVuO1xuICB9XG5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGV4dCkge1xuICAgIHZhciByZWc7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycgKyB0aGlzLmdldEluZGVudCgpICsgJ30nLCAnZ20nKTtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIGFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpIHtcbiAgICB2YXIgYm94LCBoZWxwZXIsIG9yaWdpbmFsLCByZXM7XG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKTtcbiAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dCk7XG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksIGZhbHNlKTtcbiAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3JlcGxhY2VCb3gnKSkge1xuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbCk7XG4gICAgICBbcmVwbC5zdGFydCwgcmVwbC5lbmRdID0gW2JveC5zdGFydCwgYm94LmVuZF07XG4gICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5pbmRlbnQ7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKCk7XG4gICAgICByZXBsLmVuZCA9IG9yaWdpbmFsLm5leHRFT0woKTtcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyB0aGlzLmNvZGV3YXZlLm1hcmtlciArIG9yaWdpbmFsLnNhbWVMaW5lc1N1ZmZpeCgpLCB7XG4gICAgICAgIG11bHRpbGluZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgW3JlcGwucHJlZml4LCByZXBsLnRleHQsIHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdCh0aGlzLmNvZGV3YXZlLm1hcmtlcik7XG4gICAgfVxuICAgIHJldHVybiByZXBsO1xuICB9XG5cbiAgZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcDtcbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpO1xuICAgIGlmICgodGhpcy5jbWQgIT0gbnVsbCkgJiYgdGhpcy5jb2Rld2F2ZS5jaGVja0NhcnJldCAmJiB0aGlzLmdldE9wdGlvbignY2hlY2tDYXJyZXQnKSkge1xuICAgICAgaWYgKChwID0gdGhpcy5jb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSkgIT0gbnVsbCkge1xuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0ICsgcmVwbC5wcmVmaXgubGVuZ3RoICsgcDtcbiAgICAgIH1cbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHJlcGwudGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBjdXJzb3JQb3M7XG4gIH1cblxuICBjaGVja011bHRpKHJlcGwpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXdSZXBsLCBvcmlnaW5hbFBvcywgb3JpZ2luYWxUZXh0LCBwb3MsIHJlZiwgcmVwbGFjZW1lbnRzO1xuICAgIGlmICgodGhpcy5tdWx0aVBvcyAhPSBudWxsKSAmJiB0aGlzLm11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJlcGxhY2VtZW50cyA9IFtyZXBsXTtcbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KCk7XG4gICAgICByZWYgPSB0aGlzLm11bHRpUG9zO1xuICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgcG9zID0gcmVmW2ldO1xuICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgIG9yaWdpbmFsUG9zID0gcG9zLnN0YXJ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1JlcGwgPSByZXBsLmNvcHkoKS5hcHBseU9mZnNldChwb3Muc3RhcnQgLSBvcmlnaW5hbFBvcyk7XG4gICAgICAgICAgaWYgKG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT09IG9yaWdpbmFsVGV4dCkge1xuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW3JlcGxdO1xuICAgIH1cbiAgfVxuXG4gIHJlcGxhY2VXaXRoKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudCh0aGlzLnBvcywgdGhpcy5nZXRFbmRQb3MoKSwgdGV4dCkpO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcmVwbGFjZW1lbnRzO1xuICAgIHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcik7XG4gICAgaWYgKHRoaXMuaW5Cb3ggIT0gbnVsbCkge1xuICAgICAgdGhpcy5hbHRlclJlc3VsdEZvckJveChyZXBsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpO1xuICAgIH1cbiAgICBjdXJzb3JQb3MgPSB0aGlzLmdldEN1cnNvckZyb21SZXN1bHQocmVwbCk7XG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBQb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXTtcbiAgICByZXBsYWNlbWVudHMgPSB0aGlzLmNoZWNrTXVsdGkocmVwbCk7XG4gICAgdGhpcy5yZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0O1xuICAgIHRoaXMucmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKCk7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBQcm9jZXNzXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICMiLCJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vTG9nZ2VyJztcblxuZXhwb3J0IGNsYXNzIFN0b3JhZ2VcbiAgY29uc3RydWN0b3I6IChAZW5naW5lKSAtPlxuXG4gIHNhdmU6IChrZXksdmFsKSAtPlxuICAgIGlmIEBlbmdpbmVBdmFpbGFibGUoKVxuICAgICAgQGVuZ2luZS5zYXZlKGtleSx2YWwpXG5cbiAgc2F2ZUluUGF0aDogKHBhdGgsIGtleSwgdmFsKSAtPlxuICAgIGlmIEBlbmdpbmVBdmFpbGFibGUoKVxuICAgICAgQGVuZ2luZS5zYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKVxuXG4gIGxvYWQ6IChrZXkpIC0+XG4gICAgaWYgQGVuZ2luZT9cbiAgICAgIEBlbmdpbmUubG9hZChrZXkpXG5cbiAgZW5naW5lQXZhaWxhYmxlOiAoKSAtPlxuICAgIGlmIEBlbmdpbmU/XG4gICAgICB0cnVlXG4gICAgZWxzZVxuICAgICAgQGxvZ2dlciA9IEBsb2dnZXIgfHwgbmV3IExvZ2dlcigpXG4gICAgICBAbG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJylcbiAgICAgIGZhbHNlXG4gICAgIiwiaW1wb3J0IHtcbiAgTG9nZ2VyXG59IGZyb20gJy4vTG9nZ2VyJztcblxuZXhwb3J0IHZhciBTdG9yYWdlID0gY2xhc3MgU3RvcmFnZSB7XG4gIGNvbnN0cnVjdG9yKGVuZ2luZSkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICB9XG5cbiAgc2F2ZShrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZShrZXksIHZhbCk7XG4gICAgfVxuICB9XG5cbiAgc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbCk7XG4gICAgfVxuICB9XG5cbiAgbG9hZChrZXkpIHtcbiAgICBpZiAodGhpcy5lbmdpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLmxvYWQoa2V5KTtcbiAgICB9XG4gIH1cblxuICBlbmdpbmVBdmFpbGFibGUoKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlciA9IHRoaXMubG9nZ2VyIHx8IG5ldyBMb2dnZXIoKTtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IGNsYXNzIERvbUtleUxpc3RlbmVyXG4gIHN0YXJ0TGlzdGVuaW5nOiAodGFyZ2V0KSAtPlxuICBcbiAgICB0aW1lb3V0ID0gbnVsbFxuICAgIFxuICAgIG9ua2V5ZG93biA9IChlKSA9PiBcbiAgICAgIGlmIChDb2Rld2F2ZS5pbnN0YW5jZXMubGVuZ3RoIDwgMiBvciBAb2JqID09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIGFuZCBlLmtleUNvZGUgPT0gNjkgJiYgZS5jdHJsS2V5XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBpZiBAb25BY3RpdmF0aW9uS2V5P1xuICAgICAgICAgIEBvbkFjdGl2YXRpb25LZXkoKVxuICAgIG9ua2V5dXAgPSAoZSkgPT4gXG4gICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgIG9ua2V5cHJlc3MgPSAoZSkgPT4gXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCkgaWYgdGltZW91dD9cbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0ICg9PlxuICAgICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgICAgQG9uQW55Q2hhbmdlKGUpXG4gICAgICApLCAxMDBcbiAgICAgICAgICAgIFxuICAgIGlmIHRhcmdldC5hZGRFdmVudExpc3RlbmVyXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuICAgIGVsc2UgaWYgdGFyZ2V0LmF0dGFjaEV2ZW50XG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuXG5pc0VsZW1lbnQgPSAob2JqKSAtPlxuICB0cnlcbiAgICAjIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tKVxuICAgIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gIGNhdGNoIGVcbiAgICAjIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAjIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAjIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcbiAgICByZXR1cm4gKHR5cGVvZiBvYmo9PVwib2JqZWN0XCIpICYmXG4gICAgICAob2JqLm5vZGVUeXBlPT0xKSAmJiAodHlwZW9mIG9iai5zdHlsZSA9PSBcIm9iamVjdFwiKSAmJlxuICAgICAgKHR5cGVvZiBvYmoub3duZXJEb2N1bWVudCA9PVwib2JqZWN0XCIpXG5cbiAgICAgICAgXG5leHBvcnQgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyXG4gIGNvbnN0cnVjdG9yOiAoQHRhcmdldCkgLT5cbiAgICBzdXBlcigpXG4gICAgQG9iaiA9IGlmIGlzRWxlbWVudChAdGFyZ2V0KSB0aGVuIEB0YXJnZXQgZWxzZSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChAdGFyZ2V0KVxuICAgIHVubGVzcyBAb2JqP1xuICAgICAgdGhyb3cgXCJUZXh0QXJlYSBub3QgZm91bmRcIlxuICAgIEBuYW1lc3BhY2UgPSAndGV4dGFyZWEnXG4gICAgQGNoYW5nZUxpc3RlbmVycyA9IFtdXG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgPSAwXG4gIHN0YXJ0TGlzdGVuaW5nOiBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmdcbiAgb25BbnlDaGFuZ2U6IChlKSAtPlxuICAgIGlmIEBfc2tpcENoYW5nZUV2ZW50IDw9IDBcbiAgICAgIGZvciBjYWxsYmFjayBpbiBAY2hhbmdlTGlzdGVuZXJzXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICBlbHNlXG4gICAgICBAX3NraXBDaGFuZ2VFdmVudC0tXG4gICAgICBAb25Ta2lwZWRDaGFuZ2UoKSBpZiBAb25Ta2lwZWRDaGFuZ2U/XG4gIHNraXBDaGFuZ2VFdmVudDogKG5iID0gMSkgLT5cbiAgICBAX3NraXBDaGFuZ2VFdmVudCArPSBuYlxuICBiaW5kZWRUbzogKGNvZGV3YXZlKSAtPlxuICAgIEBvbkFjdGl2YXRpb25LZXkgPSAtPiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKVxuICAgIEBzdGFydExpc3RlbmluZyhkb2N1bWVudClcbiAgc2VsZWN0aW9uUHJvcEV4aXN0czogLT5cbiAgICBcInNlbGVjdGlvblN0YXJ0XCIgb2YgQG9ialxuICBoYXNGb2N1czogLT4gXG4gICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpcyBAb2JqXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgaWYgdmFsP1xuICAgICAgdW5sZXNzIEB0ZXh0RXZlbnRDaGFuZ2UodmFsKVxuICAgICAgICBAb2JqLnZhbHVlID0gdmFsXG4gICAgQG9iai52YWx1ZVxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICBAdGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIG9yIEBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0LCBlbmQpIG9yIHN1cGVyKHN0YXJ0LCBlbmQsIHRleHQpXG4gIHRleHRFdmVudENoYW5nZTogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUZXh0RXZlbnQnKSBpZiBkb2N1bWVudC5jcmVhdGVFdmVudD9cbiAgICBpZiBldmVudD8gYW5kIGV2ZW50LmluaXRUZXh0RXZlbnQ/IGFuZCBldmVudC5pc1RydXN0ZWQgIT0gZmFsc2VcbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIGlmIHRleHQubGVuZ3RoIDwgMVxuICAgICAgICBpZiBzdGFydCAhPSAwXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LTEsc3RhcnQpXG4gICAgICAgICAgc3RhcnQtLVxuICAgICAgICBlbHNlIGlmIGVuZCAhPSBAdGV4dExlbigpXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKGVuZCxlbmQrMSlcbiAgICAgICAgICBlbmQrK1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICBldmVudC5pbml0VGV4dEV2ZW50KCd0ZXh0SW5wdXQnLCB0cnVlLCB0cnVlLCBudWxsLCB0ZXh0LCA5KVxuICAgICAgIyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIEBvYmouZGlzcGF0Y2hFdmVudChldmVudClcbiAgICAgIEBza2lwQ2hhbmdlRXZlbnQoKVxuICAgICAgdHJ1ZVxuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kOiAodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSAtPlxuICAgIGlmIGRvY3VtZW50LmV4ZWNDb21tYW5kP1xuICAgICAgZW5kID0gQHRleHRMZW4oKSB1bmxlc3MgZW5kP1xuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dCk7XG4gICAgZWxzZSBcbiAgICAgIGZhbHNlXG5cbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdG1wQ3Vyc29yUG9zIGlmIEB0bXBDdXJzb3JQb3M/XG4gICAgaWYgQGhhc0ZvY3VzXG4gICAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgICBuZXcgUG9zKEBvYmouc2VsZWN0aW9uU3RhcnQsQG9iai5zZWxlY3Rpb25FbmQpXG4gICAgICBlbHNlXG4gICAgICAgIEBnZXRDdXJzb3JQb3NGYWxsYmFjaygpXG4gIGdldEN1cnNvclBvc0ZhbGxiYWNrOiAtPlxuICAgIGlmIEBvYmouY3JlYXRlVGV4dFJhbmdlXG4gICAgICBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKVxuICAgICAgaWYgc2VsLnBhcmVudEVsZW1lbnQoKSBpcyBAb2JqXG4gICAgICAgIHJuZyA9IEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcm5nLm1vdmVUb0Jvb2ttYXJrIHNlbC5nZXRCb29rbWFyaygpXG4gICAgICAgIGxlbiA9IDBcblxuICAgICAgICB3aGlsZSBybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDBcbiAgICAgICAgICBsZW4rK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKVxuICAgICAgICBybmcuc2V0RW5kUG9pbnQgXCJTdGFydFRvU3RhcnRcIiwgQG9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgICBwb3MgPSBuZXcgUG9zKDAsbGVuKVxuICAgICAgICB3aGlsZSBybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDBcbiAgICAgICAgICBwb3Muc3RhcnQrK1xuICAgICAgICAgIHBvcy5lbmQrK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKVxuICAgICAgICByZXR1cm4gcG9zXG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgQHRtcEN1cnNvclBvcyA9IG5ldyBQb3Moc3RhcnQsZW5kKVxuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgc2V0VGltZW91dCAoPT5cbiAgICAgICAgQHRtcEN1cnNvclBvcyA9IG51bGxcbiAgICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICApLCAxXG4gICAgZWxzZSBcbiAgICAgIEBzZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKVxuICAgIHJldHVyblxuICBzZXRDdXJzb3JQb3NGYWxsYmFjazogKHN0YXJ0LCBlbmQpIC0+XG4gICAgaWYgQG9iai5jcmVhdGVUZXh0UmFuZ2VcbiAgICAgIHJuZyA9IEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgIHJuZy5tb3ZlU3RhcnQgXCJjaGFyYWN0ZXJcIiwgc3RhcnRcbiAgICAgIHJuZy5jb2xsYXBzZSgpXG4gICAgICBybmcubW92ZUVuZCBcImNoYXJhY3RlclwiLCBlbmQgLSBzdGFydFxuICAgICAgcm5nLnNlbGVjdCgpXG4gIGdldExhbmc6IC0+XG4gICAgcmV0dXJuIEBfbGFuZyBpZiBAX2xhbmdcbiAgICBAb2JqLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJykgaWYgQG9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gICAgQG9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsdmFsKVxuICBjYW5MaXN0ZW5Ub0NoYW5nZTogLT5cbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIEBjaGFuZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjaylcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBpZiAoaSA9IEBjaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykpID4gLTFcbiAgICAgIEBjaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpXG4gICAgICBcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICBpZiByZXBsYWNlbWVudHMubGVuZ3RoID4gMCBhbmQgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMVxuICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbQGdldEN1cnNvclBvcygpXVxuICAgIHN1cGVyKHJlcGxhY2VtZW50cyk7XG4gICAgICAiLCJ2YXIgaXNFbGVtZW50O1xuXG5pbXBvcnQge1xuICBUZXh0UGFyc2VyXG59IGZyb20gJy4vVGV4dFBhcnNlcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCB2YXIgRG9tS2V5TGlzdGVuZXIgPSBjbGFzcyBEb21LZXlMaXN0ZW5lciB7XG4gIHN0YXJ0TGlzdGVuaW5nKHRhcmdldCkge1xuICAgIHZhciBvbmtleWRvd24sIG9ua2V5cHJlc3MsIG9ua2V5dXAsIHRpbWVvdXQ7XG4gICAgdGltZW91dCA9IG51bGw7XG4gICAgb25rZXlkb3duID0gKGUpID0+IHtcbiAgICAgIGlmICgoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgfHwgdGhpcy5vYmogPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpICYmIGUua2V5Q29kZSA9PT0gNjkgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMub25BY3RpdmF0aW9uS2V5ICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFjdGl2YXRpb25LZXkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgb25rZXl1cCA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uQW55Q2hhbmdlKGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgb25rZXlwcmVzcyA9IChlKSA9PiB7XG4gICAgICBpZiAodGltZW91dCAhPSBudWxsKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aW1lb3V0ID0gc2V0VGltZW91dCgoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLCAxMDApO1xuICAgIH07XG4gICAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKTtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cCk7XG4gICAgICByZXR1cm4gdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5hdHRhY2hFdmVudCkge1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlkb3duXCIsIG9ua2V5ZG93bik7XG4gICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApO1xuICAgICAgcmV0dXJuIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcyk7XG4gICAgfVxuICB9XG5cbn07XG5cbmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgZTtcbiAgdHJ5IHtcbiAgICAvLyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIC8vIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAvLyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuICAgIHJldHVybiAodHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIikgJiYgKG9iai5ub2RlVHlwZSA9PT0gMSkgJiYgKHR5cGVvZiBvYmouc3R5bGUgPT09IFwib2JqZWN0XCIpICYmICh0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT09IFwib2JqZWN0XCIpO1xuICB9XG59O1xuXG5leHBvcnQgdmFyIFRleHRBcmVhRWRpdG9yID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBUZXh0QXJlYUVkaXRvciBleHRlbmRzIFRleHRQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldDEpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDE7XG4gICAgICB0aGlzLm9iaiA9IGlzRWxlbWVudCh0aGlzLnRhcmdldCkgPyB0aGlzLnRhcmdldCA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0KTtcbiAgICAgIGlmICh0aGlzLm9iaiA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCI7XG4gICAgICB9XG4gICAgICB0aGlzLm5hbWVzcGFjZSA9ICd0ZXh0YXJlYSc7XG4gICAgICB0aGlzLmNoYW5nZUxpc3RlbmVycyA9IFtdO1xuICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50ID0gMDtcbiAgICB9XG5cbiAgICBvbkFueUNoYW5nZShlKSB7XG4gICAgICB2YXIgY2FsbGJhY2ssIGosIGxlbjEsIHJlZiwgcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPD0gMCkge1xuICAgICAgICByZWYgPSB0aGlzLmNoYW5nZUxpc3RlbmVycztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIGNhbGxiYWNrID0gcmVmW2pdO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjYWxsYmFjaygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudC0tO1xuICAgICAgICBpZiAodGhpcy5vblNraXBlZENoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25Ta2lwZWRDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNraXBDaGFuZ2VFdmVudChuYiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgKz0gbmI7XG4gICAgfVxuXG4gICAgYmluZGVkVG8oY29kZXdhdmUpIHtcbiAgICAgIHRoaXMub25BY3RpdmF0aW9uS2V5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy5zdGFydExpc3RlbmluZyhkb2N1bWVudCk7XG4gICAgfVxuXG4gICAgc2VsZWN0aW9uUHJvcEV4aXN0cygpIHtcbiAgICAgIHJldHVybiBcInNlbGVjdGlvblN0YXJ0XCIgaW4gdGhpcy5vYmo7XG4gICAgfVxuXG4gICAgaGFzRm9jdXMoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5vYmo7XG4gICAgfVxuXG4gICAgdGV4dCh2YWwpIHtcbiAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICBpZiAoIXRoaXMudGV4dEV2ZW50Q2hhbmdlKHZhbCkpIHtcbiAgICAgICAgICB0aGlzLm9iai52YWx1ZSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqLnZhbHVlO1xuICAgIH1cblxuICAgIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHRoaXMuc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSB8fCBzdXBlci5zcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpO1xuICAgIH1cblxuICAgIHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIHZhciBldmVudDtcbiAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RleHRFdmVudCcpO1xuICAgICAgfVxuICAgICAgaWYgKChldmVudCAhPSBudWxsKSAmJiAoZXZlbnQuaW5pdFRleHRFdmVudCAhPSBudWxsKSAmJiBldmVudC5pc1RydXN0ZWQgIT09IGZhbHNlKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICBpZiAoc3RhcnQgIT09IDApIHtcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQgLSAxLCBzdGFydCk7XG4gICAgICAgICAgICBzdGFydC0tO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZW5kICE9PSB0aGlzLnRleHRMZW4oKSkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihlbmQsIGVuZCArIDEpO1xuICAgICAgICAgICAgZW5kKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSk7XG4gICAgICAgIC8vIEBzZXRDdXJzb3JQb3Moc3RhcnQsZW5kKVxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHRoaXMub2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLnNraXBDaGFuZ2VFdmVudCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgICAgaWYgKGRvY3VtZW50LmV4ZWNDb21tYW5kICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgICAgaWYgKHRoaXMudG1wQ3Vyc29yUG9zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG1wQ3Vyc29yUG9zO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaGFzRm9jdXMpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJvcEV4aXN0cykge1xuICAgICAgICAgIHJldHVybiBuZXcgUG9zKHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0LCB0aGlzLm9iai5zZWxlY3Rpb25FbmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldEN1cnNvclBvc0ZhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXJzb3JQb3NGYWxsYmFjaygpIHtcbiAgICAgIHZhciBsZW4sIHBvcywgcm5nLCBzZWw7XG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgICAgICBpZiAoc2VsLnBhcmVudEVsZW1lbnQoKSA9PT0gdGhpcy5vYmopIHtcbiAgICAgICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICBybmcubW92ZVRvQm9va21hcmsoc2VsLmdldEJvb2ttYXJrKCkpO1xuICAgICAgICAgIGxlbiA9IDA7XG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMCkge1xuICAgICAgICAgICAgbGVuKys7XG4gICAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJuZy5zZXRFbmRQb2ludChcIlN0YXJ0VG9TdGFydFwiLCB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKSk7XG4gICAgICAgICAgcG9zID0gbmV3IFBvcygwLCBsZW4pO1xuICAgICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIHBvcy5zdGFydCsrO1xuICAgICAgICAgICAgcG9zLmVuZCsrO1xuICAgICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcG9zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICBlbmQgPSBzdGFydDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG51bGw7XG4gICAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICB9KSwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHZhciBybmc7XG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICBybmcubW92ZVN0YXJ0KFwiY2hhcmFjdGVyXCIsIHN0YXJ0KTtcbiAgICAgICAgcm5nLmNvbGxhcHNlKCk7XG4gICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIGVuZCAtIHN0YXJ0KTtcbiAgICAgICAgcmV0dXJuIHJuZy5zZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYW5nKCkge1xuICAgICAgaWYgKHRoaXMuX2xhbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmc7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmouZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMYW5nKHZhbCkge1xuICAgICAgdGhpcy5fbGFuZyA9IHZhbDtcbiAgICAgIHJldHVybiB0aGlzLm9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsIHZhbCk7XG4gICAgfVxuXG4gICAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmICgoaSA9IHRoaXMuY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5nZUxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKSB7XG4gICAgICBpZiAocmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgJiYgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucyA9IFt0aGlzLmdldEN1cnNvclBvcygpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICAgIH1cblxuICB9O1xuXG4gIFRleHRBcmVhRWRpdG9yLnByb3RvdHlwZS5zdGFydExpc3RlbmluZyA9IERvbUtleUxpc3RlbmVyLnByb3RvdHlwZS5zdGFydExpc3RlbmluZztcblxuICByZXR1cm4gVGV4dEFyZWFFZGl0b3I7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJpbXBvcnQgeyBFZGl0b3IgfSBmcm9tICcuL0VkaXRvcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yXG4gIGNvbnN0cnVjdG9yOiAoQF90ZXh0KSAtPlxuICAgIHN1cGVyKClcbiAgdGV4dDogKHZhbCkgLT5cbiAgICBAX3RleHQgPSB2YWwgaWYgdmFsP1xuICAgIEBfdGV4dFxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHJldHVybiBAdGV4dCgpW3Bvc11cbiAgdGV4dExlbjogKHBvcykgLT5cbiAgICByZXR1cm4gQHRleHQoKS5sZW5ndGhcbiAgdGV4dFN1YnN0cjogKHN0YXJ0LCBlbmQpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICBAdGV4dChAdGV4dCgpLnN1YnN0cmluZygwLCBwb3MpK3RleHQrQHRleHQoKS5zdWJzdHJpbmcocG9zLEB0ZXh0KCkubGVuZ3RoKSlcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHQoQHRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIEB0ZXh0KCkuc2xpY2UoZW5kKSlcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdGFyZ2V0XG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBAdGFyZ2V0ID0gbmV3IFBvcyggc3RhcnQsIGVuZCApIiwiaW1wb3J0IHtcbiAgRWRpdG9yXG59IGZyb20gJy4vRWRpdG9yJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IHZhciBUZXh0UGFyc2VyID0gY2xhc3MgVGV4dFBhcnNlciBleHRlbmRzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKF90ZXh0KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl90ZXh0ID0gX3RleHQ7XG4gIH1cblxuICB0ZXh0KHZhbCkge1xuICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dCA9IHZhbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKVtwb3NdO1xuICB9XG5cbiAgdGV4dExlbihwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkubGVuZ3RoO1xuICB9XG5cbiAgdGV4dFN1YnN0cihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgfVxuXG4gIGluc2VydFRleHRBdCh0ZXh0LCBwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnN1YnN0cmluZygwLCBwb3MpICsgdGV4dCArIHRoaXMudGV4dCgpLnN1YnN0cmluZyhwb3MsIHRoaXMudGV4dCgpLmxlbmd0aCkpO1xuICB9XG5cbiAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIHRoaXMudGV4dCgpLnNsaWNlKGVuZCkpO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnRhcmdldDtcbiAgfVxuXG4gIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBlbmQgPSBzdGFydDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0ID0gbmV3IFBvcyhzdGFydCwgZW5kKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuaW1wb3J0IHsgQ29yZUNvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IEpzQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IFBocENvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9QaHBDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgSHRtbENvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IEZpbGVDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBXcmFwcGVkUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9XcmFwcGVkUG9zJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZUVuZ2luZSB9IGZyb20gJy4vc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lJztcblxuUG9zLndyYXBDbGFzcyA9IFdyYXBwZWRQb3NcblxuQ29kZXdhdmUuaW5zdGFuY2VzID0gW11cblxuQ29tbWFuZC5wcm92aWRlcnMgPSBbXG4gIG5ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IEpzQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IFBocENvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IEZpbGVDb21tYW5kUHJvdmlkZXIoKVxuXVxuXG5pZiBsb2NhbFN0b3JhZ2U/XG4gIENvbW1hbmQuc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2VFbmdpbmUoKVxuXG5leHBvcnQgeyBDb2Rld2F2ZSB9IiwiaW1wb3J0IHtcbiAgQ29kZXdhdmVcbn0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgQ29yZUNvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIEpzQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9Kc0NvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIFBocENvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgSHRtbENvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIEZpbGVDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL0ZpbGVDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5pbXBvcnQge1xuICBXcmFwcGVkUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvV3JhcHBlZFBvcyc7XG5cbmltcG9ydCB7XG4gIExvY2FsU3RvcmFnZUVuZ2luZVxufSBmcm9tICcuL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZSc7XG5cblBvcy53cmFwQ2xhc3MgPSBXcmFwcGVkUG9zO1xuXG5Db2Rld2F2ZS5pbnN0YW5jZXMgPSBbXTtcblxuQ29tbWFuZC5wcm92aWRlcnMgPSBbbmV3IENvcmVDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEpzQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBQaHBDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEh0bWxDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEZpbGVDb21tYW5kUHJvdmlkZXIoKV07XG5cbmlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlRW5naW5lKCk7XG59XG5cbmV4cG9ydCB7XG4gIENvZGV3YXZlXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kLCBCYXNlQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgTGFuZ0RldGVjdG9yIH0gZnJvbSAnLi4vZGV0ZWN0b3JzL0xhbmdEZXRlY3Rvcic7XG5pbXBvcnQgeyBBbHdheXNFbmFibGVkIH0gZnJvbSAnLi4vZGV0ZWN0b3JzL0Fsd2F5c0VuYWJsZWQnO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi4vQm94SGVscGVyJztcbmltcG9ydCB7IEVkaXRDbWRQcm9wIH0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGF0aEhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvUGF0aEhlbHBlcic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKVxuICBjbWRzLmFkZERldGVjdG9yKG5ldyBBbHdheXNFbmFibGVkKCdjb3JlJykpXG4gIGNvcmUuYWRkRGV0ZWN0b3IobmV3IExhbmdEZXRlY3RvcigpKVxuICBcbiAgY29yZS5hZGRDbWRzKHtcbiAgICAnaGVscCc6e1xuICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICdyZXN1bHQnIDogaGVscCxcbiAgICAgICdwYXJzZScgOiB0cnVlLFxuICAgICAgJ2FsbG93ZWROYW1lZCcgOiBbJ2NtZCddLFxuICAgICAgJ2hlbHAnIDogXCJcIlwiXG4gICAgICAgIFRvIGdldCBoZWxwIG9uIGEgcGVjaWZpYyBjb21tYW5kLCBkbyA6XG4gICAgICAgIH5+aGVscCBoZWxsb35+IChoZWxsbyBiZWluZyB0aGUgY29tbWFuZClcbiAgICAgICAgXCJcIlwiIFxuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnb3ZlcnZpZXcnOntcbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICAgIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXG4gICAgICAgICAgICAgLyBfX3xfX18gIF9ffCB8X19cXFxcIFxcXFwgICAgLyAvXyBfX18gX19fX19fXG4gICAgICAgICAgICAvIC9fXy8gXyBcXFxcLyBfYCAvIC1fXFxcXCBcXFxcL1xcXFwvIC8gX2AgXFxcXCBWIC8gLV8vXG4gICAgICAgICAgICBcXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XG4gICAgICAgICAgICBUaGUgdGV4dCBlZGl0b3IgaGVscGVyXG4gICAgICAgICAgICB+fi9xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBXaGVuIHVzaW5nIENvZGV3YXZlIHlvdSB3aWxsIGJlIHdyaXRpbmcgY29tbWFuZHMgd2l0aGluIFxuICAgICAgICAgICAgeW91ciB0ZXh0IGVkaXRvci4gVGhlc2UgY29tbWFuZHMgbXVzdCBiZSBwbGFjZWQgYmV0d2VlbiB0d28gXG4gICAgICAgICAgICBwYWlycyBvZiBcIn5cIiAodGlsZGUpIGFuZCB0aGVuLCB0aGV5IGNhbiBiZSBleGVjdXRlZCBieSBwcmVzc2luZyBcbiAgICAgICAgICAgIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiwgd2l0aCB5b3VyIGN1cnNvciBpbnNpZGUgdGhlIGNvbW1hbmRcbiAgICAgICAgICAgIEV4OiB+fiFoZWxsb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFlvdSBkb250IG5lZWQgdG8gYWN0dWFsbHkgdHlwZSBhbnkgXCJ+XCIgKHRpbGRlKS4gXG4gICAgICAgICAgICBQcmVzc2luZyBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XG4gICAgICAgICAgICB3aXRoaW4gYSBjb21tYW5kLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxuICAgICAgICAgICAgSW5zdGVhZCwgaXQgdXNlcyB0ZXh0IHdpdGhpbiBjb2RlIGNvbW1lbnRzIHRvIG1pbWljIFVJcy4gXG4gICAgICAgICAgICBUaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcbiAgICAgICAgICAgIGluIHRoZSBoZWxwIHNlY3Rpb25zLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBUbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXG4gICAgICAgICAgICBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBVc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcbiAgICAgICAgICAgIGZlYXR1cmVzIG9mIENvZGV3YXZlXG4gICAgICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgTGlzdCBvZiBhbGwgaGVscCBzdWJqZWN0cyBcbiAgICAgICAgICAgIH5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fiFjbG9zZX5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ3N1YmplY3RzJzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn4haGVscH5+XG4gICAgICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxuICAgICAgICAgICAgfn4haGVscDpzdWJqZWN0c35+ICh+fiFoZWxwOnN1Yn5+KVxuICAgICAgICAgICAgfn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnc3ViJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpoZWxwOnN1YmplY3RzJ1xuICAgICAgICB9XG4gICAgICAgICdnZXRfc3RhcnRlZCc6e1xuICAgICAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICAgIFRoZSBjbGFzc2ljIEhlbGxvIFdvcmxkLlxuICAgICAgICAgICAgfn4haGVsbG98fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn5oZWxwOmVkaXRpbmc6aW50cm9+flxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBjcmVhdGluZyB5b3VyIG93biBjb21tYW5kcywgc2VlOlxuICAgICAgICAgICAgfn4haGVscDplZGl0aW5nfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29kZXdhdmUgY29tZXMgd2l0aCBtYW55IHByZS1leGlzdGluZyBjb21tYW5kcy4gSGVyZSBpcyBhbiBleGFtcGxlXG4gICAgICAgICAgICBvZiBKYXZhU2NyaXB0IGFiYnJldmlhdGlvbnNcbiAgICAgICAgICAgIH5+IWpzOmZ+flxuICAgICAgICAgICAgfn4hanM6aWZ+flxuICAgICAgICAgICAgICB+fiFqczpsb2d+flwifn4haGVsbG9+flwifn4hL2pzOmxvZ35+XG4gICAgICAgICAgICB+fiEvanM6aWZ+flxuICAgICAgICAgICAgfn4hL2pzOmZ+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXG4gICAgICAgICAgICBwcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxuICAgICAgICAgICAgdXNlZCBhdXRvbWF0aWNhbGx5IGlmIHlvdSBhcmUgaW4gYSBIVE1MIG9yIENTUyBmaWxlLlxuICAgICAgICAgICAgfn4hdWw+bGl+fiAoaWYgeW91IGFyZSBpbiBhIGh0bWwgZG9jY3VtZW50KVxuICAgICAgICAgICAgfn4hZW1tZXQgdWw+bGl+flxuICAgICAgICAgICAgfn4hZW1tZXQgbTIgY3Nzfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxuICAgICAgICAgICAgZGlmZmVyZW50IHJlc3VsdHMgZGVwZW5kaW5nIG9uIHRoZSBuYW1lc3BhY2UuXG4gICAgICAgICAgICB+fiFqczplYWNofn5cbiAgICAgICAgICAgIH5+IXBocDpvdXRlcjplYWNofn5cbiAgICAgICAgICAgIH5+IXBocDppbm5lcjplYWNofn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXG4gICAgICAgICAgICBmb2xsb3dpbmcgY29tbWFuZHMgYXJlIHRoZSBzYW1lIGFuZCB3aWxsIGRpc3BsYXkgdGhlIGN1cnJlbnRseVxuICAgICAgICAgICAgYWN0aXZlIG5hbWVzcGFjZS4gVGhlIGZpcnN0IGNvbW1hbmQgY29tbWFuZCB3b3JrcyBiZWNhdXNlIHRoZSBcbiAgICAgICAgICAgIGNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZX5+XG4gICAgICAgICAgICB+fiFjb3JlOm5hbWVzcGFjZX5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFlvdSBjYW4gbWFrZSBhIG5hbWVzcGFjZSBhY3RpdmUgd2l0aCB0aGUgZm9sbG93aW5nIGNvbW1hbmQuXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2UgcGhwfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ2hlY2sgdGhlIG5hbWVzcGFjZXMgYWdhaW5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZX5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEluIGFkZGl0aW9uIHRvIGRldGVjdGluZyB0aGUgZG9jdW1lbnQgdHlwZSwgQ29kZXdhdmUgY2FuIGRldGVjdCB0aGVcbiAgICAgICAgICAgIGNvbnRleHQgZnJvbSB0aGUgc3Vycm91bmRpbmcgdGV4dC4gSW4gYSBQSFAgZmlsZSwgaXQgbWVhbnMgQ29kZXdhdmUgXG4gICAgICAgICAgICB3aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fi9xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnZGVtbyc6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6aGVscDpnZXRfc3RhcnRlZCdcbiAgICAgICAgfVxuICAgICAgICAnZWRpdGluZyc6e1xuICAgICAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgICAgICdpbnRybyc6e1xuICAgICAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgICAgIENvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXG4gICAgICAgICAgICAgICAgcHV0IHlvdXIgY29udGVudCBpbnNpZGUgXCJzb3VyY2VcIiB0aGUgZG8gXCJzYXZlXCIuIFRyeSBhZGRpbmcgYW55IFxuICAgICAgICAgICAgICAgIHRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXG4gICAgICAgICAgICAgICAgfn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIElmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XG4gICAgICAgICAgICAgICAgZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxuICAgICAgICAgICAgICAgIHdoZW5ldmVyIHlvdSB3YW50LlxuICAgICAgICAgICAgICAgIH5+IW15X25ld19jb21tYW5kfn5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn5oZWxwOmVkaXRpbmc6aW50cm9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBBbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcImJveFwiLiBcbiAgICAgICAgICAgIFRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXG4gICAgICAgICAgICBUaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXG4gICAgICAgICAgICBcImNsb3NlXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxuICAgICAgICAgICAgY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5LlxuICAgICAgICAgICAgfn4hYm94fn5cbiAgICAgICAgICAgIFRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgV2hlbiB5b3UgY3JlYXRlIGEgY29tbWFuZCwgeW91IG1heSB3YW50IHRvIHNwZWNpZnkgd2hlcmUgdGhlIGN1cnNvciBcbiAgICAgICAgICAgIHdpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcInxcIiBcbiAgICAgICAgICAgIChWZXJ0aWNhbCBiYXIpLiBVc2UgMiBvZiB0aGVtIGlmIHlvdSB3YW50IHRvIHByaW50IHRoZSBhY3R1YWwgXG4gICAgICAgICAgICBjaGFyYWN0ZXIuXG4gICAgICAgICAgICB+fiFib3h+flxuICAgICAgICAgICAgb25lIDogfCBcbiAgICAgICAgICAgIHR3byA6IHx8XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgWW91IGNhbiBhbHNvIHVzZSB0aGUgXCJlc2NhcGVfcGlwZXNcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxuICAgICAgICAgICAgdmVydGljYWwgYmFycyB0aGF0IGFyZSBiZXR3ZWVuIGl0cyBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3NcbiAgICAgICAgICAgIH5+IWVzY2FwZV9waXBlc35+XG4gICAgICAgICAgICB8XG4gICAgICAgICAgICB+fiEvZXNjYXBlX3BpcGVzfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cbiAgICAgICAgICAgIElmIHlvdSB3YW50IHRvIHByaW50IGEgY29tbWFuZCB3aXRob3V0IGhhdmluZyBpdCBleHBhbmQgd2hlbiBcbiAgICAgICAgICAgIHRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXCIhXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxuICAgICAgICAgICAgfn4hIWhlbGxvfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXG4gICAgICAgICAgICB0aGUgXCJjb250ZW50XCIgY29tbWFuZC4gXCJjb250ZW50XCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XG4gICAgICAgICAgICB0aGF0IGlzIGJldHdlZW4gdGhlIHRhZ3MuIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBob3cgaXQgY2FuIGJlIHVzZWQuXG4gICAgICAgICAgICB+fiFlZGl0IHBocDppbm5lcjppZn5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdlZGl0Jzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpoZWxwOmVkaXRpbmcnXG4gICAgICAgIH1cbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgfSxcbiAgICAnbm9fZXhlY3V0ZSc6e1xuICAgICAgJ3Jlc3VsdCcgOiBub19leGVjdXRlXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBQcmV2ZW50IGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgZnJvbSBleGVjdXRpbmdcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnZXNjYXBlX3BpcGVzJzp7XG4gICAgICAncmVzdWx0JyA6IHF1b3RlX2NhcnJldCxcbiAgICAgICdjaGVja0NhcnJldCcgOiBmYWxzZVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgRXNjYXBlIGFsbCBjYXJyZXRzIChmcm9tIFwifFwiIHRvIFwifHxcIilcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncXVvdGVfY2FycmV0Jzp7XG4gICAgICAnYWxpYXNPZic6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICB9XG4gICAgJ2V4ZWNfcGFyZW50Jzp7XG4gICAgICAnZXhlY3V0ZScgOiBleGVjX3BhcmVudFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1xuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdjb250ZW50Jzp7XG4gICAgICAncmVzdWx0JyA6IGdldENvbnRlbnRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIE1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxuICAgICAgICB0aGlzIHdpbGwgcmV0dXJuIHdoYXQgd2FzIGJldHdlZW4gdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBvZiBhIGNvbW1hbmRcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnYm94Jzp7XG4gICAgICAnY2xzJyA6IEJveENtZFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQ3JlYXRlIHRoZSBhcHBhcmVuY2Ugb2YgYSBib3ggY29tcG9zZWQgZnJvbSBjaGFyYWN0ZXJzLiBcbiAgICAgICAgVXN1YWxseSB3cmFwcGVkIGluIGEgY29tbWVudC5cblxuICAgICAgICBUaGUgYm94IHdpbGwgdHJ5IHRvIGFqdXN0IGl0J3Mgc2l6ZSBmcm9tIHRoZSBjb250ZW50XG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2Nsb3NlJzp7XG4gICAgICAnY2xzJyA6IENsb3NlQ21kXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBXaWxsIGNsb3NlIHRoZSBmaXJzdCBib3ggYXJvdW5kIHRoaXNcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncGFyYW0nOntcbiAgICAgICdyZXN1bHQnIDogZ2V0UGFyYW1cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIE1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxuICAgICAgICB0aGlzIHdpbGwgcmV0dXJuIGEgcGFyYW1ldGVyIGZyb20gdGhpcyBjb21tYW5kIGNhbGxcblxuICAgICAgICBZb3UgY2FuIHBhc3MgYSBudW1iZXIsIGEgc3RyaW5nLCBvciBib3RoLiBcbiAgICAgICAgQSBudW1iZXIgZm9yIGEgcG9zaXRpb25lZCBhcmd1bWVudCBhbmQgYSBzdHJpbmdcbiAgICAgICAgZm9yIGEgbmFtZWQgcGFyYW1ldGVyXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2VkaXQnOntcbiAgICAgICdjbWRzJyA6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICdzYXZlJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAnY2xzJyA6IEVkaXRDbWQsXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2NtZCddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxuICAgICAgICBTZWUgfn4haGVscDplZGl0aW5nfn4gZm9yIGEgcXVpY2sgdHV0b3JpYWxcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncmVuYW1lJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfYXBwbGljYWJsZScgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCIsXG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiByZW5hbWVDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWUsXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2Zyb20nLCd0byddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBBbGxvd3MgdG8gcmVuYW1lIGEgY29tbWFuZCBhbmQgY2hhbmdlIGl0J3MgbmFtZXNwYWNlLiBcbiAgICAgICAgWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAtIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcbiAgICAgICAgLSBUaGVuIHNlY29uZCBwYXJhbSBpcyB0aGUgbmV3IG5hbWUsIGlmIGl0IGhhcyBubyBuYW1lc3BhY2UsXG4gICAgICAgICAgaXQgd2lsbCB1c2UgdGhlIG9uZSBmcm9tIHRoZSBvcmlnaW5hbCBjb21tYW5kLlxuXG4gICAgICAgIGV4Ljogfn4hcmVuYW1lIG15X2NvbW1hbmQgbXlfY29tbWFuZDJ+flxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdyZW1vdmUnOntcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ25vdF9hcHBsaWNhYmxlJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBZb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIixcbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgICAncmVzdWx0JyA6IHJlbW92ZUNvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydjbWQnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQWxsb3dzIHRvIHJlbW92ZSBhIGNvbW1hbmQuIFxuICAgICAgICBZb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2FsaWFzJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiBhbGlhc0NvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgIH0sXG4gICAgJ25hbWVzcGFjZSc6e1xuICAgICAgJ2NscycgOiBOYW1lU3BhY2VDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIFNob3cgdGhlIGN1cnJlbnQgbmFtZXNwYWNlcy5cblxuICAgICAgICBBIG5hbWUgc3BhY2UgY291bGQgYmUgdGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlXG4gICAgICAgIG9yIG90aGVyIGtpbmQgb2YgY29udGV4dHNcblxuICAgICAgICBJZiB5b3UgcGFzcyBhIHBhcmFtIHRvIHRoaXMgY29tbWFuZCwgaXQgd2lsbCBcbiAgICAgICAgYWRkIHRoZSBwYXJhbSBhcyBhIG5hbWVzcGFjZSBmb3IgdGhlIGN1cnJlbnQgZWRpdG9yXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ25zcGMnOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOm5hbWVzcGFjZSdcbiAgICB9LFxuICAgICdsaXN0Jzp7XG4gICAgICAncmVzdWx0JyA6IGxpc3RDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCdib3gnLCdjb250ZXh0J11cbiAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcblxuICAgICAgICBZb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcbiAgICAgICAgYnkgZGVmYXVsdCBhbGwgY3VyZW50IG5hbWVzcGFjZSB3aWxsIGJlIHNob3duXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2xzJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTpsaXN0J1xuICAgIH0sXG4gICAgJ2dldCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBnZXRDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgb3V0cHV0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3NldCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBzZXRDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCd2YWx1ZScsJ3ZhbCddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBzZXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnc3RvcmVfanNvbic6e1xuICAgICAgJ3Jlc3VsdCcgOiBzdG9yZUpzb25Db21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCdqc29uJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHNldCBhIHZhcmlhYmxlIHdpdGggc29tZSBqc29uIGRhdGFcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnanNvbic6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6c3RvcmVfanNvbidcbiAgICB9LFxuICAgICd0ZW1wbGF0ZSc6e1xuICAgICAgJ2NscycgOiBUZW1wbGF0ZUNtZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJywnc2VwJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHJlbmRlciBhIHRlbXBsYXRlIGZvciBhIHZhcmlhYmxlXG5cbiAgICAgICAgSWYgdGhlIGZpcnN0IHBhcmFtIGlzIG5vdCBzZXQgaXQgd2lsbCB1c2UgYWxsIHZhcmlhYmxlcyBcbiAgICAgICAgZm9yIHRoZSByZW5kZXJcbiAgICAgICAgSWYgdGhlIHZhcmlhYmxlIGlzIGFuIGFycmF5IHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIHJlcGVhdGVkIFxuICAgICAgICBmb3IgZWFjaCBpdGVtc1xuICAgICAgICBUaGUgYHNlcGAgcGFyYW0gZGVmaW5lIHdoYXQgd2lsbCBzZXBhcmF0ZSBlYWNoIGl0ZW0gXG4gICAgICAgIGFuZCBkZWZhdWx0IHRvIGEgbGluZSBicmVha1xuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdlbW1ldCc6e1xuICAgICAgJ2NscycgOiBFbW1ldENtZFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxuICAgICAgICBwcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy5cblxuICAgICAgICBQYXNzIHRoZSBFbW1ldCBhYmJyZXZpYXRpb24gYXMgYSBwYXJhbSB0byBleHBlbmQgaXQuXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgXG4gIH0pXG4gIFxuaGVscCA9IChpbnN0YW5jZSkgLT5cbiAgY21kTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgaWYgY21kTmFtZT9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChjbWROYW1lKVxuICAgIGlmIGNtZD9cbiAgICAgIGhlbHBDbWQgPSBjbWQuZ2V0Q21kKCdoZWxwJylcbiAgICAgIHRleHQgPSBpZiBoZWxwQ21kIHRoZW4gXCJ+fiN7aGVscENtZC5mdWxsTmFtZX1+flwiIGVsc2UgXCJUaGlzIGNvbW1hbmQgaGFzIG5vIGhlbHAgdGV4dFwiXG4gICAgICBzdWJjb21tYW5kcyA9IGlmIGNtZC5jbWRzLmxlbmd0aFxuICAgICAgICBcIlwiXCJcblxuICAgICAgICBTdWItQ29tbWFuZHMgOlxuICAgICAgICB+fmxzICN7Y21kLmZ1bGxOYW1lfSBib3g6bm8gY29udGV4dDpub35+XG4gICAgICAgIFwiXCJcIlxuICAgICAgZWxzZSBcbiAgICAgICAgXCJcIlxuICAgICAgcmV0dXJuIFwiXCJcIlxuICAgICAgICB+fmJveH5+XG4gICAgICAgIEhlbHAgZm9yIH5+ISN7Y21kLmZ1bGxOYW1lfX5+IDpcblxuICAgICAgICAje3RleHR9XG4gICAgICAgICN7c3ViY29tbWFuZHN9XG5cbiAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgfn4vYm94fn5cbiAgICAgICAgXCJcIlwiXG4gICAgZWxzZSBcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIlxuICBlbHNlXG4gICAgcmV0dXJuICd+fmhlbHA6b3ZlcnZpZXd+fidcblxubm9fZXhlY3V0ZSA9IChpbnN0YW5jZSkgLT5cbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIrU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzKSArICcpJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikpXG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsJyQxJylcbiAgXG5xdW90ZV9jYXJyZXQgPSAoaW5zdGFuY2UpIC0+XG4gIHJldHVybiBpbnN0YW5jZS5jb250ZW50LnJlcGxhY2UoL1xcfC9nLCAnfHwnKVxuZXhlY19wYXJlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGlmIGluc3RhbmNlLnBhcmVudD9cbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpXG4gICAgaW5zdGFuY2UucmVwbGFjZVN0YXJ0ID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VTdGFydFxuICAgIGluc3RhbmNlLnJlcGxhY2VFbmQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZUVuZFxuICAgIHJldHVybiByZXNcbmdldENvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSxmYWxzZSlcbiAgcHJlZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgc3VmZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgaWYgaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZT9cbiAgICByZXR1cm4gcHJlZml4ICsgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuY29udGVudCBvciAnJykgKyBzdWZmaXhcbiAgaWYgYWZmaXhlc19lbXB0eVxuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXhcbnJlbmFtZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG4gICAgc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgLnRoZW4gKHNhdmVkQ21kcyk9PlxuICAgIG9yaWduaW5hbE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZnJvbSddKVxuICAgIG5ld05hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwndG8nXSlcbiAgICBpZiBvcmlnbmluYWxOYW1lPyBhbmQgbmV3TmFtZT9cbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG9yaWduaW5hbE5hbWUpXG4gICAgICBpZiBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0/IGFuZCBjbWQ/XG4gICAgICAgIHVubGVzcyBuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAgICAgbmV3TmFtZSA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG9yaWduaW5hbE5hbWUsJycpICsgbmV3TmFtZVxuICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsY21kRGF0YSlcbiAgICAgICAgY21kLnVucmVnaXN0ZXIoKVxuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhXG4gICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgICAudGhlbiA9PlxuICAgICAgICAgIHJldHVybiBcIlwiXG4gICAgICBlbHNlIGlmIGNtZD8gXG4gICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiXG4gICAgICBlbHNlIFxuICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbnJlbW92ZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2NtZCddKVxuICAgIGlmIG5hbWU/XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICAgIHN0b3JhZ2UgPSBDb21tYW5kLnN0b3JhZ2VcbiAgICAgICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAgIC50aGVuIChzYXZlZENtZHMpPT5cbiAgICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQobmFtZSlcbiAgICAgICAgaWYgc2F2ZWRDbWRzW25hbWVdPyBhbmQgY21kP1xuICAgICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbbmFtZV1cbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpXG4gICAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tuYW1lXVxuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgICAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgICAgIC50aGVuID0+XG4gICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBlbHNlIGlmIGNtZD8gXG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCJcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbmFsaWFzQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIGFsaWFzID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2FsaWFzJ10pXG4gIGlmIG5hbWU/IGFuZCBhbGlhcz9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuICAgIGlmIGNtZD9cbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgb3IgY21kXG4gICAgICAjIHVubGVzcyBhbGlhcy5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgICAjIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7IGFsaWFzT2Y6IGNtZC5mdWxsTmFtZSB9KVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIFxuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5cbmxpc3RDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBib3ggPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydib3gnXSx0cnVlKVxuICB1c2VDb250ZXh0ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnY29udGV4dCddLHRydWUpXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICBuYW1lc3BhY2VzID0gaWYgbmFtZSBcbiAgICBbbmFtZV0gXG4gIGVsc2UgXG4gICAgaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCkuZmlsdGVyKChuc3BjKSA9PiBuc3BjICE9IGluc3RhbmNlLmNtZC5mdWxsTmFtZSkuY29uY2F0KFwiX3Jvb3RcIilcblxuICBjb250ZXh0ID0gaWYgdXNlQ29udGV4dFxuICAgIGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KClcbiAgZWxzZVxuICAgIGluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0XG5cbiAgY29tbWFuZHMgPSBuYW1lc3BhY2VzLnJlZHVjZSAoY29tbWFuZHMsIG5zcGMpID0+IFxuICAgICAgY21kID0gaWYgbnNwYyA9PSBcIl9yb290XCIgdGhlbiBDb21tYW5kLmNtZHMgZWxzZSBjb250ZXh0LmdldENtZChuc3BjLG11c3RFeGVjdXRlOmZhbHNlKVxuICAgICAgaWYgY21kP1xuICAgICAgICBjbWQuaW5pdCgpXG4gICAgICAgIGlmIGNtZC5jbWRzXG4gICAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5jb25jYXQoY21kLmNtZHMpXG4gICAgICBjb21tYW5kc1xuICAgICwgW11cblxuICB0ZXh0ID0gaWYgY29tbWFuZHMubGVuZ3RoIFxuICAgIGNvbW1hbmRzLm1hcCgoY21kKT0+IFxuICAgICAgY21kLmluaXQoKVxuICAgICAgKGlmIGNtZC5pc0V4ZWN1dGFibGUoKSB0aGVuICd+fiEnIGVsc2UgJ35+IWxzICcpK2NtZC5mdWxsTmFtZSsnfn4nXG4gICAgKS5qb2luKFwiXFxuXCIpXG4gIGVsc2VcbiAgICBcIlRoaXMgY29udGFpbnMgbm8gc3ViLWNvbW1hbmRzXCJcblxuICBpZiBib3hcbiAgICBcIlwiXCJcbiAgICAgIH5+Ym94fn5cbiAgICAgICN7dGV4dH1cblxuICAgICAgfn4hY2xvc2V8fn5cbiAgICAgIH5+L2JveH5+XG4gICAgICBcIlwiXCJcbiAgZWxzZVxuICAgIHRleHRcbiAgXG5nZXRDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgcmVzID0gUGF0aEhlbHBlci5nZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsbmFtZSlcbiAgaWYgdHlwZW9mIHJlcyA9PSBcIm9iamVjdFwiXG4gICAgSlNPTi5zdHJpbmdpZnkocmVzLG51bGwsJyAgJylcbiAgZWxzZVxuICAgIHJlc1xuXG5zZXRDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwndmFsdWUnLCd2YWwnXSkpP1xuICAgIHBcbiAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgaW5zdGFuY2UuY29udGVudFxuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycyxuYW1lLHZhbClcbiAgJydcblxuc3RvcmVKc29uQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIHZhbCA9IGlmIChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2pzb24nXSkpP1xuICAgIHBcbiAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgaW5zdGFuY2UuY29udGVudFxuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycyxuYW1lLCBKU09OLnBhcnNlKHZhbCkpXG4gICcnXG5cbmdldFBhcmFtID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlP1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcyxpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsJ2RlZmF1bHQnXSkpXG4gIFxuY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAaGVscGVyID0gbmV3IEJveEhlbHBlcihAaW5zdGFuY2UuY29udGV4dClcbiAgICBAY21kID0gQGluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pXG4gICAgaWYgQGNtZD9cbiAgICAgIEBoZWxwZXIub3BlblRleHQgID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAY21kICsgQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIEBoZWxwZXIuY2xvc2VUZXh0ID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZC5zcGxpdChcIiBcIilbMF0gKyBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgIEBoZWxwZXIuZGVjbyA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5kZWNvXG4gICAgQGhlbHBlci5wYWQgPSAyXG4gICAgQGhlbHBlci5wcmVmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgICBAaGVscGVyLnN1ZmZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCcnKVxuICAgIFxuICBoZWlnaHQ6IC0+XG4gICAgaWYgQGJvdW5kcygpP1xuICAgICAgaGVpZ2h0ID0gQGJvdW5kcygpLmhlaWdodFxuICAgIGVsc2VcbiAgICAgIGhlaWdodCA9IDNcbiAgICAgIFxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J11cbiAgICBpZiBAaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEgXG4gICAgICBwYXJhbXMucHVzaCgxKVxuICAgIGVsc2UgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAwXG4gICAgICBwYXJhbXMucHVzaCgwKVxuICAgIHJldHVybiBAaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLGhlaWdodClcbiAgICAgIFxuICB3aWR0aDogLT5cbiAgICBpZiBAYm91bmRzKCk/XG4gICAgICB3aWR0aCA9IEBib3VuZHMoKS53aWR0aFxuICAgIGVsc2VcbiAgICAgIHdpZHRoID0gM1xuICAgICAgXG4gICAgcGFyYW1zID0gWyd3aWR0aCddXG4gICAgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxIFxuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICByZXR1cm4gTWF0aC5tYXgoQG1pbldpZHRoKCksIEBpbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSlcblxuICBcbiAgYm91bmRzOiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgQF9ib3VuZHM/XG4gICAgICAgIEBfYm91bmRzID0gQGhlbHBlci50ZXh0Qm91bmRzKEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcmV0dXJuIEBfYm91bmRzXG4gICAgICBcbiAgcmVzdWx0OiAtPlxuICAgIEBoZWxwZXIuaGVpZ2h0ID0gQGhlaWdodCgpXG4gICAgQGhlbHBlci53aWR0aCA9IEB3aWR0aCgpXG4gICAgcmV0dXJuIEBoZWxwZXIuZHJhdyhAaW5zdGFuY2UuY29udGVudClcbiAgbWluV2lkdGg6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJldHVybiBAY21kLmxlbmd0aFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwXG4gIFxuY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBpbnN0YW5jZS5jb250ZXh0KVxuICBleGVjdXRlOiAtPlxuICAgIHByZWZpeCA9IEBoZWxwZXIucHJlZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gICAgc3VmZml4ID0gQGhlbHBlci5zdWZmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgICBib3ggPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3JlcXVpcmVkX2FmZml4ZXMnXSx0cnVlKVxuICAgIGlmICFyZXF1aXJlZF9hZmZpeGVzXG4gICAgICBAaGVscGVyLnByZWZpeCA9IEBoZWxwZXIuc3VmZml4ID0gJydcbiAgICAgIGJveDIgPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgICBpZiBib3gyPyBhbmQgKCFib3g/IG9yIGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIG9yIGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpXG4gICAgICAgIGJveCA9IGJveDJcbiAgICBpZiBib3g/XG4gICAgICBkZXB0aCA9IEBoZWxwZXIuZ2V0TmVzdGVkTHZsKEBpbnN0YW5jZS5nZXRQb3MoKS5zdGFydClcbiAgICAgIGlmIGRlcHRoIDwgMlxuICAgICAgICBAaW5zdGFuY2UuaW5Cb3ggPSBudWxsXG4gICAgICBAaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LGJveC5lbmQsJycpKVxuICAgIGVsc2VcbiAgICAgIEBpbnN0YW5jZS5yZXBsYWNlV2l0aCgnJylcbiAgICAgICAgICBcbmNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBjbWROYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgICBAdmVyYmFsaXplID0gQGluc3RhbmNlLmdldFBhcmFtKFsxXSkgaW4gWyd2JywndmVyYmFsaXplJ11cbiAgICBpZiBAY21kTmFtZT9cbiAgICAgIEBmaW5kZXIgPSBAaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRGaW5kZXIoQGNtZE5hbWUpIFxuICAgICAgQGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgQGVkaXRhYmxlID0gaWYgQGNtZD8gdGhlbiBAY21kLmlzRWRpdGFibGUoKSBlbHNlIHRydWVcbiAgcmVzdWx0OiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICByZXR1cm4gQHJlc3VsdFdpdGhDb250ZW50KClcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQHJlc3VsdFdpdGhvdXRDb250ZW50KClcbiAgcmVzdWx0V2l0aENvbnRlbnQ6IC0+XG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChAaW5zdGFuY2UuY29udGVudClcbiAgICAgIHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICBkYXRhID0ge31cbiAgICAgIGZvciBwIGluIEVkaXRDbWQucHJvcHNcbiAgICAgICAgcC53cml0ZUZvcihwYXJzZXIsZGF0YSlcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChAY21kTmFtZSwgZGF0YSlcbiAgICAgIHJldHVybiAnJ1xuICBwcm9wc0Rpc3BsYXk6IC0+XG4gICAgICBjbWQgPSBAY21kXG4gICAgICByZXR1cm4gRWRpdENtZC5wcm9wcy5tYXAoIChwKS0+IHAuZGlzcGxheShjbWQpICkuZmlsdGVyKCAocCktPiBwPyApLmpvaW4oXCJcXG5cIilcbiAgcmVzdWx0V2l0aG91dENvbnRlbnQ6IC0+XG4gICAgaWYgIUBjbWQgb3IgQGVkaXRhYmxlXG4gICAgICBuYW1lID0gaWYgQGNtZCB0aGVuIEBjbWQuZnVsbE5hbWUgZWxzZSBAY21kTmFtZVxuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQoXG4gICAgICAgIFwiXCJcIlxuICAgICAgICB+fmJveCBjbWQ6XCIje0BpbnN0YW5jZS5jbWQuZnVsbE5hbWV9ICN7bmFtZX1cIn5+XG4gICAgICAgICN7QHByb3BzRGlzcGxheSgpfVxuICAgICAgICB+fiFzYXZlfn4gfn4hY2xvc2V+flxuICAgICAgICB+fi9ib3h+flxuICAgICAgICBcIlwiXCIpXG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBub1xuICAgICAgcmV0dXJuIGlmIEB2ZXJiYWxpemUgdGhlbiBwYXJzZXIuZ2V0VGV4dCgpIGVsc2UgcGFyc2VyLnBhcnNlQWxsKClcbkVkaXRDbWQuc2V0Q21kcyA9IChiYXNlKSAtPlxuICBpbkluc3RhbmNlID0gYmFzZS5pbl9pbnN0YW5jZSA9IHtjbWRzOnt9fVxuICBmb3IgcCBpbiBFZGl0Q21kLnByb3BzXG4gICAgcC5zZXRDbWQoaW5JbnN0YW5jZS5jbWRzKVxuICAgICMgcC5zZXRDbWQoYmFzZSlcbiAgcmV0dXJuIGJhc2VcbkVkaXRDbWQucHJvcHMgPSBbXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19jYXJyZXQnLCAgICAgICAgIHtvcHQ6J2NoZWNrQ2FycmV0J30pLFxuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fcGFyc2UnLCAgICAgICAgICB7b3B0OidwYXJzZSd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woICAgJ3ByZXZlbnRfcGFyc2VfYWxsJywge29wdDoncHJldmVudFBhcnNlQWxsJ30pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCggICAncmVwbGFjZV9ib3gnLCAgICAgICB7b3B0OidyZXBsYWNlQm94J30pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCAnbmFtZV90b19wYXJhbScsICAgICB7b3B0OiduYW1lVG9QYXJhbSd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZyggJ2FsaWFzX29mJywgICAgICAgICAge3ZhcjonYWxpYXNPZicsIGNhcnJldDp0cnVlfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoICdoZWxwJywgICAgICAgICAgICAgIHtmdW5jdDonaGVscCcsIHNob3dFbXB0eTp0cnVlfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoICdzb3VyY2UnLCAgICAgICAgICAgIHt2YXI6J3Jlc3VsdFN0cicsIGRhdGFOYW1lOidyZXN1bHQnLCBzaG93RW1wdHk6dHJ1ZSwgY2FycmV0OnRydWV9KSxcbl1cbmNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQG5hbWUgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzBdKVxuICByZXN1bHQ6IC0+XG4gICAgaWYgQG5hbWU/XG4gICAgICBAaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQuYWRkTmFtZVNwYWNlKEBuYW1lKVxuICAgICAgcmV0dXJuICcnXG4gICAgZWxzZVxuICAgICAgbmFtZXNwYWNlcyA9IEBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKVxuICAgICAgdHh0ID0gJ35+Ym94fn5cXG4nXG4gICAgICBmb3IgbnNwYyBpbiBuYW1lc3BhY2VzIFxuICAgICAgICBpZiBuc3BjICE9IEBpbnN0YW5jZS5jbWQuZnVsbE5hbWVcbiAgICAgICAgICB0eHQgKz0gbnNwYysnXFxuJ1xuICAgICAgdHh0ICs9ICd+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQodHh0KVxuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpXG5cblxuY2xhc3MgVGVtcGxhdGVDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBuYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gICAgQHNlcCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3NlcCddLFwiXFxuXCIpXG4gIHJlc3VsdDogLT5cbiAgICBkYXRhID0gaWYgQG5hbWUgdGhlbiBQYXRoSGVscGVyLmdldFBhdGgoQGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIEBuYW1lKSBlbHNlIEBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzXG4gICAgaWYgQGluc3RhbmNlLmNvbnRlbnQgYW5kIGRhdGE/IGFuZCBkYXRhICE9IGZhbHNlXG4gICAgICBpZiBBcnJheS5pc0FycmF5KGRhdGEpXG4gICAgICAgIGRhdGEubWFwIChpdGVtKT0+QHJlbmRlclRlbXBsYXRlKGl0ZW0pXG4gICAgICAgICAgLmpvaW4oQHNlcClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlbmRlclRlbXBsYXRlKGRhdGEpXG4gICAgZWxzZVxuICAgICAgJydcbiAgcmVuZGVyVGVtcGxhdGU6IChkYXRhKSAtPlxuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQoQGluc3RhbmNlLmNvbnRlbnQpXG4gICAgICBwYXJzZXIudmFycyA9IGlmIHR5cGVvZiBkYXRhID09IFwib2JqZWN0XCIgdGhlbiBkYXRhIGVsc2Uge3ZhbHVlOmRhdGF9XG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBub1xuICAgICAgcGFyc2VyLnBhcnNlQWxsKClcblxuXG5jbGFzcyBFbW1ldENtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGFiYnIgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2FiYnInLCdhYmJyZXZpYXRpb24nXSlcbiAgICBAbGFuZyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMSwnbGFuZycsJ2xhbmd1YWdlJ10pXG4gIHJlc3VsdDogLT5cbiAgICBlbW1ldCA9IGlmIHdpbmRvdz8uZW1tZXQ/XG4gICAgICB3aW5kb3cuZW1tZXRcbiAgICBlbHNlIGlmIHdpbmRvdz8uc2VsZj8uZW1tZXQ/XG4gICAgICB3aW5kb3cuc2VsZi5lbW1ldFxuICAgIGVsc2UgaWYgd2luZG93Py5nbG9iYWw/LmVtbWV0P1xuICAgICAgd2luZG93Lmdsb2JhbC5lbW1ldFxuICAgIGVsc2UgaWYgcmVxdWlyZT8gXG4gICAgICB0cnkgXG4gICAgICAgIHJlcXVpcmUoJ2VtbWV0JylcbiAgICAgIGNhdGNoIGV4XG4gICAgICAgIEBpbnN0YW5jZS5jb2Rld2F2ZS5sb2dnZXIubG9nKCdFbW1ldCBpcyBub3QgYXZhaWxhYmxlLCBpdCBtYXkgbmVlZCB0byBiZSBpbnN0YWxsZWQgbWFudWFsbHknKVxuICAgICAgICBudWxsXG4gICAgaWYgZW1tZXQ/XG4gICAgICAjIGVtbWV0LnJlcXVpcmUoJy4vcGFyc2VyL2FiYnJldmlhdGlvbicpLmV4cGFuZCgndWw+bGknLCB7cGFzdGVkQ29udGVudDonbG9yZW0nfSlcbiAgICAgIHJlcyA9IGVtbWV0LmV4cGFuZEFiYnJldmlhdGlvbihAYWJiciwgQGxhbmcpXG4gICAgICByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpXG5cblxuXG4iLCJ2YXIgQm94Q21kLCBDbG9zZUNtZCwgRWRpdENtZCwgRW1tZXRDbWQsIE5hbWVTcGFjZUNtZCwgVGVtcGxhdGVDbWQsIGFsaWFzQ29tbWFuZCwgZXhlY19wYXJlbnQsIGdldENvbW1hbmQsIGdldENvbnRlbnQsIGdldFBhcmFtLCBoZWxwLCBsaXN0Q29tbWFuZCwgbm9fZXhlY3V0ZSwgcXVvdGVfY2FycmV0LCByZW1vdmVDb21tYW5kLCByZW5hbWVDb21tYW5kLCBzZXRDb21tYW5kLCBzdG9yZUpzb25Db21tYW5kO1xuXG5pbXBvcnQge1xuICBDb21tYW5kLFxuICBCYXNlQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgTGFuZ0RldGVjdG9yXG59IGZyb20gJy4uL2RldGVjdG9ycy9MYW5nRGV0ZWN0b3InO1xuXG5pbXBvcnQge1xuICBBbHdheXNFbmFibGVkXG59IGZyb20gJy4uL2RldGVjdG9ycy9BbHdheXNFbmFibGVkJztcblxuaW1wb3J0IHtcbiAgQm94SGVscGVyXG59IGZyb20gJy4uL0JveEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIEVkaXRDbWRQcm9wXG59IGZyb20gJy4uL0VkaXRDbWRQcm9wJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgUGF0aEhlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1BhdGhIZWxwZXInO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCB2YXIgQ29yZUNvbW1hbmRQcm92aWRlciA9IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNvcmU7XG4gICAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjb3JlJykpO1xuICAgIGNtZHMuYWRkRGV0ZWN0b3IobmV3IEFsd2F5c0VuYWJsZWQoJ2NvcmUnKSk7XG4gICAgY29yZS5hZGREZXRlY3RvcihuZXcgTGFuZ0RldGVjdG9yKCkpO1xuICAgIHJldHVybiBjb3JlLmFkZENtZHMoe1xuICAgICAgJ2hlbHAnOiB7XG4gICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgJ3Jlc3VsdCc6IGhlbHAsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2NtZCddLFxuICAgICAgICAnaGVscCc6IFwiVG8gZ2V0IGhlbHAgb24gYSBwZWNpZmljIGNvbW1hbmQsIGRvIDpcXG5+fmhlbHAgaGVsbG9+fiAoaGVsbG8gYmVpbmcgdGhlIGNvbW1hbmQpXCIsXG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdvdmVydmlldyc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuICBfX18gICAgICAgICBfICAgX18gICAgICBfX1xcbiAvIF9ffF9fXyAgX198IHxfX1xcXFwgXFxcXCAgICAvIC9fIF9fXyBfX19fX19cXG4vIC9fXy8gXyBcXFxcLyBfYCAvIC1fXFxcXCBcXFxcL1xcXFwvIC8gX2AgXFxcXCBWIC8gLV8vXFxuXFxcXF9fX19cXFxcX19fL1xcXFxfXyxfXFxcXF9fX3xcXFxcXy9cXFxcXy9cXFxcX18sX3xcXFxcXy9cXFxcX19ffFxcblRoZSB0ZXh0IGVkaXRvciBoZWxwZXJcXG5+fi9xdW90ZV9jYXJyZXR+flxcblxcbldoZW4gdXNpbmcgQ29kZXdhdmUgeW91IHdpbGwgYmUgd3JpdGluZyBjb21tYW5kcyB3aXRoaW4gXFxueW91ciB0ZXh0IGVkaXRvci4gVGhlc2UgY29tbWFuZHMgbXVzdCBiZSBwbGFjZWQgYmV0d2VlbiB0d28gXFxucGFpcnMgb2YgXFxcIn5cXFwiICh0aWxkZSkgYW5kIHRoZW4sIHRoZXkgY2FuIGJlIGV4ZWN1dGVkIGJ5IHByZXNzaW5nIFxcblxcXCJjdHJsXFxcIitcXFwic2hpZnRcXFwiK1xcXCJlXFxcIiwgd2l0aCB5b3VyIGN1cnNvciBpbnNpZGUgdGhlIGNvbW1hbmRcXG5FeDogfn4haGVsbG9+flxcblxcbllvdSBkb250IG5lZWQgdG8gYWN0dWFsbHkgdHlwZSBhbnkgXFxcIn5cXFwiICh0aWxkZSkuIFxcblByZXNzaW5nIFxcXCJjdHJsXFxcIitcXFwic2hpZnRcXFwiK1xcXCJlXFxcIiB3aWxsIGFkZCB0aGVtIGlmIHlvdSBhcmUgbm90IGFscmVhZHlcXG53aXRoaW4gYSBjb21tYW5kLlxcblxcbkNvZGV3YXZlIGRvZXMgbm90IHVzZSBVSSB0byBkaXNwbGF5IGFueSBpbmZvcm1hdGlvbi4gXFxuSW5zdGVhZCwgaXQgdXNlcyB0ZXh0IHdpdGhpbiBjb2RlIGNvbW1lbnRzIHRvIG1pbWljIFVJcy4gXFxuVGhlIGdlbmVyYXRlZCBjb21tZW50IGJsb2NrcyB3aWxsIGJlIHJlZmVycmVkIHRvIGFzIHdpbmRvd3MgXFxuaW4gdGhlIGhlbHAgc2VjdGlvbnMuXFxuXFxuVG8gY2xvc2UgdGhpcyB3aW5kb3cgKGkuZS4gcmVtb3ZlIHRoaXMgY29tbWVudCBibG9jayksIHByZXNzIFxcblxcXCJjdHJsXFxcIitcXFwic2hpZnRcXFwiK1xcXCJlXFxcIiB3aXRoIHlvdXIgY3Vyc29yIG9uIHRoZSBsaW5lIGJlbGxvdy5cXG5+fiFjbG9zZXx+flxcblxcblVzZSB0aGUgZm9sbG93aW5nIGNvbW1hbmQgZm9yIGEgd2Fsa3Rocm91Z2ggb2Ygc29tZSBvZiB0aGUgbWFueVxcbmZlYXR1cmVzIG9mIENvZGV3YXZlXFxufn4haGVscDpnZXRfc3RhcnRlZH5+IG9yIH5+IWhlbHA6ZGVtb35+XFxuXFxuTGlzdCBvZiBhbGwgaGVscCBzdWJqZWN0cyBcXG5+fiFoZWxwOnN1YmplY3Rzfn4gb3Igfn4haGVscDpzdWJ+fiBcXG5cXG5+fiFjbG9zZX5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3N1YmplY3RzJzoge1xuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+IWhlbHB+flxcbn5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiAofn4haGVscDpkZW1vfn4pXFxufn4haGVscDpzdWJqZWN0c35+ICh+fiFoZWxwOnN1Yn5+KVxcbn5+IWhlbHA6ZWRpdGluZ35+ICh+fiFoZWxwOmVkaXR+filcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdzdWInOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmhlbHA6c3ViamVjdHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZ2V0X3N0YXJ0ZWQnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxuVGhlIGNsYXNzaWMgSGVsbG8gV29ybGQuXFxufn4haGVsbG98fn5cXG5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxufn5xdW90ZV9jYXJyZXR+flxcblxcbkZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGNyZWF0aW5nIHlvdXIgb3duIGNvbW1hbmRzLCBzZWU6XFxufn4haGVscDplZGl0aW5nfn5cXG5cXG5Db2Rld2F2ZSBjb21lcyB3aXRoIG1hbnkgcHJlLWV4aXN0aW5nIGNvbW1hbmRzLiBIZXJlIGlzIGFuIGV4YW1wbGVcXG5vZiBKYXZhU2NyaXB0IGFiYnJldmlhdGlvbnNcXG5+fiFqczpmfn5cXG5+fiFqczppZn5+XFxuICB+fiFqczpsb2d+flxcXCJ+fiFoZWxsb35+XFxcIn5+IS9qczpsb2d+flxcbn5+IS9qczppZn5+XFxufn4hL2pzOmZ+flxcblxcbkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxcbnVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cXG5+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXFxufn4hZW1tZXQgdWw+bGl+flxcbn5+IWVtbWV0IG0yIGNzc35+XFxuXFxuQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxcbmRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxcbn5+IWpzOmVhY2h+flxcbn5+IXBocDpvdXRlcjplYWNofn5cXG5+fiFwaHA6aW5uZXI6ZWFjaH5+XFxuXFxuU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXFxuZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcXG5hY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxcbmNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cXG5+fiFuYW1lc3BhY2V+flxcbn5+IWNvcmU6bmFtZXNwYWNlfn5cXG5cXG5Zb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxcbn5+IW5hbWVzcGFjZSBwaHB+flxcblxcbkNoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXFxufn4hbmFtZXNwYWNlfn5cXG5cXG5JbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXFxuY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcXG53aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxcblxcbn5+L3F1b3RlX2NhcnJldH5+XFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZGVtbyc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6aGVscDpnZXRfc3RhcnRlZCdcbiAgICAgICAgICB9LFxuICAgICAgICAgICdlZGl0aW5nJzoge1xuICAgICAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgICAgICdpbnRybyc6IHtcbiAgICAgICAgICAgICAgICAncmVzdWx0JzogXCJDb2Rld2F2ZSBhbGxvd3MgeW91IHRvIG1ha2UgeW91ciBvd24gY29tbWFuZHMgKG9yIGFiYnJldmlhdGlvbnMpIFxcbnB1dCB5b3VyIGNvbnRlbnQgaW5zaWRlIFxcXCJzb3VyY2VcXFwiIHRoZSBkbyBcXFwic2F2ZVxcXCIuIFRyeSBhZGRpbmcgYW55IFxcbnRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXFxufn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxcblxcbklmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XFxuZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxcbndoZW5ldmVyIHlvdSB3YW50Llxcbn5+IW15X25ld19jb21tYW5kfn5cIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5cXG5BbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcXFwiYm94XFxcIi4gXFxuVGhleSBhcmUgbWVhbnQgdG8gZGlzcGxheSB0ZXh0IHRoYXQgc2hvdWxkIG5vdCByZW1haW4gaW4geW91ciBjb2RlLiBcXG5UaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXFxuXFxcImNsb3NlXFxcIiBjYW4gYmUgdXNlZCB0byByZW1vdmUgdGhlbSByYXBpZGx5LiBZb3UgY2FuIG1ha2UgeW91ciBvd24gXFxuY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5Llxcbn5+IWJveH5+XFxuVGhlIGJveCB3aWxsIHNjYWxlIHdpdGggdGhlIGNvbnRlbnQgeW91IHB1dCBpbiBpdFxcbn5+IWNsb3NlfH5+XFxufn4hL2JveH5+XFxuXFxufn5xdW90ZV9jYXJyZXR+flxcbldoZW4geW91IGNyZWF0ZSBhIGNvbW1hbmQsIHlvdSBtYXkgd2FudCB0byBzcGVjaWZ5IHdoZXJlIHRoZSBjdXJzb3IgXFxud2lsbCBiZSBsb2NhdGVkIG9uY2UgdGhlIGNvbW1hbmQgaXMgZXhwYW5kZWQuIFRvIGRvIHRoYXQsIHVzZSBhIFxcXCJ8XFxcIiBcXG4oVmVydGljYWwgYmFyKS4gVXNlIDIgb2YgdGhlbSBpZiB5b3Ugd2FudCB0byBwcmludCB0aGUgYWN0dWFsIFxcbmNoYXJhY3Rlci5cXG5+fiFib3h+flxcbm9uZSA6IHwgXFxudHdvIDogfHxcXG5+fiEvYm94fn5cXG5cXG5Zb3UgY2FuIGFsc28gdXNlIHRoZSBcXFwiZXNjYXBlX3BpcGVzXFxcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxcbnZlcnRpY2FsIGJhcnMgdGhhdCBhcmUgYmV0d2VlbiBpdHMgb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzXFxufn4hZXNjYXBlX3BpcGVzfn5cXG58XFxufn4hL2VzY2FwZV9waXBlc35+XFxuXFxuQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cXG5JZiB5b3Ugd2FudCB0byBwcmludCBhIGNvbW1hbmQgd2l0aG91dCBoYXZpbmcgaXQgZXhwYW5kIHdoZW4gXFxudGhlIHBhcmVudCBjb21tYW5kIGlzIGV4cGFuZGVkLCB1c2UgYSBcXFwiIVxcXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxcbn5+ISFoZWxsb35+XFxuXFxuRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXFxudGhlIFxcXCJjb250ZW50XFxcIiBjb21tYW5kLiBcXFwiY29udGVudFxcXCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XFxudGhhdCBpcyBiZXR3ZWVuIHRoZSB0YWdzLiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgaG93IGl0IGNhbiBiZSB1c2VkLlxcbn5+IWVkaXQgcGhwOmlubmVyOmlmfn5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2VkaXQnOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmhlbHA6ZWRpdGluZydcbiAgICAgICAgICB9LFxuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ25vX2V4ZWN1dGUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBub19leGVjdXRlLFxuICAgICAgICAnaGVscCc6IFwiUHJldmVudCBldmVyeXRoaW5nIGluc2lkZSB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIGZyb20gZXhlY3V0aW5nXCJcbiAgICAgIH0sXG4gICAgICAnZXNjYXBlX3BpcGVzJzoge1xuICAgICAgICAncmVzdWx0JzogcXVvdGVfY2FycmV0LFxuICAgICAgICAnY2hlY2tDYXJyZXQnOiBmYWxzZSxcbiAgICAgICAgJ2hlbHAnOiBcIkVzY2FwZSBhbGwgY2FycmV0cyAoZnJvbSBcXFwifFxcXCIgdG8gXFxcInx8XFxcIilcIlxuICAgICAgfSxcbiAgICAgICdxdW90ZV9jYXJyZXQnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXNjYXBlX3BpcGVzJ1xuICAgICAgfSxcbiAgICAgICdleGVjX3BhcmVudCc6IHtcbiAgICAgICAgJ2V4ZWN1dGUnOiBleGVjX3BhcmVudCxcbiAgICAgICAgJ2hlbHAnOiBcIkV4ZWN1dGUgdGhlIGZpcnN0IGNvbW1hbmQgdGhhdCB3cmFwIHRoaXMgaW4gaXQncyBvcGVuIGFuZCBjbG9zZSB0YWdcIlxuICAgICAgfSxcbiAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAncmVzdWx0JzogZ2V0Q29udGVudCxcbiAgICAgICAgJ2hlbHAnOiBcIk1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gd2hhdCB3YXMgYmV0d2VlbiB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIG9mIGEgY29tbWFuZFwiXG4gICAgICB9LFxuICAgICAgJ2JveCc6IHtcbiAgICAgICAgJ2Nscyc6IEJveENtZCxcbiAgICAgICAgJ2hlbHAnOiBcIkNyZWF0ZSB0aGUgYXBwYXJlbmNlIG9mIGEgYm94IGNvbXBvc2VkIGZyb20gY2hhcmFjdGVycy4gXFxuVXN1YWxseSB3cmFwcGVkIGluIGEgY29tbWVudC5cXG5cXG5UaGUgYm94IHdpbGwgdHJ5IHRvIGFqdXN0IGl0J3Mgc2l6ZSBmcm9tIHRoZSBjb250ZW50XCJcbiAgICAgIH0sXG4gICAgICAnY2xvc2UnOiB7XG4gICAgICAgICdjbHMnOiBDbG9zZUNtZCxcbiAgICAgICAgJ2hlbHAnOiBcIldpbGwgY2xvc2UgdGhlIGZpcnN0IGJveCBhcm91bmQgdGhpc1wiXG4gICAgICB9LFxuICAgICAgJ3BhcmFtJzoge1xuICAgICAgICAncmVzdWx0JzogZ2V0UGFyYW0sXG4gICAgICAgICdoZWxwJzogXCJNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIGEgcGFyYW1ldGVyIGZyb20gdGhpcyBjb21tYW5kIGNhbGxcXG5cXG5Zb3UgY2FuIHBhc3MgYSBudW1iZXIsIGEgc3RyaW5nLCBvciBib3RoLiBcXG5BIG51bWJlciBmb3IgYSBwb3NpdGlvbmVkIGFyZ3VtZW50IGFuZCBhIHN0cmluZ1xcbmZvciBhIG5hbWVkIHBhcmFtZXRlclwiXG4gICAgICB9LFxuICAgICAgJ2VkaXQnOiB7XG4gICAgICAgICdjbWRzJzogRWRpdENtZC5zZXRDbWRzKHtcbiAgICAgICAgICAnc2F2ZSc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXhlY19wYXJlbnQnXG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgJ2Nscyc6IEVkaXRDbWQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2NtZCddLFxuICAgICAgICAnaGVscCc6IFwiQWxsb3dzIHRvIGVkaXQgYSBjb21tYW5kLiBcXG5TZWUgfn4haGVscDplZGl0aW5nfn4gZm9yIGEgcXVpY2sgdHV0b3JpYWxcIlxuICAgICAgfSxcbiAgICAgICdyZW5hbWUnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfYXBwbGljYWJsZSc6IFwifn5ib3h+flxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCIsXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiByZW5hbWVDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydmcm9tJywgJ3RvJ10sXG4gICAgICAgICdoZWxwJzogXCJBbGxvd3MgdG8gcmVuYW1lIGEgY29tbWFuZCBhbmQgY2hhbmdlIGl0J3MgbmFtZXNwYWNlLiBcXG5Zb3UgY2FuIG9ubHkgcmVuYW1lIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxuLSBUaGUgZmlyc3QgcGFyYW0gaXMgdGhlIG9sZCBuYW1lXFxuLSBUaGVuIHNlY29uZCBwYXJhbSBpcyB0aGUgbmV3IG5hbWUsIGlmIGl0IGhhcyBubyBuYW1lc3BhY2UsXFxuICBpdCB3aWxsIHVzZSB0aGUgb25lIGZyb20gdGhlIG9yaWdpbmFsIGNvbW1hbmQuXFxuXFxuZXguOiB+fiFyZW5hbWUgbXlfY29tbWFuZCBteV9jb21tYW5kMn5+XCJcbiAgICAgIH0sXG4gICAgICAncmVtb3ZlJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnbm90X2FwcGxpY2FibGUnOiBcIn5+Ym94fn5cXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiLFxuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogcmVtb3ZlQ29tbWFuZCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJBbGxvd3MgdG8gcmVtb3ZlIGEgY29tbWFuZC4gXFxuWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlwiXG4gICAgICB9LFxuICAgICAgJ2FsaWFzJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IGFsaWFzQ29tbWFuZCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZVxuICAgICAgfSxcbiAgICAgICduYW1lc3BhY2UnOiB7XG4gICAgICAgICdjbHMnOiBOYW1lU3BhY2VDbWQsXG4gICAgICAgICdoZWxwJzogXCJTaG93IHRoZSBjdXJyZW50IG5hbWVzcGFjZXMuXFxuXFxuQSBuYW1lIHNwYWNlIGNvdWxkIGJlIHRoZSBuYW1lIG9mIHRoZSBsYW5ndWFnZVxcbm9yIG90aGVyIGtpbmQgb2YgY29udGV4dHNcXG5cXG5JZiB5b3UgcGFzcyBhIHBhcmFtIHRvIHRoaXMgY29tbWFuZCwgaXQgd2lsbCBcXG5hZGQgdGhlIHBhcmFtIGFzIGEgbmFtZXNwYWNlIGZvciB0aGUgY3VycmVudCBlZGl0b3JcIlxuICAgICAgfSxcbiAgICAgICduc3BjJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOm5hbWVzcGFjZSdcbiAgICAgIH0sXG4gICAgICAnbGlzdCc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGxpc3RDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ2JveCcsICdjb250ZXh0J10sXG4gICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2hlbHAnOiBcIkxpc3QgYXZhaWxhYmxlIGNvbW1hbmRzXFxuXFxuWW91IGNhbiB1c2UgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGNob29zZSBhIHNwZWNpZmljIG5hbWVzcGFjZSwgXFxuYnkgZGVmYXVsdCBhbGwgY3VyZW50IG5hbWVzcGFjZSB3aWxsIGJlIHNob3duXCJcbiAgICAgIH0sXG4gICAgICAnbHMnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6bGlzdCdcbiAgICAgIH0sXG4gICAgICAnZ2V0Jzoge1xuICAgICAgICAncmVzdWx0JzogZ2V0Q29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZSddLFxuICAgICAgICAnaGVscCc6IFwib3V0cHV0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXCJcbiAgICAgIH0sXG4gICAgICAnc2V0Jzoge1xuICAgICAgICAncmVzdWx0Jzogc2V0Q29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZScsICd2YWx1ZScsICd2YWwnXSxcbiAgICAgICAgJ2hlbHAnOiBcInNldCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZVwiXG4gICAgICB9LFxuICAgICAgJ3N0b3JlX2pzb24nOiB7XG4gICAgICAgICdyZXN1bHQnOiBzdG9yZUpzb25Db21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ2pzb24nXSxcbiAgICAgICAgJ2hlbHAnOiBcInNldCBhIHZhcmlhYmxlIHdpdGggc29tZSBqc29uIGRhdGFcIlxuICAgICAgfSxcbiAgICAgICdqc29uJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOnN0b3JlX2pzb24nXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlJzoge1xuICAgICAgICAnY2xzJzogVGVtcGxhdGVDbWQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnc2VwJ10sXG4gICAgICAgICdoZWxwJzogXCJyZW5kZXIgYSB0ZW1wbGF0ZSBmb3IgYSB2YXJpYWJsZVxcblxcbklmIHRoZSBmaXJzdCBwYXJhbSBpcyBub3Qgc2V0IGl0IHdpbGwgdXNlIGFsbCB2YXJpYWJsZXMgXFxuZm9yIHRoZSByZW5kZXJcXG5JZiB0aGUgdmFyaWFibGUgaXMgYW4gYXJyYXkgdGhlIHRlbXBsYXRlIHdpbGwgYmUgcmVwZWF0ZWQgXFxuZm9yIGVhY2ggaXRlbXNcXG5UaGUgYHNlcGAgcGFyYW0gZGVmaW5lIHdoYXQgd2lsbCBzZXBhcmF0ZSBlYWNoIGl0ZW0gXFxuYW5kIGRlZmF1bHQgdG8gYSBsaW5lIGJyZWFrXCJcbiAgICAgIH0sXG4gICAgICAnZW1tZXQnOiB7XG4gICAgICAgICdjbHMnOiBFbW1ldENtZCxcbiAgICAgICAgJ2hlbHAnOiBcIkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy5cXG5cXG5QYXNzIHRoZSBFbW1ldCBhYmJyZXZpYXRpb24gYXMgYSBwYXJhbSB0byBleHBlbmQgaXQuXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuXG5oZWxwID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGNtZCwgY21kTmFtZSwgaGVscENtZCwgc3ViY29tbWFuZHMsIHRleHQ7XG4gIGNtZE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKTtcbiAgaWYgKGNtZE5hbWUgIT0gbnVsbCkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKGNtZE5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaGVscENtZCA9IGNtZC5nZXRDbWQoJ2hlbHAnKTtcbiAgICAgIHRleHQgPSBoZWxwQ21kID8gYH5+JHtoZWxwQ21kLmZ1bGxOYW1lfX5+YCA6IFwiVGhpcyBjb21tYW5kIGhhcyBubyBoZWxwIHRleHRcIjtcbiAgICAgIHN1YmNvbW1hbmRzID0gY21kLmNtZHMubGVuZ3RoID8gYFxcblN1Yi1Db21tYW5kcyA6XFxufn5scyAke2NtZC5mdWxsTmFtZX0gYm94Om5vIGNvbnRleHQ6bm9+fmAgOiBcIlwiO1xuICAgICAgcmV0dXJuIGB+fmJveH5+XFxuSGVscCBmb3Igfn4hJHtjbWQuZnVsbE5hbWV9fn4gOlxcblxcbiR7dGV4dH1cXG4ke3N1YmNvbW1hbmRzfVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiAnfn5oZWxwOm92ZXJ2aWV3fn4nO1xuICB9XG59O1xuXG5ub19leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIHJlZztcbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSk7XG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsICckMScpO1xufTtcblxucXVvdGVfY2FycmV0ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgcmV0dXJuIGluc3RhbmNlLmNvbnRlbnQucmVwbGFjZSgvXFx8L2csICd8fCcpO1xufTtcblxuZXhlY19wYXJlbnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgcmVzO1xuICBpZiAoaW5zdGFuY2UucGFyZW50ICE9IG51bGwpIHtcbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpO1xuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnQ7XG4gICAgaW5zdGFuY2UucmVwbGFjZUVuZCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlRW5kO1xuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbmdldENvbnRlbnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgYWZmaXhlc19lbXB0eSwgcHJlZml4LCBzdWZmaXg7XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSwgZmFsc2UpO1xuICBwcmVmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gIHN1ZmZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBwcmVmaXggKyAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5jb250ZW50IHx8ICcnKSArIHN1ZmZpeDtcbiAgfVxuICBpZiAoYWZmaXhlc19lbXB0eSkge1xuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXg7XG4gIH1cbn07XG5cbnJlbmFtZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIHN0b3JhZ2U7XG4gICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICByZXR1cm4gc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gIH0pLnRoZW4oKHNhdmVkQ21kcykgPT4ge1xuICAgIHZhciBjbWQsIGNtZERhdGEsIG5ld05hbWUsIG9yaWduaW5hbE5hbWU7XG4gICAgb3JpZ25pbmFsTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZnJvbSddKTtcbiAgICBuZXdOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd0byddKTtcbiAgICBpZiAoKG9yaWduaW5hbE5hbWUgIT0gbnVsbCkgJiYgKG5ld05hbWUgIT0gbnVsbCkpIHtcbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG9yaWduaW5hbE5hbWUpO1xuICAgICAgaWYgKChzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0gIT0gbnVsbCkgJiYgKGNtZCAhPSBudWxsKSkge1xuICAgICAgICBpZiAoIShuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xKSkge1xuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCAnJykgKyBuZXdOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV07XG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsIGNtZERhdGEpO1xuICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhO1xuICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbnJlbW92ZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIG5hbWU7XG4gICAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcywgc3RvcmFnZTtcbiAgICAgICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbigoc2F2ZWRDbWRzKSA9PiB7XG4gICAgICAgIHZhciBjbWQsIGNtZERhdGE7XG4gICAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG5hbWUpO1xuICAgICAgICBpZiAoKHNhdmVkQ21kc1tuYW1lXSAhPSBudWxsKSAmJiAoY21kICE9IG51bGwpKSB7XG4gICAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tuYW1lXTtcbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV07XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFsaWFzQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnYWxpYXMnXSk7XG4gIGlmICgobmFtZSAhPSBudWxsKSAmJiAoYWxpYXMgIT0gbnVsbCkpIHtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgfHwgY21kO1xuICAgICAgLy8gdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAvLyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChhbGlhcywge1xuICAgICAgICBhbGlhc09mOiBjbWQuZnVsbE5hbWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH1cbn07XG5cbmxpc3RDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGJveCwgY29tbWFuZHMsIGNvbnRleHQsIG5hbWUsIG5hbWVzcGFjZXMsIHRleHQsIHVzZUNvbnRleHQ7XG4gIGJveCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2JveCddLCB0cnVlKTtcbiAgdXNlQ29udGV4dCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2NvbnRleHQnXSwgdHJ1ZSk7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIG5hbWVzcGFjZXMgPSBuYW1lID8gW25hbWVdIDogaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCkuZmlsdGVyKChuc3BjKSA9PiB7XG4gICAgcmV0dXJuIG5zcGMgIT09IGluc3RhbmNlLmNtZC5mdWxsTmFtZTtcbiAgfSkuY29uY2F0KFwiX3Jvb3RcIik7XG4gIGNvbnRleHQgPSB1c2VDb250ZXh0ID8gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKSA6IGluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0O1xuICBjb21tYW5kcyA9IG5hbWVzcGFjZXMucmVkdWNlKChjb21tYW5kcywgbnNwYykgPT4ge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gbnNwYyA9PT0gXCJfcm9vdFwiID8gQ29tbWFuZC5jbWRzIDogY29udGV4dC5nZXRDbWQobnNwYywge1xuICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlXG4gICAgfSk7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5jbWRzKSB7XG4gICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGNtZC5jbWRzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbW1hbmRzO1xuICB9LCBbXSk7XG4gIHRleHQgPSBjb21tYW5kcy5sZW5ndGggPyBjb21tYW5kcy5tYXAoKGNtZCkgPT4ge1xuICAgIGNtZC5pbml0KCk7XG4gICAgcmV0dXJuIChjbWQuaXNFeGVjdXRhYmxlKCkgPyAnfn4hJyA6ICd+fiFscyAnKSArIGNtZC5mdWxsTmFtZSArICd+fic7XG4gIH0pLmpvaW4oXCJcXG5cIikgOiBcIlRoaXMgY29udGFpbnMgbm8gc3ViLWNvbW1hbmRzXCI7XG4gIGlmIChib3gpIHtcbiAgICByZXR1cm4gYH5+Ym94fn5cXG4ke3RleHR9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbn07XG5cbmdldENvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgbmFtZSwgcmVzO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICByZXMgPSBQYXRoSGVscGVyLmdldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSk7XG4gIGlmICh0eXBlb2YgcmVzID09PSBcIm9iamVjdFwiKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlcywgbnVsbCwgJyAgJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufTtcblxuc2V0Q29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWw7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd2YWx1ZScsICd2YWwnXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lLCB2YWwpO1xuICByZXR1cm4gJyc7XG59O1xuXG5zdG9yZUpzb25Db21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHAsIHZhbDtcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2pzb24nXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lLCBKU09OLnBhcnNlKHZhbCkpO1xuICByZXR1cm4gJyc7XG59O1xuXG5nZXRQYXJhbSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGlmIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5nZXRQYXJhbShpbnN0YW5jZS5wYXJhbXMsIGluc3RhbmNlLmdldFBhcmFtKFsnZGVmJywgJ2RlZmF1bHQnXSkpO1xuICB9XG59O1xuXG5Cb3hDbWQgPSBjbGFzcyBCb3hDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5oZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuaW5zdGFuY2UuY29udGV4dCk7XG4gICAgdGhpcy5jbWQgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmhlbHBlci5vcGVuVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY21kICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgdGhpcy5oZWxwZXIuY2xvc2VUZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZC5zcGxpdChcIiBcIilbMF0gKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgfVxuICAgIHRoaXMuaGVscGVyLmRlY28gPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmRlY287XG4gICAgdGhpcy5oZWxwZXIucGFkID0gMjtcbiAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuc3VmZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG4gIH1cblxuICBoZWlnaHQoKSB7XG4gICAgdmFyIGhlaWdodCwgcGFyYW1zO1xuICAgIGlmICh0aGlzLmJvdW5kcygpICE9IG51bGwpIHtcbiAgICAgIGhlaWdodCA9IHRoaXMuYm91bmRzKCkuaGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWlnaHQgPSAzO1xuICAgIH1cbiAgICBwYXJhbXMgPSBbJ2hlaWdodCddO1xuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgxKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIGhlaWdodCk7XG4gIH1cblxuICB3aWR0aCgpIHtcbiAgICB2YXIgcGFyYW1zLCB3aWR0aDtcbiAgICBpZiAodGhpcy5ib3VuZHMoKSAhPSBudWxsKSB7XG4gICAgICB3aWR0aCA9IHRoaXMuYm91bmRzKCkud2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpZHRoID0gMztcbiAgICB9XG4gICAgcGFyYW1zID0gWyd3aWR0aCddO1xuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgwKTtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgubWF4KHRoaXMubWluV2lkdGgoKSwgdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSk7XG4gIH1cblxuICBib3VuZHMoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgaWYgKHRoaXMuX2JvdW5kcyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2JvdW5kcyA9IHRoaXMuaGVscGVyLnRleHRCb3VuZHModGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9ib3VuZHM7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHRoaXMuaGVscGVyLmhlaWdodCA9IHRoaXMuaGVpZ2h0KCk7XG4gICAgdGhpcy5oZWxwZXIud2lkdGggPSB0aGlzLndpZHRoKCk7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVyLmRyYXcodGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgfVxuXG4gIG1pbldpZHRoKCkge1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbWQubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxufTtcblxuQ2xvc2VDbWQgPSBjbGFzcyBDbG9zZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuaW5zdGFuY2UuY29udGV4dCk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHZhciBib3gsIGJveDIsIGRlcHRoLCBwcmVmaXgsIHJlcXVpcmVkX2FmZml4ZXMsIHN1ZmZpeDtcbiAgICBwcmVmaXggPSB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgICBzdWZmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgICBib3ggPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSk7XG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydyZXF1aXJlZF9hZmZpeGVzJ10sIHRydWUpO1xuICAgIGlmICghcmVxdWlyZWRfYWZmaXhlcykge1xuICAgICAgdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5oZWxwZXIuc3VmZml4ID0gJyc7XG4gICAgICBib3gyID0gdGhpcy5oZWxwZXIuZ2V0Qm94Rm9yUG9zKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkpO1xuICAgICAgaWYgKChib3gyICE9IG51bGwpICYmICgoYm94ID09IG51bGwpIHx8IGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIHx8IGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpKSB7XG4gICAgICAgIGJveCA9IGJveDI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChib3ggIT0gbnVsbCkge1xuICAgICAgZGVwdGggPSB0aGlzLmhlbHBlci5nZXROZXN0ZWRMdmwodGhpcy5pbnN0YW5jZS5nZXRQb3MoKS5zdGFydCk7XG4gICAgICBpZiAoZGVwdGggPCAyKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UuaW5Cb3ggPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LCBib3guZW5kLCAnJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5yZXBsYWNlV2l0aCgnJyk7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWQgPSBjbGFzcyBFZGl0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHZhciByZWY7XG4gICAgdGhpcy5jbWROYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKTtcbiAgICB0aGlzLnZlcmJhbGl6ZSA9IChyZWYgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxXSkpID09PSAndicgfHwgcmVmID09PSAndmVyYmFsaXplJztcbiAgICBpZiAodGhpcy5jbWROYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpO1xuICAgICAgdGhpcy5maW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2U7XG4gICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZWRpdGFibGUgPSB0aGlzLmNtZCAhPSBudWxsID8gdGhpcy5jbWQuaXNFZGl0YWJsZSgpIDogdHJ1ZTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRoQ29udGVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRob3V0Q29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdFdpdGhDb250ZW50KCkge1xuICAgIHZhciBkYXRhLCBpLCBsZW4sIHAsIHBhcnNlciwgcmVmO1xuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgIHBhcnNlci5wYXJzZUFsbCgpO1xuICAgIGRhdGEgPSB7fTtcbiAgICByZWYgPSBFZGl0Q21kLnByb3BzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgcCA9IHJlZltpXTtcbiAgICAgIHAud3JpdGVGb3IocGFyc2VyLCBkYXRhKTtcbiAgICB9XG4gICAgQ29tbWFuZC5zYXZlQ21kKHRoaXMuY21kTmFtZSwgZGF0YSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcHJvcHNEaXNwbGF5KCkge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gdGhpcy5jbWQ7XG4gICAgcmV0dXJuIEVkaXRDbWQucHJvcHMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBwLmRpc3BsYXkoY21kKTtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHAgIT0gbnVsbDtcbiAgICB9KS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmVzdWx0V2l0aG91dENvbnRlbnQoKSB7XG4gICAgdmFyIG5hbWUsIHBhcnNlcjtcbiAgICBpZiAoIXRoaXMuY21kIHx8IHRoaXMuZWRpdGFibGUpIHtcbiAgICAgIG5hbWUgPSB0aGlzLmNtZCA/IHRoaXMuY21kLmZ1bGxOYW1lIDogdGhpcy5jbWROYW1lO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KGB+fmJveCBjbWQ6XCIke3RoaXMuaW5zdGFuY2UuY21kLmZ1bGxOYW1lfSAke25hbWV9XCJ+flxcbiR7dGhpcy5wcm9wc0Rpc3BsYXkoKX1cXG5+fiFzYXZlfn4gfn4hY2xvc2V+flxcbn5+L2JveH5+YCk7XG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLnZlcmJhbGl6ZSkge1xuICAgICAgICByZXR1cm4gcGFyc2VyLmdldFRleHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZC5zZXRDbWRzID0gZnVuY3Rpb24oYmFzZSkge1xuICB2YXIgaSwgaW5JbnN0YW5jZSwgbGVuLCBwLCByZWY7XG4gIGluSW5zdGFuY2UgPSBiYXNlLmluX2luc3RhbmNlID0ge1xuICAgIGNtZHM6IHt9XG4gIH07XG4gIHJlZiA9IEVkaXRDbWQucHJvcHM7XG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHAgPSByZWZbaV07XG4gICAgcC5zZXRDbWQoaW5JbnN0YW5jZS5jbWRzKTtcbiAgfVxuICAvLyBwLnNldENtZChiYXNlKVxuICByZXR1cm4gYmFzZTtcbn07XG5cbkVkaXRDbWQucHJvcHMgPSBbXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19jYXJyZXQnLFxuICB7XG4gICAgb3B0OiAnY2hlY2tDYXJyZXQnXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fcGFyc2UnLFxuICB7XG4gICAgb3B0OiAncGFyc2UnXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCgncHJldmVudF9wYXJzZV9hbGwnLFxuICB7XG4gICAgb3B0OiAncHJldmVudFBhcnNlQWxsJ1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3JlcGxhY2VfYm94JyxcbiAge1xuICAgIG9wdDogJ3JlcGxhY2VCb3gnXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCduYW1lX3RvX3BhcmFtJyxcbiAge1xuICAgIG9wdDogJ25hbWVUb1BhcmFtJ1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnYWxpYXNfb2YnLFxuICB7XG4gICAgdmFyOiAnYWxpYXNPZicsXG4gICAgY2FycmV0OiB0cnVlXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCdoZWxwJyxcbiAge1xuICAgIGZ1bmN0OiAnaGVscCcsXG4gICAgc2hvd0VtcHR5OiB0cnVlXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCdzb3VyY2UnLFxuICB7XG4gICAgdmFyOiAncmVzdWx0U3RyJyxcbiAgICBkYXRhTmFtZTogJ3Jlc3VsdCcsXG4gICAgc2hvd0VtcHR5OiB0cnVlLFxuICAgIGNhcnJldDogdHJ1ZVxuICB9KVxuXTtcblxuTmFtZVNwYWNlQ21kID0gY2xhc3MgTmFtZVNwYWNlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHJldHVybiB0aGlzLm5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswXSk7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdmFyIGksIGxlbiwgbmFtZXNwYWNlcywgbnNwYywgcGFyc2VyLCB0eHQ7XG4gICAgaWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0LmFkZE5hbWVTcGFjZSh0aGlzLm5hbWUpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VzID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKTtcbiAgICAgIHR4dCA9ICd+fmJveH5+XFxuJztcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IG5hbWVzcGFjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbnNwYyA9IG5hbWVzcGFjZXNbaV07XG4gICAgICAgIGlmIChuc3BjICE9PSB0aGlzLmluc3RhbmNlLmNtZC5mdWxsTmFtZSkge1xuICAgICAgICAgIHR4dCArPSBuc3BjICsgJ1xcbic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHR4dCArPSAnfn4hY2xvc2V8fn5cXG5+fi9ib3h+fic7XG4gICAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodHh0KTtcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICB9XG4gIH1cblxufTtcblxuVGVtcGxhdGVDbWQgPSBjbGFzcyBUZW1wbGF0ZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgICByZXR1cm4gdGhpcy5zZXAgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc2VwJ10sIFwiXFxuXCIpO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBkYXRhO1xuICAgIGRhdGEgPSB0aGlzLm5hbWUgPyBQYXRoSGVscGVyLmdldFBhdGgodGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCB0aGlzLm5hbWUpIDogdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzO1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQgJiYgKGRhdGEgIT0gbnVsbCkgJiYgZGF0YSAhPT0gZmFsc2UpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBkYXRhLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclRlbXBsYXRlKGl0ZW0pO1xuICAgICAgICB9KS5qb2luKHRoaXMuc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclRlbXBsYXRlKGRhdGEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVGVtcGxhdGUoZGF0YSkge1xuICAgIHZhciBwYXJzZXI7XG4gICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgcGFyc2VyLnZhcnMgPSB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiA/IGRhdGEgOiB7XG4gICAgICB2YWx1ZTogZGF0YVxuICAgIH07XG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG4gICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpO1xuICB9XG5cbn07XG5cbkVtbWV0Q21kID0gY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5hYmJyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2FiYnInLCAnYWJicmV2aWF0aW9uJ10pO1xuICAgIHJldHVybiB0aGlzLmxhbmcgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxLCAnbGFuZycsICdsYW5ndWFnZSddKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgZW1tZXQsIGV4LCByZXM7XG4gICAgZW1tZXQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IHdpbmRvdy5lbW1ldCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmID0gd2luZG93LnNlbGYpICE9IG51bGwgPyByZWYuZW1tZXQgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZWxmLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmMSA9IHdpbmRvdy5nbG9iYWwpICE9IG51bGwgPyByZWYxLmVtbWV0IDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2xvYmFsLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiByZXF1aXJlICE9PSBudWxsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJ2VtbWV0Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmxvZ2dlci5sb2coJ0VtbWV0IGlzIG5vdCBhdmFpbGFibGUsIGl0IG1heSBuZWVkIHRvIGJlIGluc3RhbGxlZCBtYW51YWxseScpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkuY2FsbCh0aGlzKTtcbiAgICBpZiAoZW1tZXQgIT0gbnVsbCkge1xuICAgICAgLy8gZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKHRoaXMuYWJiciwgdGhpcy5sYW5nKTtcbiAgICAgIHJldHVybiByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kLCBCYXNlQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi4vQm94SGVscGVyJztcbmltcG9ydCB7IEVkaXRDbWRQcm9wIH0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGF0aEhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvUGF0aEhlbHBlcic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIEZpbGVDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnZmlsZScpKVxuICBcbiAgY29yZS5hZGRDbWRzKHtcbiAgICBcInJlYWRcIjoge1xuICAgICAgJ3Jlc3VsdCcgOiByZWFkQ29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydmaWxlJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHJlYWQgdGhlIGNvbnRlbnQgb2YgYSBmaWxlXG4gICAgICAgIFwiXCJcIlxuICAgIH1cbiAgICBcIndyaXRlXCI6IHtcbiAgICAgICdyZXN1bHQnIDogd3JpdGVDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2ZpbGUnLCdjb250ZW50J11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHNhdmUgaW50byBhIGZpbGVcbiAgICAgICAgXCJcIlwiXG4gICAgfVxuICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICdyZXN1bHQnIDogZGVsZXRlQ29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydmaWxlJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIGRlbGV0ZSBhIGZpbGVcbiAgICAgICAgXCJcIlwiXG4gICAgfVxuICB9KVxuXG5yZWFkQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKVxuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2ZpbGUnXSlcbiAgaWYgZmlsZVN5c3RlbVxuICAgIGZpbGVTeXN0ZW0ucmVhZEZpbGUoZmlsZSlcblxud3JpdGVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZmlsZSddKVxuICBjb250ZW50ID0gaW5zdGFuY2UuY29udGVudCBvciBpbnN0YW5jZS5nZXRQYXJhbShbMSwnY29udGVudCddKVxuICBpZiBmaWxlU3lzdGVtXG4gICAgZmlsZVN5c3RlbS53cml0ZUZpbGUoZmlsZSxjb250ZW50KVxuICAgICAgXG5kZWxldGVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZmlsZSddKVxuICBpZiBmaWxlU3lzdGVtXG4gICAgZmlsZVN5c3RlbS5kZWxldGVGaWxlKGZpbGUpIiwidmFyIGRlbGV0ZUNvbW1hbmQsIHJlYWRDb21tYW5kLCB3cml0ZUNvbW1hbmQ7XG5cbmltcG9ydCB7XG4gIENvbW1hbmQsXG4gIEJhc2VDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBCb3hIZWxwZXJcbn0gZnJvbSAnLi4vQm94SGVscGVyJztcblxuaW1wb3J0IHtcbiAgRWRpdENtZFByb3Bcbn0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYXRoSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvUGF0aEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IHZhciBGaWxlQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgRmlsZUNvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgY29yZTtcbiAgICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2ZpbGUnKSk7XG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICBcInJlYWRcIjoge1xuICAgICAgICAncmVzdWx0JzogcmVhZENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2ZpbGUnXSxcbiAgICAgICAgJ2hlbHAnOiBcInJlYWQgdGhlIGNvbnRlbnQgb2YgYSBmaWxlXCJcbiAgICAgIH0sXG4gICAgICBcIndyaXRlXCI6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHdyaXRlQ29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnZmlsZScsICdjb250ZW50J10sXG4gICAgICAgICdoZWxwJzogXCJzYXZlIGludG8gYSBmaWxlXCJcbiAgICAgIH0sXG4gICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICdyZXN1bHQnOiBkZWxldGVDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydmaWxlJ10sXG4gICAgICAgICdoZWxwJzogXCJkZWxldGUgYSBmaWxlXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuXG5yZWFkQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtO1xuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpO1xuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pO1xuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLnJlYWRGaWxlKGZpbGUpO1xuICB9XG59O1xuXG53cml0ZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgY29udGVudCwgZmlsZSwgZmlsZVN5c3RlbTtcbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKTtcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKTtcbiAgY29udGVudCA9IGluc3RhbmNlLmNvbnRlbnQgfHwgaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdjb250ZW50J10pO1xuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLndyaXRlRmlsZShmaWxlLCBjb250ZW50KTtcbiAgfVxufTtcblxuZGVsZXRlQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtO1xuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpO1xuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pO1xuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLmRlbGV0ZUZpbGUoZmlsZSk7XG4gIH1cbn07XG4iLCJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEh0bWxDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGh0bWwgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnaHRtbCcpKVxuICBodG1sLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6ZW1tZXQnLFxuICAgICAgJ2RlZmF1bHRzJyA6IHsnbGFuZyc6J2h0bWwnfSxcbiAgICAgICduYW1lVG9QYXJhbScgOiAnYWJicidcbiAgICB9LFxuICB9KVxuICBcbiAgY3NzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NzcycpKVxuICBjc3MuYWRkQ21kcyh7XG4gICAgJ2ZhbGxiYWNrJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTplbW1ldCcsXG4gICAgICAnZGVmYXVsdHMnIDogeydsYW5nJzonY3NzJ30sXG4gICAgICAnbmFtZVRvUGFyYW0nIDogJ2FiYnInXG4gICAgfSxcbiAgfSlcblxuIiwiaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBIdG1sQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSHRtbENvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgY3NzLCBodG1sO1xuICAgIGh0bWwgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnaHRtbCcpKTtcbiAgICBodG1sLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmVtbWV0JyxcbiAgICAgICAgJ2RlZmF1bHRzJzoge1xuICAgICAgICAgICdsYW5nJzogJ2h0bWwnXG4gICAgICAgIH0sXG4gICAgICAgICduYW1lVG9QYXJhbSc6ICdhYmJyJ1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNzcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjc3MnKSk7XG4gICAgcmV0dXJuIGNzcy5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplbW1ldCcsXG4gICAgICAgICdkZWZhdWx0cyc6IHtcbiAgICAgICAgICAnbGFuZyc6ICdjc3MnXG4gICAgICAgIH0sXG4gICAgICAgICduYW1lVG9QYXJhbSc6ICdhYmJyJ1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEpzQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBqcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqcycpKVxuICBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnamF2YXNjcmlwdCcseyBhbGlhc09mOiAnanMnIH0pKVxuICBqcy5hZGRDbWRzKHtcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgJ2lmJzogICdpZih8KXtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdsb2cnOiAgJ2lmKHdpbmRvdy5jb25zb2xlKXtcXG5cXHRjb25zb2xlLmxvZyh+fmNvbnRlbnR+fnwpXFxufScsXG4gICAgJ2Z1bmN0aW9uJzpcdCdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2Z1bmN0Jzp7IGFsaWFzT2Y6ICdqczpmdW5jdGlvbicgfSxcbiAgICAnZic6eyAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJyB9LFxuICAgICdmb3InOiBcdFx0J2ZvciAodmFyIGkgPSAwOyBpIDwgfDsgaSsrKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnZm9yaW4nOidmb3IgKHZhciB2YWwgaW4gfCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2VhY2gnOnsgIGFsaWFzT2Y6ICdqczpmb3JpbicgfSxcbiAgICAnZm9yZWFjaCc6eyAgYWxpYXNPZjogJ2pzOmZvcmluJyB9LFxuICAgICd3aGlsZSc6ICAnd2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ3doaWxlaSc6ICd2YXIgaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxuXFx0aSsrO1xcbn0nLFxuICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICdpZmUnOnsgICBhbGlhc09mOiAnanM6aWZlbHNlJyB9LFxuICAgICdzd2l0Y2gnOlx0XCJcIlwiXG4gICAgICBzd2l0Y2goIHwgKSB7IFxuICAgICAgXFx0Y2FzZSA6XG4gICAgICBcXHRcXHR+fmNvbnRlbnR+flxuICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICBcXHRkZWZhdWx0IDpcbiAgICAgIFxcdFxcdFxuICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICB9XG4gICAgICBcIlwiXCIsXG4gIH0pXG4iLCJpbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIEpzQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSnNDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGpzO1xuICAgIGpzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2pzJykpO1xuICAgIGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqYXZhc2NyaXB0Jywge1xuICAgICAgYWxpYXNPZjogJ2pzJ1xuICAgIH0pKTtcbiAgICByZXR1cm4ganMuYWRkQ21kcyh7XG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICAnaWYnOiAnaWYofCl7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdsb2cnOiAnaWYod2luZG93LmNvbnNvbGUpe1xcblxcdGNvbnNvbGUubG9nKH5+Y29udGVudH5+fClcXG59JyxcbiAgICAgICdmdW5jdGlvbic6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZnVuY3QnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZic6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmb3InOiAnZm9yICh2YXIgaSA9IDA7IGkgPCB8OyBpKyspIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2ZvcmluJzogJ2ZvciAodmFyIHZhbCBpbiB8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgJ2ZvcmVhY2gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmb3JpbidcbiAgICAgIH0sXG4gICAgICAnd2hpbGUnOiAnd2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnd2hpbGVpJzogJ3ZhciBpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG5cXHRpKys7XFxufScsXG4gICAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+Y29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAgICdpZmUnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczppZmVsc2UnXG4gICAgICB9LFxuICAgICAgJ3N3aXRjaCc6IFwic3dpdGNoKCB8ICkgeyBcXG5cXHRjYXNlIDpcXG5cXHRcXHR+fmNvbnRlbnR+flxcblxcdFxcdGJyZWFrO1xcblxcdGRlZmF1bHQgOlxcblxcdFxcdFxcblxcdFxcdGJyZWFrO1xcbn1cIlxuICAgIH0pO1xuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcbmltcG9ydCB7IFBhaXJEZXRlY3RvciB9IGZyb20gJy4uL2RldGVjdG9ycy9QYWlyRGV0ZWN0b3InO1xuXG5leHBvcnQgY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpXG4gIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICByZXN1bHQ6ICdwaHA6aW5uZXInLFxuICAgIG9wZW5lcjogJzw/cGhwJyxcbiAgICBjbG9zZXI6ICc/PicsXG4gICAgb3B0aW9ubmFsX2VuZDogdHJ1ZSxcbiAgICAnZWxzZSc6ICdwaHA6b3V0ZXInXG4gIH0pKSBcblxuICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpXG4gIHBocE91dGVyLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnYW55X2NvbnRlbnQnOiB7IFxuICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnIFxuICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBwcmVmaXg6ICcgPz5cXG4nXG4gICAgICAgICAgICBzdWZmaXg6ICdcXG48P3BocCAnXG4gICAgICAgICAgICBhZmZpeGVzX2VtcHR5OiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjolbmFtZSUnLFxuICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgfSxcbiAgICAnYm94JzogeyBcbiAgICAgIGFsaWFzT2Y6ICdjb3JlOmJveCcgXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBwcmVmaXg6ICc8P3BocFxcbidcbiAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICB9XG4gICAgfSxcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgcGhwOiAnPD9waHBcXG5cXHR+fmNvbnRlbnR+fnxcXG4/PicsXG4gIH0pXG4gIFxuICBwaHBJbm5lciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ2lubmVyJykpXG4gIHBocElubmVyLmFkZENtZHMoe1xuICAgICdhbnlfY29udGVudCc6IHsgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcgfSxcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgJ2lmJzogICAnaWYofCl7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ2luZm8nOiAncGhwaW5mbygpOycsXG4gICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAnZSc6eyAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZWNobycgfSxcbiAgICAnY2xhc3MnOntcbiAgICAgIHJlc3VsdCA6IFwiXCJcIlxuICAgICAgICBjbGFzcyB+fnBhcmFtIDAgY2xhc3MgZGVmOnx+fiB7XG4gICAgICAgIFxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xuICAgICAgICBcXHRcXHR+fmNvbnRlbnR+fnxcbiAgICAgICAgXFx0fVxuICAgICAgICB9XG4gICAgICAgIFwiXCJcIixcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdjJzp7ICAgICBhbGlhc09mOiAncGhwOmlubmVyOmNsYXNzJyB9LFxuICAgICdmdW5jdGlvbic6XHR7XG4gICAgICByZXN1bHQgOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAnZnVuY3QnOnsgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbicgfSxcbiAgICAnZic6eyAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbicgfSxcbiAgICAnYXJyYXknOiAgJyR8ID0gYXJyYXkoKTsnLFxuICAgICdhJzpcdCAgICAnYXJyYXkoKScsXG4gICAgJ2Zvcic6IFx0XHQnZm9yICgkaSA9IDA7ICRpIDwgJHw7ICRpKyspIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnZm9yZWFjaCc6J2ZvcmVhY2ggKCR8IGFzICRrZXkgPT4gJHZhbCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICdlYWNoJzp7ICBhbGlhc09mOiAncGhwOmlubmVyOmZvcmVhY2gnIH0sXG4gICAgJ3doaWxlJzogICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ3doaWxlaSc6IHtcbiAgICAgIHJlc3VsdCA6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgJ2lmZSc6eyAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6aWZlbHNlJyB9LFxuICAgICdzd2l0Y2gnOlx0e1xuICAgICAgcmVzdWx0IDogXCJcIlwiXG4gICAgICAgIHN3aXRjaCggfCApIHsgXG4gICAgICAgIFxcdGNhc2UgOlxuICAgICAgICBcXHRcXHR+fmFueV9jb250ZW50fn5cbiAgICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICAgIFxcdGRlZmF1bHQgOlxuICAgICAgICBcXHRcXHRcbiAgICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiLFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICAnY2xvc2UnOiB7IFxuICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnIFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nXG4gICAgICAgIHN1ZmZpeDogJ1xcbj8+J1xuICAgICAgICByZXF1aXJlZF9hZmZpeGVzOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gIH0pXG4gIFxuXG53cmFwV2l0aFBocCA9IChyZXN1bHQsaW5zdGFuY2UpIC0+XG4gIGlubGluZSA9IGluc3RhbmNlLmdldFBhcmFtKFsncGhwX2lubGluZScsJ2lubGluZSddLHRydWUpXG4gIGlmIGlubGluZVxuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nXG4gICAgcmVnQ2xvc2UgPSAvKFtcXG5cXHJcXHNdKylcXHNcXD8+L2dcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nXG4gIGVsc2VcbiAgICAnPD9waHBcXG4nICsgU3RyaW5nSGVscGVyLmluZGVudChyZXN1bHQpICsgJ1xcbj8+J1xuXG4jIGNsb3NlUGhwRm9yQ29udGVudCA9IChpbnN0YW5jZSkgLT5cbiMgICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnIiwidmFyIHdyYXBXaXRoUGhwO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBQYWlyRGV0ZWN0b3Jcbn0gZnJvbSAnLi4vZGV0ZWN0b3JzL1BhaXJEZXRlY3Rvcic7XG5cbmV4cG9ydCB2YXIgUGhwQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBwaHAsIHBocElubmVyLCBwaHBPdXRlcjtcbiAgICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpO1xuICAgIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgICBvcGVuZXI6ICc8P3BocCcsXG4gICAgICBjbG9zZXI6ICc/PicsXG4gICAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICAgJ2Vsc2UnOiAncGhwOm91dGVyJ1xuICAgIH0pKTtcbiAgICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpO1xuICAgIHBocE91dGVyLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnYW55X2NvbnRlbnQnOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50JyxcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbicsXG4gICAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICcsXG4gICAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6JW5hbWUlJyxcbiAgICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgICB9LFxuICAgICAgJ2JveCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+J1xuICAgIH0pO1xuICAgIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSk7XG4gICAgcmV0dXJuIHBocElubmVyLmFkZENtZHMoe1xuICAgICAgJ2FueV9jb250ZW50Jzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50J1xuICAgICAgfSxcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgICdpZic6ICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdpbmZvJzogJ3BocGluZm8oKTsnLFxuICAgICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAgICdlJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmVjaG8nXG4gICAgICB9LFxuICAgICAgJ2NsYXNzJzoge1xuICAgICAgICByZXN1bHQ6IFwiY2xhc3Mgfn5wYXJhbSAwIGNsYXNzIGRlZjp8fn4ge1xcblxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xcblxcdFxcdH5+Y29udGVudH5+fFxcblxcdH1cXG59XCIsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2MnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnXG4gICAgICB9LFxuICAgICAgJ2Z1bmN0aW9uJzoge1xuICAgICAgICByZXN1bHQ6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdhcnJheSc6ICckfCA9IGFycmF5KCk7JyxcbiAgICAgICdhJzogJ2FycmF5KCknLFxuICAgICAgJ2Zvcic6ICdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2ZvcmVhY2gnOiAnZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmb3JlYWNoJ1xuICAgICAgfSxcbiAgICAgICd3aGlsZSc6ICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnd2hpbGVpJzoge1xuICAgICAgICByZXN1bHQ6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgJ2lmZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnXG4gICAgICB9LFxuICAgICAgJ3N3aXRjaCc6IHtcbiAgICAgICAgcmVzdWx0OiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5hbnlfY29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufVwiLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PicsXG4gICAgICAgICAgcmVxdWlyZWRfYWZmaXhlczogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbndyYXBXaXRoUGhwID0gZnVuY3Rpb24ocmVzdWx0LCBpbnN0YW5jZSkge1xuICB2YXIgaW5saW5lLCByZWdDbG9zZSwgcmVnT3BlbjtcbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywgJ2lubGluZSddLCB0cnVlKTtcbiAgaWYgKGlubGluZSkge1xuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nO1xuICAgIHJlZ0Nsb3NlID0gLyhbXFxuXFxyXFxzXSspXFxzXFw/Pi9nO1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/Pic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nO1xuICB9XG59O1xuXG4vLyBjbG9zZVBocEZvckNvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4vLyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICdcbiIsImltcG9ydCB7IERldGVjdG9yIH0gZnJvbSAnLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCBjbGFzcyBBbHdheXNFbmFibGVkIGV4dGVuZHMgRGV0ZWN0b3JcbiAgY29uc3RydWN0b3I6IChAbmFtZXNwYWNlKSAtPlxuICAgIHN1cGVyKClcbiAgZGV0ZWN0OiAoZmluZGVyKSAtPlxuICAgIHJldHVybiBAbmFtZXNwYWNlIiwiaW1wb3J0IHtcbiAgRGV0ZWN0b3Jcbn0gZnJvbSAnLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCB2YXIgQWx3YXlzRW5hYmxlZCA9IGNsYXNzIEFsd2F5c0VuYWJsZWQgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKG5hbWVzcGFjZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4gIH1cblxuICBkZXRlY3QoZmluZGVyKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgRGV0ZWN0b3JcbiAgY29uc3RydWN0b3I6IChAZGF0YT17fSkgLT5cbiAgZGV0ZWN0OiAoZmluZGVyKSAtPlxuICAgIGlmIEBkZXRlY3RlZChmaW5kZXIpXG4gICAgICByZXR1cm4gQGRhdGEucmVzdWx0IGlmIEBkYXRhLnJlc3VsdD9cbiAgICBlbHNlXG4gICAgICByZXR1cm4gQGRhdGEuZWxzZSBpZiBAZGF0YS5lbHNlP1xuICBkZXRlY3RlZDogKGZpbmRlcikgLT5cbiAgICAjXG4iLCJleHBvcnQgdmFyIERldGVjdG9yID0gY2xhc3MgRGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhID0ge30pIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICB9XG5cbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIGlmICh0aGlzLmRldGVjdGVkKGZpbmRlcikpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEucmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5yZXN1bHQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuZWxzZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuZWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXRlY3RlZChmaW5kZXIpIHt9XG5cbn07XG5cblxuIiwiaW1wb3J0IHsgRGV0ZWN0b3IgfSBmcm9tICcuL0RldGVjdG9yJztcblxuZXhwb3J0IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yXG4gIGRldGVjdDogKGZpbmRlcikgLT5cbiAgICBpZiBmaW5kZXIuY29kZXdhdmU/IFxuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpXG4gICAgICBpZiBsYW5nPyBcbiAgICAgICAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKSIsImltcG9ydCB7XG4gIERldGVjdG9yXG59IGZyb20gJy4vRGV0ZWN0b3InO1xuXG5leHBvcnQgdmFyIExhbmdEZXRlY3RvciA9IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIHZhciBsYW5nO1xuICAgIGlmIChmaW5kZXIuY29kZXdhdmUgIT0gbnVsbCkge1xuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpO1xuICAgICAgaWYgKGxhbmcgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUGFpciB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1BhaXInO1xuaW1wb3J0IHsgRGV0ZWN0b3IgfSBmcm9tICcuL0RldGVjdG9yJztcblxuZXhwb3J0IGNsYXNzIFBhaXJEZXRlY3RvciBleHRlbmRzIERldGVjdG9yXG4gIGRldGVjdGVkOiAoZmluZGVyKSAtPlxuICAgIGlmIEBkYXRhLm9wZW5lcj8gYW5kIEBkYXRhLmNsb3Nlcj8gYW5kIGZpbmRlci5pbnN0YW5jZT9cbiAgICAgIHBhaXIgPSBuZXcgUGFpcihAZGF0YS5vcGVuZXIsIEBkYXRhLmNsb3NlciwgQGRhdGEpXG4gICAgICBpZiBwYWlyLmlzV2FwcGVyT2YoZmluZGVyLmluc3RhbmNlLmdldFBvcygpLCBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLnRleHQoKSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgICAgICIsImltcG9ydCB7XG4gIFBhaXJcbn0gZnJvbSAnLi4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmltcG9ydCB7XG4gIERldGVjdG9yXG59IGZyb20gJy4vRGV0ZWN0b3InO1xuXG5leHBvcnQgdmFyIFBhaXJEZXRlY3RvciA9IGNsYXNzIFBhaXJEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0ZWQoZmluZGVyKSB7XG4gICAgdmFyIHBhaXI7XG4gICAgaWYgKCh0aGlzLmRhdGEub3BlbmVyICE9IG51bGwpICYmICh0aGlzLmRhdGEuY2xvc2VyICE9IG51bGwpICYmIChmaW5kZXIuaW5zdGFuY2UgIT0gbnVsbCkpIHtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcih0aGlzLmRhdGEub3BlbmVyLCB0aGlzLmRhdGEuY2xvc2VyLCB0aGlzLmRhdGEpO1xuICAgICAgaWYgKHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vYm9vdHN0cmFwJztcbmltcG9ydCB7IFRleHRBcmVhRWRpdG9yIH0gZnJvbSAnLi9UZXh0QXJlYUVkaXRvcic7XG5cbkNvZGV3YXZlLmRldGVjdCA9ICh0YXJnZXQpIC0+XG4gIGN3ID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvcih0YXJnZXQpKVxuICBDb2Rld2F2ZS5pbnN0YW5jZXMucHVzaChjdylcbiAgY3dcblxuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmVcblxud2luZG93LkNvZGV3YXZlID0gQ29kZXdhdmVcblxuICAiLCJpbXBvcnQge1xuICBDb2Rld2F2ZVxufSBmcm9tICcuL2Jvb3RzdHJhcCc7XG5cbmltcG9ydCB7XG4gIFRleHRBcmVhRWRpdG9yXG59IGZyb20gJy4vVGV4dEFyZWFFZGl0b3InO1xuXG5Db2Rld2F2ZS5kZXRlY3QgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgdmFyIGN3O1xuICBjdyA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dEFyZWFFZGl0b3IodGFyZ2V0KSk7XG4gIENvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KTtcbiAgcmV0dXJuIGN3O1xufTtcblxuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmU7XG5cbndpbmRvdy5Db2Rld2F2ZSA9IENvZGV3YXZlO1xuIiwiZXhwb3J0IGNsYXNzIEFycmF5SGVscGVyXG4gIEBpc0FycmF5OiAoYXJyKSAtPlxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIGFyciApID09ICdbb2JqZWN0IEFycmF5XSdcbiAgXG4gIEB1bmlvbjogKGExLGEyKSAtPlxuICAgIEB1bmlxdWUoYTEuY29uY2F0KGEyKSlcbiAgICBcbiAgQHVuaXF1ZTogKGFycmF5KSAtPlxuICAgIGEgPSBhcnJheS5jb25jYXQoKVxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IGEubGVuZ3RoXG4gICAgICBqID0gaSArIDFcbiAgICAgIHdoaWxlIGogPCBhLmxlbmd0aFxuICAgICAgICBpZiBhW2ldID09IGFbal1cbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpXG4gICAgICAgICsralxuICAgICAgKytpXG4gICAgYSIsImV4cG9ydCB2YXIgQXJyYXlIZWxwZXIgPSBjbGFzcyBBcnJheUhlbHBlciB7XG4gIHN0YXRpYyBpc0FycmF5KGFycikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfVxuXG4gIHN0YXRpYyB1bmlvbihhMSwgYTIpIHtcbiAgICByZXR1cm4gdGhpcy51bmlxdWUoYTEuY29uY2F0KGEyKSk7XG4gIH1cblxuICBzdGF0aWMgdW5pcXVlKGFycmF5KSB7XG4gICAgdmFyIGEsIGksIGo7XG4gICAgYSA9IGFycmF5LmNvbmNhdCgpO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgYS5sZW5ndGgpIHtcbiAgICAgIGogPSBpICsgMTtcbiAgICAgIHdoaWxlIChqIDwgYS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGFbaV0gPT09IGFbal0pIHtcbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpO1xuICAgICAgICB9XG4gICAgICAgICsrajtcbiAgICAgIH1cbiAgICAgICsraTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBDb21tb25IZWxwZXJcblxuICBAbWVyZ2U6ICh4cy4uLikgLT5cbiAgICBpZiB4cz8ubGVuZ3RoID4gMFxuICAgICAgQHRhcCB7fSwgKG0pIC0+IG1ba10gPSB2IGZvciBrLCB2IG9mIHggZm9yIHggaW4geHNcbiBcbiAgQHRhcDogKG8sIGZuKSAtPiBcbiAgICBmbihvKVxuICAgIG9cblxuICBAYXBwbHlNaXhpbnM6IChkZXJpdmVkQ3RvciwgYmFzZUN0b3JzKSAtPiBcbiAgICBiYXNlQ3RvcnMuZm9yRWFjaCAoYmFzZUN0b3IpID0+IFxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoIChuYW1lKT0+IFxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKSIsImV4cG9ydCB2YXIgQ29tbW9uSGVscGVyID0gY2xhc3MgQ29tbW9uSGVscGVyIHtcbiAgc3RhdGljIG1lcmdlKC4uLnhzKSB7XG4gICAgaWYgKCh4cyAhPSBudWxsID8geHMubGVuZ3RoIDogdm9pZCAwKSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcCh7fSwgZnVuY3Rpb24obSkge1xuICAgICAgICB2YXIgaSwgaywgbGVuLCByZXN1bHRzLCB2LCB4O1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHhzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgeCA9IHhzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0czE7XG4gICAgICAgICAgICByZXN1bHRzMSA9IFtdO1xuICAgICAgICAgICAgZm9yIChrIGluIHgpIHtcbiAgICAgICAgICAgICAgdiA9IHhba107XG4gICAgICAgICAgICAgIHJlc3VsdHMxLnB1c2gobVtrXSA9IHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMxO1xuICAgICAgICAgIH0pKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRhcChvLCBmbikge1xuICAgIGZuKG8pO1xuICAgIHJldHVybiBvO1xuICB9XG5cbiAgc3RhdGljIGFwcGx5TWl4aW5zKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIHtcbiAgICByZXR1cm4gYmFzZUN0b3JzLmZvckVhY2goKGJhc2VDdG9yKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVyaXZlZEN0b3IsIG5hbWUsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZUN0b3IucHJvdG90eXBlLCBuYW1lKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgTmFtZXNwYWNlSGVscGVyXG5cbiAgQHNwbGl0Rmlyc3Q6IChmdWxsbmFtZSxpc1NwYWNlID0gZmFsc2UpIC0+XG4gICAgaWYgZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT0gLTEgYW5kICFpc1NwYWNlXG4gICAgICByZXR1cm4gW251bGwsZnVsbG5hbWVdXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLHBhcnRzLmpvaW4oJzonKSB8fCBudWxsXVxuXG4gIEBzcGxpdDogKGZ1bGxuYW1lKSAtPlxuICAgIGlmIGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09IC0xXG4gICAgICByZXR1cm4gW251bGwsZnVsbG5hbWVdXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgbmFtZSA9IHBhcnRzLnBvcCgpXG4gICAgW3BhcnRzLmpvaW4oJzonKSxuYW1lXSIsImV4cG9ydCB2YXIgTmFtZXNwYWNlSGVscGVyID0gY2xhc3MgTmFtZXNwYWNlSGVscGVyIHtcbiAgc3RhdGljIHNwbGl0Rmlyc3QoZnVsbG5hbWUsIGlzU3BhY2UgPSBmYWxzZSkge1xuICAgIHZhciBwYXJ0cztcbiAgICBpZiAoZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT09IC0xICYmICFpc1NwYWNlKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXTtcbiAgICB9XG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpO1xuICAgIHJldHVybiBbcGFydHMuc2hpZnQoKSwgcGFydHMuam9pbignOicpIHx8IG51bGxdO1xuICB9XG5cbiAgc3RhdGljIHNwbGl0KGZ1bGxuYW1lKSB7XG4gICAgdmFyIG5hbWUsIHBhcnRzO1xuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdO1xuICAgIH1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6Jyk7XG4gICAgbmFtZSA9IHBhcnRzLnBvcCgpO1xuICAgIHJldHVybiBbcGFydHMuam9pbignOicpLCBuYW1lXTtcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgT3B0aW9uYWxQcm9taXNlXG4gICAgY29uc3RydWN0b3I6IChAdmFsKSAtPlxuICAgICAgICBpZiBAdmFsPyBhbmQgQHZhbC50aGVuPyBhbmQgQHZhbC5yZXN1bHQ/XG4gICAgICAgICAgICBAdmFsID0gQHZhbC5yZXN1bHQoKVxuICAgIHRoZW46IChjYikgLT5cbiAgICAgICAgaWYgQHZhbD8gYW5kIEB2YWwudGhlbj9cbiAgICAgICAgICAgIG5ldyBPcHRpb25hbFByb21pc2UoQHZhbC50aGVuKGNiKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV3IE9wdGlvbmFsUHJvbWlzZShjYihAdmFsKSlcbiAgICByZXN1bHQ6IC0+XG4gICAgICAgIEB2YWxcblxuZXhwb3J0IG9wdGlvbmFsUHJvbWlzZSA9ICh2YWwpLT4gXG4gICAgbmV3IE9wdGlvbmFsUHJvbWlzZSh2YWwpXG5cblxuIiwiZXhwb3J0IHZhciBPcHRpb25hbFByb21pc2UgPSBjbGFzcyBPcHRpb25hbFByb21pc2Uge1xuICBjb25zdHJ1Y3Rvcih2YWwxKSB7XG4gICAgdGhpcy52YWwgPSB2YWwxO1xuICAgIGlmICgodGhpcy52YWwgIT0gbnVsbCkgJiYgKHRoaXMudmFsLnRoZW4gIT0gbnVsbCkgJiYgKHRoaXMudmFsLnJlc3VsdCAhPSBudWxsKSkge1xuICAgICAgdGhpcy52YWwgPSB0aGlzLnZhbC5yZXN1bHQoKTtcbiAgICB9XG4gIH1cblxuICB0aGVuKGNiKSB7XG4gICAgaWYgKCh0aGlzLnZhbCAhPSBudWxsKSAmJiAodGhpcy52YWwudGhlbiAhPSBudWxsKSkge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodGhpcy52YWwudGhlbihjYikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZShjYih0aGlzLnZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICByZXR1cm4gdGhpcy52YWw7XG4gIH1cblxufTtcblxuZXhwb3J0IHZhciBvcHRpb25hbFByb21pc2UgPSBmdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodmFsKTtcbn07XG4iLCJleHBvcnQgY2xhc3MgUGF0aEhlbHBlclxuICBAZ2V0UGF0aDogKG9iaixwYXRoLHNlcD0nLicpIC0+XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcClcbiAgICBjdXIgPSBvYmpcbiAgICBwYXJ0cy5maW5kIChwYXJ0KSA9PlxuICAgICAgY3VyID0gY3VyW3BhcnRdXG4gICAgICB0eXBlb2YgY3VyID09IFwidW5kZWZpbmVkXCJcbiAgICBjdXJcbiAgICBcbiAgXG4gIEBzZXRQYXRoOiAob2JqLHBhdGgsdmFsLHNlcD0nLicpIC0+XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcClcbiAgICBsYXN0ID0gcGFydHMucG9wKClcbiAgICBwYXJ0cy5yZWR1Y2UoKGN1cixwYXJ0KSA9PlxuICAgICAgaWYgY3VyW3BhcnRdP1xuICAgICAgICBjdXJbcGFydF1cbiAgICAgIGVsc2VcbiAgICAgICAgY3VyW3BhcnRdID0ge31cbiAgICAsIG9iailbbGFzdF0gPSB2YWxcbiAgICAiLCJleHBvcnQgdmFyIFBhdGhIZWxwZXIgPSBjbGFzcyBQYXRoSGVscGVyIHtcbiAgc3RhdGljIGdldFBhdGgob2JqLCBwYXRoLCBzZXAgPSAnLicpIHtcbiAgICB2YXIgY3VyLCBwYXJ0cztcbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKTtcbiAgICBjdXIgPSBvYmo7XG4gICAgcGFydHMuZmluZCgocGFydCkgPT4ge1xuICAgICAgY3VyID0gY3VyW3BhcnRdO1xuICAgICAgcmV0dXJuIHR5cGVvZiBjdXIgPT09IFwidW5kZWZpbmVkXCI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGN1cjtcbiAgfVxuXG4gIHN0YXRpYyBzZXRQYXRoKG9iaiwgcGF0aCwgdmFsLCBzZXAgPSAnLicpIHtcbiAgICB2YXIgbGFzdCwgcGFydHM7XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcCk7XG4gICAgbGFzdCA9IHBhcnRzLnBvcCgpO1xuICAgIHJldHVybiBwYXJ0cy5yZWR1Y2UoKGN1ciwgcGFydCkgPT4ge1xuICAgICAgaWYgKGN1cltwYXJ0XSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjdXJbcGFydF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY3VyW3BhcnRdID0ge307XG4gICAgICB9XG4gICAgfSwgb2JqKVtsYXN0XSA9IHZhbDtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgU2l6ZSB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1NpemUnO1xuXG5leHBvcnQgY2xhc3MgU3RyaW5nSGVscGVyXG4gIEB0cmltRW1wdHlMaW5lOiAodHh0KSAtPlxuICAgIHJldHVybiB0eHQucmVwbGFjZSgvXlxccypcXHI/XFxuLywgJycpLnJlcGxhY2UoL1xccj9cXG5cXHMqJC8sICcnKVxuXG4gIEBlc2NhcGVSZWdFeHA6IChzdHIpIC0+XG4gICAgc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKVxuXG4gIEByZXBlYXRUb0xlbmd0aDogKHR4dCwgbGVuZ3RoKSAtPlxuICAgIHJldHVybiAnJyBpZiBsZW5ndGggPD0gMFxuICAgIEFycmF5KE1hdGguY2VpbChsZW5ndGgvdHh0Lmxlbmd0aCkrMSkuam9pbih0eHQpLnN1YnN0cmluZygwLGxlbmd0aClcbiAgICBcbiAgQHJlcGVhdDogKHR4dCwgbmIpIC0+XG4gICAgQXJyYXkobmIrMSkuam9pbih0eHQpXG4gICAgXG4gIEBnZXRUeHRTaXplOiAodHh0KSAtPlxuICAgIGxpbmVzID0gdHh0LnJlcGxhY2UoL1xcci9nLCcnKS5zcGxpdChcIlxcblwiKVxuICAgIHcgPSAwXG4gICAgZm9yIGwgaW4gbGluZXNcbiAgICAgIHcgPSBNYXRoLm1heCh3LGwubGVuZ3RoKVxuICAgIHJldHVybiBuZXcgU2l6ZSh3LGxpbmVzLmxlbmd0aC0xKVxuXG4gIEBpbmRlbnROb3RGaXJzdDogKHRleHQsbmI9MSxzcGFjZXM9JyAgJykgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmVnID0gL1xcbi9nXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgXCJcXG5cIiArIEByZXBlYXQoc3BhY2VzLCBuYikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgICAgIFxuICBAaW5kZW50OiAodGV4dCxuYj0xLHNwYWNlcz0nICAnKSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZXR1cm4gc3BhY2VzICsgQGluZGVudE5vdEZpcnN0KHRleHQsbmIsc3BhY2VzKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gIFxuICBAcmV2ZXJzZVN0cjogKHR4dCkgLT5cbiAgICByZXR1cm4gdHh0LnNwbGl0KFwiXCIpLnJldmVyc2UoKS5qb2luKFwiXCIpXG4gIFxuICBcbiAgQHJlbW92ZUNhcnJldDogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICB0bXAgPSAnW1tbW3F1b3RlZF9jYXJyZXRdXV1dJ1xuICAgIHJlQ2FycmV0ID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIpLCBcImdcIilcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyK2NhcnJldENoYXIpLCBcImdcIilcbiAgICByZVRtcCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cCh0bXApLCBcImdcIilcbiAgICB0eHQucmVwbGFjZShyZVF1b3RlZCx0bXApLnJlcGxhY2UocmVDYXJyZXQsJycpLnJlcGxhY2UocmVUbXAsIGNhcnJldENoYXIpXG4gICAgXG4gIEBnZXRBbmRSZW1vdmVGaXJzdENhcnJldDogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICBwb3MgPSBAZ2V0Q2FycmV0UG9zKHR4dCxjYXJyZXRDaGFyKVxuICAgIGlmIHBvcz9cbiAgICAgIHR4dCA9IHR4dC5zdWJzdHIoMCxwb3MpICsgdHh0LnN1YnN0cihwb3MrY2FycmV0Q2hhci5sZW5ndGgpXG4gICAgICByZXR1cm4gW3Bvcyx0eHRdXG4gICAgICBcbiAgQGdldENhcnJldFBvczogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyK2NhcnJldENoYXIpLCBcImdcIilcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKVxuICAgIGlmIChpID0gdHh0LmluZGV4T2YoY2FycmV0Q2hhcikpID4gLTFcbiAgICAgIHJldHVybiBpIiwiaW1wb3J0IHtcbiAgU2l6ZVxufSBmcm9tICcuLi9wb3NpdGlvbmluZy9TaXplJztcblxuZXhwb3J0IHZhciBTdHJpbmdIZWxwZXIgPSBjbGFzcyBTdHJpbmdIZWxwZXIge1xuICBzdGF0aWMgdHJpbUVtcHR5TGluZSh0eHQpIHtcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJyk7XG4gIH1cblxuICBzdGF0aWMgZXNjYXBlUmVnRXhwKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpO1xuICB9XG5cbiAgc3RhdGljIHJlcGVhdFRvTGVuZ3RoKHR4dCwgbGVuZ3RoKSB7XG4gICAgaWYgKGxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gdHh0Lmxlbmd0aCkgKyAxKS5qb2luKHR4dCkuc3Vic3RyaW5nKDAsIGxlbmd0aCk7XG4gIH1cblxuICBzdGF0aWMgcmVwZWF0KHR4dCwgbmIpIHtcbiAgICByZXR1cm4gQXJyYXkobmIgKyAxKS5qb2luKHR4dCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0VHh0U2l6ZSh0eHQpIHtcbiAgICB2YXIgaiwgbCwgbGVuLCBsaW5lcywgdztcbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpO1xuICAgIHcgPSAwO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBsID0gbGluZXNbal07XG4gICAgICB3ID0gTWF0aC5tYXgodywgbC5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFNpemUodywgbGluZXMubGVuZ3RoIC0gMSk7XG4gIH1cblxuICBzdGF0aWMgaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgdmFyIHJlZztcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZWcgPSAvXFxuL2c7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgXCJcXG5cIiArIHRoaXMucmVwZWF0KHNwYWNlcywgbmIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGluZGVudCh0ZXh0LCBuYiA9IDEsIHNwYWNlcyA9ICcgICcpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gc3BhY2VzICsgdGhpcy5pbmRlbnROb3RGaXJzdCh0ZXh0LCBuYiwgc3BhY2VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHJldmVyc2VTdHIodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5zcGxpdChcIlwiKS5yZXZlcnNlKCkuam9pbihcIlwiKTtcbiAgfVxuXG4gIHN0YXRpYyByZW1vdmVDYXJyZXQodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIHJlQ2FycmV0LCByZVF1b3RlZCwgcmVUbXAsIHRtcDtcbiAgICB0bXAgPSAnW1tbW3F1b3RlZF9jYXJyZXRdXV1dJztcbiAgICByZUNhcnJldCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciArIGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgcmVUbXAgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKHRtcCksIFwiZ1wiKTtcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UocmVRdW90ZWQsIHRtcCkucmVwbGFjZShyZUNhcnJldCwgJycpLnJlcGxhY2UocmVUbXAsIGNhcnJldENoYXIpO1xuICB9XG5cbiAgc3RhdGljIGdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciBwb3M7XG4gICAgcG9zID0gdGhpcy5nZXRDYXJyZXRQb3ModHh0LCBjYXJyZXRDaGFyKTtcbiAgICBpZiAocG9zICE9IG51bGwpIHtcbiAgICAgIHR4dCA9IHR4dC5zdWJzdHIoMCwgcG9zKSArIHR4dC5zdWJzdHIocG9zICsgY2FycmV0Q2hhci5sZW5ndGgpO1xuICAgICAgcmV0dXJuIFtwb3MsIHR4dF07XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldENhcnJldFBvcyh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgaSwgcmVRdW90ZWQ7XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHR4dCA9IHR4dC5yZXBsYWNlKHJlUXVvdGVkLCAnICcpO1xuICAgIGlmICgoaSA9IHR4dC5pbmRleE9mKGNhcnJldENoYXIpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGFpck1hdGNoIH0gZnJvbSAnLi9QYWlyTWF0Y2gnO1xuXG5leHBvcnQgY2xhc3MgUGFpclxuICBjb25zdHJ1Y3RvcjogKEBvcGVuZXIsQGNsb3NlcixAb3B0aW9ucyA9IHt9KSAtPlxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2VcbiAgICAgIHZhbGlkTWF0Y2g6IG51bGxcbiAgICB9XG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2YgQG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gQG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgb3BlbmVyUmVnOiAtPlxuICAgIGlmIHR5cGVvZiBAb3BlbmVyID09ICdzdHJpbmcnIFxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAb3BlbmVyKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQG9wZW5lclxuICBjbG9zZXJSZWc6IC0+XG4gICAgaWYgdHlwZW9mIEBjbG9zZXIgPT0gJ3N0cmluZycgXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjbG9zZXIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAY2xvc2VyXG4gIG1hdGNoQW55UGFydHM6IC0+XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW5lcjogQG9wZW5lclJlZygpXG4gICAgICBjbG9zZXI6IEBjbG9zZXJSZWcoKVxuICAgIH1cbiAgbWF0Y2hBbnlQYXJ0S2V5czogLT5cbiAgICBrZXlzID0gW11cbiAgICBmb3Iga2V5LCByZWcgb2YgQG1hdGNoQW55UGFydHMoKVxuICAgICAga2V5cy5wdXNoKGtleSlcbiAgICByZXR1cm4ga2V5c1xuICBtYXRjaEFueVJlZzogLT5cbiAgICBncm91cHMgPSBbXVxuICAgIGZvciBrZXksIHJlZyBvZiBAbWF0Y2hBbnlQYXJ0cygpXG4gICAgICBncm91cHMucHVzaCgnKCcrcmVnLnNvdXJjZSsnKScpXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoZ3JvdXBzLmpvaW4oJ3wnKSlcbiAgbWF0Y2hBbnk6ICh0ZXh0LG9mZnNldD0wKSAtPlxuICAgIHdoaWxlIChtYXRjaCA9IEBfbWF0Y2hBbnkodGV4dCxvZmZzZXQpKT8gYW5kICFtYXRjaC52YWxpZCgpXG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgIHJldHVybiBtYXRjaCBpZiBtYXRjaD8gYW5kIG1hdGNoLnZhbGlkKClcbiAgX21hdGNoQW55OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICBpZiBvZmZzZXRcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cihvZmZzZXQpXG4gICAgbWF0Y2ggPSBAbWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpXG4gICAgaWYgbWF0Y2g/XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLG1hdGNoLG9mZnNldClcbiAgbWF0Y2hBbnlOYW1lZDogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBfbWF0Y2hBbnlHZXROYW1lKEBtYXRjaEFueSh0ZXh0KSlcbiAgbWF0Y2hBbnlMYXN0OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICB3aGlsZSBtYXRjaCA9IEBtYXRjaEFueSh0ZXh0LG9mZnNldClcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpXG4gICAgICBpZiAhcmVzIG9yIHJlcy5lbmQoKSAhPSBtYXRjaC5lbmQoKVxuICAgICAgICByZXMgPSBtYXRjaFxuICAgIHJldHVybiByZXNcbiAgaWRlbnRpY2FsOiAtPlxuICAgIEBvcGVuZXIgPT0gQGNsb3NlciBvciAoXG4gICAgICBAb3BlbmVyLnNvdXJjZT8gYW5kIFxuICAgICAgQGNsb3Nlci5zb3VyY2U/IGFuZCBcbiAgICAgIEBvcGVuZXIuc291cmNlID09IEBjbG9zZXIuc291cmNlXG4gICAgKVxuICB3cmFwcGVyUG9zOiAocG9zLHRleHQpIC0+XG4gICAgc3RhcnQgPSBAbWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAscG9zLnN0YXJ0KSlcbiAgICBpZiBzdGFydD8gYW5kIChAaWRlbnRpY2FsKCkgb3Igc3RhcnQubmFtZSgpID09ICdvcGVuZXInKVxuICAgICAgZW5kID0gQG1hdGNoQW55KHRleHQscG9zLmVuZClcbiAgICAgIGlmIGVuZD8gYW5kIChAaWRlbnRpY2FsKCkgb3IgZW5kLm5hbWUoKSA9PSAnY2xvc2VyJylcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSxlbmQuZW5kKCkpXG4gICAgICBlbHNlIGlmIEBvcHRpb25uYWxfZW5kXG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksdGV4dC5sZW5ndGgpXG4gIGlzV2FwcGVyT2Y6IChwb3MsdGV4dCkgLT5cbiAgICByZXR1cm4gQHdyYXBwZXJQb3MocG9zLHRleHQpPyIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhaXJNYXRjaFxufSBmcm9tICcuL1BhaXJNYXRjaCc7XG5cbmV4cG9ydCB2YXIgUGFpciA9IGNsYXNzIFBhaXIge1xuICBjb25zdHJ1Y3RvcihvcGVuZXIsIGNsb3Nlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICB0aGlzLm9wZW5lciA9IG9wZW5lcjtcbiAgICB0aGlzLmNsb3NlciA9IGNsb3NlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2UsXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfTtcbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gdGhpcy5vcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMub3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5lclJlZygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub3BlbmVyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm9wZW5lcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuZXI7XG4gICAgfVxuICB9XG5cbiAgY2xvc2VyUmVnKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jbG9zZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY2xvc2VyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NlcjtcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueVBhcnRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvcGVuZXI6IHRoaXMub3BlbmVyUmVnKCksXG4gICAgICBjbG9zZXI6IHRoaXMuY2xvc2VyUmVnKClcbiAgICB9O1xuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0S2V5cygpIHtcbiAgICB2YXIga2V5LCBrZXlzLCByZWYsIHJlZztcbiAgICBrZXlzID0gW107XG4gICAgcmVmID0gdGhpcy5tYXRjaEFueVBhcnRzKCk7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XTtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIG1hdGNoQW55UmVnKCkge1xuICAgIHZhciBncm91cHMsIGtleSwgcmVmLCByZWc7XG4gICAgZ3JvdXBzID0gW107XG4gICAgcmVmID0gdGhpcy5tYXRjaEFueVBhcnRzKCk7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XTtcbiAgICAgIGdyb3Vwcy5wdXNoKCcoJyArIHJlZy5zb3VyY2UgKyAnKScpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChncm91cHMuam9pbignfCcpKTtcbiAgfVxuXG4gIG1hdGNoQW55KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2g7XG4gICAgd2hpbGUgKCgobWF0Y2ggPSB0aGlzLl9tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSAhPSBudWxsKSAmJiAhbWF0Y2gudmFsaWQoKSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKCk7XG4gICAgfVxuICAgIGlmICgobWF0Y2ggIT0gbnVsbCkgJiYgbWF0Y2gudmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgfVxuXG4gIF9tYXRjaEFueSh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoO1xuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cihvZmZzZXQpO1xuICAgIH1cbiAgICBtYXRjaCA9IHRoaXMubWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpO1xuICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLCBtYXRjaCwgb2Zmc2V0KTtcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueU5hbWVkKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF0Y2hBbnlHZXROYW1lKHRoaXMubWF0Y2hBbnkodGV4dCkpO1xuICB9XG5cbiAgbWF0Y2hBbnlMYXN0KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2gsIHJlcztcbiAgICB3aGlsZSAobWF0Y2ggPSB0aGlzLm1hdGNoQW55KHRleHQsIG9mZnNldCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpO1xuICAgICAgaWYgKCFyZXMgfHwgcmVzLmVuZCgpICE9PSBtYXRjaC5lbmQoKSkge1xuICAgICAgICByZXMgPSBtYXRjaDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGlkZW50aWNhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZXIgPT09IHRoaXMuY2xvc2VyIHx8ICgodGhpcy5vcGVuZXIuc291cmNlICE9IG51bGwpICYmICh0aGlzLmNsb3Nlci5zb3VyY2UgIT0gbnVsbCkgJiYgdGhpcy5vcGVuZXIuc291cmNlID09PSB0aGlzLmNsb3Nlci5zb3VyY2UpO1xuICB9XG5cbiAgd3JhcHBlclBvcyhwb3MsIHRleHQpIHtcbiAgICB2YXIgZW5kLCBzdGFydDtcbiAgICBzdGFydCA9IHRoaXMubWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAsIHBvcy5zdGFydCkpO1xuICAgIGlmICgoc3RhcnQgIT0gbnVsbCkgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgc3RhcnQubmFtZSgpID09PSAnb3BlbmVyJykpIHtcbiAgICAgIGVuZCA9IHRoaXMubWF0Y2hBbnkodGV4dCwgcG9zLmVuZCk7XG4gICAgICBpZiAoKGVuZCAhPSBudWxsKSAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBlbmQubmFtZSgpID09PSAnY2xvc2VyJykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgZW5kLmVuZCgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25uYWxfZW5kKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIHRleHQubGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc1dhcHBlck9mKHBvcywgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZXJQb3MocG9zLCB0ZXh0KSAhPSBudWxsO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUGFpck1hdGNoXG4gIGNvbnN0cnVjdG9yOiAoQHBhaXIsQG1hdGNoLEBvZmZzZXQgPSAwKSAtPlxuICBuYW1lOiAtPlxuICAgIGlmIEBtYXRjaFxuICAgICAgdW5sZXNzIF9uYW1lP1xuICAgICAgICBmb3IgZ3JvdXAsIGkgaW4gQG1hdGNoXG4gICAgICAgICAgaWYgaSA+IDAgYW5kIGdyb3VwP1xuICAgICAgICAgICAgX25hbWUgPSBAcGFpci5tYXRjaEFueVBhcnRLZXlzKClbaS0xXVxuICAgICAgICAgICAgcmV0dXJuIF9uYW1lXG4gICAgICAgIF9uYW1lID0gZmFsc2VcbiAgICAgIHJldHVybiBfbmFtZSB8fCBudWxsXG4gIHN0YXJ0OiAtPlxuICAgIEBtYXRjaC5pbmRleCArIEBvZmZzZXRcbiAgZW5kOiAtPlxuICAgIEBtYXRjaC5pbmRleCArIEBtYXRjaFswXS5sZW5ndGggKyBAb2Zmc2V0XG4gIHZhbGlkOiAtPlxuICAgIHJldHVybiAhQHBhaXIudmFsaWRNYXRjaCB8fCBAcGFpci52YWxpZE1hdGNoKHRoaXMpXG4gIGxlbmd0aDogLT5cbiAgICBAbWF0Y2hbMF0ubGVuZ3RoIiwiZXhwb3J0IHZhciBQYWlyTWF0Y2ggPSBjbGFzcyBQYWlyTWF0Y2gge1xuICBjb25zdHJ1Y3RvcihwYWlyLCBtYXRjaCwgb2Zmc2V0ID0gMCkge1xuICAgIHRoaXMucGFpciA9IHBhaXI7XG4gICAgdGhpcy5tYXRjaCA9IG1hdGNoO1xuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICB9XG5cbiAgbmFtZSgpIHtcbiAgICB2YXIgX25hbWUsIGdyb3VwLCBpLCBqLCBsZW4sIHJlZjtcbiAgICBpZiAodGhpcy5tYXRjaCkge1xuICAgICAgaWYgKHR5cGVvZiBfbmFtZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBfbmFtZSA9PT0gbnVsbCkge1xuICAgICAgICByZWYgPSB0aGlzLm1hdGNoO1xuICAgICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICAgIGdyb3VwID0gcmVmW2ldO1xuICAgICAgICAgIGlmIChpID4gMCAmJiAoZ3JvdXAgIT0gbnVsbCkpIHtcbiAgICAgICAgICAgIF9uYW1lID0gdGhpcy5wYWlyLm1hdGNoQW55UGFydEtleXMoKVtpIC0gMV07XG4gICAgICAgICAgICByZXR1cm4gX25hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9uYW1lID0gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gX25hbWUgfHwgbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMub2Zmc2V0O1xuICB9XG5cbiAgZW5kKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoLmluZGV4ICsgdGhpcy5tYXRjaFswXS5sZW5ndGggKyB0aGlzLm9mZnNldDtcbiAgfVxuXG4gIHZhbGlkKCkge1xuICAgIHJldHVybiAhdGhpcy5wYWlyLnZhbGlkTWF0Y2ggfHwgdGhpcy5wYWlyLnZhbGlkTWF0Y2godGhpcyk7XG4gIH1cblxuICBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hbMF0ubGVuZ3RoO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LEBlbmQpIC0+XG4gICAgQGVuZCA9IEBzdGFydCB1bmxlc3MgQGVuZD9cbiAgY29udGFpbnNQdDogKHB0KSAtPlxuICAgIHJldHVybiBAc3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBlbmRcbiAgY29udGFpbnNQb3M6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBzdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGVuZFxuICB3cmFwcGVkQnk6IChwcmVmaXgsc3VmZml4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyhAc3RhcnQtcHJlZml4Lmxlbmd0aCxAc3RhcnQsQGVuZCxAZW5kK3N1ZmZpeC5sZW5ndGgpXG4gIHdpdGhFZGl0b3I6ICh2YWwpLT5cbiAgICBAX2VkaXRvciA9IHZhbFxuICAgIHJldHVybiB0aGlzXG4gIGVkaXRvcjogLT5cbiAgICB1bmxlc3MgQF9lZGl0b3I/XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVkaXRvciBzZXQnKVxuICAgIHJldHVybiBAX2VkaXRvclxuICBoYXNFZGl0b3I6IC0+XG4gICAgcmV0dXJuIEBfZWRpdG9yP1xuICB0ZXh0OiAtPlxuICAgIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBzdGFydCwgQGVuZClcbiAgYXBwbHlPZmZzZXQ6IChvZmZzZXQpLT5cbiAgICBpZiBvZmZzZXQgIT0gMFxuICAgICAgQHN0YXJ0ICs9IG9mZnNldFxuICAgICAgQGVuZCArPSBvZmZzZXRcbiAgICByZXR1cm4gdGhpc1xuICBwcmV2RU9MOiAtPlxuICAgIHVubGVzcyBAX3ByZXZFT0w/XG4gICAgICBAX3ByZXZFT0wgPSBAZWRpdG9yKCkuZmluZExpbmVTdGFydChAc3RhcnQpXG4gICAgcmV0dXJuIEBfcHJldkVPTFxuICBuZXh0RU9MOiAtPlxuICAgIHVubGVzcyBAX25leHRFT0w/XG4gICAgICBAX25leHRFT0wgPSBAZWRpdG9yKCkuZmluZExpbmVFbmQoQGVuZClcbiAgICByZXR1cm4gQF9uZXh0RU9MXG4gIHRleHRXaXRoRnVsbExpbmVzOiAtPlxuICAgIHVubGVzcyBAX3RleHRXaXRoRnVsbExpbmVzP1xuICAgICAgQF90ZXh0V2l0aEZ1bGxMaW5lcyA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBwcmV2RU9MKCksQG5leHRFT0woKSlcbiAgICByZXR1cm4gQF90ZXh0V2l0aEZ1bGxMaW5lc1xuICBzYW1lTGluZXNQcmVmaXg6IC0+XG4gICAgdW5sZXNzIEBfc2FtZUxpbmVzUHJlZml4P1xuICAgICAgQF9zYW1lTGluZXNQcmVmaXggPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAcHJldkVPTCgpLEBzdGFydClcbiAgICByZXR1cm4gQF9zYW1lTGluZXNQcmVmaXhcbiAgc2FtZUxpbmVzU3VmZml4OiAtPlxuICAgIHVubGVzcyBAX3NhbWVMaW5lc1N1ZmZpeD9cbiAgICAgIEBfc2FtZUxpbmVzU3VmZml4ID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQGVuZCxAbmV4dEVPTCgpKVxuICAgIHJldHVybiBAX3NhbWVMaW5lc1N1ZmZpeFxuICBjb3B5OiAtPlxuICAgIHJlcyA9IG5ldyBQb3MoQHN0YXJ0LEBlbmQpXG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICByZXMud2l0aEVkaXRvcihAZWRpdG9yKCkpXG4gICAgcmV0dXJuIHJlc1xuICByYXc6IC0+XG4gICAgW0BzdGFydCxAZW5kXSIsImV4cG9ydCB2YXIgUG9zID0gY2xhc3MgUG9zIHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGVuZCkge1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICBpZiAodGhpcy5lbmQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5lbmQgPSB0aGlzLnN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIGNvbnRhaW5zUHQocHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmVuZDtcbiAgfVxuXG4gIGNvbnRhaW5zUG9zKHBvcykge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuZW5kO1xuICB9XG5cbiAgd3JhcHBlZEJ5KHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3Mud3JhcENsYXNzKHRoaXMuc3RhcnQgLSBwcmVmaXgubGVuZ3RoLCB0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5lbmQgKyBzdWZmaXgubGVuZ3RoKTtcbiAgfVxuXG4gIHdpdGhFZGl0b3IodmFsKSB7XG4gICAgdGhpcy5fZWRpdG9yID0gdmFsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZWRpdG9yKCkge1xuICAgIGlmICh0aGlzLl9lZGl0b3IgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0Jyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lZGl0b3I7XG4gIH1cblxuICBoYXNFZGl0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvciAhPSBudWxsO1xuICB9XG5cbiAgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgfVxuXG4gIGFwcGx5T2Zmc2V0KG9mZnNldCkge1xuICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHByZXZFT0woKSB7XG4gICAgaWYgKHRoaXMuX3ByZXZFT0wgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcHJldkVPTCA9IHRoaXMuZWRpdG9yKCkuZmluZExpbmVTdGFydCh0aGlzLnN0YXJ0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ByZXZFT0w7XG4gIH1cblxuICBuZXh0RU9MKCkge1xuICAgIGlmICh0aGlzLl9uZXh0RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX25leHRFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lRW5kKHRoaXMuZW5kKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25leHRFT0w7XG4gIH1cblxuICB0ZXh0V2l0aEZ1bGxMaW5lcygpIHtcbiAgICBpZiAodGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RleHRXaXRoRnVsbExpbmVzO1xuICB9XG5cbiAgc2FtZUxpbmVzUHJlZml4KCkge1xuICAgIGlmICh0aGlzLl9zYW1lTGluZXNQcmVmaXggPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2FtZUxpbmVzUHJlZml4ID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMucHJldkVPTCgpLCB0aGlzLnN0YXJ0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NhbWVMaW5lc1ByZWZpeDtcbiAgfVxuXG4gIHNhbWVMaW5lc1N1ZmZpeCgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzU3VmZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLmVuZCwgdGhpcy5uZXh0RU9MKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzU3VmZml4O1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBQb3ModGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICByZXMud2l0aEVkaXRvcih0aGlzLmVkaXRvcigpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHJhdygpIHtcbiAgICByZXR1cm4gW3RoaXMuc3RhcnQsIHRoaXMuZW5kXTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgV3JhcHBpbmcgfSBmcm9tICcuL1dyYXBwaW5nJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBDb21tb25IZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBQb3NDb2xsZWN0aW9uXG4gIGNvbnN0cnVjdG9yOiAoYXJyKSAtPlxuICAgIGlmICFBcnJheS5pc0FycmF5KGFycilcbiAgICAgIGFyciA9IFthcnJdXG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFycixbUG9zQ29sbGVjdGlvbl0pXG4gICAgcmV0dXJuIGFyclxuICAgIFxuICB3cmFwOiAocHJlZml4LHN1ZmZpeCktPlxuICAgICAgcmV0dXJuIEBtYXAoIChwKSAtPiBuZXcgV3JhcHBpbmcocC5zdGFydCwgcC5lbmQsIHByZWZpeCwgc3VmZml4KSlcbiAgcmVwbGFjZTogKHR4dCktPlxuICAgICAgcmV0dXJuIEBtYXAoIChwKSAtPiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dCkpIiwiaW1wb3J0IHtcbiAgV3JhcHBpbmdcbn0gZnJvbSAnLi9XcmFwcGluZyc7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuXG5pbXBvcnQge1xuICBDb21tb25IZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5leHBvcnQgdmFyIFBvc0NvbGxlY3Rpb24gPSBjbGFzcyBQb3NDb2xsZWN0aW9uIHtcbiAgY29uc3RydWN0b3IoYXJyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIGFyciA9IFthcnJdO1xuICAgIH1cbiAgICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoYXJyLCBbUG9zQ29sbGVjdGlvbl0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICB3cmFwKHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBuZXcgV3JhcHBpbmcocC5zdGFydCwgcC5lbmQsIHByZWZpeCwgc3VmZml4KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcGxhY2UodHh0KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dCk7XG4gICAgfSk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcbmltcG9ydCB7IENvbW1vbkhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcbmltcG9ydCB7IE9wdGlvbk9iamVjdCB9IGZyb20gJy4uL09wdGlvbk9iamVjdCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBSZXBsYWNlbWVudCBleHRlbmRzIFBvc1xuICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnModGhpcy5wcm90b3R5cGUsW09wdGlvbk9iamVjdF0pXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LCBAZW5kLCBAdGV4dCwgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBzdXBlcigpXG4gICAgQHNldE9wdHMoQG9wdGlvbnMse1xuICAgICAgcHJlZml4OiAnJ1xuICAgICAgc3VmZml4OiAnJ1xuICAgICAgc2VsZWN0aW9uczogW11cbiAgICB9KVxuICByZXNQb3NCZWZvcmVQcmVmaXg6IC0+XG4gICAgcmV0dXJuIEBzdGFydCtAcHJlZml4Lmxlbmd0aCtAdGV4dC5sZW5ndGhcbiAgcmVzRW5kOiAtPiBcbiAgICByZXR1cm4gQHN0YXJ0K0BmaW5hbFRleHQoKS5sZW5ndGhcbiAgYXBwbHk6IC0+XG4gICAgQGVkaXRvcigpLnNwbGljZVRleHQoQHN0YXJ0LCBAZW5kLCBAZmluYWxUZXh0KCkpXG4gIG5lY2Vzc2FyeTogLT5cbiAgICByZXR1cm4gQGZpbmFsVGV4dCgpICE9IEBvcmlnaW5hbFRleHQoKVxuICBvcmlnaW5hbFRleHQ6IC0+XG4gICAgcmV0dXJuIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBzdGFydCwgQGVuZClcbiAgZmluYWxUZXh0OiAtPlxuICAgIHJldHVybiBAcHJlZml4K0B0ZXh0K0BzdWZmaXhcbiAgb2Zmc2V0QWZ0ZXI6ICgpIC0+IFxuICAgIHJldHVybiBAZmluYWxUZXh0KCkubGVuZ3RoIC0gKEBlbmQgLSBAc3RhcnQpXG4gIGFwcGx5T2Zmc2V0OiAob2Zmc2V0KS0+XG4gICAgaWYgb2Zmc2V0ICE9IDBcbiAgICAgIEBzdGFydCArPSBvZmZzZXRcbiAgICAgIEBlbmQgKz0gb2Zmc2V0XG4gICAgICBmb3Igc2VsIGluIEBzZWxlY3Rpb25zXG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgICByZXR1cm4gdGhpc1xuICBzZWxlY3RDb250ZW50OiAtPiBcbiAgICBAc2VsZWN0aW9ucyA9IFtuZXcgUG9zKEBwcmVmaXgubGVuZ3RoK0BzdGFydCwgQHByZWZpeC5sZW5ndGgrQHN0YXJ0K0B0ZXh0Lmxlbmd0aCldXG4gICAgcmV0dXJuIHRoaXNcbiAgY2FycmV0VG9TZWw6IC0+XG4gICAgQHNlbGVjdGlvbnMgPSBbXVxuICAgIHRleHQgPSBAZmluYWxUZXh0KClcbiAgICBAcHJlZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAcHJlZml4KVxuICAgIEB0ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAdGV4dClcbiAgICBAc3VmZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAc3VmZml4KVxuICAgIHN0YXJ0ID0gQHN0YXJ0XG4gICAgXG4gICAgd2hpbGUgKHJlcyA9IFN0cmluZ0hlbHBlci5nZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0ZXh0KSk/XG4gICAgICBbcG9zLHRleHRdID0gcmVzXG4gICAgICBAc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3Moc3RhcnQrcG9zLCBzdGFydCtwb3MpKVxuICAgICAgXG4gICAgcmV0dXJuIHRoaXNcbiAgY29weTogLT4gXG4gICAgcmVzID0gbmV3IFJlcGxhY2VtZW50KEBzdGFydCwgQGVuZCwgQHRleHQsIEBnZXRPcHRzKCkpXG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICByZXMud2l0aEVkaXRvcihAZWRpdG9yKCkpXG4gICAgcmVzLnNlbGVjdGlvbnMgPSBAc2VsZWN0aW9ucy5tYXAoIChzKS0+cy5jb3B5KCkgKVxuICAgIHJldHVybiByZXMiLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5pbXBvcnQge1xuICBDb21tb25IZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5pbXBvcnQge1xuICBPcHRpb25PYmplY3Rcbn0gZnJvbSAnLi4vT3B0aW9uT2JqZWN0JztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuZXhwb3J0IHZhciBSZXBsYWNlbWVudCA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgUmVwbGFjZW1lbnQgZXh0ZW5kcyBQb3Mge1xuICAgIGNvbnN0cnVjdG9yKHN0YXJ0MSwgZW5kLCB0ZXh0MSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0MTtcbiAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgICAgdGhpcy50ZXh0ID0gdGV4dDE7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucywge1xuICAgICAgICBwcmVmaXg6ICcnLFxuICAgICAgICBzdWZmaXg6ICcnLFxuICAgICAgICBzZWxlY3Rpb25zOiBbXVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVzUG9zQmVmb3JlUHJlZml4KCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnRleHQubGVuZ3RoO1xuICAgIH1cblxuICAgIHJlc0VuZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5maW5hbFRleHQoKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgYXBwbHkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS5zcGxpY2VUZXh0KHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLmZpbmFsVGV4dCgpKTtcbiAgICB9XG5cbiAgICBuZWNlc3NhcnkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKSAhPT0gdGhpcy5vcmlnaW5hbFRleHQoKTtcbiAgICB9XG5cbiAgICBvcmlnaW5hbFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICB9XG5cbiAgICBmaW5hbFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLnRleHQgKyB0aGlzLnN1ZmZpeDtcbiAgICB9XG5cbiAgICBvZmZzZXRBZnRlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmFsVGV4dCgpLmxlbmd0aCAtICh0aGlzLmVuZCAtIHRoaXMuc3RhcnQpO1xuICAgIH1cblxuICAgIGFwcGx5T2Zmc2V0KG9mZnNldCkge1xuICAgICAgdmFyIGksIGxlbiwgcmVmLCBzZWw7XG4gICAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgICB0aGlzLmVuZCArPSBvZmZzZXQ7XG4gICAgICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9ucztcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgc2VsID0gcmVmW2ldO1xuICAgICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXQ7XG4gICAgICAgICAgc2VsLmVuZCArPSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNlbGVjdENvbnRlbnQoKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyh0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0LCB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0ICsgdGhpcy50ZXh0Lmxlbmd0aCldO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2FycmV0VG9TZWwoKSB7XG4gICAgICB2YXIgcG9zLCByZXMsIHN0YXJ0LCB0ZXh0O1xuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW107XG4gICAgICB0ZXh0ID0gdGhpcy5maW5hbFRleHQoKTtcbiAgICAgIHRoaXMucHJlZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnByZWZpeCk7XG4gICAgICB0aGlzLnRleHQgPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMudGV4dCk7XG4gICAgICB0aGlzLnN1ZmZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5zdWZmaXgpO1xuICAgICAgc3RhcnQgPSB0aGlzLnN0YXJ0O1xuICAgICAgd2hpbGUgKChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgW3BvcywgdGV4dF0gPSByZXM7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3Moc3RhcnQgKyBwb3MsIHN0YXJ0ICsgcG9zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgdmFyIHJlcztcbiAgICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy50ZXh0LCB0aGlzLmdldE9wdHMoKSk7XG4gICAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgICByZXMud2l0aEVkaXRvcih0aGlzLmVkaXRvcigpKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZWxlY3Rpb25zID0gdGhpcy5zZWxlY3Rpb25zLm1hcChmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiBzLmNvcHkoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgfTtcblxuICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoUmVwbGFjZW1lbnQucHJvdG90eXBlLCBbT3B0aW9uT2JqZWN0XSk7XG5cbiAgcmV0dXJuIFJlcGxhY2VtZW50O1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiZXhwb3J0IGNsYXNzIFNpemVcbiAgY29uc3RydWN0b3I6IChAd2lkdGgsQGhlaWdodCkgLT4iLCJleHBvcnQgY2xhc3MgU3RyUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHBvcyxAc3RyKSAtPlxuICBlbmQ6IC0+XG4gICAgQHBvcyArIEBzdHIubGVuZ3RoIiwiZXhwb3J0IHZhciBTdHJQb3MgPSBjbGFzcyBTdHJQb3Mge1xuICBjb25zdHJ1Y3Rvcihwb3MsIHN0cikge1xuICAgIHRoaXMucG9zID0gcG9zO1xuICAgIHRoaXMuc3RyID0gc3RyO1xuICB9XG5cbiAgZW5kKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aDtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuXG5leHBvcnQgY2xhc3MgV3JhcHBlZFBvcyBleHRlbmRzIFBvc1xuICBjb25zdHJ1Y3RvcjogKEBzdGFydCxAaW5uZXJTdGFydCxAaW5uZXJFbmQsQGVuZCkgLT5cbiAgICBzdXBlcigpXG4gIGlubmVyQ29udGFpbnNQdDogKHB0KSAtPlxuICAgIHJldHVybiBAaW5uZXJTdGFydCA8PSBwdCBhbmQgcHQgPD0gQGlubmVyRW5kXG4gIGlubmVyQ29udGFpbnNQb3M6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBpbm5lclN0YXJ0IDw9IHBvcy5zdGFydCBhbmQgcG9zLmVuZCA8PSBAaW5uZXJFbmRcbiAgaW5uZXJUZXh0OiAtPlxuICAgIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBpbm5lclN0YXJ0LCBAaW5uZXJFbmQpXG4gIHNldElubmVyTGVuOiAobGVuKSAtPlxuICAgIEBtb3ZlU3VmaXgoQGlubmVyU3RhcnQgKyBsZW4pXG4gIG1vdmVTdWZmaXg6IChwdCkgLT5cbiAgICBzdWZmaXhMZW4gPSBAZW5kIC0gQGlubmVyRW5kXG4gICAgQGlubmVyRW5kID0gcHRcbiAgICBAZW5kID0gQGlubmVyRW5kICsgc3VmZml4TGVuXG4gIGNvcHk6IC0+XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKEBzdGFydCxAaW5uZXJTdGFydCxAaW5uZXJFbmQsQGVuZCkiLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5leHBvcnQgdmFyIFdyYXBwZWRQb3MgPSBjbGFzcyBXcmFwcGVkUG9zIGV4dGVuZHMgUG9zIHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGlubmVyU3RhcnQsIGlubmVyRW5kLCBlbmQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmlubmVyU3RhcnQgPSBpbm5lclN0YXJ0O1xuICAgIHRoaXMuaW5uZXJFbmQgPSBpbm5lckVuZDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQdChwdCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5pbm5lckVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQb3MocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmlubmVyRW5kO1xuICB9XG5cbiAgaW5uZXJUZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kKTtcbiAgfVxuXG4gIHNldElubmVyTGVuKGxlbikge1xuICAgIHJldHVybiB0aGlzLm1vdmVTdWZpeCh0aGlzLmlubmVyU3RhcnQgKyBsZW4pO1xuICB9XG5cbiAgbW92ZVN1ZmZpeChwdCkge1xuICAgIHZhciBzdWZmaXhMZW47XG4gICAgc3VmZml4TGVuID0gdGhpcy5lbmQgLSB0aGlzLmlubmVyRW5kO1xuICAgIHRoaXMuaW5uZXJFbmQgPSBwdDtcbiAgICByZXR1cm4gdGhpcy5lbmQgPSB0aGlzLmlubmVyRW5kICsgc3VmZml4TGVuO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICByZXR1cm4gbmV3IFdyYXBwZWRQb3ModGhpcy5zdGFydCwgdGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kLCB0aGlzLmVuZCk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCBjbGFzcyBXcmFwcGluZyBleHRlbmRzIFJlcGxhY2VtZW50XG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LCBAZW5kLCBwcmVmaXggPScnLCBzdWZmaXggPSAnJywgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBzdXBlcigpXG4gICAgQHNldE9wdHMoQG9wdGlvbnMpXG4gICAgQHRleHQgPSAnJ1xuICAgIEBwcmVmaXggPSBwcmVmaXhcbiAgICBAc3VmZml4ID0gc3VmZml4XG4gIGFwcGx5OiAtPlxuICAgIEBhZGp1c3RTZWwoKVxuICAgIHN1cGVyKClcbiAgYWRqdXN0U2VsOiAtPlxuICAgIG9mZnNldCA9IEBvcmlnaW5hbFRleHQoKS5sZW5ndGhcbiAgICBmb3Igc2VsIGluIEBzZWxlY3Rpb25zXG4gICAgICBpZiBzZWwuc3RhcnQgPiBAc3RhcnQrQHByZWZpeC5sZW5ndGhcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgaWYgc2VsLmVuZCA+PSBAc3RhcnQrQHByZWZpeC5sZW5ndGhcbiAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgZmluYWxUZXh0OiAtPlxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgdGV4dCA9IEBvcmlnaW5hbFRleHQoKVxuICAgIGVsc2VcbiAgICAgIHRleHQgPSAnJ1xuICAgIHJldHVybiBAcHJlZml4K3RleHQrQHN1ZmZpeFxuICBvZmZzZXRBZnRlcjogKCkgLT4gXG4gICAgcmV0dXJuIEBwcmVmaXgubGVuZ3RoK0BzdWZmaXgubGVuZ3RoXG4gICAgICAgICAgXG4gIGNvcHk6IC0+IFxuICAgIHJlcyA9IG5ldyBXcmFwcGluZyhAc3RhcnQsIEBlbmQsIEBwcmVmaXgsIEBzdWZmaXgpXG4gICAgcmVzLnNlbGVjdGlvbnMgPSBAc2VsZWN0aW9ucy5tYXAoIChzKS0+cy5jb3B5KCkgKVxuICAgIHJldHVybiByZXMiLCJpbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IHZhciBXcmFwcGluZyA9IGNsYXNzIFdyYXBwaW5nIGV4dGVuZHMgUmVwbGFjZW1lbnQge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgZW5kLCBwcmVmaXggPSAnJywgc3VmZml4ID0gJycsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy50ZXh0ID0gJyc7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXg7XG4gICAgdGhpcy5zdWZmaXggPSBzdWZmaXg7XG4gIH1cblxuICBhcHBseSgpIHtcbiAgICB0aGlzLmFkanVzdFNlbCgpO1xuICAgIHJldHVybiBzdXBlci5hcHBseSgpO1xuICB9XG5cbiAgYWRqdXN0U2VsKCkge1xuICAgIHZhciBpLCBsZW4sIG9mZnNldCwgcmVmLCByZXN1bHRzLCBzZWw7XG4gICAgb2Zmc2V0ID0gdGhpcy5vcmlnaW5hbFRleHQoKS5sZW5ndGg7XG4gICAgcmVmID0gdGhpcy5zZWxlY3Rpb25zO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNlbCA9IHJlZltpXTtcbiAgICAgIGlmIChzZWwuc3RhcnQgPiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXQ7XG4gICAgICB9XG4gICAgICBpZiAoc2VsLmVuZCA+PSB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChzZWwuZW5kICs9IG9mZnNldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBmaW5hbFRleHQoKSB7XG4gICAgdmFyIHRleHQ7XG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHRleHQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gJyc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRleHQgKyB0aGlzLnN1ZmZpeDtcbiAgfVxuXG4gIG9mZnNldEFmdGVyKCkge1xuICAgIHJldHVybiB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN1ZmZpeC5sZW5ndGg7XG4gIH1cblxuICBjb3B5KCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gbmV3IFdyYXBwaW5nKHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnByZWZpeCwgdGhpcy5zdWZmaXgpO1xuICAgIHJlcy5zZWxlY3Rpb25zID0gdGhpcy5zZWxlY3Rpb25zLm1hcChmdW5jdGlvbihzKSB7XG4gICAgICByZXR1cm4gcy5jb3B5KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlRW5naW5lXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBpZiBsb2NhbFN0b3JhZ2U/XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShAZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKVxuICBzYXZlSW5QYXRoOiAocGF0aCwga2V5LCB2YWwpIC0+XG4gICAgZGF0YSA9IEBsb2FkKHBhdGgpXG4gICAgdW5sZXNzIGRhdGE/XG4gICAgICBkYXRhID0ge31cbiAgICBkYXRhW2tleV0gPSB2YWxcbiAgICBAc2F2ZShwYXRoLGRhdGEpXG4gIGxvYWQ6IChrZXkpIC0+XG4gICAgaWYgbG9jYWxTdG9yYWdlP1xuICAgICAgSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShAZnVsbEtleShrZXkpKSlcbiAgZnVsbEtleTogKGtleSkgLT5cbiAgICAnQ29kZVdhdmVfJytrZXkiLCJleHBvcnQgdmFyIExvY2FsU3RvcmFnZUVuZ2luZSA9IGNsYXNzIExvY2FsU3RvcmFnZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBzYXZlKGtleSwgdmFsKSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5mdWxsS2V5KGtleSksIEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0gdGhpcy5sb2FkKHBhdGgpO1xuICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICB9XG4gICAgZGF0YVtrZXldID0gdmFsO1xuICAgIHJldHVybiB0aGlzLnNhdmUocGF0aCwgZGF0YSk7XG4gIH1cblxuICBsb2FkKGtleSkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5mdWxsS2V5KGtleSkpKTtcbiAgICB9XG4gIH1cblxuICBmdWxsS2V5KGtleSkge1xuICAgIHJldHVybiAnQ29kZVdhdmVfJyArIGtleTtcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgQ29udGV4dFxuICBjb25zdHJ1Y3RvcjogKEBwYXJzZXIsIEBwYXJlbnQpIC0+XG4gICAgQGNvbnRlbnQgPSBcIlwiXG5cbiAgb25TdGFydDogLT5cbiAgICBAc3RhcnRBdCA9IEBwYXJzZXIucG9zXG5cbiAgb25DaGFyOiAoY2hhciktPlxuXG4gIGVuZDogLT5cbiAgICBAcGFyc2VyLnNldENvbnRleHQoQHBhcmVudClcblxuICBvbkVuZDogLT5cblxuICB0ZXN0Q29udGV4dDogKGNvbnRleHRUeXBlKS0+XG4gICAgaWYgY29udGV4dFR5cGUudGVzdChAcGFyc2VyLmNoYXIsIHRoaXMpXG4gICAgICBAcGFyc2VyLnNldENvbnRleHQobmV3IGNvbnRleHRUeXBlKEBwYXJzZXIsdGhpcykpXG5cbiAgQHRlc3Q6IC0+IGZhbHNlXG4iLCJleHBvcnQgdmFyIENvbnRleHQgPSBjbGFzcyBDb250ZXh0IHtcbiAgY29uc3RydWN0b3IocGFyc2VyLCBwYXJlbnQpIHtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlcjtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLmNvbnRlbnQgPSBcIlwiO1xuICB9XG5cbiAgb25TdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydEF0ID0gdGhpcy5wYXJzZXIucG9zO1xuICB9XG5cbiAgb25DaGFyKGNoYXIpIHt9XG5cbiAgZW5kKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5zZXRDb250ZXh0KHRoaXMucGFyZW50KTtcbiAgfVxuXG4gIG9uRW5kKCkge31cblxuICB0ZXN0Q29udGV4dChjb250ZXh0VHlwZSkge1xuICAgIGlmIChjb250ZXh0VHlwZS50ZXN0KHRoaXMucGFyc2VyLmNoYXIsIHRoaXMpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2V0Q29udGV4dChuZXcgY29udGV4dFR5cGUodGhpcy5wYXJzZXIsIHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdGVzdCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgRXNjYXBlQ29udGV4dCBleHRlbmRzIENvbnRleHRcbiAgb25DaGFyOiAoY2hhciktPlxuICAgIEBwYXJlbnQuY29udGVudCArPSBjaGFyXG4gICAgQGVuZCgpXG5cbiAgQHRlc3Q6IChjaGFyKS0+XG4gICAgY2hhciA9PSAnXFxcXCciLCJpbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmV4cG9ydCB2YXIgRXNjYXBlQ29udGV4dCA9IGNsYXNzIEVzY2FwZUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25DaGFyKGNoYXIpIHtcbiAgICB0aGlzLnBhcmVudC5jb250ZW50ICs9IGNoYXI7XG4gICAgcmV0dXJuIHRoaXMuZW5kKCk7XG4gIH1cblxuICBzdGF0aWMgdGVzdChjaGFyKSB7XG4gICAgcmV0dXJuIGNoYXIgPT09ICdcXFxcJztcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUGFyYW1Db250ZXh0IH0gZnJvbSAnLi9QYXJhbUNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgTmFtZWRDb250ZXh0IGV4dGVuZHMgUGFyYW1Db250ZXh0XG4gIG9uU3RhcnQ6ICgpLT5cbiAgICBAbmFtZSA9IEBwYXJlbnQuY29udGVudFxuXG4gIG9uRW5kOiAtPlxuICAgIEBwYXJzZXIubmFtZWRbQG5hbWVdID0gQGNvbnRlbnRcblxuICBAdGVzdDogKGNoYXIscGFyZW50KS0+XG4gICAgY2hhciA9PSAnOicgYW5kICghcGFyZW50LnBhcnNlci5vcHRpb25zLmFsbG93ZWROYW1lZD8gb3IgcGFyZW50LmNvbnRlbnQgaW4gcGFyZW50LnBhcnNlci5vcHRpb25zLmFsbG93ZWROYW1lZClcbiIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgUGFyYW1Db250ZXh0XG59IGZyb20gJy4vUGFyYW1Db250ZXh0JztcblxuZXhwb3J0IHZhciBOYW1lZENvbnRleHQgPSBjbGFzcyBOYW1lZENvbnRleHQgZXh0ZW5kcyBQYXJhbUNvbnRleHQge1xuICBvblN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLm5hbWUgPSB0aGlzLnBhcmVudC5jb250ZW50O1xuICB9XG5cbiAgb25FbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VyLm5hbWVkW3RoaXMubmFtZV0gPSB0aGlzLmNvbnRlbnQ7XG4gIH1cblxuICBzdGF0aWMgdGVzdChjaGFyLCBwYXJlbnQpIHtcbiAgICB2YXIgcmVmO1xuICAgIHJldHVybiBjaGFyID09PSAnOicgJiYgKChwYXJlbnQucGFyc2VyLm9wdGlvbnMuYWxsb3dlZE5hbWVkID09IG51bGwpIHx8IChyZWYgPSBwYXJlbnQuY29udGVudCwgaW5kZXhPZi5jYWxsKHBhcmVudC5wYXJzZXIub3B0aW9ucy5hbGxvd2VkTmFtZWQsIHJlZikgPj0gMCkpO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFN0cmluZ0NvbnRleHQgfSBmcm9tICcuL1N0cmluZ0NvbnRleHQnO1xuaW1wb3J0IHsgVmFyaWFibGVDb250ZXh0IH0gZnJvbSAnLi9WYXJpYWJsZUNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgUGFyYW1Db250ZXh0IGV4dGVuZHMgQ29udGV4dFxuICBvbkNoYXI6IChjaGFyKS0+XG4gICAgaWYgQHRlc3RDb250ZXh0KFN0cmluZ0NvbnRleHQpXG4gICAgZWxzZSBpZiBAdGVzdENvbnRleHQoUGFyYW1Db250ZXh0Lm5hbWVkKVxuICAgIGVsc2UgaWYgQHRlc3RDb250ZXh0KFZhcmlhYmxlQ29udGV4dClcbiAgICBlbHNlIGlmIGNoYXIgPT0gJyAnXG4gICAgICBAcGFyc2VyLnNldENvbnRleHQobmV3IFBhcmFtQ29udGV4dChAcGFyc2VyKSlcbiAgICBlbHNlXG4gICAgICBAY29udGVudCArPSBjaGFyXG5cbiAgb25FbmQ6IC0+XG4gICAgQHBhcnNlci5wYXJhbXMucHVzaChAY29udGVudCkiLCJpbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0NvbnRleHRcbn0gZnJvbSAnLi9TdHJpbmdDb250ZXh0JztcblxuaW1wb3J0IHtcbiAgVmFyaWFibGVDb250ZXh0XG59IGZyb20gJy4vVmFyaWFibGVDb250ZXh0JztcblxuZXhwb3J0IHZhciBQYXJhbUNvbnRleHQgPSBjbGFzcyBQYXJhbUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25DaGFyKGNoYXIpIHtcbiAgICBpZiAodGhpcy50ZXN0Q29udGV4dChTdHJpbmdDb250ZXh0KSkge1xuXG4gICAgfSBlbHNlIGlmICh0aGlzLnRlc3RDb250ZXh0KFBhcmFtQ29udGV4dC5uYW1lZCkpIHtcblxuICAgIH0gZWxzZSBpZiAodGhpcy50ZXN0Q29udGV4dChWYXJpYWJsZUNvbnRleHQpKSB7XG5cbiAgICB9IGVsc2UgaWYgKGNoYXIgPT09ICcgJykge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLnNldENvbnRleHQobmV3IFBhcmFtQ29udGV4dCh0aGlzLnBhcnNlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ICs9IGNoYXI7XG4gICAgfVxuICB9XG5cbiAgb25FbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VyLnBhcmFtcy5wdXNoKHRoaXMuY29udGVudCk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBhcmFtQ29udGV4dCB9IGZyb20gJy4vUGFyYW1Db250ZXh0JztcbmltcG9ydCB7IE5hbWVkQ29udGV4dCB9IGZyb20gJy4vTmFtZWRDb250ZXh0JztcblxuUGFyYW1Db250ZXh0Lm5hbWVkID0gTmFtZWRDb250ZXh0XG5cbmV4cG9ydCBjbGFzcyBQYXJhbVBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEBwYXJhbVN0cmluZywgQG9wdGlvbnM9e30pIC0+XG4gICAgQHBhcnNlKClcblxuICBzZXRDb250ZXh0OiAoY29udGV4dCktPlxuICAgIG9sZENvbnRleHQgPSBAY29udGV4dFxuICAgIEBjb250ZXh0ID0gY29udGV4dFxuICAgIGlmIG9sZENvbnRleHQ/IGFuZCBvbGRDb250ZXh0ICE9IGNvbnRleHQ/LnBhcmVudFxuICAgICAgb2xkQ29udGV4dC5vbkVuZCgpXG4gICAgaWYgY29udGV4dD9cbiAgICAgIGNvbnRleHQub25TdGFydCgpXG4gICAgQGNvbnRleHRcblxuICBwYXJzZTogLT5cbiAgICBAcGFyYW1zID0gW11cbiAgICBAbmFtZWQgPSB7fVxuICAgIGlmIEBwYXJhbVN0cmluZy5sZW5ndGhcbiAgICAgIEBzZXRDb250ZXh0KG5ldyBQYXJhbUNvbnRleHQodGhpcykpXG4gICAgICBAcG9zID0gMFxuICAgICAgd2hpbGUgQHBvcyA8IEBwYXJhbVN0cmluZy5sZW5ndGhcbiAgICAgICAgQGNoYXIgPSBAcGFyYW1TdHJpbmdbQHBvc11cbiAgICAgICAgQGNvbnRleHQub25DaGFyKEBjaGFyKVxuICAgICAgICBAcG9zKytcbiAgICAgIEBzZXRDb250ZXh0KG51bGwpXG5cbiAgdGFrZToobmIpLT5cbiAgICBAcGFyYW1TdHJpbmcuc3Vic3RyaW5nKEBwb3MsIEBwb3MgKyBuYilcblxuICBza2lwOihuYj0xKS0+XG4gICAgQHBvcyArPSBuYlxuXG4gICAgICBcbiIsImltcG9ydCB7XG4gIFBhcmFtQ29udGV4dFxufSBmcm9tICcuL1BhcmFtQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIE5hbWVkQ29udGV4dFxufSBmcm9tICcuL05hbWVkQ29udGV4dCc7XG5cblBhcmFtQ29udGV4dC5uYW1lZCA9IE5hbWVkQ29udGV4dDtcblxuZXhwb3J0IHZhciBQYXJhbVBhcnNlciA9IGNsYXNzIFBhcmFtUGFyc2VyIHtcbiAgY29uc3RydWN0b3IocGFyYW1TdHJpbmcsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMucGFyYW1TdHJpbmcgPSBwYXJhbVN0cmluZztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMucGFyc2UoKTtcbiAgfVxuXG4gIHNldENvbnRleHQoY29udGV4dCkge1xuICAgIHZhciBvbGRDb250ZXh0O1xuICAgIG9sZENvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICBpZiAoKG9sZENvbnRleHQgIT0gbnVsbCkgJiYgb2xkQ29udGV4dCAhPT0gKGNvbnRleHQgIT0gbnVsbCA/IGNvbnRleHQucGFyZW50IDogdm9pZCAwKSkge1xuICAgICAgb2xkQ29udGV4dC5vbkVuZCgpO1xuICAgIH1cbiAgICBpZiAoY29udGV4dCAhPSBudWxsKSB7XG4gICAgICBjb250ZXh0Lm9uU3RhcnQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dDtcbiAgfVxuXG4gIHBhcnNlKCkge1xuICAgIHRoaXMucGFyYW1zID0gW107XG4gICAgdGhpcy5uYW1lZCA9IHt9O1xuICAgIGlmICh0aGlzLnBhcmFtU3RyaW5nLmxlbmd0aCkge1xuICAgICAgdGhpcy5zZXRDb250ZXh0KG5ldyBQYXJhbUNvbnRleHQodGhpcykpO1xuICAgICAgdGhpcy5wb3MgPSAwO1xuICAgICAgd2hpbGUgKHRoaXMucG9zIDwgdGhpcy5wYXJhbVN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jaGFyID0gdGhpcy5wYXJhbVN0cmluZ1t0aGlzLnBvc107XG4gICAgICAgIHRoaXMuY29udGV4dC5vbkNoYXIodGhpcy5jaGFyKTtcbiAgICAgICAgdGhpcy5wb3MrKztcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNldENvbnRleHQobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgdGFrZShuYikge1xuICAgIHJldHVybiB0aGlzLnBhcmFtU3RyaW5nLnN1YnN0cmluZyh0aGlzLnBvcywgdGhpcy5wb3MgKyBuYik7XG4gIH1cblxuICBza2lwKG5iID0gMSkge1xuICAgIHJldHVybiB0aGlzLnBvcyArPSBuYjtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBFc2NhcGVDb250ZXh0IH0gZnJvbSAnLi9Fc2NhcGVDb250ZXh0JztcbmltcG9ydCB7IFZhcmlhYmxlQ29udGV4dCB9IGZyb20gJy4vVmFyaWFibGVDb250ZXh0JztcblxuZXhwb3J0IGNsYXNzIFN0cmluZ0NvbnRleHQgZXh0ZW5kcyBDb250ZXh0XG4gIG9uQ2hhcjogKGNoYXIpLT5cbiAgICBpZiBAdGVzdENvbnRleHQoRXNjYXBlQ29udGV4dClcbiAgICBlbHNlIGlmIEB0ZXN0Q29udGV4dChWYXJpYWJsZUNvbnRleHQpXG4gICAgZWxzZSBpZiBTdHJpbmdDb250ZXh0LmlzRGVsaW1pdGVyKGNoYXIpXG4gICAgICBAZW5kKClcbiAgICBlbHNlXG4gICAgICBAY29udGVudCArPSBjaGFyXG5cbiAgb25FbmQ6IC0+XG4gICAgQHBhcmVudC5jb250ZW50ICs9IEBjb250ZW50XG5cbiAgQHRlc3Q6IChjaGFyKS0+XG4gICAgQGlzRGVsaW1pdGVyKGNoYXIpXG5cbiAgQGlzRGVsaW1pdGVyOiAgKGNoYXIpLT5cbiAgICBjaGFyIGluIFsnXCInLFwiJ1wiXSIsImltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgRXNjYXBlQ29udGV4dFxufSBmcm9tICcuL0VzY2FwZUNvbnRleHQnO1xuXG5pbXBvcnQge1xuICBWYXJpYWJsZUNvbnRleHRcbn0gZnJvbSAnLi9WYXJpYWJsZUNvbnRleHQnO1xuXG5leHBvcnQgdmFyIFN0cmluZ0NvbnRleHQgPSBjbGFzcyBTdHJpbmdDb250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uQ2hhcihjaGFyKSB7XG4gICAgaWYgKHRoaXMudGVzdENvbnRleHQoRXNjYXBlQ29udGV4dCkpIHtcblxuICAgIH0gZWxzZSBpZiAodGhpcy50ZXN0Q29udGV4dChWYXJpYWJsZUNvbnRleHQpKSB7XG5cbiAgICB9IGVsc2UgaWYgKFN0cmluZ0NvbnRleHQuaXNEZWxpbWl0ZXIoY2hhcikpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ICs9IGNoYXI7XG4gICAgfVxuICB9XG5cbiAgb25FbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmNvbnRlbnQgKz0gdGhpcy5jb250ZW50O1xuICB9XG5cbiAgc3RhdGljIHRlc3QoY2hhcikge1xuICAgIHJldHVybiB0aGlzLmlzRGVsaW1pdGVyKGNoYXIpO1xuICB9XG5cbiAgc3RhdGljIGlzRGVsaW1pdGVyKGNoYXIpIHtcbiAgICByZXR1cm4gY2hhciA9PT0gJ1wiJyB8fCBjaGFyID09PSBcIidcIjtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBWYXJpYWJsZUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0XG4gIG9uU3RhcnQ6ICgpLT5cbiAgICBAcGFyc2VyLnNraXAoKVxuXG4gIG9uQ2hhcjogKGNoYXIpLT5cbiAgICBpZiBjaGFyID09ICd9J1xuICAgICAgQGVuZCgpXG4gICAgZWxzZVxuICAgICAgQGNvbnRlbnQgKz0gY2hhclxuXG4gIG9uRW5kOiAtPlxuICAgIEBwYXJlbnQuY29udGVudCArPSBAcGFyc2VyLm9wdGlvbnMudmFycz9bQGNvbnRlbnRdIG9yICcnXG5cbiAgQHRlc3Q6IChjaGFyLHBhcmVudCktPlxuICAgIHBhcmVudC5wYXJzZXIudGFrZSgyKSA9PSAnI3snIiwiaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5leHBvcnQgdmFyIFZhcmlhYmxlQ29udGV4dCA9IGNsYXNzIFZhcmlhYmxlQ29udGV4dCBleHRlbmRzIENvbnRleHQge1xuICBvblN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5za2lwKCk7XG4gIH1cblxuICBvbkNoYXIoY2hhcikge1xuICAgIGlmIChjaGFyID09PSAnfScpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ICs9IGNoYXI7XG4gICAgfVxuICB9XG5cbiAgb25FbmQoKSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuY29udGVudCArPSAoKHJlZiA9IHRoaXMucGFyc2VyLm9wdGlvbnMudmFycykgIT0gbnVsbCA/IHJlZlt0aGlzLmNvbnRlbnRdIDogdm9pZCAwKSB8fCAnJztcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0KGNoYXIsIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQucGFyc2VyLnRha2UoMikgPT09ICcjeyc7XG4gIH1cblxufTtcbiJdfQ==
