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
        this.allowedNamed = _optKey('allowedNamed', data);
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

var BoxCmd, CloseCmd, EditCmd, EmmetCmd, NameSpaceCmd, aliasCommand, exec_parent, getContent, getParam, help, listCommand, no_execute, quote_carret, removeCommand, renameCommand;

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
          'allowedNamed': ['name'],
          'parse': true,
          'help': "List available commands\n\nYou can use the first argument to choose a specific namespace, \nby default all curent namespace will be shown"
        },
        'ls': {
          'aliasOf': 'core:list'
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
  var cmd, cmdName, helpCmd, text;
  cmdName = instance.getParam([0, 'cmd']);

  if (cmdName != null) {
    cmd = instance.context.getParentOrRoot().getCmd(cmdName);

    if (cmd != null) {
      helpCmd = cmd.getCmd('help');
      text = helpCmd ? "~~".concat(helpCmd.fullName, "~~") : "This command has no help text";
      return "~~box~~\nHelp for ~~!".concat(cmd.fullName, "~~ :\n\n").concat(text, "\n\n~~!close|~~\n~~/box~~");
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
  var box, commands, name, namespaces, text;
  box = instance.getBoolParam(['box'], true);
  name = instance.getParam([0, 'name']);
  namespaces = name ? [name] : instance.context.getNameSpaces().filter(function (nspc) {
    return nspc !== instance.cmd.fullName;
  });
  commands = namespaces.reduce(function (commands, nspc) {
    var cmd;
    cmd = instance.context.getParentOrRoot().getCmd(nspc, {
      mustExecute: false
    });

    if (cmd != null) {
      cmd.init();

      if (cmd.cmds) {
        commands = commands.concat(cmd.cmds);
      }

      return commands;
    }
  }, []);
  text = commands.map(function (cmd) {
    return cmd.fullName;
  }).join("\n");

  if (box) {
    return "~~box~~\n".concat(text, "\n\n~~!close|~~\n~~/box~~");
  } else {
    return text;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvQm94SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9Cb3hIZWxwZXIuanMiLCIuLi9zcmMvQ2xvc2luZ1Byb21wLmNvZmZlZSIsIi4uL3NyYy9DbG9zaW5nUHJvbXAuanMiLCIuLi9zcmMvQ21kRmluZGVyLmNvZmZlZSIsIi4uL3NyYy9DbWRGaW5kZXIuanMiLCIuLi9zcmMvQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL0NtZEluc3RhbmNlLmpzIiwiLi4vc3JjL0NvZGV3YXZlLmNvZmZlZSIsIi4uL3NyYy9Db2Rld2F2ZS5qcyIsIi4uL3NyYy9Db21tYW5kLmNvZmZlZSIsIi4uL3NyYy9Db21tYW5kLmpzIiwiLi4vc3JjL0NvbnRleHQuY29mZmVlIiwiLi4vc3JjL0NvbnRleHQuanMiLCIuLi9zcmMvRGV0ZWN0b3IuY29mZmVlIiwiLi4vc3JjL0RldGVjdG9yLmpzIiwiLi4vc3JjL0VkaXRDbWRQcm9wLmNvZmZlZSIsIi4uL3NyYy9FZGl0Q21kUHJvcC5qcyIsIi4uL3NyYy9FZGl0b3IuY29mZmVlIiwiLi4vc3JjL0VkaXRvci5qcyIsIi4uL3NyYy9Mb2dnZXIuY29mZmVlIiwiLi4vc3JjL0xvZ2dlci5qcyIsIi4uL3NyYy9PcHRpb25PYmplY3QuY29mZmVlIiwiLi4vc3JjL09wdGlvbk9iamVjdC5qcyIsIi4uL3NyYy9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsIi4uL3NyYy9Qcm9jZXNzLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmpzIiwiLi4vc3JjL1RleHRBcmVhRWRpdG9yLmNvZmZlZSIsIi4uL3NyYy9UZXh0QXJlYUVkaXRvci5qcyIsIi4uL3NyYy9UZXh0UGFyc2VyLmNvZmZlZSIsIi4uL3NyYy9UZXh0UGFyc2VyLmpzIiwiLi4vc3JjL2Jvb3RzdHJhcC5jb2ZmZWUiLCIuLi9zcmMvYm9vdHN0cmFwLmpzIiwiLi4vc3JjL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9QaHBDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2VudHJ5LmNvZmZlZSIsIi4uL3NyYy9lbnRyeS5qcyIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvQ29tbW9uSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0NvbW1vbkhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL05hbWVzcGFjZUhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCIuLi9zcmMvaGVscGVycy9PcHRpb25hbFByb21pc2UuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlLmpzIiwiLi4vc3JjL2hlbHBlcnMvU3RyaW5nSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL1N0cmluZ0hlbHBlci5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1BhaXJNYXRjaC5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1NpemUuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1N0clBvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvV3JhcHBpbmcuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwaW5nLmpzIiwiLi4vc3JjL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZS5jb2ZmZWUiLCIuLi9zcmMvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSx1QkFBQSxDQUFBOztBQUNBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxvQkFBQSxDQUFBOztBQUVBLElBQWEsU0FBTjtBQUFBO0FBQUE7QUFDTCxxQkFBYSxPQUFiLEVBQWE7QUFBQSxRQUFXLE9BQVgsdUVBQUEsRUFBQTs7QUFBQTs7QUFDWCxRQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQURZLFNBQUEsT0FBQSxHQUFBLE9BQUE7QUFDWixTQUFBLFFBQUEsR0FBWTtBQUNWLE1BQUEsSUFBQSxFQUFNLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FESSxJ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QUEsQ0FBdkIsV0FBQSxDQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVEQSxJQUFhLGtCQUFOO0FBQUE7QUFBQTtBQUNMLGdDQUFhO0FBQUE7QUFBQTs7QUFEUjtBQUFBO0FBQUEseUJBRUMsR0FGRCxFQUVDLEdBRkQsRUFFQztBQUNKLFVBQUcsT0FBQSxZQUFBLEtBQUEsV0FBQSxJQUFBLFlBQUEsS0FBSCxJQUFBLEVBQUE7QUNDRSxlREFBLFlBQVksQ0FBWixPQUFBLENBQXFCLEtBQUEsT0FBQSxDQUFyQixHQUFxQixDQUFyQixFQUFvQyxJQUFJLENBQUosU0FBQSxDQUFwQyxHQUFvQyxDQUFwQyxDQ0FBO0FBQ0Q7QURIRztBQUZEO0FBQUE7QUFBQSwrQkFLTyxJQUxQLEVBS08sR0FMUCxFQUtPLEdBTFAsRUFLTztBQUNWLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLEtBQUEsSUFBQSxDQUFQLElBQU8sQ0FBUDs7QUFDQSxVQUFPLElBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBQSxFQUFBO0FDS0Q7O0FESkQsTUFBQSxJQUFLLENBQUwsR0FBSyxDQUFMLEdBQUEsR0FBQTtBQ01BLGFETEEsS0FBQSxJQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsQ0NLQTtBRFZVO0FBTFA7QUFBQTtBQUFBLHlCQVdDLEdBWEQsRUFXQztBQUNKLFVBQUcsT0FBQSxZQUFBLEtBQUEsV0FBQSxJQUFBLFlBQUEsS0FBSCxJQUFBLEVBQUE7QUNRRSxlRFBBLElBQUksQ0FBSixLQUFBLENBQVcsWUFBWSxDQUFaLE9BQUEsQ0FBcUIsS0FBQSxPQUFBLENBQWhDLEdBQWdDLENBQXJCLENBQVgsQ0NPQTtBQUNEO0FEVkc7QUFYRDtBQUFBO0FBQUEsNEJBY0ksR0FkSixFQWNJO0FDV1AsYURWQSxjQUFZLEdDVVo7QURYTztBQWRKOztBQUFBO0FBQUEsR0FBUCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuaW1wb3J0IHsgUGFpciB9IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCBjbGFzcyBCb3hIZWxwZXJcbiAgY29uc3RydWN0b3I6IChAY29udGV4dCwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIEBkZWZhdWx0cyA9IHtcbiAgICAgIGRlY286IEBjb250ZXh0LmNvZGV3YXZlLmRlY29cbiAgICAgIHBhZDogMlxuICAgICAgd2lkdGg6IDUwXG4gICAgICBoZWlnaHQ6IDNcbiAgICAgIG9wZW5UZXh0OiAnJ1xuICAgICAgY2xvc2VUZXh0OiAnJ1xuICAgICAgcHJlZml4OiAnJ1xuICAgICAgc3VmZml4OiAnJ1xuICAgICAgaW5kZW50OiAwXG4gICAgfVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgY2xvbmU6ICh0ZXh0KSAtPlxuICAgIG9wdCA9IHt9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgb3B0W2tleV0gPSB0aGlzW2tleV1cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcihAY29udGV4dCxvcHQpXG4gIGRyYXc6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAc3RhcnRTZXAoKSArIFwiXFxuXCIgKyBAbGluZXModGV4dCkgKyBcIlxcblwiKyBAZW5kU2VwKClcbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LndyYXBDb21tZW50KHN0cilcbiAgc2VwYXJhdG9yOiAtPlxuICAgIGxlbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGRlY29MaW5lKGxlbikpXG4gIHN0YXJ0U2VwOiAtPlxuICAgIGxuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoIC0gQG9wZW5UZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAcHJlZml4ICsgQHdyYXBDb21tZW50KEBvcGVuVGV4dCtAZGVjb0xpbmUobG4pKVxuICBlbmRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAY2xvc2VUZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGNsb3NlVGV4dCtAZGVjb0xpbmUobG4pKSArIEBzdWZmaXhcbiAgZGVjb0xpbmU6IChsZW4pIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChAZGVjbywgbGVuKVxuICBwYWRkaW5nOiAtPiBcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCBAcGFkKVxuICBsaW5lczogKHRleHQgPSAnJywgdXB0b0hlaWdodD10cnVlKSAtPlxuICAgIHRleHQgPSB0ZXh0IG9yICcnXG4gICAgbGluZXMgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIilcbiAgICBpZiB1cHRvSGVpZ2h0XG4gICAgICByZXR1cm4gKEBsaW5lKGxpbmVzW3hdIG9yICcnKSBmb3IgeCBpbiBbMC4uQGhlaWdodF0pLmpvaW4oJ1xcbicpIFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoQGxpbmUobCkgZm9yIGwgaW4gbGluZXMpLmpvaW4oJ1xcbicpIFxuICBsaW5lOiAodGV4dCA9ICcnKSAtPlxuICAgIHJldHVybiAoU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLEBpbmRlbnQpICtcbiAgICAgIEB3cmFwQ29tbWVudChcbiAgICAgICAgQGRlY28gK1xuICAgICAgICBAcGFkZGluZygpICtcbiAgICAgICAgdGV4dCArXG4gICAgICAgIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgQHdpZHRoIC0gQHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyBcbiAgICAgICAgQHBhZGRpbmcoKSArXG4gICAgICAgIEBkZWNvXG4gICAgICApKVxuICBsZWZ0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50TGVmdChAZGVjbyArIEBwYWRkaW5nKCkpXG4gIHJpZ2h0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQHBhZGRpbmcoKSArIEBkZWNvKVxuICByZW1vdmVJZ25vcmVkQ29udGVudDogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnMoQGNvbnRleHQuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHRleHQpKVxuICB0ZXh0Qm91bmRzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldFR4dFNpemUoQHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpKVxuICBnZXRCb3hGb3JQb3M6IChwb3MpIC0+XG4gICAgZGVwdGggPSBAZ2V0TmVzdGVkTHZsKHBvcy5zdGFydClcbiAgICBpZiBkZXB0aCA+IDBcbiAgICAgIGxlZnQgPSBAbGVmdCgpXG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LGRlcHRoLTEpXG4gICAgICBcbiAgICAgIGNsb25lID0gQGNsb25lKClcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiXG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aFxuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSBAZGVjbyArIEBkZWNvICsgcGxhY2Vob2xkZXIgKyBAZGVjbyArIEBkZWNvXG4gICAgICBcbiAgICAgIHN0YXJ0RmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwnLionKSlcbiAgICAgIFxuICAgICAgcGFpciA9IG5ldyBQYWlyKHN0YXJ0RmluZCxlbmRGaW5kLHtcbiAgICAgICAgdmFsaWRNYXRjaDogKG1hdGNoKT0+XG4gICAgICAgICAgIyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuICAgICAgICAgIGYgPSBAY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKVxuICAgICAgICAgIHJldHVybiAhZj8gb3IgZi5zdHIgIT0gbGVmdFxuICAgICAgfSlcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsQGNvbnRleHQuY29kZXdhdmUuZWRpdG9yLnRleHQoKSlcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgcmVzLnN0YXJ0ICs9IGN1ckxlZnQubGVuZ3RoXG4gICAgICAgIHJldHVybiByZXNcbiAgICBcbiAgZ2V0TmVzdGVkTHZsOiAoaW5kZXgpIC0+XG4gICAgZGVwdGggPSAwXG4gICAgbGVmdCA9IEBsZWZ0KClcbiAgICB3aGlsZSAoZiA9IEBjb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KGluZGV4ICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKSk/ICYmIGYuc3RyID09IGxlZnRcbiAgICAgIGluZGV4ID0gZi5wb3NcbiAgICAgIGRlcHRoKytcbiAgICByZXR1cm4gZGVwdGhcbiAgZ2V0T3B0RnJvbUxpbmU6IChsaW5lLGdldFBhZD10cnVlKSAtPlxuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdChAZGVjbykpK1wiKShcXFxccyopXCIpXG4gICAgckVuZCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQGRlY28pKStcIikoXFxufCQpXCIpXG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKVxuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKVxuICAgIGlmIHJlc1N0YXJ0PyBhbmQgcmVzRW5kP1xuICAgICAgaWYgZ2V0UGFkXG4gICAgICAgIEBwYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgscmVzRW5kWzFdLmxlbmd0aClcbiAgICAgIEBpbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGhcbiAgICAgIHN0YXJ0UG9zID0gcmVzU3RhcnQuaW5kZXggKyByZXNTdGFydFsxXS5sZW5ndGggKyByZXNTdGFydFsyXS5sZW5ndGggKyBAcGFkXG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gQHBhZFxuICAgICAgQHdpZHRoID0gZW5kUG9zIC0gc3RhcnRQb3NcbiAgICByZXR1cm4gdGhpc1xuICByZWZvcm1hdExpbmVzOiAodGV4dCxvcHRpb25zPXt9KSAtPlxuICAgIHJldHVybiBAbGluZXMoQHJlbW92ZUNvbW1lbnQodGV4dCxvcHRpb25zKSxmYWxzZSlcbiAgcmVtb3ZlQ29tbWVudDogKHRleHQsb3B0aW9ucz17fSktPlxuICAgIGlmIHRleHQ/XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgbXVsdGlsaW5lOiB0cnVlXG4gICAgICB9XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LGRlZmF1bHRzLG9wdGlvbnMpXG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdCgpKVxuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpXG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGRlY28pXG4gICAgICBmbGFnID0gaWYgb3B0aW9uc1snbXVsdGlsaW5lJ10gdGhlbiAnZ20nIGVsc2UgJydcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzezAsI3tAcGFkfX1cIiwgZmxhZylcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoXCJcXFxccyooPzoje2VkfSkqI3tlY3J9XFxcXHMqJFwiLCBmbGFnKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsJycpLnJlcGxhY2UocmUyLCcnKVxuICAgXG4gICIsImltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQXJyYXlIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcblxuaW1wb3J0IHtcbiAgUGFpclxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgdmFyIEJveEhlbHBlciA9IGNsYXNzIEJveEhlbHBlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBrZXksIHJlZiwgdmFsO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIGRlY286IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5kZWNvLFxuICAgICAgcGFkOiAyLFxuICAgICAgd2lkdGg6IDUwLFxuICAgICAgaGVpZ2h0OiAzLFxuICAgICAgb3BlblRleHQ6ICcnLFxuICAgICAgY2xvc2VUZXh0OiAnJyxcbiAgICAgIHByZWZpeDogJycsXG4gICAgICBzdWZmaXg6ICcnLFxuICAgICAgaW5kZW50OiAwXG4gICAgfTtcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsb25lKHRleHQpIHtcbiAgICB2YXIga2V5LCBvcHQsIHJlZiwgdmFsO1xuICAgIG9wdCA9IHt9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIG9wdFtrZXldID0gdGhpc1trZXldO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQsIG9wdCk7XG4gIH1cblxuICBkcmF3KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydFNlcCgpICsgXCJcXG5cIiArIHRoaXMubGluZXModGV4dCkgKyBcIlxcblwiICsgdGhpcy5lbmRTZXAoKTtcbiAgfVxuXG4gIHdyYXBDb21tZW50KHN0cikge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnQoc3RyKTtcbiAgfVxuXG4gIHNlcGFyYXRvcigpIHtcbiAgICB2YXIgbGVuO1xuICAgIGxlbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmRlY29MaW5lKGxlbikpO1xuICB9XG5cbiAgc3RhcnRTZXAoKSB7XG4gICAgdmFyIGxuO1xuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5vcGVuVGV4dC5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy53cmFwQ29tbWVudCh0aGlzLm9wZW5UZXh0ICsgdGhpcy5kZWNvTGluZShsbikpO1xuICB9XG5cbiAgZW5kU2VwKCkge1xuICAgIHZhciBsbjtcbiAgICBsbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aCAtIHRoaXMuY2xvc2VUZXh0Lmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmNsb3NlVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKSArIHRoaXMuc3VmZml4O1xuICB9XG5cbiAgZGVjb0xpbmUobGVuKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCh0aGlzLmRlY28sIGxlbik7XG4gIH1cblxuICBwYWRkaW5nKCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMucGFkKTtcbiAgfVxuXG4gIGxpbmVzKHRleHQgPSAnJywgdXB0b0hlaWdodCA9IHRydWUpIHtcbiAgICB2YXIgbCwgbGluZXMsIHg7XG4gICAgdGV4dCA9IHRleHQgfHwgJyc7XG4gICAgbGluZXMgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIik7XG4gICAgaWYgKHVwdG9IZWlnaHQpIHtcbiAgICAgIHJldHVybiAoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSwgcmVmLCByZXN1bHRzO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoeCA9IGkgPSAwLCByZWYgPSB0aGlzLmhlaWdodDsgKDAgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZik7IHggPSAwIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobGluZXNbeF0gfHwgJycpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pLmNhbGwodGhpcykpLmpvaW4oJ1xcbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGksIGxlbjEsIHJlc3VsdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuMSA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICAgIGwgPSBsaW5lc1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5saW5lKGwpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pLmNhbGwodGhpcykpLmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgfVxuXG4gIGxpbmUodGV4dCA9ICcnKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy5pbmRlbnQpICsgdGhpcy53cmFwQ29tbWVudCh0aGlzLmRlY28gKyB0aGlzLnBhZGRpbmcoKSArIHRleHQgKyBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMud2lkdGggLSB0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyB0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbyk7XG4gIH1cblxuICBsZWZ0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpKTtcbiAgfVxuXG4gIHJpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbyk7XG4gIH1cblxuICByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpO1xuICB9XG5cbiAgdGV4dEJvdW5kcyh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRUeHRTaXplKHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpO1xuICB9XG5cbiAgZ2V0Qm94Rm9yUG9zKHBvcykge1xuICAgIHZhciBjbG9uZSwgY3VyTGVmdCwgZGVwdGgsIGVuZEZpbmQsIGxlZnQsIHBhaXIsIHBsYWNlaG9sZGVyLCByZXMsIHN0YXJ0RmluZDtcbiAgICBkZXB0aCA9IHRoaXMuZ2V0TmVzdGVkTHZsKHBvcy5zdGFydCk7XG4gICAgaWYgKGRlcHRoID4gMCkge1xuICAgICAgbGVmdCA9IHRoaXMubGVmdCgpO1xuICAgICAgY3VyTGVmdCA9IFN0cmluZ0hlbHBlci5yZXBlYXQobGVmdCwgZGVwdGggLSAxKTtcbiAgICAgIGNsb25lID0gdGhpcy5jbG9uZSgpO1xuICAgICAgcGxhY2Vob2xkZXIgPSBcIiMjI1BsYWNlSG9sZGVyIyMjXCI7XG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aDtcbiAgICAgIGNsb25lLm9wZW5UZXh0ID0gY2xvbmUuY2xvc2VUZXh0ID0gdGhpcy5kZWNvICsgdGhpcy5kZWNvICsgcGxhY2Vob2xkZXIgKyB0aGlzLmRlY28gKyB0aGlzLmRlY287XG4gICAgICBzdGFydEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuc3RhcnRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwgJy4qJykpO1xuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwgJy4qJykpO1xuICAgICAgcGFpciA9IG5ldyBQYWlyKHN0YXJ0RmluZCwgZW5kRmluZCwge1xuICAgICAgICB2YWxpZE1hdGNoOiAobWF0Y2gpID0+IHtcbiAgICAgICAgICB2YXIgZjtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuICAgICAgICAgIGYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQobWF0Y2guc3RhcnQoKSwgW2xlZnQsIFwiXFxuXCIsIFwiXFxyXCJdLCAtMSk7XG4gICAgICAgICAgcmV0dXJuIChmID09IG51bGwpIHx8IGYuc3RyICE9PSBsZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKTtcbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGg7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TmVzdGVkTHZsKGluZGV4KSB7XG4gICAgdmFyIGRlcHRoLCBmLCBsZWZ0O1xuICAgIGRlcHRoID0gMDtcbiAgICBsZWZ0ID0gdGhpcy5sZWZ0KCk7XG4gICAgd2hpbGUgKCgoZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCwgW2xlZnQsIFwiXFxuXCIsIFwiXFxyXCJdLCAtMSkpICE9IG51bGwpICYmIGYuc3RyID09PSBsZWZ0KSB7XG4gICAgICBpbmRleCA9IGYucG9zO1xuICAgICAgZGVwdGgrKztcbiAgICB9XG4gICAgcmV0dXJuIGRlcHRoO1xuICB9XG5cbiAgZ2V0T3B0RnJvbUxpbmUobGluZSwgZ2V0UGFkID0gdHJ1ZSkge1xuICAgIHZhciBlbmRQb3MsIHJFbmQsIHJTdGFydCwgcmVzRW5kLCByZXNTdGFydCwgc3RhcnRQb3M7XG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbykpICsgXCIpKFxcXFxzKilcIik7XG4gICAgckVuZCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQodGhpcy5kZWNvKSkgKyBcIikoXFxufCQpXCIpO1xuICAgIHJlc1N0YXJ0ID0gclN0YXJ0LmV4ZWMobGluZSk7XG4gICAgcmVzRW5kID0gckVuZC5leGVjKGxpbmUpO1xuICAgIGlmICgocmVzU3RhcnQgIT0gbnVsbCkgJiYgKHJlc0VuZCAhPSBudWxsKSkge1xuICAgICAgaWYgKGdldFBhZCkge1xuICAgICAgICB0aGlzLnBhZCA9IE1hdGgubWluKHJlc1N0YXJ0WzNdLmxlbmd0aCwgcmVzRW5kWzFdLmxlbmd0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmluZGVudCA9IHJlc1N0YXJ0WzFdLmxlbmd0aDtcbiAgICAgIHN0YXJ0UG9zID0gcmVzU3RhcnQuaW5kZXggKyByZXNTdGFydFsxXS5sZW5ndGggKyByZXNTdGFydFsyXS5sZW5ndGggKyB0aGlzLnBhZDtcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSB0aGlzLnBhZDtcbiAgICAgIHRoaXMud2lkdGggPSBlbmRQb3MgLSBzdGFydFBvcztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWZvcm1hdExpbmVzKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzKHRoaXMucmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zKSwgZmFsc2UpO1xuICB9XG5cbiAgcmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGVjbCwgZWNyLCBlZCwgZmxhZywgb3B0LCByZTEsIHJlMjtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgbXVsdGlsaW5lOiB0cnVlXG4gICAgICB9O1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpO1xuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKTtcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmRlY28pO1xuICAgICAgZmxhZyA9IG9wdGlvbnNbJ211bHRpbGluZSddID8gJ2dtJyA6ICcnO1xuICAgICAgcmUxID0gbmV3IFJlZ0V4cChgXlxcXFxzKiR7ZWNsfSg/OiR7ZWR9KSpcXFxcc3swLCR7dGhpcy5wYWR9fWAsIGZsYWcpO1xuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxcXFxzKiRgLCBmbGFnKTtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmUxLCAnJykucmVwbGFjZShyZTIsICcnKTtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvc0NvbGxlY3Rpb24gfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IG9wdGlvbmFsUHJvbWlzZSB9IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgY2xhc3MgQ2xvc2luZ1Byb21wXG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlLHNlbGVjdGlvbnMpIC0+XG4gICAgQHRpbWVvdXQgPSBudWxsXG4gICAgQF90eXBlZCA9IG51bGxcbiAgICBAc3RhcnRlZCA9IGZhbHNlXG4gICAgQG5iQ2hhbmdlcyA9IDBcbiAgICBAc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uKHNlbGVjdGlvbnMpXG4gIGJlZ2luOiAtPlxuICAgIEBzdGFydGVkID0gdHJ1ZVxuICAgIG9wdGlvbmFsUHJvbWlzZShAYWRkQ2FycmV0cygpKS50aGVuID0+XG4gICAgICBpZiBAY29kZXdhdmUuZWRpdG9yLmNhbkxpc3RlblRvQ2hhbmdlKClcbiAgICAgICAgQHByb3h5T25DaGFuZ2UgPSAoY2g9bnVsbCk9PiBAb25DaGFuZ2UoY2gpXG4gICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuYWRkQ2hhbmdlTGlzdGVuZXIoIEBwcm94eU9uQ2hhbmdlIClcbiAgICAgIHJldHVybiB0aGlzXG4gICAgLnJlc3VsdCgpXG4gIGFkZENhcnJldHM6IC0+XG4gICAgQHJlcGxhY2VtZW50cyA9IEBzZWxlY3Rpb25zLndyYXAoXG4gICAgICBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jYXJyZXRDaGFyICsgQGNvZGV3YXZlLmJyYWtldHMgKyBcIlxcblwiLFxuICAgICAgXCJcXG5cIiArIEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjb2Rld2F2ZS5jYXJyZXRDaGFyICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICApLm1hcCggKHApIC0+IHAuY2FycmV0VG9TZWwoKSApXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhAcmVwbGFjZW1lbnRzKVxuICBpbnZhbGlkVHlwZWQ6IC0+XG4gICAgQF90eXBlZCA9IG51bGxcbiAgb25DaGFuZ2U6IChjaCA9IG51bGwpLT5cbiAgICBAaW52YWxpZFR5cGVkKClcbiAgICBpZiBAc2tpcEV2ZW50KGNoKVxuICAgICAgcmV0dXJuXG4gICAgQG5iQ2hhbmdlcysrXG4gICAgaWYgQHNob3VsZFN0b3AoKVxuICAgICAgQHN0b3AoKVxuICAgICAgQGNsZWFuQ2xvc2UoKVxuICAgIGVsc2VcbiAgICAgIEByZXN1bWUoKVxuICAgICAgXG4gIHNraXBFdmVudDogKGNoKSAtPlxuICAgIHJldHVybiBjaD8gYW5kIGNoLmNoYXJDb2RlQXQoMCkgIT0gMzJcbiAgXG4gIHJlc3VtZTogLT5cbiAgICAjXG4gICAgXG4gIHNob3VsZFN0b3A6IC0+XG4gICAgcmV0dXJuIEB0eXBlZCgpID09IGZhbHNlIG9yIEB0eXBlZCgpLmluZGV4T2YoJyAnKSAhPSAtMVxuICBcbiAgY2xlYW5DbG9zZTogLT5cbiAgICByZXBsYWNlbWVudHMgPSBbXVxuICAgIHNlbGVjdGlvbnMgPSBAZ2V0U2VsZWN0aW9ucygpXG4gICAgZm9yIHNlbCBpbiBzZWxlY3Rpb25zXG4gICAgICBpZiBwb3MgPSBAd2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgICBzdGFydCA9IHNlbFxuICAgICAgZWxzZSBpZiAoZW5kID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSBhbmQgc3RhcnQ/XG4gICAgICAgIHJlcyA9IGVuZC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLmlubmVyVGV4dCgpLnNwbGl0KCcgJylbMF1cbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChlbmQuaW5uZXJTdGFydCxlbmQuaW5uZXJFbmQscmVzKVxuICAgICAgICByZXBsLnNlbGVjdGlvbnMgPSBbc3RhcnRdXG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKHJlcGwpXG4gICAgICAgIHN0YXJ0ID0gbnVsbFxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICBnZXRTZWxlY3Rpb25zOiAtPlxuICAgIHJldHVybiBAY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKClcbiAgc3RvcDogLT5cbiAgICBAc3RhcnRlZCA9IGZhbHNlXG4gICAgY2xlYXJUaW1lb3V0KEB0aW1lb3V0KSBpZiBAdGltZW91dD9cbiAgICBAY29kZXdhdmUuY2xvc2luZ1Byb21wID0gbnVsbCBpZiBAY29kZXdhdmUuY2xvc2luZ1Byb21wID09IHRoaXNcbiAgICBpZiBAcHJveHlPbkNoYW5nZT9cbiAgICAgIEBjb2Rld2F2ZS5lZGl0b3IucmVtb3ZlQ2hhbmdlTGlzdGVuZXIoQHByb3h5T25DaGFuZ2UpXG4gIGNhbmNlbDogLT5cbiAgICBpZiBAdHlwZWQoKSAhPSBmYWxzZVxuICAgICAgQGNhbmNlbFNlbGVjdGlvbnMoQGdldFNlbGVjdGlvbnMoKSlcbiAgICBAc3RvcCgpXG4gIGNhbmNlbFNlbGVjdGlvbnM6IChzZWxlY3Rpb25zKSAtPlxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc3RhcnQgPSBudWxsXG4gICAgZm9yIHNlbCBpbiBzZWxlY3Rpb25zXG4gICAgICBpZiBwb3MgPSBAd2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgICBzdGFydCA9IHBvc1xuICAgICAgZWxzZSBpZiAoZW5kID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSBhbmQgc3RhcnQ/XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ldyBSZXBsYWNlbWVudChzdGFydC5zdGFydCxlbmQuZW5kLEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihzdGFydC5lbmQrMSwgZW5kLnN0YXJ0LTEpKS5zZWxlY3RDb250ZW50KCkpXG4gICAgICAgIHN0YXJ0ID0gbnVsbFxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB0eXBlZDogLT5cbiAgICB1bmxlc3MgQF90eXBlZD9cbiAgICAgIGNwb3MgPSBAY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpXG4gICAgICBpbm5lclN0YXJ0ID0gQHJlcGxhY2VtZW50c1swXS5zdGFydCArIEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aFxuICAgICAgaWYgQGNvZGV3YXZlLmZpbmRQcmV2QnJha2V0KGNwb3Muc3RhcnQpID09IEByZXBsYWNlbWVudHNbMF0uc3RhcnQgYW5kIChpbm5lckVuZCA9IEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChpbm5lclN0YXJ0KSk/IGFuZCBpbm5lckVuZCA+PSBjcG9zLmVuZFxuICAgICAgICBAX3R5cGVkID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGlubmVyU3RhcnQsIGlubmVyRW5kKVxuICAgICAgZWxzZVxuICAgICAgICBAX3R5cGVkID0gZmFsc2VcbiAgICByZXR1cm4gQF90eXBlZFxuICB3aGl0aGluT3BlbkJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAc3RhcnRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT0gdGFyZ2V0VGV4dFxuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG4gIHdoaXRoaW5DbG9zZUJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAZW5kUG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PSB0YXJnZXRUZXh0XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcbiAgc3RhcnRQb3NBdDogKGluZGV4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zKFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLnN0YXJ0ICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIpLFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsxKVxuICAgICAgKS53cmFwcGVkQnkoQGNvZGV3YXZlLmJyYWtldHMsIEBjb2Rld2F2ZS5icmFrZXRzKVxuICBlbmRQb3NBdDogKGluZGV4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zKFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzEpLFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLmVuZCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsyKVxuICAgICAgKS53cmFwcGVkQnkoQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyLCBAY29kZXdhdmUuYnJha2V0cylcblxuZXhwb3J0IGNsYXNzIFNpbXVsYXRlZENsb3NpbmdQcm9tcCBleHRlbmRzIENsb3NpbmdQcm9tcFxuICByZXN1bWU6IC0+XG4gICAgQHNpbXVsYXRlVHlwZSgpXG4gIHNpbXVsYXRlVHlwZTogLT5cbiAgICBjbGVhclRpbWVvdXQoQHRpbWVvdXQpIGlmIEB0aW1lb3V0P1xuICAgIEB0aW1lb3V0ID0gc2V0VGltZW91dCAoPT5cbiAgICAgIEBpbnZhbGlkVHlwZWQoKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGN1ckNsb3NlID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhAcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0uY29weSgpLmFwcGx5T2Zmc2V0KEB0eXBlZCgpLmxlbmd0aCkpXG4gICAgICBpZiBjdXJDbG9zZVxuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LGN1ckNsb3NlLmVuZCx0YXJnZXRUZXh0KVxuICAgICAgICBpZiByZXBsLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KClcbiAgICAgICAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKFtyZXBsXSlcbiAgICAgIGVsc2VcbiAgICAgICAgQHN0b3AoKVxuICAgICAgQG9uVHlwZVNpbXVsYXRlZCgpIGlmIEBvblR5cGVTaW11bGF0ZWQ/XG4gICAgKSwgMlxuICBza2lwRXZlbnQ6IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldFNlbGVjdGlvbnM6IC0+XG4gICAgcmV0dXJuIFtcbiAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKVxuICAgICAgICBAcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0gKyBAdHlwZWQoKS5sZW5ndGhcbiAgICAgIF1cbiAgd2hpdGhpbkNsb3NlQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBlbmRQb3NBdChpKVxuICAgICAgbmV4dCA9IEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldCh0YXJnZXRQb3MuaW5uZXJTdGFydClcbiAgICAgIGlmIG5leHQ/XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpXG4gICAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG5cbkNsb3NpbmdQcm9tcC5uZXdGb3IgPSAoY29kZXdhdmUsc2VsZWN0aW9ucykgLT5cbiAgaWYgY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLHNlbGVjdGlvbnMpXG4gIGVsc2VcbiAgICByZXR1cm4gbmV3IFNpbXVsYXRlZENsb3NpbmdQcm9tcChjb2Rld2F2ZSxzZWxlY3Rpb25zKSIsImltcG9ydCB7XG4gIFBvc0NvbGxlY3Rpb25cbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIG9wdGlvbmFsUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IHZhciBDbG9zaW5nUHJvbXAgPSBjbGFzcyBDbG9zaW5nUHJvbXAge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZTEsIHNlbGVjdGlvbnMpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmUxO1xuICAgIHRoaXMudGltZW91dCA9IG51bGw7XG4gICAgdGhpcy5fdHlwZWQgPSBudWxsO1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMubmJDaGFuZ2VzID0gMDtcbiAgICB0aGlzLnNlbGVjdGlvbnMgPSBuZXcgUG9zQ29sbGVjdGlvbihzZWxlY3Rpb25zKTtcbiAgfVxuXG4gIGJlZ2luKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgcmV0dXJuIG9wdGlvbmFsUHJvbWlzZSh0aGlzLmFkZENhcnJldHMoKSkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKSkge1xuICAgICAgICB0aGlzLnByb3h5T25DaGFuZ2UgPSAoY2ggPSBudWxsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25DaGFuZ2UoY2gpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkucmVzdWx0KCk7XG4gIH1cblxuICBhZGRDYXJyZXRzKCkge1xuICAgIHRoaXMucmVwbGFjZW1lbnRzID0gdGhpcy5zZWxlY3Rpb25zLndyYXAodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgXCJcXG5cIiwgXCJcXG5cIiArIHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKS5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHAuY2FycmV0VG9TZWwoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHModGhpcy5yZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgaW52YWxpZFR5cGVkKCkge1xuICAgIHJldHVybiB0aGlzLl90eXBlZCA9IG51bGw7XG4gIH1cblxuICBvbkNoYW5nZShjaCA9IG51bGwpIHtcbiAgICB0aGlzLmludmFsaWRUeXBlZCgpO1xuICAgIGlmICh0aGlzLnNraXBFdmVudChjaCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5uYkNoYW5nZXMrKztcbiAgICBpZiAodGhpcy5zaG91bGRTdG9wKCkpIHtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYW5DbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bWUoKTtcbiAgICB9XG4gIH1cblxuICBza2lwRXZlbnQoY2gpIHtcbiAgICByZXR1cm4gKGNoICE9IG51bGwpICYmIGNoLmNoYXJDb2RlQXQoMCkgIT09IDMyO1xuICB9XG5cbiAgcmVzdW1lKCkge31cblxuICBcbiAgc2hvdWxkU3RvcCgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlZCgpID09PSBmYWxzZSB8fCB0aGlzLnR5cGVkKCkuaW5kZXhPZignICcpICE9PSAtMTtcbiAgfVxuXG4gIGNsZWFuQ2xvc2UoKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCBwb3MsIHJlcGwsIHJlcGxhY2VtZW50cywgcmVzLCBzZWwsIHNlbGVjdGlvbnMsIHN0YXJ0O1xuICAgIHJlcGxhY2VtZW50cyA9IFtdO1xuICAgIHNlbGVjdGlvbnMgPSB0aGlzLmdldFNlbGVjdGlvbnMoKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdO1xuICAgICAgaWYgKHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKSkge1xuICAgICAgICBzdGFydCA9IHNlbDtcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIChzdGFydCAhPSBudWxsKSkge1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXTtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChlbmQuaW5uZXJTdGFydCwgZW5kLmlubmVyRW5kLCByZXMpO1xuICAgICAgICByZXBsLnNlbGVjdGlvbnMgPSBbc3RhcnRdO1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKTtcbiAgICAgICAgc3RhcnQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9PT0gdGhpcykge1xuICAgICAgdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm94eU9uQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy50eXBlZCgpICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jYW5jZWxTZWxlY3Rpb25zKHRoaXMuZ2V0U2VsZWN0aW9ucygpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgY2FuY2VsU2VsZWN0aW9ucyhzZWxlY3Rpb25zKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCBwb3MsIHJlcGxhY2VtZW50cywgc2VsLCBzdGFydDtcbiAgICByZXBsYWNlbWVudHMgPSBbXTtcbiAgICBzdGFydCA9IG51bGw7XG4gICAgZm9yIChqID0gMCwgbGVuID0gc2VsZWN0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgc2VsID0gc2VsZWN0aW9uc1tqXTtcbiAgICAgIGlmIChwb3MgPSB0aGlzLndoaXRoaW5PcGVuQm91bmRzKHNlbCkpIHtcbiAgICAgICAgc3RhcnQgPSBwb3M7XG4gICAgICB9IGVsc2UgaWYgKChlbmQgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSAmJiAoc3RhcnQgIT0gbnVsbCkpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3IFJlcGxhY2VtZW50KHN0YXJ0LnN0YXJ0LCBlbmQuZW5kLCB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHN0YXJ0LmVuZCArIDEsIGVuZC5zdGFydCAtIDEpKS5zZWxlY3RDb250ZW50KCkpO1xuICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgdHlwZWQoKSB7XG4gICAgdmFyIGNwb3MsIGlubmVyRW5kLCBpbm5lclN0YXJ0O1xuICAgIGlmICh0aGlzLl90eXBlZCA9PSBudWxsKSB7XG4gICAgICBjcG9zID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCk7XG4gICAgICBpbm5lclN0YXJ0ID0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoO1xuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuZmluZFByZXZCcmFrZXQoY3Bvcy5zdGFydCkgPT09IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICYmICgoaW5uZXJFbmQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGlubmVyU3RhcnQpKSAhPSBudWxsKSAmJiBpbm5lckVuZCA+PSBjcG9zLmVuZCkge1xuICAgICAgICB0aGlzLl90eXBlZCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdHlwZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkO1xuICB9XG5cbiAgd2hpdGhpbk9wZW5Cb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHQ7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV07XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLnN0YXJ0UG9zQXQoaSk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB3aGl0aGluQ2xvc2VCb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHQ7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV07XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLmVuZFBvc0F0KGkpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGFydFBvc0F0KGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSkpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMsIHRoaXMuY29kZXdhdmUuYnJha2V0cyk7XG4gIH1cblxuICBlbmRQb3NBdChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAyKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLCB0aGlzLmNvZGV3YXZlLmJyYWtldHMpO1xuICB9XG5cbn07XG5cbmV4cG9ydCB2YXIgU2ltdWxhdGVkQ2xvc2luZ1Byb21wID0gY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wIHtcbiAgcmVzdW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNpbXVsYXRlVHlwZSgpO1xuICB9XG5cbiAgc2ltdWxhdGVUeXBlKCkge1xuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgoKSA9PiB7XG4gICAgICB2YXIgY3VyQ2xvc2UsIHJlcGwsIHRhcmdldFRleHQ7XG4gICAgICB0aGlzLmludmFsaWRUeXBlZCgpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgY3VyQ2xvc2UgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyh0aGlzLnJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdLmNvcHkoKS5hcHBseU9mZnNldCh0aGlzLnR5cGVkKCkubGVuZ3RoKSk7XG4gICAgICBpZiAoY3VyQ2xvc2UpIHtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChjdXJDbG9zZS5zdGFydCwgY3VyQ2xvc2UuZW5kLCB0YXJnZXRUZXh0KTtcbiAgICAgICAgaWYgKHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KCkpIHtcbiAgICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uVHlwZVNpbXVsYXRlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uVHlwZVNpbXVsYXRlZCgpO1xuICAgICAgfVxuICAgIH0pLCAyKTtcbiAgfVxuXG4gIHNraXBFdmVudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRTZWxlY3Rpb25zKCkge1xuICAgIHJldHVybiBbdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCksIHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0gKyB0aGlzLnR5cGVkKCkubGVuZ3RoXTtcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXh0LCByZWYsIHJlcGwsIHRhcmdldFBvcztcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSk7XG4gICAgICBuZXh0ID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldCh0YXJnZXRQb3MuaW5uZXJTdGFydCk7XG4gICAgICBpZiAobmV4dCAhPSBudWxsKSB7XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpO1xuICAgICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSkge1xuICAgICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG5cbkNsb3NpbmdQcm9tcC5uZXdGb3IgPSBmdW5jdGlvbihjb2Rld2F2ZSwgc2VsZWN0aW9ucykge1xuICBpZiAoY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFNpbXVsYXRlZENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucyk7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBDbWRGaW5kZXJcbiAgY29uc3RydWN0b3I6IChuYW1lcywgb3B0aW9ucykgLT5cbiAgICBpZiB0eXBlb2YgbmFtZXMgPT0gJ3N0cmluZydcbiAgICAgIG5hbWVzID0gW25hbWVzXVxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsXG4gICAgICBuYW1lc3BhY2VzOiBbXVxuICAgICAgcGFyZW50Q29udGV4dDogbnVsbFxuICAgICAgY29udGV4dDogbnVsbFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzXG4gICAgICBtdXN0RXhlY3V0ZTogdHJ1ZVxuICAgICAgdXNlRGV0ZWN0b3JzOiB0cnVlXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWVcbiAgICAgIGluc3RhbmNlOiBudWxsXG4gICAgICBjb2Rld2F2ZTogbnVsbFxuICAgIH1cbiAgICBAbmFtZXMgPSBuYW1lc1xuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoQGNvZGV3YXZlKVxuICAgIGlmIEBwYXJlbnRDb250ZXh0P1xuICAgICAgQGNvbnRleHQucGFyZW50ID0gQHBhcmVudENvbnRleHRcbiAgICBpZiBAbmFtZXNwYWNlcz9cbiAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMoQG5hbWVzcGFjZXMpXG4gIGZpbmQ6IC0+XG4gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAgIEBjbWQgPSBAZmluZEluKEByb290KVxuICAgIHJldHVybiBAY21kXG4jICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4jICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiMgICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4jICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzOiAtPlxuICAgIHBhdGhzID0ge31cbiAgICBmb3IgbmFtZSBpbiBAbmFtZXMgXG4gICAgICBbc3BhY2UscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgc3BhY2U/IGFuZCAhKHNwYWNlIGluIEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgICAgdW5sZXNzIHNwYWNlIG9mIHBhdGhzIFxuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpXG4gICAgcmV0dXJuIHBhdGhzXG4gIGFwcGx5U3BhY2VPbk5hbWVzOiAobmFtZXNwYWNlKSAtPlxuICAgIFtzcGFjZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSx0cnVlKVxuICAgIEBuYW1lcy5tYXAoIChuYW1lKSAtPlxuICAgICAgW2N1cl9zcGFjZSxjdXJfcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgY3VyX3NwYWNlPyBhbmQgY3VyX3NwYWNlID09IHNwYWNlXG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdFxuICAgICAgaWYgcmVzdD9cbiAgICAgICAgbmFtZSA9IHJlc3QgKyAnOicgKyBuYW1lXG4gICAgICByZXR1cm4gbmFtZVxuICAgIClcbiAgZ2V0RGlyZWN0TmFtZXM6IC0+XG4gICAgcmV0dXJuIChuIGZvciBuIGluIEBuYW1lcyB3aGVuIG4uaW5kZXhPZihcIjpcIikgPT0gLTEpXG4gIHRyaWdnZXJEZXRlY3RvcnM6IC0+XG4gICAgaWYgQHVzZURldGVjdG9ycyBcbiAgICAgIEB1c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcG9zaWJpbGl0aWVzID0gbmV3IENtZEZpbmRlcihAY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKVxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoXG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXVxuICAgICAgICBmb3IgZGV0ZWN0b3IgaW4gY21kLmRldGVjdG9ycyBcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcylcbiAgICAgICAgICBpZiByZXM/XG4gICAgICAgICAgICBAY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcylcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICAgICAgaSsrXG4gIGZpbmRJbjogKGNtZCxwYXRoID0gbnVsbCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIG51bGxcbiAgICBiZXN0ID0gQGJlc3RJblBvc2liaWxpdGllcyhAZmluZFBvc2liaWxpdGllcygpKVxuICAgIGlmIGJlc3Q/XG4gICAgICByZXR1cm4gYmVzdFxuICBmaW5kUG9zaWJpbGl0aWVzOiAtPlxuICAgIHVubGVzcyBAcm9vdD9cbiAgICAgIHJldHVybiBbXVxuICAgIEByb290LmluaXQoKVxuICAgIHBvc2liaWxpdGllcyA9IFtdXG4gICAgaWYgQGNvZGV3YXZlPy5pbkluc3RhbmNlPy5jbWQgPT0gQHJvb3RcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQoQGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKCdpbl9pbnN0YW5jZScpKVxuICAgIGZvciBzcGFjZSwgbmFtZXMgb2YgQGdldE5hbWVzV2l0aFBhdGhzKClcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQoQGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKHNwYWNlLCBuYW1lcykpXG4gICAgZm9yIG5zcGMgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICBbbnNwY05hbWUscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLHRydWUpXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KEBnZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChuc3BjTmFtZSwgQGFwcGx5U3BhY2VPbk5hbWVzKG5zcGMpKSlcbiAgICBmb3IgbmFtZSBpbiBAZ2V0RGlyZWN0TmFtZXMoKVxuICAgICAgZGlyZWN0ID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgICBpZiBAY21kSXNWYWxpZChkaXJlY3QpXG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdClcbiAgICBpZiBAdXNlRmFsbGJhY2tzXG4gICAgICBmYWxsYmFjayA9IEByb290LmdldENtZCgnZmFsbGJhY2snKVxuICAgICAgaWYgQGNtZElzVmFsaWQoZmFsbGJhY2spXG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGZhbGxiYWNrKVxuICAgIEBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXNcbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzXG4gIGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kOiAoY21kTmFtZSwgbmFtZXMgPSBAbmFtZXMpIC0+XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG4gICAgbmV4dHMgPSBAZ2V0Q21kRm9sbG93QWxpYXMoY21kTmFtZSlcbiAgICBmb3IgbmV4dCBpbiBuZXh0c1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKG5hbWVzLCB7cGFyZW50OiB0aGlzLCByb290OiBuZXh0fSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgIHBvc2liaWxpdGllc1xuICBnZXRDbWRGb2xsb3dBbGlhczogKG5hbWUpIC0+XG4gICAgY21kID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgaWYgY21kPyBcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5hbGlhc09mP1xuICAgICAgICByZXR1cm4gW2NtZCxjbWQuZ2V0QWxpYXNlZCgpXVxuICAgICAgcmV0dXJuIFtjbWRdXG4gICAgcmV0dXJuIFtjbWRdXG4gIGNtZElzVmFsaWQ6IChjbWQpIC0+XG4gICAgdW5sZXNzIGNtZD9cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIGNtZC5uYW1lICE9ICdmYWxsYmFjaycgJiYgY21kIGluIEBhbmNlc3RvcnMoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuICFAbXVzdEV4ZWN1dGUgb3IgQGNtZElzRXhlY3V0YWJsZShjbWQpXG4gIGFuY2VzdG9yczogLT5cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGNtZElzRXhlY3V0YWJsZTogKGNtZCkgLT5cbiAgICBuYW1lcyA9IEBnZXREaXJlY3ROYW1lcygpXG4gICAgaWYgbmFtZXMubGVuZ3RoID09IDFcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gIGNtZFNjb3JlOiAoY21kKSAtPlxuICAgIHNjb3JlID0gY21kLmRlcHRoXG4gICAgaWYgY21kLm5hbWUgPT0gJ2ZhbGxiYWNrJyBcbiAgICAgICAgc2NvcmUgLT0gMTAwMFxuICAgIHJldHVybiBzY29yZVxuICBiZXN0SW5Qb3NpYmlsaXRpZXM6IChwb3NzKSAtPlxuICAgIGlmIHBvc3MubGVuZ3RoID4gMFxuICAgICAgYmVzdCA9IG51bGxcbiAgICAgIGJlc3RTY29yZSA9IG51bGxcbiAgICAgIGZvciBwIGluIHBvc3NcbiAgICAgICAgc2NvcmUgPSBAY21kU2NvcmUocClcbiAgICAgICAgaWYgIWJlc3Q/IG9yIHNjb3JlID49IGJlc3RTY29yZVxuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlXG4gICAgICAgICAgYmVzdCA9IHBcbiAgICAgIHJldHVybiBiZXN0OyIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBOYW1lc3BhY2VIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBDbWRGaW5kZXIgPSBjbGFzcyBDbWRGaW5kZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lcywgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXTtcbiAgICB9XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICBuYW1lc3BhY2VzOiBbXSxcbiAgICAgIHBhcmVudENvbnRleHQ6IG51bGwsXG4gICAgICBjb250ZXh0OiBudWxsLFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzLFxuICAgICAgbXVzdEV4ZWN1dGU6IHRydWUsXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWUsXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWUsXG4gICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfTtcbiAgICB0aGlzLm5hbWVzID0gbmFtZXM7XG4gICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2UgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcy5jb2Rld2F2ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmVudENvbnRleHQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMucGFyZW50Q29udGV4dDtcbiAgICB9XG4gICAgaWYgKHRoaXMubmFtZXNwYWNlcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyh0aGlzLm5hbWVzcGFjZXMpO1xuICAgIH1cbiAgfVxuXG4gIGZpbmQoKSB7XG4gICAgdGhpcy50cmlnZ2VyRGV0ZWN0b3JzKCk7XG4gICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRJbih0aGlzLnJvb3QpO1xuICAgIHJldHVybiB0aGlzLmNtZDtcbiAgfVxuXG4gIC8vICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4gIC8vICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiAgLy8gICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4gIC8vICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzKCkge1xuICAgIHZhciBqLCBsZW4sIG5hbWUsIHBhdGhzLCByZWYsIHJlc3QsIHNwYWNlO1xuICAgIHBhdGhzID0ge307XG4gICAgcmVmID0gdGhpcy5uYW1lcztcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5hbWUgPSByZWZbal07XG4gICAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG4gICAgICBpZiAoKHNwYWNlICE9IG51bGwpICYmICEoaW5kZXhPZi5jYWxsKHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHNwYWNlKSA+PSAwKSkge1xuICAgICAgICBpZiAoIShzcGFjZSBpbiBwYXRocykpIHtcbiAgICAgICAgICBwYXRoc1tzcGFjZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBwYXRoc1tzcGFjZV0ucHVzaChyZXN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGhzO1xuICB9XG5cbiAgYXBwbHlTcGFjZU9uTmFtZXMobmFtZXNwYWNlKSB7XG4gICAgdmFyIHJlc3QsIHNwYWNlO1xuICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lc3BhY2UsIHRydWUpO1xuICAgIHJldHVybiB0aGlzLm5hbWVzLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgY3VyX3Jlc3QsIGN1cl9zcGFjZTtcbiAgICAgIFtjdXJfc3BhY2UsIGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpO1xuICAgICAgaWYgKChjdXJfc3BhY2UgIT0gbnVsbCkgJiYgY3VyX3NwYWNlID09PSBzcGFjZSkge1xuICAgICAgICBuYW1lID0gY3VyX3Jlc3Q7XG4gICAgICB9XG4gICAgICBpZiAocmVzdCAhPSBudWxsKSB7XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RGlyZWN0TmFtZXMoKSB7XG4gICAgdmFyIG47XG4gICAgcmV0dXJuIChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgIHJlZiA9IHRoaXMubmFtZXM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgbiA9IHJlZltqXTtcbiAgICAgICAgaWYgKG4uaW5kZXhPZihcIjpcIikgPT09IC0xKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9KS5jYWxsKHRoaXMpO1xuICB9XG5cbiAgdHJpZ2dlckRldGVjdG9ycygpIHtcbiAgICB2YXIgY21kLCBkZXRlY3RvciwgaSwgaiwgbGVuLCBwb3NpYmlsaXRpZXMsIHJlZiwgcmVzLCByZXN1bHRzO1xuICAgIGlmICh0aGlzLnVzZURldGVjdG9ycykge1xuICAgICAgdGhpcy51c2VEZXRlY3RvcnMgPSBmYWxzZTtcbiAgICAgIHBvc2liaWxpdGllcyA9IG5ldyBDbWRGaW5kZXIodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpO1xuICAgICAgaSA9IDA7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICB3aGlsZSAoaSA8IHBvc2liaWxpdGllcy5sZW5ndGgpIHtcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldO1xuICAgICAgICByZWYgPSBjbWQuZGV0ZWN0b3JzO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICBkZXRlY3RvciA9IHJlZltqXTtcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcyk7XG4gICAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyhyZXMpO1xuICAgICAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKHJlcywge1xuICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0cy5wdXNoKGkrKyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICBmaW5kSW4oY21kLCBwYXRoID0gbnVsbCkge1xuICAgIHZhciBiZXN0O1xuICAgIGlmIChjbWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGJlc3QgPSB0aGlzLmJlc3RJblBvc2liaWxpdGllcyh0aGlzLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgaWYgKGJlc3QgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgfVxuICB9XG5cbiAgZmluZFBvc2liaWxpdGllcygpIHtcbiAgICB2YXIgZGlyZWN0LCBmYWxsYmFjaywgaiwgaywgbGVuLCBsZW4xLCBuYW1lLCBuYW1lcywgbnNwYywgbnNwY05hbWUsIHBvc2liaWxpdGllcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZXN0LCBzcGFjZTtcbiAgICBpZiAodGhpcy5yb290ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgdGhpcy5yb290LmluaXQoKTtcbiAgICBwb3NpYmlsaXRpZXMgPSBbXTtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gKHJlZjEgPSByZWYuaW5JbnN0YW5jZSkgIT0gbnVsbCA/IHJlZjEuY21kIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gdGhpcy5yb290KSB7XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoJ2luX2luc3RhbmNlJykpO1xuICAgIH1cbiAgICByZWYyID0gdGhpcy5nZXROYW1lc1dpdGhQYXRocygpO1xuICAgIGZvciAoc3BhY2UgaW4gcmVmMikge1xuICAgICAgbmFtZXMgPSByZWYyW3NwYWNlXTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChzcGFjZSwgbmFtZXMpKTtcbiAgICB9XG4gICAgcmVmMyA9IHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCk7XG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmMy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbnNwYyA9IHJlZjNbal07XG4gICAgICBbbnNwY05hbWUsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobnNwYywgdHJ1ZSk7XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQobnNwY05hbWUsIHRoaXMuYXBwbHlTcGFjZU9uTmFtZXMobnNwYykpKTtcbiAgICB9XG4gICAgcmVmNCA9IHRoaXMuZ2V0RGlyZWN0TmFtZXMoKTtcbiAgICBmb3IgKGsgPSAwLCBsZW4xID0gcmVmNC5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgIG5hbWUgPSByZWY0W2tdO1xuICAgICAgZGlyZWN0ID0gdGhpcy5yb290LmdldENtZChuYW1lKTtcbiAgICAgIGlmICh0aGlzLmNtZElzVmFsaWQoZGlyZWN0KSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy51c2VGYWxsYmFja3MpIHtcbiAgICAgIGZhbGxiYWNrID0gdGhpcy5yb290LmdldENtZCgnZmFsbGJhY2snKTtcbiAgICAgIGlmICh0aGlzLmNtZElzVmFsaWQoZmFsbGJhY2spKSB7XG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGZhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXM7XG4gICAgcmV0dXJuIHBvc2liaWxpdGllcztcbiAgfVxuXG4gIGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKGNtZE5hbWUsIG5hbWVzID0gdGhpcy5uYW1lcykge1xuICAgIHZhciBqLCBsZW4sIG5leHQsIG5leHRzLCBwb3NpYmlsaXRpZXM7XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG4gICAgbmV4dHMgPSB0aGlzLmdldENtZEZvbGxvd0FsaWFzKGNtZE5hbWUpO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IG5leHRzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuZXh0ID0gbmV4dHNbal07XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtcbiAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICByb290OiBuZXh0XG4gICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgIH1cbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzO1xuICB9XG5cbiAgZ2V0Q21kRm9sbG93QWxpYXMobmFtZSkge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gdGhpcy5yb290LmdldENtZChuYW1lKTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gW2NtZCwgY21kLmdldEFsaWFzZWQoKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gW2NtZF07XG4gICAgfVxuICAgIHJldHVybiBbY21kXTtcbiAgfVxuXG4gIGNtZElzVmFsaWQoY21kKSB7XG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChjbWQubmFtZSAhPT0gJ2ZhbGxiYWNrJyAmJiBpbmRleE9mLmNhbGwodGhpcy5hbmNlc3RvcnMoKSwgY21kKSA+PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAhdGhpcy5tdXN0RXhlY3V0ZSB8fCB0aGlzLmNtZElzRXhlY3V0YWJsZShjbWQpO1xuICB9XG5cbiAgYW5jZXN0b3JzKCkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdGhpcy5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY21kSXNFeGVjdXRhYmxlKGNtZCkge1xuICAgIHZhciBuYW1lcztcbiAgICBuYW1lcyA9IHRoaXMuZ2V0RGlyZWN0TmFtZXMoKTtcbiAgICBpZiAobmFtZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGVXaXRoTmFtZShuYW1lc1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNtZFNjb3JlKGNtZCkge1xuICAgIHZhciBzY29yZTtcbiAgICBzY29yZSA9IGNtZC5kZXB0aDtcbiAgICBpZiAoY21kLm5hbWUgPT09ICdmYWxsYmFjaycpIHtcbiAgICAgIHNjb3JlIC09IDEwMDA7XG4gICAgfVxuICAgIHJldHVybiBzY29yZTtcbiAgfVxuXG4gIGJlc3RJblBvc2liaWxpdGllcyhwb3NzKSB7XG4gICAgdmFyIGJlc3QsIGJlc3RTY29yZSwgaiwgbGVuLCBwLCBzY29yZTtcbiAgICBpZiAocG9zcy5sZW5ndGggPiAwKSB7XG4gICAgICBiZXN0ID0gbnVsbDtcbiAgICAgIGJlc3RTY29yZSA9IG51bGw7XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBwb3NzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSBwb3NzW2pdO1xuICAgICAgICBzY29yZSA9IHRoaXMuY21kU2NvcmUocCk7XG4gICAgICAgIGlmICgoYmVzdCA9PSBudWxsKSB8fCBzY29yZSA+PSBiZXN0U2NvcmUpIHtcbiAgICAgICAgICBiZXN0U2NvcmUgPSBzY29yZTtcbiAgICAgICAgICBiZXN0ID0gcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5pbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY21kLEBjb250ZXh0KSAtPlxuICBcbiAgaW5pdDogLT5cbiAgICB1bmxlc3MgQGlzRW1wdHkoKSBvciBAaW5pdGVkXG4gICAgICBAaW5pdGVkID0gdHJ1ZVxuICAgICAgQF9nZXRDbWRPYmooKVxuICAgICAgQF9pbml0UGFyYW1zKClcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIEBjbWRPYmouaW5pdCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgc2V0UGFyYW06KG5hbWUsdmFsKS0+XG4gICAgQG5hbWVkW25hbWVdID0gdmFsXG4gIHB1c2hQYXJhbToodmFsKS0+XG4gICAgQHBhcmFtcy5wdXNoKHZhbClcbiAgZ2V0Q29udGV4dDogLT5cbiAgICB1bmxlc3MgQGNvbnRleHQ/XG4gICAgICBAY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICByZXR1cm4gQGNvbnRleHQgb3IgbmV3IENvbnRleHQoKVxuICBnZXRGaW5kZXI6IChjbWROYW1lKS0+XG4gICAgZmluZGVyID0gQGdldENvbnRleHQoKS5nZXRGaW5kZXIoY21kTmFtZSxuYW1lc3BhY2VzOkBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRDbWRPYmo6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIEBjbWQuaW5pdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5jbHM/XG4gICAgICAgIEBjbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKVxuICAgICAgICByZXR1cm4gQGNtZE9ialxuICBfaW5pdFBhcmFtczogLT5cbiAgICBAbmFtZWQgPSBAZ2V0RGVmYXVsdHMoKVxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICByZXR1cm4gW11cbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQGNtZD9cbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIHJldHVybiBAY21kLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJlcyA9IHt9XG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGNtZC5kZWZhdWx0cylcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBjbWRPYmouZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJldHVybiByZXNcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIHJldHVybiBAYWxpYXNlZENtZCBvciBudWxsXG4gIGdldEFsaWFzZWRGaW5hbDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGFsaWFzZWRGaW5hbENtZD9cbiAgICAgICAgcmV0dXJuIEBhbGlhc2VkRmluYWxDbWQgb3IgbnVsbFxuICAgICAgaWYgQGNtZC5hbGlhc09mP1xuICAgICAgICBhbGlhc2VkID0gQGNtZFxuICAgICAgICB3aGlsZSBhbGlhc2VkPyBhbmQgYWxpYXNlZC5hbGlhc09mP1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcihAZ2V0RmluZGVyKEBhbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG4gICAgICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICAgICAgQGFsaWFzZWRDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIEBhbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIHJldHVybiBhbGlhc2VkXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBhbGlhc09mXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPcHRpb25zP1xuICAgICAgICByZXR1cm4gQGNtZE9wdGlvbnNcbiAgICAgIG9wdCA9IEBjbWQuX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxAY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIEBjbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIG9wdGlvbnM/IGFuZCBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBnZXRQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIG5hbWVzID0gW25hbWVzXSBpZiAodHlwZW9mIG5hbWVzIGluIFsnc3RyaW5nJywnbnVtYmVyJ10pXG4gICAgZm9yIG4gaW4gbmFtZXNcbiAgICAgIHJldHVybiBAbmFtZWRbbl0gaWYgQG5hbWVkW25dP1xuICAgICAgcmV0dXJuIEBwYXJhbXNbbl0gaWYgQHBhcmFtc1tuXT9cbiAgICByZXR1cm4gZGVmVmFsXG4gIGdldEJvb2xQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIGZhbHNlVmFscyA9IFtcIlwiLFwiMFwiLFwiZmFsc2VcIixcIm5vXCIsXCJub25lXCIsZmFsc2UsbnVsbCwwXVxuICAgIHZhbCA9IEBnZXRQYXJhbShuYW1lcywgZGVmVmFsKVxuICAgICFmYWxzZVZhbHMuaW5jbHVkZXModmFsKVxuICBhbmNlc3RvckNtZHM6IC0+XG4gICAgaWYgQGNvbnRleHQuY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvbnRleHQuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICByZXR1cm4gW11cbiAgYW5jZXN0b3JDbWRzQW5kU2VsZjogLT5cbiAgICByZXR1cm4gQGFuY2VzdG9yQ21kcygpLmNvbmNhdChbQGNtZF0pXG4gIHJ1bkV4ZWN1dGVGdW5jdDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmV0dXJuIEBjbWRPYmouZXhlY3V0ZSgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZEZpbmFsKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmV4ZWN1dGVGdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlRnVuY3QodGhpcylcbiAgcmF3UmVzdWx0OiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5yZXN1bHQoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWRGaW5hbCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5yZXN1bHRGdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRGdW5jdCh0aGlzKVxuICAgICAgaWYgY21kLnJlc3VsdFN0cj9cbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRTdHJcbiAgcmVzdWx0OiAtPiBcbiAgICBAaW5pdCgpXG4gICAgaWYgQHJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIGlmIChyZXMgPSBAcmF3UmVzdWx0KCkpP1xuICAgICAgICByZXMgPSBAZm9ybWF0SW5kZW50KHJlcylcbiAgICAgICAgaWYgcmVzLmxlbmd0aCA+IDAgYW5kIEBnZXRPcHRpb24oJ3BhcnNlJyx0aGlzKSBcbiAgICAgICAgICBwYXJzZXIgPSBAZ2V0UGFyc2VyRm9yVGV4dChyZXMpXG4gICAgICAgICAgcmVzID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgICAgaWYgYWx0ZXJGdW5jdCA9IEBnZXRPcHRpb24oJ2FsdGVyUmVzdWx0Jyx0aGlzKVxuICAgICAgICAgIHJlcyA9IGFsdGVyRnVuY3QocmVzLHRoaXMpXG4gICAgICAgIHJldHVybiByZXNcbiAgZ2V0UGFyc2VyRm9yVGV4dDogKHR4dD0nJykgLT5cbiAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIodHh0KSwge2luSW5zdGFuY2U6dGhpc30pXG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2VcbiAgICByZXR1cm4gcGFyc2VyXG4gIGdldEluZGVudDogLT5cbiAgICByZXR1cm4gMFxuICBmb3JtYXRJbmRlbnQ6ICh0ZXh0KSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywnICAnKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gIGFwcGx5SW5kZW50OiAodGV4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmluZGVudE5vdEZpcnN0KHRleHQsQGdldEluZGVudCgpLFwiIFwiKSIsImltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgQ29kZXdhdmVcbn0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5cbmltcG9ydCB7XG4gIFRleHRQYXJzZXJcbn0gZnJvbSAnLi9UZXh0UGFyc2VyJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgdmFyIENtZEluc3RhbmNlID0gY2xhc3MgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3RvcihjbWQxLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jbWQgPSBjbWQxO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICghKHRoaXMuaXNFbXB0eSgpIHx8IHRoaXMuaW5pdGVkKSkge1xuICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZ2V0Q21kT2JqKCk7XG4gICAgICB0aGlzLl9pbml0UGFyYW1zKCk7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNtZE9iai5pbml0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0UGFyYW0obmFtZSwgdmFsKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSB2YWw7XG4gIH1cblxuICBwdXNoUGFyYW0odmFsKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnB1c2godmFsKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IG5ldyBDb250ZXh0KCk7XG4gIH1cblxuICBnZXRGaW5kZXIoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXI7XG4gICAgZmluZGVyID0gdGhpcy5nZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pO1xuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXM7XG4gICAgcmV0dXJuIGZpbmRlcjtcbiAgfVxuXG4gIF9nZXRDbWRPYmooKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jbWQuaW5pdCgpO1xuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5jbHMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNtZE9iaiA9IG5ldyBjbWQuY2xzKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmo7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2luaXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWQgPSB0aGlzLmdldERlZmF1bHRzKCk7XG4gIH1cblxuICBfZ2V0UGFyZW50TmFtZXNwYWNlcygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLmNtZCAhPSBudWxsO1xuICB9XG5cbiAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgdmFyIGFsaWFzZWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jbWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgdmFyIGFsaWFzZWQsIHJlcztcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgcmVzID0ge307XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCBhbGlhc2VkLmdldERlZmF1bHRzKCkpO1xuICAgICAgfVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kLmRlZmF1bHRzKTtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZE9iai5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZCgpIHtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5hbGlhc2VkQ21kIHx8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZEZpbmFsKCkge1xuICAgIHZhciBhbGlhc2VkO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkRmluYWxDbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGlhc2VkRmluYWxDbWQgfHwgbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgYWxpYXNlZCA9IHRoaXMuY21kO1xuICAgICAgICB3aGlsZSAoKGFsaWFzZWQgIT0gbnVsbCkgJiYgKGFsaWFzZWQuYWxpYXNPZiAhPSBudWxsKSkge1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcih0aGlzLmdldEZpbmRlcih0aGlzLmFsdGVyQWxpYXNPZihhbGlhc2VkLmFsaWFzT2YpKSk7XG4gICAgICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmFsaWFzZWRDbWQgPSBhbGlhc2VkIHx8IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgfHwgZmFsc2U7XG4gICAgICAgIHJldHVybiBhbGlhc2VkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFsdGVyQWxpYXNPZihhbGlhc09mKSB7XG4gICAgcmV0dXJuIGFsaWFzT2Y7XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHZhciBvcHQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPcHRpb25zO1xuICAgICAgfVxuICAgICAgb3B0ID0gdGhpcy5jbWQuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKTtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmNtZE9iai5nZXRPcHRpb25zKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbWRPcHRpb25zID0gb3B0O1xuICAgICAgcmV0dXJuIG9wdDtcbiAgICB9XG4gIH1cblxuICBnZXRPcHRpb24oa2V5KSB7XG4gICAgdmFyIG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIGlmICgob3B0aW9ucyAhPSBudWxsKSAmJiBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICBnZXRQYXJhbShuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBpLCBsZW4sIG4sIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0eXBlb2YgbmFtZXMpID09PSAnc3RyaW5nJyB8fCByZWYgPT09ICdudW1iZXInKSkge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbiA9IG5hbWVzW2ldO1xuICAgICAgaWYgKHRoaXMubmFtZWRbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lZFtuXTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBhcmFtc1tuXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtc1tuXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlZlZhbDtcbiAgfVxuXG4gIGdldEJvb2xQYXJhbShuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBmYWxzZVZhbHMsIHZhbDtcbiAgICBmYWxzZVZhbHMgPSBbXCJcIiwgXCIwXCIsIFwiZmFsc2VcIiwgXCJub1wiLCBcIm5vbmVcIiwgZmFsc2UsIG51bGwsIDBdO1xuICAgIHZhbCA9IHRoaXMuZ2V0UGFyYW0obmFtZXMsIGRlZlZhbCk7XG4gICAgcmV0dXJuICFmYWxzZVZhbHMuaW5jbHVkZXModmFsKTtcbiAgfVxuXG4gIGFuY2VzdG9yQ21kcygpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBhbmNlc3RvckNtZHNBbmRTZWxmKCkge1xuICAgIHJldHVybiB0aGlzLmFuY2VzdG9yQ21kcygpLmNvbmNhdChbdGhpcy5jbWRdKTtcbiAgfVxuXG4gIHJ1bkV4ZWN1dGVGdW5jdCgpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmouZXhlY3V0ZSgpO1xuICAgICAgfVxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmV4ZWN1dGVGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZUZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJhd1Jlc3VsdCgpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0KCk7XG4gICAgICB9XG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQucmVzdWx0RnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKGNtZC5yZXN1bHRTdHIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0cjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdmFyIGFsdGVyRnVuY3QsIHBhcnNlciwgcmVzO1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgIGlmICgocmVzID0gdGhpcy5yYXdSZXN1bHQoKSkgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSB0aGlzLmZvcm1hdEluZGVudChyZXMpO1xuICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDAgJiYgdGhpcy5nZXRPcHRpb24oJ3BhcnNlJywgdGhpcykpIHtcbiAgICAgICAgICBwYXJzZXIgPSB0aGlzLmdldFBhcnNlckZvclRleHQocmVzKTtcbiAgICAgICAgICByZXMgPSBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWx0ZXJGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdhbHRlclJlc3VsdCcsIHRoaXMpKSB7XG4gICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyc2VyRm9yVGV4dCh0eHQgPSAnJykge1xuICAgIHZhciBwYXJzZXI7XG4gICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKHR4dCksIHtcbiAgICAgIGluSW5zdGFuY2U6IHRoaXNcbiAgICB9KTtcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICByZXR1cm4gcGFyc2VyO1xuICB9XG5cbiAgZ2V0SW5kZW50KCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZm9ybWF0SW5kZW50KHRleHQpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywgJyAgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5SW5kZW50KHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmluZGVudE5vdEZpcnN0KHRleHQsIHRoaXMuZ2V0SW5kZW50KCksIFwiIFwiKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUHJvY2VzcyB9IGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSB9IGZyb20gJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcic7XG5pbXBvcnQgeyBQb3NDb2xsZWN0aW9uIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQ2xvc2luZ1Byb21wIH0gZnJvbSAnLi9DbG9zaW5nUHJvbXAnO1xuXG5leHBvcnQgY2xhc3MgQ29kZXdhdmVcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBvcHRpb25zID0ge30pIC0+XG4gICAgQ29kZXdhdmUuaW5pdCgpXG4gICAgQG1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nXG4gICAgQHZhcnMgPSB7fVxuICAgIFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ2JyYWtldHMnIDogJ35+JyxcbiAgICAgICdkZWNvJyA6ICd+JyxcbiAgICAgICdjbG9zZUNoYXInIDogJy8nLFxuICAgICAgJ25vRXhlY3V0ZUNoYXInIDogJyEnLFxuICAgICAgJ2NhcnJldENoYXInIDogJ3wnLFxuICAgICAgJ2NoZWNrQ2FycmV0JyA6IHRydWUsXG4gICAgICAnaW5JbnN0YW5jZScgOiBudWxsXG4gICAgfVxuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIFxuICAgIEBuZXN0ZWQgPSBpZiBAcGFyZW50PyB0aGVuIEBwYXJlbnQubmVzdGVkKzEgZWxzZSAwXG4gICAgXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgQGVkaXRvci5iaW5kZWRUbyh0aGlzKSBpZiBAZWRpdG9yP1xuICAgIFxuICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQodGhpcylcbiAgICBpZiBAaW5JbnN0YW5jZT9cbiAgICAgIEBjb250ZXh0LnBhcmVudCA9IEBpbkluc3RhbmNlLmNvbnRleHRcblxuICAgIEBsb2dnZXIgPSBuZXcgTG9nZ2VyKClcblxuICBvbkFjdGl2YXRpb25LZXk6IC0+XG4gICAgQHByb2Nlc3MgPSBuZXcgUHJvY2VzcygpXG4gICAgQGxvZ2dlci5sb2coJ2FjdGl2YXRpb24ga2V5JylcbiAgICBAcnVuQXRDdXJzb3JQb3MoKS50aGVuID0+XG4gICAgICBAcHJvY2VzcyA9IG51bGxcbiAgcnVuQXRDdXJzb3JQb3M6IC0+XG4gICAgaWYgQGVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICAgIEBydW5BdE11bHRpUG9zKEBlZGl0b3IuZ2V0TXVsdGlTZWwoKSlcbiAgICBlbHNlXG4gICAgICBAcnVuQXRQb3MoQGVkaXRvci5nZXRDdXJzb3JQb3MoKSlcbiAgcnVuQXRQb3M6IChwb3MpLT5cbiAgICBAcnVuQXRNdWx0aVBvcyhbcG9zXSlcbiAgcnVuQXRNdWx0aVBvczogKG11bHRpUG9zKS0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMFxuICAgICAgICBjbWQgPSBAY29tbWFuZE9uUG9zKG11bHRpUG9zWzBdLmVuZClcbiAgICAgICAgaWYgY21kP1xuICAgICAgICAgIGlmIG11bHRpUG9zLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcylcbiAgICAgICAgICBjbWQuaW5pdCgpXG4gICAgICAgICAgQGxvZ2dlci5sb2coY21kKVxuICAgICAgICAgIGNtZC5leGVjdXRlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIG11bHRpUG9zWzBdLnN0YXJ0ID09IG11bHRpUG9zWzBdLmVuZFxuICAgICAgICAgICAgQGFkZEJyYWtldHMobXVsdGlQb3MpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHByb21wdENsb3NpbmdDbWQobXVsdGlQb3MpXG4gIGNvbW1hbmRPblBvczogKHBvcykgLT5cbiAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGZvbGxvd2VkQnlCcmFrZXRzKHBvcykgYW5kIEBjb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT0gMSBcbiAgICAgIHByZXYgPSBwb3MtQGJyYWtldHMubGVuZ3RoXG4gICAgICBuZXh0ID0gcG9zXG4gICAgZWxzZVxuICAgICAgaWYgQHByZWNlZGVkQnlCcmFrZXRzKHBvcykgYW5kIEBjb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT0gMFxuICAgICAgICBwb3MgLT0gQGJyYWtldHMubGVuZ3RoXG4gICAgICBwcmV2ID0gQGZpbmRQcmV2QnJha2V0KHBvcylcbiAgICAgIHVubGVzcyBwcmV2P1xuICAgICAgICByZXR1cm4gbnVsbCBcbiAgICAgIG5leHQgPSBAZmluZE5leHRCcmFrZXQocG9zLTEpXG4gICAgICBpZiAhbmV4dD8gb3IgQGNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT0gMCBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLHByZXYsQGVkaXRvci50ZXh0U3Vic3RyKHByZXYsbmV4dCtAYnJha2V0cy5sZW5ndGgpKVxuICBuZXh0Q21kOiAoc3RhcnQgPSAwKSAtPlxuICAgIHBvcyA9IHN0YXJ0XG4gICAgd2hpbGUgZiA9IEBmaW5kQW55TmV4dChwb3MgLFtAYnJha2V0cyxcIlxcblwiXSlcbiAgICAgIHBvcyA9IGYucG9zICsgZi5zdHIubGVuZ3RoXG4gICAgICBpZiBmLnN0ciA9PSBAYnJha2V0c1xuICAgICAgICBpZiBiZWdpbm5pbmc/XG4gICAgICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgYmVnaW5uaW5nLCBAZWRpdG9yLnRleHRTdWJzdHIoYmVnaW5uaW5nLCBmLnBvcytAYnJha2V0cy5sZW5ndGgpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYmVnaW5uaW5nID0gZi5wb3NcbiAgICAgIGVsc2VcbiAgICAgICAgYmVnaW5uaW5nID0gbnVsbFxuICAgIG51bGxcbiAgZ2V0RW5jbG9zaW5nQ21kOiAocG9zID0gMCkgLT5cbiAgICBjcG9zID0gcG9zXG4gICAgY2xvc2luZ1ByZWZpeCA9IEBicmFrZXRzICsgQGNsb3NlQ2hhclxuICAgIHdoaWxlIChwID0gQGZpbmROZXh0KGNwb3MsY2xvc2luZ1ByZWZpeCkpP1xuICAgICAgaWYgY21kID0gQGNvbW1hbmRPblBvcyhwK2Nsb3NpbmdQcmVmaXgubGVuZ3RoKVxuICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpXG4gICAgICAgIGlmIGNtZC5wb3MgPCBwb3NcbiAgICAgICAgICByZXR1cm4gY21kXG4gICAgICBlbHNlXG4gICAgICAgIGNwb3MgPSBwK2Nsb3NpbmdQcmVmaXgubGVuZ3RoXG4gICAgbnVsbFxuICBwcmVjZWRlZEJ5QnJha2V0czogKHBvcykgLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcy1AYnJha2V0cy5sZW5ndGgscG9zKSA9PSBAYnJha2V0c1xuICBmb2xsb3dlZEJ5QnJha2V0czogKHBvcykgLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrQGJyYWtldHMubGVuZ3RoKSA9PSBAYnJha2V0c1xuICBjb3VudFByZXZCcmFrZXQ6IChzdGFydCkgLT4gXG4gICAgaSA9IDBcbiAgICB3aGlsZSAoc3RhcnQgPSBAZmluZFByZXZCcmFrZXQoc3RhcnQpKT9cbiAgICAgIGkrK1xuICAgIHJldHVybiBpXG4gIGlzRW5kTGluZTogKHBvcykgLT4gXG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dFN1YnN0cihwb3MscG9zKzEpID09IFwiXFxuXCIgb3IgcG9zICsgMSA+PSBAZWRpdG9yLnRleHRMZW4oKVxuICBmaW5kUHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICByZXR1cm4gQGZpbmROZXh0QnJha2V0KHN0YXJ0LC0xKVxuICBmaW5kTmV4dEJyYWtldDogKHN0YXJ0LGRpcmVjdGlvbiA9IDEpIC0+IFxuICAgIGYgPSBAZmluZEFueU5leHQoc3RhcnQgLFtAYnJha2V0cyxcIlxcblwiXSwgZGlyZWN0aW9uKVxuICAgIFxuICAgIGYucG9zIGlmIGYgYW5kIGYuc3RyID09IEBicmFrZXRzXG4gIGZpbmRQcmV2OiAoc3RhcnQsc3RyaW5nKSAtPiBcbiAgICByZXR1cm4gQGZpbmROZXh0KHN0YXJ0LHN0cmluZywtMSlcbiAgZmluZE5leHQ6IChzdGFydCxzdHJpbmcsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW3N0cmluZ10sIGRpcmVjdGlvbilcbiAgICBmLnBvcyBpZiBmXG4gIFxuICBmaW5kQW55TmV4dDogKHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgcmV0dXJuIEBlZGl0b3IuZmluZEFueU5leHQoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24pXG4gICAgXG4gIGZpbmRNYXRjaGluZ1BhaXI6IChzdGFydFBvcyxvcGVuaW5nLGNsb3NpbmcsZGlyZWN0aW9uID0gMSkgLT5cbiAgICBwb3MgPSBzdGFydFBvc1xuICAgIG5lc3RlZCA9IDBcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyxbY2xvc2luZyxvcGVuaW5nXSxkaXJlY3Rpb24pXG4gICAgICBwb3MgPSBmLnBvcyArIChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gZi5zdHIubGVuZ3RoIGVsc2UgMClcbiAgICAgIGlmIGYuc3RyID09IChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gY2xvc2luZyBlbHNlIG9wZW5pbmcpXG4gICAgICAgIGlmIG5lc3RlZCA+IDBcbiAgICAgICAgICBuZXN0ZWQtLVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGZcbiAgICAgIGVsc2VcbiAgICAgICAgbmVzdGVkKytcbiAgICBudWxsXG4gIGFkZEJyYWtldHM6IChwb3MpIC0+XG4gICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKVxuICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKEBicmFrZXRzLEBicmFrZXRzKS5tYXAoIChyKS0+ci5zZWxlY3RDb250ZW50KCkgKVxuICAgIEBlZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICBwcm9tcHRDbG9zaW5nQ21kOiAoc2VsZWN0aW9ucykgLT5cbiAgICBAY2xvc2luZ1Byb21wLnN0b3AoKSBpZiBAY2xvc2luZ1Byb21wP1xuICAgIEBjbG9zaW5nUHJvbXAgPSBDbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsc2VsZWN0aW9ucykuYmVnaW4oKVxuICBwYXJzZUFsbDogKHJlY3Vyc2l2ZSA9IHRydWUpIC0+XG4gICAgaWYgQG5lc3RlZCA+IDEwMFxuICAgICAgdGhyb3cgXCJJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvblwiXG4gICAgcG9zID0gMFxuICAgIHdoaWxlIGNtZCA9IEBuZXh0Q21kKHBvcylcbiAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKVxuICAgICAgQGVkaXRvci5zZXRDdXJzb3JQb3MocG9zKVxuICAgICAgIyBjb25zb2xlLmxvZyhjbWQpXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiByZWN1cnNpdmUgYW5kIGNtZC5jb250ZW50PyBhbmQgKCFjbWQuZ2V0Q21kKCk/IG9yICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSlcbiAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge3BhcmVudDogdGhpc30pXG4gICAgICAgIGNtZC5jb250ZW50ID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIHJlcyA9ICBjbWQuZXhlY3V0ZSgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGlmIHJlcy50aGVuP1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN5bmMgbmVzdGVkIGNvbW1hbmRzIGFyZSBub3Qgc3VwcG9ydGVkJylcbiAgICAgICAgaWYgY21kLnJlcGxhY2VFbmQ/XG4gICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBvcyA9IEBlZGl0b3IuZ2V0Q3Vyc29yUG9zKCkuZW5kXG4gICAgcmV0dXJuIEBnZXRUZXh0KClcbiAgZ2V0VGV4dDogLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0KClcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD8gYW5kICghQGluSW5zdGFuY2U/IG9yICFAaW5JbnN0YW5jZS5maW5kZXI/KVxuICBnZXRSb290OiAtPlxuICAgIGlmIEBpc1Jvb3RcbiAgICAgIHJldHVybiB0aGlzXG4gICAgZWxzZSBpZiBAcGFyZW50P1xuICAgICAgcmV0dXJuIEBwYXJlbnQuZ2V0Um9vdCgpXG4gICAgZWxzZSBpZiBAaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KClcbiAgcmVtb3ZlQ2FycmV0OiAodHh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHR4dCxAY2FycmV0Q2hhcilcbiAgZ2V0Q2FycmV0UG9zOiAodHh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCxAY2FycmV0Q2hhcilcbiAgcmVnTWFya2VyOiAoZmxhZ3M9XCJnXCIpIC0+XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAbWFya2VyKSwgZmxhZ3MpXG4gIHJlbW92ZU1hcmtlcnM6ICh0ZXh0KSAtPlxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoQHJlZ01hcmtlcigpLCcnKVxuXG4gIEBpbml0OiAtPlxuICAgIHVubGVzcyBAaW5pdGVkXG4gICAgICBAaW5pdGVkID0gdHJ1ZVxuICAgICAgQ29tbWFuZC5pbml0Q21kcygpXG4gICAgICBDb21tYW5kLmxvYWRDbWRzKClcblxuICBAaW5pdGVkOiBmYWxzZSIsImltcG9ydCB7XG4gIFByb2Nlc3Ncbn0gZnJvbSAnLi9Qcm9jZXNzJztcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBQb3NpdGlvbmVkQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UnO1xuXG5pbXBvcnQge1xuICBUZXh0UGFyc2VyXG59IGZyb20gJy4vVGV4dFBhcnNlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgTG9nZ2VyXG59IGZyb20gJy4vTG9nZ2VyJztcblxuaW1wb3J0IHtcbiAgUG9zQ29sbGVjdGlvblxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIENsb3NpbmdQcm9tcFxufSBmcm9tICcuL0Nsb3NpbmdQcm9tcCc7XG5cbmV4cG9ydCB2YXIgQ29kZXdhdmUgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIENvZGV3YXZlIHtcbiAgICBjb25zdHJ1Y3RvcihlZGl0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgICAgQ29kZXdhdmUuaW5pdCgpO1xuICAgICAgdGhpcy5tYXJrZXIgPSAnW1tbW2NvZGV3YXZlX21hcnF1ZXJdXV1dJztcbiAgICAgIHRoaXMudmFycyA9IHt9O1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICdicmFrZXRzJzogJ35+JyxcbiAgICAgICAgJ2RlY28nOiAnficsXG4gICAgICAgICdjbG9zZUNoYXInOiAnLycsXG4gICAgICAgICdub0V4ZWN1dGVDaGFyJzogJyEnLFxuICAgICAgICAnY2FycmV0Q2hhcic6ICd8JyxcbiAgICAgICAgJ2NoZWNrQ2FycmV0JzogdHJ1ZSxcbiAgICAgICAgJ2luSW5zdGFuY2UnOiBudWxsXG4gICAgICB9O1xuICAgICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcbiAgICAgIHRoaXMubmVzdGVkID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50Lm5lc3RlZCArIDEgOiAwO1xuICAgICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICB9IGVsc2UgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVkaXRvciAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLmJpbmRlZFRvKHRoaXMpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcyk7XG4gICAgICBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMuaW5JbnN0YW5jZS5jb250ZXh0O1xuICAgICAgfVxuICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG4gICAgfVxuXG4gICAgb25BY3RpdmF0aW9uS2V5KCkge1xuICAgICAgdGhpcy5wcm9jZXNzID0gbmV3IFByb2Nlc3MoKTtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKTtcbiAgICAgIHJldHVybiB0aGlzLnJ1bkF0Q3Vyc29yUG9zKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3MgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcnVuQXRDdXJzb3JQb3MoKSB7XG4gICAgICBpZiAodGhpcy5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkF0TXVsdGlQb3ModGhpcy5lZGl0b3IuZ2V0TXVsdGlTZWwoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdFBvcyh0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcnVuQXRQb3MocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKFtwb3NdKTtcbiAgICB9XG5cbiAgICBydW5BdE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBjbWQ7XG4gICAgICAgIGlmIChtdWx0aVBvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY21kID0gdGhpcy5jb21tYW5kT25Qb3MobXVsdGlQb3NbMF0uZW5kKTtcbiAgICAgICAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbWQuaW5pdCgpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGNtZCk7XG4gICAgICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zWzBdLnN0YXJ0ID09PSBtdWx0aVBvc1swXS5lbmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQnJha2V0cyhtdWx0aVBvcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9tcHRDbG9zaW5nQ21kKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbW1hbmRPblBvcyhwb3MpIHtcbiAgICAgIHZhciBuZXh0LCBwcmV2O1xuICAgICAgaWYgKHRoaXMucHJlY2VkZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmZvbGxvd2VkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDEpIHtcbiAgICAgICAgcHJldiA9IHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGg7XG4gICAgICAgIG5leHQgPSBwb3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09PSAwKSB7XG4gICAgICAgICAgcG9zIC09IHRoaXMuYnJha2V0cy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IHRoaXMuZmluZFByZXZCcmFrZXQocG9zKTtcbiAgICAgICAgaWYgKHByZXYgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIG5leHQgPSB0aGlzLmZpbmROZXh0QnJha2V0KHBvcyAtIDEpO1xuICAgICAgICBpZiAoKG5leHQgPT0gbnVsbCkgfHwgdGhpcy5jb3VudFByZXZCcmFrZXQocHJldikgJSAyICE9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIHByZXYsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocHJldiwgbmV4dCArIHRoaXMuYnJha2V0cy5sZW5ndGgpKTtcbiAgICB9XG5cbiAgICBuZXh0Q21kKHN0YXJ0ID0gMCkge1xuICAgICAgdmFyIGJlZ2lubmluZywgZiwgcG9zO1xuICAgICAgcG9zID0gc3RhcnQ7XG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSkpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGg7XG4gICAgICAgIGlmIChmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBiZWdpbm5pbmcgIT09IFwidW5kZWZpbmVkXCIgJiYgYmVnaW5uaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIoYmVnaW5uaW5nLCBmLnBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmVnaW5uaW5nID0gZi5wb3M7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJlZ2lubmluZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldEVuY2xvc2luZ0NtZChwb3MgPSAwKSB7XG4gICAgICB2YXIgY2xvc2luZ1ByZWZpeCwgY21kLCBjcG9zLCBwO1xuICAgICAgY3BvcyA9IHBvcztcbiAgICAgIGNsb3NpbmdQcmVmaXggPSB0aGlzLmJyYWtldHMgKyB0aGlzLmNsb3NlQ2hhcjtcbiAgICAgIHdoaWxlICgocCA9IHRoaXMuZmluZE5leHQoY3BvcywgY2xvc2luZ1ByZWZpeCkpICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGNtZCA9IHRoaXMuY29tbWFuZE9uUG9zKHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aCkpIHtcbiAgICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpO1xuICAgICAgICAgIGlmIChjbWQucG9zIDwgcG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gY21kO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcG9zID0gcCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGgsIHBvcykgPT09IHRoaXMuYnJha2V0cztcbiAgICB9XG5cbiAgICBmb2xsb3dlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcywgcG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkgPT09IHRoaXMuYnJha2V0cztcbiAgICB9XG5cbiAgICBjb3VudFByZXZCcmFrZXQoc3RhcnQpIHtcbiAgICAgIHZhciBpO1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoKHN0YXJ0ID0gdGhpcy5maW5kUHJldkJyYWtldChzdGFydCkpICE9IG51bGwpIHtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuXG4gICAgaXNFbmRMaW5lKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyAxKSA9PT0gXCJcXG5cIiB8fCBwb3MgKyAxID49IHRoaXMuZWRpdG9yLnRleHRMZW4oKTtcbiAgICB9XG5cbiAgICBmaW5kUHJldkJyYWtldChzdGFydCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHRCcmFrZXQoc3RhcnQsIC0xKTtcbiAgICB9XG5cbiAgICBmaW5kTmV4dEJyYWtldChzdGFydCwgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGY7XG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3RoaXMuYnJha2V0cywgXCJcXG5cIl0sIGRpcmVjdGlvbik7XG4gICAgICBpZiAoZiAmJiBmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgIHJldHVybiBmLnBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldihzdGFydCwgc3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dChzdGFydCwgc3RyaW5nLCAtMSk7XG4gICAgfVxuXG4gICAgZmluZE5leHQoc3RhcnQsIHN0cmluZywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGY7XG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3N0cmluZ10sIGRpcmVjdGlvbik7XG4gICAgICBpZiAoZikge1xuICAgICAgICByZXR1cm4gZi5wb3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5maW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBmaW5kTWF0Y2hpbmdQYWlyKHN0YXJ0UG9zLCBvcGVuaW5nLCBjbG9zaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZiwgbmVzdGVkLCBwb3M7XG4gICAgICBwb3MgPSBzdGFydFBvcztcbiAgICAgIG5lc3RlZCA9IDA7XG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbY2xvc2luZywgb3BlbmluZ10sIGRpcmVjdGlvbikpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyAoZGlyZWN0aW9uID4gMCA/IGYuc3RyLmxlbmd0aCA6IDApO1xuICAgICAgICBpZiAoZi5zdHIgPT09IChkaXJlY3Rpb24gPiAwID8gY2xvc2luZyA6IG9wZW5pbmcpKSB7XG4gICAgICAgICAgaWYgKG5lc3RlZCA+IDApIHtcbiAgICAgICAgICAgIG5lc3RlZC0tO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmVzdGVkKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFkZEJyYWtldHMocG9zKSB7XG4gICAgICB2YXIgcmVwbGFjZW1lbnRzO1xuICAgICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKTtcbiAgICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKHRoaXMuYnJha2V0cywgdGhpcy5icmFrZXRzKS5tYXAoZnVuY3Rpb24ocikge1xuICAgICAgICByZXR1cm4gci5zZWxlY3RDb250ZW50KCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICAgIH1cblxuICAgIHByb21wdENsb3NpbmdDbWQoc2VsZWN0aW9ucykge1xuICAgICAgaWYgKHRoaXMuY2xvc2luZ1Byb21wICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbG9zaW5nUHJvbXAuc3RvcCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wLm5ld0Zvcih0aGlzLCBzZWxlY3Rpb25zKS5iZWdpbigpO1xuICAgIH1cblxuICAgIHBhcnNlQWxsKHJlY3Vyc2l2ZSA9IHRydWUpIHtcbiAgICAgIHZhciBjbWQsIHBhcnNlciwgcG9zLCByZXM7XG4gICAgICBpZiAodGhpcy5uZXN0ZWQgPiAxMDApIHtcbiAgICAgICAgdGhyb3cgXCJJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvblwiO1xuICAgICAgfVxuICAgICAgcG9zID0gMDtcbiAgICAgIHdoaWxlIChjbWQgPSB0aGlzLm5leHRDbWQocG9zKSkge1xuICAgICAgICBwb3MgPSBjbWQuZ2V0RW5kUG9zKCk7XG4gICAgICAgIHRoaXMuZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhjbWQpXG4gICAgICAgIGNtZC5pbml0KCk7XG4gICAgICAgIGlmIChyZWN1cnNpdmUgJiYgKGNtZC5jb250ZW50ICE9IG51bGwpICYmICgoY21kLmdldENtZCgpID09IG51bGwpIHx8ICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSkpIHtcbiAgICAgICAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIoY21kLmNvbnRlbnQpLCB7XG4gICAgICAgICAgICBwYXJlbnQ6IHRoaXNcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IGNtZC5leGVjdXRlKCk7XG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIGlmIChyZXMudGhlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzeW5jIG5lc3RlZCBjb21tYW5kcyBhcmUgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY21kLnJlcGxhY2VFbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldFRleHQoKTtcbiAgICB9XG5cbiAgICBnZXRUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHQoKTtcbiAgICB9XG5cbiAgICBpc1Jvb3QoKSB7XG4gICAgICByZXR1cm4gKHRoaXMucGFyZW50ID09IG51bGwpICYmICgodGhpcy5pbkluc3RhbmNlID09IG51bGwpIHx8ICh0aGlzLmluSW5zdGFuY2UuZmluZGVyID09IG51bGwpKTtcbiAgICB9XG5cbiAgICBnZXRSb290KCkge1xuICAgICAgaWYgKHRoaXMuaXNSb290KSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRSb290KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUNhcnJldCh0eHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHR4dCwgdGhpcy5jYXJyZXRDaGFyKTtcbiAgICB9XG5cbiAgICBnZXRDYXJyZXRQb3ModHh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldENhcnJldFBvcyh0eHQsIHRoaXMuY2FycmV0Q2hhcik7XG4gICAgfVxuXG4gICAgcmVnTWFya2VyKGZsYWdzID0gXCJnXCIpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5tYXJrZXIpLCBmbGFncyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWFya2Vycyh0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHRoaXMucmVnTWFya2VyKCksICcnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdCgpIHtcbiAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgICBDb21tYW5kLmluaXRDbWRzKCk7XG4gICAgICAgIHJldHVybiBDb21tYW5kLmxvYWRDbWRzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gIH07XG5cbiAgQ29kZXdhdmUuaW5pdGVkID0gZmFsc2U7XG5cbiAgcmV0dXJuIENvZGV3YXZlO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFN0b3JhZ2UgfSBmcm9tICcuL1N0b3JhZ2UnO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cblxuX29wdEtleSA9IChrZXksZGljdCxkZWZWYWwgPSBudWxsKSAtPlxuICAjIG9wdGlvbmFsIERpY3Rpb25hcnkga2V5XG4gIHJldHVybiBpZiBrZXkgb2YgZGljdCB0aGVuIGRpY3Rba2V5XSBlbHNlIGRlZlZhbFxuXG5cbmV4cG9ydCBjbGFzcyBDb21tYW5kXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsQGRhdGE9bnVsbCxwYXJlbnQ9bnVsbCkgLT5cbiAgICBAY21kcyA9IFtdXG4gICAgQGRldGVjdG9ycyA9IFtdXG4gICAgQGV4ZWN1dGVGdW5jdCA9IEByZXN1bHRGdW5jdCA9IEByZXN1bHRTdHIgPSBAYWxpYXNPZiA9IEBjbHMgPSBudWxsXG4gICAgQGFsaWFzZWQgPSBudWxsXG4gICAgQGZ1bGxOYW1lID0gQG5hbWVcbiAgICBAZGVwdGggPSAwXG4gICAgW0BfcGFyZW50LCBAX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdXG4gICAgQHNldFBhcmVudChwYXJlbnQpXG4gICAgQGRlZmF1bHRzID0ge31cbiAgICBcbiAgICBAZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBuYW1lVG9QYXJhbTogbnVsbCxcbiAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgYmVmb3JlRXhlY3V0ZTogbnVsbCxcbiAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgIHJlcGxhY2VCb3g6IGZhbHNlLFxuICAgIH1cbiAgICBAb3B0aW9ucyA9IHt9XG4gICAgQGZpbmFsT3B0aW9ucyA9IG51bGxcbiAgcGFyZW50OiAtPlxuICAgIHJldHVybiBAX3BhcmVudFxuICBzZXRQYXJlbnQ6ICh2YWx1ZSkgLT5cbiAgICBpZiBAX3BhcmVudCAhPSB2YWx1ZVxuICAgICAgQF9wYXJlbnQgPSB2YWx1ZVxuICAgICAgQGZ1bGxOYW1lID0gKFxuICAgICAgICBpZiBAX3BhcmVudD8gYW5kIEBfcGFyZW50Lm5hbWU/XG4gICAgICAgICAgQF9wYXJlbnQuZnVsbE5hbWUgKyAnOicgKyBAbmFtZSBcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICBAbmFtZVxuICAgICAgKVxuICAgICAgQGRlcHRoID0gKFxuICAgICAgICBpZiBAX3BhcmVudD8gYW5kIEBfcGFyZW50LmRlcHRoP1xuICAgICAgICB0aGVuIEBfcGFyZW50LmRlcHRoICsgMVxuICAgICAgICBlbHNlIDBcbiAgICAgIClcbiAgaW5pdDogLT5cbiAgICBpZiAhQF9pbml0ZWRcbiAgICAgIEBfaW5pdGVkID0gdHJ1ZVxuICAgICAgQHBhcnNlRGF0YShAZGF0YSlcbiAgICByZXR1cm4gdGhpc1xuICB1bnJlZ2lzdGVyOiAtPlxuICAgIEBfcGFyZW50LnJlbW92ZUNtZCh0aGlzKVxuICBpc0VkaXRhYmxlOiAtPlxuICAgIHJldHVybiBAcmVzdWx0U3RyPyBvciBAYWxpYXNPZj9cbiAgaXNFeGVjdXRhYmxlOiAtPlxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgIGZvciBwIGluIFsncmVzdWx0U3RyJywncmVzdWx0RnVuY3QnLCdjbHMnLCdleGVjdXRlRnVuY3QnXVxuICAgICAgaWYgdGhpc1twXT9cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgaXNFeGVjdXRhYmxlV2l0aE5hbWU6IChuYW1lKSAtPlxuICAgIGlmIEBhbGlhc09mP1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgIGFsaWFzT2YgPSBAYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLG5hbWUpXG4gICAgICBhbGlhc2VkID0gQF9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihhbGlhc09mKSlcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIEBpc0V4ZWN1dGFibGUoKVxuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgZm9yIHAgaW4gWydyZXN1bHRTdHInLCdyZXN1bHRGdW5jdCddXG4gICAgICBpZiB0aGlzW3BdP1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICBnZXREZWZhdWx0czogLT5cbiAgICByZXMgPSB7fVxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSlcbiAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxAZGVmYXVsdHMpXG4gICAgcmV0dXJuIHJlc1xuICBfYWxpYXNlZEZyb21GaW5kZXI6IChmaW5kZXIpIC0+XG4gICAgICBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2VcbiAgICAgIGZpbmRlci5tdXN0RXhlY3V0ZSA9IGZhbHNlXG4gICAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2VcbiAgICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIGdldEFsaWFzZWQ6IC0+XG4gICAgaWYgQGFsaWFzT2Y/XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgcmV0dXJuIEBfYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoQGFsaWFzT2YpKVxuICBzZXRPcHRpb25zOiAoZGF0YSkgLT5cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGF0YVxuICAgICAgaWYga2V5IG9mIEBkZWZhdWx0T3B0aW9uc1xuICAgICAgICBAb3B0aW9uc1trZXldID0gdmFsXG4gIF9vcHRpb25zRm9yQWxpYXNlZDogKGFsaWFzZWQpIC0+XG4gICAgb3B0ID0ge31cbiAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxAZGVmYXVsdE9wdGlvbnMpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LGFsaWFzZWQuZ2V0T3B0aW9ucygpKVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdCxAb3B0aW9ucylcbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4gQF9vcHRpb25zRm9yQWxpYXNlZChAZ2V0QWxpYXNlZCgpKVxuICBnZXRPcHRpb246IChrZXkpIC0+XG4gICAgb3B0aW9ucyA9IEBnZXRPcHRpb25zKClcbiAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBoZWxwOiAtPlxuICAgIGNtZCA9IEBnZXRDbWQoJ2hlbHAnKVxuICAgIGlmIGNtZD9cbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLnJlc3VsdFN0clxuICBwYXJzZURhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gZGF0YVxuICAgIGlmIHR5cGVvZiBkYXRhID09ICdzdHJpbmcnXG4gICAgICBAcmVzdWx0U3RyID0gZGF0YVxuICAgICAgQG9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2UgaWYgZGF0YT9cbiAgICAgIHJldHVybiBAcGFyc2VEaWN0RGF0YShkYXRhKVxuICAgIHJldHVybiBmYWxzZVxuICBwYXJzZURpY3REYXRhOiAoZGF0YSkgLT5cbiAgICByZXMgPSBfb3B0S2V5KCdyZXN1bHQnLGRhdGEpXG4gICAgaWYgdHlwZW9mIHJlcyA9PSBcImZ1bmN0aW9uXCJcbiAgICAgIEByZXN1bHRGdW5jdCA9IHJlc1xuICAgIGVsc2UgaWYgcmVzP1xuICAgICAgQHJlc3VsdFN0ciA9IHJlc1xuICAgICAgQG9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlXG4gICAgZXhlY3V0ZSA9IF9vcHRLZXkoJ2V4ZWN1dGUnLGRhdGEpXG4gICAgaWYgdHlwZW9mIGV4ZWN1dGUgPT0gXCJmdW5jdGlvblwiXG4gICAgICBAZXhlY3V0ZUZ1bmN0ID0gZXhlY3V0ZVxuICAgIEBhbGlhc09mID0gX29wdEtleSgnYWxpYXNPZicsZGF0YSlcbiAgICBAYWxsb3dlZE5hbWVkID0gX29wdEtleSgnYWxsb3dlZE5hbWVkJyxkYXRhKVxuICAgIEBjbHMgPSBfb3B0S2V5KCdjbHMnLGRhdGEpXG4gICAgQGRlZmF1bHRzID0gX29wdEtleSgnZGVmYXVsdHMnLGRhdGEsQGRlZmF1bHRzKVxuICAgIFxuICAgIEBzZXRPcHRpb25zKGRhdGEpXG4gICAgXG4gICAgaWYgJ2hlbHAnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLGRhdGFbJ2hlbHAnXSx0aGlzKSlcbiAgICBpZiAnZmFsbGJhY2snIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2ZhbGxiYWNrJyxkYXRhWydmYWxsYmFjayddLHRoaXMpKVxuICAgICAgXG4gICAgaWYgJ2NtZHMnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWRzKGRhdGFbJ2NtZHMnXSlcbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDbWRzOiAoY21kcykgLT5cbiAgICBmb3IgbmFtZSwgZGF0YSBvZiBjbWRzXG4gICAgICBAYWRkQ21kKG5ldyBDb21tYW5kKG5hbWUsZGF0YSx0aGlzKSlcbiAgYWRkQ21kOiAoY21kKSAtPlxuICAgIGV4aXN0cyA9IEBnZXRDbWQoY21kLm5hbWUpXG4gICAgaWYgZXhpc3RzP1xuICAgICAgQHJlbW92ZUNtZChleGlzdHMpXG4gICAgY21kLnNldFBhcmVudCh0aGlzKVxuICAgIEBjbWRzLnB1c2goY21kKVxuICAgIHJldHVybiBjbWRcbiAgcmVtb3ZlQ21kOiAoY21kKSAtPlxuICAgIGlmIChpID0gQGNtZHMuaW5kZXhPZihjbWQpKSA+IC0xXG4gICAgICBAY21kcy5zcGxpY2UoaSwgMSlcbiAgICByZXR1cm4gY21kXG4gIGdldENtZDogKGZ1bGxuYW1lKSAtPlxuICAgIEBpbml0KClcbiAgICBbc3BhY2UsbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSlcbiAgICBpZiBzcGFjZT9cbiAgICAgIHJldHVybiBAZ2V0Q21kKHNwYWNlKT8uZ2V0Q21kKG5hbWUpXG4gICAgZm9yIGNtZCBpbiBAY21kc1xuICAgICAgaWYgY21kLm5hbWUgPT0gbmFtZVxuICAgICAgICByZXR1cm4gY21kXG4gIHNldENtZERhdGE6IChmdWxsbmFtZSxkYXRhKSAtPlxuICAgIEBzZXRDbWQoZnVsbG5hbWUsbmV3IENvbW1hbmQoZnVsbG5hbWUuc3BsaXQoJzonKS5wb3AoKSxkYXRhKSlcbiAgc2V0Q21kOiAoZnVsbG5hbWUsY21kKSAtPlxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgbmV4dCA9IEBnZXRDbWQoc3BhY2UpXG4gICAgICB1bmxlc3MgbmV4dD9cbiAgICAgICAgbmV4dCA9IEBhZGRDbWQobmV3IENvbW1hbmQoc3BhY2UpKVxuICAgICAgcmV0dXJuIG5leHQuc2V0Q21kKG5hbWUsY21kKVxuICAgIGVsc2VcbiAgICAgIEBhZGRDbWQoY21kKVxuICAgICAgcmV0dXJuIGNtZFxuICBhZGREZXRlY3RvcjogKGRldGVjdG9yKSAtPlxuICAgIEBkZXRlY3RvcnMucHVzaChkZXRlY3RvcilcbiAgICBcbiAgQHByb3ZpZGVycyA9IFtdXG5cbiAgQHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG5cbiAgQGluaXRDbWRzOiAtPlxuICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwse1xuICAgICAgJ2NtZHMnOntcbiAgICAgICAgJ2hlbGxvJzp7XG4gICAgICAgICAgaGVscDogXCJcIlwiXG4gICAgICAgICAgXCJIZWxsbywgd29ybGQhXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cbiAgICAgICAgICBtb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cbiAgICAgICAgICB2ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWFcbiAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICByZXN1bHQ6ICdIZWxsbywgV29ybGQhJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBmb3IgcHJvdmlkZXIgaW4gQHByb3ZpZGVyc1xuICAgICAgcHJvdmlkZXIucmVnaXN0ZXIoQ29tbWFuZC5jbWRzKVxuXG4gIEBzYXZlQ21kOiAoZnVsbG5hbWUsIGRhdGEpIC0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsZGF0YSlcbiAgICAudGhlbiA9PlxuICAgICAgQHN0b3JhZ2Uuc2F2ZUluUGF0aCgnY21kcycsIGZ1bGxuYW1lLCBkYXRhKVxuXG4gIEBsb2FkQ21kczogLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBzYXZlZENtZHMgPSBAc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAudGhlbiAoc2F2ZWRDbWRzKT0+XG4gICAgICBpZiBzYXZlZENtZHM/IFxuICAgICAgICBmb3IgZnVsbG5hbWUsIGRhdGEgb2Ygc2F2ZWRDbWRzXG4gICAgICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpXG5cbiAgQHJlc2V0U2F2ZWQ6IC0+XG4gICAgQHN0b3JhZ2Uuc2F2ZSgnY21kcycse30pXG5cbiAgQG1ha2VWYXJDbWQgPSAobmFtZSxiYXNlPXt9KSAtPiBcbiAgICBiYXNlLmV4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWwgaWYgdmFsP1xuICAgIHJldHVybiBiYXNlXG5cbiAgQG1ha2VCb29sVmFyQ21kID0gKG5hbWUsYmFzZT17fSkgLT4gXG4gICAgYmFzZS5leGVjdXRlID0gKGluc3RhbmNlKSAtPlxuICAgICAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSk/XG4gICAgICAgIHBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UuY29udGVudFxuICAgICAgICBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgdmFsPyBhbmQgdmFsIGluIFsnMCcsJ2ZhbHNlJywnbm8nXVxuICAgICAgICBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdHJ1ZVxuICAgIHJldHVybiBiYXNlXG4gIFxuXG5leHBvcnQgY2xhc3MgQmFzZUNvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAaW5zdGFuY2UpIC0+XG4gIGluaXQ6IC0+XG4gICAgI1xuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICByZXR1cm4gdGhpc1tcInJlc3VsdFwiXT9cbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgcmV0dXJuIHt9XG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIHt9XG4gICAgICAiLCJ2YXIgX29wdEtleTtcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBTdG9yYWdlXG59IGZyb20gJy4vU3RvcmFnZSc7XG5cbmltcG9ydCB7XG4gIE5hbWVzcGFjZUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuX29wdEtleSA9IGZ1bmN0aW9uKGtleSwgZGljdCwgZGVmVmFsID0gbnVsbCkge1xuICAvLyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICBpZiAoa2V5IGluIGRpY3QpIHtcbiAgICByZXR1cm4gZGljdFtrZXldO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkZWZWYWw7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgQ29tbWFuZCA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IobmFtZTEsIGRhdGExID0gbnVsbCwgcGFyZW50ID0gbnVsbCkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTE7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhMTtcbiAgICAgIHRoaXMuY21kcyA9IFtdO1xuICAgICAgdGhpcy5kZXRlY3RvcnMgPSBbXTtcbiAgICAgIHRoaXMuZXhlY3V0ZUZ1bmN0ID0gdGhpcy5yZXN1bHRGdW5jdCA9IHRoaXMucmVzdWx0U3RyID0gdGhpcy5hbGlhc09mID0gdGhpcy5jbHMgPSBudWxsO1xuICAgICAgdGhpcy5hbGlhc2VkID0gbnVsbDtcbiAgICAgIHRoaXMuZnVsbE5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICB0aGlzLmRlcHRoID0gMDtcbiAgICAgIFt0aGlzLl9wYXJlbnQsIHRoaXMuX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdO1xuICAgICAgdGhpcy5zZXRQYXJlbnQocGFyZW50KTtcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSB7fTtcbiAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgICBhbHRlclJlc3VsdDogbnVsbCxcbiAgICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgICAgcmVwbGFjZUJveDogZmFsc2VcbiAgICAgIH07XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICAgIHRoaXMuZmluYWxPcHRpb25zID0gbnVsbDtcbiAgICB9XG5cbiAgICBwYXJlbnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICAgIH1cblxuICAgIHNldFBhcmVudCh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMuX3BhcmVudCAhPT0gdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZnVsbE5hbWUgPSAoKHRoaXMuX3BhcmVudCAhPSBudWxsKSAmJiAodGhpcy5fcGFyZW50Lm5hbWUgIT0gbnVsbCkgPyB0aGlzLl9wYXJlbnQuZnVsbE5hbWUgKyAnOicgKyB0aGlzLm5hbWUgOiB0aGlzLm5hbWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZXB0aCA9ICgodGhpcy5fcGFyZW50ICE9IG51bGwpICYmICh0aGlzLl9wYXJlbnQuZGVwdGggIT0gbnVsbCkgPyB0aGlzLl9wYXJlbnQuZGVwdGggKyAxIDogMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIGlmICghdGhpcy5faW5pdGVkKSB7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMucGFyc2VEYXRhKHRoaXMuZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5yZW1vdmVDbWQodGhpcyk7XG4gICAgfVxuXG4gICAgaXNFZGl0YWJsZSgpIHtcbiAgICAgIHJldHVybiAodGhpcy5yZXN1bHRTdHIgIT0gbnVsbCkgfHwgKHRoaXMuYWxpYXNPZiAhPSBudWxsKTtcbiAgICB9XG5cbiAgICBpc0V4ZWN1dGFibGUoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgaiwgbGVuLCBwLCByZWY7XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKTtcbiAgICAgIH1cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0JywgJ2NscycsICdleGVjdXRlRnVuY3QnXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcmVmW2pdO1xuICAgICAgICBpZiAodGhpc1twXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpc0V4ZWN1dGFibGVXaXRoTmFtZShuYW1lKSB7XG4gICAgICB2YXIgYWxpYXNPZiwgYWxpYXNlZCwgY29udGV4dDtcbiAgICAgIGlmICh0aGlzLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKTtcbiAgICAgICAgYWxpYXNPZiA9IHRoaXMuYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBuYW1lKTtcbiAgICAgICAgYWxpYXNlZCA9IHRoaXMuX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKGFsaWFzT2YpKTtcbiAgICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pc0V4ZWN1dGFibGUoKTtcbiAgICB9XG5cbiAgICByZXN1bHRJc0F2YWlsYWJsZSgpIHtcbiAgICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZjtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0J107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHJlZltqXTtcbiAgICAgICAgaWYgKHRoaXNbcF0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgcmVzO1xuICAgICAgcmVzID0ge307XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCBhbGlhc2VkLmdldERlZmF1bHRzKCkpO1xuICAgICAgfVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuZGVmYXVsdHMpO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBfYWxpYXNlZEZyb21GaW5kZXIoZmluZGVyKSB7XG4gICAgICBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2U7XG4gICAgICBmaW5kZXIubXVzdEV4ZWN1dGUgPSBmYWxzZTtcbiAgICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZTtcbiAgICAgIHJldHVybiBmaW5kZXIuZmluZCgpO1xuICAgIH1cblxuICAgIGdldEFsaWFzZWQoKSB7XG4gICAgICB2YXIgY29udGV4dDtcbiAgICAgIGlmICh0aGlzLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKHRoaXMuYWxpYXNPZikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldE9wdGlvbnMoZGF0YSkge1xuICAgICAgdmFyIGtleSwgcmVzdWx0cywgdmFsO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgICB2YWwgPSBkYXRhW2tleV07XG4gICAgICAgIGlmIChrZXkgaW4gdGhpcy5kZWZhdWx0T3B0aW9ucykge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLm9wdGlvbnNba2V5XSA9IHZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIF9vcHRpb25zRm9yQWxpYXNlZChhbGlhc2VkKSB7XG4gICAgICB2YXIgb3B0O1xuICAgICAgb3B0ID0ge307XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5kZWZhdWx0T3B0aW9ucyk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCBhbGlhc2VkLmdldE9wdGlvbnMoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9ucygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSk7XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9uKGtleSkge1xuICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoZWxwKCkge1xuICAgICAgdmFyIGNtZDtcbiAgICAgIGNtZCA9IHRoaXMuZ2V0Q21kKCdoZWxwJyk7XG4gICAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5pbml0KCkucmVzdWx0U3RyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlRGF0YShkYXRhKSB7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IGRhdGE7XG4gICAgICAgIHRoaXMub3B0aW9uc1sncGFyc2UnXSA9IHRydWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChkYXRhICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEaWN0RGF0YShkYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwYXJzZURpY3REYXRhKGRhdGEpIHtcbiAgICAgIHZhciBleGVjdXRlLCByZXM7XG4gICAgICByZXMgPSBfb3B0S2V5KCdyZXN1bHQnLCBkYXRhKTtcbiAgICAgIGlmICh0eXBlb2YgcmVzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRGdW5jdCA9IHJlcztcbiAgICAgIH0gZWxzZSBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRTdHIgPSByZXM7XG4gICAgICAgIHRoaXMub3B0aW9uc1sncGFyc2UnXSA9IHRydWU7XG4gICAgICB9XG4gICAgICBleGVjdXRlID0gX29wdEtleSgnZXhlY3V0ZScsIGRhdGEpO1xuICAgICAgaWYgKHR5cGVvZiBleGVjdXRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSBleGVjdXRlO1xuICAgICAgfVxuICAgICAgdGhpcy5hbGlhc09mID0gX29wdEtleSgnYWxpYXNPZicsIGRhdGEpO1xuICAgICAgdGhpcy5hbGxvd2VkTmFtZWQgPSBfb3B0S2V5KCdhbGxvd2VkTmFtZWQnLCBkYXRhKTtcbiAgICAgIHRoaXMuY2xzID0gX29wdEtleSgnY2xzJywgZGF0YSk7XG4gICAgICB0aGlzLmRlZmF1bHRzID0gX29wdEtleSgnZGVmYXVsdHMnLCBkYXRhLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhkYXRhKTtcbiAgICAgIGlmICgnaGVscCcgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsIGRhdGFbJ2hlbHAnXSwgdGhpcykpO1xuICAgICAgfVxuICAgICAgaWYgKCdmYWxsYmFjaycgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLCBkYXRhWydmYWxsYmFjayddLCB0aGlzKSk7XG4gICAgICB9XG4gICAgICBpZiAoJ2NtZHMnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWRzKGRhdGFbJ2NtZHMnXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhZGRDbWRzKGNtZHMpIHtcbiAgICAgIHZhciBkYXRhLCBuYW1lLCByZXN1bHRzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChuYW1lIGluIGNtZHMpIHtcbiAgICAgICAgZGF0YSA9IGNtZHNbbmFtZV07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZENtZChuZXcgQ29tbWFuZChuYW1lLCBkYXRhLCB0aGlzKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkQ21kKGNtZCkge1xuICAgICAgdmFyIGV4aXN0cztcbiAgICAgIGV4aXN0cyA9IHRoaXMuZ2V0Q21kKGNtZC5uYW1lKTtcbiAgICAgIGlmIChleGlzdHMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlbW92ZUNtZChleGlzdHMpO1xuICAgICAgfVxuICAgICAgY21kLnNldFBhcmVudCh0aGlzKTtcbiAgICAgIHRoaXMuY21kcy5wdXNoKGNtZCk7XG4gICAgICByZXR1cm4gY21kO1xuICAgIH1cblxuICAgIHJlbW92ZUNtZChjbWQpIHtcbiAgICAgIHZhciBpO1xuICAgICAgaWYgKChpID0gdGhpcy5jbWRzLmluZGV4T2YoY21kKSkgPiAtMSkge1xuICAgICAgICB0aGlzLmNtZHMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNtZDtcbiAgICB9XG5cbiAgICBnZXRDbWQoZnVsbG5hbWUpIHtcbiAgICAgIHZhciBjbWQsIGosIGxlbiwgbmFtZSwgcmVmLCByZWYxLCBzcGFjZTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKTtcbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiAocmVmID0gdGhpcy5nZXRDbWQoc3BhY2UpKSAhPSBudWxsID8gcmVmLmdldENtZChuYW1lKSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIHJlZjEgPSB0aGlzLmNtZHM7XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYxLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGNtZCA9IHJlZjFbal07XG4gICAgICAgIGlmIChjbWQubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRDbWQoZnVsbG5hbWUsIG5ldyBDb21tYW5kKGZ1bGxuYW1lLnNwbGl0KCc6JykucG9wKCksIGRhdGEpKTtcbiAgICB9XG5cbiAgICBzZXRDbWQoZnVsbG5hbWUsIGNtZCkge1xuICAgICAgdmFyIG5hbWUsIG5leHQsIHNwYWNlO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKTtcbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIG5leHQgPSB0aGlzLmdldENtZChzcGFjZSk7XG4gICAgICAgIGlmIChuZXh0ID09IG51bGwpIHtcbiAgICAgICAgICBuZXh0ID0gdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoc3BhY2UpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSwgY21kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKGNtZCk7XG4gICAgICAgIHJldHVybiBjbWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkRGV0ZWN0b3IoZGV0ZWN0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmRldGVjdG9ycy5wdXNoKGRldGVjdG9yKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdENtZHMoKSB7XG4gICAgICB2YXIgaiwgbGVuLCBwcm92aWRlciwgcmVmLCByZXN1bHRzO1xuICAgICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCwge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnaGVsbG8nOiB7XG4gICAgICAgICAgICBoZWxwOiBcIlxcXCJIZWxsbywgd29ybGQhXFxcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxcbm1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xcbnZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYVwiLFxuICAgICAgICAgICAgcmVzdWx0OiAnSGVsbG8sIFdvcmxkISdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVmID0gdGhpcy5wcm92aWRlcnM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcHJvdmlkZXIgPSByZWZbal07XG4gICAgICAgIHJlc3VsdHMucHVzaChwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzYXZlQ21kKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSk7XG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlSW5QYXRoKCdjbWRzJywgZnVsbG5hbWUsIGRhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGxvYWRDbWRzKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgc2F2ZWRDbWRzO1xuICAgICAgICByZXR1cm4gc2F2ZWRDbWRzID0gdGhpcy5zdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgICAgIH0pLnRoZW4oKHNhdmVkQ21kcykgPT4ge1xuICAgICAgICB2YXIgZGF0YSwgZnVsbG5hbWUsIHJlc3VsdHM7XG4gICAgICAgIGlmIChzYXZlZENtZHMgIT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKGZ1bGxuYW1lIGluIHNhdmVkQ21kcykge1xuICAgICAgICAgICAgZGF0YSA9IHNhdmVkQ21kc1tmdWxsbmFtZV07XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldFNhdmVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlKCdjbWRzJywge30pO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYWtlVmFyQ21kKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHAsIHZhbDtcbiAgICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcbiAgICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZUJvb2xWYXJDbWQobmFtZSwgYmFzZSA9IHt9KSB7XG4gICAgICBiYXNlLmV4ZWN1dGUgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICB2YXIgcCwgdmFsO1xuICAgICAgICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuICAgICAgICBpZiAoISgodmFsICE9IG51bGwpICYmICh2YWwgPT09ICcwJyB8fCB2YWwgPT09ICdmYWxzZScgfHwgdmFsID09PSAnbm8nKSkpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgfTtcblxuICBDb21tYW5kLnByb3ZpZGVycyA9IFtdO1xuXG4gIENvbW1hbmQuc3RvcmFnZSA9IG5ldyBTdG9yYWdlKCk7XG5cbiAgcmV0dXJuIENvbW1hbmQ7XG5cbn0pLmNhbGwodGhpcyk7XG5cbmV4cG9ydCB2YXIgQmFzZUNvbW1hbmQgPSBjbGFzcyBCYXNlQ29tbWFuZCB7XG4gIGNvbnN0cnVjdG9yKGluc3RhbmNlMSkge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTE7XG4gIH1cblxuICBpbml0KCkge31cblxuICBcbiAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXNbXCJyZXN1bHRcIl0gIT0gbnVsbDtcbiAgfVxuXG4gIGdldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IENtZEZpbmRlciB9IGZyb20gJy4vQ21kRmluZGVyJztcbmltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBDb250ZXh0XG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlKSAtPlxuICAgIEBuYW1lU3BhY2VzID0gW11cbiAgXG4gIGFkZE5hbWVTcGFjZTogKG5hbWUpIC0+XG4gICAgaWYgbmFtZSBub3QgaW4gQG5hbWVTcGFjZXMgXG4gICAgICBAbmFtZVNwYWNlcy5wdXNoKG5hbWUpXG4gICAgICBAX25hbWVzcGFjZXMgPSBudWxsXG4gIGFkZE5hbWVzcGFjZXM6IChzcGFjZXMpIC0+XG4gICAgaWYgc3BhY2VzIFxuICAgICAgaWYgdHlwZW9mIHNwYWNlcyA9PSAnc3RyaW5nJ1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXVxuICAgICAgZm9yIHNwYWNlIGluIHNwYWNlcyBcbiAgICAgICAgQGFkZE5hbWVTcGFjZShzcGFjZSlcbiAgcmVtb3ZlTmFtZVNwYWNlOiAobmFtZSkgLT5cbiAgICBAbmFtZVNwYWNlcyA9IEBuYW1lU3BhY2VzLmZpbHRlciAobikgLT4gbiBpc250IG5hbWVcblxuICBnZXROYW1lU3BhY2VzOiAtPlxuICAgIHVubGVzcyBAX25hbWVzcGFjZXM/XG4gICAgICBucGNzID0gWydjb3JlJ10uY29uY2F0KEBuYW1lU3BhY2VzKVxuICAgICAgaWYgQHBhcmVudD9cbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KEBwYXJlbnQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgQF9uYW1lc3BhY2VzID0gQXJyYXlIZWxwZXIudW5pcXVlKG5wY3MpXG4gICAgcmV0dXJuIEBfbmFtZXNwYWNlc1xuICBnZXRDbWQ6IChjbWROYW1lLG9wdGlvbnMgPSB7fSkgLT5cbiAgICBmaW5kZXIgPSBAZ2V0RmluZGVyKGNtZE5hbWUsb3B0aW9ucylcbiAgICByZXR1cm4gZmluZGVyLmZpbmQoKVxuICBnZXRGaW5kZXI6IChjbWROYW1lLG9wdGlvbnMgPSB7fSkgLT5cbiAgICByZXR1cm4gbmV3IENtZEZpbmRlcihjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdXG4gICAgICB1c2VEZXRlY3RvcnM6IEBpc1Jvb3QoKVxuICAgICAgY29kZXdhdmU6IEBjb2Rld2F2ZVxuICAgICAgcGFyZW50Q29udGV4dDogdGhpc1xuICAgIH0sb3B0aW9ucykpXG4gIGlzUm9vdDogLT5cbiAgICByZXR1cm4gIUBwYXJlbnQ/XG4gIGdldFBhcmVudE9yUm9vdDogKCkgLT5cbiAgICBpZiBAcGFyZW50P1xuICAgICAgQHBhcmVudFxuICAgIGVsc2VcbiAgICAgIHRoaXNcbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIGNjLmluZGV4T2YoJyVzJykgPiAtMVxuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJyxzdHIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgd3JhcENvbW1lbnRMZWZ0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLGkpICsgc3RyXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gIHdyYXBDb21tZW50UmlnaHQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkrMilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2NcbiAgY21kSW5zdGFuY2VGb3I6IChjbWQpIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsdGhpcylcbiAgZ2V0Q29tbWVudENoYXI6IC0+XG4gICAgaWYgQGNvbW1lbnRDaGFyP1xuICAgICAgcmV0dXJuIEBjb21tZW50Q2hhclxuICAgIGNtZCA9IEBnZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG4gICAgaWYgY21kP1xuICAgICAgaW5zdCA9IEBjbWRJbnN0YW5jZUZvcihjbWQpXG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnXG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICBAY29tbWVudENoYXIgPSBjaGFyXG4gICAgcmV0dXJuIEBjb21tZW50Q2hhciIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgQ21kRmluZGVyXG59IGZyb20gJy4vQ21kRmluZGVyJztcblxuaW1wb3J0IHtcbiAgQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5cbmltcG9ydCB7XG4gIEFycmF5SGVscGVyXG59IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5cbmV4cG9ydCB2YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSkge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTtcbiAgICB0aGlzLm5hbWVTcGFjZXMgPSBbXTtcbiAgfVxuXG4gIGFkZE5hbWVTcGFjZShuYW1lKSB7XG4gICAgaWYgKGluZGV4T2YuY2FsbCh0aGlzLm5hbWVTcGFjZXMsIG5hbWUpIDwgMCkge1xuICAgICAgdGhpcy5uYW1lU3BhY2VzLnB1c2gobmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYWRkTmFtZXNwYWNlcyhzcGFjZXMpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzLCBzcGFjZTtcbiAgICBpZiAoc3BhY2VzKSB7XG4gICAgICBpZiAodHlwZW9mIHNwYWNlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3BhY2VzID0gW3NwYWNlc107XG4gICAgICB9XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBzcGFjZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgc3BhY2UgPSBzcGFjZXNbal07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZE5hbWVTcGFjZShzcGFjZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTmFtZVNwYWNlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lU3BhY2VzID0gdGhpcy5uYW1lU3BhY2VzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbiAhPT0gbmFtZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldE5hbWVTcGFjZXMoKSB7XG4gICAgdmFyIG5wY3M7XG4gICAgaWYgKHRoaXMuX25hbWVzcGFjZXMgPT0gbnVsbCkge1xuICAgICAgbnBjcyA9IFsnY29yZSddLmNvbmNhdCh0aGlzLm5hbWVTcGFjZXMpO1xuICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KHRoaXMucGFyZW50LmdldE5hbWVTcGFjZXMoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9uYW1lc3BhY2VzID0gQXJyYXlIZWxwZXIudW5pcXVlKG5wY3MpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcztcbiAgfVxuXG4gIGdldENtZChjbWROYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMpO1xuICAgIHJldHVybiBmaW5kZXIuZmluZCgpO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgbmFtZXNwYWNlczogW10sXG4gICAgICB1c2VEZXRlY3RvcnM6IHRoaXMuaXNSb290KCksXG4gICAgICBjb2Rld2F2ZTogdGhpcy5jb2Rld2F2ZSxcbiAgICAgIHBhcmVudENvbnRleHQ6IHRoaXNcbiAgICB9LCBvcHRpb25zKSk7XG4gIH1cblxuICBpc1Jvb3QoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09IG51bGw7XG4gIH1cblxuICBnZXRQYXJlbnRPclJvb3QoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnQoc3RyKSB7XG4gICAgdmFyIGNjO1xuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpO1xuICAgIGlmIChjYy5pbmRleE9mKCclcycpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsIHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50TGVmdChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gY2Muc3Vic3RyKDAsIGkpICsgc3RyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHI7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnRSaWdodChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkgKyAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIGNtZEluc3RhbmNlRm9yKGNtZCkge1xuICAgIHJldHVybiBuZXcgQ21kSW5zdGFuY2UoY21kLCB0aGlzKTtcbiAgfVxuXG4gIGdldENvbW1lbnRDaGFyKCkge1xuICAgIHZhciBjaGFyLCBjbWQsIGluc3QsIHJlcztcbiAgICBpZiAodGhpcy5jb21tZW50Q2hhciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgICB9XG4gICAgY21kID0gdGhpcy5nZXRDbWQoJ2NvbW1lbnQnKTtcbiAgICBjaGFyID0gJzwhLS0gJXMgLS0+JztcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGluc3QgPSB0aGlzLmNtZEluc3RhbmNlRm9yKGNtZCk7XG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnO1xuICAgICAgcmVzID0gaW5zdC5yZXN1bHQoKTtcbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICBjaGFyID0gcmVzO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbW1lbnRDaGFyID0gY2hhcjtcbiAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUGFpciB9IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCBjbGFzcyBEZXRlY3RvclxuICBjb25zdHJ1Y3RvcjogKEBkYXRhPXt9KSAtPlxuICBkZXRlY3Q6IChmaW5kZXIpIC0+XG4gICAgaWYgQGRldGVjdGVkKGZpbmRlcilcbiAgICAgIHJldHVybiBAZGF0YS5yZXN1bHQgaWYgQGRhdGEucmVzdWx0P1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBAZGF0YS5lbHNlIGlmIEBkYXRhLmVsc2U/XG4gIGRldGVjdGVkOiAoZmluZGVyKSAtPlxuICAgICNcblxuZXhwb3J0IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yXG4gIGRldGVjdDogKGZpbmRlcikgLT5cbiAgICBpZiBmaW5kZXIuY29kZXdhdmU/IFxuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpXG4gICAgICBpZiBsYW5nPyBcbiAgICAgICAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKVxuICAgICAgICBcbmV4cG9ydCBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvclxuICBkZXRlY3RlZDogKGZpbmRlcikgLT5cbiAgICBpZiBAZGF0YS5vcGVuZXI/IGFuZCBAZGF0YS5jbG9zZXI/IGFuZCBmaW5kZXIuaW5zdGFuY2U/XG4gICAgICBwYWlyID0gbmV3IFBhaXIoQGRhdGEub3BlbmVyLCBAZGF0YS5jbG9zZXIsIEBkYXRhKVxuICAgICAgaWYgcGFpci5pc1dhcHBlck9mKGZpbmRlci5pbnN0YW5jZS5nZXRQb3MoKSwgZmluZGVyLmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gICAgICAiLCJpbXBvcnQge1xuICBQYWlyXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCB2YXIgRGV0ZWN0b3IgPSBjbGFzcyBEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEgPSB7fSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cblxuICBkZXRlY3QoZmluZGVyKSB7XG4gICAgaWYgKHRoaXMuZGV0ZWN0ZWQoZmluZGVyKSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5yZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnJlc3VsdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZGF0YS5lbHNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5lbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRldGVjdGVkKGZpbmRlcikge31cblxufTtcblxuXG5leHBvcnQgdmFyIExhbmdEZXRlY3RvciA9IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIHZhciBsYW5nO1xuICAgIGlmIChmaW5kZXIuY29kZXdhdmUgIT0gbnVsbCkge1xuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpO1xuICAgICAgaWYgKGxhbmcgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG5leHBvcnQgdmFyIFBhaXJEZXRlY3RvciA9IGNsYXNzIFBhaXJEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0ZWQoZmluZGVyKSB7XG4gICAgdmFyIHBhaXI7XG4gICAgaWYgKCh0aGlzLmRhdGEub3BlbmVyICE9IG51bGwpICYmICh0aGlzLmRhdGEuY2xvc2VyICE9IG51bGwpICYmIChmaW5kZXIuaW5zdGFuY2UgIT0gbnVsbCkpIHtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcih0aGlzLmRhdGEub3BlbmVyLCB0aGlzLmRhdGEuY2xvc2VyLCB0aGlzLmRhdGEpO1xuICAgICAgaWYgKHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEVkaXRDbWRQcm9wXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsb3B0aW9ucykgLT5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICd2YXInIDogbnVsbCxcbiAgICAgICdvcHQnIDogbnVsbCxcbiAgICAgICdmdW5jdCcgOiBudWxsLFxuICAgICAgJ2RhdGFOYW1lJyA6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JyA6IGZhbHNlLFxuICAgICAgJ2NhcnJldCcgOiBmYWxzZSxcbiAgICB9XG4gICAgZm9yIGtleSBpbiBbJ3ZhcicsJ29wdCcsJ2Z1bmN0J11cbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIGRlZmF1bHRzWydkYXRhTmFtZSddID0gb3B0aW9uc1trZXldXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICAgIFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKEBuYW1lKVxuICBcbiAgd3JpdGVGb3I6IChwYXJzZXIsb2JqKSAtPlxuICAgIGlmIHBhcnNlci52YXJzW0BuYW1lXT9cbiAgICAgIG9ialtAZGF0YU5hbWVdID0gcGFyc2VyLnZhcnNbQG5hbWVdXG4gIHZhbEZyb21DbWQ6IChjbWQpIC0+XG4gICAgaWYgY21kP1xuICAgICAgaWYgQG9wdD9cbiAgICAgICAgcmV0dXJuIGNtZC5nZXRPcHRpb24oQG9wdClcbiAgICAgIGlmIEBmdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZFtAZnVuY3RdKClcbiAgICAgIGlmIEB2YXI/XG4gICAgICAgIHJldHVybiBjbWRbQHZhcl1cbiAgc2hvd0ZvckNtZDogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIEBzaG93RW1wdHkgb3IgdmFsP1xuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIGlmIEBzaG93Rm9yQ21kKGNtZClcbiAgICAgIFwiXCJcIlxuICAgICAgfn4je0BuYW1lfX5+XG4gICAgICAje0B2YWxGcm9tQ21kKGNtZCkgb3IgXCJcIn0je2lmIEBjYXJyZXQgdGhlbiBcInxcIiBlbHNlIFwiXCJ9XG4gICAgICB+fi8je0BuYW1lfX5+XG4gICAgICBcIlwiXCJcbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnNvdXJjZSBleHRlbmRzIEVkaXRDbWRQcm9wIFxuICB2YWxGcm9tQ21kOiAoY21kKS0+XG4gICAgcmVzID0gc3VwZXIoY21kKVxuICAgIGlmIHJlcz9cbiAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKC9cXHwvZywgJ3x8JylcbiAgICByZXR1cm4gcmVzXG4gIHNldENtZDogKGNtZHMpLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZChAbmFtZSx7J3ByZXZlbnRQYXJzZUFsbCcgOiB0cnVlfSlcbiAgc2hvd0ZvckNtZDogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIChAc2hvd0VtcHR5IGFuZCAhKGNtZD8gYW5kIGNtZC5hbGlhc09mPykpIG9yIHZhbD9cbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnN0cmluZyBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgaWYgQHZhbEZyb21DbWQoY21kKT9cbiAgICAgIHJldHVybiBcIn5+ISN7QG5hbWV9ICcje0B2YWxGcm9tQ21kKGNtZCl9I3tpZiBAY2FycmV0IHRoZW4gXCJ8XCIgZWxzZSBcIlwifSd+flwiXG4gICAgXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5yZXZCb29sIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgc2V0Q21kOiAoY21kcykgLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQoQG5hbWUpXG4gIHdyaXRlRm9yOiAocGFyc2VyLG9iaikgLT5cbiAgICBpZiBwYXJzZXIudmFyc1tAbmFtZV0/XG4gICAgICBvYmpbQGRhdGFOYW1lXSA9ICFwYXJzZXIudmFyc1tAbmFtZV1cbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgaWYgdmFsPyBhbmQgIXZhbFxuICAgICAgcmV0dXJuIFwifn4hI3tAbmFtZX1+flwiXG5cbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLmJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZChAbmFtZSlcbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICBcIn5+ISN7QG5hbWV9fn5cIiBpZiBAdmFsRnJvbUNtZChjbWQpIiwiaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIEVkaXRDbWRQcm9wID0gY2xhc3MgRWRpdENtZFByb3Age1xuICBjb25zdHJ1Y3RvcihuYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBpLCBrZXksIGxlbiwgcmVmLCB2YWw7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICd2YXInOiBudWxsLFxuICAgICAgJ29wdCc6IG51bGwsXG4gICAgICAnZnVuY3QnOiBudWxsLFxuICAgICAgJ2RhdGFOYW1lJzogbnVsbCxcbiAgICAgICdzaG93RW1wdHknOiBmYWxzZSxcbiAgICAgICdjYXJyZXQnOiBmYWxzZVxuICAgIH07XG4gICAgcmVmID0gWyd2YXInLCAnb3B0JywgJ2Z1bmN0J107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBrZXkgPSByZWZbaV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgZGVmYXVsdHNbJ2RhdGFOYW1lJ10gPSBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIHdyaXRlRm9yKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9ialt0aGlzLmRhdGFOYW1lXSA9IHBhcnNlci52YXJzW3RoaXMubmFtZV07XG4gICAgfVxuICB9XG5cbiAgdmFsRnJvbUNtZChjbWQpIHtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLm9wdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZ2V0T3B0aW9uKHRoaXMub3B0KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLmZ1bmN0XSgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudmFyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLnZhcl07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2hvd0ZvckNtZChjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIHJldHVybiB0aGlzLnNob3dFbXB0eSB8fCAodmFsICE9IG51bGwpO1xuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy5zaG93Rm9yQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4ke3RoaXMubmFtZX1+flxcbiR7dGhpcy52YWxGcm9tQ21kKGNtZCkgfHwgXCJcIn0keyh0aGlzLmNhcnJldCA/IFwifFwiIDogXCJcIil9XFxufn4vJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5zb3VyY2UgPSBjbGFzcyBzb3VyY2UgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHZhbEZyb21DbWQoY21kKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBzdXBlci52YWxGcm9tQ21kKGNtZCk7XG4gICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICByZXMgPSByZXMucmVwbGFjZSgvXFx8L2csICd8fCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSwge1xuICAgICAgJ3ByZXZlbnRQYXJzZUFsbCc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHNob3dGb3JDbWQoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICByZXR1cm4gKHRoaXMuc2hvd0VtcHR5ICYmICEoKGNtZCAhPSBudWxsKSAmJiAoY21kLmFsaWFzT2YgIT0gbnVsbCkpKSB8fCAodmFsICE9IG51bGwpO1xuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLnN0cmluZyA9IGNsYXNzIHN0cmluZyBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX0gJyR7dGhpcy52YWxGcm9tQ21kKGNtZCl9JHsodGhpcy5jYXJyZXQgPyBcInxcIiA6IFwiXCIpfSd+fmA7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLnJldkJvb2wgPSBjbGFzcyByZXZCb29sIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICB3cml0ZUZvcihwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbdGhpcy5uYW1lXTtcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG4gICAgaWYgKCh2YWwgIT0gbnVsbCkgJiYgIXZhbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLmJvb2wgPSBjbGFzcyBib29sIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnZhbEZyb21DbWQoY21kKSkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5pbXBvcnQgeyBvcHRpb25hbFByb21pc2UgfSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IGNsYXNzIEVkaXRvclxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAbmFtZXNwYWNlID0gbnVsbFxuICAgIEBfbGFuZyA9IG51bGxcbiAgYmluZGVkVG86IChjb2Rld2F2ZSkgLT5cbiAgICAjXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dExlbjogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRTdWJzdHI6IChzdGFydCwgZW5kKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgaW5zZXJ0VGV4dEF0OiAodGV4dCwgcG9zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kID0gbnVsbCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGJlZ2luVW5kb0FjdGlvbjogLT5cbiAgICAjXG4gIGVuZFVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBnZXRMYW5nOiAtPlxuICAgIHJldHVybiBAX2xhbmdcbiAgc2V0TGFuZzogKHZhbCkgLT5cbiAgICBAX2xhbmcgPSB2YWxcbiAgZ2V0RW1tZXRDb250ZXh0T2JqZWN0OiAtPlxuICAgIHJldHVybiBudWxsXG4gIGFsbG93TXVsdGlTZWxlY3Rpb246IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIHNldE11bHRpU2VsOiAoc2VsZWN0aW9ucykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGdldE11bHRpU2VsOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgY2FuTGlzdGVuVG9DaGFuZ2U6IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIGFkZENoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgXG4gIGdldExpbmVBdDogKHBvcykgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAZmluZExpbmVTdGFydChwb3MpLEBmaW5kTGluZUVuZChwb3MpKVxuICBmaW5kTGluZVN0YXJ0OiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCJdLCAtMSlcbiAgICByZXR1cm4gaWYgcCB0aGVuIHAucG9zKzEgZWxzZSAwXG4gIGZpbmRMaW5lRW5kOiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCIsXCJcXHJcIl0pXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcyBlbHNlIEB0ZXh0TGVuKClcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBpZiBkaXJlY3Rpb24gPiAwXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoc3RhcnQsQHRleHRMZW4oKSlcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoMCxzdGFydClcbiAgICBiZXN0UG9zID0gbnVsbFxuICAgIGZvciBzdHJpIGluIHN0cmluZ3NcbiAgICAgIHBvcyA9IGlmIGRpcmVjdGlvbiA+IDAgdGhlbiB0ZXh0LmluZGV4T2Yoc3RyaSkgZWxzZSB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpXG4gICAgICBpZiBwb3MgIT0gLTFcbiAgICAgICAgaWYgIWJlc3RQb3M/IG9yIGJlc3RQb3MqZGlyZWN0aW9uID4gcG9zKmRpcmVjdGlvblxuICAgICAgICAgIGJlc3RQb3MgPSBwb3NcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaVxuICAgIGlmIGJlc3RTdHI/XG4gICAgICByZXR1cm4gbmV3IFN0clBvcygoaWYgZGlyZWN0aW9uID4gMCB0aGVuIGJlc3RQb3MgKyBzdGFydCBlbHNlIGJlc3RQb3MpLGJlc3RTdHIpXG4gICAgcmV0dXJuIG51bGxcbiAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzOiAocmVwbGFjZW1lbnRzKSAtPlxuICAgIHJlcGxhY2VtZW50cy5yZWR1Y2UoKHByb21pc2UscmVwbCk9PlxuICAgICAgICBwcm9taXNlLnRoZW4gKG9wdCk9PlxuICAgICAgICAgIHJlcGwud2l0aEVkaXRvcih0aGlzKVxuICAgICAgICAgIHJlcGwuYXBwbHlPZmZzZXQob3B0Lm9mZnNldClcbiAgICAgICAgICBvcHRpb25hbFByb21pc2UocmVwbC5hcHBseSgpKS50aGVuID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlbGVjdGlvbnM6IG9wdC5zZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpLFxuICAgICAgICAgICAgICBvZmZzZXQ6IG9wdC5vZmZzZXQrcmVwbC5vZmZzZXRBZnRlcih0aGlzKSBcbiAgICAgICAgICAgIH1cbiAgICAgICwgb3B0aW9uYWxQcm9taXNlKHtzZWxlY3Rpb25zOiBbXSxvZmZzZXQ6IDB9KSlcbiAgICAudGhlbiAob3B0KT0+XG4gICAgICBAYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKG9wdC5zZWxlY3Rpb25zKVxuICAgIC5yZXN1bHQoKVxuICAgIFxuICAgICAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9uczogKHNlbGVjdGlvbnMpIC0+XG4gICAgaWYgc2VsZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICBpZiBAYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgICAgIEBzZXRNdWx0aVNlbChzZWxlY3Rpb25zKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0Q3Vyc29yUG9zKHNlbGVjdGlvbnNbMF0uc3RhcnQsc2VsZWN0aW9uc1swXS5lbmQpIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgU3RyUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcblxuaW1wb3J0IHtcbiAgb3B0aW9uYWxQcm9taXNlXG59IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgdmFyIEVkaXRvciA9IGNsYXNzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubmFtZXNwYWNlID0gbnVsbDtcbiAgICB0aGlzLl9sYW5nID0gbnVsbDtcbiAgfVxuXG4gIGJpbmRlZFRvKGNvZGV3YXZlKSB7fVxuXG4gIFxuICB0ZXh0KHZhbCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0TGVuKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0U3Vic3RyKHN0YXJ0LCBlbmQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgaW5zZXJ0VGV4dEF0KHRleHQsIHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCA9IG51bGwpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgYmVnaW5VbmRvQWN0aW9uKCkge31cblxuICBcbiAgZW5kVW5kb0FjdGlvbigpIHt9XG5cbiAgXG4gIGdldExhbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhbmc7XG4gIH1cblxuICBzZXRMYW5nKHZhbCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nID0gdmFsO1xuICB9XG5cbiAgZ2V0RW1tZXRDb250ZXh0T2JqZWN0KCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYWxsb3dNdWx0aVNlbGVjdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzZXRNdWx0aVNlbChzZWxlY3Rpb25zKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGdldE11bHRpU2VsKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBjYW5MaXN0ZW5Ub0NoYW5nZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRMaW5lQXQocG9zKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5maW5kTGluZVN0YXJ0KHBvcyksIHRoaXMuZmluZExpbmVFbmQocG9zKSk7XG4gIH1cblxuICBmaW5kTGluZVN0YXJ0KHBvcykge1xuICAgIHZhciBwO1xuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW1wiXFxuXCJdLCAtMSk7XG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcyArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRMaW5lRW5kKHBvcykge1xuICAgIHZhciBwO1xuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW1wiXFxuXCIsIFwiXFxyXCJdKTtcbiAgICBpZiAocCkge1xuICAgICAgcmV0dXJuIHAucG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0TGVuKCk7XG4gICAgfVxuICB9XG5cbiAgZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICB2YXIgYmVzdFBvcywgYmVzdFN0ciwgaSwgbGVuLCBwb3MsIHN0cmksIHRleHQ7XG4gICAgaWYgKGRpcmVjdGlvbiA+IDApIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQsIHRoaXMudGV4dExlbigpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cigwLCBzdGFydCk7XG4gICAgfVxuICAgIGJlc3RQb3MgPSBudWxsO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHN0cmluZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0cmkgPSBzdHJpbmdzW2ldO1xuICAgICAgcG9zID0gZGlyZWN0aW9uID4gMCA/IHRleHQuaW5kZXhPZihzdHJpKSA6IHRleHQubGFzdEluZGV4T2Yoc3RyaSk7XG4gICAgICBpZiAocG9zICE9PSAtMSkge1xuICAgICAgICBpZiAoKGJlc3RQb3MgPT0gbnVsbCkgfHwgYmVzdFBvcyAqIGRpcmVjdGlvbiA+IHBvcyAqIGRpcmVjdGlvbikge1xuICAgICAgICAgIGJlc3RQb3MgPSBwb3M7XG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJlc3RTdHIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoKGRpcmVjdGlvbiA+IDAgPyBiZXN0UG9zICsgc3RhcnQgOiBiZXN0UG9zKSwgYmVzdFN0cik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VtZW50cy5yZWR1Y2UoKHByb21pc2UsIHJlcGwpID0+IHtcbiAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKG9wdCkgPT4ge1xuICAgICAgICByZXBsLndpdGhFZGl0b3IodGhpcyk7XG4gICAgICAgIHJlcGwuYXBwbHlPZmZzZXQob3B0Lm9mZnNldCk7XG4gICAgICAgIHJldHVybiBvcHRpb25hbFByb21pc2UocmVwbC5hcHBseSgpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0aW9uczogb3B0LnNlbGVjdGlvbnMuY29uY2F0KHJlcGwuc2VsZWN0aW9ucyksXG4gICAgICAgICAgICBvZmZzZXQ6IG9wdC5vZmZzZXQgKyByZXBsLm9mZnNldEFmdGVyKHRoaXMpXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LCBvcHRpb25hbFByb21pc2Uoe1xuICAgICAgc2VsZWN0aW9uczogW10sXG4gICAgICBvZmZzZXQ6IDBcbiAgICB9KSkudGhlbigob3B0KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMob3B0LnNlbGVjdGlvbnMpO1xuICAgIH0pLnJlc3VsdCgpO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKHNlbGVjdGlvbnMpIHtcbiAgICBpZiAoc2VsZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TXVsdGlTZWwoc2VsZWN0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCwgc2VsZWN0aW9uc1swXS5lbmQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIExvZ2dlclxuICBAZW5hYmxlZCA9IHRydWVcbiAgbG9nOiAoYXJncy4uLikgLT5cbiAgICBpZiBAaXNFbmFibGVkKClcbiAgICAgIGZvciBtc2cgaW4gYXJnc1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpXG4gIGlzRW5hYmxlZDogLT5cbiAgICBjb25zb2xlPy5sb2c/IGFuZCB0aGlzLmVuYWJsZWQgYW5kIExvZ2dlci5lbmFibGVkXG4gIGVuYWJsZWQ6IHRydWVcbiAgcnVudGltZTogKGZ1bmN0LG5hbWUgPSBcImZ1bmN0aW9uXCIpIC0+XG4gICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlcyA9IGZ1bmN0KClcbiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgY29uc29sZS5sb2coXCIje25hbWV9IHRvb2sgI3t0MSAtIHQwfSBtaWxsaXNlY29uZHMuXCIpXG4gICAgcmVzXG4gIG1vbml0b3JEYXRhOiB7fVxuICB0b01vbml0b3I6IChvYmosbmFtZSxwcmVmaXg9JycpIC0+XG4gICAgZnVuY3QgPSBvYmpbbmFtZV1cbiAgICBvYmpbbmFtZV0gPSAtPiBcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICAgIHRoaXMubW9uaXRvcigoLT4gZnVuY3QuYXBwbHkob2JqLGFyZ3MpKSxwcmVmaXgrbmFtZSlcbiAgbW9uaXRvcjogKGZ1bmN0LG5hbWUpIC0+XG4gICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlcyA9IGZ1bmN0KClcbiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgaWYgdGhpcy5tb25pdG9yRGF0YVtuYW1lXT9cbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrK1xuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCs9IHQxIC0gdDBcbiAgICBlbHNlXG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdID0ge1xuICAgICAgICBjb3VudDogMVxuICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgfVxuICAgIHJlc1xuICByZXN1bWU6IC0+XG4gICAgY29uc29sZS5sb2codGhpcy5tb25pdG9yRGF0YSlcbiIsImV4cG9ydCB2YXIgTG9nZ2VyID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBMb2dnZXIge1xuICAgIGxvZyguLi5hcmdzKSB7XG4gICAgICB2YXIgaSwgbGVuLCBtc2csIHJlc3VsdHM7XG4gICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBtc2cgPSBhcmdzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjb25zb2xlLmxvZyhtc2cpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICByZXR1cm4gKCh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlICE9PSBudWxsID8gY29uc29sZS5sb2cgOiB2b2lkIDApICE9IG51bGwpICYmIHRoaXMuZW5hYmxlZCAmJiBMb2dnZXIuZW5hYmxlZDtcbiAgICB9XG5cbiAgICBydW50aW1lKGZ1bmN0LCBuYW1lID0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDE7XG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgcmVzID0gZnVuY3QoKTtcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfSB0b29rICR7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLmApO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICB0b01vbml0b3Iob2JqLCBuYW1lLCBwcmVmaXggPSAnJykge1xuICAgICAgdmFyIGZ1bmN0O1xuICAgICAgZnVuY3QgPSBvYmpbbmFtZV07XG4gICAgICByZXR1cm4gb2JqW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gdGhpcy5tb25pdG9yKChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3QuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgfSksIHByZWZpeCArIG5hbWUpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBtb25pdG9yKGZ1bmN0LCBuYW1lKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDE7XG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgcmVzID0gZnVuY3QoKTtcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBpZiAodGhpcy5tb25pdG9yRGF0YVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrKztcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCArPSB0MSAtIHQwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICByZXN1bWUoKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2codGhpcy5tb25pdG9yRGF0YSk7XG4gICAgfVxuXG4gIH07XG5cbiAgTG9nZ2VyLmVuYWJsZWQgPSB0cnVlO1xuXG4gIExvZ2dlci5wcm90b3R5cGUuZW5hYmxlZCA9IHRydWU7XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5tb25pdG9yRGF0YSA9IHt9O1xuXG4gIHJldHVybiBMb2dnZXI7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJleHBvcnQgY2xhc3MgT3B0aW9uT2JqZWN0XG4gIHNldE9wdHM6IChvcHRpb25zLGRlZmF1bHRzKS0+XG4gICAgQGRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICBAc2V0T3B0KGtleSxvcHRpb25zW2tleV0pXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRPcHQoa2V5LHZhbClcbiAgICAgICAgXG4gIHNldE9wdDogKGtleSwgdmFsKS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgdGhpc1trZXldKHZhbClcbiAgICBlbHNlXG4gICAgICB0aGlzW2tleV09IHZhbFxuICAgICAgICBcbiAgZ2V0T3B0OiAoa2V5KS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXNba2V5XVxuICBcbiAgZ2V0T3B0czogLT5cbiAgICBvcHRzID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRzW2tleV0gPSBAZ2V0T3B0KGtleSlcbiAgICByZXR1cm4gb3B0cyIsImV4cG9ydCB2YXIgT3B0aW9uT2JqZWN0ID0gY2xhc3MgT3B0aW9uT2JqZWN0IHtcbiAgc2V0T3B0cyhvcHRpb25zLCBkZWZhdWx0cykge1xuICAgIHZhciBrZXksIHJlZiwgcmVzdWx0cywgdmFsO1xuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIG9wdGlvbnNba2V5XSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc2V0T3B0KGtleSwgdmFsKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgc2V0T3B0KGtleSwgdmFsKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdChrZXkpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXNba2V5XSkgIT0gbnVsbCA/IHJlZi5jYWxsIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV07XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0cygpIHtcbiAgICB2YXIga2V5LCBvcHRzLCByZWYsIHZhbDtcbiAgICBvcHRzID0ge307XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgb3B0c1trZXldID0gdGhpcy5nZXRPcHQoa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdHM7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuL0JveEhlbHBlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsQHBvcyxAc3RyKSAtPlxuICAgIHN1cGVyKClcbiAgICB1bmxlc3MgQGlzRW1wdHkoKVxuICAgICAgQF9jaGVja0Nsb3NlcigpXG4gICAgICBAb3BlbmluZyA9IEBzdHJcbiAgICAgIEBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICAgIEBfc3BsaXRDb21wb25lbnRzKClcbiAgICAgIEBfZmluZENsb3NpbmcoKVxuICAgICAgQF9jaGVja0Vsb25nYXRlZCgpXG4gIF9jaGVja0Nsb3NlcjogLT5cbiAgICBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICBpZiBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5jbG9zZUNoYXIgYW5kIGYgPSBAX2ZpbmRPcGVuaW5nUG9zKClcbiAgICAgIEBjbG9zaW5nUG9zID0gbmV3IFN0clBvcyhAcG9zLCBAc3RyKVxuICAgICAgQHBvcyA9IGYucG9zXG4gICAgICBAc3RyID0gZi5zdHJcbiAgX2ZpbmRPcGVuaW5nUG9zOiAtPlxuICAgIGNtZE5hbWUgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cikuc3Vic3RyaW5nKEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKVxuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWVcbiAgICBjbG9zaW5nID0gQHN0clxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zLG9wZW5pbmcsY2xvc2luZywtMSlcbiAgICAgIGYuc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcytmLnN0ci5sZW5ndGgpK0Bjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgICAgIHJldHVybiBmXG4gIF9zcGxpdENvbXBvbmVudHM6IC0+XG4gICAgcGFydHMgPSBAbm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICBAY21kTmFtZSA9IHBhcnRzLnNoaWZ0KClcbiAgICBAcmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIilcbiAgX3BhcnNlUGFyYW1zOihwYXJhbXMpIC0+XG4gICAgQHBhcmFtcyA9IFtdXG4gICAgQG5hbWVkID0gQGdldERlZmF1bHRzKClcbiAgICBpZiBAY21kP1xuICAgICAgbmFtZVRvUGFyYW0gPSBAZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpXG4gICAgICBpZiBuYW1lVG9QYXJhbT8gXG4gICAgICAgIEBuYW1lZFtuYW1lVG9QYXJhbV0gPSBAY21kTmFtZVxuICAgIGlmIHBhcmFtcy5sZW5ndGhcbiAgICAgIGlmIEBjbWQ/XG4gICAgICAgIGFsbG93ZWROYW1lZCA9IEBjbWQuYWxsb3dlZE5hbWVkXG4gICAgICBpblN0ciA9IGZhbHNlXG4gICAgICBwYXJhbSA9ICcnXG4gICAgICBuYW1lID0gZmFsc2VcbiAgICAgIGZvciBpIGluIFswLi4ocGFyYW1zLmxlbmd0aC0xKV1cbiAgICAgICAgY2hyID0gcGFyYW1zW2ldXG4gICAgICAgIGlmIGNociA9PSAnICcgYW5kICFpblN0clxuICAgICAgICAgIGlmKG5hbWUpXG4gICAgICAgICAgICBAbmFtZWRbbmFtZV0gPSBwYXJhbVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBwYXJhbXMucHVzaChwYXJhbSlcbiAgICAgICAgICBwYXJhbSA9ICcnXG4gICAgICAgICAgbmFtZSA9IGZhbHNlXG4gICAgICAgIGVsc2UgaWYgY2hyIGluIFsnXCInLFwiJ1wiXSBhbmQgKGkgPT0gMCBvciBwYXJhbXNbaS0xXSAhPSAnXFxcXCcpXG4gICAgICAgICAgaW5TdHIgPSAhaW5TdHJcbiAgICAgICAgZWxzZSBpZiBjaHIgPT0gJzonIGFuZCAhbmFtZSBhbmQgIWluU3RyIGFuZCAoIWFsbG93ZWROYW1lZD8gb3IgbmFtZSBpbiBhbGxvd2VkTmFtZWQpXG4gICAgICAgICAgbmFtZSA9IHBhcmFtXG4gICAgICAgICAgcGFyYW0gPSAnJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcGFyYW0gKz0gY2hyXG4gICAgICBpZiBwYXJhbS5sZW5ndGhcbiAgICAgICAgaWYobmFtZSlcbiAgICAgICAgICBAbmFtZWRbbmFtZV0gPSBwYXJhbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHBhcmFtcy5wdXNoKHBhcmFtKVxuICBfZmluZENsb3Npbmc6IC0+XG4gICAgaWYgZiA9IEBfZmluZENsb3NpbmdQb3MoKVxuICAgICAgQGNvbnRlbnQgPSBTdHJpbmdIZWxwZXIudHJpbUVtcHR5TGluZShAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcytAc3RyLmxlbmd0aCxmLnBvcykpXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZi5wb3MrZi5zdHIubGVuZ3RoKVxuICBfZmluZENsb3NpbmdQb3M6IC0+XG4gICAgcmV0dXJuIEBjbG9zaW5nUG9zIGlmIEBjbG9zaW5nUG9zP1xuICAgIGNsb3NpbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY21kTmFtZSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgb3BlbmluZyA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNtZE5hbWVcbiAgICBpZiBmID0gQGNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIoQHBvcytAc3RyLmxlbmd0aCwgb3BlbmluZywgY2xvc2luZylcbiAgICAgIHJldHVybiBAY2xvc2luZ1BvcyA9IGZcbiAgX2NoZWNrRWxvbmdhdGVkOiAtPlxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKVxuICAgIG1heCA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpXG4gICAgd2hpbGUgZW5kUG9zIDwgbWF4IGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLGVuZFBvcytAY29kZXdhdmUuZGVjby5sZW5ndGgpID09IEBjb2Rld2F2ZS5kZWNvXG4gICAgICBlbmRQb3MrPUBjb2Rld2F2ZS5kZWNvLmxlbmd0aFxuICAgIGlmIGVuZFBvcyA+PSBtYXggb3IgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSBpbiBbJyAnLFwiXFxuXCIsXCJcXHJcIl1cbiAgICAgIEBzdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyxlbmRQb3MpXG4gIF9jaGVja0JveDogLT5cbiAgICBpZiBAY29kZXdhdmUuaW5JbnN0YW5jZT8gYW5kIEBjb2Rld2F2ZS5pbkluc3RhbmNlLmNtZC5uYW1lID09ICdjb21tZW50J1xuICAgICAgcmV0dXJuXG4gICAgY2wgPSBAY29udGV4dC53cmFwQ29tbWVudExlZnQoKVxuICAgIGNyID0gQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpXG4gICAgZW5kUG9zID0gQGdldEVuZFBvcygpICsgY3IubGVuZ3RoXG4gICAgaWYgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MgLSBjbC5sZW5ndGgsQHBvcykgPT0gY2wgYW5kIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MgLSBjci5sZW5ndGgsZW5kUG9zKSA9PSBjclxuICAgICAgQHBvcyA9IEBwb3MgLSBjbC5sZW5ndGhcbiAgICAgIEBzdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyxlbmRQb3MpXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gICAgZWxzZSBpZiBAZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkuaW5kZXhPZihjbCkgPiAtMSBhbmQgQGdldFBvcygpLnNhbWVMaW5lc1N1ZmZpeCgpLmluZGV4T2YoY3IpID4gLTFcbiAgICAgIEBpbkJveCA9IDFcbiAgICAgIEBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KClcbiAgX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudDogLT5cbiAgICBpZiBAY29udGVudFxuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKVxuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb2Rld2F2ZS5kZWNvKVxuICAgICAgcmUxID0gbmV3IFJlZ0V4cChcIl5cXFxccyoje2VjbH0oPzoje2VkfSkrXFxcXHMqKC4qPylcXFxccyooPzoje2VkfSkrI3tlY3J9JFwiLCBcImdtXCIpXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXHI/XFxuXCIpXG4gICAgICByZTMgPSBuZXcgUmVnRXhwKFwiXFxuXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzKiRcIilcbiAgICAgIEBjb250ZW50ID0gQGNvbnRlbnQucmVwbGFjZShyZTEsJyQxJykucmVwbGFjZShyZTIsJycpLnJlcGxhY2UocmUzLCcnKVxuICBfZ2V0UGFyZW50Q21kczogLT5cbiAgICBAcGFyZW50ID0gQGNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZChAZ2V0RW5kUG9zKCkpPy5pbml0KClcbiAgc2V0TXVsdGlQb3M6IChtdWx0aVBvcykgLT5cbiAgICBAbXVsdGlQb3MgPSBtdWx0aVBvc1xuICBfZ2V0Q21kT2JqOiAtPlxuICAgIEBnZXRDbWQoKVxuICAgIEBfY2hlY2tCb3goKVxuICAgIEBjb250ZW50ID0gQHJlbW92ZUluZGVudEZyb21Db250ZW50KEBjb250ZW50KVxuICAgIHN1cGVyKClcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQF9wYXJzZVBhcmFtcyhAcmF3UGFyYW1zKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHJldHVybiBAY29udGV4dCBvciBAY29kZXdhdmUuY29udGV4dFxuICBnZXRDbWQ6IC0+XG4gICAgdW5sZXNzIEBjbWQ/XG4gICAgICBAX2dldFBhcmVudENtZHMoKVxuICAgICAgaWYgQG5vQnJhY2tldC5zdWJzdHJpbmcoMCxAY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyXG4gICAgICAgIEBjbWQgPSBDb21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKVxuICAgICAgICBAY29udGV4dCA9IEBjb2Rld2F2ZS5jb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIEBmaW5kZXIgPSBAZ2V0RmluZGVyKEBjbWROYW1lKVxuICAgICAgICBAY29udGV4dCA9IEBmaW5kZXIuY29udGV4dFxuICAgICAgICBAY21kID0gQGZpbmRlci5maW5kKClcbiAgICAgICAgaWYgQGNtZD9cbiAgICAgICAgICBAY29udGV4dC5hZGROYW1lU3BhY2UoQGNtZC5mdWxsTmFtZSlcbiAgICByZXR1cm4gQGNtZFxuICBnZXRGaW5kZXI6IChjbWROYW1lKS0+XG4gICAgZmluZGVyID0gQGNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsbmFtZXNwYWNlczpAX2dldFBhcmVudE5hbWVzcGFjZXMoKSlcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzXG4gICAgcmV0dXJuIGZpbmRlclxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICBuc3BjcyA9IFtdXG4gICAgb2JqID0gdGhpc1xuICAgIHdoaWxlIG9iai5wYXJlbnQ/XG4gICAgICBvYmogPSBvYmoucGFyZW50XG4gICAgICBuc3Bjcy5wdXNoKG9iai5jbWQuZnVsbE5hbWUpIGlmIG9iai5jbWQ/IGFuZCBvYmouY21kLmZ1bGxOYW1lP1xuICAgIHJldHVybiBuc3Bjc1xuICBfcmVtb3ZlQnJhY2tldDogKHN0ciktPlxuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCxzdHIubGVuZ3RoLUBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgYWx0ZXJBbGlhc09mOiAoYWxpYXNPZiktPlxuICAgIFtuc3BjLCBjbWROYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdChAY21kTmFtZSlcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLGNtZE5hbWUpXG4gIGlzRW1wdHk6IC0+XG4gICAgcmV0dXJuIEBzdHIgPT0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNvZGV3YXZlLmJyYWtldHMgb3IgQHN0ciA9PSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5icmFrZXRzXG4gIGV4ZWN1dGU6IC0+XG4gICAgaWYgQGlzRW1wdHkoKVxuICAgICAgaWYgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcD8gYW5kIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAud2hpdGhpbk9wZW5Cb3VuZHMoQHBvcyArIEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk/XG4gICAgICAgIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAuY2FuY2VsKClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlcGxhY2VXaXRoKCcnKVxuICAgIGVsc2UgaWYgQGNtZD9cbiAgICAgIGlmIGJlZm9yZUZ1bmN0ID0gQGdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpXG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpXG4gICAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgICBpZiAocmVzID0gQHJlc3VsdCgpKT9cbiAgICAgICAgICBAcmVwbGFjZVdpdGgocmVzKVxuICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBAcnVuRXhlY3V0ZUZ1bmN0KClcbiAgZ2V0RW5kUG9zOiAtPlxuICAgIHJldHVybiBAcG9zK0BzdHIubGVuZ3RoXG4gIGdldFBvczogLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAcG9zLEBwb3MrQHN0ci5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0T3BlbmluZ1BvczogLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAcG9zLEBwb3MrQG9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gIGdldEluZGVudDogLT5cbiAgICB1bmxlc3MgQGluZGVudExlbj9cbiAgICAgIGlmIEBpbkJveD9cbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcihAY29udGV4dClcbiAgICAgICAgQGluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KEBnZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKSkubGVuZ3RoXG4gICAgICBlbHNlXG4gICAgICAgIEBpbmRlbnRMZW4gPSBAcG9zIC0gQGdldFBvcygpLnByZXZFT0woKVxuICAgIHJldHVybiBAaW5kZW50TGVuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50OiAodGV4dCkgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycrQGdldEluZGVudCgpKyd9JywnZ20nKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsJycpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYWx0ZXJSZXN1bHRGb3JCb3g6IChyZXBsKSAtPlxuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KClcbiAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLGZhbHNlKVxuICAgIGlmIEBnZXRPcHRpb24oJ3JlcGxhY2VCb3gnKVxuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbClcbiAgICAgIFtyZXBsLnN0YXJ0LCByZXBsLmVuZF0gPSBbYm94LnN0YXJ0LCBib3guZW5kXVxuICAgICAgQGluZGVudExlbiA9IGhlbHBlci5pbmRlbnRcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKClcbiAgICAgIHJlcGwuZW5kID0gb3JpZ2luYWwubmV4dEVPTCgpXG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIEBjb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyBAY29kZXdhdmUubWFya2VyICsgb3JpZ2luYWwuc2FtZUxpbmVzU3VmZml4KCksIHttdWx0aWxpbmU6ZmFsc2V9KVxuICAgICAgW3JlcGwucHJlZml4LHJlcGwudGV4dCxyZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQoQGNvZGV3YXZlLm1hcmtlcilcbiAgICByZXR1cm4gcmVwbFxuICBnZXRDdXJzb3JGcm9tUmVzdWx0OiAocmVwbCkgLT5cbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpXG4gICAgaWYgQGNtZD8gYW5kIEBjb2Rld2F2ZS5jaGVja0NhcnJldCBhbmQgQGdldE9wdGlvbignY2hlY2tDYXJyZXQnKVxuICAgICAgaWYgKHAgPSBAY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpPyBcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCtyZXBsLnByZWZpeC5sZW5ndGgrcFxuICAgICAgcmVwbC50ZXh0ID0gQGNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpXG4gICAgcmV0dXJuIGN1cnNvclBvc1xuICBjaGVja011bHRpOiAocmVwbCkgLT5cbiAgICBpZiBAbXVsdGlQb3M/IGFuZCBAbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgcmVwbGFjZW1lbnRzID0gW3JlcGxdXG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpXG4gICAgICBmb3IgcG9zLCBpIGluIEBtdWx0aVBvc1xuICAgICAgICBpZiBpID09IDBcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydFxuICAgICAgICBlbHNlXG4gICAgICAgICAgbmV3UmVwbCA9IHJlcGwuY29weSgpLmFwcGx5T2Zmc2V0KHBvcy5zdGFydC1vcmlnaW5hbFBvcylcbiAgICAgICAgICBpZiBuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09IG9yaWdpbmFsVGV4dFxuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbClcbiAgICAgIHJldHVybiByZXBsYWNlbWVudHNcbiAgICBlbHNlXG4gICAgICByZXR1cm4gW3JlcGxdXG4gIHJlcGxhY2VXaXRoOiAodGV4dCkgLT5cbiAgICBAYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoQHBvcyxAZ2V0RW5kUG9zKCksdGV4dCkpXG4gIGFwcGx5UmVwbGFjZW1lbnQ6IChyZXBsKSAtPlxuICAgIHJlcGwud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICAgIGlmIEBpbkJveD9cbiAgICAgIEBhbHRlclJlc3VsdEZvckJveChyZXBsKVxuICAgIGVsc2VcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgY3Vyc29yUG9zID0gQGdldEN1cnNvckZyb21SZXN1bHQocmVwbClcbiAgICByZXBsLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyhjdXJzb3JQb3MsIGN1cnNvclBvcyldXG4gICAgcmVwbGFjZW1lbnRzID0gQGNoZWNrTXVsdGkocmVwbClcbiAgICBAcmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydFxuICAgIEByZXBsYWNlRW5kID0gcmVwbC5yZXNFbmQoKVxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICAgICIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5cbmltcG9ydCB7XG4gIEJveEhlbHBlclxufSBmcm9tICcuL0JveEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFN0clBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIE5hbWVzcGFjZUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSA9IGNsYXNzIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSBleHRlbmRzIENtZEluc3RhbmNlIHtcbiAgY29uc3RydWN0b3IoY29kZXdhdmUsIHBvczEsIHN0cjEpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTtcbiAgICB0aGlzLnBvcyA9IHBvczE7XG4gICAgdGhpcy5zdHIgPSBzdHIxO1xuICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHRoaXMuX2NoZWNrQ2xvc2VyKCk7XG4gICAgICB0aGlzLm9wZW5pbmcgPSB0aGlzLnN0cjtcbiAgICAgIHRoaXMubm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cik7XG4gICAgICB0aGlzLl9zcGxpdENvbXBvbmVudHMoKTtcbiAgICAgIHRoaXMuX2ZpbmRDbG9zaW5nKCk7XG4gICAgICB0aGlzLl9jaGVja0Vsb25nYXRlZCgpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Nsb3NlcigpIHtcbiAgICB2YXIgZiwgbm9CcmFja2V0O1xuICAgIG5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpO1xuICAgIGlmIChub0JyYWNrZXQuc3Vic3RyaW5nKDAsIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICYmIChmID0gdGhpcy5fZmluZE9wZW5pbmdQb3MoKSkpIHtcbiAgICAgIHRoaXMuY2xvc2luZ1BvcyA9IG5ldyBTdHJQb3ModGhpcy5wb3MsIHRoaXMuc3RyKTtcbiAgICAgIHRoaXMucG9zID0gZi5wb3M7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSBmLnN0cjtcbiAgICB9XG4gIH1cblxuICBfZmluZE9wZW5pbmdQb3MoKSB7XG4gICAgdmFyIGNsb3NpbmcsIGNtZE5hbWUsIGYsIG9wZW5pbmc7XG4gICAgY21kTmFtZSA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpO1xuICAgIG9wZW5pbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyBjbWROYW1lO1xuICAgIGNsb3NpbmcgPSB0aGlzLnN0cjtcbiAgICBpZiAoZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcywgb3BlbmluZywgY2xvc2luZywgLTEpKSB7XG4gICAgICBmLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZi5wb3MsIHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoZi5wb3MgKyBmLnN0ci5sZW5ndGgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk7XG4gICAgICByZXR1cm4gZjtcbiAgICB9XG4gIH1cblxuICBfc3BsaXRDb21wb25lbnRzKCkge1xuICAgIHZhciBwYXJ0cztcbiAgICBwYXJ0cyA9IHRoaXMubm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICB0aGlzLmNtZE5hbWUgPSBwYXJ0cy5zaGlmdCgpO1xuICAgIHJldHVybiB0aGlzLnJhd1BhcmFtcyA9IHBhcnRzLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgX3BhcnNlUGFyYW1zKHBhcmFtcykge1xuICAgIHZhciBhbGxvd2VkTmFtZWQsIGNociwgaSwgaW5TdHIsIGosIG5hbWUsIG5hbWVUb1BhcmFtLCBwYXJhbSwgcmVmO1xuICAgIHRoaXMucGFyYW1zID0gW107XG4gICAgdGhpcy5uYW1lZCA9IHRoaXMuZ2V0RGVmYXVsdHMoKTtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgbmFtZVRvUGFyYW0gPSB0aGlzLmdldE9wdGlvbignbmFtZVRvUGFyYW0nKTtcbiAgICAgIGlmIChuYW1lVG9QYXJhbSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubmFtZWRbbmFtZVRvUGFyYW1dID0gdGhpcy5jbWROYW1lO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFyYW1zLmxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgICAgYWxsb3dlZE5hbWVkID0gdGhpcy5jbWQuYWxsb3dlZE5hbWVkO1xuICAgICAgfVxuICAgICAgaW5TdHIgPSBmYWxzZTtcbiAgICAgIHBhcmFtID0gJyc7XG4gICAgICBuYW1lID0gZmFsc2U7XG4gICAgICBmb3IgKGkgPSBqID0gMCwgcmVmID0gcGFyYW1zLmxlbmd0aCAtIDE7ICgwIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWYpOyBpID0gMCA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgICAgY2hyID0gcGFyYW1zW2ldO1xuICAgICAgICBpZiAoY2hyID09PSAnICcgJiYgIWluU3RyKSB7XG4gICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZWRbbmFtZV0gPSBwYXJhbTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMucHVzaChwYXJhbSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmFtID0gJyc7XG4gICAgICAgICAgbmFtZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKChjaHIgPT09ICdcIicgfHwgY2hyID09PSBcIidcIikgJiYgKGkgPT09IDAgfHwgcGFyYW1zW2kgLSAxXSAhPT0gJ1xcXFwnKSkge1xuICAgICAgICAgIGluU3RyID0gIWluU3RyO1xuICAgICAgICB9IGVsc2UgaWYgKGNociA9PT0gJzonICYmICFuYW1lICYmICFpblN0ciAmJiAoKGFsbG93ZWROYW1lZCA9PSBudWxsKSB8fCBpbmRleE9mLmNhbGwoYWxsb3dlZE5hbWVkLCBuYW1lKSA+PSAwKSkge1xuICAgICAgICAgIG5hbWUgPSBwYXJhbTtcbiAgICAgICAgICBwYXJhbSA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmFtICs9IGNocjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBhcmFtLmxlbmd0aCkge1xuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm5hbWVkW25hbWVdID0gcGFyYW07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1zLnB1c2gocGFyYW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRDbG9zaW5nKCkge1xuICAgIHZhciBmO1xuICAgIGlmIChmID0gdGhpcy5fZmluZENsb3NpbmdQb3MoKSkge1xuICAgICAgdGhpcy5jb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgZi5wb3MpKTtcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGYucG9zICsgZi5zdHIubGVuZ3RoKTtcbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmdQb3MoKSB7XG4gICAgdmFyIGNsb3NpbmcsIGYsIG9wZW5pbmc7XG4gICAgaWYgKHRoaXMuY2xvc2luZ1BvcyAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUG9zO1xuICAgIH1cbiAgICBjbG9zaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZE5hbWUgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY21kTmFtZTtcbiAgICBpZiAoZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgb3BlbmluZywgY2xvc2luZykpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3MgPSBmO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Vsb25nYXRlZCgpIHtcbiAgICB2YXIgZW5kUG9zLCBtYXgsIHJlZjtcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpO1xuICAgIG1heCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKTtcbiAgICB3aGlsZSAoZW5kUG9zIDwgbWF4ICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5kZWNvKSB7XG4gICAgICBlbmRQb3MgKz0gdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKGVuZFBvcyA+PSBtYXggfHwgKChyZWYgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkpID09PSAnICcgfHwgcmVmID09PSBcIlxcblwiIHx8IHJlZiA9PT0gXCJcXHJcIikpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGVuZFBvcyk7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrQm94KCkge1xuICAgIHZhciBjbCwgY3IsIGVuZFBvcztcbiAgICBpZiAoKHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSAmJiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuY21kLm5hbWUgPT09ICdjb21tZW50Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjbCA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKTtcbiAgICBjciA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCk7XG4gICAgZW5kUG9zID0gdGhpcy5nZXRFbmRQb3MoKSArIGNyLmxlbmd0aDtcbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyAtIGNsLmxlbmd0aCwgdGhpcy5wb3MpID09PSBjbCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyAtIGNyLmxlbmd0aCwgZW5kUG9zKSA9PT0gY3IpIHtcbiAgICAgIHRoaXMucG9zID0gdGhpcy5wb3MgLSBjbC5sZW5ndGg7XG4gICAgICB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGVuZFBvcyk7XG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgJiYgdGhpcy5nZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xKSB7XG4gICAgICB0aGlzLmluQm94ID0gMTtcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCkge1xuICAgIHZhciBlY2wsIGVjciwgZWQsIHJlMSwgcmUyLCByZTM7XG4gICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpO1xuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKTtcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvZGV3YXZlLmRlY28pO1xuICAgICAgcmUxID0gbmV3IFJlZ0V4cChgXlxcXFxzKiR7ZWNsfSg/OiR7ZWR9KStcXFxccyooLio/KVxcXFxzKig/OiR7ZWR9KSske2Vjcn0kYCwgXCJnbVwiKTtcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoYF5cXFxccyooPzoke2VkfSkqJHtlY3J9XFxyP1xcbmApO1xuICAgICAgcmUzID0gbmV3IFJlZ0V4cChgXFxuXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzKiRgKTtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRlbnQucmVwbGFjZShyZTEsICckMScpLnJlcGxhY2UocmUyLCAnJykucmVwbGFjZShyZTMsICcnKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0UGFyZW50Q21kcygpIHtcbiAgICB2YXIgcmVmO1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9IChyZWYgPSB0aGlzLmNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZCh0aGlzLmdldEVuZFBvcygpKSkgIT0gbnVsbCA/IHJlZi5pbml0KCkgOiB2b2lkIDA7XG4gIH1cblxuICBzZXRNdWx0aVBvcyhtdWx0aVBvcykge1xuICAgIHJldHVybiB0aGlzLm11bHRpUG9zID0gbXVsdGlQb3M7XG4gIH1cblxuICBfZ2V0Q21kT2JqKCkge1xuICAgIHRoaXMuZ2V0Q21kKCk7XG4gICAgdGhpcy5fY2hlY2tCb3goKTtcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnJlbW92ZUluZGVudEZyb21Db250ZW50KHRoaXMuY29udGVudCk7XG4gICAgcmV0dXJuIHN1cGVyLl9nZXRDbWRPYmooKTtcbiAgfVxuXG4gIF9pbml0UGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJzZVBhcmFtcyh0aGlzLnJhd1BhcmFtcyk7XG4gIH1cblxuICBnZXRDb250ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQgfHwgdGhpcy5jb2Rld2F2ZS5jb250ZXh0O1xuICB9XG5cbiAgZ2V0Q21kKCkge1xuICAgIGlmICh0aGlzLmNtZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9nZXRQYXJlbnRDbWRzKCk7XG4gICAgICBpZiAodGhpcy5ub0JyYWNrZXQuc3Vic3RyaW5nKDAsIHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpIHtcbiAgICAgICAgdGhpcy5jbWQgPSBDb21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jb2Rld2F2ZS5jb250ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmZpbmRlci5jb250ZXh0O1xuICAgICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKTtcbiAgICAgICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZVNwYWNlKHRoaXMuY21kLmZ1bGxOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jbWQ7XG4gIH1cblxuICBnZXRGaW5kZXIoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXI7XG4gICAgZmluZGVyID0gdGhpcy5jb2Rld2F2ZS5jb250ZXh0LmdldEZpbmRlcihjbWROYW1lLCB7XG4gICAgICBuYW1lc3BhY2VzOiB0aGlzLl9nZXRQYXJlbnROYW1lc3BhY2VzKClcbiAgICB9KTtcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzO1xuICAgIHJldHVybiBmaW5kZXI7XG4gIH1cblxuICBfZ2V0UGFyZW50TmFtZXNwYWNlcygpIHtcbiAgICB2YXIgbnNwY3MsIG9iajtcbiAgICBuc3BjcyA9IFtdO1xuICAgIG9iaiA9IHRoaXM7XG4gICAgd2hpbGUgKG9iai5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgb2JqID0gb2JqLnBhcmVudDtcbiAgICAgIGlmICgob2JqLmNtZCAhPSBudWxsKSAmJiAob2JqLmNtZC5mdWxsTmFtZSAhPSBudWxsKSkge1xuICAgICAgICBuc3Bjcy5wdXNoKG9iai5jbWQuZnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnNwY3M7XG4gIH1cblxuICBfcmVtb3ZlQnJhY2tldChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoLCBzdHIubGVuZ3RoIC0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk7XG4gIH1cblxuICBhbHRlckFsaWFzT2YoYWxpYXNPZikge1xuICAgIHZhciBjbWROYW1lLCBuc3BjO1xuICAgIFtuc3BjLCBjbWROYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdCh0aGlzLmNtZE5hbWUpO1xuICAgIHJldHVybiBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIGNtZE5hbWUpO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdHIgPT09IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzIHx8IHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHZhciBiZWZvcmVGdW5jdCwgcmVzO1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgaWYgKCh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCAhPSBudWxsKSAmJiAodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAud2hpdGhpbk9wZW5Cb3VuZHModGhpcy5wb3MgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKSAhPSBudWxsKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAuY2FuY2VsKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aCgnJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAoYmVmb3JlRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpKSB7XG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucmVzdWx0SXNBdmFpbGFibGUoKSkge1xuICAgICAgICBpZiAoKHJlcyA9IHRoaXMucmVzdWx0KCkpICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aChyZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5FeGVjdXRlRnVuY3QoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRFbmRQb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoO1xuICB9XG5cbiAgZ2V0UG9zKCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCkud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcik7XG4gIH1cblxuICBnZXRPcGVuaW5nUG9zKCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMub3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICB9XG5cbiAgZ2V0SW5kZW50KCkge1xuICAgIHZhciBoZWxwZXI7XG4gICAgaWYgKHRoaXMuaW5kZW50TGVuID09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkpLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gdGhpcy5wb3MgLSB0aGlzLmdldFBvcygpLnByZXZFT0woKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5kZW50TGVuO1xuICB9XG5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGV4dCkge1xuICAgIHZhciByZWc7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycgKyB0aGlzLmdldEluZGVudCgpICsgJ30nLCAnZ20nKTtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIGFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpIHtcbiAgICB2YXIgYm94LCBoZWxwZXIsIG9yaWdpbmFsLCByZXM7XG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKTtcbiAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dCk7XG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksIGZhbHNlKTtcbiAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3JlcGxhY2VCb3gnKSkge1xuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbCk7XG4gICAgICBbcmVwbC5zdGFydCwgcmVwbC5lbmRdID0gW2JveC5zdGFydCwgYm94LmVuZF07XG4gICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5pbmRlbnQ7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKCk7XG4gICAgICByZXBsLmVuZCA9IG9yaWdpbmFsLm5leHRFT0woKTtcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyB0aGlzLmNvZGV3YXZlLm1hcmtlciArIG9yaWdpbmFsLnNhbWVMaW5lc1N1ZmZpeCgpLCB7XG4gICAgICAgIG11bHRpbGluZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgW3JlcGwucHJlZml4LCByZXBsLnRleHQsIHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdCh0aGlzLmNvZGV3YXZlLm1hcmtlcik7XG4gICAgfVxuICAgIHJldHVybiByZXBsO1xuICB9XG5cbiAgZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcDtcbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpO1xuICAgIGlmICgodGhpcy5jbWQgIT0gbnVsbCkgJiYgdGhpcy5jb2Rld2F2ZS5jaGVja0NhcnJldCAmJiB0aGlzLmdldE9wdGlvbignY2hlY2tDYXJyZXQnKSkge1xuICAgICAgaWYgKChwID0gdGhpcy5jb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSkgIT0gbnVsbCkge1xuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0ICsgcmVwbC5wcmVmaXgubGVuZ3RoICsgcDtcbiAgICAgIH1cbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHJlcGwudGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBjdXJzb3JQb3M7XG4gIH1cblxuICBjaGVja011bHRpKHJlcGwpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXdSZXBsLCBvcmlnaW5hbFBvcywgb3JpZ2luYWxUZXh0LCBwb3MsIHJlZiwgcmVwbGFjZW1lbnRzO1xuICAgIGlmICgodGhpcy5tdWx0aVBvcyAhPSBudWxsKSAmJiB0aGlzLm11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJlcGxhY2VtZW50cyA9IFtyZXBsXTtcbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KCk7XG4gICAgICByZWYgPSB0aGlzLm11bHRpUG9zO1xuICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgcG9zID0gcmVmW2ldO1xuICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgIG9yaWdpbmFsUG9zID0gcG9zLnN0YXJ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1JlcGwgPSByZXBsLmNvcHkoKS5hcHBseU9mZnNldChwb3Muc3RhcnQgLSBvcmlnaW5hbFBvcyk7XG4gICAgICAgICAgaWYgKG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT09IG9yaWdpbmFsVGV4dCkge1xuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW3JlcGxdO1xuICAgIH1cbiAgfVxuXG4gIHJlcGxhY2VXaXRoKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudCh0aGlzLnBvcywgdGhpcy5nZXRFbmRQb3MoKSwgdGV4dCkpO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcmVwbGFjZW1lbnRzO1xuICAgIHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcik7XG4gICAgaWYgKHRoaXMuaW5Cb3ggIT0gbnVsbCkge1xuICAgICAgdGhpcy5hbHRlclJlc3VsdEZvckJveChyZXBsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpO1xuICAgIH1cbiAgICBjdXJzb3JQb3MgPSB0aGlzLmdldEN1cnNvckZyb21SZXN1bHQocmVwbCk7XG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBQb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXTtcbiAgICByZXBsYWNlbWVudHMgPSB0aGlzLmNoZWNrTXVsdGkocmVwbCk7XG4gICAgdGhpcy5yZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0O1xuICAgIHRoaXMucmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKCk7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBQcm9jZXNzXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICMiLCJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vTG9nZ2VyJztcblxuZXhwb3J0IGNsYXNzIFN0b3JhZ2VcbiAgY29uc3RydWN0b3I6IChAZW5naW5lKSAtPlxuXG4gIHNhdmU6IChrZXksdmFsKSAtPlxuICAgIGlmIEBlbmdpbmVBdmFpbGFibGUoKVxuICAgICAgQGVuZ2luZS5zYXZlKGtleSx2YWwpXG5cbiAgc2F2ZUluUGF0aDogKHBhdGgsIGtleSwgdmFsKSAtPlxuICAgIGlmIEBlbmdpbmVBdmFpbGFibGUoKVxuICAgICAgQGVuZ2luZS5zYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKVxuXG4gIGxvYWQ6IChrZXkpIC0+XG4gICAgaWYgQGVuZ2luZT9cbiAgICAgIEBlbmdpbmUubG9hZChrZXkpXG5cbiAgZW5naW5lQXZhaWxhYmxlOiAoKSAtPlxuICAgIGlmIEBlbmdpbmU/XG4gICAgICB0cnVlXG4gICAgZWxzZVxuICAgICAgQGxvZ2dlciA9IEBsb2dnZXIgfHwgbmV3IExvZ2dlcigpXG4gICAgICBAbG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJylcbiAgICAgIGZhbHNlXG4gICAgIiwiaW1wb3J0IHtcbiAgTG9nZ2VyXG59IGZyb20gJy4vTG9nZ2VyJztcblxuZXhwb3J0IHZhciBTdG9yYWdlID0gY2xhc3MgU3RvcmFnZSB7XG4gIGNvbnN0cnVjdG9yKGVuZ2luZSkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICB9XG5cbiAgc2F2ZShrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZShrZXksIHZhbCk7XG4gICAgfVxuICB9XG5cbiAgc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbCk7XG4gICAgfVxuICB9XG5cbiAgbG9hZChrZXkpIHtcbiAgICBpZiAodGhpcy5lbmdpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLmxvYWQoa2V5KTtcbiAgICB9XG4gIH1cblxuICBlbmdpbmVBdmFpbGFibGUoKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlciA9IHRoaXMubG9nZ2VyIHx8IG5ldyBMb2dnZXIoKTtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IGNsYXNzIERvbUtleUxpc3RlbmVyXG4gIHN0YXJ0TGlzdGVuaW5nOiAodGFyZ2V0KSAtPlxuICBcbiAgICB0aW1lb3V0ID0gbnVsbFxuICAgIFxuICAgIG9ua2V5ZG93biA9IChlKSA9PiBcbiAgICAgIGlmIChDb2Rld2F2ZS5pbnN0YW5jZXMubGVuZ3RoIDwgMiBvciBAb2JqID09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIGFuZCBlLmtleUNvZGUgPT0gNjkgJiYgZS5jdHJsS2V5XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBpZiBAb25BY3RpdmF0aW9uS2V5P1xuICAgICAgICAgIEBvbkFjdGl2YXRpb25LZXkoKVxuICAgIG9ua2V5dXAgPSAoZSkgPT4gXG4gICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgIG9ua2V5cHJlc3MgPSAoZSkgPT4gXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCkgaWYgdGltZW91dD9cbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0ICg9PlxuICAgICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgICAgQG9uQW55Q2hhbmdlKGUpXG4gICAgICApLCAxMDBcbiAgICAgICAgICAgIFxuICAgIGlmIHRhcmdldC5hZGRFdmVudExpc3RlbmVyXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuICAgIGVsc2UgaWYgdGFyZ2V0LmF0dGFjaEV2ZW50XG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuXG5pc0VsZW1lbnQgPSAob2JqKSAtPlxuICB0cnlcbiAgICAjIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tKVxuICAgIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gIGNhdGNoIGVcbiAgICAjIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAjIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAjIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcbiAgICByZXR1cm4gKHR5cGVvZiBvYmo9PVwib2JqZWN0XCIpICYmXG4gICAgICAob2JqLm5vZGVUeXBlPT0xKSAmJiAodHlwZW9mIG9iai5zdHlsZSA9PSBcIm9iamVjdFwiKSAmJlxuICAgICAgKHR5cGVvZiBvYmoub3duZXJEb2N1bWVudCA9PVwib2JqZWN0XCIpXG5cbiAgICAgICAgXG5leHBvcnQgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyXG4gIGNvbnN0cnVjdG9yOiAoQHRhcmdldCkgLT5cbiAgICBzdXBlcigpXG4gICAgQG9iaiA9IGlmIGlzRWxlbWVudChAdGFyZ2V0KSB0aGVuIEB0YXJnZXQgZWxzZSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChAdGFyZ2V0KVxuICAgIHVubGVzcyBAb2JqP1xuICAgICAgdGhyb3cgXCJUZXh0QXJlYSBub3QgZm91bmRcIlxuICAgIEBuYW1lc3BhY2UgPSAndGV4dGFyZWEnXG4gICAgQGNoYW5nZUxpc3RlbmVycyA9IFtdXG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgPSAwXG4gIHN0YXJ0TGlzdGVuaW5nOiBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmdcbiAgb25BbnlDaGFuZ2U6IChlKSAtPlxuICAgIGlmIEBfc2tpcENoYW5nZUV2ZW50IDw9IDBcbiAgICAgIGZvciBjYWxsYmFjayBpbiBAY2hhbmdlTGlzdGVuZXJzXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICBlbHNlXG4gICAgICBAX3NraXBDaGFuZ2VFdmVudC0tXG4gICAgICBAb25Ta2lwZWRDaGFuZ2UoKSBpZiBAb25Ta2lwZWRDaGFuZ2U/XG4gIHNraXBDaGFuZ2VFdmVudDogKG5iID0gMSkgLT5cbiAgICBAX3NraXBDaGFuZ2VFdmVudCArPSBuYlxuICBiaW5kZWRUbzogKGNvZGV3YXZlKSAtPlxuICAgIEBvbkFjdGl2YXRpb25LZXkgPSAtPiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKVxuICAgIEBzdGFydExpc3RlbmluZyhkb2N1bWVudClcbiAgc2VsZWN0aW9uUHJvcEV4aXN0czogLT5cbiAgICBcInNlbGVjdGlvblN0YXJ0XCIgb2YgQG9ialxuICBoYXNGb2N1czogLT4gXG4gICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpcyBAb2JqXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgaWYgdmFsP1xuICAgICAgdW5sZXNzIEB0ZXh0RXZlbnRDaGFuZ2UodmFsKVxuICAgICAgICBAb2JqLnZhbHVlID0gdmFsXG4gICAgQG9iai52YWx1ZVxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICBAdGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIG9yIEBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0LCBlbmQpIG9yIHN1cGVyKHN0YXJ0LCBlbmQsIHRleHQpXG4gIHRleHRFdmVudENoYW5nZTogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUZXh0RXZlbnQnKSBpZiBkb2N1bWVudC5jcmVhdGVFdmVudD9cbiAgICBpZiBldmVudD8gYW5kIGV2ZW50LmluaXRUZXh0RXZlbnQ/IGFuZCBldmVudC5pc1RydXN0ZWQgIT0gZmFsc2VcbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIGlmIHRleHQubGVuZ3RoIDwgMVxuICAgICAgICBpZiBzdGFydCAhPSAwXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LTEsc3RhcnQpXG4gICAgICAgICAgc3RhcnQtLVxuICAgICAgICBlbHNlIGlmIGVuZCAhPSBAdGV4dExlbigpXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKGVuZCxlbmQrMSlcbiAgICAgICAgICBlbmQrK1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICBldmVudC5pbml0VGV4dEV2ZW50KCd0ZXh0SW5wdXQnLCB0cnVlLCB0cnVlLCBudWxsLCB0ZXh0LCA5KVxuICAgICAgIyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIEBvYmouZGlzcGF0Y2hFdmVudChldmVudClcbiAgICAgIEBza2lwQ2hhbmdlRXZlbnQoKVxuICAgICAgdHJ1ZVxuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kOiAodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSAtPlxuICAgIGlmIGRvY3VtZW50LmV4ZWNDb21tYW5kP1xuICAgICAgZW5kID0gQHRleHRMZW4oKSB1bmxlc3MgZW5kP1xuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dCk7XG4gICAgZWxzZSBcbiAgICAgIGZhbHNlXG5cbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdG1wQ3Vyc29yUG9zIGlmIEB0bXBDdXJzb3JQb3M/XG4gICAgaWYgQGhhc0ZvY3VzXG4gICAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgICBuZXcgUG9zKEBvYmouc2VsZWN0aW9uU3RhcnQsQG9iai5zZWxlY3Rpb25FbmQpXG4gICAgICBlbHNlXG4gICAgICAgIEBnZXRDdXJzb3JQb3NGYWxsYmFjaygpXG4gIGdldEN1cnNvclBvc0ZhbGxiYWNrOiAtPlxuICAgIGlmIEBvYmouY3JlYXRlVGV4dFJhbmdlXG4gICAgICBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKVxuICAgICAgaWYgc2VsLnBhcmVudEVsZW1lbnQoKSBpcyBAb2JqXG4gICAgICAgIHJuZyA9IEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcm5nLm1vdmVUb0Jvb2ttYXJrIHNlbC5nZXRCb29rbWFyaygpXG4gICAgICAgIGxlbiA9IDBcblxuICAgICAgICB3aGlsZSBybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDBcbiAgICAgICAgICBsZW4rK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKVxuICAgICAgICBybmcuc2V0RW5kUG9pbnQgXCJTdGFydFRvU3RhcnRcIiwgQG9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgICBwb3MgPSBuZXcgUG9zKDAsbGVuKVxuICAgICAgICB3aGlsZSBybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDBcbiAgICAgICAgICBwb3Muc3RhcnQrK1xuICAgICAgICAgIHBvcy5lbmQrK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKVxuICAgICAgICByZXR1cm4gcG9zXG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgQHRtcEN1cnNvclBvcyA9IG5ldyBQb3Moc3RhcnQsZW5kKVxuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgc2V0VGltZW91dCAoPT5cbiAgICAgICAgQHRtcEN1cnNvclBvcyA9IG51bGxcbiAgICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICApLCAxXG4gICAgZWxzZSBcbiAgICAgIEBzZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKVxuICAgIHJldHVyblxuICBzZXRDdXJzb3JQb3NGYWxsYmFjazogKHN0YXJ0LCBlbmQpIC0+XG4gICAgaWYgQG9iai5jcmVhdGVUZXh0UmFuZ2VcbiAgICAgIHJuZyA9IEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgIHJuZy5tb3ZlU3RhcnQgXCJjaGFyYWN0ZXJcIiwgc3RhcnRcbiAgICAgIHJuZy5jb2xsYXBzZSgpXG4gICAgICBybmcubW92ZUVuZCBcImNoYXJhY3RlclwiLCBlbmQgLSBzdGFydFxuICAgICAgcm5nLnNlbGVjdCgpXG4gIGdldExhbmc6IC0+XG4gICAgcmV0dXJuIEBfbGFuZyBpZiBAX2xhbmdcbiAgICBAb2JqLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJykgaWYgQG9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gICAgQG9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsdmFsKVxuICBjYW5MaXN0ZW5Ub0NoYW5nZTogLT5cbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIEBjaGFuZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjaylcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBpZiAoaSA9IEBjaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykpID4gLTFcbiAgICAgIEBjaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpXG4gICAgICBcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICBpZiByZXBsYWNlbWVudHMubGVuZ3RoID4gMCBhbmQgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMVxuICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbQGdldEN1cnNvclBvcygpXVxuICAgIHN1cGVyKHJlcGxhY2VtZW50cyk7XG4gICAgICAiLCJ2YXIgaXNFbGVtZW50O1xuXG5pbXBvcnQge1xuICBUZXh0UGFyc2VyXG59IGZyb20gJy4vVGV4dFBhcnNlcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCB2YXIgRG9tS2V5TGlzdGVuZXIgPSBjbGFzcyBEb21LZXlMaXN0ZW5lciB7XG4gIHN0YXJ0TGlzdGVuaW5nKHRhcmdldCkge1xuICAgIHZhciBvbmtleWRvd24sIG9ua2V5cHJlc3MsIG9ua2V5dXAsIHRpbWVvdXQ7XG4gICAgdGltZW91dCA9IG51bGw7XG4gICAgb25rZXlkb3duID0gKGUpID0+IHtcbiAgICAgIGlmICgoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgfHwgdGhpcy5vYmogPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpICYmIGUua2V5Q29kZSA9PT0gNjkgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMub25BY3RpdmF0aW9uS2V5ICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFjdGl2YXRpb25LZXkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgb25rZXl1cCA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uQW55Q2hhbmdlKGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgb25rZXlwcmVzcyA9IChlKSA9PiB7XG4gICAgICBpZiAodGltZW91dCAhPSBudWxsKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aW1lb3V0ID0gc2V0VGltZW91dCgoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLCAxMDApO1xuICAgIH07XG4gICAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKTtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cCk7XG4gICAgICByZXR1cm4gdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5hdHRhY2hFdmVudCkge1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlkb3duXCIsIG9ua2V5ZG93bik7XG4gICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApO1xuICAgICAgcmV0dXJuIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcyk7XG4gICAgfVxuICB9XG5cbn07XG5cbmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgZTtcbiAgdHJ5IHtcbiAgICAvLyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIC8vIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAvLyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuICAgIHJldHVybiAodHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIikgJiYgKG9iai5ub2RlVHlwZSA9PT0gMSkgJiYgKHR5cGVvZiBvYmouc3R5bGUgPT09IFwib2JqZWN0XCIpICYmICh0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT09IFwib2JqZWN0XCIpO1xuICB9XG59O1xuXG5leHBvcnQgdmFyIFRleHRBcmVhRWRpdG9yID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBUZXh0QXJlYUVkaXRvciBleHRlbmRzIFRleHRQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldDEpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDE7XG4gICAgICB0aGlzLm9iaiA9IGlzRWxlbWVudCh0aGlzLnRhcmdldCkgPyB0aGlzLnRhcmdldCA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0KTtcbiAgICAgIGlmICh0aGlzLm9iaiA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCI7XG4gICAgICB9XG4gICAgICB0aGlzLm5hbWVzcGFjZSA9ICd0ZXh0YXJlYSc7XG4gICAgICB0aGlzLmNoYW5nZUxpc3RlbmVycyA9IFtdO1xuICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50ID0gMDtcbiAgICB9XG5cbiAgICBvbkFueUNoYW5nZShlKSB7XG4gICAgICB2YXIgY2FsbGJhY2ssIGosIGxlbjEsIHJlZiwgcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPD0gMCkge1xuICAgICAgICByZWYgPSB0aGlzLmNoYW5nZUxpc3RlbmVycztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIGNhbGxiYWNrID0gcmVmW2pdO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjYWxsYmFjaygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudC0tO1xuICAgICAgICBpZiAodGhpcy5vblNraXBlZENoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25Ta2lwZWRDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNraXBDaGFuZ2VFdmVudChuYiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgKz0gbmI7XG4gICAgfVxuXG4gICAgYmluZGVkVG8oY29kZXdhdmUpIHtcbiAgICAgIHRoaXMub25BY3RpdmF0aW9uS2V5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy5zdGFydExpc3RlbmluZyhkb2N1bWVudCk7XG4gICAgfVxuXG4gICAgc2VsZWN0aW9uUHJvcEV4aXN0cygpIHtcbiAgICAgIHJldHVybiBcInNlbGVjdGlvblN0YXJ0XCIgaW4gdGhpcy5vYmo7XG4gICAgfVxuXG4gICAgaGFzRm9jdXMoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5vYmo7XG4gICAgfVxuXG4gICAgdGV4dCh2YWwpIHtcbiAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICBpZiAoIXRoaXMudGV4dEV2ZW50Q2hhbmdlKHZhbCkpIHtcbiAgICAgICAgICB0aGlzLm9iai52YWx1ZSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqLnZhbHVlO1xuICAgIH1cblxuICAgIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHRoaXMuc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSB8fCBzdXBlci5zcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpO1xuICAgIH1cblxuICAgIHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIHZhciBldmVudDtcbiAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RleHRFdmVudCcpO1xuICAgICAgfVxuICAgICAgaWYgKChldmVudCAhPSBudWxsKSAmJiAoZXZlbnQuaW5pdFRleHRFdmVudCAhPSBudWxsKSAmJiBldmVudC5pc1RydXN0ZWQgIT09IGZhbHNlKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICBpZiAoc3RhcnQgIT09IDApIHtcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQgLSAxLCBzdGFydCk7XG4gICAgICAgICAgICBzdGFydC0tO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZW5kICE9PSB0aGlzLnRleHRMZW4oKSkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihlbmQsIGVuZCArIDEpO1xuICAgICAgICAgICAgZW5kKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSk7XG4gICAgICAgIC8vIEBzZXRDdXJzb3JQb3Moc3RhcnQsZW5kKVxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHRoaXMub2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLnNraXBDaGFuZ2VFdmVudCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgICAgaWYgKGRvY3VtZW50LmV4ZWNDb21tYW5kICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgICAgaWYgKHRoaXMudG1wQ3Vyc29yUG9zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG1wQ3Vyc29yUG9zO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaGFzRm9jdXMpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJvcEV4aXN0cykge1xuICAgICAgICAgIHJldHVybiBuZXcgUG9zKHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0LCB0aGlzLm9iai5zZWxlY3Rpb25FbmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldEN1cnNvclBvc0ZhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXJzb3JQb3NGYWxsYmFjaygpIHtcbiAgICAgIHZhciBsZW4sIHBvcywgcm5nLCBzZWw7XG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgICAgICBpZiAoc2VsLnBhcmVudEVsZW1lbnQoKSA9PT0gdGhpcy5vYmopIHtcbiAgICAgICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICBybmcubW92ZVRvQm9va21hcmsoc2VsLmdldEJvb2ttYXJrKCkpO1xuICAgICAgICAgIGxlbiA9IDA7XG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMCkge1xuICAgICAgICAgICAgbGVuKys7XG4gICAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJuZy5zZXRFbmRQb2ludChcIlN0YXJ0VG9TdGFydFwiLCB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKSk7XG4gICAgICAgICAgcG9zID0gbmV3IFBvcygwLCBsZW4pO1xuICAgICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIHBvcy5zdGFydCsrO1xuICAgICAgICAgICAgcG9zLmVuZCsrO1xuICAgICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcG9zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICBlbmQgPSBzdGFydDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG51bGw7XG4gICAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICB9KSwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHZhciBybmc7XG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICBybmcubW92ZVN0YXJ0KFwiY2hhcmFjdGVyXCIsIHN0YXJ0KTtcbiAgICAgICAgcm5nLmNvbGxhcHNlKCk7XG4gICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIGVuZCAtIHN0YXJ0KTtcbiAgICAgICAgcmV0dXJuIHJuZy5zZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYW5nKCkge1xuICAgICAgaWYgKHRoaXMuX2xhbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmc7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmouZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMYW5nKHZhbCkge1xuICAgICAgdGhpcy5fbGFuZyA9IHZhbDtcbiAgICAgIHJldHVybiB0aGlzLm9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsIHZhbCk7XG4gICAgfVxuXG4gICAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmICgoaSA9IHRoaXMuY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5nZUxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKSB7XG4gICAgICBpZiAocmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgJiYgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucyA9IFt0aGlzLmdldEN1cnNvclBvcygpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICAgIH1cblxuICB9O1xuXG4gIFRleHRBcmVhRWRpdG9yLnByb3RvdHlwZS5zdGFydExpc3RlbmluZyA9IERvbUtleUxpc3RlbmVyLnByb3RvdHlwZS5zdGFydExpc3RlbmluZztcblxuICByZXR1cm4gVGV4dEFyZWFFZGl0b3I7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJpbXBvcnQgeyBFZGl0b3IgfSBmcm9tICcuL0VkaXRvcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yXG4gIGNvbnN0cnVjdG9yOiAoQF90ZXh0KSAtPlxuICAgIHN1cGVyKClcbiAgdGV4dDogKHZhbCkgLT5cbiAgICBAX3RleHQgPSB2YWwgaWYgdmFsP1xuICAgIEBfdGV4dFxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHJldHVybiBAdGV4dCgpW3Bvc11cbiAgdGV4dExlbjogKHBvcykgLT5cbiAgICByZXR1cm4gQHRleHQoKS5sZW5ndGhcbiAgdGV4dFN1YnN0cjogKHN0YXJ0LCBlbmQpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICBAdGV4dChAdGV4dCgpLnN1YnN0cmluZygwLCBwb3MpK3RleHQrQHRleHQoKS5zdWJzdHJpbmcocG9zLEB0ZXh0KCkubGVuZ3RoKSlcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHQoQHRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIEB0ZXh0KCkuc2xpY2UoZW5kKSlcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdGFyZ2V0XG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBAdGFyZ2V0ID0gbmV3IFBvcyggc3RhcnQsIGVuZCApIiwiaW1wb3J0IHtcbiAgRWRpdG9yXG59IGZyb20gJy4vRWRpdG9yJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IHZhciBUZXh0UGFyc2VyID0gY2xhc3MgVGV4dFBhcnNlciBleHRlbmRzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKF90ZXh0KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl90ZXh0ID0gX3RleHQ7XG4gIH1cblxuICB0ZXh0KHZhbCkge1xuICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dCA9IHZhbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKVtwb3NdO1xuICB9XG5cbiAgdGV4dExlbihwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkubGVuZ3RoO1xuICB9XG5cbiAgdGV4dFN1YnN0cihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgfVxuXG4gIGluc2VydFRleHRBdCh0ZXh0LCBwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnN1YnN0cmluZygwLCBwb3MpICsgdGV4dCArIHRoaXMudGV4dCgpLnN1YnN0cmluZyhwb3MsIHRoaXMudGV4dCgpLmxlbmd0aCkpO1xuICB9XG5cbiAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIHRoaXMudGV4dCgpLnNsaWNlKGVuZCkpO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnRhcmdldDtcbiAgfVxuXG4gIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBlbmQgPSBzdGFydDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0ID0gbmV3IFBvcyhzdGFydCwgZW5kKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuaW1wb3J0IHsgQ29yZUNvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IEpzQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IFBocENvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9QaHBDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgSHRtbENvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IFdyYXBwZWRQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MnO1xuaW1wb3J0IHsgTG9jYWxTdG9yYWdlRW5naW5lIH0gZnJvbSAnLi9zdG9yYWdlRW5naW5lcy9Mb2NhbFN0b3JhZ2VFbmdpbmUnO1xuXG5Qb3Mud3JhcENsYXNzID0gV3JhcHBlZFBvc1xuXG5Db2Rld2F2ZS5pbnN0YW5jZXMgPSBbXVxuXG5Db21tYW5kLnByb3ZpZGVycyA9IFtcbiAgbmV3IENvcmVDb21tYW5kUHJvdmlkZXIoKVxuICBuZXcgSnNDb21tYW5kUHJvdmlkZXIoKVxuICBuZXcgUGhwQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IEh0bWxDb21tYW5kUHJvdmlkZXIoKVxuXVxuXG5pZiBsb2NhbFN0b3JhZ2U/XG4gIENvbW1hbmQuc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2VFbmdpbmUoKVxuXG5leHBvcnQgeyBDb2Rld2F2ZSB9IiwiaW1wb3J0IHtcbiAgQ29kZXdhdmVcbn0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgQ29yZUNvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIEpzQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9Kc0NvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIFBocENvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgSHRtbENvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFdyYXBwZWRQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9XcmFwcGVkUG9zJztcblxuaW1wb3J0IHtcbiAgTG9jYWxTdG9yYWdlRW5naW5lXG59IGZyb20gJy4vc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lJztcblxuUG9zLndyYXBDbGFzcyA9IFdyYXBwZWRQb3M7XG5cbkNvZGV3YXZlLmluc3RhbmNlcyA9IFtdO1xuXG5Db21tYW5kLnByb3ZpZGVycyA9IFtuZXcgQ29yZUNvbW1hbmRQcm92aWRlcigpLCBuZXcgSnNDb21tYW5kUHJvdmlkZXIoKSwgbmV3IFBocENvbW1hbmRQcm92aWRlcigpLCBuZXcgSHRtbENvbW1hbmRQcm92aWRlcigpXTtcblxuaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlICE9PSBudWxsKSB7XG4gIENvbW1hbmQuc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2VFbmdpbmUoKTtcbn1cblxuZXhwb3J0IHtcbiAgQ29kZXdhdmVcbn07XG4iLCJcbmltcG9ydCB7IENvbW1hbmQsIEJhc2VDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMYW5nRGV0ZWN0b3IgfSBmcm9tICcuLi9EZXRlY3Rvcic7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuLi9Cb3hIZWxwZXInO1xuaW1wb3J0IHsgRWRpdENtZFByb3AgfSBmcm9tICcuLi9FZGl0Q21kUHJvcCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKVxuICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSlcbiAgXG4gIGNvcmUuYWRkQ21kcyh7XG4gICAgJ2hlbHAnOntcbiAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAncmVzdWx0JyA6IGhlbHAsXG4gICAgICAncGFyc2UnIDogdHJ1ZSxcbiAgICAgICdhbGxvd2VkTmFtZWQnIDogWydjbWQnXSxcbiAgICAgICdoZWxwJyA6IFwiXCJcIlxuICAgICAgICBUbyBnZXQgaGVscCBvbiBhIHBlY2lmaWMgY29tbWFuZCwgZG8gOlxuICAgICAgICB+fmhlbHAgaGVsbG9+fiAoaGVsbG8gYmVpbmcgdGhlIGNvbW1hbmQpXG4gICAgICAgIFwiXCJcIiBcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ292ZXJ2aWV3Jzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgICBfX18gICAgICAgICBfICAgX18gICAgICBfX1xuICAgICAgICAgICAgIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xuICAgICAgICAgICAgLyAvX18vIF8gXFxcXC8gX2AgLyAtX1xcXFwgXFxcXC9cXFxcLyAvIF9gIFxcXFwgViAvIC1fL1xuICAgICAgICAgICAgXFxcXF9fX19cXFxcX19fL1xcXFxfXyxfXFxcXF9fX3xcXFxcXy9cXFxcXy9cXFxcX18sX3xcXFxcXy9cXFxcX19ffFxuICAgICAgICAgICAgVGhlIHRleHQgZWRpdG9yIGhlbHBlclxuICAgICAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcbiAgICAgICAgICAgIHlvdXIgdGV4dCBlZGl0b3IuIFRoZXNlIGNvbW1hbmRzIG11c3QgYmUgcGxhY2VkIGJldHdlZW4gdHdvIFxuICAgICAgICAgICAgcGFpcnMgb2YgXCJ+XCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXG4gICAgICAgICAgICBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIsIHdpdGggeW91ciBjdXJzb3IgaW5zaWRlIHRoZSBjb21tYW5kXG4gICAgICAgICAgICBFeDogfn4haGVsbG9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBZb3UgZG9udCBuZWVkIHRvIGFjdHVhbGx5IHR5cGUgYW55IFwiflwiICh0aWxkZSkuIFxuICAgICAgICAgICAgUHJlc3NpbmcgXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiIHdpbGwgYWRkIHRoZW0gaWYgeW91IGFyZSBub3QgYWxyZWFkeVxuICAgICAgICAgICAgd2l0aGluIGEgY29tbWFuZC5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29kZXdhdmUgZG9lcyBub3QgdXNlIFVJIHRvIGRpc3BsYXkgYW55IGluZm9ybWF0aW9uLiBcbiAgICAgICAgICAgIEluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxuICAgICAgICAgICAgVGhlIGdlbmVyYXRlZCBjb21tZW50IGJsb2NrcyB3aWxsIGJlIHJlZmVycmVkIHRvIGFzIHdpbmRvd3MgXG4gICAgICAgICAgICBpbiB0aGUgaGVscCBzZWN0aW9ucy5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgVG8gY2xvc2UgdGhpcyB3aW5kb3cgKGkuZS4gcmVtb3ZlIHRoaXMgY29tbWVudCBibG9jayksIHByZXNzIFxuICAgICAgICAgICAgXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiIHdpdGggeW91ciBjdXJzb3Igb24gdGhlIGxpbmUgYmVsbG93LlxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgVXNlIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBmb3IgYSB3YWxrdGhyb3VnaCBvZiBzb21lIG9mIHRoZSBtYW55XG4gICAgICAgICAgICBmZWF0dXJlcyBvZiBDb2Rld2F2ZVxuICAgICAgICAgICAgfn4haGVscDpnZXRfc3RhcnRlZH5+IG9yIH5+IWhlbHA6ZGVtb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIExpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXG4gICAgICAgICAgICB+fiFoZWxwOnN1YmplY3Rzfn4gb3Igfn4haGVscDpzdWJ+fiBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn4hY2xvc2V+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdzdWJqZWN0cyc6e1xuICAgICAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICAgIH5+IWhlbHB+flxuICAgICAgICAgICAgfn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcbiAgICAgICAgICAgIH5+IWhlbHA6c3ViamVjdHN+fiAofn4haGVscDpzdWJ+filcbiAgICAgICAgICAgIH5+IWhlbHA6ZWRpdGluZ35+ICh+fiFoZWxwOmVkaXR+filcbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ3N1Yic6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6c3ViamVjdHMnXG4gICAgICAgIH1cbiAgICAgICAgJ2dldF9zdGFydGVkJzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgVGhlIGNsYXNzaWMgSGVsbG8gV29ybGQuXG4gICAgICAgICAgICB+fiFoZWxsb3x+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fmhlbHA6ZWRpdGluZzppbnRyb35+XG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGNyZWF0aW5nIHlvdXIgb3duIGNvbW1hbmRzLCBzZWU6XG4gICAgICAgICAgICB+fiFoZWxwOmVkaXRpbmd+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2Rld2F2ZSBjb21lcyB3aXRoIG1hbnkgcHJlLWV4aXN0aW5nIGNvbW1hbmRzLiBIZXJlIGlzIGFuIGV4YW1wbGVcbiAgICAgICAgICAgIG9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xuICAgICAgICAgICAgfn4hanM6Zn5+XG4gICAgICAgICAgICB+fiFqczppZn5+XG4gICAgICAgICAgICAgIH5+IWpzOmxvZ35+XCJ+fiFoZWxsb35+XCJ+fiEvanM6bG9nfn5cbiAgICAgICAgICAgIH5+IS9qczppZn5+XG4gICAgICAgICAgICB+fiEvanM6Zn5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcbiAgICAgICAgICAgIHByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLiBFbW1ldCBhYmJyZXZpYXRpb25zIHdpbGwgYmUgXG4gICAgICAgICAgICB1c2VkIGF1dG9tYXRpY2FsbHkgaWYgeW91IGFyZSBpbiBhIEhUTUwgb3IgQ1NTIGZpbGUuXG4gICAgICAgICAgICB+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXG4gICAgICAgICAgICB+fiFlbW1ldCB1bD5saX5+XG4gICAgICAgICAgICB+fiFlbW1ldCBtMiBjc3N+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb21tYW5kcyBhcmUgc3RvcmVkIGluIG5hbWVzcGFjZXMuIFRoZSBzYW1lIGNvbW1hbmQgY2FuIGhhdmUgXG4gICAgICAgICAgICBkaWZmZXJlbnQgcmVzdWx0cyBkZXBlbmRpbmcgb24gdGhlIG5hbWVzcGFjZS5cbiAgICAgICAgICAgIH5+IWpzOmVhY2h+flxuICAgICAgICAgICAgfn4hcGhwOm91dGVyOmVhY2h+flxuICAgICAgICAgICAgfn4hcGhwOmlubmVyOmVhY2h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBTb21lIG9mIHRoZSBuYW1lc3BhY2VzIGFyZSBhY3RpdmUgZGVwZW5kaW5nIG9uIHRoZSBjb250ZXh0LiBUaGVcbiAgICAgICAgICAgIGZvbGxvd2luZyBjb21tYW5kcyBhcmUgdGhlIHNhbWUgYW5kIHdpbGwgZGlzcGxheSB0aGUgY3VycmVudGx5XG4gICAgICAgICAgICBhY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxuICAgICAgICAgICAgY29yZSBuYW1lc3BhY2UgaXMgYWN0aXZlLlxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlfn5cbiAgICAgICAgICAgIH5+IWNvcmU6bmFtZXNwYWNlfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgWW91IGNhbiBtYWtlIGEgbmFtZXNwYWNlIGFjdGl2ZSB3aXRoIHRoZSBmb2xsb3dpbmcgY29tbWFuZC5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZSBwaHB+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDaGVjayB0aGUgbmFtZXNwYWNlcyBhZ2FpblxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgSW4gYWRkaXRpb24gdG8gZGV0ZWN0aW5nIHRoZSBkb2N1bWVudCB0eXBlLCBDb2Rld2F2ZSBjYW4gZGV0ZWN0IHRoZVxuICAgICAgICAgICAgY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcbiAgICAgICAgICAgIHdpbGwgYWRkIHRoZSBQSFAgdGFncyB3aGVuIHlvdSBuZWVkIHRoZW0uXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdkZW1vJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpnZXRfc3RhcnRlZCdcbiAgICAgICAgfVxuICAgICAgICAnZWRpdGluZyc6e1xuICAgICAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgICAgICdpbnRybyc6e1xuICAgICAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgICAgIENvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXG4gICAgICAgICAgICAgICAgcHV0IHlvdXIgY29udGVudCBpbnNpZGUgXCJzb3VyY2VcIiB0aGUgZG8gXCJzYXZlXCIuIFRyeSBhZGRpbmcgYW55IFxuICAgICAgICAgICAgICAgIHRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXG4gICAgICAgICAgICAgICAgfn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIElmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XG4gICAgICAgICAgICAgICAgZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxuICAgICAgICAgICAgICAgIHdoZW5ldmVyIHlvdSB3YW50LlxuICAgICAgICAgICAgICAgIH5+IW15X25ld19jb21tYW5kfn5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn5oZWxwOmVkaXRpbmc6aW50cm9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBBbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcImJveFwiLiBcbiAgICAgICAgICAgIFRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXG4gICAgICAgICAgICBUaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXG4gICAgICAgICAgICBcImNsb3NlXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxuICAgICAgICAgICAgY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5LlxuICAgICAgICAgICAgfn4hYm94fn5cbiAgICAgICAgICAgIFRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgV2hlbiB5b3UgY3JlYXRlIGEgY29tbWFuZCwgeW91IG1heSB3YW50IHRvIHNwZWNpZnkgd2hlcmUgdGhlIGN1cnNvciBcbiAgICAgICAgICAgIHdpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcInxcIiBcbiAgICAgICAgICAgIChWZXJ0aWNhbCBiYXIpLiBVc2UgMiBvZiB0aGVtIGlmIHlvdSB3YW50IHRvIHByaW50IHRoZSBhY3R1YWwgXG4gICAgICAgICAgICBjaGFyYWN0ZXIuXG4gICAgICAgICAgICB+fiFib3h+flxuICAgICAgICAgICAgb25lIDogfCBcbiAgICAgICAgICAgIHR3byA6IHx8XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgWW91IGNhbiBhbHNvIHVzZSB0aGUgXCJlc2NhcGVfcGlwZXNcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxuICAgICAgICAgICAgdmVydGljYWwgYmFycyB0aGF0IGFyZSBiZXR3ZWVuIGl0cyBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3NcbiAgICAgICAgICAgIH5+IWVzY2FwZV9waXBlc35+XG4gICAgICAgICAgICB8XG4gICAgICAgICAgICB+fiEvZXNjYXBlX3BpcGVzfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cbiAgICAgICAgICAgIElmIHlvdSB3YW50IHRvIHByaW50IGEgY29tbWFuZCB3aXRob3V0IGhhdmluZyBpdCBleHBhbmQgd2hlbiBcbiAgICAgICAgICAgIHRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXCIhXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxuICAgICAgICAgICAgfn4hIWhlbGxvfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXG4gICAgICAgICAgICB0aGUgXCJjb250ZW50XCIgY29tbWFuZC4gXCJjb250ZW50XCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XG4gICAgICAgICAgICB0aGF0IGlzIGJldHdlZW4gdGhlIHRhZ3MuIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBob3cgaXQgY2FuIGJlIHVzZWQuXG4gICAgICAgICAgICB+fiFlZGl0IHBocDppbm5lcjppZn5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdlZGl0Jzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDplZGl0aW5nJ1xuICAgICAgICB9XG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgIH0sXG4gICAgJ25vX2V4ZWN1dGUnOntcbiAgICAgICdyZXN1bHQnIDogbm9fZXhlY3V0ZVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgUHJldmVudCBldmVyeXRoaW5nIGluc2lkZSB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIGZyb20gZXhlY3V0aW5nXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2VzY2FwZV9waXBlcyc6e1xuICAgICAgJ3Jlc3VsdCcgOiBxdW90ZV9jYXJyZXQsXG4gICAgICAnY2hlY2tDYXJyZXQnIDogZmFsc2VcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIEVzY2FwZSBhbGwgY2FycmV0cyAoZnJvbSBcInxcIiB0byBcInx8XCIpXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3F1b3RlX2NhcnJldCc6e1xuICAgICAgJ2FsaWFzT2YnOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgfVxuICAgICdleGVjX3BhcmVudCc6e1xuICAgICAgJ2V4ZWN1dGUnIDogZXhlY19wYXJlbnRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIEV4ZWN1dGUgdGhlIGZpcnN0IGNvbW1hbmQgdGhhdCB3cmFwIHRoaXMgaW4gaXQncyBvcGVuIGFuZCBjbG9zZSB0YWdcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnY29udGVudCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBnZXRDb250ZW50XG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcbiAgICAgICAgdGhpcyB3aWxsIHJldHVybiB3aGF0IHdhcyBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgb2YgYSBjb21tYW5kXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2JveCc6e1xuICAgICAgJ2NscycgOiBCb3hDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIENyZWF0ZSB0aGUgYXBwYXJlbmNlIG9mIGEgYm94IGNvbXBvc2VkIGZyb20gY2hhcmFjdGVycy4gXG4gICAgICAgIFVzdWFsbHkgd3JhcHBlZCBpbiBhIGNvbW1lbnQuXG5cbiAgICAgICAgVGhlIGJveCB3aWxsIHRyeSB0byBhanVzdCBpdCdzIHNpemUgZnJvbSB0aGUgY29udGVudFxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdjbG9zZSc6e1xuICAgICAgJ2NscycgOiBDbG9zZUNtZFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgV2lsbCBjbG9zZSB0aGUgZmlyc3QgYm94IGFyb3VuZCB0aGlzXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3BhcmFtJzp7XG4gICAgICAncmVzdWx0JyA6IGdldFBhcmFtXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcbiAgICAgICAgdGhpcyB3aWxsIHJldHVybiBhIHBhcmFtZXRlciBmcm9tIHRoaXMgY29tbWFuZCBjYWxsXG5cbiAgICAgICAgWW91IGNhbiBwYXNzIGEgbnVtYmVyLCBhIHN0cmluZywgb3IgYm90aC4gXG4gICAgICAgIEEgbnVtYmVyIGZvciBhIHBvc2l0aW9uZWQgYXJndW1lbnQgYW5kIGEgc3RyaW5nXG4gICAgICAgIGZvciBhIG5hbWVkIHBhcmFtZXRlclxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdlZGl0Jzp7XG4gICAgICAnY21kcycgOiBFZGl0Q21kLnNldENtZHMoe1xuICAgICAgICAnc2F2ZSc6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXhlY19wYXJlbnQnXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgJ2NscycgOiBFZGl0Q21kLFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydjbWQnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQWxsb3dzIHRvIGVkaXQgYSBjb21tYW5kLiBcbiAgICAgICAgU2VlIH5+IWhlbHA6ZWRpdGluZ35+IGZvciBhIHF1aWNrIHR1dG9yaWFsXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3JlbmFtZSc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2FwcGxpY2FibGUnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIFlvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiLFxuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogcmVuYW1lQ29tbWFuZCxcbiAgICAgICdwYXJzZScgOiB0cnVlLFxuICAgICAgJ2FsbG93ZWROYW1lZCc6Wydmcm9tJywndG8nXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQWxsb3dzIHRvIHJlbmFtZSBhIGNvbW1hbmQgYW5kIGNoYW5nZSBpdCdzIG5hbWVzcGFjZS4gXG4gICAgICAgIFlvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cbiAgICAgICAgLSBUaGUgZmlyc3QgcGFyYW0gaXMgdGhlIG9sZCBuYW1lXG4gICAgICAgIC0gVGhlbiBzZWNvbmQgcGFyYW0gaXMgdGhlIG5ldyBuYW1lLCBpZiBpdCBoYXMgbm8gbmFtZXNwYWNlLFxuICAgICAgICAgIGl0IHdpbGwgdXNlIHRoZSBvbmUgZnJvbSB0aGUgb3JpZ2luYWwgY29tbWFuZC5cblxuICAgICAgICBleC46IH5+IXJlbmFtZSBteV9jb21tYW5kIG15X2NvbW1hbmQyfn5cbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncmVtb3ZlJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfYXBwbGljYWJsZScgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCIsXG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiByZW1vdmVDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnY21kJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIEFsbG93cyB0byByZW1vdmUgYSBjb21tYW5kLiBcbiAgICAgICAgWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdhbGlhcyc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogYWxpYXNDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICB9LFxuICAgICduYW1lc3BhY2UnOntcbiAgICAgICdjbHMnIDogTmFtZVNwYWNlQ21kXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBTaG93IHRoZSBjdXJyZW50IG5hbWVzcGFjZXMuXG5cbiAgICAgICAgQSBuYW1lIHNwYWNlIGNvdWxkIGJlIHRoZSBuYW1lIG9mIHRoZSBsYW5ndWFnZVxuICAgICAgICBvciBvdGhlciBraW5kIG9mIGNvbnRleHRzXG5cbiAgICAgICAgSWYgeW91IHBhc3MgYSBwYXJhbSB0byB0aGlzIGNvbW1hbmQsIGl0IHdpbGwgXG4gICAgICAgIGFkZCB0aGUgcGFyYW0gYXMgYSBuYW1lc3BhY2UgZm9yIHRoZSBjdXJyZW50IGVkaXRvclxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICduc3BjJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTpuYW1lc3BhY2UnXG4gICAgfSxcbiAgICAnbGlzdCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBsaXN0Q29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJ11cbiAgICAgICdwYXJzZScgOiB0cnVlXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBMaXN0IGF2YWlsYWJsZSBjb21tYW5kc1xuXG4gICAgICAgIFlvdSBjYW4gdXNlIHRoZSBmaXJzdCBhcmd1bWVudCB0byBjaG9vc2UgYSBzcGVjaWZpYyBuYW1lc3BhY2UsIFxuICAgICAgICBieSBkZWZhdWx0IGFsbCBjdXJlbnQgbmFtZXNwYWNlIHdpbGwgYmUgc2hvd25cbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnbHMnOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOmxpc3QnXG4gICAgfSxcbiAgICAnZW1tZXQnOntcbiAgICAgICdjbHMnIDogRW1tZXRDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIENvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcbiAgICAgICAgcHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuXG5cbiAgICAgICAgUGFzcyB0aGUgRW1tZXQgYWJicmV2aWF0aW9uIGFzIGEgcGFyYW0gdG8gZXhwZW5kIGl0LlxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgIFxuICB9KVxuICBcbmhlbHAgPSAoaW5zdGFuY2UpIC0+XG4gIGNtZE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnY21kJ10pXG4gIGlmIGNtZE5hbWU/XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQoY21kTmFtZSlcbiAgICBpZiBjbWQ/XG4gICAgICBoZWxwQ21kID0gY21kLmdldENtZCgnaGVscCcpXG4gICAgICB0ZXh0ID0gaWYgaGVscENtZCB0aGVuIFwifn4je2hlbHBDbWQuZnVsbE5hbWV9fn5cIiBlbHNlIFwiVGhpcyBjb21tYW5kIGhhcyBubyBoZWxwIHRleHRcIlxuICAgICAgcmV0dXJuIFwiXCJcIlxuICAgICAgICB+fmJveH5+XG4gICAgICAgIEhlbHAgZm9yIH5+ISN7Y21kLmZ1bGxOYW1lfX5+IDpcblxuICAgICAgICAje3RleHR9XG5cbiAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgfn4vYm94fn5cbiAgICAgICAgXCJcIlwiXG4gICAgZWxzZSBcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIlxuICBlbHNlXG4gICAgcmV0dXJuICd+fmhlbHA6b3ZlcnZpZXd+fidcblxubm9fZXhlY3V0ZSA9IChpbnN0YW5jZSkgLT5cbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIrU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzKSArICcpJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikpXG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsJyQxJylcbiAgXG5xdW90ZV9jYXJyZXQgPSAoaW5zdGFuY2UpIC0+XG4gIHJldHVybiBpbnN0YW5jZS5jb250ZW50LnJlcGxhY2UoL1xcfC9nLCAnfHwnKVxuZXhlY19wYXJlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGlmIGluc3RhbmNlLnBhcmVudD9cbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpXG4gICAgaW5zdGFuY2UucmVwbGFjZVN0YXJ0ID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VTdGFydFxuICAgIGluc3RhbmNlLnJlcGxhY2VFbmQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZUVuZFxuICAgIHJldHVybiByZXNcbmdldENvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSxmYWxzZSlcbiAgcHJlZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgc3VmZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgaWYgaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZT9cbiAgICByZXR1cm4gcHJlZml4ICsgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuY29udGVudCBvciAnJykgKyBzdWZmaXhcbiAgaWYgYWZmaXhlc19lbXB0eVxuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXhcbnJlbmFtZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG4gICAgc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgLnRoZW4gKHNhdmVkQ21kcyk9PlxuICAgIG9yaWduaW5hbE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZnJvbSddKVxuICAgIG5ld05hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwndG8nXSlcbiAgICBpZiBvcmlnbmluYWxOYW1lPyBhbmQgbmV3TmFtZT9cbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG9yaWduaW5hbE5hbWUpXG4gICAgICBpZiBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0/IGFuZCBjbWQ/XG4gICAgICAgIHVubGVzcyBuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAgICAgbmV3TmFtZSA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG9yaWduaW5hbE5hbWUsJycpICsgbmV3TmFtZVxuICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsY21kRGF0YSlcbiAgICAgICAgY21kLnVucmVnaXN0ZXIoKVxuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhXG4gICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgICAudGhlbiA9PlxuICAgICAgICAgIHJldHVybiBcIlwiXG4gICAgICBlbHNlIGlmIGNtZD8gXG4gICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiXG4gICAgICBlbHNlIFxuICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbnJlbW92ZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2NtZCddKVxuICAgIGlmIG5hbWU/XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICAgIHN0b3JhZ2UgPSBDb21tYW5kLnN0b3JhZ2VcbiAgICAgICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAgIC50aGVuIChzYXZlZENtZHMpPT5cbiAgICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQobmFtZSlcbiAgICAgICAgaWYgc2F2ZWRDbWRzW25hbWVdPyBhbmQgY21kP1xuICAgICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbbmFtZV1cbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpXG4gICAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tuYW1lXVxuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgICAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgICAgIC50aGVuID0+XG4gICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBlbHNlIGlmIGNtZD8gXG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCJcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbmFsaWFzQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIGFsaWFzID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2FsaWFzJ10pXG4gIGlmIG5hbWU/IGFuZCBhbGlhcz9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuICAgIGlmIGNtZD9cbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgb3IgY21kXG4gICAgICAjIHVubGVzcyBhbGlhcy5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgICAjIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7IGFsaWFzT2Y6IGNtZC5mdWxsTmFtZSB9KVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIFxuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5cbmxpc3RDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBcbiAgYm94ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnYm94J10sdHJ1ZSlcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIG5hbWVzcGFjZXMgPSBpZiBuYW1lIFxuICAgIFtuYW1lXSBcbiAgZWxzZSBcbiAgICBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKS5maWx0ZXIoKG5zcGMpID0+IG5zcGMgIT0gaW5zdGFuY2UuY21kLmZ1bGxOYW1lKVxuXG4gIGNvbW1hbmRzID0gbmFtZXNwYWNlcy5yZWR1Y2UgKGNvbW1hbmRzLCBuc3BjKSA9PiBcbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG5zcGMsbXVzdEV4ZWN1dGU6ZmFsc2UpXG4gICAgICBpZiBjbWQ/XG4gICAgICAgIGNtZC5pbml0KClcbiAgICAgICAgaWYgY21kLmNtZHNcbiAgICAgICAgICBjb21tYW5kcyA9IGNvbW1hbmRzLmNvbmNhdChjbWQuY21kcylcbiAgICAgICAgY29tbWFuZHNcbiAgICAsIFtdXG5cbiAgdGV4dCA9IGNvbW1hbmRzLm1hcCgoY21kKT0+Y21kLmZ1bGxOYW1lKS5qb2luKFwiXFxuXCIpXG4gIGlmIGJveFxuICAgIFwiXCJcIlxuICAgICAgfn5ib3h+flxuICAgICAgI3t0ZXh0fVxuXG4gICAgICB+fiFjbG9zZXx+flxuICAgICAgfn4vYm94fn5cbiAgICAgIFwiXCJcIlxuICBlbHNlXG4gICAgdGV4dFxuXG4gICAgICBcbmdldFBhcmFtID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlP1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcyxpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsJ2RlZmF1bHQnXSkpXG4gIFxuY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAaGVscGVyID0gbmV3IEJveEhlbHBlcihAaW5zdGFuY2UuY29udGV4dClcbiAgICBAY21kID0gQGluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pXG4gICAgaWYgQGNtZD9cbiAgICAgIEBoZWxwZXIub3BlblRleHQgID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAY21kICsgQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIEBoZWxwZXIuY2xvc2VUZXh0ID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZC5zcGxpdChcIiBcIilbMF0gKyBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgIEBoZWxwZXIuZGVjbyA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5kZWNvXG4gICAgQGhlbHBlci5wYWQgPSAyXG4gICAgQGhlbHBlci5wcmVmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgICBAaGVscGVyLnN1ZmZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCcnKVxuICAgIFxuICBoZWlnaHQ6IC0+XG4gICAgaWYgQGJvdW5kcygpP1xuICAgICAgaGVpZ2h0ID0gQGJvdW5kcygpLmhlaWdodFxuICAgIGVsc2VcbiAgICAgIGhlaWdodCA9IDNcbiAgICAgIFxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J11cbiAgICBpZiBAaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEgXG4gICAgICBwYXJhbXMucHVzaCgxKVxuICAgIGVsc2UgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAwXG4gICAgICBwYXJhbXMucHVzaCgwKVxuICAgIHJldHVybiBAaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLGhlaWdodClcbiAgICAgIFxuICB3aWR0aDogLT5cbiAgICBpZiBAYm91bmRzKCk/XG4gICAgICB3aWR0aCA9IEBib3VuZHMoKS53aWR0aFxuICAgIGVsc2VcbiAgICAgIHdpZHRoID0gM1xuICAgICAgXG4gICAgcGFyYW1zID0gWyd3aWR0aCddXG4gICAgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxIFxuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICByZXR1cm4gTWF0aC5tYXgoQG1pbldpZHRoKCksIEBpbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSlcblxuICBcbiAgYm91bmRzOiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgQF9ib3VuZHM/XG4gICAgICAgIEBfYm91bmRzID0gQGhlbHBlci50ZXh0Qm91bmRzKEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcmV0dXJuIEBfYm91bmRzXG4gICAgICBcbiAgcmVzdWx0OiAtPlxuICAgIEBoZWxwZXIuaGVpZ2h0ID0gQGhlaWdodCgpXG4gICAgQGhlbHBlci53aWR0aCA9IEB3aWR0aCgpXG4gICAgcmV0dXJuIEBoZWxwZXIuZHJhdyhAaW5zdGFuY2UuY29udGVudClcbiAgbWluV2lkdGg6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJldHVybiBAY21kLmxlbmd0aFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwXG4gIFxuY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBpbnN0YW5jZS5jb250ZXh0KVxuICBleGVjdXRlOiAtPlxuICAgIHByZWZpeCA9IEBoZWxwZXIucHJlZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gICAgc3VmZml4ID0gQGhlbHBlci5zdWZmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgICBib3ggPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3JlcXVpcmVkX2FmZml4ZXMnXSx0cnVlKVxuICAgIGlmICFyZXF1aXJlZF9hZmZpeGVzXG4gICAgICBAaGVscGVyLnByZWZpeCA9IEBoZWxwZXIuc3VmZml4ID0gJydcbiAgICAgIGJveDIgPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgICBpZiBib3gyPyBhbmQgKCFib3g/IG9yIGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIG9yIGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpXG4gICAgICAgIGJveCA9IGJveDJcbiAgICBpZiBib3g/XG4gICAgICBkZXB0aCA9IEBoZWxwZXIuZ2V0TmVzdGVkTHZsKEBpbnN0YW5jZS5nZXRQb3MoKS5zdGFydClcbiAgICAgIGlmIGRlcHRoIDwgMlxuICAgICAgICBAaW5zdGFuY2UuaW5Cb3ggPSBudWxsXG4gICAgICBAaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LGJveC5lbmQsJycpKVxuICAgIGVsc2VcbiAgICAgIEBpbnN0YW5jZS5yZXBsYWNlV2l0aCgnJylcbiAgICAgICAgICBcbmNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBjbWROYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgICBAdmVyYmFsaXplID0gQGluc3RhbmNlLmdldFBhcmFtKFsxXSkgaW4gWyd2JywndmVyYmFsaXplJ11cbiAgICBpZiBAY21kTmFtZT9cbiAgICAgIEBmaW5kZXIgPSBAaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRGaW5kZXIoQGNtZE5hbWUpIFxuICAgICAgQGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgQGVkaXRhYmxlID0gaWYgQGNtZD8gdGhlbiBAY21kLmlzRWRpdGFibGUoKSBlbHNlIHRydWVcbiAgcmVzdWx0OiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICByZXR1cm4gQHJlc3VsdFdpdGhDb250ZW50KClcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQHJlc3VsdFdpdGhvdXRDb250ZW50KClcbiAgcmVzdWx0V2l0aENvbnRlbnQ6IC0+XG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChAaW5zdGFuY2UuY29udGVudClcbiAgICAgIHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICBkYXRhID0ge31cbiAgICAgIGZvciBwIGluIEVkaXRDbWQucHJvcHNcbiAgICAgICAgcC53cml0ZUZvcihwYXJzZXIsZGF0YSlcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChAY21kTmFtZSwgZGF0YSlcbiAgICAgIHJldHVybiAnJ1xuICBwcm9wc0Rpc3BsYXk6IC0+XG4gICAgICBjbWQgPSBAY21kXG4gICAgICByZXR1cm4gRWRpdENtZC5wcm9wcy5tYXAoIChwKS0+IHAuZGlzcGxheShjbWQpICkuZmlsdGVyKCAocCktPiBwPyApLmpvaW4oXCJcXG5cIilcbiAgcmVzdWx0V2l0aG91dENvbnRlbnQ6IC0+XG4gICAgaWYgIUBjbWQgb3IgQGVkaXRhYmxlXG4gICAgICBuYW1lID0gaWYgQGNtZCB0aGVuIEBjbWQuZnVsbE5hbWUgZWxzZSBAY21kTmFtZVxuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQoXG4gICAgICAgIFwiXCJcIlxuICAgICAgICB+fmJveCBjbWQ6XCIje0BpbnN0YW5jZS5jbWQuZnVsbE5hbWV9ICN7bmFtZX1cIn5+XG4gICAgICAgICN7QHByb3BzRGlzcGxheSgpfVxuICAgICAgICB+fiFzYXZlfn4gfn4hY2xvc2V+flxuICAgICAgICB+fi9ib3h+flxuICAgICAgICBcIlwiXCIpXG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBub1xuICAgICAgcmV0dXJuIGlmIEB2ZXJiYWxpemUgdGhlbiBwYXJzZXIuZ2V0VGV4dCgpIGVsc2UgcGFyc2VyLnBhcnNlQWxsKClcbkVkaXRDbWQuc2V0Q21kcyA9IChiYXNlKSAtPlxuICBpbkluc3RhbmNlID0gYmFzZS5pbl9pbnN0YW5jZSA9IHtjbWRzOnt9fVxuICBmb3IgcCBpbiBFZGl0Q21kLnByb3BzXG4gICAgcC5zZXRDbWQoaW5JbnN0YW5jZS5jbWRzKVxuICAgICMgcC5zZXRDbWQoYmFzZSlcbiAgcmV0dXJuIGJhc2VcbkVkaXRDbWQucHJvcHMgPSBbXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19jYXJyZXQnLCAgICAgICAgIHtvcHQ6J2NoZWNrQ2FycmV0J30pLFxuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fcGFyc2UnLCAgICAgICAgICB7b3B0OidwYXJzZSd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woICAgJ3ByZXZlbnRfcGFyc2VfYWxsJywge29wdDoncHJldmVudFBhcnNlQWxsJ30pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCggICAncmVwbGFjZV9ib3gnLCAgICAgICB7b3B0OidyZXBsYWNlQm94J30pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCAnbmFtZV90b19wYXJhbScsICAgICB7b3B0OiduYW1lVG9QYXJhbSd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZyggJ2FsaWFzX29mJywgICAgICAgICAge3ZhcjonYWxpYXNPZicsIGNhcnJldDp0cnVlfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoICdoZWxwJywgICAgICAgICAgICAgIHtmdW5jdDonaGVscCcsIHNob3dFbXB0eTp0cnVlfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoICdzb3VyY2UnLCAgICAgICAgICAgIHt2YXI6J3Jlc3VsdFN0cicsIGRhdGFOYW1lOidyZXN1bHQnLCBzaG93RW1wdHk6dHJ1ZSwgY2FycmV0OnRydWV9KSxcbl1cbmNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQG5hbWUgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzBdKVxuICByZXN1bHQ6IC0+XG4gICAgaWYgQG5hbWU/XG4gICAgICBAaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQuYWRkTmFtZVNwYWNlKEBuYW1lKVxuICAgICAgcmV0dXJuICcnXG4gICAgZWxzZVxuICAgICAgbmFtZXNwYWNlcyA9IEBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKVxuICAgICAgdHh0ID0gJ35+Ym94fn5cXG4nXG4gICAgICBmb3IgbnNwYyBpbiBuYW1lc3BhY2VzIFxuICAgICAgICBpZiBuc3BjICE9IEBpbnN0YW5jZS5jbWQuZnVsbE5hbWVcbiAgICAgICAgICB0eHQgKz0gbnNwYysnXFxuJ1xuICAgICAgdHh0ICs9ICd+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQodHh0KVxuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpXG5cblxuXG5jbGFzcyBFbW1ldENtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGFiYnIgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2FiYnInLCdhYmJyZXZpYXRpb24nXSlcbiAgICBAbGFuZyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMSwnbGFuZycsJ2xhbmd1YWdlJ10pXG4gIHJlc3VsdDogLT5cbiAgICBlbW1ldCA9IGlmIHdpbmRvdz8uZW1tZXQ/XG4gICAgICB3aW5kb3cuZW1tZXRcbiAgICBlbHNlIGlmIHdpbmRvdz8uc2VsZj8uZW1tZXQ/XG4gICAgICB3aW5kb3cuc2VsZi5lbW1ldFxuICAgIGVsc2UgaWYgd2luZG93Py5nbG9iYWw/LmVtbWV0P1xuICAgICAgd2luZG93Lmdsb2JhbC5lbW1ldFxuICAgIGVsc2UgaWYgcmVxdWlyZT8gXG4gICAgICB0cnkgXG4gICAgICAgIHJlcXVpcmUoJ2VtbWV0JylcbiAgICAgIGNhdGNoIGV4XG4gICAgICAgIEBpbnN0YW5jZS5jb2Rld2F2ZS5sb2dnZXIubG9nKCdFbW1ldCBpcyBub3QgYXZhaWxhYmxlLCBpdCBtYXkgbmVlZCB0byBiZSBpbnN0YWxsZWQgbWFudWFsbHknKVxuICAgICAgICBudWxsXG4gICAgaWYgZW1tZXQ/XG4gICAgICAjIGVtbWV0LnJlcXVpcmUoJy4vcGFyc2VyL2FiYnJldmlhdGlvbicpLmV4cGFuZCgndWw+bGknLCB7cGFzdGVkQ29udGVudDonbG9yZW0nfSlcbiAgICAgIHJlcyA9IGVtbWV0LmV4cGFuZEFiYnJldmlhdGlvbihAYWJiciwgQGxhbmcpXG4gICAgICByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpXG5cblxuXG4iLCJ2YXIgQm94Q21kLCBDbG9zZUNtZCwgRWRpdENtZCwgRW1tZXRDbWQsIE5hbWVTcGFjZUNtZCwgYWxpYXNDb21tYW5kLCBleGVjX3BhcmVudCwgZ2V0Q29udGVudCwgZ2V0UGFyYW0sIGhlbHAsIGxpc3RDb21tYW5kLCBub19leGVjdXRlLCBxdW90ZV9jYXJyZXQsIHJlbW92ZUNvbW1hbmQsIHJlbmFtZUNvbW1hbmQ7XG5cbmltcG9ydCB7XG4gIENvbW1hbmQsXG4gIEJhc2VDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBMYW5nRGV0ZWN0b3Jcbn0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuXG5pbXBvcnQge1xuICBCb3hIZWxwZXJcbn0gZnJvbSAnLi4vQm94SGVscGVyJztcblxuaW1wb3J0IHtcbiAgRWRpdENtZFByb3Bcbn0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCB2YXIgQ29yZUNvbW1hbmRQcm92aWRlciA9IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNvcmU7XG4gICAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjb3JlJykpO1xuICAgIGNvcmUuYWRkRGV0ZWN0b3IobmV3IExhbmdEZXRlY3RvcigpKTtcbiAgICByZXR1cm4gY29yZS5hZGRDbWRzKHtcbiAgICAgICdoZWxwJzoge1xuICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICdyZXN1bHQnOiBoZWxwLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydjbWQnXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRvIGdldCBoZWxwIG9uIGEgcGVjaWZpYyBjb21tYW5kLCBkbyA6XFxufn5oZWxwIGhlbGxvfn4gKGhlbGxvIGJlaW5nIHRoZSBjb21tYW5kKVwiLFxuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnb3ZlcnZpZXcnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn5xdW90ZV9jYXJyZXR+flxcbiAgX19fICAgICAgICAgXyAgIF9fICAgICAgX19cXG4gLyBfX3xfX18gIF9ffCB8X19cXFxcIFxcXFwgICAgLyAvXyBfX18gX19fX19fXFxuLyAvX18vIF8gXFxcXC8gX2AgLyAtX1xcXFwgXFxcXC9cXFxcLyAvIF9gIFxcXFwgViAvIC1fL1xcblxcXFxfX19fXFxcXF9fXy9cXFxcX18sX1xcXFxfX198XFxcXF8vXFxcXF8vXFxcXF9fLF98XFxcXF8vXFxcXF9fX3xcXG5UaGUgdGV4dCBlZGl0b3IgaGVscGVyXFxufn4vcXVvdGVfY2FycmV0fn5cXG5cXG5XaGVuIHVzaW5nIENvZGV3YXZlIHlvdSB3aWxsIGJlIHdyaXRpbmcgY29tbWFuZHMgd2l0aGluIFxcbnlvdXIgdGV4dCBlZGl0b3IuIFRoZXNlIGNvbW1hbmRzIG11c3QgYmUgcGxhY2VkIGJldHdlZW4gdHdvIFxcbnBhaXJzIG9mIFxcXCJ+XFxcIiAodGlsZGUpIGFuZCB0aGVuLCB0aGV5IGNhbiBiZSBleGVjdXRlZCBieSBwcmVzc2luZyBcXG5cXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIsIHdpdGggeW91ciBjdXJzb3IgaW5zaWRlIHRoZSBjb21tYW5kXFxuRXg6IH5+IWhlbGxvfn5cXG5cXG5Zb3UgZG9udCBuZWVkIHRvIGFjdHVhbGx5IHR5cGUgYW55IFxcXCJ+XFxcIiAodGlsZGUpLiBcXG5QcmVzc2luZyBcXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XFxud2l0aGluIGEgY29tbWFuZC5cXG5cXG5Db2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxcbkluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxcblRoZSBnZW5lcmF0ZWQgY29tbWVudCBibG9ja3Mgd2lsbCBiZSByZWZlcnJlZCB0byBhcyB3aW5kb3dzIFxcbmluIHRoZSBoZWxwIHNlY3Rpb25zLlxcblxcblRvIGNsb3NlIHRoaXMgd2luZG93IChpLmUuIHJlbW92ZSB0aGlzIGNvbW1lbnQgYmxvY2spLCBwcmVzcyBcXG5cXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXFxufn4hY2xvc2V8fn5cXG5cXG5Vc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcXG5mZWF0dXJlcyBvZiBDb2Rld2F2ZVxcbn5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiBvciB+fiFoZWxwOmRlbW9+flxcblxcbkxpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXFxufn4haGVscDpzdWJqZWN0c35+IG9yIH5+IWhlbHA6c3Vifn4gXFxuXFxufn4hY2xvc2V+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdzdWJqZWN0cyc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fiFoZWxwfn5cXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxcbn5+IWhlbHA6c3ViamVjdHN+fiAofn4haGVscDpzdWJ+filcXG5+fiFoZWxwOmVkaXRpbmd+fiAofn4haGVscDplZGl0fn4pXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc3ViJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpzdWJqZWN0cydcbiAgICAgICAgICB9LFxuICAgICAgICAgICdnZXRfc3RhcnRlZCc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5UaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cXG5+fiFoZWxsb3x+flxcblxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuXFxuRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcXG5+fiFoZWxwOmVkaXRpbmd+flxcblxcbkNvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxcbm9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xcbn5+IWpzOmZ+flxcbn5+IWpzOmlmfn5cXG4gIH5+IWpzOmxvZ35+XFxcIn5+IWhlbGxvfn5cXFwifn4hL2pzOmxvZ35+XFxufn4hL2pzOmlmfn5cXG5+fiEvanM6Zn5+XFxuXFxuQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxcbnByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLiBFbW1ldCBhYmJyZXZpYXRpb25zIHdpbGwgYmUgXFxudXNlZCBhdXRvbWF0aWNhbGx5IGlmIHlvdSBhcmUgaW4gYSBIVE1MIG9yIENTUyBmaWxlLlxcbn5+IXVsPmxpfn4gKGlmIHlvdSBhcmUgaW4gYSBodG1sIGRvY2N1bWVudClcXG5+fiFlbW1ldCB1bD5saX5+XFxufn4hZW1tZXQgbTIgY3Nzfn5cXG5cXG5Db21tYW5kcyBhcmUgc3RvcmVkIGluIG5hbWVzcGFjZXMuIFRoZSBzYW1lIGNvbW1hbmQgY2FuIGhhdmUgXFxuZGlmZmVyZW50IHJlc3VsdHMgZGVwZW5kaW5nIG9uIHRoZSBuYW1lc3BhY2UuXFxufn4hanM6ZWFjaH5+XFxufn4hcGhwOm91dGVyOmVhY2h+flxcbn5+IXBocDppbm5lcjplYWNofn5cXG5cXG5Tb21lIG9mIHRoZSBuYW1lc3BhY2VzIGFyZSBhY3RpdmUgZGVwZW5kaW5nIG9uIHRoZSBjb250ZXh0LiBUaGVcXG5mb2xsb3dpbmcgY29tbWFuZHMgYXJlIHRoZSBzYW1lIGFuZCB3aWxsIGRpc3BsYXkgdGhlIGN1cnJlbnRseVxcbmFjdGl2ZSBuYW1lc3BhY2UuIFRoZSBmaXJzdCBjb21tYW5kIGNvbW1hbmQgd29ya3MgYmVjYXVzZSB0aGUgXFxuY29yZSBuYW1lc3BhY2UgaXMgYWN0aXZlLlxcbn5+IW5hbWVzcGFjZX5+XFxufn4hY29yZTpuYW1lc3BhY2V+flxcblxcbllvdSBjYW4gbWFrZSBhIG5hbWVzcGFjZSBhY3RpdmUgd2l0aCB0aGUgZm9sbG93aW5nIGNvbW1hbmQuXFxufn4hbmFtZXNwYWNlIHBocH5+XFxuXFxuQ2hlY2sgdGhlIG5hbWVzcGFjZXMgYWdhaW5cXG5+fiFuYW1lc3BhY2V+flxcblxcbkluIGFkZGl0aW9uIHRvIGRldGVjdGluZyB0aGUgZG9jdW1lbnQgdHlwZSwgQ29kZXdhdmUgY2FuIGRldGVjdCB0aGVcXG5jb250ZXh0IGZyb20gdGhlIHN1cnJvdW5kaW5nIHRleHQuIEluIGEgUEhQIGZpbGUsIGl0IG1lYW5zIENvZGV3YXZlIFxcbndpbGwgYWRkIHRoZSBQSFAgdGFncyB3aGVuIHlvdSBuZWVkIHRoZW0uXFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdkZW1vJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpnZXRfc3RhcnRlZCdcbiAgICAgICAgICB9LFxuICAgICAgICAgICdlZGl0aW5nJzoge1xuICAgICAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgICAgICdpbnRybyc6IHtcbiAgICAgICAgICAgICAgICAncmVzdWx0JzogXCJDb2Rld2F2ZSBhbGxvd3MgeW91IHRvIG1ha2UgeW91ciBvd24gY29tbWFuZHMgKG9yIGFiYnJldmlhdGlvbnMpIFxcbnB1dCB5b3VyIGNvbnRlbnQgaW5zaWRlIFxcXCJzb3VyY2VcXFwiIHRoZSBkbyBcXFwic2F2ZVxcXCIuIFRyeSBhZGRpbmcgYW55IFxcbnRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXFxufn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxcblxcbklmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XFxuZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxcbndoZW5ldmVyIHlvdSB3YW50Llxcbn5+IW15X25ld19jb21tYW5kfn5cIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5cXG5BbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcXFwiYm94XFxcIi4gXFxuVGhleSBhcmUgbWVhbnQgdG8gZGlzcGxheSB0ZXh0IHRoYXQgc2hvdWxkIG5vdCByZW1haW4gaW4geW91ciBjb2RlLiBcXG5UaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXFxuXFxcImNsb3NlXFxcIiBjYW4gYmUgdXNlZCB0byByZW1vdmUgdGhlbSByYXBpZGx5LiBZb3UgY2FuIG1ha2UgeW91ciBvd24gXFxuY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5Llxcbn5+IWJveH5+XFxuVGhlIGJveCB3aWxsIHNjYWxlIHdpdGggdGhlIGNvbnRlbnQgeW91IHB1dCBpbiBpdFxcbn5+IWNsb3NlfH5+XFxufn4hL2JveH5+XFxuXFxufn5xdW90ZV9jYXJyZXR+flxcbldoZW4geW91IGNyZWF0ZSBhIGNvbW1hbmQsIHlvdSBtYXkgd2FudCB0byBzcGVjaWZ5IHdoZXJlIHRoZSBjdXJzb3IgXFxud2lsbCBiZSBsb2NhdGVkIG9uY2UgdGhlIGNvbW1hbmQgaXMgZXhwYW5kZWQuIFRvIGRvIHRoYXQsIHVzZSBhIFxcXCJ8XFxcIiBcXG4oVmVydGljYWwgYmFyKS4gVXNlIDIgb2YgdGhlbSBpZiB5b3Ugd2FudCB0byBwcmludCB0aGUgYWN0dWFsIFxcbmNoYXJhY3Rlci5cXG5+fiFib3h+flxcbm9uZSA6IHwgXFxudHdvIDogfHxcXG5+fiEvYm94fn5cXG5cXG5Zb3UgY2FuIGFsc28gdXNlIHRoZSBcXFwiZXNjYXBlX3BpcGVzXFxcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxcbnZlcnRpY2FsIGJhcnMgdGhhdCBhcmUgYmV0d2VlbiBpdHMgb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzXFxufn4hZXNjYXBlX3BpcGVzfn5cXG58XFxufn4hL2VzY2FwZV9waXBlc35+XFxuXFxuQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cXG5JZiB5b3Ugd2FudCB0byBwcmludCBhIGNvbW1hbmQgd2l0aG91dCBoYXZpbmcgaXQgZXhwYW5kIHdoZW4gXFxudGhlIHBhcmVudCBjb21tYW5kIGlzIGV4cGFuZGVkLCB1c2UgYSBcXFwiIVxcXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxcbn5+ISFoZWxsb35+XFxuXFxuRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXFxudGhlIFxcXCJjb250ZW50XFxcIiBjb21tYW5kLiBcXFwiY29udGVudFxcXCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XFxudGhhdCBpcyBiZXR3ZWVuIHRoZSB0YWdzLiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgaG93IGl0IGNhbiBiZSB1c2VkLlxcbn5+IWVkaXQgcGhwOmlubmVyOmlmfn5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2VkaXQnOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmVkaXRpbmcnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdub19leGVjdXRlJzoge1xuICAgICAgICAncmVzdWx0Jzogbm9fZXhlY3V0ZSxcbiAgICAgICAgJ2hlbHAnOiBcIlByZXZlbnQgZXZlcnl0aGluZyBpbnNpZGUgdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBmcm9tIGV4ZWN1dGluZ1wiXG4gICAgICB9LFxuICAgICAgJ2VzY2FwZV9waXBlcyc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHF1b3RlX2NhcnJldCxcbiAgICAgICAgJ2NoZWNrQ2FycmV0JzogZmFsc2UsXG4gICAgICAgICdoZWxwJzogXCJFc2NhcGUgYWxsIGNhcnJldHMgKGZyb20gXFxcInxcXFwiIHRvIFxcXCJ8fFxcXCIpXCJcbiAgICAgIH0sXG4gICAgICAncXVvdGVfY2FycmV0Jzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICAgIH0sXG4gICAgICAnZXhlY19wYXJlbnQnOiB7XG4gICAgICAgICdleGVjdXRlJzogZXhlY19wYXJlbnQsXG4gICAgICAgICdoZWxwJzogXCJFeGVjdXRlIHRoZSBmaXJzdCBjb21tYW5kIHRoYXQgd3JhcCB0aGlzIGluIGl0J3Mgb3BlbiBhbmQgY2xvc2UgdGFnXCJcbiAgICAgIH0sXG4gICAgICAnY29udGVudCc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGdldENvbnRlbnQsXG4gICAgICAgICdoZWxwJzogXCJNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIHdoYXQgd2FzIGJldHdlZW4gdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBvZiBhIGNvbW1hbmRcIlxuICAgICAgfSxcbiAgICAgICdib3gnOiB7XG4gICAgICAgICdjbHMnOiBCb3hDbWQsXG4gICAgICAgICdoZWxwJzogXCJDcmVhdGUgdGhlIGFwcGFyZW5jZSBvZiBhIGJveCBjb21wb3NlZCBmcm9tIGNoYXJhY3RlcnMuIFxcblVzdWFsbHkgd3JhcHBlZCBpbiBhIGNvbW1lbnQuXFxuXFxuVGhlIGJveCB3aWxsIHRyeSB0byBhanVzdCBpdCdzIHNpemUgZnJvbSB0aGUgY29udGVudFwiXG4gICAgICB9LFxuICAgICAgJ2Nsb3NlJzoge1xuICAgICAgICAnY2xzJzogQ2xvc2VDbWQsXG4gICAgICAgICdoZWxwJzogXCJXaWxsIGNsb3NlIHRoZSBmaXJzdCBib3ggYXJvdW5kIHRoaXNcIlxuICAgICAgfSxcbiAgICAgICdwYXJhbSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGdldFBhcmFtLFxuICAgICAgICAnaGVscCc6IFwiTWFpbmx5IHVzZWQgZm9yIGNvbW1hbmQgZWRpdGlvbiwgXFxudGhpcyB3aWxsIHJldHVybiBhIHBhcmFtZXRlciBmcm9tIHRoaXMgY29tbWFuZCBjYWxsXFxuXFxuWW91IGNhbiBwYXNzIGEgbnVtYmVyLCBhIHN0cmluZywgb3IgYm90aC4gXFxuQSBudW1iZXIgZm9yIGEgcG9zaXRpb25lZCBhcmd1bWVudCBhbmQgYSBzdHJpbmdcXG5mb3IgYSBuYW1lZCBwYXJhbWV0ZXJcIlxuICAgICAgfSxcbiAgICAgICdlZGl0Jzoge1xuICAgICAgICAnY21kcyc6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICAgJ3NhdmUnOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmV4ZWNfcGFyZW50J1xuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgICdjbHMnOiBFZGl0Q21kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydjbWQnXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byBlZGl0IGEgY29tbWFuZC4gXFxuU2VlIH5+IWhlbHA6ZWRpdGluZ35+IGZvciBhIHF1aWNrIHR1dG9yaWFsXCJcbiAgICAgIH0sXG4gICAgICAncmVuYW1lJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnbm90X2FwcGxpY2FibGUnOiBcIn5+Ym94fn5cXG5Zb3UgY2FuIG9ubHkgcmVuYW1lIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiLFxuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogcmVuYW1lQ29tbWFuZCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnZnJvbScsICd0byddLFxuICAgICAgICAnaGVscCc6IFwiQWxsb3dzIHRvIHJlbmFtZSBhIGNvbW1hbmQgYW5kIGNoYW5nZSBpdCdzIG5hbWVzcGFjZS4gXFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbi0gVGhlIGZpcnN0IHBhcmFtIGlzIHRoZSBvbGQgbmFtZVxcbi0gVGhlbiBzZWNvbmQgcGFyYW0gaXMgdGhlIG5ldyBuYW1lLCBpZiBpdCBoYXMgbm8gbmFtZXNwYWNlLFxcbiAgaXQgd2lsbCB1c2UgdGhlIG9uZSBmcm9tIHRoZSBvcmlnaW5hbCBjb21tYW5kLlxcblxcbmV4Ljogfn4hcmVuYW1lIG15X2NvbW1hbmQgbXlfY29tbWFuZDJ+flwiXG4gICAgICB9LFxuICAgICAgJ3JlbW92ZSc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9hcHBsaWNhYmxlJzogXCJ+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIixcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IHJlbW92ZUNvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2NtZCddLFxuICAgICAgICAnaGVscCc6IFwiQWxsb3dzIHRvIHJlbW92ZSBhIGNvbW1hbmQuIFxcbllvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cIlxuICAgICAgfSxcbiAgICAgICdhbGlhcyc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiBhbGlhc0NvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWVcbiAgICAgIH0sXG4gICAgICAnbmFtZXNwYWNlJzoge1xuICAgICAgICAnY2xzJzogTmFtZVNwYWNlQ21kLFxuICAgICAgICAnaGVscCc6IFwiU2hvdyB0aGUgY3VycmVudCBuYW1lc3BhY2VzLlxcblxcbkEgbmFtZSBzcGFjZSBjb3VsZCBiZSB0aGUgbmFtZSBvZiB0aGUgbGFuZ3VhZ2VcXG5vciBvdGhlciBraW5kIG9mIGNvbnRleHRzXFxuXFxuSWYgeW91IHBhc3MgYSBwYXJhbSB0byB0aGlzIGNvbW1hbmQsIGl0IHdpbGwgXFxuYWRkIHRoZSBwYXJhbSBhcyBhIG5hbWVzcGFjZSBmb3IgdGhlIGN1cnJlbnQgZWRpdG9yXCJcbiAgICAgIH0sXG4gICAgICAnbnNwYyc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpuYW1lc3BhY2UnXG4gICAgICB9LFxuICAgICAgJ2xpc3QnOiB7XG4gICAgICAgICdyZXN1bHQnOiBsaXN0Q29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZSddLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnaGVscCc6IFwiTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcXG5cXG5Zb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcXG5ieSBkZWZhdWx0IGFsbCBjdXJlbnQgbmFtZXNwYWNlIHdpbGwgYmUgc2hvd25cIlxuICAgICAgfSxcbiAgICAgICdscyc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpsaXN0J1xuICAgICAgfSxcbiAgICAgICdlbW1ldCc6IHtcbiAgICAgICAgJ2Nscyc6IEVtbWV0Q21kLFxuICAgICAgICAnaGVscCc6IFwiQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxcbnByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLlxcblxcblBhc3MgdGhlIEVtbWV0IGFiYnJldmlhdGlvbiBhcyBhIHBhcmFtIHRvIGV4cGVuZCBpdC5cIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbmhlbHAgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgY21kLCBjbWROYW1lLCBoZWxwQ21kLCB0ZXh0O1xuICBjbWROYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG4gIGlmIChjbWROYW1lICE9IG51bGwpIHtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChjbWROYW1lKTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGhlbHBDbWQgPSBjbWQuZ2V0Q21kKCdoZWxwJyk7XG4gICAgICB0ZXh0ID0gaGVscENtZCA/IGB+fiR7aGVscENtZC5mdWxsTmFtZX1+fmAgOiBcIlRoaXMgY29tbWFuZCBoYXMgbm8gaGVscCB0ZXh0XCI7XG4gICAgICByZXR1cm4gYH5+Ym94fn5cXG5IZWxwIGZvciB+fiEke2NtZC5mdWxsTmFtZX1+fiA6XFxuXFxuJHt0ZXh0fVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiAnfn5oZWxwOm92ZXJ2aWV3fn4nO1xuICB9XG59O1xuXG5ub19leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIHJlZztcbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSk7XG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsICckMScpO1xufTtcblxucXVvdGVfY2FycmV0ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgcmV0dXJuIGluc3RhbmNlLmNvbnRlbnQucmVwbGFjZSgvXFx8L2csICd8fCcpO1xufTtcblxuZXhlY19wYXJlbnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgcmVzO1xuICBpZiAoaW5zdGFuY2UucGFyZW50ICE9IG51bGwpIHtcbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpO1xuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnQ7XG4gICAgaW5zdGFuY2UucmVwbGFjZUVuZCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlRW5kO1xuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbmdldENvbnRlbnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgYWZmaXhlc19lbXB0eSwgcHJlZml4LCBzdWZmaXg7XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSwgZmFsc2UpO1xuICBwcmVmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gIHN1ZmZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBwcmVmaXggKyAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5jb250ZW50IHx8ICcnKSArIHN1ZmZpeDtcbiAgfVxuICBpZiAoYWZmaXhlc19lbXB0eSkge1xuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXg7XG4gIH1cbn07XG5cbnJlbmFtZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIHN0b3JhZ2U7XG4gICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICByZXR1cm4gc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gIH0pLnRoZW4oKHNhdmVkQ21kcykgPT4ge1xuICAgIHZhciBjbWQsIGNtZERhdGEsIG5ld05hbWUsIG9yaWduaW5hbE5hbWU7XG4gICAgb3JpZ25pbmFsTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZnJvbSddKTtcbiAgICBuZXdOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd0byddKTtcbiAgICBpZiAoKG9yaWduaW5hbE5hbWUgIT0gbnVsbCkgJiYgKG5ld05hbWUgIT0gbnVsbCkpIHtcbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG9yaWduaW5hbE5hbWUpO1xuICAgICAgaWYgKChzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0gIT0gbnVsbCkgJiYgKGNtZCAhPSBudWxsKSkge1xuICAgICAgICBpZiAoIShuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xKSkge1xuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCAnJykgKyBuZXdOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV07XG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsIGNtZERhdGEpO1xuICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhO1xuICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbnJlbW92ZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIG5hbWU7XG4gICAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcywgc3RvcmFnZTtcbiAgICAgICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbigoc2F2ZWRDbWRzKSA9PiB7XG4gICAgICAgIHZhciBjbWQsIGNtZERhdGE7XG4gICAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG5hbWUpO1xuICAgICAgICBpZiAoKHNhdmVkQ21kc1tuYW1lXSAhPSBudWxsKSAmJiAoY21kICE9IG51bGwpKSB7XG4gICAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tuYW1lXTtcbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV07XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFsaWFzQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnYWxpYXMnXSk7XG4gIGlmICgobmFtZSAhPSBudWxsKSAmJiAoYWxpYXMgIT0gbnVsbCkpIHtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgfHwgY21kO1xuICAgICAgLy8gdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAvLyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChhbGlhcywge1xuICAgICAgICBhbGlhc09mOiBjbWQuZnVsbE5hbWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH1cbn07XG5cbmxpc3RDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGJveCwgY29tbWFuZHMsIG5hbWUsIG5hbWVzcGFjZXMsIHRleHQ7XG4gIGJveCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2JveCddLCB0cnVlKTtcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgbmFtZXNwYWNlcyA9IG5hbWUgPyBbbmFtZV0gOiBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKS5maWx0ZXIoKG5zcGMpID0+IHtcbiAgICByZXR1cm4gbnNwYyAhPT0gaW5zdGFuY2UuY21kLmZ1bGxOYW1lO1xuICB9KTtcbiAgY29tbWFuZHMgPSBuYW1lc3BhY2VzLnJlZHVjZSgoY29tbWFuZHMsIG5zcGMpID0+IHtcbiAgICB2YXIgY21kO1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG5zcGMsIHtcbiAgICAgIG11c3RFeGVjdXRlOiBmYWxzZVxuICAgIH0pO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuY21kcykge1xuICAgICAgICBjb21tYW5kcyA9IGNvbW1hbmRzLmNvbmNhdChjbWQuY21kcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tbWFuZHM7XG4gICAgfVxuICB9LCBbXSk7XG4gIHRleHQgPSBjb21tYW5kcy5tYXAoKGNtZCkgPT4ge1xuICAgIHJldHVybiBjbWQuZnVsbE5hbWU7XG4gIH0pLmpvaW4oXCJcXG5cIik7XG4gIGlmIChib3gpIHtcbiAgICByZXR1cm4gYH5+Ym94fn5cXG4ke3RleHR9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbn07XG5cbmdldFBhcmFtID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcywgaW5zdGFuY2UuZ2V0UGFyYW0oWydkZWYnLCAnZGVmYXVsdCddKSk7XG4gIH1cbn07XG5cbkJveENtZCA9IGNsYXNzIEJveENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KTtcbiAgICB0aGlzLmNtZCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydjbWQnXSk7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaGVscGVyLm9wZW5UZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWQgKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICB0aGlzLmhlbHBlci5jbG9zZVRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY21kLnNwbGl0KFwiIFwiKVswXSArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cztcbiAgICB9XG4gICAgdGhpcy5oZWxwZXIuZGVjbyA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZGVjbztcbiAgICB0aGlzLmhlbHBlci5wYWQgPSAyO1xuICAgIHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICAgIHJldHVybiB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgfVxuXG4gIGhlaWdodCgpIHtcbiAgICB2YXIgaGVpZ2h0LCBwYXJhbXM7XG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5ib3VuZHMoKS5oZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IDM7XG4gICAgfVxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J107XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLnB1c2goMCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgaGVpZ2h0KTtcbiAgfVxuXG4gIHdpZHRoKCkge1xuICAgIHZhciBwYXJhbXMsIHdpZHRoO1xuICAgIGlmICh0aGlzLmJvdW5kcygpICE9IG51bGwpIHtcbiAgICAgIHdpZHRoID0gdGhpcy5ib3VuZHMoKS53aWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgd2lkdGggPSAzO1xuICAgIH1cbiAgICBwYXJhbXMgPSBbJ3dpZHRoJ107XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5taW5XaWR0aCgpLCB0aGlzLmluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgd2lkdGgpKTtcbiAgfVxuXG4gIGJvdW5kcygpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50KSB7XG4gICAgICBpZiAodGhpcy5fYm91bmRzID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fYm91bmRzID0gdGhpcy5oZWxwZXIudGV4dEJvdW5kcyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kcztcbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdGhpcy5oZWxwZXIuaGVpZ2h0ID0gdGhpcy5oZWlnaHQoKTtcbiAgICB0aGlzLmhlbHBlci53aWR0aCA9IHRoaXMud2lkdGgoKTtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuZHJhdyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICB9XG5cbiAgbWluV2lkdGgoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNtZC5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG59O1xuXG5DbG9zZUNtZCA9IGNsYXNzIENsb3NlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHJldHVybiB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGJveCwgYm94MiwgZGVwdGgsIHByZWZpeCwgcmVxdWlyZWRfYWZmaXhlcywgc3VmZml4O1xuICAgIHByZWZpeCA9IHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICAgIHN1ZmZpeCA9IHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpO1xuICAgIGJveCA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKTtcbiAgICByZXF1aXJlZF9hZmZpeGVzID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3JlcXVpcmVkX2FmZml4ZXMnXSwgdHJ1ZSk7XG4gICAgaWYgKCFyZXF1aXJlZF9hZmZpeGVzKSB7XG4gICAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSAnJztcbiAgICAgIGJveDIgPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSk7XG4gICAgICBpZiAoKGJveDIgIT0gbnVsbCkgJiYgKChib3ggPT0gbnVsbCkgfHwgYm94LnN0YXJ0IDwgYm94Mi5zdGFydCAtIHByZWZpeC5sZW5ndGggfHwgYm94LmVuZCA+IGJveDIuZW5kICsgc3VmZml4Lmxlbmd0aCkpIHtcbiAgICAgICAgYm94ID0gYm94MjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJveCAhPSBudWxsKSB7XG4gICAgICBkZXB0aCA9IHRoaXMuaGVscGVyLmdldE5lc3RlZEx2bCh0aGlzLmluc3RhbmNlLmdldFBvcygpLnN0YXJ0KTtcbiAgICAgIGlmIChkZXB0aCA8IDIpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5pbkJveCA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChib3guc3RhcnQsIGJveC5lbmQsICcnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLnJlcGxhY2VXaXRoKCcnKTtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZCA9IGNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdmFyIHJlZjtcbiAgICB0aGlzLmNtZE5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuICAgIHRoaXMudmVyYmFsaXplID0gKHJlZiA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzFdKSkgPT09ICd2JyB8fCByZWYgPT09ICd2ZXJiYWxpemUnO1xuICAgIGlmICh0aGlzLmNtZE5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSk7XG4gICAgICB0aGlzLmZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZTtcbiAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lZGl0YWJsZSA9IHRoaXMuY21kICE9IG51bGwgPyB0aGlzLmNtZC5pc0VkaXRhYmxlKCkgOiB0cnVlO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhDb250ZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhvdXRDb250ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0V2l0aENvbnRlbnQoKSB7XG4gICAgdmFyIGRhdGEsIGksIGxlbiwgcCwgcGFyc2VyLCByZWY7XG4gICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgZGF0YSA9IHt9O1xuICAgIHJlZiA9IEVkaXRDbWQucHJvcHM7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBwID0gcmVmW2ldO1xuICAgICAgcC53cml0ZUZvcihwYXJzZXIsIGRhdGEpO1xuICAgIH1cbiAgICBDb21tYW5kLnNhdmVDbWQodGhpcy5jbWROYW1lLCBkYXRhKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBwcm9wc0Rpc3BsYXkoKSB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSB0aGlzLmNtZDtcbiAgICByZXR1cm4gRWRpdENtZC5wcm9wcy5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHAuZGlzcGxheShjbWQpO1xuICAgIH0pLmZpbHRlcihmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gcCAhPSBudWxsO1xuICAgIH0pLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICByZXN1bHRXaXRob3V0Q29udGVudCgpIHtcbiAgICB2YXIgbmFtZSwgcGFyc2VyO1xuICAgIGlmICghdGhpcy5jbWQgfHwgdGhpcy5lZGl0YWJsZSkge1xuICAgICAgbmFtZSA9IHRoaXMuY21kID8gdGhpcy5jbWQuZnVsbE5hbWUgOiB0aGlzLmNtZE5hbWU7XG4gICAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQoYH5+Ym94IGNtZDpcIiR7dGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWV9ICR7bmFtZX1cIn5+XFxuJHt0aGlzLnByb3BzRGlzcGxheSgpfVxcbn5+IXNhdmV+fiB+fiFjbG9zZX5+XFxufn4vYm94fn5gKTtcbiAgICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMudmVyYmFsaXplKSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIuZ2V0VGV4dCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kLnNldENtZHMgPSBmdW5jdGlvbihiYXNlKSB7XG4gIHZhciBpLCBpbkluc3RhbmNlLCBsZW4sIHAsIHJlZjtcbiAgaW5JbnN0YW5jZSA9IGJhc2UuaW5faW5zdGFuY2UgPSB7XG4gICAgY21kczoge31cbiAgfTtcbiAgcmVmID0gRWRpdENtZC5wcm9wcztcbiAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcCA9IHJlZltpXTtcbiAgICBwLnNldENtZChpbkluc3RhbmNlLmNtZHMpO1xuICB9XG4gIC8vIHAuc2V0Q21kKGJhc2UpXG4gIHJldHVybiBiYXNlO1xufTtcblxuRWRpdENtZC5wcm9wcyA9IFtcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX2NhcnJldCcsXG4gIHtcbiAgICBvcHQ6ICdjaGVja0NhcnJldCdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19wYXJzZScsXG4gIHtcbiAgICBvcHQ6ICdwYXJzZSdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCdwcmV2ZW50X3BhcnNlX2FsbCcsXG4gIHtcbiAgICBvcHQ6ICdwcmV2ZW50UGFyc2VBbGwnXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCgncmVwbGFjZV9ib3gnLFxuICB7XG4gICAgb3B0OiAncmVwbGFjZUJveCdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoJ25hbWVfdG9fcGFyYW0nLFxuICB7XG4gICAgb3B0OiAnbmFtZVRvUGFyYW0nXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCdhbGlhc19vZicsXG4gIHtcbiAgICB2YXI6ICdhbGlhc09mJyxcbiAgICBjYXJyZXQ6IHRydWVcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoJ2hlbHAnLFxuICB7XG4gICAgZnVuY3Q6ICdoZWxwJyxcbiAgICBzaG93RW1wdHk6IHRydWVcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoJ3NvdXJjZScsXG4gIHtcbiAgICB2YXI6ICdyZXN1bHRTdHInLFxuICAgIGRhdGFOYW1lOiAncmVzdWx0JyxcbiAgICBzaG93RW1wdHk6IHRydWUsXG4gICAgY2FycmV0OiB0cnVlXG4gIH0pXG5dO1xuXG5OYW1lU3BhY2VDbWQgPSBjbGFzcyBOYW1lU3BhY2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzBdKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgaSwgbGVuLCBuYW1lc3BhY2VzLCBuc3BjLCBwYXJzZXIsIHR4dDtcbiAgICBpZiAodGhpcy5uYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQuYWRkTmFtZVNwYWNlKHRoaXMubmFtZSk7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWVzcGFjZXMgPSB0aGlzLmluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpO1xuICAgICAgdHh0ID0gJ35+Ym94fn5cXG4nO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gbmFtZXNwYWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBuc3BjID0gbmFtZXNwYWNlc1tpXTtcbiAgICAgICAgaWYgKG5zcGMgIT09IHRoaXMuaW5zdGFuY2UuY21kLmZ1bGxOYW1lKSB7XG4gICAgICAgICAgdHh0ICs9IG5zcGMgKyAnXFxuJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdHh0ICs9ICd+fiFjbG9zZXx+flxcbn5+L2JveH5+JztcbiAgICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0eHQpO1xuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FbW1ldENtZCA9IGNsYXNzIEVtbWV0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHRoaXMuYWJiciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdhYmJyJywgJ2FiYnJldmlhdGlvbiddKTtcbiAgICByZXR1cm4gdGhpcy5sYW5nID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2xhbmcnLCAnbGFuZ3VhZ2UnXSk7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdmFyIGVtbWV0LCBleCwgcmVzO1xuICAgIGVtbWV0ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyB3aW5kb3cuZW1tZXQgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5lbW1ldDtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsID8gKHJlZiA9IHdpbmRvdy5zZWxmKSAhPSBudWxsID8gcmVmLmVtbWV0IDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuc2VsZi5lbW1ldDtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsID8gKHJlZjEgPSB3aW5kb3cuZ2xvYmFsKSAhPSBudWxsID8gcmVmMS5lbW1ldCA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93Lmdsb2JhbC5lbW1ldDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlcXVpcmUgIT09IFwidW5kZWZpbmVkXCIgJiYgcmVxdWlyZSAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiByZXF1aXJlKCdlbW1ldCcpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGV4ID0gZXJyb3I7XG4gICAgICAgICAgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5sb2dnZXIubG9nKCdFbW1ldCBpcyBub3QgYXZhaWxhYmxlLCBpdCBtYXkgbmVlZCB0byBiZSBpbnN0YWxsZWQgbWFudWFsbHknKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pLmNhbGwodGhpcyk7XG4gICAgaWYgKGVtbWV0ICE9IG51bGwpIHtcbiAgICAgIC8vIGVtbWV0LnJlcXVpcmUoJy4vcGFyc2VyL2FiYnJldmlhdGlvbicpLmV4cGFuZCgndWw+bGknLCB7cGFzdGVkQ29udGVudDonbG9yZW0nfSlcbiAgICAgIHJlcyA9IGVtbWV0LmV4cGFuZEFiYnJldmlhdGlvbih0aGlzLmFiYnIsIHRoaXMubGFuZyk7XG4gICAgICByZXR1cm4gcmVzLnJlcGxhY2UoL1xcJFxcezBcXH0vZywgJ3wnKTtcbiAgICB9XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgSHRtbENvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAgaHRtbCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdodG1sJykpXG4gIGh0bWwuYWRkQ21kcyh7XG4gICAgJ2ZhbGxiYWNrJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTplbW1ldCcsXG4gICAgICAnZGVmYXVsdHMnIDogeydsYW5nJzonaHRtbCd9LFxuICAgICAgJ25hbWVUb1BhcmFtJyA6ICdhYmJyJ1xuICAgIH0sXG4gIH0pXG4gIFxuICBjc3MgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY3NzJykpXG4gIGNzcy5hZGRDbWRzKHtcbiAgICAnZmFsbGJhY2snOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOmVtbWV0JyxcbiAgICAgICdkZWZhdWx0cycgOiB7J2xhbmcnOidjc3MnfSxcbiAgICAgICduYW1lVG9QYXJhbScgOiAnYWJicidcbiAgICB9LFxuICB9KVxuXG4iLCJpbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIEh0bWxDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBIdG1sQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBjc3MsIGh0bWw7XG4gICAgaHRtbCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdodG1sJykpO1xuICAgIGh0bWwuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICAnZGVmYXVsdHMnOiB7XG4gICAgICAgICAgJ2xhbmcnOiAnaHRtbCdcbiAgICAgICAgfSxcbiAgICAgICAgJ25hbWVUb1BhcmFtJzogJ2FiYnInXG4gICAgICB9XG4gICAgfSk7XG4gICAgY3NzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NzcycpKTtcbiAgICByZXR1cm4gY3NzLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmVtbWV0JyxcbiAgICAgICAgJ2RlZmF1bHRzJzoge1xuICAgICAgICAgICdsYW5nJzogJ2NzcydcbiAgICAgICAgfSxcbiAgICAgICAgJ25hbWVUb1BhcmFtJzogJ2FiYnInXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgSnNDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGpzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2pzJykpXG4gIGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqYXZhc2NyaXB0Jyx7IGFsaWFzT2Y6ICdqcycgfSkpXG4gIGpzLmFkZENtZHMoe1xuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAnaWYnOiAgJ2lmKHwpe1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2xvZyc6ICAnaWYod2luZG93LmNvbnNvbGUpe1xcblxcdGNvbnNvbGUubG9nKH5+Y29udGVudH5+fClcXG59JyxcbiAgICAnZnVuY3Rpb24nOlx0J2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnZnVuY3QnOnsgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJyB9LFxuICAgICdmJzp7ICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nIH0sXG4gICAgJ2Zvcic6IFx0XHQnZm9yICh2YXIgaSA9IDA7IGkgPCB8OyBpKyspIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdmb3Jpbic6J2ZvciAodmFyIHZhbCBpbiB8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnZWFjaCc6eyAgYWxpYXNPZjogJ2pzOmZvcmluJyB9LFxuICAgICdmb3JlYWNoJzp7ICBhbGlhc09mOiAnanM6Zm9yaW4nIH0sXG4gICAgJ3doaWxlJzogICd3aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnd2hpbGVpJzogJ3ZhciBpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG5cXHRpKys7XFxufScsXG4gICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgJ2lmZSc6eyAgIGFsaWFzT2Y6ICdqczppZmVsc2UnIH0sXG4gICAgJ3N3aXRjaCc6XHRcIlwiXCJcbiAgICAgIHN3aXRjaCggfCApIHsgXG4gICAgICBcXHRjYXNlIDpcbiAgICAgIFxcdFxcdH5+Y29udGVudH5+XG4gICAgICBcXHRcXHRicmVhaztcbiAgICAgIFxcdGRlZmF1bHQgOlxuICAgICAgXFx0XFx0XG4gICAgICBcXHRcXHRicmVhaztcbiAgICAgIH1cbiAgICAgIFwiXCJcIixcbiAgfSlcbiIsImltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgSnNDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBKc0NvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIganM7XG4gICAganMgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnanMnKSk7XG4gICAgY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2phdmFzY3JpcHQnLCB7XG4gICAgICBhbGlhc09mOiAnanMnXG4gICAgfSkpO1xuICAgIHJldHVybiBqcy5hZGRDbWRzKHtcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgICdpZic6ICdpZih8KXtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2xvZyc6ICdpZih3aW5kb3cuY29uc29sZSl7XFxuXFx0Y29uc29sZS5sb2cofn5jb250ZW50fn58KVxcbn0nLFxuICAgICAgJ2Z1bmN0aW9uJzogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdmdW5jdCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2Zvcic6ICdmb3IgKHZhciBpID0gMDsgaSA8IHw7IGkrKykge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZm9yaW4nOiAnZm9yICh2YXIgdmFsIGluIHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2VhY2gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmb3JpbidcbiAgICAgIH0sXG4gICAgICAnZm9yZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgICd3aGlsZSc6ICd3aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICd3aGlsZWknOiAndmFyIGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcblxcdGkrKztcXG59JyxcbiAgICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgJ2lmZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmlmZWxzZSdcbiAgICAgIH0sXG4gICAgICAnc3dpdGNoJzogXCJzd2l0Y2goIHwgKSB7IFxcblxcdGNhc2UgOlxcblxcdFxcdH5+Y29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufVwiXG4gICAgfSk7XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgUGFpckRldGVjdG9yIH0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuXG5leHBvcnQgY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpXG4gIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICByZXN1bHQ6ICdwaHA6aW5uZXInLFxuICAgIG9wZW5lcjogJzw/cGhwJyxcbiAgICBjbG9zZXI6ICc/PicsXG4gICAgb3B0aW9ubmFsX2VuZDogdHJ1ZSxcbiAgICAnZWxzZSc6ICdwaHA6b3V0ZXInXG4gIH0pKSBcblxuICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpXG4gIHBocE91dGVyLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnYW55X2NvbnRlbnQnOiB7IFxuICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnIFxuICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBwcmVmaXg6ICcgPz5cXG4nXG4gICAgICAgICAgICBzdWZmaXg6ICdcXG48P3BocCAnXG4gICAgICAgICAgICBhZmZpeGVzX2VtcHR5OiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjolbmFtZSUnLFxuICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgfSxcbiAgICAnYm94JzogeyBcbiAgICAgIGFsaWFzT2Y6ICdjb3JlOmJveCcgXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBwcmVmaXg6ICc8P3BocFxcbidcbiAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICB9XG4gICAgfSxcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgcGhwOiAnPD9waHBcXG5cXHR+fmNvbnRlbnR+fnxcXG4/PicsXG4gIH0pXG4gIFxuICBwaHBJbm5lciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ2lubmVyJykpXG4gIHBocElubmVyLmFkZENtZHMoe1xuICAgICdhbnlfY29udGVudCc6IHsgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcgfSxcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgJ2lmJzogICAnaWYofCl7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ2luZm8nOiAncGhwaW5mbygpOycsXG4gICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAnZSc6eyAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZWNobycgfSxcbiAgICAnY2xhc3MnOntcbiAgICAgIHJlc3VsdCA6IFwiXCJcIlxuICAgICAgICBjbGFzcyB+fnBhcmFtIDAgY2xhc3MgZGVmOnx+fiB7XG4gICAgICAgIFxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xuICAgICAgICBcXHRcXHR+fmNvbnRlbnR+fnxcbiAgICAgICAgXFx0fVxuICAgICAgICB9XG4gICAgICAgIFwiXCJcIixcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdjJzp7ICAgICBhbGlhc09mOiAncGhwOmlubmVyOmNsYXNzJyB9LFxuICAgICdmdW5jdGlvbic6XHR7XG4gICAgICByZXN1bHQgOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAnZnVuY3QnOnsgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbicgfSxcbiAgICAnZic6eyAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbicgfSxcbiAgICAnYXJyYXknOiAgJyR8ID0gYXJyYXkoKTsnLFxuICAgICdhJzpcdCAgICAnYXJyYXkoKScsXG4gICAgJ2Zvcic6IFx0XHQnZm9yICgkaSA9IDA7ICRpIDwgJHw7ICRpKyspIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnZm9yZWFjaCc6J2ZvcmVhY2ggKCR8IGFzICRrZXkgPT4gJHZhbCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICdlYWNoJzp7ICBhbGlhc09mOiAncGhwOmlubmVyOmZvcmVhY2gnIH0sXG4gICAgJ3doaWxlJzogICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ3doaWxlaSc6IHtcbiAgICAgIHJlc3VsdCA6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgJ2lmZSc6eyAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6aWZlbHNlJyB9LFxuICAgICdzd2l0Y2gnOlx0e1xuICAgICAgcmVzdWx0IDogXCJcIlwiXG4gICAgICAgIHN3aXRjaCggfCApIHsgXG4gICAgICAgIFxcdGNhc2UgOlxuICAgICAgICBcXHRcXHR+fmFueV9jb250ZW50fn5cbiAgICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICAgIFxcdGRlZmF1bHQgOlxuICAgICAgICBcXHRcXHRcbiAgICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiLFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICAnY2xvc2UnOiB7IFxuICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnIFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nXG4gICAgICAgIHN1ZmZpeDogJ1xcbj8+J1xuICAgICAgICByZXF1aXJlZF9hZmZpeGVzOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gIH0pXG4gIFxuXG53cmFwV2l0aFBocCA9IChyZXN1bHQsaW5zdGFuY2UpIC0+XG4gIGlubGluZSA9IGluc3RhbmNlLmdldFBhcmFtKFsncGhwX2lubGluZScsJ2lubGluZSddLHRydWUpXG4gIGlmIGlubGluZVxuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nXG4gICAgcmVnQ2xvc2UgPSAvKFtcXG5cXHJcXHNdKylcXHNcXD8+L2dcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nXG4gIGVsc2VcbiAgICAnPD9waHBcXG4nICsgU3RyaW5nSGVscGVyLmluZGVudChyZXN1bHQpICsgJ1xcbj8+J1xuXG4jIGNsb3NlUGhwRm9yQ29udGVudCA9IChpbnN0YW5jZSkgLT5cbiMgICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnIiwidmFyIHdyYXBXaXRoUGhwO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBQYWlyRGV0ZWN0b3Jcbn0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuXG5leHBvcnQgdmFyIFBocENvbW1hbmRQcm92aWRlciA9IGNsYXNzIFBocENvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgcGhwLCBwaHBJbm5lciwgcGhwT3V0ZXI7XG4gICAgcGhwID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ3BocCcpKTtcbiAgICBwaHAuYWRkRGV0ZWN0b3IobmV3IFBhaXJEZXRlY3Rvcih7XG4gICAgICByZXN1bHQ6ICdwaHA6aW5uZXInLFxuICAgICAgb3BlbmVyOiAnPD9waHAnLFxuICAgICAgY2xvc2VyOiAnPz4nLFxuICAgICAgb3B0aW9ubmFsX2VuZDogdHJ1ZSxcbiAgICAgICdlbHNlJzogJ3BocDpvdXRlcidcbiAgICB9KSk7XG4gICAgcGhwT3V0ZXIgPSBwaHAuYWRkQ21kKG5ldyBDb21tYW5kKCdvdXRlcicpKTtcbiAgICBwaHBPdXRlci5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ2FueV9jb250ZW50Jzoge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcsXG4gICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICBwcmVmaXg6ICcgPz5cXG4nLFxuICAgICAgICAgICAgICBzdWZmaXg6ICdcXG48P3BocCAnLFxuICAgICAgICAgICAgICBhZmZpeGVzX2VtcHR5OiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOiVuYW1lJScsXG4gICAgICAgIGFsdGVyUmVzdWx0OiB3cmFwV2l0aFBocFxuICAgICAgfSxcbiAgICAgICdib3gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmJveCcsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nLFxuICAgICAgICAgIHN1ZmZpeDogJ1xcbj8+J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgcGhwOiAnPD9waHBcXG5cXHR+fmNvbnRlbnR+fnxcXG4/PidcbiAgICB9KTtcbiAgICBwaHBJbm5lciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ2lubmVyJykpO1xuICAgIHJldHVybiBwaHBJbm5lci5hZGRDbWRzKHtcbiAgICAgICdhbnlfY29udGVudCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCdcbiAgICAgIH0sXG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICAnaWYnOiAnaWYofCl7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnaW5mbyc6ICdwaHBpbmZvKCk7JyxcbiAgICAgICdlY2hvJzogJ2VjaG8gfCcsXG4gICAgICAnZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjplY2hvJ1xuICAgICAgfSxcbiAgICAgICdjbGFzcyc6IHtcbiAgICAgICAgcmVzdWx0OiBcImNsYXNzIH5+cGFyYW0gMCBjbGFzcyBkZWY6fH5+IHtcXG5cXHRmdW5jdGlvbiBfX2NvbnN0cnVjdCgpIHtcXG5cXHRcXHR+fmNvbnRlbnR+fnxcXG5cXHR9XFxufVwiLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmNsYXNzJ1xuICAgICAgfSxcbiAgICAgICdmdW5jdGlvbic6IHtcbiAgICAgICAgcmVzdWx0OiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdmdW5jdCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZic6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnYXJyYXknOiAnJHwgPSBhcnJheSgpOycsXG4gICAgICAnYSc6ICdhcnJheSgpJyxcbiAgICAgICdmb3InOiAnZm9yICgkaSA9IDA7ICRpIDwgJHw7ICRpKyspIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdmb3JlYWNoJzogJ2ZvcmVhY2ggKCR8IGFzICRrZXkgPT4gJHZhbCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2VhY2gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Zm9yZWFjaCdcbiAgICAgIH0sXG4gICAgICAnd2hpbGUnOiAnd2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ3doaWxlaSc6IHtcbiAgICAgICAgcmVzdWx0OiAnJGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG5cXHQkaSsrO1xcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAgICdpZmUnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6aWZlbHNlJ1xuICAgICAgfSxcbiAgICAgICdzd2l0Y2gnOiB7XG4gICAgICAgIHJlc3VsdDogXCJzd2l0Y2goIHwgKSB7IFxcblxcdGNhc2UgOlxcblxcdFxcdH5+YW55X2NvbnRlbnR+flxcblxcdFxcdGJyZWFrO1xcblxcdGRlZmF1bHQgOlxcblxcdFxcdFxcblxcdFxcdGJyZWFrO1xcbn1cIixcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnY2xvc2UnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNsb3NlJyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nLFxuICAgICAgICAgIHJlcXVpcmVkX2FmZml4ZXM6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuXG53cmFwV2l0aFBocCA9IGZ1bmN0aW9uKHJlc3VsdCwgaW5zdGFuY2UpIHtcbiAgdmFyIGlubGluZSwgcmVnQ2xvc2UsIHJlZ09wZW47XG4gIGlubGluZSA9IGluc3RhbmNlLmdldFBhcmFtKFsncGhwX2lubGluZScsICdpbmxpbmUnXSwgdHJ1ZSk7XG4gIGlmIChpbmxpbmUpIHtcbiAgICByZWdPcGVuID0gLzxcXD9waHBcXHMoW1xcXFxuXFxcXHJcXHNdKykvZztcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZztcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnPD9waHBcXG4nICsgU3RyaW5nSGVscGVyLmluZGVudChyZXN1bHQpICsgJ1xcbj8+JztcbiAgfVxufTtcblxuLy8gY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuLy8gICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnXG4iLCJpbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vYm9vdHN0cmFwJztcbmltcG9ydCB7IFRleHRBcmVhRWRpdG9yIH0gZnJvbSAnLi9UZXh0QXJlYUVkaXRvcic7XG5cbkNvZGV3YXZlLmRldGVjdCA9ICh0YXJnZXQpIC0+XG4gIGN3ID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvcih0YXJnZXQpKVxuICBDb2Rld2F2ZS5pbnN0YW5jZXMucHVzaChjdylcbiAgY3dcblxuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmVcblxud2luZG93LkNvZGV3YXZlID0gQ29kZXdhdmVcblxuICAiLCJpbXBvcnQge1xuICBDb2Rld2F2ZVxufSBmcm9tICcuL2Jvb3RzdHJhcCc7XG5cbmltcG9ydCB7XG4gIFRleHRBcmVhRWRpdG9yXG59IGZyb20gJy4vVGV4dEFyZWFFZGl0b3InO1xuXG5Db2Rld2F2ZS5kZXRlY3QgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgdmFyIGN3O1xuICBjdyA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dEFyZWFFZGl0b3IodGFyZ2V0KSk7XG4gIENvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KTtcbiAgcmV0dXJuIGN3O1xufTtcblxuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmU7XG5cbndpbmRvdy5Db2Rld2F2ZSA9IENvZGV3YXZlO1xuIiwiZXhwb3J0IGNsYXNzIEFycmF5SGVscGVyXG4gIEBpc0FycmF5OiAoYXJyKSAtPlxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIGFyciApID09ICdbb2JqZWN0IEFycmF5XSdcbiAgXG4gIEB1bmlvbjogKGExLGEyKSAtPlxuICAgIEB1bmlxdWUoYTEuY29uY2F0KGEyKSlcbiAgICBcbiAgQHVuaXF1ZTogKGFycmF5KSAtPlxuICAgIGEgPSBhcnJheS5jb25jYXQoKVxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IGEubGVuZ3RoXG4gICAgICBqID0gaSArIDFcbiAgICAgIHdoaWxlIGogPCBhLmxlbmd0aFxuICAgICAgICBpZiBhW2ldID09IGFbal1cbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpXG4gICAgICAgICsralxuICAgICAgKytpXG4gICAgYSIsImV4cG9ydCB2YXIgQXJyYXlIZWxwZXIgPSBjbGFzcyBBcnJheUhlbHBlciB7XG4gIHN0YXRpYyBpc0FycmF5KGFycikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfVxuXG4gIHN0YXRpYyB1bmlvbihhMSwgYTIpIHtcbiAgICByZXR1cm4gdGhpcy51bmlxdWUoYTEuY29uY2F0KGEyKSk7XG4gIH1cblxuICBzdGF0aWMgdW5pcXVlKGFycmF5KSB7XG4gICAgdmFyIGEsIGksIGo7XG4gICAgYSA9IGFycmF5LmNvbmNhdCgpO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgYS5sZW5ndGgpIHtcbiAgICAgIGogPSBpICsgMTtcbiAgICAgIHdoaWxlIChqIDwgYS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGFbaV0gPT09IGFbal0pIHtcbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpO1xuICAgICAgICB9XG4gICAgICAgICsrajtcbiAgICAgIH1cbiAgICAgICsraTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBDb21tb25IZWxwZXJcblxuICBAbWVyZ2U6ICh4cy4uLikgLT5cbiAgICBpZiB4cz8ubGVuZ3RoID4gMFxuICAgICAgQHRhcCB7fSwgKG0pIC0+IG1ba10gPSB2IGZvciBrLCB2IG9mIHggZm9yIHggaW4geHNcbiBcbiAgQHRhcDogKG8sIGZuKSAtPiBcbiAgICBmbihvKVxuICAgIG9cblxuICBAYXBwbHlNaXhpbnM6IChkZXJpdmVkQ3RvciwgYmFzZUN0b3JzKSAtPiBcbiAgICBiYXNlQ3RvcnMuZm9yRWFjaCAoYmFzZUN0b3IpID0+IFxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoIChuYW1lKT0+IFxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKSIsImV4cG9ydCB2YXIgQ29tbW9uSGVscGVyID0gY2xhc3MgQ29tbW9uSGVscGVyIHtcbiAgc3RhdGljIG1lcmdlKC4uLnhzKSB7XG4gICAgaWYgKCh4cyAhPSBudWxsID8geHMubGVuZ3RoIDogdm9pZCAwKSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcCh7fSwgZnVuY3Rpb24obSkge1xuICAgICAgICB2YXIgaSwgaywgbGVuLCByZXN1bHRzLCB2LCB4O1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHhzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgeCA9IHhzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0czE7XG4gICAgICAgICAgICByZXN1bHRzMSA9IFtdO1xuICAgICAgICAgICAgZm9yIChrIGluIHgpIHtcbiAgICAgICAgICAgICAgdiA9IHhba107XG4gICAgICAgICAgICAgIHJlc3VsdHMxLnB1c2gobVtrXSA9IHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMxO1xuICAgICAgICAgIH0pKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRhcChvLCBmbikge1xuICAgIGZuKG8pO1xuICAgIHJldHVybiBvO1xuICB9XG5cbiAgc3RhdGljIGFwcGx5TWl4aW5zKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIHtcbiAgICByZXR1cm4gYmFzZUN0b3JzLmZvckVhY2goKGJhc2VDdG9yKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVyaXZlZEN0b3IsIG5hbWUsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZUN0b3IucHJvdG90eXBlLCBuYW1lKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgTmFtZXNwYWNlSGVscGVyXG5cbiAgQHNwbGl0Rmlyc3Q6IChmdWxsbmFtZSxpc1NwYWNlID0gZmFsc2UpIC0+XG4gICAgaWYgZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT0gLTEgYW5kICFpc1NwYWNlXG4gICAgICByZXR1cm4gW251bGwsZnVsbG5hbWVdXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLHBhcnRzLmpvaW4oJzonKSB8fCBudWxsXVxuXG4gIEBzcGxpdDogKGZ1bGxuYW1lKSAtPlxuICAgIGlmIGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09IC0xXG4gICAgICByZXR1cm4gW251bGwsZnVsbG5hbWVdXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgbmFtZSA9IHBhcnRzLnBvcCgpXG4gICAgW3BhcnRzLmpvaW4oJzonKSxuYW1lXSIsImV4cG9ydCB2YXIgTmFtZXNwYWNlSGVscGVyID0gY2xhc3MgTmFtZXNwYWNlSGVscGVyIHtcbiAgc3RhdGljIHNwbGl0Rmlyc3QoZnVsbG5hbWUsIGlzU3BhY2UgPSBmYWxzZSkge1xuICAgIHZhciBwYXJ0cztcbiAgICBpZiAoZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT09IC0xICYmICFpc1NwYWNlKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXTtcbiAgICB9XG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpO1xuICAgIHJldHVybiBbcGFydHMuc2hpZnQoKSwgcGFydHMuam9pbignOicpIHx8IG51bGxdO1xuICB9XG5cbiAgc3RhdGljIHNwbGl0KGZ1bGxuYW1lKSB7XG4gICAgdmFyIG5hbWUsIHBhcnRzO1xuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdO1xuICAgIH1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6Jyk7XG4gICAgbmFtZSA9IHBhcnRzLnBvcCgpO1xuICAgIHJldHVybiBbcGFydHMuam9pbignOicpLCBuYW1lXTtcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgT3B0aW9uYWxQcm9taXNlXG4gICAgY29uc3RydWN0b3I6IChAdmFsKSAtPlxuICAgICAgICBpZiBAdmFsPyBhbmQgQHZhbC50aGVuPyBhbmQgQHZhbC5yZXN1bHQ/XG4gICAgICAgICAgICBAdmFsID0gQHZhbC5yZXN1bHQoKVxuICAgIHRoZW46IChjYikgLT5cbiAgICAgICAgaWYgQHZhbD8gYW5kIEB2YWwudGhlbj9cbiAgICAgICAgICAgIG5ldyBPcHRpb25hbFByb21pc2UoQHZhbC50aGVuKGNiKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV3IE9wdGlvbmFsUHJvbWlzZShjYihAdmFsKSlcbiAgICByZXN1bHQ6IC0+XG4gICAgICAgIEB2YWxcblxuZXhwb3J0IG9wdGlvbmFsUHJvbWlzZSA9ICh2YWwpLT4gXG4gICAgbmV3IE9wdGlvbmFsUHJvbWlzZSh2YWwpXG5cblxuIiwiZXhwb3J0IHZhciBPcHRpb25hbFByb21pc2UgPSBjbGFzcyBPcHRpb25hbFByb21pc2Uge1xuICBjb25zdHJ1Y3Rvcih2YWwxKSB7XG4gICAgdGhpcy52YWwgPSB2YWwxO1xuICAgIGlmICgodGhpcy52YWwgIT0gbnVsbCkgJiYgKHRoaXMudmFsLnRoZW4gIT0gbnVsbCkgJiYgKHRoaXMudmFsLnJlc3VsdCAhPSBudWxsKSkge1xuICAgICAgdGhpcy52YWwgPSB0aGlzLnZhbC5yZXN1bHQoKTtcbiAgICB9XG4gIH1cblxuICB0aGVuKGNiKSB7XG4gICAgaWYgKCh0aGlzLnZhbCAhPSBudWxsKSAmJiAodGhpcy52YWwudGhlbiAhPSBudWxsKSkge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodGhpcy52YWwudGhlbihjYikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZShjYih0aGlzLnZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICByZXR1cm4gdGhpcy52YWw7XG4gIH1cblxufTtcblxuZXhwb3J0IHZhciBvcHRpb25hbFByb21pc2UgPSBmdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodmFsKTtcbn07XG4iLCJpbXBvcnQgeyBTaXplIH0gZnJvbSAnLi4vcG9zaXRpb25pbmcvU2l6ZSc7XG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdIZWxwZXJcbiAgQHRyaW1FbXB0eUxpbmU6ICh0eHQpIC0+XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKC9eXFxzKlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyP1xcblxccyokLywgJycpXG5cbiAgQGVzY2FwZVJlZ0V4cDogKHN0cikgLT5cbiAgICBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpXG5cbiAgQHJlcGVhdFRvTGVuZ3RoOiAodHh0LCBsZW5ndGgpIC0+XG4gICAgcmV0dXJuICcnIGlmIGxlbmd0aCA8PSAwXG4gICAgQXJyYXkoTWF0aC5jZWlsKGxlbmd0aC90eHQubGVuZ3RoKSsxKS5qb2luKHR4dCkuc3Vic3RyaW5nKDAsbGVuZ3RoKVxuICAgIFxuICBAcmVwZWF0OiAodHh0LCBuYikgLT5cbiAgICBBcnJheShuYisxKS5qb2luKHR4dClcbiAgICBcbiAgQGdldFR4dFNpemU6ICh0eHQpIC0+XG4gICAgbGluZXMgPSB0eHQucmVwbGFjZSgvXFxyL2csJycpLnNwbGl0KFwiXFxuXCIpXG4gICAgdyA9IDBcbiAgICBmb3IgbCBpbiBsaW5lc1xuICAgICAgdyA9IE1hdGgubWF4KHcsbC5sZW5ndGgpXG4gICAgcmV0dXJuIG5ldyBTaXplKHcsbGluZXMubGVuZ3RoLTEpXG5cbiAgQGluZGVudE5vdEZpcnN0OiAodGV4dCxuYj0xLHNwYWNlcz0nICAnKSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZWcgPSAvXFxuL2dcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCBcIlxcblwiICsgQHJlcGVhdChzcGFjZXMsIG5iKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICAgICAgXG4gIEBpbmRlbnQ6ICh0ZXh0LG5iPTEsc3BhY2VzPScgICcpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJldHVybiBzcGFjZXMgKyBAaW5kZW50Tm90Rmlyc3QodGV4dCxuYixzcGFjZXMpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgXG4gIEByZXZlcnNlU3RyOiAodHh0KSAtPlxuICAgIHJldHVybiB0eHQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIilcbiAgXG4gIFxuICBAcmVtb3ZlQ2FycmV0OiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHRtcCA9ICdbW1tbcXVvdGVkX2NhcnJldF1dXV0nXG4gICAgcmVDYXJyZXQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIrY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHJlVG1wID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKHRtcCksIFwiZ1wiKVxuICAgIHR4dC5yZXBsYWNlKHJlUXVvdGVkLHRtcCkucmVwbGFjZShyZUNhcnJldCwnJykucmVwbGFjZShyZVRtcCwgY2FycmV0Q2hhcilcbiAgICBcbiAgQGdldEFuZFJlbW92ZUZpcnN0Q2FycmV0OiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHBvcyA9IEBnZXRDYXJyZXRQb3ModHh0LGNhcnJldENoYXIpXG4gICAgaWYgcG9zP1xuICAgICAgdHh0ID0gdHh0LnN1YnN0cigwLHBvcykgKyB0eHQuc3Vic3RyKHBvcytjYXJyZXRDaGFyLmxlbmd0aClcbiAgICAgIHJldHVybiBbcG9zLHR4dF1cbiAgICAgIFxuICBAZ2V0Q2FycmV0UG9zOiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIrY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHR4dCA9IHR4dC5yZXBsYWNlKHJlUXVvdGVkLCAnICcpXG4gICAgaWYgKGkgPSB0eHQuaW5kZXhPZihjYXJyZXRDaGFyKSkgPiAtMVxuICAgICAgcmV0dXJuIGkiLCJpbXBvcnQge1xuICBTaXplXG59IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1NpemUnO1xuXG5leHBvcnQgdmFyIFN0cmluZ0hlbHBlciA9IGNsYXNzIFN0cmluZ0hlbHBlciB7XG4gIHN0YXRpYyB0cmltRW1wdHlMaW5lKHR4dCkge1xuICAgIHJldHVybiB0eHQucmVwbGFjZSgvXlxccypcXHI/XFxuLywgJycpLnJlcGxhY2UoL1xccj9cXG5cXHMqJC8sICcnKTtcbiAgfVxuXG4gIHN0YXRpYyBlc2NhcGVSZWdFeHAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gIH1cblxuICBzdGF0aWMgcmVwZWF0VG9MZW5ndGgodHh0LCBsZW5ndGgpIHtcbiAgICBpZiAobGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5KE1hdGguY2VpbChsZW5ndGggLyB0eHQubGVuZ3RoKSArIDEpLmpvaW4odHh0KS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXQodHh0LCBuYikge1xuICAgIHJldHVybiBBcnJheShuYiArIDEpLmpvaW4odHh0KTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRUeHRTaXplKHR4dCkge1xuICAgIHZhciBqLCBsLCBsZW4sIGxpbmVzLCB3O1xuICAgIGxpbmVzID0gdHh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIik7XG4gICAgdyA9IDA7XG4gICAgZm9yIChqID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIGwgPSBsaW5lc1tqXTtcbiAgICAgIHcgPSBNYXRoLm1heCh3LCBsLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgU2l6ZSh3LCBsaW5lcy5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnROb3RGaXJzdCh0ZXh0LCBuYiA9IDEsIHNwYWNlcyA9ICcgICcpIHtcbiAgICB2YXIgcmVnO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IC9cXG4vZztcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCBcIlxcblwiICsgdGhpcy5yZXBlYXQoc3BhY2VzLCBuYikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaW5kZW50KHRleHQsIG5iID0gMSwgc3BhY2VzID0gJyAgJykge1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBzcGFjZXMgKyB0aGlzLmluZGVudE5vdEZpcnN0KHRleHQsIG5iLCBzcGFjZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcmV2ZXJzZVN0cih0eHQpIHtcbiAgICByZXR1cm4gdHh0LnNwbGl0KFwiXCIpLnJldmVyc2UoKS5qb2luKFwiXCIpO1xuICB9XG5cbiAgc3RhdGljIHJlbW92ZUNhcnJldCh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcmVDYXJyZXQsIHJlUXVvdGVkLCByZVRtcCwgdG1wO1xuICAgIHRtcCA9ICdbW1tbcXVvdGVkX2NhcnJldF1dXV0nO1xuICAgIHJlQ2FycmV0ID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICByZVRtcCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAodG1wKSwgXCJnXCIpO1xuICAgIHJldHVybiB0eHQucmVwbGFjZShyZVF1b3RlZCwgdG1wKS5yZXBsYWNlKHJlQ2FycmV0LCAnJykucmVwbGFjZShyZVRtcCwgY2FycmV0Q2hhcik7XG4gIH1cblxuICBzdGF0aWMgZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIHBvcztcbiAgICBwb3MgPSB0aGlzLmdldENhcnJldFBvcyh0eHQsIGNhcnJldENoYXIpO1xuICAgIGlmIChwb3MgIT0gbnVsbCkge1xuICAgICAgdHh0ID0gdHh0LnN1YnN0cigwLCBwb3MpICsgdHh0LnN1YnN0cihwb3MgKyBjYXJyZXRDaGFyLmxlbmd0aCk7XG4gICAgICByZXR1cm4gW3BvcywgdHh0XTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0Q2FycmV0UG9zKHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciBpLCByZVF1b3RlZDtcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciArIGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgdHh0ID0gdHh0LnJlcGxhY2UocmVRdW90ZWQsICcgJyk7XG4gICAgaWYgKChpID0gdHh0LmluZGV4T2YoY2FycmV0Q2hhcikpID4gLTEpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL1Bvcyc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBQYWlyTWF0Y2ggfSBmcm9tICcuL1BhaXJNYXRjaCc7XG5cbmV4cG9ydCBjbGFzcyBQYWlyXG4gIGNvbnN0cnVjdG9yOiAoQG9wZW5lcixAY2xvc2VyLEBvcHRpb25zID0ge30pIC0+XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBvcHRpb25uYWxfZW5kOiBmYWxzZVxuICAgICAgdmFsaWRNYXRjaDogbnVsbFxuICAgIH1cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBAb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBAb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICBvcGVuZXJSZWc6IC0+XG4gICAgaWYgdHlwZW9mIEBvcGVuZXIgPT0gJ3N0cmluZycgXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBvcGVuZXIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAb3BlbmVyXG4gIGNsb3NlclJlZzogLT5cbiAgICBpZiB0eXBlb2YgQGNsb3NlciA9PSAnc3RyaW5nJyBcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNsb3NlcikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBjbG9zZXJcbiAgbWF0Y2hBbnlQYXJ0czogLT5cbiAgICByZXR1cm4ge1xuICAgICAgb3BlbmVyOiBAb3BlbmVyUmVnKClcbiAgICAgIGNsb3NlcjogQGNsb3NlclJlZygpXG4gICAgfVxuICBtYXRjaEFueVBhcnRLZXlzOiAtPlxuICAgIGtleXMgPSBbXVxuICAgIGZvciBrZXksIHJlZyBvZiBAbWF0Y2hBbnlQYXJ0cygpXG4gICAgICBrZXlzLnB1c2goa2V5KVxuICAgIHJldHVybiBrZXlzXG4gIG1hdGNoQW55UmVnOiAtPlxuICAgIGdyb3VwcyA9IFtdXG4gICAgZm9yIGtleSwgcmVnIG9mIEBtYXRjaEFueVBhcnRzKClcbiAgICAgIGdyb3Vwcy5wdXNoKCcoJytyZWcuc291cmNlKycpJylcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChncm91cHMuam9pbignfCcpKVxuICBtYXRjaEFueTogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgd2hpbGUgKG1hdGNoID0gQF9tYXRjaEFueSh0ZXh0LG9mZnNldCkpPyBhbmQgIW1hdGNoLnZhbGlkKClcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpXG4gICAgcmV0dXJuIG1hdGNoIGlmIG1hdGNoPyBhbmQgbWF0Y2gudmFsaWQoKVxuICBfbWF0Y2hBbnk6ICh0ZXh0LG9mZnNldD0wKSAtPlxuICAgIGlmIG9mZnNldFxuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKG9mZnNldClcbiAgICBtYXRjaCA9IEBtYXRjaEFueVJlZygpLmV4ZWModGV4dClcbiAgICBpZiBtYXRjaD9cbiAgICAgIHJldHVybiBuZXcgUGFpck1hdGNoKHRoaXMsbWF0Y2gsb2Zmc2V0KVxuICBtYXRjaEFueU5hbWVkOiAodGV4dCkgLT5cbiAgICByZXR1cm4gQF9tYXRjaEFueUdldE5hbWUoQG1hdGNoQW55KHRleHQpKVxuICBtYXRjaEFueUxhc3Q6ICh0ZXh0LG9mZnNldD0wKSAtPlxuICAgIHdoaWxlIG1hdGNoID0gQG1hdGNoQW55KHRleHQsb2Zmc2V0KVxuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKClcbiAgICAgIGlmICFyZXMgb3IgcmVzLmVuZCgpICE9IG1hdGNoLmVuZCgpXG4gICAgICAgIHJlcyA9IG1hdGNoXG4gICAgcmV0dXJuIHJlc1xuICBpZGVudGljYWw6IC0+XG4gICAgQG9wZW5lciA9PSBAY2xvc2VyIG9yIChcbiAgICAgIEBvcGVuZXIuc291cmNlPyBhbmQgXG4gICAgICBAY2xvc2VyLnNvdXJjZT8gYW5kIFxuICAgICAgQG9wZW5lci5zb3VyY2UgPT0gQGNsb3Nlci5zb3VyY2VcbiAgICApXG4gIHdyYXBwZXJQb3M6IChwb3MsdGV4dCkgLT5cbiAgICBzdGFydCA9IEBtYXRjaEFueUxhc3QodGV4dC5zdWJzdHIoMCxwb3Muc3RhcnQpKVxuICAgIGlmIHN0YXJ0PyBhbmQgKEBpZGVudGljYWwoKSBvciBzdGFydC5uYW1lKCkgPT0gJ29wZW5lcicpXG4gICAgICBlbmQgPSBAbWF0Y2hBbnkodGV4dCxwb3MuZW5kKVxuICAgICAgaWYgZW5kPyBhbmQgKEBpZGVudGljYWwoKSBvciBlbmQubmFtZSgpID09ICdjbG9zZXInKVxuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLGVuZC5lbmQoKSlcbiAgICAgIGVsc2UgaWYgQG9wdGlvbm5hbF9lbmRcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSx0ZXh0Lmxlbmd0aClcbiAgaXNXYXBwZXJPZjogKHBvcyx0ZXh0KSAtPlxuICAgIHJldHVybiBAd3JhcHBlclBvcyhwb3MsdGV4dCk/IiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vUG9zJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgUGFpck1hdGNoXG59IGZyb20gJy4vUGFpck1hdGNoJztcblxuZXhwb3J0IHZhciBQYWlyID0gY2xhc3MgUGFpciB7XG4gIGNvbnN0cnVjdG9yKG9wZW5lciwgY2xvc2VyLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsO1xuICAgIHRoaXMub3BlbmVyID0gb3BlbmVyO1xuICAgIHRoaXMuY2xvc2VyID0gY2xvc2VyO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBvcHRpb25uYWxfZW5kOiBmYWxzZSxcbiAgICAgIHZhbGlkTWF0Y2g6IG51bGxcbiAgICB9O1xuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgaWYgKGtleSBpbiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5vcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3BlbmVyUmVnKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vcGVuZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMub3BlbmVyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm9wZW5lcjtcbiAgICB9XG4gIH1cblxuICBjbG9zZXJSZWcoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmNsb3NlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jbG9zZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2VyO1xuICAgIH1cbiAgfVxuXG4gIG1hdGNoQW55UGFydHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW5lcjogdGhpcy5vcGVuZXJSZWcoKSxcbiAgICAgIGNsb3NlcjogdGhpcy5jbG9zZXJSZWcoKVxuICAgIH07XG4gIH1cblxuICBtYXRjaEFueVBhcnRLZXlzKCkge1xuICAgIHZhciBrZXksIGtleXMsIHJlZiwgcmVnO1xuICAgIGtleXMgPSBbXTtcbiAgICByZWYgPSB0aGlzLm1hdGNoQW55UGFydHMoKTtcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHJlZyA9IHJlZltrZXldO1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xuICB9XG5cbiAgbWF0Y2hBbnlSZWcoKSB7XG4gICAgdmFyIGdyb3Vwcywga2V5LCByZWYsIHJlZztcbiAgICBncm91cHMgPSBbXTtcbiAgICByZWYgPSB0aGlzLm1hdGNoQW55UGFydHMoKTtcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHJlZyA9IHJlZltrZXldO1xuICAgICAgZ3JvdXBzLnB1c2goJygnICsgcmVnLnNvdXJjZSArICcpJyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUmVnRXhwKGdyb3Vwcy5qb2luKCd8JykpO1xuICB9XG5cbiAgbWF0Y2hBbnkodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaDtcbiAgICB3aGlsZSAoKChtYXRjaCA9IHRoaXMuX21hdGNoQW55KHRleHQsIG9mZnNldCkpICE9IG51bGwpICYmICFtYXRjaC52YWxpZCgpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCAhPSBudWxsKSAmJiBtYXRjaC52YWxpZCgpKSB7XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfVxuICB9XG5cbiAgX21hdGNoQW55KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2g7XG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKG9mZnNldCk7XG4gICAgfVxuICAgIG1hdGNoID0gdGhpcy5tYXRjaEFueVJlZygpLmV4ZWModGV4dCk7XG4gICAgaWYgKG1hdGNoICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgUGFpck1hdGNoKHRoaXMsIG1hdGNoLCBvZmZzZXQpO1xuICAgIH1cbiAgfVxuXG4gIG1hdGNoQW55TmFtZWQodGV4dCkge1xuICAgIHJldHVybiB0aGlzLl9tYXRjaEFueUdldE5hbWUodGhpcy5tYXRjaEFueSh0ZXh0KSk7XG4gIH1cblxuICBtYXRjaEFueUxhc3QodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaCwgcmVzO1xuICAgIHdoaWxlIChtYXRjaCA9IHRoaXMubWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKCk7XG4gICAgICBpZiAoIXJlcyB8fCByZXMuZW5kKCkgIT09IG1hdGNoLmVuZCgpKSB7XG4gICAgICAgIHJlcyA9IG1hdGNoO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgaWRlbnRpY2FsKCkge1xuICAgIHJldHVybiB0aGlzLm9wZW5lciA9PT0gdGhpcy5jbG9zZXIgfHwgKCh0aGlzLm9wZW5lci5zb3VyY2UgIT0gbnVsbCkgJiYgKHRoaXMuY2xvc2VyLnNvdXJjZSAhPSBudWxsKSAmJiB0aGlzLm9wZW5lci5zb3VyY2UgPT09IHRoaXMuY2xvc2VyLnNvdXJjZSk7XG4gIH1cblxuICB3cmFwcGVyUG9zKHBvcywgdGV4dCkge1xuICAgIHZhciBlbmQsIHN0YXJ0O1xuICAgIHN0YXJ0ID0gdGhpcy5tYXRjaEFueUxhc3QodGV4dC5zdWJzdHIoMCwgcG9zLnN0YXJ0KSk7XG4gICAgaWYgKChzdGFydCAhPSBudWxsKSAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBzdGFydC5uYW1lKCkgPT09ICdvcGVuZXInKSkge1xuICAgICAgZW5kID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBwb3MuZW5kKTtcbiAgICAgIGlmICgoZW5kICE9IG51bGwpICYmICh0aGlzLmlkZW50aWNhbCgpIHx8IGVuZC5uYW1lKCkgPT09ICdjbG9zZXInKSkge1xuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLCBlbmQuZW5kKCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbm5hbF9lbmQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgdGV4dC5sZW5ndGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzV2FwcGVyT2YocG9zLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlclBvcyhwb3MsIHRleHQpICE9IG51bGw7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBQYWlyTWF0Y2hcbiAgY29uc3RydWN0b3I6IChAcGFpcixAbWF0Y2gsQG9mZnNldCA9IDApIC0+XG4gIG5hbWU6IC0+XG4gICAgaWYgQG1hdGNoXG4gICAgICB1bmxlc3MgX25hbWU/XG4gICAgICAgIGZvciBncm91cCwgaSBpbiBAbWF0Y2hcbiAgICAgICAgICBpZiBpID4gMCBhbmQgZ3JvdXA/XG4gICAgICAgICAgICBfbmFtZSA9IEBwYWlyLm1hdGNoQW55UGFydEtleXMoKVtpLTFdXG4gICAgICAgICAgICByZXR1cm4gX25hbWVcbiAgICAgICAgX25hbWUgPSBmYWxzZVxuICAgICAgcmV0dXJuIF9uYW1lIHx8IG51bGxcbiAgc3RhcnQ6IC0+XG4gICAgQG1hdGNoLmluZGV4ICsgQG9mZnNldFxuICBlbmQ6IC0+XG4gICAgQG1hdGNoLmluZGV4ICsgQG1hdGNoWzBdLmxlbmd0aCArIEBvZmZzZXRcbiAgdmFsaWQ6IC0+XG4gICAgcmV0dXJuICFAcGFpci52YWxpZE1hdGNoIHx8IEBwYWlyLnZhbGlkTWF0Y2godGhpcylcbiAgbGVuZ3RoOiAtPlxuICAgIEBtYXRjaFswXS5sZW5ndGgiLCJleHBvcnQgdmFyIFBhaXJNYXRjaCA9IGNsYXNzIFBhaXJNYXRjaCB7XG4gIGNvbnN0cnVjdG9yKHBhaXIsIG1hdGNoLCBvZmZzZXQgPSAwKSB7XG4gICAgdGhpcy5wYWlyID0gcGFpcjtcbiAgICB0aGlzLm1hdGNoID0gbWF0Y2g7XG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gIH1cblxuICBuYW1lKCkge1xuICAgIHZhciBfbmFtZSwgZ3JvdXAsIGksIGosIGxlbiwgcmVmO1xuICAgIGlmICh0aGlzLm1hdGNoKSB7XG4gICAgICBpZiAodHlwZW9mIF9uYW1lID09PSBcInVuZGVmaW5lZFwiIHx8IF9uYW1lID09PSBudWxsKSB7XG4gICAgICAgIHJlZiA9IHRoaXMubWF0Y2g7XG4gICAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgICAgZ3JvdXAgPSByZWZbaV07XG4gICAgICAgICAgaWYgKGkgPiAwICYmIChncm91cCAhPSBudWxsKSkge1xuICAgICAgICAgICAgX25hbWUgPSB0aGlzLnBhaXIubWF0Y2hBbnlQYXJ0S2V5cygpW2kgLSAxXTtcbiAgICAgICAgICAgIHJldHVybiBfbmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX25hbWUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfbmFtZSB8fCBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoLmluZGV4ICsgdGhpcy5vZmZzZXQ7XG4gIH1cblxuICBlbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm1hdGNoWzBdLmxlbmd0aCArIHRoaXMub2Zmc2V0O1xuICB9XG5cbiAgdmFsaWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLnBhaXIudmFsaWRNYXRjaCB8fCB0aGlzLnBhaXIudmFsaWRNYXRjaCh0aGlzKTtcbiAgfVxuXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaFswXS5sZW5ndGg7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBQb3NcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsQGVuZCkgLT5cbiAgICBAZW5kID0gQHN0YXJ0IHVubGVzcyBAZW5kP1xuICBjb250YWluc1B0OiAocHQpIC0+XG4gICAgcmV0dXJuIEBzdGFydCA8PSBwdCBhbmQgcHQgPD0gQGVuZFxuICBjb250YWluc1BvczogKHBvcykgLT5cbiAgICByZXR1cm4gQHN0YXJ0IDw9IHBvcy5zdGFydCBhbmQgcG9zLmVuZCA8PSBAZW5kXG4gIHdyYXBwZWRCeTogKHByZWZpeCxzdWZmaXgpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3Mud3JhcENsYXNzKEBzdGFydC1wcmVmaXgubGVuZ3RoLEBzdGFydCxAZW5kLEBlbmQrc3VmZml4Lmxlbmd0aClcbiAgd2l0aEVkaXRvcjogKHZhbCktPlxuICAgIEBfZWRpdG9yID0gdmFsXG4gICAgcmV0dXJuIHRoaXNcbiAgZWRpdG9yOiAtPlxuICAgIHVubGVzcyBAX2VkaXRvcj9cbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZWRpdG9yIHNldCcpXG4gICAgcmV0dXJuIEBfZWRpdG9yXG4gIGhhc0VkaXRvcjogLT5cbiAgICByZXR1cm4gQF9lZGl0b3I/XG4gIHRleHQ6IC0+XG4gICAgQGVkaXRvcigpLnRleHRTdWJzdHIoQHN0YXJ0LCBAZW5kKVxuICBhcHBseU9mZnNldDogKG9mZnNldCktPlxuICAgIGlmIG9mZnNldCAhPSAwXG4gICAgICBAc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBAZW5kICs9IG9mZnNldFxuICAgIHJldHVybiB0aGlzXG4gIHByZXZFT0w6IC0+XG4gICAgdW5sZXNzIEBfcHJldkVPTD9cbiAgICAgIEBfcHJldkVPTCA9IEBlZGl0b3IoKS5maW5kTGluZVN0YXJ0KEBzdGFydClcbiAgICByZXR1cm4gQF9wcmV2RU9MXG4gIG5leHRFT0w6IC0+XG4gICAgdW5sZXNzIEBfbmV4dEVPTD9cbiAgICAgIEBfbmV4dEVPTCA9IEBlZGl0b3IoKS5maW5kTGluZUVuZChAZW5kKVxuICAgIHJldHVybiBAX25leHRFT0xcbiAgdGV4dFdpdGhGdWxsTGluZXM6IC0+XG4gICAgdW5sZXNzIEBfdGV4dFdpdGhGdWxsTGluZXM/XG4gICAgICBAX3RleHRXaXRoRnVsbExpbmVzID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQHByZXZFT0woKSxAbmV4dEVPTCgpKVxuICAgIHJldHVybiBAX3RleHRXaXRoRnVsbExpbmVzXG4gIHNhbWVMaW5lc1ByZWZpeDogLT5cbiAgICB1bmxlc3MgQF9zYW1lTGluZXNQcmVmaXg/XG4gICAgICBAX3NhbWVMaW5lc1ByZWZpeCA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBwcmV2RU9MKCksQHN0YXJ0KVxuICAgIHJldHVybiBAX3NhbWVMaW5lc1ByZWZpeFxuICBzYW1lTGluZXNTdWZmaXg6IC0+XG4gICAgdW5sZXNzIEBfc2FtZUxpbmVzU3VmZml4P1xuICAgICAgQF9zYW1lTGluZXNTdWZmaXggPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAZW5kLEBuZXh0RU9MKCkpXG4gICAgcmV0dXJuIEBfc2FtZUxpbmVzU3VmZml4XG4gIGNvcHk6IC0+XG4gICAgcmVzID0gbmV3IFBvcyhAc3RhcnQsQGVuZClcbiAgICBpZiBAaGFzRWRpdG9yKClcbiAgICAgIHJlcy53aXRoRWRpdG9yKEBlZGl0b3IoKSlcbiAgICByZXR1cm4gcmVzXG4gIHJhdzogLT5cbiAgICBbQHN0YXJ0LEBlbmRdIiwiZXhwb3J0IHZhciBQb3MgPSBjbGFzcyBQb3Mge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgZW5kKSB7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICAgIGlmICh0aGlzLmVuZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmVuZCA9IHRoaXMuc3RhcnQ7XG4gICAgfVxuICB9XG5cbiAgY29udGFpbnNQdChwdCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0IDw9IHB0ICYmIHB0IDw9IHRoaXMuZW5kO1xuICB9XG5cbiAgY29udGFpbnNQb3MocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgPD0gcG9zLnN0YXJ0ICYmIHBvcy5lbmQgPD0gdGhpcy5lbmQ7XG4gIH1cblxuICB3cmFwcGVkQnkocHJlZml4LCBzdWZmaXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcy53cmFwQ2xhc3ModGhpcy5zdGFydCAtIHByZWZpeC5sZW5ndGgsIHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLmVuZCArIHN1ZmZpeC5sZW5ndGgpO1xuICB9XG5cbiAgd2l0aEVkaXRvcih2YWwpIHtcbiAgICB0aGlzLl9lZGl0b3IgPSB2YWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBlZGl0b3IoKSB7XG4gICAgaWYgKHRoaXMuX2VkaXRvciA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVkaXRvciBzZXQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvcjtcbiAgfVxuXG4gIGhhc0VkaXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yICE9IG51bGw7XG4gIH1cblxuICB0ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICB9XG5cbiAgYXBwbHlPZmZzZXQob2Zmc2V0KSB7XG4gICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgdGhpcy5zdGFydCArPSBvZmZzZXQ7XG4gICAgICB0aGlzLmVuZCArPSBvZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJldkVPTCgpIHtcbiAgICBpZiAodGhpcy5fcHJldkVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9wcmV2RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZVN0YXJ0KHRoaXMuc3RhcnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcHJldkVPTDtcbiAgfVxuXG4gIG5leHRFT0woKSB7XG4gICAgaWYgKHRoaXMuX25leHRFT0wgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fbmV4dEVPTCA9IHRoaXMuZWRpdG9yKCkuZmluZExpbmVFbmQodGhpcy5lbmQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbmV4dEVPTDtcbiAgfVxuXG4gIHRleHRXaXRoRnVsbExpbmVzKCkge1xuICAgIGlmICh0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcyA9PSBudWxsKSB7XG4gICAgICB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcyA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5uZXh0RU9MKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdGV4dFdpdGhGdWxsTGluZXM7XG4gIH1cblxuICBzYW1lTGluZXNQcmVmaXgoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNQcmVmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMuc3RhcnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzUHJlZml4O1xuICB9XG5cbiAgc2FtZUxpbmVzU3VmZml4KCkge1xuICAgIGlmICh0aGlzLl9zYW1lTGluZXNTdWZmaXggPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2FtZUxpbmVzU3VmZml4ID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuZW5kLCB0aGlzLm5leHRFT0woKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNTdWZmaXg7XG4gIH1cblxuICBjb3B5KCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gbmV3IFBvcyh0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgcmF3KCkge1xuICAgIHJldHVybiBbdGhpcy5zdGFydCwgdGhpcy5lbmRdO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBXcmFwcGluZyB9IGZyb20gJy4vV3JhcHBpbmcnO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL1JlcGxhY2VtZW50JztcbmltcG9ydCB7IENvbW1vbkhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcblxuZXhwb3J0IGNsYXNzIFBvc0NvbGxlY3Rpb25cbiAgY29uc3RydWN0b3I6IChhcnIpIC0+XG4gICAgaWYgIUFycmF5LmlzQXJyYXkoYXJyKVxuICAgICAgYXJyID0gW2Fycl1cbiAgICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoYXJyLFtQb3NDb2xsZWN0aW9uXSlcbiAgICByZXR1cm4gYXJyXG4gICAgXG4gIHdyYXA6IChwcmVmaXgsc3VmZml4KS0+XG4gICAgICByZXR1cm4gQG1hcCggKHApIC0+IG5ldyBXcmFwcGluZyhwLnN0YXJ0LCBwLmVuZCwgcHJlZml4LCBzdWZmaXgpKVxuICByZXBsYWNlOiAodHh0KS0+XG4gICAgICByZXR1cm4gQG1hcCggKHApIC0+IG5ldyBSZXBsYWNlbWVudChwLnN0YXJ0LCBwLmVuZCwgdHh0KSkiLCJpbXBvcnQge1xuICBXcmFwcGluZ1xufSBmcm9tICcuL1dyYXBwaW5nJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5cbmltcG9ydCB7XG4gIENvbW1vbkhlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5cbmV4cG9ydCB2YXIgUG9zQ29sbGVjdGlvbiA9IGNsYXNzIFBvc0NvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihhcnIpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgYXJyID0gW2Fycl07XG4gICAgfVxuICAgIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhhcnIsIFtQb3NDb2xsZWN0aW9uXSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIHdyYXAocHJlZml4LCBzdWZmaXgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIG5ldyBXcmFwcGluZyhwLnN0YXJ0LCBwLmVuZCwgcHJlZml4LCBzdWZmaXgpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVwbGFjZSh0eHQpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIG5ldyBSZXBsYWNlbWVudChwLnN0YXJ0LCBwLmVuZCwgdHh0KTtcbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuaW1wb3J0IHsgQ29tbW9uSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuaW1wb3J0IHsgT3B0aW9uT2JqZWN0IH0gZnJvbSAnLi4vT3B0aW9uT2JqZWN0JztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuZXhwb3J0IGNsYXNzIFJlcGxhY2VtZW50IGV4dGVuZHMgUG9zXG4gIENvbW1vbkhlbHBlci5hcHBseU1peGlucyh0aGlzLnByb3RvdHlwZSxbT3B0aW9uT2JqZWN0XSlcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsIEBlbmQsIEB0ZXh0LCBAb3B0aW9ucyA9IHt9KSAtPlxuICAgIHN1cGVyKClcbiAgICBAc2V0T3B0cyhAb3B0aW9ucyx7XG4gICAgICBwcmVmaXg6ICcnXG4gICAgICBzdWZmaXg6ICcnXG4gICAgICBzZWxlY3Rpb25zOiBbXVxuICAgIH0pXG4gIHJlc1Bvc0JlZm9yZVByZWZpeDogLT5cbiAgICByZXR1cm4gQHN0YXJ0K0BwcmVmaXgubGVuZ3RoK0B0ZXh0Lmxlbmd0aFxuICByZXNFbmQ6IC0+IFxuICAgIHJldHVybiBAc3RhcnQrQGZpbmFsVGV4dCgpLmxlbmd0aFxuICBhcHBseTogLT5cbiAgICBAZWRpdG9yKCkuc3BsaWNlVGV4dChAc3RhcnQsIEBlbmQsIEBmaW5hbFRleHQoKSlcbiAgbmVjZXNzYXJ5OiAtPlxuICAgIHJldHVybiBAZmluYWxUZXh0KCkgIT0gQG9yaWdpbmFsVGV4dCgpXG4gIG9yaWdpbmFsVGV4dDogLT5cbiAgICByZXR1cm4gQGVkaXRvcigpLnRleHRTdWJzdHIoQHN0YXJ0LCBAZW5kKVxuICBmaW5hbFRleHQ6IC0+XG4gICAgcmV0dXJuIEBwcmVmaXgrQHRleHQrQHN1ZmZpeFxuICBvZmZzZXRBZnRlcjogKCkgLT4gXG4gICAgcmV0dXJuIEBmaW5hbFRleHQoKS5sZW5ndGggLSAoQGVuZCAtIEBzdGFydClcbiAgYXBwbHlPZmZzZXQ6IChvZmZzZXQpLT5cbiAgICBpZiBvZmZzZXQgIT0gMFxuICAgICAgQHN0YXJ0ICs9IG9mZnNldFxuICAgICAgQGVuZCArPSBvZmZzZXRcbiAgICAgIGZvciBzZWwgaW4gQHNlbGVjdGlvbnNcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgICBzZWwuZW5kICs9IG9mZnNldFxuICAgIHJldHVybiB0aGlzXG4gIHNlbGVjdENvbnRlbnQ6IC0+IFxuICAgIEBzZWxlY3Rpb25zID0gW25ldyBQb3MoQHByZWZpeC5sZW5ndGgrQHN0YXJ0LCBAcHJlZml4Lmxlbmd0aCtAc3RhcnQrQHRleHQubGVuZ3RoKV1cbiAgICByZXR1cm4gdGhpc1xuICBjYXJyZXRUb1NlbDogLT5cbiAgICBAc2VsZWN0aW9ucyA9IFtdXG4gICAgdGV4dCA9IEBmaW5hbFRleHQoKVxuICAgIEBwcmVmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KEBwcmVmaXgpXG4gICAgQHRleHQgPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KEB0ZXh0KVxuICAgIEBzdWZmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KEBzdWZmaXgpXG4gICAgc3RhcnQgPSBAc3RhcnRcbiAgICBcbiAgICB3aGlsZSAocmVzID0gU3RyaW5nSGVscGVyLmdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHRleHQpKT9cbiAgICAgIFtwb3MsdGV4dF0gPSByZXNcbiAgICAgIEBzZWxlY3Rpb25zLnB1c2gobmV3IFBvcyhzdGFydCtwb3MsIHN0YXJ0K3BvcykpXG4gICAgICBcbiAgICByZXR1cm4gdGhpc1xuICBjb3B5OiAtPiBcbiAgICByZXMgPSBuZXcgUmVwbGFjZW1lbnQoQHN0YXJ0LCBAZW5kLCBAdGV4dCwgQGdldE9wdHMoKSlcbiAgICBpZiBAaGFzRWRpdG9yKClcbiAgICAgIHJlcy53aXRoRWRpdG9yKEBlZGl0b3IoKSlcbiAgICByZXMuc2VsZWN0aW9ucyA9IEBzZWxlY3Rpb25zLm1hcCggKHMpLT5zLmNvcHkoKSApXG4gICAgcmV0dXJuIHJlcyIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL1Bvcyc7XG5cbmltcG9ydCB7XG4gIENvbW1vbkhlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5cbmltcG9ydCB7XG4gIE9wdGlvbk9iamVjdFxufSBmcm9tICcuLi9PcHRpb25PYmplY3QnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgdmFyIFJlcGxhY2VtZW50ID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBSZXBsYWNlbWVudCBleHRlbmRzIFBvcyB7XG4gICAgY29uc3RydWN0b3Ioc3RhcnQxLCBlbmQsIHRleHQxLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQxO1xuICAgICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgICB0aGlzLnRleHQgPSB0ZXh0MTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zLCB7XG4gICAgICAgIHByZWZpeDogJycsXG4gICAgICAgIHN1ZmZpeDogJycsXG4gICAgICAgIHNlbGVjdGlvbnM6IFtdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXNQb3NCZWZvcmVQcmVmaXgoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMudGV4dC5sZW5ndGg7XG4gICAgfVxuXG4gICAgcmVzRW5kKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLmZpbmFsVGV4dCgpLmxlbmd0aDtcbiAgICB9XG5cbiAgICBhcHBseSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnNwbGljZVRleHQodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZmluYWxUZXh0KCkpO1xuICAgIH1cblxuICAgIG5lY2Vzc2FyeSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmFsVGV4dCgpICE9PSB0aGlzLm9yaWdpbmFsVGV4dCgpO1xuICAgIH1cblxuICAgIG9yaWdpbmFsVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICAgIH1cblxuICAgIGZpbmFsVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMudGV4dCArIHRoaXMuc3VmZml4O1xuICAgIH1cblxuICAgIG9mZnNldEFmdGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoIC0gKHRoaXMuZW5kIC0gdGhpcy5zdGFydCk7XG4gICAgfVxuXG4gICAgYXBwbHlPZmZzZXQob2Zmc2V0KSB7XG4gICAgICB2YXIgaSwgbGVuLCByZWYsIHNlbDtcbiAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgdGhpcy5zdGFydCArPSBvZmZzZXQ7XG4gICAgICAgIHRoaXMuZW5kICs9IG9mZnNldDtcbiAgICAgICAgcmVmID0gdGhpcy5zZWxlY3Rpb25zO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBzZWwgPSByZWZbaV07XG4gICAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgICAgICBzZWwuZW5kICs9IG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2VsZWN0Q29udGVudCgpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3RhcnQsIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3RhcnQgKyB0aGlzLnRleHQubGVuZ3RoKV07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjYXJyZXRUb1NlbCgpIHtcbiAgICAgIHZhciBwb3MsIHJlcywgc3RhcnQsIHRleHQ7XG4gICAgICB0aGlzLnNlbGVjdGlvbnMgPSBbXTtcbiAgICAgIHRleHQgPSB0aGlzLmZpbmFsVGV4dCgpO1xuICAgICAgdGhpcy5wcmVmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMucHJlZml4KTtcbiAgICAgIHRoaXMudGV4dCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy50ZXh0KTtcbiAgICAgIHRoaXMuc3VmZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnN1ZmZpeCk7XG4gICAgICBzdGFydCA9IHRoaXMuc3RhcnQ7XG4gICAgICB3aGlsZSAoKHJlcyA9IFN0cmluZ0hlbHBlci5nZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0ZXh0KSkgIT0gbnVsbCkge1xuICAgICAgICBbcG9zLCB0ZXh0XSA9IHJlcztcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25zLnB1c2gobmV3IFBvcyhzdGFydCArIHBvcywgc3RhcnQgKyBwb3MpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICB2YXIgcmVzO1xuICAgICAgcmVzID0gbmV3IFJlcGxhY2VtZW50KHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnRleHQsIHRoaXMuZ2V0T3B0cygpKTtcbiAgICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpO1xuICAgICAgfVxuICAgICAgcmVzLnNlbGVjdGlvbnMgPSB0aGlzLnNlbGVjdGlvbnMubWFwKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHMuY29weSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICB9O1xuXG4gIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhSZXBsYWNlbWVudC5wcm90b3R5cGUsIFtPcHRpb25PYmplY3RdKTtcblxuICByZXR1cm4gUmVwbGFjZW1lbnQ7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJleHBvcnQgY2xhc3MgU2l6ZVxuICBjb25zdHJ1Y3RvcjogKEB3aWR0aCxAaGVpZ2h0KSAtPiIsImV4cG9ydCBjbGFzcyBTdHJQb3NcbiAgY29uc3RydWN0b3I6IChAcG9zLEBzdHIpIC0+XG4gIGVuZDogLT5cbiAgICBAcG9zICsgQHN0ci5sZW5ndGgiLCJleHBvcnQgdmFyIFN0clBvcyA9IGNsYXNzIFN0clBvcyB7XG4gIGNvbnN0cnVjdG9yKHBvcywgc3RyKSB7XG4gICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgdGhpcy5zdHIgPSBzdHI7XG4gIH1cblxuICBlbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBXcmFwcGVkUG9zIGV4dGVuZHMgUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LEBpbm5lclN0YXJ0LEBpbm5lckVuZCxAZW5kKSAtPlxuICAgIHN1cGVyKClcbiAgaW5uZXJDb250YWluc1B0OiAocHQpIC0+XG4gICAgcmV0dXJuIEBpbm5lclN0YXJ0IDw9IHB0IGFuZCBwdCA8PSBAaW5uZXJFbmRcbiAgaW5uZXJDb250YWluc1BvczogKHBvcykgLT5cbiAgICByZXR1cm4gQGlubmVyU3RhcnQgPD0gcG9zLnN0YXJ0IGFuZCBwb3MuZW5kIDw9IEBpbm5lckVuZFxuICBpbm5lclRleHQ6IC0+XG4gICAgQGVkaXRvcigpLnRleHRTdWJzdHIoQGlubmVyU3RhcnQsIEBpbm5lckVuZClcbiAgc2V0SW5uZXJMZW46IChsZW4pIC0+XG4gICAgQG1vdmVTdWZpeChAaW5uZXJTdGFydCArIGxlbilcbiAgbW92ZVN1ZmZpeDogKHB0KSAtPlxuICAgIHN1ZmZpeExlbiA9IEBlbmQgLSBAaW5uZXJFbmRcbiAgICBAaW5uZXJFbmQgPSBwdFxuICAgIEBlbmQgPSBAaW5uZXJFbmQgKyBzdWZmaXhMZW5cbiAgY29weTogLT5cbiAgICByZXR1cm4gbmV3IFdyYXBwZWRQb3MoQHN0YXJ0LEBpbm5lclN0YXJ0LEBpbm5lckVuZCxAZW5kKSIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL1Bvcyc7XG5cbmV4cG9ydCB2YXIgV3JhcHBlZFBvcyA9IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3Mge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgaW5uZXJTdGFydCwgaW5uZXJFbmQsIGVuZCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuaW5uZXJTdGFydCA9IGlubmVyU3RhcnQ7XG4gICAgdGhpcy5pbm5lckVuZCA9IGlubmVyRW5kO1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICB9XG5cbiAgaW5uZXJDb250YWluc1B0KHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmlubmVyRW5kO1xuICB9XG5cbiAgaW5uZXJDb250YWluc1Bvcyhwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuaW5uZXJFbmQ7XG4gIH1cblxuICBpbm5lclRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLmlubmVyU3RhcnQsIHRoaXMuaW5uZXJFbmQpO1xuICB9XG5cbiAgc2V0SW5uZXJMZW4obGVuKSB7XG4gICAgcmV0dXJuIHRoaXMubW92ZVN1Zml4KHRoaXMuaW5uZXJTdGFydCArIGxlbik7XG4gIH1cblxuICBtb3ZlU3VmZml4KHB0KSB7XG4gICAgdmFyIHN1ZmZpeExlbjtcbiAgICBzdWZmaXhMZW4gPSB0aGlzLmVuZCAtIHRoaXMuaW5uZXJFbmQ7XG4gICAgdGhpcy5pbm5lckVuZCA9IHB0O1xuICAgIHJldHVybiB0aGlzLmVuZCA9IHRoaXMuaW5uZXJFbmQgKyBzdWZmaXhMZW47XG4gIH1cblxuICBjb3B5KCkge1xuICAgIHJldHVybiBuZXcgV3JhcHBlZFBvcyh0aGlzLnN0YXJ0LCB0aGlzLmlubmVyU3RhcnQsIHRoaXMuaW5uZXJFbmQsIHRoaXMuZW5kKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIFdyYXBwaW5nIGV4dGVuZHMgUmVwbGFjZW1lbnRcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsIEBlbmQsIHByZWZpeCA9JycsIHN1ZmZpeCA9ICcnLCBAb3B0aW9ucyA9IHt9KSAtPlxuICAgIHN1cGVyKClcbiAgICBAc2V0T3B0cyhAb3B0aW9ucylcbiAgICBAdGV4dCA9ICcnXG4gICAgQHByZWZpeCA9IHByZWZpeFxuICAgIEBzdWZmaXggPSBzdWZmaXhcbiAgYXBwbHk6IC0+XG4gICAgQGFkanVzdFNlbCgpXG4gICAgc3VwZXIoKVxuICBhZGp1c3RTZWw6IC0+XG4gICAgb2Zmc2V0ID0gQG9yaWdpbmFsVGV4dCgpLmxlbmd0aFxuICAgIGZvciBzZWwgaW4gQHNlbGVjdGlvbnNcbiAgICAgIGlmIHNlbC5zdGFydCA+IEBzdGFydCtAcHJlZml4Lmxlbmd0aFxuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBpZiBzZWwuZW5kID49IEBzdGFydCtAcHJlZml4Lmxlbmd0aFxuICAgICAgICBzZWwuZW5kICs9IG9mZnNldFxuICBmaW5hbFRleHQ6IC0+XG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICB0ZXh0ID0gQG9yaWdpbmFsVGV4dCgpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9ICcnXG4gICAgcmV0dXJuIEBwcmVmaXgrdGV4dCtAc3VmZml4XG4gIG9mZnNldEFmdGVyOiAoKSAtPiBcbiAgICByZXR1cm4gQHByZWZpeC5sZW5ndGgrQHN1ZmZpeC5sZW5ndGhcbiAgICAgICAgICBcbiAgY29weTogLT4gXG4gICAgcmVzID0gbmV3IFdyYXBwaW5nKEBzdGFydCwgQGVuZCwgQHByZWZpeCwgQHN1ZmZpeClcbiAgICByZXMuc2VsZWN0aW9ucyA9IEBzZWxlY3Rpb25zLm1hcCggKHMpLT5zLmNvcHkoKSApXG4gICAgcmV0dXJuIHJlcyIsImltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgdmFyIFdyYXBwaW5nID0gY2xhc3MgV3JhcHBpbmcgZXh0ZW5kcyBSZXBsYWNlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBlbmQsIHByZWZpeCA9ICcnLCBzdWZmaXggPSAnJywgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zKTtcbiAgICB0aGlzLnRleHQgPSAnJztcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeDtcbiAgICB0aGlzLnN1ZmZpeCA9IHN1ZmZpeDtcbiAgfVxuXG4gIGFwcGx5KCkge1xuICAgIHRoaXMuYWRqdXN0U2VsKCk7XG4gICAgcmV0dXJuIHN1cGVyLmFwcGx5KCk7XG4gIH1cblxuICBhZGp1c3RTZWwoKSB7XG4gICAgdmFyIGksIGxlbiwgb2Zmc2V0LCByZWYsIHJlc3VsdHMsIHNlbDtcbiAgICBvZmZzZXQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpLmxlbmd0aDtcbiAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2VsID0gcmVmW2ldO1xuICAgICAgaWYgKHNlbC5zdGFydCA+IHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGgpIHtcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgIH1cbiAgICAgIGlmIChzZWwuZW5kID49IHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHNlbC5lbmQgKz0gb2Zmc2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIGZpbmFsVGV4dCgpIHtcbiAgICB2YXIgdGV4dDtcbiAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgdGV4dCA9IHRoaXMub3JpZ2luYWxUZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSAnJztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGV4dCArIHRoaXMuc3VmZml4O1xuICB9XG5cbiAgb2Zmc2V0QWZ0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3VmZml4Lmxlbmd0aDtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBuZXcgV3JhcHBpbmcodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMucHJlZml4LCB0aGlzLnN1ZmZpeCk7XG4gICAgcmVzLnNlbGVjdGlvbnMgPSB0aGlzLnNlbGVjdGlvbnMubWFwKGZ1bmN0aW9uKHMpIHtcbiAgICAgIHJldHVybiBzLmNvcHkoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbn07XG4iLCJcbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmVcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gIHNhdmU6IChrZXksdmFsKSAtPlxuICAgIGlmIGxvY2FsU3RvcmFnZT9cbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEBmdWxsS2V5KGtleSksIEpTT04uc3RyaW5naWZ5KHZhbCkpXG4gIHNhdmVJblBhdGg6IChwYXRoLCBrZXksIHZhbCkgLT5cbiAgICBkYXRhID0gQGxvYWQocGF0aClcbiAgICB1bmxlc3MgZGF0YT9cbiAgICAgIGRhdGEgPSB7fVxuICAgIGRhdGFba2V5XSA9IHZhbFxuICAgIEBzYXZlKHBhdGgsZGF0YSlcbiAgbG9hZDogKGtleSkgLT5cbiAgICBpZiBsb2NhbFN0b3JhZ2U/XG4gICAgICBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKEBmdWxsS2V5KGtleSkpKVxuICBmdWxsS2V5OiAoa2V5KSAtPlxuICAgICdDb2RlV2F2ZV8nK2tleSIsImV4cG9ydCB2YXIgTG9jYWxTdG9yYWdlRW5naW5lID0gY2xhc3MgTG9jYWxTdG9yYWdlRW5naW5lIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHNhdmUoa2V5LCB2YWwpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmZ1bGxLZXkoa2V5KSwgSlNPTi5zdHJpbmdpZnkodmFsKSk7XG4gICAgfVxuICB9XG5cbiAgc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbCkge1xuICAgIHZhciBkYXRhO1xuICAgIGRhdGEgPSB0aGlzLmxvYWQocGF0aCk7XG4gICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgZGF0YSA9IHt9O1xuICAgIH1cbiAgICBkYXRhW2tleV0gPSB2YWw7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZShwYXRoLCBkYXRhKTtcbiAgfVxuXG4gIGxvYWQoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmZ1bGxLZXkoa2V5KSkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bGxLZXkoa2V5KSB7XG4gICAgcmV0dXJuICdDb2RlV2F2ZV8nICsga2V5O1xuICB9XG5cbn07XG4iXX0=
