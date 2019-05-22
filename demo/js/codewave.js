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

},{"./helpers/ArrayHelper":24,"./helpers/StringHelper":28,"./positioning/Pair":29}],2:[function(require,module,exports){
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

},{"./helpers/OptionalPromise":27,"./positioning/Pos":31,"./positioning/PosCollection":32,"./positioning/Replacement":33}],3:[function(require,module,exports){
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
      var direct, fallback, j, k, l, len, len1, len2, len3, m, name, names, next, nexts, nspc, nspcName, posibilities, ref, ref1, ref2, rest, space;

      if (this.root == null) {
        return [];
      }

      this.root.init();
      posibilities = [];
      ref = this.getNamesWithPaths();

      for (space in ref) {
        names = ref[space];
        nexts = this.getCmdFollowAlias(space);

        for (j = 0, len = nexts.length; j < len; j++) {
          next = nexts[j];
          posibilities = posibilities.concat(new CmdFinder(names, {
            parent: this,
            root: next
          }).findPosibilities());
        }
      }

      ref1 = this.context.getNameSpaces();

      for (k = 0, len1 = ref1.length; k < len1; k++) {
        nspc = ref1[k];

        var _NamespaceHelper$Name7 = _NamespaceHelper.NamespaceHelper.splitFirst(nspc, true);

        var _NamespaceHelper$Name8 = _slicedToArray(_NamespaceHelper$Name7, 2);

        nspcName = _NamespaceHelper$Name8[0];
        rest = _NamespaceHelper$Name8[1];
        nexts = this.getCmdFollowAlias(nspcName);

        for (l = 0, len2 = nexts.length; l < len2; l++) {
          next = nexts[l];
          posibilities = posibilities.concat(new CmdFinder(this.applySpaceOnNames(nspc), {
            parent: this,
            root: next
          }).findPosibilities());
        }
      }

      ref2 = this.getDirectNames();

      for (m = 0, len3 = ref2.length; m < len3; m++) {
        name = ref2[m];
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

},{"./Command":6,"./Context":7,"./helpers/NamespaceHelper":26}],4:[function(require,module,exports){
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
      finder = this.getContext().getFinder(cmdName, this._getParentNamespaces());
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

},{"./Codewave":5,"./Context":7,"./TextParser":17,"./helpers/StringHelper":28}],5:[function(require,module,exports){
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
        if (this.isRoot) {
          return this;
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

},{"./ClosingPromp":2,"./Command":6,"./Context":7,"./Logger":11,"./PositionedCmdInstance":13,"./Process":14,"./TextParser":17,"./helpers/StringHelper":28,"./positioning/PosCollection":32}],6:[function(require,module,exports){
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
        replaceBox: false
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

},{"./Context":7,"./Storage":15,"./helpers/NamespaceHelper":26}],7:[function(require,module,exports){
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
      var nameSpaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var finder;
      finder = this.getFinder(cmdName, nameSpaces);
      return finder.find();
    }
  }, {
    key: "getFinder",
    value: function getFinder(cmdName) {
      var nameSpaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return new _CmdFinder.CmdFinder(cmdName, {
        namespaces: nameSpaces,
        useDetectors: this.isRoot(),
        codewave: this.codewave,
        parentContext: this
      });
    }
  }, {
    key: "isRoot",
    value: function isRoot() {
      return this.parent == null;
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

},{"./CmdFinder":3,"./CmdInstance":4,"./helpers/ArrayHelper":24}],8:[function(require,module,exports){
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

},{"./positioning/Pair":29}],9:[function(require,module,exports){
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

},{"./helpers/OptionalPromise":27,"./positioning/Pos":31,"./positioning/StrPos":35}],11:[function(require,module,exports){
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
        if (this.cmd != null) {
          allowedNamed = this.getOption('allowedNamed');
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
      finder = this.codewave.context.getFinder(cmdName, this._getParentNamespaces());
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

},{"./BoxHelper":1,"./CmdInstance":4,"./Command":6,"./helpers/NamespaceHelper":26,"./helpers/StringHelper":28,"./positioning/Pos":31,"./positioning/Replacement":33,"./positioning/StrPos":35}],14:[function(require,module,exports){
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

},{"./TextParser":17,"./positioning/Pos":31}],17:[function(require,module,exports){
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

},{"./Editor":10,"./positioning/Pos":31}],18:[function(require,module,exports){
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

var _Pos = require("./positioning/Pos");

var _WrappedPos = require("./positioning/WrappedPos");

var _LocalStorageEngine = require("./storageEngines/LocalStorageEngine");

_Pos.Pos.wrapClass = _WrappedPos.WrappedPos;
_Codewave.Codewave.instances = [];
_Command.Command.providers = [new _CoreCommandProvider.CoreCommandProvider(), new _JsCommandProvider.JsCommandProvider(), new _PhpCommandProvider.PhpCommandProvider(), new _HtmlCommandProvider.HtmlCommandProvider()];

if (typeof localStorage !== "undefined" && localStorage !== null) {
  _Command.Command.storage = new _LocalStorageEngine.LocalStorageEngine();
}

},{"./Codewave":5,"./Command":6,"./cmds/CoreCommandProvider":19,"./cmds/HtmlCommandProvider":20,"./cmds/JsCommandProvider":21,"./cmds/PhpCommandProvider":22,"./positioning/Pos":31,"./positioning/WrappedPos":36,"./storageEngines/LocalStorageEngine":38}],19:[function(require,module,exports){
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
exports.CoreCommandProvider = void 0;

var _Command = require("../Command");

var _Detector = require("../Detector");

var _BoxHelper = require("../BoxHelper");

var _EditCmdProp = require("../EditCmdProp");

var _StringHelper = require("../helpers/StringHelper");

var _Replacement = require("../positioning/Replacement");

var BoxCmd, CloseCmd, EditCmd, EmmetCmd, NameSpaceCmd, aliasCommand, exec_parent, getContent, getParam, no_execute, quote_carret, removeCommand, renameCommand;

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
          'result': "~~box~~\n~~quote_carret~~\n  ___         _   __      __\n / __|___  __| |__\\ \\    / /_ ___ ______\n/ /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/\n\\____\\___/\\__,_\\___|\\_/\\_/\\__,_|\\_/\\___|\nThe text editor helper\n~~/quote_carret~~\n\nWhen using Codewave you will be writing commands within \nyour text editor. These commands must be placed between two \npairs of \"~\" (tilde) and then, they can be executed by pressing \n\"ctrl\"+\"shift\"+\"e\", with your cursor inside the command\nEx: ~~!hello~~\n\nYou dont need to actually type any \"~\" (tilde). \nPressing \"ctrl\"+\"shift\"+\"e\" will add them if you are not already\nwithin a command.\n\nCodewave does not use UI to display any information. \nInstead, it uses text within code comments to mimic UIs. \nThe generated comment blocks will be referred to as windows \nin the help sections.\n\nTo close this window (i.e. remove this comment block), press \n\"ctrl\"+\"shift\"+\"e\" with your cursor on the line bellow.\n~~!close|~~\n\nUse the following command for a walkthrough of some of the many\nfeatures of Codewave\n~~!help:get_started~~ or ~~!help:demo~~\n\nList of all help subjects \n~~!help:subjects~~ or ~~!help:sub~~ \n\n~~!close~~\n~~/box~~",
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
            }
          }
        },
        'no_execute': {
          'result': no_execute
        },
        'escape_pipes': {
          'result': quote_carret,
          'checkCarret': false
        },
        'quote_carret': {
          'aliasOf': 'core:escape_pipes'
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
            'not_applicable': "~~box~~\nYou can only rename commands that you created yourself.\n~~!close|~~\n~~/box~~",
            'not_found': "~~box~~\nCommand not found\n~~!close|~~\n~~/box~~"
          },
          'result': renameCommand,
          'parse': true
        },
        'remove': {
          'cmds': {
            'not_applicable': "~~box~~\nYou can only remove commands that you created yourself.\n~~!close|~~\n~~/box~~",
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
    }
  }]);

  return CoreCommandProvider;
}();

exports.CoreCommandProvider = CoreCommandProvider;

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
      cmd = instance.context.getCmd(origninalName);

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
    name = instance.getParam([0, 'name']);

    if (name != null) {
      return Promise.resolve().then(function () {
        var savedCmds, storage;
        storage = _Command.Command.storage;
        return savedCmds = storage.load('cmds');
      }).then(function (savedCmds) {
        var cmd, cmdData;
        cmd = instance.context.getCmd(name);

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
        this.finder = this.instance.context.getFinder(this.cmdName);
        this.finder.useFallbacks = false;
        this.cmd = this.finder.find();
      }

      return this.editable = this.cmd != null ? this.cmd.isEditable() : true;
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      return {
        allowedNamed: ['cmd']
      };
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
  var i, len, p, ref;
  ref = EditCmd.props;

  for (i = 0, len = ref.length; i < len; i++) {
    p = ref[i];
    p.setCmd(base);
  }

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

EmmetCmd =
/*#__PURE__*/
function (_Command$BaseCommand5) {
  _inherits(EmmetCmd, _Command$BaseCommand5);

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

},{"../BoxHelper":1,"../Command":6,"../Detector":8,"../EditCmdProp":9,"../helpers/StringHelper":28,"../positioning/Replacement":33,"emmet":"emmet"}],20:[function(require,module,exports){
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

},{"../Command":6,"../Detector":8,"../helpers/StringHelper":28}],23:[function(require,module,exports){
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

},{"./TextAreaEditor":16,"./bootstrap":18}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"../positioning/Size":34}],29:[function(require,module,exports){
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

},{"../helpers/StringHelper":28,"./PairMatch":30,"./Pos":31}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{"../helpers/CommonHelper":25,"./Replacement":33,"./Wrapping":37}],33:[function(require,module,exports){
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

},{"../OptionObject":12,"../helpers/CommonHelper":25,"../helpers/StringHelper":28,"./Pos":31}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{"./Pos":31}],37:[function(require,module,exports){
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

},{"./Replacement":33}],38:[function(require,module,exports){
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

},{}]},{},[23])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvQm94SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9Cb3hIZWxwZXIuanMiLCIuLi9zcmMvQ2xvc2luZ1Byb21wLmNvZmZlZSIsIi4uL3NyYy9DbG9zaW5nUHJvbXAuanMiLCIuLi9zcmMvQ21kRmluZGVyLmNvZmZlZSIsIi4uL3NyYy9DbWRGaW5kZXIuanMiLCIuLi9zcmMvQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL0NtZEluc3RhbmNlLmpzIiwiLi4vc3JjL0NvZGV3YXZlLmNvZmZlZSIsIi4uL3NyYy9Db2Rld2F2ZS5qcyIsIi4uL3NyYy9Db21tYW5kLmNvZmZlZSIsIi4uL3NyYy9Db21tYW5kLmpzIiwiLi4vc3JjL0NvbnRleHQuY29mZmVlIiwiLi4vc3JjL0NvbnRleHQuanMiLCIuLi9zcmMvRGV0ZWN0b3IuY29mZmVlIiwiLi4vc3JjL0RldGVjdG9yLmpzIiwiLi4vc3JjL0VkaXRDbWRQcm9wLmNvZmZlZSIsIi4uL3NyYy9FZGl0Q21kUHJvcC5qcyIsIi4uL3NyYy9FZGl0b3IuY29mZmVlIiwiLi4vc3JjL0VkaXRvci5qcyIsIi4uL3NyYy9Mb2dnZXIuY29mZmVlIiwiLi4vc3JjL0xvZ2dlci5qcyIsIi4uL3NyYy9PcHRpb25PYmplY3QuY29mZmVlIiwiLi4vc3JjL09wdGlvbk9iamVjdC5qcyIsIi4uL3NyYy9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsIi4uL3NyYy9Qcm9jZXNzLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmpzIiwiLi4vc3JjL1RleHRBcmVhRWRpdG9yLmNvZmZlZSIsIi4uL3NyYy9UZXh0QXJlYUVkaXRvci5qcyIsIi4uL3NyYy9UZXh0UGFyc2VyLmNvZmZlZSIsIi4uL3NyYy9UZXh0UGFyc2VyLmpzIiwiLi4vc3JjL2Jvb3RzdHJhcC5jb2ZmZWUiLCIuLi9zcmMvYm9vdHN0cmFwLmpzIiwiLi4vc3JjL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9QaHBDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2VudHJ5LmNvZmZlZSIsIi4uL3NyYy9lbnRyeS5qcyIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvQ29tbW9uSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0NvbW1vbkhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL05hbWVzcGFjZUhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCIuLi9zcmMvaGVscGVycy9PcHRpb25hbFByb21pc2UuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlLmpzIiwiLi4vc3JjL2hlbHBlcnMvU3RyaW5nSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL1N0cmluZ0hlbHBlci5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1BhaXJNYXRjaC5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1NpemUuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1N0clBvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvV3JhcHBpbmcuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwaW5nLmpzIiwiLi4vc3JjL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZS5jb2ZmZWUiLCIuLi9zcmMvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSx1QkFBQSxDQUFBOztBQUNBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxvQkFBQSxDQUFBOztBQUVBLElBQWEsU0FBTjtBQUFBO0FBQUE7QUFDTCxxQkFBYSxPQUFiLEVBQWE7QUFBQSxRQUFXLE9BQVgsdUVBQUEsRUFBQTs7QUFBQTs7QUFDWCxRQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQURZLFNBQUEsT0FBQSxHQUFBLE9BQUE7QUFDWixTQUFBLFFBQUEsR0FBWTtBQUNWLE1BQUEsSUFBQSxFQUFNLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FESSxJ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QyxDQUFwQyxDQ0FBO0FBQ0Q7QURIRztBQUZEO0FBQUE7QUFBQSwrQkFLTyxJQUxQLEVBS08sR0FMUCxFQUtPLEdBTFAsRUFLTztBQUNWLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLEtBQUEsSUFBQSxDQUFQLElBQU8sQ0FBUDs7QUFDQSxVQUFPLElBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBQSxFQUFBO0FDS0Q7O0FESkQsTUFBQSxJQUFLLENBQUwsR0FBSyxDQUFMLEdBQUEsR0FBQTtBQ01BLGFETEEsS0FBQSxJQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsQ0NLQTtBRFZVO0FBTFA7QUFBQTtBQUFBLHlCQVdDLEdBWEQsRUFXQztBQUNKLFVBQUcsT0FBQSxZQUFBLEtBQUEsV0FBQSxJQUFBLFlBQUEsS0FBSCxJQUFBLEVBQUE7QUNRRSxlRFBBLElBQUksQ0FBSixLQUFBLENBQVcsWUFBWSxDQUFaLE9BQUEsQ0FBcUIsS0FBQSxPQUFBLENBQWhDLEdBQWdDLENBQXJCLENBQVgsQ0NPQTtBQUNEO0FEVkc7QUFYRDtBQUFBO0FBQUEsNEJBY0ksR0FkSixFQWNJO0FDV1AsYURWQSxjQUFZLEdDVVo7QURYTztBQWRKOztBQUFBO0FBQUEsR0FBUCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuaW1wb3J0IHsgUGFpciB9IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCBjbGFzcyBCb3hIZWxwZXJcbiAgY29uc3RydWN0b3I6IChAY29udGV4dCwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIEBkZWZhdWx0cyA9IHtcbiAgICAgIGRlY286IEBjb250ZXh0LmNvZGV3YXZlLmRlY29cbiAgICAgIHBhZDogMlxuICAgICAgd2lkdGg6IDUwXG4gICAgICBoZWlnaHQ6IDNcbiAgICAgIG9wZW5UZXh0OiAnJ1xuICAgICAgY2xvc2VUZXh0OiAnJ1xuICAgICAgcHJlZml4OiAnJ1xuICAgICAgc3VmZml4OiAnJ1xuICAgICAgaW5kZW50OiAwXG4gICAgfVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgY2xvbmU6ICh0ZXh0KSAtPlxuICAgIG9wdCA9IHt9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgb3B0W2tleV0gPSB0aGlzW2tleV1cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcihAY29udGV4dCxvcHQpXG4gIGRyYXc6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAc3RhcnRTZXAoKSArIFwiXFxuXCIgKyBAbGluZXModGV4dCkgKyBcIlxcblwiKyBAZW5kU2VwKClcbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LndyYXBDb21tZW50KHN0cilcbiAgc2VwYXJhdG9yOiAtPlxuICAgIGxlbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGRlY29MaW5lKGxlbikpXG4gIHN0YXJ0U2VwOiAtPlxuICAgIGxuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoIC0gQG9wZW5UZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAcHJlZml4ICsgQHdyYXBDb21tZW50KEBvcGVuVGV4dCtAZGVjb0xpbmUobG4pKVxuICBlbmRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAY2xvc2VUZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGNsb3NlVGV4dCtAZGVjb0xpbmUobG4pKSArIEBzdWZmaXhcbiAgZGVjb0xpbmU6IChsZW4pIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChAZGVjbywgbGVuKVxuICBwYWRkaW5nOiAtPiBcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCBAcGFkKVxuICBsaW5lczogKHRleHQgPSAnJywgdXB0b0hlaWdodD10cnVlKSAtPlxuICAgIHRleHQgPSB0ZXh0IG9yICcnXG4gICAgbGluZXMgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIilcbiAgICBpZiB1cHRvSGVpZ2h0XG4gICAgICByZXR1cm4gKEBsaW5lKGxpbmVzW3hdIG9yICcnKSBmb3IgeCBpbiBbMC4uQGhlaWdodF0pLmpvaW4oJ1xcbicpIFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoQGxpbmUobCkgZm9yIGwgaW4gbGluZXMpLmpvaW4oJ1xcbicpIFxuICBsaW5lOiAodGV4dCA9ICcnKSAtPlxuICAgIHJldHVybiAoU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLEBpbmRlbnQpICtcbiAgICAgIEB3cmFwQ29tbWVudChcbiAgICAgICAgQGRlY28gK1xuICAgICAgICBAcGFkZGluZygpICtcbiAgICAgICAgdGV4dCArXG4gICAgICAgIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgQHdpZHRoIC0gQHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyBcbiAgICAgICAgQHBhZGRpbmcoKSArXG4gICAgICAgIEBkZWNvXG4gICAgICApKVxuICBsZWZ0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50TGVmdChAZGVjbyArIEBwYWRkaW5nKCkpXG4gIHJpZ2h0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQHBhZGRpbmcoKSArIEBkZWNvKVxuICByZW1vdmVJZ25vcmVkQ29udGVudDogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnMoQGNvbnRleHQuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHRleHQpKVxuICB0ZXh0Qm91bmRzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldFR4dFNpemUoQHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpKVxuICBnZXRCb3hGb3JQb3M6IChwb3MpIC0+XG4gICAgZGVwdGggPSBAZ2V0TmVzdGVkTHZsKHBvcy5zdGFydClcbiAgICBpZiBkZXB0aCA+IDBcbiAgICAgIGxlZnQgPSBAbGVmdCgpXG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LGRlcHRoLTEpXG4gICAgICBcbiAgICAgIGNsb25lID0gQGNsb25lKClcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiXG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aFxuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSBAZGVjbyArIEBkZWNvICsgcGxhY2Vob2xkZXIgKyBAZGVjbyArIEBkZWNvXG4gICAgICBcbiAgICAgIHN0YXJ0RmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwnLionKSlcbiAgICAgIFxuICAgICAgcGFpciA9IG5ldyBQYWlyKHN0YXJ0RmluZCxlbmRGaW5kLHtcbiAgICAgICAgdmFsaWRNYXRjaDogKG1hdGNoKT0+XG4gICAgICAgICAgIyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuICAgICAgICAgIGYgPSBAY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKVxuICAgICAgICAgIHJldHVybiAhZj8gb3IgZi5zdHIgIT0gbGVmdFxuICAgICAgfSlcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsQGNvbnRleHQuY29kZXdhdmUuZWRpdG9yLnRleHQoKSlcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgcmVzLnN0YXJ0ICs9IGN1ckxlZnQubGVuZ3RoXG4gICAgICAgIHJldHVybiByZXNcbiAgICBcbiAgZ2V0TmVzdGVkTHZsOiAoaW5kZXgpIC0+XG4gICAgZGVwdGggPSAwXG4gICAgbGVmdCA9IEBsZWZ0KClcbiAgICB3aGlsZSAoZiA9IEBjb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KGluZGV4ICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKSk/ICYmIGYuc3RyID09IGxlZnRcbiAgICAgIGluZGV4ID0gZi5wb3NcbiAgICAgIGRlcHRoKytcbiAgICByZXR1cm4gZGVwdGhcbiAgZ2V0T3B0RnJvbUxpbmU6IChsaW5lLGdldFBhZD10cnVlKSAtPlxuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdChAZGVjbykpK1wiKShcXFxccyopXCIpXG4gICAgckVuZCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQGRlY28pKStcIikoXFxufCQpXCIpXG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKVxuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKVxuICAgIGlmIHJlc1N0YXJ0PyBhbmQgcmVzRW5kP1xuICAgICAgaWYgZ2V0UGFkXG4gICAgICAgIEBwYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgscmVzRW5kWzFdLmxlbmd0aClcbiAgICAgIEBpbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGhcbiAgICAgIHN0YXJ0UG9zID0gcmVzU3RhcnQuaW5kZXggKyByZXNTdGFydFsxXS5sZW5ndGggKyByZXNTdGFydFsyXS5sZW5ndGggKyBAcGFkXG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gQHBhZFxuICAgICAgQHdpZHRoID0gZW5kUG9zIC0gc3RhcnRQb3NcbiAgICByZXR1cm4gdGhpc1xuICByZWZvcm1hdExpbmVzOiAodGV4dCxvcHRpb25zPXt9KSAtPlxuICAgIHJldHVybiBAbGluZXMoQHJlbW92ZUNvbW1lbnQodGV4dCxvcHRpb25zKSxmYWxzZSlcbiAgcmVtb3ZlQ29tbWVudDogKHRleHQsb3B0aW9ucz17fSktPlxuICAgIGlmIHRleHQ/XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgbXVsdGlsaW5lOiB0cnVlXG4gICAgICB9XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LGRlZmF1bHRzLG9wdGlvbnMpXG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdCgpKVxuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpXG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGRlY28pXG4gICAgICBmbGFnID0gaWYgb3B0aW9uc1snbXVsdGlsaW5lJ10gdGhlbiAnZ20nIGVsc2UgJydcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzezAsI3tAcGFkfX1cIiwgZmxhZylcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoXCJcXFxccyooPzoje2VkfSkqI3tlY3J9XFxcXHMqJFwiLCBmbGFnKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsJycpLnJlcGxhY2UocmUyLCcnKVxuICAgXG4gICIsImltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQXJyYXlIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcblxuaW1wb3J0IHtcbiAgUGFpclxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgdmFyIEJveEhlbHBlciA9IGNsYXNzIEJveEhlbHBlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBrZXksIHJlZiwgdmFsO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIGRlY286IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5kZWNvLFxuICAgICAgcGFkOiAyLFxuICAgICAgd2lkdGg6IDUwLFxuICAgICAgaGVpZ2h0OiAzLFxuICAgICAgb3BlblRleHQ6ICcnLFxuICAgICAgY2xvc2VUZXh0OiAnJyxcbiAgICAgIHByZWZpeDogJycsXG4gICAgICBzdWZmaXg6ICcnLFxuICAgICAgaW5kZW50OiAwXG4gICAgfTtcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsb25lKHRleHQpIHtcbiAgICB2YXIga2V5LCBvcHQsIHJlZiwgdmFsO1xuICAgIG9wdCA9IHt9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIG9wdFtrZXldID0gdGhpc1trZXldO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQsIG9wdCk7XG4gIH1cblxuICBkcmF3KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydFNlcCgpICsgXCJcXG5cIiArIHRoaXMubGluZXModGV4dCkgKyBcIlxcblwiICsgdGhpcy5lbmRTZXAoKTtcbiAgfVxuXG4gIHdyYXBDb21tZW50KHN0cikge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnQoc3RyKTtcbiAgfVxuXG4gIHNlcGFyYXRvcigpIHtcbiAgICB2YXIgbGVuO1xuICAgIGxlbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmRlY29MaW5lKGxlbikpO1xuICB9XG5cbiAgc3RhcnRTZXAoKSB7XG4gICAgdmFyIGxuO1xuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5vcGVuVGV4dC5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy53cmFwQ29tbWVudCh0aGlzLm9wZW5UZXh0ICsgdGhpcy5kZWNvTGluZShsbikpO1xuICB9XG5cbiAgZW5kU2VwKCkge1xuICAgIHZhciBsbjtcbiAgICBsbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aCAtIHRoaXMuY2xvc2VUZXh0Lmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmNsb3NlVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKSArIHRoaXMuc3VmZml4O1xuICB9XG5cbiAgZGVjb0xpbmUobGVuKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCh0aGlzLmRlY28sIGxlbik7XG4gIH1cblxuICBwYWRkaW5nKCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMucGFkKTtcbiAgfVxuXG4gIGxpbmVzKHRleHQgPSAnJywgdXB0b0hlaWdodCA9IHRydWUpIHtcbiAgICB2YXIgbCwgbGluZXMsIHg7XG4gICAgdGV4dCA9IHRleHQgfHwgJyc7XG4gICAgbGluZXMgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIik7XG4gICAgaWYgKHVwdG9IZWlnaHQpIHtcbiAgICAgIHJldHVybiAoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSwgcmVmLCByZXN1bHRzO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoeCA9IGkgPSAwLCByZWYgPSB0aGlzLmhlaWdodDsgKDAgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZik7IHggPSAwIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobGluZXNbeF0gfHwgJycpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pLmNhbGwodGhpcykpLmpvaW4oJ1xcbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGksIGxlbjEsIHJlc3VsdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuMSA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICAgIGwgPSBsaW5lc1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5saW5lKGwpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pLmNhbGwodGhpcykpLmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgfVxuXG4gIGxpbmUodGV4dCA9ICcnKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy5pbmRlbnQpICsgdGhpcy53cmFwQ29tbWVudCh0aGlzLmRlY28gKyB0aGlzLnBhZGRpbmcoKSArIHRleHQgKyBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMud2lkdGggLSB0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyB0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbyk7XG4gIH1cblxuICBsZWZ0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpKTtcbiAgfVxuXG4gIHJpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbyk7XG4gIH1cblxuICByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpO1xuICB9XG5cbiAgdGV4dEJvdW5kcyh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRUeHRTaXplKHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpO1xuICB9XG5cbiAgZ2V0Qm94Rm9yUG9zKHBvcykge1xuICAgIHZhciBjbG9uZSwgY3VyTGVmdCwgZGVwdGgsIGVuZEZpbmQsIGxlZnQsIHBhaXIsIHBsYWNlaG9sZGVyLCByZXMsIHN0YXJ0RmluZDtcbiAgICBkZXB0aCA9IHRoaXMuZ2V0TmVzdGVkTHZsKHBvcy5zdGFydCk7XG4gICAgaWYgKGRlcHRoID4gMCkge1xuICAgICAgbGVmdCA9IHRoaXMubGVmdCgpO1xuICAgICAgY3VyTGVmdCA9IFN0cmluZ0hlbHBlci5yZXBlYXQobGVmdCwgZGVwdGggLSAxKTtcbiAgICAgIGNsb25lID0gdGhpcy5jbG9uZSgpO1xuICAgICAgcGxhY2Vob2xkZXIgPSBcIiMjI1BsYWNlSG9sZGVyIyMjXCI7XG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aDtcbiAgICAgIGNsb25lLm9wZW5UZXh0ID0gY2xvbmUuY2xvc2VUZXh0ID0gdGhpcy5kZWNvICsgdGhpcy5kZWNvICsgcGxhY2Vob2xkZXIgKyB0aGlzLmRlY28gKyB0aGlzLmRlY287XG4gICAgICBzdGFydEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuc3RhcnRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwgJy4qJykpO1xuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwgJy4qJykpO1xuICAgICAgcGFpciA9IG5ldyBQYWlyKHN0YXJ0RmluZCwgZW5kRmluZCwge1xuICAgICAgICB2YWxpZE1hdGNoOiAobWF0Y2gpID0+IHtcbiAgICAgICAgICB2YXIgZjtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuICAgICAgICAgIGYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQobWF0Y2guc3RhcnQoKSwgW2xlZnQsIFwiXFxuXCIsIFwiXFxyXCJdLCAtMSk7XG4gICAgICAgICAgcmV0dXJuIChmID09IG51bGwpIHx8IGYuc3RyICE9PSBsZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKTtcbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGg7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TmVzdGVkTHZsKGluZGV4KSB7XG4gICAgdmFyIGRlcHRoLCBmLCBsZWZ0O1xuICAgIGRlcHRoID0gMDtcbiAgICBsZWZ0ID0gdGhpcy5sZWZ0KCk7XG4gICAgd2hpbGUgKCgoZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCwgW2xlZnQsIFwiXFxuXCIsIFwiXFxyXCJdLCAtMSkpICE9IG51bGwpICYmIGYuc3RyID09PSBsZWZ0KSB7XG4gICAgICBpbmRleCA9IGYucG9zO1xuICAgICAgZGVwdGgrKztcbiAgICB9XG4gICAgcmV0dXJuIGRlcHRoO1xuICB9XG5cbiAgZ2V0T3B0RnJvbUxpbmUobGluZSwgZ2V0UGFkID0gdHJ1ZSkge1xuICAgIHZhciBlbmRQb3MsIHJFbmQsIHJTdGFydCwgcmVzRW5kLCByZXNTdGFydCwgc3RhcnRQb3M7XG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbykpICsgXCIpKFxcXFxzKilcIik7XG4gICAgckVuZCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQodGhpcy5kZWNvKSkgKyBcIikoXFxufCQpXCIpO1xuICAgIHJlc1N0YXJ0ID0gclN0YXJ0LmV4ZWMobGluZSk7XG4gICAgcmVzRW5kID0gckVuZC5leGVjKGxpbmUpO1xuICAgIGlmICgocmVzU3RhcnQgIT0gbnVsbCkgJiYgKHJlc0VuZCAhPSBudWxsKSkge1xuICAgICAgaWYgKGdldFBhZCkge1xuICAgICAgICB0aGlzLnBhZCA9IE1hdGgubWluKHJlc1N0YXJ0WzNdLmxlbmd0aCwgcmVzRW5kWzFdLmxlbmd0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmluZGVudCA9IHJlc1N0YXJ0WzFdLmxlbmd0aDtcbiAgICAgIHN0YXJ0UG9zID0gcmVzU3RhcnQuaW5kZXggKyByZXNTdGFydFsxXS5sZW5ndGggKyByZXNTdGFydFsyXS5sZW5ndGggKyB0aGlzLnBhZDtcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSB0aGlzLnBhZDtcbiAgICAgIHRoaXMud2lkdGggPSBlbmRQb3MgLSBzdGFydFBvcztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWZvcm1hdExpbmVzKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzKHRoaXMucmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zKSwgZmFsc2UpO1xuICB9XG5cbiAgcmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGVjbCwgZWNyLCBlZCwgZmxhZywgb3B0LCByZTEsIHJlMjtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgbXVsdGlsaW5lOiB0cnVlXG4gICAgICB9O1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpO1xuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKTtcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmRlY28pO1xuICAgICAgZmxhZyA9IG9wdGlvbnNbJ211bHRpbGluZSddID8gJ2dtJyA6ICcnO1xuICAgICAgcmUxID0gbmV3IFJlZ0V4cChgXlxcXFxzKiR7ZWNsfSg/OiR7ZWR9KSpcXFxcc3swLCR7dGhpcy5wYWR9fWAsIGZsYWcpO1xuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxcXFxzKiRgLCBmbGFnKTtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmUxLCAnJykucmVwbGFjZShyZTIsICcnKTtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvc0NvbGxlY3Rpb24gfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IG9wdGlvbmFsUHJvbWlzZSB9IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgY2xhc3MgQ2xvc2luZ1Byb21wXG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlLHNlbGVjdGlvbnMpIC0+XG4gICAgQHRpbWVvdXQgPSBudWxsXG4gICAgQF90eXBlZCA9IG51bGxcbiAgICBAc3RhcnRlZCA9IGZhbHNlXG4gICAgQG5iQ2hhbmdlcyA9IDBcbiAgICBAc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uKHNlbGVjdGlvbnMpXG4gIGJlZ2luOiAtPlxuICAgIEBzdGFydGVkID0gdHJ1ZVxuICAgIG9wdGlvbmFsUHJvbWlzZShAYWRkQ2FycmV0cygpKS50aGVuID0+XG4gICAgICBpZiBAY29kZXdhdmUuZWRpdG9yLmNhbkxpc3RlblRvQ2hhbmdlKClcbiAgICAgICAgQHByb3h5T25DaGFuZ2UgPSAoY2g9bnVsbCk9PiBAb25DaGFuZ2UoY2gpXG4gICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuYWRkQ2hhbmdlTGlzdGVuZXIoIEBwcm94eU9uQ2hhbmdlIClcbiAgICAgIHJldHVybiB0aGlzXG4gICAgLnJlc3VsdCgpXG4gIGFkZENhcnJldHM6IC0+XG4gICAgQHJlcGxhY2VtZW50cyA9IEBzZWxlY3Rpb25zLndyYXAoXG4gICAgICBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jYXJyZXRDaGFyICsgQGNvZGV3YXZlLmJyYWtldHMgKyBcIlxcblwiLFxuICAgICAgXCJcXG5cIiArIEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjb2Rld2F2ZS5jYXJyZXRDaGFyICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICApLm1hcCggKHApIC0+IHAuY2FycmV0VG9TZWwoKSApXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhAcmVwbGFjZW1lbnRzKVxuICBpbnZhbGlkVHlwZWQ6IC0+XG4gICAgQF90eXBlZCA9IG51bGxcbiAgb25DaGFuZ2U6IChjaCA9IG51bGwpLT5cbiAgICBAaW52YWxpZFR5cGVkKClcbiAgICBpZiBAc2tpcEV2ZW50KGNoKVxuICAgICAgcmV0dXJuXG4gICAgQG5iQ2hhbmdlcysrXG4gICAgaWYgQHNob3VsZFN0b3AoKVxuICAgICAgQHN0b3AoKVxuICAgICAgQGNsZWFuQ2xvc2UoKVxuICAgIGVsc2VcbiAgICAgIEByZXN1bWUoKVxuICAgICAgXG4gIHNraXBFdmVudDogKGNoKSAtPlxuICAgIHJldHVybiBjaD8gYW5kIGNoLmNoYXJDb2RlQXQoMCkgIT0gMzJcbiAgXG4gIHJlc3VtZTogLT5cbiAgICAjXG4gICAgXG4gIHNob3VsZFN0b3A6IC0+XG4gICAgcmV0dXJuIEB0eXBlZCgpID09IGZhbHNlIG9yIEB0eXBlZCgpLmluZGV4T2YoJyAnKSAhPSAtMVxuICBcbiAgY2xlYW5DbG9zZTogLT5cbiAgICByZXBsYWNlbWVudHMgPSBbXVxuICAgIHNlbGVjdGlvbnMgPSBAZ2V0U2VsZWN0aW9ucygpXG4gICAgZm9yIHNlbCBpbiBzZWxlY3Rpb25zXG4gICAgICBpZiBwb3MgPSBAd2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgICBzdGFydCA9IHNlbFxuICAgICAgZWxzZSBpZiAoZW5kID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSBhbmQgc3RhcnQ/XG4gICAgICAgIHJlcyA9IGVuZC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLmlubmVyVGV4dCgpLnNwbGl0KCcgJylbMF1cbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChlbmQuaW5uZXJTdGFydCxlbmQuaW5uZXJFbmQscmVzKVxuICAgICAgICByZXBsLnNlbGVjdGlvbnMgPSBbc3RhcnRdXG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKHJlcGwpXG4gICAgICAgIHN0YXJ0ID0gbnVsbFxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICBnZXRTZWxlY3Rpb25zOiAtPlxuICAgIHJldHVybiBAY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKClcbiAgc3RvcDogLT5cbiAgICBAc3RhcnRlZCA9IGZhbHNlXG4gICAgY2xlYXJUaW1lb3V0KEB0aW1lb3V0KSBpZiBAdGltZW91dD9cbiAgICBAY29kZXdhdmUuY2xvc2luZ1Byb21wID0gbnVsbCBpZiBAY29kZXdhdmUuY2xvc2luZ1Byb21wID09IHRoaXNcbiAgICBpZiBAcHJveHlPbkNoYW5nZT9cbiAgICAgIEBjb2Rld2F2ZS5lZGl0b3IucmVtb3ZlQ2hhbmdlTGlzdGVuZXIoQHByb3h5T25DaGFuZ2UpXG4gIGNhbmNlbDogLT5cbiAgICBpZiBAdHlwZWQoKSAhPSBmYWxzZVxuICAgICAgQGNhbmNlbFNlbGVjdGlvbnMoQGdldFNlbGVjdGlvbnMoKSlcbiAgICBAc3RvcCgpXG4gIGNhbmNlbFNlbGVjdGlvbnM6IChzZWxlY3Rpb25zKSAtPlxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc3RhcnQgPSBudWxsXG4gICAgZm9yIHNlbCBpbiBzZWxlY3Rpb25zXG4gICAgICBpZiBwb3MgPSBAd2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgICBzdGFydCA9IHBvc1xuICAgICAgZWxzZSBpZiAoZW5kID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSBhbmQgc3RhcnQ/XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ldyBSZXBsYWNlbWVudChzdGFydC5zdGFydCxlbmQuZW5kLEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihzdGFydC5lbmQrMSwgZW5kLnN0YXJ0LTEpKS5zZWxlY3RDb250ZW50KCkpXG4gICAgICAgIHN0YXJ0ID0gbnVsbFxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB0eXBlZDogLT5cbiAgICB1bmxlc3MgQF90eXBlZD9cbiAgICAgIGNwb3MgPSBAY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpXG4gICAgICBpbm5lclN0YXJ0ID0gQHJlcGxhY2VtZW50c1swXS5zdGFydCArIEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aFxuICAgICAgaWYgQGNvZGV3YXZlLmZpbmRQcmV2QnJha2V0KGNwb3Muc3RhcnQpID09IEByZXBsYWNlbWVudHNbMF0uc3RhcnQgYW5kIChpbm5lckVuZCA9IEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChpbm5lclN0YXJ0KSk/IGFuZCBpbm5lckVuZCA+PSBjcG9zLmVuZFxuICAgICAgICBAX3R5cGVkID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGlubmVyU3RhcnQsIGlubmVyRW5kKVxuICAgICAgZWxzZVxuICAgICAgICBAX3R5cGVkID0gZmFsc2VcbiAgICByZXR1cm4gQF90eXBlZFxuICB3aGl0aGluT3BlbkJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAc3RhcnRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT0gdGFyZ2V0VGV4dFxuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG4gIHdoaXRoaW5DbG9zZUJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAZW5kUG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PSB0YXJnZXRUZXh0XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcbiAgc3RhcnRQb3NBdDogKGluZGV4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zKFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLnN0YXJ0ICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIpLFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsxKVxuICAgICAgKS53cmFwcGVkQnkoQGNvZGV3YXZlLmJyYWtldHMsIEBjb2Rld2F2ZS5icmFrZXRzKVxuICBlbmRQb3NBdDogKGluZGV4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zKFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzEpLFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLmVuZCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsyKVxuICAgICAgKS53cmFwcGVkQnkoQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyLCBAY29kZXdhdmUuYnJha2V0cylcblxuZXhwb3J0IGNsYXNzIFNpbXVsYXRlZENsb3NpbmdQcm9tcCBleHRlbmRzIENsb3NpbmdQcm9tcFxuICByZXN1bWU6IC0+XG4gICAgQHNpbXVsYXRlVHlwZSgpXG4gIHNpbXVsYXRlVHlwZTogLT5cbiAgICBjbGVhclRpbWVvdXQoQHRpbWVvdXQpIGlmIEB0aW1lb3V0P1xuICAgIEB0aW1lb3V0ID0gc2V0VGltZW91dCAoPT5cbiAgICAgIEBpbnZhbGlkVHlwZWQoKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGN1ckNsb3NlID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhAcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0uY29weSgpLmFwcGx5T2Zmc2V0KEB0eXBlZCgpLmxlbmd0aCkpXG4gICAgICBpZiBjdXJDbG9zZVxuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LGN1ckNsb3NlLmVuZCx0YXJnZXRUZXh0KVxuICAgICAgICBpZiByZXBsLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KClcbiAgICAgICAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKFtyZXBsXSlcbiAgICAgIGVsc2VcbiAgICAgICAgQHN0b3AoKVxuICAgICAgQG9uVHlwZVNpbXVsYXRlZCgpIGlmIEBvblR5cGVTaW11bGF0ZWQ/XG4gICAgKSwgMlxuICBza2lwRXZlbnQ6IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldFNlbGVjdGlvbnM6IC0+XG4gICAgcmV0dXJuIFtcbiAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKVxuICAgICAgICBAcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0gKyBAdHlwZWQoKS5sZW5ndGhcbiAgICAgIF1cbiAgd2hpdGhpbkNsb3NlQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBlbmRQb3NBdChpKVxuICAgICAgbmV4dCA9IEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldCh0YXJnZXRQb3MuaW5uZXJTdGFydClcbiAgICAgIGlmIG5leHQ/XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpXG4gICAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG5cbkNsb3NpbmdQcm9tcC5uZXdGb3IgPSAoY29kZXdhdmUsc2VsZWN0aW9ucykgLT5cbiAgaWYgY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLHNlbGVjdGlvbnMpXG4gIGVsc2VcbiAgICByZXR1cm4gbmV3IFNpbXVsYXRlZENsb3NpbmdQcm9tcChjb2Rld2F2ZSxzZWxlY3Rpb25zKSIsImltcG9ydCB7XG4gIFBvc0NvbGxlY3Rpb25cbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIG9wdGlvbmFsUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IHZhciBDbG9zaW5nUHJvbXAgPSBjbGFzcyBDbG9zaW5nUHJvbXAge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZTEsIHNlbGVjdGlvbnMpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmUxO1xuICAgIHRoaXMudGltZW91dCA9IG51bGw7XG4gICAgdGhpcy5fdHlwZWQgPSBudWxsO1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMubmJDaGFuZ2VzID0gMDtcbiAgICB0aGlzLnNlbGVjdGlvbnMgPSBuZXcgUG9zQ29sbGVjdGlvbihzZWxlY3Rpb25zKTtcbiAgfVxuXG4gIGJlZ2luKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgcmV0dXJuIG9wdGlvbmFsUHJvbWlzZSh0aGlzLmFkZENhcnJldHMoKSkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKSkge1xuICAgICAgICB0aGlzLnByb3h5T25DaGFuZ2UgPSAoY2ggPSBudWxsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25DaGFuZ2UoY2gpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkucmVzdWx0KCk7XG4gIH1cblxuICBhZGRDYXJyZXRzKCkge1xuICAgIHRoaXMucmVwbGFjZW1lbnRzID0gdGhpcy5zZWxlY3Rpb25zLndyYXAodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgXCJcXG5cIiwgXCJcXG5cIiArIHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKS5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHAuY2FycmV0VG9TZWwoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHModGhpcy5yZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgaW52YWxpZFR5cGVkKCkge1xuICAgIHJldHVybiB0aGlzLl90eXBlZCA9IG51bGw7XG4gIH1cblxuICBvbkNoYW5nZShjaCA9IG51bGwpIHtcbiAgICB0aGlzLmludmFsaWRUeXBlZCgpO1xuICAgIGlmICh0aGlzLnNraXBFdmVudChjaCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5uYkNoYW5nZXMrKztcbiAgICBpZiAodGhpcy5zaG91bGRTdG9wKCkpIHtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYW5DbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bWUoKTtcbiAgICB9XG4gIH1cblxuICBza2lwRXZlbnQoY2gpIHtcbiAgICByZXR1cm4gKGNoICE9IG51bGwpICYmIGNoLmNoYXJDb2RlQXQoMCkgIT09IDMyO1xuICB9XG5cbiAgcmVzdW1lKCkge31cblxuICBcbiAgc2hvdWxkU3RvcCgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlZCgpID09PSBmYWxzZSB8fCB0aGlzLnR5cGVkKCkuaW5kZXhPZignICcpICE9PSAtMTtcbiAgfVxuXG4gIGNsZWFuQ2xvc2UoKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCBwb3MsIHJlcGwsIHJlcGxhY2VtZW50cywgcmVzLCBzZWwsIHNlbGVjdGlvbnMsIHN0YXJ0O1xuICAgIHJlcGxhY2VtZW50cyA9IFtdO1xuICAgIHNlbGVjdGlvbnMgPSB0aGlzLmdldFNlbGVjdGlvbnMoKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdO1xuICAgICAgaWYgKHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKSkge1xuICAgICAgICBzdGFydCA9IHNlbDtcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIChzdGFydCAhPSBudWxsKSkge1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXTtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChlbmQuaW5uZXJTdGFydCwgZW5kLmlubmVyRW5kLCByZXMpO1xuICAgICAgICByZXBsLnNlbGVjdGlvbnMgPSBbc3RhcnRdO1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKTtcbiAgICAgICAgc3RhcnQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9PT0gdGhpcykge1xuICAgICAgdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm94eU9uQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy50eXBlZCgpICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jYW5jZWxTZWxlY3Rpb25zKHRoaXMuZ2V0U2VsZWN0aW9ucygpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgY2FuY2VsU2VsZWN0aW9ucyhzZWxlY3Rpb25zKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCBwb3MsIHJlcGxhY2VtZW50cywgc2VsLCBzdGFydDtcbiAgICByZXBsYWNlbWVudHMgPSBbXTtcbiAgICBzdGFydCA9IG51bGw7XG4gICAgZm9yIChqID0gMCwgbGVuID0gc2VsZWN0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgc2VsID0gc2VsZWN0aW9uc1tqXTtcbiAgICAgIGlmIChwb3MgPSB0aGlzLndoaXRoaW5PcGVuQm91bmRzKHNlbCkpIHtcbiAgICAgICAgc3RhcnQgPSBwb3M7XG4gICAgICB9IGVsc2UgaWYgKChlbmQgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSAmJiAoc3RhcnQgIT0gbnVsbCkpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3IFJlcGxhY2VtZW50KHN0YXJ0LnN0YXJ0LCBlbmQuZW5kLCB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHN0YXJ0LmVuZCArIDEsIGVuZC5zdGFydCAtIDEpKS5zZWxlY3RDb250ZW50KCkpO1xuICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgdHlwZWQoKSB7XG4gICAgdmFyIGNwb3MsIGlubmVyRW5kLCBpbm5lclN0YXJ0O1xuICAgIGlmICh0aGlzLl90eXBlZCA9PSBudWxsKSB7XG4gICAgICBjcG9zID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCk7XG4gICAgICBpbm5lclN0YXJ0ID0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoO1xuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuZmluZFByZXZCcmFrZXQoY3Bvcy5zdGFydCkgPT09IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICYmICgoaW5uZXJFbmQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGlubmVyU3RhcnQpKSAhPSBudWxsKSAmJiBpbm5lckVuZCA+PSBjcG9zLmVuZCkge1xuICAgICAgICB0aGlzLl90eXBlZCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdHlwZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkO1xuICB9XG5cbiAgd2hpdGhpbk9wZW5Cb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHQ7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV07XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLnN0YXJ0UG9zQXQoaSk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB3aGl0aGluQ2xvc2VCb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHQ7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV07XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLmVuZFBvc0F0KGkpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGFydFBvc0F0KGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSkpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMsIHRoaXMuY29kZXdhdmUuYnJha2V0cyk7XG4gIH1cblxuICBlbmRQb3NBdChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAyKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLCB0aGlzLmNvZGV3YXZlLmJyYWtldHMpO1xuICB9XG5cbn07XG5cbmV4cG9ydCB2YXIgU2ltdWxhdGVkQ2xvc2luZ1Byb21wID0gY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wIHtcbiAgcmVzdW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNpbXVsYXRlVHlwZSgpO1xuICB9XG5cbiAgc2ltdWxhdGVUeXBlKCkge1xuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgoKSA9PiB7XG4gICAgICB2YXIgY3VyQ2xvc2UsIHJlcGwsIHRhcmdldFRleHQ7XG4gICAgICB0aGlzLmludmFsaWRUeXBlZCgpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgY3VyQ2xvc2UgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyh0aGlzLnJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdLmNvcHkoKS5hcHBseU9mZnNldCh0aGlzLnR5cGVkKCkubGVuZ3RoKSk7XG4gICAgICBpZiAoY3VyQ2xvc2UpIHtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChjdXJDbG9zZS5zdGFydCwgY3VyQ2xvc2UuZW5kLCB0YXJnZXRUZXh0KTtcbiAgICAgICAgaWYgKHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KCkpIHtcbiAgICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uVHlwZVNpbXVsYXRlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uVHlwZVNpbXVsYXRlZCgpO1xuICAgICAgfVxuICAgIH0pLCAyKTtcbiAgfVxuXG4gIHNraXBFdmVudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRTZWxlY3Rpb25zKCkge1xuICAgIHJldHVybiBbdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCksIHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0gKyB0aGlzLnR5cGVkKCkubGVuZ3RoXTtcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXh0LCByZWYsIHJlcGwsIHRhcmdldFBvcztcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSk7XG4gICAgICBuZXh0ID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldCh0YXJnZXRQb3MuaW5uZXJTdGFydCk7XG4gICAgICBpZiAobmV4dCAhPSBudWxsKSB7XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpO1xuICAgICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSkge1xuICAgICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG5cbkNsb3NpbmdQcm9tcC5uZXdGb3IgPSBmdW5jdGlvbihjb2Rld2F2ZSwgc2VsZWN0aW9ucykge1xuICBpZiAoY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFNpbXVsYXRlZENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucyk7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBDbWRGaW5kZXJcbiAgY29uc3RydWN0b3I6IChuYW1lcywgb3B0aW9ucykgLT5cbiAgICBpZiB0eXBlb2YgbmFtZXMgPT0gJ3N0cmluZydcbiAgICAgIG5hbWVzID0gW25hbWVzXVxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsXG4gICAgICBuYW1lc3BhY2VzOiBbXVxuICAgICAgcGFyZW50Q29udGV4dDogbnVsbFxuICAgICAgY29udGV4dDogbnVsbFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzXG4gICAgICBtdXN0RXhlY3V0ZTogdHJ1ZVxuICAgICAgdXNlRGV0ZWN0b3JzOiB0cnVlXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWVcbiAgICAgIGluc3RhbmNlOiBudWxsXG4gICAgICBjb2Rld2F2ZTogbnVsbFxuICAgIH1cbiAgICBAbmFtZXMgPSBuYW1lc1xuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoQGNvZGV3YXZlKVxuICAgIGlmIEBwYXJlbnRDb250ZXh0P1xuICAgICAgQGNvbnRleHQucGFyZW50ID0gQHBhcmVudENvbnRleHRcbiAgICBpZiBAbmFtZXNwYWNlcz9cbiAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMoQG5hbWVzcGFjZXMpXG4gIGZpbmQ6IC0+XG4gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAgIEBjbWQgPSBAZmluZEluKEByb290KVxuICAgIHJldHVybiBAY21kXG4jICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4jICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiMgICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4jICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzOiAtPlxuICAgIHBhdGhzID0ge31cbiAgICBmb3IgbmFtZSBpbiBAbmFtZXMgXG4gICAgICBbc3BhY2UscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgc3BhY2U/IGFuZCAhKHNwYWNlIGluIEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgICAgdW5sZXNzIHNwYWNlIG9mIHBhdGhzIFxuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpXG4gICAgcmV0dXJuIHBhdGhzXG4gIGFwcGx5U3BhY2VPbk5hbWVzOiAobmFtZXNwYWNlKSAtPlxuICAgIFtzcGFjZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSx0cnVlKVxuICAgIEBuYW1lcy5tYXAoIChuYW1lKSAtPlxuICAgICAgW2N1cl9zcGFjZSxjdXJfcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgY3VyX3NwYWNlPyBhbmQgY3VyX3NwYWNlID09IHNwYWNlXG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdFxuICAgICAgaWYgcmVzdD9cbiAgICAgICAgbmFtZSA9IHJlc3QgKyAnOicgKyBuYW1lXG4gICAgICByZXR1cm4gbmFtZVxuICAgIClcbiAgZ2V0RGlyZWN0TmFtZXM6IC0+XG4gICAgcmV0dXJuIChuIGZvciBuIGluIEBuYW1lcyB3aGVuIG4uaW5kZXhPZihcIjpcIikgPT0gLTEpXG4gIHRyaWdnZXJEZXRlY3RvcnM6IC0+XG4gICAgaWYgQHVzZURldGVjdG9ycyBcbiAgICAgIEB1c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcG9zaWJpbGl0aWVzID0gbmV3IENtZEZpbmRlcihAY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKVxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoXG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXVxuICAgICAgICBmb3IgZGV0ZWN0b3IgaW4gY21kLmRldGVjdG9ycyBcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcylcbiAgICAgICAgICBpZiByZXM/XG4gICAgICAgICAgICBAY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcylcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICAgICAgaSsrXG4gIGZpbmRJbjogKGNtZCxwYXRoID0gbnVsbCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIG51bGxcbiAgICBiZXN0ID0gQGJlc3RJblBvc2liaWxpdGllcyhAZmluZFBvc2liaWxpdGllcygpKVxuICAgIGlmIGJlc3Q/XG4gICAgICByZXR1cm4gYmVzdFxuICBmaW5kUG9zaWJpbGl0aWVzOiAtPlxuICAgIHVubGVzcyBAcm9vdD9cbiAgICAgIHJldHVybiBbXVxuICAgIEByb290LmluaXQoKVxuICAgIHBvc2liaWxpdGllcyA9IFtdXG4gICAgZm9yIHNwYWNlLCBuYW1lcyBvZiBAZ2V0TmFtZXNXaXRoUGF0aHMoKVxuICAgICAgbmV4dHMgPSBAZ2V0Q21kRm9sbG93QWxpYXMoc3BhY2UpXG4gICAgICBmb3IgbmV4dCBpbiBuZXh0c1xuICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgZm9yIG5zcGMgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICBbbnNwY05hbWUscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLHRydWUpXG4gICAgICBuZXh0cyA9IEBnZXRDbWRGb2xsb3dBbGlhcyhuc3BjTmFtZSlcbiAgICAgIGZvciBuZXh0IGluIG5leHRzXG4gICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihAYXBwbHlTcGFjZU9uTmFtZXMobnNwYyksIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgZm9yIG5hbWUgaW4gQGdldERpcmVjdE5hbWVzKClcbiAgICAgIGRpcmVjdCA9IEByb290LmdldENtZChuYW1lKVxuICAgICAgaWYgQGNtZElzVmFsaWQoZGlyZWN0KVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpXG4gICAgaWYgQHVzZUZhbGxiYWNrc1xuICAgICAgZmFsbGJhY2sgPSBAcm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJylcbiAgICAgIGlmIEBjbWRJc1ZhbGlkKGZhbGxiYWNrKVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjaylcbiAgICBAcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzXG4gICAgcmV0dXJuIHBvc2liaWxpdGllc1xuICBnZXRDbWRGb2xsb3dBbGlhczogKG5hbWUpIC0+XG4gICAgY21kID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgaWYgY21kPyBcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5hbGlhc09mP1xuICAgICAgICByZXR1cm4gW2NtZCxjbWQuZ2V0QWxpYXNlZCgpXVxuICAgICAgcmV0dXJuIFtjbWRdXG4gICAgcmV0dXJuIFtjbWRdXG4gIGNtZElzVmFsaWQ6IChjbWQpIC0+XG4gICAgdW5sZXNzIGNtZD9cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIGNtZC5uYW1lICE9ICdmYWxsYmFjaycgJiYgY21kIGluIEBhbmNlc3RvcnMoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuICFAbXVzdEV4ZWN1dGUgb3IgQGNtZElzRXhlY3V0YWJsZShjbWQpXG4gIGFuY2VzdG9yczogLT5cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGNtZElzRXhlY3V0YWJsZTogKGNtZCkgLT5cbiAgICBuYW1lcyA9IEBnZXREaXJlY3ROYW1lcygpXG4gICAgaWYgbmFtZXMubGVuZ3RoID09IDFcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gIGNtZFNjb3JlOiAoY21kKSAtPlxuICAgIHNjb3JlID0gY21kLmRlcHRoXG4gICAgaWYgY21kLm5hbWUgPT0gJ2ZhbGxiYWNrJyBcbiAgICAgICAgc2NvcmUgLT0gMTAwMFxuICAgIHJldHVybiBzY29yZVxuICBiZXN0SW5Qb3NpYmlsaXRpZXM6IChwb3NzKSAtPlxuICAgIGlmIHBvc3MubGVuZ3RoID4gMFxuICAgICAgYmVzdCA9IG51bGxcbiAgICAgIGJlc3RTY29yZSA9IG51bGxcbiAgICAgIGZvciBwIGluIHBvc3NcbiAgICAgICAgc2NvcmUgPSBAY21kU2NvcmUocClcbiAgICAgICAgaWYgIWJlc3Q/IG9yIHNjb3JlID49IGJlc3RTY29yZVxuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlXG4gICAgICAgICAgYmVzdCA9IHBcbiAgICAgIHJldHVybiBiZXN0OyIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBOYW1lc3BhY2VIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBDbWRGaW5kZXIgPSBjbGFzcyBDbWRGaW5kZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lcywgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXTtcbiAgICB9XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICBuYW1lc3BhY2VzOiBbXSxcbiAgICAgIHBhcmVudENvbnRleHQ6IG51bGwsXG4gICAgICBjb250ZXh0OiBudWxsLFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzLFxuICAgICAgbXVzdEV4ZWN1dGU6IHRydWUsXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWUsXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWUsXG4gICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfTtcbiAgICB0aGlzLm5hbWVzID0gbmFtZXM7XG4gICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2UgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcy5jb2Rld2F2ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmVudENvbnRleHQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMucGFyZW50Q29udGV4dDtcbiAgICB9XG4gICAgaWYgKHRoaXMubmFtZXNwYWNlcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyh0aGlzLm5hbWVzcGFjZXMpO1xuICAgIH1cbiAgfVxuXG4gIGZpbmQoKSB7XG4gICAgdGhpcy50cmlnZ2VyRGV0ZWN0b3JzKCk7XG4gICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRJbih0aGlzLnJvb3QpO1xuICAgIHJldHVybiB0aGlzLmNtZDtcbiAgfVxuXG4gIC8vICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4gIC8vICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiAgLy8gICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4gIC8vICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzKCkge1xuICAgIHZhciBqLCBsZW4sIG5hbWUsIHBhdGhzLCByZWYsIHJlc3QsIHNwYWNlO1xuICAgIHBhdGhzID0ge307XG4gICAgcmVmID0gdGhpcy5uYW1lcztcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5hbWUgPSByZWZbal07XG4gICAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG4gICAgICBpZiAoKHNwYWNlICE9IG51bGwpICYmICEoaW5kZXhPZi5jYWxsKHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHNwYWNlKSA+PSAwKSkge1xuICAgICAgICBpZiAoIShzcGFjZSBpbiBwYXRocykpIHtcbiAgICAgICAgICBwYXRoc1tzcGFjZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBwYXRoc1tzcGFjZV0ucHVzaChyZXN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGhzO1xuICB9XG5cbiAgYXBwbHlTcGFjZU9uTmFtZXMobmFtZXNwYWNlKSB7XG4gICAgdmFyIHJlc3QsIHNwYWNlO1xuICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lc3BhY2UsIHRydWUpO1xuICAgIHJldHVybiB0aGlzLm5hbWVzLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgY3VyX3Jlc3QsIGN1cl9zcGFjZTtcbiAgICAgIFtjdXJfc3BhY2UsIGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpO1xuICAgICAgaWYgKChjdXJfc3BhY2UgIT0gbnVsbCkgJiYgY3VyX3NwYWNlID09PSBzcGFjZSkge1xuICAgICAgICBuYW1lID0gY3VyX3Jlc3Q7XG4gICAgICB9XG4gICAgICBpZiAocmVzdCAhPSBudWxsKSB7XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RGlyZWN0TmFtZXMoKSB7XG4gICAgdmFyIG47XG4gICAgcmV0dXJuIChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgIHJlZiA9IHRoaXMubmFtZXM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgbiA9IHJlZltqXTtcbiAgICAgICAgaWYgKG4uaW5kZXhPZihcIjpcIikgPT09IC0xKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9KS5jYWxsKHRoaXMpO1xuICB9XG5cbiAgdHJpZ2dlckRldGVjdG9ycygpIHtcbiAgICB2YXIgY21kLCBkZXRlY3RvciwgaSwgaiwgbGVuLCBwb3NpYmlsaXRpZXMsIHJlZiwgcmVzLCByZXN1bHRzO1xuICAgIGlmICh0aGlzLnVzZURldGVjdG9ycykge1xuICAgICAgdGhpcy51c2VEZXRlY3RvcnMgPSBmYWxzZTtcbiAgICAgIHBvc2liaWxpdGllcyA9IG5ldyBDbWRGaW5kZXIodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpO1xuICAgICAgaSA9IDA7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICB3aGlsZSAoaSA8IHBvc2liaWxpdGllcy5sZW5ndGgpIHtcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldO1xuICAgICAgICByZWYgPSBjbWQuZGV0ZWN0b3JzO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICBkZXRlY3RvciA9IHJlZltqXTtcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcyk7XG4gICAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyhyZXMpO1xuICAgICAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKHJlcywge1xuICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0cy5wdXNoKGkrKyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICBmaW5kSW4oY21kLCBwYXRoID0gbnVsbCkge1xuICAgIHZhciBiZXN0O1xuICAgIGlmIChjbWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGJlc3QgPSB0aGlzLmJlc3RJblBvc2liaWxpdGllcyh0aGlzLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgaWYgKGJlc3QgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgfVxuICB9XG5cbiAgZmluZFBvc2liaWxpdGllcygpIHtcbiAgICB2YXIgZGlyZWN0LCBmYWxsYmFjaywgaiwgaywgbCwgbGVuLCBsZW4xLCBsZW4yLCBsZW4zLCBtLCBuYW1lLCBuYW1lcywgbmV4dCwgbmV4dHMsIG5zcGMsIG5zcGNOYW1lLCBwb3NpYmlsaXRpZXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVzdCwgc3BhY2U7XG4gICAgaWYgKHRoaXMucm9vdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHRoaXMucm9vdC5pbml0KCk7XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG4gICAgcmVmID0gdGhpcy5nZXROYW1lc1dpdGhQYXRocygpO1xuICAgIGZvciAoc3BhY2UgaW4gcmVmKSB7XG4gICAgICBuYW1lcyA9IHJlZltzcGFjZV07XG4gICAgICBuZXh0cyA9IHRoaXMuZ2V0Q21kRm9sbG93QWxpYXMoc3BhY2UpO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gbmV4dHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgbmV4dCA9IG5leHRzW2pdO1xuICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcm9vdDogbmV4dFxuICAgICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZWYxID0gdGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKTtcbiAgICBmb3IgKGsgPSAwLCBsZW4xID0gcmVmMS5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgIG5zcGMgPSByZWYxW2tdO1xuICAgICAgW25zcGNOYW1lLCByZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsIHRydWUpO1xuICAgICAgbmV4dHMgPSB0aGlzLmdldENtZEZvbGxvd0FsaWFzKG5zcGNOYW1lKTtcbiAgICAgIGZvciAobCA9IDAsIGxlbjIgPSBuZXh0cy5sZW5ndGg7IGwgPCBsZW4yOyBsKyspIHtcbiAgICAgICAgbmV4dCA9IG5leHRzW2xdO1xuICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIodGhpcy5hcHBseVNwYWNlT25OYW1lcyhuc3BjKSwge1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByb290OiBuZXh0XG4gICAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlZjIgPSB0aGlzLmdldERpcmVjdE5hbWVzKCk7XG4gICAgZm9yIChtID0gMCwgbGVuMyA9IHJlZjIubGVuZ3RoOyBtIDwgbGVuMzsgbSsrKSB7XG4gICAgICBuYW1lID0gcmVmMlttXTtcbiAgICAgIGRpcmVjdCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSk7XG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGRpcmVjdCkpIHtcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZGlyZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMudXNlRmFsbGJhY2tzKSB7XG4gICAgICBmYWxsYmFjayA9IHRoaXMucm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJyk7XG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGZhbGxiYWNrKSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjayk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzO1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXM7XG4gIH1cblxuICBnZXRDbWRGb2xsb3dBbGlhcyhuYW1lKSB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbY21kLCBjbWQuZ2V0QWxpYXNlZCgpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbY21kXTtcbiAgICB9XG4gICAgcmV0dXJuIFtjbWRdO1xuICB9XG5cbiAgY21kSXNWYWxpZChjbWQpIHtcbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGNtZC5uYW1lICE9PSAnZmFsbGJhY2snICYmIGluZGV4T2YuY2FsbCh0aGlzLmFuY2VzdG9ycygpLCBjbWQpID49IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLm11c3RFeGVjdXRlIHx8IHRoaXMuY21kSXNFeGVjdXRhYmxlKGNtZCk7XG4gIH1cblxuICBhbmNlc3RvcnMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gcmVmLmluSW5zdGFuY2UgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjbWRJc0V4ZWN1dGFibGUoY21kKSB7XG4gICAgdmFyIG5hbWVzO1xuICAgIG5hbWVzID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgfVxuICB9XG5cbiAgY21kU2NvcmUoY21kKSB7XG4gICAgdmFyIHNjb3JlO1xuICAgIHNjb3JlID0gY21kLmRlcHRoO1xuICAgIGlmIChjbWQubmFtZSA9PT0gJ2ZhbGxiYWNrJykge1xuICAgICAgc2NvcmUgLT0gMTAwMDtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3JlO1xuICB9XG5cbiAgYmVzdEluUG9zaWJpbGl0aWVzKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlO1xuICAgIGlmIChwb3NzLmxlbmd0aCA+IDApIHtcbiAgICAgIGJlc3QgPSBudWxsO1xuICAgICAgYmVzdFNjb3JlID0gbnVsbDtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHBvc3MubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHBvc3Nbal07XG4gICAgICAgIHNjb3JlID0gdGhpcy5jbWRTY29yZShwKTtcbiAgICAgICAgaWYgKChiZXN0ID09IG51bGwpIHx8IHNjb3JlID49IGJlc3RTY29yZSkge1xuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlO1xuICAgICAgICAgIGJlc3QgPSBwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBDbWRJbnN0YW5jZVxuICBjb25zdHJ1Y3RvcjogKEBjbWQsQGNvbnRleHQpIC0+XG4gIFxuICBpbml0OiAtPlxuICAgIHVubGVzcyBAaXNFbXB0eSgpIG9yIEBpbml0ZWRcbiAgICAgIEBpbml0ZWQgPSB0cnVlXG4gICAgICBAX2dldENtZE9iaigpXG4gICAgICBAX2luaXRQYXJhbXMoKVxuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgQGNtZE9iai5pbml0KClcbiAgICByZXR1cm4gdGhpc1xuICBzZXRQYXJhbToobmFtZSx2YWwpLT5cbiAgICBAbmFtZWRbbmFtZV0gPSB2YWxcbiAgcHVzaFBhcmFtOih2YWwpLT5cbiAgICBAcGFyYW1zLnB1c2godmFsKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgIHJldHVybiBAY29udGV4dCBvciBuZXcgQ29udGV4dCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUpLT5cbiAgICBmaW5kZXIgPSBAZ2V0Q29udGV4dCgpLmdldEZpbmRlcihjbWROYW1lLEBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRDbWRPYmo6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIEBjbWQuaW5pdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5jbHM/XG4gICAgICAgIEBjbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKVxuICAgICAgICByZXR1cm4gQGNtZE9ialxuICBfaW5pdFBhcmFtczogLT5cbiAgICBAbmFtZWQgPSBAZ2V0RGVmYXVsdHMoKVxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICByZXR1cm4gW11cbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQGNtZD9cbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIHJldHVybiBAY21kLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJlcyA9IHt9XG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGNtZC5kZWZhdWx0cylcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBjbWRPYmouZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJldHVybiByZXNcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIHJldHVybiBAYWxpYXNlZENtZCBvciBudWxsXG4gIGdldEFsaWFzZWRGaW5hbDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGFsaWFzZWRGaW5hbENtZD9cbiAgICAgICAgcmV0dXJuIEBhbGlhc2VkRmluYWxDbWQgb3IgbnVsbFxuICAgICAgaWYgQGNtZC5hbGlhc09mP1xuICAgICAgICBhbGlhc2VkID0gQGNtZFxuICAgICAgICB3aGlsZSBhbGlhc2VkPyBhbmQgYWxpYXNlZC5hbGlhc09mP1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcihAZ2V0RmluZGVyKEBhbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG4gICAgICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICAgICAgQGFsaWFzZWRDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIEBhbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIHJldHVybiBhbGlhc2VkXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBhbGlhc09mXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPcHRpb25zP1xuICAgICAgICByZXR1cm4gQGNtZE9wdGlvbnNcbiAgICAgIG9wdCA9IEBjbWQuX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxAY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIEBjbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIG9wdGlvbnM/IGFuZCBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBnZXRQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIG5hbWVzID0gW25hbWVzXSBpZiAodHlwZW9mIG5hbWVzIGluIFsnc3RyaW5nJywnbnVtYmVyJ10pXG4gICAgZm9yIG4gaW4gbmFtZXNcbiAgICAgIHJldHVybiBAbmFtZWRbbl0gaWYgQG5hbWVkW25dP1xuICAgICAgcmV0dXJuIEBwYXJhbXNbbl0gaWYgQHBhcmFtc1tuXT9cbiAgICByZXR1cm4gZGVmVmFsXG4gIGFuY2VzdG9yQ21kczogLT5cbiAgICBpZiBAY29udGV4dC5jb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKVxuICAgIHJldHVybiBbXVxuICBhbmNlc3RvckNtZHNBbmRTZWxmOiAtPlxuICAgIHJldHVybiBAYW5jZXN0b3JDbWRzKCkuY29uY2F0KFtAY21kXSlcbiAgcnVuRXhlY3V0ZUZ1bmN0OiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5leGVjdXRlKClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkRmluYWwoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuZXhlY3V0ZUZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKVxuICByYXdSZXN1bHQ6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZEZpbmFsKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLnJlc3VsdEZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpXG4gICAgICBpZiBjbWQucmVzdWx0U3RyP1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0clxuICByZXN1bHQ6IC0+IFxuICAgIEBpbml0KClcbiAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgaWYgKHJlcyA9IEByYXdSZXN1bHQoKSk/XG4gICAgICAgIHJlcyA9IEBmb3JtYXRJbmRlbnQocmVzKVxuICAgICAgICBpZiByZXMubGVuZ3RoID4gMCBhbmQgQGdldE9wdGlvbigncGFyc2UnLHRoaXMpIFxuICAgICAgICAgIHBhcnNlciA9IEBnZXRQYXJzZXJGb3JUZXh0KHJlcylcbiAgICAgICAgICByZXMgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgICBpZiBhbHRlckZ1bmN0ID0gQGdldE9wdGlvbignYWx0ZXJSZXN1bHQnLHRoaXMpXG4gICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsdGhpcylcbiAgICAgICAgcmV0dXJuIHJlc1xuICBnZXRQYXJzZXJGb3JUZXh0OiAodHh0PScnKSAtPlxuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7aW5JbnN0YW5jZTp0aGlzfSlcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuICAgIHJldHVybiBwYXJzZXJcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHJldHVybiAwXG4gIGZvcm1hdEluZGVudDogKHRleHQpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcdC9nLCcgICcpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYXBwbHlJbmRlbnQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuaW5kZW50Tm90Rmlyc3QodGV4dCxAZ2V0SW5kZW50KCksXCIgXCIpIiwiaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBDb2Rld2F2ZVxufSBmcm9tICcuL0NvZGV3YXZlJztcblxuaW1wb3J0IHtcbiAgVGV4dFBhcnNlclxufSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCB2YXIgQ21kSW5zdGFuY2UgPSBjbGFzcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yKGNtZDEsIGNvbnRleHQpIHtcbiAgICB0aGlzLmNtZCA9IGNtZDE7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCEodGhpcy5pc0VtcHR5KCkgfHwgdGhpcy5pbml0ZWQpKSB7XG4gICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICB0aGlzLl9nZXRDbWRPYmooKTtcbiAgICAgIHRoaXMuX2luaXRQYXJhbXMoKTtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqLmluaXQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRQYXJhbShuYW1lLCB2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lZFtuYW1lXSA9IHZhbDtcbiAgfVxuXG4gIHB1c2hQYXJhbSh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMucHVzaCh2YWwpO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRleHQgfHwgbmV3IENvbnRleHQoKTtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmdldENvbnRleHQoKS5nZXRGaW5kZXIoY21kTmFtZSwgdGhpcy5fZ2V0UGFyZW50TmFtZXNwYWNlcygpKTtcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzO1xuICAgIHJldHVybiBmaW5kZXI7XG4gIH1cblxuICBfZ2V0Q21kT2JqKCkge1xuICAgIHZhciBjbWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY21kLmluaXQoKTtcbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuY2xzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9pbml0UGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWVkID0gdGhpcy5nZXREZWZhdWx0cygpO1xuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5jbWQgIT0gbnVsbDtcbiAgfVxuXG4gIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgIHZhciBhbGlhc2VkO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY21kLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldERlZmF1bHRzKCkge1xuICAgIHZhciBhbGlhc2VkLCByZXM7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJlcyA9IHt9O1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgYWxpYXNlZC5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZC5kZWZhdWx0cyk7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5jbWRPYmouZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmdldEFsaWFzZWRGaW5hbCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZENtZCB8fCBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWRGaW5hbCgpIHtcbiAgICB2YXIgYWxpYXNlZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZEZpbmFsQ21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZEZpbmFsQ21kIHx8IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLmNtZDtcbiAgICAgICAgd2hpbGUgKChhbGlhc2VkICE9IG51bGwpICYmIChhbGlhc2VkLmFsaWFzT2YgIT0gbnVsbCkpIHtcbiAgICAgICAgICBhbGlhc2VkID0gYWxpYXNlZC5fYWxpYXNlZEZyb21GaW5kZXIodGhpcy5nZXRGaW5kZXIodGhpcy5hbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpO1xuICAgICAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hbGlhc2VkQ21kID0gYWxpYXNlZCB8fCBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIHx8IGZhbHNlO1xuICAgICAgICByZXR1cm4gYWxpYXNlZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhbHRlckFsaWFzT2YoYWxpYXNPZikge1xuICAgIHJldHVybiBhbGlhc09mO1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICB2YXIgb3B0O1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPcHRpb25zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT3B0aW9ucztcbiAgICAgIH1cbiAgICAgIG9wdCA9IHRoaXMuY21kLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSk7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5jbWRPYmouZ2V0T3B0aW9ucygpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY21kT3B0aW9ucyA9IG9wdDtcbiAgICAgIHJldHVybiBvcHQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0aW9uKGtleSkge1xuICAgIHZhciBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICBpZiAoKG9wdGlvbnMgIT0gbnVsbCkgJiYga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV07XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyYW0obmFtZXMsIGRlZlZhbCA9IG51bGwpIHtcbiAgICB2YXIgaSwgbGVuLCBuLCByZWY7XG4gICAgaWYgKCgocmVmID0gdHlwZW9mIG5hbWVzKSA9PT0gJ3N0cmluZycgfHwgcmVmID09PSAnbnVtYmVyJykpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXTtcbiAgICB9XG4gICAgZm9yIChpID0gMCwgbGVuID0gbmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG4gPSBuYW1lc1tpXTtcbiAgICAgIGlmICh0aGlzLm5hbWVkW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbl07XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wYXJhbXNbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXNbbl07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWZWYWw7XG4gIH1cblxuICBhbmNlc3RvckNtZHMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUpICE9IG51bGwgPyByZWYuaW5JbnN0YW5jZSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgYW5jZXN0b3JDbWRzQW5kU2VsZigpIHtcbiAgICByZXR1cm4gdGhpcy5hbmNlc3RvckNtZHMoKS5jb25jYXQoW3RoaXMuY21kXSk7XG4gIH1cblxuICBydW5FeGVjdXRlRnVuY3QoKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLmV4ZWN1dGUoKTtcbiAgICAgIH1cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5leGVjdXRlRnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByYXdSZXN1bHQoKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdCgpO1xuICAgICAgfVxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLnJlc3VsdEZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjbWQucmVzdWx0U3RyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRTdHI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBhbHRlckZ1bmN0LCBwYXJzZXIsIHJlcztcbiAgICB0aGlzLmluaXQoKTtcbiAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICBpZiAoKHJlcyA9IHRoaXMucmF3UmVzdWx0KCkpICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gdGhpcy5mb3JtYXRJbmRlbnQocmVzKTtcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwICYmIHRoaXMuZ2V0T3B0aW9uKCdwYXJzZScsIHRoaXMpKSB7XG4gICAgICAgICAgcGFyc2VyID0gdGhpcy5nZXRQYXJzZXJGb3JUZXh0KHJlcyk7XG4gICAgICAgICAgcmVzID0gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsdGVyRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYWx0ZXJSZXN1bHQnLCB0aGlzKSkge1xuICAgICAgICAgIHJlcyA9IGFsdGVyRnVuY3QocmVzLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFBhcnNlckZvclRleHQodHh0ID0gJycpIHtcbiAgICB2YXIgcGFyc2VyO1xuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7XG4gICAgICBpbkluc3RhbmNlOiB0aGlzXG4gICAgfSk7XG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG4gICAgcmV0dXJuIHBhcnNlcjtcbiAgfVxuXG4gIGdldEluZGVudCgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZvcm1hdEluZGVudCh0ZXh0KSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx0L2csICcgICcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhcHBseUluZGVudCh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5pbmRlbnROb3RGaXJzdCh0ZXh0LCB0aGlzLmdldEluZGVudCgpLCBcIiBcIik7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFByb2Nlc3MgfSBmcm9tICcuL1Byb2Nlc3MnO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgfSBmcm9tICcuL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9Mb2dnZXInO1xuaW1wb3J0IHsgUG9zQ29sbGVjdGlvbiB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IENsb3NpbmdQcm9tcCB9IGZyb20gJy4vQ2xvc2luZ1Byb21wJztcblxuZXhwb3J0IGNsYXNzIENvZGV3YXZlXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIENvZGV3YXZlLmluaXQoKVxuICAgIEBtYXJrZXIgPSAnW1tbW2NvZGV3YXZlX21hcnF1ZXJdXV1dJ1xuICAgIEB2YXJzID0ge31cbiAgICBcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICdicmFrZXRzJyA6ICd+ficsXG4gICAgICAnZGVjbycgOiAnficsXG4gICAgICAnY2xvc2VDaGFyJyA6ICcvJyxcbiAgICAgICdub0V4ZWN1dGVDaGFyJyA6ICchJyxcbiAgICAgICdjYXJyZXRDaGFyJyA6ICd8JyxcbiAgICAgICdjaGVja0NhcnJldCcgOiB0cnVlLFxuICAgICAgJ2luSW5zdGFuY2UnIDogbnVsbFxuICAgIH1cbiAgICBAcGFyZW50ID0gb3B0aW9uc1sncGFyZW50J11cbiAgICBcbiAgICBAbmVzdGVkID0gaWYgQHBhcmVudD8gdGhlbiBAcGFyZW50Lm5lc3RlZCsxIGVsc2UgMFxuICAgIFxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIEBlZGl0b3IuYmluZGVkVG8odGhpcykgaWYgQGVkaXRvcj9cbiAgICBcbiAgICBAY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMpXG4gICAgaWYgQGluSW5zdGFuY2U/XG4gICAgICBAY29udGV4dC5wYXJlbnQgPSBAaW5JbnN0YW5jZS5jb250ZXh0XG5cbiAgICBAbG9nZ2VyID0gbmV3IExvZ2dlcigpXG5cbiAgb25BY3RpdmF0aW9uS2V5OiAtPlxuICAgIEBwcm9jZXNzID0gbmV3IFByb2Nlc3MoKVxuICAgIEBsb2dnZXIubG9nKCdhY3RpdmF0aW9uIGtleScpXG4gICAgQHJ1bkF0Q3Vyc29yUG9zKCkudGhlbiA9PlxuICAgICAgQHByb2Nlc3MgPSBudWxsXG4gIHJ1bkF0Q3Vyc29yUG9zOiAtPlxuICAgIGlmIEBlZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgICBAcnVuQXRNdWx0aVBvcyhAZWRpdG9yLmdldE11bHRpU2VsKCkpXG4gICAgZWxzZVxuICAgICAgQHJ1bkF0UG9zKEBlZGl0b3IuZ2V0Q3Vyc29yUG9zKCkpXG4gIHJ1bkF0UG9zOiAocG9zKS0+XG4gICAgQHJ1bkF0TXVsdGlQb3MoW3Bvc10pXG4gIHJ1bkF0TXVsdGlQb3M6IChtdWx0aVBvcyktPlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgIGlmIG11bHRpUG9zLmxlbmd0aCA+IDBcbiAgICAgICAgY21kID0gQGNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpXG4gICAgICAgIGlmIGNtZD9cbiAgICAgICAgICBpZiBtdWx0aVBvcy5sZW5ndGggPiAxXG4gICAgICAgICAgICBjbWQuc2V0TXVsdGlQb3MobXVsdGlQb3MpXG4gICAgICAgICAgY21kLmluaXQoKVxuICAgICAgICAgIEBsb2dnZXIubG9nKGNtZClcbiAgICAgICAgICBjbWQuZXhlY3V0ZSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBtdWx0aVBvc1swXS5zdGFydCA9PSBtdWx0aVBvc1swXS5lbmRcbiAgICAgICAgICAgIEBhZGRCcmFrZXRzKG11bHRpUG9zKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBwcm9tcHRDbG9zaW5nQ21kKG11bHRpUG9zKVxuICBjb21tYW5kT25Qb3M6IChwb3MpIC0+XG4gICAgaWYgQHByZWNlZGVkQnlCcmFrZXRzKHBvcykgYW5kIEBmb2xsb3dlZEJ5QnJha2V0cyhwb3MpIGFuZCBAY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09IDEgXG4gICAgICBwcmV2ID0gcG9zLUBicmFrZXRzLmxlbmd0aFxuICAgICAgbmV4dCA9IHBvc1xuICAgIGVsc2VcbiAgICAgIGlmIEBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIGFuZCBAY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09IDBcbiAgICAgICAgcG9zIC09IEBicmFrZXRzLmxlbmd0aFxuICAgICAgcHJldiA9IEBmaW5kUHJldkJyYWtldChwb3MpXG4gICAgICB1bmxlc3MgcHJldj9cbiAgICAgICAgcmV0dXJuIG51bGwgXG4gICAgICBuZXh0ID0gQGZpbmROZXh0QnJha2V0KHBvcy0xKVxuICAgICAgaWYgIW5leHQ/IG9yIEBjb3VudFByZXZCcmFrZXQocHJldikgJSAyICE9IDAgXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcyxwcmV2LEBlZGl0b3IudGV4dFN1YnN0cihwcmV2LG5leHQrQGJyYWtldHMubGVuZ3RoKSlcbiAgbmV4dENtZDogKHN0YXJ0ID0gMCkgLT5cbiAgICBwb3MgPSBzdGFydFxuICAgIHdoaWxlIGYgPSBAZmluZEFueU5leHQocG9zICxbQGJyYWtldHMsXCJcXG5cIl0pXG4gICAgICBwb3MgPSBmLnBvcyArIGYuc3RyLmxlbmd0aFxuICAgICAgaWYgZi5zdHIgPT0gQGJyYWtldHNcbiAgICAgICAgaWYgYmVnaW5uaW5nP1xuICAgICAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIGJlZ2lubmluZywgQGVkaXRvci50ZXh0U3Vic3RyKGJlZ2lubmluZywgZi5wb3MrQGJyYWtldHMubGVuZ3RoKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGJlZ2lubmluZyA9IGYucG9zXG4gICAgICBlbHNlXG4gICAgICAgIGJlZ2lubmluZyA9IG51bGxcbiAgICBudWxsXG4gIGdldEVuY2xvc2luZ0NtZDogKHBvcyA9IDApIC0+XG4gICAgY3BvcyA9IHBvc1xuICAgIGNsb3NpbmdQcmVmaXggPSBAYnJha2V0cyArIEBjbG9zZUNoYXJcbiAgICB3aGlsZSAocCA9IEBmaW5kTmV4dChjcG9zLGNsb3NpbmdQcmVmaXgpKT9cbiAgICAgIGlmIGNtZCA9IEBjb21tYW5kT25Qb3MocCtjbG9zaW5nUHJlZml4Lmxlbmd0aClcbiAgICAgICAgY3BvcyA9IGNtZC5nZXRFbmRQb3MoKVxuICAgICAgICBpZiBjbWQucG9zIDwgcG9zXG4gICAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgZWxzZVxuICAgICAgICBjcG9zID0gcCtjbG9zaW5nUHJlZml4Lmxlbmd0aFxuICAgIG51bGxcbiAgcHJlY2VkZWRCeUJyYWtldHM6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dFN1YnN0cihwb3MtQGJyYWtldHMubGVuZ3RoLHBvcykgPT0gQGJyYWtldHNcbiAgZm9sbG93ZWRCeUJyYWtldHM6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dFN1YnN0cihwb3MscG9zK0BicmFrZXRzLmxlbmd0aCkgPT0gQGJyYWtldHNcbiAgY291bnRQcmV2QnJha2V0OiAoc3RhcnQpIC0+IFxuICAgIGkgPSAwXG4gICAgd2hpbGUgKHN0YXJ0ID0gQGZpbmRQcmV2QnJha2V0KHN0YXJ0KSk/XG4gICAgICBpKytcbiAgICByZXR1cm4gaVxuICBpc0VuZExpbmU6IChwb3MpIC0+IFxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLHBvcysxKSA9PSBcIlxcblwiIG9yIHBvcyArIDEgPj0gQGVkaXRvci50ZXh0TGVuKClcbiAgZmluZFByZXZCcmFrZXQ6IChzdGFydCkgLT4gXG4gICAgcmV0dXJuIEBmaW5kTmV4dEJyYWtldChzdGFydCwtMSlcbiAgZmluZE5leHRCcmFrZXQ6IChzdGFydCxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBmID0gQGZpbmRBbnlOZXh0KHN0YXJ0ICxbQGJyYWtldHMsXCJcXG5cIl0sIGRpcmVjdGlvbilcbiAgICBcbiAgICBmLnBvcyBpZiBmIGFuZCBmLnN0ciA9PSBAYnJha2V0c1xuICBmaW5kUHJldjogKHN0YXJ0LHN0cmluZykgLT4gXG4gICAgcmV0dXJuIEBmaW5kTmV4dChzdGFydCxzdHJpbmcsLTEpXG4gIGZpbmROZXh0OiAoc3RhcnQsc3RyaW5nLGRpcmVjdGlvbiA9IDEpIC0+IFxuICAgIGYgPSBAZmluZEFueU5leHQoc3RhcnQgLFtzdHJpbmddLCBkaXJlY3Rpb24pXG4gICAgZi5wb3MgaWYgZlxuICBcbiAgZmluZEFueU5leHQ6IChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbiA9IDEpIC0+IFxuICAgIHJldHVybiBAZWRpdG9yLmZpbmRBbnlOZXh0KHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uKVxuICAgIFxuICBmaW5kTWF0Y2hpbmdQYWlyOiAoc3RhcnRQb3Msb3BlbmluZyxjbG9zaW5nLGRpcmVjdGlvbiA9IDEpIC0+XG4gICAgcG9zID0gc3RhcnRQb3NcbiAgICBuZXN0ZWQgPSAwXG4gICAgd2hpbGUgZiA9IEBmaW5kQW55TmV4dChwb3MsW2Nsb3Npbmcsb3BlbmluZ10sZGlyZWN0aW9uKVxuICAgICAgcG9zID0gZi5wb3MgKyAoaWYgZGlyZWN0aW9uID4gMCB0aGVuIGYuc3RyLmxlbmd0aCBlbHNlIDApXG4gICAgICBpZiBmLnN0ciA9PSAoaWYgZGlyZWN0aW9uID4gMCB0aGVuIGNsb3NpbmcgZWxzZSBvcGVuaW5nKVxuICAgICAgICBpZiBuZXN0ZWQgPiAwXG4gICAgICAgICAgbmVzdGVkLS1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBmXG4gICAgICBlbHNlXG4gICAgICAgIG5lc3RlZCsrXG4gICAgbnVsbFxuICBhZGRCcmFrZXRzOiAocG9zKSAtPlxuICAgIHBvcyA9IG5ldyBQb3NDb2xsZWN0aW9uKHBvcylcbiAgICByZXBsYWNlbWVudHMgPSBwb3Mud3JhcChAYnJha2V0cyxAYnJha2V0cykubWFwKCAociktPnIuc2VsZWN0Q29udGVudCgpIClcbiAgICBAZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgcHJvbXB0Q2xvc2luZ0NtZDogKHNlbGVjdGlvbnMpIC0+XG4gICAgQGNsb3NpbmdQcm9tcC5zdG9wKCkgaWYgQGNsb3NpbmdQcm9tcD9cbiAgICBAY2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wLm5ld0Zvcih0aGlzLHNlbGVjdGlvbnMpLmJlZ2luKClcbiAgcGFyc2VBbGw6IChyZWN1cnNpdmUgPSB0cnVlKSAtPlxuICAgIGlmIEBuZXN0ZWQgPiAxMDBcbiAgICAgIHRocm93IFwiSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb25cIlxuICAgIHBvcyA9IDBcbiAgICB3aGlsZSBjbWQgPSBAbmV4dENtZChwb3MpXG4gICAgICBwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgIEBlZGl0b3Iuc2V0Q3Vyc29yUG9zKHBvcylcbiAgICAgICMgY29uc29sZS5sb2coY21kKVxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgcmVjdXJzaXZlIGFuZCBjbWQuY29udGVudD8gYW5kICghY21kLmdldENtZCgpPyBvciAhY21kLmdldE9wdGlvbigncHJldmVudFBhcnNlQWxsJykpXG4gICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcihjbWQuY29udGVudCksIHtwYXJlbnQ6IHRoaXN9KVxuICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICByZXMgPSAgY21kLmV4ZWN1dGUoKVxuICAgICAgaWYgcmVzP1xuICAgICAgICBpZiByZXMudGhlbj9cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzeW5jIG5lc3RlZCBjb21tYW5kcyBhcmUgbm90IHN1cHBvcnRlZCcpXG4gICAgICAgIGlmIGNtZC5yZXBsYWNlRW5kP1xuICAgICAgICAgIHBvcyA9IGNtZC5yZXBsYWNlRW5kXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwb3MgPSBAZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZFxuICAgIHJldHVybiBAZ2V0VGV4dCgpXG4gIGdldFRleHQ6IC0+XG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dCgpXG4gIGlzUm9vdDogLT5cbiAgICByZXR1cm4gIUBwYXJlbnQ/IGFuZCAoIUBpbkluc3RhbmNlPyBvciAhQGluSW5zdGFuY2UuZmluZGVyPylcbiAgZ2V0Um9vdDogLT5cbiAgICBpZiBAaXNSb290XG4gICAgICByZXR1cm4gdGhpc1xuICAgIGVsc2UgaWYgQHBhcmVudD9cbiAgICAgIHJldHVybiBAcGFyZW50LmdldFJvb3QoKVxuICAgIGVsc2UgaWYgQGluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpXG4gIHJlbW92ZUNhcnJldDogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsQGNhcnJldENoYXIpXG4gIGdldENhcnJldFBvczogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldENhcnJldFBvcyh0eHQsQGNhcnJldENoYXIpXG4gIHJlZ01hcmtlcjogKGZsYWdzPVwiZ1wiKSAtPlxuICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQG1hcmtlciksIGZsYWdzKVxuICByZW1vdmVNYXJrZXJzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKEByZWdNYXJrZXIoKSwnJylcblxuICBAaW5pdDogLT5cbiAgICB1bmxlc3MgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIENvbW1hbmQuaW5pdENtZHMoKVxuICAgICAgQ29tbWFuZC5sb2FkQ21kcygpXG5cbiAgQGluaXRlZDogZmFsc2UiLCJpbXBvcnQge1xuICBQcm9jZXNzXG59IGZyb20gJy4vUHJvY2Vzcyc7XG5cbmltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgUG9zaXRpb25lZENtZEluc3RhbmNlXG59IGZyb20gJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJztcblxuaW1wb3J0IHtcbiAgVGV4dFBhcnNlclxufSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIExvZ2dlclxufSBmcm9tICcuL0xvZ2dlcic7XG5cbmltcG9ydCB7XG4gIFBvc0NvbGxlY3Rpb25cbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDbG9zaW5nUHJvbXBcbn0gZnJvbSAnLi9DbG9zaW5nUHJvbXAnO1xuXG5leHBvcnQgdmFyIENvZGV3YXZlID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBDb2Rld2F2ZSB7XG4gICAgY29uc3RydWN0b3IoZWRpdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICAgIENvZGV3YXZlLmluaXQoKTtcbiAgICAgIHRoaXMubWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSc7XG4gICAgICB0aGlzLnZhcnMgPSB7fTtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAnYnJha2V0cyc6ICd+ficsXG4gICAgICAgICdkZWNvJzogJ34nLFxuICAgICAgICAnY2xvc2VDaGFyJzogJy8nLFxuICAgICAgICAnbm9FeGVjdXRlQ2hhcic6ICchJyxcbiAgICAgICAgJ2NhcnJldENoYXInOiAnfCcsXG4gICAgICAgICdjaGVja0NhcnJldCc6IHRydWUsXG4gICAgICAgICdpbkluc3RhbmNlJzogbnVsbFxuICAgICAgfTtcbiAgICAgIHRoaXMucGFyZW50ID0gb3B0aW9uc1sncGFyZW50J107XG4gICAgICB0aGlzLm5lc3RlZCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC5uZXN0ZWQgKyAxIDogMDtcbiAgICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgfSBlbHNlIGlmICgodGhpcy5wYXJlbnQgIT0gbnVsbCkgJiYga2V5ICE9PSAncGFyZW50Jykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lZGl0b3IgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmVkaXRvci5iaW5kZWRUbyh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMpO1xuICAgICAgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5wYXJlbnQgPSB0aGlzLmluSW5zdGFuY2UuY29udGV4dDtcbiAgICAgIH1cbiAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgIH1cblxuICAgIG9uQWN0aXZhdGlvbktleSgpIHtcbiAgICAgIHRoaXMucHJvY2VzcyA9IG5ldyBQcm9jZXNzKCk7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ2FjdGl2YXRpb24ga2V5Jyk7XG4gICAgICByZXR1cm4gdGhpcy5ydW5BdEN1cnNvclBvcygpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJ1bkF0Q3Vyc29yUG9zKCkge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKHRoaXMuZWRpdG9yLmdldE11bHRpU2VsKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuQXRQb3ModGhpcy5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJ1bkF0UG9zKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMucnVuQXRNdWx0aVBvcyhbcG9zXSk7XG4gICAgfVxuXG4gICAgcnVuQXRNdWx0aVBvcyhtdWx0aVBvcykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgY21kO1xuICAgICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNtZCA9IHRoaXMuY29tbWFuZE9uUG9zKG11bHRpUG9zWzBdLmVuZCk7XG4gICAgICAgICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBjbWQuc2V0TXVsdGlQb3MobXVsdGlQb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY21kLmluaXQoKTtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhjbWQpO1xuICAgICAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtdWx0aVBvc1swXS5zdGFydCA9PT0gbXVsdGlQb3NbMF0uZW5kKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZEJyYWtldHMobXVsdGlQb3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb21tYW5kT25Qb3MocG9zKSB7XG4gICAgICB2YXIgbmV4dCwgcHJldjtcbiAgICAgIGlmICh0aGlzLnByZWNlZGVkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5mb2xsb3dlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09PSAxKSB7XG4gICAgICAgIHByZXYgPSBwb3MgLSB0aGlzLmJyYWtldHMubGVuZ3RoO1xuICAgICAgICBuZXh0ID0gcG9zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMucHJlY2VkZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMCkge1xuICAgICAgICAgIHBvcyAtPSB0aGlzLmJyYWtldHMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHByZXYgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHBvcyk7XG4gICAgICAgIGlmIChwcmV2ID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBuZXh0ID0gdGhpcy5maW5kTmV4dEJyYWtldChwb3MgLSAxKTtcbiAgICAgICAgaWYgKChuZXh0ID09IG51bGwpIHx8IHRoaXMuY291bnRQcmV2QnJha2V0KHByZXYpICUgMiAhPT0gMCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBwcmV2LCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHByZXYsIG5leHQgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSk7XG4gICAgfVxuXG4gICAgbmV4dENtZChzdGFydCA9IDApIHtcbiAgICAgIHZhciBiZWdpbm5pbmcsIGYsIHBvcztcbiAgICAgIHBvcyA9IHN0YXJ0O1xuICAgICAgd2hpbGUgKGYgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW3RoaXMuYnJha2V0cywgXCJcXG5cIl0pKSB7XG4gICAgICAgIHBvcyA9IGYucG9zICsgZi5zdHIubGVuZ3RoO1xuICAgICAgICBpZiAoZi5zdHIgPT09IHRoaXMuYnJha2V0cykge1xuICAgICAgICAgIGlmICh0eXBlb2YgYmVnaW5uaW5nICE9PSBcInVuZGVmaW5lZFwiICYmIGJlZ2lubmluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgYmVnaW5uaW5nLCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKGJlZ2lubmluZywgZi5wb3MgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJlZ2lubmluZyA9IGYucG9zO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiZWdpbm5pbmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRFbmNsb3NpbmdDbWQocG9zID0gMCkge1xuICAgICAgdmFyIGNsb3NpbmdQcmVmaXgsIGNtZCwgY3BvcywgcDtcbiAgICAgIGNwb3MgPSBwb3M7XG4gICAgICBjbG9zaW5nUHJlZml4ID0gdGhpcy5icmFrZXRzICsgdGhpcy5jbG9zZUNoYXI7XG4gICAgICB3aGlsZSAoKHAgPSB0aGlzLmZpbmROZXh0KGNwb3MsIGNsb3NpbmdQcmVmaXgpKSAhPSBudWxsKSB7XG4gICAgICAgIGlmIChjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGgpKSB7XG4gICAgICAgICAgY3BvcyA9IGNtZC5nZXRFbmRQb3MoKTtcbiAgICAgICAgICBpZiAoY21kLnBvcyA8IHBvcykge1xuICAgICAgICAgICAgcmV0dXJuIGNtZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3BvcyA9IHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHJlY2VkZWRCeUJyYWtldHMocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MgLSB0aGlzLmJyYWtldHMubGVuZ3RoLCBwb3MpID09PSB0aGlzLmJyYWtldHM7XG4gICAgfVxuXG4gICAgZm9sbG93ZWRCeUJyYWtldHMocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpID09PSB0aGlzLmJyYWtldHM7XG4gICAgfVxuXG4gICAgY291bnRQcmV2QnJha2V0KHN0YXJ0KSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGkgPSAwO1xuICAgICAgd2hpbGUgKChzdGFydCA9IHRoaXMuZmluZFByZXZCcmFrZXQoc3RhcnQpKSAhPSBudWxsKSB7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIHJldHVybiBpO1xuICAgIH1cblxuICAgIGlzRW5kTGluZShwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcywgcG9zICsgMSkgPT09IFwiXFxuXCIgfHwgcG9zICsgMSA+PSB0aGlzLmVkaXRvci50ZXh0TGVuKCk7XG4gICAgfVxuXG4gICAgZmluZFByZXZCcmFrZXQoc3RhcnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmROZXh0QnJha2V0KHN0YXJ0LCAtMSk7XG4gICAgfVxuXG4gICAgZmluZE5leHRCcmFrZXQoc3RhcnQsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmO1xuICAgICAgZiA9IHRoaXMuZmluZEFueU5leHQoc3RhcnQsIFt0aGlzLmJyYWtldHMsIFwiXFxuXCJdLCBkaXJlY3Rpb24pO1xuICAgICAgaWYgKGYgJiYgZi5zdHIgPT09IHRoaXMuYnJha2V0cykge1xuICAgICAgICByZXR1cm4gZi5wb3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZFByZXYoc3RhcnQsIHN0cmluZykge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHQoc3RhcnQsIHN0cmluZywgLTEpO1xuICAgIH1cblxuICAgIGZpbmROZXh0KHN0YXJ0LCBzdHJpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmO1xuICAgICAgZiA9IHRoaXMuZmluZEFueU5leHQoc3RhcnQsIFtzdHJpbmddLCBkaXJlY3Rpb24pO1xuICAgICAgaWYgKGYpIHtcbiAgICAgICAgcmV0dXJuIGYucG9zO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IuZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgZmluZE1hdGNoaW5nUGFpcihzdGFydFBvcywgb3BlbmluZywgY2xvc2luZywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGYsIG5lc3RlZCwgcG9zO1xuICAgICAgcG9zID0gc3RhcnRQb3M7XG4gICAgICBuZXN0ZWQgPSAwO1xuICAgICAgd2hpbGUgKGYgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW2Nsb3NpbmcsIG9wZW5pbmddLCBkaXJlY3Rpb24pKSB7XG4gICAgICAgIHBvcyA9IGYucG9zICsgKGRpcmVjdGlvbiA+IDAgPyBmLnN0ci5sZW5ndGggOiAwKTtcbiAgICAgICAgaWYgKGYuc3RyID09PSAoZGlyZWN0aW9uID4gMCA/IGNsb3NpbmcgOiBvcGVuaW5nKSkge1xuICAgICAgICAgIGlmIChuZXN0ZWQgPiAwKSB7XG4gICAgICAgICAgICBuZXN0ZWQtLTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGY7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5lc3RlZCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBhZGRCcmFrZXRzKHBvcykge1xuICAgICAgdmFyIHJlcGxhY2VtZW50cztcbiAgICAgIHBvcyA9IG5ldyBQb3NDb2xsZWN0aW9uKHBvcyk7XG4gICAgICByZXBsYWNlbWVudHMgPSBwb3Mud3JhcCh0aGlzLmJyYWtldHMsIHRoaXMuYnJha2V0cykubWFwKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgcmV0dXJuIHIuc2VsZWN0Q29udGVudCgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgICB9XG5cbiAgICBwcm9tcHRDbG9zaW5nQ21kKHNlbGVjdGlvbnMpIHtcbiAgICAgIGlmICh0aGlzLmNsb3NpbmdQcm9tcCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY2xvc2luZ1Byb21wLnN0b3AoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcC5uZXdGb3IodGhpcywgc2VsZWN0aW9ucykuYmVnaW4oKTtcbiAgICB9XG5cbiAgICBwYXJzZUFsbChyZWN1cnNpdmUgPSB0cnVlKSB7XG4gICAgICB2YXIgY21kLCBwYXJzZXIsIHBvcywgcmVzO1xuICAgICAgaWYgKHRoaXMubmVzdGVkID4gMTAwKSB7XG4gICAgICAgIHRocm93IFwiSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb25cIjtcbiAgICAgIH1cbiAgICAgIHBvcyA9IDA7XG4gICAgICB3aGlsZSAoY21kID0gdGhpcy5uZXh0Q21kKHBvcykpIHtcbiAgICAgICAgcG9zID0gY21kLmdldEVuZFBvcygpO1xuICAgICAgICB0aGlzLmVkaXRvci5zZXRDdXJzb3JQb3MocG9zKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coY21kKVxuICAgICAgICBjbWQuaW5pdCgpO1xuICAgICAgICBpZiAocmVjdXJzaXZlICYmIChjbWQuY29udGVudCAhPSBudWxsKSAmJiAoKGNtZC5nZXRDbWQoKSA9PSBudWxsKSB8fCAhY21kLmdldE9wdGlvbigncHJldmVudFBhcnNlQWxsJykpKSB7XG4gICAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge1xuICAgICAgICAgICAgcGFyZW50OiB0aGlzXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY21kLmNvbnRlbnQgPSBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBjbWQuZXhlY3V0ZSgpO1xuICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAocmVzLnRoZW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3luYyBuZXN0ZWQgY29tbWFuZHMgYXJlIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNtZC5yZXBsYWNlRW5kICE9IG51bGwpIHtcbiAgICAgICAgICAgIHBvcyA9IGNtZC5yZXBsYWNlRW5kO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3MgPSB0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKS5lbmQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5nZXRUZXh0KCk7XG4gICAgfVxuXG4gICAgZ2V0VGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0KCk7XG4gICAgfVxuXG4gICAgaXNSb290KCkge1xuICAgICAgcmV0dXJuICh0aGlzLnBhcmVudCA9PSBudWxsKSAmJiAoKHRoaXMuaW5JbnN0YW5jZSA9PSBudWxsKSB8fCAodGhpcy5pbkluc3RhbmNlLmZpbmRlciA9PSBudWxsKSk7XG4gICAgfVxuXG4gICAgZ2V0Um9vdCgpIHtcbiAgICAgIGlmICh0aGlzLmlzUm9vdCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Um9vdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVDYXJyZXQodHh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsIHRoaXMuY2FycmV0Q2hhcik7XG4gICAgfVxuXG4gICAgZ2V0Q2FycmV0UG9zKHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRDYXJyZXRQb3ModHh0LCB0aGlzLmNhcnJldENoYXIpO1xuICAgIH1cblxuICAgIHJlZ01hcmtlcihmbGFncyA9IFwiZ1wiKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMubWFya2VyKSwgZmxhZ3MpO1xuICAgIH1cblxuICAgIHJlbW92ZU1hcmtlcnModGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSh0aGlzLnJlZ01hcmtlcigpLCAnJyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXQoKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGVkKSB7XG4gICAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgQ29tbWFuZC5pbml0Q21kcygpO1xuICAgICAgICByZXR1cm4gQ29tbWFuZC5sb2FkQ21kcygpO1xuICAgICAgfVxuICAgIH1cblxuICB9O1xuXG4gIENvZGV3YXZlLmluaXRlZCA9IGZhbHNlO1xuXG4gIHJldHVybiBDb2Rld2F2ZTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBTdG9yYWdlIH0gZnJvbSAnLi9TdG9yYWdlJztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5cbl9vcHRLZXkgPSAoa2V5LGRpY3QsZGVmVmFsID0gbnVsbCkgLT5cbiAgIyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICByZXR1cm4gaWYga2V5IG9mIGRpY3QgdGhlbiBkaWN0W2tleV0gZWxzZSBkZWZWYWxcblxuXG5leHBvcnQgY2xhc3MgQ29tbWFuZFxuICBjb25zdHJ1Y3RvcjogKEBuYW1lLEBkYXRhPW51bGwscGFyZW50PW51bGwpIC0+XG4gICAgQGNtZHMgPSBbXVxuICAgIEBkZXRlY3RvcnMgPSBbXVxuICAgIEBleGVjdXRlRnVuY3QgPSBAcmVzdWx0RnVuY3QgPSBAcmVzdWx0U3RyID0gQGFsaWFzT2YgPSBAY2xzID0gbnVsbFxuICAgIEBhbGlhc2VkID0gbnVsbFxuICAgIEBmdWxsTmFtZSA9IEBuYW1lXG4gICAgQGRlcHRoID0gMFxuICAgIFtAX3BhcmVudCwgQF9pbml0ZWRdID0gW251bGwsIGZhbHNlXVxuICAgIEBzZXRQYXJlbnQocGFyZW50KVxuICAgIEBkZWZhdWx0cyA9IHt9XG4gICAgXG4gICAgQGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgIHBhcnNlOiBmYWxzZSxcbiAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICBhbHRlclJlc3VsdDogbnVsbCxcbiAgICAgIHByZXZlbnRQYXJzZUFsbDogZmFsc2UsXG4gICAgICByZXBsYWNlQm94OiBmYWxzZSxcbiAgICB9XG4gICAgQG9wdGlvbnMgPSB7fVxuICAgIEBmaW5hbE9wdGlvbnMgPSBudWxsXG4gIHBhcmVudDogLT5cbiAgICByZXR1cm4gQF9wYXJlbnRcbiAgc2V0UGFyZW50OiAodmFsdWUpIC0+XG4gICAgaWYgQF9wYXJlbnQgIT0gdmFsdWVcbiAgICAgIEBfcGFyZW50ID0gdmFsdWVcbiAgICAgIEBmdWxsTmFtZSA9IChcbiAgICAgICAgaWYgQF9wYXJlbnQ/IGFuZCBAX3BhcmVudC5uYW1lP1xuICAgICAgICAgIEBfcGFyZW50LmZ1bGxOYW1lICsgJzonICsgQG5hbWUgXG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgQG5hbWVcbiAgICAgIClcbiAgICAgIEBkZXB0aCA9IChcbiAgICAgICAgaWYgQF9wYXJlbnQ/IGFuZCBAX3BhcmVudC5kZXB0aD9cbiAgICAgICAgdGhlbiBAX3BhcmVudC5kZXB0aCArIDFcbiAgICAgICAgZWxzZSAwXG4gICAgICApXG4gIGluaXQ6IC0+XG4gICAgaWYgIUBfaW5pdGVkXG4gICAgICBAX2luaXRlZCA9IHRydWVcbiAgICAgIEBwYXJzZURhdGEoQGRhdGEpXG4gICAgcmV0dXJuIHRoaXNcbiAgdW5yZWdpc3RlcjogLT5cbiAgICBAX3BhcmVudC5yZW1vdmVDbWQodGhpcylcbiAgaXNFZGl0YWJsZTogLT5cbiAgICByZXR1cm4gQHJlc3VsdFN0cj8gb3IgQGFsaWFzT2Y/XG4gIGlzRXhlY3V0YWJsZTogLT5cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICBmb3IgcCBpbiBbJ3Jlc3VsdFN0cicsJ3Jlc3VsdEZ1bmN0JywnY2xzJywnZXhlY3V0ZUZ1bmN0J11cbiAgICAgIGlmIHRoaXNbcF0/XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIGlzRXhlY3V0YWJsZVdpdGhOYW1lOiAobmFtZSkgLT5cbiAgICBpZiBAYWxpYXNPZj9cbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICBhbGlhc09mID0gQGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJyxuYW1lKVxuICAgICAgYWxpYXNlZCA9IEBfYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBAaXNFeGVjdXRhYmxlKClcbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgIGZvciBwIGluIFsncmVzdWx0U3RyJywncmVzdWx0RnVuY3QnXVxuICAgICAgaWYgdGhpc1twXT9cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgcmVzID0ge31cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGRlZmF1bHRzKVxuICAgIHJldHVybiByZXNcbiAgX2FsaWFzZWRGcm9tRmluZGVyOiAoZmluZGVyKSAtPlxuICAgICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlXG4gICAgICBmaW5kZXIubXVzdEV4ZWN1dGUgPSBmYWxzZVxuICAgICAgZmluZGVyLnVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICByZXR1cm4gZmluZGVyLmZpbmQoKVxuICBnZXRBbGlhc2VkOiAtPlxuICAgIGlmIEBhbGlhc09mP1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgIHJldHVybiBAX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKEBhbGlhc09mKSlcbiAgc2V0T3B0aW9uczogKGRhdGEpIC0+XG4gICAgZm9yIGtleSwgdmFsIG9mIGRhdGFcbiAgICAgIGlmIGtleSBvZiBAZGVmYXVsdE9wdGlvbnNcbiAgICAgICAgQG9wdGlvbnNba2V5XSA9IHZhbFxuICBfb3B0aW9uc0ZvckFsaWFzZWQ6IChhbGlhc2VkKSAtPlxuICAgIG9wdCA9IHt9XG4gICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsQGRlZmF1bHRPcHRpb25zKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxhbGlhc2VkLmdldE9wdGlvbnMoKSlcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihvcHQsQG9wdGlvbnMpXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIEBfb3B0aW9uc0ZvckFsaWFzZWQoQGdldEFsaWFzZWQoKSlcbiAgZ2V0T3B0aW9uOiAoa2V5KSAtPlxuICAgIG9wdGlvbnMgPSBAZ2V0T3B0aW9ucygpXG4gICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV1cbiAgaGVscDogLT5cbiAgICBjbWQgPSBAZ2V0Q21kKCdoZWxwJylcbiAgICBpZiBjbWQ/XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHJcbiAgcGFyc2VEYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IGRhdGFcbiAgICBpZiB0eXBlb2YgZGF0YSA9PSAnc3RyaW5nJ1xuICAgICAgQHJlc3VsdFN0ciA9IGRhdGFcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlIGlmIGRhdGE/XG4gICAgICByZXR1cm4gQHBhcnNlRGljdERhdGEoZGF0YSlcbiAgICByZXR1cm4gZmFsc2VcbiAgcGFyc2VEaWN0RGF0YTogKGRhdGEpIC0+XG4gICAgcmVzID0gX29wdEtleSgncmVzdWx0JyxkYXRhKVxuICAgIGlmIHR5cGVvZiByZXMgPT0gXCJmdW5jdGlvblwiXG4gICAgICBAcmVzdWx0RnVuY3QgPSByZXNcbiAgICBlbHNlIGlmIHJlcz9cbiAgICAgIEByZXN1bHRTdHIgPSByZXNcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJyxkYXRhKVxuICAgIGlmIHR5cGVvZiBleGVjdXRlID09IFwiZnVuY3Rpb25cIlxuICAgICAgQGV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGVcbiAgICBAYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLGRhdGEpXG4gICAgQGNscyA9IF9vcHRLZXkoJ2NscycsZGF0YSlcbiAgICBAZGVmYXVsdHMgPSBfb3B0S2V5KCdkZWZhdWx0cycsZGF0YSxAZGVmYXVsdHMpXG4gICAgXG4gICAgQHNldE9wdGlvbnMoZGF0YSlcbiAgICBcbiAgICBpZiAnaGVscCcgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsZGF0YVsnaGVscCddLHRoaXMpKVxuICAgIGlmICdmYWxsYmFjaycgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLGRhdGFbJ2ZhbGxiYWNrJ10sdGhpcykpXG4gICAgICBcbiAgICBpZiAnY21kcycgb2YgZGF0YVxuICAgICAgQGFkZENtZHMoZGF0YVsnY21kcyddKVxuICAgIHJldHVybiB0cnVlXG4gIGFkZENtZHM6IChjbWRzKSAtPlxuICAgIGZvciBuYW1lLCBkYXRhIG9mIGNtZHNcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQobmFtZSxkYXRhLHRoaXMpKVxuICBhZGRDbWQ6IChjbWQpIC0+XG4gICAgZXhpc3RzID0gQGdldENtZChjbWQubmFtZSlcbiAgICBpZiBleGlzdHM/XG4gICAgICBAcmVtb3ZlQ21kKGV4aXN0cylcbiAgICBjbWQuc2V0UGFyZW50KHRoaXMpXG4gICAgQGNtZHMucHVzaChjbWQpXG4gICAgcmV0dXJuIGNtZFxuICByZW1vdmVDbWQ6IChjbWQpIC0+XG4gICAgaWYgKGkgPSBAY21kcy5pbmRleE9mKGNtZCkpID4gLTFcbiAgICAgIEBjbWRzLnNwbGljZShpLCAxKVxuICAgIHJldHVybiBjbWRcbiAgZ2V0Q21kOiAoZnVsbG5hbWUpIC0+XG4gICAgQGluaXQoKVxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgcmV0dXJuIEBnZXRDbWQoc3BhY2UpPy5nZXRDbWQobmFtZSlcbiAgICBmb3IgY21kIGluIEBjbWRzXG4gICAgICBpZiBjbWQubmFtZSA9PSBuYW1lXG4gICAgICAgIHJldHVybiBjbWRcbiAgc2V0Q21kRGF0YTogKGZ1bGxuYW1lLGRhdGEpIC0+XG4gICAgQHNldENtZChmdWxsbmFtZSxuZXcgQ29tbWFuZChmdWxsbmFtZS5zcGxpdCgnOicpLnBvcCgpLGRhdGEpKVxuICBzZXRDbWQ6IChmdWxsbmFtZSxjbWQpIC0+XG4gICAgW3NwYWNlLG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpXG4gICAgaWYgc3BhY2U/XG4gICAgICBuZXh0ID0gQGdldENtZChzcGFjZSlcbiAgICAgIHVubGVzcyBuZXh0P1xuICAgICAgICBuZXh0ID0gQGFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpXG4gICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSxjbWQpXG4gICAgZWxzZVxuICAgICAgQGFkZENtZChjbWQpXG4gICAgICByZXR1cm4gY21kXG4gIGFkZERldGVjdG9yOiAoZGV0ZWN0b3IpIC0+XG4gICAgQGRldGVjdG9ycy5wdXNoKGRldGVjdG9yKVxuICAgIFxuICBAcHJvdmlkZXJzID0gW11cblxuICBAc3RvcmFnZSA9IG5ldyBTdG9yYWdlKClcblxuICBAaW5pdENtZHM6IC0+XG4gICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCx7XG4gICAgICAnY21kcyc6e1xuICAgICAgICAnaGVsbG8nOntcbiAgICAgICAgICBoZWxwOiBcIlwiXCJcbiAgICAgICAgICBcIkhlbGxvLCB3b3JsZCFcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxuICAgICAgICAgIG1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xuICAgICAgICAgIHZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYVxuICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGZvciBwcm92aWRlciBpbiBAcHJvdmlkZXJzXG4gICAgICBwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpXG5cbiAgQHNhdmVDbWQ6IChmdWxsbmFtZSwgZGF0YSkgLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSxkYXRhKVxuICAgIC50aGVuID0+XG4gICAgICBAc3RvcmFnZS5zYXZlSW5QYXRoKCdjbWRzJywgZnVsbG5hbWUsIGRhdGEpXG5cbiAgQGxvYWRDbWRzOiAtPlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgIHNhdmVkQ21kcyA9IEBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgIC50aGVuIChzYXZlZENtZHMpPT5cbiAgICAgIGlmIHNhdmVkQ21kcz8gXG4gICAgICAgIGZvciBmdWxsbmFtZSwgZGF0YSBvZiBzYXZlZENtZHNcbiAgICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSlcblxuICBAcmVzZXRTYXZlZDogLT5cbiAgICBAc3RvcmFnZS5zYXZlKCdjbWRzJyx7fSlcblxuICBAbWFrZVZhckNtZCA9IChuYW1lLGJhc2U9e30pIC0+IFxuICAgIGJhc2UuZXhlY3V0ZSA9IChpbnN0YW5jZSkgLT5cbiAgICAgIHZhbCA9IGlmIChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpP1xuICAgICAgICBwXG4gICAgICBlbHNlIGlmIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgICAgaW5zdGFuY2UuY29udGVudFxuICAgICAgaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHZhbCBpZiB2YWw/XG4gICAgcmV0dXJuIGJhc2VcblxuICBAbWFrZUJvb2xWYXJDbWQgPSAobmFtZSxiYXNlPXt9KSAtPiBcbiAgICBiYXNlLmV4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHVubGVzcyB2YWw/IGFuZCB2YWwgaW4gWycwJywnZmFsc2UnLCdubyddXG4gICAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlXG4gICAgcmV0dXJuIGJhc2VcbiAgXG5cbmV4cG9ydCBjbGFzcyBCYXNlQ29tbWFuZFxuICBjb25zdHJ1Y3RvcjogKEBpbnN0YW5jZSkgLT5cbiAgaW5pdDogLT5cbiAgICAjXG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIHJldHVybiB0aGlzW1wicmVzdWx0XCJdP1xuICBnZXREZWZhdWx0czogLT5cbiAgICByZXR1cm4ge31cbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4ge31cbiAgICAgICIsInZhciBfb3B0S2V5O1xuXG5pbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIFN0b3JhZ2Vcbn0gZnJvbSAnLi9TdG9yYWdlJztcblxuaW1wb3J0IHtcbiAgTmFtZXNwYWNlSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5fb3B0S2V5ID0gZnVuY3Rpb24oa2V5LCBkaWN0LCBkZWZWYWwgPSBudWxsKSB7XG4gIC8vIG9wdGlvbmFsIERpY3Rpb25hcnkga2V5XG4gIGlmIChrZXkgaW4gZGljdCkge1xuICAgIHJldHVybiBkaWN0W2tleV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRlZlZhbDtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBDb21tYW5kID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lMSwgZGF0YTEgPSBudWxsLCBwYXJlbnQgPSBudWxsKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lMTtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGExO1xuICAgICAgdGhpcy5jbWRzID0gW107XG4gICAgICB0aGlzLmRldGVjdG9ycyA9IFtdO1xuICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSB0aGlzLnJlc3VsdEZ1bmN0ID0gdGhpcy5yZXN1bHRTdHIgPSB0aGlzLmFsaWFzT2YgPSB0aGlzLmNscyA9IG51bGw7XG4gICAgICB0aGlzLmFsaWFzZWQgPSBudWxsO1xuICAgICAgdGhpcy5mdWxsTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgIHRoaXMuZGVwdGggPSAwO1xuICAgICAgW3RoaXMuX3BhcmVudCwgdGhpcy5faW5pdGVkXSA9IFtudWxsLCBmYWxzZV07XG4gICAgICB0aGlzLnNldFBhcmVudChwYXJlbnQpO1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IHt9O1xuICAgICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgICBwYXJzZTogZmFsc2UsXG4gICAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgICByZXBsYWNlQm94OiBmYWxzZVxuICAgICAgfTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgICAgdGhpcy5maW5hbE9wdGlvbnMgPSBudWxsO1xuICAgIH1cblxuICAgIHBhcmVudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgfVxuXG4gICAgc2V0UGFyZW50KHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5fcGFyZW50ICE9PSB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5mdWxsTmFtZSA9ICgodGhpcy5fcGFyZW50ICE9IG51bGwpICYmICh0aGlzLl9wYXJlbnQubmFtZSAhPSBudWxsKSA/IHRoaXMuX3BhcmVudC5mdWxsTmFtZSArICc6JyArIHRoaXMubmFtZSA6IHRoaXMubmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlcHRoID0gKCh0aGlzLl9wYXJlbnQgIT0gbnVsbCkgJiYgKHRoaXMuX3BhcmVudC5kZXB0aCAhPSBudWxsKSA/IHRoaXMuX3BhcmVudC5kZXB0aCArIDEgOiAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wYXJzZURhdGEodGhpcy5kYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50LnJlbW92ZUNtZCh0aGlzKTtcbiAgICB9XG5cbiAgICBpc0VkaXRhYmxlKCkge1xuICAgICAgcmV0dXJuICh0aGlzLnJlc3VsdFN0ciAhPSBudWxsKSB8fCAodGhpcy5hbGlhc09mICE9IG51bGwpO1xuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZSgpIHtcbiAgICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZjtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgICAgfVxuICAgICAgcmVmID0gWydyZXN1bHRTdHInLCAncmVzdWx0RnVuY3QnLCAnY2xzJywgJ2V4ZWN1dGVGdW5jdCddO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal07XG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWUpIHtcbiAgICAgIHZhciBhbGlhc09mLCBhbGlhc2VkLCBjb250ZXh0O1xuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgICBhbGlhc09mID0gdGhpcy5hbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIG5hbWUpO1xuICAgICAgICBhbGlhc2VkID0gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpO1xuICAgICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmlzRXhlY3V0YWJsZSgpO1xuICAgIH1cblxuICAgIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmO1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuICAgICAgcmVmID0gWydyZXN1bHRTdHInLCAncmVzdWx0RnVuY3QnXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcmVmW2pdO1xuICAgICAgICBpZiAodGhpc1twXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXREZWZhdWx0cygpIHtcbiAgICAgIHZhciBhbGlhc2VkLCByZXM7XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5kZWZhdWx0cyk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIF9hbGlhc2VkRnJvbUZpbmRlcihmaW5kZXIpIHtcbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZTtcbiAgICAgIGZpbmRlci5tdXN0RXhlY3V0ZSA9IGZhbHNlO1xuICAgICAgZmluZGVyLnVzZURldGVjdG9ycyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKCk7XG4gICAgfVxuXG4gICAgZ2V0QWxpYXNlZCgpIHtcbiAgICAgIHZhciBjb250ZXh0O1xuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIodGhpcy5hbGlhc09mKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0T3B0aW9ucyhkYXRhKSB7XG4gICAgICB2YXIga2V5LCByZXN1bHRzLCB2YWw7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG4gICAgICAgIHZhbCA9IGRhdGFba2V5XTtcbiAgICAgICAgaWYgKGtleSBpbiB0aGlzLmRlZmF1bHRPcHRpb25zKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMub3B0aW9uc1trZXldID0gdmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgX29wdGlvbnNGb3JBbGlhc2VkKGFsaWFzZWQpIHtcbiAgICAgIHZhciBvcHQ7XG4gICAgICBvcHQgPSB7fTtcbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmRlZmF1bHRPcHRpb25zKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIGFsaWFzZWQuZ2V0T3B0aW9ucygpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5vcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb25zKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb24oa2V5KSB7XG4gICAgICB2YXIgb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhlbHAoKSB7XG4gICAgICB2YXIgY21kO1xuICAgICAgY21kID0gdGhpcy5nZXRDbWQoJ2hlbHAnKTtcbiAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VEYXRhKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gZGF0YTtcbiAgICAgICAgdGhpcy5vcHRpb25zWydwYXJzZSddID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGRhdGEgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURpY3REYXRhKGRhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHBhcnNlRGljdERhdGEoZGF0YSkge1xuICAgICAgdmFyIGV4ZWN1dGUsIHJlcztcbiAgICAgIHJlcyA9IF9vcHRLZXkoJ3Jlc3VsdCcsIGRhdGEpO1xuICAgICAgaWYgKHR5cGVvZiByZXMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLnJlc3VsdEZ1bmN0ID0gcmVzO1xuICAgICAgfSBlbHNlIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IHJlcztcbiAgICAgICAgdGhpcy5vcHRpb25zWydwYXJzZSddID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJywgZGF0YSk7XG4gICAgICBpZiAodHlwZW9mIGV4ZWN1dGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLmV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGU7XG4gICAgICB9XG4gICAgICB0aGlzLmFsaWFzT2YgPSBfb3B0S2V5KCdhbGlhc09mJywgZGF0YSk7XG4gICAgICB0aGlzLmNscyA9IF9vcHRLZXkoJ2NscycsIGRhdGEpO1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IF9vcHRLZXkoJ2RlZmF1bHRzJywgZGF0YSwgdGhpcy5kZWZhdWx0cyk7XG4gICAgICB0aGlzLnNldE9wdGlvbnMoZGF0YSk7XG4gICAgICBpZiAoJ2hlbHAnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLCBkYXRhWydoZWxwJ10sIHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIGlmICgnZmFsbGJhY2snIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2ZhbGxiYWNrJywgZGF0YVsnZmFsbGJhY2snXSwgdGhpcykpO1xuICAgICAgfVxuICAgICAgaWYgKCdjbWRzJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kcyhkYXRhWydjbWRzJ10pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYWRkQ21kcyhjbWRzKSB7XG4gICAgICB2YXIgZGF0YSwgbmFtZSwgcmVzdWx0cztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAobmFtZSBpbiBjbWRzKSB7XG4gICAgICAgIGRhdGEgPSBjbWRzW25hbWVdO1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGRDbWQobmV3IENvbW1hbmQobmFtZSwgZGF0YSwgdGhpcykpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIGFkZENtZChjbWQpIHtcbiAgICAgIHZhciBleGlzdHM7XG4gICAgICBleGlzdHMgPSB0aGlzLmdldENtZChjbWQubmFtZSk7XG4gICAgICBpZiAoZXhpc3RzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbWQoZXhpc3RzKTtcbiAgICAgIH1cbiAgICAgIGNtZC5zZXRQYXJlbnQodGhpcyk7XG4gICAgICB0aGlzLmNtZHMucHVzaChjbWQpO1xuICAgICAgcmV0dXJuIGNtZDtcbiAgICB9XG5cbiAgICByZW1vdmVDbWQoY21kKSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmICgoaSA9IHRoaXMuY21kcy5pbmRleE9mKGNtZCkpID4gLTEpIHtcbiAgICAgICAgdGhpcy5jbWRzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjbWQ7XG4gICAgfVxuXG4gICAgZ2V0Q21kKGZ1bGxuYW1lKSB7XG4gICAgICB2YXIgY21kLCBqLCBsZW4sIG5hbWUsIHJlZiwgcmVmMSwgc3BhY2U7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gKHJlZiA9IHRoaXMuZ2V0Q21kKHNwYWNlKSkgIT0gbnVsbCA/IHJlZi5nZXRDbWQobmFtZSkgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgICByZWYxID0gdGhpcy5jbWRzO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmMS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBjbWQgPSByZWYxW2pdO1xuICAgICAgICBpZiAoY21kLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gY21kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0Q21kKGZ1bGxuYW1lLCBuZXcgQ29tbWFuZChmdWxsbmFtZS5zcGxpdCgnOicpLnBvcCgpLCBkYXRhKSk7XG4gICAgfVxuXG4gICAgc2V0Q21kKGZ1bGxuYW1lLCBjbWQpIHtcbiAgICAgIHZhciBuYW1lLCBuZXh0LCBzcGFjZTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgICBuZXh0ID0gdGhpcy5nZXRDbWQoc3BhY2UpO1xuICAgICAgICBpZiAobmV4dCA9PSBudWxsKSB7XG4gICAgICAgICAgbmV4dCA9IHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKHNwYWNlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5leHQuc2V0Q21kKG5hbWUsIGNtZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFkZENtZChjbWQpO1xuICAgICAgICByZXR1cm4gY21kO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZERldGVjdG9yKGRldGVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXRlY3RvcnMucHVzaChkZXRlY3Rvcik7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXRDbWRzKCkge1xuICAgICAgdmFyIGosIGxlbiwgcHJvdmlkZXIsIHJlZiwgcmVzdWx0cztcbiAgICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwsIHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ2hlbGxvJzoge1xuICAgICAgICAgICAgaGVscDogXCJcXFwiSGVsbG8sIHdvcmxkIVxcXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cXG5tb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cXG52ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWFcIixcbiAgICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlZiA9IHRoaXMucHJvdmlkZXJzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHByb3ZpZGVyID0gcmVmW2pdO1xuICAgICAgICByZXN1bHRzLnB1c2gocHJvdmlkZXIucmVnaXN0ZXIoQ29tbWFuZC5jbWRzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBzdGF0aWMgc2F2ZUNtZChmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZUluUGF0aCgnY21kcycsIGZ1bGxuYW1lLCBkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBsb2FkQ21kcygpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcztcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHRoaXMuc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gICAgICB9KS50aGVuKChzYXZlZENtZHMpID0+IHtcbiAgICAgICAgdmFyIGRhdGEsIGZ1bGxuYW1lLCByZXN1bHRzO1xuICAgICAgICBpZiAoc2F2ZWRDbWRzICE9IG51bGwpIHtcbiAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChmdWxsbmFtZSBpbiBzYXZlZENtZHMpIHtcbiAgICAgICAgICAgIGRhdGEgPSBzYXZlZENtZHNbZnVsbG5hbWVdO1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXRTYXZlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZSgnY21kcycsIHt9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZVZhckNtZChuYW1lLCBiYXNlID0ge30pIHtcbiAgICAgIGJhc2UuZXhlY3V0ZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBwLCB2YWw7XG4gICAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gICAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIG1ha2VCb29sVmFyQ21kKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHAsIHZhbDtcbiAgICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcbiAgICAgICAgaWYgKCEoKHZhbCAhPSBudWxsKSAmJiAodmFsID09PSAnMCcgfHwgdmFsID09PSAnZmFsc2UnIHx8IHZhbCA9PT0gJ25vJykpKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuXG4gIH07XG5cbiAgQ29tbWFuZC5wcm92aWRlcnMgPSBbXTtcblxuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpO1xuXG4gIHJldHVybiBDb21tYW5kO1xuXG59KS5jYWxsKHRoaXMpO1xuXG5leHBvcnQgdmFyIEJhc2VDb21tYW5kID0gY2xhc3MgQmFzZUNvbW1hbmQge1xuICBjb25zdHJ1Y3RvcihpbnN0YW5jZTEpIHtcbiAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2UxO1xuICB9XG5cbiAgaW5pdCgpIHt9XG5cbiAgXG4gIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgIHJldHVybiB0aGlzW1wicmVzdWx0XCJdICE9IG51bGw7XG4gIH1cblxuICBnZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDbWRGaW5kZXIgfSBmcm9tICcuL0NtZEZpbmRlcic7XG5pbXBvcnQgeyBDbWRJbnN0YW5jZSB9IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgQ29udGV4dFxuICBjb25zdHJ1Y3RvcjogKEBjb2Rld2F2ZSkgLT5cbiAgICBAbmFtZVNwYWNlcyA9IFtdXG4gIFxuICBhZGROYW1lU3BhY2U6IChuYW1lKSAtPlxuICAgIGlmIG5hbWUgbm90IGluIEBuYW1lU3BhY2VzIFxuICAgICAgQG5hbWVTcGFjZXMucHVzaChuYW1lKVxuICAgICAgQF9uYW1lc3BhY2VzID0gbnVsbFxuICBhZGROYW1lc3BhY2VzOiAoc3BhY2VzKSAtPlxuICAgIGlmIHNwYWNlcyBcbiAgICAgIGlmIHR5cGVvZiBzcGFjZXMgPT0gJ3N0cmluZydcbiAgICAgICAgc3BhY2VzID0gW3NwYWNlc11cbiAgICAgIGZvciBzcGFjZSBpbiBzcGFjZXMgXG4gICAgICAgIEBhZGROYW1lU3BhY2Uoc3BhY2UpXG4gIHJlbW92ZU5hbWVTcGFjZTogKG5hbWUpIC0+XG4gICAgQG5hbWVTcGFjZXMgPSBAbmFtZVNwYWNlcy5maWx0ZXIgKG4pIC0+IG4gaXNudCBuYW1lXG5cbiAgZ2V0TmFtZVNwYWNlczogLT5cbiAgICB1bmxlc3MgQF9uYW1lc3BhY2VzP1xuICAgICAgbnBjcyA9IFsnY29yZSddLmNvbmNhdChAbmFtZVNwYWNlcylcbiAgICAgIGlmIEBwYXJlbnQ/XG4gICAgICAgIG5wY3MgPSBucGNzLmNvbmNhdChAcGFyZW50LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgIEBfbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLnVuaXF1ZShucGNzKVxuICAgIHJldHVybiBAX25hbWVzcGFjZXNcbiAgZ2V0Q21kOiAoY21kTmFtZSxuYW1lU3BhY2VzID0gW10pIC0+XG4gICAgZmluZGVyID0gQGdldEZpbmRlcihjbWROYW1lLG5hbWVTcGFjZXMpXG4gICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSxuYW1lU3BhY2VzID0gW10pIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogbmFtZVNwYWNlc1xuICAgICAgdXNlRGV0ZWN0b3JzOiBAaXNSb290KClcbiAgICAgIGNvZGV3YXZlOiBAY29kZXdhdmVcbiAgICAgIHBhcmVudENvbnRleHQ6IHRoaXNcbiAgICB9KVxuICBpc1Jvb3Q6IC0+XG4gICAgcmV0dXJuICFAcGFyZW50P1xuICB3cmFwQ29tbWVudDogKHN0cikgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgY2MuaW5kZXhPZignJXMnKSA+IC0xXG4gICAgICByZXR1cm4gY2MucmVwbGFjZSgnJXMnLHN0cilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHIgKyAnICcgKyBjY1xuICB3cmFwQ29tbWVudExlZnQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gY2Muc3Vic3RyKDAsaSkgKyBzdHJcbiAgICBlbHNlXG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHJcbiAgd3JhcENvbW1lbnRSaWdodDogKHN0ciA9ICcnKSAtPlxuICAgIGNjID0gQGdldENvbW1lbnRDaGFyKClcbiAgICBpZiAoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTFcbiAgICAgIHJldHVybiBzdHIgKyBjYy5zdWJzdHIoaSsyKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBzdHIgKyAnICcgKyBjY1xuICBjbWRJbnN0YW5jZUZvcjogKGNtZCkgLT5cbiAgICByZXR1cm4gbmV3IENtZEluc3RhbmNlKGNtZCx0aGlzKVxuICBnZXRDb21tZW50Q2hhcjogLT5cbiAgICBpZiBAY29tbWVudENoYXI/XG4gICAgICByZXR1cm4gQGNvbW1lbnRDaGFyXG4gICAgY21kID0gQGdldENtZCgnY29tbWVudCcpXG4gICAgY2hhciA9ICc8IS0tICVzIC0tPidcbiAgICBpZiBjbWQ/XG4gICAgICBpbnN0ID0gQGNtZEluc3RhbmNlRm9yKGNtZClcbiAgICAgIGluc3QuY29udGVudCA9ICclcydcbiAgICAgIHJlcyA9IGluc3QucmVzdWx0KClcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgY2hhciA9IHJlc1xuICAgIEBjb21tZW50Q2hhciA9IGNoYXJcbiAgICByZXR1cm4gQGNvbW1lbnRDaGFyIiwidmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xuXG5pbXBvcnQge1xuICBDbWRGaW5kZXJcbn0gZnJvbSAnLi9DbWRGaW5kZXInO1xuXG5pbXBvcnQge1xuICBDbWRJbnN0YW5jZVxufSBmcm9tICcuL0NtZEluc3RhbmNlJztcblxuaW1wb3J0IHtcbiAgQXJyYXlIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcblxuZXhwb3J0IHZhciBDb250ZXh0ID0gY2xhc3MgQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlKSB7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlO1xuICAgIHRoaXMubmFtZVNwYWNlcyA9IFtdO1xuICB9XG5cbiAgYWRkTmFtZVNwYWNlKG5hbWUpIHtcbiAgICBpZiAoaW5kZXhPZi5jYWxsKHRoaXMubmFtZVNwYWNlcywgbmFtZSkgPCAwKSB7XG4gICAgICB0aGlzLm5hbWVTcGFjZXMucHVzaChuYW1lKTtcbiAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2VzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGROYW1lc3BhY2VzKHNwYWNlcykge1xuICAgIHZhciBqLCBsZW4sIHJlc3VsdHMsIHNwYWNlO1xuICAgIGlmIChzcGFjZXMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3BhY2VzID09PSAnc3RyaW5nJykge1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHNwYWNlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBzcGFjZSA9IHNwYWNlc1tqXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuYWRkTmFtZVNwYWNlKHNwYWNlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICByZW1vdmVOYW1lU3BhY2UobmFtZSkge1xuICAgIHJldHVybiB0aGlzLm5hbWVTcGFjZXMgPSB0aGlzLm5hbWVTcGFjZXMuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuICE9PSBuYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TmFtZVNwYWNlcygpIHtcbiAgICB2YXIgbnBjcztcbiAgICBpZiAodGhpcy5fbmFtZXNwYWNlcyA9PSBudWxsKSB7XG4gICAgICBucGNzID0gWydjb3JlJ10uY29uY2F0KHRoaXMubmFtZVNwYWNlcyk7XG4gICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICBucGNzID0gbnBjcy5jb25jYXQodGhpcy5wYXJlbnQuZ2V0TmFtZVNwYWNlcygpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX25hbWVzcGFjZXMgPSBBcnJheUhlbHBlci51bmlxdWUobnBjcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2VzO1xuICB9XG5cbiAgZ2V0Q21kKGNtZE5hbWUsIG5hbWVTcGFjZXMgPSBbXSkge1xuICAgIHZhciBmaW5kZXI7XG4gICAgZmluZGVyID0gdGhpcy5nZXRGaW5kZXIoY21kTmFtZSwgbmFtZVNwYWNlcyk7XG4gICAgcmV0dXJuIGZpbmRlci5maW5kKCk7XG4gIH1cblxuICBnZXRGaW5kZXIoY21kTmFtZSwgbmFtZVNwYWNlcyA9IFtdKSB7XG4gICAgcmV0dXJuIG5ldyBDbWRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogbmFtZVNwYWNlcyxcbiAgICAgIHVzZURldGVjdG9yczogdGhpcy5pc1Jvb3QoKSxcbiAgICAgIGNvZGV3YXZlOiB0aGlzLmNvZGV3YXZlLFxuICAgICAgcGFyZW50Q29udGV4dDogdGhpc1xuICAgIH0pO1xuICB9XG5cbiAgaXNSb290KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9PSBudWxsO1xuICB9XG5cbiAgd3JhcENvbW1lbnQoc3RyKSB7XG4gICAgdmFyIGNjO1xuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpO1xuICAgIGlmIChjYy5pbmRleE9mKCclcycpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsIHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50TGVmdChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gY2Muc3Vic3RyKDAsIGkpICsgc3RyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHI7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnRSaWdodChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkgKyAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIGNtZEluc3RhbmNlRm9yKGNtZCkge1xuICAgIHJldHVybiBuZXcgQ21kSW5zdGFuY2UoY21kLCB0aGlzKTtcbiAgfVxuXG4gIGdldENvbW1lbnRDaGFyKCkge1xuICAgIHZhciBjaGFyLCBjbWQsIGluc3QsIHJlcztcbiAgICBpZiAodGhpcy5jb21tZW50Q2hhciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgICB9XG4gICAgY21kID0gdGhpcy5nZXRDbWQoJ2NvbW1lbnQnKTtcbiAgICBjaGFyID0gJzwhLS0gJXMgLS0+JztcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGluc3QgPSB0aGlzLmNtZEluc3RhbmNlRm9yKGNtZCk7XG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnO1xuICAgICAgcmVzID0gaW5zdC5yZXN1bHQoKTtcbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICBjaGFyID0gcmVzO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbW1lbnRDaGFyID0gY2hhcjtcbiAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUGFpciB9IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCBjbGFzcyBEZXRlY3RvclxuICBjb25zdHJ1Y3RvcjogKEBkYXRhPXt9KSAtPlxuICBkZXRlY3Q6IChmaW5kZXIpIC0+XG4gICAgaWYgQGRldGVjdGVkKGZpbmRlcilcbiAgICAgIHJldHVybiBAZGF0YS5yZXN1bHQgaWYgQGRhdGEucmVzdWx0P1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBAZGF0YS5lbHNlIGlmIEBkYXRhLmVsc2U/XG4gIGRldGVjdGVkOiAoZmluZGVyKSAtPlxuICAgICNcblxuZXhwb3J0IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yXG4gIGRldGVjdDogKGZpbmRlcikgLT5cbiAgICBpZiBmaW5kZXIuY29kZXdhdmU/IFxuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpXG4gICAgICBpZiBsYW5nPyBcbiAgICAgICAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKVxuICAgICAgICBcbmV4cG9ydCBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvclxuICBkZXRlY3RlZDogKGZpbmRlcikgLT5cbiAgICBpZiBAZGF0YS5vcGVuZXI/IGFuZCBAZGF0YS5jbG9zZXI/IGFuZCBmaW5kZXIuaW5zdGFuY2U/XG4gICAgICBwYWlyID0gbmV3IFBhaXIoQGRhdGEub3BlbmVyLCBAZGF0YS5jbG9zZXIsIEBkYXRhKVxuICAgICAgaWYgcGFpci5pc1dhcHBlck9mKGZpbmRlci5pbnN0YW5jZS5nZXRQb3MoKSwgZmluZGVyLmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gICAgICAiLCJpbXBvcnQge1xuICBQYWlyXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCB2YXIgRGV0ZWN0b3IgPSBjbGFzcyBEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEgPSB7fSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cblxuICBkZXRlY3QoZmluZGVyKSB7XG4gICAgaWYgKHRoaXMuZGV0ZWN0ZWQoZmluZGVyKSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5yZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnJlc3VsdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZGF0YS5lbHNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5lbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRldGVjdGVkKGZpbmRlcikge31cblxufTtcblxuXG5leHBvcnQgdmFyIExhbmdEZXRlY3RvciA9IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIHZhciBsYW5nO1xuICAgIGlmIChmaW5kZXIuY29kZXdhdmUgIT0gbnVsbCkge1xuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpO1xuICAgICAgaWYgKGxhbmcgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG5leHBvcnQgdmFyIFBhaXJEZXRlY3RvciA9IGNsYXNzIFBhaXJEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0ZWQoZmluZGVyKSB7XG4gICAgdmFyIHBhaXI7XG4gICAgaWYgKCh0aGlzLmRhdGEub3BlbmVyICE9IG51bGwpICYmICh0aGlzLmRhdGEuY2xvc2VyICE9IG51bGwpICYmIChmaW5kZXIuaW5zdGFuY2UgIT0gbnVsbCkpIHtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcih0aGlzLmRhdGEub3BlbmVyLCB0aGlzLmRhdGEuY2xvc2VyLCB0aGlzLmRhdGEpO1xuICAgICAgaWYgKHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEVkaXRDbWRQcm9wXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsb3B0aW9ucykgLT5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICd2YXInIDogbnVsbCxcbiAgICAgICdvcHQnIDogbnVsbCxcbiAgICAgICdmdW5jdCcgOiBudWxsLFxuICAgICAgJ2RhdGFOYW1lJyA6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JyA6IGZhbHNlLFxuICAgICAgJ2NhcnJldCcgOiBmYWxzZSxcbiAgICB9XG4gICAgZm9yIGtleSBpbiBbJ3ZhcicsJ29wdCcsJ2Z1bmN0J11cbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIGRlZmF1bHRzWydkYXRhTmFtZSddID0gb3B0aW9uc1trZXldXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICAgIFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKEBuYW1lKVxuICBcbiAgd3JpdGVGb3I6IChwYXJzZXIsb2JqKSAtPlxuICAgIGlmIHBhcnNlci52YXJzW0BuYW1lXT9cbiAgICAgIG9ialtAZGF0YU5hbWVdID0gcGFyc2VyLnZhcnNbQG5hbWVdXG4gIHZhbEZyb21DbWQ6IChjbWQpIC0+XG4gICAgaWYgY21kP1xuICAgICAgaWYgQG9wdD9cbiAgICAgICAgcmV0dXJuIGNtZC5nZXRPcHRpb24oQG9wdClcbiAgICAgIGlmIEBmdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZFtAZnVuY3RdKClcbiAgICAgIGlmIEB2YXI/XG4gICAgICAgIHJldHVybiBjbWRbQHZhcl1cbiAgc2hvd0ZvckNtZDogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIEBzaG93RW1wdHkgb3IgdmFsP1xuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIGlmIEBzaG93Rm9yQ21kKGNtZClcbiAgICAgIFwiXCJcIlxuICAgICAgfn4je0BuYW1lfX5+XG4gICAgICAje0B2YWxGcm9tQ21kKGNtZCkgb3IgXCJcIn0je2lmIEBjYXJyZXQgdGhlbiBcInxcIiBlbHNlIFwiXCJ9XG4gICAgICB+fi8je0BuYW1lfX5+XG4gICAgICBcIlwiXCJcbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnNvdXJjZSBleHRlbmRzIEVkaXRDbWRQcm9wIFxuICB2YWxGcm9tQ21kOiAoY21kKS0+XG4gICAgcmVzID0gc3VwZXIoY21kKVxuICAgIGlmIHJlcz9cbiAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKC9cXHwvZywgJ3x8JylcbiAgICByZXR1cm4gcmVzXG4gIHNldENtZDogKGNtZHMpLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZChAbmFtZSx7J3ByZXZlbnRQYXJzZUFsbCcgOiB0cnVlfSlcbiAgc2hvd0ZvckNtZDogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIChAc2hvd0VtcHR5IGFuZCAhKGNtZD8gYW5kIGNtZC5hbGlhc09mPykpIG9yIHZhbD9cbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnN0cmluZyBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgaWYgQHZhbEZyb21DbWQoY21kKT9cbiAgICAgIHJldHVybiBcIn5+ISN7QG5hbWV9ICcje0B2YWxGcm9tQ21kKGNtZCl9I3tpZiBAY2FycmV0IHRoZW4gXCJ8XCIgZWxzZSBcIlwifSd+flwiXG4gICAgXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5yZXZCb29sIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgc2V0Q21kOiAoY21kcykgLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQoQG5hbWUpXG4gIHdyaXRlRm9yOiAocGFyc2VyLG9iaikgLT5cbiAgICBpZiBwYXJzZXIudmFyc1tAbmFtZV0/XG4gICAgICBvYmpbQGRhdGFOYW1lXSA9ICFwYXJzZXIudmFyc1tAbmFtZV1cbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgaWYgdmFsPyBhbmQgIXZhbFxuICAgICAgcmV0dXJuIFwifn4hI3tAbmFtZX1+flwiXG5cbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLmJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZChAbmFtZSlcbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICBcIn5+ISN7QG5hbWV9fn5cIiBpZiBAdmFsRnJvbUNtZChjbWQpIiwiaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIEVkaXRDbWRQcm9wID0gY2xhc3MgRWRpdENtZFByb3Age1xuICBjb25zdHJ1Y3RvcihuYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBpLCBrZXksIGxlbiwgcmVmLCB2YWw7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICd2YXInOiBudWxsLFxuICAgICAgJ29wdCc6IG51bGwsXG4gICAgICAnZnVuY3QnOiBudWxsLFxuICAgICAgJ2RhdGFOYW1lJzogbnVsbCxcbiAgICAgICdzaG93RW1wdHknOiBmYWxzZSxcbiAgICAgICdjYXJyZXQnOiBmYWxzZVxuICAgIH07XG4gICAgcmVmID0gWyd2YXInLCAnb3B0JywgJ2Z1bmN0J107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBrZXkgPSByZWZbaV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgZGVmYXVsdHNbJ2RhdGFOYW1lJ10gPSBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIHdyaXRlRm9yKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9ialt0aGlzLmRhdGFOYW1lXSA9IHBhcnNlci52YXJzW3RoaXMubmFtZV07XG4gICAgfVxuICB9XG5cbiAgdmFsRnJvbUNtZChjbWQpIHtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLm9wdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZ2V0T3B0aW9uKHRoaXMub3B0KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLmZ1bmN0XSgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudmFyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLnZhcl07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2hvd0ZvckNtZChjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIHJldHVybiB0aGlzLnNob3dFbXB0eSB8fCAodmFsICE9IG51bGwpO1xuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy5zaG93Rm9yQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4ke3RoaXMubmFtZX1+flxcbiR7dGhpcy52YWxGcm9tQ21kKGNtZCkgfHwgXCJcIn0keyh0aGlzLmNhcnJldCA/IFwifFwiIDogXCJcIil9XFxufn4vJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5zb3VyY2UgPSBjbGFzcyBzb3VyY2UgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHZhbEZyb21DbWQoY21kKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBzdXBlci52YWxGcm9tQ21kKGNtZCk7XG4gICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICByZXMgPSByZXMucmVwbGFjZSgvXFx8L2csICd8fCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSwge1xuICAgICAgJ3ByZXZlbnRQYXJzZUFsbCc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHNob3dGb3JDbWQoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICByZXR1cm4gKHRoaXMuc2hvd0VtcHR5ICYmICEoKGNtZCAhPSBudWxsKSAmJiAoY21kLmFsaWFzT2YgIT0gbnVsbCkpKSB8fCAodmFsICE9IG51bGwpO1xuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLnN0cmluZyA9IGNsYXNzIHN0cmluZyBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX0gJyR7dGhpcy52YWxGcm9tQ21kKGNtZCl9JHsodGhpcy5jYXJyZXQgPyBcInxcIiA6IFwiXCIpfSd+fmA7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLnJldkJvb2wgPSBjbGFzcyByZXZCb29sIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICB3cml0ZUZvcihwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbdGhpcy5uYW1lXTtcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG4gICAgaWYgKCh2YWwgIT0gbnVsbCkgJiYgIXZhbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLmJvb2wgPSBjbGFzcyBib29sIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnZhbEZyb21DbWQoY21kKSkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5pbXBvcnQgeyBvcHRpb25hbFByb21pc2UgfSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IGNsYXNzIEVkaXRvclxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAbmFtZXNwYWNlID0gbnVsbFxuICAgIEBfbGFuZyA9IG51bGxcbiAgYmluZGVkVG86IChjb2Rld2F2ZSkgLT5cbiAgICAjXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dExlbjogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRTdWJzdHI6IChzdGFydCwgZW5kKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgaW5zZXJ0VGV4dEF0OiAodGV4dCwgcG9zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kID0gbnVsbCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGJlZ2luVW5kb0FjdGlvbjogLT5cbiAgICAjXG4gIGVuZFVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBnZXRMYW5nOiAtPlxuICAgIHJldHVybiBAX2xhbmdcbiAgc2V0TGFuZzogKHZhbCkgLT5cbiAgICBAX2xhbmcgPSB2YWxcbiAgZ2V0RW1tZXRDb250ZXh0T2JqZWN0OiAtPlxuICAgIHJldHVybiBudWxsXG4gIGFsbG93TXVsdGlTZWxlY3Rpb246IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIHNldE11bHRpU2VsOiAoc2VsZWN0aW9ucykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGdldE11bHRpU2VsOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgY2FuTGlzdGVuVG9DaGFuZ2U6IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIGFkZENoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgXG4gIGdldExpbmVBdDogKHBvcykgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAZmluZExpbmVTdGFydChwb3MpLEBmaW5kTGluZUVuZChwb3MpKVxuICBmaW5kTGluZVN0YXJ0OiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCJdLCAtMSlcbiAgICByZXR1cm4gaWYgcCB0aGVuIHAucG9zKzEgZWxzZSAwXG4gIGZpbmRMaW5lRW5kOiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCIsXCJcXHJcIl0pXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcyBlbHNlIEB0ZXh0TGVuKClcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBpZiBkaXJlY3Rpb24gPiAwXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoc3RhcnQsQHRleHRMZW4oKSlcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoMCxzdGFydClcbiAgICBiZXN0UG9zID0gbnVsbFxuICAgIGZvciBzdHJpIGluIHN0cmluZ3NcbiAgICAgIHBvcyA9IGlmIGRpcmVjdGlvbiA+IDAgdGhlbiB0ZXh0LmluZGV4T2Yoc3RyaSkgZWxzZSB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpXG4gICAgICBpZiBwb3MgIT0gLTFcbiAgICAgICAgaWYgIWJlc3RQb3M/IG9yIGJlc3RQb3MqZGlyZWN0aW9uID4gcG9zKmRpcmVjdGlvblxuICAgICAgICAgIGJlc3RQb3MgPSBwb3NcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaVxuICAgIGlmIGJlc3RTdHI/XG4gICAgICByZXR1cm4gbmV3IFN0clBvcygoaWYgZGlyZWN0aW9uID4gMCB0aGVuIGJlc3RQb3MgKyBzdGFydCBlbHNlIGJlc3RQb3MpLGJlc3RTdHIpXG4gICAgcmV0dXJuIG51bGxcbiAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzOiAocmVwbGFjZW1lbnRzKSAtPlxuICAgIHJlcGxhY2VtZW50cy5yZWR1Y2UoKHByb21pc2UscmVwbCk9PlxuICAgICAgICBwcm9taXNlLnRoZW4gKG9wdCk9PlxuICAgICAgICAgIHJlcGwud2l0aEVkaXRvcih0aGlzKVxuICAgICAgICAgIHJlcGwuYXBwbHlPZmZzZXQob3B0Lm9mZnNldClcbiAgICAgICAgICBvcHRpb25hbFByb21pc2UocmVwbC5hcHBseSgpKS50aGVuID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlbGVjdGlvbnM6IG9wdC5zZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpLFxuICAgICAgICAgICAgICBvZmZzZXQ6IG9wdC5vZmZzZXQrcmVwbC5vZmZzZXRBZnRlcih0aGlzKSBcbiAgICAgICAgICAgIH1cbiAgICAgICwgb3B0aW9uYWxQcm9taXNlKHtzZWxlY3Rpb25zOiBbXSxvZmZzZXQ6IDB9KSlcbiAgICAudGhlbiAob3B0KT0+XG4gICAgICBAYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKG9wdC5zZWxlY3Rpb25zKVxuICAgIC5yZXN1bHQoKVxuICAgIFxuICAgICAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9uczogKHNlbGVjdGlvbnMpIC0+XG4gICAgaWYgc2VsZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICBpZiBAYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgICAgIEBzZXRNdWx0aVNlbChzZWxlY3Rpb25zKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0Q3Vyc29yUG9zKHNlbGVjdGlvbnNbMF0uc3RhcnQsc2VsZWN0aW9uc1swXS5lbmQpIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgU3RyUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcblxuaW1wb3J0IHtcbiAgb3B0aW9uYWxQcm9taXNlXG59IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgdmFyIEVkaXRvciA9IGNsYXNzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubmFtZXNwYWNlID0gbnVsbDtcbiAgICB0aGlzLl9sYW5nID0gbnVsbDtcbiAgfVxuXG4gIGJpbmRlZFRvKGNvZGV3YXZlKSB7fVxuXG4gIFxuICB0ZXh0KHZhbCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0TGVuKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0U3Vic3RyKHN0YXJ0LCBlbmQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgaW5zZXJ0VGV4dEF0KHRleHQsIHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCA9IG51bGwpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgYmVnaW5VbmRvQWN0aW9uKCkge31cblxuICBcbiAgZW5kVW5kb0FjdGlvbigpIHt9XG5cbiAgXG4gIGdldExhbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhbmc7XG4gIH1cblxuICBzZXRMYW5nKHZhbCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nID0gdmFsO1xuICB9XG5cbiAgZ2V0RW1tZXRDb250ZXh0T2JqZWN0KCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYWxsb3dNdWx0aVNlbGVjdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzZXRNdWx0aVNlbChzZWxlY3Rpb25zKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGdldE11bHRpU2VsKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBjYW5MaXN0ZW5Ub0NoYW5nZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRMaW5lQXQocG9zKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5maW5kTGluZVN0YXJ0KHBvcyksIHRoaXMuZmluZExpbmVFbmQocG9zKSk7XG4gIH1cblxuICBmaW5kTGluZVN0YXJ0KHBvcykge1xuICAgIHZhciBwO1xuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW1wiXFxuXCJdLCAtMSk7XG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcyArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRMaW5lRW5kKHBvcykge1xuICAgIHZhciBwO1xuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW1wiXFxuXCIsIFwiXFxyXCJdKTtcbiAgICBpZiAocCkge1xuICAgICAgcmV0dXJuIHAucG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0TGVuKCk7XG4gICAgfVxuICB9XG5cbiAgZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICB2YXIgYmVzdFBvcywgYmVzdFN0ciwgaSwgbGVuLCBwb3MsIHN0cmksIHRleHQ7XG4gICAgaWYgKGRpcmVjdGlvbiA+IDApIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQsIHRoaXMudGV4dExlbigpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cigwLCBzdGFydCk7XG4gICAgfVxuICAgIGJlc3RQb3MgPSBudWxsO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHN0cmluZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0cmkgPSBzdHJpbmdzW2ldO1xuICAgICAgcG9zID0gZGlyZWN0aW9uID4gMCA/IHRleHQuaW5kZXhPZihzdHJpKSA6IHRleHQubGFzdEluZGV4T2Yoc3RyaSk7XG4gICAgICBpZiAocG9zICE9PSAtMSkge1xuICAgICAgICBpZiAoKGJlc3RQb3MgPT0gbnVsbCkgfHwgYmVzdFBvcyAqIGRpcmVjdGlvbiA+IHBvcyAqIGRpcmVjdGlvbikge1xuICAgICAgICAgIGJlc3RQb3MgPSBwb3M7XG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJlc3RTdHIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoKGRpcmVjdGlvbiA+IDAgPyBiZXN0UG9zICsgc3RhcnQgOiBiZXN0UG9zKSwgYmVzdFN0cik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VtZW50cy5yZWR1Y2UoKHByb21pc2UsIHJlcGwpID0+IHtcbiAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKG9wdCkgPT4ge1xuICAgICAgICByZXBsLndpdGhFZGl0b3IodGhpcyk7XG4gICAgICAgIHJlcGwuYXBwbHlPZmZzZXQob3B0Lm9mZnNldCk7XG4gICAgICAgIHJldHVybiBvcHRpb25hbFByb21pc2UocmVwbC5hcHBseSgpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0aW9uczogb3B0LnNlbGVjdGlvbnMuY29uY2F0KHJlcGwuc2VsZWN0aW9ucyksXG4gICAgICAgICAgICBvZmZzZXQ6IG9wdC5vZmZzZXQgKyByZXBsLm9mZnNldEFmdGVyKHRoaXMpXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LCBvcHRpb25hbFByb21pc2Uoe1xuICAgICAgc2VsZWN0aW9uczogW10sXG4gICAgICBvZmZzZXQ6IDBcbiAgICB9KSkudGhlbigob3B0KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMob3B0LnNlbGVjdGlvbnMpO1xuICAgIH0pLnJlc3VsdCgpO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKHNlbGVjdGlvbnMpIHtcbiAgICBpZiAoc2VsZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TXVsdGlTZWwoc2VsZWN0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCwgc2VsZWN0aW9uc1swXS5lbmQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIExvZ2dlclxuICBAZW5hYmxlZCA9IHRydWVcbiAgbG9nOiAoYXJncy4uLikgLT5cbiAgICBpZiBAaXNFbmFibGVkKClcbiAgICAgIGZvciBtc2cgaW4gYXJnc1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpXG4gIGlzRW5hYmxlZDogLT5cbiAgICBjb25zb2xlPy5sb2c/IGFuZCB0aGlzLmVuYWJsZWQgYW5kIExvZ2dlci5lbmFibGVkXG4gIGVuYWJsZWQ6IHRydWVcbiAgcnVudGltZTogKGZ1bmN0LG5hbWUgPSBcImZ1bmN0aW9uXCIpIC0+XG4gICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlcyA9IGZ1bmN0KClcbiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgY29uc29sZS5sb2coXCIje25hbWV9IHRvb2sgI3t0MSAtIHQwfSBtaWxsaXNlY29uZHMuXCIpXG4gICAgcmVzXG4gIG1vbml0b3JEYXRhOiB7fVxuICB0b01vbml0b3I6IChvYmosbmFtZSxwcmVmaXg9JycpIC0+XG4gICAgZnVuY3QgPSBvYmpbbmFtZV1cbiAgICBvYmpbbmFtZV0gPSAtPiBcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICAgIHRoaXMubW9uaXRvcigoLT4gZnVuY3QuYXBwbHkob2JqLGFyZ3MpKSxwcmVmaXgrbmFtZSlcbiAgbW9uaXRvcjogKGZ1bmN0LG5hbWUpIC0+XG4gICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlcyA9IGZ1bmN0KClcbiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgaWYgdGhpcy5tb25pdG9yRGF0YVtuYW1lXT9cbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrK1xuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCs9IHQxIC0gdDBcbiAgICBlbHNlXG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdID0ge1xuICAgICAgICBjb3VudDogMVxuICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgfVxuICAgIHJlc1xuICByZXN1bWU6IC0+XG4gICAgY29uc29sZS5sb2codGhpcy5tb25pdG9yRGF0YSlcbiIsImV4cG9ydCB2YXIgTG9nZ2VyID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBMb2dnZXIge1xuICAgIGxvZyguLi5hcmdzKSB7XG4gICAgICB2YXIgaSwgbGVuLCBtc2csIHJlc3VsdHM7XG4gICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBtc2cgPSBhcmdzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjb25zb2xlLmxvZyhtc2cpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICByZXR1cm4gKCh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlICE9PSBudWxsID8gY29uc29sZS5sb2cgOiB2b2lkIDApICE9IG51bGwpICYmIHRoaXMuZW5hYmxlZCAmJiBMb2dnZXIuZW5hYmxlZDtcbiAgICB9XG5cbiAgICBydW50aW1lKGZ1bmN0LCBuYW1lID0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDE7XG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgcmVzID0gZnVuY3QoKTtcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfSB0b29rICR7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLmApO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICB0b01vbml0b3Iob2JqLCBuYW1lLCBwcmVmaXggPSAnJykge1xuICAgICAgdmFyIGZ1bmN0O1xuICAgICAgZnVuY3QgPSBvYmpbbmFtZV07XG4gICAgICByZXR1cm4gb2JqW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gdGhpcy5tb25pdG9yKChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3QuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgfSksIHByZWZpeCArIG5hbWUpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBtb25pdG9yKGZ1bmN0LCBuYW1lKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDE7XG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgcmVzID0gZnVuY3QoKTtcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBpZiAodGhpcy5tb25pdG9yRGF0YVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrKztcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCArPSB0MSAtIHQwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICByZXN1bWUoKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2codGhpcy5tb25pdG9yRGF0YSk7XG4gICAgfVxuXG4gIH07XG5cbiAgTG9nZ2VyLmVuYWJsZWQgPSB0cnVlO1xuXG4gIExvZ2dlci5wcm90b3R5cGUuZW5hYmxlZCA9IHRydWU7XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5tb25pdG9yRGF0YSA9IHt9O1xuXG4gIHJldHVybiBMb2dnZXI7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJleHBvcnQgY2xhc3MgT3B0aW9uT2JqZWN0XG4gIHNldE9wdHM6IChvcHRpb25zLGRlZmF1bHRzKS0+XG4gICAgQGRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICBAc2V0T3B0KGtleSxvcHRpb25zW2tleV0pXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRPcHQoa2V5LHZhbClcbiAgICAgICAgXG4gIHNldE9wdDogKGtleSwgdmFsKS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgdGhpc1trZXldKHZhbClcbiAgICBlbHNlXG4gICAgICB0aGlzW2tleV09IHZhbFxuICAgICAgICBcbiAgZ2V0T3B0OiAoa2V5KS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXNba2V5XVxuICBcbiAgZ2V0T3B0czogLT5cbiAgICBvcHRzID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRzW2tleV0gPSBAZ2V0T3B0KGtleSlcbiAgICByZXR1cm4gb3B0cyIsImV4cG9ydCB2YXIgT3B0aW9uT2JqZWN0ID0gY2xhc3MgT3B0aW9uT2JqZWN0IHtcbiAgc2V0T3B0cyhvcHRpb25zLCBkZWZhdWx0cykge1xuICAgIHZhciBrZXksIHJlZiwgcmVzdWx0cywgdmFsO1xuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIG9wdGlvbnNba2V5XSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc2V0T3B0KGtleSwgdmFsKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgc2V0T3B0KGtleSwgdmFsKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdChrZXkpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXNba2V5XSkgIT0gbnVsbCA/IHJlZi5jYWxsIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV07XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0cygpIHtcbiAgICB2YXIga2V5LCBvcHRzLCByZWYsIHZhbDtcbiAgICBvcHRzID0ge307XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgb3B0c1trZXldID0gdGhpcy5nZXRPcHQoa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdHM7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuL0JveEhlbHBlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsQHBvcyxAc3RyKSAtPlxuICAgIHN1cGVyKClcbiAgICB1bmxlc3MgQGlzRW1wdHkoKVxuICAgICAgQF9jaGVja0Nsb3NlcigpXG4gICAgICBAb3BlbmluZyA9IEBzdHJcbiAgICAgIEBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICAgIEBfc3BsaXRDb21wb25lbnRzKClcbiAgICAgIEBfZmluZENsb3NpbmcoKVxuICAgICAgQF9jaGVja0Vsb25nYXRlZCgpXG4gIF9jaGVja0Nsb3NlcjogLT5cbiAgICBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICBpZiBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5jbG9zZUNoYXIgYW5kIGYgPSBAX2ZpbmRPcGVuaW5nUG9zKClcbiAgICAgIEBjbG9zaW5nUG9zID0gbmV3IFN0clBvcyhAcG9zLCBAc3RyKVxuICAgICAgQHBvcyA9IGYucG9zXG4gICAgICBAc3RyID0gZi5zdHJcbiAgX2ZpbmRPcGVuaW5nUG9zOiAtPlxuICAgIGNtZE5hbWUgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cikuc3Vic3RyaW5nKEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKVxuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWVcbiAgICBjbG9zaW5nID0gQHN0clxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zLG9wZW5pbmcsY2xvc2luZywtMSlcbiAgICAgIGYuc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcytmLnN0ci5sZW5ndGgpK0Bjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgICAgIHJldHVybiBmXG4gIF9zcGxpdENvbXBvbmVudHM6IC0+XG4gICAgcGFydHMgPSBAbm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICBAY21kTmFtZSA9IHBhcnRzLnNoaWZ0KClcbiAgICBAcmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIilcbiAgX3BhcnNlUGFyYW1zOihwYXJhbXMpIC0+XG4gICAgQHBhcmFtcyA9IFtdXG4gICAgQG5hbWVkID0gQGdldERlZmF1bHRzKClcbiAgICBpZiBAY21kP1xuICAgICAgbmFtZVRvUGFyYW0gPSBAZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpXG4gICAgICBpZiBuYW1lVG9QYXJhbT8gXG4gICAgICAgIEBuYW1lZFtuYW1lVG9QYXJhbV0gPSBAY21kTmFtZVxuICAgIGlmIHBhcmFtcy5sZW5ndGhcbiAgICAgIGlmIEBjbWQ/XG4gICAgICAgIGFsbG93ZWROYW1lZCA9IEBnZXRPcHRpb24oJ2FsbG93ZWROYW1lZCcpIFxuICAgICAgaW5TdHIgPSBmYWxzZVxuICAgICAgcGFyYW0gPSAnJ1xuICAgICAgbmFtZSA9IGZhbHNlXG4gICAgICBmb3IgaSBpbiBbMC4uKHBhcmFtcy5sZW5ndGgtMSldXG4gICAgICAgIGNociA9IHBhcmFtc1tpXVxuICAgICAgICBpZiBjaHIgPT0gJyAnIGFuZCAhaW5TdHJcbiAgICAgICAgICBpZihuYW1lKVxuICAgICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGFyYW1zLnB1c2gocGFyYW0pXG4gICAgICAgICAgcGFyYW0gPSAnJ1xuICAgICAgICAgIG5hbWUgPSBmYWxzZVxuICAgICAgICBlbHNlIGlmIGNociBpbiBbJ1wiJyxcIidcIl0gYW5kIChpID09IDAgb3IgcGFyYW1zW2ktMV0gIT0gJ1xcXFwnKVxuICAgICAgICAgIGluU3RyID0gIWluU3RyXG4gICAgICAgIGVsc2UgaWYgY2hyID09ICc6JyBhbmQgIW5hbWUgYW5kICFpblN0ciBhbmQgKCFhbGxvd2VkTmFtZWQ/IG9yIG5hbWUgaW4gYWxsb3dlZE5hbWVkKVxuICAgICAgICAgIG5hbWUgPSBwYXJhbVxuICAgICAgICAgIHBhcmFtID0gJydcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBhcmFtICs9IGNoclxuICAgICAgaWYgcGFyYW0ubGVuZ3RoXG4gICAgICAgIGlmKG5hbWUpXG4gICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBwYXJhbXMucHVzaChwYXJhbSlcbiAgX2ZpbmRDbG9zaW5nOiAtPlxuICAgIGlmIGYgPSBAX2ZpbmRDbG9zaW5nUG9zKClcbiAgICAgIEBjb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUoQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MrQHN0ci5sZW5ndGgsZi5wb3MpKVxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGYucG9zK2Yuc3RyLmxlbmd0aClcbiAgX2ZpbmRDbG9zaW5nUG9zOiAtPlxuICAgIHJldHVybiBAY2xvc2luZ1BvcyBpZiBAY2xvc2luZ1Bvcz9cbiAgICBjbG9zaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZE5hbWUgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjbWROYW1lXG4gICAgaWYgZiA9IEBjb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKEBwb3MrQHN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpXG4gICAgICByZXR1cm4gQGNsb3NpbmdQb3MgPSBmXG4gIF9jaGVja0Vsb25nYXRlZDogLT5cbiAgICBlbmRQb3MgPSBAZ2V0RW5kUG9zKClcbiAgICBtYXggPSBAY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKVxuICAgIHdoaWxlIGVuZFBvcyA8IG1heCBhbmQgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyxlbmRQb3MrQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PSBAY29kZXdhdmUuZGVjb1xuICAgICAgZW5kUG9zKz1AY29kZXdhdmUuZGVjby5sZW5ndGhcbiAgICBpZiBlbmRQb3MgPj0gbWF4IG9yIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIEBjb2Rld2F2ZS5kZWNvLmxlbmd0aCkgaW4gWycgJyxcIlxcblwiLFwiXFxyXCJdXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICBfY2hlY2tCb3g6IC0+XG4gICAgaWYgQGNvZGV3YXZlLmluSW5zdGFuY2U/IGFuZCBAY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PSAnY29tbWVudCdcbiAgICAgIHJldHVyblxuICAgIGNsID0gQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KClcbiAgICBjciA9IEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKVxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKSArIGNyLmxlbmd0aFxuICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zIC0gY2wubGVuZ3RoLEBwb3MpID09IGNsIGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLGVuZFBvcykgPT0gY3JcbiAgICAgIEBwb3MgPSBAcG9zIC0gY2wubGVuZ3RoXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICAgICAgQF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICAgIGVsc2UgaWYgQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgYW5kIEBnZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xXG4gICAgICBAaW5Cb3ggPSAxXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQ6IC0+XG4gICAgaWYgQGNvbnRlbnRcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29kZXdhdmUuZGVjbylcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86I3tlZH0pKyN7ZWNyfSRcIiwgXCJnbVwiKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChcIl5cXFxccyooPzoje2VkfSkqI3tlY3J9XFxyP1xcblwiKVxuICAgICAgcmUzID0gbmV3IFJlZ0V4cChcIlxcblxcXFxzKiN7ZWNsfSg/OiN7ZWR9KSpcXFxccyokXCIpXG4gICAgICBAY29udGVudCA9IEBjb250ZW50LnJlcGxhY2UocmUxLCckMScpLnJlcGxhY2UocmUyLCcnKS5yZXBsYWNlKHJlMywnJylcbiAgX2dldFBhcmVudENtZHM6IC0+XG4gICAgQHBhcmVudCA9IEBjb2Rld2F2ZS5nZXRFbmNsb3NpbmdDbWQoQGdldEVuZFBvcygpKT8uaW5pdCgpXG4gIHNldE11bHRpUG9zOiAobXVsdGlQb3MpIC0+XG4gICAgQG11bHRpUG9zID0gbXVsdGlQb3NcbiAgX2dldENtZE9iajogLT5cbiAgICBAZ2V0Q21kKClcbiAgICBAX2NoZWNrQm94KClcbiAgICBAY29udGVudCA9IEByZW1vdmVJbmRlbnRGcm9tQ29udGVudChAY29udGVudClcbiAgICBzdXBlcigpXG4gIF9pbml0UGFyYW1zOiAtPlxuICAgIEBfcGFyc2VQYXJhbXMoQHJhd1BhcmFtcylcbiAgZ2V0Q29udGV4dDogLT5cbiAgICByZXR1cm4gQGNvbnRleHQgb3IgQGNvZGV3YXZlLmNvbnRleHRcbiAgZ2V0Q21kOiAtPlxuICAgIHVubGVzcyBAY21kP1xuICAgICAgQF9nZXRQYXJlbnRDbWRzKClcbiAgICAgIGlmIEBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIubGVuZ3RoKSA9PSBAY29kZXdhdmUubm9FeGVjdXRlQ2hhclxuICAgICAgICBAY21kID0gQ29tbWFuZC5jbWRzLmdldENtZCgnY29yZTpub19leGVjdXRlJylcbiAgICAgICAgQGNvbnRleHQgPSBAY29kZXdhdmUuY29udGV4dFxuICAgICAgZWxzZVxuICAgICAgICBAZmluZGVyID0gQGdldEZpbmRlcihAY21kTmFtZSlcbiAgICAgICAgQGNvbnRleHQgPSBAZmluZGVyLmNvbnRleHRcbiAgICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgICAgIGlmIEBjbWQ/XG4gICAgICAgICAgQGNvbnRleHQuYWRkTmFtZVNwYWNlKEBjbWQuZnVsbE5hbWUpXG4gICAgcmV0dXJuIEBjbWRcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBjb2Rld2F2ZS5jb250ZXh0LmdldEZpbmRlcihjbWROYW1lLEBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzOiAtPlxuICAgIG5zcGNzID0gW11cbiAgICBvYmogPSB0aGlzXG4gICAgd2hpbGUgb2JqLnBhcmVudD9cbiAgICAgIG9iaiA9IG9iai5wYXJlbnRcbiAgICAgIG5zcGNzLnB1c2gob2JqLmNtZC5mdWxsTmFtZSkgaWYgb2JqLmNtZD8gYW5kIG9iai5jbWQuZnVsbE5hbWU/XG4gICAgcmV0dXJuIG5zcGNzXG4gIF9yZW1vdmVCcmFja2V0OiAoc3RyKS0+XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoLHN0ci5sZW5ndGgtQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKVxuICBhbHRlckFsaWFzT2Y6IChhbGlhc09mKS0+XG4gICAgW25zcGMsIGNtZE5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0KEBjbWROYW1lKVxuICAgIHJldHVybiBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsY21kTmFtZSlcbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQHN0ciA9PSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY29kZXdhdmUuYnJha2V0cyBvciBAc3RyID09IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgZXhlY3V0ZTogLT5cbiAgICBpZiBAaXNFbXB0eSgpXG4gICAgICBpZiBAY29kZXdhdmUuY2xvc2luZ1Byb21wPyBhbmQgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcC53aGl0aGluT3BlbkJvdW5kcyhAcG9zICsgQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKT9cbiAgICAgICAgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcC5jYW5jZWwoKVxuICAgICAgZWxzZVxuICAgICAgICBAcmVwbGFjZVdpdGgoJycpXG4gICAgZWxzZSBpZiBAY21kP1xuICAgICAgaWYgYmVmb3JlRnVuY3QgPSBAZ2V0T3B0aW9uKCdiZWZvcmVFeGVjdXRlJylcbiAgICAgICAgYmVmb3JlRnVuY3QodGhpcylcbiAgICAgIGlmIEByZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICAgIGlmIChyZXMgPSBAcmVzdWx0KCkpP1xuICAgICAgICAgIEByZXBsYWNlV2l0aChyZXMpXG4gICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIEBydW5FeGVjdXRlRnVuY3QoKVxuICBnZXRFbmRQb3M6IC0+XG4gICAgcmV0dXJuIEBwb3MrQHN0ci5sZW5ndGhcbiAgZ2V0UG9zOiAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBwb3MsQHBvcytAc3RyLmxlbmd0aCkud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICBnZXRPcGVuaW5nUG9zOiAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBwb3MsQHBvcytAb3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHVubGVzcyBAaW5kZW50TGVuP1xuICAgICAgaWYgQGluQm94P1xuICAgICAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgICAgICBAaW5kZW50TGVuID0gaGVscGVyLnJlbW92ZUNvbW1lbnQoQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGhcbiAgICAgIGVsc2VcbiAgICAgICAgQGluZGVudExlbiA9IEBwb3MgLSBAZ2V0UG9zKCkucHJldkVPTCgpXG4gICAgcmV0dXJuIEBpbmRlbnRMZW5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQ6ICh0ZXh0KSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKCdeXFxcXHN7JytAZ2V0SW5kZW50KCkrJ30nLCdnbScpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywnJylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBhbHRlclJlc3VsdEZvckJveDogKHJlcGwpIC0+XG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKVxuICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGNvbnRleHQpXG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksZmFsc2UpXG4gICAgaWYgQGdldE9wdGlvbigncmVwbGFjZUJveCcpXG4gICAgICBib3ggPSBoZWxwZXIuZ2V0Qm94Rm9yUG9zKG9yaWdpbmFsKVxuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdXG4gICAgICBAaW5kZW50TGVuID0gaGVscGVyLmluZGVudFxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBlbHNlXG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgICAgcmVwbC5zdGFydCA9IG9yaWdpbmFsLnByZXZFT0woKVxuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKClcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgQGNvZGV3YXZlLm1hcmtlciArIHJlcGwudGV4dCArIEBjb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge211bHRpbGluZTpmYWxzZX0pXG4gICAgICBbcmVwbC5wcmVmaXgscmVwbC50ZXh0LHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdChAY29kZXdhdmUubWFya2VyKVxuICAgIHJldHVybiByZXBsXG4gIGdldEN1cnNvckZyb21SZXN1bHQ6IChyZXBsKSAtPlxuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KClcbiAgICBpZiBAY21kPyBhbmQgQGNvZGV3YXZlLmNoZWNrQ2FycmV0IGFuZCBAZ2V0T3B0aW9uKCdjaGVja0NhcnJldCcpXG4gICAgICBpZiAocCA9IEBjb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSk/IFxuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0K3JlcGwucHJlZml4Lmxlbmd0aCtwXG4gICAgICByZXBsLnRleHQgPSBAY29kZXdhdmUucmVtb3ZlQ2FycmV0KHJlcGwudGV4dClcbiAgICByZXR1cm4gY3Vyc29yUG9zXG4gIGNoZWNrTXVsdGk6IChyZXBsKSAtPlxuICAgIGlmIEBtdWx0aVBvcz8gYW5kIEBtdWx0aVBvcy5sZW5ndGggPiAxXG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF1cbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KClcbiAgICAgIGZvciBwb3MsIGkgaW4gQG11bHRpUG9zXG4gICAgICAgIGlmIGkgPT0gMFxuICAgICAgICAgIG9yaWdpbmFsUG9zID0gcG9zLnN0YXJ0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0LW9yaWdpbmFsUG9zKVxuICAgICAgICAgIGlmIG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT0gb3JpZ2luYWxUZXh0XG4gICAgICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXdSZXBsKVxuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50c1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBbcmVwbF1cbiAgcmVwbGFjZVdpdGg6ICh0ZXh0KSAtPlxuICAgIEBhcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChAcG9zLEBnZXRFbmRQb3MoKSx0ZXh0KSlcbiAgYXBwbHlSZXBsYWNlbWVudDogKHJlcGwpIC0+XG4gICAgcmVwbC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gICAgaWYgQGluQm94P1xuICAgICAgQGFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBjdXJzb3JQb3MgPSBAZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKVxuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKGN1cnNvclBvcywgY3Vyc29yUG9zKV1cbiAgICByZXBsYWNlbWVudHMgPSBAY2hlY2tNdWx0aShyZXBsKVxuICAgIEByZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0XG4gICAgQHJlcGxhY2VFbmQgPSByZXBsLnJlc0VuZCgpXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gICAgIiwidmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xuXG5pbXBvcnQge1xuICBDbWRJbnN0YW5jZVxufSBmcm9tICcuL0NtZEluc3RhbmNlJztcblxuaW1wb3J0IHtcbiAgQm94SGVscGVyXG59IGZyb20gJy4vQm94SGVscGVyJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgU3RyUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgTmFtZXNwYWNlSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgUG9zaXRpb25lZENtZEluc3RhbmNlID0gY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSwgcG9zMSwgc3RyMSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlO1xuICAgIHRoaXMucG9zID0gcG9zMTtcbiAgICB0aGlzLnN0ciA9IHN0cjE7XG4gICAgaWYgKCF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgdGhpcy5fY2hlY2tDbG9zZXIoKTtcbiAgICAgIHRoaXMub3BlbmluZyA9IHRoaXMuc3RyO1xuICAgICAgdGhpcy5ub0JyYWNrZXQgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKTtcbiAgICAgIHRoaXMuX3NwbGl0Q29tcG9uZW50cygpO1xuICAgICAgdGhpcy5fZmluZENsb3NpbmcoKTtcbiAgICAgIHRoaXMuX2NoZWNrRWxvbmdhdGVkKCk7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrQ2xvc2VyKCkge1xuICAgIHZhciBmLCBub0JyYWNrZXQ7XG4gICAgbm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cik7XG4gICAgaWYgKG5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgJiYgKGYgPSB0aGlzLl9maW5kT3BlbmluZ1BvcygpKSkge1xuICAgICAgdGhpcy5jbG9zaW5nUG9zID0gbmV3IFN0clBvcyh0aGlzLnBvcywgdGhpcy5zdHIpO1xuICAgICAgdGhpcy5wb3MgPSBmLnBvcztcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IGYuc3RyO1xuICAgIH1cbiAgfVxuXG4gIF9maW5kT3BlbmluZ1BvcygpIHtcbiAgICB2YXIgY2xvc2luZywgY21kTmFtZSwgZiwgb3BlbmluZztcbiAgICBjbWROYW1lID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cikuc3Vic3RyaW5nKHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCk7XG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWU7XG4gICAgY2xvc2luZyA9IHRoaXMuc3RyO1xuICAgIGlmIChmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zLCBvcGVuaW5nLCBjbG9zaW5nLCAtMSkpIHtcbiAgICAgIGYuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihmLnBvcywgdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcyArIGYuc3RyLmxlbmd0aCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKTtcbiAgICAgIHJldHVybiBmO1xuICAgIH1cbiAgfVxuXG4gIF9zcGxpdENvbXBvbmVudHMoKSB7XG4gICAgdmFyIHBhcnRzO1xuICAgIHBhcnRzID0gdGhpcy5ub0JyYWNrZXQuc3BsaXQoXCIgXCIpO1xuICAgIHRoaXMuY21kTmFtZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHRoaXMucmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIik7XG4gIH1cblxuICBfcGFyc2VQYXJhbXMocGFyYW1zKSB7XG4gICAgdmFyIGFsbG93ZWROYW1lZCwgY2hyLCBpLCBpblN0ciwgaiwgbmFtZSwgbmFtZVRvUGFyYW0sIHBhcmFtLCByZWY7XG4gICAgdGhpcy5wYXJhbXMgPSBbXTtcbiAgICB0aGlzLm5hbWVkID0gdGhpcy5nZXREZWZhdWx0cygpO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBuYW1lVG9QYXJhbSA9IHRoaXMuZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpO1xuICAgICAgaWYgKG5hbWVUb1BhcmFtICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5uYW1lZFtuYW1lVG9QYXJhbV0gPSB0aGlzLmNtZE5hbWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJhbXMubGVuZ3RoKSB7XG4gICAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgICBhbGxvd2VkTmFtZWQgPSB0aGlzLmdldE9wdGlvbignYWxsb3dlZE5hbWVkJyk7XG4gICAgICB9XG4gICAgICBpblN0ciA9IGZhbHNlO1xuICAgICAgcGFyYW0gPSAnJztcbiAgICAgIG5hbWUgPSBmYWxzZTtcbiAgICAgIGZvciAoaSA9IGogPSAwLCByZWYgPSBwYXJhbXMubGVuZ3RoIC0gMTsgKDAgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGkgPSAwIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgICBjaHIgPSBwYXJhbXNbaV07XG4gICAgICAgIGlmIChjaHIgPT09ICcgJyAmJiAhaW5TdHIpIHtcbiAgICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgdGhpcy5uYW1lZFtuYW1lXSA9IHBhcmFtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcy5wdXNoKHBhcmFtKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyYW0gPSAnJztcbiAgICAgICAgICBuYW1lID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoKGNociA9PT0gJ1wiJyB8fCBjaHIgPT09IFwiJ1wiKSAmJiAoaSA9PT0gMCB8fCBwYXJhbXNbaSAtIDFdICE9PSAnXFxcXCcpKSB7XG4gICAgICAgICAgaW5TdHIgPSAhaW5TdHI7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hyID09PSAnOicgJiYgIW5hbWUgJiYgIWluU3RyICYmICgoYWxsb3dlZE5hbWVkID09IG51bGwpIHx8IGluZGV4T2YuY2FsbChhbGxvd2VkTmFtZWQsIG5hbWUpID49IDApKSB7XG4gICAgICAgICAgbmFtZSA9IHBhcmFtO1xuICAgICAgICAgIHBhcmFtID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyYW0gKz0gY2hyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocGFyYW0ubGVuZ3RoKSB7XG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSBwYXJhbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXMucHVzaChwYXJhbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmcoKSB7XG4gICAgdmFyIGY7XG4gICAgaWYgKGYgPSB0aGlzLl9maW5kQ2xvc2luZ1BvcygpKSB7XG4gICAgICB0aGlzLmNvbnRlbnQgPSBTdHJpbmdIZWxwZXIudHJpbUVtcHR5TGluZSh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBmLnBvcykpO1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZi5wb3MgKyBmLnN0ci5sZW5ndGgpO1xuICAgIH1cbiAgfVxuXG4gIF9maW5kQ2xvc2luZ1BvcygpIHtcbiAgICB2YXIgY2xvc2luZywgZiwgb3BlbmluZztcbiAgICBpZiAodGhpcy5jbG9zaW5nUG9zICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3M7XG4gICAgfVxuICAgIGNsb3NpbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY21kTmFtZSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWROYW1lO1xuICAgIGlmIChmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBvcGVuaW5nLCBjbG9zaW5nKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1BvcyA9IGY7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrRWxvbmdhdGVkKCkge1xuICAgIHZhciBlbmRQb3MsIG1heCwgcmVmO1xuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCk7XG4gICAgbWF4ID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpO1xuICAgIHdoaWxlIChlbmRQb3MgPCBtYXggJiYgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmRlY28pIHtcbiAgICAgIGVuZFBvcyArPSB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoO1xuICAgIH1cbiAgICBpZiAoZW5kUG9zID49IG1heCB8fCAoKHJlZiA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSkgPT09ICcgJyB8fCByZWYgPT09IFwiXFxuXCIgfHwgcmVmID09PSBcIlxcclwiKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKTtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tCb3goKSB7XG4gICAgdmFyIGNsLCBjciwgZW5kUG9zO1xuICAgIGlmICgodGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpICYmIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PT0gJ2NvbW1lbnQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsID0gdGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCgpO1xuICAgIGNyID0gdGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKTtcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpICsgY3IubGVuZ3RoO1xuICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zIC0gY2wubGVuZ3RoLCB0aGlzLnBvcykgPT09IGNsICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLCBlbmRQb3MpID09PSBjcikge1xuICAgICAgdGhpcy5wb3MgPSB0aGlzLnBvcyAtIGNsLmxlbmd0aDtcbiAgICAgIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKTtcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkuaW5kZXhPZihjbCkgPiAtMSAmJiB0aGlzLmdldFBvcygpLnNhbWVMaW5lc1N1ZmZpeCgpLmluZGV4T2YoY3IpID4gLTEpIHtcbiAgICAgIHRoaXMuaW5Cb3ggPSAxO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKSB7XG4gICAgdmFyIGVjbCwgZWNyLCBlZCwgcmUxLCByZTIsIHJlMztcbiAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29kZXdhdmUuZGVjbyk7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86JHtlZH0pKyR7ZWNyfSRgLCBcImdtXCIpO1xuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXlxcXFxzKig/OiR7ZWR9KSoke2Vjcn1cXHI/XFxuYCk7XG4gICAgICByZTMgPSBuZXcgUmVnRXhwKGBcXG5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHMqJGApO1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudC5yZXBsYWNlKHJlMSwgJyQxJykucmVwbGFjZShyZTIsICcnKS5yZXBsYWNlKHJlMywgJycpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRQYXJlbnRDbWRzKCkge1xuICAgIHZhciByZWY7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID0gKHJlZiA9IHRoaXMuY29kZXdhdmUuZ2V0RW5jbG9zaW5nQ21kKHRoaXMuZ2V0RW5kUG9zKCkpKSAhPSBudWxsID8gcmVmLmluaXQoKSA6IHZvaWQgMDtcbiAgfVxuXG4gIHNldE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlQb3MgPSBtdWx0aVBvcztcbiAgfVxuXG4gIF9nZXRDbWRPYmooKSB7XG4gICAgdGhpcy5nZXRDbWQoKTtcbiAgICB0aGlzLl9jaGVja0JveCgpO1xuICAgIHRoaXMuY29udGVudCA9IHRoaXMucmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGhpcy5jb250ZW50KTtcbiAgICByZXR1cm4gc3VwZXIuX2dldENtZE9iaigpO1xuICB9XG5cbiAgX2luaXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlUGFyYW1zKHRoaXMucmF3UGFyYW1zKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCB0aGlzLmNvZGV3YXZlLmNvbnRleHQ7XG4gIH1cblxuICBnZXRDbWQoKSB7XG4gICAgaWYgKHRoaXMuY21kID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2dldFBhcmVudENtZHMoKTtcbiAgICAgIGlmICh0aGlzLm5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikge1xuICAgICAgICB0aGlzLmNtZCA9IENvbW1hbmQuY21kcy5nZXRDbWQoJ2NvcmU6bm9fZXhlY3V0ZScpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSk7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZmluZGVyLmNvbnRleHQ7XG4gICAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpO1xuICAgICAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5jbWQuZnVsbE5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNtZDtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsIHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKSk7XG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gZmluZGVyO1xuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMoKSB7XG4gICAgdmFyIG5zcGNzLCBvYmo7XG4gICAgbnNwY3MgPSBbXTtcbiAgICBvYmogPSB0aGlzO1xuICAgIHdoaWxlIChvYmoucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IG9iai5wYXJlbnQ7XG4gICAgICBpZiAoKG9iai5jbWQgIT0gbnVsbCkgJiYgKG9iai5jbWQuZnVsbE5hbWUgIT0gbnVsbCkpIHtcbiAgICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5zcGNzO1xuICB9XG5cbiAgX3JlbW92ZUJyYWNrZXQoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcodGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCwgc3RyLmxlbmd0aCAtIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpO1xuICB9XG5cbiAgYWx0ZXJBbGlhc09mKGFsaWFzT2YpIHtcbiAgICB2YXIgY21kTmFtZSwgbnNwYztcbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQodGhpcy5jbWROYW1lKTtcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBjbWROYW1lKTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cyB8fCB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgYmVmb3JlRnVuY3QsIHJlcztcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIGlmICgodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgIT0gbnVsbCkgJiYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKHRoaXMucG9zICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCkgIT0gbnVsbCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgoJycpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKGJlZm9yZUZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKSkge1xuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgaWYgKChyZXMgPSB0aGlzLnJlc3VsdCgpKSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgocmVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRXhlY3V0ZUZ1bmN0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RW5kUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aDtcbiAgfVxuXG4gIGdldFBvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICB9XG5cbiAgZ2V0T3BlbmluZ1BvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLm9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcbiAgfVxuXG4gIGdldEluZGVudCgpIHtcbiAgICB2YXIgaGVscGVyO1xuICAgIGlmICh0aGlzLmluZGVudExlbiA9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5pbkJveCAhPSBudWxsKSB7XG4gICAgICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0KTtcbiAgICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIucmVtb3ZlQ29tbWVudCh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IHRoaXMucG9zIC0gdGhpcy5nZXRQb3MoKS5wcmV2RU9MKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluZGVudExlbjtcbiAgfVxuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50KHRleHQpIHtcbiAgICB2YXIgcmVnO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoJ15cXFxcc3snICsgdGhpcy5nZXRJbmRlbnQoKSArICd9JywgJ2dtJyk7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhbHRlclJlc3VsdEZvckJveChyZXBsKSB7XG4gICAgdmFyIGJveCwgaGVscGVyLCBvcmlnaW5hbCwgcmVzO1xuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KCk7XG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLCBmYWxzZSk7XG4gICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCdyZXBsYWNlQm94JykpIHtcbiAgICAgIGJveCA9IGhlbHBlci5nZXRCb3hGb3JQb3Mob3JpZ2luYWwpO1xuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdO1xuICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIuaW5kZW50O1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgICByZXBsLnN0YXJ0ID0gb3JpZ2luYWwucHJldkVPTCgpO1xuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKCk7XG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIHRoaXMuY29kZXdhdmUubWFya2VyICsgcmVwbC50ZXh0ICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge1xuICAgICAgICBtdWx0aWxpbmU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIFtyZXBsLnByZWZpeCwgcmVwbC50ZXh0LCByZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQodGhpcy5jb2Rld2F2ZS5tYXJrZXIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVwbDtcbiAgfVxuXG4gIGdldEN1cnNvckZyb21SZXN1bHQocmVwbCkge1xuICAgIHZhciBjdXJzb3JQb3MsIHA7XG4gICAgY3Vyc29yUG9zID0gcmVwbC5yZXNQb3NCZWZvcmVQcmVmaXgoKTtcbiAgICBpZiAoKHRoaXMuY21kICE9IG51bGwpICYmIHRoaXMuY29kZXdhdmUuY2hlY2tDYXJyZXQgJiYgdGhpcy5nZXRPcHRpb24oJ2NoZWNrQ2FycmV0JykpIHtcbiAgICAgIGlmICgocCA9IHRoaXMuY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCArIHJlcGwucHJlZml4Lmxlbmd0aCArIHA7XG4gICAgICB9XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gY3Vyc29yUG9zO1xuICB9XG5cbiAgY2hlY2tNdWx0aShyZXBsKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV3UmVwbCwgb3JpZ2luYWxQb3MsIG9yaWdpbmFsVGV4dCwgcG9zLCByZWYsIHJlcGxhY2VtZW50cztcbiAgICBpZiAoKHRoaXMubXVsdGlQb3MgIT0gbnVsbCkgJiYgdGhpcy5tdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF07XG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpO1xuICAgICAgcmVmID0gdGhpcy5tdWx0aVBvcztcbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgIHBvcyA9IHJlZltpXTtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0IC0gb3JpZ2luYWxQb3MpO1xuICAgICAgICAgIGlmIChuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09PSBvcmlnaW5hbFRleHQpIHtcbiAgICAgICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ld1JlcGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtyZXBsXTtcbiAgICB9XG4gIH1cblxuICByZXBsYWNlV2l0aCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQodGhpcy5wb3MsIHRoaXMuZ2V0RW5kUG9zKCksIHRleHQpKTtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnQocmVwbCkge1xuICAgIHZhciBjdXJzb3JQb3MsIHJlcGxhY2VtZW50cztcbiAgICByZXBsLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYWx0ZXJSZXN1bHRGb3JCb3gocmVwbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICB9XG4gICAgY3Vyc29yUG9zID0gdGhpcy5nZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpO1xuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKGN1cnNvclBvcywgY3Vyc29yUG9zKV07XG4gICAgcmVwbGFjZW1lbnRzID0gdGhpcy5jaGVja011bHRpKHJlcGwpO1xuICAgIHRoaXMucmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydDtcbiAgICB0aGlzLnJlcGxhY2VFbmQgPSByZXBsLnJlc0VuZCgpO1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUHJvY2Vzc1xuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAjIiwiXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcic7XG5cbmV4cG9ydCBjbGFzcyBTdG9yYWdlXG4gIGNvbnN0cnVjdG9yOiAoQGVuZ2luZSkgLT5cblxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBpZiBAZW5naW5lQXZhaWxhYmxlKClcbiAgICAgIEBlbmdpbmUuc2F2ZShrZXksdmFsKVxuXG4gIHNhdmVJblBhdGg6IChwYXRoLCBrZXksIHZhbCkgLT5cbiAgICBpZiBAZW5naW5lQXZhaWxhYmxlKClcbiAgICAgIEBlbmdpbmUuc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbClcblxuICBsb2FkOiAoa2V5KSAtPlxuICAgIGlmIEBlbmdpbmU/XG4gICAgICBAZW5naW5lLmxvYWQoa2V5KVxuXG4gIGVuZ2luZUF2YWlsYWJsZTogKCkgLT5cbiAgICBpZiBAZW5naW5lP1xuICAgICAgdHJ1ZVxuICAgIGVsc2VcbiAgICAgIEBsb2dnZXIgPSBAbG9nZ2VyIHx8IG5ldyBMb2dnZXIoKVxuICAgICAgQGxvZ2dlci5sb2coJ05vIHN0b3JhZ2UgZW5naW5lIGF2YWlsYWJsZScpXG4gICAgICBmYWxzZVxuICAgICIsImltcG9ydCB7XG4gIExvZ2dlclxufSBmcm9tICcuL0xvZ2dlcic7XG5cbmV4cG9ydCB2YXIgU3RvcmFnZSA9IGNsYXNzIFN0b3JhZ2Uge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgfVxuXG4gIHNhdmUoa2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmUoa2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuXG4gIGxvYWQoa2V5KSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5sb2FkKGtleSk7XG4gICAgfVxuICB9XG5cbiAgZW5naW5lQXZhaWxhYmxlKCkge1xuICAgIGlmICh0aGlzLmVuZ2luZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dnZXIgPSB0aGlzLmxvZ2dlciB8fCBuZXcgTG9nZ2VyKCk7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ05vIHN0b3JhZ2UgZW5naW5lIGF2YWlsYWJsZScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBEb21LZXlMaXN0ZW5lclxuICBzdGFydExpc3RlbmluZzogKHRhcmdldCkgLT5cbiAgXG4gICAgdGltZW91dCA9IG51bGxcbiAgICBcbiAgICBvbmtleWRvd24gPSAoZSkgPT4gXG4gICAgICBpZiAoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgb3IgQG9iaiA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSBhbmQgZS5rZXlDb2RlID09IDY5ICYmIGUuY3RybEtleVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgQG9uQWN0aXZhdGlvbktleT9cbiAgICAgICAgICBAb25BY3RpdmF0aW9uS2V5KClcbiAgICBvbmtleXVwID0gKGUpID0+IFxuICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICBAb25BbnlDaGFuZ2UoZSlcbiAgICBvbmtleXByZXNzID0gKGUpID0+IFxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpIGlmIHRpbWVvdXQ/XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCAoPT5cbiAgICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgICAgKSwgMTAwXG4gICAgICAgICAgICBcbiAgICBpZiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lclxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgb25rZXlwcmVzcylcbiAgICBlbHNlIGlmIHRhcmdldC5hdHRhY2hFdmVudFxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcylcblxuaXNFbGVtZW50ID0gKG9iaikgLT5cbiAgdHJ5XG4gICAgIyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICBjYXRjaCBlXG4gICAgIyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgIyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgIyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG4gICAgcmV0dXJuICh0eXBlb2Ygb2JqPT1cIm9iamVjdFwiKSAmJlxuICAgICAgKG9iai5ub2RlVHlwZT09MSkgJiYgKHR5cGVvZiBvYmouc3R5bGUgPT0gXCJvYmplY3RcIikgJiZcbiAgICAgICh0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT1cIm9iamVjdFwiKVxuXG4gICAgICAgIFxuZXhwb3J0IGNsYXNzIFRleHRBcmVhRWRpdG9yIGV4dGVuZHMgVGV4dFBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEB0YXJnZXQpIC0+XG4gICAgc3VwZXIoKVxuICAgIEBvYmogPSBpZiBpc0VsZW1lbnQoQHRhcmdldCkgdGhlbiBAdGFyZ2V0IGVsc2UgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQHRhcmdldClcbiAgICB1bmxlc3MgQG9iaj9cbiAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCJcbiAgICBAbmFtZXNwYWNlID0gJ3RleHRhcmVhJ1xuICAgIEBjaGFuZ2VMaXN0ZW5lcnMgPSBbXVxuICAgIEBfc2tpcENoYW5nZUV2ZW50ID0gMFxuICBzdGFydExpc3RlbmluZzogRG9tS2V5TGlzdGVuZXIucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nXG4gIG9uQW55Q2hhbmdlOiAoZSkgLT5cbiAgICBpZiBAX3NraXBDaGFuZ2VFdmVudCA8PSAwXG4gICAgICBmb3IgY2FsbGJhY2sgaW4gQGNoYW5nZUxpc3RlbmVyc1xuICAgICAgICBjYWxsYmFjaygpXG4gICAgZWxzZVxuICAgICAgQF9za2lwQ2hhbmdlRXZlbnQtLVxuICAgICAgQG9uU2tpcGVkQ2hhbmdlKCkgaWYgQG9uU2tpcGVkQ2hhbmdlP1xuICBza2lwQ2hhbmdlRXZlbnQ6IChuYiA9IDEpIC0+XG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgKz0gbmJcbiAgYmluZGVkVG86IChjb2Rld2F2ZSkgLT5cbiAgICBAb25BY3RpdmF0aW9uS2V5ID0gLT4gY29kZXdhdmUub25BY3RpdmF0aW9uS2V5KClcbiAgICBAc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpXG4gIHNlbGVjdGlvblByb3BFeGlzdHM6IC0+XG4gICAgXCJzZWxlY3Rpb25TdGFydFwiIG9mIEBvYmpcbiAgaGFzRm9jdXM6IC0+IFxuICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaXMgQG9ialxuICB0ZXh0OiAodmFsKSAtPlxuICAgIGlmIHZhbD9cbiAgICAgIHVubGVzcyBAdGV4dEV2ZW50Q2hhbmdlKHZhbClcbiAgICAgICAgQG9iai52YWx1ZSA9IHZhbFxuICAgIEBvYmoudmFsdWVcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCwgZW5kKSBvciBAc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSBvciBzdXBlcihzdGFydCwgZW5kLCB0ZXh0KVxuICB0ZXh0RXZlbnRDaGFuZ2U6ICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIC0+XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50JykgaWYgZG9jdW1lbnQuY3JlYXRlRXZlbnQ/XG4gICAgaWYgZXZlbnQ/IGFuZCBldmVudC5pbml0VGV4dEV2ZW50PyBhbmQgZXZlbnQuaXNUcnVzdGVkICE9IGZhbHNlXG4gICAgICBlbmQgPSBAdGV4dExlbigpIHVubGVzcyBlbmQ/XG4gICAgICBpZiB0ZXh0Lmxlbmd0aCA8IDFcbiAgICAgICAgaWYgc3RhcnQgIT0gMFxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihzdGFydC0xLHN0YXJ0KVxuICAgICAgICAgIHN0YXJ0LS1cbiAgICAgICAgZWxzZSBpZiBlbmQgIT0gQHRleHRMZW4oKVxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihlbmQsZW5kKzEpXG4gICAgICAgICAgZW5kKytcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSlcbiAgICAgICMgQHNldEN1cnNvclBvcyhzdGFydCxlbmQpXG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBAb2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgICBAc2tpcENoYW5nZUV2ZW50KClcbiAgICAgIHRydWVcbiAgICBlbHNlIFxuICAgICAgZmFsc2VcbiAgc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZDogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBpZiBkb2N1bWVudC5leGVjQ29tbWFuZD9cbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpO1xuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuXG4gIGdldEN1cnNvclBvczogLT5cbiAgICByZXR1cm4gQHRtcEN1cnNvclBvcyBpZiBAdG1wQ3Vyc29yUG9zP1xuICAgIGlmIEBoYXNGb2N1c1xuICAgICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgICAgbmV3IFBvcyhAb2JqLnNlbGVjdGlvblN0YXJ0LEBvYmouc2VsZWN0aW9uRW5kKVxuICAgICAgZWxzZVxuICAgICAgICBAZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKVxuICBnZXRDdXJzb3JQb3NGYWxsYmFjazogLT5cbiAgICBpZiBAb2JqLmNyZWF0ZVRleHRSYW5nZVxuICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKClcbiAgICAgIGlmIHNlbC5wYXJlbnRFbGVtZW50KCkgaXMgQG9ialxuICAgICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayBzZWwuZ2V0Qm9va21hcmsoKVxuICAgICAgICBsZW4gPSAwXG5cbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgbGVuKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcm5nLnNldEVuZFBvaW50IFwiU3RhcnRUb1N0YXJ0XCIsIEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcG9zID0gbmV3IFBvcygwLGxlbilcbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgcG9zLnN0YXJ0KytcbiAgICAgICAgICBwb3MuZW5kKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcmV0dXJuIHBvc1xuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kKSAtPlxuICAgIGVuZCA9IHN0YXJ0IGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgIEB0bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIHNldFRpbWVvdXQgKD0+XG4gICAgICAgIEB0bXBDdXJzb3JQb3MgPSBudWxsXG4gICAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgKSwgMVxuICAgIGVsc2UgXG4gICAgICBAc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZClcbiAgICByZXR1cm5cbiAgc2V0Q3Vyc29yUG9zRmFsbGJhY2s6IChzdGFydCwgZW5kKSAtPlxuICAgIGlmIEBvYmouY3JlYXRlVGV4dFJhbmdlXG4gICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICBybmcubW92ZVN0YXJ0IFwiY2hhcmFjdGVyXCIsIHN0YXJ0XG4gICAgICBybmcuY29sbGFwc2UoKVxuICAgICAgcm5nLm1vdmVFbmQgXCJjaGFyYWN0ZXJcIiwgZW5kIC0gc3RhcnRcbiAgICAgIHJuZy5zZWxlY3QoKVxuICBnZXRMYW5nOiAtPlxuICAgIHJldHVybiBAX2xhbmcgaWYgQF9sYW5nXG4gICAgQG9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpIGlmIEBvYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKVxuICBzZXRMYW5nOiAodmFsKSAtPlxuICAgIEBfbGFuZyA9IHZhbFxuICAgIEBvYmouc2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnLHZhbClcbiAgY2FuTGlzdGVuVG9DaGFuZ2U6IC0+XG4gICAgcmV0dXJuIHRydWVcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBAY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgaWYgKGkgPSBAY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xXG4gICAgICBAY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpLCAxKVxuICAgICAgXG4gICAgICBcbiAgYXBwbHlSZXBsYWNlbWVudHM6IChyZXBsYWNlbWVudHMpIC0+XG4gICAgaWYgcmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgYW5kIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDFcbiAgICAgIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zID0gW0BnZXRDdXJzb3JQb3MoKV1cbiAgICBzdXBlcihyZXBsYWNlbWVudHMpO1xuICAgICAgIiwidmFyIGlzRWxlbWVudDtcblxuaW1wb3J0IHtcbiAgVGV4dFBhcnNlclxufSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5leHBvcnQgdmFyIERvbUtleUxpc3RlbmVyID0gY2xhc3MgRG9tS2V5TGlzdGVuZXIge1xuICBzdGFydExpc3RlbmluZyh0YXJnZXQpIHtcbiAgICB2YXIgb25rZXlkb3duLCBvbmtleXByZXNzLCBvbmtleXVwLCB0aW1lb3V0O1xuICAgIHRpbWVvdXQgPSBudWxsO1xuICAgIG9ua2V5ZG93biA9IChlKSA9PiB7XG4gICAgICBpZiAoKENvZGV3YXZlLmluc3RhbmNlcy5sZW5ndGggPCAyIHx8IHRoaXMub2JqID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSAmJiBlLmtleUNvZGUgPT09IDY5ICYmIGUuY3RybEtleSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLm9uQWN0aXZhdGlvbktleSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BY3RpdmF0aW9uS2V5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIG9ua2V5dXAgPSAoZSkgPT4ge1xuICAgICAgaWYgKHRoaXMub25BbnlDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkFueUNoYW5nZShlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIG9ua2V5cHJlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYgKHRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGltZW91dCA9IHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMub25BbnlDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQW55Q2hhbmdlKGUpO1xuICAgICAgICB9XG4gICAgICB9KSwgMTAwKTtcbiAgICB9O1xuICAgIGlmICh0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9ua2V5ZG93bik7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9ua2V5dXApO1xuICAgICAgcmV0dXJuIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgb25rZXlwcmVzcyk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuYXR0YWNoRXZlbnQpIHtcbiAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBvbmtleWRvd24pO1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXl1cFwiLCBvbmtleXVwKTtcbiAgICAgIHJldHVybiB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXByZXNzXCIsIG9ua2V5cHJlc3MpO1xuICAgIH1cbiAgfVxuXG59O1xuXG5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGU7XG4gIHRyeSB7XG4gICAgLy8gVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb20pXG4gICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICAvLyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgLy8gYW4gZXhjZXB0aW9uIGlzIHRocm93biBhbmQgd2UgZW5kIHVwIGhlcmUuIFRlc3Rpbmcgc29tZVxuICAgIC8vIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcbiAgICByZXR1cm4gKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpICYmIChvYmoubm9kZVR5cGUgPT09IDEpICYmICh0eXBlb2Ygb2JqLnN0eWxlID09PSBcIm9iamVjdFwiKSAmJiAodHlwZW9mIG9iai5vd25lckRvY3VtZW50ID09PSBcIm9iamVjdFwiKTtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBUZXh0QXJlYUVkaXRvciA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQxKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQxO1xuICAgICAgdGhpcy5vYmogPSBpc0VsZW1lbnQodGhpcy50YXJnZXQpID8gdGhpcy50YXJnZXQgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldCk7XG4gICAgICBpZiAodGhpcy5vYmogPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBcIlRleHRBcmVhIG5vdCBmb3VuZFwiO1xuICAgICAgfVxuICAgICAgdGhpcy5uYW1lc3BhY2UgPSAndGV4dGFyZWEnO1xuICAgICAgdGhpcy5jaGFuZ2VMaXN0ZW5lcnMgPSBbXTtcbiAgICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudCA9IDA7XG4gICAgfVxuXG4gICAgb25BbnlDaGFuZ2UoZSkge1xuICAgICAgdmFyIGNhbGxiYWNrLCBqLCBsZW4xLCByZWYsIHJlc3VsdHM7XG4gICAgICBpZiAodGhpcy5fc2tpcENoYW5nZUV2ZW50IDw9IDApIHtcbiAgICAgICAgcmVmID0gdGhpcy5jaGFuZ2VMaXN0ZW5lcnM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZi5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBjYWxsYmFjayA9IHJlZltqXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY2FsbGJhY2soKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQtLTtcbiAgICAgICAgaWYgKHRoaXMub25Ta2lwZWRDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uU2tpcGVkQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBza2lwQ2hhbmdlRXZlbnQobmIgPSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2tpcENoYW5nZUV2ZW50ICs9IG5iO1xuICAgIH1cblxuICAgIGJpbmRlZFRvKGNvZGV3YXZlKSB7XG4gICAgICB0aGlzLm9uQWN0aXZhdGlvbktleSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29kZXdhdmUub25BY3RpdmF0aW9uS2V5KCk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpO1xuICAgIH1cblxuICAgIHNlbGVjdGlvblByb3BFeGlzdHMoKSB7XG4gICAgICByZXR1cm4gXCJzZWxlY3Rpb25TdGFydFwiIGluIHRoaXMub2JqO1xuICAgIH1cblxuICAgIGhhc0ZvY3VzKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMub2JqO1xuICAgIH1cblxuICAgIHRleHQodmFsKSB7XG4gICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHRFdmVudENoYW5nZSh2YWwpKSB7XG4gICAgICAgICAgdGhpcy5vYmoudmFsdWUgPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iai52YWx1ZTtcbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCwgZW5kKSB8fCB0aGlzLnNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQodGV4dCwgc3RhcnQsIGVuZCkgfHwgc3VwZXIuc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KTtcbiAgICB9XG5cbiAgICB0ZXh0RXZlbnRDaGFuZ2UodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSB7XG4gICAgICB2YXIgZXZlbnQ7XG4gICAgICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQgIT0gbnVsbCkge1xuICAgICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUZXh0RXZlbnQnKTtcbiAgICAgIH1cbiAgICAgIGlmICgoZXZlbnQgIT0gbnVsbCkgJiYgKGV2ZW50LmluaXRUZXh0RXZlbnQgIT0gbnVsbCkgJiYgZXZlbnQuaXNUcnVzdGVkICE9PSBmYWxzZSkge1xuICAgICAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgICAgICBlbmQgPSB0aGlzLnRleHRMZW4oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGV4dC5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgaWYgKHN0YXJ0ICE9PSAwKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0IC0gMSwgc3RhcnQpO1xuICAgICAgICAgICAgc3RhcnQtLTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVuZCAhPT0gdGhpcy50ZXh0TGVuKCkpIHtcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoZW5kLCBlbmQgKyAxKTtcbiAgICAgICAgICAgIGVuZCsrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGV2ZW50LmluaXRUZXh0RXZlbnQoJ3RleHRJbnB1dCcsIHRydWUsIHRydWUsIG51bGwsIHRleHQsIDkpO1xuICAgICAgICAvLyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICB0aGlzLm9iai5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgdGhpcy5za2lwQ2hhbmdlRXZlbnQoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIGlmIChkb2N1bWVudC5leGVjQ29tbWFuZCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZDtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEN1cnNvclBvcygpIHtcbiAgICAgIGlmICh0aGlzLnRtcEN1cnNvclBvcyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRtcEN1cnNvclBvcztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmhhc0ZvY3VzKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFBvcyh0aGlzLm9iai5zZWxlY3Rpb25TdGFydCwgdGhpcy5vYmouc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJzb3JQb3NGYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKSB7XG4gICAgICB2YXIgbGVuLCBwb3MsIHJuZywgc2VsO1xuICAgICAgaWYgKHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSkge1xuICAgICAgICBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgaWYgKHNlbC5wYXJlbnRFbGVtZW50KCkgPT09IHRoaXMub2JqKSB7XG4gICAgICAgICAgcm5nID0gdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgcm5nLm1vdmVUb0Jvb2ttYXJrKHNlbC5nZXRCb29rbWFyaygpKTtcbiAgICAgICAgICBsZW4gPSAwO1xuICAgICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIGxlbisrO1xuICAgICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBybmcuc2V0RW5kUG9pbnQoXCJTdGFydFRvU3RhcnRcIiwgdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKCkpO1xuICAgICAgICAgIHBvcyA9IG5ldyBQb3MoMCwgbGVuKTtcbiAgICAgICAgICB3aGlsZSAocm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwKSB7XG4gICAgICAgICAgICBwb3Muc3RhcnQrKztcbiAgICAgICAgICAgIHBvcy5lbmQrKztcbiAgICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25Qcm9wRXhpc3RzKSB7XG4gICAgICAgIHRoaXMudG1wQ3Vyc29yUG9zID0gbmV3IFBvcyhzdGFydCwgZW5kKTtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICBzZXRUaW1lb3V0KCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBudWxsO1xuICAgICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZDtcbiAgICAgICAgfSksIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKSB7XG4gICAgICB2YXIgcm5nO1xuICAgICAgaWYgKHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSkge1xuICAgICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgcm5nLm1vdmVTdGFydChcImNoYXJhY3RlclwiLCBzdGFydCk7XG4gICAgICAgIHJuZy5jb2xsYXBzZSgpO1xuICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCBlbmQgLSBzdGFydCk7XG4gICAgICAgIHJldHVybiBybmcuc2VsZWN0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGFuZygpIHtcbiAgICAgIGlmICh0aGlzLl9sYW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub2JqLmhhc0F0dHJpYnV0ZSgnZGF0YS1sYW5nJykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0TGFuZyh2YWwpIHtcbiAgICAgIHRoaXMuX2xhbmcgPSB2YWw7XG4gICAgICByZXR1cm4gdGhpcy5vYmouc2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnLCB2YWwpO1xuICAgIH1cblxuICAgIGNhbkxpc3RlblRvQ2hhbmdlKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYW5nZUxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgdmFyIGk7XG4gICAgICBpZiAoKGkgPSB0aGlzLmNoYW5nZUxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cykge1xuICAgICAgaWYgKHJlcGxhY2VtZW50cy5sZW5ndGggPiAwICYmIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbdGhpcy5nZXRDdXJzb3JQb3MoKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwZXIuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgICB9XG5cbiAgfTtcblxuICBUZXh0QXJlYUVkaXRvci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmcgPSBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmc7XG5cbiAgcmV0dXJuIFRleHRBcmVhRWRpdG9yO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSAnLi9FZGl0b3InO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5leHBvcnQgY2xhc3MgVGV4dFBhcnNlciBleHRlbmRzIEVkaXRvclxuICBjb25zdHJ1Y3RvcjogKEBfdGV4dCkgLT5cbiAgICBzdXBlcigpXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgQF90ZXh0ID0gdmFsIGlmIHZhbD9cbiAgICBAX3RleHRcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICByZXR1cm4gQHRleHQoKVtwb3NdXG4gIHRleHRMZW46IChwb3MpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KCkubGVuZ3RoXG4gIHRleHRTdWJzdHI6IChzdGFydCwgZW5kKSAtPlxuICAgIHJldHVybiBAdGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICBpbnNlcnRUZXh0QXQ6ICh0ZXh0LCBwb3MpIC0+XG4gICAgQHRleHQoQHRleHQoKS5zdWJzdHJpbmcoMCwgcG9zKSt0ZXh0K0B0ZXh0KCkuc3Vic3RyaW5nKHBvcyxAdGV4dCgpLmxlbmd0aCkpXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIEB0ZXh0KEB0ZXh0KCkuc2xpY2UoMCwgc3RhcnQpICsgKHRleHQgfHwgXCJcIikgKyBAdGV4dCgpLnNsaWNlKGVuZCkpXG4gIGdldEN1cnNvclBvczogLT5cbiAgICByZXR1cm4gQHRhcmdldFxuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kKSAtPlxuICAgIGVuZCA9IHN0YXJ0IGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgQHRhcmdldCA9IG5ldyBQb3MoIHN0YXJ0LCBlbmQgKSIsImltcG9ydCB7XG4gIEVkaXRvclxufSBmcm9tICcuL0VkaXRvcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCB2YXIgVGV4dFBhcnNlciA9IGNsYXNzIFRleHRQYXJzZXIgZXh0ZW5kcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcihfdGV4dCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fdGV4dCA9IF90ZXh0O1xuICB9XG5cbiAgdGV4dCh2YWwpIHtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHQgPSB2YWw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICB9XG5cbiAgdGV4dENoYXJBdChwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KClbcG9zXTtcbiAgfVxuXG4gIHRleHRMZW4ocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLmxlbmd0aDtcbiAgfVxuXG4gIHRleHRTdWJzdHIoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gIH1cblxuICBpbnNlcnRUZXh0QXQodGV4dCwgcG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zdWJzdHJpbmcoMCwgcG9zKSArIHRleHQgKyB0aGlzLnRleHQoKS5zdWJzdHJpbmcocG9zLCB0aGlzLnRleHQoKS5sZW5ndGgpKTtcbiAgfVxuXG4gIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLnRleHQodGhpcy50ZXh0KCkuc2xpY2UoMCwgc3RhcnQpICsgKHRleHQgfHwgXCJcIikgKyB0aGlzLnRleHQoKS5zbGljZShlbmQpKTtcbiAgfVxuXG4gIGdldEN1cnNvclBvcygpIHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXQ7XG4gIH1cblxuICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgZW5kID0gc3RhcnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRhcmdldCA9IG5ldyBQb3Moc3RhcnQsIGVuZCk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcbmltcG9ydCB7IENvcmVDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBKc0NvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9Kc0NvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBQaHBDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IEh0bWxDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBXcmFwcGVkUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9XcmFwcGVkUG9zJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZUVuZ2luZSB9IGZyb20gJy4vc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lJztcblxuUG9zLndyYXBDbGFzcyA9IFdyYXBwZWRQb3NcblxuQ29kZXdhdmUuaW5zdGFuY2VzID0gW11cblxuQ29tbWFuZC5wcm92aWRlcnMgPSBbXG4gIG5ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IEpzQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IFBocENvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKClcbl1cblxuaWYgbG9jYWxTdG9yYWdlP1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlRW5naW5lKClcblxuZXhwb3J0IHsgQ29kZXdhdmUgfSIsImltcG9ydCB7XG4gIENvZGV3YXZlXG59IGZyb20gJy4vQ29kZXdhdmUnO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIENvcmVDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBKc0NvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvSnNDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBQaHBDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL1BocENvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIEh0bWxDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5pbXBvcnQge1xuICBXcmFwcGVkUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvV3JhcHBlZFBvcyc7XG5cbmltcG9ydCB7XG4gIExvY2FsU3RvcmFnZUVuZ2luZVxufSBmcm9tICcuL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZSc7XG5cblBvcy53cmFwQ2xhc3MgPSBXcmFwcGVkUG9zO1xuXG5Db2Rld2F2ZS5pbnN0YW5jZXMgPSBbXTtcblxuQ29tbWFuZC5wcm92aWRlcnMgPSBbbmV3IENvcmVDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEpzQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBQaHBDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEh0bWxDb21tYW5kUHJvdmlkZXIoKV07XG5cbmlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlRW5naW5lKCk7XG59XG5cbmV4cG9ydCB7XG4gIENvZGV3YXZlXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kLCBCYXNlQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgTGFuZ0RldGVjdG9yIH0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi4vQm94SGVscGVyJztcbmltcG9ydCB7IEVkaXRDbWRQcm9wIH0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCBjbGFzcyBDb3JlQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NvcmUnKSlcbiAgY29yZS5hZGREZXRlY3RvcihuZXcgTGFuZ0RldGVjdG9yKCkpXG4gIFxuICBjb3JlLmFkZENtZHMoe1xuICAgICdoZWxwJzp7XG4gICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgfn5ib3h+flxuICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgX19fICAgICAgICAgXyAgIF9fICAgICAgX19cbiAgICAgICAgIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xuICAgICAgICAvIC9fXy8gXyBcXFxcLyBfYCAvIC1fXFxcXCBcXFxcL1xcXFwvIC8gX2AgXFxcXCBWIC8gLV8vXG4gICAgICAgIFxcXFxfX19fXFxcXF9fXy9cXFxcX18sX1xcXFxfX198XFxcXF8vXFxcXF8vXFxcXF9fLF98XFxcXF8vXFxcXF9fX3xcbiAgICAgICAgVGhlIHRleHQgZWRpdG9yIGhlbHBlclxuICAgICAgICB+fi9xdW90ZV9jYXJyZXR+flxuICAgICAgICBcbiAgICAgICAgV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcbiAgICAgICAgeW91ciB0ZXh0IGVkaXRvci4gVGhlc2UgY29tbWFuZHMgbXVzdCBiZSBwbGFjZWQgYmV0d2VlbiB0d28gXG4gICAgICAgIHBhaXJzIG9mIFwiflwiICh0aWxkZSkgYW5kIHRoZW4sIHRoZXkgY2FuIGJlIGV4ZWN1dGVkIGJ5IHByZXNzaW5nIFxuICAgICAgICBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIsIHdpdGggeW91ciBjdXJzb3IgaW5zaWRlIHRoZSBjb21tYW5kXG4gICAgICAgIEV4OiB+fiFoZWxsb35+XG4gICAgICAgIFxuICAgICAgICBZb3UgZG9udCBuZWVkIHRvIGFjdHVhbGx5IHR5cGUgYW55IFwiflwiICh0aWxkZSkuIFxuICAgICAgICBQcmVzc2luZyBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XG4gICAgICAgIHdpdGhpbiBhIGNvbW1hbmQuXG4gICAgICAgIFxuICAgICAgICBDb2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxuICAgICAgICBJbnN0ZWFkLCBpdCB1c2VzIHRleHQgd2l0aGluIGNvZGUgY29tbWVudHMgdG8gbWltaWMgVUlzLiBcbiAgICAgICAgVGhlIGdlbmVyYXRlZCBjb21tZW50IGJsb2NrcyB3aWxsIGJlIHJlZmVycmVkIHRvIGFzIHdpbmRvd3MgXG4gICAgICAgIGluIHRoZSBoZWxwIHNlY3Rpb25zLlxuICAgICAgICBcbiAgICAgICAgVG8gY2xvc2UgdGhpcyB3aW5kb3cgKGkuZS4gcmVtb3ZlIHRoaXMgY29tbWVudCBibG9jayksIHByZXNzIFxuICAgICAgICBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXG4gICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgIFxuICAgICAgICBVc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcbiAgICAgICAgZmVhdHVyZXMgb2YgQ29kZXdhdmVcbiAgICAgICAgfn4haGVscDpnZXRfc3RhcnRlZH5+IG9yIH5+IWhlbHA6ZGVtb35+XG4gICAgICAgIFxuICAgICAgICBMaXN0IG9mIGFsbCBoZWxwIHN1YmplY3RzIFxuICAgICAgICB+fiFoZWxwOnN1YmplY3Rzfn4gb3Igfn4haGVscDpzdWJ+fiBcbiAgICAgICAgXG4gICAgICAgIH5+IWNsb3Nlfn5cbiAgICAgICAgfn4vYm94fn5cbiAgICAgICAgXCJcIlwiXG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdzdWJqZWN0cyc6e1xuICAgICAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICAgIH5+IWhlbHB+flxuICAgICAgICAgICAgfn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcbiAgICAgICAgICAgIH5+IWhlbHA6c3ViamVjdHN+fiAofn4haGVscDpzdWJ+filcbiAgICAgICAgICAgIH5+IWhlbHA6ZWRpdGluZ35+ICh+fiFoZWxwOmVkaXR+filcbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ3N1Yic6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6c3ViamVjdHMnXG4gICAgICAgIH1cbiAgICAgICAgJ2dldF9zdGFydGVkJzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgVGhlIGNsYXNzaWMgSGVsbG8gV29ybGQuXG4gICAgICAgICAgICB+fiFoZWxsb3x+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fmhlbHA6ZWRpdGluZzppbnRyb35+XG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGNyZWF0aW5nIHlvdXIgb3duIGNvbW1hbmRzLCBzZWU6XG4gICAgICAgICAgICB+fiFoZWxwOmVkaXRpbmd+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2Rld2F2ZSBjb21lcyB3aXRoIG1hbnkgcHJlLWV4aXN0aW5nIGNvbW1hbmRzLiBIZXJlIGlzIGFuIGV4YW1wbGVcbiAgICAgICAgICAgIG9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xuICAgICAgICAgICAgfn4hanM6Zn5+XG4gICAgICAgICAgICB+fiFqczppZn5+XG4gICAgICAgICAgICAgIH5+IWpzOmxvZ35+XCJ+fiFoZWxsb35+XCJ+fiEvanM6bG9nfn5cbiAgICAgICAgICAgIH5+IS9qczppZn5+XG4gICAgICAgICAgICB+fiEvanM6Zn5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcbiAgICAgICAgICAgIHByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLiBFbW1ldCBhYmJyZXZpYXRpb25zIHdpbGwgYmUgXG4gICAgICAgICAgICB1c2VkIGF1dG9tYXRpY2FsbHkgaWYgeW91IGFyZSBpbiBhIEhUTUwgb3IgQ1NTIGZpbGUuXG4gICAgICAgICAgICB+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXG4gICAgICAgICAgICB+fiFlbW1ldCB1bD5saX5+XG4gICAgICAgICAgICB+fiFlbW1ldCBtMiBjc3N+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb21tYW5kcyBhcmUgc3RvcmVkIGluIG5hbWVzcGFjZXMuIFRoZSBzYW1lIGNvbW1hbmQgY2FuIGhhdmUgXG4gICAgICAgICAgICBkaWZmZXJlbnQgcmVzdWx0cyBkZXBlbmRpbmcgb24gdGhlIG5hbWVzcGFjZS5cbiAgICAgICAgICAgIH5+IWpzOmVhY2h+flxuICAgICAgICAgICAgfn4hcGhwOm91dGVyOmVhY2h+flxuICAgICAgICAgICAgfn4hcGhwOmlubmVyOmVhY2h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBTb21lIG9mIHRoZSBuYW1lc3BhY2VzIGFyZSBhY3RpdmUgZGVwZW5kaW5nIG9uIHRoZSBjb250ZXh0LiBUaGVcbiAgICAgICAgICAgIGZvbGxvd2luZyBjb21tYW5kcyBhcmUgdGhlIHNhbWUgYW5kIHdpbGwgZGlzcGxheSB0aGUgY3VycmVudGx5XG4gICAgICAgICAgICBhY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxuICAgICAgICAgICAgY29yZSBuYW1lc3BhY2UgaXMgYWN0aXZlLlxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlfn5cbiAgICAgICAgICAgIH5+IWNvcmU6bmFtZXNwYWNlfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgWW91IGNhbiBtYWtlIGEgbmFtZXNwYWNlIGFjdGl2ZSB3aXRoIHRoZSBmb2xsb3dpbmcgY29tbWFuZC5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZSBwaHB+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDaGVjayB0aGUgbmFtZXNwYWNlcyBhZ2FpblxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgSW4gYWRkaXRpb24gdG8gZGV0ZWN0aW5nIHRoZSBkb2N1bWVudCB0eXBlLCBDb2Rld2F2ZSBjYW4gZGV0ZWN0IHRoZVxuICAgICAgICAgICAgY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcbiAgICAgICAgICAgIHdpbGwgYWRkIHRoZSBQSFAgdGFncyB3aGVuIHlvdSBuZWVkIHRoZW0uXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdkZW1vJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpnZXRfc3RhcnRlZCdcbiAgICAgICAgfVxuICAgICAgICAnZWRpdGluZyc6e1xuICAgICAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgICAgICdpbnRybyc6e1xuICAgICAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgICAgIENvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXG4gICAgICAgICAgICAgICAgcHV0IHlvdXIgY29udGVudCBpbnNpZGUgXCJzb3VyY2VcIiB0aGUgZG8gXCJzYXZlXCIuIFRyeSBhZGRpbmcgYW55IFxuICAgICAgICAgICAgICAgIHRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXG4gICAgICAgICAgICAgICAgfn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIElmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XG4gICAgICAgICAgICAgICAgZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxuICAgICAgICAgICAgICAgIHdoZW5ldmVyIHlvdSB3YW50LlxuICAgICAgICAgICAgICAgIH5+IW15X25ld19jb21tYW5kfn5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn5oZWxwOmVkaXRpbmc6aW50cm9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBBbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcImJveFwiLiBcbiAgICAgICAgICAgIFRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXG4gICAgICAgICAgICBUaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXG4gICAgICAgICAgICBcImNsb3NlXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxuICAgICAgICAgICAgY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5LlxuICAgICAgICAgICAgfn4hYm94fn5cbiAgICAgICAgICAgIFRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgV2hlbiB5b3UgY3JlYXRlIGEgY29tbWFuZCwgeW91IG1heSB3YW50IHRvIHNwZWNpZnkgd2hlcmUgdGhlIGN1cnNvciBcbiAgICAgICAgICAgIHdpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcInxcIiBcbiAgICAgICAgICAgIChWZXJ0aWNhbCBiYXIpLiBVc2UgMiBvZiB0aGVtIGlmIHlvdSB3YW50IHRvIHByaW50IHRoZSBhY3R1YWwgXG4gICAgICAgICAgICBjaGFyYWN0ZXIuXG4gICAgICAgICAgICB+fiFib3h+flxuICAgICAgICAgICAgb25lIDogfCBcbiAgICAgICAgICAgIHR3byA6IHx8XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgWW91IGNhbiBhbHNvIHVzZSB0aGUgXCJlc2NhcGVfcGlwZXNcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxuICAgICAgICAgICAgdmVydGljYWwgYmFycyB0aGF0IGFyZSBiZXR3ZWVuIGl0cyBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3NcbiAgICAgICAgICAgIH5+IWVzY2FwZV9waXBlc35+XG4gICAgICAgICAgICB8XG4gICAgICAgICAgICB+fiEvZXNjYXBlX3BpcGVzfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cbiAgICAgICAgICAgIElmIHlvdSB3YW50IHRvIHByaW50IGEgY29tbWFuZCB3aXRob3V0IGhhdmluZyBpdCBleHBhbmQgd2hlbiBcbiAgICAgICAgICAgIHRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXCIhXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxuICAgICAgICAgICAgfn4hIWhlbGxvfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXG4gICAgICAgICAgICB0aGUgXCJjb250ZW50XCIgY29tbWFuZC4gXCJjb250ZW50XCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XG4gICAgICAgICAgICB0aGF0IGlzIGJldHdlZW4gdGhlIHRhZ3MuIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBob3cgaXQgY2FuIGJlIHVzZWQuXG4gICAgICAgICAgICB+fiFlZGl0IHBocDppbm5lcjppZn5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdlZGl0Jzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDplZGl0aW5nJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICAnbm9fZXhlY3V0ZSc6e1xuICAgICAgJ3Jlc3VsdCcgOiBub19leGVjdXRlXG4gICAgfSxcbiAgICAnZXNjYXBlX3BpcGVzJzp7XG4gICAgICAncmVzdWx0JyA6IHF1b3RlX2NhcnJldCxcbiAgICAgICdjaGVja0NhcnJldCcgOiBmYWxzZVxuICAgIH0sXG4gICAgJ3F1b3RlX2NhcnJldCc6e1xuICAgICAgJ2FsaWFzT2YnOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgfVxuICAgICdleGVjX3BhcmVudCc6e1xuICAgICAgJ2V4ZWN1dGUnIDogZXhlY19wYXJlbnRcbiAgICB9LFxuICAgICdjb250ZW50Jzp7XG4gICAgICAncmVzdWx0JyA6IGdldENvbnRlbnRcbiAgICB9LFxuICAgICdib3gnOntcbiAgICAgICdjbHMnIDogQm94Q21kXG4gICAgfSxcbiAgICAnY2xvc2UnOntcbiAgICAgICdjbHMnIDogQ2xvc2VDbWRcbiAgICB9LFxuICAgICdwYXJhbSc6e1xuICAgICAgJ3Jlc3VsdCcgOiBnZXRQYXJhbVxuICAgIH0sXG4gICAgJ2VkaXQnOntcbiAgICAgICdjbWRzJyA6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICdzYXZlJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAnY2xzJyA6IEVkaXRDbWRcbiAgICB9LFxuICAgICdyZW5hbWUnOntcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ25vdF9hcHBsaWNhYmxlJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBZb3UgY2FuIG9ubHkgcmVuYW1lIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIixcbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgICAncmVzdWx0JyA6IHJlbmFtZUNvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgIH0sXG4gICAgJ3JlbW92ZSc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2FwcGxpY2FibGUnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIFlvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiLFxuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogcmVtb3ZlQ29tbWFuZCxcbiAgICAgICdwYXJzZScgOiB0cnVlXG4gICAgfSxcbiAgICAnYWxpYXMnOntcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgICAncmVzdWx0JyA6IGFsaWFzQ29tbWFuZCxcbiAgICAgICdwYXJzZScgOiB0cnVlXG4gICAgfSxcbiAgICAnbmFtZXNwYWNlJzp7XG4gICAgICAnY2xzJyA6IE5hbWVTcGFjZUNtZFxuICAgIH0sXG4gICAgJ25zcGMnOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOm5hbWVzcGFjZSdcbiAgICB9LFxuICAgICdlbW1ldCc6e1xuICAgICAgJ2NscycgOiBFbW1ldENtZFxuICAgIH0sXG4gICAgXG4gIH0pXG4gIFxubm9fZXhlY3V0ZSA9IChpbnN0YW5jZSkgLT5cbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIrU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzKSArICcpJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikpXG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsJyQxJylcbiAgXG5xdW90ZV9jYXJyZXQgPSAoaW5zdGFuY2UpIC0+XG4gIHJldHVybiBpbnN0YW5jZS5jb250ZW50LnJlcGxhY2UoL1xcfC9nLCAnfHwnKVxuZXhlY19wYXJlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGlmIGluc3RhbmNlLnBhcmVudD9cbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpXG4gICAgaW5zdGFuY2UucmVwbGFjZVN0YXJ0ID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VTdGFydFxuICAgIGluc3RhbmNlLnJlcGxhY2VFbmQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZUVuZFxuICAgIHJldHVybiByZXNcbmdldENvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSxmYWxzZSlcbiAgcHJlZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgc3VmZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgaWYgaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZT9cbiAgICByZXR1cm4gcHJlZml4ICsgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuY29udGVudCBvciAnJykgKyBzdWZmaXhcbiAgaWYgYWZmaXhlc19lbXB0eVxuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXhcbnJlbmFtZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG4gICAgc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgLnRoZW4gKHNhdmVkQ21kcyk9PlxuICAgIG9yaWduaW5hbE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZnJvbSddKVxuICAgIG5ld05hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwndG8nXSlcbiAgICBpZiBvcmlnbmluYWxOYW1lPyBhbmQgbmV3TmFtZT9cbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0Q21kKG9yaWduaW5hbE5hbWUpXG4gICAgICBpZiBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0/IGFuZCBjbWQ/XG4gICAgICAgIHVubGVzcyBuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAgICAgbmV3TmFtZSA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG9yaWduaW5hbE5hbWUsJycpICsgbmV3TmFtZVxuICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsY21kRGF0YSlcbiAgICAgICAgY21kLnVucmVnaXN0ZXIoKVxuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhXG4gICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgICAudGhlbiA9PlxuICAgICAgICAgIHJldHVybiBcIlwiXG4gICAgICBlbHNlIGlmIGNtZD8gXG4gICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiXG4gICAgICBlbHNlIFxuICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbnJlbW92ZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgICBpZiBuYW1lP1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG4gICAgICAgIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpXG4gICAgICAudGhlbiAoc2F2ZWRDbWRzKT0+XG4gICAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0Q21kKG5hbWUpXG4gICAgICAgIGlmIHNhdmVkQ21kc1tuYW1lXT8gYW5kIGNtZD9cbiAgICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW25hbWVdXG4gICAgICAgICAgY21kLnVucmVnaXN0ZXIoKVxuICAgICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV1cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICAgICAgICBzdG9yYWdlLnNhdmUoJ2NtZHMnLHNhdmVkQ21kcylcbiAgICAgICAgICAudGhlbiA9PlxuICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgZWxzZSBpZiBjbWQ/IFxuICAgICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiXG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5hbGlhc0NvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCdhbGlhcyddKVxuICBpZiBuYW1lPyBhbmQgYWxpYXM/XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQobmFtZSlcbiAgICBpZiBjbWQ/XG4gICAgICBjbWQgPSBjbWQuZ2V0QWxpYXNlZCgpIG9yIGNtZFxuICAgICAgIyB1bmxlc3MgYWxpYXMuaW5kZXhPZignOicpID4gLTFcbiAgICAgICAgIyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChhbGlhcywgeyBhbGlhc09mOiBjbWQuZnVsbE5hbWUgfSlcbiAgICAgIHJldHVybiBcIlwiXG4gICAgZWxzZSBcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIlxuICAgICAgXG5nZXRQYXJhbSA9IChpbnN0YW5jZSkgLT5cbiAgaWYgaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZT9cbiAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5nZXRQYXJhbShpbnN0YW5jZS5wYXJhbXMsaW5zdGFuY2UuZ2V0UGFyYW0oWydkZWYnLCdkZWZhdWx0J10pKVxuICBcbmNsYXNzIEJveENtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGluc3RhbmNlLmNvbnRleHQpXG4gICAgQGNtZCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ2NtZCddKVxuICAgIGlmIEBjbWQ/XG4gICAgICBAaGVscGVyLm9wZW5UZXh0ICA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgQGNtZCArIEBpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzXG4gICAgICBAaGVscGVyLmNsb3NlVGV4dCA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgQGluc3RhbmNlLmNvZGV3YXZlLmNsb3NlQ2hhciArIEBjbWQuc3BsaXQoXCIgXCIpWzBdICsgQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICBAaGVscGVyLmRlY28gPSBAaW5zdGFuY2UuY29kZXdhdmUuZGVjb1xuICAgIEBoZWxwZXIucGFkID0gMlxuICAgIEBoZWxwZXIucHJlZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gICAgQGhlbHBlci5zdWZmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgICBcbiAgaGVpZ2h0OiAtPlxuICAgIGlmIEBib3VuZHMoKT9cbiAgICAgIGhlaWdodCA9IEBib3VuZHMoKS5oZWlnaHRcbiAgICBlbHNlXG4gICAgICBoZWlnaHQgPSAzXG4gICAgICBcbiAgICBwYXJhbXMgPSBbJ2hlaWdodCddXG4gICAgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxIFxuICAgICAgcGFyYW1zLnB1c2goMSlcbiAgICBlbHNlIGlmIEBpbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMFxuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICByZXR1cm4gQGluc3RhbmNlLmdldFBhcmFtKHBhcmFtcyxoZWlnaHQpXG4gICAgICBcbiAgd2lkdGg6IC0+XG4gICAgaWYgQGJvdW5kcygpP1xuICAgICAgd2lkdGggPSBAYm91bmRzKCkud2lkdGhcbiAgICBlbHNlXG4gICAgICB3aWR0aCA9IDNcbiAgICAgIFxuICAgIHBhcmFtcyA9IFsnd2lkdGgnXVxuICAgIGlmIEBpbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSBcbiAgICAgIHBhcmFtcy5wdXNoKDApXG4gICAgcmV0dXJuIE1hdGgubWF4KEBtaW5XaWR0aCgpLCBAaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCB3aWR0aCkpXG5cbiAgXG4gIGJvdW5kczogLT5cbiAgICBpZiBAaW5zdGFuY2UuY29udGVudFxuICAgICAgdW5sZXNzIEBfYm91bmRzP1xuICAgICAgICBAX2JvdW5kcyA9IEBoZWxwZXIudGV4dEJvdW5kcyhAaW5zdGFuY2UuY29udGVudClcbiAgICAgIHJldHVybiBAX2JvdW5kc1xuICAgICAgXG4gIHJlc3VsdDogLT5cbiAgICBAaGVscGVyLmhlaWdodCA9IEBoZWlnaHQoKVxuICAgIEBoZWxwZXIud2lkdGggPSBAd2lkdGgoKVxuICAgIHJldHVybiBAaGVscGVyLmRyYXcoQGluc3RhbmNlLmNvbnRlbnQpXG4gIG1pbldpZHRoOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICByZXR1cm4gQGNtZC5sZW5ndGhcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMFxuICBcbmNsYXNzIENsb3NlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAaGVscGVyID0gbmV3IEJveEhlbHBlcihAaW5zdGFuY2UuY29udGV4dClcbiAgZXhlY3V0ZTogLT5cbiAgICBwcmVmaXggPSBAaGVscGVyLnByZWZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCcnKVxuICAgIHN1ZmZpeCA9IEBoZWxwZXIuc3VmZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sJycpXG4gICAgYm94ID0gQGhlbHBlci5nZXRCb3hGb3JQb3MoQGluc3RhbmNlLmdldFBvcygpKVxuICAgIHJlcXVpcmVkX2FmZml4ZXMgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydyZXF1aXJlZF9hZmZpeGVzJ10sdHJ1ZSlcbiAgICBpZiAhcmVxdWlyZWRfYWZmaXhlc1xuICAgICAgQGhlbHBlci5wcmVmaXggPSBAaGVscGVyLnN1ZmZpeCA9ICcnXG4gICAgICBib3gyID0gQGhlbHBlci5nZXRCb3hGb3JQb3MoQGluc3RhbmNlLmdldFBvcygpKVxuICAgICAgaWYgYm94Mj8gYW5kICghYm94PyBvciBib3guc3RhcnQgPCBib3gyLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCBvciBib3guZW5kID4gYm94Mi5lbmQgKyBzdWZmaXgubGVuZ3RoKVxuICAgICAgICBib3ggPSBib3gyXG4gICAgaWYgYm94P1xuICAgICAgZGVwdGggPSBAaGVscGVyLmdldE5lc3RlZEx2bChAaW5zdGFuY2UuZ2V0UG9zKCkuc3RhcnQpXG4gICAgICBpZiBkZXB0aCA8IDJcbiAgICAgICAgQGluc3RhbmNlLmluQm94ID0gbnVsbFxuICAgICAgQGluc3RhbmNlLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KGJveC5zdGFydCxib3guZW5kLCcnKSlcbiAgICBlbHNlXG4gICAgICBAaW5zdGFuY2UucmVwbGFjZVdpdGgoJycpXG4gICAgICAgICAgXG5jbGFzcyBFZGl0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAY21kTmFtZSA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMCwnY21kJ10pXG4gICAgQHZlcmJhbGl6ZSA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMV0pIGluIFsndicsJ3ZlcmJhbGl6ZSddXG4gICAgaWYgQGNtZE5hbWU/XG4gICAgICBAZmluZGVyID0gQGluc3RhbmNlLmNvbnRleHQuZ2V0RmluZGVyKEBjbWROYW1lKSBcbiAgICAgIEBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2VcbiAgICAgIEBjbWQgPSBAZmluZGVyLmZpbmQoKVxuICAgIEBlZGl0YWJsZSA9IGlmIEBjbWQ/IHRoZW4gQGNtZC5pc0VkaXRhYmxlKCkgZWxzZSB0cnVlXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIHtcbiAgICAgIGFsbG93ZWROYW1lZDogWydjbWQnXVxuICAgIH1cbiAgcmVzdWx0OiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICByZXR1cm4gQHJlc3VsdFdpdGhDb250ZW50KClcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQHJlc3VsdFdpdGhvdXRDb250ZW50KClcbiAgcmVzdWx0V2l0aENvbnRlbnQ6IC0+XG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChAaW5zdGFuY2UuY29udGVudClcbiAgICAgIHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICBkYXRhID0ge31cbiAgICAgIGZvciBwIGluIEVkaXRDbWQucHJvcHNcbiAgICAgICAgcC53cml0ZUZvcihwYXJzZXIsZGF0YSlcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChAY21kTmFtZSwgZGF0YSlcbiAgICAgIHJldHVybiAnJ1xuICBwcm9wc0Rpc3BsYXk6IC0+XG4gICAgICBjbWQgPSBAY21kXG4gICAgICByZXR1cm4gRWRpdENtZC5wcm9wcy5tYXAoIChwKS0+IHAuZGlzcGxheShjbWQpICkuZmlsdGVyKCAocCktPiBwPyApLmpvaW4oXCJcXG5cIilcbiAgcmVzdWx0V2l0aG91dENvbnRlbnQ6IC0+XG4gICAgaWYgIUBjbWQgb3IgQGVkaXRhYmxlXG4gICAgICBuYW1lID0gaWYgQGNtZCB0aGVuIEBjbWQuZnVsbE5hbWUgZWxzZSBAY21kTmFtZVxuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQoXG4gICAgICAgIFwiXCJcIlxuICAgICAgICB+fmJveCBjbWQ6XCIje0BpbnN0YW5jZS5jbWQuZnVsbE5hbWV9ICN7bmFtZX1cIn5+XG4gICAgICAgICN7QHByb3BzRGlzcGxheSgpfVxuICAgICAgICB+fiFzYXZlfn4gfn4hY2xvc2V+flxuICAgICAgICB+fi9ib3h+flxuICAgICAgICBcIlwiXCIpXG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBub1xuICAgICAgcmV0dXJuIGlmIEB2ZXJiYWxpemUgdGhlbiBwYXJzZXIuZ2V0VGV4dCgpIGVsc2UgcGFyc2VyLnBhcnNlQWxsKClcbkVkaXRDbWQuc2V0Q21kcyA9IChiYXNlKSAtPlxuICBmb3IgcCBpbiBFZGl0Q21kLnByb3BzXG4gICAgcC5zZXRDbWQoYmFzZSlcbiAgcmV0dXJuIGJhc2VcbkVkaXRDbWQucHJvcHMgPSBbXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19jYXJyZXQnLCAgICAgICAgIHtvcHQ6J2NoZWNrQ2FycmV0J30pLFxuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fcGFyc2UnLCAgICAgICAgICB7b3B0OidwYXJzZSd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woICAgJ3ByZXZlbnRfcGFyc2VfYWxsJywge29wdDoncHJldmVudFBhcnNlQWxsJ30pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCggICAncmVwbGFjZV9ib3gnLCAgICAgICB7b3B0OidyZXBsYWNlQm94J30pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCAnbmFtZV90b19wYXJhbScsICAgICB7b3B0OiduYW1lVG9QYXJhbSd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZyggJ2FsaWFzX29mJywgICAgICAgICAge3ZhcjonYWxpYXNPZicsIGNhcnJldDp0cnVlfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoICdoZWxwJywgICAgICAgICAgICAgIHtmdW5jdDonaGVscCcsIHNob3dFbXB0eTp0cnVlfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoICdzb3VyY2UnLCAgICAgICAgICAgIHt2YXI6J3Jlc3VsdFN0cicsIGRhdGFOYW1lOidyZXN1bHQnLCBzaG93RW1wdHk6dHJ1ZSwgY2FycmV0OnRydWV9KSxcbl1cbmNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQG5hbWUgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzBdKVxuICByZXN1bHQ6IC0+XG4gICAgaWYgQG5hbWU/XG4gICAgICBAaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQuYWRkTmFtZVNwYWNlKEBuYW1lKVxuICAgICAgcmV0dXJuICcnXG4gICAgZWxzZVxuICAgICAgbmFtZXNwYWNlcyA9IEBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKVxuICAgICAgdHh0ID0gJ35+Ym94fn5cXG4nXG4gICAgICBmb3IgbnNwYyBpbiBuYW1lc3BhY2VzIFxuICAgICAgICBpZiBuc3BjICE9IEBpbnN0YW5jZS5jbWQuZnVsbE5hbWVcbiAgICAgICAgICB0eHQgKz0gbnNwYysnXFxuJ1xuICAgICAgdHh0ICs9ICd+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQodHh0KVxuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpXG5cblxuXG5jbGFzcyBFbW1ldENtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGFiYnIgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2FiYnInLCdhYmJyZXZpYXRpb24nXSlcbiAgICBAbGFuZyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMSwnbGFuZycsJ2xhbmd1YWdlJ10pXG4gIHJlc3VsdDogLT5cbiAgICBlbW1ldCA9IGlmIHdpbmRvdz8uZW1tZXQ/XG4gICAgICB3aW5kb3cuZW1tZXRcbiAgICBlbHNlIGlmIHdpbmRvdz8uc2VsZj8uZW1tZXQ/XG4gICAgICB3aW5kb3cuc2VsZi5lbW1ldFxuICAgIGVsc2UgaWYgd2luZG93Py5nbG9iYWw/LmVtbWV0P1xuICAgICAgd2luZG93Lmdsb2JhbC5lbW1ldFxuICAgIGVsc2UgaWYgcmVxdWlyZT8gXG4gICAgICB0cnkgXG4gICAgICAgIHJlcXVpcmUoJ2VtbWV0JylcbiAgICAgIGNhdGNoIGV4XG4gICAgICAgIEBpbnN0YW5jZS5jb2Rld2F2ZS5sb2dnZXIubG9nKCdFbW1ldCBpcyBub3QgYXZhaWxhYmxlLCBpdCBtYXkgbmVlZCB0byBiZSBpbnN0YWxsZWQgbWFudWFsbHknKVxuICAgICAgICBudWxsXG4gICAgaWYgZW1tZXQ/XG4gICAgICAjIGVtbWV0LnJlcXVpcmUoJy4vcGFyc2VyL2FiYnJldmlhdGlvbicpLmV4cGFuZCgndWw+bGknLCB7cGFzdGVkQ29udGVudDonbG9yZW0nfSlcbiAgICAgIHJlcyA9IGVtbWV0LmV4cGFuZEFiYnJldmlhdGlvbihAYWJiciwgQGxhbmcpXG4gICAgICByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpXG5cblxuXG4iLCJ2YXIgQm94Q21kLCBDbG9zZUNtZCwgRWRpdENtZCwgRW1tZXRDbWQsIE5hbWVTcGFjZUNtZCwgYWxpYXNDb21tYW5kLCBleGVjX3BhcmVudCwgZ2V0Q29udGVudCwgZ2V0UGFyYW0sIG5vX2V4ZWN1dGUsIHF1b3RlX2NhcnJldCwgcmVtb3ZlQ29tbWFuZCwgcmVuYW1lQ29tbWFuZDtcblxuaW1wb3J0IHtcbiAgQ29tbWFuZCxcbiAgQmFzZUNvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIExhbmdEZXRlY3RvclxufSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmltcG9ydCB7XG4gIEJveEhlbHBlclxufSBmcm9tICcuLi9Cb3hIZWxwZXInO1xuXG5pbXBvcnQge1xuICBFZGl0Q21kUHJvcFxufSBmcm9tICcuLi9FZGl0Q21kUHJvcCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IHZhciBDb3JlQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgQ29yZUNvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgY29yZTtcbiAgICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NvcmUnKSk7XG4gICAgY29yZS5hZGREZXRlY3RvcihuZXcgTGFuZ0RldGVjdG9yKCkpO1xuICAgIHJldHVybiBjb3JlLmFkZENtZHMoe1xuICAgICAgJ2hlbHAnOiB7XG4gICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+cXVvdGVfY2FycmV0fn5cXG4gIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXFxuIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xcbi8gL19fLyBfIFxcXFwvIF9gIC8gLV9cXFxcIFxcXFwvXFxcXC8gLyBfYCBcXFxcIFYgLyAtXy9cXG5cXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XFxuVGhlIHRleHQgZWRpdG9yIGhlbHBlclxcbn5+L3F1b3RlX2NhcnJldH5+XFxuXFxuV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcXG55b3VyIHRleHQgZWRpdG9yLiBUaGVzZSBjb21tYW5kcyBtdXN0IGJlIHBsYWNlZCBiZXR3ZWVuIHR3byBcXG5wYWlycyBvZiBcXFwiflxcXCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiLCB3aXRoIHlvdXIgY3Vyc29yIGluc2lkZSB0aGUgY29tbWFuZFxcbkV4OiB+fiFoZWxsb35+XFxuXFxuWW91IGRvbnQgbmVlZCB0byBhY3R1YWxseSB0eXBlIGFueSBcXFwiflxcXCIgKHRpbGRlKS4gXFxuUHJlc3NpbmcgXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpbGwgYWRkIHRoZW0gaWYgeW91IGFyZSBub3QgYWxyZWFkeVxcbndpdGhpbiBhIGNvbW1hbmQuXFxuXFxuQ29kZXdhdmUgZG9lcyBub3QgdXNlIFVJIHRvIGRpc3BsYXkgYW55IGluZm9ybWF0aW9uLiBcXG5JbnN0ZWFkLCBpdCB1c2VzIHRleHQgd2l0aGluIGNvZGUgY29tbWVudHMgdG8gbWltaWMgVUlzLiBcXG5UaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcXG5pbiB0aGUgaGVscCBzZWN0aW9ucy5cXG5cXG5UbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpdGggeW91ciBjdXJzb3Igb24gdGhlIGxpbmUgYmVsbG93Llxcbn5+IWNsb3NlfH5+XFxuXFxuVXNlIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBmb3IgYSB3YWxrdGhyb3VnaCBvZiBzb21lIG9mIHRoZSBtYW55XFxuZmVhdHVyZXMgb2YgQ29kZXdhdmVcXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cXG5cXG5MaXN0IG9mIGFsbCBoZWxwIHN1YmplY3RzIFxcbn5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxcblxcbn5+IWNsb3Nlfn5cXG5+fi9ib3h+flwiLFxuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnc3ViamVjdHMnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn4haGVscH5+XFxufn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcXG5+fiFoZWxwOnN1YmplY3Rzfn4gKH5+IWhlbHA6c3Vifn4pXFxufn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6c3ViamVjdHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZ2V0X3N0YXJ0ZWQnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxuVGhlIGNsYXNzaWMgSGVsbG8gV29ybGQuXFxufn4haGVsbG98fn5cXG5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxufn5xdW90ZV9jYXJyZXR+flxcblxcbkZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGNyZWF0aW5nIHlvdXIgb3duIGNvbW1hbmRzLCBzZWU6XFxufn4haGVscDplZGl0aW5nfn5cXG5cXG5Db2Rld2F2ZSBjb21lcyB3aXRoIG1hbnkgcHJlLWV4aXN0aW5nIGNvbW1hbmRzLiBIZXJlIGlzIGFuIGV4YW1wbGVcXG5vZiBKYXZhU2NyaXB0IGFiYnJldmlhdGlvbnNcXG5+fiFqczpmfn5cXG5+fiFqczppZn5+XFxuICB+fiFqczpsb2d+flxcXCJ+fiFoZWxsb35+XFxcIn5+IS9qczpsb2d+flxcbn5+IS9qczppZn5+XFxufn4hL2pzOmZ+flxcblxcbkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxcbnVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cXG5+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXFxufn4hZW1tZXQgdWw+bGl+flxcbn5+IWVtbWV0IG0yIGNzc35+XFxuXFxuQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxcbmRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxcbn5+IWpzOmVhY2h+flxcbn5+IXBocDpvdXRlcjplYWNofn5cXG5+fiFwaHA6aW5uZXI6ZWFjaH5+XFxuXFxuU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXFxuZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcXG5hY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxcbmNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cXG5+fiFuYW1lc3BhY2V+flxcbn5+IWNvcmU6bmFtZXNwYWNlfn5cXG5cXG5Zb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxcbn5+IW5hbWVzcGFjZSBwaHB+flxcblxcbkNoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXFxufn4hbmFtZXNwYWNlfn5cXG5cXG5JbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXFxuY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcXG53aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxcblxcbn5+L3F1b3RlX2NhcnJldH5+XFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZGVtbyc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6Z2V0X3N0YXJ0ZWQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZWRpdGluZyc6IHtcbiAgICAgICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICAgICAnaW50cm8nOiB7XG4gICAgICAgICAgICAgICAgJ3Jlc3VsdCc6IFwiQ29kZXdhdmUgYWxsb3dzIHlvdSB0byBtYWtlIHlvdXIgb3duIGNvbW1hbmRzIChvciBhYmJyZXZpYXRpb25zKSBcXG5wdXQgeW91ciBjb250ZW50IGluc2lkZSBcXFwic291cmNlXFxcIiB0aGUgZG8gXFxcInNhdmVcXFwiLiBUcnkgYWRkaW5nIGFueSBcXG50ZXh0IHRoYXQgaXMgb24geW91ciBtaW5kLlxcbn5+IWVkaXQgbXlfbmV3X2NvbW1hbmR8fn5cXG5cXG5JZiB5b3UgZGlkIHRoZSBsYXN0IHN0ZXAgcmlnaHQsIHlvdSBzaG91bGQgc2VlIHlvdXIgdGV4dCB3aGVuIHlvdVxcbmRvIHRoZSBmb2xsb3dpbmcgY29tbWFuZC4gSXQgaXMgbm93IHNhdmVkIGFuZCB5b3UgY2FuIHVzZSBpdCBcXG53aGVuZXZlciB5b3Ugd2FudC5cXG5+fiFteV9uZXdfY29tbWFuZH5+XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxuXFxuQWxsIHRoZSB3aW5kb3dzIG9mIENvZGV3YXZlIGFyZSBtYWRlIHdpdGggdGhlIGNvbW1hbmQgXFxcImJveFxcXCIuIFxcblRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXFxuVGhleSBhcmUgdmFsaWQgY29tbWVudHMgc28gdGhleSB3b24ndCBicmVhayB5b3VyIGNvZGUgYW5kIHRoZSBjb21tYW5kIFxcblxcXCJjbG9zZVxcXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxcbmNvbW1hbmRzIHdpdGggdGhlbSBpZiB5b3UgbmVlZCB0byBkaXNwbGF5IHNvbWUgdGV4dCB0ZW1wb3JhcmlseS5cXG5+fiFib3h+flxcblRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcXG5+fiFjbG9zZXx+flxcbn5+IS9ib3h+flxcblxcbn5+cXVvdGVfY2FycmV0fn5cXG5XaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxcbndpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcXFwifFxcXCIgXFxuKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcXG5jaGFyYWN0ZXIuXFxufn4hYm94fn5cXG5vbmUgOiB8IFxcbnR3byA6IHx8XFxufn4hL2JveH5+XFxuXFxuWW91IGNhbiBhbHNvIHVzZSB0aGUgXFxcImVzY2FwZV9waXBlc1xcXCIgY29tbWFuZCB0aGF0IHdpbGwgZXNjYXBlIGFueSBcXG52ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xcbn5+IWVzY2FwZV9waXBlc35+XFxufFxcbn5+IS9lc2NhcGVfcGlwZXN+flxcblxcbkNvbW1hbmRzIGluc2lkZSBvdGhlciBjb21tYW5kcyB3aWxsIGJlIGV4cGFuZGVkIGF1dG9tYXRpY2FsbHkuXFxuSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxcbnRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXFxcIiFcXFwiIChleGNsYW1hdGlvbiBtYXJrKS5cXG5+fiEhaGVsbG9+flxcblxcbkZvciBjb21tYW5kcyB0aGF0IGhhdmUgYm90aCBhbiBvcGVuaW5nIGFuZCBhIGNsb3NpbmcgdGFnLCB5b3UgY2FuIHVzZVxcbnRoZSBcXFwiY29udGVudFxcXCIgY29tbWFuZC4gXFxcImNvbnRlbnRcXFwiIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGV4dFxcbnRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cXG5+fiFlZGl0IHBocDppbm5lcjppZn5+XFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdlZGl0Jzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDplZGl0aW5nJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdub19leGVjdXRlJzoge1xuICAgICAgICAncmVzdWx0Jzogbm9fZXhlY3V0ZVxuICAgICAgfSxcbiAgICAgICdlc2NhcGVfcGlwZXMnOiB7XG4gICAgICAgICdyZXN1bHQnOiBxdW90ZV9jYXJyZXQsXG4gICAgICAgICdjaGVja0NhcnJldCc6IGZhbHNlXG4gICAgICB9LFxuICAgICAgJ3F1b3RlX2NhcnJldCc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgICB9LFxuICAgICAgJ2V4ZWNfcGFyZW50Jzoge1xuICAgICAgICAnZXhlY3V0ZSc6IGV4ZWNfcGFyZW50XG4gICAgICB9LFxuICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRDb250ZW50XG4gICAgICB9LFxuICAgICAgJ2JveCc6IHtcbiAgICAgICAgJ2Nscyc6IEJveENtZFxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgJ2Nscyc6IENsb3NlQ21kXG4gICAgICB9LFxuICAgICAgJ3BhcmFtJzoge1xuICAgICAgICAncmVzdWx0JzogZ2V0UGFyYW1cbiAgICAgIH0sXG4gICAgICAnZWRpdCc6IHtcbiAgICAgICAgJ2NtZHMnOiBFZGl0Q21kLnNldENtZHMoe1xuICAgICAgICAgICdzYXZlJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICAnY2xzJzogRWRpdENtZFxuICAgICAgfSxcbiAgICAgICdyZW5hbWUnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfYXBwbGljYWJsZSc6IFwifn5ib3h+flxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCIsXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiByZW5hbWVDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ3JlbW92ZSc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9hcHBsaWNhYmxlJzogXCJ+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIixcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IHJlbW92ZUNvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWVcbiAgICAgIH0sXG4gICAgICAnYWxpYXMnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogYWxpYXNDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ25hbWVzcGFjZSc6IHtcbiAgICAgICAgJ2Nscyc6IE5hbWVTcGFjZUNtZFxuICAgICAgfSxcbiAgICAgICduc3BjJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOm5hbWVzcGFjZSdcbiAgICAgIH0sXG4gICAgICAnZW1tZXQnOiB7XG4gICAgICAgICdjbHMnOiBFbW1ldENtZFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbm5vX2V4ZWN1dGUgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgcmVnO1xuICByZWcgPSBuZXcgUmVnRXhwKFwiXihcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cykgKyAnKScgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpKTtcbiAgcmV0dXJuIGluc3RhbmNlLnN0ci5yZXBsYWNlKHJlZywgJyQxJyk7XG59O1xuXG5xdW90ZV9jYXJyZXQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gaW5zdGFuY2UuY29udGVudC5yZXBsYWNlKC9cXHwvZywgJ3x8Jyk7XG59O1xuXG5leGVjX3BhcmVudCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciByZXM7XG4gIGlmIChpbnN0YW5jZS5wYXJlbnQgIT0gbnVsbCkge1xuICAgIHJlcyA9IGluc3RhbmNlLnBhcmVudC5leGVjdXRlKCk7XG4gICAgaW5zdGFuY2UucmVwbGFjZVN0YXJ0ID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VTdGFydDtcbiAgICBpbnN0YW5jZS5yZXBsYWNlRW5kID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VFbmQ7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufTtcblxuZ2V0Q29udGVudCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBhZmZpeGVzX2VtcHR5LCBwcmVmaXgsIHN1ZmZpeDtcbiAgYWZmaXhlc19lbXB0eSA9IGluc3RhbmNlLmdldFBhcmFtKFsnYWZmaXhlc19lbXB0eSddLCBmYWxzZSk7XG4gIHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgc3VmZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpO1xuICBpZiAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHByZWZpeCArIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmNvbnRlbnQgfHwgJycpICsgc3VmZml4O1xuICB9XG4gIGlmIChhZmZpeGVzX2VtcHR5KSB7XG4gICAgcmV0dXJuIHByZWZpeCArIHN1ZmZpeDtcbiAgfVxufTtcblxucmVuYW1lQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICB2YXIgc3RvcmFnZTtcbiAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlO1xuICAgIHJldHVybiBzdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgfSkudGhlbigoc2F2ZWRDbWRzKSA9PiB7XG4gICAgdmFyIGNtZCwgY21kRGF0YSwgbmV3TmFtZSwgb3JpZ25pbmFsTmFtZTtcbiAgICBvcmlnbmluYWxOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmcm9tJ10pO1xuICAgIG5ld05hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ3RvJ10pO1xuICAgIGlmICgob3JpZ25pbmFsTmFtZSAhPSBudWxsKSAmJiAobmV3TmFtZSAhPSBudWxsKSkge1xuICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQob3JpZ25pbmFsTmFtZSk7XG4gICAgICBpZiAoKHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXSAhPSBudWxsKSAmJiAoY21kICE9IG51bGwpKSB7XG4gICAgICAgIGlmICghKG5ld05hbWUuaW5kZXhPZignOicpID4gLTEpKSB7XG4gICAgICAgICAgbmV3TmFtZSA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG9yaWduaW5hbE5hbWUsICcnKSArIG5ld05hbWU7XG4gICAgICAgIH1cbiAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXTtcbiAgICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEobmV3TmFtZSwgY21kRGF0YSk7XG4gICAgICAgIGNtZC51bnJlZ2lzdGVyKCk7XG4gICAgICAgIHNhdmVkQ21kc1tuZXdOYW1lXSA9IGNtZERhdGE7XG4gICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV07XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gc3RvcmFnZS5zYXZlKCdjbWRzJywgc2F2ZWRDbWRzKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxucmVtb3ZlQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICB2YXIgbmFtZTtcbiAgICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcywgc3RvcmFnZTtcbiAgICAgICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbigoc2F2ZWRDbWRzKSA9PiB7XG4gICAgICAgIHZhciBjbWQsIGNtZERhdGE7XG4gICAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0Q21kKG5hbWUpO1xuICAgICAgICBpZiAoKHNhdmVkQ21kc1tuYW1lXSAhPSBudWxsKSAmJiAoY21kICE9IG51bGwpKSB7XG4gICAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tuYW1lXTtcbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV07XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFsaWFzQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnYWxpYXMnXSk7XG4gIGlmICgobmFtZSAhPSBudWxsKSAmJiAoYWxpYXMgIT0gbnVsbCkpIHtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgfHwgY21kO1xuICAgICAgLy8gdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAvLyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChhbGlhcywge1xuICAgICAgICBhbGlhc09mOiBjbWQuZnVsbE5hbWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH1cbn07XG5cbmdldFBhcmFtID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcywgaW5zdGFuY2UuZ2V0UGFyYW0oWydkZWYnLCAnZGVmYXVsdCddKSk7XG4gIH1cbn07XG5cbkJveENtZCA9IGNsYXNzIEJveENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KTtcbiAgICB0aGlzLmNtZCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydjbWQnXSk7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaGVscGVyLm9wZW5UZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWQgKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICB0aGlzLmhlbHBlci5jbG9zZVRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY21kLnNwbGl0KFwiIFwiKVswXSArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cztcbiAgICB9XG4gICAgdGhpcy5oZWxwZXIuZGVjbyA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZGVjbztcbiAgICB0aGlzLmhlbHBlci5wYWQgPSAyO1xuICAgIHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICAgIHJldHVybiB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgfVxuXG4gIGhlaWdodCgpIHtcbiAgICB2YXIgaGVpZ2h0LCBwYXJhbXM7XG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5ib3VuZHMoKS5oZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IDM7XG4gICAgfVxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J107XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLnB1c2goMCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgaGVpZ2h0KTtcbiAgfVxuXG4gIHdpZHRoKCkge1xuICAgIHZhciBwYXJhbXMsIHdpZHRoO1xuICAgIGlmICh0aGlzLmJvdW5kcygpICE9IG51bGwpIHtcbiAgICAgIHdpZHRoID0gdGhpcy5ib3VuZHMoKS53aWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgd2lkdGggPSAzO1xuICAgIH1cbiAgICBwYXJhbXMgPSBbJ3dpZHRoJ107XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5taW5XaWR0aCgpLCB0aGlzLmluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgd2lkdGgpKTtcbiAgfVxuXG4gIGJvdW5kcygpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50KSB7XG4gICAgICBpZiAodGhpcy5fYm91bmRzID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fYm91bmRzID0gdGhpcy5oZWxwZXIudGV4dEJvdW5kcyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kcztcbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdGhpcy5oZWxwZXIuaGVpZ2h0ID0gdGhpcy5oZWlnaHQoKTtcbiAgICB0aGlzLmhlbHBlci53aWR0aCA9IHRoaXMud2lkdGgoKTtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuZHJhdyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICB9XG5cbiAgbWluV2lkdGgoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNtZC5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG59O1xuXG5DbG9zZUNtZCA9IGNsYXNzIENsb3NlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHJldHVybiB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGJveCwgYm94MiwgZGVwdGgsIHByZWZpeCwgcmVxdWlyZWRfYWZmaXhlcywgc3VmZml4O1xuICAgIHByZWZpeCA9IHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICAgIHN1ZmZpeCA9IHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpO1xuICAgIGJveCA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKTtcbiAgICByZXF1aXJlZF9hZmZpeGVzID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3JlcXVpcmVkX2FmZml4ZXMnXSwgdHJ1ZSk7XG4gICAgaWYgKCFyZXF1aXJlZF9hZmZpeGVzKSB7XG4gICAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSAnJztcbiAgICAgIGJveDIgPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSk7XG4gICAgICBpZiAoKGJveDIgIT0gbnVsbCkgJiYgKChib3ggPT0gbnVsbCkgfHwgYm94LnN0YXJ0IDwgYm94Mi5zdGFydCAtIHByZWZpeC5sZW5ndGggfHwgYm94LmVuZCA+IGJveDIuZW5kICsgc3VmZml4Lmxlbmd0aCkpIHtcbiAgICAgICAgYm94ID0gYm94MjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJveCAhPSBudWxsKSB7XG4gICAgICBkZXB0aCA9IHRoaXMuaGVscGVyLmdldE5lc3RlZEx2bCh0aGlzLmluc3RhbmNlLmdldFBvcygpLnN0YXJ0KTtcbiAgICAgIGlmIChkZXB0aCA8IDIpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5pbkJveCA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChib3guc3RhcnQsIGJveC5lbmQsICcnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLnJlcGxhY2VXaXRoKCcnKTtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZCA9IGNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdmFyIHJlZjtcbiAgICB0aGlzLmNtZE5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuICAgIHRoaXMudmVyYmFsaXplID0gKHJlZiA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzFdKSkgPT09ICd2JyB8fCByZWYgPT09ICd2ZXJiYWxpemUnO1xuICAgIGlmICh0aGlzLmNtZE5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmluc3RhbmNlLmNvbnRleHQuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSk7XG4gICAgICB0aGlzLmZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZTtcbiAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lZGl0YWJsZSA9IHRoaXMuY21kICE9IG51bGwgPyB0aGlzLmNtZC5pc0VkaXRhYmxlKCkgOiB0cnVlO1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWxsb3dlZE5hbWVkOiBbJ2NtZCddXG4gICAgfTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRoQ29udGVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRob3V0Q29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdFdpdGhDb250ZW50KCkge1xuICAgIHZhciBkYXRhLCBpLCBsZW4sIHAsIHBhcnNlciwgcmVmO1xuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgIHBhcnNlci5wYXJzZUFsbCgpO1xuICAgIGRhdGEgPSB7fTtcbiAgICByZWYgPSBFZGl0Q21kLnByb3BzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgcCA9IHJlZltpXTtcbiAgICAgIHAud3JpdGVGb3IocGFyc2VyLCBkYXRhKTtcbiAgICB9XG4gICAgQ29tbWFuZC5zYXZlQ21kKHRoaXMuY21kTmFtZSwgZGF0YSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcHJvcHNEaXNwbGF5KCkge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gdGhpcy5jbWQ7XG4gICAgcmV0dXJuIEVkaXRDbWQucHJvcHMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBwLmRpc3BsYXkoY21kKTtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHAgIT0gbnVsbDtcbiAgICB9KS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmVzdWx0V2l0aG91dENvbnRlbnQoKSB7XG4gICAgdmFyIG5hbWUsIHBhcnNlcjtcbiAgICBpZiAoIXRoaXMuY21kIHx8IHRoaXMuZWRpdGFibGUpIHtcbiAgICAgIG5hbWUgPSB0aGlzLmNtZCA/IHRoaXMuY21kLmZ1bGxOYW1lIDogdGhpcy5jbWROYW1lO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KGB+fmJveCBjbWQ6XCIke3RoaXMuaW5zdGFuY2UuY21kLmZ1bGxOYW1lfSAke25hbWV9XCJ+flxcbiR7dGhpcy5wcm9wc0Rpc3BsYXkoKX1cXG5+fiFzYXZlfn4gfn4hY2xvc2V+flxcbn5+L2JveH5+YCk7XG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLnZlcmJhbGl6ZSkge1xuICAgICAgICByZXR1cm4gcGFyc2VyLmdldFRleHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZC5zZXRDbWRzID0gZnVuY3Rpb24oYmFzZSkge1xuICB2YXIgaSwgbGVuLCBwLCByZWY7XG4gIHJlZiA9IEVkaXRDbWQucHJvcHM7XG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHAgPSByZWZbaV07XG4gICAgcC5zZXRDbWQoYmFzZSk7XG4gIH1cbiAgcmV0dXJuIGJhc2U7XG59O1xuXG5FZGl0Q21kLnByb3BzID0gW1xuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fY2FycmV0JyxcbiAge1xuICAgIG9wdDogJ2NoZWNrQ2FycmV0J1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJyxcbiAge1xuICAgIG9wdDogJ3BhcnNlJ1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3ByZXZlbnRfcGFyc2VfYWxsJyxcbiAge1xuICAgIG9wdDogJ3ByZXZlbnRQYXJzZUFsbCdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCdyZXBsYWNlX2JveCcsXG4gIHtcbiAgICBvcHQ6ICdyZXBsYWNlQm94J1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnbmFtZV90b19wYXJhbScsXG4gIHtcbiAgICBvcHQ6ICduYW1lVG9QYXJhbSdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoJ2FsaWFzX29mJyxcbiAge1xuICAgIHZhcjogJ2FsaWFzT2YnLFxuICAgIGNhcnJldDogdHJ1ZVxuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnaGVscCcsXG4gIHtcbiAgICBmdW5jdDogJ2hlbHAnLFxuICAgIHNob3dFbXB0eTogdHJ1ZVxuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnc291cmNlJyxcbiAge1xuICAgIHZhcjogJ3Jlc3VsdFN0cicsXG4gICAgZGF0YU5hbWU6ICdyZXN1bHQnLFxuICAgIHNob3dFbXB0eTogdHJ1ZSxcbiAgICBjYXJyZXQ6IHRydWVcbiAgfSlcbl07XG5cbk5hbWVTcGFjZUNtZCA9IGNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMF0pO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBpLCBsZW4sIG5hbWVzcGFjZXMsIG5zcGMsIHBhcnNlciwgdHh0O1xuICAgIGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5uYW1lKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZXNwYWNlcyA9IHRoaXMuaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCk7XG4gICAgICB0eHQgPSAnfn5ib3h+flxcbic7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lc3BhY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIG5zcGMgPSBuYW1lc3BhY2VzW2ldO1xuICAgICAgICBpZiAobnNwYyAhPT0gdGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWUpIHtcbiAgICAgICAgICB0eHQgKz0gbnNwYyArICdcXG4nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0eHQgKz0gJ35+IWNsb3NlfH5+XFxufn4vYm94fn4nO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dCk7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgfVxuICB9XG5cbn07XG5cbkVtbWV0Q21kID0gY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5hYmJyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2FiYnInLCAnYWJicmV2aWF0aW9uJ10pO1xuICAgIHJldHVybiB0aGlzLmxhbmcgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxLCAnbGFuZycsICdsYW5ndWFnZSddKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgZW1tZXQsIGV4LCByZXM7XG4gICAgZW1tZXQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IHdpbmRvdy5lbW1ldCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmID0gd2luZG93LnNlbGYpICE9IG51bGwgPyByZWYuZW1tZXQgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZWxmLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmMSA9IHdpbmRvdy5nbG9iYWwpICE9IG51bGwgPyByZWYxLmVtbWV0IDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2xvYmFsLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiByZXF1aXJlICE9PSBudWxsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJ2VtbWV0Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmxvZ2dlci5sb2coJ0VtbWV0IGlzIG5vdCBhdmFpbGFibGUsIGl0IG1heSBuZWVkIHRvIGJlIGluc3RhbGxlZCBtYW51YWxseScpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkuY2FsbCh0aGlzKTtcbiAgICBpZiAoZW1tZXQgIT0gbnVsbCkge1xuICAgICAgLy8gZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKHRoaXMuYWJiciwgdGhpcy5sYW5nKTtcbiAgICAgIHJldHVybiByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBIdG1sQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBodG1sID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2h0bWwnKSlcbiAgaHRtbC5hZGRDbWRzKHtcbiAgICAnZmFsbGJhY2snOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOmVtbWV0JyxcbiAgICAgICdkZWZhdWx0cycgOiB7J2xhbmcnOidodG1sJ30sXG4gICAgICAnbmFtZVRvUGFyYW0nIDogJ2FiYnInXG4gICAgfSxcbiAgfSlcbiAgXG4gIGNzcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjc3MnKSlcbiAgY3NzLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6ZW1tZXQnLFxuICAgICAgJ2RlZmF1bHRzJyA6IHsnbGFuZyc6J2Nzcyd9LFxuICAgICAgJ25hbWVUb1BhcmFtJyA6ICdhYmJyJ1xuICAgIH0sXG4gIH0pXG5cbiIsImltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgSHRtbENvbW1hbmRQcm92aWRlciA9IGNsYXNzIEh0bWxDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNzcywgaHRtbDtcbiAgICBodG1sID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2h0bWwnKSk7XG4gICAgaHRtbC5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplbW1ldCcsXG4gICAgICAgICdkZWZhdWx0cyc6IHtcbiAgICAgICAgICAnbGFuZyc6ICdodG1sJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjc3MgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY3NzJykpO1xuICAgIHJldHVybiBjc3MuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICAnZGVmYXVsdHMnOiB7XG4gICAgICAgICAgJ2xhbmcnOiAnY3NzJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBKc0NvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAganMgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnanMnKSlcbiAgY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2phdmFzY3JpcHQnLHsgYWxpYXNPZjogJ2pzJyB9KSlcbiAganMuYWRkQ21kcyh7XG4gICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICdpZic6ICAnaWYofCl7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnbG9nJzogICdpZih3aW5kb3cuY29uc29sZSl7XFxuXFx0Y29uc29sZS5sb2cofn5jb250ZW50fn58KVxcbn0nLFxuICAgICdmdW5jdGlvbic6XHQnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdmdW5jdCc6eyBhbGlhc09mOiAnanM6ZnVuY3Rpb24nIH0sXG4gICAgJ2YnOnsgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbicgfSxcbiAgICAnZm9yJzogXHRcdCdmb3IgKHZhciBpID0gMDsgaSA8IHw7IGkrKykge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2ZvcmluJzonZm9yICh2YXIgdmFsIGluIHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdlYWNoJzp7ICBhbGlhc09mOiAnanM6Zm9yaW4nIH0sXG4gICAgJ2ZvcmVhY2gnOnsgIGFsaWFzT2Y6ICdqczpmb3JpbicgfSxcbiAgICAnd2hpbGUnOiAgJ3doaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICd3aGlsZWknOiAndmFyIGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcblxcdGkrKztcXG59JyxcbiAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+Y29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAnaWZlJzp7ICAgYWxpYXNPZjogJ2pzOmlmZWxzZScgfSxcbiAgICAnc3dpdGNoJzpcdFwiXCJcIlxuICAgICAgc3dpdGNoKCB8ICkgeyBcbiAgICAgIFxcdGNhc2UgOlxuICAgICAgXFx0XFx0fn5jb250ZW50fn5cbiAgICAgIFxcdFxcdGJyZWFrO1xuICAgICAgXFx0ZGVmYXVsdCA6XG4gICAgICBcXHRcXHRcbiAgICAgIFxcdFxcdGJyZWFrO1xuICAgICAgfVxuICAgICAgXCJcIlwiLFxuICB9KVxuIiwiaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBKc0NvbW1hbmRQcm92aWRlciA9IGNsYXNzIEpzQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBqcztcbiAgICBqcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqcycpKTtcbiAgICBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnamF2YXNjcmlwdCcsIHtcbiAgICAgIGFsaWFzT2Y6ICdqcydcbiAgICB9KSk7XG4gICAgcmV0dXJuIGpzLmFkZENtZHMoe1xuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgJ2lmJzogJ2lmKHwpe1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnbG9nJzogJ2lmKHdpbmRvdy5jb25zb2xlKXtcXG5cXHRjb25zb2xlLmxvZyh+fmNvbnRlbnR+fnwpXFxufScsXG4gICAgICAnZnVuY3Rpb24nOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2YnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZm9yJzogJ2ZvciAodmFyIGkgPSAwOyBpIDwgfDsgaSsrKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdmb3Jpbic6ICdmb3IgKHZhciB2YWwgaW4gfCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgICdmb3JlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgJ3doaWxlJzogJ3doaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ3doaWxlaSc6ICd2YXIgaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxuXFx0aSsrO1xcbn0nLFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgICAnaWZlJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6aWZlbHNlJ1xuICAgICAgfSxcbiAgICAgICdzd2l0Y2gnOiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5jb250ZW50fn5cXG5cXHRcXHRicmVhaztcXG5cXHRkZWZhdWx0IDpcXG5cXHRcXHRcXG5cXHRcXHRicmVhaztcXG59XCJcbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5pbXBvcnQgeyBQYWlyRGV0ZWN0b3IgfSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCBjbGFzcyBQaHBDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIHBocCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdwaHAnKSlcbiAgcGhwLmFkZERldGVjdG9yKG5ldyBQYWlyRGV0ZWN0b3Ioe1xuICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgb3BlbmVyOiAnPD9waHAnLFxuICAgIGNsb3NlcjogJz8+JyxcbiAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICdlbHNlJzogJ3BocDpvdXRlcidcbiAgfSkpIFxuXG4gIHBocE91dGVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnb3V0ZXInKSlcbiAgcGhwT3V0ZXIuYWRkQ21kcyh7XG4gICAgJ2ZhbGxiYWNrJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdhbnlfY29udGVudCc6IHsgXG4gICAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcgXG4gICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbidcbiAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICdcbiAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBhbGlhc09mOiAncGhwOmlubmVyOiVuYW1lJScsXG4gICAgICBhbHRlclJlc3VsdDogd3JhcFdpdGhQaHBcbiAgICB9LFxuICAgICdib3gnOiB7IFxuICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyBcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHByZWZpeDogJzw/cGhwXFxuJ1xuICAgICAgICBzdWZmaXg6ICdcXG4/PidcbiAgICAgIH1cbiAgICB9LFxuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+JyxcbiAgfSlcbiAgXG4gIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSlcbiAgcGhwSW5uZXIuYWRkQ21kcyh7XG4gICAgJ2FueV9jb250ZW50JzogeyBhbGlhc09mOiAnY29yZTpjb250ZW50JyB9LFxuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAnaWYnOiAgICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnaW5mbyc6ICdwaHBpbmZvKCk7JyxcbiAgICAnZWNobyc6ICdlY2hvIHwnLFxuICAgICdlJzp7ICAgYWxpYXNPZjogJ3BocDppbm5lcjplY2hvJyB9LFxuICAgICdjbGFzcyc6e1xuICAgICAgcmVzdWx0IDogXCJcIlwiXG4gICAgICAgIGNsYXNzIH5+cGFyYW0gMCBjbGFzcyBkZWY6fH5+IHtcbiAgICAgICAgXFx0ZnVuY3Rpb24gX19jb25zdHJ1Y3QoKSB7XG4gICAgICAgIFxcdFxcdH5+Y29udGVudH5+fFxuICAgICAgICBcXHR9XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiLFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2MnOnsgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnIH0sXG4gICAgJ2Z1bmN0aW9uJzpcdHtcbiAgICAgIHJlc3VsdCA6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufSdcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdmdW5jdCc6eyBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJyB9LFxuICAgICdmJzp7ICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJyB9LFxuICAgICdhcnJheSc6ICAnJHwgPSBhcnJheSgpOycsXG4gICAgJ2EnOlx0ICAgICdhcnJheSgpJyxcbiAgICAnZm9yJzogXHRcdCdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICdmb3JlYWNoJzonZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ2VhY2gnOnsgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Zm9yZWFjaCcgfSxcbiAgICAnd2hpbGUnOiAgJ3doaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnd2hpbGVpJzoge1xuICAgICAgcmVzdWx0IDogJyRpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxuXFx0JGkrKztcXG59JyxcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAnaWZlJzp7ICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnIH0sXG4gICAgJ3N3aXRjaCc6XHR7XG4gICAgICByZXN1bHQgOiBcIlwiXCJcbiAgICAgICAgc3dpdGNoKCB8ICkgeyBcbiAgICAgICAgXFx0Y2FzZSA6XG4gICAgICAgIFxcdFxcdH5+YW55X2NvbnRlbnR+flxuICAgICAgICBcXHRcXHRicmVhaztcbiAgICAgICAgXFx0ZGVmYXVsdCA6XG4gICAgICAgIFxcdFxcdFxuICAgICAgICBcXHRcXHRicmVhaztcbiAgICAgICAgfVxuICAgICAgICBcIlwiXCIsXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgICdjbG9zZSc6IHsgXG4gICAgICBhbGlhc09mOiAnY29yZTpjbG9zZScgXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBwcmVmaXg6ICc8P3BocFxcbidcbiAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIHJlcXVpcmVkX2FmZml4ZXM6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgfSlcbiAgXG5cbndyYXBXaXRoUGhwID0gKHJlc3VsdCxpbnN0YW5jZSkgLT5cbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywnaW5saW5lJ10sdHJ1ZSlcbiAgaWYgaW5saW5lXG4gICAgcmVnT3BlbiA9IC88XFw/cGhwXFxzKFtcXFxcblxcXFxyXFxzXSspL2dcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZ1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/PidcbiAgZWxzZVxuICAgICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nXG5cbiMgY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuIyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICciLCJ2YXIgd3JhcFdpdGhQaHA7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIFBhaXJEZXRlY3RvclxufSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCB2YXIgUGhwQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBwaHAsIHBocElubmVyLCBwaHBPdXRlcjtcbiAgICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpO1xuICAgIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgICBvcGVuZXI6ICc8P3BocCcsXG4gICAgICBjbG9zZXI6ICc/PicsXG4gICAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICAgJ2Vsc2UnOiAncGhwOm91dGVyJ1xuICAgIH0pKTtcbiAgICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpO1xuICAgIHBocE91dGVyLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnYW55X2NvbnRlbnQnOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50JyxcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbicsXG4gICAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICcsXG4gICAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6JW5hbWUlJyxcbiAgICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgICB9LFxuICAgICAgJ2JveCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+J1xuICAgIH0pO1xuICAgIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSk7XG4gICAgcmV0dXJuIHBocElubmVyLmFkZENtZHMoe1xuICAgICAgJ2FueV9jb250ZW50Jzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50J1xuICAgICAgfSxcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgICdpZic6ICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdpbmZvJzogJ3BocGluZm8oKTsnLFxuICAgICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAgICdlJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmVjaG8nXG4gICAgICB9LFxuICAgICAgJ2NsYXNzJzoge1xuICAgICAgICByZXN1bHQ6IFwiY2xhc3Mgfn5wYXJhbSAwIGNsYXNzIGRlZjp8fn4ge1xcblxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xcblxcdFxcdH5+Y29udGVudH5+fFxcblxcdH1cXG59XCIsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2MnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnXG4gICAgICB9LFxuICAgICAgJ2Z1bmN0aW9uJzoge1xuICAgICAgICByZXN1bHQ6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdhcnJheSc6ICckfCA9IGFycmF5KCk7JyxcbiAgICAgICdhJzogJ2FycmF5KCknLFxuICAgICAgJ2Zvcic6ICdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2ZvcmVhY2gnOiAnZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmb3JlYWNoJ1xuICAgICAgfSxcbiAgICAgICd3aGlsZSc6ICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnd2hpbGVpJzoge1xuICAgICAgICByZXN1bHQ6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgJ2lmZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnXG4gICAgICB9LFxuICAgICAgJ3N3aXRjaCc6IHtcbiAgICAgICAgcmVzdWx0OiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5hbnlfY29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufVwiLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PicsXG4gICAgICAgICAgcmVxdWlyZWRfYWZmaXhlczogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbndyYXBXaXRoUGhwID0gZnVuY3Rpb24ocmVzdWx0LCBpbnN0YW5jZSkge1xuICB2YXIgaW5saW5lLCByZWdDbG9zZSwgcmVnT3BlbjtcbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywgJ2lubGluZSddLCB0cnVlKTtcbiAgaWYgKGlubGluZSkge1xuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nO1xuICAgIHJlZ0Nsb3NlID0gLyhbXFxuXFxyXFxzXSspXFxzXFw/Pi9nO1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/Pic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nO1xuICB9XG59O1xuXG4vLyBjbG9zZVBocEZvckNvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4vLyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICdcbiIsImltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9ib290c3RyYXAnO1xuaW1wb3J0IHsgVGV4dEFyZWFFZGl0b3IgfSBmcm9tICcuL1RleHRBcmVhRWRpdG9yJztcblxuQ29kZXdhdmUuZGV0ZWN0ID0gKHRhcmdldCkgLT5cbiAgY3cgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRBcmVhRWRpdG9yKHRhcmdldCkpXG4gIENvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KVxuICBjd1xuXG5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZVxuXG53aW5kb3cuQ29kZXdhdmUgPSBDb2Rld2F2ZVxuXG4gICIsImltcG9ydCB7XG4gIENvZGV3YXZlXG59IGZyb20gJy4vYm9vdHN0cmFwJztcblxuaW1wb3J0IHtcbiAgVGV4dEFyZWFFZGl0b3Jcbn0gZnJvbSAnLi9UZXh0QXJlYUVkaXRvcic7XG5cbkNvZGV3YXZlLmRldGVjdCA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICB2YXIgY3c7XG4gIGN3ID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvcih0YXJnZXQpKTtcbiAgQ29kZXdhdmUuaW5zdGFuY2VzLnB1c2goY3cpO1xuICByZXR1cm4gY3c7XG59O1xuXG5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZTtcblxud2luZG93LkNvZGV3YXZlID0gQ29kZXdhdmU7XG4iLCJleHBvcnQgY2xhc3MgQXJyYXlIZWxwZXJcbiAgQGlzQXJyYXk6IChhcnIpIC0+XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggYXJyICkgPT0gJ1tvYmplY3QgQXJyYXldJ1xuICBcbiAgQHVuaW9uOiAoYTEsYTIpIC0+XG4gICAgQHVuaXF1ZShhMS5jb25jYXQoYTIpKVxuICAgIFxuICBAdW5pcXVlOiAoYXJyYXkpIC0+XG4gICAgYSA9IGFycmF5LmNvbmNhdCgpXG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgYS5sZW5ndGhcbiAgICAgIGogPSBpICsgMVxuICAgICAgd2hpbGUgaiA8IGEubGVuZ3RoXG4gICAgICAgIGlmIGFbaV0gPT0gYVtqXVxuICAgICAgICAgIGEuc3BsaWNlKGotLSwgMSlcbiAgICAgICAgKytqXG4gICAgICArK2lcbiAgICBhIiwiZXhwb3J0IHZhciBBcnJheUhlbHBlciA9IGNsYXNzIEFycmF5SGVscGVyIHtcbiAgc3RhdGljIGlzQXJyYXkoYXJyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9XG5cbiAgc3RhdGljIHVuaW9uKGExLCBhMikge1xuICAgIHJldHVybiB0aGlzLnVuaXF1ZShhMS5jb25jYXQoYTIpKTtcbiAgfVxuXG4gIHN0YXRpYyB1bmlxdWUoYXJyYXkpIHtcbiAgICB2YXIgYSwgaSwgajtcbiAgICBhID0gYXJyYXkuY29uY2F0KCk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBhLmxlbmd0aCkge1xuICAgICAgaiA9IGkgKyAxO1xuICAgICAgd2hpbGUgKGogPCBhLmxlbmd0aCkge1xuICAgICAgICBpZiAoYVtpXSA9PT0gYVtqXSkge1xuICAgICAgICAgIGEuc3BsaWNlKGotLSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgKytqO1xuICAgICAgfVxuICAgICAgKytpO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIENvbW1vbkhlbHBlclxuXG4gIEBtZXJnZTogKHhzLi4uKSAtPlxuICAgIGlmIHhzPy5sZW5ndGggPiAwXG4gICAgICBAdGFwIHt9LCAobSkgLT4gbVtrXSA9IHYgZm9yIGssIHYgb2YgeCBmb3IgeCBpbiB4c1xuIFxuICBAdGFwOiAobywgZm4pIC0+IFxuICAgIGZuKG8pXG4gICAgb1xuXG4gIEBhcHBseU1peGluczogKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIC0+IFxuICAgIGJhc2VDdG9ycy5mb3JFYWNoIChiYXNlQ3RvcikgPT4gXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpLmZvckVhY2ggKG5hbWUpPT4gXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLCBuYW1lLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2VDdG9yLnByb3RvdHlwZSwgbmFtZSkpIiwiZXhwb3J0IHZhciBDb21tb25IZWxwZXIgPSBjbGFzcyBDb21tb25IZWxwZXIge1xuICBzdGF0aWMgbWVyZ2UoLi4ueHMpIHtcbiAgICBpZiAoKHhzICE9IG51bGwgPyB4cy5sZW5ndGggOiB2b2lkIDApID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFwKHt9LCBmdW5jdGlvbihtKSB7XG4gICAgICAgIHZhciBpLCBrLCBsZW4sIHJlc3VsdHMsIHYsIHg7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0geHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB4ID0geHNbaV07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzMTtcbiAgICAgICAgICAgIHJlc3VsdHMxID0gW107XG4gICAgICAgICAgICBmb3IgKGsgaW4geCkge1xuICAgICAgICAgICAgICB2ID0geFtrXTtcbiAgICAgICAgICAgICAgcmVzdWx0czEucHVzaChtW2tdID0gdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0czE7XG4gICAgICAgICAgfSkoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdGFwKG8sIGZuKSB7XG4gICAgZm4obyk7XG4gICAgcmV0dXJuIG87XG4gIH1cblxuICBzdGF0aWMgYXBwbHlNaXhpbnMoZGVyaXZlZEN0b3IsIGJhc2VDdG9ycykge1xuICAgIHJldHVybiBiYXNlQ3RvcnMuZm9yRWFjaCgoYmFzZUN0b3IpID0+IHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbn07XG4iLCJcbmV4cG9ydCBjbGFzcyBOYW1lc3BhY2VIZWxwZXJcblxuICBAc3BsaXRGaXJzdDogKGZ1bGxuYW1lLGlzU3BhY2UgPSBmYWxzZSkgLT5cbiAgICBpZiBmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PSAtMSBhbmQgIWlzU3BhY2VcbiAgICAgIHJldHVybiBbbnVsbCxmdWxsbmFtZV1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6JylcbiAgICByZXR1cm4gW3BhcnRzLnNoaWZ0KCkscGFydHMuam9pbignOicpIHx8IG51bGxdXG5cbiAgQHNwbGl0OiAoZnVsbG5hbWUpIC0+XG4gICAgaWYgZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT0gLTFcbiAgICAgIHJldHVybiBbbnVsbCxmdWxsbmFtZV1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6JylcbiAgICBuYW1lID0gcGFydHMucG9wKClcbiAgICBbcGFydHMuam9pbignOicpLG5hbWVdIiwiZXhwb3J0IHZhciBOYW1lc3BhY2VIZWxwZXIgPSBjbGFzcyBOYW1lc3BhY2VIZWxwZXIge1xuICBzdGF0aWMgc3BsaXRGaXJzdChmdWxsbmFtZSwgaXNTcGFjZSA9IGZhbHNlKSB7XG4gICAgdmFyIHBhcnRzO1xuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PT0gLTEgJiYgIWlzU3BhY2UpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdO1xuICAgIH1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6Jyk7XG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLCBwYXJ0cy5qb2luKCc6JykgfHwgbnVsbF07XG4gIH1cblxuICBzdGF0aWMgc3BsaXQoZnVsbG5hbWUpIHtcbiAgICB2YXIgbmFtZSwgcGFydHM7XG4gICAgaWYgKGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09PSAtMSkge1xuICAgICAgcmV0dXJuIFtudWxsLCBmdWxsbmFtZV07XG4gICAgfVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKTtcbiAgICBuYW1lID0gcGFydHMucG9wKCk7XG4gICAgcmV0dXJuIFtwYXJ0cy5qb2luKCc6JyksIG5hbWVdO1xuICB9XG5cbn07XG4iLCJcbmV4cG9ydCBjbGFzcyBPcHRpb25hbFByb21pc2VcbiAgICBjb25zdHJ1Y3RvcjogKEB2YWwpIC0+XG4gICAgICAgIGlmIEB2YWw/IGFuZCBAdmFsLnRoZW4/IGFuZCBAdmFsLnJlc3VsdD9cbiAgICAgICAgICAgIEB2YWwgPSBAdmFsLnJlc3VsdCgpXG4gICAgdGhlbjogKGNiKSAtPlxuICAgICAgICBpZiBAdmFsPyBhbmQgQHZhbC50aGVuP1xuICAgICAgICAgICAgbmV3IE9wdGlvbmFsUHJvbWlzZShAdmFsLnRoZW4oY2IpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXcgT3B0aW9uYWxQcm9taXNlKGNiKEB2YWwpKVxuICAgIHJlc3VsdDogLT5cbiAgICAgICAgQHZhbFxuXG5leHBvcnQgb3B0aW9uYWxQcm9taXNlID0gKHZhbCktPiBcbiAgICBuZXcgT3B0aW9uYWxQcm9taXNlKHZhbClcblxuXG4iLCJleHBvcnQgdmFyIE9wdGlvbmFsUHJvbWlzZSA9IGNsYXNzIE9wdGlvbmFsUHJvbWlzZSB7XG4gIGNvbnN0cnVjdG9yKHZhbDEpIHtcbiAgICB0aGlzLnZhbCA9IHZhbDE7XG4gICAgaWYgKCh0aGlzLnZhbCAhPSBudWxsKSAmJiAodGhpcy52YWwudGhlbiAhPSBudWxsKSAmJiAodGhpcy52YWwucmVzdWx0ICE9IG51bGwpKSB7XG4gICAgICB0aGlzLnZhbCA9IHRoaXMudmFsLnJlc3VsdCgpO1xuICAgIH1cbiAgfVxuXG4gIHRoZW4oY2IpIHtcbiAgICBpZiAoKHRoaXMudmFsICE9IG51bGwpICYmICh0aGlzLnZhbC50aGVuICE9IG51bGwpKSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh0aGlzLnZhbC50aGVuKGNiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKGNiKHRoaXMudmFsKSk7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHJldHVybiB0aGlzLnZhbDtcbiAgfVxuXG59O1xuXG5leHBvcnQgdmFyIG9wdGlvbmFsUHJvbWlzZSA9IGZ1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh2YWwpO1xufTtcbiIsImltcG9ydCB7IFNpemUgfSBmcm9tICcuLi9wb3NpdGlvbmluZy9TaXplJztcblxuZXhwb3J0IGNsYXNzIFN0cmluZ0hlbHBlclxuICBAdHJpbUVtcHR5TGluZTogKHR4dCkgLT5cbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJylcblxuICBAZXNjYXBlUmVnRXhwOiAoc3RyKSAtPlxuICAgIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIilcblxuICBAcmVwZWF0VG9MZW5ndGg6ICh0eHQsIGxlbmd0aCkgLT5cbiAgICByZXR1cm4gJycgaWYgbGVuZ3RoIDw9IDBcbiAgICBBcnJheShNYXRoLmNlaWwobGVuZ3RoL3R4dC5sZW5ndGgpKzEpLmpvaW4odHh0KS5zdWJzdHJpbmcoMCxsZW5ndGgpXG4gICAgXG4gIEByZXBlYXQ6ICh0eHQsIG5iKSAtPlxuICAgIEFycmF5KG5iKzEpLmpvaW4odHh0KVxuICAgIFxuICBAZ2V0VHh0U2l6ZTogKHR4dCkgLT5cbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywnJykuc3BsaXQoXCJcXG5cIilcbiAgICB3ID0gMFxuICAgIGZvciBsIGluIGxpbmVzXG4gICAgICB3ID0gTWF0aC5tYXgodyxsLmxlbmd0aClcbiAgICByZXR1cm4gbmV3IFNpemUodyxsaW5lcy5sZW5ndGgtMSlcblxuICBAaW5kZW50Tm90Rmlyc3Q6ICh0ZXh0LG5iPTEsc3BhY2VzPScgICcpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJlZyA9IC9cXG4vZ1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXFxuXCIgKyBAcmVwZWF0KHNwYWNlcywgbmIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgICBcbiAgQGluZGVudDogKHRleHQsbmI9MSxzcGFjZXM9JyAgJykgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmV0dXJuIHNwYWNlcyArIEBpbmRlbnROb3RGaXJzdCh0ZXh0LG5iLHNwYWNlcylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBcbiAgQHJldmVyc2VTdHI6ICh0eHQpIC0+XG4gICAgcmV0dXJuIHR4dC5zcGxpdChcIlwiKS5yZXZlcnNlKCkuam9pbihcIlwiKVxuICBcbiAgXG4gIEByZW1vdmVDYXJyZXQ6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSdcbiAgICByZUNhcnJldCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhcitjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgcmVUbXAgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAodG1wKSwgXCJnXCIpXG4gICAgdHh0LnJlcGxhY2UocmVRdW90ZWQsdG1wKS5yZXBsYWNlKHJlQ2FycmV0LCcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKVxuICAgIFxuICBAZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQ6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgcG9zID0gQGdldENhcnJldFBvcyh0eHQsY2FycmV0Q2hhcilcbiAgICBpZiBwb3M/XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAscG9zKSArIHR4dC5zdWJzdHIocG9zK2NhcnJldENoYXIubGVuZ3RoKVxuICAgICAgcmV0dXJuIFtwb3MsdHh0XVxuICAgICAgXG4gIEBnZXRDYXJyZXRQb3M6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhcitjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgdHh0ID0gdHh0LnJlcGxhY2UocmVRdW90ZWQsICcgJylcbiAgICBpZiAoaSA9IHR4dC5pbmRleE9mKGNhcnJldENoYXIpKSA+IC0xXG4gICAgICByZXR1cm4gaSIsImltcG9ydCB7XG4gIFNpemVcbn0gZnJvbSAnLi4vcG9zaXRpb25pbmcvU2l6ZSc7XG5cbmV4cG9ydCB2YXIgU3RyaW5nSGVscGVyID0gY2xhc3MgU3RyaW5nSGVscGVyIHtcbiAgc3RhdGljIHRyaW1FbXB0eUxpbmUodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKC9eXFxzKlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyP1xcblxccyokLywgJycpO1xuICB9XG5cbiAgc3RhdGljIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXRUb0xlbmd0aCh0eHQsIGxlbmd0aCkge1xuICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkoTWF0aC5jZWlsKGxlbmd0aCAvIHR4dC5sZW5ndGgpICsgMSkuam9pbih0eHQpLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuICB9XG5cbiAgc3RhdGljIHJlcGVhdCh0eHQsIG5iKSB7XG4gICAgcmV0dXJuIEFycmF5KG5iICsgMSkuam9pbih0eHQpO1xuICB9XG5cbiAgc3RhdGljIGdldFR4dFNpemUodHh0KSB7XG4gICAgdmFyIGosIGwsIGxlbiwgbGluZXMsIHc7XG4gICAgbGluZXMgPSB0eHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKTtcbiAgICB3ID0gMDtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbCA9IGxpbmVzW2pdO1xuICAgICAgdyA9IE1hdGgubWF4KHcsIGwubGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTaXplKHcsIGxpbmVzLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgc3RhdGljIGluZGVudE5vdEZpcnN0KHRleHQsIG5iID0gMSwgc3BhY2VzID0gJyAgJykge1xuICAgIHZhciByZWc7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gL1xcbi9nO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXFxuXCIgKyB0aGlzLnJlcGVhdChzcGFjZXMsIG5iKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnQodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNwYWNlcyArIHRoaXMuaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIsIHNwYWNlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZXZlcnNlU3RyKHR4dCkge1xuICAgIHJldHVybiB0eHQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIik7XG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlQ2FycmV0KHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciByZUNhcnJldCwgcmVRdW90ZWQsIHJlVG1wLCB0bXA7XG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSc7XG4gICAgcmVDYXJyZXQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHJlVG1wID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cCh0bXApLCBcImdcIik7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKHJlUXVvdGVkLCB0bXApLnJlcGxhY2UocmVDYXJyZXQsICcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcG9zO1xuICAgIHBvcyA9IHRoaXMuZ2V0Q2FycmV0UG9zKHR4dCwgY2FycmV0Q2hhcik7XG4gICAgaWYgKHBvcyAhPSBudWxsKSB7XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAsIHBvcykgKyB0eHQuc3Vic3RyKHBvcyArIGNhcnJldENoYXIubGVuZ3RoKTtcbiAgICAgIHJldHVybiBbcG9zLCB0eHRdO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXRDYXJyZXRQb3ModHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIGksIHJlUXVvdGVkO1xuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKTtcbiAgICBpZiAoKGkgPSB0eHQuaW5kZXhPZihjYXJyZXRDaGFyKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IFBhaXJNYXRjaCB9IGZyb20gJy4vUGFpck1hdGNoJztcblxuZXhwb3J0IGNsYXNzIFBhaXJcbiAgY29uc3RydWN0b3I6IChAb3BlbmVyLEBjbG9zZXIsQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IGZhbHNlXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIEBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IEBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gIG9wZW5lclJlZzogLT5cbiAgICBpZiB0eXBlb2YgQG9wZW5lciA9PSAnc3RyaW5nJyBcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQG9wZW5lcikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBvcGVuZXJcbiAgY2xvc2VyUmVnOiAtPlxuICAgIGlmIHR5cGVvZiBAY2xvc2VyID09ICdzdHJpbmcnIFxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY2xvc2VyKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQGNsb3NlclxuICBtYXRjaEFueVBhcnRzOiAtPlxuICAgIHJldHVybiB7XG4gICAgICBvcGVuZXI6IEBvcGVuZXJSZWcoKVxuICAgICAgY2xvc2VyOiBAY2xvc2VyUmVnKClcbiAgICB9XG4gIG1hdGNoQW55UGFydEtleXM6IC0+XG4gICAga2V5cyA9IFtdXG4gICAgZm9yIGtleSwgcmVnIG9mIEBtYXRjaEFueVBhcnRzKClcbiAgICAgIGtleXMucHVzaChrZXkpXG4gICAgcmV0dXJuIGtleXNcbiAgbWF0Y2hBbnlSZWc6IC0+XG4gICAgZ3JvdXBzID0gW11cbiAgICBmb3Iga2V5LCByZWcgb2YgQG1hdGNoQW55UGFydHMoKVxuICAgICAgZ3JvdXBzLnB1c2goJygnK3JlZy5zb3VyY2UrJyknKVxuICAgIHJldHVybiBuZXcgUmVnRXhwKGdyb3Vwcy5qb2luKCd8JykpXG4gIG1hdGNoQW55OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICB3aGlsZSAobWF0Y2ggPSBAX21hdGNoQW55KHRleHQsb2Zmc2V0KSk/IGFuZCAhbWF0Y2gudmFsaWQoKVxuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKClcbiAgICByZXR1cm4gbWF0Y2ggaWYgbWF0Y2g/IGFuZCBtYXRjaC52YWxpZCgpXG4gIF9tYXRjaEFueTogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgaWYgb2Zmc2V0XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KVxuICAgIG1hdGNoID0gQG1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KVxuICAgIGlmIG1hdGNoP1xuICAgICAgcmV0dXJuIG5ldyBQYWlyTWF0Y2godGhpcyxtYXRjaCxvZmZzZXQpXG4gIG1hdGNoQW55TmFtZWQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAX21hdGNoQW55R2V0TmFtZShAbWF0Y2hBbnkodGV4dCkpXG4gIG1hdGNoQW55TGFzdDogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgd2hpbGUgbWF0Y2ggPSBAbWF0Y2hBbnkodGV4dCxvZmZzZXQpXG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgICAgaWYgIXJlcyBvciByZXMuZW5kKCkgIT0gbWF0Y2guZW5kKClcbiAgICAgICAgcmVzID0gbWF0Y2hcbiAgICByZXR1cm4gcmVzXG4gIGlkZW50aWNhbDogLT5cbiAgICBAb3BlbmVyID09IEBjbG9zZXIgb3IgKFxuICAgICAgQG9wZW5lci5zb3VyY2U/IGFuZCBcbiAgICAgIEBjbG9zZXIuc291cmNlPyBhbmQgXG4gICAgICBAb3BlbmVyLnNvdXJjZSA9PSBAY2xvc2VyLnNvdXJjZVxuICAgIClcbiAgd3JhcHBlclBvczogKHBvcyx0ZXh0KSAtPlxuICAgIHN0YXJ0ID0gQG1hdGNoQW55TGFzdCh0ZXh0LnN1YnN0cigwLHBvcy5zdGFydCkpXG4gICAgaWYgc3RhcnQ/IGFuZCAoQGlkZW50aWNhbCgpIG9yIHN0YXJ0Lm5hbWUoKSA9PSAnb3BlbmVyJylcbiAgICAgIGVuZCA9IEBtYXRjaEFueSh0ZXh0LHBvcy5lbmQpXG4gICAgICBpZiBlbmQ/IGFuZCAoQGlkZW50aWNhbCgpIG9yIGVuZC5uYW1lKCkgPT0gJ2Nsb3NlcicpXG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksZW5kLmVuZCgpKVxuICAgICAgZWxzZSBpZiBAb3B0aW9ubmFsX2VuZFxuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLHRleHQubGVuZ3RoKVxuICBpc1dhcHBlck9mOiAocG9zLHRleHQpIC0+XG4gICAgcmV0dXJuIEB3cmFwcGVyUG9zKHBvcyx0ZXh0KT8iLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYWlyTWF0Y2hcbn0gZnJvbSAnLi9QYWlyTWF0Y2gnO1xuXG5leHBvcnQgdmFyIFBhaXIgPSBjbGFzcyBQYWlyIHtcbiAgY29uc3RydWN0b3Iob3BlbmVyLCBjbG9zZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgdGhpcy5vcGVuZXIgPSBvcGVuZXI7XG4gICAgdGhpcy5jbG9zZXIgPSBjbG9zZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IGZhbHNlLFxuICAgICAgdmFsaWRNYXRjaDogbnVsbFxuICAgIH07XG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICBpZiAoa2V5IGluIHRoaXMub3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSB0aGlzLm9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvcGVuZXJSZWcoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wZW5lciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5vcGVuZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMub3BlbmVyO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlclJlZygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuY2xvc2VyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNsb3NlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZXI7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BlbmVyOiB0aGlzLm9wZW5lclJlZygpLFxuICAgICAgY2xvc2VyOiB0aGlzLmNsb3NlclJlZygpXG4gICAgfTtcbiAgfVxuXG4gIG1hdGNoQW55UGFydEtleXMoKSB7XG4gICAgdmFyIGtleSwga2V5cywgcmVmLCByZWc7XG4gICAga2V5cyA9IFtdO1xuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV07XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG4gIH1cblxuICBtYXRjaEFueVJlZygpIHtcbiAgICB2YXIgZ3JvdXBzLCBrZXksIHJlZiwgcmVnO1xuICAgIGdyb3VwcyA9IFtdO1xuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV07XG4gICAgICBncm91cHMucHVzaCgnKCcgKyByZWcuc291cmNlICsgJyknKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoZ3JvdXBzLmpvaW4oJ3wnKSk7XG4gIH1cblxuICBtYXRjaEFueSh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoO1xuICAgIHdoaWxlICgoKG1hdGNoID0gdGhpcy5fbWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkgIT0gbnVsbCkgJiYgIW1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpO1xuICAgIH1cbiAgICBpZiAoKG1hdGNoICE9IG51bGwpICYmIG1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9XG4gIH1cblxuICBfbWF0Y2hBbnkodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaDtcbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KTtcbiAgICB9XG4gICAgbWF0Y2ggPSB0aGlzLm1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KTtcbiAgICBpZiAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBQYWlyTWF0Y2godGhpcywgbWF0Y2gsIG9mZnNldCk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlOYW1lZCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuX21hdGNoQW55R2V0TmFtZSh0aGlzLm1hdGNoQW55KHRleHQpKTtcbiAgfVxuXG4gIG1hdGNoQW55TGFzdCh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoLCByZXM7XG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKTtcbiAgICAgIGlmICghcmVzIHx8IHJlcy5lbmQoKSAhPT0gbWF0Y2guZW5kKCkpIHtcbiAgICAgICAgcmVzID0gbWF0Y2g7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBpZGVudGljYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVyID09PSB0aGlzLmNsb3NlciB8fCAoKHRoaXMub3BlbmVyLnNvdXJjZSAhPSBudWxsKSAmJiAodGhpcy5jbG9zZXIuc291cmNlICE9IG51bGwpICYmIHRoaXMub3BlbmVyLnNvdXJjZSA9PT0gdGhpcy5jbG9zZXIuc291cmNlKTtcbiAgfVxuXG4gIHdyYXBwZXJQb3MocG9zLCB0ZXh0KSB7XG4gICAgdmFyIGVuZCwgc3RhcnQ7XG4gICAgc3RhcnQgPSB0aGlzLm1hdGNoQW55TGFzdCh0ZXh0LnN1YnN0cigwLCBwb3Muc3RhcnQpKTtcbiAgICBpZiAoKHN0YXJ0ICE9IG51bGwpICYmICh0aGlzLmlkZW50aWNhbCgpIHx8IHN0YXJ0Lm5hbWUoKSA9PT0gJ29wZW5lcicpKSB7XG4gICAgICBlbmQgPSB0aGlzLm1hdGNoQW55KHRleHQsIHBvcy5lbmQpO1xuICAgICAgaWYgKChlbmQgIT0gbnVsbCkgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgZW5kLm5hbWUoKSA9PT0gJ2Nsb3NlcicpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIGVuZC5lbmQoKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ubmFsX2VuZCkge1xuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLCB0ZXh0Lmxlbmd0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNXYXBwZXJPZihwb3MsIHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy53cmFwcGVyUG9zKHBvcywgdGV4dCkgIT0gbnVsbDtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIFBhaXJNYXRjaFxuICBjb25zdHJ1Y3RvcjogKEBwYWlyLEBtYXRjaCxAb2Zmc2V0ID0gMCkgLT5cbiAgbmFtZTogLT5cbiAgICBpZiBAbWF0Y2hcbiAgICAgIHVubGVzcyBfbmFtZT9cbiAgICAgICAgZm9yIGdyb3VwLCBpIGluIEBtYXRjaFxuICAgICAgICAgIGlmIGkgPiAwIGFuZCBncm91cD9cbiAgICAgICAgICAgIF9uYW1lID0gQHBhaXIubWF0Y2hBbnlQYXJ0S2V5cygpW2ktMV1cbiAgICAgICAgICAgIHJldHVybiBfbmFtZVxuICAgICAgICBfbmFtZSA9IGZhbHNlXG4gICAgICByZXR1cm4gX25hbWUgfHwgbnVsbFxuICBzdGFydDogLT5cbiAgICBAbWF0Y2guaW5kZXggKyBAb2Zmc2V0XG4gIGVuZDogLT5cbiAgICBAbWF0Y2guaW5kZXggKyBAbWF0Y2hbMF0ubGVuZ3RoICsgQG9mZnNldFxuICB2YWxpZDogLT5cbiAgICByZXR1cm4gIUBwYWlyLnZhbGlkTWF0Y2ggfHwgQHBhaXIudmFsaWRNYXRjaCh0aGlzKVxuICBsZW5ndGg6IC0+XG4gICAgQG1hdGNoWzBdLmxlbmd0aCIsImV4cG9ydCB2YXIgUGFpck1hdGNoID0gY2xhc3MgUGFpck1hdGNoIHtcbiAgY29uc3RydWN0b3IocGFpciwgbWF0Y2gsIG9mZnNldCA9IDApIHtcbiAgICB0aGlzLnBhaXIgPSBwYWlyO1xuICAgIHRoaXMubWF0Y2ggPSBtYXRjaDtcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgfVxuXG4gIG5hbWUoKSB7XG4gICAgdmFyIF9uYW1lLCBncm91cCwgaSwgaiwgbGVuLCByZWY7XG4gICAgaWYgKHRoaXMubWF0Y2gpIHtcbiAgICAgIGlmICh0eXBlb2YgX25hbWUgPT09IFwidW5kZWZpbmVkXCIgfHwgX25hbWUgPT09IG51bGwpIHtcbiAgICAgICAgcmVmID0gdGhpcy5tYXRjaDtcbiAgICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgICBncm91cCA9IHJlZltpXTtcbiAgICAgICAgICBpZiAoaSA+IDAgJiYgKGdyb3VwICE9IG51bGwpKSB7XG4gICAgICAgICAgICBfbmFtZSA9IHRoaXMucGFpci5tYXRjaEFueVBhcnRLZXlzKClbaSAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuIF9uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfbmFtZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9uYW1lIHx8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm9mZnNldDtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMubWF0Y2hbMF0ubGVuZ3RoICsgdGhpcy5vZmZzZXQ7XG4gIH1cblxuICB2YWxpZCgpIHtcbiAgICByZXR1cm4gIXRoaXMucGFpci52YWxpZE1hdGNoIHx8IHRoaXMucGFpci52YWxpZE1hdGNoKHRoaXMpO1xuICB9XG5cbiAgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoWzBdLmxlbmd0aDtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIFBvc1xuICBjb25zdHJ1Y3RvcjogKEBzdGFydCxAZW5kKSAtPlxuICAgIEBlbmQgPSBAc3RhcnQgdW5sZXNzIEBlbmQ/XG4gIGNvbnRhaW5zUHQ6IChwdCkgLT5cbiAgICByZXR1cm4gQHN0YXJ0IDw9IHB0IGFuZCBwdCA8PSBAZW5kXG4gIGNvbnRhaW5zUG9zOiAocG9zKSAtPlxuICAgIHJldHVybiBAc3RhcnQgPD0gcG9zLnN0YXJ0IGFuZCBwb3MuZW5kIDw9IEBlbmRcbiAgd3JhcHBlZEJ5OiAocHJlZml4LHN1ZmZpeCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcy53cmFwQ2xhc3MoQHN0YXJ0LXByZWZpeC5sZW5ndGgsQHN0YXJ0LEBlbmQsQGVuZCtzdWZmaXgubGVuZ3RoKVxuICB3aXRoRWRpdG9yOiAodmFsKS0+XG4gICAgQF9lZGl0b3IgPSB2YWxcbiAgICByZXR1cm4gdGhpc1xuICBlZGl0b3I6IC0+XG4gICAgdW5sZXNzIEBfZWRpdG9yP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0JylcbiAgICByZXR1cm4gQF9lZGl0b3JcbiAgaGFzRWRpdG9yOiAtPlxuICAgIHJldHVybiBAX2VkaXRvcj9cbiAgdGV4dDogLT5cbiAgICBAZWRpdG9yKCkudGV4dFN1YnN0cihAc3RhcnQsIEBlbmQpXG4gIGFwcGx5T2Zmc2V0OiAob2Zmc2V0KS0+XG4gICAgaWYgb2Zmc2V0ICE9IDBcbiAgICAgIEBzdGFydCArPSBvZmZzZXRcbiAgICAgIEBlbmQgKz0gb2Zmc2V0XG4gICAgcmV0dXJuIHRoaXNcbiAgcHJldkVPTDogLT5cbiAgICB1bmxlc3MgQF9wcmV2RU9MP1xuICAgICAgQF9wcmV2RU9MID0gQGVkaXRvcigpLmZpbmRMaW5lU3RhcnQoQHN0YXJ0KVxuICAgIHJldHVybiBAX3ByZXZFT0xcbiAgbmV4dEVPTDogLT5cbiAgICB1bmxlc3MgQF9uZXh0RU9MP1xuICAgICAgQF9uZXh0RU9MID0gQGVkaXRvcigpLmZpbmRMaW5lRW5kKEBlbmQpXG4gICAgcmV0dXJuIEBfbmV4dEVPTFxuICB0ZXh0V2l0aEZ1bGxMaW5lczogLT5cbiAgICB1bmxlc3MgQF90ZXh0V2l0aEZ1bGxMaW5lcz9cbiAgICAgIEBfdGV4dFdpdGhGdWxsTGluZXMgPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAcHJldkVPTCgpLEBuZXh0RU9MKCkpXG4gICAgcmV0dXJuIEBfdGV4dFdpdGhGdWxsTGluZXNcbiAgc2FtZUxpbmVzUHJlZml4OiAtPlxuICAgIHVubGVzcyBAX3NhbWVMaW5lc1ByZWZpeD9cbiAgICAgIEBfc2FtZUxpbmVzUHJlZml4ID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQHByZXZFT0woKSxAc3RhcnQpXG4gICAgcmV0dXJuIEBfc2FtZUxpbmVzUHJlZml4XG4gIHNhbWVMaW5lc1N1ZmZpeDogLT5cbiAgICB1bmxlc3MgQF9zYW1lTGluZXNTdWZmaXg/XG4gICAgICBAX3NhbWVMaW5lc1N1ZmZpeCA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBlbmQsQG5leHRFT0woKSlcbiAgICByZXR1cm4gQF9zYW1lTGluZXNTdWZmaXhcbiAgY29weTogLT5cbiAgICByZXMgPSBuZXcgUG9zKEBzdGFydCxAZW5kKVxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgcmVzLndpdGhFZGl0b3IoQGVkaXRvcigpKVxuICAgIHJldHVybiByZXNcbiAgcmF3OiAtPlxuICAgIFtAc3RhcnQsQGVuZF0iLCJleHBvcnQgdmFyIFBvcyA9IGNsYXNzIFBvcyB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBlbmQpIHtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgaWYgKHRoaXMuZW5kID09IG51bGwpIHtcbiAgICAgIHRoaXMuZW5kID0gdGhpcy5zdGFydDtcbiAgICB9XG4gIH1cblxuICBjb250YWluc1B0KHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5lbmQ7XG4gIH1cblxuICBjb250YWluc1Bvcyhwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmVuZDtcbiAgfVxuXG4gIHdyYXBwZWRCeShwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyh0aGlzLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCwgdGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZW5kICsgc3VmZml4Lmxlbmd0aCk7XG4gIH1cblxuICB3aXRoRWRpdG9yKHZhbCkge1xuICAgIHRoaXMuX2VkaXRvciA9IHZhbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGVkaXRvcigpIHtcbiAgICBpZiAodGhpcy5fZWRpdG9yID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZWRpdG9yIHNldCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yO1xuICB9XG5cbiAgaGFzRWRpdG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9lZGl0b3IgIT0gbnVsbDtcbiAgfVxuXG4gIHRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gIH1cblxuICBhcHBseU9mZnNldChvZmZzZXQpIHtcbiAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgIHRoaXMuZW5kICs9IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcmV2RU9MKCkge1xuICAgIGlmICh0aGlzLl9wcmV2RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3ByZXZFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lU3RhcnQodGhpcy5zdGFydCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9wcmV2RU9MO1xuICB9XG5cbiAgbmV4dEVPTCgpIHtcbiAgICBpZiAodGhpcy5fbmV4dEVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9uZXh0RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZUVuZCh0aGlzLmVuZCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9uZXh0RU9MO1xuICB9XG5cbiAgdGV4dFdpdGhGdWxsTGluZXMoKSB7XG4gICAgaWYgKHRoaXMuX3RleHRXaXRoRnVsbExpbmVzID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHRXaXRoRnVsbExpbmVzID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMucHJldkVPTCgpLCB0aGlzLm5leHRFT0woKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcztcbiAgfVxuXG4gIHNhbWVMaW5lc1ByZWZpeCgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzUHJlZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5zdGFydCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNQcmVmaXg7XG4gIH1cblxuICBzYW1lTGluZXNTdWZmaXgoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNTdWZmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5lbmQsIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NhbWVMaW5lc1N1ZmZpeDtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBuZXcgUG9zKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICByYXcoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnN0YXJ0LCB0aGlzLmVuZF07XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFdyYXBwaW5nIH0gZnJvbSAnLi9XcmFwcGluZyc7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgQ29tbW9uSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUG9zQ29sbGVjdGlvblxuICBjb25zdHJ1Y3RvcjogKGFycikgLT5cbiAgICBpZiAhQXJyYXkuaXNBcnJheShhcnIpXG4gICAgICBhcnIgPSBbYXJyXVxuICAgIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhhcnIsW1Bvc0NvbGxlY3Rpb25dKVxuICAgIHJldHVybiBhcnJcbiAgICBcbiAgd3JhcDogKHByZWZpeCxzdWZmaXgpLT5cbiAgICAgIHJldHVybiBAbWFwKCAocCkgLT4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeCkpXG4gIHJlcGxhY2U6ICh0eHQpLT5cbiAgICAgIHJldHVybiBAbWFwKCAocCkgLT4gbmV3IFJlcGxhY2VtZW50KHAuc3RhcnQsIHAuZW5kLCB0eHQpKSIsImltcG9ydCB7XG4gIFdyYXBwaW5nXG59IGZyb20gJy4vV3JhcHBpbmcnO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuaW1wb3J0IHtcbiAgQ29tbW9uSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcblxuZXhwb3J0IHZhciBQb3NDb2xsZWN0aW9uID0gY2xhc3MgUG9zQ29sbGVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGFycikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICBhcnIgPSBbYXJyXTtcbiAgICB9XG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFyciwgW1Bvc0NvbGxlY3Rpb25dKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgd3JhcChwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeCk7XG4gICAgfSk7XG4gIH1cblxuICByZXBsYWNlKHR4dCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gbmV3IFJlcGxhY2VtZW50KHAuc3RhcnQsIHAuZW5kLCB0eHQpO1xuICAgIH0pO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL1Bvcyc7XG5pbXBvcnQgeyBDb21tb25IZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5pbXBvcnQgeyBPcHRpb25PYmplY3QgfSBmcm9tICcuLi9PcHRpb25PYmplY3QnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUmVwbGFjZW1lbnQgZXh0ZW5kcyBQb3NcbiAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKHRoaXMucHJvdG90eXBlLFtPcHRpb25PYmplY3RdKVxuICBjb25zdHJ1Y3RvcjogKEBzdGFydCwgQGVuZCwgQHRleHQsIEBvcHRpb25zID0ge30pIC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRPcHRzKEBvcHRpb25zLHtcbiAgICAgIHByZWZpeDogJydcbiAgICAgIHN1ZmZpeDogJydcbiAgICAgIHNlbGVjdGlvbnM6IFtdXG4gICAgfSlcbiAgcmVzUG9zQmVmb3JlUHJlZml4OiAtPlxuICAgIHJldHVybiBAc3RhcnQrQHByZWZpeC5sZW5ndGgrQHRleHQubGVuZ3RoXG4gIHJlc0VuZDogLT4gXG4gICAgcmV0dXJuIEBzdGFydCtAZmluYWxUZXh0KCkubGVuZ3RoXG4gIGFwcGx5OiAtPlxuICAgIEBlZGl0b3IoKS5zcGxpY2VUZXh0KEBzdGFydCwgQGVuZCwgQGZpbmFsVGV4dCgpKVxuICBuZWNlc3Nhcnk6IC0+XG4gICAgcmV0dXJuIEBmaW5hbFRleHQoKSAhPSBAb3JpZ2luYWxUZXh0KClcbiAgb3JpZ2luYWxUZXh0OiAtPlxuICAgIHJldHVybiBAZWRpdG9yKCkudGV4dFN1YnN0cihAc3RhcnQsIEBlbmQpXG4gIGZpbmFsVGV4dDogLT5cbiAgICByZXR1cm4gQHByZWZpeCtAdGV4dCtAc3VmZml4XG4gIG9mZnNldEFmdGVyOiAoKSAtPiBcbiAgICByZXR1cm4gQGZpbmFsVGV4dCgpLmxlbmd0aCAtIChAZW5kIC0gQHN0YXJ0KVxuICBhcHBseU9mZnNldDogKG9mZnNldCktPlxuICAgIGlmIG9mZnNldCAhPSAwXG4gICAgICBAc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBAZW5kICs9IG9mZnNldFxuICAgICAgZm9yIHNlbCBpbiBAc2VsZWN0aW9uc1xuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0XG4gICAgcmV0dXJuIHRoaXNcbiAgc2VsZWN0Q29udGVudDogLT4gXG4gICAgQHNlbGVjdGlvbnMgPSBbbmV3IFBvcyhAcHJlZml4Lmxlbmd0aCtAc3RhcnQsIEBwcmVmaXgubGVuZ3RoK0BzdGFydCtAdGV4dC5sZW5ndGgpXVxuICAgIHJldHVybiB0aGlzXG4gIGNhcnJldFRvU2VsOiAtPlxuICAgIEBzZWxlY3Rpb25zID0gW11cbiAgICB0ZXh0ID0gQGZpbmFsVGV4dCgpXG4gICAgQHByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHByZWZpeClcbiAgICBAdGV4dCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHRleHQpXG4gICAgQHN1ZmZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHN1ZmZpeClcbiAgICBzdGFydCA9IEBzdGFydFxuICAgIFxuICAgIHdoaWxlIChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpP1xuICAgICAgW3Bvcyx0ZXh0XSA9IHJlc1xuICAgICAgQHNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0K3Bvcywgc3RhcnQrcG9zKSlcbiAgICAgIFxuICAgIHJldHVybiB0aGlzXG4gIGNvcHk6IC0+IFxuICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudChAc3RhcnQsIEBlbmQsIEB0ZXh0LCBAZ2V0T3B0cygpKVxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgcmVzLndpdGhFZGl0b3IoQGVkaXRvcigpKVxuICAgIHJlcy5zZWxlY3Rpb25zID0gQHNlbGVjdGlvbnMubWFwKCAocyktPnMuY29weSgpIClcbiAgICByZXR1cm4gcmVzIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vUG9zJztcblxuaW1wb3J0IHtcbiAgQ29tbW9uSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcblxuaW1wb3J0IHtcbiAgT3B0aW9uT2JqZWN0XG59IGZyb20gJy4uL09wdGlvbk9iamVjdCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCB2YXIgUmVwbGFjZW1lbnQgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIFJlcGxhY2VtZW50IGV4dGVuZHMgUG9zIHtcbiAgICBjb25zdHJ1Y3RvcihzdGFydDEsIGVuZCwgdGV4dDEsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDE7XG4gICAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICAgIHRoaXMudGV4dCA9IHRleHQxO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgcHJlZml4OiAnJyxcbiAgICAgICAgc3VmZml4OiAnJyxcbiAgICAgICAgc2VsZWN0aW9uczogW11cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc1Bvc0JlZm9yZVByZWZpeCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy50ZXh0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXNFbmQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoO1xuICAgIH1cblxuICAgIGFwcGx5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkuc3BsaWNlVGV4dCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5maW5hbFRleHQoKSk7XG4gICAgfVxuXG4gICAgbmVjZXNzYXJ5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkgIT09IHRoaXMub3JpZ2luYWxUZXh0KCk7XG4gICAgfVxuXG4gICAgb3JpZ2luYWxUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gICAgfVxuXG4gICAgZmluYWxUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy50ZXh0ICsgdGhpcy5zdWZmaXg7XG4gICAgfVxuXG4gICAgb2Zmc2V0QWZ0ZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKS5sZW5ndGggLSAodGhpcy5lbmQgLSB0aGlzLnN0YXJ0KTtcbiAgICB9XG5cbiAgICBhcHBseU9mZnNldChvZmZzZXQpIHtcbiAgICAgIHZhciBpLCBsZW4sIHJlZiwgc2VsO1xuICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgICAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnM7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHNlbCA9IHJlZltpXTtcbiAgICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZWxlY3RDb250ZW50KCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW25ldyBQb3ModGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCwgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCArIHRoaXMudGV4dC5sZW5ndGgpXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNhcnJldFRvU2VsKCkge1xuICAgICAgdmFyIHBvcywgcmVzLCBzdGFydCwgdGV4dDtcbiAgICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtdO1xuICAgICAgdGV4dCA9IHRoaXMuZmluYWxUZXh0KCk7XG4gICAgICB0aGlzLnByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5wcmVmaXgpO1xuICAgICAgdGhpcy50ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnRleHQpO1xuICAgICAgdGhpcy5zdWZmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMuc3VmZml4KTtcbiAgICAgIHN0YXJ0ID0gdGhpcy5zdGFydDtcbiAgICAgIHdoaWxlICgocmVzID0gU3RyaW5nSGVscGVyLmdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHRleHQpKSAhPSBudWxsKSB7XG4gICAgICAgIFtwb3MsIHRleHRdID0gcmVzO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0ICsgcG9zLCBzdGFydCArIHBvcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgIHZhciByZXM7XG4gICAgICByZXMgPSBuZXcgUmVwbGFjZW1lbnQodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMudGV4dCwgdGhpcy5nZXRPcHRzKCkpO1xuICAgICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSk7XG4gICAgICB9XG4gICAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcy5jb3B5KCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gIH07XG5cbiAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKFJlcGxhY2VtZW50LnByb3RvdHlwZSwgW09wdGlvbk9iamVjdF0pO1xuXG4gIHJldHVybiBSZXBsYWNlbWVudDtcblxufSkuY2FsbCh0aGlzKTtcbiIsImV4cG9ydCBjbGFzcyBTaXplXG4gIGNvbnN0cnVjdG9yOiAoQHdpZHRoLEBoZWlnaHQpIC0+IiwiZXhwb3J0IGNsYXNzIFN0clBvc1xuICBjb25zdHJ1Y3RvcjogKEBwb3MsQHN0cikgLT5cbiAgZW5kOiAtPlxuICAgIEBwb3MgKyBAc3RyLmxlbmd0aCIsImV4cG9ydCB2YXIgU3RyUG9zID0gY2xhc3MgU3RyUG9zIHtcbiAgY29uc3RydWN0b3IocG9zLCBzdHIpIHtcbiAgICB0aGlzLnBvcyA9IHBvcztcbiAgICB0aGlzLnN0ciA9IHN0cjtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGg7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcblxuZXhwb3J0IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3NcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIC0+XG4gICAgc3VwZXIoKVxuICBpbm5lckNvbnRhaW5zUHQ6IChwdCkgLT5cbiAgICByZXR1cm4gQGlubmVyU3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBpbm5lckVuZFxuICBpbm5lckNvbnRhaW5zUG9zOiAocG9zKSAtPlxuICAgIHJldHVybiBAaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGlubmVyRW5kXG4gIGlubmVyVGV4dDogLT5cbiAgICBAZWRpdG9yKCkudGV4dFN1YnN0cihAaW5uZXJTdGFydCwgQGlubmVyRW5kKVxuICBzZXRJbm5lckxlbjogKGxlbikgLT5cbiAgICBAbW92ZVN1Zml4KEBpbm5lclN0YXJ0ICsgbGVuKVxuICBtb3ZlU3VmZml4OiAocHQpIC0+XG4gICAgc3VmZml4TGVuID0gQGVuZCAtIEBpbm5lckVuZFxuICAgIEBpbm5lckVuZCA9IHB0XG4gICAgQGVuZCA9IEBpbm5lckVuZCArIHN1ZmZpeExlblxuICBjb3B5OiAtPlxuICAgIHJldHVybiBuZXcgV3JhcHBlZFBvcyhAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vUG9zJztcblxuZXhwb3J0IHZhciBXcmFwcGVkUG9zID0gY2xhc3MgV3JhcHBlZFBvcyBleHRlbmRzIFBvcyB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBpbm5lclN0YXJ0LCBpbm5lckVuZCwgZW5kKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5pbm5lclN0YXJ0ID0gaW5uZXJTdGFydDtcbiAgICB0aGlzLmlubmVyRW5kID0gaW5uZXJFbmQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gIH1cblxuICBpbm5lckNvbnRhaW5zUHQocHQpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclN0YXJ0IDw9IHB0ICYmIHB0IDw9IHRoaXMuaW5uZXJFbmQ7XG4gIH1cblxuICBpbm5lckNvbnRhaW5zUG9zKHBvcykge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcG9zLnN0YXJ0ICYmIHBvcy5lbmQgPD0gdGhpcy5pbm5lckVuZDtcbiAgfVxuXG4gIGlubmVyVGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCk7XG4gIH1cblxuICBzZXRJbm5lckxlbihsZW4pIHtcbiAgICByZXR1cm4gdGhpcy5tb3ZlU3VmaXgodGhpcy5pbm5lclN0YXJ0ICsgbGVuKTtcbiAgfVxuXG4gIG1vdmVTdWZmaXgocHQpIHtcbiAgICB2YXIgc3VmZml4TGVuO1xuICAgIHN1ZmZpeExlbiA9IHRoaXMuZW5kIC0gdGhpcy5pbm5lckVuZDtcbiAgICB0aGlzLmlubmVyRW5kID0gcHQ7XG4gICAgcmV0dXJuIHRoaXMuZW5kID0gdGhpcy5pbm5lckVuZCArIHN1ZmZpeExlbjtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKHRoaXMuc3RhcnQsIHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCwgdGhpcy5lbmQpO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgY2xhc3MgV3JhcHBpbmcgZXh0ZW5kcyBSZXBsYWNlbWVudFxuICBjb25zdHJ1Y3RvcjogKEBzdGFydCwgQGVuZCwgcHJlZml4ID0nJywgc3VmZml4ID0gJycsIEBvcHRpb25zID0ge30pIC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRPcHRzKEBvcHRpb25zKVxuICAgIEB0ZXh0ID0gJydcbiAgICBAcHJlZml4ID0gcHJlZml4XG4gICAgQHN1ZmZpeCA9IHN1ZmZpeFxuICBhcHBseTogLT5cbiAgICBAYWRqdXN0U2VsKClcbiAgICBzdXBlcigpXG4gIGFkanVzdFNlbDogLT5cbiAgICBvZmZzZXQgPSBAb3JpZ2luYWxUZXh0KCkubGVuZ3RoXG4gICAgZm9yIHNlbCBpbiBAc2VsZWN0aW9uc1xuICAgICAgaWYgc2VsLnN0YXJ0ID4gQHN0YXJ0K0BwcmVmaXgubGVuZ3RoXG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgIGlmIHNlbC5lbmQgPj0gQHN0YXJ0K0BwcmVmaXgubGVuZ3RoXG4gICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0XG4gIGZpbmFsVGV4dDogLT5cbiAgICBpZiBAaGFzRWRpdG9yKClcbiAgICAgIHRleHQgPSBAb3JpZ2luYWxUZXh0KClcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gJydcbiAgICByZXR1cm4gQHByZWZpeCt0ZXh0K0BzdWZmaXhcbiAgb2Zmc2V0QWZ0ZXI6ICgpIC0+IFxuICAgIHJldHVybiBAcHJlZml4Lmxlbmd0aCtAc3VmZml4Lmxlbmd0aFxuICAgICAgICAgIFxuICBjb3B5OiAtPiBcbiAgICByZXMgPSBuZXcgV3JhcHBpbmcoQHN0YXJ0LCBAZW5kLCBAcHJlZml4LCBAc3VmZml4KVxuICAgIHJlcy5zZWxlY3Rpb25zID0gQHNlbGVjdGlvbnMubWFwKCAocyktPnMuY29weSgpIClcbiAgICByZXR1cm4gcmVzIiwiaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCB2YXIgV3JhcHBpbmcgPSBjbGFzcyBXcmFwcGluZyBleHRlbmRzIFJlcGxhY2VtZW50IHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGVuZCwgcHJlZml4ID0gJycsIHN1ZmZpeCA9ICcnLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMudGV4dCA9ICcnO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4O1xuICAgIHRoaXMuc3VmZml4ID0gc3VmZml4O1xuICB9XG5cbiAgYXBwbHkoKSB7XG4gICAgdGhpcy5hZGp1c3RTZWwoKTtcbiAgICByZXR1cm4gc3VwZXIuYXBwbHkoKTtcbiAgfVxuXG4gIGFkanVzdFNlbCgpIHtcbiAgICB2YXIgaSwgbGVuLCBvZmZzZXQsIHJlZiwgcmVzdWx0cywgc2VsO1xuICAgIG9mZnNldCA9IHRoaXMub3JpZ2luYWxUZXh0KCkubGVuZ3RoO1xuICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9ucztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzZWwgPSByZWZbaV07XG4gICAgICBpZiAoc2VsLnN0YXJ0ID4gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgfVxuICAgICAgaWYgKHNlbC5lbmQgPj0gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHRzLnB1c2goc2VsLmVuZCArPSBvZmZzZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgZmluYWxUZXh0KCkge1xuICAgIHZhciB0ZXh0O1xuICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICB0ZXh0ID0gdGhpcy5vcmlnaW5hbFRleHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9ICcnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0ZXh0ICsgdGhpcy5zdWZmaXg7XG4gIH1cblxuICBvZmZzZXRBZnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdWZmaXgubGVuZ3RoO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBXcmFwcGluZyh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5wcmVmaXgsIHRoaXMuc3VmZml4KTtcbiAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24ocykge1xuICAgICAgcmV0dXJuIHMuY29weSgpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxufTtcbiIsIlxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZUVuZ2luZVxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgc2F2ZTogKGtleSx2YWwpIC0+XG4gICAgaWYgbG9jYWxTdG9yYWdlP1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oQGZ1bGxLZXkoa2V5KSwgSlNPTi5zdHJpbmdpZnkodmFsKSlcbiAgc2F2ZUluUGF0aDogKHBhdGgsIGtleSwgdmFsKSAtPlxuICAgIGRhdGEgPSBAbG9hZChwYXRoKVxuICAgIHVubGVzcyBkYXRhP1xuICAgICAgZGF0YSA9IHt9XG4gICAgZGF0YVtrZXldID0gdmFsXG4gICAgQHNhdmUocGF0aCxkYXRhKVxuICBsb2FkOiAoa2V5KSAtPlxuICAgIGlmIGxvY2FsU3RvcmFnZT9cbiAgICAgIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oQGZ1bGxLZXkoa2V5KSkpXG4gIGZ1bGxLZXk6IChrZXkpIC0+XG4gICAgJ0NvZGVXYXZlXycra2V5IiwiZXhwb3J0IHZhciBMb2NhbFN0b3JhZ2VFbmdpbmUgPSBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmUge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgc2F2ZShrZXksIHZhbCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKTtcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZGF0YSA9IHRoaXMubG9hZChwYXRoKTtcbiAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfVxuICAgIGRhdGFba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gdGhpcy5zYXZlKHBhdGgsIGRhdGEpO1xuICB9XG5cbiAgbG9hZChrZXkpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpKSk7XG4gICAgfVxuICB9XG5cbiAgZnVsbEtleShrZXkpIHtcbiAgICByZXR1cm4gJ0NvZGVXYXZlXycgKyBrZXk7XG4gIH1cblxufTtcbiJdfQ==
