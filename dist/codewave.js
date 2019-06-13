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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvQm94SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9Cb3hIZWxwZXIuanMiLCIuLi9zcmMvQ2xvc2luZ1Byb21wLmNvZmZlZSIsIi4uL3NyYy9DbG9zaW5nUHJvbXAuanMiLCIuLi9zcmMvQ21kRmluZGVyLmNvZmZlZSIsIi4uL3NyYy9DbWRGaW5kZXIuanMiLCIuLi9zcmMvQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL0NtZEluc3RhbmNlLmpzIiwiLi4vc3JjL0NvZGV3YXZlLmNvZmZlZSIsIi4uL3NyYy9Db2Rld2F2ZS5qcyIsIi4uL3NyYy9Db21tYW5kLmNvZmZlZSIsIi4uL3NyYy9Db21tYW5kLmpzIiwiLi4vc3JjL0NvbnRleHQuY29mZmVlIiwiLi4vc3JjL0NvbnRleHQuanMiLCIuLi9zcmMvRGV0ZWN0b3IuY29mZmVlIiwiLi4vc3JjL0RldGVjdG9yLmpzIiwiLi4vc3JjL0VkaXRDbWRQcm9wLmNvZmZlZSIsIi4uL3NyYy9FZGl0Q21kUHJvcC5qcyIsIi4uL3NyYy9FZGl0b3IuY29mZmVlIiwiLi4vc3JjL0VkaXRvci5qcyIsIi4uL3NyYy9Mb2dnZXIuY29mZmVlIiwiLi4vc3JjL0xvZ2dlci5qcyIsIi4uL3NyYy9PcHRpb25PYmplY3QuY29mZmVlIiwiLi4vc3JjL09wdGlvbk9iamVjdC5qcyIsIi4uL3NyYy9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsIi4uL3NyYy9Qcm9jZXNzLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmpzIiwiLi4vc3JjL1RleHRBcmVhRWRpdG9yLmNvZmZlZSIsIi4uL3NyYy9UZXh0QXJlYUVkaXRvci5qcyIsIi4uL3NyYy9UZXh0UGFyc2VyLmNvZmZlZSIsIi4uL3NyYy9UZXh0UGFyc2VyLmpzIiwiLi4vc3JjL2Jvb3RzdHJhcC5jb2ZmZWUiLCIuLi9zcmMvYm9vdHN0cmFwLmpzIiwiLi4vc3JjL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9QaHBDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2VudHJ5LmNvZmZlZSIsIi4uL3NyYy9lbnRyeS5qcyIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvQ29tbW9uSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0NvbW1vbkhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL05hbWVzcGFjZUhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCIuLi9zcmMvaGVscGVycy9PcHRpb25hbFByb21pc2UuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlLmpzIiwiLi4vc3JjL2hlbHBlcnMvUGF0aEhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9QYXRoSGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvU3RyaW5nSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL1N0cmluZ0hlbHBlci5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1BhaXJNYXRjaC5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1NpemUuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1N0clBvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvV3JhcHBpbmcuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwaW5nLmpzIiwiLi4vc3JjL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZS5jb2ZmZWUiLCIuLi9zcmMvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSx1QkFBQSxDQUFBOztBQUNBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxvQkFBQSxDQUFBOztBQUVBLElBQWEsU0FBTjtBQUFBO0FBQUE7QUFDTCxxQkFBYSxPQUFiLEVBQWE7QUFBQSxRQUFXLE9BQVgsdUVBQUEsRUFBQTs7QUFBQTs7QUFDWCxRQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQURZLFNBQUEsT0FBQSxHQUFBLE9BQUE7QUFDWixTQUFBLFFBQUEsR0FBWTtBQUNWLE1BQUEsSUFBQSxFQUFNLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FESSxJQUFBO0FBRVYsTUFBQSxHQUFBLEVBRlUsQ0FBQTtBQUdWLE1BQUEsS0FBQSxFQUhVLEVBQUE7QUFJVixNQUFBLE1BQUEsRUFKVSxDQUFBO0FBS1YsTUFBQSxRQUFBLEVBTFUsRUFBQTtBQU1WLE1BQUEsU0FBQSxFQU5VLEVBQUE7QUFPVixNQUFBLE1BQUEsRUFQVSxFQUFBO0FBUVYsTUFBQSxNQUFBLEVBUlUsRUFBQTtBQVNWLE1BQUEsTUFBQSxFQUFRO0FBVEUsS0FBWjtBQVdBLElBQUEsR0FBQSxHQUFBLEtBQUEsUUFBQTs7QUFBQSxTQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUE7QUNZRSxNQUFBLEdBQUcsR0FBRyxHQUFHLENBQVQsR0FBUyxDQUFUOztBRFhBLFVBQUcsR0FBQSxJQUFILE9BQUEsRUFBQTtBQUNFLGFBQUEsR0FBQSxJQUFZLE9BQVEsQ0FBcEIsR0FBb0IsQ0FBcEI7QUFERixPQUFBLE1BQUE7QUFHRSxhQUFBLEdBQUEsSUFBQSxHQUFBO0FDYUQ7QURqQkg7QUFaVzs7QUFEUjtBQUFBO0FBQUEsMEJBa0JFLElBbEJGLEVBa0JFO0FBQ0wsVUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQUEsRUFBQTtBQUNBLE1BQUEsR0FBQSxHQUFBLEtBQUEsUUFBQTs7QUFBQSxXQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUE7QUNtQkUsUUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFULEdBQVMsQ0FBVDtBRGxCQSxRQUFBLEdBQUksQ0FBSixHQUFJLENBQUosR0FBVyxLQUFYLEdBQVcsQ0FBWDtBQURGOztBQUVBLGFBQU8sSUFBQSxTQUFBLENBQWMsS0FBZCxPQUFBLEVBQVAsR0FBTyxDQUFQO0FBSks7QUFsQkY7QUFBQTtBQUFBLHlCQXVCQyxJQXZCRCxFQXVCQztBQUNKLGFBQU8sS0FBQSxRQUFBLEtBQUEsSUFBQSxHQUFxQixLQUFBLEtBQUEsQ0FBckIsSUFBcUIsQ0FBckIsR0FBQSxJQUFBLEdBQTBDLEtBQWpELE1BQWlELEVBQWpEO0FBREk7QUF2QkQ7QUFBQTtBQUFBLGdDQXlCUSxHQXpCUixFQXlCUTtBQUNYLGFBQU8sS0FBQSxPQUFBLENBQUEsV0FBQSxDQUFQLEdBQU8sQ0FBUDtBQURXO0FBekJSO0FBQUE7QUFBQSxnQ0EyQk07QUFDVCxVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxLQUFBLEtBQUEsR0FBUyxJQUFJLEtBQWIsR0FBQSxHQUFvQixJQUFJLEtBQUEsSUFBQSxDQUE5QixNQUFBO0FBQ0EsYUFBTyxLQUFBLFdBQUEsQ0FBYSxLQUFBLFFBQUEsQ0FBcEIsR0FBb0IsQ0FBYixDQUFQO0FBRlM7QUEzQk47QUFBQTtBQUFBLCtCQThCSztBQUNSLFVBQUEsRUFBQTtBQUFBLE1BQUEsRUFBQSxHQUFLLEtBQUEsS0FBQSxHQUFTLElBQUksS0FBYixHQUFBLEdBQW9CLElBQUksS0FBQSxJQUFBLENBQXhCLE1BQUEsR0FBdUMsS0FBQSxRQUFBLENBQTVDLE1BQUE7QUFDQSxhQUFPLEtBQUEsTUFBQSxHQUFVLEtBQUEsV0FBQSxDQUFhLEtBQUEsUUFBQSxHQUFVLEtBQUEsUUFBQSxDQUF4QyxFQUF3QyxDQUF2QixDQUFqQjtBQUZRO0FBOUJMO0FBQUE7QUFBQSw2QkFpQ0c7QUFDTixVQUFBLEVBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxLQUFBLEtBQUEsR0FBUyxJQUFJLEtBQWIsR0FBQSxHQUFvQixJQUFJLEtBQUEsSUFBQSxDQUF4QixNQUFBLEdBQXVDLEtBQUEsU0FBQSxDQUE1QyxNQUFBO0FBQ0EsYUFBTyxLQUFBLFdBQUEsQ0FBYSxLQUFBLFNBQUEsR0FBVyxLQUFBLFFBQUEsQ0FBeEIsRUFBd0IsQ0FBeEIsSUFBeUMsS0FBaEQsTUFBQTtBQUZNO0FBakNIO0FBQUE7QUFBQSw2QkFvQ0ssR0FwQ0wsRUFvQ0s7QUFDUixhQUFPLGFBQUEsQ0FBQSxZQUFBLENBQUEsY0FBQSxDQUE0QixLQUE1QixJQUFBLEVBQVAsR0FBTyxDQUFQO0FBRFE7QUFwQ0w7QUFBQTtBQUFBLDhCQXNDSTtBQUNQLGFBQU8sYUFBQSxDQUFBLFlBQUEsQ0FBQSxjQUFBLENBQUEsR0FBQSxFQUFpQyxLQUF4QyxHQUFPLENBQVA7QUFETztBQXRDSjtBQUFBO0FBQUEsNEJBd0NFO0FBQUEsVUFBQyxJQUFELHVFQUFBLEVBQUE7QUFBQSxVQUFZLFVBQVosdUVBQUEsSUFBQTtBQUNMLFVBQUEsQ0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBQSxJQUFQLEVBQUE7QUFDQSxNQUFBLEtBQUEsR0FBUSxJQUFJLENBQUosT0FBQSxDQUFBLEtBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxDQUFSLElBQVEsQ0FBUjs7QUFDQSxVQUFBLFVBQUEsRUFBQTtBQUNFLGVBQU8sWUFBQTtBQ3lDTCxjQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQTtBRHpDNEIsVUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxlQUFTLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxLQUFULE1BQUEsRUFBUyxLQUFBLEdBQUEsR0FBQSxDQUFBLElBQUEsR0FBQSxHQUFBLENBQUEsSUFBVCxHQUFBLEVBQVMsQ0FBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQVQsQ0FBQSxFQUFBO0FDNEMxQixZQUFBLE9BQU8sQ0FBUCxJQUFBLENENUNJLEtBQUEsSUFBQSxDQUFNLEtBQU0sQ0FBTixDQUFNLENBQU4sSUFBTixFQUFBLENDNENKO0FENUMwQjs7QUM4QzVCLGlCQUFBLE9BQUE7QUQ5Q0ssU0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQUFQLElBQU8sQ0FBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sWUFBQTtBQ2dETCxjQUFBLENBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTtBRGhEZSxVQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDbURiLFlBQUEsQ0FBQyxHQUFHLEtBQUssQ0FBVCxDQUFTLENBQVQ7QUFDQSxZQUFBLE9BQU8sQ0FBUCxJQUFBLENEcERJLEtBQUEsSUFBQSxDQUFBLENBQUEsQ0NvREo7QURwRGE7O0FDc0RmLGlCQUFBLE9BQUE7QUR0REssU0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQUFQLElBQU8sQ0FBUDtBQ3dERDtBRDlESTtBQXhDRjtBQUFBO0FBQUEsMkJBK0NDO0FBQUEsVUFBQyxJQUFELHVFQUFBLEVBQUE7QUFDSixhQUFRLGFBQUEsQ0FBQSxZQUFBLENBQUEsY0FBQSxDQUFBLEdBQUEsRUFBZ0MsS0FBaEMsTUFBQSxJQUNOLEtBQUEsV0FBQSxDQUNFLEtBQUEsSUFBQSxHQUNBLEtBREEsT0FDQSxFQURBLEdBQUEsSUFBQSxHQUdBLGFBQUEsQ0FBQSxZQUFBLENBQUEsY0FBQSxDQUFBLEdBQUEsRUFBaUMsS0FBQSxLQUFBLEdBQVMsS0FBQSxvQkFBQSxDQUFBLElBQUEsRUFIMUMsTUFHQSxDQUhBLEdBSUEsS0FKQSxPQUlBLEVBSkEsR0FLQSxLQVBKLElBQ0UsQ0FERjtBQURJO0FBL0NEO0FBQUE7QUFBQSwyQkF5REM7QUNxREosYURwREEsS0FBQSxPQUFBLENBQUEsZUFBQSxDQUF5QixLQUFBLElBQUEsR0FBUSxLQUFqQyxPQUFpQyxFQUFqQyxDQ29EQTtBRHJESTtBQXpERDtBQUFBO0FBQUEsNEJBMkRFO0FDdURMLGFEdERBLEtBQUEsT0FBQSxDQUFBLGdCQUFBLENBQTBCLEtBQUEsT0FBQSxLQUFhLEtBQXZDLElBQUEsQ0NzREE7QUR2REs7QUEzREY7QUFBQTtBQUFBLHlDQTZEaUIsSUE3RGpCLEVBNkRpQjtBQUNwQixhQUFPLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxhQUFBLENBQWdDLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxZQUFBLENBQXZDLElBQXVDLENBQWhDLENBQVA7QUFEb0I7QUE3RGpCO0FBQUE7QUFBQSwrQkErRE8sSUEvRFAsRUErRE87QUFDVixhQUFPLGFBQUEsQ0FBQSxZQUFBLENBQUEsVUFBQSxDQUF3QixLQUFBLG9CQUFBLENBQS9CLElBQStCLENBQXhCLENBQVA7QUFEVTtBQS9EUDtBQUFBO0FBQUEsaUNBaUVTLEdBakVULEVBaUVTO0FBQUE7O0FBQ1osVUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsR0FBQSxFQUFBLFNBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxLQUFBLFlBQUEsQ0FBYyxHQUFHLENBQXpCLEtBQVEsQ0FBUjs7QUFDQSxVQUFHLEtBQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxLQUFQLElBQU8sRUFBUDtBQUNBLFFBQUEsT0FBQSxHQUFVLGFBQUEsQ0FBQSxZQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsRUFBeUIsS0FBQSxHQUFuQyxDQUFVLENBQVY7QUFFQSxRQUFBLEtBQUEsR0FBUSxLQUFSLEtBQVEsRUFBUjtBQUNBLFFBQUEsV0FBQSxHQUFBLG1CQUFBO0FBQ0EsUUFBQSxLQUFLLENBQUwsS0FBQSxHQUFjLFdBQVcsQ0FBekIsTUFBQTtBQUNBLFFBQUEsS0FBSyxDQUFMLFFBQUEsR0FBaUIsS0FBSyxDQUFMLFNBQUEsR0FBa0IsS0FBQSxJQUFBLEdBQVEsS0FBUixJQUFBLEdBQUEsV0FBQSxHQUE4QixLQUE5QixJQUFBLEdBQXNDLEtBQXpFLElBQUE7QUFFQSxRQUFBLFNBQUEsR0FBWSxNQUFBLENBQU8sYUFBQSxDQUFBLFlBQUEsQ0FBQSxZQUFBLENBQTBCLE9BQUEsR0FBVSxLQUFLLENBQXpDLFFBQW9DLEVBQXBDLEVBQUEsT0FBQSxDQUFBLFdBQUEsRUFBbkIsSUFBbUIsQ0FBUCxDQUFaO0FBQ0EsUUFBQSxPQUFBLEdBQVUsTUFBQSxDQUFPLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixPQUFBLEdBQVUsS0FBSyxDQUF6QyxNQUFvQyxFQUFwQyxFQUFBLE9BQUEsQ0FBQSxXQUFBLEVBQWpCLElBQWlCLENBQVAsQ0FBVjtBQUVBLFFBQUEsSUFBQSxHQUFPLElBQUksS0FBQSxDQUFKLElBQUEsQ0FBQSxTQUFBLEVBQUEsT0FBQSxFQUEyQjtBQUNoQyxVQUFBLFVBQUEsRUFBYSxvQkFBQSxLQUFELEVBQUE7QUFFVixnQkFGVSxDQUVWLENBRlUsQ0M0RFY7O0FEMURBLFlBQUEsQ0FBQSxHQUFJLEtBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBOEIsS0FBSyxDQUFuQyxLQUE4QixFQUE5QixFQUE2QyxDQUFBLElBQUEsRUFBQSxJQUFBLEVBQTdDLElBQTZDLENBQTdDLEVBQThELENBQWxFLENBQUksQ0FBSjtBQUNBLG1CQUFRLENBQUEsSUFBQSxJQUFBLElBQU0sQ0FBQyxDQUFELEdBQUEsS0FBZCxJQUFBO0FBSFU7QUFEb0IsU0FBM0IsQ0FBUDtBQU1BLFFBQUEsR0FBQSxHQUFNLElBQUksQ0FBSixVQUFBLENBQUEsR0FBQSxFQUFvQixLQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxDQUExQixJQUEwQixFQUFwQixDQUFOOztBQUNBLFlBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsR0FBRyxDQUFILEtBQUEsSUFBYSxPQUFPLENBQXBCLE1BQUE7QUFDQSxpQkFBQSxHQUFBO0FBckJKO0FDbUZDO0FEckZXO0FBakVUO0FBQUE7QUFBQSxpQ0EwRlMsS0ExRlQsRUEwRlM7QUFDWixVQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQTtBQUFBLE1BQUEsS0FBQSxHQUFBLENBQUE7QUFDQSxNQUFBLElBQUEsR0FBTyxLQUFQLElBQU8sRUFBUDs7QUFDQSxhQUFNLENBQUEsQ0FBQSxHQUFBLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsS0FBQSxFQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLElBQUEsSUFBb0UsQ0FBQyxDQUFELEdBQUEsS0FBMUUsSUFBQSxFQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsQ0FBQyxDQUFULEdBQUE7QUFDQSxRQUFBLEtBQUE7QUFGRjs7QUFHQSxhQUFBLEtBQUE7QUFOWTtBQTFGVDtBQUFBO0FBQUEsbUNBaUdXLElBakdYLEVBaUdXO0FBQUEsVUFBTSxNQUFOLHVFQUFBLElBQUE7QUFDZCxVQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsUUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUEsTUFBQSxDQUFXLFlBQVUsYUFBQSxDQUFBLFlBQUEsQ0FBQSxZQUFBLENBQTBCLEtBQUEsT0FBQSxDQUFBLGVBQUEsQ0FBeUIsS0FBN0QsSUFBb0MsQ0FBMUIsQ0FBVixHQUFwQixTQUFTLENBQVQ7QUFDQSxNQUFBLElBQUEsR0FBTyxJQUFBLE1BQUEsQ0FBVyxZQUFVLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixLQUFBLE9BQUEsQ0FBQSxnQkFBQSxDQUEwQixLQUE5RCxJQUFvQyxDQUExQixDQUFWLEdBQWxCLFNBQU8sQ0FBUDtBQUNBLE1BQUEsUUFBQSxHQUFXLE1BQU0sQ0FBTixJQUFBLENBQVgsSUFBVyxDQUFYO0FBQ0EsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFKLElBQUEsQ0FBVCxJQUFTLENBQVQ7O0FBQ0EsVUFBRyxRQUFBLElBQUEsSUFBQSxJQUFjLE1BQUEsSUFBakIsSUFBQSxFQUFBO0FBQ0UsWUFBQSxNQUFBLEVBQUE7QUFDRSxlQUFBLEdBQUEsR0FBTyxJQUFJLENBQUosR0FBQSxDQUFTLFFBQVMsQ0FBVCxDQUFTLENBQVQsQ0FBVCxNQUFBLEVBQTRCLE1BQU8sQ0FBUCxDQUFPLENBQVAsQ0FBbkMsTUFBTyxDQUFQO0FDcUVEOztBRHBFRCxhQUFBLE1BQUEsR0FBVSxRQUFTLENBQVQsQ0FBUyxDQUFULENBQVYsTUFBQTtBQUNBLFFBQUEsUUFBQSxHQUFXLFFBQVEsQ0FBUixLQUFBLEdBQWlCLFFBQVMsQ0FBVCxDQUFTLENBQVQsQ0FBakIsTUFBQSxHQUFzQyxRQUFTLENBQVQsQ0FBUyxDQUFULENBQXRDLE1BQUEsR0FBMkQsS0FBdEUsR0FBQTtBQUNBLFFBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBTixLQUFBLEdBQWUsTUFBTyxDQUFQLENBQU8sQ0FBUCxDQUFmLE1BQUEsR0FBa0MsS0FBM0MsR0FBQTtBQUNBLGFBQUEsS0FBQSxHQUFTLE1BQUEsR0FBVCxRQUFBO0FDc0VEOztBRHJFRCxhQUFBLElBQUE7QUFaYztBQWpHWDtBQUFBO0FBQUEsa0NBOEdVLElBOUdWLEVBOEdVO0FBQUEsVUFBTSxPQUFOLHVFQUFBLEVBQUE7QUFDYixhQUFPLEtBQUEsS0FBQSxDQUFPLEtBQUEsYUFBQSxDQUFBLElBQUEsRUFBUCxPQUFPLENBQVAsRUFBUCxLQUFPLENBQVA7QUFEYTtBQTlHVjtBQUFBO0FBQUEsa0NBZ0hVLElBaEhWLEVBZ0hVO0FBQUEsVUFBTSxPQUFOLHVFQUFBLEVBQUE7QUFDYixVQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBOztBQUFBLFVBQUcsSUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsUUFBQSxHQUFXO0FBQ1QsVUFBQSxTQUFBLEVBQVc7QUFERixTQUFYO0FBR0EsUUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFOLE1BQUEsQ0FBQSxFQUFBLEVBQUEsUUFBQSxFQUFOLE9BQU0sQ0FBTjtBQUNBLFFBQUEsR0FBQSxHQUFNLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixLQUFBLE9BQUEsQ0FBaEMsZUFBZ0MsRUFBMUIsQ0FBTjtBQUNBLFFBQUEsR0FBQSxHQUFNLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixLQUFBLE9BQUEsQ0FBaEMsZ0JBQWdDLEVBQTFCLENBQU47QUFDQSxRQUFBLEVBQUEsR0FBSyxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBMEIsS0FBL0IsSUFBSyxDQUFMO0FBQ0EsUUFBQSxJQUFBLEdBQVUsT0FBUSxDQUFSLFdBQVEsQ0FBUixHQUFBLElBQUEsR0FBVixFQUFBO0FBQ0EsUUFBQSxHQUFBLEdBQU0sSUFBQSxNQUFBLGdCQUFtQixHQUFuQixnQkFBNEIsRUFBNUIscUJBQXlDLEtBQXpDLEdBQUEsUUFBTixJQUFNLENBQU47QUFDQSxRQUFBLEdBQUEsR0FBTSxJQUFBLE1BQUEsa0JBQXFCLEVBQXJCLGVBQUEsR0FBQSxZQUFOLElBQU0sQ0FBTjtBQUNBLGVBQU8sSUFBSSxDQUFKLE9BQUEsQ0FBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQVAsRUFBTyxDQUFQO0FDNEVEO0FEeEZZO0FBaEhWOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFSkEsSUFBQSxjQUFBLEdBQUEsT0FBQSxDQUFBLDZCQUFBLENBQUE7O0FBQ0EsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLDJCQUFBLENBQUE7O0FBQ0EsSUFBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUE7O0FBQ0EsSUFBQSxnQkFBQSxHQUFBLE9BQUEsQ0FBQSwyQkFBQSxDQUFBOztBQUVBLElBQWEsWUFBTjtBQUFBO0FBQUE7QUFDTCx3QkFBYSxTQUFiLEVBQWEsVUFBYixFQUFhO0FBQUE7O0FBQUMsU0FBQSxRQUFBLEdBQUEsU0FBQTtBQUNaLFNBQUEsT0FBQSxHQUFBLElBQUE7QUFDQSxTQUFBLE1BQUEsR0FBQSxJQUFBO0FBQ0EsU0FBQSxPQUFBLEdBQUEsS0FBQTtBQUNBLFNBQUEsU0FBQSxHQUFBLENBQUE7QUFDQSxTQUFBLFVBQUEsR0FBYyxJQUFJLGNBQUEsQ0FBSixhQUFBLENBQWQsVUFBYyxDQUFkO0FBTFc7O0FBRFI7QUFBQTtBQUFBLDRCQU9FO0FBQUE7O0FBQ0wsV0FBQSxPQUFBLEdBQUEsSUFBQTtBQ2VBLGFEZEEsQ0FBQSxHQUFBLGdCQUFBLENBQUEsZUFBQSxFQUFnQixLQUFoQixVQUFnQixFQUFoQixFQUFBLElBQUEsQ0FBb0MsWUFBQTtBQUNsQyxZQUFHLEtBQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxDQUFILGlCQUFHLEVBQUgsRUFBQTtBQUNFLFVBQUEsS0FBQSxDQUFBLGFBQUEsR0FBaUIsWUFBQTtBQUFBLGdCQUFDLEVBQUQsdUVBQUEsSUFBQTtBQ2VmLG1CRGYyQixLQUFBLENBQUEsUUFBQSxDQUFBLEVBQUEsQ0NlM0I7QURmRixXQUFBOztBQUNBLFVBQUEsS0FBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsaUJBQUEsQ0FBb0MsS0FBQSxDQUFwQyxhQUFBO0FDaUJEOztBRGhCRCxlQUFBLEtBQUE7QUFKRixPQUFBLEVBQUEsTUFBQSxFQ2NBO0FEaEJLO0FBUEY7QUFBQTtBQUFBLGlDQWVPO0FBQ1YsV0FBQSxZQUFBLEdBQWdCLEtBQUEsVUFBQSxDQUFBLElBQUEsQ0FDZCxLQUFBLFFBQUEsQ0FBQSxPQUFBLEdBQW9CLEtBQUEsUUFBQSxDQUFwQixVQUFBLEdBQTJDLEtBQUEsUUFBQSxDQUEzQyxPQUFBLEdBRGMsSUFBQSxFQUVkLE9BQU8sS0FBQSxRQUFBLENBQVAsT0FBQSxHQUEyQixLQUFBLFFBQUEsQ0FBM0IsU0FBQSxHQUFpRCxLQUFBLFFBQUEsQ0FBakQsVUFBQSxHQUF3RSxLQUFBLFFBQUEsQ0FGMUQsT0FBQSxFQUFBLEdBQUEsQ0FHVCxVQUFBLENBQUEsRUFBQTtBQ2lCTCxlRGpCWSxDQUFDLENBQUQsV0FBQSxFQ2lCWjtBRHBCRixPQUFnQixDQUFoQjtBQ3NCQSxhRGxCQSxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsaUJBQUEsQ0FBbUMsS0FBbkMsWUFBQSxDQ2tCQTtBRHZCVTtBQWZQO0FBQUE7QUFBQSxtQ0FxQlM7QUNxQlosYURwQkEsS0FBQSxNQUFBLEdBQVUsSUNvQlY7QURyQlk7QUFyQlQ7QUFBQTtBQUFBLCtCQXVCSztBQUFBLFVBQUMsRUFBRCx1RUFBQSxJQUFBO0FBQ1IsV0FBQSxZQUFBOztBQUNBLFVBQUcsS0FBQSxTQUFBLENBQUgsRUFBRyxDQUFILEVBQUE7QUFDRTtBQ3VCRDs7QUR0QkQsV0FBQSxTQUFBOztBQUNBLFVBQUcsS0FBSCxVQUFHLEVBQUgsRUFBQTtBQUNFLGFBQUEsSUFBQTtBQ3dCQSxlRHZCQSxLQUFBLFVBQUEsRUN1QkE7QUR6QkYsT0FBQSxNQUFBO0FDMkJFLGVEdkJBLEtBQUEsTUFBQSxFQ3VCQTtBQUNEO0FEakNPO0FBdkJMO0FBQUE7QUFBQSw4QkFrQ00sRUFsQ04sRUFrQ007QUFDVCxhQUFPLEVBQUEsSUFBQSxJQUFBLElBQVEsRUFBRSxDQUFGLFVBQUEsQ0FBQSxDQUFBLE1BQWYsRUFBQTtBQURTO0FBbENOO0FBQUE7QUFBQSw2QkFxQ0csQ0FBQTtBQXJDSDtBQUFBO0FBQUEsaUNBd0NPO0FBQ1YsYUFBTyxLQUFBLEtBQUEsT0FBQSxLQUFBLElBQXFCLEtBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQXlCLENBQXJELENBQUE7QUFEVTtBQXhDUDtBQUFBO0FBQUEsaUNBMkNPO0FBQ1YsVUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLFlBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLFVBQUEsRUFBQSxLQUFBO0FBQUEsTUFBQSxZQUFBLEdBQUEsRUFBQTtBQUNBLE1BQUEsVUFBQSxHQUFhLEtBQWIsYUFBYSxFQUFiOztBQUNBLFdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsVUFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDNkJFLFFBQUEsR0FBRyxHQUFHLFVBQVUsQ0FBaEIsQ0FBZ0IsQ0FBaEI7O0FENUJBLFlBQUcsR0FBQSxHQUFNLEtBQUEsaUJBQUEsQ0FBVCxHQUFTLENBQVQsRUFBQTtBQUNFLFVBQUEsS0FBQSxHQUFBLEdBQUE7QUFERixTQUFBLE1BRUssSUFBRyxDQUFDLEdBQUEsR0FBTSxLQUFBLGtCQUFBLENBQVAsR0FBTyxDQUFQLEtBQXFDLEtBQUEsSUFBeEMsSUFBQSxFQUFBO0FBQ0gsVUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFILFVBQUEsQ0FBZSxLQUFBLFFBQUEsQ0FBZixNQUFBLEVBQUEsU0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQU4sQ0FBTSxDQUFOO0FBQ0EsVUFBQSxJQUFBLEdBQU8sSUFBSSxZQUFBLENBQUosV0FBQSxDQUFnQixHQUFHLENBQW5CLFVBQUEsRUFBK0IsR0FBRyxDQUFsQyxRQUFBLEVBQVAsR0FBTyxDQUFQO0FBQ0EsVUFBQSxJQUFJLENBQUosVUFBQSxHQUFrQixDQUFsQixLQUFrQixDQUFsQjtBQUNBLFVBQUEsWUFBWSxDQUFaLElBQUEsQ0FBQSxJQUFBO0FBQ0EsVUFBQSxLQUFBLEdBQUEsSUFBQTtBQzhCRDtBRHRDSDs7QUN3Q0EsYUQvQkEsS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLGlCQUFBLENBQUEsWUFBQSxDQytCQTtBRDNDVTtBQTNDUDtBQUFBO0FBQUEsb0NBd0RVO0FBQ2IsYUFBTyxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQVAsV0FBTyxFQUFQO0FBRGE7QUF4RFY7QUFBQTtBQUFBLDJCQTBEQztBQUNKLFdBQUEsT0FBQSxHQUFBLEtBQUE7O0FBQ0EsVUFBMEIsS0FBQSxPQUFBLElBQTFCLElBQUEsRUFBQTtBQUFBLFFBQUEsWUFBQSxDQUFhLEtBQWIsT0FBQSxDQUFBO0FDcUNDOztBRHBDRCxVQUFpQyxLQUFBLFFBQUEsQ0FBQSxZQUFBLEtBQWpDLElBQUEsRUFBQTtBQUFBLGFBQUEsUUFBQSxDQUFBLFlBQUEsR0FBQSxJQUFBO0FDdUNDOztBRHRDRCxVQUFHLEtBQUEsYUFBQSxJQUFILElBQUEsRUFBQTtBQ3dDRSxlRHZDQSxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsb0JBQUEsQ0FBc0MsS0FBdEMsYUFBQSxDQ3VDQTtBQUNEO0FEN0NHO0FBMUREO0FBQUE7QUFBQSw2QkFnRUc7QUFDTixVQUFHLEtBQUEsS0FBQSxPQUFILEtBQUEsRUFBQTtBQUNFLGFBQUEsZ0JBQUEsQ0FBa0IsS0FBbEIsYUFBa0IsRUFBbEI7QUMyQ0Q7O0FBQ0QsYUQzQ0EsS0FBQSxJQUFBLEVDMkNBO0FEOUNNO0FBaEVIO0FBQUE7QUFBQSxxQ0FvRWEsVUFwRWIsRUFvRWE7QUFDaEIsVUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsWUFBQSxFQUFBLEdBQUEsRUFBQSxLQUFBO0FBQUEsTUFBQSxZQUFBLEdBQUEsRUFBQTtBQUNBLE1BQUEsS0FBQSxHQUFBLElBQUE7O0FBQ0EsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxVQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUMrQ0UsUUFBQSxHQUFHLEdBQUcsVUFBVSxDQUFoQixDQUFnQixDQUFoQjs7QUQ5Q0EsWUFBRyxHQUFBLEdBQU0sS0FBQSxpQkFBQSxDQUFULEdBQVMsQ0FBVCxFQUFBO0FBQ0UsVUFBQSxLQUFBLEdBQUEsR0FBQTtBQURGLFNBQUEsTUFFSyxJQUFHLENBQUMsR0FBQSxHQUFNLEtBQUEsa0JBQUEsQ0FBUCxHQUFPLENBQVAsS0FBcUMsS0FBQSxJQUF4QyxJQUFBLEVBQUE7QUFDSCxVQUFBLFlBQVksQ0FBWixJQUFBLENBQWtCLElBQUksWUFBQSxDQUFKLFdBQUEsQ0FBZ0IsS0FBSyxDQUFyQixLQUFBLEVBQTRCLEdBQUcsQ0FBL0IsR0FBQSxFQUFvQyxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUE0QixLQUFLLENBQUwsR0FBQSxHQUE1QixDQUFBLEVBQXlDLEdBQUcsQ0FBSCxLQUFBLEdBQTdFLENBQW9DLENBQXBDLEVBQWxCLGFBQWtCLEVBQWxCO0FBQ0EsVUFBQSxLQUFBLEdBQUEsSUFBQTtBQ2dERDtBRHJESDs7QUN1REEsYURqREEsS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLGlCQUFBLENBQUEsWUFBQSxDQ2lEQTtBRDFEZ0I7QUFwRWI7QUFBQTtBQUFBLDRCQThFRTtBQUNMLFVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxVQUFBOztBQUFBLFVBQU8sS0FBQSxNQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFQLFlBQU8sRUFBUDtBQUNBLFFBQUEsVUFBQSxHQUFhLEtBQUEsWUFBQSxDQUFBLENBQUEsRUFBQSxLQUFBLEdBQXlCLEtBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBdEMsTUFBQTs7QUFDQSxZQUFHLEtBQUEsUUFBQSxDQUFBLGNBQUEsQ0FBeUIsSUFBSSxDQUE3QixLQUFBLE1BQXdDLEtBQUEsWUFBQSxDQUFBLENBQUEsRUFBeEMsS0FBQSxJQUFtRSxDQUFBLFFBQUEsR0FBQSxLQUFBLFFBQUEsQ0FBQSxjQUFBLENBQUEsVUFBQSxDQUFBLEtBQW5FLElBQUEsSUFBMEgsUUFBQSxJQUFZLElBQUksQ0FBN0ksR0FBQSxFQUFBO0FBQ0UsZUFBQSxNQUFBLEdBQVUsS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSxVQUFBLEVBQVYsUUFBVSxDQUFWO0FBREYsU0FBQSxNQUFBO0FBR0UsZUFBQSxNQUFBLEdBQUEsS0FBQTtBQU5KO0FDNERDOztBRHJERCxhQUFPLEtBQVAsTUFBQTtBQVJLO0FBOUVGO0FBQUE7QUFBQSxzQ0F1RmMsR0F2RmQsRUF1RmM7QUFDakIsVUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxVQUFBO0FBQUEsTUFBQSxHQUFBLEdBQUEsS0FBQSxZQUFBOztBQUFBLFdBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUMyREUsUUFBQSxJQUFJLEdBQUcsR0FBRyxDQUFWLENBQVUsQ0FBVjtBRDFEQSxRQUFBLFNBQUEsR0FBWSxLQUFBLFVBQUEsQ0FBWixDQUFZLENBQVo7QUFDQSxRQUFBLFVBQUEsR0FBYSxLQUFBLFFBQUEsQ0FBQSxPQUFBLEdBQW9CLEtBQXBCLEtBQW9CLEVBQXBCLEdBQStCLEtBQUEsUUFBQSxDQUE1QyxPQUFBOztBQUNBLFlBQUcsU0FBUyxDQUFULGdCQUFBLENBQUEsR0FBQSxLQUFtQyxTQUFTLENBQVQsVUFBQSxDQUFxQixLQUFBLFFBQUEsQ0FBckIsTUFBQSxFQUFBLElBQUEsT0FBdEMsVUFBQSxFQUFBO0FBQ0UsaUJBQUEsU0FBQTtBQzRERDtBRGhFSDs7QUFLQSxhQUFBLEtBQUE7QUFOaUI7QUF2RmQ7QUFBQTtBQUFBLHVDQThGZSxHQTlGZixFQThGZTtBQUNsQixVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUE7QUFBQSxNQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTtBQ2tFRSxRQUFBLElBQUksR0FBRyxHQUFHLENBQVYsQ0FBVSxDQUFWO0FEakVBLFFBQUEsU0FBQSxHQUFZLEtBQUEsUUFBQSxDQUFaLENBQVksQ0FBWjtBQUNBLFFBQUEsVUFBQSxHQUFhLEtBQUEsUUFBQSxDQUFBLE9BQUEsR0FBb0IsS0FBQSxRQUFBLENBQXBCLFNBQUEsR0FBMEMsS0FBMUMsS0FBMEMsRUFBMUMsR0FBcUQsS0FBQSxRQUFBLENBQWxFLE9BQUE7O0FBQ0EsWUFBRyxTQUFTLENBQVQsZ0JBQUEsQ0FBQSxHQUFBLEtBQW1DLFNBQVMsQ0FBVCxVQUFBLENBQXFCLEtBQUEsUUFBQSxDQUFyQixNQUFBLEVBQUEsSUFBQSxPQUF0QyxVQUFBLEVBQUE7QUFDRSxpQkFBQSxTQUFBO0FDbUVEO0FEdkVIOztBQUtBLGFBQUEsS0FBQTtBQU5rQjtBQTlGZjtBQUFBO0FBQUEsK0JBcUdPLEtBckdQLEVBcUdPO0FBQ1YsYUFBTyxJQUFJLElBQUEsQ0FBSixHQUFBLENBQ0gsS0FBQSxZQUFBLENBQUEsS0FBQSxFQUFBLFVBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxHQUEyQyxLQUFBLEtBQUEsR0FBQSxNQUFBLElBQW1CLEtBQUEsR0FEM0QsQ0FDd0MsQ0FEeEMsRUFFSCxLQUFBLFlBQUEsQ0FBQSxLQUFBLEVBQUEsVUFBQSxDQUFBLENBQUEsRUFBQSxHQUFBLEdBQXlDLEtBQUEsS0FBQSxHQUFBLE1BQUEsSUFBbUIsS0FBQSxHQUFBLENBQUEsR0FGekQsQ0FFc0MsQ0FGdEMsRUFBQSxTQUFBLENBR08sS0FBQSxRQUFBLENBSFAsT0FBQSxFQUcwQixLQUFBLFFBQUEsQ0FIakMsT0FBTyxDQUFQO0FBRFU7QUFyR1A7QUFBQTtBQUFBLDZCQTBHSyxLQTFHTCxFQTBHSztBQUNSLGFBQU8sSUFBSSxJQUFBLENBQUosR0FBQSxDQUNILEtBQUEsWUFBQSxDQUFBLEtBQUEsRUFBQSxVQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsR0FBMkMsS0FBQSxLQUFBLEdBQUEsTUFBQSxJQUFtQixLQUFBLEdBQUEsQ0FBQSxHQUQzRCxDQUN3QyxDQUR4QyxFQUVILEtBQUEsWUFBQSxDQUFBLEtBQUEsRUFBQSxVQUFBLENBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBeUMsS0FBQSxLQUFBLEdBQUEsTUFBQSxJQUFtQixLQUFBLEdBQUEsQ0FBQSxHQUZ6RCxDQUVzQyxDQUZ0QyxFQUFBLFNBQUEsQ0FHTyxLQUFBLFFBQUEsQ0FBQSxPQUFBLEdBQW9CLEtBQUEsUUFBQSxDQUgzQixTQUFBLEVBR2dELEtBQUEsUUFBQSxDQUh2RCxPQUFPLENBQVA7QUFEUTtBQTFHTDs7QUFBQTtBQUFBLEdBQVA7Ozs7QUFnSEEsSUFBYSxxQkFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDZCQUNHO0FDc0VOLGFEckVBLEtBQUEsWUFBQSxFQ3FFQTtBRHRFTTtBQURIO0FBQUE7QUFBQSxtQ0FHUztBQUFBOztBQUNaLFVBQTBCLEtBQUEsT0FBQSxJQUExQixJQUFBLEVBQUE7QUFBQSxRQUFBLFlBQUEsQ0FBYSxLQUFiLE9BQUEsQ0FBQTtBQ3lFQzs7QUFDRCxhRHpFQSxLQUFBLE9BQUEsR0FBVyxVQUFBLENBQVksWUFBQTtBQUNyQixZQUFBLFFBQUEsRUFBQSxJQUFBLEVBQUEsVUFBQTs7QUFBQSxRQUFBLE1BQUEsQ0FBQSxZQUFBOztBQUNBLFFBQUEsVUFBQSxHQUFhLE1BQUEsQ0FBQSxRQUFBLENBQUEsT0FBQSxHQUFvQixNQUFBLENBQUEsUUFBQSxDQUFwQixTQUFBLEdBQTBDLE1BQUEsQ0FBMUMsS0FBMEMsRUFBMUMsR0FBcUQsTUFBQSxDQUFBLFFBQUEsQ0FBbEUsT0FBQTtBQUNBLFFBQUEsUUFBQSxHQUFXLE1BQUEsQ0FBQSxrQkFBQSxDQUFvQixNQUFBLENBQUEsWUFBQSxDQUFBLENBQUEsRUFBQSxVQUFBLENBQUEsQ0FBQSxFQUFBLElBQUEsR0FBQSxXQUFBLENBQWtELE1BQUEsQ0FBQSxLQUFBLEdBQWpGLE1BQStCLENBQXBCLENBQVg7O0FBQ0EsWUFBQSxRQUFBLEVBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxJQUFJLFlBQUEsQ0FBSixXQUFBLENBQWdCLFFBQVEsQ0FBeEIsS0FBQSxFQUErQixRQUFRLENBQXZDLEdBQUEsRUFBUCxVQUFPLENBQVA7O0FBQ0EsY0FBRyxJQUFJLENBQUosVUFBQSxDQUFnQixNQUFBLENBQUEsUUFBQSxDQUFoQixNQUFBLEVBQUgsU0FBRyxFQUFILEVBQUE7QUFDRSxZQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLGlCQUFBLENBQW1DLENBQW5DLElBQW1DLENBQW5DO0FBSEo7QUFBQSxTQUFBLE1BQUE7QUFLRSxVQUFBLE1BQUEsQ0FBQSxJQUFBO0FDNEVEOztBRDNFRCxZQUFzQixNQUFBLENBQUEsZUFBQSxJQUF0QixJQUFBLEVBQUE7QUM2RUUsaUJEN0VGLE1BQUEsQ0FBQSxlQUFBLEVDNkVFO0FBQ0Q7QUR4RlEsT0FBQSxFQUFBLENBQUEsQ0N5RVg7QUQzRVk7QUFIVDtBQUFBO0FBQUEsZ0NBaUJNO0FBQ1QsYUFBQSxLQUFBO0FBRFM7QUFqQk47QUFBQTtBQUFBLG9DQW1CVTtBQUNiLGFBQU8sQ0FDSCxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBREcsWUFDSCxFQURHLEVBRUgsS0FBQSxZQUFBLENBQUEsQ0FBQSxFQUFBLFVBQUEsQ0FBQSxDQUFBLElBQWlDLEtBQUEsS0FBQSxHQUZyQyxNQUFPLENBQVA7QUFEYTtBQW5CVjtBQUFBO0FBQUEsdUNBd0JlLEdBeEJmLEVBd0JlO0FBQ2xCLFVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFBLEtBQUEsWUFBQTs7QUFBQSxXQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBO0FDb0ZFLFFBQUEsSUFBSSxHQUFHLEdBQUcsQ0FBVixDQUFVLENBQVY7QURuRkEsUUFBQSxTQUFBLEdBQVksS0FBQSxRQUFBLENBQVosQ0FBWSxDQUFaO0FBQ0EsUUFBQSxJQUFBLEdBQU8sS0FBQSxRQUFBLENBQUEsY0FBQSxDQUF5QixTQUFTLENBQXpDLFVBQU8sQ0FBUDs7QUFDQSxZQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLFNBQVMsQ0FBVCxVQUFBLENBQUEsSUFBQTs7QUFDQSxjQUFHLFNBQVMsQ0FBVCxnQkFBQSxDQUFILEdBQUcsQ0FBSCxFQUFBO0FBQ0UsbUJBQUEsU0FBQTtBQUhKO0FDeUZDO0FENUZIOztBQU9BLGFBQUEsS0FBQTtBQVJrQjtBQXhCZjs7QUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFQOzs7O0FBa0NBLFlBQVksQ0FBWixNQUFBLEdBQXNCLFVBQUEsUUFBQSxFQUFBLFVBQUEsRUFBQTtBQUNwQixNQUFHLFFBQVEsQ0FBUixNQUFBLENBQUgsbUJBQUcsRUFBSCxFQUFBO0FBQ0UsV0FBTyxJQUFBLFlBQUEsQ0FBQSxRQUFBLEVBQVAsVUFBTyxDQUFQO0FBREYsR0FBQSxNQUFBO0FBR0UsV0FBTyxJQUFBLHFCQUFBLENBQUEsUUFBQSxFQUFQLFVBQU8sQ0FBUDtBQzJGRDtBRC9GSCxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUV2SkEsSUFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLFdBQUEsQ0FBQTs7QUFDQSxJQUFBLGdCQUFBLEdBQUEsT0FBQSxDQUFBLDJCQUFBLENBQUE7O0FBQ0EsSUFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLFdBQUEsQ0FBQTs7QUFGQSxJQUFBLE9BQUEsR0FBQSxHQUFBLE9BQUE7O0FBSUEsSUFBYSxTQUFOO0FBQUE7QUFBQTtBQUNMLHFCQUFhLEtBQWIsRUFBYSxPQUFiLEVBQWE7QUFBQTs7QUFDWCxRQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTs7QUFBQSxRQUFHLE9BQUEsS0FBQSxLQUFILFFBQUEsRUFBQTtBQUNFLE1BQUEsS0FBQSxHQUFRLENBQVIsS0FBUSxDQUFSO0FDWUQ7O0FEWEQsSUFBQSxRQUFBLEdBQVc7QUFDVCxNQUFBLE1BQUEsRUFEUyxJQUFBO0FBRVQsTUFBQSxVQUFBLEVBRlMsRUFBQTtBQUdULE1BQUEsYUFBQSxFQUhTLElBQUE7QUFJVCxNQUFBLE9BQUEsRUFKUyxJQUFBO0FBS1QsTUFBQSxJQUFBLEVBQU0sUUFBQSxDQUFBLE9BQUEsQ0FMRyxJQUFBO0FBTVQsTUFBQSxXQUFBLEVBTlMsSUFBQTtBQU9ULE1BQUEsWUFBQSxFQVBTLElBQUE7QUFRVCxNQUFBLFlBQUEsRUFSUyxJQUFBO0FBU1QsTUFBQSxRQUFBLEVBVFMsSUFBQTtBQVVULE1BQUEsUUFBQSxFQUFVO0FBVkQsS0FBWDtBQVlBLFNBQUEsS0FBQSxHQUFBLEtBQUE7QUFDQSxTQUFBLE1BQUEsR0FBVSxPQUFRLENBQWxCLFFBQWtCLENBQWxCOztBQUNBLFNBQUEsR0FBQSxJQUFBLFFBQUEsRUFBQTtBQ2FFLE1BQUEsR0FBRyxHQUFHLFFBQVEsQ0FBZCxHQUFjLENBQWQ7O0FEWkEsVUFBRyxHQUFBLElBQUgsT0FBQSxFQUFBO0FBQ0UsYUFBQSxHQUFBLElBQVksT0FBUSxDQUFwQixHQUFvQixDQUFwQjtBQURGLE9BQUEsTUFFSyxJQUFHLEtBQUEsTUFBQSxJQUFBLElBQUEsSUFBYSxHQUFBLEtBQWhCLFFBQUEsRUFBQTtBQUNILGFBQUEsR0FBQSxJQUFZLEtBQUEsTUFBQSxDQUFaLEdBQVksQ0FBWjtBQURHLE9BQUEsTUFBQTtBQUdILGFBQUEsR0FBQSxJQUFBLEdBQUE7QUNjRDtBRHBCSDs7QUFPQSxRQUFPLEtBQUEsT0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLFdBQUEsT0FBQSxHQUFXLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBWSxLQUF2QixRQUFXLENBQVg7QUNnQkQ7O0FEZkQsUUFBRyxLQUFBLGFBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxXQUFBLE9BQUEsQ0FBQSxNQUFBLEdBQWtCLEtBQWxCLGFBQUE7QUNpQkQ7O0FEaEJELFFBQUcsS0FBQSxVQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsV0FBQSxPQUFBLENBQUEsYUFBQSxDQUF1QixLQUF2QixVQUFBO0FDa0JEO0FEL0NVOztBQURSO0FBQUE7QUFBQSwyQkErQkM7QUFDSixXQUFBLGdCQUFBO0FBQ0EsV0FBQSxHQUFBLEdBQU8sS0FBQSxNQUFBLENBQVEsS0FBZixJQUFPLENBQVA7QUFDQSxhQUFPLEtBQVAsR0FBQTtBQWxDRyxLQUFBLENDeURMO0FBQ0E7QUFDQTtBQUNBOztBRDVESztBQUFBO0FBQUEsd0NBdUNjO0FBQ2pCLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFBLEVBQUE7QUFDQSxNQUFBLEdBQUEsR0FBQSxLQUFBLEtBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUN5QkUsUUFBQSxJQUFJLEdBQUcsR0FBRyxDQUFWLENBQVUsQ0FBVjs7QUR6QkYsb0NBQ2lCLGdCQUFBLENBQUEsZUFBQSxDQUFBLFVBQUEsQ0FBZixJQUFlLENBRGpCOztBQUFBOztBQUNFLFFBQUEsS0FERjtBQUNFLFFBQUEsSUFERjs7QUFFRSxZQUFHLEtBQUEsSUFBQSxJQUFBLElBQVcsRUFBRSxPQUFBLENBQUEsSUFBQSxDQUFTLEtBQUEsT0FBQSxDQUFULGFBQVMsRUFBVCxFQUFBLEtBQUEsS0FBaEIsQ0FBYyxDQUFkLEVBQUE7QUFDRSxjQUFBLEVBQU8sS0FBQSxJQUFQLEtBQUEsQ0FBQSxFQUFBO0FBQ0UsWUFBQSxLQUFNLENBQU4sS0FBTSxDQUFOLEdBQUEsRUFBQTtBQzBCRDs7QUR6QkQsVUFBQSxLQUFNLENBQU4sS0FBTSxDQUFOLENBQUEsSUFBQSxDQUFBLElBQUE7QUMyQkQ7QURoQ0g7O0FBTUEsYUFBQSxLQUFBO0FBUmlCO0FBdkNkO0FBQUE7QUFBQSxzQ0FnRGMsU0FoRGQsRUFnRGM7QUFDakIsVUFBQSxJQUFBLEVBQUEsS0FBQTs7QUFEaUIsbUNBQ0YsZ0JBQUEsQ0FBQSxlQUFBLENBQUEsVUFBQSxDQUFBLFNBQUEsRUFBZixJQUFlLENBREU7O0FBQUE7O0FBQ2pCLE1BQUEsS0FEaUI7QUFDakIsTUFBQSxJQURpQjtBQ2lDakIsYUQvQkEsS0FBQSxLQUFBLENBQUEsR0FBQSxDQUFZLFVBQUEsSUFBQSxFQUFBO0FBQ1YsWUFBQSxRQUFBLEVBQUEsU0FBQTs7QUFEVSxxQ0FDYSxnQkFBQSxDQUFBLGVBQUEsQ0FBQSxVQUFBLENBQXZCLElBQXVCLENBRGI7O0FBQUE7O0FBQ1YsUUFBQSxTQURVO0FBQ1YsUUFBQSxRQURVOztBQUVWLFlBQUcsU0FBQSxJQUFBLElBQUEsSUFBZSxTQUFBLEtBQWxCLEtBQUEsRUFBQTtBQUNFLFVBQUEsSUFBQSxHQUFBLFFBQUE7QUNpQ0Q7O0FEaENELFlBQUcsSUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsSUFBQSxHQUFPLElBQUEsR0FBQSxHQUFBLEdBQVAsSUFBQTtBQ2tDRDs7QURqQ0QsZUFBQSxJQUFBO0FBTkYsT0FBQSxDQytCQTtBRGpDaUI7QUFoRGQ7QUFBQTtBQUFBLHFDQTBEVztBQUNkLFVBQUEsQ0FBQTtBQUFBLGFBQUEsWUFBQTtBQ3NDRSxZQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUE7QUR0Q1EsUUFBQSxHQUFBLEdBQUEsS0FBQSxLQUFBO0FBQUEsUUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQzBDTixVQUFBLENBQUMsR0FBRyxHQUFHLENBQVAsQ0FBTyxDQUFQOztBQUNBLGNEM0MyQixDQUFDLENBQUQsT0FBQSxDQUFBLEdBQUEsTUFBa0IsQ0FBQyxDQzJDOUMsRUQzQzhDO0FDNEM1QyxZQUFBLE9BQU8sQ0FBUCxJQUFBLENENUNFLENDNENGO0FBQ0Q7QUQ3Q0s7O0FDK0NSLGVBQUEsT0FBQTtBRC9DRixPQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQTtBQURjO0FBMURYO0FBQUE7QUFBQSx1Q0E0RGE7QUFDaEIsVUFBQSxHQUFBLEVBQUEsUUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLFlBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUE7O0FBQUEsVUFBRyxLQUFILFlBQUEsRUFBQTtBQUNFLGFBQUEsWUFBQSxHQUFBLEtBQUE7QUFDQSxRQUFBLFlBQUEsR0FBZSxJQUFBLFNBQUEsQ0FBYyxLQUFBLE9BQUEsQ0FBZCxhQUFjLEVBQWQsRUFBd0M7QUFBQyxVQUFBLE1BQUEsRUFBRCxJQUFBO0FBQWUsVUFBQSxXQUFBLEVBQWYsS0FBQTtBQUFtQyxVQUFBLFlBQUEsRUFBYztBQUFqRCxTQUF4QyxFQUFmLGdCQUFlLEVBQWY7QUFDQSxRQUFBLENBQUEsR0FBQSxDQUFBO0FBQ0EsUUFBQSxPQUFBLEdBQUEsRUFBQTs7QUN3REEsZUR4RE0sQ0FBQSxHQUFJLFlBQVksQ0FBQyxNQ3dEdkIsRUR4REE7QUFDRSxVQUFBLEdBQUEsR0FBTSxZQUFhLENBQW5CLENBQW1CLENBQW5CO0FBQ0EsVUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLFNBQUE7O0FBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUMwREUsWUFBQSxRQUFRLEdBQUcsR0FBRyxDQUFkLENBQWMsQ0FBZDtBRHpEQSxZQUFBLEdBQUEsR0FBTSxRQUFRLENBQVIsTUFBQSxDQUFOLElBQU0sQ0FBTjs7QUFDQSxnQkFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsbUJBQUEsT0FBQSxDQUFBLGFBQUEsQ0FBQSxHQUFBO0FBQ0EsY0FBQSxZQUFBLEdBQWUsWUFBWSxDQUFaLE1BQUEsQ0FBb0IsSUFBQSxTQUFBLENBQUEsR0FBQSxFQUFtQjtBQUFDLGdCQUFBLE1BQUEsRUFBRCxJQUFBO0FBQWUsZ0JBQUEsV0FBQSxFQUFmLEtBQUE7QUFBbUMsZ0JBQUEsWUFBQSxFQUFjO0FBQWpELGVBQW5CLEVBQW5DLGdCQUFtQyxFQUFwQixDQUFmO0FDK0REO0FEbkVIOztBQ3FFQSxVQUFBLE9BQU8sQ0FBUCxJQUFBLENEaEVBLENBQUEsRUNnRUE7QUR2RUY7O0FDeUVBLGVBQUEsT0FBQTtBQUNEO0FEL0VlO0FBNURiO0FBQUE7QUFBQSwyQkF5RUcsR0F6RUgsRUF5RUc7QUFBQSxVQUFLLElBQUwsdUVBQUEsSUFBQTtBQUNOLFVBQUEsSUFBQTs7QUFBQSxVQUFPLEdBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxlQUFBLElBQUE7QUN1RUQ7O0FEdEVELE1BQUEsSUFBQSxHQUFPLEtBQUEsa0JBQUEsQ0FBb0IsS0FBM0IsZ0JBQTJCLEVBQXBCLENBQVA7O0FBQ0EsVUFBRyxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBQSxJQUFBO0FDd0VEO0FEN0VLO0FBekVIO0FBQUE7QUFBQSx1Q0ErRWE7QUFDaEIsVUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsWUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUE7O0FBQUEsVUFBTyxLQUFBLElBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxlQUFBLEVBQUE7QUM0RUQ7O0FEM0VELFdBQUEsSUFBQSxDQUFBLElBQUE7QUFDQSxNQUFBLFlBQUEsR0FBQSxFQUFBOztBQUNBLFVBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLFFBQUEsS0FBQSxJQUFBLEdBQUEsQ0FBQSxJQUFBLEdBQUEsR0FBQSxDQUFBLFVBQUEsS0FBQSxJQUFBLEdBQUEsSUFBd0IsQ0FBeEIsR0FBQSxHQUEwQixLQUExQixDQUFBLEdBQTBCLEtBQTFCLENBQUEsTUFBaUMsS0FBakMsSUFBQSxFQUFBO0FBQ0UsUUFBQSxZQUFBLEdBQWUsWUFBWSxDQUFaLE1BQUEsQ0FBb0IsS0FBQSwwQkFBQSxDQUFuQyxhQUFtQyxDQUFwQixDQUFmO0FDNkVEOztBRDVFRCxNQUFBLElBQUEsR0FBQSxLQUFBLGlCQUFBLEVBQUE7O0FBQUEsV0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBO0FDK0VFLFFBQUEsS0FBSyxHQUFHLElBQUksQ0FBWixLQUFZLENBQVo7QUQ5RUEsUUFBQSxZQUFBLEdBQWUsWUFBWSxDQUFaLE1BQUEsQ0FBb0IsS0FBQSwwQkFBQSxDQUFBLEtBQUEsRUFBbkMsS0FBbUMsQ0FBcEIsQ0FBZjtBQURGOztBQUVBLE1BQUEsSUFBQSxHQUFBLEtBQUEsT0FBQSxDQUFBLGFBQUEsRUFBQTs7QUFBQSxXQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQ2tGRSxRQUFBLElBQUksR0FBRyxJQUFJLENBQVgsQ0FBVyxDQUFYOztBRGxGRixxQ0FDb0IsZ0JBQUEsQ0FBQSxlQUFBLENBQUEsVUFBQSxDQUFBLElBQUEsRUFBbEIsSUFBa0IsQ0FEcEI7O0FBQUE7O0FBQ0UsUUFBQSxRQURGO0FBQ0UsUUFBQSxJQURGO0FBRUUsUUFBQSxZQUFBLEdBQWUsWUFBWSxDQUFaLE1BQUEsQ0FBb0IsS0FBQSwwQkFBQSxDQUFBLFFBQUEsRUFBc0MsS0FBQSxpQkFBQSxDQUF6RSxJQUF5RSxDQUF0QyxDQUFwQixDQUFmO0FBRkY7O0FBR0EsTUFBQSxJQUFBLEdBQUEsS0FBQSxjQUFBLEVBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLElBQUEsR0FBQSxJQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNxRkUsUUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFYLENBQVcsQ0FBWDtBRHBGQSxRQUFBLE1BQUEsR0FBUyxLQUFBLElBQUEsQ0FBQSxNQUFBLENBQVQsSUFBUyxDQUFUOztBQUNBLFlBQUcsS0FBQSxVQUFBLENBQUgsTUFBRyxDQUFILEVBQUE7QUFDRSxVQUFBLFlBQVksQ0FBWixJQUFBLENBQUEsTUFBQTtBQ3NGRDtBRHpGSDs7QUFJQSxVQUFHLEtBQUgsWUFBQSxFQUFBO0FBQ0UsUUFBQSxRQUFBLEdBQVcsS0FBQSxJQUFBLENBQUEsTUFBQSxDQUFYLFVBQVcsQ0FBWDs7QUFDQSxZQUFHLEtBQUEsVUFBQSxDQUFILFFBQUcsQ0FBSCxFQUFBO0FBQ0UsVUFBQSxZQUFZLENBQVosSUFBQSxDQUFBLFFBQUE7QUFISjtBQzRGQzs7QUR4RkQsV0FBQSxZQUFBLEdBQUEsWUFBQTtBQUNBLGFBQUEsWUFBQTtBQXJCZ0I7QUEvRWI7QUFBQTtBQUFBLCtDQXFHdUIsT0FyR3ZCLEVBcUd1QjtBQUFBLFVBQVUsS0FBVix1RUFBa0IsS0FBbEIsS0FBQTtBQUMxQixVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxZQUFBO0FBQUEsTUFBQSxZQUFBLEdBQUEsRUFBQTtBQUNBLE1BQUEsS0FBQSxHQUFRLEtBQUEsaUJBQUEsQ0FBUixPQUFRLENBQVI7O0FBQ0EsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUM2RkUsUUFBQSxJQUFJLEdBQUcsS0FBSyxDQUFaLENBQVksQ0FBWjtBRDVGQSxRQUFBLFlBQUEsR0FBZSxZQUFZLENBQVosTUFBQSxDQUFvQixJQUFBLFNBQUEsQ0FBQSxLQUFBLEVBQXFCO0FBQUMsVUFBQSxNQUFBLEVBQUQsSUFBQTtBQUFlLFVBQUEsSUFBQSxFQUFNO0FBQXJCLFNBQXJCLEVBQW5DLGdCQUFtQyxFQUFwQixDQUFmO0FBREY7O0FDbUdBLGFEakdBLFlDaUdBO0FEdEcwQjtBQXJHdkI7QUFBQTtBQUFBLHNDQTJHYyxJQTNHZCxFQTJHYztBQUNqQixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxLQUFBLElBQUEsQ0FBQSxNQUFBLENBQU4sSUFBTSxDQUFOOztBQUNBLFVBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsR0FBRyxDQUFILElBQUE7O0FBQ0EsWUFBRyxHQUFBLENBQUEsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLENBQUEsR0FBQSxFQUFLLEdBQUcsQ0FBZixVQUFZLEVBQUwsQ0FBUDtBQ3FHRDs7QURwR0QsZUFBTyxDQUFQLEdBQU8sQ0FBUDtBQ3NHRDs7QURyR0QsYUFBTyxDQUFQLEdBQU8sQ0FBUDtBQVBpQjtBQTNHZDtBQUFBO0FBQUEsK0JBbUhPLEdBbkhQLEVBbUhPO0FBQ1YsVUFBTyxHQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsZUFBQSxLQUFBO0FDeUdEOztBRHhHRCxVQUFHLEdBQUcsQ0FBSCxJQUFBLEtBQUEsVUFBQSxJQUEwQixPQUFBLENBQUEsSUFBQSxDQUFPLEtBQVAsU0FBTyxFQUFQLEVBQUEsR0FBQSxLQUE3QixDQUFBLEVBQUE7QUFDRSxlQUFBLEtBQUE7QUMwR0Q7O0FEekdELGFBQU8sQ0FBQyxLQUFELFdBQUEsSUFBaUIsS0FBQSxlQUFBLENBQXhCLEdBQXdCLENBQXhCO0FBTFU7QUFuSFA7QUFBQTtBQUFBLGdDQXlITTtBQUNULFVBQUEsR0FBQTs7QUFBQSxVQUFHLENBQUEsQ0FBQSxHQUFBLEdBQUEsS0FBQSxRQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsQ0FBQSxVQUFBLEdBQUEsS0FBQSxDQUFBLEtBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBTyxLQUFBLFFBQUEsQ0FBQSxVQUFBLENBQVAsbUJBQU8sRUFBUDtBQzhHRDs7QUQ3R0QsYUFBQSxFQUFBO0FBSFM7QUF6SE47QUFBQTtBQUFBLG9DQTZIWSxHQTdIWixFQTZIWTtBQUNmLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEtBQVIsY0FBUSxFQUFSOztBQUNBLFVBQUcsS0FBSyxDQUFMLE1BQUEsS0FBSCxDQUFBLEVBQUE7QUFDRSxlQUFPLEdBQUcsQ0FBSCxJQUFBLEdBQUEsb0JBQUEsQ0FBZ0MsS0FBTSxDQUE3QyxDQUE2QyxDQUF0QyxDQUFQO0FBREYsT0FBQSxNQUFBO0FBR0UsZUFBTyxHQUFHLENBQUgsSUFBQSxHQUFQLFlBQU8sRUFBUDtBQ2tIRDtBRHZIYztBQTdIWjtBQUFBO0FBQUEsNkJBbUlLLEdBbklMLEVBbUlLO0FBQ1IsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBRyxDQUFYLEtBQUE7O0FBQ0EsVUFBRyxHQUFHLENBQUgsSUFBQSxLQUFILFVBQUEsRUFBQTtBQUNJLFFBQUEsS0FBQSxJQUFBLElBQUE7QUNzSEg7O0FEckhELGFBQUEsS0FBQTtBQUpRO0FBbklMO0FBQUE7QUFBQSx1Q0F3SWUsSUF4SWYsRUF3SWU7QUFDbEIsVUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEtBQUE7O0FBQUEsVUFBRyxJQUFJLENBQUosTUFBQSxHQUFILENBQUEsRUFBQTtBQUNFLFFBQUEsSUFBQSxHQUFBLElBQUE7QUFDQSxRQUFBLFNBQUEsR0FBQSxJQUFBOztBQUNBLGFBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDMEhFLFVBQUEsQ0FBQyxHQUFHLElBQUksQ0FBUixDQUFRLENBQVI7QUR6SEEsVUFBQSxLQUFBLEdBQVEsS0FBQSxRQUFBLENBQVIsQ0FBUSxDQUFSOztBQUNBLGNBQUksSUFBQSxJQUFBLElBQUEsSUFBUyxLQUFBLElBQWIsU0FBQSxFQUFBO0FBQ0UsWUFBQSxTQUFBLEdBQUEsS0FBQTtBQUNBLFlBQUEsSUFBQSxHQUFBLENBQUE7QUMySEQ7QUQvSEg7O0FBS0EsZUFBQSxJQUFBO0FDNkhEO0FEdElpQjtBQXhJZjs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFSkEsSUFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLFdBQUEsQ0FBQTs7QUFDQSxJQUFBLFNBQUEsR0FBQSxPQUFBLENBQUEsWUFBQSxDQUFBOztBQUNBLElBQUEsV0FBQSxHQUFBLE9BQUEsQ0FBQSxjQUFBLENBQUE7O0FBQ0EsSUFBQSxhQUFBLEdBQUEsT0FBQSxDQUFBLHdCQUFBLENBQUE7O0FBRUEsSUFBYSxXQUFOO0FBQUE7QUFBQTtBQUNMLHVCQUFhLElBQWIsRUFBYSxPQUFiLEVBQWE7QUFBQTs7QUFBQyxTQUFBLEdBQUEsR0FBQSxJQUFBO0FBQUssU0FBQSxPQUFBLEdBQUEsT0FBQTtBQUFOOztBQURSO0FBQUE7QUFBQSwyQkFHQztBQUNKLFVBQUEsRUFBTyxLQUFBLE9BQUEsTUFBYyxLQUFyQixNQUFBLENBQUEsRUFBQTtBQUNFLGFBQUEsTUFBQSxHQUFBLElBQUE7O0FBQ0EsYUFBQSxVQUFBOztBQUNBLGFBQUEsV0FBQTs7QUFDQSxZQUFHLEtBQUEsTUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGVBQUEsTUFBQSxDQUFBLElBQUE7QUFMSjtBQ3FCQzs7QURmRCxhQUFBLElBQUE7QUFQSTtBQUhEO0FBQUE7QUFBQSw2QkFXSSxJQVhKLEVBV0ksR0FYSixFQVdJO0FDbUJQLGFEbEJBLEtBQUEsS0FBQSxDQUFBLElBQUEsSUFBZSxHQ2tCZjtBRG5CTztBQVhKO0FBQUE7QUFBQSw4QkFhSyxHQWJMLEVBYUs7QUNxQlIsYURwQkEsS0FBQSxNQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0NvQkE7QURyQlE7QUFiTDtBQUFBO0FBQUEsaUNBZU87QUFDVixVQUFPLEtBQUEsT0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGFBQUEsT0FBQSxHQUFXLElBQUksUUFBQSxDQUFmLE9BQVcsRUFBWDtBQ3VCRDs7QUR0QkQsYUFBTyxLQUFBLE9BQUEsSUFBWSxJQUFJLFFBQUEsQ0FBdkIsT0FBbUIsRUFBbkI7QUFIVTtBQWZQO0FBQUE7QUFBQSw4QkFtQk0sT0FuQk4sRUFtQk07QUFDVCxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxLQUFBLFVBQUEsR0FBQSxTQUFBLENBQUEsT0FBQSxFQUFnQztBQUFBLFFBQUEsVUFBQSxFQUFXLEtBQUEsb0JBQUE7QUFBWCxPQUFoQyxDQUFUO0FBQ0EsTUFBQSxNQUFNLENBQU4sUUFBQSxHQUFBLElBQUE7QUFDQSxhQUFBLE1BQUE7QUFIUztBQW5CTjtBQUFBO0FBQUEsaUNBdUJPO0FBQ1YsVUFBQSxHQUFBOztBQUFBLFVBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsYUFBQSxHQUFBLENBQUEsSUFBQTtBQUNBLFFBQUEsR0FBQSxHQUFNLEtBQUEsVUFBQSxNQUFpQixLQUF2QixHQUFBO0FBQ0EsUUFBQSxHQUFHLENBQUgsSUFBQTs7QUFDQSxZQUFHLEdBQUEsQ0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBQSxNQUFBLEdBQVUsSUFBSSxHQUFHLENBQVAsR0FBQSxDQUFWLElBQVUsQ0FBVjtBQUNBLGlCQUFPLEtBQVAsTUFBQTtBQU5KO0FDdUNDO0FEeENTO0FBdkJQO0FBQUE7QUFBQSxrQ0ErQlE7QUNvQ1gsYURuQ0EsS0FBQSxLQUFBLEdBQVMsS0FBQSxXQUFBLEVDbUNUO0FEcENXO0FBL0JSO0FBQUE7QUFBQSwyQ0FpQ2lCO0FBQ3BCLGFBQUEsRUFBQTtBQURvQjtBQWpDakI7QUFBQTtBQUFBLDhCQW1DSTtBQUNQLGFBQU8sS0FBQSxHQUFBLElBQVAsSUFBQTtBQURPO0FBbkNKO0FBQUE7QUFBQSx3Q0FxQ2M7QUFDakIsVUFBQSxPQUFBOztBQUFBLFVBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsWUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxLQUFBLE1BQUEsQ0FBUCxpQkFBTyxFQUFQO0FDMkNEOztBRDFDRCxRQUFBLE9BQUEsR0FBVSxLQUFWLGVBQVUsRUFBVjs7QUFDQSxZQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxPQUFPLENBQWQsaUJBQU8sRUFBUDtBQzRDRDs7QUQzQ0QsZUFBTyxLQUFBLEdBQUEsQ0FBUCxpQkFBTyxFQUFQO0FDNkNEOztBRDVDRCxhQUFBLEtBQUE7QUFSaUI7QUFyQ2Q7QUFBQTtBQUFBLGtDQThDUTtBQUNYLFVBQUEsT0FBQSxFQUFBLEdBQUE7O0FBQUEsVUFBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBQSxFQUFBO0FBQ0EsUUFBQSxPQUFBLEdBQVUsS0FBVixVQUFVLEVBQVY7O0FBQ0EsWUFBRyxPQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFOLE1BQUEsQ0FBQSxHQUFBLEVBQWtCLE9BQU8sQ0FBL0IsV0FBd0IsRUFBbEIsQ0FBTjtBQ2lERDs7QURoREQsUUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFOLE1BQUEsQ0FBQSxHQUFBLEVBQWtCLEtBQUEsR0FBQSxDQUF4QixRQUFNLENBQU47O0FBQ0EsWUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsS0FBQSxNQUFBLENBQXhCLFdBQXdCLEVBQWxCLENBQU47QUNrREQ7O0FEakRELGVBQUEsR0FBQTtBQ21ERDtBRDVEVTtBQTlDUjtBQUFBO0FBQUEsaUNBd0RPO0FBQ1YsVUFBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxZQUFPLEtBQUEsVUFBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGVBQUEsZUFBQTtBQ3NERDs7QURyREQsZUFBTyxLQUFBLFVBQUEsSUFBUCxJQUFBO0FDdUREO0FEM0RTO0FBeERQO0FBQUE7QUFBQSxzQ0E2RFk7QUFDZixVQUFBLE9BQUE7O0FBQUEsVUFBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxZQUFHLEtBQUEsZUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLEtBQUEsZUFBQSxJQUFQLElBQUE7QUMyREQ7O0FEMURELFlBQUcsS0FBQSxHQUFBLENBQUEsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsT0FBQSxHQUFVLEtBQVYsR0FBQTs7QUFDQSxpQkFBTSxPQUFBLElBQUEsSUFBQSxJQUFhLE9BQUEsQ0FBQSxPQUFBLElBQW5CLElBQUEsRUFBQTtBQUNFLFlBQUEsT0FBQSxHQUFVLE9BQU8sQ0FBUCxrQkFBQSxDQUEyQixLQUFBLFNBQUEsQ0FBVyxLQUFBLFlBQUEsQ0FBYyxPQUFPLENBQXJFLE9BQWdELENBQVgsQ0FBM0IsQ0FBVjs7QUFDQSxnQkFBTyxLQUFBLFVBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxtQkFBQSxVQUFBLEdBQWMsT0FBQSxJQUFkLEtBQUE7QUM0REQ7QUQvREg7O0FBSUEsZUFBQSxlQUFBLEdBQW1CLE9BQUEsSUFBbkIsS0FBQTtBQUNBLGlCQUFBLE9BQUE7QUFWSjtBQ3lFQztBRDFFYztBQTdEWjtBQUFBO0FBQUEsaUNBeUVTLE9BekVULEVBeUVTO0FDa0VaLGFEakVBLE9DaUVBO0FEbEVZO0FBekVUO0FBQUE7QUFBQSxpQ0EyRU87QUFDVixVQUFBLEdBQUE7O0FBQUEsVUFBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxZQUFHLEtBQUEsVUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLEtBQVAsVUFBQTtBQ3FFRDs7QURwRUQsUUFBQSxHQUFBLEdBQU0sS0FBQSxHQUFBLENBQUEsa0JBQUEsQ0FBd0IsS0FBOUIsVUFBOEIsRUFBeEIsQ0FBTjs7QUFDQSxZQUFHLEtBQUEsTUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBTixNQUFBLENBQUEsR0FBQSxFQUFrQixLQUFBLE1BQUEsQ0FBeEIsVUFBd0IsRUFBbEIsQ0FBTjtBQ3NFRDs7QURyRUQsYUFBQSxVQUFBLEdBQUEsR0FBQTtBQUNBLGVBQUEsR0FBQTtBQ3VFRDtBRC9FUztBQTNFUDtBQUFBO0FBQUEsOEJBb0ZNLEdBcEZOLEVBb0ZNO0FBQ1QsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsS0FBVixVQUFVLEVBQVY7O0FBQ0EsVUFBRyxPQUFBLElBQUEsSUFBQSxJQUFhLEdBQUEsSUFBaEIsT0FBQSxFQUFBO0FBQ0UsZUFBTyxPQUFRLENBQWYsR0FBZSxDQUFmO0FDMkVEO0FEOUVRO0FBcEZOO0FBQUE7QUFBQSw2QkF3RkssS0F4RkwsRUF3Rks7QUFBQSxVQUFRLE1BQVIsdUVBQUEsSUFBQTtBQUNSLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQTs7QUFBQSxVQUFtQixDQUFBLEdBQUEsV0FBQSxLQUFBLENBQUEsTUFBQSxRQUFBLElBQUMsR0FBQSxLQUFwQixRQUFBLEVBQUE7QUFBQSxRQUFBLEtBQUEsR0FBUSxDQUFSLEtBQVEsQ0FBUjtBQ2dGQzs7QUQvRUQsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNpRkUsUUFBQSxDQUFDLEdBQUcsS0FBSyxDQUFULENBQVMsQ0FBVDs7QURoRkEsWUFBb0IsS0FBQSxLQUFBLENBQUEsQ0FBQSxLQUFwQixJQUFBLEVBQUE7QUFBQSxpQkFBTyxLQUFBLEtBQUEsQ0FBUCxDQUFPLENBQVA7QUNtRkM7O0FEbEZELFlBQXFCLEtBQUEsTUFBQSxDQUFBLENBQUEsS0FBckIsSUFBQSxFQUFBO0FBQUEsaUJBQU8sS0FBQSxNQUFBLENBQVAsQ0FBTyxDQUFQO0FDcUZDO0FEdkZIOztBQUdBLGFBQUEsTUFBQTtBQUxRO0FBeEZMO0FBQUE7QUFBQSxpQ0E4RlMsS0E5RlQsRUE4RlM7QUFBQSxVQUFRLE1BQVIsdUVBQUEsSUFBQTtBQUNaLFVBQUEsU0FBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxDQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBWixDQUFZLENBQVo7QUFDQSxNQUFBLEdBQUEsR0FBTSxLQUFBLFFBQUEsQ0FBQSxLQUFBLEVBQU4sTUFBTSxDQUFOO0FDMEZBLGFEekZBLENBQUMsU0FBUyxDQUFULFFBQUEsQ0FBQSxHQUFBLENDeUZEO0FENUZZO0FBOUZUO0FBQUE7QUFBQSxtQ0FrR1M7QUFDWixVQUFBLEdBQUE7O0FBQUEsVUFBRyxDQUFBLENBQUEsR0FBQSxHQUFBLEtBQUEsT0FBQSxDQUFBLFFBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxDQUFBLFVBQUEsR0FBQSxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxVQUFBLENBQVAsbUJBQU8sRUFBUDtBQzZGRDs7QUQ1RkQsYUFBQSxFQUFBO0FBSFk7QUFsR1Q7QUFBQTtBQUFBLDBDQXNHZ0I7QUFDbkIsYUFBTyxLQUFBLFlBQUEsR0FBQSxNQUFBLENBQXVCLENBQUMsS0FBL0IsR0FBOEIsQ0FBdkIsQ0FBUDtBQURtQjtBQXRHaEI7QUFBQTtBQUFBLHNDQXdHWTtBQUNmLFVBQUEsR0FBQTs7QUFBQSxVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFlBQUcsS0FBQSxNQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sS0FBQSxNQUFBLENBQVAsT0FBTyxFQUFQO0FDbUdEOztBRGxHRCxRQUFBLEdBQUEsR0FBTSxLQUFBLGVBQUEsTUFBc0IsS0FBNUIsR0FBQTtBQUNBLFFBQUEsR0FBRyxDQUFILElBQUE7O0FBQ0EsWUFBRyxHQUFBLENBQUEsWUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLEdBQUcsQ0FBSCxZQUFBLENBQVAsSUFBTyxDQUFQO0FBTko7QUMyR0M7QUQ1R2M7QUF4R1o7QUFBQTtBQUFBLGdDQWdITTtBQUNULFVBQUEsR0FBQTs7QUFBQSxVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFlBQUcsS0FBQSxNQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sS0FBQSxNQUFBLENBQVAsTUFBTyxFQUFQO0FDeUdEOztBRHhHRCxRQUFBLEdBQUEsR0FBTSxLQUFBLGVBQUEsTUFBc0IsS0FBNUIsR0FBQTtBQUNBLFFBQUEsR0FBRyxDQUFILElBQUE7O0FBQ0EsWUFBRyxHQUFBLENBQUEsV0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLEdBQUcsQ0FBSCxXQUFBLENBQVAsSUFBTyxDQUFQO0FDMEdEOztBRHpHRCxZQUFHLEdBQUEsQ0FBQSxTQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sR0FBRyxDQUFWLFNBQUE7QUFSSjtBQ29IQztBRHJIUTtBQWhITjtBQUFBO0FBQUEsNkJBMEhHO0FBQ04sVUFBQSxVQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUE7QUFBQSxXQUFBLElBQUE7O0FBQ0EsVUFBRyxLQUFILGlCQUFHLEVBQUgsRUFBQTtBQUNFLFlBQUcsQ0FBQSxHQUFBLEdBQUEsS0FBQSxTQUFBLEVBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxLQUFBLFlBQUEsQ0FBTixHQUFNLENBQU47O0FBQ0EsY0FBRyxHQUFHLENBQUgsTUFBQSxHQUFBLENBQUEsSUFBbUIsS0FBQSxTQUFBLENBQUEsT0FBQSxFQUF0QixJQUFzQixDQUF0QixFQUFBO0FBQ0UsWUFBQSxNQUFBLEdBQVMsS0FBQSxnQkFBQSxDQUFULEdBQVMsQ0FBVDtBQUNBLFlBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBWixRQUFNLEVBQU47QUNnSEQ7O0FEL0dELGNBQUcsVUFBQSxHQUFhLEtBQUEsU0FBQSxDQUFBLGFBQUEsRUFBaEIsSUFBZ0IsQ0FBaEIsRUFBQTtBQUNFLFlBQUEsR0FBQSxHQUFNLFVBQUEsQ0FBQSxHQUFBLEVBQU4sSUFBTSxDQUFOO0FDaUhEOztBRGhIRCxpQkFBQSxHQUFBO0FBUko7QUMySEM7QUQ3SEs7QUExSEg7QUFBQTtBQUFBLHVDQXFJYTtBQUFBLFVBQUMsR0FBRCx1RUFBQSxFQUFBO0FBQ2hCLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksU0FBQSxDQUFKLFFBQUEsQ0FBYSxJQUFJLFdBQUEsQ0FBSixVQUFBLENBQWIsR0FBYSxDQUFiLEVBQWtDO0FBQUMsUUFBQSxVQUFBLEVBQVc7QUFBWixPQUFsQyxDQUFUO0FBQ0EsTUFBQSxNQUFNLENBQU4sV0FBQSxHQUFBLEtBQUE7QUFDQSxhQUFBLE1BQUE7QUFIZ0I7QUFySWI7QUFBQTtBQUFBLGdDQXlJTTtBQUNULGFBQUEsQ0FBQTtBQURTO0FBeklOO0FBQUE7QUFBQSxpQ0EySVMsSUEzSVQsRUEySVM7QUFDWixVQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLElBQUksQ0FBSixPQUFBLENBQUEsS0FBQSxFQUFQLElBQU8sQ0FBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQUEsSUFBQTtBQzZIRDtBRGpJVztBQTNJVDtBQUFBO0FBQUEsZ0NBZ0pRLElBaEpSLEVBZ0pRO0FBQ1gsYUFBTyxhQUFBLENBQUEsWUFBQSxDQUFBLGNBQUEsQ0FBQSxJQUFBLEVBQWlDLEtBQWpDLFNBQWlDLEVBQWpDLEVBQVAsR0FBTyxDQUFQO0FBRFc7QUFoSlI7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVMQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsV0FBQSxDQUFBOztBQUNBLElBQUEsUUFBQSxHQUFBLE9BQUEsQ0FBQSxXQUFBLENBQUE7O0FBQ0EsSUFBQSxzQkFBQSxHQUFBLE9BQUEsQ0FBQSx5QkFBQSxDQUFBOztBQUNBLElBQUEsV0FBQSxHQUFBLE9BQUEsQ0FBQSxjQUFBLENBQUE7O0FBQ0EsSUFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLFdBQUEsQ0FBQTs7QUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLENBQUEsVUFBQSxDQUFBOztBQUNBLElBQUEsY0FBQSxHQUFBLE9BQUEsQ0FBQSw2QkFBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSxnQkFBQSxDQUFBOztBQUVBLElBQWEsUUFBQSxHQUFBLFlBQUE7QUFBQSxNQUFOLFFBQU07QUFBQTtBQUFBO0FBQ1gsc0JBQWEsTUFBYixFQUFhO0FBQUEsVUFBVSxPQUFWLHVFQUFBLEVBQUE7O0FBQUE7O0FBQ1gsVUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFEWSxXQUFBLE1BQUEsR0FBQSxNQUFBO0FBQ1osTUFBQSxRQUFRLENBQVIsSUFBQTtBQUNBLFdBQUEsTUFBQSxHQUFBLDBCQUFBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsRUFBQTtBQUVBLE1BQUEsUUFBQSxHQUFXO0FBQ1QsbUJBRFMsSUFBQTtBQUVULGdCQUZTLEdBQUE7QUFHVCxxQkFIUyxHQUFBO0FBSVQseUJBSlMsR0FBQTtBQUtULHNCQUxTLEdBQUE7QUFNVCx1QkFOUyxJQUFBO0FBT1Qsc0JBQWU7QUFQTixPQUFYO0FBU0EsV0FBQSxNQUFBLEdBQVUsT0FBUSxDQUFsQixRQUFrQixDQUFsQjtBQUVBLFdBQUEsTUFBQSxHQUFhLEtBQUEsTUFBQSxJQUFBLElBQUEsR0FBYyxLQUFBLE1BQUEsQ0FBQSxNQUFBLEdBQWQsQ0FBQSxHQUFiLENBQUE7O0FBRUEsV0FBQSxHQUFBLElBQUEsUUFBQSxFQUFBO0FDMkJJLFFBQUEsR0FBRyxHQUFHLFFBQVEsQ0FBZCxHQUFjLENBQWQ7O0FEMUJGLFlBQUcsR0FBQSxJQUFILE9BQUEsRUFBQTtBQUNFLGVBQUEsR0FBQSxJQUFZLE9BQVEsQ0FBcEIsR0FBb0IsQ0FBcEI7QUFERixTQUFBLE1BRUssSUFBRyxLQUFBLE1BQUEsSUFBQSxJQUFBLElBQWEsR0FBQSxLQUFoQixRQUFBLEVBQUE7QUFDSCxlQUFBLEdBQUEsSUFBWSxLQUFBLE1BQUEsQ0FBWixHQUFZLENBQVo7QUFERyxTQUFBLE1BQUE7QUFHSCxlQUFBLEdBQUEsSUFBQSxHQUFBO0FDNEJDO0FEbENMOztBQU9BLFVBQTBCLEtBQUEsTUFBQSxJQUExQixJQUFBLEVBQUE7QUFBQSxhQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsSUFBQTtBQytCRzs7QUQ3QkgsV0FBQSxPQUFBLEdBQVcsSUFBSSxRQUFBLENBQUosT0FBQSxDQUFYLElBQVcsQ0FBWDs7QUFDQSxVQUFHLEtBQUEsVUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGFBQUEsT0FBQSxDQUFBLE1BQUEsR0FBa0IsS0FBQSxVQUFBLENBQWxCLE9BQUE7QUMrQkM7O0FEN0JILFdBQUEsTUFBQSxHQUFVLElBQUksT0FBQSxDQUFkLE1BQVUsRUFBVjtBQS9CVzs7QUFERjtBQUFBO0FBQUEsd0NBa0NNO0FBQUE7O0FBQ2YsYUFBQSxPQUFBLEdBQVcsSUFBSSxRQUFBLENBQWYsT0FBVyxFQUFYO0FBQ0EsYUFBQSxNQUFBLENBQUEsR0FBQSxDQUFBLGdCQUFBO0FDZ0NFLGVEL0JGLEtBQUEsY0FBQSxHQUFBLElBQUEsQ0FBdUIsWUFBQTtBQ2dDbkIsaUJEL0JGLEtBQUEsQ0FBQSxPQUFBLEdBQVcsSUMrQlQ7QURoQ0osU0FBQSxDQytCRTtBRGxDYTtBQWxDTjtBQUFBO0FBQUEsdUNBdUNLO0FBQ2QsWUFBRyxLQUFBLE1BQUEsQ0FBSCxtQkFBRyxFQUFILEVBQUE7QUNtQ0ksaUJEbENGLEtBQUEsYUFBQSxDQUFlLEtBQUEsTUFBQSxDQUFmLFdBQWUsRUFBZixDQ2tDRTtBRG5DSixTQUFBLE1BQUE7QUNxQ0ksaUJEbENGLEtBQUEsUUFBQSxDQUFVLEtBQUEsTUFBQSxDQUFWLFlBQVUsRUFBVixDQ2tDRTtBQUNEO0FEdkNXO0FBdkNMO0FBQUE7QUFBQSwrQkE0Q0QsR0E1Q0MsRUE0Q0Q7QUNzQ04sZURyQ0YsS0FBQSxhQUFBLENBQWUsQ0FBZixHQUFlLENBQWYsQ0NxQ0U7QUR0Q007QUE1Q0M7QUFBQTtBQUFBLG9DQThDSSxRQTlDSixFQThDSTtBQUFBOztBQ3dDWCxlRHZDRixPQUFPLENBQVAsT0FBQSxHQUFBLElBQUEsQ0FBdUIsWUFBQTtBQUNyQixjQUFBLEdBQUE7O0FBQUEsY0FBRyxRQUFRLENBQVIsTUFBQSxHQUFILENBQUEsRUFBQTtBQUNFLFlBQUEsR0FBQSxHQUFNLE1BQUEsQ0FBQSxZQUFBLENBQWMsUUFBUyxDQUFULENBQVMsQ0FBVCxDQUFwQixHQUFNLENBQU47O0FBQ0EsZ0JBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGtCQUFHLFFBQVEsQ0FBUixNQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0UsZ0JBQUEsR0FBRyxDQUFILFdBQUEsQ0FBQSxRQUFBO0FDeUNDOztBRHhDSCxjQUFBLEdBQUcsQ0FBSCxJQUFBOztBQUNBLGNBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsR0FBQTs7QUMwQ0UscUJEekNGLEdBQUcsQ0FBSCxPQUFBLEVDeUNFO0FEOUNKLGFBQUEsTUFBQTtBQU9FLGtCQUFHLFFBQVMsQ0FBVCxDQUFTLENBQVQsQ0FBQSxLQUFBLEtBQXFCLFFBQVMsQ0FBVCxDQUFTLENBQVQsQ0FBeEIsR0FBQSxFQUFBO0FDMENJLHVCRHpDRixNQUFBLENBQUEsVUFBQSxDQUFBLFFBQUEsQ0N5Q0U7QUQxQ0osZUFBQSxNQUFBO0FDNENJLHVCRHpDRixNQUFBLENBQUEsZ0JBQUEsQ0FBQSxRQUFBLENDeUNFO0FEbkROO0FBRkY7QUN3REc7QUR6REwsU0FBQSxDQ3VDRTtBRHhDVztBQTlDSjtBQUFBO0FBQUEsbUNBNkRHLEdBN0RILEVBNkRHO0FBQ1osWUFBQSxJQUFBLEVBQUEsSUFBQTs7QUFBQSxZQUFHLEtBQUEsaUJBQUEsQ0FBQSxHQUFBLEtBQTRCLEtBQUEsaUJBQUEsQ0FBNUIsR0FBNEIsQ0FBNUIsSUFBd0QsS0FBQSxlQUFBLENBQUEsR0FBQSxJQUFBLENBQUEsS0FBM0QsQ0FBQSxFQUFBO0FBQ0UsVUFBQSxJQUFBLEdBQU8sR0FBQSxHQUFJLEtBQUEsT0FBQSxDQUFYLE1BQUE7QUFDQSxVQUFBLElBQUEsR0FBQSxHQUFBO0FBRkYsU0FBQSxNQUFBO0FBSUUsY0FBRyxLQUFBLGlCQUFBLENBQUEsR0FBQSxLQUE0QixLQUFBLGVBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxLQUEvQixDQUFBLEVBQUE7QUFDRSxZQUFBLEdBQUEsSUFBTyxLQUFBLE9BQUEsQ0FBUCxNQUFBO0FDaURDOztBRGhESCxVQUFBLElBQUEsR0FBTyxLQUFBLGNBQUEsQ0FBUCxHQUFPLENBQVA7O0FBQ0EsY0FBTyxJQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsbUJBQUEsSUFBQTtBQ2tEQzs7QURqREgsVUFBQSxJQUFBLEdBQU8sS0FBQSxjQUFBLENBQWdCLEdBQUEsR0FBdkIsQ0FBTyxDQUFQOztBQUNBLGNBQUksSUFBQSxJQUFBLElBQUEsSUFBUyxLQUFBLGVBQUEsQ0FBQSxJQUFBLElBQUEsQ0FBQSxLQUFiLENBQUEsRUFBQTtBQUNFLG1CQUFBLElBQUE7QUFYSjtBQytERzs7QURuREgsZUFBTyxJQUFJLHNCQUFBLENBQUoscUJBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFvQyxLQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsSUFBQSxFQUF3QixJQUFBLEdBQUssS0FBQSxPQUFBLENBQXhFLE1BQTJDLENBQXBDLENBQVA7QUFiWTtBQTdESDtBQUFBO0FBQUEsZ0NBMkVGO0FBQUEsWUFBQyxLQUFELHVFQUFBLENBQUE7QUFDUCxZQUFBLFNBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQTtBQUFBLFFBQUEsR0FBQSxHQUFBLEtBQUE7O0FBQ0EsZUFBTSxDQUFBLEdBQUksS0FBQSxXQUFBLENBQUEsR0FBQSxFQUFrQixDQUFDLEtBQUQsT0FBQSxFQUE1QixJQUE0QixDQUFsQixDQUFWLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxDQUFDLENBQUQsR0FBQSxHQUFRLENBQUMsQ0FBRCxHQUFBLENBQWQsTUFBQTs7QUFDQSxjQUFHLENBQUMsQ0FBRCxHQUFBLEtBQVMsS0FBWixPQUFBLEVBQUE7QUFDRSxnQkFBRyxPQUFBLFNBQUEsS0FBQSxXQUFBLElBQUEsU0FBQSxLQUFILElBQUEsRUFBQTtBQUNFLHFCQUFPLElBQUksc0JBQUEsQ0FBSixxQkFBQSxDQUFBLElBQUEsRUFBQSxTQUFBLEVBQTJDLEtBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSxTQUFBLEVBQThCLENBQUMsQ0FBRCxHQUFBLEdBQU0sS0FBQSxPQUFBLENBQXRGLE1BQWtELENBQTNDLENBQVA7QUFERixhQUFBLE1BQUE7QUFHRSxjQUFBLFNBQUEsR0FBWSxDQUFDLENBQWIsR0FBQTtBQUpKO0FBQUEsV0FBQSxNQUFBO0FBTUUsWUFBQSxTQUFBLEdBQUEsSUFBQTtBQ3lEQztBRGpFTDs7QUNtRUUsZUQxREYsSUMwREU7QURyRUs7QUEzRUU7QUFBQTtBQUFBLHdDQXVGTTtBQUFBLFlBQUMsR0FBRCx1RUFBQSxDQUFBO0FBQ2YsWUFBQSxhQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxDQUFBO0FBQUEsUUFBQSxJQUFBLEdBQUEsR0FBQTtBQUNBLFFBQUEsYUFBQSxHQUFnQixLQUFBLE9BQUEsR0FBVyxLQUEzQixTQUFBOztBQUNBLGVBQU0sQ0FBQSxDQUFBLEdBQUEsS0FBQSxRQUFBLENBQUEsSUFBQSxFQUFBLGFBQUEsQ0FBQSxLQUFOLElBQUEsRUFBQTtBQUNFLGNBQUcsR0FBQSxHQUFNLEtBQUEsWUFBQSxDQUFjLENBQUEsR0FBRSxhQUFhLENBQXRDLE1BQVMsQ0FBVCxFQUFBO0FBQ0UsWUFBQSxJQUFBLEdBQU8sR0FBRyxDQUFWLFNBQU8sRUFBUDs7QUFDQSxnQkFBRyxHQUFHLENBQUgsR0FBQSxHQUFILEdBQUEsRUFBQTtBQUNFLHFCQUFBLEdBQUE7QUFISjtBQUFBLFdBQUEsTUFBQTtBQUtFLFlBQUEsSUFBQSxHQUFPLENBQUEsR0FBRSxhQUFhLENBQXRCLE1BQUE7QUMrREM7QURyRUw7O0FDdUVFLGVEaEVGLElDZ0VFO0FEMUVhO0FBdkZOO0FBQUE7QUFBQSx3Q0FrR1EsR0FsR1IsRUFrR1E7QUFDakIsZUFBTyxLQUFBLE1BQUEsQ0FBQSxVQUFBLENBQW1CLEdBQUEsR0FBSSxLQUFBLE9BQUEsQ0FBdkIsTUFBQSxFQUFBLEdBQUEsTUFBK0MsS0FBdEQsT0FBQTtBQURpQjtBQWxHUjtBQUFBO0FBQUEsd0NBb0dRLEdBcEdSLEVBb0dRO0FBQ2pCLGVBQU8sS0FBQSxNQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsRUFBdUIsR0FBQSxHQUFJLEtBQUEsT0FBQSxDQUEzQixNQUFBLE1BQStDLEtBQXRELE9BQUE7QUFEaUI7QUFwR1I7QUFBQTtBQUFBLHNDQXNHTSxLQXRHTixFQXNHTTtBQUNmLFlBQUEsQ0FBQTtBQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUE7O0FBQ0EsZUFBTSxDQUFBLEtBQUEsR0FBQSxLQUFBLGNBQUEsQ0FBQSxLQUFBLENBQUEsS0FBTixJQUFBLEVBQUE7QUFDRSxVQUFBLENBQUE7QUFERjs7QUFFQSxlQUFBLENBQUE7QUFKZTtBQXRHTjtBQUFBO0FBQUEsZ0NBMkdBLEdBM0dBLEVBMkdBO0FBQ1QsZUFBTyxLQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsR0FBQSxFQUF1QixHQUFBLEdBQXZCLENBQUEsTUFBQSxJQUFBLElBQXlDLEdBQUEsR0FBQSxDQUFBLElBQVcsS0FBQSxNQUFBLENBQTNELE9BQTJELEVBQTNEO0FBRFM7QUEzR0E7QUFBQTtBQUFBLHFDQTZHSyxLQTdHTCxFQTZHSztBQUNkLGVBQU8sS0FBQSxjQUFBLENBQUEsS0FBQSxFQUFzQixDQUE3QixDQUFPLENBQVA7QUFEYztBQTdHTDtBQUFBO0FBQUEscUNBK0dLLEtBL0dMLEVBK0dLO0FBQUEsWUFBTyxTQUFQLHVFQUFBLENBQUE7QUFDZCxZQUFBLENBQUE7QUFBQSxRQUFBLENBQUEsR0FBSSxLQUFBLFdBQUEsQ0FBQSxLQUFBLEVBQW9CLENBQUMsS0FBRCxPQUFBLEVBQXBCLElBQW9CLENBQXBCLEVBQUosU0FBSSxDQUFKOztBQUVBLFlBQVMsQ0FBQSxJQUFNLENBQUMsQ0FBRCxHQUFBLEtBQVMsS0FBeEIsT0FBQSxFQUFBO0FDK0VJLGlCRC9FSixDQUFDLENBQUMsR0MrRUU7QUFDRDtBRG5GVztBQS9HTDtBQUFBO0FBQUEsK0JBbUhELEtBbkhDLEVBbUhELE1BbkhDLEVBbUhEO0FBQ1IsZUFBTyxLQUFBLFFBQUEsQ0FBQSxLQUFBLEVBQUEsTUFBQSxFQUF1QixDQUE5QixDQUFPLENBQVA7QUFEUTtBQW5IQztBQUFBO0FBQUEsK0JBcUhELEtBckhDLEVBcUhELE1BckhDLEVBcUhEO0FBQUEsWUFBYyxTQUFkLHVFQUFBLENBQUE7QUFDUixZQUFBLENBQUE7QUFBQSxRQUFBLENBQUEsR0FBSSxLQUFBLFdBQUEsQ0FBQSxLQUFBLEVBQW9CLENBQXBCLE1BQW9CLENBQXBCLEVBQUosU0FBSSxDQUFKOztBQUNBLFlBQUEsQ0FBQSxFQUFBO0FDc0ZJLGlCRHRGSixDQUFDLENBQUMsR0NzRkU7QUFDRDtBRHpGSztBQXJIQztBQUFBO0FBQUEsa0NBeUhFLEtBekhGLEVBeUhFLE9BekhGLEVBeUhFO0FBQUEsWUFBZSxTQUFmLHVFQUFBLENBQUE7QUFDWCxlQUFPLEtBQUEsTUFBQSxDQUFBLFdBQUEsQ0FBQSxLQUFBLEVBQUEsT0FBQSxFQUFQLFNBQU8sQ0FBUDtBQURXO0FBekhGO0FBQUE7QUFBQSx1Q0E0SE8sUUE1SFAsRUE0SE8sT0E1SFAsRUE0SE8sT0E1SFAsRUE0SE87QUFBQSxZQUEwQixTQUExQix1RUFBQSxDQUFBO0FBQ2hCLFlBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBO0FBQUEsUUFBQSxHQUFBLEdBQUEsUUFBQTtBQUNBLFFBQUEsTUFBQSxHQUFBLENBQUE7O0FBQ0EsZUFBTSxDQUFBLEdBQUksS0FBQSxXQUFBLENBQUEsR0FBQSxFQUFpQixDQUFBLE9BQUEsRUFBakIsT0FBaUIsQ0FBakIsRUFBVixTQUFVLENBQVYsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFNLENBQUMsQ0FBRCxHQUFBLElBQVksU0FBQSxHQUFBLENBQUEsR0FBbUIsQ0FBQyxDQUFELEdBQUEsQ0FBbkIsTUFBQSxHQUFsQixDQUFNLENBQU47O0FBQ0EsY0FBRyxDQUFDLENBQUQsR0FBQSxNQUFhLFNBQUEsR0FBQSxDQUFBLEdBQUEsT0FBQSxHQUFoQixPQUFHLENBQUgsRUFBQTtBQUNFLGdCQUFHLE1BQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxjQUFBLE1BQUE7QUFERixhQUFBLE1BQUE7QUFHRSxxQkFBQSxDQUFBO0FBSko7QUFBQSxXQUFBLE1BQUE7QUFNRSxZQUFBLE1BQUE7QUM0RkM7QURwR0w7O0FDc0dFLGVEN0ZGLElDNkZFO0FEekdjO0FBNUhQO0FBQUE7QUFBQSxpQ0F5SUMsR0F6SUQsRUF5SUM7QUFDVixZQUFBLFlBQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxJQUFJLGNBQUEsQ0FBSixhQUFBLENBQU4sR0FBTSxDQUFOO0FBQ0EsUUFBQSxZQUFBLEdBQWUsR0FBRyxDQUFILElBQUEsQ0FBUyxLQUFULE9BQUEsRUFBa0IsS0FBbEIsT0FBQSxFQUFBLEdBQUEsQ0FBaUMsVUFBQSxDQUFBLEVBQUE7QUNpRzVDLGlCRGpHaUQsQ0FBQyxDQUFELGFBQUEsRUNpR2pEO0FEakdKLFNBQWUsQ0FBZjtBQ21HRSxlRGxHRixLQUFBLE1BQUEsQ0FBQSxpQkFBQSxDQUFBLFlBQUEsQ0NrR0U7QURyR1E7QUF6SUQ7QUFBQTtBQUFBLHVDQTZJTyxVQTdJUCxFQTZJTztBQUNoQixZQUF3QixLQUFBLFlBQUEsSUFBeEIsSUFBQSxFQUFBO0FBQUEsZUFBQSxZQUFBLENBQUEsSUFBQTtBQ3NHRzs7QUFDRCxlRHRHRixLQUFBLFlBQUEsR0FBZ0IsYUFBQSxDQUFBLFlBQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxLQUFBLEVDc0dkO0FEeEdjO0FBN0lQO0FBQUE7QUFBQSxpQ0FnSkQ7QUFBQSxZQUFDLFNBQUQsdUVBQUEsSUFBQTtBQUNSLFlBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTs7QUFBQSxZQUFHLEtBQUEsTUFBQSxHQUFILEdBQUEsRUFBQTtBQUNFLGdCQUFBLDRCQUFBO0FDMEdDOztBRHpHSCxRQUFBLEdBQUEsR0FBQSxDQUFBOztBQUNBLGVBQU0sR0FBQSxHQUFNLEtBQUEsT0FBQSxDQUFaLEdBQVksQ0FBWixFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFULFNBQU0sRUFBTjtBQUNBLGVBQUEsTUFBQSxDQUFBLFlBQUEsQ0FGRixHQUVFLEVBRkYsQ0M2R0k7O0FEekdGLFVBQUEsR0FBRyxDQUFILElBQUE7O0FBQ0EsY0FBRyxTQUFBLElBQWMsR0FBQSxDQUFBLE9BQUEsSUFBZCxJQUFBLEtBQWlDLEdBQUEsQ0FBQSxNQUFBLE1BQUEsSUFBQSxJQUFpQixDQUFDLEdBQUcsQ0FBSCxTQUFBLENBQXRELGlCQUFzRCxDQUFuRCxDQUFILEVBQUE7QUFDRSxZQUFBLE1BQUEsR0FBUyxJQUFBLFFBQUEsQ0FBYSxJQUFJLFdBQUEsQ0FBSixVQUFBLENBQWUsR0FBRyxDQUEvQixPQUFhLENBQWIsRUFBMEM7QUFBQyxjQUFBLE1BQUEsRUFBUTtBQUFULGFBQTFDLENBQVQ7QUFDQSxZQUFBLEdBQUcsQ0FBSCxPQUFBLEdBQWMsTUFBTSxDQUFwQixRQUFjLEVBQWQ7QUM2R0M7O0FENUdILFVBQUEsR0FBQSxHQUFPLEdBQUcsQ0FBVixPQUFPLEVBQVA7O0FBQ0EsY0FBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZ0JBQUcsR0FBQSxDQUFBLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxvQkFBTSxJQUFBLEtBQUEsQ0FBTix5Q0FBTSxDQUFOO0FDOEdDOztBRDdHSCxnQkFBRyxHQUFBLENBQUEsVUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGNBQUEsR0FBQSxHQUFNLEdBQUcsQ0FBVCxVQUFBO0FBREYsYUFBQSxNQUFBO0FBR0UsY0FBQSxHQUFBLEdBQU0sS0FBQSxNQUFBLENBQUEsWUFBQSxHQUFOLEdBQUE7QUFOSjtBQ3NIRztBRC9ITDs7QUFnQkEsZUFBTyxLQUFQLE9BQU8sRUFBUDtBQXBCUTtBQWhKQztBQUFBO0FBQUEsZ0NBcUtGO0FBQ1AsZUFBTyxLQUFBLE1BQUEsQ0FBUCxJQUFPLEVBQVA7QUFETztBQXJLRTtBQUFBO0FBQUEsK0JBdUtIO0FBQ04sZUFBUSxLQUFBLE1BQUEsSUFBQSxJQUFBLEtBQWUsS0FBQSxVQUFBLElBQUEsSUFBQSxJQUFpQixLQUFBLFVBQUEsQ0FBQSxNQUFBLElBQXhDLElBQVEsQ0FBUjtBQURNO0FBdktHO0FBQUE7QUFBQSxnQ0F5S0Y7QUFDUCxZQUFHLEtBQUgsTUFBRyxFQUFILEVBQUE7QUFDRSxpQkFBQSxJQUFBO0FBREYsU0FBQSxNQUVLLElBQUcsS0FBQSxNQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0gsaUJBQU8sS0FBQSxNQUFBLENBQVAsT0FBTyxFQUFQO0FBREcsU0FBQSxNQUVBLElBQUcsS0FBQSxVQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0gsaUJBQU8sS0FBQSxVQUFBLENBQUEsUUFBQSxDQUFQLE9BQU8sRUFBUDtBQ3dIQztBRDlISTtBQXpLRTtBQUFBO0FBQUEsbUNBZ0xHLEdBaExILEVBZ0xHO0FBQ1osZUFBTyxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQThCLEtBQXJDLFVBQU8sQ0FBUDtBQURZO0FBaExIO0FBQUE7QUFBQSxtQ0FrTEcsR0FsTEgsRUFrTEc7QUFDWixlQUFPLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUFBLEdBQUEsRUFBOEIsS0FBckMsVUFBTyxDQUFQO0FBRFk7QUFsTEg7QUFBQTtBQUFBLGtDQW9MQTtBQUFBLFlBQUMsS0FBRCx1RUFBQSxHQUFBO0FBQ1QsZUFBTyxJQUFBLE1BQUEsQ0FBVyxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBMEIsS0FBckMsTUFBVyxDQUFYLEVBQVAsS0FBTyxDQUFQO0FBRFM7QUFwTEE7QUFBQTtBQUFBLG9DQXNMSSxJQXRMSixFQXNMSTtBQUNiLGVBQU8sSUFBSSxDQUFKLE9BQUEsQ0FBYSxLQUFiLFNBQWEsRUFBYixFQUFQLEVBQU8sQ0FBUDtBQURhO0FBdExKO0FBQUE7QUFBQSw2QkF5TEo7QUFDTCxZQUFBLENBQU8sS0FBUCxNQUFBLEVBQUE7QUFDRSxlQUFBLE1BQUEsR0FBQSxJQUFBOztBQUNBLFVBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBOztBQ2tJRSxpQkRqSUYsUUFBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLEVDaUlFO0FBQ0Q7QUR0SUU7QUF6TEk7O0FBQUE7QUFBQTs7QUFBTjtBQStMTCxFQUFBLFFBQUMsQ0FBRCxNQUFBLEdBQUEsS0FBQTtBQ3VJQSxTQUFBLFFBQUE7QUR0VVcsQ0FBQSxDQUFBLElBQUEsQ0FBQSxLQUFiLENBQWEsQ0FBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVUQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsV0FBQSxDQUFBOztBQUNBLElBQUEsUUFBQSxHQUFBLE9BQUEsQ0FBQSxXQUFBLENBQUE7O0FBQ0EsSUFBQSxnQkFBQSxHQUFBLE9BQUEsQ0FBQSwyQkFBQSxDQUFBOztBQUZBLElBQUEsT0FBQTs7QUFLQSxPQUFBLEdBQVUsaUJBQUEsR0FBQSxFQUFBLElBQUEsRUFBQTtBQUFBLE1BQVUsTUFBVix1RUFBQSxJQUFBOztBQ1NSO0FEUE8sTUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FDU0wsV0RUeUIsSUFBSyxDQUFBLEdBQUEsQ0NTOUI7QURUSyxHQUFBLE1BQUE7QUNXTCxXRFh3QyxNQ1d4QztBQUNEO0FEZEgsQ0FBQTs7QUFLQSxJQUFhLE9BQUEsR0FBQSxZQUFBO0FBQUEsTUFBTixPQUFNO0FBQUE7QUFBQTtBQUNYLHFCQUFhLEtBQWIsRUFBYTtBQUFBLFVBQUEsS0FBQSx1RUFBQSxJQUFBO0FBQUEsVUFBa0IsTUFBbEIsdUVBQUEsSUFBQTs7QUFBQTs7QUFBQyxXQUFBLElBQUEsR0FBQSxLQUFBO0FBQU0sV0FBQSxJQUFBLEdBQUEsS0FBQTtBQUNsQixXQUFBLElBQUEsR0FBQSxFQUFBO0FBQ0EsV0FBQSxTQUFBLEdBQUEsRUFBQTtBQUNBLFdBQUEsWUFBQSxHQUFnQixLQUFBLFdBQUEsR0FBZSxLQUFBLFNBQUEsR0FBYSxLQUFBLE9BQUEsR0FBVyxLQUFBLEdBQUEsR0FBdkQsSUFBQTtBQUNBLFdBQUEsT0FBQSxHQUFBLElBQUE7QUFDQSxXQUFBLFFBQUEsR0FBWSxLQUFaLElBQUE7QUFDQSxXQUFBLEtBQUEsR0FBQSxDQUFBO0FBTlcsaUJBT1ksQ0FBQSxJQUFBLEVBQXZCLEtBQXVCLENBUFo7QUFPVixXQUFELE9BUFc7QUFPQSxXQUFYLE9BUFc7QUFRWCxXQUFBLFNBQUEsQ0FBQSxNQUFBO0FBQ0EsV0FBQSxRQUFBLEdBQUEsRUFBQTtBQUVBLFdBQUEsY0FBQSxHQUFrQjtBQUNoQixRQUFBLFdBQUEsRUFEZ0IsSUFBQTtBQUVoQixRQUFBLFdBQUEsRUFGZ0IsSUFBQTtBQUdoQixRQUFBLEtBQUEsRUFIZ0IsS0FBQTtBQUloQixRQUFBLGFBQUEsRUFKZ0IsSUFBQTtBQUtoQixRQUFBLFdBQUEsRUFMZ0IsSUFBQTtBQU1oQixRQUFBLGVBQUEsRUFOZ0IsS0FBQTtBQU9oQixRQUFBLFVBQUEsRUFQZ0IsS0FBQTtBQVFoQixRQUFBLFlBQUEsRUFBYztBQVJFLE9BQWxCO0FBVUEsV0FBQSxPQUFBLEdBQUEsRUFBQTtBQUNBLFdBQUEsWUFBQSxHQUFBLElBQUE7QUF0Qlc7O0FBREY7QUFBQTtBQUFBLCtCQXdCSDtBQUNOLGVBQU8sS0FBUCxPQUFBO0FBRE07QUF4Qkc7QUFBQTtBQUFBLGdDQTBCQSxLQTFCQSxFQTBCQTtBQUNULFlBQUcsS0FBQSxPQUFBLEtBQUgsS0FBQSxFQUFBO0FBQ0UsZUFBQSxPQUFBLEdBQUEsS0FBQTtBQUNBLGVBQUEsUUFBQSxHQUNLLEtBQUEsT0FBQSxJQUFBLElBQUEsSUFBYyxLQUFBLE9BQUEsQ0FBQSxJQUFBLElBQWQsSUFBQSxHQUNELEtBQUEsT0FBQSxDQUFBLFFBQUEsR0FBQSxHQUFBLEdBQTBCLEtBRHpCLElBQUEsR0FHRCxLQUpKLElBQUE7QUNtQkUsaUJEYkYsS0FBQSxLQUFBLEdBQ0ssS0FBQSxPQUFBLElBQUEsSUFBQSxJQUFjLEtBQUEsT0FBQSxDQUFBLEtBQUEsSUFBZCxJQUFBLEdBQ0UsS0FBQSxPQUFBLENBQUEsS0FBQSxHQURGLENBQUEsR0FFRSxDQ1VMO0FBQ0Q7QUR2Qk07QUExQkE7QUFBQTtBQUFBLDZCQXdDTDtBQUNKLFlBQUcsQ0FBQyxLQUFKLE9BQUEsRUFBQTtBQUNFLGVBQUEsT0FBQSxHQUFBLElBQUE7QUFDQSxlQUFBLFNBQUEsQ0FBVyxLQUFYLElBQUE7QUNhQzs7QURaSCxlQUFBLElBQUE7QUFKSTtBQXhDSztBQUFBO0FBQUEsbUNBNkNDO0FDZ0JSLGVEZkYsS0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0NlRTtBRGhCUTtBQTdDRDtBQUFBO0FBQUEsbUNBK0NDO0FBQ1YsZUFBTyxLQUFBLFNBQUEsSUFBQSxJQUFBLElBQWUsS0FBQSxPQUFBLElBQXRCLElBQUE7QUFEVTtBQS9DRDtBQUFBO0FBQUEscUNBaURHO0FBQ1osWUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQTtBQUFBLFFBQUEsT0FBQSxHQUFVLEtBQVYsVUFBVSxFQUFWOztBQUNBLFlBQUcsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLE9BQU8sQ0FBUCxJQUFBLEdBQVAsWUFBTyxFQUFQO0FDcUJDOztBRHBCSCxRQUFBLEdBQUEsR0FBQSxDQUFBLFdBQUEsRUFBQSxhQUFBLEVBQUEsS0FBQSxFQUFBLGNBQUEsQ0FBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQ3VCSSxVQUFBLENBQUMsR0FBRyxHQUFHLENBQVAsQ0FBTyxDQUFQOztBRHRCRixjQUFHLEtBQUEsQ0FBQSxLQUFILElBQUEsRUFBQTtBQUNFLG1CQUFBLElBQUE7QUN3QkM7QUQxQkw7O0FBR0EsZUFBQSxLQUFBO0FBUFk7QUFqREg7QUFBQTtBQUFBLDJDQXlEVyxJQXpEWCxFQXlEVztBQUNwQixZQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTs7QUFBQSxZQUFHLEtBQUEsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsT0FBQSxHQUFVLElBQUksUUFBQSxDQUFkLE9BQVUsRUFBVjtBQUNBLFVBQUEsT0FBQSxHQUFVLEtBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLEVBQVYsSUFBVSxDQUFWO0FBQ0EsVUFBQSxPQUFBLEdBQVUsS0FBQSxrQkFBQSxDQUFvQixPQUFPLENBQVAsU0FBQSxDQUE5QixPQUE4QixDQUFwQixDQUFWOztBQUNBLGNBQUcsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLG1CQUFPLE9BQU8sQ0FBUCxJQUFBLEdBQVAsWUFBTyxFQUFQO0FDNkJDOztBRDVCSCxpQkFBQSxLQUFBO0FDOEJDOztBRDdCSCxlQUFPLEtBQVAsWUFBTyxFQUFQO0FBUm9CO0FBekRYO0FBQUE7QUFBQSwwQ0FrRVE7QUFDakIsWUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQTtBQUFBLFFBQUEsT0FBQSxHQUFVLEtBQVYsVUFBVSxFQUFWOztBQUNBLFlBQUcsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLE9BQU8sQ0FBZCxpQkFBTyxFQUFQO0FDa0NDOztBRGpDSCxRQUFBLEdBQUEsR0FBQSxDQUFBLFdBQUEsRUFBQSxhQUFBLENBQUE7O0FBQUEsYUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNvQ0ksVUFBQSxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQU8sQ0FBUDs7QURuQ0YsY0FBRyxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxtQkFBQSxJQUFBO0FDcUNDO0FEdkNMOztBQUdBLGVBQUEsS0FBQTtBQVBpQjtBQWxFUjtBQUFBO0FBQUEsb0NBMEVFO0FBQ1gsWUFBQSxPQUFBLEVBQUEsR0FBQTtBQUFBLFFBQUEsR0FBQSxHQUFBLEVBQUE7QUFDQSxRQUFBLE9BQUEsR0FBVSxLQUFWLFVBQVUsRUFBVjs7QUFDQSxZQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsT0FBTyxDQUEvQixXQUF3QixFQUFsQixDQUFOO0FDMENDOztBRHpDSCxRQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsS0FBeEIsUUFBTSxDQUFOO0FBQ0EsZUFBQSxHQUFBO0FBTlc7QUExRUY7QUFBQTtBQUFBLHlDQWlGUyxNQWpGVCxFQWlGUztBQUNoQixRQUFBLE1BQU0sQ0FBTixZQUFBLEdBQUEsS0FBQTtBQUNBLFFBQUEsTUFBTSxDQUFOLFdBQUEsR0FBQSxLQUFBO0FBQ0EsUUFBQSxNQUFNLENBQU4sWUFBQSxHQUFBLEtBQUE7QUFDQSxlQUFPLE1BQU0sQ0FBYixJQUFPLEVBQVA7QUFKZ0I7QUFqRlQ7QUFBQTtBQUFBLG1DQXNGQztBQUNWLFlBQUEsT0FBQTs7QUFBQSxZQUFHLEtBQUEsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsT0FBQSxHQUFVLElBQUksUUFBQSxDQUFkLE9BQVUsRUFBVjtBQUNBLGlCQUFPLEtBQUEsa0JBQUEsQ0FBb0IsT0FBTyxDQUFQLFNBQUEsQ0FBa0IsS0FBN0MsT0FBMkIsQ0FBcEIsQ0FBUDtBQ2dEQztBRG5ETztBQXRGRDtBQUFBO0FBQUEsaUNBMEZDLElBMUZELEVBMEZDO0FBQ1YsWUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUE7QUFBQSxRQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGFBQUEsR0FBQSxJQUFBLElBQUEsRUFBQTtBQ3FESSxVQUFBLEdBQUcsR0FBRyxJQUFJLENBQVYsR0FBVSxDQUFWOztBRHBERixjQUFHLEdBQUEsSUFBTyxLQUFWLGNBQUEsRUFBQTtBQ3NESSxZQUFBLE9BQU8sQ0FBUCxJQUFBLENEckRGLEtBQUEsT0FBQSxDQUFBLEdBQUEsSUFBZ0IsR0NxRGQ7QUR0REosV0FBQSxNQUFBO0FDd0RJLFlBQUEsT0FBTyxDQUFQLElBQUEsQ0FBYSxLQUFiLENBQUE7QUFDRDtBRDFETDs7QUM0REUsZUFBQSxPQUFBO0FEN0RRO0FBMUZEO0FBQUE7QUFBQSx5Q0E4RlMsT0E5RlQsRUE4RlM7QUFDbEIsWUFBQSxHQUFBO0FBQUEsUUFBQSxHQUFBLEdBQUEsRUFBQTtBQUNBLFFBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBTixNQUFBLENBQUEsR0FBQSxFQUFrQixLQUF4QixjQUFNLENBQU47O0FBQ0EsWUFBRyxPQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFOLE1BQUEsQ0FBQSxHQUFBLEVBQWtCLE9BQU8sQ0FBL0IsVUFBd0IsRUFBbEIsQ0FBTjtBQzhEQzs7QUQ3REgsZUFBTyxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsS0FBekIsT0FBTyxDQUFQO0FBTGtCO0FBOUZUO0FBQUE7QUFBQSxtQ0FvR0M7QUFDVixlQUFPLEtBQUEsa0JBQUEsQ0FBb0IsS0FBM0IsVUFBMkIsRUFBcEIsQ0FBUDtBQURVO0FBcEdEO0FBQUE7QUFBQSxnQ0FzR0EsR0F0R0EsRUFzR0E7QUFDVCxZQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBVSxLQUFWLFVBQVUsRUFBVjs7QUFDQSxZQUFHLEdBQUEsSUFBSCxPQUFBLEVBQUE7QUFDRSxpQkFBTyxPQUFRLENBQWYsR0FBZSxDQUFmO0FDb0VDO0FEdkVNO0FBdEdBO0FBQUE7QUFBQSw2QkEwR0w7QUFDSixZQUFBLEdBQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxLQUFBLE1BQUEsQ0FBTixNQUFNLENBQU47O0FBQ0EsWUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sR0FBRyxDQUFILElBQUEsR0FBUCxTQUFBO0FDd0VDO0FEM0VDO0FBMUdLO0FBQUE7QUFBQSxnQ0E4R0EsSUE5R0EsRUE4R0E7QUFDVCxhQUFBLElBQUEsR0FBQSxJQUFBOztBQUNBLFlBQUcsT0FBQSxJQUFBLEtBQUgsUUFBQSxFQUFBO0FBQ0UsZUFBQSxTQUFBLEdBQUEsSUFBQTtBQUNBLGVBQUEsT0FBQSxDQUFBLE9BQUEsSUFBQSxJQUFBO0FBQ0EsaUJBQUEsSUFBQTtBQUhGLFNBQUEsTUFJSyxJQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDSCxpQkFBTyxLQUFBLGFBQUEsQ0FBUCxJQUFPLENBQVA7QUMyRUM7O0FEMUVILGVBQUEsS0FBQTtBQVJTO0FBOUdBO0FBQUE7QUFBQSxvQ0F1SEksSUF2SEosRUF1SEk7QUFDYixZQUFBLE9BQUEsRUFBQSxHQUFBO0FBQUEsUUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFBLFFBQUEsRUFBTixJQUFNLENBQU47O0FBQ0EsWUFBRyxPQUFBLEdBQUEsS0FBSCxVQUFBLEVBQUE7QUFDRSxlQUFBLFdBQUEsR0FBQSxHQUFBO0FBREYsU0FBQSxNQUVLLElBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNILGVBQUEsU0FBQSxHQUFBLEdBQUE7QUFDQSxlQUFBLE9BQUEsQ0FBQSxPQUFBLElBQUEsSUFBQTtBQytFQzs7QUQ5RUgsUUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFBLFNBQUEsRUFBVixJQUFVLENBQVY7O0FBQ0EsWUFBRyxPQUFBLE9BQUEsS0FBSCxVQUFBLEVBQUE7QUFDRSxlQUFBLFlBQUEsR0FBQSxPQUFBO0FDZ0ZDOztBRC9FSCxhQUFBLE9BQUEsR0FBVyxPQUFBLENBQUEsU0FBQSxFQUFYLElBQVcsQ0FBWDtBQUNBLGFBQUEsR0FBQSxHQUFPLE9BQUEsQ0FBQSxLQUFBLEVBQVAsSUFBTyxDQUFQO0FBQ0EsYUFBQSxRQUFBLEdBQVksT0FBQSxDQUFBLFVBQUEsRUFBQSxJQUFBLEVBQXdCLEtBQXBDLFFBQVksQ0FBWjtBQUVBLGFBQUEsVUFBQSxDQUFBLElBQUE7O0FBRUEsWUFBRyxVQUFILElBQUEsRUFBQTtBQUNFLGVBQUEsTUFBQSxDQUFRLElBQUEsT0FBQSxDQUFBLE1BQUEsRUFBbUIsSUFBSyxDQUF4QixNQUF3QixDQUF4QixFQUFSLElBQVEsQ0FBUjtBQytFQzs7QUQ5RUgsWUFBRyxjQUFILElBQUEsRUFBQTtBQUNFLGVBQUEsTUFBQSxDQUFRLElBQUEsT0FBQSxDQUFBLFVBQUEsRUFBdUIsSUFBSyxDQUE1QixVQUE0QixDQUE1QixFQUFSLElBQVEsQ0FBUjtBQ2dGQzs7QUQ5RUgsWUFBRyxVQUFILElBQUEsRUFBQTtBQUNFLGVBQUEsT0FBQSxDQUFTLElBQUssQ0FBZCxNQUFjLENBQWQ7QUNnRkM7O0FEL0VILGVBQUEsSUFBQTtBQXZCYTtBQXZISjtBQUFBO0FBQUEsOEJBK0lGLElBL0lFLEVBK0lGO0FBQ1AsWUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGFBQUEsSUFBQSxJQUFBLElBQUEsRUFBQTtBQ3FGSSxVQUFBLElBQUksR0FBRyxJQUFJLENBQVgsSUFBVyxDQUFYO0FBQ0EsVUFBQSxPQUFPLENBQVAsSUFBQSxDRHJGRixLQUFBLE1BQUEsQ0FBUSxJQUFBLE9BQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFSLElBQVEsQ0FBUixDQ3FGRTtBRHRGSjs7QUN3RkUsZUFBQSxPQUFBO0FEekZLO0FBL0lFO0FBQUE7QUFBQSw2QkFrSkgsR0FsSkcsRUFrSkg7QUFDTixZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxLQUFBLE1BQUEsQ0FBUSxHQUFHLENBQXBCLElBQVMsQ0FBVDs7QUFDQSxZQUFHLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFBLFNBQUEsQ0FBQSxNQUFBO0FDMkZDOztBRDFGSCxRQUFBLEdBQUcsQ0FBSCxTQUFBLENBQUEsSUFBQTtBQUNBLGFBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBO0FBQ0EsZUFBQSxHQUFBO0FBTk07QUFsSkc7QUFBQTtBQUFBLGdDQXlKQSxHQXpKQSxFQXlKQTtBQUNULFlBQUEsQ0FBQTs7QUFBQSxZQUFHLENBQUMsQ0FBQSxHQUFJLEtBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBTCxHQUFLLENBQUwsSUFBMkIsQ0FBOUIsQ0FBQSxFQUFBO0FBQ0UsZUFBQSxJQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBO0FDK0ZDOztBRDlGSCxlQUFBLEdBQUE7QUFIUztBQXpKQTtBQUFBO0FBQUEsNkJBNkpILFFBN0pHLEVBNkpIO0FBQ04sWUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxLQUFBO0FBQUEsYUFBQSxJQUFBOztBQURNLG9DQUVTLGdCQUFBLENBQUEsZUFBQSxDQUFBLFVBQUEsQ0FBZixRQUFlLENBRlQ7O0FBQUE7O0FBRU4sUUFBQSxLQUZNO0FBRU4sUUFBQSxJQUZNOztBQUdOLFlBQUcsS0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFBLENBQUEsR0FBQSxHQUFBLEtBQUEsTUFBQSxDQUFBLEtBQUEsQ0FBQSxLQUFBLElBQUEsR0FBQSxHQUFxQixDQUFyQixNQUFBLENBQUEsSUFBQSxDQUFBLEdBQU8sS0FBUCxDQUFBO0FDbUdDOztBRGxHSCxRQUFBLElBQUEsR0FBQSxLQUFBLElBQUE7O0FBQUEsYUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNxR0ksVUFBQSxHQUFHLEdBQUcsSUFBSSxDQUFWLENBQVUsQ0FBVjs7QURwR0YsY0FBRyxHQUFHLENBQUgsSUFBQSxLQUFILElBQUEsRUFBQTtBQUNFLG1CQUFBLEdBQUE7QUNzR0M7QUR4R0w7QUFMTTtBQTdKRztBQUFBO0FBQUEsaUNBcUtDLFFBcktELEVBcUtDLElBcktELEVBcUtDO0FDMEdSLGVEekdGLEtBQUEsTUFBQSxDQUFBLFFBQUEsRUFBaUIsSUFBQSxPQUFBLENBQVksUUFBUSxDQUFSLEtBQUEsQ0FBQSxHQUFBLEVBQVosR0FBWSxFQUFaLEVBQWpCLElBQWlCLENBQWpCLENDeUdFO0FEMUdRO0FBcktEO0FBQUE7QUFBQSw2QkF1S0gsUUF2S0csRUF1S0gsR0F2S0csRUF1S0g7QUFDTixZQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQTs7QUFETSxxQ0FDUyxnQkFBQSxDQUFBLGVBQUEsQ0FBQSxVQUFBLENBQWYsUUFBZSxDQURUOztBQUFBOztBQUNOLFFBQUEsS0FETTtBQUNOLFFBQUEsSUFETTs7QUFFTixZQUFHLEtBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxLQUFBLE1BQUEsQ0FBUCxLQUFPLENBQVA7O0FBQ0EsY0FBTyxJQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsWUFBQSxJQUFBLEdBQU8sS0FBQSxNQUFBLENBQVEsSUFBQSxPQUFBLENBQWYsS0FBZSxDQUFSLENBQVA7QUM2R0M7O0FENUdILGlCQUFPLElBQUksQ0FBSixNQUFBLENBQUEsSUFBQSxFQUFQLEdBQU8sQ0FBUDtBQUpGLFNBQUEsTUFBQTtBQU1FLGVBQUEsTUFBQSxDQUFBLEdBQUE7QUFDQSxpQkFBQSxHQUFBO0FDOEdDO0FEdkhHO0FBdktHO0FBQUE7QUFBQSxrQ0FpTEUsUUFqTEYsRUFpTEU7QUNpSFQsZURoSEYsS0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBLFFBQUEsQ0NnSEU7QURqSFM7QUFqTEY7QUFBQTtBQUFBLGlDQXdMQTtBQUNULFlBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUE7QUFBQSxRQUFBLE9BQU8sQ0FBUCxJQUFBLEdBQWUsSUFBQSxPQUFBLENBQUEsSUFBQSxFQUFpQjtBQUM5QixrQkFBTztBQUNMLHFCQUFRO0FBQ04sY0FBQSxJQUFBLEVBRE0saU5BQUE7QUFNTixjQUFBLE1BQUEsRUFBUTtBQU5GO0FBREg7QUFEdUIsU0FBakIsQ0FBZjtBQVlBLFFBQUEsR0FBQSxHQUFBLEtBQUEsU0FBQTtBQUFBLFFBQUEsT0FBQSxHQUFBLEVBQUE7O0FBQUEsYUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUM2R0ksVUFBQSxRQUFRLEdBQUcsR0FBRyxDQUFkLENBQWMsQ0FBZDtBQUNBLFVBQUEsT0FBTyxDQUFQLElBQUEsQ0Q3R0YsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsT0FBTyxDQUF6QixJQUFBLENDNkdFO0FEOUdKOztBQ2dIRSxlQUFBLE9BQUE7QUQ3SE87QUF4TEE7QUFBQTtBQUFBLDhCQXdNRCxRQXhNQyxFQXdNRCxJQXhNQyxFQXdNRDtBQUFBOztBQ2lITixlRGhIRixPQUFPLENBQVAsT0FBQSxHQUFBLElBQUEsQ0FBdUIsWUFBQTtBQ2lIbkIsaUJEaEhGLE9BQU8sQ0FBUCxJQUFBLENBQUEsVUFBQSxDQUFBLFFBQUEsRUFBQSxJQUFBLENDZ0hFO0FEakhKLFNBQUEsRUFBQSxJQUFBLENBRU0sWUFBQTtBQ2lIRixpQkRoSEYsS0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBLENBQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLENDZ0hFO0FEbkhKLFNBQUEsQ0NnSEU7QURqSE07QUF4TUM7QUFBQTtBQUFBLGlDQThNQTtBQUFBOztBQ21IUCxlRGxIRixPQUFPLENBQVAsT0FBQSxHQUFBLElBQUEsQ0FBdUIsWUFBQTtBQUNyQixjQUFBLFNBQUE7QUNtSEUsaUJEbkhGLFNBQUEsR0FBWSxNQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLENDbUhWO0FEcEhKLFNBQUEsRUFBQSxJQUFBLENBRU8sVUFBQSxTQUFELEVBQUE7QUFDSixjQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsT0FBQTs7QUFBQSxjQUFHLFNBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxZQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGlCQUFBLFFBQUEsSUFBQSxTQUFBLEVBQUE7QUNzSEksY0FBQSxJQUFJLEdBQUcsU0FBUyxDQUFoQixRQUFnQixDQUFoQjtBQUNBLGNBQUEsT0FBTyxDQUFQLElBQUEsQ0R0SEYsT0FBTyxDQUFQLElBQUEsQ0FBQSxVQUFBLENBQUEsUUFBQSxFQUFBLElBQUEsQ0NzSEU7QUR2SEo7O0FDeUhFLG1CQUFBLE9BQUE7QUFDRDtBRDlITCxTQUFBLENDa0hFO0FEbkhPO0FBOU1BO0FBQUE7QUFBQSxtQ0FzTkU7QUM0SFQsZUQzSEYsS0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxFQUFBLENDMkhFO0FENUhTO0FBdE5GO0FBQUE7QUFBQSxpQ0F5TkcsSUF6TkgsRUF5Tkc7QUFBQSxZQUFNLElBQU4sdUVBQUEsRUFBQTs7QUFDWixRQUFBLElBQUksQ0FBSixPQUFBLEdBQWUsVUFBQSxRQUFBLEVBQUE7QUFDYixjQUFBLENBQUEsRUFBQSxHQUFBO0FBQUEsVUFBQSxHQUFBLEdBQVMsQ0FBQSxDQUFBLEdBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQSxJQUFBLEdBQUEsQ0FBQSxHQUVELFFBQVEsQ0FBUixPQUFBLEdBQ04sUUFBUSxDQURGLE9BQUEsR0FBSCxLQUZMLENBQUE7O0FBSUEsY0FBc0MsR0FBQSxJQUF0QyxJQUFBLEVBQUE7QUMySEksbUJEM0hKLFFBQVEsQ0FBUixRQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsSUFBK0IsR0MySDNCO0FBQ0Q7QURqSUwsU0FBQTs7QUFNQSxlQUFBLElBQUE7QUFQWTtBQXpOSDtBQUFBO0FBQUEscUNBa09PLElBbE9QLEVBa09PO0FBQUEsWUFBTSxJQUFOLHVFQUFBLEVBQUE7O0FBQ2hCLFFBQUEsSUFBSSxDQUFKLE9BQUEsR0FBZSxVQUFBLFFBQUEsRUFBQTtBQUNiLGNBQUEsQ0FBQSxFQUFBLEdBQUE7QUFBQSxVQUFBLEdBQUEsR0FBUyxDQUFBLENBQUEsR0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLElBQUEsR0FBQSxDQUFBLEdBRUQsUUFBUSxDQUFSLE9BQUEsR0FDTixRQUFRLENBREYsT0FBQSxHQUFILEtBRkwsQ0FBQTs7QUFJQSxjQUFBLEVBQU8sR0FBQSxJQUFBLElBQUEsS0FBUyxHQUFBLEtBQUEsR0FBQSxJQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsR0FBQSxLQUFoQixJQUFPLENBQVAsQ0FBQSxFQUFBO0FDNkhJLG1CRDVIRixRQUFRLENBQVIsUUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLElBQStCLElDNEg3QjtBQUNEO0FEbklMLFNBQUE7O0FBT0EsZUFBQSxJQUFBO0FBUmdCO0FBbE9QOztBQUFBO0FBQUE7O0FBQU47QUFvTEwsRUFBQSxPQUFDLENBQUQsU0FBQSxHQUFBLEVBQUE7QUFFQSxFQUFBLE9BQUMsQ0FBRCxPQUFBLEdBQVcsSUFBSSxRQUFBLENBQWYsT0FBVyxFQUFYO0FDMkxBLFNBQUEsT0FBQTtBRGpYVyxDQUFBLENBQUEsSUFBQSxDQUFBLEtBQWIsQ0FBYSxDQUFiOzs7O0FBNk9BLElBQWEsV0FBTjtBQUFBO0FBQUE7QUFDTCx1QkFBYSxTQUFiLEVBQWE7QUFBQTs7QUFBQyxTQUFBLFFBQUEsR0FBQSxTQUFBO0FBQUQ7O0FBRFI7QUFBQTtBQUFBLDJCQUVDLENBQUE7QUFGRDtBQUFBO0FBQUEsd0NBSWM7QUFDakIsYUFBTyxLQUFBLFFBQUEsS0FBUCxJQUFBO0FBRGlCO0FBSmQ7QUFBQTtBQUFBLGtDQU1RO0FBQ1gsYUFBQSxFQUFBO0FBRFc7QUFOUjtBQUFBO0FBQUEsaUNBUU87QUFDVixhQUFBLEVBQUE7QUFEVTtBQVJQOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFdlBBLElBQUEsVUFBQSxHQUFBLE9BQUEsQ0FBQSxhQUFBLENBQUE7O0FBQ0EsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLGVBQUEsQ0FBQTs7QUFDQSxJQUFBLFlBQUEsR0FBQSxPQUFBLENBQUEsdUJBQUEsQ0FBQTs7QUFGQSxJQUFBLE9BQUEsR0FBQSxHQUFBLE9BQUE7O0FBSUEsSUFBYSxPQUFOO0FBQUE7QUFBQTtBQUNMLG1CQUFhLFFBQWIsRUFBYTtBQUFBOztBQUFDLFNBQUEsUUFBQSxHQUFBLFFBQUE7QUFDWixTQUFBLFVBQUEsR0FBQSxFQUFBO0FBRFc7O0FBRFI7QUFBQTtBQUFBLGlDQUlTLElBSlQsRUFJUztBQUNaLFVBQUcsT0FBQSxDQUFBLElBQUEsQ0FBWSxLQUFaLFVBQUEsRUFBQSxJQUFBLElBQUgsQ0FBQSxFQUFBO0FBQ0UsYUFBQSxVQUFBLENBQUEsSUFBQSxDQUFBLElBQUE7QUNZQSxlRFhBLEtBQUEsV0FBQSxHQUFlLElDV2Y7QUFDRDtBRGZXO0FBSlQ7QUFBQTtBQUFBLGtDQVFVLE1BUlYsRUFRVTtBQUNiLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTs7QUFBQSxVQUFBLE1BQUEsRUFBQTtBQUNFLFlBQUcsT0FBQSxNQUFBLEtBQUgsUUFBQSxFQUFBO0FBQ0UsVUFBQSxNQUFBLEdBQVMsQ0FBVCxNQUFTLENBQVQ7QUNnQkQ7O0FEZkQsUUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLE1BQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQ2tCRSxVQUFBLEtBQUssR0FBRyxNQUFNLENBQWQsQ0FBYyxDQUFkO0FBQ0EsVUFBQSxPQUFPLENBQVAsSUFBQSxDRGxCQSxLQUFBLFlBQUEsQ0FBQSxLQUFBLENDa0JBO0FEbkJGOztBQ3FCQSxlQUFBLE9BQUE7QUFDRDtBRDFCWTtBQVJWO0FBQUE7QUFBQSxvQ0FjWSxJQWRaLEVBY1k7QUN3QmYsYUR2QkEsS0FBQSxVQUFBLEdBQWMsS0FBQSxVQUFBLENBQUEsTUFBQSxDQUFtQixVQUFBLENBQUEsRUFBQTtBQ3dCL0IsZUR4QnNDLENBQUEsS0FBTyxJQ3dCN0M7QUR4QlksT0FBQSxDQ3VCZDtBRHhCZTtBQWRaO0FBQUE7QUFBQSxvQ0FpQlU7QUFDYixVQUFBLElBQUE7O0FBQUEsVUFBTyxLQUFBLFdBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxDQUFBLE1BQUEsRUFBQSxNQUFBLENBQWdCLEtBQXZCLFVBQU8sQ0FBUDs7QUFDQSxZQUFHLEtBQUEsTUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsSUFBQSxHQUFPLElBQUksQ0FBSixNQUFBLENBQVksS0FBQSxNQUFBLENBQW5CLGFBQW1CLEVBQVosQ0FBUDtBQzRCRDs7QUQzQkQsYUFBQSxXQUFBLEdBQWUsWUFBQSxDQUFBLFdBQUEsQ0FBQSxNQUFBLENBQWYsSUFBZSxDQUFmO0FDNkJEOztBRDVCRCxhQUFPLEtBQVAsV0FBQTtBQU5hO0FBakJWO0FBQUE7QUFBQSwyQkF3QkcsT0F4QkgsRUF3Qkc7QUFBQSxVQUFTLE9BQVQsdUVBQUEsRUFBQTtBQUNOLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEtBQUEsU0FBQSxDQUFBLE9BQUEsRUFBVCxPQUFTLENBQVQ7QUFDQSxhQUFPLE1BQU0sQ0FBYixJQUFPLEVBQVA7QUFGTTtBQXhCSDtBQUFBO0FBQUEsOEJBMkJNLE9BM0JOLEVBMkJNO0FBQUEsVUFBUyxPQUFULHVFQUFBLEVBQUE7QUFDVCxhQUFPLElBQUksVUFBQSxDQUFKLFNBQUEsQ0FBQSxPQUFBLEVBQXVCLE1BQU0sQ0FBTixNQUFBLENBQWM7QUFDMUMsUUFBQSxVQUFBLEVBRDBDLEVBQUE7QUFFMUMsUUFBQSxZQUFBLEVBQWMsS0FGNEIsTUFFNUIsRUFGNEI7QUFHMUMsUUFBQSxRQUFBLEVBQVUsS0FIZ0MsUUFBQTtBQUkxQyxRQUFBLGFBQUEsRUFBZTtBQUoyQixPQUFkLEVBQTlCLE9BQThCLENBQXZCLENBQVA7QUFEUztBQTNCTjtBQUFBO0FBQUEsNkJBa0NHO0FBQ04sYUFBUSxLQUFBLE1BQUEsSUFBUixJQUFBO0FBRE07QUFsQ0g7QUFBQTtBQUFBLHNDQW9DWTtBQUNmLFVBQUcsS0FBQSxNQUFBLElBQUgsSUFBQSxFQUFBO0FDdUNFLGVEdENBLEtBQUMsTUNzQ0Q7QUR2Q0YsT0FBQSxNQUFBO0FDeUNFLGVEdENBLElDc0NBO0FBQ0Q7QUQzQ2M7QUFwQ1o7QUFBQTtBQUFBLGdDQXlDUSxHQXpDUixFQXlDUTtBQUNYLFVBQUEsRUFBQTtBQUFBLE1BQUEsRUFBQSxHQUFLLEtBQUwsY0FBSyxFQUFMOztBQUNBLFVBQUcsRUFBRSxDQUFGLE9BQUEsQ0FBQSxJQUFBLElBQW1CLENBQXRCLENBQUEsRUFBQTtBQUNFLGVBQU8sRUFBRSxDQUFGLE9BQUEsQ0FBQSxJQUFBLEVBQVAsR0FBTyxDQUFQO0FBREYsT0FBQSxNQUFBO0FBR0UsZUFBTyxFQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQVAsRUFBQTtBQzJDRDtBRGhEVTtBQXpDUjtBQUFBO0FBQUEsc0NBK0NZO0FBQUEsVUFBQyxHQUFELHVFQUFBLEVBQUE7QUFDZixVQUFBLEVBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssS0FBTCxjQUFLLEVBQUw7O0FBQ0EsVUFBRyxDQUFDLENBQUEsR0FBSSxFQUFFLENBQUYsT0FBQSxDQUFMLElBQUssQ0FBTCxJQUF5QixDQUE1QixDQUFBLEVBQUE7QUFDRSxlQUFPLEVBQUUsQ0FBRixNQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsSUFBUCxHQUFBO0FBREYsT0FBQSxNQUFBO0FBR0UsZUFBTyxFQUFBLEdBQUEsR0FBQSxHQUFQLEdBQUE7QUMrQ0Q7QURwRGM7QUEvQ1o7QUFBQTtBQUFBLHVDQXFEYTtBQUFBLFVBQUMsR0FBRCx1RUFBQSxFQUFBO0FBQ2hCLFVBQUEsRUFBQSxFQUFBLENBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxLQUFMLGNBQUssRUFBTDs7QUFDQSxVQUFHLENBQUMsQ0FBQSxHQUFJLEVBQUUsQ0FBRixPQUFBLENBQUwsSUFBSyxDQUFMLElBQXlCLENBQTVCLENBQUEsRUFBQTtBQUNFLGVBQU8sR0FBQSxHQUFNLEVBQUUsQ0FBRixNQUFBLENBQVUsQ0FBQSxHQUF2QixDQUFhLENBQWI7QUFERixPQUFBLE1BQUE7QUFHRSxlQUFPLEdBQUEsR0FBQSxHQUFBLEdBQVAsRUFBQTtBQ21ERDtBRHhEZTtBQXJEYjtBQUFBO0FBQUEsbUNBMkRXLEdBM0RYLEVBMkRXO0FBQ2QsYUFBTyxJQUFJLFlBQUEsQ0FBSixXQUFBLENBQUEsR0FBQSxFQUFQLElBQU8sQ0FBUDtBQURjO0FBM0RYO0FBQUE7QUFBQSxxQ0E2RFc7QUFDZCxVQUFBLEtBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUE7O0FBQUEsVUFBRyxLQUFBLFdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLEtBQVAsV0FBQTtBQ3lERDs7QUR4REQsTUFBQSxHQUFBLEdBQU0sS0FBQSxNQUFBLENBQU4sU0FBTSxDQUFOO0FBQ0EsTUFBQSxLQUFBLEdBQUEsYUFBQTs7QUFDQSxVQUFHLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxLQUFBLGNBQUEsQ0FBUCxHQUFPLENBQVA7QUFDQSxRQUFBLElBQUksQ0FBSixPQUFBLEdBQUEsSUFBQTtBQUNBLFFBQUEsR0FBQSxHQUFNLElBQUksQ0FBVixNQUFNLEVBQU47O0FBQ0EsWUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsVUFBQSxLQUFBLEdBQUEsR0FBQTtBQUxKO0FDZ0VDOztBRDFERCxXQUFBLFdBQUEsR0FBQSxLQUFBO0FBQ0EsYUFBTyxLQUFQLFdBQUE7QUFaYztBQTdEWDs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUxBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxvQkFBQSxDQUFBOztBQUVBLElBQWEsUUFBTjtBQUFBO0FBQUE7QUFDTCxzQkFBYTtBQUFBLFFBQUEsSUFBQSx1RUFBQSxFQUFBOztBQUFBOztBQUFDLFNBQUEsSUFBQSxHQUFBLElBQUE7QUFBRDs7QUFEUjtBQUFBO0FBQUEsMkJBRUcsTUFGSCxFQUVHO0FBQ04sVUFBRyxLQUFBLFFBQUEsQ0FBSCxNQUFHLENBQUgsRUFBQTtBQUNFLFlBQXVCLEtBQUEsSUFBQSxDQUFBLE1BQUEsSUFBdkIsSUFBQSxFQUFBO0FBQUEsaUJBQU8sS0FBQSxJQUFBLENBQVAsTUFBQTtBQURGO0FBQUEsT0FBQSxNQUFBO0FBR0UsWUFBcUIsS0FBQSxJQUFBLFlBQXJCLElBQUEsRUFBQTtBQUFBLGlCQUFPLEtBQVAsSUFBTyxRQUFQO0FBSEY7QUNhQztBRGRLO0FBRkg7QUFBQTtBQUFBLDZCQU9LLE1BUEwsRUFPSyxDQUFBO0FBUEw7O0FBQUE7QUFBQSxHQUFQOzs7O0FBVUEsSUFBYSxZQUFOO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMkJBQ0csTUFESCxFQUNHO0FBQ04sVUFBQSxJQUFBOztBQUFBLFVBQUcsTUFBQSxDQUFBLFFBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxNQUFNLENBQU4sUUFBQSxDQUFBLE1BQUEsQ0FBUCxPQUFPLEVBQVA7O0FBQ0EsWUFBRyxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sSUFBSSxDQUFYLFdBQU8sRUFBUDtBQUhKO0FDb0JDO0FEckJLO0FBREg7O0FBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUDs7OztBQU9BLElBQWEsWUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDZCQUNLLE1BREwsRUFDSztBQUNSLFVBQUEsSUFBQTs7QUFBQSxVQUFHLEtBQUEsSUFBQSxDQUFBLE1BQUEsSUFBQSxJQUFBLElBQWtCLEtBQUEsSUFBQSxDQUFBLE1BQUEsSUFBbEIsSUFBQSxJQUFvQyxNQUFBLENBQUEsUUFBQSxJQUF2QyxJQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFJLEtBQUEsQ0FBSixJQUFBLENBQVMsS0FBQSxJQUFBLENBQVQsTUFBQSxFQUF1QixLQUFBLElBQUEsQ0FBdkIsTUFBQSxFQUFxQyxLQUE1QyxJQUFPLENBQVA7O0FBQ0EsWUFBRyxJQUFJLENBQUosVUFBQSxDQUFnQixNQUFNLENBQU4sUUFBQSxDQUFoQixNQUFnQixFQUFoQixFQUEwQyxNQUFNLENBQU4sUUFBQSxDQUFBLE1BQUEsQ0FBN0MsSUFBNkMsRUFBMUMsQ0FBSCxFQUFBO0FBQ0UsaUJBQUEsSUFBQTtBQUhKO0FDMEJDOztBRHRCRCxhQUFBLEtBQUE7QUFMUTtBQURMOztBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVuQkEsSUFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLFdBQUEsQ0FBQTs7QUFFQSxJQUFhLFdBQU47QUFBQTtBQUFBO0FBQ0wsdUJBQWEsSUFBYixFQUFhLE9BQWIsRUFBYTtBQUFBOztBQUNYLFFBQUEsUUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBO0FBRFksU0FBQSxJQUFBLEdBQUEsSUFBQTtBQUNaLElBQUEsUUFBQSxHQUFXO0FBQ1QsYUFEUyxJQUFBO0FBRVQsYUFGUyxJQUFBO0FBR1QsZUFIUyxJQUFBO0FBSVQsa0JBSlMsSUFBQTtBQUtULG1CQUxTLEtBQUE7QUFNVCxnQkFBVztBQU5GLEtBQVg7QUFRQSxJQUFBLEdBQUEsR0FBQSxDQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxDQUFBOztBQUFBLFNBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDTUUsTUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFULENBQVMsQ0FBVDs7QURMQSxVQUFHLEdBQUEsSUFBSCxPQUFBLEVBQUE7QUFDRSxRQUFBLFFBQVMsQ0FBVCxVQUFTLENBQVQsR0FBdUIsT0FBUSxDQUEvQixHQUErQixDQUEvQjtBQ09EO0FEVEg7O0FBR0EsU0FBQSxHQUFBLElBQUEsUUFBQSxFQUFBO0FDU0UsTUFBQSxHQUFHLEdBQUcsUUFBUSxDQUFkLEdBQWMsQ0FBZDs7QURSQSxVQUFHLEdBQUEsSUFBSCxPQUFBLEVBQUE7QUFDRSxhQUFBLEdBQUEsSUFBWSxPQUFRLENBQXBCLEdBQW9CLENBQXBCO0FBREYsT0FBQSxNQUFBO0FBR0UsYUFBQSxHQUFBLElBQUEsR0FBQTtBQ1VEO0FEZEg7QUFaVzs7QUFEUjtBQUFBO0FBQUEsMkJBbUJHLElBbkJILEVBbUJHO0FDYU4sYURaQSxJQUFLLENBQUEsS0FBTCxJQUFLLENBQUwsR0FBYyxRQUFBLENBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBbUIsS0FBbkIsSUFBQSxDQ1lkO0FEYk07QUFuQkg7QUFBQTtBQUFBLDZCQXNCSyxNQXRCTCxFQXNCSyxHQXRCTCxFQXNCSztBQUNSLFVBQUcsTUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLElBQUEsS0FBSCxJQUFBLEVBQUE7QUNjRSxlRGJBLEdBQUksQ0FBQSxLQUFKLFFBQUksQ0FBSixHQUFpQixNQUFNLENBQU4sSUFBQSxDQUFZLEtBQVosSUFBQSxDQ2FqQjtBQUNEO0FEaEJPO0FBdEJMO0FBQUE7QUFBQSwrQkF5Qk8sR0F6QlAsRUF5Qk87QUFDVixVQUFHLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxZQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLEdBQUcsQ0FBSCxTQUFBLENBQWMsS0FBckIsR0FBTyxDQUFQO0FDaUJEOztBRGhCRCxZQUFHLEtBQUEsS0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLEdBQUksQ0FBQSxLQUFYLEtBQVcsQ0FBSixFQUFQO0FDa0JEOztBRGpCRCxZQUFHLGVBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sR0FBSSxDQUFYLFdBQVcsQ0FBWDtBQU5KO0FDMEJDO0FEM0JTO0FBekJQO0FBQUE7QUFBQSwrQkFpQ08sR0FqQ1AsRUFpQ087QUFDVixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxLQUFBLFVBQUEsQ0FBTixHQUFNLENBQU47QUFDQSxhQUFPLEtBQUEsU0FBQSxJQUFjLEdBQUEsSUFBckIsSUFBQTtBQUZVO0FBakNQO0FBQUE7QUFBQSw0QkFvQ0ksR0FwQ0osRUFvQ0k7QUFDUCxVQUFHLEtBQUEsVUFBQSxDQUFILEdBQUcsQ0FBSCxFQUFBO0FBQ0UsMkJBQ0ksS0FBQyxJQURMLGlCQUVFLEtBQUEsVUFBQSxDQUFBLEdBQUEsS0FGRixFQUFBLFNBRThCLEtBQUEsTUFBQSxHQUFBLEdBQUEsR0FBc0IsRUFGcEQsa0JBR0ssS0FBQyxJQUhOO0FDMEJEO0FENUJNO0FBcENKOztBQUFBO0FBQUEsR0FBUDs7OztBQTZDTSxXQUFXLENBQWpCLE1BQU07QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwrQkFDUSxHQURSLEVBQ1E7QUFDVixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBREYsMEVBQ0UsR0FERixDQUNFOztBQUNBLFVBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLEdBQUcsQ0FBSCxPQUFBLENBQUEsS0FBQSxFQUFOLElBQU0sQ0FBTjtBQzBCRDs7QUR6QkQsYUFBQSxHQUFBO0FBSlU7QUFEUjtBQUFBO0FBQUEsMkJBTUksSUFOSixFQU1JO0FDNkJOLGFENUJBLElBQUssQ0FBQSxLQUFMLElBQUssQ0FBTCxHQUFjLFFBQUEsQ0FBQSxPQUFBLENBQUEsVUFBQSxDQUFtQixLQUFuQixJQUFBLEVBQXlCO0FBQUMsMkJBQW9CO0FBQXJCLE9BQXpCLENDNEJkO0FEN0JNO0FBTko7QUFBQTtBQUFBLCtCQVFRLEdBUlIsRUFRUTtBQUNWLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLEtBQUEsVUFBQSxDQUFOLEdBQU0sQ0FBTjtBQUNBLGFBQVEsS0FBQSxTQUFBLElBQWUsRUFBRSxHQUFBLElBQUEsSUFBQSxJQUFTLEdBQUEsQ0FBQSxPQUFBLElBQTNCLElBQWdCLENBQWYsSUFBNEMsR0FBQSxJQUFwRCxJQUFBO0FBRlU7QUFSUjs7QUFBQTtBQUFBLEVBQU4sV0FBTTs7QUFhQSxXQUFXLENBQWpCLE1BQU07QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw0QkFDSyxHQURMLEVBQ0s7QUFDUCxVQUFHLEtBQUEsVUFBQSxDQUFBLEdBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSw0QkFBYSxLQUFDLElBQWQsZUFBdUIsS0FBQSxVQUFBLENBQWhCLEdBQWdCLENBQXZCLFNBQTZDLEtBQUEsTUFBQSxHQUFBLEdBQUEsR0FBN0MsRUFBQTtBQ29DRDtBRHRDTTtBQURMOztBQUFBO0FBQUEsRUFBTixXQUFNOztBQU1BLFdBQVcsQ0FBakIsT0FBTTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNJLElBREosRUFDSTtBQ3VDTixhRHRDQSxJQUFLLENBQUEsS0FBTCxJQUFLLENBQUwsR0FBYyxRQUFBLENBQUEsT0FBQSxDQUFBLGNBQUEsQ0FBdUIsS0FBdkIsSUFBQSxDQ3NDZDtBRHZDTTtBQURKO0FBQUE7QUFBQSw2QkFHTSxNQUhOLEVBR00sR0FITixFQUdNO0FBQ1IsVUFBRyxNQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsSUFBQSxLQUFILElBQUEsRUFBQTtBQ3lDRSxlRHhDQSxHQUFJLENBQUEsS0FBSixRQUFJLENBQUosR0FBaUIsQ0FBQyxNQUFNLENBQU4sSUFBQSxDQUFZLEtBQVosSUFBQSxDQ3dDbEI7QUFDRDtBRDNDTztBQUhOO0FBQUE7QUFBQSw0QkFNSyxHQU5MLEVBTUs7QUFDUCxVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxLQUFBLFVBQUEsQ0FBTixHQUFNLENBQU47O0FBQ0EsVUFBRyxHQUFBLElBQUEsSUFBQSxJQUFTLENBQVosR0FBQSxFQUFBO0FBQ0UsNEJBQWEsS0FBYixJQUFBO0FDNkNEO0FEaERNO0FBTkw7O0FBQUE7QUFBQSxFQUFOLFdBQU07O0FBWUEsV0FBVyxDQUFqQixJQUFNO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMkJBQ0ksSUFESixFQUNJO0FDZ0ROLGFEL0NBLElBQUssQ0FBQSxLQUFMLElBQUssQ0FBTCxHQUFjLFFBQUEsQ0FBQSxPQUFBLENBQUEsY0FBQSxDQUF1QixLQUF2QixJQUFBLENDK0NkO0FEaERNO0FBREo7QUFBQTtBQUFBLDRCQUdLLEdBSEwsRUFHSztBQUNQLFVBQW1CLEtBQUEsVUFBQSxDQUFuQixHQUFtQixDQUFuQixFQUFBO0FBQUEsNEJBQU0sS0FBQyxJQUFQO0FDbURDO0FEcERNO0FBSEw7O0FBQUE7QUFBQSxFQUFOLFdBQU07Ozs7Ozs7Ozs7Ozs7Ozs7QUU5RU4sSUFBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUE7O0FBQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxDQUFBLHNCQUFBLENBQUE7O0FBQ0EsSUFBQSxnQkFBQSxHQUFBLE9BQUEsQ0FBQSwyQkFBQSxDQUFBOztBQUVBLElBQWEsTUFBTjtBQUFBO0FBQUE7QUFDTCxvQkFBYTtBQUFBOztBQUNYLFNBQUEsU0FBQSxHQUFBLElBQUE7QUFDQSxTQUFBLEtBQUEsR0FBQSxJQUFBO0FBRlc7O0FBRFI7QUFBQTtBQUFBLDZCQUlLLFFBSkwsRUFJSyxDQUFBO0FBSkw7QUFBQTtBQUFBLHlCQU1DLEdBTkQsRUFNQztBQUNKLFlBQUEsaUJBQUE7QUFESTtBQU5EO0FBQUE7QUFBQSwrQkFRTyxHQVJQLEVBUU87QUFDVixZQUFBLGlCQUFBO0FBRFU7QUFSUDtBQUFBO0FBQUEsOEJBVUk7QUFDUCxZQUFBLGlCQUFBO0FBRE87QUFWSjtBQUFBO0FBQUEsK0JBWU8sS0FaUCxFQVlPLEdBWlAsRUFZTztBQUNWLFlBQUEsaUJBQUE7QUFEVTtBQVpQO0FBQUE7QUFBQSxpQ0FjUyxJQWRULEVBY1MsR0FkVCxFQWNTO0FBQ1osWUFBQSxpQkFBQTtBQURZO0FBZFQ7QUFBQTtBQUFBLCtCQWdCTyxLQWhCUCxFQWdCTyxHQWhCUCxFQWdCTyxJQWhCUCxFQWdCTztBQUNWLFlBQUEsaUJBQUE7QUFEVTtBQWhCUDtBQUFBO0FBQUEsbUNBa0JTO0FBQ1osWUFBQSxpQkFBQTtBQURZO0FBbEJUO0FBQUE7QUFBQSxpQ0FvQlMsS0FwQlQsRUFvQlM7QUFBQSxVQUFRLEdBQVIsdUVBQUEsSUFBQTtBQUNaLFlBQUEsaUJBQUE7QUFEWTtBQXBCVDtBQUFBO0FBQUEsc0NBc0JZLENBQUE7QUF0Qlo7QUFBQTtBQUFBLG9DQXdCVSxDQUFBO0FBeEJWO0FBQUE7QUFBQSw4QkEwQkk7QUFDUCxhQUFPLEtBQVAsS0FBQTtBQURPO0FBMUJKO0FBQUE7QUFBQSw0QkE0QkksR0E1QkosRUE0Qkk7QUNnQ1AsYUQvQkEsS0FBQSxLQUFBLEdBQVMsR0MrQlQ7QURoQ087QUE1Qko7QUFBQTtBQUFBLDRDQThCa0I7QUFDckIsYUFBQSxJQUFBO0FBRHFCO0FBOUJsQjtBQUFBO0FBQUEsMENBZ0NnQjtBQUNuQixhQUFBLEtBQUE7QUFEbUI7QUFoQ2hCO0FBQUE7QUFBQSxnQ0FrQ1EsVUFsQ1IsRUFrQ1E7QUFDWCxZQUFBLGlCQUFBO0FBRFc7QUFsQ1I7QUFBQTtBQUFBLGtDQW9DUTtBQUNYLFlBQUEsaUJBQUE7QUFEVztBQXBDUjtBQUFBO0FBQUEsd0NBc0NjO0FBQ2pCLGFBQUEsS0FBQTtBQURpQjtBQXRDZDtBQUFBO0FBQUEsc0NBd0NjLFFBeENkLEVBd0NjO0FBQ2pCLFlBQUEsaUJBQUE7QUFEaUI7QUF4Q2Q7QUFBQTtBQUFBLHlDQTBDaUIsUUExQ2pCLEVBMENpQjtBQUNwQixZQUFBLGlCQUFBO0FBRG9CO0FBMUNqQjtBQUFBO0FBQUEsOEJBNkNNLEdBN0NOLEVBNkNNO0FBQ1QsYUFBTyxJQUFJLElBQUEsQ0FBSixHQUFBLENBQVEsS0FBQSxhQUFBLENBQVIsR0FBUSxDQUFSLEVBQTRCLEtBQUEsV0FBQSxDQUFuQyxHQUFtQyxDQUE1QixDQUFQO0FBRFM7QUE3Q047QUFBQTtBQUFBLGtDQStDVSxHQS9DVixFQStDVTtBQUNiLFVBQUEsQ0FBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLEtBQUEsV0FBQSxDQUFBLEdBQUEsRUFBa0IsQ0FBbEIsSUFBa0IsQ0FBbEIsRUFBMEIsQ0FBOUIsQ0FBSSxDQUFKOztBQUNPLFVBQUEsQ0FBQSxFQUFBO0FDa0RMLGVEbERlLENBQUMsQ0FBRCxHQUFBLEdBQU0sQ0NrRHJCO0FEbERLLE9BQUEsTUFBQTtBQ29ETCxlRHBENEIsQ0NvRDVCO0FBQ0Q7QUR2RFk7QUEvQ1Y7QUFBQTtBQUFBLGdDQWtEUSxHQWxEUixFQWtEUTtBQUNYLFVBQUEsQ0FBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLEtBQUEsV0FBQSxDQUFBLEdBQUEsRUFBa0IsQ0FBQSxJQUFBLEVBQXRCLElBQXNCLENBQWxCLENBQUo7O0FBQ08sVUFBQSxDQUFBLEVBQUE7QUN5REwsZUR6RGUsQ0FBQyxDQUFDLEdDeURqQjtBRHpESyxPQUFBLE1BQUE7QUMyREwsZUQzRDBCLEtBQUEsT0FBQSxFQzJEMUI7QUFDRDtBRDlEVTtBQWxEUjtBQUFBO0FBQUEsZ0NBc0RRLEtBdERSLEVBc0RRLE9BdERSLEVBc0RRO0FBQUEsVUFBZSxTQUFmLHVFQUFBLENBQUE7QUFDWCxVQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLElBQUE7O0FBQUEsVUFBRyxTQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sS0FBQSxVQUFBLENBQUEsS0FBQSxFQUFrQixLQUF6QixPQUF5QixFQUFsQixDQUFQO0FBREYsT0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFBLEdBQU8sS0FBQSxVQUFBLENBQUEsQ0FBQSxFQUFQLEtBQU8sQ0FBUDtBQytERDs7QUQ5REQsTUFBQSxPQUFBLEdBQUEsSUFBQTs7QUFDQSxXQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLE9BQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQ2dFRSxRQUFBLElBQUksR0FBRyxPQUFPLENBQWQsQ0FBYyxDQUFkO0FEL0RBLFFBQUEsR0FBQSxHQUFTLFNBQUEsR0FBQSxDQUFBLEdBQW1CLElBQUksQ0FBSixPQUFBLENBQW5CLElBQW1CLENBQW5CLEdBQTJDLElBQUksQ0FBSixXQUFBLENBQXBELElBQW9ELENBQXBEOztBQUNBLFlBQUcsR0FBQSxLQUFPLENBQVYsQ0FBQSxFQUFBO0FBQ0UsY0FBSSxPQUFBLElBQUEsSUFBQSxJQUFZLE9BQUEsR0FBQSxTQUFBLEdBQW9CLEdBQUEsR0FBcEMsU0FBQSxFQUFBO0FBQ0UsWUFBQSxPQUFBLEdBQUEsR0FBQTtBQUNBLFlBQUEsT0FBQSxHQUFBLElBQUE7QUFISjtBQ3FFQztBRHZFSDs7QUFNQSxVQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLElBQUksT0FBQSxDQUFKLE1BQUEsQ0FBZSxTQUFBLEdBQUEsQ0FBQSxHQUFtQixPQUFBLEdBQW5CLEtBQUEsR0FBZixPQUFBLEVBQVAsT0FBTyxDQUFQO0FDb0VEOztBRG5FRCxhQUFBLElBQUE7QUFkVztBQXREUjtBQUFBO0FBQUEsc0NBc0VjLFlBdEVkLEVBc0VjO0FBQUE7O0FDc0VqQixhRHJFQSxZQUFZLENBQVosTUFBQSxDQUFvQixVQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUE7QUNzRWxCLGVEckVFLE9BQU8sQ0FBUCxJQUFBLENBQWMsVUFBQSxHQUFELEVBQUE7QUFDWCxVQUFBLElBQUksQ0FBSixVQUFBLENBQUEsS0FBQTtBQUNBLFVBQUEsSUFBSSxDQUFKLFdBQUEsQ0FBaUIsR0FBRyxDQUFwQixNQUFBO0FDc0VGLGlCRHJFRSxDQUFBLEdBQUEsZ0JBQUEsQ0FBQSxlQUFBLEVBQWdCLElBQUksQ0FBcEIsS0FBZ0IsRUFBaEIsRUFBQSxJQUFBLENBQW1DLFlBQUE7QUNzRW5DLG1CRHJFRTtBQUNFLGNBQUEsVUFBQSxFQUFZLEdBQUcsQ0FBSCxVQUFBLENBQUEsTUFBQSxDQUFzQixJQUFJLENBRHhDLFVBQ2MsQ0FEZDtBQUVFLGNBQUEsTUFBQSxFQUFRLEdBQUcsQ0FBSCxNQUFBLEdBQVcsSUFBSSxDQUFKLFdBQUEsQ0FBQSxLQUFBO0FBRnJCLGFDcUVGO0FEdEVBLFdBQUEsQ0NxRUY7QUR4RUEsU0FBQSxDQ3FFRjtBRHRFRixPQUFBLEVBU0ksQ0FBQSxHQUFBLGdCQUFBLENBQUEsZUFBQSxFQUFnQjtBQUFDLFFBQUEsVUFBQSxFQUFELEVBQUE7QUFBZ0IsUUFBQSxNQUFBLEVBQVE7QUFBeEIsT0FBaEIsQ0FUSixFQUFBLElBQUEsQ0FVTyxVQUFBLEdBQUQsRUFBQTtBQzBFSixlRHpFQSxLQUFBLENBQUEsMkJBQUEsQ0FBNkIsR0FBRyxDQUFoQyxVQUFBLENDeUVBO0FEcEZGLE9BQUEsRUFBQSxNQUFBLEVDcUVBO0FEdEVpQjtBQXRFZDtBQUFBO0FBQUEsZ0RBc0Z3QixVQXRGeEIsRUFzRndCO0FBQzNCLFVBQUcsVUFBVSxDQUFWLE1BQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxZQUFHLEtBQUgsbUJBQUcsRUFBSCxFQUFBO0FDMEVFLGlCRHpFQSxLQUFBLFdBQUEsQ0FBQSxVQUFBLENDeUVBO0FEMUVGLFNBQUEsTUFBQTtBQzRFRSxpQkR6RUEsS0FBQSxZQUFBLENBQWMsVUFBVyxDQUFYLENBQVcsQ0FBWCxDQUFkLEtBQUEsRUFBa0MsVUFBVyxDQUFYLENBQVcsQ0FBWCxDQUFsQyxHQUFBLENDeUVBO0FEN0VKO0FDK0VDO0FEaEYwQjtBQXRGeEI7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVKQSxJQUFhLE1BQUEsR0FBQSxZQUFBO0FBQUEsTUFBTixNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNEJBRU47QUFDSCxZQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUE7O0FBQUEsWUFBRyxLQUFILFNBQUcsRUFBSCxFQUFBO0FBQ0UsVUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFERiw0Q0FERyxJQUNIO0FBREcsWUFBQSxJQUNIO0FBQUE7O0FBQ0UsZUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNHSSxZQUFBLEdBQUcsR0FBRyxJQUFJLENBQVYsQ0FBVSxDQUFWO0FBQ0EsWUFBQSxPQUFPLENBQVAsSUFBQSxDREhGLE9BQU8sQ0FBUCxHQUFBLENBQUEsR0FBQSxDQ0dFO0FESko7O0FDTUUsaUJBQUEsT0FBQTtBQUNEO0FEVEE7QUFGTTtBQUFBO0FBQUEsa0NBTUE7QUNTUCxlRFJGLENBQUEsT0FBQSxPQUFBLEtBQUEsV0FBQSxJQUFBLE9BQUEsS0FBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLENBQUEsS0FBQSxJQUFBLElBQWtCLEtBQWxCLE9BQUEsSUFBbUMsTUFBTSxDQUFDLE9DUXhDO0FEVE87QUFOQTtBQUFBO0FBQUEsOEJBU0YsS0FURSxFQVNGO0FBQUEsWUFBTyxJQUFQLHVFQUFBLFVBQUE7QUFDUCxZQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQTtBQUFBLFFBQUEsRUFBQSxHQUFLLFdBQVcsQ0FBaEIsR0FBSyxFQUFMO0FBQ0EsUUFBQSxHQUFBLEdBQU0sS0FBTixFQUFBO0FBQ0EsUUFBQSxFQUFBLEdBQUssV0FBVyxDQUFoQixHQUFLLEVBQUw7QUFDQSxRQUFBLE9BQU8sQ0FBUCxHQUFBLFdBQWUsSUFBZixtQkFBNEIsRUFBQSxHQUE1QixFQUFBO0FDV0UsZURWRixHQ1VFO0FEZks7QUFURTtBQUFBO0FBQUEsZ0NBZ0JBLEdBaEJBLEVBZ0JBLElBaEJBLEVBZ0JBO0FBQUEsWUFBVSxNQUFWLHVFQUFBLEVBQUE7QUFDVCxZQUFBLEtBQUE7QUFBQSxRQUFBLEtBQUEsR0FBUSxHQUFJLENBQVosSUFBWSxDQUFaO0FDYUUsZURaRixHQUFJLENBQUosSUFBSSxDQUFKLEdBQVksWUFBQTtBQUNWLGNBQUEsSUFBQTtBQUFBLFVBQUEsSUFBQSxHQUFBLFNBQUE7QUNjRSxpQkRiRixLQUFBLE9BQUEsQ0FBYyxZQUFBO0FDY1YsbUJEZGEsS0FBSyxDQUFMLEtBQUEsQ0FBQSxHQUFBLEVBQUEsSUFBQSxDQ2NiO0FEZEosV0FBQSxFQUF3QyxNQUFBLEdBQXhDLElBQUEsQ0NhRTtBQUhGLFNBQUE7QURkTztBQWhCQTtBQUFBO0FBQUEsOEJBcUJGLEtBckJFLEVBcUJGLElBckJFLEVBcUJGO0FBQ1AsWUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUE7QUFBQSxRQUFBLEVBQUEsR0FBSyxXQUFXLENBQWhCLEdBQUssRUFBTDtBQUNBLFFBQUEsR0FBQSxHQUFNLEtBQU4sRUFBQTtBQUNBLFFBQUEsRUFBQSxHQUFLLFdBQVcsQ0FBaEIsR0FBSyxFQUFMOztBQUNBLFlBQUcsS0FBQSxXQUFBLENBQUEsSUFBQSxLQUFILElBQUEsRUFBQTtBQUNFLGVBQUEsV0FBQSxDQUFBLElBQUEsRUFBQSxLQUFBO0FBQ0EsZUFBQSxXQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsSUFBK0IsRUFBQSxHQUEvQixFQUFBO0FBRkYsU0FBQSxNQUFBO0FBSUUsZUFBQSxXQUFBLENBQUEsSUFBQSxJQUF5QjtBQUN2QixZQUFBLEtBQUEsRUFEdUIsQ0FBQTtBQUV2QixZQUFBLEtBQUEsRUFBTyxFQUFBLEdBQUs7QUFGVyxXQUF6QjtBQ3VCQzs7QUFDRCxlRHBCRixHQ29CRTtBRGhDSztBQXJCRTtBQUFBO0FBQUEsK0JBa0NIO0FDdUJKLGVEdEJGLE9BQU8sQ0FBUCxHQUFBLENBQVksS0FBWixXQUFBLENDc0JFO0FEdkJJO0FBbENHOztBQUFBO0FBQUE7O0FBQU47QUFDTCxFQUFBLE1BQUMsQ0FBRCxPQUFBLEdBQUEsSUFBQTtBQytEQSxFQUFBLE1BQU0sQ0FBTixTQUFBLENEeERBLE9Dd0RBLEdEeERTLElDd0RUO0FBRUEsRUFBQSxNQUFNLENBQU4sU0FBQSxDRG5EQSxXQ21EQSxHRG5EYSxFQ21EYjtBQUVBLFNBQUEsTUFBQTtBRHBFVyxDQUFBLENBQUEsSUFBQSxDQUFBLEtBQWIsQ0FBYSxDQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVBQSxJQUFhLFlBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw0QkFDSSxPQURKLEVBQ0ksUUFESixFQUNJO0FBQ1AsVUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBO0FBQUEsV0FBQSxRQUFBLEdBQUEsUUFBQTtBQUNBLE1BQUEsR0FBQSxHQUFBLEtBQUEsUUFBQTtBQUFBLE1BQUEsT0FBQSxHQUFBLEVBQUE7O0FBQUEsV0FBQSxHQUFBLElBQUEsR0FBQSxFQUFBO0FDSUUsUUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFULEdBQVMsQ0FBVDs7QURIQSxZQUFHLEdBQUEsSUFBSCxPQUFBLEVBQUE7QUNLRSxVQUFBLE9BQU8sQ0FBUCxJQUFBLENESkEsS0FBQSxNQUFBLENBQUEsR0FBQSxFQUFZLE9BQVEsQ0FBcEIsR0FBb0IsQ0FBcEIsQ0NJQTtBRExGLFNBQUEsTUFBQTtBQ09FLFVBQUEsT0FBTyxDQUFQLElBQUEsQ0RKQSxLQUFBLE1BQUEsQ0FBQSxHQUFBLEVBQUEsR0FBQSxDQ0lBO0FBQ0Q7QURUSDs7QUNXQSxhQUFBLE9BQUE7QURiTztBQURKO0FBQUE7QUFBQSwyQkFTRyxHQVRILEVBU0csR0FUSCxFQVNHO0FBQ04sVUFBQSxHQUFBOztBQUFBLFVBQUcsQ0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUEsQ0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLENBQUEsSUFBQSxHQUFBLEtBQUEsQ0FBQSxLQUFILElBQUEsRUFBQTtBQ1VFLGVEVEEsS0FBQSxHQUFBLEVBQUEsR0FBQSxDQ1NBO0FEVkYsT0FBQSxNQUFBO0FDWUUsZURUQSxLQUFBLEdBQUEsSUFBVyxHQ1NYO0FBQ0Q7QURkSztBQVRIO0FBQUE7QUFBQSwyQkFlRyxHQWZILEVBZUc7QUFDTixVQUFBLEdBQUE7O0FBQUEsVUFBRyxDQUFBLENBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQSxDQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsQ0FBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLEtBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBTyxLQUFQLEdBQU8sR0FBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sS0FBUCxHQUFPLENBQVA7QUNhRDtBRGpCSztBQWZIO0FBQUE7QUFBQSw4QkFxQkk7QUFDUCxVQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLElBQUEsR0FBQSxFQUFBO0FBQ0EsTUFBQSxHQUFBLEdBQUEsS0FBQSxRQUFBOztBQUFBLFdBQUEsR0FBQSxJQUFBLEdBQUEsRUFBQTtBQ2lCRSxRQUFBLEdBQUcsR0FBRyxHQUFHLENBQVQsR0FBUyxDQUFUO0FEaEJBLFFBQUEsSUFBSyxDQUFMLEdBQUssQ0FBTCxHQUFZLEtBQUEsTUFBQSxDQUFaLEdBQVksQ0FBWjtBQURGOztBQUVBLGFBQUEsSUFBQTtBQUpPO0FBckJKOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQUEsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLGVBQUEsQ0FBQTs7QUFDQSxJQUFBLFVBQUEsR0FBQSxPQUFBLENBQUEsYUFBQSxDQUFBOztBQUNBLElBQUEsSUFBQSxHQUFBLE9BQUEsQ0FBQSxtQkFBQSxDQUFBOztBQUNBLElBQUEsT0FBQSxHQUFBLE9BQUEsQ0FBQSxzQkFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSwyQkFBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsZ0JBQUEsR0FBQSxPQUFBLENBQUEsMkJBQUEsQ0FBQTs7QUFDQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsV0FBQSxDQUFBOztBQVBBLElBQUEsT0FBQSxHQUFBLEdBQUEsT0FBQTs7QUFTQSxJQUFhLHFCQUFOO0FBQUE7QUFBQTtBQUFBOztBQUNMLGlDQUFhLFFBQWIsRUFBYSxJQUFiLEVBQWEsSUFBYixFQUFhO0FBQUE7O0FBQUE7O0FDMEJYO0FEMUJZLFVBQUEsUUFBQSxHQUFBLFFBQUE7QUFBVSxVQUFBLEdBQUEsR0FBQSxJQUFBO0FBQUssVUFBQSxHQUFBLEdBQUEsSUFBQTs7QUFFM0IsUUFBQSxDQUFPLE1BQVAsT0FBTyxFQUFQLEVBQUE7QUFDRSxZQUFBLFlBQUE7O0FBQ0EsWUFBQSxPQUFBLEdBQVcsTUFBWCxHQUFBO0FBQ0EsWUFBQSxTQUFBLEdBQWEsTUFBQSxjQUFBLENBQWdCLE1BQTdCLEdBQWEsQ0FBYjs7QUFDQSxZQUFBLGdCQUFBOztBQUNBLFlBQUEsWUFBQTs7QUFDQSxZQUFBLGVBQUE7QUM2QkQ7O0FEckNVO0FBQUE7O0FBRFI7QUFBQTtBQUFBLG1DQVVTO0FBQ1osVUFBQSxDQUFBLEVBQUEsU0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLEtBQUEsY0FBQSxDQUFnQixLQUE1QixHQUFZLENBQVo7O0FBQ0EsVUFBRyxTQUFTLENBQVQsU0FBQSxDQUFBLENBQUEsRUFBc0IsS0FBQSxRQUFBLENBQUEsU0FBQSxDQUF0QixNQUFBLE1BQXFELEtBQUEsUUFBQSxDQUFyRCxTQUFBLEtBQTZFLENBQUEsR0FBSSxLQUFwRixlQUFvRixFQUFqRixDQUFILEVBQUE7QUFDRSxhQUFBLFVBQUEsR0FBYyxJQUFJLE9BQUEsQ0FBSixNQUFBLENBQVcsS0FBWCxHQUFBLEVBQWlCLEtBQS9CLEdBQWMsQ0FBZDtBQUNBLGFBQUEsR0FBQSxHQUFPLENBQUMsQ0FBUixHQUFBO0FDaUNBLGVEaENBLEtBQUEsR0FBQSxHQUFPLENBQUMsQ0FBQyxHQ2dDVDtBQUNEO0FEdENXO0FBVlQ7QUFBQTtBQUFBLHNDQWdCWTtBQUNmLFVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEtBQUEsY0FBQSxDQUFnQixLQUFoQixHQUFBLEVBQUEsU0FBQSxDQUFnQyxLQUFBLFFBQUEsQ0FBQSxTQUFBLENBQTFDLE1BQVUsQ0FBVjtBQUNBLE1BQUEsT0FBQSxHQUFVLEtBQUEsUUFBQSxDQUFBLE9BQUEsR0FBVixPQUFBO0FBQ0EsTUFBQSxPQUFBLEdBQVUsS0FBVixHQUFBOztBQUNBLFVBQUcsQ0FBQSxHQUFJLEtBQUEsUUFBQSxDQUFBLGdCQUFBLENBQTJCLEtBQTNCLEdBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFnRCxDQUF2RCxDQUFPLENBQVAsRUFBQTtBQUNFLFFBQUEsQ0FBQyxDQUFELEdBQUEsR0FBUSxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUE0QixDQUFDLENBQTdCLEdBQUEsRUFBa0MsS0FBQSxRQUFBLENBQUEsY0FBQSxDQUF5QixDQUFDLENBQUQsR0FBQSxHQUFNLENBQUMsQ0FBRCxHQUFBLENBQS9CLE1BQUEsSUFBNkMsS0FBQSxRQUFBLENBQUEsT0FBQSxDQUF2RixNQUFRLENBQVI7QUFDQSxlQUFBLENBQUE7QUNxQ0Q7QUQzQ2M7QUFoQlo7QUFBQTtBQUFBLHVDQXVCYTtBQUNoQixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxLQUFBLFNBQUEsQ0FBQSxLQUFBLENBQVIsR0FBUSxDQUFSO0FBQ0EsV0FBQSxPQUFBLEdBQVcsS0FBSyxDQUFoQixLQUFXLEVBQVg7QUN5Q0EsYUR4Q0EsS0FBQSxTQUFBLEdBQWEsS0FBSyxDQUFMLElBQUEsQ0FBQSxHQUFBLENDd0NiO0FEM0NnQjtBQXZCYjtBQUFBO0FBQUEsaUNBMkJRLE1BM0JSLEVBMkJRO0FBQ1gsVUFBQSxZQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUE7QUFBQSxXQUFBLE1BQUEsR0FBQSxFQUFBO0FBQ0EsV0FBQSxLQUFBLEdBQVMsS0FBVCxXQUFTLEVBQVQ7O0FBQ0EsVUFBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLFdBQUEsR0FBYyxLQUFBLFNBQUEsQ0FBZCxhQUFjLENBQWQ7O0FBQ0EsWUFBRyxXQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBQSxLQUFBLENBQUEsV0FBQSxJQUFzQixLQUF0QixPQUFBO0FBSEo7QUNnREM7O0FENUNELFVBQUcsTUFBTSxDQUFULE1BQUEsRUFBQTtBQUNFLFFBQUEsWUFBQSxHQUFlLEtBQUEsU0FBQSxDQUFmLGNBQWUsQ0FBZjtBQUNBLFFBQUEsS0FBQSxHQUFBLEtBQUE7QUFDQSxRQUFBLEtBQUEsR0FBQSxFQUFBO0FBQ0EsUUFBQSxJQUFBLEdBQUEsS0FBQTs7QUFDQSxhQUFTLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxNQUFBLENBQUEsTUFBQSxHQUFULENBQUEsRUFBUyxLQUFBLEdBQUEsR0FBQSxDQUFBLElBQUEsR0FBQSxHQUFBLENBQUEsSUFBVCxHQUFBLEVBQVMsQ0FBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQVQsQ0FBQSxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sTUFBTyxDQUFiLENBQWEsQ0FBYjs7QUFDQSxjQUFHLEdBQUEsS0FBQSxHQUFBLElBQWUsQ0FBbEIsS0FBQSxFQUFBO0FBQ0UsZ0JBQUEsSUFBQSxFQUFBO0FBQ0UsbUJBQUEsS0FBQSxDQUFBLElBQUEsSUFBQSxLQUFBO0FBREYsYUFBQSxNQUFBO0FBR0UsbUJBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBO0FDOENEOztBRDdDRCxZQUFBLEtBQUEsR0FBQSxFQUFBO0FBQ0EsWUFBQSxJQUFBLEdBQUEsS0FBQTtBQU5GLFdBQUEsTUFPSyxJQUFHLENBQUEsR0FBQSxLQUFBLEdBQUEsSUFBQSxHQUFBLEtBQUEsR0FBQSxNQUFzQixDQUFBLEtBQUEsQ0FBQSxJQUFVLE1BQU8sQ0FBQSxDQUFBLEdBQVAsQ0FBTyxDQUFQLEtBQW5DLElBQUcsQ0FBSCxFQUFBO0FBQ0gsWUFBQSxLQUFBLEdBQVEsQ0FBUixLQUFBO0FBREcsV0FBQSxNQUVBLElBQUcsR0FBQSxLQUFBLEdBQUEsSUFBZSxDQUFmLElBQUEsSUFBeUIsQ0FBekIsS0FBQSxLQUFzQyxZQUFBLElBQUEsSUFBQSxJQUFpQixPQUFBLENBQUEsSUFBQSxDQUFBLFlBQUEsRUFBQSxLQUFBLEtBQTFELENBQUcsQ0FBSCxFQUFBO0FBQ0gsWUFBQSxJQUFBLEdBQUEsS0FBQTtBQUNBLFlBQUEsS0FBQSxHQUFBLEVBQUE7QUFGRyxXQUFBLE1BQUE7QUFJSCxZQUFBLEtBQUEsSUFBQSxHQUFBO0FDK0NEO0FEOURIOztBQWdCQSxZQUFHLEtBQUssQ0FBUixNQUFBLEVBQUE7QUFDRSxjQUFBLElBQUEsRUFBQTtBQ2lERSxtQkRoREEsS0FBQSxLQUFBLENBQUEsSUFBQSxJQUFlLEtDZ0RmO0FEakRGLFdBQUEsTUFBQTtBQ21ERSxtQkRoREEsS0FBQSxNQUFBLENBQUEsSUFBQSxDQUFBLEtBQUEsQ0NnREE7QURwREo7QUFyQkY7QUM0RUM7QURuRlU7QUEzQlI7QUFBQTtBQUFBLG1DQTREUztBQUNaLFVBQUEsQ0FBQTs7QUFBQSxVQUFHLENBQUEsR0FBSSxLQUFQLGVBQU8sRUFBUCxFQUFBO0FBQ0UsYUFBQSxPQUFBLEdBQVcsYUFBQSxDQUFBLFlBQUEsQ0FBQSxhQUFBLENBQTJCLEtBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQTRCLEtBQUEsR0FBQSxHQUFLLEtBQUEsR0FBQSxDQUFqQyxNQUFBLEVBQTZDLENBQUMsQ0FBcEYsR0FBc0MsQ0FBM0IsQ0FBWDtBQ3VEQSxlRHREQSxLQUFBLEdBQUEsR0FBTyxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUE0QixLQUE1QixHQUFBLEVBQWlDLENBQUMsQ0FBRCxHQUFBLEdBQU0sQ0FBQyxDQUFELEdBQUEsQ0FBdkMsTUFBQSxDQ3NEUDtBQUNEO0FEMURXO0FBNURUO0FBQUE7QUFBQSxzQ0FnRVk7QUFDZixVQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUEsT0FBQTs7QUFBQSxVQUFzQixLQUFBLFVBQUEsSUFBdEIsSUFBQSxFQUFBO0FBQUEsZUFBTyxLQUFQLFVBQUE7QUM0REM7O0FEM0RELE1BQUEsT0FBQSxHQUFVLEtBQUEsUUFBQSxDQUFBLE9BQUEsR0FBb0IsS0FBQSxRQUFBLENBQXBCLFNBQUEsR0FBMEMsS0FBMUMsT0FBQSxHQUFxRCxLQUFBLFFBQUEsQ0FBL0QsT0FBQTtBQUNBLE1BQUEsT0FBQSxHQUFVLEtBQUEsUUFBQSxDQUFBLE9BQUEsR0FBb0IsS0FBOUIsT0FBQTs7QUFDQSxVQUFHLENBQUEsR0FBSSxLQUFBLFFBQUEsQ0FBQSxnQkFBQSxDQUEyQixLQUFBLEdBQUEsR0FBSyxLQUFBLEdBQUEsQ0FBaEMsTUFBQSxFQUFBLE9BQUEsRUFBUCxPQUFPLENBQVAsRUFBQTtBQUNFLGVBQU8sS0FBQSxVQUFBLEdBQVAsQ0FBQTtBQzZERDtBRGxFYztBQWhFWjtBQUFBO0FBQUEsc0NBc0VZO0FBQ2YsVUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxLQUFULFNBQVMsRUFBVDtBQUNBLE1BQUEsR0FBQSxHQUFNLEtBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBTixPQUFNLEVBQU47O0FBQ0EsYUFBTSxNQUFBLEdBQUEsR0FBQSxJQUFpQixLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUFBLE1BQUEsRUFBbUMsTUFBQSxHQUFPLEtBQUEsUUFBQSxDQUFBLElBQUEsQ0FBMUMsTUFBQSxNQUFvRSxLQUFBLFFBQUEsQ0FBM0YsSUFBQSxFQUFBO0FBQ0UsUUFBQSxNQUFBLElBQVEsS0FBQSxRQUFBLENBQUEsSUFBQSxDQUFSLE1BQUE7QUFERjs7QUFFQSxVQUFHLE1BQUEsSUFBQSxHQUFBLElBQWlCLENBQUEsR0FBQSxHQUFBLEtBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsTUFBQSxFQUFvQyxNQUFBLEdBQVMsS0FBQSxRQUFBLENBQUEsSUFBQSxDQUE3QyxNQUFBLENBQUEsTUFBQSxHQUFqQixJQUFpQixHQUFBLEtBQUEsSUFBakIsSUFBaUIsR0FBQSxLQUFwQixJQUFBLEVBQUE7QUNrRUUsZURqRUEsS0FBQSxHQUFBLEdBQU8sS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBNEIsS0FBNUIsR0FBQSxFQUFBLE1BQUEsQ0NpRVA7QUFDRDtBRHhFYztBQXRFWjtBQUFBO0FBQUEsZ0NBNkVNO0FBQ1QsVUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLE1BQUE7O0FBQUEsVUFBRyxLQUFBLFFBQUEsQ0FBQSxVQUFBLElBQUEsSUFBQSxJQUEwQixLQUFBLFFBQUEsQ0FBQSxVQUFBLENBQUEsR0FBQSxDQUFBLElBQUEsS0FBN0IsU0FBQSxFQUFBO0FBQ0U7QUNzRUQ7O0FEckVELE1BQUEsRUFBQSxHQUFLLEtBQUEsT0FBQSxDQUFMLGVBQUssRUFBTDtBQUNBLE1BQUEsRUFBQSxHQUFLLEtBQUEsT0FBQSxDQUFMLGdCQUFLLEVBQUw7QUFDQSxNQUFBLE1BQUEsR0FBUyxLQUFBLFNBQUEsS0FBZSxFQUFFLENBQTFCLE1BQUE7O0FBQ0EsVUFBRyxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxDQUE0QixLQUFBLEdBQUEsR0FBTyxFQUFFLENBQXJDLE1BQUEsRUFBNkMsS0FBN0MsR0FBQSxNQUFBLEVBQUEsSUFBNkQsS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBNEIsTUFBQSxHQUFTLEVBQUUsQ0FBdkMsTUFBQSxFQUFBLE1BQUEsTUFBaEUsRUFBQSxFQUFBO0FBQ0UsYUFBQSxHQUFBLEdBQU8sS0FBQSxHQUFBLEdBQU8sRUFBRSxDQUFoQixNQUFBO0FBQ0EsYUFBQSxHQUFBLEdBQU8sS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBNEIsS0FBNUIsR0FBQSxFQUFQLE1BQU8sQ0FBUDtBQ3VFQSxlRHRFQSxLQUFBLHlCQUFBLEVDc0VBO0FEekVGLE9BQUEsTUFJSyxJQUFHLEtBQUEsTUFBQSxHQUFBLGVBQUEsR0FBQSxPQUFBLENBQUEsRUFBQSxJQUEwQyxDQUExQyxDQUFBLElBQWlELEtBQUEsTUFBQSxHQUFBLGVBQUEsR0FBQSxPQUFBLENBQUEsRUFBQSxJQUEwQyxDQUE5RixDQUFBLEVBQUE7QUFDSCxhQUFBLEtBQUEsR0FBQSxDQUFBO0FDdUVBLGVEdEVBLEtBQUEseUJBQUEsRUNzRUE7QUFDRDtBRG5GUTtBQTdFTjtBQUFBO0FBQUEsZ0RBMEZzQjtBQUN6QixVQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTs7QUFBQSxVQUFHLEtBQUgsT0FBQSxFQUFBO0FBQ0UsUUFBQSxHQUFBLEdBQU0sYUFBQSxDQUFBLFlBQUEsQ0FBQSxZQUFBLENBQTBCLEtBQUEsT0FBQSxDQUFoQyxlQUFnQyxFQUExQixDQUFOO0FBQ0EsUUFBQSxHQUFBLEdBQU0sYUFBQSxDQUFBLFlBQUEsQ0FBQSxZQUFBLENBQTBCLEtBQUEsT0FBQSxDQUFoQyxnQkFBZ0MsRUFBMUIsQ0FBTjtBQUNBLFFBQUEsRUFBQSxHQUFLLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixLQUFBLFFBQUEsQ0FBL0IsSUFBSyxDQUFMO0FBQ0EsUUFBQSxHQUFBLEdBQU0sSUFBQSxNQUFBLGdCQUFtQixHQUFuQixnQkFBNEIsRUFBNUIsK0JBQW1ELEVBQW5ELGVBQUEsR0FBQSxRQUFOLElBQU0sQ0FBTjtBQUNBLFFBQUEsR0FBQSxHQUFNLElBQUEsTUFBQSxtQkFBc0IsRUFBdEIsZUFBTixHQUFNLFdBQU47QUFDQSxRQUFBLEdBQUEsR0FBTSxJQUFBLE1BQUEsaUJBQW9CLEdBQXBCLGdCQUFOLEVBQU0sYUFBTjtBQzJFQSxlRDFFQSxLQUFBLE9BQUEsR0FBVyxLQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxFQUFBLEVBQUEsQ0MwRVg7QUFDRDtBRG5Gd0I7QUExRnRCO0FBQUE7QUFBQSxxQ0FtR1c7QUFDZCxVQUFBLEdBQUE7QUM4RUEsYUQ5RUEsS0FBQSxNQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsS0FBQSxRQUFBLENBQUEsZUFBQSxDQUFBLEtBQUEsU0FBQSxFQUFBLENBQUEsS0FBQSxJQUFBLEdBQUEsR0FBaUQsQ0FBakQsSUFBQSxFQUFBLEdBQVUsS0FBQSxDQzhFVjtBRC9FYztBQW5HWDtBQUFBO0FBQUEsZ0NBcUdRLFFBckdSLEVBcUdRO0FDaUZYLGFEaEZBLEtBQUEsUUFBQSxHQUFZLFFDZ0ZaO0FEakZXO0FBckdSO0FBQUE7QUFBQSxpQ0F1R087QUFDVixXQUFBLE1BQUE7O0FBQ0EsV0FBQSxTQUFBOztBQUNBLFdBQUEsT0FBQSxHQUFXLEtBQUEsdUJBQUEsQ0FBeUIsS0FBcEMsT0FBVyxDQUFYO0FBSEY7QUFBWTtBQXZHUDtBQUFBO0FBQUEsa0NBNEdRO0FDcUZYLGFEcEZBLEtBQUEsWUFBQSxDQUFjLEtBQWQsU0FBQSxDQ29GQTtBRHJGVztBQTVHUjtBQUFBO0FBQUEsaUNBOEdPO0FBQ1YsYUFBTyxLQUFBLE9BQUEsSUFBWSxLQUFBLFFBQUEsQ0FBbkIsT0FBQTtBQURVO0FBOUdQO0FBQUE7QUFBQSw2QkFnSEc7QUFDTixVQUFPLEtBQUEsR0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGFBQUEsY0FBQTs7QUFDQSxZQUFHLEtBQUEsU0FBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLEVBQXVCLEtBQUEsUUFBQSxDQUFBLGFBQUEsQ0FBdkIsTUFBQSxNQUEwRCxLQUFBLFFBQUEsQ0FBN0QsYUFBQSxFQUFBO0FBQ0UsZUFBQSxHQUFBLEdBQU8sUUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsTUFBQSxDQUFQLGlCQUFPLENBQVA7QUFDQSxlQUFBLE9BQUEsR0FBVyxLQUFBLFFBQUEsQ0FBWCxPQUFBO0FBRkYsU0FBQSxNQUFBO0FBSUUsZUFBQSxNQUFBLEdBQVUsS0FBQSxTQUFBLENBQVcsS0FBckIsT0FBVSxDQUFWO0FBQ0EsZUFBQSxPQUFBLEdBQVcsS0FBQSxNQUFBLENBQVgsT0FBQTtBQUNBLGVBQUEsR0FBQSxHQUFPLEtBQUEsTUFBQSxDQUFQLElBQU8sRUFBUDs7QUFDQSxjQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFBLE9BQUEsQ0FBQSxZQUFBLENBQXNCLEtBQUEsR0FBQSxDQUF0QixRQUFBO0FBUko7QUFGRjtBQ3FHQzs7QUQxRkQsYUFBTyxLQUFQLEdBQUE7QUFaTTtBQWhISDtBQUFBO0FBQUEsOEJBNkhNLE9BN0hOLEVBNkhNO0FBQ1QsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxRQUFBLENBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQSxPQUFBLEVBQW9DO0FBQUEsUUFBQSxVQUFBLEVBQVcsS0FBQSxvQkFBQTtBQUFYLE9BQXBDLENBQVQ7QUFDQSxNQUFBLE1BQU0sQ0FBTixRQUFBLEdBQUEsSUFBQTtBQUNBLGFBQUEsTUFBQTtBQUhTO0FBN0hOO0FBQUE7QUFBQSwyQ0FpSWlCO0FBQ3BCLFVBQUEsS0FBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLEtBQUEsR0FBQSxFQUFBO0FBQ0EsTUFBQSxHQUFBLEdBQUEsSUFBQTs7QUFDQSxhQUFNLEdBQUEsQ0FBQSxNQUFBLElBQU4sSUFBQSxFQUFBO0FBQ0UsUUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFULE1BQUE7O0FBQ0EsWUFBZ0MsR0FBQSxDQUFBLEdBQUEsSUFBQSxJQUFBLElBQWEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxRQUFBLElBQTdDLElBQUEsRUFBQTtBQUFBLFVBQUEsS0FBSyxDQUFMLElBQUEsQ0FBVyxHQUFHLENBQUgsR0FBQSxDQUFYLFFBQUE7QUNxR0M7QUR2R0g7O0FBR0EsYUFBQSxLQUFBO0FBTm9CO0FBaklqQjtBQUFBO0FBQUEsbUNBd0lXLEdBeElYLEVBd0lXO0FBQ2QsYUFBTyxHQUFHLENBQUgsU0FBQSxDQUFjLEtBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBZCxNQUFBLEVBQXVDLEdBQUcsQ0FBSCxNQUFBLEdBQVcsS0FBQSxRQUFBLENBQUEsT0FBQSxDQUF6RCxNQUFPLENBQVA7QUFEYztBQXhJWDtBQUFBO0FBQUEsaUNBMElTLE9BMUlULEVBMElTO0FBQ1osVUFBQSxPQUFBLEVBQUEsSUFBQTs7QUFEWSxrQ0FDTSxnQkFBQSxDQUFBLGVBQUEsQ0FBQSxLQUFBLENBQXNCLEtBQXhDLE9BQWtCLENBRE47O0FBQUE7O0FBQ1osTUFBQSxJQURZO0FBQ1osTUFBQSxPQURZO0FBRVosYUFBTyxPQUFPLENBQVAsT0FBQSxDQUFBLFFBQUEsRUFBUCxPQUFPLENBQVA7QUFGWTtBQTFJVDtBQUFBO0FBQUEsOEJBNklJO0FBQ1AsYUFBTyxLQUFBLEdBQUEsS0FBUSxLQUFBLFFBQUEsQ0FBQSxPQUFBLEdBQW9CLEtBQUEsUUFBQSxDQUFwQixTQUFBLEdBQTBDLEtBQUEsUUFBQSxDQUFsRCxPQUFBLElBQXVFLEtBQUEsR0FBQSxLQUFRLEtBQUEsUUFBQSxDQUFBLE9BQUEsR0FBb0IsS0FBQSxRQUFBLENBQTFHLE9BQUE7QUFETztBQTdJSjtBQUFBO0FBQUEsOEJBK0lJO0FBQ1AsVUFBQSxXQUFBLEVBQUEsR0FBQTs7QUFBQSxVQUFHLEtBQUgsT0FBRyxFQUFILEVBQUE7QUFDRSxZQUFHLEtBQUEsUUFBQSxDQUFBLFlBQUEsSUFBQSxJQUFBLElBQTRCLEtBQUEsUUFBQSxDQUFBLFlBQUEsQ0FBQSxpQkFBQSxDQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxNQUFBLEtBQS9CLElBQUEsRUFBQTtBQ2lIRSxpQkRoSEEsS0FBQSxRQUFBLENBQUEsWUFBQSxDQUFBLE1BQUEsRUNnSEE7QURqSEYsU0FBQSxNQUFBO0FDbUhFLGlCRGhIQSxLQUFBLFdBQUEsQ0FBQSxFQUFBLENDZ0hBO0FEcEhKO0FBQUEsT0FBQSxNQUtLLElBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0gsWUFBRyxXQUFBLEdBQWMsS0FBQSxTQUFBLENBQWpCLGVBQWlCLENBQWpCLEVBQUE7QUFDRSxVQUFBLFdBQUEsQ0FBQSxJQUFBLENBQUE7QUNrSEQ7O0FEakhELFlBQUcsS0FBSCxpQkFBRyxFQUFILEVBQUE7QUFDRSxjQUFHLENBQUEsR0FBQSxHQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUgsSUFBQSxFQUFBO0FDbUhFLG1CRGxIQSxLQUFBLFdBQUEsQ0FBQSxHQUFBLENDa0hBO0FEcEhKO0FBQUEsU0FBQSxNQUFBO0FBSUksaUJBQU8sS0FBUCxlQUFPLEVBQVA7QUFQRDtBQzRISjtBRGxJTTtBQS9JSjtBQUFBO0FBQUEsZ0NBNkpNO0FBQ1QsYUFBTyxLQUFBLEdBQUEsR0FBSyxLQUFBLEdBQUEsQ0FBWixNQUFBO0FBRFM7QUE3Sk47QUFBQTtBQUFBLDZCQStKRztBQUNOLGFBQU8sSUFBSSxJQUFBLENBQUosR0FBQSxDQUFRLEtBQVIsR0FBQSxFQUFhLEtBQUEsR0FBQSxHQUFLLEtBQUEsR0FBQSxDQUFsQixNQUFBLEVBQUEsVUFBQSxDQUEwQyxLQUFBLFFBQUEsQ0FBakQsTUFBTyxDQUFQO0FBRE07QUEvSkg7QUFBQTtBQUFBLG9DQWlLVTtBQUNiLGFBQU8sSUFBSSxJQUFBLENBQUosR0FBQSxDQUFRLEtBQVIsR0FBQSxFQUFhLEtBQUEsR0FBQSxHQUFLLEtBQUEsT0FBQSxDQUFsQixNQUFBLEVBQUEsVUFBQSxDQUE4QyxLQUFBLFFBQUEsQ0FBckQsTUFBTyxDQUFQO0FBRGE7QUFqS1Y7QUFBQTtBQUFBLGdDQW1LTTtBQUNULFVBQUEsTUFBQTs7QUFBQSxVQUFPLEtBQUEsU0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLFlBQUcsS0FBQSxLQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsVUFBQSxNQUFBLEdBQVMsSUFBSSxVQUFBLENBQUosU0FBQSxDQUFjLEtBQXZCLE9BQVMsQ0FBVDtBQUNBLGVBQUEsU0FBQSxHQUFhLE1BQU0sQ0FBTixhQUFBLENBQXFCLEtBQUEsTUFBQSxHQUFyQixlQUFxQixFQUFyQixFQUFiLE1BQUE7QUFGRixTQUFBLE1BQUE7QUFJRSxlQUFBLFNBQUEsR0FBYSxLQUFBLEdBQUEsR0FBTyxLQUFBLE1BQUEsR0FBcEIsT0FBb0IsRUFBcEI7QUFMSjtBQ3FJQzs7QUQvSEQsYUFBTyxLQUFQLFNBQUE7QUFQUztBQW5LTjtBQUFBO0FBQUEsNENBMktvQixJQTNLcEIsRUEyS29CO0FBQ3ZCLFVBQUEsR0FBQTs7QUFBQSxVQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBTSxJQUFBLE1BQUEsQ0FBVyxVQUFRLEtBQVIsU0FBUSxFQUFSLEdBQVgsR0FBQSxFQUFOLElBQU0sQ0FBTjtBQUNBLGVBQU8sSUFBSSxDQUFKLE9BQUEsQ0FBQSxHQUFBLEVBQVAsRUFBTyxDQUFQO0FBRkYsT0FBQSxNQUFBO0FBSUUsZUFBQSxJQUFBO0FDb0lEO0FEeklzQjtBQTNLcEI7QUFBQTtBQUFBLHNDQWlMYyxJQWpMZCxFQWlMYztBQUNqQixVQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFJLENBQWYsSUFBVyxFQUFYO0FBQ0EsTUFBQSxNQUFBLEdBQVMsSUFBSSxVQUFBLENBQUosU0FBQSxDQUFjLEtBQXZCLE9BQVMsQ0FBVDtBQUNBLE1BQUEsTUFBTSxDQUFOLGNBQUEsQ0FBc0IsUUFBUSxDQUE5QixpQkFBc0IsRUFBdEIsRUFBQSxLQUFBOztBQUNBLFVBQUcsS0FBQSxTQUFBLENBQUgsWUFBRyxDQUFILEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sWUFBQSxDQUFOLFFBQU0sQ0FBTjtBQURGLG1CQUUyQixDQUFDLEdBQUcsQ0FBSixLQUFBLEVBQVksR0FBRyxDQUF4QyxHQUF5QixDQUYzQjtBQUVHLFFBQUEsSUFBSSxDQUFMLEtBRkY7QUFFZSxRQUFBLElBQUksQ0FBakIsR0FGRjtBQUdFLGFBQUEsU0FBQSxHQUFhLE1BQU0sQ0FBbkIsTUFBQTtBQUNBLFFBQUEsSUFBSSxDQUFKLElBQUEsR0FBWSxLQUFBLFdBQUEsQ0FBYSxJQUFJLENBQTdCLElBQVksQ0FBWjtBQUpGLE9BQUEsTUFBQTtBQU1FLFFBQUEsSUFBSSxDQUFKLElBQUEsR0FBWSxLQUFBLFdBQUEsQ0FBYSxJQUFJLENBQTdCLElBQVksQ0FBWjtBQUNBLFFBQUEsSUFBSSxDQUFKLEtBQUEsR0FBYSxRQUFRLENBQXJCLE9BQWEsRUFBYjtBQUNBLFFBQUEsSUFBSSxDQUFKLEdBQUEsR0FBVyxRQUFRLENBQW5CLE9BQVcsRUFBWDtBQUNBLFFBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBTixhQUFBLENBQXFCLFFBQVEsQ0FBUixlQUFBLEtBQTZCLEtBQUEsUUFBQSxDQUE3QixNQUFBLEdBQWdELElBQUksQ0FBcEQsSUFBQSxHQUE0RCxLQUFBLFFBQUEsQ0FBNUQsTUFBQSxHQUErRSxRQUFRLENBQTVHLGVBQW9HLEVBQXBHLEVBQWdJO0FBQUMsVUFBQSxTQUFBLEVBQVU7QUFBWCxTQUFoSSxDQUFOOztBQVRGLHlCQVV3QyxHQUFHLENBQUgsS0FBQSxDQUFVLEtBQUEsUUFBQSxDQUFoRCxNQUFzQyxDQVZ4Qzs7QUFBQTs7QUFVRyxRQUFBLElBQUksQ0FBTCxNQVZGO0FBVWUsUUFBQSxJQUFJLENBQWpCLElBVkY7QUFVeUIsUUFBQSxJQUFJLENBQTNCLE1BVkY7QUNvSkM7O0FEeklELGFBQUEsSUFBQTtBQWZpQjtBQWpMZDtBQUFBO0FBQUEsd0NBaU1nQixJQWpNaEIsRUFpTWdCO0FBQ25CLFVBQUEsU0FBQSxFQUFBLENBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxJQUFJLENBQWhCLGtCQUFZLEVBQVo7O0FBQ0EsVUFBRyxLQUFBLEdBQUEsSUFBQSxJQUFBLElBQVUsS0FBQSxRQUFBLENBQVYsV0FBQSxJQUFvQyxLQUFBLFNBQUEsQ0FBdkMsYUFBdUMsQ0FBdkMsRUFBQTtBQUNFLFlBQUcsQ0FBQSxDQUFBLEdBQUEsS0FBQSxRQUFBLENBQUEsWUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLFNBQUEsR0FBWSxJQUFJLENBQUosS0FBQSxHQUFXLElBQUksQ0FBSixNQUFBLENBQVgsTUFBQSxHQUFaLENBQUE7QUM4SUQ7O0FEN0lELFFBQUEsSUFBSSxDQUFKLElBQUEsR0FBWSxLQUFBLFFBQUEsQ0FBQSxZQUFBLENBQXVCLElBQUksQ0FBdkMsSUFBWSxDQUFaO0FDK0lEOztBRDlJRCxhQUFBLFNBQUE7QUFObUI7QUFqTWhCO0FBQUE7QUFBQSwrQkF3TU8sSUF4TVAsRUF3TU87QUFDVixVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxXQUFBLEVBQUEsWUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsWUFBQTs7QUFBQSxVQUFHLEtBQUEsUUFBQSxJQUFBLElBQUEsSUFBZSxLQUFBLFFBQUEsQ0FBQSxNQUFBLEdBQWxCLENBQUEsRUFBQTtBQUNFLFFBQUEsWUFBQSxHQUFlLENBQWYsSUFBZSxDQUFmO0FBQ0EsUUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFuQixZQUFlLEVBQWY7QUFDQSxRQUFBLEdBQUEsR0FBQSxLQUFBLFFBQUE7O0FBQUEsYUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTtBQ29KRSxVQUFBLEdBQUcsR0FBRyxHQUFHLENBQVQsQ0FBUyxDQUFUOztBRG5KQSxjQUFHLENBQUEsS0FBSCxDQUFBLEVBQUE7QUFDRSxZQUFBLFdBQUEsR0FBYyxHQUFHLENBQWpCLEtBQUE7QUFERixXQUFBLE1BQUE7QUFHRSxZQUFBLE9BQUEsR0FBVSxJQUFJLENBQUosSUFBQSxHQUFBLFdBQUEsQ0FBd0IsR0FBRyxDQUFILEtBQUEsR0FBbEMsV0FBVSxDQUFWOztBQUNBLGdCQUFHLE9BQU8sQ0FBUCxZQUFBLE9BQUgsWUFBQSxFQUFBO0FBQ0UsY0FBQSxZQUFZLENBQVosSUFBQSxDQUFBLE9BQUE7QUFMSjtBQzJKQztBRDVKSDs7QUFPQSxlQUFBLFlBQUE7QUFWRixPQUFBLE1BQUE7QUFZRSxlQUFPLENBQVAsSUFBTyxDQUFQO0FDd0pEO0FEcktTO0FBeE1QO0FBQUE7QUFBQSxnQ0FzTlEsSUF0TlIsRUFzTlE7QUMySlgsYUQxSkEsS0FBQSxnQkFBQSxDQUFrQixJQUFJLFlBQUEsQ0FBSixXQUFBLENBQWdCLEtBQWhCLEdBQUEsRUFBcUIsS0FBckIsU0FBcUIsRUFBckIsRUFBbEIsSUFBa0IsQ0FBbEIsQ0MwSkE7QUQzSlc7QUF0TlI7QUFBQTtBQUFBLHFDQXdOYSxJQXhOYixFQXdOYTtBQUNoQixVQUFBLFNBQUEsRUFBQSxZQUFBO0FBQUEsTUFBQSxJQUFJLENBQUosVUFBQSxDQUFnQixLQUFBLFFBQUEsQ0FBaEIsTUFBQTs7QUFDQSxVQUFHLEtBQUEsS0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGFBQUEsaUJBQUEsQ0FBQSxJQUFBO0FBREYsT0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFJLENBQUosSUFBQSxHQUFZLEtBQUEsV0FBQSxDQUFhLElBQUksQ0FBN0IsSUFBWSxDQUFaO0FDOEpEOztBRDdKRCxNQUFBLFNBQUEsR0FBWSxLQUFBLG1CQUFBLENBQVosSUFBWSxDQUFaO0FBQ0EsTUFBQSxJQUFJLENBQUosVUFBQSxHQUFrQixDQUFDLElBQUksSUFBQSxDQUFKLEdBQUEsQ0FBQSxTQUFBLEVBQW5CLFNBQW1CLENBQUQsQ0FBbEI7QUFDQSxNQUFBLFlBQUEsR0FBZSxLQUFBLFVBQUEsQ0FBZixJQUFlLENBQWY7QUFDQSxXQUFBLFlBQUEsR0FBZ0IsSUFBSSxDQUFwQixLQUFBO0FBQ0EsV0FBQSxVQUFBLEdBQWMsSUFBSSxDQUFsQixNQUFjLEVBQWQ7QUMrSkEsYUQ5SkEsS0FBQSxRQUFBLENBQUEsTUFBQSxDQUFBLGlCQUFBLENBQUEsWUFBQSxDQzhKQTtBRHpLZ0I7QUF4TmI7O0FBQUE7QUFBQSxFQUFvQyxZQUFBLENBQXBDLFdBQUEsQ0FBUDs7Ozs7Ozs7Ozs7Ozs7QUVUQSxJQUFhLE9BQU4sR0FDTCxtQkFBYTtBQUFBO0FBQUEsQ0FEZjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQ0EsSUFBQSxPQUFBLEdBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBQTs7QUFFQSxJQUFhLE9BQU47QUFBQTtBQUFBO0FBQ0wsbUJBQWEsTUFBYixFQUFhO0FBQUE7O0FBQUMsU0FBQSxNQUFBLEdBQUEsTUFBQTtBQUFEOztBQURSO0FBQUE7QUFBQSx5QkFHQyxHQUhELEVBR0MsR0FIRCxFQUdDO0FBQ0osVUFBRyxLQUFILGVBQUcsRUFBSCxFQUFBO0FDSUUsZURIQSxLQUFBLE1BQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxFQUFBLEdBQUEsQ0NHQTtBQUNEO0FETkc7QUFIRDtBQUFBO0FBQUEsK0JBT08sSUFQUCxFQU9PLEdBUFAsRUFPTyxHQVBQLEVBT087QUFDVixVQUFHLEtBQUgsZUFBRyxFQUFILEVBQUE7QUNNRSxlRExBLEtBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsQ0NLQTtBQUNEO0FEUlM7QUFQUDtBQUFBO0FBQUEseUJBV0MsR0FYRCxFQVdDO0FBQ0osVUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUNRRSxlRFBBLEtBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENDT0E7QUFDRDtBRFZHO0FBWEQ7QUFBQTtBQUFBLHNDQWVZO0FBQ2YsVUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUNVRSxlRFRBLElDU0E7QURWRixPQUFBLE1BQUE7QUFHRSxhQUFBLE1BQUEsR0FBVSxLQUFBLE1BQUEsSUFBVyxJQUFJLE9BQUEsQ0FBekIsTUFBcUIsRUFBckI7QUFDQSxhQUFBLE1BQUEsQ0FBQSxHQUFBLENBQUEsNkJBQUE7QUNVQSxlRFRBLEtDU0E7QUFDRDtBRGhCYztBQWZaOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUhBLElBQUEsV0FBQSxHQUFBLE9BQUEsQ0FBQSxjQUFBLENBQUE7O0FBQ0EsSUFBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUE7O0FBREEsSUFBQSxTQUFBOztBQUdBLElBQWEsY0FBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLG1DQUNXLE1BRFgsRUFDVztBQUFBOztBQUVkLFVBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFBLElBQUE7O0FBRUEsTUFBQSxTQUFBLEdBQWEsbUJBQUEsQ0FBRCxFQUFBO0FBQ1YsWUFBRyxDQUFDLFFBQVEsQ0FBUixTQUFBLENBQUEsTUFBQSxHQUFBLENBQUEsSUFBaUMsS0FBQSxDQUFBLEdBQUEsS0FBUSxRQUFRLENBQWxELGFBQUEsS0FBc0UsQ0FBQyxDQUFELE9BQUEsS0FBdEUsRUFBQSxJQUF5RixDQUFDLENBQTdGLE9BQUEsRUFBQTtBQUNFLFVBQUEsQ0FBQyxDQUFELGNBQUE7O0FBQ0EsY0FBRyxLQUFBLENBQUEsZUFBQSxJQUFILElBQUEsRUFBQTtBQ09FLG1CRE5BLEtBQUEsQ0FBQSxlQUFBLEVDTUE7QURUSjtBQ1dDO0FEWkgsT0FBQTs7QUFLQSxNQUFBLE9BQUEsR0FBVyxpQkFBQSxDQUFELEVBQUE7QUFDUixZQUFHLEtBQUEsQ0FBQSxXQUFBLElBQUgsSUFBQSxFQUFBO0FDVUUsaUJEVEEsS0FBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLENDU0E7QUFDRDtBRFpILE9BQUE7O0FBR0EsTUFBQSxVQUFBLEdBQWMsb0JBQUEsQ0FBRCxFQUFBO0FBQ1gsWUFBeUIsT0FBQSxJQUF6QixJQUFBLEVBQUE7QUFBQSxVQUFBLFlBQUEsQ0FBQSxPQUFBLENBQUE7QUNhQzs7QUFDRCxlRGJBLE9BQUEsR0FBVSxVQUFBLENBQVksWUFBQTtBQUNwQixjQUFHLEtBQUEsQ0FBQSxXQUFBLElBQUgsSUFBQSxFQUFBO0FDY0UsbUJEYkEsS0FBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLENDYUE7QUFDRDtBRGhCTyxTQUFBLEVBQUEsR0FBQSxDQ2FWO0FEZkYsT0FBQTs7QUFPQSxVQUFHLE1BQU0sQ0FBVCxnQkFBQSxFQUFBO0FBQ0ksUUFBQSxNQUFNLENBQU4sZ0JBQUEsQ0FBQSxTQUFBLEVBQUEsU0FBQTtBQUNBLFFBQUEsTUFBTSxDQUFOLGdCQUFBLENBQUEsT0FBQSxFQUFBLE9BQUE7QUNlRixlRGRFLE1BQU0sQ0FBTixnQkFBQSxDQUFBLFVBQUEsRUFBQSxVQUFBLENDY0Y7QURqQkYsT0FBQSxNQUlLLElBQUcsTUFBTSxDQUFULFdBQUEsRUFBQTtBQUNELFFBQUEsTUFBTSxDQUFOLFdBQUEsQ0FBQSxXQUFBLEVBQUEsU0FBQTtBQUNBLFFBQUEsTUFBTSxDQUFOLFdBQUEsQ0FBQSxTQUFBLEVBQUEsT0FBQTtBQ2VGLGVEZEUsTUFBTSxDQUFOLFdBQUEsQ0FBQSxZQUFBLEVBQUEsVUFBQSxDQ2NGO0FBQ0Q7QUR6Q2E7QUFEWDs7QUFBQTtBQUFBLEdBQVA7Ozs7QUE2QkEsU0FBQSxHQUFZLG1CQUFBLEdBQUEsRUFBQTtBQUNWLE1BQUEsQ0FBQTs7QUFBQSxNQUFBO0FDb0JFO0FBQ0EsV0RuQkEsR0FBQSxZQUFlLFdDbUJmO0FEckJGLEdBQUEsQ0FBQSxPQUFBLEtBQUEsRUFBQTtBQUdNLElBQUEsQ0FBQSxHQUhOLEtBR00sQ0FITixDQ3dCRTtBQUNBO0FBQ0E7O0FEbkJBLFdBQVEsUUFBQSxHQUFBLE1BQUQsUUFBQyxJQUNMLEdBQUcsQ0FBSCxRQUFBLEtBREksQ0FBQyxJQUNnQixRQUFPLEdBQUcsQ0FBVixLQUFBLE1BRGpCLFFBQUMsSUFFTCxRQUFPLEdBQUcsQ0FBVixhQUFBLE1BRkgsUUFBQTtBQ3FCRDtBRDdCSCxDQUFBOztBQWFBLElBQWEsY0FBQSxHQUFBLFlBQUE7QUFBQSxNQUFOLGNBQU07QUFBQTtBQUFBO0FBQUE7O0FBQ1gsNEJBQWEsT0FBYixFQUFhO0FBQUE7O0FBQUE7O0FDcUJUO0FEckJVLGFBQUEsTUFBQSxHQUFBLE9BQUE7QUFFWixhQUFBLEdBQUEsR0FBVSxTQUFBLENBQVUsT0FBVixNQUFBLENBQUEsR0FBd0IsT0FBeEIsTUFBQSxHQUFxQyxRQUFRLENBQVIsY0FBQSxDQUF3QixPQUF2RSxNQUErQyxDQUEvQzs7QUFDQSxVQUFPLE9BQUEsR0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGNBQUEsb0JBQUE7QUNzQkM7O0FEckJILGFBQUEsU0FBQSxHQUFBLFVBQUE7QUFDQSxhQUFBLGVBQUEsR0FBQSxFQUFBO0FBQ0EsYUFBQSxnQkFBQSxHQUFBLENBQUE7QUFQVztBQUFBOztBQURGO0FBQUE7QUFBQSxrQ0FVRSxDQVZGLEVBVUU7QUFDWCxZQUFBLFFBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBOztBQUFBLFlBQUcsS0FBQSxnQkFBQSxJQUFILENBQUEsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFBLEtBQUEsZUFBQTtBQUFBLFVBQUEsT0FBQSxHQUFBLEVBQUE7O0FBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLElBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUMyQkksWUFBQSxRQUFRLEdBQUcsR0FBRyxDQUFkLENBQWMsQ0FBZDtBQUNBLFlBQUEsT0FBTyxDQUFQLElBQUEsQ0QzQkYsUUFBQSxFQzJCRTtBRDVCSjs7QUM4QkUsaUJBQUEsT0FBQTtBRC9CSixTQUFBLE1BQUE7QUFJRSxlQUFBLGdCQUFBOztBQUNBLGNBQXFCLEtBQUEsY0FBQSxJQUFyQixJQUFBLEVBQUE7QUM4QkksbUJEOUJKLEtBQUEsY0FBQSxFQzhCSTtBRG5DTjtBQ3FDRztBRHRDUTtBQVZGO0FBQUE7QUFBQSx3Q0FpQk07QUFBQSxZQUFDLEVBQUQsdUVBQUEsQ0FBQTtBQ21DYixlRGxDRixLQUFBLGdCQUFBLElBQXFCLEVDa0NuQjtBRG5DYTtBQWpCTjtBQUFBO0FBQUEsK0JBbUJELFFBbkJDLEVBbUJEO0FBQ1IsYUFBQSxlQUFBLEdBQW1CLFlBQUE7QUNxQ2YsaUJEckNrQixRQUFRLENBQVIsZUFBQSxFQ3FDbEI7QURyQ0osU0FBQTs7QUN1Q0UsZUR0Q0YsS0FBQSxjQUFBLENBQUEsUUFBQSxDQ3NDRTtBRHhDTTtBQW5CQztBQUFBO0FBQUEsNENBc0JVO0FDeUNqQixlRHhDRixvQkFBb0IsS0FBQyxHQ3dDbkI7QUR6Q2lCO0FBdEJWO0FBQUE7QUFBQSxpQ0F3QkQ7QUMyQ04sZUQxQ0YsUUFBUSxDQUFSLGFBQUEsS0FBMEIsS0FBQyxHQzBDekI7QUQzQ007QUF4QkM7QUFBQTtBQUFBLDJCQTBCTCxHQTFCSyxFQTBCTDtBQUNKLFlBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGNBQUEsQ0FBTyxLQUFBLGVBQUEsQ0FBUCxHQUFPLENBQVAsRUFBQTtBQUNFLGlCQUFBLEdBQUEsQ0FBQSxLQUFBLEdBQUEsR0FBQTtBQUZKO0FDZ0RHOztBQUNELGVEOUNGLEtBQUEsR0FBQSxDQUFLLEtDOENIO0FEbERFO0FBMUJLO0FBQUE7QUFBQSxpQ0ErQkMsS0EvQkQsRUErQkMsR0EvQkQsRUErQkMsSUEvQkQsRUErQkM7QUNpRFIsZURoREYsS0FBQSxlQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxHQUFBLEtBQXNDLEtBQUEseUJBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxFQUR4QyxHQUN3QyxDQUF0QyxtRkFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsQ0NnREU7QURqRFE7QUEvQkQ7QUFBQTtBQUFBLHNDQWlDTSxJQWpDTixFQWlDTTtBQUFBLFlBQU8sS0FBUCx1RUFBQSxDQUFBO0FBQUEsWUFBa0IsR0FBbEIsdUVBQUEsSUFBQTtBQUNmLFlBQUEsS0FBQTs7QUFBQSxZQUE2QyxRQUFBLENBQUEsV0FBQSxJQUE3QyxJQUFBLEVBQUE7QUFBQSxVQUFBLEtBQUEsR0FBUSxRQUFRLENBQVIsV0FBQSxDQUFSLFdBQVEsQ0FBUjtBQ3FERzs7QURwREgsWUFBRyxLQUFBLElBQUEsSUFBQSxJQUFXLEtBQUEsQ0FBQSxhQUFBLElBQVgsSUFBQSxJQUFvQyxLQUFLLENBQUwsU0FBQSxLQUF2QyxLQUFBLEVBQUE7QUFDRSxjQUF3QixHQUFBLElBQXhCLElBQUEsRUFBQTtBQUFBLFlBQUEsR0FBQSxHQUFNLEtBQU4sT0FBTSxFQUFOO0FDdURHOztBRHRESCxjQUFHLElBQUksQ0FBSixNQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0UsZ0JBQUcsS0FBQSxLQUFILENBQUEsRUFBQTtBQUNFLGNBQUEsSUFBQSxHQUFPLEtBQUEsVUFBQSxDQUFZLEtBQUEsR0FBWixDQUFBLEVBQVAsS0FBTyxDQUFQO0FBQ0EsY0FBQSxLQUFBO0FBRkYsYUFBQSxNQUdLLElBQUcsR0FBQSxLQUFPLEtBQVYsT0FBVSxFQUFWLEVBQUE7QUFDSCxjQUFBLElBQUEsR0FBTyxLQUFBLFVBQUEsQ0FBQSxHQUFBLEVBQWdCLEdBQUEsR0FBdkIsQ0FBTyxDQUFQO0FBQ0EsY0FBQSxHQUFBO0FBRkcsYUFBQSxNQUFBO0FBSUgscUJBQUEsS0FBQTtBQVJKO0FDaUVHOztBRHhESCxVQUFBLEtBQUssQ0FBTCxhQUFBLENBQUEsV0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFYRixDQVdFLEVBWEYsQ0NxRUk7O0FEeERGLGVBQUEsR0FBQSxDQUFBLGNBQUEsR0FBQSxLQUFBO0FBQ0EsZUFBQSxHQUFBLENBQUEsWUFBQSxHQUFBLEdBQUE7QUFDQSxlQUFBLEdBQUEsQ0FBQSxhQUFBLENBQUEsS0FBQTtBQUNBLGVBQUEsZUFBQTtBQzBERSxpQkR6REYsSUN5REU7QUQxRUosU0FBQSxNQUFBO0FDNEVJLGlCRHpERixLQ3lERTtBQUNEO0FEL0VZO0FBakNOO0FBQUE7QUFBQSxnREF1RGdCLElBdkRoQixFQXVEZ0I7QUFBQSxZQUFPLEtBQVAsdUVBQUEsQ0FBQTtBQUFBLFlBQWtCLEdBQWxCLHVFQUFBLElBQUE7O0FBQ3pCLFlBQUcsUUFBQSxDQUFBLFdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxjQUF3QixHQUFBLElBQXhCLElBQUEsRUFBQTtBQUFBLFlBQUEsR0FBQSxHQUFNLEtBQU4sT0FBTSxFQUFOO0FDOERHOztBRDdESCxlQUFBLEdBQUEsQ0FBQSxjQUFBLEdBQUEsS0FBQTtBQUNBLGVBQUEsR0FBQSxDQUFBLFlBQUEsR0FBQSxHQUFBO0FDK0RFLGlCRDlERixRQUFRLENBQVIsV0FBQSxDQUFBLFlBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxDQzhERTtBRGxFSixTQUFBLE1BQUE7QUNvRUksaUJEOURGLEtDOERFO0FBQ0Q7QUR0RXNCO0FBdkRoQjtBQUFBO0FBQUEscUNBZ0VHO0FBQ1osWUFBd0IsS0FBQSxZQUFBLElBQXhCLElBQUEsRUFBQTtBQUFBLGlCQUFPLEtBQVAsWUFBQTtBQ2tFRzs7QURqRUgsWUFBRyxLQUFILFFBQUEsRUFBQTtBQUNFLGNBQUcsS0FBSCxtQkFBQSxFQUFBO0FDbUVJLG1CRGxFRixJQUFJLElBQUEsQ0FBSixHQUFBLENBQVEsS0FBQSxHQUFBLENBQVIsY0FBQSxFQUE0QixLQUFBLEdBQUEsQ0FBNUIsWUFBQSxDQ2tFRTtBRG5FSixXQUFBLE1BQUE7QUNxRUksbUJEbEVGLEtBQUEsb0JBQUEsRUNrRUU7QUR0RU47QUN3RUc7QUQxRVM7QUFoRUg7QUFBQTtBQUFBLDZDQXVFVztBQUNwQixZQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7O0FBQUEsWUFBRyxLQUFBLEdBQUEsQ0FBSCxlQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxRQUFRLENBQVIsU0FBQSxDQUFOLFdBQU0sRUFBTjs7QUFDQSxjQUFHLEdBQUcsQ0FBSCxhQUFBLE9BQXVCLEtBQTFCLEdBQUEsRUFBQTtBQUNFLFlBQUEsR0FBQSxHQUFNLEtBQUEsR0FBQSxDQUFOLGVBQU0sRUFBTjtBQUNBLFlBQUEsR0FBRyxDQUFILGNBQUEsQ0FBbUIsR0FBRyxDQUF0QixXQUFtQixFQUFuQjtBQUNBLFlBQUEsR0FBQSxHQUFBLENBQUE7O0FBRUEsbUJBQU0sR0FBRyxDQUFILGdCQUFBLENBQUEsWUFBQSxFQUFBLEdBQUEsSUFBTixDQUFBLEVBQUE7QUFDRSxjQUFBLEdBQUE7QUFDQSxjQUFBLEdBQUcsQ0FBSCxPQUFBLENBQUEsV0FBQSxFQUF5QixDQUF6QixDQUFBO0FBRkY7O0FBR0EsWUFBQSxHQUFHLENBQUgsV0FBQSxDQUFBLGNBQUEsRUFBZ0MsS0FBQSxHQUFBLENBQWhDLGVBQWdDLEVBQWhDO0FBQ0EsWUFBQSxHQUFBLEdBQU0sSUFBSSxJQUFBLENBQUosR0FBQSxDQUFBLENBQUEsRUFBTixHQUFNLENBQU47O0FBQ0EsbUJBQU0sR0FBRyxDQUFILGdCQUFBLENBQUEsWUFBQSxFQUFBLEdBQUEsSUFBTixDQUFBLEVBQUE7QUFDRSxjQUFBLEdBQUcsQ0FBSCxLQUFBO0FBQ0EsY0FBQSxHQUFHLENBQUgsR0FBQTtBQUNBLGNBQUEsR0FBRyxDQUFILE9BQUEsQ0FBQSxXQUFBLEVBQXlCLENBQXpCLENBQUE7QUFIRjs7QUFJQSxtQkFBQSxHQUFBO0FBaEJKO0FDMEZHO0FEM0ZpQjtBQXZFWDtBQUFBO0FBQUEsbUNBeUZHLEtBekZILEVBeUZHLEdBekZILEVBeUZHO0FBQUE7O0FBQ1osWUFBZSxTQUFTLENBQVQsTUFBQSxHQUFmLENBQUEsRUFBQTtBQUFBLFVBQUEsR0FBQSxHQUFBLEtBQUE7QUM4RUc7O0FEN0VILFlBQUcsS0FBSCxtQkFBQSxFQUFBO0FBQ0UsZUFBQSxZQUFBLEdBQWdCLElBQUksSUFBQSxDQUFKLEdBQUEsQ0FBQSxLQUFBLEVBQWhCLEdBQWdCLENBQWhCO0FBQ0EsZUFBQSxHQUFBLENBQUEsY0FBQSxHQUFBLEtBQUE7QUFDQSxlQUFBLEdBQUEsQ0FBQSxZQUFBLEdBQUEsR0FBQTtBQUNBLFVBQUEsVUFBQSxDQUFZLFlBQUE7QUFDVixZQUFBLE1BQUEsQ0FBQSxZQUFBLEdBQUEsSUFBQTtBQUNBLFlBQUEsTUFBQSxDQUFBLEdBQUEsQ0FBQSxjQUFBLEdBQUEsS0FBQTtBQytFRSxtQkQ5RUYsTUFBQSxDQUFBLEdBQUEsQ0FBQSxZQUFBLEdBQW9CLEdDOEVsQjtBRGpGSixXQUFBLEVBQUEsQ0FBQSxDQUFBO0FBSkYsU0FBQSxNQUFBO0FBVUUsZUFBQSxvQkFBQSxDQUFBLEtBQUEsRUFBQSxHQUFBO0FDK0VDO0FEM0ZTO0FBekZIO0FBQUE7QUFBQSwyQ0F1R1csS0F2R1gsRUF1R1csR0F2R1gsRUF1R1c7QUFDcEIsWUFBQSxHQUFBOztBQUFBLFlBQUcsS0FBQSxHQUFBLENBQUgsZUFBQSxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sS0FBQSxHQUFBLENBQU4sZUFBTSxFQUFOO0FBQ0EsVUFBQSxHQUFHLENBQUgsU0FBQSxDQUFBLFdBQUEsRUFBQSxLQUFBO0FBQ0EsVUFBQSxHQUFHLENBQUgsUUFBQTtBQUNBLFVBQUEsR0FBRyxDQUFILE9BQUEsQ0FBQSxXQUFBLEVBQXlCLEdBQUEsR0FBekIsS0FBQTtBQ2tGRSxpQkRqRkYsR0FBRyxDQUFILE1BQUEsRUNpRkU7QUFDRDtBRHhGaUI7QUF2R1g7QUFBQTtBQUFBLGdDQThHRjtBQUNQLFlBQWlCLEtBQWpCLEtBQUEsRUFBQTtBQUFBLGlCQUFPLEtBQVAsS0FBQTtBQ3NGRzs7QURyRkgsWUFBa0MsS0FBQSxHQUFBLENBQUEsWUFBQSxDQUFsQyxXQUFrQyxDQUFsQyxFQUFBO0FDdUZJLGlCRHZGSixLQUFBLEdBQUEsQ0FBQSxZQUFBLENBQUEsV0FBQSxDQ3VGSTtBQUNEO0FEMUZJO0FBOUdFO0FBQUE7QUFBQSw4QkFpSEYsR0FqSEUsRUFpSEY7QUFDUCxhQUFBLEtBQUEsR0FBQSxHQUFBO0FDMkZFLGVEMUZGLEtBQUEsR0FBQSxDQUFBLFlBQUEsQ0FBQSxXQUFBLEVBQUEsR0FBQSxDQzBGRTtBRDVGSztBQWpIRTtBQUFBO0FBQUEsMENBb0hRO0FBQ2pCLGVBQUEsSUFBQTtBQURpQjtBQXBIUjtBQUFBO0FBQUEsd0NBc0hRLFFBdEhSLEVBc0hRO0FDK0ZmLGVEOUZGLEtBQUEsZUFBQSxDQUFBLElBQUEsQ0FBQSxRQUFBLENDOEZFO0FEL0ZlO0FBdEhSO0FBQUE7QUFBQSwyQ0F3SFcsUUF4SFgsRUF3SFc7QUFDcEIsWUFBQSxDQUFBOztBQUFBLFlBQUcsQ0FBQyxDQUFBLEdBQUksS0FBQSxlQUFBLENBQUEsT0FBQSxDQUFMLFFBQUssQ0FBTCxJQUEyQyxDQUE5QyxDQUFBLEVBQUE7QUNrR0ksaUJEakdGLEtBQUEsZUFBQSxDQUFBLE1BQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxDQ2lHRTtBQUNEO0FEcEdpQjtBQXhIWDtBQUFBO0FBQUEsd0NBNkhRLFlBN0hSLEVBNkhRO0FBQ2pCLFlBQUcsWUFBWSxDQUFaLE1BQUEsR0FBQSxDQUFBLElBQTRCLFlBQWEsQ0FBYixDQUFhLENBQWIsQ0FBQSxVQUFBLENBQUEsTUFBQSxHQUEvQixDQUFBLEVBQUE7QUFDRSxVQUFBLFlBQWEsQ0FBYixDQUFhLENBQWIsQ0FBQSxVQUFBLEdBQTZCLENBQUMsS0FBOUIsWUFBOEIsRUFBRCxDQUE3QjtBQ21HQzs7QURyR0wscUdBR1EsWUFIUjtBQUFtQjtBQTdIUjs7QUFBQTtBQUFBLElBQXVCLFdBQUEsQ0FBN0IsVUFBTTs7QUFBTjtBQ3dPTCxFQUFBLGNBQWMsQ0FBZCxTQUFBLENEL05BLGNDK05BLEdEL05nQixjQUFjLENBQWQsU0FBQSxDQUF5QixjQytOekM7QUFFQSxTQUFBLGNBQUE7QUQxT1csQ0FBQSxDQUFBLElBQUEsQ0FBQSxLQUFiLENBQWEsQ0FBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFN0NBLElBQUEsT0FBQSxHQUFBLE9BQUEsQ0FBQSxVQUFBLENBQUE7O0FBQ0EsSUFBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUE7O0FBRUEsSUFBYSxVQUFOO0FBQUE7QUFBQTtBQUFBOztBQUNMLHNCQUFhLEtBQWIsRUFBYTtBQUFBOztBQUFBOztBQ01YO0FETlksVUFBQSxLQUFBLEdBQUEsS0FBQTtBQUFEO0FBQUE7O0FBRFI7QUFBQTtBQUFBLHlCQUdDLEdBSEQsRUFHQztBQUNKLFVBQWdCLEdBQUEsSUFBaEIsSUFBQSxFQUFBO0FBQUEsYUFBQSxLQUFBLEdBQUEsR0FBQTtBQ1VDOztBQUNELGFEVkEsS0FBQyxLQ1VEO0FEWkk7QUFIRDtBQUFBO0FBQUEsK0JBTU8sR0FOUCxFQU1PO0FBQ1YsYUFBTyxLQUFBLElBQUEsR0FBUCxHQUFPLENBQVA7QUFEVTtBQU5QO0FBQUE7QUFBQSw0QkFRSSxHQVJKLEVBUUk7QUFDUCxhQUFPLEtBQUEsSUFBQSxHQUFQLE1BQUE7QUFETztBQVJKO0FBQUE7QUFBQSwrQkFVTyxLQVZQLEVBVU8sR0FWUCxFQVVPO0FBQ1YsYUFBTyxLQUFBLElBQUEsR0FBQSxTQUFBLENBQUEsS0FBQSxFQUFQLEdBQU8sQ0FBUDtBQURVO0FBVlA7QUFBQTtBQUFBLGlDQVlTLElBWlQsRUFZUyxHQVpULEVBWVM7QUNtQlosYURsQkEsS0FBQSxJQUFBLENBQU0sS0FBQSxJQUFBLEdBQUEsU0FBQSxDQUFBLENBQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxHQUErQixLQUFBLElBQUEsR0FBQSxTQUFBLENBQUEsR0FBQSxFQUFzQixLQUFBLElBQUEsR0FBM0QsTUFBcUMsQ0FBckMsQ0NrQkE7QURuQlk7QUFaVDtBQUFBO0FBQUEsK0JBY08sS0FkUCxFQWNPLEdBZFAsRUFjTyxJQWRQLEVBY087QUNxQlYsYURwQkEsS0FBQSxJQUFBLENBQU0sS0FBQSxJQUFBLEdBQUEsS0FBQSxDQUFBLENBQUEsRUFBQSxLQUFBLEtBQTJCLElBQUEsSUFBM0IsRUFBQSxJQUF5QyxLQUFBLElBQUEsR0FBQSxLQUFBLENBQS9DLEdBQStDLENBQS9DLENDb0JBO0FEckJVO0FBZFA7QUFBQTtBQUFBLG1DQWdCUztBQUNaLGFBQU8sS0FBUCxNQUFBO0FBRFk7QUFoQlQ7QUFBQTtBQUFBLGlDQWtCUyxLQWxCVCxFQWtCUyxHQWxCVCxFQWtCUztBQUNaLFVBQWUsU0FBUyxDQUFULE1BQUEsR0FBZixDQUFBLEVBQUE7QUFBQSxRQUFBLEdBQUEsR0FBQSxLQUFBO0FDMEJDOztBQUNELGFEMUJBLEtBQUEsTUFBQSxHQUFVLElBQUksSUFBQSxDQUFKLEdBQUEsQ0FBQSxLQUFBLEVBQUEsR0FBQSxDQzBCVjtBRDVCWTtBQWxCVDs7QUFBQTtBQUFBLEVBQXlCLE9BQUEsQ0FBekIsTUFBQSxDQUFQOzs7Ozs7Ozs7Ozs7Ozs7OztBRUhBLElBQUEsU0FBQSxHQUFBLE9BQUEsQ0FBQSxZQUFBLENBQUE7O0FBQ0EsSUFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLFdBQUEsQ0FBQTs7QUFDQSxJQUFBLG9CQUFBLEdBQUEsT0FBQSxDQUFBLDRCQUFBLENBQUE7O0FBQ0EsSUFBQSxrQkFBQSxHQUFBLE9BQUEsQ0FBQSwwQkFBQSxDQUFBOztBQUNBLElBQUEsbUJBQUEsR0FBQSxPQUFBLENBQUEsMkJBQUEsQ0FBQTs7QUFDQSxJQUFBLG9CQUFBLEdBQUEsT0FBQSxDQUFBLDRCQUFBLENBQUE7O0FBQ0EsSUFBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUE7O0FBQ0EsSUFBQSxXQUFBLEdBQUEsT0FBQSxDQUFBLDBCQUFBLENBQUE7O0FBQ0EsSUFBQSxtQkFBQSxHQUFBLE9BQUEsQ0FBQSxxQ0FBQSxDQUFBOztBQUVBLElBQUEsQ0FBQSxHQUFBLENBQUEsU0FBQSxHQUFnQixXQUFBLENBQWhCLFVBQUE7QUFFQSxTQUFBLENBQUEsUUFBQSxDQUFBLFNBQUEsR0FBQSxFQUFBO0FBRUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLEdBQW9CLENBQ2xCLElBQUksb0JBQUEsQ0FEYyxtQkFDbEIsRUFEa0IsRUFFbEIsSUFBSSxrQkFBQSxDQUZjLGlCQUVsQixFQUZrQixFQUdsQixJQUFJLG1CQUFBLENBSGMsa0JBR2xCLEVBSGtCLEVBSWxCLElBQUksb0JBQUEsQ0FKTixtQkFJRSxFQUprQixDQUFwQjs7QUFPQSxJQUFHLE9BQUEsWUFBQSxLQUFBLFdBQUEsSUFBQSxZQUFBLEtBQUgsSUFBQSxFQUFBO0FBQ0UsRUFBQSxRQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsR0FBa0IsSUFBSSxtQkFBQSxDQUF0QixrQkFBa0IsRUFBbEI7QUNzQkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQ0QsSUFBQSxRQUFBLEdBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQTs7QUFDQSxJQUFBLFNBQUEsR0FBQSxPQUFBLENBQUEsYUFBQSxDQUFBOztBQUNBLElBQUEsVUFBQSxHQUFBLE9BQUEsQ0FBQSxjQUFBLENBQUE7O0FBQ0EsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLGdCQUFBLENBQUE7O0FBQ0EsSUFBQSxhQUFBLEdBQUEsT0FBQSxDQUFBLHlCQUFBLENBQUE7O0FBQ0EsSUFBQSxXQUFBLEdBQUEsT0FBQSxDQUFBLHVCQUFBLENBQUE7O0FBQ0EsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLDRCQUFBLENBQUE7O0FBTkEsSUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsWUFBQSxFQUFBLFdBQUEsRUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQSxVQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFlBQUEsRUFBQSxhQUFBLEVBQUEsYUFBQSxFQUFBLFVBQUEsRUFBQSxnQkFBQTs7QUFRQSxJQUFhLG1CQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNkJBQ0ksSUFESixFQUNJO0FBQ1QsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFKLE1BQUEsQ0FBWSxJQUFJLFFBQUEsQ0FBSixPQUFBLENBQW5CLE1BQW1CLENBQVosQ0FBUDtBQUNBLE1BQUEsSUFBSSxDQUFKLFdBQUEsQ0FBaUIsSUFBSSxTQUFBLENBQXJCLFlBQWlCLEVBQWpCO0FDd0JFLGFEdEJGLElBQUksQ0FBSixPQUFBLENBQWE7QUFDWCxnQkFBTztBQUNMLHdCQURLLElBQUE7QUFFTCxvQkFGSyxJQUFBO0FBR0wsbUJBSEssSUFBQTtBQUlMLDBCQUFpQixDQUpaLEtBSVksQ0FKWjtBQUtMLGtCQUxLLGtGQUFBO0FBU0wsa0JBQVM7QUFDUCx3QkFBVztBQUNULDRCQURTLElBQUE7QUFFVCx3QkFBVztBQUZGLGFBREo7QUEyQ1Asd0JBQVc7QUFDVCw0QkFEUyxJQUFBO0FBRVQsd0JBQVc7QUFGRixhQTNDSjtBQXVEUCxtQkFBTTtBQUNKLHlCQUFXO0FBRFAsYUF2REM7QUEwRFAsMkJBQWM7QUFDWiw0QkFEWSxJQUFBO0FBRVosd0JBQVc7QUFGQyxhQTFEUDtBQWtIUCxvQkFBTztBQUNMLHlCQUFXO0FBRE4sYUFsSEE7QUFxSFAsdUJBQVU7QUFDUixzQkFBUztBQUNQLHlCQUFRO0FBQ04sNEJBQVc7QUFETDtBQURELGVBREQ7QUFnQlIsNEJBaEJRLElBQUE7QUFpQlIsd0JBQVc7QUFqQkgsYUFySEg7QUFtTFAsb0JBQU87QUFDTCx5QkFBVztBQUROLGFBbkxBO0FBc0xQLHlCQUFjO0FBdExQO0FBVEosU0FESTtBQXdNWCxzQkFBYTtBQUNYLG9CQURXLFVBQUE7QUFFWCxrQkFBUTtBQUZHLFNBeE1GO0FBOE1YLHdCQUFlO0FBQ2Isb0JBRGEsWUFBQTtBQUViLHlCQUZhLEtBQUE7QUFHYixrQkFBUTtBQUhLLFNBOU1KO0FBcU5YLHdCQUFlO0FBQ2IscUJBQVc7QUFERSxTQXJOSjtBQXdOWCx1QkFBYztBQUNaLHFCQURZLFdBQUE7QUFFWixrQkFBUTtBQUZJLFNBeE5IO0FBOE5YLG1CQUFVO0FBQ1Isb0JBRFEsVUFBQTtBQUVSLGtCQUFRO0FBRkEsU0E5TkM7QUFxT1gsZUFBTTtBQUNKLGlCQURJLE1BQUE7QUFFSixrQkFBUTtBQUZKLFNBck9LO0FBOE9YLGlCQUFRO0FBQ04saUJBRE0sUUFBQTtBQUVOLGtCQUFRO0FBRkYsU0E5T0c7QUFvUFgsaUJBQVE7QUFDTixvQkFETSxRQUFBO0FBRU4sa0JBQVE7QUFGRixTQXBQRztBQStQWCxnQkFBTztBQUNMLGtCQUFTLE9BQU8sQ0FBUCxPQUFBLENBQWdCO0FBQ3ZCLG9CQUFPO0FBQ0wseUJBQVc7QUFETjtBQURnQixXQUFoQixDQURKO0FBTUwsaUJBTkssT0FBQTtBQU9MLDBCQUFlLENBUFYsS0FPVSxDQVBWO0FBUUwsa0JBQVE7QUFSSCxTQS9QSTtBQTRRWCxrQkFBUztBQUNQLGtCQUFTO0FBQ1AsOEJBRE8seUZBQUE7QUFPUCx5QkFBYztBQVBQLFdBREY7QUFlUCxvQkFmTyxhQUFBO0FBZ0JQLG1CQWhCTyxJQUFBO0FBaUJQLDBCQUFlLENBQUEsTUFBQSxFQWpCUixJQWlCUSxDQWpCUjtBQWtCUCxrQkFBUTtBQWxCRCxTQTVRRTtBQXdTWCxrQkFBUztBQUNQLGtCQUFTO0FBQ1AsOEJBRE8seUZBQUE7QUFPUCx5QkFBYztBQVBQLFdBREY7QUFlUCxvQkFmTyxhQUFBO0FBZ0JQLG1CQWhCTyxJQUFBO0FBaUJQLDBCQUFlLENBakJSLEtBaUJRLENBakJSO0FBa0JQLGtCQUFRO0FBbEJELFNBeFNFO0FBK1RYLGlCQUFRO0FBQ04sa0JBQVM7QUFDUCx5QkFBYztBQURQLFdBREg7QUFTTixvQkFUTSxZQUFBO0FBVU4sbUJBQVU7QUFWSixTQS9URztBQTJVWCxxQkFBWTtBQUNWLGlCQURVLFlBQUE7QUFFVixrQkFBUTtBQUZFLFNBM1VEO0FBdVZYLGdCQUFPO0FBQ0wscUJBQVk7QUFEUCxTQXZWSTtBQTBWWCxnQkFBTztBQUNMLG9CQURLLFdBQUE7QUFFTCwwQkFBZSxDQUFBLE1BQUEsRUFBQSxLQUFBLEVBRlYsU0FFVSxDQUZWO0FBR0wsd0JBSEssSUFBQTtBQUlMLG1CQUpLLElBQUE7QUFLTCxrQkFBUTtBQUxILFNBMVZJO0FBc1dYLGNBQUs7QUFDSCxxQkFBWTtBQURULFNBdFdNO0FBeVdYLGVBQU07QUFDSixvQkFESSxVQUFBO0FBRUosMEJBQWUsQ0FGWCxNQUVXLENBRlg7QUFHSixrQkFBUTtBQUhKLFNBeldLO0FBZ1hYLGVBQU07QUFDSixvQkFESSxVQUFBO0FBRUosMEJBQWUsQ0FBQSxNQUFBLEVBQUEsT0FBQSxFQUZYLEtBRVcsQ0FGWDtBQUdKLGtCQUFRO0FBSEosU0FoWEs7QUF1WFgsc0JBQWE7QUFDWCxvQkFEVyxnQkFBQTtBQUVYLDBCQUFlLENBQUEsTUFBQSxFQUZKLE1BRUksQ0FGSjtBQUdYLGtCQUFRO0FBSEcsU0F2WEY7QUE4WFgsZ0JBQU87QUFDTCxxQkFBWTtBQURQLFNBOVhJO0FBaVlYLG9CQUFXO0FBQ1QsaUJBRFMsV0FBQTtBQUVULDBCQUFlLENBQUEsTUFBQSxFQUZOLEtBRU0sQ0FGTjtBQUdULGtCQUFRO0FBSEMsU0FqWUE7QUErWVgsaUJBQVE7QUFDTixpQkFETSxRQUFBO0FBRU4sa0JBQVE7QUFGRjtBQS9ZRyxPQUFiLENDc0JFO0FEMUJPO0FBREo7O0FBQUE7QUFBQSxHQUFQOzs7O0FBZ2FBLElBQUEsR0FBTyxjQUFBLFFBQUEsRUFBQTtBQUNMLE1BQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsV0FBQSxFQUFBLElBQUE7QUFBQSxFQUFBLE9BQUEsR0FBVSxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBNUIsS0FBNEIsQ0FBbEIsQ0FBVjs7QUFDQSxNQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxJQUFBLEdBQUEsR0FBTSxRQUFRLENBQVIsT0FBQSxDQUFBLGVBQUEsR0FBQSxNQUFBLENBQU4sT0FBTSxDQUFOOztBQUNBLFFBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLE1BQUEsT0FBQSxHQUFVLEdBQUcsQ0FBSCxNQUFBLENBQVYsTUFBVSxDQUFWO0FBQ0EsTUFBQSxJQUFBLEdBQVUsT0FBSCxlQUFxQixPQUFPLENBQTVCLFFBQUEsVUFBUCwrQkFBQTtBQUNBLE1BQUEsV0FBQSxHQUFpQixHQUFHLENBQUgsSUFBQSxDQUFBLE1BQUEsb0NBSVIsR0FBRyxDQUpLLFFBQUEsNEJBQWpCLEVBQUE7QUFRQSw0Q0FFZ0IsR0FBRyxDQUFDLFFBRnBCLHFCQUlJLElBSkosZUFBQSxXQUFBO0FBWEYsS0FBQSxNQUFBO0FBc0JFLGFBQUEsZUFBQTtBQXhCSjtBQUFBLEdBQUEsTUFBQTtBQTBCRSxXQUFBLG1CQUFBO0FDblBEO0FEdU5ILENBQUE7O0FBOEJBLFVBQUEsR0FBYSxvQkFBQSxRQUFBLEVBQUE7QUFDWCxNQUFBLEdBQUE7QUFBQSxFQUFBLEdBQUEsR0FBTSxJQUFBLE1BQUEsQ0FBVyxPQUFLLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixRQUFRLENBQVIsUUFBQSxDQUEvQixPQUFLLENBQUwsR0FBQSxHQUFBLEdBQWtFLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixRQUFRLENBQVIsUUFBQSxDQUE3RyxhQUFtRixDQUE3RSxDQUFOO0FBQ0EsU0FBTyxRQUFRLENBQVIsR0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQVAsSUFBTyxDQUFQO0FBRkYsQ0FBQTs7QUFJQSxZQUFBLEdBQWUsc0JBQUEsUUFBQSxFQUFBO0FBQ2IsU0FBTyxRQUFRLENBQVIsT0FBQSxDQUFBLE9BQUEsQ0FBQSxLQUFBLEVBQVAsSUFBTyxDQUFQO0FBREYsQ0FBQTs7QUFFQSxXQUFBLEdBQWMscUJBQUEsUUFBQSxFQUFBO0FBQ1osTUFBQSxHQUFBOztBQUFBLE1BQUcsUUFBQSxDQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxJQUFBLEdBQUEsR0FBTSxRQUFRLENBQVIsTUFBQSxDQUFOLE9BQU0sRUFBTjtBQUNBLElBQUEsUUFBUSxDQUFSLFlBQUEsR0FBd0IsUUFBUSxDQUFSLE1BQUEsQ0FBeEIsWUFBQTtBQUNBLElBQUEsUUFBUSxDQUFSLFVBQUEsR0FBc0IsUUFBUSxDQUFSLE1BQUEsQ0FBdEIsVUFBQTtBQUNBLFdBQUEsR0FBQTtBQzVPRDtBRHVPSCxDQUFBOztBQU1BLFVBQUEsR0FBYSxvQkFBQSxRQUFBLEVBQUE7QUFDWCxNQUFBLGFBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQTtBQUFBLEVBQUEsYUFBQSxHQUFnQixRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFsQixlQUFrQixDQUFsQixFQUFoQixLQUFnQixDQUFoQjtBQUNBLEVBQUEsTUFBQSxHQUFTLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQWxCLFFBQWtCLENBQWxCLEVBQVQsRUFBUyxDQUFUO0FBQ0EsRUFBQSxNQUFBLEdBQVMsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBbEIsUUFBa0IsQ0FBbEIsRUFBVCxFQUFTLENBQVQ7O0FBQ0EsTUFBRyxRQUFBLENBQUEsUUFBQSxDQUFBLFVBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxXQUFPLE1BQUEsSUFBVSxRQUFRLENBQVIsUUFBQSxDQUFBLFVBQUEsQ0FBQSxPQUFBLElBQVYsRUFBQSxDQUFBLEdBQVAsTUFBQTtBQ3hPRDs7QUR5T0QsTUFBQSxhQUFBLEVBQUE7QUFDRSxXQUFPLE1BQUEsR0FBUCxNQUFBO0FDdk9EO0FEZ09ILENBQUE7O0FBUUEsYUFBQSxHQUFnQix1QkFBQSxRQUFBLEVBQUE7QUNwT2QsU0RxT0EsT0FBTyxDQUFQLE9BQUEsR0FBQSxJQUFBLENBQXVCLFlBQUE7QUFDckIsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsUUFBQSxDQUFBLE9BQUEsQ0FBVixPQUFBO0FDbk9BLFdEb09BLE9BQU8sQ0FBUCxJQUFBLENBQUEsTUFBQSxDQ3BPQTtBRGtPRixHQUFBLEVBQUEsSUFBQSxDQUdPLFVBQUEsU0FBRCxFQUFBO0FBQ0osUUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxhQUFBO0FBQUEsSUFBQSxhQUFBLEdBQWdCLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQUEsQ0FBQSxFQUFsQyxNQUFrQyxDQUFsQixDQUFoQjtBQUNBLElBQUEsT0FBQSxHQUFVLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQUEsQ0FBQSxFQUE1QixJQUE0QixDQUFsQixDQUFWOztBQUNBLFFBQUcsYUFBQSxJQUFBLElBQUEsSUFBbUIsT0FBQSxJQUF0QixJQUFBLEVBQUE7QUFDRSxNQUFBLEdBQUEsR0FBTSxRQUFRLENBQVIsT0FBQSxDQUFBLGVBQUEsR0FBQSxNQUFBLENBQU4sYUFBTSxDQUFOOztBQUNBLFVBQUcsU0FBQSxDQUFBLGFBQUEsQ0FBQSxJQUFBLElBQUEsSUFBOEIsR0FBQSxJQUFqQyxJQUFBLEVBQUE7QUFDRSxZQUFBLEVBQU8sT0FBTyxDQUFQLE9BQUEsQ0FBQSxHQUFBLElBQXVCLENBQTlCLENBQUEsQ0FBQSxFQUFBO0FBQ0UsVUFBQSxPQUFBLEdBQVUsR0FBRyxDQUFILFFBQUEsQ0FBQSxPQUFBLENBQUEsYUFBQSxFQUFBLEVBQUEsSUFBVixPQUFBO0FDbE9EOztBRG1PRCxRQUFBLE9BQUEsR0FBVSxTQUFVLENBQXBCLGFBQW9CLENBQXBCOztBQUNBLFFBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxDQUFBLE9BQUEsRUFBQSxPQUFBOztBQUNBLFFBQUEsR0FBRyxDQUFILFVBQUE7QUFDQSxRQUFBLFNBQVUsQ0FBVixPQUFVLENBQVYsR0FBQSxPQUFBO0FBQ0EsZUFBTyxTQUFVLENBQWpCLGFBQWlCLENBQWpCO0FDak9BLGVEa09BLE9BQU8sQ0FBUCxPQUFBLEdBQUEsSUFBQSxDQUF1QixZQUFBO0FDak9yQixpQkRrT0EsT0FBTyxDQUFQLElBQUEsQ0FBQSxNQUFBLEVBQUEsU0FBQSxDQ2xPQTtBRGlPRixTQUFBLEVBQUEsSUFBQSxDQUVNLFlBQUE7QUFDSixpQkFBQSxFQUFBO0FBSEYsU0FBQSxDQ2xPQTtBRDBORixPQUFBLE1BWUssSUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0gsZUFBQSxvQkFBQTtBQURHLE9BQUEsTUFBQTtBQUdILGVBQUEsZUFBQTtBQWpCSjtBQzlNQztBRHdNSCxHQUFBLENDck9BO0FEb09GLENBQUE7O0FBeUJBLGFBQUEsR0FBZ0IsdUJBQUEsUUFBQSxFQUFBO0FDM05kLFNENE5BLE9BQU8sQ0FBUCxPQUFBLEdBQUEsSUFBQSxDQUF1QixZQUFBO0FBQ3JCLFFBQUEsSUFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQUEsQ0FBQSxFQUF6QixLQUF5QixDQUFsQixDQUFQOztBQUNBLFFBQUcsSUFBQSxJQUFILElBQUEsRUFBQTtBQzFORSxhRDJOQSxPQUFPLENBQVAsT0FBQSxHQUFBLElBQUEsQ0FBdUIsWUFBQTtBQUNyQixZQUFBLFNBQUEsRUFBQSxPQUFBO0FBQUEsUUFBQSxPQUFBLEdBQVUsUUFBQSxDQUFBLE9BQUEsQ0FBVixPQUFBO0FDek5BLGVEME5BLFNBQUEsR0FBWSxPQUFPLENBQVAsSUFBQSxDQUFBLE1BQUEsQ0MxTlo7QUR3TkYsT0FBQSxFQUFBLElBQUEsQ0FHTyxVQUFBLFNBQUQsRUFBQTtBQUNKLFlBQUEsR0FBQSxFQUFBLE9BQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxRQUFRLENBQVIsT0FBQSxDQUFBLGVBQUEsR0FBQSxNQUFBLENBQU4sSUFBTSxDQUFOOztBQUNBLFlBQUcsU0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBcUIsR0FBQSxJQUF4QixJQUFBLEVBQUE7QUFDRSxVQUFBLE9BQUEsR0FBVSxTQUFVLENBQXBCLElBQW9CLENBQXBCO0FBQ0EsVUFBQSxHQUFHLENBQUgsVUFBQTtBQUNBLGlCQUFPLFNBQVUsQ0FBakIsSUFBaUIsQ0FBakI7QUN4TkEsaUJEeU5BLE9BQU8sQ0FBUCxPQUFBLEdBQUEsSUFBQSxDQUF1QixZQUFBO0FDeE5yQixtQkR5TkEsT0FBTyxDQUFQLElBQUEsQ0FBQSxNQUFBLEVBQUEsU0FBQSxDQ3pOQTtBRHdORixXQUFBLEVBQUEsSUFBQSxDQUVNLFlBQUE7QUFDSixtQkFBQSxFQUFBO0FBSEYsV0FBQSxDQ3pOQTtBRHFORixTQUFBLE1BUUssSUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0gsaUJBQUEsb0JBQUE7QUFERyxTQUFBLE1BQUE7QUFHSCxpQkFBQSxlQUFBO0FDdk5EO0FEdU1ILE9BQUEsQ0MzTkE7QUFzQkQ7QURrTUgsR0FBQSxDQzVOQTtBRDJORixDQUFBOztBQXFCQSxZQUFBLEdBQWUsc0JBQUEsUUFBQSxFQUFBO0FBQ2IsTUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLElBQUE7QUFBQSxFQUFBLElBQUEsR0FBTyxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBekIsTUFBeUIsQ0FBbEIsQ0FBUDtBQUNBLEVBQUEsS0FBQSxHQUFRLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQUEsQ0FBQSxFQUExQixPQUEwQixDQUFsQixDQUFSOztBQUNBLE1BQUcsSUFBQSxJQUFBLElBQUEsSUFBVSxLQUFBLElBQWIsSUFBQSxFQUFBO0FBQ0UsSUFBQSxHQUFBLEdBQU0sUUFBUSxDQUFSLE9BQUEsQ0FBQSxNQUFBLENBQU4sSUFBTSxDQUFOOztBQUNBLFFBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLE1BQUEsR0FBQSxHQUFNLEdBQUcsQ0FBSCxVQUFBLE1BRFIsR0FDRSxDQURGLENDL01FO0FBQ0E7O0FEa05BLE1BQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxFQUF1QjtBQUFFLFFBQUEsT0FBQSxFQUFTLEdBQUcsQ0FBQztBQUFmLE9BQXZCOztBQUNBLGFBQUEsRUFBQTtBQUxGLEtBQUEsTUFBQTtBQU9FLGFBQUEsZUFBQTtBQVRKO0FDcE1DO0FEaU1ILENBQUE7O0FBY0EsV0FBQSxHQUFjLHFCQUFBLFFBQUEsRUFBQTtBQUNaLE1BQUEsR0FBQSxFQUFBLFFBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUEsVUFBQTtBQUFBLEVBQUEsR0FBQSxHQUFNLFFBQVEsQ0FBUixZQUFBLENBQXNCLENBQXRCLEtBQXNCLENBQXRCLEVBQU4sSUFBTSxDQUFOO0FBQ0EsRUFBQSxVQUFBLEdBQWEsUUFBUSxDQUFSLFlBQUEsQ0FBc0IsQ0FBdEIsU0FBc0IsQ0FBdEIsRUFBYixJQUFhLENBQWI7QUFDQSxFQUFBLElBQUEsR0FBTyxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBekIsTUFBeUIsQ0FBbEIsQ0FBUDtBQUNBLEVBQUEsVUFBQSxHQUFnQixJQUFILEdBQ1gsQ0FEVyxJQUNYLENBRFcsR0FHWCxRQUFRLENBQVIsT0FBQSxDQUFBLGFBQUEsR0FBQSxNQUFBLENBQXlDLFVBQUEsSUFBRCxFQUFBO0FDN014QyxXRDZNa0QsSUFBQSxLQUFRLFFBQVEsQ0FBUixHQUFBLENBQWEsUUM3TXZFO0FENk1BLEdBQUEsRUFBQSxNQUFBLENBSEYsT0FHRSxDQUhGO0FBS0EsRUFBQSxPQUFBLEdBQWEsVUFBSCxHQUNSLFFBQVEsQ0FBUixPQUFBLENBRFEsZUFDUixFQURRLEdBR1IsUUFBUSxDQUFSLFFBQUEsQ0FBQSxPQUFBLEdBSEYsT0FBQTtBQUtBLEVBQUEsUUFBQSxHQUFXLFVBQVUsQ0FBVixNQUFBLENBQWtCLFVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQTtBQUN6QixRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBUyxJQUFBLEtBQUEsT0FBQSxHQUFxQixRQUFBLENBQUEsT0FBQSxDQUFyQixJQUFBLEdBQXVDLE9BQU8sQ0FBUCxNQUFBLENBQUEsSUFBQSxFQUFvQjtBQUFBLE1BQUEsV0FBQSxFQUFZO0FBQVosS0FBcEIsQ0FBaEQ7O0FBQ0EsUUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsTUFBQSxHQUFHLENBQUgsSUFBQTs7QUFDQSxVQUFHLEdBQUcsQ0FBTixJQUFBLEVBQUE7QUFDRSxRQUFBLFFBQUEsR0FBVyxRQUFRLENBQVIsTUFBQSxDQUFnQixHQUFHLENBQTlCLElBQVcsQ0FBWDtBQUhKO0FDek1EOztBQUNELFdENE1FLFFDNU1GO0FEc01TLEdBQUEsRUFBWCxFQUFXLENBQVg7QUFTQSxFQUFBLElBQUEsR0FBVSxRQUFRLENBQVIsTUFBQSxHQUNSLFFBQVEsQ0FBUixHQUFBLENBQWMsVUFBQSxHQUFELEVBQUE7QUFDWCxJQUFBLEdBQUcsQ0FBSCxJQUFBO0FDN01GLFdEOE1FLENBQUksR0FBRyxDQUFILFlBQUEsS0FBQSxLQUFBLEdBQUosUUFBQSxJQUFpRCxHQUFHLENBQXBELFFBQUEsR0FBOEQsSUM5TWhFO0FENE1BLEdBQUEsRUFBQSxJQUFBLENBRFEsSUFDUixDQURRLEdBQVYsK0JBQUE7O0FBUUEsTUFBQSxHQUFBLEVBQUE7QUFDRSw4QkFFSSxJQUZKO0FBREYsR0FBQSxNQUFBO0FDOU1FLFdEdU5BLElDdk5BO0FBQ0Q7QUQ4S0gsQ0FBQTs7QUEwQ0EsVUFBQSxHQUFhLG9CQUFBLFFBQUEsRUFBQTtBQUNYLE1BQUEsSUFBQSxFQUFBLEdBQUE7QUFBQSxFQUFBLElBQUEsR0FBTyxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBekIsTUFBeUIsQ0FBbEIsQ0FBUDtBQUNBLEVBQUEsR0FBQSxHQUFNLFdBQUEsQ0FBQSxVQUFBLENBQUEsT0FBQSxDQUFtQixRQUFRLENBQVIsUUFBQSxDQUFuQixJQUFBLEVBQU4sSUFBTSxDQUFOOztBQUNBLE1BQUcsUUFBQSxHQUFBLE1BQUgsUUFBQSxFQUFBO0FDbk5FLFdEb05BLElBQUksQ0FBSixTQUFBLENBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENDcE5BO0FEbU5GLEdBQUEsTUFBQTtBQ2pORSxXRG9OQSxHQ3BOQTtBQUNEO0FENk1ILENBQUE7O0FBUUEsVUFBQSxHQUFhLG9CQUFBLFFBQUEsRUFBQTtBQUNYLE1BQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBO0FBQUEsRUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBQSxDQUFBLEVBQXpCLE1BQXlCLENBQWxCLENBQVA7QUFDQSxFQUFBLEdBQUEsR0FBUyxDQUFBLENBQUEsR0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLENBQUEsQ0FBQSxLQUFBLElBQUEsR0FBQSxDQUFBLEdBRUQsUUFBUSxDQUFSLE9BQUEsR0FDTixRQUFRLENBREYsT0FBQSxHQUFILEtBRkwsQ0FBQTs7QUFJQSxFQUFBLFdBQUEsQ0FBQSxVQUFBLENBQUEsT0FBQSxDQUFtQixRQUFRLENBQVIsUUFBQSxDQUFuQixJQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUE7O0FDbk5BLFNEb05BLEVDcE5BO0FENk1GLENBQUE7O0FBU0EsZ0JBQUEsR0FBbUIsMEJBQUEsUUFBQSxFQUFBO0FBQ2pCLE1BQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBO0FBQUEsRUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBQSxDQUFBLEVBQXpCLE1BQXlCLENBQWxCLENBQVA7QUFDQSxFQUFBLEdBQUEsR0FBUyxDQUFBLENBQUEsR0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUEsQ0FBQSxDQUFBLEtBQUEsSUFBQSxHQUFBLENBQUEsR0FFRCxRQUFRLENBQVIsT0FBQSxHQUNOLFFBQVEsQ0FERixPQUFBLEdBQUgsS0FGTCxDQUFBOztBQUlBLEVBQUEsV0FBQSxDQUFBLFVBQUEsQ0FBQSxPQUFBLENBQW1CLFFBQVEsQ0FBUixRQUFBLENBQW5CLElBQUEsRUFBQSxJQUFBLEVBQWdELElBQUksQ0FBSixLQUFBLENBQWhELEdBQWdELENBQWhEOztBQ3BOQSxTRHFOQSxFQ3JOQTtBRDhNRixDQUFBOztBQVNBLFFBQUEsR0FBVyxrQkFBQSxRQUFBLEVBQUE7QUFDVCxNQUFHLFFBQUEsQ0FBQSxRQUFBLENBQUEsVUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFdBQU8sUUFBUSxDQUFSLFFBQUEsQ0FBQSxVQUFBLENBQUEsUUFBQSxDQUFzQyxRQUFRLENBQTlDLE1BQUEsRUFBc0QsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBQSxLQUFBLEVBQS9FLFNBQStFLENBQWxCLENBQXRELENBQVA7QUNuTkQ7QURpTkgsQ0FBQTs7QUFJTSxNQUFOO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMkJBQ1E7QUFDSixXQUFBLE1BQUEsR0FBVSxJQUFJLFVBQUEsQ0FBSixTQUFBLENBQWMsS0FBQSxRQUFBLENBQXhCLE9BQVUsQ0FBVjtBQUNBLFdBQUEsR0FBQSxHQUFPLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBbUIsQ0FBMUIsS0FBMEIsQ0FBbkIsQ0FBUDs7QUFDQSxVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGFBQUEsTUFBQSxDQUFBLFFBQUEsR0FBb0IsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLE9BQUEsR0FBNkIsS0FBN0IsR0FBQSxHQUFvQyxLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQXhELE9BQUE7QUFDQSxhQUFBLE1BQUEsQ0FBQSxTQUFBLEdBQW9CLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxPQUFBLEdBQTZCLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBN0IsU0FBQSxHQUE0RCxLQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxFQUE1RCxDQUE0RCxDQUE1RCxHQUFpRixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQXJHLE9BQUE7QUNqTkQ7O0FEa05ELFdBQUEsTUFBQSxDQUFBLElBQUEsR0FBZSxLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQWYsSUFBQTtBQUNBLFdBQUEsTUFBQSxDQUFBLEdBQUEsR0FBQSxDQUFBO0FBQ0EsV0FBQSxNQUFBLENBQUEsTUFBQSxHQUFpQixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW1CLENBQW5CLFFBQW1CLENBQW5CLEVBQWpCLEVBQWlCLENBQWpCO0FDaE5BLGFEaU5BLEtBQUEsTUFBQSxDQUFBLE1BQUEsR0FBaUIsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFuQixRQUFtQixDQUFuQixFQUFBLEVBQUEsQ0NqTmpCO0FEd01JO0FBRFI7QUFBQTtBQUFBLDZCQVlVO0FBQ04sVUFBQSxNQUFBLEVBQUEsTUFBQTs7QUFBQSxVQUFHLEtBQUEsTUFBQSxNQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsTUFBQSxHQUFTLEtBQUEsTUFBQSxHQUFULE1BQUE7QUFERixPQUFBLE1BQUE7QUFHRSxRQUFBLE1BQUEsR0FBQSxDQUFBO0FDOU1EOztBRGdORCxNQUFBLE1BQUEsR0FBUyxDQUFULFFBQVMsQ0FBVDs7QUFDQSxVQUFHLEtBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxNQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0UsUUFBQSxNQUFNLENBQU4sSUFBQSxDQUFBLENBQUE7QUFERixPQUFBLE1BRUssSUFBRyxLQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxHQUFILENBQUEsRUFBQTtBQUNILFFBQUEsTUFBTSxDQUFOLElBQUEsQ0FBQSxDQUFBO0FDOU1EOztBRCtNRCxhQUFPLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLEVBQVAsTUFBTyxDQUFQO0FBWE07QUFaVjtBQUFBO0FBQUEsNEJBeUJTO0FBQ0wsVUFBQSxNQUFBLEVBQUEsS0FBQTs7QUFBQSxVQUFHLEtBQUEsTUFBQSxNQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsS0FBQSxHQUFRLEtBQUEsTUFBQSxHQUFSLEtBQUE7QUFERixPQUFBLE1BQUE7QUFHRSxRQUFBLEtBQUEsR0FBQSxDQUFBO0FDM01EOztBRDZNRCxNQUFBLE1BQUEsR0FBUyxDQUFULE9BQVMsQ0FBVDs7QUFDQSxVQUFHLEtBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxNQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0UsUUFBQSxNQUFNLENBQU4sSUFBQSxDQUFBLENBQUE7QUMzTUQ7O0FENE1ELGFBQU8sSUFBSSxDQUFKLEdBQUEsQ0FBUyxLQUFULFFBQVMsRUFBVCxFQUFzQixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxFQUE3QixLQUE2QixDQUF0QixDQUFQO0FBVEs7QUF6QlQ7QUFBQTtBQUFBLDZCQXFDVTtBQUNOLFVBQUcsS0FBQSxRQUFBLENBQUgsT0FBQSxFQUFBO0FBQ0UsWUFBTyxLQUFBLE9BQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxlQUFBLE9BQUEsR0FBVyxLQUFBLE1BQUEsQ0FBQSxVQUFBLENBQW1CLEtBQUEsUUFBQSxDQUE5QixPQUFXLENBQVg7QUMxTUQ7O0FEMk1ELGVBQU8sS0FBUCxPQUFBO0FDek1EO0FEcU1LO0FBckNWO0FBQUE7QUFBQSw2QkEyQ1U7QUFDTixXQUFBLE1BQUEsQ0FBQSxNQUFBLEdBQWlCLEtBQWpCLE1BQWlCLEVBQWpCO0FBQ0EsV0FBQSxNQUFBLENBQUEsS0FBQSxHQUFnQixLQUFoQixLQUFnQixFQUFoQjtBQUNBLGFBQU8sS0FBQSxNQUFBLENBQUEsSUFBQSxDQUFhLEtBQUEsUUFBQSxDQUFwQixPQUFPLENBQVA7QUFITTtBQTNDVjtBQUFBO0FBQUEsK0JBK0NZO0FBQ1IsVUFBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLEtBQUEsR0FBQSxDQUFQLE1BQUE7QUFERixPQUFBLE1BQUE7QUFHRSxlQUFBLENBQUE7QUNyTUQ7QURpTU87QUEvQ1o7O0FBQUE7QUFBQSxFQUFxQixRQUFBLENBQXJCLFdBQUEsQ0FBTTs7QUFxREEsUUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNRO0FDak1KLGFEa01BLEtBQUEsTUFBQSxHQUFVLElBQUksVUFBQSxDQUFKLFNBQUEsQ0FBYyxLQUFBLFFBQUEsQ0FBZCxPQUFBLENDbE1WO0FEaU1JO0FBRFI7QUFBQTtBQUFBLDhCQUdXO0FBQ1AsVUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsZ0JBQUEsRUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxNQUFBLENBQUEsTUFBQSxHQUFpQixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW1CLENBQW5CLFFBQW1CLENBQW5CLEVBQTFCLEVBQTBCLENBQTFCO0FBQ0EsTUFBQSxNQUFBLEdBQVMsS0FBQSxNQUFBLENBQUEsTUFBQSxHQUFpQixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW1CLENBQW5CLFFBQW1CLENBQW5CLEVBQTFCLEVBQTBCLENBQTFCO0FBQ0EsTUFBQSxHQUFBLEdBQU0sS0FBQSxNQUFBLENBQUEsWUFBQSxDQUFxQixLQUFBLFFBQUEsQ0FBM0IsTUFBMkIsRUFBckIsQ0FBTjtBQUNBLE1BQUEsZ0JBQUEsR0FBbUIsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFuQixrQkFBbUIsQ0FBbkIsRUFBbkIsSUFBbUIsQ0FBbkI7O0FBQ0EsVUFBRyxDQUFILGdCQUFBLEVBQUE7QUFDRSxhQUFBLE1BQUEsQ0FBQSxNQUFBLEdBQWlCLEtBQUEsTUFBQSxDQUFBLE1BQUEsR0FBakIsRUFBQTtBQUNBLFFBQUEsSUFBQSxHQUFPLEtBQUEsTUFBQSxDQUFBLFlBQUEsQ0FBcUIsS0FBQSxRQUFBLENBQTVCLE1BQTRCLEVBQXJCLENBQVA7O0FBQ0EsWUFBRyxJQUFBLElBQUEsSUFBQSxLQUFZLEdBQUEsSUFBQSxJQUFBLElBQVEsR0FBRyxDQUFILEtBQUEsR0FBWSxJQUFJLENBQUosS0FBQSxHQUFhLE1BQU0sQ0FBdkMsTUFBQSxJQUFrRCxHQUFHLENBQUgsR0FBQSxHQUFVLElBQUksQ0FBSixHQUFBLEdBQVcsTUFBTSxDQUE1RixNQUFHLENBQUgsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFBLElBQUE7QUFKSjtBQ3pMQzs7QUQ4TEQsVUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsS0FBQSxNQUFBLENBQUEsWUFBQSxDQUFxQixLQUFBLFFBQUEsQ0FBQSxNQUFBLEdBQTdCLEtBQVEsQ0FBUjs7QUFDQSxZQUFHLEtBQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxlQUFBLFFBQUEsQ0FBQSxLQUFBLEdBQUEsSUFBQTtBQzVMRDs7QUFDRCxlRDRMQSxLQUFBLFFBQUEsQ0FBQSxnQkFBQSxDQUEyQixJQUFJLFlBQUEsQ0FBSixXQUFBLENBQWdCLEdBQUcsQ0FBbkIsS0FBQSxFQUEwQixHQUFHLENBQTdCLEdBQUEsRUFBM0IsRUFBMkIsQ0FBM0IsQ0M1TEE7QUR3TEYsT0FBQSxNQUFBO0FDdExFLGVENExBLEtBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxFQUFBLENDNUxBO0FBQ0Q7QUQyS007QUFIWDs7QUFBQTtBQUFBLEVBQXVCLFFBQUEsQ0FBdkIsV0FBQSxDQUFNOztBQXFCQSxPQUFOO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMkJBQ1E7QUFDSixVQUFBLEdBQUE7QUFBQSxXQUFBLE9BQUEsR0FBVyxLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW1CLENBQUEsQ0FBQSxFQUE5QixLQUE4QixDQUFuQixDQUFYO0FBQ0EsV0FBQSxTQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQWEsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFoQyxDQUFnQyxDQUFuQixDQUFiLE1BQUEsR0FBQSxJQUFhLEdBQUEsS0FBYixXQUFBOztBQUNBLFVBQUcsS0FBQSxPQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsYUFBQSxNQUFBLEdBQVUsS0FBQSxRQUFBLENBQUEsT0FBQSxDQUFBLGVBQUEsR0FBQSxTQUFBLENBQThDLEtBQXhELE9BQVUsQ0FBVjtBQUNBLGFBQUEsTUFBQSxDQUFBLFlBQUEsR0FBQSxLQUFBO0FBQ0EsYUFBQSxHQUFBLEdBQU8sS0FBQSxNQUFBLENBQVAsSUFBTyxFQUFQO0FDdExEOztBQUNELGFEc0xBLEtBQUEsUUFBQSxHQUFlLEtBQUEsR0FBQSxJQUFBLElBQUEsR0FBVyxLQUFBLEdBQUEsQ0FBWCxVQUFXLEVBQVgsR0FBa0MsSUN0TGpEO0FEK0tJO0FBRFI7QUFBQTtBQUFBLDZCQVNVO0FBQ04sVUFBRyxLQUFBLFFBQUEsQ0FBSCxPQUFBLEVBQUE7QUFDRSxlQUFPLEtBQVAsaUJBQU8sRUFBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sS0FBUCxvQkFBTyxFQUFQO0FDbkxEO0FEK0tLO0FBVFY7QUFBQTtBQUFBLHdDQWNxQjtBQUNmLFVBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxRQUFBLENBQUEsZ0JBQUEsQ0FBMkIsS0FBQSxRQUFBLENBQXBDLE9BQVMsQ0FBVDtBQUNBLE1BQUEsTUFBTSxDQUFOLFFBQUE7QUFDQSxNQUFBLElBQUEsR0FBQSxFQUFBO0FBQ0EsTUFBQSxHQUFBLEdBQUEsT0FBQSxDQUFBLEtBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUM5S0EsUUFBQSxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQU8sQ0FBUDtBRCtLRSxRQUFBLENBQUMsQ0FBRCxRQUFBLENBQUEsTUFBQSxFQUFBLElBQUE7QUFERjs7QUFFQSxNQUFBLFFBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFnQixLQUFoQixPQUFBLEVBQUEsSUFBQTs7QUFDQSxhQUFBLEVBQUE7QUFQZTtBQWRyQjtBQUFBO0FBQUEsbUNBc0JnQjtBQUNWLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLEtBQU4sR0FBQTtBQUNBLGFBQU8sT0FBTyxDQUFQLEtBQUEsQ0FBQSxHQUFBLENBQW1CLFVBQUEsQ0FBQSxFQUFBO0FDeksxQixlRHlLZ0MsQ0FBQyxDQUFELE9BQUEsQ0FBQSxHQUFBLENDektoQztBRHlLTyxPQUFBLEVBQUEsTUFBQSxDQUFrRCxVQUFBLENBQUEsRUFBQTtBQ3ZLekQsZUR1SytELENBQUEsSUFBQSxJQ3ZLL0Q7QUR1S08sT0FBQSxFQUFBLElBQUEsQ0FBUCxJQUFPLENBQVA7QUFGVTtBQXRCaEI7QUFBQTtBQUFBLDJDQXlCd0I7QUFDcEIsVUFBQSxJQUFBLEVBQUEsTUFBQTs7QUFBQSxVQUFHLENBQUMsS0FBRCxHQUFBLElBQVMsS0FBWixRQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBVSxLQUFBLEdBQUEsR0FBVSxLQUFBLEdBQUEsQ0FBVixRQUFBLEdBQTZCLEtBQXZDLE9BQUE7QUFDQSxRQUFBLE1BQUEsR0FBUyxLQUFBLFFBQUEsQ0FBQSxnQkFBQSx1QkFFTSxLQUFBLFFBQUEsQ0FBQSxHQUFBLENBRGIsUUFETyxjQUVnQyxJQUZoQyxtQkFHTCxLQUhKLFlBR0ksRUFISyxzQ0FBVDtBQU9BLFFBQUEsTUFBTSxDQUFOLFdBQUEsR0FBQSxLQUFBOztBQUNPLFlBQUcsS0FBSCxTQUFBLEVBQUE7QUN4S0wsaUJEd0t3QixNQUFNLENBQU4sT0FBQSxFQ3hLeEI7QUR3S0ssU0FBQSxNQUFBO0FDdEtMLGlCRHNLOEMsTUFBTSxDQUFOLFFBQUEsRUN0SzlDO0FENEpKO0FDMUpDO0FEeUptQjtBQXpCeEI7O0FBQUE7QUFBQSxFQUFzQixRQUFBLENBQXRCLFdBQUEsQ0FBTTs7QUFxQ04sT0FBTyxDQUFQLE9BQUEsR0FBa0IsVUFBQSxJQUFBLEVBQUE7QUFDaEIsTUFBQSxDQUFBLEVBQUEsVUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQTtBQUFBLEVBQUEsVUFBQSxHQUFhLElBQUksQ0FBSixXQUFBLEdBQW1CO0FBQUMsSUFBQSxJQUFBLEVBQUs7QUFBTixHQUFoQztBQUNBLEVBQUEsR0FBQSxHQUFBLE9BQUEsQ0FBQSxLQUFBOztBQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDM0pFLElBQUEsQ0FBQyxHQUFHLEdBQUcsQ0FBUCxDQUFPLENBQVA7QUQ0SkEsSUFBQSxDQUFDLENBQUQsTUFBQSxDQUFTLFVBQVUsQ0FBbkIsSUFBQTtBQUhjLEdBQUEsQ0N0SmhCOzs7QUQySkEsU0FBQSxJQUFBO0FBTEYsQ0FBQTs7QUFNQSxPQUFPLENBQVAsS0FBQSxHQUFnQixDQUNkLElBQUksWUFBQSxDQUFBLFdBQUEsQ0FBSixPQUFBLENBQUEsV0FBQSxFQUE2QztBQUFDLEVBQUEsR0FBQSxFQUFJO0FBQUwsQ0FBN0MsQ0FEYyxFQUVkLElBQUksWUFBQSxDQUFBLFdBQUEsQ0FBSixPQUFBLENBQUEsVUFBQSxFQUE2QztBQUFDLEVBQUEsR0FBQSxFQUFJO0FBQUwsQ0FBN0MsQ0FGYyxFQUdkLElBQUksWUFBQSxDQUFBLFdBQUEsQ0FBSixJQUFBLENBQUEsbUJBQUEsRUFBNkM7QUFBQyxFQUFBLEdBQUEsRUFBSTtBQUFMLENBQTdDLENBSGMsRUFJZCxJQUFJLFlBQUEsQ0FBQSxXQUFBLENBQUosSUFBQSxDQUFBLGFBQUEsRUFBNkM7QUFBQyxFQUFBLEdBQUEsRUFBSTtBQUFMLENBQTdDLENBSmMsRUFLZCxJQUFJLFlBQUEsQ0FBQSxXQUFBLENBQUosTUFBQSxDQUFBLGVBQUEsRUFBNkM7QUFBQyxFQUFBLEdBQUEsRUFBSTtBQUFMLENBQTdDLENBTGMsRUFNZCxJQUFJLFlBQUEsQ0FBQSxXQUFBLENBQUosTUFBQSxDQUFBLFVBQUEsRUFBNkM7QUFBQyxTQUFELFNBQUE7QUFBZ0IsRUFBQSxNQUFBLEVBQU87QUFBdkIsQ0FBN0MsQ0FOYyxFQU9kLElBQUksWUFBQSxDQUFBLFdBQUEsQ0FBSixNQUFBLENBQUEsTUFBQSxFQUE2QztBQUFDLEVBQUEsS0FBQSxFQUFELE1BQUE7QUFBZSxFQUFBLFNBQUEsRUFBVTtBQUF6QixDQUE3QyxDQVBjLEVBUWQsSUFBSSxZQUFBLENBQUEsV0FBQSxDQUFKLE1BQUEsQ0FBQSxRQUFBLEVBQTZDO0FBQUMsU0FBRCxXQUFBO0FBQWtCLEVBQUEsUUFBQSxFQUFsQixRQUFBO0FBQXFDLEVBQUEsU0FBQSxFQUFyQyxJQUFBO0FBQXFELEVBQUEsTUFBQSxFQUFPO0FBQTVELENBQTdDLENBUmMsQ0FBaEI7O0FBVU0sWUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNRO0FDekhKLGFEMEhBLEtBQUEsSUFBQSxHQUFRLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBbUIsQ0FBbkIsQ0FBbUIsQ0FBbkIsQ0MxSFI7QUR5SEk7QUFEUjtBQUFBO0FBQUEsNkJBR1U7QUFDTixVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQTs7QUFBQSxVQUFHLEtBQUEsSUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGFBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxPQUFBLEdBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBa0QsS0FBbEQsSUFBQTtBQUNBLGVBQUEsRUFBQTtBQUZGLE9BQUEsTUFBQTtBQUlFLFFBQUEsVUFBQSxHQUFhLEtBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBYixhQUFhLEVBQWI7QUFDQSxRQUFBLEdBQUEsR0FBQSxXQUFBOztBQUNBLGFBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsVUFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDdEhFLFVBQUEsSUFBSSxHQUFHLFVBQVUsQ0FBakIsQ0FBaUIsQ0FBakI7O0FEdUhBLGNBQUcsSUFBQSxLQUFRLEtBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBWCxRQUFBLEVBQUE7QUFDRSxZQUFBLEdBQUEsSUFBTyxJQUFBLEdBQVAsSUFBQTtBQ3JIRDtBRG1ISDs7QUFHQSxRQUFBLEdBQUEsSUFBQSx1QkFBQTtBQUNBLFFBQUEsTUFBQSxHQUFTLEtBQUEsUUFBQSxDQUFBLGdCQUFBLENBQVQsR0FBUyxDQUFUO0FBQ0EsZUFBTyxNQUFNLENBQWIsUUFBTyxFQUFQO0FDbkhEO0FEdUdLO0FBSFY7O0FBQUE7QUFBQSxFQUEyQixRQUFBLENBQTNCLFdBQUEsQ0FBTTs7QUFrQkEsV0FBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNRO0FBQ0osV0FBQSxJQUFBLEdBQVEsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFBLENBQUEsRUFBM0IsTUFBMkIsQ0FBbkIsQ0FBUjtBQ2hIQSxhRGlIQSxLQUFBLEdBQUEsR0FBTyxLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW1CLENBQW5CLEtBQW1CLENBQW5CLEVBQUEsSUFBQSxDQ2pIUDtBRCtHSTtBQURSO0FBQUE7QUFBQSw2QkFJVTtBQUFBOztBQUNOLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFVLEtBQUEsSUFBQSxHQUFXLFdBQUEsQ0FBQSxVQUFBLENBQUEsT0FBQSxDQUFtQixLQUFBLFFBQUEsQ0FBQSxRQUFBLENBQW5CLElBQUEsRUFBNEMsS0FBdkQsSUFBVyxDQUFYLEdBQW1FLEtBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBN0UsSUFBQTs7QUFDQSxVQUFHLEtBQUEsUUFBQSxDQUFBLE9BQUEsSUFBc0IsSUFBQSxJQUF0QixJQUFBLElBQWdDLElBQUEsS0FBbkMsS0FBQSxFQUFBO0FBQ0UsWUFBRyxLQUFLLENBQUwsT0FBQSxDQUFILElBQUcsQ0FBSCxFQUFBO0FDN0dFLGlCRDhHQSxJQUFJLENBQUosR0FBQSxDQUFVLFVBQUEsSUFBRCxFQUFBO0FDN0dQLG1CRDZHZSxLQUFBLENBQUEsY0FBQSxDQUFBLElBQUEsQ0M3R2Y7QUQ2R0YsV0FBQSxFQUFBLElBQUEsQ0FDUSxLQURSLEdBQUEsQ0M5R0E7QUQ2R0YsU0FBQSxNQUFBO0FDekdFLGlCRDZHQSxLQUFBLGNBQUEsQ0FBQSxJQUFBLENDN0dBO0FEd0dKO0FBQUEsT0FBQSxNQUFBO0FDckdFLGVENEdBLEVDNUdBO0FBQ0Q7QURrR0s7QUFKVjtBQUFBO0FBQUEsbUNBY2tCLElBZGxCLEVBY2tCO0FBQ1osVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxRQUFBLENBQUEsZ0JBQUEsQ0FBMkIsS0FBQSxRQUFBLENBQXBDLE9BQVMsQ0FBVDtBQUNBLE1BQUEsTUFBTSxDQUFOLElBQUEsR0FBaUIsUUFBQSxJQUFBLE1BQUEsUUFBQSxHQUFBLElBQUEsR0FBdUM7QUFBQyxRQUFBLEtBQUEsRUFBTTtBQUFQLE9BQXhEO0FBQ0EsTUFBQSxNQUFNLENBQU4sV0FBQSxHQUFBLEtBQUE7QUNyR0YsYURzR0UsTUFBTSxDQUFOLFFBQUEsRUN0R0Y7QURrR2M7QUFkbEI7O0FBQUE7QUFBQSxFQUEwQixRQUFBLENBQTFCLFdBQUEsQ0FBTTs7QUFxQkEsUUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNRO0FBQ0osV0FBQSxJQUFBLEdBQVEsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFBLENBQUEsRUFBQSxNQUFBLEVBQTNCLGNBQTJCLENBQW5CLENBQVI7QUNuR0EsYURvR0EsS0FBQSxJQUFBLEdBQVEsS0FBQSxRQUFBLENBQUEsUUFBQSxDQUFtQixDQUFBLENBQUEsRUFBQSxNQUFBLEVBQW5CLFVBQW1CLENBQW5CLENDcEdSO0FEa0dJO0FBRFI7QUFBQTtBQUFBLDZCQUlVO0FBQ04sVUFBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUE7O0FBQUEsTUFBQSxLQUFBLEdBQUEsWUFBQTtBQ2hHRSxZQUFBLEdBQUEsRUFBQSxJQUFBOztBRGdHTSxZQUFHLENBQUEsT0FBQSxNQUFBLEtBQUEsV0FBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsTUFBQSxDQUFBLEtBQUEsR0FBQSxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUM5RkosaUJEK0ZGLE1BQU0sQ0FBQyxLQy9GTDtBRDhGSSxTQUFBLE1BRUgsSUFBRyxDQUFBLE9BQUEsTUFBQSxLQUFBLFdBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxHQUFBLENBQUEsR0FBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsQ0FBQSxLQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEtBQUgsSUFBQSxFQUFBO0FDOUZELGlCRCtGRixNQUFNLENBQU4sSUFBQSxDQUFZLEtDL0ZWO0FEOEZDLFNBQUEsTUFFQSxJQUFHLENBQUEsT0FBQSxNQUFBLEtBQUEsV0FBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsQ0FBQSxJQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUM5RkQsaUJEK0ZGLE1BQU0sQ0FBTixNQUFBLENBQWMsS0MvRlo7QUQ4RkMsU0FBQSxNQUVBLElBQUcsT0FBQSxPQUFBLEtBQUEsV0FBQSxJQUFBLE9BQUEsS0FBSCxJQUFBLEVBQUE7QUFDSCxjQUFBO0FDOUZJLG1CRCtGRixPQUFBLENBQUEsT0FBQSxDQy9GRTtBRDhGSixXQUFBLENBQUEsT0FBQSxLQUFBLEVBQUE7QUFFTSxZQUFBLEVBQUEsR0FBQSxLQUFBO0FBQ0osaUJBQUEsUUFBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxDQUFBLDhEQUFBO0FDN0ZFLG1CRDhGRixJQzlGRTtBRHlGRDtBQ3ZGRjtBRGlGSCxPQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQTs7QUFZQSxVQUFHLEtBQUEsSUFBSCxJQUFBLEVBQUE7QUMxRkU7QUQ0RkEsUUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFMLGtCQUFBLENBQXlCLEtBQXpCLElBQUEsRUFBZ0MsS0FBdEMsSUFBTSxDQUFOO0FDMUZBLGVEMkZBLEdBQUcsQ0FBSCxPQUFBLENBQUEsVUFBQSxFQUFBLEdBQUEsQ0MzRkE7QUFDRDtBRDBFSztBQUpWOztBQUFBO0FBQUEsRUFBdUIsUUFBQSxDQUF2QixXQUFBLENBQU07Ozs7Ozs7Ozs7Ozs7Ozs7QUVwd0JOLElBQUEsUUFBQSxHQUFBLE9BQUEsQ0FBQSxZQUFBLENBQUE7O0FBRUEsSUFBYSxtQkFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDZCQUNJLElBREosRUFDSTtBQUNULFVBQUEsR0FBQSxFQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFJLENBQUosTUFBQSxDQUFZLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBbkIsTUFBbUIsQ0FBWixDQUFQO0FBQ0EsTUFBQSxJQUFJLENBQUosT0FBQSxDQUFhO0FBQ1gsb0JBQVc7QUFDVCxxQkFEUyxZQUFBO0FBRVQsc0JBQWE7QUFBQyxvQkFBTztBQUFSLFdBRko7QUFHVCx5QkFBZ0I7QUFIUDtBQURBLE9BQWI7QUFRQSxNQUFBLEdBQUEsR0FBTSxJQUFJLENBQUosTUFBQSxDQUFZLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBbEIsS0FBa0IsQ0FBWixDQUFOO0FDSUUsYURIRixHQUFHLENBQUgsT0FBQSxDQUFZO0FBQ1Ysb0JBQVc7QUFDVCxxQkFEUyxZQUFBO0FBRVQsc0JBQWE7QUFBQyxvQkFBTztBQUFSLFdBRko7QUFHVCx5QkFBZ0I7QUFIUDtBQURELE9BQVosQ0NHRTtBRGRPO0FBREo7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVGQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsWUFBQSxDQUFBOztBQUVBLElBQWEsaUJBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw2QkFDSSxJQURKLEVBQ0k7QUFDVCxVQUFBLEVBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxJQUFJLENBQUosTUFBQSxDQUFZLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBakIsSUFBaUIsQ0FBWixDQUFMO0FBQ0EsTUFBQSxJQUFJLENBQUosTUFBQSxDQUFZLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBQSxZQUFBLEVBQXlCO0FBQUUsUUFBQSxPQUFBLEVBQVM7QUFBWCxPQUF6QixDQUFaO0FDS0UsYURKRixFQUFFLENBQUYsT0FBQSxDQUFXO0FBQ1QsbUJBRFMsbUJBQUE7QUFFVCxjQUZTLDBCQUFBO0FBR1QsZUFIUyxxREFBQTtBQUlULG9CQUpTLGtDQUFBO0FBS1QsaUJBQVE7QUFBRSxVQUFBLE9BQUEsRUFBUztBQUFYLFNBTEM7QUFNVCxhQUFJO0FBQU0sVUFBQSxPQUFBLEVBQVM7QUFBZixTQU5LO0FBT1QsZUFQUyxpREFBQTtBQVFULGlCQVJTLHdDQUFBO0FBU1QsZ0JBQU87QUFBRyxVQUFBLE9BQUEsRUFBUztBQUFaLFNBVEU7QUFVVCxtQkFBVTtBQUFHLFVBQUEsT0FBQSxFQUFTO0FBQVosU0FWRDtBQVdULGlCQVhTLDhCQUFBO0FBWVQsa0JBWlMsa0RBQUE7QUFhVCxrQkFiUywyQ0FBQTtBQWNULGVBQU07QUFBSSxVQUFBLE9BQUEsRUFBUztBQUFiLFNBZEc7QUFlVCxrQkFBVTtBQWZELE9BQVgsQ0NJRTtBRFBPO0FBREo7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVGQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEseUJBQUEsQ0FBQTs7QUFDQSxJQUFBLFFBQUEsR0FBQSxPQUFBLENBQUEsWUFBQSxDQUFBOztBQUNBLElBQUEsU0FBQSxHQUFBLE9BQUEsQ0FBQSxhQUFBLENBQUE7O0FBRkEsSUFBQSxXQUFBOztBQUlBLElBQWEsa0JBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw2QkFDSSxJQURKLEVBQ0k7QUFDVCxVQUFBLEdBQUEsRUFBQSxRQUFBLEVBQUEsUUFBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUksQ0FBSixNQUFBLENBQVksSUFBSSxRQUFBLENBQUosT0FBQSxDQUFsQixLQUFrQixDQUFaLENBQU47QUFDQSxNQUFBLEdBQUcsQ0FBSCxXQUFBLENBQWdCLElBQUksU0FBQSxDQUFKLFlBQUEsQ0FBaUI7QUFDL0IsUUFBQSxNQUFBLEVBRCtCLFdBQUE7QUFFL0IsUUFBQSxNQUFBLEVBRitCLE9BQUE7QUFHL0IsUUFBQSxNQUFBLEVBSCtCLElBQUE7QUFJL0IsUUFBQSxhQUFBLEVBSitCLElBQUE7QUFLL0IsZ0JBQVE7QUFMdUIsT0FBakIsQ0FBaEI7QUFRQSxNQUFBLFFBQUEsR0FBVyxHQUFHLENBQUgsTUFBQSxDQUFXLElBQUksUUFBQSxDQUFKLE9BQUEsQ0FBdEIsT0FBc0IsQ0FBWCxDQUFYO0FBQ0EsTUFBQSxRQUFRLENBQVIsT0FBQSxDQUFpQjtBQUNmLG9CQUFXO0FBQ1Qsa0JBQVM7QUFDUCwyQkFBZTtBQUNiLGNBQUEsT0FBQSxFQURhLGNBQUE7QUFFYixjQUFBLFFBQUEsRUFBVTtBQUNSLGdCQUFBLE1BQUEsRUFEUSxPQUFBO0FBRVIsZ0JBQUEsTUFBQSxFQUZRLFVBQUE7QUFHUixnQkFBQSxhQUFBLEVBQWU7QUFIUDtBQUZHO0FBRFIsV0FEQTtBQVdULFVBQUEsT0FBQSxFQVhTLGtCQUFBO0FBWVQsVUFBQSxXQUFBLEVBQWE7QUFaSixTQURJO0FBZWYsZUFBTztBQUNMLFVBQUEsT0FBQSxFQURLLFVBQUE7QUFFTCxVQUFBLFFBQUEsRUFBVTtBQUNSLFlBQUEsTUFBQSxFQURRLFNBQUE7QUFFUixZQUFBLE1BQUEsRUFBUTtBQUZBO0FBRkwsU0FmUTtBQXNCZixtQkF0QmUsbUJBQUE7QUF1QmYsUUFBQSxHQUFBLEVBQUs7QUF2QlUsT0FBakI7QUEwQkEsTUFBQSxRQUFBLEdBQVcsR0FBRyxDQUFILE1BQUEsQ0FBVyxJQUFJLFFBQUEsQ0FBSixPQUFBLENBQXRCLE9BQXNCLENBQVgsQ0FBWDtBQ1NFLGFEUkYsUUFBUSxDQUFSLE9BQUEsQ0FBaUI7QUFDZix1QkFBZTtBQUFFLFVBQUEsT0FBQSxFQUFTO0FBQVgsU0FEQTtBQUVmLG1CQUZlLG1CQUFBO0FBR2YsY0FIZSw4QkFBQTtBQUlmLGdCQUplLFlBQUE7QUFLZixnQkFMZSxRQUFBO0FBTWYsYUFBSTtBQUFJLFVBQUEsT0FBQSxFQUFTO0FBQWIsU0FOVztBQU9mLGlCQUFRO0FBQ04sVUFBQSxNQUFBLEVBRE0sdUZBQUE7QUFRTixVQUFBLFFBQUEsRUFBVTtBQUNSLFlBQUEsTUFBQSxFQUFRO0FBREE7QUFSSixTQVBPO0FBbUJmLGFBQUk7QUFBTSxVQUFBLE9BQUEsRUFBUztBQUFmLFNBbkJXO0FBb0JmLG9CQUFZO0FBQ1YsVUFBQSxNQUFBLEVBRFUsa0NBQUE7QUFFVixVQUFBLFFBQUEsRUFBVTtBQUNSLFlBQUEsTUFBQSxFQUFRO0FBREE7QUFGQSxTQXBCRztBQTBCZixpQkFBUTtBQUFFLFVBQUEsT0FBQSxFQUFTO0FBQVgsU0ExQk87QUEyQmYsYUFBSTtBQUFNLFVBQUEsT0FBQSxFQUFTO0FBQWYsU0EzQlc7QUE0QmYsaUJBNUJlLGVBQUE7QUE2QmYsYUE3QmUsU0FBQTtBQThCZixlQTlCZSxxREFBQTtBQStCZixtQkEvQmUsc0RBQUE7QUFnQ2YsZ0JBQU87QUFBRyxVQUFBLE9BQUEsRUFBUztBQUFaLFNBaENRO0FBaUNmLGlCQWpDZSxrQ0FBQTtBQWtDZixrQkFBVTtBQUNSLFVBQUEsTUFBQSxFQURRLG9EQUFBO0FBRVIsVUFBQSxRQUFBLEVBQVU7QUFDUixZQUFBLE1BQUEsRUFBUTtBQURBO0FBRkYsU0FsQ0s7QUF3Q2Ysa0JBeENlLCtDQUFBO0FBeUNmLGVBQU07QUFBSSxVQUFBLE9BQUEsRUFBUztBQUFiLFNBekNTO0FBMENmLGtCQUFVO0FBQ1IsVUFBQSxNQUFBLEVBRFEsNkZBQUE7QUFXUixVQUFBLFFBQUEsRUFBVTtBQUNSLFlBQUEsTUFBQSxFQUFRO0FBREE7QUFYRixTQTFDSztBQXlEZixpQkFBUztBQUNQLFVBQUEsT0FBQSxFQURPLFlBQUE7QUFFUCxVQUFBLFFBQUEsRUFBVTtBQUNSLFlBQUEsTUFBQSxFQURRLFNBQUE7QUFFUixZQUFBLE1BQUEsRUFGUSxNQUFBO0FBR1IsWUFBQSxnQkFBQSxFQUFrQjtBQUhWO0FBRkg7QUF6RE0sT0FBakIsQ0NRRTtBRDlDTztBQURKOztBQUFBO0FBQUEsR0FBUDs7OztBQTJHQSxXQUFBLEdBQWMscUJBQUEsTUFBQSxFQUFBLFFBQUEsRUFBQTtBQUNaLE1BQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxPQUFBO0FBQUEsRUFBQSxNQUFBLEdBQVMsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBQSxZQUFBLEVBQWxCLFFBQWtCLENBQWxCLEVBQVQsSUFBUyxDQUFUOztBQUNBLE1BQUEsTUFBQSxFQUFBO0FBQ0UsSUFBQSxPQUFBLEdBQUEsd0JBQUE7QUFDQSxJQUFBLFFBQUEsR0FBQSxtQkFBQTtBQUNBLFdBQU8sV0FBVyxNQUFNLENBQU4sT0FBQSxDQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsT0FBQSxDQUFBLFFBQUEsRUFBWCxPQUFXLENBQVgsR0FBUCxLQUFBO0FBSEYsR0FBQSxNQUFBO0FDZUUsV0RWQSxZQUFZLGFBQUEsQ0FBQSxZQUFBLENBQUEsTUFBQSxDQUFaLE1BQVksQ0FBWixHQUEwQyxNQ1UxQztBQUNEO0FEbEJILENBQUEsQyxDQS9HQTtBQ3FJQTs7Ozs7QUN0SUEsSUFBQSxVQUFBLEdBQUEsT0FBQSxDQUFBLGFBQUEsQ0FBQTs7QUFDQSxJQUFBLGVBQUEsR0FBQSxPQUFBLENBQUEsa0JBQUEsQ0FBQTs7QUFFQSxVQUFBLENBQUEsUUFBQSxDQUFBLE1BQUEsR0FBa0IsVUFBQSxNQUFBLEVBQUE7QUFDaEIsTUFBQSxFQUFBO0FBQUEsRUFBQSxFQUFBLEdBQUssSUFBSSxVQUFBLENBQUosUUFBQSxDQUFhLElBQUksZUFBQSxDQUFKLGNBQUEsQ0FBbEIsTUFBa0IsQ0FBYixDQUFMOztBQUNBLEVBQUEsVUFBQSxDQUFBLFFBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBLEVBQUE7O0FDT0EsU0ROQSxFQ01BO0FEVEYsQ0FBQTs7QUFLQSxVQUFBLENBQUEsUUFBQSxDQUFBLE9BQUEsR0FBQSxPQUFBO0FBRUEsTUFBTSxDQUFOLFFBQUEsR0FBa0IsVUFBQSxDQUFsQixRQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FFVkEsSUFBYSxXQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNEJBQ0ssR0FETCxFQUNLO0FBQ1IsYUFBTyxNQUFNLENBQU4sU0FBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxNQUFQLGdCQUFBO0FBRFE7QUFETDtBQUFBO0FBQUEsMEJBSUcsRUFKSCxFQUlHLEVBSkgsRUFJRztBQ0VOLGFEREEsS0FBQSxNQUFBLENBQVEsRUFBRSxDQUFGLE1BQUEsQ0FBUixFQUFRLENBQVIsQ0NDQTtBREZNO0FBSkg7QUFBQTtBQUFBLDJCQU9JLEtBUEosRUFPSTtBQUNQLFVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxDQUFBLEdBQUksS0FBSyxDQUFULE1BQUksRUFBSjtBQUNBLE1BQUEsQ0FBQSxHQUFBLENBQUE7O0FBQ0EsYUFBTSxDQUFBLEdBQUksQ0FBQyxDQUFYLE1BQUEsRUFBQTtBQUNFLFFBQUEsQ0FBQSxHQUFJLENBQUEsR0FBSixDQUFBOztBQUNBLGVBQU0sQ0FBQSxHQUFJLENBQUMsQ0FBWCxNQUFBLEVBQUE7QUFDRSxjQUFHLENBQUUsQ0FBRixDQUFFLENBQUYsS0FBUSxDQUFFLENBQWIsQ0FBYSxDQUFiLEVBQUE7QUFDRSxZQUFBLENBQUMsQ0FBRCxNQUFBLENBQVMsQ0FBVCxFQUFBLEVBQUEsQ0FBQTtBQ0lEOztBREhELFlBQUEsQ0FBQTtBQUhGOztBQUlBLFVBQUEsQ0FBQTtBQU5GOztBQ2FBLGFETkEsQ0NNQTtBRGhCTztBQVBKOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQUEsSUFBYSxZQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNEJBRUc7QUFBQSx3Q0FBQSxFQUFBO0FBQUEsUUFBQSxFQUFBO0FBQUE7O0FBQ04sVUFBQSxDQUFBLEVBQUEsSUFBQSxJQUFBLEdBQUcsRUFBRSxDQUFMLE1BQUEsR0FBTyxLQUFQLENBQUEsSUFBQSxDQUFBLEVBQUE7QUNBRSxlRENBLEtBQUEsR0FBQSxDQUFBLEVBQUEsRUFBUyxVQUFBLENBQUEsRUFBQTtBQUFPLGNBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBO0FBQXVCLFVBQUEsT0FBQSxHQUFBLEVBQUE7O0FBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNHbkMsWUFBQSxDQUFDLEdBQUcsRUFBRSxDQUFOLENBQU0sQ0FBTjtBQUNBLFlBQUEsT0FBTyxDQUFQLElBQUEsQ0FBYyxZQUFXO0FBQ3ZCLGtCQUFBLFFBQUE7QURMbUIsY0FBQSxRQUFBLEdBQUEsRUFBQTs7QUFBQSxtQkFBQSxDQUFBLElBQUEsQ0FBQSxFQUFBO0FDUWpCLGdCQUFBLENBQUMsR0FBRyxDQUFDLENBQUwsQ0FBSyxDQUFMO0FBQ0EsZ0JBQUEsUUFBUSxDQUFSLElBQUEsQ0RUUSxDQUFFLENBQUYsQ0FBRSxDQUFGLEdBQU8sQ0NTZjtBRFRpQjs7QUNXbkIscUJBQUEsUUFBQTtBQVBGLGFBQWMsRUFBZDtBREptQzs7QUNjckMsaUJBQUEsT0FBQTtBRGRGLFNBQUEsQ0NEQTtBQWlCRDtBRGxCSztBQUZIO0FBQUE7QUFBQSx3QkFNQyxDQU5ELEVBTUMsRUFORCxFQU1DO0FBQ0osTUFBQSxFQUFBLENBQUEsQ0FBQSxDQUFBO0FDa0JBLGFEakJBLENDaUJBO0FEbkJJO0FBTkQ7QUFBQTtBQUFBLGdDQVVTLFdBVlQsRUFVUyxTQVZULEVBVVM7QUNtQlosYURsQkEsU0FBUyxDQUFULE9BQUEsQ0FBbUIsVUFBQSxRQUFELEVBQUE7QUNtQmhCLGVEbEJBLE1BQU0sQ0FBTixtQkFBQSxDQUEyQixRQUFRLENBQW5DLFNBQUEsRUFBQSxPQUFBLENBQXdELFVBQUEsSUFBRCxFQUFBO0FDbUJyRCxpQkRsQkUsTUFBTSxDQUFOLGNBQUEsQ0FBQSxXQUFBLEVBQUEsSUFBQSxFQUF5QyxNQUFNLENBQU4sd0JBQUEsQ0FBZ0MsUUFBUSxDQUF4QyxTQUFBLEVBQXpDLElBQXlDLENBQXpDLENDa0JGO0FEbkJGLFNBQUEsQ0NrQkE7QURuQkYsT0FBQSxDQ2tCQTtBRG5CWTtBQVZUOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQ0EsSUFBYSxlQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsK0JBRVEsUUFGUixFQUVRO0FBQUEsVUFBVSxPQUFWLHVFQUFBLEtBQUE7QUFDWCxVQUFBLEtBQUE7O0FBQUEsVUFBRyxRQUFRLENBQVIsT0FBQSxDQUFBLEdBQUEsTUFBeUIsQ0FBekIsQ0FBQSxJQUFnQyxDQUFuQyxPQUFBLEVBQUE7QUFDRSxlQUFPLENBQUEsSUFBQSxFQUFQLFFBQU8sQ0FBUDtBQ0FEOztBRENELE1BQUEsS0FBQSxHQUFRLFFBQVEsQ0FBUixLQUFBLENBQVIsR0FBUSxDQUFSO0FBQ0EsYUFBTyxDQUFDLEtBQUssQ0FBTixLQUFDLEVBQUQsRUFBZSxLQUFLLENBQUwsSUFBQSxDQUFBLEdBQUEsS0FBdEIsSUFBTyxDQUFQO0FBSlc7QUFGUjtBQUFBO0FBQUEsMEJBUUcsUUFSSCxFQVFHO0FBQ04sVUFBQSxJQUFBLEVBQUEsS0FBQTs7QUFBQSxVQUFHLFFBQVEsQ0FBUixPQUFBLENBQUEsR0FBQSxNQUF5QixDQUE1QixDQUFBLEVBQUE7QUFDRSxlQUFPLENBQUEsSUFBQSxFQUFQLFFBQU8sQ0FBUDtBQ0dEOztBREZELE1BQUEsS0FBQSxHQUFRLFFBQVEsQ0FBUixLQUFBLENBQVIsR0FBUSxDQUFSO0FBQ0EsTUFBQSxJQUFBLEdBQU8sS0FBSyxDQUFaLEdBQU8sRUFBUDtBQ0lBLGFESEEsQ0FBQyxLQUFLLENBQUwsSUFBQSxDQUFELEdBQUMsQ0FBRCxFQUFBLElBQUEsQ0NHQTtBRFJNO0FBUkg7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVBQSxJQUFhLGVBQU47QUFBQTtBQUFBO0FBQ0gsMkJBQWEsSUFBYixFQUFhO0FBQUE7O0FBQUMsU0FBQSxHQUFBLEdBQUEsSUFBQTs7QUFDVixRQUFHLEtBQUEsR0FBQSxJQUFBLElBQUEsSUFBVSxLQUFBLEdBQUEsQ0FBQSxJQUFBLElBQVYsSUFBQSxJQUF5QixLQUFBLEdBQUEsQ0FBQSxNQUFBLElBQTVCLElBQUEsRUFBQTtBQUNJLFdBQUEsR0FBQSxHQUFPLEtBQUEsR0FBQSxDQUFQLE1BQU8sRUFBUDtBQ0NQO0FESFk7O0FBRFY7QUFBQTtBQUFBLHlCQUlHLEVBSkgsRUFJRztBQUNGLFVBQUcsS0FBQSxHQUFBLElBQUEsSUFBQSxJQUFVLEtBQUEsR0FBQSxDQUFBLElBQUEsSUFBYixJQUFBLEVBQUE7QUNJRixlREhNLElBQUEsZUFBQSxDQUFvQixLQUFBLEdBQUEsQ0FBQSxJQUFBLENBQXBCLEVBQW9CLENBQXBCLENDR047QURKRSxPQUFBLE1BQUE7QUNNRixlREhNLElBQUEsZUFBQSxDQUFvQixFQUFBLENBQUcsS0FBdkIsR0FBb0IsQ0FBcEIsQ0NHTjtBQUNEO0FEUks7QUFKSDtBQUFBO0FBQUEsNkJBU0s7QUNPUixhRE5JLEtBQUMsR0NNTDtBRFBRO0FBVEw7O0FBQUE7QUFBQSxHQUFQOzs7O0FBWUEsSUFBTyxlQUFQLEdBQXlCLFNBQWxCLGVBQWtCLENBQUEsR0FBQSxFQUFBO0FDVXZCLFNEVEUsSUFBQSxlQUFBLENBQUEsR0FBQSxDQ1NGO0FEVkYsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFYkEsSUFBYSxVQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNEJBQ0ssR0FETCxFQUNLLElBREwsRUFDSztBQUFBLFVBQVUsR0FBVix1RUFBQSxHQUFBO0FBQ1IsVUFBQSxHQUFBLEVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLElBQUksQ0FBSixLQUFBLENBQVIsR0FBUSxDQUFSO0FBQ0EsTUFBQSxHQUFBLEdBQUEsR0FBQTtBQUNBLE1BQUEsS0FBSyxDQUFMLElBQUEsQ0FBWSxVQUFBLElBQUQsRUFBQTtBQUNULFFBQUEsR0FBQSxHQUFNLEdBQUksQ0FBVixJQUFVLENBQVY7QUNFQSxlRERBLE9BQUEsR0FBQSxLQUFjLFdDQ2Q7QURIRixPQUFBO0FDS0EsYURGQSxHQ0VBO0FEUlE7QUFETDtBQUFBO0FBQUEsNEJBVUssR0FWTCxFQVVLLElBVkwsRUFVSyxHQVZMLEVBVUs7QUFBQSxVQUFjLEdBQWQsdUVBQUEsR0FBQTtBQUNSLFVBQUEsSUFBQSxFQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFJLENBQUosS0FBQSxDQUFSLEdBQVEsQ0FBUjtBQUNBLE1BQUEsSUFBQSxHQUFPLEtBQUssQ0FBWixHQUFPLEVBQVA7QUNJQSxhREhBLEtBQUssQ0FBTCxNQUFBLENBQWEsVUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBO0FBQ1gsWUFBRyxHQUFBLENBQUEsSUFBQSxDQUFBLElBQUgsSUFBQSxFQUFBO0FDSUUsaUJESEEsR0FBSSxDQUFBLElBQUEsQ0NHSjtBREpGLFNBQUEsTUFBQTtBQ01FLGlCREhBLEdBQUksQ0FBSixJQUFJLENBQUosR0FBWSxFQ0daO0FBQ0Q7QURSSCxPQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsSUFLZSxHQ0ZmO0FETlE7QUFWTDs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUFBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxxQkFBQSxDQUFBOztBQUVBLElBQWEsWUFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGtDQUNXLEdBRFgsRUFDVztBQUNkLGFBQU8sR0FBRyxDQUFILE9BQUEsQ0FBQSxXQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxXQUFBLEVBQVAsRUFBTyxDQUFQO0FBRGM7QUFEWDtBQUFBO0FBQUEsaUNBSVUsR0FKVixFQUlVO0FDSWIsYURIQSxHQUFHLENBQUgsT0FBQSxDQUFBLHFDQUFBLEVBQUEsTUFBQSxDQ0dBO0FESmE7QUFKVjtBQUFBO0FBQUEsbUNBT1ksR0FQWixFQU9ZLE1BUFosRUFPWTtBQUNmLFVBQWEsTUFBQSxJQUFiLENBQUEsRUFBQTtBQUFBLGVBQUEsRUFBQTtBQ01DOztBQUNELGFETkEsS0FBQSxDQUFNLElBQUksQ0FBSixJQUFBLENBQVUsTUFBQSxHQUFPLEdBQUcsQ0FBcEIsTUFBQSxJQUFOLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLEVBQUEsU0FBQSxDQUFBLENBQUEsRUFBQSxNQUFBLENDTUE7QURSZTtBQVBaO0FBQUE7QUFBQSwyQkFXSSxHQVhKLEVBV0ksRUFYSixFQVdJO0FDUVAsYURQQSxLQUFBLENBQU0sRUFBQSxHQUFOLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENDT0E7QURSTztBQVhKO0FBQUE7QUFBQSwrQkFjUSxHQWRSLEVBY1E7QUFDWCxVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBRyxDQUFILE9BQUEsQ0FBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsQ0FBUixJQUFRLENBQVI7QUFDQSxNQUFBLENBQUEsR0FBQSxDQUFBOztBQUNBLFdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBO0FDVUUsUUFBQSxDQUFDLEdBQUcsS0FBSyxDQUFULENBQVMsQ0FBVDtBRFRBLFFBQUEsQ0FBQSxHQUFJLElBQUksQ0FBSixHQUFBLENBQUEsQ0FBQSxFQUFXLENBQUMsQ0FBaEIsTUFBSSxDQUFKO0FBREY7O0FBRUEsYUFBTyxJQUFJLEtBQUEsQ0FBSixJQUFBLENBQUEsQ0FBQSxFQUFXLEtBQUssQ0FBTCxNQUFBLEdBQWxCLENBQU8sQ0FBUDtBQUxXO0FBZFI7QUFBQTtBQUFBLG1DQXFCWSxJQXJCWixFQXFCWTtBQUFBLFVBQU0sRUFBTix1RUFBQSxDQUFBO0FBQUEsVUFBVyxNQUFYLHVFQUFBLElBQUE7QUFDZixVQUFBLEdBQUE7O0FBQUEsVUFBRyxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxHQUFBLEdBQUEsS0FBQTtBQUNBLGVBQU8sSUFBSSxDQUFKLE9BQUEsQ0FBQSxHQUFBLEVBQWtCLE9BQU8sS0FBQSxNQUFBLENBQUEsTUFBQSxFQUFoQyxFQUFnQyxDQUF6QixDQUFQO0FBRkYsT0FBQSxNQUFBO0FBSUUsZUFBQSxJQUFBO0FDY0Q7QURuQmM7QUFyQlo7QUFBQTtBQUFBLDJCQTRCSSxJQTVCSixFQTRCSTtBQUFBLFVBQU0sRUFBTix1RUFBQSxDQUFBO0FBQUEsVUFBVyxNQUFYLHVFQUFBLElBQUE7O0FBQ1AsVUFBRyxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBTyxNQUFBLEdBQVMsS0FBQSxjQUFBLENBQUEsSUFBQSxFQUFBLEVBQUEsRUFBaEIsTUFBZ0IsQ0FBaEI7QUFERixPQUFBLE1BQUE7QUFHRSxlQUFBLElBQUE7QUNnQkQ7QURwQk07QUE1Qko7QUFBQTtBQUFBLCtCQWtDUSxHQWxDUixFQWtDUTtBQUNYLGFBQU8sR0FBRyxDQUFILEtBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBQSxHQUFBLElBQUEsQ0FBUCxFQUFPLENBQVA7QUFEVztBQWxDUjtBQUFBO0FBQUEsaUNBc0NVLEdBdENWLEVBc0NVO0FBQUEsVUFBTSxVQUFOLHVFQUFBLEdBQUE7QUFDYixVQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBQSx1QkFBQTtBQUNBLE1BQUEsUUFBQSxHQUFXLElBQUEsTUFBQSxDQUFXLEtBQUEsWUFBQSxDQUFYLFVBQVcsQ0FBWCxFQUFYLEdBQVcsQ0FBWDtBQUNBLE1BQUEsUUFBQSxHQUFXLElBQUEsTUFBQSxDQUFXLEtBQUEsWUFBQSxDQUFjLFVBQUEsR0FBekIsVUFBVyxDQUFYLEVBQVgsR0FBVyxDQUFYO0FBQ0EsTUFBQSxLQUFBLEdBQVEsSUFBQSxNQUFBLENBQVcsS0FBQSxZQUFBLENBQVgsR0FBVyxDQUFYLEVBQVIsR0FBUSxDQUFSO0FDbUJBLGFEbEJBLEdBQUcsQ0FBSCxPQUFBLENBQUEsUUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsUUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLENBQUEsS0FBQSxFQUFBLFVBQUEsQ0NrQkE7QUR2QmE7QUF0Q1Y7QUFBQTtBQUFBLDRDQTZDcUIsR0E3Q3JCLEVBNkNxQjtBQUFBLFVBQU0sVUFBTix1RUFBQSxHQUFBO0FBQ3hCLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLEtBQUEsWUFBQSxDQUFBLEdBQUEsRUFBTixVQUFNLENBQU47O0FBQ0EsVUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFILE1BQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxJQUFvQixHQUFHLENBQUgsTUFBQSxDQUFXLEdBQUEsR0FBSSxVQUFVLENBQW5ELE1BQTBCLENBQTFCO0FBQ0EsZUFBTyxDQUFBLEdBQUEsRUFBUCxHQUFPLENBQVA7QUNxQkQ7QUR6QnVCO0FBN0NyQjtBQUFBO0FBQUEsaUNBbURVLEdBbkRWLEVBbURVO0FBQUEsVUFBTSxVQUFOLHVFQUFBLEdBQUE7QUFDYixVQUFBLENBQUEsRUFBQSxRQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBQSxNQUFBLENBQVcsS0FBQSxZQUFBLENBQWMsVUFBQSxHQUF6QixVQUFXLENBQVgsRUFBWCxHQUFXLENBQVg7QUFDQSxNQUFBLEdBQUEsR0FBTSxHQUFHLENBQUgsT0FBQSxDQUFBLFFBQUEsRUFBTixHQUFNLENBQU47O0FBQ0EsVUFBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUgsT0FBQSxDQUFMLFVBQUssQ0FBTCxJQUFnQyxDQUFuQyxDQUFBLEVBQUE7QUFDRSxlQUFBLENBQUE7QUN3QkQ7QUQ1Qlk7QUFuRFY7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVEQSxJQUFBLElBQUEsR0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx5QkFBQSxDQUFBOztBQUNBLElBQUEsVUFBQSxHQUFBLE9BQUEsQ0FBQSxhQUFBLENBQUE7O0FBRUEsSUFBYSxJQUFOO0FBQUE7QUFBQTtBQUNMLGdCQUFhLE1BQWIsRUFBYSxNQUFiLEVBQWE7QUFBQSxRQUFBLE9BQUEsdUVBQUEsRUFBQTs7QUFBQTs7QUFDWCxRQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQURZLFNBQUEsTUFBQSxHQUFBLE1BQUE7QUFBUSxTQUFBLE1BQUEsR0FBQSxNQUFBO0FBQVEsU0FBQSxPQUFBLEdBQUEsT0FBQTtBQUM1QixJQUFBLFFBQUEsR0FBVztBQUNULE1BQUEsYUFBQSxFQURTLEtBQUE7QUFFVCxNQUFBLFVBQUEsRUFBWTtBQUZILEtBQVg7O0FBSUEsU0FBQSxHQUFBLElBQUEsUUFBQSxFQUFBO0FDWUUsTUFBQSxHQUFHLEdBQUcsUUFBUSxDQUFkLEdBQWMsQ0FBZDs7QURYQSxVQUFHLEdBQUEsSUFBTyxLQUFWLE9BQUEsRUFBQTtBQUNFLGFBQUEsR0FBQSxJQUFZLEtBQUEsT0FBQSxDQUFaLEdBQVksQ0FBWjtBQURGLE9BQUEsTUFBQTtBQUdFLGFBQUEsR0FBQSxJQUFBLEdBQUE7QUNhRDtBRGpCSDtBQUxXOztBQURSO0FBQUE7QUFBQSxnQ0FXTTtBQUNULFVBQUcsT0FBTyxLQUFQLE1BQUEsS0FBSCxRQUFBLEVBQUE7QUFDRSxlQUFPLElBQUEsTUFBQSxDQUFXLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixLQUE1QyxNQUFrQixDQUFYLENBQVA7QUFERixPQUFBLE1BQUE7QUFHRSxlQUFPLEtBQVAsTUFBQTtBQ2lCRDtBRHJCUTtBQVhOO0FBQUE7QUFBQSxnQ0FnQk07QUFDVCxVQUFHLE9BQU8sS0FBUCxNQUFBLEtBQUgsUUFBQSxFQUFBO0FBQ0UsZUFBTyxJQUFBLE1BQUEsQ0FBVyxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBMEIsS0FBNUMsTUFBa0IsQ0FBWCxDQUFQO0FBREYsT0FBQSxNQUFBO0FBR0UsZUFBTyxLQUFQLE1BQUE7QUNvQkQ7QUR4QlE7QUFoQk47QUFBQTtBQUFBLG9DQXFCVTtBQUNiLGFBQU87QUFDTCxRQUFBLE1BQUEsRUFBUSxLQURILFNBQ0csRUFESDtBQUVMLFFBQUEsTUFBQSxFQUFRLEtBQUEsU0FBQTtBQUZILE9BQVA7QUFEYTtBQXJCVjtBQUFBO0FBQUEsdUNBMEJhO0FBQ2hCLFVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFBLEVBQUE7QUFDQSxNQUFBLEdBQUEsR0FBQSxLQUFBLGFBQUEsRUFBQTs7QUFBQSxXQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUE7QUMyQkUsUUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFULEdBQVMsQ0FBVDtBRDFCQSxRQUFBLElBQUksQ0FBSixJQUFBLENBQUEsR0FBQTtBQURGOztBQUVBLGFBQUEsSUFBQTtBQUpnQjtBQTFCYjtBQUFBO0FBQUEsa0NBK0JRO0FBQ1gsVUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBLEdBQUEsRUFBQTtBQUNBLE1BQUEsR0FBQSxHQUFBLEtBQUEsYUFBQSxFQUFBOztBQUFBLFdBQUEsR0FBQSxJQUFBLEdBQUEsRUFBQTtBQ2lDRSxRQUFBLEdBQUcsR0FBRyxHQUFHLENBQVQsR0FBUyxDQUFUO0FEaENBLFFBQUEsTUFBTSxDQUFOLElBQUEsQ0FBWSxNQUFJLEdBQUcsQ0FBUCxNQUFBLEdBQVosR0FBQTtBQURGOztBQUVBLGFBQU8sSUFBQSxNQUFBLENBQVcsTUFBTSxDQUFOLElBQUEsQ0FBbEIsR0FBa0IsQ0FBWCxDQUFQO0FBSlc7QUEvQlI7QUFBQTtBQUFBLDZCQW9DSyxJQXBDTCxFQW9DSztBQUFBLFVBQU0sTUFBTix1RUFBQSxDQUFBO0FBQ1IsVUFBQSxLQUFBOztBQUFBLGFBQU0sQ0FBQSxLQUFBLEdBQUEsS0FBQSxTQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsQ0FBQSxLQUFBLElBQUEsSUFBdUMsQ0FBQyxLQUFLLENBQW5ELEtBQThDLEVBQTlDLEVBQUE7QUFDRSxRQUFBLE1BQUEsR0FBUyxLQUFLLENBQWQsR0FBUyxFQUFUO0FBREY7O0FBRUEsVUFBZ0IsS0FBQSxJQUFBLElBQUEsSUFBVyxLQUFLLENBQWhDLEtBQTJCLEVBQTNCLEVBQUE7QUFBQSxlQUFBLEtBQUE7QUN3Q0M7QUQzQ087QUFwQ0w7QUFBQTtBQUFBLDhCQXdDTSxJQXhDTixFQXdDTTtBQUFBLFVBQU0sTUFBTix1RUFBQSxDQUFBO0FBQ1QsVUFBQSxLQUFBOztBQUFBLFVBQUEsTUFBQSxFQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFKLE1BQUEsQ0FBUCxNQUFPLENBQVA7QUM0Q0Q7O0FEM0NELE1BQUEsS0FBQSxHQUFRLEtBQUEsV0FBQSxHQUFBLElBQUEsQ0FBUixJQUFRLENBQVI7O0FBQ0EsVUFBRyxLQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBTyxJQUFJLFVBQUEsQ0FBSixTQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsRUFBUCxNQUFPLENBQVA7QUM2Q0Q7QURsRFE7QUF4Q047QUFBQTtBQUFBLGtDQThDVSxJQTlDVixFQThDVTtBQUNiLGFBQU8sS0FBQSxnQkFBQSxDQUFrQixLQUFBLFFBQUEsQ0FBekIsSUFBeUIsQ0FBbEIsQ0FBUDtBQURhO0FBOUNWO0FBQUE7QUFBQSxpQ0FnRFMsSUFoRFQsRUFnRFM7QUFBQSxVQUFNLE1BQU4sdUVBQUEsQ0FBQTtBQUNaLFVBQUEsS0FBQSxFQUFBLEdBQUE7O0FBQUEsYUFBTSxLQUFBLEdBQVEsS0FBQSxRQUFBLENBQUEsSUFBQSxFQUFkLE1BQWMsQ0FBZCxFQUFBO0FBQ0UsUUFBQSxNQUFBLEdBQVMsS0FBSyxDQUFkLEdBQVMsRUFBVDs7QUFDQSxZQUFHLENBQUEsR0FBQSxJQUFRLEdBQUcsQ0FBSCxHQUFBLE9BQWEsS0FBSyxDQUE3QixHQUF3QixFQUF4QixFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQUEsS0FBQTtBQ21ERDtBRHRESDs7QUFJQSxhQUFBLEdBQUE7QUFMWTtBQWhEVDtBQUFBO0FBQUEsZ0NBc0RNO0FDdURULGFEdERBLEtBQUEsTUFBQSxLQUFXLEtBQVgsTUFBQSxJQUNFLEtBQUEsTUFBQSxDQUFBLE1BQUEsSUFBQSxJQUFBLElBQ0EsS0FBQSxNQUFBLENBQUEsTUFBQSxJQURBLElBQUEsSUFFQSxLQUFBLE1BQUEsQ0FBQSxNQUFBLEtBQWtCLEtBQUEsTUFBQSxDQUFRLE1DbUQ1QjtBRHZEUztBQXRETjtBQUFBO0FBQUEsK0JBNERPLEdBNURQLEVBNERPLElBNURQLEVBNERPO0FBQ1YsVUFBQSxHQUFBLEVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEtBQUEsWUFBQSxDQUFjLElBQUksQ0FBSixNQUFBLENBQUEsQ0FBQSxFQUFjLEdBQUcsQ0FBdkMsS0FBc0IsQ0FBZCxDQUFSOztBQUNBLFVBQUcsS0FBQSxJQUFBLElBQUEsS0FBWSxLQUFBLFNBQUEsTUFBZ0IsS0FBSyxDQUFMLElBQUEsT0FBL0IsUUFBRyxDQUFILEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBTSxLQUFBLFFBQUEsQ0FBQSxJQUFBLEVBQWUsR0FBRyxDQUF4QixHQUFNLENBQU47O0FBQ0EsWUFBRyxHQUFBLElBQUEsSUFBQSxLQUFVLEtBQUEsU0FBQSxNQUFnQixHQUFHLENBQUgsSUFBQSxPQUE3QixRQUFHLENBQUgsRUFBQTtBQUNFLGlCQUFPLElBQUksSUFBQSxDQUFKLEdBQUEsQ0FBUSxLQUFLLENBQWIsS0FBUSxFQUFSLEVBQXNCLEdBQUcsQ0FBaEMsR0FBNkIsRUFBdEIsQ0FBUDtBQURGLFNBQUEsTUFFSyxJQUFHLEtBQUgsYUFBQSxFQUFBO0FBQ0gsaUJBQU8sSUFBSSxJQUFBLENBQUosR0FBQSxDQUFRLEtBQUssQ0FBYixLQUFRLEVBQVIsRUFBc0IsSUFBSSxDQUFqQyxNQUFPLENBQVA7QUFMSjtBQzREQztBRDlEUztBQTVEUDtBQUFBO0FBQUEsK0JBb0VPLEdBcEVQLEVBb0VPLElBcEVQLEVBb0VPO0FBQ1YsYUFBTyxLQUFBLFVBQUEsQ0FBQSxHQUFBLEVBQUEsSUFBQSxLQUFQLElBQUE7QUFEVTtBQXBFUDs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUxBLElBQWEsU0FBTjtBQUFBO0FBQUE7QUFDTCxxQkFBYSxJQUFiLEVBQWEsS0FBYixFQUFhO0FBQUEsUUFBQSxNQUFBLHVFQUFBLENBQUE7O0FBQUE7O0FBQUMsU0FBQSxJQUFBLEdBQUEsSUFBQTtBQUFNLFNBQUEsS0FBQSxHQUFBLEtBQUE7QUFBTyxTQUFBLE1BQUEsR0FBQSxNQUFBO0FBQWQ7O0FBRFI7QUFBQTtBQUFBLDJCQUVDO0FBQ0osVUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7O0FBQUEsVUFBRyxLQUFILEtBQUEsRUFBQTtBQUNFLFlBQU8sT0FBQSxLQUFBLEtBQUEsV0FBQSxJQUFBLEtBQUEsS0FBUCxJQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBQSxLQUFBLEtBQUE7O0FBQUEsZUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTtBQ1FFLFlBQUEsS0FBSyxHQUFHLEdBQUcsQ0FBWCxDQUFXLENBQVg7O0FEUEEsZ0JBQUcsQ0FBQSxHQUFBLENBQUEsSUFBVSxLQUFBLElBQWIsSUFBQSxFQUFBO0FBQ0UsY0FBQSxLQUFBLEdBQVEsS0FBQSxJQUFBLENBQUEsZ0JBQUEsR0FBeUIsQ0FBQSxHQUFqQyxDQUFRLENBQVI7QUFDQSxxQkFBQSxLQUFBO0FDU0Q7QURaSDs7QUFJQSxVQUFBLEtBQUEsR0FBQSxLQUFBO0FDV0Q7O0FEVkQsZUFBTyxLQUFBLElBQVAsSUFBQTtBQ1lEO0FEcEJHO0FBRkQ7QUFBQTtBQUFBLDRCQVdFO0FDZUwsYURkQSxLQUFBLEtBQUEsQ0FBQSxLQUFBLEdBQWUsS0FBQyxNQ2NoQjtBRGZLO0FBWEY7QUFBQTtBQUFBLDBCQWFBO0FDaUJILGFEaEJBLEtBQUEsS0FBQSxDQUFBLEtBQUEsR0FBZSxLQUFBLEtBQUEsQ0FBQSxDQUFBLEVBQWYsTUFBQSxHQUFrQyxLQUFDLE1DZ0JuQztBRGpCRztBQWJBO0FBQUE7QUFBQSw0QkFlRTtBQUNMLGFBQU8sQ0FBQyxLQUFBLElBQUEsQ0FBRCxVQUFBLElBQXFCLEtBQUEsSUFBQSxDQUFBLFVBQUEsQ0FBNUIsSUFBNEIsQ0FBNUI7QUFESztBQWZGO0FBQUE7QUFBQSw2QkFpQkc7QUNxQk4sYURwQkEsS0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFVLE1Db0JWO0FEckJNO0FBakJIOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQUEsSUFBYSxHQUFOO0FBQUE7QUFBQTtBQUNMLGVBQWEsS0FBYixFQUFhLEdBQWIsRUFBYTtBQUFBOztBQUFDLFNBQUEsS0FBQSxHQUFBLEtBQUE7QUFBTyxTQUFBLEdBQUEsR0FBQSxHQUFBOztBQUNuQixRQUFxQixLQUFBLEdBQUEsSUFBckIsSUFBQSxFQUFBO0FBQUEsV0FBQSxHQUFBLEdBQU8sS0FBUCxLQUFBO0FDSUM7QURMVTs7QUFEUjtBQUFBO0FBQUEsK0JBR08sRUFIUCxFQUdPO0FBQ1YsYUFBTyxLQUFBLEtBQUEsSUFBQSxFQUFBLElBQWlCLEVBQUEsSUFBTSxLQUE5QixHQUFBO0FBRFU7QUFIUDtBQUFBO0FBQUEsZ0NBS1EsR0FMUixFQUtRO0FBQ1gsYUFBTyxLQUFBLEtBQUEsSUFBVSxHQUFHLENBQWIsS0FBQSxJQUF3QixHQUFHLENBQUgsR0FBQSxJQUFXLEtBQTFDLEdBQUE7QUFEVztBQUxSO0FBQUE7QUFBQSw4QkFPTSxNQVBOLEVBT00sTUFQTixFQU9NO0FBQ1QsYUFBTyxJQUFJLEdBQUcsQ0FBUCxTQUFBLENBQWtCLEtBQUEsS0FBQSxHQUFPLE1BQU0sQ0FBL0IsTUFBQSxFQUF1QyxLQUF2QyxLQUFBLEVBQThDLEtBQTlDLEdBQUEsRUFBbUQsS0FBQSxHQUFBLEdBQUssTUFBTSxDQUFyRSxNQUFPLENBQVA7QUFEUztBQVBOO0FBQUE7QUFBQSwrQkFTTyxHQVRQLEVBU087QUFDVixXQUFBLE9BQUEsR0FBQSxHQUFBO0FBQ0EsYUFBQSxJQUFBO0FBRlU7QUFUUDtBQUFBO0FBQUEsNkJBWUc7QUFDTixVQUFPLEtBQUEsT0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGNBQU0sSUFBQSxLQUFBLENBQU4sZUFBTSxDQUFOO0FDZUQ7O0FEZEQsYUFBTyxLQUFQLE9BQUE7QUFITTtBQVpIO0FBQUE7QUFBQSxnQ0FnQk07QUFDVCxhQUFPLEtBQUEsT0FBQSxJQUFQLElBQUE7QUFEUztBQWhCTjtBQUFBO0FBQUEsMkJBa0JDO0FDb0JKLGFEbkJBLEtBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBcUIsS0FBckIsS0FBQSxFQUE2QixLQUE3QixHQUFBLENDbUJBO0FEcEJJO0FBbEJEO0FBQUE7QUFBQSxnQ0FvQlEsTUFwQlIsRUFvQlE7QUFDWCxVQUFHLE1BQUEsS0FBSCxDQUFBLEVBQUE7QUFDRSxhQUFBLEtBQUEsSUFBQSxNQUFBO0FBQ0EsYUFBQSxHQUFBLElBQUEsTUFBQTtBQ3NCRDs7QURyQkQsYUFBQSxJQUFBO0FBSlc7QUFwQlI7QUFBQTtBQUFBLDhCQXlCSTtBQUNQLFVBQU8sS0FBQSxRQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsYUFBQSxRQUFBLEdBQVksS0FBQSxNQUFBLEdBQUEsYUFBQSxDQUF3QixLQUFwQyxLQUFZLENBQVo7QUN5QkQ7O0FEeEJELGFBQU8sS0FBUCxRQUFBO0FBSE87QUF6Qko7QUFBQTtBQUFBLDhCQTZCSTtBQUNQLFVBQU8sS0FBQSxRQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsYUFBQSxRQUFBLEdBQVksS0FBQSxNQUFBLEdBQUEsV0FBQSxDQUFzQixLQUFsQyxHQUFZLENBQVo7QUM0QkQ7O0FEM0JELGFBQU8sS0FBUCxRQUFBO0FBSE87QUE3Qko7QUFBQTtBQUFBLHdDQWlDYztBQUNqQixVQUFPLEtBQUEsa0JBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxhQUFBLGtCQUFBLEdBQXNCLEtBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBcUIsS0FBckIsT0FBcUIsRUFBckIsRUFBZ0MsS0FBdEQsT0FBc0QsRUFBaEMsQ0FBdEI7QUMrQkQ7O0FEOUJELGFBQU8sS0FBUCxrQkFBQTtBQUhpQjtBQWpDZDtBQUFBO0FBQUEsc0NBcUNZO0FBQ2YsVUFBTyxLQUFBLGdCQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsYUFBQSxnQkFBQSxHQUFvQixLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLE9BQXFCLEVBQXJCLEVBQWdDLEtBQXBELEtBQW9CLENBQXBCO0FDa0NEOztBRGpDRCxhQUFPLEtBQVAsZ0JBQUE7QUFIZTtBQXJDWjtBQUFBO0FBQUEsc0NBeUNZO0FBQ2YsVUFBTyxLQUFBLGdCQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsYUFBQSxnQkFBQSxHQUFvQixLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLEdBQUEsRUFBMEIsS0FBOUMsT0FBOEMsRUFBMUIsQ0FBcEI7QUNxQ0Q7O0FEcENELGFBQU8sS0FBUCxnQkFBQTtBQUhlO0FBekNaO0FBQUE7QUFBQSwyQkE2Q0M7QUFDSixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFBLEdBQUEsQ0FBUSxLQUFSLEtBQUEsRUFBZSxLQUFyQixHQUFNLENBQU47O0FBQ0EsVUFBRyxLQUFILFNBQUcsRUFBSCxFQUFBO0FBQ0UsUUFBQSxHQUFHLENBQUgsVUFBQSxDQUFlLEtBQWYsTUFBZSxFQUFmO0FDeUNEOztBRHhDRCxhQUFBLEdBQUE7QUFKSTtBQTdDRDtBQUFBO0FBQUEsMEJBa0RBO0FDNENILGFEM0NBLENBQUMsS0FBRCxLQUFBLEVBQVEsS0FBUixHQUFBLENDMkNBO0FENUNHO0FBbERBOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQUEsSUFBQSxTQUFBLEdBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQTs7QUFDQSxJQUFBLFlBQUEsR0FBQSxPQUFBLENBQUEsZUFBQSxDQUFBOztBQUNBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx5QkFBQSxDQUFBOztBQUVBLElBQWEsYUFBTjtBQUFBO0FBQUE7QUFDTCx5QkFBYSxHQUFiLEVBQWE7QUFBQTs7QUFDWCxRQUFHLENBQUMsS0FBSyxDQUFMLE9BQUEsQ0FBSixHQUFJLENBQUosRUFBQTtBQUNFLE1BQUEsR0FBQSxHQUFNLENBQU4sR0FBTSxDQUFOO0FDU0Q7O0FEUkQsSUFBQSxhQUFBLENBQUEsWUFBQSxDQUFBLFdBQUEsQ0FBQSxHQUFBLEVBQTZCLENBQTdCLGFBQTZCLENBQTdCOztBQUNBLFdBQUEsR0FBQTtBQUpXOztBQURSO0FBQUE7QUFBQSx5QkFPQyxNQVBELEVBT0MsTUFQRCxFQU9DO0FBQ0YsYUFBTyxLQUFBLEdBQUEsQ0FBTSxVQUFBLENBQUEsRUFBQTtBQ1diLGVEWG9CLElBQUksU0FBQSxDQUFKLFFBQUEsQ0FBYSxDQUFDLENBQWQsS0FBQSxFQUFzQixDQUFDLENBQXZCLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxDQ1dwQjtBRFhBLE9BQU8sQ0FBUDtBQURFO0FBUEQ7QUFBQTtBQUFBLDRCQVNJLEdBVEosRUFTSTtBQUNMLGFBQU8sS0FBQSxHQUFBLENBQU0sVUFBQSxDQUFBLEVBQUE7QUNlYixlRGZvQixJQUFJLFlBQUEsQ0FBSixXQUFBLENBQWdCLENBQUMsQ0FBakIsS0FBQSxFQUF5QixDQUFDLENBQTFCLEdBQUEsRUFBQSxHQUFBLENDZXBCO0FEZkEsT0FBTyxDQUFQO0FBREs7QUFUSjs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFSkEsSUFBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQTs7QUFDQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEseUJBQUEsQ0FBQTs7QUFDQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEsaUJBQUEsQ0FBQTs7QUFDQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEseUJBQUEsQ0FBQTs7QUFFQSxJQUFhLFdBQUEsR0FBQSxZQUFBO0FBQUEsTUFBTixXQUFNO0FBQUE7QUFBQTtBQUFBOztBQUVYLHlCQUFhLE1BQWIsRUFBYSxHQUFiLEVBQWEsS0FBYixFQUFhO0FBQUE7O0FBQUEsVUFBQSxPQUFBLHVFQUFBLEVBQUE7O0FBQUE7O0FDWVQ7QURaVSxZQUFBLEtBQUEsR0FBQSxNQUFBO0FBQVEsWUFBQSxHQUFBLEdBQUEsR0FBQTtBQUFNLFlBQUEsSUFBQSxHQUFBLEtBQUE7QUFBTyxZQUFBLE9BQUEsR0FBQSxPQUFBOztBQUVqQyxZQUFBLE9BQUEsQ0FBUyxNQUFULE9BQUEsRUFBa0I7QUFDaEIsUUFBQSxNQUFBLEVBRGdCLEVBQUE7QUFFaEIsUUFBQSxNQUFBLEVBRmdCLEVBQUE7QUFHaEIsUUFBQSxVQUFBLEVBQVk7QUFISSxPQUFsQjs7QUFGVztBQUFBOztBQUZGO0FBQUE7QUFBQSwyQ0FTUztBQUNsQixlQUFPLEtBQUEsS0FBQSxHQUFPLEtBQUEsTUFBQSxDQUFQLE1BQUEsR0FBc0IsS0FBQSxJQUFBLENBQTdCLE1BQUE7QUFEa0I7QUFUVDtBQUFBO0FBQUEsK0JBV0g7QUFDTixlQUFPLEtBQUEsS0FBQSxHQUFPLEtBQUEsU0FBQSxHQUFkLE1BQUE7QUFETTtBQVhHO0FBQUE7QUFBQSw4QkFhSjtBQ3NCSCxlRHJCRixLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLEtBQUEsRUFBNkIsS0FBN0IsR0FBQSxFQUFtQyxLQUFuQyxTQUFtQyxFQUFuQyxDQ3FCRTtBRHRCRztBQWJJO0FBQUE7QUFBQSxrQ0FlQTtBQUNULGVBQU8sS0FBQSxTQUFBLE9BQWdCLEtBQXZCLFlBQXVCLEVBQXZCO0FBRFM7QUFmQTtBQUFBO0FBQUEscUNBaUJHO0FBQ1osZUFBTyxLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLEtBQUEsRUFBNkIsS0FBcEMsR0FBTyxDQUFQO0FBRFk7QUFqQkg7QUFBQTtBQUFBLGtDQW1CQTtBQUNULGVBQU8sS0FBQSxNQUFBLEdBQVEsS0FBUixJQUFBLEdBQWMsS0FBckIsTUFBQTtBQURTO0FBbkJBO0FBQUE7QUFBQSxvQ0FxQkU7QUFDWCxlQUFPLEtBQUEsU0FBQSxHQUFBLE1BQUEsSUFBdUIsS0FBQSxHQUFBLEdBQU8sS0FBckMsS0FBTyxDQUFQO0FBRFc7QUFyQkY7QUFBQTtBQUFBLGtDQXVCRSxNQXZCRixFQXVCRTtBQUNYLFlBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTs7QUFBQSxZQUFHLE1BQUEsS0FBSCxDQUFBLEVBQUE7QUFDRSxlQUFBLEtBQUEsSUFBQSxNQUFBO0FBQ0EsZUFBQSxHQUFBLElBQUEsTUFBQTtBQUNBLFVBQUEsR0FBQSxHQUFBLEtBQUEsVUFBQTs7QUFBQSxlQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQ2tDSSxZQUFBLEdBQUcsR0FBRyxHQUFHLENBQVQsQ0FBUyxDQUFUO0FEakNGLFlBQUEsR0FBRyxDQUFILEtBQUEsSUFBQSxNQUFBO0FBQ0EsWUFBQSxHQUFHLENBQUgsR0FBQSxJQUFBLE1BQUE7QUFMSjtBQ3lDRzs7QURuQ0gsZUFBQSxJQUFBO0FBUFc7QUF2QkY7QUFBQTtBQUFBLHNDQStCSTtBQUNiLGFBQUEsVUFBQSxHQUFjLENBQUMsSUFBSSxJQUFBLENBQUosR0FBQSxDQUFRLEtBQUEsTUFBQSxDQUFBLE1BQUEsR0FBZSxLQUF2QixLQUFBLEVBQStCLEtBQUEsTUFBQSxDQUFBLE1BQUEsR0FBZSxLQUFmLEtBQUEsR0FBc0IsS0FBQSxJQUFBLENBQXBFLE1BQWUsQ0FBRCxDQUFkO0FBQ0EsZUFBQSxJQUFBO0FBRmE7QUEvQko7QUFBQTtBQUFBLG9DQWtDRTtBQUNYLFlBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQTtBQUFBLGFBQUEsVUFBQSxHQUFBLEVBQUE7QUFDQSxRQUFBLElBQUEsR0FBTyxLQUFQLFNBQU8sRUFBUDtBQUNBLGFBQUEsTUFBQSxHQUFVLGFBQUEsQ0FBQSxZQUFBLENBQUEsWUFBQSxDQUEwQixLQUFwQyxNQUFVLENBQVY7QUFDQSxhQUFBLElBQUEsR0FBUSxhQUFBLENBQUEsWUFBQSxDQUFBLFlBQUEsQ0FBMEIsS0FBbEMsSUFBUSxDQUFSO0FBQ0EsYUFBQSxNQUFBLEdBQVUsYUFBQSxDQUFBLFlBQUEsQ0FBQSxZQUFBLENBQTBCLEtBQXBDLE1BQVUsQ0FBVjtBQUNBLFFBQUEsS0FBQSxHQUFRLEtBQVIsS0FBQTs7QUFFQSxlQUFNLENBQUEsR0FBQSxHQUFBLGFBQUEsQ0FBQSxZQUFBLENBQUEsdUJBQUEsQ0FBQSxJQUFBLENBQUEsS0FBTixJQUFBLEVBQUE7QUFBQSxxQkFDRSxHQURGOztBQUFBOztBQUNFLFVBQUEsR0FERjtBQUNFLFVBQUEsSUFERjtBQUVFLGVBQUEsVUFBQSxDQUFBLElBQUEsQ0FBaUIsSUFBSSxJQUFBLENBQUosR0FBQSxDQUFRLEtBQUEsR0FBUixHQUFBLEVBQW1CLEtBQUEsR0FBcEMsR0FBaUIsQ0FBakI7QUFGRjs7QUFJQSxlQUFBLElBQUE7QUFaVztBQWxDRjtBQUFBO0FBQUEsNkJBK0NMO0FBQ0osWUFBQSxHQUFBO0FBQUEsUUFBQSxHQUFBLEdBQU0sSUFBQSxXQUFBLENBQWdCLEtBQWhCLEtBQUEsRUFBd0IsS0FBeEIsR0FBQSxFQUE4QixLQUE5QixJQUFBLEVBQXFDLEtBQTNDLE9BQTJDLEVBQXJDLENBQU47O0FBQ0EsWUFBRyxLQUFILFNBQUcsRUFBSCxFQUFBO0FBQ0UsVUFBQSxHQUFHLENBQUgsVUFBQSxDQUFlLEtBQWYsTUFBZSxFQUFmO0FDNENDOztBRDNDSCxRQUFBLEdBQUcsQ0FBSCxVQUFBLEdBQWlCLEtBQUEsVUFBQSxDQUFBLEdBQUEsQ0FBaUIsVUFBQSxDQUFBLEVBQUE7QUM2QzlCLGlCRDdDbUMsQ0FBQyxDQUFELElBQUEsRUM2Q25DO0FEN0NKLFNBQWlCLENBQWpCO0FBQ0EsZUFBQSxHQUFBO0FBTEk7QUEvQ0s7O0FBQUE7QUFBQSxJQUFvQixJQUFBLENBQTFCLEdBQU07O0FBQU47O0FBQ0wsRUFBQSxhQUFBLENBQUEsWUFBQSxDQUFBLFdBQUEsQ0FBeUIsV0FBSSxDQUE3QixTQUFBLEVBQXdDLENBQUMsYUFBQSxDQUF6QyxZQUF3QyxDQUF4Qzs7QUN3R0EsU0FBQSxXQUFBO0FEekdXLENBQUEsQ0FBQSxJQUFBLENBQUEsS0FBYixDQUFhLENBQWI7Ozs7Ozs7Ozs7Ozs7O0FFTEEsSUFBYSxJQUFOLEdBQ0wsY0FBYSxLQUFiLEVBQWEsTUFBYixFQUFhO0FBQUE7O0FBQUMsT0FBQSxLQUFBLEdBQUEsS0FBQTtBQUFPLE9BQUEsTUFBQSxHQUFBLE1BQUE7QUFBUixDQURmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxJQUFhLE1BQU47QUFBQTtBQUFBO0FBQ0wsa0JBQWEsR0FBYixFQUFhLEdBQWIsRUFBYTtBQUFBOztBQUFDLFNBQUEsR0FBQSxHQUFBLEdBQUE7QUFBSyxTQUFBLEdBQUEsR0FBQSxHQUFBO0FBQU47O0FBRFI7QUFBQTtBQUFBLDBCQUVBO0FDS0gsYURKQSxLQUFBLEdBQUEsR0FBTyxLQUFBLEdBQUEsQ0FBSyxNQ0laO0FETEc7QUFGQTs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUFBLElBQUEsSUFBQSxHQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUE7O0FBRUEsSUFBYSxVQUFOO0FBQUE7QUFBQTtBQUFBOztBQUNMLHNCQUFhLEtBQWIsRUFBYSxVQUFiLEVBQWEsUUFBYixFQUFhLEdBQWIsRUFBYTtBQUFBOztBQUFBOztBQ0dYO0FESFksVUFBQSxLQUFBLEdBQUEsS0FBQTtBQUFPLFVBQUEsVUFBQSxHQUFBLFVBQUE7QUFBWSxVQUFBLFFBQUEsR0FBQSxRQUFBO0FBQVUsVUFBQSxHQUFBLEdBQUEsR0FBQTtBQUE5QjtBQUFBOztBQURSO0FBQUE7QUFBQSxvQ0FHWSxFQUhaLEVBR1k7QUFDZixhQUFPLEtBQUEsVUFBQSxJQUFBLEVBQUEsSUFBc0IsRUFBQSxJQUFNLEtBQW5DLFFBQUE7QUFEZTtBQUhaO0FBQUE7QUFBQSxxQ0FLYSxHQUxiLEVBS2E7QUFDaEIsYUFBTyxLQUFBLFVBQUEsSUFBZSxHQUFHLENBQWxCLEtBQUEsSUFBNkIsR0FBRyxDQUFILEdBQUEsSUFBVyxLQUEvQyxRQUFBO0FBRGdCO0FBTGI7QUFBQTtBQUFBLGdDQU9NO0FDYVQsYURaQSxLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLFVBQUEsRUFBa0MsS0FBbEMsUUFBQSxDQ1lBO0FEYlM7QUFQTjtBQUFBO0FBQUEsZ0NBU1EsR0FUUixFQVNRO0FDZVgsYURkQSxLQUFBLFNBQUEsQ0FBVyxLQUFBLFVBQUEsR0FBWCxHQUFBLENDY0E7QURmVztBQVRSO0FBQUE7QUFBQSwrQkFXTyxFQVhQLEVBV087QUFDVixVQUFBLFNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxLQUFBLEdBQUEsR0FBTyxLQUFuQixRQUFBO0FBQ0EsV0FBQSxRQUFBLEdBQUEsRUFBQTtBQ2tCQSxhRGpCQSxLQUFBLEdBQUEsR0FBTyxLQUFBLFFBQUEsR0FBWSxTQ2lCbkI7QURwQlU7QUFYUDtBQUFBO0FBQUEsMkJBZUM7QUFDSixhQUFPLElBQUEsVUFBQSxDQUFlLEtBQWYsS0FBQSxFQUFzQixLQUF0QixVQUFBLEVBQWtDLEtBQWxDLFFBQUEsRUFBNEMsS0FBbkQsR0FBTyxDQUFQO0FBREk7QUFmRDs7QUFBQTtBQUFBLEVBQXlCLElBQUEsQ0FBekIsR0FBQSxDQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFRkEsSUFBQSxZQUFBLEdBQUEsT0FBQSxDQUFBLGVBQUEsQ0FBQTs7QUFFQSxJQUFhLFFBQU47QUFBQTtBQUFBO0FBQUE7O0FBQ0wsb0JBQWEsS0FBYixFQUFhLEdBQWIsRUFBYTtBQUFBOztBQUFBLFFBQWUsTUFBZix1RUFBQSxFQUFBO0FBQUEsUUFBMkIsTUFBM0IsdUVBQUEsRUFBQTtBQUFBLFFBQUEsT0FBQSx1RUFBQSxFQUFBOztBQUFBOztBQ0dYO0FESFksVUFBQSxLQUFBLEdBQUEsS0FBQTtBQUFRLFVBQUEsR0FBQSxHQUFBLEdBQUE7QUFBK0IsVUFBQSxPQUFBLEdBQUEsT0FBQTs7QUFFbkQsVUFBQSxPQUFBLENBQVMsTUFBVCxPQUFBOztBQUNBLFVBQUEsSUFBQSxHQUFBLEVBQUE7QUFDQSxVQUFBLE1BQUEsR0FBQSxNQUFBO0FBQ0EsVUFBQSxNQUFBLEdBQUEsTUFBQTtBQUxXO0FBQUE7O0FBRFI7QUFBQTtBQUFBLDRCQU9FO0FBQ0wsV0FBQSxTQUFBO0FBREY7QUFBTztBQVBGO0FBQUE7QUFBQSxnQ0FVTTtBQUNULFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxZQUFBLEdBQVQsTUFBQTtBQUNBLE1BQUEsR0FBQSxHQUFBLEtBQUEsVUFBQTtBQUFBLE1BQUEsT0FBQSxHQUFBLEVBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUNhRSxRQUFBLEdBQUcsR0FBRyxHQUFHLENBQVQsQ0FBUyxDQUFUOztBRFpBLFlBQUcsR0FBRyxDQUFILEtBQUEsR0FBWSxLQUFBLEtBQUEsR0FBTyxLQUFBLE1BQUEsQ0FBdEIsTUFBQSxFQUFBO0FBQ0UsVUFBQSxHQUFHLENBQUgsS0FBQSxJQUFBLE1BQUE7QUNjRDs7QURiRCxZQUFHLEdBQUcsQ0FBSCxHQUFBLElBQVcsS0FBQSxLQUFBLEdBQU8sS0FBQSxNQUFBLENBQXJCLE1BQUEsRUFBQTtBQ2VFLFVBQUEsT0FBTyxDQUFQLElBQUEsQ0RkQSxHQUFHLENBQUgsR0FBQSxJQUFXLE1DY1g7QURmRixTQUFBLE1BQUE7QUNpQkUsVUFBQSxPQUFPLENBQVAsSUFBQSxDQUFhLEtBQWIsQ0FBQTtBQUNEO0FEckJIOztBQ3VCQSxhQUFBLE9BQUE7QUR6QlM7QUFWTjtBQUFBO0FBQUEsZ0NBaUJNO0FBQ1QsVUFBQSxJQUFBOztBQUFBLFVBQUcsS0FBSCxTQUFHLEVBQUgsRUFBQTtBQUNFLFFBQUEsSUFBQSxHQUFPLEtBQVAsWUFBTyxFQUFQO0FBREYsT0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFBLEdBQUEsRUFBQTtBQ3VCRDs7QUR0QkQsYUFBTyxLQUFBLE1BQUEsR0FBQSxJQUFBLEdBQWEsS0FBcEIsTUFBQTtBQUxTO0FBakJOO0FBQUE7QUFBQSxrQ0F1QlE7QUFDWCxhQUFPLEtBQUEsTUFBQSxDQUFBLE1BQUEsR0FBZSxLQUFBLE1BQUEsQ0FBdEIsTUFBQTtBQURXO0FBdkJSO0FBQUE7QUFBQSwyQkEwQkM7QUFDSixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFBLFFBQUEsQ0FBYSxLQUFiLEtBQUEsRUFBcUIsS0FBckIsR0FBQSxFQUEyQixLQUEzQixNQUFBLEVBQW9DLEtBQTFDLE1BQU0sQ0FBTjtBQUNBLE1BQUEsR0FBRyxDQUFILFVBQUEsR0FBaUIsS0FBQSxVQUFBLENBQUEsR0FBQSxDQUFpQixVQUFBLENBQUEsRUFBQTtBQzRCaEMsZUQ1QnFDLENBQUMsQ0FBRCxJQUFBLEVDNEJyQztBRDVCRixPQUFpQixDQUFqQjtBQUNBLGFBQUEsR0FBQTtBQUhJO0FBMUJEOztBQUFBO0FBQUEsRUFBdUIsWUFBQSxDQUF2QixXQUFBLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRURBLElBQWEsa0JBQU47QUFBQTtBQUFBO0FBQ0wsZ0NBQWE7QUFBQTtBQUFBOztBQURSO0FBQUE7QUFBQSx5QkFFQyxHQUZELEVBRUMsR0FGRCxFQUVDO0FBQ0osVUFBRyxPQUFBLFlBQUEsS0FBQSxXQUFBLElBQUEsWUFBQSxLQUFILElBQUEsRUFBQTtBQ0NFLGVEQUEsWUFBWSxDQUFaLE9BQUEsQ0FBcUIsS0FBQSxPQUFBLENBQXJCLEdBQXFCLENBQXJCLEVBQW9DLElBQUksQ0FBSixTQUFBLENBQXBDLEdBQW9DLENBQXBDLENDQUE7QUFDRDtBREhHO0FBRkQ7QUFBQTtBQUFBLCtCQUtPLElBTFAsRUFLTyxHQUxQLEVBS08sR0FMUCxFQUtPO0FBQ1YsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sS0FBQSxJQUFBLENBQVAsSUFBTyxDQUFQOztBQUNBLFVBQU8sSUFBQSxJQUFQLElBQUEsRUFBQTtBQUNFLFFBQUEsSUFBQSxHQUFBLEVBQUE7QUNLRDs7QURKRCxNQUFBLElBQUssQ0FBTCxHQUFLLENBQUwsR0FBQSxHQUFBO0FDTUEsYURMQSxLQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxDQ0tBO0FEVlU7QUFMUDtBQUFBO0FBQUEseUJBV0MsR0FYRCxFQVdDO0FBQ0osVUFBRyxPQUFBLFlBQUEsS0FBQSxXQUFBLElBQUEsWUFBQSxLQUFILElBQUEsRUFBQTtBQ1FFLGVEUEEsSUFBSSxDQUFKLEtBQUEsQ0FBVyxZQUFZLENBQVosT0FBQSxDQUFxQixLQUFBLE9BQUEsQ0FBaEMsR0FBZ0MsQ0FBckIsQ0FBWCxDQ09BO0FBQ0Q7QURWRztBQVhEO0FBQUE7QUFBQSw0QkFjSSxHQWRKLEVBY0k7QUNXUCxhRFZBLGNBQVksR0NVWjtBRFhPO0FBZEo7O0FBQUE7QUFBQSxHQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5pbXBvcnQgeyBQYWlyIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9QYWlyJztcblxuZXhwb3J0IGNsYXNzIEJveEhlbHBlclxuICBjb25zdHJ1Y3RvcjogKEBjb250ZXh0LCBvcHRpb25zID0ge30pIC0+XG4gICAgQGRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogQGNvbnRleHQuY29kZXdhdmUuZGVjb1xuICAgICAgcGFkOiAyXG4gICAgICB3aWR0aDogNTBcbiAgICAgIGhlaWdodDogM1xuICAgICAgb3BlblRleHQ6ICcnXG4gICAgICBjbG9zZVRleHQ6ICcnXG4gICAgICBwcmVmaXg6ICcnXG4gICAgICBzdWZmaXg6ICcnXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICBjbG9uZTogKHRleHQpIC0+XG4gICAgb3B0ID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XVxuICAgIHJldHVybiBuZXcgQm94SGVscGVyKEBjb250ZXh0LG9wdClcbiAgZHJhdzogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBzdGFydFNlcCgpICsgXCJcXG5cIiArIEBsaW5lcyh0ZXh0KSArIFwiXFxuXCIrIEBlbmRTZXAoKVxuICB3cmFwQ29tbWVudDogKHN0cikgLT5cbiAgICByZXR1cm4gQGNvbnRleHQud3JhcENvbW1lbnQoc3RyKVxuICBzZXBhcmF0b3I6IC0+XG4gICAgbGVuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAZGVjb0xpbmUobGVuKSlcbiAgc3RhcnRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAb3BlblRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEBwcmVmaXggKyBAd3JhcENvbW1lbnQoQG9wZW5UZXh0K0BkZWNvTGluZShsbikpXG4gIGVuZFNlcDogLT5cbiAgICBsbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aCAtIEBjbG9zZVRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAY2xvc2VUZXh0K0BkZWNvTGluZShsbikpICsgQHN1ZmZpeFxuICBkZWNvTGluZTogKGxlbikgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKEBkZWNvLCBsZW4pXG4gIHBhZGRpbmc6IC0+IFxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIEBwYWQpXG4gIGxpbmVzOiAodGV4dCA9ICcnLCB1cHRvSGVpZ2h0PXRydWUpIC0+XG4gICAgdGV4dCA9IHRleHQgb3IgJydcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKVxuICAgIGlmIHVwdG9IZWlnaHRcbiAgICAgIHJldHVybiAoQGxpbmUobGluZXNbeF0gb3IgJycpIGZvciB4IGluIFswLi5AaGVpZ2h0XSkuam9pbignXFxuJykgXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIChAbGluZShsKSBmb3IgbCBpbiBsaW5lcykuam9pbignXFxuJykgXG4gIGxpbmU6ICh0ZXh0ID0gJycpIC0+XG4gICAgcmV0dXJuIChTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsQGluZGVudCkgK1xuICAgICAgQHdyYXBDb21tZW50KFxuICAgICAgICBAZGVjbyArXG4gICAgICAgIEBwYWRkaW5nKCkgK1xuICAgICAgICB0ZXh0ICtcbiAgICAgICAgU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCBAd2lkdGggLSBAcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkubGVuZ3RoKSArIFxuICAgICAgICBAcGFkZGluZygpICtcbiAgICAgICAgQGRlY29cbiAgICAgICkpXG4gIGxlZnQ6IC0+XG4gICAgQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KEBkZWNvICsgQHBhZGRpbmcoKSlcbiAgcmlnaHQ6IC0+XG4gICAgQGNvbnRleHQud3JhcENvbW1lbnRSaWdodChAcGFkZGluZygpICsgQGRlY28pXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50OiAodGV4dCkgLT5cbiAgICByZXR1cm4gQGNvbnRleHQuY29kZXdhdmUucmVtb3ZlTWFya2VycyhAY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpXG4gIHRleHRCb3VuZHM6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0VHh0U2l6ZShAcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpXG4gIGdldEJveEZvclBvczogKHBvcykgLT5cbiAgICBkZXB0aCA9IEBnZXROZXN0ZWRMdmwocG9zLnN0YXJ0KVxuICAgIGlmIGRlcHRoID4gMFxuICAgICAgbGVmdCA9IEBsZWZ0KClcbiAgICAgIGN1ckxlZnQgPSBTdHJpbmdIZWxwZXIucmVwZWF0KGxlZnQsZGVwdGgtMSlcbiAgICAgIFxuICAgICAgY2xvbmUgPSBAY2xvbmUoKVxuICAgICAgcGxhY2Vob2xkZXIgPSBcIiMjI1BsYWNlSG9sZGVyIyMjXCJcbiAgICAgIGNsb25lLndpZHRoID0gcGxhY2Vob2xkZXIubGVuZ3RoXG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IEBkZWNvICsgQGRlY28gKyBwbGFjZWhvbGRlciArIEBkZWNvICsgQGRlY29cbiAgICAgIFxuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsJy4qJykpXG4gICAgICBlbmRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLmVuZFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgXG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLGVuZEZpbmQse1xuICAgICAgICB2YWxpZE1hdGNoOiAobWF0Y2gpPT5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nKG1hdGNoLGxlZnQpXG4gICAgICAgICAgZiA9IEBjb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KG1hdGNoLnN0YXJ0KCkgLFtsZWZ0LFwiXFxuXCIsXCJcXHJcIl0sLTEpXG4gICAgICAgICAgcmV0dXJuICFmPyBvciBmLnN0ciAhPSBsZWZ0XG4gICAgICB9KVxuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcyxAY29udGV4dC5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKVxuICAgICAgaWYgcmVzP1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIFxuICBnZXROZXN0ZWRMdmw6IChpbmRleCkgLT5cbiAgICBkZXB0aCA9IDBcbiAgICBsZWZ0ID0gQGxlZnQoKVxuICAgIHdoaWxlIChmID0gQGNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQoaW5kZXggLFtsZWZ0LFwiXFxuXCIsXCJcXHJcIl0sLTEpKT8gJiYgZi5zdHIgPT0gbGVmdFxuICAgICAgaW5kZXggPSBmLnBvc1xuICAgICAgZGVwdGgrK1xuICAgIHJldHVybiBkZXB0aFxuICBnZXRPcHRGcm9tTGluZTogKGxpbmUsZ2V0UGFkPXRydWUpIC0+XG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KEBkZWNvKSkrXCIpKFxcXFxzKilcIilcbiAgICByRW5kID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodChAZGVjbykpK1wiKShcXG58JClcIilcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpXG4gICAgcmVzRW5kID0gckVuZC5leGVjKGxpbmUpXG4gICAgaWYgcmVzU3RhcnQ/IGFuZCByZXNFbmQ/XG4gICAgICBpZiBnZXRQYWRcbiAgICAgICAgQHBhZCA9IE1hdGgubWluKHJlc1N0YXJ0WzNdLmxlbmd0aCxyZXNFbmRbMV0ubGVuZ3RoKVxuICAgICAgQGluZGVudCA9IHJlc1N0YXJ0WzFdLmxlbmd0aFxuICAgICAgc3RhcnRQb3MgPSByZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCArIEBwYWRcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSBAcGFkXG4gICAgICBAd2lkdGggPSBlbmRQb3MgLSBzdGFydFBvc1xuICAgIHJldHVybiB0aGlzXG4gIHJlZm9ybWF0TGluZXM6ICh0ZXh0LG9wdGlvbnM9e30pIC0+XG4gICAgcmV0dXJuIEBsaW5lcyhAcmVtb3ZlQ29tbWVudCh0ZXh0LG9wdGlvbnMpLGZhbHNlKVxuICByZW1vdmVDb21tZW50OiAodGV4dCxvcHRpb25zPXt9KS0+XG4gICAgaWYgdGV4dD9cbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH1cbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24oe30sZGVmYXVsdHMsb3B0aW9ucylcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAZGVjbylcbiAgICAgIGZsYWcgPSBpZiBvcHRpb25zWydtdWx0aWxpbmUnXSB0aGVuICdnbScgZWxzZSAnJ1xuICAgICAgcmUxID0gbmV3IFJlZ0V4cChcIl5cXFxccyoje2VjbH0oPzoje2VkfSkqXFxcXHN7MCwje0BwYWR9fVwiLCBmbGFnKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChcIlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXFxccyokXCIsIGZsYWcpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlMSwnJykucmVwbGFjZShyZTIsJycpXG4gICBcbiAgIiwiaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBBcnJheUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYWlyXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCB2YXIgQm94SGVscGVyID0gY2xhc3MgQm94SGVscGVyIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGtleSwgcmVmLCB2YWw7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogdGhpcy5jb250ZXh0LmNvZGV3YXZlLmRlY28sXG4gICAgICBwYWQ6IDIsXG4gICAgICB3aWR0aDogNTAsXG4gICAgICBoZWlnaHQ6IDMsXG4gICAgICBvcGVuVGV4dDogJycsXG4gICAgICBjbG9zZVRleHQ6ICcnLFxuICAgICAgcHJlZml4OiAnJyxcbiAgICAgIHN1ZmZpeDogJycsXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvbmUodGV4dCkge1xuICAgIHZhciBrZXksIG9wdCwgcmVmLCB2YWw7XG4gICAgb3B0ID0ge307XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgb3B0W2tleV0gPSB0aGlzW2tleV07XG4gICAgfVxuICAgIHJldHVybiBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dCwgb3B0KTtcbiAgfVxuXG4gIGRyYXcodGV4dCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0U2VwKCkgKyBcIlxcblwiICsgdGhpcy5saW5lcyh0ZXh0KSArIFwiXFxuXCIgKyB0aGlzLmVuZFNlcCgpO1xuICB9XG5cbiAgd3JhcENvbW1lbnQoc3RyKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudChzdHIpO1xuICB9XG5cbiAgc2VwYXJhdG9yKCkge1xuICAgIHZhciBsZW47XG4gICAgbGVuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjb0xpbmUobGVuKSk7XG4gIH1cblxuICBzdGFydFNlcCgpIHtcbiAgICB2YXIgbG47XG4gICAgbG4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGggLSB0aGlzLm9wZW5UZXh0Lmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLndyYXBDb21tZW50KHRoaXMub3BlblRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSk7XG4gIH1cblxuICBlbmRTZXAoKSB7XG4gICAgdmFyIGxuO1xuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5jbG9zZVRleHQubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLndyYXBDb21tZW50KHRoaXMuY2xvc2VUZXh0ICsgdGhpcy5kZWNvTGluZShsbikpICsgdGhpcy5zdWZmaXg7XG4gIH1cblxuICBkZWNvTGluZShsZW4pIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKHRoaXMuZGVjbywgbGVuKTtcbiAgfVxuXG4gIHBhZGRpbmcoKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy5wYWQpO1xuICB9XG5cbiAgbGluZXModGV4dCA9ICcnLCB1cHRvSGVpZ2h0ID0gdHJ1ZSkge1xuICAgIHZhciBsLCBsaW5lcywgeDtcbiAgICB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKTtcbiAgICBpZiAodXB0b0hlaWdodCkge1xuICAgICAgcmV0dXJuICgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLCByZWYsIHJlc3VsdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yICh4ID0gaSA9IDAsIHJlZiA9IHRoaXMuaGVpZ2h0OyAoMCA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmKTsgeCA9IDAgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsaW5lc1t4XSB8fCAnJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSkuY2FsbCh0aGlzKSkuam9pbignXFxuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSwgbGVuMSwgcmVzdWx0cztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4xID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuMTsgaSsrKSB7XG4gICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSkuY2FsbCh0aGlzKSkuam9pbignXFxuJyk7XG4gICAgfVxuICB9XG5cbiAgbGluZSh0ZXh0ID0gJycpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLmluZGVudCkgKyB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpICsgdGV4dCArIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy53aWR0aCAtIHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkubGVuZ3RoKSArIHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQodGhpcy5kZWNvICsgdGhpcy5wYWRkaW5nKCkpO1xuICB9XG5cbiAgcmlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnModGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZUNhcnJldCh0ZXh0KSk7XG4gIH1cblxuICB0ZXh0Qm91bmRzKHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldFR4dFNpemUodGhpcy5yZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSk7XG4gIH1cblxuICBnZXRCb3hGb3JQb3MocG9zKSB7XG4gICAgdmFyIGNsb25lLCBjdXJMZWZ0LCBkZXB0aCwgZW5kRmluZCwgbGVmdCwgcGFpciwgcGxhY2Vob2xkZXIsIHJlcywgc3RhcnRGaW5kO1xuICAgIGRlcHRoID0gdGhpcy5nZXROZXN0ZWRMdmwocG9zLnN0YXJ0KTtcbiAgICBpZiAoZGVwdGggPiAwKSB7XG4gICAgICBsZWZ0ID0gdGhpcy5sZWZ0KCk7XG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LCBkZXB0aCAtIDEpO1xuICAgICAgY2xvbmUgPSB0aGlzLmNsb25lKCk7XG4gICAgICBwbGFjZWhvbGRlciA9IFwiIyMjUGxhY2VIb2xkZXIjIyNcIjtcbiAgICAgIGNsb25lLndpZHRoID0gcGxhY2Vob2xkZXIubGVuZ3RoO1xuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSB0aGlzLmRlY28gKyB0aGlzLmRlY28gKyBwbGFjZWhvbGRlciArIHRoaXMuZGVjbyArIHRoaXMuZGVjbztcbiAgICAgIHN0YXJ0RmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCAnLionKSk7XG4gICAgICBlbmRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLmVuZFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCAnLionKSk7XG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLCBlbmRGaW5kLCB7XG4gICAgICAgIHZhbGlkTWF0Y2g6IChtYXRjaCkgPT4ge1xuICAgICAgICAgIHZhciBmO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1hdGNoLGxlZnQpXG4gICAgICAgICAgZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpLCBbbGVmdCwgXCJcXG5cIiwgXCJcXHJcIl0sIC0xKTtcbiAgICAgICAgICByZXR1cm4gKGYgPT0gbnVsbCkgfHwgZi5zdHIgIT09IGxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcywgdGhpcy5jb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpO1xuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGFydCArPSBjdXJMZWZ0Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXROZXN0ZWRMdmwoaW5kZXgpIHtcbiAgICB2YXIgZGVwdGgsIGYsIGxlZnQ7XG4gICAgZGVwdGggPSAwO1xuICAgIGxlZnQgPSB0aGlzLmxlZnQoKTtcbiAgICB3aGlsZSAoKChmID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KGluZGV4LCBbbGVmdCwgXCJcXG5cIiwgXCJcXHJcIl0sIC0xKSkgIT0gbnVsbCkgJiYgZi5zdHIgPT09IGxlZnQpIHtcbiAgICAgIGluZGV4ID0gZi5wb3M7XG4gICAgICBkZXB0aCsrO1xuICAgIH1cbiAgICByZXR1cm4gZGVwdGg7XG4gIH1cblxuICBnZXRPcHRGcm9tTGluZShsaW5lLCBnZXRQYWQgPSB0cnVlKSB7XG4gICAgdmFyIGVuZFBvcywgckVuZCwgclN0YXJ0LCByZXNFbmQsIHJlc1N0YXJ0LCBzdGFydFBvcztcbiAgICByU3RhcnQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQodGhpcy5kZWNvKSkgKyBcIikoXFxcXHMqKVwiKTtcbiAgICByRW5kID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLmRlY28pKSArIFwiKShcXG58JClcIik7XG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKTtcbiAgICByZXNFbmQgPSByRW5kLmV4ZWMobGluZSk7XG4gICAgaWYgKChyZXNTdGFydCAhPSBudWxsKSAmJiAocmVzRW5kICE9IG51bGwpKSB7XG4gICAgICBpZiAoZ2V0UGFkKSB7XG4gICAgICAgIHRoaXMucGFkID0gTWF0aC5taW4ocmVzU3RhcnRbM10ubGVuZ3RoLCByZXNFbmRbMV0ubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5kZW50ID0gcmVzU3RhcnRbMV0ubGVuZ3RoO1xuICAgICAgc3RhcnRQb3MgPSByZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCArIHRoaXMucGFkO1xuICAgICAgZW5kUG9zID0gcmVzRW5kLmluZGV4ICsgcmVzRW5kWzFdLmxlbmd0aCAtIHRoaXMucGFkO1xuICAgICAgdGhpcy53aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlZm9ybWF0TGluZXModGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMubGluZXModGhpcy5yZW1vdmVDb21tZW50KHRleHQsIG9wdGlvbnMpLCBmYWxzZSk7XG4gIH1cblxuICByZW1vdmVDb21tZW50KHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywgZWNsLCBlY3IsIGVkLCBmbGFnLCBvcHQsIHJlMSwgcmUyO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH07XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuZGVjbyk7XG4gICAgICBmbGFnID0gb3B0aW9uc1snbXVsdGlsaW5lJ10gPyAnZ20nIDogJyc7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzezAsJHt0aGlzLnBhZH19YCwgZmxhZyk7XG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBcXFxccyooPzoke2VkfSkqJHtlY3J9XFxcXHMqJGAsIGZsYWcpO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsICcnKS5yZXBsYWNlKHJlMiwgJycpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zQ29sbGVjdGlvbiB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgb3B0aW9uYWxQcm9taXNlIH0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCBjbGFzcyBDbG9zaW5nUHJvbXBcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsc2VsZWN0aW9ucykgLT5cbiAgICBAdGltZW91dCA9IG51bGxcbiAgICBAX3R5cGVkID0gbnVsbFxuICAgIEBzdGFydGVkID0gZmFsc2VcbiAgICBAbmJDaGFuZ2VzID0gMFxuICAgIEBzZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucylcbiAgYmVnaW46IC0+XG4gICAgQHN0YXJ0ZWQgPSB0cnVlXG4gICAgb3B0aW9uYWxQcm9taXNlKEBhZGRDYXJyZXRzKCkpLnRoZW4gPT5cbiAgICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKVxuICAgICAgICBAcHJveHlPbkNoYW5nZSA9IChjaD1udWxsKT0+IEBvbkNoYW5nZShjaClcbiAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lciggQHByb3h5T25DaGFuZ2UgKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICAucmVzdWx0KClcbiAgYWRkQ2FycmV0czogLT5cbiAgICBAcmVwbGFjZW1lbnRzID0gQHNlbGVjdGlvbnMud3JhcChcbiAgICAgIEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNhcnJldENoYXIgKyBAY29kZXdhdmUuYnJha2V0cyArIFwiXFxuXCIsXG4gICAgICBcIlxcblwiICsgQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNvZGV3YXZlLmNhcnJldENoYXIgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICkubWFwKCAocCkgLT4gcC5jYXJyZXRUb1NlbCgpIClcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKEByZXBsYWNlbWVudHMpXG4gIGludmFsaWRUeXBlZDogLT5cbiAgICBAX3R5cGVkID0gbnVsbFxuICBvbkNoYW5nZTogKGNoID0gbnVsbCktPlxuICAgIEBpbnZhbGlkVHlwZWQoKVxuICAgIGlmIEBza2lwRXZlbnQoY2gpXG4gICAgICByZXR1cm5cbiAgICBAbmJDaGFuZ2VzKytcbiAgICBpZiBAc2hvdWxkU3RvcCgpXG4gICAgICBAc3RvcCgpXG4gICAgICBAY2xlYW5DbG9zZSgpXG4gICAgZWxzZVxuICAgICAgQHJlc3VtZSgpXG4gICAgICBcbiAgc2tpcEV2ZW50OiAoY2gpIC0+XG4gICAgcmV0dXJuIGNoPyBhbmQgY2guY2hhckNvZGVBdCgwKSAhPSAzMlxuICBcbiAgcmVzdW1lOiAtPlxuICAgICNcbiAgICBcbiAgc2hvdWxkU3RvcDogLT5cbiAgICByZXR1cm4gQHR5cGVkKCkgPT0gZmFsc2Ugb3IgQHR5cGVkKCkuaW5kZXhPZignICcpICE9IC0xXG4gIFxuICBjbGVhbkNsb3NlOiAtPlxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc2VsZWN0aW9ucyA9IEBnZXRTZWxlY3Rpb25zKClcbiAgICBmb3Igc2VsIGluIHNlbGVjdGlvbnNcbiAgICAgIGlmIHBvcyA9IEB3aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICAgIHN0YXJ0ID0gc2VsXG4gICAgICBlbHNlIGlmIChlbmQgPSBAd2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpIGFuZCBzdGFydD9cbiAgICAgICAgcmVzID0gZW5kLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXVxuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LGVuZC5pbm5lckVuZCxyZXMpXG4gICAgICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtzdGFydF1cbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gocmVwbClcbiAgICAgICAgc3RhcnQgPSBudWxsXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIGdldFNlbGVjdGlvbnM6IC0+XG4gICAgcmV0dXJuIEBjb2Rld2F2ZS5lZGl0b3IuZ2V0TXVsdGlTZWwoKVxuICBzdG9wOiAtPlxuICAgIEBzdGFydGVkID0gZmFsc2VcbiAgICBjbGVhclRpbWVvdXQoQHRpbWVvdXQpIGlmIEB0aW1lb3V0P1xuICAgIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPSBudWxsIGlmIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPT0gdGhpc1xuICAgIGlmIEBwcm94eU9uQ2hhbmdlP1xuICAgICAgQGNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcihAcHJveHlPbkNoYW5nZSlcbiAgY2FuY2VsOiAtPlxuICAgIGlmIEB0eXBlZCgpICE9IGZhbHNlXG4gICAgICBAY2FuY2VsU2VsZWN0aW9ucyhAZ2V0U2VsZWN0aW9ucygpKVxuICAgIEBzdG9wKClcbiAgY2FuY2VsU2VsZWN0aW9uczogKHNlbGVjdGlvbnMpIC0+XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzdGFydCA9IG51bGxcbiAgICBmb3Igc2VsIGluIHNlbGVjdGlvbnNcbiAgICAgIGlmIHBvcyA9IEB3aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICAgIHN0YXJ0ID0gcG9zXG4gICAgICBlbHNlIGlmIChlbmQgPSBAd2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpIGFuZCBzdGFydD9cbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3IFJlcGxhY2VtZW50KHN0YXJ0LnN0YXJ0LGVuZC5lbmQsQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHN0YXJ0LmVuZCsxLCBlbmQuc3RhcnQtMSkpLnNlbGVjdENvbnRlbnQoKSlcbiAgICAgICAgc3RhcnQgPSBudWxsXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIHR5cGVkOiAtPlxuICAgIHVubGVzcyBAX3R5cGVkP1xuICAgICAgY3BvcyA9IEBjb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKClcbiAgICAgIGlubmVyU3RhcnQgPSBAcmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICsgQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoXG4gICAgICBpZiBAY29kZXdhdmUuZmluZFByZXZCcmFrZXQoY3Bvcy5zdGFydCkgPT0gQHJlcGxhY2VtZW50c1swXS5zdGFydCBhbmQgKGlubmVyRW5kID0gQGNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGlubmVyU3RhcnQpKT8gYW5kIGlubmVyRW5kID49IGNwb3MuZW5kXG4gICAgICAgIEBfdHlwZWQgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpXG4gICAgICBlbHNlXG4gICAgICAgIEBfdHlwZWQgPSBmYWxzZVxuICAgIHJldHVybiBAX3R5cGVkXG4gIHdoaXRoaW5PcGVuQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBzdGFydFBvc0F0KGkpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PSB0YXJnZXRUZXh0XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcbiAgd2hpdGhpbkNsb3NlQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBlbmRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09IHRhcmdldFRleHRcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuICBzdGFydFBvc0F0OiAoaW5kZXgpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiksXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uZW5kICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzEpXG4gICAgICApLndyYXBwZWRCeShAY29kZXdhdmUuYnJha2V0cywgQGNvZGV3YXZlLmJyYWtldHMpXG4gIGVuZFBvc0F0OiAoaW5kZXgpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uc3RhcnQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMSksXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzIpXG4gICAgICApLndyYXBwZWRCeShAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIsIEBjb2Rld2F2ZS5icmFrZXRzKVxuXG5leHBvcnQgY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wXG4gIHJlc3VtZTogLT5cbiAgICBAc2ltdWxhdGVUeXBlKClcbiAgc2ltdWxhdGVUeXBlOiAtPlxuICAgIGNsZWFyVGltZW91dChAdGltZW91dCkgaWYgQHRpbWVvdXQ/XG4gICAgQHRpbWVvdXQgPSBzZXRUaW1lb3V0ICg9PlxuICAgICAgQGludmFsaWRUeXBlZCgpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgY3VyQ2xvc2UgPSBAd2hpdGhpbkNsb3NlQm91bmRzKEByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXS5jb3B5KCkuYXBwbHlPZmZzZXQoQHR5cGVkKCkubGVuZ3RoKSlcbiAgICAgIGlmIGN1ckNsb3NlXG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoY3VyQ2xvc2Uuc3RhcnQsY3VyQ2xvc2UuZW5kLHRhcmdldFRleHQpXG4gICAgICAgIGlmIHJlcGwud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS5uZWNlc3NhcnkoKVxuICAgICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoW3JlcGxdKVxuICAgICAgZWxzZVxuICAgICAgICBAc3RvcCgpXG4gICAgICBAb25UeXBlU2ltdWxhdGVkKCkgaWYgQG9uVHlwZVNpbXVsYXRlZD9cbiAgICApLCAyXG4gIHNraXBFdmVudDogLT5cbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0U2VsZWN0aW9uczogLT5cbiAgICByZXR1cm4gW1xuICAgICAgICBAY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpXG4gICAgICAgIEByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXSArIEB0eXBlZCgpLmxlbmd0aFxuICAgICAgXVxuICB3aGl0aGluQ2xvc2VCb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQGVuZFBvc0F0KGkpXG4gICAgICBuZXh0ID0gQGNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KVxuICAgICAgaWYgbmV4dD9cbiAgICAgICAgdGFyZ2V0UG9zLm1vdmVTdWZmaXgobmV4dClcbiAgICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKVxuICAgICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IChjb2Rld2F2ZSxzZWxlY3Rpb25zKSAtPlxuICBpZiBjb2Rld2F2ZS5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgcmV0dXJuIG5ldyBDbG9zaW5nUHJvbXAoY29kZXdhdmUsc2VsZWN0aW9ucylcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLHNlbGVjdGlvbnMpIiwiaW1wb3J0IHtcbiAgUG9zQ29sbGVjdGlvblxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgb3B0aW9uYWxQcm9taXNlXG59IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgdmFyIENsb3NpbmdQcm9tcCA9IGNsYXNzIENsb3NpbmdQcm9tcCB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlMSwgc2VsZWN0aW9ucykge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTE7XG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLl90eXBlZCA9IG51bGw7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5uYkNoYW5nZXMgPSAwO1xuICAgIHRoaXMuc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uKHNlbGVjdGlvbnMpO1xuICB9XG5cbiAgYmVnaW4oKSB7XG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gb3B0aW9uYWxQcm9taXNlKHRoaXMuYWRkQ2FycmV0cygpKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci5jYW5MaXN0ZW5Ub0NoYW5nZSgpKSB7XG4gICAgICAgIHRoaXMucHJveHlPbkNoYW5nZSA9IChjaCA9IG51bGwpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkNoYW5nZShjaCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMucHJveHlPbkNoYW5nZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KS5yZXN1bHQoKTtcbiAgfVxuXG4gIGFkZENhcnJldHMoKSB7XG4gICAgdGhpcy5yZXBsYWNlbWVudHMgPSB0aGlzLnNlbGVjdGlvbnMud3JhcCh0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyBcIlxcblwiLCBcIlxcblwiICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMpLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gcC5jYXJyZXRUb1NlbCgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyh0aGlzLnJlcGxhY2VtZW50cyk7XG4gIH1cblxuICBpbnZhbGlkVHlwZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkID0gbnVsbDtcbiAgfVxuXG4gIG9uQ2hhbmdlKGNoID0gbnVsbCkge1xuICAgIHRoaXMuaW52YWxpZFR5cGVkKCk7XG4gICAgaWYgKHRoaXMuc2tpcEV2ZW50KGNoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm5iQ2hhbmdlcysrO1xuICAgIGlmICh0aGlzLnNob3VsZFN0b3AoKSkge1xuICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICByZXR1cm4gdGhpcy5jbGVhbkNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VtZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNraXBFdmVudChjaCkge1xuICAgIHJldHVybiAoY2ggIT0gbnVsbCkgJiYgY2guY2hhckNvZGVBdCgwKSAhPT0gMzI7XG4gIH1cblxuICByZXN1bWUoKSB7fVxuXG4gIFxuICBzaG91bGRTdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGVkKCkgPT09IGZhbHNlIHx8IHRoaXMudHlwZWQoKS5pbmRleE9mKCcgJykgIT09IC0xO1xuICB9XG5cbiAgY2xlYW5DbG9zZSgpIHtcbiAgICB2YXIgZW5kLCBqLCBsZW4sIHBvcywgcmVwbCwgcmVwbGFjZW1lbnRzLCByZXMsIHNlbCwgc2VsZWN0aW9ucywgc3RhcnQ7XG4gICAgcmVwbGFjZW1lbnRzID0gW107XG4gICAgc2VsZWN0aW9ucyA9IHRoaXMuZ2V0U2VsZWN0aW9ucygpO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNlbGVjdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNlbCA9IHNlbGVjdGlvbnNbal07XG4gICAgICBpZiAocG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpKSB7XG4gICAgICAgIHN0YXJ0ID0gc2VsO1xuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgKHN0YXJ0ICE9IG51bGwpKSB7XG4gICAgICAgIHJlcyA9IGVuZC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS5pbm5lclRleHQoKS5zcGxpdCgnICcpWzBdO1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LCBlbmQuaW5uZXJFbmQsIHJlcyk7XG4gICAgICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtzdGFydF07XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKHJlcGwpO1xuICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0TXVsdGlTZWwoKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID09PSB0aGlzKSB7XG4gICAgICB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3h5T25DaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMucHJveHlPbkNoYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIGlmICh0aGlzLnR5cGVkKCkgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmNhbmNlbFNlbGVjdGlvbnModGhpcy5nZXRTZWxlY3Rpb25zKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdG9wKCk7XG4gIH1cblxuICBjYW5jZWxTZWxlY3Rpb25zKHNlbGVjdGlvbnMpIHtcbiAgICB2YXIgZW5kLCBqLCBsZW4sIHBvcywgcmVwbGFjZW1lbnRzLCBzZWwsIHN0YXJ0O1xuICAgIHJlcGxhY2VtZW50cyA9IFtdO1xuICAgIHN0YXJ0ID0gbnVsbDtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdO1xuICAgICAgaWYgKHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKSkge1xuICAgICAgICBzdGFydCA9IHBvcztcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIChzdGFydCAhPSBudWxsKSkge1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXcgUmVwbGFjZW1lbnQoc3RhcnQuc3RhcnQsIGVuZC5lbmQsIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoc3RhcnQuZW5kICsgMSwgZW5kLnN0YXJ0IC0gMSkpLnNlbGVjdENvbnRlbnQoKSk7XG4gICAgICAgIHN0YXJ0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxuICB0eXBlZCgpIHtcbiAgICB2YXIgY3BvcywgaW5uZXJFbmQsIGlubmVyU3RhcnQ7XG4gICAgaWYgKHRoaXMuX3R5cGVkID09IG51bGwpIHtcbiAgICAgIGNwb3MgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKTtcbiAgICAgIGlubmVyU3RhcnQgPSB0aGlzLnJlcGxhY2VtZW50c1swXS5zdGFydCArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGg7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PT0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgJiYgKChpbm5lckVuZCA9IHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoaW5uZXJTdGFydCkpICE9IG51bGwpICYmIGlubmVyRW5kID49IGNwb3MuZW5kKSB7XG4gICAgICAgIHRoaXMuX3R5cGVkID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihpbm5lclN0YXJ0LCBpbm5lckVuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl90eXBlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHlwZWQ7XG4gIH1cblxuICB3aGl0aGluT3BlbkJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuc3RhcnRQb3NBdChpKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXJ0UG9zQXQoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5zdGFydCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cywgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKTtcbiAgfVxuXG4gIGVuZFBvc0F0KGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDEpLCB0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5lbmQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDIpKS53cmFwcGVkQnkodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIsIHRoaXMuY29kZXdhdmUuYnJha2V0cyk7XG4gIH1cblxufTtcblxuZXhwb3J0IHZhciBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgPSBjbGFzcyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgZXh0ZW5kcyBDbG9zaW5nUHJvbXAge1xuICByZXN1bWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2ltdWxhdGVUeXBlKCk7XG4gIH1cblxuICBzaW11bGF0ZVR5cGUoKSB7XG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgIHZhciBjdXJDbG9zZSwgcmVwbCwgdGFyZ2V0VGV4dDtcbiAgICAgIHRoaXMuaW52YWxpZFR5cGVkKCk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBjdXJDbG9zZSA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0uY29weSgpLmFwcGx5T2Zmc2V0KHRoaXMudHlwZWQoKS5sZW5ndGgpKTtcbiAgICAgIGlmIChjdXJDbG9zZSkge1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LCBjdXJDbG9zZS5lbmQsIHRhcmdldFRleHQpO1xuICAgICAgICBpZiAocmVwbC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS5uZWNlc3NhcnkoKSkge1xuICAgICAgICAgIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKFtyZXBsXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub25UeXBlU2ltdWxhdGVkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25UeXBlU2ltdWxhdGVkKCk7XG4gICAgICB9XG4gICAgfSksIDIpO1xuICB9XG5cbiAgc2tpcEV2ZW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIFt0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKSwgdGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXSArIHRoaXMudHlwZWQoKS5sZW5ndGhdO1xuICB9XG5cbiAgd2hpdGhpbkNsb3NlQm91bmRzKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIG5leHQsIHJlZiwgcmVwbCwgdGFyZ2V0UG9zO1xuICAgIHJlZiA9IHRoaXMucmVwbGFjZW1lbnRzO1xuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5lbmRQb3NBdChpKTtcbiAgICAgIG5leHQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KTtcbiAgICAgIGlmIChuZXh0ICE9IG51bGwpIHtcbiAgICAgICAgdGFyZ2V0UG9zLm1vdmVTdWZmaXgobmV4dCk7XG4gICAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldFBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxufTtcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IGZ1bmN0aW9uKGNvZGV3YXZlLCBzZWxlY3Rpb25zKSB7XG4gIGlmIChjb2Rld2F2ZS5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgcmV0dXJuIG5ldyBDbG9zaW5nUHJvbXAoY29kZXdhdmUsIHNlbGVjdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIENtZEZpbmRlclxuICBjb25zdHJ1Y3RvcjogKG5hbWVzLCBvcHRpb25zKSAtPlxuICAgIGlmIHR5cGVvZiBuYW1lcyA9PSAnc3RyaW5nJ1xuICAgICAgbmFtZXMgPSBbbmFtZXNdXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGxcbiAgICAgIG5hbWVzcGFjZXM6IFtdXG4gICAgICBwYXJlbnRDb250ZXh0OiBudWxsXG4gICAgICBjb250ZXh0OiBudWxsXG4gICAgICByb290OiBDb21tYW5kLmNtZHNcbiAgICAgIG11c3RFeGVjdXRlOiB0cnVlXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWVcbiAgICAgIHVzZUZhbGxiYWNrczogdHJ1ZVxuICAgICAgaW5zdGFuY2U6IG51bGxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfVxuICAgIEBuYW1lcyA9IG5hbWVzXG4gICAgQHBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dChAY29kZXdhdmUpXG4gICAgaWYgQHBhcmVudENvbnRleHQ/XG4gICAgICBAY29udGV4dC5wYXJlbnQgPSBAcGFyZW50Q29udGV4dFxuICAgIGlmIEBuYW1lc3BhY2VzP1xuICAgICAgQGNvbnRleHQuYWRkTmFtZXNwYWNlcyhAbmFtZXNwYWNlcylcbiAgZmluZDogLT5cbiAgICBAdHJpZ2dlckRldGVjdG9ycygpXG4gICAgQGNtZCA9IEBmaW5kSW4oQHJvb3QpXG4gICAgcmV0dXJuIEBjbWRcbiMgIGdldFBvc2liaWxpdGllczogLT5cbiMgICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuIyAgICBwYXRoID0gbGlzdChAcGF0aClcbiMgICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcbiAgZ2V0TmFtZXNXaXRoUGF0aHM6IC0+XG4gICAgcGF0aHMgPSB7fVxuICAgIGZvciBuYW1lIGluIEBuYW1lcyBcbiAgICAgIFtzcGFjZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG4gICAgICBpZiBzcGFjZT8gYW5kICEoc3BhY2UgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgICB1bmxlc3Mgc3BhY2Ugb2YgcGF0aHMgXG4gICAgICAgICAgcGF0aHNbc3BhY2VdID0gW11cbiAgICAgICAgcGF0aHNbc3BhY2VdLnB1c2gocmVzdClcbiAgICByZXR1cm4gcGF0aHNcbiAgYXBwbHlTcGFjZU9uTmFtZXM6IChuYW1lc3BhY2UpIC0+XG4gICAgW3NwYWNlLHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZXNwYWNlLHRydWUpXG4gICAgQG5hbWVzLm1hcCggKG5hbWUpIC0+XG4gICAgICBbY3VyX3NwYWNlLGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG4gICAgICBpZiBjdXJfc3BhY2U/IGFuZCBjdXJfc3BhY2UgPT0gc3BhY2VcbiAgICAgICAgbmFtZSA9IGN1cl9yZXN0XG4gICAgICBpZiByZXN0P1xuICAgICAgICBuYW1lID0gcmVzdCArICc6JyArIG5hbWVcbiAgICAgIHJldHVybiBuYW1lXG4gICAgKVxuICBnZXREaXJlY3ROYW1lczogLT5cbiAgICByZXR1cm4gKG4gZm9yIG4gaW4gQG5hbWVzIHdoZW4gbi5pbmRleE9mKFwiOlwiKSA9PSAtMSlcbiAgdHJpZ2dlckRldGVjdG9yczogLT5cbiAgICBpZiBAdXNlRGV0ZWN0b3JzIFxuICAgICAgQHVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICBwb3NpYmlsaXRpZXMgPSBuZXcgQ21kRmluZGVyKEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IHBvc2liaWxpdGllcy5sZW5ndGhcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldXG4gICAgICAgIGZvciBkZXRlY3RvciBpbiBjbWQuZGV0ZWN0b3JzIFxuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKVxuICAgICAgICAgIGlmIHJlcz9cbiAgICAgICAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMocmVzKVxuICAgICAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKHJlcywge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgICAgICBpKytcbiAgZmluZEluOiAoY21kLHBhdGggPSBudWxsKSAtPlxuICAgIHVubGVzcyBjbWQ/XG4gICAgICByZXR1cm4gbnVsbFxuICAgIGJlc3QgPSBAYmVzdEluUG9zaWJpbGl0aWVzKEBmaW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgaWYgYmVzdD9cbiAgICAgIHJldHVybiBiZXN0XG4gIGZpbmRQb3NpYmlsaXRpZXM6IC0+XG4gICAgdW5sZXNzIEByb290P1xuICAgICAgcmV0dXJuIFtdXG4gICAgQHJvb3QuaW5pdCgpXG4gICAgcG9zaWJpbGl0aWVzID0gW11cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/LmNtZCA9PSBAcm9vdFxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChAZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoJ2luX2luc3RhbmNlJykpXG4gICAgZm9yIHNwYWNlLCBuYW1lcyBvZiBAZ2V0TmFtZXNXaXRoUGF0aHMoKVxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChAZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoc3BhY2UsIG5hbWVzKSlcbiAgICBmb3IgbnNwYyBpbiBAY29udGV4dC5nZXROYW1lU3BhY2VzKClcbiAgICAgIFtuc3BjTmFtZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsdHJ1ZSlcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQoQGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKG5zcGNOYW1lLCBAYXBwbHlTcGFjZU9uTmFtZXMobnNwYykpKVxuICAgIGZvciBuYW1lIGluIEBnZXREaXJlY3ROYW1lcygpXG4gICAgICBkaXJlY3QgPSBAcm9vdC5nZXRDbWQobmFtZSlcbiAgICAgIGlmIEBjbWRJc1ZhbGlkKGRpcmVjdClcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZGlyZWN0KVxuICAgIGlmIEB1c2VGYWxsYmFja3NcbiAgICAgIGZhbGxiYWNrID0gQHJvb3QuZ2V0Q21kKCdmYWxsYmFjaycpXG4gICAgICBpZiBAY21kSXNWYWxpZChmYWxsYmFjaylcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZmFsbGJhY2spXG4gICAgQHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllc1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXNcbiAgZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQ6IChjbWROYW1lLCBuYW1lcyA9IEBuYW1lcykgLT5cbiAgICBwb3NpYmlsaXRpZXMgPSBbXTtcbiAgICBuZXh0cyA9IEBnZXRDbWRGb2xsb3dBbGlhcyhjbWROYW1lKVxuICAgIGZvciBuZXh0IGluIG5leHRzXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgcG9zaWJpbGl0aWVzXG4gIGdldENtZEZvbGxvd0FsaWFzOiAobmFtZSkgLT5cbiAgICBjbWQgPSBAcm9vdC5nZXRDbWQobmFtZSlcbiAgICBpZiBjbWQ/IFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmFsaWFzT2Y/XG4gICAgICAgIHJldHVybiBbY21kLGNtZC5nZXRBbGlhc2VkKCldXG4gICAgICByZXR1cm4gW2NtZF1cbiAgICByZXR1cm4gW2NtZF1cbiAgY21kSXNWYWxpZDogKGNtZCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgaWYgY21kLm5hbWUgIT0gJ2ZhbGxiYWNrJyAmJiBjbWQgaW4gQGFuY2VzdG9ycygpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gIUBtdXN0RXhlY3V0ZSBvciBAY21kSXNFeGVjdXRhYmxlKGNtZClcbiAgYW5jZXN0b3JzOiAtPlxuICAgIGlmIEBjb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICByZXR1cm4gW11cbiAgY21kSXNFeGVjdXRhYmxlOiAoY21kKSAtPlxuICAgIG5hbWVzID0gQGdldERpcmVjdE5hbWVzKClcbiAgICBpZiBuYW1lcy5sZW5ndGggPT0gMVxuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZXNbMF0pXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgY21kU2NvcmU6IChjbWQpIC0+XG4gICAgc2NvcmUgPSBjbWQuZGVwdGhcbiAgICBpZiBjbWQubmFtZSA9PSAnZmFsbGJhY2snIFxuICAgICAgICBzY29yZSAtPSAxMDAwXG4gICAgcmV0dXJuIHNjb3JlXG4gIGJlc3RJblBvc2liaWxpdGllczogKHBvc3MpIC0+XG4gICAgaWYgcG9zcy5sZW5ndGggPiAwXG4gICAgICBiZXN0ID0gbnVsbFxuICAgICAgYmVzdFNjb3JlID0gbnVsbFxuICAgICAgZm9yIHAgaW4gcG9zc1xuICAgICAgICBzY29yZSA9IEBjbWRTY29yZShwKVxuICAgICAgICBpZiAhYmVzdD8gb3Igc2NvcmUgPj0gYmVzdFNjb3JlXG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmVcbiAgICAgICAgICBiZXN0ID0gcFxuICAgICAgcmV0dXJuIGJlc3Q7IiwidmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xuXG5pbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIE5hbWVzcGFjZUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIENtZEZpbmRlciA9IGNsYXNzIENtZEZpbmRlciB7XG4gIGNvbnN0cnVjdG9yKG5hbWVzLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdO1xuICAgIH1cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgcGFyZW50Q29udGV4dDogbnVsbCxcbiAgICAgIGNvbnRleHQ6IG51bGwsXG4gICAgICByb290OiBDb21tYW5kLmNtZHMsXG4gICAgICBtdXN0RXhlY3V0ZTogdHJ1ZSxcbiAgICAgIHVzZURldGVjdG9yczogdHJ1ZSxcbiAgICAgIHVzZUZhbGxiYWNrczogdHJ1ZSxcbiAgICAgIGluc3RhbmNlOiBudWxsLFxuICAgICAgY29kZXdhdmU6IG51bGxcbiAgICB9O1xuICAgIHRoaXMubmFtZXMgPSBuYW1lcztcbiAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddO1xuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSBpZiAoKHRoaXMucGFyZW50ICE9IG51bGwpICYmIGtleSAhPT0gJ3BhcmVudCcpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzLmNvZGV3YXZlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGFyZW50Q29udGV4dCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5wYXJlbnRDb250ZXh0O1xuICAgIH1cbiAgICBpZiAodGhpcy5uYW1lc3BhY2VzICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHRoaXMubmFtZXNwYWNlcyk7XG4gICAgfVxuICB9XG5cbiAgZmluZCgpIHtcbiAgICB0aGlzLnRyaWdnZXJEZXRlY3RvcnMoKTtcbiAgICB0aGlzLmNtZCA9IHRoaXMuZmluZEluKHRoaXMucm9vdCk7XG4gICAgcmV0dXJuIHRoaXMuY21kO1xuICB9XG5cbiAgLy8gIGdldFBvc2liaWxpdGllczogLT5cbiAgLy8gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAvLyAgICBwYXRoID0gbGlzdChAcGF0aClcbiAgLy8gICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcbiAgZ2V0TmFtZXNXaXRoUGF0aHMoKSB7XG4gICAgdmFyIGosIGxlbiwgbmFtZSwgcGF0aHMsIHJlZiwgcmVzdCwgc3BhY2U7XG4gICAgcGF0aHMgPSB7fTtcbiAgICByZWYgPSB0aGlzLm5hbWVzO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmFtZSA9IHJlZltqXTtcbiAgICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKTtcbiAgICAgIGlmICgoc3BhY2UgIT0gbnVsbCkgJiYgIShpbmRleE9mLmNhbGwodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwgc3BhY2UpID49IDApKSB7XG4gICAgICAgIGlmICghKHNwYWNlIGluIHBhdGhzKSkge1xuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGF0aHM7XG4gIH1cblxuICBhcHBseVNwYWNlT25OYW1lcyhuYW1lc3BhY2UpIHtcbiAgICB2YXIgcmVzdCwgc3BhY2U7XG4gICAgW3NwYWNlLCByZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMubmFtZXMubWFwKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBjdXJfcmVzdCwgY3VyX3NwYWNlO1xuICAgICAgW2N1cl9zcGFjZSwgY3VyX3Jlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG4gICAgICBpZiAoKGN1cl9zcGFjZSAhPSBudWxsKSAmJiBjdXJfc3BhY2UgPT09IHNwYWNlKSB7XG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXN0ICE9IG51bGwpIHtcbiAgICAgICAgbmFtZSA9IHJlc3QgKyAnOicgKyBuYW1lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXREaXJlY3ROYW1lcygpIHtcbiAgICB2YXIgbjtcbiAgICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgcmVmID0gdGhpcy5uYW1lcztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBuID0gcmVmW2pdO1xuICAgICAgICBpZiAobi5pbmRleE9mKFwiOlwiKSA9PT0gLTEpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gobik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0pLmNhbGwodGhpcyk7XG4gIH1cblxuICB0cmlnZ2VyRGV0ZWN0b3JzKCkge1xuICAgIHZhciBjbWQsIGRldGVjdG9yLCBpLCBqLCBsZW4sIHBvc2liaWxpdGllcywgcmVmLCByZXMsIHJlc3VsdHM7XG4gICAgaWYgKHRoaXMudXNlRGV0ZWN0b3JzKSB7XG4gICAgICB0aGlzLnVzZURldGVjdG9ycyA9IGZhbHNlO1xuICAgICAgcG9zaWJpbGl0aWVzID0gbmV3IENtZEZpbmRlcih0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCB7XG4gICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCk7XG4gICAgICBpID0gMDtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIHdoaWxlIChpIDwgcG9zaWJpbGl0aWVzLmxlbmd0aCkge1xuICAgICAgICBjbWQgPSBwb3NpYmlsaXRpZXNbaV07XG4gICAgICAgIHJlZiA9IGNtZC5kZXRlY3RvcnM7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIGRldGVjdG9yID0gcmVmW2pdO1xuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKTtcbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcyk7XG4gICAgICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIocmVzLCB7XG4gICAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICAgICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRJbihjbWQsIHBhdGggPSBudWxsKSB7XG4gICAgdmFyIGJlc3Q7XG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgYmVzdCA9IHRoaXMuYmVzdEluUG9zaWJpbGl0aWVzKHRoaXMuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICBpZiAoYmVzdCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxuICBmaW5kUG9zaWJpbGl0aWVzKCkge1xuICAgIHZhciBkaXJlY3QsIGZhbGxiYWNrLCBqLCBrLCBsZW4sIGxlbjEsIG5hbWUsIG5hbWVzLCBuc3BjLCBuc3BjTmFtZSwgcG9zaWJpbGl0aWVzLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlc3QsIHNwYWNlO1xuICAgIGlmICh0aGlzLnJvb3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICB0aGlzLnJvb3QuaW5pdCgpO1xuICAgIHBvc2liaWxpdGllcyA9IFtdO1xuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyAocmVmMSA9IHJlZi5pbkluc3RhbmNlKSAhPSBudWxsID8gcmVmMS5jbWQgOiB2b2lkIDAgOiB2b2lkIDApID09PSB0aGlzLnJvb3QpIHtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZCgnaW5faW5zdGFuY2UnKSk7XG4gICAgfVxuICAgIHJlZjIgPSB0aGlzLmdldE5hbWVzV2l0aFBhdGhzKCk7XG4gICAgZm9yIChzcGFjZSBpbiByZWYyKSB7XG4gICAgICBuYW1lcyA9IHJlZjJbc3BhY2VdO1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKHNwYWNlLCBuYW1lcykpO1xuICAgIH1cbiAgICByZWYzID0gdGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuc3BjID0gcmVmM1tqXTtcbiAgICAgIFtuc3BjTmFtZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLCB0cnVlKTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChuc3BjTmFtZSwgdGhpcy5hcHBseVNwYWNlT25OYW1lcyhuc3BjKSkpO1xuICAgIH1cbiAgICByZWY0ID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuICAgIGZvciAoayA9IDAsIGxlbjEgPSByZWY0Lmxlbmd0aDsgayA8IGxlbjE7IGsrKykge1xuICAgICAgbmFtZSA9IHJlZjRba107XG4gICAgICBkaXJlY3QgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpO1xuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChkaXJlY3QpKSB7XG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnVzZUZhbGxiYWNrcykge1xuICAgICAgZmFsbGJhY2sgPSB0aGlzLnJvb3QuZ2V0Q21kKCdmYWxsYmFjaycpO1xuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChmYWxsYmFjaykpIHtcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZmFsbGJhY2spO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcztcbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzO1xuICB9XG5cbiAgZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoY21kTmFtZSwgbmFtZXMgPSB0aGlzLm5hbWVzKSB7XG4gICAgdmFyIGosIGxlbiwgbmV4dCwgbmV4dHMsIHBvc2liaWxpdGllcztcbiAgICBwb3NpYmlsaXRpZXMgPSBbXTtcbiAgICBuZXh0cyA9IHRoaXMuZ2V0Q21kRm9sbG93QWxpYXMoY21kTmFtZSk7XG4gICAgZm9yIChqID0gMCwgbGVuID0gbmV4dHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5leHQgPSBuZXh0c1tqXTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIHJvb3Q6IG5leHRcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgfVxuICAgIHJldHVybiBwb3NpYmlsaXRpZXM7XG4gIH1cblxuICBnZXRDbWRGb2xsb3dBbGlhcyhuYW1lKSB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbY21kLCBjbWQuZ2V0QWxpYXNlZCgpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbY21kXTtcbiAgICB9XG4gICAgcmV0dXJuIFtjbWRdO1xuICB9XG5cbiAgY21kSXNWYWxpZChjbWQpIHtcbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGNtZC5uYW1lICE9PSAnZmFsbGJhY2snICYmIGluZGV4T2YuY2FsbCh0aGlzLmFuY2VzdG9ycygpLCBjbWQpID49IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLm11c3RFeGVjdXRlIHx8IHRoaXMuY21kSXNFeGVjdXRhYmxlKGNtZCk7XG4gIH1cblxuICBhbmNlc3RvcnMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gcmVmLmluSW5zdGFuY2UgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjbWRJc0V4ZWN1dGFibGUoY21kKSB7XG4gICAgdmFyIG5hbWVzO1xuICAgIG5hbWVzID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgfVxuICB9XG5cbiAgY21kU2NvcmUoY21kKSB7XG4gICAgdmFyIHNjb3JlO1xuICAgIHNjb3JlID0gY21kLmRlcHRoO1xuICAgIGlmIChjbWQubmFtZSA9PT0gJ2ZhbGxiYWNrJykge1xuICAgICAgc2NvcmUgLT0gMTAwMDtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3JlO1xuICB9XG5cbiAgYmVzdEluUG9zaWJpbGl0aWVzKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlO1xuICAgIGlmIChwb3NzLmxlbmd0aCA+IDApIHtcbiAgICAgIGJlc3QgPSBudWxsO1xuICAgICAgYmVzdFNjb3JlID0gbnVsbDtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHBvc3MubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHBvc3Nbal07XG4gICAgICAgIHNjb3JlID0gdGhpcy5jbWRTY29yZShwKTtcbiAgICAgICAgaWYgKChiZXN0ID09IG51bGwpIHx8IHNjb3JlID49IGJlc3RTY29yZSkge1xuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlO1xuICAgICAgICAgIGJlc3QgPSBwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBDbWRJbnN0YW5jZVxuICBjb25zdHJ1Y3RvcjogKEBjbWQsQGNvbnRleHQpIC0+XG4gIFxuICBpbml0OiAtPlxuICAgIHVubGVzcyBAaXNFbXB0eSgpIG9yIEBpbml0ZWRcbiAgICAgIEBpbml0ZWQgPSB0cnVlXG4gICAgICBAX2dldENtZE9iaigpXG4gICAgICBAX2luaXRQYXJhbXMoKVxuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgQGNtZE9iai5pbml0KClcbiAgICByZXR1cm4gdGhpc1xuICBzZXRQYXJhbToobmFtZSx2YWwpLT5cbiAgICBAbmFtZWRbbmFtZV0gPSB2YWxcbiAgcHVzaFBhcmFtOih2YWwpLT5cbiAgICBAcGFyYW1zLnB1c2godmFsKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgIHJldHVybiBAY29udGV4dCBvciBuZXcgQ29udGV4dCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUpLT5cbiAgICBmaW5kZXIgPSBAZ2V0Q29udGV4dCgpLmdldEZpbmRlcihjbWROYW1lLG5hbWVzcGFjZXM6QF9nZXRQYXJlbnROYW1lc3BhY2VzKCkpXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgX2dldENtZE9iajogLT5cbiAgICBpZiBAY21kP1xuICAgICAgQGNtZC5pbml0KClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmNscz9cbiAgICAgICAgQGNtZE9iaiA9IG5ldyBjbWQuY2xzKHRoaXMpXG4gICAgICAgIHJldHVybiBAY21kT2JqXG4gIF9pbml0UGFyYW1zOiAtPlxuICAgIEBuYW1lZCA9IEBnZXREZWZhdWx0cygpXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzOiAtPlxuICAgIHJldHVybiBbXVxuICBpc0VtcHR5OiAtPlxuICAgIHJldHVybiBAY21kP1xuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmV0dXJuIEBjbWRPYmoucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkRmluYWwoKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgcmV0dXJuIEBjbWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgIHJldHVybiBmYWxzZVxuICBnZXREZWZhdWx0czogLT5cbiAgICBpZiBAY21kP1xuICAgICAgcmVzID0ge31cbiAgICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxAY21kLmRlZmF1bHRzKVxuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGNtZE9iai5nZXREZWZhdWx0cygpKVxuICAgICAgcmV0dXJuIHJlc1xuICBnZXRBbGlhc2VkOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICB1bmxlc3MgQGFsaWFzZWRDbWQ/XG4gICAgICAgIEBnZXRBbGlhc2VkRmluYWwoKVxuICAgICAgcmV0dXJuIEBhbGlhc2VkQ21kIG9yIG51bGxcbiAgZ2V0QWxpYXNlZEZpbmFsOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAYWxpYXNlZEZpbmFsQ21kP1xuICAgICAgICByZXR1cm4gQGFsaWFzZWRGaW5hbENtZCBvciBudWxsXG4gICAgICBpZiBAY21kLmFsaWFzT2Y/XG4gICAgICAgIGFsaWFzZWQgPSBAY21kXG4gICAgICAgIHdoaWxlIGFsaWFzZWQ/IGFuZCBhbGlhc2VkLmFsaWFzT2Y/XG4gICAgICAgICAgYWxpYXNlZCA9IGFsaWFzZWQuX2FsaWFzZWRGcm9tRmluZGVyKEBnZXRGaW5kZXIoQGFsdGVyQWxpYXNPZihhbGlhc2VkLmFsaWFzT2YpKSlcbiAgICAgICAgICB1bmxlc3MgQGFsaWFzZWRDbWQ/XG4gICAgICAgICAgICBAYWxpYXNlZENtZCA9IGFsaWFzZWQgb3IgZmFsc2VcbiAgICAgICAgQGFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgb3IgZmFsc2VcbiAgICAgICAgcmV0dXJuIGFsaWFzZWRcbiAgYWx0ZXJBbGlhc09mOiAoYWxpYXNPZiktPlxuICAgIGFsaWFzT2ZcbiAgZ2V0T3B0aW9uczogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9wdGlvbnM/XG4gICAgICAgIHJldHVybiBAY21kT3B0aW9uc1xuICAgICAgb3B0ID0gQGNtZC5fb3B0aW9uc0ZvckFsaWFzZWQoQGdldEFsaWFzZWQoKSlcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LEBjbWRPYmouZ2V0T3B0aW9ucygpKVxuICAgICAgQGNtZE9wdGlvbnMgPSBvcHRcbiAgICAgIHJldHVybiBvcHRcbiAgZ2V0T3B0aW9uOiAoa2V5KSAtPlxuICAgIG9wdGlvbnMgPSBAZ2V0T3B0aW9ucygpXG4gICAgaWYgb3B0aW9ucz8gYW5kIGtleSBvZiBvcHRpb25zXG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gIGdldFBhcmFtOiAobmFtZXMsIGRlZlZhbCA9IG51bGwpIC0+XG4gICAgbmFtZXMgPSBbbmFtZXNdIGlmICh0eXBlb2YgbmFtZXMgaW4gWydzdHJpbmcnLCdudW1iZXInXSlcbiAgICBmb3IgbiBpbiBuYW1lc1xuICAgICAgcmV0dXJuIEBuYW1lZFtuXSBpZiBAbmFtZWRbbl0/XG4gICAgICByZXR1cm4gQHBhcmFtc1tuXSBpZiBAcGFyYW1zW25dP1xuICAgIHJldHVybiBkZWZWYWxcbiAgZ2V0Qm9vbFBhcmFtOiAobmFtZXMsIGRlZlZhbCA9IG51bGwpIC0+XG4gICAgZmFsc2VWYWxzID0gW1wiXCIsXCIwXCIsXCJmYWxzZVwiLFwibm9cIixcIm5vbmVcIixmYWxzZSxudWxsLDBdXG4gICAgdmFsID0gQGdldFBhcmFtKG5hbWVzLCBkZWZWYWwpXG4gICAgIWZhbHNlVmFscy5pbmNsdWRlcyh2YWwpXG4gIGFuY2VzdG9yQ21kczogLT5cbiAgICBpZiBAY29udGV4dC5jb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKVxuICAgIHJldHVybiBbXVxuICBhbmNlc3RvckNtZHNBbmRTZWxmOiAtPlxuICAgIHJldHVybiBAYW5jZXN0b3JDbWRzKCkuY29uY2F0KFtAY21kXSlcbiAgcnVuRXhlY3V0ZUZ1bmN0OiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5leGVjdXRlKClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkRmluYWwoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuZXhlY3V0ZUZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKVxuICByYXdSZXN1bHQ6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZEZpbmFsKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLnJlc3VsdEZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpXG4gICAgICBpZiBjbWQucmVzdWx0U3RyP1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0clxuICByZXN1bHQ6IC0+IFxuICAgIEBpbml0KClcbiAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgaWYgKHJlcyA9IEByYXdSZXN1bHQoKSk/XG4gICAgICAgIHJlcyA9IEBmb3JtYXRJbmRlbnQocmVzKVxuICAgICAgICBpZiByZXMubGVuZ3RoID4gMCBhbmQgQGdldE9wdGlvbigncGFyc2UnLHRoaXMpIFxuICAgICAgICAgIHBhcnNlciA9IEBnZXRQYXJzZXJGb3JUZXh0KHJlcylcbiAgICAgICAgICByZXMgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgICBpZiBhbHRlckZ1bmN0ID0gQGdldE9wdGlvbignYWx0ZXJSZXN1bHQnLHRoaXMpXG4gICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsdGhpcylcbiAgICAgICAgcmV0dXJuIHJlc1xuICBnZXRQYXJzZXJGb3JUZXh0OiAodHh0PScnKSAtPlxuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7aW5JbnN0YW5jZTp0aGlzfSlcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuICAgIHJldHVybiBwYXJzZXJcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHJldHVybiAwXG4gIGZvcm1hdEluZGVudDogKHRleHQpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcdC9nLCcgICcpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYXBwbHlJbmRlbnQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuaW5kZW50Tm90Rmlyc3QodGV4dCxAZ2V0SW5kZW50KCksXCIgXCIpIiwiaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBDb2Rld2F2ZVxufSBmcm9tICcuL0NvZGV3YXZlJztcblxuaW1wb3J0IHtcbiAgVGV4dFBhcnNlclxufSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCB2YXIgQ21kSW5zdGFuY2UgPSBjbGFzcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yKGNtZDEsIGNvbnRleHQpIHtcbiAgICB0aGlzLmNtZCA9IGNtZDE7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCEodGhpcy5pc0VtcHR5KCkgfHwgdGhpcy5pbml0ZWQpKSB7XG4gICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICB0aGlzLl9nZXRDbWRPYmooKTtcbiAgICAgIHRoaXMuX2luaXRQYXJhbXMoKTtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqLmluaXQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRQYXJhbShuYW1lLCB2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lZFtuYW1lXSA9IHZhbDtcbiAgfVxuXG4gIHB1c2hQYXJhbSh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMucHVzaCh2YWwpO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRleHQgfHwgbmV3IENvbnRleHQoKTtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmdldENvbnRleHQoKS5nZXRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogdGhpcy5fZ2V0UGFyZW50TmFtZXNwYWNlcygpXG4gICAgfSk7XG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gZmluZGVyO1xuICB9XG5cbiAgX2dldENtZE9iaigpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNtZC5pbml0KCk7XG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWQoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmNscyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqID0gbmV3IGNtZC5jbHModGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iajtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaW5pdFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lZCA9IHRoaXMuZ2V0RGVmYXVsdHMoKTtcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY21kICE9IG51bGw7XG4gIH1cblxuICByZXN1bHRJc0F2YWlsYWJsZSgpIHtcbiAgICB2YXIgYWxpYXNlZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNtZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXREZWZhdWx0cygpIHtcbiAgICB2YXIgYWxpYXNlZCwgcmVzO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5jbWQuZGVmYXVsdHMpO1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kT2JqLmdldERlZmF1bHRzKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gIH1cblxuICBnZXRBbGlhc2VkKCkge1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkQ21kID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5nZXRBbGlhc2VkRmluYWwoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmFsaWFzZWRDbWQgfHwgbnVsbDtcbiAgICB9XG4gIH1cblxuICBnZXRBbGlhc2VkRmluYWwoKSB7XG4gICAgdmFyIGFsaWFzZWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRGaW5hbENtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsaWFzZWRGaW5hbENtZCB8fCBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY21kLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBhbGlhc2VkID0gdGhpcy5jbWQ7XG4gICAgICAgIHdoaWxlICgoYWxpYXNlZCAhPSBudWxsKSAmJiAoYWxpYXNlZC5hbGlhc09mICE9IG51bGwpKSB7XG4gICAgICAgICAgYWxpYXNlZCA9IGFsaWFzZWQuX2FsaWFzZWRGcm9tRmluZGVyKHRoaXMuZ2V0RmluZGVyKHRoaXMuYWx0ZXJBbGlhc09mKGFsaWFzZWQuYWxpYXNPZikpKTtcbiAgICAgICAgICBpZiAodGhpcy5hbGlhc2VkQ21kID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuYWxpYXNlZENtZCA9IGFsaWFzZWQgfHwgZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWxpYXNlZEZpbmFsQ21kID0gYWxpYXNlZCB8fCBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWx0ZXJBbGlhc09mKGFsaWFzT2YpIHtcbiAgICByZXR1cm4gYWxpYXNPZjtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgdmFyIG9wdDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9wdGlvbnM7XG4gICAgICB9XG4gICAgICBvcHQgPSB0aGlzLmNtZC5fb3B0aW9uc0ZvckFsaWFzZWQodGhpcy5nZXRBbGlhc2VkKCkpO1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMuY21kT2JqLmdldE9wdGlvbnMoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmNtZE9wdGlvbnMgPSBvcHQ7XG4gICAgICByZXR1cm4gb3B0O1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdGlvbihrZXkpIHtcbiAgICB2YXIgb3B0aW9ucztcbiAgICBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgaWYgKChvcHRpb25zICE9IG51bGwpICYmIGtleSBpbiBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIGdldFBhcmFtKG5hbWVzLCBkZWZWYWwgPSBudWxsKSB7XG4gICAgdmFyIGksIGxlbiwgbiwgcmVmO1xuICAgIGlmICgoKHJlZiA9IHR5cGVvZiBuYW1lcykgPT09ICdzdHJpbmcnIHx8IHJlZiA9PT0gJ251bWJlcicpKSB7XG4gICAgICBuYW1lcyA9IFtuYW1lc107XG4gICAgfVxuICAgIGZvciAoaSA9IDAsIGxlbiA9IG5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBuID0gbmFtZXNbaV07XG4gICAgICBpZiAodGhpcy5uYW1lZFtuXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVkW25dO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucGFyYW1zW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1zW25dO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGVmVmFsO1xuICB9XG5cbiAgZ2V0Qm9vbFBhcmFtKG5hbWVzLCBkZWZWYWwgPSBudWxsKSB7XG4gICAgdmFyIGZhbHNlVmFscywgdmFsO1xuICAgIGZhbHNlVmFscyA9IFtcIlwiLCBcIjBcIiwgXCJmYWxzZVwiLCBcIm5vXCIsIFwibm9uZVwiLCBmYWxzZSwgbnVsbCwgMF07XG4gICAgdmFsID0gdGhpcy5nZXRQYXJhbShuYW1lcywgZGVmVmFsKTtcbiAgICByZXR1cm4gIWZhbHNlVmFscy5pbmNsdWRlcyh2YWwpO1xuICB9XG5cbiAgYW5jZXN0b3JDbWRzKCkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlKSAhPSBudWxsID8gcmVmLmluSW5zdGFuY2UgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKCk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGFuY2VzdG9yQ21kc0FuZFNlbGYoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5jZXN0b3JDbWRzKCkuY29uY2F0KFt0aGlzLmNtZF0pO1xuICB9XG5cbiAgcnVuRXhlY3V0ZUZ1bmN0KCkge1xuICAgIHZhciBjbWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5leGVjdXRlKCk7XG4gICAgICB9XG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuZXhlY3V0ZUZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlRnVuY3QodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmF3UmVzdWx0KCkge1xuICAgIHZhciBjbWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5yZXN1bHQoKTtcbiAgICAgIH1cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5yZXN1bHRGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0RnVuY3QodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAoY21kLnJlc3VsdFN0ciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0U3RyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgYWx0ZXJGdW5jdCwgcGFyc2VyLCByZXM7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgaWYgKHRoaXMucmVzdWx0SXNBdmFpbGFibGUoKSkge1xuICAgICAgaWYgKChyZXMgPSB0aGlzLnJhd1Jlc3VsdCgpKSAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IHRoaXMuZm9ybWF0SW5kZW50KHJlcyk7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCAmJiB0aGlzLmdldE9wdGlvbigncGFyc2UnLCB0aGlzKSkge1xuICAgICAgICAgIHBhcnNlciA9IHRoaXMuZ2V0UGFyc2VyRm9yVGV4dChyZXMpO1xuICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbHRlckZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2FsdGVyUmVzdWx0JywgdGhpcykpIHtcbiAgICAgICAgICByZXMgPSBhbHRlckZ1bmN0KHJlcywgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRQYXJzZXJGb3JUZXh0KHR4dCA9ICcnKSB7XG4gICAgdmFyIHBhcnNlcjtcbiAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIodHh0KSwge1xuICAgICAgaW5JbnN0YW5jZTogdGhpc1xuICAgIH0pO1xuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlO1xuICAgIHJldHVybiBwYXJzZXI7XG4gIH1cblxuICBnZXRJbmRlbnQoKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmb3JtYXRJbmRlbnQodGV4dCkge1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcdC9nLCAnICAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgYXBwbHlJbmRlbnQodGV4dCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuaW5kZW50Tm90Rmlyc3QodGV4dCwgdGhpcy5nZXRJbmRlbnQoKSwgXCIgXCIpO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQcm9jZXNzIH0gZnJvbSAnLi9Qcm9jZXNzJztcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgUG9zaXRpb25lZENtZEluc3RhbmNlIH0gZnJvbSAnLi9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UnO1xuaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vTG9nZ2VyJztcbmltcG9ydCB7IFBvc0NvbGxlY3Rpb24gfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBDbG9zaW5nUHJvbXAgfSBmcm9tICcuL0Nsb3NpbmdQcm9tcCc7XG5cbmV4cG9ydCBjbGFzcyBDb2Rld2F2ZVxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBDb2Rld2F2ZS5pbml0KClcbiAgICBAbWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSdcbiAgICBAdmFycyA9IHt9XG4gICAgXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAnYnJha2V0cycgOiAnfn4nLFxuICAgICAgJ2RlY28nIDogJ34nLFxuICAgICAgJ2Nsb3NlQ2hhcicgOiAnLycsXG4gICAgICAnbm9FeGVjdXRlQ2hhcicgOiAnIScsXG4gICAgICAnY2FycmV0Q2hhcicgOiAnfCcsXG4gICAgICAnY2hlY2tDYXJyZXQnIDogdHJ1ZSxcbiAgICAgICdpbkluc3RhbmNlJyA6IG51bGxcbiAgICB9XG4gICAgQHBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddXG4gICAgXG4gICAgQG5lc3RlZCA9IGlmIEBwYXJlbnQ/IHRoZW4gQHBhcmVudC5uZXN0ZWQrMSBlbHNlIDBcbiAgICBcbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZSBpZiBAcGFyZW50PyBhbmQga2V5ICE9ICdwYXJlbnQnXG4gICAgICAgIHRoaXNba2V5XSA9IEBwYXJlbnRba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICBAZWRpdG9yLmJpbmRlZFRvKHRoaXMpIGlmIEBlZGl0b3I/XG4gICAgXG4gICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzKVxuICAgIGlmIEBpbkluc3RhbmNlP1xuICAgICAgQGNvbnRleHQucGFyZW50ID0gQGluSW5zdGFuY2UuY29udGV4dFxuXG4gICAgQGxvZ2dlciA9IG5ldyBMb2dnZXIoKVxuXG4gIG9uQWN0aXZhdGlvbktleTogLT5cbiAgICBAcHJvY2VzcyA9IG5ldyBQcm9jZXNzKClcbiAgICBAbG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKVxuICAgIEBydW5BdEN1cnNvclBvcygpLnRoZW4gPT5cbiAgICAgIEBwcm9jZXNzID0gbnVsbFxuICBydW5BdEN1cnNvclBvczogLT5cbiAgICBpZiBAZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgICAgQHJ1bkF0TXVsdGlQb3MoQGVkaXRvci5nZXRNdWx0aVNlbCgpKVxuICAgIGVsc2VcbiAgICAgIEBydW5BdFBvcyhAZWRpdG9yLmdldEN1cnNvclBvcygpKVxuICBydW5BdFBvczogKHBvcyktPlxuICAgIEBydW5BdE11bHRpUG9zKFtwb3NdKVxuICBydW5BdE11bHRpUG9zOiAobXVsdGlQb3MpLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBpZiBtdWx0aVBvcy5sZW5ndGggPiAwXG4gICAgICAgIGNtZCA9IEBjb21tYW5kT25Qb3MobXVsdGlQb3NbMF0uZW5kKVxuICAgICAgICBpZiBjbWQ/XG4gICAgICAgICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgICAgICAgY21kLnNldE11bHRpUG9zKG11bHRpUG9zKVxuICAgICAgICAgIGNtZC5pbml0KClcbiAgICAgICAgICBAbG9nZ2VyLmxvZyhjbWQpXG4gICAgICAgICAgY21kLmV4ZWN1dGUoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbXVsdGlQb3NbMF0uc3RhcnQgPT0gbXVsdGlQb3NbMF0uZW5kXG4gICAgICAgICAgICBAYWRkQnJha2V0cyhtdWx0aVBvcylcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcylcbiAgY29tbWFuZE9uUG9zOiAocG9zKSAtPlxuICAgIGlmIEBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIGFuZCBAZm9sbG93ZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAxIFxuICAgICAgcHJldiA9IHBvcy1AYnJha2V0cy5sZW5ndGhcbiAgICAgIG5leHQgPSBwb3NcbiAgICBlbHNlXG4gICAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAwXG4gICAgICAgIHBvcyAtPSBAYnJha2V0cy5sZW5ndGhcbiAgICAgIHByZXYgPSBAZmluZFByZXZCcmFrZXQocG9zKVxuICAgICAgdW5sZXNzIHByZXY/XG4gICAgICAgIHJldHVybiBudWxsIFxuICAgICAgbmV4dCA9IEBmaW5kTmV4dEJyYWtldChwb3MtMSlcbiAgICAgIGlmICFuZXh0PyBvciBAY291bnRQcmV2QnJha2V0KHByZXYpICUgMiAhPSAwIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMscHJldixAZWRpdG9yLnRleHRTdWJzdHIocHJldixuZXh0K0BicmFrZXRzLmxlbmd0aCkpXG4gIG5leHRDbWQ6IChzdGFydCA9IDApIC0+XG4gICAgcG9zID0gc3RhcnRcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyAsW0BicmFrZXRzLFwiXFxuXCJdKVxuICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGhcbiAgICAgIGlmIGYuc3RyID09IEBicmFrZXRzXG4gICAgICAgIGlmIGJlZ2lubmluZz9cbiAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIEBlZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zK0BicmFrZXRzLmxlbmd0aCkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvc1xuICAgICAgZWxzZVxuICAgICAgICBiZWdpbm5pbmcgPSBudWxsXG4gICAgbnVsbFxuICBnZXRFbmNsb3NpbmdDbWQ6IChwb3MgPSAwKSAtPlxuICAgIGNwb3MgPSBwb3NcbiAgICBjbG9zaW5nUHJlZml4ID0gQGJyYWtldHMgKyBAY2xvc2VDaGFyXG4gICAgd2hpbGUgKHAgPSBAZmluZE5leHQoY3BvcyxjbG9zaW5nUHJlZml4KSk/XG4gICAgICBpZiBjbWQgPSBAY29tbWFuZE9uUG9zKHArY2xvc2luZ1ByZWZpeC5sZW5ndGgpXG4gICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgICAgaWYgY21kLnBvcyA8IHBvc1xuICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgIGVsc2VcbiAgICAgICAgY3BvcyA9IHArY2xvc2luZ1ByZWZpeC5sZW5ndGhcbiAgICBudWxsXG4gIHByZWNlZGVkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLUBicmFrZXRzLmxlbmd0aCxwb3MpID09IEBicmFrZXRzXG4gIGZvbGxvd2VkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLHBvcytAYnJha2V0cy5sZW5ndGgpID09IEBicmFrZXRzXG4gIGNvdW50UHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICBpID0gMFxuICAgIHdoaWxlIChzdGFydCA9IEBmaW5kUHJldkJyYWtldChzdGFydCkpP1xuICAgICAgaSsrXG4gICAgcmV0dXJuIGlcbiAgaXNFbmRMaW5lOiAocG9zKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrMSkgPT0gXCJcXG5cIiBvciBwb3MgKyAxID49IEBlZGl0b3IudGV4dExlbigpXG4gIGZpbmRQcmV2QnJha2V0OiAoc3RhcnQpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHRCcmFrZXQoc3RhcnQsLTEpXG4gIGZpbmROZXh0QnJha2V0OiAoc3RhcnQsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW0BicmFrZXRzLFwiXFxuXCJdLCBkaXJlY3Rpb24pXG4gICAgXG4gICAgZi5wb3MgaWYgZiBhbmQgZi5zdHIgPT0gQGJyYWtldHNcbiAgZmluZFByZXY6IChzdGFydCxzdHJpbmcpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHQoc3RhcnQsc3RyaW5nLC0xKVxuICBmaW5kTmV4dDogKHN0YXJ0LHN0cmluZyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBmID0gQGZpbmRBbnlOZXh0KHN0YXJ0ICxbc3RyaW5nXSwgZGlyZWN0aW9uKVxuICAgIGYucG9zIGlmIGZcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci5maW5kQW55TmV4dChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbilcbiAgICBcbiAgZmluZE1hdGNoaW5nUGFpcjogKHN0YXJ0UG9zLG9wZW5pbmcsY2xvc2luZyxkaXJlY3Rpb24gPSAxKSAtPlxuICAgIHBvcyA9IHN0YXJ0UG9zXG4gICAgbmVzdGVkID0gMFxuICAgIHdoaWxlIGYgPSBAZmluZEFueU5leHQocG9zLFtjbG9zaW5nLG9wZW5pbmddLGRpcmVjdGlvbilcbiAgICAgIHBvcyA9IGYucG9zICsgKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBmLnN0ci5sZW5ndGggZWxzZSAwKVxuICAgICAgaWYgZi5zdHIgPT0gKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBjbG9zaW5nIGVsc2Ugb3BlbmluZylcbiAgICAgICAgaWYgbmVzdGVkID4gMFxuICAgICAgICAgIG5lc3RlZC0tXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZlxuICAgICAgZWxzZVxuICAgICAgICBuZXN0ZWQrK1xuICAgIG51bGxcbiAgYWRkQnJha2V0czogKHBvcykgLT5cbiAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpXG4gICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAoQGJyYWtldHMsQGJyYWtldHMpLm1hcCggKHIpLT5yLnNlbGVjdENvbnRlbnQoKSApXG4gICAgQGVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIHByb21wdENsb3NpbmdDbWQ6IChzZWxlY3Rpb25zKSAtPlxuICAgIEBjbG9zaW5nUHJvbXAuc3RvcCgpIGlmIEBjbG9zaW5nUHJvbXA/XG4gICAgQGNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcC5uZXdGb3IodGhpcyxzZWxlY3Rpb25zKS5iZWdpbigpXG4gIHBhcnNlQWxsOiAocmVjdXJzaXZlID0gdHJ1ZSkgLT5cbiAgICBpZiBAbmVzdGVkID4gMTAwXG4gICAgICB0aHJvdyBcIkluZmluaXRlIHBhcnNpbmcgUmVjdXJzaW9uXCJcbiAgICBwb3MgPSAwXG4gICAgd2hpbGUgY21kID0gQG5leHRDbWQocG9zKVxuICAgICAgcG9zID0gY21kLmdldEVuZFBvcygpXG4gICAgICBAZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpXG4gICAgICAjIGNvbnNvbGUubG9nKGNtZClcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIHJlY3Vyc2l2ZSBhbmQgY21kLmNvbnRlbnQ/IGFuZCAoIWNtZC5nZXRDbWQoKT8gb3IgIWNtZC5nZXRPcHRpb24oJ3ByZXZlbnRQYXJzZUFsbCcpKVxuICAgICAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIoY21kLmNvbnRlbnQpLCB7cGFyZW50OiB0aGlzfSlcbiAgICAgICAgY21kLmNvbnRlbnQgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgcmVzID0gIGNtZC5leGVjdXRlKClcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgaWYgcmVzLnRoZW4/XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3luYyBuZXN0ZWQgY29tbWFuZHMgYXJlIG5vdCBzdXBwb3J0ZWQnKVxuICAgICAgICBpZiBjbWQucmVwbGFjZUVuZD9cbiAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcG9zID0gQGVkaXRvci5nZXRDdXJzb3JQb3MoKS5lbmRcbiAgICByZXR1cm4gQGdldFRleHQoKVxuICBnZXRUZXh0OiAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHQoKVxuICBpc1Jvb3Q6IC0+XG4gICAgcmV0dXJuICFAcGFyZW50PyBhbmQgKCFAaW5JbnN0YW5jZT8gb3IgIUBpbkluc3RhbmNlLmZpbmRlcj8pXG4gIGdldFJvb3Q6IC0+XG4gICAgaWYgQGlzUm9vdCgpXG4gICAgICByZXR1cm4gdGhpc1xuICAgIGVsc2UgaWYgQHBhcmVudD9cbiAgICAgIHJldHVybiBAcGFyZW50LmdldFJvb3QoKVxuICAgIGVsc2UgaWYgQGluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpXG4gIHJlbW92ZUNhcnJldDogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsQGNhcnJldENoYXIpXG4gIGdldENhcnJldFBvczogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldENhcnJldFBvcyh0eHQsQGNhcnJldENoYXIpXG4gIHJlZ01hcmtlcjogKGZsYWdzPVwiZ1wiKSAtPlxuICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQG1hcmtlciksIGZsYWdzKVxuICByZW1vdmVNYXJrZXJzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKEByZWdNYXJrZXIoKSwnJylcblxuICBAaW5pdDogLT5cbiAgICB1bmxlc3MgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIENvbW1hbmQuaW5pdENtZHMoKVxuICAgICAgQ29tbWFuZC5sb2FkQ21kcygpXG5cbiAgQGluaXRlZDogZmFsc2UiLCJpbXBvcnQge1xuICBQcm9jZXNzXG59IGZyb20gJy4vUHJvY2Vzcyc7XG5cbmltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgUG9zaXRpb25lZENtZEluc3RhbmNlXG59IGZyb20gJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJztcblxuaW1wb3J0IHtcbiAgVGV4dFBhcnNlclxufSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIExvZ2dlclxufSBmcm9tICcuL0xvZ2dlcic7XG5cbmltcG9ydCB7XG4gIFBvc0NvbGxlY3Rpb25cbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDbG9zaW5nUHJvbXBcbn0gZnJvbSAnLi9DbG9zaW5nUHJvbXAnO1xuXG5leHBvcnQgdmFyIENvZGV3YXZlID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBDb2Rld2F2ZSB7XG4gICAgY29uc3RydWN0b3IoZWRpdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICAgIENvZGV3YXZlLmluaXQoKTtcbiAgICAgIHRoaXMubWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSc7XG4gICAgICB0aGlzLnZhcnMgPSB7fTtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAnYnJha2V0cyc6ICd+ficsXG4gICAgICAgICdkZWNvJzogJ34nLFxuICAgICAgICAnY2xvc2VDaGFyJzogJy8nLFxuICAgICAgICAnbm9FeGVjdXRlQ2hhcic6ICchJyxcbiAgICAgICAgJ2NhcnJldENoYXInOiAnfCcsXG4gICAgICAgICdjaGVja0NhcnJldCc6IHRydWUsXG4gICAgICAgICdpbkluc3RhbmNlJzogbnVsbFxuICAgICAgfTtcbiAgICAgIHRoaXMucGFyZW50ID0gb3B0aW9uc1sncGFyZW50J107XG4gICAgICB0aGlzLm5lc3RlZCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC5uZXN0ZWQgKyAxIDogMDtcbiAgICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgfSBlbHNlIGlmICgodGhpcy5wYXJlbnQgIT0gbnVsbCkgJiYga2V5ICE9PSAncGFyZW50Jykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lZGl0b3IgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmVkaXRvci5iaW5kZWRUbyh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMpO1xuICAgICAgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5wYXJlbnQgPSB0aGlzLmluSW5zdGFuY2UuY29udGV4dDtcbiAgICAgIH1cbiAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgIH1cblxuICAgIG9uQWN0aXZhdGlvbktleSgpIHtcbiAgICAgIHRoaXMucHJvY2VzcyA9IG5ldyBQcm9jZXNzKCk7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ2FjdGl2YXRpb24ga2V5Jyk7XG4gICAgICByZXR1cm4gdGhpcy5ydW5BdEN1cnNvclBvcygpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJ1bkF0Q3Vyc29yUG9zKCkge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKHRoaXMuZWRpdG9yLmdldE11bHRpU2VsKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuQXRQb3ModGhpcy5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJ1bkF0UG9zKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMucnVuQXRNdWx0aVBvcyhbcG9zXSk7XG4gICAgfVxuXG4gICAgcnVuQXRNdWx0aVBvcyhtdWx0aVBvcykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgY21kO1xuICAgICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNtZCA9IHRoaXMuY29tbWFuZE9uUG9zKG11bHRpUG9zWzBdLmVuZCk7XG4gICAgICAgICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBjbWQuc2V0TXVsdGlQb3MobXVsdGlQb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY21kLmluaXQoKTtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhjbWQpO1xuICAgICAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtdWx0aVBvc1swXS5zdGFydCA9PT0gbXVsdGlQb3NbMF0uZW5kKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZEJyYWtldHMobXVsdGlQb3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb21tYW5kT25Qb3MocG9zKSB7XG4gICAgICB2YXIgbmV4dCwgcHJldjtcbiAgICAgIGlmICh0aGlzLnByZWNlZGVkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5mb2xsb3dlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09PSAxKSB7XG4gICAgICAgIHByZXYgPSBwb3MgLSB0aGlzLmJyYWtldHMubGVuZ3RoO1xuICAgICAgICBuZXh0ID0gcG9zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMucHJlY2VkZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMCkge1xuICAgICAgICAgIHBvcyAtPSB0aGlzLmJyYWtldHMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHByZXYgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHBvcyk7XG4gICAgICAgIGlmIChwcmV2ID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBuZXh0ID0gdGhpcy5maW5kTmV4dEJyYWtldChwb3MgLSAxKTtcbiAgICAgICAgaWYgKChuZXh0ID09IG51bGwpIHx8IHRoaXMuY291bnRQcmV2QnJha2V0KHByZXYpICUgMiAhPT0gMCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBwcmV2LCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHByZXYsIG5leHQgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSk7XG4gICAgfVxuXG4gICAgbmV4dENtZChzdGFydCA9IDApIHtcbiAgICAgIHZhciBiZWdpbm5pbmcsIGYsIHBvcztcbiAgICAgIHBvcyA9IHN0YXJ0O1xuICAgICAgd2hpbGUgKGYgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW3RoaXMuYnJha2V0cywgXCJcXG5cIl0pKSB7XG4gICAgICAgIHBvcyA9IGYucG9zICsgZi5zdHIubGVuZ3RoO1xuICAgICAgICBpZiAoZi5zdHIgPT09IHRoaXMuYnJha2V0cykge1xuICAgICAgICAgIGlmICh0eXBlb2YgYmVnaW5uaW5nICE9PSBcInVuZGVmaW5lZFwiICYmIGJlZ2lubmluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgYmVnaW5uaW5nLCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKGJlZ2lubmluZywgZi5wb3MgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJlZ2lubmluZyA9IGYucG9zO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiZWdpbm5pbmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRFbmNsb3NpbmdDbWQocG9zID0gMCkge1xuICAgICAgdmFyIGNsb3NpbmdQcmVmaXgsIGNtZCwgY3BvcywgcDtcbiAgICAgIGNwb3MgPSBwb3M7XG4gICAgICBjbG9zaW5nUHJlZml4ID0gdGhpcy5icmFrZXRzICsgdGhpcy5jbG9zZUNoYXI7XG4gICAgICB3aGlsZSAoKHAgPSB0aGlzLmZpbmROZXh0KGNwb3MsIGNsb3NpbmdQcmVmaXgpKSAhPSBudWxsKSB7XG4gICAgICAgIGlmIChjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGgpKSB7XG4gICAgICAgICAgY3BvcyA9IGNtZC5nZXRFbmRQb3MoKTtcbiAgICAgICAgICBpZiAoY21kLnBvcyA8IHBvcykge1xuICAgICAgICAgICAgcmV0dXJuIGNtZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3BvcyA9IHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHJlY2VkZWRCeUJyYWtldHMocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MgLSB0aGlzLmJyYWtldHMubGVuZ3RoLCBwb3MpID09PSB0aGlzLmJyYWtldHM7XG4gICAgfVxuXG4gICAgZm9sbG93ZWRCeUJyYWtldHMocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpID09PSB0aGlzLmJyYWtldHM7XG4gICAgfVxuXG4gICAgY291bnRQcmV2QnJha2V0KHN0YXJ0KSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGkgPSAwO1xuICAgICAgd2hpbGUgKChzdGFydCA9IHRoaXMuZmluZFByZXZCcmFrZXQoc3RhcnQpKSAhPSBudWxsKSB7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIHJldHVybiBpO1xuICAgIH1cblxuICAgIGlzRW5kTGluZShwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcywgcG9zICsgMSkgPT09IFwiXFxuXCIgfHwgcG9zICsgMSA+PSB0aGlzLmVkaXRvci50ZXh0TGVuKCk7XG4gICAgfVxuXG4gICAgZmluZFByZXZCcmFrZXQoc3RhcnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmROZXh0QnJha2V0KHN0YXJ0LCAtMSk7XG4gICAgfVxuXG4gICAgZmluZE5leHRCcmFrZXQoc3RhcnQsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmO1xuICAgICAgZiA9IHRoaXMuZmluZEFueU5leHQoc3RhcnQsIFt0aGlzLmJyYWtldHMsIFwiXFxuXCJdLCBkaXJlY3Rpb24pO1xuICAgICAgaWYgKGYgJiYgZi5zdHIgPT09IHRoaXMuYnJha2V0cykge1xuICAgICAgICByZXR1cm4gZi5wb3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZFByZXYoc3RhcnQsIHN0cmluZykge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHQoc3RhcnQsIHN0cmluZywgLTEpO1xuICAgIH1cblxuICAgIGZpbmROZXh0KHN0YXJ0LCBzdHJpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmO1xuICAgICAgZiA9IHRoaXMuZmluZEFueU5leHQoc3RhcnQsIFtzdHJpbmddLCBkaXJlY3Rpb24pO1xuICAgICAgaWYgKGYpIHtcbiAgICAgICAgcmV0dXJuIGYucG9zO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IuZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgZmluZE1hdGNoaW5nUGFpcihzdGFydFBvcywgb3BlbmluZywgY2xvc2luZywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGYsIG5lc3RlZCwgcG9zO1xuICAgICAgcG9zID0gc3RhcnRQb3M7XG4gICAgICBuZXN0ZWQgPSAwO1xuICAgICAgd2hpbGUgKGYgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW2Nsb3NpbmcsIG9wZW5pbmddLCBkaXJlY3Rpb24pKSB7XG4gICAgICAgIHBvcyA9IGYucG9zICsgKGRpcmVjdGlvbiA+IDAgPyBmLnN0ci5sZW5ndGggOiAwKTtcbiAgICAgICAgaWYgKGYuc3RyID09PSAoZGlyZWN0aW9uID4gMCA/IGNsb3NpbmcgOiBvcGVuaW5nKSkge1xuICAgICAgICAgIGlmIChuZXN0ZWQgPiAwKSB7XG4gICAgICAgICAgICBuZXN0ZWQtLTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGY7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5lc3RlZCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBhZGRCcmFrZXRzKHBvcykge1xuICAgICAgdmFyIHJlcGxhY2VtZW50cztcbiAgICAgIHBvcyA9IG5ldyBQb3NDb2xsZWN0aW9uKHBvcyk7XG4gICAgICByZXBsYWNlbWVudHMgPSBwb3Mud3JhcCh0aGlzLmJyYWtldHMsIHRoaXMuYnJha2V0cykubWFwKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgcmV0dXJuIHIuc2VsZWN0Q29udGVudCgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgICB9XG5cbiAgICBwcm9tcHRDbG9zaW5nQ21kKHNlbGVjdGlvbnMpIHtcbiAgICAgIGlmICh0aGlzLmNsb3NpbmdQcm9tcCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY2xvc2luZ1Byb21wLnN0b3AoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcC5uZXdGb3IodGhpcywgc2VsZWN0aW9ucykuYmVnaW4oKTtcbiAgICB9XG5cbiAgICBwYXJzZUFsbChyZWN1cnNpdmUgPSB0cnVlKSB7XG4gICAgICB2YXIgY21kLCBwYXJzZXIsIHBvcywgcmVzO1xuICAgICAgaWYgKHRoaXMubmVzdGVkID4gMTAwKSB7XG4gICAgICAgIHRocm93IFwiSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb25cIjtcbiAgICAgIH1cbiAgICAgIHBvcyA9IDA7XG4gICAgICB3aGlsZSAoY21kID0gdGhpcy5uZXh0Q21kKHBvcykpIHtcbiAgICAgICAgcG9zID0gY21kLmdldEVuZFBvcygpO1xuICAgICAgICB0aGlzLmVkaXRvci5zZXRDdXJzb3JQb3MocG9zKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coY21kKVxuICAgICAgICBjbWQuaW5pdCgpO1xuICAgICAgICBpZiAocmVjdXJzaXZlICYmIChjbWQuY29udGVudCAhPSBudWxsKSAmJiAoKGNtZC5nZXRDbWQoKSA9PSBudWxsKSB8fCAhY21kLmdldE9wdGlvbigncHJldmVudFBhcnNlQWxsJykpKSB7XG4gICAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge1xuICAgICAgICAgICAgcGFyZW50OiB0aGlzXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY21kLmNvbnRlbnQgPSBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBjbWQuZXhlY3V0ZSgpO1xuICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAocmVzLnRoZW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3luYyBuZXN0ZWQgY29tbWFuZHMgYXJlIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNtZC5yZXBsYWNlRW5kICE9IG51bGwpIHtcbiAgICAgICAgICAgIHBvcyA9IGNtZC5yZXBsYWNlRW5kO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3MgPSB0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKS5lbmQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5nZXRUZXh0KCk7XG4gICAgfVxuXG4gICAgZ2V0VGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0KCk7XG4gICAgfVxuXG4gICAgaXNSb290KCkge1xuICAgICAgcmV0dXJuICh0aGlzLnBhcmVudCA9PSBudWxsKSAmJiAoKHRoaXMuaW5JbnN0YW5jZSA9PSBudWxsKSB8fCAodGhpcy5pbkluc3RhbmNlLmZpbmRlciA9PSBudWxsKSk7XG4gICAgfVxuXG4gICAgZ2V0Um9vdCgpIHtcbiAgICAgIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRSb290KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUNhcnJldCh0eHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHR4dCwgdGhpcy5jYXJyZXRDaGFyKTtcbiAgICB9XG5cbiAgICBnZXRDYXJyZXRQb3ModHh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldENhcnJldFBvcyh0eHQsIHRoaXMuY2FycmV0Q2hhcik7XG4gICAgfVxuXG4gICAgcmVnTWFya2VyKGZsYWdzID0gXCJnXCIpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5tYXJrZXIpLCBmbGFncyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWFya2Vycyh0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHRoaXMucmVnTWFya2VyKCksICcnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdCgpIHtcbiAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgICBDb21tYW5kLmluaXRDbWRzKCk7XG4gICAgICAgIHJldHVybiBDb21tYW5kLmxvYWRDbWRzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gIH07XG5cbiAgQ29kZXdhdmUuaW5pdGVkID0gZmFsc2U7XG5cbiAgcmV0dXJuIENvZGV3YXZlO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFN0b3JhZ2UgfSBmcm9tICcuL1N0b3JhZ2UnO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cblxuX29wdEtleSA9IChrZXksZGljdCxkZWZWYWwgPSBudWxsKSAtPlxuICAjIG9wdGlvbmFsIERpY3Rpb25hcnkga2V5XG4gIHJldHVybiBpZiBrZXkgb2YgZGljdCB0aGVuIGRpY3Rba2V5XSBlbHNlIGRlZlZhbFxuXG5cbmV4cG9ydCBjbGFzcyBDb21tYW5kXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsQGRhdGE9bnVsbCxwYXJlbnQ9bnVsbCkgLT5cbiAgICBAY21kcyA9IFtdXG4gICAgQGRldGVjdG9ycyA9IFtdXG4gICAgQGV4ZWN1dGVGdW5jdCA9IEByZXN1bHRGdW5jdCA9IEByZXN1bHRTdHIgPSBAYWxpYXNPZiA9IEBjbHMgPSBudWxsXG4gICAgQGFsaWFzZWQgPSBudWxsXG4gICAgQGZ1bGxOYW1lID0gQG5hbWVcbiAgICBAZGVwdGggPSAwXG4gICAgW0BfcGFyZW50LCBAX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdXG4gICAgQHNldFBhcmVudChwYXJlbnQpXG4gICAgQGRlZmF1bHRzID0ge31cbiAgICBcbiAgICBAZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBuYW1lVG9QYXJhbTogbnVsbCxcbiAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgYmVmb3JlRXhlY3V0ZTogbnVsbCxcbiAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgIHJlcGxhY2VCb3g6IGZhbHNlLFxuICAgICAgYWxsb3dlZE5hbWVkOiBudWxsXG4gICAgfVxuICAgIEBvcHRpb25zID0ge31cbiAgICBAZmluYWxPcHRpb25zID0gbnVsbFxuICBwYXJlbnQ6IC0+XG4gICAgcmV0dXJuIEBfcGFyZW50XG4gIHNldFBhcmVudDogKHZhbHVlKSAtPlxuICAgIGlmIEBfcGFyZW50ICE9IHZhbHVlXG4gICAgICBAX3BhcmVudCA9IHZhbHVlXG4gICAgICBAZnVsbE5hbWUgPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQubmFtZT9cbiAgICAgICAgICBAX3BhcmVudC5mdWxsTmFtZSArICc6JyArIEBuYW1lIFxuICAgICAgICBlbHNlIFxuICAgICAgICAgIEBuYW1lXG4gICAgICApXG4gICAgICBAZGVwdGggPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQuZGVwdGg/XG4gICAgICAgIHRoZW4gQF9wYXJlbnQuZGVwdGggKyAxXG4gICAgICAgIGVsc2UgMFxuICAgICAgKVxuICBpbml0OiAtPlxuICAgIGlmICFAX2luaXRlZFxuICAgICAgQF9pbml0ZWQgPSB0cnVlXG4gICAgICBAcGFyc2VEYXRhKEBkYXRhKVxuICAgIHJldHVybiB0aGlzXG4gIHVucmVnaXN0ZXI6IC0+XG4gICAgQF9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpXG4gIGlzRWRpdGFibGU6IC0+XG4gICAgcmV0dXJuIEByZXN1bHRTdHI/IG9yIEBhbGlhc09mP1xuICBpc0V4ZWN1dGFibGU6IC0+XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgZm9yIHAgaW4gWydyZXN1bHRTdHInLCdyZXN1bHRGdW5jdCcsJ2NscycsJ2V4ZWN1dGVGdW5jdCddXG4gICAgICBpZiB0aGlzW3BdP1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICBpc0V4ZWN1dGFibGVXaXRoTmFtZTogKG5hbWUpIC0+XG4gICAgaWYgQGFsaWFzT2Y/XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgYWxpYXNPZiA9IEBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsbmFtZSlcbiAgICAgIGFsaWFzZWQgPSBAX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKGFsaWFzT2YpKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gQGlzRXhlY3V0YWJsZSgpXG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICBmb3IgcCBpbiBbJ3Jlc3VsdFN0cicsJ3Jlc3VsdEZ1bmN0J11cbiAgICAgIGlmIHRoaXNbcF0/XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldERlZmF1bHRzOiAtPlxuICAgIHJlcyA9IHt9XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBkZWZhdWx0cylcbiAgICByZXR1cm4gcmVzXG4gIF9hbGlhc2VkRnJvbUZpbmRlcjogKGZpbmRlcikgLT5cbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2VcbiAgICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAYWxpYXNPZj9cbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICByZXR1cm4gQF9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihAYWxpYXNPZikpXG4gIHNldE9wdGlvbnM6IChkYXRhKSAtPlxuICAgIGZvciBrZXksIHZhbCBvZiBkYXRhXG4gICAgICBpZiBrZXkgb2YgQGRlZmF1bHRPcHRpb25zXG4gICAgICAgIEBvcHRpb25zW2tleV0gPSB2YWxcbiAgX29wdGlvbnNGb3JBbGlhc2VkOiAoYWxpYXNlZCkgLT5cbiAgICBvcHQgPSB7fVxuICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LEBkZWZhdWx0T3B0aW9ucylcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsYWxpYXNlZC5nZXRPcHRpb25zKCkpXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0LEBvcHRpb25zKVxuICBnZXRPcHRpb25zOiAtPlxuICAgIHJldHVybiBAX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gIGhlbHA6IC0+XG4gICAgY21kID0gQGdldENtZCgnaGVscCcpXG4gICAgaWYgY21kP1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkucmVzdWx0U3RyXG4gIHBhcnNlRGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBkYXRhXG4gICAgaWYgdHlwZW9mIGRhdGEgPT0gJ3N0cmluZydcbiAgICAgIEByZXN1bHRTdHIgPSBkYXRhXG4gICAgICBAb3B0aW9uc1sncGFyc2UnXSA9IHRydWVcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZSBpZiBkYXRhP1xuICAgICAgcmV0dXJuIEBwYXJzZURpY3REYXRhKGRhdGEpXG4gICAgcmV0dXJuIGZhbHNlXG4gIHBhcnNlRGljdERhdGE6IChkYXRhKSAtPlxuICAgIHJlcyA9IF9vcHRLZXkoJ3Jlc3VsdCcsZGF0YSlcbiAgICBpZiB0eXBlb2YgcmVzID09IFwiZnVuY3Rpb25cIlxuICAgICAgQHJlc3VsdEZ1bmN0ID0gcmVzXG4gICAgZWxzZSBpZiByZXM/XG4gICAgICBAcmVzdWx0U3RyID0gcmVzXG4gICAgICBAb3B0aW9uc1sncGFyc2UnXSA9IHRydWVcbiAgICBleGVjdXRlID0gX29wdEtleSgnZXhlY3V0ZScsZGF0YSlcbiAgICBpZiB0eXBlb2YgZXhlY3V0ZSA9PSBcImZ1bmN0aW9uXCJcbiAgICAgIEBleGVjdXRlRnVuY3QgPSBleGVjdXRlXG4gICAgQGFsaWFzT2YgPSBfb3B0S2V5KCdhbGlhc09mJyxkYXRhKVxuICAgIEBjbHMgPSBfb3B0S2V5KCdjbHMnLGRhdGEpXG4gICAgQGRlZmF1bHRzID0gX29wdEtleSgnZGVmYXVsdHMnLGRhdGEsQGRlZmF1bHRzKVxuICAgIFxuICAgIEBzZXRPcHRpb25zKGRhdGEpXG4gICAgXG4gICAgaWYgJ2hlbHAnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLGRhdGFbJ2hlbHAnXSx0aGlzKSlcbiAgICBpZiAnZmFsbGJhY2snIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2ZhbGxiYWNrJyxkYXRhWydmYWxsYmFjayddLHRoaXMpKVxuICAgICAgXG4gICAgaWYgJ2NtZHMnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWRzKGRhdGFbJ2NtZHMnXSlcbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDbWRzOiAoY21kcykgLT5cbiAgICBmb3IgbmFtZSwgZGF0YSBvZiBjbWRzXG4gICAgICBAYWRkQ21kKG5ldyBDb21tYW5kKG5hbWUsZGF0YSx0aGlzKSlcbiAgYWRkQ21kOiAoY21kKSAtPlxuICAgIGV4aXN0cyA9IEBnZXRDbWQoY21kLm5hbWUpXG4gICAgaWYgZXhpc3RzP1xuICAgICAgQHJlbW92ZUNtZChleGlzdHMpXG4gICAgY21kLnNldFBhcmVudCh0aGlzKVxuICAgIEBjbWRzLnB1c2goY21kKVxuICAgIHJldHVybiBjbWRcbiAgcmVtb3ZlQ21kOiAoY21kKSAtPlxuICAgIGlmIChpID0gQGNtZHMuaW5kZXhPZihjbWQpKSA+IC0xXG4gICAgICBAY21kcy5zcGxpY2UoaSwgMSlcbiAgICByZXR1cm4gY21kXG4gIGdldENtZDogKGZ1bGxuYW1lKSAtPlxuICAgIEBpbml0KClcbiAgICBbc3BhY2UsbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSlcbiAgICBpZiBzcGFjZT9cbiAgICAgIHJldHVybiBAZ2V0Q21kKHNwYWNlKT8uZ2V0Q21kKG5hbWUpXG4gICAgZm9yIGNtZCBpbiBAY21kc1xuICAgICAgaWYgY21kLm5hbWUgPT0gbmFtZVxuICAgICAgICByZXR1cm4gY21kXG4gIHNldENtZERhdGE6IChmdWxsbmFtZSxkYXRhKSAtPlxuICAgIEBzZXRDbWQoZnVsbG5hbWUsbmV3IENvbW1hbmQoZnVsbG5hbWUuc3BsaXQoJzonKS5wb3AoKSxkYXRhKSlcbiAgc2V0Q21kOiAoZnVsbG5hbWUsY21kKSAtPlxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgbmV4dCA9IEBnZXRDbWQoc3BhY2UpXG4gICAgICB1bmxlc3MgbmV4dD9cbiAgICAgICAgbmV4dCA9IEBhZGRDbWQobmV3IENvbW1hbmQoc3BhY2UpKVxuICAgICAgcmV0dXJuIG5leHQuc2V0Q21kKG5hbWUsY21kKVxuICAgIGVsc2VcbiAgICAgIEBhZGRDbWQoY21kKVxuICAgICAgcmV0dXJuIGNtZFxuICBhZGREZXRlY3RvcjogKGRldGVjdG9yKSAtPlxuICAgIEBkZXRlY3RvcnMucHVzaChkZXRlY3RvcilcbiAgICBcbiAgQHByb3ZpZGVycyA9IFtdXG5cbiAgQHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG5cbiAgQGluaXRDbWRzOiAtPlxuICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwse1xuICAgICAgJ2NtZHMnOntcbiAgICAgICAgJ2hlbGxvJzp7XG4gICAgICAgICAgaGVscDogXCJcIlwiXG4gICAgICAgICAgXCJIZWxsbywgd29ybGQhXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cbiAgICAgICAgICBtb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cbiAgICAgICAgICB2ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWFcbiAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICByZXN1bHQ6ICdIZWxsbywgV29ybGQhJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBmb3IgcHJvdmlkZXIgaW4gQHByb3ZpZGVyc1xuICAgICAgcHJvdmlkZXIucmVnaXN0ZXIoQ29tbWFuZC5jbWRzKVxuXG4gIEBzYXZlQ21kOiAoZnVsbG5hbWUsIGRhdGEpIC0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsZGF0YSlcbiAgICAudGhlbiA9PlxuICAgICAgQHN0b3JhZ2Uuc2F2ZUluUGF0aCgnY21kcycsIGZ1bGxuYW1lLCBkYXRhKVxuXG4gIEBsb2FkQ21kczogLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBzYXZlZENtZHMgPSBAc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAudGhlbiAoc2F2ZWRDbWRzKT0+XG4gICAgICBpZiBzYXZlZENtZHM/IFxuICAgICAgICBmb3IgZnVsbG5hbWUsIGRhdGEgb2Ygc2F2ZWRDbWRzXG4gICAgICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpXG5cbiAgQHJlc2V0U2F2ZWQ6IC0+XG4gICAgQHN0b3JhZ2Uuc2F2ZSgnY21kcycse30pXG5cbiAgQG1ha2VWYXJDbWQgPSAobmFtZSxiYXNlPXt9KSAtPiBcbiAgICBiYXNlLmV4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWwgaWYgdmFsP1xuICAgIHJldHVybiBiYXNlXG5cbiAgQG1ha2VCb29sVmFyQ21kID0gKG5hbWUsYmFzZT17fSkgLT4gXG4gICAgYmFzZS5leGVjdXRlID0gKGluc3RhbmNlKSAtPlxuICAgICAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSk/XG4gICAgICAgIHBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UuY29udGVudFxuICAgICAgICBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgdmFsPyBhbmQgdmFsIGluIFsnMCcsJ2ZhbHNlJywnbm8nXVxuICAgICAgICBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdHJ1ZVxuICAgIHJldHVybiBiYXNlXG4gIFxuXG5leHBvcnQgY2xhc3MgQmFzZUNvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAaW5zdGFuY2UpIC0+XG4gIGluaXQ6IC0+XG4gICAgI1xuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICByZXR1cm4gdGhpc1tcInJlc3VsdFwiXT9cbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgcmV0dXJuIHt9XG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIHt9XG4gICAgICAiLCJ2YXIgX29wdEtleTtcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBTdG9yYWdlXG59IGZyb20gJy4vU3RvcmFnZSc7XG5cbmltcG9ydCB7XG4gIE5hbWVzcGFjZUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuX29wdEtleSA9IGZ1bmN0aW9uKGtleSwgZGljdCwgZGVmVmFsID0gbnVsbCkge1xuICAvLyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICBpZiAoa2V5IGluIGRpY3QpIHtcbiAgICByZXR1cm4gZGljdFtrZXldO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkZWZWYWw7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgQ29tbWFuZCA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IobmFtZTEsIGRhdGExID0gbnVsbCwgcGFyZW50ID0gbnVsbCkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTE7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhMTtcbiAgICAgIHRoaXMuY21kcyA9IFtdO1xuICAgICAgdGhpcy5kZXRlY3RvcnMgPSBbXTtcbiAgICAgIHRoaXMuZXhlY3V0ZUZ1bmN0ID0gdGhpcy5yZXN1bHRGdW5jdCA9IHRoaXMucmVzdWx0U3RyID0gdGhpcy5hbGlhc09mID0gdGhpcy5jbHMgPSBudWxsO1xuICAgICAgdGhpcy5hbGlhc2VkID0gbnVsbDtcbiAgICAgIHRoaXMuZnVsbE5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICB0aGlzLmRlcHRoID0gMDtcbiAgICAgIFt0aGlzLl9wYXJlbnQsIHRoaXMuX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdO1xuICAgICAgdGhpcy5zZXRQYXJlbnQocGFyZW50KTtcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSB7fTtcbiAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgICBhbHRlclJlc3VsdDogbnVsbCxcbiAgICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgICAgIGFsbG93ZWROYW1lZDogbnVsbFxuICAgICAgfTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgICAgdGhpcy5maW5hbE9wdGlvbnMgPSBudWxsO1xuICAgIH1cblxuICAgIHBhcmVudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgfVxuXG4gICAgc2V0UGFyZW50KHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5fcGFyZW50ICE9PSB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5mdWxsTmFtZSA9ICgodGhpcy5fcGFyZW50ICE9IG51bGwpICYmICh0aGlzLl9wYXJlbnQubmFtZSAhPSBudWxsKSA/IHRoaXMuX3BhcmVudC5mdWxsTmFtZSArICc6JyArIHRoaXMubmFtZSA6IHRoaXMubmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlcHRoID0gKCh0aGlzLl9wYXJlbnQgIT0gbnVsbCkgJiYgKHRoaXMuX3BhcmVudC5kZXB0aCAhPSBudWxsKSA/IHRoaXMuX3BhcmVudC5kZXB0aCArIDEgOiAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wYXJzZURhdGEodGhpcy5kYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50LnJlbW92ZUNtZCh0aGlzKTtcbiAgICB9XG5cbiAgICBpc0VkaXRhYmxlKCkge1xuICAgICAgcmV0dXJuICh0aGlzLnJlc3VsdFN0ciAhPSBudWxsKSB8fCAodGhpcy5hbGlhc09mICE9IG51bGwpO1xuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZSgpIHtcbiAgICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZjtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgICAgfVxuICAgICAgcmVmID0gWydyZXN1bHRTdHInLCAncmVzdWx0RnVuY3QnLCAnY2xzJywgJ2V4ZWN1dGVGdW5jdCddO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal07XG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWUpIHtcbiAgICAgIHZhciBhbGlhc09mLCBhbGlhc2VkLCBjb250ZXh0O1xuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgICBhbGlhc09mID0gdGhpcy5hbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIG5hbWUpO1xuICAgICAgICBhbGlhc2VkID0gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpO1xuICAgICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmlzRXhlY3V0YWJsZSgpO1xuICAgIH1cblxuICAgIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmO1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuICAgICAgcmVmID0gWydyZXN1bHRTdHInLCAncmVzdWx0RnVuY3QnXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcmVmW2pdO1xuICAgICAgICBpZiAodGhpc1twXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXREZWZhdWx0cygpIHtcbiAgICAgIHZhciBhbGlhc2VkLCByZXM7XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5kZWZhdWx0cyk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIF9hbGlhc2VkRnJvbUZpbmRlcihmaW5kZXIpIHtcbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZTtcbiAgICAgIGZpbmRlci5tdXN0RXhlY3V0ZSA9IGZhbHNlO1xuICAgICAgZmluZGVyLnVzZURldGVjdG9ycyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKCk7XG4gICAgfVxuXG4gICAgZ2V0QWxpYXNlZCgpIHtcbiAgICAgIHZhciBjb250ZXh0O1xuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIodGhpcy5hbGlhc09mKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0T3B0aW9ucyhkYXRhKSB7XG4gICAgICB2YXIga2V5LCByZXN1bHRzLCB2YWw7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG4gICAgICAgIHZhbCA9IGRhdGFba2V5XTtcbiAgICAgICAgaWYgKGtleSBpbiB0aGlzLmRlZmF1bHRPcHRpb25zKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMub3B0aW9uc1trZXldID0gdmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgX29wdGlvbnNGb3JBbGlhc2VkKGFsaWFzZWQpIHtcbiAgICAgIHZhciBvcHQ7XG4gICAgICBvcHQgPSB7fTtcbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmRlZmF1bHRPcHRpb25zKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIGFsaWFzZWQuZ2V0T3B0aW9ucygpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5vcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb25zKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb24oa2V5KSB7XG4gICAgICB2YXIgb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhlbHAoKSB7XG4gICAgICB2YXIgY21kO1xuICAgICAgY21kID0gdGhpcy5nZXRDbWQoJ2hlbHAnKTtcbiAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VEYXRhKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gZGF0YTtcbiAgICAgICAgdGhpcy5vcHRpb25zWydwYXJzZSddID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGRhdGEgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURpY3REYXRhKGRhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHBhcnNlRGljdERhdGEoZGF0YSkge1xuICAgICAgdmFyIGV4ZWN1dGUsIHJlcztcbiAgICAgIHJlcyA9IF9vcHRLZXkoJ3Jlc3VsdCcsIGRhdGEpO1xuICAgICAgaWYgKHR5cGVvZiByZXMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLnJlc3VsdEZ1bmN0ID0gcmVzO1xuICAgICAgfSBlbHNlIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IHJlcztcbiAgICAgICAgdGhpcy5vcHRpb25zWydwYXJzZSddID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJywgZGF0YSk7XG4gICAgICBpZiAodHlwZW9mIGV4ZWN1dGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLmV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGU7XG4gICAgICB9XG4gICAgICB0aGlzLmFsaWFzT2YgPSBfb3B0S2V5KCdhbGlhc09mJywgZGF0YSk7XG4gICAgICB0aGlzLmNscyA9IF9vcHRLZXkoJ2NscycsIGRhdGEpO1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IF9vcHRLZXkoJ2RlZmF1bHRzJywgZGF0YSwgdGhpcy5kZWZhdWx0cyk7XG4gICAgICB0aGlzLnNldE9wdGlvbnMoZGF0YSk7XG4gICAgICBpZiAoJ2hlbHAnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLCBkYXRhWydoZWxwJ10sIHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIGlmICgnZmFsbGJhY2snIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2ZhbGxiYWNrJywgZGF0YVsnZmFsbGJhY2snXSwgdGhpcykpO1xuICAgICAgfVxuICAgICAgaWYgKCdjbWRzJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kcyhkYXRhWydjbWRzJ10pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYWRkQ21kcyhjbWRzKSB7XG4gICAgICB2YXIgZGF0YSwgbmFtZSwgcmVzdWx0cztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAobmFtZSBpbiBjbWRzKSB7XG4gICAgICAgIGRhdGEgPSBjbWRzW25hbWVdO1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGRDbWQobmV3IENvbW1hbmQobmFtZSwgZGF0YSwgdGhpcykpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIGFkZENtZChjbWQpIHtcbiAgICAgIHZhciBleGlzdHM7XG4gICAgICBleGlzdHMgPSB0aGlzLmdldENtZChjbWQubmFtZSk7XG4gICAgICBpZiAoZXhpc3RzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbWQoZXhpc3RzKTtcbiAgICAgIH1cbiAgICAgIGNtZC5zZXRQYXJlbnQodGhpcyk7XG4gICAgICB0aGlzLmNtZHMucHVzaChjbWQpO1xuICAgICAgcmV0dXJuIGNtZDtcbiAgICB9XG5cbiAgICByZW1vdmVDbWQoY21kKSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmICgoaSA9IHRoaXMuY21kcy5pbmRleE9mKGNtZCkpID4gLTEpIHtcbiAgICAgICAgdGhpcy5jbWRzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjbWQ7XG4gICAgfVxuXG4gICAgZ2V0Q21kKGZ1bGxuYW1lKSB7XG4gICAgICB2YXIgY21kLCBqLCBsZW4sIG5hbWUsIHJlZiwgcmVmMSwgc3BhY2U7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gKHJlZiA9IHRoaXMuZ2V0Q21kKHNwYWNlKSkgIT0gbnVsbCA/IHJlZi5nZXRDbWQobmFtZSkgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgICByZWYxID0gdGhpcy5jbWRzO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmMS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBjbWQgPSByZWYxW2pdO1xuICAgICAgICBpZiAoY21kLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gY21kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0Q21kKGZ1bGxuYW1lLCBuZXcgQ29tbWFuZChmdWxsbmFtZS5zcGxpdCgnOicpLnBvcCgpLCBkYXRhKSk7XG4gICAgfVxuXG4gICAgc2V0Q21kKGZ1bGxuYW1lLCBjbWQpIHtcbiAgICAgIHZhciBuYW1lLCBuZXh0LCBzcGFjZTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgICBuZXh0ID0gdGhpcy5nZXRDbWQoc3BhY2UpO1xuICAgICAgICBpZiAobmV4dCA9PSBudWxsKSB7XG4gICAgICAgICAgbmV4dCA9IHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKHNwYWNlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5leHQuc2V0Q21kKG5hbWUsIGNtZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFkZENtZChjbWQpO1xuICAgICAgICByZXR1cm4gY21kO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZERldGVjdG9yKGRldGVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXRlY3RvcnMucHVzaChkZXRlY3Rvcik7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXRDbWRzKCkge1xuICAgICAgdmFyIGosIGxlbiwgcHJvdmlkZXIsIHJlZiwgcmVzdWx0cztcbiAgICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwsIHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ2hlbGxvJzoge1xuICAgICAgICAgICAgaGVscDogXCJcXFwiSGVsbG8sIHdvcmxkIVxcXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cXG5tb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cXG52ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWFcIixcbiAgICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlZiA9IHRoaXMucHJvdmlkZXJzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHByb3ZpZGVyID0gcmVmW2pdO1xuICAgICAgICByZXN1bHRzLnB1c2gocHJvdmlkZXIucmVnaXN0ZXIoQ29tbWFuZC5jbWRzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBzdGF0aWMgc2F2ZUNtZChmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZUluUGF0aCgnY21kcycsIGZ1bGxuYW1lLCBkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBsb2FkQ21kcygpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcztcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHRoaXMuc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gICAgICB9KS50aGVuKChzYXZlZENtZHMpID0+IHtcbiAgICAgICAgdmFyIGRhdGEsIGZ1bGxuYW1lLCByZXN1bHRzO1xuICAgICAgICBpZiAoc2F2ZWRDbWRzICE9IG51bGwpIHtcbiAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChmdWxsbmFtZSBpbiBzYXZlZENtZHMpIHtcbiAgICAgICAgICAgIGRhdGEgPSBzYXZlZENtZHNbZnVsbG5hbWVdO1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXRTYXZlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZSgnY21kcycsIHt9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZVZhckNtZChuYW1lLCBiYXNlID0ge30pIHtcbiAgICAgIGJhc2UuZXhlY3V0ZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBwLCB2YWw7XG4gICAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gICAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIG1ha2VCb29sVmFyQ21kKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHAsIHZhbDtcbiAgICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcbiAgICAgICAgaWYgKCEoKHZhbCAhPSBudWxsKSAmJiAodmFsID09PSAnMCcgfHwgdmFsID09PSAnZmFsc2UnIHx8IHZhbCA9PT0gJ25vJykpKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuXG4gIH07XG5cbiAgQ29tbWFuZC5wcm92aWRlcnMgPSBbXTtcblxuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpO1xuXG4gIHJldHVybiBDb21tYW5kO1xuXG59KS5jYWxsKHRoaXMpO1xuXG5leHBvcnQgdmFyIEJhc2VDb21tYW5kID0gY2xhc3MgQmFzZUNvbW1hbmQge1xuICBjb25zdHJ1Y3RvcihpbnN0YW5jZTEpIHtcbiAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2UxO1xuICB9XG5cbiAgaW5pdCgpIHt9XG5cbiAgXG4gIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgIHJldHVybiB0aGlzW1wicmVzdWx0XCJdICE9IG51bGw7XG4gIH1cblxuICBnZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDbWRGaW5kZXIgfSBmcm9tICcuL0NtZEZpbmRlcic7XG5pbXBvcnQgeyBDbWRJbnN0YW5jZSB9IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgQ29udGV4dFxuICBjb25zdHJ1Y3RvcjogKEBjb2Rld2F2ZSkgLT5cbiAgICBAbmFtZVNwYWNlcyA9IFtdXG4gIFxuICBhZGROYW1lU3BhY2U6IChuYW1lKSAtPlxuICAgIGlmIG5hbWUgbm90IGluIEBuYW1lU3BhY2VzIFxuICAgICAgQG5hbWVTcGFjZXMucHVzaChuYW1lKVxuICAgICAgQF9uYW1lc3BhY2VzID0gbnVsbFxuICBhZGROYW1lc3BhY2VzOiAoc3BhY2VzKSAtPlxuICAgIGlmIHNwYWNlcyBcbiAgICAgIGlmIHR5cGVvZiBzcGFjZXMgPT0gJ3N0cmluZydcbiAgICAgICAgc3BhY2VzID0gW3NwYWNlc11cbiAgICAgIGZvciBzcGFjZSBpbiBzcGFjZXMgXG4gICAgICAgIEBhZGROYW1lU3BhY2Uoc3BhY2UpXG4gIHJlbW92ZU5hbWVTcGFjZTogKG5hbWUpIC0+XG4gICAgQG5hbWVTcGFjZXMgPSBAbmFtZVNwYWNlcy5maWx0ZXIgKG4pIC0+IG4gaXNudCBuYW1lXG5cbiAgZ2V0TmFtZVNwYWNlczogLT5cbiAgICB1bmxlc3MgQF9uYW1lc3BhY2VzP1xuICAgICAgbnBjcyA9IFsnY29yZSddLmNvbmNhdChAbmFtZVNwYWNlcylcbiAgICAgIGlmIEBwYXJlbnQ/XG4gICAgICAgIG5wY3MgPSBucGNzLmNvbmNhdChAcGFyZW50LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgIEBfbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLnVuaXF1ZShucGNzKVxuICAgIHJldHVybiBAX25hbWVzcGFjZXNcbiAgZ2V0Q21kOiAoY21kTmFtZSxvcHRpb25zID0ge30pIC0+XG4gICAgZmluZGVyID0gQGdldEZpbmRlcihjbWROYW1lLG9wdGlvbnMpXG4gICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSxvcHRpb25zID0ge30pIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRGaW5kZXIoY21kTmFtZSwgT2JqZWN0LmFzc2lnbih7XG4gICAgICBuYW1lc3BhY2VzOiBbXVxuICAgICAgdXNlRGV0ZWN0b3JzOiBAaXNSb290KClcbiAgICAgIGNvZGV3YXZlOiBAY29kZXdhdmVcbiAgICAgIHBhcmVudENvbnRleHQ6IHRoaXNcbiAgICB9LG9wdGlvbnMpKVxuICBpc1Jvb3Q6IC0+XG4gICAgcmV0dXJuICFAcGFyZW50P1xuICBnZXRQYXJlbnRPclJvb3Q6ICgpIC0+XG4gICAgaWYgQHBhcmVudD9cbiAgICAgIEBwYXJlbnRcbiAgICBlbHNlXG4gICAgICB0aGlzXG4gIHdyYXBDb21tZW50OiAoc3RyKSAtPlxuICAgIGNjID0gQGdldENvbW1lbnRDaGFyKClcbiAgICBpZiBjYy5pbmRleE9mKCclcycpID4gLTFcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsc3RyKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0ciArICcgJyArIGNjXG4gIHdyYXBDb21tZW50TGVmdDogKHN0ciA9ICcnKSAtPlxuICAgIGNjID0gQGdldENvbW1lbnRDaGFyKClcbiAgICBpZiAoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTFcbiAgICAgIHJldHVybiBjYy5zdWJzdHIoMCxpKSArIHN0clxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0clxuICB3cmFwQ29tbWVudFJpZ2h0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIHN0ciArIGNjLnN1YnN0cihpKzIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHN0ciArICcgJyArIGNjXG4gIGNtZEluc3RhbmNlRm9yOiAoY21kKSAtPlxuICAgIHJldHVybiBuZXcgQ21kSW5zdGFuY2UoY21kLHRoaXMpXG4gIGdldENvbW1lbnRDaGFyOiAtPlxuICAgIGlmIEBjb21tZW50Q2hhcj9cbiAgICAgIHJldHVybiBAY29tbWVudENoYXJcbiAgICBjbWQgPSBAZ2V0Q21kKCdjb21tZW50JylcbiAgICBjaGFyID0gJzwhLS0gJXMgLS0+J1xuICAgIGlmIGNtZD9cbiAgICAgIGluc3QgPSBAY21kSW5zdGFuY2VGb3IoY21kKVxuICAgICAgaW5zdC5jb250ZW50ID0gJyVzJ1xuICAgICAgcmVzID0gaW5zdC5yZXN1bHQoKVxuICAgICAgaWYgcmVzP1xuICAgICAgICBjaGFyID0gcmVzXG4gICAgQGNvbW1lbnRDaGFyID0gY2hhclxuICAgIHJldHVybiBAY29tbWVudENoYXIiLCJ2YXIgaW5kZXhPZiA9IFtdLmluZGV4T2Y7XG5cbmltcG9ydCB7XG4gIENtZEZpbmRlclxufSBmcm9tICcuL0NtZEZpbmRlcic7XG5cbmltcG9ydCB7XG4gIENtZEluc3RhbmNlXG59IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuXG5pbXBvcnQge1xuICBBcnJheUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuXG5leHBvcnQgdmFyIENvbnRleHQgPSBjbGFzcyBDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoY29kZXdhdmUpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmU7XG4gICAgdGhpcy5uYW1lU3BhY2VzID0gW107XG4gIH1cblxuICBhZGROYW1lU3BhY2UobmFtZSkge1xuICAgIGlmIChpbmRleE9mLmNhbGwodGhpcy5uYW1lU3BhY2VzLCBuYW1lKSA8IDApIHtcbiAgICAgIHRoaXMubmFtZVNwYWNlcy5wdXNoKG5hbWUpO1xuICAgICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZXMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFkZE5hbWVzcGFjZXMoc3BhY2VzKSB7XG4gICAgdmFyIGosIGxlbiwgcmVzdWx0cywgc3BhY2U7XG4gICAgaWYgKHNwYWNlcykge1xuICAgICAgaWYgKHR5cGVvZiBzcGFjZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNwYWNlcyA9IFtzcGFjZXNdO1xuICAgICAgfVxuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gc3BhY2VzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHNwYWNlID0gc3BhY2VzW2pdO1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGROYW1lU3BhY2Uoc3BhY2UpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZU5hbWVTcGFjZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZVNwYWNlcyA9IHRoaXMubmFtZVNwYWNlcy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4gIT09IG5hbWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXROYW1lU3BhY2VzKCkge1xuICAgIHZhciBucGNzO1xuICAgIGlmICh0aGlzLl9uYW1lc3BhY2VzID09IG51bGwpIHtcbiAgICAgIG5wY3MgPSBbJ2NvcmUnXS5jb25jYXQodGhpcy5uYW1lU3BhY2VzKTtcbiAgICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIG5wY3MgPSBucGNzLmNvbmNhdCh0aGlzLnBhcmVudC5nZXROYW1lU3BhY2VzKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLnVuaXF1ZShucGNzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZXM7XG4gIH1cblxuICBnZXRDbWQoY21kTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmdldEZpbmRlcihjbWROYW1lLCBvcHRpb25zKTtcbiAgICByZXR1cm4gZmluZGVyLmZpbmQoKTtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IENtZEZpbmRlcihjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0aGlzLmlzUm9vdCgpLFxuICAgICAgY29kZXdhdmU6IHRoaXMuY29kZXdhdmUsXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSwgb3B0aW9ucykpO1xuICB9XG5cbiAgaXNSb290KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9PSBudWxsO1xuICB9XG5cbiAgZ2V0UGFyZW50T3JSb290KCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50KHN0cikge1xuICAgIHZhciBjYztcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoY2MuaW5kZXhPZignJXMnKSA+IC0xKSB7XG4gICAgICByZXR1cm4gY2MucmVwbGFjZSgnJXMnLCBzdHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHIgKyAnICcgKyBjYztcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudExlZnQoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGk7XG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKCk7XG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLCBpKSArIHN0cjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50UmlnaHQoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGk7XG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKCk7XG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIHN0ciArIGNjLnN1YnN0cihpICsgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdHIgKyAnICcgKyBjYztcbiAgICB9XG4gIH1cblxuICBjbWRJbnN0YW5jZUZvcihjbWQpIHtcbiAgICByZXR1cm4gbmV3IENtZEluc3RhbmNlKGNtZCwgdGhpcyk7XG4gIH1cblxuICBnZXRDb21tZW50Q2hhcigpIHtcbiAgICB2YXIgY2hhciwgY21kLCBpbnN0LCByZXM7XG4gICAgaWYgKHRoaXMuY29tbWVudENoYXIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tbWVudENoYXI7XG4gICAgfVxuICAgIGNtZCA9IHRoaXMuZ2V0Q21kKCdjb21tZW50Jyk7XG4gICAgY2hhciA9ICc8IS0tICVzIC0tPic7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBpbnN0ID0gdGhpcy5jbWRJbnN0YW5jZUZvcihjbWQpO1xuICAgICAgaW5zdC5jb250ZW50ID0gJyVzJztcbiAgICAgIHJlcyA9IGluc3QucmVzdWx0KCk7XG4gICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgY2hhciA9IHJlcztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb21tZW50Q2hhciA9IGNoYXI7XG4gICAgcmV0dXJuIHRoaXMuY29tbWVudENoYXI7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBhaXIgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgY2xhc3MgRGV0ZWN0b3JcbiAgY29uc3RydWN0b3I6IChAZGF0YT17fSkgLT5cbiAgZGV0ZWN0OiAoZmluZGVyKSAtPlxuICAgIGlmIEBkZXRlY3RlZChmaW5kZXIpXG4gICAgICByZXR1cm4gQGRhdGEucmVzdWx0IGlmIEBkYXRhLnJlc3VsdD9cbiAgICBlbHNlXG4gICAgICByZXR1cm4gQGRhdGEuZWxzZSBpZiBAZGF0YS5lbHNlP1xuICBkZXRlY3RlZDogKGZpbmRlcikgLT5cbiAgICAjXG5cbmV4cG9ydCBjbGFzcyBMYW5nRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvclxuICBkZXRlY3Q6IChmaW5kZXIpIC0+XG4gICAgaWYgZmluZGVyLmNvZGV3YXZlPyBcbiAgICAgIGxhbmcgPSBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLmdldExhbmcoKVxuICAgICAgaWYgbGFuZz8gXG4gICAgICAgIHJldHVybiBsYW5nLnRvTG93ZXJDYXNlKClcbiAgICAgICAgXG5leHBvcnQgY2xhc3MgUGFpckRldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3JcbiAgZGV0ZWN0ZWQ6IChmaW5kZXIpIC0+XG4gICAgaWYgQGRhdGEub3BlbmVyPyBhbmQgQGRhdGEuY2xvc2VyPyBhbmQgZmluZGVyLmluc3RhbmNlP1xuICAgICAgcGFpciA9IG5ldyBQYWlyKEBkYXRhLm9wZW5lciwgQGRhdGEuY2xvc2VyLCBAZGF0YSlcbiAgICAgIGlmIHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICAgICAgIiwiaW1wb3J0IHtcbiAgUGFpclxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgdmFyIERldGVjdG9yID0gY2xhc3MgRGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhID0ge30pIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICB9XG5cbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIGlmICh0aGlzLmRldGVjdGVkKGZpbmRlcikpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEucmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5yZXN1bHQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuZWxzZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuZWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXRlY3RlZChmaW5kZXIpIHt9XG5cbn07XG5cblxuZXhwb3J0IHZhciBMYW5nRGV0ZWN0b3IgPSBjbGFzcyBMYW5nRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdChmaW5kZXIpIHtcbiAgICB2YXIgbGFuZztcbiAgICBpZiAoZmluZGVyLmNvZGV3YXZlICE9IG51bGwpIHtcbiAgICAgIGxhbmcgPSBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLmdldExhbmcoKTtcbiAgICAgIGlmIChsYW5nICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcblxuZXhwb3J0IHZhciBQYWlyRGV0ZWN0b3IgPSBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdGVkKGZpbmRlcikge1xuICAgIHZhciBwYWlyO1xuICAgIGlmICgodGhpcy5kYXRhLm9wZW5lciAhPSBudWxsKSAmJiAodGhpcy5kYXRhLmNsb3NlciAhPSBudWxsKSAmJiAoZmluZGVyLmluc3RhbmNlICE9IG51bGwpKSB7XG4gICAgICBwYWlyID0gbmV3IFBhaXIodGhpcy5kYXRhLm9wZW5lciwgdGhpcy5kYXRhLmNsb3NlciwgdGhpcy5kYXRhKTtcbiAgICAgIGlmIChwYWlyLmlzV2FwcGVyT2YoZmluZGVyLmluc3RhbmNlLmdldFBvcygpLCBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLnRleHQoKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0Q21kUHJvcFxuICBjb25zdHJ1Y3RvcjogKEBuYW1lLG9wdGlvbnMpIC0+XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAndmFyJyA6IG51bGwsXG4gICAgICAnb3B0JyA6IG51bGwsXG4gICAgICAnZnVuY3QnIDogbnVsbCxcbiAgICAgICdkYXRhTmFtZScgOiBudWxsLFxuICAgICAgJ3Nob3dFbXB0eScgOiBmYWxzZSxcbiAgICAgICdjYXJyZXQnIDogZmFsc2UsXG4gICAgfVxuICAgIGZvciBrZXkgaW4gWyd2YXInLCdvcHQnLCdmdW5jdCddXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICBkZWZhdWx0c1snZGF0YU5hbWUnXSA9IG9wdGlvbnNba2V5XVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgICAgICBcbiAgc2V0Q21kOiAoY21kcykgLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZChAbmFtZSlcbiAgXG4gIHdyaXRlRm9yOiAocGFyc2VyLG9iaikgLT5cbiAgICBpZiBwYXJzZXIudmFyc1tAbmFtZV0/XG4gICAgICBvYmpbQGRhdGFOYW1lXSA9IHBhcnNlci52YXJzW0BuYW1lXVxuICB2YWxGcm9tQ21kOiAoY21kKSAtPlxuICAgIGlmIGNtZD9cbiAgICAgIGlmIEBvcHQ/XG4gICAgICAgIHJldHVybiBjbWQuZ2V0T3B0aW9uKEBvcHQpXG4gICAgICBpZiBAZnVuY3Q/XG4gICAgICAgIHJldHVybiBjbWRbQGZ1bmN0XSgpXG4gICAgICBpZiBAdmFyP1xuICAgICAgICByZXR1cm4gY21kW0B2YXJdXG4gIHNob3dGb3JDbWQ6IChjbWQpIC0+XG4gICAgdmFsID0gQHZhbEZyb21DbWQoY21kKVxuICAgIHJldHVybiBAc2hvd0VtcHR5IG9yIHZhbD9cbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICBpZiBAc2hvd0ZvckNtZChjbWQpXG4gICAgICBcIlwiXCJcbiAgICAgIH5+I3tAbmFtZX1+flxuICAgICAgI3tAdmFsRnJvbUNtZChjbWQpIG9yIFwiXCJ9I3tpZiBAY2FycmV0IHRoZW4gXCJ8XCIgZWxzZSBcIlwifVxuICAgICAgfn4vI3tAbmFtZX1+flxuICAgICAgXCJcIlwiXG4gICAgXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5zb3VyY2UgZXh0ZW5kcyBFZGl0Q21kUHJvcCBcbiAgdmFsRnJvbUNtZDogKGNtZCktPlxuICAgIHJlcyA9IHN1cGVyKGNtZClcbiAgICBpZiByZXM/XG4gICAgICByZXMgPSByZXMucmVwbGFjZSgvXFx8L2csICd8fCcpXG4gICAgcmV0dXJuIHJlc1xuICBzZXRDbWQ6IChjbWRzKS0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQoQG5hbWUseydwcmV2ZW50UGFyc2VBbGwnIDogdHJ1ZX0pXG4gIHNob3dGb3JDbWQ6IChjbWQpIC0+XG4gICAgdmFsID0gQHZhbEZyb21DbWQoY21kKVxuICAgIHJldHVybiAoQHNob3dFbXB0eSBhbmQgIShjbWQ/IGFuZCBjbWQuYWxpYXNPZj8pKSBvciB2YWw/XG4gICAgXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5zdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIGlmIEB2YWxGcm9tQ21kKGNtZCk/XG4gICAgICByZXR1cm4gXCJ+fiEje0BuYW1lfSAnI3tAdmFsRnJvbUNtZChjbWQpfSN7aWYgQGNhcnJldCB0aGVuIFwifFwiIGVsc2UgXCJcIn0nfn5cIlxuICAgIFxuICAgIFxuY2xhc3MgRWRpdENtZFByb3AucmV2Qm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIHNldENtZDogKGNtZHMpIC0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKEBuYW1lKVxuICB3cml0ZUZvcjogKHBhcnNlcixvYmopIC0+XG4gICAgaWYgcGFyc2VyLnZhcnNbQG5hbWVdP1xuICAgICAgb2JqW0BkYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbQG5hbWVdXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgdmFsID0gQHZhbEZyb21DbWQoY21kKVxuICAgIGlmIHZhbD8gYW5kICF2YWxcbiAgICAgIHJldHVybiBcIn5+ISN7QG5hbWV9fn5cIlxuXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5ib29sIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgc2V0Q21kOiAoY21kcykgLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQoQG5hbWUpXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgXCJ+fiEje0BuYW1lfX5+XCIgaWYgQHZhbEZyb21DbWQoY21kKSIsImltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBFZGl0Q21kUHJvcCA9IGNsYXNzIEVkaXRDbWRQcm9wIHtcbiAgY29uc3RydWN0b3IobmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywgaSwga2V5LCBsZW4sIHJlZiwgdmFsO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAndmFyJzogbnVsbCxcbiAgICAgICdvcHQnOiBudWxsLFxuICAgICAgJ2Z1bmN0JzogbnVsbCxcbiAgICAgICdkYXRhTmFtZSc6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JzogZmFsc2UsXG4gICAgICAnY2FycmV0JzogZmFsc2VcbiAgICB9O1xuICAgIHJlZiA9IFsndmFyJywgJ29wdCcsICdmdW5jdCddO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAga2V5ID0gcmVmW2ldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGRlZmF1bHRzWydkYXRhTmFtZSddID0gb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICB3cml0ZUZvcihwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSBwYXJzZXIudmFyc1t0aGlzLm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHZhbEZyb21DbWQoY21kKSB7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5vcHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmdldE9wdGlvbih0aGlzLm9wdCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5mdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy5mdW5jdF0oKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnZhciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy52YXJdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3dGb3JDbWQoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgfHwgKHZhbCAhPSBudWxsKTtcbiAgfVxuXG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMuc2hvd0ZvckNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+JHt0aGlzLm5hbWV9fn5cXG4ke3RoaXMudmFsRnJvbUNtZChjbWQpIHx8IFwiXCJ9JHsodGhpcy5jYXJyZXQgPyBcInxcIiA6IFwiXCIpfVxcbn5+LyR7dGhpcy5uYW1lfX5+YDtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZFByb3Auc291cmNlID0gY2xhc3Mgc291cmNlIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICB2YWxGcm9tQ21kKGNtZCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gc3VwZXIudmFsRnJvbUNtZChjbWQpO1xuICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgcmVzID0gcmVzLnJlcGxhY2UoL1xcfC9nLCAnfHwnKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZCh0aGlzLm5hbWUsIHtcbiAgICAgICdwcmV2ZW50UGFyc2VBbGwnOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBzaG93Rm9yQ21kKGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG4gICAgcmV0dXJuICh0aGlzLnNob3dFbXB0eSAmJiAhKChjbWQgIT0gbnVsbCkgJiYgKGNtZC5hbGlhc09mICE9IG51bGwpKSkgfHwgKHZhbCAhPSBudWxsKTtcbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5zdHJpbmcgPSBjbGFzcyBzdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9ICcke3RoaXMudmFsRnJvbUNtZChjbWQpfSR7KHRoaXMuY2FycmV0ID8gXCJ8XCIgOiBcIlwiKX0nfn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5yZXZCb29sID0gY2xhc3MgcmV2Qm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgd3JpdGVGb3IocGFyc2VyLCBvYmopIHtcbiAgICBpZiAocGFyc2VyLnZhcnNbdGhpcy5uYW1lXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gb2JqW3RoaXMuZGF0YU5hbWVdID0gIXBhcnNlci52YXJzW3RoaXMubmFtZV07XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIGlmICgodmFsICE9IG51bGwpICYmICF2YWwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5ib29sID0gY2xhc3MgYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgU3RyUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuaW1wb3J0IHsgb3B0aW9uYWxQcm9taXNlIH0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQG5hbWVzcGFjZSA9IG51bGxcbiAgICBAX2xhbmcgPSBudWxsXG4gIGJpbmRlZFRvOiAoY29kZXdhdmUpIC0+XG4gICAgI1xuICB0ZXh0OiAodmFsKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRMZW46IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCA9IG51bGwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBiZWdpblVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBlbmRVbmRvQWN0aW9uOiAtPlxuICAgICNcbiAgZ2V0TGFuZzogLT5cbiAgICByZXR1cm4gQF9sYW5nXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdDogLT5cbiAgICByZXR1cm4gbnVsbFxuICBhbGxvd011bHRpU2VsZWN0aW9uOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBzZXRNdWx0aVNlbDogKHNlbGVjdGlvbnMpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRNdWx0aVNlbDogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGNhbkxpc3RlblRvQ2hhbmdlOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIFxuICBnZXRMaW5lQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQGZpbmRMaW5lU3RhcnQocG9zKSxAZmluZExpbmVFbmQocG9zKSlcbiAgZmluZExpbmVTdGFydDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiXSwgLTEpXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcysxIGVsc2UgMFxuICBmaW5kTGluZUVuZDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiLFwiXFxyXCJdKVxuICAgIHJldHVybiBpZiBwIHRoZW4gcC5wb3MgZWxzZSBAdGV4dExlbigpXG4gIFxuICBmaW5kQW55TmV4dDogKHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgaWYgZGlyZWN0aW9uID4gMFxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LEB0ZXh0TGVuKCkpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKDAsc3RhcnQpXG4gICAgYmVzdFBvcyA9IG51bGxcbiAgICBmb3Igc3RyaSBpbiBzdHJpbmdzXG4gICAgICBwb3MgPSBpZiBkaXJlY3Rpb24gPiAwIHRoZW4gdGV4dC5pbmRleE9mKHN0cmkpIGVsc2UgdGV4dC5sYXN0SW5kZXhPZihzdHJpKVxuICAgICAgaWYgcG9zICE9IC0xXG4gICAgICAgIGlmICFiZXN0UG9zPyBvciBiZXN0UG9zKmRpcmVjdGlvbiA+IHBvcypkaXJlY3Rpb25cbiAgICAgICAgICBiZXN0UG9zID0gcG9zXG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmlcbiAgICBpZiBiZXN0U3RyP1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBiZXN0UG9zICsgc3RhcnQgZWxzZSBiZXN0UG9zKSxiZXN0U3RyKVxuICAgIHJldHVybiBudWxsXG4gIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICByZXBsYWNlbWVudHMucmVkdWNlKChwcm9taXNlLHJlcGwpPT5cbiAgICAgICAgcHJvbWlzZS50aGVuIChvcHQpPT5cbiAgICAgICAgICByZXBsLndpdGhFZGl0b3IodGhpcylcbiAgICAgICAgICByZXBsLmFwcGx5T2Zmc2V0KG9wdC5vZmZzZXQpXG4gICAgICAgICAgb3B0aW9uYWxQcm9taXNlKHJlcGwuYXBwbHkoKSkudGhlbiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzZWxlY3Rpb25zOiBvcHQuc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKSxcbiAgICAgICAgICAgICAgb2Zmc2V0OiBvcHQub2Zmc2V0K3JlcGwub2Zmc2V0QWZ0ZXIodGhpcykgXG4gICAgICAgICAgICB9XG4gICAgICAsIG9wdGlvbmFsUHJvbWlzZSh7c2VsZWN0aW9uczogW10sb2Zmc2V0OiAwfSkpXG4gICAgLnRoZW4gKG9wdCk9PlxuICAgICAgQGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhvcHQuc2VsZWN0aW9ucylcbiAgICAucmVzdWx0KClcbiAgICBcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnM6IChzZWxlY3Rpb25zKSAtPlxuICAgIGlmIHNlbGVjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgaWYgQGFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgICAgICBAc2V0TXVsdGlTZWwoc2VsZWN0aW9ucylcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldEN1cnNvclBvcyhzZWxlY3Rpb25zWzBdLnN0YXJ0LHNlbGVjdGlvbnNbMF0uZW5kKSIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFN0clBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5cbmltcG9ydCB7XG4gIG9wdGlvbmFsUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IHZhciBFZGl0b3IgPSBjbGFzcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG51bGw7XG4gICAgdGhpcy5fbGFuZyA9IG51bGw7XG4gIH1cblxuICBiaW5kZWRUbyhjb2Rld2F2ZSkge31cblxuICBcbiAgdGV4dCh2YWwpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dENoYXJBdChwb3MpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dExlbigpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dFN1YnN0cihzdGFydCwgZW5kKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGluc2VydFRleHRBdCh0ZXh0LCBwb3MpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGdldEN1cnNvclBvcygpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQgPSBudWxsKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGJlZ2luVW5kb0FjdGlvbigpIHt9XG5cbiAgXG4gIGVuZFVuZG9BY3Rpb24oKSB7fVxuXG4gIFxuICBnZXRMYW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICB9XG5cbiAgc2V0TGFuZyh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFuZyA9IHZhbDtcbiAgfVxuXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdCgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFsbG93TXVsdGlTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2V0TXVsdGlTZWwoc2VsZWN0aW9ucykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRNdWx0aVNlbCgpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0TGluZUF0KHBvcykge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMuZmluZExpbmVTdGFydChwb3MpLCB0aGlzLmZpbmRMaW5lRW5kKHBvcykpO1xuICB9XG5cbiAgZmluZExpbmVTdGFydChwb3MpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtcIlxcblwiXSwgLTEpO1xuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3MgKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICBmaW5kTGluZUVuZChwb3MpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtcIlxcblwiLCBcIlxcclwiXSk7XG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dExlbigpO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgdmFyIGJlc3RQb3MsIGJlc3RTdHIsIGksIGxlbiwgcG9zLCBzdHJpLCB0ZXh0O1xuICAgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0LCB0aGlzLnRleHRMZW4oKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoMCwgc3RhcnQpO1xuICAgIH1cbiAgICBiZXN0UG9zID0gbnVsbDtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzdHJpbmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzdHJpID0gc3RyaW5nc1tpXTtcbiAgICAgIHBvcyA9IGRpcmVjdGlvbiA+IDAgPyB0ZXh0LmluZGV4T2Yoc3RyaSkgOiB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpO1xuICAgICAgaWYgKHBvcyAhPT0gLTEpIHtcbiAgICAgICAgaWYgKChiZXN0UG9zID09IG51bGwpIHx8IGJlc3RQb3MgKiBkaXJlY3Rpb24gPiBwb3MgKiBkaXJlY3Rpb24pIHtcbiAgICAgICAgICBiZXN0UG9zID0gcG9zO1xuICAgICAgICAgIGJlc3RTdHIgPSBzdHJpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChiZXN0U3RyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3RyUG9zKChkaXJlY3Rpb24gPiAwID8gYmVzdFBvcyArIHN0YXJ0IDogYmVzdFBvcyksIGJlc3RTdHIpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cykge1xuICAgIHJldHVybiByZXBsYWNlbWVudHMucmVkdWNlKChwcm9taXNlLCByZXBsKSA9PiB7XG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKChvcHQpID0+IHtcbiAgICAgICAgcmVwbC53aXRoRWRpdG9yKHRoaXMpO1xuICAgICAgICByZXBsLmFwcGx5T2Zmc2V0KG9wdC5vZmZzZXQpO1xuICAgICAgICByZXR1cm4gb3B0aW9uYWxQcm9taXNlKHJlcGwuYXBwbHkoKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnM6IG9wdC5zZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpLFxuICAgICAgICAgICAgb2Zmc2V0OiBvcHQub2Zmc2V0ICsgcmVwbC5vZmZzZXRBZnRlcih0aGlzKVxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSwgb3B0aW9uYWxQcm9taXNlKHtcbiAgICAgIHNlbGVjdGlvbnM6IFtdLFxuICAgICAgb2Zmc2V0OiAwXG4gICAgfSkpLnRoZW4oKG9wdCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKG9wdC5zZWxlY3Rpb25zKTtcbiAgICB9KS5yZXN1bHQoKTtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhzZWxlY3Rpb25zKSB7XG4gICAgaWYgKHNlbGVjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHRoaXMuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldE11bHRpU2VsKHNlbGVjdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q3Vyc29yUG9zKHNlbGVjdGlvbnNbMF0uc3RhcnQsIHNlbGVjdGlvbnNbMF0uZW5kKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBMb2dnZXJcbiAgQGVuYWJsZWQgPSB0cnVlXG4gIGxvZzogKGFyZ3MuLi4pIC0+XG4gICAgaWYgQGlzRW5hYmxlZCgpXG4gICAgICBmb3IgbXNnIGluIGFyZ3NcbiAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICBpc0VuYWJsZWQ6IC0+XG4gICAgY29uc29sZT8ubG9nPyBhbmQgdGhpcy5lbmFibGVkIGFuZCBMb2dnZXIuZW5hYmxlZFxuICBlbmFibGVkOiB0cnVlXG4gIHJ1bnRpbWU6IChmdW5jdCxuYW1lID0gXCJmdW5jdGlvblwiKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGNvbnNvbGUubG9nKFwiI3tuYW1lfSB0b29rICN7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLlwiKVxuICAgIHJlc1xuICBtb25pdG9yRGF0YToge31cbiAgdG9Nb25pdG9yOiAob2JqLG5hbWUscHJlZml4PScnKSAtPlxuICAgIGZ1bmN0ID0gb2JqW25hbWVdXG4gICAgb2JqW25hbWVdID0gLT4gXG4gICAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgICB0aGlzLm1vbml0b3IoKC0+IGZ1bmN0LmFwcGx5KG9iaixhcmdzKSkscHJlZml4K25hbWUpXG4gIG1vbml0b3I6IChmdW5jdCxuYW1lKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGlmIHRoaXMubW9uaXRvckRhdGFbbmFtZV0/XG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLmNvdW50KytcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwrPSB0MSAtIHQwXG4gICAgZWxzZVxuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgY291bnQ6IDFcbiAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgIH1cbiAgICByZXNcbiAgcmVzdW1lOiAtPlxuICAgIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpXG4iLCJleHBvcnQgdmFyIExvZ2dlciA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgTG9nZ2VyIHtcbiAgICBsb2coLi4uYXJncykge1xuICAgICAgdmFyIGksIGxlbiwgbXNnLCByZXN1bHRzO1xuICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbXNnID0gYXJnc1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY29uc29sZS5sb2cobXNnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgcmV0dXJuICgodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZSAhPT0gbnVsbCA/IGNvbnNvbGUubG9nIDogdm9pZCAwKSAhPSBudWxsKSAmJiB0aGlzLmVuYWJsZWQgJiYgTG9nZ2VyLmVuYWJsZWQ7XG4gICAgfVxuXG4gICAgcnVudGltZShmdW5jdCwgbmFtZSA9IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgY29uc29sZS5sb2coYCR7bmFtZX0gdG9vayAke3QxIC0gdDB9IG1pbGxpc2Vjb25kcy5gKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgdG9Nb25pdG9yKG9iaiwgbmFtZSwgcHJlZml4ID0gJycpIHtcbiAgICAgIHZhciBmdW5jdDtcbiAgICAgIGZ1bmN0ID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIG9ialtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgcmV0dXJuIHRoaXMubW9uaXRvcigoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0LmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgIH0pLCBwcmVmaXggKyBuYW1lKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgbW9uaXRvcihmdW5jdCwgbmFtZSkge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgaWYgKHRoaXMubW9uaXRvckRhdGFbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLmNvdW50Kys7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwgKz0gdDEgLSB0MDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0gPSB7XG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgcmVzdW1lKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpO1xuICAgIH1cblxuICB9O1xuXG4gIExvZ2dlci5lbmFibGVkID0gdHJ1ZTtcblxuICBMb2dnZXIucHJvdG90eXBlLmVuYWJsZWQgPSB0cnVlO1xuXG4gIExvZ2dlci5wcm90b3R5cGUubW9uaXRvckRhdGEgPSB7fTtcblxuICByZXR1cm4gTG9nZ2VyO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiZXhwb3J0IGNsYXNzIE9wdGlvbk9iamVjdFxuICBzZXRPcHRzOiAob3B0aW9ucyxkZWZhdWx0cyktPlxuICAgIEBkZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgQHNldE9wdChrZXksb3B0aW9uc1trZXldKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0T3B0KGtleSx2YWwpXG4gICAgICAgIFxuICBzZXRPcHQ6IChrZXksIHZhbCktPlxuICAgIGlmIHRoaXNba2V5XT8uY2FsbD9cbiAgICAgIHRoaXNba2V5XSh2YWwpXG4gICAgZWxzZVxuICAgICAgdGhpc1trZXldPSB2YWxcbiAgICAgICAgXG4gIGdldE9wdDogKGtleSktPlxuICAgIGlmIHRoaXNba2V5XT8uY2FsbD9cbiAgICAgIHJldHVybiB0aGlzW2tleV0oKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0aGlzW2tleV1cbiAgXG4gIGdldE9wdHM6IC0+XG4gICAgb3B0cyA9IHt9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgb3B0c1trZXldID0gQGdldE9wdChrZXkpXG4gICAgcmV0dXJuIG9wdHMiLCJleHBvcnQgdmFyIE9wdGlvbk9iamVjdCA9IGNsYXNzIE9wdGlvbk9iamVjdCB7XG4gIHNldE9wdHMob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIga2V5LCByZWYsIHJlc3VsdHMsIHZhbDtcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCBvcHRpb25zW2tleV0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIHZhbCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIHNldE9wdChrZXksIHZhbCkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0odmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBnZXRPcHQoa2V5KSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdHMoKSB7XG4gICAgdmFyIGtleSwgb3B0cywgcmVmLCB2YWw7XG4gICAgb3B0cyA9IHt9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIG9wdHNba2V5XSA9IHRoaXMuZ2V0T3B0KGtleSk7XG4gICAgfVxuICAgIHJldHVybiBvcHRzO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDbWRJbnN0YW5jZSB9IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi9Cb3hIZWxwZXInO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgU3RyUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSBleHRlbmRzIENtZEluc3RhbmNlXG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlLEBwb3MsQHN0cikgLT5cbiAgICBzdXBlcigpXG4gICAgdW5sZXNzIEBpc0VtcHR5KClcbiAgICAgIEBfY2hlY2tDbG9zZXIoKVxuICAgICAgQG9wZW5pbmcgPSBAc3RyXG4gICAgICBAbm9CcmFja2V0ID0gQF9yZW1vdmVCcmFja2V0KEBzdHIpXG4gICAgICBAX3NwbGl0Q29tcG9uZW50cygpXG4gICAgICBAX2ZpbmRDbG9zaW5nKClcbiAgICAgIEBfY2hlY2tFbG9uZ2F0ZWQoKVxuICBfY2hlY2tDbG9zZXI6IC0+XG4gICAgbm9CcmFja2V0ID0gQF9yZW1vdmVCcmFja2V0KEBzdHIpXG4gICAgaWYgbm9CcmFja2V0LnN1YnN0cmluZygwLEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PSBAY29kZXdhdmUuY2xvc2VDaGFyIGFuZCBmID0gQF9maW5kT3BlbmluZ1BvcygpXG4gICAgICBAY2xvc2luZ1BvcyA9IG5ldyBTdHJQb3MoQHBvcywgQHN0cilcbiAgICAgIEBwb3MgPSBmLnBvc1xuICAgICAgQHN0ciA9IGYuc3RyXG4gIF9maW5kT3BlbmluZ1BvczogLT5cbiAgICBjbWROYW1lID0gQF9yZW1vdmVCcmFja2V0KEBzdHIpLnN1YnN0cmluZyhAY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aClcbiAgICBvcGVuaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBjbWROYW1lXG4gICAgY2xvc2luZyA9IEBzdHJcbiAgICBpZiBmID0gQGNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIoQHBvcyxvcGVuaW5nLGNsb3NpbmcsLTEpXG4gICAgICBmLnN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihmLnBvcyxAY29kZXdhdmUuZmluZE5leHRCcmFrZXQoZi5wb3MrZi5zdHIubGVuZ3RoKStAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gICAgICByZXR1cm4gZlxuICBfc3BsaXRDb21wb25lbnRzOiAtPlxuICAgIHBhcnRzID0gQG5vQnJhY2tldC5zcGxpdChcIiBcIik7XG4gICAgQGNtZE5hbWUgPSBwYXJ0cy5zaGlmdCgpXG4gICAgQHJhd1BhcmFtcyA9IHBhcnRzLmpvaW4oXCIgXCIpXG4gIF9wYXJzZVBhcmFtczoocGFyYW1zKSAtPlxuICAgIEBwYXJhbXMgPSBbXVxuICAgIEBuYW1lZCA9IEBnZXREZWZhdWx0cygpXG4gICAgaWYgQGNtZD9cbiAgICAgIG5hbWVUb1BhcmFtID0gQGdldE9wdGlvbignbmFtZVRvUGFyYW0nKVxuICAgICAgaWYgbmFtZVRvUGFyYW0/IFxuICAgICAgICBAbmFtZWRbbmFtZVRvUGFyYW1dID0gQGNtZE5hbWVcbiAgICBpZiBwYXJhbXMubGVuZ3RoXG4gICAgICBhbGxvd2VkTmFtZWQgPSBAZ2V0T3B0aW9uKCdhbGxvd2VkTmFtZWQnKVxuICAgICAgaW5TdHIgPSBmYWxzZVxuICAgICAgcGFyYW0gPSAnJ1xuICAgICAgbmFtZSA9IGZhbHNlXG4gICAgICBmb3IgaSBpbiBbMC4uKHBhcmFtcy5sZW5ndGgtMSldXG4gICAgICAgIGNociA9IHBhcmFtc1tpXVxuICAgICAgICBpZiBjaHIgPT0gJyAnIGFuZCAhaW5TdHJcbiAgICAgICAgICBpZihuYW1lKVxuICAgICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGFyYW1zLnB1c2gocGFyYW0pXG4gICAgICAgICAgcGFyYW0gPSAnJ1xuICAgICAgICAgIG5hbWUgPSBmYWxzZVxuICAgICAgICBlbHNlIGlmIGNociBpbiBbJ1wiJyxcIidcIl0gYW5kIChpID09IDAgb3IgcGFyYW1zW2ktMV0gIT0gJ1xcXFwnKVxuICAgICAgICAgIGluU3RyID0gIWluU3RyXG4gICAgICAgIGVsc2UgaWYgY2hyID09ICc6JyBhbmQgIW5hbWUgYW5kICFpblN0ciBhbmQgKCFhbGxvd2VkTmFtZWQ/IG9yIHBhcmFtIGluIGFsbG93ZWROYW1lZClcbiAgICAgICAgICBuYW1lID0gcGFyYW1cbiAgICAgICAgICBwYXJhbSA9ICcnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwYXJhbSArPSBjaHJcbiAgICAgIGlmIHBhcmFtLmxlbmd0aFxuICAgICAgICBpZihuYW1lKVxuICAgICAgICAgIEBuYW1lZFtuYW1lXSA9IHBhcmFtXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcGFyYW1zLnB1c2gocGFyYW0pXG4gIF9maW5kQ2xvc2luZzogLT5cbiAgICBpZiBmID0gQF9maW5kQ2xvc2luZ1BvcygpXG4gICAgICBAY29udGVudCA9IFN0cmluZ0hlbHBlci50cmltRW1wdHlMaW5lKEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zK0BzdHIubGVuZ3RoLGYucG9zKSlcbiAgICAgIEBzdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyxmLnBvcytmLnN0ci5sZW5ndGgpXG4gIF9maW5kQ2xvc2luZ1BvczogLT5cbiAgICByZXR1cm4gQGNsb3NpbmdQb3MgaWYgQGNsb3NpbmdQb3M/XG4gICAgY2xvc2luZyA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjbWROYW1lICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICBvcGVuaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY21kTmFtZVxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zK0BzdHIubGVuZ3RoLCBvcGVuaW5nLCBjbG9zaW5nKVxuICAgICAgcmV0dXJuIEBjbG9zaW5nUG9zID0gZlxuICBfY2hlY2tFbG9uZ2F0ZWQ6IC0+XG4gICAgZW5kUG9zID0gQGdldEVuZFBvcygpXG4gICAgbWF4ID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0TGVuKClcbiAgICB3aGlsZSBlbmRQb3MgPCBtYXggYW5kIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsZW5kUG9zK0Bjb2Rld2F2ZS5kZWNvLmxlbmd0aCkgPT0gQGNvZGV3YXZlLmRlY29cbiAgICAgIGVuZFBvcys9QGNvZGV3YXZlLmRlY28ubGVuZ3RoXG4gICAgaWYgZW5kUG9zID49IG1heCBvciBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyBAY29kZXdhdmUuZGVjby5sZW5ndGgpIGluIFsnICcsXCJcXG5cIixcIlxcclwiXVxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGVuZFBvcylcbiAgX2NoZWNrQm94OiAtPlxuICAgIGlmIEBjb2Rld2F2ZS5pbkluc3RhbmNlPyBhbmQgQGNvZGV3YXZlLmluSW5zdGFuY2UuY21kLm5hbWUgPT0gJ2NvbW1lbnQnXG4gICAgICByZXR1cm5cbiAgICBjbCA9IEBjb250ZXh0LndyYXBDb21tZW50TGVmdCgpXG4gICAgY3IgPSBAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KClcbiAgICBlbmRQb3MgPSBAZ2V0RW5kUG9zKCkgKyBjci5sZW5ndGhcbiAgICBpZiBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyAtIGNsLmxlbmd0aCxAcG9zKSA9PSBjbCBhbmQgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyAtIGNyLmxlbmd0aCxlbmRQb3MpID09IGNyXG4gICAgICBAcG9zID0gQHBvcyAtIGNsLmxlbmd0aFxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGVuZFBvcylcbiAgICAgIEBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KClcbiAgICBlbHNlIGlmIEBnZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKS5pbmRleE9mKGNsKSA+IC0xIGFuZCBAZ2V0UG9zKCkuc2FtZUxpbmVzU3VmZml4KCkuaW5kZXhPZihjcikgPiAtMVxuICAgICAgQGluQm94ID0gMVxuICAgICAgQF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50OiAtPlxuICAgIGlmIEBjb250ZW50XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdCgpKVxuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpXG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvZGV3YXZlLmRlY28pXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKiN7ZWNsfSg/OiN7ZWR9KStcXFxccyooLio/KVxcXFxzKig/OiN7ZWR9KSsje2Vjcn0kXCIsIFwiZ21cIilcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqKD86I3tlZH0pKiN7ZWNyfVxccj9cXG5cIilcbiAgICAgIHJlMyA9IG5ldyBSZWdFeHAoXCJcXG5cXFxccyoje2VjbH0oPzoje2VkfSkqXFxcXHMqJFwiKVxuICAgICAgQGNvbnRlbnQgPSBAY29udGVudC5yZXBsYWNlKHJlMSwnJDEnKS5yZXBsYWNlKHJlMiwnJykucmVwbGFjZShyZTMsJycpXG4gIF9nZXRQYXJlbnRDbWRzOiAtPlxuICAgIEBwYXJlbnQgPSBAY29kZXdhdmUuZ2V0RW5jbG9zaW5nQ21kKEBnZXRFbmRQb3MoKSk/LmluaXQoKVxuICBzZXRNdWx0aVBvczogKG11bHRpUG9zKSAtPlxuICAgIEBtdWx0aVBvcyA9IG11bHRpUG9zXG4gIF9nZXRDbWRPYmo6IC0+XG4gICAgQGdldENtZCgpXG4gICAgQF9jaGVja0JveCgpXG4gICAgQGNvbnRlbnQgPSBAcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQoQGNvbnRlbnQpXG4gICAgc3VwZXIoKVxuICBfaW5pdFBhcmFtczogLT5cbiAgICBAX3BhcnNlUGFyYW1zKEByYXdQYXJhbXMpXG4gIGdldENvbnRleHQ6IC0+XG4gICAgcmV0dXJuIEBjb250ZXh0IG9yIEBjb2Rld2F2ZS5jb250ZXh0XG4gIGdldENtZDogLT5cbiAgICB1bmxlc3MgQGNtZD9cbiAgICAgIEBfZ2V0UGFyZW50Q21kcygpXG4gICAgICBpZiBAbm9CcmFja2V0LnN1YnN0cmluZygwLEBjb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyLmxlbmd0aCkgPT0gQGNvZGV3YXZlLm5vRXhlY3V0ZUNoYXJcbiAgICAgICAgQGNtZCA9IENvbW1hbmQuY21kcy5nZXRDbWQoJ2NvcmU6bm9fZXhlY3V0ZScpXG4gICAgICAgIEBjb250ZXh0ID0gQGNvZGV3YXZlLmNvbnRleHRcbiAgICAgIGVsc2VcbiAgICAgICAgQGZpbmRlciA9IEBnZXRGaW5kZXIoQGNtZE5hbWUpXG4gICAgICAgIEBjb250ZXh0ID0gQGZpbmRlci5jb250ZXh0XG4gICAgICAgIEBjbWQgPSBAZmluZGVyLmZpbmQoKVxuICAgICAgICBpZiBAY21kP1xuICAgICAgICAgIEBjb250ZXh0LmFkZE5hbWVTcGFjZShAY21kLmZ1bGxOYW1lKVxuICAgIHJldHVybiBAY21kXG4gIGdldEZpbmRlcjogKGNtZE5hbWUpLT5cbiAgICBmaW5kZXIgPSBAY29kZXdhdmUuY29udGV4dC5nZXRGaW5kZXIoY21kTmFtZSxuYW1lc3BhY2VzOkBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzOiAtPlxuICAgIG5zcGNzID0gW11cbiAgICBvYmogPSB0aGlzXG4gICAgd2hpbGUgb2JqLnBhcmVudD9cbiAgICAgIG9iaiA9IG9iai5wYXJlbnRcbiAgICAgIG5zcGNzLnB1c2gob2JqLmNtZC5mdWxsTmFtZSkgaWYgb2JqLmNtZD8gYW5kIG9iai5jbWQuZnVsbE5hbWU/XG4gICAgcmV0dXJuIG5zcGNzXG4gIF9yZW1vdmVCcmFja2V0OiAoc3RyKS0+XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoLHN0ci5sZW5ndGgtQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKVxuICBhbHRlckFsaWFzT2Y6IChhbGlhc09mKS0+XG4gICAgW25zcGMsIGNtZE5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0KEBjbWROYW1lKVxuICAgIHJldHVybiBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsY21kTmFtZSlcbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQHN0ciA9PSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY29kZXdhdmUuYnJha2V0cyBvciBAc3RyID09IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgZXhlY3V0ZTogLT5cbiAgICBpZiBAaXNFbXB0eSgpXG4gICAgICBpZiBAY29kZXdhdmUuY2xvc2luZ1Byb21wPyBhbmQgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcC53aGl0aGluT3BlbkJvdW5kcyhAcG9zICsgQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKT9cbiAgICAgICAgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcC5jYW5jZWwoKVxuICAgICAgZWxzZVxuICAgICAgICBAcmVwbGFjZVdpdGgoJycpXG4gICAgZWxzZSBpZiBAY21kP1xuICAgICAgaWYgYmVmb3JlRnVuY3QgPSBAZ2V0T3B0aW9uKCdiZWZvcmVFeGVjdXRlJylcbiAgICAgICAgYmVmb3JlRnVuY3QodGhpcylcbiAgICAgIGlmIEByZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICAgIGlmIChyZXMgPSBAcmVzdWx0KCkpP1xuICAgICAgICAgIEByZXBsYWNlV2l0aChyZXMpXG4gICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIEBydW5FeGVjdXRlRnVuY3QoKVxuICBnZXRFbmRQb3M6IC0+XG4gICAgcmV0dXJuIEBwb3MrQHN0ci5sZW5ndGhcbiAgZ2V0UG9zOiAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBwb3MsQHBvcytAc3RyLmxlbmd0aCkud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICBnZXRPcGVuaW5nUG9zOiAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBwb3MsQHBvcytAb3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHVubGVzcyBAaW5kZW50TGVuP1xuICAgICAgaWYgQGluQm94P1xuICAgICAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgICAgICBAaW5kZW50TGVuID0gaGVscGVyLnJlbW92ZUNvbW1lbnQoQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGhcbiAgICAgIGVsc2VcbiAgICAgICAgQGluZGVudExlbiA9IEBwb3MgLSBAZ2V0UG9zKCkucHJldkVPTCgpXG4gICAgcmV0dXJuIEBpbmRlbnRMZW5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQ6ICh0ZXh0KSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKCdeXFxcXHN7JytAZ2V0SW5kZW50KCkrJ30nLCdnbScpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywnJylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBhbHRlclJlc3VsdEZvckJveDogKHJlcGwpIC0+XG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKVxuICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGNvbnRleHQpXG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksZmFsc2UpXG4gICAgaWYgQGdldE9wdGlvbigncmVwbGFjZUJveCcpXG4gICAgICBib3ggPSBoZWxwZXIuZ2V0Qm94Rm9yUG9zKG9yaWdpbmFsKVxuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdXG4gICAgICBAaW5kZW50TGVuID0gaGVscGVyLmluZGVudFxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBlbHNlXG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgICAgcmVwbC5zdGFydCA9IG9yaWdpbmFsLnByZXZFT0woKVxuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKClcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgQGNvZGV3YXZlLm1hcmtlciArIHJlcGwudGV4dCArIEBjb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge211bHRpbGluZTpmYWxzZX0pXG4gICAgICBbcmVwbC5wcmVmaXgscmVwbC50ZXh0LHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdChAY29kZXdhdmUubWFya2VyKVxuICAgIHJldHVybiByZXBsXG4gIGdldEN1cnNvckZyb21SZXN1bHQ6IChyZXBsKSAtPlxuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KClcbiAgICBpZiBAY21kPyBhbmQgQGNvZGV3YXZlLmNoZWNrQ2FycmV0IGFuZCBAZ2V0T3B0aW9uKCdjaGVja0NhcnJldCcpXG4gICAgICBpZiAocCA9IEBjb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSk/IFxuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0K3JlcGwucHJlZml4Lmxlbmd0aCtwXG4gICAgICByZXBsLnRleHQgPSBAY29kZXdhdmUucmVtb3ZlQ2FycmV0KHJlcGwudGV4dClcbiAgICByZXR1cm4gY3Vyc29yUG9zXG4gIGNoZWNrTXVsdGk6IChyZXBsKSAtPlxuICAgIGlmIEBtdWx0aVBvcz8gYW5kIEBtdWx0aVBvcy5sZW5ndGggPiAxXG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF1cbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KClcbiAgICAgIGZvciBwb3MsIGkgaW4gQG11bHRpUG9zXG4gICAgICAgIGlmIGkgPT0gMFxuICAgICAgICAgIG9yaWdpbmFsUG9zID0gcG9zLnN0YXJ0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0LW9yaWdpbmFsUG9zKVxuICAgICAgICAgIGlmIG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT0gb3JpZ2luYWxUZXh0XG4gICAgICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXdSZXBsKVxuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50c1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBbcmVwbF1cbiAgcmVwbGFjZVdpdGg6ICh0ZXh0KSAtPlxuICAgIEBhcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChAcG9zLEBnZXRFbmRQb3MoKSx0ZXh0KSlcbiAgYXBwbHlSZXBsYWNlbWVudDogKHJlcGwpIC0+XG4gICAgcmVwbC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gICAgaWYgQGluQm94P1xuICAgICAgQGFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBjdXJzb3JQb3MgPSBAZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKVxuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKGN1cnNvclBvcywgY3Vyc29yUG9zKV1cbiAgICByZXBsYWNlbWVudHMgPSBAY2hlY2tNdWx0aShyZXBsKVxuICAgIEByZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0XG4gICAgQHJlcGxhY2VFbmQgPSByZXBsLnJlc0VuZCgpXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gICAgIiwidmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xuXG5pbXBvcnQge1xuICBDbWRJbnN0YW5jZVxufSBmcm9tICcuL0NtZEluc3RhbmNlJztcblxuaW1wb3J0IHtcbiAgQm94SGVscGVyXG59IGZyb20gJy4vQm94SGVscGVyJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgU3RyUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgTmFtZXNwYWNlSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgUG9zaXRpb25lZENtZEluc3RhbmNlID0gY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSwgcG9zMSwgc3RyMSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlO1xuICAgIHRoaXMucG9zID0gcG9zMTtcbiAgICB0aGlzLnN0ciA9IHN0cjE7XG4gICAgaWYgKCF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgdGhpcy5fY2hlY2tDbG9zZXIoKTtcbiAgICAgIHRoaXMub3BlbmluZyA9IHRoaXMuc3RyO1xuICAgICAgdGhpcy5ub0JyYWNrZXQgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKTtcbiAgICAgIHRoaXMuX3NwbGl0Q29tcG9uZW50cygpO1xuICAgICAgdGhpcy5fZmluZENsb3NpbmcoKTtcbiAgICAgIHRoaXMuX2NoZWNrRWxvbmdhdGVkKCk7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrQ2xvc2VyKCkge1xuICAgIHZhciBmLCBub0JyYWNrZXQ7XG4gICAgbm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cik7XG4gICAgaWYgKG5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgJiYgKGYgPSB0aGlzLl9maW5kT3BlbmluZ1BvcygpKSkge1xuICAgICAgdGhpcy5jbG9zaW5nUG9zID0gbmV3IFN0clBvcyh0aGlzLnBvcywgdGhpcy5zdHIpO1xuICAgICAgdGhpcy5wb3MgPSBmLnBvcztcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IGYuc3RyO1xuICAgIH1cbiAgfVxuXG4gIF9maW5kT3BlbmluZ1BvcygpIHtcbiAgICB2YXIgY2xvc2luZywgY21kTmFtZSwgZiwgb3BlbmluZztcbiAgICBjbWROYW1lID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cikuc3Vic3RyaW5nKHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCk7XG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWU7XG4gICAgY2xvc2luZyA9IHRoaXMuc3RyO1xuICAgIGlmIChmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zLCBvcGVuaW5nLCBjbG9zaW5nLCAtMSkpIHtcbiAgICAgIGYuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihmLnBvcywgdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcyArIGYuc3RyLmxlbmd0aCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKTtcbiAgICAgIHJldHVybiBmO1xuICAgIH1cbiAgfVxuXG4gIF9zcGxpdENvbXBvbmVudHMoKSB7XG4gICAgdmFyIHBhcnRzO1xuICAgIHBhcnRzID0gdGhpcy5ub0JyYWNrZXQuc3BsaXQoXCIgXCIpO1xuICAgIHRoaXMuY21kTmFtZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHRoaXMucmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIik7XG4gIH1cblxuICBfcGFyc2VQYXJhbXMocGFyYW1zKSB7XG4gICAgdmFyIGFsbG93ZWROYW1lZCwgY2hyLCBpLCBpblN0ciwgaiwgbmFtZSwgbmFtZVRvUGFyYW0sIHBhcmFtLCByZWY7XG4gICAgdGhpcy5wYXJhbXMgPSBbXTtcbiAgICB0aGlzLm5hbWVkID0gdGhpcy5nZXREZWZhdWx0cygpO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBuYW1lVG9QYXJhbSA9IHRoaXMuZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpO1xuICAgICAgaWYgKG5hbWVUb1BhcmFtICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5uYW1lZFtuYW1lVG9QYXJhbV0gPSB0aGlzLmNtZE5hbWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJhbXMubGVuZ3RoKSB7XG4gICAgICBhbGxvd2VkTmFtZWQgPSB0aGlzLmdldE9wdGlvbignYWxsb3dlZE5hbWVkJyk7XG4gICAgICBpblN0ciA9IGZhbHNlO1xuICAgICAgcGFyYW0gPSAnJztcbiAgICAgIG5hbWUgPSBmYWxzZTtcbiAgICAgIGZvciAoaSA9IGogPSAwLCByZWYgPSBwYXJhbXMubGVuZ3RoIC0gMTsgKDAgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGkgPSAwIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgICBjaHIgPSBwYXJhbXNbaV07XG4gICAgICAgIGlmIChjaHIgPT09ICcgJyAmJiAhaW5TdHIpIHtcbiAgICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgdGhpcy5uYW1lZFtuYW1lXSA9IHBhcmFtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcy5wdXNoKHBhcmFtKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyYW0gPSAnJztcbiAgICAgICAgICBuYW1lID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoKGNociA9PT0gJ1wiJyB8fCBjaHIgPT09IFwiJ1wiKSAmJiAoaSA9PT0gMCB8fCBwYXJhbXNbaSAtIDFdICE9PSAnXFxcXCcpKSB7XG4gICAgICAgICAgaW5TdHIgPSAhaW5TdHI7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hyID09PSAnOicgJiYgIW5hbWUgJiYgIWluU3RyICYmICgoYWxsb3dlZE5hbWVkID09IG51bGwpIHx8IGluZGV4T2YuY2FsbChhbGxvd2VkTmFtZWQsIHBhcmFtKSA+PSAwKSkge1xuICAgICAgICAgIG5hbWUgPSBwYXJhbTtcbiAgICAgICAgICBwYXJhbSA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmFtICs9IGNocjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBhcmFtLmxlbmd0aCkge1xuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm5hbWVkW25hbWVdID0gcGFyYW07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1zLnB1c2gocGFyYW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRDbG9zaW5nKCkge1xuICAgIHZhciBmO1xuICAgIGlmIChmID0gdGhpcy5fZmluZENsb3NpbmdQb3MoKSkge1xuICAgICAgdGhpcy5jb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgZi5wb3MpKTtcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGYucG9zICsgZi5zdHIubGVuZ3RoKTtcbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmdQb3MoKSB7XG4gICAgdmFyIGNsb3NpbmcsIGYsIG9wZW5pbmc7XG4gICAgaWYgKHRoaXMuY2xvc2luZ1BvcyAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUG9zO1xuICAgIH1cbiAgICBjbG9zaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZE5hbWUgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY21kTmFtZTtcbiAgICBpZiAoZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgb3BlbmluZywgY2xvc2luZykpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3MgPSBmO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Vsb25nYXRlZCgpIHtcbiAgICB2YXIgZW5kUG9zLCBtYXgsIHJlZjtcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpO1xuICAgIG1heCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKTtcbiAgICB3aGlsZSAoZW5kUG9zIDwgbWF4ICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5kZWNvKSB7XG4gICAgICBlbmRQb3MgKz0gdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKGVuZFBvcyA+PSBtYXggfHwgKChyZWYgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkpID09PSAnICcgfHwgcmVmID09PSBcIlxcblwiIHx8IHJlZiA9PT0gXCJcXHJcIikpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGVuZFBvcyk7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrQm94KCkge1xuICAgIHZhciBjbCwgY3IsIGVuZFBvcztcbiAgICBpZiAoKHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSAmJiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuY21kLm5hbWUgPT09ICdjb21tZW50Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjbCA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKTtcbiAgICBjciA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCk7XG4gICAgZW5kUG9zID0gdGhpcy5nZXRFbmRQb3MoKSArIGNyLmxlbmd0aDtcbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyAtIGNsLmxlbmd0aCwgdGhpcy5wb3MpID09PSBjbCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyAtIGNyLmxlbmd0aCwgZW5kUG9zKSA9PT0gY3IpIHtcbiAgICAgIHRoaXMucG9zID0gdGhpcy5wb3MgLSBjbC5sZW5ndGg7XG4gICAgICB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGVuZFBvcyk7XG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgJiYgdGhpcy5nZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xKSB7XG4gICAgICB0aGlzLmluQm94ID0gMTtcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCkge1xuICAgIHZhciBlY2wsIGVjciwgZWQsIHJlMSwgcmUyLCByZTM7XG4gICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpO1xuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKTtcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvZGV3YXZlLmRlY28pO1xuICAgICAgcmUxID0gbmV3IFJlZ0V4cChgXlxcXFxzKiR7ZWNsfSg/OiR7ZWR9KStcXFxccyooLio/KVxcXFxzKig/OiR7ZWR9KSske2Vjcn0kYCwgXCJnbVwiKTtcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoYF5cXFxccyooPzoke2VkfSkqJHtlY3J9XFxyP1xcbmApO1xuICAgICAgcmUzID0gbmV3IFJlZ0V4cChgXFxuXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzKiRgKTtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRlbnQucmVwbGFjZShyZTEsICckMScpLnJlcGxhY2UocmUyLCAnJykucmVwbGFjZShyZTMsICcnKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0UGFyZW50Q21kcygpIHtcbiAgICB2YXIgcmVmO1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9IChyZWYgPSB0aGlzLmNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZCh0aGlzLmdldEVuZFBvcygpKSkgIT0gbnVsbCA/IHJlZi5pbml0KCkgOiB2b2lkIDA7XG4gIH1cblxuICBzZXRNdWx0aVBvcyhtdWx0aVBvcykge1xuICAgIHJldHVybiB0aGlzLm11bHRpUG9zID0gbXVsdGlQb3M7XG4gIH1cblxuICBfZ2V0Q21kT2JqKCkge1xuICAgIHRoaXMuZ2V0Q21kKCk7XG4gICAgdGhpcy5fY2hlY2tCb3goKTtcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnJlbW92ZUluZGVudEZyb21Db250ZW50KHRoaXMuY29udGVudCk7XG4gICAgcmV0dXJuIHN1cGVyLl9nZXRDbWRPYmooKTtcbiAgfVxuXG4gIF9pbml0UGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJzZVBhcmFtcyh0aGlzLnJhd1BhcmFtcyk7XG4gIH1cblxuICBnZXRDb250ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQgfHwgdGhpcy5jb2Rld2F2ZS5jb250ZXh0O1xuICB9XG5cbiAgZ2V0Q21kKCkge1xuICAgIGlmICh0aGlzLmNtZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9nZXRQYXJlbnRDbWRzKCk7XG4gICAgICBpZiAodGhpcy5ub0JyYWNrZXQuc3Vic3RyaW5nKDAsIHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpIHtcbiAgICAgICAgdGhpcy5jbWQgPSBDb21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jb2Rld2F2ZS5jb250ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmZpbmRlci5jb250ZXh0O1xuICAgICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKTtcbiAgICAgICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZVNwYWNlKHRoaXMuY21kLmZ1bGxOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jbWQ7XG4gIH1cblxuICBnZXRGaW5kZXIoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXI7XG4gICAgZmluZGVyID0gdGhpcy5jb2Rld2F2ZS5jb250ZXh0LmdldEZpbmRlcihjbWROYW1lLCB7XG4gICAgICBuYW1lc3BhY2VzOiB0aGlzLl9nZXRQYXJlbnROYW1lc3BhY2VzKClcbiAgICB9KTtcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzO1xuICAgIHJldHVybiBmaW5kZXI7XG4gIH1cblxuICBfZ2V0UGFyZW50TmFtZXNwYWNlcygpIHtcbiAgICB2YXIgbnNwY3MsIG9iajtcbiAgICBuc3BjcyA9IFtdO1xuICAgIG9iaiA9IHRoaXM7XG4gICAgd2hpbGUgKG9iai5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgb2JqID0gb2JqLnBhcmVudDtcbiAgICAgIGlmICgob2JqLmNtZCAhPSBudWxsKSAmJiAob2JqLmNtZC5mdWxsTmFtZSAhPSBudWxsKSkge1xuICAgICAgICBuc3Bjcy5wdXNoKG9iai5jbWQuZnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnNwY3M7XG4gIH1cblxuICBfcmVtb3ZlQnJhY2tldChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoLCBzdHIubGVuZ3RoIC0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk7XG4gIH1cblxuICBhbHRlckFsaWFzT2YoYWxpYXNPZikge1xuICAgIHZhciBjbWROYW1lLCBuc3BjO1xuICAgIFtuc3BjLCBjbWROYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdCh0aGlzLmNtZE5hbWUpO1xuICAgIHJldHVybiBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIGNtZE5hbWUpO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdHIgPT09IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzIHx8IHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHZhciBiZWZvcmVGdW5jdCwgcmVzO1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgaWYgKCh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCAhPSBudWxsKSAmJiAodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAud2hpdGhpbk9wZW5Cb3VuZHModGhpcy5wb3MgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKSAhPSBudWxsKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAuY2FuY2VsKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aCgnJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAoYmVmb3JlRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpKSB7XG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucmVzdWx0SXNBdmFpbGFibGUoKSkge1xuICAgICAgICBpZiAoKHJlcyA9IHRoaXMucmVzdWx0KCkpICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aChyZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5FeGVjdXRlRnVuY3QoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRFbmRQb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoO1xuICB9XG5cbiAgZ2V0UG9zKCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCkud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcik7XG4gIH1cblxuICBnZXRPcGVuaW5nUG9zKCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMub3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICB9XG5cbiAgZ2V0SW5kZW50KCkge1xuICAgIHZhciBoZWxwZXI7XG4gICAgaWYgKHRoaXMuaW5kZW50TGVuID09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkpLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gdGhpcy5wb3MgLSB0aGlzLmdldFBvcygpLnByZXZFT0woKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5kZW50TGVuO1xuICB9XG5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGV4dCkge1xuICAgIHZhciByZWc7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycgKyB0aGlzLmdldEluZGVudCgpICsgJ30nLCAnZ20nKTtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIGFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpIHtcbiAgICB2YXIgYm94LCBoZWxwZXIsIG9yaWdpbmFsLCByZXM7XG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKTtcbiAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dCk7XG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksIGZhbHNlKTtcbiAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3JlcGxhY2VCb3gnKSkge1xuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbCk7XG4gICAgICBbcmVwbC5zdGFydCwgcmVwbC5lbmRdID0gW2JveC5zdGFydCwgYm94LmVuZF07XG4gICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5pbmRlbnQ7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKCk7XG4gICAgICByZXBsLmVuZCA9IG9yaWdpbmFsLm5leHRFT0woKTtcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyB0aGlzLmNvZGV3YXZlLm1hcmtlciArIG9yaWdpbmFsLnNhbWVMaW5lc1N1ZmZpeCgpLCB7XG4gICAgICAgIG11bHRpbGluZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgW3JlcGwucHJlZml4LCByZXBsLnRleHQsIHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdCh0aGlzLmNvZGV3YXZlLm1hcmtlcik7XG4gICAgfVxuICAgIHJldHVybiByZXBsO1xuICB9XG5cbiAgZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcDtcbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpO1xuICAgIGlmICgodGhpcy5jbWQgIT0gbnVsbCkgJiYgdGhpcy5jb2Rld2F2ZS5jaGVja0NhcnJldCAmJiB0aGlzLmdldE9wdGlvbignY2hlY2tDYXJyZXQnKSkge1xuICAgICAgaWYgKChwID0gdGhpcy5jb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSkgIT0gbnVsbCkge1xuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0ICsgcmVwbC5wcmVmaXgubGVuZ3RoICsgcDtcbiAgICAgIH1cbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHJlcGwudGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBjdXJzb3JQb3M7XG4gIH1cblxuICBjaGVja011bHRpKHJlcGwpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXdSZXBsLCBvcmlnaW5hbFBvcywgb3JpZ2luYWxUZXh0LCBwb3MsIHJlZiwgcmVwbGFjZW1lbnRzO1xuICAgIGlmICgodGhpcy5tdWx0aVBvcyAhPSBudWxsKSAmJiB0aGlzLm11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJlcGxhY2VtZW50cyA9IFtyZXBsXTtcbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KCk7XG4gICAgICByZWYgPSB0aGlzLm11bHRpUG9zO1xuICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgcG9zID0gcmVmW2ldO1xuICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgIG9yaWdpbmFsUG9zID0gcG9zLnN0YXJ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1JlcGwgPSByZXBsLmNvcHkoKS5hcHBseU9mZnNldChwb3Muc3RhcnQgLSBvcmlnaW5hbFBvcyk7XG4gICAgICAgICAgaWYgKG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT09IG9yaWdpbmFsVGV4dCkge1xuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW3JlcGxdO1xuICAgIH1cbiAgfVxuXG4gIHJlcGxhY2VXaXRoKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudCh0aGlzLnBvcywgdGhpcy5nZXRFbmRQb3MoKSwgdGV4dCkpO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcmVwbGFjZW1lbnRzO1xuICAgIHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcik7XG4gICAgaWYgKHRoaXMuaW5Cb3ggIT0gbnVsbCkge1xuICAgICAgdGhpcy5hbHRlclJlc3VsdEZvckJveChyZXBsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpO1xuICAgIH1cbiAgICBjdXJzb3JQb3MgPSB0aGlzLmdldEN1cnNvckZyb21SZXN1bHQocmVwbCk7XG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBQb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXTtcbiAgICByZXBsYWNlbWVudHMgPSB0aGlzLmNoZWNrTXVsdGkocmVwbCk7XG4gICAgdGhpcy5yZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0O1xuICAgIHRoaXMucmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKCk7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBQcm9jZXNzXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICMiLCJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vTG9nZ2VyJztcblxuZXhwb3J0IGNsYXNzIFN0b3JhZ2VcbiAgY29uc3RydWN0b3I6IChAZW5naW5lKSAtPlxuXG4gIHNhdmU6IChrZXksdmFsKSAtPlxuICAgIGlmIEBlbmdpbmVBdmFpbGFibGUoKVxuICAgICAgQGVuZ2luZS5zYXZlKGtleSx2YWwpXG5cbiAgc2F2ZUluUGF0aDogKHBhdGgsIGtleSwgdmFsKSAtPlxuICAgIGlmIEBlbmdpbmVBdmFpbGFibGUoKVxuICAgICAgQGVuZ2luZS5zYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKVxuXG4gIGxvYWQ6IChrZXkpIC0+XG4gICAgaWYgQGVuZ2luZT9cbiAgICAgIEBlbmdpbmUubG9hZChrZXkpXG5cbiAgZW5naW5lQXZhaWxhYmxlOiAoKSAtPlxuICAgIGlmIEBlbmdpbmU/XG4gICAgICB0cnVlXG4gICAgZWxzZVxuICAgICAgQGxvZ2dlciA9IEBsb2dnZXIgfHwgbmV3IExvZ2dlcigpXG4gICAgICBAbG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJylcbiAgICAgIGZhbHNlXG4gICAgIiwiaW1wb3J0IHtcbiAgTG9nZ2VyXG59IGZyb20gJy4vTG9nZ2VyJztcblxuZXhwb3J0IHZhciBTdG9yYWdlID0gY2xhc3MgU3RvcmFnZSB7XG4gIGNvbnN0cnVjdG9yKGVuZ2luZSkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICB9XG5cbiAgc2F2ZShrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZShrZXksIHZhbCk7XG4gICAgfVxuICB9XG5cbiAgc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbCk7XG4gICAgfVxuICB9XG5cbiAgbG9hZChrZXkpIHtcbiAgICBpZiAodGhpcy5lbmdpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLmxvYWQoa2V5KTtcbiAgICB9XG4gIH1cblxuICBlbmdpbmVBdmFpbGFibGUoKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlciA9IHRoaXMubG9nZ2VyIHx8IG5ldyBMb2dnZXIoKTtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IGNsYXNzIERvbUtleUxpc3RlbmVyXG4gIHN0YXJ0TGlzdGVuaW5nOiAodGFyZ2V0KSAtPlxuICBcbiAgICB0aW1lb3V0ID0gbnVsbFxuICAgIFxuICAgIG9ua2V5ZG93biA9IChlKSA9PiBcbiAgICAgIGlmIChDb2Rld2F2ZS5pbnN0YW5jZXMubGVuZ3RoIDwgMiBvciBAb2JqID09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIGFuZCBlLmtleUNvZGUgPT0gNjkgJiYgZS5jdHJsS2V5XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBpZiBAb25BY3RpdmF0aW9uS2V5P1xuICAgICAgICAgIEBvbkFjdGl2YXRpb25LZXkoKVxuICAgIG9ua2V5dXAgPSAoZSkgPT4gXG4gICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgIG9ua2V5cHJlc3MgPSAoZSkgPT4gXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCkgaWYgdGltZW91dD9cbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0ICg9PlxuICAgICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgICAgQG9uQW55Q2hhbmdlKGUpXG4gICAgICApLCAxMDBcbiAgICAgICAgICAgIFxuICAgIGlmIHRhcmdldC5hZGRFdmVudExpc3RlbmVyXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuICAgIGVsc2UgaWYgdGFyZ2V0LmF0dGFjaEV2ZW50XG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuXG5pc0VsZW1lbnQgPSAob2JqKSAtPlxuICB0cnlcbiAgICAjIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tKVxuICAgIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gIGNhdGNoIGVcbiAgICAjIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAjIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAjIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcbiAgICByZXR1cm4gKHR5cGVvZiBvYmo9PVwib2JqZWN0XCIpICYmXG4gICAgICAob2JqLm5vZGVUeXBlPT0xKSAmJiAodHlwZW9mIG9iai5zdHlsZSA9PSBcIm9iamVjdFwiKSAmJlxuICAgICAgKHR5cGVvZiBvYmoub3duZXJEb2N1bWVudCA9PVwib2JqZWN0XCIpXG5cbiAgICAgICAgXG5leHBvcnQgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyXG4gIGNvbnN0cnVjdG9yOiAoQHRhcmdldCkgLT5cbiAgICBzdXBlcigpXG4gICAgQG9iaiA9IGlmIGlzRWxlbWVudChAdGFyZ2V0KSB0aGVuIEB0YXJnZXQgZWxzZSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChAdGFyZ2V0KVxuICAgIHVubGVzcyBAb2JqP1xuICAgICAgdGhyb3cgXCJUZXh0QXJlYSBub3QgZm91bmRcIlxuICAgIEBuYW1lc3BhY2UgPSAndGV4dGFyZWEnXG4gICAgQGNoYW5nZUxpc3RlbmVycyA9IFtdXG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgPSAwXG4gIHN0YXJ0TGlzdGVuaW5nOiBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmdcbiAgb25BbnlDaGFuZ2U6IChlKSAtPlxuICAgIGlmIEBfc2tpcENoYW5nZUV2ZW50IDw9IDBcbiAgICAgIGZvciBjYWxsYmFjayBpbiBAY2hhbmdlTGlzdGVuZXJzXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICBlbHNlXG4gICAgICBAX3NraXBDaGFuZ2VFdmVudC0tXG4gICAgICBAb25Ta2lwZWRDaGFuZ2UoKSBpZiBAb25Ta2lwZWRDaGFuZ2U/XG4gIHNraXBDaGFuZ2VFdmVudDogKG5iID0gMSkgLT5cbiAgICBAX3NraXBDaGFuZ2VFdmVudCArPSBuYlxuICBiaW5kZWRUbzogKGNvZGV3YXZlKSAtPlxuICAgIEBvbkFjdGl2YXRpb25LZXkgPSAtPiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKVxuICAgIEBzdGFydExpc3RlbmluZyhkb2N1bWVudClcbiAgc2VsZWN0aW9uUHJvcEV4aXN0czogLT5cbiAgICBcInNlbGVjdGlvblN0YXJ0XCIgb2YgQG9ialxuICBoYXNGb2N1czogLT4gXG4gICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpcyBAb2JqXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgaWYgdmFsP1xuICAgICAgdW5sZXNzIEB0ZXh0RXZlbnRDaGFuZ2UodmFsKVxuICAgICAgICBAb2JqLnZhbHVlID0gdmFsXG4gICAgQG9iai52YWx1ZVxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICBAdGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIG9yIEBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0LCBlbmQpIG9yIHN1cGVyKHN0YXJ0LCBlbmQsIHRleHQpXG4gIHRleHRFdmVudENoYW5nZTogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUZXh0RXZlbnQnKSBpZiBkb2N1bWVudC5jcmVhdGVFdmVudD9cbiAgICBpZiBldmVudD8gYW5kIGV2ZW50LmluaXRUZXh0RXZlbnQ/IGFuZCBldmVudC5pc1RydXN0ZWQgIT0gZmFsc2VcbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIGlmIHRleHQubGVuZ3RoIDwgMVxuICAgICAgICBpZiBzdGFydCAhPSAwXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LTEsc3RhcnQpXG4gICAgICAgICAgc3RhcnQtLVxuICAgICAgICBlbHNlIGlmIGVuZCAhPSBAdGV4dExlbigpXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKGVuZCxlbmQrMSlcbiAgICAgICAgICBlbmQrK1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICBldmVudC5pbml0VGV4dEV2ZW50KCd0ZXh0SW5wdXQnLCB0cnVlLCB0cnVlLCBudWxsLCB0ZXh0LCA5KVxuICAgICAgIyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIEBvYmouZGlzcGF0Y2hFdmVudChldmVudClcbiAgICAgIEBza2lwQ2hhbmdlRXZlbnQoKVxuICAgICAgdHJ1ZVxuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kOiAodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSAtPlxuICAgIGlmIGRvY3VtZW50LmV4ZWNDb21tYW5kP1xuICAgICAgZW5kID0gQHRleHRMZW4oKSB1bmxlc3MgZW5kP1xuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dCk7XG4gICAgZWxzZSBcbiAgICAgIGZhbHNlXG5cbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdG1wQ3Vyc29yUG9zIGlmIEB0bXBDdXJzb3JQb3M/XG4gICAgaWYgQGhhc0ZvY3VzXG4gICAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgICBuZXcgUG9zKEBvYmouc2VsZWN0aW9uU3RhcnQsQG9iai5zZWxlY3Rpb25FbmQpXG4gICAgICBlbHNlXG4gICAgICAgIEBnZXRDdXJzb3JQb3NGYWxsYmFjaygpXG4gIGdldEN1cnNvclBvc0ZhbGxiYWNrOiAtPlxuICAgIGlmIEBvYmouY3JlYXRlVGV4dFJhbmdlXG4gICAgICBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKVxuICAgICAgaWYgc2VsLnBhcmVudEVsZW1lbnQoKSBpcyBAb2JqXG4gICAgICAgIHJuZyA9IEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcm5nLm1vdmVUb0Jvb2ttYXJrIHNlbC5nZXRCb29rbWFyaygpXG4gICAgICAgIGxlbiA9IDBcblxuICAgICAgICB3aGlsZSBybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDBcbiAgICAgICAgICBsZW4rK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKVxuICAgICAgICBybmcuc2V0RW5kUG9pbnQgXCJTdGFydFRvU3RhcnRcIiwgQG9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgICBwb3MgPSBuZXcgUG9zKDAsbGVuKVxuICAgICAgICB3aGlsZSBybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDBcbiAgICAgICAgICBwb3Muc3RhcnQrK1xuICAgICAgICAgIHBvcy5lbmQrK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKVxuICAgICAgICByZXR1cm4gcG9zXG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgQHRtcEN1cnNvclBvcyA9IG5ldyBQb3Moc3RhcnQsZW5kKVxuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgc2V0VGltZW91dCAoPT5cbiAgICAgICAgQHRtcEN1cnNvclBvcyA9IG51bGxcbiAgICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICApLCAxXG4gICAgZWxzZSBcbiAgICAgIEBzZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKVxuICAgIHJldHVyblxuICBzZXRDdXJzb3JQb3NGYWxsYmFjazogKHN0YXJ0LCBlbmQpIC0+XG4gICAgaWYgQG9iai5jcmVhdGVUZXh0UmFuZ2VcbiAgICAgIHJuZyA9IEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgIHJuZy5tb3ZlU3RhcnQgXCJjaGFyYWN0ZXJcIiwgc3RhcnRcbiAgICAgIHJuZy5jb2xsYXBzZSgpXG4gICAgICBybmcubW92ZUVuZCBcImNoYXJhY3RlclwiLCBlbmQgLSBzdGFydFxuICAgICAgcm5nLnNlbGVjdCgpXG4gIGdldExhbmc6IC0+XG4gICAgcmV0dXJuIEBfbGFuZyBpZiBAX2xhbmdcbiAgICBAb2JqLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJykgaWYgQG9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gICAgQG9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsdmFsKVxuICBjYW5MaXN0ZW5Ub0NoYW5nZTogLT5cbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIEBjaGFuZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjaylcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBpZiAoaSA9IEBjaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykpID4gLTFcbiAgICAgIEBjaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpXG4gICAgICBcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICBpZiByZXBsYWNlbWVudHMubGVuZ3RoID4gMCBhbmQgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMVxuICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbQGdldEN1cnNvclBvcygpXVxuICAgIHN1cGVyKHJlcGxhY2VtZW50cyk7XG4gICAgICAiLCJ2YXIgaXNFbGVtZW50O1xuXG5pbXBvcnQge1xuICBUZXh0UGFyc2VyXG59IGZyb20gJy4vVGV4dFBhcnNlcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCB2YXIgRG9tS2V5TGlzdGVuZXIgPSBjbGFzcyBEb21LZXlMaXN0ZW5lciB7XG4gIHN0YXJ0TGlzdGVuaW5nKHRhcmdldCkge1xuICAgIHZhciBvbmtleWRvd24sIG9ua2V5cHJlc3MsIG9ua2V5dXAsIHRpbWVvdXQ7XG4gICAgdGltZW91dCA9IG51bGw7XG4gICAgb25rZXlkb3duID0gKGUpID0+IHtcbiAgICAgIGlmICgoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgfHwgdGhpcy5vYmogPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpICYmIGUua2V5Q29kZSA9PT0gNjkgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMub25BY3RpdmF0aW9uS2V5ICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFjdGl2YXRpb25LZXkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgb25rZXl1cCA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uQW55Q2hhbmdlKGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgb25rZXlwcmVzcyA9IChlKSA9PiB7XG4gICAgICBpZiAodGltZW91dCAhPSBudWxsKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aW1lb3V0ID0gc2V0VGltZW91dCgoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLCAxMDApO1xuICAgIH07XG4gICAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKTtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cCk7XG4gICAgICByZXR1cm4gdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5hdHRhY2hFdmVudCkge1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlkb3duXCIsIG9ua2V5ZG93bik7XG4gICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApO1xuICAgICAgcmV0dXJuIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcyk7XG4gICAgfVxuICB9XG5cbn07XG5cbmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgZTtcbiAgdHJ5IHtcbiAgICAvLyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIC8vIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAvLyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuICAgIHJldHVybiAodHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIikgJiYgKG9iai5ub2RlVHlwZSA9PT0gMSkgJiYgKHR5cGVvZiBvYmouc3R5bGUgPT09IFwib2JqZWN0XCIpICYmICh0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT09IFwib2JqZWN0XCIpO1xuICB9XG59O1xuXG5leHBvcnQgdmFyIFRleHRBcmVhRWRpdG9yID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBUZXh0QXJlYUVkaXRvciBleHRlbmRzIFRleHRQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldDEpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDE7XG4gICAgICB0aGlzLm9iaiA9IGlzRWxlbWVudCh0aGlzLnRhcmdldCkgPyB0aGlzLnRhcmdldCA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0KTtcbiAgICAgIGlmICh0aGlzLm9iaiA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCI7XG4gICAgICB9XG4gICAgICB0aGlzLm5hbWVzcGFjZSA9ICd0ZXh0YXJlYSc7XG4gICAgICB0aGlzLmNoYW5nZUxpc3RlbmVycyA9IFtdO1xuICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50ID0gMDtcbiAgICB9XG5cbiAgICBvbkFueUNoYW5nZShlKSB7XG4gICAgICB2YXIgY2FsbGJhY2ssIGosIGxlbjEsIHJlZiwgcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPD0gMCkge1xuICAgICAgICByZWYgPSB0aGlzLmNoYW5nZUxpc3RlbmVycztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIGNhbGxiYWNrID0gcmVmW2pdO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjYWxsYmFjaygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudC0tO1xuICAgICAgICBpZiAodGhpcy5vblNraXBlZENoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25Ta2lwZWRDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNraXBDaGFuZ2VFdmVudChuYiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgKz0gbmI7XG4gICAgfVxuXG4gICAgYmluZGVkVG8oY29kZXdhdmUpIHtcbiAgICAgIHRoaXMub25BY3RpdmF0aW9uS2V5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy5zdGFydExpc3RlbmluZyhkb2N1bWVudCk7XG4gICAgfVxuXG4gICAgc2VsZWN0aW9uUHJvcEV4aXN0cygpIHtcbiAgICAgIHJldHVybiBcInNlbGVjdGlvblN0YXJ0XCIgaW4gdGhpcy5vYmo7XG4gICAgfVxuXG4gICAgaGFzRm9jdXMoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5vYmo7XG4gICAgfVxuXG4gICAgdGV4dCh2YWwpIHtcbiAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICBpZiAoIXRoaXMudGV4dEV2ZW50Q2hhbmdlKHZhbCkpIHtcbiAgICAgICAgICB0aGlzLm9iai52YWx1ZSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqLnZhbHVlO1xuICAgIH1cblxuICAgIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHRoaXMuc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSB8fCBzdXBlci5zcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpO1xuICAgIH1cblxuICAgIHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIHZhciBldmVudDtcbiAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RleHRFdmVudCcpO1xuICAgICAgfVxuICAgICAgaWYgKChldmVudCAhPSBudWxsKSAmJiAoZXZlbnQuaW5pdFRleHRFdmVudCAhPSBudWxsKSAmJiBldmVudC5pc1RydXN0ZWQgIT09IGZhbHNlKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICBpZiAoc3RhcnQgIT09IDApIHtcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQgLSAxLCBzdGFydCk7XG4gICAgICAgICAgICBzdGFydC0tO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZW5kICE9PSB0aGlzLnRleHRMZW4oKSkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihlbmQsIGVuZCArIDEpO1xuICAgICAgICAgICAgZW5kKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSk7XG4gICAgICAgIC8vIEBzZXRDdXJzb3JQb3Moc3RhcnQsZW5kKVxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHRoaXMub2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLnNraXBDaGFuZ2VFdmVudCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgICAgaWYgKGRvY3VtZW50LmV4ZWNDb21tYW5kICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgICAgaWYgKHRoaXMudG1wQ3Vyc29yUG9zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG1wQ3Vyc29yUG9zO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaGFzRm9jdXMpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJvcEV4aXN0cykge1xuICAgICAgICAgIHJldHVybiBuZXcgUG9zKHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0LCB0aGlzLm9iai5zZWxlY3Rpb25FbmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldEN1cnNvclBvc0ZhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXJzb3JQb3NGYWxsYmFjaygpIHtcbiAgICAgIHZhciBsZW4sIHBvcywgcm5nLCBzZWw7XG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgICAgICBpZiAoc2VsLnBhcmVudEVsZW1lbnQoKSA9PT0gdGhpcy5vYmopIHtcbiAgICAgICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICBybmcubW92ZVRvQm9va21hcmsoc2VsLmdldEJvb2ttYXJrKCkpO1xuICAgICAgICAgIGxlbiA9IDA7XG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMCkge1xuICAgICAgICAgICAgbGVuKys7XG4gICAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJuZy5zZXRFbmRQb2ludChcIlN0YXJ0VG9TdGFydFwiLCB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKSk7XG4gICAgICAgICAgcG9zID0gbmV3IFBvcygwLCBsZW4pO1xuICAgICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIHBvcy5zdGFydCsrO1xuICAgICAgICAgICAgcG9zLmVuZCsrO1xuICAgICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcG9zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICBlbmQgPSBzdGFydDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG51bGw7XG4gICAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICB9KSwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHZhciBybmc7XG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICBybmcubW92ZVN0YXJ0KFwiY2hhcmFjdGVyXCIsIHN0YXJ0KTtcbiAgICAgICAgcm5nLmNvbGxhcHNlKCk7XG4gICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIGVuZCAtIHN0YXJ0KTtcbiAgICAgICAgcmV0dXJuIHJuZy5zZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYW5nKCkge1xuICAgICAgaWYgKHRoaXMuX2xhbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmc7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmouZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMYW5nKHZhbCkge1xuICAgICAgdGhpcy5fbGFuZyA9IHZhbDtcbiAgICAgIHJldHVybiB0aGlzLm9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsIHZhbCk7XG4gICAgfVxuXG4gICAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmICgoaSA9IHRoaXMuY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5nZUxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKSB7XG4gICAgICBpZiAocmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgJiYgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucyA9IFt0aGlzLmdldEN1cnNvclBvcygpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICAgIH1cblxuICB9O1xuXG4gIFRleHRBcmVhRWRpdG9yLnByb3RvdHlwZS5zdGFydExpc3RlbmluZyA9IERvbUtleUxpc3RlbmVyLnByb3RvdHlwZS5zdGFydExpc3RlbmluZztcblxuICByZXR1cm4gVGV4dEFyZWFFZGl0b3I7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJpbXBvcnQgeyBFZGl0b3IgfSBmcm9tICcuL0VkaXRvcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yXG4gIGNvbnN0cnVjdG9yOiAoQF90ZXh0KSAtPlxuICAgIHN1cGVyKClcbiAgdGV4dDogKHZhbCkgLT5cbiAgICBAX3RleHQgPSB2YWwgaWYgdmFsP1xuICAgIEBfdGV4dFxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHJldHVybiBAdGV4dCgpW3Bvc11cbiAgdGV4dExlbjogKHBvcykgLT5cbiAgICByZXR1cm4gQHRleHQoKS5sZW5ndGhcbiAgdGV4dFN1YnN0cjogKHN0YXJ0LCBlbmQpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICBAdGV4dChAdGV4dCgpLnN1YnN0cmluZygwLCBwb3MpK3RleHQrQHRleHQoKS5zdWJzdHJpbmcocG9zLEB0ZXh0KCkubGVuZ3RoKSlcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHQoQHRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIEB0ZXh0KCkuc2xpY2UoZW5kKSlcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdGFyZ2V0XG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBAdGFyZ2V0ID0gbmV3IFBvcyggc3RhcnQsIGVuZCApIiwiaW1wb3J0IHtcbiAgRWRpdG9yXG59IGZyb20gJy4vRWRpdG9yJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IHZhciBUZXh0UGFyc2VyID0gY2xhc3MgVGV4dFBhcnNlciBleHRlbmRzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKF90ZXh0KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl90ZXh0ID0gX3RleHQ7XG4gIH1cblxuICB0ZXh0KHZhbCkge1xuICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dCA9IHZhbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKVtwb3NdO1xuICB9XG5cbiAgdGV4dExlbihwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkubGVuZ3RoO1xuICB9XG5cbiAgdGV4dFN1YnN0cihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgfVxuXG4gIGluc2VydFRleHRBdCh0ZXh0LCBwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnN1YnN0cmluZygwLCBwb3MpICsgdGV4dCArIHRoaXMudGV4dCgpLnN1YnN0cmluZyhwb3MsIHRoaXMudGV4dCgpLmxlbmd0aCkpO1xuICB9XG5cbiAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIHRoaXMudGV4dCgpLnNsaWNlKGVuZCkpO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnRhcmdldDtcbiAgfVxuXG4gIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBlbmQgPSBzdGFydDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0ID0gbmV3IFBvcyhzdGFydCwgZW5kKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuaW1wb3J0IHsgQ29yZUNvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IEpzQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IFBocENvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9QaHBDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgSHRtbENvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IFdyYXBwZWRQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MnO1xuaW1wb3J0IHsgTG9jYWxTdG9yYWdlRW5naW5lIH0gZnJvbSAnLi9zdG9yYWdlRW5naW5lcy9Mb2NhbFN0b3JhZ2VFbmdpbmUnO1xuXG5Qb3Mud3JhcENsYXNzID0gV3JhcHBlZFBvc1xuXG5Db2Rld2F2ZS5pbnN0YW5jZXMgPSBbXVxuXG5Db21tYW5kLnByb3ZpZGVycyA9IFtcbiAgbmV3IENvcmVDb21tYW5kUHJvdmlkZXIoKVxuICBuZXcgSnNDb21tYW5kUHJvdmlkZXIoKVxuICBuZXcgUGhwQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IEh0bWxDb21tYW5kUHJvdmlkZXIoKVxuXVxuXG5pZiBsb2NhbFN0b3JhZ2U/XG4gIENvbW1hbmQuc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2VFbmdpbmUoKVxuXG5leHBvcnQgeyBDb2Rld2F2ZSB9IiwiaW1wb3J0IHtcbiAgQ29kZXdhdmVcbn0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgQ29yZUNvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIEpzQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9Kc0NvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIFBocENvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgSHRtbENvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFdyYXBwZWRQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9XcmFwcGVkUG9zJztcblxuaW1wb3J0IHtcbiAgTG9jYWxTdG9yYWdlRW5naW5lXG59IGZyb20gJy4vc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lJztcblxuUG9zLndyYXBDbGFzcyA9IFdyYXBwZWRQb3M7XG5cbkNvZGV3YXZlLmluc3RhbmNlcyA9IFtdO1xuXG5Db21tYW5kLnByb3ZpZGVycyA9IFtuZXcgQ29yZUNvbW1hbmRQcm92aWRlcigpLCBuZXcgSnNDb21tYW5kUHJvdmlkZXIoKSwgbmV3IFBocENvbW1hbmRQcm92aWRlcigpLCBuZXcgSHRtbENvbW1hbmRQcm92aWRlcigpXTtcblxuaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlICE9PSBudWxsKSB7XG4gIENvbW1hbmQuc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2VFbmdpbmUoKTtcbn1cblxuZXhwb3J0IHtcbiAgQ29kZXdhdmVcbn07XG4iLCJcbmltcG9ydCB7IENvbW1hbmQsIEJhc2VDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMYW5nRGV0ZWN0b3IgfSBmcm9tICcuLi9EZXRlY3Rvcic7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuLi9Cb3hIZWxwZXInO1xuaW1wb3J0IHsgRWRpdENtZFByb3AgfSBmcm9tICcuLi9FZGl0Q21kUHJvcCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBQYXRoSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9QYXRoSGVscGVyJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgY2xhc3MgQ29yZUNvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjb3JlJykpXG4gIGNvcmUuYWRkRGV0ZWN0b3IobmV3IExhbmdEZXRlY3RvcigpKVxuICBcbiAgY29yZS5hZGRDbWRzKHtcbiAgICAnaGVscCc6e1xuICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICdyZXN1bHQnIDogaGVscCxcbiAgICAgICdwYXJzZScgOiB0cnVlLFxuICAgICAgJ2FsbG93ZWROYW1lZCcgOiBbJ2NtZCddLFxuICAgICAgJ2hlbHAnIDogXCJcIlwiXG4gICAgICAgIFRvIGdldCBoZWxwIG9uIGEgcGVjaWZpYyBjb21tYW5kLCBkbyA6XG4gICAgICAgIH5+aGVscCBoZWxsb35+IChoZWxsbyBiZWluZyB0aGUgY29tbWFuZClcbiAgICAgICAgXCJcIlwiIFxuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnb3ZlcnZpZXcnOntcbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICAgIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXG4gICAgICAgICAgICAgLyBfX3xfX18gIF9ffCB8X19cXFxcIFxcXFwgICAgLyAvXyBfX18gX19fX19fXG4gICAgICAgICAgICAvIC9fXy8gXyBcXFxcLyBfYCAvIC1fXFxcXCBcXFxcL1xcXFwvIC8gX2AgXFxcXCBWIC8gLV8vXG4gICAgICAgICAgICBcXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XG4gICAgICAgICAgICBUaGUgdGV4dCBlZGl0b3IgaGVscGVyXG4gICAgICAgICAgICB+fi9xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBXaGVuIHVzaW5nIENvZGV3YXZlIHlvdSB3aWxsIGJlIHdyaXRpbmcgY29tbWFuZHMgd2l0aGluIFxuICAgICAgICAgICAgeW91ciB0ZXh0IGVkaXRvci4gVGhlc2UgY29tbWFuZHMgbXVzdCBiZSBwbGFjZWQgYmV0d2VlbiB0d28gXG4gICAgICAgICAgICBwYWlycyBvZiBcIn5cIiAodGlsZGUpIGFuZCB0aGVuLCB0aGV5IGNhbiBiZSBleGVjdXRlZCBieSBwcmVzc2luZyBcbiAgICAgICAgICAgIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiwgd2l0aCB5b3VyIGN1cnNvciBpbnNpZGUgdGhlIGNvbW1hbmRcbiAgICAgICAgICAgIEV4OiB+fiFoZWxsb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFlvdSBkb250IG5lZWQgdG8gYWN0dWFsbHkgdHlwZSBhbnkgXCJ+XCIgKHRpbGRlKS4gXG4gICAgICAgICAgICBQcmVzc2luZyBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XG4gICAgICAgICAgICB3aXRoaW4gYSBjb21tYW5kLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxuICAgICAgICAgICAgSW5zdGVhZCwgaXQgdXNlcyB0ZXh0IHdpdGhpbiBjb2RlIGNvbW1lbnRzIHRvIG1pbWljIFVJcy4gXG4gICAgICAgICAgICBUaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcbiAgICAgICAgICAgIGluIHRoZSBoZWxwIHNlY3Rpb25zLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBUbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXG4gICAgICAgICAgICBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBVc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcbiAgICAgICAgICAgIGZlYXR1cmVzIG9mIENvZGV3YXZlXG4gICAgICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgTGlzdCBvZiBhbGwgaGVscCBzdWJqZWN0cyBcbiAgICAgICAgICAgIH5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fiFjbG9zZX5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ3N1YmplY3RzJzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn4haGVscH5+XG4gICAgICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxuICAgICAgICAgICAgfn4haGVscDpzdWJqZWN0c35+ICh+fiFoZWxwOnN1Yn5+KVxuICAgICAgICAgICAgfn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnc3ViJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpzdWJqZWN0cydcbiAgICAgICAgfVxuICAgICAgICAnZ2V0X3N0YXJ0ZWQnOntcbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICBUaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cbiAgICAgICAgICAgIH5+IWhlbGxvfH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+aGVscDplZGl0aW5nOmludHJvfn5cbiAgICAgICAgICAgIH5+cXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcbiAgICAgICAgICAgIH5+IWhlbHA6ZWRpdGluZ35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxuICAgICAgICAgICAgb2YgSmF2YVNjcmlwdCBhYmJyZXZpYXRpb25zXG4gICAgICAgICAgICB+fiFqczpmfn5cbiAgICAgICAgICAgIH5+IWpzOmlmfn5cbiAgICAgICAgICAgICAgfn4hanM6bG9nfn5cIn5+IWhlbGxvfn5cIn5+IS9qczpsb2d+flxuICAgICAgICAgICAgfn4hL2pzOmlmfn5cbiAgICAgICAgICAgIH5+IS9qczpmfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxuICAgICAgICAgICAgcHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuIEVtbWV0IGFiYnJldmlhdGlvbnMgd2lsbCBiZSBcbiAgICAgICAgICAgIHVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cbiAgICAgICAgICAgIH5+IXVsPmxpfn4gKGlmIHlvdSBhcmUgaW4gYSBodG1sIGRvY2N1bWVudClcbiAgICAgICAgICAgIH5+IWVtbWV0IHVsPmxpfn5cbiAgICAgICAgICAgIH5+IWVtbWV0IG0yIGNzc35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvbW1hbmRzIGFyZSBzdG9yZWQgaW4gbmFtZXNwYWNlcy4gVGhlIHNhbWUgY29tbWFuZCBjYW4gaGF2ZSBcbiAgICAgICAgICAgIGRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxuICAgICAgICAgICAgfn4hanM6ZWFjaH5+XG4gICAgICAgICAgICB+fiFwaHA6b3V0ZXI6ZWFjaH5+XG4gICAgICAgICAgICB+fiFwaHA6aW5uZXI6ZWFjaH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFNvbWUgb2YgdGhlIG5hbWVzcGFjZXMgYXJlIGFjdGl2ZSBkZXBlbmRpbmcgb24gdGhlIGNvbnRleHQuIFRoZVxuICAgICAgICAgICAgZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcbiAgICAgICAgICAgIGFjdGl2ZSBuYW1lc3BhY2UuIFRoZSBmaXJzdCBjb21tYW5kIGNvbW1hbmQgd29ya3MgYmVjYXVzZSB0aGUgXG4gICAgICAgICAgICBjb3JlIG5hbWVzcGFjZSBpcyBhY3RpdmUuXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2V+flxuICAgICAgICAgICAgfn4hY29yZTpuYW1lc3BhY2V+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBZb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlIHBocH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2V+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBJbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXG4gICAgICAgICAgICBjb250ZXh0IGZyb20gdGhlIHN1cnJvdW5kaW5nIHRleHQuIEluIGEgUEhQIGZpbGUsIGl0IG1lYW5zIENvZGV3YXZlIFxuICAgICAgICAgICAgd2lsbCBhZGQgdGhlIFBIUCB0YWdzIHdoZW4geW91IG5lZWQgdGhlbS5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ2RlbW8nOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmdldF9zdGFydGVkJ1xuICAgICAgICB9XG4gICAgICAgICdlZGl0aW5nJzp7XG4gICAgICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAgICAgJ2ludHJvJzp7XG4gICAgICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICAgICAgQ29kZXdhdmUgYWxsb3dzIHlvdSB0byBtYWtlIHlvdXIgb3duIGNvbW1hbmRzIChvciBhYmJyZXZpYXRpb25zKSBcbiAgICAgICAgICAgICAgICBwdXQgeW91ciBjb250ZW50IGluc2lkZSBcInNvdXJjZVwiIHRoZSBkbyBcInNhdmVcIi4gVHJ5IGFkZGluZyBhbnkgXG4gICAgICAgICAgICAgICAgdGV4dCB0aGF0IGlzIG9uIHlvdXIgbWluZC5cbiAgICAgICAgICAgICAgICB+fiFlZGl0IG15X25ld19jb21tYW5kfH5+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgSWYgeW91IGRpZCB0aGUgbGFzdCBzdGVwIHJpZ2h0LCB5b3Ugc2hvdWxkIHNlZSB5b3VyIHRleHQgd2hlbiB5b3VcbiAgICAgICAgICAgICAgICBkbyB0aGUgZm9sbG93aW5nIGNvbW1hbmQuIEl0IGlzIG5vdyBzYXZlZCBhbmQgeW91IGNhbiB1c2UgaXQgXG4gICAgICAgICAgICAgICAgd2hlbmV2ZXIgeW91IHdhbnQuXG4gICAgICAgICAgICAgICAgfn4hbXlfbmV3X2NvbW1hbmR+flxuICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICB+fmhlbHA6ZWRpdGluZzppbnRyb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEFsbCB0aGUgd2luZG93cyBvZiBDb2Rld2F2ZSBhcmUgbWFkZSB3aXRoIHRoZSBjb21tYW5kIFwiYm94XCIuIFxuICAgICAgICAgICAgVGhleSBhcmUgbWVhbnQgdG8gZGlzcGxheSB0ZXh0IHRoYXQgc2hvdWxkIG5vdCByZW1haW4gaW4geW91ciBjb2RlLiBcbiAgICAgICAgICAgIFRoZXkgYXJlIHZhbGlkIGNvbW1lbnRzIHNvIHRoZXkgd29uJ3QgYnJlYWsgeW91ciBjb2RlIGFuZCB0aGUgY29tbWFuZCBcbiAgICAgICAgICAgIFwiY2xvc2VcIiBjYW4gYmUgdXNlZCB0byByZW1vdmUgdGhlbSByYXBpZGx5LiBZb3UgY2FuIG1ha2UgeW91ciBvd24gXG4gICAgICAgICAgICBjb21tYW5kcyB3aXRoIHRoZW0gaWYgeW91IG5lZWQgdG8gZGlzcGxheSBzb21lIHRleHQgdGVtcG9yYXJpbHkuXG4gICAgICAgICAgICB+fiFib3h+flxuICAgICAgICAgICAgVGhlIGJveCB3aWxsIHNjYWxlIHdpdGggdGhlIGNvbnRlbnQgeW91IHB1dCBpbiBpdFxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+IS9ib3h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICBXaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxuICAgICAgICAgICAgd2lsbCBiZSBsb2NhdGVkIG9uY2UgdGhlIGNvbW1hbmQgaXMgZXhwYW5kZWQuIFRvIGRvIHRoYXQsIHVzZSBhIFwifFwiIFxuICAgICAgICAgICAgKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcbiAgICAgICAgICAgIGNoYXJhY3Rlci5cbiAgICAgICAgICAgIH5+IWJveH5+XG4gICAgICAgICAgICBvbmUgOiB8IFxuICAgICAgICAgICAgdHdvIDogfHxcbiAgICAgICAgICAgIH5+IS9ib3h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBZb3UgY2FuIGFsc28gdXNlIHRoZSBcImVzY2FwZV9waXBlc1wiIGNvbW1hbmQgdGhhdCB3aWxsIGVzY2FwZSBhbnkgXG4gICAgICAgICAgICB2ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xuICAgICAgICAgICAgfn4hZXNjYXBlX3BpcGVzfn5cbiAgICAgICAgICAgIHxcbiAgICAgICAgICAgIH5+IS9lc2NhcGVfcGlwZXN+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb21tYW5kcyBpbnNpZGUgb3RoZXIgY29tbWFuZHMgd2lsbCBiZSBleHBhbmRlZCBhdXRvbWF0aWNhbGx5LlxuICAgICAgICAgICAgSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxuICAgICAgICAgICAgdGhlIHBhcmVudCBjb21tYW5kIGlzIGV4cGFuZGVkLCB1c2UgYSBcIiFcIiAoZXhjbGFtYXRpb24gbWFyaykuXG4gICAgICAgICAgICB+fiEhaGVsbG9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBGb3IgY29tbWFuZHMgdGhhdCBoYXZlIGJvdGggYW4gb3BlbmluZyBhbmQgYSBjbG9zaW5nIHRhZywgeW91IGNhbiB1c2VcbiAgICAgICAgICAgIHRoZSBcImNvbnRlbnRcIiBjb21tYW5kLiBcImNvbnRlbnRcIiB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRleHRcbiAgICAgICAgICAgIHRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cbiAgICAgICAgICAgIH5+IWVkaXQgcGhwOmlubmVyOmlmfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ2VkaXQnOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmVkaXRpbmcnXG4gICAgICAgIH1cbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgfSxcbiAgICAnbm9fZXhlY3V0ZSc6e1xuICAgICAgJ3Jlc3VsdCcgOiBub19leGVjdXRlXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBQcmV2ZW50IGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgZnJvbSBleGVjdXRpbmdcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnZXNjYXBlX3BpcGVzJzp7XG4gICAgICAncmVzdWx0JyA6IHF1b3RlX2NhcnJldCxcbiAgICAgICdjaGVja0NhcnJldCcgOiBmYWxzZVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgRXNjYXBlIGFsbCBjYXJyZXRzIChmcm9tIFwifFwiIHRvIFwifHxcIilcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncXVvdGVfY2FycmV0Jzp7XG4gICAgICAnYWxpYXNPZic6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICB9XG4gICAgJ2V4ZWNfcGFyZW50Jzp7XG4gICAgICAnZXhlY3V0ZScgOiBleGVjX3BhcmVudFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1xuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdjb250ZW50Jzp7XG4gICAgICAncmVzdWx0JyA6IGdldENvbnRlbnRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIE1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxuICAgICAgICB0aGlzIHdpbGwgcmV0dXJuIHdoYXQgd2FzIGJldHdlZW4gdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBvZiBhIGNvbW1hbmRcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnYm94Jzp7XG4gICAgICAnY2xzJyA6IEJveENtZFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQ3JlYXRlIHRoZSBhcHBhcmVuY2Ugb2YgYSBib3ggY29tcG9zZWQgZnJvbSBjaGFyYWN0ZXJzLiBcbiAgICAgICAgVXN1YWxseSB3cmFwcGVkIGluIGEgY29tbWVudC5cblxuICAgICAgICBUaGUgYm94IHdpbGwgdHJ5IHRvIGFqdXN0IGl0J3Mgc2l6ZSBmcm9tIHRoZSBjb250ZW50XG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2Nsb3NlJzp7XG4gICAgICAnY2xzJyA6IENsb3NlQ21kXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBXaWxsIGNsb3NlIHRoZSBmaXJzdCBib3ggYXJvdW5kIHRoaXNcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncGFyYW0nOntcbiAgICAgICdyZXN1bHQnIDogZ2V0UGFyYW1cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIE1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxuICAgICAgICB0aGlzIHdpbGwgcmV0dXJuIGEgcGFyYW1ldGVyIGZyb20gdGhpcyBjb21tYW5kIGNhbGxcblxuICAgICAgICBZb3UgY2FuIHBhc3MgYSBudW1iZXIsIGEgc3RyaW5nLCBvciBib3RoLiBcbiAgICAgICAgQSBudW1iZXIgZm9yIGEgcG9zaXRpb25lZCBhcmd1bWVudCBhbmQgYSBzdHJpbmdcbiAgICAgICAgZm9yIGEgbmFtZWQgcGFyYW1ldGVyXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2VkaXQnOntcbiAgICAgICdjbWRzJyA6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICdzYXZlJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAnY2xzJyA6IEVkaXRDbWQsXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2NtZCddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxuICAgICAgICBTZWUgfn4haGVscDplZGl0aW5nfn4gZm9yIGEgcXVpY2sgdHV0b3JpYWxcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAncmVuYW1lJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfYXBwbGljYWJsZScgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCIsXG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiByZW5hbWVDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWUsXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2Zyb20nLCd0byddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBBbGxvd3MgdG8gcmVuYW1lIGEgY29tbWFuZCBhbmQgY2hhbmdlIGl0J3MgbmFtZXNwYWNlLiBcbiAgICAgICAgWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAtIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcbiAgICAgICAgLSBUaGVuIHNlY29uZCBwYXJhbSBpcyB0aGUgbmV3IG5hbWUsIGlmIGl0IGhhcyBubyBuYW1lc3BhY2UsXG4gICAgICAgICAgaXQgd2lsbCB1c2UgdGhlIG9uZSBmcm9tIHRoZSBvcmlnaW5hbCBjb21tYW5kLlxuXG4gICAgICAgIGV4Ljogfn4hcmVuYW1lIG15X2NvbW1hbmQgbXlfY29tbWFuZDJ+flxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdyZW1vdmUnOntcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ25vdF9hcHBsaWNhYmxlJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBZb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIixcbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgICAncmVzdWx0JyA6IHJlbW92ZUNvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydjbWQnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQWxsb3dzIHRvIHJlbW92ZSBhIGNvbW1hbmQuIFxuICAgICAgICBZb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2FsaWFzJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiBhbGlhc0NvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgIH0sXG4gICAgJ25hbWVzcGFjZSc6e1xuICAgICAgJ2NscycgOiBOYW1lU3BhY2VDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIFNob3cgdGhlIGN1cnJlbnQgbmFtZXNwYWNlcy5cblxuICAgICAgICBBIG5hbWUgc3BhY2UgY291bGQgYmUgdGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlXG4gICAgICAgIG9yIG90aGVyIGtpbmQgb2YgY29udGV4dHNcblxuICAgICAgICBJZiB5b3UgcGFzcyBhIHBhcmFtIHRvIHRoaXMgY29tbWFuZCwgaXQgd2lsbCBcbiAgICAgICAgYWRkIHRoZSBwYXJhbSBhcyBhIG5hbWVzcGFjZSBmb3IgdGhlIGN1cnJlbnQgZWRpdG9yXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ25zcGMnOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOm5hbWVzcGFjZSdcbiAgICB9LFxuICAgICdsaXN0Jzp7XG4gICAgICAncmVzdWx0JyA6IGxpc3RDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCdib3gnLCdjb250ZXh0J11cbiAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcblxuICAgICAgICBZb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcbiAgICAgICAgYnkgZGVmYXVsdCBhbGwgY3VyZW50IG5hbWVzcGFjZSB3aWxsIGJlIHNob3duXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2xzJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTpsaXN0J1xuICAgIH0sXG4gICAgJ2dldCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBnZXRDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgb3V0cHV0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3NldCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBzZXRDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCd2YWx1ZScsJ3ZhbCddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBzZXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnc3RvcmVfanNvbic6e1xuICAgICAgJ3Jlc3VsdCcgOiBzdG9yZUpzb25Db21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCdqc29uJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHNldCBhIHZhcmlhYmxlIHdpdGggc29tZSBqc29uIGRhdGFcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnanNvbic6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6c3RvcmVfanNvbidcbiAgICB9LFxuICAgICd0ZW1wbGF0ZSc6e1xuICAgICAgJ2NscycgOiBUZW1wbGF0ZUNtZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WyduYW1lJywnc2VwJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHJlbmRlciBhIHRlbXBsYXRlIGZvciBhIHZhcmlhYmxlXG5cbiAgICAgICAgSWYgdGhlIGZpcnN0IHBhcmFtIGlzIG5vdCBzZXQgaXQgd2lsbCB1c2UgYWxsIHZhcmlhYmxlcyBcbiAgICAgICAgZm9yIHRoZSByZW5kZXJcbiAgICAgICAgSWYgdGhlIHZhcmlhYmxlIGlzIGFuIGFycmF5IHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIHJlcGVhdGVkIFxuICAgICAgICBmb3IgZWFjaCBpdGVtc1xuICAgICAgICBUaGUgYHNlcGAgcGFyYW0gZGVmaW5lIHdoYXQgd2lsbCBzZXBhcmF0ZSBlYWNoIGl0ZW0gXG4gICAgICAgIGFuZCBkZWZhdWx0IHRvIGEgbGluZSBicmVha1xuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdlbW1ldCc6e1xuICAgICAgJ2NscycgOiBFbW1ldENtZFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxuICAgICAgICBwcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy5cblxuICAgICAgICBQYXNzIHRoZSBFbW1ldCBhYmJyZXZpYXRpb24gYXMgYSBwYXJhbSB0byBleHBlbmQgaXQuXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgXG4gIH0pXG4gIFxuaGVscCA9IChpbnN0YW5jZSkgLT5cbiAgY21kTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgaWYgY21kTmFtZT9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChjbWROYW1lKVxuICAgIGlmIGNtZD9cbiAgICAgIGhlbHBDbWQgPSBjbWQuZ2V0Q21kKCdoZWxwJylcbiAgICAgIHRleHQgPSBpZiBoZWxwQ21kIHRoZW4gXCJ+fiN7aGVscENtZC5mdWxsTmFtZX1+flwiIGVsc2UgXCJUaGlzIGNvbW1hbmQgaGFzIG5vIGhlbHAgdGV4dFwiXG4gICAgICBzdWJjb21tYW5kcyA9IGlmIGNtZC5jbWRzLmxlbmd0aFxuICAgICAgICBcIlwiXCJcblxuICAgICAgICBTdWItQ29tbWFuZHMgOlxuICAgICAgICB+fmxzICN7Y21kLmZ1bGxOYW1lfSBib3g6bm8gY29udGV4dDpub35+XG4gICAgICAgIFwiXCJcIlxuICAgICAgZWxzZSBcbiAgICAgICAgXCJcIlxuICAgICAgcmV0dXJuIFwiXCJcIlxuICAgICAgICB+fmJveH5+XG4gICAgICAgIEhlbHAgZm9yIH5+ISN7Y21kLmZ1bGxOYW1lfX5+IDpcblxuICAgICAgICAje3RleHR9XG4gICAgICAgICN7c3ViY29tbWFuZHN9XG5cbiAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgfn4vYm94fn5cbiAgICAgICAgXCJcIlwiXG4gICAgZWxzZSBcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIlxuICBlbHNlXG4gICAgcmV0dXJuICd+fmhlbHA6b3ZlcnZpZXd+fidcblxubm9fZXhlY3V0ZSA9IChpbnN0YW5jZSkgLT5cbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIrU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzKSArICcpJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikpXG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsJyQxJylcbiAgXG5xdW90ZV9jYXJyZXQgPSAoaW5zdGFuY2UpIC0+XG4gIHJldHVybiBpbnN0YW5jZS5jb250ZW50LnJlcGxhY2UoL1xcfC9nLCAnfHwnKVxuZXhlY19wYXJlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGlmIGluc3RhbmNlLnBhcmVudD9cbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpXG4gICAgaW5zdGFuY2UucmVwbGFjZVN0YXJ0ID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VTdGFydFxuICAgIGluc3RhbmNlLnJlcGxhY2VFbmQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZUVuZFxuICAgIHJldHVybiByZXNcbmdldENvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSxmYWxzZSlcbiAgcHJlZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgc3VmZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgaWYgaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZT9cbiAgICByZXR1cm4gcHJlZml4ICsgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuY29udGVudCBvciAnJykgKyBzdWZmaXhcbiAgaWYgYWZmaXhlc19lbXB0eVxuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXhcbnJlbmFtZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG4gICAgc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgLnRoZW4gKHNhdmVkQ21kcyk9PlxuICAgIG9yaWduaW5hbE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZnJvbSddKVxuICAgIG5ld05hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwndG8nXSlcbiAgICBpZiBvcmlnbmluYWxOYW1lPyBhbmQgbmV3TmFtZT9cbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG9yaWduaW5hbE5hbWUpXG4gICAgICBpZiBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0/IGFuZCBjbWQ/XG4gICAgICAgIHVubGVzcyBuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAgICAgbmV3TmFtZSA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG9yaWduaW5hbE5hbWUsJycpICsgbmV3TmFtZVxuICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsY21kRGF0YSlcbiAgICAgICAgY21kLnVucmVnaXN0ZXIoKVxuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhXG4gICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgICAudGhlbiA9PlxuICAgICAgICAgIHJldHVybiBcIlwiXG4gICAgICBlbHNlIGlmIGNtZD8gXG4gICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiXG4gICAgICBlbHNlIFxuICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbnJlbW92ZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2NtZCddKVxuICAgIGlmIG5hbWU/XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICAgIHN0b3JhZ2UgPSBDb21tYW5kLnN0b3JhZ2VcbiAgICAgICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAgIC50aGVuIChzYXZlZENtZHMpPT5cbiAgICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQobmFtZSlcbiAgICAgICAgaWYgc2F2ZWRDbWRzW25hbWVdPyBhbmQgY21kP1xuICAgICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbbmFtZV1cbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpXG4gICAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tuYW1lXVxuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgICAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgICAgIC50aGVuID0+XG4gICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBlbHNlIGlmIGNtZD8gXG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCJcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbmFsaWFzQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIGFsaWFzID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2FsaWFzJ10pXG4gIGlmIG5hbWU/IGFuZCBhbGlhcz9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuICAgIGlmIGNtZD9cbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgb3IgY21kXG4gICAgICAjIHVubGVzcyBhbGlhcy5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgICAjIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7IGFsaWFzT2Y6IGNtZC5mdWxsTmFtZSB9KVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIFxuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5cbmxpc3RDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBib3ggPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydib3gnXSx0cnVlKVxuICB1c2VDb250ZXh0ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnY29udGV4dCddLHRydWUpXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICBuYW1lc3BhY2VzID0gaWYgbmFtZSBcbiAgICBbbmFtZV0gXG4gIGVsc2UgXG4gICAgaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCkuZmlsdGVyKChuc3BjKSA9PiBuc3BjICE9IGluc3RhbmNlLmNtZC5mdWxsTmFtZSkuY29uY2F0KFwiX3Jvb3RcIilcblxuICBjb250ZXh0ID0gaWYgdXNlQ29udGV4dFxuICAgIGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KClcbiAgZWxzZVxuICAgIGluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0XG5cbiAgY29tbWFuZHMgPSBuYW1lc3BhY2VzLnJlZHVjZSAoY29tbWFuZHMsIG5zcGMpID0+IFxuICAgICAgY21kID0gaWYgbnNwYyA9PSBcIl9yb290XCIgdGhlbiBDb21tYW5kLmNtZHMgZWxzZSBjb250ZXh0LmdldENtZChuc3BjLG11c3RFeGVjdXRlOmZhbHNlKVxuICAgICAgaWYgY21kP1xuICAgICAgICBjbWQuaW5pdCgpXG4gICAgICAgIGlmIGNtZC5jbWRzXG4gICAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5jb25jYXQoY21kLmNtZHMpXG4gICAgICBjb21tYW5kc1xuICAgICwgW11cblxuICB0ZXh0ID0gaWYgY29tbWFuZHMubGVuZ3RoIFxuICAgIGNvbW1hbmRzLm1hcCgoY21kKT0+IFxuICAgICAgY21kLmluaXQoKVxuICAgICAgKGlmIGNtZC5pc0V4ZWN1dGFibGUoKSB0aGVuICd+fiEnIGVsc2UgJ35+IWxzICcpK2NtZC5mdWxsTmFtZSsnfn4nXG4gICAgKS5qb2luKFwiXFxuXCIpXG4gIGVsc2VcbiAgICBcIlRoaXMgY29udGFpbnMgbm8gc3ViLWNvbW1hbmRzXCJcblxuICBpZiBib3hcbiAgICBcIlwiXCJcbiAgICAgIH5+Ym94fn5cbiAgICAgICN7dGV4dH1cblxuICAgICAgfn4hY2xvc2V8fn5cbiAgICAgIH5+L2JveH5+XG4gICAgICBcIlwiXCJcbiAgZWxzZVxuICAgIHRleHRcbiAgXG5nZXRDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgcmVzID0gUGF0aEhlbHBlci5nZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsbmFtZSlcbiAgaWYgdHlwZW9mIHJlcyA9PSBcIm9iamVjdFwiXG4gICAgSlNPTi5zdHJpbmdpZnkocmVzLG51bGwsJyAgJylcbiAgZWxzZVxuICAgIHJlc1xuXG5zZXRDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwndmFsdWUnLCd2YWwnXSkpP1xuICAgIHBcbiAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgaW5zdGFuY2UuY29udGVudFxuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycyxuYW1lLHZhbClcbiAgJydcblxuc3RvcmVKc29uQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIHZhbCA9IGlmIChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2pzb24nXSkpP1xuICAgIHBcbiAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgaW5zdGFuY2UuY29udGVudFxuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycyxuYW1lLCBKU09OLnBhcnNlKHZhbCkpXG4gICcnXG5cbmdldFBhcmFtID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlP1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcyxpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsJ2RlZmF1bHQnXSkpXG4gIFxuY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAaGVscGVyID0gbmV3IEJveEhlbHBlcihAaW5zdGFuY2UuY29udGV4dClcbiAgICBAY21kID0gQGluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pXG4gICAgaWYgQGNtZD9cbiAgICAgIEBoZWxwZXIub3BlblRleHQgID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAY21kICsgQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIEBoZWxwZXIuY2xvc2VUZXh0ID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZC5zcGxpdChcIiBcIilbMF0gKyBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgIEBoZWxwZXIuZGVjbyA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5kZWNvXG4gICAgQGhlbHBlci5wYWQgPSAyXG4gICAgQGhlbHBlci5wcmVmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgICBAaGVscGVyLnN1ZmZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCcnKVxuICAgIFxuICBoZWlnaHQ6IC0+XG4gICAgaWYgQGJvdW5kcygpP1xuICAgICAgaGVpZ2h0ID0gQGJvdW5kcygpLmhlaWdodFxuICAgIGVsc2VcbiAgICAgIGhlaWdodCA9IDNcbiAgICAgIFxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J11cbiAgICBpZiBAaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEgXG4gICAgICBwYXJhbXMucHVzaCgxKVxuICAgIGVsc2UgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAwXG4gICAgICBwYXJhbXMucHVzaCgwKVxuICAgIHJldHVybiBAaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLGhlaWdodClcbiAgICAgIFxuICB3aWR0aDogLT5cbiAgICBpZiBAYm91bmRzKCk/XG4gICAgICB3aWR0aCA9IEBib3VuZHMoKS53aWR0aFxuICAgIGVsc2VcbiAgICAgIHdpZHRoID0gM1xuICAgICAgXG4gICAgcGFyYW1zID0gWyd3aWR0aCddXG4gICAgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxIFxuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICByZXR1cm4gTWF0aC5tYXgoQG1pbldpZHRoKCksIEBpbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSlcblxuICBcbiAgYm91bmRzOiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgQF9ib3VuZHM/XG4gICAgICAgIEBfYm91bmRzID0gQGhlbHBlci50ZXh0Qm91bmRzKEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcmV0dXJuIEBfYm91bmRzXG4gICAgICBcbiAgcmVzdWx0OiAtPlxuICAgIEBoZWxwZXIuaGVpZ2h0ID0gQGhlaWdodCgpXG4gICAgQGhlbHBlci53aWR0aCA9IEB3aWR0aCgpXG4gICAgcmV0dXJuIEBoZWxwZXIuZHJhdyhAaW5zdGFuY2UuY29udGVudClcbiAgbWluV2lkdGg6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJldHVybiBAY21kLmxlbmd0aFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwXG4gIFxuY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBpbnN0YW5jZS5jb250ZXh0KVxuICBleGVjdXRlOiAtPlxuICAgIHByZWZpeCA9IEBoZWxwZXIucHJlZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gICAgc3VmZml4ID0gQGhlbHBlci5zdWZmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgICBib3ggPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3JlcXVpcmVkX2FmZml4ZXMnXSx0cnVlKVxuICAgIGlmICFyZXF1aXJlZF9hZmZpeGVzXG4gICAgICBAaGVscGVyLnByZWZpeCA9IEBoZWxwZXIuc3VmZml4ID0gJydcbiAgICAgIGJveDIgPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgICBpZiBib3gyPyBhbmQgKCFib3g/IG9yIGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIG9yIGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpXG4gICAgICAgIGJveCA9IGJveDJcbiAgICBpZiBib3g/XG4gICAgICBkZXB0aCA9IEBoZWxwZXIuZ2V0TmVzdGVkTHZsKEBpbnN0YW5jZS5nZXRQb3MoKS5zdGFydClcbiAgICAgIGlmIGRlcHRoIDwgMlxuICAgICAgICBAaW5zdGFuY2UuaW5Cb3ggPSBudWxsXG4gICAgICBAaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LGJveC5lbmQsJycpKVxuICAgIGVsc2VcbiAgICAgIEBpbnN0YW5jZS5yZXBsYWNlV2l0aCgnJylcbiAgICAgICAgICBcbmNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBjbWROYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgICBAdmVyYmFsaXplID0gQGluc3RhbmNlLmdldFBhcmFtKFsxXSkgaW4gWyd2JywndmVyYmFsaXplJ11cbiAgICBpZiBAY21kTmFtZT9cbiAgICAgIEBmaW5kZXIgPSBAaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRGaW5kZXIoQGNtZE5hbWUpIFxuICAgICAgQGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgQGVkaXRhYmxlID0gaWYgQGNtZD8gdGhlbiBAY21kLmlzRWRpdGFibGUoKSBlbHNlIHRydWVcbiAgcmVzdWx0OiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICByZXR1cm4gQHJlc3VsdFdpdGhDb250ZW50KClcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQHJlc3VsdFdpdGhvdXRDb250ZW50KClcbiAgcmVzdWx0V2l0aENvbnRlbnQ6IC0+XG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChAaW5zdGFuY2UuY29udGVudClcbiAgICAgIHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICBkYXRhID0ge31cbiAgICAgIGZvciBwIGluIEVkaXRDbWQucHJvcHNcbiAgICAgICAgcC53cml0ZUZvcihwYXJzZXIsZGF0YSlcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChAY21kTmFtZSwgZGF0YSlcbiAgICAgIHJldHVybiAnJ1xuICBwcm9wc0Rpc3BsYXk6IC0+XG4gICAgICBjbWQgPSBAY21kXG4gICAgICByZXR1cm4gRWRpdENtZC5wcm9wcy5tYXAoIChwKS0+IHAuZGlzcGxheShjbWQpICkuZmlsdGVyKCAocCktPiBwPyApLmpvaW4oXCJcXG5cIilcbiAgcmVzdWx0V2l0aG91dENvbnRlbnQ6IC0+XG4gICAgaWYgIUBjbWQgb3IgQGVkaXRhYmxlXG4gICAgICBuYW1lID0gaWYgQGNtZCB0aGVuIEBjbWQuZnVsbE5hbWUgZWxzZSBAY21kTmFtZVxuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQoXG4gICAgICAgIFwiXCJcIlxuICAgICAgICB+fmJveCBjbWQ6XCIje0BpbnN0YW5jZS5jbWQuZnVsbE5hbWV9ICN7bmFtZX1cIn5+XG4gICAgICAgICN7QHByb3BzRGlzcGxheSgpfVxuICAgICAgICB+fiFzYXZlfn4gfn4hY2xvc2V+flxuICAgICAgICB+fi9ib3h+flxuICAgICAgICBcIlwiXCIpXG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBub1xuICAgICAgcmV0dXJuIGlmIEB2ZXJiYWxpemUgdGhlbiBwYXJzZXIuZ2V0VGV4dCgpIGVsc2UgcGFyc2VyLnBhcnNlQWxsKClcbkVkaXRDbWQuc2V0Q21kcyA9IChiYXNlKSAtPlxuICBpbkluc3RhbmNlID0gYmFzZS5pbl9pbnN0YW5jZSA9IHtjbWRzOnt9fVxuICBmb3IgcCBpbiBFZGl0Q21kLnByb3BzXG4gICAgcC5zZXRDbWQoaW5JbnN0YW5jZS5jbWRzKVxuICAgICMgcC5zZXRDbWQoYmFzZSlcbiAgcmV0dXJuIGJhc2VcbkVkaXRDbWQucHJvcHMgPSBbXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19jYXJyZXQnLCAgICAgICAgIHtvcHQ6J2NoZWNrQ2FycmV0J30pLFxuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fcGFyc2UnLCAgICAgICAgICB7b3B0OidwYXJzZSd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woICAgJ3ByZXZlbnRfcGFyc2VfYWxsJywge29wdDoncHJldmVudFBhcnNlQWxsJ30pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCggICAncmVwbGFjZV9ib3gnLCAgICAgICB7b3B0OidyZXBsYWNlQm94J30pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCAnbmFtZV90b19wYXJhbScsICAgICB7b3B0OiduYW1lVG9QYXJhbSd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZyggJ2FsaWFzX29mJywgICAgICAgICAge3ZhcjonYWxpYXNPZicsIGNhcnJldDp0cnVlfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoICdoZWxwJywgICAgICAgICAgICAgIHtmdW5jdDonaGVscCcsIHNob3dFbXB0eTp0cnVlfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoICdzb3VyY2UnLCAgICAgICAgICAgIHt2YXI6J3Jlc3VsdFN0cicsIGRhdGFOYW1lOidyZXN1bHQnLCBzaG93RW1wdHk6dHJ1ZSwgY2FycmV0OnRydWV9KSxcbl1cbmNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQG5hbWUgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzBdKVxuICByZXN1bHQ6IC0+XG4gICAgaWYgQG5hbWU/XG4gICAgICBAaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQuYWRkTmFtZVNwYWNlKEBuYW1lKVxuICAgICAgcmV0dXJuICcnXG4gICAgZWxzZVxuICAgICAgbmFtZXNwYWNlcyA9IEBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKVxuICAgICAgdHh0ID0gJ35+Ym94fn5cXG4nXG4gICAgICBmb3IgbnNwYyBpbiBuYW1lc3BhY2VzIFxuICAgICAgICBpZiBuc3BjICE9IEBpbnN0YW5jZS5jbWQuZnVsbE5hbWVcbiAgICAgICAgICB0eHQgKz0gbnNwYysnXFxuJ1xuICAgICAgdHh0ICs9ICd+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQodHh0KVxuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpXG5cblxuY2xhc3MgVGVtcGxhdGVDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBuYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gICAgQHNlcCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3NlcCddLFwiXFxuXCIpXG4gIHJlc3VsdDogLT5cbiAgICBkYXRhID0gaWYgQG5hbWUgdGhlbiBQYXRoSGVscGVyLmdldFBhdGgoQGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIEBuYW1lKSBlbHNlIEBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzXG4gICAgaWYgQGluc3RhbmNlLmNvbnRlbnQgYW5kIGRhdGE/IGFuZCBkYXRhICE9IGZhbHNlXG4gICAgICBpZiBBcnJheS5pc0FycmF5KGRhdGEpXG4gICAgICAgIGRhdGEubWFwIChpdGVtKT0+QHJlbmRlclRlbXBsYXRlKGl0ZW0pXG4gICAgICAgICAgLmpvaW4oQHNlcClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlbmRlclRlbXBsYXRlKGRhdGEpXG4gICAgZWxzZVxuICAgICAgJydcbiAgcmVuZGVyVGVtcGxhdGU6IChkYXRhKSAtPlxuICAgICAgcGFyc2VyID0gQGluc3RhbmNlLmdldFBhcnNlckZvclRleHQoQGluc3RhbmNlLmNvbnRlbnQpXG4gICAgICBwYXJzZXIudmFycyA9IGlmIHR5cGVvZiBkYXRhID09IFwib2JqZWN0XCIgdGhlbiBkYXRhIGVsc2Uge3ZhbHVlOmRhdGF9XG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBub1xuICAgICAgcGFyc2VyLnBhcnNlQWxsKClcblxuXG5jbGFzcyBFbW1ldENtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGFiYnIgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2FiYnInLCdhYmJyZXZpYXRpb24nXSlcbiAgICBAbGFuZyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMSwnbGFuZycsJ2xhbmd1YWdlJ10pXG4gIHJlc3VsdDogLT5cbiAgICBlbW1ldCA9IGlmIHdpbmRvdz8uZW1tZXQ/XG4gICAgICB3aW5kb3cuZW1tZXRcbiAgICBlbHNlIGlmIHdpbmRvdz8uc2VsZj8uZW1tZXQ/XG4gICAgICB3aW5kb3cuc2VsZi5lbW1ldFxuICAgIGVsc2UgaWYgd2luZG93Py5nbG9iYWw/LmVtbWV0P1xuICAgICAgd2luZG93Lmdsb2JhbC5lbW1ldFxuICAgIGVsc2UgaWYgcmVxdWlyZT8gXG4gICAgICB0cnkgXG4gICAgICAgIHJlcXVpcmUoJ2VtbWV0JylcbiAgICAgIGNhdGNoIGV4XG4gICAgICAgIEBpbnN0YW5jZS5jb2Rld2F2ZS5sb2dnZXIubG9nKCdFbW1ldCBpcyBub3QgYXZhaWxhYmxlLCBpdCBtYXkgbmVlZCB0byBiZSBpbnN0YWxsZWQgbWFudWFsbHknKVxuICAgICAgICBudWxsXG4gICAgaWYgZW1tZXQ/XG4gICAgICAjIGVtbWV0LnJlcXVpcmUoJy4vcGFyc2VyL2FiYnJldmlhdGlvbicpLmV4cGFuZCgndWw+bGknLCB7cGFzdGVkQ29udGVudDonbG9yZW0nfSlcbiAgICAgIHJlcyA9IGVtbWV0LmV4cGFuZEFiYnJldmlhdGlvbihAYWJiciwgQGxhbmcpXG4gICAgICByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpXG5cblxuXG4iLCJ2YXIgQm94Q21kLCBDbG9zZUNtZCwgRWRpdENtZCwgRW1tZXRDbWQsIE5hbWVTcGFjZUNtZCwgVGVtcGxhdGVDbWQsIGFsaWFzQ29tbWFuZCwgZXhlY19wYXJlbnQsIGdldENvbW1hbmQsIGdldENvbnRlbnQsIGdldFBhcmFtLCBoZWxwLCBsaXN0Q29tbWFuZCwgbm9fZXhlY3V0ZSwgcXVvdGVfY2FycmV0LCByZW1vdmVDb21tYW5kLCByZW5hbWVDb21tYW5kLCBzZXRDb21tYW5kLCBzdG9yZUpzb25Db21tYW5kO1xuXG5pbXBvcnQge1xuICBDb21tYW5kLFxuICBCYXNlQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgTGFuZ0RldGVjdG9yXG59IGZyb20gJy4uL0RldGVjdG9yJztcblxuaW1wb3J0IHtcbiAgQm94SGVscGVyXG59IGZyb20gJy4uL0JveEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIEVkaXRDbWRQcm9wXG59IGZyb20gJy4uL0VkaXRDbWRQcm9wJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgUGF0aEhlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1BhdGhIZWxwZXInO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCB2YXIgQ29yZUNvbW1hbmRQcm92aWRlciA9IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNvcmU7XG4gICAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjb3JlJykpO1xuICAgIGNvcmUuYWRkRGV0ZWN0b3IobmV3IExhbmdEZXRlY3RvcigpKTtcbiAgICByZXR1cm4gY29yZS5hZGRDbWRzKHtcbiAgICAgICdoZWxwJzoge1xuICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICdyZXN1bHQnOiBoZWxwLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydjbWQnXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRvIGdldCBoZWxwIG9uIGEgcGVjaWZpYyBjb21tYW5kLCBkbyA6XFxufn5oZWxwIGhlbGxvfn4gKGhlbGxvIGJlaW5nIHRoZSBjb21tYW5kKVwiLFxuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnb3ZlcnZpZXcnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn5xdW90ZV9jYXJyZXR+flxcbiAgX19fICAgICAgICAgXyAgIF9fICAgICAgX19cXG4gLyBfX3xfX18gIF9ffCB8X19cXFxcIFxcXFwgICAgLyAvXyBfX18gX19fX19fXFxuLyAvX18vIF8gXFxcXC8gX2AgLyAtX1xcXFwgXFxcXC9cXFxcLyAvIF9gIFxcXFwgViAvIC1fL1xcblxcXFxfX19fXFxcXF9fXy9cXFxcX18sX1xcXFxfX198XFxcXF8vXFxcXF8vXFxcXF9fLF98XFxcXF8vXFxcXF9fX3xcXG5UaGUgdGV4dCBlZGl0b3IgaGVscGVyXFxufn4vcXVvdGVfY2FycmV0fn5cXG5cXG5XaGVuIHVzaW5nIENvZGV3YXZlIHlvdSB3aWxsIGJlIHdyaXRpbmcgY29tbWFuZHMgd2l0aGluIFxcbnlvdXIgdGV4dCBlZGl0b3IuIFRoZXNlIGNvbW1hbmRzIG11c3QgYmUgcGxhY2VkIGJldHdlZW4gdHdvIFxcbnBhaXJzIG9mIFxcXCJ+XFxcIiAodGlsZGUpIGFuZCB0aGVuLCB0aGV5IGNhbiBiZSBleGVjdXRlZCBieSBwcmVzc2luZyBcXG5cXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIsIHdpdGggeW91ciBjdXJzb3IgaW5zaWRlIHRoZSBjb21tYW5kXFxuRXg6IH5+IWhlbGxvfn5cXG5cXG5Zb3UgZG9udCBuZWVkIHRvIGFjdHVhbGx5IHR5cGUgYW55IFxcXCJ+XFxcIiAodGlsZGUpLiBcXG5QcmVzc2luZyBcXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XFxud2l0aGluIGEgY29tbWFuZC5cXG5cXG5Db2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxcbkluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxcblRoZSBnZW5lcmF0ZWQgY29tbWVudCBibG9ja3Mgd2lsbCBiZSByZWZlcnJlZCB0byBhcyB3aW5kb3dzIFxcbmluIHRoZSBoZWxwIHNlY3Rpb25zLlxcblxcblRvIGNsb3NlIHRoaXMgd2luZG93IChpLmUuIHJlbW92ZSB0aGlzIGNvbW1lbnQgYmxvY2spLCBwcmVzcyBcXG5cXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXFxufn4hY2xvc2V8fn5cXG5cXG5Vc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcXG5mZWF0dXJlcyBvZiBDb2Rld2F2ZVxcbn5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiBvciB+fiFoZWxwOmRlbW9+flxcblxcbkxpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXFxufn4haGVscDpzdWJqZWN0c35+IG9yIH5+IWhlbHA6c3Vifn4gXFxuXFxufn4hY2xvc2V+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdzdWJqZWN0cyc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fiFoZWxwfn5cXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxcbn5+IWhlbHA6c3ViamVjdHN+fiAofn4haGVscDpzdWJ+filcXG5+fiFoZWxwOmVkaXRpbmd+fiAofn4haGVscDplZGl0fn4pXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc3ViJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpzdWJqZWN0cydcbiAgICAgICAgICB9LFxuICAgICAgICAgICdnZXRfc3RhcnRlZCc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5UaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cXG5+fiFoZWxsb3x+flxcblxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuXFxuRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcXG5+fiFoZWxwOmVkaXRpbmd+flxcblxcbkNvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxcbm9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xcbn5+IWpzOmZ+flxcbn5+IWpzOmlmfn5cXG4gIH5+IWpzOmxvZ35+XFxcIn5+IWhlbGxvfn5cXFwifn4hL2pzOmxvZ35+XFxufn4hL2pzOmlmfn5cXG5+fiEvanM6Zn5+XFxuXFxuQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxcbnByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLiBFbW1ldCBhYmJyZXZpYXRpb25zIHdpbGwgYmUgXFxudXNlZCBhdXRvbWF0aWNhbGx5IGlmIHlvdSBhcmUgaW4gYSBIVE1MIG9yIENTUyBmaWxlLlxcbn5+IXVsPmxpfn4gKGlmIHlvdSBhcmUgaW4gYSBodG1sIGRvY2N1bWVudClcXG5+fiFlbW1ldCB1bD5saX5+XFxufn4hZW1tZXQgbTIgY3Nzfn5cXG5cXG5Db21tYW5kcyBhcmUgc3RvcmVkIGluIG5hbWVzcGFjZXMuIFRoZSBzYW1lIGNvbW1hbmQgY2FuIGhhdmUgXFxuZGlmZmVyZW50IHJlc3VsdHMgZGVwZW5kaW5nIG9uIHRoZSBuYW1lc3BhY2UuXFxufn4hanM6ZWFjaH5+XFxufn4hcGhwOm91dGVyOmVhY2h+flxcbn5+IXBocDppbm5lcjplYWNofn5cXG5cXG5Tb21lIG9mIHRoZSBuYW1lc3BhY2VzIGFyZSBhY3RpdmUgZGVwZW5kaW5nIG9uIHRoZSBjb250ZXh0LiBUaGVcXG5mb2xsb3dpbmcgY29tbWFuZHMgYXJlIHRoZSBzYW1lIGFuZCB3aWxsIGRpc3BsYXkgdGhlIGN1cnJlbnRseVxcbmFjdGl2ZSBuYW1lc3BhY2UuIFRoZSBmaXJzdCBjb21tYW5kIGNvbW1hbmQgd29ya3MgYmVjYXVzZSB0aGUgXFxuY29yZSBuYW1lc3BhY2UgaXMgYWN0aXZlLlxcbn5+IW5hbWVzcGFjZX5+XFxufn4hY29yZTpuYW1lc3BhY2V+flxcblxcbllvdSBjYW4gbWFrZSBhIG5hbWVzcGFjZSBhY3RpdmUgd2l0aCB0aGUgZm9sbG93aW5nIGNvbW1hbmQuXFxufn4hbmFtZXNwYWNlIHBocH5+XFxuXFxuQ2hlY2sgdGhlIG5hbWVzcGFjZXMgYWdhaW5cXG5+fiFuYW1lc3BhY2V+flxcblxcbkluIGFkZGl0aW9uIHRvIGRldGVjdGluZyB0aGUgZG9jdW1lbnQgdHlwZSwgQ29kZXdhdmUgY2FuIGRldGVjdCB0aGVcXG5jb250ZXh0IGZyb20gdGhlIHN1cnJvdW5kaW5nIHRleHQuIEluIGEgUEhQIGZpbGUsIGl0IG1lYW5zIENvZGV3YXZlIFxcbndpbGwgYWRkIHRoZSBQSFAgdGFncyB3aGVuIHlvdSBuZWVkIHRoZW0uXFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdkZW1vJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpnZXRfc3RhcnRlZCdcbiAgICAgICAgICB9LFxuICAgICAgICAgICdlZGl0aW5nJzoge1xuICAgICAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgICAgICdpbnRybyc6IHtcbiAgICAgICAgICAgICAgICAncmVzdWx0JzogXCJDb2Rld2F2ZSBhbGxvd3MgeW91IHRvIG1ha2UgeW91ciBvd24gY29tbWFuZHMgKG9yIGFiYnJldmlhdGlvbnMpIFxcbnB1dCB5b3VyIGNvbnRlbnQgaW5zaWRlIFxcXCJzb3VyY2VcXFwiIHRoZSBkbyBcXFwic2F2ZVxcXCIuIFRyeSBhZGRpbmcgYW55IFxcbnRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXFxufn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxcblxcbklmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XFxuZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxcbndoZW5ldmVyIHlvdSB3YW50Llxcbn5+IW15X25ld19jb21tYW5kfn5cIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5cXG5BbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcXFwiYm94XFxcIi4gXFxuVGhleSBhcmUgbWVhbnQgdG8gZGlzcGxheSB0ZXh0IHRoYXQgc2hvdWxkIG5vdCByZW1haW4gaW4geW91ciBjb2RlLiBcXG5UaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXFxuXFxcImNsb3NlXFxcIiBjYW4gYmUgdXNlZCB0byByZW1vdmUgdGhlbSByYXBpZGx5LiBZb3UgY2FuIG1ha2UgeW91ciBvd24gXFxuY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5Llxcbn5+IWJveH5+XFxuVGhlIGJveCB3aWxsIHNjYWxlIHdpdGggdGhlIGNvbnRlbnQgeW91IHB1dCBpbiBpdFxcbn5+IWNsb3NlfH5+XFxufn4hL2JveH5+XFxuXFxufn5xdW90ZV9jYXJyZXR+flxcbldoZW4geW91IGNyZWF0ZSBhIGNvbW1hbmQsIHlvdSBtYXkgd2FudCB0byBzcGVjaWZ5IHdoZXJlIHRoZSBjdXJzb3IgXFxud2lsbCBiZSBsb2NhdGVkIG9uY2UgdGhlIGNvbW1hbmQgaXMgZXhwYW5kZWQuIFRvIGRvIHRoYXQsIHVzZSBhIFxcXCJ8XFxcIiBcXG4oVmVydGljYWwgYmFyKS4gVXNlIDIgb2YgdGhlbSBpZiB5b3Ugd2FudCB0byBwcmludCB0aGUgYWN0dWFsIFxcbmNoYXJhY3Rlci5cXG5+fiFib3h+flxcbm9uZSA6IHwgXFxudHdvIDogfHxcXG5+fiEvYm94fn5cXG5cXG5Zb3UgY2FuIGFsc28gdXNlIHRoZSBcXFwiZXNjYXBlX3BpcGVzXFxcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxcbnZlcnRpY2FsIGJhcnMgdGhhdCBhcmUgYmV0d2VlbiBpdHMgb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzXFxufn4hZXNjYXBlX3BpcGVzfn5cXG58XFxufn4hL2VzY2FwZV9waXBlc35+XFxuXFxuQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cXG5JZiB5b3Ugd2FudCB0byBwcmludCBhIGNvbW1hbmQgd2l0aG91dCBoYXZpbmcgaXQgZXhwYW5kIHdoZW4gXFxudGhlIHBhcmVudCBjb21tYW5kIGlzIGV4cGFuZGVkLCB1c2UgYSBcXFwiIVxcXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxcbn5+ISFoZWxsb35+XFxuXFxuRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXFxudGhlIFxcXCJjb250ZW50XFxcIiBjb21tYW5kLiBcXFwiY29udGVudFxcXCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XFxudGhhdCBpcyBiZXR3ZWVuIHRoZSB0YWdzLiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgaG93IGl0IGNhbiBiZSB1c2VkLlxcbn5+IWVkaXQgcGhwOmlubmVyOmlmfn5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2VkaXQnOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmVkaXRpbmcnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdub19leGVjdXRlJzoge1xuICAgICAgICAncmVzdWx0Jzogbm9fZXhlY3V0ZSxcbiAgICAgICAgJ2hlbHAnOiBcIlByZXZlbnQgZXZlcnl0aGluZyBpbnNpZGUgdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBmcm9tIGV4ZWN1dGluZ1wiXG4gICAgICB9LFxuICAgICAgJ2VzY2FwZV9waXBlcyc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHF1b3RlX2NhcnJldCxcbiAgICAgICAgJ2NoZWNrQ2FycmV0JzogZmFsc2UsXG4gICAgICAgICdoZWxwJzogXCJFc2NhcGUgYWxsIGNhcnJldHMgKGZyb20gXFxcInxcXFwiIHRvIFxcXCJ8fFxcXCIpXCJcbiAgICAgIH0sXG4gICAgICAncXVvdGVfY2FycmV0Jzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICAgIH0sXG4gICAgICAnZXhlY19wYXJlbnQnOiB7XG4gICAgICAgICdleGVjdXRlJzogZXhlY19wYXJlbnQsXG4gICAgICAgICdoZWxwJzogXCJFeGVjdXRlIHRoZSBmaXJzdCBjb21tYW5kIHRoYXQgd3JhcCB0aGlzIGluIGl0J3Mgb3BlbiBhbmQgY2xvc2UgdGFnXCJcbiAgICAgIH0sXG4gICAgICAnY29udGVudCc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGdldENvbnRlbnQsXG4gICAgICAgICdoZWxwJzogXCJNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIHdoYXQgd2FzIGJldHdlZW4gdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBvZiBhIGNvbW1hbmRcIlxuICAgICAgfSxcbiAgICAgICdib3gnOiB7XG4gICAgICAgICdjbHMnOiBCb3hDbWQsXG4gICAgICAgICdoZWxwJzogXCJDcmVhdGUgdGhlIGFwcGFyZW5jZSBvZiBhIGJveCBjb21wb3NlZCBmcm9tIGNoYXJhY3RlcnMuIFxcblVzdWFsbHkgd3JhcHBlZCBpbiBhIGNvbW1lbnQuXFxuXFxuVGhlIGJveCB3aWxsIHRyeSB0byBhanVzdCBpdCdzIHNpemUgZnJvbSB0aGUgY29udGVudFwiXG4gICAgICB9LFxuICAgICAgJ2Nsb3NlJzoge1xuICAgICAgICAnY2xzJzogQ2xvc2VDbWQsXG4gICAgICAgICdoZWxwJzogXCJXaWxsIGNsb3NlIHRoZSBmaXJzdCBib3ggYXJvdW5kIHRoaXNcIlxuICAgICAgfSxcbiAgICAgICdwYXJhbSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGdldFBhcmFtLFxuICAgICAgICAnaGVscCc6IFwiTWFpbmx5IHVzZWQgZm9yIGNvbW1hbmQgZWRpdGlvbiwgXFxudGhpcyB3aWxsIHJldHVybiBhIHBhcmFtZXRlciBmcm9tIHRoaXMgY29tbWFuZCBjYWxsXFxuXFxuWW91IGNhbiBwYXNzIGEgbnVtYmVyLCBhIHN0cmluZywgb3IgYm90aC4gXFxuQSBudW1iZXIgZm9yIGEgcG9zaXRpb25lZCBhcmd1bWVudCBhbmQgYSBzdHJpbmdcXG5mb3IgYSBuYW1lZCBwYXJhbWV0ZXJcIlxuICAgICAgfSxcbiAgICAgICdlZGl0Jzoge1xuICAgICAgICAnY21kcyc6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICAgJ3NhdmUnOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmV4ZWNfcGFyZW50J1xuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgICdjbHMnOiBFZGl0Q21kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydjbWQnXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byBlZGl0IGEgY29tbWFuZC4gXFxuU2VlIH5+IWhlbHA6ZWRpdGluZ35+IGZvciBhIHF1aWNrIHR1dG9yaWFsXCJcbiAgICAgIH0sXG4gICAgICAncmVuYW1lJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnbm90X2FwcGxpY2FibGUnOiBcIn5+Ym94fn5cXG5Zb3UgY2FuIG9ubHkgcmVuYW1lIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiLFxuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogcmVuYW1lQ29tbWFuZCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnZnJvbScsICd0byddLFxuICAgICAgICAnaGVscCc6IFwiQWxsb3dzIHRvIHJlbmFtZSBhIGNvbW1hbmQgYW5kIGNoYW5nZSBpdCdzIG5hbWVzcGFjZS4gXFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbi0gVGhlIGZpcnN0IHBhcmFtIGlzIHRoZSBvbGQgbmFtZVxcbi0gVGhlbiBzZWNvbmQgcGFyYW0gaXMgdGhlIG5ldyBuYW1lLCBpZiBpdCBoYXMgbm8gbmFtZXNwYWNlLFxcbiAgaXQgd2lsbCB1c2UgdGhlIG9uZSBmcm9tIHRoZSBvcmlnaW5hbCBjb21tYW5kLlxcblxcbmV4Ljogfn4hcmVuYW1lIG15X2NvbW1hbmQgbXlfY29tbWFuZDJ+flwiXG4gICAgICB9LFxuICAgICAgJ3JlbW92ZSc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9hcHBsaWNhYmxlJzogXCJ+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIixcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IHJlbW92ZUNvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2NtZCddLFxuICAgICAgICAnaGVscCc6IFwiQWxsb3dzIHRvIHJlbW92ZSBhIGNvbW1hbmQuIFxcbllvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cIlxuICAgICAgfSxcbiAgICAgICdhbGlhcyc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiBhbGlhc0NvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWVcbiAgICAgIH0sXG4gICAgICAnbmFtZXNwYWNlJzoge1xuICAgICAgICAnY2xzJzogTmFtZVNwYWNlQ21kLFxuICAgICAgICAnaGVscCc6IFwiU2hvdyB0aGUgY3VycmVudCBuYW1lc3BhY2VzLlxcblxcbkEgbmFtZSBzcGFjZSBjb3VsZCBiZSB0aGUgbmFtZSBvZiB0aGUgbGFuZ3VhZ2VcXG5vciBvdGhlciBraW5kIG9mIGNvbnRleHRzXFxuXFxuSWYgeW91IHBhc3MgYSBwYXJhbSB0byB0aGlzIGNvbW1hbmQsIGl0IHdpbGwgXFxuYWRkIHRoZSBwYXJhbSBhcyBhIG5hbWVzcGFjZSBmb3IgdGhlIGN1cnJlbnQgZWRpdG9yXCJcbiAgICAgIH0sXG4gICAgICAnbnNwYyc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpuYW1lc3BhY2UnXG4gICAgICB9LFxuICAgICAgJ2xpc3QnOiB7XG4gICAgICAgICdyZXN1bHQnOiBsaXN0Q29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZScsICdib3gnLCAnY29udGV4dCddLFxuICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdoZWxwJzogXCJMaXN0IGF2YWlsYWJsZSBjb21tYW5kc1xcblxcbllvdSBjYW4gdXNlIHRoZSBmaXJzdCBhcmd1bWVudCB0byBjaG9vc2UgYSBzcGVjaWZpYyBuYW1lc3BhY2UsIFxcbmJ5IGRlZmF1bHQgYWxsIGN1cmVudCBuYW1lc3BhY2Ugd2lsbCBiZSBzaG93blwiXG4gICAgICB9LFxuICAgICAgJ2xzJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmxpc3QnXG4gICAgICB9LFxuICAgICAgJ2dldCc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGdldENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnXSxcbiAgICAgICAgJ2hlbHAnOiBcIm91dHB1dCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZVwiXG4gICAgICB9LFxuICAgICAgJ3NldCc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHNldENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAndmFsdWUnLCAndmFsJ10sXG4gICAgICAgICdoZWxwJzogXCJzZXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcIlxuICAgICAgfSxcbiAgICAgICdzdG9yZV9qc29uJzoge1xuICAgICAgICAncmVzdWx0Jzogc3RvcmVKc29uQ29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZScsICdqc29uJ10sXG4gICAgICAgICdoZWxwJzogXCJzZXQgYSB2YXJpYWJsZSB3aXRoIHNvbWUganNvbiBkYXRhXCJcbiAgICAgIH0sXG4gICAgICAnanNvbic6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpzdG9yZV9qc29uJ1xuICAgICAgfSxcbiAgICAgICd0ZW1wbGF0ZSc6IHtcbiAgICAgICAgJ2Nscyc6IFRlbXBsYXRlQ21kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ3NlcCddLFxuICAgICAgICAnaGVscCc6IFwicmVuZGVyIGEgdGVtcGxhdGUgZm9yIGEgdmFyaWFibGVcXG5cXG5JZiB0aGUgZmlyc3QgcGFyYW0gaXMgbm90IHNldCBpdCB3aWxsIHVzZSBhbGwgdmFyaWFibGVzIFxcbmZvciB0aGUgcmVuZGVyXFxuSWYgdGhlIHZhcmlhYmxlIGlzIGFuIGFycmF5IHRoZSB0ZW1wbGF0ZSB3aWxsIGJlIHJlcGVhdGVkIFxcbmZvciBlYWNoIGl0ZW1zXFxuVGhlIGBzZXBgIHBhcmFtIGRlZmluZSB3aGF0IHdpbGwgc2VwYXJhdGUgZWFjaCBpdGVtIFxcbmFuZCBkZWZhdWx0IHRvIGEgbGluZSBicmVha1wiXG4gICAgICB9LFxuICAgICAgJ2VtbWV0Jzoge1xuICAgICAgICAnY2xzJzogRW1tZXRDbWQsXG4gICAgICAgICdoZWxwJzogXCJDb2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXFxucHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuXFxuXFxuUGFzcyB0aGUgRW1tZXQgYWJicmV2aWF0aW9uIGFzIGEgcGFyYW0gdG8gZXhwZW5kIGl0LlwiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcblxuaGVscCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBjbWQsIGNtZE5hbWUsIGhlbHBDbWQsIHN1YmNvbW1hbmRzLCB0ZXh0O1xuICBjbWROYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG4gIGlmIChjbWROYW1lICE9IG51bGwpIHtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChjbWROYW1lKTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGhlbHBDbWQgPSBjbWQuZ2V0Q21kKCdoZWxwJyk7XG4gICAgICB0ZXh0ID0gaGVscENtZCA/IGB+fiR7aGVscENtZC5mdWxsTmFtZX1+fmAgOiBcIlRoaXMgY29tbWFuZCBoYXMgbm8gaGVscCB0ZXh0XCI7XG4gICAgICBzdWJjb21tYW5kcyA9IGNtZC5jbWRzLmxlbmd0aCA/IGBcXG5TdWItQ29tbWFuZHMgOlxcbn5+bHMgJHtjbWQuZnVsbE5hbWV9IGJveDpubyBjb250ZXh0Om5vfn5gIDogXCJcIjtcbiAgICAgIHJldHVybiBgfn5ib3h+flxcbkhlbHAgZm9yIH5+ISR7Y21kLmZ1bGxOYW1lfX5+IDpcXG5cXG4ke3RleHR9XFxuJHtzdWJjb21tYW5kc31cXG5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ35+aGVscDpvdmVydmlld35+JztcbiAgfVxufTtcblxubm9fZXhlY3V0ZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciByZWc7XG4gIHJlZyA9IG5ldyBSZWdFeHAoXCJeKFwiICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzKSArICcpJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikpO1xuICByZXR1cm4gaW5zdGFuY2Uuc3RyLnJlcGxhY2UocmVnLCAnJDEnKTtcbn07XG5cbnF1b3RlX2NhcnJldCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHJldHVybiBpbnN0YW5jZS5jb250ZW50LnJlcGxhY2UoL1xcfC9nLCAnfHwnKTtcbn07XG5cbmV4ZWNfcGFyZW50ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIHJlcztcbiAgaWYgKGluc3RhbmNlLnBhcmVudCAhPSBudWxsKSB7XG4gICAgcmVzID0gaW5zdGFuY2UucGFyZW50LmV4ZWN1dGUoKTtcbiAgICBpbnN0YW5jZS5yZXBsYWNlU3RhcnQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZVN0YXJ0O1xuICAgIGluc3RhbmNlLnJlcGxhY2VFbmQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZUVuZDtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59O1xuXG5nZXRDb250ZW50ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGFmZml4ZXNfZW1wdHksIHByZWZpeCwgc3VmZml4O1xuICBhZmZpeGVzX2VtcHR5ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydhZmZpeGVzX2VtcHR5J10sIGZhbHNlKTtcbiAgcHJlZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICBzdWZmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG4gIGlmIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuY29udGVudCB8fCAnJykgKyBzdWZmaXg7XG4gIH1cbiAgaWYgKGFmZml4ZXNfZW1wdHkpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgc3VmZml4O1xuICB9XG59O1xuXG5yZW5hbWVDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgIHZhciBzdG9yYWdlO1xuICAgIHN0b3JhZ2UgPSBDb21tYW5kLnN0b3JhZ2U7XG4gICAgcmV0dXJuIHN0b3JhZ2UubG9hZCgnY21kcycpO1xuICB9KS50aGVuKChzYXZlZENtZHMpID0+IHtcbiAgICB2YXIgY21kLCBjbWREYXRhLCBuZXdOYW1lLCBvcmlnbmluYWxOYW1lO1xuICAgIG9yaWduaW5hbE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2Zyb20nXSk7XG4gICAgbmV3TmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAndG8nXSk7XG4gICAgaWYgKChvcmlnbmluYWxOYW1lICE9IG51bGwpICYmIChuZXdOYW1lICE9IG51bGwpKSB7XG4gICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChvcmlnbmluYWxOYW1lKTtcbiAgICAgIGlmICgoc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdICE9IG51bGwpICYmIChjbWQgIT0gbnVsbCkpIHtcbiAgICAgICAgaWYgKCEobmV3TmFtZS5pbmRleE9mKCc6JykgPiAtMSkpIHtcbiAgICAgICAgICBuZXdOYW1lID0gY21kLmZ1bGxOYW1lLnJlcGxhY2Uob3JpZ25pbmFsTmFtZSwgJycpICsgbmV3TmFtZTtcbiAgICAgICAgfVxuICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdO1xuICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShuZXdOYW1lLCBjbWREYXRhKTtcbiAgICAgICAgY21kLnVucmVnaXN0ZXIoKTtcbiAgICAgICAgc2F2ZWRDbWRzW25ld05hbWVdID0gY21kRGF0YTtcbiAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBzdG9yYWdlLnNhdmUoJ2NtZHMnLCBzYXZlZENtZHMpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5yZW1vdmVDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgIHZhciBuYW1lO1xuICAgIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKTtcbiAgICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBzYXZlZENtZHMsIHN0b3JhZ2U7XG4gICAgICAgIHN0b3JhZ2UgPSBDb21tYW5kLnN0b3JhZ2U7XG4gICAgICAgIHJldHVybiBzYXZlZENtZHMgPSBzdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgICAgIH0pLnRoZW4oKHNhdmVkQ21kcykgPT4ge1xuICAgICAgICB2YXIgY21kLCBjbWREYXRhO1xuICAgICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChuYW1lKTtcbiAgICAgICAgaWYgKChzYXZlZENtZHNbbmFtZV0gIT0gbnVsbCkgJiYgKGNtZCAhPSBudWxsKSkge1xuICAgICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbbmFtZV07XG4gICAgICAgICAgY21kLnVucmVnaXN0ZXIoKTtcbiAgICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW25hbWVdO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLnNhdmUoJ2NtZHMnLCBzYXZlZENtZHMpO1xuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5hbGlhc0NvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgYWxpYXMsIGNtZCwgbmFtZTtcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgYWxpYXMgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2FsaWFzJ10pO1xuICBpZiAoKG5hbWUgIT0gbnVsbCkgJiYgKGFsaWFzICE9IG51bGwpKSB7XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQobmFtZSk7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQgPSBjbWQuZ2V0QWxpYXNlZCgpIHx8IGNtZDtcbiAgICAgIC8vIHVubGVzcyBhbGlhcy5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgLy8gYWxpYXMgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShuYW1lLCcnKSArIGFsaWFzXG4gICAgICBDb21tYW5kLnNhdmVDbWQoYWxpYXMsIHtcbiAgICAgICAgYWxpYXNPZjogY21kLmZ1bGxOYW1lXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgfVxuICB9XG59O1xuXG5saXN0Q29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBib3gsIGNvbW1hbmRzLCBjb250ZXh0LCBuYW1lLCBuYW1lc3BhY2VzLCB0ZXh0LCB1c2VDb250ZXh0O1xuICBib3ggPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydib3gnXSwgdHJ1ZSk7XG4gIHVzZUNvbnRleHQgPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydjb250ZXh0J10sIHRydWUpO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBuYW1lc3BhY2VzID0gbmFtZSA/IFtuYW1lXSA6IGluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLmZpbHRlcigobnNwYykgPT4ge1xuICAgIHJldHVybiBuc3BjICE9PSBpbnN0YW5jZS5jbWQuZnVsbE5hbWU7XG4gIH0pLmNvbmNhdChcIl9yb290XCIpO1xuICBjb250ZXh0ID0gdXNlQ29udGV4dCA/IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkgOiBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dDtcbiAgY29tbWFuZHMgPSBuYW1lc3BhY2VzLnJlZHVjZSgoY29tbWFuZHMsIG5zcGMpID0+IHtcbiAgICB2YXIgY21kO1xuICAgIGNtZCA9IG5zcGMgPT09IFwiX3Jvb3RcIiA/IENvbW1hbmQuY21kcyA6IGNvbnRleHQuZ2V0Q21kKG5zcGMsIHtcbiAgICAgIG11c3RFeGVjdXRlOiBmYWxzZVxuICAgIH0pO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuY21kcykge1xuICAgICAgICBjb21tYW5kcyA9IGNvbW1hbmRzLmNvbmNhdChjbWQuY21kcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb21tYW5kcztcbiAgfSwgW10pO1xuICB0ZXh0ID0gY29tbWFuZHMubGVuZ3RoID8gY29tbWFuZHMubWFwKChjbWQpID0+IHtcbiAgICBjbWQuaW5pdCgpO1xuICAgIHJldHVybiAoY21kLmlzRXhlY3V0YWJsZSgpID8gJ35+IScgOiAnfn4hbHMgJykgKyBjbWQuZnVsbE5hbWUgKyAnfn4nO1xuICB9KS5qb2luKFwiXFxuXCIpIDogXCJUaGlzIGNvbnRhaW5zIG5vIHN1Yi1jb21tYW5kc1wiO1xuICBpZiAoYm94KSB7XG4gICAgcmV0dXJuIGB+fmJveH5+XFxuJHt0ZXh0fVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0ZXh0O1xuICB9XG59O1xuXG5nZXRDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHJlcztcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgcmVzID0gUGF0aEhlbHBlci5nZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIG5hbWUpO1xuICBpZiAodHlwZW9mIHJlcyA9PT0gXCJvYmplY3RcIikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsICcgICcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbnNldENvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgbmFtZSwgcCwgdmFsO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAndmFsdWUnLCAndmFsJ10pKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSwgdmFsKTtcbiAgcmV0dXJuICcnO1xufTtcblxuc3RvcmVKc29uQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWw7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdqc29uJ10pKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSwgSlNPTi5wYXJzZSh2YWwpKTtcbiAgcmV0dXJuICcnO1xufTtcblxuZ2V0UGFyYW0gPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpZiAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuZ2V0UGFyYW0oaW5zdGFuY2UucGFyYW1zLCBpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsICdkZWZhdWx0J10pKTtcbiAgfVxufTtcblxuQm94Q21kID0gY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpO1xuICAgIHRoaXMuY21kID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ2NtZCddKTtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5oZWxwZXIub3BlblRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZCArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIHRoaXMuaGVscGVyLmNsb3NlVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWQuc3BsaXQoXCIgXCIpWzBdICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzO1xuICAgIH1cbiAgICB0aGlzLmhlbHBlci5kZWNvID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5kZWNvO1xuICAgIHRoaXMuaGVscGVyLnBhZCA9IDI7XG4gICAgdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpO1xuICB9XG5cbiAgaGVpZ2h0KCkge1xuICAgIHZhciBoZWlnaHQsIHBhcmFtcztcbiAgICBpZiAodGhpcy5ib3VuZHMoKSAhPSBudWxsKSB7XG4gICAgICBoZWlnaHQgPSB0aGlzLmJvdW5kcygpLmhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVpZ2h0ID0gMztcbiAgICB9XG4gICAgcGFyYW1zID0gWydoZWlnaHQnXTtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSkge1xuICAgICAgcGFyYW1zLnB1c2goMSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgICBwYXJhbXMucHVzaCgwKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCBoZWlnaHQpO1xuICB9XG5cbiAgd2lkdGgoKSB7XG4gICAgdmFyIHBhcmFtcywgd2lkdGg7XG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgd2lkdGggPSB0aGlzLmJvdW5kcygpLndpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aWR0aCA9IDM7XG4gICAgfVxuICAgIHBhcmFtcyA9IFsnd2lkdGgnXTtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSkge1xuICAgICAgcGFyYW1zLnB1c2goMCk7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1heCh0aGlzLm1pbldpZHRoKCksIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCB3aWR0aCkpO1xuICB9XG5cbiAgYm91bmRzKCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIGlmICh0aGlzLl9ib3VuZHMgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9ib3VuZHMgPSB0aGlzLmhlbHBlci50ZXh0Qm91bmRzKHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fYm91bmRzO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB0aGlzLmhlbHBlci5oZWlnaHQgPSB0aGlzLmhlaWdodCgpO1xuICAgIHRoaXMuaGVscGVyLndpZHRoID0gdGhpcy53aWR0aCgpO1xuICAgIHJldHVybiB0aGlzLmhlbHBlci5kcmF3KHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gIH1cblxuICBtaW5XaWR0aCgpIHtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY21kLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG5cbn07XG5cbkNsb3NlQ21kID0gY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgYm94LCBib3gyLCBkZXB0aCwgcHJlZml4LCByZXF1aXJlZF9hZmZpeGVzLCBzdWZmaXg7XG4gICAgcHJlZml4ID0gdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gICAgc3VmZml4ID0gdGhpcy5oZWxwZXIuc3VmZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG4gICAgYm94ID0gdGhpcy5oZWxwZXIuZ2V0Qm94Rm9yUG9zKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkpO1xuICAgIHJlcXVpcmVkX2FmZml4ZXMgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncmVxdWlyZWRfYWZmaXhlcyddLCB0cnVlKTtcbiAgICBpZiAoIXJlcXVpcmVkX2FmZml4ZXMpIHtcbiAgICAgIHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaGVscGVyLnN1ZmZpeCA9ICcnO1xuICAgICAgYm94MiA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKTtcbiAgICAgIGlmICgoYm94MiAhPSBudWxsKSAmJiAoKGJveCA9PSBudWxsKSB8fCBib3guc3RhcnQgPCBib3gyLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCB8fCBib3guZW5kID4gYm94Mi5lbmQgKyBzdWZmaXgubGVuZ3RoKSkge1xuICAgICAgICBib3ggPSBib3gyO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYm94ICE9IG51bGwpIHtcbiAgICAgIGRlcHRoID0gdGhpcy5oZWxwZXIuZ2V0TmVzdGVkTHZsKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkuc3RhcnQpO1xuICAgICAgaWYgKGRlcHRoIDwgMikge1xuICAgICAgICB0aGlzLmluc3RhbmNlLmluQm94ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KGJveC5zdGFydCwgYm94LmVuZCwgJycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UucmVwbGFjZVdpdGgoJycpO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kID0gY2xhc3MgRWRpdENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB2YXIgcmVmO1xuICAgIHRoaXMuY21kTmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG4gICAgdGhpcy52ZXJiYWxpemUgPSAocmVmID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMV0pKSA9PT0gJ3YnIHx8IHJlZiA9PT0gJ3ZlcmJhbGl6ZSc7XG4gICAgaWYgKHRoaXMuY21kTmFtZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmZpbmRlciA9IHRoaXMuaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRGaW5kZXIodGhpcy5jbWROYW1lKTtcbiAgICAgIHRoaXMuZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlO1xuICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVkaXRhYmxlID0gdGhpcy5jbWQgIT0gbnVsbCA/IHRoaXMuY21kLmlzRWRpdGFibGUoKSA6IHRydWU7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0V2l0aENvbnRlbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0V2l0aG91dENvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICByZXN1bHRXaXRoQ29udGVudCgpIHtcbiAgICB2YXIgZGF0YSwgaSwgbGVuLCBwLCBwYXJzZXIsIHJlZjtcbiAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgICBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICBkYXRhID0ge307XG4gICAgcmVmID0gRWRpdENtZC5wcm9wcztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHAgPSByZWZbaV07XG4gICAgICBwLndyaXRlRm9yKHBhcnNlciwgZGF0YSk7XG4gICAgfVxuICAgIENvbW1hbmQuc2F2ZUNtZCh0aGlzLmNtZE5hbWUsIGRhdGEpO1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHByb3BzRGlzcGxheSgpIHtcbiAgICB2YXIgY21kO1xuICAgIGNtZCA9IHRoaXMuY21kO1xuICAgIHJldHVybiBFZGl0Q21kLnByb3BzLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gcC5kaXNwbGF5KGNtZCk7XG4gICAgfSkuZmlsdGVyKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBwICE9IG51bGw7XG4gICAgfSkuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHJlc3VsdFdpdGhvdXRDb250ZW50KCkge1xuICAgIHZhciBuYW1lLCBwYXJzZXI7XG4gICAgaWYgKCF0aGlzLmNtZCB8fCB0aGlzLmVkaXRhYmxlKSB7XG4gICAgICBuYW1lID0gdGhpcy5jbWQgPyB0aGlzLmNtZC5mdWxsTmFtZSA6IHRoaXMuY21kTmFtZTtcbiAgICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChgfn5ib3ggY21kOlwiJHt0aGlzLmluc3RhbmNlLmNtZC5mdWxsTmFtZX0gJHtuYW1lfVwifn5cXG4ke3RoaXMucHJvcHNEaXNwbGF5KCl9XFxufn4hc2F2ZX5+IH5+IWNsb3Nlfn5cXG5+fi9ib3h+fmApO1xuICAgICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy52ZXJiYWxpemUpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5nZXRUZXh0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWQuc2V0Q21kcyA9IGZ1bmN0aW9uKGJhc2UpIHtcbiAgdmFyIGksIGluSW5zdGFuY2UsIGxlbiwgcCwgcmVmO1xuICBpbkluc3RhbmNlID0gYmFzZS5pbl9pbnN0YW5jZSA9IHtcbiAgICBjbWRzOiB7fVxuICB9O1xuICByZWYgPSBFZGl0Q21kLnByb3BzO1xuICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBwID0gcmVmW2ldO1xuICAgIHAuc2V0Q21kKGluSW5zdGFuY2UuY21kcyk7XG4gIH1cbiAgLy8gcC5zZXRDbWQoYmFzZSlcbiAgcmV0dXJuIGJhc2U7XG59O1xuXG5FZGl0Q21kLnByb3BzID0gW1xuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fY2FycmV0JyxcbiAge1xuICAgIG9wdDogJ2NoZWNrQ2FycmV0J1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJyxcbiAge1xuICAgIG9wdDogJ3BhcnNlJ1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3ByZXZlbnRfcGFyc2VfYWxsJyxcbiAge1xuICAgIG9wdDogJ3ByZXZlbnRQYXJzZUFsbCdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCdyZXBsYWNlX2JveCcsXG4gIHtcbiAgICBvcHQ6ICdyZXBsYWNlQm94J1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnbmFtZV90b19wYXJhbScsXG4gIHtcbiAgICBvcHQ6ICduYW1lVG9QYXJhbSdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoJ2FsaWFzX29mJyxcbiAge1xuICAgIHZhcjogJ2FsaWFzT2YnLFxuICAgIGNhcnJldDogdHJ1ZVxuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnaGVscCcsXG4gIHtcbiAgICBmdW5jdDogJ2hlbHAnLFxuICAgIHNob3dFbXB0eTogdHJ1ZVxuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnc291cmNlJyxcbiAge1xuICAgIHZhcjogJ3Jlc3VsdFN0cicsXG4gICAgZGF0YU5hbWU6ICdyZXN1bHQnLFxuICAgIHNob3dFbXB0eTogdHJ1ZSxcbiAgICBjYXJyZXQ6IHRydWVcbiAgfSlcbl07XG5cbk5hbWVTcGFjZUNtZCA9IGNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMF0pO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBpLCBsZW4sIG5hbWVzcGFjZXMsIG5zcGMsIHBhcnNlciwgdHh0O1xuICAgIGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5uYW1lKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZXNwYWNlcyA9IHRoaXMuaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCk7XG4gICAgICB0eHQgPSAnfn5ib3h+flxcbic7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lc3BhY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIG5zcGMgPSBuYW1lc3BhY2VzW2ldO1xuICAgICAgICBpZiAobnNwYyAhPT0gdGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWUpIHtcbiAgICAgICAgICB0eHQgKz0gbnNwYyArICdcXG4nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0eHQgKz0gJ35+IWNsb3NlfH5+XFxufn4vYm94fn4nO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dCk7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgfVxuICB9XG5cbn07XG5cblRlbXBsYXRlQ21kID0gY2xhc3MgVGVtcGxhdGVDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gICAgcmV0dXJuIHRoaXMuc2VwID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3NlcCddLCBcIlxcblwiKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0gdGhpcy5uYW1lID8gUGF0aEhlbHBlci5nZXRQYXRoKHRoaXMuaW5zdGFuY2UuY29kZXdhdmUudmFycywgdGhpcy5uYW1lKSA6IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUudmFycztcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50ICYmIChkYXRhICE9IG51bGwpICYmIGRhdGEgIT09IGZhbHNlKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICByZXR1cm4gZGF0YS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZShpdGVtKTtcbiAgICAgICAgfSkuam9pbih0aGlzLnNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZShkYXRhKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRlbXBsYXRlKGRhdGEpIHtcbiAgICB2YXIgcGFyc2VyO1xuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgIHBhcnNlci52YXJzID0gdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgPyBkYXRhIDoge1xuICAgICAgdmFsdWU6IGRhdGFcbiAgICB9O1xuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlO1xuICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgfVxuXG59O1xuXG5FbW1ldENtZCA9IGNsYXNzIEVtbWV0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHRoaXMuYWJiciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdhYmJyJywgJ2FiYnJldmlhdGlvbiddKTtcbiAgICByZXR1cm4gdGhpcy5sYW5nID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2xhbmcnLCAnbGFuZ3VhZ2UnXSk7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdmFyIGVtbWV0LCBleCwgcmVzO1xuICAgIGVtbWV0ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyB3aW5kb3cuZW1tZXQgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5lbW1ldDtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsID8gKHJlZiA9IHdpbmRvdy5zZWxmKSAhPSBudWxsID8gcmVmLmVtbWV0IDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuc2VsZi5lbW1ldDtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsID8gKHJlZjEgPSB3aW5kb3cuZ2xvYmFsKSAhPSBudWxsID8gcmVmMS5lbW1ldCA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93Lmdsb2JhbC5lbW1ldDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlcXVpcmUgIT09IFwidW5kZWZpbmVkXCIgJiYgcmVxdWlyZSAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiByZXF1aXJlKCdlbW1ldCcpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGV4ID0gZXJyb3I7XG4gICAgICAgICAgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5sb2dnZXIubG9nKCdFbW1ldCBpcyBub3QgYXZhaWxhYmxlLCBpdCBtYXkgbmVlZCB0byBiZSBpbnN0YWxsZWQgbWFudWFsbHknKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pLmNhbGwodGhpcyk7XG4gICAgaWYgKGVtbWV0ICE9IG51bGwpIHtcbiAgICAgIC8vIGVtbWV0LnJlcXVpcmUoJy4vcGFyc2VyL2FiYnJldmlhdGlvbicpLmV4cGFuZCgndWw+bGknLCB7cGFzdGVkQ29udGVudDonbG9yZW0nfSlcbiAgICAgIHJlcyA9IGVtbWV0LmV4cGFuZEFiYnJldmlhdGlvbih0aGlzLmFiYnIsIHRoaXMubGFuZyk7XG4gICAgICByZXR1cm4gcmVzLnJlcGxhY2UoL1xcJFxcezBcXH0vZywgJ3wnKTtcbiAgICB9XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgSHRtbENvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAgaHRtbCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdodG1sJykpXG4gIGh0bWwuYWRkQ21kcyh7XG4gICAgJ2ZhbGxiYWNrJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTplbW1ldCcsXG4gICAgICAnZGVmYXVsdHMnIDogeydsYW5nJzonaHRtbCd9LFxuICAgICAgJ25hbWVUb1BhcmFtJyA6ICdhYmJyJ1xuICAgIH0sXG4gIH0pXG4gIFxuICBjc3MgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY3NzJykpXG4gIGNzcy5hZGRDbWRzKHtcbiAgICAnZmFsbGJhY2snOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOmVtbWV0JyxcbiAgICAgICdkZWZhdWx0cycgOiB7J2xhbmcnOidjc3MnfSxcbiAgICAgICduYW1lVG9QYXJhbScgOiAnYWJicidcbiAgICB9LFxuICB9KVxuXG4iLCJpbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIEh0bWxDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBIdG1sQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBjc3MsIGh0bWw7XG4gICAgaHRtbCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdodG1sJykpO1xuICAgIGh0bWwuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICAnZGVmYXVsdHMnOiB7XG4gICAgICAgICAgJ2xhbmcnOiAnaHRtbCdcbiAgICAgICAgfSxcbiAgICAgICAgJ25hbWVUb1BhcmFtJzogJ2FiYnInXG4gICAgICB9XG4gICAgfSk7XG4gICAgY3NzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NzcycpKTtcbiAgICByZXR1cm4gY3NzLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmVtbWV0JyxcbiAgICAgICAgJ2RlZmF1bHRzJzoge1xuICAgICAgICAgICdsYW5nJzogJ2NzcydcbiAgICAgICAgfSxcbiAgICAgICAgJ25hbWVUb1BhcmFtJzogJ2FiYnInXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgSnNDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGpzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2pzJykpXG4gIGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqYXZhc2NyaXB0Jyx7IGFsaWFzT2Y6ICdqcycgfSkpXG4gIGpzLmFkZENtZHMoe1xuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAnaWYnOiAgJ2lmKHwpe1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2xvZyc6ICAnaWYod2luZG93LmNvbnNvbGUpe1xcblxcdGNvbnNvbGUubG9nKH5+Y29udGVudH5+fClcXG59JyxcbiAgICAnZnVuY3Rpb24nOlx0J2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnZnVuY3QnOnsgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJyB9LFxuICAgICdmJzp7ICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nIH0sXG4gICAgJ2Zvcic6IFx0XHQnZm9yICh2YXIgaSA9IDA7IGkgPCB8OyBpKyspIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdmb3Jpbic6J2ZvciAodmFyIHZhbCBpbiB8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnZWFjaCc6eyAgYWxpYXNPZjogJ2pzOmZvcmluJyB9LFxuICAgICdmb3JlYWNoJzp7ICBhbGlhc09mOiAnanM6Zm9yaW4nIH0sXG4gICAgJ3doaWxlJzogICd3aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnd2hpbGVpJzogJ3ZhciBpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG5cXHRpKys7XFxufScsXG4gICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgJ2lmZSc6eyAgIGFsaWFzT2Y6ICdqczppZmVsc2UnIH0sXG4gICAgJ3N3aXRjaCc6XHRcIlwiXCJcbiAgICAgIHN3aXRjaCggfCApIHsgXG4gICAgICBcXHRjYXNlIDpcbiAgICAgIFxcdFxcdH5+Y29udGVudH5+XG4gICAgICBcXHRcXHRicmVhaztcbiAgICAgIFxcdGRlZmF1bHQgOlxuICAgICAgXFx0XFx0XG4gICAgICBcXHRcXHRicmVhaztcbiAgICAgIH1cbiAgICAgIFwiXCJcIixcbiAgfSlcbiIsImltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgSnNDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBKc0NvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIganM7XG4gICAganMgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnanMnKSk7XG4gICAgY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2phdmFzY3JpcHQnLCB7XG4gICAgICBhbGlhc09mOiAnanMnXG4gICAgfSkpO1xuICAgIHJldHVybiBqcy5hZGRDbWRzKHtcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgICdpZic6ICdpZih8KXtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2xvZyc6ICdpZih3aW5kb3cuY29uc29sZSl7XFxuXFx0Y29uc29sZS5sb2cofn5jb250ZW50fn58KVxcbn0nLFxuICAgICAgJ2Z1bmN0aW9uJzogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdmdW5jdCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2Zvcic6ICdmb3IgKHZhciBpID0gMDsgaSA8IHw7IGkrKykge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZm9yaW4nOiAnZm9yICh2YXIgdmFsIGluIHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2VhY2gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmb3JpbidcbiAgICAgIH0sXG4gICAgICAnZm9yZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgICd3aGlsZSc6ICd3aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICd3aGlsZWknOiAndmFyIGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcblxcdGkrKztcXG59JyxcbiAgICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgJ2lmZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmlmZWxzZSdcbiAgICAgIH0sXG4gICAgICAnc3dpdGNoJzogXCJzd2l0Y2goIHwgKSB7IFxcblxcdGNhc2UgOlxcblxcdFxcdH5+Y29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufVwiXG4gICAgfSk7XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgUGFpckRldGVjdG9yIH0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuXG5leHBvcnQgY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpXG4gIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICByZXN1bHQ6ICdwaHA6aW5uZXInLFxuICAgIG9wZW5lcjogJzw/cGhwJyxcbiAgICBjbG9zZXI6ICc/PicsXG4gICAgb3B0aW9ubmFsX2VuZDogdHJ1ZSxcbiAgICAnZWxzZSc6ICdwaHA6b3V0ZXInXG4gIH0pKSBcblxuICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpXG4gIHBocE91dGVyLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnYW55X2NvbnRlbnQnOiB7IFxuICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnIFxuICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICBwcmVmaXg6ICcgPz5cXG4nXG4gICAgICAgICAgICBzdWZmaXg6ICdcXG48P3BocCAnXG4gICAgICAgICAgICBhZmZpeGVzX2VtcHR5OiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjolbmFtZSUnLFxuICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgfSxcbiAgICAnYm94JzogeyBcbiAgICAgIGFsaWFzT2Y6ICdjb3JlOmJveCcgXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBwcmVmaXg6ICc8P3BocFxcbidcbiAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICB9XG4gICAgfSxcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgcGhwOiAnPD9waHBcXG5cXHR+fmNvbnRlbnR+fnxcXG4/PicsXG4gIH0pXG4gIFxuICBwaHBJbm5lciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ2lubmVyJykpXG4gIHBocElubmVyLmFkZENtZHMoe1xuICAgICdhbnlfY29udGVudCc6IHsgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcgfSxcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgJ2lmJzogICAnaWYofCl7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ2luZm8nOiAncGhwaW5mbygpOycsXG4gICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAnZSc6eyAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZWNobycgfSxcbiAgICAnY2xhc3MnOntcbiAgICAgIHJlc3VsdCA6IFwiXCJcIlxuICAgICAgICBjbGFzcyB+fnBhcmFtIDAgY2xhc3MgZGVmOnx+fiB7XG4gICAgICAgIFxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xuICAgICAgICBcXHRcXHR+fmNvbnRlbnR+fnxcbiAgICAgICAgXFx0fVxuICAgICAgICB9XG4gICAgICAgIFwiXCJcIixcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdjJzp7ICAgICBhbGlhc09mOiAncGhwOmlubmVyOmNsYXNzJyB9LFxuICAgICdmdW5jdGlvbic6XHR7XG4gICAgICByZXN1bHQgOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAnZnVuY3QnOnsgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbicgfSxcbiAgICAnZic6eyAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbicgfSxcbiAgICAnYXJyYXknOiAgJyR8ID0gYXJyYXkoKTsnLFxuICAgICdhJzpcdCAgICAnYXJyYXkoKScsXG4gICAgJ2Zvcic6IFx0XHQnZm9yICgkaSA9IDA7ICRpIDwgJHw7ICRpKyspIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnZm9yZWFjaCc6J2ZvcmVhY2ggKCR8IGFzICRrZXkgPT4gJHZhbCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICdlYWNoJzp7ICBhbGlhc09mOiAncGhwOmlubmVyOmZvcmVhY2gnIH0sXG4gICAgJ3doaWxlJzogICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ3doaWxlaSc6IHtcbiAgICAgIHJlc3VsdCA6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgJ2lmZSc6eyAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6aWZlbHNlJyB9LFxuICAgICdzd2l0Y2gnOlx0e1xuICAgICAgcmVzdWx0IDogXCJcIlwiXG4gICAgICAgIHN3aXRjaCggfCApIHsgXG4gICAgICAgIFxcdGNhc2UgOlxuICAgICAgICBcXHRcXHR+fmFueV9jb250ZW50fn5cbiAgICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICAgIFxcdGRlZmF1bHQgOlxuICAgICAgICBcXHRcXHRcbiAgICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiLFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICAnY2xvc2UnOiB7IFxuICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnIFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nXG4gICAgICAgIHN1ZmZpeDogJ1xcbj8+J1xuICAgICAgICByZXF1aXJlZF9hZmZpeGVzOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gIH0pXG4gIFxuXG53cmFwV2l0aFBocCA9IChyZXN1bHQsaW5zdGFuY2UpIC0+XG4gIGlubGluZSA9IGluc3RhbmNlLmdldFBhcmFtKFsncGhwX2lubGluZScsJ2lubGluZSddLHRydWUpXG4gIGlmIGlubGluZVxuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nXG4gICAgcmVnQ2xvc2UgPSAvKFtcXG5cXHJcXHNdKylcXHNcXD8+L2dcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nXG4gIGVsc2VcbiAgICAnPD9waHBcXG4nICsgU3RyaW5nSGVscGVyLmluZGVudChyZXN1bHQpICsgJ1xcbj8+J1xuXG4jIGNsb3NlUGhwRm9yQ29udGVudCA9IChpbnN0YW5jZSkgLT5cbiMgICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnIiwidmFyIHdyYXBXaXRoUGhwO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBQYWlyRGV0ZWN0b3Jcbn0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuXG5leHBvcnQgdmFyIFBocENvbW1hbmRQcm92aWRlciA9IGNsYXNzIFBocENvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgcGhwLCBwaHBJbm5lciwgcGhwT3V0ZXI7XG4gICAgcGhwID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ3BocCcpKTtcbiAgICBwaHAuYWRkRGV0ZWN0b3IobmV3IFBhaXJEZXRlY3Rvcih7XG4gICAgICByZXN1bHQ6ICdwaHA6aW5uZXInLFxuICAgICAgb3BlbmVyOiAnPD9waHAnLFxuICAgICAgY2xvc2VyOiAnPz4nLFxuICAgICAgb3B0aW9ubmFsX2VuZDogdHJ1ZSxcbiAgICAgICdlbHNlJzogJ3BocDpvdXRlcidcbiAgICB9KSk7XG4gICAgcGhwT3V0ZXIgPSBwaHAuYWRkQ21kKG5ldyBDb21tYW5kKCdvdXRlcicpKTtcbiAgICBwaHBPdXRlci5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ2FueV9jb250ZW50Jzoge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcsXG4gICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICBwcmVmaXg6ICcgPz5cXG4nLFxuICAgICAgICAgICAgICBzdWZmaXg6ICdcXG48P3BocCAnLFxuICAgICAgICAgICAgICBhZmZpeGVzX2VtcHR5OiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOiVuYW1lJScsXG4gICAgICAgIGFsdGVyUmVzdWx0OiB3cmFwV2l0aFBocFxuICAgICAgfSxcbiAgICAgICdib3gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmJveCcsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nLFxuICAgICAgICAgIHN1ZmZpeDogJ1xcbj8+J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgcGhwOiAnPD9waHBcXG5cXHR+fmNvbnRlbnR+fnxcXG4/PidcbiAgICB9KTtcbiAgICBwaHBJbm5lciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ2lubmVyJykpO1xuICAgIHJldHVybiBwaHBJbm5lci5hZGRDbWRzKHtcbiAgICAgICdhbnlfY29udGVudCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCdcbiAgICAgIH0sXG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICAnaWYnOiAnaWYofCl7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnaW5mbyc6ICdwaHBpbmZvKCk7JyxcbiAgICAgICdlY2hvJzogJ2VjaG8gfCcsXG4gICAgICAnZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjplY2hvJ1xuICAgICAgfSxcbiAgICAgICdjbGFzcyc6IHtcbiAgICAgICAgcmVzdWx0OiBcImNsYXNzIH5+cGFyYW0gMCBjbGFzcyBkZWY6fH5+IHtcXG5cXHRmdW5jdGlvbiBfX2NvbnN0cnVjdCgpIHtcXG5cXHRcXHR+fmNvbnRlbnR+fnxcXG5cXHR9XFxufVwiLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmNsYXNzJ1xuICAgICAgfSxcbiAgICAgICdmdW5jdGlvbic6IHtcbiAgICAgICAgcmVzdWx0OiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdmdW5jdCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZic6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnYXJyYXknOiAnJHwgPSBhcnJheSgpOycsXG4gICAgICAnYSc6ICdhcnJheSgpJyxcbiAgICAgICdmb3InOiAnZm9yICgkaSA9IDA7ICRpIDwgJHw7ICRpKyspIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdmb3JlYWNoJzogJ2ZvcmVhY2ggKCR8IGFzICRrZXkgPT4gJHZhbCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2VhY2gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Zm9yZWFjaCdcbiAgICAgIH0sXG4gICAgICAnd2hpbGUnOiAnd2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ3doaWxlaSc6IHtcbiAgICAgICAgcmVzdWx0OiAnJGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG5cXHQkaSsrO1xcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAgICdpZmUnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6aWZlbHNlJ1xuICAgICAgfSxcbiAgICAgICdzd2l0Y2gnOiB7XG4gICAgICAgIHJlc3VsdDogXCJzd2l0Y2goIHwgKSB7IFxcblxcdGNhc2UgOlxcblxcdFxcdH5+YW55X2NvbnRlbnR+flxcblxcdFxcdGJyZWFrO1xcblxcdGRlZmF1bHQgOlxcblxcdFxcdFxcblxcdFxcdGJyZWFrO1xcbn1cIixcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnY2xvc2UnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNsb3NlJyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nLFxuICAgICAgICAgIHJlcXVpcmVkX2FmZml4ZXM6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuXG53cmFwV2l0aFBocCA9IGZ1bmN0aW9uKHJlc3VsdCwgaW5zdGFuY2UpIHtcbiAgdmFyIGlubGluZSwgcmVnQ2xvc2UsIHJlZ09wZW47XG4gIGlubGluZSA9IGluc3RhbmNlLmdldFBhcmFtKFsncGhwX2lubGluZScsICdpbmxpbmUnXSwgdHJ1ZSk7XG4gIGlmIChpbmxpbmUpIHtcbiAgICByZWdPcGVuID0gLzxcXD9waHBcXHMoW1xcXFxuXFxcXHJcXHNdKykvZztcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZztcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnPD9waHBcXG4nICsgU3RyaW5nSGVscGVyLmluZGVudChyZXN1bHQpICsgJ1xcbj8+JztcbiAgfVxufTtcblxuLy8gY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuLy8gICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnXG4iLCJpbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vYm9vdHN0cmFwJztcbmltcG9ydCB7IFRleHRBcmVhRWRpdG9yIH0gZnJvbSAnLi9UZXh0QXJlYUVkaXRvcic7XG5cbkNvZGV3YXZlLmRldGVjdCA9ICh0YXJnZXQpIC0+XG4gIGN3ID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvcih0YXJnZXQpKVxuICBDb2Rld2F2ZS5pbnN0YW5jZXMucHVzaChjdylcbiAgY3dcblxuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmVcblxud2luZG93LkNvZGV3YXZlID0gQ29kZXdhdmVcblxuICAiLCJpbXBvcnQge1xuICBDb2Rld2F2ZVxufSBmcm9tICcuL2Jvb3RzdHJhcCc7XG5cbmltcG9ydCB7XG4gIFRleHRBcmVhRWRpdG9yXG59IGZyb20gJy4vVGV4dEFyZWFFZGl0b3InO1xuXG5Db2Rld2F2ZS5kZXRlY3QgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgdmFyIGN3O1xuICBjdyA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dEFyZWFFZGl0b3IodGFyZ2V0KSk7XG4gIENvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KTtcbiAgcmV0dXJuIGN3O1xufTtcblxuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmU7XG5cbndpbmRvdy5Db2Rld2F2ZSA9IENvZGV3YXZlO1xuIiwiZXhwb3J0IGNsYXNzIEFycmF5SGVscGVyXG4gIEBpc0FycmF5OiAoYXJyKSAtPlxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIGFyciApID09ICdbb2JqZWN0IEFycmF5XSdcbiAgXG4gIEB1bmlvbjogKGExLGEyKSAtPlxuICAgIEB1bmlxdWUoYTEuY29uY2F0KGEyKSlcbiAgICBcbiAgQHVuaXF1ZTogKGFycmF5KSAtPlxuICAgIGEgPSBhcnJheS5jb25jYXQoKVxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IGEubGVuZ3RoXG4gICAgICBqID0gaSArIDFcbiAgICAgIHdoaWxlIGogPCBhLmxlbmd0aFxuICAgICAgICBpZiBhW2ldID09IGFbal1cbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpXG4gICAgICAgICsralxuICAgICAgKytpXG4gICAgYSIsImV4cG9ydCB2YXIgQXJyYXlIZWxwZXIgPSBjbGFzcyBBcnJheUhlbHBlciB7XG4gIHN0YXRpYyBpc0FycmF5KGFycikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfVxuXG4gIHN0YXRpYyB1bmlvbihhMSwgYTIpIHtcbiAgICByZXR1cm4gdGhpcy51bmlxdWUoYTEuY29uY2F0KGEyKSk7XG4gIH1cblxuICBzdGF0aWMgdW5pcXVlKGFycmF5KSB7XG4gICAgdmFyIGEsIGksIGo7XG4gICAgYSA9IGFycmF5LmNvbmNhdCgpO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgYS5sZW5ndGgpIHtcbiAgICAgIGogPSBpICsgMTtcbiAgICAgIHdoaWxlIChqIDwgYS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGFbaV0gPT09IGFbal0pIHtcbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpO1xuICAgICAgICB9XG4gICAgICAgICsrajtcbiAgICAgIH1cbiAgICAgICsraTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBDb21tb25IZWxwZXJcblxuICBAbWVyZ2U6ICh4cy4uLikgLT5cbiAgICBpZiB4cz8ubGVuZ3RoID4gMFxuICAgICAgQHRhcCB7fSwgKG0pIC0+IG1ba10gPSB2IGZvciBrLCB2IG9mIHggZm9yIHggaW4geHNcbiBcbiAgQHRhcDogKG8sIGZuKSAtPiBcbiAgICBmbihvKVxuICAgIG9cblxuICBAYXBwbHlNaXhpbnM6IChkZXJpdmVkQ3RvciwgYmFzZUN0b3JzKSAtPiBcbiAgICBiYXNlQ3RvcnMuZm9yRWFjaCAoYmFzZUN0b3IpID0+IFxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoIChuYW1lKT0+IFxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKSIsImV4cG9ydCB2YXIgQ29tbW9uSGVscGVyID0gY2xhc3MgQ29tbW9uSGVscGVyIHtcbiAgc3RhdGljIG1lcmdlKC4uLnhzKSB7XG4gICAgaWYgKCh4cyAhPSBudWxsID8geHMubGVuZ3RoIDogdm9pZCAwKSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcCh7fSwgZnVuY3Rpb24obSkge1xuICAgICAgICB2YXIgaSwgaywgbGVuLCByZXN1bHRzLCB2LCB4O1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHhzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgeCA9IHhzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0czE7XG4gICAgICAgICAgICByZXN1bHRzMSA9IFtdO1xuICAgICAgICAgICAgZm9yIChrIGluIHgpIHtcbiAgICAgICAgICAgICAgdiA9IHhba107XG4gICAgICAgICAgICAgIHJlc3VsdHMxLnB1c2gobVtrXSA9IHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMxO1xuICAgICAgICAgIH0pKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRhcChvLCBmbikge1xuICAgIGZuKG8pO1xuICAgIHJldHVybiBvO1xuICB9XG5cbiAgc3RhdGljIGFwcGx5TWl4aW5zKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIHtcbiAgICByZXR1cm4gYmFzZUN0b3JzLmZvckVhY2goKGJhc2VDdG9yKSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVyaXZlZEN0b3IsIG5hbWUsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZUN0b3IucHJvdG90eXBlLCBuYW1lKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgTmFtZXNwYWNlSGVscGVyXG5cbiAgQHNwbGl0Rmlyc3Q6IChmdWxsbmFtZSxpc1NwYWNlID0gZmFsc2UpIC0+XG4gICAgaWYgZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT0gLTEgYW5kICFpc1NwYWNlXG4gICAgICByZXR1cm4gW251bGwsZnVsbG5hbWVdXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLHBhcnRzLmpvaW4oJzonKSB8fCBudWxsXVxuXG4gIEBzcGxpdDogKGZ1bGxuYW1lKSAtPlxuICAgIGlmIGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09IC0xXG4gICAgICByZXR1cm4gW251bGwsZnVsbG5hbWVdXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgbmFtZSA9IHBhcnRzLnBvcCgpXG4gICAgW3BhcnRzLmpvaW4oJzonKSxuYW1lXSIsImV4cG9ydCB2YXIgTmFtZXNwYWNlSGVscGVyID0gY2xhc3MgTmFtZXNwYWNlSGVscGVyIHtcbiAgc3RhdGljIHNwbGl0Rmlyc3QoZnVsbG5hbWUsIGlzU3BhY2UgPSBmYWxzZSkge1xuICAgIHZhciBwYXJ0cztcbiAgICBpZiAoZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT09IC0xICYmICFpc1NwYWNlKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXTtcbiAgICB9XG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpO1xuICAgIHJldHVybiBbcGFydHMuc2hpZnQoKSwgcGFydHMuam9pbignOicpIHx8IG51bGxdO1xuICB9XG5cbiAgc3RhdGljIHNwbGl0KGZ1bGxuYW1lKSB7XG4gICAgdmFyIG5hbWUsIHBhcnRzO1xuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdO1xuICAgIH1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6Jyk7XG4gICAgbmFtZSA9IHBhcnRzLnBvcCgpO1xuICAgIHJldHVybiBbcGFydHMuam9pbignOicpLCBuYW1lXTtcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgT3B0aW9uYWxQcm9taXNlXG4gICAgY29uc3RydWN0b3I6IChAdmFsKSAtPlxuICAgICAgICBpZiBAdmFsPyBhbmQgQHZhbC50aGVuPyBhbmQgQHZhbC5yZXN1bHQ/XG4gICAgICAgICAgICBAdmFsID0gQHZhbC5yZXN1bHQoKVxuICAgIHRoZW46IChjYikgLT5cbiAgICAgICAgaWYgQHZhbD8gYW5kIEB2YWwudGhlbj9cbiAgICAgICAgICAgIG5ldyBPcHRpb25hbFByb21pc2UoQHZhbC50aGVuKGNiKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV3IE9wdGlvbmFsUHJvbWlzZShjYihAdmFsKSlcbiAgICByZXN1bHQ6IC0+XG4gICAgICAgIEB2YWxcblxuZXhwb3J0IG9wdGlvbmFsUHJvbWlzZSA9ICh2YWwpLT4gXG4gICAgbmV3IE9wdGlvbmFsUHJvbWlzZSh2YWwpXG5cblxuIiwiZXhwb3J0IHZhciBPcHRpb25hbFByb21pc2UgPSBjbGFzcyBPcHRpb25hbFByb21pc2Uge1xuICBjb25zdHJ1Y3Rvcih2YWwxKSB7XG4gICAgdGhpcy52YWwgPSB2YWwxO1xuICAgIGlmICgodGhpcy52YWwgIT0gbnVsbCkgJiYgKHRoaXMudmFsLnRoZW4gIT0gbnVsbCkgJiYgKHRoaXMudmFsLnJlc3VsdCAhPSBudWxsKSkge1xuICAgICAgdGhpcy52YWwgPSB0aGlzLnZhbC5yZXN1bHQoKTtcbiAgICB9XG4gIH1cblxuICB0aGVuKGNiKSB7XG4gICAgaWYgKCh0aGlzLnZhbCAhPSBudWxsKSAmJiAodGhpcy52YWwudGhlbiAhPSBudWxsKSkge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodGhpcy52YWwudGhlbihjYikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZShjYih0aGlzLnZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICByZXR1cm4gdGhpcy52YWw7XG4gIH1cblxufTtcblxuZXhwb3J0IHZhciBvcHRpb25hbFByb21pc2UgPSBmdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodmFsKTtcbn07XG4iLCJleHBvcnQgY2xhc3MgUGF0aEhlbHBlclxuICBAZ2V0UGF0aDogKG9iaixwYXRoLHNlcD0nLicpIC0+XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcClcbiAgICBjdXIgPSBvYmpcbiAgICBwYXJ0cy5maW5kIChwYXJ0KSA9PlxuICAgICAgY3VyID0gY3VyW3BhcnRdXG4gICAgICB0eXBlb2YgY3VyID09IFwidW5kZWZpbmVkXCJcbiAgICBjdXJcbiAgICBcbiAgXG4gIEBzZXRQYXRoOiAob2JqLHBhdGgsdmFsLHNlcD0nLicpIC0+XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcClcbiAgICBsYXN0ID0gcGFydHMucG9wKClcbiAgICBwYXJ0cy5yZWR1Y2UoKGN1cixwYXJ0KSA9PlxuICAgICAgaWYgY3VyW3BhcnRdP1xuICAgICAgICBjdXJbcGFydF1cbiAgICAgIGVsc2VcbiAgICAgICAgY3VyW3BhcnRdID0ge31cbiAgICAsIG9iailbbGFzdF0gPSB2YWxcbiAgICAiLCJleHBvcnQgdmFyIFBhdGhIZWxwZXIgPSBjbGFzcyBQYXRoSGVscGVyIHtcbiAgc3RhdGljIGdldFBhdGgob2JqLCBwYXRoLCBzZXAgPSAnLicpIHtcbiAgICB2YXIgY3VyLCBwYXJ0cztcbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKTtcbiAgICBjdXIgPSBvYmo7XG4gICAgcGFydHMuZmluZCgocGFydCkgPT4ge1xuICAgICAgY3VyID0gY3VyW3BhcnRdO1xuICAgICAgcmV0dXJuIHR5cGVvZiBjdXIgPT09IFwidW5kZWZpbmVkXCI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGN1cjtcbiAgfVxuXG4gIHN0YXRpYyBzZXRQYXRoKG9iaiwgcGF0aCwgdmFsLCBzZXAgPSAnLicpIHtcbiAgICB2YXIgbGFzdCwgcGFydHM7XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcCk7XG4gICAgbGFzdCA9IHBhcnRzLnBvcCgpO1xuICAgIHJldHVybiBwYXJ0cy5yZWR1Y2UoKGN1ciwgcGFydCkgPT4ge1xuICAgICAgaWYgKGN1cltwYXJ0XSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjdXJbcGFydF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY3VyW3BhcnRdID0ge307XG4gICAgICB9XG4gICAgfSwgb2JqKVtsYXN0XSA9IHZhbDtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgU2l6ZSB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1NpemUnO1xuXG5leHBvcnQgY2xhc3MgU3RyaW5nSGVscGVyXG4gIEB0cmltRW1wdHlMaW5lOiAodHh0KSAtPlxuICAgIHJldHVybiB0eHQucmVwbGFjZSgvXlxccypcXHI/XFxuLywgJycpLnJlcGxhY2UoL1xccj9cXG5cXHMqJC8sICcnKVxuXG4gIEBlc2NhcGVSZWdFeHA6IChzdHIpIC0+XG4gICAgc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKVxuXG4gIEByZXBlYXRUb0xlbmd0aDogKHR4dCwgbGVuZ3RoKSAtPlxuICAgIHJldHVybiAnJyBpZiBsZW5ndGggPD0gMFxuICAgIEFycmF5KE1hdGguY2VpbChsZW5ndGgvdHh0Lmxlbmd0aCkrMSkuam9pbih0eHQpLnN1YnN0cmluZygwLGxlbmd0aClcbiAgICBcbiAgQHJlcGVhdDogKHR4dCwgbmIpIC0+XG4gICAgQXJyYXkobmIrMSkuam9pbih0eHQpXG4gICAgXG4gIEBnZXRUeHRTaXplOiAodHh0KSAtPlxuICAgIGxpbmVzID0gdHh0LnJlcGxhY2UoL1xcci9nLCcnKS5zcGxpdChcIlxcblwiKVxuICAgIHcgPSAwXG4gICAgZm9yIGwgaW4gbGluZXNcbiAgICAgIHcgPSBNYXRoLm1heCh3LGwubGVuZ3RoKVxuICAgIHJldHVybiBuZXcgU2l6ZSh3LGxpbmVzLmxlbmd0aC0xKVxuXG4gIEBpbmRlbnROb3RGaXJzdDogKHRleHQsbmI9MSxzcGFjZXM9JyAgJykgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmVnID0gL1xcbi9nXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgXCJcXG5cIiArIEByZXBlYXQoc3BhY2VzLCBuYikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgICAgIFxuICBAaW5kZW50OiAodGV4dCxuYj0xLHNwYWNlcz0nICAnKSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZXR1cm4gc3BhY2VzICsgQGluZGVudE5vdEZpcnN0KHRleHQsbmIsc3BhY2VzKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gIFxuICBAcmV2ZXJzZVN0cjogKHR4dCkgLT5cbiAgICByZXR1cm4gdHh0LnNwbGl0KFwiXCIpLnJldmVyc2UoKS5qb2luKFwiXCIpXG4gIFxuICBcbiAgQHJlbW92ZUNhcnJldDogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICB0bXAgPSAnW1tbW3F1b3RlZF9jYXJyZXRdXV1dJ1xuICAgIHJlQ2FycmV0ID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIpLCBcImdcIilcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyK2NhcnJldENoYXIpLCBcImdcIilcbiAgICByZVRtcCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cCh0bXApLCBcImdcIilcbiAgICB0eHQucmVwbGFjZShyZVF1b3RlZCx0bXApLnJlcGxhY2UocmVDYXJyZXQsJycpLnJlcGxhY2UocmVUbXAsIGNhcnJldENoYXIpXG4gICAgXG4gIEBnZXRBbmRSZW1vdmVGaXJzdENhcnJldDogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICBwb3MgPSBAZ2V0Q2FycmV0UG9zKHR4dCxjYXJyZXRDaGFyKVxuICAgIGlmIHBvcz9cbiAgICAgIHR4dCA9IHR4dC5zdWJzdHIoMCxwb3MpICsgdHh0LnN1YnN0cihwb3MrY2FycmV0Q2hhci5sZW5ndGgpXG4gICAgICByZXR1cm4gW3Bvcyx0eHRdXG4gICAgICBcbiAgQGdldENhcnJldFBvczogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyK2NhcnJldENoYXIpLCBcImdcIilcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKVxuICAgIGlmIChpID0gdHh0LmluZGV4T2YoY2FycmV0Q2hhcikpID4gLTFcbiAgICAgIHJldHVybiBpIiwiaW1wb3J0IHtcbiAgU2l6ZVxufSBmcm9tICcuLi9wb3NpdGlvbmluZy9TaXplJztcblxuZXhwb3J0IHZhciBTdHJpbmdIZWxwZXIgPSBjbGFzcyBTdHJpbmdIZWxwZXIge1xuICBzdGF0aWMgdHJpbUVtcHR5TGluZSh0eHQpIHtcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJyk7XG4gIH1cblxuICBzdGF0aWMgZXNjYXBlUmVnRXhwKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpO1xuICB9XG5cbiAgc3RhdGljIHJlcGVhdFRvTGVuZ3RoKHR4dCwgbGVuZ3RoKSB7XG4gICAgaWYgKGxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gdHh0Lmxlbmd0aCkgKyAxKS5qb2luKHR4dCkuc3Vic3RyaW5nKDAsIGxlbmd0aCk7XG4gIH1cblxuICBzdGF0aWMgcmVwZWF0KHR4dCwgbmIpIHtcbiAgICByZXR1cm4gQXJyYXkobmIgKyAxKS5qb2luKHR4dCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0VHh0U2l6ZSh0eHQpIHtcbiAgICB2YXIgaiwgbCwgbGVuLCBsaW5lcywgdztcbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpO1xuICAgIHcgPSAwO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBsID0gbGluZXNbal07XG4gICAgICB3ID0gTWF0aC5tYXgodywgbC5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFNpemUodywgbGluZXMubGVuZ3RoIC0gMSk7XG4gIH1cblxuICBzdGF0aWMgaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgdmFyIHJlZztcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZWcgPSAvXFxuL2c7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgXCJcXG5cIiArIHRoaXMucmVwZWF0KHNwYWNlcywgbmIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGluZGVudCh0ZXh0LCBuYiA9IDEsIHNwYWNlcyA9ICcgICcpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gc3BhY2VzICsgdGhpcy5pbmRlbnROb3RGaXJzdCh0ZXh0LCBuYiwgc3BhY2VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHJldmVyc2VTdHIodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5zcGxpdChcIlwiKS5yZXZlcnNlKCkuam9pbihcIlwiKTtcbiAgfVxuXG4gIHN0YXRpYyByZW1vdmVDYXJyZXQodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIHJlQ2FycmV0LCByZVF1b3RlZCwgcmVUbXAsIHRtcDtcbiAgICB0bXAgPSAnW1tbW3F1b3RlZF9jYXJyZXRdXV1dJztcbiAgICByZUNhcnJldCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciArIGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgcmVUbXAgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKHRtcCksIFwiZ1wiKTtcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UocmVRdW90ZWQsIHRtcCkucmVwbGFjZShyZUNhcnJldCwgJycpLnJlcGxhY2UocmVUbXAsIGNhcnJldENoYXIpO1xuICB9XG5cbiAgc3RhdGljIGdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciBwb3M7XG4gICAgcG9zID0gdGhpcy5nZXRDYXJyZXRQb3ModHh0LCBjYXJyZXRDaGFyKTtcbiAgICBpZiAocG9zICE9IG51bGwpIHtcbiAgICAgIHR4dCA9IHR4dC5zdWJzdHIoMCwgcG9zKSArIHR4dC5zdWJzdHIocG9zICsgY2FycmV0Q2hhci5sZW5ndGgpO1xuICAgICAgcmV0dXJuIFtwb3MsIHR4dF07XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldENhcnJldFBvcyh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgaSwgcmVRdW90ZWQ7XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHR4dCA9IHR4dC5yZXBsYWNlKHJlUXVvdGVkLCAnICcpO1xuICAgIGlmICgoaSA9IHR4dC5pbmRleE9mKGNhcnJldENoYXIpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGFpck1hdGNoIH0gZnJvbSAnLi9QYWlyTWF0Y2gnO1xuXG5leHBvcnQgY2xhc3MgUGFpclxuICBjb25zdHJ1Y3RvcjogKEBvcGVuZXIsQGNsb3NlcixAb3B0aW9ucyA9IHt9KSAtPlxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2VcbiAgICAgIHZhbGlkTWF0Y2g6IG51bGxcbiAgICB9XG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2YgQG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gQG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgb3BlbmVyUmVnOiAtPlxuICAgIGlmIHR5cGVvZiBAb3BlbmVyID09ICdzdHJpbmcnIFxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAb3BlbmVyKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQG9wZW5lclxuICBjbG9zZXJSZWc6IC0+XG4gICAgaWYgdHlwZW9mIEBjbG9zZXIgPT0gJ3N0cmluZycgXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjbG9zZXIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAY2xvc2VyXG4gIG1hdGNoQW55UGFydHM6IC0+XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW5lcjogQG9wZW5lclJlZygpXG4gICAgICBjbG9zZXI6IEBjbG9zZXJSZWcoKVxuICAgIH1cbiAgbWF0Y2hBbnlQYXJ0S2V5czogLT5cbiAgICBrZXlzID0gW11cbiAgICBmb3Iga2V5LCByZWcgb2YgQG1hdGNoQW55UGFydHMoKVxuICAgICAga2V5cy5wdXNoKGtleSlcbiAgICByZXR1cm4ga2V5c1xuICBtYXRjaEFueVJlZzogLT5cbiAgICBncm91cHMgPSBbXVxuICAgIGZvciBrZXksIHJlZyBvZiBAbWF0Y2hBbnlQYXJ0cygpXG4gICAgICBncm91cHMucHVzaCgnKCcrcmVnLnNvdXJjZSsnKScpXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoZ3JvdXBzLmpvaW4oJ3wnKSlcbiAgbWF0Y2hBbnk6ICh0ZXh0LG9mZnNldD0wKSAtPlxuICAgIHdoaWxlIChtYXRjaCA9IEBfbWF0Y2hBbnkodGV4dCxvZmZzZXQpKT8gYW5kICFtYXRjaC52YWxpZCgpXG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgIHJldHVybiBtYXRjaCBpZiBtYXRjaD8gYW5kIG1hdGNoLnZhbGlkKClcbiAgX21hdGNoQW55OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICBpZiBvZmZzZXRcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cihvZmZzZXQpXG4gICAgbWF0Y2ggPSBAbWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpXG4gICAgaWYgbWF0Y2g/XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLG1hdGNoLG9mZnNldClcbiAgbWF0Y2hBbnlOYW1lZDogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBfbWF0Y2hBbnlHZXROYW1lKEBtYXRjaEFueSh0ZXh0KSlcbiAgbWF0Y2hBbnlMYXN0OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICB3aGlsZSBtYXRjaCA9IEBtYXRjaEFueSh0ZXh0LG9mZnNldClcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpXG4gICAgICBpZiAhcmVzIG9yIHJlcy5lbmQoKSAhPSBtYXRjaC5lbmQoKVxuICAgICAgICByZXMgPSBtYXRjaFxuICAgIHJldHVybiByZXNcbiAgaWRlbnRpY2FsOiAtPlxuICAgIEBvcGVuZXIgPT0gQGNsb3NlciBvciAoXG4gICAgICBAb3BlbmVyLnNvdXJjZT8gYW5kIFxuICAgICAgQGNsb3Nlci5zb3VyY2U/IGFuZCBcbiAgICAgIEBvcGVuZXIuc291cmNlID09IEBjbG9zZXIuc291cmNlXG4gICAgKVxuICB3cmFwcGVyUG9zOiAocG9zLHRleHQpIC0+XG4gICAgc3RhcnQgPSBAbWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAscG9zLnN0YXJ0KSlcbiAgICBpZiBzdGFydD8gYW5kIChAaWRlbnRpY2FsKCkgb3Igc3RhcnQubmFtZSgpID09ICdvcGVuZXInKVxuICAgICAgZW5kID0gQG1hdGNoQW55KHRleHQscG9zLmVuZClcbiAgICAgIGlmIGVuZD8gYW5kIChAaWRlbnRpY2FsKCkgb3IgZW5kLm5hbWUoKSA9PSAnY2xvc2VyJylcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSxlbmQuZW5kKCkpXG4gICAgICBlbHNlIGlmIEBvcHRpb25uYWxfZW5kXG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksdGV4dC5sZW5ndGgpXG4gIGlzV2FwcGVyT2Y6IChwb3MsdGV4dCkgLT5cbiAgICByZXR1cm4gQHdyYXBwZXJQb3MocG9zLHRleHQpPyIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhaXJNYXRjaFxufSBmcm9tICcuL1BhaXJNYXRjaCc7XG5cbmV4cG9ydCB2YXIgUGFpciA9IGNsYXNzIFBhaXIge1xuICBjb25zdHJ1Y3RvcihvcGVuZXIsIGNsb3Nlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICB0aGlzLm9wZW5lciA9IG9wZW5lcjtcbiAgICB0aGlzLmNsb3NlciA9IGNsb3NlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2UsXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfTtcbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gdGhpcy5vcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMub3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5lclJlZygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub3BlbmVyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm9wZW5lcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuZXI7XG4gICAgfVxuICB9XG5cbiAgY2xvc2VyUmVnKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jbG9zZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY2xvc2VyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NlcjtcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueVBhcnRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvcGVuZXI6IHRoaXMub3BlbmVyUmVnKCksXG4gICAgICBjbG9zZXI6IHRoaXMuY2xvc2VyUmVnKClcbiAgICB9O1xuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0S2V5cygpIHtcbiAgICB2YXIga2V5LCBrZXlzLCByZWYsIHJlZztcbiAgICBrZXlzID0gW107XG4gICAgcmVmID0gdGhpcy5tYXRjaEFueVBhcnRzKCk7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XTtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIG1hdGNoQW55UmVnKCkge1xuICAgIHZhciBncm91cHMsIGtleSwgcmVmLCByZWc7XG4gICAgZ3JvdXBzID0gW107XG4gICAgcmVmID0gdGhpcy5tYXRjaEFueVBhcnRzKCk7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XTtcbiAgICAgIGdyb3Vwcy5wdXNoKCcoJyArIHJlZy5zb3VyY2UgKyAnKScpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChncm91cHMuam9pbignfCcpKTtcbiAgfVxuXG4gIG1hdGNoQW55KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2g7XG4gICAgd2hpbGUgKCgobWF0Y2ggPSB0aGlzLl9tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSAhPSBudWxsKSAmJiAhbWF0Y2gudmFsaWQoKSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKCk7XG4gICAgfVxuICAgIGlmICgobWF0Y2ggIT0gbnVsbCkgJiYgbWF0Y2gudmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgfVxuXG4gIF9tYXRjaEFueSh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoO1xuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cihvZmZzZXQpO1xuICAgIH1cbiAgICBtYXRjaCA9IHRoaXMubWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpO1xuICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLCBtYXRjaCwgb2Zmc2V0KTtcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueU5hbWVkKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF0Y2hBbnlHZXROYW1lKHRoaXMubWF0Y2hBbnkodGV4dCkpO1xuICB9XG5cbiAgbWF0Y2hBbnlMYXN0KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2gsIHJlcztcbiAgICB3aGlsZSAobWF0Y2ggPSB0aGlzLm1hdGNoQW55KHRleHQsIG9mZnNldCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpO1xuICAgICAgaWYgKCFyZXMgfHwgcmVzLmVuZCgpICE9PSBtYXRjaC5lbmQoKSkge1xuICAgICAgICByZXMgPSBtYXRjaDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGlkZW50aWNhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZXIgPT09IHRoaXMuY2xvc2VyIHx8ICgodGhpcy5vcGVuZXIuc291cmNlICE9IG51bGwpICYmICh0aGlzLmNsb3Nlci5zb3VyY2UgIT0gbnVsbCkgJiYgdGhpcy5vcGVuZXIuc291cmNlID09PSB0aGlzLmNsb3Nlci5zb3VyY2UpO1xuICB9XG5cbiAgd3JhcHBlclBvcyhwb3MsIHRleHQpIHtcbiAgICB2YXIgZW5kLCBzdGFydDtcbiAgICBzdGFydCA9IHRoaXMubWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAsIHBvcy5zdGFydCkpO1xuICAgIGlmICgoc3RhcnQgIT0gbnVsbCkgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgc3RhcnQubmFtZSgpID09PSAnb3BlbmVyJykpIHtcbiAgICAgIGVuZCA9IHRoaXMubWF0Y2hBbnkodGV4dCwgcG9zLmVuZCk7XG4gICAgICBpZiAoKGVuZCAhPSBudWxsKSAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBlbmQubmFtZSgpID09PSAnY2xvc2VyJykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgZW5kLmVuZCgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25uYWxfZW5kKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIHRleHQubGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc1dhcHBlck9mKHBvcywgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZXJQb3MocG9zLCB0ZXh0KSAhPSBudWxsO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUGFpck1hdGNoXG4gIGNvbnN0cnVjdG9yOiAoQHBhaXIsQG1hdGNoLEBvZmZzZXQgPSAwKSAtPlxuICBuYW1lOiAtPlxuICAgIGlmIEBtYXRjaFxuICAgICAgdW5sZXNzIF9uYW1lP1xuICAgICAgICBmb3IgZ3JvdXAsIGkgaW4gQG1hdGNoXG4gICAgICAgICAgaWYgaSA+IDAgYW5kIGdyb3VwP1xuICAgICAgICAgICAgX25hbWUgPSBAcGFpci5tYXRjaEFueVBhcnRLZXlzKClbaS0xXVxuICAgICAgICAgICAgcmV0dXJuIF9uYW1lXG4gICAgICAgIF9uYW1lID0gZmFsc2VcbiAgICAgIHJldHVybiBfbmFtZSB8fCBudWxsXG4gIHN0YXJ0OiAtPlxuICAgIEBtYXRjaC5pbmRleCArIEBvZmZzZXRcbiAgZW5kOiAtPlxuICAgIEBtYXRjaC5pbmRleCArIEBtYXRjaFswXS5sZW5ndGggKyBAb2Zmc2V0XG4gIHZhbGlkOiAtPlxuICAgIHJldHVybiAhQHBhaXIudmFsaWRNYXRjaCB8fCBAcGFpci52YWxpZE1hdGNoKHRoaXMpXG4gIGxlbmd0aDogLT5cbiAgICBAbWF0Y2hbMF0ubGVuZ3RoIiwiZXhwb3J0IHZhciBQYWlyTWF0Y2ggPSBjbGFzcyBQYWlyTWF0Y2gge1xuICBjb25zdHJ1Y3RvcihwYWlyLCBtYXRjaCwgb2Zmc2V0ID0gMCkge1xuICAgIHRoaXMucGFpciA9IHBhaXI7XG4gICAgdGhpcy5tYXRjaCA9IG1hdGNoO1xuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICB9XG5cbiAgbmFtZSgpIHtcbiAgICB2YXIgX25hbWUsIGdyb3VwLCBpLCBqLCBsZW4sIHJlZjtcbiAgICBpZiAodGhpcy5tYXRjaCkge1xuICAgICAgaWYgKHR5cGVvZiBfbmFtZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBfbmFtZSA9PT0gbnVsbCkge1xuICAgICAgICByZWYgPSB0aGlzLm1hdGNoO1xuICAgICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICAgIGdyb3VwID0gcmVmW2ldO1xuICAgICAgICAgIGlmIChpID4gMCAmJiAoZ3JvdXAgIT0gbnVsbCkpIHtcbiAgICAgICAgICAgIF9uYW1lID0gdGhpcy5wYWlyLm1hdGNoQW55UGFydEtleXMoKVtpIC0gMV07XG4gICAgICAgICAgICByZXR1cm4gX25hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9uYW1lID0gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gX25hbWUgfHwgbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMub2Zmc2V0O1xuICB9XG5cbiAgZW5kKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoLmluZGV4ICsgdGhpcy5tYXRjaFswXS5sZW5ndGggKyB0aGlzLm9mZnNldDtcbiAgfVxuXG4gIHZhbGlkKCkge1xuICAgIHJldHVybiAhdGhpcy5wYWlyLnZhbGlkTWF0Y2ggfHwgdGhpcy5wYWlyLnZhbGlkTWF0Y2godGhpcyk7XG4gIH1cblxuICBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hbMF0ubGVuZ3RoO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LEBlbmQpIC0+XG4gICAgQGVuZCA9IEBzdGFydCB1bmxlc3MgQGVuZD9cbiAgY29udGFpbnNQdDogKHB0KSAtPlxuICAgIHJldHVybiBAc3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBlbmRcbiAgY29udGFpbnNQb3M6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBzdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGVuZFxuICB3cmFwcGVkQnk6IChwcmVmaXgsc3VmZml4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyhAc3RhcnQtcHJlZml4Lmxlbmd0aCxAc3RhcnQsQGVuZCxAZW5kK3N1ZmZpeC5sZW5ndGgpXG4gIHdpdGhFZGl0b3I6ICh2YWwpLT5cbiAgICBAX2VkaXRvciA9IHZhbFxuICAgIHJldHVybiB0aGlzXG4gIGVkaXRvcjogLT5cbiAgICB1bmxlc3MgQF9lZGl0b3I/XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVkaXRvciBzZXQnKVxuICAgIHJldHVybiBAX2VkaXRvclxuICBoYXNFZGl0b3I6IC0+XG4gICAgcmV0dXJuIEBfZWRpdG9yP1xuICB0ZXh0OiAtPlxuICAgIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBzdGFydCwgQGVuZClcbiAgYXBwbHlPZmZzZXQ6IChvZmZzZXQpLT5cbiAgICBpZiBvZmZzZXQgIT0gMFxuICAgICAgQHN0YXJ0ICs9IG9mZnNldFxuICAgICAgQGVuZCArPSBvZmZzZXRcbiAgICByZXR1cm4gdGhpc1xuICBwcmV2RU9MOiAtPlxuICAgIHVubGVzcyBAX3ByZXZFT0w/XG4gICAgICBAX3ByZXZFT0wgPSBAZWRpdG9yKCkuZmluZExpbmVTdGFydChAc3RhcnQpXG4gICAgcmV0dXJuIEBfcHJldkVPTFxuICBuZXh0RU9MOiAtPlxuICAgIHVubGVzcyBAX25leHRFT0w/XG4gICAgICBAX25leHRFT0wgPSBAZWRpdG9yKCkuZmluZExpbmVFbmQoQGVuZClcbiAgICByZXR1cm4gQF9uZXh0RU9MXG4gIHRleHRXaXRoRnVsbExpbmVzOiAtPlxuICAgIHVubGVzcyBAX3RleHRXaXRoRnVsbExpbmVzP1xuICAgICAgQF90ZXh0V2l0aEZ1bGxMaW5lcyA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBwcmV2RU9MKCksQG5leHRFT0woKSlcbiAgICByZXR1cm4gQF90ZXh0V2l0aEZ1bGxMaW5lc1xuICBzYW1lTGluZXNQcmVmaXg6IC0+XG4gICAgdW5sZXNzIEBfc2FtZUxpbmVzUHJlZml4P1xuICAgICAgQF9zYW1lTGluZXNQcmVmaXggPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAcHJldkVPTCgpLEBzdGFydClcbiAgICByZXR1cm4gQF9zYW1lTGluZXNQcmVmaXhcbiAgc2FtZUxpbmVzU3VmZml4OiAtPlxuICAgIHVubGVzcyBAX3NhbWVMaW5lc1N1ZmZpeD9cbiAgICAgIEBfc2FtZUxpbmVzU3VmZml4ID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQGVuZCxAbmV4dEVPTCgpKVxuICAgIHJldHVybiBAX3NhbWVMaW5lc1N1ZmZpeFxuICBjb3B5OiAtPlxuICAgIHJlcyA9IG5ldyBQb3MoQHN0YXJ0LEBlbmQpXG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICByZXMud2l0aEVkaXRvcihAZWRpdG9yKCkpXG4gICAgcmV0dXJuIHJlc1xuICByYXc6IC0+XG4gICAgW0BzdGFydCxAZW5kXSIsImV4cG9ydCB2YXIgUG9zID0gY2xhc3MgUG9zIHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGVuZCkge1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICBpZiAodGhpcy5lbmQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5lbmQgPSB0aGlzLnN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIGNvbnRhaW5zUHQocHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmVuZDtcbiAgfVxuXG4gIGNvbnRhaW5zUG9zKHBvcykge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuZW5kO1xuICB9XG5cbiAgd3JhcHBlZEJ5KHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3Mud3JhcENsYXNzKHRoaXMuc3RhcnQgLSBwcmVmaXgubGVuZ3RoLCB0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5lbmQgKyBzdWZmaXgubGVuZ3RoKTtcbiAgfVxuXG4gIHdpdGhFZGl0b3IodmFsKSB7XG4gICAgdGhpcy5fZWRpdG9yID0gdmFsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZWRpdG9yKCkge1xuICAgIGlmICh0aGlzLl9lZGl0b3IgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0Jyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lZGl0b3I7XG4gIH1cblxuICBoYXNFZGl0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvciAhPSBudWxsO1xuICB9XG5cbiAgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgfVxuXG4gIGFwcGx5T2Zmc2V0KG9mZnNldCkge1xuICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHByZXZFT0woKSB7XG4gICAgaWYgKHRoaXMuX3ByZXZFT0wgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcHJldkVPTCA9IHRoaXMuZWRpdG9yKCkuZmluZExpbmVTdGFydCh0aGlzLnN0YXJ0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ByZXZFT0w7XG4gIH1cblxuICBuZXh0RU9MKCkge1xuICAgIGlmICh0aGlzLl9uZXh0RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX25leHRFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lRW5kKHRoaXMuZW5kKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25leHRFT0w7XG4gIH1cblxuICB0ZXh0V2l0aEZ1bGxMaW5lcygpIHtcbiAgICBpZiAodGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RleHRXaXRoRnVsbExpbmVzO1xuICB9XG5cbiAgc2FtZUxpbmVzUHJlZml4KCkge1xuICAgIGlmICh0aGlzLl9zYW1lTGluZXNQcmVmaXggPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2FtZUxpbmVzUHJlZml4ID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMucHJldkVPTCgpLCB0aGlzLnN0YXJ0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NhbWVMaW5lc1ByZWZpeDtcbiAgfVxuXG4gIHNhbWVMaW5lc1N1ZmZpeCgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzU3VmZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLmVuZCwgdGhpcy5uZXh0RU9MKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzU3VmZml4O1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBQb3ModGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICByZXMud2l0aEVkaXRvcih0aGlzLmVkaXRvcigpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHJhdygpIHtcbiAgICByZXR1cm4gW3RoaXMuc3RhcnQsIHRoaXMuZW5kXTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgV3JhcHBpbmcgfSBmcm9tICcuL1dyYXBwaW5nJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBDb21tb25IZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBQb3NDb2xsZWN0aW9uXG4gIGNvbnN0cnVjdG9yOiAoYXJyKSAtPlxuICAgIGlmICFBcnJheS5pc0FycmF5KGFycilcbiAgICAgIGFyciA9IFthcnJdXG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFycixbUG9zQ29sbGVjdGlvbl0pXG4gICAgcmV0dXJuIGFyclxuICAgIFxuICB3cmFwOiAocHJlZml4LHN1ZmZpeCktPlxuICAgICAgcmV0dXJuIEBtYXAoIChwKSAtPiBuZXcgV3JhcHBpbmcocC5zdGFydCwgcC5lbmQsIHByZWZpeCwgc3VmZml4KSlcbiAgcmVwbGFjZTogKHR4dCktPlxuICAgICAgcmV0dXJuIEBtYXAoIChwKSAtPiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dCkpIiwiaW1wb3J0IHtcbiAgV3JhcHBpbmdcbn0gZnJvbSAnLi9XcmFwcGluZyc7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuXG5pbXBvcnQge1xuICBDb21tb25IZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5leHBvcnQgdmFyIFBvc0NvbGxlY3Rpb24gPSBjbGFzcyBQb3NDb2xsZWN0aW9uIHtcbiAgY29uc3RydWN0b3IoYXJyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIGFyciA9IFthcnJdO1xuICAgIH1cbiAgICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoYXJyLCBbUG9zQ29sbGVjdGlvbl0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICB3cmFwKHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBuZXcgV3JhcHBpbmcocC5zdGFydCwgcC5lbmQsIHByZWZpeCwgc3VmZml4KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcGxhY2UodHh0KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dCk7XG4gICAgfSk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcbmltcG9ydCB7IENvbW1vbkhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcbmltcG9ydCB7IE9wdGlvbk9iamVjdCB9IGZyb20gJy4uL09wdGlvbk9iamVjdCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBSZXBsYWNlbWVudCBleHRlbmRzIFBvc1xuICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnModGhpcy5wcm90b3R5cGUsW09wdGlvbk9iamVjdF0pXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LCBAZW5kLCBAdGV4dCwgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBzdXBlcigpXG4gICAgQHNldE9wdHMoQG9wdGlvbnMse1xuICAgICAgcHJlZml4OiAnJ1xuICAgICAgc3VmZml4OiAnJ1xuICAgICAgc2VsZWN0aW9uczogW11cbiAgICB9KVxuICByZXNQb3NCZWZvcmVQcmVmaXg6IC0+XG4gICAgcmV0dXJuIEBzdGFydCtAcHJlZml4Lmxlbmd0aCtAdGV4dC5sZW5ndGhcbiAgcmVzRW5kOiAtPiBcbiAgICByZXR1cm4gQHN0YXJ0K0BmaW5hbFRleHQoKS5sZW5ndGhcbiAgYXBwbHk6IC0+XG4gICAgQGVkaXRvcigpLnNwbGljZVRleHQoQHN0YXJ0LCBAZW5kLCBAZmluYWxUZXh0KCkpXG4gIG5lY2Vzc2FyeTogLT5cbiAgICByZXR1cm4gQGZpbmFsVGV4dCgpICE9IEBvcmlnaW5hbFRleHQoKVxuICBvcmlnaW5hbFRleHQ6IC0+XG4gICAgcmV0dXJuIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBzdGFydCwgQGVuZClcbiAgZmluYWxUZXh0OiAtPlxuICAgIHJldHVybiBAcHJlZml4K0B0ZXh0K0BzdWZmaXhcbiAgb2Zmc2V0QWZ0ZXI6ICgpIC0+IFxuICAgIHJldHVybiBAZmluYWxUZXh0KCkubGVuZ3RoIC0gKEBlbmQgLSBAc3RhcnQpXG4gIGFwcGx5T2Zmc2V0OiAob2Zmc2V0KS0+XG4gICAgaWYgb2Zmc2V0ICE9IDBcbiAgICAgIEBzdGFydCArPSBvZmZzZXRcbiAgICAgIEBlbmQgKz0gb2Zmc2V0XG4gICAgICBmb3Igc2VsIGluIEBzZWxlY3Rpb25zXG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgICByZXR1cm4gdGhpc1xuICBzZWxlY3RDb250ZW50OiAtPiBcbiAgICBAc2VsZWN0aW9ucyA9IFtuZXcgUG9zKEBwcmVmaXgubGVuZ3RoK0BzdGFydCwgQHByZWZpeC5sZW5ndGgrQHN0YXJ0K0B0ZXh0Lmxlbmd0aCldXG4gICAgcmV0dXJuIHRoaXNcbiAgY2FycmV0VG9TZWw6IC0+XG4gICAgQHNlbGVjdGlvbnMgPSBbXVxuICAgIHRleHQgPSBAZmluYWxUZXh0KClcbiAgICBAcHJlZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAcHJlZml4KVxuICAgIEB0ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAdGV4dClcbiAgICBAc3VmZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAc3VmZml4KVxuICAgIHN0YXJ0ID0gQHN0YXJ0XG4gICAgXG4gICAgd2hpbGUgKHJlcyA9IFN0cmluZ0hlbHBlci5nZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0ZXh0KSk/XG4gICAgICBbcG9zLHRleHRdID0gcmVzXG4gICAgICBAc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3Moc3RhcnQrcG9zLCBzdGFydCtwb3MpKVxuICAgICAgXG4gICAgcmV0dXJuIHRoaXNcbiAgY29weTogLT4gXG4gICAgcmVzID0gbmV3IFJlcGxhY2VtZW50KEBzdGFydCwgQGVuZCwgQHRleHQsIEBnZXRPcHRzKCkpXG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICByZXMud2l0aEVkaXRvcihAZWRpdG9yKCkpXG4gICAgcmVzLnNlbGVjdGlvbnMgPSBAc2VsZWN0aW9ucy5tYXAoIChzKS0+cy5jb3B5KCkgKVxuICAgIHJldHVybiByZXMiLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5pbXBvcnQge1xuICBDb21tb25IZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5pbXBvcnQge1xuICBPcHRpb25PYmplY3Rcbn0gZnJvbSAnLi4vT3B0aW9uT2JqZWN0JztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuZXhwb3J0IHZhciBSZXBsYWNlbWVudCA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgUmVwbGFjZW1lbnQgZXh0ZW5kcyBQb3Mge1xuICAgIGNvbnN0cnVjdG9yKHN0YXJ0MSwgZW5kLCB0ZXh0MSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0MTtcbiAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgICAgdGhpcy50ZXh0ID0gdGV4dDE7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucywge1xuICAgICAgICBwcmVmaXg6ICcnLFxuICAgICAgICBzdWZmaXg6ICcnLFxuICAgICAgICBzZWxlY3Rpb25zOiBbXVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVzUG9zQmVmb3JlUHJlZml4KCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnRleHQubGVuZ3RoO1xuICAgIH1cblxuICAgIHJlc0VuZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5maW5hbFRleHQoKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgYXBwbHkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS5zcGxpY2VUZXh0KHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLmZpbmFsVGV4dCgpKTtcbiAgICB9XG5cbiAgICBuZWNlc3NhcnkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKSAhPT0gdGhpcy5vcmlnaW5hbFRleHQoKTtcbiAgICB9XG5cbiAgICBvcmlnaW5hbFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICB9XG5cbiAgICBmaW5hbFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLnRleHQgKyB0aGlzLnN1ZmZpeDtcbiAgICB9XG5cbiAgICBvZmZzZXRBZnRlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmFsVGV4dCgpLmxlbmd0aCAtICh0aGlzLmVuZCAtIHRoaXMuc3RhcnQpO1xuICAgIH1cblxuICAgIGFwcGx5T2Zmc2V0KG9mZnNldCkge1xuICAgICAgdmFyIGksIGxlbiwgcmVmLCBzZWw7XG4gICAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgICB0aGlzLmVuZCArPSBvZmZzZXQ7XG4gICAgICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9ucztcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgc2VsID0gcmVmW2ldO1xuICAgICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXQ7XG4gICAgICAgICAgc2VsLmVuZCArPSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNlbGVjdENvbnRlbnQoKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyh0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0LCB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0ICsgdGhpcy50ZXh0Lmxlbmd0aCldO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2FycmV0VG9TZWwoKSB7XG4gICAgICB2YXIgcG9zLCByZXMsIHN0YXJ0LCB0ZXh0O1xuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW107XG4gICAgICB0ZXh0ID0gdGhpcy5maW5hbFRleHQoKTtcbiAgICAgIHRoaXMucHJlZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnByZWZpeCk7XG4gICAgICB0aGlzLnRleHQgPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMudGV4dCk7XG4gICAgICB0aGlzLnN1ZmZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5zdWZmaXgpO1xuICAgICAgc3RhcnQgPSB0aGlzLnN0YXJ0O1xuICAgICAgd2hpbGUgKChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgW3BvcywgdGV4dF0gPSByZXM7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3Moc3RhcnQgKyBwb3MsIHN0YXJ0ICsgcG9zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgdmFyIHJlcztcbiAgICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy50ZXh0LCB0aGlzLmdldE9wdHMoKSk7XG4gICAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgICByZXMud2l0aEVkaXRvcih0aGlzLmVkaXRvcigpKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZWxlY3Rpb25zID0gdGhpcy5zZWxlY3Rpb25zLm1hcChmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiBzLmNvcHkoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgfTtcblxuICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoUmVwbGFjZW1lbnQucHJvdG90eXBlLCBbT3B0aW9uT2JqZWN0XSk7XG5cbiAgcmV0dXJuIFJlcGxhY2VtZW50O1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiZXhwb3J0IGNsYXNzIFNpemVcbiAgY29uc3RydWN0b3I6IChAd2lkdGgsQGhlaWdodCkgLT4iLCJleHBvcnQgY2xhc3MgU3RyUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHBvcyxAc3RyKSAtPlxuICBlbmQ6IC0+XG4gICAgQHBvcyArIEBzdHIubGVuZ3RoIiwiZXhwb3J0IHZhciBTdHJQb3MgPSBjbGFzcyBTdHJQb3Mge1xuICBjb25zdHJ1Y3Rvcihwb3MsIHN0cikge1xuICAgIHRoaXMucG9zID0gcG9zO1xuICAgIHRoaXMuc3RyID0gc3RyO1xuICB9XG5cbiAgZW5kKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aDtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuXG5leHBvcnQgY2xhc3MgV3JhcHBlZFBvcyBleHRlbmRzIFBvc1xuICBjb25zdHJ1Y3RvcjogKEBzdGFydCxAaW5uZXJTdGFydCxAaW5uZXJFbmQsQGVuZCkgLT5cbiAgICBzdXBlcigpXG4gIGlubmVyQ29udGFpbnNQdDogKHB0KSAtPlxuICAgIHJldHVybiBAaW5uZXJTdGFydCA8PSBwdCBhbmQgcHQgPD0gQGlubmVyRW5kXG4gIGlubmVyQ29udGFpbnNQb3M6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBpbm5lclN0YXJ0IDw9IHBvcy5zdGFydCBhbmQgcG9zLmVuZCA8PSBAaW5uZXJFbmRcbiAgaW5uZXJUZXh0OiAtPlxuICAgIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBpbm5lclN0YXJ0LCBAaW5uZXJFbmQpXG4gIHNldElubmVyTGVuOiAobGVuKSAtPlxuICAgIEBtb3ZlU3VmaXgoQGlubmVyU3RhcnQgKyBsZW4pXG4gIG1vdmVTdWZmaXg6IChwdCkgLT5cbiAgICBzdWZmaXhMZW4gPSBAZW5kIC0gQGlubmVyRW5kXG4gICAgQGlubmVyRW5kID0gcHRcbiAgICBAZW5kID0gQGlubmVyRW5kICsgc3VmZml4TGVuXG4gIGNvcHk6IC0+XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKEBzdGFydCxAaW5uZXJTdGFydCxAaW5uZXJFbmQsQGVuZCkiLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5leHBvcnQgdmFyIFdyYXBwZWRQb3MgPSBjbGFzcyBXcmFwcGVkUG9zIGV4dGVuZHMgUG9zIHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGlubmVyU3RhcnQsIGlubmVyRW5kLCBlbmQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmlubmVyU3RhcnQgPSBpbm5lclN0YXJ0O1xuICAgIHRoaXMuaW5uZXJFbmQgPSBpbm5lckVuZDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQdChwdCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5pbm5lckVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQb3MocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmlubmVyRW5kO1xuICB9XG5cbiAgaW5uZXJUZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kKTtcbiAgfVxuXG4gIHNldElubmVyTGVuKGxlbikge1xuICAgIHJldHVybiB0aGlzLm1vdmVTdWZpeCh0aGlzLmlubmVyU3RhcnQgKyBsZW4pO1xuICB9XG5cbiAgbW92ZVN1ZmZpeChwdCkge1xuICAgIHZhciBzdWZmaXhMZW47XG4gICAgc3VmZml4TGVuID0gdGhpcy5lbmQgLSB0aGlzLmlubmVyRW5kO1xuICAgIHRoaXMuaW5uZXJFbmQgPSBwdDtcbiAgICByZXR1cm4gdGhpcy5lbmQgPSB0aGlzLmlubmVyRW5kICsgc3VmZml4TGVuO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICByZXR1cm4gbmV3IFdyYXBwZWRQb3ModGhpcy5zdGFydCwgdGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kLCB0aGlzLmVuZCk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCBjbGFzcyBXcmFwcGluZyBleHRlbmRzIFJlcGxhY2VtZW50XG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LCBAZW5kLCBwcmVmaXggPScnLCBzdWZmaXggPSAnJywgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBzdXBlcigpXG4gICAgQHNldE9wdHMoQG9wdGlvbnMpXG4gICAgQHRleHQgPSAnJ1xuICAgIEBwcmVmaXggPSBwcmVmaXhcbiAgICBAc3VmZml4ID0gc3VmZml4XG4gIGFwcGx5OiAtPlxuICAgIEBhZGp1c3RTZWwoKVxuICAgIHN1cGVyKClcbiAgYWRqdXN0U2VsOiAtPlxuICAgIG9mZnNldCA9IEBvcmlnaW5hbFRleHQoKS5sZW5ndGhcbiAgICBmb3Igc2VsIGluIEBzZWxlY3Rpb25zXG4gICAgICBpZiBzZWwuc3RhcnQgPiBAc3RhcnQrQHByZWZpeC5sZW5ndGhcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgaWYgc2VsLmVuZCA+PSBAc3RhcnQrQHByZWZpeC5sZW5ndGhcbiAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgZmluYWxUZXh0OiAtPlxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgdGV4dCA9IEBvcmlnaW5hbFRleHQoKVxuICAgIGVsc2VcbiAgICAgIHRleHQgPSAnJ1xuICAgIHJldHVybiBAcHJlZml4K3RleHQrQHN1ZmZpeFxuICBvZmZzZXRBZnRlcjogKCkgLT4gXG4gICAgcmV0dXJuIEBwcmVmaXgubGVuZ3RoK0BzdWZmaXgubGVuZ3RoXG4gICAgICAgICAgXG4gIGNvcHk6IC0+IFxuICAgIHJlcyA9IG5ldyBXcmFwcGluZyhAc3RhcnQsIEBlbmQsIEBwcmVmaXgsIEBzdWZmaXgpXG4gICAgcmVzLnNlbGVjdGlvbnMgPSBAc2VsZWN0aW9ucy5tYXAoIChzKS0+cy5jb3B5KCkgKVxuICAgIHJldHVybiByZXMiLCJpbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IHZhciBXcmFwcGluZyA9IGNsYXNzIFdyYXBwaW5nIGV4dGVuZHMgUmVwbGFjZW1lbnQge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgZW5kLCBwcmVmaXggPSAnJywgc3VmZml4ID0gJycsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy50ZXh0ID0gJyc7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXg7XG4gICAgdGhpcy5zdWZmaXggPSBzdWZmaXg7XG4gIH1cblxuICBhcHBseSgpIHtcbiAgICB0aGlzLmFkanVzdFNlbCgpO1xuICAgIHJldHVybiBzdXBlci5hcHBseSgpO1xuICB9XG5cbiAgYWRqdXN0U2VsKCkge1xuICAgIHZhciBpLCBsZW4sIG9mZnNldCwgcmVmLCByZXN1bHRzLCBzZWw7XG4gICAgb2Zmc2V0ID0gdGhpcy5vcmlnaW5hbFRleHQoKS5sZW5ndGg7XG4gICAgcmVmID0gdGhpcy5zZWxlY3Rpb25zO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNlbCA9IHJlZltpXTtcbiAgICAgIGlmIChzZWwuc3RhcnQgPiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXQ7XG4gICAgICB9XG4gICAgICBpZiAoc2VsLmVuZCA+PSB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChzZWwuZW5kICs9IG9mZnNldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBmaW5hbFRleHQoKSB7XG4gICAgdmFyIHRleHQ7XG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHRleHQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gJyc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRleHQgKyB0aGlzLnN1ZmZpeDtcbiAgfVxuXG4gIG9mZnNldEFmdGVyKCkge1xuICAgIHJldHVybiB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN1ZmZpeC5sZW5ndGg7XG4gIH1cblxuICBjb3B5KCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gbmV3IFdyYXBwaW5nKHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnByZWZpeCwgdGhpcy5zdWZmaXgpO1xuICAgIHJlcy5zZWxlY3Rpb25zID0gdGhpcy5zZWxlY3Rpb25zLm1hcChmdW5jdGlvbihzKSB7XG4gICAgICByZXR1cm4gcy5jb3B5KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlRW5naW5lXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBpZiBsb2NhbFN0b3JhZ2U/XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShAZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKVxuICBzYXZlSW5QYXRoOiAocGF0aCwga2V5LCB2YWwpIC0+XG4gICAgZGF0YSA9IEBsb2FkKHBhdGgpXG4gICAgdW5sZXNzIGRhdGE/XG4gICAgICBkYXRhID0ge31cbiAgICBkYXRhW2tleV0gPSB2YWxcbiAgICBAc2F2ZShwYXRoLGRhdGEpXG4gIGxvYWQ6IChrZXkpIC0+XG4gICAgaWYgbG9jYWxTdG9yYWdlP1xuICAgICAgSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShAZnVsbEtleShrZXkpKSlcbiAgZnVsbEtleTogKGtleSkgLT5cbiAgICAnQ29kZVdhdmVfJytrZXkiLCJleHBvcnQgdmFyIExvY2FsU3RvcmFnZUVuZ2luZSA9IGNsYXNzIExvY2FsU3RvcmFnZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBzYXZlKGtleSwgdmFsKSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5mdWxsS2V5KGtleSksIEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0gdGhpcy5sb2FkKHBhdGgpO1xuICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICB9XG4gICAgZGF0YVtrZXldID0gdmFsO1xuICAgIHJldHVybiB0aGlzLnNhdmUocGF0aCwgZGF0YSk7XG4gIH1cblxuICBsb2FkKGtleSkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5mdWxsS2V5KGtleSkpKTtcbiAgICB9XG4gIH1cblxuICBmdWxsS2V5KGtleSkge1xuICAgIHJldHVybiAnQ29kZVdhdmVfJyArIGtleTtcbiAgfVxuXG59O1xuIl19
