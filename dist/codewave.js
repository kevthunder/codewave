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

},{"./helpers/ArrayHelper":25,"./helpers/StringHelper":30,"./positioning/Pair":31}],2:[function(require,module,exports){
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

},{"./helpers/OptionalPromise":28,"./positioning/Pos":33,"./positioning/PosCollection":34,"./positioning/Replacement":35}],3:[function(require,module,exports){
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
        posibilities = new CmdFinder(this.context.getNameSpaces(), {
          parent: this,
          mustExecute: false,
          useFallbacks: false
        }).findPosibilities();
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

},{"./Command":6,"./Context":7,"./helpers/NamespaceHelper":27}],4:[function(require,module,exports){
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

},{"./Codewave":5,"./Context":7,"./TextParser":17,"./helpers/OptionalPromise":28,"./helpers/StringHelper":30}],5:[function(require,module,exports){
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

},{"./ClosingPromp":2,"./Command":6,"./Context":7,"./Logger":11,"./PositionedCmdInstance":13,"./Process":14,"./TextParser":17,"./helpers/StringHelper":30,"./positioning/PosCollection":34}],6:[function(require,module,exports){
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

},{"./Context":7,"./Storage":15,"./helpers/NamespaceHelper":27}],7:[function(require,module,exports){
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
        npcs = ['core'].concat(this.nameSpaces);

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

},{"./CmdFinder":3,"./CmdInstance":4,"./helpers/ArrayHelper":25}],8:[function(require,module,exports){
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
exports.PairDetector = exports.LangDetector = exports.Detector = void 0;

var _Pair = require("./positioning/Pair");

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

var PairDetector =
/*#__PURE__*/
function (_Detector2) {
  _inherits(PairDetector, _Detector2);

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
}(Detector);

exports.PairDetector = PairDetector;

},{"./positioning/Pair":31}],9:[function(require,module,exports){
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

},{"./Command":6}],10:[function(require,module,exports){
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

},{"./helpers/OptionalPromise":28,"./positioning/Pos":33,"./positioning/StrPos":37}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

var _Pos = require("./positioning/Pos");

var _StrPos = require("./positioning/StrPos");

var _Replacement = require("./positioning/Replacement");

var _StringHelper = require("./helpers/StringHelper");

var _NamespaceHelper = require("./helpers/NamespaceHelper");

var _Command = require("./Command");

var _OptionalPromise = require("./helpers/OptionalPromise");

var indexOf = [].indexOf;

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
        allowedNamed = this.getOption('allowedNamed');
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
          } else if (chr === ':' && !name && !inStr && (allowedNamed == null || indexOf.call(allowedNamed, param) >= 0)) {
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

},{"./BoxHelper":1,"./CmdInstance":4,"./Command":6,"./helpers/NamespaceHelper":27,"./helpers/OptionalPromise":28,"./helpers/StringHelper":30,"./positioning/Pos":33,"./positioning/Replacement":35,"./positioning/StrPos":37}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{"./Logger":11}],16:[function(require,module,exports){
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

},{"./TextParser":17,"./positioning/Pos":33}],17:[function(require,module,exports){
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

},{"./Editor":10,"./positioning/Pos":33}],18:[function(require,module,exports){
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

},{"./Codewave":5,"./Command":6,"./cmds/CoreCommandProvider":19,"./cmds/FileCommandProvider":20,"./cmds/HtmlCommandProvider":21,"./cmds/JsCommandProvider":22,"./cmds/PhpCommandProvider":23,"./positioning/Pos":33,"./positioning/WrappedPos":38,"./storageEngines/LocalStorageEngine":40}],19:[function(require,module,exports){
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

var _Detector = require("../Detector");

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
      core.addDetector(new _Detector.LangDetector());
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
              'aliasOf': 'help:subjects'
            },
            'get_started': {
              'replaceBox': true,
              'result': "~~box~~\nThe classic Hello World.\n~~!hello|~~\n\n~~help:editing:intro~~\n~~quote_carret~~\n\nFor more information on creating your own commands, see:\n~~!help:editing~~\n\nCodewave comes with many pre-existing commands. Here is an example\nof JavaScript abbreviations\n~~!js:f~~\n~~!js:if~~\n  ~~!js:log~~\"~~!hello~~\"~~!/js:log~~\n~~!/js:if~~\n~~!/js:f~~\n\nCodeWave comes with the excellent Emmet ( http://emmet.io/ ) to \nprovide event more abbreviations. Emmet abbreviations will be \nused automatically if you are in a HTML or CSS file.\n~~!ul>li~~ (if you are in a html doccument)\n~~!emmet ul>li~~\n~~!emmet m2 css~~\n\nCommands are stored in namespaces. The same command can have \ndifferent results depending on the namespace.\n~~!js:each~~\n~~!php:outer:each~~\n~~!php:inner:each~~\n\nSome of the namespaces are active depending on the context. The\nfollowing commands are the same and will display the currently\nactive namespace. The first command command works because the \ncore namespace is active.\n~~!namespace~~\n~~!core:namespace~~\n\nYou can make a namespace active with the following command.\n~~!namespace php~~\n\nCheck the namespaces again\n~~!namespace~~\n\nIn addition to detecting the document type, Codewave can detect the\ncontext from the surrounding text. In a PHP file, it means Codewave \nwill add the PHP tags when you need them.\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
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
              'result': "~~box~~\n~~help:editing:intro~~\n\nAll the windows of Codewave are made with the command \"box\". \nThey are meant to display text that should not remain in your code. \nThey are valid comments so they won't break your code and the command \n\"close\" can be used to remove them rapidly. You can make your own \ncommands with them if you need to display some text temporarily.\n~~!box~~\nThe box will scale with the content you put in it\n~~!close|~~\n~~!/box~~\n\n~~quote_carret~~\nWhen you create a command, you may want to specify where the cursor \nwill be located once the command is expanded. To do that, use a \"|\" \n(Vertical bar). Use 2 of them if you want to print the actual \ncharacter.\n~~!box~~\none : | \ntwo : ||\n~~!/box~~\n\nYou can also use the \"escape_pipes\" command that will escape any \nvertical bars that are between its opening and closing tags\n~~!escape_pipes~~\n|\n~~!/escape_pipes~~\n\nCommands inside other commands will be expanded automatically.\nIf you want to print a command without having it expand when \nthe parent command is expanded, use a \"!\" (exclamation mark).\n~~!!hello~~\n\nFor commands that have both an opening and a closing tag, you can use\nthe \"content\" command. \"content\" will be replaced with the text\nthat is between the tags. Here is an example of how it can be used.\n~~!edit php:inner:if~~\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
            },
            'edit': {
              'aliasOf': 'help:editing'
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

},{"../BoxHelper":1,"../Command":6,"../Detector":8,"../EditCmdProp":9,"../helpers/PathHelper":29,"../helpers/StringHelper":30,"../positioning/Replacement":35,"emmet":"emmet"}],20:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileCommandProvider = void 0;

var _Command = require("../Command");

var _Detector = require("../Detector");

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

},{"../BoxHelper":1,"../Command":6,"../Detector":8,"../EditCmdProp":9,"../helpers/PathHelper":29,"../helpers/StringHelper":30,"../positioning/Replacement":35}],21:[function(require,module,exports){
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

},{"../Command":6}],22:[function(require,module,exports){
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

},{"../Command":6}],23:[function(require,module,exports){
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

var _Detector = require("../Detector");

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
      php.addDetector(new _Detector.PairDetector({
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

},{"../Command":6,"../Detector":8,"../helpers/StringHelper":30}],24:[function(require,module,exports){
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

},{"./TextAreaEditor":16,"./bootstrap":18}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{"../positioning/Size":36}],31:[function(require,module,exports){
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

},{"../helpers/StringHelper":30,"./PairMatch":32,"./Pos":33}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{"../helpers/CommonHelper":26,"./Replacement":35,"./Wrapping":39}],35:[function(require,module,exports){
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

},{"../OptionObject":12,"../helpers/CommonHelper":26,"../helpers/StringHelper":30,"./Pos":33}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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

},{"./Pos":33}],39:[function(require,module,exports){
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

},{"./Replacement":35}],40:[function(require,module,exports){
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

},{}]},{},[24])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvQm94SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9Cb3hIZWxwZXIuanMiLCIuLi9zcmMvQ2xvc2luZ1Byb21wLmNvZmZlZSIsIi4uL3NyYy9DbG9zaW5nUHJvbXAuanMiLCIuLi9zcmMvQ21kRmluZGVyLmNvZmZlZSIsIi4uL3NyYy9DbWRGaW5kZXIuanMiLCIuLi9zcmMvQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL0NtZEluc3RhbmNlLmpzIiwiLi4vc3JjL0NvZGV3YXZlLmNvZmZlZSIsIi4uL3NyYy9Db2Rld2F2ZS5qcyIsIi4uL3NyYy9Db21tYW5kLmNvZmZlZSIsIi4uL3NyYy9Db21tYW5kLmpzIiwiLi4vc3JjL0NvbnRleHQuY29mZmVlIiwiLi4vc3JjL0NvbnRleHQuanMiLCIuLi9zcmMvRGV0ZWN0b3IuY29mZmVlIiwiLi4vc3JjL0RldGVjdG9yLmpzIiwiLi4vc3JjL0VkaXRDbWRQcm9wLmNvZmZlZSIsIi4uL3NyYy9FZGl0Q21kUHJvcC5qcyIsIi4uL3NyYy9FZGl0b3IuY29mZmVlIiwiLi4vc3JjL0VkaXRvci5qcyIsIi4uL3NyYy9Mb2dnZXIuY29mZmVlIiwiLi4vc3JjL0xvZ2dlci5qcyIsIi4uL3NyYy9PcHRpb25PYmplY3QuY29mZmVlIiwiLi4vc3JjL09wdGlvbk9iamVjdC5qcyIsIi4uL3NyYy9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsIi4uL3NyYy9Qcm9jZXNzLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmpzIiwiLi4vc3JjL1RleHRBcmVhRWRpdG9yLmNvZmZlZSIsIi4uL3NyYy9UZXh0QXJlYUVkaXRvci5qcyIsIi4uL3NyYy9UZXh0UGFyc2VyLmNvZmZlZSIsIi4uL3NyYy9UZXh0UGFyc2VyLmpzIiwiLi4vc3JjL2Jvb3RzdHJhcC5jb2ZmZWUiLCIuLi9zcmMvYm9vdHN0cmFwLmpzIiwiLi4vc3JjL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9GaWxlQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9QaHBDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2VudHJ5LmNvZmZlZSIsIi4uL3NyYy9lbnRyeS5qcyIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvQ29tbW9uSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0NvbW1vbkhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL05hbWVzcGFjZUhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCIuLi9zcmMvaGVscGVycy9PcHRpb25hbFByb21pc2UuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlLmpzIiwiLi4vc3JjL2hlbHBlcnMvUGF0aEhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9QYXRoSGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvU3RyaW5nSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL1N0cmluZ0hlbHBlci5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1BhaXJNYXRjaC5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1NpemUuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1N0clBvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvV3JhcHBpbmcuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwaW5nLmpzIiwiLi4vc3JjL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZS5jb2ZmZWUiLCIuLi9zcmMvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSx1QkFBQSxDQUFBOztBQUNBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxvQkFBQSxDQUFBOztBQUVBLElBQWEsU0FBTjtBQUFBO0FBQUE7QUFDTCxxQkFBYSxPQUFiLEVBQWE7QUFBQSxRQUFXLE9BQVgs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SUFBQSxHQUFBLEVBQUE7QUNLRDs7QURKRCxNQUFBLElBQUssQ0FBTCxHQUFLLENBQUwsR0FBQSxHQUFBO0FDTUEsYURMQSxLQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQ0tBO0FEVlU7QUFMUDtBQUFBO0FBQUEseUJBV0MsR0FYRCxFQVdDO0FBQ0osVUFBRyxPQUFBLFlBQUEsS0FBQSxXQUFBLElBQUEsWUFBQSxLQUFILElBQUEsRUFBQTtBQ1FFLGVEUEEsSUFBSSxDQUFKLEtBQUEsQ0FBVyxZQUFZLENBQVosT0FBQSxDQUFxQixLQUFBLE9BQUEsQ0FBaEMsR0FBZ0MsQ0FBckIsQ0FBWCxDQ09BO0FBQ0Q7QURWRztBQVhEO0FBQUE7QUFBQSw0QkFjSSxHQWRKLEVBY0k7QUNXUCxhRFZBLGNBQVksR0NVWjtBRFhPO0FBZEo7O0FBQUE7QUFBQSxHQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5pbXBvcnQgeyBQYWlyIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9QYWlyJztcblxuZXhwb3J0IGNsYXNzIEJveEhlbHBlclxuICBjb25zdHJ1Y3RvcjogKEBjb250ZXh0LCBvcHRpb25zID0ge30pIC0+XG4gICAgQGRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogQGNvbnRleHQuY29kZXdhdmUuZGVjb1xuICAgICAgcGFkOiAyXG4gICAgICB3aWR0aDogNTBcbiAgICAgIGhlaWdodDogM1xuICAgICAgb3BlblRleHQ6ICcnXG4gICAgICBjbG9zZVRleHQ6ICcnXG4gICAgICBwcmVmaXg6ICcnXG4gICAgICBzdWZmaXg6ICcnXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICBjbG9uZTogKHRleHQpIC0+XG4gICAgb3B0ID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XVxuICAgIHJldHVybiBuZXcgQm94SGVscGVyKEBjb250ZXh0LG9wdClcbiAgZHJhdzogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBzdGFydFNlcCgpICsgXCJcXG5cIiArIEBsaW5lcyh0ZXh0KSArIFwiXFxuXCIrIEBlbmRTZXAoKVxuICB3cmFwQ29tbWVudDogKHN0cikgLT5cbiAgICByZXR1cm4gQGNvbnRleHQud3JhcENvbW1lbnQoc3RyKVxuICBzZXBhcmF0b3I6IC0+XG4gICAgbGVuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAZGVjb0xpbmUobGVuKSlcbiAgc3RhcnRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAb3BlblRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEBwcmVmaXggKyBAd3JhcENvbW1lbnQoQG9wZW5UZXh0K0BkZWNvTGluZShsbikpXG4gIGVuZFNlcDogLT5cbiAgICBsbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aCAtIEBjbG9zZVRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAY2xvc2VUZXh0K0BkZWNvTGluZShsbikpICsgQHN1ZmZpeFxuICBkZWNvTGluZTogKGxlbikgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKEBkZWNvLCBsZW4pXG4gIHBhZGRpbmc6IC0+IFxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIEBwYWQpXG4gIGxpbmVzOiAodGV4dCA9ICcnLCB1cHRvSGVpZ2h0PXRydWUpIC0+XG4gICAgdGV4dCA9IHRleHQgb3IgJydcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKVxuICAgIGlmIHVwdG9IZWlnaHRcbiAgICAgIHJldHVybiAoQGxpbmUobGluZXNbeF0gb3IgJycpIGZvciB4IGluIFswLi5AaGVpZ2h0XSkuam9pbignXFxuJykgXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIChAbGluZShsKSBmb3IgbCBpbiBsaW5lcykuam9pbignXFxuJykgXG4gIGxpbmU6ICh0ZXh0ID0gJycpIC0+XG4gICAgcmV0dXJuIChTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsQGluZGVudCkgK1xuICAgICAgQHdyYXBDb21tZW50KFxuICAgICAgICBAZGVjbyArXG4gICAgICAgIEBwYWRkaW5nKCkgK1xuICAgICAgICB0ZXh0ICtcbiAgICAgICAgU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCBAd2lkdGggLSBAcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkubGVuZ3RoKSArIFxuICAgICAgICBAcGFkZGluZygpICtcbiAgICAgICAgQGRlY29cbiAgICAgICkpXG4gIGxlZnQ6IC0+XG4gICAgQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KEBkZWNvICsgQHBhZGRpbmcoKSlcbiAgcmlnaHQ6IC0+XG4gICAgQGNvbnRleHQud3JhcENvbW1lbnRSaWdodChAcGFkZGluZygpICsgQGRlY28pXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50OiAodGV4dCkgLT5cbiAgICByZXR1cm4gQGNvbnRleHQuY29kZXdhdmUucmVtb3ZlTWFya2VycyhAY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpXG4gIHRleHRCb3VuZHM6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0VHh0U2l6ZShAcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpXG4gIGdldEJveEZvclBvczogKHBvcykgLT5cbiAgICBkZXB0aCA9IEBnZXROZXN0ZWRMdmwocG9zLnN0YXJ0KVxuICAgIGlmIGRlcHRoID4gMFxuICAgICAgbGVmdCA9IEBsZWZ0KClcbiAgICAgIGN1ckxlZnQgPSBTdHJpbmdIZWxwZXIucmVwZWF0KGxlZnQsZGVwdGgtMSlcbiAgICAgIFxuICAgICAgY2xvbmUgPSBAY2xvbmUoKVxuICAgICAgcGxhY2Vob2xkZXIgPSBcIiMjI1BsYWNlSG9sZGVyIyMjXCJcbiAgICAgIGNsb25lLndpZHRoID0gcGxhY2Vob2xkZXIubGVuZ3RoXG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IEBkZWNvICsgQGRlY28gKyBwbGFjZWhvbGRlciArIEBkZWNvICsgQGRlY29cbiAgICAgIFxuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsJy4qJykpXG4gICAgICBlbmRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLmVuZFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgXG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLGVuZEZpbmQse1xuICAgICAgICB2YWxpZE1hdGNoOiAobWF0Y2gpPT5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nKG1hdGNoLGxlZnQpXG4gICAgICAgICAgZiA9IEBjb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KG1hdGNoLnN0YXJ0KCkgLFtsZWZ0LFwiXFxuXCIsXCJcXHJcIl0sLTEpXG4gICAgICAgICAgcmV0dXJuICFmPyBvciBmLnN0ciAhPSBsZWZ0XG4gICAgICB9KVxuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcyxAY29udGV4dC5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKVxuICAgICAgaWYgcmVzP1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIFxuICBnZXROZXN0ZWRMdmw6IChpbmRleCkgLT5cbiAgICBkZXB0aCA9IDBcbiAgICBsZWZ0ID0gQGxlZnQoKVxuICAgIHdoaWxlIChmID0gQGNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQoaW5kZXggLFtsZWZ0LFwiXFxuXCIsXCJcXHJcIl0sLTEpKT8gJiYgZi5zdHIgPT0gbGVmdFxuICAgICAgaW5kZXggPSBmLnBvc1xuICAgICAgZGVwdGgrK1xuICAgIHJldHVybiBkZXB0aFxuICBnZXRPcHRGcm9tTGluZTogKGxpbmUsZ2V0UGFkPXRydWUpIC0+XG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KEBkZWNvKSkrXCIpKFxcXFxzKilcIilcbiAgICByRW5kID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodChAZGVjbykpK1wiKShcXG58JClcIilcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpXG4gICAgcmVzRW5kID0gckVuZC5leGVjKGxpbmUpXG4gICAgaWYgcmVzU3RhcnQ/IGFuZCByZXNFbmQ/XG4gICAgICBpZiBnZXRQYWRcbiAgICAgICAgQHBhZCA9IE1hdGgubWluKHJlc1N0YXJ0WzNdLmxlbmd0aCxyZXNFbmRbMV0ubGVuZ3RoKVxuICAgICAgQGluZGVudCA9IHJlc1N0YXJ0WzFdLmxlbmd0aFxuICAgICAgc3RhcnRQb3MgPSByZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCArIEBwYWRcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSBAcGFkXG4gICAgICBAd2lkdGggPSBlbmRQb3MgLSBzdGFydFBvc1xuICAgIHJldHVybiB0aGlzXG4gIHJlZm9ybWF0TGluZXM6ICh0ZXh0LG9wdGlvbnM9e30pIC0+XG4gICAgcmV0dXJuIEBsaW5lcyhAcmVtb3ZlQ29tbWVudCh0ZXh0LG9wdGlvbnMpLGZhbHNlKVxuICByZW1vdmVDb21tZW50OiAodGV4dCxvcHRpb25zPXt9KS0+XG4gICAgaWYgdGV4dD9cbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH1cbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24oe30sZGVmYXVsdHMsb3B0aW9ucylcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAZGVjbylcbiAgICAgIGZsYWcgPSBpZiBvcHRpb25zWydtdWx0aWxpbmUnXSB0aGVuICdnbScgZWxzZSAnJ1xuICAgICAgcmUxID0gbmV3IFJlZ0V4cChcIl5cXFxccyoje2VjbH0oPzoje2VkfSkqXFxcXHN7MCwje0BwYWR9fVwiLCBmbGFnKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChcIlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXFxccyokXCIsIGZsYWcpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlMSwnJykucmVwbGFjZShyZTIsJycpXG4gICBcbiAgIiwiaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBBcnJheUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYWlyXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCB2YXIgQm94SGVscGVyID0gY2xhc3MgQm94SGVscGVyIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGtleSwgcmVmLCB2YWw7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogdGhpcy5jb250ZXh0LmNvZGV3YXZlLmRlY28sXG4gICAgICBwYWQ6IDIsXG4gICAgICB3aWR0aDogNTAsXG4gICAgICBoZWlnaHQ6IDMsXG4gICAgICBvcGVuVGV4dDogJycsXG4gICAgICBjbG9zZVRleHQ6ICcnLFxuICAgICAgcHJlZml4OiAnJyxcbiAgICAgIHN1ZmZpeDogJycsXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvbmUodGV4dCkge1xuICAgIHZhciBrZXksIG9wdCwgcmVmLCB2YWw7XG4gICAgb3B0ID0ge307XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgb3B0W2tleV0gPSB0aGlzW2tleV07XG4gICAgfVxuICAgIHJldHVybiBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dCwgb3B0KTtcbiAgfVxuXG4gIGRyYXcodGV4dCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0U2VwKCkgKyBcIlxcblwiICsgdGhpcy5saW5lcyh0ZXh0KSArIFwiXFxuXCIgKyB0aGlzLmVuZFNlcCgpO1xuICB9XG5cbiAgd3JhcENvbW1lbnQoc3RyKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudChzdHIpO1xuICB9XG5cbiAgc2VwYXJhdG9yKCkge1xuICAgIHZhciBsZW47XG4gICAgbGVuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjb0xpbmUobGVuKSk7XG4gIH1cblxuICBzdGFydFNlcCgpIHtcbiAgICB2YXIgbG47XG4gICAgbG4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGggLSB0aGlzLm9wZW5UZXh0Lmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLndyYXBDb21tZW50KHRoaXMub3BlblRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSk7XG4gIH1cblxuICBlbmRTZXAoKSB7XG4gICAgdmFyIGxuO1xuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5jbG9zZVRleHQubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLndyYXBDb21tZW50KHRoaXMuY2xvc2VUZXh0ICsgdGhpcy5kZWNvTGluZShsbikpICsgdGhpcy5zdWZmaXg7XG4gIH1cblxuICBkZWNvTGluZShsZW4pIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKHRoaXMuZGVjbywgbGVuKTtcbiAgfVxuXG4gIHBhZGRpbmcoKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy5wYWQpO1xuICB9XG5cbiAgbGluZXModGV4dCA9ICcnLCB1cHRvSGVpZ2h0ID0gdHJ1ZSkge1xuICAgIHZhciBsLCBsaW5lcywgeDtcbiAgICB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKTtcbiAgICBpZiAodXB0b0hlaWdodCkge1xuICAgICAgcmV0dXJuICgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLCByZWYsIHJlc3VsdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yICh4ID0gaSA9IDAsIHJlZiA9IHRoaXMuaGVpZ2h0OyAoMCA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmKTsgeCA9IDAgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsaW5lc1t4XSB8fCAnJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSkuY2FsbCh0aGlzKSkuam9pbignXFxuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSwgbGVuMSwgcmVzdWx0cztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4xID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuMTsgaSsrKSB7XG4gICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSkuY2FsbCh0aGlzKSkuam9pbignXFxuJyk7XG4gICAgfVxuICB9XG5cbiAgbGluZSh0ZXh0ID0gJycpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLmluZGVudCkgKyB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpICsgdGV4dCArIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy53aWR0aCAtIHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkubGVuZ3RoKSArIHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQodGhpcy5kZWNvICsgdGhpcy5wYWRkaW5nKCkpO1xuICB9XG5cbiAgcmlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnModGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZUNhcnJldCh0ZXh0KSk7XG4gIH1cblxuICB0ZXh0Qm91bmRzKHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldFR4dFNpemUodGhpcy5yZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSk7XG4gIH1cblxuICBnZXRCb3hGb3JQb3MocG9zKSB7XG4gICAgdmFyIGNsb25lLCBjdXJMZWZ0LCBkZXB0aCwgZW5kRmluZCwgbGVmdCwgcGFpciwgcGxhY2Vob2xkZXIsIHJlcywgc3RhcnRGaW5kO1xuICAgIGRlcHRoID0gdGhpcy5nZXROZXN0ZWRMdmwocG9zLnN0YXJ0KTtcbiAgICBpZiAoZGVwdGggPiAwKSB7XG4gICAgICBsZWZ0ID0gdGhpcy5sZWZ0KCk7XG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LCBkZXB0aCAtIDEpO1xuICAgICAgY2xvbmUgPSB0aGlzLmNsb25lKCk7XG4gICAgICBwbGFjZWhvbGRlciA9IFwiIyMjUGxhY2VIb2xkZXIjIyNcIjtcbiAgICAgIGNsb25lLndpZHRoID0gcGxhY2Vob2xkZXIubGVuZ3RoO1xuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSB0aGlzLmRlY28gKyB0aGlzLmRlY28gKyBwbGFjZWhvbGRlciArIHRoaXMuZGVjbyArIHRoaXMuZGVjbztcbiAgICAgIHN0YXJ0RmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCAnLionKSk7XG4gICAgICBlbmRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLmVuZFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCAnLionKSk7XG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLCBlbmRGaW5kLCB7XG4gICAgICAgIHZhbGlkTWF0Y2g6IChtYXRjaCkgPT4ge1xuICAgICAgICAgIHZhciBmO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1hdGNoLGxlZnQpXG4gICAgICAgICAgZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpLCBbbGVmdCwgXCJcXG5cIiwgXCJcXHJcIl0sIC0xKTtcbiAgICAgICAgICByZXR1cm4gKGYgPT0gbnVsbCkgfHwgZi5zdHIgIT09IGxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcywgdGhpcy5jb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpO1xuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGFydCArPSBjdXJMZWZ0Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXROZXN0ZWRMdmwoaW5kZXgpIHtcbiAgICB2YXIgZGVwdGgsIGYsIGxlZnQ7XG4gICAgZGVwdGggPSAwO1xuICAgIGxlZnQgPSB0aGlzLmxlZnQoKTtcbiAgICB3aGlsZSAoKChmID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KGluZGV4LCBbbGVmdCwgXCJcXG5cIiwgXCJcXHJcIl0sIC0xKSkgIT0gbnVsbCkgJiYgZi5zdHIgPT09IGxlZnQpIHtcbiAgICAgIGluZGV4ID0gZi5wb3M7XG4gICAgICBkZXB0aCsrO1xuICAgIH1cbiAgICByZXR1cm4gZGVwdGg7XG4gIH1cblxuICBnZXRPcHRGcm9tTGluZShsaW5lLCBnZXRQYWQgPSB0cnVlKSB7XG4gICAgdmFyIGVuZFBvcywgckVuZCwgclN0YXJ0LCByZXNFbmQsIHJlc1N0YXJ0LCBzdGFydFBvcztcbiAgICByU3RhcnQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQodGhpcy5kZWNvKSkgKyBcIikoXFxcXHMqKVwiKTtcbiAgICByRW5kID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLmRlY28pKSArIFwiKShcXG58JClcIik7XG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKTtcbiAgICByZXNFbmQgPSByRW5kLmV4ZWMobGluZSk7XG4gICAgaWYgKChyZXNTdGFydCAhPSBudWxsKSAmJiAocmVzRW5kICE9IG51bGwpKSB7XG4gICAgICBpZiAoZ2V0UGFkKSB7XG4gICAgICAgIHRoaXMucGFkID0gTWF0aC5taW4ocmVzU3RhcnRbM10ubGVuZ3RoLCByZXNFbmRbMV0ubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5kZW50ID0gcmVzU3RhcnRbMV0ubGVuZ3RoO1xuICAgICAgc3RhcnRQb3MgPSByZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCArIHRoaXMucGFkO1xuICAgICAgZW5kUG9zID0gcmVzRW5kLmluZGV4ICsgcmVzRW5kWzFdLmxlbmd0aCAtIHRoaXMucGFkO1xuICAgICAgdGhpcy53aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlZm9ybWF0TGluZXModGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMubGluZXModGhpcy5yZW1vdmVDb21tZW50KHRleHQsIG9wdGlvbnMpLCBmYWxzZSk7XG4gIH1cblxuICByZW1vdmVDb21tZW50KHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywgZWNsLCBlY3IsIGVkLCBmbGFnLCBvcHQsIHJlMSwgcmUyO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH07XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuZGVjbyk7XG4gICAgICBmbGFnID0gb3B0aW9uc1snbXVsdGlsaW5lJ10gPyAnZ20nIDogJyc7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzezAsJHt0aGlzLnBhZH19YCwgZmxhZyk7XG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBcXFxccyooPzoke2VkfSkqJHtlY3J9XFxcXHMqJGAsIGZsYWcpO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsICcnKS5yZXBsYWNlKHJlMiwgJycpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zQ29sbGVjdGlvbiB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgb3B0aW9uYWxQcm9taXNlIH0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCBjbGFzcyBDbG9zaW5nUHJvbXBcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsc2VsZWN0aW9ucykgLT5cbiAgICBAdGltZW91dCA9IG51bGxcbiAgICBAX3R5cGVkID0gbnVsbFxuICAgIEBzdGFydGVkID0gZmFsc2VcbiAgICBAbmJDaGFuZ2VzID0gMFxuICAgIEBzZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucylcbiAgYmVnaW46IC0+XG4gICAgQHN0YXJ0ZWQgPSB0cnVlXG4gICAgb3B0aW9uYWxQcm9taXNlKEBhZGRDYXJyZXRzKCkpLnRoZW4gPT5cbiAgICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKVxuICAgICAgICBAcHJveHlPbkNoYW5nZSA9IChjaD1udWxsKT0+IEBvbkNoYW5nZShjaClcbiAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lciggQHByb3h5T25DaGFuZ2UgKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICAucmVzdWx0KClcbiAgYWRkQ2FycmV0czogLT5cbiAgICBAcmVwbGFjZW1lbnRzID0gQHNlbGVjdGlvbnMud3JhcChcbiAgICAgIEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNhcnJldENoYXIgKyBAY29kZXdhdmUuYnJha2V0cyArIFwiXFxuXCIsXG4gICAgICBcIlxcblwiICsgQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNvZGV3YXZlLmNhcnJldENoYXIgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICkubWFwKCAocCkgLT4gcC5jYXJyZXRUb1NlbCgpIClcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKEByZXBsYWNlbWVudHMpXG4gIGludmFsaWRUeXBlZDogLT5cbiAgICBAX3R5cGVkID0gbnVsbFxuICBvbkNoYW5nZTogKGNoID0gbnVsbCktPlxuICAgIEBpbnZhbGlkVHlwZWQoKVxuICAgIGlmIEBza2lwRXZlbnQoY2gpXG4gICAgICByZXR1cm5cbiAgICBAbmJDaGFuZ2VzKytcbiAgICBpZiBAc2hvdWxkU3RvcCgpXG4gICAgICBAc3RvcCgpXG4gICAgICBAY2xlYW5DbG9zZSgpXG4gICAgZWxzZVxuICAgICAgQHJlc3VtZSgpXG4gICAgICBcbiAgc2tpcEV2ZW50OiAoY2gpIC0+XG4gICAgcmV0dXJuIGNoPyBhbmQgY2guY2hhckNvZGVBdCgwKSAhPSAzMlxuICBcbiAgcmVzdW1lOiAtPlxuICAgICNcbiAgICBcbiAgc2hvdWxkU3RvcDogLT5cbiAgICByZXR1cm4gQHR5cGVkKCkgPT0gZmFsc2Ugb3IgQHR5cGVkKCkuaW5kZXhPZignICcpICE9IC0xXG4gIFxuICBjbGVhbkNsb3NlOiAtPlxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc2VsZWN0aW9ucyA9IEBnZXRTZWxlY3Rpb25zKClcbiAgICBmb3Igc2VsIGluIHNlbGVjdGlvbnNcbiAgICAgIGlmIHBvcyA9IEB3aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICAgIHN0YXJ0ID0gc2VsXG4gICAgICBlbHNlIGlmIChlbmQgPSBAd2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpIGFuZCBzdGFydD9cbiAgICAgICAgcmVzID0gZW5kLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXVxuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LGVuZC5pbm5lckVuZCxyZXMpXG4gICAgICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtzdGFydF1cbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gocmVwbClcbiAgICAgICAgc3RhcnQgPSBudWxsXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIGdldFNlbGVjdGlvbnM6IC0+XG4gICAgcmV0dXJuIEBjb2Rld2F2ZS5lZGl0b3IuZ2V0TXVsdGlTZWwoKVxuICBzdG9wOiAtPlxuICAgIEBzdGFydGVkID0gZmFsc2VcbiAgICBjbGVhclRpbWVvdXQoQHRpbWVvdXQpIGlmIEB0aW1lb3V0P1xuICAgIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPSBudWxsIGlmIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPT0gdGhpc1xuICAgIGlmIEBwcm94eU9uQ2hhbmdlP1xuICAgICAgQGNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcihAcHJveHlPbkNoYW5nZSlcbiAgY2FuY2VsOiAtPlxuICAgIGlmIEB0eXBlZCgpICE9IGZhbHNlXG4gICAgICBAY2FuY2VsU2VsZWN0aW9ucyhAZ2V0U2VsZWN0aW9ucygpKVxuICAgIEBzdG9wKClcbiAgY2FuY2VsU2VsZWN0aW9uczogKHNlbGVjdGlvbnMpIC0+XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzdGFydCA9IG51bGxcbiAgICBmb3Igc2VsIGluIHNlbGVjdGlvbnNcbiAgICAgIGlmIHBvcyA9IEB3aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICAgIHN0YXJ0ID0gcG9zXG4gICAgICBlbHNlIGlmIChlbmQgPSBAd2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpIGFuZCBzdGFydD9cbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3IFJlcGxhY2VtZW50KHN0YXJ0LnN0YXJ0LGVuZC5lbmQsQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHN0YXJ0LmVuZCsxLCBlbmQuc3RhcnQtMSkpLnNlbGVjdENvbnRlbnQoKSlcbiAgICAgICAgc3RhcnQgPSBudWxsXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIHR5cGVkOiAtPlxuICAgIHVubGVzcyBAX3R5cGVkP1xuICAgICAgY3BvcyA9IEBjb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKClcbiAgICAgIGlubmVyU3RhcnQgPSBAcmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICsgQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoXG4gICAgICBpZiBAY29kZXdhdmUuZmluZFByZXZCcmFrZXQoY3Bvcy5zdGFydCkgPT0gQHJlcGxhY2VtZW50c1swXS5zdGFydCBhbmQgKGlubmVyRW5kID0gQGNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGlubmVyU3RhcnQpKT8gYW5kIGlubmVyRW5kID49IGNwb3MuZW5kXG4gICAgICAgIEBfdHlwZWQgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpXG4gICAgICBlbHNlXG4gICAgICAgIEBfdHlwZWQgPSBmYWxzZVxuICAgIHJldHVybiBAX3R5cGVkXG4gIHdoaXRoaW5PcGVuQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBzdGFydFBvc0F0KGkpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PSB0YXJnZXRUZXh0XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcbiAgd2hpdGhpbkNsb3NlQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBlbmRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09IHRhcmdldFRleHRcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuICBzdGFydFBvc0F0OiAoaW5kZXgpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiksXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uZW5kICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzEpXG4gICAgICApLndyYXBwZWRCeShAY29kZXdhdmUuYnJha2V0cywgQGNvZGV3YXZlLmJyYWtldHMpXG4gIGVuZFBvc0F0OiAoaW5kZXgpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uc3RhcnQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMSksXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzIpXG4gICAgICApLndyYXBwZWRCeShAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIsIEBjb2Rld2F2ZS5icmFrZXRzKVxuXG5leHBvcnQgY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wXG4gIHJlc3VtZTogLT5cbiAgICBAc2ltdWxhdGVUeXBlKClcbiAgc2ltdWxhdGVUeXBlOiAtPlxuICAgIGNsZWFyVGltZW91dChAdGltZW91dCkgaWYgQHRpbWVvdXQ/XG4gICAgQHRpbWVvdXQgPSBzZXRUaW1lb3V0ICg9PlxuICAgICAgQGludmFsaWRUeXBlZCgpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgY3VyQ2xvc2UgPSBAd2hpdGhpbkNsb3NlQm91bmRzKEByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXS5jb3B5KCkuYXBwbHlPZmZzZXQoQHR5cGVkKCkubGVuZ3RoKSlcbiAgICAgIGlmIGN1ckNsb3NlXG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoY3VyQ2xvc2Uuc3RhcnQsY3VyQ2xvc2UuZW5kLHRhcmdldFRleHQpXG4gICAgICAgIGlmIHJlcGwud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS5uZWNlc3NhcnkoKVxuICAgICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoW3JlcGxdKVxuICAgICAgZWxzZVxuICAgICAgICBAc3RvcCgpXG4gICAgICBAb25UeXBlU2ltdWxhdGVkKCkgaWYgQG9uVHlwZVNpbXVsYXRlZD9cbiAgICApLCAyXG4gIHNraXBFdmVudDogLT5cbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0U2VsZWN0aW9uczogLT5cbiAgICByZXR1cm4gW1xuICAgICAgICBAY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpXG4gICAgICAgIEByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXSArIEB0eXBlZCgpLmxlbmd0aFxuICAgICAgXVxuICB3aGl0aGluQ2xvc2VCb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQGVuZFBvc0F0KGkpXG4gICAgICBuZXh0ID0gQGNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KVxuICAgICAgaWYgbmV4dD9cbiAgICAgICAgdGFyZ2V0UG9zLm1vdmVTdWZmaXgobmV4dClcbiAgICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKVxuICAgICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IChjb2Rld2F2ZSxzZWxlY3Rpb25zKSAtPlxuICBpZiBjb2Rld2F2ZS5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgcmV0dXJuIG5ldyBDbG9zaW5nUHJvbXAoY29kZXdhdmUsc2VsZWN0aW9ucylcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLHNlbGVjdGlvbnMpIiwiaW1wb3J0IHtcbiAgUG9zQ29sbGVjdGlvblxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgb3B0aW9uYWxQcm9taXNlXG59IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgdmFyIENsb3NpbmdQcm9tcCA9IGNsYXNzIENsb3NpbmdQcm9tcCB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlMSwgc2VsZWN0aW9ucykge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTE7XG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLl90eXBlZCA9IG51bGw7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5uYkNoYW5nZXMgPSAwO1xuICAgIHRoaXMuc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uKHNlbGVjdGlvbnMpO1xuICB9XG5cbiAgYmVnaW4oKSB7XG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gb3B0aW9uYWxQcm9taXNlKHRoaXMuYWRkQ2FycmV0cygpKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci5jYW5MaXN0ZW5Ub0NoYW5nZSgpKSB7XG4gICAgICAgIHRoaXMucHJveHlPbkNoYW5nZSA9IChjaCA9IG51bGwpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkNoYW5nZShjaCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMucHJveHlPbkNoYW5nZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KS5yZXN1bHQoKTtcbiAgfVxuXG4gIGFkZENhcnJldHMoKSB7XG4gICAgdGhpcy5yZXBsYWNlbWVudHMgPSB0aGlzLnNlbGVjdGlvbnMud3JhcCh0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyBcIlxcblwiLCBcIlxcblwiICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMpLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gcC5jYXJyZXRUb1NlbCgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyh0aGlzLnJlcGxhY2VtZW50cyk7XG4gIH1cblxuICBpbnZhbGlkVHlwZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkID0gbnVsbDtcbiAgfVxuXG4gIG9uQ2hhbmdlKGNoID0gbnVsbCkge1xuICAgIHRoaXMuaW52YWxpZFR5cGVkKCk7XG4gICAgaWYgKHRoaXMuc2tpcEV2ZW50KGNoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm5iQ2hhbmdlcysrO1xuICAgIGlmICh0aGlzLnNob3VsZFN0b3AoKSkge1xuICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICByZXR1cm4gdGhpcy5jbGVhbkNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VtZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNraXBFdmVudChjaCkge1xuICAgIHJldHVybiAoY2ggIT0gbnVsbCkgJiYgY2guY2hhckNvZGVBdCgwKSAhPT0gMzI7XG4gIH1cblxuICByZXN1bWUoKSB7fVxuXG4gIFxuICBzaG91bGRTdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGVkKCkgPT09IGZhbHNlIHx8IHRoaXMudHlwZWQoKS5pbmRleE9mKCcgJykgIT09IC0xO1xuICB9XG5cbiAgY2xlYW5DbG9zZSgpIHtcbiAgICB2YXIgZW5kLCBqLCBsZW4sIHBvcywgcmVwbCwgcmVwbGFjZW1lbnRzLCByZXMsIHNlbCwgc2VsZWN0aW9ucywgc3RhcnQ7XG4gICAgcmVwbGFjZW1lbnRzID0gW107XG4gICAgc2VsZWN0aW9ucyA9IHRoaXMuZ2V0U2VsZWN0aW9ucygpO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNlbGVjdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNlbCA9IHNlbGVjdGlvbnNbal07XG4gICAgICBpZiAocG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpKSB7XG4gICAgICAgIHN0YXJ0ID0gc2VsO1xuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgKHN0YXJ0ICE9IG51bGwpKSB7XG4gICAgICAgIHJlcyA9IGVuZC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS5pbm5lclRleHQoKS5zcGxpdCgnICcpWzBdO1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LCBlbmQuaW5uZXJFbmQsIHJlcyk7XG4gICAgICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtzdGFydF07XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKHJlcGwpO1xuICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0TXVsdGlTZWwoKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID09PSB0aGlzKSB7XG4gICAgICB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3h5T25DaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMucHJveHlPbkNoYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIGlmICh0aGlzLnR5cGVkKCkgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmNhbmNlbFNlbGVjdGlvbnModGhpcy5nZXRTZWxlY3Rpb25zKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdG9wKCk7XG4gIH1cblxuICBjYW5jZWxTZWxlY3Rpb25zKHNlbGVjdGlvbnMpIHtcbiAgICB2YXIgZW5kLCBqLCBsZW4sIHBvcywgcmVwbGFjZW1lbnRzLCBzZWwsIHN0YXJ0O1xuICAgIHJlcGxhY2VtZW50cyA9IFtdO1xuICAgIHN0YXJ0ID0gbnVsbDtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdO1xuICAgICAgaWYgKHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKSkge1xuICAgICAgICBzdGFydCA9IHBvcztcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIChzdGFydCAhPSBudWxsKSkge1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXcgUmVwbGFjZW1lbnQoc3RhcnQuc3RhcnQsIGVuZC5lbmQsIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoc3RhcnQuZW5kICsgMSwgZW5kLnN0YXJ0IC0gMSkpLnNlbGVjdENvbnRlbnQoKSk7XG4gICAgICAgIHN0YXJ0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxuICB0eXBlZCgpIHtcbiAgICB2YXIgY3BvcywgaW5uZXJFbmQsIGlubmVyU3RhcnQ7XG4gICAgaWYgKHRoaXMuX3R5cGVkID09IG51bGwpIHtcbiAgICAgIGNwb3MgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKTtcbiAgICAgIGlubmVyU3RhcnQgPSB0aGlzLnJlcGxhY2VtZW50c1swXS5zdGFydCArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGg7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PT0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgJiYgKChpbm5lckVuZCA9IHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoaW5uZXJTdGFydCkpICE9IG51bGwpICYmIGlubmVyRW5kID49IGNwb3MuZW5kKSB7XG4gICAgICAgIHRoaXMuX3R5cGVkID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihpbm5lclN0YXJ0LCBpbm5lckVuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl90eXBlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHlwZWQ7XG4gIH1cblxuICB3aGl0aGluT3BlbkJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuc3RhcnRQb3NBdChpKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXJ0UG9zQXQoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5zdGFydCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cywgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKTtcbiAgfVxuXG4gIGVuZFBvc0F0KGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDEpLCB0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5lbmQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDIpKS53cmFwcGVkQnkodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIsIHRoaXMuY29kZXdhdmUuYnJha2V0cyk7XG4gIH1cblxufTtcblxuZXhwb3J0IHZhciBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgPSBjbGFzcyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgZXh0ZW5kcyBDbG9zaW5nUHJvbXAge1xuICByZXN1bWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2ltdWxhdGVUeXBlKCk7XG4gIH1cblxuICBzaW11bGF0ZVR5cGUoKSB7XG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgIHZhciBjdXJDbG9zZSwgcmVwbCwgdGFyZ2V0VGV4dDtcbiAgICAgIHRoaXMuaW52YWxpZFR5cGVkKCk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBjdXJDbG9zZSA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0uY29weSgpLmFwcGx5T2Zmc2V0KHRoaXMudHlwZWQoKS5sZW5ndGgpKTtcbiAgICAgIGlmIChjdXJDbG9zZSkge1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LCBjdXJDbG9zZS5lbmQsIHRhcmdldFRleHQpO1xuICAgICAgICBpZiAocmVwbC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS5uZWNlc3NhcnkoKSkge1xuICAgICAgICAgIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKFtyZXBsXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub25UeXBlU2ltdWxhdGVkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25UeXBlU2ltdWxhdGVkKCk7XG4gICAgICB9XG4gICAgfSksIDIpO1xuICB9XG5cbiAgc2tpcEV2ZW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIFt0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKSwgdGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXSArIHRoaXMudHlwZWQoKS5sZW5ndGhdO1xuICB9XG5cbiAgd2hpdGhpbkNsb3NlQm91bmRzKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIG5leHQsIHJlZiwgcmVwbCwgdGFyZ2V0UG9zO1xuICAgIHJlZiA9IHRoaXMucmVwbGFjZW1lbnRzO1xuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5lbmRQb3NBdChpKTtcbiAgICAgIG5leHQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KTtcbiAgICAgIGlmIChuZXh0ICE9IG51bGwpIHtcbiAgICAgICAgdGFyZ2V0UG9zLm1vdmVTdWZmaXgobmV4dCk7XG4gICAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldFBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxufTtcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IGZ1bmN0aW9uKGNvZGV3YXZlLCBzZWxlY3Rpb25zKSB7XG4gIGlmIChjb2Rld2F2ZS5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgcmV0dXJuIG5ldyBDbG9zaW5nUHJvbXAoY29kZXdhdmUsIHNlbGVjdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIENtZEZpbmRlclxuICBjb25zdHJ1Y3RvcjogKG5hbWVzLCBvcHRpb25zKSAtPlxuICAgIGlmIHR5cGVvZiBuYW1lcyA9PSAnc3RyaW5nJ1xuICAgICAgbmFtZXMgPSBbbmFtZXNdXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGxcbiAgICAgIG5hbWVzcGFjZXM6IFtdXG4gICAgICBwYXJlbnRDb250ZXh0OiBudWxsXG4gICAgICBjb250ZXh0OiBudWxsXG4gICAgICByb290OiBDb21tYW5kLmNtZHNcbiAgICAgIG11c3RFeGVjdXRlOiB0cnVlXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWVcbiAgICAgIHVzZUZhbGxiYWNrczogdHJ1ZVxuICAgICAgaW5zdGFuY2U6IG51bGxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfVxuICAgIEBuYW1lcyA9IG5hbWVzXG4gICAgQHBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dChAY29kZXdhdmUpXG4gICAgaWYgQHBhcmVudENvbnRleHQ/XG4gICAgICBAY29udGV4dC5wYXJlbnQgPSBAcGFyZW50Q29udGV4dFxuICAgIGlmIEBuYW1lc3BhY2VzP1xuICAgICAgQGNvbnRleHQuYWRkTmFtZXNwYWNlcyhAbmFtZXNwYWNlcylcbiAgZmluZDogLT5cbiAgICBAdHJpZ2dlckRldGVjdG9ycygpXG4gICAgQGNtZCA9IEBmaW5kSW4oQHJvb3QpXG4gICAgcmV0dXJuIEBjbWRcbiMgIGdldFBvc2liaWxpdGllczogLT5cbiMgICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuIyAgICBwYXRoID0gbGlzdChAcGF0aClcbiMgICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcbiAgZ2V0TmFtZXNXaXRoUGF0aHM6IC0+XG4gICAgcGF0aHMgPSB7fVxuICAgIGZvciBuYW1lIGluIEBuYW1lcyBcbiAgICAgIFtzcGFjZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG4gICAgICBpZiBzcGFjZT8gYW5kICEoc3BhY2UgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgICB1bmxlc3Mgc3BhY2Ugb2YgcGF0aHMgXG4gICAgICAgICAgcGF0aHNbc3BhY2VdID0gW11cbiAgICAgICAgcGF0aHNbc3BhY2VdLnB1c2gocmVzdClcbiAgICByZXR1cm4gcGF0aHNcbiAgYXBwbHlTcGFjZU9uTmFtZXM6IChuYW1lc3BhY2UpIC0+XG4gICAgW3NwYWNlLHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZXNwYWNlLHRydWUpXG4gICAgQG5hbWVzLm1hcCggKG5hbWUpIC0+XG4gICAgICBbY3VyX3NwYWNlLGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG4gICAgICBpZiBjdXJfc3BhY2U/IGFuZCBjdXJfc3BhY2UgPT0gc3BhY2VcbiAgICAgICAgbmFtZSA9IGN1cl9yZXN0XG4gICAgICBpZiByZXN0P1xuICAgICAgICBuYW1lID0gcmVzdCArICc6JyArIG5hbWVcbiAgICAgIHJldHVybiBuYW1lXG4gICAgKVxuICBnZXREaXJlY3ROYW1lczogLT5cbiAgICByZXR1cm4gKG4gZm9yIG4gaW4gQG5hbWVzIHdoZW4gbi5pbmRleE9mKFwiOlwiKSA9PSAtMSlcbiAgdHJpZ2dlckRldGVjdG9yczogLT5cbiAgICBpZiBAdXNlRGV0ZWN0b3JzIFxuICAgICAgQHVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICBwb3NpYmlsaXRpZXMgPSBuZXcgQ21kRmluZGVyKEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IHBvc2liaWxpdGllcy5sZW5ndGhcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldXG4gICAgICAgIGZvciBkZXRlY3RvciBpbiBjbWQuZGV0ZWN0b3JzIFxuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKVxuICAgICAgICAgIGlmIHJlcz9cbiAgICAgICAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMocmVzKVxuICAgICAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKHJlcywge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgICAgICBpKytcbiAgZmluZEluOiAoY21kLHBhdGggPSBudWxsKSAtPlxuICAgIHVubGVzcyBjbWQ/XG4gICAgICByZXR1cm4gbnVsbFxuICAgIGJlc3QgPSBAYmVzdEluUG9zaWJpbGl0aWVzKEBmaW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgaWYgYmVzdD9cbiAgICAgIHJldHVybiBiZXN0XG4gIGZpbmRQb3NpYmlsaXRpZXM6IC0+XG4gICAgdW5sZXNzIEByb290P1xuICAgICAgcmV0dXJuIFtdXG4gICAgQHJvb3QuaW5pdCgpXG4gICAgcG9zaWJpbGl0aWVzID0gW11cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/LmNtZCA9PSBAcm9vdFxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChAZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoJ2luX2luc3RhbmNlJykpXG4gICAgZm9yIHNwYWNlLCBuYW1lcyBvZiBAZ2V0TmFtZXNXaXRoUGF0aHMoKVxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChAZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoc3BhY2UsIG5hbWVzKSlcbiAgICBmb3IgbnNwYyBpbiBAY29udGV4dC5nZXROYW1lU3BhY2VzKClcbiAgICAgIFtuc3BjTmFtZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsdHJ1ZSlcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQoQGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKG5zcGNOYW1lLCBAYXBwbHlTcGFjZU9uTmFtZXMobnNwYykpKVxuICAgIGZvciBuYW1lIGluIEBnZXREaXJlY3ROYW1lcygpXG4gICAgICBkaXJlY3QgPSBAcm9vdC5nZXRDbWQobmFtZSlcbiAgICAgIGlmIEBjbWRJc1ZhbGlkKGRpcmVjdClcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZGlyZWN0KVxuICAgIGlmIEB1c2VGYWxsYmFja3NcbiAgICAgIGZhbGxiYWNrID0gQHJvb3QuZ2V0Q21kKCdmYWxsYmFjaycpXG4gICAgICBpZiBAY21kSXNWYWxpZChmYWxsYmFjaylcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZmFsbGJhY2spXG4gICAgQHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllc1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXNcbiAgZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQ6IChjbWROYW1lLCBuYW1lcyA9IEBuYW1lcykgLT5cbiAgICBwb3NpYmlsaXRpZXMgPSBbXTtcbiAgICBuZXh0cyA9IEBnZXRDbWRGb2xsb3dBbGlhcyhjbWROYW1lKVxuICAgIGZvciBuZXh0IGluIG5leHRzXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgcG9zaWJpbGl0aWVzXG4gIGdldENtZEZvbGxvd0FsaWFzOiAobmFtZSkgLT5cbiAgICBjbWQgPSBAcm9vdC5nZXRDbWQobmFtZSlcbiAgICBpZiBjbWQ/IFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmFsaWFzT2Y/XG4gICAgICAgIHJldHVybiBbY21kLGNtZC5nZXRBbGlhc2VkKCldXG4gICAgICByZXR1cm4gW2NtZF1cbiAgICByZXR1cm4gW2NtZF1cbiAgY21kSXNWYWxpZDogKGNtZCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgaWYgY21kLm5hbWUgIT0gJ2ZhbGxiYWNrJyAmJiBjbWQgaW4gQGFuY2VzdG9ycygpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gIUBtdXN0RXhlY3V0ZSBvciBAY21kSXNFeGVjdXRhYmxlKGNtZClcbiAgYW5jZXN0b3JzOiAtPlxuICAgIGlmIEBjb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICByZXR1cm4gW11cbiAgY21kSXNFeGVjdXRhYmxlOiAoY21kKSAtPlxuICAgIG5hbWVzID0gQGdldERpcmVjdE5hbWVzKClcbiAgICBpZiBuYW1lcy5sZW5ndGggPT0gMVxuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZXNbMF0pXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgY21kU2NvcmU6IChjbWQpIC0+XG4gICAgc2NvcmUgPSBjbWQuZGVwdGhcbiAgICBpZiBjbWQubmFtZSA9PSAnZmFsbGJhY2snIFxuICAgICAgICBzY29yZSAtPSAxMDAwXG4gICAgcmV0dXJuIHNjb3JlXG4gIGJlc3RJblBvc2liaWxpdGllczogKHBvc3MpIC0+XG4gICAgaWYgcG9zcy5sZW5ndGggPiAwXG4gICAgICBiZXN0ID0gbnVsbFxuICAgICAgYmVzdFNjb3JlID0gbnVsbFxuICAgICAgZm9yIHAgaW4gcG9zc1xuICAgICAgICBzY29yZSA9IEBjbWRTY29yZShwKVxuICAgICAgICBpZiAhYmVzdD8gb3Igc2NvcmUgPj0gYmVzdFNjb3JlXG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmVcbiAgICAgICAgICBiZXN0ID0gcFxuICAgICAgcmV0dXJuIGJlc3Q7IiwidmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xuXG5pbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIE5hbWVzcGFjZUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIENtZEZpbmRlciA9IGNsYXNzIENtZEZpbmRlciB7XG4gIGNvbnN0cnVjdG9yKG5hbWVzLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdO1xuICAgIH1cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgcGFyZW50Q29udGV4dDogbnVsbCxcbiAgICAgIGNvbnRleHQ6IG51bGwsXG4gICAgICByb290OiBDb21tYW5kLmNtZHMsXG4gICAgICBtdXN0RXhlY3V0ZTogdHJ1ZSxcbiAgICAgIHVzZURldGVjdG9yczogdHJ1ZSxcbiAgICAgIHVzZUZhbGxiYWNrczogdHJ1ZSxcbiAgICAgIGluc3RhbmNlOiBudWxsLFxuICAgICAgY29kZXdhdmU6IG51bGxcbiAgICB9O1xuICAgIHRoaXMubmFtZXMgPSBuYW1lcztcbiAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddO1xuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSBpZiAoKHRoaXMucGFyZW50ICE9IG51bGwpICYmIGtleSAhPT0gJ3BhcmVudCcpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzLmNvZGV3YXZlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGFyZW50Q29udGV4dCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5wYXJlbnRDb250ZXh0O1xuICAgIH1cbiAgICBpZiAodGhpcy5uYW1lc3BhY2VzICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHRoaXMubmFtZXNwYWNlcyk7XG4gICAgfVxuICB9XG5cbiAgZmluZCgpIHtcbiAgICB0aGlzLnRyaWdnZXJEZXRlY3RvcnMoKTtcbiAgICB0aGlzLmNtZCA9IHRoaXMuZmluZEluKHRoaXMucm9vdCk7XG4gICAgcmV0dXJuIHRoaXMuY21kO1xuICB9XG5cbiAgLy8gIGdldFBvc2liaWxpdGllczogLT5cbiAgLy8gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAvLyAgICBwYXRoID0gbGlzdChAcGF0aClcbiAgLy8gICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcbiAgZ2V0TmFtZXNXaXRoUGF0aHMoKSB7XG4gICAgdmFyIGosIGxlbiwgbmFtZSwgcGF0aHMsIHJlZiwgcmVzdCwgc3BhY2U7XG4gICAgcGF0aHMgPSB7fTtcbiAgICByZWYgPSB0aGlzLm5hbWVzO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmFtZSA9IHJlZltqXTtcbiAgICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKTtcbiAgICAgIGlmICgoc3BhY2UgIT0gbnVsbCkgJiYgIShpbmRleE9mLmNhbGwodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwgc3BhY2UpID49IDApKSB7XG4gICAgICAgIGlmICghKHNwYWNlIGluIHBhdGhzKSkge1xuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGF0aHM7XG4gIH1cblxuICBhcHBseVNwYWNlT25OYW1lcyhuYW1lc3BhY2UpIHtcbiAgICB2YXIgcmVzdCwgc3BhY2U7XG4gICAgW3NwYWNlLCByZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMubmFtZXMubWFwKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBjdXJfcmVzdCwgY3VyX3NwYWNlO1xuICAgICAgW2N1cl9zcGFjZSwgY3VyX3Jlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG4gICAgICBpZiAoKGN1cl9zcGFjZSAhPSBudWxsKSAmJiBjdXJfc3BhY2UgPT09IHNwYWNlKSB7XG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXN0ICE9IG51bGwpIHtcbiAgICAgICAgbmFtZSA9IHJlc3QgKyAnOicgKyBuYW1lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXREaXJlY3ROYW1lcygpIHtcbiAgICB2YXIgbjtcbiAgICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgcmVmID0gdGhpcy5uYW1lcztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBuID0gcmVmW2pdO1xuICAgICAgICBpZiAobi5pbmRleE9mKFwiOlwiKSA9PT0gLTEpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gobik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0pLmNhbGwodGhpcyk7XG4gIH1cblxuICB0cmlnZ2VyRGV0ZWN0b3JzKCkge1xuICAgIHZhciBjbWQsIGRldGVjdG9yLCBpLCBqLCBsZW4sIHBvc2liaWxpdGllcywgcmVmLCByZXMsIHJlc3VsdHM7XG4gICAgaWYgKHRoaXMudXNlRGV0ZWN0b3JzKSB7XG4gICAgICB0aGlzLnVzZURldGVjdG9ycyA9IGZhbHNlO1xuICAgICAgcG9zaWJpbGl0aWVzID0gbmV3IENtZEZpbmRlcih0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCB7XG4gICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCk7XG4gICAgICBpID0gMDtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIHdoaWxlIChpIDwgcG9zaWJpbGl0aWVzLmxlbmd0aCkge1xuICAgICAgICBjbWQgPSBwb3NpYmlsaXRpZXNbaV07XG4gICAgICAgIHJlZiA9IGNtZC5kZXRlY3RvcnM7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIGRldGVjdG9yID0gcmVmW2pdO1xuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKTtcbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcyk7XG4gICAgICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIocmVzLCB7XG4gICAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICAgICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRJbihjbWQsIHBhdGggPSBudWxsKSB7XG4gICAgdmFyIGJlc3Q7XG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgYmVzdCA9IHRoaXMuYmVzdEluUG9zaWJpbGl0aWVzKHRoaXMuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICBpZiAoYmVzdCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxuICBmaW5kUG9zaWJpbGl0aWVzKCkge1xuICAgIHZhciBkaXJlY3QsIGZhbGxiYWNrLCBqLCBrLCBsZW4sIGxlbjEsIG5hbWUsIG5hbWVzLCBuc3BjLCBuc3BjTmFtZSwgcG9zaWJpbGl0aWVzLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlc3QsIHNwYWNlO1xuICAgIGlmICh0aGlzLnJvb3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICB0aGlzLnJvb3QuaW5pdCgpO1xuICAgIHBvc2liaWxpdGllcyA9IFtdO1xuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyAocmVmMSA9IHJlZi5pbkluc3RhbmNlKSAhPSBudWxsID8gcmVmMS5jbWQgOiB2b2lkIDAgOiB2b2lkIDApID09PSB0aGlzLnJvb3QpIHtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZCgnaW5faW5zdGFuY2UnKSk7XG4gICAgfVxuICAgIHJlZjIgPSB0aGlzLmdldE5hbWVzV2l0aFBhdGhzKCk7XG4gICAgZm9yIChzcGFjZSBpbiByZWYyKSB7XG4gICAgICBuYW1lcyA9IHJlZjJbc3BhY2VdO1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKHNwYWNlLCBuYW1lcykpO1xuICAgIH1cbiAgICByZWYzID0gdGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuc3BjID0gcmVmM1tqXTtcbiAgICAgIFtuc3BjTmFtZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLCB0cnVlKTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChuc3BjTmFtZSwgdGhpcy5hcHBseVNwYWNlT25OYW1lcyhuc3BjKSkpO1xuICAgIH1cbiAgICByZWY0ID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuICAgIGZvciAoayA9IDAsIGxlbjEgPSByZWY0Lmxlbmd0aDsgayA8IGxlbjE7IGsrKykge1xuICAgICAgbmFtZSA9IHJlZjRba107XG4gICAgICBkaXJlY3QgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpO1xuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChkaXJlY3QpKSB7XG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnVzZUZhbGxiYWNrcykge1xuICAgICAgZmFsbGJhY2sgPSB0aGlzLnJvb3QuZ2V0Q21kKCdmYWxsYmFjaycpO1xuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChmYWxsYmFjaykpIHtcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZmFsbGJhY2spO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcztcbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzO1xuICB9XG5cbiAgZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoY21kTmFtZSwgbmFtZXMgPSB0aGlzLm5hbWVzKSB7XG4gICAgdmFyIGosIGxlbiwgbmV4dCwgbmV4dHMsIHBvc2liaWxpdGllcztcbiAgICBwb3NpYmlsaXRpZXMgPSBbXTtcbiAgICBuZXh0cyA9IHRoaXMuZ2V0Q21kRm9sbG93QWxpYXMoY21kTmFtZSk7XG4gICAgZm9yIChqID0gMCwgbGVuID0gbmV4dHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5leHQgPSBuZXh0c1tqXTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIHJvb3Q6IG5leHRcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgfVxuICAgIHJldHVybiBwb3NpYmlsaXRpZXM7XG4gIH1cblxuICBnZXRDbWRGb2xsb3dBbGlhcyhuYW1lKSB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbY21kLCBjbWQuZ2V0QWxpYXNlZCgpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbY21kXTtcbiAgICB9XG4gICAgcmV0dXJuIFtjbWRdO1xuICB9XG5cbiAgY21kSXNWYWxpZChjbWQpIHtcbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGNtZC5uYW1lICE9PSAnZmFsbGJhY2snICYmIGluZGV4T2YuY2FsbCh0aGlzLmFuY2VzdG9ycygpLCBjbWQpID49IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLm11c3RFeGVjdXRlIHx8IHRoaXMuY21kSXNFeGVjdXRhYmxlKGNtZCk7XG4gIH1cblxuICBhbmNlc3RvcnMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gcmVmLmluSW5zdGFuY2UgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjbWRJc0V4ZWN1dGFibGUoY21kKSB7XG4gICAgdmFyIG5hbWVzO1xuICAgIG5hbWVzID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgfVxuICB9XG5cbiAgY21kU2NvcmUoY21kKSB7XG4gICAgdmFyIHNjb3JlO1xuICAgIHNjb3JlID0gY21kLmRlcHRoO1xuICAgIGlmIChjbWQubmFtZSA9PT0gJ2ZhbGxiYWNrJykge1xuICAgICAgc2NvcmUgLT0gMTAwMDtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3JlO1xuICB9XG5cbiAgYmVzdEluUG9zaWJpbGl0aWVzKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlO1xuICAgIGlmIChwb3NzLmxlbmd0aCA+IDApIHtcbiAgICAgIGJlc3QgPSBudWxsO1xuICAgICAgYmVzdFNjb3JlID0gbnVsbDtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHBvc3MubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHBvc3Nbal07XG4gICAgICAgIHNjb3JlID0gdGhpcy5jbWRTY29yZShwKTtcbiAgICAgICAgaWYgKChiZXN0ID09IG51bGwpIHx8IHNjb3JlID49IGJlc3RTY29yZSkge1xuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlO1xuICAgICAgICAgIGJlc3QgPSBwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBvcHRpb25hbFByb21pc2UgfSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IGNsYXNzIENtZEluc3RhbmNlXG4gIGNvbnN0cnVjdG9yOiAoQGNtZCxAY29udGV4dCkgLT5cbiAgXG4gIGluaXQ6IC0+XG4gICAgdW5sZXNzIEBpc0VtcHR5KCkgb3IgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIEBfZ2V0Q21kT2JqKClcbiAgICAgIEBfaW5pdFBhcmFtcygpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBAY21kT2JqLmluaXQoKVxuICAgIHJldHVybiB0aGlzXG4gIHNldFBhcmFtOihuYW1lLHZhbCktPlxuICAgIEBuYW1lZFtuYW1lXSA9IHZhbFxuICBwdXNoUGFyYW06KHZhbCktPlxuICAgIEBwYXJhbXMucHVzaCh2YWwpXG4gIGdldENvbnRleHQ6IC0+XG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgcmV0dXJuIEBjb250ZXh0IG9yIG5ldyBDb250ZXh0KClcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBnZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsbmFtZXNwYWNlczpAX2dldFBhcmVudE5hbWVzcGFjZXMoKSlcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzXG4gICAgcmV0dXJuIGZpbmRlclxuICBfZ2V0Q21kT2JqOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBAY21kLmluaXQoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWQoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuY2xzP1xuICAgICAgICBAY21kT2JqID0gbmV3IGNtZC5jbHModGhpcylcbiAgICAgICAgcmV0dXJuIEBjbWRPYmpcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQG5hbWVkID0gQGdldERlZmF1bHRzKClcbiAgX2dldFBhcmVudE5hbWVzcGFjZXM6IC0+XG4gICAgcmV0dXJuIFtdXG4gIGlzRW1wdHk6IC0+XG4gICAgcmV0dXJuIEBjbWQ/XG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWRGaW5hbCgpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICByZXR1cm4gQGNtZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldERlZmF1bHRzOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICByZXMgPSB7fVxuICAgICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBjbWQuZGVmYXVsdHMpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxAY21kT2JqLmdldERlZmF1bHRzKCkpXG4gICAgICByZXR1cm4gcmVzXG4gIGdldEFsaWFzZWQ6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHVubGVzcyBAYWxpYXNlZENtZD9cbiAgICAgICAgQGdldEFsaWFzZWRGaW5hbCgpXG4gICAgICByZXR1cm4gQGFsaWFzZWRDbWQgb3IgbnVsbFxuICBnZXRBbGlhc2VkRmluYWw6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBhbGlhc2VkRmluYWxDbWQ/XG4gICAgICAgIHJldHVybiBAYWxpYXNlZEZpbmFsQ21kIG9yIG51bGxcbiAgICAgIGlmIEBjbWQuYWxpYXNPZj9cbiAgICAgICAgYWxpYXNlZCA9IEBjbWRcbiAgICAgICAgd2hpbGUgYWxpYXNlZD8gYW5kIGFsaWFzZWQuYWxpYXNPZj9cbiAgICAgICAgICBhbGlhc2VkID0gYWxpYXNlZC5fYWxpYXNlZEZyb21GaW5kZXIoQGdldEZpbmRlcihAYWx0ZXJBbGlhc09mKGFsaWFzZWQuYWxpYXNPZikpKVxuICAgICAgICAgIHVubGVzcyBAYWxpYXNlZENtZD9cbiAgICAgICAgICAgIEBhbGlhc2VkQ21kID0gYWxpYXNlZCBvciBmYWxzZVxuICAgICAgICBAYWxpYXNlZEZpbmFsQ21kID0gYWxpYXNlZCBvciBmYWxzZVxuICAgICAgICByZXR1cm4gYWxpYXNlZFxuICBhbHRlckFsaWFzT2Y6IChhbGlhc09mKS0+XG4gICAgYWxpYXNPZlxuICBnZXRPcHRpb25zOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT3B0aW9ucz9cbiAgICAgICAgcmV0dXJuIEBjbWRPcHRpb25zXG4gICAgICBvcHQgPSBAY21kLl9vcHRpb25zRm9yQWxpYXNlZChAZ2V0QWxpYXNlZCgpKVxuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsQGNtZE9iai5nZXRPcHRpb25zKCkpXG4gICAgICBAY21kT3B0aW9ucyA9IG9wdFxuICAgICAgcmV0dXJuIG9wdFxuICBnZXRPcHRpb246IChrZXkpIC0+XG4gICAgb3B0aW9ucyA9IEBnZXRPcHRpb25zKClcbiAgICBpZiBvcHRpb25zPyBhbmQga2V5IG9mIG9wdGlvbnNcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV1cbiAgZ2V0UGFyYW06IChuYW1lcywgZGVmVmFsID0gbnVsbCkgLT5cbiAgICBuYW1lcyA9IFtuYW1lc10gaWYgKHR5cGVvZiBuYW1lcyBpbiBbJ3N0cmluZycsJ251bWJlciddKVxuICAgIGZvciBuIGluIG5hbWVzXG4gICAgICByZXR1cm4gQG5hbWVkW25dIGlmIEBuYW1lZFtuXT9cbiAgICAgIHJldHVybiBAcGFyYW1zW25dIGlmIEBwYXJhbXNbbl0/XG4gICAgcmV0dXJuIGRlZlZhbFxuICBnZXRCb29sUGFyYW06IChuYW1lcywgZGVmVmFsID0gbnVsbCkgLT5cbiAgICBmYWxzZVZhbHMgPSBbXCJcIixcIjBcIixcImZhbHNlXCIsXCJub1wiLFwibm9uZVwiLGZhbHNlLG51bGwsMF1cbiAgICB2YWwgPSBAZ2V0UGFyYW0obmFtZXMsIGRlZlZhbClcbiAgICAhZmFsc2VWYWxzLmluY2x1ZGVzKHZhbClcbiAgYW5jZXN0b3JDbWRzOiAtPlxuICAgIGlmIEBjb250ZXh0LmNvZGV3YXZlPy5pbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBjb250ZXh0LmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGFuY2VzdG9yQ21kc0FuZFNlbGY6IC0+XG4gICAgcmV0dXJuIEBhbmNlc3RvckNtZHMoKS5jb25jYXQoW0BjbWRdKVxuICBydW5FeGVjdXRlRnVuY3Q6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLmV4ZWN1dGUoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWRGaW5hbCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5leGVjdXRlRnVuY3Q/XG4gICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZUZ1bmN0KHRoaXMpXG4gIHJhd1Jlc3VsdDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmV0dXJuIEBjbWRPYmoucmVzdWx0KClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkRmluYWwoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQucmVzdWx0RnVuY3Q/XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0RnVuY3QodGhpcylcbiAgICAgIGlmIGNtZC5yZXN1bHRTdHI/XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0U3RyXG4gIHJlc3VsdDogLT4gXG4gICAgQGluaXQoKVxuICAgIGlmIEByZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICBvcHRpb25hbFByb21pc2UoQHJhd1Jlc3VsdCgpKS50aGVuIChyZXMpPT5cbiAgICAgICAgaWYgcmVzP1xuICAgICAgICAgIHJlcyA9IEBmb3JtYXRJbmRlbnQocmVzKVxuICAgICAgICAgIGlmIHJlcy5sZW5ndGggPiAwIGFuZCBAZ2V0T3B0aW9uKCdwYXJzZScsdGhpcykgXG4gICAgICAgICAgICBwYXJzZXIgPSBAZ2V0UGFyc2VyRm9yVGV4dChyZXMpXG4gICAgICAgICAgICByZXMgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgICAgIGlmIGFsdGVyRnVuY3QgPSBAZ2V0T3B0aW9uKCdhbHRlclJlc3VsdCcsdGhpcylcbiAgICAgICAgICAgIHJlcyA9IGFsdGVyRnVuY3QocmVzLHRoaXMpXG4gICAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgLnJlc3VsdCgpXG4gIGdldFBhcnNlckZvclRleHQ6ICh0eHQ9JycpIC0+XG4gICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKHR4dCksIHtpbkluc3RhbmNlOnRoaXN9KVxuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlXG4gICAgcmV0dXJuIHBhcnNlclxuICBnZXRJbmRlbnQ6IC0+XG4gICAgcmV0dXJuIDBcbiAgZm9ybWF0SW5kZW50OiAodGV4dCkgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx0L2csJyAgJylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBhcHBseUluZGVudDogKHRleHQpIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5pbmRlbnROb3RGaXJzdCh0ZXh0LEBnZXRJbmRlbnQoKSxcIiBcIikiLCJpbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIENvZGV3YXZlXG59IGZyb20gJy4vQ29kZXdhdmUnO1xuXG5pbXBvcnQge1xuICBUZXh0UGFyc2VyXG59IGZyb20gJy4vVGV4dFBhcnNlcic7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgb3B0aW9uYWxQcm9taXNlXG59IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgdmFyIENtZEluc3RhbmNlID0gY2xhc3MgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3RvcihjbWQxLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jbWQgPSBjbWQxO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICghKHRoaXMuaXNFbXB0eSgpIHx8IHRoaXMuaW5pdGVkKSkge1xuICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZ2V0Q21kT2JqKCk7XG4gICAgICB0aGlzLl9pbml0UGFyYW1zKCk7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNtZE9iai5pbml0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0UGFyYW0obmFtZSwgdmFsKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSB2YWw7XG4gIH1cblxuICBwdXNoUGFyYW0odmFsKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnB1c2godmFsKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IG5ldyBDb250ZXh0KCk7XG4gIH1cblxuICBnZXRGaW5kZXIoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXI7XG4gICAgZmluZGVyID0gdGhpcy5nZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pO1xuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXM7XG4gICAgcmV0dXJuIGZpbmRlcjtcbiAgfVxuXG4gIF9nZXRDbWRPYmooKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jbWQuaW5pdCgpO1xuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5jbHMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNtZE9iaiA9IG5ldyBjbWQuY2xzKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmo7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2luaXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWQgPSB0aGlzLmdldERlZmF1bHRzKCk7XG4gIH1cblxuICBfZ2V0UGFyZW50TmFtZXNwYWNlcygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLmNtZCAhPSBudWxsO1xuICB9XG5cbiAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgdmFyIGFsaWFzZWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jbWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgdmFyIGFsaWFzZWQsIHJlcztcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgcmVzID0ge307XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCBhbGlhc2VkLmdldERlZmF1bHRzKCkpO1xuICAgICAgfVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kLmRlZmF1bHRzKTtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZE9iai5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZCgpIHtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5hbGlhc2VkQ21kIHx8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZEZpbmFsKCkge1xuICAgIHZhciBhbGlhc2VkO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkRmluYWxDbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGlhc2VkRmluYWxDbWQgfHwgbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgYWxpYXNlZCA9IHRoaXMuY21kO1xuICAgICAgICB3aGlsZSAoKGFsaWFzZWQgIT0gbnVsbCkgJiYgKGFsaWFzZWQuYWxpYXNPZiAhPSBudWxsKSkge1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcih0aGlzLmdldEZpbmRlcih0aGlzLmFsdGVyQWxpYXNPZihhbGlhc2VkLmFsaWFzT2YpKSk7XG4gICAgICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmFsaWFzZWRDbWQgPSBhbGlhc2VkIHx8IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgfHwgZmFsc2U7XG4gICAgICAgIHJldHVybiBhbGlhc2VkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFsdGVyQWxpYXNPZihhbGlhc09mKSB7XG4gICAgcmV0dXJuIGFsaWFzT2Y7XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHZhciBvcHQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPcHRpb25zO1xuICAgICAgfVxuICAgICAgb3B0ID0gdGhpcy5jbWQuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKTtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmNtZE9iai5nZXRPcHRpb25zKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbWRPcHRpb25zID0gb3B0O1xuICAgICAgcmV0dXJuIG9wdDtcbiAgICB9XG4gIH1cblxuICBnZXRPcHRpb24oa2V5KSB7XG4gICAgdmFyIG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIGlmICgob3B0aW9ucyAhPSBudWxsKSAmJiBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICBnZXRQYXJhbShuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBpLCBsZW4sIG4sIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0eXBlb2YgbmFtZXMpID09PSAnc3RyaW5nJyB8fCByZWYgPT09ICdudW1iZXInKSkge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbiA9IG5hbWVzW2ldO1xuICAgICAgaWYgKHRoaXMubmFtZWRbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lZFtuXTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBhcmFtc1tuXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtc1tuXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlZlZhbDtcbiAgfVxuXG4gIGdldEJvb2xQYXJhbShuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBmYWxzZVZhbHMsIHZhbDtcbiAgICBmYWxzZVZhbHMgPSBbXCJcIiwgXCIwXCIsIFwiZmFsc2VcIiwgXCJub1wiLCBcIm5vbmVcIiwgZmFsc2UsIG51bGwsIDBdO1xuICAgIHZhbCA9IHRoaXMuZ2V0UGFyYW0obmFtZXMsIGRlZlZhbCk7XG4gICAgcmV0dXJuICFmYWxzZVZhbHMuaW5jbHVkZXModmFsKTtcbiAgfVxuXG4gIGFuY2VzdG9yQ21kcygpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBhbmNlc3RvckNtZHNBbmRTZWxmKCkge1xuICAgIHJldHVybiB0aGlzLmFuY2VzdG9yQ21kcygpLmNvbmNhdChbdGhpcy5jbWRdKTtcbiAgfVxuXG4gIHJ1bkV4ZWN1dGVGdW5jdCgpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmouZXhlY3V0ZSgpO1xuICAgICAgfVxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmV4ZWN1dGVGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZUZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJhd1Jlc3VsdCgpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0KCk7XG4gICAgICB9XG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQucmVzdWx0RnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKGNtZC5yZXN1bHRTdHIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0cjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgaWYgKHRoaXMucmVzdWx0SXNBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbmFsUHJvbWlzZSh0aGlzLnJhd1Jlc3VsdCgpKS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgdmFyIGFsdGVyRnVuY3QsIHBhcnNlcjtcbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzID0gdGhpcy5mb3JtYXRJbmRlbnQocmVzKTtcbiAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDAgJiYgdGhpcy5nZXRPcHRpb24oJ3BhcnNlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHBhcnNlciA9IHRoaXMuZ2V0UGFyc2VyRm9yVGV4dChyZXMpO1xuICAgICAgICAgICAgcmVzID0gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhbHRlckZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2FsdGVyUmVzdWx0JywgdGhpcykpIHtcbiAgICAgICAgICAgIHJlcyA9IGFsdGVyRnVuY3QocmVzLCB0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuICAgICAgfSkucmVzdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyc2VyRm9yVGV4dCh0eHQgPSAnJykge1xuICAgIHZhciBwYXJzZXI7XG4gICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKHR4dCksIHtcbiAgICAgIGluSW5zdGFuY2U6IHRoaXNcbiAgICB9KTtcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICByZXR1cm4gcGFyc2VyO1xuICB9XG5cbiAgZ2V0SW5kZW50KCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZm9ybWF0SW5kZW50KHRleHQpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywgJyAgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5SW5kZW50KHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmluZGVudE5vdEZpcnN0KHRleHQsIHRoaXMuZ2V0SW5kZW50KCksIFwiIFwiKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUHJvY2VzcyB9IGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSB9IGZyb20gJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcic7XG5pbXBvcnQgeyBQb3NDb2xsZWN0aW9uIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQ2xvc2luZ1Byb21wIH0gZnJvbSAnLi9DbG9zaW5nUHJvbXAnO1xuXG5leHBvcnQgY2xhc3MgQ29kZXdhdmVcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBvcHRpb25zID0ge30pIC0+XG4gICAgQ29kZXdhdmUuaW5pdCgpXG4gICAgQG1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nXG4gICAgQHZhcnMgPSB7fVxuICAgIFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ2JyYWtldHMnIDogJ35+JyxcbiAgICAgICdkZWNvJyA6ICd+JyxcbiAgICAgICdjbG9zZUNoYXInIDogJy8nLFxuICAgICAgJ25vRXhlY3V0ZUNoYXInIDogJyEnLFxuICAgICAgJ2NhcnJldENoYXInIDogJ3wnLFxuICAgICAgJ2NoZWNrQ2FycmV0JyA6IHRydWUsXG4gICAgICAnaW5JbnN0YW5jZScgOiBudWxsXG4gICAgfVxuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIFxuICAgIEBuZXN0ZWQgPSBpZiBAcGFyZW50PyB0aGVuIEBwYXJlbnQubmVzdGVkKzEgZWxzZSAwXG4gICAgXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgQGVkaXRvci5iaW5kZWRUbyh0aGlzKSBpZiBAZWRpdG9yP1xuICAgIFxuICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQodGhpcylcbiAgICBpZiBAaW5JbnN0YW5jZT9cbiAgICAgIEBjb250ZXh0LnBhcmVudCA9IEBpbkluc3RhbmNlLmNvbnRleHRcblxuICAgIEBsb2dnZXIgPSBuZXcgTG9nZ2VyKClcblxuICBvbkFjdGl2YXRpb25LZXk6IC0+XG4gICAgQHByb2Nlc3MgPSBuZXcgUHJvY2VzcygpXG4gICAgQGxvZ2dlci5sb2coJ2FjdGl2YXRpb24ga2V5JylcbiAgICBAcnVuQXRDdXJzb3JQb3MoKS50aGVuID0+XG4gICAgICBAcHJvY2VzcyA9IG51bGxcbiAgcnVuQXRDdXJzb3JQb3M6IC0+XG4gICAgaWYgQGVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICAgIEBydW5BdE11bHRpUG9zKEBlZGl0b3IuZ2V0TXVsdGlTZWwoKSlcbiAgICBlbHNlXG4gICAgICBAcnVuQXRQb3MoQGVkaXRvci5nZXRDdXJzb3JQb3MoKSlcbiAgcnVuQXRQb3M6IChwb3MpLT5cbiAgICB1bmxlc3MgcG9zP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDdXJzb3IgUG9zaXRpb24gaXMgZW1wdHknKVxuICAgIEBydW5BdE11bHRpUG9zKFtwb3NdKVxuICBydW5BdE11bHRpUG9zOiAobXVsdGlQb3MpLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBpZiBtdWx0aVBvcy5sZW5ndGggPiAwXG4gICAgICAgIGNtZCA9IEBjb21tYW5kT25Qb3MobXVsdGlQb3NbMF0uZW5kKVxuICAgICAgICBpZiBjbWQ/XG4gICAgICAgICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgICAgICAgY21kLnNldE11bHRpUG9zKG11bHRpUG9zKVxuICAgICAgICAgIGNtZC5pbml0KClcbiAgICAgICAgICBAbG9nZ2VyLmxvZyhjbWQpXG4gICAgICAgICAgY21kLmV4ZWN1dGUoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbXVsdGlQb3NbMF0uc3RhcnQgPT0gbXVsdGlQb3NbMF0uZW5kXG4gICAgICAgICAgICBAYWRkQnJha2V0cyhtdWx0aVBvcylcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcylcbiAgY29tbWFuZE9uUG9zOiAocG9zKSAtPlxuICAgIGlmIEBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIGFuZCBAZm9sbG93ZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAxIFxuICAgICAgcHJldiA9IHBvcy1AYnJha2V0cy5sZW5ndGhcbiAgICAgIG5leHQgPSBwb3NcbiAgICBlbHNlXG4gICAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAwXG4gICAgICAgIHBvcyAtPSBAYnJha2V0cy5sZW5ndGhcbiAgICAgIHByZXYgPSBAZmluZFByZXZCcmFrZXQocG9zKVxuICAgICAgdW5sZXNzIHByZXY/XG4gICAgICAgIHJldHVybiBudWxsIFxuICAgICAgbmV4dCA9IEBmaW5kTmV4dEJyYWtldChwb3MtMSlcbiAgICAgIGlmICFuZXh0PyBvciBAY291bnRQcmV2QnJha2V0KHByZXYpICUgMiAhPSAwIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMscHJldixAZWRpdG9yLnRleHRTdWJzdHIocHJldixuZXh0K0BicmFrZXRzLmxlbmd0aCkpXG4gIG5leHRDbWQ6IChzdGFydCA9IDApIC0+XG4gICAgcG9zID0gc3RhcnRcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyAsW0BicmFrZXRzLFwiXFxuXCJdKVxuICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGhcbiAgICAgIGlmIGYuc3RyID09IEBicmFrZXRzXG4gICAgICAgIGlmIGJlZ2lubmluZz9cbiAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIEBlZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zK0BicmFrZXRzLmxlbmd0aCkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvc1xuICAgICAgZWxzZVxuICAgICAgICBiZWdpbm5pbmcgPSBudWxsXG4gICAgbnVsbFxuICBnZXRFbmNsb3NpbmdDbWQ6IChwb3MgPSAwKSAtPlxuICAgIGNwb3MgPSBwb3NcbiAgICBjbG9zaW5nUHJlZml4ID0gQGJyYWtldHMgKyBAY2xvc2VDaGFyXG4gICAgd2hpbGUgKHAgPSBAZmluZE5leHQoY3BvcyxjbG9zaW5nUHJlZml4KSk/XG4gICAgICBpZiBjbWQgPSBAY29tbWFuZE9uUG9zKHArY2xvc2luZ1ByZWZpeC5sZW5ndGgpXG4gICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgICAgaWYgY21kLnBvcyA8IHBvc1xuICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgIGVsc2VcbiAgICAgICAgY3BvcyA9IHArY2xvc2luZ1ByZWZpeC5sZW5ndGhcbiAgICBudWxsXG4gIHByZWNlZGVkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLUBicmFrZXRzLmxlbmd0aCxwb3MpID09IEBicmFrZXRzXG4gIGZvbGxvd2VkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLHBvcytAYnJha2V0cy5sZW5ndGgpID09IEBicmFrZXRzXG4gIGNvdW50UHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICBpID0gMFxuICAgIHdoaWxlIChzdGFydCA9IEBmaW5kUHJldkJyYWtldChzdGFydCkpP1xuICAgICAgaSsrXG4gICAgcmV0dXJuIGlcbiAgaXNFbmRMaW5lOiAocG9zKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrMSkgPT0gXCJcXG5cIiBvciBwb3MgKyAxID49IEBlZGl0b3IudGV4dExlbigpXG4gIGZpbmRQcmV2QnJha2V0OiAoc3RhcnQpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHRCcmFrZXQoc3RhcnQsLTEpXG4gIGZpbmROZXh0QnJha2V0OiAoc3RhcnQsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW0BicmFrZXRzLFwiXFxuXCJdLCBkaXJlY3Rpb24pXG4gICAgXG4gICAgZi5wb3MgaWYgZiBhbmQgZi5zdHIgPT0gQGJyYWtldHNcbiAgZmluZFByZXY6IChzdGFydCxzdHJpbmcpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHQoc3RhcnQsc3RyaW5nLC0xKVxuICBmaW5kTmV4dDogKHN0YXJ0LHN0cmluZyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBmID0gQGZpbmRBbnlOZXh0KHN0YXJ0ICxbc3RyaW5nXSwgZGlyZWN0aW9uKVxuICAgIGYucG9zIGlmIGZcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci5maW5kQW55TmV4dChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbilcbiAgICBcbiAgZmluZE1hdGNoaW5nUGFpcjogKHN0YXJ0UG9zLG9wZW5pbmcsY2xvc2luZyxkaXJlY3Rpb24gPSAxKSAtPlxuICAgIHBvcyA9IHN0YXJ0UG9zXG4gICAgbmVzdGVkID0gMFxuICAgIHdoaWxlIGYgPSBAZmluZEFueU5leHQocG9zLFtjbG9zaW5nLG9wZW5pbmddLGRpcmVjdGlvbilcbiAgICAgIHBvcyA9IGYucG9zICsgKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBmLnN0ci5sZW5ndGggZWxzZSAwKVxuICAgICAgaWYgZi5zdHIgPT0gKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBjbG9zaW5nIGVsc2Ugb3BlbmluZylcbiAgICAgICAgaWYgbmVzdGVkID4gMFxuICAgICAgICAgIG5lc3RlZC0tXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZlxuICAgICAgZWxzZVxuICAgICAgICBuZXN0ZWQrK1xuICAgIG51bGxcbiAgYWRkQnJha2V0czogKHBvcykgLT5cbiAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpXG4gICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAoQGJyYWtldHMsQGJyYWtldHMpLm1hcCggKHIpLT5yLnNlbGVjdENvbnRlbnQoKSApXG4gICAgQGVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIHByb21wdENsb3NpbmdDbWQ6IChzZWxlY3Rpb25zKSAtPlxuICAgIEBjbG9zaW5nUHJvbXAuc3RvcCgpIGlmIEBjbG9zaW5nUHJvbXA/XG4gICAgQGNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcC5uZXdGb3IodGhpcyxzZWxlY3Rpb25zKS5iZWdpbigpXG4gIHBhcnNlQWxsOiAocmVjdXJzaXZlID0gdHJ1ZSkgLT5cbiAgICBpZiBAbmVzdGVkID4gMTAwXG4gICAgICB0aHJvdyBcIkluZmluaXRlIHBhcnNpbmcgUmVjdXJzaW9uXCJcbiAgICBwb3MgPSAwXG4gICAgd2hpbGUgY21kID0gQG5leHRDbWQocG9zKVxuICAgICAgcG9zID0gY21kLmdldEVuZFBvcygpXG4gICAgICBAZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpXG4gICAgICAjIGNvbnNvbGUubG9nKGNtZClcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIHJlY3Vyc2l2ZSBhbmQgY21kLmNvbnRlbnQ/IGFuZCAoIWNtZC5nZXRDbWQoKT8gb3IgIWNtZC5nZXRPcHRpb24oJ3ByZXZlbnRQYXJzZUFsbCcpKVxuICAgICAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIoY21kLmNvbnRlbnQpLCB7cGFyZW50OiB0aGlzfSlcbiAgICAgICAgY21kLmNvbnRlbnQgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgcmVzID0gIGNtZC5leGVjdXRlKClcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgaWYgcmVzLnRoZW4/XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3luYyBuZXN0ZWQgY29tbWFuZHMgYXJlIG5vdCBzdXBwb3J0ZWQnKVxuICAgICAgICBpZiBjbWQucmVwbGFjZUVuZD9cbiAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcG9zID0gQGVkaXRvci5nZXRDdXJzb3JQb3MoKS5lbmRcbiAgICByZXR1cm4gQGdldFRleHQoKVxuICBnZXRUZXh0OiAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHQoKVxuICBpc1Jvb3Q6IC0+XG4gICAgcmV0dXJuICFAcGFyZW50PyBhbmQgKCFAaW5JbnN0YW5jZT8gb3IgIUBpbkluc3RhbmNlLmZpbmRlcj8pXG4gIGdldFJvb3Q6IC0+XG4gICAgaWYgQGlzUm9vdCgpXG4gICAgICByZXR1cm4gdGhpc1xuICAgIGVsc2UgaWYgQHBhcmVudD9cbiAgICAgIHJldHVybiBAcGFyZW50LmdldFJvb3QoKVxuICAgIGVsc2UgaWYgQGluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpXG4gIGdldEZpbGVTeXN0ZW06IC0+XG4gICAgaWYgQGVkaXRvci5maWxlU3lzdGVtXG4gICAgICByZXR1cm4gQGVkaXRvci5maWxlU3lzdGVtXG4gICAgZWxzZSBpZiBAaXNSb290KClcbiAgICAgIHJldHVybiBudWxsXG4gICAgZWxzZSBpZiBAcGFyZW50P1xuICAgICAgcmV0dXJuIEBwYXJlbnQuZ2V0Um9vdCgpXG4gICAgZWxzZSBpZiBAaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KClcbiAgcmVtb3ZlQ2FycmV0OiAodHh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHR4dCxAY2FycmV0Q2hhcilcbiAgZ2V0Q2FycmV0UG9zOiAodHh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCxAY2FycmV0Q2hhcilcbiAgcmVnTWFya2VyOiAoZmxhZ3M9XCJnXCIpIC0+XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAbWFya2VyKSwgZmxhZ3MpXG4gIHJlbW92ZU1hcmtlcnM6ICh0ZXh0KSAtPlxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoQHJlZ01hcmtlcigpLCcnKVxuXG4gIEBpbml0OiAtPlxuICAgIHVubGVzcyBAaW5pdGVkXG4gICAgICBAaW5pdGVkID0gdHJ1ZVxuICAgICAgQ29tbWFuZC5pbml0Q21kcygpXG4gICAgICBDb21tYW5kLmxvYWRDbWRzKClcblxuICBAaW5pdGVkOiBmYWxzZSIsImltcG9ydCB7XG4gIFByb2Nlc3Ncbn0gZnJvbSAnLi9Qcm9jZXNzJztcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBQb3NpdGlvbmVkQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UnO1xuXG5pbXBvcnQge1xuICBUZXh0UGFyc2VyXG59IGZyb20gJy4vVGV4dFBhcnNlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgTG9nZ2VyXG59IGZyb20gJy4vTG9nZ2VyJztcblxuaW1wb3J0IHtcbiAgUG9zQ29sbGVjdGlvblxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIENsb3NpbmdQcm9tcFxufSBmcm9tICcuL0Nsb3NpbmdQcm9tcCc7XG5cbmV4cG9ydCB2YXIgQ29kZXdhdmUgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIENvZGV3YXZlIHtcbiAgICBjb25zdHJ1Y3RvcihlZGl0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgICAgQ29kZXdhdmUuaW5pdCgpO1xuICAgICAgdGhpcy5tYXJrZXIgPSAnW1tbW2NvZGV3YXZlX21hcnF1ZXJdXV1dJztcbiAgICAgIHRoaXMudmFycyA9IHt9O1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICdicmFrZXRzJzogJ35+JyxcbiAgICAgICAgJ2RlY28nOiAnficsXG4gICAgICAgICdjbG9zZUNoYXInOiAnLycsXG4gICAgICAgICdub0V4ZWN1dGVDaGFyJzogJyEnLFxuICAgICAgICAnY2FycmV0Q2hhcic6ICd8JyxcbiAgICAgICAgJ2NoZWNrQ2FycmV0JzogdHJ1ZSxcbiAgICAgICAgJ2luSW5zdGFuY2UnOiBudWxsXG4gICAgICB9O1xuICAgICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcbiAgICAgIHRoaXMubmVzdGVkID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50Lm5lc3RlZCArIDEgOiAwO1xuICAgICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICB9IGVsc2UgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVkaXRvciAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLmJpbmRlZFRvKHRoaXMpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcyk7XG4gICAgICBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMuaW5JbnN0YW5jZS5jb250ZXh0O1xuICAgICAgfVxuICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG4gICAgfVxuXG4gICAgb25BY3RpdmF0aW9uS2V5KCkge1xuICAgICAgdGhpcy5wcm9jZXNzID0gbmV3IFByb2Nlc3MoKTtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKTtcbiAgICAgIHJldHVybiB0aGlzLnJ1bkF0Q3Vyc29yUG9zKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3MgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcnVuQXRDdXJzb3JQb3MoKSB7XG4gICAgICBpZiAodGhpcy5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkF0TXVsdGlQb3ModGhpcy5lZGl0b3IuZ2V0TXVsdGlTZWwoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdFBvcyh0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcnVuQXRQb3MocG9zKSB7XG4gICAgICBpZiAocG9zID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDdXJzb3IgUG9zaXRpb24gaXMgZW1wdHknKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJ1bkF0TXVsdGlQb3MoW3Bvc10pO1xuICAgIH1cblxuICAgIHJ1bkF0TXVsdGlQb3MobXVsdGlQb3MpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIGNtZDtcbiAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpO1xuICAgICAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgY21kLnNldE11bHRpUG9zKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNtZC5pbml0KCk7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coY21kKTtcbiAgICAgICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobXVsdGlQb3NbMF0uc3RhcnQgPT09IG11bHRpUG9zWzBdLmVuZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGRCcmFrZXRzKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21wdENsb3NpbmdDbWQobXVsdGlQb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29tbWFuZE9uUG9zKHBvcykge1xuICAgICAgdmFyIG5leHQsIHByZXY7XG4gICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuZm9sbG93ZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMSkge1xuICAgICAgICBwcmV2ID0gcG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgbmV4dCA9IHBvcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnByZWNlZGVkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDApIHtcbiAgICAgICAgICBwb3MgLT0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2ID0gdGhpcy5maW5kUHJldkJyYWtldChwb3MpO1xuICAgICAgICBpZiAocHJldiA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dCA9IHRoaXMuZmluZE5leHRCcmFrZXQocG9zIC0gMSk7XG4gICAgICAgIGlmICgobmV4dCA9PSBudWxsKSB8fCB0aGlzLmNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT09IDApIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgcHJldiwgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwcmV2LCBuZXh0ICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpO1xuICAgIH1cblxuICAgIG5leHRDbWQoc3RhcnQgPSAwKSB7XG4gICAgICB2YXIgYmVnaW5uaW5nLCBmLCBwb3M7XG4gICAgICBwb3MgPSBzdGFydDtcbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFt0aGlzLmJyYWtldHMsIFwiXFxuXCJdKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIGYuc3RyLmxlbmd0aDtcbiAgICAgICAgaWYgKGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGJlZ2lubmluZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBiZWdpbm5pbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIGJlZ2lubmluZywgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvcztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmVnaW5uaW5nID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0RW5jbG9zaW5nQ21kKHBvcyA9IDApIHtcbiAgICAgIHZhciBjbG9zaW5nUHJlZml4LCBjbWQsIGNwb3MsIHA7XG4gICAgICBjcG9zID0gcG9zO1xuICAgICAgY2xvc2luZ1ByZWZpeCA9IHRoaXMuYnJha2V0cyArIHRoaXMuY2xvc2VDaGFyO1xuICAgICAgd2hpbGUgKChwID0gdGhpcy5maW5kTmV4dChjcG9zLCBjbG9zaW5nUHJlZml4KSkgIT0gbnVsbCkge1xuICAgICAgICBpZiAoY21kID0gdGhpcy5jb21tYW5kT25Qb3MocCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoKSkge1xuICAgICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKCk7XG4gICAgICAgICAgaWYgKGNtZC5wb3MgPCBwb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNwb3MgPSBwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByZWNlZGVkQnlCcmFrZXRzKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aCwgcG9zKSA9PT0gdGhpcy5icmFrZXRzO1xuICAgIH1cblxuICAgIGZvbGxvd2VkQnlCcmFrZXRzKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSA9PT0gdGhpcy5icmFrZXRzO1xuICAgIH1cblxuICAgIGNvdW50UHJldkJyYWtldChzdGFydCkge1xuICAgICAgdmFyIGk7XG4gICAgICBpID0gMDtcbiAgICAgIHdoaWxlICgoc3RhcnQgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHN0YXJ0KSkgIT0gbnVsbCkge1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBpc0VuZExpbmUocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIDEpID09PSBcIlxcblwiIHx8IHBvcyArIDEgPj0gdGhpcy5lZGl0b3IudGV4dExlbigpO1xuICAgIH1cblxuICAgIGZpbmRQcmV2QnJha2V0KHN0YXJ0KSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dEJyYWtldChzdGFydCwgLTEpO1xuICAgIH1cblxuICAgIGZpbmROZXh0QnJha2V0KHN0YXJ0LCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZjtcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSwgZGlyZWN0aW9uKTtcbiAgICAgIGlmIChmICYmIGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgcmV0dXJuIGYucG9zO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRQcmV2KHN0YXJ0LCBzdHJpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmROZXh0KHN0YXJ0LCBzdHJpbmcsIC0xKTtcbiAgICB9XG5cbiAgICBmaW5kTmV4dChzdGFydCwgc3RyaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZjtcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbc3RyaW5nXSwgZGlyZWN0aW9uKTtcbiAgICAgIGlmIChmKSB7XG4gICAgICAgIHJldHVybiBmLnBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIGZpbmRNYXRjaGluZ1BhaXIoc3RhcnRQb3MsIG9wZW5pbmcsIGNsb3NpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmLCBuZXN0ZWQsIHBvcztcbiAgICAgIHBvcyA9IHN0YXJ0UG9zO1xuICAgICAgbmVzdGVkID0gMDtcbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtjbG9zaW5nLCBvcGVuaW5nXSwgZGlyZWN0aW9uKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIChkaXJlY3Rpb24gPiAwID8gZi5zdHIubGVuZ3RoIDogMCk7XG4gICAgICAgIGlmIChmLnN0ciA9PT0gKGRpcmVjdGlvbiA+IDAgPyBjbG9zaW5nIDogb3BlbmluZykpIHtcbiAgICAgICAgICBpZiAobmVzdGVkID4gMCkge1xuICAgICAgICAgICAgbmVzdGVkLS07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXN0ZWQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgYWRkQnJha2V0cyhwb3MpIHtcbiAgICAgIHZhciByZXBsYWNlbWVudHM7XG4gICAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpO1xuICAgICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAodGhpcy5icmFrZXRzLCB0aGlzLmJyYWtldHMpLm1hcChmdW5jdGlvbihyKSB7XG4gICAgICAgIHJldHVybiByLnNlbGVjdENvbnRlbnQoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gICAgfVxuXG4gICAgcHJvbXB0Q2xvc2luZ0NtZChzZWxlY3Rpb25zKSB7XG4gICAgICBpZiAodGhpcy5jbG9zaW5nUHJvbXAgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNsb3NpbmdQcm9tcC5zdG9wKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUHJvbXAgPSBDbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsIHNlbGVjdGlvbnMpLmJlZ2luKCk7XG4gICAgfVxuXG4gICAgcGFyc2VBbGwocmVjdXJzaXZlID0gdHJ1ZSkge1xuICAgICAgdmFyIGNtZCwgcGFyc2VyLCBwb3MsIHJlcztcbiAgICAgIGlmICh0aGlzLm5lc3RlZCA+IDEwMCkge1xuICAgICAgICB0aHJvdyBcIkluZmluaXRlIHBhcnNpbmcgUmVjdXJzaW9uXCI7XG4gICAgICB9XG4gICAgICBwb3MgPSAwO1xuICAgICAgd2hpbGUgKGNtZCA9IHRoaXMubmV4dENtZChwb3MpKSB7XG4gICAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKTtcbiAgICAgICAgdGhpcy5lZGl0b3Iuc2V0Q3Vyc29yUG9zKHBvcyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGNtZClcbiAgICAgICAgY21kLmluaXQoKTtcbiAgICAgICAgaWYgKHJlY3Vyc2l2ZSAmJiAoY21kLmNvbnRlbnQgIT0gbnVsbCkgJiYgKChjbWQuZ2V0Q21kKCkgPT0gbnVsbCkgfHwgIWNtZC5nZXRPcHRpb24oJ3ByZXZlbnRQYXJzZUFsbCcpKSkge1xuICAgICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcihjbWQuY29udGVudCksIHtcbiAgICAgICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNtZC5jb250ZW50ID0gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gY21kLmV4ZWN1dGUoKTtcbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgaWYgKHJlcy50aGVuICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN5bmMgbmVzdGVkIGNvbW1hbmRzIGFyZSBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjbWQucmVwbGFjZUVuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCkuZW5kO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VGV4dCgpO1xuICAgIH1cblxuICAgIGdldFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dCgpO1xuICAgIH1cblxuICAgIGlzUm9vdCgpIHtcbiAgICAgIHJldHVybiAodGhpcy5wYXJlbnQgPT0gbnVsbCkgJiYgKCh0aGlzLmluSW5zdGFuY2UgPT0gbnVsbCkgfHwgKHRoaXMuaW5JbnN0YW5jZS5maW5kZXIgPT0gbnVsbCkpO1xuICAgIH1cblxuICAgIGdldFJvb3QoKSB7XG4gICAgICBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Um9vdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRGaWxlU3lzdGVtKCkge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmZpbGVTeXN0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbGVTeXN0ZW07XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNSb290KCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2FycmV0KHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodHh0LCB0aGlzLmNhcnJldENoYXIpO1xuICAgIH1cblxuICAgIGdldENhcnJldFBvcyh0eHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCwgdGhpcy5jYXJyZXRDaGFyKTtcbiAgICB9XG5cbiAgICByZWdNYXJrZXIoZmxhZ3MgPSBcImdcIikge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm1hcmtlciksIGZsYWdzKTtcbiAgICB9XG5cbiAgICByZW1vdmVNYXJrZXJzKHRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UodGhpcy5yZWdNYXJrZXIoKSwgJycpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRlZCkge1xuICAgICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICAgIENvbW1hbmQuaW5pdENtZHMoKTtcbiAgICAgICAgcmV0dXJuIENvbW1hbmQubG9hZENtZHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfTtcblxuICBDb2Rld2F2ZS5pbml0ZWQgPSBmYWxzZTtcblxuICByZXR1cm4gQ29kZXdhdmU7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgU3RvcmFnZSB9IGZyb20gJy4vU3RvcmFnZSc7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuXG5fb3B0S2V5ID0gKGtleSxkaWN0LGRlZlZhbCA9IG51bGwpIC0+XG4gICMgb3B0aW9uYWwgRGljdGlvbmFyeSBrZXlcbiAgcmV0dXJuIGlmIGtleSBvZiBkaWN0IHRoZW4gZGljdFtrZXldIGVsc2UgZGVmVmFsXG5cblxuZXhwb3J0IGNsYXNzIENvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAbmFtZSxAZGF0YT1udWxsLHBhcmVudD1udWxsKSAtPlxuICAgIEBjbWRzID0gW11cbiAgICBAZGV0ZWN0b3JzID0gW11cbiAgICBAZXhlY3V0ZUZ1bmN0ID0gQHJlc3VsdEZ1bmN0ID0gQHJlc3VsdFN0ciA9IEBhbGlhc09mID0gQGNscyA9IG51bGxcbiAgICBAYWxpYXNlZCA9IG51bGxcbiAgICBAZnVsbE5hbWUgPSBAbmFtZVxuICAgIEBkZXB0aCA9IDBcbiAgICBbQF9wYXJlbnQsIEBfaW5pdGVkXSA9IFtudWxsLCBmYWxzZV1cbiAgICBAc2V0UGFyZW50KHBhcmVudClcbiAgICBAZGVmYXVsdHMgPSB7fVxuICAgIFxuICAgIEBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgY2hlY2tDYXJyZXQ6IHRydWUsXG4gICAgICBwYXJzZTogZmFsc2UsXG4gICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgYWx0ZXJSZXN1bHQ6IG51bGwsXG4gICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgICBhbGxvd2VkTmFtZWQ6IG51bGxcbiAgICB9XG4gICAgQG9wdGlvbnMgPSB7fVxuICAgIEBmaW5hbE9wdGlvbnMgPSBudWxsXG4gIHBhcmVudDogLT5cbiAgICByZXR1cm4gQF9wYXJlbnRcbiAgc2V0UGFyZW50OiAodmFsdWUpIC0+XG4gICAgaWYgQF9wYXJlbnQgIT0gdmFsdWVcbiAgICAgIEBfcGFyZW50ID0gdmFsdWVcbiAgICAgIEBmdWxsTmFtZSA9IChcbiAgICAgICAgaWYgQF9wYXJlbnQ/IGFuZCBAX3BhcmVudC5uYW1lP1xuICAgICAgICAgIEBfcGFyZW50LmZ1bGxOYW1lICsgJzonICsgQG5hbWUgXG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgQG5hbWVcbiAgICAgIClcbiAgICAgIEBkZXB0aCA9IChcbiAgICAgICAgaWYgQF9wYXJlbnQ/IGFuZCBAX3BhcmVudC5kZXB0aD9cbiAgICAgICAgdGhlbiBAX3BhcmVudC5kZXB0aCArIDFcbiAgICAgICAgZWxzZSAwXG4gICAgICApXG4gIGluaXQ6IC0+XG4gICAgaWYgIUBfaW5pdGVkXG4gICAgICBAX2luaXRlZCA9IHRydWVcbiAgICAgIEBwYXJzZURhdGEoQGRhdGEpXG4gICAgcmV0dXJuIHRoaXNcbiAgdW5yZWdpc3RlcjogLT5cbiAgICBAX3BhcmVudC5yZW1vdmVDbWQodGhpcylcbiAgaXNFZGl0YWJsZTogLT5cbiAgICByZXR1cm4gQHJlc3VsdFN0cj8gb3IgQGFsaWFzT2Y/XG4gIGlzRXhlY3V0YWJsZTogLT5cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICBmb3IgcCBpbiBbJ3Jlc3VsdFN0cicsJ3Jlc3VsdEZ1bmN0JywnY2xzJywnZXhlY3V0ZUZ1bmN0J11cbiAgICAgIGlmIHRoaXNbcF0/XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIGlzRXhlY3V0YWJsZVdpdGhOYW1lOiAobmFtZSkgLT5cbiAgICBpZiBAYWxpYXNPZj9cbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICBhbGlhc09mID0gQGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJyxuYW1lKVxuICAgICAgYWxpYXNlZCA9IEBfYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBAaXNFeGVjdXRhYmxlKClcbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgIGZvciBwIGluIFsncmVzdWx0U3RyJywncmVzdWx0RnVuY3QnXVxuICAgICAgaWYgdGhpc1twXT9cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgcmVzID0ge31cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGRlZmF1bHRzKVxuICAgIHJldHVybiByZXNcbiAgX2FsaWFzZWRGcm9tRmluZGVyOiAoZmluZGVyKSAtPlxuICAgICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlXG4gICAgICBmaW5kZXIubXVzdEV4ZWN1dGUgPSBmYWxzZVxuICAgICAgZmluZGVyLnVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICByZXR1cm4gZmluZGVyLmZpbmQoKVxuICBnZXRBbGlhc2VkOiAtPlxuICAgIGlmIEBhbGlhc09mP1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgIHJldHVybiBAX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKEBhbGlhc09mKSlcbiAgc2V0T3B0aW9uczogKGRhdGEpIC0+XG4gICAgZm9yIGtleSwgdmFsIG9mIGRhdGFcbiAgICAgIGlmIGtleSBvZiBAZGVmYXVsdE9wdGlvbnNcbiAgICAgICAgQG9wdGlvbnNba2V5XSA9IHZhbFxuICBfb3B0aW9uc0ZvckFsaWFzZWQ6IChhbGlhc2VkKSAtPlxuICAgIG9wdCA9IHt9XG4gICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsQGRlZmF1bHRPcHRpb25zKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxhbGlhc2VkLmdldE9wdGlvbnMoKSlcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihvcHQsQG9wdGlvbnMpXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIEBfb3B0aW9uc0ZvckFsaWFzZWQoQGdldEFsaWFzZWQoKSlcbiAgZ2V0T3B0aW9uOiAoa2V5KSAtPlxuICAgIG9wdGlvbnMgPSBAZ2V0T3B0aW9ucygpXG4gICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV1cbiAgaGVscDogLT5cbiAgICBjbWQgPSBAZ2V0Q21kKCdoZWxwJylcbiAgICBpZiBjbWQ/XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHJcbiAgcGFyc2VEYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IGRhdGFcbiAgICBpZiB0eXBlb2YgZGF0YSA9PSAnc3RyaW5nJ1xuICAgICAgQHJlc3VsdFN0ciA9IGRhdGFcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlIGlmIGRhdGE/XG4gICAgICByZXR1cm4gQHBhcnNlRGljdERhdGEoZGF0YSlcbiAgICByZXR1cm4gZmFsc2VcbiAgcGFyc2VEaWN0RGF0YTogKGRhdGEpIC0+XG4gICAgcmVzID0gX29wdEtleSgncmVzdWx0JyxkYXRhKVxuICAgIGlmIHR5cGVvZiByZXMgPT0gXCJmdW5jdGlvblwiXG4gICAgICBAcmVzdWx0RnVuY3QgPSByZXNcbiAgICBlbHNlIGlmIHJlcz9cbiAgICAgIEByZXN1bHRTdHIgPSByZXNcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJyxkYXRhKVxuICAgIGlmIHR5cGVvZiBleGVjdXRlID09IFwiZnVuY3Rpb25cIlxuICAgICAgQGV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGVcbiAgICBAYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLGRhdGEpXG4gICAgQGNscyA9IF9vcHRLZXkoJ2NscycsZGF0YSlcbiAgICBAZGVmYXVsdHMgPSBfb3B0S2V5KCdkZWZhdWx0cycsZGF0YSxAZGVmYXVsdHMpXG4gICAgXG4gICAgQHNldE9wdGlvbnMoZGF0YSlcbiAgICBcbiAgICBpZiAnaGVscCcgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsZGF0YVsnaGVscCddLHRoaXMpKVxuICAgIGlmICdmYWxsYmFjaycgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLGRhdGFbJ2ZhbGxiYWNrJ10sdGhpcykpXG4gICAgICBcbiAgICBpZiAnY21kcycgb2YgZGF0YVxuICAgICAgQGFkZENtZHMoZGF0YVsnY21kcyddKVxuICAgIHJldHVybiB0cnVlXG4gIGFkZENtZHM6IChjbWRzKSAtPlxuICAgIGZvciBuYW1lLCBkYXRhIG9mIGNtZHNcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQobmFtZSxkYXRhLHRoaXMpKVxuICBhZGRDbWQ6IChjbWQpIC0+XG4gICAgZXhpc3RzID0gQGdldENtZChjbWQubmFtZSlcbiAgICBpZiBleGlzdHM/XG4gICAgICBAcmVtb3ZlQ21kKGV4aXN0cylcbiAgICBjbWQuc2V0UGFyZW50KHRoaXMpXG4gICAgQGNtZHMucHVzaChjbWQpXG4gICAgcmV0dXJuIGNtZFxuICByZW1vdmVDbWQ6IChjbWQpIC0+XG4gICAgaWYgKGkgPSBAY21kcy5pbmRleE9mKGNtZCkpID4gLTFcbiAgICAgIEBjbWRzLnNwbGljZShpLCAxKVxuICAgIHJldHVybiBjbWRcbiAgZ2V0Q21kOiAoZnVsbG5hbWUpIC0+XG4gICAgQGluaXQoKVxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgcmV0dXJuIEBnZXRDbWQoc3BhY2UpPy5nZXRDbWQobmFtZSlcbiAgICBmb3IgY21kIGluIEBjbWRzXG4gICAgICBpZiBjbWQubmFtZSA9PSBuYW1lXG4gICAgICAgIHJldHVybiBjbWRcbiAgc2V0Q21kRGF0YTogKGZ1bGxuYW1lLGRhdGEpIC0+XG4gICAgQHNldENtZChmdWxsbmFtZSxuZXcgQ29tbWFuZChmdWxsbmFtZS5zcGxpdCgnOicpLnBvcCgpLGRhdGEpKVxuICBzZXRDbWQ6IChmdWxsbmFtZSxjbWQpIC0+XG4gICAgW3NwYWNlLG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpXG4gICAgaWYgc3BhY2U/XG4gICAgICBuZXh0ID0gQGdldENtZChzcGFjZSlcbiAgICAgIHVubGVzcyBuZXh0P1xuICAgICAgICBuZXh0ID0gQGFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpXG4gICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSxjbWQpXG4gICAgZWxzZVxuICAgICAgQGFkZENtZChjbWQpXG4gICAgICByZXR1cm4gY21kXG4gIGFkZERldGVjdG9yOiAoZGV0ZWN0b3IpIC0+XG4gICAgQGRldGVjdG9ycy5wdXNoKGRldGVjdG9yKVxuICAgIFxuICBAcHJvdmlkZXJzID0gW11cblxuICBAc3RvcmFnZSA9IG5ldyBTdG9yYWdlKClcblxuICBAaW5pdENtZHM6IC0+XG4gICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCx7XG4gICAgICAnY21kcyc6e1xuICAgICAgICAnaGVsbG8nOntcbiAgICAgICAgICBoZWxwOiBcIlwiXCJcbiAgICAgICAgICBcIkhlbGxvLCB3b3JsZCFcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxuICAgICAgICAgIG1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xuICAgICAgICAgIHZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYVxuICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGZvciBwcm92aWRlciBpbiBAcHJvdmlkZXJzXG4gICAgICBwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpXG5cbiAgQHNhdmVDbWQ6IChmdWxsbmFtZSwgZGF0YSkgLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSxkYXRhKVxuICAgIC50aGVuID0+XG4gICAgICBAc3RvcmFnZS5zYXZlSW5QYXRoKCdjbWRzJywgZnVsbG5hbWUsIGRhdGEpXG5cbiAgQGxvYWRDbWRzOiAtPlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgIHNhdmVkQ21kcyA9IEBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgIC50aGVuIChzYXZlZENtZHMpPT5cbiAgICAgIGlmIHNhdmVkQ21kcz8gXG4gICAgICAgIGZvciBmdWxsbmFtZSwgZGF0YSBvZiBzYXZlZENtZHNcbiAgICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSlcblxuICBAcmVzZXRTYXZlZDogLT5cbiAgICBAc3RvcmFnZS5zYXZlKCdjbWRzJyx7fSlcblxuICBAbWFrZVZhckNtZCA9IChuYW1lLGJhc2U9e30pIC0+IFxuICAgIGJhc2UuZXhlY3V0ZSA9IChpbnN0YW5jZSkgLT5cbiAgICAgIHZhbCA9IGlmIChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpP1xuICAgICAgICBwXG4gICAgICBlbHNlIGlmIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgICAgaW5zdGFuY2UuY29udGVudFxuICAgICAgaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHZhbCBpZiB2YWw/XG4gICAgcmV0dXJuIGJhc2VcblxuICBAbWFrZUJvb2xWYXJDbWQgPSAobmFtZSxiYXNlPXt9KSAtPiBcbiAgICBiYXNlLmV4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHVubGVzcyB2YWw/IGFuZCB2YWwgaW4gWycwJywnZmFsc2UnLCdubyddXG4gICAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlXG4gICAgcmV0dXJuIGJhc2VcbiAgXG5cbmV4cG9ydCBjbGFzcyBCYXNlQ29tbWFuZFxuICBjb25zdHJ1Y3RvcjogKEBpbnN0YW5jZSkgLT5cbiAgaW5pdDogLT5cbiAgICAjXG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIHJldHVybiB0aGlzW1wicmVzdWx0XCJdP1xuICBnZXREZWZhdWx0czogLT5cbiAgICByZXR1cm4ge31cbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4ge31cbiAgICAgICIsInZhciBfb3B0S2V5O1xuXG5pbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIFN0b3JhZ2Vcbn0gZnJvbSAnLi9TdG9yYWdlJztcblxuaW1wb3J0IHtcbiAgTmFtZXNwYWNlSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5fb3B0S2V5ID0gZnVuY3Rpb24oa2V5LCBkaWN0LCBkZWZWYWwgPSBudWxsKSB7XG4gIC8vIG9wdGlvbmFsIERpY3Rpb25hcnkga2V5XG4gIGlmIChrZXkgaW4gZGljdCkge1xuICAgIHJldHVybiBkaWN0W2tleV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRlZlZhbDtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBDb21tYW5kID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lMSwgZGF0YTEgPSBudWxsLCBwYXJlbnQgPSBudWxsKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lMTtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGExO1xuICAgICAgdGhpcy5jbWRzID0gW107XG4gICAgICB0aGlzLmRldGVjdG9ycyA9IFtdO1xuICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSB0aGlzLnJlc3VsdEZ1bmN0ID0gdGhpcy5yZXN1bHRTdHIgPSB0aGlzLmFsaWFzT2YgPSB0aGlzLmNscyA9IG51bGw7XG4gICAgICB0aGlzLmFsaWFzZWQgPSBudWxsO1xuICAgICAgdGhpcy5mdWxsTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgIHRoaXMuZGVwdGggPSAwO1xuICAgICAgW3RoaXMuX3BhcmVudCwgdGhpcy5faW5pdGVkXSA9IFtudWxsLCBmYWxzZV07XG4gICAgICB0aGlzLnNldFBhcmVudChwYXJlbnQpO1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IHt9O1xuICAgICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgICBwYXJzZTogZmFsc2UsXG4gICAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgICByZXBsYWNlQm94OiBmYWxzZSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBudWxsXG4gICAgICB9O1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgICB0aGlzLmZpbmFsT3B0aW9ucyA9IG51bGw7XG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICB9XG5cbiAgICBzZXRQYXJlbnQodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLl9wYXJlbnQgIT09IHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHZhbHVlO1xuICAgICAgICB0aGlzLmZ1bGxOYW1lID0gKCh0aGlzLl9wYXJlbnQgIT0gbnVsbCkgJiYgKHRoaXMuX3BhcmVudC5uYW1lICE9IG51bGwpID8gdGhpcy5fcGFyZW50LmZ1bGxOYW1lICsgJzonICsgdGhpcy5uYW1lIDogdGhpcy5uYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwdGggPSAoKHRoaXMuX3BhcmVudCAhPSBudWxsKSAmJiAodGhpcy5fcGFyZW50LmRlcHRoICE9IG51bGwpID8gdGhpcy5fcGFyZW50LmRlcHRoICsgMSA6IDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoIXRoaXMuX2luaXRlZCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnBhcnNlRGF0YSh0aGlzLmRhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpO1xuICAgIH1cblxuICAgIGlzRWRpdGFibGUoKSB7XG4gICAgICByZXR1cm4gKHRoaXMucmVzdWx0U3RyICE9IG51bGwpIHx8ICh0aGlzLmFsaWFzT2YgIT0gbnVsbCk7XG4gICAgfVxuXG4gICAgaXNFeGVjdXRhYmxlKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmO1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICB9XG4gICAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCcsICdjbHMnLCAnZXhlY3V0ZUZ1bmN0J107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHJlZltqXTtcbiAgICAgICAgaWYgKHRoaXNbcF0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZSkge1xuICAgICAgdmFyIGFsaWFzT2YsIGFsaWFzZWQsIGNvbnRleHQ7XG4gICAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICAgIGFsaWFzT2YgPSB0aGlzLmFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJywgbmFtZSk7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLl9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihhbGlhc09mKSk7XG4gICAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaXNFeGVjdXRhYmxlKCk7XG4gICAgfVxuXG4gICAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgaiwgbGVuLCBwLCByZWY7XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG4gICAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCddO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal07XG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldERlZmF1bHRzKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIHJlcztcbiAgICAgIHJlcyA9IHt9O1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgYWxpYXNlZC5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgX2FsaWFzZWRGcm9tRmluZGVyKGZpbmRlcikge1xuICAgICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlO1xuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2U7XG4gICAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2U7XG4gICAgICByZXR1cm4gZmluZGVyLmZpbmQoKTtcbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkKCkge1xuICAgICAgdmFyIGNvbnRleHQ7XG4gICAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcih0aGlzLmFsaWFzT2YpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRPcHRpb25zKGRhdGEpIHtcbiAgICAgIHZhciBrZXksIHJlc3VsdHMsIHZhbDtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgICAgdmFsID0gZGF0YVtrZXldO1xuICAgICAgICBpZiAoa2V5IGluIHRoaXMuZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5vcHRpb25zW2tleV0gPSB2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBfb3B0aW9uc0ZvckFsaWFzZWQoYWxpYXNlZCkge1xuICAgICAgdmFyIG9wdDtcbiAgICAgIG9wdCA9IHt9O1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMuZGVmYXVsdE9wdGlvbnMpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgYWxpYXNlZC5nZXRPcHRpb25zKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldE9wdGlvbnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3B0aW9uc0ZvckFsaWFzZWQodGhpcy5nZXRBbGlhc2VkKCkpO1xuICAgIH1cblxuICAgIGdldE9wdGlvbihrZXkpIHtcbiAgICAgIHZhciBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGVscCgpIHtcbiAgICAgIHZhciBjbWQ7XG4gICAgICBjbWQgPSB0aGlzLmdldENtZCgnaGVscCcpO1xuICAgICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuaW5pdCgpLnJlc3VsdFN0cjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZURhdGEoZGF0YSkge1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRTdHIgPSBkYXRhO1xuICAgICAgICB0aGlzLm9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGljdERhdGEoZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcGFyc2VEaWN0RGF0YShkYXRhKSB7XG4gICAgICB2YXIgZXhlY3V0ZSwgcmVzO1xuICAgICAgcmVzID0gX29wdEtleSgncmVzdWx0JywgZGF0YSk7XG4gICAgICBpZiAodHlwZW9mIHJlcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMucmVzdWx0RnVuY3QgPSByZXM7XG4gICAgICB9IGVsc2UgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gcmVzO1xuICAgICAgICB0aGlzLm9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlO1xuICAgICAgfVxuICAgICAgZXhlY3V0ZSA9IF9vcHRLZXkoJ2V4ZWN1dGUnLCBkYXRhKTtcbiAgICAgIGlmICh0eXBlb2YgZXhlY3V0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0ZUZ1bmN0ID0gZXhlY3V0ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLCBkYXRhKTtcbiAgICAgIHRoaXMuY2xzID0gX29wdEtleSgnY2xzJywgZGF0YSk7XG4gICAgICB0aGlzLmRlZmF1bHRzID0gX29wdEtleSgnZGVmYXVsdHMnLCBkYXRhLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhkYXRhKTtcbiAgICAgIGlmICgnaGVscCcgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsIGRhdGFbJ2hlbHAnXSwgdGhpcykpO1xuICAgICAgfVxuICAgICAgaWYgKCdmYWxsYmFjaycgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLCBkYXRhWydmYWxsYmFjayddLCB0aGlzKSk7XG4gICAgICB9XG4gICAgICBpZiAoJ2NtZHMnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWRzKGRhdGFbJ2NtZHMnXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhZGRDbWRzKGNtZHMpIHtcbiAgICAgIHZhciBkYXRhLCBuYW1lLCByZXN1bHRzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChuYW1lIGluIGNtZHMpIHtcbiAgICAgICAgZGF0YSA9IGNtZHNbbmFtZV07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZENtZChuZXcgQ29tbWFuZChuYW1lLCBkYXRhLCB0aGlzKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkQ21kKGNtZCkge1xuICAgICAgdmFyIGV4aXN0cztcbiAgICAgIGV4aXN0cyA9IHRoaXMuZ2V0Q21kKGNtZC5uYW1lKTtcbiAgICAgIGlmIChleGlzdHMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlbW92ZUNtZChleGlzdHMpO1xuICAgICAgfVxuICAgICAgY21kLnNldFBhcmVudCh0aGlzKTtcbiAgICAgIHRoaXMuY21kcy5wdXNoKGNtZCk7XG4gICAgICByZXR1cm4gY21kO1xuICAgIH1cblxuICAgIHJlbW92ZUNtZChjbWQpIHtcbiAgICAgIHZhciBpO1xuICAgICAgaWYgKChpID0gdGhpcy5jbWRzLmluZGV4T2YoY21kKSkgPiAtMSkge1xuICAgICAgICB0aGlzLmNtZHMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNtZDtcbiAgICB9XG5cbiAgICBnZXRDbWQoZnVsbG5hbWUpIHtcbiAgICAgIHZhciBjbWQsIGosIGxlbiwgbmFtZSwgcmVmLCByZWYxLCBzcGFjZTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKTtcbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiAocmVmID0gdGhpcy5nZXRDbWQoc3BhY2UpKSAhPSBudWxsID8gcmVmLmdldENtZChuYW1lKSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIHJlZjEgPSB0aGlzLmNtZHM7XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYxLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGNtZCA9IHJlZjFbal07XG4gICAgICAgIGlmIChjbWQubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRDbWQoZnVsbG5hbWUsIG5ldyBDb21tYW5kKGZ1bGxuYW1lLnNwbGl0KCc6JykucG9wKCksIGRhdGEpKTtcbiAgICB9XG5cbiAgICBzZXRDbWQoZnVsbG5hbWUsIGNtZCkge1xuICAgICAgdmFyIG5hbWUsIG5leHQsIHNwYWNlO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKTtcbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIG5leHQgPSB0aGlzLmdldENtZChzcGFjZSk7XG4gICAgICAgIGlmIChuZXh0ID09IG51bGwpIHtcbiAgICAgICAgICBuZXh0ID0gdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoc3BhY2UpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSwgY21kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKGNtZCk7XG4gICAgICAgIHJldHVybiBjbWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkRGV0ZWN0b3IoZGV0ZWN0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmRldGVjdG9ycy5wdXNoKGRldGVjdG9yKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdENtZHMoKSB7XG4gICAgICB2YXIgaiwgbGVuLCBwcm92aWRlciwgcmVmLCByZXN1bHRzO1xuICAgICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCwge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnaGVsbG8nOiB7XG4gICAgICAgICAgICBoZWxwOiBcIlxcXCJIZWxsbywgd29ybGQhXFxcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxcbm1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xcbnZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYVwiLFxuICAgICAgICAgICAgcmVzdWx0OiAnSGVsbG8sIFdvcmxkISdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVmID0gdGhpcy5wcm92aWRlcnM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcHJvdmlkZXIgPSByZWZbal07XG4gICAgICAgIHJlc3VsdHMucHVzaChwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzYXZlQ21kKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSk7XG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlSW5QYXRoKCdjbWRzJywgZnVsbG5hbWUsIGRhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGxvYWRDbWRzKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgc2F2ZWRDbWRzO1xuICAgICAgICByZXR1cm4gc2F2ZWRDbWRzID0gdGhpcy5zdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgICAgIH0pLnRoZW4oKHNhdmVkQ21kcykgPT4ge1xuICAgICAgICB2YXIgZGF0YSwgZnVsbG5hbWUsIHJlc3VsdHM7XG4gICAgICAgIGlmIChzYXZlZENtZHMgIT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKGZ1bGxuYW1lIGluIHNhdmVkQ21kcykge1xuICAgICAgICAgICAgZGF0YSA9IHNhdmVkQ21kc1tmdWxsbmFtZV07XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldFNhdmVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlKCdjbWRzJywge30pO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYWtlVmFyQ21kKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHAsIHZhbDtcbiAgICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcbiAgICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZUJvb2xWYXJDbWQobmFtZSwgYmFzZSA9IHt9KSB7XG4gICAgICBiYXNlLmV4ZWN1dGUgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICB2YXIgcCwgdmFsO1xuICAgICAgICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuICAgICAgICBpZiAoISgodmFsICE9IG51bGwpICYmICh2YWwgPT09ICcwJyB8fCB2YWwgPT09ICdmYWxzZScgfHwgdmFsID09PSAnbm8nKSkpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgfTtcblxuICBDb21tYW5kLnByb3ZpZGVycyA9IFtdO1xuXG4gIENvbW1hbmQuc3RvcmFnZSA9IG5ldyBTdG9yYWdlKCk7XG5cbiAgcmV0dXJuIENvbW1hbmQ7XG5cbn0pLmNhbGwodGhpcyk7XG5cbmV4cG9ydCB2YXIgQmFzZUNvbW1hbmQgPSBjbGFzcyBCYXNlQ29tbWFuZCB7XG4gIGNvbnN0cnVjdG9yKGluc3RhbmNlMSkge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTE7XG4gIH1cblxuICBpbml0KCkge31cblxuICBcbiAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXNbXCJyZXN1bHRcIl0gIT0gbnVsbDtcbiAgfVxuXG4gIGdldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IENtZEZpbmRlciB9IGZyb20gJy4vQ21kRmluZGVyJztcbmltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBDb250ZXh0XG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlKSAtPlxuICAgIEBuYW1lU3BhY2VzID0gW11cbiAgXG4gIGFkZE5hbWVTcGFjZTogKG5hbWUpIC0+XG4gICAgaWYgbmFtZSBub3QgaW4gQG5hbWVTcGFjZXMgXG4gICAgICBAbmFtZVNwYWNlcy5wdXNoKG5hbWUpXG4gICAgICBAX25hbWVzcGFjZXMgPSBudWxsXG4gIGFkZE5hbWVzcGFjZXM6IChzcGFjZXMpIC0+XG4gICAgaWYgc3BhY2VzIFxuICAgICAgaWYgdHlwZW9mIHNwYWNlcyA9PSAnc3RyaW5nJ1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXVxuICAgICAgZm9yIHNwYWNlIGluIHNwYWNlcyBcbiAgICAgICAgQGFkZE5hbWVTcGFjZShzcGFjZSlcbiAgcmVtb3ZlTmFtZVNwYWNlOiAobmFtZSkgLT5cbiAgICBAbmFtZVNwYWNlcyA9IEBuYW1lU3BhY2VzLmZpbHRlciAobikgLT4gbiBpc250IG5hbWVcblxuICBnZXROYW1lU3BhY2VzOiAtPlxuICAgIHVubGVzcyBAX25hbWVzcGFjZXM/XG4gICAgICBucGNzID0gWydjb3JlJ10uY29uY2F0KEBuYW1lU3BhY2VzKVxuICAgICAgaWYgQHBhcmVudD9cbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KEBwYXJlbnQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgQF9uYW1lc3BhY2VzID0gQXJyYXlIZWxwZXIudW5pcXVlKG5wY3MpXG4gICAgcmV0dXJuIEBfbmFtZXNwYWNlc1xuICBnZXRDbWQ6IChjbWROYW1lLG9wdGlvbnMgPSB7fSkgLT5cbiAgICBmaW5kZXIgPSBAZ2V0RmluZGVyKGNtZE5hbWUsb3B0aW9ucylcbiAgICByZXR1cm4gZmluZGVyLmZpbmQoKVxuICBnZXRGaW5kZXI6IChjbWROYW1lLG9wdGlvbnMgPSB7fSkgLT5cbiAgICByZXR1cm4gbmV3IENtZEZpbmRlcihjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdXG4gICAgICB1c2VEZXRlY3RvcnM6IEBpc1Jvb3QoKVxuICAgICAgY29kZXdhdmU6IEBjb2Rld2F2ZVxuICAgICAgcGFyZW50Q29udGV4dDogdGhpc1xuICAgIH0sb3B0aW9ucykpXG4gIGlzUm9vdDogLT5cbiAgICByZXR1cm4gIUBwYXJlbnQ/XG4gIGdldFBhcmVudE9yUm9vdDogKCkgLT5cbiAgICBpZiBAcGFyZW50P1xuICAgICAgQHBhcmVudFxuICAgIGVsc2VcbiAgICAgIHRoaXNcbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIGNjLmluZGV4T2YoJyVzJykgPiAtMVxuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJyxzdHIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgd3JhcENvbW1lbnRMZWZ0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLGkpICsgc3RyXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gIHdyYXBDb21tZW50UmlnaHQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkrMilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2NcbiAgY21kSW5zdGFuY2VGb3I6IChjbWQpIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsdGhpcylcbiAgZ2V0Q29tbWVudENoYXI6IC0+XG4gICAgaWYgQGNvbW1lbnRDaGFyP1xuICAgICAgcmV0dXJuIEBjb21tZW50Q2hhclxuICAgIGNtZCA9IEBnZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG4gICAgaWYgY21kP1xuICAgICAgaW5zdCA9IEBjbWRJbnN0YW5jZUZvcihjbWQpXG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnXG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICBAY29tbWVudENoYXIgPSBjaGFyXG4gICAgcmV0dXJuIEBjb21tZW50Q2hhciIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgQ21kRmluZGVyXG59IGZyb20gJy4vQ21kRmluZGVyJztcblxuaW1wb3J0IHtcbiAgQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5cbmltcG9ydCB7XG4gIEFycmF5SGVscGVyXG59IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5cbmV4cG9ydCB2YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSkge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTtcbiAgICB0aGlzLm5hbWVTcGFjZXMgPSBbXTtcbiAgfVxuXG4gIGFkZE5hbWVTcGFjZShuYW1lKSB7XG4gICAgaWYgKGluZGV4T2YuY2FsbCh0aGlzLm5hbWVTcGFjZXMsIG5hbWUpIDwgMCkge1xuICAgICAgdGhpcy5uYW1lU3BhY2VzLnB1c2gobmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYWRkTmFtZXNwYWNlcyhzcGFjZXMpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzLCBzcGFjZTtcbiAgICBpZiAoc3BhY2VzKSB7XG4gICAgICBpZiAodHlwZW9mIHNwYWNlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3BhY2VzID0gW3NwYWNlc107XG4gICAgICB9XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBzcGFjZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgc3BhY2UgPSBzcGFjZXNbal07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZE5hbWVTcGFjZShzcGFjZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTmFtZVNwYWNlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lU3BhY2VzID0gdGhpcy5uYW1lU3BhY2VzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbiAhPT0gbmFtZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldE5hbWVTcGFjZXMoKSB7XG4gICAgdmFyIG5wY3M7XG4gICAgaWYgKHRoaXMuX25hbWVzcGFjZXMgPT0gbnVsbCkge1xuICAgICAgbnBjcyA9IFsnY29yZSddLmNvbmNhdCh0aGlzLm5hbWVTcGFjZXMpO1xuICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KHRoaXMucGFyZW50LmdldE5hbWVTcGFjZXMoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9uYW1lc3BhY2VzID0gQXJyYXlIZWxwZXIudW5pcXVlKG5wY3MpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcztcbiAgfVxuXG4gIGdldENtZChjbWROYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMpO1xuICAgIHJldHVybiBmaW5kZXIuZmluZCgpO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgbmFtZXNwYWNlczogW10sXG4gICAgICB1c2VEZXRlY3RvcnM6IHRoaXMuaXNSb290KCksXG4gICAgICBjb2Rld2F2ZTogdGhpcy5jb2Rld2F2ZSxcbiAgICAgIHBhcmVudENvbnRleHQ6IHRoaXNcbiAgICB9LCBvcHRpb25zKSk7XG4gIH1cblxuICBpc1Jvb3QoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09IG51bGw7XG4gIH1cblxuICBnZXRQYXJlbnRPclJvb3QoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnQoc3RyKSB7XG4gICAgdmFyIGNjO1xuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpO1xuICAgIGlmIChjYy5pbmRleE9mKCclcycpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsIHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50TGVmdChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gY2Muc3Vic3RyKDAsIGkpICsgc3RyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHI7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnRSaWdodChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkgKyAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIGNtZEluc3RhbmNlRm9yKGNtZCkge1xuICAgIHJldHVybiBuZXcgQ21kSW5zdGFuY2UoY21kLCB0aGlzKTtcbiAgfVxuXG4gIGdldENvbW1lbnRDaGFyKCkge1xuICAgIHZhciBjaGFyLCBjbWQsIGluc3QsIHJlcztcbiAgICBpZiAodGhpcy5jb21tZW50Q2hhciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgICB9XG4gICAgY21kID0gdGhpcy5nZXRDbWQoJ2NvbW1lbnQnKTtcbiAgICBjaGFyID0gJzwhLS0gJXMgLS0+JztcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGluc3QgPSB0aGlzLmNtZEluc3RhbmNlRm9yKGNtZCk7XG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnO1xuICAgICAgcmVzID0gaW5zdC5yZXN1bHQoKTtcbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICBjaGFyID0gcmVzO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbW1lbnRDaGFyID0gY2hhcjtcbiAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUGFpciB9IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCBjbGFzcyBEZXRlY3RvclxuICBjb25zdHJ1Y3RvcjogKEBkYXRhPXt9KSAtPlxuICBkZXRlY3Q6IChmaW5kZXIpIC0+XG4gICAgaWYgQGRldGVjdGVkKGZpbmRlcilcbiAgICAgIHJldHVybiBAZGF0YS5yZXN1bHQgaWYgQGRhdGEucmVzdWx0P1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBAZGF0YS5lbHNlIGlmIEBkYXRhLmVsc2U/XG4gIGRldGVjdGVkOiAoZmluZGVyKSAtPlxuICAgICNcblxuZXhwb3J0IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yXG4gIGRldGVjdDogKGZpbmRlcikgLT5cbiAgICBpZiBmaW5kZXIuY29kZXdhdmU/IFxuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpXG4gICAgICBpZiBsYW5nPyBcbiAgICAgICAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKVxuICAgICAgICBcbmV4cG9ydCBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvclxuICBkZXRlY3RlZDogKGZpbmRlcikgLT5cbiAgICBpZiBAZGF0YS5vcGVuZXI/IGFuZCBAZGF0YS5jbG9zZXI/IGFuZCBmaW5kZXIuaW5zdGFuY2U/XG4gICAgICBwYWlyID0gbmV3IFBhaXIoQGRhdGEub3BlbmVyLCBAZGF0YS5jbG9zZXIsIEBkYXRhKVxuICAgICAgaWYgcGFpci5pc1dhcHBlck9mKGZpbmRlci5pbnN0YW5jZS5nZXRQb3MoKSwgZmluZGVyLmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gICAgICAiLCJpbXBvcnQge1xuICBQYWlyXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCB2YXIgRGV0ZWN0b3IgPSBjbGFzcyBEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEgPSB7fSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cblxuICBkZXRlY3QoZmluZGVyKSB7XG4gICAgaWYgKHRoaXMuZGV0ZWN0ZWQoZmluZGVyKSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5yZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnJlc3VsdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZGF0YS5lbHNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5lbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRldGVjdGVkKGZpbmRlcikge31cblxufTtcblxuXG5leHBvcnQgdmFyIExhbmdEZXRlY3RvciA9IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIHZhciBsYW5nO1xuICAgIGlmIChmaW5kZXIuY29kZXdhdmUgIT0gbnVsbCkge1xuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpO1xuICAgICAgaWYgKGxhbmcgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG5leHBvcnQgdmFyIFBhaXJEZXRlY3RvciA9IGNsYXNzIFBhaXJEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0ZWQoZmluZGVyKSB7XG4gICAgdmFyIHBhaXI7XG4gICAgaWYgKCh0aGlzLmRhdGEub3BlbmVyICE9IG51bGwpICYmICh0aGlzLmRhdGEuY2xvc2VyICE9IG51bGwpICYmIChmaW5kZXIuaW5zdGFuY2UgIT0gbnVsbCkpIHtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcih0aGlzLmRhdGEub3BlbmVyLCB0aGlzLmRhdGEuY2xvc2VyLCB0aGlzLmRhdGEpO1xuICAgICAgaWYgKHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEVkaXRDbWRQcm9wXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsb3B0aW9ucykgLT5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICd2YXInIDogbnVsbCxcbiAgICAgICdvcHQnIDogbnVsbCxcbiAgICAgICdmdW5jdCcgOiBudWxsLFxuICAgICAgJ2RhdGFOYW1lJyA6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JyA6IGZhbHNlLFxuICAgICAgJ2NhcnJldCcgOiBmYWxzZSxcbiAgICB9XG4gICAgZm9yIGtleSBpbiBbJ3ZhcicsJ29wdCcsJ2Z1bmN0J11cbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIGRlZmF1bHRzWydkYXRhTmFtZSddID0gb3B0aW9uc1trZXldXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICAgIFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKEBuYW1lKVxuICBcbiAgd3JpdGVGb3I6IChwYXJzZXIsb2JqKSAtPlxuICAgIGlmIHBhcnNlci52YXJzW0BuYW1lXT9cbiAgICAgIG9ialtAZGF0YU5hbWVdID0gcGFyc2VyLnZhcnNbQG5hbWVdXG4gIHZhbEZyb21DbWQ6IChjbWQpIC0+XG4gICAgaWYgY21kP1xuICAgICAgaWYgQG9wdD9cbiAgICAgICAgcmV0dXJuIGNtZC5nZXRPcHRpb24oQG9wdClcbiAgICAgIGlmIEBmdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZFtAZnVuY3RdKClcbiAgICAgIGlmIEB2YXI/XG4gICAgICAgIHJldHVybiBjbWRbQHZhcl1cbiAgc2hvd0ZvckNtZDogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIEBzaG93RW1wdHkgb3IgdmFsP1xuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIGlmIEBzaG93Rm9yQ21kKGNtZClcbiAgICAgIFwiXCJcIlxuICAgICAgfn4je0BuYW1lfX5+XG4gICAgICAje0B2YWxGcm9tQ21kKGNtZCkgb3IgXCJcIn0je2lmIEBjYXJyZXQgdGhlbiBcInxcIiBlbHNlIFwiXCJ9XG4gICAgICB+fi8je0BuYW1lfX5+XG4gICAgICBcIlwiXCJcbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnNvdXJjZSBleHRlbmRzIEVkaXRDbWRQcm9wIFxuICB2YWxGcm9tQ21kOiAoY21kKS0+XG4gICAgcmVzID0gc3VwZXIoY21kKVxuICAgIGlmIHJlcz9cbiAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKC9cXHwvZywgJ3x8JylcbiAgICByZXR1cm4gcmVzXG4gIHNldENtZDogKGNtZHMpLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZChAbmFtZSx7J3ByZXZlbnRQYXJzZUFsbCcgOiB0cnVlfSlcbiAgc2hvd0ZvckNtZDogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIChAc2hvd0VtcHR5IGFuZCAhKGNtZD8gYW5kIGNtZC5hbGlhc09mPykpIG9yIHZhbD9cbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnN0cmluZyBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgaWYgQHZhbEZyb21DbWQoY21kKT9cbiAgICAgIHJldHVybiBcIn5+ISN7QG5hbWV9ICcje0B2YWxGcm9tQ21kKGNtZCl9I3tpZiBAY2FycmV0IHRoZW4gXCJ8XCIgZWxzZSBcIlwifSd+flwiXG4gICAgXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5yZXZCb29sIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgc2V0Q21kOiAoY21kcykgLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQoQG5hbWUpXG4gIHdyaXRlRm9yOiAocGFyc2VyLG9iaikgLT5cbiAgICBpZiBwYXJzZXIudmFyc1tAbmFtZV0/XG4gICAgICBvYmpbQGRhdGFOYW1lXSA9ICFwYXJzZXIudmFyc1tAbmFtZV1cbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgaWYgdmFsPyBhbmQgIXZhbFxuICAgICAgcmV0dXJuIFwifn4hI3tAbmFtZX1+flwiXG5cbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLmJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZChAbmFtZSlcbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICBcIn5+ISN7QG5hbWV9fn5cIiBpZiBAdmFsRnJvbUNtZChjbWQpIiwiaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIEVkaXRDbWRQcm9wID0gY2xhc3MgRWRpdENtZFByb3Age1xuICBjb25zdHJ1Y3RvcihuYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBpLCBrZXksIGxlbiwgcmVmLCB2YWw7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICd2YXInOiBudWxsLFxuICAgICAgJ29wdCc6IG51bGwsXG4gICAgICAnZnVuY3QnOiBudWxsLFxuICAgICAgJ2RhdGFOYW1lJzogbnVsbCxcbiAgICAgICdzaG93RW1wdHknOiBmYWxzZSxcbiAgICAgICdjYXJyZXQnOiBmYWxzZVxuICAgIH07XG4gICAgcmVmID0gWyd2YXInLCAnb3B0JywgJ2Z1bmN0J107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBrZXkgPSByZWZbaV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgZGVmYXVsdHNbJ2RhdGFOYW1lJ10gPSBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIHdyaXRlRm9yKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9ialt0aGlzLmRhdGFOYW1lXSA9IHBhcnNlci52YXJzW3RoaXMubmFtZV07XG4gICAgfVxuICB9XG5cbiAgdmFsRnJvbUNtZChjbWQpIHtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLm9wdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZ2V0T3B0aW9uKHRoaXMub3B0KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLmZ1bmN0XSgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudmFyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLnZhcl07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2hvd0ZvckNtZChjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIHJldHVybiB0aGlzLnNob3dFbXB0eSB8fCAodmFsICE9IG51bGwpO1xuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy5zaG93Rm9yQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4ke3RoaXMubmFtZX1+flxcbiR7dGhpcy52YWxGcm9tQ21kKGNtZCkgfHwgXCJcIn0keyh0aGlzLmNhcnJldCA/IFwifFwiIDogXCJcIil9XFxufn4vJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5zb3VyY2UgPSBjbGFzcyBzb3VyY2UgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHZhbEZyb21DbWQoY21kKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBzdXBlci52YWxGcm9tQ21kKGNtZCk7XG4gICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICByZXMgPSByZXMucmVwbGFjZSgvXFx8L2csICd8fCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSwge1xuICAgICAgJ3ByZXZlbnRQYXJzZUFsbCc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHNob3dGb3JDbWQoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICByZXR1cm4gKHRoaXMuc2hvd0VtcHR5ICYmICEoKGNtZCAhPSBudWxsKSAmJiAoY21kLmFsaWFzT2YgIT0gbnVsbCkpKSB8fCAodmFsICE9IG51bGwpO1xuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLnN0cmluZyA9IGNsYXNzIHN0cmluZyBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX0gJyR7dGhpcy52YWxGcm9tQ21kKGNtZCl9JHsodGhpcy5jYXJyZXQgPyBcInxcIiA6IFwiXCIpfSd+fmA7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLnJldkJvb2wgPSBjbGFzcyByZXZCb29sIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICB3cml0ZUZvcihwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbdGhpcy5uYW1lXTtcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG4gICAgaWYgKCh2YWwgIT0gbnVsbCkgJiYgIXZhbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLmJvb2wgPSBjbGFzcyBib29sIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnZhbEZyb21DbWQoY21kKSkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5pbXBvcnQgeyBvcHRpb25hbFByb21pc2UgfSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IGNsYXNzIEVkaXRvclxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAbmFtZXNwYWNlID0gbnVsbFxuICAgIEBfbGFuZyA9IG51bGxcbiAgYmluZGVkVG86IChjb2Rld2F2ZSkgLT5cbiAgICAjXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dExlbjogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRTdWJzdHI6IChzdGFydCwgZW5kKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgaW5zZXJ0VGV4dEF0OiAodGV4dCwgcG9zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kID0gbnVsbCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGJlZ2luVW5kb0FjdGlvbjogLT5cbiAgICAjXG4gIGVuZFVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBnZXRMYW5nOiAtPlxuICAgIHJldHVybiBAX2xhbmdcbiAgc2V0TGFuZzogKHZhbCkgLT5cbiAgICBAX2xhbmcgPSB2YWxcbiAgZ2V0RW1tZXRDb250ZXh0T2JqZWN0OiAtPlxuICAgIHJldHVybiBudWxsXG4gIGFsbG93TXVsdGlTZWxlY3Rpb246IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIHNldE11bHRpU2VsOiAoc2VsZWN0aW9ucykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGdldE11bHRpU2VsOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgY2FuTGlzdGVuVG9DaGFuZ2U6IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIGFkZENoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgXG4gIGdldExpbmVBdDogKHBvcykgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAZmluZExpbmVTdGFydChwb3MpLEBmaW5kTGluZUVuZChwb3MpKVxuICBmaW5kTGluZVN0YXJ0OiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCJdLCAtMSlcbiAgICByZXR1cm4gaWYgcCB0aGVuIHAucG9zKzEgZWxzZSAwXG4gIGZpbmRMaW5lRW5kOiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCIsXCJcXHJcIl0pXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcyBlbHNlIEB0ZXh0TGVuKClcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBpZiBkaXJlY3Rpb24gPiAwXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoc3RhcnQsQHRleHRMZW4oKSlcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoMCxzdGFydClcbiAgICBiZXN0UG9zID0gbnVsbFxuICAgIGZvciBzdHJpIGluIHN0cmluZ3NcbiAgICAgIHBvcyA9IGlmIGRpcmVjdGlvbiA+IDAgdGhlbiB0ZXh0LmluZGV4T2Yoc3RyaSkgZWxzZSB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpXG4gICAgICBpZiBwb3MgIT0gLTFcbiAgICAgICAgaWYgIWJlc3RQb3M/IG9yIGJlc3RQb3MqZGlyZWN0aW9uID4gcG9zKmRpcmVjdGlvblxuICAgICAgICAgIGJlc3RQb3MgPSBwb3NcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaVxuICAgIGlmIGJlc3RTdHI/XG4gICAgICByZXR1cm4gbmV3IFN0clBvcygoaWYgZGlyZWN0aW9uID4gMCB0aGVuIGJlc3RQb3MgKyBzdGFydCBlbHNlIGJlc3RQb3MpLGJlc3RTdHIpXG4gICAgcmV0dXJuIG51bGxcbiAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzOiAocmVwbGFjZW1lbnRzKSAtPlxuICAgIHJlcGxhY2VtZW50cy5yZWR1Y2UoKHByb21pc2UscmVwbCk9PlxuICAgICAgICBwcm9taXNlLnRoZW4gKG9wdCk9PlxuICAgICAgICAgIHJlcGwud2l0aEVkaXRvcih0aGlzKVxuICAgICAgICAgIHJlcGwuYXBwbHlPZmZzZXQob3B0Lm9mZnNldClcbiAgICAgICAgICBvcHRpb25hbFByb21pc2UocmVwbC5hcHBseSgpKS50aGVuID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlbGVjdGlvbnM6IG9wdC5zZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpLFxuICAgICAgICAgICAgICBvZmZzZXQ6IG9wdC5vZmZzZXQrcmVwbC5vZmZzZXRBZnRlcih0aGlzKSBcbiAgICAgICAgICAgIH1cbiAgICAgICwgb3B0aW9uYWxQcm9taXNlKHtzZWxlY3Rpb25zOiBbXSxvZmZzZXQ6IDB9KSlcbiAgICAudGhlbiAob3B0KT0+XG4gICAgICBAYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKG9wdC5zZWxlY3Rpb25zKVxuICAgIC5yZXN1bHQoKVxuICAgIFxuICAgICAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9uczogKHNlbGVjdGlvbnMpIC0+XG4gICAgaWYgc2VsZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICBpZiBAYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgICAgIEBzZXRNdWx0aVNlbChzZWxlY3Rpb25zKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0Q3Vyc29yUG9zKHNlbGVjdGlvbnNbMF0uc3RhcnQsc2VsZWN0aW9uc1swXS5lbmQpIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgU3RyUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcblxuaW1wb3J0IHtcbiAgb3B0aW9uYWxQcm9taXNlXG59IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgdmFyIEVkaXRvciA9IGNsYXNzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubmFtZXNwYWNlID0gbnVsbDtcbiAgICB0aGlzLl9sYW5nID0gbnVsbDtcbiAgfVxuXG4gIGJpbmRlZFRvKGNvZGV3YXZlKSB7fVxuXG4gIFxuICB0ZXh0KHZhbCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0TGVuKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0U3Vic3RyKHN0YXJ0LCBlbmQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgaW5zZXJ0VGV4dEF0KHRleHQsIHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCA9IG51bGwpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgYmVnaW5VbmRvQWN0aW9uKCkge31cblxuICBcbiAgZW5kVW5kb0FjdGlvbigpIHt9XG5cbiAgXG4gIGdldExhbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhbmc7XG4gIH1cblxuICBzZXRMYW5nKHZhbCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nID0gdmFsO1xuICB9XG5cbiAgZ2V0RW1tZXRDb250ZXh0T2JqZWN0KCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYWxsb3dNdWx0aVNlbGVjdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzZXRNdWx0aVNlbChzZWxlY3Rpb25zKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGdldE11bHRpU2VsKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBjYW5MaXN0ZW5Ub0NoYW5nZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRMaW5lQXQocG9zKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5maW5kTGluZVN0YXJ0KHBvcyksIHRoaXMuZmluZExpbmVFbmQocG9zKSk7XG4gIH1cblxuICBmaW5kTGluZVN0YXJ0KHBvcykge1xuICAgIHZhciBwO1xuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW1wiXFxuXCJdLCAtMSk7XG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcyArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRMaW5lRW5kKHBvcykge1xuICAgIHZhciBwO1xuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW1wiXFxuXCIsIFwiXFxyXCJdKTtcbiAgICBpZiAocCkge1xuICAgICAgcmV0dXJuIHAucG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0TGVuKCk7XG4gICAgfVxuICB9XG5cbiAgZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICB2YXIgYmVzdFBvcywgYmVzdFN0ciwgaSwgbGVuLCBwb3MsIHN0cmksIHRleHQ7XG4gICAgaWYgKGRpcmVjdGlvbiA+IDApIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQsIHRoaXMudGV4dExlbigpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cigwLCBzdGFydCk7XG4gICAgfVxuICAgIGJlc3RQb3MgPSBudWxsO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHN0cmluZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0cmkgPSBzdHJpbmdzW2ldO1xuICAgICAgcG9zID0gZGlyZWN0aW9uID4gMCA/IHRleHQuaW5kZXhPZihzdHJpKSA6IHRleHQubGFzdEluZGV4T2Yoc3RyaSk7XG4gICAgICBpZiAocG9zICE9PSAtMSkge1xuICAgICAgICBpZiAoKGJlc3RQb3MgPT0gbnVsbCkgfHwgYmVzdFBvcyAqIGRpcmVjdGlvbiA+IHBvcyAqIGRpcmVjdGlvbikge1xuICAgICAgICAgIGJlc3RQb3MgPSBwb3M7XG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJlc3RTdHIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoKGRpcmVjdGlvbiA+IDAgPyBiZXN0UG9zICsgc3RhcnQgOiBiZXN0UG9zKSwgYmVzdFN0cik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VtZW50cy5yZWR1Y2UoKHByb21pc2UsIHJlcGwpID0+IHtcbiAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKG9wdCkgPT4ge1xuICAgICAgICByZXBsLndpdGhFZGl0b3IodGhpcyk7XG4gICAgICAgIHJlcGwuYXBwbHlPZmZzZXQob3B0Lm9mZnNldCk7XG4gICAgICAgIHJldHVybiBvcHRpb25hbFByb21pc2UocmVwbC5hcHBseSgpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0aW9uczogb3B0LnNlbGVjdGlvbnMuY29uY2F0KHJlcGwuc2VsZWN0aW9ucyksXG4gICAgICAgICAgICBvZmZzZXQ6IG9wdC5vZmZzZXQgKyByZXBsLm9mZnNldEFmdGVyKHRoaXMpXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LCBvcHRpb25hbFByb21pc2Uoe1xuICAgICAgc2VsZWN0aW9uczogW10sXG4gICAgICBvZmZzZXQ6IDBcbiAgICB9KSkudGhlbigob3B0KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMob3B0LnNlbGVjdGlvbnMpO1xuICAgIH0pLnJlc3VsdCgpO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKHNlbGVjdGlvbnMpIHtcbiAgICBpZiAoc2VsZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TXVsdGlTZWwoc2VsZWN0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCwgc2VsZWN0aW9uc1swXS5lbmQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIExvZ2dlclxuICBAZW5hYmxlZCA9IHRydWVcbiAgbG9nOiAoYXJncy4uLikgLT5cbiAgICBpZiBAaXNFbmFibGVkKClcbiAgICAgIGZvciBtc2cgaW4gYXJnc1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpXG4gIGlzRW5hYmxlZDogLT5cbiAgICBjb25zb2xlPy5sb2c/IGFuZCB0aGlzLmVuYWJsZWQgYW5kIExvZ2dlci5lbmFibGVkXG4gIGVuYWJsZWQ6IHRydWVcbiAgcnVudGltZTogKGZ1bmN0LG5hbWUgPSBcImZ1bmN0aW9uXCIpIC0+XG4gICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlcyA9IGZ1bmN0KClcbiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgY29uc29sZS5sb2coXCIje25hbWV9IHRvb2sgI3t0MSAtIHQwfSBtaWxsaXNlY29uZHMuXCIpXG4gICAgcmVzXG4gIG1vbml0b3JEYXRhOiB7fVxuICB0b01vbml0b3I6IChvYmosbmFtZSxwcmVmaXg9JycpIC0+XG4gICAgZnVuY3QgPSBvYmpbbmFtZV1cbiAgICBvYmpbbmFtZV0gPSAtPiBcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICAgIHRoaXMubW9uaXRvcigoLT4gZnVuY3QuYXBwbHkob2JqLGFyZ3MpKSxwcmVmaXgrbmFtZSlcbiAgbW9uaXRvcjogKGZ1bmN0LG5hbWUpIC0+XG4gICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlcyA9IGZ1bmN0KClcbiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgaWYgdGhpcy5tb25pdG9yRGF0YVtuYW1lXT9cbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrK1xuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCs9IHQxIC0gdDBcbiAgICBlbHNlXG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdID0ge1xuICAgICAgICBjb3VudDogMVxuICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgfVxuICAgIHJlc1xuICByZXN1bWU6IC0+XG4gICAgY29uc29sZS5sb2codGhpcy5tb25pdG9yRGF0YSlcbiIsImV4cG9ydCB2YXIgTG9nZ2VyID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBMb2dnZXIge1xuICAgIGxvZyguLi5hcmdzKSB7XG4gICAgICB2YXIgaSwgbGVuLCBtc2csIHJlc3VsdHM7XG4gICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBtc2cgPSBhcmdzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjb25zb2xlLmxvZyhtc2cpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICByZXR1cm4gKCh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlICE9PSBudWxsID8gY29uc29sZS5sb2cgOiB2b2lkIDApICE9IG51bGwpICYmIHRoaXMuZW5hYmxlZCAmJiBMb2dnZXIuZW5hYmxlZDtcbiAgICB9XG5cbiAgICBydW50aW1lKGZ1bmN0LCBuYW1lID0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDE7XG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgcmVzID0gZnVuY3QoKTtcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfSB0b29rICR7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLmApO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICB0b01vbml0b3Iob2JqLCBuYW1lLCBwcmVmaXggPSAnJykge1xuICAgICAgdmFyIGZ1bmN0O1xuICAgICAgZnVuY3QgPSBvYmpbbmFtZV07XG4gICAgICByZXR1cm4gb2JqW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gdGhpcy5tb25pdG9yKChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3QuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgfSksIHByZWZpeCArIG5hbWUpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBtb25pdG9yKGZ1bmN0LCBuYW1lKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDE7XG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgcmVzID0gZnVuY3QoKTtcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBpZiAodGhpcy5tb25pdG9yRGF0YVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrKztcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCArPSB0MSAtIHQwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICByZXN1bWUoKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2codGhpcy5tb25pdG9yRGF0YSk7XG4gICAgfVxuXG4gIH07XG5cbiAgTG9nZ2VyLmVuYWJsZWQgPSB0cnVlO1xuXG4gIExvZ2dlci5wcm90b3R5cGUuZW5hYmxlZCA9IHRydWU7XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5tb25pdG9yRGF0YSA9IHt9O1xuXG4gIHJldHVybiBMb2dnZXI7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJleHBvcnQgY2xhc3MgT3B0aW9uT2JqZWN0XG4gIHNldE9wdHM6IChvcHRpb25zLGRlZmF1bHRzKS0+XG4gICAgQGRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICBAc2V0T3B0KGtleSxvcHRpb25zW2tleV0pXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRPcHQoa2V5LHZhbClcbiAgICAgICAgXG4gIHNldE9wdDogKGtleSwgdmFsKS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgdGhpc1trZXldKHZhbClcbiAgICBlbHNlXG4gICAgICB0aGlzW2tleV09IHZhbFxuICAgICAgICBcbiAgZ2V0T3B0OiAoa2V5KS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXNba2V5XVxuICBcbiAgZ2V0T3B0czogLT5cbiAgICBvcHRzID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRzW2tleV0gPSBAZ2V0T3B0KGtleSlcbiAgICByZXR1cm4gb3B0cyIsImV4cG9ydCB2YXIgT3B0aW9uT2JqZWN0ID0gY2xhc3MgT3B0aW9uT2JqZWN0IHtcbiAgc2V0T3B0cyhvcHRpb25zLCBkZWZhdWx0cykge1xuICAgIHZhciBrZXksIHJlZiwgcmVzdWx0cywgdmFsO1xuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIG9wdGlvbnNba2V5XSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc2V0T3B0KGtleSwgdmFsKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgc2V0T3B0KGtleSwgdmFsKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdChrZXkpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXNba2V5XSkgIT0gbnVsbCA/IHJlZi5jYWxsIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV07XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0cygpIHtcbiAgICB2YXIga2V5LCBvcHRzLCByZWYsIHZhbDtcbiAgICBvcHRzID0ge307XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgb3B0c1trZXldID0gdGhpcy5nZXRPcHQoa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdHM7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuL0JveEhlbHBlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuaW1wb3J0IHsgb3B0aW9uYWxQcm9taXNlIH0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgZXh0ZW5kcyBDbWRJbnN0YW5jZVxuICBjb25zdHJ1Y3RvcjogKEBjb2Rld2F2ZSxAcG9zLEBzdHIpIC0+XG4gICAgc3VwZXIoKVxuICAgIHVubGVzcyBAaXNFbXB0eSgpXG4gICAgICBAX2NoZWNrQ2xvc2VyKClcbiAgICAgIEBvcGVuaW5nID0gQHN0clxuICAgICAgQG5vQnJhY2tldCA9IEBfcmVtb3ZlQnJhY2tldChAc3RyKVxuICAgICAgQF9zcGxpdENvbXBvbmVudHMoKVxuICAgICAgQF9maW5kQ2xvc2luZygpXG4gICAgICBAX2NoZWNrRWxvbmdhdGVkKClcbiAgX2NoZWNrQ2xvc2VyOiAtPlxuICAgIG5vQnJhY2tldCA9IEBfcmVtb3ZlQnJhY2tldChAc3RyKVxuICAgIGlmIG5vQnJhY2tldC5zdWJzdHJpbmcoMCxAY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCkgPT0gQGNvZGV3YXZlLmNsb3NlQ2hhciBhbmQgZiA9IEBfZmluZE9wZW5pbmdQb3MoKVxuICAgICAgQGNsb3NpbmdQb3MgPSBuZXcgU3RyUG9zKEBwb3MsIEBzdHIpXG4gICAgICBAcG9zID0gZi5wb3NcbiAgICAgIEBzdHIgPSBmLnN0clxuICBfZmluZE9wZW5pbmdQb3M6IC0+XG4gICAgY21kTmFtZSA9IEBfcmVtb3ZlQnJhY2tldChAc3RyKS5zdWJzdHJpbmcoQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpXG4gICAgb3BlbmluZyA9IEBjb2Rld2F2ZS5icmFrZXRzICsgY21kTmFtZVxuICAgIGNsb3NpbmcgPSBAc3RyXG4gICAgaWYgZiA9IEBjb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKEBwb3Msb3BlbmluZyxjbG9zaW5nLC0xKVxuICAgICAgZi5zdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZi5wb3MsQGNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGYucG9zK2Yuc3RyLmxlbmd0aCkrQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZcbiAgX3NwbGl0Q29tcG9uZW50czogLT5cbiAgICBwYXJ0cyA9IEBub0JyYWNrZXQuc3BsaXQoXCIgXCIpO1xuICAgIEBjbWROYW1lID0gcGFydHMuc2hpZnQoKVxuICAgIEByYXdQYXJhbXMgPSBwYXJ0cy5qb2luKFwiIFwiKVxuICBfcGFyc2VQYXJhbXM6KHBhcmFtcykgLT5cbiAgICBAcGFyYW1zID0gW11cbiAgICBAbmFtZWQgPSBAZ2V0RGVmYXVsdHMoKVxuICAgIGlmIEBjbWQ/XG4gICAgICBuYW1lVG9QYXJhbSA9IEBnZXRPcHRpb24oJ25hbWVUb1BhcmFtJylcbiAgICAgIGlmIG5hbWVUb1BhcmFtPyBcbiAgICAgICAgQG5hbWVkW25hbWVUb1BhcmFtXSA9IEBjbWROYW1lXG4gICAgaWYgcGFyYW1zLmxlbmd0aFxuICAgICAgYWxsb3dlZE5hbWVkID0gQGdldE9wdGlvbignYWxsb3dlZE5hbWVkJylcbiAgICAgIGluU3RyID0gZmFsc2VcbiAgICAgIHBhcmFtID0gJydcbiAgICAgIG5hbWUgPSBmYWxzZVxuICAgICAgZm9yIGkgaW4gWzAuLihwYXJhbXMubGVuZ3RoLTEpXVxuICAgICAgICBjaHIgPSBwYXJhbXNbaV1cbiAgICAgICAgaWYgY2hyID09ICcgJyBhbmQgIWluU3RyXG4gICAgICAgICAgaWYobmFtZSlcbiAgICAgICAgICAgIEBuYW1lZFtuYW1lXSA9IHBhcmFtXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHBhcmFtcy5wdXNoKHBhcmFtKVxuICAgICAgICAgIHBhcmFtID0gJydcbiAgICAgICAgICBuYW1lID0gZmFsc2VcbiAgICAgICAgZWxzZSBpZiBjaHIgaW4gWydcIicsXCInXCJdIGFuZCAoaSA9PSAwIG9yIHBhcmFtc1tpLTFdICE9ICdcXFxcJylcbiAgICAgICAgICBpblN0ciA9ICFpblN0clxuICAgICAgICBlbHNlIGlmIGNociA9PSAnOicgYW5kICFuYW1lIGFuZCAhaW5TdHIgYW5kICghYWxsb3dlZE5hbWVkPyBvciBwYXJhbSBpbiBhbGxvd2VkTmFtZWQpXG4gICAgICAgICAgbmFtZSA9IHBhcmFtXG4gICAgICAgICAgcGFyYW0gPSAnJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcGFyYW0gKz0gY2hyXG4gICAgICBpZiBwYXJhbS5sZW5ndGhcbiAgICAgICAgaWYobmFtZSlcbiAgICAgICAgICBAbmFtZWRbbmFtZV0gPSBwYXJhbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHBhcmFtcy5wdXNoKHBhcmFtKVxuICBfZmluZENsb3Npbmc6IC0+XG4gICAgaWYgZiA9IEBfZmluZENsb3NpbmdQb3MoKVxuICAgICAgQGNvbnRlbnQgPSBTdHJpbmdIZWxwZXIudHJpbUVtcHR5TGluZShAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcytAc3RyLmxlbmd0aCxmLnBvcykpXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZi5wb3MrZi5zdHIubGVuZ3RoKVxuICBfZmluZENsb3NpbmdQb3M6IC0+XG4gICAgcmV0dXJuIEBjbG9zaW5nUG9zIGlmIEBjbG9zaW5nUG9zP1xuICAgIGNsb3NpbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY21kTmFtZSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgb3BlbmluZyA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNtZE5hbWVcbiAgICBpZiBmID0gQGNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIoQHBvcytAc3RyLmxlbmd0aCwgb3BlbmluZywgY2xvc2luZylcbiAgICAgIHJldHVybiBAY2xvc2luZ1BvcyA9IGZcbiAgX2NoZWNrRWxvbmdhdGVkOiAtPlxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKVxuICAgIG1heCA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpXG4gICAgd2hpbGUgZW5kUG9zIDwgbWF4IGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLGVuZFBvcytAY29kZXdhdmUuZGVjby5sZW5ndGgpID09IEBjb2Rld2F2ZS5kZWNvXG4gICAgICBlbmRQb3MrPUBjb2Rld2F2ZS5kZWNvLmxlbmd0aFxuICAgIGlmIGVuZFBvcyA+PSBtYXggb3IgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSBpbiBbJyAnLFwiXFxuXCIsXCJcXHJcIl1cbiAgICAgIEBzdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyxlbmRQb3MpXG4gIF9jaGVja0JveDogLT5cbiAgICBpZiBAY29kZXdhdmUuaW5JbnN0YW5jZT8gYW5kIEBjb2Rld2F2ZS5pbkluc3RhbmNlLmNtZC5uYW1lID09ICdjb21tZW50J1xuICAgICAgcmV0dXJuXG4gICAgY2wgPSBAY29udGV4dC53cmFwQ29tbWVudExlZnQoKVxuICAgIGNyID0gQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpXG4gICAgZW5kUG9zID0gQGdldEVuZFBvcygpICsgY3IubGVuZ3RoXG4gICAgaWYgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MgLSBjbC5sZW5ndGgsQHBvcykgPT0gY2wgYW5kIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MgLSBjci5sZW5ndGgsZW5kUG9zKSA9PSBjclxuICAgICAgQHBvcyA9IEBwb3MgLSBjbC5sZW5ndGhcbiAgICAgIEBzdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyxlbmRQb3MpXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gICAgZWxzZSBpZiBAZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkuaW5kZXhPZihjbCkgPiAtMSBhbmQgQGdldFBvcygpLnNhbWVMaW5lc1N1ZmZpeCgpLmluZGV4T2YoY3IpID4gLTFcbiAgICAgIEBpbkJveCA9IDFcbiAgICAgIEBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KClcbiAgX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudDogLT5cbiAgICBpZiBAY29udGVudFxuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKVxuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb2Rld2F2ZS5kZWNvKVxuICAgICAgcmUxID0gbmV3IFJlZ0V4cChcIl5cXFxccyoje2VjbH0oPzoje2VkfSkrXFxcXHMqKC4qPylcXFxccyooPzoje2VkfSkrI3tlY3J9JFwiLCBcImdtXCIpXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXHI/XFxuXCIpXG4gICAgICByZTMgPSBuZXcgUmVnRXhwKFwiXFxuXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzKiRcIilcbiAgICAgIEBjb250ZW50ID0gQGNvbnRlbnQucmVwbGFjZShyZTEsJyQxJykucmVwbGFjZShyZTIsJycpLnJlcGxhY2UocmUzLCcnKVxuICBfZ2V0UGFyZW50Q21kczogLT5cbiAgICBAcGFyZW50ID0gQGNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZChAZ2V0RW5kUG9zKCkpPy5pbml0KClcbiAgc2V0TXVsdGlQb3M6IChtdWx0aVBvcykgLT5cbiAgICBAbXVsdGlQb3MgPSBtdWx0aVBvc1xuICBfZ2V0Q21kT2JqOiAtPlxuICAgIEBnZXRDbWQoKVxuICAgIEBfY2hlY2tCb3goKVxuICAgIEBjb250ZW50ID0gQHJlbW92ZUluZGVudEZyb21Db250ZW50KEBjb250ZW50KVxuICAgIHN1cGVyKClcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQF9wYXJzZVBhcmFtcyhAcmF3UGFyYW1zKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHJldHVybiBAY29udGV4dCBvciBAY29kZXdhdmUuY29udGV4dFxuICBnZXRDbWQ6IC0+XG4gICAgdW5sZXNzIEBjbWQ/XG4gICAgICBAX2dldFBhcmVudENtZHMoKVxuICAgICAgaWYgQG5vQnJhY2tldC5zdWJzdHJpbmcoMCxAY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyXG4gICAgICAgIEBjbWQgPSBDb21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKVxuICAgICAgICBAY29udGV4dCA9IEBjb2Rld2F2ZS5jb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIEBmaW5kZXIgPSBAZ2V0RmluZGVyKEBjbWROYW1lKVxuICAgICAgICBAY29udGV4dCA9IEBmaW5kZXIuY29udGV4dFxuICAgICAgICBAY21kID0gQGZpbmRlci5maW5kKClcbiAgICAgICAgaWYgQGNtZD9cbiAgICAgICAgICBAY29udGV4dC5hZGROYW1lU3BhY2UoQGNtZC5mdWxsTmFtZSlcbiAgICByZXR1cm4gQGNtZFxuICBnZXRGaW5kZXI6IChjbWROYW1lKS0+XG4gICAgZmluZGVyID0gQGNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsbmFtZXNwYWNlczpAX2dldFBhcmVudE5hbWVzcGFjZXMoKSlcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzXG4gICAgcmV0dXJuIGZpbmRlclxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICBuc3BjcyA9IFtdXG4gICAgb2JqID0gdGhpc1xuICAgIHdoaWxlIG9iai5wYXJlbnQ/XG4gICAgICBvYmogPSBvYmoucGFyZW50XG4gICAgICBuc3Bjcy5wdXNoKG9iai5jbWQuZnVsbE5hbWUpIGlmIG9iai5jbWQ/IGFuZCBvYmouY21kLmZ1bGxOYW1lP1xuICAgIHJldHVybiBuc3Bjc1xuICBfcmVtb3ZlQnJhY2tldDogKHN0ciktPlxuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCxzdHIubGVuZ3RoLUBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgYWx0ZXJBbGlhc09mOiAoYWxpYXNPZiktPlxuICAgIFtuc3BjLCBjbWROYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdChAY21kTmFtZSlcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLGNtZE5hbWUpXG4gIGlzRW1wdHk6IC0+XG4gICAgcmV0dXJuIEBzdHIgPT0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNvZGV3YXZlLmJyYWtldHMgb3IgQHN0ciA9PSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5icmFrZXRzXG4gIGV4ZWN1dGU6IC0+XG4gICAgaWYgQGlzRW1wdHkoKVxuICAgICAgaWYgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcD8gYW5kIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAud2hpdGhpbk9wZW5Cb3VuZHMoQHBvcyArIEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk/XG4gICAgICAgIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAuY2FuY2VsKClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlcGxhY2VXaXRoKCcnKVxuICAgIGVsc2UgaWYgQGNtZD9cbiAgICAgIGlmIGJlZm9yZUZ1bmN0ID0gQGdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpXG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpXG4gICAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgICBvcHRpb25hbFByb21pc2UoQHJlc3VsdCgpKS50aGVuIChyZXMpPT5cbiAgICAgICAgICBpZiByZXM/XG4gICAgICAgICAgICBAcmVwbGFjZVdpdGgocmVzKVxuICAgICAgICAucmVzdWx0KClcbiAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gQHJ1bkV4ZWN1dGVGdW5jdCgpXG4gIGdldEVuZFBvczogLT5cbiAgICByZXR1cm4gQHBvcytAc3RyLmxlbmd0aFxuICBnZXRQb3M6IC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQHBvcyxAcG9zK0BzdHIubGVuZ3RoKS53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gIGdldE9wZW5pbmdQb3M6IC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQHBvcyxAcG9zK0BvcGVuaW5nLmxlbmd0aCkud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICBnZXRJbmRlbnQ6IC0+XG4gICAgdW5sZXNzIEBpbmRlbnRMZW4/XG4gICAgICBpZiBAaW5Cb3g/XG4gICAgICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGNvbnRleHQpXG4gICAgICAgIEBpbmRlbnRMZW4gPSBoZWxwZXIucmVtb3ZlQ29tbWVudChAZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkpLmxlbmd0aFxuICAgICAgZWxzZVxuICAgICAgICBAaW5kZW50TGVuID0gQHBvcyAtIEBnZXRQb3MoKS5wcmV2RU9MKClcbiAgICByZXR1cm4gQGluZGVudExlblxuICByZW1vdmVJbmRlbnRGcm9tQ29udGVudDogKHRleHQpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoJ15cXFxcc3snK0BnZXRJbmRlbnQoKSsnfScsJ2dtJylcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCcnKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gIGFsdGVyUmVzdWx0Rm9yQm94OiAocmVwbCkgLT5cbiAgICBvcmlnaW5hbCA9IHJlcGwuY29weSgpXG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlcihAY29udGV4dClcbiAgICBoZWxwZXIuZ2V0T3B0RnJvbUxpbmUob3JpZ2luYWwudGV4dFdpdGhGdWxsTGluZXMoKSxmYWxzZSlcbiAgICBpZiBAZ2V0T3B0aW9uKCdyZXBsYWNlQm94JylcbiAgICAgIGJveCA9IGhlbHBlci5nZXRCb3hGb3JQb3Mob3JpZ2luYWwpXG4gICAgICBbcmVwbC5zdGFydCwgcmVwbC5lbmRdID0gW2JveC5zdGFydCwgYm94LmVuZF1cbiAgICAgIEBpbmRlbnRMZW4gPSBoZWxwZXIuaW5kZW50XG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgIGVsc2VcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgICByZXBsLnN0YXJ0ID0gb3JpZ2luYWwucHJldkVPTCgpXG4gICAgICByZXBsLmVuZCA9IG9yaWdpbmFsLm5leHRFT0woKVxuICAgICAgcmVzID0gaGVscGVyLnJlZm9ybWF0TGluZXMob3JpZ2luYWwuc2FtZUxpbmVzUHJlZml4KCkgKyBAY29kZXdhdmUubWFya2VyICsgcmVwbC50ZXh0ICsgQGNvZGV3YXZlLm1hcmtlciArIG9yaWdpbmFsLnNhbWVMaW5lc1N1ZmZpeCgpLCB7bXVsdGlsaW5lOmZhbHNlfSlcbiAgICAgIFtyZXBsLnByZWZpeCxyZXBsLnRleHQscmVwbC5zdWZmaXhdID0gcmVzLnNwbGl0KEBjb2Rld2F2ZS5tYXJrZXIpXG4gICAgcmV0dXJuIHJlcGxcbiAgZ2V0Q3Vyc29yRnJvbVJlc3VsdDogKHJlcGwpIC0+XG4gICAgY3Vyc29yUG9zID0gcmVwbC5yZXNQb3NCZWZvcmVQcmVmaXgoKVxuICAgIGlmIEBjbWQ/IGFuZCBAY29kZXdhdmUuY2hlY2tDYXJyZXQgYW5kIEBnZXRPcHRpb24oJ2NoZWNrQ2FycmV0JylcbiAgICAgIGlmIChwID0gQGNvZGV3YXZlLmdldENhcnJldFBvcyhyZXBsLnRleHQpKT8gXG4gICAgICAgIGN1cnNvclBvcyA9IHJlcGwuc3RhcnQrcmVwbC5wcmVmaXgubGVuZ3RoK3BcbiAgICAgIHJlcGwudGV4dCA9IEBjb2Rld2F2ZS5yZW1vdmVDYXJyZXQocmVwbC50ZXh0KVxuICAgIHJldHVybiBjdXJzb3JQb3NcbiAgY2hlY2tNdWx0aTogKHJlcGwpIC0+XG4gICAgaWYgQG11bHRpUG9zPyBhbmQgQG11bHRpUG9zLmxlbmd0aCA+IDFcbiAgICAgIHJlcGxhY2VtZW50cyA9IFtyZXBsXVxuICAgICAgb3JpZ2luYWxUZXh0ID0gcmVwbC5vcmlnaW5hbFRleHQoKVxuICAgICAgZm9yIHBvcywgaSBpbiBAbXVsdGlQb3NcbiAgICAgICAgaWYgaSA9PSAwXG4gICAgICAgICAgb3JpZ2luYWxQb3MgPSBwb3Muc3RhcnRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5ld1JlcGwgPSByZXBsLmNvcHkoKS5hcHBseU9mZnNldChwb3Muc3RhcnQtb3JpZ2luYWxQb3MpXG4gICAgICAgICAgaWYgbmV3UmVwbC5vcmlnaW5hbFRleHQoKSA9PSBvcmlnaW5hbFRleHRcbiAgICAgICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ld1JlcGwpXG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRzXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFtyZXBsXVxuICByZXBsYWNlV2l0aDogKHRleHQpIC0+XG4gICAgQGFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KEBwb3MsQGdldEVuZFBvcygpLHRleHQpKVxuICBhcHBseVJlcGxhY2VtZW50OiAocmVwbCkgLT5cbiAgICByZXBsLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgICBpZiBAaW5Cb3g/XG4gICAgICBAYWx0ZXJSZXN1bHRGb3JCb3gocmVwbClcbiAgICBlbHNlXG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgIGN1cnNvclBvcyA9IEBnZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpXG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBQb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXVxuICAgIHJlcGxhY2VtZW50cyA9IEBjaGVja011bHRpKHJlcGwpXG4gICAgQHJlcGxhY2VTdGFydCA9IHJlcGwuc3RhcnRcbiAgICBAcmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKClcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgICAiLCJ2YXIgaW5kZXhPZiA9IFtdLmluZGV4T2Y7XG5cbmltcG9ydCB7XG4gIENtZEluc3RhbmNlXG59IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuXG5pbXBvcnQge1xuICBCb3hIZWxwZXJcbn0gZnJvbSAnLi9Cb3hIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5pbXBvcnQge1xuICBTdHJQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBOYW1lc3BhY2VIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgb3B0aW9uYWxQcm9taXNlXG59IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgdmFyIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSA9IGNsYXNzIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSBleHRlbmRzIENtZEluc3RhbmNlIHtcbiAgY29uc3RydWN0b3IoY29kZXdhdmUsIHBvczEsIHN0cjEpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTtcbiAgICB0aGlzLnBvcyA9IHBvczE7XG4gICAgdGhpcy5zdHIgPSBzdHIxO1xuICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHRoaXMuX2NoZWNrQ2xvc2VyKCk7XG4gICAgICB0aGlzLm9wZW5pbmcgPSB0aGlzLnN0cjtcbiAgICAgIHRoaXMubm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cik7XG4gICAgICB0aGlzLl9zcGxpdENvbXBvbmVudHMoKTtcbiAgICAgIHRoaXMuX2ZpbmRDbG9zaW5nKCk7XG4gICAgICB0aGlzLl9jaGVja0Vsb25nYXRlZCgpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Nsb3NlcigpIHtcbiAgICB2YXIgZiwgbm9CcmFja2V0O1xuICAgIG5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpO1xuICAgIGlmIChub0JyYWNrZXQuc3Vic3RyaW5nKDAsIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICYmIChmID0gdGhpcy5fZmluZE9wZW5pbmdQb3MoKSkpIHtcbiAgICAgIHRoaXMuY2xvc2luZ1BvcyA9IG5ldyBTdHJQb3ModGhpcy5wb3MsIHRoaXMuc3RyKTtcbiAgICAgIHRoaXMucG9zID0gZi5wb3M7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSBmLnN0cjtcbiAgICB9XG4gIH1cblxuICBfZmluZE9wZW5pbmdQb3MoKSB7XG4gICAgdmFyIGNsb3NpbmcsIGNtZE5hbWUsIGYsIG9wZW5pbmc7XG4gICAgY21kTmFtZSA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpO1xuICAgIG9wZW5pbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyBjbWROYW1lO1xuICAgIGNsb3NpbmcgPSB0aGlzLnN0cjtcbiAgICBpZiAoZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcywgb3BlbmluZywgY2xvc2luZywgLTEpKSB7XG4gICAgICBmLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZi5wb3MsIHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoZi5wb3MgKyBmLnN0ci5sZW5ndGgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk7XG4gICAgICByZXR1cm4gZjtcbiAgICB9XG4gIH1cblxuICBfc3BsaXRDb21wb25lbnRzKCkge1xuICAgIHZhciBwYXJ0cztcbiAgICBwYXJ0cyA9IHRoaXMubm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICB0aGlzLmNtZE5hbWUgPSBwYXJ0cy5zaGlmdCgpO1xuICAgIHJldHVybiB0aGlzLnJhd1BhcmFtcyA9IHBhcnRzLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgX3BhcnNlUGFyYW1zKHBhcmFtcykge1xuICAgIHZhciBhbGxvd2VkTmFtZWQsIGNociwgaSwgaW5TdHIsIGosIG5hbWUsIG5hbWVUb1BhcmFtLCBwYXJhbSwgcmVmO1xuICAgIHRoaXMucGFyYW1zID0gW107XG4gICAgdGhpcy5uYW1lZCA9IHRoaXMuZ2V0RGVmYXVsdHMoKTtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgbmFtZVRvUGFyYW0gPSB0aGlzLmdldE9wdGlvbignbmFtZVRvUGFyYW0nKTtcbiAgICAgIGlmIChuYW1lVG9QYXJhbSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubmFtZWRbbmFtZVRvUGFyYW1dID0gdGhpcy5jbWROYW1lO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFyYW1zLmxlbmd0aCkge1xuICAgICAgYWxsb3dlZE5hbWVkID0gdGhpcy5nZXRPcHRpb24oJ2FsbG93ZWROYW1lZCcpO1xuICAgICAgaW5TdHIgPSBmYWxzZTtcbiAgICAgIHBhcmFtID0gJyc7XG4gICAgICBuYW1lID0gZmFsc2U7XG4gICAgICBmb3IgKGkgPSBqID0gMCwgcmVmID0gcGFyYW1zLmxlbmd0aCAtIDE7ICgwIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWYpOyBpID0gMCA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgICAgY2hyID0gcGFyYW1zW2ldO1xuICAgICAgICBpZiAoY2hyID09PSAnICcgJiYgIWluU3RyKSB7XG4gICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZWRbbmFtZV0gPSBwYXJhbTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMucHVzaChwYXJhbSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmFtID0gJyc7XG4gICAgICAgICAgbmFtZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKChjaHIgPT09ICdcIicgfHwgY2hyID09PSBcIidcIikgJiYgKGkgPT09IDAgfHwgcGFyYW1zW2kgLSAxXSAhPT0gJ1xcXFwnKSkge1xuICAgICAgICAgIGluU3RyID0gIWluU3RyO1xuICAgICAgICB9IGVsc2UgaWYgKGNociA9PT0gJzonICYmICFuYW1lICYmICFpblN0ciAmJiAoKGFsbG93ZWROYW1lZCA9PSBudWxsKSB8fCBpbmRleE9mLmNhbGwoYWxsb3dlZE5hbWVkLCBwYXJhbSkgPj0gMCkpIHtcbiAgICAgICAgICBuYW1lID0gcGFyYW07XG4gICAgICAgICAgcGFyYW0gPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJhbSArPSBjaHI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5uYW1lZFtuYW1lXSA9IHBhcmFtO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnBhcmFtcy5wdXNoKHBhcmFtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9maW5kQ2xvc2luZygpIHtcbiAgICB2YXIgZjtcbiAgICBpZiAoZiA9IHRoaXMuX2ZpbmRDbG9zaW5nUG9zKCkpIHtcbiAgICAgIHRoaXMuY29udGVudCA9IFN0cmluZ0hlbHBlci50cmltRW1wdHlMaW5lKHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgsIGYucG9zKSk7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBmLnBvcyArIGYuc3RyLmxlbmd0aCk7XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRDbG9zaW5nUG9zKCkge1xuICAgIHZhciBjbG9zaW5nLCBmLCBvcGVuaW5nO1xuICAgIGlmICh0aGlzLmNsb3NpbmdQb3MgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1BvcztcbiAgICB9XG4gICAgY2xvc2luZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWROYW1lICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgIG9wZW5pbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZE5hbWU7XG4gICAgaWYgKGYgPSB0aGlzLmNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIodGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUG9zID0gZjtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tFbG9uZ2F0ZWQoKSB7XG4gICAgdmFyIGVuZFBvcywgbWF4LCByZWY7XG4gICAgZW5kUG9zID0gdGhpcy5nZXRFbmRQb3MoKTtcbiAgICBtYXggPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0TGVuKCk7XG4gICAgd2hpbGUgKGVuZFBvcyA8IG1heCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUuZGVjbykge1xuICAgICAgZW5kUG9zICs9IHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGg7XG4gICAgfVxuICAgIGlmIChlbmRQb3MgPj0gbWF4IHx8ICgocmVmID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGgpKSA9PT0gJyAnIHx8IHJlZiA9PT0gXCJcXG5cIiB8fCByZWYgPT09IFwiXFxyXCIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBlbmRQb3MpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0JveCgpIHtcbiAgICB2YXIgY2wsIGNyLCBlbmRQb3M7XG4gICAgaWYgKCh0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkgJiYgdGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlLmNtZC5uYW1lID09PSAnY29tbWVudCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2wgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCk7XG4gICAgY3IgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpO1xuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCkgKyBjci5sZW5ndGg7XG4gICAgaWYgKHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MgLSBjbC5sZW5ndGgsIHRoaXMucG9zKSA9PT0gY2wgJiYgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MgLSBjci5sZW5ndGgsIGVuZFBvcykgPT09IGNyKSB7XG4gICAgICB0aGlzLnBvcyA9IHRoaXMucG9zIC0gY2wubGVuZ3RoO1xuICAgICAgdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBlbmRQb3MpO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5nZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKS5pbmRleE9mKGNsKSA+IC0xICYmIHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzU3VmZml4KCkuaW5kZXhPZihjcikgPiAtMSkge1xuICAgICAgdGhpcy5pbkJveCA9IDE7XG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpIHtcbiAgICB2YXIgZWNsLCBlY3IsIGVkLCByZTEsIHJlMiwgcmUzO1xuICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCgpKTtcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSk7XG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb2Rld2F2ZS5kZWNvKTtcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2VjbH0oPzoke2VkfSkrXFxcXHMqKC4qPylcXFxccyooPzoke2VkfSkrJHtlY3J9JGAsIFwiZ21cIik7XG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBeXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxccj9cXG5gKTtcbiAgICAgIHJlMyA9IG5ldyBSZWdFeHAoYFxcblxcXFxzKiR7ZWNsfSg/OiR7ZWR9KSpcXFxccyokYCk7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ID0gdGhpcy5jb250ZW50LnJlcGxhY2UocmUxLCAnJDEnKS5yZXBsYWNlKHJlMiwgJycpLnJlcGxhY2UocmUzLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgX2dldFBhcmVudENtZHMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQgPSAocmVmID0gdGhpcy5jb2Rld2F2ZS5nZXRFbmNsb3NpbmdDbWQodGhpcy5nZXRFbmRQb3MoKSkpICE9IG51bGwgPyByZWYuaW5pdCgpIDogdm9pZCAwO1xuICB9XG5cbiAgc2V0TXVsdGlQb3MobXVsdGlQb3MpIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0aVBvcyA9IG11bHRpUG9zO1xuICB9XG5cbiAgX2dldENtZE9iaigpIHtcbiAgICB0aGlzLmdldENtZCgpO1xuICAgIHRoaXMuX2NoZWNrQm94KCk7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5yZW1vdmVJbmRlbnRGcm9tQ29udGVudCh0aGlzLmNvbnRlbnQpO1xuICAgIHJldHVybiBzdXBlci5fZ2V0Q21kT2JqKCk7XG4gIH1cblxuICBfaW5pdFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2VQYXJhbXModGhpcy5yYXdQYXJhbXMpO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IHRoaXMuY29kZXdhdmUuY29udGV4dDtcbiAgfVxuXG4gIGdldENtZCgpIHtcbiAgICBpZiAodGhpcy5jbWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fZ2V0UGFyZW50Q21kcygpO1xuICAgICAgaWYgKHRoaXMubm9CcmFja2V0LnN1YnN0cmluZygwLCB0aGlzLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSB7XG4gICAgICAgIHRoaXMuY21kID0gQ29tbWFuZC5jbWRzLmdldENtZCgnY29yZTpub19leGVjdXRlJyk7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY29kZXdhdmUuY29udGV4dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5nZXRGaW5kZXIodGhpcy5jbWROYW1lKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5maW5kZXIuY29udGV4dDtcbiAgICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKCk7XG4gICAgICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmFkZE5hbWVTcGFjZSh0aGlzLmNtZC5mdWxsTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY21kO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUpIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuY29kZXdhdmUuY29udGV4dC5nZXRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogdGhpcy5fZ2V0UGFyZW50TmFtZXNwYWNlcygpXG4gICAgfSk7XG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gZmluZGVyO1xuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMoKSB7XG4gICAgdmFyIG5zcGNzLCBvYmo7XG4gICAgbnNwY3MgPSBbXTtcbiAgICBvYmogPSB0aGlzO1xuICAgIHdoaWxlIChvYmoucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IG9iai5wYXJlbnQ7XG4gICAgICBpZiAoKG9iai5jbWQgIT0gbnVsbCkgJiYgKG9iai5jbWQuZnVsbE5hbWUgIT0gbnVsbCkpIHtcbiAgICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5zcGNzO1xuICB9XG5cbiAgX3JlbW92ZUJyYWNrZXQoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcodGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCwgc3RyLmxlbmd0aCAtIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpO1xuICB9XG5cbiAgYWx0ZXJBbGlhc09mKGFsaWFzT2YpIHtcbiAgICB2YXIgY21kTmFtZSwgbnNwYztcbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQodGhpcy5jbWROYW1lKTtcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBjbWROYW1lKTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cyB8fCB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgYmVmb3JlRnVuY3Q7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICBpZiAoKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wICE9IG51bGwpICYmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcC53aGl0aGluT3BlbkJvdW5kcyh0aGlzLnBvcyArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpICE9IG51bGwpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcC5jYW5jZWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoKCcnKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmIChiZWZvcmVGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdiZWZvcmVFeGVjdXRlJykpIHtcbiAgICAgICAgYmVmb3JlRnVuY3QodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25hbFByb21pc2UodGhpcy5yZXN1bHQoKSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aChyZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkucmVzdWx0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5FeGVjdXRlRnVuY3QoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRFbmRQb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoO1xuICB9XG5cbiAgZ2V0UG9zKCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCkud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcik7XG4gIH1cblxuICBnZXRPcGVuaW5nUG9zKCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMub3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICB9XG5cbiAgZ2V0SW5kZW50KCkge1xuICAgIHZhciBoZWxwZXI7XG4gICAgaWYgKHRoaXMuaW5kZW50TGVuID09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkpLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gdGhpcy5wb3MgLSB0aGlzLmdldFBvcygpLnByZXZFT0woKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5kZW50TGVuO1xuICB9XG5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGV4dCkge1xuICAgIHZhciByZWc7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycgKyB0aGlzLmdldEluZGVudCgpICsgJ30nLCAnZ20nKTtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIGFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpIHtcbiAgICB2YXIgYm94LCBoZWxwZXIsIG9yaWdpbmFsLCByZXM7XG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKTtcbiAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dCk7XG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksIGZhbHNlKTtcbiAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3JlcGxhY2VCb3gnKSkge1xuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbCk7XG4gICAgICBbcmVwbC5zdGFydCwgcmVwbC5lbmRdID0gW2JveC5zdGFydCwgYm94LmVuZF07XG4gICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5pbmRlbnQ7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKCk7XG4gICAgICByZXBsLmVuZCA9IG9yaWdpbmFsLm5leHRFT0woKTtcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyB0aGlzLmNvZGV3YXZlLm1hcmtlciArIG9yaWdpbmFsLnNhbWVMaW5lc1N1ZmZpeCgpLCB7XG4gICAgICAgIG11bHRpbGluZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgW3JlcGwucHJlZml4LCByZXBsLnRleHQsIHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdCh0aGlzLmNvZGV3YXZlLm1hcmtlcik7XG4gICAgfVxuICAgIHJldHVybiByZXBsO1xuICB9XG5cbiAgZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcDtcbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpO1xuICAgIGlmICgodGhpcy5jbWQgIT0gbnVsbCkgJiYgdGhpcy5jb2Rld2F2ZS5jaGVja0NhcnJldCAmJiB0aGlzLmdldE9wdGlvbignY2hlY2tDYXJyZXQnKSkge1xuICAgICAgaWYgKChwID0gdGhpcy5jb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSkgIT0gbnVsbCkge1xuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0ICsgcmVwbC5wcmVmaXgubGVuZ3RoICsgcDtcbiAgICAgIH1cbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHJlcGwudGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBjdXJzb3JQb3M7XG4gIH1cblxuICBjaGVja011bHRpKHJlcGwpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXdSZXBsLCBvcmlnaW5hbFBvcywgb3JpZ2luYWxUZXh0LCBwb3MsIHJlZiwgcmVwbGFjZW1lbnRzO1xuICAgIGlmICgodGhpcy5tdWx0aVBvcyAhPSBudWxsKSAmJiB0aGlzLm11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJlcGxhY2VtZW50cyA9IFtyZXBsXTtcbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KCk7XG4gICAgICByZWYgPSB0aGlzLm11bHRpUG9zO1xuICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgcG9zID0gcmVmW2ldO1xuICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgIG9yaWdpbmFsUG9zID0gcG9zLnN0YXJ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1JlcGwgPSByZXBsLmNvcHkoKS5hcHBseU9mZnNldChwb3Muc3RhcnQgLSBvcmlnaW5hbFBvcyk7XG4gICAgICAgICAgaWYgKG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT09IG9yaWdpbmFsVGV4dCkge1xuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW3JlcGxdO1xuICAgIH1cbiAgfVxuXG4gIHJlcGxhY2VXaXRoKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudCh0aGlzLnBvcywgdGhpcy5nZXRFbmRQb3MoKSwgdGV4dCkpO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcmVwbGFjZW1lbnRzO1xuICAgIHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcik7XG4gICAgaWYgKHRoaXMuaW5Cb3ggIT0gbnVsbCkge1xuICAgICAgdGhpcy5hbHRlclJlc3VsdEZvckJveChyZXBsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpO1xuICAgIH1cbiAgICBjdXJzb3JQb3MgPSB0aGlzLmdldEN1cnNvckZyb21SZXN1bHQocmVwbCk7XG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBQb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXTtcbiAgICByZXBsYWNlbWVudHMgPSB0aGlzLmNoZWNrTXVsdGkocmVwbCk7XG4gICAgdGhpcy5yZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0O1xuICAgIHRoaXMucmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKCk7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBQcm9jZXNzXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICMiLCJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vTG9nZ2VyJztcblxuZXhwb3J0IGNsYXNzIFN0b3JhZ2VcbiAgY29uc3RydWN0b3I6IChAZW5naW5lKSAtPlxuXG4gIHNhdmU6IChrZXksdmFsKSAtPlxuICAgIGlmIEBlbmdpbmVBdmFpbGFibGUoKVxuICAgICAgQGVuZ2luZS5zYXZlKGtleSx2YWwpXG5cbiAgc2F2ZUluUGF0aDogKHBhdGgsIGtleSwgdmFsKSAtPlxuICAgIGlmIEBlbmdpbmVBdmFpbGFibGUoKVxuICAgICAgQGVuZ2luZS5zYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKVxuXG4gIGxvYWQ6IChrZXkpIC0+XG4gICAgaWYgQGVuZ2luZT9cbiAgICAgIEBlbmdpbmUubG9hZChrZXkpXG5cbiAgZW5naW5lQXZhaWxhYmxlOiAoKSAtPlxuICAgIGlmIEBlbmdpbmU/XG4gICAgICB0cnVlXG4gICAgZWxzZVxuICAgICAgQGxvZ2dlciA9IEBsb2dnZXIgfHwgbmV3IExvZ2dlcigpXG4gICAgICBAbG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJylcbiAgICAgIGZhbHNlXG4gICAgIiwiaW1wb3J0IHtcbiAgTG9nZ2VyXG59IGZyb20gJy4vTG9nZ2VyJztcblxuZXhwb3J0IHZhciBTdG9yYWdlID0gY2xhc3MgU3RvcmFnZSB7XG4gIGNvbnN0cnVjdG9yKGVuZ2luZSkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICB9XG5cbiAgc2F2ZShrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZShrZXksIHZhbCk7XG4gICAgfVxuICB9XG5cbiAgc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbCk7XG4gICAgfVxuICB9XG5cbiAgbG9hZChrZXkpIHtcbiAgICBpZiAodGhpcy5lbmdpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLmxvYWQoa2V5KTtcbiAgICB9XG4gIH1cblxuICBlbmdpbmVBdmFpbGFibGUoKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlciA9IHRoaXMubG9nZ2VyIHx8IG5ldyBMb2dnZXIoKTtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IGNsYXNzIERvbUtleUxpc3RlbmVyXG4gIHN0YXJ0TGlzdGVuaW5nOiAodGFyZ2V0KSAtPlxuICBcbiAgICB0aW1lb3V0ID0gbnVsbFxuICAgIFxuICAgIG9ua2V5ZG93biA9IChlKSA9PiBcbiAgICAgIGlmIChDb2Rld2F2ZS5pbnN0YW5jZXMubGVuZ3RoIDwgMiBvciBAb2JqID09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIGFuZCBlLmtleUNvZGUgPT0gNjkgJiYgZS5jdHJsS2V5XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBpZiBAb25BY3RpdmF0aW9uS2V5P1xuICAgICAgICAgIEBvbkFjdGl2YXRpb25LZXkoKVxuICAgIG9ua2V5dXAgPSAoZSkgPT4gXG4gICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgIG9ua2V5cHJlc3MgPSAoZSkgPT4gXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCkgaWYgdGltZW91dD9cbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0ICg9PlxuICAgICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgICAgQG9uQW55Q2hhbmdlKGUpXG4gICAgICApLCAxMDBcbiAgICAgICAgICAgIFxuICAgIGlmIHRhcmdldC5hZGRFdmVudExpc3RlbmVyXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuICAgIGVsc2UgaWYgdGFyZ2V0LmF0dGFjaEV2ZW50XG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuXG5pc0VsZW1lbnQgPSAob2JqKSAtPlxuICB0cnlcbiAgICAjIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tKVxuICAgIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gIGNhdGNoIGVcbiAgICAjIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAjIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAjIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcbiAgICByZXR1cm4gKHR5cGVvZiBvYmo9PVwib2JqZWN0XCIpICYmXG4gICAgICAob2JqLm5vZGVUeXBlPT0xKSAmJiAodHlwZW9mIG9iai5zdHlsZSA9PSBcIm9iamVjdFwiKSAmJlxuICAgICAgKHR5cGVvZiBvYmoub3duZXJEb2N1bWVudCA9PVwib2JqZWN0XCIpXG5cbiAgICAgICAgXG5leHBvcnQgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyXG4gIGNvbnN0cnVjdG9yOiAoQHRhcmdldCkgLT5cbiAgICBzdXBlcigpXG4gICAgQG9iaiA9IGlmIGlzRWxlbWVudChAdGFyZ2V0KSB0aGVuIEB0YXJnZXQgZWxzZSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChAdGFyZ2V0KVxuICAgIHVubGVzcyBAb2JqP1xuICAgICAgdGhyb3cgXCJUZXh0QXJlYSBub3QgZm91bmRcIlxuICAgIEBuYW1lc3BhY2UgPSAndGV4dGFyZWEnXG4gICAgQGNoYW5nZUxpc3RlbmVycyA9IFtdXG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgPSAwXG4gIHN0YXJ0TGlzdGVuaW5nOiBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmdcbiAgb25BbnlDaGFuZ2U6IChlKSAtPlxuICAgIGlmIEBfc2tpcENoYW5nZUV2ZW50IDw9IDBcbiAgICAgIGZvciBjYWxsYmFjayBpbiBAY2hhbmdlTGlzdGVuZXJzXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICBlbHNlXG4gICAgICBAX3NraXBDaGFuZ2VFdmVudC0tXG4gICAgICBAb25Ta2lwZWRDaGFuZ2UoKSBpZiBAb25Ta2lwZWRDaGFuZ2U/XG4gIHNraXBDaGFuZ2VFdmVudDogKG5iID0gMSkgLT5cbiAgICBAX3NraXBDaGFuZ2VFdmVudCArPSBuYlxuICBiaW5kZWRUbzogKGNvZGV3YXZlKSAtPlxuICAgIEBvbkFjdGl2YXRpb25LZXkgPSAtPiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKVxuICAgIEBzdGFydExpc3RlbmluZyhkb2N1bWVudClcbiAgc2VsZWN0aW9uUHJvcEV4aXN0czogLT5cbiAgICBcInNlbGVjdGlvblN0YXJ0XCIgb2YgQG9ialxuICBoYXNGb2N1czogLT4gXG4gICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpcyBAb2JqXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgaWYgdmFsP1xuICAgICAgdW5sZXNzIEB0ZXh0RXZlbnRDaGFuZ2UodmFsKVxuICAgICAgICBAb2JqLnZhbHVlID0gdmFsXG4gICAgQG9iai52YWx1ZVxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICBAdGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIG9yIEBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0LCBlbmQpIG9yIHN1cGVyKHN0YXJ0LCBlbmQsIHRleHQpXG4gIHRleHRFdmVudENoYW5nZTogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUZXh0RXZlbnQnKSBpZiBkb2N1bWVudC5jcmVhdGVFdmVudD9cbiAgICBpZiBldmVudD8gYW5kIGV2ZW50LmluaXRUZXh0RXZlbnQ/IGFuZCBldmVudC5pc1RydXN0ZWQgIT0gZmFsc2VcbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIGlmIHRleHQubGVuZ3RoIDwgMVxuICAgICAgICBpZiBzdGFydCAhPSAwXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LTEsc3RhcnQpXG4gICAgICAgICAgc3RhcnQtLVxuICAgICAgICBlbHNlIGlmIGVuZCAhPSBAdGV4dExlbigpXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKGVuZCxlbmQrMSlcbiAgICAgICAgICBlbmQrK1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICBldmVudC5pbml0VGV4dEV2ZW50KCd0ZXh0SW5wdXQnLCB0cnVlLCB0cnVlLCBudWxsLCB0ZXh0LCA5KVxuICAgICAgIyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIEBvYmouZGlzcGF0Y2hFdmVudChldmVudClcbiAgICAgIEBza2lwQ2hhbmdlRXZlbnQoKVxuICAgICAgdHJ1ZVxuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kOiAodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSAtPlxuICAgIGlmIGRvY3VtZW50LmV4ZWNDb21tYW5kP1xuICAgICAgZW5kID0gQHRleHRMZW4oKSB1bmxlc3MgZW5kP1xuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dCk7XG4gICAgZWxzZSBcbiAgICAgIGZhbHNlXG5cbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdG1wQ3Vyc29yUG9zIGlmIEB0bXBDdXJzb3JQb3M/XG4gICAgaWYgQGhhc0ZvY3VzXG4gICAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgICBuZXcgUG9zKEBvYmouc2VsZWN0aW9uU3RhcnQsQG9iai5zZWxlY3Rpb25FbmQpXG4gICAgICBlbHNlXG4gICAgICAgIEBnZXRDdXJzb3JQb3NGYWxsYmFjaygpXG4gIGdldEN1cnNvclBvc0ZhbGxiYWNrOiAtPlxuICAgIGlmIEBvYmouY3JlYXRlVGV4dFJhbmdlXG4gICAgICBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKVxuICAgICAgaWYgc2VsLnBhcmVudEVsZW1lbnQoKSBpcyBAb2JqXG4gICAgICAgIHJuZyA9IEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcm5nLm1vdmVUb0Jvb2ttYXJrIHNlbC5nZXRCb29rbWFyaygpXG4gICAgICAgIGxlbiA9IDBcblxuICAgICAgICB3aGlsZSBybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDBcbiAgICAgICAgICBsZW4rK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKVxuICAgICAgICBybmcuc2V0RW5kUG9pbnQgXCJTdGFydFRvU3RhcnRcIiwgQG9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgICBwb3MgPSBuZXcgUG9zKDAsbGVuKVxuICAgICAgICB3aGlsZSBybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDBcbiAgICAgICAgICBwb3Muc3RhcnQrK1xuICAgICAgICAgIHBvcy5lbmQrK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKVxuICAgICAgICByZXR1cm4gcG9zXG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgQHRtcEN1cnNvclBvcyA9IG5ldyBQb3Moc3RhcnQsZW5kKVxuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgc2V0VGltZW91dCAoPT5cbiAgICAgICAgQHRtcEN1cnNvclBvcyA9IG51bGxcbiAgICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICApLCAxXG4gICAgZWxzZSBcbiAgICAgIEBzZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKVxuICAgIHJldHVyblxuICBzZXRDdXJzb3JQb3NGYWxsYmFjazogKHN0YXJ0LCBlbmQpIC0+XG4gICAgaWYgQG9iai5jcmVhdGVUZXh0UmFuZ2VcbiAgICAgIHJuZyA9IEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgIHJuZy5tb3ZlU3RhcnQgXCJjaGFyYWN0ZXJcIiwgc3RhcnRcbiAgICAgIHJuZy5jb2xsYXBzZSgpXG4gICAgICBybmcubW92ZUVuZCBcImNoYXJhY3RlclwiLCBlbmQgLSBzdGFydFxuICAgICAgcm5nLnNlbGVjdCgpXG4gIGdldExhbmc6IC0+XG4gICAgcmV0dXJuIEBfbGFuZyBpZiBAX2xhbmdcbiAgICBAb2JqLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJykgaWYgQG9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gICAgQG9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsdmFsKVxuICBjYW5MaXN0ZW5Ub0NoYW5nZTogLT5cbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIEBjaGFuZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjaylcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBpZiAoaSA9IEBjaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykpID4gLTFcbiAgICAgIEBjaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpXG4gICAgICBcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICBpZiByZXBsYWNlbWVudHMubGVuZ3RoID4gMCBhbmQgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMVxuICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbQGdldEN1cnNvclBvcygpXVxuICAgIHN1cGVyKHJlcGxhY2VtZW50cyk7XG4gICAgICAiLCJ2YXIgaXNFbGVtZW50O1xuXG5pbXBvcnQge1xuICBUZXh0UGFyc2VyXG59IGZyb20gJy4vVGV4dFBhcnNlcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCB2YXIgRG9tS2V5TGlzdGVuZXIgPSBjbGFzcyBEb21LZXlMaXN0ZW5lciB7XG4gIHN0YXJ0TGlzdGVuaW5nKHRhcmdldCkge1xuICAgIHZhciBvbmtleWRvd24sIG9ua2V5cHJlc3MsIG9ua2V5dXAsIHRpbWVvdXQ7XG4gICAgdGltZW91dCA9IG51bGw7XG4gICAgb25rZXlkb3duID0gKGUpID0+IHtcbiAgICAgIGlmICgoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgfHwgdGhpcy5vYmogPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpICYmIGUua2V5Q29kZSA9PT0gNjkgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMub25BY3RpdmF0aW9uS2V5ICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFjdGl2YXRpb25LZXkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgb25rZXl1cCA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uQW55Q2hhbmdlKGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgb25rZXlwcmVzcyA9IChlKSA9PiB7XG4gICAgICBpZiAodGltZW91dCAhPSBudWxsKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aW1lb3V0ID0gc2V0VGltZW91dCgoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLCAxMDApO1xuICAgIH07XG4gICAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKTtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cCk7XG4gICAgICByZXR1cm4gdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5hdHRhY2hFdmVudCkge1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlkb3duXCIsIG9ua2V5ZG93bik7XG4gICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApO1xuICAgICAgcmV0dXJuIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcyk7XG4gICAgfVxuICB9XG5cbn07XG5cbmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgZTtcbiAgdHJ5IHtcbiAgICAvLyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIC8vIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAvLyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuICAgIHJldHVybiAodHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIikgJiYgKG9iai5ub2RlVHlwZSA9PT0gMSkgJiYgKHR5cGVvZiBvYmouc3R5bGUgPT09IFwib2JqZWN0XCIpICYmICh0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT09IFwib2JqZWN0XCIpO1xuICB9XG59O1xuXG5leHBvcnQgdmFyIFRleHRBcmVhRWRpdG9yID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBUZXh0QXJlYUVkaXRvciBleHRlbmRzIFRleHRQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldDEpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDE7XG4gICAgICB0aGlzLm9iaiA9IGlzRWxlbWVudCh0aGlzLnRhcmdldCkgPyB0aGlzLnRhcmdldCA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0KTtcbiAgICAgIGlmICh0aGlzLm9iaiA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCI7XG4gICAgICB9XG4gICAgICB0aGlzLm5hbWVzcGFjZSA9ICd0ZXh0YXJlYSc7XG4gICAgICB0aGlzLmNoYW5nZUxpc3RlbmVycyA9IFtdO1xuICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50ID0gMDtcbiAgICB9XG5cbiAgICBvbkFueUNoYW5nZShlKSB7XG4gICAgICB2YXIgY2FsbGJhY2ssIGosIGxlbjEsIHJlZiwgcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPD0gMCkge1xuICAgICAgICByZWYgPSB0aGlzLmNoYW5nZUxpc3RlbmVycztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIGNhbGxiYWNrID0gcmVmW2pdO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjYWxsYmFjaygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudC0tO1xuICAgICAgICBpZiAodGhpcy5vblNraXBlZENoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25Ta2lwZWRDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNraXBDaGFuZ2VFdmVudChuYiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgKz0gbmI7XG4gICAgfVxuXG4gICAgYmluZGVkVG8oY29kZXdhdmUpIHtcbiAgICAgIHRoaXMub25BY3RpdmF0aW9uS2V5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy5zdGFydExpc3RlbmluZyhkb2N1bWVudCk7XG4gICAgfVxuXG4gICAgc2VsZWN0aW9uUHJvcEV4aXN0cygpIHtcbiAgICAgIHJldHVybiBcInNlbGVjdGlvblN0YXJ0XCIgaW4gdGhpcy5vYmo7XG4gICAgfVxuXG4gICAgaGFzRm9jdXMoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5vYmo7XG4gICAgfVxuXG4gICAgdGV4dCh2YWwpIHtcbiAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICBpZiAoIXRoaXMudGV4dEV2ZW50Q2hhbmdlKHZhbCkpIHtcbiAgICAgICAgICB0aGlzLm9iai52YWx1ZSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqLnZhbHVlO1xuICAgIH1cblxuICAgIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHRoaXMuc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSB8fCBzdXBlci5zcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpO1xuICAgIH1cblxuICAgIHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIHZhciBldmVudDtcbiAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RleHRFdmVudCcpO1xuICAgICAgfVxuICAgICAgaWYgKChldmVudCAhPSBudWxsKSAmJiAoZXZlbnQuaW5pdFRleHRFdmVudCAhPSBudWxsKSAmJiBldmVudC5pc1RydXN0ZWQgIT09IGZhbHNlKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICBpZiAoc3RhcnQgIT09IDApIHtcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQgLSAxLCBzdGFydCk7XG4gICAgICAgICAgICBzdGFydC0tO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZW5kICE9PSB0aGlzLnRleHRMZW4oKSkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihlbmQsIGVuZCArIDEpO1xuICAgICAgICAgICAgZW5kKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSk7XG4gICAgICAgIC8vIEBzZXRDdXJzb3JQb3Moc3RhcnQsZW5kKVxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHRoaXMub2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLnNraXBDaGFuZ2VFdmVudCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgICAgaWYgKGRvY3VtZW50LmV4ZWNDb21tYW5kICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgICAgaWYgKHRoaXMudG1wQ3Vyc29yUG9zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG1wQ3Vyc29yUG9zO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaGFzRm9jdXMpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJvcEV4aXN0cykge1xuICAgICAgICAgIHJldHVybiBuZXcgUG9zKHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0LCB0aGlzLm9iai5zZWxlY3Rpb25FbmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldEN1cnNvclBvc0ZhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXJzb3JQb3NGYWxsYmFjaygpIHtcbiAgICAgIHZhciBsZW4sIHBvcywgcm5nLCBzZWw7XG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgICAgICBpZiAoc2VsLnBhcmVudEVsZW1lbnQoKSA9PT0gdGhpcy5vYmopIHtcbiAgICAgICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICBybmcubW92ZVRvQm9va21hcmsoc2VsLmdldEJvb2ttYXJrKCkpO1xuICAgICAgICAgIGxlbiA9IDA7XG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMCkge1xuICAgICAgICAgICAgbGVuKys7XG4gICAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJuZy5zZXRFbmRQb2ludChcIlN0YXJ0VG9TdGFydFwiLCB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKSk7XG4gICAgICAgICAgcG9zID0gbmV3IFBvcygwLCBsZW4pO1xuICAgICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIHBvcy5zdGFydCsrO1xuICAgICAgICAgICAgcG9zLmVuZCsrO1xuICAgICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcG9zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICBlbmQgPSBzdGFydDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG51bGw7XG4gICAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICB9KSwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHZhciBybmc7XG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICBybmcubW92ZVN0YXJ0KFwiY2hhcmFjdGVyXCIsIHN0YXJ0KTtcbiAgICAgICAgcm5nLmNvbGxhcHNlKCk7XG4gICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIGVuZCAtIHN0YXJ0KTtcbiAgICAgICAgcmV0dXJuIHJuZy5zZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYW5nKCkge1xuICAgICAgaWYgKHRoaXMuX2xhbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmc7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmouZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMYW5nKHZhbCkge1xuICAgICAgdGhpcy5fbGFuZyA9IHZhbDtcbiAgICAgIHJldHVybiB0aGlzLm9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsIHZhbCk7XG4gICAgfVxuXG4gICAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmICgoaSA9IHRoaXMuY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5nZUxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKSB7XG4gICAgICBpZiAocmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgJiYgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucyA9IFt0aGlzLmdldEN1cnNvclBvcygpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICAgIH1cblxuICB9O1xuXG4gIFRleHRBcmVhRWRpdG9yLnByb3RvdHlwZS5zdGFydExpc3RlbmluZyA9IERvbUtleUxpc3RlbmVyLnByb3RvdHlwZS5zdGFydExpc3RlbmluZztcblxuICByZXR1cm4gVGV4dEFyZWFFZGl0b3I7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJpbXBvcnQgeyBFZGl0b3IgfSBmcm9tICcuL0VkaXRvcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yXG4gIGNvbnN0cnVjdG9yOiAoQF90ZXh0KSAtPlxuICAgIHN1cGVyKClcbiAgdGV4dDogKHZhbCkgLT5cbiAgICBAX3RleHQgPSB2YWwgaWYgdmFsP1xuICAgIEBfdGV4dFxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHJldHVybiBAdGV4dCgpW3Bvc11cbiAgdGV4dExlbjogKHBvcykgLT5cbiAgICByZXR1cm4gQHRleHQoKS5sZW5ndGhcbiAgdGV4dFN1YnN0cjogKHN0YXJ0LCBlbmQpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICBAdGV4dChAdGV4dCgpLnN1YnN0cmluZygwLCBwb3MpK3RleHQrQHRleHQoKS5zdWJzdHJpbmcocG9zLEB0ZXh0KCkubGVuZ3RoKSlcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHQoQHRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIEB0ZXh0KCkuc2xpY2UoZW5kKSlcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdGFyZ2V0XG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBAdGFyZ2V0ID0gbmV3IFBvcyggc3RhcnQsIGVuZCApIiwiaW1wb3J0IHtcbiAgRWRpdG9yXG59IGZyb20gJy4vRWRpdG9yJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IHZhciBUZXh0UGFyc2VyID0gY2xhc3MgVGV4dFBhcnNlciBleHRlbmRzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKF90ZXh0KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl90ZXh0ID0gX3RleHQ7XG4gIH1cblxuICB0ZXh0KHZhbCkge1xuICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dCA9IHZhbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKVtwb3NdO1xuICB9XG5cbiAgdGV4dExlbihwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkubGVuZ3RoO1xuICB9XG5cbiAgdGV4dFN1YnN0cihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgfVxuXG4gIGluc2VydFRleHRBdCh0ZXh0LCBwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnN1YnN0cmluZygwLCBwb3MpICsgdGV4dCArIHRoaXMudGV4dCgpLnN1YnN0cmluZyhwb3MsIHRoaXMudGV4dCgpLmxlbmd0aCkpO1xuICB9XG5cbiAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIHRoaXMudGV4dCgpLnNsaWNlKGVuZCkpO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnRhcmdldDtcbiAgfVxuXG4gIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBlbmQgPSBzdGFydDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0ID0gbmV3IFBvcyhzdGFydCwgZW5kKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuaW1wb3J0IHsgQ29yZUNvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IEpzQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IFBocENvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9QaHBDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgSHRtbENvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IEZpbGVDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBXcmFwcGVkUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9XcmFwcGVkUG9zJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZUVuZ2luZSB9IGZyb20gJy4vc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lJztcblxuUG9zLndyYXBDbGFzcyA9IFdyYXBwZWRQb3NcblxuQ29kZXdhdmUuaW5zdGFuY2VzID0gW11cblxuQ29tbWFuZC5wcm92aWRlcnMgPSBbXG4gIG5ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IEpzQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IFBocENvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IEZpbGVDb21tYW5kUHJvdmlkZXIoKVxuXVxuXG5pZiBsb2NhbFN0b3JhZ2U/XG4gIENvbW1hbmQuc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2VFbmdpbmUoKVxuXG5leHBvcnQgeyBDb2Rld2F2ZSB9IiwiaW1wb3J0IHtcbiAgQ29kZXdhdmVcbn0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgQ29yZUNvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIEpzQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9Kc0NvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIFBocENvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgSHRtbENvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIEZpbGVDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL0ZpbGVDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5pbXBvcnQge1xuICBXcmFwcGVkUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvV3JhcHBlZFBvcyc7XG5cbmltcG9ydCB7XG4gIExvY2FsU3RvcmFnZUVuZ2luZVxufSBmcm9tICcuL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZSc7XG5cblBvcy53cmFwQ2xhc3MgPSBXcmFwcGVkUG9zO1xuXG5Db2Rld2F2ZS5pbnN0YW5jZXMgPSBbXTtcblxuQ29tbWFuZC5wcm92aWRlcnMgPSBbbmV3IENvcmVDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEpzQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBQaHBDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEh0bWxDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEZpbGVDb21tYW5kUHJvdmlkZXIoKV07XG5cbmlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlRW5naW5lKCk7XG59XG5cbmV4cG9ydCB7XG4gIENvZGV3YXZlXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kLCBCYXNlQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgTGFuZ0RldGVjdG9yIH0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi4vQm94SGVscGVyJztcbmltcG9ydCB7IEVkaXRDbWRQcm9wIH0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGF0aEhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvUGF0aEhlbHBlcic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKVxuICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSlcbiAgXG4gIGNvcmUuYWRkQ21kcyh7XG4gICAgJ2hlbHAnOntcbiAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAncmVzdWx0JyA6IGhlbHAsXG4gICAgICAncGFyc2UnIDogdHJ1ZSxcbiAgICAgICdhbGxvd2VkTmFtZWQnIDogWydjbWQnXSxcbiAgICAgICdoZWxwJyA6IFwiXCJcIlxuICAgICAgICBUbyBnZXQgaGVscCBvbiBhIHBlY2lmaWMgY29tbWFuZCwgZG8gOlxuICAgICAgICB+fmhlbHAgaGVsbG9+fiAoaGVsbG8gYmVpbmcgdGhlIGNvbW1hbmQpXG4gICAgICAgIFwiXCJcIiBcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ292ZXJ2aWV3Jzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgICBfX18gICAgICAgICBfICAgX18gICAgICBfX1xuICAgICAgICAgICAgIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xuICAgICAgICAgICAgLyAvX18vIF8gXFxcXC8gX2AgLyAtX1xcXFwgXFxcXC9cXFxcLyAvIF9gIFxcXFwgViAvIC1fL1xuICAgICAgICAgICAgXFxcXF9fX19cXFxcX19fL1xcXFxfXyxfXFxcXF9fX3xcXFxcXy9cXFxcXy9cXFxcX18sX3xcXFxcXy9cXFxcX19ffFxuICAgICAgICAgICAgVGhlIHRleHQgZWRpdG9yIGhlbHBlclxuICAgICAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcbiAgICAgICAgICAgIHlvdXIgdGV4dCBlZGl0b3IuIFRoZXNlIGNvbW1hbmRzIG11c3QgYmUgcGxhY2VkIGJldHdlZW4gdHdvIFxuICAgICAgICAgICAgcGFpcnMgb2YgXCJ+XCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXG4gICAgICAgICAgICBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIsIHdpdGggeW91ciBjdXJzb3IgaW5zaWRlIHRoZSBjb21tYW5kXG4gICAgICAgICAgICBFeDogfn4haGVsbG9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBZb3UgZG9udCBuZWVkIHRvIGFjdHVhbGx5IHR5cGUgYW55IFwiflwiICh0aWxkZSkuIFxuICAgICAgICAgICAgUHJlc3NpbmcgXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiIHdpbGwgYWRkIHRoZW0gaWYgeW91IGFyZSBub3QgYWxyZWFkeVxuICAgICAgICAgICAgd2l0aGluIGEgY29tbWFuZC5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29kZXdhdmUgZG9lcyBub3QgdXNlIFVJIHRvIGRpc3BsYXkgYW55IGluZm9ybWF0aW9uLiBcbiAgICAgICAgICAgIEluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxuICAgICAgICAgICAgVGhlIGdlbmVyYXRlZCBjb21tZW50IGJsb2NrcyB3aWxsIGJlIHJlZmVycmVkIHRvIGFzIHdpbmRvd3MgXG4gICAgICAgICAgICBpbiB0aGUgaGVscCBzZWN0aW9ucy5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgVG8gY2xvc2UgdGhpcyB3aW5kb3cgKGkuZS4gcmVtb3ZlIHRoaXMgY29tbWVudCBibG9jayksIHByZXNzIFxuICAgICAgICAgICAgXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiIHdpdGggeW91ciBjdXJzb3Igb24gdGhlIGxpbmUgYmVsbG93LlxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgVXNlIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBmb3IgYSB3YWxrdGhyb3VnaCBvZiBzb21lIG9mIHRoZSBtYW55XG4gICAgICAgICAgICBmZWF0dXJlcyBvZiBDb2Rld2F2ZVxuICAgICAgICAgICAgfn4haGVscDpnZXRfc3RhcnRlZH5+IG9yIH5+IWhlbHA6ZGVtb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIExpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXG4gICAgICAgICAgICB+fiFoZWxwOnN1YmplY3Rzfn4gb3Igfn4haGVscDpzdWJ+fiBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn4hY2xvc2V+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdzdWJqZWN0cyc6e1xuICAgICAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICAgIH5+IWhlbHB+flxuICAgICAgICAgICAgfn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcbiAgICAgICAgICAgIH5+IWhlbHA6c3ViamVjdHN+fiAofn4haGVscDpzdWJ+filcbiAgICAgICAgICAgIH5+IWhlbHA6ZWRpdGluZ35+ICh+fiFoZWxwOmVkaXR+filcbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ3N1Yic6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6c3ViamVjdHMnXG4gICAgICAgIH1cbiAgICAgICAgJ2dldF9zdGFydGVkJzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgVGhlIGNsYXNzaWMgSGVsbG8gV29ybGQuXG4gICAgICAgICAgICB+fiFoZWxsb3x+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fmhlbHA6ZWRpdGluZzppbnRyb35+XG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGNyZWF0aW5nIHlvdXIgb3duIGNvbW1hbmRzLCBzZWU6XG4gICAgICAgICAgICB+fiFoZWxwOmVkaXRpbmd+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2Rld2F2ZSBjb21lcyB3aXRoIG1hbnkgcHJlLWV4aXN0aW5nIGNvbW1hbmRzLiBIZXJlIGlzIGFuIGV4YW1wbGVcbiAgICAgICAgICAgIG9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xuICAgICAgICAgICAgfn4hanM6Zn5+XG4gICAgICAgICAgICB+fiFqczppZn5+XG4gICAgICAgICAgICAgIH5+IWpzOmxvZ35+XCJ+fiFoZWxsb35+XCJ+fiEvanM6bG9nfn5cbiAgICAgICAgICAgIH5+IS9qczppZn5+XG4gICAgICAgICAgICB+fiEvanM6Zn5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcbiAgICAgICAgICAgIHByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLiBFbW1ldCBhYmJyZXZpYXRpb25zIHdpbGwgYmUgXG4gICAgICAgICAgICB1c2VkIGF1dG9tYXRpY2FsbHkgaWYgeW91IGFyZSBpbiBhIEhUTUwgb3IgQ1NTIGZpbGUuXG4gICAgICAgICAgICB+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXG4gICAgICAgICAgICB+fiFlbW1ldCB1bD5saX5+XG4gICAgICAgICAgICB+fiFlbW1ldCBtMiBjc3N+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb21tYW5kcyBhcmUgc3RvcmVkIGluIG5hbWVzcGFjZXMuIFRoZSBzYW1lIGNvbW1hbmQgY2FuIGhhdmUgXG4gICAgICAgICAgICBkaWZmZXJlbnQgcmVzdWx0cyBkZXBlbmRpbmcgb24gdGhlIG5hbWVzcGFjZS5cbiAgICAgICAgICAgIH5+IWpzOmVhY2h+flxuICAgICAgICAgICAgfn4hcGhwOm91dGVyOmVhY2h+flxuICAgICAgICAgICAgfn4hcGhwOmlubmVyOmVhY2h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBTb21lIG9mIHRoZSBuYW1lc3BhY2VzIGFyZSBhY3RpdmUgZGVwZW5kaW5nIG9uIHRoZSBjb250ZXh0LiBUaGVcbiAgICAgICAgICAgIGZvbGxvd2luZyBjb21tYW5kcyBhcmUgdGhlIHNhbWUgYW5kIHdpbGwgZGlzcGxheSB0aGUgY3VycmVudGx5XG4gICAgICAgICAgICBhY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxuICAgICAgICAgICAgY29yZSBuYW1lc3BhY2UgaXMgYWN0aXZlLlxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlfn5cbiAgICAgICAgICAgIH5+IWNvcmU6bmFtZXNwYWNlfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgWW91IGNhbiBtYWtlIGEgbmFtZXNwYWNlIGFjdGl2ZSB3aXRoIHRoZSBmb2xsb3dpbmcgY29tbWFuZC5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZSBwaHB+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDaGVjayB0aGUgbmFtZXNwYWNlcyBhZ2FpblxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgSW4gYWRkaXRpb24gdG8gZGV0ZWN0aW5nIHRoZSBkb2N1bWVudCB0eXBlLCBDb2Rld2F2ZSBjYW4gZGV0ZWN0IHRoZVxuICAgICAgICAgICAgY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcbiAgICAgICAgICAgIHdpbGwgYWRkIHRoZSBQSFAgdGFncyB3aGVuIHlvdSBuZWVkIHRoZW0uXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdkZW1vJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpnZXRfc3RhcnRlZCdcbiAgICAgICAgfVxuICAgICAgICAnZWRpdGluZyc6e1xuICAgICAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgICAgICdpbnRybyc6e1xuICAgICAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgICAgIENvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXG4gICAgICAgICAgICAgICAgcHV0IHlvdXIgY29udGVudCBpbnNpZGUgXCJzb3VyY2VcIiB0aGUgZG8gXCJzYXZlXCIuIFRyeSBhZGRpbmcgYW55IFxuICAgICAgICAgICAgICAgIHRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXG4gICAgICAgICAgICAgICAgfn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIElmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XG4gICAgICAgICAgICAgICAgZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxuICAgICAgICAgICAgICAgIHdoZW5ldmVyIHlvdSB3YW50LlxuICAgICAgICAgICAgICAgIH5+IW15X25ld19jb21tYW5kfn5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn5oZWxwOmVkaXRpbmc6aW50cm9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBBbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcImJveFwiLiBcbiAgICAgICAgICAgIFRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXG4gICAgICAgICAgICBUaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXG4gICAgICAgICAgICBcImNsb3NlXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxuICAgICAgICAgICAgY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5LlxuICAgICAgICAgICAgfn4hYm94fn5cbiAgICAgICAgICAgIFRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgV2hlbiB5b3UgY3JlYXRlIGEgY29tbWFuZCwgeW91IG1heSB3YW50IHRvIHNwZWNpZnkgd2hlcmUgdGhlIGN1cnNvciBcbiAgICAgICAgICAgIHdpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcInxcIiBcbiAgICAgICAgICAgIChWZXJ0aWNhbCBiYXIpLiBVc2UgMiBvZiB0aGVtIGlmIHlvdSB3YW50IHRvIHByaW50IHRoZSBhY3R1YWwgXG4gICAgICAgICAgICBjaGFyYWN0ZXIuXG4gICAgICAgICAgICB+fiFib3h+flxuICAgICAgICAgICAgb25lIDogfCBcbiAgICAgICAgICAgIHR3byA6IHx8XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgWW91IGNhbiBhbHNvIHVzZSB0aGUgXCJlc2NhcGVfcGlwZXNcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxuICAgICAgICAgICAgdmVydGljYWwgYmFycyB0aGF0IGFyZSBiZXR3ZWVuIGl0cyBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3NcbiAgICAgICAgICAgIH5+IWVzY2FwZV9waXBlc35+XG4gICAgICAgICAgICB8XG4gICAgICAgICAgICB+fiEvZXNjYXBlX3BpcGVzfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cbiAgICAgICAgICAgIElmIHlvdSB3YW50IHRvIHByaW50IGEgY29tbWFuZCB3aXRob3V0IGhhdmluZyBpdCBleHBhbmQgd2hlbiBcbiAgICAgICAgICAgIHRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXCIhXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxuICAgICAgICAgICAgfn4hIWhlbGxvfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXG4gICAgICAgICAgICB0aGUgXCJjb250ZW50XCIgY29tbWFuZC4gXCJjb250ZW50XCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XG4gICAgICAgICAgICB0aGF0IGlzIGJldHdlZW4gdGhlIHRhZ3MuIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBob3cgaXQgY2FuIGJlIHVzZWQuXG4gICAgICAgICAgICB+fiFlZGl0IHBocDppbm5lcjppZn5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdlZGl0Jzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDplZGl0aW5nJ1xuICAgICAgICB9XG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgIH0sXG4gICAgJ25vX2V4ZWN1dGUnOntcbiAgICAgICdyZXN1bHQnIDogbm9fZXhlY3V0ZVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgUHJldmVudCBldmVyeXRoaW5nIGluc2lkZSB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIGZyb20gZXhlY3V0aW5nXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2VzY2FwZV9waXBlcyc6e1xuICAgICAgJ3Jlc3VsdCcgOiBxdW90ZV9jYXJyZXQsXG4gICAgICAnY2hlY2tDYXJyZXQnIDogZmFsc2VcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIEVzY2FwZSBhbGwgY2FycmV0cyAoZnJvbSBcInxcIiB0byBcInx8XCIpXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3F1b3RlX2NhcnJldCc6e1xuICAgICAgJ2FsaWFzT2YnOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgfVxuICAgICdleGVjX3BhcmVudCc6e1xuICAgICAgJ2V4ZWN1dGUnIDogZXhlY19wYXJlbnRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIEV4ZWN1dGUgdGhlIGZpcnN0IGNvbW1hbmQgdGhhdCB3cmFwIHRoaXMgaW4gaXQncyBvcGVuIGFuZCBjbG9zZSB0YWdcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnY29udGVudCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBnZXRDb250ZW50XG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcbiAgICAgICAgdGhpcyB3aWxsIHJldHVybiB3aGF0IHdhcyBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgb2YgYSBjb21tYW5kXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2JveCc6e1xuICAgICAgJ2NscycgOiBCb3hDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIENyZWF0ZSB0aGUgYXBwYXJlbmNlIG9mIGEgYm94IGNvbXBvc2VkIGZyb20gY2hhcmFjdGVycy4gXG4gICAgICAgIFVzdWFsbHkgd3JhcHBlZCBpbiBhIGNvbW1lbnQuXG5cbiAgICAgICAgVGhlIGJveCB3aWxsIHRyeSB0byBhanVzdCBpdCdzIHNpemUgZnJvbSB0aGUgY29udGVudFxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdjbG9zZSc6e1xuICAgICAgJ2NscycgOiBDbG9zZUNtZFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgV2lsbCBjbG9zZSB0aGUgZmlyc3QgYm94IGFyb3VuZCB0aGlzXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3BhcmFtJzp7XG4gICAgICAncmVzdWx0JyA6IGdldFBhcmFtXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcbiAgICAgICAgdGhpcyB3aWxsIHJldHVybiBhIHBhcmFtZXRlciBmcm9tIHRoaXMgY29tbWFuZCBjYWxsXG5cbiAgICAgICAgWW91IGNhbiBwYXNzIGEgbnVtYmVyLCBhIHN0cmluZywgb3IgYm90aC4gXG4gICAgICAgIEEgbnVtYmVyIGZvciBhIHBvc2l0aW9uZWQgYXJndW1lbnQgYW5kIGEgc3RyaW5nXG4gICAgICAgIGZvciBhIG5hbWVkIHBhcmFtZXRlclxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdlZGl0Jzp7XG4gICAgICAnY21kcycgOiBFZGl0Q21kLnNldENtZHMoe1xuICAgICAgICAnc2F2ZSc6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXhlY19wYXJlbnQnXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgJ2NscycgOiBFZGl0Q21kLFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydjbWQnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQWxsb3dzIHRvIGVkaXQgYSBjb21tYW5kLiBcbiAgICAgICAgU2VlIH5+IWhlbHA6ZWRpdGluZ35+IGZvciBhIHF1aWNrIHR1dG9yaWFsXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3JlbmFtZSc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2FwcGxpY2FibGUnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIFlvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiLFxuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogcmVuYW1lQ29tbWFuZCxcbiAgICAgICdwYXJzZScgOiB0cnVlLFxuICAgICAgJ2FsbG93ZWROYW1lZCc6Wydmcm9tJywndG8nXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQWxsb3dzIHRvIHJlbmFtZSBhIGNvbW1hbmQgYW5kIGNoYW5nZSBpdCdzIG5hbWVzcGFjZS4gXG4gICAgICAgIFlvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cbiAgICAgICAgLSBUaGUgZmlyc3QgcGFyYW0gaXMgdGhlIG9sZCBuYW1lXG4gICAgICAgIC0gVGhlbiBzZWNvbmQgcGFyYW0gaXMgdGhlIG5ldyBuYW1lLCBpZiBpdCBoYXMgbm8gbmFtZXNwYWNlLFxuICAgICAgICAgIGl0IHdpbGwgdXNlIHRoZSBvbmUgZnJvbSB0aGUgb3JpZ2luYWwgY29tbWFuZC5cblxuICAgICAgICBleC46IH5+IXJlbmFtZSBteV9jb21tYW5kIG15X2NvbW1hbmQyfn5cbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncmVtb3ZlJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfYXBwbGljYWJsZScgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCIsXG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiByZW1vdmVDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnY21kJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIEFsbG93cyB0byByZW1vdmUgYSBjb21tYW5kLiBcbiAgICAgICAgWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdhbGlhcyc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogYWxpYXNDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICB9LFxuICAgICduYW1lc3BhY2UnOntcbiAgICAgICdjbHMnIDogTmFtZVNwYWNlQ21kXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBTaG93IHRoZSBjdXJyZW50IG5hbWVzcGFjZXMuXG5cbiAgICAgICAgQSBuYW1lIHNwYWNlIGNvdWxkIGJlIHRoZSBuYW1lIG9mIHRoZSBsYW5ndWFnZVxuICAgICAgICBvciBvdGhlciBraW5kIG9mIGNvbnRleHRzXG5cbiAgICAgICAgSWYgeW91IHBhc3MgYSBwYXJhbSB0byB0aGlzIGNvbW1hbmQsIGl0IHdpbGwgXG4gICAgICAgIGFkZCB0aGUgcGFyYW0gYXMgYSBuYW1lc3BhY2UgZm9yIHRoZSBjdXJyZW50IGVkaXRvclxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICduc3BjJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTpuYW1lc3BhY2UnXG4gICAgfSxcbiAgICAnbGlzdCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBsaXN0Q29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJywnYm94JywnY29udGV4dCddXG4gICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIExpc3QgYXZhaWxhYmxlIGNvbW1hbmRzXG5cbiAgICAgICAgWW91IGNhbiB1c2UgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGNob29zZSBhIHNwZWNpZmljIG5hbWVzcGFjZSwgXG4gICAgICAgIGJ5IGRlZmF1bHQgYWxsIGN1cmVudCBuYW1lc3BhY2Ugd2lsbCBiZSBzaG93blxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdscyc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6bGlzdCdcbiAgICB9LFxuICAgICdnZXQnOntcbiAgICAgICdyZXN1bHQnIDogZ2V0Q29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIG91dHB1dCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZVxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdzZXQnOntcbiAgICAgICdyZXN1bHQnIDogc2V0Q29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJywndmFsdWUnLCd2YWwnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgc2V0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3N0b3JlX2pzb24nOntcbiAgICAgICdyZXN1bHQnIDogc3RvcmVKc29uQ29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJywnanNvbiddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBzZXQgYSB2YXJpYWJsZSB3aXRoIHNvbWUganNvbiBkYXRhXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2pzb24nOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOnN0b3JlX2pzb24nXG4gICAgfSxcbiAgICAndGVtcGxhdGUnOntcbiAgICAgICdjbHMnIDogVGVtcGxhdGVDbWRcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnbmFtZScsJ3NlcCddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICByZW5kZXIgYSB0ZW1wbGF0ZSBmb3IgYSB2YXJpYWJsZVxuXG4gICAgICAgIElmIHRoZSBmaXJzdCBwYXJhbSBpcyBub3Qgc2V0IGl0IHdpbGwgdXNlIGFsbCB2YXJpYWJsZXMgXG4gICAgICAgIGZvciB0aGUgcmVuZGVyXG4gICAgICAgIElmIHRoZSB2YXJpYWJsZSBpcyBhbiBhcnJheSB0aGUgdGVtcGxhdGUgd2lsbCBiZSByZXBlYXRlZCBcbiAgICAgICAgZm9yIGVhY2ggaXRlbXNcbiAgICAgICAgVGhlIGBzZXBgIHBhcmFtIGRlZmluZSB3aGF0IHdpbGwgc2VwYXJhdGUgZWFjaCBpdGVtIFxuICAgICAgICBhbmQgZGVmYXVsdCB0byBhIGxpbmUgYnJlYWtcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnZW1tZXQnOntcbiAgICAgICdjbHMnIDogRW1tZXRDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIENvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcbiAgICAgICAgcHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuXG5cbiAgICAgICAgUGFzcyB0aGUgRW1tZXQgYWJicmV2aWF0aW9uIGFzIGEgcGFyYW0gdG8gZXhwZW5kIGl0LlxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgIFxuICB9KVxuICBcbmhlbHAgPSAoaW5zdGFuY2UpIC0+XG4gIGNtZE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnY21kJ10pXG4gIGlmIGNtZE5hbWU/XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQoY21kTmFtZSlcbiAgICBpZiBjbWQ/XG4gICAgICBoZWxwQ21kID0gY21kLmdldENtZCgnaGVscCcpXG4gICAgICB0ZXh0ID0gaWYgaGVscENtZCB0aGVuIFwifn4je2hlbHBDbWQuZnVsbE5hbWV9fn5cIiBlbHNlIFwiVGhpcyBjb21tYW5kIGhhcyBubyBoZWxwIHRleHRcIlxuICAgICAgc3ViY29tbWFuZHMgPSBpZiBjbWQuY21kcy5sZW5ndGhcbiAgICAgICAgXCJcIlwiXG5cbiAgICAgICAgU3ViLUNvbW1hbmRzIDpcbiAgICAgICAgfn5scyAje2NtZC5mdWxsTmFtZX0gYm94Om5vIGNvbnRleHQ6bm9+flxuICAgICAgICBcIlwiXCJcbiAgICAgIGVsc2UgXG4gICAgICAgIFwiXCJcbiAgICAgIHJldHVybiBcIlwiXCJcbiAgICAgICAgfn5ib3h+flxuICAgICAgICBIZWxwIGZvciB+fiEje2NtZC5mdWxsTmFtZX1+fiA6XG5cbiAgICAgICAgI3t0ZXh0fVxuICAgICAgICAje3N1YmNvbW1hbmRzfVxuXG4gICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgIH5+L2JveH5+XG4gICAgICAgIFwiXCJcIlxuICAgIGVsc2UgXG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbiAgZWxzZVxuICAgIHJldHVybiAnfn5oZWxwOm92ZXJ2aWV3fn4nXG5cbm5vX2V4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gIHJlZyA9IG5ldyBSZWdFeHAoXCJeKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cykgKyAnKScgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpKVxuICByZXR1cm4gaW5zdGFuY2Uuc3RyLnJlcGxhY2UocmVnLCckMScpXG4gIFxucXVvdGVfY2FycmV0ID0gKGluc3RhbmNlKSAtPlxuICByZXR1cm4gaW5zdGFuY2UuY29udGVudC5yZXBsYWNlKC9cXHwvZywgJ3x8JylcbmV4ZWNfcGFyZW50ID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5wYXJlbnQ/XG4gICAgcmVzID0gaW5zdGFuY2UucGFyZW50LmV4ZWN1dGUoKVxuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnRcbiAgICBpbnN0YW5jZS5yZXBsYWNlRW5kID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VFbmRcbiAgICByZXR1cm4gcmVzXG5nZXRDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuICBhZmZpeGVzX2VtcHR5ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydhZmZpeGVzX2VtcHR5J10sZmFsc2UpXG4gIHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gIHN1ZmZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sJycpXG4gIGlmIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2U/XG4gICAgcmV0dXJuIHByZWZpeCArIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmNvbnRlbnQgb3IgJycpICsgc3VmZml4XG4gIGlmIGFmZml4ZXNfZW1wdHlcbiAgICByZXR1cm4gcHJlZml4ICsgc3VmZml4XG5yZW5hbWVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZVxuICAgIHN0b3JhZ2UubG9hZCgnY21kcycpXG4gIC50aGVuIChzYXZlZENtZHMpPT5cbiAgICBvcmlnbmluYWxOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2Zyb20nXSlcbiAgICBuZXdOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ3RvJ10pXG4gICAgaWYgb3JpZ25pbmFsTmFtZT8gYW5kIG5ld05hbWU/XG4gICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChvcmlnbmluYWxOYW1lKVxuICAgICAgaWYgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdPyBhbmQgY21kP1xuICAgICAgICB1bmxlc3MgbmV3TmFtZS5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCcnKSArIG5ld05hbWVcbiAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXVxuICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShuZXdOYW1lLGNtZERhdGEpXG4gICAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgICAgc2F2ZWRDbWRzW25ld05hbWVdID0gY21kRGF0YVxuICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgICAgICBzdG9yYWdlLnNhdmUoJ2NtZHMnLHNhdmVkQ21kcylcbiAgICAgICAgLnRoZW4gPT5cbiAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgZWxzZSBpZiBjbWQ/IFxuICAgICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIlxuICAgICAgZWxzZSBcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5yZW1vdmVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgICBpZiBuYW1lP1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG4gICAgICAgIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpXG4gICAgICAudGhlbiAoc2F2ZWRDbWRzKT0+XG4gICAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG5hbWUpXG4gICAgICAgIGlmIHNhdmVkQ21kc1tuYW1lXT8gYW5kIGNtZD9cbiAgICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW25hbWVdXG4gICAgICAgICAgY21kLnVucmVnaXN0ZXIoKVxuICAgICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV1cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICAgICAgICBzdG9yYWdlLnNhdmUoJ2NtZHMnLHNhdmVkQ21kcylcbiAgICAgICAgICAudGhlbiA9PlxuICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgZWxzZSBpZiBjbWQ/IFxuICAgICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiXG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5hbGlhc0NvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCdhbGlhcyddKVxuICBpZiBuYW1lPyBhbmQgYWxpYXM/XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQobmFtZSlcbiAgICBpZiBjbWQ/XG4gICAgICBjbWQgPSBjbWQuZ2V0QWxpYXNlZCgpIG9yIGNtZFxuICAgICAgIyB1bmxlc3MgYWxpYXMuaW5kZXhPZignOicpID4gLTFcbiAgICAgICAgIyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChhbGlhcywgeyBhbGlhc09mOiBjbWQuZnVsbE5hbWUgfSlcbiAgICAgIHJldHVybiBcIlwiXG4gICAgZWxzZSBcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIlxuXG5saXN0Q29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgYm94ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnYm94J10sdHJ1ZSlcbiAgdXNlQ29udGV4dCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2NvbnRleHQnXSx0cnVlKVxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgbmFtZXNwYWNlcyA9IGlmIG5hbWUgXG4gICAgW25hbWVdIFxuICBlbHNlIFxuICAgIGluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLmZpbHRlcigobnNwYykgPT4gbnNwYyAhPSBpbnN0YW5jZS5jbWQuZnVsbE5hbWUpLmNvbmNhdChcIl9yb290XCIpXG5cbiAgY29udGV4dCA9IGlmIHVzZUNvbnRleHRcbiAgICBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpXG4gIGVsc2VcbiAgICBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dFxuXG4gIGNvbW1hbmRzID0gbmFtZXNwYWNlcy5yZWR1Y2UgKGNvbW1hbmRzLCBuc3BjKSA9PiBcbiAgICAgIGNtZCA9IGlmIG5zcGMgPT0gXCJfcm9vdFwiIHRoZW4gQ29tbWFuZC5jbWRzIGVsc2UgY29udGV4dC5nZXRDbWQobnNwYyxtdXN0RXhlY3V0ZTpmYWxzZSlcbiAgICAgIGlmIGNtZD9cbiAgICAgICAgY21kLmluaXQoKVxuICAgICAgICBpZiBjbWQuY21kc1xuICAgICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGNtZC5jbWRzKVxuICAgICAgY29tbWFuZHNcbiAgICAsIFtdXG5cbiAgdGV4dCA9IGlmIGNvbW1hbmRzLmxlbmd0aCBcbiAgICBjb21tYW5kcy5tYXAoKGNtZCk9PiBcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIChpZiBjbWQuaXNFeGVjdXRhYmxlKCkgdGhlbiAnfn4hJyBlbHNlICd+fiFscyAnKStjbWQuZnVsbE5hbWUrJ35+J1xuICAgICkuam9pbihcIlxcblwiKVxuICBlbHNlXG4gICAgXCJUaGlzIGNvbnRhaW5zIG5vIHN1Yi1jb21tYW5kc1wiXG5cbiAgaWYgYm94XG4gICAgXCJcIlwiXG4gICAgICB+fmJveH5+XG4gICAgICAje3RleHR9XG5cbiAgICAgIH5+IWNsb3NlfH5+XG4gICAgICB+fi9ib3h+flxuICAgICAgXCJcIlwiXG4gIGVsc2VcbiAgICB0ZXh0XG4gIFxuZ2V0Q29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIHJlcyA9IFBhdGhIZWxwZXIuZ2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLG5hbWUpXG4gIGlmIHR5cGVvZiByZXMgPT0gXCJvYmplY3RcIlxuICAgIEpTT04uc3RyaW5naWZ5KHJlcyxudWxsLCcgICcpXG4gIGVsc2VcbiAgICByZXNcblxuc2V0Q29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIHZhbCA9IGlmIChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ3ZhbHVlJywndmFsJ10pKT9cbiAgICBwXG4gIGVsc2UgaWYgaW5zdGFuY2UuY29udGVudFxuICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgUGF0aEhlbHBlci5zZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsbmFtZSx2YWwpXG4gICcnXG5cbnN0b3JlSnNvbkNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCdqc29uJ10pKT9cbiAgICBwXG4gIGVsc2UgaWYgaW5zdGFuY2UuY29udGVudFxuICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgUGF0aEhlbHBlci5zZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsbmFtZSwgSlNPTi5wYXJzZSh2YWwpKVxuICAnJ1xuXG5nZXRQYXJhbSA9IChpbnN0YW5jZSkgLT5cbiAgaWYgaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZT9cbiAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5nZXRQYXJhbShpbnN0YW5jZS5wYXJhbXMsaW5zdGFuY2UuZ2V0UGFyYW0oWydkZWYnLCdkZWZhdWx0J10pKVxuICBcbmNsYXNzIEJveENtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGluc3RhbmNlLmNvbnRleHQpXG4gICAgQGNtZCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ2NtZCddKVxuICAgIGlmIEBjbWQ/XG4gICAgICBAaGVscGVyLm9wZW5UZXh0ICA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgQGNtZCArIEBpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzXG4gICAgICBAaGVscGVyLmNsb3NlVGV4dCA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgQGluc3RhbmNlLmNvZGV3YXZlLmNsb3NlQ2hhciArIEBjbWQuc3BsaXQoXCIgXCIpWzBdICsgQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICBAaGVscGVyLmRlY28gPSBAaW5zdGFuY2UuY29kZXdhdmUuZGVjb1xuICAgIEBoZWxwZXIucGFkID0gMlxuICAgIEBoZWxwZXIucHJlZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gICAgQGhlbHBlci5zdWZmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgICBcbiAgaGVpZ2h0OiAtPlxuICAgIGlmIEBib3VuZHMoKT9cbiAgICAgIGhlaWdodCA9IEBib3VuZHMoKS5oZWlnaHRcbiAgICBlbHNlXG4gICAgICBoZWlnaHQgPSAzXG4gICAgICBcbiAgICBwYXJhbXMgPSBbJ2hlaWdodCddXG4gICAgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxIFxuICAgICAgcGFyYW1zLnB1c2goMSlcbiAgICBlbHNlIGlmIEBpbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMFxuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICByZXR1cm4gQGluc3RhbmNlLmdldFBhcmFtKHBhcmFtcyxoZWlnaHQpXG4gICAgICBcbiAgd2lkdGg6IC0+XG4gICAgaWYgQGJvdW5kcygpP1xuICAgICAgd2lkdGggPSBAYm91bmRzKCkud2lkdGhcbiAgICBlbHNlXG4gICAgICB3aWR0aCA9IDNcbiAgICAgIFxuICAgIHBhcmFtcyA9IFsnd2lkdGgnXVxuICAgIGlmIEBpbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSBcbiAgICAgIHBhcmFtcy5wdXNoKDApXG4gICAgcmV0dXJuIE1hdGgubWF4KEBtaW5XaWR0aCgpLCBAaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCB3aWR0aCkpXG5cbiAgXG4gIGJvdW5kczogLT5cbiAgICBpZiBAaW5zdGFuY2UuY29udGVudFxuICAgICAgdW5sZXNzIEBfYm91bmRzP1xuICAgICAgICBAX2JvdW5kcyA9IEBoZWxwZXIudGV4dEJvdW5kcyhAaW5zdGFuY2UuY29udGVudClcbiAgICAgIHJldHVybiBAX2JvdW5kc1xuICAgICAgXG4gIHJlc3VsdDogLT5cbiAgICBAaGVscGVyLmhlaWdodCA9IEBoZWlnaHQoKVxuICAgIEBoZWxwZXIud2lkdGggPSBAd2lkdGgoKVxuICAgIHJldHVybiBAaGVscGVyLmRyYXcoQGluc3RhbmNlLmNvbnRlbnQpXG4gIG1pbldpZHRoOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICByZXR1cm4gQGNtZC5sZW5ndGhcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMFxuICBcbmNsYXNzIENsb3NlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAaGVscGVyID0gbmV3IEJveEhlbHBlcihAaW5zdGFuY2UuY29udGV4dClcbiAgZXhlY3V0ZTogLT5cbiAgICBwcmVmaXggPSBAaGVscGVyLnByZWZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCcnKVxuICAgIHN1ZmZpeCA9IEBoZWxwZXIuc3VmZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sJycpXG4gICAgYm94ID0gQGhlbHBlci5nZXRCb3hGb3JQb3MoQGluc3RhbmNlLmdldFBvcygpKVxuICAgIHJlcXVpcmVkX2FmZml4ZXMgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydyZXF1aXJlZF9hZmZpeGVzJ10sdHJ1ZSlcbiAgICBpZiAhcmVxdWlyZWRfYWZmaXhlc1xuICAgICAgQGhlbHBlci5wcmVmaXggPSBAaGVscGVyLnN1ZmZpeCA9ICcnXG4gICAgICBib3gyID0gQGhlbHBlci5nZXRCb3hGb3JQb3MoQGluc3RhbmNlLmdldFBvcygpKVxuICAgICAgaWYgYm94Mj8gYW5kICghYm94PyBvciBib3guc3RhcnQgPCBib3gyLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCBvciBib3guZW5kID4gYm94Mi5lbmQgKyBzdWZmaXgubGVuZ3RoKVxuICAgICAgICBib3ggPSBib3gyXG4gICAgaWYgYm94P1xuICAgICAgZGVwdGggPSBAaGVscGVyLmdldE5lc3RlZEx2bChAaW5zdGFuY2UuZ2V0UG9zKCkuc3RhcnQpXG4gICAgICBpZiBkZXB0aCA8IDJcbiAgICAgICAgQGluc3RhbmNlLmluQm94ID0gbnVsbFxuICAgICAgQGluc3RhbmNlLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KGJveC5zdGFydCxib3guZW5kLCcnKSlcbiAgICBlbHNlXG4gICAgICBAaW5zdGFuY2UucmVwbGFjZVdpdGgoJycpXG4gICAgICAgICAgXG5jbGFzcyBFZGl0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAY21kTmFtZSA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMCwnY21kJ10pXG4gICAgQHZlcmJhbGl6ZSA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMV0pIGluIFsndicsJ3ZlcmJhbGl6ZSddXG4gICAgaWYgQGNtZE5hbWU/XG4gICAgICBAZmluZGVyID0gQGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0RmluZGVyKEBjbWROYW1lKSBcbiAgICAgIEBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2VcbiAgICAgIEBjbWQgPSBAZmluZGVyLmZpbmQoKVxuICAgIEBlZGl0YWJsZSA9IGlmIEBjbWQ/IHRoZW4gQGNtZC5pc0VkaXRhYmxlKCkgZWxzZSB0cnVlXG4gIHJlc3VsdDogLT5cbiAgICBpZiBAaW5zdGFuY2UuY29udGVudFxuICAgICAgcmV0dXJuIEByZXN1bHRXaXRoQ29udGVudCgpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEByZXN1bHRXaXRob3V0Q29udGVudCgpXG4gIHJlc3VsdFdpdGhDb250ZW50OiAtPlxuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQoQGluc3RhbmNlLmNvbnRlbnQpXG4gICAgICBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgZGF0YSA9IHt9XG4gICAgICBmb3IgcCBpbiBFZGl0Q21kLnByb3BzXG4gICAgICAgIHAud3JpdGVGb3IocGFyc2VyLGRhdGEpXG4gICAgICBDb21tYW5kLnNhdmVDbWQoQGNtZE5hbWUsIGRhdGEpXG4gICAgICByZXR1cm4gJydcbiAgcHJvcHNEaXNwbGF5OiAtPlxuICAgICAgY21kID0gQGNtZFxuICAgICAgcmV0dXJuIEVkaXRDbWQucHJvcHMubWFwKCAocCktPiBwLmRpc3BsYXkoY21kKSApLmZpbHRlciggKHApLT4gcD8gKS5qb2luKFwiXFxuXCIpXG4gIHJlc3VsdFdpdGhvdXRDb250ZW50OiAtPlxuICAgIGlmICFAY21kIG9yIEBlZGl0YWJsZVxuICAgICAgbmFtZSA9IGlmIEBjbWQgdGhlbiBAY21kLmZ1bGxOYW1lIGVsc2UgQGNtZE5hbWVcbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KFxuICAgICAgICBcIlwiXCJcbiAgICAgICAgfn5ib3ggY21kOlwiI3tAaW5zdGFuY2UuY21kLmZ1bGxOYW1lfSAje25hbWV9XCJ+flxuICAgICAgICAje0Bwcm9wc0Rpc3BsYXkoKX1cbiAgICAgICAgfn4hc2F2ZX5+IH5+IWNsb3Nlfn5cbiAgICAgICAgfn4vYm94fn5cbiAgICAgICAgXCJcIlwiKVxuICAgICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gbm9cbiAgICAgIHJldHVybiBpZiBAdmVyYmFsaXplIHRoZW4gcGFyc2VyLmdldFRleHQoKSBlbHNlIHBhcnNlci5wYXJzZUFsbCgpXG5FZGl0Q21kLnNldENtZHMgPSAoYmFzZSkgLT5cbiAgaW5JbnN0YW5jZSA9IGJhc2UuaW5faW5zdGFuY2UgPSB7Y21kczp7fX1cbiAgZm9yIHAgaW4gRWRpdENtZC5wcm9wc1xuICAgIHAuc2V0Q21kKGluSW5zdGFuY2UuY21kcylcbiAgICAjIHAuc2V0Q21kKGJhc2UpXG4gIHJldHVybiBiYXNlXG5FZGl0Q21kLnByb3BzID0gW1xuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fY2FycmV0JywgICAgICAgICB7b3B0OidjaGVja0NhcnJldCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJywgICAgICAgICAge29wdDoncGFyc2UnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCAgICdwcmV2ZW50X3BhcnNlX2FsbCcsIHtvcHQ6J3ByZXZlbnRQYXJzZUFsbCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woICAgJ3JlcGxhY2VfYm94JywgICAgICAge29wdDoncmVwbGFjZUJveCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZyggJ25hbWVfdG9fcGFyYW0nLCAgICAge29wdDonbmFtZVRvUGFyYW0nfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoICdhbGlhc19vZicsICAgICAgICAgIHt2YXI6J2FsaWFzT2YnLCBjYXJyZXQ6dHJ1ZX0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCAnaGVscCcsICAgICAgICAgICAgICB7ZnVuY3Q6J2hlbHAnLCBzaG93RW1wdHk6dHJ1ZX0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCAnc291cmNlJywgICAgICAgICAgICB7dmFyOidyZXN1bHRTdHInLCBkYXRhTmFtZToncmVzdWx0Jywgc2hvd0VtcHR5OnRydWUsIGNhcnJldDp0cnVlfSksXG5dXG5jbGFzcyBOYW1lU3BhY2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBuYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswXSlcbiAgcmVzdWx0OiAtPlxuICAgIGlmIEBuYW1lP1xuICAgICAgQGluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0LmFkZE5hbWVTcGFjZShAbmFtZSlcbiAgICAgIHJldHVybiAnJ1xuICAgIGVsc2VcbiAgICAgIG5hbWVzcGFjZXMgPSBAaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKClcbiAgICAgIHR4dCA9ICd+fmJveH5+XFxuJ1xuICAgICAgZm9yIG5zcGMgaW4gbmFtZXNwYWNlcyBcbiAgICAgICAgaWYgbnNwYyAhPSBAaW5zdGFuY2UuY21kLmZ1bGxOYW1lXG4gICAgICAgICAgdHh0ICs9IG5zcGMrJ1xcbidcbiAgICAgIHR4dCArPSAnfn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dClcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKVxuXG5cbmNsYXNzIFRlbXBsYXRlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAbmFtZSA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICAgIEBzZXAgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydzZXAnXSxcIlxcblwiKVxuICByZXN1bHQ6IC0+XG4gICAgZGF0YSA9IGlmIEBuYW1lIHRoZW4gUGF0aEhlbHBlci5nZXRQYXRoKEBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBAbmFtZSkgZWxzZSBAaW5zdGFuY2UuY29kZXdhdmUudmFyc1xuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50IGFuZCBkYXRhPyBhbmQgZGF0YSAhPSBmYWxzZVxuICAgICAgaWYgQXJyYXkuaXNBcnJheShkYXRhKVxuICAgICAgICBkYXRhLm1hcCAoaXRlbSk9PkByZW5kZXJUZW1wbGF0ZShpdGVtKVxuICAgICAgICAgIC5qb2luKEBzZXApXG4gICAgICBlbHNlXG4gICAgICAgIEByZW5kZXJUZW1wbGF0ZShkYXRhKVxuICAgIGVsc2VcbiAgICAgICcnXG4gIHJlbmRlclRlbXBsYXRlOiAoZGF0YSkgLT5cbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcGFyc2VyLnZhcnMgPSBpZiB0eXBlb2YgZGF0YSA9PSBcIm9iamVjdFwiIHRoZW4gZGF0YSBlbHNlIHt2YWx1ZTpkYXRhfVxuICAgICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gbm9cbiAgICAgIHBhcnNlci5wYXJzZUFsbCgpXG5cblxuY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBhYmJyID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCdhYmJyJywnYWJicmV2aWF0aW9uJ10pXG4gICAgQGxhbmcgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2xhbmcnLCdsYW5ndWFnZSddKVxuICByZXN1bHQ6IC0+XG4gICAgZW1tZXQgPSBpZiB3aW5kb3c/LmVtbWV0P1xuICAgICAgd2luZG93LmVtbWV0XG4gICAgZWxzZSBpZiB3aW5kb3c/LnNlbGY/LmVtbWV0P1xuICAgICAgd2luZG93LnNlbGYuZW1tZXRcbiAgICBlbHNlIGlmIHdpbmRvdz8uZ2xvYmFsPy5lbW1ldD9cbiAgICAgIHdpbmRvdy5nbG9iYWwuZW1tZXRcbiAgICBlbHNlIGlmIHJlcXVpcmU/IFxuICAgICAgdHJ5IFxuICAgICAgICByZXF1aXJlKCdlbW1ldCcpXG4gICAgICBjYXRjaCBleFxuICAgICAgICBAaW5zdGFuY2UuY29kZXdhdmUubG9nZ2VyLmxvZygnRW1tZXQgaXMgbm90IGF2YWlsYWJsZSwgaXQgbWF5IG5lZWQgdG8gYmUgaW5zdGFsbGVkIG1hbnVhbGx5JylcbiAgICAgICAgbnVsbFxuICAgIGlmIGVtbWV0P1xuICAgICAgIyBlbW1ldC5yZXF1aXJlKCcuL3BhcnNlci9hYmJyZXZpYXRpb24nKS5leHBhbmQoJ3VsPmxpJywge3Bhc3RlZENvbnRlbnQ6J2xvcmVtJ30pXG4gICAgICByZXMgPSBlbW1ldC5leHBhbmRBYmJyZXZpYXRpb24oQGFiYnIsIEBsYW5nKVxuICAgICAgcmVzLnJlcGxhY2UoL1xcJFxcezBcXH0vZywgJ3wnKVxuXG5cblxuIiwidmFyIEJveENtZCwgQ2xvc2VDbWQsIEVkaXRDbWQsIEVtbWV0Q21kLCBOYW1lU3BhY2VDbWQsIFRlbXBsYXRlQ21kLCBhbGlhc0NvbW1hbmQsIGV4ZWNfcGFyZW50LCBnZXRDb21tYW5kLCBnZXRDb250ZW50LCBnZXRQYXJhbSwgaGVscCwgbGlzdENvbW1hbmQsIG5vX2V4ZWN1dGUsIHF1b3RlX2NhcnJldCwgcmVtb3ZlQ29tbWFuZCwgcmVuYW1lQ29tbWFuZCwgc2V0Q29tbWFuZCwgc3RvcmVKc29uQ29tbWFuZDtcblxuaW1wb3J0IHtcbiAgQ29tbWFuZCxcbiAgQmFzZUNvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIExhbmdEZXRlY3RvclxufSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmltcG9ydCB7XG4gIEJveEhlbHBlclxufSBmcm9tICcuLi9Cb3hIZWxwZXInO1xuXG5pbXBvcnQge1xuICBFZGl0Q21kUHJvcFxufSBmcm9tICcuLi9FZGl0Q21kUHJvcCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhdGhIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9QYXRoSGVscGVyJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgdmFyIENvcmVDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBDb3JlQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBjb3JlO1xuICAgIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKTtcbiAgICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSk7XG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICAnaGVscCc6IHtcbiAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAncmVzdWx0JzogaGVscCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJUbyBnZXQgaGVscCBvbiBhIHBlY2lmaWMgY29tbWFuZCwgZG8gOlxcbn5+aGVscCBoZWxsb35+IChoZWxsbyBiZWluZyB0aGUgY29tbWFuZClcIixcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ292ZXJ2aWV3Jzoge1xuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+cXVvdGVfY2FycmV0fn5cXG4gIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXFxuIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xcbi8gL19fLyBfIFxcXFwvIF9gIC8gLV9cXFxcIFxcXFwvXFxcXC8gLyBfYCBcXFxcIFYgLyAtXy9cXG5cXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XFxuVGhlIHRleHQgZWRpdG9yIGhlbHBlclxcbn5+L3F1b3RlX2NhcnJldH5+XFxuXFxuV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcXG55b3VyIHRleHQgZWRpdG9yLiBUaGVzZSBjb21tYW5kcyBtdXN0IGJlIHBsYWNlZCBiZXR3ZWVuIHR3byBcXG5wYWlycyBvZiBcXFwiflxcXCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiLCB3aXRoIHlvdXIgY3Vyc29yIGluc2lkZSB0aGUgY29tbWFuZFxcbkV4OiB+fiFoZWxsb35+XFxuXFxuWW91IGRvbnQgbmVlZCB0byBhY3R1YWxseSB0eXBlIGFueSBcXFwiflxcXCIgKHRpbGRlKS4gXFxuUHJlc3NpbmcgXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpbGwgYWRkIHRoZW0gaWYgeW91IGFyZSBub3QgYWxyZWFkeVxcbndpdGhpbiBhIGNvbW1hbmQuXFxuXFxuQ29kZXdhdmUgZG9lcyBub3QgdXNlIFVJIHRvIGRpc3BsYXkgYW55IGluZm9ybWF0aW9uLiBcXG5JbnN0ZWFkLCBpdCB1c2VzIHRleHQgd2l0aGluIGNvZGUgY29tbWVudHMgdG8gbWltaWMgVUlzLiBcXG5UaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcXG5pbiB0aGUgaGVscCBzZWN0aW9ucy5cXG5cXG5UbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpdGggeW91ciBjdXJzb3Igb24gdGhlIGxpbmUgYmVsbG93Llxcbn5+IWNsb3NlfH5+XFxuXFxuVXNlIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBmb3IgYSB3YWxrdGhyb3VnaCBvZiBzb21lIG9mIHRoZSBtYW55XFxuZmVhdHVyZXMgb2YgQ29kZXdhdmVcXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cXG5cXG5MaXN0IG9mIGFsbCBoZWxwIHN1YmplY3RzIFxcbn5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxcblxcbn5+IWNsb3Nlfn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc3ViamVjdHMnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn4haGVscH5+XFxufn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcXG5+fiFoZWxwOnN1YmplY3Rzfn4gKH5+IWhlbHA6c3Vifn4pXFxufn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6c3ViamVjdHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZ2V0X3N0YXJ0ZWQnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxuVGhlIGNsYXNzaWMgSGVsbG8gV29ybGQuXFxufn4haGVsbG98fn5cXG5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxufn5xdW90ZV9jYXJyZXR+flxcblxcbkZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGNyZWF0aW5nIHlvdXIgb3duIGNvbW1hbmRzLCBzZWU6XFxufn4haGVscDplZGl0aW5nfn5cXG5cXG5Db2Rld2F2ZSBjb21lcyB3aXRoIG1hbnkgcHJlLWV4aXN0aW5nIGNvbW1hbmRzLiBIZXJlIGlzIGFuIGV4YW1wbGVcXG5vZiBKYXZhU2NyaXB0IGFiYnJldmlhdGlvbnNcXG5+fiFqczpmfn5cXG5+fiFqczppZn5+XFxuICB+fiFqczpsb2d+flxcXCJ+fiFoZWxsb35+XFxcIn5+IS9qczpsb2d+flxcbn5+IS9qczppZn5+XFxufn4hL2pzOmZ+flxcblxcbkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxcbnVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cXG5+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXFxufn4hZW1tZXQgdWw+bGl+flxcbn5+IWVtbWV0IG0yIGNzc35+XFxuXFxuQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxcbmRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxcbn5+IWpzOmVhY2h+flxcbn5+IXBocDpvdXRlcjplYWNofn5cXG5+fiFwaHA6aW5uZXI6ZWFjaH5+XFxuXFxuU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXFxuZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcXG5hY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxcbmNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cXG5+fiFuYW1lc3BhY2V+flxcbn5+IWNvcmU6bmFtZXNwYWNlfn5cXG5cXG5Zb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxcbn5+IW5hbWVzcGFjZSBwaHB+flxcblxcbkNoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXFxufn4hbmFtZXNwYWNlfn5cXG5cXG5JbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXFxuY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcXG53aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxcblxcbn5+L3F1b3RlX2NhcnJldH5+XFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZGVtbyc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6Z2V0X3N0YXJ0ZWQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZWRpdGluZyc6IHtcbiAgICAgICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICAgICAnaW50cm8nOiB7XG4gICAgICAgICAgICAgICAgJ3Jlc3VsdCc6IFwiQ29kZXdhdmUgYWxsb3dzIHlvdSB0byBtYWtlIHlvdXIgb3duIGNvbW1hbmRzIChvciBhYmJyZXZpYXRpb25zKSBcXG5wdXQgeW91ciBjb250ZW50IGluc2lkZSBcXFwic291cmNlXFxcIiB0aGUgZG8gXFxcInNhdmVcXFwiLiBUcnkgYWRkaW5nIGFueSBcXG50ZXh0IHRoYXQgaXMgb24geW91ciBtaW5kLlxcbn5+IWVkaXQgbXlfbmV3X2NvbW1hbmR8fn5cXG5cXG5JZiB5b3UgZGlkIHRoZSBsYXN0IHN0ZXAgcmlnaHQsIHlvdSBzaG91bGQgc2VlIHlvdXIgdGV4dCB3aGVuIHlvdVxcbmRvIHRoZSBmb2xsb3dpbmcgY29tbWFuZC4gSXQgaXMgbm93IHNhdmVkIGFuZCB5b3UgY2FuIHVzZSBpdCBcXG53aGVuZXZlciB5b3Ugd2FudC5cXG5+fiFteV9uZXdfY29tbWFuZH5+XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxuXFxuQWxsIHRoZSB3aW5kb3dzIG9mIENvZGV3YXZlIGFyZSBtYWRlIHdpdGggdGhlIGNvbW1hbmQgXFxcImJveFxcXCIuIFxcblRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXFxuVGhleSBhcmUgdmFsaWQgY29tbWVudHMgc28gdGhleSB3b24ndCBicmVhayB5b3VyIGNvZGUgYW5kIHRoZSBjb21tYW5kIFxcblxcXCJjbG9zZVxcXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxcbmNvbW1hbmRzIHdpdGggdGhlbSBpZiB5b3UgbmVlZCB0byBkaXNwbGF5IHNvbWUgdGV4dCB0ZW1wb3JhcmlseS5cXG5+fiFib3h+flxcblRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcXG5+fiFjbG9zZXx+flxcbn5+IS9ib3h+flxcblxcbn5+cXVvdGVfY2FycmV0fn5cXG5XaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxcbndpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcXFwifFxcXCIgXFxuKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcXG5jaGFyYWN0ZXIuXFxufn4hYm94fn5cXG5vbmUgOiB8IFxcbnR3byA6IHx8XFxufn4hL2JveH5+XFxuXFxuWW91IGNhbiBhbHNvIHVzZSB0aGUgXFxcImVzY2FwZV9waXBlc1xcXCIgY29tbWFuZCB0aGF0IHdpbGwgZXNjYXBlIGFueSBcXG52ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xcbn5+IWVzY2FwZV9waXBlc35+XFxufFxcbn5+IS9lc2NhcGVfcGlwZXN+flxcblxcbkNvbW1hbmRzIGluc2lkZSBvdGhlciBjb21tYW5kcyB3aWxsIGJlIGV4cGFuZGVkIGF1dG9tYXRpY2FsbHkuXFxuSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxcbnRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXFxcIiFcXFwiIChleGNsYW1hdGlvbiBtYXJrKS5cXG5+fiEhaGVsbG9+flxcblxcbkZvciBjb21tYW5kcyB0aGF0IGhhdmUgYm90aCBhbiBvcGVuaW5nIGFuZCBhIGNsb3NpbmcgdGFnLCB5b3UgY2FuIHVzZVxcbnRoZSBcXFwiY29udGVudFxcXCIgY29tbWFuZC4gXFxcImNvbnRlbnRcXFwiIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGV4dFxcbnRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cXG5+fiFlZGl0IHBocDppbm5lcjppZn5+XFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdlZGl0Jzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDplZGl0aW5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnbm9fZXhlY3V0ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IG5vX2V4ZWN1dGUsXG4gICAgICAgICdoZWxwJzogXCJQcmV2ZW50IGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgZnJvbSBleGVjdXRpbmdcIlxuICAgICAgfSxcbiAgICAgICdlc2NhcGVfcGlwZXMnOiB7XG4gICAgICAgICdyZXN1bHQnOiBxdW90ZV9jYXJyZXQsXG4gICAgICAgICdjaGVja0NhcnJldCc6IGZhbHNlLFxuICAgICAgICAnaGVscCc6IFwiRXNjYXBlIGFsbCBjYXJyZXRzIChmcm9tIFxcXCJ8XFxcIiB0byBcXFwifHxcXFwiKVwiXG4gICAgICB9LFxuICAgICAgJ3F1b3RlX2NhcnJldCc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgICB9LFxuICAgICAgJ2V4ZWNfcGFyZW50Jzoge1xuICAgICAgICAnZXhlY3V0ZSc6IGV4ZWNfcGFyZW50LFxuICAgICAgICAnaGVscCc6IFwiRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1wiXG4gICAgICB9LFxuICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRDb250ZW50LFxuICAgICAgICAnaGVscCc6IFwiTWFpbmx5IHVzZWQgZm9yIGNvbW1hbmQgZWRpdGlvbiwgXFxudGhpcyB3aWxsIHJldHVybiB3aGF0IHdhcyBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgb2YgYSBjb21tYW5kXCJcbiAgICAgIH0sXG4gICAgICAnYm94Jzoge1xuICAgICAgICAnY2xzJzogQm94Q21kLFxuICAgICAgICAnaGVscCc6IFwiQ3JlYXRlIHRoZSBhcHBhcmVuY2Ugb2YgYSBib3ggY29tcG9zZWQgZnJvbSBjaGFyYWN0ZXJzLiBcXG5Vc3VhbGx5IHdyYXBwZWQgaW4gYSBjb21tZW50LlxcblxcblRoZSBib3ggd2lsbCB0cnkgdG8gYWp1c3QgaXQncyBzaXplIGZyb20gdGhlIGNvbnRlbnRcIlxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgJ2Nscyc6IENsb3NlQ21kLFxuICAgICAgICAnaGVscCc6IFwiV2lsbCBjbG9zZSB0aGUgZmlyc3QgYm94IGFyb3VuZCB0aGlzXCJcbiAgICAgIH0sXG4gICAgICAncGFyYW0nOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRQYXJhbSxcbiAgICAgICAgJ2hlbHAnOiBcIk1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gYSBwYXJhbWV0ZXIgZnJvbSB0aGlzIGNvbW1hbmQgY2FsbFxcblxcbllvdSBjYW4gcGFzcyBhIG51bWJlciwgYSBzdHJpbmcsIG9yIGJvdGguIFxcbkEgbnVtYmVyIGZvciBhIHBvc2l0aW9uZWQgYXJndW1lbnQgYW5kIGEgc3RyaW5nXFxuZm9yIGEgbmFtZWQgcGFyYW1ldGVyXCJcbiAgICAgIH0sXG4gICAgICAnZWRpdCc6IHtcbiAgICAgICAgJ2NtZHMnOiBFZGl0Q21kLnNldENtZHMoe1xuICAgICAgICAgICdzYXZlJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICAnY2xzJzogRWRpdENtZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxcblNlZSB+fiFoZWxwOmVkaXRpbmd+fiBmb3IgYSBxdWljayB0dXRvcmlhbFwiXG4gICAgICB9LFxuICAgICAgJ3JlbmFtZSc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9hcHBsaWNhYmxlJzogXCJ+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIixcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IHJlbmFtZUNvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2Zyb20nLCAndG8nXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byByZW5hbWUgYSBjb21tYW5kIGFuZCBjaGFuZ2UgaXQncyBuYW1lc3BhY2UuIFxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG4tIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcXG4tIFRoZW4gc2Vjb25kIHBhcmFtIGlzIHRoZSBuZXcgbmFtZSwgaWYgaXQgaGFzIG5vIG5hbWVzcGFjZSxcXG4gIGl0IHdpbGwgdXNlIHRoZSBvbmUgZnJvbSB0aGUgb3JpZ2luYWwgY29tbWFuZC5cXG5cXG5leC46IH5+IXJlbmFtZSBteV9jb21tYW5kIG15X2NvbW1hbmQyfn5cIlxuICAgICAgfSxcbiAgICAgICdyZW1vdmUnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfYXBwbGljYWJsZSc6IFwifn5ib3h+flxcbllvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCIsXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiByZW1vdmVDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydjbWQnXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byByZW1vdmUgYSBjb21tYW5kLiBcXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXCJcbiAgICAgIH0sXG4gICAgICAnYWxpYXMnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogYWxpYXNDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ25hbWVzcGFjZSc6IHtcbiAgICAgICAgJ2Nscyc6IE5hbWVTcGFjZUNtZCxcbiAgICAgICAgJ2hlbHAnOiBcIlNob3cgdGhlIGN1cnJlbnQgbmFtZXNwYWNlcy5cXG5cXG5BIG5hbWUgc3BhY2UgY291bGQgYmUgdGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlXFxub3Igb3RoZXIga2luZCBvZiBjb250ZXh0c1xcblxcbklmIHlvdSBwYXNzIGEgcGFyYW0gdG8gdGhpcyBjb21tYW5kLCBpdCB3aWxsIFxcbmFkZCB0aGUgcGFyYW0gYXMgYSBuYW1lc3BhY2UgZm9yIHRoZSBjdXJyZW50IGVkaXRvclwiXG4gICAgICB9LFxuICAgICAgJ25zcGMnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6bmFtZXNwYWNlJ1xuICAgICAgfSxcbiAgICAgICdsaXN0Jzoge1xuICAgICAgICAncmVzdWx0JzogbGlzdENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnYm94JywgJ2NvbnRleHQnXSxcbiAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnaGVscCc6IFwiTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcXG5cXG5Zb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcXG5ieSBkZWZhdWx0IGFsbCBjdXJlbnQgbmFtZXNwYWNlIHdpbGwgYmUgc2hvd25cIlxuICAgICAgfSxcbiAgICAgICdscyc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpsaXN0J1xuICAgICAgfSxcbiAgICAgICdnZXQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJ10sXG4gICAgICAgICdoZWxwJzogXCJvdXRwdXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcIlxuICAgICAgfSxcbiAgICAgICdzZXQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBzZXRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ3ZhbHVlJywgJ3ZhbCddLFxuICAgICAgICAnaGVscCc6IFwic2V0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXCJcbiAgICAgIH0sXG4gICAgICAnc3RvcmVfanNvbic6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHN0b3JlSnNvbkNvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnanNvbiddLFxuICAgICAgICAnaGVscCc6IFwic2V0IGEgdmFyaWFibGUgd2l0aCBzb21lIGpzb24gZGF0YVwiXG4gICAgICB9LFxuICAgICAgJ2pzb24nOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6c3RvcmVfanNvbidcbiAgICAgIH0sXG4gICAgICAndGVtcGxhdGUnOiB7XG4gICAgICAgICdjbHMnOiBUZW1wbGF0ZUNtZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZScsICdzZXAnXSxcbiAgICAgICAgJ2hlbHAnOiBcInJlbmRlciBhIHRlbXBsYXRlIGZvciBhIHZhcmlhYmxlXFxuXFxuSWYgdGhlIGZpcnN0IHBhcmFtIGlzIG5vdCBzZXQgaXQgd2lsbCB1c2UgYWxsIHZhcmlhYmxlcyBcXG5mb3IgdGhlIHJlbmRlclxcbklmIHRoZSB2YXJpYWJsZSBpcyBhbiBhcnJheSB0aGUgdGVtcGxhdGUgd2lsbCBiZSByZXBlYXRlZCBcXG5mb3IgZWFjaCBpdGVtc1xcblRoZSBgc2VwYCBwYXJhbSBkZWZpbmUgd2hhdCB3aWxsIHNlcGFyYXRlIGVhY2ggaXRlbSBcXG5hbmQgZGVmYXVsdCB0byBhIGxpbmUgYnJlYWtcIlxuICAgICAgfSxcbiAgICAgICdlbW1ldCc6IHtcbiAgICAgICAgJ2Nscyc6IEVtbWV0Q21kLFxuICAgICAgICAnaGVscCc6IFwiQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxcbnByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLlxcblxcblBhc3MgdGhlIEVtbWV0IGFiYnJldmlhdGlvbiBhcyBhIHBhcmFtIHRvIGV4cGVuZCBpdC5cIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbmhlbHAgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgY21kLCBjbWROYW1lLCBoZWxwQ21kLCBzdWJjb21tYW5kcywgdGV4dDtcbiAgY21kTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuICBpZiAoY21kTmFtZSAhPSBudWxsKSB7XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQoY21kTmFtZSk7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBoZWxwQ21kID0gY21kLmdldENtZCgnaGVscCcpO1xuICAgICAgdGV4dCA9IGhlbHBDbWQgPyBgfn4ke2hlbHBDbWQuZnVsbE5hbWV9fn5gIDogXCJUaGlzIGNvbW1hbmQgaGFzIG5vIGhlbHAgdGV4dFwiO1xuICAgICAgc3ViY29tbWFuZHMgPSBjbWQuY21kcy5sZW5ndGggPyBgXFxuU3ViLUNvbW1hbmRzIDpcXG5+fmxzICR7Y21kLmZ1bGxOYW1lfSBib3g6bm8gY29udGV4dDpub35+YCA6IFwiXCI7XG4gICAgICByZXR1cm4gYH5+Ym94fn5cXG5IZWxwIGZvciB+fiEke2NtZC5mdWxsTmFtZX1+fiA6XFxuXFxuJHt0ZXh0fVxcbiR7c3ViY29tbWFuZHN9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICd+fmhlbHA6b3ZlcnZpZXd+fic7XG4gIH1cbn07XG5cbm5vX2V4ZWN1dGUgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgcmVnO1xuICByZWcgPSBuZXcgUmVnRXhwKFwiXihcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cykgKyAnKScgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpKTtcbiAgcmV0dXJuIGluc3RhbmNlLnN0ci5yZXBsYWNlKHJlZywgJyQxJyk7XG59O1xuXG5xdW90ZV9jYXJyZXQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gaW5zdGFuY2UuY29udGVudC5yZXBsYWNlKC9cXHwvZywgJ3x8Jyk7XG59O1xuXG5leGVjX3BhcmVudCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciByZXM7XG4gIGlmIChpbnN0YW5jZS5wYXJlbnQgIT0gbnVsbCkge1xuICAgIHJlcyA9IGluc3RhbmNlLnBhcmVudC5leGVjdXRlKCk7XG4gICAgaW5zdGFuY2UucmVwbGFjZVN0YXJ0ID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VTdGFydDtcbiAgICBpbnN0YW5jZS5yZXBsYWNlRW5kID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VFbmQ7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufTtcblxuZ2V0Q29udGVudCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBhZmZpeGVzX2VtcHR5LCBwcmVmaXgsIHN1ZmZpeDtcbiAgYWZmaXhlc19lbXB0eSA9IGluc3RhbmNlLmdldFBhcmFtKFsnYWZmaXhlc19lbXB0eSddLCBmYWxzZSk7XG4gIHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgc3VmZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpO1xuICBpZiAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHByZWZpeCArIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmNvbnRlbnQgfHwgJycpICsgc3VmZml4O1xuICB9XG4gIGlmIChhZmZpeGVzX2VtcHR5KSB7XG4gICAgcmV0dXJuIHByZWZpeCArIHN1ZmZpeDtcbiAgfVxufTtcblxucmVuYW1lQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICB2YXIgc3RvcmFnZTtcbiAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlO1xuICAgIHJldHVybiBzdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgfSkudGhlbigoc2F2ZWRDbWRzKSA9PiB7XG4gICAgdmFyIGNtZCwgY21kRGF0YSwgbmV3TmFtZSwgb3JpZ25pbmFsTmFtZTtcbiAgICBvcmlnbmluYWxOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmcm9tJ10pO1xuICAgIG5ld05hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ3RvJ10pO1xuICAgIGlmICgob3JpZ25pbmFsTmFtZSAhPSBudWxsKSAmJiAobmV3TmFtZSAhPSBudWxsKSkge1xuICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQob3JpZ25pbmFsTmFtZSk7XG4gICAgICBpZiAoKHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXSAhPSBudWxsKSAmJiAoY21kICE9IG51bGwpKSB7XG4gICAgICAgIGlmICghKG5ld05hbWUuaW5kZXhPZignOicpID4gLTEpKSB7XG4gICAgICAgICAgbmV3TmFtZSA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG9yaWduaW5hbE5hbWUsICcnKSArIG5ld05hbWU7XG4gICAgICAgIH1cbiAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXTtcbiAgICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEobmV3TmFtZSwgY21kRGF0YSk7XG4gICAgICAgIGNtZC51bnJlZ2lzdGVyKCk7XG4gICAgICAgIHNhdmVkQ21kc1tuZXdOYW1lXSA9IGNtZERhdGE7XG4gICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV07XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gc3RvcmFnZS5zYXZlKCdjbWRzJywgc2F2ZWRDbWRzKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxucmVtb3ZlQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICB2YXIgbmFtZTtcbiAgICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG4gICAgaWYgKG5hbWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgc2F2ZWRDbWRzLCBzdG9yYWdlO1xuICAgICAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlO1xuICAgICAgICByZXR1cm4gc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gICAgICB9KS50aGVuKChzYXZlZENtZHMpID0+IHtcbiAgICAgICAgdmFyIGNtZCwgY21kRGF0YTtcbiAgICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQobmFtZSk7XG4gICAgICAgIGlmICgoc2F2ZWRDbWRzW25hbWVdICE9IG51bGwpICYmIChjbWQgIT0gbnVsbCkpIHtcbiAgICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW25hbWVdO1xuICAgICAgICAgIGNtZC51bnJlZ2lzdGVyKCk7XG4gICAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tuYW1lXTtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5zYXZlKCdjbWRzJywgc2F2ZWRDbWRzKTtcbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuYWxpYXNDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGFsaWFzLCBjbWQsIG5hbWU7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIGFsaWFzID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdhbGlhcyddKTtcbiAgaWYgKChuYW1lICE9IG51bGwpICYmIChhbGlhcyAhPSBudWxsKSkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0Q21kKG5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kID0gY21kLmdldEFsaWFzZWQoKSB8fCBjbWQ7XG4gICAgICAvLyB1bmxlc3MgYWxpYXMuaW5kZXhPZignOicpID4gLTFcbiAgICAgIC8vIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7XG4gICAgICAgIGFsaWFzT2Y6IGNtZC5mdWxsTmFtZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiO1xuICAgIH1cbiAgfVxufTtcblxubGlzdENvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgYm94LCBjb21tYW5kcywgY29udGV4dCwgbmFtZSwgbmFtZXNwYWNlcywgdGV4dCwgdXNlQ29udGV4dDtcbiAgYm94ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnYm94J10sIHRydWUpO1xuICB1c2VDb250ZXh0ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnY29udGV4dCddLCB0cnVlKTtcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgbmFtZXNwYWNlcyA9IG5hbWUgPyBbbmFtZV0gOiBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKS5maWx0ZXIoKG5zcGMpID0+IHtcbiAgICByZXR1cm4gbnNwYyAhPT0gaW5zdGFuY2UuY21kLmZ1bGxOYW1lO1xuICB9KS5jb25jYXQoXCJfcm9vdFwiKTtcbiAgY29udGV4dCA9IHVzZUNvbnRleHQgPyBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpIDogaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQ7XG4gIGNvbW1hbmRzID0gbmFtZXNwYWNlcy5yZWR1Y2UoKGNvbW1hbmRzLCBuc3BjKSA9PiB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSBuc3BjID09PSBcIl9yb290XCIgPyBDb21tYW5kLmNtZHMgOiBjb250ZXh0LmdldENtZChuc3BjLCB7XG4gICAgICBtdXN0RXhlY3V0ZTogZmFsc2VcbiAgICB9KTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmNtZHMpIHtcbiAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5jb25jYXQoY21kLmNtZHMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29tbWFuZHM7XG4gIH0sIFtdKTtcbiAgdGV4dCA9IGNvbW1hbmRzLmxlbmd0aCA/IGNvbW1hbmRzLm1hcCgoY21kKSA9PiB7XG4gICAgY21kLmluaXQoKTtcbiAgICByZXR1cm4gKGNtZC5pc0V4ZWN1dGFibGUoKSA/ICd+fiEnIDogJ35+IWxzICcpICsgY21kLmZ1bGxOYW1lICsgJ35+JztcbiAgfSkuam9pbihcIlxcblwiKSA6IFwiVGhpcyBjb250YWlucyBubyBzdWItY29tbWFuZHNcIjtcbiAgaWYgKGJveCkge1xuICAgIHJldHVybiBgfn5ib3h+flxcbiR7dGV4dH1cXG5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGV4dDtcbiAgfVxufTtcblxuZ2V0Q29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCByZXM7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIHJlcyA9IFBhdGhIZWxwZXIuZ2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lKTtcbiAgaWYgKHR5cGVvZiByZXMgPT09IFwib2JqZWN0XCIpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAnICAnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59O1xuXG5zZXRDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHAsIHZhbDtcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ3ZhbHVlJywgJ3ZhbCddKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcbiAgUGF0aEhlbHBlci5zZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIG5hbWUsIHZhbCk7XG4gIHJldHVybiAnJztcbn07XG5cbnN0b3JlSnNvbkNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgbmFtZSwgcCwgdmFsO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnanNvbiddKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcbiAgUGF0aEhlbHBlci5zZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIG5hbWUsIEpTT04ucGFyc2UodmFsKSk7XG4gIHJldHVybiAnJztcbn07XG5cbmdldFBhcmFtID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcywgaW5zdGFuY2UuZ2V0UGFyYW0oWydkZWYnLCAnZGVmYXVsdCddKSk7XG4gIH1cbn07XG5cbkJveENtZCA9IGNsYXNzIEJveENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KTtcbiAgICB0aGlzLmNtZCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydjbWQnXSk7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaGVscGVyLm9wZW5UZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWQgKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICB0aGlzLmhlbHBlci5jbG9zZVRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY21kLnNwbGl0KFwiIFwiKVswXSArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cztcbiAgICB9XG4gICAgdGhpcy5oZWxwZXIuZGVjbyA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZGVjbztcbiAgICB0aGlzLmhlbHBlci5wYWQgPSAyO1xuICAgIHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICAgIHJldHVybiB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgfVxuXG4gIGhlaWdodCgpIHtcbiAgICB2YXIgaGVpZ2h0LCBwYXJhbXM7XG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5ib3VuZHMoKS5oZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IDM7XG4gICAgfVxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J107XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLnB1c2goMCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgaGVpZ2h0KTtcbiAgfVxuXG4gIHdpZHRoKCkge1xuICAgIHZhciBwYXJhbXMsIHdpZHRoO1xuICAgIGlmICh0aGlzLmJvdW5kcygpICE9IG51bGwpIHtcbiAgICAgIHdpZHRoID0gdGhpcy5ib3VuZHMoKS53aWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgd2lkdGggPSAzO1xuICAgIH1cbiAgICBwYXJhbXMgPSBbJ3dpZHRoJ107XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5taW5XaWR0aCgpLCB0aGlzLmluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgd2lkdGgpKTtcbiAgfVxuXG4gIGJvdW5kcygpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50KSB7XG4gICAgICBpZiAodGhpcy5fYm91bmRzID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fYm91bmRzID0gdGhpcy5oZWxwZXIudGV4dEJvdW5kcyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kcztcbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdGhpcy5oZWxwZXIuaGVpZ2h0ID0gdGhpcy5oZWlnaHQoKTtcbiAgICB0aGlzLmhlbHBlci53aWR0aCA9IHRoaXMud2lkdGgoKTtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuZHJhdyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICB9XG5cbiAgbWluV2lkdGgoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNtZC5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG59O1xuXG5DbG9zZUNtZCA9IGNsYXNzIENsb3NlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHJldHVybiB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGJveCwgYm94MiwgZGVwdGgsIHByZWZpeCwgcmVxdWlyZWRfYWZmaXhlcywgc3VmZml4O1xuICAgIHByZWZpeCA9IHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICAgIHN1ZmZpeCA9IHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpO1xuICAgIGJveCA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKTtcbiAgICByZXF1aXJlZF9hZmZpeGVzID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3JlcXVpcmVkX2FmZml4ZXMnXSwgdHJ1ZSk7XG4gICAgaWYgKCFyZXF1aXJlZF9hZmZpeGVzKSB7XG4gICAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSAnJztcbiAgICAgIGJveDIgPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSk7XG4gICAgICBpZiAoKGJveDIgIT0gbnVsbCkgJiYgKChib3ggPT0gbnVsbCkgfHwgYm94LnN0YXJ0IDwgYm94Mi5zdGFydCAtIHByZWZpeC5sZW5ndGggfHwgYm94LmVuZCA+IGJveDIuZW5kICsgc3VmZml4Lmxlbmd0aCkpIHtcbiAgICAgICAgYm94ID0gYm94MjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJveCAhPSBudWxsKSB7XG4gICAgICBkZXB0aCA9IHRoaXMuaGVscGVyLmdldE5lc3RlZEx2bCh0aGlzLmluc3RhbmNlLmdldFBvcygpLnN0YXJ0KTtcbiAgICAgIGlmIChkZXB0aCA8IDIpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5pbkJveCA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChib3guc3RhcnQsIGJveC5lbmQsICcnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLnJlcGxhY2VXaXRoKCcnKTtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZCA9IGNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdmFyIHJlZjtcbiAgICB0aGlzLmNtZE5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuICAgIHRoaXMudmVyYmFsaXplID0gKHJlZiA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzFdKSkgPT09ICd2JyB8fCByZWYgPT09ICd2ZXJiYWxpemUnO1xuICAgIGlmICh0aGlzLmNtZE5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSk7XG4gICAgICB0aGlzLmZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZTtcbiAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lZGl0YWJsZSA9IHRoaXMuY21kICE9IG51bGwgPyB0aGlzLmNtZC5pc0VkaXRhYmxlKCkgOiB0cnVlO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhDb250ZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhvdXRDb250ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0V2l0aENvbnRlbnQoKSB7XG4gICAgdmFyIGRhdGEsIGksIGxlbiwgcCwgcGFyc2VyLCByZWY7XG4gICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgZGF0YSA9IHt9O1xuICAgIHJlZiA9IEVkaXRDbWQucHJvcHM7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBwID0gcmVmW2ldO1xuICAgICAgcC53cml0ZUZvcihwYXJzZXIsIGRhdGEpO1xuICAgIH1cbiAgICBDb21tYW5kLnNhdmVDbWQodGhpcy5jbWROYW1lLCBkYXRhKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBwcm9wc0Rpc3BsYXkoKSB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSB0aGlzLmNtZDtcbiAgICByZXR1cm4gRWRpdENtZC5wcm9wcy5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHAuZGlzcGxheShjbWQpO1xuICAgIH0pLmZpbHRlcihmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gcCAhPSBudWxsO1xuICAgIH0pLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICByZXN1bHRXaXRob3V0Q29udGVudCgpIHtcbiAgICB2YXIgbmFtZSwgcGFyc2VyO1xuICAgIGlmICghdGhpcy5jbWQgfHwgdGhpcy5lZGl0YWJsZSkge1xuICAgICAgbmFtZSA9IHRoaXMuY21kID8gdGhpcy5jbWQuZnVsbE5hbWUgOiB0aGlzLmNtZE5hbWU7XG4gICAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQoYH5+Ym94IGNtZDpcIiR7dGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWV9ICR7bmFtZX1cIn5+XFxuJHt0aGlzLnByb3BzRGlzcGxheSgpfVxcbn5+IXNhdmV+fiB+fiFjbG9zZX5+XFxufn4vYm94fn5gKTtcbiAgICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMudmVyYmFsaXplKSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIuZ2V0VGV4dCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kLnNldENtZHMgPSBmdW5jdGlvbihiYXNlKSB7XG4gIHZhciBpLCBpbkluc3RhbmNlLCBsZW4sIHAsIHJlZjtcbiAgaW5JbnN0YW5jZSA9IGJhc2UuaW5faW5zdGFuY2UgPSB7XG4gICAgY21kczoge31cbiAgfTtcbiAgcmVmID0gRWRpdENtZC5wcm9wcztcbiAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcCA9IHJlZltpXTtcbiAgICBwLnNldENtZChpbkluc3RhbmNlLmNtZHMpO1xuICB9XG4gIC8vIHAuc2V0Q21kKGJhc2UpXG4gIHJldHVybiBiYXNlO1xufTtcblxuRWRpdENtZC5wcm9wcyA9IFtcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX2NhcnJldCcsXG4gIHtcbiAgICBvcHQ6ICdjaGVja0NhcnJldCdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19wYXJzZScsXG4gIHtcbiAgICBvcHQ6ICdwYXJzZSdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCdwcmV2ZW50X3BhcnNlX2FsbCcsXG4gIHtcbiAgICBvcHQ6ICdwcmV2ZW50UGFyc2VBbGwnXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCgncmVwbGFjZV9ib3gnLFxuICB7XG4gICAgb3B0OiAncmVwbGFjZUJveCdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoJ25hbWVfdG9fcGFyYW0nLFxuICB7XG4gICAgb3B0OiAnbmFtZVRvUGFyYW0nXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCdhbGlhc19vZicsXG4gIHtcbiAgICB2YXI6ICdhbGlhc09mJyxcbiAgICBjYXJyZXQ6IHRydWVcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoJ2hlbHAnLFxuICB7XG4gICAgZnVuY3Q6ICdoZWxwJyxcbiAgICBzaG93RW1wdHk6IHRydWVcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoJ3NvdXJjZScsXG4gIHtcbiAgICB2YXI6ICdyZXN1bHRTdHInLFxuICAgIGRhdGFOYW1lOiAncmVzdWx0JyxcbiAgICBzaG93RW1wdHk6IHRydWUsXG4gICAgY2FycmV0OiB0cnVlXG4gIH0pXG5dO1xuXG5OYW1lU3BhY2VDbWQgPSBjbGFzcyBOYW1lU3BhY2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzBdKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgaSwgbGVuLCBuYW1lc3BhY2VzLCBuc3BjLCBwYXJzZXIsIHR4dDtcbiAgICBpZiAodGhpcy5uYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQuYWRkTmFtZVNwYWNlKHRoaXMubmFtZSk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWVzcGFjZXMgPSB0aGlzLmluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpO1xuICAgICAgdHh0ID0gJ35+Ym94fn5cXG4nO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gbmFtZXNwYWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBuc3BjID0gbmFtZXNwYWNlc1tpXTtcbiAgICAgICAgaWYgKG5zcGMgIT09IHRoaXMuaW5zdGFuY2UuY21kLmZ1bGxOYW1lKSB7XG4gICAgICAgICAgdHh0ICs9IG5zcGMgKyAnXFxuJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdHh0ICs9ICd+fiFjbG9zZXx+flxcbn5+L2JveH5+JztcbiAgICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0eHQpO1xuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpO1xuICAgIH1cbiAgfVxuXG59O1xuXG5UZW1wbGF0ZUNtZCA9IGNsYXNzIFRlbXBsYXRlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHRoaXMubmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICAgIHJldHVybiB0aGlzLnNlcCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzZXAnXSwgXCJcXG5cIik7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZGF0YSA9IHRoaXMubmFtZSA/IFBhdGhIZWxwZXIuZ2V0UGF0aCh0aGlzLmluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIHRoaXMubmFtZSkgOiB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLnZhcnM7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCAmJiAoZGF0YSAhPSBudWxsKSAmJiBkYXRhICE9PSBmYWxzZSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVGVtcGxhdGUoaXRlbSk7XG4gICAgICAgIH0pLmpvaW4odGhpcy5zZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVGVtcGxhdGUoZGF0YSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cblxuICByZW5kZXJUZW1wbGF0ZShkYXRhKSB7XG4gICAgdmFyIHBhcnNlcjtcbiAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgICBwYXJzZXIudmFycyA9IHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiID8gZGF0YSA6IHtcbiAgICAgIHZhbHVlOiBkYXRhXG4gICAgfTtcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gIH1cblxufTtcblxuRW1tZXRDbWQgPSBjbGFzcyBFbW1ldENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmFiYnIgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnYWJicicsICdhYmJyZXZpYXRpb24nXSk7XG4gICAgcmV0dXJuIHRoaXMubGFuZyA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdsYW5nJywgJ2xhbmd1YWdlJ10pO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBlbW1ldCwgZXgsIHJlcztcbiAgICBlbW1ldCA9IChmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBpZiAoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsID8gd2luZG93LmVtbWV0IDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuZW1tZXQ7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IChyZWYgPSB3aW5kb3cuc2VsZikgIT0gbnVsbCA/IHJlZi5lbW1ldCA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnNlbGYuZW1tZXQ7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IChyZWYxID0gd2luZG93Lmdsb2JhbCkgIT0gbnVsbCA/IHJlZjEuZW1tZXQgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nbG9iYWwuZW1tZXQ7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXF1aXJlICE9PSBcInVuZGVmaW5lZFwiICYmIHJlcXVpcmUgIT09IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnZW1tZXQnKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICAgIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUubG9nZ2VyLmxvZygnRW1tZXQgaXMgbm90IGF2YWlsYWJsZSwgaXQgbWF5IG5lZWQgdG8gYmUgaW5zdGFsbGVkIG1hbnVhbGx5Jyk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KS5jYWxsKHRoaXMpO1xuICAgIGlmIChlbW1ldCAhPSBudWxsKSB7XG4gICAgICAvLyBlbW1ldC5yZXF1aXJlKCcuL3BhcnNlci9hYmJyZXZpYXRpb24nKS5leHBhbmQoJ3VsPmxpJywge3Bhc3RlZENvbnRlbnQ6J2xvcmVtJ30pXG4gICAgICByZXMgPSBlbW1ldC5leHBhbmRBYmJyZXZpYXRpb24odGhpcy5hYmJyLCB0aGlzLmxhbmcpO1xuICAgICAgcmV0dXJuIHJlcy5yZXBsYWNlKC9cXCRcXHswXFx9L2csICd8Jyk7XG4gICAgfVxuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IENvbW1hbmQsIEJhc2VDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMYW5nRGV0ZWN0b3IgfSBmcm9tICcuLi9EZXRlY3Rvcic7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuLi9Cb3hIZWxwZXInO1xuaW1wb3J0IHsgRWRpdENtZFByb3AgfSBmcm9tICcuLi9FZGl0Q21kUHJvcCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBQYXRoSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9QYXRoSGVscGVyJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgY2xhc3MgRmlsZUNvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdmaWxlJykpXG4gIFxuICBjb3JlLmFkZENtZHMoe1xuICAgIFwicmVhZFwiOiB7XG4gICAgICAncmVzdWx0JyA6IHJlYWRDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2ZpbGUnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgcmVhZCB0aGUgY29udGVudCBvZiBhIGZpbGVcbiAgICAgICAgXCJcIlwiXG4gICAgfVxuICAgIFwid3JpdGVcIjoge1xuICAgICAgJ3Jlc3VsdCcgOiB3cml0ZUNvbW1hbmRcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnZmlsZScsJ2NvbnRlbnQnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgc2F2ZSBpbnRvIGEgZmlsZVxuICAgICAgICBcIlwiXCJcbiAgICB9XG4gICAgXCJkZWxldGVcIjoge1xuICAgICAgJ3Jlc3VsdCcgOiBkZWxldGVDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2ZpbGUnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgZGVsZXRlIGEgZmlsZVxuICAgICAgICBcIlwiXCJcbiAgICB9XG4gIH0pXG5cbnJlYWRDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZmlsZSddKVxuICBpZiBmaWxlU3lzdGVtXG4gICAgZmlsZVN5c3RlbS5yZWFkRmlsZShmaWxlKVxuXG53cml0ZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIGZpbGVTeXN0ZW0gPSBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRGaWxlU3lzdGVtKClcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCdmaWxlJ10pXG4gIGNvbnRlbnQgPSBpbnN0YW5jZS5jb250ZW50IG9yIGluc3RhbmNlLmdldFBhcmFtKFsxLCdjb250ZW50J10pXG4gIGlmIGZpbGVTeXN0ZW1cbiAgICBmaWxlU3lzdGVtLndyaXRlRmlsZShmaWxlLGNvbnRlbnQpXG4gICAgICBcbmRlbGV0ZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIGZpbGVTeXN0ZW0gPSBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRGaWxlU3lzdGVtKClcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCdmaWxlJ10pXG4gIGlmIGZpbGVTeXN0ZW1cbiAgICBmaWxlU3lzdGVtLmRlbGV0ZUZpbGUoZmlsZSkiLCJ2YXIgZGVsZXRlQ29tbWFuZCwgcmVhZENvbW1hbmQsIHdyaXRlQ29tbWFuZDtcblxuaW1wb3J0IHtcbiAgQ29tbWFuZCxcbiAgQmFzZUNvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIExhbmdEZXRlY3RvclxufSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmltcG9ydCB7XG4gIEJveEhlbHBlclxufSBmcm9tICcuLi9Cb3hIZWxwZXInO1xuXG5pbXBvcnQge1xuICBFZGl0Q21kUHJvcFxufSBmcm9tICcuLi9FZGl0Q21kUHJvcCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhdGhIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9QYXRoSGVscGVyJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgdmFyIEZpbGVDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBGaWxlQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBjb3JlO1xuICAgIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnZmlsZScpKTtcbiAgICByZXR1cm4gY29yZS5hZGRDbWRzKHtcbiAgICAgIFwicmVhZFwiOiB7XG4gICAgICAgICdyZXN1bHQnOiByZWFkQ29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnZmlsZSddLFxuICAgICAgICAnaGVscCc6IFwicmVhZCB0aGUgY29udGVudCBvZiBhIGZpbGVcIlxuICAgICAgfSxcbiAgICAgIFwid3JpdGVcIjoge1xuICAgICAgICAncmVzdWx0Jzogd3JpdGVDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydmaWxlJywgJ2NvbnRlbnQnXSxcbiAgICAgICAgJ2hlbHAnOiBcInNhdmUgaW50byBhIGZpbGVcIlxuICAgICAgfSxcbiAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGRlbGV0ZUNvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2ZpbGUnXSxcbiAgICAgICAgJ2hlbHAnOiBcImRlbGV0ZSBhIGZpbGVcIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbnJlYWRDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGZpbGUsIGZpbGVTeXN0ZW07XG4gIGZpbGVTeXN0ZW0gPSBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRGaWxlU3lzdGVtKCk7XG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2ZpbGUnXSk7XG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0ucmVhZEZpbGUoZmlsZSk7XG4gIH1cbn07XG5cbndyaXRlQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBjb250ZW50LCBmaWxlLCBmaWxlU3lzdGVtO1xuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpO1xuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pO1xuICBjb250ZW50ID0gaW5zdGFuY2UuY29udGVudCB8fCBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2NvbnRlbnQnXSk7XG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0ud3JpdGVGaWxlKGZpbGUsIGNvbnRlbnQpO1xuICB9XG59O1xuXG5kZWxldGVDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGZpbGUsIGZpbGVTeXN0ZW07XG4gIGZpbGVTeXN0ZW0gPSBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRGaWxlU3lzdGVtKCk7XG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2ZpbGUnXSk7XG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0uZGVsZXRlRmlsZShmaWxlKTtcbiAgfVxufTtcbiIsIlxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgSHRtbENvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAgaHRtbCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdodG1sJykpXG4gIGh0bWwuYWRkQ21kcyh7XG4gICAgJ2ZhbGxiYWNrJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTplbW1ldCcsXG4gICAgICAnZGVmYXVsdHMnIDogeydsYW5nJzonaHRtbCd9LFxuICAgICAgJ25hbWVUb1BhcmFtJyA6ICdhYmJyJ1xuICAgIH0sXG4gIH0pXG4gIFxuICBjc3MgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY3NzJykpXG4gIGNzcy5hZGRDbWRzKHtcbiAgICAnZmFsbGJhY2snOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOmVtbWV0JyxcbiAgICAgICdkZWZhdWx0cycgOiB7J2xhbmcnOidjc3MnfSxcbiAgICAgICduYW1lVG9QYXJhbScgOiAnYWJicidcbiAgICB9LFxuICB9KVxuXG4iLCJpbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIEh0bWxDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBIdG1sQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBjc3MsIGh0bWw7XG4gICAgaHRtbCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdodG1sJykpO1xuICAgIGh0bWwuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICAnZGVmYXVsdHMnOiB7XG4gICAgICAgICAgJ2xhbmcnOiAnaHRtbCdcbiAgICAgICAgfSxcbiAgICAgICAgJ25hbWVUb1BhcmFtJzogJ2FiYnInXG4gICAgICB9XG4gICAgfSk7XG4gICAgY3NzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NzcycpKTtcbiAgICByZXR1cm4gY3NzLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmVtbWV0JyxcbiAgICAgICAgJ2RlZmF1bHRzJzoge1xuICAgICAgICAgICdsYW5nJzogJ2NzcydcbiAgICAgICAgfSxcbiAgICAgICAgJ25hbWVUb1BhcmFtJzogJ2FiYnInXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgSnNDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGpzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2pzJykpXG4gIGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqYXZhc2NyaXB0Jyx7IGFsaWFzT2Y6ICdqcycgfSkpXG4gIGpzLmFkZENtZHMoe1xuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAnaWYnOiAgJ2lmKHwpe1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2xvZyc6ICAnaWYod2luZG93LmNvbnNvbGUpe1xcblxcdGNvbnNvbGUubG9nKH5+Y29udGVudH5+fClcXG59JyxcbiAgICAnZnVuY3Rpb24nOlx0J2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnZnVuY3QnOnsgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJyB9LFxuICAgICdmJzp7ICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nIH0sXG4gICAgJ2Zvcic6IFx0XHQnZm9yICh2YXIgaSA9IDA7IGkgPCB8OyBpKyspIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdmb3Jpbic6J2ZvciAodmFyIHZhbCBpbiB8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnZWFjaCc6eyAgYWxpYXNPZjogJ2pzOmZvcmluJyB9LFxuICAgICdmb3JlYWNoJzp7ICBhbGlhc09mOiAnanM6Zm9yaW4nIH0sXG4gICAgJ3doaWxlJzogICd3aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnd2hpbGVpJzogJ3ZhciBpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG5cXHRpKys7XFxufScsXG4gICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgJ2lmZSc6eyAgIGFsaWFzT2Y6ICdqczppZmVsc2UnIH0sXG4gICAgJ3N3aXRjaCc6XHRcIlwiXCJcbiAgICAgIHN3aXRjaCggfCApIHsgXG4gICAgICBcXHRjYXNlIDpcbiAgICAgIFxcdFxcdH5+Y29udGVudH5+XG4gICAgICBcXHRcXHRicmVhaztcbiAgICAgIFxcdGRlZmF1bHQgOlxuICAgICAgXFx0XFx0XG4gICAgICBcXHRcXHRicmVhaztcbiAgICAgIH1cbiAgICAgIFwiXCJcIixcbiAgfSlcbiIsImltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgSnNDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBKc0NvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIganM7XG4gICAganMgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnanMnKSk7XG4gICAgY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2phdmFzY3JpcHQnLCB7XG4gICAgICBhbGlhc09mOiAnanMnXG4gICAgfSkpO1xuICAgIHJldHVybiBqcy5hZGRDbWRzKHtcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgICdpZic6ICdpZih8KXtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2xvZyc6ICdpZih3aW5kb3cuY29uc29sZSl7XFxuXFx0Y29uc29sZS5sb2cofn5jb250ZW50fn58KVxcbn0nLFxuICAgICAgJ2Z1bmN0aW9uJzogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdmdW5jdCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2Zvcic6ICdmb3IgKHZhciBpID0gMDsgaSA8IHw7IGkrKykge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZm9yaW4nOiAnZm9yICh2YXIgdmFsIGluIHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2VhY2gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmb3JpbidcbiAgICAgIH0sXG4gICAgICAnZm9yZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgICd3aGlsZSc6ICd3aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICd3aGlsZWknOiAndmFyIGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcblxcdGkrKztcXG59JyxcbiAgICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgJ2lmZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmlmZWxzZSdcbiAgICAgIH0sXG4gICAgICAnc3dpdGNoJzogXCJzd2l0Y2goIHwgKSB7IFxcblxcdGNhc2UgOlxcblxcdFxcdH5+Y29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufVwiXG4gICAgfSk7XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgUGFpckRldGVjdG9yIH0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuXG5leHBvcnQgY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpXG4gIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICByZXN1bHQ6ICdwaHA6aW5uZXInLFxuICAgIG9wZW5lcjogJzw/cGhwJyxcbiAgICBjbG9zZXI6ICc/PicsXG4gICAgb3B0aW9ubmFsX2VuZDogdHJ1ZSxcbiAgICAnZWxzZSc6ICdwaHA6b3V0ZXInXG4gIH0pKSBcblxuICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpXG4gIHBocE91dGVyLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnYW55X2NvbnRlbnQnOiB7IFxuICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnIFxuICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBwcmVmaXg6ICcgPz5cXG4nXG4gICAgICAgICAgICBzdWZmaXg6ICdcXG48P3BocCAnXG4gICAgICAgICAgICBhZmZpeGVzX2VtcHR5OiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjolbmFtZSUnLFxuICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgfSxcbiAgICAnYm94JzogeyBcbiAgICAgIGFsaWFzT2Y6ICdjb3JlOmJveCcgXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBwcmVmaXg6ICc8P3BocFxcbidcbiAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICB9XG4gICAgfSxcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgcGhwOiAnPD9waHBcXG5cXHR+fmNvbnRlbnR+fnxcXG4/PicsXG4gIH0pXG4gIFxuICBwaHBJbm5lciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ2lubmVyJykpXG4gIHBocElubmVyLmFkZENtZHMoe1xuICAgICdhbnlfY29udGVudCc6IHsgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcgfSxcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgJ2lmJzogICAnaWYofCl7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ2luZm8nOiAncGhwaW5mbygpOycsXG4gICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAnZSc6eyAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZWNobycgfSxcbiAgICAnY2xhc3MnOntcbiAgICAgIHJlc3VsdCA6IFwiXCJcIlxuICAgICAgICBjbGFzcyB+fnBhcmFtIDAgY2xhc3MgZGVmOnx+fiB7XG4gICAgICAgIFxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xuICAgICAgICBcXHRcXHR+fmNvbnRlbnR+fnxcbiAgICAgICAgXFx0fVxuICAgICAgICB9XG4gICAgICAgIFwiXCJcIixcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdjJzp7ICAgICBhbGlhc09mOiAncGhwOmlubmVyOmNsYXNzJyB9LFxuICAgICdmdW5jdGlvbic6XHR7XG4gICAgICByZXN1bHQgOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAnZnVuY3QnOnsgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbicgfSxcbiAgICAnZic6eyAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbicgfSxcbiAgICAnYXJyYXknOiAgJyR8ID0gYXJyYXkoKTsnLFxuICAgICdhJzpcdCAgICAnYXJyYXkoKScsXG4gICAgJ2Zvcic6IFx0XHQnZm9yICgkaSA9IDA7ICRpIDwgJHw7ICRpKyspIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnZm9yZWFjaCc6J2ZvcmVhY2ggKCR8IGFzICRrZXkgPT4gJHZhbCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICdlYWNoJzp7ICBhbGlhc09mOiAncGhwOmlubmVyOmZvcmVhY2gnIH0sXG4gICAgJ3doaWxlJzogICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ3doaWxlaSc6IHtcbiAgICAgIHJlc3VsdCA6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgJ2lmZSc6eyAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6aWZlbHNlJyB9LFxuICAgICdzd2l0Y2gnOlx0e1xuICAgICAgcmVzdWx0IDogXCJcIlwiXG4gICAgICAgIHN3aXRjaCggfCApIHsgXG4gICAgICAgIFxcdGNhc2UgOlxuICAgICAgICBcXHRcXHR+fmFueV9jb250ZW50fn5cbiAgICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICAgIFxcdGRlZmF1bHQgOlxuICAgICAgICBcXHRcXHRcbiAgICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiLFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICAnY2xvc2UnOiB7IFxuICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnIFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nXG4gICAgICAgIHN1ZmZpeDogJ1xcbj8+J1xuICAgICAgICByZXF1aXJlZF9hZmZpeGVzOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gIH0pXG4gIFxuXG53cmFwV2l0aFBocCA9IChyZXN1bHQsaW5zdGFuY2UpIC0+XG4gIGlubGluZSA9IGluc3RhbmNlLmdldFBhcmFtKFsncGhwX2lubGluZScsJ2lubGluZSddLHRydWUpXG4gIGlmIGlubGluZVxuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nXG4gICAgcmVnQ2xvc2UgPSAvKFtcXG5cXHJcXHNdKylcXHNcXD8+L2dcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nXG4gIGVsc2VcbiAgICAnPD9waHBcXG4nICsgU3RyaW5nSGVscGVyLmluZGVudChyZXN1bHQpICsgJ1xcbj8+J1xuXG4jIGNsb3NlUGhwRm9yQ29udGVudCA9IChpbnN0YW5jZSkgLT5cbiMgICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnIiwidmFyIHdyYXBXaXRoUGhwO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBQYWlyRGV0ZWN0b3Jcbn0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuXG5leHBvcnQgdmFyIFBocENvbW1hbmRQcm92aWRlciA9IGNsYXNzIFBocENvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgcGhwLCBwaHBJbm5lciwgcGhwT3V0ZXI7XG4gICAgcGhwID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ3BocCcpKTtcbiAgICBwaHAuYWRkRGV0ZWN0b3IobmV3IFBhaXJEZXRlY3Rvcih7XG4gICAgICByZXN1bHQ6ICdwaHA6aW5uZXInLFxuICAgICAgb3BlbmVyOiAnPD9waHAnLFxuICAgICAgY2xvc2VyOiAnPz4nLFxuICAgICAgb3B0aW9ubmFsX2VuZDogdHJ1ZSxcbiAgICAgICdlbHNlJzogJ3BocDpvdXRlcidcbiAgICB9KSk7XG4gICAgcGhwT3V0ZXIgPSBwaHAuYWRkQ21kKG5ldyBDb21tYW5kKCdvdXRlcicpKTtcbiAgICBwaHBPdXRlci5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ2FueV9jb250ZW50Jzoge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcsXG4gICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICBwcmVmaXg6ICcgPz5cXG4nLFxuICAgICAgICAgICAgICBzdWZmaXg6ICdcXG48P3BocCAnLFxuICAgICAgICAgICAgICBhZmZpeGVzX2VtcHR5OiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOiVuYW1lJScsXG4gICAgICAgIGFsdGVyUmVzdWx0OiB3cmFwV2l0aFBocFxuICAgICAgfSxcbiAgICAgICdib3gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmJveCcsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nLFxuICAgICAgICAgIHN1ZmZpeDogJ1xcbj8+J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgcGhwOiAnPD9waHBcXG5cXHR+fmNvbnRlbnR+fnxcXG4/PidcbiAgICB9KTtcbiAgICBwaHBJbm5lciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ2lubmVyJykpO1xuICAgIHJldHVybiBwaHBJbm5lci5hZGRDbWRzKHtcbiAgICAgICdhbnlfY29udGVudCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCdcbiAgICAgIH0sXG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICAnaWYnOiAnaWYofCl7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnaW5mbyc6ICdwaHBpbmZvKCk7JyxcbiAgICAgICdlY2hvJzogJ2VjaG8gfCcsXG4gICAgICAnZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjplY2hvJ1xuICAgICAgfSxcbiAgICAgICdjbGFzcyc6IHtcbiAgICAgICAgcmVzdWx0OiBcImNsYXNzIH5+cGFyYW0gMCBjbGFzcyBkZWY6fH5+IHtcXG5cXHRmdW5jdGlvbiBfX2NvbnN0cnVjdCgpIHtcXG5cXHRcXHR+fmNvbnRlbnR+fnxcXG5cXHR9XFxufVwiLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmNsYXNzJ1xuICAgICAgfSxcbiAgICAgICdmdW5jdGlvbic6IHtcbiAgICAgICAgcmVzdWx0OiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdmdW5jdCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZic6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnYXJyYXknOiAnJHwgPSBhcnJheSgpOycsXG4gICAgICAnYSc6ICdhcnJheSgpJyxcbiAgICAgICdmb3InOiAnZm9yICgkaSA9IDA7ICRpIDwgJHw7ICRpKyspIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdmb3JlYWNoJzogJ2ZvcmVhY2ggKCR8IGFzICRrZXkgPT4gJHZhbCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2VhY2gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Zm9yZWFjaCdcbiAgICAgIH0sXG4gICAgICAnd2hpbGUnOiAnd2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ3doaWxlaSc6IHtcbiAgICAgICAgcmVzdWx0OiAnJGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG5cXHQkaSsrO1xcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAgICdpZmUnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6aWZlbHNlJ1xuICAgICAgfSxcbiAgICAgICdzd2l0Y2gnOiB7XG4gICAgICAgIHJlc3VsdDogXCJzd2l0Y2goIHwgKSB7IFxcblxcdGNhc2UgOlxcblxcdFxcdH5+YW55X2NvbnRlbnR+flxcblxcdFxcdGJyZWFrO1xcblxcdGRlZmF1bHQgOlxcblxcdFxcdFxcblxcdFxcdGJyZWFrO1xcbn1cIixcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnY2xvc2UnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNsb3NlJyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nLFxuICAgICAgICAgIHJlcXVpcmVkX2FmZml4ZXM6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuXG53cmFwV2l0aFBocCA9IGZ1bmN0aW9uKHJlc3VsdCwgaW5zdGFuY2UpIHtcbiAgdmFyIGlubGluZSwgcmVnQ2xvc2UsIHJlZ09wZW47XG4gIGlubGluZSA9IGluc3RhbmNlLmdldFBhcmFtKFsncGhwX2lubGluZScsICdpbmxpbmUnXSwgdHJ1ZSk7XG4gIGlmIChpbmxpbmUpIHtcbiAgICByZWdPcGVuID0gLzxcXD9waHBcXHMoW1xcXFxuXFxcXHJcXHNdKykvZztcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZztcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnPD9waHBcXG4nICsgU3RyaW5nSGVscGVyLmluZGVudChyZXN1bHQpICsgJ1xcbj8+JztcbiAgfVxufTtcblxuLy8gY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuLy8gICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnXG4iLCJpbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vYm9vdHN0cmFwJztcbmltcG9ydCB7IFRleHRBcmVhRWRpdG9yIH0gZnJvbSAnLi9UZXh0QXJlYUVkaXRvcic7XG5cbkNvZGV3YXZlLmRldGVjdCA9ICh0YXJnZXQpIC0+XG4gIGN3ID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvcih0YXJnZXQpKVxuICBDb2Rld2F2ZS5pbnN0YW5jZXMucHVzaChjdylcbiAgY3dcblxuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmVcblxud2luZG93LkNvZGV3YXZlID0gQ29kZXdhdmVcblxuICAiLCJpbXBvcnQge1xuICBDb2Rld2F2ZVxufSBmcm9tICcuL2Jvb3RzdHJhcCc7XG5cbmltcG9ydCB7XG4gIFRleHRBcmVhRWRpdG9yXG59IGZyb20gJy4vVGV4dEFyZWFFZGl0b3InO1xuXG5Db2Rld2F2ZS5kZXRlY3QgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgdmFyIGN3O1xuICBjdyA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dEFyZWFFZGl0b3IodGFyZ2V0KSk7XG4gIENvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KTtcbiAgcmV0dXJuIGN3O1xufTtcblxuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmU7XG5cbndpbmRvdy5Db2Rld2F2ZSA9IENvZGV3YXZlO1xuIiwiZXhwb3J0IGNsYXNzIEFycmF5SGVscGVyXG4gIEBpc0FycmF5OiAoYXJyKSAtPlxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIGFyciApID09ICdbb2JqZWN0IEFycmF5XSdcbiAgXG4gIEB1bmlvbjogKGExLGEyKSAtPlxuICAgIEB1bmlxdWUoYTEuY29uY2F0KGEyKSlcbiAgICBcbiAgQHVuaXF1ZTogKGFycmF5KSAtPlxuICAgIGEgPSBhcnJheS5jb25jYXQoKVxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IGEubGVuZ3RoXG4gICAgICBqID0gaSArIDFcbiAgICAgIHdoaWxlIGogPCBhLmxlbmd0aFxuICAgICAgICBpZiBhW2ldID09IGFbal1cbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpXG4gICAgICAgICsralxuICAgICAgKytpXG4gICAgYSIsImV4cG9ydCB2YXIgQXJyYXlIZWxwZXIgPSBjbGFzcyBBcnJheUhlbHBlciB7XG4gIHN0YXRpYyBpc0FycmF5KGFycikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfVxuXG4gIHN0YXRpYyB1bmlvbihhMSwgYTIpIHtcbiAgICByZXR1cm4gdGhpcy51bmlxdWUoYTEuY29uY2F0KGEyKSk7XG4gIH1cblxuICBzdGF0aWMgdW5pcXVlKGFycmF5KSB7XG4gICAgdmFyIGEsIGksIGo7XG4gICAgYSA9IGFycmF5LmNvbmNhdCgpO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgYS5sZW5ndGgpIHtcbiAgICAgIGogPSBpICsgMTtcbiAgICAgIHdoaWxlIChqIDwgYS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGFbaV0gPT09IGFbal0pIHtcbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpO1xuICAgICAgICB9XG4gICAgICAgICsrajtcbiAgICAgIH1cbiAgICAgICsraTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBDb21tb25IZWxwZXJcblxuICBAbWVyZ2U6ICh4cy4uLikgLT5cbiAgICBpZiB4cz8ubGVuZ3RoID4gMFxuICAgICAgQHRhcCB7fSwgKG0pIC0+IG1ba10gPSB2IGZvciBrLCB2IG9mIHggZm9yIHggaW4geHNcbiBcbiAgQHRhcDogKG8sIGZuKSAtPiBcbiAgICBmbihvKVxuICAgIG9cblxuICBAYXBwbHlNaXhpbnM6IChkZXJpdmVkQ3RvciwgYmFzZUN0b3JzKSAtPiBcbiAgICBiYXNlQ3RvcnMuZm9yRWFjaCAoYmFzZUN0b3IpID0+IFxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoIChuYW1lKT0+IFxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKSIsImV4cG9ydCB2YXIgQ29tbW9uSGVscGVyID0gY2xhc3MgQ29tbW9uSGVscGVyIHtcbiAgc3RhdGljIG1lcmdlKC4uLnhzKSB7XG4gICAgaWYgKCh4cyAhPSBudWxsID8geHMubGVuZ3RoIDogdm9pZCAwKSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcCh7fSwgZnVuY3Rpb24obSkge1xuICAgICAgICB2YXIgaSwgaywgbGVuLCByZXN1bHRzLCB2LCB4O1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHhzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgeCA9IHhzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0czE7XG4gICAgICAgICAgICByZXN1bHRzMSA9IFtdO1xuICAgICAgICAgICAgZm9yIChrIGluIHgpIHtcbiAgICAgICAgICAgICAgdiA9IHhba107XG4gICAgICAgICAgICAgIHJlc3VsdHMxLnB1c2gobVtrXSA9IHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMxO1xuICAgICAgICAgIH0pKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRhcChvLCBmbikge1xuICAgIGZuKG8pO1xuICAgIHJldHVybiBvO1xuICB9XG5cbiAgc3RhdGljIGFwcGx5TWl4aW5zKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIHtcbiAgICByZXR1cm4gYmFzZUN0b3JzLmZvckVhY2goKGJhc2VDdG9yKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVyaXZlZEN0b3IsIG5hbWUsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZUN0b3IucHJvdG90eXBlLCBuYW1lKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgTmFtZXNwYWNlSGVscGVyXG5cbiAgQHNwbGl0Rmlyc3Q6IChmdWxsbmFtZSxpc1NwYWNlID0gZmFsc2UpIC0+XG4gICAgaWYgZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT0gLTEgYW5kICFpc1NwYWNlXG4gICAgICByZXR1cm4gW251bGwsZnVsbG5hbWVdXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLHBhcnRzLmpvaW4oJzonKSB8fCBudWxsXVxuXG4gIEBzcGxpdDogKGZ1bGxuYW1lKSAtPlxuICAgIGlmIGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09IC0xXG4gICAgICByZXR1cm4gW251bGwsZnVsbG5hbWVdXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgbmFtZSA9IHBhcnRzLnBvcCgpXG4gICAgW3BhcnRzLmpvaW4oJzonKSxuYW1lXSIsImV4cG9ydCB2YXIgTmFtZXNwYWNlSGVscGVyID0gY2xhc3MgTmFtZXNwYWNlSGVscGVyIHtcbiAgc3RhdGljIHNwbGl0Rmlyc3QoZnVsbG5hbWUsIGlzU3BhY2UgPSBmYWxzZSkge1xuICAgIHZhciBwYXJ0cztcbiAgICBpZiAoZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT09IC0xICYmICFpc1NwYWNlKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXTtcbiAgICB9XG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpO1xuICAgIHJldHVybiBbcGFydHMuc2hpZnQoKSwgcGFydHMuam9pbignOicpIHx8IG51bGxdO1xuICB9XG5cbiAgc3RhdGljIHNwbGl0KGZ1bGxuYW1lKSB7XG4gICAgdmFyIG5hbWUsIHBhcnRzO1xuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdO1xuICAgIH1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6Jyk7XG4gICAgbmFtZSA9IHBhcnRzLnBvcCgpO1xuICAgIHJldHVybiBbcGFydHMuam9pbignOicpLCBuYW1lXTtcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgT3B0aW9uYWxQcm9taXNlXG4gICAgY29uc3RydWN0b3I6IChAdmFsKSAtPlxuICAgICAgICBpZiBAdmFsPyBhbmQgQHZhbC50aGVuPyBhbmQgQHZhbC5yZXN1bHQ/XG4gICAgICAgICAgICBAdmFsID0gQHZhbC5yZXN1bHQoKVxuICAgIHRoZW46IChjYikgLT5cbiAgICAgICAgaWYgQHZhbD8gYW5kIEB2YWwudGhlbj9cbiAgICAgICAgICAgIG5ldyBPcHRpb25hbFByb21pc2UoQHZhbC50aGVuKGNiKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV3IE9wdGlvbmFsUHJvbWlzZShjYihAdmFsKSlcbiAgICByZXN1bHQ6IC0+XG4gICAgICAgIEB2YWxcblxuZXhwb3J0IG9wdGlvbmFsUHJvbWlzZSA9ICh2YWwpLT4gXG4gICAgbmV3IE9wdGlvbmFsUHJvbWlzZSh2YWwpXG5cblxuIiwiZXhwb3J0IHZhciBPcHRpb25hbFByb21pc2UgPSBjbGFzcyBPcHRpb25hbFByb21pc2Uge1xuICBjb25zdHJ1Y3Rvcih2YWwxKSB7XG4gICAgdGhpcy52YWwgPSB2YWwxO1xuICAgIGlmICgodGhpcy52YWwgIT0gbnVsbCkgJiYgKHRoaXMudmFsLnRoZW4gIT0gbnVsbCkgJiYgKHRoaXMudmFsLnJlc3VsdCAhPSBudWxsKSkge1xuICAgICAgdGhpcy52YWwgPSB0aGlzLnZhbC5yZXN1bHQoKTtcbiAgICB9XG4gIH1cblxuICB0aGVuKGNiKSB7XG4gICAgaWYgKCh0aGlzLnZhbCAhPSBudWxsKSAmJiAodGhpcy52YWwudGhlbiAhPSBudWxsKSkge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodGhpcy52YWwudGhlbihjYikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZShjYih0aGlzLnZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICByZXR1cm4gdGhpcy52YWw7XG4gIH1cblxufTtcblxuZXhwb3J0IHZhciBvcHRpb25hbFByb21pc2UgPSBmdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodmFsKTtcbn07XG4iLCJleHBvcnQgY2xhc3MgUGF0aEhlbHBlclxuICBAZ2V0UGF0aDogKG9iaixwYXRoLHNlcD0nLicpIC0+XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcClcbiAgICBjdXIgPSBvYmpcbiAgICBwYXJ0cy5maW5kIChwYXJ0KSA9PlxuICAgICAgY3VyID0gY3VyW3BhcnRdXG4gICAgICB0eXBlb2YgY3VyID09IFwidW5kZWZpbmVkXCJcbiAgICBjdXJcbiAgICBcbiAgXG4gIEBzZXRQYXRoOiAob2JqLHBhdGgsdmFsLHNlcD0nLicpIC0+XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcClcbiAgICBsYXN0ID0gcGFydHMucG9wKClcbiAgICBwYXJ0cy5yZWR1Y2UoKGN1cixwYXJ0KSA9PlxuICAgICAgaWYgY3VyW3BhcnRdP1xuICAgICAgICBjdXJbcGFydF1cbiAgICAgIGVsc2VcbiAgICAgICAgY3VyW3BhcnRdID0ge31cbiAgICAsIG9iailbbGFzdF0gPSB2YWxcbiAgICAiLCJleHBvcnQgdmFyIFBhdGhIZWxwZXIgPSBjbGFzcyBQYXRoSGVscGVyIHtcbiAgc3RhdGljIGdldFBhdGgob2JqLCBwYXRoLCBzZXAgPSAnLicpIHtcbiAgICB2YXIgY3VyLCBwYXJ0cztcbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKTtcbiAgICBjdXIgPSBvYmo7XG4gICAgcGFydHMuZmluZCgocGFydCkgPT4ge1xuICAgICAgY3VyID0gY3VyW3BhcnRdO1xuICAgICAgcmV0dXJuIHR5cGVvZiBjdXIgPT09IFwidW5kZWZpbmVkXCI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGN1cjtcbiAgfVxuXG4gIHN0YXRpYyBzZXRQYXRoKG9iaiwgcGF0aCwgdmFsLCBzZXAgPSAnLicpIHtcbiAgICB2YXIgbGFzdCwgcGFydHM7XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcCk7XG4gICAgbGFzdCA9IHBhcnRzLnBvcCgpO1xuICAgIHJldHVybiBwYXJ0cy5yZWR1Y2UoKGN1ciwgcGFydCkgPT4ge1xuICAgICAgaWYgKGN1cltwYXJ0XSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjdXJbcGFydF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY3VyW3BhcnRdID0ge307XG4gICAgICB9XG4gICAgfSwgb2JqKVtsYXN0XSA9IHZhbDtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgU2l6ZSB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1NpemUnO1xuXG5leHBvcnQgY2xhc3MgU3RyaW5nSGVscGVyXG4gIEB0cmltRW1wdHlMaW5lOiAodHh0KSAtPlxuICAgIHJldHVybiB0eHQucmVwbGFjZSgvXlxccypcXHI/XFxuLywgJycpLnJlcGxhY2UoL1xccj9cXG5cXHMqJC8sICcnKVxuXG4gIEBlc2NhcGVSZWdFeHA6IChzdHIpIC0+XG4gICAgc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKVxuXG4gIEByZXBlYXRUb0xlbmd0aDogKHR4dCwgbGVuZ3RoKSAtPlxuICAgIHJldHVybiAnJyBpZiBsZW5ndGggPD0gMFxuICAgIEFycmF5KE1hdGguY2VpbChsZW5ndGgvdHh0Lmxlbmd0aCkrMSkuam9pbih0eHQpLnN1YnN0cmluZygwLGxlbmd0aClcbiAgICBcbiAgQHJlcGVhdDogKHR4dCwgbmIpIC0+XG4gICAgQXJyYXkobmIrMSkuam9pbih0eHQpXG4gICAgXG4gIEBnZXRUeHRTaXplOiAodHh0KSAtPlxuICAgIGxpbmVzID0gdHh0LnJlcGxhY2UoL1xcci9nLCcnKS5zcGxpdChcIlxcblwiKVxuICAgIHcgPSAwXG4gICAgZm9yIGwgaW4gbGluZXNcbiAgICAgIHcgPSBNYXRoLm1heCh3LGwubGVuZ3RoKVxuICAgIHJldHVybiBuZXcgU2l6ZSh3LGxpbmVzLmxlbmd0aC0xKVxuXG4gIEBpbmRlbnROb3RGaXJzdDogKHRleHQsbmI9MSxzcGFjZXM9JyAgJykgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmVnID0gL1xcbi9nXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgXCJcXG5cIiArIEByZXBlYXQoc3BhY2VzLCBuYikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgICAgIFxuICBAaW5kZW50OiAodGV4dCxuYj0xLHNwYWNlcz0nICAnKSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZXR1cm4gc3BhY2VzICsgQGluZGVudE5vdEZpcnN0KHRleHQsbmIsc3BhY2VzKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gIFxuICBAcmV2ZXJzZVN0cjogKHR4dCkgLT5cbiAgICByZXR1cm4gdHh0LnNwbGl0KFwiXCIpLnJldmVyc2UoKS5qb2luKFwiXCIpXG4gIFxuICBcbiAgQHJlbW92ZUNhcnJldDogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICB0bXAgPSAnW1tbW3F1b3RlZF9jYXJyZXRdXV1dJ1xuICAgIHJlQ2FycmV0ID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIpLCBcImdcIilcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyK2NhcnJldENoYXIpLCBcImdcIilcbiAgICByZVRtcCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cCh0bXApLCBcImdcIilcbiAgICB0eHQucmVwbGFjZShyZVF1b3RlZCx0bXApLnJlcGxhY2UocmVDYXJyZXQsJycpLnJlcGxhY2UocmVUbXAsIGNhcnJldENoYXIpXG4gICAgXG4gIEBnZXRBbmRSZW1vdmVGaXJzdENhcnJldDogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICBwb3MgPSBAZ2V0Q2FycmV0UG9zKHR4dCxjYXJyZXRDaGFyKVxuICAgIGlmIHBvcz9cbiAgICAgIHR4dCA9IHR4dC5zdWJzdHIoMCxwb3MpICsgdHh0LnN1YnN0cihwb3MrY2FycmV0Q2hhci5sZW5ndGgpXG4gICAgICByZXR1cm4gW3Bvcyx0eHRdXG4gICAgICBcbiAgQGdldENhcnJldFBvczogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyK2NhcnJldENoYXIpLCBcImdcIilcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKVxuICAgIGlmIChpID0gdHh0LmluZGV4T2YoY2FycmV0Q2hhcikpID4gLTFcbiAgICAgIHJldHVybiBpIiwiaW1wb3J0IHtcbiAgU2l6ZVxufSBmcm9tICcuLi9wb3NpdGlvbmluZy9TaXplJztcblxuZXhwb3J0IHZhciBTdHJpbmdIZWxwZXIgPSBjbGFzcyBTdHJpbmdIZWxwZXIge1xuICBzdGF0aWMgdHJpbUVtcHR5TGluZSh0eHQpIHtcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJyk7XG4gIH1cblxuICBzdGF0aWMgZXNjYXBlUmVnRXhwKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpO1xuICB9XG5cbiAgc3RhdGljIHJlcGVhdFRvTGVuZ3RoKHR4dCwgbGVuZ3RoKSB7XG4gICAgaWYgKGxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gdHh0Lmxlbmd0aCkgKyAxKS5qb2luKHR4dCkuc3Vic3RyaW5nKDAsIGxlbmd0aCk7XG4gIH1cblxuICBzdGF0aWMgcmVwZWF0KHR4dCwgbmIpIHtcbiAgICByZXR1cm4gQXJyYXkobmIgKyAxKS5qb2luKHR4dCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0VHh0U2l6ZSh0eHQpIHtcbiAgICB2YXIgaiwgbCwgbGVuLCBsaW5lcywgdztcbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpO1xuICAgIHcgPSAwO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBsID0gbGluZXNbal07XG4gICAgICB3ID0gTWF0aC5tYXgodywgbC5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFNpemUodywgbGluZXMubGVuZ3RoIC0gMSk7XG4gIH1cblxuICBzdGF0aWMgaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgdmFyIHJlZztcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZWcgPSAvXFxuL2c7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgXCJcXG5cIiArIHRoaXMucmVwZWF0KHNwYWNlcywgbmIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGluZGVudCh0ZXh0LCBuYiA9IDEsIHNwYWNlcyA9ICcgICcpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gc3BhY2VzICsgdGhpcy5pbmRlbnROb3RGaXJzdCh0ZXh0LCBuYiwgc3BhY2VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHJldmVyc2VTdHIodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5zcGxpdChcIlwiKS5yZXZlcnNlKCkuam9pbihcIlwiKTtcbiAgfVxuXG4gIHN0YXRpYyByZW1vdmVDYXJyZXQodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIHJlQ2FycmV0LCByZVF1b3RlZCwgcmVUbXAsIHRtcDtcbiAgICB0bXAgPSAnW1tbW3F1b3RlZF9jYXJyZXRdXV1dJztcbiAgICByZUNhcnJldCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciArIGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgcmVUbXAgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKHRtcCksIFwiZ1wiKTtcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UocmVRdW90ZWQsIHRtcCkucmVwbGFjZShyZUNhcnJldCwgJycpLnJlcGxhY2UocmVUbXAsIGNhcnJldENoYXIpO1xuICB9XG5cbiAgc3RhdGljIGdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciBwb3M7XG4gICAgcG9zID0gdGhpcy5nZXRDYXJyZXRQb3ModHh0LCBjYXJyZXRDaGFyKTtcbiAgICBpZiAocG9zICE9IG51bGwpIHtcbiAgICAgIHR4dCA9IHR4dC5zdWJzdHIoMCwgcG9zKSArIHR4dC5zdWJzdHIocG9zICsgY2FycmV0Q2hhci5sZW5ndGgpO1xuICAgICAgcmV0dXJuIFtwb3MsIHR4dF07XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldENhcnJldFBvcyh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgaSwgcmVRdW90ZWQ7XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHR4dCA9IHR4dC5yZXBsYWNlKHJlUXVvdGVkLCAnICcpO1xuICAgIGlmICgoaSA9IHR4dC5pbmRleE9mKGNhcnJldENoYXIpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGFpck1hdGNoIH0gZnJvbSAnLi9QYWlyTWF0Y2gnO1xuXG5leHBvcnQgY2xhc3MgUGFpclxuICBjb25zdHJ1Y3RvcjogKEBvcGVuZXIsQGNsb3NlcixAb3B0aW9ucyA9IHt9KSAtPlxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2VcbiAgICAgIHZhbGlkTWF0Y2g6IG51bGxcbiAgICB9XG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2YgQG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gQG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgb3BlbmVyUmVnOiAtPlxuICAgIGlmIHR5cGVvZiBAb3BlbmVyID09ICdzdHJpbmcnIFxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAb3BlbmVyKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQG9wZW5lclxuICBjbG9zZXJSZWc6IC0+XG4gICAgaWYgdHlwZW9mIEBjbG9zZXIgPT0gJ3N0cmluZycgXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjbG9zZXIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAY2xvc2VyXG4gIG1hdGNoQW55UGFydHM6IC0+XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW5lcjogQG9wZW5lclJlZygpXG4gICAgICBjbG9zZXI6IEBjbG9zZXJSZWcoKVxuICAgIH1cbiAgbWF0Y2hBbnlQYXJ0S2V5czogLT5cbiAgICBrZXlzID0gW11cbiAgICBmb3Iga2V5LCByZWcgb2YgQG1hdGNoQW55UGFydHMoKVxuICAgICAga2V5cy5wdXNoKGtleSlcbiAgICByZXR1cm4ga2V5c1xuICBtYXRjaEFueVJlZzogLT5cbiAgICBncm91cHMgPSBbXVxuICAgIGZvciBrZXksIHJlZyBvZiBAbWF0Y2hBbnlQYXJ0cygpXG4gICAgICBncm91cHMucHVzaCgnKCcrcmVnLnNvdXJjZSsnKScpXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoZ3JvdXBzLmpvaW4oJ3wnKSlcbiAgbWF0Y2hBbnk6ICh0ZXh0LG9mZnNldD0wKSAtPlxuICAgIHdoaWxlIChtYXRjaCA9IEBfbWF0Y2hBbnkodGV4dCxvZmZzZXQpKT8gYW5kICFtYXRjaC52YWxpZCgpXG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgIHJldHVybiBtYXRjaCBpZiBtYXRjaD8gYW5kIG1hdGNoLnZhbGlkKClcbiAgX21hdGNoQW55OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICBpZiBvZmZzZXRcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cihvZmZzZXQpXG4gICAgbWF0Y2ggPSBAbWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpXG4gICAgaWYgbWF0Y2g/XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLG1hdGNoLG9mZnNldClcbiAgbWF0Y2hBbnlOYW1lZDogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBfbWF0Y2hBbnlHZXROYW1lKEBtYXRjaEFueSh0ZXh0KSlcbiAgbWF0Y2hBbnlMYXN0OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICB3aGlsZSBtYXRjaCA9IEBtYXRjaEFueSh0ZXh0LG9mZnNldClcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpXG4gICAgICBpZiAhcmVzIG9yIHJlcy5lbmQoKSAhPSBtYXRjaC5lbmQoKVxuICAgICAgICByZXMgPSBtYXRjaFxuICAgIHJldHVybiByZXNcbiAgaWRlbnRpY2FsOiAtPlxuICAgIEBvcGVuZXIgPT0gQGNsb3NlciBvciAoXG4gICAgICBAb3BlbmVyLnNvdXJjZT8gYW5kIFxuICAgICAgQGNsb3Nlci5zb3VyY2U/IGFuZCBcbiAgICAgIEBvcGVuZXIuc291cmNlID09IEBjbG9zZXIuc291cmNlXG4gICAgKVxuICB3cmFwcGVyUG9zOiAocG9zLHRleHQpIC0+XG4gICAgc3RhcnQgPSBAbWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAscG9zLnN0YXJ0KSlcbiAgICBpZiBzdGFydD8gYW5kIChAaWRlbnRpY2FsKCkgb3Igc3RhcnQubmFtZSgpID09ICdvcGVuZXInKVxuICAgICAgZW5kID0gQG1hdGNoQW55KHRleHQscG9zLmVuZClcbiAgICAgIGlmIGVuZD8gYW5kIChAaWRlbnRpY2FsKCkgb3IgZW5kLm5hbWUoKSA9PSAnY2xvc2VyJylcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSxlbmQuZW5kKCkpXG4gICAgICBlbHNlIGlmIEBvcHRpb25uYWxfZW5kXG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksdGV4dC5sZW5ndGgpXG4gIGlzV2FwcGVyT2Y6IChwb3MsdGV4dCkgLT5cbiAgICByZXR1cm4gQHdyYXBwZXJQb3MocG9zLHRleHQpPyIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhaXJNYXRjaFxufSBmcm9tICcuL1BhaXJNYXRjaCc7XG5cbmV4cG9ydCB2YXIgUGFpciA9IGNsYXNzIFBhaXIge1xuICBjb25zdHJ1Y3RvcihvcGVuZXIsIGNsb3Nlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICB0aGlzLm9wZW5lciA9IG9wZW5lcjtcbiAgICB0aGlzLmNsb3NlciA9IGNsb3NlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2UsXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfTtcbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gdGhpcy5vcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMub3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5lclJlZygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub3BlbmVyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm9wZW5lcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuZXI7XG4gICAgfVxuICB9XG5cbiAgY2xvc2VyUmVnKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jbG9zZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY2xvc2VyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NlcjtcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueVBhcnRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvcGVuZXI6IHRoaXMub3BlbmVyUmVnKCksXG4gICAgICBjbG9zZXI6IHRoaXMuY2xvc2VyUmVnKClcbiAgICB9O1xuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0S2V5cygpIHtcbiAgICB2YXIga2V5LCBrZXlzLCByZWYsIHJlZztcbiAgICBrZXlzID0gW107XG4gICAgcmVmID0gdGhpcy5tYXRjaEFueVBhcnRzKCk7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XTtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIG1hdGNoQW55UmVnKCkge1xuICAgIHZhciBncm91cHMsIGtleSwgcmVmLCByZWc7XG4gICAgZ3JvdXBzID0gW107XG4gICAgcmVmID0gdGhpcy5tYXRjaEFueVBhcnRzKCk7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XTtcbiAgICAgIGdyb3Vwcy5wdXNoKCcoJyArIHJlZy5zb3VyY2UgKyAnKScpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChncm91cHMuam9pbignfCcpKTtcbiAgfVxuXG4gIG1hdGNoQW55KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2g7XG4gICAgd2hpbGUgKCgobWF0Y2ggPSB0aGlzLl9tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSAhPSBudWxsKSAmJiAhbWF0Y2gudmFsaWQoKSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKCk7XG4gICAgfVxuICAgIGlmICgobWF0Y2ggIT0gbnVsbCkgJiYgbWF0Y2gudmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgfVxuXG4gIF9tYXRjaEFueSh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoO1xuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cihvZmZzZXQpO1xuICAgIH1cbiAgICBtYXRjaCA9IHRoaXMubWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpO1xuICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLCBtYXRjaCwgb2Zmc2V0KTtcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueU5hbWVkKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF0Y2hBbnlHZXROYW1lKHRoaXMubWF0Y2hBbnkodGV4dCkpO1xuICB9XG5cbiAgbWF0Y2hBbnlMYXN0KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2gsIHJlcztcbiAgICB3aGlsZSAobWF0Y2ggPSB0aGlzLm1hdGNoQW55KHRleHQsIG9mZnNldCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpO1xuICAgICAgaWYgKCFyZXMgfHwgcmVzLmVuZCgpICE9PSBtYXRjaC5lbmQoKSkge1xuICAgICAgICByZXMgPSBtYXRjaDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGlkZW50aWNhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZXIgPT09IHRoaXMuY2xvc2VyIHx8ICgodGhpcy5vcGVuZXIuc291cmNlICE9IG51bGwpICYmICh0aGlzLmNsb3Nlci5zb3VyY2UgIT0gbnVsbCkgJiYgdGhpcy5vcGVuZXIuc291cmNlID09PSB0aGlzLmNsb3Nlci5zb3VyY2UpO1xuICB9XG5cbiAgd3JhcHBlclBvcyhwb3MsIHRleHQpIHtcbiAgICB2YXIgZW5kLCBzdGFydDtcbiAgICBzdGFydCA9IHRoaXMubWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAsIHBvcy5zdGFydCkpO1xuICAgIGlmICgoc3RhcnQgIT0gbnVsbCkgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgc3RhcnQubmFtZSgpID09PSAnb3BlbmVyJykpIHtcbiAgICAgIGVuZCA9IHRoaXMubWF0Y2hBbnkodGV4dCwgcG9zLmVuZCk7XG4gICAgICBpZiAoKGVuZCAhPSBudWxsKSAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBlbmQubmFtZSgpID09PSAnY2xvc2VyJykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgZW5kLmVuZCgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25uYWxfZW5kKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIHRleHQubGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc1dhcHBlck9mKHBvcywgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZXJQb3MocG9zLCB0ZXh0KSAhPSBudWxsO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUGFpck1hdGNoXG4gIGNvbnN0cnVjdG9yOiAoQHBhaXIsQG1hdGNoLEBvZmZzZXQgPSAwKSAtPlxuICBuYW1lOiAtPlxuICAgIGlmIEBtYXRjaFxuICAgICAgdW5sZXNzIF9uYW1lP1xuICAgICAgICBmb3IgZ3JvdXAsIGkgaW4gQG1hdGNoXG4gICAgICAgICAgaWYgaSA+IDAgYW5kIGdyb3VwP1xuICAgICAgICAgICAgX25hbWUgPSBAcGFpci5tYXRjaEFueVBhcnRLZXlzKClbaS0xXVxuICAgICAgICAgICAgcmV0dXJuIF9uYW1lXG4gICAgICAgIF9uYW1lID0gZmFsc2VcbiAgICAgIHJldHVybiBfbmFtZSB8fCBudWxsXG4gIHN0YXJ0OiAtPlxuICAgIEBtYXRjaC5pbmRleCArIEBvZmZzZXRcbiAgZW5kOiAtPlxuICAgIEBtYXRjaC5pbmRleCArIEBtYXRjaFswXS5sZW5ndGggKyBAb2Zmc2V0XG4gIHZhbGlkOiAtPlxuICAgIHJldHVybiAhQHBhaXIudmFsaWRNYXRjaCB8fCBAcGFpci52YWxpZE1hdGNoKHRoaXMpXG4gIGxlbmd0aDogLT5cbiAgICBAbWF0Y2hbMF0ubGVuZ3RoIiwiZXhwb3J0IHZhciBQYWlyTWF0Y2ggPSBjbGFzcyBQYWlyTWF0Y2gge1xuICBjb25zdHJ1Y3RvcihwYWlyLCBtYXRjaCwgb2Zmc2V0ID0gMCkge1xuICAgIHRoaXMucGFpciA9IHBhaXI7XG4gICAgdGhpcy5tYXRjaCA9IG1hdGNoO1xuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICB9XG5cbiAgbmFtZSgpIHtcbiAgICB2YXIgX25hbWUsIGdyb3VwLCBpLCBqLCBsZW4sIHJlZjtcbiAgICBpZiAodGhpcy5tYXRjaCkge1xuICAgICAgaWYgKHR5cGVvZiBfbmFtZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBfbmFtZSA9PT0gbnVsbCkge1xuICAgICAgICByZWYgPSB0aGlzLm1hdGNoO1xuICAgICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICAgIGdyb3VwID0gcmVmW2ldO1xuICAgICAgICAgIGlmIChpID4gMCAmJiAoZ3JvdXAgIT0gbnVsbCkpIHtcbiAgICAgICAgICAgIF9uYW1lID0gdGhpcy5wYWlyLm1hdGNoQW55UGFydEtleXMoKVtpIC0gMV07XG4gICAgICAgICAgICByZXR1cm4gX25hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9uYW1lID0gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gX25hbWUgfHwgbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMub2Zmc2V0O1xuICB9XG5cbiAgZW5kKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoLmluZGV4ICsgdGhpcy5tYXRjaFswXS5sZW5ndGggKyB0aGlzLm9mZnNldDtcbiAgfVxuXG4gIHZhbGlkKCkge1xuICAgIHJldHVybiAhdGhpcy5wYWlyLnZhbGlkTWF0Y2ggfHwgdGhpcy5wYWlyLnZhbGlkTWF0Y2godGhpcyk7XG4gIH1cblxuICBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hbMF0ubGVuZ3RoO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LEBlbmQpIC0+XG4gICAgQGVuZCA9IEBzdGFydCB1bmxlc3MgQGVuZD9cbiAgY29udGFpbnNQdDogKHB0KSAtPlxuICAgIHJldHVybiBAc3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBlbmRcbiAgY29udGFpbnNQb3M6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBzdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGVuZFxuICB3cmFwcGVkQnk6IChwcmVmaXgsc3VmZml4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyhAc3RhcnQtcHJlZml4Lmxlbmd0aCxAc3RhcnQsQGVuZCxAZW5kK3N1ZmZpeC5sZW5ndGgpXG4gIHdpdGhFZGl0b3I6ICh2YWwpLT5cbiAgICBAX2VkaXRvciA9IHZhbFxuICAgIHJldHVybiB0aGlzXG4gIGVkaXRvcjogLT5cbiAgICB1bmxlc3MgQF9lZGl0b3I/XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVkaXRvciBzZXQnKVxuICAgIHJldHVybiBAX2VkaXRvclxuICBoYXNFZGl0b3I6IC0+XG4gICAgcmV0dXJuIEBfZWRpdG9yP1xuICB0ZXh0OiAtPlxuICAgIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBzdGFydCwgQGVuZClcbiAgYXBwbHlPZmZzZXQ6IChvZmZzZXQpLT5cbiAgICBpZiBvZmZzZXQgIT0gMFxuICAgICAgQHN0YXJ0ICs9IG9mZnNldFxuICAgICAgQGVuZCArPSBvZmZzZXRcbiAgICByZXR1cm4gdGhpc1xuICBwcmV2RU9MOiAtPlxuICAgIHVubGVzcyBAX3ByZXZFT0w/XG4gICAgICBAX3ByZXZFT0wgPSBAZWRpdG9yKCkuZmluZExpbmVTdGFydChAc3RhcnQpXG4gICAgcmV0dXJuIEBfcHJldkVPTFxuICBuZXh0RU9MOiAtPlxuICAgIHVubGVzcyBAX25leHRFT0w/XG4gICAgICBAX25leHRFT0wgPSBAZWRpdG9yKCkuZmluZExpbmVFbmQoQGVuZClcbiAgICByZXR1cm4gQF9uZXh0RU9MXG4gIHRleHRXaXRoRnVsbExpbmVzOiAtPlxuICAgIHVubGVzcyBAX3RleHRXaXRoRnVsbExpbmVzP1xuICAgICAgQF90ZXh0V2l0aEZ1bGxMaW5lcyA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBwcmV2RU9MKCksQG5leHRFT0woKSlcbiAgICByZXR1cm4gQF90ZXh0V2l0aEZ1bGxMaW5lc1xuICBzYW1lTGluZXNQcmVmaXg6IC0+XG4gICAgdW5sZXNzIEBfc2FtZUxpbmVzUHJlZml4P1xuICAgICAgQF9zYW1lTGluZXNQcmVmaXggPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAcHJldkVPTCgpLEBzdGFydClcbiAgICByZXR1cm4gQF9zYW1lTGluZXNQcmVmaXhcbiAgc2FtZUxpbmVzU3VmZml4OiAtPlxuICAgIHVubGVzcyBAX3NhbWVMaW5lc1N1ZmZpeD9cbiAgICAgIEBfc2FtZUxpbmVzU3VmZml4ID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQGVuZCxAbmV4dEVPTCgpKVxuICAgIHJldHVybiBAX3NhbWVMaW5lc1N1ZmZpeFxuICBjb3B5OiAtPlxuICAgIHJlcyA9IG5ldyBQb3MoQHN0YXJ0LEBlbmQpXG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICByZXMud2l0aEVkaXRvcihAZWRpdG9yKCkpXG4gICAgcmV0dXJuIHJlc1xuICByYXc6IC0+XG4gICAgW0BzdGFydCxAZW5kXSIsImV4cG9ydCB2YXIgUG9zID0gY2xhc3MgUG9zIHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGVuZCkge1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICBpZiAodGhpcy5lbmQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5lbmQgPSB0aGlzLnN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIGNvbnRhaW5zUHQocHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmVuZDtcbiAgfVxuXG4gIGNvbnRhaW5zUG9zKHBvcykge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuZW5kO1xuICB9XG5cbiAgd3JhcHBlZEJ5KHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3Mud3JhcENsYXNzKHRoaXMuc3RhcnQgLSBwcmVmaXgubGVuZ3RoLCB0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5lbmQgKyBzdWZmaXgubGVuZ3RoKTtcbiAgfVxuXG4gIHdpdGhFZGl0b3IodmFsKSB7XG4gICAgdGhpcy5fZWRpdG9yID0gdmFsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZWRpdG9yKCkge1xuICAgIGlmICh0aGlzLl9lZGl0b3IgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0Jyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lZGl0b3I7XG4gIH1cblxuICBoYXNFZGl0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvciAhPSBudWxsO1xuICB9XG5cbiAgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgfVxuXG4gIGFwcGx5T2Zmc2V0KG9mZnNldCkge1xuICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHByZXZFT0woKSB7XG4gICAgaWYgKHRoaXMuX3ByZXZFT0wgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcHJldkVPTCA9IHRoaXMuZWRpdG9yKCkuZmluZExpbmVTdGFydCh0aGlzLnN0YXJ0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ByZXZFT0w7XG4gIH1cblxuICBuZXh0RU9MKCkge1xuICAgIGlmICh0aGlzLl9uZXh0RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX25leHRFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lRW5kKHRoaXMuZW5kKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25leHRFT0w7XG4gIH1cblxuICB0ZXh0V2l0aEZ1bGxMaW5lcygpIHtcbiAgICBpZiAodGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RleHRXaXRoRnVsbExpbmVzO1xuICB9XG5cbiAgc2FtZUxpbmVzUHJlZml4KCkge1xuICAgIGlmICh0aGlzLl9zYW1lTGluZXNQcmVmaXggPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2FtZUxpbmVzUHJlZml4ID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMucHJldkVPTCgpLCB0aGlzLnN0YXJ0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NhbWVMaW5lc1ByZWZpeDtcbiAgfVxuXG4gIHNhbWVMaW5lc1N1ZmZpeCgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzU3VmZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLmVuZCwgdGhpcy5uZXh0RU9MKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzU3VmZml4O1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBQb3ModGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICByZXMud2l0aEVkaXRvcih0aGlzLmVkaXRvcigpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHJhdygpIHtcbiAgICByZXR1cm4gW3RoaXMuc3RhcnQsIHRoaXMuZW5kXTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgV3JhcHBpbmcgfSBmcm9tICcuL1dyYXBwaW5nJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBDb21tb25IZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBQb3NDb2xsZWN0aW9uXG4gIGNvbnN0cnVjdG9yOiAoYXJyKSAtPlxuICAgIGlmICFBcnJheS5pc0FycmF5KGFycilcbiAgICAgIGFyciA9IFthcnJdXG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFycixbUG9zQ29sbGVjdGlvbl0pXG4gICAgcmV0dXJuIGFyclxuICAgIFxuICB3cmFwOiAocHJlZml4LHN1ZmZpeCktPlxuICAgICAgcmV0dXJuIEBtYXAoIChwKSAtPiBuZXcgV3JhcHBpbmcocC5zdGFydCwgcC5lbmQsIHByZWZpeCwgc3VmZml4KSlcbiAgcmVwbGFjZTogKHR4dCktPlxuICAgICAgcmV0dXJuIEBtYXAoIChwKSAtPiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dCkpIiwiaW1wb3J0IHtcbiAgV3JhcHBpbmdcbn0gZnJvbSAnLi9XcmFwcGluZyc7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuXG5pbXBvcnQge1xuICBDb21tb25IZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5leHBvcnQgdmFyIFBvc0NvbGxlY3Rpb24gPSBjbGFzcyBQb3NDb2xsZWN0aW9uIHtcbiAgY29uc3RydWN0b3IoYXJyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIGFyciA9IFthcnJdO1xuICAgIH1cbiAgICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoYXJyLCBbUG9zQ29sbGVjdGlvbl0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICB3cmFwKHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBuZXcgV3JhcHBpbmcocC5zdGFydCwgcC5lbmQsIHByZWZpeCwgc3VmZml4KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcGxhY2UodHh0KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dCk7XG4gICAgfSk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcbmltcG9ydCB7IENvbW1vbkhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcbmltcG9ydCB7IE9wdGlvbk9iamVjdCB9IGZyb20gJy4uL09wdGlvbk9iamVjdCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBSZXBsYWNlbWVudCBleHRlbmRzIFBvc1xuICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnModGhpcy5wcm90b3R5cGUsW09wdGlvbk9iamVjdF0pXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LCBAZW5kLCBAdGV4dCwgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBzdXBlcigpXG4gICAgQHNldE9wdHMoQG9wdGlvbnMse1xuICAgICAgcHJlZml4OiAnJ1xuICAgICAgc3VmZml4OiAnJ1xuICAgICAgc2VsZWN0aW9uczogW11cbiAgICB9KVxuICByZXNQb3NCZWZvcmVQcmVmaXg6IC0+XG4gICAgcmV0dXJuIEBzdGFydCtAcHJlZml4Lmxlbmd0aCtAdGV4dC5sZW5ndGhcbiAgcmVzRW5kOiAtPiBcbiAgICByZXR1cm4gQHN0YXJ0K0BmaW5hbFRleHQoKS5sZW5ndGhcbiAgYXBwbHk6IC0+XG4gICAgQGVkaXRvcigpLnNwbGljZVRleHQoQHN0YXJ0LCBAZW5kLCBAZmluYWxUZXh0KCkpXG4gIG5lY2Vzc2FyeTogLT5cbiAgICByZXR1cm4gQGZpbmFsVGV4dCgpICE9IEBvcmlnaW5hbFRleHQoKVxuICBvcmlnaW5hbFRleHQ6IC0+XG4gICAgcmV0dXJuIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBzdGFydCwgQGVuZClcbiAgZmluYWxUZXh0OiAtPlxuICAgIHJldHVybiBAcHJlZml4K0B0ZXh0K0BzdWZmaXhcbiAgb2Zmc2V0QWZ0ZXI6ICgpIC0+IFxuICAgIHJldHVybiBAZmluYWxUZXh0KCkubGVuZ3RoIC0gKEBlbmQgLSBAc3RhcnQpXG4gIGFwcGx5T2Zmc2V0OiAob2Zmc2V0KS0+XG4gICAgaWYgb2Zmc2V0ICE9IDBcbiAgICAgIEBzdGFydCArPSBvZmZzZXRcbiAgICAgIEBlbmQgKz0gb2Zmc2V0XG4gICAgICBmb3Igc2VsIGluIEBzZWxlY3Rpb25zXG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgICByZXR1cm4gdGhpc1xuICBzZWxlY3RDb250ZW50OiAtPiBcbiAgICBAc2VsZWN0aW9ucyA9IFtuZXcgUG9zKEBwcmVmaXgubGVuZ3RoK0BzdGFydCwgQHByZWZpeC5sZW5ndGgrQHN0YXJ0K0B0ZXh0Lmxlbmd0aCldXG4gICAgcmV0dXJuIHRoaXNcbiAgY2FycmV0VG9TZWw6IC0+XG4gICAgQHNlbGVjdGlvbnMgPSBbXVxuICAgIHRleHQgPSBAZmluYWxUZXh0KClcbiAgICBAcHJlZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAcHJlZml4KVxuICAgIEB0ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAdGV4dClcbiAgICBAc3VmZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAc3VmZml4KVxuICAgIHN0YXJ0ID0gQHN0YXJ0XG4gICAgXG4gICAgd2hpbGUgKHJlcyA9IFN0cmluZ0hlbHBlci5nZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0ZXh0KSk/XG4gICAgICBbcG9zLHRleHRdID0gcmVzXG4gICAgICBAc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3Moc3RhcnQrcG9zLCBzdGFydCtwb3MpKVxuICAgICAgXG4gICAgcmV0dXJuIHRoaXNcbiAgY29weTogLT4gXG4gICAgcmVzID0gbmV3IFJlcGxhY2VtZW50KEBzdGFydCwgQGVuZCwgQHRleHQsIEBnZXRPcHRzKCkpXG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICByZXMud2l0aEVkaXRvcihAZWRpdG9yKCkpXG4gICAgcmVzLnNlbGVjdGlvbnMgPSBAc2VsZWN0aW9ucy5tYXAoIChzKS0+cy5jb3B5KCkgKVxuICAgIHJldHVybiByZXMiLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5pbXBvcnQge1xuICBDb21tb25IZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5pbXBvcnQge1xuICBPcHRpb25PYmplY3Rcbn0gZnJvbSAnLi4vT3B0aW9uT2JqZWN0JztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuZXhwb3J0IHZhciBSZXBsYWNlbWVudCA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgUmVwbGFjZW1lbnQgZXh0ZW5kcyBQb3Mge1xuICAgIGNvbnN0cnVjdG9yKHN0YXJ0MSwgZW5kLCB0ZXh0MSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0MTtcbiAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgICAgdGhpcy50ZXh0ID0gdGV4dDE7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucywge1xuICAgICAgICBwcmVmaXg6ICcnLFxuICAgICAgICBzdWZmaXg6ICcnLFxuICAgICAgICBzZWxlY3Rpb25zOiBbXVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVzUG9zQmVmb3JlUHJlZml4KCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnRleHQubGVuZ3RoO1xuICAgIH1cblxuICAgIHJlc0VuZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5maW5hbFRleHQoKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgYXBwbHkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS5zcGxpY2VUZXh0KHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLmZpbmFsVGV4dCgpKTtcbiAgICB9XG5cbiAgICBuZWNlc3NhcnkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKSAhPT0gdGhpcy5vcmlnaW5hbFRleHQoKTtcbiAgICB9XG5cbiAgICBvcmlnaW5hbFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICB9XG5cbiAgICBmaW5hbFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLnRleHQgKyB0aGlzLnN1ZmZpeDtcbiAgICB9XG5cbiAgICBvZmZzZXRBZnRlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmFsVGV4dCgpLmxlbmd0aCAtICh0aGlzLmVuZCAtIHRoaXMuc3RhcnQpO1xuICAgIH1cblxuICAgIGFwcGx5T2Zmc2V0KG9mZnNldCkge1xuICAgICAgdmFyIGksIGxlbiwgcmVmLCBzZWw7XG4gICAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgICB0aGlzLmVuZCArPSBvZmZzZXQ7XG4gICAgICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9ucztcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgc2VsID0gcmVmW2ldO1xuICAgICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXQ7XG4gICAgICAgICAgc2VsLmVuZCArPSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNlbGVjdENvbnRlbnQoKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyh0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0LCB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0ICsgdGhpcy50ZXh0Lmxlbmd0aCldO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2FycmV0VG9TZWwoKSB7XG4gICAgICB2YXIgcG9zLCByZXMsIHN0YXJ0LCB0ZXh0O1xuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW107XG4gICAgICB0ZXh0ID0gdGhpcy5maW5hbFRleHQoKTtcbiAgICAgIHRoaXMucHJlZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnByZWZpeCk7XG4gICAgICB0aGlzLnRleHQgPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMudGV4dCk7XG4gICAgICB0aGlzLnN1ZmZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5zdWZmaXgpO1xuICAgICAgc3RhcnQgPSB0aGlzLnN0YXJ0O1xuICAgICAgd2hpbGUgKChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgW3BvcywgdGV4dF0gPSByZXM7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3Moc3RhcnQgKyBwb3MsIHN0YXJ0ICsgcG9zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgdmFyIHJlcztcbiAgICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy50ZXh0LCB0aGlzLmdldE9wdHMoKSk7XG4gICAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgICByZXMud2l0aEVkaXRvcih0aGlzLmVkaXRvcigpKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZWxlY3Rpb25zID0gdGhpcy5zZWxlY3Rpb25zLm1hcChmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiBzLmNvcHkoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgfTtcblxuICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoUmVwbGFjZW1lbnQucHJvdG90eXBlLCBbT3B0aW9uT2JqZWN0XSk7XG5cbiAgcmV0dXJuIFJlcGxhY2VtZW50O1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiZXhwb3J0IGNsYXNzIFNpemVcbiAgY29uc3RydWN0b3I6IChAd2lkdGgsQGhlaWdodCkgLT4iLCJleHBvcnQgY2xhc3MgU3RyUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHBvcyxAc3RyKSAtPlxuICBlbmQ6IC0+XG4gICAgQHBvcyArIEBzdHIubGVuZ3RoIiwiZXhwb3J0IHZhciBTdHJQb3MgPSBjbGFzcyBTdHJQb3Mge1xuICBjb25zdHJ1Y3Rvcihwb3MsIHN0cikge1xuICAgIHRoaXMucG9zID0gcG9zO1xuICAgIHRoaXMuc3RyID0gc3RyO1xuICB9XG5cbiAgZW5kKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aDtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuXG5leHBvcnQgY2xhc3MgV3JhcHBlZFBvcyBleHRlbmRzIFBvc1xuICBjb25zdHJ1Y3RvcjogKEBzdGFydCxAaW5uZXJTdGFydCxAaW5uZXJFbmQsQGVuZCkgLT5cbiAgICBzdXBlcigpXG4gIGlubmVyQ29udGFpbnNQdDogKHB0KSAtPlxuICAgIHJldHVybiBAaW5uZXJTdGFydCA8PSBwdCBhbmQgcHQgPD0gQGlubmVyRW5kXG4gIGlubmVyQ29udGFpbnNQb3M6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBpbm5lclN0YXJ0IDw9IHBvcy5zdGFydCBhbmQgcG9zLmVuZCA8PSBAaW5uZXJFbmRcbiAgaW5uZXJUZXh0OiAtPlxuICAgIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBpbm5lclN0YXJ0LCBAaW5uZXJFbmQpXG4gIHNldElubmVyTGVuOiAobGVuKSAtPlxuICAgIEBtb3ZlU3VmaXgoQGlubmVyU3RhcnQgKyBsZW4pXG4gIG1vdmVTdWZmaXg6IChwdCkgLT5cbiAgICBzdWZmaXhMZW4gPSBAZW5kIC0gQGlubmVyRW5kXG4gICAgQGlubmVyRW5kID0gcHRcbiAgICBAZW5kID0gQGlubmVyRW5kICsgc3VmZml4TGVuXG4gIGNvcHk6IC0+XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKEBzdGFydCxAaW5uZXJTdGFydCxAaW5uZXJFbmQsQGVuZCkiLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5leHBvcnQgdmFyIFdyYXBwZWRQb3MgPSBjbGFzcyBXcmFwcGVkUG9zIGV4dGVuZHMgUG9zIHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGlubmVyU3RhcnQsIGlubmVyRW5kLCBlbmQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmlubmVyU3RhcnQgPSBpbm5lclN0YXJ0O1xuICAgIHRoaXMuaW5uZXJFbmQgPSBpbm5lckVuZDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQdChwdCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5pbm5lckVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQb3MocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmlubmVyRW5kO1xuICB9XG5cbiAgaW5uZXJUZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kKTtcbiAgfVxuXG4gIHNldElubmVyTGVuKGxlbikge1xuICAgIHJldHVybiB0aGlzLm1vdmVTdWZpeCh0aGlzLmlubmVyU3RhcnQgKyBsZW4pO1xuICB9XG5cbiAgbW92ZVN1ZmZpeChwdCkge1xuICAgIHZhciBzdWZmaXhMZW47XG4gICAgc3VmZml4TGVuID0gdGhpcy5lbmQgLSB0aGlzLmlubmVyRW5kO1xuICAgIHRoaXMuaW5uZXJFbmQgPSBwdDtcbiAgICByZXR1cm4gdGhpcy5lbmQgPSB0aGlzLmlubmVyRW5kICsgc3VmZml4TGVuO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICByZXR1cm4gbmV3IFdyYXBwZWRQb3ModGhpcy5zdGFydCwgdGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kLCB0aGlzLmVuZCk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCBjbGFzcyBXcmFwcGluZyBleHRlbmRzIFJlcGxhY2VtZW50XG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LCBAZW5kLCBwcmVmaXggPScnLCBzdWZmaXggPSAnJywgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBzdXBlcigpXG4gICAgQHNldE9wdHMoQG9wdGlvbnMpXG4gICAgQHRleHQgPSAnJ1xuICAgIEBwcmVmaXggPSBwcmVmaXhcbiAgICBAc3VmZml4ID0gc3VmZml4XG4gIGFwcGx5OiAtPlxuICAgIEBhZGp1c3RTZWwoKVxuICAgIHN1cGVyKClcbiAgYWRqdXN0U2VsOiAtPlxuICAgIG9mZnNldCA9IEBvcmlnaW5hbFRleHQoKS5sZW5ndGhcbiAgICBmb3Igc2VsIGluIEBzZWxlY3Rpb25zXG4gICAgICBpZiBzZWwuc3RhcnQgPiBAc3RhcnQrQHByZWZpeC5sZW5ndGhcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgaWYgc2VsLmVuZCA+PSBAc3RhcnQrQHByZWZpeC5sZW5ndGhcbiAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgZmluYWxUZXh0OiAtPlxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgdGV4dCA9IEBvcmlnaW5hbFRleHQoKVxuICAgIGVsc2VcbiAgICAgIHRleHQgPSAnJ1xuICAgIHJldHVybiBAcHJlZml4K3RleHQrQHN1ZmZpeFxuICBvZmZzZXRBZnRlcjogKCkgLT4gXG4gICAgcmV0dXJuIEBwcmVmaXgubGVuZ3RoK0BzdWZmaXgubGVuZ3RoXG4gICAgICAgICAgXG4gIGNvcHk6IC0+IFxuICAgIHJlcyA9IG5ldyBXcmFwcGluZyhAc3RhcnQsIEBlbmQsIEBwcmVmaXgsIEBzdWZmaXgpXG4gICAgcmVzLnNlbGVjdGlvbnMgPSBAc2VsZWN0aW9ucy5tYXAoIChzKS0+cy5jb3B5KCkgKVxuICAgIHJldHVybiByZXMiLCJpbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IHZhciBXcmFwcGluZyA9IGNsYXNzIFdyYXBwaW5nIGV4dGVuZHMgUmVwbGFjZW1lbnQge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgZW5kLCBwcmVmaXggPSAnJywgc3VmZml4ID0gJycsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy50ZXh0ID0gJyc7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXg7XG4gICAgdGhpcy5zdWZmaXggPSBzdWZmaXg7XG4gIH1cblxuICBhcHBseSgpIHtcbiAgICB0aGlzLmFkanVzdFNlbCgpO1xuICAgIHJldHVybiBzdXBlci5hcHBseSgpO1xuICB9XG5cbiAgYWRqdXN0U2VsKCkge1xuICAgIHZhciBpLCBsZW4sIG9mZnNldCwgcmVmLCByZXN1bHRzLCBzZWw7XG4gICAgb2Zmc2V0ID0gdGhpcy5vcmlnaW5hbFRleHQoKS5sZW5ndGg7XG4gICAgcmVmID0gdGhpcy5zZWxlY3Rpb25zO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNlbCA9IHJlZltpXTtcbiAgICAgIGlmIChzZWwuc3RhcnQgPiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXQ7XG4gICAgICB9XG4gICAgICBpZiAoc2VsLmVuZCA+PSB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChzZWwuZW5kICs9IG9mZnNldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBmaW5hbFRleHQoKSB7XG4gICAgdmFyIHRleHQ7XG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHRleHQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gJyc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRleHQgKyB0aGlzLnN1ZmZpeDtcbiAgfVxuXG4gIG9mZnNldEFmdGVyKCkge1xuICAgIHJldHVybiB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN1ZmZpeC5sZW5ndGg7XG4gIH1cblxuICBjb3B5KCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gbmV3IFdyYXBwaW5nKHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnByZWZpeCwgdGhpcy5zdWZmaXgpO1xuICAgIHJlcy5zZWxlY3Rpb25zID0gdGhpcy5zZWxlY3Rpb25zLm1hcChmdW5jdGlvbihzKSB7XG4gICAgICByZXR1cm4gcy5jb3B5KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlRW5naW5lXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBpZiBsb2NhbFN0b3JhZ2U/XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShAZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKVxuICBzYXZlSW5QYXRoOiAocGF0aCwga2V5LCB2YWwpIC0+XG4gICAgZGF0YSA9IEBsb2FkKHBhdGgpXG4gICAgdW5sZXNzIGRhdGE/XG4gICAgICBkYXRhID0ge31cbiAgICBkYXRhW2tleV0gPSB2YWxcbiAgICBAc2F2ZShwYXRoLGRhdGEpXG4gIGxvYWQ6IChrZXkpIC0+XG4gICAgaWYgbG9jYWxTdG9yYWdlP1xuICAgICAgSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShAZnVsbEtleShrZXkpKSlcbiAgZnVsbEtleTogKGtleSkgLT5cbiAgICAnQ29kZVdhdmVfJytrZXkiLCJleHBvcnQgdmFyIExvY2FsU3RvcmFnZUVuZ2luZSA9IGNsYXNzIExvY2FsU3RvcmFnZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBzYXZlKGtleSwgdmFsKSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5mdWxsS2V5KGtleSksIEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0gdGhpcy5sb2FkKHBhdGgpO1xuICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICB9XG4gICAgZGF0YVtrZXldID0gdmFsO1xuICAgIHJldHVybiB0aGlzLnNhdmUocGF0aCwgZGF0YSk7XG4gIH1cblxuICBsb2FkKGtleSkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5mdWxsS2V5KGtleSkpKTtcbiAgICB9XG4gIH1cblxuICBmdWxsS2V5KGtleSkge1xuICAgIHJldHVybiAnQ29kZVdhdmVfJyArIGtleTtcbiAgfVxuXG59O1xuIl19
