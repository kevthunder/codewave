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

},{"./helpers/ArrayHelper":24,"./helpers/StringHelper":29,"./positioning/Pair":30}],2:[function(require,module,exports){
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

},{"./helpers/OptionalPromise":27,"./positioning/Pos":32,"./positioning/PosCollection":33,"./positioning/Replacement":34}],3:[function(require,module,exports){
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

},{"./Codewave":5,"./Context":7,"./TextParser":17,"./helpers/StringHelper":29}],5:[function(require,module,exports){
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

},{"./ClosingPromp":2,"./Command":6,"./Context":7,"./Logger":11,"./PositionedCmdInstance":13,"./Process":14,"./TextParser":17,"./helpers/StringHelper":29,"./positioning/PosCollection":33}],6:[function(require,module,exports){
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

},{"./positioning/Pair":30}],9:[function(require,module,exports){
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

},{"./helpers/OptionalPromise":27,"./positioning/Pos":32,"./positioning/StrPos":36}],11:[function(require,module,exports){
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

},{"./BoxHelper":1,"./CmdInstance":4,"./Command":6,"./helpers/NamespaceHelper":26,"./helpers/StringHelper":29,"./positioning/Pos":32,"./positioning/Replacement":34,"./positioning/StrPos":36}],14:[function(require,module,exports){
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

},{"./TextParser":17,"./positioning/Pos":32}],17:[function(require,module,exports){
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

},{"./Editor":10,"./positioning/Pos":32}],18:[function(require,module,exports){
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

},{"./Codewave":5,"./Command":6,"./cmds/CoreCommandProvider":19,"./cmds/HtmlCommandProvider":20,"./cmds/JsCommandProvider":21,"./cmds/PhpCommandProvider":22,"./positioning/Pos":32,"./positioning/WrappedPos":37,"./storageEngines/LocalStorageEngine":39}],19:[function(require,module,exports){
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

var _PathHelper = require("../helpers/PathHelper");

var _Replacement = require("../positioning/Replacement");

var BoxCmd, CloseCmd, EditCmd, EmmetCmd, NameSpaceCmd, aliasCommand, exec_parent, getCommand, getContent, getParam, help, listCommand, no_execute, quote_carret, removeCommand, renameCommand, setCommand, storeJsonCommand;

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
  return _PathHelper.PathHelper.getPath(instance.codewave.vars, name);
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

},{"../BoxHelper":1,"../Command":6,"../Detector":8,"../EditCmdProp":9,"../helpers/PathHelper":28,"../helpers/StringHelper":29,"../positioning/Replacement":34,"emmet":"emmet"}],20:[function(require,module,exports){
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

},{"../Command":6,"../Detector":8,"../helpers/StringHelper":29}],23:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{"../positioning/Size":35}],30:[function(require,module,exports){
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

},{"../helpers/StringHelper":29,"./PairMatch":31,"./Pos":32}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"../helpers/CommonHelper":25,"./Replacement":34,"./Wrapping":38}],34:[function(require,module,exports){
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

},{"../OptionObject":12,"../helpers/CommonHelper":25,"../helpers/StringHelper":29,"./Pos":32}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{"./Pos":32}],38:[function(require,module,exports){
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

},{"./Replacement":34}],39:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvQm94SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9Cb3hIZWxwZXIuanMiLCIuLi9zcmMvQ2xvc2luZ1Byb21wLmNvZmZlZSIsIi4uL3NyYy9DbG9zaW5nUHJvbXAuanMiLCIuLi9zcmMvQ21kRmluZGVyLmNvZmZlZSIsIi4uL3NyYy9DbWRGaW5kZXIuanMiLCIuLi9zcmMvQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL0NtZEluc3RhbmNlLmpzIiwiLi4vc3JjL0NvZGV3YXZlLmNvZmZlZSIsIi4uL3NyYy9Db2Rld2F2ZS5qcyIsIi4uL3NyYy9Db21tYW5kLmNvZmZlZSIsIi4uL3NyYy9Db21tYW5kLmpzIiwiLi4vc3JjL0NvbnRleHQuY29mZmVlIiwiLi4vc3JjL0NvbnRleHQuanMiLCIuLi9zcmMvRGV0ZWN0b3IuY29mZmVlIiwiLi4vc3JjL0RldGVjdG9yLmpzIiwiLi4vc3JjL0VkaXRDbWRQcm9wLmNvZmZlZSIsIi4uL3NyYy9FZGl0Q21kUHJvcC5qcyIsIi4uL3NyYy9FZGl0b3IuY29mZmVlIiwiLi4vc3JjL0VkaXRvci5qcyIsIi4uL3NyYy9Mb2dnZXIuY29mZmVlIiwiLi4vc3JjL0xvZ2dlci5qcyIsIi4uL3NyYy9PcHRpb25PYmplY3QuY29mZmVlIiwiLi4vc3JjL09wdGlvbk9iamVjdC5qcyIsIi4uL3NyYy9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsIi4uL3NyYy9Qcm9jZXNzLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmpzIiwiLi4vc3JjL1RleHRBcmVhRWRpdG9yLmNvZmZlZSIsIi4uL3NyYy9UZXh0QXJlYUVkaXRvci5qcyIsIi4uL3NyYy9UZXh0UGFyc2VyLmNvZmZlZSIsIi4uL3NyYy9UZXh0UGFyc2VyLmpzIiwiLi4vc3JjL2Jvb3RzdHJhcC5jb2ZmZWUiLCIuLi9zcmMvYm9vdHN0cmFwLmpzIiwiLi4vc3JjL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9QaHBDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2VudHJ5LmNvZmZlZSIsIi4uL3NyYy9lbnRyeS5qcyIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvQ29tbW9uSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0NvbW1vbkhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL05hbWVzcGFjZUhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCIuLi9zcmMvaGVscGVycy9PcHRpb25hbFByb21pc2UuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlLmpzIiwiLi4vc3JjL2hlbHBlcnMvUGF0aEhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9QYXRoSGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvU3RyaW5nSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL1N0cmluZ0hlbHBlci5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1BhaXJNYXRjaC5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1NpemUuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1N0clBvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvV3JhcHBpbmcuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwaW5nLmpzIiwiLi4vc3JjL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZS5jb2ZmZWUiLCIuLi9zcmMvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSx1QkFBQSxDQUFBOztBQUNBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxvQkFBQSxDQUFBOztBQUVBLElBQWEsU0FBTjtBQUFBO0FBQUE7QUFDTCxxQkFBYSxPQUFiLEVBQWE7QUFBQSxRQUFXLE9BQVgsdUVBQUEsRUFBQTs7QUFBQTs7QUFDWCxRQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQURZLFNBQUEsT0FBQSxHQUFBLE9BQUE7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UCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuaW1wb3J0IHsgUGFpciB9IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCBjbGFzcyBCb3hIZWxwZXJcbiAgY29uc3RydWN0b3I6IChAY29udGV4dCwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIEBkZWZhdWx0cyA9IHtcbiAgICAgIGRlY286IEBjb250ZXh0LmNvZGV3YXZlLmRlY29cbiAgICAgIHBhZDogMlxuICAgICAgd2lkdGg6IDUwXG4gICAgICBoZWlnaHQ6IDNcbiAgICAgIG9wZW5UZXh0OiAnJ1xuICAgICAgY2xvc2VUZXh0OiAnJ1xuICAgICAgcHJlZml4OiAnJ1xuICAgICAgc3VmZml4OiAnJ1xuICAgICAgaW5kZW50OiAwXG4gICAgfVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgY2xvbmU6ICh0ZXh0KSAtPlxuICAgIG9wdCA9IHt9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgb3B0W2tleV0gPSB0aGlzW2tleV1cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcihAY29udGV4dCxvcHQpXG4gIGRyYXc6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAc3RhcnRTZXAoKSArIFwiXFxuXCIgKyBAbGluZXModGV4dCkgKyBcIlxcblwiKyBAZW5kU2VwKClcbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LndyYXBDb21tZW50KHN0cilcbiAgc2VwYXJhdG9yOiAtPlxuICAgIGxlbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGRlY29MaW5lKGxlbikpXG4gIHN0YXJ0U2VwOiAtPlxuICAgIGxuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoIC0gQG9wZW5UZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAcHJlZml4ICsgQHdyYXBDb21tZW50KEBvcGVuVGV4dCtAZGVjb0xpbmUobG4pKVxuICBlbmRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAY2xvc2VUZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGNsb3NlVGV4dCtAZGVjb0xpbmUobG4pKSArIEBzdWZmaXhcbiAgZGVjb0xpbmU6IChsZW4pIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChAZGVjbywgbGVuKVxuICBwYWRkaW5nOiAtPiBcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCBAcGFkKVxuICBsaW5lczogKHRleHQgPSAnJywgdXB0b0hlaWdodD10cnVlKSAtPlxuICAgIHRleHQgPSB0ZXh0IG9yICcnXG4gICAgbGluZXMgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIilcbiAgICBpZiB1cHRvSGVpZ2h0XG4gICAgICByZXR1cm4gKEBsaW5lKGxpbmVzW3hdIG9yICcnKSBmb3IgeCBpbiBbMC4uQGhlaWdodF0pLmpvaW4oJ1xcbicpIFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoQGxpbmUobCkgZm9yIGwgaW4gbGluZXMpLmpvaW4oJ1xcbicpIFxuICBsaW5lOiAodGV4dCA9ICcnKSAtPlxuICAgIHJldHVybiAoU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLEBpbmRlbnQpICtcbiAgICAgIEB3cmFwQ29tbWVudChcbiAgICAgICAgQGRlY28gK1xuICAgICAgICBAcGFkZGluZygpICtcbiAgICAgICAgdGV4dCArXG4gICAgICAgIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgQHdpZHRoIC0gQHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyBcbiAgICAgICAgQHBhZGRpbmcoKSArXG4gICAgICAgIEBkZWNvXG4gICAgICApKVxuICBsZWZ0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50TGVmdChAZGVjbyArIEBwYWRkaW5nKCkpXG4gIHJpZ2h0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQHBhZGRpbmcoKSArIEBkZWNvKVxuICByZW1vdmVJZ25vcmVkQ29udGVudDogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnMoQGNvbnRleHQuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHRleHQpKVxuICB0ZXh0Qm91bmRzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldFR4dFNpemUoQHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpKVxuICBnZXRCb3hGb3JQb3M6IChwb3MpIC0+XG4gICAgZGVwdGggPSBAZ2V0TmVzdGVkTHZsKHBvcy5zdGFydClcbiAgICBpZiBkZXB0aCA+IDBcbiAgICAgIGxlZnQgPSBAbGVmdCgpXG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LGRlcHRoLTEpXG4gICAgICBcbiAgICAgIGNsb25lID0gQGNsb25lKClcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiXG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aFxuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSBAZGVjbyArIEBkZWNvICsgcGxhY2Vob2xkZXIgKyBAZGVjbyArIEBkZWNvXG4gICAgICBcbiAgICAgIHN0YXJ0RmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwnLionKSlcbiAgICAgIFxuICAgICAgcGFpciA9IG5ldyBQYWlyKHN0YXJ0RmluZCxlbmRGaW5kLHtcbiAgICAgICAgdmFsaWRNYXRjaDogKG1hdGNoKT0+XG4gICAgICAgICAgIyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuICAgICAgICAgIGYgPSBAY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKVxuICAgICAgICAgIHJldHVybiAhZj8gb3IgZi5zdHIgIT0gbGVmdFxuICAgICAgfSlcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsQGNvbnRleHQuY29kZXdhdmUuZWRpdG9yLnRleHQoKSlcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgcmVzLnN0YXJ0ICs9IGN1ckxlZnQubGVuZ3RoXG4gICAgICAgIHJldHVybiByZXNcbiAgICBcbiAgZ2V0TmVzdGVkTHZsOiAoaW5kZXgpIC0+XG4gICAgZGVwdGggPSAwXG4gICAgbGVmdCA9IEBsZWZ0KClcbiAgICB3aGlsZSAoZiA9IEBjb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KGluZGV4ICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKSk/ICYmIGYuc3RyID09IGxlZnRcbiAgICAgIGluZGV4ID0gZi5wb3NcbiAgICAgIGRlcHRoKytcbiAgICByZXR1cm4gZGVwdGhcbiAgZ2V0T3B0RnJvbUxpbmU6IChsaW5lLGdldFBhZD10cnVlKSAtPlxuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdChAZGVjbykpK1wiKShcXFxccyopXCIpXG4gICAgckVuZCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQGRlY28pKStcIikoXFxufCQpXCIpXG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKVxuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKVxuICAgIGlmIHJlc1N0YXJ0PyBhbmQgcmVzRW5kP1xuICAgICAgaWYgZ2V0UGFkXG4gICAgICAgIEBwYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgscmVzRW5kWzFdLmxlbmd0aClcbiAgICAgIEBpbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGhcbiAgICAgIHN0YXJ0UG9zID0gcmVzU3RhcnQuaW5kZXggKyByZXNTdGFydFsxXS5sZW5ndGggKyByZXNTdGFydFsyXS5sZW5ndGggKyBAcGFkXG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gQHBhZFxuICAgICAgQHdpZHRoID0gZW5kUG9zIC0gc3RhcnRQb3NcbiAgICByZXR1cm4gdGhpc1xuICByZWZvcm1hdExpbmVzOiAodGV4dCxvcHRpb25zPXt9KSAtPlxuICAgIHJldHVybiBAbGluZXMoQHJlbW92ZUNvbW1lbnQodGV4dCxvcHRpb25zKSxmYWxzZSlcbiAgcmVtb3ZlQ29tbWVudDogKHRleHQsb3B0aW9ucz17fSktPlxuICAgIGlmIHRleHQ/XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgbXVsdGlsaW5lOiB0cnVlXG4gICAgICB9XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LGRlZmF1bHRzLG9wdGlvbnMpXG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdCgpKVxuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpXG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGRlY28pXG4gICAgICBmbGFnID0gaWYgb3B0aW9uc1snbXVsdGlsaW5lJ10gdGhlbiAnZ20nIGVsc2UgJydcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzezAsI3tAcGFkfX1cIiwgZmxhZylcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoXCJcXFxccyooPzoje2VkfSkqI3tlY3J9XFxcXHMqJFwiLCBmbGFnKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsJycpLnJlcGxhY2UocmUyLCcnKVxuICAgXG4gICIsImltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQXJyYXlIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcblxuaW1wb3J0IHtcbiAgUGFpclxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgdmFyIEJveEhlbHBlciA9IGNsYXNzIEJveEhlbHBlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBrZXksIHJlZiwgdmFsO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIGRlY286IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5kZWNvLFxuICAgICAgcGFkOiAyLFxuICAgICAgd2lkdGg6IDUwLFxuICAgICAgaGVpZ2h0OiAzLFxuICAgICAgb3BlblRleHQ6ICcnLFxuICAgICAgY2xvc2VUZXh0OiAnJyxcbiAgICAgIHByZWZpeDogJycsXG4gICAgICBzdWZmaXg6ICcnLFxuICAgICAgaW5kZW50OiAwXG4gICAgfTtcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsb25lKHRleHQpIHtcbiAgICB2YXIga2V5LCBvcHQsIHJlZiwgdmFsO1xuICAgIG9wdCA9IHt9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIG9wdFtrZXldID0gdGhpc1trZXldO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQsIG9wdCk7XG4gIH1cblxuICBkcmF3KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydFNlcCgpICsgXCJcXG5cIiArIHRoaXMubGluZXModGV4dCkgKyBcIlxcblwiICsgdGhpcy5lbmRTZXAoKTtcbiAgfVxuXG4gIHdyYXBDb21tZW50KHN0cikge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnQoc3RyKTtcbiAgfVxuXG4gIHNlcGFyYXRvcigpIHtcbiAgICB2YXIgbGVuO1xuICAgIGxlbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmRlY29MaW5lKGxlbikpO1xuICB9XG5cbiAgc3RhcnRTZXAoKSB7XG4gICAgdmFyIGxuO1xuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5vcGVuVGV4dC5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy53cmFwQ29tbWVudCh0aGlzLm9wZW5UZXh0ICsgdGhpcy5kZWNvTGluZShsbikpO1xuICB9XG5cbiAgZW5kU2VwKCkge1xuICAgIHZhciBsbjtcbiAgICBsbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aCAtIHRoaXMuY2xvc2VUZXh0Lmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmNsb3NlVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKSArIHRoaXMuc3VmZml4O1xuICB9XG5cbiAgZGVjb0xpbmUobGVuKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCh0aGlzLmRlY28sIGxlbik7XG4gIH1cblxuICBwYWRkaW5nKCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMucGFkKTtcbiAgfVxuXG4gIGxpbmVzKHRleHQgPSAnJywgdXB0b0hlaWdodCA9IHRydWUpIHtcbiAgICB2YXIgbCwgbGluZXMsIHg7XG4gICAgdGV4dCA9IHRleHQgfHwgJyc7XG4gICAgbGluZXMgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIik7XG4gICAgaWYgKHVwdG9IZWlnaHQpIHtcbiAgICAgIHJldHVybiAoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSwgcmVmLCByZXN1bHRzO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoeCA9IGkgPSAwLCByZWYgPSB0aGlzLmhlaWdodDsgKDAgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZik7IHggPSAwIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobGluZXNbeF0gfHwgJycpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pLmNhbGwodGhpcykpLmpvaW4oJ1xcbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGksIGxlbjEsIHJlc3VsdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuMSA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICAgIGwgPSBsaW5lc1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5saW5lKGwpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pLmNhbGwodGhpcykpLmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgfVxuXG4gIGxpbmUodGV4dCA9ICcnKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy5pbmRlbnQpICsgdGhpcy53cmFwQ29tbWVudCh0aGlzLmRlY28gKyB0aGlzLnBhZGRpbmcoKSArIHRleHQgKyBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMud2lkdGggLSB0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyB0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbyk7XG4gIH1cblxuICBsZWZ0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpKTtcbiAgfVxuXG4gIHJpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbyk7XG4gIH1cblxuICByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpO1xuICB9XG5cbiAgdGV4dEJvdW5kcyh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRUeHRTaXplKHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpO1xuICB9XG5cbiAgZ2V0Qm94Rm9yUG9zKHBvcykge1xuICAgIHZhciBjbG9uZSwgY3VyTGVmdCwgZGVwdGgsIGVuZEZpbmQsIGxlZnQsIHBhaXIsIHBsYWNlaG9sZGVyLCByZXMsIHN0YXJ0RmluZDtcbiAgICBkZXB0aCA9IHRoaXMuZ2V0TmVzdGVkTHZsKHBvcy5zdGFydCk7XG4gICAgaWYgKGRlcHRoID4gMCkge1xuICAgICAgbGVmdCA9IHRoaXMubGVmdCgpO1xuICAgICAgY3VyTGVmdCA9IFN0cmluZ0hlbHBlci5yZXBlYXQobGVmdCwgZGVwdGggLSAxKTtcbiAgICAgIGNsb25lID0gdGhpcy5jbG9uZSgpO1xuICAgICAgcGxhY2Vob2xkZXIgPSBcIiMjI1BsYWNlSG9sZGVyIyMjXCI7XG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aDtcbiAgICAgIGNsb25lLm9wZW5UZXh0ID0gY2xvbmUuY2xvc2VUZXh0ID0gdGhpcy5kZWNvICsgdGhpcy5kZWNvICsgcGxhY2Vob2xkZXIgKyB0aGlzLmRlY28gKyB0aGlzLmRlY287XG4gICAgICBzdGFydEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuc3RhcnRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwgJy4qJykpO1xuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwgJy4qJykpO1xuICAgICAgcGFpciA9IG5ldyBQYWlyKHN0YXJ0RmluZCwgZW5kRmluZCwge1xuICAgICAgICB2YWxpZE1hdGNoOiAobWF0Y2gpID0+IHtcbiAgICAgICAgICB2YXIgZjtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuICAgICAgICAgIGYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQobWF0Y2guc3RhcnQoKSwgW2xlZnQsIFwiXFxuXCIsIFwiXFxyXCJdLCAtMSk7XG4gICAgICAgICAgcmV0dXJuIChmID09IG51bGwpIHx8IGYuc3RyICE9PSBsZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKTtcbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGg7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TmVzdGVkTHZsKGluZGV4KSB7XG4gICAgdmFyIGRlcHRoLCBmLCBsZWZ0O1xuICAgIGRlcHRoID0gMDtcbiAgICBsZWZ0ID0gdGhpcy5sZWZ0KCk7XG4gICAgd2hpbGUgKCgoZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCwgW2xlZnQsIFwiXFxuXCIsIFwiXFxyXCJdLCAtMSkpICE9IG51bGwpICYmIGYuc3RyID09PSBsZWZ0KSB7XG4gICAgICBpbmRleCA9IGYucG9zO1xuICAgICAgZGVwdGgrKztcbiAgICB9XG4gICAgcmV0dXJuIGRlcHRoO1xuICB9XG5cbiAgZ2V0T3B0RnJvbUxpbmUobGluZSwgZ2V0UGFkID0gdHJ1ZSkge1xuICAgIHZhciBlbmRQb3MsIHJFbmQsIHJTdGFydCwgcmVzRW5kLCByZXNTdGFydCwgc3RhcnRQb3M7XG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbykpICsgXCIpKFxcXFxzKilcIik7XG4gICAgckVuZCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQodGhpcy5kZWNvKSkgKyBcIikoXFxufCQpXCIpO1xuICAgIHJlc1N0YXJ0ID0gclN0YXJ0LmV4ZWMobGluZSk7XG4gICAgcmVzRW5kID0gckVuZC5leGVjKGxpbmUpO1xuICAgIGlmICgocmVzU3RhcnQgIT0gbnVsbCkgJiYgKHJlc0VuZCAhPSBudWxsKSkge1xuICAgICAgaWYgKGdldFBhZCkge1xuICAgICAgICB0aGlzLnBhZCA9IE1hdGgubWluKHJlc1N0YXJ0WzNdLmxlbmd0aCwgcmVzRW5kWzFdLmxlbmd0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmluZGVudCA9IHJlc1N0YXJ0WzFdLmxlbmd0aDtcbiAgICAgIHN0YXJ0UG9zID0gcmVzU3RhcnQuaW5kZXggKyByZXNTdGFydFsxXS5sZW5ndGggKyByZXNTdGFydFsyXS5sZW5ndGggKyB0aGlzLnBhZDtcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSB0aGlzLnBhZDtcbiAgICAgIHRoaXMud2lkdGggPSBlbmRQb3MgLSBzdGFydFBvcztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWZvcm1hdExpbmVzKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzKHRoaXMucmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zKSwgZmFsc2UpO1xuICB9XG5cbiAgcmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGVjbCwgZWNyLCBlZCwgZmxhZywgb3B0LCByZTEsIHJlMjtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgbXVsdGlsaW5lOiB0cnVlXG4gICAgICB9O1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpO1xuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKTtcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmRlY28pO1xuICAgICAgZmxhZyA9IG9wdGlvbnNbJ211bHRpbGluZSddID8gJ2dtJyA6ICcnO1xuICAgICAgcmUxID0gbmV3IFJlZ0V4cChgXlxcXFxzKiR7ZWNsfSg/OiR7ZWR9KSpcXFxcc3swLCR7dGhpcy5wYWR9fWAsIGZsYWcpO1xuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxcXFxzKiRgLCBmbGFnKTtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmUxLCAnJykucmVwbGFjZShyZTIsICcnKTtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvc0NvbGxlY3Rpb24gfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IG9wdGlvbmFsUHJvbWlzZSB9IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgY2xhc3MgQ2xvc2luZ1Byb21wXG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlLHNlbGVjdGlvbnMpIC0+XG4gICAgQHRpbWVvdXQgPSBudWxsXG4gICAgQF90eXBlZCA9IG51bGxcbiAgICBAc3RhcnRlZCA9IGZhbHNlXG4gICAgQG5iQ2hhbmdlcyA9IDBcbiAgICBAc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uKHNlbGVjdGlvbnMpXG4gIGJlZ2luOiAtPlxuICAgIEBzdGFydGVkID0gdHJ1ZVxuICAgIG9wdGlvbmFsUHJvbWlzZShAYWRkQ2FycmV0cygpKS50aGVuID0+XG4gICAgICBpZiBAY29kZXdhdmUuZWRpdG9yLmNhbkxpc3RlblRvQ2hhbmdlKClcbiAgICAgICAgQHByb3h5T25DaGFuZ2UgPSAoY2g9bnVsbCk9PiBAb25DaGFuZ2UoY2gpXG4gICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuYWRkQ2hhbmdlTGlzdGVuZXIoIEBwcm94eU9uQ2hhbmdlIClcbiAgICAgIHJldHVybiB0aGlzXG4gICAgLnJlc3VsdCgpXG4gIGFkZENhcnJldHM6IC0+XG4gICAgQHJlcGxhY2VtZW50cyA9IEBzZWxlY3Rpb25zLndyYXAoXG4gICAgICBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jYXJyZXRDaGFyICsgQGNvZGV3YXZlLmJyYWtldHMgKyBcIlxcblwiLFxuICAgICAgXCJcXG5cIiArIEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjb2Rld2F2ZS5jYXJyZXRDaGFyICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICApLm1hcCggKHApIC0+IHAuY2FycmV0VG9TZWwoKSApXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhAcmVwbGFjZW1lbnRzKVxuICBpbnZhbGlkVHlwZWQ6IC0+XG4gICAgQF90eXBlZCA9IG51bGxcbiAgb25DaGFuZ2U6IChjaCA9IG51bGwpLT5cbiAgICBAaW52YWxpZFR5cGVkKClcbiAgICBpZiBAc2tpcEV2ZW50KGNoKVxuICAgICAgcmV0dXJuXG4gICAgQG5iQ2hhbmdlcysrXG4gICAgaWYgQHNob3VsZFN0b3AoKVxuICAgICAgQHN0b3AoKVxuICAgICAgQGNsZWFuQ2xvc2UoKVxuICAgIGVsc2VcbiAgICAgIEByZXN1bWUoKVxuICAgICAgXG4gIHNraXBFdmVudDogKGNoKSAtPlxuICAgIHJldHVybiBjaD8gYW5kIGNoLmNoYXJDb2RlQXQoMCkgIT0gMzJcbiAgXG4gIHJlc3VtZTogLT5cbiAgICAjXG4gICAgXG4gIHNob3VsZFN0b3A6IC0+XG4gICAgcmV0dXJuIEB0eXBlZCgpID09IGZhbHNlIG9yIEB0eXBlZCgpLmluZGV4T2YoJyAnKSAhPSAtMVxuICBcbiAgY2xlYW5DbG9zZTogLT5cbiAgICByZXBsYWNlbWVudHMgPSBbXVxuICAgIHNlbGVjdGlvbnMgPSBAZ2V0U2VsZWN0aW9ucygpXG4gICAgZm9yIHNlbCBpbiBzZWxlY3Rpb25zXG4gICAgICBpZiBwb3MgPSBAd2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgICBzdGFydCA9IHNlbFxuICAgICAgZWxzZSBpZiAoZW5kID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSBhbmQgc3RhcnQ/XG4gICAgICAgIHJlcyA9IGVuZC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLmlubmVyVGV4dCgpLnNwbGl0KCcgJylbMF1cbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChlbmQuaW5uZXJTdGFydCxlbmQuaW5uZXJFbmQscmVzKVxuICAgICAgICByZXBsLnNlbGVjdGlvbnMgPSBbc3RhcnRdXG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKHJlcGwpXG4gICAgICAgIHN0YXJ0ID0gbnVsbFxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICBnZXRTZWxlY3Rpb25zOiAtPlxuICAgIHJldHVybiBAY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKClcbiAgc3RvcDogLT5cbiAgICBAc3RhcnRlZCA9IGZhbHNlXG4gICAgY2xlYXJUaW1lb3V0KEB0aW1lb3V0KSBpZiBAdGltZW91dD9cbiAgICBAY29kZXdhdmUuY2xvc2luZ1Byb21wID0gbnVsbCBpZiBAY29kZXdhdmUuY2xvc2luZ1Byb21wID09IHRoaXNcbiAgICBpZiBAcHJveHlPbkNoYW5nZT9cbiAgICAgIEBjb2Rld2F2ZS5lZGl0b3IucmVtb3ZlQ2hhbmdlTGlzdGVuZXIoQHByb3h5T25DaGFuZ2UpXG4gIGNhbmNlbDogLT5cbiAgICBpZiBAdHlwZWQoKSAhPSBmYWxzZVxuICAgICAgQGNhbmNlbFNlbGVjdGlvbnMoQGdldFNlbGVjdGlvbnMoKSlcbiAgICBAc3RvcCgpXG4gIGNhbmNlbFNlbGVjdGlvbnM6IChzZWxlY3Rpb25zKSAtPlxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc3RhcnQgPSBudWxsXG4gICAgZm9yIHNlbCBpbiBzZWxlY3Rpb25zXG4gICAgICBpZiBwb3MgPSBAd2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgICBzdGFydCA9IHBvc1xuICAgICAgZWxzZSBpZiAoZW5kID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSBhbmQgc3RhcnQ/XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ldyBSZXBsYWNlbWVudChzdGFydC5zdGFydCxlbmQuZW5kLEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihzdGFydC5lbmQrMSwgZW5kLnN0YXJ0LTEpKS5zZWxlY3RDb250ZW50KCkpXG4gICAgICAgIHN0YXJ0ID0gbnVsbFxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB0eXBlZDogLT5cbiAgICB1bmxlc3MgQF90eXBlZD9cbiAgICAgIGNwb3MgPSBAY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpXG4gICAgICBpbm5lclN0YXJ0ID0gQHJlcGxhY2VtZW50c1swXS5zdGFydCArIEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aFxuICAgICAgaWYgQGNvZGV3YXZlLmZpbmRQcmV2QnJha2V0KGNwb3Muc3RhcnQpID09IEByZXBsYWNlbWVudHNbMF0uc3RhcnQgYW5kIChpbm5lckVuZCA9IEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChpbm5lclN0YXJ0KSk/IGFuZCBpbm5lckVuZCA+PSBjcG9zLmVuZFxuICAgICAgICBAX3R5cGVkID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGlubmVyU3RhcnQsIGlubmVyRW5kKVxuICAgICAgZWxzZVxuICAgICAgICBAX3R5cGVkID0gZmFsc2VcbiAgICByZXR1cm4gQF90eXBlZFxuICB3aGl0aGluT3BlbkJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAc3RhcnRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT0gdGFyZ2V0VGV4dFxuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG4gIHdoaXRoaW5DbG9zZUJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAZW5kUG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PSB0YXJnZXRUZXh0XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcbiAgc3RhcnRQb3NBdDogKGluZGV4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zKFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLnN0YXJ0ICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIpLFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsxKVxuICAgICAgKS53cmFwcGVkQnkoQGNvZGV3YXZlLmJyYWtldHMsIEBjb2Rld2F2ZS5icmFrZXRzKVxuICBlbmRQb3NBdDogKGluZGV4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zKFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzEpLFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLmVuZCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsyKVxuICAgICAgKS53cmFwcGVkQnkoQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyLCBAY29kZXdhdmUuYnJha2V0cylcblxuZXhwb3J0IGNsYXNzIFNpbXVsYXRlZENsb3NpbmdQcm9tcCBleHRlbmRzIENsb3NpbmdQcm9tcFxuICByZXN1bWU6IC0+XG4gICAgQHNpbXVsYXRlVHlwZSgpXG4gIHNpbXVsYXRlVHlwZTogLT5cbiAgICBjbGVhclRpbWVvdXQoQHRpbWVvdXQpIGlmIEB0aW1lb3V0P1xuICAgIEB0aW1lb3V0ID0gc2V0VGltZW91dCAoPT5cbiAgICAgIEBpbnZhbGlkVHlwZWQoKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGN1ckNsb3NlID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhAcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0uY29weSgpLmFwcGx5T2Zmc2V0KEB0eXBlZCgpLmxlbmd0aCkpXG4gICAgICBpZiBjdXJDbG9zZVxuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LGN1ckNsb3NlLmVuZCx0YXJnZXRUZXh0KVxuICAgICAgICBpZiByZXBsLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KClcbiAgICAgICAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKFtyZXBsXSlcbiAgICAgIGVsc2VcbiAgICAgICAgQHN0b3AoKVxuICAgICAgQG9uVHlwZVNpbXVsYXRlZCgpIGlmIEBvblR5cGVTaW11bGF0ZWQ/XG4gICAgKSwgMlxuICBza2lwRXZlbnQ6IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldFNlbGVjdGlvbnM6IC0+XG4gICAgcmV0dXJuIFtcbiAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKVxuICAgICAgICBAcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0gKyBAdHlwZWQoKS5sZW5ndGhcbiAgICAgIF1cbiAgd2hpdGhpbkNsb3NlQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBlbmRQb3NBdChpKVxuICAgICAgbmV4dCA9IEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldCh0YXJnZXRQb3MuaW5uZXJTdGFydClcbiAgICAgIGlmIG5leHQ/XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpXG4gICAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG5cbkNsb3NpbmdQcm9tcC5uZXdGb3IgPSAoY29kZXdhdmUsc2VsZWN0aW9ucykgLT5cbiAgaWYgY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLHNlbGVjdGlvbnMpXG4gIGVsc2VcbiAgICByZXR1cm4gbmV3IFNpbXVsYXRlZENsb3NpbmdQcm9tcChjb2Rld2F2ZSxzZWxlY3Rpb25zKSIsImltcG9ydCB7XG4gIFBvc0NvbGxlY3Rpb25cbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIG9wdGlvbmFsUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IHZhciBDbG9zaW5nUHJvbXAgPSBjbGFzcyBDbG9zaW5nUHJvbXAge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZTEsIHNlbGVjdGlvbnMpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmUxO1xuICAgIHRoaXMudGltZW91dCA9IG51bGw7XG4gICAgdGhpcy5fdHlwZWQgPSBudWxsO1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMubmJDaGFuZ2VzID0gMDtcbiAgICB0aGlzLnNlbGVjdGlvbnMgPSBuZXcgUG9zQ29sbGVjdGlvbihzZWxlY3Rpb25zKTtcbiAgfVxuXG4gIGJlZ2luKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgcmV0dXJuIG9wdGlvbmFsUHJvbWlzZSh0aGlzLmFkZENhcnJldHMoKSkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKSkge1xuICAgICAgICB0aGlzLnByb3h5T25DaGFuZ2UgPSAoY2ggPSBudWxsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25DaGFuZ2UoY2gpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkucmVzdWx0KCk7XG4gIH1cblxuICBhZGRDYXJyZXRzKCkge1xuICAgIHRoaXMucmVwbGFjZW1lbnRzID0gdGhpcy5zZWxlY3Rpb25zLndyYXAodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgXCJcXG5cIiwgXCJcXG5cIiArIHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKS5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHAuY2FycmV0VG9TZWwoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHModGhpcy5yZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgaW52YWxpZFR5cGVkKCkge1xuICAgIHJldHVybiB0aGlzLl90eXBlZCA9IG51bGw7XG4gIH1cblxuICBvbkNoYW5nZShjaCA9IG51bGwpIHtcbiAgICB0aGlzLmludmFsaWRUeXBlZCgpO1xuICAgIGlmICh0aGlzLnNraXBFdmVudChjaCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5uYkNoYW5nZXMrKztcbiAgICBpZiAodGhpcy5zaG91bGRTdG9wKCkpIHtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYW5DbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bWUoKTtcbiAgICB9XG4gIH1cblxuICBza2lwRXZlbnQoY2gpIHtcbiAgICByZXR1cm4gKGNoICE9IG51bGwpICYmIGNoLmNoYXJDb2RlQXQoMCkgIT09IDMyO1xuICB9XG5cbiAgcmVzdW1lKCkge31cblxuICBcbiAgc2hvdWxkU3RvcCgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlZCgpID09PSBmYWxzZSB8fCB0aGlzLnR5cGVkKCkuaW5kZXhPZignICcpICE9PSAtMTtcbiAgfVxuXG4gIGNsZWFuQ2xvc2UoKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCBwb3MsIHJlcGwsIHJlcGxhY2VtZW50cywgcmVzLCBzZWwsIHNlbGVjdGlvbnMsIHN0YXJ0O1xuICAgIHJlcGxhY2VtZW50cyA9IFtdO1xuICAgIHNlbGVjdGlvbnMgPSB0aGlzLmdldFNlbGVjdGlvbnMoKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdO1xuICAgICAgaWYgKHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKSkge1xuICAgICAgICBzdGFydCA9IHNlbDtcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIChzdGFydCAhPSBudWxsKSkge1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXTtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChlbmQuaW5uZXJTdGFydCwgZW5kLmlubmVyRW5kLCByZXMpO1xuICAgICAgICByZXBsLnNlbGVjdGlvbnMgPSBbc3RhcnRdO1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKTtcbiAgICAgICAgc3RhcnQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9PT0gdGhpcykge1xuICAgICAgdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm94eU9uQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy50eXBlZCgpICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jYW5jZWxTZWxlY3Rpb25zKHRoaXMuZ2V0U2VsZWN0aW9ucygpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgY2FuY2VsU2VsZWN0aW9ucyhzZWxlY3Rpb25zKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCBwb3MsIHJlcGxhY2VtZW50cywgc2VsLCBzdGFydDtcbiAgICByZXBsYWNlbWVudHMgPSBbXTtcbiAgICBzdGFydCA9IG51bGw7XG4gICAgZm9yIChqID0gMCwgbGVuID0gc2VsZWN0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgc2VsID0gc2VsZWN0aW9uc1tqXTtcbiAgICAgIGlmIChwb3MgPSB0aGlzLndoaXRoaW5PcGVuQm91bmRzKHNlbCkpIHtcbiAgICAgICAgc3RhcnQgPSBwb3M7XG4gICAgICB9IGVsc2UgaWYgKChlbmQgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSAmJiAoc3RhcnQgIT0gbnVsbCkpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3IFJlcGxhY2VtZW50KHN0YXJ0LnN0YXJ0LCBlbmQuZW5kLCB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHN0YXJ0LmVuZCArIDEsIGVuZC5zdGFydCAtIDEpKS5zZWxlY3RDb250ZW50KCkpO1xuICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgdHlwZWQoKSB7XG4gICAgdmFyIGNwb3MsIGlubmVyRW5kLCBpbm5lclN0YXJ0O1xuICAgIGlmICh0aGlzLl90eXBlZCA9PSBudWxsKSB7XG4gICAgICBjcG9zID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCk7XG4gICAgICBpbm5lclN0YXJ0ID0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoO1xuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuZmluZFByZXZCcmFrZXQoY3Bvcy5zdGFydCkgPT09IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICYmICgoaW5uZXJFbmQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGlubmVyU3RhcnQpKSAhPSBudWxsKSAmJiBpbm5lckVuZCA+PSBjcG9zLmVuZCkge1xuICAgICAgICB0aGlzLl90eXBlZCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdHlwZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkO1xuICB9XG5cbiAgd2hpdGhpbk9wZW5Cb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHQ7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV07XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLnN0YXJ0UG9zQXQoaSk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB3aGl0aGluQ2xvc2VCb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHQ7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV07XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLmVuZFBvc0F0KGkpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGFydFBvc0F0KGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSkpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMsIHRoaXMuY29kZXdhdmUuYnJha2V0cyk7XG4gIH1cblxuICBlbmRQb3NBdChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAyKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLCB0aGlzLmNvZGV3YXZlLmJyYWtldHMpO1xuICB9XG5cbn07XG5cbmV4cG9ydCB2YXIgU2ltdWxhdGVkQ2xvc2luZ1Byb21wID0gY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wIHtcbiAgcmVzdW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNpbXVsYXRlVHlwZSgpO1xuICB9XG5cbiAgc2ltdWxhdGVUeXBlKCkge1xuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgoKSA9PiB7XG4gICAgICB2YXIgY3VyQ2xvc2UsIHJlcGwsIHRhcmdldFRleHQ7XG4gICAgICB0aGlzLmludmFsaWRUeXBlZCgpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgY3VyQ2xvc2UgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyh0aGlzLnJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdLmNvcHkoKS5hcHBseU9mZnNldCh0aGlzLnR5cGVkKCkubGVuZ3RoKSk7XG4gICAgICBpZiAoY3VyQ2xvc2UpIHtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChjdXJDbG9zZS5zdGFydCwgY3VyQ2xvc2UuZW5kLCB0YXJnZXRUZXh0KTtcbiAgICAgICAgaWYgKHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KCkpIHtcbiAgICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uVHlwZVNpbXVsYXRlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uVHlwZVNpbXVsYXRlZCgpO1xuICAgICAgfVxuICAgIH0pLCAyKTtcbiAgfVxuXG4gIHNraXBFdmVudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRTZWxlY3Rpb25zKCkge1xuICAgIHJldHVybiBbdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCksIHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0gKyB0aGlzLnR5cGVkKCkubGVuZ3RoXTtcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXh0LCByZWYsIHJlcGwsIHRhcmdldFBvcztcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSk7XG4gICAgICBuZXh0ID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldCh0YXJnZXRQb3MuaW5uZXJTdGFydCk7XG4gICAgICBpZiAobmV4dCAhPSBudWxsKSB7XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpO1xuICAgICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSkge1xuICAgICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG5cbkNsb3NpbmdQcm9tcC5uZXdGb3IgPSBmdW5jdGlvbihjb2Rld2F2ZSwgc2VsZWN0aW9ucykge1xuICBpZiAoY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFNpbXVsYXRlZENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucyk7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBDbWRGaW5kZXJcbiAgY29uc3RydWN0b3I6IChuYW1lcywgb3B0aW9ucykgLT5cbiAgICBpZiB0eXBlb2YgbmFtZXMgPT0gJ3N0cmluZydcbiAgICAgIG5hbWVzID0gW25hbWVzXVxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsXG4gICAgICBuYW1lc3BhY2VzOiBbXVxuICAgICAgcGFyZW50Q29udGV4dDogbnVsbFxuICAgICAgY29udGV4dDogbnVsbFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzXG4gICAgICBtdXN0RXhlY3V0ZTogdHJ1ZVxuICAgICAgdXNlRGV0ZWN0b3JzOiB0cnVlXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWVcbiAgICAgIGluc3RhbmNlOiBudWxsXG4gICAgICBjb2Rld2F2ZTogbnVsbFxuICAgIH1cbiAgICBAbmFtZXMgPSBuYW1lc1xuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoQGNvZGV3YXZlKVxuICAgIGlmIEBwYXJlbnRDb250ZXh0P1xuICAgICAgQGNvbnRleHQucGFyZW50ID0gQHBhcmVudENvbnRleHRcbiAgICBpZiBAbmFtZXNwYWNlcz9cbiAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMoQG5hbWVzcGFjZXMpXG4gIGZpbmQ6IC0+XG4gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAgIEBjbWQgPSBAZmluZEluKEByb290KVxuICAgIHJldHVybiBAY21kXG4jICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4jICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiMgICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4jICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzOiAtPlxuICAgIHBhdGhzID0ge31cbiAgICBmb3IgbmFtZSBpbiBAbmFtZXMgXG4gICAgICBbc3BhY2UscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgc3BhY2U/IGFuZCAhKHNwYWNlIGluIEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgICAgdW5sZXNzIHNwYWNlIG9mIHBhdGhzIFxuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpXG4gICAgcmV0dXJuIHBhdGhzXG4gIGFwcGx5U3BhY2VPbk5hbWVzOiAobmFtZXNwYWNlKSAtPlxuICAgIFtzcGFjZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSx0cnVlKVxuICAgIEBuYW1lcy5tYXAoIChuYW1lKSAtPlxuICAgICAgW2N1cl9zcGFjZSxjdXJfcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgY3VyX3NwYWNlPyBhbmQgY3VyX3NwYWNlID09IHNwYWNlXG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdFxuICAgICAgaWYgcmVzdD9cbiAgICAgICAgbmFtZSA9IHJlc3QgKyAnOicgKyBuYW1lXG4gICAgICByZXR1cm4gbmFtZVxuICAgIClcbiAgZ2V0RGlyZWN0TmFtZXM6IC0+XG4gICAgcmV0dXJuIChuIGZvciBuIGluIEBuYW1lcyB3aGVuIG4uaW5kZXhPZihcIjpcIikgPT0gLTEpXG4gIHRyaWdnZXJEZXRlY3RvcnM6IC0+XG4gICAgaWYgQHVzZURldGVjdG9ycyBcbiAgICAgIEB1c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcG9zaWJpbGl0aWVzID0gbmV3IENtZEZpbmRlcihAY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKVxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoXG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXVxuICAgICAgICBmb3IgZGV0ZWN0b3IgaW4gY21kLmRldGVjdG9ycyBcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcylcbiAgICAgICAgICBpZiByZXM/XG4gICAgICAgICAgICBAY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcylcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICAgICAgaSsrXG4gIGZpbmRJbjogKGNtZCxwYXRoID0gbnVsbCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIG51bGxcbiAgICBiZXN0ID0gQGJlc3RJblBvc2liaWxpdGllcyhAZmluZFBvc2liaWxpdGllcygpKVxuICAgIGlmIGJlc3Q/XG4gICAgICByZXR1cm4gYmVzdFxuICBmaW5kUG9zaWJpbGl0aWVzOiAtPlxuICAgIHVubGVzcyBAcm9vdD9cbiAgICAgIHJldHVybiBbXVxuICAgIEByb290LmluaXQoKVxuICAgIHBvc2liaWxpdGllcyA9IFtdXG4gICAgaWYgQGNvZGV3YXZlPy5pbkluc3RhbmNlPy5jbWQgPT0gQHJvb3RcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQoQGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKCdpbl9pbnN0YW5jZScpKVxuICAgIGZvciBzcGFjZSwgbmFtZXMgb2YgQGdldE5hbWVzV2l0aFBhdGhzKClcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQoQGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKHNwYWNlLCBuYW1lcykpXG4gICAgZm9yIG5zcGMgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICBbbnNwY05hbWUscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLHRydWUpXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KEBnZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChuc3BjTmFtZSwgQGFwcGx5U3BhY2VPbk5hbWVzKG5zcGMpKSlcbiAgICBmb3IgbmFtZSBpbiBAZ2V0RGlyZWN0TmFtZXMoKVxuICAgICAgZGlyZWN0ID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgICBpZiBAY21kSXNWYWxpZChkaXJlY3QpXG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdClcbiAgICBpZiBAdXNlRmFsbGJhY2tzXG4gICAgICBmYWxsYmFjayA9IEByb290LmdldENtZCgnZmFsbGJhY2snKVxuICAgICAgaWYgQGNtZElzVmFsaWQoZmFsbGJhY2spXG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGZhbGxiYWNrKVxuICAgIEBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXNcbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzXG4gIGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kOiAoY21kTmFtZSwgbmFtZXMgPSBAbmFtZXMpIC0+XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG4gICAgbmV4dHMgPSBAZ2V0Q21kRm9sbG93QWxpYXMoY21kTmFtZSlcbiAgICBmb3IgbmV4dCBpbiBuZXh0c1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKG5hbWVzLCB7cGFyZW50OiB0aGlzLCByb290OiBuZXh0fSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgIHBvc2liaWxpdGllc1xuICBnZXRDbWRGb2xsb3dBbGlhczogKG5hbWUpIC0+XG4gICAgY21kID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgaWYgY21kPyBcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5hbGlhc09mP1xuICAgICAgICByZXR1cm4gW2NtZCxjbWQuZ2V0QWxpYXNlZCgpXVxuICAgICAgcmV0dXJuIFtjbWRdXG4gICAgcmV0dXJuIFtjbWRdXG4gIGNtZElzVmFsaWQ6IChjbWQpIC0+XG4gICAgdW5sZXNzIGNtZD9cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIGNtZC5uYW1lICE9ICdmYWxsYmFjaycgJiYgY21kIGluIEBhbmNlc3RvcnMoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuICFAbXVzdEV4ZWN1dGUgb3IgQGNtZElzRXhlY3V0YWJsZShjbWQpXG4gIGFuY2VzdG9yczogLT5cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGNtZElzRXhlY3V0YWJsZTogKGNtZCkgLT5cbiAgICBuYW1lcyA9IEBnZXREaXJlY3ROYW1lcygpXG4gICAgaWYgbmFtZXMubGVuZ3RoID09IDFcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gIGNtZFNjb3JlOiAoY21kKSAtPlxuICAgIHNjb3JlID0gY21kLmRlcHRoXG4gICAgaWYgY21kLm5hbWUgPT0gJ2ZhbGxiYWNrJyBcbiAgICAgICAgc2NvcmUgLT0gMTAwMFxuICAgIHJldHVybiBzY29yZVxuICBiZXN0SW5Qb3NpYmlsaXRpZXM6IChwb3NzKSAtPlxuICAgIGlmIHBvc3MubGVuZ3RoID4gMFxuICAgICAgYmVzdCA9IG51bGxcbiAgICAgIGJlc3RTY29yZSA9IG51bGxcbiAgICAgIGZvciBwIGluIHBvc3NcbiAgICAgICAgc2NvcmUgPSBAY21kU2NvcmUocClcbiAgICAgICAgaWYgIWJlc3Q/IG9yIHNjb3JlID49IGJlc3RTY29yZVxuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlXG4gICAgICAgICAgYmVzdCA9IHBcbiAgICAgIHJldHVybiBiZXN0OyIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBOYW1lc3BhY2VIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBDbWRGaW5kZXIgPSBjbGFzcyBDbWRGaW5kZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lcywgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXTtcbiAgICB9XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICBuYW1lc3BhY2VzOiBbXSxcbiAgICAgIHBhcmVudENvbnRleHQ6IG51bGwsXG4gICAgICBjb250ZXh0OiBudWxsLFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzLFxuICAgICAgbXVzdEV4ZWN1dGU6IHRydWUsXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWUsXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWUsXG4gICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfTtcbiAgICB0aGlzLm5hbWVzID0gbmFtZXM7XG4gICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2UgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcy5jb2Rld2F2ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmVudENvbnRleHQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMucGFyZW50Q29udGV4dDtcbiAgICB9XG4gICAgaWYgKHRoaXMubmFtZXNwYWNlcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyh0aGlzLm5hbWVzcGFjZXMpO1xuICAgIH1cbiAgfVxuXG4gIGZpbmQoKSB7XG4gICAgdGhpcy50cmlnZ2VyRGV0ZWN0b3JzKCk7XG4gICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRJbih0aGlzLnJvb3QpO1xuICAgIHJldHVybiB0aGlzLmNtZDtcbiAgfVxuXG4gIC8vICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4gIC8vICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiAgLy8gICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4gIC8vICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzKCkge1xuICAgIHZhciBqLCBsZW4sIG5hbWUsIHBhdGhzLCByZWYsIHJlc3QsIHNwYWNlO1xuICAgIHBhdGhzID0ge307XG4gICAgcmVmID0gdGhpcy5uYW1lcztcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5hbWUgPSByZWZbal07XG4gICAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG4gICAgICBpZiAoKHNwYWNlICE9IG51bGwpICYmICEoaW5kZXhPZi5jYWxsKHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHNwYWNlKSA+PSAwKSkge1xuICAgICAgICBpZiAoIShzcGFjZSBpbiBwYXRocykpIHtcbiAgICAgICAgICBwYXRoc1tzcGFjZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBwYXRoc1tzcGFjZV0ucHVzaChyZXN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGhzO1xuICB9XG5cbiAgYXBwbHlTcGFjZU9uTmFtZXMobmFtZXNwYWNlKSB7XG4gICAgdmFyIHJlc3QsIHNwYWNlO1xuICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lc3BhY2UsIHRydWUpO1xuICAgIHJldHVybiB0aGlzLm5hbWVzLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgY3VyX3Jlc3QsIGN1cl9zcGFjZTtcbiAgICAgIFtjdXJfc3BhY2UsIGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpO1xuICAgICAgaWYgKChjdXJfc3BhY2UgIT0gbnVsbCkgJiYgY3VyX3NwYWNlID09PSBzcGFjZSkge1xuICAgICAgICBuYW1lID0gY3VyX3Jlc3Q7XG4gICAgICB9XG4gICAgICBpZiAocmVzdCAhPSBudWxsKSB7XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RGlyZWN0TmFtZXMoKSB7XG4gICAgdmFyIG47XG4gICAgcmV0dXJuIChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgIHJlZiA9IHRoaXMubmFtZXM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgbiA9IHJlZltqXTtcbiAgICAgICAgaWYgKG4uaW5kZXhPZihcIjpcIikgPT09IC0xKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9KS5jYWxsKHRoaXMpO1xuICB9XG5cbiAgdHJpZ2dlckRldGVjdG9ycygpIHtcbiAgICB2YXIgY21kLCBkZXRlY3RvciwgaSwgaiwgbGVuLCBwb3NpYmlsaXRpZXMsIHJlZiwgcmVzLCByZXN1bHRzO1xuICAgIGlmICh0aGlzLnVzZURldGVjdG9ycykge1xuICAgICAgdGhpcy51c2VEZXRlY3RvcnMgPSBmYWxzZTtcbiAgICAgIHBvc2liaWxpdGllcyA9IG5ldyBDbWRGaW5kZXIodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpO1xuICAgICAgaSA9IDA7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICB3aGlsZSAoaSA8IHBvc2liaWxpdGllcy5sZW5ndGgpIHtcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldO1xuICAgICAgICByZWYgPSBjbWQuZGV0ZWN0b3JzO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICBkZXRlY3RvciA9IHJlZltqXTtcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcyk7XG4gICAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyhyZXMpO1xuICAgICAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKHJlcywge1xuICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0cy5wdXNoKGkrKyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICBmaW5kSW4oY21kLCBwYXRoID0gbnVsbCkge1xuICAgIHZhciBiZXN0O1xuICAgIGlmIChjbWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGJlc3QgPSB0aGlzLmJlc3RJblBvc2liaWxpdGllcyh0aGlzLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgaWYgKGJlc3QgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgfVxuICB9XG5cbiAgZmluZFBvc2liaWxpdGllcygpIHtcbiAgICB2YXIgZGlyZWN0LCBmYWxsYmFjaywgaiwgaywgbGVuLCBsZW4xLCBuYW1lLCBuYW1lcywgbnNwYywgbnNwY05hbWUsIHBvc2liaWxpdGllcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZXN0LCBzcGFjZTtcbiAgICBpZiAodGhpcy5yb290ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgdGhpcy5yb290LmluaXQoKTtcbiAgICBwb3NpYmlsaXRpZXMgPSBbXTtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gKHJlZjEgPSByZWYuaW5JbnN0YW5jZSkgIT0gbnVsbCA/IHJlZjEuY21kIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gdGhpcy5yb290KSB7XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoJ2luX2luc3RhbmNlJykpO1xuICAgIH1cbiAgICByZWYyID0gdGhpcy5nZXROYW1lc1dpdGhQYXRocygpO1xuICAgIGZvciAoc3BhY2UgaW4gcmVmMikge1xuICAgICAgbmFtZXMgPSByZWYyW3NwYWNlXTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChzcGFjZSwgbmFtZXMpKTtcbiAgICB9XG4gICAgcmVmMyA9IHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCk7XG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmMy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbnNwYyA9IHJlZjNbal07XG4gICAgICBbbnNwY05hbWUsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobnNwYywgdHJ1ZSk7XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQobnNwY05hbWUsIHRoaXMuYXBwbHlTcGFjZU9uTmFtZXMobnNwYykpKTtcbiAgICB9XG4gICAgcmVmNCA9IHRoaXMuZ2V0RGlyZWN0TmFtZXMoKTtcbiAgICBmb3IgKGsgPSAwLCBsZW4xID0gcmVmNC5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgIG5hbWUgPSByZWY0W2tdO1xuICAgICAgZGlyZWN0ID0gdGhpcy5yb290LmdldENtZChuYW1lKTtcbiAgICAgIGlmICh0aGlzLmNtZElzVmFsaWQoZGlyZWN0KSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy51c2VGYWxsYmFja3MpIHtcbiAgICAgIGZhbGxiYWNrID0gdGhpcy5yb290LmdldENtZCgnZmFsbGJhY2snKTtcbiAgICAgIGlmICh0aGlzLmNtZElzVmFsaWQoZmFsbGJhY2spKSB7XG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGZhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXM7XG4gICAgcmV0dXJuIHBvc2liaWxpdGllcztcbiAgfVxuXG4gIGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKGNtZE5hbWUsIG5hbWVzID0gdGhpcy5uYW1lcykge1xuICAgIHZhciBqLCBsZW4sIG5leHQsIG5leHRzLCBwb3NpYmlsaXRpZXM7XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG4gICAgbmV4dHMgPSB0aGlzLmdldENtZEZvbGxvd0FsaWFzKGNtZE5hbWUpO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IG5leHRzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuZXh0ID0gbmV4dHNbal07XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtcbiAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICByb290OiBuZXh0XG4gICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgIH1cbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzO1xuICB9XG5cbiAgZ2V0Q21kRm9sbG93QWxpYXMobmFtZSkge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gdGhpcy5yb290LmdldENtZChuYW1lKTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gW2NtZCwgY21kLmdldEFsaWFzZWQoKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gW2NtZF07XG4gICAgfVxuICAgIHJldHVybiBbY21kXTtcbiAgfVxuXG4gIGNtZElzVmFsaWQoY21kKSB7XG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChjbWQubmFtZSAhPT0gJ2ZhbGxiYWNrJyAmJiBpbmRleE9mLmNhbGwodGhpcy5hbmNlc3RvcnMoKSwgY21kKSA+PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAhdGhpcy5tdXN0RXhlY3V0ZSB8fCB0aGlzLmNtZElzRXhlY3V0YWJsZShjbWQpO1xuICB9XG5cbiAgYW5jZXN0b3JzKCkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdGhpcy5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY21kSXNFeGVjdXRhYmxlKGNtZCkge1xuICAgIHZhciBuYW1lcztcbiAgICBuYW1lcyA9IHRoaXMuZ2V0RGlyZWN0TmFtZXMoKTtcbiAgICBpZiAobmFtZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGVXaXRoTmFtZShuYW1lc1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNtZFNjb3JlKGNtZCkge1xuICAgIHZhciBzY29yZTtcbiAgICBzY29yZSA9IGNtZC5kZXB0aDtcbiAgICBpZiAoY21kLm5hbWUgPT09ICdmYWxsYmFjaycpIHtcbiAgICAgIHNjb3JlIC09IDEwMDA7XG4gICAgfVxuICAgIHJldHVybiBzY29yZTtcbiAgfVxuXG4gIGJlc3RJblBvc2liaWxpdGllcyhwb3NzKSB7XG4gICAgdmFyIGJlc3QsIGJlc3RTY29yZSwgaiwgbGVuLCBwLCBzY29yZTtcbiAgICBpZiAocG9zcy5sZW5ndGggPiAwKSB7XG4gICAgICBiZXN0ID0gbnVsbDtcbiAgICAgIGJlc3RTY29yZSA9IG51bGw7XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBwb3NzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSBwb3NzW2pdO1xuICAgICAgICBzY29yZSA9IHRoaXMuY21kU2NvcmUocCk7XG4gICAgICAgIGlmICgoYmVzdCA9PSBudWxsKSB8fCBzY29yZSA+PSBiZXN0U2NvcmUpIHtcbiAgICAgICAgICBiZXN0U2NvcmUgPSBzY29yZTtcbiAgICAgICAgICBiZXN0ID0gcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5pbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY21kLEBjb250ZXh0KSAtPlxuICBcbiAgaW5pdDogLT5cbiAgICB1bmxlc3MgQGlzRW1wdHkoKSBvciBAaW5pdGVkXG4gICAgICBAaW5pdGVkID0gdHJ1ZVxuICAgICAgQF9nZXRDbWRPYmooKVxuICAgICAgQF9pbml0UGFyYW1zKClcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIEBjbWRPYmouaW5pdCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgc2V0UGFyYW06KG5hbWUsdmFsKS0+XG4gICAgQG5hbWVkW25hbWVdID0gdmFsXG4gIHB1c2hQYXJhbToodmFsKS0+XG4gICAgQHBhcmFtcy5wdXNoKHZhbClcbiAgZ2V0Q29udGV4dDogLT5cbiAgICB1bmxlc3MgQGNvbnRleHQ/XG4gICAgICBAY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICByZXR1cm4gQGNvbnRleHQgb3IgbmV3IENvbnRleHQoKVxuICBnZXRGaW5kZXI6IChjbWROYW1lKS0+XG4gICAgZmluZGVyID0gQGdldENvbnRleHQoKS5nZXRGaW5kZXIoY21kTmFtZSxuYW1lc3BhY2VzOkBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRDbWRPYmo6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIEBjbWQuaW5pdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5jbHM/XG4gICAgICAgIEBjbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKVxuICAgICAgICByZXR1cm4gQGNtZE9ialxuICBfaW5pdFBhcmFtczogLT5cbiAgICBAbmFtZWQgPSBAZ2V0RGVmYXVsdHMoKVxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICByZXR1cm4gW11cbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQGNtZD9cbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIHJldHVybiBAY21kLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJlcyA9IHt9XG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGNtZC5kZWZhdWx0cylcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBjbWRPYmouZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJldHVybiByZXNcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIHJldHVybiBAYWxpYXNlZENtZCBvciBudWxsXG4gIGdldEFsaWFzZWRGaW5hbDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGFsaWFzZWRGaW5hbENtZD9cbiAgICAgICAgcmV0dXJuIEBhbGlhc2VkRmluYWxDbWQgb3IgbnVsbFxuICAgICAgaWYgQGNtZC5hbGlhc09mP1xuICAgICAgICBhbGlhc2VkID0gQGNtZFxuICAgICAgICB3aGlsZSBhbGlhc2VkPyBhbmQgYWxpYXNlZC5hbGlhc09mP1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcihAZ2V0RmluZGVyKEBhbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG4gICAgICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICAgICAgQGFsaWFzZWRDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIEBhbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIHJldHVybiBhbGlhc2VkXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBhbGlhc09mXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPcHRpb25zP1xuICAgICAgICByZXR1cm4gQGNtZE9wdGlvbnNcbiAgICAgIG9wdCA9IEBjbWQuX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxAY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIEBjbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIG9wdGlvbnM/IGFuZCBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBnZXRQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIG5hbWVzID0gW25hbWVzXSBpZiAodHlwZW9mIG5hbWVzIGluIFsnc3RyaW5nJywnbnVtYmVyJ10pXG4gICAgZm9yIG4gaW4gbmFtZXNcbiAgICAgIHJldHVybiBAbmFtZWRbbl0gaWYgQG5hbWVkW25dP1xuICAgICAgcmV0dXJuIEBwYXJhbXNbbl0gaWYgQHBhcmFtc1tuXT9cbiAgICByZXR1cm4gZGVmVmFsXG4gIGdldEJvb2xQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIGZhbHNlVmFscyA9IFtcIlwiLFwiMFwiLFwiZmFsc2VcIixcIm5vXCIsXCJub25lXCIsZmFsc2UsbnVsbCwwXVxuICAgIHZhbCA9IEBnZXRQYXJhbShuYW1lcywgZGVmVmFsKVxuICAgICFmYWxzZVZhbHMuaW5jbHVkZXModmFsKVxuICBhbmNlc3RvckNtZHM6IC0+XG4gICAgaWYgQGNvbnRleHQuY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvbnRleHQuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICByZXR1cm4gW11cbiAgYW5jZXN0b3JDbWRzQW5kU2VsZjogLT5cbiAgICByZXR1cm4gQGFuY2VzdG9yQ21kcygpLmNvbmNhdChbQGNtZF0pXG4gIHJ1bkV4ZWN1dGVGdW5jdDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmV0dXJuIEBjbWRPYmouZXhlY3V0ZSgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZEZpbmFsKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmV4ZWN1dGVGdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlRnVuY3QodGhpcylcbiAgcmF3UmVzdWx0OiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5yZXN1bHQoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWRGaW5hbCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5yZXN1bHRGdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRGdW5jdCh0aGlzKVxuICAgICAgaWYgY21kLnJlc3VsdFN0cj9cbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRTdHJcbiAgcmVzdWx0OiAtPiBcbiAgICBAaW5pdCgpXG4gICAgaWYgQHJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIGlmIChyZXMgPSBAcmF3UmVzdWx0KCkpP1xuICAgICAgICByZXMgPSBAZm9ybWF0SW5kZW50KHJlcylcbiAgICAgICAgaWYgcmVzLmxlbmd0aCA+IDAgYW5kIEBnZXRPcHRpb24oJ3BhcnNlJyx0aGlzKSBcbiAgICAgICAgICBwYXJzZXIgPSBAZ2V0UGFyc2VyRm9yVGV4dChyZXMpXG4gICAgICAgICAgcmVzID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgICAgaWYgYWx0ZXJGdW5jdCA9IEBnZXRPcHRpb24oJ2FsdGVyUmVzdWx0Jyx0aGlzKVxuICAgICAgICAgIHJlcyA9IGFsdGVyRnVuY3QocmVzLHRoaXMpXG4gICAgICAgIHJldHVybiByZXNcbiAgZ2V0UGFyc2VyRm9yVGV4dDogKHR4dD0nJykgLT5cbiAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIodHh0KSwge2luSW5zdGFuY2U6dGhpc30pXG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2VcbiAgICByZXR1cm4gcGFyc2VyXG4gIGdldEluZGVudDogLT5cbiAgICByZXR1cm4gMFxuICBmb3JtYXRJbmRlbnQ6ICh0ZXh0KSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywnICAnKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gIGFwcGx5SW5kZW50OiAodGV4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmluZGVudE5vdEZpcnN0KHRleHQsQGdldEluZGVudCgpLFwiIFwiKSIsImltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgQ29kZXdhdmVcbn0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5cbmltcG9ydCB7XG4gIFRleHRQYXJzZXJcbn0gZnJvbSAnLi9UZXh0UGFyc2VyJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgdmFyIENtZEluc3RhbmNlID0gY2xhc3MgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3RvcihjbWQxLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jbWQgPSBjbWQxO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICghKHRoaXMuaXNFbXB0eSgpIHx8IHRoaXMuaW5pdGVkKSkge1xuICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZ2V0Q21kT2JqKCk7XG4gICAgICB0aGlzLl9pbml0UGFyYW1zKCk7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNtZE9iai5pbml0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0UGFyYW0obmFtZSwgdmFsKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSB2YWw7XG4gIH1cblxuICBwdXNoUGFyYW0odmFsKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnB1c2godmFsKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IG5ldyBDb250ZXh0KCk7XG4gIH1cblxuICBnZXRGaW5kZXIoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXI7XG4gICAgZmluZGVyID0gdGhpcy5nZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pO1xuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXM7XG4gICAgcmV0dXJuIGZpbmRlcjtcbiAgfVxuXG4gIF9nZXRDbWRPYmooKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jbWQuaW5pdCgpO1xuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5jbHMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNtZE9iaiA9IG5ldyBjbWQuY2xzKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmo7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2luaXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWQgPSB0aGlzLmdldERlZmF1bHRzKCk7XG4gIH1cblxuICBfZ2V0UGFyZW50TmFtZXNwYWNlcygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLmNtZCAhPSBudWxsO1xuICB9XG5cbiAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgdmFyIGFsaWFzZWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jbWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgdmFyIGFsaWFzZWQsIHJlcztcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgcmVzID0ge307XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCBhbGlhc2VkLmdldERlZmF1bHRzKCkpO1xuICAgICAgfVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kLmRlZmF1bHRzKTtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZE9iai5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZCgpIHtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5hbGlhc2VkQ21kIHx8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZEZpbmFsKCkge1xuICAgIHZhciBhbGlhc2VkO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkRmluYWxDbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGlhc2VkRmluYWxDbWQgfHwgbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgYWxpYXNlZCA9IHRoaXMuY21kO1xuICAgICAgICB3aGlsZSAoKGFsaWFzZWQgIT0gbnVsbCkgJiYgKGFsaWFzZWQuYWxpYXNPZiAhPSBudWxsKSkge1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcih0aGlzLmdldEZpbmRlcih0aGlzLmFsdGVyQWxpYXNPZihhbGlhc2VkLmFsaWFzT2YpKSk7XG4gICAgICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmFsaWFzZWRDbWQgPSBhbGlhc2VkIHx8IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgfHwgZmFsc2U7XG4gICAgICAgIHJldHVybiBhbGlhc2VkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFsdGVyQWxpYXNPZihhbGlhc09mKSB7XG4gICAgcmV0dXJuIGFsaWFzT2Y7XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHZhciBvcHQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPcHRpb25zO1xuICAgICAgfVxuICAgICAgb3B0ID0gdGhpcy5jbWQuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKTtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmNtZE9iai5nZXRPcHRpb25zKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbWRPcHRpb25zID0gb3B0O1xuICAgICAgcmV0dXJuIG9wdDtcbiAgICB9XG4gIH1cblxuICBnZXRPcHRpb24oa2V5KSB7XG4gICAgdmFyIG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIGlmICgob3B0aW9ucyAhPSBudWxsKSAmJiBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICBnZXRQYXJhbShuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBpLCBsZW4sIG4sIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0eXBlb2YgbmFtZXMpID09PSAnc3RyaW5nJyB8fCByZWYgPT09ICdudW1iZXInKSkge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbiA9IG5hbWVzW2ldO1xuICAgICAgaWYgKHRoaXMubmFtZWRbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lZFtuXTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBhcmFtc1tuXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtc1tuXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlZlZhbDtcbiAgfVxuXG4gIGdldEJvb2xQYXJhbShuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBmYWxzZVZhbHMsIHZhbDtcbiAgICBmYWxzZVZhbHMgPSBbXCJcIiwgXCIwXCIsIFwiZmFsc2VcIiwgXCJub1wiLCBcIm5vbmVcIiwgZmFsc2UsIG51bGwsIDBdO1xuICAgIHZhbCA9IHRoaXMuZ2V0UGFyYW0obmFtZXMsIGRlZlZhbCk7XG4gICAgcmV0dXJuICFmYWxzZVZhbHMuaW5jbHVkZXModmFsKTtcbiAgfVxuXG4gIGFuY2VzdG9yQ21kcygpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBhbmNlc3RvckNtZHNBbmRTZWxmKCkge1xuICAgIHJldHVybiB0aGlzLmFuY2VzdG9yQ21kcygpLmNvbmNhdChbdGhpcy5jbWRdKTtcbiAgfVxuXG4gIHJ1bkV4ZWN1dGVGdW5jdCgpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmouZXhlY3V0ZSgpO1xuICAgICAgfVxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmV4ZWN1dGVGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZUZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJhd1Jlc3VsdCgpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0KCk7XG4gICAgICB9XG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQucmVzdWx0RnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKGNtZC5yZXN1bHRTdHIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0cjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdmFyIGFsdGVyRnVuY3QsIHBhcnNlciwgcmVzO1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgIGlmICgocmVzID0gdGhpcy5yYXdSZXN1bHQoKSkgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSB0aGlzLmZvcm1hdEluZGVudChyZXMpO1xuICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDAgJiYgdGhpcy5nZXRPcHRpb24oJ3BhcnNlJywgdGhpcykpIHtcbiAgICAgICAgICBwYXJzZXIgPSB0aGlzLmdldFBhcnNlckZvclRleHQocmVzKTtcbiAgICAgICAgICByZXMgPSBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWx0ZXJGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdhbHRlclJlc3VsdCcsIHRoaXMpKSB7XG4gICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyc2VyRm9yVGV4dCh0eHQgPSAnJykge1xuICAgIHZhciBwYXJzZXI7XG4gICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKHR4dCksIHtcbiAgICAgIGluSW5zdGFuY2U6IHRoaXNcbiAgICB9KTtcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICByZXR1cm4gcGFyc2VyO1xuICB9XG5cbiAgZ2V0SW5kZW50KCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZm9ybWF0SW5kZW50KHRleHQpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywgJyAgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5SW5kZW50KHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmluZGVudE5vdEZpcnN0KHRleHQsIHRoaXMuZ2V0SW5kZW50KCksIFwiIFwiKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUHJvY2VzcyB9IGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSB9IGZyb20gJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcic7XG5pbXBvcnQgeyBQb3NDb2xsZWN0aW9uIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQ2xvc2luZ1Byb21wIH0gZnJvbSAnLi9DbG9zaW5nUHJvbXAnO1xuXG5leHBvcnQgY2xhc3MgQ29kZXdhdmVcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBvcHRpb25zID0ge30pIC0+XG4gICAgQ29kZXdhdmUuaW5pdCgpXG4gICAgQG1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nXG4gICAgQHZhcnMgPSB7fVxuICAgIFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ2JyYWtldHMnIDogJ35+JyxcbiAgICAgICdkZWNvJyA6ICd+JyxcbiAgICAgICdjbG9zZUNoYXInIDogJy8nLFxuICAgICAgJ25vRXhlY3V0ZUNoYXInIDogJyEnLFxuICAgICAgJ2NhcnJldENoYXInIDogJ3wnLFxuICAgICAgJ2NoZWNrQ2FycmV0JyA6IHRydWUsXG4gICAgICAnaW5JbnN0YW5jZScgOiBudWxsXG4gICAgfVxuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIFxuICAgIEBuZXN0ZWQgPSBpZiBAcGFyZW50PyB0aGVuIEBwYXJlbnQubmVzdGVkKzEgZWxzZSAwXG4gICAgXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgQGVkaXRvci5iaW5kZWRUbyh0aGlzKSBpZiBAZWRpdG9yP1xuICAgIFxuICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQodGhpcylcbiAgICBpZiBAaW5JbnN0YW5jZT9cbiAgICAgIEBjb250ZXh0LnBhcmVudCA9IEBpbkluc3RhbmNlLmNvbnRleHRcblxuICAgIEBsb2dnZXIgPSBuZXcgTG9nZ2VyKClcblxuICBvbkFjdGl2YXRpb25LZXk6IC0+XG4gICAgQHByb2Nlc3MgPSBuZXcgUHJvY2VzcygpXG4gICAgQGxvZ2dlci5sb2coJ2FjdGl2YXRpb24ga2V5JylcbiAgICBAcnVuQXRDdXJzb3JQb3MoKS50aGVuID0+XG4gICAgICBAcHJvY2VzcyA9IG51bGxcbiAgcnVuQXRDdXJzb3JQb3M6IC0+XG4gICAgaWYgQGVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICAgIEBydW5BdE11bHRpUG9zKEBlZGl0b3IuZ2V0TXVsdGlTZWwoKSlcbiAgICBlbHNlXG4gICAgICBAcnVuQXRQb3MoQGVkaXRvci5nZXRDdXJzb3JQb3MoKSlcbiAgcnVuQXRQb3M6IChwb3MpLT5cbiAgICBAcnVuQXRNdWx0aVBvcyhbcG9zXSlcbiAgcnVuQXRNdWx0aVBvczogKG11bHRpUG9zKS0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMFxuICAgICAgICBjbWQgPSBAY29tbWFuZE9uUG9zKG11bHRpUG9zWzBdLmVuZClcbiAgICAgICAgaWYgY21kP1xuICAgICAgICAgIGlmIG11bHRpUG9zLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcylcbiAgICAgICAgICBjbWQuaW5pdCgpXG4gICAgICAgICAgQGxvZ2dlci5sb2coY21kKVxuICAgICAgICAgIGNtZC5leGVjdXRlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIG11bHRpUG9zWzBdLnN0YXJ0ID09IG11bHRpUG9zWzBdLmVuZFxuICAgICAgICAgICAgQGFkZEJyYWtldHMobXVsdGlQb3MpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHByb21wdENsb3NpbmdDbWQobXVsdGlQb3MpXG4gIGNvbW1hbmRPblBvczogKHBvcykgLT5cbiAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGZvbGxvd2VkQnlCcmFrZXRzKHBvcykgYW5kIEBjb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT0gMSBcbiAgICAgIHByZXYgPSBwb3MtQGJyYWtldHMubGVuZ3RoXG4gICAgICBuZXh0ID0gcG9zXG4gICAgZWxzZVxuICAgICAgaWYgQHByZWNlZGVkQnlCcmFrZXRzKHBvcykgYW5kIEBjb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT0gMFxuICAgICAgICBwb3MgLT0gQGJyYWtldHMubGVuZ3RoXG4gICAgICBwcmV2ID0gQGZpbmRQcmV2QnJha2V0KHBvcylcbiAgICAgIHVubGVzcyBwcmV2P1xuICAgICAgICByZXR1cm4gbnVsbCBcbiAgICAgIG5leHQgPSBAZmluZE5leHRCcmFrZXQocG9zLTEpXG4gICAgICBpZiAhbmV4dD8gb3IgQGNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT0gMCBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLHByZXYsQGVkaXRvci50ZXh0U3Vic3RyKHByZXYsbmV4dCtAYnJha2V0cy5sZW5ndGgpKVxuICBuZXh0Q21kOiAoc3RhcnQgPSAwKSAtPlxuICAgIHBvcyA9IHN0YXJ0XG4gICAgd2hpbGUgZiA9IEBmaW5kQW55TmV4dChwb3MgLFtAYnJha2V0cyxcIlxcblwiXSlcbiAgICAgIHBvcyA9IGYucG9zICsgZi5zdHIubGVuZ3RoXG4gICAgICBpZiBmLnN0ciA9PSBAYnJha2V0c1xuICAgICAgICBpZiBiZWdpbm5pbmc/XG4gICAgICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgYmVnaW5uaW5nLCBAZWRpdG9yLnRleHRTdWJzdHIoYmVnaW5uaW5nLCBmLnBvcytAYnJha2V0cy5sZW5ndGgpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYmVnaW5uaW5nID0gZi5wb3NcbiAgICAgIGVsc2VcbiAgICAgICAgYmVnaW5uaW5nID0gbnVsbFxuICAgIG51bGxcbiAgZ2V0RW5jbG9zaW5nQ21kOiAocG9zID0gMCkgLT5cbiAgICBjcG9zID0gcG9zXG4gICAgY2xvc2luZ1ByZWZpeCA9IEBicmFrZXRzICsgQGNsb3NlQ2hhclxuICAgIHdoaWxlIChwID0gQGZpbmROZXh0KGNwb3MsY2xvc2luZ1ByZWZpeCkpP1xuICAgICAgaWYgY21kID0gQGNvbW1hbmRPblBvcyhwK2Nsb3NpbmdQcmVmaXgubGVuZ3RoKVxuICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpXG4gICAgICAgIGlmIGNtZC5wb3MgPCBwb3NcbiAgICAgICAgICByZXR1cm4gY21kXG4gICAgICBlbHNlXG4gICAgICAgIGNwb3MgPSBwK2Nsb3NpbmdQcmVmaXgubGVuZ3RoXG4gICAgbnVsbFxuICBwcmVjZWRlZEJ5QnJha2V0czogKHBvcykgLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcy1AYnJha2V0cy5sZW5ndGgscG9zKSA9PSBAYnJha2V0c1xuICBmb2xsb3dlZEJ5QnJha2V0czogKHBvcykgLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrQGJyYWtldHMubGVuZ3RoKSA9PSBAYnJha2V0c1xuICBjb3VudFByZXZCcmFrZXQ6IChzdGFydCkgLT4gXG4gICAgaSA9IDBcbiAgICB3aGlsZSAoc3RhcnQgPSBAZmluZFByZXZCcmFrZXQoc3RhcnQpKT9cbiAgICAgIGkrK1xuICAgIHJldHVybiBpXG4gIGlzRW5kTGluZTogKHBvcykgLT4gXG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dFN1YnN0cihwb3MscG9zKzEpID09IFwiXFxuXCIgb3IgcG9zICsgMSA+PSBAZWRpdG9yLnRleHRMZW4oKVxuICBmaW5kUHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICByZXR1cm4gQGZpbmROZXh0QnJha2V0KHN0YXJ0LC0xKVxuICBmaW5kTmV4dEJyYWtldDogKHN0YXJ0LGRpcmVjdGlvbiA9IDEpIC0+IFxuICAgIGYgPSBAZmluZEFueU5leHQoc3RhcnQgLFtAYnJha2V0cyxcIlxcblwiXSwgZGlyZWN0aW9uKVxuICAgIFxuICAgIGYucG9zIGlmIGYgYW5kIGYuc3RyID09IEBicmFrZXRzXG4gIGZpbmRQcmV2OiAoc3RhcnQsc3RyaW5nKSAtPiBcbiAgICByZXR1cm4gQGZpbmROZXh0KHN0YXJ0LHN0cmluZywtMSlcbiAgZmluZE5leHQ6IChzdGFydCxzdHJpbmcsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW3N0cmluZ10sIGRpcmVjdGlvbilcbiAgICBmLnBvcyBpZiBmXG4gIFxuICBmaW5kQW55TmV4dDogKHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgcmV0dXJuIEBlZGl0b3IuZmluZEFueU5leHQoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24pXG4gICAgXG4gIGZpbmRNYXRjaGluZ1BhaXI6IChzdGFydFBvcyxvcGVuaW5nLGNsb3NpbmcsZGlyZWN0aW9uID0gMSkgLT5cbiAgICBwb3MgPSBzdGFydFBvc1xuICAgIG5lc3RlZCA9IDBcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyxbY2xvc2luZyxvcGVuaW5nXSxkaXJlY3Rpb24pXG4gICAgICBwb3MgPSBmLnBvcyArIChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gZi5zdHIubGVuZ3RoIGVsc2UgMClcbiAgICAgIGlmIGYuc3RyID09IChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gY2xvc2luZyBlbHNlIG9wZW5pbmcpXG4gICAgICAgIGlmIG5lc3RlZCA+IDBcbiAgICAgICAgICBuZXN0ZWQtLVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGZcbiAgICAgIGVsc2VcbiAgICAgICAgbmVzdGVkKytcbiAgICBudWxsXG4gIGFkZEJyYWtldHM6IChwb3MpIC0+XG4gICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKVxuICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKEBicmFrZXRzLEBicmFrZXRzKS5tYXAoIChyKS0+ci5zZWxlY3RDb250ZW50KCkgKVxuICAgIEBlZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICBwcm9tcHRDbG9zaW5nQ21kOiAoc2VsZWN0aW9ucykgLT5cbiAgICBAY2xvc2luZ1Byb21wLnN0b3AoKSBpZiBAY2xvc2luZ1Byb21wP1xuICAgIEBjbG9zaW5nUHJvbXAgPSBDbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsc2VsZWN0aW9ucykuYmVnaW4oKVxuICBwYXJzZUFsbDogKHJlY3Vyc2l2ZSA9IHRydWUpIC0+XG4gICAgaWYgQG5lc3RlZCA+IDEwMFxuICAgICAgdGhyb3cgXCJJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvblwiXG4gICAgcG9zID0gMFxuICAgIHdoaWxlIGNtZCA9IEBuZXh0Q21kKHBvcylcbiAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKVxuICAgICAgQGVkaXRvci5zZXRDdXJzb3JQb3MocG9zKVxuICAgICAgIyBjb25zb2xlLmxvZyhjbWQpXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiByZWN1cnNpdmUgYW5kIGNtZC5jb250ZW50PyBhbmQgKCFjbWQuZ2V0Q21kKCk/IG9yICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSlcbiAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge3BhcmVudDogdGhpc30pXG4gICAgICAgIGNtZC5jb250ZW50ID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIHJlcyA9ICBjbWQuZXhlY3V0ZSgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGlmIHJlcy50aGVuP1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN5bmMgbmVzdGVkIGNvbW1hbmRzIGFyZSBub3Qgc3VwcG9ydGVkJylcbiAgICAgICAgaWYgY21kLnJlcGxhY2VFbmQ/XG4gICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBvcyA9IEBlZGl0b3IuZ2V0Q3Vyc29yUG9zKCkuZW5kXG4gICAgcmV0dXJuIEBnZXRUZXh0KClcbiAgZ2V0VGV4dDogLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0KClcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD8gYW5kICghQGluSW5zdGFuY2U/IG9yICFAaW5JbnN0YW5jZS5maW5kZXI/KVxuICBnZXRSb290OiAtPlxuICAgIGlmIEBpc1Jvb3QoKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICBlbHNlIGlmIEBwYXJlbnQ/XG4gICAgICByZXR1cm4gQHBhcmVudC5nZXRSb290KClcbiAgICBlbHNlIGlmIEBpbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBpbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICByZW1vdmVDYXJyZXQ6ICh0eHQpIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodHh0LEBjYXJyZXRDaGFyKVxuICBnZXRDYXJyZXRQb3M6ICh0eHQpIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRDYXJyZXRQb3ModHh0LEBjYXJyZXRDaGFyKVxuICByZWdNYXJrZXI6IChmbGFncz1cImdcIikgLT5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBtYXJrZXIpLCBmbGFncylcbiAgcmVtb3ZlTWFya2VyczogKHRleHQpIC0+XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZShAcmVnTWFya2VyKCksJycpXG5cbiAgQGluaXQ6IC0+XG4gICAgdW5sZXNzIEBpbml0ZWRcbiAgICAgIEBpbml0ZWQgPSB0cnVlXG4gICAgICBDb21tYW5kLmluaXRDbWRzKClcbiAgICAgIENvbW1hbmQubG9hZENtZHMoKVxuXG4gIEBpbml0ZWQ6IGZhbHNlIiwiaW1wb3J0IHtcbiAgUHJvY2Vzc1xufSBmcm9tICcuL1Byb2Nlc3MnO1xuXG5pbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIFBvc2l0aW9uZWRDbWRJbnN0YW5jZVxufSBmcm9tICcuL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZSc7XG5cbmltcG9ydCB7XG4gIFRleHRQYXJzZXJcbn0gZnJvbSAnLi9UZXh0UGFyc2VyJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBMb2dnZXJcbn0gZnJvbSAnLi9Mb2dnZXInO1xuXG5pbXBvcnQge1xuICBQb3NDb2xsZWN0aW9uXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQ2xvc2luZ1Byb21wXG59IGZyb20gJy4vQ2xvc2luZ1Byb21wJztcblxuZXhwb3J0IHZhciBDb2Rld2F2ZSA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgQ29kZXdhdmUge1xuICAgIGNvbnN0cnVjdG9yKGVkaXRvciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsO1xuICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gICAgICBDb2Rld2F2ZS5pbml0KCk7XG4gICAgICB0aGlzLm1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nO1xuICAgICAgdGhpcy52YXJzID0ge307XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgJ2JyYWtldHMnOiAnfn4nLFxuICAgICAgICAnZGVjbyc6ICd+JyxcbiAgICAgICAgJ2Nsb3NlQ2hhcic6ICcvJyxcbiAgICAgICAgJ25vRXhlY3V0ZUNoYXInOiAnIScsXG4gICAgICAgICdjYXJyZXRDaGFyJzogJ3wnLFxuICAgICAgICAnY2hlY2tDYXJyZXQnOiB0cnVlLFxuICAgICAgICAnaW5JbnN0YW5jZSc6IG51bGxcbiAgICAgIH07XG4gICAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddO1xuICAgICAgdGhpcy5uZXN0ZWQgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQubmVzdGVkICsgMSA6IDA7XG4gICAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAoKHRoaXMucGFyZW50ICE9IG51bGwpICYmIGtleSAhPT0gJ3BhcmVudCcpIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSB0aGlzLnBhcmVudFtrZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWRpdG9yICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5lZGl0b3IuYmluZGVkVG8odGhpcyk7XG4gICAgICB9XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzKTtcbiAgICAgIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5pbkluc3RhbmNlLmNvbnRleHQ7XG4gICAgICB9XG4gICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcbiAgICB9XG5cbiAgICBvbkFjdGl2YXRpb25LZXkoKSB7XG4gICAgICB0aGlzLnByb2Nlc3MgPSBuZXcgUHJvY2VzcygpO1xuICAgICAgdGhpcy5sb2dnZXIubG9nKCdhY3RpdmF0aW9uIGtleScpO1xuICAgICAgcmV0dXJuIHRoaXMucnVuQXRDdXJzb3JQb3MoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2VzcyA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBydW5BdEN1cnNvclBvcygpIHtcbiAgICAgIGlmICh0aGlzLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuQXRNdWx0aVBvcyh0aGlzLmVkaXRvci5nZXRNdWx0aVNlbCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkF0UG9zKHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBydW5BdFBvcyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bkF0TXVsdGlQb3MoW3Bvc10pO1xuICAgIH1cblxuICAgIHJ1bkF0TXVsdGlQb3MobXVsdGlQb3MpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIGNtZDtcbiAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpO1xuICAgICAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgY21kLnNldE11bHRpUG9zKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNtZC5pbml0KCk7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coY21kKTtcbiAgICAgICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobXVsdGlQb3NbMF0uc3RhcnQgPT09IG11bHRpUG9zWzBdLmVuZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGRCcmFrZXRzKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21wdENsb3NpbmdDbWQobXVsdGlQb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29tbWFuZE9uUG9zKHBvcykge1xuICAgICAgdmFyIG5leHQsIHByZXY7XG4gICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuZm9sbG93ZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMSkge1xuICAgICAgICBwcmV2ID0gcG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgbmV4dCA9IHBvcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnByZWNlZGVkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDApIHtcbiAgICAgICAgICBwb3MgLT0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2ID0gdGhpcy5maW5kUHJldkJyYWtldChwb3MpO1xuICAgICAgICBpZiAocHJldiA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dCA9IHRoaXMuZmluZE5leHRCcmFrZXQocG9zIC0gMSk7XG4gICAgICAgIGlmICgobmV4dCA9PSBudWxsKSB8fCB0aGlzLmNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT09IDApIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgcHJldiwgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwcmV2LCBuZXh0ICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpO1xuICAgIH1cblxuICAgIG5leHRDbWQoc3RhcnQgPSAwKSB7XG4gICAgICB2YXIgYmVnaW5uaW5nLCBmLCBwb3M7XG4gICAgICBwb3MgPSBzdGFydDtcbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFt0aGlzLmJyYWtldHMsIFwiXFxuXCJdKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIGYuc3RyLmxlbmd0aDtcbiAgICAgICAgaWYgKGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGJlZ2lubmluZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBiZWdpbm5pbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIGJlZ2lubmluZywgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvcztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmVnaW5uaW5nID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0RW5jbG9zaW5nQ21kKHBvcyA9IDApIHtcbiAgICAgIHZhciBjbG9zaW5nUHJlZml4LCBjbWQsIGNwb3MsIHA7XG4gICAgICBjcG9zID0gcG9zO1xuICAgICAgY2xvc2luZ1ByZWZpeCA9IHRoaXMuYnJha2V0cyArIHRoaXMuY2xvc2VDaGFyO1xuICAgICAgd2hpbGUgKChwID0gdGhpcy5maW5kTmV4dChjcG9zLCBjbG9zaW5nUHJlZml4KSkgIT0gbnVsbCkge1xuICAgICAgICBpZiAoY21kID0gdGhpcy5jb21tYW5kT25Qb3MocCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoKSkge1xuICAgICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKCk7XG4gICAgICAgICAgaWYgKGNtZC5wb3MgPCBwb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNwb3MgPSBwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByZWNlZGVkQnlCcmFrZXRzKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aCwgcG9zKSA9PT0gdGhpcy5icmFrZXRzO1xuICAgIH1cblxuICAgIGZvbGxvd2VkQnlCcmFrZXRzKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSA9PT0gdGhpcy5icmFrZXRzO1xuICAgIH1cblxuICAgIGNvdW50UHJldkJyYWtldChzdGFydCkge1xuICAgICAgdmFyIGk7XG4gICAgICBpID0gMDtcbiAgICAgIHdoaWxlICgoc3RhcnQgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHN0YXJ0KSkgIT0gbnVsbCkge1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBpc0VuZExpbmUocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIDEpID09PSBcIlxcblwiIHx8IHBvcyArIDEgPj0gdGhpcy5lZGl0b3IudGV4dExlbigpO1xuICAgIH1cblxuICAgIGZpbmRQcmV2QnJha2V0KHN0YXJ0KSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dEJyYWtldChzdGFydCwgLTEpO1xuICAgIH1cblxuICAgIGZpbmROZXh0QnJha2V0KHN0YXJ0LCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZjtcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSwgZGlyZWN0aW9uKTtcbiAgICAgIGlmIChmICYmIGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgcmV0dXJuIGYucG9zO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRQcmV2KHN0YXJ0LCBzdHJpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmROZXh0KHN0YXJ0LCBzdHJpbmcsIC0xKTtcbiAgICB9XG5cbiAgICBmaW5kTmV4dChzdGFydCwgc3RyaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZjtcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbc3RyaW5nXSwgZGlyZWN0aW9uKTtcbiAgICAgIGlmIChmKSB7XG4gICAgICAgIHJldHVybiBmLnBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIGZpbmRNYXRjaGluZ1BhaXIoc3RhcnRQb3MsIG9wZW5pbmcsIGNsb3NpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmLCBuZXN0ZWQsIHBvcztcbiAgICAgIHBvcyA9IHN0YXJ0UG9zO1xuICAgICAgbmVzdGVkID0gMDtcbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtjbG9zaW5nLCBvcGVuaW5nXSwgZGlyZWN0aW9uKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIChkaXJlY3Rpb24gPiAwID8gZi5zdHIubGVuZ3RoIDogMCk7XG4gICAgICAgIGlmIChmLnN0ciA9PT0gKGRpcmVjdGlvbiA+IDAgPyBjbG9zaW5nIDogb3BlbmluZykpIHtcbiAgICAgICAgICBpZiAobmVzdGVkID4gMCkge1xuICAgICAgICAgICAgbmVzdGVkLS07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXN0ZWQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgYWRkQnJha2V0cyhwb3MpIHtcbiAgICAgIHZhciByZXBsYWNlbWVudHM7XG4gICAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpO1xuICAgICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAodGhpcy5icmFrZXRzLCB0aGlzLmJyYWtldHMpLm1hcChmdW5jdGlvbihyKSB7XG4gICAgICAgIHJldHVybiByLnNlbGVjdENvbnRlbnQoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gICAgfVxuXG4gICAgcHJvbXB0Q2xvc2luZ0NtZChzZWxlY3Rpb25zKSB7XG4gICAgICBpZiAodGhpcy5jbG9zaW5nUHJvbXAgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNsb3NpbmdQcm9tcC5zdG9wKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUHJvbXAgPSBDbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsIHNlbGVjdGlvbnMpLmJlZ2luKCk7XG4gICAgfVxuXG4gICAgcGFyc2VBbGwocmVjdXJzaXZlID0gdHJ1ZSkge1xuICAgICAgdmFyIGNtZCwgcGFyc2VyLCBwb3MsIHJlcztcbiAgICAgIGlmICh0aGlzLm5lc3RlZCA+IDEwMCkge1xuICAgICAgICB0aHJvdyBcIkluZmluaXRlIHBhcnNpbmcgUmVjdXJzaW9uXCI7XG4gICAgICB9XG4gICAgICBwb3MgPSAwO1xuICAgICAgd2hpbGUgKGNtZCA9IHRoaXMubmV4dENtZChwb3MpKSB7XG4gICAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKTtcbiAgICAgICAgdGhpcy5lZGl0b3Iuc2V0Q3Vyc29yUG9zKHBvcyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGNtZClcbiAgICAgICAgY21kLmluaXQoKTtcbiAgICAgICAgaWYgKHJlY3Vyc2l2ZSAmJiAoY21kLmNvbnRlbnQgIT0gbnVsbCkgJiYgKChjbWQuZ2V0Q21kKCkgPT0gbnVsbCkgfHwgIWNtZC5nZXRPcHRpb24oJ3ByZXZlbnRQYXJzZUFsbCcpKSkge1xuICAgICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcihjbWQuY29udGVudCksIHtcbiAgICAgICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNtZC5jb250ZW50ID0gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gY21kLmV4ZWN1dGUoKTtcbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgaWYgKHJlcy50aGVuICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN5bmMgbmVzdGVkIGNvbW1hbmRzIGFyZSBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjbWQucmVwbGFjZUVuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCkuZW5kO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VGV4dCgpO1xuICAgIH1cblxuICAgIGdldFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dCgpO1xuICAgIH1cblxuICAgIGlzUm9vdCgpIHtcbiAgICAgIHJldHVybiAodGhpcy5wYXJlbnQgPT0gbnVsbCkgJiYgKCh0aGlzLmluSW5zdGFuY2UgPT0gbnVsbCkgfHwgKHRoaXMuaW5JbnN0YW5jZS5maW5kZXIgPT0gbnVsbCkpO1xuICAgIH1cblxuICAgIGdldFJvb3QoKSB7XG4gICAgICBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Um9vdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVDYXJyZXQodHh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsIHRoaXMuY2FycmV0Q2hhcik7XG4gICAgfVxuXG4gICAgZ2V0Q2FycmV0UG9zKHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRDYXJyZXRQb3ModHh0LCB0aGlzLmNhcnJldENoYXIpO1xuICAgIH1cblxuICAgIHJlZ01hcmtlcihmbGFncyA9IFwiZ1wiKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMubWFya2VyKSwgZmxhZ3MpO1xuICAgIH1cblxuICAgIHJlbW92ZU1hcmtlcnModGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSh0aGlzLnJlZ01hcmtlcigpLCAnJyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXQoKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGVkKSB7XG4gICAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgQ29tbWFuZC5pbml0Q21kcygpO1xuICAgICAgICByZXR1cm4gQ29tbWFuZC5sb2FkQ21kcygpO1xuICAgICAgfVxuICAgIH1cblxuICB9O1xuXG4gIENvZGV3YXZlLmluaXRlZCA9IGZhbHNlO1xuXG4gIHJldHVybiBDb2Rld2F2ZTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBTdG9yYWdlIH0gZnJvbSAnLi9TdG9yYWdlJztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5cbl9vcHRLZXkgPSAoa2V5LGRpY3QsZGVmVmFsID0gbnVsbCkgLT5cbiAgIyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICByZXR1cm4gaWYga2V5IG9mIGRpY3QgdGhlbiBkaWN0W2tleV0gZWxzZSBkZWZWYWxcblxuXG5leHBvcnQgY2xhc3MgQ29tbWFuZFxuICBjb25zdHJ1Y3RvcjogKEBuYW1lLEBkYXRhPW51bGwscGFyZW50PW51bGwpIC0+XG4gICAgQGNtZHMgPSBbXVxuICAgIEBkZXRlY3RvcnMgPSBbXVxuICAgIEBleGVjdXRlRnVuY3QgPSBAcmVzdWx0RnVuY3QgPSBAcmVzdWx0U3RyID0gQGFsaWFzT2YgPSBAY2xzID0gbnVsbFxuICAgIEBhbGlhc2VkID0gbnVsbFxuICAgIEBmdWxsTmFtZSA9IEBuYW1lXG4gICAgQGRlcHRoID0gMFxuICAgIFtAX3BhcmVudCwgQF9pbml0ZWRdID0gW251bGwsIGZhbHNlXVxuICAgIEBzZXRQYXJlbnQocGFyZW50KVxuICAgIEBkZWZhdWx0cyA9IHt9XG4gICAgXG4gICAgQGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgIHBhcnNlOiBmYWxzZSxcbiAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICBhbHRlclJlc3VsdDogbnVsbCxcbiAgICAgIHByZXZlbnRQYXJzZUFsbDogZmFsc2UsXG4gICAgICByZXBsYWNlQm94OiBmYWxzZSxcbiAgICAgIGFsbG93ZWROYW1lZDogbnVsbFxuICAgIH1cbiAgICBAb3B0aW9ucyA9IHt9XG4gICAgQGZpbmFsT3B0aW9ucyA9IG51bGxcbiAgcGFyZW50OiAtPlxuICAgIHJldHVybiBAX3BhcmVudFxuICBzZXRQYXJlbnQ6ICh2YWx1ZSkgLT5cbiAgICBpZiBAX3BhcmVudCAhPSB2YWx1ZVxuICAgICAgQF9wYXJlbnQgPSB2YWx1ZVxuICAgICAgQGZ1bGxOYW1lID0gKFxuICAgICAgICBpZiBAX3BhcmVudD8gYW5kIEBfcGFyZW50Lm5hbWU/XG4gICAgICAgICAgQF9wYXJlbnQuZnVsbE5hbWUgKyAnOicgKyBAbmFtZSBcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICBAbmFtZVxuICAgICAgKVxuICAgICAgQGRlcHRoID0gKFxuICAgICAgICBpZiBAX3BhcmVudD8gYW5kIEBfcGFyZW50LmRlcHRoP1xuICAgICAgICB0aGVuIEBfcGFyZW50LmRlcHRoICsgMVxuICAgICAgICBlbHNlIDBcbiAgICAgIClcbiAgaW5pdDogLT5cbiAgICBpZiAhQF9pbml0ZWRcbiAgICAgIEBfaW5pdGVkID0gdHJ1ZVxuICAgICAgQHBhcnNlRGF0YShAZGF0YSlcbiAgICByZXR1cm4gdGhpc1xuICB1bnJlZ2lzdGVyOiAtPlxuICAgIEBfcGFyZW50LnJlbW92ZUNtZCh0aGlzKVxuICBpc0VkaXRhYmxlOiAtPlxuICAgIHJldHVybiBAcmVzdWx0U3RyPyBvciBAYWxpYXNPZj9cbiAgaXNFeGVjdXRhYmxlOiAtPlxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgIGZvciBwIGluIFsncmVzdWx0U3RyJywncmVzdWx0RnVuY3QnLCdjbHMnLCdleGVjdXRlRnVuY3QnXVxuICAgICAgaWYgdGhpc1twXT9cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgaXNFeGVjdXRhYmxlV2l0aE5hbWU6IChuYW1lKSAtPlxuICAgIGlmIEBhbGlhc09mP1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgIGFsaWFzT2YgPSBAYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLG5hbWUpXG4gICAgICBhbGlhc2VkID0gQF9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihhbGlhc09mKSlcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIEBpc0V4ZWN1dGFibGUoKVxuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgZm9yIHAgaW4gWydyZXN1bHRTdHInLCdyZXN1bHRGdW5jdCddXG4gICAgICBpZiB0aGlzW3BdP1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICBnZXREZWZhdWx0czogLT5cbiAgICByZXMgPSB7fVxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSlcbiAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxAZGVmYXVsdHMpXG4gICAgcmV0dXJuIHJlc1xuICBfYWxpYXNlZEZyb21GaW5kZXI6IChmaW5kZXIpIC0+XG4gICAgICBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2VcbiAgICAgIGZpbmRlci5tdXN0RXhlY3V0ZSA9IGZhbHNlXG4gICAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2VcbiAgICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIGdldEFsaWFzZWQ6IC0+XG4gICAgaWYgQGFsaWFzT2Y/XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgcmV0dXJuIEBfYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoQGFsaWFzT2YpKVxuICBzZXRPcHRpb25zOiAoZGF0YSkgLT5cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGF0YVxuICAgICAgaWYga2V5IG9mIEBkZWZhdWx0T3B0aW9uc1xuICAgICAgICBAb3B0aW9uc1trZXldID0gdmFsXG4gIF9vcHRpb25zRm9yQWxpYXNlZDogKGFsaWFzZWQpIC0+XG4gICAgb3B0ID0ge31cbiAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxAZGVmYXVsdE9wdGlvbnMpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LGFsaWFzZWQuZ2V0T3B0aW9ucygpKVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdCxAb3B0aW9ucylcbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4gQF9vcHRpb25zRm9yQWxpYXNlZChAZ2V0QWxpYXNlZCgpKVxuICBnZXRPcHRpb246IChrZXkpIC0+XG4gICAgb3B0aW9ucyA9IEBnZXRPcHRpb25zKClcbiAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBoZWxwOiAtPlxuICAgIGNtZCA9IEBnZXRDbWQoJ2hlbHAnKVxuICAgIGlmIGNtZD9cbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLnJlc3VsdFN0clxuICBwYXJzZURhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gZGF0YVxuICAgIGlmIHR5cGVvZiBkYXRhID09ICdzdHJpbmcnXG4gICAgICBAcmVzdWx0U3RyID0gZGF0YVxuICAgICAgQG9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2UgaWYgZGF0YT9cbiAgICAgIHJldHVybiBAcGFyc2VEaWN0RGF0YShkYXRhKVxuICAgIHJldHVybiBmYWxzZVxuICBwYXJzZURpY3REYXRhOiAoZGF0YSkgLT5cbiAgICByZXMgPSBfb3B0S2V5KCdyZXN1bHQnLGRhdGEpXG4gICAgaWYgdHlwZW9mIHJlcyA9PSBcImZ1bmN0aW9uXCJcbiAgICAgIEByZXN1bHRGdW5jdCA9IHJlc1xuICAgIGVsc2UgaWYgcmVzP1xuICAgICAgQHJlc3VsdFN0ciA9IHJlc1xuICAgICAgQG9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlXG4gICAgZXhlY3V0ZSA9IF9vcHRLZXkoJ2V4ZWN1dGUnLGRhdGEpXG4gICAgaWYgdHlwZW9mIGV4ZWN1dGUgPT0gXCJmdW5jdGlvblwiXG4gICAgICBAZXhlY3V0ZUZ1bmN0ID0gZXhlY3V0ZVxuICAgIEBhbGlhc09mID0gX29wdEtleSgnYWxpYXNPZicsZGF0YSlcbiAgICBAY2xzID0gX29wdEtleSgnY2xzJyxkYXRhKVxuICAgIEBkZWZhdWx0cyA9IF9vcHRLZXkoJ2RlZmF1bHRzJyxkYXRhLEBkZWZhdWx0cylcbiAgICBcbiAgICBAc2V0T3B0aW9ucyhkYXRhKVxuICAgIFxuICAgIGlmICdoZWxwJyBvZiBkYXRhXG4gICAgICBAYWRkQ21kKG5ldyBDb21tYW5kKCdoZWxwJyxkYXRhWydoZWxwJ10sdGhpcykpXG4gICAgaWYgJ2ZhbGxiYWNrJyBvZiBkYXRhXG4gICAgICBAYWRkQ21kKG5ldyBDb21tYW5kKCdmYWxsYmFjaycsZGF0YVsnZmFsbGJhY2snXSx0aGlzKSlcbiAgICAgIFxuICAgIGlmICdjbWRzJyBvZiBkYXRhXG4gICAgICBAYWRkQ21kcyhkYXRhWydjbWRzJ10pXG4gICAgcmV0dXJuIHRydWVcbiAgYWRkQ21kczogKGNtZHMpIC0+XG4gICAgZm9yIG5hbWUsIGRhdGEgb2YgY21kc1xuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZChuYW1lLGRhdGEsdGhpcykpXG4gIGFkZENtZDogKGNtZCkgLT5cbiAgICBleGlzdHMgPSBAZ2V0Q21kKGNtZC5uYW1lKVxuICAgIGlmIGV4aXN0cz9cbiAgICAgIEByZW1vdmVDbWQoZXhpc3RzKVxuICAgIGNtZC5zZXRQYXJlbnQodGhpcylcbiAgICBAY21kcy5wdXNoKGNtZClcbiAgICByZXR1cm4gY21kXG4gIHJlbW92ZUNtZDogKGNtZCkgLT5cbiAgICBpZiAoaSA9IEBjbWRzLmluZGV4T2YoY21kKSkgPiAtMVxuICAgICAgQGNtZHMuc3BsaWNlKGksIDEpXG4gICAgcmV0dXJuIGNtZFxuICBnZXRDbWQ6IChmdWxsbmFtZSkgLT5cbiAgICBAaW5pdCgpXG4gICAgW3NwYWNlLG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpXG4gICAgaWYgc3BhY2U/XG4gICAgICByZXR1cm4gQGdldENtZChzcGFjZSk/LmdldENtZChuYW1lKVxuICAgIGZvciBjbWQgaW4gQGNtZHNcbiAgICAgIGlmIGNtZC5uYW1lID09IG5hbWVcbiAgICAgICAgcmV0dXJuIGNtZFxuICBzZXRDbWREYXRhOiAoZnVsbG5hbWUsZGF0YSkgLT5cbiAgICBAc2V0Q21kKGZ1bGxuYW1lLG5ldyBDb21tYW5kKGZ1bGxuYW1lLnNwbGl0KCc6JykucG9wKCksZGF0YSkpXG4gIHNldENtZDogKGZ1bGxuYW1lLGNtZCkgLT5cbiAgICBbc3BhY2UsbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSlcbiAgICBpZiBzcGFjZT9cbiAgICAgIG5leHQgPSBAZ2V0Q21kKHNwYWNlKVxuICAgICAgdW5sZXNzIG5leHQ/XG4gICAgICAgIG5leHQgPSBAYWRkQ21kKG5ldyBDb21tYW5kKHNwYWNlKSlcbiAgICAgIHJldHVybiBuZXh0LnNldENtZChuYW1lLGNtZClcbiAgICBlbHNlXG4gICAgICBAYWRkQ21kKGNtZClcbiAgICAgIHJldHVybiBjbWRcbiAgYWRkRGV0ZWN0b3I6IChkZXRlY3RvcikgLT5cbiAgICBAZGV0ZWN0b3JzLnB1c2goZGV0ZWN0b3IpXG4gICAgXG4gIEBwcm92aWRlcnMgPSBbXVxuXG4gIEBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuXG4gIEBpbml0Q21kczogLT5cbiAgICBDb21tYW5kLmNtZHMgPSBuZXcgQ29tbWFuZChudWxsLHtcbiAgICAgICdjbWRzJzp7XG4gICAgICAgICdoZWxsbyc6e1xuICAgICAgICAgIGhlbHA6IFwiXCJcIlxuICAgICAgICAgIFwiSGVsbG8sIHdvcmxkIVwiIGlzIHR5cGljYWxseSBvbmUgb2YgdGhlIHNpbXBsZXN0IHByb2dyYW1zIHBvc3NpYmxlIGluXG4gICAgICAgICAgbW9zdCBwcm9ncmFtbWluZyBsYW5ndWFnZXMsIGl0IGlzIGJ5IHRyYWRpdGlvbiBvZnRlbiAoLi4uKSB1c2VkIHRvXG4gICAgICAgICAgdmVyaWZ5IHRoYXQgYSBsYW5ndWFnZSBvciBzeXN0ZW0gaXMgb3BlcmF0aW5nIGNvcnJlY3RseSAtd2lraXBlZGlhXG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgcmVzdWx0OiAnSGVsbG8sIFdvcmxkISdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgZm9yIHByb3ZpZGVyIGluIEBwcm92aWRlcnNcbiAgICAgIHByb3ZpZGVyLnJlZ2lzdGVyKENvbW1hbmQuY21kcylcblxuICBAc2F2ZUNtZDogKGZ1bGxuYW1lLCBkYXRhKSAtPlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLGRhdGEpXG4gICAgLnRoZW4gPT5cbiAgICAgIEBzdG9yYWdlLnNhdmVJblBhdGgoJ2NtZHMnLCBmdWxsbmFtZSwgZGF0YSlcblxuICBAbG9hZENtZHM6IC0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgc2F2ZWRDbWRzID0gQHN0b3JhZ2UubG9hZCgnY21kcycpXG4gICAgLnRoZW4gKHNhdmVkQ21kcyk9PlxuICAgICAgaWYgc2F2ZWRDbWRzPyBcbiAgICAgICAgZm9yIGZ1bGxuYW1lLCBkYXRhIG9mIHNhdmVkQ21kc1xuICAgICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKVxuXG4gIEByZXNldFNhdmVkOiAtPlxuICAgIEBzdG9yYWdlLnNhdmUoJ2NtZHMnLHt9KVxuXG4gIEBtYWtlVmFyQ21kID0gKG5hbWUsYmFzZT17fSkgLT4gXG4gICAgYmFzZS5leGVjdXRlID0gKGluc3RhbmNlKSAtPlxuICAgICAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSk/XG4gICAgICAgIHBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UuY29udGVudFxuICAgICAgICBpbnN0YW5jZS5jb250ZW50XG4gICAgICBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdmFsIGlmIHZhbD9cbiAgICByZXR1cm4gYmFzZVxuXG4gIEBtYWtlQm9vbFZhckNtZCA9IChuYW1lLGJhc2U9e30pIC0+IFxuICAgIGJhc2UuZXhlY3V0ZSA9IChpbnN0YW5jZSkgLT5cbiAgICAgIHZhbCA9IGlmIChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpP1xuICAgICAgICBwXG4gICAgICBlbHNlIGlmIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgICAgaW5zdGFuY2UuY29udGVudFxuICAgICAgdW5sZXNzIHZhbD8gYW5kIHZhbCBpbiBbJzAnLCdmYWxzZScsJ25vJ11cbiAgICAgICAgaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHRydWVcbiAgICByZXR1cm4gYmFzZVxuICBcblxuZXhwb3J0IGNsYXNzIEJhc2VDb21tYW5kXG4gIGNvbnN0cnVjdG9yOiAoQGluc3RhbmNlKSAtPlxuICBpbml0OiAtPlxuICAgICNcbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgcmV0dXJuIHRoaXNbXCJyZXN1bHRcIl0/XG4gIGdldERlZmF1bHRzOiAtPlxuICAgIHJldHVybiB7fVxuICBnZXRPcHRpb25zOiAtPlxuICAgIHJldHVybiB7fVxuICAgICAgIiwidmFyIF9vcHRLZXk7XG5cbmltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgU3RvcmFnZVxufSBmcm9tICcuL1N0b3JhZ2UnO1xuXG5pbXBvcnQge1xuICBOYW1lc3BhY2VIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cbl9vcHRLZXkgPSBmdW5jdGlvbihrZXksIGRpY3QsIGRlZlZhbCA9IG51bGwpIHtcbiAgLy8gb3B0aW9uYWwgRGljdGlvbmFyeSBrZXlcbiAgaWYgKGtleSBpbiBkaWN0KSB7XG4gICAgcmV0dXJuIGRpY3Rba2V5XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGVmVmFsO1xuICB9XG59O1xuXG5leHBvcnQgdmFyIENvbW1hbmQgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIENvbW1hbmQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUxLCBkYXRhMSA9IG51bGwsIHBhcmVudCA9IG51bGwpIHtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWUxO1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTE7XG4gICAgICB0aGlzLmNtZHMgPSBbXTtcbiAgICAgIHRoaXMuZGV0ZWN0b3JzID0gW107XG4gICAgICB0aGlzLmV4ZWN1dGVGdW5jdCA9IHRoaXMucmVzdWx0RnVuY3QgPSB0aGlzLnJlc3VsdFN0ciA9IHRoaXMuYWxpYXNPZiA9IHRoaXMuY2xzID0gbnVsbDtcbiAgICAgIHRoaXMuYWxpYXNlZCA9IG51bGw7XG4gICAgICB0aGlzLmZ1bGxOYW1lID0gdGhpcy5uYW1lO1xuICAgICAgdGhpcy5kZXB0aCA9IDA7XG4gICAgICBbdGhpcy5fcGFyZW50LCB0aGlzLl9pbml0ZWRdID0gW251bGwsIGZhbHNlXTtcbiAgICAgIHRoaXMuc2V0UGFyZW50KHBhcmVudCk7XG4gICAgICB0aGlzLmRlZmF1bHRzID0ge307XG4gICAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBuYW1lVG9QYXJhbTogbnVsbCxcbiAgICAgICAgY2hlY2tDYXJyZXQ6IHRydWUsXG4gICAgICAgIHBhcnNlOiBmYWxzZSxcbiAgICAgICAgYmVmb3JlRXhlY3V0ZTogbnVsbCxcbiAgICAgICAgYWx0ZXJSZXN1bHQ6IG51bGwsXG4gICAgICAgIHByZXZlbnRQYXJzZUFsbDogZmFsc2UsXG4gICAgICAgIHJlcGxhY2VCb3g6IGZhbHNlLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IG51bGxcbiAgICAgIH07XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICAgIHRoaXMuZmluYWxPcHRpb25zID0gbnVsbDtcbiAgICB9XG5cbiAgICBwYXJlbnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICAgIH1cblxuICAgIHNldFBhcmVudCh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMuX3BhcmVudCAhPT0gdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZnVsbE5hbWUgPSAoKHRoaXMuX3BhcmVudCAhPSBudWxsKSAmJiAodGhpcy5fcGFyZW50Lm5hbWUgIT0gbnVsbCkgPyB0aGlzLl9wYXJlbnQuZnVsbE5hbWUgKyAnOicgKyB0aGlzLm5hbWUgOiB0aGlzLm5hbWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5kZXB0aCA9ICgodGhpcy5fcGFyZW50ICE9IG51bGwpICYmICh0aGlzLl9wYXJlbnQuZGVwdGggIT0gbnVsbCkgPyB0aGlzLl9wYXJlbnQuZGVwdGggKyAxIDogMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIGlmICghdGhpcy5faW5pdGVkKSB7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMucGFyc2VEYXRhKHRoaXMuZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5yZW1vdmVDbWQodGhpcyk7XG4gICAgfVxuXG4gICAgaXNFZGl0YWJsZSgpIHtcbiAgICAgIHJldHVybiAodGhpcy5yZXN1bHRTdHIgIT0gbnVsbCkgfHwgKHRoaXMuYWxpYXNPZiAhPSBudWxsKTtcbiAgICB9XG5cbiAgICBpc0V4ZWN1dGFibGUoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgaiwgbGVuLCBwLCByZWY7XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKTtcbiAgICAgIH1cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0JywgJ2NscycsICdleGVjdXRlRnVuY3QnXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcmVmW2pdO1xuICAgICAgICBpZiAodGhpc1twXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpc0V4ZWN1dGFibGVXaXRoTmFtZShuYW1lKSB7XG4gICAgICB2YXIgYWxpYXNPZiwgYWxpYXNlZCwgY29udGV4dDtcbiAgICAgIGlmICh0aGlzLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKTtcbiAgICAgICAgYWxpYXNPZiA9IHRoaXMuYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBuYW1lKTtcbiAgICAgICAgYWxpYXNlZCA9IHRoaXMuX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKGFsaWFzT2YpKTtcbiAgICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pc0V4ZWN1dGFibGUoKTtcbiAgICB9XG5cbiAgICByZXN1bHRJc0F2YWlsYWJsZSgpIHtcbiAgICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZjtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0J107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHJlZltqXTtcbiAgICAgICAgaWYgKHRoaXNbcF0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgcmVzO1xuICAgICAgcmVzID0ge307XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCBhbGlhc2VkLmdldERlZmF1bHRzKCkpO1xuICAgICAgfVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuZGVmYXVsdHMpO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBfYWxpYXNlZEZyb21GaW5kZXIoZmluZGVyKSB7XG4gICAgICBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2U7XG4gICAgICBmaW5kZXIubXVzdEV4ZWN1dGUgPSBmYWxzZTtcbiAgICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZTtcbiAgICAgIHJldHVybiBmaW5kZXIuZmluZCgpO1xuICAgIH1cblxuICAgIGdldEFsaWFzZWQoKSB7XG4gICAgICB2YXIgY29udGV4dDtcbiAgICAgIGlmICh0aGlzLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKHRoaXMuYWxpYXNPZikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldE9wdGlvbnMoZGF0YSkge1xuICAgICAgdmFyIGtleSwgcmVzdWx0cywgdmFsO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgICB2YWwgPSBkYXRhW2tleV07XG4gICAgICAgIGlmIChrZXkgaW4gdGhpcy5kZWZhdWx0T3B0aW9ucykge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLm9wdGlvbnNba2V5XSA9IHZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIF9vcHRpb25zRm9yQWxpYXNlZChhbGlhc2VkKSB7XG4gICAgICB2YXIgb3B0O1xuICAgICAgb3B0ID0ge307XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5kZWZhdWx0T3B0aW9ucyk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCBhbGlhc2VkLmdldE9wdGlvbnMoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9ucygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSk7XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9uKGtleSkge1xuICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoZWxwKCkge1xuICAgICAgdmFyIGNtZDtcbiAgICAgIGNtZCA9IHRoaXMuZ2V0Q21kKCdoZWxwJyk7XG4gICAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5pbml0KCkucmVzdWx0U3RyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlRGF0YShkYXRhKSB7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IGRhdGE7XG4gICAgICAgIHRoaXMub3B0aW9uc1sncGFyc2UnXSA9IHRydWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChkYXRhICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEaWN0RGF0YShkYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwYXJzZURpY3REYXRhKGRhdGEpIHtcbiAgICAgIHZhciBleGVjdXRlLCByZXM7XG4gICAgICByZXMgPSBfb3B0S2V5KCdyZXN1bHQnLCBkYXRhKTtcbiAgICAgIGlmICh0eXBlb2YgcmVzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRGdW5jdCA9IHJlcztcbiAgICAgIH0gZWxzZSBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRTdHIgPSByZXM7XG4gICAgICAgIHRoaXMub3B0aW9uc1sncGFyc2UnXSA9IHRydWU7XG4gICAgICB9XG4gICAgICBleGVjdXRlID0gX29wdEtleSgnZXhlY3V0ZScsIGRhdGEpO1xuICAgICAgaWYgKHR5cGVvZiBleGVjdXRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSBleGVjdXRlO1xuICAgICAgfVxuICAgICAgdGhpcy5hbGlhc09mID0gX29wdEtleSgnYWxpYXNPZicsIGRhdGEpO1xuICAgICAgdGhpcy5jbHMgPSBfb3B0S2V5KCdjbHMnLCBkYXRhKTtcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSBfb3B0S2V5KCdkZWZhdWx0cycsIGRhdGEsIHRoaXMuZGVmYXVsdHMpO1xuICAgICAgdGhpcy5zZXRPcHRpb25zKGRhdGEpO1xuICAgICAgaWYgKCdoZWxwJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKCdoZWxwJywgZGF0YVsnaGVscCddLCB0aGlzKSk7XG4gICAgICB9XG4gICAgICBpZiAoJ2ZhbGxiYWNrJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKCdmYWxsYmFjaycsIGRhdGFbJ2ZhbGxiYWNrJ10sIHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIGlmICgnY21kcycgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZHMoZGF0YVsnY21kcyddKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFkZENtZHMoY21kcykge1xuICAgICAgdmFyIGRhdGEsIG5hbWUsIHJlc3VsdHM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKG5hbWUgaW4gY21kcykge1xuICAgICAgICBkYXRhID0gY21kc1tuYW1lXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKG5hbWUsIGRhdGEsIHRoaXMpKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBhZGRDbWQoY21kKSB7XG4gICAgICB2YXIgZXhpc3RzO1xuICAgICAgZXhpc3RzID0gdGhpcy5nZXRDbWQoY21kLm5hbWUpO1xuICAgICAgaWYgKGV4aXN0cyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ21kKGV4aXN0cyk7XG4gICAgICB9XG4gICAgICBjbWQuc2V0UGFyZW50KHRoaXMpO1xuICAgICAgdGhpcy5jbWRzLnB1c2goY21kKTtcbiAgICAgIHJldHVybiBjbWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ21kKGNtZCkge1xuICAgICAgdmFyIGk7XG4gICAgICBpZiAoKGkgPSB0aGlzLmNtZHMuaW5kZXhPZihjbWQpKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuY21kcy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY21kO1xuICAgIH1cblxuICAgIGdldENtZChmdWxsbmFtZSkge1xuICAgICAgdmFyIGNtZCwgaiwgbGVuLCBuYW1lLCByZWYsIHJlZjEsIHNwYWNlO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgICBbc3BhY2UsIG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpO1xuICAgICAgaWYgKHNwYWNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIChyZWYgPSB0aGlzLmdldENtZChzcGFjZSkpICE9IG51bGwgPyByZWYuZ2V0Q21kKG5hbWUpIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgcmVmMSA9IHRoaXMuY21kcztcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgY21kID0gcmVmMVtqXTtcbiAgICAgICAgaWYgKGNtZC5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGNtZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldENtZChmdWxsbmFtZSwgbmV3IENvbW1hbmQoZnVsbG5hbWUuc3BsaXQoJzonKS5wb3AoKSwgZGF0YSkpO1xuICAgIH1cblxuICAgIHNldENtZChmdWxsbmFtZSwgY21kKSB7XG4gICAgICB2YXIgbmFtZSwgbmV4dCwgc3BhY2U7XG4gICAgICBbc3BhY2UsIG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpO1xuICAgICAgaWYgKHNwYWNlICE9IG51bGwpIHtcbiAgICAgICAgbmV4dCA9IHRoaXMuZ2V0Q21kKHNwYWNlKTtcbiAgICAgICAgaWYgKG5leHQgPT0gbnVsbCkge1xuICAgICAgICAgIG5leHQgPSB0aGlzLmFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXh0LnNldENtZChuYW1lLCBjbWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hZGRDbWQoY21kKTtcbiAgICAgICAgcmV0dXJuIGNtZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZGREZXRlY3RvcihkZXRlY3Rvcikge1xuICAgICAgcmV0dXJuIHRoaXMuZGV0ZWN0b3JzLnB1c2goZGV0ZWN0b3IpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbml0Q21kcygpIHtcbiAgICAgIHZhciBqLCBsZW4sIHByb3ZpZGVyLCByZWYsIHJlc3VsdHM7XG4gICAgICBDb21tYW5kLmNtZHMgPSBuZXcgQ29tbWFuZChudWxsLCB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdoZWxsbyc6IHtcbiAgICAgICAgICAgIGhlbHA6IFwiXFxcIkhlbGxvLCB3b3JsZCFcXFwiIGlzIHR5cGljYWxseSBvbmUgb2YgdGhlIHNpbXBsZXN0IHByb2dyYW1zIHBvc3NpYmxlIGluXFxubW9zdCBwcm9ncmFtbWluZyBsYW5ndWFnZXMsIGl0IGlzIGJ5IHRyYWRpdGlvbiBvZnRlbiAoLi4uKSB1c2VkIHRvXFxudmVyaWZ5IHRoYXQgYSBsYW5ndWFnZSBvciBzeXN0ZW0gaXMgb3BlcmF0aW5nIGNvcnJlY3RseSAtd2lraXBlZGlhXCIsXG4gICAgICAgICAgICByZXN1bHQ6ICdIZWxsbywgV29ybGQhJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZWYgPSB0aGlzLnByb3ZpZGVycztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwcm92aWRlciA9IHJlZltqXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHByb3ZpZGVyLnJlZ2lzdGVyKENvbW1hbmQuY21kcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgc3RhdGljIHNhdmVDbWQoZnVsbG5hbWUsIGRhdGEpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKTtcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNhdmVJblBhdGgoJ2NtZHMnLCBmdWxsbmFtZSwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbG9hZENtZHMoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBzYXZlZENtZHM7XG4gICAgICAgIHJldHVybiBzYXZlZENtZHMgPSB0aGlzLnN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbigoc2F2ZWRDbWRzKSA9PiB7XG4gICAgICAgIHZhciBkYXRhLCBmdWxsbmFtZSwgcmVzdWx0cztcbiAgICAgICAgaWYgKHNhdmVkQ21kcyAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoZnVsbG5hbWUgaW4gc2F2ZWRDbWRzKSB7XG4gICAgICAgICAgICBkYXRhID0gc2F2ZWRDbWRzW2Z1bGxuYW1lXTtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0U2F2ZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNhdmUoJ2NtZHMnLCB7fSk7XG4gICAgfVxuXG4gICAgc3RhdGljIG1ha2VWYXJDbWQobmFtZSwgYmFzZSA9IHt9KSB7XG4gICAgICBiYXNlLmV4ZWN1dGUgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICB2YXIgcCwgdmFsO1xuICAgICAgICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuICAgICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYWtlQm9vbFZhckNtZChuYW1lLCBiYXNlID0ge30pIHtcbiAgICAgIGJhc2UuZXhlY3V0ZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBwLCB2YWw7XG4gICAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gICAgICAgIGlmICghKCh2YWwgIT0gbnVsbCkgJiYgKHZhbCA9PT0gJzAnIHx8IHZhbCA9PT0gJ2ZhbHNlJyB8fCB2YWwgPT09ICdubycpKSkge1xuICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH1cblxuICB9O1xuXG4gIENvbW1hbmQucHJvdmlkZXJzID0gW107XG5cbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IFN0b3JhZ2UoKTtcblxuICByZXR1cm4gQ29tbWFuZDtcblxufSkuY2FsbCh0aGlzKTtcblxuZXhwb3J0IHZhciBCYXNlQ29tbWFuZCA9IGNsYXNzIEJhc2VDb21tYW5kIHtcbiAgY29uc3RydWN0b3IoaW5zdGFuY2UxKSB7XG4gICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlMTtcbiAgfVxuXG4gIGluaXQoKSB7fVxuXG4gIFxuICByZXN1bHRJc0F2YWlsYWJsZSgpIHtcbiAgICByZXR1cm4gdGhpc1tcInJlc3VsdFwiXSAhPSBudWxsO1xuICB9XG5cbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgQ21kRmluZGVyIH0gZnJvbSAnLi9DbWRGaW5kZXInO1xuaW1wb3J0IHsgQ21kSW5zdGFuY2UgfSBmcm9tICcuL0NtZEluc3RhbmNlJztcbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcblxuZXhwb3J0IGNsYXNzIENvbnRleHRcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUpIC0+XG4gICAgQG5hbWVTcGFjZXMgPSBbXVxuICBcbiAgYWRkTmFtZVNwYWNlOiAobmFtZSkgLT5cbiAgICBpZiBuYW1lIG5vdCBpbiBAbmFtZVNwYWNlcyBcbiAgICAgIEBuYW1lU3BhY2VzLnB1c2gobmFtZSlcbiAgICAgIEBfbmFtZXNwYWNlcyA9IG51bGxcbiAgYWRkTmFtZXNwYWNlczogKHNwYWNlcykgLT5cbiAgICBpZiBzcGFjZXMgXG4gICAgICBpZiB0eXBlb2Ygc3BhY2VzID09ICdzdHJpbmcnXG4gICAgICAgIHNwYWNlcyA9IFtzcGFjZXNdXG4gICAgICBmb3Igc3BhY2UgaW4gc3BhY2VzIFxuICAgICAgICBAYWRkTmFtZVNwYWNlKHNwYWNlKVxuICByZW1vdmVOYW1lU3BhY2U6IChuYW1lKSAtPlxuICAgIEBuYW1lU3BhY2VzID0gQG5hbWVTcGFjZXMuZmlsdGVyIChuKSAtPiBuIGlzbnQgbmFtZVxuXG4gIGdldE5hbWVTcGFjZXM6IC0+XG4gICAgdW5sZXNzIEBfbmFtZXNwYWNlcz9cbiAgICAgIG5wY3MgPSBbJ2NvcmUnXS5jb25jYXQoQG5hbWVTcGFjZXMpXG4gICAgICBpZiBAcGFyZW50P1xuICAgICAgICBucGNzID0gbnBjcy5jb25jYXQoQHBhcmVudC5nZXROYW1lU3BhY2VzKCkpXG4gICAgICBAX25hbWVzcGFjZXMgPSBBcnJheUhlbHBlci51bmlxdWUobnBjcylcbiAgICByZXR1cm4gQF9uYW1lc3BhY2VzXG4gIGdldENtZDogKGNtZE5hbWUsb3B0aW9ucyA9IHt9KSAtPlxuICAgIGZpbmRlciA9IEBnZXRGaW5kZXIoY21kTmFtZSxvcHRpb25zKVxuICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUsb3B0aW9ucyA9IHt9KSAtPlxuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgbmFtZXNwYWNlczogW11cbiAgICAgIHVzZURldGVjdG9yczogQGlzUm9vdCgpXG4gICAgICBjb2Rld2F2ZTogQGNvZGV3YXZlXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSxvcHRpb25zKSlcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD9cbiAgZ2V0UGFyZW50T3JSb290OiAoKSAtPlxuICAgIGlmIEBwYXJlbnQ/XG4gICAgICBAcGFyZW50XG4gICAgZWxzZVxuICAgICAgdGhpc1xuICB3cmFwQ29tbWVudDogKHN0cikgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgY2MuaW5kZXhPZignJXMnKSA+IC0xXG4gICAgICByZXR1cm4gY2MucmVwbGFjZSgnJXMnLHN0cilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHIgKyAnICcgKyBjY1xuICB3cmFwQ29tbWVudExlZnQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gY2Muc3Vic3RyKDAsaSkgKyBzdHJcbiAgICBlbHNlXG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHJcbiAgd3JhcENvbW1lbnRSaWdodDogKHN0ciA9ICcnKSAtPlxuICAgIGNjID0gQGdldENvbW1lbnRDaGFyKClcbiAgICBpZiAoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTFcbiAgICAgIHJldHVybiBzdHIgKyBjYy5zdWJzdHIoaSsyKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBzdHIgKyAnICcgKyBjY1xuICBjbWRJbnN0YW5jZUZvcjogKGNtZCkgLT5cbiAgICByZXR1cm4gbmV3IENtZEluc3RhbmNlKGNtZCx0aGlzKVxuICBnZXRDb21tZW50Q2hhcjogLT5cbiAgICBpZiBAY29tbWVudENoYXI/XG4gICAgICByZXR1cm4gQGNvbW1lbnRDaGFyXG4gICAgY21kID0gQGdldENtZCgnY29tbWVudCcpXG4gICAgY2hhciA9ICc8IS0tICVzIC0tPidcbiAgICBpZiBjbWQ/XG4gICAgICBpbnN0ID0gQGNtZEluc3RhbmNlRm9yKGNtZClcbiAgICAgIGluc3QuY29udGVudCA9ICclcydcbiAgICAgIHJlcyA9IGluc3QucmVzdWx0KClcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgY2hhciA9IHJlc1xuICAgIEBjb21tZW50Q2hhciA9IGNoYXJcbiAgICByZXR1cm4gQGNvbW1lbnRDaGFyIiwidmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xuXG5pbXBvcnQge1xuICBDbWRGaW5kZXJcbn0gZnJvbSAnLi9DbWRGaW5kZXInO1xuXG5pbXBvcnQge1xuICBDbWRJbnN0YW5jZVxufSBmcm9tICcuL0NtZEluc3RhbmNlJztcblxuaW1wb3J0IHtcbiAgQXJyYXlIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcblxuZXhwb3J0IHZhciBDb250ZXh0ID0gY2xhc3MgQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlKSB7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlO1xuICAgIHRoaXMubmFtZVNwYWNlcyA9IFtdO1xuICB9XG5cbiAgYWRkTmFtZVNwYWNlKG5hbWUpIHtcbiAgICBpZiAoaW5kZXhPZi5jYWxsKHRoaXMubmFtZVNwYWNlcywgbmFtZSkgPCAwKSB7XG4gICAgICB0aGlzLm5hbWVTcGFjZXMucHVzaChuYW1lKTtcbiAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2VzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGROYW1lc3BhY2VzKHNwYWNlcykge1xuICAgIHZhciBqLCBsZW4sIHJlc3VsdHMsIHNwYWNlO1xuICAgIGlmIChzcGFjZXMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3BhY2VzID09PSAnc3RyaW5nJykge1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHNwYWNlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBzcGFjZSA9IHNwYWNlc1tqXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuYWRkTmFtZVNwYWNlKHNwYWNlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICByZW1vdmVOYW1lU3BhY2UobmFtZSkge1xuICAgIHJldHVybiB0aGlzLm5hbWVTcGFjZXMgPSB0aGlzLm5hbWVTcGFjZXMuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuICE9PSBuYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TmFtZVNwYWNlcygpIHtcbiAgICB2YXIgbnBjcztcbiAgICBpZiAodGhpcy5fbmFtZXNwYWNlcyA9PSBudWxsKSB7XG4gICAgICBucGNzID0gWydjb3JlJ10uY29uY2F0KHRoaXMubmFtZVNwYWNlcyk7XG4gICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICBucGNzID0gbnBjcy5jb25jYXQodGhpcy5wYXJlbnQuZ2V0TmFtZVNwYWNlcygpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX25hbWVzcGFjZXMgPSBBcnJheUhlbHBlci51bmlxdWUobnBjcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2VzO1xuICB9XG5cbiAgZ2V0Q21kKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBmaW5kZXI7XG4gICAgZmluZGVyID0gdGhpcy5nZXRGaW5kZXIoY21kTmFtZSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIGZpbmRlci5maW5kKCk7XG4gIH1cblxuICBnZXRGaW5kZXIoY21kTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBDbWRGaW5kZXIoY21kTmFtZSwgT2JqZWN0LmFzc2lnbih7XG4gICAgICBuYW1lc3BhY2VzOiBbXSxcbiAgICAgIHVzZURldGVjdG9yczogdGhpcy5pc1Jvb3QoKSxcbiAgICAgIGNvZGV3YXZlOiB0aGlzLmNvZGV3YXZlLFxuICAgICAgcGFyZW50Q29udGV4dDogdGhpc1xuICAgIH0sIG9wdGlvbnMpKTtcbiAgfVxuXG4gIGlzUm9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQgPT0gbnVsbDtcbiAgfVxuXG4gIGdldFBhcmVudE9yUm9vdCgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudChzdHIpIHtcbiAgICB2YXIgY2M7XG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKCk7XG4gICAgaWYgKGNjLmluZGV4T2YoJyVzJykgPiAtMSkge1xuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJywgc3RyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2M7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnRMZWZ0KHN0ciA9ICcnKSB7XG4gICAgdmFyIGNjLCBpO1xuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpO1xuICAgIGlmICgoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5zdWJzdHIoMCwgaSkgKyBzdHI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0cjtcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudFJpZ2h0KHN0ciA9ICcnKSB7XG4gICAgdmFyIGNjLCBpO1xuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpO1xuICAgIGlmICgoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTEpIHtcbiAgICAgIHJldHVybiBzdHIgKyBjYy5zdWJzdHIoaSArIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2M7XG4gICAgfVxuICB9XG5cbiAgY21kSW5zdGFuY2VGb3IoY21kKSB7XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsIHRoaXMpO1xuICB9XG5cbiAgZ2V0Q29tbWVudENoYXIoKSB7XG4gICAgdmFyIGNoYXIsIGNtZCwgaW5zdCwgcmVzO1xuICAgIGlmICh0aGlzLmNvbW1lbnRDaGFyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbW1lbnRDaGFyO1xuICAgIH1cbiAgICBjbWQgPSB0aGlzLmdldENtZCgnY29tbWVudCcpO1xuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaW5zdCA9IHRoaXMuY21kSW5zdGFuY2VGb3IoY21kKTtcbiAgICAgIGluc3QuY29udGVudCA9ICclcyc7XG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpO1xuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIGNoYXIgPSByZXM7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29tbWVudENoYXIgPSBjaGFyO1xuICAgIHJldHVybiB0aGlzLmNvbW1lbnRDaGFyO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQYWlyIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9QYWlyJztcblxuZXhwb3J0IGNsYXNzIERldGVjdG9yXG4gIGNvbnN0cnVjdG9yOiAoQGRhdGE9e30pIC0+XG4gIGRldGVjdDogKGZpbmRlcikgLT5cbiAgICBpZiBAZGV0ZWN0ZWQoZmluZGVyKVxuICAgICAgcmV0dXJuIEBkYXRhLnJlc3VsdCBpZiBAZGF0YS5yZXN1bHQ/XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBkYXRhLmVsc2UgaWYgQGRhdGEuZWxzZT9cbiAgZGV0ZWN0ZWQ6IChmaW5kZXIpIC0+XG4gICAgI1xuXG5leHBvcnQgY2xhc3MgTGFuZ0RldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3JcbiAgZGV0ZWN0OiAoZmluZGVyKSAtPlxuICAgIGlmIGZpbmRlci5jb2Rld2F2ZT8gXG4gICAgICBsYW5nID0gZmluZGVyLmNvZGV3YXZlLmVkaXRvci5nZXRMYW5nKClcbiAgICAgIGlmIGxhbmc/IFxuICAgICAgICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpXG4gICAgICAgIFxuZXhwb3J0IGNsYXNzIFBhaXJEZXRlY3RvciBleHRlbmRzIERldGVjdG9yXG4gIGRldGVjdGVkOiAoZmluZGVyKSAtPlxuICAgIGlmIEBkYXRhLm9wZW5lcj8gYW5kIEBkYXRhLmNsb3Nlcj8gYW5kIGZpbmRlci5pbnN0YW5jZT9cbiAgICAgIHBhaXIgPSBuZXcgUGFpcihAZGF0YS5vcGVuZXIsIEBkYXRhLmNsb3NlciwgQGRhdGEpXG4gICAgICBpZiBwYWlyLmlzV2FwcGVyT2YoZmluZGVyLmluc3RhbmNlLmdldFBvcygpLCBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLnRleHQoKSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgICAgICIsImltcG9ydCB7XG4gIFBhaXJcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9QYWlyJztcblxuZXhwb3J0IHZhciBEZXRlY3RvciA9IGNsYXNzIERldGVjdG9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSA9IHt9KSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGRldGVjdChmaW5kZXIpIHtcbiAgICBpZiAodGhpcy5kZXRlY3RlZChmaW5kZXIpKSB7XG4gICAgICBpZiAodGhpcy5kYXRhLnJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucmVzdWx0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5kYXRhLmVsc2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmVsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGV0ZWN0ZWQoZmluZGVyKSB7fVxuXG59O1xuXG5cbmV4cG9ydCB2YXIgTGFuZ0RldGVjdG9yID0gY2xhc3MgTGFuZ0RldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3Ige1xuICBkZXRlY3QoZmluZGVyKSB7XG4gICAgdmFyIGxhbmc7XG4gICAgaWYgKGZpbmRlci5jb2Rld2F2ZSAhPSBudWxsKSB7XG4gICAgICBsYW5nID0gZmluZGVyLmNvZGV3YXZlLmVkaXRvci5nZXRMYW5nKCk7XG4gICAgICBpZiAobGFuZyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBsYW5nLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn07XG5cbmV4cG9ydCB2YXIgUGFpckRldGVjdG9yID0gY2xhc3MgUGFpckRldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3Ige1xuICBkZXRlY3RlZChmaW5kZXIpIHtcbiAgICB2YXIgcGFpcjtcbiAgICBpZiAoKHRoaXMuZGF0YS5vcGVuZXIgIT0gbnVsbCkgJiYgKHRoaXMuZGF0YS5jbG9zZXIgIT0gbnVsbCkgJiYgKGZpbmRlci5pbnN0YW5jZSAhPSBudWxsKSkge1xuICAgICAgcGFpciA9IG5ldyBQYWlyKHRoaXMuZGF0YS5vcGVuZXIsIHRoaXMuZGF0YS5jbG9zZXIsIHRoaXMuZGF0YSk7XG4gICAgICBpZiAocGFpci5pc1dhcHBlck9mKGZpbmRlci5pbnN0YW5jZS5nZXRQb3MoKSwgZmluZGVyLmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgRWRpdENtZFByb3BcbiAgY29uc3RydWN0b3I6IChAbmFtZSxvcHRpb25zKSAtPlxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ3ZhcicgOiBudWxsLFxuICAgICAgJ29wdCcgOiBudWxsLFxuICAgICAgJ2Z1bmN0JyA6IG51bGwsXG4gICAgICAnZGF0YU5hbWUnIDogbnVsbCxcbiAgICAgICdzaG93RW1wdHknIDogZmFsc2UsXG4gICAgICAnY2FycmV0JyA6IGZhbHNlLFxuICAgIH1cbiAgICBmb3Iga2V5IGluIFsndmFyJywnb3B0JywnZnVuY3QnXVxuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgZGVmYXVsdHNbJ2RhdGFOYW1lJ10gPSBvcHRpb25zW2tleV1cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgICAgXG4gIHNldENtZDogKGNtZHMpIC0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQoQG5hbWUpXG4gIFxuICB3cml0ZUZvcjogKHBhcnNlcixvYmopIC0+XG4gICAgaWYgcGFyc2VyLnZhcnNbQG5hbWVdP1xuICAgICAgb2JqW0BkYXRhTmFtZV0gPSBwYXJzZXIudmFyc1tAbmFtZV1cbiAgdmFsRnJvbUNtZDogKGNtZCkgLT5cbiAgICBpZiBjbWQ/XG4gICAgICBpZiBAb3B0P1xuICAgICAgICByZXR1cm4gY21kLmdldE9wdGlvbihAb3B0KVxuICAgICAgaWYgQGZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kW0BmdW5jdF0oKVxuICAgICAgaWYgQHZhcj9cbiAgICAgICAgcmV0dXJuIGNtZFtAdmFyXVxuICBzaG93Rm9yQ21kOiAoY21kKSAtPlxuICAgIHZhbCA9IEB2YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gQHNob3dFbXB0eSBvciB2YWw/XG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgaWYgQHNob3dGb3JDbWQoY21kKVxuICAgICAgXCJcIlwiXG4gICAgICB+fiN7QG5hbWV9fn5cbiAgICAgICN7QHZhbEZyb21DbWQoY21kKSBvciBcIlwifSN7aWYgQGNhcnJldCB0aGVuIFwifFwiIGVsc2UgXCJcIn1cbiAgICAgIH5+LyN7QG5hbWV9fn5cbiAgICAgIFwiXCJcIlxuICAgIFxuICAgIFxuY2xhc3MgRWRpdENtZFByb3Auc291cmNlIGV4dGVuZHMgRWRpdENtZFByb3AgXG4gIHZhbEZyb21DbWQ6IChjbWQpLT5cbiAgICByZXMgPSBzdXBlcihjbWQpXG4gICAgaWYgcmVzP1xuICAgICAgcmVzID0gcmVzLnJlcGxhY2UoL1xcfC9nLCAnfHwnKVxuICAgIHJldHVybiByZXNcbiAgc2V0Q21kOiAoY21kcyktPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKEBuYW1lLHsncHJldmVudFBhcnNlQWxsJyA6IHRydWV9KVxuICBzaG93Rm9yQ21kOiAoY21kKSAtPlxuICAgIHZhbCA9IEB2YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gKEBzaG93RW1wdHkgYW5kICEoY21kPyBhbmQgY21kLmFsaWFzT2Y/KSkgb3IgdmFsP1xuICAgIFxuICAgIFxuY2xhc3MgRWRpdENtZFByb3Auc3RyaW5nIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICBpZiBAdmFsRnJvbUNtZChjbWQpP1xuICAgICAgcmV0dXJuIFwifn4hI3tAbmFtZX0gJyN7QHZhbEZyb21DbWQoY21kKX0je2lmIEBjYXJyZXQgdGhlbiBcInxcIiBlbHNlIFwiXCJ9J35+XCJcbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnJldkJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZChAbmFtZSlcbiAgd3JpdGVGb3I6IChwYXJzZXIsb2JqKSAtPlxuICAgIGlmIHBhcnNlci52YXJzW0BuYW1lXT9cbiAgICAgIG9ialtAZGF0YU5hbWVdID0gIXBhcnNlci52YXJzW0BuYW1lXVxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIHZhbCA9IEB2YWxGcm9tQ21kKGNtZClcbiAgICBpZiB2YWw/IGFuZCAhdmFsXG4gICAgICByZXR1cm4gXCJ+fiEje0BuYW1lfX5+XCJcblxuICAgIFxuY2xhc3MgRWRpdENtZFByb3AuYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIHNldENtZDogKGNtZHMpIC0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKEBuYW1lKVxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIFwifn4hI3tAbmFtZX1+flwiIGlmIEB2YWxGcm9tQ21kKGNtZCkiLCJpbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgRWRpdENtZFByb3AgPSBjbGFzcyBFZGl0Q21kUHJvcCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMsIGksIGtleSwgbGVuLCByZWYsIHZhbDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ3Zhcic6IG51bGwsXG4gICAgICAnb3B0JzogbnVsbCxcbiAgICAgICdmdW5jdCc6IG51bGwsXG4gICAgICAnZGF0YU5hbWUnOiBudWxsLFxuICAgICAgJ3Nob3dFbXB0eSc6IGZhbHNlLFxuICAgICAgJ2NhcnJldCc6IGZhbHNlXG4gICAgfTtcbiAgICByZWYgPSBbJ3ZhcicsICdvcHQnLCAnZnVuY3QnXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGtleSA9IHJlZltpXTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBkZWZhdWx0c1snZGF0YU5hbWUnXSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgd3JpdGVGb3IocGFyc2VyLCBvYmopIHtcbiAgICBpZiAocGFyc2VyLnZhcnNbdGhpcy5uYW1lXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gb2JqW3RoaXMuZGF0YU5hbWVdID0gcGFyc2VyLnZhcnNbdGhpcy5uYW1lXTtcbiAgICB9XG4gIH1cblxuICB2YWxGcm9tQ21kKGNtZCkge1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMub3B0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5nZXRPcHRpb24odGhpcy5vcHQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kW3RoaXMuZnVuY3RdKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy52YXIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kW3RoaXMudmFyXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzaG93Rm9yQ21kKGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0VtcHR5IHx8ICh2YWwgIT0gbnVsbCk7XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnNob3dGb3JDbWQoY21kKSkge1xuICAgICAgcmV0dXJuIGB+fiR7dGhpcy5uYW1lfX5+XFxuJHt0aGlzLnZhbEZyb21DbWQoY21kKSB8fCBcIlwifSR7KHRoaXMuY2FycmV0ID8gXCJ8XCIgOiBcIlwiKX1cXG5+fi8ke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWRQcm9wLnNvdXJjZSA9IGNsYXNzIHNvdXJjZSBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgdmFsRnJvbUNtZChjbWQpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IHN1cGVyLnZhbEZyb21DbWQoY21kKTtcbiAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKC9cXHwvZywgJ3x8Jyk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lLCB7XG4gICAgICAncHJldmVudFBhcnNlQWxsJzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgc2hvd0ZvckNtZChjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIHJldHVybiAodGhpcy5zaG93RW1wdHkgJiYgISgoY21kICE9IG51bGwpICYmIChjbWQuYWxpYXNPZiAhPSBudWxsKSkpIHx8ICh2YWwgIT0gbnVsbCk7XG4gIH1cblxufTtcblxuRWRpdENtZFByb3Auc3RyaW5nID0gY2xhc3Mgc3RyaW5nIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnZhbEZyb21DbWQoY21kKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfSAnJHt0aGlzLnZhbEZyb21DbWQoY21kKX0keyh0aGlzLmNhcnJldCA/IFwifFwiIDogXCJcIil9J35+YDtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZFByb3AucmV2Qm9vbCA9IGNsYXNzIHJldkJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIHdyaXRlRm9yKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9ialt0aGlzLmRhdGFOYW1lXSA9ICFwYXJzZXIudmFyc1t0aGlzLm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXkoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICBpZiAoKHZhbCAhPSBudWxsKSAmJiAhdmFsKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfX5+YDtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZFByb3AuYm9vbCA9IGNsYXNzIGJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfX5+YDtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IFN0clBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcbmltcG9ydCB7IG9wdGlvbmFsUHJvbWlzZSB9IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgY2xhc3MgRWRpdG9yXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBuYW1lc3BhY2UgPSBudWxsXG4gICAgQF9sYW5nID0gbnVsbFxuICBiaW5kZWRUbzogKGNvZGV3YXZlKSAtPlxuICAgICNcbiAgdGV4dDogKHZhbCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRDaGFyQXQ6IChwb3MpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0TGVuOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dFN1YnN0cjogKHN0YXJ0LCBlbmQpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBpbnNlcnRUZXh0QXQ6ICh0ZXh0LCBwb3MpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGdldEN1cnNvclBvczogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQgPSBudWxsKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgYmVnaW5VbmRvQWN0aW9uOiAtPlxuICAgICNcbiAgZW5kVW5kb0FjdGlvbjogLT5cbiAgICAjXG4gIGdldExhbmc6IC0+XG4gICAgcmV0dXJuIEBfbGFuZ1xuICBzZXRMYW5nOiAodmFsKSAtPlxuICAgIEBfbGFuZyA9IHZhbFxuICBnZXRFbW1ldENvbnRleHRPYmplY3Q6IC0+XG4gICAgcmV0dXJuIG51bGxcbiAgYWxsb3dNdWx0aVNlbGVjdGlvbjogLT5cbiAgICByZXR1cm4gZmFsc2VcbiAgc2V0TXVsdGlTZWw6IChzZWxlY3Rpb25zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgZ2V0TXVsdGlTZWw6IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBjYW5MaXN0ZW5Ub0NoYW5nZTogLT5cbiAgICByZXR1cm4gZmFsc2VcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBcbiAgZ2V0TGluZUF0OiAocG9zKSAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBmaW5kTGluZVN0YXJ0KHBvcyksQGZpbmRMaW5lRW5kKHBvcykpXG4gIGZpbmRMaW5lU3RhcnQ6IChwb3MpIC0+IFxuICAgIHAgPSBAZmluZEFueU5leHQocG9zICxbXCJcXG5cIl0sIC0xKVxuICAgIHJldHVybiBpZiBwIHRoZW4gcC5wb3MrMSBlbHNlIDBcbiAgZmluZExpbmVFbmQ6IChwb3MpIC0+IFxuICAgIHAgPSBAZmluZEFueU5leHQocG9zICxbXCJcXG5cIixcIlxcclwiXSlcbiAgICByZXR1cm4gaWYgcCB0aGVuIHAucG9zIGVsc2UgQHRleHRMZW4oKVxuICBcbiAgZmluZEFueU5leHQ6IChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbiA9IDEpIC0+IFxuICAgIGlmIGRpcmVjdGlvbiA+IDBcbiAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihzdGFydCxAdGV4dExlbigpKVxuICAgIGVsc2VcbiAgICAgIHRleHQgPSBAdGV4dFN1YnN0cigwLHN0YXJ0KVxuICAgIGJlc3RQb3MgPSBudWxsXG4gICAgZm9yIHN0cmkgaW4gc3RyaW5nc1xuICAgICAgcG9zID0gaWYgZGlyZWN0aW9uID4gMCB0aGVuIHRleHQuaW5kZXhPZihzdHJpKSBlbHNlIHRleHQubGFzdEluZGV4T2Yoc3RyaSlcbiAgICAgIGlmIHBvcyAhPSAtMVxuICAgICAgICBpZiAhYmVzdFBvcz8gb3IgYmVzdFBvcypkaXJlY3Rpb24gPiBwb3MqZGlyZWN0aW9uXG4gICAgICAgICAgYmVzdFBvcyA9IHBvc1xuICAgICAgICAgIGJlc3RTdHIgPSBzdHJpXG4gICAgaWYgYmVzdFN0cj9cbiAgICAgIHJldHVybiBuZXcgU3RyUG9zKChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gYmVzdFBvcyArIHN0YXJ0IGVsc2UgYmVzdFBvcyksYmVzdFN0cilcbiAgICByZXR1cm4gbnVsbFxuICBcbiAgYXBwbHlSZXBsYWNlbWVudHM6IChyZXBsYWNlbWVudHMpIC0+XG4gICAgcmVwbGFjZW1lbnRzLnJlZHVjZSgocHJvbWlzZSxyZXBsKT0+XG4gICAgICAgIHByb21pc2UudGhlbiAob3B0KT0+XG4gICAgICAgICAgcmVwbC53aXRoRWRpdG9yKHRoaXMpXG4gICAgICAgICAgcmVwbC5hcHBseU9mZnNldChvcHQub2Zmc2V0KVxuICAgICAgICAgIG9wdGlvbmFsUHJvbWlzZShyZXBsLmFwcGx5KCkpLnRoZW4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc2VsZWN0aW9uczogb3B0LnNlbGVjdGlvbnMuY29uY2F0KHJlcGwuc2VsZWN0aW9ucyksXG4gICAgICAgICAgICAgIG9mZnNldDogb3B0Lm9mZnNldCtyZXBsLm9mZnNldEFmdGVyKHRoaXMpIFxuICAgICAgICAgICAgfVxuICAgICAgLCBvcHRpb25hbFByb21pc2Uoe3NlbGVjdGlvbnM6IFtdLG9mZnNldDogMH0pKVxuICAgIC50aGVuIChvcHQpPT5cbiAgICAgIEBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMob3B0LnNlbGVjdGlvbnMpXG4gICAgLnJlc3VsdCgpXG4gICAgXG4gICAgICBcbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zOiAoc2VsZWN0aW9ucykgLT5cbiAgICBpZiBzZWxlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgIGlmIEBhbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICAgICAgQHNldE11bHRpU2VsKHNlbGVjdGlvbnMpXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCxzZWxlY3Rpb25zWzBdLmVuZCkiLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5pbXBvcnQge1xuICBTdHJQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuXG5pbXBvcnQge1xuICBvcHRpb25hbFByb21pc2Vcbn0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCB2YXIgRWRpdG9yID0gY2xhc3MgRWRpdG9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5uYW1lc3BhY2UgPSBudWxsO1xuICAgIHRoaXMuX2xhbmcgPSBudWxsO1xuICB9XG5cbiAgYmluZGVkVG8oY29kZXdhdmUpIHt9XG5cbiAgXG4gIHRleHQodmFsKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHRleHRDaGFyQXQocG9zKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHRleHRMZW4oKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHRleHRTdWJzdHIoc3RhcnQsIGVuZCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBpbnNlcnRUZXh0QXQodGV4dCwgcG9zKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRDdXJzb3JQb3MoKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHNldEN1cnNvclBvcyhzdGFydCwgZW5kID0gbnVsbCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBiZWdpblVuZG9BY3Rpb24oKSB7fVxuXG4gIFxuICBlbmRVbmRvQWN0aW9uKCkge31cblxuICBcbiAgZ2V0TGFuZygpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFuZztcbiAgfVxuXG4gIHNldExhbmcodmFsKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhbmcgPSB2YWw7XG4gIH1cblxuICBnZXRFbW1ldENvbnRleHRPYmplY3QoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhbGxvd011bHRpU2VsZWN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNldE11bHRpU2VsKHNlbGVjdGlvbnMpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0TXVsdGlTZWwoKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGNhbkxpc3RlblRvQ2hhbmdlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGdldExpbmVBdChwb3MpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLmZpbmRMaW5lU3RhcnQocG9zKSwgdGhpcy5maW5kTGluZUVuZChwb3MpKTtcbiAgfVxuXG4gIGZpbmRMaW5lU3RhcnQocG9zKSB7XG4gICAgdmFyIHA7XG4gICAgcCA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbXCJcXG5cIl0sIC0xKTtcbiAgICBpZiAocCkge1xuICAgICAgcmV0dXJuIHAucG9zICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG5cbiAgZmluZExpbmVFbmQocG9zKSB7XG4gICAgdmFyIHA7XG4gICAgcCA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbXCJcXG5cIiwgXCJcXHJcIl0pO1xuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRMZW4oKTtcbiAgICB9XG4gIH1cblxuICBmaW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgIHZhciBiZXN0UG9zLCBiZXN0U3RyLCBpLCBsZW4sIHBvcywgc3RyaSwgdGV4dDtcbiAgICBpZiAoZGlyZWN0aW9uID4gMCkge1xuICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihzdGFydCwgdGhpcy50ZXh0TGVuKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKDAsIHN0YXJ0KTtcbiAgICB9XG4gICAgYmVzdFBvcyA9IG51bGw7XG4gICAgZm9yIChpID0gMCwgbGVuID0gc3RyaW5ncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc3RyaSA9IHN0cmluZ3NbaV07XG4gICAgICBwb3MgPSBkaXJlY3Rpb24gPiAwID8gdGV4dC5pbmRleE9mKHN0cmkpIDogdGV4dC5sYXN0SW5kZXhPZihzdHJpKTtcbiAgICAgIGlmIChwb3MgIT09IC0xKSB7XG4gICAgICAgIGlmICgoYmVzdFBvcyA9PSBudWxsKSB8fCBiZXN0UG9zICogZGlyZWN0aW9uID4gcG9zICogZGlyZWN0aW9uKSB7XG4gICAgICAgICAgYmVzdFBvcyA9IHBvcztcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYmVzdFN0ciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFN0clBvcygoZGlyZWN0aW9uID4gMCA/IGJlc3RQb3MgKyBzdGFydCA6IGJlc3RQb3MpLCBiZXN0U3RyKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpIHtcbiAgICByZXR1cm4gcmVwbGFjZW1lbnRzLnJlZHVjZSgocHJvbWlzZSwgcmVwbCkgPT4ge1xuICAgICAgcmV0dXJuIHByb21pc2UudGhlbigob3B0KSA9PiB7XG4gICAgICAgIHJlcGwud2l0aEVkaXRvcih0aGlzKTtcbiAgICAgICAgcmVwbC5hcHBseU9mZnNldChvcHQub2Zmc2V0KTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbmFsUHJvbWlzZShyZXBsLmFwcGx5KCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZWxlY3Rpb25zOiBvcHQuc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKSxcbiAgICAgICAgICAgIG9mZnNldDogb3B0Lm9mZnNldCArIHJlcGwub2Zmc2V0QWZ0ZXIodGhpcylcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sIG9wdGlvbmFsUHJvbWlzZSh7XG4gICAgICBzZWxlY3Rpb25zOiBbXSxcbiAgICAgIG9mZnNldDogMFxuICAgIH0pKS50aGVuKChvcHQpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhvcHQuc2VsZWN0aW9ucyk7XG4gICAgfSkucmVzdWx0KCk7XG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMoc2VsZWN0aW9ucykge1xuICAgIGlmIChzZWxlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0aGlzLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRNdWx0aVNlbChzZWxlY3Rpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEN1cnNvclBvcyhzZWxlY3Rpb25zWzBdLnN0YXJ0LCBzZWxlY3Rpb25zWzBdLmVuZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgTG9nZ2VyXG4gIEBlbmFibGVkID0gdHJ1ZVxuICBsb2c6IChhcmdzLi4uKSAtPlxuICAgIGlmIEBpc0VuYWJsZWQoKVxuICAgICAgZm9yIG1zZyBpbiBhcmdzXG4gICAgICAgIGNvbnNvbGUubG9nKG1zZylcbiAgaXNFbmFibGVkOiAtPlxuICAgIGNvbnNvbGU/LmxvZz8gYW5kIHRoaXMuZW5hYmxlZCBhbmQgTG9nZ2VyLmVuYWJsZWRcbiAgZW5hYmxlZDogdHJ1ZVxuICBydW50aW1lOiAoZnVuY3QsbmFtZSA9IFwiZnVuY3Rpb25cIikgLT5cbiAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgcmVzID0gZnVuY3QoKVxuICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICBjb25zb2xlLmxvZyhcIiN7bmFtZX0gdG9vayAje3QxIC0gdDB9IG1pbGxpc2Vjb25kcy5cIilcbiAgICByZXNcbiAgbW9uaXRvckRhdGE6IHt9XG4gIHRvTW9uaXRvcjogKG9iaixuYW1lLHByZWZpeD0nJykgLT5cbiAgICBmdW5jdCA9IG9ialtuYW1lXVxuICAgIG9ialtuYW1lXSA9IC0+IFxuICAgICAgYXJncyA9IGFyZ3VtZW50c1xuICAgICAgdGhpcy5tb25pdG9yKCgtPiBmdW5jdC5hcHBseShvYmosYXJncykpLHByZWZpeCtuYW1lKVxuICBtb25pdG9yOiAoZnVuY3QsbmFtZSkgLT5cbiAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgcmVzID0gZnVuY3QoKVxuICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICBpZiB0aGlzLm1vbml0b3JEYXRhW25hbWVdP1xuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS5jb3VudCsrXG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLnRvdGFsKz0gdDEgLSB0MFxuICAgIGVsc2VcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0gPSB7XG4gICAgICAgIGNvdW50OiAxXG4gICAgICAgIHRvdGFsOiB0MSAtIHQwXG4gICAgICB9XG4gICAgcmVzXG4gIHJlc3VtZTogLT5cbiAgICBjb25zb2xlLmxvZyh0aGlzLm1vbml0b3JEYXRhKVxuIiwiZXhwb3J0IHZhciBMb2dnZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIExvZ2dlciB7XG4gICAgbG9nKC4uLmFyZ3MpIHtcbiAgICAgIHZhciBpLCBsZW4sIG1zZywgcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIG1zZyA9IGFyZ3NbaV07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKGNvbnNvbGUubG9nKG1zZykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgIHJldHVybiAoKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUgIT09IG51bGwgPyBjb25zb2xlLmxvZyA6IHZvaWQgMCkgIT0gbnVsbCkgJiYgdGhpcy5lbmFibGVkICYmIExvZ2dlci5lbmFibGVkO1xuICAgIH1cblxuICAgIHJ1bnRpbWUoZnVuY3QsIG5hbWUgPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhciByZXMsIHQwLCB0MTtcbiAgICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICByZXMgPSBmdW5jdCgpO1xuICAgICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIGNvbnNvbGUubG9nKGAke25hbWV9IHRvb2sgJHt0MSAtIHQwfSBtaWxsaXNlY29uZHMuYCk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHRvTW9uaXRvcihvYmosIG5hbWUsIHByZWZpeCA9ICcnKSB7XG4gICAgICB2YXIgZnVuY3Q7XG4gICAgICBmdW5jdCA9IG9ialtuYW1lXTtcbiAgICAgIHJldHVybiBvYmpbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbml0b3IoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBmdW5jdC5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgICB9KSwgcHJlZml4ICsgbmFtZSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIG1vbml0b3IoZnVuY3QsIG5hbWUpIHtcbiAgICAgIHZhciByZXMsIHQwLCB0MTtcbiAgICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICByZXMgPSBmdW5jdCgpO1xuICAgICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIGlmICh0aGlzLm1vbml0b3JEYXRhW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS5jb3VudCsrO1xuICAgICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLnRvdGFsICs9IHQxIC0gdDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdID0ge1xuICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgIHRvdGFsOiB0MSAtIHQwXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHJlc3VtZSgpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyh0aGlzLm1vbml0b3JEYXRhKTtcbiAgICB9XG5cbiAgfTtcblxuICBMb2dnZXIuZW5hYmxlZCA9IHRydWU7XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5lbmFibGVkID0gdHJ1ZTtcblxuICBMb2dnZXIucHJvdG90eXBlLm1vbml0b3JEYXRhID0ge307XG5cbiAgcmV0dXJuIExvZ2dlcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsImV4cG9ydCBjbGFzcyBPcHRpb25PYmplY3RcbiAgc2V0T3B0czogKG9wdGlvbnMsZGVmYXVsdHMpLT5cbiAgICBAZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIEBzZXRPcHQoa2V5LG9wdGlvbnNba2V5XSlcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldE9wdChrZXksdmFsKVxuICAgICAgICBcbiAgc2V0T3B0OiAoa2V5LCB2YWwpLT5cbiAgICBpZiB0aGlzW2tleV0/LmNhbGw/XG4gICAgICB0aGlzW2tleV0odmFsKVxuICAgIGVsc2VcbiAgICAgIHRoaXNba2V5XT0gdmFsXG4gICAgICAgIFxuICBnZXRPcHQ6IChrZXkpLT5cbiAgICBpZiB0aGlzW2tleV0/LmNhbGw/XG4gICAgICByZXR1cm4gdGhpc1trZXldKClcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGhpc1trZXldXG4gIFxuICBnZXRPcHRzOiAtPlxuICAgIG9wdHMgPSB7fVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIG9wdHNba2V5XSA9IEBnZXRPcHQoa2V5KVxuICAgIHJldHVybiBvcHRzIiwiZXhwb3J0IHZhciBPcHRpb25PYmplY3QgPSBjbGFzcyBPcHRpb25PYmplY3Qge1xuICBzZXRPcHRzKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gICAgdmFyIGtleSwgcmVmLCByZXN1bHRzLCB2YWw7XG4gICAgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc2V0T3B0KGtleSwgb3B0aW9uc1trZXldKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCB2YWwpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBzZXRPcHQoa2V5LCB2YWwpIHtcbiAgICB2YXIgcmVmO1xuICAgIGlmICgoKHJlZiA9IHRoaXNba2V5XSkgIT0gbnVsbCA/IHJlZi5jYWxsIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0KGtleSkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XTtcbiAgICB9XG4gIH1cblxuICBnZXRPcHRzKCkge1xuICAgIHZhciBrZXksIG9wdHMsIHJlZiwgdmFsO1xuICAgIG9wdHMgPSB7fTtcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBvcHRzW2tleV0gPSB0aGlzLmdldE9wdChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gb3B0cztcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ21kSW5zdGFuY2UgfSBmcm9tICcuL0NtZEluc3RhbmNlJztcbmltcG9ydCB7IEJveEhlbHBlciB9IGZyb20gJy4vQm94SGVscGVyJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IFN0clBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgZXh0ZW5kcyBDbWRJbnN0YW5jZVxuICBjb25zdHJ1Y3RvcjogKEBjb2Rld2F2ZSxAcG9zLEBzdHIpIC0+XG4gICAgc3VwZXIoKVxuICAgIHVubGVzcyBAaXNFbXB0eSgpXG4gICAgICBAX2NoZWNrQ2xvc2VyKClcbiAgICAgIEBvcGVuaW5nID0gQHN0clxuICAgICAgQG5vQnJhY2tldCA9IEBfcmVtb3ZlQnJhY2tldChAc3RyKVxuICAgICAgQF9zcGxpdENvbXBvbmVudHMoKVxuICAgICAgQF9maW5kQ2xvc2luZygpXG4gICAgICBAX2NoZWNrRWxvbmdhdGVkKClcbiAgX2NoZWNrQ2xvc2VyOiAtPlxuICAgIG5vQnJhY2tldCA9IEBfcmVtb3ZlQnJhY2tldChAc3RyKVxuICAgIGlmIG5vQnJhY2tldC5zdWJzdHJpbmcoMCxAY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCkgPT0gQGNvZGV3YXZlLmNsb3NlQ2hhciBhbmQgZiA9IEBfZmluZE9wZW5pbmdQb3MoKVxuICAgICAgQGNsb3NpbmdQb3MgPSBuZXcgU3RyUG9zKEBwb3MsIEBzdHIpXG4gICAgICBAcG9zID0gZi5wb3NcbiAgICAgIEBzdHIgPSBmLnN0clxuICBfZmluZE9wZW5pbmdQb3M6IC0+XG4gICAgY21kTmFtZSA9IEBfcmVtb3ZlQnJhY2tldChAc3RyKS5zdWJzdHJpbmcoQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpXG4gICAgb3BlbmluZyA9IEBjb2Rld2F2ZS5icmFrZXRzICsgY21kTmFtZVxuICAgIGNsb3NpbmcgPSBAc3RyXG4gICAgaWYgZiA9IEBjb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKEBwb3Msb3BlbmluZyxjbG9zaW5nLC0xKVxuICAgICAgZi5zdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZi5wb3MsQGNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGYucG9zK2Yuc3RyLmxlbmd0aCkrQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZcbiAgX3NwbGl0Q29tcG9uZW50czogLT5cbiAgICBwYXJ0cyA9IEBub0JyYWNrZXQuc3BsaXQoXCIgXCIpO1xuICAgIEBjbWROYW1lID0gcGFydHMuc2hpZnQoKVxuICAgIEByYXdQYXJhbXMgPSBwYXJ0cy5qb2luKFwiIFwiKVxuICBfcGFyc2VQYXJhbXM6KHBhcmFtcykgLT5cbiAgICBAcGFyYW1zID0gW11cbiAgICBAbmFtZWQgPSBAZ2V0RGVmYXVsdHMoKVxuICAgIGlmIEBjbWQ/XG4gICAgICBuYW1lVG9QYXJhbSA9IEBnZXRPcHRpb24oJ25hbWVUb1BhcmFtJylcbiAgICAgIGlmIG5hbWVUb1BhcmFtPyBcbiAgICAgICAgQG5hbWVkW25hbWVUb1BhcmFtXSA9IEBjbWROYW1lXG4gICAgaWYgcGFyYW1zLmxlbmd0aFxuICAgICAgYWxsb3dlZE5hbWVkID0gQGdldE9wdGlvbignYWxsb3dlZE5hbWVkJylcbiAgICAgIGluU3RyID0gZmFsc2VcbiAgICAgIHBhcmFtID0gJydcbiAgICAgIG5hbWUgPSBmYWxzZVxuICAgICAgZm9yIGkgaW4gWzAuLihwYXJhbXMubGVuZ3RoLTEpXVxuICAgICAgICBjaHIgPSBwYXJhbXNbaV1cbiAgICAgICAgaWYgY2hyID09ICcgJyBhbmQgIWluU3RyXG4gICAgICAgICAgaWYobmFtZSlcbiAgICAgICAgICAgIEBuYW1lZFtuYW1lXSA9IHBhcmFtXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHBhcmFtcy5wdXNoKHBhcmFtKVxuICAgICAgICAgIHBhcmFtID0gJydcbiAgICAgICAgICBuYW1lID0gZmFsc2VcbiAgICAgICAgZWxzZSBpZiBjaHIgaW4gWydcIicsXCInXCJdIGFuZCAoaSA9PSAwIG9yIHBhcmFtc1tpLTFdICE9ICdcXFxcJylcbiAgICAgICAgICBpblN0ciA9ICFpblN0clxuICAgICAgICBlbHNlIGlmIGNociA9PSAnOicgYW5kICFuYW1lIGFuZCAhaW5TdHIgYW5kICghYWxsb3dlZE5hbWVkPyBvciBwYXJhbSBpbiBhbGxvd2VkTmFtZWQpXG4gICAgICAgICAgbmFtZSA9IHBhcmFtXG4gICAgICAgICAgcGFyYW0gPSAnJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcGFyYW0gKz0gY2hyXG4gICAgICBpZiBwYXJhbS5sZW5ndGhcbiAgICAgICAgaWYobmFtZSlcbiAgICAgICAgICBAbmFtZWRbbmFtZV0gPSBwYXJhbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHBhcmFtcy5wdXNoKHBhcmFtKVxuICBfZmluZENsb3Npbmc6IC0+XG4gICAgaWYgZiA9IEBfZmluZENsb3NpbmdQb3MoKVxuICAgICAgQGNvbnRlbnQgPSBTdHJpbmdIZWxwZXIudHJpbUVtcHR5TGluZShAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcytAc3RyLmxlbmd0aCxmLnBvcykpXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZi5wb3MrZi5zdHIubGVuZ3RoKVxuICBfZmluZENsb3NpbmdQb3M6IC0+XG4gICAgcmV0dXJuIEBjbG9zaW5nUG9zIGlmIEBjbG9zaW5nUG9zP1xuICAgIGNsb3NpbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY21kTmFtZSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgb3BlbmluZyA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNtZE5hbWVcbiAgICBpZiBmID0gQGNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIoQHBvcytAc3RyLmxlbmd0aCwgb3BlbmluZywgY2xvc2luZylcbiAgICAgIHJldHVybiBAY2xvc2luZ1BvcyA9IGZcbiAgX2NoZWNrRWxvbmdhdGVkOiAtPlxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKVxuICAgIG1heCA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpXG4gICAgd2hpbGUgZW5kUG9zIDwgbWF4IGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLGVuZFBvcytAY29kZXdhdmUuZGVjby5sZW5ndGgpID09IEBjb2Rld2F2ZS5kZWNvXG4gICAgICBlbmRQb3MrPUBjb2Rld2F2ZS5kZWNvLmxlbmd0aFxuICAgIGlmIGVuZFBvcyA+PSBtYXggb3IgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSBpbiBbJyAnLFwiXFxuXCIsXCJcXHJcIl1cbiAgICAgIEBzdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyxlbmRQb3MpXG4gIF9jaGVja0JveDogLT5cbiAgICBpZiBAY29kZXdhdmUuaW5JbnN0YW5jZT8gYW5kIEBjb2Rld2F2ZS5pbkluc3RhbmNlLmNtZC5uYW1lID09ICdjb21tZW50J1xuICAgICAgcmV0dXJuXG4gICAgY2wgPSBAY29udGV4dC53cmFwQ29tbWVudExlZnQoKVxuICAgIGNyID0gQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpXG4gICAgZW5kUG9zID0gQGdldEVuZFBvcygpICsgY3IubGVuZ3RoXG4gICAgaWYgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MgLSBjbC5sZW5ndGgsQHBvcykgPT0gY2wgYW5kIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MgLSBjci5sZW5ndGgsZW5kUG9zKSA9PSBjclxuICAgICAgQHBvcyA9IEBwb3MgLSBjbC5sZW5ndGhcbiAgICAgIEBzdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyxlbmRQb3MpXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gICAgZWxzZSBpZiBAZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkuaW5kZXhPZihjbCkgPiAtMSBhbmQgQGdldFBvcygpLnNhbWVMaW5lc1N1ZmZpeCgpLmluZGV4T2YoY3IpID4gLTFcbiAgICAgIEBpbkJveCA9IDFcbiAgICAgIEBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KClcbiAgX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudDogLT5cbiAgICBpZiBAY29udGVudFxuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKVxuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb2Rld2F2ZS5kZWNvKVxuICAgICAgcmUxID0gbmV3IFJlZ0V4cChcIl5cXFxccyoje2VjbH0oPzoje2VkfSkrXFxcXHMqKC4qPylcXFxccyooPzoje2VkfSkrI3tlY3J9JFwiLCBcImdtXCIpXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXHI/XFxuXCIpXG4gICAgICByZTMgPSBuZXcgUmVnRXhwKFwiXFxuXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzKiRcIilcbiAgICAgIEBjb250ZW50ID0gQGNvbnRlbnQucmVwbGFjZShyZTEsJyQxJykucmVwbGFjZShyZTIsJycpLnJlcGxhY2UocmUzLCcnKVxuICBfZ2V0UGFyZW50Q21kczogLT5cbiAgICBAcGFyZW50ID0gQGNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZChAZ2V0RW5kUG9zKCkpPy5pbml0KClcbiAgc2V0TXVsdGlQb3M6IChtdWx0aVBvcykgLT5cbiAgICBAbXVsdGlQb3MgPSBtdWx0aVBvc1xuICBfZ2V0Q21kT2JqOiAtPlxuICAgIEBnZXRDbWQoKVxuICAgIEBfY2hlY2tCb3goKVxuICAgIEBjb250ZW50ID0gQHJlbW92ZUluZGVudEZyb21Db250ZW50KEBjb250ZW50KVxuICAgIHN1cGVyKClcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQF9wYXJzZVBhcmFtcyhAcmF3UGFyYW1zKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHJldHVybiBAY29udGV4dCBvciBAY29kZXdhdmUuY29udGV4dFxuICBnZXRDbWQ6IC0+XG4gICAgdW5sZXNzIEBjbWQ/XG4gICAgICBAX2dldFBhcmVudENtZHMoKVxuICAgICAgaWYgQG5vQnJhY2tldC5zdWJzdHJpbmcoMCxAY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyXG4gICAgICAgIEBjbWQgPSBDb21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKVxuICAgICAgICBAY29udGV4dCA9IEBjb2Rld2F2ZS5jb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIEBmaW5kZXIgPSBAZ2V0RmluZGVyKEBjbWROYW1lKVxuICAgICAgICBAY29udGV4dCA9IEBmaW5kZXIuY29udGV4dFxuICAgICAgICBAY21kID0gQGZpbmRlci5maW5kKClcbiAgICAgICAgaWYgQGNtZD9cbiAgICAgICAgICBAY29udGV4dC5hZGROYW1lU3BhY2UoQGNtZC5mdWxsTmFtZSlcbiAgICByZXR1cm4gQGNtZFxuICBnZXRGaW5kZXI6IChjbWROYW1lKS0+XG4gICAgZmluZGVyID0gQGNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsbmFtZXNwYWNlczpAX2dldFBhcmVudE5hbWVzcGFjZXMoKSlcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzXG4gICAgcmV0dXJuIGZpbmRlclxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICBuc3BjcyA9IFtdXG4gICAgb2JqID0gdGhpc1xuICAgIHdoaWxlIG9iai5wYXJlbnQ/XG4gICAgICBvYmogPSBvYmoucGFyZW50XG4gICAgICBuc3Bjcy5wdXNoKG9iai5jbWQuZnVsbE5hbWUpIGlmIG9iai5jbWQ/IGFuZCBvYmouY21kLmZ1bGxOYW1lP1xuICAgIHJldHVybiBuc3Bjc1xuICBfcmVtb3ZlQnJhY2tldDogKHN0ciktPlxuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCxzdHIubGVuZ3RoLUBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgYWx0ZXJBbGlhc09mOiAoYWxpYXNPZiktPlxuICAgIFtuc3BjLCBjbWROYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdChAY21kTmFtZSlcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLGNtZE5hbWUpXG4gIGlzRW1wdHk6IC0+XG4gICAgcmV0dXJuIEBzdHIgPT0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNvZGV3YXZlLmJyYWtldHMgb3IgQHN0ciA9PSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5icmFrZXRzXG4gIGV4ZWN1dGU6IC0+XG4gICAgaWYgQGlzRW1wdHkoKVxuICAgICAgaWYgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcD8gYW5kIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAud2hpdGhpbk9wZW5Cb3VuZHMoQHBvcyArIEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk/XG4gICAgICAgIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAuY2FuY2VsKClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlcGxhY2VXaXRoKCcnKVxuICAgIGVsc2UgaWYgQGNtZD9cbiAgICAgIGlmIGJlZm9yZUZ1bmN0ID0gQGdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpXG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpXG4gICAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgICBpZiAocmVzID0gQHJlc3VsdCgpKT9cbiAgICAgICAgICBAcmVwbGFjZVdpdGgocmVzKVxuICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBAcnVuRXhlY3V0ZUZ1bmN0KClcbiAgZ2V0RW5kUG9zOiAtPlxuICAgIHJldHVybiBAcG9zK0BzdHIubGVuZ3RoXG4gIGdldFBvczogLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAcG9zLEBwb3MrQHN0ci5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0T3BlbmluZ1BvczogLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAcG9zLEBwb3MrQG9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gIGdldEluZGVudDogLT5cbiAgICB1bmxlc3MgQGluZGVudExlbj9cbiAgICAgIGlmIEBpbkJveD9cbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcihAY29udGV4dClcbiAgICAgICAgQGluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KEBnZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKSkubGVuZ3RoXG4gICAgICBlbHNlXG4gICAgICAgIEBpbmRlbnRMZW4gPSBAcG9zIC0gQGdldFBvcygpLnByZXZFT0woKVxuICAgIHJldHVybiBAaW5kZW50TGVuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50OiAodGV4dCkgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycrQGdldEluZGVudCgpKyd9JywnZ20nKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsJycpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYWx0ZXJSZXN1bHRGb3JCb3g6IChyZXBsKSAtPlxuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KClcbiAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLGZhbHNlKVxuICAgIGlmIEBnZXRPcHRpb24oJ3JlcGxhY2VCb3gnKVxuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbClcbiAgICAgIFtyZXBsLnN0YXJ0LCByZXBsLmVuZF0gPSBbYm94LnN0YXJ0LCBib3guZW5kXVxuICAgICAgQGluZGVudExlbiA9IGhlbHBlci5pbmRlbnRcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKClcbiAgICAgIHJlcGwuZW5kID0gb3JpZ2luYWwubmV4dEVPTCgpXG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIEBjb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyBAY29kZXdhdmUubWFya2VyICsgb3JpZ2luYWwuc2FtZUxpbmVzU3VmZml4KCksIHttdWx0aWxpbmU6ZmFsc2V9KVxuICAgICAgW3JlcGwucHJlZml4LHJlcGwudGV4dCxyZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQoQGNvZGV3YXZlLm1hcmtlcilcbiAgICByZXR1cm4gcmVwbFxuICBnZXRDdXJzb3JGcm9tUmVzdWx0OiAocmVwbCkgLT5cbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpXG4gICAgaWYgQGNtZD8gYW5kIEBjb2Rld2F2ZS5jaGVja0NhcnJldCBhbmQgQGdldE9wdGlvbignY2hlY2tDYXJyZXQnKVxuICAgICAgaWYgKHAgPSBAY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpPyBcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCtyZXBsLnByZWZpeC5sZW5ndGgrcFxuICAgICAgcmVwbC50ZXh0ID0gQGNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpXG4gICAgcmV0dXJuIGN1cnNvclBvc1xuICBjaGVja011bHRpOiAocmVwbCkgLT5cbiAgICBpZiBAbXVsdGlQb3M/IGFuZCBAbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgcmVwbGFjZW1lbnRzID0gW3JlcGxdXG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpXG4gICAgICBmb3IgcG9zLCBpIGluIEBtdWx0aVBvc1xuICAgICAgICBpZiBpID09IDBcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydFxuICAgICAgICBlbHNlXG4gICAgICAgICAgbmV3UmVwbCA9IHJlcGwuY29weSgpLmFwcGx5T2Zmc2V0KHBvcy5zdGFydC1vcmlnaW5hbFBvcylcbiAgICAgICAgICBpZiBuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09IG9yaWdpbmFsVGV4dFxuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbClcbiAgICAgIHJldHVybiByZXBsYWNlbWVudHNcbiAgICBlbHNlXG4gICAgICByZXR1cm4gW3JlcGxdXG4gIHJlcGxhY2VXaXRoOiAodGV4dCkgLT5cbiAgICBAYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoQHBvcyxAZ2V0RW5kUG9zKCksdGV4dCkpXG4gIGFwcGx5UmVwbGFjZW1lbnQ6IChyZXBsKSAtPlxuICAgIHJlcGwud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICAgIGlmIEBpbkJveD9cbiAgICAgIEBhbHRlclJlc3VsdEZvckJveChyZXBsKVxuICAgIGVsc2VcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgY3Vyc29yUG9zID0gQGdldEN1cnNvckZyb21SZXN1bHQocmVwbClcbiAgICByZXBsLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyhjdXJzb3JQb3MsIGN1cnNvclBvcyldXG4gICAgcmVwbGFjZW1lbnRzID0gQGNoZWNrTXVsdGkocmVwbClcbiAgICBAcmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydFxuICAgIEByZXBsYWNlRW5kID0gcmVwbC5yZXNFbmQoKVxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICAgICIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5cbmltcG9ydCB7XG4gIEJveEhlbHBlclxufSBmcm9tICcuL0JveEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFN0clBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIE5hbWVzcGFjZUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSA9IGNsYXNzIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSBleHRlbmRzIENtZEluc3RhbmNlIHtcbiAgY29uc3RydWN0b3IoY29kZXdhdmUsIHBvczEsIHN0cjEpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTtcbiAgICB0aGlzLnBvcyA9IHBvczE7XG4gICAgdGhpcy5zdHIgPSBzdHIxO1xuICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHRoaXMuX2NoZWNrQ2xvc2VyKCk7XG4gICAgICB0aGlzLm9wZW5pbmcgPSB0aGlzLnN0cjtcbiAgICAgIHRoaXMubm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cik7XG4gICAgICB0aGlzLl9zcGxpdENvbXBvbmVudHMoKTtcbiAgICAgIHRoaXMuX2ZpbmRDbG9zaW5nKCk7XG4gICAgICB0aGlzLl9jaGVja0Vsb25nYXRlZCgpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Nsb3NlcigpIHtcbiAgICB2YXIgZiwgbm9CcmFja2V0O1xuICAgIG5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpO1xuICAgIGlmIChub0JyYWNrZXQuc3Vic3RyaW5nKDAsIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICYmIChmID0gdGhpcy5fZmluZE9wZW5pbmdQb3MoKSkpIHtcbiAgICAgIHRoaXMuY2xvc2luZ1BvcyA9IG5ldyBTdHJQb3ModGhpcy5wb3MsIHRoaXMuc3RyKTtcbiAgICAgIHRoaXMucG9zID0gZi5wb3M7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSBmLnN0cjtcbiAgICB9XG4gIH1cblxuICBfZmluZE9wZW5pbmdQb3MoKSB7XG4gICAgdmFyIGNsb3NpbmcsIGNtZE5hbWUsIGYsIG9wZW5pbmc7XG4gICAgY21kTmFtZSA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpO1xuICAgIG9wZW5pbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyBjbWROYW1lO1xuICAgIGNsb3NpbmcgPSB0aGlzLnN0cjtcbiAgICBpZiAoZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcywgb3BlbmluZywgY2xvc2luZywgLTEpKSB7XG4gICAgICBmLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZi5wb3MsIHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoZi5wb3MgKyBmLnN0ci5sZW5ndGgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk7XG4gICAgICByZXR1cm4gZjtcbiAgICB9XG4gIH1cblxuICBfc3BsaXRDb21wb25lbnRzKCkge1xuICAgIHZhciBwYXJ0cztcbiAgICBwYXJ0cyA9IHRoaXMubm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICB0aGlzLmNtZE5hbWUgPSBwYXJ0cy5zaGlmdCgpO1xuICAgIHJldHVybiB0aGlzLnJhd1BhcmFtcyA9IHBhcnRzLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgX3BhcnNlUGFyYW1zKHBhcmFtcykge1xuICAgIHZhciBhbGxvd2VkTmFtZWQsIGNociwgaSwgaW5TdHIsIGosIG5hbWUsIG5hbWVUb1BhcmFtLCBwYXJhbSwgcmVmO1xuICAgIHRoaXMucGFyYW1zID0gW107XG4gICAgdGhpcy5uYW1lZCA9IHRoaXMuZ2V0RGVmYXVsdHMoKTtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgbmFtZVRvUGFyYW0gPSB0aGlzLmdldE9wdGlvbignbmFtZVRvUGFyYW0nKTtcbiAgICAgIGlmIChuYW1lVG9QYXJhbSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubmFtZWRbbmFtZVRvUGFyYW1dID0gdGhpcy5jbWROYW1lO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFyYW1zLmxlbmd0aCkge1xuICAgICAgYWxsb3dlZE5hbWVkID0gdGhpcy5nZXRPcHRpb24oJ2FsbG93ZWROYW1lZCcpO1xuICAgICAgaW5TdHIgPSBmYWxzZTtcbiAgICAgIHBhcmFtID0gJyc7XG4gICAgICBuYW1lID0gZmFsc2U7XG4gICAgICBmb3IgKGkgPSBqID0gMCwgcmVmID0gcGFyYW1zLmxlbmd0aCAtIDE7ICgwIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWYpOyBpID0gMCA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgICAgY2hyID0gcGFyYW1zW2ldO1xuICAgICAgICBpZiAoY2hyID09PSAnICcgJiYgIWluU3RyKSB7XG4gICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZWRbbmFtZV0gPSBwYXJhbTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMucHVzaChwYXJhbSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmFtID0gJyc7XG4gICAgICAgICAgbmFtZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKChjaHIgPT09ICdcIicgfHwgY2hyID09PSBcIidcIikgJiYgKGkgPT09IDAgfHwgcGFyYW1zW2kgLSAxXSAhPT0gJ1xcXFwnKSkge1xuICAgICAgICAgIGluU3RyID0gIWluU3RyO1xuICAgICAgICB9IGVsc2UgaWYgKGNociA9PT0gJzonICYmICFuYW1lICYmICFpblN0ciAmJiAoKGFsbG93ZWROYW1lZCA9PSBudWxsKSB8fCBpbmRleE9mLmNhbGwoYWxsb3dlZE5hbWVkLCBwYXJhbSkgPj0gMCkpIHtcbiAgICAgICAgICBuYW1lID0gcGFyYW07XG4gICAgICAgICAgcGFyYW0gPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJhbSArPSBjaHI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5uYW1lZFtuYW1lXSA9IHBhcmFtO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnBhcmFtcy5wdXNoKHBhcmFtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9maW5kQ2xvc2luZygpIHtcbiAgICB2YXIgZjtcbiAgICBpZiAoZiA9IHRoaXMuX2ZpbmRDbG9zaW5nUG9zKCkpIHtcbiAgICAgIHRoaXMuY29udGVudCA9IFN0cmluZ0hlbHBlci50cmltRW1wdHlMaW5lKHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgsIGYucG9zKSk7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBmLnBvcyArIGYuc3RyLmxlbmd0aCk7XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRDbG9zaW5nUG9zKCkge1xuICAgIHZhciBjbG9zaW5nLCBmLCBvcGVuaW5nO1xuICAgIGlmICh0aGlzLmNsb3NpbmdQb3MgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1BvcztcbiAgICB9XG4gICAgY2xvc2luZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWROYW1lICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgIG9wZW5pbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZE5hbWU7XG4gICAgaWYgKGYgPSB0aGlzLmNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIodGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUG9zID0gZjtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tFbG9uZ2F0ZWQoKSB7XG4gICAgdmFyIGVuZFBvcywgbWF4LCByZWY7XG4gICAgZW5kUG9zID0gdGhpcy5nZXRFbmRQb3MoKTtcbiAgICBtYXggPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0TGVuKCk7XG4gICAgd2hpbGUgKGVuZFBvcyA8IG1heCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUuZGVjbykge1xuICAgICAgZW5kUG9zICs9IHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGg7XG4gICAgfVxuICAgIGlmIChlbmRQb3MgPj0gbWF4IHx8ICgocmVmID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGgpKSA9PT0gJyAnIHx8IHJlZiA9PT0gXCJcXG5cIiB8fCByZWYgPT09IFwiXFxyXCIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBlbmRQb3MpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0JveCgpIHtcbiAgICB2YXIgY2wsIGNyLCBlbmRQb3M7XG4gICAgaWYgKCh0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkgJiYgdGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlLmNtZC5uYW1lID09PSAnY29tbWVudCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2wgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCk7XG4gICAgY3IgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpO1xuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCkgKyBjci5sZW5ndGg7XG4gICAgaWYgKHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MgLSBjbC5sZW5ndGgsIHRoaXMucG9zKSA9PT0gY2wgJiYgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MgLSBjci5sZW5ndGgsIGVuZFBvcykgPT09IGNyKSB7XG4gICAgICB0aGlzLnBvcyA9IHRoaXMucG9zIC0gY2wubGVuZ3RoO1xuICAgICAgdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBlbmRQb3MpO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5nZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKS5pbmRleE9mKGNsKSA+IC0xICYmIHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzU3VmZml4KCkuaW5kZXhPZihjcikgPiAtMSkge1xuICAgICAgdGhpcy5pbkJveCA9IDE7XG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpIHtcbiAgICB2YXIgZWNsLCBlY3IsIGVkLCByZTEsIHJlMiwgcmUzO1xuICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCgpKTtcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSk7XG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb2Rld2F2ZS5kZWNvKTtcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2VjbH0oPzoke2VkfSkrXFxcXHMqKC4qPylcXFxccyooPzoke2VkfSkrJHtlY3J9JGAsIFwiZ21cIik7XG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBeXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxccj9cXG5gKTtcbiAgICAgIHJlMyA9IG5ldyBSZWdFeHAoYFxcblxcXFxzKiR7ZWNsfSg/OiR7ZWR9KSpcXFxccyokYCk7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ID0gdGhpcy5jb250ZW50LnJlcGxhY2UocmUxLCAnJDEnKS5yZXBsYWNlKHJlMiwgJycpLnJlcGxhY2UocmUzLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgX2dldFBhcmVudENtZHMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQgPSAocmVmID0gdGhpcy5jb2Rld2F2ZS5nZXRFbmNsb3NpbmdDbWQodGhpcy5nZXRFbmRQb3MoKSkpICE9IG51bGwgPyByZWYuaW5pdCgpIDogdm9pZCAwO1xuICB9XG5cbiAgc2V0TXVsdGlQb3MobXVsdGlQb3MpIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0aVBvcyA9IG11bHRpUG9zO1xuICB9XG5cbiAgX2dldENtZE9iaigpIHtcbiAgICB0aGlzLmdldENtZCgpO1xuICAgIHRoaXMuX2NoZWNrQm94KCk7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5yZW1vdmVJbmRlbnRGcm9tQ29udGVudCh0aGlzLmNvbnRlbnQpO1xuICAgIHJldHVybiBzdXBlci5fZ2V0Q21kT2JqKCk7XG4gIH1cblxuICBfaW5pdFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2VQYXJhbXModGhpcy5yYXdQYXJhbXMpO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IHRoaXMuY29kZXdhdmUuY29udGV4dDtcbiAgfVxuXG4gIGdldENtZCgpIHtcbiAgICBpZiAodGhpcy5jbWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fZ2V0UGFyZW50Q21kcygpO1xuICAgICAgaWYgKHRoaXMubm9CcmFja2V0LnN1YnN0cmluZygwLCB0aGlzLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSB7XG4gICAgICAgIHRoaXMuY21kID0gQ29tbWFuZC5jbWRzLmdldENtZCgnY29yZTpub19leGVjdXRlJyk7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY29kZXdhdmUuY29udGV4dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5nZXRGaW5kZXIodGhpcy5jbWROYW1lKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5maW5kZXIuY29udGV4dDtcbiAgICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKCk7XG4gICAgICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmFkZE5hbWVTcGFjZSh0aGlzLmNtZC5mdWxsTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY21kO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUpIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuY29kZXdhdmUuY29udGV4dC5nZXRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogdGhpcy5fZ2V0UGFyZW50TmFtZXNwYWNlcygpXG4gICAgfSk7XG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gZmluZGVyO1xuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMoKSB7XG4gICAgdmFyIG5zcGNzLCBvYmo7XG4gICAgbnNwY3MgPSBbXTtcbiAgICBvYmogPSB0aGlzO1xuICAgIHdoaWxlIChvYmoucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IG9iai5wYXJlbnQ7XG4gICAgICBpZiAoKG9iai5jbWQgIT0gbnVsbCkgJiYgKG9iai5jbWQuZnVsbE5hbWUgIT0gbnVsbCkpIHtcbiAgICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5zcGNzO1xuICB9XG5cbiAgX3JlbW92ZUJyYWNrZXQoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcodGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCwgc3RyLmxlbmd0aCAtIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpO1xuICB9XG5cbiAgYWx0ZXJBbGlhc09mKGFsaWFzT2YpIHtcbiAgICB2YXIgY21kTmFtZSwgbnNwYztcbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQodGhpcy5jbWROYW1lKTtcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBjbWROYW1lKTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cyB8fCB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgYmVmb3JlRnVuY3QsIHJlcztcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIGlmICgodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgIT0gbnVsbCkgJiYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKHRoaXMucG9zICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCkgIT0gbnVsbCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgoJycpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKGJlZm9yZUZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKSkge1xuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgaWYgKChyZXMgPSB0aGlzLnJlc3VsdCgpKSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgocmVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRXhlY3V0ZUZ1bmN0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RW5kUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aDtcbiAgfVxuXG4gIGdldFBvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICB9XG5cbiAgZ2V0T3BlbmluZ1BvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLm9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcbiAgfVxuXG4gIGdldEluZGVudCgpIHtcbiAgICB2YXIgaGVscGVyO1xuICAgIGlmICh0aGlzLmluZGVudExlbiA9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5pbkJveCAhPSBudWxsKSB7XG4gICAgICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0KTtcbiAgICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIucmVtb3ZlQ29tbWVudCh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IHRoaXMucG9zIC0gdGhpcy5nZXRQb3MoKS5wcmV2RU9MKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluZGVudExlbjtcbiAgfVxuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50KHRleHQpIHtcbiAgICB2YXIgcmVnO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoJ15cXFxcc3snICsgdGhpcy5nZXRJbmRlbnQoKSArICd9JywgJ2dtJyk7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhbHRlclJlc3VsdEZvckJveChyZXBsKSB7XG4gICAgdmFyIGJveCwgaGVscGVyLCBvcmlnaW5hbCwgcmVzO1xuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KCk7XG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLCBmYWxzZSk7XG4gICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCdyZXBsYWNlQm94JykpIHtcbiAgICAgIGJveCA9IGhlbHBlci5nZXRCb3hGb3JQb3Mob3JpZ2luYWwpO1xuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdO1xuICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIuaW5kZW50O1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgICByZXBsLnN0YXJ0ID0gb3JpZ2luYWwucHJldkVPTCgpO1xuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKCk7XG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIHRoaXMuY29kZXdhdmUubWFya2VyICsgcmVwbC50ZXh0ICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge1xuICAgICAgICBtdWx0aWxpbmU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIFtyZXBsLnByZWZpeCwgcmVwbC50ZXh0LCByZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQodGhpcy5jb2Rld2F2ZS5tYXJrZXIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVwbDtcbiAgfVxuXG4gIGdldEN1cnNvckZyb21SZXN1bHQocmVwbCkge1xuICAgIHZhciBjdXJzb3JQb3MsIHA7XG4gICAgY3Vyc29yUG9zID0gcmVwbC5yZXNQb3NCZWZvcmVQcmVmaXgoKTtcbiAgICBpZiAoKHRoaXMuY21kICE9IG51bGwpICYmIHRoaXMuY29kZXdhdmUuY2hlY2tDYXJyZXQgJiYgdGhpcy5nZXRPcHRpb24oJ2NoZWNrQ2FycmV0JykpIHtcbiAgICAgIGlmICgocCA9IHRoaXMuY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCArIHJlcGwucHJlZml4Lmxlbmd0aCArIHA7XG4gICAgICB9XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gY3Vyc29yUG9zO1xuICB9XG5cbiAgY2hlY2tNdWx0aShyZXBsKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV3UmVwbCwgb3JpZ2luYWxQb3MsIG9yaWdpbmFsVGV4dCwgcG9zLCByZWYsIHJlcGxhY2VtZW50cztcbiAgICBpZiAoKHRoaXMubXVsdGlQb3MgIT0gbnVsbCkgJiYgdGhpcy5tdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF07XG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpO1xuICAgICAgcmVmID0gdGhpcy5tdWx0aVBvcztcbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgIHBvcyA9IHJlZltpXTtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0IC0gb3JpZ2luYWxQb3MpO1xuICAgICAgICAgIGlmIChuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09PSBvcmlnaW5hbFRleHQpIHtcbiAgICAgICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ld1JlcGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtyZXBsXTtcbiAgICB9XG4gIH1cblxuICByZXBsYWNlV2l0aCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQodGhpcy5wb3MsIHRoaXMuZ2V0RW5kUG9zKCksIHRleHQpKTtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnQocmVwbCkge1xuICAgIHZhciBjdXJzb3JQb3MsIHJlcGxhY2VtZW50cztcbiAgICByZXBsLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYWx0ZXJSZXN1bHRGb3JCb3gocmVwbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICB9XG4gICAgY3Vyc29yUG9zID0gdGhpcy5nZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpO1xuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKGN1cnNvclBvcywgY3Vyc29yUG9zKV07XG4gICAgcmVwbGFjZW1lbnRzID0gdGhpcy5jaGVja011bHRpKHJlcGwpO1xuICAgIHRoaXMucmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydDtcbiAgICB0aGlzLnJlcGxhY2VFbmQgPSByZXBsLnJlc0VuZCgpO1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUHJvY2Vzc1xuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAjIiwiXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcic7XG5cbmV4cG9ydCBjbGFzcyBTdG9yYWdlXG4gIGNvbnN0cnVjdG9yOiAoQGVuZ2luZSkgLT5cblxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBpZiBAZW5naW5lQXZhaWxhYmxlKClcbiAgICAgIEBlbmdpbmUuc2F2ZShrZXksdmFsKVxuXG4gIHNhdmVJblBhdGg6IChwYXRoLCBrZXksIHZhbCkgLT5cbiAgICBpZiBAZW5naW5lQXZhaWxhYmxlKClcbiAgICAgIEBlbmdpbmUuc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbClcblxuICBsb2FkOiAoa2V5KSAtPlxuICAgIGlmIEBlbmdpbmU/XG4gICAgICBAZW5naW5lLmxvYWQoa2V5KVxuXG4gIGVuZ2luZUF2YWlsYWJsZTogKCkgLT5cbiAgICBpZiBAZW5naW5lP1xuICAgICAgdHJ1ZVxuICAgIGVsc2VcbiAgICAgIEBsb2dnZXIgPSBAbG9nZ2VyIHx8IG5ldyBMb2dnZXIoKVxuICAgICAgQGxvZ2dlci5sb2coJ05vIHN0b3JhZ2UgZW5naW5lIGF2YWlsYWJsZScpXG4gICAgICBmYWxzZVxuICAgICIsImltcG9ydCB7XG4gIExvZ2dlclxufSBmcm9tICcuL0xvZ2dlcic7XG5cbmV4cG9ydCB2YXIgU3RvcmFnZSA9IGNsYXNzIFN0b3JhZ2Uge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgfVxuXG4gIHNhdmUoa2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmUoa2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuXG4gIGxvYWQoa2V5KSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5sb2FkKGtleSk7XG4gICAgfVxuICB9XG5cbiAgZW5naW5lQXZhaWxhYmxlKCkge1xuICAgIGlmICh0aGlzLmVuZ2luZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dnZXIgPSB0aGlzLmxvZ2dlciB8fCBuZXcgTG9nZ2VyKCk7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ05vIHN0b3JhZ2UgZW5naW5lIGF2YWlsYWJsZScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBEb21LZXlMaXN0ZW5lclxuICBzdGFydExpc3RlbmluZzogKHRhcmdldCkgLT5cbiAgXG4gICAgdGltZW91dCA9IG51bGxcbiAgICBcbiAgICBvbmtleWRvd24gPSAoZSkgPT4gXG4gICAgICBpZiAoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgb3IgQG9iaiA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSBhbmQgZS5rZXlDb2RlID09IDY5ICYmIGUuY3RybEtleVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgQG9uQWN0aXZhdGlvbktleT9cbiAgICAgICAgICBAb25BY3RpdmF0aW9uS2V5KClcbiAgICBvbmtleXVwID0gKGUpID0+IFxuICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICBAb25BbnlDaGFuZ2UoZSlcbiAgICBvbmtleXByZXNzID0gKGUpID0+IFxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpIGlmIHRpbWVvdXQ/XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCAoPT5cbiAgICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgICAgKSwgMTAwXG4gICAgICAgICAgICBcbiAgICBpZiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lclxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgb25rZXlwcmVzcylcbiAgICBlbHNlIGlmIHRhcmdldC5hdHRhY2hFdmVudFxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcylcblxuaXNFbGVtZW50ID0gKG9iaikgLT5cbiAgdHJ5XG4gICAgIyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICBjYXRjaCBlXG4gICAgIyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgIyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgIyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG4gICAgcmV0dXJuICh0eXBlb2Ygb2JqPT1cIm9iamVjdFwiKSAmJlxuICAgICAgKG9iai5ub2RlVHlwZT09MSkgJiYgKHR5cGVvZiBvYmouc3R5bGUgPT0gXCJvYmplY3RcIikgJiZcbiAgICAgICh0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT1cIm9iamVjdFwiKVxuXG4gICAgICAgIFxuZXhwb3J0IGNsYXNzIFRleHRBcmVhRWRpdG9yIGV4dGVuZHMgVGV4dFBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEB0YXJnZXQpIC0+XG4gICAgc3VwZXIoKVxuICAgIEBvYmogPSBpZiBpc0VsZW1lbnQoQHRhcmdldCkgdGhlbiBAdGFyZ2V0IGVsc2UgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQHRhcmdldClcbiAgICB1bmxlc3MgQG9iaj9cbiAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCJcbiAgICBAbmFtZXNwYWNlID0gJ3RleHRhcmVhJ1xuICAgIEBjaGFuZ2VMaXN0ZW5lcnMgPSBbXVxuICAgIEBfc2tpcENoYW5nZUV2ZW50ID0gMFxuICBzdGFydExpc3RlbmluZzogRG9tS2V5TGlzdGVuZXIucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nXG4gIG9uQW55Q2hhbmdlOiAoZSkgLT5cbiAgICBpZiBAX3NraXBDaGFuZ2VFdmVudCA8PSAwXG4gICAgICBmb3IgY2FsbGJhY2sgaW4gQGNoYW5nZUxpc3RlbmVyc1xuICAgICAgICBjYWxsYmFjaygpXG4gICAgZWxzZVxuICAgICAgQF9za2lwQ2hhbmdlRXZlbnQtLVxuICAgICAgQG9uU2tpcGVkQ2hhbmdlKCkgaWYgQG9uU2tpcGVkQ2hhbmdlP1xuICBza2lwQ2hhbmdlRXZlbnQ6IChuYiA9IDEpIC0+XG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgKz0gbmJcbiAgYmluZGVkVG86IChjb2Rld2F2ZSkgLT5cbiAgICBAb25BY3RpdmF0aW9uS2V5ID0gLT4gY29kZXdhdmUub25BY3RpdmF0aW9uS2V5KClcbiAgICBAc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpXG4gIHNlbGVjdGlvblByb3BFeGlzdHM6IC0+XG4gICAgXCJzZWxlY3Rpb25TdGFydFwiIG9mIEBvYmpcbiAgaGFzRm9jdXM6IC0+IFxuICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaXMgQG9ialxuICB0ZXh0OiAodmFsKSAtPlxuICAgIGlmIHZhbD9cbiAgICAgIHVubGVzcyBAdGV4dEV2ZW50Q2hhbmdlKHZhbClcbiAgICAgICAgQG9iai52YWx1ZSA9IHZhbFxuICAgIEBvYmoudmFsdWVcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCwgZW5kKSBvciBAc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSBvciBzdXBlcihzdGFydCwgZW5kLCB0ZXh0KVxuICB0ZXh0RXZlbnRDaGFuZ2U6ICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIC0+XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50JykgaWYgZG9jdW1lbnQuY3JlYXRlRXZlbnQ/XG4gICAgaWYgZXZlbnQ/IGFuZCBldmVudC5pbml0VGV4dEV2ZW50PyBhbmQgZXZlbnQuaXNUcnVzdGVkICE9IGZhbHNlXG4gICAgICBlbmQgPSBAdGV4dExlbigpIHVubGVzcyBlbmQ/XG4gICAgICBpZiB0ZXh0Lmxlbmd0aCA8IDFcbiAgICAgICAgaWYgc3RhcnQgIT0gMFxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihzdGFydC0xLHN0YXJ0KVxuICAgICAgICAgIHN0YXJ0LS1cbiAgICAgICAgZWxzZSBpZiBlbmQgIT0gQHRleHRMZW4oKVxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihlbmQsZW5kKzEpXG4gICAgICAgICAgZW5kKytcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSlcbiAgICAgICMgQHNldEN1cnNvclBvcyhzdGFydCxlbmQpXG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBAb2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgICBAc2tpcENoYW5nZUV2ZW50KClcbiAgICAgIHRydWVcbiAgICBlbHNlIFxuICAgICAgZmFsc2VcbiAgc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZDogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBpZiBkb2N1bWVudC5leGVjQ29tbWFuZD9cbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpO1xuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuXG4gIGdldEN1cnNvclBvczogLT5cbiAgICByZXR1cm4gQHRtcEN1cnNvclBvcyBpZiBAdG1wQ3Vyc29yUG9zP1xuICAgIGlmIEBoYXNGb2N1c1xuICAgICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgICAgbmV3IFBvcyhAb2JqLnNlbGVjdGlvblN0YXJ0LEBvYmouc2VsZWN0aW9uRW5kKVxuICAgICAgZWxzZVxuICAgICAgICBAZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKVxuICBnZXRDdXJzb3JQb3NGYWxsYmFjazogLT5cbiAgICBpZiBAb2JqLmNyZWF0ZVRleHRSYW5nZVxuICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKClcbiAgICAgIGlmIHNlbC5wYXJlbnRFbGVtZW50KCkgaXMgQG9ialxuICAgICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayBzZWwuZ2V0Qm9va21hcmsoKVxuICAgICAgICBsZW4gPSAwXG5cbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgbGVuKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcm5nLnNldEVuZFBvaW50IFwiU3RhcnRUb1N0YXJ0XCIsIEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcG9zID0gbmV3IFBvcygwLGxlbilcbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgcG9zLnN0YXJ0KytcbiAgICAgICAgICBwb3MuZW5kKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcmV0dXJuIHBvc1xuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kKSAtPlxuICAgIGVuZCA9IHN0YXJ0IGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgIEB0bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIHNldFRpbWVvdXQgKD0+XG4gICAgICAgIEB0bXBDdXJzb3JQb3MgPSBudWxsXG4gICAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgKSwgMVxuICAgIGVsc2UgXG4gICAgICBAc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZClcbiAgICByZXR1cm5cbiAgc2V0Q3Vyc29yUG9zRmFsbGJhY2s6IChzdGFydCwgZW5kKSAtPlxuICAgIGlmIEBvYmouY3JlYXRlVGV4dFJhbmdlXG4gICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICBybmcubW92ZVN0YXJ0IFwiY2hhcmFjdGVyXCIsIHN0YXJ0XG4gICAgICBybmcuY29sbGFwc2UoKVxuICAgICAgcm5nLm1vdmVFbmQgXCJjaGFyYWN0ZXJcIiwgZW5kIC0gc3RhcnRcbiAgICAgIHJuZy5zZWxlY3QoKVxuICBnZXRMYW5nOiAtPlxuICAgIHJldHVybiBAX2xhbmcgaWYgQF9sYW5nXG4gICAgQG9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpIGlmIEBvYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKVxuICBzZXRMYW5nOiAodmFsKSAtPlxuICAgIEBfbGFuZyA9IHZhbFxuICAgIEBvYmouc2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnLHZhbClcbiAgY2FuTGlzdGVuVG9DaGFuZ2U6IC0+XG4gICAgcmV0dXJuIHRydWVcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBAY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgaWYgKGkgPSBAY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xXG4gICAgICBAY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpLCAxKVxuICAgICAgXG4gICAgICBcbiAgYXBwbHlSZXBsYWNlbWVudHM6IChyZXBsYWNlbWVudHMpIC0+XG4gICAgaWYgcmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgYW5kIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDFcbiAgICAgIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zID0gW0BnZXRDdXJzb3JQb3MoKV1cbiAgICBzdXBlcihyZXBsYWNlbWVudHMpO1xuICAgICAgIiwidmFyIGlzRWxlbWVudDtcblxuaW1wb3J0IHtcbiAgVGV4dFBhcnNlclxufSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5leHBvcnQgdmFyIERvbUtleUxpc3RlbmVyID0gY2xhc3MgRG9tS2V5TGlzdGVuZXIge1xuICBzdGFydExpc3RlbmluZyh0YXJnZXQpIHtcbiAgICB2YXIgb25rZXlkb3duLCBvbmtleXByZXNzLCBvbmtleXVwLCB0aW1lb3V0O1xuICAgIHRpbWVvdXQgPSBudWxsO1xuICAgIG9ua2V5ZG93biA9IChlKSA9PiB7XG4gICAgICBpZiAoKENvZGV3YXZlLmluc3RhbmNlcy5sZW5ndGggPCAyIHx8IHRoaXMub2JqID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSAmJiBlLmtleUNvZGUgPT09IDY5ICYmIGUuY3RybEtleSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLm9uQWN0aXZhdGlvbktleSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BY3RpdmF0aW9uS2V5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIG9ua2V5dXAgPSAoZSkgPT4ge1xuICAgICAgaWYgKHRoaXMub25BbnlDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkFueUNoYW5nZShlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIG9ua2V5cHJlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYgKHRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGltZW91dCA9IHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMub25BbnlDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQW55Q2hhbmdlKGUpO1xuICAgICAgICB9XG4gICAgICB9KSwgMTAwKTtcbiAgICB9O1xuICAgIGlmICh0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9ua2V5ZG93bik7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9ua2V5dXApO1xuICAgICAgcmV0dXJuIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgb25rZXlwcmVzcyk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuYXR0YWNoRXZlbnQpIHtcbiAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBvbmtleWRvd24pO1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXl1cFwiLCBvbmtleXVwKTtcbiAgICAgIHJldHVybiB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXByZXNzXCIsIG9ua2V5cHJlc3MpO1xuICAgIH1cbiAgfVxuXG59O1xuXG5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGU7XG4gIHRyeSB7XG4gICAgLy8gVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb20pXG4gICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICAvLyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgLy8gYW4gZXhjZXB0aW9uIGlzIHRocm93biBhbmQgd2UgZW5kIHVwIGhlcmUuIFRlc3Rpbmcgc29tZVxuICAgIC8vIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcbiAgICByZXR1cm4gKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpICYmIChvYmoubm9kZVR5cGUgPT09IDEpICYmICh0eXBlb2Ygb2JqLnN0eWxlID09PSBcIm9iamVjdFwiKSAmJiAodHlwZW9mIG9iai5vd25lckRvY3VtZW50ID09PSBcIm9iamVjdFwiKTtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBUZXh0QXJlYUVkaXRvciA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQxKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQxO1xuICAgICAgdGhpcy5vYmogPSBpc0VsZW1lbnQodGhpcy50YXJnZXQpID8gdGhpcy50YXJnZXQgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldCk7XG4gICAgICBpZiAodGhpcy5vYmogPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBcIlRleHRBcmVhIG5vdCBmb3VuZFwiO1xuICAgICAgfVxuICAgICAgdGhpcy5uYW1lc3BhY2UgPSAndGV4dGFyZWEnO1xuICAgICAgdGhpcy5jaGFuZ2VMaXN0ZW5lcnMgPSBbXTtcbiAgICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudCA9IDA7XG4gICAgfVxuXG4gICAgb25BbnlDaGFuZ2UoZSkge1xuICAgICAgdmFyIGNhbGxiYWNrLCBqLCBsZW4xLCByZWYsIHJlc3VsdHM7XG4gICAgICBpZiAodGhpcy5fc2tpcENoYW5nZUV2ZW50IDw9IDApIHtcbiAgICAgICAgcmVmID0gdGhpcy5jaGFuZ2VMaXN0ZW5lcnM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZi5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBjYWxsYmFjayA9IHJlZltqXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY2FsbGJhY2soKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQtLTtcbiAgICAgICAgaWYgKHRoaXMub25Ta2lwZWRDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uU2tpcGVkQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBza2lwQ2hhbmdlRXZlbnQobmIgPSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2tpcENoYW5nZUV2ZW50ICs9IG5iO1xuICAgIH1cblxuICAgIGJpbmRlZFRvKGNvZGV3YXZlKSB7XG4gICAgICB0aGlzLm9uQWN0aXZhdGlvbktleSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29kZXdhdmUub25BY3RpdmF0aW9uS2V5KCk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpO1xuICAgIH1cblxuICAgIHNlbGVjdGlvblByb3BFeGlzdHMoKSB7XG4gICAgICByZXR1cm4gXCJzZWxlY3Rpb25TdGFydFwiIGluIHRoaXMub2JqO1xuICAgIH1cblxuICAgIGhhc0ZvY3VzKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMub2JqO1xuICAgIH1cblxuICAgIHRleHQodmFsKSB7XG4gICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHRFdmVudENoYW5nZSh2YWwpKSB7XG4gICAgICAgICAgdGhpcy5vYmoudmFsdWUgPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iai52YWx1ZTtcbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCwgZW5kKSB8fCB0aGlzLnNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQodGV4dCwgc3RhcnQsIGVuZCkgfHwgc3VwZXIuc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KTtcbiAgICB9XG5cbiAgICB0ZXh0RXZlbnRDaGFuZ2UodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSB7XG4gICAgICB2YXIgZXZlbnQ7XG4gICAgICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQgIT0gbnVsbCkge1xuICAgICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUZXh0RXZlbnQnKTtcbiAgICAgIH1cbiAgICAgIGlmICgoZXZlbnQgIT0gbnVsbCkgJiYgKGV2ZW50LmluaXRUZXh0RXZlbnQgIT0gbnVsbCkgJiYgZXZlbnQuaXNUcnVzdGVkICE9PSBmYWxzZSkge1xuICAgICAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgICAgICBlbmQgPSB0aGlzLnRleHRMZW4oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGV4dC5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgaWYgKHN0YXJ0ICE9PSAwKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0IC0gMSwgc3RhcnQpO1xuICAgICAgICAgICAgc3RhcnQtLTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVuZCAhPT0gdGhpcy50ZXh0TGVuKCkpIHtcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoZW5kLCBlbmQgKyAxKTtcbiAgICAgICAgICAgIGVuZCsrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGV2ZW50LmluaXRUZXh0RXZlbnQoJ3RleHRJbnB1dCcsIHRydWUsIHRydWUsIG51bGwsIHRleHQsIDkpO1xuICAgICAgICAvLyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICB0aGlzLm9iai5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgdGhpcy5za2lwQ2hhbmdlRXZlbnQoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIGlmIChkb2N1bWVudC5leGVjQ29tbWFuZCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZDtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEN1cnNvclBvcygpIHtcbiAgICAgIGlmICh0aGlzLnRtcEN1cnNvclBvcyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRtcEN1cnNvclBvcztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmhhc0ZvY3VzKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFBvcyh0aGlzLm9iai5zZWxlY3Rpb25TdGFydCwgdGhpcy5vYmouc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJzb3JQb3NGYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKSB7XG4gICAgICB2YXIgbGVuLCBwb3MsIHJuZywgc2VsO1xuICAgICAgaWYgKHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSkge1xuICAgICAgICBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgaWYgKHNlbC5wYXJlbnRFbGVtZW50KCkgPT09IHRoaXMub2JqKSB7XG4gICAgICAgICAgcm5nID0gdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgcm5nLm1vdmVUb0Jvb2ttYXJrKHNlbC5nZXRCb29rbWFyaygpKTtcbiAgICAgICAgICBsZW4gPSAwO1xuICAgICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIGxlbisrO1xuICAgICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBybmcuc2V0RW5kUG9pbnQoXCJTdGFydFRvU3RhcnRcIiwgdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKCkpO1xuICAgICAgICAgIHBvcyA9IG5ldyBQb3MoMCwgbGVuKTtcbiAgICAgICAgICB3aGlsZSAocm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwKSB7XG4gICAgICAgICAgICBwb3Muc3RhcnQrKztcbiAgICAgICAgICAgIHBvcy5lbmQrKztcbiAgICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25Qcm9wRXhpc3RzKSB7XG4gICAgICAgIHRoaXMudG1wQ3Vyc29yUG9zID0gbmV3IFBvcyhzdGFydCwgZW5kKTtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICBzZXRUaW1lb3V0KCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBudWxsO1xuICAgICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZDtcbiAgICAgICAgfSksIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKSB7XG4gICAgICB2YXIgcm5nO1xuICAgICAgaWYgKHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSkge1xuICAgICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgcm5nLm1vdmVTdGFydChcImNoYXJhY3RlclwiLCBzdGFydCk7XG4gICAgICAgIHJuZy5jb2xsYXBzZSgpO1xuICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCBlbmQgLSBzdGFydCk7XG4gICAgICAgIHJldHVybiBybmcuc2VsZWN0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGFuZygpIHtcbiAgICAgIGlmICh0aGlzLl9sYW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub2JqLmhhc0F0dHJpYnV0ZSgnZGF0YS1sYW5nJykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0TGFuZyh2YWwpIHtcbiAgICAgIHRoaXMuX2xhbmcgPSB2YWw7XG4gICAgICByZXR1cm4gdGhpcy5vYmouc2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnLCB2YWwpO1xuICAgIH1cblxuICAgIGNhbkxpc3RlblRvQ2hhbmdlKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYW5nZUxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgdmFyIGk7XG4gICAgICBpZiAoKGkgPSB0aGlzLmNoYW5nZUxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cykge1xuICAgICAgaWYgKHJlcGxhY2VtZW50cy5sZW5ndGggPiAwICYmIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbdGhpcy5nZXRDdXJzb3JQb3MoKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwZXIuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgICB9XG5cbiAgfTtcblxuICBUZXh0QXJlYUVkaXRvci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmcgPSBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmc7XG5cbiAgcmV0dXJuIFRleHRBcmVhRWRpdG9yO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSAnLi9FZGl0b3InO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5leHBvcnQgY2xhc3MgVGV4dFBhcnNlciBleHRlbmRzIEVkaXRvclxuICBjb25zdHJ1Y3RvcjogKEBfdGV4dCkgLT5cbiAgICBzdXBlcigpXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgQF90ZXh0ID0gdmFsIGlmIHZhbD9cbiAgICBAX3RleHRcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICByZXR1cm4gQHRleHQoKVtwb3NdXG4gIHRleHRMZW46IChwb3MpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KCkubGVuZ3RoXG4gIHRleHRTdWJzdHI6IChzdGFydCwgZW5kKSAtPlxuICAgIHJldHVybiBAdGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICBpbnNlcnRUZXh0QXQ6ICh0ZXh0LCBwb3MpIC0+XG4gICAgQHRleHQoQHRleHQoKS5zdWJzdHJpbmcoMCwgcG9zKSt0ZXh0K0B0ZXh0KCkuc3Vic3RyaW5nKHBvcyxAdGV4dCgpLmxlbmd0aCkpXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIEB0ZXh0KEB0ZXh0KCkuc2xpY2UoMCwgc3RhcnQpICsgKHRleHQgfHwgXCJcIikgKyBAdGV4dCgpLnNsaWNlKGVuZCkpXG4gIGdldEN1cnNvclBvczogLT5cbiAgICByZXR1cm4gQHRhcmdldFxuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kKSAtPlxuICAgIGVuZCA9IHN0YXJ0IGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgQHRhcmdldCA9IG5ldyBQb3MoIHN0YXJ0LCBlbmQgKSIsImltcG9ydCB7XG4gIEVkaXRvclxufSBmcm9tICcuL0VkaXRvcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCB2YXIgVGV4dFBhcnNlciA9IGNsYXNzIFRleHRQYXJzZXIgZXh0ZW5kcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcihfdGV4dCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fdGV4dCA9IF90ZXh0O1xuICB9XG5cbiAgdGV4dCh2YWwpIHtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHQgPSB2YWw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICB9XG5cbiAgdGV4dENoYXJBdChwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KClbcG9zXTtcbiAgfVxuXG4gIHRleHRMZW4ocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLmxlbmd0aDtcbiAgfVxuXG4gIHRleHRTdWJzdHIoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gIH1cblxuICBpbnNlcnRUZXh0QXQodGV4dCwgcG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zdWJzdHJpbmcoMCwgcG9zKSArIHRleHQgKyB0aGlzLnRleHQoKS5zdWJzdHJpbmcocG9zLCB0aGlzLnRleHQoKS5sZW5ndGgpKTtcbiAgfVxuXG4gIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLnRleHQodGhpcy50ZXh0KCkuc2xpY2UoMCwgc3RhcnQpICsgKHRleHQgfHwgXCJcIikgKyB0aGlzLnRleHQoKS5zbGljZShlbmQpKTtcbiAgfVxuXG4gIGdldEN1cnNvclBvcygpIHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXQ7XG4gIH1cblxuICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgZW5kID0gc3RhcnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRhcmdldCA9IG5ldyBQb3Moc3RhcnQsIGVuZCk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcbmltcG9ydCB7IENvcmVDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBKc0NvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9Kc0NvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBQaHBDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IEh0bWxDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBXcmFwcGVkUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9XcmFwcGVkUG9zJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZUVuZ2luZSB9IGZyb20gJy4vc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lJztcblxuUG9zLndyYXBDbGFzcyA9IFdyYXBwZWRQb3NcblxuQ29kZXdhdmUuaW5zdGFuY2VzID0gW11cblxuQ29tbWFuZC5wcm92aWRlcnMgPSBbXG4gIG5ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IEpzQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IFBocENvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKClcbl1cblxuaWYgbG9jYWxTdG9yYWdlP1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlRW5naW5lKClcblxuZXhwb3J0IHsgQ29kZXdhdmUgfSIsImltcG9ydCB7XG4gIENvZGV3YXZlXG59IGZyb20gJy4vQ29kZXdhdmUnO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIENvcmVDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBKc0NvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvSnNDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBQaHBDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL1BocENvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIEh0bWxDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5pbXBvcnQge1xuICBXcmFwcGVkUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvV3JhcHBlZFBvcyc7XG5cbmltcG9ydCB7XG4gIExvY2FsU3RvcmFnZUVuZ2luZVxufSBmcm9tICcuL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZSc7XG5cblBvcy53cmFwQ2xhc3MgPSBXcmFwcGVkUG9zO1xuXG5Db2Rld2F2ZS5pbnN0YW5jZXMgPSBbXTtcblxuQ29tbWFuZC5wcm92aWRlcnMgPSBbbmV3IENvcmVDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEpzQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBQaHBDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEh0bWxDb21tYW5kUHJvdmlkZXIoKV07XG5cbmlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlRW5naW5lKCk7XG59XG5cbmV4cG9ydCB7XG4gIENvZGV3YXZlXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kLCBCYXNlQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgTGFuZ0RldGVjdG9yIH0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi4vQm94SGVscGVyJztcbmltcG9ydCB7IEVkaXRDbWRQcm9wIH0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGF0aEhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvUGF0aEhlbHBlcic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKVxuICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSlcbiAgXG4gIGNvcmUuYWRkQ21kcyh7XG4gICAgJ2hlbHAnOntcbiAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAncmVzdWx0JyA6IGhlbHAsXG4gICAgICAncGFyc2UnIDogdHJ1ZSxcbiAgICAgICdhbGxvd2VkTmFtZWQnIDogWydjbWQnXSxcbiAgICAgICdoZWxwJyA6IFwiXCJcIlxuICAgICAgICBUbyBnZXQgaGVscCBvbiBhIHBlY2lmaWMgY29tbWFuZCwgZG8gOlxuICAgICAgICB+fmhlbHAgaGVsbG9+fiAoaGVsbG8gYmVpbmcgdGhlIGNvbW1hbmQpXG4gICAgICAgIFwiXCJcIiBcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ292ZXJ2aWV3Jzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgICBfX18gICAgICAgICBfICAgX18gICAgICBfX1xuICAgICAgICAgICAgIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xuICAgICAgICAgICAgLyAvX18vIF8gXFxcXC8gX2AgLyAtX1xcXFwgXFxcXC9cXFxcLyAvIF9gIFxcXFwgViAvIC1fL1xuICAgICAgICAgICAgXFxcXF9fX19cXFxcX19fL1xcXFxfXyxfXFxcXF9fX3xcXFxcXy9cXFxcXy9cXFxcX18sX3xcXFxcXy9cXFxcX19ffFxuICAgICAgICAgICAgVGhlIHRleHQgZWRpdG9yIGhlbHBlclxuICAgICAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcbiAgICAgICAgICAgIHlvdXIgdGV4dCBlZGl0b3IuIFRoZXNlIGNvbW1hbmRzIG11c3QgYmUgcGxhY2VkIGJldHdlZW4gdHdvIFxuICAgICAgICAgICAgcGFpcnMgb2YgXCJ+XCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXG4gICAgICAgICAgICBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIsIHdpdGggeW91ciBjdXJzb3IgaW5zaWRlIHRoZSBjb21tYW5kXG4gICAgICAgICAgICBFeDogfn4haGVsbG9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBZb3UgZG9udCBuZWVkIHRvIGFjdHVhbGx5IHR5cGUgYW55IFwiflwiICh0aWxkZSkuIFxuICAgICAgICAgICAgUHJlc3NpbmcgXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiIHdpbGwgYWRkIHRoZW0gaWYgeW91IGFyZSBub3QgYWxyZWFkeVxuICAgICAgICAgICAgd2l0aGluIGEgY29tbWFuZC5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29kZXdhdmUgZG9lcyBub3QgdXNlIFVJIHRvIGRpc3BsYXkgYW55IGluZm9ybWF0aW9uLiBcbiAgICAgICAgICAgIEluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxuICAgICAgICAgICAgVGhlIGdlbmVyYXRlZCBjb21tZW50IGJsb2NrcyB3aWxsIGJlIHJlZmVycmVkIHRvIGFzIHdpbmRvd3MgXG4gICAgICAgICAgICBpbiB0aGUgaGVscCBzZWN0aW9ucy5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgVG8gY2xvc2UgdGhpcyB3aW5kb3cgKGkuZS4gcmVtb3ZlIHRoaXMgY29tbWVudCBibG9jayksIHByZXNzIFxuICAgICAgICAgICAgXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiIHdpdGggeW91ciBjdXJzb3Igb24gdGhlIGxpbmUgYmVsbG93LlxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgVXNlIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBmb3IgYSB3YWxrdGhyb3VnaCBvZiBzb21lIG9mIHRoZSBtYW55XG4gICAgICAgICAgICBmZWF0dXJlcyBvZiBDb2Rld2F2ZVxuICAgICAgICAgICAgfn4haGVscDpnZXRfc3RhcnRlZH5+IG9yIH5+IWhlbHA6ZGVtb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIExpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXG4gICAgICAgICAgICB+fiFoZWxwOnN1YmplY3Rzfn4gb3Igfn4haGVscDpzdWJ+fiBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn4hY2xvc2V+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdzdWJqZWN0cyc6e1xuICAgICAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICAgIH5+IWhlbHB+flxuICAgICAgICAgICAgfn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcbiAgICAgICAgICAgIH5+IWhlbHA6c3ViamVjdHN+fiAofn4haGVscDpzdWJ+filcbiAgICAgICAgICAgIH5+IWhlbHA6ZWRpdGluZ35+ICh+fiFoZWxwOmVkaXR+filcbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ3N1Yic6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6c3ViamVjdHMnXG4gICAgICAgIH1cbiAgICAgICAgJ2dldF9zdGFydGVkJzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgVGhlIGNsYXNzaWMgSGVsbG8gV29ybGQuXG4gICAgICAgICAgICB+fiFoZWxsb3x+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fmhlbHA6ZWRpdGluZzppbnRyb35+XG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGNyZWF0aW5nIHlvdXIgb3duIGNvbW1hbmRzLCBzZWU6XG4gICAgICAgICAgICB+fiFoZWxwOmVkaXRpbmd+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2Rld2F2ZSBjb21lcyB3aXRoIG1hbnkgcHJlLWV4aXN0aW5nIGNvbW1hbmRzLiBIZXJlIGlzIGFuIGV4YW1wbGVcbiAgICAgICAgICAgIG9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xuICAgICAgICAgICAgfn4hanM6Zn5+XG4gICAgICAgICAgICB+fiFqczppZn5+XG4gICAgICAgICAgICAgIH5+IWpzOmxvZ35+XCJ+fiFoZWxsb35+XCJ+fiEvanM6bG9nfn5cbiAgICAgICAgICAgIH5+IS9qczppZn5+XG4gICAgICAgICAgICB+fiEvanM6Zn5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcbiAgICAgICAgICAgIHByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLiBFbW1ldCBhYmJyZXZpYXRpb25zIHdpbGwgYmUgXG4gICAgICAgICAgICB1c2VkIGF1dG9tYXRpY2FsbHkgaWYgeW91IGFyZSBpbiBhIEhUTUwgb3IgQ1NTIGZpbGUuXG4gICAgICAgICAgICB+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXG4gICAgICAgICAgICB+fiFlbW1ldCB1bD5saX5+XG4gICAgICAgICAgICB+fiFlbW1ldCBtMiBjc3N+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb21tYW5kcyBhcmUgc3RvcmVkIGluIG5hbWVzcGFjZXMuIFRoZSBzYW1lIGNvbW1hbmQgY2FuIGhhdmUgXG4gICAgICAgICAgICBkaWZmZXJlbnQgcmVzdWx0cyBkZXBlbmRpbmcgb24gdGhlIG5hbWVzcGFjZS5cbiAgICAgICAgICAgIH5+IWpzOmVhY2h+flxuICAgICAgICAgICAgfn4hcGhwOm91dGVyOmVhY2h+flxuICAgICAgICAgICAgfn4hcGhwOmlubmVyOmVhY2h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBTb21lIG9mIHRoZSBuYW1lc3BhY2VzIGFyZSBhY3RpdmUgZGVwZW5kaW5nIG9uIHRoZSBjb250ZXh0LiBUaGVcbiAgICAgICAgICAgIGZvbGxvd2luZyBjb21tYW5kcyBhcmUgdGhlIHNhbWUgYW5kIHdpbGwgZGlzcGxheSB0aGUgY3VycmVudGx5XG4gICAgICAgICAgICBhY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxuICAgICAgICAgICAgY29yZSBuYW1lc3BhY2UgaXMgYWN0aXZlLlxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlfn5cbiAgICAgICAgICAgIH5+IWNvcmU6bmFtZXNwYWNlfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgWW91IGNhbiBtYWtlIGEgbmFtZXNwYWNlIGFjdGl2ZSB3aXRoIHRoZSBmb2xsb3dpbmcgY29tbWFuZC5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZSBwaHB+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDaGVjayB0aGUgbmFtZXNwYWNlcyBhZ2FpblxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgSW4gYWRkaXRpb24gdG8gZGV0ZWN0aW5nIHRoZSBkb2N1bWVudCB0eXBlLCBDb2Rld2F2ZSBjYW4gZGV0ZWN0IHRoZVxuICAgICAgICAgICAgY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcbiAgICAgICAgICAgIHdpbGwgYWRkIHRoZSBQSFAgdGFncyB3aGVuIHlvdSBuZWVkIHRoZW0uXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdkZW1vJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpnZXRfc3RhcnRlZCdcbiAgICAgICAgfVxuICAgICAgICAnZWRpdGluZyc6e1xuICAgICAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgICAgICdpbnRybyc6e1xuICAgICAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgICAgIENvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXG4gICAgICAgICAgICAgICAgcHV0IHlvdXIgY29udGVudCBpbnNpZGUgXCJzb3VyY2VcIiB0aGUgZG8gXCJzYXZlXCIuIFRyeSBhZGRpbmcgYW55IFxuICAgICAgICAgICAgICAgIHRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXG4gICAgICAgICAgICAgICAgfn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIElmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XG4gICAgICAgICAgICAgICAgZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxuICAgICAgICAgICAgICAgIHdoZW5ldmVyIHlvdSB3YW50LlxuICAgICAgICAgICAgICAgIH5+IW15X25ld19jb21tYW5kfn5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn5oZWxwOmVkaXRpbmc6aW50cm9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBBbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcImJveFwiLiBcbiAgICAgICAgICAgIFRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXG4gICAgICAgICAgICBUaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXG4gICAgICAgICAgICBcImNsb3NlXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxuICAgICAgICAgICAgY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5LlxuICAgICAgICAgICAgfn4hYm94fn5cbiAgICAgICAgICAgIFRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgV2hlbiB5b3UgY3JlYXRlIGEgY29tbWFuZCwgeW91IG1heSB3YW50IHRvIHNwZWNpZnkgd2hlcmUgdGhlIGN1cnNvciBcbiAgICAgICAgICAgIHdpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcInxcIiBcbiAgICAgICAgICAgIChWZXJ0aWNhbCBiYXIpLiBVc2UgMiBvZiB0aGVtIGlmIHlvdSB3YW50IHRvIHByaW50IHRoZSBhY3R1YWwgXG4gICAgICAgICAgICBjaGFyYWN0ZXIuXG4gICAgICAgICAgICB+fiFib3h+flxuICAgICAgICAgICAgb25lIDogfCBcbiAgICAgICAgICAgIHR3byA6IHx8XG4gICAgICAgICAgICB+fiEvYm94fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgWW91IGNhbiBhbHNvIHVzZSB0aGUgXCJlc2NhcGVfcGlwZXNcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxuICAgICAgICAgICAgdmVydGljYWwgYmFycyB0aGF0IGFyZSBiZXR3ZWVuIGl0cyBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3NcbiAgICAgICAgICAgIH5+IWVzY2FwZV9waXBlc35+XG4gICAgICAgICAgICB8XG4gICAgICAgICAgICB+fiEvZXNjYXBlX3BpcGVzfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cbiAgICAgICAgICAgIElmIHlvdSB3YW50IHRvIHByaW50IGEgY29tbWFuZCB3aXRob3V0IGhhdmluZyBpdCBleHBhbmQgd2hlbiBcbiAgICAgICAgICAgIHRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXCIhXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxuICAgICAgICAgICAgfn4hIWhlbGxvfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXG4gICAgICAgICAgICB0aGUgXCJjb250ZW50XCIgY29tbWFuZC4gXCJjb250ZW50XCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XG4gICAgICAgICAgICB0aGF0IGlzIGJldHdlZW4gdGhlIHRhZ3MuIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBob3cgaXQgY2FuIGJlIHVzZWQuXG4gICAgICAgICAgICB+fiFlZGl0IHBocDppbm5lcjppZn5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdlZGl0Jzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDplZGl0aW5nJ1xuICAgICAgICB9XG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgIH0sXG4gICAgJ25vX2V4ZWN1dGUnOntcbiAgICAgICdyZXN1bHQnIDogbm9fZXhlY3V0ZVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgUHJldmVudCBldmVyeXRoaW5nIGluc2lkZSB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIGZyb20gZXhlY3V0aW5nXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2VzY2FwZV9waXBlcyc6e1xuICAgICAgJ3Jlc3VsdCcgOiBxdW90ZV9jYXJyZXQsXG4gICAgICAnY2hlY2tDYXJyZXQnIDogZmFsc2VcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIEVzY2FwZSBhbGwgY2FycmV0cyAoZnJvbSBcInxcIiB0byBcInx8XCIpXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3F1b3RlX2NhcnJldCc6e1xuICAgICAgJ2FsaWFzT2YnOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgfVxuICAgICdleGVjX3BhcmVudCc6e1xuICAgICAgJ2V4ZWN1dGUnIDogZXhlY19wYXJlbnRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIEV4ZWN1dGUgdGhlIGZpcnN0IGNvbW1hbmQgdGhhdCB3cmFwIHRoaXMgaW4gaXQncyBvcGVuIGFuZCBjbG9zZSB0YWdcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnY29udGVudCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBnZXRDb250ZW50XG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcbiAgICAgICAgdGhpcyB3aWxsIHJldHVybiB3aGF0IHdhcyBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgb2YgYSBjb21tYW5kXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2JveCc6e1xuICAgICAgJ2NscycgOiBCb3hDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIENyZWF0ZSB0aGUgYXBwYXJlbmNlIG9mIGEgYm94IGNvbXBvc2VkIGZyb20gY2hhcmFjdGVycy4gXG4gICAgICAgIFVzdWFsbHkgd3JhcHBlZCBpbiBhIGNvbW1lbnQuXG5cbiAgICAgICAgVGhlIGJveCB3aWxsIHRyeSB0byBhanVzdCBpdCdzIHNpemUgZnJvbSB0aGUgY29udGVudFxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdjbG9zZSc6e1xuICAgICAgJ2NscycgOiBDbG9zZUNtZFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgV2lsbCBjbG9zZSB0aGUgZmlyc3QgYm94IGFyb3VuZCB0aGlzXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3BhcmFtJzp7XG4gICAgICAncmVzdWx0JyA6IGdldFBhcmFtXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcbiAgICAgICAgdGhpcyB3aWxsIHJldHVybiBhIHBhcmFtZXRlciBmcm9tIHRoaXMgY29tbWFuZCBjYWxsXG5cbiAgICAgICAgWW91IGNhbiBwYXNzIGEgbnVtYmVyLCBhIHN0cmluZywgb3IgYm90aC4gXG4gICAgICAgIEEgbnVtYmVyIGZvciBhIHBvc2l0aW9uZWQgYXJndW1lbnQgYW5kIGEgc3RyaW5nXG4gICAgICAgIGZvciBhIG5hbWVkIHBhcmFtZXRlclxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdlZGl0Jzp7XG4gICAgICAnY21kcycgOiBFZGl0Q21kLnNldENtZHMoe1xuICAgICAgICAnc2F2ZSc6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXhlY19wYXJlbnQnXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgJ2NscycgOiBFZGl0Q21kLFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydjbWQnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQWxsb3dzIHRvIGVkaXQgYSBjb21tYW5kLiBcbiAgICAgICAgU2VlIH5+IWhlbHA6ZWRpdGluZ35+IGZvciBhIHF1aWNrIHR1dG9yaWFsXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3JlbmFtZSc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2FwcGxpY2FibGUnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIFlvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiLFxuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogcmVuYW1lQ29tbWFuZCxcbiAgICAgICdwYXJzZScgOiB0cnVlLFxuICAgICAgJ2FsbG93ZWROYW1lZCc6Wydmcm9tJywndG8nXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQWxsb3dzIHRvIHJlbmFtZSBhIGNvbW1hbmQgYW5kIGNoYW5nZSBpdCdzIG5hbWVzcGFjZS4gXG4gICAgICAgIFlvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cbiAgICAgICAgLSBUaGUgZmlyc3QgcGFyYW0gaXMgdGhlIG9sZCBuYW1lXG4gICAgICAgIC0gVGhlbiBzZWNvbmQgcGFyYW0gaXMgdGhlIG5ldyBuYW1lLCBpZiBpdCBoYXMgbm8gbmFtZXNwYWNlLFxuICAgICAgICAgIGl0IHdpbGwgdXNlIHRoZSBvbmUgZnJvbSB0aGUgb3JpZ2luYWwgY29tbWFuZC5cblxuICAgICAgICBleC46IH5+IXJlbmFtZSBteV9jb21tYW5kIG15X2NvbW1hbmQyfn5cbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncmVtb3ZlJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfYXBwbGljYWJsZScgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCIsXG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiByZW1vdmVDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnY21kJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIEFsbG93cyB0byByZW1vdmUgYSBjb21tYW5kLiBcbiAgICAgICAgWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdhbGlhcyc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogYWxpYXNDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICB9LFxuICAgICduYW1lc3BhY2UnOntcbiAgICAgICdjbHMnIDogTmFtZVNwYWNlQ21kXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBTaG93IHRoZSBjdXJyZW50IG5hbWVzcGFjZXMuXG5cbiAgICAgICAgQSBuYW1lIHNwYWNlIGNvdWxkIGJlIHRoZSBuYW1lIG9mIHRoZSBsYW5ndWFnZVxuICAgICAgICBvciBvdGhlciBraW5kIG9mIGNvbnRleHRzXG5cbiAgICAgICAgSWYgeW91IHBhc3MgYSBwYXJhbSB0byB0aGlzIGNvbW1hbmQsIGl0IHdpbGwgXG4gICAgICAgIGFkZCB0aGUgcGFyYW0gYXMgYSBuYW1lc3BhY2UgZm9yIHRoZSBjdXJyZW50IGVkaXRvclxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICduc3BjJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTpuYW1lc3BhY2UnXG4gICAgfSxcbiAgICAnbGlzdCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBsaXN0Q29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJywnYm94JywnY29udGV4dCddXG4gICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIExpc3QgYXZhaWxhYmxlIGNvbW1hbmRzXG5cbiAgICAgICAgWW91IGNhbiB1c2UgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGNob29zZSBhIHNwZWNpZmljIG5hbWVzcGFjZSwgXG4gICAgICAgIGJ5IGRlZmF1bHQgYWxsIGN1cmVudCBuYW1lc3BhY2Ugd2lsbCBiZSBzaG93blxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdscyc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6bGlzdCdcbiAgICB9LFxuICAgICdnZXQnOntcbiAgICAgICdyZXN1bHQnIDogZ2V0Q29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIG91dHB1dCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZVxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdzZXQnOntcbiAgICAgICdyZXN1bHQnIDogc2V0Q29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJywndmFsdWUnLCd2YWwnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgc2V0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3N0b3JlX2pzb24nOntcbiAgICAgICdyZXN1bHQnIDogc3RvcmVKc29uQ29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJywnanNvbiddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBzZXQgYSB2YXJpYWJsZSB3aXRoIHNvbWUganNvbiBkYXRhXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2pzb24nOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOnN0b3JlX2pzb24nXG4gICAgfSxcbiAgICAnZW1tZXQnOntcbiAgICAgICdjbHMnIDogRW1tZXRDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIENvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcbiAgICAgICAgcHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuXG5cbiAgICAgICAgUGFzcyB0aGUgRW1tZXQgYWJicmV2aWF0aW9uIGFzIGEgcGFyYW0gdG8gZXhwZW5kIGl0LlxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgIFxuICB9KVxuICBcbmhlbHAgPSAoaW5zdGFuY2UpIC0+XG4gIGNtZE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnY21kJ10pXG4gIGlmIGNtZE5hbWU/XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQoY21kTmFtZSlcbiAgICBpZiBjbWQ/XG4gICAgICBoZWxwQ21kID0gY21kLmdldENtZCgnaGVscCcpXG4gICAgICB0ZXh0ID0gaWYgaGVscENtZCB0aGVuIFwifn4je2hlbHBDbWQuZnVsbE5hbWV9fn5cIiBlbHNlIFwiVGhpcyBjb21tYW5kIGhhcyBubyBoZWxwIHRleHRcIlxuICAgICAgc3ViY29tbWFuZHMgPSBpZiBjbWQuY21kcy5sZW5ndGhcbiAgICAgICAgXCJcIlwiXG5cbiAgICAgICAgU3ViLUNvbW1hbmRzIDpcbiAgICAgICAgfn5scyAje2NtZC5mdWxsTmFtZX0gYm94Om5vIGNvbnRleHQ6bm9+flxuICAgICAgICBcIlwiXCJcbiAgICAgIGVsc2UgXG4gICAgICAgIFwiXCJcbiAgICAgIHJldHVybiBcIlwiXCJcbiAgICAgICAgfn5ib3h+flxuICAgICAgICBIZWxwIGZvciB+fiEje2NtZC5mdWxsTmFtZX1+fiA6XG5cbiAgICAgICAgI3t0ZXh0fVxuICAgICAgICAje3N1YmNvbW1hbmRzfVxuXG4gICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgIH5+L2JveH5+XG4gICAgICAgIFwiXCJcIlxuICAgIGVsc2UgXG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbiAgZWxzZVxuICAgIHJldHVybiAnfn5oZWxwOm92ZXJ2aWV3fn4nXG5cbm5vX2V4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gIHJlZyA9IG5ldyBSZWdFeHAoXCJeKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cykgKyAnKScgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpKVxuICByZXR1cm4gaW5zdGFuY2Uuc3RyLnJlcGxhY2UocmVnLCckMScpXG4gIFxucXVvdGVfY2FycmV0ID0gKGluc3RhbmNlKSAtPlxuICByZXR1cm4gaW5zdGFuY2UuY29udGVudC5yZXBsYWNlKC9cXHwvZywgJ3x8JylcbmV4ZWNfcGFyZW50ID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5wYXJlbnQ/XG4gICAgcmVzID0gaW5zdGFuY2UucGFyZW50LmV4ZWN1dGUoKVxuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnRcbiAgICBpbnN0YW5jZS5yZXBsYWNlRW5kID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VFbmRcbiAgICByZXR1cm4gcmVzXG5nZXRDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuICBhZmZpeGVzX2VtcHR5ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydhZmZpeGVzX2VtcHR5J10sZmFsc2UpXG4gIHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gIHN1ZmZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sJycpXG4gIGlmIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2U/XG4gICAgcmV0dXJuIHByZWZpeCArIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmNvbnRlbnQgb3IgJycpICsgc3VmZml4XG4gIGlmIGFmZml4ZXNfZW1wdHlcbiAgICByZXR1cm4gcHJlZml4ICsgc3VmZml4XG5yZW5hbWVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZVxuICAgIHN0b3JhZ2UubG9hZCgnY21kcycpXG4gIC50aGVuIChzYXZlZENtZHMpPT5cbiAgICBvcmlnbmluYWxOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2Zyb20nXSlcbiAgICBuZXdOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ3RvJ10pXG4gICAgaWYgb3JpZ25pbmFsTmFtZT8gYW5kIG5ld05hbWU/XG4gICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChvcmlnbmluYWxOYW1lKVxuICAgICAgaWYgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdPyBhbmQgY21kP1xuICAgICAgICB1bmxlc3MgbmV3TmFtZS5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCcnKSArIG5ld05hbWVcbiAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXVxuICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShuZXdOYW1lLGNtZERhdGEpXG4gICAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgICAgc2F2ZWRDbWRzW25ld05hbWVdID0gY21kRGF0YVxuICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgICAgICBzdG9yYWdlLnNhdmUoJ2NtZHMnLHNhdmVkQ21kcylcbiAgICAgICAgLnRoZW4gPT5cbiAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgZWxzZSBpZiBjbWQ/IFxuICAgICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIlxuICAgICAgZWxzZSBcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5yZW1vdmVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgICBpZiBuYW1lP1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG4gICAgICAgIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpXG4gICAgICAudGhlbiAoc2F2ZWRDbWRzKT0+XG4gICAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG5hbWUpXG4gICAgICAgIGlmIHNhdmVkQ21kc1tuYW1lXT8gYW5kIGNtZD9cbiAgICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW25hbWVdXG4gICAgICAgICAgY21kLnVucmVnaXN0ZXIoKVxuICAgICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV1cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICAgICAgICBzdG9yYWdlLnNhdmUoJ2NtZHMnLHNhdmVkQ21kcylcbiAgICAgICAgICAudGhlbiA9PlxuICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgZWxzZSBpZiBjbWQ/IFxuICAgICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiXG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5hbGlhc0NvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCdhbGlhcyddKVxuICBpZiBuYW1lPyBhbmQgYWxpYXM/XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQobmFtZSlcbiAgICBpZiBjbWQ/XG4gICAgICBjbWQgPSBjbWQuZ2V0QWxpYXNlZCgpIG9yIGNtZFxuICAgICAgIyB1bmxlc3MgYWxpYXMuaW5kZXhPZignOicpID4gLTFcbiAgICAgICAgIyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChhbGlhcywgeyBhbGlhc09mOiBjbWQuZnVsbE5hbWUgfSlcbiAgICAgIHJldHVybiBcIlwiXG4gICAgZWxzZSBcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIlxuXG5saXN0Q29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgYm94ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnYm94J10sdHJ1ZSlcbiAgdXNlQ29udGV4dCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2NvbnRleHQnXSx0cnVlKVxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgbmFtZXNwYWNlcyA9IGlmIG5hbWUgXG4gICAgW25hbWVdIFxuICBlbHNlIFxuICAgIGluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLmZpbHRlcigobnNwYykgPT4gbnNwYyAhPSBpbnN0YW5jZS5jbWQuZnVsbE5hbWUpLmNvbmNhdChcIl9yb290XCIpXG5cbiAgY29udGV4dCA9IGlmIHVzZUNvbnRleHRcbiAgICBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpXG4gIGVsc2VcbiAgICBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dFxuXG4gIGNvbW1hbmRzID0gbmFtZXNwYWNlcy5yZWR1Y2UgKGNvbW1hbmRzLCBuc3BjKSA9PiBcbiAgICAgIGNtZCA9IGlmIG5zcGMgPT0gXCJfcm9vdFwiIHRoZW4gQ29tbWFuZC5jbWRzIGVsc2UgY29udGV4dC5nZXRDbWQobnNwYyxtdXN0RXhlY3V0ZTpmYWxzZSlcbiAgICAgIGlmIGNtZD9cbiAgICAgICAgY21kLmluaXQoKVxuICAgICAgICBpZiBjbWQuY21kc1xuICAgICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGNtZC5jbWRzKVxuICAgICAgY29tbWFuZHNcbiAgICAsIFtdXG5cbiAgdGV4dCA9IGlmIGNvbW1hbmRzLmxlbmd0aCBcbiAgICBjb21tYW5kcy5tYXAoKGNtZCk9PiBcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIChpZiBjbWQuaXNFeGVjdXRhYmxlKCkgdGhlbiAnfn4hJyBlbHNlICd+fiFscyAnKStjbWQuZnVsbE5hbWUrJ35+J1xuICAgICkuam9pbihcIlxcblwiKVxuICBlbHNlXG4gICAgXCJUaGlzIGNvbnRhaW5zIG5vIHN1Yi1jb21tYW5kc1wiXG5cbiAgaWYgYm94XG4gICAgXCJcIlwiXG4gICAgICB+fmJveH5+XG4gICAgICAje3RleHR9XG5cbiAgICAgIH5+IWNsb3NlfH5+XG4gICAgICB+fi9ib3h+flxuICAgICAgXCJcIlwiXG4gIGVsc2VcbiAgICB0ZXh0XG4gIFxuZ2V0Q29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIFBhdGhIZWxwZXIuZ2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLG5hbWUpXG5cbnNldENvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCd2YWx1ZScsJ3ZhbCddKSk/XG4gICAgcFxuICBlbHNlIGlmIGluc3RhbmNlLmNvbnRlbnRcbiAgICBpbnN0YW5jZS5jb250ZW50XG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLG5hbWUsdmFsKVxuICAnJ1xuXG5zdG9yZUpzb25Db21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwnanNvbiddKSk/XG4gICAgcFxuICBlbHNlIGlmIGluc3RhbmNlLmNvbnRlbnRcbiAgICBpbnN0YW5jZS5jb250ZW50XG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLG5hbWUsIEpTT04ucGFyc2UodmFsKSlcbiAgJydcblxuZ2V0UGFyYW0gPSAoaW5zdGFuY2UpIC0+XG4gIGlmIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2U/XG4gICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuZ2V0UGFyYW0oaW5zdGFuY2UucGFyYW1zLGluc3RhbmNlLmdldFBhcmFtKFsnZGVmJywnZGVmYXVsdCddKSlcbiAgXG5jbGFzcyBCb3hDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBpbnN0YW5jZS5jb250ZXh0KVxuICAgIEBjbWQgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydjbWQnXSlcbiAgICBpZiBAY21kP1xuICAgICAgQGhlbHBlci5vcGVuVGV4dCAgPSBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIEBjbWQgKyBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgICAgQGhlbHBlci5jbG9zZVRleHQgPSBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIEBpbnN0YW5jZS5jb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY21kLnNwbGl0KFwiIFwiKVswXSArIEBpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzXG4gICAgQGhlbHBlci5kZWNvID0gQGluc3RhbmNlLmNvZGV3YXZlLmRlY29cbiAgICBAaGVscGVyLnBhZCA9IDJcbiAgICBAaGVscGVyLnByZWZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCcnKVxuICAgIEBoZWxwZXIuc3VmZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sJycpXG4gICAgXG4gIGhlaWdodDogLT5cbiAgICBpZiBAYm91bmRzKCk/XG4gICAgICBoZWlnaHQgPSBAYm91bmRzKCkuaGVpZ2h0XG4gICAgZWxzZVxuICAgICAgaGVpZ2h0ID0gM1xuICAgICAgXG4gICAgcGFyYW1zID0gWydoZWlnaHQnXVxuICAgIGlmIEBpbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSBcbiAgICAgIHBhcmFtcy5wdXNoKDEpXG4gICAgZWxzZSBpZiBAaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDBcbiAgICAgIHBhcmFtcy5wdXNoKDApXG4gICAgcmV0dXJuIEBpbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsaGVpZ2h0KVxuICAgICAgXG4gIHdpZHRoOiAtPlxuICAgIGlmIEBib3VuZHMoKT9cbiAgICAgIHdpZHRoID0gQGJvdW5kcygpLndpZHRoXG4gICAgZWxzZVxuICAgICAgd2lkdGggPSAzXG4gICAgICBcbiAgICBwYXJhbXMgPSBbJ3dpZHRoJ11cbiAgICBpZiBAaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEgXG4gICAgICBwYXJhbXMucHVzaCgwKVxuICAgIHJldHVybiBNYXRoLm1heChAbWluV2lkdGgoKSwgQGluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgd2lkdGgpKVxuXG4gIFxuICBib3VuZHM6IC0+XG4gICAgaWYgQGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHVubGVzcyBAX2JvdW5kcz9cbiAgICAgICAgQF9ib3VuZHMgPSBAaGVscGVyLnRleHRCb3VuZHMoQGluc3RhbmNlLmNvbnRlbnQpXG4gICAgICByZXR1cm4gQF9ib3VuZHNcbiAgICAgIFxuICByZXN1bHQ6IC0+XG4gICAgQGhlbHBlci5oZWlnaHQgPSBAaGVpZ2h0KClcbiAgICBAaGVscGVyLndpZHRoID0gQHdpZHRoKClcbiAgICByZXR1cm4gQGhlbHBlci5kcmF3KEBpbnN0YW5jZS5jb250ZW50KVxuICBtaW5XaWR0aDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgcmV0dXJuIEBjbWQubGVuZ3RoXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIDBcbiAgXG5jbGFzcyBDbG9zZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGluc3RhbmNlLmNvbnRleHQpXG4gIGV4ZWN1dGU6IC0+XG4gICAgcHJlZml4ID0gQGhlbHBlci5wcmVmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgICBzdWZmaXggPSBAaGVscGVyLnN1ZmZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCcnKVxuICAgIGJveCA9IEBoZWxwZXIuZ2V0Qm94Rm9yUG9zKEBpbnN0YW5jZS5nZXRQb3MoKSlcbiAgICByZXF1aXJlZF9hZmZpeGVzID0gQGluc3RhbmNlLmdldFBhcmFtKFsncmVxdWlyZWRfYWZmaXhlcyddLHRydWUpXG4gICAgaWYgIXJlcXVpcmVkX2FmZml4ZXNcbiAgICAgIEBoZWxwZXIucHJlZml4ID0gQGhlbHBlci5zdWZmaXggPSAnJ1xuICAgICAgYm94MiA9IEBoZWxwZXIuZ2V0Qm94Rm9yUG9zKEBpbnN0YW5jZS5nZXRQb3MoKSlcbiAgICAgIGlmIGJveDI/IGFuZCAoIWJveD8gb3IgYm94LnN0YXJ0IDwgYm94Mi5zdGFydCAtIHByZWZpeC5sZW5ndGggb3IgYm94LmVuZCA+IGJveDIuZW5kICsgc3VmZml4Lmxlbmd0aClcbiAgICAgICAgYm94ID0gYm94MlxuICAgIGlmIGJveD9cbiAgICAgIGRlcHRoID0gQGhlbHBlci5nZXROZXN0ZWRMdmwoQGluc3RhbmNlLmdldFBvcygpLnN0YXJ0KVxuICAgICAgaWYgZGVwdGggPCAyXG4gICAgICAgIEBpbnN0YW5jZS5pbkJveCA9IG51bGxcbiAgICAgIEBpbnN0YW5jZS5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChib3guc3RhcnQsYm94LmVuZCwnJykpXG4gICAgZWxzZVxuICAgICAgQGluc3RhbmNlLnJlcGxhY2VXaXRoKCcnKVxuICAgICAgICAgIFxuY2xhc3MgRWRpdENtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGNtZE5hbWUgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2NtZCddKVxuICAgIEB2ZXJiYWxpemUgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzFdKSBpbiBbJ3YnLCd2ZXJiYWxpemUnXVxuICAgIGlmIEBjbWROYW1lP1xuICAgICAgQGZpbmRlciA9IEBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldEZpbmRlcihAY21kTmFtZSkgXG4gICAgICBAZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlXG4gICAgICBAY21kID0gQGZpbmRlci5maW5kKClcbiAgICBAZWRpdGFibGUgPSBpZiBAY21kPyB0aGVuIEBjbWQuaXNFZGl0YWJsZSgpIGVsc2UgdHJ1ZVxuICByZXN1bHQ6IC0+XG4gICAgaWYgQGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHJldHVybiBAcmVzdWx0V2l0aENvbnRlbnQoKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAcmVzdWx0V2l0aG91dENvbnRlbnQoKVxuICByZXN1bHRXaXRoQ29udGVudDogLT5cbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIGRhdGEgPSB7fVxuICAgICAgZm9yIHAgaW4gRWRpdENtZC5wcm9wc1xuICAgICAgICBwLndyaXRlRm9yKHBhcnNlcixkYXRhKVxuICAgICAgQ29tbWFuZC5zYXZlQ21kKEBjbWROYW1lLCBkYXRhKVxuICAgICAgcmV0dXJuICcnXG4gIHByb3BzRGlzcGxheTogLT5cbiAgICAgIGNtZCA9IEBjbWRcbiAgICAgIHJldHVybiBFZGl0Q21kLnByb3BzLm1hcCggKHApLT4gcC5kaXNwbGF5KGNtZCkgKS5maWx0ZXIoIChwKS0+IHA/ICkuam9pbihcIlxcblwiKVxuICByZXN1bHRXaXRob3V0Q29udGVudDogLT5cbiAgICBpZiAhQGNtZCBvciBAZWRpdGFibGVcbiAgICAgIG5hbWUgPSBpZiBAY21kIHRoZW4gQGNtZC5mdWxsTmFtZSBlbHNlIEBjbWROYW1lXG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChcbiAgICAgICAgXCJcIlwiXG4gICAgICAgIH5+Ym94IGNtZDpcIiN7QGluc3RhbmNlLmNtZC5mdWxsTmFtZX0gI3tuYW1lfVwifn5cbiAgICAgICAgI3tAcHJvcHNEaXNwbGF5KCl9XG4gICAgICAgIH5+IXNhdmV+fiB+fiFjbG9zZX5+XG4gICAgICAgIH5+L2JveH5+XG4gICAgICAgIFwiXCJcIilcbiAgICAgIHBhcnNlci5jaGVja0NhcnJldCA9IG5vXG4gICAgICByZXR1cm4gaWYgQHZlcmJhbGl6ZSB0aGVuIHBhcnNlci5nZXRUZXh0KCkgZWxzZSBwYXJzZXIucGFyc2VBbGwoKVxuRWRpdENtZC5zZXRDbWRzID0gKGJhc2UpIC0+XG4gIGluSW5zdGFuY2UgPSBiYXNlLmluX2luc3RhbmNlID0ge2NtZHM6e319XG4gIGZvciBwIGluIEVkaXRDbWQucHJvcHNcbiAgICBwLnNldENtZChpbkluc3RhbmNlLmNtZHMpXG4gICAgIyBwLnNldENtZChiYXNlKVxuICByZXR1cm4gYmFzZVxuRWRpdENtZC5wcm9wcyA9IFtcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX2NhcnJldCcsICAgICAgICAge29wdDonY2hlY2tDYXJyZXQnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19wYXJzZScsICAgICAgICAgIHtvcHQ6J3BhcnNlJ30pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCggICAncHJldmVudF9wYXJzZV9hbGwnLCB7b3B0OidwcmV2ZW50UGFyc2VBbGwnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCAgICdyZXBsYWNlX2JveCcsICAgICAgIHtvcHQ6J3JlcGxhY2VCb3gnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoICduYW1lX3RvX3BhcmFtJywgICAgIHtvcHQ6J25hbWVUb1BhcmFtJ30pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCAnYWxpYXNfb2YnLCAgICAgICAgICB7dmFyOidhbGlhc09mJywgY2FycmV0OnRydWV9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSggJ2hlbHAnLCAgICAgICAgICAgICAge2Z1bmN0OidoZWxwJywgc2hvd0VtcHR5OnRydWV9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSggJ3NvdXJjZScsICAgICAgICAgICAge3ZhcjoncmVzdWx0U3RyJywgZGF0YU5hbWU6J3Jlc3VsdCcsIHNob3dFbXB0eTp0cnVlLCBjYXJyZXQ6dHJ1ZX0pLFxuXVxuY2xhc3MgTmFtZVNwYWNlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAbmFtZSA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMF0pXG4gIHJlc3VsdDogLT5cbiAgICBpZiBAbmFtZT9cbiAgICAgIEBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dC5hZGROYW1lU3BhY2UoQG5hbWUpXG4gICAgICByZXR1cm4gJydcbiAgICBlbHNlXG4gICAgICBuYW1lc3BhY2VzID0gQGluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICB0eHQgPSAnfn5ib3h+flxcbidcbiAgICAgIGZvciBuc3BjIGluIG5hbWVzcGFjZXMgXG4gICAgICAgIGlmIG5zcGMgIT0gQGluc3RhbmNlLmNtZC5mdWxsTmFtZVxuICAgICAgICAgIHR4dCArPSBuc3BjKydcXG4nXG4gICAgICB0eHQgKz0gJ35+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0eHQpXG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKClcblxuXG5cbmNsYXNzIEVtbWV0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAYWJiciA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMCwnYWJicicsJ2FiYnJldmlhdGlvbiddKVxuICAgIEBsYW5nID0gQGluc3RhbmNlLmdldFBhcmFtKFsxLCdsYW5nJywnbGFuZ3VhZ2UnXSlcbiAgcmVzdWx0OiAtPlxuICAgIGVtbWV0ID0gaWYgd2luZG93Py5lbW1ldD9cbiAgICAgIHdpbmRvdy5lbW1ldFxuICAgIGVsc2UgaWYgd2luZG93Py5zZWxmPy5lbW1ldD9cbiAgICAgIHdpbmRvdy5zZWxmLmVtbWV0XG4gICAgZWxzZSBpZiB3aW5kb3c/Lmdsb2JhbD8uZW1tZXQ/XG4gICAgICB3aW5kb3cuZ2xvYmFsLmVtbWV0XG4gICAgZWxzZSBpZiByZXF1aXJlPyBcbiAgICAgIHRyeSBcbiAgICAgICAgcmVxdWlyZSgnZW1tZXQnKVxuICAgICAgY2F0Y2ggZXhcbiAgICAgICAgQGluc3RhbmNlLmNvZGV3YXZlLmxvZ2dlci5sb2coJ0VtbWV0IGlzIG5vdCBhdmFpbGFibGUsIGl0IG1heSBuZWVkIHRvIGJlIGluc3RhbGxlZCBtYW51YWxseScpXG4gICAgICAgIG51bGxcbiAgICBpZiBlbW1ldD9cbiAgICAgICMgZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKEBhYmJyLCBAbGFuZylcbiAgICAgIHJlcy5yZXBsYWNlKC9cXCRcXHswXFx9L2csICd8JylcblxuXG5cbiIsInZhciBCb3hDbWQsIENsb3NlQ21kLCBFZGl0Q21kLCBFbW1ldENtZCwgTmFtZVNwYWNlQ21kLCBhbGlhc0NvbW1hbmQsIGV4ZWNfcGFyZW50LCBnZXRDb21tYW5kLCBnZXRDb250ZW50LCBnZXRQYXJhbSwgaGVscCwgbGlzdENvbW1hbmQsIG5vX2V4ZWN1dGUsIHF1b3RlX2NhcnJldCwgcmVtb3ZlQ29tbWFuZCwgcmVuYW1lQ29tbWFuZCwgc2V0Q29tbWFuZCwgc3RvcmVKc29uQ29tbWFuZDtcblxuaW1wb3J0IHtcbiAgQ29tbWFuZCxcbiAgQmFzZUNvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIExhbmdEZXRlY3RvclxufSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmltcG9ydCB7XG4gIEJveEhlbHBlclxufSBmcm9tICcuLi9Cb3hIZWxwZXInO1xuXG5pbXBvcnQge1xuICBFZGl0Q21kUHJvcFxufSBmcm9tICcuLi9FZGl0Q21kUHJvcCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhdGhIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9QYXRoSGVscGVyJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgdmFyIENvcmVDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBDb3JlQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBjb3JlO1xuICAgIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKTtcbiAgICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSk7XG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICAnaGVscCc6IHtcbiAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAncmVzdWx0JzogaGVscCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJUbyBnZXQgaGVscCBvbiBhIHBlY2lmaWMgY29tbWFuZCwgZG8gOlxcbn5+aGVscCBoZWxsb35+IChoZWxsbyBiZWluZyB0aGUgY29tbWFuZClcIixcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ292ZXJ2aWV3Jzoge1xuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+cXVvdGVfY2FycmV0fn5cXG4gIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXFxuIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xcbi8gL19fLyBfIFxcXFwvIF9gIC8gLV9cXFxcIFxcXFwvXFxcXC8gLyBfYCBcXFxcIFYgLyAtXy9cXG5cXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XFxuVGhlIHRleHQgZWRpdG9yIGhlbHBlclxcbn5+L3F1b3RlX2NhcnJldH5+XFxuXFxuV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcXG55b3VyIHRleHQgZWRpdG9yLiBUaGVzZSBjb21tYW5kcyBtdXN0IGJlIHBsYWNlZCBiZXR3ZWVuIHR3byBcXG5wYWlycyBvZiBcXFwiflxcXCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiLCB3aXRoIHlvdXIgY3Vyc29yIGluc2lkZSB0aGUgY29tbWFuZFxcbkV4OiB+fiFoZWxsb35+XFxuXFxuWW91IGRvbnQgbmVlZCB0byBhY3R1YWxseSB0eXBlIGFueSBcXFwiflxcXCIgKHRpbGRlKS4gXFxuUHJlc3NpbmcgXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpbGwgYWRkIHRoZW0gaWYgeW91IGFyZSBub3QgYWxyZWFkeVxcbndpdGhpbiBhIGNvbW1hbmQuXFxuXFxuQ29kZXdhdmUgZG9lcyBub3QgdXNlIFVJIHRvIGRpc3BsYXkgYW55IGluZm9ybWF0aW9uLiBcXG5JbnN0ZWFkLCBpdCB1c2VzIHRleHQgd2l0aGluIGNvZGUgY29tbWVudHMgdG8gbWltaWMgVUlzLiBcXG5UaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcXG5pbiB0aGUgaGVscCBzZWN0aW9ucy5cXG5cXG5UbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpdGggeW91ciBjdXJzb3Igb24gdGhlIGxpbmUgYmVsbG93Llxcbn5+IWNsb3NlfH5+XFxuXFxuVXNlIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBmb3IgYSB3YWxrdGhyb3VnaCBvZiBzb21lIG9mIHRoZSBtYW55XFxuZmVhdHVyZXMgb2YgQ29kZXdhdmVcXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cXG5cXG5MaXN0IG9mIGFsbCBoZWxwIHN1YmplY3RzIFxcbn5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxcblxcbn5+IWNsb3Nlfn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc3ViamVjdHMnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn4haGVscH5+XFxufn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcXG5+fiFoZWxwOnN1YmplY3Rzfn4gKH5+IWhlbHA6c3Vifn4pXFxufn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6c3ViamVjdHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZ2V0X3N0YXJ0ZWQnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxuVGhlIGNsYXNzaWMgSGVsbG8gV29ybGQuXFxufn4haGVsbG98fn5cXG5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxufn5xdW90ZV9jYXJyZXR+flxcblxcbkZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGNyZWF0aW5nIHlvdXIgb3duIGNvbW1hbmRzLCBzZWU6XFxufn4haGVscDplZGl0aW5nfn5cXG5cXG5Db2Rld2F2ZSBjb21lcyB3aXRoIG1hbnkgcHJlLWV4aXN0aW5nIGNvbW1hbmRzLiBIZXJlIGlzIGFuIGV4YW1wbGVcXG5vZiBKYXZhU2NyaXB0IGFiYnJldmlhdGlvbnNcXG5+fiFqczpmfn5cXG5+fiFqczppZn5+XFxuICB+fiFqczpsb2d+flxcXCJ+fiFoZWxsb35+XFxcIn5+IS9qczpsb2d+flxcbn5+IS9qczppZn5+XFxufn4hL2pzOmZ+flxcblxcbkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxcbnVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cXG5+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXFxufn4hZW1tZXQgdWw+bGl+flxcbn5+IWVtbWV0IG0yIGNzc35+XFxuXFxuQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxcbmRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxcbn5+IWpzOmVhY2h+flxcbn5+IXBocDpvdXRlcjplYWNofn5cXG5+fiFwaHA6aW5uZXI6ZWFjaH5+XFxuXFxuU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXFxuZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcXG5hY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxcbmNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cXG5+fiFuYW1lc3BhY2V+flxcbn5+IWNvcmU6bmFtZXNwYWNlfn5cXG5cXG5Zb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxcbn5+IW5hbWVzcGFjZSBwaHB+flxcblxcbkNoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXFxufn4hbmFtZXNwYWNlfn5cXG5cXG5JbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXFxuY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcXG53aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxcblxcbn5+L3F1b3RlX2NhcnJldH5+XFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZGVtbyc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6Z2V0X3N0YXJ0ZWQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZWRpdGluZyc6IHtcbiAgICAgICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICAgICAnaW50cm8nOiB7XG4gICAgICAgICAgICAgICAgJ3Jlc3VsdCc6IFwiQ29kZXdhdmUgYWxsb3dzIHlvdSB0byBtYWtlIHlvdXIgb3duIGNvbW1hbmRzIChvciBhYmJyZXZpYXRpb25zKSBcXG5wdXQgeW91ciBjb250ZW50IGluc2lkZSBcXFwic291cmNlXFxcIiB0aGUgZG8gXFxcInNhdmVcXFwiLiBUcnkgYWRkaW5nIGFueSBcXG50ZXh0IHRoYXQgaXMgb24geW91ciBtaW5kLlxcbn5+IWVkaXQgbXlfbmV3X2NvbW1hbmR8fn5cXG5cXG5JZiB5b3UgZGlkIHRoZSBsYXN0IHN0ZXAgcmlnaHQsIHlvdSBzaG91bGQgc2VlIHlvdXIgdGV4dCB3aGVuIHlvdVxcbmRvIHRoZSBmb2xsb3dpbmcgY29tbWFuZC4gSXQgaXMgbm93IHNhdmVkIGFuZCB5b3UgY2FuIHVzZSBpdCBcXG53aGVuZXZlciB5b3Ugd2FudC5cXG5+fiFteV9uZXdfY29tbWFuZH5+XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxuXFxuQWxsIHRoZSB3aW5kb3dzIG9mIENvZGV3YXZlIGFyZSBtYWRlIHdpdGggdGhlIGNvbW1hbmQgXFxcImJveFxcXCIuIFxcblRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXFxuVGhleSBhcmUgdmFsaWQgY29tbWVudHMgc28gdGhleSB3b24ndCBicmVhayB5b3VyIGNvZGUgYW5kIHRoZSBjb21tYW5kIFxcblxcXCJjbG9zZVxcXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxcbmNvbW1hbmRzIHdpdGggdGhlbSBpZiB5b3UgbmVlZCB0byBkaXNwbGF5IHNvbWUgdGV4dCB0ZW1wb3JhcmlseS5cXG5+fiFib3h+flxcblRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcXG5+fiFjbG9zZXx+flxcbn5+IS9ib3h+flxcblxcbn5+cXVvdGVfY2FycmV0fn5cXG5XaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxcbndpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcXFwifFxcXCIgXFxuKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcXG5jaGFyYWN0ZXIuXFxufn4hYm94fn5cXG5vbmUgOiB8IFxcbnR3byA6IHx8XFxufn4hL2JveH5+XFxuXFxuWW91IGNhbiBhbHNvIHVzZSB0aGUgXFxcImVzY2FwZV9waXBlc1xcXCIgY29tbWFuZCB0aGF0IHdpbGwgZXNjYXBlIGFueSBcXG52ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xcbn5+IWVzY2FwZV9waXBlc35+XFxufFxcbn5+IS9lc2NhcGVfcGlwZXN+flxcblxcbkNvbW1hbmRzIGluc2lkZSBvdGhlciBjb21tYW5kcyB3aWxsIGJlIGV4cGFuZGVkIGF1dG9tYXRpY2FsbHkuXFxuSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxcbnRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXFxcIiFcXFwiIChleGNsYW1hdGlvbiBtYXJrKS5cXG5+fiEhaGVsbG9+flxcblxcbkZvciBjb21tYW5kcyB0aGF0IGhhdmUgYm90aCBhbiBvcGVuaW5nIGFuZCBhIGNsb3NpbmcgdGFnLCB5b3UgY2FuIHVzZVxcbnRoZSBcXFwiY29udGVudFxcXCIgY29tbWFuZC4gXFxcImNvbnRlbnRcXFwiIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGV4dFxcbnRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cXG5+fiFlZGl0IHBocDppbm5lcjppZn5+XFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdlZGl0Jzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDplZGl0aW5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnbm9fZXhlY3V0ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IG5vX2V4ZWN1dGUsXG4gICAgICAgICdoZWxwJzogXCJQcmV2ZW50IGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgZnJvbSBleGVjdXRpbmdcIlxuICAgICAgfSxcbiAgICAgICdlc2NhcGVfcGlwZXMnOiB7XG4gICAgICAgICdyZXN1bHQnOiBxdW90ZV9jYXJyZXQsXG4gICAgICAgICdjaGVja0NhcnJldCc6IGZhbHNlLFxuICAgICAgICAnaGVscCc6IFwiRXNjYXBlIGFsbCBjYXJyZXRzIChmcm9tIFxcXCJ8XFxcIiB0byBcXFwifHxcXFwiKVwiXG4gICAgICB9LFxuICAgICAgJ3F1b3RlX2NhcnJldCc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgICB9LFxuICAgICAgJ2V4ZWNfcGFyZW50Jzoge1xuICAgICAgICAnZXhlY3V0ZSc6IGV4ZWNfcGFyZW50LFxuICAgICAgICAnaGVscCc6IFwiRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1wiXG4gICAgICB9LFxuICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRDb250ZW50LFxuICAgICAgICAnaGVscCc6IFwiTWFpbmx5IHVzZWQgZm9yIGNvbW1hbmQgZWRpdGlvbiwgXFxudGhpcyB3aWxsIHJldHVybiB3aGF0IHdhcyBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgb2YgYSBjb21tYW5kXCJcbiAgICAgIH0sXG4gICAgICAnYm94Jzoge1xuICAgICAgICAnY2xzJzogQm94Q21kLFxuICAgICAgICAnaGVscCc6IFwiQ3JlYXRlIHRoZSBhcHBhcmVuY2Ugb2YgYSBib3ggY29tcG9zZWQgZnJvbSBjaGFyYWN0ZXJzLiBcXG5Vc3VhbGx5IHdyYXBwZWQgaW4gYSBjb21tZW50LlxcblxcblRoZSBib3ggd2lsbCB0cnkgdG8gYWp1c3QgaXQncyBzaXplIGZyb20gdGhlIGNvbnRlbnRcIlxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgJ2Nscyc6IENsb3NlQ21kLFxuICAgICAgICAnaGVscCc6IFwiV2lsbCBjbG9zZSB0aGUgZmlyc3QgYm94IGFyb3VuZCB0aGlzXCJcbiAgICAgIH0sXG4gICAgICAncGFyYW0nOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRQYXJhbSxcbiAgICAgICAgJ2hlbHAnOiBcIk1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gYSBwYXJhbWV0ZXIgZnJvbSB0aGlzIGNvbW1hbmQgY2FsbFxcblxcbllvdSBjYW4gcGFzcyBhIG51bWJlciwgYSBzdHJpbmcsIG9yIGJvdGguIFxcbkEgbnVtYmVyIGZvciBhIHBvc2l0aW9uZWQgYXJndW1lbnQgYW5kIGEgc3RyaW5nXFxuZm9yIGEgbmFtZWQgcGFyYW1ldGVyXCJcbiAgICAgIH0sXG4gICAgICAnZWRpdCc6IHtcbiAgICAgICAgJ2NtZHMnOiBFZGl0Q21kLnNldENtZHMoe1xuICAgICAgICAgICdzYXZlJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICAnY2xzJzogRWRpdENtZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxcblNlZSB+fiFoZWxwOmVkaXRpbmd+fiBmb3IgYSBxdWljayB0dXRvcmlhbFwiXG4gICAgICB9LFxuICAgICAgJ3JlbmFtZSc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9hcHBsaWNhYmxlJzogXCJ+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIixcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IHJlbmFtZUNvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2Zyb20nLCAndG8nXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byByZW5hbWUgYSBjb21tYW5kIGFuZCBjaGFuZ2UgaXQncyBuYW1lc3BhY2UuIFxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG4tIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcXG4tIFRoZW4gc2Vjb25kIHBhcmFtIGlzIHRoZSBuZXcgbmFtZSwgaWYgaXQgaGFzIG5vIG5hbWVzcGFjZSxcXG4gIGl0IHdpbGwgdXNlIHRoZSBvbmUgZnJvbSB0aGUgb3JpZ2luYWwgY29tbWFuZC5cXG5cXG5leC46IH5+IXJlbmFtZSBteV9jb21tYW5kIG15X2NvbW1hbmQyfn5cIlxuICAgICAgfSxcbiAgICAgICdyZW1vdmUnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfYXBwbGljYWJsZSc6IFwifn5ib3h+flxcbllvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCIsXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiByZW1vdmVDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydjbWQnXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byByZW1vdmUgYSBjb21tYW5kLiBcXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXCJcbiAgICAgIH0sXG4gICAgICAnYWxpYXMnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogYWxpYXNDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ25hbWVzcGFjZSc6IHtcbiAgICAgICAgJ2Nscyc6IE5hbWVTcGFjZUNtZCxcbiAgICAgICAgJ2hlbHAnOiBcIlNob3cgdGhlIGN1cnJlbnQgbmFtZXNwYWNlcy5cXG5cXG5BIG5hbWUgc3BhY2UgY291bGQgYmUgdGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlXFxub3Igb3RoZXIga2luZCBvZiBjb250ZXh0c1xcblxcbklmIHlvdSBwYXNzIGEgcGFyYW0gdG8gdGhpcyBjb21tYW5kLCBpdCB3aWxsIFxcbmFkZCB0aGUgcGFyYW0gYXMgYSBuYW1lc3BhY2UgZm9yIHRoZSBjdXJyZW50IGVkaXRvclwiXG4gICAgICB9LFxuICAgICAgJ25zcGMnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6bmFtZXNwYWNlJ1xuICAgICAgfSxcbiAgICAgICdsaXN0Jzoge1xuICAgICAgICAncmVzdWx0JzogbGlzdENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnYm94JywgJ2NvbnRleHQnXSxcbiAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnaGVscCc6IFwiTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcXG5cXG5Zb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcXG5ieSBkZWZhdWx0IGFsbCBjdXJlbnQgbmFtZXNwYWNlIHdpbGwgYmUgc2hvd25cIlxuICAgICAgfSxcbiAgICAgICdscyc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpsaXN0J1xuICAgICAgfSxcbiAgICAgICdnZXQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJ10sXG4gICAgICAgICdoZWxwJzogXCJvdXRwdXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcIlxuICAgICAgfSxcbiAgICAgICdzZXQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBzZXRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ3ZhbHVlJywgJ3ZhbCddLFxuICAgICAgICAnaGVscCc6IFwic2V0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXCJcbiAgICAgIH0sXG4gICAgICAnc3RvcmVfanNvbic6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHN0b3JlSnNvbkNvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnanNvbiddLFxuICAgICAgICAnaGVscCc6IFwic2V0IGEgdmFyaWFibGUgd2l0aCBzb21lIGpzb24gZGF0YVwiXG4gICAgICB9LFxuICAgICAgJ2pzb24nOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6c3RvcmVfanNvbidcbiAgICAgIH0sXG4gICAgICAnZW1tZXQnOiB7XG4gICAgICAgICdjbHMnOiBFbW1ldENtZCxcbiAgICAgICAgJ2hlbHAnOiBcIkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy5cXG5cXG5QYXNzIHRoZSBFbW1ldCBhYmJyZXZpYXRpb24gYXMgYSBwYXJhbSB0byBleHBlbmQgaXQuXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuXG5oZWxwID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGNtZCwgY21kTmFtZSwgaGVscENtZCwgc3ViY29tbWFuZHMsIHRleHQ7XG4gIGNtZE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKTtcbiAgaWYgKGNtZE5hbWUgIT0gbnVsbCkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKGNtZE5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaGVscENtZCA9IGNtZC5nZXRDbWQoJ2hlbHAnKTtcbiAgICAgIHRleHQgPSBoZWxwQ21kID8gYH5+JHtoZWxwQ21kLmZ1bGxOYW1lfX5+YCA6IFwiVGhpcyBjb21tYW5kIGhhcyBubyBoZWxwIHRleHRcIjtcbiAgICAgIHN1YmNvbW1hbmRzID0gY21kLmNtZHMubGVuZ3RoID8gYFxcblN1Yi1Db21tYW5kcyA6XFxufn5scyAke2NtZC5mdWxsTmFtZX0gYm94Om5vIGNvbnRleHQ6bm9+fmAgOiBcIlwiO1xuICAgICAgcmV0dXJuIGB+fmJveH5+XFxuSGVscCBmb3Igfn4hJHtjbWQuZnVsbE5hbWV9fn4gOlxcblxcbiR7dGV4dH1cXG4ke3N1YmNvbW1hbmRzfVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiAnfn5oZWxwOm92ZXJ2aWV3fn4nO1xuICB9XG59O1xuXG5ub19leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIHJlZztcbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSk7XG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsICckMScpO1xufTtcblxucXVvdGVfY2FycmV0ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgcmV0dXJuIGluc3RhbmNlLmNvbnRlbnQucmVwbGFjZSgvXFx8L2csICd8fCcpO1xufTtcblxuZXhlY19wYXJlbnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgcmVzO1xuICBpZiAoaW5zdGFuY2UucGFyZW50ICE9IG51bGwpIHtcbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpO1xuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnQ7XG4gICAgaW5zdGFuY2UucmVwbGFjZUVuZCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlRW5kO1xuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbmdldENvbnRlbnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgYWZmaXhlc19lbXB0eSwgcHJlZml4LCBzdWZmaXg7XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSwgZmFsc2UpO1xuICBwcmVmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gIHN1ZmZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBwcmVmaXggKyAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5jb250ZW50IHx8ICcnKSArIHN1ZmZpeDtcbiAgfVxuICBpZiAoYWZmaXhlc19lbXB0eSkge1xuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXg7XG4gIH1cbn07XG5cbnJlbmFtZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIHN0b3JhZ2U7XG4gICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICByZXR1cm4gc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gIH0pLnRoZW4oKHNhdmVkQ21kcykgPT4ge1xuICAgIHZhciBjbWQsIGNtZERhdGEsIG5ld05hbWUsIG9yaWduaW5hbE5hbWU7XG4gICAgb3JpZ25pbmFsTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZnJvbSddKTtcbiAgICBuZXdOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd0byddKTtcbiAgICBpZiAoKG9yaWduaW5hbE5hbWUgIT0gbnVsbCkgJiYgKG5ld05hbWUgIT0gbnVsbCkpIHtcbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG9yaWduaW5hbE5hbWUpO1xuICAgICAgaWYgKChzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0gIT0gbnVsbCkgJiYgKGNtZCAhPSBudWxsKSkge1xuICAgICAgICBpZiAoIShuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xKSkge1xuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCAnJykgKyBuZXdOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV07XG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsIGNtZERhdGEpO1xuICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhO1xuICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbnJlbW92ZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIG5hbWU7XG4gICAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcywgc3RvcmFnZTtcbiAgICAgICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbigoc2F2ZWRDbWRzKSA9PiB7XG4gICAgICAgIHZhciBjbWQsIGNtZERhdGE7XG4gICAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG5hbWUpO1xuICAgICAgICBpZiAoKHNhdmVkQ21kc1tuYW1lXSAhPSBudWxsKSAmJiAoY21kICE9IG51bGwpKSB7XG4gICAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tuYW1lXTtcbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV07XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFsaWFzQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnYWxpYXMnXSk7XG4gIGlmICgobmFtZSAhPSBudWxsKSAmJiAoYWxpYXMgIT0gbnVsbCkpIHtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgfHwgY21kO1xuICAgICAgLy8gdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAvLyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChhbGlhcywge1xuICAgICAgICBhbGlhc09mOiBjbWQuZnVsbE5hbWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH1cbn07XG5cbmxpc3RDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGJveCwgY29tbWFuZHMsIGNvbnRleHQsIG5hbWUsIG5hbWVzcGFjZXMsIHRleHQsIHVzZUNvbnRleHQ7XG4gIGJveCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2JveCddLCB0cnVlKTtcbiAgdXNlQ29udGV4dCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2NvbnRleHQnXSwgdHJ1ZSk7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIG5hbWVzcGFjZXMgPSBuYW1lID8gW25hbWVdIDogaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCkuZmlsdGVyKChuc3BjKSA9PiB7XG4gICAgcmV0dXJuIG5zcGMgIT09IGluc3RhbmNlLmNtZC5mdWxsTmFtZTtcbiAgfSkuY29uY2F0KFwiX3Jvb3RcIik7XG4gIGNvbnRleHQgPSB1c2VDb250ZXh0ID8gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKSA6IGluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0O1xuICBjb21tYW5kcyA9IG5hbWVzcGFjZXMucmVkdWNlKChjb21tYW5kcywgbnNwYykgPT4ge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gbnNwYyA9PT0gXCJfcm9vdFwiID8gQ29tbWFuZC5jbWRzIDogY29udGV4dC5nZXRDbWQobnNwYywge1xuICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlXG4gICAgfSk7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5jbWRzKSB7XG4gICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGNtZC5jbWRzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbW1hbmRzO1xuICB9LCBbXSk7XG4gIHRleHQgPSBjb21tYW5kcy5sZW5ndGggPyBjb21tYW5kcy5tYXAoKGNtZCkgPT4ge1xuICAgIGNtZC5pbml0KCk7XG4gICAgcmV0dXJuIChjbWQuaXNFeGVjdXRhYmxlKCkgPyAnfn4hJyA6ICd+fiFscyAnKSArIGNtZC5mdWxsTmFtZSArICd+fic7XG4gIH0pLmpvaW4oXCJcXG5cIikgOiBcIlRoaXMgY29udGFpbnMgbm8gc3ViLWNvbW1hbmRzXCI7XG4gIGlmIChib3gpIHtcbiAgICByZXR1cm4gYH5+Ym94fn5cXG4ke3RleHR9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbn07XG5cbmdldENvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgbmFtZTtcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgcmV0dXJuIFBhdGhIZWxwZXIuZ2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lKTtcbn07XG5cbnNldENvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgbmFtZSwgcCwgdmFsO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAndmFsdWUnLCAndmFsJ10pKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSwgdmFsKTtcbiAgcmV0dXJuICcnO1xufTtcblxuc3RvcmVKc29uQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWw7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdqc29uJ10pKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSwgSlNPTi5wYXJzZSh2YWwpKTtcbiAgcmV0dXJuICcnO1xufTtcblxuZ2V0UGFyYW0gPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpZiAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuZ2V0UGFyYW0oaW5zdGFuY2UucGFyYW1zLCBpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsICdkZWZhdWx0J10pKTtcbiAgfVxufTtcblxuQm94Q21kID0gY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpO1xuICAgIHRoaXMuY21kID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ2NtZCddKTtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5oZWxwZXIub3BlblRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZCArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIHRoaXMuaGVscGVyLmNsb3NlVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWQuc3BsaXQoXCIgXCIpWzBdICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzO1xuICAgIH1cbiAgICB0aGlzLmhlbHBlci5kZWNvID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5kZWNvO1xuICAgIHRoaXMuaGVscGVyLnBhZCA9IDI7XG4gICAgdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpO1xuICB9XG5cbiAgaGVpZ2h0KCkge1xuICAgIHZhciBoZWlnaHQsIHBhcmFtcztcbiAgICBpZiAodGhpcy5ib3VuZHMoKSAhPSBudWxsKSB7XG4gICAgICBoZWlnaHQgPSB0aGlzLmJvdW5kcygpLmhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVpZ2h0ID0gMztcbiAgICB9XG4gICAgcGFyYW1zID0gWydoZWlnaHQnXTtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSkge1xuICAgICAgcGFyYW1zLnB1c2goMSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgICBwYXJhbXMucHVzaCgwKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCBoZWlnaHQpO1xuICB9XG5cbiAgd2lkdGgoKSB7XG4gICAgdmFyIHBhcmFtcywgd2lkdGg7XG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgd2lkdGggPSB0aGlzLmJvdW5kcygpLndpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aWR0aCA9IDM7XG4gICAgfVxuICAgIHBhcmFtcyA9IFsnd2lkdGgnXTtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSkge1xuICAgICAgcGFyYW1zLnB1c2goMCk7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1heCh0aGlzLm1pbldpZHRoKCksIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCB3aWR0aCkpO1xuICB9XG5cbiAgYm91bmRzKCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIGlmICh0aGlzLl9ib3VuZHMgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9ib3VuZHMgPSB0aGlzLmhlbHBlci50ZXh0Qm91bmRzKHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fYm91bmRzO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB0aGlzLmhlbHBlci5oZWlnaHQgPSB0aGlzLmhlaWdodCgpO1xuICAgIHRoaXMuaGVscGVyLndpZHRoID0gdGhpcy53aWR0aCgpO1xuICAgIHJldHVybiB0aGlzLmhlbHBlci5kcmF3KHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gIH1cblxuICBtaW5XaWR0aCgpIHtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY21kLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG5cbn07XG5cbkNsb3NlQ21kID0gY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgYm94LCBib3gyLCBkZXB0aCwgcHJlZml4LCByZXF1aXJlZF9hZmZpeGVzLCBzdWZmaXg7XG4gICAgcHJlZml4ID0gdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gICAgc3VmZml4ID0gdGhpcy5oZWxwZXIuc3VmZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG4gICAgYm94ID0gdGhpcy5oZWxwZXIuZ2V0Qm94Rm9yUG9zKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkpO1xuICAgIHJlcXVpcmVkX2FmZml4ZXMgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncmVxdWlyZWRfYWZmaXhlcyddLCB0cnVlKTtcbiAgICBpZiAoIXJlcXVpcmVkX2FmZml4ZXMpIHtcbiAgICAgIHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaGVscGVyLnN1ZmZpeCA9ICcnO1xuICAgICAgYm94MiA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKTtcbiAgICAgIGlmICgoYm94MiAhPSBudWxsKSAmJiAoKGJveCA9PSBudWxsKSB8fCBib3guc3RhcnQgPCBib3gyLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCB8fCBib3guZW5kID4gYm94Mi5lbmQgKyBzdWZmaXgubGVuZ3RoKSkge1xuICAgICAgICBib3ggPSBib3gyO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYm94ICE9IG51bGwpIHtcbiAgICAgIGRlcHRoID0gdGhpcy5oZWxwZXIuZ2V0TmVzdGVkTHZsKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkuc3RhcnQpO1xuICAgICAgaWYgKGRlcHRoIDwgMikge1xuICAgICAgICB0aGlzLmluc3RhbmNlLmluQm94ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KGJveC5zdGFydCwgYm94LmVuZCwgJycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UucmVwbGFjZVdpdGgoJycpO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kID0gY2xhc3MgRWRpdENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB2YXIgcmVmO1xuICAgIHRoaXMuY21kTmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG4gICAgdGhpcy52ZXJiYWxpemUgPSAocmVmID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMV0pKSA9PT0gJ3YnIHx8IHJlZiA9PT0gJ3ZlcmJhbGl6ZSc7XG4gICAgaWYgKHRoaXMuY21kTmFtZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmZpbmRlciA9IHRoaXMuaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRGaW5kZXIodGhpcy5jbWROYW1lKTtcbiAgICAgIHRoaXMuZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlO1xuICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVkaXRhYmxlID0gdGhpcy5jbWQgIT0gbnVsbCA/IHRoaXMuY21kLmlzRWRpdGFibGUoKSA6IHRydWU7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0V2l0aENvbnRlbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0V2l0aG91dENvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICByZXN1bHRXaXRoQ29udGVudCgpIHtcbiAgICB2YXIgZGF0YSwgaSwgbGVuLCBwLCBwYXJzZXIsIHJlZjtcbiAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgICBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICBkYXRhID0ge307XG4gICAgcmVmID0gRWRpdENtZC5wcm9wcztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHAgPSByZWZbaV07XG4gICAgICBwLndyaXRlRm9yKHBhcnNlciwgZGF0YSk7XG4gICAgfVxuICAgIENvbW1hbmQuc2F2ZUNtZCh0aGlzLmNtZE5hbWUsIGRhdGEpO1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHByb3BzRGlzcGxheSgpIHtcbiAgICB2YXIgY21kO1xuICAgIGNtZCA9IHRoaXMuY21kO1xuICAgIHJldHVybiBFZGl0Q21kLnByb3BzLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gcC5kaXNwbGF5KGNtZCk7XG4gICAgfSkuZmlsdGVyKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBwICE9IG51bGw7XG4gICAgfSkuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHJlc3VsdFdpdGhvdXRDb250ZW50KCkge1xuICAgIHZhciBuYW1lLCBwYXJzZXI7XG4gICAgaWYgKCF0aGlzLmNtZCB8fCB0aGlzLmVkaXRhYmxlKSB7XG4gICAgICBuYW1lID0gdGhpcy5jbWQgPyB0aGlzLmNtZC5mdWxsTmFtZSA6IHRoaXMuY21kTmFtZTtcbiAgICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChgfn5ib3ggY21kOlwiJHt0aGlzLmluc3RhbmNlLmNtZC5mdWxsTmFtZX0gJHtuYW1lfVwifn5cXG4ke3RoaXMucHJvcHNEaXNwbGF5KCl9XFxufn4hc2F2ZX5+IH5+IWNsb3Nlfn5cXG5+fi9ib3h+fmApO1xuICAgICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy52ZXJiYWxpemUpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5nZXRUZXh0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWQuc2V0Q21kcyA9IGZ1bmN0aW9uKGJhc2UpIHtcbiAgdmFyIGksIGluSW5zdGFuY2UsIGxlbiwgcCwgcmVmO1xuICBpbkluc3RhbmNlID0gYmFzZS5pbl9pbnN0YW5jZSA9IHtcbiAgICBjbWRzOiB7fVxuICB9O1xuICByZWYgPSBFZGl0Q21kLnByb3BzO1xuICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBwID0gcmVmW2ldO1xuICAgIHAuc2V0Q21kKGluSW5zdGFuY2UuY21kcyk7XG4gIH1cbiAgLy8gcC5zZXRDbWQoYmFzZSlcbiAgcmV0dXJuIGJhc2U7XG59O1xuXG5FZGl0Q21kLnByb3BzID0gW1xuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fY2FycmV0JyxcbiAge1xuICAgIG9wdDogJ2NoZWNrQ2FycmV0J1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJyxcbiAge1xuICAgIG9wdDogJ3BhcnNlJ1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3ByZXZlbnRfcGFyc2VfYWxsJyxcbiAge1xuICAgIG9wdDogJ3ByZXZlbnRQYXJzZUFsbCdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCdyZXBsYWNlX2JveCcsXG4gIHtcbiAgICBvcHQ6ICdyZXBsYWNlQm94J1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnbmFtZV90b19wYXJhbScsXG4gIHtcbiAgICBvcHQ6ICduYW1lVG9QYXJhbSdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoJ2FsaWFzX29mJyxcbiAge1xuICAgIHZhcjogJ2FsaWFzT2YnLFxuICAgIGNhcnJldDogdHJ1ZVxuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnaGVscCcsXG4gIHtcbiAgICBmdW5jdDogJ2hlbHAnLFxuICAgIHNob3dFbXB0eTogdHJ1ZVxuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnc291cmNlJyxcbiAge1xuICAgIHZhcjogJ3Jlc3VsdFN0cicsXG4gICAgZGF0YU5hbWU6ICdyZXN1bHQnLFxuICAgIHNob3dFbXB0eTogdHJ1ZSxcbiAgICBjYXJyZXQ6IHRydWVcbiAgfSlcbl07XG5cbk5hbWVTcGFjZUNtZCA9IGNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMF0pO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBpLCBsZW4sIG5hbWVzcGFjZXMsIG5zcGMsIHBhcnNlciwgdHh0O1xuICAgIGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5uYW1lKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZXNwYWNlcyA9IHRoaXMuaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCk7XG4gICAgICB0eHQgPSAnfn5ib3h+flxcbic7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lc3BhY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIG5zcGMgPSBuYW1lc3BhY2VzW2ldO1xuICAgICAgICBpZiAobnNwYyAhPT0gdGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWUpIHtcbiAgICAgICAgICB0eHQgKz0gbnNwYyArICdcXG4nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0eHQgKz0gJ35+IWNsb3NlfH5+XFxufn4vYm94fn4nO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dCk7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgfVxuICB9XG5cbn07XG5cbkVtbWV0Q21kID0gY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5hYmJyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2FiYnInLCAnYWJicmV2aWF0aW9uJ10pO1xuICAgIHJldHVybiB0aGlzLmxhbmcgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxLCAnbGFuZycsICdsYW5ndWFnZSddKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgZW1tZXQsIGV4LCByZXM7XG4gICAgZW1tZXQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IHdpbmRvdy5lbW1ldCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmID0gd2luZG93LnNlbGYpICE9IG51bGwgPyByZWYuZW1tZXQgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZWxmLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmMSA9IHdpbmRvdy5nbG9iYWwpICE9IG51bGwgPyByZWYxLmVtbWV0IDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2xvYmFsLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiByZXF1aXJlICE9PSBudWxsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJ2VtbWV0Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmxvZ2dlci5sb2coJ0VtbWV0IGlzIG5vdCBhdmFpbGFibGUsIGl0IG1heSBuZWVkIHRvIGJlIGluc3RhbGxlZCBtYW51YWxseScpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkuY2FsbCh0aGlzKTtcbiAgICBpZiAoZW1tZXQgIT0gbnVsbCkge1xuICAgICAgLy8gZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKHRoaXMuYWJiciwgdGhpcy5sYW5nKTtcbiAgICAgIHJldHVybiByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBIdG1sQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBodG1sID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2h0bWwnKSlcbiAgaHRtbC5hZGRDbWRzKHtcbiAgICAnZmFsbGJhY2snOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOmVtbWV0JyxcbiAgICAgICdkZWZhdWx0cycgOiB7J2xhbmcnOidodG1sJ30sXG4gICAgICAnbmFtZVRvUGFyYW0nIDogJ2FiYnInXG4gICAgfSxcbiAgfSlcbiAgXG4gIGNzcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjc3MnKSlcbiAgY3NzLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6ZW1tZXQnLFxuICAgICAgJ2RlZmF1bHRzJyA6IHsnbGFuZyc6J2Nzcyd9LFxuICAgICAgJ25hbWVUb1BhcmFtJyA6ICdhYmJyJ1xuICAgIH0sXG4gIH0pXG5cbiIsImltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgSHRtbENvbW1hbmRQcm92aWRlciA9IGNsYXNzIEh0bWxDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNzcywgaHRtbDtcbiAgICBodG1sID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2h0bWwnKSk7XG4gICAgaHRtbC5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplbW1ldCcsXG4gICAgICAgICdkZWZhdWx0cyc6IHtcbiAgICAgICAgICAnbGFuZyc6ICdodG1sJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjc3MgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY3NzJykpO1xuICAgIHJldHVybiBjc3MuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICAnZGVmYXVsdHMnOiB7XG4gICAgICAgICAgJ2xhbmcnOiAnY3NzJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBKc0NvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAganMgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnanMnKSlcbiAgY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2phdmFzY3JpcHQnLHsgYWxpYXNPZjogJ2pzJyB9KSlcbiAganMuYWRkQ21kcyh7XG4gICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICdpZic6ICAnaWYofCl7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnbG9nJzogICdpZih3aW5kb3cuY29uc29sZSl7XFxuXFx0Y29uc29sZS5sb2cofn5jb250ZW50fn58KVxcbn0nLFxuICAgICdmdW5jdGlvbic6XHQnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdmdW5jdCc6eyBhbGlhc09mOiAnanM6ZnVuY3Rpb24nIH0sXG4gICAgJ2YnOnsgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbicgfSxcbiAgICAnZm9yJzogXHRcdCdmb3IgKHZhciBpID0gMDsgaSA8IHw7IGkrKykge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2ZvcmluJzonZm9yICh2YXIgdmFsIGluIHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdlYWNoJzp7ICBhbGlhc09mOiAnanM6Zm9yaW4nIH0sXG4gICAgJ2ZvcmVhY2gnOnsgIGFsaWFzT2Y6ICdqczpmb3JpbicgfSxcbiAgICAnd2hpbGUnOiAgJ3doaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICd3aGlsZWknOiAndmFyIGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcblxcdGkrKztcXG59JyxcbiAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+Y29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAnaWZlJzp7ICAgYWxpYXNPZjogJ2pzOmlmZWxzZScgfSxcbiAgICAnc3dpdGNoJzpcdFwiXCJcIlxuICAgICAgc3dpdGNoKCB8ICkgeyBcbiAgICAgIFxcdGNhc2UgOlxuICAgICAgXFx0XFx0fn5jb250ZW50fn5cbiAgICAgIFxcdFxcdGJyZWFrO1xuICAgICAgXFx0ZGVmYXVsdCA6XG4gICAgICBcXHRcXHRcbiAgICAgIFxcdFxcdGJyZWFrO1xuICAgICAgfVxuICAgICAgXCJcIlwiLFxuICB9KVxuIiwiaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBKc0NvbW1hbmRQcm92aWRlciA9IGNsYXNzIEpzQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBqcztcbiAgICBqcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqcycpKTtcbiAgICBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnamF2YXNjcmlwdCcsIHtcbiAgICAgIGFsaWFzT2Y6ICdqcydcbiAgICB9KSk7XG4gICAgcmV0dXJuIGpzLmFkZENtZHMoe1xuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgJ2lmJzogJ2lmKHwpe1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnbG9nJzogJ2lmKHdpbmRvdy5jb25zb2xlKXtcXG5cXHRjb25zb2xlLmxvZyh+fmNvbnRlbnR+fnwpXFxufScsXG4gICAgICAnZnVuY3Rpb24nOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2YnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZm9yJzogJ2ZvciAodmFyIGkgPSAwOyBpIDwgfDsgaSsrKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdmb3Jpbic6ICdmb3IgKHZhciB2YWwgaW4gfCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgICdmb3JlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgJ3doaWxlJzogJ3doaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ3doaWxlaSc6ICd2YXIgaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxuXFx0aSsrO1xcbn0nLFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgICAnaWZlJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6aWZlbHNlJ1xuICAgICAgfSxcbiAgICAgICdzd2l0Y2gnOiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5jb250ZW50fn5cXG5cXHRcXHRicmVhaztcXG5cXHRkZWZhdWx0IDpcXG5cXHRcXHRcXG5cXHRcXHRicmVhaztcXG59XCJcbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5pbXBvcnQgeyBQYWlyRGV0ZWN0b3IgfSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCBjbGFzcyBQaHBDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIHBocCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdwaHAnKSlcbiAgcGhwLmFkZERldGVjdG9yKG5ldyBQYWlyRGV0ZWN0b3Ioe1xuICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgb3BlbmVyOiAnPD9waHAnLFxuICAgIGNsb3NlcjogJz8+JyxcbiAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICdlbHNlJzogJ3BocDpvdXRlcidcbiAgfSkpIFxuXG4gIHBocE91dGVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnb3V0ZXInKSlcbiAgcGhwT3V0ZXIuYWRkQ21kcyh7XG4gICAgJ2ZhbGxiYWNrJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdhbnlfY29udGVudCc6IHsgXG4gICAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcgXG4gICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbidcbiAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICdcbiAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBhbGlhc09mOiAncGhwOmlubmVyOiVuYW1lJScsXG4gICAgICBhbHRlclJlc3VsdDogd3JhcFdpdGhQaHBcbiAgICB9LFxuICAgICdib3gnOiB7IFxuICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyBcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHByZWZpeDogJzw/cGhwXFxuJ1xuICAgICAgICBzdWZmaXg6ICdcXG4/PidcbiAgICAgIH1cbiAgICB9LFxuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+JyxcbiAgfSlcbiAgXG4gIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSlcbiAgcGhwSW5uZXIuYWRkQ21kcyh7XG4gICAgJ2FueV9jb250ZW50JzogeyBhbGlhc09mOiAnY29yZTpjb250ZW50JyB9LFxuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAnaWYnOiAgICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnaW5mbyc6ICdwaHBpbmZvKCk7JyxcbiAgICAnZWNobyc6ICdlY2hvIHwnLFxuICAgICdlJzp7ICAgYWxpYXNPZjogJ3BocDppbm5lcjplY2hvJyB9LFxuICAgICdjbGFzcyc6e1xuICAgICAgcmVzdWx0IDogXCJcIlwiXG4gICAgICAgIGNsYXNzIH5+cGFyYW0gMCBjbGFzcyBkZWY6fH5+IHtcbiAgICAgICAgXFx0ZnVuY3Rpb24gX19jb25zdHJ1Y3QoKSB7XG4gICAgICAgIFxcdFxcdH5+Y29udGVudH5+fFxuICAgICAgICBcXHR9XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiLFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2MnOnsgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnIH0sXG4gICAgJ2Z1bmN0aW9uJzpcdHtcbiAgICAgIHJlc3VsdCA6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufSdcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdmdW5jdCc6eyBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJyB9LFxuICAgICdmJzp7ICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJyB9LFxuICAgICdhcnJheSc6ICAnJHwgPSBhcnJheSgpOycsXG4gICAgJ2EnOlx0ICAgICdhcnJheSgpJyxcbiAgICAnZm9yJzogXHRcdCdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICdmb3JlYWNoJzonZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ2VhY2gnOnsgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Zm9yZWFjaCcgfSxcbiAgICAnd2hpbGUnOiAgJ3doaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnd2hpbGVpJzoge1xuICAgICAgcmVzdWx0IDogJyRpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxuXFx0JGkrKztcXG59JyxcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAnaWZlJzp7ICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnIH0sXG4gICAgJ3N3aXRjaCc6XHR7XG4gICAgICByZXN1bHQgOiBcIlwiXCJcbiAgICAgICAgc3dpdGNoKCB8ICkgeyBcbiAgICAgICAgXFx0Y2FzZSA6XG4gICAgICAgIFxcdFxcdH5+YW55X2NvbnRlbnR+flxuICAgICAgICBcXHRcXHRicmVhaztcbiAgICAgICAgXFx0ZGVmYXVsdCA6XG4gICAgICAgIFxcdFxcdFxuICAgICAgICBcXHRcXHRicmVhaztcbiAgICAgICAgfVxuICAgICAgICBcIlwiXCIsXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgICdjbG9zZSc6IHsgXG4gICAgICBhbGlhc09mOiAnY29yZTpjbG9zZScgXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBwcmVmaXg6ICc8P3BocFxcbidcbiAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIHJlcXVpcmVkX2FmZml4ZXM6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgfSlcbiAgXG5cbndyYXBXaXRoUGhwID0gKHJlc3VsdCxpbnN0YW5jZSkgLT5cbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywnaW5saW5lJ10sdHJ1ZSlcbiAgaWYgaW5saW5lXG4gICAgcmVnT3BlbiA9IC88XFw/cGhwXFxzKFtcXFxcblxcXFxyXFxzXSspL2dcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZ1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/PidcbiAgZWxzZVxuICAgICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nXG5cbiMgY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuIyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICciLCJ2YXIgd3JhcFdpdGhQaHA7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIFBhaXJEZXRlY3RvclxufSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCB2YXIgUGhwQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBwaHAsIHBocElubmVyLCBwaHBPdXRlcjtcbiAgICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpO1xuICAgIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgICBvcGVuZXI6ICc8P3BocCcsXG4gICAgICBjbG9zZXI6ICc/PicsXG4gICAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICAgJ2Vsc2UnOiAncGhwOm91dGVyJ1xuICAgIH0pKTtcbiAgICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpO1xuICAgIHBocE91dGVyLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnYW55X2NvbnRlbnQnOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50JyxcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbicsXG4gICAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICcsXG4gICAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6JW5hbWUlJyxcbiAgICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgICB9LFxuICAgICAgJ2JveCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+J1xuICAgIH0pO1xuICAgIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSk7XG4gICAgcmV0dXJuIHBocElubmVyLmFkZENtZHMoe1xuICAgICAgJ2FueV9jb250ZW50Jzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50J1xuICAgICAgfSxcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgICdpZic6ICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdpbmZvJzogJ3BocGluZm8oKTsnLFxuICAgICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAgICdlJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmVjaG8nXG4gICAgICB9LFxuICAgICAgJ2NsYXNzJzoge1xuICAgICAgICByZXN1bHQ6IFwiY2xhc3Mgfn5wYXJhbSAwIGNsYXNzIGRlZjp8fn4ge1xcblxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xcblxcdFxcdH5+Y29udGVudH5+fFxcblxcdH1cXG59XCIsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2MnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnXG4gICAgICB9LFxuICAgICAgJ2Z1bmN0aW9uJzoge1xuICAgICAgICByZXN1bHQ6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdhcnJheSc6ICckfCA9IGFycmF5KCk7JyxcbiAgICAgICdhJzogJ2FycmF5KCknLFxuICAgICAgJ2Zvcic6ICdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2ZvcmVhY2gnOiAnZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmb3JlYWNoJ1xuICAgICAgfSxcbiAgICAgICd3aGlsZSc6ICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnd2hpbGVpJzoge1xuICAgICAgICByZXN1bHQ6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgJ2lmZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnXG4gICAgICB9LFxuICAgICAgJ3N3aXRjaCc6IHtcbiAgICAgICAgcmVzdWx0OiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5hbnlfY29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufVwiLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PicsXG4gICAgICAgICAgcmVxdWlyZWRfYWZmaXhlczogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbndyYXBXaXRoUGhwID0gZnVuY3Rpb24ocmVzdWx0LCBpbnN0YW5jZSkge1xuICB2YXIgaW5saW5lLCByZWdDbG9zZSwgcmVnT3BlbjtcbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywgJ2lubGluZSddLCB0cnVlKTtcbiAgaWYgKGlubGluZSkge1xuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nO1xuICAgIHJlZ0Nsb3NlID0gLyhbXFxuXFxyXFxzXSspXFxzXFw/Pi9nO1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/Pic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nO1xuICB9XG59O1xuXG4vLyBjbG9zZVBocEZvckNvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4vLyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICdcbiIsImltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9ib290c3RyYXAnO1xuaW1wb3J0IHsgVGV4dEFyZWFFZGl0b3IgfSBmcm9tICcuL1RleHRBcmVhRWRpdG9yJztcblxuQ29kZXdhdmUuZGV0ZWN0ID0gKHRhcmdldCkgLT5cbiAgY3cgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRBcmVhRWRpdG9yKHRhcmdldCkpXG4gIENvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KVxuICBjd1xuXG5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZVxuXG53aW5kb3cuQ29kZXdhdmUgPSBDb2Rld2F2ZVxuXG4gICIsImltcG9ydCB7XG4gIENvZGV3YXZlXG59IGZyb20gJy4vYm9vdHN0cmFwJztcblxuaW1wb3J0IHtcbiAgVGV4dEFyZWFFZGl0b3Jcbn0gZnJvbSAnLi9UZXh0QXJlYUVkaXRvcic7XG5cbkNvZGV3YXZlLmRldGVjdCA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICB2YXIgY3c7XG4gIGN3ID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvcih0YXJnZXQpKTtcbiAgQ29kZXdhdmUuaW5zdGFuY2VzLnB1c2goY3cpO1xuICByZXR1cm4gY3c7XG59O1xuXG5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZTtcblxud2luZG93LkNvZGV3YXZlID0gQ29kZXdhdmU7XG4iLCJleHBvcnQgY2xhc3MgQXJyYXlIZWxwZXJcbiAgQGlzQXJyYXk6IChhcnIpIC0+XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggYXJyICkgPT0gJ1tvYmplY3QgQXJyYXldJ1xuICBcbiAgQHVuaW9uOiAoYTEsYTIpIC0+XG4gICAgQHVuaXF1ZShhMS5jb25jYXQoYTIpKVxuICAgIFxuICBAdW5pcXVlOiAoYXJyYXkpIC0+XG4gICAgYSA9IGFycmF5LmNvbmNhdCgpXG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgYS5sZW5ndGhcbiAgICAgIGogPSBpICsgMVxuICAgICAgd2hpbGUgaiA8IGEubGVuZ3RoXG4gICAgICAgIGlmIGFbaV0gPT0gYVtqXVxuICAgICAgICAgIGEuc3BsaWNlKGotLSwgMSlcbiAgICAgICAgKytqXG4gICAgICArK2lcbiAgICBhIiwiZXhwb3J0IHZhciBBcnJheUhlbHBlciA9IGNsYXNzIEFycmF5SGVscGVyIHtcbiAgc3RhdGljIGlzQXJyYXkoYXJyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9XG5cbiAgc3RhdGljIHVuaW9uKGExLCBhMikge1xuICAgIHJldHVybiB0aGlzLnVuaXF1ZShhMS5jb25jYXQoYTIpKTtcbiAgfVxuXG4gIHN0YXRpYyB1bmlxdWUoYXJyYXkpIHtcbiAgICB2YXIgYSwgaSwgajtcbiAgICBhID0gYXJyYXkuY29uY2F0KCk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBhLmxlbmd0aCkge1xuICAgICAgaiA9IGkgKyAxO1xuICAgICAgd2hpbGUgKGogPCBhLmxlbmd0aCkge1xuICAgICAgICBpZiAoYVtpXSA9PT0gYVtqXSkge1xuICAgICAgICAgIGEuc3BsaWNlKGotLSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgKytqO1xuICAgICAgfVxuICAgICAgKytpO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIENvbW1vbkhlbHBlclxuXG4gIEBtZXJnZTogKHhzLi4uKSAtPlxuICAgIGlmIHhzPy5sZW5ndGggPiAwXG4gICAgICBAdGFwIHt9LCAobSkgLT4gbVtrXSA9IHYgZm9yIGssIHYgb2YgeCBmb3IgeCBpbiB4c1xuIFxuICBAdGFwOiAobywgZm4pIC0+IFxuICAgIGZuKG8pXG4gICAgb1xuXG4gIEBhcHBseU1peGluczogKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIC0+IFxuICAgIGJhc2VDdG9ycy5mb3JFYWNoIChiYXNlQ3RvcikgPT4gXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpLmZvckVhY2ggKG5hbWUpPT4gXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLCBuYW1lLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2VDdG9yLnByb3RvdHlwZSwgbmFtZSkpIiwiZXhwb3J0IHZhciBDb21tb25IZWxwZXIgPSBjbGFzcyBDb21tb25IZWxwZXIge1xuICBzdGF0aWMgbWVyZ2UoLi4ueHMpIHtcbiAgICBpZiAoKHhzICE9IG51bGwgPyB4cy5sZW5ndGggOiB2b2lkIDApID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFwKHt9LCBmdW5jdGlvbihtKSB7XG4gICAgICAgIHZhciBpLCBrLCBsZW4sIHJlc3VsdHMsIHYsIHg7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0geHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB4ID0geHNbaV07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzMTtcbiAgICAgICAgICAgIHJlc3VsdHMxID0gW107XG4gICAgICAgICAgICBmb3IgKGsgaW4geCkge1xuICAgICAgICAgICAgICB2ID0geFtrXTtcbiAgICAgICAgICAgICAgcmVzdWx0czEucHVzaChtW2tdID0gdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0czE7XG4gICAgICAgICAgfSkoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdGFwKG8sIGZuKSB7XG4gICAgZm4obyk7XG4gICAgcmV0dXJuIG87XG4gIH1cblxuICBzdGF0aWMgYXBwbHlNaXhpbnMoZGVyaXZlZEN0b3IsIGJhc2VDdG9ycykge1xuICAgIHJldHVybiBiYXNlQ3RvcnMuZm9yRWFjaCgoYmFzZUN0b3IpID0+IHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbn07XG4iLCJcbmV4cG9ydCBjbGFzcyBOYW1lc3BhY2VIZWxwZXJcblxuICBAc3BsaXRGaXJzdDogKGZ1bGxuYW1lLGlzU3BhY2UgPSBmYWxzZSkgLT5cbiAgICBpZiBmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PSAtMSBhbmQgIWlzU3BhY2VcbiAgICAgIHJldHVybiBbbnVsbCxmdWxsbmFtZV1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6JylcbiAgICByZXR1cm4gW3BhcnRzLnNoaWZ0KCkscGFydHMuam9pbignOicpIHx8IG51bGxdXG5cbiAgQHNwbGl0OiAoZnVsbG5hbWUpIC0+XG4gICAgaWYgZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT0gLTFcbiAgICAgIHJldHVybiBbbnVsbCxmdWxsbmFtZV1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6JylcbiAgICBuYW1lID0gcGFydHMucG9wKClcbiAgICBbcGFydHMuam9pbignOicpLG5hbWVdIiwiZXhwb3J0IHZhciBOYW1lc3BhY2VIZWxwZXIgPSBjbGFzcyBOYW1lc3BhY2VIZWxwZXIge1xuICBzdGF0aWMgc3BsaXRGaXJzdChmdWxsbmFtZSwgaXNTcGFjZSA9IGZhbHNlKSB7XG4gICAgdmFyIHBhcnRzO1xuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PT0gLTEgJiYgIWlzU3BhY2UpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdO1xuICAgIH1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6Jyk7XG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLCBwYXJ0cy5qb2luKCc6JykgfHwgbnVsbF07XG4gIH1cblxuICBzdGF0aWMgc3BsaXQoZnVsbG5hbWUpIHtcbiAgICB2YXIgbmFtZSwgcGFydHM7XG4gICAgaWYgKGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09PSAtMSkge1xuICAgICAgcmV0dXJuIFtudWxsLCBmdWxsbmFtZV07XG4gICAgfVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKTtcbiAgICBuYW1lID0gcGFydHMucG9wKCk7XG4gICAgcmV0dXJuIFtwYXJ0cy5qb2luKCc6JyksIG5hbWVdO1xuICB9XG5cbn07XG4iLCJcbmV4cG9ydCBjbGFzcyBPcHRpb25hbFByb21pc2VcbiAgICBjb25zdHJ1Y3RvcjogKEB2YWwpIC0+XG4gICAgICAgIGlmIEB2YWw/IGFuZCBAdmFsLnRoZW4/IGFuZCBAdmFsLnJlc3VsdD9cbiAgICAgICAgICAgIEB2YWwgPSBAdmFsLnJlc3VsdCgpXG4gICAgdGhlbjogKGNiKSAtPlxuICAgICAgICBpZiBAdmFsPyBhbmQgQHZhbC50aGVuP1xuICAgICAgICAgICAgbmV3IE9wdGlvbmFsUHJvbWlzZShAdmFsLnRoZW4oY2IpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXcgT3B0aW9uYWxQcm9taXNlKGNiKEB2YWwpKVxuICAgIHJlc3VsdDogLT5cbiAgICAgICAgQHZhbFxuXG5leHBvcnQgb3B0aW9uYWxQcm9taXNlID0gKHZhbCktPiBcbiAgICBuZXcgT3B0aW9uYWxQcm9taXNlKHZhbClcblxuXG4iLCJleHBvcnQgdmFyIE9wdGlvbmFsUHJvbWlzZSA9IGNsYXNzIE9wdGlvbmFsUHJvbWlzZSB7XG4gIGNvbnN0cnVjdG9yKHZhbDEpIHtcbiAgICB0aGlzLnZhbCA9IHZhbDE7XG4gICAgaWYgKCh0aGlzLnZhbCAhPSBudWxsKSAmJiAodGhpcy52YWwudGhlbiAhPSBudWxsKSAmJiAodGhpcy52YWwucmVzdWx0ICE9IG51bGwpKSB7XG4gICAgICB0aGlzLnZhbCA9IHRoaXMudmFsLnJlc3VsdCgpO1xuICAgIH1cbiAgfVxuXG4gIHRoZW4oY2IpIHtcbiAgICBpZiAoKHRoaXMudmFsICE9IG51bGwpICYmICh0aGlzLnZhbC50aGVuICE9IG51bGwpKSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh0aGlzLnZhbC50aGVuKGNiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKGNiKHRoaXMudmFsKSk7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHJldHVybiB0aGlzLnZhbDtcbiAgfVxuXG59O1xuXG5leHBvcnQgdmFyIG9wdGlvbmFsUHJvbWlzZSA9IGZ1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh2YWwpO1xufTtcbiIsImV4cG9ydCBjbGFzcyBQYXRoSGVscGVyXG4gIEBnZXRQYXRoOiAob2JqLHBhdGgsc2VwPScuJykgLT5cbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKVxuICAgIGN1ciA9IG9ialxuICAgIHBhcnRzLmZpbmQgKHBhcnQpID0+XG4gICAgICBjdXIgPSBjdXJbcGFydF1cbiAgICAgIHR5cGVvZiBjdXIgPT0gXCJ1bmRlZmluZWRcIlxuICAgIGN1clxuICAgIFxuICBcbiAgQHNldFBhdGg6IChvYmoscGF0aCx2YWwsc2VwPScuJykgLT5cbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKVxuICAgIGxhc3QgPSBwYXJ0cy5wb3AoKVxuICAgIHBhcnRzLnJlZHVjZSgoY3VyLHBhcnQpID0+XG4gICAgICBpZiBjdXJbcGFydF0/XG4gICAgICAgIGN1cltwYXJ0XVxuICAgICAgZWxzZVxuICAgICAgICBjdXJbcGFydF0gPSB7fVxuICAgICwgb2JqKVtsYXN0XSA9IHZhbFxuICAgICIsImV4cG9ydCB2YXIgUGF0aEhlbHBlciA9IGNsYXNzIFBhdGhIZWxwZXIge1xuICBzdGF0aWMgZ2V0UGF0aChvYmosIHBhdGgsIHNlcCA9ICcuJykge1xuICAgIHZhciBjdXIsIHBhcnRzO1xuICAgIHBhcnRzID0gcGF0aC5zcGxpdChzZXApO1xuICAgIGN1ciA9IG9iajtcbiAgICBwYXJ0cy5maW5kKChwYXJ0KSA9PiB7XG4gICAgICBjdXIgPSBjdXJbcGFydF07XG4gICAgICByZXR1cm4gdHlwZW9mIGN1ciA9PT0gXCJ1bmRlZmluZWRcIjtcbiAgICB9KTtcbiAgICByZXR1cm4gY3VyO1xuICB9XG5cbiAgc3RhdGljIHNldFBhdGgob2JqLCBwYXRoLCB2YWwsIHNlcCA9ICcuJykge1xuICAgIHZhciBsYXN0LCBwYXJ0cztcbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKTtcbiAgICBsYXN0ID0gcGFydHMucG9wKCk7XG4gICAgcmV0dXJuIHBhcnRzLnJlZHVjZSgoY3VyLCBwYXJ0KSA9PiB7XG4gICAgICBpZiAoY3VyW3BhcnRdICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGN1cltwYXJ0XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjdXJbcGFydF0gPSB7fTtcbiAgICAgIH1cbiAgICB9LCBvYmopW2xhc3RdID0gdmFsO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBTaXplIH0gZnJvbSAnLi4vcG9zaXRpb25pbmcvU2l6ZSc7XG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdIZWxwZXJcbiAgQHRyaW1FbXB0eUxpbmU6ICh0eHQpIC0+XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKC9eXFxzKlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyP1xcblxccyokLywgJycpXG5cbiAgQGVzY2FwZVJlZ0V4cDogKHN0cikgLT5cbiAgICBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpXG5cbiAgQHJlcGVhdFRvTGVuZ3RoOiAodHh0LCBsZW5ndGgpIC0+XG4gICAgcmV0dXJuICcnIGlmIGxlbmd0aCA8PSAwXG4gICAgQXJyYXkoTWF0aC5jZWlsKGxlbmd0aC90eHQubGVuZ3RoKSsxKS5qb2luKHR4dCkuc3Vic3RyaW5nKDAsbGVuZ3RoKVxuICAgIFxuICBAcmVwZWF0OiAodHh0LCBuYikgLT5cbiAgICBBcnJheShuYisxKS5qb2luKHR4dClcbiAgICBcbiAgQGdldFR4dFNpemU6ICh0eHQpIC0+XG4gICAgbGluZXMgPSB0eHQucmVwbGFjZSgvXFxyL2csJycpLnNwbGl0KFwiXFxuXCIpXG4gICAgdyA9IDBcbiAgICBmb3IgbCBpbiBsaW5lc1xuICAgICAgdyA9IE1hdGgubWF4KHcsbC5sZW5ndGgpXG4gICAgcmV0dXJuIG5ldyBTaXplKHcsbGluZXMubGVuZ3RoLTEpXG5cbiAgQGluZGVudE5vdEZpcnN0OiAodGV4dCxuYj0xLHNwYWNlcz0nICAnKSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZWcgPSAvXFxuL2dcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCBcIlxcblwiICsgQHJlcGVhdChzcGFjZXMsIG5iKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICAgICAgXG4gIEBpbmRlbnQ6ICh0ZXh0LG5iPTEsc3BhY2VzPScgICcpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJldHVybiBzcGFjZXMgKyBAaW5kZW50Tm90Rmlyc3QodGV4dCxuYixzcGFjZXMpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgXG4gIEByZXZlcnNlU3RyOiAodHh0KSAtPlxuICAgIHJldHVybiB0eHQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIilcbiAgXG4gIFxuICBAcmVtb3ZlQ2FycmV0OiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHRtcCA9ICdbW1tbcXVvdGVkX2NhcnJldF1dXV0nXG4gICAgcmVDYXJyZXQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIrY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHJlVG1wID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKHRtcCksIFwiZ1wiKVxuICAgIHR4dC5yZXBsYWNlKHJlUXVvdGVkLHRtcCkucmVwbGFjZShyZUNhcnJldCwnJykucmVwbGFjZShyZVRtcCwgY2FycmV0Q2hhcilcbiAgICBcbiAgQGdldEFuZFJlbW92ZUZpcnN0Q2FycmV0OiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHBvcyA9IEBnZXRDYXJyZXRQb3ModHh0LGNhcnJldENoYXIpXG4gICAgaWYgcG9zP1xuICAgICAgdHh0ID0gdHh0LnN1YnN0cigwLHBvcykgKyB0eHQuc3Vic3RyKHBvcytjYXJyZXRDaGFyLmxlbmd0aClcbiAgICAgIHJldHVybiBbcG9zLHR4dF1cbiAgICAgIFxuICBAZ2V0Q2FycmV0UG9zOiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIrY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHR4dCA9IHR4dC5yZXBsYWNlKHJlUXVvdGVkLCAnICcpXG4gICAgaWYgKGkgPSB0eHQuaW5kZXhPZihjYXJyZXRDaGFyKSkgPiAtMVxuICAgICAgcmV0dXJuIGkiLCJpbXBvcnQge1xuICBTaXplXG59IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1NpemUnO1xuXG5leHBvcnQgdmFyIFN0cmluZ0hlbHBlciA9IGNsYXNzIFN0cmluZ0hlbHBlciB7XG4gIHN0YXRpYyB0cmltRW1wdHlMaW5lKHR4dCkge1xuICAgIHJldHVybiB0eHQucmVwbGFjZSgvXlxccypcXHI/XFxuLywgJycpLnJlcGxhY2UoL1xccj9cXG5cXHMqJC8sICcnKTtcbiAgfVxuXG4gIHN0YXRpYyBlc2NhcGVSZWdFeHAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gIH1cblxuICBzdGF0aWMgcmVwZWF0VG9MZW5ndGgodHh0LCBsZW5ndGgpIHtcbiAgICBpZiAobGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5KE1hdGguY2VpbChsZW5ndGggLyB0eHQubGVuZ3RoKSArIDEpLmpvaW4odHh0KS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXQodHh0LCBuYikge1xuICAgIHJldHVybiBBcnJheShuYiArIDEpLmpvaW4odHh0KTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRUeHRTaXplKHR4dCkge1xuICAgIHZhciBqLCBsLCBsZW4sIGxpbmVzLCB3O1xuICAgIGxpbmVzID0gdHh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIik7XG4gICAgdyA9IDA7XG4gICAgZm9yIChqID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIGwgPSBsaW5lc1tqXTtcbiAgICAgIHcgPSBNYXRoLm1heCh3LCBsLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgU2l6ZSh3LCBsaW5lcy5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnROb3RGaXJzdCh0ZXh0LCBuYiA9IDEsIHNwYWNlcyA9ICcgICcpIHtcbiAgICB2YXIgcmVnO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IC9cXG4vZztcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCBcIlxcblwiICsgdGhpcy5yZXBlYXQoc3BhY2VzLCBuYikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaW5kZW50KHRleHQsIG5iID0gMSwgc3BhY2VzID0gJyAgJykge1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBzcGFjZXMgKyB0aGlzLmluZGVudE5vdEZpcnN0KHRleHQsIG5iLCBzcGFjZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcmV2ZXJzZVN0cih0eHQpIHtcbiAgICByZXR1cm4gdHh0LnNwbGl0KFwiXCIpLnJldmVyc2UoKS5qb2luKFwiXCIpO1xuICB9XG5cbiAgc3RhdGljIHJlbW92ZUNhcnJldCh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcmVDYXJyZXQsIHJlUXVvdGVkLCByZVRtcCwgdG1wO1xuICAgIHRtcCA9ICdbW1tbcXVvdGVkX2NhcnJldF1dXV0nO1xuICAgIHJlQ2FycmV0ID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICByZVRtcCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAodG1wKSwgXCJnXCIpO1xuICAgIHJldHVybiB0eHQucmVwbGFjZShyZVF1b3RlZCwgdG1wKS5yZXBsYWNlKHJlQ2FycmV0LCAnJykucmVwbGFjZShyZVRtcCwgY2FycmV0Q2hhcik7XG4gIH1cblxuICBzdGF0aWMgZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIHBvcztcbiAgICBwb3MgPSB0aGlzLmdldENhcnJldFBvcyh0eHQsIGNhcnJldENoYXIpO1xuICAgIGlmIChwb3MgIT0gbnVsbCkge1xuICAgICAgdHh0ID0gdHh0LnN1YnN0cigwLCBwb3MpICsgdHh0LnN1YnN0cihwb3MgKyBjYXJyZXRDaGFyLmxlbmd0aCk7XG4gICAgICByZXR1cm4gW3BvcywgdHh0XTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0Q2FycmV0UG9zKHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciBpLCByZVF1b3RlZDtcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciArIGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgdHh0ID0gdHh0LnJlcGxhY2UocmVRdW90ZWQsICcgJyk7XG4gICAgaWYgKChpID0gdHh0LmluZGV4T2YoY2FycmV0Q2hhcikpID4gLTEpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL1Bvcyc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBQYWlyTWF0Y2ggfSBmcm9tICcuL1BhaXJNYXRjaCc7XG5cbmV4cG9ydCBjbGFzcyBQYWlyXG4gIGNvbnN0cnVjdG9yOiAoQG9wZW5lcixAY2xvc2VyLEBvcHRpb25zID0ge30pIC0+XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBvcHRpb25uYWxfZW5kOiBmYWxzZVxuICAgICAgdmFsaWRNYXRjaDogbnVsbFxuICAgIH1cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBAb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBAb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICBvcGVuZXJSZWc6IC0+XG4gICAgaWYgdHlwZW9mIEBvcGVuZXIgPT0gJ3N0cmluZycgXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBvcGVuZXIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAb3BlbmVyXG4gIGNsb3NlclJlZzogLT5cbiAgICBpZiB0eXBlb2YgQGNsb3NlciA9PSAnc3RyaW5nJyBcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNsb3NlcikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBjbG9zZXJcbiAgbWF0Y2hBbnlQYXJ0czogLT5cbiAgICByZXR1cm4ge1xuICAgICAgb3BlbmVyOiBAb3BlbmVyUmVnKClcbiAgICAgIGNsb3NlcjogQGNsb3NlclJlZygpXG4gICAgfVxuICBtYXRjaEFueVBhcnRLZXlzOiAtPlxuICAgIGtleXMgPSBbXVxuICAgIGZvciBrZXksIHJlZyBvZiBAbWF0Y2hBbnlQYXJ0cygpXG4gICAgICBrZXlzLnB1c2goa2V5KVxuICAgIHJldHVybiBrZXlzXG4gIG1hdGNoQW55UmVnOiAtPlxuICAgIGdyb3VwcyA9IFtdXG4gICAgZm9yIGtleSwgcmVnIG9mIEBtYXRjaEFueVBhcnRzKClcbiAgICAgIGdyb3Vwcy5wdXNoKCcoJytyZWcuc291cmNlKycpJylcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChncm91cHMuam9pbignfCcpKVxuICBtYXRjaEFueTogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgd2hpbGUgKG1hdGNoID0gQF9tYXRjaEFueSh0ZXh0LG9mZnNldCkpPyBhbmQgIW1hdGNoLnZhbGlkKClcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpXG4gICAgcmV0dXJuIG1hdGNoIGlmIG1hdGNoPyBhbmQgbWF0Y2gudmFsaWQoKVxuICBfbWF0Y2hBbnk6ICh0ZXh0LG9mZnNldD0wKSAtPlxuICAgIGlmIG9mZnNldFxuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKG9mZnNldClcbiAgICBtYXRjaCA9IEBtYXRjaEFueVJlZygpLmV4ZWModGV4dClcbiAgICBpZiBtYXRjaD9cbiAgICAgIHJldHVybiBuZXcgUGFpck1hdGNoKHRoaXMsbWF0Y2gsb2Zmc2V0KVxuICBtYXRjaEFueU5hbWVkOiAodGV4dCkgLT5cbiAgICByZXR1cm4gQF9tYXRjaEFueUdldE5hbWUoQG1hdGNoQW55KHRleHQpKVxuICBtYXRjaEFueUxhc3Q6ICh0ZXh0LG9mZnNldD0wKSAtPlxuICAgIHdoaWxlIG1hdGNoID0gQG1hdGNoQW55KHRleHQsb2Zmc2V0KVxuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKClcbiAgICAgIGlmICFyZXMgb3IgcmVzLmVuZCgpICE9IG1hdGNoLmVuZCgpXG4gICAgICAgIHJlcyA9IG1hdGNoXG4gICAgcmV0dXJuIHJlc1xuICBpZGVudGljYWw6IC0+XG4gICAgQG9wZW5lciA9PSBAY2xvc2VyIG9yIChcbiAgICAgIEBvcGVuZXIuc291cmNlPyBhbmQgXG4gICAgICBAY2xvc2VyLnNvdXJjZT8gYW5kIFxuICAgICAgQG9wZW5lci5zb3VyY2UgPT0gQGNsb3Nlci5zb3VyY2VcbiAgICApXG4gIHdyYXBwZXJQb3M6IChwb3MsdGV4dCkgLT5cbiAgICBzdGFydCA9IEBtYXRjaEFueUxhc3QodGV4dC5zdWJzdHIoMCxwb3Muc3RhcnQpKVxuICAgIGlmIHN0YXJ0PyBhbmQgKEBpZGVudGljYWwoKSBvciBzdGFydC5uYW1lKCkgPT0gJ29wZW5lcicpXG4gICAgICBlbmQgPSBAbWF0Y2hBbnkodGV4dCxwb3MuZW5kKVxuICAgICAgaWYgZW5kPyBhbmQgKEBpZGVudGljYWwoKSBvciBlbmQubmFtZSgpID09ICdjbG9zZXInKVxuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLGVuZC5lbmQoKSlcbiAgICAgIGVsc2UgaWYgQG9wdGlvbm5hbF9lbmRcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSx0ZXh0Lmxlbmd0aClcbiAgaXNXYXBwZXJPZjogKHBvcyx0ZXh0KSAtPlxuICAgIHJldHVybiBAd3JhcHBlclBvcyhwb3MsdGV4dCk/IiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vUG9zJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgUGFpck1hdGNoXG59IGZyb20gJy4vUGFpck1hdGNoJztcblxuZXhwb3J0IHZhciBQYWlyID0gY2xhc3MgUGFpciB7XG4gIGNvbnN0cnVjdG9yKG9wZW5lciwgY2xvc2VyLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsO1xuICAgIHRoaXMub3BlbmVyID0gb3BlbmVyO1xuICAgIHRoaXMuY2xvc2VyID0gY2xvc2VyO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBvcHRpb25uYWxfZW5kOiBmYWxzZSxcbiAgICAgIHZhbGlkTWF0Y2g6IG51bGxcbiAgICB9O1xuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgaWYgKGtleSBpbiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5vcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3BlbmVyUmVnKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vcGVuZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMub3BlbmVyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm9wZW5lcjtcbiAgICB9XG4gIH1cblxuICBjbG9zZXJSZWcoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmNsb3NlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jbG9zZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2VyO1xuICAgIH1cbiAgfVxuXG4gIG1hdGNoQW55UGFydHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW5lcjogdGhpcy5vcGVuZXJSZWcoKSxcbiAgICAgIGNsb3NlcjogdGhpcy5jbG9zZXJSZWcoKVxuICAgIH07XG4gIH1cblxuICBtYXRjaEFueVBhcnRLZXlzKCkge1xuICAgIHZhciBrZXksIGtleXMsIHJlZiwgcmVnO1xuICAgIGtleXMgPSBbXTtcbiAgICByZWYgPSB0aGlzLm1hdGNoQW55UGFydHMoKTtcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHJlZyA9IHJlZltrZXldO1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xuICB9XG5cbiAgbWF0Y2hBbnlSZWcoKSB7XG4gICAgdmFyIGdyb3Vwcywga2V5LCByZWYsIHJlZztcbiAgICBncm91cHMgPSBbXTtcbiAgICByZWYgPSB0aGlzLm1hdGNoQW55UGFydHMoKTtcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHJlZyA9IHJlZltrZXldO1xuICAgICAgZ3JvdXBzLnB1c2goJygnICsgcmVnLnNvdXJjZSArICcpJyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUmVnRXhwKGdyb3Vwcy5qb2luKCd8JykpO1xuICB9XG5cbiAgbWF0Y2hBbnkodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaDtcbiAgICB3aGlsZSAoKChtYXRjaCA9IHRoaXMuX21hdGNoQW55KHRleHQsIG9mZnNldCkpICE9IG51bGwpICYmICFtYXRjaC52YWxpZCgpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCAhPSBudWxsKSAmJiBtYXRjaC52YWxpZCgpKSB7XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfVxuICB9XG5cbiAgX21hdGNoQW55KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2g7XG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKG9mZnNldCk7XG4gICAgfVxuICAgIG1hdGNoID0gdGhpcy5tYXRjaEFueVJlZygpLmV4ZWModGV4dCk7XG4gICAgaWYgKG1hdGNoICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgUGFpck1hdGNoKHRoaXMsIG1hdGNoLCBvZmZzZXQpO1xuICAgIH1cbiAgfVxuXG4gIG1hdGNoQW55TmFtZWQodGV4dCkge1xuICAgIHJldHVybiB0aGlzLl9tYXRjaEFueUdldE5hbWUodGhpcy5tYXRjaEFueSh0ZXh0KSk7XG4gIH1cblxuICBtYXRjaEFueUxhc3QodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaCwgcmVzO1xuICAgIHdoaWxlIChtYXRjaCA9IHRoaXMubWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKCk7XG4gICAgICBpZiAoIXJlcyB8fCByZXMuZW5kKCkgIT09IG1hdGNoLmVuZCgpKSB7XG4gICAgICAgIHJlcyA9IG1hdGNoO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgaWRlbnRpY2FsKCkge1xuICAgIHJldHVybiB0aGlzLm9wZW5lciA9PT0gdGhpcy5jbG9zZXIgfHwgKCh0aGlzLm9wZW5lci5zb3VyY2UgIT0gbnVsbCkgJiYgKHRoaXMuY2xvc2VyLnNvdXJjZSAhPSBudWxsKSAmJiB0aGlzLm9wZW5lci5zb3VyY2UgPT09IHRoaXMuY2xvc2VyLnNvdXJjZSk7XG4gIH1cblxuICB3cmFwcGVyUG9zKHBvcywgdGV4dCkge1xuICAgIHZhciBlbmQsIHN0YXJ0O1xuICAgIHN0YXJ0ID0gdGhpcy5tYXRjaEFueUxhc3QodGV4dC5zdWJzdHIoMCwgcG9zLnN0YXJ0KSk7XG4gICAgaWYgKChzdGFydCAhPSBudWxsKSAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBzdGFydC5uYW1lKCkgPT09ICdvcGVuZXInKSkge1xuICAgICAgZW5kID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBwb3MuZW5kKTtcbiAgICAgIGlmICgoZW5kICE9IG51bGwpICYmICh0aGlzLmlkZW50aWNhbCgpIHx8IGVuZC5uYW1lKCkgPT09ICdjbG9zZXInKSkge1xuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLCBlbmQuZW5kKCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbm5hbF9lbmQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgdGV4dC5sZW5ndGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzV2FwcGVyT2YocG9zLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlclBvcyhwb3MsIHRleHQpICE9IG51bGw7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBQYWlyTWF0Y2hcbiAgY29uc3RydWN0b3I6IChAcGFpcixAbWF0Y2gsQG9mZnNldCA9IDApIC0+XG4gIG5hbWU6IC0+XG4gICAgaWYgQG1hdGNoXG4gICAgICB1bmxlc3MgX25hbWU/XG4gICAgICAgIGZvciBncm91cCwgaSBpbiBAbWF0Y2hcbiAgICAgICAgICBpZiBpID4gMCBhbmQgZ3JvdXA/XG4gICAgICAgICAgICBfbmFtZSA9IEBwYWlyLm1hdGNoQW55UGFydEtleXMoKVtpLTFdXG4gICAgICAgICAgICByZXR1cm4gX25hbWVcbiAgICAgICAgX25hbWUgPSBmYWxzZVxuICAgICAgcmV0dXJuIF9uYW1lIHx8IG51bGxcbiAgc3RhcnQ6IC0+XG4gICAgQG1hdGNoLmluZGV4ICsgQG9mZnNldFxuICBlbmQ6IC0+XG4gICAgQG1hdGNoLmluZGV4ICsgQG1hdGNoWzBdLmxlbmd0aCArIEBvZmZzZXRcbiAgdmFsaWQ6IC0+XG4gICAgcmV0dXJuICFAcGFpci52YWxpZE1hdGNoIHx8IEBwYWlyLnZhbGlkTWF0Y2godGhpcylcbiAgbGVuZ3RoOiAtPlxuICAgIEBtYXRjaFswXS5sZW5ndGgiLCJleHBvcnQgdmFyIFBhaXJNYXRjaCA9IGNsYXNzIFBhaXJNYXRjaCB7XG4gIGNvbnN0cnVjdG9yKHBhaXIsIG1hdGNoLCBvZmZzZXQgPSAwKSB7XG4gICAgdGhpcy5wYWlyID0gcGFpcjtcbiAgICB0aGlzLm1hdGNoID0gbWF0Y2g7XG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gIH1cblxuICBuYW1lKCkge1xuICAgIHZhciBfbmFtZSwgZ3JvdXAsIGksIGosIGxlbiwgcmVmO1xuICAgIGlmICh0aGlzLm1hdGNoKSB7XG4gICAgICBpZiAodHlwZW9mIF9uYW1lID09PSBcInVuZGVmaW5lZFwiIHx8IF9uYW1lID09PSBudWxsKSB7XG4gICAgICAgIHJlZiA9IHRoaXMubWF0Y2g7XG4gICAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgICAgZ3JvdXAgPSByZWZbaV07XG4gICAgICAgICAgaWYgKGkgPiAwICYmIChncm91cCAhPSBudWxsKSkge1xuICAgICAgICAgICAgX25hbWUgPSB0aGlzLnBhaXIubWF0Y2hBbnlQYXJ0S2V5cygpW2kgLSAxXTtcbiAgICAgICAgICAgIHJldHVybiBfbmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX25hbWUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfbmFtZSB8fCBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoLmluZGV4ICsgdGhpcy5vZmZzZXQ7XG4gIH1cblxuICBlbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm1hdGNoWzBdLmxlbmd0aCArIHRoaXMub2Zmc2V0O1xuICB9XG5cbiAgdmFsaWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLnBhaXIudmFsaWRNYXRjaCB8fCB0aGlzLnBhaXIudmFsaWRNYXRjaCh0aGlzKTtcbiAgfVxuXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaFswXS5sZW5ndGg7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBQb3NcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsQGVuZCkgLT5cbiAgICBAZW5kID0gQHN0YXJ0IHVubGVzcyBAZW5kP1xuICBjb250YWluc1B0OiAocHQpIC0+XG4gICAgcmV0dXJuIEBzdGFydCA8PSBwdCBhbmQgcHQgPD0gQGVuZFxuICBjb250YWluc1BvczogKHBvcykgLT5cbiAgICByZXR1cm4gQHN0YXJ0IDw9IHBvcy5zdGFydCBhbmQgcG9zLmVuZCA8PSBAZW5kXG4gIHdyYXBwZWRCeTogKHByZWZpeCxzdWZmaXgpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3Mud3JhcENsYXNzKEBzdGFydC1wcmVmaXgubGVuZ3RoLEBzdGFydCxAZW5kLEBlbmQrc3VmZml4Lmxlbmd0aClcbiAgd2l0aEVkaXRvcjogKHZhbCktPlxuICAgIEBfZWRpdG9yID0gdmFsXG4gICAgcmV0dXJuIHRoaXNcbiAgZWRpdG9yOiAtPlxuICAgIHVubGVzcyBAX2VkaXRvcj9cbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZWRpdG9yIHNldCcpXG4gICAgcmV0dXJuIEBfZWRpdG9yXG4gIGhhc0VkaXRvcjogLT5cbiAgICByZXR1cm4gQF9lZGl0b3I/XG4gIHRleHQ6IC0+XG4gICAgQGVkaXRvcigpLnRleHRTdWJzdHIoQHN0YXJ0LCBAZW5kKVxuICBhcHBseU9mZnNldDogKG9mZnNldCktPlxuICAgIGlmIG9mZnNldCAhPSAwXG4gICAgICBAc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBAZW5kICs9IG9mZnNldFxuICAgIHJldHVybiB0aGlzXG4gIHByZXZFT0w6IC0+XG4gICAgdW5sZXNzIEBfcHJldkVPTD9cbiAgICAgIEBfcHJldkVPTCA9IEBlZGl0b3IoKS5maW5kTGluZVN0YXJ0KEBzdGFydClcbiAgICByZXR1cm4gQF9wcmV2RU9MXG4gIG5leHRFT0w6IC0+XG4gICAgdW5sZXNzIEBfbmV4dEVPTD9cbiAgICAgIEBfbmV4dEVPTCA9IEBlZGl0b3IoKS5maW5kTGluZUVuZChAZW5kKVxuICAgIHJldHVybiBAX25leHRFT0xcbiAgdGV4dFdpdGhGdWxsTGluZXM6IC0+XG4gICAgdW5sZXNzIEBfdGV4dFdpdGhGdWxsTGluZXM/XG4gICAgICBAX3RleHRXaXRoRnVsbExpbmVzID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQHByZXZFT0woKSxAbmV4dEVPTCgpKVxuICAgIHJldHVybiBAX3RleHRXaXRoRnVsbExpbmVzXG4gIHNhbWVMaW5lc1ByZWZpeDogLT5cbiAgICB1bmxlc3MgQF9zYW1lTGluZXNQcmVmaXg/XG4gICAgICBAX3NhbWVMaW5lc1ByZWZpeCA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBwcmV2RU9MKCksQHN0YXJ0KVxuICAgIHJldHVybiBAX3NhbWVMaW5lc1ByZWZpeFxuICBzYW1lTGluZXNTdWZmaXg6IC0+XG4gICAgdW5sZXNzIEBfc2FtZUxpbmVzU3VmZml4P1xuICAgICAgQF9zYW1lTGluZXNTdWZmaXggPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAZW5kLEBuZXh0RU9MKCkpXG4gICAgcmV0dXJuIEBfc2FtZUxpbmVzU3VmZml4XG4gIGNvcHk6IC0+XG4gICAgcmVzID0gbmV3IFBvcyhAc3RhcnQsQGVuZClcbiAgICBpZiBAaGFzRWRpdG9yKClcbiAgICAgIHJlcy53aXRoRWRpdG9yKEBlZGl0b3IoKSlcbiAgICByZXR1cm4gcmVzXG4gIHJhdzogLT5cbiAgICBbQHN0YXJ0LEBlbmRdIiwiZXhwb3J0IHZhciBQb3MgPSBjbGFzcyBQb3Mge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgZW5kKSB7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICAgIGlmICh0aGlzLmVuZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmVuZCA9IHRoaXMuc3RhcnQ7XG4gICAgfVxuICB9XG5cbiAgY29udGFpbnNQdChwdCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0IDw9IHB0ICYmIHB0IDw9IHRoaXMuZW5kO1xuICB9XG5cbiAgY29udGFpbnNQb3MocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgPD0gcG9zLnN0YXJ0ICYmIHBvcy5lbmQgPD0gdGhpcy5lbmQ7XG4gIH1cblxuICB3cmFwcGVkQnkocHJlZml4LCBzdWZmaXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcy53cmFwQ2xhc3ModGhpcy5zdGFydCAtIHByZWZpeC5sZW5ndGgsIHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLmVuZCArIHN1ZmZpeC5sZW5ndGgpO1xuICB9XG5cbiAgd2l0aEVkaXRvcih2YWwpIHtcbiAgICB0aGlzLl9lZGl0b3IgPSB2YWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBlZGl0b3IoKSB7XG4gICAgaWYgKHRoaXMuX2VkaXRvciA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVkaXRvciBzZXQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvcjtcbiAgfVxuXG4gIGhhc0VkaXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yICE9IG51bGw7XG4gIH1cblxuICB0ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICB9XG5cbiAgYXBwbHlPZmZzZXQob2Zmc2V0KSB7XG4gICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgdGhpcy5zdGFydCArPSBvZmZzZXQ7XG4gICAgICB0aGlzLmVuZCArPSBvZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJldkVPTCgpIHtcbiAgICBpZiAodGhpcy5fcHJldkVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9wcmV2RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZVN0YXJ0KHRoaXMuc3RhcnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcHJldkVPTDtcbiAgfVxuXG4gIG5leHRFT0woKSB7XG4gICAgaWYgKHRoaXMuX25leHRFT0wgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fbmV4dEVPTCA9IHRoaXMuZWRpdG9yKCkuZmluZExpbmVFbmQodGhpcy5lbmQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbmV4dEVPTDtcbiAgfVxuXG4gIHRleHRXaXRoRnVsbExpbmVzKCkge1xuICAgIGlmICh0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcyA9PSBudWxsKSB7XG4gICAgICB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcyA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5uZXh0RU9MKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdGV4dFdpdGhGdWxsTGluZXM7XG4gIH1cblxuICBzYW1lTGluZXNQcmVmaXgoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNQcmVmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMuc3RhcnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzUHJlZml4O1xuICB9XG5cbiAgc2FtZUxpbmVzU3VmZml4KCkge1xuICAgIGlmICh0aGlzLl9zYW1lTGluZXNTdWZmaXggPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2FtZUxpbmVzU3VmZml4ID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuZW5kLCB0aGlzLm5leHRFT0woKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNTdWZmaXg7XG4gIH1cblxuICBjb3B5KCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gbmV3IFBvcyh0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgcmF3KCkge1xuICAgIHJldHVybiBbdGhpcy5zdGFydCwgdGhpcy5lbmRdO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBXcmFwcGluZyB9IGZyb20gJy4vV3JhcHBpbmcnO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL1JlcGxhY2VtZW50JztcbmltcG9ydCB7IENvbW1vbkhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcblxuZXhwb3J0IGNsYXNzIFBvc0NvbGxlY3Rpb25cbiAgY29uc3RydWN0b3I6IChhcnIpIC0+XG4gICAgaWYgIUFycmF5LmlzQXJyYXkoYXJyKVxuICAgICAgYXJyID0gW2Fycl1cbiAgICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoYXJyLFtQb3NDb2xsZWN0aW9uXSlcbiAgICByZXR1cm4gYXJyXG4gICAgXG4gIHdyYXA6IChwcmVmaXgsc3VmZml4KS0+XG4gICAgICByZXR1cm4gQG1hcCggKHApIC0+IG5ldyBXcmFwcGluZyhwLnN0YXJ0LCBwLmVuZCwgcHJlZml4LCBzdWZmaXgpKVxuICByZXBsYWNlOiAodHh0KS0+XG4gICAgICByZXR1cm4gQG1hcCggKHApIC0+IG5ldyBSZXBsYWNlbWVudChwLnN0YXJ0LCBwLmVuZCwgdHh0KSkiLCJpbXBvcnQge1xuICBXcmFwcGluZ1xufSBmcm9tICcuL1dyYXBwaW5nJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5cbmltcG9ydCB7XG4gIENvbW1vbkhlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5cbmV4cG9ydCB2YXIgUG9zQ29sbGVjdGlvbiA9IGNsYXNzIFBvc0NvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihhcnIpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgYXJyID0gW2Fycl07XG4gICAgfVxuICAgIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhhcnIsIFtQb3NDb2xsZWN0aW9uXSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIHdyYXAocHJlZml4LCBzdWZmaXgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIG5ldyBXcmFwcGluZyhwLnN0YXJ0LCBwLmVuZCwgcHJlZml4LCBzdWZmaXgpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVwbGFjZSh0eHQpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIG5ldyBSZXBsYWNlbWVudChwLnN0YXJ0LCBwLmVuZCwgdHh0KTtcbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuaW1wb3J0IHsgQ29tbW9uSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuaW1wb3J0IHsgT3B0aW9uT2JqZWN0IH0gZnJvbSAnLi4vT3B0aW9uT2JqZWN0JztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuZXhwb3J0IGNsYXNzIFJlcGxhY2VtZW50IGV4dGVuZHMgUG9zXG4gIENvbW1vbkhlbHBlci5hcHBseU1peGlucyh0aGlzLnByb3RvdHlwZSxbT3B0aW9uT2JqZWN0XSlcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsIEBlbmQsIEB0ZXh0LCBAb3B0aW9ucyA9IHt9KSAtPlxuICAgIHN1cGVyKClcbiAgICBAc2V0T3B0cyhAb3B0aW9ucyx7XG4gICAgICBwcmVmaXg6ICcnXG4gICAgICBzdWZmaXg6ICcnXG4gICAgICBzZWxlY3Rpb25zOiBbXVxuICAgIH0pXG4gIHJlc1Bvc0JlZm9yZVByZWZpeDogLT5cbiAgICByZXR1cm4gQHN0YXJ0K0BwcmVmaXgubGVuZ3RoK0B0ZXh0Lmxlbmd0aFxuICByZXNFbmQ6IC0+IFxuICAgIHJldHVybiBAc3RhcnQrQGZpbmFsVGV4dCgpLmxlbmd0aFxuICBhcHBseTogLT5cbiAgICBAZWRpdG9yKCkuc3BsaWNlVGV4dChAc3RhcnQsIEBlbmQsIEBmaW5hbFRleHQoKSlcbiAgbmVjZXNzYXJ5OiAtPlxuICAgIHJldHVybiBAZmluYWxUZXh0KCkgIT0gQG9yaWdpbmFsVGV4dCgpXG4gIG9yaWdpbmFsVGV4dDogLT5cbiAgICByZXR1cm4gQGVkaXRvcigpLnRleHRTdWJzdHIoQHN0YXJ0LCBAZW5kKVxuICBmaW5hbFRleHQ6IC0+XG4gICAgcmV0dXJuIEBwcmVmaXgrQHRleHQrQHN1ZmZpeFxuICBvZmZzZXRBZnRlcjogKCkgLT4gXG4gICAgcmV0dXJuIEBmaW5hbFRleHQoKS5sZW5ndGggLSAoQGVuZCAtIEBzdGFydClcbiAgYXBwbHlPZmZzZXQ6IChvZmZzZXQpLT5cbiAgICBpZiBvZmZzZXQgIT0gMFxuICAgICAgQHN0YXJ0ICs9IG9mZnNldFxuICAgICAgQGVuZCArPSBvZmZzZXRcbiAgICAgIGZvciBzZWwgaW4gQHNlbGVjdGlvbnNcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgICBzZWwuZW5kICs9IG9mZnNldFxuICAgIHJldHVybiB0aGlzXG4gIHNlbGVjdENvbnRlbnQ6IC0+IFxuICAgIEBzZWxlY3Rpb25zID0gW25ldyBQb3MoQHByZWZpeC5sZW5ndGgrQHN0YXJ0LCBAcHJlZml4Lmxlbmd0aCtAc3RhcnQrQHRleHQubGVuZ3RoKV1cbiAgICByZXR1cm4gdGhpc1xuICBjYXJyZXRUb1NlbDogLT5cbiAgICBAc2VsZWN0aW9ucyA9IFtdXG4gICAgdGV4dCA9IEBmaW5hbFRleHQoKVxuICAgIEBwcmVmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KEBwcmVmaXgpXG4gICAgQHRleHQgPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KEB0ZXh0KVxuICAgIEBzdWZmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KEBzdWZmaXgpXG4gICAgc3RhcnQgPSBAc3RhcnRcbiAgICBcbiAgICB3aGlsZSAocmVzID0gU3RyaW5nSGVscGVyLmdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHRleHQpKT9cbiAgICAgIFtwb3MsdGV4dF0gPSByZXNcbiAgICAgIEBzZWxlY3Rpb25zLnB1c2gobmV3IFBvcyhzdGFydCtwb3MsIHN0YXJ0K3BvcykpXG4gICAgICBcbiAgICByZXR1cm4gdGhpc1xuICBjb3B5OiAtPiBcbiAgICByZXMgPSBuZXcgUmVwbGFjZW1lbnQoQHN0YXJ0LCBAZW5kLCBAdGV4dCwgQGdldE9wdHMoKSlcbiAgICBpZiBAaGFzRWRpdG9yKClcbiAgICAgIHJlcy53aXRoRWRpdG9yKEBlZGl0b3IoKSlcbiAgICByZXMuc2VsZWN0aW9ucyA9IEBzZWxlY3Rpb25zLm1hcCggKHMpLT5zLmNvcHkoKSApXG4gICAgcmV0dXJuIHJlcyIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL1Bvcyc7XG5cbmltcG9ydCB7XG4gIENvbW1vbkhlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5cbmltcG9ydCB7XG4gIE9wdGlvbk9iamVjdFxufSBmcm9tICcuLi9PcHRpb25PYmplY3QnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgdmFyIFJlcGxhY2VtZW50ID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBSZXBsYWNlbWVudCBleHRlbmRzIFBvcyB7XG4gICAgY29uc3RydWN0b3Ioc3RhcnQxLCBlbmQsIHRleHQxLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQxO1xuICAgICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgICB0aGlzLnRleHQgPSB0ZXh0MTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zLCB7XG4gICAgICAgIHByZWZpeDogJycsXG4gICAgICAgIHN1ZmZpeDogJycsXG4gICAgICAgIHNlbGVjdGlvbnM6IFtdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXNQb3NCZWZvcmVQcmVmaXgoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMudGV4dC5sZW5ndGg7XG4gICAgfVxuXG4gICAgcmVzRW5kKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLmZpbmFsVGV4dCgpLmxlbmd0aDtcbiAgICB9XG5cbiAgICBhcHBseSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnNwbGljZVRleHQodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZmluYWxUZXh0KCkpO1xuICAgIH1cblxuICAgIG5lY2Vzc2FyeSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmFsVGV4dCgpICE9PSB0aGlzLm9yaWdpbmFsVGV4dCgpO1xuICAgIH1cblxuICAgIG9yaWdpbmFsVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICAgIH1cblxuICAgIGZpbmFsVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMudGV4dCArIHRoaXMuc3VmZml4O1xuICAgIH1cblxuICAgIG9mZnNldEFmdGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoIC0gKHRoaXMuZW5kIC0gdGhpcy5zdGFydCk7XG4gICAgfVxuXG4gICAgYXBwbHlPZmZzZXQob2Zmc2V0KSB7XG4gICAgICB2YXIgaSwgbGVuLCByZWYsIHNlbDtcbiAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgdGhpcy5zdGFydCArPSBvZmZzZXQ7XG4gICAgICAgIHRoaXMuZW5kICs9IG9mZnNldDtcbiAgICAgICAgcmVmID0gdGhpcy5zZWxlY3Rpb25zO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBzZWwgPSByZWZbaV07XG4gICAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgICAgICBzZWwuZW5kICs9IG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2VsZWN0Q29udGVudCgpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3RhcnQsIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3RhcnQgKyB0aGlzLnRleHQubGVuZ3RoKV07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjYXJyZXRUb1NlbCgpIHtcbiAgICAgIHZhciBwb3MsIHJlcywgc3RhcnQsIHRleHQ7XG4gICAgICB0aGlzLnNlbGVjdGlvbnMgPSBbXTtcbiAgICAgIHRleHQgPSB0aGlzLmZpbmFsVGV4dCgpO1xuICAgICAgdGhpcy5wcmVmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMucHJlZml4KTtcbiAgICAgIHRoaXMudGV4dCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy50ZXh0KTtcbiAgICAgIHRoaXMuc3VmZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnN1ZmZpeCk7XG4gICAgICBzdGFydCA9IHRoaXMuc3RhcnQ7XG4gICAgICB3aGlsZSAoKHJlcyA9IFN0cmluZ0hlbHBlci5nZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0ZXh0KSkgIT0gbnVsbCkge1xuICAgICAgICBbcG9zLCB0ZXh0XSA9IHJlcztcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25zLnB1c2gobmV3IFBvcyhzdGFydCArIHBvcywgc3RhcnQgKyBwb3MpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICB2YXIgcmVzO1xuICAgICAgcmVzID0gbmV3IFJlcGxhY2VtZW50KHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnRleHQsIHRoaXMuZ2V0T3B0cygpKTtcbiAgICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpO1xuICAgICAgfVxuICAgICAgcmVzLnNlbGVjdGlvbnMgPSB0aGlzLnNlbGVjdGlvbnMubWFwKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHMuY29weSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICB9O1xuXG4gIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhSZXBsYWNlbWVudC5wcm90b3R5cGUsIFtPcHRpb25PYmplY3RdKTtcblxuICByZXR1cm4gUmVwbGFjZW1lbnQ7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJleHBvcnQgY2xhc3MgU2l6ZVxuICBjb25zdHJ1Y3RvcjogKEB3aWR0aCxAaGVpZ2h0KSAtPiIsImV4cG9ydCBjbGFzcyBTdHJQb3NcbiAgY29uc3RydWN0b3I6IChAcG9zLEBzdHIpIC0+XG4gIGVuZDogLT5cbiAgICBAcG9zICsgQHN0ci5sZW5ndGgiLCJleHBvcnQgdmFyIFN0clBvcyA9IGNsYXNzIFN0clBvcyB7XG4gIGNvbnN0cnVjdG9yKHBvcywgc3RyKSB7XG4gICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgdGhpcy5zdHIgPSBzdHI7XG4gIH1cblxuICBlbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBXcmFwcGVkUG9zIGV4dGVuZHMgUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LEBpbm5lclN0YXJ0LEBpbm5lckVuZCxAZW5kKSAtPlxuICAgIHN1cGVyKClcbiAgaW5uZXJDb250YWluc1B0OiAocHQpIC0+XG4gICAgcmV0dXJuIEBpbm5lclN0YXJ0IDw9IHB0IGFuZCBwdCA8PSBAaW5uZXJFbmRcbiAgaW5uZXJDb250YWluc1BvczogKHBvcykgLT5cbiAgICByZXR1cm4gQGlubmVyU3RhcnQgPD0gcG9zLnN0YXJ0IGFuZCBwb3MuZW5kIDw9IEBpbm5lckVuZFxuICBpbm5lclRleHQ6IC0+XG4gICAgQGVkaXRvcigpLnRleHRTdWJzdHIoQGlubmVyU3RhcnQsIEBpbm5lckVuZClcbiAgc2V0SW5uZXJMZW46IChsZW4pIC0+XG4gICAgQG1vdmVTdWZpeChAaW5uZXJTdGFydCArIGxlbilcbiAgbW92ZVN1ZmZpeDogKHB0KSAtPlxuICAgIHN1ZmZpeExlbiA9IEBlbmQgLSBAaW5uZXJFbmRcbiAgICBAaW5uZXJFbmQgPSBwdFxuICAgIEBlbmQgPSBAaW5uZXJFbmQgKyBzdWZmaXhMZW5cbiAgY29weTogLT5cbiAgICByZXR1cm4gbmV3IFdyYXBwZWRQb3MoQHN0YXJ0LEBpbm5lclN0YXJ0LEBpbm5lckVuZCxAZW5kKSIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL1Bvcyc7XG5cbmV4cG9ydCB2YXIgV3JhcHBlZFBvcyA9IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3Mge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgaW5uZXJTdGFydCwgaW5uZXJFbmQsIGVuZCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuaW5uZXJTdGFydCA9IGlubmVyU3RhcnQ7XG4gICAgdGhpcy5pbm5lckVuZCA9IGlubmVyRW5kO1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICB9XG5cbiAgaW5uZXJDb250YWluc1B0KHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmlubmVyRW5kO1xuICB9XG5cbiAgaW5uZXJDb250YWluc1Bvcyhwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuaW5uZXJFbmQ7XG4gIH1cblxuICBpbm5lclRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLmlubmVyU3RhcnQsIHRoaXMuaW5uZXJFbmQpO1xuICB9XG5cbiAgc2V0SW5uZXJMZW4obGVuKSB7XG4gICAgcmV0dXJuIHRoaXMubW92ZVN1Zml4KHRoaXMuaW5uZXJTdGFydCArIGxlbik7XG4gIH1cblxuICBtb3ZlU3VmZml4KHB0KSB7XG4gICAgdmFyIHN1ZmZpeExlbjtcbiAgICBzdWZmaXhMZW4gPSB0aGlzLmVuZCAtIHRoaXMuaW5uZXJFbmQ7XG4gICAgdGhpcy5pbm5lckVuZCA9IHB0O1xuICAgIHJldHVybiB0aGlzLmVuZCA9IHRoaXMuaW5uZXJFbmQgKyBzdWZmaXhMZW47XG4gIH1cblxuICBjb3B5KCkge1xuICAgIHJldHVybiBuZXcgV3JhcHBlZFBvcyh0aGlzLnN0YXJ0LCB0aGlzLmlubmVyU3RhcnQsIHRoaXMuaW5uZXJFbmQsIHRoaXMuZW5kKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIFdyYXBwaW5nIGV4dGVuZHMgUmVwbGFjZW1lbnRcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsIEBlbmQsIHByZWZpeCA9JycsIHN1ZmZpeCA9ICcnLCBAb3B0aW9ucyA9IHt9KSAtPlxuICAgIHN1cGVyKClcbiAgICBAc2V0T3B0cyhAb3B0aW9ucylcbiAgICBAdGV4dCA9ICcnXG4gICAgQHByZWZpeCA9IHByZWZpeFxuICAgIEBzdWZmaXggPSBzdWZmaXhcbiAgYXBwbHk6IC0+XG4gICAgQGFkanVzdFNlbCgpXG4gICAgc3VwZXIoKVxuICBhZGp1c3RTZWw6IC0+XG4gICAgb2Zmc2V0ID0gQG9yaWdpbmFsVGV4dCgpLmxlbmd0aFxuICAgIGZvciBzZWwgaW4gQHNlbGVjdGlvbnNcbiAgICAgIGlmIHNlbC5zdGFydCA+IEBzdGFydCtAcHJlZml4Lmxlbmd0aFxuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBpZiBzZWwuZW5kID49IEBzdGFydCtAcHJlZml4Lmxlbmd0aFxuICAgICAgICBzZWwuZW5kICs9IG9mZnNldFxuICBmaW5hbFRleHQ6IC0+XG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICB0ZXh0ID0gQG9yaWdpbmFsVGV4dCgpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9ICcnXG4gICAgcmV0dXJuIEBwcmVmaXgrdGV4dCtAc3VmZml4XG4gIG9mZnNldEFmdGVyOiAoKSAtPiBcbiAgICByZXR1cm4gQHByZWZpeC5sZW5ndGgrQHN1ZmZpeC5sZW5ndGhcbiAgICAgICAgICBcbiAgY29weTogLT4gXG4gICAgcmVzID0gbmV3IFdyYXBwaW5nKEBzdGFydCwgQGVuZCwgQHByZWZpeCwgQHN1ZmZpeClcbiAgICByZXMuc2VsZWN0aW9ucyA9IEBzZWxlY3Rpb25zLm1hcCggKHMpLT5zLmNvcHkoKSApXG4gICAgcmV0dXJuIHJlcyIsImltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgdmFyIFdyYXBwaW5nID0gY2xhc3MgV3JhcHBpbmcgZXh0ZW5kcyBSZXBsYWNlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBlbmQsIHByZWZpeCA9ICcnLCBzdWZmaXggPSAnJywgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zKTtcbiAgICB0aGlzLnRleHQgPSAnJztcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeDtcbiAgICB0aGlzLnN1ZmZpeCA9IHN1ZmZpeDtcbiAgfVxuXG4gIGFwcGx5KCkge1xuICAgIHRoaXMuYWRqdXN0U2VsKCk7XG4gICAgcmV0dXJuIHN1cGVyLmFwcGx5KCk7XG4gIH1cblxuICBhZGp1c3RTZWwoKSB7XG4gICAgdmFyIGksIGxlbiwgb2Zmc2V0LCByZWYsIHJlc3VsdHMsIHNlbDtcbiAgICBvZmZzZXQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpLmxlbmd0aDtcbiAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2VsID0gcmVmW2ldO1xuICAgICAgaWYgKHNlbC5zdGFydCA+IHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGgpIHtcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgIH1cbiAgICAgIGlmIChzZWwuZW5kID49IHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHNlbC5lbmQgKz0gb2Zmc2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIGZpbmFsVGV4dCgpIHtcbiAgICB2YXIgdGV4dDtcbiAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgdGV4dCA9IHRoaXMub3JpZ2luYWxUZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSAnJztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGV4dCArIHRoaXMuc3VmZml4O1xuICB9XG5cbiAgb2Zmc2V0QWZ0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3VmZml4Lmxlbmd0aDtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBuZXcgV3JhcHBpbmcodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMucHJlZml4LCB0aGlzLnN1ZmZpeCk7XG4gICAgcmVzLnNlbGVjdGlvbnMgPSB0aGlzLnNlbGVjdGlvbnMubWFwKGZ1bmN0aW9uKHMpIHtcbiAgICAgIHJldHVybiBzLmNvcHkoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbn07XG4iLCJcbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmVcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gIHNhdmU6IChrZXksdmFsKSAtPlxuICAgIGlmIGxvY2FsU3RvcmFnZT9cbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEBmdWxsS2V5KGtleSksIEpTT04uc3RyaW5naWZ5KHZhbCkpXG4gIHNhdmVJblBhdGg6IChwYXRoLCBrZXksIHZhbCkgLT5cbiAgICBkYXRhID0gQGxvYWQocGF0aClcbiAgICB1bmxlc3MgZGF0YT9cbiAgICAgIGRhdGEgPSB7fVxuICAgIGRhdGFba2V5XSA9IHZhbFxuICAgIEBzYXZlKHBhdGgsZGF0YSlcbiAgbG9hZDogKGtleSkgLT5cbiAgICBpZiBsb2NhbFN0b3JhZ2U/XG4gICAgICBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKEBmdWxsS2V5KGtleSkpKVxuICBmdWxsS2V5OiAoa2V5KSAtPlxuICAgICdDb2RlV2F2ZV8nK2tleSIsImV4cG9ydCB2YXIgTG9jYWxTdG9yYWdlRW5naW5lID0gY2xhc3MgTG9jYWxTdG9yYWdlRW5naW5lIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHNhdmUoa2V5LCB2YWwpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmZ1bGxLZXkoa2V5KSwgSlNPTi5zdHJpbmdpZnkodmFsKSk7XG4gICAgfVxuICB9XG5cbiAgc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbCkge1xuICAgIHZhciBkYXRhO1xuICAgIGRhdGEgPSB0aGlzLmxvYWQocGF0aCk7XG4gICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgZGF0YSA9IHt9O1xuICAgIH1cbiAgICBkYXRhW2tleV0gPSB2YWw7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZShwYXRoLCBkYXRhKTtcbiAgfVxuXG4gIGxvYWQoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmZ1bGxLZXkoa2V5KSkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bGxLZXkoa2V5KSB7XG4gICAgcmV0dXJuICdDb2RlV2F2ZV8nICsga2V5O1xuICB9XG5cbn07XG4iXX0=
