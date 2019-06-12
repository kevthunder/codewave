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
        if (this.isRoot()) {
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

var BoxCmd, CloseCmd, EditCmd, EmmetCmd, NameSpaceCmd, aliasCommand, exec_parent, getCommand, getContent, getParam, help, listCommand, no_execute, quote_carret, removeCommand, renameCommand, setCommand;

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
          'allowedNamed': ['name', 'value'],
          'help': "set the value of a variable"
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
  var name;
  name = instance.getParam([0, 'name']);
  return instance.codewave.vars[name];
};

setCommand = function setCommand(instance) {
  var p, val;
  val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : void 0;

  if (val != null) {
    return instance.codewave.vars[name] = val;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvQm94SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9Cb3hIZWxwZXIuanMiLCIuLi9zcmMvQ2xvc2luZ1Byb21wLmNvZmZlZSIsIi4uL3NyYy9DbG9zaW5nUHJvbXAuanMiLCIuLi9zcmMvQ21kRmluZGVyLmNvZmZlZSIsIi4uL3NyYy9DbWRGaW5kZXIuanMiLCIuLi9zcmMvQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL0NtZEluc3RhbmNlLmpzIiwiLi4vc3JjL0NvZGV3YXZlLmNvZmZlZSIsIi4uL3NyYy9Db2Rld2F2ZS5qcyIsIi4uL3NyYy9Db21tYW5kLmNvZmZlZSIsIi4uL3NyYy9Db21tYW5kLmpzIiwiLi4vc3JjL0NvbnRleHQuY29mZmVlIiwiLi4vc3JjL0NvbnRleHQuanMiLCIuLi9zcmMvRGV0ZWN0b3IuY29mZmVlIiwiLi4vc3JjL0RldGVjdG9yLmpzIiwiLi4vc3JjL0VkaXRDbWRQcm9wLmNvZmZlZSIsIi4uL3NyYy9FZGl0Q21kUHJvcC5qcyIsIi4uL3NyYy9FZGl0b3IuY29mZmVlIiwiLi4vc3JjL0VkaXRvci5qcyIsIi4uL3NyYy9Mb2dnZXIuY29mZmVlIiwiLi4vc3JjL0xvZ2dlci5qcyIsIi4uL3NyYy9PcHRpb25PYmplY3QuY29mZmVlIiwiLi4vc3JjL09wdGlvbk9iamVjdC5qcyIsIi4uL3NyYy9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsIi4uL3NyYy9Qcm9jZXNzLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmpzIiwiLi4vc3JjL1RleHRBcmVhRWRpdG9yLmNvZmZlZSIsIi4uL3NyYy9UZXh0QXJlYUVkaXRvci5qcyIsIi4uL3NyYy9UZXh0UGFyc2VyLmNvZmZlZSIsIi4uL3NyYy9UZXh0UGFyc2VyLmpzIiwiLi4vc3JjL2Jvb3RzdHJhcC5jb2ZmZWUiLCIuLi9zcmMvYm9vdHN0cmFwLmpzIiwiLi4vc3JjL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9QaHBDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2VudHJ5LmNvZmZlZSIsIi4uL3NyYy9lbnRyeS5qcyIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvQ29tbW9uSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0NvbW1vbkhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL05hbWVzcGFjZUhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCIuLi9zcmMvaGVscGVycy9PcHRpb25hbFByb21pc2UuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlLmpzIiwiLi4vc3JjL2hlbHBlcnMvU3RyaW5nSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL1N0cmluZ0hlbHBlci5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1BhaXJNYXRjaC5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1NpemUuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1N0clBvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvV3JhcHBpbmcuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwaW5nLmpzIiwiLi4vc3JjL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZS5jb2ZmZWUiLCIuLi9zcmMvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSx1QkFBQSxDQUFBOztBQUNBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxvQkFBQSxDQUFBOztBQUVBLElBQWEsU0FBTjtBQUFBO0FBQUE7QUFDTCxxQkFBYSxPQUFiLEVBQWE7QUFBQSxRQUFXLE9BQVgsdUVBQUEsRUFBQTs7QUFBQTs7QUFDWCxRQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQURZLFNBQUEsT0FBQSxHQUFBLE9BQUE7QUFDWixTQUFBLFFBQUEsR0FBWTtBQUNWLE1BQUEsSUFBQSxFQUFNLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FESSxJ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LEtBQUEsT0FBQSxDQUFoQyxHQUFnQyxDQUFyQixDQUFYLENDT0E7QUFDRDtBRFZHO0FBWEQ7QUFBQTtBQUFBLDRCQWNJLEdBZEosRUFjSTtBQ1dQLGFEVkEsY0FBWSxHQ1VaO0FEWE87QUFkSjs7QUFBQTtBQUFBLEdBQVAiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcbmltcG9ydCB7IFBhaXIgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgY2xhc3MgQm94SGVscGVyXG4gIGNvbnN0cnVjdG9yOiAoQGNvbnRleHQsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBAZGVmYXVsdHMgPSB7XG4gICAgICBkZWNvOiBAY29udGV4dC5jb2Rld2F2ZS5kZWNvXG4gICAgICBwYWQ6IDJcbiAgICAgIHdpZHRoOiA1MFxuICAgICAgaGVpZ2h0OiAzXG4gICAgICBvcGVuVGV4dDogJydcbiAgICAgIGNsb3NlVGV4dDogJydcbiAgICAgIHByZWZpeDogJydcbiAgICAgIHN1ZmZpeDogJydcbiAgICAgIGluZGVudDogMFxuICAgIH1cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gIGNsb25lOiAodGV4dCkgLT5cbiAgICBvcHQgPSB7fVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIG9wdFtrZXldID0gdGhpc1trZXldXG4gICAgcmV0dXJuIG5ldyBCb3hIZWxwZXIoQGNvbnRleHQsb3B0KVxuICBkcmF3OiAodGV4dCkgLT5cbiAgICByZXR1cm4gQHN0YXJ0U2VwKCkgKyBcIlxcblwiICsgQGxpbmVzKHRleHQpICsgXCJcXG5cIisgQGVuZFNlcCgpXG4gIHdyYXBDb21tZW50OiAoc3RyKSAtPlxuICAgIHJldHVybiBAY29udGV4dC53cmFwQ29tbWVudChzdHIpXG4gIHNlcGFyYXRvcjogLT5cbiAgICBsZW4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGhcbiAgICByZXR1cm4gQHdyYXBDb21tZW50KEBkZWNvTGluZShsZW4pKVxuICBzdGFydFNlcDogLT5cbiAgICBsbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aCAtIEBvcGVuVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gQHByZWZpeCArIEB3cmFwQ29tbWVudChAb3BlblRleHQrQGRlY29MaW5lKGxuKSlcbiAgZW5kU2VwOiAtPlxuICAgIGxuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoIC0gQGNsb3NlVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gQHdyYXBDb21tZW50KEBjbG9zZVRleHQrQGRlY29MaW5lKGxuKSkgKyBAc3VmZml4XG4gIGRlY29MaW5lOiAobGVuKSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoQGRlY28sIGxlbilcbiAgcGFkZGluZzogLT4gXG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgQHBhZClcbiAgbGluZXM6ICh0ZXh0ID0gJycsIHVwdG9IZWlnaHQ9dHJ1ZSkgLT5cbiAgICB0ZXh0ID0gdGV4dCBvciAnJ1xuICAgIGxpbmVzID0gdGV4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpXG4gICAgaWYgdXB0b0hlaWdodFxuICAgICAgcmV0dXJuIChAbGluZShsaW5lc1t4XSBvciAnJykgZm9yIHggaW4gWzAuLkBoZWlnaHRdKS5qb2luKCdcXG4nKSBcbiAgICBlbHNlXG4gICAgICByZXR1cm4gKEBsaW5lKGwpIGZvciBsIGluIGxpbmVzKS5qb2luKCdcXG4nKSBcbiAgbGluZTogKHRleHQgPSAnJykgLT5cbiAgICByZXR1cm4gKFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIixAaW5kZW50KSArXG4gICAgICBAd3JhcENvbW1lbnQoXG4gICAgICAgIEBkZWNvICtcbiAgICAgICAgQHBhZGRpbmcoKSArXG4gICAgICAgIHRleHQgK1xuICAgICAgICBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIEB3aWR0aCAtIEByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KS5sZW5ndGgpICsgXG4gICAgICAgIEBwYWRkaW5nKCkgK1xuICAgICAgICBAZGVjb1xuICAgICAgKSlcbiAgbGVmdDogLT5cbiAgICBAY29udGV4dC53cmFwQ29tbWVudExlZnQoQGRlY28gKyBAcGFkZGluZygpKVxuICByaWdodDogLT5cbiAgICBAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KEBwYWRkaW5nKCkgKyBAZGVjbylcbiAgcmVtb3ZlSWdub3JlZENvbnRlbnQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKEBjb250ZXh0LmNvZGV3YXZlLnJlbW92ZUNhcnJldCh0ZXh0KSlcbiAgdGV4dEJvdW5kczogKHRleHQpIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRUeHRTaXplKEByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSlcbiAgZ2V0Qm94Rm9yUG9zOiAocG9zKSAtPlxuICAgIGRlcHRoID0gQGdldE5lc3RlZEx2bChwb3Muc3RhcnQpXG4gICAgaWYgZGVwdGggPiAwXG4gICAgICBsZWZ0ID0gQGxlZnQoKVxuICAgICAgY3VyTGVmdCA9IFN0cmluZ0hlbHBlci5yZXBlYXQobGVmdCxkZXB0aC0xKVxuICAgICAgXG4gICAgICBjbG9uZSA9IEBjbG9uZSgpXG4gICAgICBwbGFjZWhvbGRlciA9IFwiIyMjUGxhY2VIb2xkZXIjIyNcIlxuICAgICAgY2xvbmUud2lkdGggPSBwbGFjZWhvbGRlci5sZW5ndGhcbiAgICAgIGNsb25lLm9wZW5UZXh0ID0gY2xvbmUuY2xvc2VUZXh0ID0gQGRlY28gKyBAZGVjbyArIHBsYWNlaG9sZGVyICsgQGRlY28gKyBAZGVjb1xuICAgICAgXG4gICAgICBzdGFydEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuc3RhcnRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwnLionKSlcbiAgICAgIGVuZEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuZW5kU2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsJy4qJykpXG4gICAgICBcbiAgICAgIHBhaXIgPSBuZXcgUGFpcihzdGFydEZpbmQsZW5kRmluZCx7XG4gICAgICAgIHZhbGlkTWF0Y2g6IChtYXRjaCk9PlxuICAgICAgICAgICMgY29uc29sZS5sb2cobWF0Y2gsbGVmdClcbiAgICAgICAgICBmID0gQGNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQobWF0Y2guc3RhcnQoKSAsW2xlZnQsXCJcXG5cIixcIlxcclwiXSwtMSlcbiAgICAgICAgICByZXR1cm4gIWY/IG9yIGYuc3RyICE9IGxlZnRcbiAgICAgIH0pXG4gICAgICByZXMgPSBwYWlyLndyYXBwZXJQb3MocG9zLEBjb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG4gICAgICBpZiByZXM/XG4gICAgICAgIHJlcy5zdGFydCArPSBjdXJMZWZ0Lmxlbmd0aFxuICAgICAgICByZXR1cm4gcmVzXG4gICAgXG4gIGdldE5lc3RlZEx2bDogKGluZGV4KSAtPlxuICAgIGRlcHRoID0gMFxuICAgIGxlZnQgPSBAbGVmdCgpXG4gICAgd2hpbGUgKGYgPSBAY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCAsW2xlZnQsXCJcXG5cIixcIlxcclwiXSwtMSkpPyAmJiBmLnN0ciA9PSBsZWZ0XG4gICAgICBpbmRleCA9IGYucG9zXG4gICAgICBkZXB0aCsrXG4gICAgcmV0dXJuIGRlcHRoXG4gIGdldE9wdEZyb21MaW5lOiAobGluZSxnZXRQYWQ9dHJ1ZSkgLT5cbiAgICByU3RhcnQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIrU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoQGRlY28pKStcIikoXFxcXHMqKVwiKVxuICAgIHJFbmQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIrU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KEBkZWNvKSkrXCIpKFxcbnwkKVwiKVxuICAgIHJlc1N0YXJ0ID0gclN0YXJ0LmV4ZWMobGluZSlcbiAgICByZXNFbmQgPSByRW5kLmV4ZWMobGluZSlcbiAgICBpZiByZXNTdGFydD8gYW5kIHJlc0VuZD9cbiAgICAgIGlmIGdldFBhZFxuICAgICAgICBAcGFkID0gTWF0aC5taW4ocmVzU3RhcnRbM10ubGVuZ3RoLHJlc0VuZFsxXS5sZW5ndGgpXG4gICAgICBAaW5kZW50ID0gcmVzU3RhcnRbMV0ubGVuZ3RoXG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgQHBhZFxuICAgICAgZW5kUG9zID0gcmVzRW5kLmluZGV4ICsgcmVzRW5kWzFdLmxlbmd0aCAtIEBwYWRcbiAgICAgIEB3aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zXG4gICAgcmV0dXJuIHRoaXNcbiAgcmVmb3JtYXRMaW5lczogKHRleHQsb3B0aW9ucz17fSkgLT5cbiAgICByZXR1cm4gQGxpbmVzKEByZW1vdmVDb21tZW50KHRleHQsb3B0aW9ucyksZmFsc2UpXG4gIHJlbW92ZUNvbW1lbnQ6ICh0ZXh0LG9wdGlvbnM9e30pLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIG11bHRpbGluZTogdHJ1ZVxuICAgICAgfVxuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSxkZWZhdWx0cyxvcHRpb25zKVxuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKVxuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBkZWNvKVxuICAgICAgZmxhZyA9IGlmIG9wdGlvbnNbJ211bHRpbGluZSddIHRoZW4gJ2dtJyBlbHNlICcnXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKiN7ZWNsfSg/OiN7ZWR9KSpcXFxcc3swLCN7QHBhZH19XCIsIGZsYWcpXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXFxcXHMqKD86I3tlZH0pKiN7ZWNyfVxcXFxzKiRcIiwgZmxhZylcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmUxLCcnKS5yZXBsYWNlKHJlMiwnJylcbiAgIFxuICAiLCJpbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIEFycmF5SGVscGVyXG59IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhaXJcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9QYWlyJztcblxuZXhwb3J0IHZhciBCb3hIZWxwZXIgPSBjbGFzcyBCb3hIZWxwZXIge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIga2V5LCByZWYsIHZhbDtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBkZWNvOiB0aGlzLmNvbnRleHQuY29kZXdhdmUuZGVjbyxcbiAgICAgIHBhZDogMixcbiAgICAgIHdpZHRoOiA1MCxcbiAgICAgIGhlaWdodDogMyxcbiAgICAgIG9wZW5UZXh0OiAnJyxcbiAgICAgIGNsb3NlVGV4dDogJycsXG4gICAgICBwcmVmaXg6ICcnLFxuICAgICAgc3VmZml4OiAnJyxcbiAgICAgIGluZGVudDogMFxuICAgIH07XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9uZSh0ZXh0KSB7XG4gICAgdmFyIGtleSwgb3B0LCByZWYsIHZhbDtcbiAgICBvcHQgPSB7fTtcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0LCBvcHQpO1xuICB9XG5cbiAgZHJhdyh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRTZXAoKSArIFwiXFxuXCIgKyB0aGlzLmxpbmVzKHRleHQpICsgXCJcXG5cIiArIHRoaXMuZW5kU2VwKCk7XG4gIH1cblxuICB3cmFwQ29tbWVudChzdHIpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50KHN0cik7XG4gIH1cblxuICBzZXBhcmF0b3IoKSB7XG4gICAgdmFyIGxlbjtcbiAgICBsZW4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMud3JhcENvbW1lbnQodGhpcy5kZWNvTGluZShsZW4pKTtcbiAgfVxuXG4gIHN0YXJ0U2VwKCkge1xuICAgIHZhciBsbjtcbiAgICBsbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aCAtIHRoaXMub3BlblRleHQubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMud3JhcENvbW1lbnQodGhpcy5vcGVuVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKTtcbiAgfVxuXG4gIGVuZFNlcCgpIHtcbiAgICB2YXIgbG47XG4gICAgbG4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGggLSB0aGlzLmNsb3NlVGV4dC5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMud3JhcENvbW1lbnQodGhpcy5jbG9zZVRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSkgKyB0aGlzLnN1ZmZpeDtcbiAgfVxuXG4gIGRlY29MaW5lKGxlbikge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgodGhpcy5kZWNvLCBsZW4pO1xuICB9XG5cbiAgcGFkZGluZygpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLnBhZCk7XG4gIH1cblxuICBsaW5lcyh0ZXh0ID0gJycsIHVwdG9IZWlnaHQgPSB0cnVlKSB7XG4gICAgdmFyIGwsIGxpbmVzLCB4O1xuICAgIHRleHQgPSB0ZXh0IHx8ICcnO1xuICAgIGxpbmVzID0gdGV4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpO1xuICAgIGlmICh1cHRvSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gKChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGksIHJlZiwgcmVzdWx0cztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKHggPSBpID0gMCwgcmVmID0gdGhpcy5oZWlnaHQ7ICgwIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWYpOyB4ID0gMCA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5saW5lKGxpbmVzW3hdIHx8ICcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLCBsZW4xLCByZXN1bHRzO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbjEgPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW4xOyBpKyspIHtcbiAgICAgICAgICBsID0gbGluZXNbaV07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKTtcbiAgICB9XG4gIH1cblxuICBsaW5lKHRleHQgPSAnJykge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMuaW5kZW50KSArIHRoaXMud3JhcENvbW1lbnQodGhpcy5kZWNvICsgdGhpcy5wYWRkaW5nKCkgKyB0ZXh0ICsgU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLndpZHRoIC0gdGhpcy5yZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KS5sZW5ndGgpICsgdGhpcy5wYWRkaW5nKCkgKyB0aGlzLmRlY28pO1xuICB9XG5cbiAgbGVmdCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28gKyB0aGlzLnBhZGRpbmcoKSk7XG4gIH1cblxuICByaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQodGhpcy5wYWRkaW5nKCkgKyB0aGlzLmRlY28pO1xuICB9XG5cbiAgcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQuY29kZXdhdmUucmVtb3ZlTWFya2Vycyh0aGlzLmNvbnRleHQuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHRleHQpKTtcbiAgfVxuXG4gIHRleHRCb3VuZHModGV4dCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0VHh0U2l6ZSh0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpKTtcbiAgfVxuXG4gIGdldEJveEZvclBvcyhwb3MpIHtcbiAgICB2YXIgY2xvbmUsIGN1ckxlZnQsIGRlcHRoLCBlbmRGaW5kLCBsZWZ0LCBwYWlyLCBwbGFjZWhvbGRlciwgcmVzLCBzdGFydEZpbmQ7XG4gICAgZGVwdGggPSB0aGlzLmdldE5lc3RlZEx2bChwb3Muc3RhcnQpO1xuICAgIGlmIChkZXB0aCA+IDApIHtcbiAgICAgIGxlZnQgPSB0aGlzLmxlZnQoKTtcbiAgICAgIGN1ckxlZnQgPSBTdHJpbmdIZWxwZXIucmVwZWF0KGxlZnQsIGRlcHRoIC0gMSk7XG4gICAgICBjbG9uZSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiO1xuICAgICAgY2xvbmUud2lkdGggPSBwbGFjZWhvbGRlci5sZW5ndGg7XG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IHRoaXMuZGVjbyArIHRoaXMuZGVjbyArIHBsYWNlaG9sZGVyICsgdGhpcy5kZWNvICsgdGhpcy5kZWNvO1xuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKTtcbiAgICAgIGVuZEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuZW5kU2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKTtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcihzdGFydEZpbmQsIGVuZEZpbmQsIHtcbiAgICAgICAgdmFsaWRNYXRjaDogKG1hdGNoKSA9PiB7XG4gICAgICAgICAgdmFyIGY7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2cobWF0Y2gsbGVmdClcbiAgICAgICAgICBmID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KG1hdGNoLnN0YXJ0KCksIFtsZWZ0LCBcIlxcblwiLCBcIlxcclwiXSwgLTEpO1xuICAgICAgICAgIHJldHVybiAoZiA9PSBudWxsKSB8fCBmLnN0ciAhPT0gbGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXMgPSBwYWlyLndyYXBwZXJQb3MocG9zLCB0aGlzLmNvbnRleHQuY29kZXdhdmUuZWRpdG9yLnRleHQoKSk7XG4gICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgcmVzLnN0YXJ0ICs9IGN1ckxlZnQubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE5lc3RlZEx2bChpbmRleCkge1xuICAgIHZhciBkZXB0aCwgZiwgbGVmdDtcbiAgICBkZXB0aCA9IDA7XG4gICAgbGVmdCA9IHRoaXMubGVmdCgpO1xuICAgIHdoaWxlICgoKGYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQoaW5kZXgsIFtsZWZ0LCBcIlxcblwiLCBcIlxcclwiXSwgLTEpKSAhPSBudWxsKSAmJiBmLnN0ciA9PT0gbGVmdCkge1xuICAgICAgaW5kZXggPSBmLnBvcztcbiAgICAgIGRlcHRoKys7XG4gICAgfVxuICAgIHJldHVybiBkZXB0aDtcbiAgfVxuXG4gIGdldE9wdEZyb21MaW5lKGxpbmUsIGdldFBhZCA9IHRydWUpIHtcbiAgICB2YXIgZW5kUG9zLCByRW5kLCByU3RhcnQsIHJlc0VuZCwgcmVzU3RhcnQsIHN0YXJ0UG9zO1xuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28pKSArIFwiKShcXFxccyopXCIpO1xuICAgIHJFbmQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMuZGVjbykpICsgXCIpKFxcbnwkKVwiKTtcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpO1xuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKTtcbiAgICBpZiAoKHJlc1N0YXJ0ICE9IG51bGwpICYmIChyZXNFbmQgIT0gbnVsbCkpIHtcbiAgICAgIGlmIChnZXRQYWQpIHtcbiAgICAgICAgdGhpcy5wYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgsIHJlc0VuZFsxXS5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGg7XG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgdGhpcy5wYWQ7XG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gdGhpcy5wYWQ7XG4gICAgICB0aGlzLndpZHRoID0gZW5kUG9zIC0gc3RhcnRQb3M7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVmb3JtYXRMaW5lcyh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5saW5lcyh0aGlzLnJlbW92ZUNvbW1lbnQodGV4dCwgb3B0aW9ucyksIGZhbHNlKTtcbiAgfVxuXG4gIHJlbW92ZUNvbW1lbnQodGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzLCBlY2wsIGVjciwgZWQsIGZsYWcsIG9wdCwgcmUxLCByZTI7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIG11bHRpbGluZTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCgpKTtcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSk7XG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5kZWNvKTtcbiAgICAgIGZsYWcgPSBvcHRpb25zWydtdWx0aWxpbmUnXSA/ICdnbScgOiAnJztcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHN7MCwke3RoaXMucGFkfX1gLCBmbGFnKTtcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoYFxcXFxzKig/OiR7ZWR9KSoke2Vjcn1cXFxccyokYCwgZmxhZyk7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlMSwgJycpLnJlcGxhY2UocmUyLCAnJyk7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3NDb2xsZWN0aW9uIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBvcHRpb25hbFByb21pc2UgfSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IGNsYXNzIENsb3NpbmdQcm9tcFxuICBjb25zdHJ1Y3RvcjogKEBjb2Rld2F2ZSxzZWxlY3Rpb25zKSAtPlxuICAgIEB0aW1lb3V0ID0gbnVsbFxuICAgIEBfdHlwZWQgPSBudWxsXG4gICAgQHN0YXJ0ZWQgPSBmYWxzZVxuICAgIEBuYkNoYW5nZXMgPSAwXG4gICAgQHNlbGVjdGlvbnMgPSBuZXcgUG9zQ29sbGVjdGlvbihzZWxlY3Rpb25zKVxuICBiZWdpbjogLT5cbiAgICBAc3RhcnRlZCA9IHRydWVcbiAgICBvcHRpb25hbFByb21pc2UoQGFkZENhcnJldHMoKSkudGhlbiA9PlxuICAgICAgaWYgQGNvZGV3YXZlLmVkaXRvci5jYW5MaXN0ZW5Ub0NoYW5nZSgpXG4gICAgICAgIEBwcm94eU9uQ2hhbmdlID0gKGNoPW51bGwpPT4gQG9uQ2hhbmdlKGNoKVxuICAgICAgICBAY29kZXdhdmUuZWRpdG9yLmFkZENoYW5nZUxpc3RlbmVyKCBAcHJveHlPbkNoYW5nZSApXG4gICAgICByZXR1cm4gdGhpc1xuICAgIC5yZXN1bHQoKVxuICBhZGRDYXJyZXRzOiAtPlxuICAgIEByZXBsYWNlbWVudHMgPSBAc2VsZWN0aW9ucy53cmFwKFxuICAgICAgQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2FycmV0Q2hhciArIEBjb2Rld2F2ZS5icmFrZXRzICsgXCJcXG5cIixcbiAgICAgIFwiXFxuXCIgKyBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY29kZXdhdmUuY2FycmV0Q2hhciArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgKS5tYXAoIChwKSAtPiBwLmNhcnJldFRvU2VsKCkgKVxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoQHJlcGxhY2VtZW50cylcbiAgaW52YWxpZFR5cGVkOiAtPlxuICAgIEBfdHlwZWQgPSBudWxsXG4gIG9uQ2hhbmdlOiAoY2ggPSBudWxsKS0+XG4gICAgQGludmFsaWRUeXBlZCgpXG4gICAgaWYgQHNraXBFdmVudChjaClcbiAgICAgIHJldHVyblxuICAgIEBuYkNoYW5nZXMrK1xuICAgIGlmIEBzaG91bGRTdG9wKClcbiAgICAgIEBzdG9wKClcbiAgICAgIEBjbGVhbkNsb3NlKClcbiAgICBlbHNlXG4gICAgICBAcmVzdW1lKClcbiAgICAgIFxuICBza2lwRXZlbnQ6IChjaCkgLT5cbiAgICByZXR1cm4gY2g/IGFuZCBjaC5jaGFyQ29kZUF0KDApICE9IDMyXG4gIFxuICByZXN1bWU6IC0+XG4gICAgI1xuICAgIFxuICBzaG91bGRTdG9wOiAtPlxuICAgIHJldHVybiBAdHlwZWQoKSA9PSBmYWxzZSBvciBAdHlwZWQoKS5pbmRleE9mKCcgJykgIT0gLTFcbiAgXG4gIGNsZWFuQ2xvc2U6IC0+XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzZWxlY3Rpb25zID0gQGdldFNlbGVjdGlvbnMoKVxuICAgIGZvciBzZWwgaW4gc2VsZWN0aW9uc1xuICAgICAgaWYgcG9zID0gQHdoaXRoaW5PcGVuQm91bmRzKHNlbClcbiAgICAgICAgc3RhcnQgPSBzZWxcbiAgICAgIGVsc2UgaWYgKGVuZCA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgYW5kIHN0YXJ0P1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS5pbm5lclRleHQoKS5zcGxpdCgnICcpWzBdXG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoZW5kLmlubmVyU3RhcnQsZW5kLmlubmVyRW5kLHJlcylcbiAgICAgICAgcmVwbC5zZWxlY3Rpb25zID0gW3N0YXJ0XVxuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgZ2V0U2VsZWN0aW9uczogLT5cbiAgICByZXR1cm4gQGNvZGV3YXZlLmVkaXRvci5nZXRNdWx0aVNlbCgpXG4gIHN0b3A6IC0+XG4gICAgQHN0YXJ0ZWQgPSBmYWxzZVxuICAgIGNsZWFyVGltZW91dChAdGltZW91dCkgaWYgQHRpbWVvdXQ/XG4gICAgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGwgaWYgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9PSB0aGlzXG4gICAgaWYgQHByb3h5T25DaGFuZ2U/XG4gICAgICBAY29kZXdhdmUuZWRpdG9yLnJlbW92ZUNoYW5nZUxpc3RlbmVyKEBwcm94eU9uQ2hhbmdlKVxuICBjYW5jZWw6IC0+XG4gICAgaWYgQHR5cGVkKCkgIT0gZmFsc2VcbiAgICAgIEBjYW5jZWxTZWxlY3Rpb25zKEBnZXRTZWxlY3Rpb25zKCkpXG4gICAgQHN0b3AoKVxuICBjYW5jZWxTZWxlY3Rpb25zOiAoc2VsZWN0aW9ucykgLT5cbiAgICByZXBsYWNlbWVudHMgPSBbXVxuICAgIHN0YXJ0ID0gbnVsbFxuICAgIGZvciBzZWwgaW4gc2VsZWN0aW9uc1xuICAgICAgaWYgcG9zID0gQHdoaXRoaW5PcGVuQm91bmRzKHNlbClcbiAgICAgICAgc3RhcnQgPSBwb3NcbiAgICAgIGVsc2UgaWYgKGVuZCA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgYW5kIHN0YXJ0P1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXcgUmVwbGFjZW1lbnQoc3RhcnQuc3RhcnQsZW5kLmVuZCxAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoc3RhcnQuZW5kKzEsIGVuZC5zdGFydC0xKSkuc2VsZWN0Q29udGVudCgpKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgdHlwZWQ6IC0+XG4gICAgdW5sZXNzIEBfdHlwZWQ/XG4gICAgICBjcG9zID0gQGNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKVxuICAgICAgaW5uZXJTdGFydCA9IEByZXBsYWNlbWVudHNbMF0uc3RhcnQgKyBAY29kZXdhdmUuYnJha2V0cy5sZW5ndGhcbiAgICAgIGlmIEBjb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PSBAcmVwbGFjZW1lbnRzWzBdLnN0YXJ0IGFuZCAoaW5uZXJFbmQgPSBAY29kZXdhdmUuZmluZE5leHRCcmFrZXQoaW5uZXJTdGFydCkpPyBhbmQgaW5uZXJFbmQgPj0gY3Bvcy5lbmRcbiAgICAgICAgQF90eXBlZCA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihpbm5lclN0YXJ0LCBpbm5lckVuZClcbiAgICAgIGVsc2VcbiAgICAgICAgQF90eXBlZCA9IGZhbHNlXG4gICAgcmV0dXJuIEBfdHlwZWRcbiAgd2hpdGhpbk9wZW5Cb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQHN0YXJ0UG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09IHRhcmdldFRleHRcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuICB3aGl0aGluQ2xvc2VCb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQGVuZFBvc0F0KGkpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT0gdGFyZ2V0VGV4dFxuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG4gIHN0YXJ0UG9zQXQ6IChpbmRleCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5zdGFydCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyKSxcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5lbmQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMSlcbiAgICAgICkud3JhcHBlZEJ5KEBjb2Rld2F2ZS5icmFrZXRzLCBAY29kZXdhdmUuYnJha2V0cylcbiAgZW5kUG9zQXQ6IChpbmRleCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5zdGFydCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsxKSxcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5lbmQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMilcbiAgICAgICkud3JhcHBlZEJ5KEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciwgQGNvZGV3YXZlLmJyYWtldHMpXG5cbmV4cG9ydCBjbGFzcyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgZXh0ZW5kcyBDbG9zaW5nUHJvbXBcbiAgcmVzdW1lOiAtPlxuICAgIEBzaW11bGF0ZVR5cGUoKVxuICBzaW11bGF0ZVR5cGU6IC0+XG4gICAgY2xlYXJUaW1lb3V0KEB0aW1lb3V0KSBpZiBAdGltZW91dD9cbiAgICBAdGltZW91dCA9IHNldFRpbWVvdXQgKD0+XG4gICAgICBAaW52YWxpZFR5cGVkKClcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBjdXJDbG9zZSA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoQHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdLmNvcHkoKS5hcHBseU9mZnNldChAdHlwZWQoKS5sZW5ndGgpKVxuICAgICAgaWYgY3VyQ2xvc2VcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChjdXJDbG9zZS5zdGFydCxjdXJDbG9zZS5lbmQsdGFyZ2V0VGV4dClcbiAgICAgICAgaWYgcmVwbC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLm5lY2Vzc2FyeSgpXG4gICAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pXG4gICAgICBlbHNlXG4gICAgICAgIEBzdG9wKClcbiAgICAgIEBvblR5cGVTaW11bGF0ZWQoKSBpZiBAb25UeXBlU2ltdWxhdGVkP1xuICAgICksIDJcbiAgc2tpcEV2ZW50OiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBnZXRTZWxlY3Rpb25zOiAtPlxuICAgIHJldHVybiBbXG4gICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKClcbiAgICAgICAgQHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdICsgQHR5cGVkKCkubGVuZ3RoXG4gICAgICBdXG4gIHdoaXRoaW5DbG9zZUJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAZW5kUG9zQXQoaSlcbiAgICAgIG5leHQgPSBAY29kZXdhdmUuZmluZE5leHRCcmFrZXQodGFyZ2V0UG9zLmlubmVyU3RhcnQpXG4gICAgICBpZiBuZXh0P1xuICAgICAgICB0YXJnZXRQb3MubW92ZVN1ZmZpeChuZXh0KVxuICAgICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuXG5DbG9zaW5nUHJvbXAubmV3Rm9yID0gKGNvZGV3YXZlLHNlbGVjdGlvbnMpIC0+XG4gIGlmIGNvZGV3YXZlLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICByZXR1cm4gbmV3IENsb3NpbmdQcm9tcChjb2Rld2F2ZSxzZWxlY3Rpb25zKVxuICBlbHNlXG4gICAgcmV0dXJuIG5ldyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAoY29kZXdhdmUsc2VsZWN0aW9ucykiLCJpbXBvcnQge1xuICBQb3NDb2xsZWN0aW9uXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5pbXBvcnQge1xuICBvcHRpb25hbFByb21pc2Vcbn0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCB2YXIgQ2xvc2luZ1Byb21wID0gY2xhc3MgQ2xvc2luZ1Byb21wIHtcbiAgY29uc3RydWN0b3IoY29kZXdhdmUxLCBzZWxlY3Rpb25zKSB7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlMTtcbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuX3R5cGVkID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLm5iQ2hhbmdlcyA9IDA7XG4gICAgdGhpcy5zZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucyk7XG4gIH1cblxuICBiZWdpbigpIHtcbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgIHJldHVybiBvcHRpb25hbFByb21pc2UodGhpcy5hZGRDYXJyZXRzKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuZWRpdG9yLmNhbkxpc3RlblRvQ2hhbmdlKCkpIHtcbiAgICAgICAgdGhpcy5wcm94eU9uQ2hhbmdlID0gKGNoID0gbnVsbCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQ2hhbmdlKGNoKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5wcm94eU9uQ2hhbmdlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pLnJlc3VsdCgpO1xuICB9XG5cbiAgYWRkQ2FycmV0cygpIHtcbiAgICB0aGlzLnJlcGxhY2VtZW50cyA9IHRoaXMuc2VsZWN0aW9ucy53cmFwKHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2FycmV0Q2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cyArIFwiXFxuXCIsIFwiXFxuXCIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY29kZXdhdmUuY2FycmV0Q2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cykubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBwLmNhcnJldFRvU2VsKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHRoaXMucmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIGludmFsaWRUeXBlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZWQgPSBudWxsO1xuICB9XG5cbiAgb25DaGFuZ2UoY2ggPSBudWxsKSB7XG4gICAgdGhpcy5pbnZhbGlkVHlwZWQoKTtcbiAgICBpZiAodGhpcy5za2lwRXZlbnQoY2gpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubmJDaGFuZ2VzKys7XG4gICAgaWYgKHRoaXMuc2hvdWxkU3RvcCgpKSB7XG4gICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIHJldHVybiB0aGlzLmNsZWFuQ2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdW1lKCk7XG4gICAgfVxuICB9XG5cbiAgc2tpcEV2ZW50KGNoKSB7XG4gICAgcmV0dXJuIChjaCAhPSBudWxsKSAmJiBjaC5jaGFyQ29kZUF0KDApICE9PSAzMjtcbiAgfVxuXG4gIHJlc3VtZSgpIHt9XG5cbiAgXG4gIHNob3VsZFN0b3AoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZWQoKSA9PT0gZmFsc2UgfHwgdGhpcy50eXBlZCgpLmluZGV4T2YoJyAnKSAhPT0gLTE7XG4gIH1cblxuICBjbGVhbkNsb3NlKCkge1xuICAgIHZhciBlbmQsIGosIGxlbiwgcG9zLCByZXBsLCByZXBsYWNlbWVudHMsIHJlcywgc2VsLCBzZWxlY3Rpb25zLCBzdGFydDtcbiAgICByZXBsYWNlbWVudHMgPSBbXTtcbiAgICBzZWxlY3Rpb25zID0gdGhpcy5nZXRTZWxlY3Rpb25zKCk7XG4gICAgZm9yIChqID0gMCwgbGVuID0gc2VsZWN0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgc2VsID0gc2VsZWN0aW9uc1tqXTtcbiAgICAgIGlmIChwb3MgPSB0aGlzLndoaXRoaW5PcGVuQm91bmRzKHNlbCkpIHtcbiAgICAgICAgc3RhcnQgPSBzZWw7XG4gICAgICB9IGVsc2UgaWYgKChlbmQgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSAmJiAoc3RhcnQgIT0gbnVsbCkpIHtcbiAgICAgICAgcmVzID0gZW5kLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLmlubmVyVGV4dCgpLnNwbGl0KCcgJylbMF07XG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoZW5kLmlubmVyU3RhcnQsIGVuZC5pbm5lckVuZCwgcmVzKTtcbiAgICAgICAgcmVwbC5zZWxlY3Rpb25zID0gW3N0YXJ0XTtcbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gocmVwbCk7XG4gICAgICAgIHN0YXJ0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxuICBnZXRTZWxlY3Rpb25zKCkge1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRNdWx0aVNlbCgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPT09IHRoaXMpIHtcbiAgICAgIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJveHlPbkNoYW5nZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5wcm94eU9uQ2hhbmdlKTtcbiAgICB9XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMudHlwZWQoKSAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuY2FuY2VsU2VsZWN0aW9ucyh0aGlzLmdldFNlbGVjdGlvbnMoKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0b3AoKTtcbiAgfVxuXG4gIGNhbmNlbFNlbGVjdGlvbnMoc2VsZWN0aW9ucykge1xuICAgIHZhciBlbmQsIGosIGxlbiwgcG9zLCByZXBsYWNlbWVudHMsIHNlbCwgc3RhcnQ7XG4gICAgcmVwbGFjZW1lbnRzID0gW107XG4gICAgc3RhcnQgPSBudWxsO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNlbGVjdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNlbCA9IHNlbGVjdGlvbnNbal07XG4gICAgICBpZiAocG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpKSB7XG4gICAgICAgIHN0YXJ0ID0gcG9zO1xuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgKHN0YXJ0ICE9IG51bGwpKSB7XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ldyBSZXBsYWNlbWVudChzdGFydC5zdGFydCwgZW5kLmVuZCwgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihzdGFydC5lbmQgKyAxLCBlbmQuc3RhcnQgLSAxKSkuc2VsZWN0Q29udGVudCgpKTtcbiAgICAgICAgc3RhcnQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIHR5cGVkKCkge1xuICAgIHZhciBjcG9zLCBpbm5lckVuZCwgaW5uZXJTdGFydDtcbiAgICBpZiAodGhpcy5fdHlwZWQgPT0gbnVsbCkge1xuICAgICAgY3BvcyA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpO1xuICAgICAgaW5uZXJTdGFydCA9IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aDtcbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmZpbmRQcmV2QnJha2V0KGNwb3Muc3RhcnQpID09PSB0aGlzLnJlcGxhY2VtZW50c1swXS5zdGFydCAmJiAoKGlubmVyRW5kID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChpbm5lclN0YXJ0KSkgIT0gbnVsbCkgJiYgaW5uZXJFbmQgPj0gY3Bvcy5lbmQpIHtcbiAgICAgICAgdGhpcy5fdHlwZWQgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGlubmVyU3RhcnQsIGlubmVyRW5kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3R5cGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90eXBlZDtcbiAgfVxuXG4gIHdoaXRoaW5PcGVuQm91bmRzKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIHJlZiwgcmVwbCwgdGFyZ2V0UG9zLCB0YXJnZXRUZXh0O1xuICAgIHJlZiA9IHRoaXMucmVwbGFjZW1lbnRzO1xuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5zdGFydFBvc0F0KGkpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT09IHRhcmdldFRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvcztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgd2hpdGhpbkNsb3NlQm91bmRzKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIHJlZiwgcmVwbCwgdGFyZ2V0UG9zLCB0YXJnZXRUZXh0O1xuICAgIHJlZiA9IHRoaXMucmVwbGFjZW1lbnRzO1xuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5lbmRQb3NBdChpKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT09IHRhcmdldFRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvcztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhcnRQb3NBdChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLnN0YXJ0ICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIpLCB0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5lbmQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDEpKS53cmFwcGVkQnkodGhpcy5jb2Rld2F2ZS5icmFrZXRzLCB0aGlzLmNvZGV3YXZlLmJyYWtldHMpO1xuICB9XG5cbiAgZW5kUG9zQXQoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5zdGFydCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMikpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciwgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKTtcbiAgfVxuXG59O1xuXG5leHBvcnQgdmFyIFNpbXVsYXRlZENsb3NpbmdQcm9tcCA9IGNsYXNzIFNpbXVsYXRlZENsb3NpbmdQcm9tcCBleHRlbmRzIENsb3NpbmdQcm9tcCB7XG4gIHJlc3VtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaW11bGF0ZVR5cGUoKTtcbiAgfVxuXG4gIHNpbXVsYXRlVHlwZSgpIHtcbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKCkgPT4ge1xuICAgICAgdmFyIGN1ckNsb3NlLCByZXBsLCB0YXJnZXRUZXh0O1xuICAgICAgdGhpcy5pbnZhbGlkVHlwZWQoKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIGN1ckNsb3NlID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHModGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXS5jb3B5KCkuYXBwbHlPZmZzZXQodGhpcy50eXBlZCgpLmxlbmd0aCkpO1xuICAgICAgaWYgKGN1ckNsb3NlKSB7XG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoY3VyQ2xvc2Uuc3RhcnQsIGN1ckNsb3NlLmVuZCwgdGFyZ2V0VGV4dCk7XG4gICAgICAgIGlmIChyZXBsLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLm5lY2Vzc2FyeSgpKSB7XG4gICAgICAgICAgdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoW3JlcGxdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vblR5cGVTaW11bGF0ZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vblR5cGVTaW11bGF0ZWQoKTtcbiAgICAgIH1cbiAgICB9KSwgMik7XG4gIH1cblxuICBza2lwRXZlbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucygpIHtcbiAgICByZXR1cm4gW3RoaXMuY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpLCB0aGlzLnJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdICsgdGhpcy50eXBlZCgpLmxlbmd0aF07XG4gIH1cblxuICB3aGl0aGluQ2xvc2VCb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV4dCwgcmVmLCByZXBsLCB0YXJnZXRQb3M7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV07XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLmVuZFBvc0F0KGkpO1xuICAgICAgbmV4dCA9IHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQodGFyZ2V0UG9zLmlubmVyU3RhcnQpO1xuICAgICAgaWYgKG5leHQgIT0gbnVsbCkge1xuICAgICAgICB0YXJnZXRQb3MubW92ZVN1ZmZpeChuZXh0KTtcbiAgICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG59O1xuXG5DbG9zaW5nUHJvbXAubmV3Rm9yID0gZnVuY3Rpb24oY29kZXdhdmUsIHNlbGVjdGlvbnMpIHtcbiAgaWYgKGNvZGV3YXZlLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICByZXR1cm4gbmV3IENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAoY29kZXdhdmUsIHNlbGVjdGlvbnMpO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgQ21kRmluZGVyXG4gIGNvbnN0cnVjdG9yOiAobmFtZXMsIG9wdGlvbnMpIC0+XG4gICAgaWYgdHlwZW9mIG5hbWVzID09ICdzdHJpbmcnXG4gICAgICBuYW1lcyA9IFtuYW1lc11cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIHBhcmVudDogbnVsbFxuICAgICAgbmFtZXNwYWNlczogW11cbiAgICAgIHBhcmVudENvbnRleHQ6IG51bGxcbiAgICAgIGNvbnRleHQ6IG51bGxcbiAgICAgIHJvb3Q6IENvbW1hbmQuY21kc1xuICAgICAgbXVzdEV4ZWN1dGU6IHRydWVcbiAgICAgIHVzZURldGVjdG9yczogdHJ1ZVxuICAgICAgdXNlRmFsbGJhY2tzOiB0cnVlXG4gICAgICBpbnN0YW5jZTogbnVsbFxuICAgICAgY29kZXdhdmU6IG51bGxcbiAgICB9XG4gICAgQG5hbWVzID0gbmFtZXNcbiAgICBAcGFyZW50ID0gb3B0aW9uc1sncGFyZW50J11cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZSBpZiBAcGFyZW50PyBhbmQga2V5ICE9ICdwYXJlbnQnXG4gICAgICAgIHRoaXNba2V5XSA9IEBwYXJlbnRba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICB1bmxlc3MgQGNvbnRleHQ/XG4gICAgICBAY29udGV4dCA9IG5ldyBDb250ZXh0KEBjb2Rld2F2ZSlcbiAgICBpZiBAcGFyZW50Q29udGV4dD9cbiAgICAgIEBjb250ZXh0LnBhcmVudCA9IEBwYXJlbnRDb250ZXh0XG4gICAgaWYgQG5hbWVzcGFjZXM/XG4gICAgICBAY29udGV4dC5hZGROYW1lc3BhY2VzKEBuYW1lc3BhY2VzKVxuICBmaW5kOiAtPlxuICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiAgICBAY21kID0gQGZpbmRJbihAcm9vdClcbiAgICByZXR1cm4gQGNtZFxuIyAgZ2V0UG9zaWJpbGl0aWVzOiAtPlxuIyAgICBAdHJpZ2dlckRldGVjdG9ycygpXG4jICAgIHBhdGggPSBsaXN0KEBwYXRoKVxuIyAgICByZXR1cm4gQGZpbmRQb3NpYmlsaXRpZXNJbihAcm9vdCxwYXRoKVxuICBnZXROYW1lc1dpdGhQYXRoczogLT5cbiAgICBwYXRocyA9IHt9XG4gICAgZm9yIG5hbWUgaW4gQG5hbWVzIFxuICAgICAgW3NwYWNlLHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSlcbiAgICAgIGlmIHNwYWNlPyBhbmQgIShzcGFjZSBpbiBAY29udGV4dC5nZXROYW1lU3BhY2VzKCkpXG4gICAgICAgIHVubGVzcyBzcGFjZSBvZiBwYXRocyBcbiAgICAgICAgICBwYXRoc1tzcGFjZV0gPSBbXVxuICAgICAgICBwYXRoc1tzcGFjZV0ucHVzaChyZXN0KVxuICAgIHJldHVybiBwYXRoc1xuICBhcHBseVNwYWNlT25OYW1lczogKG5hbWVzcGFjZSkgLT5cbiAgICBbc3BhY2UscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lc3BhY2UsdHJ1ZSlcbiAgICBAbmFtZXMubWFwKCAobmFtZSkgLT5cbiAgICAgIFtjdXJfc3BhY2UsY3VyX3Jlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSlcbiAgICAgIGlmIGN1cl9zcGFjZT8gYW5kIGN1cl9zcGFjZSA9PSBzcGFjZVxuICAgICAgICBuYW1lID0gY3VyX3Jlc3RcbiAgICAgIGlmIHJlc3Q/XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZVxuICAgICAgcmV0dXJuIG5hbWVcbiAgICApXG4gIGdldERpcmVjdE5hbWVzOiAtPlxuICAgIHJldHVybiAobiBmb3IgbiBpbiBAbmFtZXMgd2hlbiBuLmluZGV4T2YoXCI6XCIpID09IC0xKVxuICB0cmlnZ2VyRGV0ZWN0b3JzOiAtPlxuICAgIGlmIEB1c2VEZXRlY3RvcnMgXG4gICAgICBAdXNlRGV0ZWN0b3JzID0gZmFsc2VcbiAgICAgIHBvc2liaWxpdGllcyA9IG5ldyBDbWRGaW5kZXIoQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCB7cGFyZW50OiB0aGlzLCBtdXN0RXhlY3V0ZTogZmFsc2UsIHVzZUZhbGxiYWNrczogZmFsc2V9KS5maW5kUG9zaWJpbGl0aWVzKClcbiAgICAgIGkgPSAwXG4gICAgICB3aGlsZSBpIDwgcG9zaWJpbGl0aWVzLmxlbmd0aFxuICAgICAgICBjbWQgPSBwb3NpYmlsaXRpZXNbaV1cbiAgICAgICAgZm9yIGRldGVjdG9yIGluIGNtZC5kZXRlY3RvcnMgXG4gICAgICAgICAgcmVzID0gZGV0ZWN0b3IuZGV0ZWN0KHRoaXMpXG4gICAgICAgICAgaWYgcmVzP1xuICAgICAgICAgICAgQGNvbnRleHQuYWRkTmFtZXNwYWNlcyhyZXMpXG4gICAgICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIocmVzLCB7cGFyZW50OiB0aGlzLCBtdXN0RXhlY3V0ZTogZmFsc2UsIHVzZUZhbGxiYWNrczogZmFsc2V9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgICAgIGkrK1xuICBmaW5kSW46IChjbWQscGF0aCA9IG51bGwpIC0+XG4gICAgdW5sZXNzIGNtZD9cbiAgICAgIHJldHVybiBudWxsXG4gICAgYmVzdCA9IEBiZXN0SW5Qb3NpYmlsaXRpZXMoQGZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICBpZiBiZXN0P1xuICAgICAgcmV0dXJuIGJlc3RcbiAgZmluZFBvc2liaWxpdGllczogLT5cbiAgICB1bmxlc3MgQHJvb3Q/XG4gICAgICByZXR1cm4gW11cbiAgICBAcm9vdC5pbml0KClcbiAgICBwb3NpYmlsaXRpZXMgPSBbXVxuICAgIGlmIEBjb2Rld2F2ZT8uaW5JbnN0YW5jZT8uY21kID09IEByb290XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KEBnZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZCgnaW5faW5zdGFuY2UnKSlcbiAgICBmb3Igc3BhY2UsIG5hbWVzIG9mIEBnZXROYW1lc1dpdGhQYXRocygpXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KEBnZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChzcGFjZSwgbmFtZXMpKVxuICAgIGZvciBuc3BjIGluIEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKVxuICAgICAgW25zcGNOYW1lLHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobnNwYyx0cnVlKVxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChAZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQobnNwY05hbWUsIEBhcHBseVNwYWNlT25OYW1lcyhuc3BjKSkpXG4gICAgZm9yIG5hbWUgaW4gQGdldERpcmVjdE5hbWVzKClcbiAgICAgIGRpcmVjdCA9IEByb290LmdldENtZChuYW1lKVxuICAgICAgaWYgQGNtZElzVmFsaWQoZGlyZWN0KVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpXG4gICAgaWYgQHVzZUZhbGxiYWNrc1xuICAgICAgZmFsbGJhY2sgPSBAcm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJylcbiAgICAgIGlmIEBjbWRJc1ZhbGlkKGZhbGxiYWNrKVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjaylcbiAgICBAcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzXG4gICAgcmV0dXJuIHBvc2liaWxpdGllc1xuICBnZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZDogKGNtZE5hbWUsIG5hbWVzID0gQG5hbWVzKSAtPlxuICAgIHBvc2liaWxpdGllcyA9IFtdO1xuICAgIG5leHRzID0gQGdldENtZEZvbGxvd0FsaWFzKGNtZE5hbWUpXG4gICAgZm9yIG5leHQgaW4gbmV4dHNcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge3BhcmVudDogdGhpcywgcm9vdDogbmV4dH0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICBwb3NpYmlsaXRpZXNcbiAgZ2V0Q21kRm9sbG93QWxpYXM6IChuYW1lKSAtPlxuICAgIGNtZCA9IEByb290LmdldENtZChuYW1lKVxuICAgIGlmIGNtZD8gXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuYWxpYXNPZj9cbiAgICAgICAgcmV0dXJuIFtjbWQsY21kLmdldEFsaWFzZWQoKV1cbiAgICAgIHJldHVybiBbY21kXVxuICAgIHJldHVybiBbY21kXVxuICBjbWRJc1ZhbGlkOiAoY21kKSAtPlxuICAgIHVubGVzcyBjbWQ/XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBpZiBjbWQubmFtZSAhPSAnZmFsbGJhY2snICYmIGNtZCBpbiBAYW5jZXN0b3JzKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiAhQG11c3RFeGVjdXRlIG9yIEBjbWRJc0V4ZWN1dGFibGUoY21kKVxuICBhbmNlc3RvcnM6IC0+XG4gICAgaWYgQGNvZGV3YXZlPy5pbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBjb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKVxuICAgIHJldHVybiBbXVxuICBjbWRJc0V4ZWN1dGFibGU6IChjbWQpIC0+XG4gICAgbmFtZXMgPSBAZ2V0RGlyZWN0TmFtZXMoKVxuICAgIGlmIG5hbWVzLmxlbmd0aCA9PSAxXG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGVXaXRoTmFtZShuYW1lc1swXSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICBjbWRTY29yZTogKGNtZCkgLT5cbiAgICBzY29yZSA9IGNtZC5kZXB0aFxuICAgIGlmIGNtZC5uYW1lID09ICdmYWxsYmFjaycgXG4gICAgICAgIHNjb3JlIC09IDEwMDBcbiAgICByZXR1cm4gc2NvcmVcbiAgYmVzdEluUG9zaWJpbGl0aWVzOiAocG9zcykgLT5cbiAgICBpZiBwb3NzLmxlbmd0aCA+IDBcbiAgICAgIGJlc3QgPSBudWxsXG4gICAgICBiZXN0U2NvcmUgPSBudWxsXG4gICAgICBmb3IgcCBpbiBwb3NzXG4gICAgICAgIHNjb3JlID0gQGNtZFNjb3JlKHApXG4gICAgICAgIGlmICFiZXN0PyBvciBzY29yZSA+PSBiZXN0U2NvcmVcbiAgICAgICAgICBiZXN0U2NvcmUgPSBzY29yZVxuICAgICAgICAgIGJlc3QgPSBwXG4gICAgICByZXR1cm4gYmVzdDsiLCJ2YXIgaW5kZXhPZiA9IFtdLmluZGV4T2Y7XG5cbmltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgTmFtZXNwYWNlSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgQ21kRmluZGVyID0gY2xhc3MgQ21kRmluZGVyIHtcbiAgY29uc3RydWN0b3IobmFtZXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsO1xuICAgIGlmICh0eXBlb2YgbmFtZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lcyA9IFtuYW1lc107XG4gICAgfVxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgbmFtZXNwYWNlczogW10sXG4gICAgICBwYXJlbnRDb250ZXh0OiBudWxsLFxuICAgICAgY29udGV4dDogbnVsbCxcbiAgICAgIHJvb3Q6IENvbW1hbmQuY21kcyxcbiAgICAgIG11c3RFeGVjdXRlOiB0cnVlLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0cnVlLFxuICAgICAgdXNlRmFsbGJhY2tzOiB0cnVlLFxuICAgICAgaW5zdGFuY2U6IG51bGwsXG4gICAgICBjb2Rld2F2ZTogbnVsbFxuICAgIH07XG4gICAgdGhpcy5uYW1lcyA9IG5hbWVzO1xuICAgIHRoaXMucGFyZW50ID0gb3B0aW9uc1sncGFyZW50J107XG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIGlmICgodGhpcy5wYXJlbnQgIT0gbnVsbCkgJiYga2V5ICE9PSAncGFyZW50Jykge1xuICAgICAgICB0aGlzW2tleV0gPSB0aGlzLnBhcmVudFtrZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMuY29kZXdhdmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYXJlbnRDb250ZXh0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5wYXJlbnQgPSB0aGlzLnBhcmVudENvbnRleHQ7XG4gICAgfVxuICAgIGlmICh0aGlzLm5hbWVzcGFjZXMgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0LmFkZE5hbWVzcGFjZXModGhpcy5uYW1lc3BhY2VzKTtcbiAgICB9XG4gIH1cblxuICBmaW5kKCkge1xuICAgIHRoaXMudHJpZ2dlckRldGVjdG9ycygpO1xuICAgIHRoaXMuY21kID0gdGhpcy5maW5kSW4odGhpcy5yb290KTtcbiAgICByZXR1cm4gdGhpcy5jbWQ7XG4gIH1cblxuICAvLyAgZ2V0UG9zaWJpbGl0aWVzOiAtPlxuICAvLyAgICBAdHJpZ2dlckRldGVjdG9ycygpXG4gIC8vICAgIHBhdGggPSBsaXN0KEBwYXRoKVxuICAvLyAgICByZXR1cm4gQGZpbmRQb3NpYmlsaXRpZXNJbihAcm9vdCxwYXRoKVxuICBnZXROYW1lc1dpdGhQYXRocygpIHtcbiAgICB2YXIgaiwgbGVuLCBuYW1lLCBwYXRocywgcmVmLCByZXN0LCBzcGFjZTtcbiAgICBwYXRocyA9IHt9O1xuICAgIHJlZiA9IHRoaXMubmFtZXM7XG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuYW1lID0gcmVmW2pdO1xuICAgICAgW3NwYWNlLCByZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpO1xuICAgICAgaWYgKChzcGFjZSAhPSBudWxsKSAmJiAhKGluZGV4T2YuY2FsbCh0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCBzcGFjZSkgPj0gMCkpIHtcbiAgICAgICAgaWYgKCEoc3BhY2UgaW4gcGF0aHMpKSB7XG4gICAgICAgICAgcGF0aHNbc3BhY2VdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgcGF0aHNbc3BhY2VdLnB1c2gocmVzdCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXRocztcbiAgfVxuXG4gIGFwcGx5U3BhY2VPbk5hbWVzKG5hbWVzcGFjZSkge1xuICAgIHZhciByZXN0LCBzcGFjZTtcbiAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZXNwYWNlLCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcy5uYW1lcy5tYXAoZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGN1cl9yZXN0LCBjdXJfc3BhY2U7XG4gICAgICBbY3VyX3NwYWNlLCBjdXJfcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKTtcbiAgICAgIGlmICgoY3VyX3NwYWNlICE9IG51bGwpICYmIGN1cl9zcGFjZSA9PT0gc3BhY2UpIHtcbiAgICAgICAgbmFtZSA9IGN1cl9yZXN0O1xuICAgICAgfVxuICAgICAgaWYgKHJlc3QgIT0gbnVsbCkge1xuICAgICAgICBuYW1lID0gcmVzdCArICc6JyArIG5hbWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmFtZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldERpcmVjdE5hbWVzKCkge1xuICAgIHZhciBuO1xuICAgIHJldHVybiAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaiwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgICByZWYgPSB0aGlzLm5hbWVzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIG4gPSByZWZbal07XG4gICAgICAgIGlmIChuLmluZGV4T2YoXCI6XCIpID09PSAtMSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSkuY2FsbCh0aGlzKTtcbiAgfVxuXG4gIHRyaWdnZXJEZXRlY3RvcnMoKSB7XG4gICAgdmFyIGNtZCwgZGV0ZWN0b3IsIGksIGosIGxlbiwgcG9zaWJpbGl0aWVzLCByZWYsIHJlcywgcmVzdWx0cztcbiAgICBpZiAodGhpcy51c2VEZXRlY3RvcnMpIHtcbiAgICAgIHRoaXMudXNlRGV0ZWN0b3JzID0gZmFsc2U7XG4gICAgICBwb3NpYmlsaXRpZXMgPSBuZXcgQ21kRmluZGVyKHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHtcbiAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICBtdXN0RXhlY3V0ZTogZmFsc2UsXG4gICAgICAgIHVzZUZhbGxiYWNrczogZmFsc2VcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKTtcbiAgICAgIGkgPSAwO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgd2hpbGUgKGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoKSB7XG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXTtcbiAgICAgICAgcmVmID0gY21kLmRldGVjdG9ycztcbiAgICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgZGV0ZWN0b3IgPSByZWZbal07XG4gICAgICAgICAgcmVzID0gZGV0ZWN0b3IuZGV0ZWN0KHRoaXMpO1xuICAgICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmFkZE5hbWVzcGFjZXMocmVzKTtcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtcbiAgICAgICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgICAgICBtdXN0RXhlY3V0ZTogZmFsc2UsXG4gICAgICAgICAgICAgIHVzZUZhbGxiYWNrczogZmFsc2VcbiAgICAgICAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHMucHVzaChpKyspO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9XG5cbiAgZmluZEluKGNtZCwgcGF0aCA9IG51bGwpIHtcbiAgICB2YXIgYmVzdDtcbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBiZXN0ID0gdGhpcy5iZXN0SW5Qb3NpYmlsaXRpZXModGhpcy5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgIGlmIChiZXN0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBiZXN0O1xuICAgIH1cbiAgfVxuXG4gIGZpbmRQb3NpYmlsaXRpZXMoKSB7XG4gICAgdmFyIGRpcmVjdCwgZmFsbGJhY2ssIGosIGssIGxlbiwgbGVuMSwgbmFtZSwgbmFtZXMsIG5zcGMsIG5zcGNOYW1lLCBwb3NpYmlsaXRpZXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVzdCwgc3BhY2U7XG4gICAgaWYgKHRoaXMucm9vdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHRoaXMucm9vdC5pbml0KCk7XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG4gICAgaWYgKCgocmVmID0gdGhpcy5jb2Rld2F2ZSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmluSW5zdGFuY2UpICE9IG51bGwgPyByZWYxLmNtZCA6IHZvaWQgMCA6IHZvaWQgMCkgPT09IHRoaXMucm9vdCkge1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKCdpbl9pbnN0YW5jZScpKTtcbiAgICB9XG4gICAgcmVmMiA9IHRoaXMuZ2V0TmFtZXNXaXRoUGF0aHMoKTtcbiAgICBmb3IgKHNwYWNlIGluIHJlZjIpIHtcbiAgICAgIG5hbWVzID0gcmVmMltzcGFjZV07XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoc3BhY2UsIG5hbWVzKSk7XG4gICAgfVxuICAgIHJlZjMgPSB0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZjMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5zcGMgPSByZWYzW2pdO1xuICAgICAgW25zcGNOYW1lLCByZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsIHRydWUpO1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKG5zcGNOYW1lLCB0aGlzLmFwcGx5U3BhY2VPbk5hbWVzKG5zcGMpKSk7XG4gICAgfVxuICAgIHJlZjQgPSB0aGlzLmdldERpcmVjdE5hbWVzKCk7XG4gICAgZm9yIChrID0gMCwgbGVuMSA9IHJlZjQubGVuZ3RoOyBrIDwgbGVuMTsgaysrKSB7XG4gICAgICBuYW1lID0gcmVmNFtrXTtcbiAgICAgIGRpcmVjdCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSk7XG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGRpcmVjdCkpIHtcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZGlyZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMudXNlRmFsbGJhY2tzKSB7XG4gICAgICBmYWxsYmFjayA9IHRoaXMucm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJyk7XG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGZhbGxiYWNrKSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjayk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzO1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXM7XG4gIH1cblxuICBnZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChjbWROYW1lLCBuYW1lcyA9IHRoaXMubmFtZXMpIHtcbiAgICB2YXIgaiwgbGVuLCBuZXh0LCBuZXh0cywgcG9zaWJpbGl0aWVzO1xuICAgIHBvc2liaWxpdGllcyA9IFtdO1xuICAgIG5leHRzID0gdGhpcy5nZXRDbWRGb2xsb3dBbGlhcyhjbWROYW1lKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBuZXh0cy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmV4dCA9IG5leHRzW2pdO1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKG5hbWVzLCB7XG4gICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgcm9vdDogbmV4dFxuICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICB9XG4gICAgcmV0dXJuIHBvc2liaWxpdGllcztcbiAgfVxuXG4gIGdldENtZEZvbGxvd0FsaWFzKG5hbWUpIHtcbiAgICB2YXIgY21kO1xuICAgIGNtZCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSk7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtjbWQsIGNtZC5nZXRBbGlhc2VkKCldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtjbWRdO1xuICAgIH1cbiAgICByZXR1cm4gW2NtZF07XG4gIH1cblxuICBjbWRJc1ZhbGlkKGNtZCkge1xuICAgIGlmIChjbWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoY21kLm5hbWUgIT09ICdmYWxsYmFjaycgJiYgaW5kZXhPZi5jYWxsKHRoaXMuYW5jZXN0b3JzKCksIGNtZCkgPj0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gIXRoaXMubXVzdEV4ZWN1dGUgfHwgdGhpcy5jbWRJc0V4ZWN1dGFibGUoY21kKTtcbiAgfVxuXG4gIGFuY2VzdG9ycygpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyByZWYuaW5JbnN0YW5jZSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKCk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNtZElzRXhlY3V0YWJsZShjbWQpIHtcbiAgICB2YXIgbmFtZXM7XG4gICAgbmFtZXMgPSB0aGlzLmdldERpcmVjdE5hbWVzKCk7XG4gICAgaWYgKG5hbWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZXNbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGUoKTtcbiAgICB9XG4gIH1cblxuICBjbWRTY29yZShjbWQpIHtcbiAgICB2YXIgc2NvcmU7XG4gICAgc2NvcmUgPSBjbWQuZGVwdGg7XG4gICAgaWYgKGNtZC5uYW1lID09PSAnZmFsbGJhY2snKSB7XG4gICAgICBzY29yZSAtPSAxMDAwO1xuICAgIH1cbiAgICByZXR1cm4gc2NvcmU7XG4gIH1cblxuICBiZXN0SW5Qb3NpYmlsaXRpZXMocG9zcykge1xuICAgIHZhciBiZXN0LCBiZXN0U2NvcmUsIGosIGxlbiwgcCwgc2NvcmU7XG4gICAgaWYgKHBvc3MubGVuZ3RoID4gMCkge1xuICAgICAgYmVzdCA9IG51bGw7XG4gICAgICBiZXN0U2NvcmUgPSBudWxsO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcG9zcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcG9zc1tqXTtcbiAgICAgICAgc2NvcmUgPSB0aGlzLmNtZFNjb3JlKHApO1xuICAgICAgICBpZiAoKGJlc3QgPT0gbnVsbCkgfHwgc2NvcmUgPj0gYmVzdFNjb3JlKSB7XG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmU7XG4gICAgICAgICAgYmVzdCA9IHA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBiZXN0O1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vQ29kZXdhdmUnO1xuaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuZXhwb3J0IGNsYXNzIENtZEluc3RhbmNlXG4gIGNvbnN0cnVjdG9yOiAoQGNtZCxAY29udGV4dCkgLT5cbiAgXG4gIGluaXQ6IC0+XG4gICAgdW5sZXNzIEBpc0VtcHR5KCkgb3IgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIEBfZ2V0Q21kT2JqKClcbiAgICAgIEBfaW5pdFBhcmFtcygpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBAY21kT2JqLmluaXQoKVxuICAgIHJldHVybiB0aGlzXG4gIHNldFBhcmFtOihuYW1lLHZhbCktPlxuICAgIEBuYW1lZFtuYW1lXSA9IHZhbFxuICBwdXNoUGFyYW06KHZhbCktPlxuICAgIEBwYXJhbXMucHVzaCh2YWwpXG4gIGdldENvbnRleHQ6IC0+XG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgcmV0dXJuIEBjb250ZXh0IG9yIG5ldyBDb250ZXh0KClcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBnZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsbmFtZXNwYWNlczpAX2dldFBhcmVudE5hbWVzcGFjZXMoKSlcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzXG4gICAgcmV0dXJuIGZpbmRlclxuICBfZ2V0Q21kT2JqOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBAY21kLmluaXQoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWQoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuY2xzP1xuICAgICAgICBAY21kT2JqID0gbmV3IGNtZC5jbHModGhpcylcbiAgICAgICAgcmV0dXJuIEBjbWRPYmpcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQG5hbWVkID0gQGdldERlZmF1bHRzKClcbiAgX2dldFBhcmVudE5hbWVzcGFjZXM6IC0+XG4gICAgcmV0dXJuIFtdXG4gIGlzRW1wdHk6IC0+XG4gICAgcmV0dXJuIEBjbWQ/XG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWRGaW5hbCgpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICByZXR1cm4gQGNtZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldERlZmF1bHRzOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICByZXMgPSB7fVxuICAgICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBjbWQuZGVmYXVsdHMpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxAY21kT2JqLmdldERlZmF1bHRzKCkpXG4gICAgICByZXR1cm4gcmVzXG4gIGdldEFsaWFzZWQ6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHVubGVzcyBAYWxpYXNlZENtZD9cbiAgICAgICAgQGdldEFsaWFzZWRGaW5hbCgpXG4gICAgICByZXR1cm4gQGFsaWFzZWRDbWQgb3IgbnVsbFxuICBnZXRBbGlhc2VkRmluYWw6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBhbGlhc2VkRmluYWxDbWQ/XG4gICAgICAgIHJldHVybiBAYWxpYXNlZEZpbmFsQ21kIG9yIG51bGxcbiAgICAgIGlmIEBjbWQuYWxpYXNPZj9cbiAgICAgICAgYWxpYXNlZCA9IEBjbWRcbiAgICAgICAgd2hpbGUgYWxpYXNlZD8gYW5kIGFsaWFzZWQuYWxpYXNPZj9cbiAgICAgICAgICBhbGlhc2VkID0gYWxpYXNlZC5fYWxpYXNlZEZyb21GaW5kZXIoQGdldEZpbmRlcihAYWx0ZXJBbGlhc09mKGFsaWFzZWQuYWxpYXNPZikpKVxuICAgICAgICAgIHVubGVzcyBAYWxpYXNlZENtZD9cbiAgICAgICAgICAgIEBhbGlhc2VkQ21kID0gYWxpYXNlZCBvciBmYWxzZVxuICAgICAgICBAYWxpYXNlZEZpbmFsQ21kID0gYWxpYXNlZCBvciBmYWxzZVxuICAgICAgICByZXR1cm4gYWxpYXNlZFxuICBhbHRlckFsaWFzT2Y6IChhbGlhc09mKS0+XG4gICAgYWxpYXNPZlxuICBnZXRPcHRpb25zOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT3B0aW9ucz9cbiAgICAgICAgcmV0dXJuIEBjbWRPcHRpb25zXG4gICAgICBvcHQgPSBAY21kLl9vcHRpb25zRm9yQWxpYXNlZChAZ2V0QWxpYXNlZCgpKVxuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsQGNtZE9iai5nZXRPcHRpb25zKCkpXG4gICAgICBAY21kT3B0aW9ucyA9IG9wdFxuICAgICAgcmV0dXJuIG9wdFxuICBnZXRPcHRpb246IChrZXkpIC0+XG4gICAgb3B0aW9ucyA9IEBnZXRPcHRpb25zKClcbiAgICBpZiBvcHRpb25zPyBhbmQga2V5IG9mIG9wdGlvbnNcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV1cbiAgZ2V0UGFyYW06IChuYW1lcywgZGVmVmFsID0gbnVsbCkgLT5cbiAgICBuYW1lcyA9IFtuYW1lc10gaWYgKHR5cGVvZiBuYW1lcyBpbiBbJ3N0cmluZycsJ251bWJlciddKVxuICAgIGZvciBuIGluIG5hbWVzXG4gICAgICByZXR1cm4gQG5hbWVkW25dIGlmIEBuYW1lZFtuXT9cbiAgICAgIHJldHVybiBAcGFyYW1zW25dIGlmIEBwYXJhbXNbbl0/XG4gICAgcmV0dXJuIGRlZlZhbFxuICBnZXRCb29sUGFyYW06IChuYW1lcywgZGVmVmFsID0gbnVsbCkgLT5cbiAgICBmYWxzZVZhbHMgPSBbXCJcIixcIjBcIixcImZhbHNlXCIsXCJub1wiLFwibm9uZVwiLGZhbHNlLG51bGwsMF1cbiAgICB2YWwgPSBAZ2V0UGFyYW0obmFtZXMsIGRlZlZhbClcbiAgICAhZmFsc2VWYWxzLmluY2x1ZGVzKHZhbClcbiAgYW5jZXN0b3JDbWRzOiAtPlxuICAgIGlmIEBjb250ZXh0LmNvZGV3YXZlPy5pbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBjb250ZXh0LmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGFuY2VzdG9yQ21kc0FuZFNlbGY6IC0+XG4gICAgcmV0dXJuIEBhbmNlc3RvckNtZHMoKS5jb25jYXQoW0BjbWRdKVxuICBydW5FeGVjdXRlRnVuY3Q6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLmV4ZWN1dGUoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWRGaW5hbCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5leGVjdXRlRnVuY3Q/XG4gICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZUZ1bmN0KHRoaXMpXG4gIHJhd1Jlc3VsdDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmV0dXJuIEBjbWRPYmoucmVzdWx0KClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkRmluYWwoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQucmVzdWx0RnVuY3Q/XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0RnVuY3QodGhpcylcbiAgICAgIGlmIGNtZC5yZXN1bHRTdHI/XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0U3RyXG4gIHJlc3VsdDogLT4gXG4gICAgQGluaXQoKVxuICAgIGlmIEByZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICBpZiAocmVzID0gQHJhd1Jlc3VsdCgpKT9cbiAgICAgICAgcmVzID0gQGZvcm1hdEluZGVudChyZXMpXG4gICAgICAgIGlmIHJlcy5sZW5ndGggPiAwIGFuZCBAZ2V0T3B0aW9uKCdwYXJzZScsdGhpcykgXG4gICAgICAgICAgcGFyc2VyID0gQGdldFBhcnNlckZvclRleHQocmVzKVxuICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICAgIGlmIGFsdGVyRnVuY3QgPSBAZ2V0T3B0aW9uKCdhbHRlclJlc3VsdCcsdGhpcylcbiAgICAgICAgICByZXMgPSBhbHRlckZ1bmN0KHJlcyx0aGlzKVxuICAgICAgICByZXR1cm4gcmVzXG4gIGdldFBhcnNlckZvclRleHQ6ICh0eHQ9JycpIC0+XG4gICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKHR4dCksIHtpbkluc3RhbmNlOnRoaXN9KVxuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlXG4gICAgcmV0dXJuIHBhcnNlclxuICBnZXRJbmRlbnQ6IC0+XG4gICAgcmV0dXJuIDBcbiAgZm9ybWF0SW5kZW50OiAodGV4dCkgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx0L2csJyAgJylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBhcHBseUluZGVudDogKHRleHQpIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5pbmRlbnROb3RGaXJzdCh0ZXh0LEBnZXRJbmRlbnQoKSxcIiBcIikiLCJpbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIENvZGV3YXZlXG59IGZyb20gJy4vQ29kZXdhdmUnO1xuXG5pbXBvcnQge1xuICBUZXh0UGFyc2VyXG59IGZyb20gJy4vVGV4dFBhcnNlcic7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuZXhwb3J0IHZhciBDbWRJbnN0YW5jZSA9IGNsYXNzIENtZEluc3RhbmNlIHtcbiAgY29uc3RydWN0b3IoY21kMSwgY29udGV4dCkge1xuICAgIHRoaXMuY21kID0gY21kMTtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoISh0aGlzLmlzRW1wdHkoKSB8fCB0aGlzLmluaXRlZCkpIHtcbiAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2dldENtZE9iaigpO1xuICAgICAgdGhpcy5faW5pdFBhcmFtcygpO1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbWRPYmouaW5pdCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldFBhcmFtKG5hbWUsIHZhbCkge1xuICAgIHJldHVybiB0aGlzLm5hbWVkW25hbWVdID0gdmFsO1xuICB9XG5cbiAgcHVzaFBhcmFtKHZhbCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5wdXNoKHZhbCk7XG4gIH1cblxuICBnZXRDb250ZXh0KCkge1xuICAgIGlmICh0aGlzLmNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCBuZXcgQ29udGV4dCgpO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUpIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuZ2V0Q29udGV4dCgpLmdldEZpbmRlcihjbWROYW1lLCB7XG4gICAgICBuYW1lc3BhY2VzOiB0aGlzLl9nZXRQYXJlbnROYW1lc3BhY2VzKClcbiAgICB9KTtcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzO1xuICAgIHJldHVybiBmaW5kZXI7XG4gIH1cblxuICBfZ2V0Q21kT2JqKCkge1xuICAgIHZhciBjbWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY21kLmluaXQoKTtcbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuY2xzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9pbml0UGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWVkID0gdGhpcy5nZXREZWZhdWx0cygpO1xuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5jbWQgIT0gbnVsbDtcbiAgfVxuXG4gIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgIHZhciBhbGlhc2VkO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY21kLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldERlZmF1bHRzKCkge1xuICAgIHZhciBhbGlhc2VkLCByZXM7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJlcyA9IHt9O1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgYWxpYXNlZC5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZC5kZWZhdWx0cyk7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5jbWRPYmouZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmdldEFsaWFzZWRGaW5hbCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZENtZCB8fCBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWRGaW5hbCgpIHtcbiAgICB2YXIgYWxpYXNlZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZEZpbmFsQ21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZEZpbmFsQ21kIHx8IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLmNtZDtcbiAgICAgICAgd2hpbGUgKChhbGlhc2VkICE9IG51bGwpICYmIChhbGlhc2VkLmFsaWFzT2YgIT0gbnVsbCkpIHtcbiAgICAgICAgICBhbGlhc2VkID0gYWxpYXNlZC5fYWxpYXNlZEZyb21GaW5kZXIodGhpcy5nZXRGaW5kZXIodGhpcy5hbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpO1xuICAgICAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hbGlhc2VkQ21kID0gYWxpYXNlZCB8fCBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIHx8IGZhbHNlO1xuICAgICAgICByZXR1cm4gYWxpYXNlZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhbHRlckFsaWFzT2YoYWxpYXNPZikge1xuICAgIHJldHVybiBhbGlhc09mO1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICB2YXIgb3B0O1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPcHRpb25zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT3B0aW9ucztcbiAgICAgIH1cbiAgICAgIG9wdCA9IHRoaXMuY21kLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSk7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5jbWRPYmouZ2V0T3B0aW9ucygpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY21kT3B0aW9ucyA9IG9wdDtcbiAgICAgIHJldHVybiBvcHQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0aW9uKGtleSkge1xuICAgIHZhciBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICBpZiAoKG9wdGlvbnMgIT0gbnVsbCkgJiYga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV07XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyYW0obmFtZXMsIGRlZlZhbCA9IG51bGwpIHtcbiAgICB2YXIgaSwgbGVuLCBuLCByZWY7XG4gICAgaWYgKCgocmVmID0gdHlwZW9mIG5hbWVzKSA9PT0gJ3N0cmluZycgfHwgcmVmID09PSAnbnVtYmVyJykpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXTtcbiAgICB9XG4gICAgZm9yIChpID0gMCwgbGVuID0gbmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG4gPSBuYW1lc1tpXTtcbiAgICAgIGlmICh0aGlzLm5hbWVkW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbl07XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wYXJhbXNbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXNbbl07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWZWYWw7XG4gIH1cblxuICBnZXRCb29sUGFyYW0obmFtZXMsIGRlZlZhbCA9IG51bGwpIHtcbiAgICB2YXIgZmFsc2VWYWxzLCB2YWw7XG4gICAgZmFsc2VWYWxzID0gW1wiXCIsIFwiMFwiLCBcImZhbHNlXCIsIFwibm9cIiwgXCJub25lXCIsIGZhbHNlLCBudWxsLCAwXTtcbiAgICB2YWwgPSB0aGlzLmdldFBhcmFtKG5hbWVzLCBkZWZWYWwpO1xuICAgIHJldHVybiAhZmFsc2VWYWxzLmluY2x1ZGVzKHZhbCk7XG4gIH1cblxuICBhbmNlc3RvckNtZHMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUpICE9IG51bGwgPyByZWYuaW5JbnN0YW5jZSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgYW5jZXN0b3JDbWRzQW5kU2VsZigpIHtcbiAgICByZXR1cm4gdGhpcy5hbmNlc3RvckNtZHMoKS5jb25jYXQoW3RoaXMuY21kXSk7XG4gIH1cblxuICBydW5FeGVjdXRlRnVuY3QoKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLmV4ZWN1dGUoKTtcbiAgICAgIH1cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5leGVjdXRlRnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByYXdSZXN1bHQoKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdCgpO1xuICAgICAgfVxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLnJlc3VsdEZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjbWQucmVzdWx0U3RyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRTdHI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBhbHRlckZ1bmN0LCBwYXJzZXIsIHJlcztcbiAgICB0aGlzLmluaXQoKTtcbiAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICBpZiAoKHJlcyA9IHRoaXMucmF3UmVzdWx0KCkpICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gdGhpcy5mb3JtYXRJbmRlbnQocmVzKTtcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwICYmIHRoaXMuZ2V0T3B0aW9uKCdwYXJzZScsIHRoaXMpKSB7XG4gICAgICAgICAgcGFyc2VyID0gdGhpcy5nZXRQYXJzZXJGb3JUZXh0KHJlcyk7XG4gICAgICAgICAgcmVzID0gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsdGVyRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYWx0ZXJSZXN1bHQnLCB0aGlzKSkge1xuICAgICAgICAgIHJlcyA9IGFsdGVyRnVuY3QocmVzLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFBhcnNlckZvclRleHQodHh0ID0gJycpIHtcbiAgICB2YXIgcGFyc2VyO1xuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7XG4gICAgICBpbkluc3RhbmNlOiB0aGlzXG4gICAgfSk7XG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG4gICAgcmV0dXJuIHBhcnNlcjtcbiAgfVxuXG4gIGdldEluZGVudCgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZvcm1hdEluZGVudCh0ZXh0KSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx0L2csICcgICcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhcHBseUluZGVudCh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5pbmRlbnROb3RGaXJzdCh0ZXh0LCB0aGlzLmdldEluZGVudCgpLCBcIiBcIik7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFByb2Nlc3MgfSBmcm9tICcuL1Byb2Nlc3MnO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgfSBmcm9tICcuL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9Mb2dnZXInO1xuaW1wb3J0IHsgUG9zQ29sbGVjdGlvbiB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IENsb3NpbmdQcm9tcCB9IGZyb20gJy4vQ2xvc2luZ1Byb21wJztcblxuZXhwb3J0IGNsYXNzIENvZGV3YXZlXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIENvZGV3YXZlLmluaXQoKVxuICAgIEBtYXJrZXIgPSAnW1tbW2NvZGV3YXZlX21hcnF1ZXJdXV1dJ1xuICAgIEB2YXJzID0ge31cbiAgICBcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICdicmFrZXRzJyA6ICd+ficsXG4gICAgICAnZGVjbycgOiAnficsXG4gICAgICAnY2xvc2VDaGFyJyA6ICcvJyxcbiAgICAgICdub0V4ZWN1dGVDaGFyJyA6ICchJyxcbiAgICAgICdjYXJyZXRDaGFyJyA6ICd8JyxcbiAgICAgICdjaGVja0NhcnJldCcgOiB0cnVlLFxuICAgICAgJ2luSW5zdGFuY2UnIDogbnVsbFxuICAgIH1cbiAgICBAcGFyZW50ID0gb3B0aW9uc1sncGFyZW50J11cbiAgICBcbiAgICBAbmVzdGVkID0gaWYgQHBhcmVudD8gdGhlbiBAcGFyZW50Lm5lc3RlZCsxIGVsc2UgMFxuICAgIFxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIEBlZGl0b3IuYmluZGVkVG8odGhpcykgaWYgQGVkaXRvcj9cbiAgICBcbiAgICBAY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMpXG4gICAgaWYgQGluSW5zdGFuY2U/XG4gICAgICBAY29udGV4dC5wYXJlbnQgPSBAaW5JbnN0YW5jZS5jb250ZXh0XG5cbiAgICBAbG9nZ2VyID0gbmV3IExvZ2dlcigpXG5cbiAgb25BY3RpdmF0aW9uS2V5OiAtPlxuICAgIEBwcm9jZXNzID0gbmV3IFByb2Nlc3MoKVxuICAgIEBsb2dnZXIubG9nKCdhY3RpdmF0aW9uIGtleScpXG4gICAgQHJ1bkF0Q3Vyc29yUG9zKCkudGhlbiA9PlxuICAgICAgQHByb2Nlc3MgPSBudWxsXG4gIHJ1bkF0Q3Vyc29yUG9zOiAtPlxuICAgIGlmIEBlZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgICBAcnVuQXRNdWx0aVBvcyhAZWRpdG9yLmdldE11bHRpU2VsKCkpXG4gICAgZWxzZVxuICAgICAgQHJ1bkF0UG9zKEBlZGl0b3IuZ2V0Q3Vyc29yUG9zKCkpXG4gIHJ1bkF0UG9zOiAocG9zKS0+XG4gICAgQHJ1bkF0TXVsdGlQb3MoW3Bvc10pXG4gIHJ1bkF0TXVsdGlQb3M6IChtdWx0aVBvcyktPlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgIGlmIG11bHRpUG9zLmxlbmd0aCA+IDBcbiAgICAgICAgY21kID0gQGNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpXG4gICAgICAgIGlmIGNtZD9cbiAgICAgICAgICBpZiBtdWx0aVBvcy5sZW5ndGggPiAxXG4gICAgICAgICAgICBjbWQuc2V0TXVsdGlQb3MobXVsdGlQb3MpXG4gICAgICAgICAgY21kLmluaXQoKVxuICAgICAgICAgIEBsb2dnZXIubG9nKGNtZClcbiAgICAgICAgICBjbWQuZXhlY3V0ZSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBtdWx0aVBvc1swXS5zdGFydCA9PSBtdWx0aVBvc1swXS5lbmRcbiAgICAgICAgICAgIEBhZGRCcmFrZXRzKG11bHRpUG9zKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBwcm9tcHRDbG9zaW5nQ21kKG11bHRpUG9zKVxuICBjb21tYW5kT25Qb3M6IChwb3MpIC0+XG4gICAgaWYgQHByZWNlZGVkQnlCcmFrZXRzKHBvcykgYW5kIEBmb2xsb3dlZEJ5QnJha2V0cyhwb3MpIGFuZCBAY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09IDEgXG4gICAgICBwcmV2ID0gcG9zLUBicmFrZXRzLmxlbmd0aFxuICAgICAgbmV4dCA9IHBvc1xuICAgIGVsc2VcbiAgICAgIGlmIEBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIGFuZCBAY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09IDBcbiAgICAgICAgcG9zIC09IEBicmFrZXRzLmxlbmd0aFxuICAgICAgcHJldiA9IEBmaW5kUHJldkJyYWtldChwb3MpXG4gICAgICB1bmxlc3MgcHJldj9cbiAgICAgICAgcmV0dXJuIG51bGwgXG4gICAgICBuZXh0ID0gQGZpbmROZXh0QnJha2V0KHBvcy0xKVxuICAgICAgaWYgIW5leHQ/IG9yIEBjb3VudFByZXZCcmFrZXQocHJldikgJSAyICE9IDAgXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcyxwcmV2LEBlZGl0b3IudGV4dFN1YnN0cihwcmV2LG5leHQrQGJyYWtldHMubGVuZ3RoKSlcbiAgbmV4dENtZDogKHN0YXJ0ID0gMCkgLT5cbiAgICBwb3MgPSBzdGFydFxuICAgIHdoaWxlIGYgPSBAZmluZEFueU5leHQocG9zICxbQGJyYWtldHMsXCJcXG5cIl0pXG4gICAgICBwb3MgPSBmLnBvcyArIGYuc3RyLmxlbmd0aFxuICAgICAgaWYgZi5zdHIgPT0gQGJyYWtldHNcbiAgICAgICAgaWYgYmVnaW5uaW5nP1xuICAgICAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIGJlZ2lubmluZywgQGVkaXRvci50ZXh0U3Vic3RyKGJlZ2lubmluZywgZi5wb3MrQGJyYWtldHMubGVuZ3RoKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGJlZ2lubmluZyA9IGYucG9zXG4gICAgICBlbHNlXG4gICAgICAgIGJlZ2lubmluZyA9IG51bGxcbiAgICBudWxsXG4gIGdldEVuY2xvc2luZ0NtZDogKHBvcyA9IDApIC0+XG4gICAgY3BvcyA9IHBvc1xuICAgIGNsb3NpbmdQcmVmaXggPSBAYnJha2V0cyArIEBjbG9zZUNoYXJcbiAgICB3aGlsZSAocCA9IEBmaW5kTmV4dChjcG9zLGNsb3NpbmdQcmVmaXgpKT9cbiAgICAgIGlmIGNtZCA9IEBjb21tYW5kT25Qb3MocCtjbG9zaW5nUHJlZml4Lmxlbmd0aClcbiAgICAgICAgY3BvcyA9IGNtZC5nZXRFbmRQb3MoKVxuICAgICAgICBpZiBjbWQucG9zIDwgcG9zXG4gICAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgZWxzZVxuICAgICAgICBjcG9zID0gcCtjbG9zaW5nUHJlZml4Lmxlbmd0aFxuICAgIG51bGxcbiAgcHJlY2VkZWRCeUJyYWtldHM6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dFN1YnN0cihwb3MtQGJyYWtldHMubGVuZ3RoLHBvcykgPT0gQGJyYWtldHNcbiAgZm9sbG93ZWRCeUJyYWtldHM6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dFN1YnN0cihwb3MscG9zK0BicmFrZXRzLmxlbmd0aCkgPT0gQGJyYWtldHNcbiAgY291bnRQcmV2QnJha2V0OiAoc3RhcnQpIC0+IFxuICAgIGkgPSAwXG4gICAgd2hpbGUgKHN0YXJ0ID0gQGZpbmRQcmV2QnJha2V0KHN0YXJ0KSk/XG4gICAgICBpKytcbiAgICByZXR1cm4gaVxuICBpc0VuZExpbmU6IChwb3MpIC0+IFxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLHBvcysxKSA9PSBcIlxcblwiIG9yIHBvcyArIDEgPj0gQGVkaXRvci50ZXh0TGVuKClcbiAgZmluZFByZXZCcmFrZXQ6IChzdGFydCkgLT4gXG4gICAgcmV0dXJuIEBmaW5kTmV4dEJyYWtldChzdGFydCwtMSlcbiAgZmluZE5leHRCcmFrZXQ6IChzdGFydCxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBmID0gQGZpbmRBbnlOZXh0KHN0YXJ0ICxbQGJyYWtldHMsXCJcXG5cIl0sIGRpcmVjdGlvbilcbiAgICBcbiAgICBmLnBvcyBpZiBmIGFuZCBmLnN0ciA9PSBAYnJha2V0c1xuICBmaW5kUHJldjogKHN0YXJ0LHN0cmluZykgLT4gXG4gICAgcmV0dXJuIEBmaW5kTmV4dChzdGFydCxzdHJpbmcsLTEpXG4gIGZpbmROZXh0OiAoc3RhcnQsc3RyaW5nLGRpcmVjdGlvbiA9IDEpIC0+IFxuICAgIGYgPSBAZmluZEFueU5leHQoc3RhcnQgLFtzdHJpbmddLCBkaXJlY3Rpb24pXG4gICAgZi5wb3MgaWYgZlxuICBcbiAgZmluZEFueU5leHQ6IChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbiA9IDEpIC0+IFxuICAgIHJldHVybiBAZWRpdG9yLmZpbmRBbnlOZXh0KHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uKVxuICAgIFxuICBmaW5kTWF0Y2hpbmdQYWlyOiAoc3RhcnRQb3Msb3BlbmluZyxjbG9zaW5nLGRpcmVjdGlvbiA9IDEpIC0+XG4gICAgcG9zID0gc3RhcnRQb3NcbiAgICBuZXN0ZWQgPSAwXG4gICAgd2hpbGUgZiA9IEBmaW5kQW55TmV4dChwb3MsW2Nsb3Npbmcsb3BlbmluZ10sZGlyZWN0aW9uKVxuICAgICAgcG9zID0gZi5wb3MgKyAoaWYgZGlyZWN0aW9uID4gMCB0aGVuIGYuc3RyLmxlbmd0aCBlbHNlIDApXG4gICAgICBpZiBmLnN0ciA9PSAoaWYgZGlyZWN0aW9uID4gMCB0aGVuIGNsb3NpbmcgZWxzZSBvcGVuaW5nKVxuICAgICAgICBpZiBuZXN0ZWQgPiAwXG4gICAgICAgICAgbmVzdGVkLS1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBmXG4gICAgICBlbHNlXG4gICAgICAgIG5lc3RlZCsrXG4gICAgbnVsbFxuICBhZGRCcmFrZXRzOiAocG9zKSAtPlxuICAgIHBvcyA9IG5ldyBQb3NDb2xsZWN0aW9uKHBvcylcbiAgICByZXBsYWNlbWVudHMgPSBwb3Mud3JhcChAYnJha2V0cyxAYnJha2V0cykubWFwKCAociktPnIuc2VsZWN0Q29udGVudCgpIClcbiAgICBAZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgcHJvbXB0Q2xvc2luZ0NtZDogKHNlbGVjdGlvbnMpIC0+XG4gICAgQGNsb3NpbmdQcm9tcC5zdG9wKCkgaWYgQGNsb3NpbmdQcm9tcD9cbiAgICBAY2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wLm5ld0Zvcih0aGlzLHNlbGVjdGlvbnMpLmJlZ2luKClcbiAgcGFyc2VBbGw6IChyZWN1cnNpdmUgPSB0cnVlKSAtPlxuICAgIGlmIEBuZXN0ZWQgPiAxMDBcbiAgICAgIHRocm93IFwiSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb25cIlxuICAgIHBvcyA9IDBcbiAgICB3aGlsZSBjbWQgPSBAbmV4dENtZChwb3MpXG4gICAgICBwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgIEBlZGl0b3Iuc2V0Q3Vyc29yUG9zKHBvcylcbiAgICAgICMgY29uc29sZS5sb2coY21kKVxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgcmVjdXJzaXZlIGFuZCBjbWQuY29udGVudD8gYW5kICghY21kLmdldENtZCgpPyBvciAhY21kLmdldE9wdGlvbigncHJldmVudFBhcnNlQWxsJykpXG4gICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcihjbWQuY29udGVudCksIHtwYXJlbnQ6IHRoaXN9KVxuICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICByZXMgPSAgY21kLmV4ZWN1dGUoKVxuICAgICAgaWYgcmVzP1xuICAgICAgICBpZiByZXMudGhlbj9cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzeW5jIG5lc3RlZCBjb21tYW5kcyBhcmUgbm90IHN1cHBvcnRlZCcpXG4gICAgICAgIGlmIGNtZC5yZXBsYWNlRW5kP1xuICAgICAgICAgIHBvcyA9IGNtZC5yZXBsYWNlRW5kXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwb3MgPSBAZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZFxuICAgIHJldHVybiBAZ2V0VGV4dCgpXG4gIGdldFRleHQ6IC0+XG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dCgpXG4gIGlzUm9vdDogLT5cbiAgICByZXR1cm4gIUBwYXJlbnQ/IGFuZCAoIUBpbkluc3RhbmNlPyBvciAhQGluSW5zdGFuY2UuZmluZGVyPylcbiAgZ2V0Um9vdDogLT5cbiAgICBpZiBAaXNSb290KClcbiAgICAgIHJldHVybiB0aGlzXG4gICAgZWxzZSBpZiBAcGFyZW50P1xuICAgICAgcmV0dXJuIEBwYXJlbnQuZ2V0Um9vdCgpXG4gICAgZWxzZSBpZiBAaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KClcbiAgcmVtb3ZlQ2FycmV0OiAodHh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHR4dCxAY2FycmV0Q2hhcilcbiAgZ2V0Q2FycmV0UG9zOiAodHh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCxAY2FycmV0Q2hhcilcbiAgcmVnTWFya2VyOiAoZmxhZ3M9XCJnXCIpIC0+XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAbWFya2VyKSwgZmxhZ3MpXG4gIHJlbW92ZU1hcmtlcnM6ICh0ZXh0KSAtPlxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoQHJlZ01hcmtlcigpLCcnKVxuXG4gIEBpbml0OiAtPlxuICAgIHVubGVzcyBAaW5pdGVkXG4gICAgICBAaW5pdGVkID0gdHJ1ZVxuICAgICAgQ29tbWFuZC5pbml0Q21kcygpXG4gICAgICBDb21tYW5kLmxvYWRDbWRzKClcblxuICBAaW5pdGVkOiBmYWxzZSIsImltcG9ydCB7XG4gIFByb2Nlc3Ncbn0gZnJvbSAnLi9Qcm9jZXNzJztcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBQb3NpdGlvbmVkQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UnO1xuXG5pbXBvcnQge1xuICBUZXh0UGFyc2VyXG59IGZyb20gJy4vVGV4dFBhcnNlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgTG9nZ2VyXG59IGZyb20gJy4vTG9nZ2VyJztcblxuaW1wb3J0IHtcbiAgUG9zQ29sbGVjdGlvblxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIENsb3NpbmdQcm9tcFxufSBmcm9tICcuL0Nsb3NpbmdQcm9tcCc7XG5cbmV4cG9ydCB2YXIgQ29kZXdhdmUgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIENvZGV3YXZlIHtcbiAgICBjb25zdHJ1Y3RvcihlZGl0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgICAgQ29kZXdhdmUuaW5pdCgpO1xuICAgICAgdGhpcy5tYXJrZXIgPSAnW1tbW2NvZGV3YXZlX21hcnF1ZXJdXV1dJztcbiAgICAgIHRoaXMudmFycyA9IHt9O1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICdicmFrZXRzJzogJ35+JyxcbiAgICAgICAgJ2RlY28nOiAnficsXG4gICAgICAgICdjbG9zZUNoYXInOiAnLycsXG4gICAgICAgICdub0V4ZWN1dGVDaGFyJzogJyEnLFxuICAgICAgICAnY2FycmV0Q2hhcic6ICd8JyxcbiAgICAgICAgJ2NoZWNrQ2FycmV0JzogdHJ1ZSxcbiAgICAgICAgJ2luSW5zdGFuY2UnOiBudWxsXG4gICAgICB9O1xuICAgICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcbiAgICAgIHRoaXMubmVzdGVkID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50Lm5lc3RlZCArIDEgOiAwO1xuICAgICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICB9IGVsc2UgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVkaXRvciAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLmJpbmRlZFRvKHRoaXMpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcyk7XG4gICAgICBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMuaW5JbnN0YW5jZS5jb250ZXh0O1xuICAgICAgfVxuICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG4gICAgfVxuXG4gICAgb25BY3RpdmF0aW9uS2V5KCkge1xuICAgICAgdGhpcy5wcm9jZXNzID0gbmV3IFByb2Nlc3MoKTtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKTtcbiAgICAgIHJldHVybiB0aGlzLnJ1bkF0Q3Vyc29yUG9zKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3MgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcnVuQXRDdXJzb3JQb3MoKSB7XG4gICAgICBpZiAodGhpcy5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkF0TXVsdGlQb3ModGhpcy5lZGl0b3IuZ2V0TXVsdGlTZWwoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdFBvcyh0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcnVuQXRQb3MocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKFtwb3NdKTtcbiAgICB9XG5cbiAgICBydW5BdE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBjbWQ7XG4gICAgICAgIGlmIChtdWx0aVBvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY21kID0gdGhpcy5jb21tYW5kT25Qb3MobXVsdGlQb3NbMF0uZW5kKTtcbiAgICAgICAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbWQuaW5pdCgpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGNtZCk7XG4gICAgICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zWzBdLnN0YXJ0ID09PSBtdWx0aVBvc1swXS5lbmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQnJha2V0cyhtdWx0aVBvcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9tcHRDbG9zaW5nQ21kKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbW1hbmRPblBvcyhwb3MpIHtcbiAgICAgIHZhciBuZXh0LCBwcmV2O1xuICAgICAgaWYgKHRoaXMucHJlY2VkZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmZvbGxvd2VkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDEpIHtcbiAgICAgICAgcHJldiA9IHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGg7XG4gICAgICAgIG5leHQgPSBwb3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09PSAwKSB7XG4gICAgICAgICAgcG9zIC09IHRoaXMuYnJha2V0cy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IHRoaXMuZmluZFByZXZCcmFrZXQocG9zKTtcbiAgICAgICAgaWYgKHByZXYgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIG5leHQgPSB0aGlzLmZpbmROZXh0QnJha2V0KHBvcyAtIDEpO1xuICAgICAgICBpZiAoKG5leHQgPT0gbnVsbCkgfHwgdGhpcy5jb3VudFByZXZCcmFrZXQocHJldikgJSAyICE9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIHByZXYsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocHJldiwgbmV4dCArIHRoaXMuYnJha2V0cy5sZW5ndGgpKTtcbiAgICB9XG5cbiAgICBuZXh0Q21kKHN0YXJ0ID0gMCkge1xuICAgICAgdmFyIGJlZ2lubmluZywgZiwgcG9zO1xuICAgICAgcG9zID0gc3RhcnQ7XG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSkpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGg7XG4gICAgICAgIGlmIChmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBiZWdpbm5pbmcgIT09IFwidW5kZWZpbmVkXCIgJiYgYmVnaW5uaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIoYmVnaW5uaW5nLCBmLnBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmVnaW5uaW5nID0gZi5wb3M7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJlZ2lubmluZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldEVuY2xvc2luZ0NtZChwb3MgPSAwKSB7XG4gICAgICB2YXIgY2xvc2luZ1ByZWZpeCwgY21kLCBjcG9zLCBwO1xuICAgICAgY3BvcyA9IHBvcztcbiAgICAgIGNsb3NpbmdQcmVmaXggPSB0aGlzLmJyYWtldHMgKyB0aGlzLmNsb3NlQ2hhcjtcbiAgICAgIHdoaWxlICgocCA9IHRoaXMuZmluZE5leHQoY3BvcywgY2xvc2luZ1ByZWZpeCkpICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGNtZCA9IHRoaXMuY29tbWFuZE9uUG9zKHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aCkpIHtcbiAgICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpO1xuICAgICAgICAgIGlmIChjbWQucG9zIDwgcG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gY21kO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcG9zID0gcCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGgsIHBvcykgPT09IHRoaXMuYnJha2V0cztcbiAgICB9XG5cbiAgICBmb2xsb3dlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcywgcG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkgPT09IHRoaXMuYnJha2V0cztcbiAgICB9XG5cbiAgICBjb3VudFByZXZCcmFrZXQoc3RhcnQpIHtcbiAgICAgIHZhciBpO1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoKHN0YXJ0ID0gdGhpcy5maW5kUHJldkJyYWtldChzdGFydCkpICE9IG51bGwpIHtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuXG4gICAgaXNFbmRMaW5lKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyAxKSA9PT0gXCJcXG5cIiB8fCBwb3MgKyAxID49IHRoaXMuZWRpdG9yLnRleHRMZW4oKTtcbiAgICB9XG5cbiAgICBmaW5kUHJldkJyYWtldChzdGFydCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHRCcmFrZXQoc3RhcnQsIC0xKTtcbiAgICB9XG5cbiAgICBmaW5kTmV4dEJyYWtldChzdGFydCwgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGY7XG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3RoaXMuYnJha2V0cywgXCJcXG5cIl0sIGRpcmVjdGlvbik7XG4gICAgICBpZiAoZiAmJiBmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgIHJldHVybiBmLnBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldihzdGFydCwgc3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dChzdGFydCwgc3RyaW5nLCAtMSk7XG4gICAgfVxuXG4gICAgZmluZE5leHQoc3RhcnQsIHN0cmluZywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGY7XG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3N0cmluZ10sIGRpcmVjdGlvbik7XG4gICAgICBpZiAoZikge1xuICAgICAgICByZXR1cm4gZi5wb3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5maW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBmaW5kTWF0Y2hpbmdQYWlyKHN0YXJ0UG9zLCBvcGVuaW5nLCBjbG9zaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZiwgbmVzdGVkLCBwb3M7XG4gICAgICBwb3MgPSBzdGFydFBvcztcbiAgICAgIG5lc3RlZCA9IDA7XG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbY2xvc2luZywgb3BlbmluZ10sIGRpcmVjdGlvbikpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyAoZGlyZWN0aW9uID4gMCA/IGYuc3RyLmxlbmd0aCA6IDApO1xuICAgICAgICBpZiAoZi5zdHIgPT09IChkaXJlY3Rpb24gPiAwID8gY2xvc2luZyA6IG9wZW5pbmcpKSB7XG4gICAgICAgICAgaWYgKG5lc3RlZCA+IDApIHtcbiAgICAgICAgICAgIG5lc3RlZC0tO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmVzdGVkKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFkZEJyYWtldHMocG9zKSB7XG4gICAgICB2YXIgcmVwbGFjZW1lbnRzO1xuICAgICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKTtcbiAgICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKHRoaXMuYnJha2V0cywgdGhpcy5icmFrZXRzKS5tYXAoZnVuY3Rpb24ocikge1xuICAgICAgICByZXR1cm4gci5zZWxlY3RDb250ZW50KCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICAgIH1cblxuICAgIHByb21wdENsb3NpbmdDbWQoc2VsZWN0aW9ucykge1xuICAgICAgaWYgKHRoaXMuY2xvc2luZ1Byb21wICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbG9zaW5nUHJvbXAuc3RvcCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wLm5ld0Zvcih0aGlzLCBzZWxlY3Rpb25zKS5iZWdpbigpO1xuICAgIH1cblxuICAgIHBhcnNlQWxsKHJlY3Vyc2l2ZSA9IHRydWUpIHtcbiAgICAgIHZhciBjbWQsIHBhcnNlciwgcG9zLCByZXM7XG4gICAgICBpZiAodGhpcy5uZXN0ZWQgPiAxMDApIHtcbiAgICAgICAgdGhyb3cgXCJJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvblwiO1xuICAgICAgfVxuICAgICAgcG9zID0gMDtcbiAgICAgIHdoaWxlIChjbWQgPSB0aGlzLm5leHRDbWQocG9zKSkge1xuICAgICAgICBwb3MgPSBjbWQuZ2V0RW5kUG9zKCk7XG4gICAgICAgIHRoaXMuZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhjbWQpXG4gICAgICAgIGNtZC5pbml0KCk7XG4gICAgICAgIGlmIChyZWN1cnNpdmUgJiYgKGNtZC5jb250ZW50ICE9IG51bGwpICYmICgoY21kLmdldENtZCgpID09IG51bGwpIHx8ICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSkpIHtcbiAgICAgICAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIoY21kLmNvbnRlbnQpLCB7XG4gICAgICAgICAgICBwYXJlbnQ6IHRoaXNcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IGNtZC5leGVjdXRlKCk7XG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIGlmIChyZXMudGhlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzeW5jIG5lc3RlZCBjb21tYW5kcyBhcmUgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY21kLnJlcGxhY2VFbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldFRleHQoKTtcbiAgICB9XG5cbiAgICBnZXRUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHQoKTtcbiAgICB9XG5cbiAgICBpc1Jvb3QoKSB7XG4gICAgICByZXR1cm4gKHRoaXMucGFyZW50ID09IG51bGwpICYmICgodGhpcy5pbkluc3RhbmNlID09IG51bGwpIHx8ICh0aGlzLmluSW5zdGFuY2UuZmluZGVyID09IG51bGwpKTtcbiAgICB9XG5cbiAgICBnZXRSb290KCkge1xuICAgICAgaWYgKHRoaXMuaXNSb290KCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2FycmV0KHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodHh0LCB0aGlzLmNhcnJldENoYXIpO1xuICAgIH1cblxuICAgIGdldENhcnJldFBvcyh0eHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCwgdGhpcy5jYXJyZXRDaGFyKTtcbiAgICB9XG5cbiAgICByZWdNYXJrZXIoZmxhZ3MgPSBcImdcIikge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm1hcmtlciksIGZsYWdzKTtcbiAgICB9XG5cbiAgICByZW1vdmVNYXJrZXJzKHRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UodGhpcy5yZWdNYXJrZXIoKSwgJycpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRlZCkge1xuICAgICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICAgIENvbW1hbmQuaW5pdENtZHMoKTtcbiAgICAgICAgcmV0dXJuIENvbW1hbmQubG9hZENtZHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfTtcblxuICBDb2Rld2F2ZS5pbml0ZWQgPSBmYWxzZTtcblxuICByZXR1cm4gQ29kZXdhdmU7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgU3RvcmFnZSB9IGZyb20gJy4vU3RvcmFnZSc7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuXG5fb3B0S2V5ID0gKGtleSxkaWN0LGRlZlZhbCA9IG51bGwpIC0+XG4gICMgb3B0aW9uYWwgRGljdGlvbmFyeSBrZXlcbiAgcmV0dXJuIGlmIGtleSBvZiBkaWN0IHRoZW4gZGljdFtrZXldIGVsc2UgZGVmVmFsXG5cblxuZXhwb3J0IGNsYXNzIENvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAbmFtZSxAZGF0YT1udWxsLHBhcmVudD1udWxsKSAtPlxuICAgIEBjbWRzID0gW11cbiAgICBAZGV0ZWN0b3JzID0gW11cbiAgICBAZXhlY3V0ZUZ1bmN0ID0gQHJlc3VsdEZ1bmN0ID0gQHJlc3VsdFN0ciA9IEBhbGlhc09mID0gQGNscyA9IG51bGxcbiAgICBAYWxpYXNlZCA9IG51bGxcbiAgICBAZnVsbE5hbWUgPSBAbmFtZVxuICAgIEBkZXB0aCA9IDBcbiAgICBbQF9wYXJlbnQsIEBfaW5pdGVkXSA9IFtudWxsLCBmYWxzZV1cbiAgICBAc2V0UGFyZW50KHBhcmVudClcbiAgICBAZGVmYXVsdHMgPSB7fVxuICAgIFxuICAgIEBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgY2hlY2tDYXJyZXQ6IHRydWUsXG4gICAgICBwYXJzZTogZmFsc2UsXG4gICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgYWx0ZXJSZXN1bHQ6IG51bGwsXG4gICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgICBhbGxvd2VkTmFtZWQ6IG51bGxcbiAgICB9XG4gICAgQG9wdGlvbnMgPSB7fVxuICAgIEBmaW5hbE9wdGlvbnMgPSBudWxsXG4gIHBhcmVudDogLT5cbiAgICByZXR1cm4gQF9wYXJlbnRcbiAgc2V0UGFyZW50OiAodmFsdWUpIC0+XG4gICAgaWYgQF9wYXJlbnQgIT0gdmFsdWVcbiAgICAgIEBfcGFyZW50ID0gdmFsdWVcbiAgICAgIEBmdWxsTmFtZSA9IChcbiAgICAgICAgaWYgQF9wYXJlbnQ/IGFuZCBAX3BhcmVudC5uYW1lP1xuICAgICAgICAgIEBfcGFyZW50LmZ1bGxOYW1lICsgJzonICsgQG5hbWUgXG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgQG5hbWVcbiAgICAgIClcbiAgICAgIEBkZXB0aCA9IChcbiAgICAgICAgaWYgQF9wYXJlbnQ/IGFuZCBAX3BhcmVudC5kZXB0aD9cbiAgICAgICAgdGhlbiBAX3BhcmVudC5kZXB0aCArIDFcbiAgICAgICAgZWxzZSAwXG4gICAgICApXG4gIGluaXQ6IC0+XG4gICAgaWYgIUBfaW5pdGVkXG4gICAgICBAX2luaXRlZCA9IHRydWVcbiAgICAgIEBwYXJzZURhdGEoQGRhdGEpXG4gICAgcmV0dXJuIHRoaXNcbiAgdW5yZWdpc3RlcjogLT5cbiAgICBAX3BhcmVudC5yZW1vdmVDbWQodGhpcylcbiAgaXNFZGl0YWJsZTogLT5cbiAgICByZXR1cm4gQHJlc3VsdFN0cj8gb3IgQGFsaWFzT2Y/XG4gIGlzRXhlY3V0YWJsZTogLT5cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICBmb3IgcCBpbiBbJ3Jlc3VsdFN0cicsJ3Jlc3VsdEZ1bmN0JywnY2xzJywnZXhlY3V0ZUZ1bmN0J11cbiAgICAgIGlmIHRoaXNbcF0/XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIGlzRXhlY3V0YWJsZVdpdGhOYW1lOiAobmFtZSkgLT5cbiAgICBpZiBAYWxpYXNPZj9cbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICBhbGlhc09mID0gQGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJyxuYW1lKVxuICAgICAgYWxpYXNlZCA9IEBfYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBAaXNFeGVjdXRhYmxlKClcbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgIGZvciBwIGluIFsncmVzdWx0U3RyJywncmVzdWx0RnVuY3QnXVxuICAgICAgaWYgdGhpc1twXT9cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgcmVzID0ge31cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGRlZmF1bHRzKVxuICAgIHJldHVybiByZXNcbiAgX2FsaWFzZWRGcm9tRmluZGVyOiAoZmluZGVyKSAtPlxuICAgICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlXG4gICAgICBmaW5kZXIubXVzdEV4ZWN1dGUgPSBmYWxzZVxuICAgICAgZmluZGVyLnVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICByZXR1cm4gZmluZGVyLmZpbmQoKVxuICBnZXRBbGlhc2VkOiAtPlxuICAgIGlmIEBhbGlhc09mP1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgIHJldHVybiBAX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKEBhbGlhc09mKSlcbiAgc2V0T3B0aW9uczogKGRhdGEpIC0+XG4gICAgZm9yIGtleSwgdmFsIG9mIGRhdGFcbiAgICAgIGlmIGtleSBvZiBAZGVmYXVsdE9wdGlvbnNcbiAgICAgICAgQG9wdGlvbnNba2V5XSA9IHZhbFxuICBfb3B0aW9uc0ZvckFsaWFzZWQ6IChhbGlhc2VkKSAtPlxuICAgIG9wdCA9IHt9XG4gICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsQGRlZmF1bHRPcHRpb25zKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxhbGlhc2VkLmdldE9wdGlvbnMoKSlcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihvcHQsQG9wdGlvbnMpXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIEBfb3B0aW9uc0ZvckFsaWFzZWQoQGdldEFsaWFzZWQoKSlcbiAgZ2V0T3B0aW9uOiAoa2V5KSAtPlxuICAgIG9wdGlvbnMgPSBAZ2V0T3B0aW9ucygpXG4gICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV1cbiAgaGVscDogLT5cbiAgICBjbWQgPSBAZ2V0Q21kKCdoZWxwJylcbiAgICBpZiBjbWQ/XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHJcbiAgcGFyc2VEYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IGRhdGFcbiAgICBpZiB0eXBlb2YgZGF0YSA9PSAnc3RyaW5nJ1xuICAgICAgQHJlc3VsdFN0ciA9IGRhdGFcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlIGlmIGRhdGE/XG4gICAgICByZXR1cm4gQHBhcnNlRGljdERhdGEoZGF0YSlcbiAgICByZXR1cm4gZmFsc2VcbiAgcGFyc2VEaWN0RGF0YTogKGRhdGEpIC0+XG4gICAgcmVzID0gX29wdEtleSgncmVzdWx0JyxkYXRhKVxuICAgIGlmIHR5cGVvZiByZXMgPT0gXCJmdW5jdGlvblwiXG4gICAgICBAcmVzdWx0RnVuY3QgPSByZXNcbiAgICBlbHNlIGlmIHJlcz9cbiAgICAgIEByZXN1bHRTdHIgPSByZXNcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJyxkYXRhKVxuICAgIGlmIHR5cGVvZiBleGVjdXRlID09IFwiZnVuY3Rpb25cIlxuICAgICAgQGV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGVcbiAgICBAYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLGRhdGEpXG4gICAgQGNscyA9IF9vcHRLZXkoJ2NscycsZGF0YSlcbiAgICBAZGVmYXVsdHMgPSBfb3B0S2V5KCdkZWZhdWx0cycsZGF0YSxAZGVmYXVsdHMpXG4gICAgXG4gICAgQHNldE9wdGlvbnMoZGF0YSlcbiAgICBcbiAgICBpZiAnaGVscCcgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsZGF0YVsnaGVscCddLHRoaXMpKVxuICAgIGlmICdmYWxsYmFjaycgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLGRhdGFbJ2ZhbGxiYWNrJ10sdGhpcykpXG4gICAgICBcbiAgICBpZiAnY21kcycgb2YgZGF0YVxuICAgICAgQGFkZENtZHMoZGF0YVsnY21kcyddKVxuICAgIHJldHVybiB0cnVlXG4gIGFkZENtZHM6IChjbWRzKSAtPlxuICAgIGZvciBuYW1lLCBkYXRhIG9mIGNtZHNcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQobmFtZSxkYXRhLHRoaXMpKVxuICBhZGRDbWQ6IChjbWQpIC0+XG4gICAgZXhpc3RzID0gQGdldENtZChjbWQubmFtZSlcbiAgICBpZiBleGlzdHM/XG4gICAgICBAcmVtb3ZlQ21kKGV4aXN0cylcbiAgICBjbWQuc2V0UGFyZW50KHRoaXMpXG4gICAgQGNtZHMucHVzaChjbWQpXG4gICAgcmV0dXJuIGNtZFxuICByZW1vdmVDbWQ6IChjbWQpIC0+XG4gICAgaWYgKGkgPSBAY21kcy5pbmRleE9mKGNtZCkpID4gLTFcbiAgICAgIEBjbWRzLnNwbGljZShpLCAxKVxuICAgIHJldHVybiBjbWRcbiAgZ2V0Q21kOiAoZnVsbG5hbWUpIC0+XG4gICAgQGluaXQoKVxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgcmV0dXJuIEBnZXRDbWQoc3BhY2UpPy5nZXRDbWQobmFtZSlcbiAgICBmb3IgY21kIGluIEBjbWRzXG4gICAgICBpZiBjbWQubmFtZSA9PSBuYW1lXG4gICAgICAgIHJldHVybiBjbWRcbiAgc2V0Q21kRGF0YTogKGZ1bGxuYW1lLGRhdGEpIC0+XG4gICAgQHNldENtZChmdWxsbmFtZSxuZXcgQ29tbWFuZChmdWxsbmFtZS5zcGxpdCgnOicpLnBvcCgpLGRhdGEpKVxuICBzZXRDbWQ6IChmdWxsbmFtZSxjbWQpIC0+XG4gICAgW3NwYWNlLG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpXG4gICAgaWYgc3BhY2U/XG4gICAgICBuZXh0ID0gQGdldENtZChzcGFjZSlcbiAgICAgIHVubGVzcyBuZXh0P1xuICAgICAgICBuZXh0ID0gQGFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpXG4gICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSxjbWQpXG4gICAgZWxzZVxuICAgICAgQGFkZENtZChjbWQpXG4gICAgICByZXR1cm4gY21kXG4gIGFkZERldGVjdG9yOiAoZGV0ZWN0b3IpIC0+XG4gICAgQGRldGVjdG9ycy5wdXNoKGRldGVjdG9yKVxuICAgIFxuICBAcHJvdmlkZXJzID0gW11cblxuICBAc3RvcmFnZSA9IG5ldyBTdG9yYWdlKClcblxuICBAaW5pdENtZHM6IC0+XG4gICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCx7XG4gICAgICAnY21kcyc6e1xuICAgICAgICAnaGVsbG8nOntcbiAgICAgICAgICBoZWxwOiBcIlwiXCJcbiAgICAgICAgICBcIkhlbGxvLCB3b3JsZCFcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxuICAgICAgICAgIG1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xuICAgICAgICAgIHZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYVxuICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGZvciBwcm92aWRlciBpbiBAcHJvdmlkZXJzXG4gICAgICBwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpXG5cbiAgQHNhdmVDbWQ6IChmdWxsbmFtZSwgZGF0YSkgLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSxkYXRhKVxuICAgIC50aGVuID0+XG4gICAgICBAc3RvcmFnZS5zYXZlSW5QYXRoKCdjbWRzJywgZnVsbG5hbWUsIGRhdGEpXG5cbiAgQGxvYWRDbWRzOiAtPlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgIHNhdmVkQ21kcyA9IEBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgIC50aGVuIChzYXZlZENtZHMpPT5cbiAgICAgIGlmIHNhdmVkQ21kcz8gXG4gICAgICAgIGZvciBmdWxsbmFtZSwgZGF0YSBvZiBzYXZlZENtZHNcbiAgICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSlcblxuICBAcmVzZXRTYXZlZDogLT5cbiAgICBAc3RvcmFnZS5zYXZlKCdjbWRzJyx7fSlcblxuICBAbWFrZVZhckNtZCA9IChuYW1lLGJhc2U9e30pIC0+IFxuICAgIGJhc2UuZXhlY3V0ZSA9IChpbnN0YW5jZSkgLT5cbiAgICAgIHZhbCA9IGlmIChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpP1xuICAgICAgICBwXG4gICAgICBlbHNlIGlmIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgICAgaW5zdGFuY2UuY29udGVudFxuICAgICAgaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHZhbCBpZiB2YWw/XG4gICAgcmV0dXJuIGJhc2VcblxuICBAbWFrZUJvb2xWYXJDbWQgPSAobmFtZSxiYXNlPXt9KSAtPiBcbiAgICBiYXNlLmV4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHVubGVzcyB2YWw/IGFuZCB2YWwgaW4gWycwJywnZmFsc2UnLCdubyddXG4gICAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlXG4gICAgcmV0dXJuIGJhc2VcbiAgXG5cbmV4cG9ydCBjbGFzcyBCYXNlQ29tbWFuZFxuICBjb25zdHJ1Y3RvcjogKEBpbnN0YW5jZSkgLT5cbiAgaW5pdDogLT5cbiAgICAjXG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIHJldHVybiB0aGlzW1wicmVzdWx0XCJdP1xuICBnZXREZWZhdWx0czogLT5cbiAgICByZXR1cm4ge31cbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4ge31cbiAgICAgICIsInZhciBfb3B0S2V5O1xuXG5pbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIFN0b3JhZ2Vcbn0gZnJvbSAnLi9TdG9yYWdlJztcblxuaW1wb3J0IHtcbiAgTmFtZXNwYWNlSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5fb3B0S2V5ID0gZnVuY3Rpb24oa2V5LCBkaWN0LCBkZWZWYWwgPSBudWxsKSB7XG4gIC8vIG9wdGlvbmFsIERpY3Rpb25hcnkga2V5XG4gIGlmIChrZXkgaW4gZGljdCkge1xuICAgIHJldHVybiBkaWN0W2tleV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRlZlZhbDtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBDb21tYW5kID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lMSwgZGF0YTEgPSBudWxsLCBwYXJlbnQgPSBudWxsKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lMTtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGExO1xuICAgICAgdGhpcy5jbWRzID0gW107XG4gICAgICB0aGlzLmRldGVjdG9ycyA9IFtdO1xuICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSB0aGlzLnJlc3VsdEZ1bmN0ID0gdGhpcy5yZXN1bHRTdHIgPSB0aGlzLmFsaWFzT2YgPSB0aGlzLmNscyA9IG51bGw7XG4gICAgICB0aGlzLmFsaWFzZWQgPSBudWxsO1xuICAgICAgdGhpcy5mdWxsTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgIHRoaXMuZGVwdGggPSAwO1xuICAgICAgW3RoaXMuX3BhcmVudCwgdGhpcy5faW5pdGVkXSA9IFtudWxsLCBmYWxzZV07XG4gICAgICB0aGlzLnNldFBhcmVudChwYXJlbnQpO1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IHt9O1xuICAgICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgICBwYXJzZTogZmFsc2UsXG4gICAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgICByZXBsYWNlQm94OiBmYWxzZSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBudWxsXG4gICAgICB9O1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgICB0aGlzLmZpbmFsT3B0aW9ucyA9IG51bGw7XG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICB9XG5cbiAgICBzZXRQYXJlbnQodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLl9wYXJlbnQgIT09IHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHZhbHVlO1xuICAgICAgICB0aGlzLmZ1bGxOYW1lID0gKCh0aGlzLl9wYXJlbnQgIT0gbnVsbCkgJiYgKHRoaXMuX3BhcmVudC5uYW1lICE9IG51bGwpID8gdGhpcy5fcGFyZW50LmZ1bGxOYW1lICsgJzonICsgdGhpcy5uYW1lIDogdGhpcy5uYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwdGggPSAoKHRoaXMuX3BhcmVudCAhPSBudWxsKSAmJiAodGhpcy5fcGFyZW50LmRlcHRoICE9IG51bGwpID8gdGhpcy5fcGFyZW50LmRlcHRoICsgMSA6IDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoIXRoaXMuX2luaXRlZCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnBhcnNlRGF0YSh0aGlzLmRhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpO1xuICAgIH1cblxuICAgIGlzRWRpdGFibGUoKSB7XG4gICAgICByZXR1cm4gKHRoaXMucmVzdWx0U3RyICE9IG51bGwpIHx8ICh0aGlzLmFsaWFzT2YgIT0gbnVsbCk7XG4gICAgfVxuXG4gICAgaXNFeGVjdXRhYmxlKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmO1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICB9XG4gICAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCcsICdjbHMnLCAnZXhlY3V0ZUZ1bmN0J107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHJlZltqXTtcbiAgICAgICAgaWYgKHRoaXNbcF0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZSkge1xuICAgICAgdmFyIGFsaWFzT2YsIGFsaWFzZWQsIGNvbnRleHQ7XG4gICAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICAgIGFsaWFzT2YgPSB0aGlzLmFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJywgbmFtZSk7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLl9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihhbGlhc09mKSk7XG4gICAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaXNFeGVjdXRhYmxlKCk7XG4gICAgfVxuXG4gICAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgaiwgbGVuLCBwLCByZWY7XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG4gICAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCddO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal07XG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldERlZmF1bHRzKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIHJlcztcbiAgICAgIHJlcyA9IHt9O1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgYWxpYXNlZC5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgX2FsaWFzZWRGcm9tRmluZGVyKGZpbmRlcikge1xuICAgICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlO1xuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2U7XG4gICAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2U7XG4gICAgICByZXR1cm4gZmluZGVyLmZpbmQoKTtcbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkKCkge1xuICAgICAgdmFyIGNvbnRleHQ7XG4gICAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcih0aGlzLmFsaWFzT2YpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRPcHRpb25zKGRhdGEpIHtcbiAgICAgIHZhciBrZXksIHJlc3VsdHMsIHZhbDtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgICAgdmFsID0gZGF0YVtrZXldO1xuICAgICAgICBpZiAoa2V5IGluIHRoaXMuZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5vcHRpb25zW2tleV0gPSB2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBfb3B0aW9uc0ZvckFsaWFzZWQoYWxpYXNlZCkge1xuICAgICAgdmFyIG9wdDtcbiAgICAgIG9wdCA9IHt9O1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMuZGVmYXVsdE9wdGlvbnMpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgYWxpYXNlZC5nZXRPcHRpb25zKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldE9wdGlvbnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3B0aW9uc0ZvckFsaWFzZWQodGhpcy5nZXRBbGlhc2VkKCkpO1xuICAgIH1cblxuICAgIGdldE9wdGlvbihrZXkpIHtcbiAgICAgIHZhciBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGVscCgpIHtcbiAgICAgIHZhciBjbWQ7XG4gICAgICBjbWQgPSB0aGlzLmdldENtZCgnaGVscCcpO1xuICAgICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuaW5pdCgpLnJlc3VsdFN0cjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZURhdGEoZGF0YSkge1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRTdHIgPSBkYXRhO1xuICAgICAgICB0aGlzLm9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGljdERhdGEoZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcGFyc2VEaWN0RGF0YShkYXRhKSB7XG4gICAgICB2YXIgZXhlY3V0ZSwgcmVzO1xuICAgICAgcmVzID0gX29wdEtleSgncmVzdWx0JywgZGF0YSk7XG4gICAgICBpZiAodHlwZW9mIHJlcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMucmVzdWx0RnVuY3QgPSByZXM7XG4gICAgICB9IGVsc2UgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gcmVzO1xuICAgICAgICB0aGlzLm9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlO1xuICAgICAgfVxuICAgICAgZXhlY3V0ZSA9IF9vcHRLZXkoJ2V4ZWN1dGUnLCBkYXRhKTtcbiAgICAgIGlmICh0eXBlb2YgZXhlY3V0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0ZUZ1bmN0ID0gZXhlY3V0ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLCBkYXRhKTtcbiAgICAgIHRoaXMuY2xzID0gX29wdEtleSgnY2xzJywgZGF0YSk7XG4gICAgICB0aGlzLmRlZmF1bHRzID0gX29wdEtleSgnZGVmYXVsdHMnLCBkYXRhLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhkYXRhKTtcbiAgICAgIGlmICgnaGVscCcgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsIGRhdGFbJ2hlbHAnXSwgdGhpcykpO1xuICAgICAgfVxuICAgICAgaWYgKCdmYWxsYmFjaycgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLCBkYXRhWydmYWxsYmFjayddLCB0aGlzKSk7XG4gICAgICB9XG4gICAgICBpZiAoJ2NtZHMnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWRzKGRhdGFbJ2NtZHMnXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhZGRDbWRzKGNtZHMpIHtcbiAgICAgIHZhciBkYXRhLCBuYW1lLCByZXN1bHRzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChuYW1lIGluIGNtZHMpIHtcbiAgICAgICAgZGF0YSA9IGNtZHNbbmFtZV07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZENtZChuZXcgQ29tbWFuZChuYW1lLCBkYXRhLCB0aGlzKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkQ21kKGNtZCkge1xuICAgICAgdmFyIGV4aXN0cztcbiAgICAgIGV4aXN0cyA9IHRoaXMuZ2V0Q21kKGNtZC5uYW1lKTtcbiAgICAgIGlmIChleGlzdHMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlbW92ZUNtZChleGlzdHMpO1xuICAgICAgfVxuICAgICAgY21kLnNldFBhcmVudCh0aGlzKTtcbiAgICAgIHRoaXMuY21kcy5wdXNoKGNtZCk7XG4gICAgICByZXR1cm4gY21kO1xuICAgIH1cblxuICAgIHJlbW92ZUNtZChjbWQpIHtcbiAgICAgIHZhciBpO1xuICAgICAgaWYgKChpID0gdGhpcy5jbWRzLmluZGV4T2YoY21kKSkgPiAtMSkge1xuICAgICAgICB0aGlzLmNtZHMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNtZDtcbiAgICB9XG5cbiAgICBnZXRDbWQoZnVsbG5hbWUpIHtcbiAgICAgIHZhciBjbWQsIGosIGxlbiwgbmFtZSwgcmVmLCByZWYxLCBzcGFjZTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKTtcbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiAocmVmID0gdGhpcy5nZXRDbWQoc3BhY2UpKSAhPSBudWxsID8gcmVmLmdldENtZChuYW1lKSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIHJlZjEgPSB0aGlzLmNtZHM7XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYxLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGNtZCA9IHJlZjFbal07XG4gICAgICAgIGlmIChjbWQubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRDbWQoZnVsbG5hbWUsIG5ldyBDb21tYW5kKGZ1bGxuYW1lLnNwbGl0KCc6JykucG9wKCksIGRhdGEpKTtcbiAgICB9XG5cbiAgICBzZXRDbWQoZnVsbG5hbWUsIGNtZCkge1xuICAgICAgdmFyIG5hbWUsIG5leHQsIHNwYWNlO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKTtcbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIG5leHQgPSB0aGlzLmdldENtZChzcGFjZSk7XG4gICAgICAgIGlmIChuZXh0ID09IG51bGwpIHtcbiAgICAgICAgICBuZXh0ID0gdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoc3BhY2UpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSwgY21kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKGNtZCk7XG4gICAgICAgIHJldHVybiBjbWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkRGV0ZWN0b3IoZGV0ZWN0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmRldGVjdG9ycy5wdXNoKGRldGVjdG9yKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdENtZHMoKSB7XG4gICAgICB2YXIgaiwgbGVuLCBwcm92aWRlciwgcmVmLCByZXN1bHRzO1xuICAgICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCwge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnaGVsbG8nOiB7XG4gICAgICAgICAgICBoZWxwOiBcIlxcXCJIZWxsbywgd29ybGQhXFxcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxcbm1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xcbnZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYVwiLFxuICAgICAgICAgICAgcmVzdWx0OiAnSGVsbG8sIFdvcmxkISdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVmID0gdGhpcy5wcm92aWRlcnM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcHJvdmlkZXIgPSByZWZbal07XG4gICAgICAgIHJlc3VsdHMucHVzaChwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzYXZlQ21kKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSk7XG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlSW5QYXRoKCdjbWRzJywgZnVsbG5hbWUsIGRhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGxvYWRDbWRzKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgc2F2ZWRDbWRzO1xuICAgICAgICByZXR1cm4gc2F2ZWRDbWRzID0gdGhpcy5zdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgICAgIH0pLnRoZW4oKHNhdmVkQ21kcykgPT4ge1xuICAgICAgICB2YXIgZGF0YSwgZnVsbG5hbWUsIHJlc3VsdHM7XG4gICAgICAgIGlmIChzYXZlZENtZHMgIT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKGZ1bGxuYW1lIGluIHNhdmVkQ21kcykge1xuICAgICAgICAgICAgZGF0YSA9IHNhdmVkQ21kc1tmdWxsbmFtZV07XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldFNhdmVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlKCdjbWRzJywge30pO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYWtlVmFyQ21kKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHAsIHZhbDtcbiAgICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcbiAgICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZUJvb2xWYXJDbWQobmFtZSwgYmFzZSA9IHt9KSB7XG4gICAgICBiYXNlLmV4ZWN1dGUgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICB2YXIgcCwgdmFsO1xuICAgICAgICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuICAgICAgICBpZiAoISgodmFsICE9IG51bGwpICYmICh2YWwgPT09ICcwJyB8fCB2YWwgPT09ICdmYWxzZScgfHwgdmFsID09PSAnbm8nKSkpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgfTtcblxuICBDb21tYW5kLnByb3ZpZGVycyA9IFtdO1xuXG4gIENvbW1hbmQuc3RvcmFnZSA9IG5ldyBTdG9yYWdlKCk7XG5cbiAgcmV0dXJuIENvbW1hbmQ7XG5cbn0pLmNhbGwodGhpcyk7XG5cbmV4cG9ydCB2YXIgQmFzZUNvbW1hbmQgPSBjbGFzcyBCYXNlQ29tbWFuZCB7XG4gIGNvbnN0cnVjdG9yKGluc3RhbmNlMSkge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTE7XG4gIH1cblxuICBpbml0KCkge31cblxuICBcbiAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXNbXCJyZXN1bHRcIl0gIT0gbnVsbDtcbiAgfVxuXG4gIGdldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IENtZEZpbmRlciB9IGZyb20gJy4vQ21kRmluZGVyJztcbmltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBDb250ZXh0XG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlKSAtPlxuICAgIEBuYW1lU3BhY2VzID0gW11cbiAgXG4gIGFkZE5hbWVTcGFjZTogKG5hbWUpIC0+XG4gICAgaWYgbmFtZSBub3QgaW4gQG5hbWVTcGFjZXMgXG4gICAgICBAbmFtZVNwYWNlcy5wdXNoKG5hbWUpXG4gICAgICBAX25hbWVzcGFjZXMgPSBudWxsXG4gIGFkZE5hbWVzcGFjZXM6IChzcGFjZXMpIC0+XG4gICAgaWYgc3BhY2VzIFxuICAgICAgaWYgdHlwZW9mIHNwYWNlcyA9PSAnc3RyaW5nJ1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXVxuICAgICAgZm9yIHNwYWNlIGluIHNwYWNlcyBcbiAgICAgICAgQGFkZE5hbWVTcGFjZShzcGFjZSlcbiAgcmVtb3ZlTmFtZVNwYWNlOiAobmFtZSkgLT5cbiAgICBAbmFtZVNwYWNlcyA9IEBuYW1lU3BhY2VzLmZpbHRlciAobikgLT4gbiBpc250IG5hbWVcblxuICBnZXROYW1lU3BhY2VzOiAtPlxuICAgIHVubGVzcyBAX25hbWVzcGFjZXM/XG4gICAgICBucGNzID0gWydjb3JlJ10uY29uY2F0KEBuYW1lU3BhY2VzKVxuICAgICAgaWYgQHBhcmVudD9cbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KEBwYXJlbnQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgQF9uYW1lc3BhY2VzID0gQXJyYXlIZWxwZXIudW5pcXVlKG5wY3MpXG4gICAgcmV0dXJuIEBfbmFtZXNwYWNlc1xuICBnZXRDbWQ6IChjbWROYW1lLG9wdGlvbnMgPSB7fSkgLT5cbiAgICBmaW5kZXIgPSBAZ2V0RmluZGVyKGNtZE5hbWUsb3B0aW9ucylcbiAgICByZXR1cm4gZmluZGVyLmZpbmQoKVxuICBnZXRGaW5kZXI6IChjbWROYW1lLG9wdGlvbnMgPSB7fSkgLT5cbiAgICByZXR1cm4gbmV3IENtZEZpbmRlcihjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdXG4gICAgICB1c2VEZXRlY3RvcnM6IEBpc1Jvb3QoKVxuICAgICAgY29kZXdhdmU6IEBjb2Rld2F2ZVxuICAgICAgcGFyZW50Q29udGV4dDogdGhpc1xuICAgIH0sb3B0aW9ucykpXG4gIGlzUm9vdDogLT5cbiAgICByZXR1cm4gIUBwYXJlbnQ/XG4gIGdldFBhcmVudE9yUm9vdDogKCkgLT5cbiAgICBpZiBAcGFyZW50P1xuICAgICAgQHBhcmVudFxuICAgIGVsc2VcbiAgICAgIHRoaXNcbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIGNjLmluZGV4T2YoJyVzJykgPiAtMVxuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJyxzdHIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgd3JhcENvbW1lbnRMZWZ0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLGkpICsgc3RyXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gIHdyYXBDb21tZW50UmlnaHQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkrMilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2NcbiAgY21kSW5zdGFuY2VGb3I6IChjbWQpIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsdGhpcylcbiAgZ2V0Q29tbWVudENoYXI6IC0+XG4gICAgaWYgQGNvbW1lbnRDaGFyP1xuICAgICAgcmV0dXJuIEBjb21tZW50Q2hhclxuICAgIGNtZCA9IEBnZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG4gICAgaWYgY21kP1xuICAgICAgaW5zdCA9IEBjbWRJbnN0YW5jZUZvcihjbWQpXG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnXG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICBAY29tbWVudENoYXIgPSBjaGFyXG4gICAgcmV0dXJuIEBjb21tZW50Q2hhciIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgQ21kRmluZGVyXG59IGZyb20gJy4vQ21kRmluZGVyJztcblxuaW1wb3J0IHtcbiAgQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5cbmltcG9ydCB7XG4gIEFycmF5SGVscGVyXG59IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5cbmV4cG9ydCB2YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSkge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTtcbiAgICB0aGlzLm5hbWVTcGFjZXMgPSBbXTtcbiAgfVxuXG4gIGFkZE5hbWVTcGFjZShuYW1lKSB7XG4gICAgaWYgKGluZGV4T2YuY2FsbCh0aGlzLm5hbWVTcGFjZXMsIG5hbWUpIDwgMCkge1xuICAgICAgdGhpcy5uYW1lU3BhY2VzLnB1c2gobmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYWRkTmFtZXNwYWNlcyhzcGFjZXMpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzLCBzcGFjZTtcbiAgICBpZiAoc3BhY2VzKSB7XG4gICAgICBpZiAodHlwZW9mIHNwYWNlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3BhY2VzID0gW3NwYWNlc107XG4gICAgICB9XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBzcGFjZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgc3BhY2UgPSBzcGFjZXNbal07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZE5hbWVTcGFjZShzcGFjZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTmFtZVNwYWNlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lU3BhY2VzID0gdGhpcy5uYW1lU3BhY2VzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbiAhPT0gbmFtZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldE5hbWVTcGFjZXMoKSB7XG4gICAgdmFyIG5wY3M7XG4gICAgaWYgKHRoaXMuX25hbWVzcGFjZXMgPT0gbnVsbCkge1xuICAgICAgbnBjcyA9IFsnY29yZSddLmNvbmNhdCh0aGlzLm5hbWVTcGFjZXMpO1xuICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KHRoaXMucGFyZW50LmdldE5hbWVTcGFjZXMoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9uYW1lc3BhY2VzID0gQXJyYXlIZWxwZXIudW5pcXVlKG5wY3MpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcztcbiAgfVxuXG4gIGdldENtZChjbWROYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMpO1xuICAgIHJldHVybiBmaW5kZXIuZmluZCgpO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgbmFtZXNwYWNlczogW10sXG4gICAgICB1c2VEZXRlY3RvcnM6IHRoaXMuaXNSb290KCksXG4gICAgICBjb2Rld2F2ZTogdGhpcy5jb2Rld2F2ZSxcbiAgICAgIHBhcmVudENvbnRleHQ6IHRoaXNcbiAgICB9LCBvcHRpb25zKSk7XG4gIH1cblxuICBpc1Jvb3QoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09IG51bGw7XG4gIH1cblxuICBnZXRQYXJlbnRPclJvb3QoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnQoc3RyKSB7XG4gICAgdmFyIGNjO1xuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpO1xuICAgIGlmIChjYy5pbmRleE9mKCclcycpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsIHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50TGVmdChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gY2Muc3Vic3RyKDAsIGkpICsgc3RyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHI7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnRSaWdodChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkgKyAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIGNtZEluc3RhbmNlRm9yKGNtZCkge1xuICAgIHJldHVybiBuZXcgQ21kSW5zdGFuY2UoY21kLCB0aGlzKTtcbiAgfVxuXG4gIGdldENvbW1lbnRDaGFyKCkge1xuICAgIHZhciBjaGFyLCBjbWQsIGluc3QsIHJlcztcbiAgICBpZiAodGhpcy5jb21tZW50Q2hhciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgICB9XG4gICAgY21kID0gdGhpcy5nZXRDbWQoJ2NvbW1lbnQnKTtcbiAgICBjaGFyID0gJzwhLS0gJXMgLS0+JztcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGluc3QgPSB0aGlzLmNtZEluc3RhbmNlRm9yKGNtZCk7XG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnO1xuICAgICAgcmVzID0gaW5zdC5yZXN1bHQoKTtcbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICBjaGFyID0gcmVzO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbW1lbnRDaGFyID0gY2hhcjtcbiAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUGFpciB9IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCBjbGFzcyBEZXRlY3RvclxuICBjb25zdHJ1Y3RvcjogKEBkYXRhPXt9KSAtPlxuICBkZXRlY3Q6IChmaW5kZXIpIC0+XG4gICAgaWYgQGRldGVjdGVkKGZpbmRlcilcbiAgICAgIHJldHVybiBAZGF0YS5yZXN1bHQgaWYgQGRhdGEucmVzdWx0P1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBAZGF0YS5lbHNlIGlmIEBkYXRhLmVsc2U/XG4gIGRldGVjdGVkOiAoZmluZGVyKSAtPlxuICAgICNcblxuZXhwb3J0IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yXG4gIGRldGVjdDogKGZpbmRlcikgLT5cbiAgICBpZiBmaW5kZXIuY29kZXdhdmU/IFxuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpXG4gICAgICBpZiBsYW5nPyBcbiAgICAgICAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKVxuICAgICAgICBcbmV4cG9ydCBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvclxuICBkZXRlY3RlZDogKGZpbmRlcikgLT5cbiAgICBpZiBAZGF0YS5vcGVuZXI/IGFuZCBAZGF0YS5jbG9zZXI/IGFuZCBmaW5kZXIuaW5zdGFuY2U/XG4gICAgICBwYWlyID0gbmV3IFBhaXIoQGRhdGEub3BlbmVyLCBAZGF0YS5jbG9zZXIsIEBkYXRhKVxuICAgICAgaWYgcGFpci5pc1dhcHBlck9mKGZpbmRlci5pbnN0YW5jZS5nZXRQb3MoKSwgZmluZGVyLmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gICAgICAiLCJpbXBvcnQge1xuICBQYWlyXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCB2YXIgRGV0ZWN0b3IgPSBjbGFzcyBEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEgPSB7fSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cblxuICBkZXRlY3QoZmluZGVyKSB7XG4gICAgaWYgKHRoaXMuZGV0ZWN0ZWQoZmluZGVyKSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5yZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnJlc3VsdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZGF0YS5lbHNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5lbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRldGVjdGVkKGZpbmRlcikge31cblxufTtcblxuXG5leHBvcnQgdmFyIExhbmdEZXRlY3RvciA9IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIHZhciBsYW5nO1xuICAgIGlmIChmaW5kZXIuY29kZXdhdmUgIT0gbnVsbCkge1xuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpO1xuICAgICAgaWYgKGxhbmcgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG5leHBvcnQgdmFyIFBhaXJEZXRlY3RvciA9IGNsYXNzIFBhaXJEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0ZWQoZmluZGVyKSB7XG4gICAgdmFyIHBhaXI7XG4gICAgaWYgKCh0aGlzLmRhdGEub3BlbmVyICE9IG51bGwpICYmICh0aGlzLmRhdGEuY2xvc2VyICE9IG51bGwpICYmIChmaW5kZXIuaW5zdGFuY2UgIT0gbnVsbCkpIHtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcih0aGlzLmRhdGEub3BlbmVyLCB0aGlzLmRhdGEuY2xvc2VyLCB0aGlzLmRhdGEpO1xuICAgICAgaWYgKHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEVkaXRDbWRQcm9wXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsb3B0aW9ucykgLT5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICd2YXInIDogbnVsbCxcbiAgICAgICdvcHQnIDogbnVsbCxcbiAgICAgICdmdW5jdCcgOiBudWxsLFxuICAgICAgJ2RhdGFOYW1lJyA6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JyA6IGZhbHNlLFxuICAgICAgJ2NhcnJldCcgOiBmYWxzZSxcbiAgICB9XG4gICAgZm9yIGtleSBpbiBbJ3ZhcicsJ29wdCcsJ2Z1bmN0J11cbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIGRlZmF1bHRzWydkYXRhTmFtZSddID0gb3B0aW9uc1trZXldXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICAgIFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKEBuYW1lKVxuICBcbiAgd3JpdGVGb3I6IChwYXJzZXIsb2JqKSAtPlxuICAgIGlmIHBhcnNlci52YXJzW0BuYW1lXT9cbiAgICAgIG9ialtAZGF0YU5hbWVdID0gcGFyc2VyLnZhcnNbQG5hbWVdXG4gIHZhbEZyb21DbWQ6IChjbWQpIC0+XG4gICAgaWYgY21kP1xuICAgICAgaWYgQG9wdD9cbiAgICAgICAgcmV0dXJuIGNtZC5nZXRPcHRpb24oQG9wdClcbiAgICAgIGlmIEBmdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZFtAZnVuY3RdKClcbiAgICAgIGlmIEB2YXI/XG4gICAgICAgIHJldHVybiBjbWRbQHZhcl1cbiAgc2hvd0ZvckNtZDogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIEBzaG93RW1wdHkgb3IgdmFsP1xuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIGlmIEBzaG93Rm9yQ21kKGNtZClcbiAgICAgIFwiXCJcIlxuICAgICAgfn4je0BuYW1lfX5+XG4gICAgICAje0B2YWxGcm9tQ21kKGNtZCkgb3IgXCJcIn0je2lmIEBjYXJyZXQgdGhlbiBcInxcIiBlbHNlIFwiXCJ9XG4gICAgICB+fi8je0BuYW1lfX5+XG4gICAgICBcIlwiXCJcbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnNvdXJjZSBleHRlbmRzIEVkaXRDbWRQcm9wIFxuICB2YWxGcm9tQ21kOiAoY21kKS0+XG4gICAgcmVzID0gc3VwZXIoY21kKVxuICAgIGlmIHJlcz9cbiAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKC9cXHwvZywgJ3x8JylcbiAgICByZXR1cm4gcmVzXG4gIHNldENtZDogKGNtZHMpLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZChAbmFtZSx7J3ByZXZlbnRQYXJzZUFsbCcgOiB0cnVlfSlcbiAgc2hvd0ZvckNtZDogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIChAc2hvd0VtcHR5IGFuZCAhKGNtZD8gYW5kIGNtZC5hbGlhc09mPykpIG9yIHZhbD9cbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnN0cmluZyBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgaWYgQHZhbEZyb21DbWQoY21kKT9cbiAgICAgIHJldHVybiBcIn5+ISN7QG5hbWV9ICcje0B2YWxGcm9tQ21kKGNtZCl9I3tpZiBAY2FycmV0IHRoZW4gXCJ8XCIgZWxzZSBcIlwifSd+flwiXG4gICAgXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5yZXZCb29sIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgc2V0Q21kOiAoY21kcykgLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQoQG5hbWUpXG4gIHdyaXRlRm9yOiAocGFyc2VyLG9iaikgLT5cbiAgICBpZiBwYXJzZXIudmFyc1tAbmFtZV0/XG4gICAgICBvYmpbQGRhdGFOYW1lXSA9ICFwYXJzZXIudmFyc1tAbmFtZV1cbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgaWYgdmFsPyBhbmQgIXZhbFxuICAgICAgcmV0dXJuIFwifn4hI3tAbmFtZX1+flwiXG5cbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLmJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZChAbmFtZSlcbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICBcIn5+ISN7QG5hbWV9fn5cIiBpZiBAdmFsRnJvbUNtZChjbWQpIiwiaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIEVkaXRDbWRQcm9wID0gY2xhc3MgRWRpdENtZFByb3Age1xuICBjb25zdHJ1Y3RvcihuYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBpLCBrZXksIGxlbiwgcmVmLCB2YWw7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICd2YXInOiBudWxsLFxuICAgICAgJ29wdCc6IG51bGwsXG4gICAgICAnZnVuY3QnOiBudWxsLFxuICAgICAgJ2RhdGFOYW1lJzogbnVsbCxcbiAgICAgICdzaG93RW1wdHknOiBmYWxzZSxcbiAgICAgICdjYXJyZXQnOiBmYWxzZVxuICAgIH07XG4gICAgcmVmID0gWyd2YXInLCAnb3B0JywgJ2Z1bmN0J107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBrZXkgPSByZWZbaV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgZGVmYXVsdHNbJ2RhdGFOYW1lJ10gPSBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIHdyaXRlRm9yKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9ialt0aGlzLmRhdGFOYW1lXSA9IHBhcnNlci52YXJzW3RoaXMubmFtZV07XG4gICAgfVxuICB9XG5cbiAgdmFsRnJvbUNtZChjbWQpIHtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLm9wdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZ2V0T3B0aW9uKHRoaXMub3B0KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLmZ1bmN0XSgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudmFyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLnZhcl07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2hvd0ZvckNtZChjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIHJldHVybiB0aGlzLnNob3dFbXB0eSB8fCAodmFsICE9IG51bGwpO1xuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy5zaG93Rm9yQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4ke3RoaXMubmFtZX1+flxcbiR7dGhpcy52YWxGcm9tQ21kKGNtZCkgfHwgXCJcIn0keyh0aGlzLmNhcnJldCA/IFwifFwiIDogXCJcIil9XFxufn4vJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5zb3VyY2UgPSBjbGFzcyBzb3VyY2UgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHZhbEZyb21DbWQoY21kKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBzdXBlci52YWxGcm9tQ21kKGNtZCk7XG4gICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICByZXMgPSByZXMucmVwbGFjZSgvXFx8L2csICd8fCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSwge1xuICAgICAgJ3ByZXZlbnRQYXJzZUFsbCc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHNob3dGb3JDbWQoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICByZXR1cm4gKHRoaXMuc2hvd0VtcHR5ICYmICEoKGNtZCAhPSBudWxsKSAmJiAoY21kLmFsaWFzT2YgIT0gbnVsbCkpKSB8fCAodmFsICE9IG51bGwpO1xuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLnN0cmluZyA9IGNsYXNzIHN0cmluZyBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX0gJyR7dGhpcy52YWxGcm9tQ21kKGNtZCl9JHsodGhpcy5jYXJyZXQgPyBcInxcIiA6IFwiXCIpfSd+fmA7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLnJldkJvb2wgPSBjbGFzcyByZXZCb29sIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICB3cml0ZUZvcihwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbdGhpcy5uYW1lXTtcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG4gICAgaWYgKCh2YWwgIT0gbnVsbCkgJiYgIXZhbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLmJvb2wgPSBjbGFzcyBib29sIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnZhbEZyb21DbWQoY21kKSkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5pbXBvcnQgeyBvcHRpb25hbFByb21pc2UgfSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IGNsYXNzIEVkaXRvclxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAbmFtZXNwYWNlID0gbnVsbFxuICAgIEBfbGFuZyA9IG51bGxcbiAgYmluZGVkVG86IChjb2Rld2F2ZSkgLT5cbiAgICAjXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dExlbjogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRTdWJzdHI6IChzdGFydCwgZW5kKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgaW5zZXJ0VGV4dEF0OiAodGV4dCwgcG9zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kID0gbnVsbCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGJlZ2luVW5kb0FjdGlvbjogLT5cbiAgICAjXG4gIGVuZFVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBnZXRMYW5nOiAtPlxuICAgIHJldHVybiBAX2xhbmdcbiAgc2V0TGFuZzogKHZhbCkgLT5cbiAgICBAX2xhbmcgPSB2YWxcbiAgZ2V0RW1tZXRDb250ZXh0T2JqZWN0OiAtPlxuICAgIHJldHVybiBudWxsXG4gIGFsbG93TXVsdGlTZWxlY3Rpb246IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIHNldE11bHRpU2VsOiAoc2VsZWN0aW9ucykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGdldE11bHRpU2VsOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgY2FuTGlzdGVuVG9DaGFuZ2U6IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIGFkZENoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgXG4gIGdldExpbmVBdDogKHBvcykgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAZmluZExpbmVTdGFydChwb3MpLEBmaW5kTGluZUVuZChwb3MpKVxuICBmaW5kTGluZVN0YXJ0OiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCJdLCAtMSlcbiAgICByZXR1cm4gaWYgcCB0aGVuIHAucG9zKzEgZWxzZSAwXG4gIGZpbmRMaW5lRW5kOiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCIsXCJcXHJcIl0pXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcyBlbHNlIEB0ZXh0TGVuKClcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBpZiBkaXJlY3Rpb24gPiAwXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoc3RhcnQsQHRleHRMZW4oKSlcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoMCxzdGFydClcbiAgICBiZXN0UG9zID0gbnVsbFxuICAgIGZvciBzdHJpIGluIHN0cmluZ3NcbiAgICAgIHBvcyA9IGlmIGRpcmVjdGlvbiA+IDAgdGhlbiB0ZXh0LmluZGV4T2Yoc3RyaSkgZWxzZSB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpXG4gICAgICBpZiBwb3MgIT0gLTFcbiAgICAgICAgaWYgIWJlc3RQb3M/IG9yIGJlc3RQb3MqZGlyZWN0aW9uID4gcG9zKmRpcmVjdGlvblxuICAgICAgICAgIGJlc3RQb3MgPSBwb3NcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaVxuICAgIGlmIGJlc3RTdHI/XG4gICAgICByZXR1cm4gbmV3IFN0clBvcygoaWYgZGlyZWN0aW9uID4gMCB0aGVuIGJlc3RQb3MgKyBzdGFydCBlbHNlIGJlc3RQb3MpLGJlc3RTdHIpXG4gICAgcmV0dXJuIG51bGxcbiAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzOiAocmVwbGFjZW1lbnRzKSAtPlxuICAgIHJlcGxhY2VtZW50cy5yZWR1Y2UoKHByb21pc2UscmVwbCk9PlxuICAgICAgICBwcm9taXNlLnRoZW4gKG9wdCk9PlxuICAgICAgICAgIHJlcGwud2l0aEVkaXRvcih0aGlzKVxuICAgICAgICAgIHJlcGwuYXBwbHlPZmZzZXQob3B0Lm9mZnNldClcbiAgICAgICAgICBvcHRpb25hbFByb21pc2UocmVwbC5hcHBseSgpKS50aGVuID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlbGVjdGlvbnM6IG9wdC5zZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpLFxuICAgICAgICAgICAgICBvZmZzZXQ6IG9wdC5vZmZzZXQrcmVwbC5vZmZzZXRBZnRlcih0aGlzKSBcbiAgICAgICAgICAgIH1cbiAgICAgICwgb3B0aW9uYWxQcm9taXNlKHtzZWxlY3Rpb25zOiBbXSxvZmZzZXQ6IDB9KSlcbiAgICAudGhlbiAob3B0KT0+XG4gICAgICBAYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKG9wdC5zZWxlY3Rpb25zKVxuICAgIC5yZXN1bHQoKVxuICAgIFxuICAgICAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9uczogKHNlbGVjdGlvbnMpIC0+XG4gICAgaWYgc2VsZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICBpZiBAYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgICAgIEBzZXRNdWx0aVNlbChzZWxlY3Rpb25zKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0Q3Vyc29yUG9zKHNlbGVjdGlvbnNbMF0uc3RhcnQsc2VsZWN0aW9uc1swXS5lbmQpIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgU3RyUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcblxuaW1wb3J0IHtcbiAgb3B0aW9uYWxQcm9taXNlXG59IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgdmFyIEVkaXRvciA9IGNsYXNzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubmFtZXNwYWNlID0gbnVsbDtcbiAgICB0aGlzLl9sYW5nID0gbnVsbDtcbiAgfVxuXG4gIGJpbmRlZFRvKGNvZGV3YXZlKSB7fVxuXG4gIFxuICB0ZXh0KHZhbCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0TGVuKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0U3Vic3RyKHN0YXJ0LCBlbmQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgaW5zZXJ0VGV4dEF0KHRleHQsIHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCA9IG51bGwpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgYmVnaW5VbmRvQWN0aW9uKCkge31cblxuICBcbiAgZW5kVW5kb0FjdGlvbigpIHt9XG5cbiAgXG4gIGdldExhbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhbmc7XG4gIH1cblxuICBzZXRMYW5nKHZhbCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nID0gdmFsO1xuICB9XG5cbiAgZ2V0RW1tZXRDb250ZXh0T2JqZWN0KCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYWxsb3dNdWx0aVNlbGVjdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzZXRNdWx0aVNlbChzZWxlY3Rpb25zKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGdldE11bHRpU2VsKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBjYW5MaXN0ZW5Ub0NoYW5nZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRMaW5lQXQocG9zKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5maW5kTGluZVN0YXJ0KHBvcyksIHRoaXMuZmluZExpbmVFbmQocG9zKSk7XG4gIH1cblxuICBmaW5kTGluZVN0YXJ0KHBvcykge1xuICAgIHZhciBwO1xuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW1wiXFxuXCJdLCAtMSk7XG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcyArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRMaW5lRW5kKHBvcykge1xuICAgIHZhciBwO1xuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW1wiXFxuXCIsIFwiXFxyXCJdKTtcbiAgICBpZiAocCkge1xuICAgICAgcmV0dXJuIHAucG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0TGVuKCk7XG4gICAgfVxuICB9XG5cbiAgZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICB2YXIgYmVzdFBvcywgYmVzdFN0ciwgaSwgbGVuLCBwb3MsIHN0cmksIHRleHQ7XG4gICAgaWYgKGRpcmVjdGlvbiA+IDApIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQsIHRoaXMudGV4dExlbigpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cigwLCBzdGFydCk7XG4gICAgfVxuICAgIGJlc3RQb3MgPSBudWxsO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHN0cmluZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0cmkgPSBzdHJpbmdzW2ldO1xuICAgICAgcG9zID0gZGlyZWN0aW9uID4gMCA/IHRleHQuaW5kZXhPZihzdHJpKSA6IHRleHQubGFzdEluZGV4T2Yoc3RyaSk7XG4gICAgICBpZiAocG9zICE9PSAtMSkge1xuICAgICAgICBpZiAoKGJlc3RQb3MgPT0gbnVsbCkgfHwgYmVzdFBvcyAqIGRpcmVjdGlvbiA+IHBvcyAqIGRpcmVjdGlvbikge1xuICAgICAgICAgIGJlc3RQb3MgPSBwb3M7XG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJlc3RTdHIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoKGRpcmVjdGlvbiA+IDAgPyBiZXN0UG9zICsgc3RhcnQgOiBiZXN0UG9zKSwgYmVzdFN0cik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VtZW50cy5yZWR1Y2UoKHByb21pc2UsIHJlcGwpID0+IHtcbiAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKG9wdCkgPT4ge1xuICAgICAgICByZXBsLndpdGhFZGl0b3IodGhpcyk7XG4gICAgICAgIHJlcGwuYXBwbHlPZmZzZXQob3B0Lm9mZnNldCk7XG4gICAgICAgIHJldHVybiBvcHRpb25hbFByb21pc2UocmVwbC5hcHBseSgpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0aW9uczogb3B0LnNlbGVjdGlvbnMuY29uY2F0KHJlcGwuc2VsZWN0aW9ucyksXG4gICAgICAgICAgICBvZmZzZXQ6IG9wdC5vZmZzZXQgKyByZXBsLm9mZnNldEFmdGVyKHRoaXMpXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LCBvcHRpb25hbFByb21pc2Uoe1xuICAgICAgc2VsZWN0aW9uczogW10sXG4gICAgICBvZmZzZXQ6IDBcbiAgICB9KSkudGhlbigob3B0KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMob3B0LnNlbGVjdGlvbnMpO1xuICAgIH0pLnJlc3VsdCgpO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKHNlbGVjdGlvbnMpIHtcbiAgICBpZiAoc2VsZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TXVsdGlTZWwoc2VsZWN0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCwgc2VsZWN0aW9uc1swXS5lbmQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIExvZ2dlclxuICBAZW5hYmxlZCA9IHRydWVcbiAgbG9nOiAoYXJncy4uLikgLT5cbiAgICBpZiBAaXNFbmFibGVkKClcbiAgICAgIGZvciBtc2cgaW4gYXJnc1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpXG4gIGlzRW5hYmxlZDogLT5cbiAgICBjb25zb2xlPy5sb2c/IGFuZCB0aGlzLmVuYWJsZWQgYW5kIExvZ2dlci5lbmFibGVkXG4gIGVuYWJsZWQ6IHRydWVcbiAgcnVudGltZTogKGZ1bmN0LG5hbWUgPSBcImZ1bmN0aW9uXCIpIC0+XG4gICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlcyA9IGZ1bmN0KClcbiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgY29uc29sZS5sb2coXCIje25hbWV9IHRvb2sgI3t0MSAtIHQwfSBtaWxsaXNlY29uZHMuXCIpXG4gICAgcmVzXG4gIG1vbml0b3JEYXRhOiB7fVxuICB0b01vbml0b3I6IChvYmosbmFtZSxwcmVmaXg9JycpIC0+XG4gICAgZnVuY3QgPSBvYmpbbmFtZV1cbiAgICBvYmpbbmFtZV0gPSAtPiBcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICAgIHRoaXMubW9uaXRvcigoLT4gZnVuY3QuYXBwbHkob2JqLGFyZ3MpKSxwcmVmaXgrbmFtZSlcbiAgbW9uaXRvcjogKGZ1bmN0LG5hbWUpIC0+XG4gICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlcyA9IGZ1bmN0KClcbiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgaWYgdGhpcy5tb25pdG9yRGF0YVtuYW1lXT9cbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrK1xuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCs9IHQxIC0gdDBcbiAgICBlbHNlXG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdID0ge1xuICAgICAgICBjb3VudDogMVxuICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgfVxuICAgIHJlc1xuICByZXN1bWU6IC0+XG4gICAgY29uc29sZS5sb2codGhpcy5tb25pdG9yRGF0YSlcbiIsImV4cG9ydCB2YXIgTG9nZ2VyID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBMb2dnZXIge1xuICAgIGxvZyguLi5hcmdzKSB7XG4gICAgICB2YXIgaSwgbGVuLCBtc2csIHJlc3VsdHM7XG4gICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBtc2cgPSBhcmdzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjb25zb2xlLmxvZyhtc2cpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICByZXR1cm4gKCh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlICE9PSBudWxsID8gY29uc29sZS5sb2cgOiB2b2lkIDApICE9IG51bGwpICYmIHRoaXMuZW5hYmxlZCAmJiBMb2dnZXIuZW5hYmxlZDtcbiAgICB9XG5cbiAgICBydW50aW1lKGZ1bmN0LCBuYW1lID0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDE7XG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgcmVzID0gZnVuY3QoKTtcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfSB0b29rICR7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLmApO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICB0b01vbml0b3Iob2JqLCBuYW1lLCBwcmVmaXggPSAnJykge1xuICAgICAgdmFyIGZ1bmN0O1xuICAgICAgZnVuY3QgPSBvYmpbbmFtZV07XG4gICAgICByZXR1cm4gb2JqW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gdGhpcy5tb25pdG9yKChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3QuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgfSksIHByZWZpeCArIG5hbWUpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBtb25pdG9yKGZ1bmN0LCBuYW1lKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDE7XG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgcmVzID0gZnVuY3QoKTtcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBpZiAodGhpcy5tb25pdG9yRGF0YVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrKztcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCArPSB0MSAtIHQwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICByZXN1bWUoKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2codGhpcy5tb25pdG9yRGF0YSk7XG4gICAgfVxuXG4gIH07XG5cbiAgTG9nZ2VyLmVuYWJsZWQgPSB0cnVlO1xuXG4gIExvZ2dlci5wcm90b3R5cGUuZW5hYmxlZCA9IHRydWU7XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5tb25pdG9yRGF0YSA9IHt9O1xuXG4gIHJldHVybiBMb2dnZXI7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJleHBvcnQgY2xhc3MgT3B0aW9uT2JqZWN0XG4gIHNldE9wdHM6IChvcHRpb25zLGRlZmF1bHRzKS0+XG4gICAgQGRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICBAc2V0T3B0KGtleSxvcHRpb25zW2tleV0pXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRPcHQoa2V5LHZhbClcbiAgICAgICAgXG4gIHNldE9wdDogKGtleSwgdmFsKS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgdGhpc1trZXldKHZhbClcbiAgICBlbHNlXG4gICAgICB0aGlzW2tleV09IHZhbFxuICAgICAgICBcbiAgZ2V0T3B0OiAoa2V5KS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXNba2V5XVxuICBcbiAgZ2V0T3B0czogLT5cbiAgICBvcHRzID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRzW2tleV0gPSBAZ2V0T3B0KGtleSlcbiAgICByZXR1cm4gb3B0cyIsImV4cG9ydCB2YXIgT3B0aW9uT2JqZWN0ID0gY2xhc3MgT3B0aW9uT2JqZWN0IHtcbiAgc2V0T3B0cyhvcHRpb25zLCBkZWZhdWx0cykge1xuICAgIHZhciBrZXksIHJlZiwgcmVzdWx0cywgdmFsO1xuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIG9wdGlvbnNba2V5XSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc2V0T3B0KGtleSwgdmFsKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgc2V0T3B0KGtleSwgdmFsKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdChrZXkpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXNba2V5XSkgIT0gbnVsbCA/IHJlZi5jYWxsIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV07XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0cygpIHtcbiAgICB2YXIga2V5LCBvcHRzLCByZWYsIHZhbDtcbiAgICBvcHRzID0ge307XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgb3B0c1trZXldID0gdGhpcy5nZXRPcHQoa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdHM7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuL0JveEhlbHBlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsQHBvcyxAc3RyKSAtPlxuICAgIHN1cGVyKClcbiAgICB1bmxlc3MgQGlzRW1wdHkoKVxuICAgICAgQF9jaGVja0Nsb3NlcigpXG4gICAgICBAb3BlbmluZyA9IEBzdHJcbiAgICAgIEBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICAgIEBfc3BsaXRDb21wb25lbnRzKClcbiAgICAgIEBfZmluZENsb3NpbmcoKVxuICAgICAgQF9jaGVja0Vsb25nYXRlZCgpXG4gIF9jaGVja0Nsb3NlcjogLT5cbiAgICBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICBpZiBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5jbG9zZUNoYXIgYW5kIGYgPSBAX2ZpbmRPcGVuaW5nUG9zKClcbiAgICAgIEBjbG9zaW5nUG9zID0gbmV3IFN0clBvcyhAcG9zLCBAc3RyKVxuICAgICAgQHBvcyA9IGYucG9zXG4gICAgICBAc3RyID0gZi5zdHJcbiAgX2ZpbmRPcGVuaW5nUG9zOiAtPlxuICAgIGNtZE5hbWUgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cikuc3Vic3RyaW5nKEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKVxuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWVcbiAgICBjbG9zaW5nID0gQHN0clxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zLG9wZW5pbmcsY2xvc2luZywtMSlcbiAgICAgIGYuc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcytmLnN0ci5sZW5ndGgpK0Bjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgICAgIHJldHVybiBmXG4gIF9zcGxpdENvbXBvbmVudHM6IC0+XG4gICAgcGFydHMgPSBAbm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICBAY21kTmFtZSA9IHBhcnRzLnNoaWZ0KClcbiAgICBAcmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIilcbiAgX3BhcnNlUGFyYW1zOihwYXJhbXMpIC0+XG4gICAgQHBhcmFtcyA9IFtdXG4gICAgQG5hbWVkID0gQGdldERlZmF1bHRzKClcbiAgICBpZiBAY21kP1xuICAgICAgbmFtZVRvUGFyYW0gPSBAZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpXG4gICAgICBpZiBuYW1lVG9QYXJhbT8gXG4gICAgICAgIEBuYW1lZFtuYW1lVG9QYXJhbV0gPSBAY21kTmFtZVxuICAgIGlmIHBhcmFtcy5sZW5ndGhcbiAgICAgIGFsbG93ZWROYW1lZCA9IEBnZXRPcHRpb24oJ2FsbG93ZWROYW1lZCcpXG4gICAgICBpblN0ciA9IGZhbHNlXG4gICAgICBwYXJhbSA9ICcnXG4gICAgICBuYW1lID0gZmFsc2VcbiAgICAgIGZvciBpIGluIFswLi4ocGFyYW1zLmxlbmd0aC0xKV1cbiAgICAgICAgY2hyID0gcGFyYW1zW2ldXG4gICAgICAgIGlmIGNociA9PSAnICcgYW5kICFpblN0clxuICAgICAgICAgIGlmKG5hbWUpXG4gICAgICAgICAgICBAbmFtZWRbbmFtZV0gPSBwYXJhbVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBwYXJhbXMucHVzaChwYXJhbSlcbiAgICAgICAgICBwYXJhbSA9ICcnXG4gICAgICAgICAgbmFtZSA9IGZhbHNlXG4gICAgICAgIGVsc2UgaWYgY2hyIGluIFsnXCInLFwiJ1wiXSBhbmQgKGkgPT0gMCBvciBwYXJhbXNbaS0xXSAhPSAnXFxcXCcpXG4gICAgICAgICAgaW5TdHIgPSAhaW5TdHJcbiAgICAgICAgZWxzZSBpZiBjaHIgPT0gJzonIGFuZCAhbmFtZSBhbmQgIWluU3RyIGFuZCAoIWFsbG93ZWROYW1lZD8gb3IgcGFyYW0gaW4gYWxsb3dlZE5hbWVkKVxuICAgICAgICAgIG5hbWUgPSBwYXJhbVxuICAgICAgICAgIHBhcmFtID0gJydcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBhcmFtICs9IGNoclxuICAgICAgaWYgcGFyYW0ubGVuZ3RoXG4gICAgICAgIGlmKG5hbWUpXG4gICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBwYXJhbXMucHVzaChwYXJhbSlcbiAgX2ZpbmRDbG9zaW5nOiAtPlxuICAgIGlmIGYgPSBAX2ZpbmRDbG9zaW5nUG9zKClcbiAgICAgIEBjb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUoQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MrQHN0ci5sZW5ndGgsZi5wb3MpKVxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGYucG9zK2Yuc3RyLmxlbmd0aClcbiAgX2ZpbmRDbG9zaW5nUG9zOiAtPlxuICAgIHJldHVybiBAY2xvc2luZ1BvcyBpZiBAY2xvc2luZ1Bvcz9cbiAgICBjbG9zaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZE5hbWUgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjbWROYW1lXG4gICAgaWYgZiA9IEBjb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKEBwb3MrQHN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpXG4gICAgICByZXR1cm4gQGNsb3NpbmdQb3MgPSBmXG4gIF9jaGVja0Vsb25nYXRlZDogLT5cbiAgICBlbmRQb3MgPSBAZ2V0RW5kUG9zKClcbiAgICBtYXggPSBAY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKVxuICAgIHdoaWxlIGVuZFBvcyA8IG1heCBhbmQgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyxlbmRQb3MrQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PSBAY29kZXdhdmUuZGVjb1xuICAgICAgZW5kUG9zKz1AY29kZXdhdmUuZGVjby5sZW5ndGhcbiAgICBpZiBlbmRQb3MgPj0gbWF4IG9yIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIEBjb2Rld2F2ZS5kZWNvLmxlbmd0aCkgaW4gWycgJyxcIlxcblwiLFwiXFxyXCJdXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICBfY2hlY2tCb3g6IC0+XG4gICAgaWYgQGNvZGV3YXZlLmluSW5zdGFuY2U/IGFuZCBAY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PSAnY29tbWVudCdcbiAgICAgIHJldHVyblxuICAgIGNsID0gQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KClcbiAgICBjciA9IEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKVxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKSArIGNyLmxlbmd0aFxuICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zIC0gY2wubGVuZ3RoLEBwb3MpID09IGNsIGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLGVuZFBvcykgPT0gY3JcbiAgICAgIEBwb3MgPSBAcG9zIC0gY2wubGVuZ3RoXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICAgICAgQF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICAgIGVsc2UgaWYgQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgYW5kIEBnZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xXG4gICAgICBAaW5Cb3ggPSAxXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQ6IC0+XG4gICAgaWYgQGNvbnRlbnRcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29kZXdhdmUuZGVjbylcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86I3tlZH0pKyN7ZWNyfSRcIiwgXCJnbVwiKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChcIl5cXFxccyooPzoje2VkfSkqI3tlY3J9XFxyP1xcblwiKVxuICAgICAgcmUzID0gbmV3IFJlZ0V4cChcIlxcblxcXFxzKiN7ZWNsfSg/OiN7ZWR9KSpcXFxccyokXCIpXG4gICAgICBAY29udGVudCA9IEBjb250ZW50LnJlcGxhY2UocmUxLCckMScpLnJlcGxhY2UocmUyLCcnKS5yZXBsYWNlKHJlMywnJylcbiAgX2dldFBhcmVudENtZHM6IC0+XG4gICAgQHBhcmVudCA9IEBjb2Rld2F2ZS5nZXRFbmNsb3NpbmdDbWQoQGdldEVuZFBvcygpKT8uaW5pdCgpXG4gIHNldE11bHRpUG9zOiAobXVsdGlQb3MpIC0+XG4gICAgQG11bHRpUG9zID0gbXVsdGlQb3NcbiAgX2dldENtZE9iajogLT5cbiAgICBAZ2V0Q21kKClcbiAgICBAX2NoZWNrQm94KClcbiAgICBAY29udGVudCA9IEByZW1vdmVJbmRlbnRGcm9tQ29udGVudChAY29udGVudClcbiAgICBzdXBlcigpXG4gIF9pbml0UGFyYW1zOiAtPlxuICAgIEBfcGFyc2VQYXJhbXMoQHJhd1BhcmFtcylcbiAgZ2V0Q29udGV4dDogLT5cbiAgICByZXR1cm4gQGNvbnRleHQgb3IgQGNvZGV3YXZlLmNvbnRleHRcbiAgZ2V0Q21kOiAtPlxuICAgIHVubGVzcyBAY21kP1xuICAgICAgQF9nZXRQYXJlbnRDbWRzKClcbiAgICAgIGlmIEBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIubGVuZ3RoKSA9PSBAY29kZXdhdmUubm9FeGVjdXRlQ2hhclxuICAgICAgICBAY21kID0gQ29tbWFuZC5jbWRzLmdldENtZCgnY29yZTpub19leGVjdXRlJylcbiAgICAgICAgQGNvbnRleHQgPSBAY29kZXdhdmUuY29udGV4dFxuICAgICAgZWxzZVxuICAgICAgICBAZmluZGVyID0gQGdldEZpbmRlcihAY21kTmFtZSlcbiAgICAgICAgQGNvbnRleHQgPSBAZmluZGVyLmNvbnRleHRcbiAgICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgICAgIGlmIEBjbWQ/XG4gICAgICAgICAgQGNvbnRleHQuYWRkTmFtZVNwYWNlKEBjbWQuZnVsbE5hbWUpXG4gICAgcmV0dXJuIEBjbWRcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBjb2Rld2F2ZS5jb250ZXh0LmdldEZpbmRlcihjbWROYW1lLG5hbWVzcGFjZXM6QF9nZXRQYXJlbnROYW1lc3BhY2VzKCkpXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgX2dldFBhcmVudE5hbWVzcGFjZXM6IC0+XG4gICAgbnNwY3MgPSBbXVxuICAgIG9iaiA9IHRoaXNcbiAgICB3aGlsZSBvYmoucGFyZW50P1xuICAgICAgb2JqID0gb2JqLnBhcmVudFxuICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKSBpZiBvYmouY21kPyBhbmQgb2JqLmNtZC5mdWxsTmFtZT9cbiAgICByZXR1cm4gbnNwY3NcbiAgX3JlbW92ZUJyYWNrZXQ6IChzdHIpLT5cbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyhAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgsc3RyLmxlbmd0aC1AY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQoQGNtZE5hbWUpXG4gICAgcmV0dXJuIGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJyxjbWROYW1lKVxuICBpc0VtcHR5OiAtPlxuICAgIHJldHVybiBAc3RyID09IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjb2Rld2F2ZS5icmFrZXRzIG9yIEBzdHIgPT0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuYnJha2V0c1xuICBleGVjdXRlOiAtPlxuICAgIGlmIEBpc0VtcHR5KClcbiAgICAgIGlmIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXA/IGFuZCBAY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKEBwb3MgKyBAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpP1xuICAgICAgICBAY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpXG4gICAgICBlbHNlXG4gICAgICAgIEByZXBsYWNlV2l0aCgnJylcbiAgICBlbHNlIGlmIEBjbWQ/XG4gICAgICBpZiBiZWZvcmVGdW5jdCA9IEBnZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKVxuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKVxuICAgICAgaWYgQHJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgICAgaWYgKHJlcyA9IEByZXN1bHQoKSk/XG4gICAgICAgICAgQHJlcGxhY2VXaXRoKHJlcylcbiAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gQHJ1bkV4ZWN1dGVGdW5jdCgpXG4gIGdldEVuZFBvczogLT5cbiAgICByZXR1cm4gQHBvcytAc3RyLmxlbmd0aFxuICBnZXRQb3M6IC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQHBvcyxAcG9zK0BzdHIubGVuZ3RoKS53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gIGdldE9wZW5pbmdQb3M6IC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQHBvcyxAcG9zK0BvcGVuaW5nLmxlbmd0aCkud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICBnZXRJbmRlbnQ6IC0+XG4gICAgdW5sZXNzIEBpbmRlbnRMZW4/XG4gICAgICBpZiBAaW5Cb3g/XG4gICAgICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGNvbnRleHQpXG4gICAgICAgIEBpbmRlbnRMZW4gPSBoZWxwZXIucmVtb3ZlQ29tbWVudChAZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkpLmxlbmd0aFxuICAgICAgZWxzZVxuICAgICAgICBAaW5kZW50TGVuID0gQHBvcyAtIEBnZXRQb3MoKS5wcmV2RU9MKClcbiAgICByZXR1cm4gQGluZGVudExlblxuICByZW1vdmVJbmRlbnRGcm9tQ29udGVudDogKHRleHQpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoJ15cXFxcc3snK0BnZXRJbmRlbnQoKSsnfScsJ2dtJylcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCcnKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gIGFsdGVyUmVzdWx0Rm9yQm94OiAocmVwbCkgLT5cbiAgICBvcmlnaW5hbCA9IHJlcGwuY29weSgpXG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlcihAY29udGV4dClcbiAgICBoZWxwZXIuZ2V0T3B0RnJvbUxpbmUob3JpZ2luYWwudGV4dFdpdGhGdWxsTGluZXMoKSxmYWxzZSlcbiAgICBpZiBAZ2V0T3B0aW9uKCdyZXBsYWNlQm94JylcbiAgICAgIGJveCA9IGhlbHBlci5nZXRCb3hGb3JQb3Mob3JpZ2luYWwpXG4gICAgICBbcmVwbC5zdGFydCwgcmVwbC5lbmRdID0gW2JveC5zdGFydCwgYm94LmVuZF1cbiAgICAgIEBpbmRlbnRMZW4gPSBoZWxwZXIuaW5kZW50XG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgIGVsc2VcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgICByZXBsLnN0YXJ0ID0gb3JpZ2luYWwucHJldkVPTCgpXG4gICAgICByZXBsLmVuZCA9IG9yaWdpbmFsLm5leHRFT0woKVxuICAgICAgcmVzID0gaGVscGVyLnJlZm9ybWF0TGluZXMob3JpZ2luYWwuc2FtZUxpbmVzUHJlZml4KCkgKyBAY29kZXdhdmUubWFya2VyICsgcmVwbC50ZXh0ICsgQGNvZGV3YXZlLm1hcmtlciArIG9yaWdpbmFsLnNhbWVMaW5lc1N1ZmZpeCgpLCB7bXVsdGlsaW5lOmZhbHNlfSlcbiAgICAgIFtyZXBsLnByZWZpeCxyZXBsLnRleHQscmVwbC5zdWZmaXhdID0gcmVzLnNwbGl0KEBjb2Rld2F2ZS5tYXJrZXIpXG4gICAgcmV0dXJuIHJlcGxcbiAgZ2V0Q3Vyc29yRnJvbVJlc3VsdDogKHJlcGwpIC0+XG4gICAgY3Vyc29yUG9zID0gcmVwbC5yZXNQb3NCZWZvcmVQcmVmaXgoKVxuICAgIGlmIEBjbWQ/IGFuZCBAY29kZXdhdmUuY2hlY2tDYXJyZXQgYW5kIEBnZXRPcHRpb24oJ2NoZWNrQ2FycmV0JylcbiAgICAgIGlmIChwID0gQGNvZGV3YXZlLmdldENhcnJldFBvcyhyZXBsLnRleHQpKT8gXG4gICAgICAgIGN1cnNvclBvcyA9IHJlcGwuc3RhcnQrcmVwbC5wcmVmaXgubGVuZ3RoK3BcbiAgICAgIHJlcGwudGV4dCA9IEBjb2Rld2F2ZS5yZW1vdmVDYXJyZXQocmVwbC50ZXh0KVxuICAgIHJldHVybiBjdXJzb3JQb3NcbiAgY2hlY2tNdWx0aTogKHJlcGwpIC0+XG4gICAgaWYgQG11bHRpUG9zPyBhbmQgQG11bHRpUG9zLmxlbmd0aCA+IDFcbiAgICAgIHJlcGxhY2VtZW50cyA9IFtyZXBsXVxuICAgICAgb3JpZ2luYWxUZXh0ID0gcmVwbC5vcmlnaW5hbFRleHQoKVxuICAgICAgZm9yIHBvcywgaSBpbiBAbXVsdGlQb3NcbiAgICAgICAgaWYgaSA9PSAwXG4gICAgICAgICAgb3JpZ2luYWxQb3MgPSBwb3Muc3RhcnRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5ld1JlcGwgPSByZXBsLmNvcHkoKS5hcHBseU9mZnNldChwb3Muc3RhcnQtb3JpZ2luYWxQb3MpXG4gICAgICAgICAgaWYgbmV3UmVwbC5vcmlnaW5hbFRleHQoKSA9PSBvcmlnaW5hbFRleHRcbiAgICAgICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ld1JlcGwpXG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRzXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFtyZXBsXVxuICByZXBsYWNlV2l0aDogKHRleHQpIC0+XG4gICAgQGFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KEBwb3MsQGdldEVuZFBvcygpLHRleHQpKVxuICBhcHBseVJlcGxhY2VtZW50OiAocmVwbCkgLT5cbiAgICByZXBsLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgICBpZiBAaW5Cb3g/XG4gICAgICBAYWx0ZXJSZXN1bHRGb3JCb3gocmVwbClcbiAgICBlbHNlXG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgIGN1cnNvclBvcyA9IEBnZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpXG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBQb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXVxuICAgIHJlcGxhY2VtZW50cyA9IEBjaGVja011bHRpKHJlcGwpXG4gICAgQHJlcGxhY2VTdGFydCA9IHJlcGwuc3RhcnRcbiAgICBAcmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKClcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgICAiLCJ2YXIgaW5kZXhPZiA9IFtdLmluZGV4T2Y7XG5cbmltcG9ydCB7XG4gIENtZEluc3RhbmNlXG59IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuXG5pbXBvcnQge1xuICBCb3hIZWxwZXJcbn0gZnJvbSAnLi9Cb3hIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5pbXBvcnQge1xuICBTdHJQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBOYW1lc3BhY2VIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgPSBjbGFzcyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgZXh0ZW5kcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlLCBwb3MxLCBzdHIxKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmU7XG4gICAgdGhpcy5wb3MgPSBwb3MxO1xuICAgIHRoaXMuc3RyID0gc3RyMTtcbiAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aGlzLl9jaGVja0Nsb3NlcigpO1xuICAgICAgdGhpcy5vcGVuaW5nID0gdGhpcy5zdHI7XG4gICAgICB0aGlzLm5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpO1xuICAgICAgdGhpcy5fc3BsaXRDb21wb25lbnRzKCk7XG4gICAgICB0aGlzLl9maW5kQ2xvc2luZygpO1xuICAgICAgdGhpcy5fY2hlY2tFbG9uZ2F0ZWQoKTtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tDbG9zZXIoKSB7XG4gICAgdmFyIGYsIG5vQnJhY2tldDtcbiAgICBub0JyYWNrZXQgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKTtcbiAgICBpZiAobm9CcmFja2V0LnN1YnN0cmluZygwLCB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciAmJiAoZiA9IHRoaXMuX2ZpbmRPcGVuaW5nUG9zKCkpKSB7XG4gICAgICB0aGlzLmNsb3NpbmdQb3MgPSBuZXcgU3RyUG9zKHRoaXMucG9zLCB0aGlzLnN0cik7XG4gICAgICB0aGlzLnBvcyA9IGYucG9zO1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gZi5zdHI7XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRPcGVuaW5nUG9zKCkge1xuICAgIHZhciBjbG9zaW5nLCBjbWROYW1lLCBmLCBvcGVuaW5nO1xuICAgIGNtZE5hbWUgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKS5zdWJzdHJpbmcodGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKTtcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgY21kTmFtZTtcbiAgICBjbG9zaW5nID0gdGhpcy5zdHI7XG4gICAgaWYgKGYgPSB0aGlzLmNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIodGhpcy5wb3MsIG9wZW5pbmcsIGNsb3NpbmcsIC0xKSkge1xuICAgICAgZi5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLCB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGYucG9zICsgZi5zdHIubGVuZ3RoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpO1xuICAgICAgcmV0dXJuIGY7XG4gICAgfVxuICB9XG5cbiAgX3NwbGl0Q29tcG9uZW50cygpIHtcbiAgICB2YXIgcGFydHM7XG4gICAgcGFydHMgPSB0aGlzLm5vQnJhY2tldC5zcGxpdChcIiBcIik7XG4gICAgdGhpcy5jbWROYW1lID0gcGFydHMuc2hpZnQoKTtcbiAgICByZXR1cm4gdGhpcy5yYXdQYXJhbXMgPSBwYXJ0cy5qb2luKFwiIFwiKTtcbiAgfVxuXG4gIF9wYXJzZVBhcmFtcyhwYXJhbXMpIHtcbiAgICB2YXIgYWxsb3dlZE5hbWVkLCBjaHIsIGksIGluU3RyLCBqLCBuYW1lLCBuYW1lVG9QYXJhbSwgcGFyYW0sIHJlZjtcbiAgICB0aGlzLnBhcmFtcyA9IFtdO1xuICAgIHRoaXMubmFtZWQgPSB0aGlzLmdldERlZmF1bHRzKCk7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIG5hbWVUb1BhcmFtID0gdGhpcy5nZXRPcHRpb24oJ25hbWVUb1BhcmFtJyk7XG4gICAgICBpZiAobmFtZVRvUGFyYW0gIT0gbnVsbCkge1xuICAgICAgICB0aGlzLm5hbWVkW25hbWVUb1BhcmFtXSA9IHRoaXMuY21kTmFtZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBhcmFtcy5sZW5ndGgpIHtcbiAgICAgIGFsbG93ZWROYW1lZCA9IHRoaXMuZ2V0T3B0aW9uKCdhbGxvd2VkTmFtZWQnKTtcbiAgICAgIGluU3RyID0gZmFsc2U7XG4gICAgICBwYXJhbSA9ICcnO1xuICAgICAgbmFtZSA9IGZhbHNlO1xuICAgICAgZm9yIChpID0gaiA9IDAsIHJlZiA9IHBhcmFtcy5sZW5ndGggLSAxOyAoMCA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmKTsgaSA9IDAgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICAgIGNociA9IHBhcmFtc1tpXTtcbiAgICAgICAgaWYgKGNociA9PT0gJyAnICYmICFpblN0cikge1xuICAgICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWVkW25hbWVdID0gcGFyYW07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zLnB1c2gocGFyYW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJhbSA9ICcnO1xuICAgICAgICAgIG5hbWUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmICgoY2hyID09PSAnXCInIHx8IGNociA9PT0gXCInXCIpICYmIChpID09PSAwIHx8IHBhcmFtc1tpIC0gMV0gIT09ICdcXFxcJykpIHtcbiAgICAgICAgICBpblN0ciA9ICFpblN0cjtcbiAgICAgICAgfSBlbHNlIGlmIChjaHIgPT09ICc6JyAmJiAhbmFtZSAmJiAhaW5TdHIgJiYgKChhbGxvd2VkTmFtZWQgPT0gbnVsbCkgfHwgaW5kZXhPZi5jYWxsKGFsbG93ZWROYW1lZCwgcGFyYW0pID49IDApKSB7XG4gICAgICAgICAgbmFtZSA9IHBhcmFtO1xuICAgICAgICAgIHBhcmFtID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyYW0gKz0gY2hyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocGFyYW0ubGVuZ3RoKSB7XG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSBwYXJhbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXMucHVzaChwYXJhbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmcoKSB7XG4gICAgdmFyIGY7XG4gICAgaWYgKGYgPSB0aGlzLl9maW5kQ2xvc2luZ1BvcygpKSB7XG4gICAgICB0aGlzLmNvbnRlbnQgPSBTdHJpbmdIZWxwZXIudHJpbUVtcHR5TGluZSh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBmLnBvcykpO1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZi5wb3MgKyBmLnN0ci5sZW5ndGgpO1xuICAgIH1cbiAgfVxuXG4gIF9maW5kQ2xvc2luZ1BvcygpIHtcbiAgICB2YXIgY2xvc2luZywgZiwgb3BlbmluZztcbiAgICBpZiAodGhpcy5jbG9zaW5nUG9zICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3M7XG4gICAgfVxuICAgIGNsb3NpbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY21kTmFtZSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWROYW1lO1xuICAgIGlmIChmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBvcGVuaW5nLCBjbG9zaW5nKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1BvcyA9IGY7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrRWxvbmdhdGVkKCkge1xuICAgIHZhciBlbmRQb3MsIG1heCwgcmVmO1xuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCk7XG4gICAgbWF4ID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpO1xuICAgIHdoaWxlIChlbmRQb3MgPCBtYXggJiYgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmRlY28pIHtcbiAgICAgIGVuZFBvcyArPSB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoO1xuICAgIH1cbiAgICBpZiAoZW5kUG9zID49IG1heCB8fCAoKHJlZiA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSkgPT09ICcgJyB8fCByZWYgPT09IFwiXFxuXCIgfHwgcmVmID09PSBcIlxcclwiKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKTtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tCb3goKSB7XG4gICAgdmFyIGNsLCBjciwgZW5kUG9zO1xuICAgIGlmICgodGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpICYmIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PT0gJ2NvbW1lbnQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsID0gdGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCgpO1xuICAgIGNyID0gdGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKTtcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpICsgY3IubGVuZ3RoO1xuICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zIC0gY2wubGVuZ3RoLCB0aGlzLnBvcykgPT09IGNsICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLCBlbmRQb3MpID09PSBjcikge1xuICAgICAgdGhpcy5wb3MgPSB0aGlzLnBvcyAtIGNsLmxlbmd0aDtcbiAgICAgIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKTtcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkuaW5kZXhPZihjbCkgPiAtMSAmJiB0aGlzLmdldFBvcygpLnNhbWVMaW5lc1N1ZmZpeCgpLmluZGV4T2YoY3IpID4gLTEpIHtcbiAgICAgIHRoaXMuaW5Cb3ggPSAxO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKSB7XG4gICAgdmFyIGVjbCwgZWNyLCBlZCwgcmUxLCByZTIsIHJlMztcbiAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29kZXdhdmUuZGVjbyk7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86JHtlZH0pKyR7ZWNyfSRgLCBcImdtXCIpO1xuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXlxcXFxzKig/OiR7ZWR9KSoke2Vjcn1cXHI/XFxuYCk7XG4gICAgICByZTMgPSBuZXcgUmVnRXhwKGBcXG5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHMqJGApO1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudC5yZXBsYWNlKHJlMSwgJyQxJykucmVwbGFjZShyZTIsICcnKS5yZXBsYWNlKHJlMywgJycpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRQYXJlbnRDbWRzKCkge1xuICAgIHZhciByZWY7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID0gKHJlZiA9IHRoaXMuY29kZXdhdmUuZ2V0RW5jbG9zaW5nQ21kKHRoaXMuZ2V0RW5kUG9zKCkpKSAhPSBudWxsID8gcmVmLmluaXQoKSA6IHZvaWQgMDtcbiAgfVxuXG4gIHNldE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlQb3MgPSBtdWx0aVBvcztcbiAgfVxuXG4gIF9nZXRDbWRPYmooKSB7XG4gICAgdGhpcy5nZXRDbWQoKTtcbiAgICB0aGlzLl9jaGVja0JveCgpO1xuICAgIHRoaXMuY29udGVudCA9IHRoaXMucmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGhpcy5jb250ZW50KTtcbiAgICByZXR1cm4gc3VwZXIuX2dldENtZE9iaigpO1xuICB9XG5cbiAgX2luaXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlUGFyYW1zKHRoaXMucmF3UGFyYW1zKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCB0aGlzLmNvZGV3YXZlLmNvbnRleHQ7XG4gIH1cblxuICBnZXRDbWQoKSB7XG4gICAgaWYgKHRoaXMuY21kID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2dldFBhcmVudENtZHMoKTtcbiAgICAgIGlmICh0aGlzLm5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikge1xuICAgICAgICB0aGlzLmNtZCA9IENvbW1hbmQuY21kcy5nZXRDbWQoJ2NvcmU6bm9fZXhlY3V0ZScpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSk7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZmluZGVyLmNvbnRleHQ7XG4gICAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpO1xuICAgICAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5jbWQuZnVsbE5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNtZDtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pO1xuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXM7XG4gICAgcmV0dXJuIGZpbmRlcjtcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzKCkge1xuICAgIHZhciBuc3Bjcywgb2JqO1xuICAgIG5zcGNzID0gW107XG4gICAgb2JqID0gdGhpcztcbiAgICB3aGlsZSAob2JqLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICBvYmogPSBvYmoucGFyZW50O1xuICAgICAgaWYgKChvYmouY21kICE9IG51bGwpICYmIChvYmouY21kLmZ1bGxOYW1lICE9IG51bGwpKSB7XG4gICAgICAgIG5zcGNzLnB1c2gob2JqLmNtZC5mdWxsTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuc3BjcztcbiAgfVxuXG4gIF9yZW1vdmVCcmFja2V0KHN0cikge1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgsIHN0ci5sZW5ndGggLSB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKTtcbiAgfVxuXG4gIGFsdGVyQWxpYXNPZihhbGlhc09mKSB7XG4gICAgdmFyIGNtZE5hbWUsIG5zcGM7XG4gICAgW25zcGMsIGNtZE5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0KHRoaXMuY21kTmFtZSk7XG4gICAgcmV0dXJuIGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJywgY21kTmFtZSk7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgfHwgdGhpcy5zdHIgPT09IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGJlZm9yZUZ1bmN0LCByZXM7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICBpZiAoKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wICE9IG51bGwpICYmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcC53aGl0aGluT3BlbkJvdW5kcyh0aGlzLnBvcyArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpICE9IG51bGwpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcC5jYW5jZWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoKCcnKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmIChiZWZvcmVGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdiZWZvcmVFeGVjdXRlJykpIHtcbiAgICAgICAgYmVmb3JlRnVuY3QodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICAgIGlmICgocmVzID0gdGhpcy5yZXN1bHQoKSkgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkV4ZWN1dGVGdW5jdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldEVuZFBvcygpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGg7XG4gIH1cblxuICBnZXRQb3MoKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5wb3MsIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcbiAgfVxuXG4gIGdldE9wZW5pbmdQb3MoKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5wb3MsIHRoaXMucG9zICsgdGhpcy5vcGVuaW5nLmxlbmd0aCkud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcik7XG4gIH1cblxuICBnZXRJbmRlbnQoKSB7XG4gICAgdmFyIGhlbHBlcjtcbiAgICBpZiAodGhpcy5pbmRlbnRMZW4gPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuaW5Cb3ggIT0gbnVsbCkge1xuICAgICAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dCk7XG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gaGVscGVyLnJlbW92ZUNvbW1lbnQodGhpcy5nZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKSkubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbmRlbnRMZW4gPSB0aGlzLnBvcyAtIHRoaXMuZ2V0UG9zKCkucHJldkVPTCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbmRlbnRMZW47XG4gIH1cblxuICByZW1vdmVJbmRlbnRGcm9tQ29udGVudCh0ZXh0KSB7XG4gICAgdmFyIHJlZztcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKCdeXFxcXHN7JyArIHRoaXMuZ2V0SW5kZW50KCkgKyAnfScsICdnbScpO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgYWx0ZXJSZXN1bHRGb3JCb3gocmVwbCkge1xuICAgIHZhciBib3gsIGhlbHBlciwgb3JpZ2luYWwsIHJlcztcbiAgICBvcmlnaW5hbCA9IHJlcGwuY29weSgpO1xuICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0KTtcbiAgICBoZWxwZXIuZ2V0T3B0RnJvbUxpbmUob3JpZ2luYWwudGV4dFdpdGhGdWxsTGluZXMoKSwgZmFsc2UpO1xuICAgIGlmICh0aGlzLmdldE9wdGlvbigncmVwbGFjZUJveCcpKSB7XG4gICAgICBib3ggPSBoZWxwZXIuZ2V0Qm94Rm9yUG9zKG9yaWdpbmFsKTtcbiAgICAgIFtyZXBsLnN0YXJ0LCByZXBsLmVuZF0gPSBbYm94LnN0YXJ0LCBib3guZW5kXTtcbiAgICAgIHRoaXMuaW5kZW50TGVuID0gaGVscGVyLmluZGVudDtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpO1xuICAgICAgcmVwbC5zdGFydCA9IG9yaWdpbmFsLnByZXZFT0woKTtcbiAgICAgIHJlcGwuZW5kID0gb3JpZ2luYWwubmV4dEVPTCgpO1xuICAgICAgcmVzID0gaGVscGVyLnJlZm9ybWF0TGluZXMob3JpZ2luYWwuc2FtZUxpbmVzUHJlZml4KCkgKyB0aGlzLmNvZGV3YXZlLm1hcmtlciArIHJlcGwudGV4dCArIHRoaXMuY29kZXdhdmUubWFya2VyICsgb3JpZ2luYWwuc2FtZUxpbmVzU3VmZml4KCksIHtcbiAgICAgICAgbXVsdGlsaW5lOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBbcmVwbC5wcmVmaXgsIHJlcGwudGV4dCwgcmVwbC5zdWZmaXhdID0gcmVzLnNwbGl0KHRoaXMuY29kZXdhdmUubWFya2VyKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcGw7XG4gIH1cblxuICBnZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCBwO1xuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KCk7XG4gICAgaWYgKCh0aGlzLmNtZCAhPSBudWxsKSAmJiB0aGlzLmNvZGV3YXZlLmNoZWNrQ2FycmV0ICYmIHRoaXMuZ2V0T3B0aW9uKCdjaGVja0NhcnJldCcpKSB7XG4gICAgICBpZiAoKHAgPSB0aGlzLmNvZGV3YXZlLmdldENhcnJldFBvcyhyZXBsLnRleHQpKSAhPSBudWxsKSB7XG4gICAgICAgIGN1cnNvclBvcyA9IHJlcGwuc3RhcnQgKyByZXBsLnByZWZpeC5sZW5ndGggKyBwO1xuICAgICAgfVxuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQocmVwbC50ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnNvclBvcztcbiAgfVxuXG4gIGNoZWNrTXVsdGkocmVwbCkge1xuICAgIHZhciBpLCBqLCBsZW4sIG5ld1JlcGwsIG9yaWdpbmFsUG9zLCBvcmlnaW5hbFRleHQsIHBvcywgcmVmLCByZXBsYWNlbWVudHM7XG4gICAgaWYgKCh0aGlzLm11bHRpUG9zICE9IG51bGwpICYmIHRoaXMubXVsdGlQb3MubGVuZ3RoID4gMSkge1xuICAgICAgcmVwbGFjZW1lbnRzID0gW3JlcGxdO1xuICAgICAgb3JpZ2luYWxUZXh0ID0gcmVwbC5vcmlnaW5hbFRleHQoKTtcbiAgICAgIHJlZiA9IHRoaXMubXVsdGlQb3M7XG4gICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICBwb3MgPSByZWZbaV07XG4gICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgb3JpZ2luYWxQb3MgPSBwb3Muc3RhcnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3UmVwbCA9IHJlcGwuY29weSgpLmFwcGx5T2Zmc2V0KHBvcy5zdGFydCAtIG9yaWdpbmFsUG9zKTtcbiAgICAgICAgICBpZiAobmV3UmVwbC5vcmlnaW5hbFRleHQoKSA9PT0gb3JpZ2luYWxUZXh0KSB7XG4gICAgICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXdSZXBsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXBsYWNlbWVudHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbcmVwbF07XG4gICAgfVxuICB9XG5cbiAgcmVwbGFjZVdpdGgodGV4dCkge1xuICAgIHJldHVybiB0aGlzLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KHRoaXMucG9zLCB0aGlzLmdldEVuZFBvcygpLCB0ZXh0KSk7XG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50KHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCByZXBsYWNlbWVudHM7XG4gICAgcmVwbC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcbiAgICBpZiAodGhpcy5pbkJveCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgfVxuICAgIGN1cnNvclBvcyA9IHRoaXMuZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKTtcbiAgICByZXBsLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyhjdXJzb3JQb3MsIGN1cnNvclBvcyldO1xuICAgIHJlcGxhY2VtZW50cyA9IHRoaXMuY2hlY2tNdWx0aShyZXBsKTtcbiAgICB0aGlzLnJlcGxhY2VTdGFydCA9IHJlcGwuc3RhcnQ7XG4gICAgdGhpcy5yZXBsYWNlRW5kID0gcmVwbC5yZXNFbmQoKTtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIFByb2Nlc3NcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgIyIsIlxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9Mb2dnZXInO1xuXG5leHBvcnQgY2xhc3MgU3RvcmFnZVxuICBjb25zdHJ1Y3RvcjogKEBlbmdpbmUpIC0+XG5cbiAgc2F2ZTogKGtleSx2YWwpIC0+XG4gICAgaWYgQGVuZ2luZUF2YWlsYWJsZSgpXG4gICAgICBAZW5naW5lLnNhdmUoa2V5LHZhbClcblxuICBzYXZlSW5QYXRoOiAocGF0aCwga2V5LCB2YWwpIC0+XG4gICAgaWYgQGVuZ2luZUF2YWlsYWJsZSgpXG4gICAgICBAZW5naW5lLnNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpXG5cbiAgbG9hZDogKGtleSkgLT5cbiAgICBpZiBAZW5naW5lP1xuICAgICAgQGVuZ2luZS5sb2FkKGtleSlcblxuICBlbmdpbmVBdmFpbGFibGU6ICgpIC0+XG4gICAgaWYgQGVuZ2luZT9cbiAgICAgIHRydWVcbiAgICBlbHNlXG4gICAgICBAbG9nZ2VyID0gQGxvZ2dlciB8fCBuZXcgTG9nZ2VyKClcbiAgICAgIEBsb2dnZXIubG9nKCdObyBzdG9yYWdlIGVuZ2luZSBhdmFpbGFibGUnKVxuICAgICAgZmFsc2VcbiAgICAiLCJpbXBvcnQge1xuICBMb2dnZXJcbn0gZnJvbSAnLi9Mb2dnZXInO1xuXG5leHBvcnQgdmFyIFN0b3JhZ2UgPSBjbGFzcyBTdG9yYWdlIHtcbiAgY29uc3RydWN0b3IoZW5naW5lKSB7XG4gICAgdGhpcy5lbmdpbmUgPSBlbmdpbmU7XG4gIH1cblxuICBzYXZlKGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5zYXZlKGtleSwgdmFsKTtcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5zYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKTtcbiAgICB9XG4gIH1cblxuICBsb2FkKGtleSkge1xuICAgIGlmICh0aGlzLmVuZ2luZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUubG9hZChrZXkpO1xuICAgIH1cbiAgfVxuXG4gIGVuZ2luZUF2YWlsYWJsZSgpIHtcbiAgICBpZiAodGhpcy5lbmdpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9nZ2VyID0gdGhpcy5sb2dnZXIgfHwgbmV3IExvZ2dlcigpO1xuICAgICAgdGhpcy5sb2dnZXIubG9nKCdObyBzdG9yYWdlIGVuZ2luZSBhdmFpbGFibGUnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5leHBvcnQgY2xhc3MgRG9tS2V5TGlzdGVuZXJcbiAgc3RhcnRMaXN0ZW5pbmc6ICh0YXJnZXQpIC0+XG4gIFxuICAgIHRpbWVvdXQgPSBudWxsXG4gICAgXG4gICAgb25rZXlkb3duID0gKGUpID0+IFxuICAgICAgaWYgKENvZGV3YXZlLmluc3RhbmNlcy5sZW5ndGggPCAyIG9yIEBvYmogPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgYW5kIGUua2V5Q29kZSA9PSA2OSAmJiBlLmN0cmxLZXlcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGlmIEBvbkFjdGl2YXRpb25LZXk/XG4gICAgICAgICAgQG9uQWN0aXZhdGlvbktleSgpXG4gICAgb25rZXl1cCA9IChlKSA9PiBcbiAgICAgIGlmIEBvbkFueUNoYW5nZT9cbiAgICAgICAgQG9uQW55Q2hhbmdlKGUpXG4gICAgb25rZXlwcmVzcyA9IChlKSA9PiBcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KSBpZiB0aW1lb3V0P1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQgKD0+XG4gICAgICAgIGlmIEBvbkFueUNoYW5nZT9cbiAgICAgICAgICBAb25BbnlDaGFuZ2UoZSlcbiAgICAgICksIDEwMFxuICAgICAgICAgICAgXG4gICAgaWYgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXJcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9ua2V5ZG93bilcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBvbmtleXVwKVxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIG9ua2V5cHJlc3MpXG4gICAgZWxzZSBpZiB0YXJnZXQuYXR0YWNoRXZlbnRcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlkb3duXCIsIG9ua2V5ZG93bilcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXl1cFwiLCBvbmtleXVwKVxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXByZXNzXCIsIG9ua2V5cHJlc3MpXG5cbmlzRWxlbWVudCA9IChvYmopIC0+XG4gIHRyeVxuICAgICMgVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb20pXG4gICAgb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcbiAgY2F0Y2ggZVxuICAgICMgQnJvd3NlcnMgbm90IHN1cHBvcnRpbmcgVzMgRE9NMiBkb24ndCBoYXZlIEhUTUxFbGVtZW50IGFuZFxuICAgICMgYW4gZXhjZXB0aW9uIGlzIHRocm93biBhbmQgd2UgZW5kIHVwIGhlcmUuIFRlc3Rpbmcgc29tZVxuICAgICMgcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuICAgIHJldHVybiAodHlwZW9mIG9iaj09XCJvYmplY3RcIikgJiZcbiAgICAgIChvYmoubm9kZVR5cGU9PTEpICYmICh0eXBlb2Ygb2JqLnN0eWxlID09IFwib2JqZWN0XCIpICYmXG4gICAgICAodHlwZW9mIG9iai5vd25lckRvY3VtZW50ID09XCJvYmplY3RcIilcblxuICAgICAgICBcbmV4cG9ydCBjbGFzcyBUZXh0QXJlYUVkaXRvciBleHRlbmRzIFRleHRQYXJzZXJcbiAgY29uc3RydWN0b3I6IChAdGFyZ2V0KSAtPlxuICAgIHN1cGVyKClcbiAgICBAb2JqID0gaWYgaXNFbGVtZW50KEB0YXJnZXQpIHRoZW4gQHRhcmdldCBlbHNlIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEB0YXJnZXQpXG4gICAgdW5sZXNzIEBvYmo/XG4gICAgICB0aHJvdyBcIlRleHRBcmVhIG5vdCBmb3VuZFwiXG4gICAgQG5hbWVzcGFjZSA9ICd0ZXh0YXJlYSdcbiAgICBAY2hhbmdlTGlzdGVuZXJzID0gW11cbiAgICBAX3NraXBDaGFuZ2VFdmVudCA9IDBcbiAgc3RhcnRMaXN0ZW5pbmc6IERvbUtleUxpc3RlbmVyLnByb3RvdHlwZS5zdGFydExpc3RlbmluZ1xuICBvbkFueUNoYW5nZTogKGUpIC0+XG4gICAgaWYgQF9za2lwQ2hhbmdlRXZlbnQgPD0gMFxuICAgICAgZm9yIGNhbGxiYWNrIGluIEBjaGFuZ2VMaXN0ZW5lcnNcbiAgICAgICAgY2FsbGJhY2soKVxuICAgIGVsc2VcbiAgICAgIEBfc2tpcENoYW5nZUV2ZW50LS1cbiAgICAgIEBvblNraXBlZENoYW5nZSgpIGlmIEBvblNraXBlZENoYW5nZT9cbiAgc2tpcENoYW5nZUV2ZW50OiAobmIgPSAxKSAtPlxuICAgIEBfc2tpcENoYW5nZUV2ZW50ICs9IG5iXG4gIGJpbmRlZFRvOiAoY29kZXdhdmUpIC0+XG4gICAgQG9uQWN0aXZhdGlvbktleSA9IC0+IGNvZGV3YXZlLm9uQWN0aXZhdGlvbktleSgpXG4gICAgQHN0YXJ0TGlzdGVuaW5nKGRvY3VtZW50KVxuICBzZWxlY3Rpb25Qcm9wRXhpc3RzOiAtPlxuICAgIFwic2VsZWN0aW9uU3RhcnRcIiBvZiBAb2JqXG4gIGhhc0ZvY3VzOiAtPiBcbiAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGlzIEBvYmpcbiAgdGV4dDogKHZhbCkgLT5cbiAgICBpZiB2YWw/XG4gICAgICB1bmxlc3MgQHRleHRFdmVudENoYW5nZSh2YWwpXG4gICAgICAgIEBvYmoudmFsdWUgPSB2YWxcbiAgICBAb2JqLnZhbHVlXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIEB0ZXh0RXZlbnRDaGFuZ2UodGV4dCwgc3RhcnQsIGVuZCkgb3IgQHNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQodGV4dCwgc3RhcnQsIGVuZCkgb3Igc3VwZXIoc3RhcnQsIGVuZCwgdGV4dClcbiAgdGV4dEV2ZW50Q2hhbmdlOiAodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSAtPlxuICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RleHRFdmVudCcpIGlmIGRvY3VtZW50LmNyZWF0ZUV2ZW50P1xuICAgIGlmIGV2ZW50PyBhbmQgZXZlbnQuaW5pdFRleHRFdmVudD8gYW5kIGV2ZW50LmlzVHJ1c3RlZCAhPSBmYWxzZVxuICAgICAgZW5kID0gQHRleHRMZW4oKSB1bmxlc3MgZW5kP1xuICAgICAgaWYgdGV4dC5sZW5ndGggPCAxXG4gICAgICAgIGlmIHN0YXJ0ICE9IDBcbiAgICAgICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoc3RhcnQtMSxzdGFydClcbiAgICAgICAgICBzdGFydC0tXG4gICAgICAgIGVsc2UgaWYgZW5kICE9IEB0ZXh0TGVuKClcbiAgICAgICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoZW5kLGVuZCsxKVxuICAgICAgICAgIGVuZCsrXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIGV2ZW50LmluaXRUZXh0RXZlbnQoJ3RleHRJbnB1dCcsIHRydWUsIHRydWUsIG51bGwsIHRleHQsIDkpXG4gICAgICAjIEBzZXRDdXJzb3JQb3Moc3RhcnQsZW5kKVxuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgQG9iai5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgICAgQHNraXBDaGFuZ2VFdmVudCgpXG4gICAgICB0cnVlXG4gICAgZWxzZSBcbiAgICAgIGZhbHNlXG4gIHNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQ6ICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIC0+XG4gICAgaWYgZG9jdW1lbnQuZXhlY0NvbW1hbmQ/XG4gICAgICBlbmQgPSBAdGV4dExlbigpIHVubGVzcyBlbmQ/XG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0ZXh0KTtcbiAgICBlbHNlIFxuICAgICAgZmFsc2VcblxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgcmV0dXJuIEB0bXBDdXJzb3JQb3MgaWYgQHRtcEN1cnNvclBvcz9cbiAgICBpZiBAaGFzRm9jdXNcbiAgICAgIGlmIEBzZWxlY3Rpb25Qcm9wRXhpc3RzXG4gICAgICAgIG5ldyBQb3MoQG9iai5zZWxlY3Rpb25TdGFydCxAb2JqLnNlbGVjdGlvbkVuZClcbiAgICAgIGVsc2VcbiAgICAgICAgQGdldEN1cnNvclBvc0ZhbGxiYWNrKClcbiAgZ2V0Q3Vyc29yUG9zRmFsbGJhY2s6IC0+XG4gICAgaWYgQG9iai5jcmVhdGVUZXh0UmFuZ2VcbiAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpXG4gICAgICBpZiBzZWwucGFyZW50RWxlbWVudCgpIGlzIEBvYmpcbiAgICAgICAgcm5nID0gQG9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgICBybmcubW92ZVRvQm9va21hcmsgc2VsLmdldEJvb2ttYXJrKClcbiAgICAgICAgbGVuID0gMFxuXG4gICAgICAgIHdoaWxlIHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMFxuICAgICAgICAgIGxlbisrXG4gICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpXG4gICAgICAgIHJuZy5zZXRFbmRQb2ludCBcIlN0YXJ0VG9TdGFydFwiLCBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHBvcyA9IG5ldyBQb3MoMCxsZW4pXG4gICAgICAgIHdoaWxlIHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMFxuICAgICAgICAgIHBvcy5zdGFydCsrXG4gICAgICAgICAgcG9zLmVuZCsrXG4gICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpXG4gICAgICAgIHJldHVybiBwb3NcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCkgLT5cbiAgICBlbmQgPSBzdGFydCBpZiBhcmd1bWVudHMubGVuZ3RoIDwgMlxuICAgIGlmIEBzZWxlY3Rpb25Qcm9wRXhpc3RzXG4gICAgICBAdG1wQ3Vyc29yUG9zID0gbmV3IFBvcyhzdGFydCxlbmQpXG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBzZXRUaW1lb3V0ICg9PlxuICAgICAgICBAdG1wQ3Vyc29yUG9zID0gbnVsbFxuICAgICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgICksIDFcbiAgICBlbHNlIFxuICAgICAgQHNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpXG4gICAgcmV0dXJuXG4gIHNldEN1cnNvclBvc0ZhbGxiYWNrOiAoc3RhcnQsIGVuZCkgLT5cbiAgICBpZiBAb2JqLmNyZWF0ZVRleHRSYW5nZVxuICAgICAgcm5nID0gQG9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgcm5nLm1vdmVTdGFydCBcImNoYXJhY3RlclwiLCBzdGFydFxuICAgICAgcm5nLmNvbGxhcHNlKClcbiAgICAgIHJuZy5tb3ZlRW5kIFwiY2hhcmFjdGVyXCIsIGVuZCAtIHN0YXJ0XG4gICAgICBybmcuc2VsZWN0KClcbiAgZ2V0TGFuZzogLT5cbiAgICByZXR1cm4gQF9sYW5nIGlmIEBfbGFuZ1xuICAgIEBvYmouZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKSBpZiBAb2JqLmhhc0F0dHJpYnV0ZSgnZGF0YS1sYW5nJylcbiAgc2V0TGFuZzogKHZhbCkgLT5cbiAgICBAX2xhbmcgPSB2YWxcbiAgICBAb2JqLnNldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJyx2YWwpXG4gIGNhbkxpc3RlblRvQ2hhbmdlOiAtPlxuICAgIHJldHVybiB0cnVlXG4gIGFkZENoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgQGNoYW5nZUxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKVxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIGlmIChpID0gQGNoYW5nZUxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgPiAtMVxuICAgICAgQGNoYW5nZUxpc3RlbmVycy5zcGxpY2UoaSwgMSlcbiAgICAgIFxuICAgICAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzOiAocmVwbGFjZW1lbnRzKSAtPlxuICAgIGlmIHJlcGxhY2VtZW50cy5sZW5ndGggPiAwIGFuZCByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucy5sZW5ndGggPCAxXG4gICAgICByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucyA9IFtAZ2V0Q3Vyc29yUG9zKCldXG4gICAgc3VwZXIocmVwbGFjZW1lbnRzKTtcbiAgICAgICIsInZhciBpc0VsZW1lbnQ7XG5cbmltcG9ydCB7XG4gIFRleHRQYXJzZXJcbn0gZnJvbSAnLi9UZXh0UGFyc2VyJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IHZhciBEb21LZXlMaXN0ZW5lciA9IGNsYXNzIERvbUtleUxpc3RlbmVyIHtcbiAgc3RhcnRMaXN0ZW5pbmcodGFyZ2V0KSB7XG4gICAgdmFyIG9ua2V5ZG93biwgb25rZXlwcmVzcywgb25rZXl1cCwgdGltZW91dDtcbiAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICBvbmtleWRvd24gPSAoZSkgPT4ge1xuICAgICAgaWYgKChDb2Rld2F2ZS5pbnN0YW5jZXMubGVuZ3RoIDwgMiB8fCB0aGlzLm9iaiA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgJiYgZS5rZXlDb2RlID09PSA2OSAmJiBlLmN0cmxLZXkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAodGhpcy5vbkFjdGl2YXRpb25LZXkgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQWN0aXZhdGlvbktleSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBvbmtleXVwID0gKGUpID0+IHtcbiAgICAgIGlmICh0aGlzLm9uQW55Q2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBvbmtleXByZXNzID0gKGUpID0+IHtcbiAgICAgIGlmICh0aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9uQW55Q2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFueUNoYW5nZShlKTtcbiAgICAgICAgfVxuICAgICAgfSksIDEwMCk7XG4gICAgfTtcbiAgICBpZiAodGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbmtleWRvd24pO1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBvbmtleXVwKTtcbiAgICAgIHJldHVybiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIG9ua2V5cHJlc3MpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmF0dGFjaEV2ZW50KSB7XG4gICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleWRvd25cIiwgb25rZXlkb3duKTtcbiAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5dXBcIiwgb25rZXl1cCk7XG4gICAgICByZXR1cm4gdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlwcmVzc1wiLCBvbmtleXByZXNzKTtcbiAgICB9XG4gIH1cblxufTtcblxuaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBlO1xuICB0cnkge1xuICAgIC8vIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tKVxuICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgLy8gQnJvd3NlcnMgbm90IHN1cHBvcnRpbmcgVzMgRE9NMiBkb24ndCBoYXZlIEhUTUxFbGVtZW50IGFuZFxuICAgIC8vIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG4gICAgcmV0dXJuICh0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiKSAmJiAob2JqLm5vZGVUeXBlID09PSAxKSAmJiAodHlwZW9mIG9iai5zdHlsZSA9PT0gXCJvYmplY3RcIikgJiYgKHR5cGVvZiBvYmoub3duZXJEb2N1bWVudCA9PT0gXCJvYmplY3RcIik7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgVGV4dEFyZWFFZGl0b3IgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIFRleHRBcmVhRWRpdG9yIGV4dGVuZHMgVGV4dFBhcnNlciB7XG4gICAgY29uc3RydWN0b3IodGFyZ2V0MSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0MTtcbiAgICAgIHRoaXMub2JqID0gaXNFbGVtZW50KHRoaXMudGFyZ2V0KSA/IHRoaXMudGFyZ2V0IDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXQpO1xuICAgICAgaWYgKHRoaXMub2JqID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgXCJUZXh0QXJlYSBub3QgZm91bmRcIjtcbiAgICAgIH1cbiAgICAgIHRoaXMubmFtZXNwYWNlID0gJ3RleHRhcmVhJztcbiAgICAgIHRoaXMuY2hhbmdlTGlzdGVuZXJzID0gW107XG4gICAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPSAwO1xuICAgIH1cblxuICAgIG9uQW55Q2hhbmdlKGUpIHtcbiAgICAgIHZhciBjYWxsYmFjaywgaiwgbGVuMSwgcmVmLCByZXN1bHRzO1xuICAgICAgaWYgKHRoaXMuX3NraXBDaGFuZ2VFdmVudCA8PSAwKSB7XG4gICAgICAgIHJlZiA9IHRoaXMuY2hhbmdlTGlzdGVuZXJzO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgY2FsbGJhY2sgPSByZWZbal07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKGNhbGxiYWNrKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50LS07XG4gICAgICAgIGlmICh0aGlzLm9uU2tpcGVkQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vblNraXBlZENoYW5nZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2tpcENoYW5nZUV2ZW50KG5iID0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NraXBDaGFuZ2VFdmVudCArPSBuYjtcbiAgICB9XG5cbiAgICBiaW5kZWRUbyhjb2Rld2F2ZSkge1xuICAgICAgdGhpcy5vbkFjdGl2YXRpb25LZXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvZGV3YXZlLm9uQWN0aXZhdGlvbktleSgpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0TGlzdGVuaW5nKGRvY3VtZW50KTtcbiAgICB9XG5cbiAgICBzZWxlY3Rpb25Qcm9wRXhpc3RzKCkge1xuICAgICAgcmV0dXJuIFwic2VsZWN0aW9uU3RhcnRcIiBpbiB0aGlzLm9iajtcbiAgICB9XG5cbiAgICBoYXNGb2N1cygpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLm9iajtcbiAgICB9XG5cbiAgICB0ZXh0KHZhbCkge1xuICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy50ZXh0RXZlbnRDaGFuZ2UodmFsKSkge1xuICAgICAgICAgIHRoaXMub2JqLnZhbHVlID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmoudmFsdWU7XG4gICAgfVxuXG4gICAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0RXZlbnRDaGFuZ2UodGV4dCwgc3RhcnQsIGVuZCkgfHwgdGhpcy5zcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHN1cGVyLnNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCk7XG4gICAgfVxuXG4gICAgdGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgICAgdmFyIGV2ZW50O1xuICAgICAgaWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50ICE9IG51bGwpIHtcbiAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50Jyk7XG4gICAgICB9XG4gICAgICBpZiAoKGV2ZW50ICE9IG51bGwpICYmIChldmVudC5pbml0VGV4dEV2ZW50ICE9IG51bGwpICYmIGV2ZW50LmlzVHJ1c3RlZCAhPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRleHQubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIGlmIChzdGFydCAhPT0gMCkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihzdGFydCAtIDEsIHN0YXJ0KTtcbiAgICAgICAgICAgIHN0YXJ0LS07XG4gICAgICAgICAgfSBlbHNlIGlmIChlbmQgIT09IHRoaXMudGV4dExlbigpKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKGVuZCwgZW5kICsgMSk7XG4gICAgICAgICAgICBlbmQrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBldmVudC5pbml0VGV4dEV2ZW50KCd0ZXh0SW5wdXQnLCB0cnVlLCB0cnVlLCBudWxsLCB0ZXh0LCA5KTtcbiAgICAgICAgLy8gQHNldEN1cnNvclBvcyhzdGFydCxlbmQpXG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZDtcbiAgICAgICAgdGhpcy5vYmouZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIHRoaXMuc2tpcENoYW5nZUV2ZW50KCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSB7XG4gICAgICBpZiAoZG9jdW1lbnQuZXhlY0NvbW1hbmQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgICAgICBlbmQgPSB0aGlzLnRleHRMZW4oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXJzb3JQb3MoKSB7XG4gICAgICBpZiAodGhpcy50bXBDdXJzb3JQb3MgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy50bXBDdXJzb3JQb3M7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5oYXNGb2N1cykge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25Qcm9wRXhpc3RzKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQb3ModGhpcy5vYmouc2VsZWN0aW9uU3RhcnQsIHRoaXMub2JqLnNlbGVjdGlvbkVuZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldEN1cnNvclBvc0ZhbGxiYWNrKCkge1xuICAgICAgdmFyIGxlbiwgcG9zLCBybmcsIHNlbDtcbiAgICAgIGlmICh0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIGlmIChzZWwucGFyZW50RWxlbWVudCgpID09PSB0aGlzLm9iaikge1xuICAgICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayhzZWwuZ2V0Qm9va21hcmsoKSk7XG4gICAgICAgICAgbGVuID0gMDtcbiAgICAgICAgICB3aGlsZSAocm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwKSB7XG4gICAgICAgICAgICBsZW4rKztcbiAgICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcm5nLnNldEVuZFBvaW50KFwiU3RhcnRUb1N0YXJ0XCIsIHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpKTtcbiAgICAgICAgICBwb3MgPSBuZXcgUG9zKDAsIGxlbik7XG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMCkge1xuICAgICAgICAgICAgcG9zLnN0YXJ0Kys7XG4gICAgICAgICAgICBwb3MuZW5kKys7XG4gICAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwb3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgIGVuZCA9IHN0YXJ0O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJvcEV4aXN0cykge1xuICAgICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG5ldyBQb3Moc3RhcnQsIGVuZCk7XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZDtcbiAgICAgICAgc2V0VGltZW91dCgoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudG1wQ3Vyc29yUG9zID0gbnVsbDtcbiAgICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICAgIHJldHVybiB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIH0pLCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZCkge1xuICAgICAgdmFyIHJuZztcbiAgICAgIGlmICh0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgcm5nID0gdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgIHJuZy5tb3ZlU3RhcnQoXCJjaGFyYWN0ZXJcIiwgc3RhcnQpO1xuICAgICAgICBybmcuY29sbGFwc2UoKTtcbiAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgZW5kIC0gc3RhcnQpO1xuICAgICAgICByZXR1cm4gcm5nLnNlbGVjdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldExhbmcoKSB7XG4gICAgICBpZiAodGhpcy5fbGFuZykge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFuZztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldExhbmcodmFsKSB7XG4gICAgICB0aGlzLl9sYW5nID0gdmFsO1xuICAgICAgcmV0dXJuIHRoaXMub2JqLnNldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJywgdmFsKTtcbiAgICB9XG5cbiAgICBjYW5MaXN0ZW5Ub0NoYW5nZSgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgIHZhciBpO1xuICAgICAgaWYgKChpID0gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpIHtcbiAgICAgIGlmIChyZXBsYWNlbWVudHMubGVuZ3RoID4gMCAmJiByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zID0gW3RoaXMuZ2V0Q3Vyc29yUG9zKCldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cGVyLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gICAgfVxuXG4gIH07XG5cbiAgVGV4dEFyZWFFZGl0b3IucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nID0gRG9tS2V5TGlzdGVuZXIucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nO1xuXG4gIHJldHVybiBUZXh0QXJlYUVkaXRvcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsImltcG9ydCB7IEVkaXRvciB9IGZyb20gJy4vRWRpdG9yJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IGNsYXNzIFRleHRQYXJzZXIgZXh0ZW5kcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IChAX3RleHQpIC0+XG4gICAgc3VwZXIoKVxuICB0ZXh0OiAodmFsKSAtPlxuICAgIEBfdGV4dCA9IHZhbCBpZiB2YWw/XG4gICAgQF90ZXh0XG4gIHRleHRDaGFyQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KClbcG9zXVxuICB0ZXh0TGVuOiAocG9zKSAtPlxuICAgIHJldHVybiBAdGV4dCgpLmxlbmd0aFxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICByZXR1cm4gQHRleHQoKS5zdWJzdHJpbmcoc3RhcnQsIGVuZClcbiAgaW5zZXJ0VGV4dEF0OiAodGV4dCwgcG9zKSAtPlxuICAgIEB0ZXh0KEB0ZXh0KCkuc3Vic3RyaW5nKDAsIHBvcykrdGV4dCtAdGV4dCgpLnN1YnN0cmluZyhwb3MsQHRleHQoKS5sZW5ndGgpKVxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICBAdGV4dChAdGV4dCgpLnNsaWNlKDAsIHN0YXJ0KSArICh0ZXh0IHx8IFwiXCIpICsgQHRleHQoKS5zbGljZShlbmQpKVxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgcmV0dXJuIEB0YXJnZXRcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCkgLT5cbiAgICBlbmQgPSBzdGFydCBpZiBhcmd1bWVudHMubGVuZ3RoIDwgMlxuICAgIEB0YXJnZXQgPSBuZXcgUG9zKCBzdGFydCwgZW5kICkiLCJpbXBvcnQge1xuICBFZGl0b3Jcbn0gZnJvbSAnLi9FZGl0b3InO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5leHBvcnQgdmFyIFRleHRQYXJzZXIgPSBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yIHtcbiAgY29uc3RydWN0b3IoX3RleHQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3RleHQgPSBfdGV4dDtcbiAgfVxuXG4gIHRleHQodmFsKSB7XG4gICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl90ZXh0ID0gdmFsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdGV4dDtcbiAgfVxuXG4gIHRleHRDaGFyQXQocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpW3Bvc107XG4gIH1cblxuICB0ZXh0TGVuKHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS5sZW5ndGg7XG4gIH1cblxuICB0ZXh0U3Vic3RyKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xuICB9XG5cbiAgaW5zZXJ0VGV4dEF0KHRleHQsIHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQodGhpcy50ZXh0KCkuc3Vic3RyaW5nKDAsIHBvcykgKyB0ZXh0ICsgdGhpcy50ZXh0KCkuc3Vic3RyaW5nKHBvcywgdGhpcy50ZXh0KCkubGVuZ3RoKSk7XG4gIH1cblxuICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnNsaWNlKDAsIHN0YXJ0KSArICh0ZXh0IHx8IFwiXCIpICsgdGhpcy50ZXh0KCkuc2xpY2UoZW5kKSk7XG4gIH1cblxuICBnZXRDdXJzb3JQb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0O1xuICB9XG5cbiAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIGVuZCA9IHN0YXJ0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50YXJnZXQgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vQ29kZXdhdmUnO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBDb3JlQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgSnNDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvSnNDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgUGhwQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL1BocENvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBIdG1sQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgV3JhcHBlZFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvV3JhcHBlZFBvcyc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VFbmdpbmUgfSBmcm9tICcuL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZSc7XG5cblBvcy53cmFwQ2xhc3MgPSBXcmFwcGVkUG9zXG5cbkNvZGV3YXZlLmluc3RhbmNlcyA9IFtdXG5cbkNvbW1hbmQucHJvdmlkZXJzID0gW1xuICBuZXcgQ29yZUNvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBQaHBDb21tYW5kUHJvdmlkZXIoKVxuICBuZXcgSHRtbENvbW1hbmRQcm92aWRlcigpXG5dXG5cbmlmIGxvY2FsU3RvcmFnZT9cbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZUVuZ2luZSgpXG5cbmV4cG9ydCB7IENvZGV3YXZlIH0iLCJpbXBvcnQge1xuICBDb2Rld2F2ZVxufSBmcm9tICcuL0NvZGV3YXZlJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBDb3JlQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgSnNDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgUGhwQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9QaHBDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBIdG1sQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgV3JhcHBlZFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MnO1xuXG5pbXBvcnQge1xuICBMb2NhbFN0b3JhZ2VFbmdpbmVcbn0gZnJvbSAnLi9zdG9yYWdlRW5naW5lcy9Mb2NhbFN0b3JhZ2VFbmdpbmUnO1xuXG5Qb3Mud3JhcENsYXNzID0gV3JhcHBlZFBvcztcblxuQ29kZXdhdmUuaW5zdGFuY2VzID0gW107XG5cbkNvbW1hbmQucHJvdmlkZXJzID0gW25ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpLCBuZXcgUGhwQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKCldO1xuXG5pZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZUVuZ2luZSgpO1xufVxuXG5leHBvcnQge1xuICBDb2Rld2F2ZVxufTtcbiIsIlxuaW1wb3J0IHsgQ29tbWFuZCwgQmFzZUNvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcbmltcG9ydCB7IExhbmdEZXRlY3RvciB9IGZyb20gJy4uL0RldGVjdG9yJztcbmltcG9ydCB7IEJveEhlbHBlciB9IGZyb20gJy4uL0JveEhlbHBlcic7XG5pbXBvcnQgeyBFZGl0Q21kUHJvcCB9IGZyb20gJy4uL0VkaXRDbWRQcm9wJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgY2xhc3MgQ29yZUNvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjb3JlJykpXG4gIGNvcmUuYWRkRGV0ZWN0b3IobmV3IExhbmdEZXRlY3RvcigpKVxuICBcbiAgY29yZS5hZGRDbWRzKHtcbiAgICAnaGVscCc6e1xuICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICdyZXN1bHQnIDogaGVscCxcbiAgICAgICdwYXJzZScgOiB0cnVlLFxuICAgICAgJ2FsbG93ZWROYW1lZCcgOiBbJ2NtZCddLFxuICAgICAgJ2hlbHAnIDogXCJcIlwiXG4gICAgICAgIFRvIGdldCBoZWxwIG9uIGEgcGVjaWZpYyBjb21tYW5kLCBkbyA6XG4gICAgICAgIH5+aGVscCBoZWxsb35+IChoZWxsbyBiZWluZyB0aGUgY29tbWFuZClcbiAgICAgICAgXCJcIlwiIFxuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnb3ZlcnZpZXcnOntcbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICAgIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXG4gICAgICAgICAgICAgLyBfX3xfX18gIF9ffCB8X19cXFxcIFxcXFwgICAgLyAvXyBfX18gX19fX19fXG4gICAgICAgICAgICAvIC9fXy8gXyBcXFxcLyBfYCAvIC1fXFxcXCBcXFxcL1xcXFwvIC8gX2AgXFxcXCBWIC8gLV8vXG4gICAgICAgICAgICBcXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XG4gICAgICAgICAgICBUaGUgdGV4dCBlZGl0b3IgaGVscGVyXG4gICAgICAgICAgICB+fi9xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBXaGVuIHVzaW5nIENvZGV3YXZlIHlvdSB3aWxsIGJlIHdyaXRpbmcgY29tbWFuZHMgd2l0aGluIFxuICAgICAgICAgICAgeW91ciB0ZXh0IGVkaXRvci4gVGhlc2UgY29tbWFuZHMgbXVzdCBiZSBwbGFjZWQgYmV0d2VlbiB0d28gXG4gICAgICAgICAgICBwYWlycyBvZiBcIn5cIiAodGlsZGUpIGFuZCB0aGVuLCB0aGV5IGNhbiBiZSBleGVjdXRlZCBieSBwcmVzc2luZyBcbiAgICAgICAgICAgIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiwgd2l0aCB5b3VyIGN1cnNvciBpbnNpZGUgdGhlIGNvbW1hbmRcbiAgICAgICAgICAgIEV4OiB+fiFoZWxsb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFlvdSBkb250IG5lZWQgdG8gYWN0dWFsbHkgdHlwZSBhbnkgXCJ+XCIgKHRpbGRlKS4gXG4gICAgICAgICAgICBQcmVzc2luZyBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XG4gICAgICAgICAgICB3aXRoaW4gYSBjb21tYW5kLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxuICAgICAgICAgICAgSW5zdGVhZCwgaXQgdXNlcyB0ZXh0IHdpdGhpbiBjb2RlIGNvbW1lbnRzIHRvIG1pbWljIFVJcy4gXG4gICAgICAgICAgICBUaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcbiAgICAgICAgICAgIGluIHRoZSBoZWxwIHNlY3Rpb25zLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBUbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXG4gICAgICAgICAgICBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBVc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcbiAgICAgICAgICAgIGZlYXR1cmVzIG9mIENvZGV3YXZlXG4gICAgICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgTGlzdCBvZiBhbGwgaGVscCBzdWJqZWN0cyBcbiAgICAgICAgICAgIH5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fiFjbG9zZX5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ3N1YmplY3RzJzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn4haGVscH5+XG4gICAgICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxuICAgICAgICAgICAgfn4haGVscDpzdWJqZWN0c35+ICh+fiFoZWxwOnN1Yn5+KVxuICAgICAgICAgICAgfn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnc3ViJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpzdWJqZWN0cydcbiAgICAgICAgfVxuICAgICAgICAnZ2V0X3N0YXJ0ZWQnOntcbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICBUaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cbiAgICAgICAgICAgIH5+IWhlbGxvfH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+aGVscDplZGl0aW5nOmludHJvfn5cbiAgICAgICAgICAgIH5+cXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcbiAgICAgICAgICAgIH5+IWhlbHA6ZWRpdGluZ35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxuICAgICAgICAgICAgb2YgSmF2YVNjcmlwdCBhYmJyZXZpYXRpb25zXG4gICAgICAgICAgICB+fiFqczpmfn5cbiAgICAgICAgICAgIH5+IWpzOmlmfn5cbiAgICAgICAgICAgICAgfn4hanM6bG9nfn5cIn5+IWhlbGxvfn5cIn5+IS9qczpsb2d+flxuICAgICAgICAgICAgfn4hL2pzOmlmfn5cbiAgICAgICAgICAgIH5+IS9qczpmfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxuICAgICAgICAgICAgcHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuIEVtbWV0IGFiYnJldmlhdGlvbnMgd2lsbCBiZSBcbiAgICAgICAgICAgIHVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cbiAgICAgICAgICAgIH5+IXVsPmxpfn4gKGlmIHlvdSBhcmUgaW4gYSBodG1sIGRvY2N1bWVudClcbiAgICAgICAgICAgIH5+IWVtbWV0IHVsPmxpfn5cbiAgICAgICAgICAgIH5+IWVtbWV0IG0yIGNzc35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvbW1hbmRzIGFyZSBzdG9yZWQgaW4gbmFtZXNwYWNlcy4gVGhlIHNhbWUgY29tbWFuZCBjYW4gaGF2ZSBcbiAgICAgICAgICAgIGRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxuICAgICAgICAgICAgfn4hanM6ZWFjaH5+XG4gICAgICAgICAgICB+fiFwaHA6b3V0ZXI6ZWFjaH5+XG4gICAgICAgICAgICB+fiFwaHA6aW5uZXI6ZWFjaH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFNvbWUgb2YgdGhlIG5hbWVzcGFjZXMgYXJlIGFjdGl2ZSBkZXBlbmRpbmcgb24gdGhlIGNvbnRleHQuIFRoZVxuICAgICAgICAgICAgZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcbiAgICAgICAgICAgIGFjdGl2ZSBuYW1lc3BhY2UuIFRoZSBmaXJzdCBjb21tYW5kIGNvbW1hbmQgd29ya3MgYmVjYXVzZSB0aGUgXG4gICAgICAgICAgICBjb3JlIG5hbWVzcGFjZSBpcyBhY3RpdmUuXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2V+flxuICAgICAgICAgICAgfn4hY29yZTpuYW1lc3BhY2V+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBZb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlIHBocH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2V+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBJbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXG4gICAgICAgICAgICBjb250ZXh0IGZyb20gdGhlIHN1cnJvdW5kaW5nIHRleHQuIEluIGEgUEhQIGZpbGUsIGl0IG1lYW5zIENvZGV3YXZlIFxuICAgICAgICAgICAgd2lsbCBhZGQgdGhlIFBIUCB0YWdzIHdoZW4geW91IG5lZWQgdGhlbS5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ2RlbW8nOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmdldF9zdGFydGVkJ1xuICAgICAgICB9XG4gICAgICAgICdlZGl0aW5nJzp7XG4gICAgICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAgICAgJ2ludHJvJzp7XG4gICAgICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICAgICAgQ29kZXdhdmUgYWxsb3dzIHlvdSB0byBtYWtlIHlvdXIgb3duIGNvbW1hbmRzIChvciBhYmJyZXZpYXRpb25zKSBcbiAgICAgICAgICAgICAgICBwdXQgeW91ciBjb250ZW50IGluc2lkZSBcInNvdXJjZVwiIHRoZSBkbyBcInNhdmVcIi4gVHJ5IGFkZGluZyBhbnkgXG4gICAgICAgICAgICAgICAgdGV4dCB0aGF0IGlzIG9uIHlvdXIgbWluZC5cbiAgICAgICAgICAgICAgICB+fiFlZGl0IG15X25ld19jb21tYW5kfH5+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgSWYgeW91IGRpZCB0aGUgbGFzdCBzdGVwIHJpZ2h0LCB5b3Ugc2hvdWxkIHNlZSB5b3VyIHRleHQgd2hlbiB5b3VcbiAgICAgICAgICAgICAgICBkbyB0aGUgZm9sbG93aW5nIGNvbW1hbmQuIEl0IGlzIG5vdyBzYXZlZCBhbmQgeW91IGNhbiB1c2UgaXQgXG4gICAgICAgICAgICAgICAgd2hlbmV2ZXIgeW91IHdhbnQuXG4gICAgICAgICAgICAgICAgfn4hbXlfbmV3X2NvbW1hbmR+flxuICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICB+fmhlbHA6ZWRpdGluZzppbnRyb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEFsbCB0aGUgd2luZG93cyBvZiBDb2Rld2F2ZSBhcmUgbWFkZSB3aXRoIHRoZSBjb21tYW5kIFwiYm94XCIuIFxuICAgICAgICAgICAgVGhleSBhcmUgbWVhbnQgdG8gZGlzcGxheSB0ZXh0IHRoYXQgc2hvdWxkIG5vdCByZW1haW4gaW4geW91ciBjb2RlLiBcbiAgICAgICAgICAgIFRoZXkgYXJlIHZhbGlkIGNvbW1lbnRzIHNvIHRoZXkgd29uJ3QgYnJlYWsgeW91ciBjb2RlIGFuZCB0aGUgY29tbWFuZCBcbiAgICAgICAgICAgIFwiY2xvc2VcIiBjYW4gYmUgdXNlZCB0byByZW1vdmUgdGhlbSByYXBpZGx5LiBZb3UgY2FuIG1ha2UgeW91ciBvd24gXG4gICAgICAgICAgICBjb21tYW5kcyB3aXRoIHRoZW0gaWYgeW91IG5lZWQgdG8gZGlzcGxheSBzb21lIHRleHQgdGVtcG9yYXJpbHkuXG4gICAgICAgICAgICB+fiFib3h+flxuICAgICAgICAgICAgVGhlIGJveCB3aWxsIHNjYWxlIHdpdGggdGhlIGNvbnRlbnQgeW91IHB1dCBpbiBpdFxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+IS9ib3h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICBXaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxuICAgICAgICAgICAgd2lsbCBiZSBsb2NhdGVkIG9uY2UgdGhlIGNvbW1hbmQgaXMgZXhwYW5kZWQuIFRvIGRvIHRoYXQsIHVzZSBhIFwifFwiIFxuICAgICAgICAgICAgKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcbiAgICAgICAgICAgIGNoYXJhY3Rlci5cbiAgICAgICAgICAgIH5+IWJveH5+XG4gICAgICAgICAgICBvbmUgOiB8IFxuICAgICAgICAgICAgdHdvIDogfHxcbiAgICAgICAgICAgIH5+IS9ib3h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBZb3UgY2FuIGFsc28gdXNlIHRoZSBcImVzY2FwZV9waXBlc1wiIGNvbW1hbmQgdGhhdCB3aWxsIGVzY2FwZSBhbnkgXG4gICAgICAgICAgICB2ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xuICAgICAgICAgICAgfn4hZXNjYXBlX3BpcGVzfn5cbiAgICAgICAgICAgIHxcbiAgICAgICAgICAgIH5+IS9lc2NhcGVfcGlwZXN+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb21tYW5kcyBpbnNpZGUgb3RoZXIgY29tbWFuZHMgd2lsbCBiZSBleHBhbmRlZCBhdXRvbWF0aWNhbGx5LlxuICAgICAgICAgICAgSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxuICAgICAgICAgICAgdGhlIHBhcmVudCBjb21tYW5kIGlzIGV4cGFuZGVkLCB1c2UgYSBcIiFcIiAoZXhjbGFtYXRpb24gbWFyaykuXG4gICAgICAgICAgICB+fiEhaGVsbG9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBGb3IgY29tbWFuZHMgdGhhdCBoYXZlIGJvdGggYW4gb3BlbmluZyBhbmQgYSBjbG9zaW5nIHRhZywgeW91IGNhbiB1c2VcbiAgICAgICAgICAgIHRoZSBcImNvbnRlbnRcIiBjb21tYW5kLiBcImNvbnRlbnRcIiB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRleHRcbiAgICAgICAgICAgIHRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cbiAgICAgICAgICAgIH5+IWVkaXQgcGhwOmlubmVyOmlmfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ2VkaXQnOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmVkaXRpbmcnXG4gICAgICAgIH1cbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgfSxcbiAgICAnbm9fZXhlY3V0ZSc6e1xuICAgICAgJ3Jlc3VsdCcgOiBub19leGVjdXRlXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBQcmV2ZW50IGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgZnJvbSBleGVjdXRpbmdcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnZXNjYXBlX3BpcGVzJzp7XG4gICAgICAncmVzdWx0JyA6IHF1b3RlX2NhcnJldCxcbiAgICAgICdjaGVja0NhcnJldCcgOiBmYWxzZVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgRXNjYXBlIGFsbCBjYXJyZXRzIChmcm9tIFwifFwiIHRvIFwifHxcIilcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncXVvdGVfY2FycmV0Jzp7XG4gICAgICAnYWxpYXNPZic6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICB9XG4gICAgJ2V4ZWNfcGFyZW50Jzp7XG4gICAgICAnZXhlY3V0ZScgOiBleGVjX3BhcmVudFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1xuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdjb250ZW50Jzp7XG4gICAgICAncmVzdWx0JyA6IGdldENvbnRlbnRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIE1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxuICAgICAgICB0aGlzIHdpbGwgcmV0dXJuIHdoYXQgd2FzIGJldHdlZW4gdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBvZiBhIGNvbW1hbmRcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnYm94Jzp7XG4gICAgICAnY2xzJyA6IEJveENtZFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQ3JlYXRlIHRoZSBhcHBhcmVuY2Ugb2YgYSBib3ggY29tcG9zZWQgZnJvbSBjaGFyYWN0ZXJzLiBcbiAgICAgICAgVXN1YWxseSB3cmFwcGVkIGluIGEgY29tbWVudC5cblxuICAgICAgICBUaGUgYm94IHdpbGwgdHJ5IHRvIGFqdXN0IGl0J3Mgc2l6ZSBmcm9tIHRoZSBjb250ZW50XG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2Nsb3NlJzp7XG4gICAgICAnY2xzJyA6IENsb3NlQ21kXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBXaWxsIGNsb3NlIHRoZSBmaXJzdCBib3ggYXJvdW5kIHRoaXNcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncGFyYW0nOntcbiAgICAgICdyZXN1bHQnIDogZ2V0UGFyYW1cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIE1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxuICAgICAgICB0aGlzIHdpbGwgcmV0dXJuIGEgcGFyYW1ldGVyIGZyb20gdGhpcyBjb21tYW5kIGNhbGxcblxuICAgICAgICBZb3UgY2FuIHBhc3MgYSBudW1iZXIsIGEgc3RyaW5nLCBvciBib3RoLiBcbiAgICAgICAgQSBudW1iZXIgZm9yIGEgcG9zaXRpb25lZCBhcmd1bWVudCBhbmQgYSBzdHJpbmdcbiAgICAgICAgZm9yIGEgbmFtZWQgcGFyYW1ldGVyXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2VkaXQnOntcbiAgICAgICdjbWRzJyA6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICdzYXZlJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAnY2xzJyA6IEVkaXRDbWQsXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2NtZCddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxuICAgICAgICBTZWUgfn4haGVscDplZGl0aW5nfn4gZm9yIGEgcXVpY2sgdHV0b3JpYWxcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncmVuYW1lJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfYXBwbGljYWJsZScgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCIsXG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiByZW5hbWVDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWUsXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2Zyb20nLCd0byddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBBbGxvd3MgdG8gcmVuYW1lIGEgY29tbWFuZCBhbmQgY2hhbmdlIGl0J3MgbmFtZXNwYWNlLiBcbiAgICAgICAgWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAtIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcbiAgICAgICAgLSBUaGVuIHNlY29uZCBwYXJhbSBpcyB0aGUgbmV3IG5hbWUsIGlmIGl0IGhhcyBubyBuYW1lc3BhY2UsXG4gICAgICAgICAgaXQgd2lsbCB1c2UgdGhlIG9uZSBmcm9tIHRoZSBvcmlnaW5hbCBjb21tYW5kLlxuXG4gICAgICAgIGV4Ljogfn4hcmVuYW1lIG15X2NvbW1hbmQgbXlfY29tbWFuZDJ+flxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdyZW1vdmUnOntcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ25vdF9hcHBsaWNhYmxlJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBZb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIixcbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgICAncmVzdWx0JyA6IHJlbW92ZUNvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydjbWQnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQWxsb3dzIHRvIHJlbW92ZSBhIGNvbW1hbmQuIFxuICAgICAgICBZb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2FsaWFzJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiBhbGlhc0NvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgIH0sXG4gICAgJ25hbWVzcGFjZSc6e1xuICAgICAgJ2NscycgOiBOYW1lU3BhY2VDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIFNob3cgdGhlIGN1cnJlbnQgbmFtZXNwYWNlcy5cblxuICAgICAgICBBIG5hbWUgc3BhY2UgY291bGQgYmUgdGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlXG4gICAgICAgIG9yIG90aGVyIGtpbmQgb2YgY29udGV4dHNcblxuICAgICAgICBJZiB5b3UgcGFzcyBhIHBhcmFtIHRvIHRoaXMgY29tbWFuZCwgaXQgd2lsbCBcbiAgICAgICAgYWRkIHRoZSBwYXJhbSBhcyBhIG5hbWVzcGFjZSBmb3IgdGhlIGN1cnJlbnQgZWRpdG9yXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ25zcGMnOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOm5hbWVzcGFjZSdcbiAgICB9LFxuICAgICdsaXN0Jzp7XG4gICAgICAncmVzdWx0JyA6IGxpc3RDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCdib3gnLCdjb250ZXh0J11cbiAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcblxuICAgICAgICBZb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcbiAgICAgICAgYnkgZGVmYXVsdCBhbGwgY3VyZW50IG5hbWVzcGFjZSB3aWxsIGJlIHNob3duXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2xzJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTpsaXN0J1xuICAgIH0sXG4gICAgJ2dldCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBnZXRDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgb3V0cHV0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3NldCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBzZXRDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCd2YWx1ZSddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBzZXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnZW1tZXQnOntcbiAgICAgICdjbHMnIDogRW1tZXRDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIENvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcbiAgICAgICAgcHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuXG5cbiAgICAgICAgUGFzcyB0aGUgRW1tZXQgYWJicmV2aWF0aW9uIGFzIGEgcGFyYW0gdG8gZXhwZW5kIGl0LlxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgIFxuICB9KVxuICBcbmhlbHAgPSAoaW5zdGFuY2UpIC0+XG4gIGNtZE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnY21kJ10pXG4gIGlmIGNtZE5hbWU/XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQoY21kTmFtZSlcbiAgICBpZiBjbWQ/XG4gICAgICBoZWxwQ21kID0gY21kLmdldENtZCgnaGVscCcpXG4gICAgICB0ZXh0ID0gaWYgaGVscENtZCB0aGVuIFwifn4je2hlbHBDbWQuZnVsbE5hbWV9fn5cIiBlbHNlIFwiVGhpcyBjb21tYW5kIGhhcyBubyBoZWxwIHRleHRcIlxuICAgICAgc3ViY29tbWFuZHMgPSBpZiBjbWQuY21kcy5sZW5ndGhcbiAgICAgICAgXCJcIlwiXG5cbiAgICAgICAgU3ViLUNvbW1hbmRzIDpcbiAgICAgICAgfn5scyAje2NtZC5mdWxsTmFtZX0gYm94Om5vIGNvbnRleHQ6bm9+flxuICAgICAgICBcIlwiXCJcbiAgICAgIGVsc2UgXG4gICAgICAgIFwiXCJcbiAgICAgIHJldHVybiBcIlwiXCJcbiAgICAgICAgfn5ib3h+flxuICAgICAgICBIZWxwIGZvciB+fiEje2NtZC5mdWxsTmFtZX1+fiA6XG5cbiAgICAgICAgI3t0ZXh0fVxuICAgICAgICAje3N1YmNvbW1hbmRzfVxuXG4gICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgIH5+L2JveH5+XG4gICAgICAgIFwiXCJcIlxuICAgIGVsc2UgXG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbiAgZWxzZVxuICAgIHJldHVybiAnfn5oZWxwOm92ZXJ2aWV3fn4nXG5cbm5vX2V4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gIHJlZyA9IG5ldyBSZWdFeHAoXCJeKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cykgKyAnKScgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpKVxuICByZXR1cm4gaW5zdGFuY2Uuc3RyLnJlcGxhY2UocmVnLCckMScpXG4gIFxucXVvdGVfY2FycmV0ID0gKGluc3RhbmNlKSAtPlxuICByZXR1cm4gaW5zdGFuY2UuY29udGVudC5yZXBsYWNlKC9cXHwvZywgJ3x8JylcbmV4ZWNfcGFyZW50ID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5wYXJlbnQ/XG4gICAgcmVzID0gaW5zdGFuY2UucGFyZW50LmV4ZWN1dGUoKVxuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnRcbiAgICBpbnN0YW5jZS5yZXBsYWNlRW5kID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VFbmRcbiAgICByZXR1cm4gcmVzXG5nZXRDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuICBhZmZpeGVzX2VtcHR5ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydhZmZpeGVzX2VtcHR5J10sZmFsc2UpXG4gIHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gIHN1ZmZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sJycpXG4gIGlmIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2U/XG4gICAgcmV0dXJuIHByZWZpeCArIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmNvbnRlbnQgb3IgJycpICsgc3VmZml4XG4gIGlmIGFmZml4ZXNfZW1wdHlcbiAgICByZXR1cm4gcHJlZml4ICsgc3VmZml4XG5yZW5hbWVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZVxuICAgIHN0b3JhZ2UubG9hZCgnY21kcycpXG4gIC50aGVuIChzYXZlZENtZHMpPT5cbiAgICBvcmlnbmluYWxOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2Zyb20nXSlcbiAgICBuZXdOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ3RvJ10pXG4gICAgaWYgb3JpZ25pbmFsTmFtZT8gYW5kIG5ld05hbWU/XG4gICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChvcmlnbmluYWxOYW1lKVxuICAgICAgaWYgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdPyBhbmQgY21kP1xuICAgICAgICB1bmxlc3MgbmV3TmFtZS5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCcnKSArIG5ld05hbWVcbiAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXVxuICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShuZXdOYW1lLGNtZERhdGEpXG4gICAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgICAgc2F2ZWRDbWRzW25ld05hbWVdID0gY21kRGF0YVxuICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgICAgICBzdG9yYWdlLnNhdmUoJ2NtZHMnLHNhdmVkQ21kcylcbiAgICAgICAgLnRoZW4gPT5cbiAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgZWxzZSBpZiBjbWQ/IFxuICAgICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIlxuICAgICAgZWxzZSBcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5yZW1vdmVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgICBpZiBuYW1lP1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG4gICAgICAgIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpXG4gICAgICAudGhlbiAoc2F2ZWRDbWRzKT0+XG4gICAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG5hbWUpXG4gICAgICAgIGlmIHNhdmVkQ21kc1tuYW1lXT8gYW5kIGNtZD9cbiAgICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW25hbWVdXG4gICAgICAgICAgY21kLnVucmVnaXN0ZXIoKVxuICAgICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV1cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICAgICAgICBzdG9yYWdlLnNhdmUoJ2NtZHMnLHNhdmVkQ21kcylcbiAgICAgICAgICAudGhlbiA9PlxuICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgZWxzZSBpZiBjbWQ/IFxuICAgICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiXG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5hbGlhc0NvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCdhbGlhcyddKVxuICBpZiBuYW1lPyBhbmQgYWxpYXM/XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQobmFtZSlcbiAgICBpZiBjbWQ/XG4gICAgICBjbWQgPSBjbWQuZ2V0QWxpYXNlZCgpIG9yIGNtZFxuICAgICAgIyB1bmxlc3MgYWxpYXMuaW5kZXhPZignOicpID4gLTFcbiAgICAgICAgIyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChhbGlhcywgeyBhbGlhc09mOiBjbWQuZnVsbE5hbWUgfSlcbiAgICAgIHJldHVybiBcIlwiXG4gICAgZWxzZSBcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIlxuXG5saXN0Q29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgYm94ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnYm94J10sdHJ1ZSlcbiAgdXNlQ29udGV4dCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2NvbnRleHQnXSx0cnVlKVxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgbmFtZXNwYWNlcyA9IGlmIG5hbWUgXG4gICAgW25hbWVdIFxuICBlbHNlIFxuICAgIGluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLmZpbHRlcigobnNwYykgPT4gbnNwYyAhPSBpbnN0YW5jZS5jbWQuZnVsbE5hbWUpLmNvbmNhdChcIl9yb290XCIpXG5cbiAgY29udGV4dCA9IGlmIHVzZUNvbnRleHRcbiAgICBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpXG4gIGVsc2VcbiAgICBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dFxuXG4gIGNvbW1hbmRzID0gbmFtZXNwYWNlcy5yZWR1Y2UgKGNvbW1hbmRzLCBuc3BjKSA9PiBcbiAgICAgIGNtZCA9IGlmIG5zcGMgPT0gXCJfcm9vdFwiIHRoZW4gQ29tbWFuZC5jbWRzIGVsc2UgY29udGV4dC5nZXRDbWQobnNwYyxtdXN0RXhlY3V0ZTpmYWxzZSlcbiAgICAgIGlmIGNtZD9cbiAgICAgICAgY21kLmluaXQoKVxuICAgICAgICBpZiBjbWQuY21kc1xuICAgICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGNtZC5jbWRzKVxuICAgICAgY29tbWFuZHNcbiAgICAsIFtdXG5cbiAgdGV4dCA9IGlmIGNvbW1hbmRzLmxlbmd0aCBcbiAgICBjb21tYW5kcy5tYXAoKGNtZCk9PiBcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIChpZiBjbWQuaXNFeGVjdXRhYmxlKCkgdGhlbiAnfn4hJyBlbHNlICd+fiFscyAnKStjbWQuZnVsbE5hbWUrJ35+J1xuICAgICkuam9pbihcIlxcblwiKVxuICBlbHNlXG4gICAgXCJUaGlzIGNvbnRhaW5zIG5vIHN1Yi1jb21tYW5kc1wiXG5cbiAgaWYgYm94XG4gICAgXCJcIlwiXG4gICAgICB+fmJveH5+XG4gICAgICAje3RleHR9XG5cbiAgICAgIH5+IWNsb3NlfH5+XG4gICAgICB+fi9ib3h+flxuICAgICAgXCJcIlwiXG4gIGVsc2VcbiAgICB0ZXh0XG4gIFxuZ2V0Q29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV1cbiAgXG5zZXRDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuXG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWwgaWYgdmFsP1xuXG5nZXRQYXJhbSA9IChpbnN0YW5jZSkgLT5cbiAgaWYgaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZT9cbiAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5nZXRQYXJhbShpbnN0YW5jZS5wYXJhbXMsaW5zdGFuY2UuZ2V0UGFyYW0oWydkZWYnLCdkZWZhdWx0J10pKVxuICBcbmNsYXNzIEJveENtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGluc3RhbmNlLmNvbnRleHQpXG4gICAgQGNtZCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ2NtZCddKVxuICAgIGlmIEBjbWQ/XG4gICAgICBAaGVscGVyLm9wZW5UZXh0ICA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgQGNtZCArIEBpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzXG4gICAgICBAaGVscGVyLmNsb3NlVGV4dCA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgQGluc3RhbmNlLmNvZGV3YXZlLmNsb3NlQ2hhciArIEBjbWQuc3BsaXQoXCIgXCIpWzBdICsgQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICBAaGVscGVyLmRlY28gPSBAaW5zdGFuY2UuY29kZXdhdmUuZGVjb1xuICAgIEBoZWxwZXIucGFkID0gMlxuICAgIEBoZWxwZXIucHJlZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gICAgQGhlbHBlci5zdWZmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgICBcbiAgaGVpZ2h0OiAtPlxuICAgIGlmIEBib3VuZHMoKT9cbiAgICAgIGhlaWdodCA9IEBib3VuZHMoKS5oZWlnaHRcbiAgICBlbHNlXG4gICAgICBoZWlnaHQgPSAzXG4gICAgICBcbiAgICBwYXJhbXMgPSBbJ2hlaWdodCddXG4gICAgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxIFxuICAgICAgcGFyYW1zLnB1c2goMSlcbiAgICBlbHNlIGlmIEBpbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMFxuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICByZXR1cm4gQGluc3RhbmNlLmdldFBhcmFtKHBhcmFtcyxoZWlnaHQpXG4gICAgICBcbiAgd2lkdGg6IC0+XG4gICAgaWYgQGJvdW5kcygpP1xuICAgICAgd2lkdGggPSBAYm91bmRzKCkud2lkdGhcbiAgICBlbHNlXG4gICAgICB3aWR0aCA9IDNcbiAgICAgIFxuICAgIHBhcmFtcyA9IFsnd2lkdGgnXVxuICAgIGlmIEBpbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSBcbiAgICAgIHBhcmFtcy5wdXNoKDApXG4gICAgcmV0dXJuIE1hdGgubWF4KEBtaW5XaWR0aCgpLCBAaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCB3aWR0aCkpXG5cbiAgXG4gIGJvdW5kczogLT5cbiAgICBpZiBAaW5zdGFuY2UuY29udGVudFxuICAgICAgdW5sZXNzIEBfYm91bmRzP1xuICAgICAgICBAX2JvdW5kcyA9IEBoZWxwZXIudGV4dEJvdW5kcyhAaW5zdGFuY2UuY29udGVudClcbiAgICAgIHJldHVybiBAX2JvdW5kc1xuICAgICAgXG4gIHJlc3VsdDogLT5cbiAgICBAaGVscGVyLmhlaWdodCA9IEBoZWlnaHQoKVxuICAgIEBoZWxwZXIud2lkdGggPSBAd2lkdGgoKVxuICAgIHJldHVybiBAaGVscGVyLmRyYXcoQGluc3RhbmNlLmNvbnRlbnQpXG4gIG1pbldpZHRoOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICByZXR1cm4gQGNtZC5sZW5ndGhcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMFxuICBcbmNsYXNzIENsb3NlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAaGVscGVyID0gbmV3IEJveEhlbHBlcihAaW5zdGFuY2UuY29udGV4dClcbiAgZXhlY3V0ZTogLT5cbiAgICBwcmVmaXggPSBAaGVscGVyLnByZWZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCcnKVxuICAgIHN1ZmZpeCA9IEBoZWxwZXIuc3VmZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sJycpXG4gICAgYm94ID0gQGhlbHBlci5nZXRCb3hGb3JQb3MoQGluc3RhbmNlLmdldFBvcygpKVxuICAgIHJlcXVpcmVkX2FmZml4ZXMgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydyZXF1aXJlZF9hZmZpeGVzJ10sdHJ1ZSlcbiAgICBpZiAhcmVxdWlyZWRfYWZmaXhlc1xuICAgICAgQGhlbHBlci5wcmVmaXggPSBAaGVscGVyLnN1ZmZpeCA9ICcnXG4gICAgICBib3gyID0gQGhlbHBlci5nZXRCb3hGb3JQb3MoQGluc3RhbmNlLmdldFBvcygpKVxuICAgICAgaWYgYm94Mj8gYW5kICghYm94PyBvciBib3guc3RhcnQgPCBib3gyLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCBvciBib3guZW5kID4gYm94Mi5lbmQgKyBzdWZmaXgubGVuZ3RoKVxuICAgICAgICBib3ggPSBib3gyXG4gICAgaWYgYm94P1xuICAgICAgZGVwdGggPSBAaGVscGVyLmdldE5lc3RlZEx2bChAaW5zdGFuY2UuZ2V0UG9zKCkuc3RhcnQpXG4gICAgICBpZiBkZXB0aCA8IDJcbiAgICAgICAgQGluc3RhbmNlLmluQm94ID0gbnVsbFxuICAgICAgQGluc3RhbmNlLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KGJveC5zdGFydCxib3guZW5kLCcnKSlcbiAgICBlbHNlXG4gICAgICBAaW5zdGFuY2UucmVwbGFjZVdpdGgoJycpXG4gICAgICAgICAgXG5jbGFzcyBFZGl0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAY21kTmFtZSA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMCwnY21kJ10pXG4gICAgQHZlcmJhbGl6ZSA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMV0pIGluIFsndicsJ3ZlcmJhbGl6ZSddXG4gICAgaWYgQGNtZE5hbWU/XG4gICAgICBAZmluZGVyID0gQGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0RmluZGVyKEBjbWROYW1lKSBcbiAgICAgIEBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2VcbiAgICAgIEBjbWQgPSBAZmluZGVyLmZpbmQoKVxuICAgIEBlZGl0YWJsZSA9IGlmIEBjbWQ/IHRoZW4gQGNtZC5pc0VkaXRhYmxlKCkgZWxzZSB0cnVlXG4gIHJlc3VsdDogLT5cbiAgICBpZiBAaW5zdGFuY2UuY29udGVudFxuICAgICAgcmV0dXJuIEByZXN1bHRXaXRoQ29udGVudCgpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEByZXN1bHRXaXRob3V0Q29udGVudCgpXG4gIHJlc3VsdFdpdGhDb250ZW50OiAtPlxuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQoQGluc3RhbmNlLmNvbnRlbnQpXG4gICAgICBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgZGF0YSA9IHt9XG4gICAgICBmb3IgcCBpbiBFZGl0Q21kLnByb3BzXG4gICAgICAgIHAud3JpdGVGb3IocGFyc2VyLGRhdGEpXG4gICAgICBDb21tYW5kLnNhdmVDbWQoQGNtZE5hbWUsIGRhdGEpXG4gICAgICByZXR1cm4gJydcbiAgcHJvcHNEaXNwbGF5OiAtPlxuICAgICAgY21kID0gQGNtZFxuICAgICAgcmV0dXJuIEVkaXRDbWQucHJvcHMubWFwKCAocCktPiBwLmRpc3BsYXkoY21kKSApLmZpbHRlciggKHApLT4gcD8gKS5qb2luKFwiXFxuXCIpXG4gIHJlc3VsdFdpdGhvdXRDb250ZW50OiAtPlxuICAgIGlmICFAY21kIG9yIEBlZGl0YWJsZVxuICAgICAgbmFtZSA9IGlmIEBjbWQgdGhlbiBAY21kLmZ1bGxOYW1lIGVsc2UgQGNtZE5hbWVcbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KFxuICAgICAgICBcIlwiXCJcbiAgICAgICAgfn5ib3ggY21kOlwiI3tAaW5zdGFuY2UuY21kLmZ1bGxOYW1lfSAje25hbWV9XCJ+flxuICAgICAgICAje0Bwcm9wc0Rpc3BsYXkoKX1cbiAgICAgICAgfn4hc2F2ZX5+IH5+IWNsb3Nlfn5cbiAgICAgICAgfn4vYm94fn5cbiAgICAgICAgXCJcIlwiKVxuICAgICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gbm9cbiAgICAgIHJldHVybiBpZiBAdmVyYmFsaXplIHRoZW4gcGFyc2VyLmdldFRleHQoKSBlbHNlIHBhcnNlci5wYXJzZUFsbCgpXG5FZGl0Q21kLnNldENtZHMgPSAoYmFzZSkgLT5cbiAgaW5JbnN0YW5jZSA9IGJhc2UuaW5faW5zdGFuY2UgPSB7Y21kczp7fX1cbiAgZm9yIHAgaW4gRWRpdENtZC5wcm9wc1xuICAgIHAuc2V0Q21kKGluSW5zdGFuY2UuY21kcylcbiAgICAjIHAuc2V0Q21kKGJhc2UpXG4gIHJldHVybiBiYXNlXG5FZGl0Q21kLnByb3BzID0gW1xuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fY2FycmV0JywgICAgICAgICB7b3B0OidjaGVja0NhcnJldCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJywgICAgICAgICAge29wdDoncGFyc2UnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCAgICdwcmV2ZW50X3BhcnNlX2FsbCcsIHtvcHQ6J3ByZXZlbnRQYXJzZUFsbCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woICAgJ3JlcGxhY2VfYm94JywgICAgICAge29wdDoncmVwbGFjZUJveCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZyggJ25hbWVfdG9fcGFyYW0nLCAgICAge29wdDonbmFtZVRvUGFyYW0nfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoICdhbGlhc19vZicsICAgICAgICAgIHt2YXI6J2FsaWFzT2YnLCBjYXJyZXQ6dHJ1ZX0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCAnaGVscCcsICAgICAgICAgICAgICB7ZnVuY3Q6J2hlbHAnLCBzaG93RW1wdHk6dHJ1ZX0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCAnc291cmNlJywgICAgICAgICAgICB7dmFyOidyZXN1bHRTdHInLCBkYXRhTmFtZToncmVzdWx0Jywgc2hvd0VtcHR5OnRydWUsIGNhcnJldDp0cnVlfSksXG5dXG5jbGFzcyBOYW1lU3BhY2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBuYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswXSlcbiAgcmVzdWx0OiAtPlxuICAgIGlmIEBuYW1lP1xuICAgICAgQGluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0LmFkZE5hbWVTcGFjZShAbmFtZSlcbiAgICAgIHJldHVybiAnJ1xuICAgIGVsc2VcbiAgICAgIG5hbWVzcGFjZXMgPSBAaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKClcbiAgICAgIHR4dCA9ICd+fmJveH5+XFxuJ1xuICAgICAgZm9yIG5zcGMgaW4gbmFtZXNwYWNlcyBcbiAgICAgICAgaWYgbnNwYyAhPSBAaW5zdGFuY2UuY21kLmZ1bGxOYW1lXG4gICAgICAgICAgdHh0ICs9IG5zcGMrJ1xcbidcbiAgICAgIHR4dCArPSAnfn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dClcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKVxuXG5cblxuY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBhYmJyID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCdhYmJyJywnYWJicmV2aWF0aW9uJ10pXG4gICAgQGxhbmcgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2xhbmcnLCdsYW5ndWFnZSddKVxuICByZXN1bHQ6IC0+XG4gICAgZW1tZXQgPSBpZiB3aW5kb3c/LmVtbWV0P1xuICAgICAgd2luZG93LmVtbWV0XG4gICAgZWxzZSBpZiB3aW5kb3c/LnNlbGY/LmVtbWV0P1xuICAgICAgd2luZG93LnNlbGYuZW1tZXRcbiAgICBlbHNlIGlmIHdpbmRvdz8uZ2xvYmFsPy5lbW1ldD9cbiAgICAgIHdpbmRvdy5nbG9iYWwuZW1tZXRcbiAgICBlbHNlIGlmIHJlcXVpcmU/IFxuICAgICAgdHJ5IFxuICAgICAgICByZXF1aXJlKCdlbW1ldCcpXG4gICAgICBjYXRjaCBleFxuICAgICAgICBAaW5zdGFuY2UuY29kZXdhdmUubG9nZ2VyLmxvZygnRW1tZXQgaXMgbm90IGF2YWlsYWJsZSwgaXQgbWF5IG5lZWQgdG8gYmUgaW5zdGFsbGVkIG1hbnVhbGx5JylcbiAgICAgICAgbnVsbFxuICAgIGlmIGVtbWV0P1xuICAgICAgIyBlbW1ldC5yZXF1aXJlKCcuL3BhcnNlci9hYmJyZXZpYXRpb24nKS5leHBhbmQoJ3VsPmxpJywge3Bhc3RlZENvbnRlbnQ6J2xvcmVtJ30pXG4gICAgICByZXMgPSBlbW1ldC5leHBhbmRBYmJyZXZpYXRpb24oQGFiYnIsIEBsYW5nKVxuICAgICAgcmVzLnJlcGxhY2UoL1xcJFxcezBcXH0vZywgJ3wnKVxuXG5cblxuIiwidmFyIEJveENtZCwgQ2xvc2VDbWQsIEVkaXRDbWQsIEVtbWV0Q21kLCBOYW1lU3BhY2VDbWQsIGFsaWFzQ29tbWFuZCwgZXhlY19wYXJlbnQsIGdldENvbW1hbmQsIGdldENvbnRlbnQsIGdldFBhcmFtLCBoZWxwLCBsaXN0Q29tbWFuZCwgbm9fZXhlY3V0ZSwgcXVvdGVfY2FycmV0LCByZW1vdmVDb21tYW5kLCByZW5hbWVDb21tYW5kLCBzZXRDb21tYW5kO1xuXG5pbXBvcnQge1xuICBDb21tYW5kLFxuICBCYXNlQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgTGFuZ0RldGVjdG9yXG59IGZyb20gJy4uL0RldGVjdG9yJztcblxuaW1wb3J0IHtcbiAgQm94SGVscGVyXG59IGZyb20gJy4uL0JveEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIEVkaXRDbWRQcm9wXG59IGZyb20gJy4uL0VkaXRDbWRQcm9wJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgdmFyIENvcmVDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBDb3JlQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBjb3JlO1xuICAgIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKTtcbiAgICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSk7XG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICAnaGVscCc6IHtcbiAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAncmVzdWx0JzogaGVscCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJUbyBnZXQgaGVscCBvbiBhIHBlY2lmaWMgY29tbWFuZCwgZG8gOlxcbn5+aGVscCBoZWxsb35+IChoZWxsbyBiZWluZyB0aGUgY29tbWFuZClcIixcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ292ZXJ2aWV3Jzoge1xuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+cXVvdGVfY2FycmV0fn5cXG4gIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXFxuIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xcbi8gL19fLyBfIFxcXFwvIF9gIC8gLV9cXFxcIFxcXFwvXFxcXC8gLyBfYCBcXFxcIFYgLyAtXy9cXG5cXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XFxuVGhlIHRleHQgZWRpdG9yIGhlbHBlclxcbn5+L3F1b3RlX2NhcnJldH5+XFxuXFxuV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcXG55b3VyIHRleHQgZWRpdG9yLiBUaGVzZSBjb21tYW5kcyBtdXN0IGJlIHBsYWNlZCBiZXR3ZWVuIHR3byBcXG5wYWlycyBvZiBcXFwiflxcXCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiLCB3aXRoIHlvdXIgY3Vyc29yIGluc2lkZSB0aGUgY29tbWFuZFxcbkV4OiB+fiFoZWxsb35+XFxuXFxuWW91IGRvbnQgbmVlZCB0byBhY3R1YWxseSB0eXBlIGFueSBcXFwiflxcXCIgKHRpbGRlKS4gXFxuUHJlc3NpbmcgXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpbGwgYWRkIHRoZW0gaWYgeW91IGFyZSBub3QgYWxyZWFkeVxcbndpdGhpbiBhIGNvbW1hbmQuXFxuXFxuQ29kZXdhdmUgZG9lcyBub3QgdXNlIFVJIHRvIGRpc3BsYXkgYW55IGluZm9ybWF0aW9uLiBcXG5JbnN0ZWFkLCBpdCB1c2VzIHRleHQgd2l0aGluIGNvZGUgY29tbWVudHMgdG8gbWltaWMgVUlzLiBcXG5UaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcXG5pbiB0aGUgaGVscCBzZWN0aW9ucy5cXG5cXG5UbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpdGggeW91ciBjdXJzb3Igb24gdGhlIGxpbmUgYmVsbG93Llxcbn5+IWNsb3NlfH5+XFxuXFxuVXNlIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBmb3IgYSB3YWxrdGhyb3VnaCBvZiBzb21lIG9mIHRoZSBtYW55XFxuZmVhdHVyZXMgb2YgQ29kZXdhdmVcXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cXG5cXG5MaXN0IG9mIGFsbCBoZWxwIHN1YmplY3RzIFxcbn5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxcblxcbn5+IWNsb3Nlfn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc3ViamVjdHMnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn4haGVscH5+XFxufn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcXG5+fiFoZWxwOnN1YmplY3Rzfn4gKH5+IWhlbHA6c3Vifn4pXFxufn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6c3ViamVjdHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZ2V0X3N0YXJ0ZWQnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxuVGhlIGNsYXNzaWMgSGVsbG8gV29ybGQuXFxufn4haGVsbG98fn5cXG5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxufn5xdW90ZV9jYXJyZXR+flxcblxcbkZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGNyZWF0aW5nIHlvdXIgb3duIGNvbW1hbmRzLCBzZWU6XFxufn4haGVscDplZGl0aW5nfn5cXG5cXG5Db2Rld2F2ZSBjb21lcyB3aXRoIG1hbnkgcHJlLWV4aXN0aW5nIGNvbW1hbmRzLiBIZXJlIGlzIGFuIGV4YW1wbGVcXG5vZiBKYXZhU2NyaXB0IGFiYnJldmlhdGlvbnNcXG5+fiFqczpmfn5cXG5+fiFqczppZn5+XFxuICB+fiFqczpsb2d+flxcXCJ+fiFoZWxsb35+XFxcIn5+IS9qczpsb2d+flxcbn5+IS9qczppZn5+XFxufn4hL2pzOmZ+flxcblxcbkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxcbnVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cXG5+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXFxufn4hZW1tZXQgdWw+bGl+flxcbn5+IWVtbWV0IG0yIGNzc35+XFxuXFxuQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxcbmRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxcbn5+IWpzOmVhY2h+flxcbn5+IXBocDpvdXRlcjplYWNofn5cXG5+fiFwaHA6aW5uZXI6ZWFjaH5+XFxuXFxuU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXFxuZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcXG5hY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxcbmNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cXG5+fiFuYW1lc3BhY2V+flxcbn5+IWNvcmU6bmFtZXNwYWNlfn5cXG5cXG5Zb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxcbn5+IW5hbWVzcGFjZSBwaHB+flxcblxcbkNoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXFxufn4hbmFtZXNwYWNlfn5cXG5cXG5JbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXFxuY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcXG53aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxcblxcbn5+L3F1b3RlX2NhcnJldH5+XFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZGVtbyc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6Z2V0X3N0YXJ0ZWQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZWRpdGluZyc6IHtcbiAgICAgICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICAgICAnaW50cm8nOiB7XG4gICAgICAgICAgICAgICAgJ3Jlc3VsdCc6IFwiQ29kZXdhdmUgYWxsb3dzIHlvdSB0byBtYWtlIHlvdXIgb3duIGNvbW1hbmRzIChvciBhYmJyZXZpYXRpb25zKSBcXG5wdXQgeW91ciBjb250ZW50IGluc2lkZSBcXFwic291cmNlXFxcIiB0aGUgZG8gXFxcInNhdmVcXFwiLiBUcnkgYWRkaW5nIGFueSBcXG50ZXh0IHRoYXQgaXMgb24geW91ciBtaW5kLlxcbn5+IWVkaXQgbXlfbmV3X2NvbW1hbmR8fn5cXG5cXG5JZiB5b3UgZGlkIHRoZSBsYXN0IHN0ZXAgcmlnaHQsIHlvdSBzaG91bGQgc2VlIHlvdXIgdGV4dCB3aGVuIHlvdVxcbmRvIHRoZSBmb2xsb3dpbmcgY29tbWFuZC4gSXQgaXMgbm93IHNhdmVkIGFuZCB5b3UgY2FuIHVzZSBpdCBcXG53aGVuZXZlciB5b3Ugd2FudC5cXG5+fiFteV9uZXdfY29tbWFuZH5+XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxuXFxuQWxsIHRoZSB3aW5kb3dzIG9mIENvZGV3YXZlIGFyZSBtYWRlIHdpdGggdGhlIGNvbW1hbmQgXFxcImJveFxcXCIuIFxcblRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXFxuVGhleSBhcmUgdmFsaWQgY29tbWVudHMgc28gdGhleSB3b24ndCBicmVhayB5b3VyIGNvZGUgYW5kIHRoZSBjb21tYW5kIFxcblxcXCJjbG9zZVxcXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxcbmNvbW1hbmRzIHdpdGggdGhlbSBpZiB5b3UgbmVlZCB0byBkaXNwbGF5IHNvbWUgdGV4dCB0ZW1wb3JhcmlseS5cXG5+fiFib3h+flxcblRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcXG5+fiFjbG9zZXx+flxcbn5+IS9ib3h+flxcblxcbn5+cXVvdGVfY2FycmV0fn5cXG5XaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxcbndpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcXFwifFxcXCIgXFxuKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcXG5jaGFyYWN0ZXIuXFxufn4hYm94fn5cXG5vbmUgOiB8IFxcbnR3byA6IHx8XFxufn4hL2JveH5+XFxuXFxuWW91IGNhbiBhbHNvIHVzZSB0aGUgXFxcImVzY2FwZV9waXBlc1xcXCIgY29tbWFuZCB0aGF0IHdpbGwgZXNjYXBlIGFueSBcXG52ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xcbn5+IWVzY2FwZV9waXBlc35+XFxufFxcbn5+IS9lc2NhcGVfcGlwZXN+flxcblxcbkNvbW1hbmRzIGluc2lkZSBvdGhlciBjb21tYW5kcyB3aWxsIGJlIGV4cGFuZGVkIGF1dG9tYXRpY2FsbHkuXFxuSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxcbnRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXFxcIiFcXFwiIChleGNsYW1hdGlvbiBtYXJrKS5cXG5+fiEhaGVsbG9+flxcblxcbkZvciBjb21tYW5kcyB0aGF0IGhhdmUgYm90aCBhbiBvcGVuaW5nIGFuZCBhIGNsb3NpbmcgdGFnLCB5b3UgY2FuIHVzZVxcbnRoZSBcXFwiY29udGVudFxcXCIgY29tbWFuZC4gXFxcImNvbnRlbnRcXFwiIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGV4dFxcbnRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cXG5+fiFlZGl0IHBocDppbm5lcjppZn5+XFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdlZGl0Jzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDplZGl0aW5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnbm9fZXhlY3V0ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IG5vX2V4ZWN1dGUsXG4gICAgICAgICdoZWxwJzogXCJQcmV2ZW50IGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgZnJvbSBleGVjdXRpbmdcIlxuICAgICAgfSxcbiAgICAgICdlc2NhcGVfcGlwZXMnOiB7XG4gICAgICAgICdyZXN1bHQnOiBxdW90ZV9jYXJyZXQsXG4gICAgICAgICdjaGVja0NhcnJldCc6IGZhbHNlLFxuICAgICAgICAnaGVscCc6IFwiRXNjYXBlIGFsbCBjYXJyZXRzIChmcm9tIFxcXCJ8XFxcIiB0byBcXFwifHxcXFwiKVwiXG4gICAgICB9LFxuICAgICAgJ3F1b3RlX2NhcnJldCc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgICB9LFxuICAgICAgJ2V4ZWNfcGFyZW50Jzoge1xuICAgICAgICAnZXhlY3V0ZSc6IGV4ZWNfcGFyZW50LFxuICAgICAgICAnaGVscCc6IFwiRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1wiXG4gICAgICB9LFxuICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRDb250ZW50LFxuICAgICAgICAnaGVscCc6IFwiTWFpbmx5IHVzZWQgZm9yIGNvbW1hbmQgZWRpdGlvbiwgXFxudGhpcyB3aWxsIHJldHVybiB3aGF0IHdhcyBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgb2YgYSBjb21tYW5kXCJcbiAgICAgIH0sXG4gICAgICAnYm94Jzoge1xuICAgICAgICAnY2xzJzogQm94Q21kLFxuICAgICAgICAnaGVscCc6IFwiQ3JlYXRlIHRoZSBhcHBhcmVuY2Ugb2YgYSBib3ggY29tcG9zZWQgZnJvbSBjaGFyYWN0ZXJzLiBcXG5Vc3VhbGx5IHdyYXBwZWQgaW4gYSBjb21tZW50LlxcblxcblRoZSBib3ggd2lsbCB0cnkgdG8gYWp1c3QgaXQncyBzaXplIGZyb20gdGhlIGNvbnRlbnRcIlxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgJ2Nscyc6IENsb3NlQ21kLFxuICAgICAgICAnaGVscCc6IFwiV2lsbCBjbG9zZSB0aGUgZmlyc3QgYm94IGFyb3VuZCB0aGlzXCJcbiAgICAgIH0sXG4gICAgICAncGFyYW0nOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRQYXJhbSxcbiAgICAgICAgJ2hlbHAnOiBcIk1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gYSBwYXJhbWV0ZXIgZnJvbSB0aGlzIGNvbW1hbmQgY2FsbFxcblxcbllvdSBjYW4gcGFzcyBhIG51bWJlciwgYSBzdHJpbmcsIG9yIGJvdGguIFxcbkEgbnVtYmVyIGZvciBhIHBvc2l0aW9uZWQgYXJndW1lbnQgYW5kIGEgc3RyaW5nXFxuZm9yIGEgbmFtZWQgcGFyYW1ldGVyXCJcbiAgICAgIH0sXG4gICAgICAnZWRpdCc6IHtcbiAgICAgICAgJ2NtZHMnOiBFZGl0Q21kLnNldENtZHMoe1xuICAgICAgICAgICdzYXZlJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICAnY2xzJzogRWRpdENtZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxcblNlZSB+fiFoZWxwOmVkaXRpbmd+fiBmb3IgYSBxdWljayB0dXRvcmlhbFwiXG4gICAgICB9LFxuICAgICAgJ3JlbmFtZSc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9hcHBsaWNhYmxlJzogXCJ+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIixcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IHJlbmFtZUNvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2Zyb20nLCAndG8nXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byByZW5hbWUgYSBjb21tYW5kIGFuZCBjaGFuZ2UgaXQncyBuYW1lc3BhY2UuIFxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG4tIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcXG4tIFRoZW4gc2Vjb25kIHBhcmFtIGlzIHRoZSBuZXcgbmFtZSwgaWYgaXQgaGFzIG5vIG5hbWVzcGFjZSxcXG4gIGl0IHdpbGwgdXNlIHRoZSBvbmUgZnJvbSB0aGUgb3JpZ2luYWwgY29tbWFuZC5cXG5cXG5leC46IH5+IXJlbmFtZSBteV9jb21tYW5kIG15X2NvbW1hbmQyfn5cIlxuICAgICAgfSxcbiAgICAgICdyZW1vdmUnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfYXBwbGljYWJsZSc6IFwifn5ib3h+flxcbllvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCIsXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiByZW1vdmVDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydjbWQnXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byByZW1vdmUgYSBjb21tYW5kLiBcXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXCJcbiAgICAgIH0sXG4gICAgICAnYWxpYXMnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogYWxpYXNDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ25hbWVzcGFjZSc6IHtcbiAgICAgICAgJ2Nscyc6IE5hbWVTcGFjZUNtZCxcbiAgICAgICAgJ2hlbHAnOiBcIlNob3cgdGhlIGN1cnJlbnQgbmFtZXNwYWNlcy5cXG5cXG5BIG5hbWUgc3BhY2UgY291bGQgYmUgdGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlXFxub3Igb3RoZXIga2luZCBvZiBjb250ZXh0c1xcblxcbklmIHlvdSBwYXNzIGEgcGFyYW0gdG8gdGhpcyBjb21tYW5kLCBpdCB3aWxsIFxcbmFkZCB0aGUgcGFyYW0gYXMgYSBuYW1lc3BhY2UgZm9yIHRoZSBjdXJyZW50IGVkaXRvclwiXG4gICAgICB9LFxuICAgICAgJ25zcGMnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6bmFtZXNwYWNlJ1xuICAgICAgfSxcbiAgICAgICdsaXN0Jzoge1xuICAgICAgICAncmVzdWx0JzogbGlzdENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnYm94JywgJ2NvbnRleHQnXSxcbiAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnaGVscCc6IFwiTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcXG5cXG5Zb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcXG5ieSBkZWZhdWx0IGFsbCBjdXJlbnQgbmFtZXNwYWNlIHdpbGwgYmUgc2hvd25cIlxuICAgICAgfSxcbiAgICAgICdscyc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpsaXN0J1xuICAgICAgfSxcbiAgICAgICdnZXQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJ10sXG4gICAgICAgICdoZWxwJzogXCJvdXRwdXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcIlxuICAgICAgfSxcbiAgICAgICdzZXQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBzZXRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ3ZhbHVlJ10sXG4gICAgICAgICdoZWxwJzogXCJzZXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcIlxuICAgICAgfSxcbiAgICAgICdlbW1ldCc6IHtcbiAgICAgICAgJ2Nscyc6IEVtbWV0Q21kLFxuICAgICAgICAnaGVscCc6IFwiQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxcbnByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLlxcblxcblBhc3MgdGhlIEVtbWV0IGFiYnJldmlhdGlvbiBhcyBhIHBhcmFtIHRvIGV4cGVuZCBpdC5cIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbmhlbHAgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgY21kLCBjbWROYW1lLCBoZWxwQ21kLCBzdWJjb21tYW5kcywgdGV4dDtcbiAgY21kTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuICBpZiAoY21kTmFtZSAhPSBudWxsKSB7XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQoY21kTmFtZSk7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBoZWxwQ21kID0gY21kLmdldENtZCgnaGVscCcpO1xuICAgICAgdGV4dCA9IGhlbHBDbWQgPyBgfn4ke2hlbHBDbWQuZnVsbE5hbWV9fn5gIDogXCJUaGlzIGNvbW1hbmQgaGFzIG5vIGhlbHAgdGV4dFwiO1xuICAgICAgc3ViY29tbWFuZHMgPSBjbWQuY21kcy5sZW5ndGggPyBgXFxuU3ViLUNvbW1hbmRzIDpcXG5+fmxzICR7Y21kLmZ1bGxOYW1lfSBib3g6bm8gY29udGV4dDpub35+YCA6IFwiXCI7XG4gICAgICByZXR1cm4gYH5+Ym94fn5cXG5IZWxwIGZvciB+fiEke2NtZC5mdWxsTmFtZX1+fiA6XFxuXFxuJHt0ZXh0fVxcbiR7c3ViY29tbWFuZHN9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICd+fmhlbHA6b3ZlcnZpZXd+fic7XG4gIH1cbn07XG5cbm5vX2V4ZWN1dGUgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgcmVnO1xuICByZWcgPSBuZXcgUmVnRXhwKFwiXihcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cykgKyAnKScgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpKTtcbiAgcmV0dXJuIGluc3RhbmNlLnN0ci5yZXBsYWNlKHJlZywgJyQxJyk7XG59O1xuXG5xdW90ZV9jYXJyZXQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gaW5zdGFuY2UuY29udGVudC5yZXBsYWNlKC9cXHwvZywgJ3x8Jyk7XG59O1xuXG5leGVjX3BhcmVudCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciByZXM7XG4gIGlmIChpbnN0YW5jZS5wYXJlbnQgIT0gbnVsbCkge1xuICAgIHJlcyA9IGluc3RhbmNlLnBhcmVudC5leGVjdXRlKCk7XG4gICAgaW5zdGFuY2UucmVwbGFjZVN0YXJ0ID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VTdGFydDtcbiAgICBpbnN0YW5jZS5yZXBsYWNlRW5kID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VFbmQ7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufTtcblxuZ2V0Q29udGVudCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBhZmZpeGVzX2VtcHR5LCBwcmVmaXgsIHN1ZmZpeDtcbiAgYWZmaXhlc19lbXB0eSA9IGluc3RhbmNlLmdldFBhcmFtKFsnYWZmaXhlc19lbXB0eSddLCBmYWxzZSk7XG4gIHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgc3VmZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpO1xuICBpZiAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHByZWZpeCArIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmNvbnRlbnQgfHwgJycpICsgc3VmZml4O1xuICB9XG4gIGlmIChhZmZpeGVzX2VtcHR5KSB7XG4gICAgcmV0dXJuIHByZWZpeCArIHN1ZmZpeDtcbiAgfVxufTtcblxucmVuYW1lQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICB2YXIgc3RvcmFnZTtcbiAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlO1xuICAgIHJldHVybiBzdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgfSkudGhlbigoc2F2ZWRDbWRzKSA9PiB7XG4gICAgdmFyIGNtZCwgY21kRGF0YSwgbmV3TmFtZSwgb3JpZ25pbmFsTmFtZTtcbiAgICBvcmlnbmluYWxOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmcm9tJ10pO1xuICAgIG5ld05hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ3RvJ10pO1xuICAgIGlmICgob3JpZ25pbmFsTmFtZSAhPSBudWxsKSAmJiAobmV3TmFtZSAhPSBudWxsKSkge1xuICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQob3JpZ25pbmFsTmFtZSk7XG4gICAgICBpZiAoKHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXSAhPSBudWxsKSAmJiAoY21kICE9IG51bGwpKSB7XG4gICAgICAgIGlmICghKG5ld05hbWUuaW5kZXhPZignOicpID4gLTEpKSB7XG4gICAgICAgICAgbmV3TmFtZSA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG9yaWduaW5hbE5hbWUsICcnKSArIG5ld05hbWU7XG4gICAgICAgIH1cbiAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXTtcbiAgICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEobmV3TmFtZSwgY21kRGF0YSk7XG4gICAgICAgIGNtZC51bnJlZ2lzdGVyKCk7XG4gICAgICAgIHNhdmVkQ21kc1tuZXdOYW1lXSA9IGNtZERhdGE7XG4gICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV07XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gc3RvcmFnZS5zYXZlKCdjbWRzJywgc2F2ZWRDbWRzKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxucmVtb3ZlQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICB2YXIgbmFtZTtcbiAgICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG4gICAgaWYgKG5hbWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgc2F2ZWRDbWRzLCBzdG9yYWdlO1xuICAgICAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlO1xuICAgICAgICByZXR1cm4gc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gICAgICB9KS50aGVuKChzYXZlZENtZHMpID0+IHtcbiAgICAgICAgdmFyIGNtZCwgY21kRGF0YTtcbiAgICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQobmFtZSk7XG4gICAgICAgIGlmICgoc2F2ZWRDbWRzW25hbWVdICE9IG51bGwpICYmIChjbWQgIT0gbnVsbCkpIHtcbiAgICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW25hbWVdO1xuICAgICAgICAgIGNtZC51bnJlZ2lzdGVyKCk7XG4gICAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tuYW1lXTtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5zYXZlKCdjbWRzJywgc2F2ZWRDbWRzKTtcbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuYWxpYXNDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGFsaWFzLCBjbWQsIG5hbWU7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIGFsaWFzID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdhbGlhcyddKTtcbiAgaWYgKChuYW1lICE9IG51bGwpICYmIChhbGlhcyAhPSBudWxsKSkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0Q21kKG5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kID0gY21kLmdldEFsaWFzZWQoKSB8fCBjbWQ7XG4gICAgICAvLyB1bmxlc3MgYWxpYXMuaW5kZXhPZignOicpID4gLTFcbiAgICAgIC8vIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7XG4gICAgICAgIGFsaWFzT2Y6IGNtZC5mdWxsTmFtZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiO1xuICAgIH1cbiAgfVxufTtcblxubGlzdENvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgYm94LCBjb21tYW5kcywgY29udGV4dCwgbmFtZSwgbmFtZXNwYWNlcywgdGV4dCwgdXNlQ29udGV4dDtcbiAgYm94ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnYm94J10sIHRydWUpO1xuICB1c2VDb250ZXh0ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnY29udGV4dCddLCB0cnVlKTtcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgbmFtZXNwYWNlcyA9IG5hbWUgPyBbbmFtZV0gOiBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKS5maWx0ZXIoKG5zcGMpID0+IHtcbiAgICByZXR1cm4gbnNwYyAhPT0gaW5zdGFuY2UuY21kLmZ1bGxOYW1lO1xuICB9KS5jb25jYXQoXCJfcm9vdFwiKTtcbiAgY29udGV4dCA9IHVzZUNvbnRleHQgPyBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpIDogaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQ7XG4gIGNvbW1hbmRzID0gbmFtZXNwYWNlcy5yZWR1Y2UoKGNvbW1hbmRzLCBuc3BjKSA9PiB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSBuc3BjID09PSBcIl9yb290XCIgPyBDb21tYW5kLmNtZHMgOiBjb250ZXh0LmdldENtZChuc3BjLCB7XG4gICAgICBtdXN0RXhlY3V0ZTogZmFsc2VcbiAgICB9KTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmNtZHMpIHtcbiAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5jb25jYXQoY21kLmNtZHMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29tbWFuZHM7XG4gIH0sIFtdKTtcbiAgdGV4dCA9IGNvbW1hbmRzLmxlbmd0aCA/IGNvbW1hbmRzLm1hcCgoY21kKSA9PiB7XG4gICAgY21kLmluaXQoKTtcbiAgICByZXR1cm4gKGNtZC5pc0V4ZWN1dGFibGUoKSA/ICd+fiEnIDogJ35+IWxzICcpICsgY21kLmZ1bGxOYW1lICsgJ35+JztcbiAgfSkuam9pbihcIlxcblwiKSA6IFwiVGhpcyBjb250YWlucyBubyBzdWItY29tbWFuZHNcIjtcbiAgaWYgKGJveCkge1xuICAgIHJldHVybiBgfn5ib3h+flxcbiR7dGV4dH1cXG5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGV4dDtcbiAgfVxufTtcblxuZ2V0Q29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXTtcbn07XG5cbnNldENvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgcCwgdmFsO1xuICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuICBpZiAodmFsICE9IG51bGwpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHZhbDtcbiAgfVxufTtcblxuZ2V0UGFyYW0gPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpZiAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuZ2V0UGFyYW0oaW5zdGFuY2UucGFyYW1zLCBpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsICdkZWZhdWx0J10pKTtcbiAgfVxufTtcblxuQm94Q21kID0gY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpO1xuICAgIHRoaXMuY21kID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ2NtZCddKTtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5oZWxwZXIub3BlblRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZCArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIHRoaXMuaGVscGVyLmNsb3NlVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWQuc3BsaXQoXCIgXCIpWzBdICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzO1xuICAgIH1cbiAgICB0aGlzLmhlbHBlci5kZWNvID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5kZWNvO1xuICAgIHRoaXMuaGVscGVyLnBhZCA9IDI7XG4gICAgdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpO1xuICB9XG5cbiAgaGVpZ2h0KCkge1xuICAgIHZhciBoZWlnaHQsIHBhcmFtcztcbiAgICBpZiAodGhpcy5ib3VuZHMoKSAhPSBudWxsKSB7XG4gICAgICBoZWlnaHQgPSB0aGlzLmJvdW5kcygpLmhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVpZ2h0ID0gMztcbiAgICB9XG4gICAgcGFyYW1zID0gWydoZWlnaHQnXTtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSkge1xuICAgICAgcGFyYW1zLnB1c2goMSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgICBwYXJhbXMucHVzaCgwKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCBoZWlnaHQpO1xuICB9XG5cbiAgd2lkdGgoKSB7XG4gICAgdmFyIHBhcmFtcywgd2lkdGg7XG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgd2lkdGggPSB0aGlzLmJvdW5kcygpLndpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aWR0aCA9IDM7XG4gICAgfVxuICAgIHBhcmFtcyA9IFsnd2lkdGgnXTtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSkge1xuICAgICAgcGFyYW1zLnB1c2goMCk7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1heCh0aGlzLm1pbldpZHRoKCksIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCB3aWR0aCkpO1xuICB9XG5cbiAgYm91bmRzKCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIGlmICh0aGlzLl9ib3VuZHMgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9ib3VuZHMgPSB0aGlzLmhlbHBlci50ZXh0Qm91bmRzKHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fYm91bmRzO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB0aGlzLmhlbHBlci5oZWlnaHQgPSB0aGlzLmhlaWdodCgpO1xuICAgIHRoaXMuaGVscGVyLndpZHRoID0gdGhpcy53aWR0aCgpO1xuICAgIHJldHVybiB0aGlzLmhlbHBlci5kcmF3KHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gIH1cblxuICBtaW5XaWR0aCgpIHtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY21kLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG5cbn07XG5cbkNsb3NlQ21kID0gY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgYm94LCBib3gyLCBkZXB0aCwgcHJlZml4LCByZXF1aXJlZF9hZmZpeGVzLCBzdWZmaXg7XG4gICAgcHJlZml4ID0gdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gICAgc3VmZml4ID0gdGhpcy5oZWxwZXIuc3VmZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG4gICAgYm94ID0gdGhpcy5oZWxwZXIuZ2V0Qm94Rm9yUG9zKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkpO1xuICAgIHJlcXVpcmVkX2FmZml4ZXMgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncmVxdWlyZWRfYWZmaXhlcyddLCB0cnVlKTtcbiAgICBpZiAoIXJlcXVpcmVkX2FmZml4ZXMpIHtcbiAgICAgIHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaGVscGVyLnN1ZmZpeCA9ICcnO1xuICAgICAgYm94MiA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKTtcbiAgICAgIGlmICgoYm94MiAhPSBudWxsKSAmJiAoKGJveCA9PSBudWxsKSB8fCBib3guc3RhcnQgPCBib3gyLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCB8fCBib3guZW5kID4gYm94Mi5lbmQgKyBzdWZmaXgubGVuZ3RoKSkge1xuICAgICAgICBib3ggPSBib3gyO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYm94ICE9IG51bGwpIHtcbiAgICAgIGRlcHRoID0gdGhpcy5oZWxwZXIuZ2V0TmVzdGVkTHZsKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkuc3RhcnQpO1xuICAgICAgaWYgKGRlcHRoIDwgMikge1xuICAgICAgICB0aGlzLmluc3RhbmNlLmluQm94ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KGJveC5zdGFydCwgYm94LmVuZCwgJycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UucmVwbGFjZVdpdGgoJycpO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kID0gY2xhc3MgRWRpdENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB2YXIgcmVmO1xuICAgIHRoaXMuY21kTmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG4gICAgdGhpcy52ZXJiYWxpemUgPSAocmVmID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMV0pKSA9PT0gJ3YnIHx8IHJlZiA9PT0gJ3ZlcmJhbGl6ZSc7XG4gICAgaWYgKHRoaXMuY21kTmFtZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmZpbmRlciA9IHRoaXMuaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRGaW5kZXIodGhpcy5jbWROYW1lKTtcbiAgICAgIHRoaXMuZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlO1xuICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVkaXRhYmxlID0gdGhpcy5jbWQgIT0gbnVsbCA/IHRoaXMuY21kLmlzRWRpdGFibGUoKSA6IHRydWU7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0V2l0aENvbnRlbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0V2l0aG91dENvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICByZXN1bHRXaXRoQ29udGVudCgpIHtcbiAgICB2YXIgZGF0YSwgaSwgbGVuLCBwLCBwYXJzZXIsIHJlZjtcbiAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgICBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICBkYXRhID0ge307XG4gICAgcmVmID0gRWRpdENtZC5wcm9wcztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHAgPSByZWZbaV07XG4gICAgICBwLndyaXRlRm9yKHBhcnNlciwgZGF0YSk7XG4gICAgfVxuICAgIENvbW1hbmQuc2F2ZUNtZCh0aGlzLmNtZE5hbWUsIGRhdGEpO1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHByb3BzRGlzcGxheSgpIHtcbiAgICB2YXIgY21kO1xuICAgIGNtZCA9IHRoaXMuY21kO1xuICAgIHJldHVybiBFZGl0Q21kLnByb3BzLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gcC5kaXNwbGF5KGNtZCk7XG4gICAgfSkuZmlsdGVyKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBwICE9IG51bGw7XG4gICAgfSkuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHJlc3VsdFdpdGhvdXRDb250ZW50KCkge1xuICAgIHZhciBuYW1lLCBwYXJzZXI7XG4gICAgaWYgKCF0aGlzLmNtZCB8fCB0aGlzLmVkaXRhYmxlKSB7XG4gICAgICBuYW1lID0gdGhpcy5jbWQgPyB0aGlzLmNtZC5mdWxsTmFtZSA6IHRoaXMuY21kTmFtZTtcbiAgICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChgfn5ib3ggY21kOlwiJHt0aGlzLmluc3RhbmNlLmNtZC5mdWxsTmFtZX0gJHtuYW1lfVwifn5cXG4ke3RoaXMucHJvcHNEaXNwbGF5KCl9XFxufn4hc2F2ZX5+IH5+IWNsb3Nlfn5cXG5+fi9ib3h+fmApO1xuICAgICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy52ZXJiYWxpemUpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5nZXRUZXh0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWQuc2V0Q21kcyA9IGZ1bmN0aW9uKGJhc2UpIHtcbiAgdmFyIGksIGluSW5zdGFuY2UsIGxlbiwgcCwgcmVmO1xuICBpbkluc3RhbmNlID0gYmFzZS5pbl9pbnN0YW5jZSA9IHtcbiAgICBjbWRzOiB7fVxuICB9O1xuICByZWYgPSBFZGl0Q21kLnByb3BzO1xuICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBwID0gcmVmW2ldO1xuICAgIHAuc2V0Q21kKGluSW5zdGFuY2UuY21kcyk7XG4gIH1cbiAgLy8gcC5zZXRDbWQoYmFzZSlcbiAgcmV0dXJuIGJhc2U7XG59O1xuXG5FZGl0Q21kLnByb3BzID0gW1xuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fY2FycmV0JyxcbiAge1xuICAgIG9wdDogJ2NoZWNrQ2FycmV0J1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJyxcbiAge1xuICAgIG9wdDogJ3BhcnNlJ1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3ByZXZlbnRfcGFyc2VfYWxsJyxcbiAge1xuICAgIG9wdDogJ3ByZXZlbnRQYXJzZUFsbCdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCdyZXBsYWNlX2JveCcsXG4gIHtcbiAgICBvcHQ6ICdyZXBsYWNlQm94J1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnbmFtZV90b19wYXJhbScsXG4gIHtcbiAgICBvcHQ6ICduYW1lVG9QYXJhbSdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoJ2FsaWFzX29mJyxcbiAge1xuICAgIHZhcjogJ2FsaWFzT2YnLFxuICAgIGNhcnJldDogdHJ1ZVxuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnaGVscCcsXG4gIHtcbiAgICBmdW5jdDogJ2hlbHAnLFxuICAgIHNob3dFbXB0eTogdHJ1ZVxuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnc291cmNlJyxcbiAge1xuICAgIHZhcjogJ3Jlc3VsdFN0cicsXG4gICAgZGF0YU5hbWU6ICdyZXN1bHQnLFxuICAgIHNob3dFbXB0eTogdHJ1ZSxcbiAgICBjYXJyZXQ6IHRydWVcbiAgfSlcbl07XG5cbk5hbWVTcGFjZUNtZCA9IGNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMF0pO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBpLCBsZW4sIG5hbWVzcGFjZXMsIG5zcGMsIHBhcnNlciwgdHh0O1xuICAgIGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5uYW1lKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZXNwYWNlcyA9IHRoaXMuaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCk7XG4gICAgICB0eHQgPSAnfn5ib3h+flxcbic7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lc3BhY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIG5zcGMgPSBuYW1lc3BhY2VzW2ldO1xuICAgICAgICBpZiAobnNwYyAhPT0gdGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWUpIHtcbiAgICAgICAgICB0eHQgKz0gbnNwYyArICdcXG4nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0eHQgKz0gJ35+IWNsb3NlfH5+XFxufn4vYm94fn4nO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dCk7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgfVxuICB9XG5cbn07XG5cbkVtbWV0Q21kID0gY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5hYmJyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2FiYnInLCAnYWJicmV2aWF0aW9uJ10pO1xuICAgIHJldHVybiB0aGlzLmxhbmcgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxLCAnbGFuZycsICdsYW5ndWFnZSddKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgZW1tZXQsIGV4LCByZXM7XG4gICAgZW1tZXQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IHdpbmRvdy5lbW1ldCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmID0gd2luZG93LnNlbGYpICE9IG51bGwgPyByZWYuZW1tZXQgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZWxmLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmMSA9IHdpbmRvdy5nbG9iYWwpICE9IG51bGwgPyByZWYxLmVtbWV0IDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2xvYmFsLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiByZXF1aXJlICE9PSBudWxsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJ2VtbWV0Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmxvZ2dlci5sb2coJ0VtbWV0IGlzIG5vdCBhdmFpbGFibGUsIGl0IG1heSBuZWVkIHRvIGJlIGluc3RhbGxlZCBtYW51YWxseScpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkuY2FsbCh0aGlzKTtcbiAgICBpZiAoZW1tZXQgIT0gbnVsbCkge1xuICAgICAgLy8gZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKHRoaXMuYWJiciwgdGhpcy5sYW5nKTtcbiAgICAgIHJldHVybiByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBIdG1sQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBodG1sID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2h0bWwnKSlcbiAgaHRtbC5hZGRDbWRzKHtcbiAgICAnZmFsbGJhY2snOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOmVtbWV0JyxcbiAgICAgICdkZWZhdWx0cycgOiB7J2xhbmcnOidodG1sJ30sXG4gICAgICAnbmFtZVRvUGFyYW0nIDogJ2FiYnInXG4gICAgfSxcbiAgfSlcbiAgXG4gIGNzcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjc3MnKSlcbiAgY3NzLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6ZW1tZXQnLFxuICAgICAgJ2RlZmF1bHRzJyA6IHsnbGFuZyc6J2Nzcyd9LFxuICAgICAgJ25hbWVUb1BhcmFtJyA6ICdhYmJyJ1xuICAgIH0sXG4gIH0pXG5cbiIsImltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgSHRtbENvbW1hbmRQcm92aWRlciA9IGNsYXNzIEh0bWxDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNzcywgaHRtbDtcbiAgICBodG1sID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2h0bWwnKSk7XG4gICAgaHRtbC5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplbW1ldCcsXG4gICAgICAgICdkZWZhdWx0cyc6IHtcbiAgICAgICAgICAnbGFuZyc6ICdodG1sJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjc3MgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY3NzJykpO1xuICAgIHJldHVybiBjc3MuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICAnZGVmYXVsdHMnOiB7XG4gICAgICAgICAgJ2xhbmcnOiAnY3NzJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBKc0NvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAganMgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnanMnKSlcbiAgY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2phdmFzY3JpcHQnLHsgYWxpYXNPZjogJ2pzJyB9KSlcbiAganMuYWRkQ21kcyh7XG4gICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICdpZic6ICAnaWYofCl7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnbG9nJzogICdpZih3aW5kb3cuY29uc29sZSl7XFxuXFx0Y29uc29sZS5sb2cofn5jb250ZW50fn58KVxcbn0nLFxuICAgICdmdW5jdGlvbic6XHQnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdmdW5jdCc6eyBhbGlhc09mOiAnanM6ZnVuY3Rpb24nIH0sXG4gICAgJ2YnOnsgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbicgfSxcbiAgICAnZm9yJzogXHRcdCdmb3IgKHZhciBpID0gMDsgaSA8IHw7IGkrKykge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2ZvcmluJzonZm9yICh2YXIgdmFsIGluIHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdlYWNoJzp7ICBhbGlhc09mOiAnanM6Zm9yaW4nIH0sXG4gICAgJ2ZvcmVhY2gnOnsgIGFsaWFzT2Y6ICdqczpmb3JpbicgfSxcbiAgICAnd2hpbGUnOiAgJ3doaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICd3aGlsZWknOiAndmFyIGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcblxcdGkrKztcXG59JyxcbiAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+Y29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAnaWZlJzp7ICAgYWxpYXNPZjogJ2pzOmlmZWxzZScgfSxcbiAgICAnc3dpdGNoJzpcdFwiXCJcIlxuICAgICAgc3dpdGNoKCB8ICkgeyBcbiAgICAgIFxcdGNhc2UgOlxuICAgICAgXFx0XFx0fn5jb250ZW50fn5cbiAgICAgIFxcdFxcdGJyZWFrO1xuICAgICAgXFx0ZGVmYXVsdCA6XG4gICAgICBcXHRcXHRcbiAgICAgIFxcdFxcdGJyZWFrO1xuICAgICAgfVxuICAgICAgXCJcIlwiLFxuICB9KVxuIiwiaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBKc0NvbW1hbmRQcm92aWRlciA9IGNsYXNzIEpzQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBqcztcbiAgICBqcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqcycpKTtcbiAgICBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnamF2YXNjcmlwdCcsIHtcbiAgICAgIGFsaWFzT2Y6ICdqcydcbiAgICB9KSk7XG4gICAgcmV0dXJuIGpzLmFkZENtZHMoe1xuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgJ2lmJzogJ2lmKHwpe1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnbG9nJzogJ2lmKHdpbmRvdy5jb25zb2xlKXtcXG5cXHRjb25zb2xlLmxvZyh+fmNvbnRlbnR+fnwpXFxufScsXG4gICAgICAnZnVuY3Rpb24nOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2YnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZm9yJzogJ2ZvciAodmFyIGkgPSAwOyBpIDwgfDsgaSsrKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdmb3Jpbic6ICdmb3IgKHZhciB2YWwgaW4gfCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgICdmb3JlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgJ3doaWxlJzogJ3doaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ3doaWxlaSc6ICd2YXIgaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxuXFx0aSsrO1xcbn0nLFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgICAnaWZlJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6aWZlbHNlJ1xuICAgICAgfSxcbiAgICAgICdzd2l0Y2gnOiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5jb250ZW50fn5cXG5cXHRcXHRicmVhaztcXG5cXHRkZWZhdWx0IDpcXG5cXHRcXHRcXG5cXHRcXHRicmVhaztcXG59XCJcbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5pbXBvcnQgeyBQYWlyRGV0ZWN0b3IgfSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCBjbGFzcyBQaHBDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIHBocCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdwaHAnKSlcbiAgcGhwLmFkZERldGVjdG9yKG5ldyBQYWlyRGV0ZWN0b3Ioe1xuICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgb3BlbmVyOiAnPD9waHAnLFxuICAgIGNsb3NlcjogJz8+JyxcbiAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICdlbHNlJzogJ3BocDpvdXRlcidcbiAgfSkpIFxuXG4gIHBocE91dGVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnb3V0ZXInKSlcbiAgcGhwT3V0ZXIuYWRkQ21kcyh7XG4gICAgJ2ZhbGxiYWNrJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdhbnlfY29udGVudCc6IHsgXG4gICAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcgXG4gICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbidcbiAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICdcbiAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBhbGlhc09mOiAncGhwOmlubmVyOiVuYW1lJScsXG4gICAgICBhbHRlclJlc3VsdDogd3JhcFdpdGhQaHBcbiAgICB9LFxuICAgICdib3gnOiB7IFxuICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyBcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHByZWZpeDogJzw/cGhwXFxuJ1xuICAgICAgICBzdWZmaXg6ICdcXG4/PidcbiAgICAgIH1cbiAgICB9LFxuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+JyxcbiAgfSlcbiAgXG4gIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSlcbiAgcGhwSW5uZXIuYWRkQ21kcyh7XG4gICAgJ2FueV9jb250ZW50JzogeyBhbGlhc09mOiAnY29yZTpjb250ZW50JyB9LFxuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAnaWYnOiAgICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnaW5mbyc6ICdwaHBpbmZvKCk7JyxcbiAgICAnZWNobyc6ICdlY2hvIHwnLFxuICAgICdlJzp7ICAgYWxpYXNPZjogJ3BocDppbm5lcjplY2hvJyB9LFxuICAgICdjbGFzcyc6e1xuICAgICAgcmVzdWx0IDogXCJcIlwiXG4gICAgICAgIGNsYXNzIH5+cGFyYW0gMCBjbGFzcyBkZWY6fH5+IHtcbiAgICAgICAgXFx0ZnVuY3Rpb24gX19jb25zdHJ1Y3QoKSB7XG4gICAgICAgIFxcdFxcdH5+Y29udGVudH5+fFxuICAgICAgICBcXHR9XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiLFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2MnOnsgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnIH0sXG4gICAgJ2Z1bmN0aW9uJzpcdHtcbiAgICAgIHJlc3VsdCA6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufSdcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdmdW5jdCc6eyBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJyB9LFxuICAgICdmJzp7ICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJyB9LFxuICAgICdhcnJheSc6ICAnJHwgPSBhcnJheSgpOycsXG4gICAgJ2EnOlx0ICAgICdhcnJheSgpJyxcbiAgICAnZm9yJzogXHRcdCdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICdmb3JlYWNoJzonZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ2VhY2gnOnsgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Zm9yZWFjaCcgfSxcbiAgICAnd2hpbGUnOiAgJ3doaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnd2hpbGVpJzoge1xuICAgICAgcmVzdWx0IDogJyRpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxuXFx0JGkrKztcXG59JyxcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAnaWZlJzp7ICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnIH0sXG4gICAgJ3N3aXRjaCc6XHR7XG4gICAgICByZXN1bHQgOiBcIlwiXCJcbiAgICAgICAgc3dpdGNoKCB8ICkgeyBcbiAgICAgICAgXFx0Y2FzZSA6XG4gICAgICAgIFxcdFxcdH5+YW55X2NvbnRlbnR+flxuICAgICAgICBcXHRcXHRicmVhaztcbiAgICAgICAgXFx0ZGVmYXVsdCA6XG4gICAgICAgIFxcdFxcdFxuICAgICAgICBcXHRcXHRicmVhaztcbiAgICAgICAgfVxuICAgICAgICBcIlwiXCIsXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgICdjbG9zZSc6IHsgXG4gICAgICBhbGlhc09mOiAnY29yZTpjbG9zZScgXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBwcmVmaXg6ICc8P3BocFxcbidcbiAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIHJlcXVpcmVkX2FmZml4ZXM6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgfSlcbiAgXG5cbndyYXBXaXRoUGhwID0gKHJlc3VsdCxpbnN0YW5jZSkgLT5cbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywnaW5saW5lJ10sdHJ1ZSlcbiAgaWYgaW5saW5lXG4gICAgcmVnT3BlbiA9IC88XFw/cGhwXFxzKFtcXFxcblxcXFxyXFxzXSspL2dcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZ1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/PidcbiAgZWxzZVxuICAgICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nXG5cbiMgY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuIyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICciLCJ2YXIgd3JhcFdpdGhQaHA7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIFBhaXJEZXRlY3RvclxufSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCB2YXIgUGhwQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBwaHAsIHBocElubmVyLCBwaHBPdXRlcjtcbiAgICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpO1xuICAgIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgICBvcGVuZXI6ICc8P3BocCcsXG4gICAgICBjbG9zZXI6ICc/PicsXG4gICAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICAgJ2Vsc2UnOiAncGhwOm91dGVyJ1xuICAgIH0pKTtcbiAgICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpO1xuICAgIHBocE91dGVyLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnYW55X2NvbnRlbnQnOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50JyxcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbicsXG4gICAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICcsXG4gICAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6JW5hbWUlJyxcbiAgICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgICB9LFxuICAgICAgJ2JveCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+J1xuICAgIH0pO1xuICAgIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSk7XG4gICAgcmV0dXJuIHBocElubmVyLmFkZENtZHMoe1xuICAgICAgJ2FueV9jb250ZW50Jzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50J1xuICAgICAgfSxcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgICdpZic6ICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdpbmZvJzogJ3BocGluZm8oKTsnLFxuICAgICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAgICdlJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmVjaG8nXG4gICAgICB9LFxuICAgICAgJ2NsYXNzJzoge1xuICAgICAgICByZXN1bHQ6IFwiY2xhc3Mgfn5wYXJhbSAwIGNsYXNzIGRlZjp8fn4ge1xcblxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xcblxcdFxcdH5+Y29udGVudH5+fFxcblxcdH1cXG59XCIsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2MnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnXG4gICAgICB9LFxuICAgICAgJ2Z1bmN0aW9uJzoge1xuICAgICAgICByZXN1bHQ6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdhcnJheSc6ICckfCA9IGFycmF5KCk7JyxcbiAgICAgICdhJzogJ2FycmF5KCknLFxuICAgICAgJ2Zvcic6ICdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2ZvcmVhY2gnOiAnZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmb3JlYWNoJ1xuICAgICAgfSxcbiAgICAgICd3aGlsZSc6ICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnd2hpbGVpJzoge1xuICAgICAgICByZXN1bHQ6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgJ2lmZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnXG4gICAgICB9LFxuICAgICAgJ3N3aXRjaCc6IHtcbiAgICAgICAgcmVzdWx0OiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5hbnlfY29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufVwiLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PicsXG4gICAgICAgICAgcmVxdWlyZWRfYWZmaXhlczogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbndyYXBXaXRoUGhwID0gZnVuY3Rpb24ocmVzdWx0LCBpbnN0YW5jZSkge1xuICB2YXIgaW5saW5lLCByZWdDbG9zZSwgcmVnT3BlbjtcbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywgJ2lubGluZSddLCB0cnVlKTtcbiAgaWYgKGlubGluZSkge1xuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nO1xuICAgIHJlZ0Nsb3NlID0gLyhbXFxuXFxyXFxzXSspXFxzXFw/Pi9nO1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/Pic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nO1xuICB9XG59O1xuXG4vLyBjbG9zZVBocEZvckNvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4vLyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICdcbiIsImltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9ib290c3RyYXAnO1xuaW1wb3J0IHsgVGV4dEFyZWFFZGl0b3IgfSBmcm9tICcuL1RleHRBcmVhRWRpdG9yJztcblxuQ29kZXdhdmUuZGV0ZWN0ID0gKHRhcmdldCkgLT5cbiAgY3cgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRBcmVhRWRpdG9yKHRhcmdldCkpXG4gIENvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KVxuICBjd1xuXG5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZVxuXG53aW5kb3cuQ29kZXdhdmUgPSBDb2Rld2F2ZVxuXG4gICIsImltcG9ydCB7XG4gIENvZGV3YXZlXG59IGZyb20gJy4vYm9vdHN0cmFwJztcblxuaW1wb3J0IHtcbiAgVGV4dEFyZWFFZGl0b3Jcbn0gZnJvbSAnLi9UZXh0QXJlYUVkaXRvcic7XG5cbkNvZGV3YXZlLmRldGVjdCA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICB2YXIgY3c7XG4gIGN3ID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvcih0YXJnZXQpKTtcbiAgQ29kZXdhdmUuaW5zdGFuY2VzLnB1c2goY3cpO1xuICByZXR1cm4gY3c7XG59O1xuXG5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZTtcblxud2luZG93LkNvZGV3YXZlID0gQ29kZXdhdmU7XG4iLCJleHBvcnQgY2xhc3MgQXJyYXlIZWxwZXJcbiAgQGlzQXJyYXk6IChhcnIpIC0+XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggYXJyICkgPT0gJ1tvYmplY3QgQXJyYXldJ1xuICBcbiAgQHVuaW9uOiAoYTEsYTIpIC0+XG4gICAgQHVuaXF1ZShhMS5jb25jYXQoYTIpKVxuICAgIFxuICBAdW5pcXVlOiAoYXJyYXkpIC0+XG4gICAgYSA9IGFycmF5LmNvbmNhdCgpXG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgYS5sZW5ndGhcbiAgICAgIGogPSBpICsgMVxuICAgICAgd2hpbGUgaiA8IGEubGVuZ3RoXG4gICAgICAgIGlmIGFbaV0gPT0gYVtqXVxuICAgICAgICAgIGEuc3BsaWNlKGotLSwgMSlcbiAgICAgICAgKytqXG4gICAgICArK2lcbiAgICBhIiwiZXhwb3J0IHZhciBBcnJheUhlbHBlciA9IGNsYXNzIEFycmF5SGVscGVyIHtcbiAgc3RhdGljIGlzQXJyYXkoYXJyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9XG5cbiAgc3RhdGljIHVuaW9uKGExLCBhMikge1xuICAgIHJldHVybiB0aGlzLnVuaXF1ZShhMS5jb25jYXQoYTIpKTtcbiAgfVxuXG4gIHN0YXRpYyB1bmlxdWUoYXJyYXkpIHtcbiAgICB2YXIgYSwgaSwgajtcbiAgICBhID0gYXJyYXkuY29uY2F0KCk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBhLmxlbmd0aCkge1xuICAgICAgaiA9IGkgKyAxO1xuICAgICAgd2hpbGUgKGogPCBhLmxlbmd0aCkge1xuICAgICAgICBpZiAoYVtpXSA9PT0gYVtqXSkge1xuICAgICAgICAgIGEuc3BsaWNlKGotLSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgKytqO1xuICAgICAgfVxuICAgICAgKytpO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIENvbW1vbkhlbHBlclxuXG4gIEBtZXJnZTogKHhzLi4uKSAtPlxuICAgIGlmIHhzPy5sZW5ndGggPiAwXG4gICAgICBAdGFwIHt9LCAobSkgLT4gbVtrXSA9IHYgZm9yIGssIHYgb2YgeCBmb3IgeCBpbiB4c1xuIFxuICBAdGFwOiAobywgZm4pIC0+IFxuICAgIGZuKG8pXG4gICAgb1xuXG4gIEBhcHBseU1peGluczogKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIC0+IFxuICAgIGJhc2VDdG9ycy5mb3JFYWNoIChiYXNlQ3RvcikgPT4gXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpLmZvckVhY2ggKG5hbWUpPT4gXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLCBuYW1lLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2VDdG9yLnByb3RvdHlwZSwgbmFtZSkpIiwiZXhwb3J0IHZhciBDb21tb25IZWxwZXIgPSBjbGFzcyBDb21tb25IZWxwZXIge1xuICBzdGF0aWMgbWVyZ2UoLi4ueHMpIHtcbiAgICBpZiAoKHhzICE9IG51bGwgPyB4cy5sZW5ndGggOiB2b2lkIDApID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFwKHt9LCBmdW5jdGlvbihtKSB7XG4gICAgICAgIHZhciBpLCBrLCBsZW4sIHJlc3VsdHMsIHYsIHg7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0geHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB4ID0geHNbaV07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzMTtcbiAgICAgICAgICAgIHJlc3VsdHMxID0gW107XG4gICAgICAgICAgICBmb3IgKGsgaW4geCkge1xuICAgICAgICAgICAgICB2ID0geFtrXTtcbiAgICAgICAgICAgICAgcmVzdWx0czEucHVzaChtW2tdID0gdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0czE7XG4gICAgICAgICAgfSkoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdGFwKG8sIGZuKSB7XG4gICAgZm4obyk7XG4gICAgcmV0dXJuIG87XG4gIH1cblxuICBzdGF0aWMgYXBwbHlNaXhpbnMoZGVyaXZlZEN0b3IsIGJhc2VDdG9ycykge1xuICAgIHJldHVybiBiYXNlQ3RvcnMuZm9yRWFjaCgoYmFzZUN0b3IpID0+IHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbn07XG4iLCJcbmV4cG9ydCBjbGFzcyBOYW1lc3BhY2VIZWxwZXJcblxuICBAc3BsaXRGaXJzdDogKGZ1bGxuYW1lLGlzU3BhY2UgPSBmYWxzZSkgLT5cbiAgICBpZiBmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PSAtMSBhbmQgIWlzU3BhY2VcbiAgICAgIHJldHVybiBbbnVsbCxmdWxsbmFtZV1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6JylcbiAgICByZXR1cm4gW3BhcnRzLnNoaWZ0KCkscGFydHMuam9pbignOicpIHx8IG51bGxdXG5cbiAgQHNwbGl0OiAoZnVsbG5hbWUpIC0+XG4gICAgaWYgZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT0gLTFcbiAgICAgIHJldHVybiBbbnVsbCxmdWxsbmFtZV1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6JylcbiAgICBuYW1lID0gcGFydHMucG9wKClcbiAgICBbcGFydHMuam9pbignOicpLG5hbWVdIiwiZXhwb3J0IHZhciBOYW1lc3BhY2VIZWxwZXIgPSBjbGFzcyBOYW1lc3BhY2VIZWxwZXIge1xuICBzdGF0aWMgc3BsaXRGaXJzdChmdWxsbmFtZSwgaXNTcGFjZSA9IGZhbHNlKSB7XG4gICAgdmFyIHBhcnRzO1xuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PT0gLTEgJiYgIWlzU3BhY2UpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdO1xuICAgIH1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6Jyk7XG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLCBwYXJ0cy5qb2luKCc6JykgfHwgbnVsbF07XG4gIH1cblxuICBzdGF0aWMgc3BsaXQoZnVsbG5hbWUpIHtcbiAgICB2YXIgbmFtZSwgcGFydHM7XG4gICAgaWYgKGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09PSAtMSkge1xuICAgICAgcmV0dXJuIFtudWxsLCBmdWxsbmFtZV07XG4gICAgfVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKTtcbiAgICBuYW1lID0gcGFydHMucG9wKCk7XG4gICAgcmV0dXJuIFtwYXJ0cy5qb2luKCc6JyksIG5hbWVdO1xuICB9XG5cbn07XG4iLCJcbmV4cG9ydCBjbGFzcyBPcHRpb25hbFByb21pc2VcbiAgICBjb25zdHJ1Y3RvcjogKEB2YWwpIC0+XG4gICAgICAgIGlmIEB2YWw/IGFuZCBAdmFsLnRoZW4/IGFuZCBAdmFsLnJlc3VsdD9cbiAgICAgICAgICAgIEB2YWwgPSBAdmFsLnJlc3VsdCgpXG4gICAgdGhlbjogKGNiKSAtPlxuICAgICAgICBpZiBAdmFsPyBhbmQgQHZhbC50aGVuP1xuICAgICAgICAgICAgbmV3IE9wdGlvbmFsUHJvbWlzZShAdmFsLnRoZW4oY2IpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXcgT3B0aW9uYWxQcm9taXNlKGNiKEB2YWwpKVxuICAgIHJlc3VsdDogLT5cbiAgICAgICAgQHZhbFxuXG5leHBvcnQgb3B0aW9uYWxQcm9taXNlID0gKHZhbCktPiBcbiAgICBuZXcgT3B0aW9uYWxQcm9taXNlKHZhbClcblxuXG4iLCJleHBvcnQgdmFyIE9wdGlvbmFsUHJvbWlzZSA9IGNsYXNzIE9wdGlvbmFsUHJvbWlzZSB7XG4gIGNvbnN0cnVjdG9yKHZhbDEpIHtcbiAgICB0aGlzLnZhbCA9IHZhbDE7XG4gICAgaWYgKCh0aGlzLnZhbCAhPSBudWxsKSAmJiAodGhpcy52YWwudGhlbiAhPSBudWxsKSAmJiAodGhpcy52YWwucmVzdWx0ICE9IG51bGwpKSB7XG4gICAgICB0aGlzLnZhbCA9IHRoaXMudmFsLnJlc3VsdCgpO1xuICAgIH1cbiAgfVxuXG4gIHRoZW4oY2IpIHtcbiAgICBpZiAoKHRoaXMudmFsICE9IG51bGwpICYmICh0aGlzLnZhbC50aGVuICE9IG51bGwpKSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh0aGlzLnZhbC50aGVuKGNiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKGNiKHRoaXMudmFsKSk7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHJldHVybiB0aGlzLnZhbDtcbiAgfVxuXG59O1xuXG5leHBvcnQgdmFyIG9wdGlvbmFsUHJvbWlzZSA9IGZ1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh2YWwpO1xufTtcbiIsImltcG9ydCB7IFNpemUgfSBmcm9tICcuLi9wb3NpdGlvbmluZy9TaXplJztcblxuZXhwb3J0IGNsYXNzIFN0cmluZ0hlbHBlclxuICBAdHJpbUVtcHR5TGluZTogKHR4dCkgLT5cbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJylcblxuICBAZXNjYXBlUmVnRXhwOiAoc3RyKSAtPlxuICAgIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIilcblxuICBAcmVwZWF0VG9MZW5ndGg6ICh0eHQsIGxlbmd0aCkgLT5cbiAgICByZXR1cm4gJycgaWYgbGVuZ3RoIDw9IDBcbiAgICBBcnJheShNYXRoLmNlaWwobGVuZ3RoL3R4dC5sZW5ndGgpKzEpLmpvaW4odHh0KS5zdWJzdHJpbmcoMCxsZW5ndGgpXG4gICAgXG4gIEByZXBlYXQ6ICh0eHQsIG5iKSAtPlxuICAgIEFycmF5KG5iKzEpLmpvaW4odHh0KVxuICAgIFxuICBAZ2V0VHh0U2l6ZTogKHR4dCkgLT5cbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywnJykuc3BsaXQoXCJcXG5cIilcbiAgICB3ID0gMFxuICAgIGZvciBsIGluIGxpbmVzXG4gICAgICB3ID0gTWF0aC5tYXgodyxsLmxlbmd0aClcbiAgICByZXR1cm4gbmV3IFNpemUodyxsaW5lcy5sZW5ndGgtMSlcblxuICBAaW5kZW50Tm90Rmlyc3Q6ICh0ZXh0LG5iPTEsc3BhY2VzPScgICcpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJlZyA9IC9cXG4vZ1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXFxuXCIgKyBAcmVwZWF0KHNwYWNlcywgbmIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgICBcbiAgQGluZGVudDogKHRleHQsbmI9MSxzcGFjZXM9JyAgJykgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmV0dXJuIHNwYWNlcyArIEBpbmRlbnROb3RGaXJzdCh0ZXh0LG5iLHNwYWNlcylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBcbiAgQHJldmVyc2VTdHI6ICh0eHQpIC0+XG4gICAgcmV0dXJuIHR4dC5zcGxpdChcIlwiKS5yZXZlcnNlKCkuam9pbihcIlwiKVxuICBcbiAgXG4gIEByZW1vdmVDYXJyZXQ6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSdcbiAgICByZUNhcnJldCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhcitjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgcmVUbXAgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAodG1wKSwgXCJnXCIpXG4gICAgdHh0LnJlcGxhY2UocmVRdW90ZWQsdG1wKS5yZXBsYWNlKHJlQ2FycmV0LCcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKVxuICAgIFxuICBAZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQ6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgcG9zID0gQGdldENhcnJldFBvcyh0eHQsY2FycmV0Q2hhcilcbiAgICBpZiBwb3M/XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAscG9zKSArIHR4dC5zdWJzdHIocG9zK2NhcnJldENoYXIubGVuZ3RoKVxuICAgICAgcmV0dXJuIFtwb3MsdHh0XVxuICAgICAgXG4gIEBnZXRDYXJyZXRQb3M6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhcitjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgdHh0ID0gdHh0LnJlcGxhY2UocmVRdW90ZWQsICcgJylcbiAgICBpZiAoaSA9IHR4dC5pbmRleE9mKGNhcnJldENoYXIpKSA+IC0xXG4gICAgICByZXR1cm4gaSIsImltcG9ydCB7XG4gIFNpemVcbn0gZnJvbSAnLi4vcG9zaXRpb25pbmcvU2l6ZSc7XG5cbmV4cG9ydCB2YXIgU3RyaW5nSGVscGVyID0gY2xhc3MgU3RyaW5nSGVscGVyIHtcbiAgc3RhdGljIHRyaW1FbXB0eUxpbmUodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKC9eXFxzKlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyP1xcblxccyokLywgJycpO1xuICB9XG5cbiAgc3RhdGljIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXRUb0xlbmd0aCh0eHQsIGxlbmd0aCkge1xuICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkoTWF0aC5jZWlsKGxlbmd0aCAvIHR4dC5sZW5ndGgpICsgMSkuam9pbih0eHQpLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuICB9XG5cbiAgc3RhdGljIHJlcGVhdCh0eHQsIG5iKSB7XG4gICAgcmV0dXJuIEFycmF5KG5iICsgMSkuam9pbih0eHQpO1xuICB9XG5cbiAgc3RhdGljIGdldFR4dFNpemUodHh0KSB7XG4gICAgdmFyIGosIGwsIGxlbiwgbGluZXMsIHc7XG4gICAgbGluZXMgPSB0eHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKTtcbiAgICB3ID0gMDtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbCA9IGxpbmVzW2pdO1xuICAgICAgdyA9IE1hdGgubWF4KHcsIGwubGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTaXplKHcsIGxpbmVzLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgc3RhdGljIGluZGVudE5vdEZpcnN0KHRleHQsIG5iID0gMSwgc3BhY2VzID0gJyAgJykge1xuICAgIHZhciByZWc7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gL1xcbi9nO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXFxuXCIgKyB0aGlzLnJlcGVhdChzcGFjZXMsIG5iKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnQodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNwYWNlcyArIHRoaXMuaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIsIHNwYWNlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZXZlcnNlU3RyKHR4dCkge1xuICAgIHJldHVybiB0eHQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIik7XG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlQ2FycmV0KHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciByZUNhcnJldCwgcmVRdW90ZWQsIHJlVG1wLCB0bXA7XG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSc7XG4gICAgcmVDYXJyZXQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHJlVG1wID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cCh0bXApLCBcImdcIik7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKHJlUXVvdGVkLCB0bXApLnJlcGxhY2UocmVDYXJyZXQsICcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcG9zO1xuICAgIHBvcyA9IHRoaXMuZ2V0Q2FycmV0UG9zKHR4dCwgY2FycmV0Q2hhcik7XG4gICAgaWYgKHBvcyAhPSBudWxsKSB7XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAsIHBvcykgKyB0eHQuc3Vic3RyKHBvcyArIGNhcnJldENoYXIubGVuZ3RoKTtcbiAgICAgIHJldHVybiBbcG9zLCB0eHRdO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXRDYXJyZXRQb3ModHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIGksIHJlUXVvdGVkO1xuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKTtcbiAgICBpZiAoKGkgPSB0eHQuaW5kZXhPZihjYXJyZXRDaGFyKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IFBhaXJNYXRjaCB9IGZyb20gJy4vUGFpck1hdGNoJztcblxuZXhwb3J0IGNsYXNzIFBhaXJcbiAgY29uc3RydWN0b3I6IChAb3BlbmVyLEBjbG9zZXIsQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IGZhbHNlXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIEBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IEBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gIG9wZW5lclJlZzogLT5cbiAgICBpZiB0eXBlb2YgQG9wZW5lciA9PSAnc3RyaW5nJyBcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQG9wZW5lcikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBvcGVuZXJcbiAgY2xvc2VyUmVnOiAtPlxuICAgIGlmIHR5cGVvZiBAY2xvc2VyID09ICdzdHJpbmcnIFxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY2xvc2VyKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQGNsb3NlclxuICBtYXRjaEFueVBhcnRzOiAtPlxuICAgIHJldHVybiB7XG4gICAgICBvcGVuZXI6IEBvcGVuZXJSZWcoKVxuICAgICAgY2xvc2VyOiBAY2xvc2VyUmVnKClcbiAgICB9XG4gIG1hdGNoQW55UGFydEtleXM6IC0+XG4gICAga2V5cyA9IFtdXG4gICAgZm9yIGtleSwgcmVnIG9mIEBtYXRjaEFueVBhcnRzKClcbiAgICAgIGtleXMucHVzaChrZXkpXG4gICAgcmV0dXJuIGtleXNcbiAgbWF0Y2hBbnlSZWc6IC0+XG4gICAgZ3JvdXBzID0gW11cbiAgICBmb3Iga2V5LCByZWcgb2YgQG1hdGNoQW55UGFydHMoKVxuICAgICAgZ3JvdXBzLnB1c2goJygnK3JlZy5zb3VyY2UrJyknKVxuICAgIHJldHVybiBuZXcgUmVnRXhwKGdyb3Vwcy5qb2luKCd8JykpXG4gIG1hdGNoQW55OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICB3aGlsZSAobWF0Y2ggPSBAX21hdGNoQW55KHRleHQsb2Zmc2V0KSk/IGFuZCAhbWF0Y2gudmFsaWQoKVxuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKClcbiAgICByZXR1cm4gbWF0Y2ggaWYgbWF0Y2g/IGFuZCBtYXRjaC52YWxpZCgpXG4gIF9tYXRjaEFueTogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgaWYgb2Zmc2V0XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KVxuICAgIG1hdGNoID0gQG1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KVxuICAgIGlmIG1hdGNoP1xuICAgICAgcmV0dXJuIG5ldyBQYWlyTWF0Y2godGhpcyxtYXRjaCxvZmZzZXQpXG4gIG1hdGNoQW55TmFtZWQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAX21hdGNoQW55R2V0TmFtZShAbWF0Y2hBbnkodGV4dCkpXG4gIG1hdGNoQW55TGFzdDogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgd2hpbGUgbWF0Y2ggPSBAbWF0Y2hBbnkodGV4dCxvZmZzZXQpXG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgICAgaWYgIXJlcyBvciByZXMuZW5kKCkgIT0gbWF0Y2guZW5kKClcbiAgICAgICAgcmVzID0gbWF0Y2hcbiAgICByZXR1cm4gcmVzXG4gIGlkZW50aWNhbDogLT5cbiAgICBAb3BlbmVyID09IEBjbG9zZXIgb3IgKFxuICAgICAgQG9wZW5lci5zb3VyY2U/IGFuZCBcbiAgICAgIEBjbG9zZXIuc291cmNlPyBhbmQgXG4gICAgICBAb3BlbmVyLnNvdXJjZSA9PSBAY2xvc2VyLnNvdXJjZVxuICAgIClcbiAgd3JhcHBlclBvczogKHBvcyx0ZXh0KSAtPlxuICAgIHN0YXJ0ID0gQG1hdGNoQW55TGFzdCh0ZXh0LnN1YnN0cigwLHBvcy5zdGFydCkpXG4gICAgaWYgc3RhcnQ/IGFuZCAoQGlkZW50aWNhbCgpIG9yIHN0YXJ0Lm5hbWUoKSA9PSAnb3BlbmVyJylcbiAgICAgIGVuZCA9IEBtYXRjaEFueSh0ZXh0LHBvcy5lbmQpXG4gICAgICBpZiBlbmQ/IGFuZCAoQGlkZW50aWNhbCgpIG9yIGVuZC5uYW1lKCkgPT0gJ2Nsb3NlcicpXG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksZW5kLmVuZCgpKVxuICAgICAgZWxzZSBpZiBAb3B0aW9ubmFsX2VuZFxuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLHRleHQubGVuZ3RoKVxuICBpc1dhcHBlck9mOiAocG9zLHRleHQpIC0+XG4gICAgcmV0dXJuIEB3cmFwcGVyUG9zKHBvcyx0ZXh0KT8iLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYWlyTWF0Y2hcbn0gZnJvbSAnLi9QYWlyTWF0Y2gnO1xuXG5leHBvcnQgdmFyIFBhaXIgPSBjbGFzcyBQYWlyIHtcbiAgY29uc3RydWN0b3Iob3BlbmVyLCBjbG9zZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgdGhpcy5vcGVuZXIgPSBvcGVuZXI7XG4gICAgdGhpcy5jbG9zZXIgPSBjbG9zZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IGZhbHNlLFxuICAgICAgdmFsaWRNYXRjaDogbnVsbFxuICAgIH07XG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICBpZiAoa2V5IGluIHRoaXMub3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSB0aGlzLm9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvcGVuZXJSZWcoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wZW5lciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5vcGVuZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMub3BlbmVyO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlclJlZygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuY2xvc2VyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNsb3NlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZXI7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BlbmVyOiB0aGlzLm9wZW5lclJlZygpLFxuICAgICAgY2xvc2VyOiB0aGlzLmNsb3NlclJlZygpXG4gICAgfTtcbiAgfVxuXG4gIG1hdGNoQW55UGFydEtleXMoKSB7XG4gICAgdmFyIGtleSwga2V5cywgcmVmLCByZWc7XG4gICAga2V5cyA9IFtdO1xuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV07XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG4gIH1cblxuICBtYXRjaEFueVJlZygpIHtcbiAgICB2YXIgZ3JvdXBzLCBrZXksIHJlZiwgcmVnO1xuICAgIGdyb3VwcyA9IFtdO1xuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV07XG4gICAgICBncm91cHMucHVzaCgnKCcgKyByZWcuc291cmNlICsgJyknKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoZ3JvdXBzLmpvaW4oJ3wnKSk7XG4gIH1cblxuICBtYXRjaEFueSh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoO1xuICAgIHdoaWxlICgoKG1hdGNoID0gdGhpcy5fbWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkgIT0gbnVsbCkgJiYgIW1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpO1xuICAgIH1cbiAgICBpZiAoKG1hdGNoICE9IG51bGwpICYmIG1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9XG4gIH1cblxuICBfbWF0Y2hBbnkodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaDtcbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KTtcbiAgICB9XG4gICAgbWF0Y2ggPSB0aGlzLm1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KTtcbiAgICBpZiAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBQYWlyTWF0Y2godGhpcywgbWF0Y2gsIG9mZnNldCk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlOYW1lZCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuX21hdGNoQW55R2V0TmFtZSh0aGlzLm1hdGNoQW55KHRleHQpKTtcbiAgfVxuXG4gIG1hdGNoQW55TGFzdCh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoLCByZXM7XG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKTtcbiAgICAgIGlmICghcmVzIHx8IHJlcy5lbmQoKSAhPT0gbWF0Y2guZW5kKCkpIHtcbiAgICAgICAgcmVzID0gbWF0Y2g7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBpZGVudGljYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVyID09PSB0aGlzLmNsb3NlciB8fCAoKHRoaXMub3BlbmVyLnNvdXJjZSAhPSBudWxsKSAmJiAodGhpcy5jbG9zZXIuc291cmNlICE9IG51bGwpICYmIHRoaXMub3BlbmVyLnNvdXJjZSA9PT0gdGhpcy5jbG9zZXIuc291cmNlKTtcbiAgfVxuXG4gIHdyYXBwZXJQb3MocG9zLCB0ZXh0KSB7XG4gICAgdmFyIGVuZCwgc3RhcnQ7XG4gICAgc3RhcnQgPSB0aGlzLm1hdGNoQW55TGFzdCh0ZXh0LnN1YnN0cigwLCBwb3Muc3RhcnQpKTtcbiAgICBpZiAoKHN0YXJ0ICE9IG51bGwpICYmICh0aGlzLmlkZW50aWNhbCgpIHx8IHN0YXJ0Lm5hbWUoKSA9PT0gJ29wZW5lcicpKSB7XG4gICAgICBlbmQgPSB0aGlzLm1hdGNoQW55KHRleHQsIHBvcy5lbmQpO1xuICAgICAgaWYgKChlbmQgIT0gbnVsbCkgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgZW5kLm5hbWUoKSA9PT0gJ2Nsb3NlcicpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIGVuZC5lbmQoKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ubmFsX2VuZCkge1xuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLCB0ZXh0Lmxlbmd0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNXYXBwZXJPZihwb3MsIHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy53cmFwcGVyUG9zKHBvcywgdGV4dCkgIT0gbnVsbDtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIFBhaXJNYXRjaFxuICBjb25zdHJ1Y3RvcjogKEBwYWlyLEBtYXRjaCxAb2Zmc2V0ID0gMCkgLT5cbiAgbmFtZTogLT5cbiAgICBpZiBAbWF0Y2hcbiAgICAgIHVubGVzcyBfbmFtZT9cbiAgICAgICAgZm9yIGdyb3VwLCBpIGluIEBtYXRjaFxuICAgICAgICAgIGlmIGkgPiAwIGFuZCBncm91cD9cbiAgICAgICAgICAgIF9uYW1lID0gQHBhaXIubWF0Y2hBbnlQYXJ0S2V5cygpW2ktMV1cbiAgICAgICAgICAgIHJldHVybiBfbmFtZVxuICAgICAgICBfbmFtZSA9IGZhbHNlXG4gICAgICByZXR1cm4gX25hbWUgfHwgbnVsbFxuICBzdGFydDogLT5cbiAgICBAbWF0Y2guaW5kZXggKyBAb2Zmc2V0XG4gIGVuZDogLT5cbiAgICBAbWF0Y2guaW5kZXggKyBAbWF0Y2hbMF0ubGVuZ3RoICsgQG9mZnNldFxuICB2YWxpZDogLT5cbiAgICByZXR1cm4gIUBwYWlyLnZhbGlkTWF0Y2ggfHwgQHBhaXIudmFsaWRNYXRjaCh0aGlzKVxuICBsZW5ndGg6IC0+XG4gICAgQG1hdGNoWzBdLmxlbmd0aCIsImV4cG9ydCB2YXIgUGFpck1hdGNoID0gY2xhc3MgUGFpck1hdGNoIHtcbiAgY29uc3RydWN0b3IocGFpciwgbWF0Y2gsIG9mZnNldCA9IDApIHtcbiAgICB0aGlzLnBhaXIgPSBwYWlyO1xuICAgIHRoaXMubWF0Y2ggPSBtYXRjaDtcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgfVxuXG4gIG5hbWUoKSB7XG4gICAgdmFyIF9uYW1lLCBncm91cCwgaSwgaiwgbGVuLCByZWY7XG4gICAgaWYgKHRoaXMubWF0Y2gpIHtcbiAgICAgIGlmICh0eXBlb2YgX25hbWUgPT09IFwidW5kZWZpbmVkXCIgfHwgX25hbWUgPT09IG51bGwpIHtcbiAgICAgICAgcmVmID0gdGhpcy5tYXRjaDtcbiAgICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgICBncm91cCA9IHJlZltpXTtcbiAgICAgICAgICBpZiAoaSA+IDAgJiYgKGdyb3VwICE9IG51bGwpKSB7XG4gICAgICAgICAgICBfbmFtZSA9IHRoaXMucGFpci5tYXRjaEFueVBhcnRLZXlzKClbaSAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuIF9uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfbmFtZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9uYW1lIHx8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm9mZnNldDtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMubWF0Y2hbMF0ubGVuZ3RoICsgdGhpcy5vZmZzZXQ7XG4gIH1cblxuICB2YWxpZCgpIHtcbiAgICByZXR1cm4gIXRoaXMucGFpci52YWxpZE1hdGNoIHx8IHRoaXMucGFpci52YWxpZE1hdGNoKHRoaXMpO1xuICB9XG5cbiAgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoWzBdLmxlbmd0aDtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIFBvc1xuICBjb25zdHJ1Y3RvcjogKEBzdGFydCxAZW5kKSAtPlxuICAgIEBlbmQgPSBAc3RhcnQgdW5sZXNzIEBlbmQ/XG4gIGNvbnRhaW5zUHQ6IChwdCkgLT5cbiAgICByZXR1cm4gQHN0YXJ0IDw9IHB0IGFuZCBwdCA8PSBAZW5kXG4gIGNvbnRhaW5zUG9zOiAocG9zKSAtPlxuICAgIHJldHVybiBAc3RhcnQgPD0gcG9zLnN0YXJ0IGFuZCBwb3MuZW5kIDw9IEBlbmRcbiAgd3JhcHBlZEJ5OiAocHJlZml4LHN1ZmZpeCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcy53cmFwQ2xhc3MoQHN0YXJ0LXByZWZpeC5sZW5ndGgsQHN0YXJ0LEBlbmQsQGVuZCtzdWZmaXgubGVuZ3RoKVxuICB3aXRoRWRpdG9yOiAodmFsKS0+XG4gICAgQF9lZGl0b3IgPSB2YWxcbiAgICByZXR1cm4gdGhpc1xuICBlZGl0b3I6IC0+XG4gICAgdW5sZXNzIEBfZWRpdG9yP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0JylcbiAgICByZXR1cm4gQF9lZGl0b3JcbiAgaGFzRWRpdG9yOiAtPlxuICAgIHJldHVybiBAX2VkaXRvcj9cbiAgdGV4dDogLT5cbiAgICBAZWRpdG9yKCkudGV4dFN1YnN0cihAc3RhcnQsIEBlbmQpXG4gIGFwcGx5T2Zmc2V0OiAob2Zmc2V0KS0+XG4gICAgaWYgb2Zmc2V0ICE9IDBcbiAgICAgIEBzdGFydCArPSBvZmZzZXRcbiAgICAgIEBlbmQgKz0gb2Zmc2V0XG4gICAgcmV0dXJuIHRoaXNcbiAgcHJldkVPTDogLT5cbiAgICB1bmxlc3MgQF9wcmV2RU9MP1xuICAgICAgQF9wcmV2RU9MID0gQGVkaXRvcigpLmZpbmRMaW5lU3RhcnQoQHN0YXJ0KVxuICAgIHJldHVybiBAX3ByZXZFT0xcbiAgbmV4dEVPTDogLT5cbiAgICB1bmxlc3MgQF9uZXh0RU9MP1xuICAgICAgQF9uZXh0RU9MID0gQGVkaXRvcigpLmZpbmRMaW5lRW5kKEBlbmQpXG4gICAgcmV0dXJuIEBfbmV4dEVPTFxuICB0ZXh0V2l0aEZ1bGxMaW5lczogLT5cbiAgICB1bmxlc3MgQF90ZXh0V2l0aEZ1bGxMaW5lcz9cbiAgICAgIEBfdGV4dFdpdGhGdWxsTGluZXMgPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAcHJldkVPTCgpLEBuZXh0RU9MKCkpXG4gICAgcmV0dXJuIEBfdGV4dFdpdGhGdWxsTGluZXNcbiAgc2FtZUxpbmVzUHJlZml4OiAtPlxuICAgIHVubGVzcyBAX3NhbWVMaW5lc1ByZWZpeD9cbiAgICAgIEBfc2FtZUxpbmVzUHJlZml4ID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQHByZXZFT0woKSxAc3RhcnQpXG4gICAgcmV0dXJuIEBfc2FtZUxpbmVzUHJlZml4XG4gIHNhbWVMaW5lc1N1ZmZpeDogLT5cbiAgICB1bmxlc3MgQF9zYW1lTGluZXNTdWZmaXg/XG4gICAgICBAX3NhbWVMaW5lc1N1ZmZpeCA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBlbmQsQG5leHRFT0woKSlcbiAgICByZXR1cm4gQF9zYW1lTGluZXNTdWZmaXhcbiAgY29weTogLT5cbiAgICByZXMgPSBuZXcgUG9zKEBzdGFydCxAZW5kKVxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgcmVzLndpdGhFZGl0b3IoQGVkaXRvcigpKVxuICAgIHJldHVybiByZXNcbiAgcmF3OiAtPlxuICAgIFtAc3RhcnQsQGVuZF0iLCJleHBvcnQgdmFyIFBvcyA9IGNsYXNzIFBvcyB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBlbmQpIHtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgaWYgKHRoaXMuZW5kID09IG51bGwpIHtcbiAgICAgIHRoaXMuZW5kID0gdGhpcy5zdGFydDtcbiAgICB9XG4gIH1cblxuICBjb250YWluc1B0KHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5lbmQ7XG4gIH1cblxuICBjb250YWluc1Bvcyhwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmVuZDtcbiAgfVxuXG4gIHdyYXBwZWRCeShwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyh0aGlzLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCwgdGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZW5kICsgc3VmZml4Lmxlbmd0aCk7XG4gIH1cblxuICB3aXRoRWRpdG9yKHZhbCkge1xuICAgIHRoaXMuX2VkaXRvciA9IHZhbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGVkaXRvcigpIHtcbiAgICBpZiAodGhpcy5fZWRpdG9yID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZWRpdG9yIHNldCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yO1xuICB9XG5cbiAgaGFzRWRpdG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9lZGl0b3IgIT0gbnVsbDtcbiAgfVxuXG4gIHRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gIH1cblxuICBhcHBseU9mZnNldChvZmZzZXQpIHtcbiAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgIHRoaXMuZW5kICs9IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcmV2RU9MKCkge1xuICAgIGlmICh0aGlzLl9wcmV2RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3ByZXZFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lU3RhcnQodGhpcy5zdGFydCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9wcmV2RU9MO1xuICB9XG5cbiAgbmV4dEVPTCgpIHtcbiAgICBpZiAodGhpcy5fbmV4dEVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9uZXh0RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZUVuZCh0aGlzLmVuZCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9uZXh0RU9MO1xuICB9XG5cbiAgdGV4dFdpdGhGdWxsTGluZXMoKSB7XG4gICAgaWYgKHRoaXMuX3RleHRXaXRoRnVsbExpbmVzID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHRXaXRoRnVsbExpbmVzID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMucHJldkVPTCgpLCB0aGlzLm5leHRFT0woKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcztcbiAgfVxuXG4gIHNhbWVMaW5lc1ByZWZpeCgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzUHJlZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5zdGFydCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNQcmVmaXg7XG4gIH1cblxuICBzYW1lTGluZXNTdWZmaXgoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNTdWZmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5lbmQsIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NhbWVMaW5lc1N1ZmZpeDtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBuZXcgUG9zKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICByYXcoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnN0YXJ0LCB0aGlzLmVuZF07XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFdyYXBwaW5nIH0gZnJvbSAnLi9XcmFwcGluZyc7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgQ29tbW9uSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUG9zQ29sbGVjdGlvblxuICBjb25zdHJ1Y3RvcjogKGFycikgLT5cbiAgICBpZiAhQXJyYXkuaXNBcnJheShhcnIpXG4gICAgICBhcnIgPSBbYXJyXVxuICAgIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhhcnIsW1Bvc0NvbGxlY3Rpb25dKVxuICAgIHJldHVybiBhcnJcbiAgICBcbiAgd3JhcDogKHByZWZpeCxzdWZmaXgpLT5cbiAgICAgIHJldHVybiBAbWFwKCAocCkgLT4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeCkpXG4gIHJlcGxhY2U6ICh0eHQpLT5cbiAgICAgIHJldHVybiBAbWFwKCAocCkgLT4gbmV3IFJlcGxhY2VtZW50KHAuc3RhcnQsIHAuZW5kLCB0eHQpKSIsImltcG9ydCB7XG4gIFdyYXBwaW5nXG59IGZyb20gJy4vV3JhcHBpbmcnO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuaW1wb3J0IHtcbiAgQ29tbW9uSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcblxuZXhwb3J0IHZhciBQb3NDb2xsZWN0aW9uID0gY2xhc3MgUG9zQ29sbGVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGFycikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICBhcnIgPSBbYXJyXTtcbiAgICB9XG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFyciwgW1Bvc0NvbGxlY3Rpb25dKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgd3JhcChwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeCk7XG4gICAgfSk7XG4gIH1cblxuICByZXBsYWNlKHR4dCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gbmV3IFJlcGxhY2VtZW50KHAuc3RhcnQsIHAuZW5kLCB0eHQpO1xuICAgIH0pO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL1Bvcyc7XG5pbXBvcnQgeyBDb21tb25IZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5pbXBvcnQgeyBPcHRpb25PYmplY3QgfSBmcm9tICcuLi9PcHRpb25PYmplY3QnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUmVwbGFjZW1lbnQgZXh0ZW5kcyBQb3NcbiAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKHRoaXMucHJvdG90eXBlLFtPcHRpb25PYmplY3RdKVxuICBjb25zdHJ1Y3RvcjogKEBzdGFydCwgQGVuZCwgQHRleHQsIEBvcHRpb25zID0ge30pIC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRPcHRzKEBvcHRpb25zLHtcbiAgICAgIHByZWZpeDogJydcbiAgICAgIHN1ZmZpeDogJydcbiAgICAgIHNlbGVjdGlvbnM6IFtdXG4gICAgfSlcbiAgcmVzUG9zQmVmb3JlUHJlZml4OiAtPlxuICAgIHJldHVybiBAc3RhcnQrQHByZWZpeC5sZW5ndGgrQHRleHQubGVuZ3RoXG4gIHJlc0VuZDogLT4gXG4gICAgcmV0dXJuIEBzdGFydCtAZmluYWxUZXh0KCkubGVuZ3RoXG4gIGFwcGx5OiAtPlxuICAgIEBlZGl0b3IoKS5zcGxpY2VUZXh0KEBzdGFydCwgQGVuZCwgQGZpbmFsVGV4dCgpKVxuICBuZWNlc3Nhcnk6IC0+XG4gICAgcmV0dXJuIEBmaW5hbFRleHQoKSAhPSBAb3JpZ2luYWxUZXh0KClcbiAgb3JpZ2luYWxUZXh0OiAtPlxuICAgIHJldHVybiBAZWRpdG9yKCkudGV4dFN1YnN0cihAc3RhcnQsIEBlbmQpXG4gIGZpbmFsVGV4dDogLT5cbiAgICByZXR1cm4gQHByZWZpeCtAdGV4dCtAc3VmZml4XG4gIG9mZnNldEFmdGVyOiAoKSAtPiBcbiAgICByZXR1cm4gQGZpbmFsVGV4dCgpLmxlbmd0aCAtIChAZW5kIC0gQHN0YXJ0KVxuICBhcHBseU9mZnNldDogKG9mZnNldCktPlxuICAgIGlmIG9mZnNldCAhPSAwXG4gICAgICBAc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBAZW5kICs9IG9mZnNldFxuICAgICAgZm9yIHNlbCBpbiBAc2VsZWN0aW9uc1xuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0XG4gICAgcmV0dXJuIHRoaXNcbiAgc2VsZWN0Q29udGVudDogLT4gXG4gICAgQHNlbGVjdGlvbnMgPSBbbmV3IFBvcyhAcHJlZml4Lmxlbmd0aCtAc3RhcnQsIEBwcmVmaXgubGVuZ3RoK0BzdGFydCtAdGV4dC5sZW5ndGgpXVxuICAgIHJldHVybiB0aGlzXG4gIGNhcnJldFRvU2VsOiAtPlxuICAgIEBzZWxlY3Rpb25zID0gW11cbiAgICB0ZXh0ID0gQGZpbmFsVGV4dCgpXG4gICAgQHByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHByZWZpeClcbiAgICBAdGV4dCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHRleHQpXG4gICAgQHN1ZmZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHN1ZmZpeClcbiAgICBzdGFydCA9IEBzdGFydFxuICAgIFxuICAgIHdoaWxlIChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpP1xuICAgICAgW3Bvcyx0ZXh0XSA9IHJlc1xuICAgICAgQHNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0K3Bvcywgc3RhcnQrcG9zKSlcbiAgICAgIFxuICAgIHJldHVybiB0aGlzXG4gIGNvcHk6IC0+IFxuICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudChAc3RhcnQsIEBlbmQsIEB0ZXh0LCBAZ2V0T3B0cygpKVxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgcmVzLndpdGhFZGl0b3IoQGVkaXRvcigpKVxuICAgIHJlcy5zZWxlY3Rpb25zID0gQHNlbGVjdGlvbnMubWFwKCAocyktPnMuY29weSgpIClcbiAgICByZXR1cm4gcmVzIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vUG9zJztcblxuaW1wb3J0IHtcbiAgQ29tbW9uSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcblxuaW1wb3J0IHtcbiAgT3B0aW9uT2JqZWN0XG59IGZyb20gJy4uL09wdGlvbk9iamVjdCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCB2YXIgUmVwbGFjZW1lbnQgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIFJlcGxhY2VtZW50IGV4dGVuZHMgUG9zIHtcbiAgICBjb25zdHJ1Y3RvcihzdGFydDEsIGVuZCwgdGV4dDEsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDE7XG4gICAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICAgIHRoaXMudGV4dCA9IHRleHQxO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgcHJlZml4OiAnJyxcbiAgICAgICAgc3VmZml4OiAnJyxcbiAgICAgICAgc2VsZWN0aW9uczogW11cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc1Bvc0JlZm9yZVByZWZpeCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy50ZXh0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXNFbmQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoO1xuICAgIH1cblxuICAgIGFwcGx5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkuc3BsaWNlVGV4dCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5maW5hbFRleHQoKSk7XG4gICAgfVxuXG4gICAgbmVjZXNzYXJ5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkgIT09IHRoaXMub3JpZ2luYWxUZXh0KCk7XG4gICAgfVxuXG4gICAgb3JpZ2luYWxUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gICAgfVxuXG4gICAgZmluYWxUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy50ZXh0ICsgdGhpcy5zdWZmaXg7XG4gICAgfVxuXG4gICAgb2Zmc2V0QWZ0ZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKS5sZW5ndGggLSAodGhpcy5lbmQgLSB0aGlzLnN0YXJ0KTtcbiAgICB9XG5cbiAgICBhcHBseU9mZnNldChvZmZzZXQpIHtcbiAgICAgIHZhciBpLCBsZW4sIHJlZiwgc2VsO1xuICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgICAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnM7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHNlbCA9IHJlZltpXTtcbiAgICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZWxlY3RDb250ZW50KCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW25ldyBQb3ModGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCwgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCArIHRoaXMudGV4dC5sZW5ndGgpXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNhcnJldFRvU2VsKCkge1xuICAgICAgdmFyIHBvcywgcmVzLCBzdGFydCwgdGV4dDtcbiAgICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtdO1xuICAgICAgdGV4dCA9IHRoaXMuZmluYWxUZXh0KCk7XG4gICAgICB0aGlzLnByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5wcmVmaXgpO1xuICAgICAgdGhpcy50ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnRleHQpO1xuICAgICAgdGhpcy5zdWZmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMuc3VmZml4KTtcbiAgICAgIHN0YXJ0ID0gdGhpcy5zdGFydDtcbiAgICAgIHdoaWxlICgocmVzID0gU3RyaW5nSGVscGVyLmdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHRleHQpKSAhPSBudWxsKSB7XG4gICAgICAgIFtwb3MsIHRleHRdID0gcmVzO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0ICsgcG9zLCBzdGFydCArIHBvcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgIHZhciByZXM7XG4gICAgICByZXMgPSBuZXcgUmVwbGFjZW1lbnQodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMudGV4dCwgdGhpcy5nZXRPcHRzKCkpO1xuICAgICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSk7XG4gICAgICB9XG4gICAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcy5jb3B5KCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gIH07XG5cbiAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKFJlcGxhY2VtZW50LnByb3RvdHlwZSwgW09wdGlvbk9iamVjdF0pO1xuXG4gIHJldHVybiBSZXBsYWNlbWVudDtcblxufSkuY2FsbCh0aGlzKTtcbiIsImV4cG9ydCBjbGFzcyBTaXplXG4gIGNvbnN0cnVjdG9yOiAoQHdpZHRoLEBoZWlnaHQpIC0+IiwiZXhwb3J0IGNsYXNzIFN0clBvc1xuICBjb25zdHJ1Y3RvcjogKEBwb3MsQHN0cikgLT5cbiAgZW5kOiAtPlxuICAgIEBwb3MgKyBAc3RyLmxlbmd0aCIsImV4cG9ydCB2YXIgU3RyUG9zID0gY2xhc3MgU3RyUG9zIHtcbiAgY29uc3RydWN0b3IocG9zLCBzdHIpIHtcbiAgICB0aGlzLnBvcyA9IHBvcztcbiAgICB0aGlzLnN0ciA9IHN0cjtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGg7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcblxuZXhwb3J0IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3NcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIC0+XG4gICAgc3VwZXIoKVxuICBpbm5lckNvbnRhaW5zUHQ6IChwdCkgLT5cbiAgICByZXR1cm4gQGlubmVyU3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBpbm5lckVuZFxuICBpbm5lckNvbnRhaW5zUG9zOiAocG9zKSAtPlxuICAgIHJldHVybiBAaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGlubmVyRW5kXG4gIGlubmVyVGV4dDogLT5cbiAgICBAZWRpdG9yKCkudGV4dFN1YnN0cihAaW5uZXJTdGFydCwgQGlubmVyRW5kKVxuICBzZXRJbm5lckxlbjogKGxlbikgLT5cbiAgICBAbW92ZVN1Zml4KEBpbm5lclN0YXJ0ICsgbGVuKVxuICBtb3ZlU3VmZml4OiAocHQpIC0+XG4gICAgc3VmZml4TGVuID0gQGVuZCAtIEBpbm5lckVuZFxuICAgIEBpbm5lckVuZCA9IHB0XG4gICAgQGVuZCA9IEBpbm5lckVuZCArIHN1ZmZpeExlblxuICBjb3B5OiAtPlxuICAgIHJldHVybiBuZXcgV3JhcHBlZFBvcyhAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vUG9zJztcblxuZXhwb3J0IHZhciBXcmFwcGVkUG9zID0gY2xhc3MgV3JhcHBlZFBvcyBleHRlbmRzIFBvcyB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBpbm5lclN0YXJ0LCBpbm5lckVuZCwgZW5kKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5pbm5lclN0YXJ0ID0gaW5uZXJTdGFydDtcbiAgICB0aGlzLmlubmVyRW5kID0gaW5uZXJFbmQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gIH1cblxuICBpbm5lckNvbnRhaW5zUHQocHQpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclN0YXJ0IDw9IHB0ICYmIHB0IDw9IHRoaXMuaW5uZXJFbmQ7XG4gIH1cblxuICBpbm5lckNvbnRhaW5zUG9zKHBvcykge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcG9zLnN0YXJ0ICYmIHBvcy5lbmQgPD0gdGhpcy5pbm5lckVuZDtcbiAgfVxuXG4gIGlubmVyVGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCk7XG4gIH1cblxuICBzZXRJbm5lckxlbihsZW4pIHtcbiAgICByZXR1cm4gdGhpcy5tb3ZlU3VmaXgodGhpcy5pbm5lclN0YXJ0ICsgbGVuKTtcbiAgfVxuXG4gIG1vdmVTdWZmaXgocHQpIHtcbiAgICB2YXIgc3VmZml4TGVuO1xuICAgIHN1ZmZpeExlbiA9IHRoaXMuZW5kIC0gdGhpcy5pbm5lckVuZDtcbiAgICB0aGlzLmlubmVyRW5kID0gcHQ7XG4gICAgcmV0dXJuIHRoaXMuZW5kID0gdGhpcy5pbm5lckVuZCArIHN1ZmZpeExlbjtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKHRoaXMuc3RhcnQsIHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCwgdGhpcy5lbmQpO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgY2xhc3MgV3JhcHBpbmcgZXh0ZW5kcyBSZXBsYWNlbWVudFxuICBjb25zdHJ1Y3RvcjogKEBzdGFydCwgQGVuZCwgcHJlZml4ID0nJywgc3VmZml4ID0gJycsIEBvcHRpb25zID0ge30pIC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRPcHRzKEBvcHRpb25zKVxuICAgIEB0ZXh0ID0gJydcbiAgICBAcHJlZml4ID0gcHJlZml4XG4gICAgQHN1ZmZpeCA9IHN1ZmZpeFxuICBhcHBseTogLT5cbiAgICBAYWRqdXN0U2VsKClcbiAgICBzdXBlcigpXG4gIGFkanVzdFNlbDogLT5cbiAgICBvZmZzZXQgPSBAb3JpZ2luYWxUZXh0KCkubGVuZ3RoXG4gICAgZm9yIHNlbCBpbiBAc2VsZWN0aW9uc1xuICAgICAgaWYgc2VsLnN0YXJ0ID4gQHN0YXJ0K0BwcmVmaXgubGVuZ3RoXG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgIGlmIHNlbC5lbmQgPj0gQHN0YXJ0K0BwcmVmaXgubGVuZ3RoXG4gICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0XG4gIGZpbmFsVGV4dDogLT5cbiAgICBpZiBAaGFzRWRpdG9yKClcbiAgICAgIHRleHQgPSBAb3JpZ2luYWxUZXh0KClcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gJydcbiAgICByZXR1cm4gQHByZWZpeCt0ZXh0K0BzdWZmaXhcbiAgb2Zmc2V0QWZ0ZXI6ICgpIC0+IFxuICAgIHJldHVybiBAcHJlZml4Lmxlbmd0aCtAc3VmZml4Lmxlbmd0aFxuICAgICAgICAgIFxuICBjb3B5OiAtPiBcbiAgICByZXMgPSBuZXcgV3JhcHBpbmcoQHN0YXJ0LCBAZW5kLCBAcHJlZml4LCBAc3VmZml4KVxuICAgIHJlcy5zZWxlY3Rpb25zID0gQHNlbGVjdGlvbnMubWFwKCAocyktPnMuY29weSgpIClcbiAgICByZXR1cm4gcmVzIiwiaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCB2YXIgV3JhcHBpbmcgPSBjbGFzcyBXcmFwcGluZyBleHRlbmRzIFJlcGxhY2VtZW50IHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGVuZCwgcHJlZml4ID0gJycsIHN1ZmZpeCA9ICcnLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMudGV4dCA9ICcnO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4O1xuICAgIHRoaXMuc3VmZml4ID0gc3VmZml4O1xuICB9XG5cbiAgYXBwbHkoKSB7XG4gICAgdGhpcy5hZGp1c3RTZWwoKTtcbiAgICByZXR1cm4gc3VwZXIuYXBwbHkoKTtcbiAgfVxuXG4gIGFkanVzdFNlbCgpIHtcbiAgICB2YXIgaSwgbGVuLCBvZmZzZXQsIHJlZiwgcmVzdWx0cywgc2VsO1xuICAgIG9mZnNldCA9IHRoaXMub3JpZ2luYWxUZXh0KCkubGVuZ3RoO1xuICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9ucztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzZWwgPSByZWZbaV07XG4gICAgICBpZiAoc2VsLnN0YXJ0ID4gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgfVxuICAgICAgaWYgKHNlbC5lbmQgPj0gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHRzLnB1c2goc2VsLmVuZCArPSBvZmZzZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgZmluYWxUZXh0KCkge1xuICAgIHZhciB0ZXh0O1xuICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICB0ZXh0ID0gdGhpcy5vcmlnaW5hbFRleHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9ICcnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0ZXh0ICsgdGhpcy5zdWZmaXg7XG4gIH1cblxuICBvZmZzZXRBZnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdWZmaXgubGVuZ3RoO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBXcmFwcGluZyh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5wcmVmaXgsIHRoaXMuc3VmZml4KTtcbiAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24ocykge1xuICAgICAgcmV0dXJuIHMuY29weSgpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxufTtcbiIsIlxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZUVuZ2luZVxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgc2F2ZTogKGtleSx2YWwpIC0+XG4gICAgaWYgbG9jYWxTdG9yYWdlP1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oQGZ1bGxLZXkoa2V5KSwgSlNPTi5zdHJpbmdpZnkodmFsKSlcbiAgc2F2ZUluUGF0aDogKHBhdGgsIGtleSwgdmFsKSAtPlxuICAgIGRhdGEgPSBAbG9hZChwYXRoKVxuICAgIHVubGVzcyBkYXRhP1xuICAgICAgZGF0YSA9IHt9XG4gICAgZGF0YVtrZXldID0gdmFsXG4gICAgQHNhdmUocGF0aCxkYXRhKVxuICBsb2FkOiAoa2V5KSAtPlxuICAgIGlmIGxvY2FsU3RvcmFnZT9cbiAgICAgIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oQGZ1bGxLZXkoa2V5KSkpXG4gIGZ1bGxLZXk6IChrZXkpIC0+XG4gICAgJ0NvZGVXYXZlXycra2V5IiwiZXhwb3J0IHZhciBMb2NhbFN0b3JhZ2VFbmdpbmUgPSBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmUge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgc2F2ZShrZXksIHZhbCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKTtcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZGF0YSA9IHRoaXMubG9hZChwYXRoKTtcbiAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfVxuICAgIGRhdGFba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gdGhpcy5zYXZlKHBhdGgsIGRhdGEpO1xuICB9XG5cbiAgbG9hZChrZXkpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpKSk7XG4gICAgfVxuICB9XG5cbiAgZnVsbEtleShrZXkpIHtcbiAgICByZXR1cm4gJ0NvZGVXYXZlXycgKyBrZXk7XG4gIH1cblxufTtcbiJdfQ==
