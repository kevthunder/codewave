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

},{"./helpers/ArrayHelper":26,"./helpers/StringHelper":31,"./positioning/Pair":32}],2:[function(require,module,exports){
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

},{"./helpers/OptionalPromise":29,"./positioning/Pos":34,"./positioning/PosCollection":35,"./positioning/Replacement":36}],3:[function(require,module,exports){
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

},{"./Command":6,"./Context":7,"./helpers/NamespaceHelper":28}],4:[function(require,module,exports){
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

},{"./Codewave":5,"./Context":7,"./TextParser":18,"./helpers/OptionalPromise":29,"./helpers/StringHelper":31}],5:[function(require,module,exports){
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

},{"./ClosingPromp":2,"./Command":6,"./Context":7,"./Logger":11,"./PositionedCmdInstance":14,"./Process":15,"./TextParser":18,"./helpers/StringHelper":31,"./positioning/PosCollection":35}],6:[function(require,module,exports){
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

},{"./Context":7,"./Storage":16,"./helpers/NamespaceHelper":28}],7:[function(require,module,exports){
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

},{"./CmdFinder":3,"./CmdInstance":4,"./helpers/ArrayHelper":26}],8:[function(require,module,exports){
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

},{"./positioning/Pair":32}],9:[function(require,module,exports){
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

},{"./helpers/OptionalPromise":29,"./positioning/Pos":34,"./positioning/StrPos":38}],11:[function(require,module,exports){
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParamParser = void 0;
var indexOf = [].indexOf;

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
    key: "parse",
    value: function parse() {
      var allowedNamed, chr, i, inStr, j, name, param, ref;
      this.params = [];
      this.named = {};

      if (this.paramString.length) {
        allowedNamed = this.options.allowedNamed;
        inStr = false;
        param = '';
        name = false;

        for (i = j = 0, ref = this.paramString.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          chr = this.paramString[i];

          if (chr === ' ' && !inStr) {
            if (name) {
              this.named[name] = param;
            } else {
              this.params.push(param);
            }

            param = '';
            name = false;
          } else if ((chr === '"' || chr === "'") && (i === 0 || this.paramString[i - 1] !== '\\')) {
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
  }]);

  return ParamParser;
}();

exports.ParamParser = ParamParser;

},{}],14:[function(require,module,exports){
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

var _ParamParser = require("./ParamParser");

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
        allowedNamed: this.getOption('allowedNamed')
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

},{"./BoxHelper":1,"./CmdInstance":4,"./Command":6,"./ParamParser":13,"./helpers/NamespaceHelper":28,"./helpers/OptionalPromise":29,"./helpers/StringHelper":31,"./positioning/Pos":34,"./positioning/Replacement":36,"./positioning/StrPos":38}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"./Logger":11}],17:[function(require,module,exports){
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

},{"./TextParser":18,"./positioning/Pos":34}],18:[function(require,module,exports){
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

},{"./Editor":10,"./positioning/Pos":34}],19:[function(require,module,exports){
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

},{"./Codewave":5,"./Command":6,"./cmds/CoreCommandProvider":20,"./cmds/FileCommandProvider":21,"./cmds/HtmlCommandProvider":22,"./cmds/JsCommandProvider":23,"./cmds/PhpCommandProvider":24,"./positioning/Pos":34,"./positioning/WrappedPos":39,"./storageEngines/LocalStorageEngine":41}],20:[function(require,module,exports){
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

},{"../BoxHelper":1,"../Command":6,"../Detector":8,"../EditCmdProp":9,"../helpers/PathHelper":30,"../helpers/StringHelper":31,"../positioning/Replacement":36,"emmet":"emmet"}],21:[function(require,module,exports){
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

},{"../BoxHelper":1,"../Command":6,"../Detector":8,"../EditCmdProp":9,"../helpers/PathHelper":30,"../helpers/StringHelper":31,"../positioning/Replacement":36}],22:[function(require,module,exports){
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

},{"../Command":6}],23:[function(require,module,exports){
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

},{"../Command":6}],24:[function(require,module,exports){
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

},{"../Command":6,"../Detector":8,"../helpers/StringHelper":31}],25:[function(require,module,exports){
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

},{"./TextAreaEditor":17,"./bootstrap":19}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{"../positioning/Size":37}],32:[function(require,module,exports){
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

},{"../helpers/StringHelper":31,"./PairMatch":33,"./Pos":34}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{"../helpers/CommonHelper":27,"./Replacement":36,"./Wrapping":40}],36:[function(require,module,exports){
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

},{"../OptionObject":12,"../helpers/CommonHelper":27,"../helpers/StringHelper":31,"./Pos":34}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

},{"./Pos":34}],40:[function(require,module,exports){
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

},{"./Replacement":36}],41:[function(require,module,exports){
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

},{}]},{},[25])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvQm94SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9Cb3hIZWxwZXIuanMiLCIuLi9zcmMvQ2xvc2luZ1Byb21wLmNvZmZlZSIsIi4uL3NyYy9DbG9zaW5nUHJvbXAuanMiLCIuLi9zcmMvQ21kRmluZGVyLmNvZmZlZSIsIi4uL3NyYy9DbWRGaW5kZXIuanMiLCIuLi9zcmMvQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL0NtZEluc3RhbmNlLmpzIiwiLi4vc3JjL0NvZGV3YXZlLmNvZmZlZSIsIi4uL3NyYy9Db2Rld2F2ZS5qcyIsIi4uL3NyYy9Db21tYW5kLmNvZmZlZSIsIi4uL3NyYy9Db21tYW5kLmpzIiwiLi4vc3JjL0NvbnRleHQuY29mZmVlIiwiLi4vc3JjL0NvbnRleHQuanMiLCIuLi9zcmMvRGV0ZWN0b3IuY29mZmVlIiwiLi4vc3JjL0RldGVjdG9yLmpzIiwiLi4vc3JjL0VkaXRDbWRQcm9wLmNvZmZlZSIsIi4uL3NyYy9FZGl0Q21kUHJvcC5qcyIsIi4uL3NyYy9FZGl0b3IuY29mZmVlIiwiLi4vc3JjL0VkaXRvci5qcyIsIi4uL3NyYy9Mb2dnZXIuY29mZmVlIiwiLi4vc3JjL0xvZ2dlci5qcyIsIi4uL3NyYy9PcHRpb25PYmplY3QuY29mZmVlIiwiLi4vc3JjL09wdGlvbk9iamVjdC5qcyIsIi4uL3NyYy9QYXJhbVBhcnNlci5jb2ZmZWUiLCIuLi9zcmMvUGFyYW1QYXJzZXIuanMiLCIuLi9zcmMvUG9zaXRpb25lZENtZEluc3RhbmNlLmNvZmZlZSIsIi4uL3NyYy9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UuanMiLCIuLi9zcmMvUHJvY2Vzcy5jb2ZmZWUiLCIuLi9zcmMvU3RvcmFnZS5jb2ZmZWUiLCIuLi9zcmMvU3RvcmFnZS5qcyIsIi4uL3NyYy9UZXh0QXJlYUVkaXRvci5jb2ZmZWUiLCIuLi9zcmMvVGV4dEFyZWFFZGl0b3IuanMiLCIuLi9zcmMvVGV4dFBhcnNlci5jb2ZmZWUiLCIuLi9zcmMvVGV4dFBhcnNlci5qcyIsIi4uL3NyYy9ib290c3RyYXAuY29mZmVlIiwiLi4vc3JjL2Jvb3RzdHJhcC5qcyIsIi4uL3NyYy9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlci5qcyIsIi4uL3NyYy9jbWRzL0ZpbGVDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlci5qcyIsIi4uL3NyYy9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlci5qcyIsIi4uL3NyYy9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyLmNvZmZlZSIsIi4uL3NyYy9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyLmNvZmZlZSIsIi4uL3NyYy9jbWRzL1BocENvbW1hbmRQcm92aWRlci5qcyIsIi4uL3NyYy9lbnRyeS5jb2ZmZWUiLCIuLi9zcmMvZW50cnkuanMiLCIuLi9zcmMvaGVscGVycy9BcnJheUhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9BcnJheUhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL0NvbW1vbkhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9Db21tb25IZWxwZXIuanMiLCIuLi9zcmMvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZS5qcyIsIi4uL3NyYy9oZWxwZXJzL1BhdGhIZWxwZXIuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvUGF0aEhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL1N0cmluZ0hlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9TdHJpbmdIZWxwZXIuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpci5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpci5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyTWF0Y2guY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1BhaXJNYXRjaC5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9Qb3MuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvcy5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9SZXBsYWNlbWVudC5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9TaXplLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9TdHJQb3MuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1N0clBvcy5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9XcmFwcGVkUG9zLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9XcmFwcGVkUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwaW5nLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9XcmFwcGluZy5qcyIsIi4uL3NyYy9zdG9yYWdlRW5naW5lcy9Mb2NhbFN0b3JhZ2VFbmdpbmUuY29mZmVlIiwiLi4vc3JjL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBQSxJQUFBLGFBQUEsR0FBQSxPQUFBLENBQUEsd0JBQUEsQ0FBQTs7QUFDQSxJQUFBLFlBQUEsR0FBQSxPQUFBLENBQUEsdUJBQUEsQ0FBQTs7QUFDQSxJQUFBLEtBQUEsR0FBQSxPQUFBLENBQUEsb0JBQUEsQ0FBQTs7QUFFQSxJQUFh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SSxHQWRKLEVBY0k7QUNXUCxhRFZBLGNBQVksR0NVWjtBRFhPO0FBZEo7O0FBQUE7QUFBQSxHQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5pbXBvcnQgeyBQYWlyIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9QYWlyJztcblxuZXhwb3J0IGNsYXNzIEJveEhlbHBlclxuICBjb25zdHJ1Y3RvcjogKEBjb250ZXh0LCBvcHRpb25zID0ge30pIC0+XG4gICAgQGRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogQGNvbnRleHQuY29kZXdhdmUuZGVjb1xuICAgICAgcGFkOiAyXG4gICAgICB3aWR0aDogNTBcbiAgICAgIGhlaWdodDogM1xuICAgICAgb3BlblRleHQ6ICcnXG4gICAgICBjbG9zZVRleHQ6ICcnXG4gICAgICBwcmVmaXg6ICcnXG4gICAgICBzdWZmaXg6ICcnXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICBjbG9uZTogKHRleHQpIC0+XG4gICAgb3B0ID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XVxuICAgIHJldHVybiBuZXcgQm94SGVscGVyKEBjb250ZXh0LG9wdClcbiAgZHJhdzogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBzdGFydFNlcCgpICsgXCJcXG5cIiArIEBsaW5lcyh0ZXh0KSArIFwiXFxuXCIrIEBlbmRTZXAoKVxuICB3cmFwQ29tbWVudDogKHN0cikgLT5cbiAgICByZXR1cm4gQGNvbnRleHQud3JhcENvbW1lbnQoc3RyKVxuICBzZXBhcmF0b3I6IC0+XG4gICAgbGVuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAZGVjb0xpbmUobGVuKSlcbiAgc3RhcnRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAb3BlblRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEBwcmVmaXggKyBAd3JhcENvbW1lbnQoQG9wZW5UZXh0K0BkZWNvTGluZShsbikpXG4gIGVuZFNlcDogLT5cbiAgICBsbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aCAtIEBjbG9zZVRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAY2xvc2VUZXh0K0BkZWNvTGluZShsbikpICsgQHN1ZmZpeFxuICBkZWNvTGluZTogKGxlbikgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKEBkZWNvLCBsZW4pXG4gIHBhZGRpbmc6IC0+IFxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIEBwYWQpXG4gIGxpbmVzOiAodGV4dCA9ICcnLCB1cHRvSGVpZ2h0PXRydWUpIC0+XG4gICAgdGV4dCA9IHRleHQgb3IgJydcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKVxuICAgIGlmIHVwdG9IZWlnaHRcbiAgICAgIHJldHVybiAoQGxpbmUobGluZXNbeF0gb3IgJycpIGZvciB4IGluIFswLi5AaGVpZ2h0XSkuam9pbignXFxuJykgXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIChAbGluZShsKSBmb3IgbCBpbiBsaW5lcykuam9pbignXFxuJykgXG4gIGxpbmU6ICh0ZXh0ID0gJycpIC0+XG4gICAgcmV0dXJuIChTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsQGluZGVudCkgK1xuICAgICAgQHdyYXBDb21tZW50KFxuICAgICAgICBAZGVjbyArXG4gICAgICAgIEBwYWRkaW5nKCkgK1xuICAgICAgICB0ZXh0ICtcbiAgICAgICAgU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCBAd2lkdGggLSBAcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkubGVuZ3RoKSArIFxuICAgICAgICBAcGFkZGluZygpICtcbiAgICAgICAgQGRlY29cbiAgICAgICkpXG4gIGxlZnQ6IC0+XG4gICAgQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KEBkZWNvICsgQHBhZGRpbmcoKSlcbiAgcmlnaHQ6IC0+XG4gICAgQGNvbnRleHQud3JhcENvbW1lbnRSaWdodChAcGFkZGluZygpICsgQGRlY28pXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50OiAodGV4dCkgLT5cbiAgICByZXR1cm4gQGNvbnRleHQuY29kZXdhdmUucmVtb3ZlTWFya2VycyhAY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpXG4gIHRleHRCb3VuZHM6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0VHh0U2l6ZShAcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpXG4gIGdldEJveEZvclBvczogKHBvcykgLT5cbiAgICBkZXB0aCA9IEBnZXROZXN0ZWRMdmwocG9zLnN0YXJ0KVxuICAgIGlmIGRlcHRoID4gMFxuICAgICAgbGVmdCA9IEBsZWZ0KClcbiAgICAgIGN1ckxlZnQgPSBTdHJpbmdIZWxwZXIucmVwZWF0KGxlZnQsZGVwdGgtMSlcbiAgICAgIFxuICAgICAgY2xvbmUgPSBAY2xvbmUoKVxuICAgICAgcGxhY2Vob2xkZXIgPSBcIiMjI1BsYWNlSG9sZGVyIyMjXCJcbiAgICAgIGNsb25lLndpZHRoID0gcGxhY2Vob2xkZXIubGVuZ3RoXG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IEBkZWNvICsgQGRlY28gKyBwbGFjZWhvbGRlciArIEBkZWNvICsgQGRlY29cbiAgICAgIFxuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsJy4qJykpXG4gICAgICBlbmRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLmVuZFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgXG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLGVuZEZpbmQse1xuICAgICAgICB2YWxpZE1hdGNoOiAobWF0Y2gpPT5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nKG1hdGNoLGxlZnQpXG4gICAgICAgICAgZiA9IEBjb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KG1hdGNoLnN0YXJ0KCkgLFtsZWZ0LFwiXFxuXCIsXCJcXHJcIl0sLTEpXG4gICAgICAgICAgcmV0dXJuICFmPyBvciBmLnN0ciAhPSBsZWZ0XG4gICAgICB9KVxuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcyxAY29udGV4dC5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKVxuICAgICAgaWYgcmVzP1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIFxuICBnZXROZXN0ZWRMdmw6IChpbmRleCkgLT5cbiAgICBkZXB0aCA9IDBcbiAgICBsZWZ0ID0gQGxlZnQoKVxuICAgIHdoaWxlIChmID0gQGNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQoaW5kZXggLFtsZWZ0LFwiXFxuXCIsXCJcXHJcIl0sLTEpKT8gJiYgZi5zdHIgPT0gbGVmdFxuICAgICAgaW5kZXggPSBmLnBvc1xuICAgICAgZGVwdGgrK1xuICAgIHJldHVybiBkZXB0aFxuICBnZXRPcHRGcm9tTGluZTogKGxpbmUsZ2V0UGFkPXRydWUpIC0+XG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KEBkZWNvKSkrXCIpKFxcXFxzKilcIilcbiAgICByRW5kID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodChAZGVjbykpK1wiKShcXG58JClcIilcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpXG4gICAgcmVzRW5kID0gckVuZC5leGVjKGxpbmUpXG4gICAgaWYgcmVzU3RhcnQ/IGFuZCByZXNFbmQ/XG4gICAgICBpZiBnZXRQYWRcbiAgICAgICAgQHBhZCA9IE1hdGgubWluKHJlc1N0YXJ0WzNdLmxlbmd0aCxyZXNFbmRbMV0ubGVuZ3RoKVxuICAgICAgQGluZGVudCA9IHJlc1N0YXJ0WzFdLmxlbmd0aFxuICAgICAgc3RhcnRQb3MgPSByZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCArIEBwYWRcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSBAcGFkXG4gICAgICBAd2lkdGggPSBlbmRQb3MgLSBzdGFydFBvc1xuICAgIHJldHVybiB0aGlzXG4gIHJlZm9ybWF0TGluZXM6ICh0ZXh0LG9wdGlvbnM9e30pIC0+XG4gICAgcmV0dXJuIEBsaW5lcyhAcmVtb3ZlQ29tbWVudCh0ZXh0LG9wdGlvbnMpLGZhbHNlKVxuICByZW1vdmVDb21tZW50OiAodGV4dCxvcHRpb25zPXt9KS0+XG4gICAgaWYgdGV4dD9cbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH1cbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24oe30sZGVmYXVsdHMsb3B0aW9ucylcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAZGVjbylcbiAgICAgIGZsYWcgPSBpZiBvcHRpb25zWydtdWx0aWxpbmUnXSB0aGVuICdnbScgZWxzZSAnJ1xuICAgICAgcmUxID0gbmV3IFJlZ0V4cChcIl5cXFxccyoje2VjbH0oPzoje2VkfSkqXFxcXHN7MCwje0BwYWR9fVwiLCBmbGFnKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChcIlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXFxccyokXCIsIGZsYWcpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlMSwnJykucmVwbGFjZShyZTIsJycpXG4gICBcbiAgIiwiaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBBcnJheUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYWlyXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCB2YXIgQm94SGVscGVyID0gY2xhc3MgQm94SGVscGVyIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGtleSwgcmVmLCB2YWw7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogdGhpcy5jb250ZXh0LmNvZGV3YXZlLmRlY28sXG4gICAgICBwYWQ6IDIsXG4gICAgICB3aWR0aDogNTAsXG4gICAgICBoZWlnaHQ6IDMsXG4gICAgICBvcGVuVGV4dDogJycsXG4gICAgICBjbG9zZVRleHQ6ICcnLFxuICAgICAgcHJlZml4OiAnJyxcbiAgICAgIHN1ZmZpeDogJycsXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvbmUodGV4dCkge1xuICAgIHZhciBrZXksIG9wdCwgcmVmLCB2YWw7XG4gICAgb3B0ID0ge307XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgb3B0W2tleV0gPSB0aGlzW2tleV07XG4gICAgfVxuICAgIHJldHVybiBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dCwgb3B0KTtcbiAgfVxuXG4gIGRyYXcodGV4dCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0U2VwKCkgKyBcIlxcblwiICsgdGhpcy5saW5lcyh0ZXh0KSArIFwiXFxuXCIgKyB0aGlzLmVuZFNlcCgpO1xuICB9XG5cbiAgd3JhcENvbW1lbnQoc3RyKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudChzdHIpO1xuICB9XG5cbiAgc2VwYXJhdG9yKCkge1xuICAgIHZhciBsZW47XG4gICAgbGVuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjb0xpbmUobGVuKSk7XG4gIH1cblxuICBzdGFydFNlcCgpIHtcbiAgICB2YXIgbG47XG4gICAgbG4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGggLSB0aGlzLm9wZW5UZXh0Lmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLndyYXBDb21tZW50KHRoaXMub3BlblRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSk7XG4gIH1cblxuICBlbmRTZXAoKSB7XG4gICAgdmFyIGxuO1xuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5jbG9zZVRleHQubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLndyYXBDb21tZW50KHRoaXMuY2xvc2VUZXh0ICsgdGhpcy5kZWNvTGluZShsbikpICsgdGhpcy5zdWZmaXg7XG4gIH1cblxuICBkZWNvTGluZShsZW4pIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKHRoaXMuZGVjbywgbGVuKTtcbiAgfVxuXG4gIHBhZGRpbmcoKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy5wYWQpO1xuICB9XG5cbiAgbGluZXModGV4dCA9ICcnLCB1cHRvSGVpZ2h0ID0gdHJ1ZSkge1xuICAgIHZhciBsLCBsaW5lcywgeDtcbiAgICB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKTtcbiAgICBpZiAodXB0b0hlaWdodCkge1xuICAgICAgcmV0dXJuICgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLCByZWYsIHJlc3VsdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yICh4ID0gaSA9IDAsIHJlZiA9IHRoaXMuaGVpZ2h0OyAoMCA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmKTsgeCA9IDAgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsaW5lc1t4XSB8fCAnJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSkuY2FsbCh0aGlzKSkuam9pbignXFxuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSwgbGVuMSwgcmVzdWx0cztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4xID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuMTsgaSsrKSB7XG4gICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSkuY2FsbCh0aGlzKSkuam9pbignXFxuJyk7XG4gICAgfVxuICB9XG5cbiAgbGluZSh0ZXh0ID0gJycpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLmluZGVudCkgKyB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpICsgdGV4dCArIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy53aWR0aCAtIHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkubGVuZ3RoKSArIHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQodGhpcy5kZWNvICsgdGhpcy5wYWRkaW5nKCkpO1xuICB9XG5cbiAgcmlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnModGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZUNhcnJldCh0ZXh0KSk7XG4gIH1cblxuICB0ZXh0Qm91bmRzKHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldFR4dFNpemUodGhpcy5yZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSk7XG4gIH1cblxuICBnZXRCb3hGb3JQb3MocG9zKSB7XG4gICAgdmFyIGNsb25lLCBjdXJMZWZ0LCBkZXB0aCwgZW5kRmluZCwgbGVmdCwgcGFpciwgcGxhY2Vob2xkZXIsIHJlcywgc3RhcnRGaW5kO1xuICAgIGRlcHRoID0gdGhpcy5nZXROZXN0ZWRMdmwocG9zLnN0YXJ0KTtcbiAgICBpZiAoZGVwdGggPiAwKSB7XG4gICAgICBsZWZ0ID0gdGhpcy5sZWZ0KCk7XG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LCBkZXB0aCAtIDEpO1xuICAgICAgY2xvbmUgPSB0aGlzLmNsb25lKCk7XG4gICAgICBwbGFjZWhvbGRlciA9IFwiIyMjUGxhY2VIb2xkZXIjIyNcIjtcbiAgICAgIGNsb25lLndpZHRoID0gcGxhY2Vob2xkZXIubGVuZ3RoO1xuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSB0aGlzLmRlY28gKyB0aGlzLmRlY28gKyBwbGFjZWhvbGRlciArIHRoaXMuZGVjbyArIHRoaXMuZGVjbztcbiAgICAgIHN0YXJ0RmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCAnLionKSk7XG4gICAgICBlbmRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLmVuZFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCAnLionKSk7XG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLCBlbmRGaW5kLCB7XG4gICAgICAgIHZhbGlkTWF0Y2g6IChtYXRjaCkgPT4ge1xuICAgICAgICAgIHZhciBmO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1hdGNoLGxlZnQpXG4gICAgICAgICAgZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpLCBbbGVmdCwgXCJcXG5cIiwgXCJcXHJcIl0sIC0xKTtcbiAgICAgICAgICByZXR1cm4gKGYgPT0gbnVsbCkgfHwgZi5zdHIgIT09IGxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcywgdGhpcy5jb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpO1xuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGFydCArPSBjdXJMZWZ0Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXROZXN0ZWRMdmwoaW5kZXgpIHtcbiAgICB2YXIgZGVwdGgsIGYsIGxlZnQ7XG4gICAgZGVwdGggPSAwO1xuICAgIGxlZnQgPSB0aGlzLmxlZnQoKTtcbiAgICB3aGlsZSAoKChmID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KGluZGV4LCBbbGVmdCwgXCJcXG5cIiwgXCJcXHJcIl0sIC0xKSkgIT0gbnVsbCkgJiYgZi5zdHIgPT09IGxlZnQpIHtcbiAgICAgIGluZGV4ID0gZi5wb3M7XG4gICAgICBkZXB0aCsrO1xuICAgIH1cbiAgICByZXR1cm4gZGVwdGg7XG4gIH1cblxuICBnZXRPcHRGcm9tTGluZShsaW5lLCBnZXRQYWQgPSB0cnVlKSB7XG4gICAgdmFyIGVuZFBvcywgckVuZCwgclN0YXJ0LCByZXNFbmQsIHJlc1N0YXJ0LCBzdGFydFBvcztcbiAgICByU3RhcnQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQodGhpcy5kZWNvKSkgKyBcIikoXFxcXHMqKVwiKTtcbiAgICByRW5kID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLmRlY28pKSArIFwiKShcXG58JClcIik7XG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKTtcbiAgICByZXNFbmQgPSByRW5kLmV4ZWMobGluZSk7XG4gICAgaWYgKChyZXNTdGFydCAhPSBudWxsKSAmJiAocmVzRW5kICE9IG51bGwpKSB7XG4gICAgICBpZiAoZ2V0UGFkKSB7XG4gICAgICAgIHRoaXMucGFkID0gTWF0aC5taW4ocmVzU3RhcnRbM10ubGVuZ3RoLCByZXNFbmRbMV0ubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5kZW50ID0gcmVzU3RhcnRbMV0ubGVuZ3RoO1xuICAgICAgc3RhcnRQb3MgPSByZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCArIHRoaXMucGFkO1xuICAgICAgZW5kUG9zID0gcmVzRW5kLmluZGV4ICsgcmVzRW5kWzFdLmxlbmd0aCAtIHRoaXMucGFkO1xuICAgICAgdGhpcy53aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlZm9ybWF0TGluZXModGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMubGluZXModGhpcy5yZW1vdmVDb21tZW50KHRleHQsIG9wdGlvbnMpLCBmYWxzZSk7XG4gIH1cblxuICByZW1vdmVDb21tZW50KHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywgZWNsLCBlY3IsIGVkLCBmbGFnLCBvcHQsIHJlMSwgcmUyO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH07XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuZGVjbyk7XG4gICAgICBmbGFnID0gb3B0aW9uc1snbXVsdGlsaW5lJ10gPyAnZ20nIDogJyc7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzezAsJHt0aGlzLnBhZH19YCwgZmxhZyk7XG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBcXFxccyooPzoke2VkfSkqJHtlY3J9XFxcXHMqJGAsIGZsYWcpO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsICcnKS5yZXBsYWNlKHJlMiwgJycpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zQ29sbGVjdGlvbiB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgb3B0aW9uYWxQcm9taXNlIH0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCBjbGFzcyBDbG9zaW5nUHJvbXBcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsc2VsZWN0aW9ucykgLT5cbiAgICBAdGltZW91dCA9IG51bGxcbiAgICBAX3R5cGVkID0gbnVsbFxuICAgIEBzdGFydGVkID0gZmFsc2VcbiAgICBAbmJDaGFuZ2VzID0gMFxuICAgIEBzZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucylcbiAgYmVnaW46IC0+XG4gICAgQHN0YXJ0ZWQgPSB0cnVlXG4gICAgb3B0aW9uYWxQcm9taXNlKEBhZGRDYXJyZXRzKCkpLnRoZW4gPT5cbiAgICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKVxuICAgICAgICBAcHJveHlPbkNoYW5nZSA9IChjaD1udWxsKT0+IEBvbkNoYW5nZShjaClcbiAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lciggQHByb3h5T25DaGFuZ2UgKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICAucmVzdWx0KClcbiAgYWRkQ2FycmV0czogLT5cbiAgICBAcmVwbGFjZW1lbnRzID0gQHNlbGVjdGlvbnMud3JhcChcbiAgICAgIEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNhcnJldENoYXIgKyBAY29kZXdhdmUuYnJha2V0cyArIFwiXFxuXCIsXG4gICAgICBcIlxcblwiICsgQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNvZGV3YXZlLmNhcnJldENoYXIgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICkubWFwKCAocCkgLT4gcC5jYXJyZXRUb1NlbCgpIClcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKEByZXBsYWNlbWVudHMpXG4gIGludmFsaWRUeXBlZDogLT5cbiAgICBAX3R5cGVkID0gbnVsbFxuICBvbkNoYW5nZTogKGNoID0gbnVsbCktPlxuICAgIEBpbnZhbGlkVHlwZWQoKVxuICAgIGlmIEBza2lwRXZlbnQoY2gpXG4gICAgICByZXR1cm5cbiAgICBAbmJDaGFuZ2VzKytcbiAgICBpZiBAc2hvdWxkU3RvcCgpXG4gICAgICBAc3RvcCgpXG4gICAgICBAY2xlYW5DbG9zZSgpXG4gICAgZWxzZVxuICAgICAgQHJlc3VtZSgpXG4gICAgICBcbiAgc2tpcEV2ZW50OiAoY2gpIC0+XG4gICAgcmV0dXJuIGNoPyBhbmQgY2guY2hhckNvZGVBdCgwKSAhPSAzMlxuICBcbiAgcmVzdW1lOiAtPlxuICAgICNcbiAgICBcbiAgc2hvdWxkU3RvcDogLT5cbiAgICByZXR1cm4gQHR5cGVkKCkgPT0gZmFsc2Ugb3IgQHR5cGVkKCkuaW5kZXhPZignICcpICE9IC0xXG4gIFxuICBjbGVhbkNsb3NlOiAtPlxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc2VsZWN0aW9ucyA9IEBnZXRTZWxlY3Rpb25zKClcbiAgICBmb3Igc2VsIGluIHNlbGVjdGlvbnNcbiAgICAgIGlmIHBvcyA9IEB3aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICAgIHN0YXJ0ID0gc2VsXG4gICAgICBlbHNlIGlmIChlbmQgPSBAd2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpIGFuZCBzdGFydD9cbiAgICAgICAgcmVzID0gZW5kLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXVxuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LGVuZC5pbm5lckVuZCxyZXMpXG4gICAgICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtzdGFydF1cbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gocmVwbClcbiAgICAgICAgc3RhcnQgPSBudWxsXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIGdldFNlbGVjdGlvbnM6IC0+XG4gICAgcmV0dXJuIEBjb2Rld2F2ZS5lZGl0b3IuZ2V0TXVsdGlTZWwoKVxuICBzdG9wOiAtPlxuICAgIEBzdGFydGVkID0gZmFsc2VcbiAgICBjbGVhclRpbWVvdXQoQHRpbWVvdXQpIGlmIEB0aW1lb3V0P1xuICAgIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPSBudWxsIGlmIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPT0gdGhpc1xuICAgIGlmIEBwcm94eU9uQ2hhbmdlP1xuICAgICAgQGNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcihAcHJveHlPbkNoYW5nZSlcbiAgY2FuY2VsOiAtPlxuICAgIGlmIEB0eXBlZCgpICE9IGZhbHNlXG4gICAgICBAY2FuY2VsU2VsZWN0aW9ucyhAZ2V0U2VsZWN0aW9ucygpKVxuICAgIEBzdG9wKClcbiAgY2FuY2VsU2VsZWN0aW9uczogKHNlbGVjdGlvbnMpIC0+XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzdGFydCA9IG51bGxcbiAgICBmb3Igc2VsIGluIHNlbGVjdGlvbnNcbiAgICAgIGlmIHBvcyA9IEB3aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICAgIHN0YXJ0ID0gcG9zXG4gICAgICBlbHNlIGlmIChlbmQgPSBAd2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpIGFuZCBzdGFydD9cbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3IFJlcGxhY2VtZW50KHN0YXJ0LnN0YXJ0LGVuZC5lbmQsQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHN0YXJ0LmVuZCsxLCBlbmQuc3RhcnQtMSkpLnNlbGVjdENvbnRlbnQoKSlcbiAgICAgICAgc3RhcnQgPSBudWxsXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIHR5cGVkOiAtPlxuICAgIHVubGVzcyBAX3R5cGVkP1xuICAgICAgY3BvcyA9IEBjb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKClcbiAgICAgIGlubmVyU3RhcnQgPSBAcmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICsgQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoXG4gICAgICBpZiBAY29kZXdhdmUuZmluZFByZXZCcmFrZXQoY3Bvcy5zdGFydCkgPT0gQHJlcGxhY2VtZW50c1swXS5zdGFydCBhbmQgKGlubmVyRW5kID0gQGNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGlubmVyU3RhcnQpKT8gYW5kIGlubmVyRW5kID49IGNwb3MuZW5kXG4gICAgICAgIEBfdHlwZWQgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpXG4gICAgICBlbHNlXG4gICAgICAgIEBfdHlwZWQgPSBmYWxzZVxuICAgIHJldHVybiBAX3R5cGVkXG4gIHdoaXRoaW5PcGVuQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBzdGFydFBvc0F0KGkpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PSB0YXJnZXRUZXh0XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcbiAgd2hpdGhpbkNsb3NlQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBlbmRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09IHRhcmdldFRleHRcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuICBzdGFydFBvc0F0OiAoaW5kZXgpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiksXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uZW5kICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzEpXG4gICAgICApLndyYXBwZWRCeShAY29kZXdhdmUuYnJha2V0cywgQGNvZGV3YXZlLmJyYWtldHMpXG4gIGVuZFBvc0F0OiAoaW5kZXgpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uc3RhcnQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMSksXG4gICAgICAgIEByZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzIpXG4gICAgICApLndyYXBwZWRCeShAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIsIEBjb2Rld2F2ZS5icmFrZXRzKVxuXG5leHBvcnQgY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wXG4gIHJlc3VtZTogLT5cbiAgICBAc2ltdWxhdGVUeXBlKClcbiAgc2ltdWxhdGVUeXBlOiAtPlxuICAgIGNsZWFyVGltZW91dChAdGltZW91dCkgaWYgQHRpbWVvdXQ/XG4gICAgQHRpbWVvdXQgPSBzZXRUaW1lb3V0ICg9PlxuICAgICAgQGludmFsaWRUeXBlZCgpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgY3VyQ2xvc2UgPSBAd2hpdGhpbkNsb3NlQm91bmRzKEByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXS5jb3B5KCkuYXBwbHlPZmZzZXQoQHR5cGVkKCkubGVuZ3RoKSlcbiAgICAgIGlmIGN1ckNsb3NlXG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoY3VyQ2xvc2Uuc3RhcnQsY3VyQ2xvc2UuZW5kLHRhcmdldFRleHQpXG4gICAgICAgIGlmIHJlcGwud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS5uZWNlc3NhcnkoKVxuICAgICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoW3JlcGxdKVxuICAgICAgZWxzZVxuICAgICAgICBAc3RvcCgpXG4gICAgICBAb25UeXBlU2ltdWxhdGVkKCkgaWYgQG9uVHlwZVNpbXVsYXRlZD9cbiAgICApLCAyXG4gIHNraXBFdmVudDogLT5cbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0U2VsZWN0aW9uczogLT5cbiAgICByZXR1cm4gW1xuICAgICAgICBAY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpXG4gICAgICAgIEByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXSArIEB0eXBlZCgpLmxlbmd0aFxuICAgICAgXVxuICB3aGl0aGluQ2xvc2VCb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQGVuZFBvc0F0KGkpXG4gICAgICBuZXh0ID0gQGNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KVxuICAgICAgaWYgbmV4dD9cbiAgICAgICAgdGFyZ2V0UG9zLm1vdmVTdWZmaXgobmV4dClcbiAgICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKVxuICAgICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IChjb2Rld2F2ZSxzZWxlY3Rpb25zKSAtPlxuICBpZiBjb2Rld2F2ZS5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgcmV0dXJuIG5ldyBDbG9zaW5nUHJvbXAoY29kZXdhdmUsc2VsZWN0aW9ucylcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLHNlbGVjdGlvbnMpIiwiaW1wb3J0IHtcbiAgUG9zQ29sbGVjdGlvblxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgb3B0aW9uYWxQcm9taXNlXG59IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgdmFyIENsb3NpbmdQcm9tcCA9IGNsYXNzIENsb3NpbmdQcm9tcCB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlMSwgc2VsZWN0aW9ucykge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTE7XG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLl90eXBlZCA9IG51bGw7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5uYkNoYW5nZXMgPSAwO1xuICAgIHRoaXMuc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uKHNlbGVjdGlvbnMpO1xuICB9XG5cbiAgYmVnaW4oKSB7XG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gb3B0aW9uYWxQcm9taXNlKHRoaXMuYWRkQ2FycmV0cygpKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci5jYW5MaXN0ZW5Ub0NoYW5nZSgpKSB7XG4gICAgICAgIHRoaXMucHJveHlPbkNoYW5nZSA9IChjaCA9IG51bGwpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkNoYW5nZShjaCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMucHJveHlPbkNoYW5nZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KS5yZXN1bHQoKTtcbiAgfVxuXG4gIGFkZENhcnJldHMoKSB7XG4gICAgdGhpcy5yZXBsYWNlbWVudHMgPSB0aGlzLnNlbGVjdGlvbnMud3JhcCh0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyBcIlxcblwiLCBcIlxcblwiICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMpLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gcC5jYXJyZXRUb1NlbCgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyh0aGlzLnJlcGxhY2VtZW50cyk7XG4gIH1cblxuICBpbnZhbGlkVHlwZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkID0gbnVsbDtcbiAgfVxuXG4gIG9uQ2hhbmdlKGNoID0gbnVsbCkge1xuICAgIHRoaXMuaW52YWxpZFR5cGVkKCk7XG4gICAgaWYgKHRoaXMuc2tpcEV2ZW50KGNoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm5iQ2hhbmdlcysrO1xuICAgIGlmICh0aGlzLnNob3VsZFN0b3AoKSkge1xuICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICByZXR1cm4gdGhpcy5jbGVhbkNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VtZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNraXBFdmVudChjaCkge1xuICAgIHJldHVybiAoY2ggIT0gbnVsbCkgJiYgY2guY2hhckNvZGVBdCgwKSAhPT0gMzI7XG4gIH1cblxuICByZXN1bWUoKSB7fVxuXG4gIFxuICBzaG91bGRTdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGVkKCkgPT09IGZhbHNlIHx8IHRoaXMudHlwZWQoKS5pbmRleE9mKCcgJykgIT09IC0xO1xuICB9XG5cbiAgY2xlYW5DbG9zZSgpIHtcbiAgICB2YXIgZW5kLCBqLCBsZW4sIHBvcywgcmVwbCwgcmVwbGFjZW1lbnRzLCByZXMsIHNlbCwgc2VsZWN0aW9ucywgc3RhcnQ7XG4gICAgcmVwbGFjZW1lbnRzID0gW107XG4gICAgc2VsZWN0aW9ucyA9IHRoaXMuZ2V0U2VsZWN0aW9ucygpO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNlbGVjdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNlbCA9IHNlbGVjdGlvbnNbal07XG4gICAgICBpZiAocG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpKSB7XG4gICAgICAgIHN0YXJ0ID0gc2VsO1xuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgKHN0YXJ0ICE9IG51bGwpKSB7XG4gICAgICAgIHJlcyA9IGVuZC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS5pbm5lclRleHQoKS5zcGxpdCgnICcpWzBdO1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LCBlbmQuaW5uZXJFbmQsIHJlcyk7XG4gICAgICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtzdGFydF07XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKHJlcGwpO1xuICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0TXVsdGlTZWwoKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID09PSB0aGlzKSB7XG4gICAgICB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3h5T25DaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMucHJveHlPbkNoYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIGlmICh0aGlzLnR5cGVkKCkgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmNhbmNlbFNlbGVjdGlvbnModGhpcy5nZXRTZWxlY3Rpb25zKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdG9wKCk7XG4gIH1cblxuICBjYW5jZWxTZWxlY3Rpb25zKHNlbGVjdGlvbnMpIHtcbiAgICB2YXIgZW5kLCBqLCBsZW4sIHBvcywgcmVwbGFjZW1lbnRzLCBzZWwsIHN0YXJ0O1xuICAgIHJlcGxhY2VtZW50cyA9IFtdO1xuICAgIHN0YXJ0ID0gbnVsbDtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdO1xuICAgICAgaWYgKHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKSkge1xuICAgICAgICBzdGFydCA9IHBvcztcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIChzdGFydCAhPSBudWxsKSkge1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXcgUmVwbGFjZW1lbnQoc3RhcnQuc3RhcnQsIGVuZC5lbmQsIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoc3RhcnQuZW5kICsgMSwgZW5kLnN0YXJ0IC0gMSkpLnNlbGVjdENvbnRlbnQoKSk7XG4gICAgICAgIHN0YXJ0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxuICB0eXBlZCgpIHtcbiAgICB2YXIgY3BvcywgaW5uZXJFbmQsIGlubmVyU3RhcnQ7XG4gICAgaWYgKHRoaXMuX3R5cGVkID09IG51bGwpIHtcbiAgICAgIGNwb3MgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKTtcbiAgICAgIGlubmVyU3RhcnQgPSB0aGlzLnJlcGxhY2VtZW50c1swXS5zdGFydCArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGg7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PT0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgJiYgKChpbm5lckVuZCA9IHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoaW5uZXJTdGFydCkpICE9IG51bGwpICYmIGlubmVyRW5kID49IGNwb3MuZW5kKSB7XG4gICAgICAgIHRoaXMuX3R5cGVkID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihpbm5lclN0YXJ0LCBpbm5lckVuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl90eXBlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdHlwZWQ7XG4gIH1cblxuICB3aGl0aGluT3BlbkJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuc3RhcnRQb3NBdChpKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXJ0UG9zQXQoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5zdGFydCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cywgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKTtcbiAgfVxuXG4gIGVuZFBvc0F0KGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDEpLCB0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5lbmQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDIpKS53cmFwcGVkQnkodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIsIHRoaXMuY29kZXdhdmUuYnJha2V0cyk7XG4gIH1cblxufTtcblxuZXhwb3J0IHZhciBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgPSBjbGFzcyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgZXh0ZW5kcyBDbG9zaW5nUHJvbXAge1xuICByZXN1bWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2ltdWxhdGVUeXBlKCk7XG4gIH1cblxuICBzaW11bGF0ZVR5cGUoKSB7XG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgIHZhciBjdXJDbG9zZSwgcmVwbCwgdGFyZ2V0VGV4dDtcbiAgICAgIHRoaXMuaW52YWxpZFR5cGVkKCk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICBjdXJDbG9zZSA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0uY29weSgpLmFwcGx5T2Zmc2V0KHRoaXMudHlwZWQoKS5sZW5ndGgpKTtcbiAgICAgIGlmIChjdXJDbG9zZSkge1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LCBjdXJDbG9zZS5lbmQsIHRhcmdldFRleHQpO1xuICAgICAgICBpZiAocmVwbC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS5uZWNlc3NhcnkoKSkge1xuICAgICAgICAgIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKFtyZXBsXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub25UeXBlU2ltdWxhdGVkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25UeXBlU2ltdWxhdGVkKCk7XG4gICAgICB9XG4gICAgfSksIDIpO1xuICB9XG5cbiAgc2tpcEV2ZW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIFt0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKSwgdGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXSArIHRoaXMudHlwZWQoKS5sZW5ndGhdO1xuICB9XG5cbiAgd2hpdGhpbkNsb3NlQm91bmRzKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIG5leHQsIHJlZiwgcmVwbCwgdGFyZ2V0UG9zO1xuICAgIHJlZiA9IHRoaXMucmVwbGFjZW1lbnRzO1xuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5lbmRQb3NBdChpKTtcbiAgICAgIG5leHQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KTtcbiAgICAgIGlmIChuZXh0ICE9IG51bGwpIHtcbiAgICAgICAgdGFyZ2V0UG9zLm1vdmVTdWZmaXgobmV4dCk7XG4gICAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldFBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxufTtcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IGZ1bmN0aW9uKGNvZGV3YXZlLCBzZWxlY3Rpb25zKSB7XG4gIGlmIChjb2Rld2F2ZS5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgcmV0dXJuIG5ldyBDbG9zaW5nUHJvbXAoY29kZXdhdmUsIHNlbGVjdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIENtZEZpbmRlclxuICBjb25zdHJ1Y3RvcjogKG5hbWVzLCBvcHRpb25zKSAtPlxuICAgIGlmIHR5cGVvZiBuYW1lcyA9PSAnc3RyaW5nJ1xuICAgICAgbmFtZXMgPSBbbmFtZXNdXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGxcbiAgICAgIG5hbWVzcGFjZXM6IFtdXG4gICAgICBwYXJlbnRDb250ZXh0OiBudWxsXG4gICAgICBjb250ZXh0OiBudWxsXG4gICAgICByb290OiBDb21tYW5kLmNtZHNcbiAgICAgIG11c3RFeGVjdXRlOiB0cnVlXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWVcbiAgICAgIHVzZUZhbGxiYWNrczogdHJ1ZVxuICAgICAgaW5zdGFuY2U6IG51bGxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfVxuICAgIEBuYW1lcyA9IG5hbWVzXG4gICAgQHBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dChAY29kZXdhdmUpXG4gICAgaWYgQHBhcmVudENvbnRleHQ/XG4gICAgICBAY29udGV4dC5wYXJlbnQgPSBAcGFyZW50Q29udGV4dFxuICAgIGlmIEBuYW1lc3BhY2VzP1xuICAgICAgQGNvbnRleHQuYWRkTmFtZXNwYWNlcyhAbmFtZXNwYWNlcylcbiAgZmluZDogLT5cbiAgICBAdHJpZ2dlckRldGVjdG9ycygpXG4gICAgQGNtZCA9IEBmaW5kSW4oQHJvb3QpXG4gICAgcmV0dXJuIEBjbWRcbiMgIGdldFBvc2liaWxpdGllczogLT5cbiMgICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuIyAgICBwYXRoID0gbGlzdChAcGF0aClcbiMgICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcbiAgZ2V0TmFtZXNXaXRoUGF0aHM6IC0+XG4gICAgcGF0aHMgPSB7fVxuICAgIGZvciBuYW1lIGluIEBuYW1lcyBcbiAgICAgIFtzcGFjZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG4gICAgICBpZiBzcGFjZT8gYW5kICEoc3BhY2UgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgICB1bmxlc3Mgc3BhY2Ugb2YgcGF0aHMgXG4gICAgICAgICAgcGF0aHNbc3BhY2VdID0gW11cbiAgICAgICAgcGF0aHNbc3BhY2VdLnB1c2gocmVzdClcbiAgICByZXR1cm4gcGF0aHNcbiAgYXBwbHlTcGFjZU9uTmFtZXM6IChuYW1lc3BhY2UpIC0+XG4gICAgW3NwYWNlLHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZXNwYWNlLHRydWUpXG4gICAgQG5hbWVzLm1hcCggKG5hbWUpIC0+XG4gICAgICBbY3VyX3NwYWNlLGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG4gICAgICBpZiBjdXJfc3BhY2U/IGFuZCBjdXJfc3BhY2UgPT0gc3BhY2VcbiAgICAgICAgbmFtZSA9IGN1cl9yZXN0XG4gICAgICBpZiByZXN0P1xuICAgICAgICBuYW1lID0gcmVzdCArICc6JyArIG5hbWVcbiAgICAgIHJldHVybiBuYW1lXG4gICAgKVxuICBnZXREaXJlY3ROYW1lczogLT5cbiAgICByZXR1cm4gKG4gZm9yIG4gaW4gQG5hbWVzIHdoZW4gbi5pbmRleE9mKFwiOlwiKSA9PSAtMSlcbiAgdHJpZ2dlckRldGVjdG9yczogLT5cbiAgICBpZiBAdXNlRGV0ZWN0b3JzIFxuICAgICAgQHVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICBwb3NpYmlsaXRpZXMgPSBuZXcgQ21kRmluZGVyKEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IHBvc2liaWxpdGllcy5sZW5ndGhcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldXG4gICAgICAgIGZvciBkZXRlY3RvciBpbiBjbWQuZGV0ZWN0b3JzIFxuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKVxuICAgICAgICAgIGlmIHJlcz9cbiAgICAgICAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMocmVzKVxuICAgICAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKHJlcywge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgICAgICBpKytcbiAgZmluZEluOiAoY21kLHBhdGggPSBudWxsKSAtPlxuICAgIHVubGVzcyBjbWQ/XG4gICAgICByZXR1cm4gbnVsbFxuICAgIGJlc3QgPSBAYmVzdEluUG9zaWJpbGl0aWVzKEBmaW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgaWYgYmVzdD9cbiAgICAgIHJldHVybiBiZXN0XG4gIGZpbmRQb3NpYmlsaXRpZXM6IC0+XG4gICAgdW5sZXNzIEByb290P1xuICAgICAgcmV0dXJuIFtdXG4gICAgQHJvb3QuaW5pdCgpXG4gICAgcG9zaWJpbGl0aWVzID0gW11cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/LmNtZCA9PSBAcm9vdFxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChAZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoJ2luX2luc3RhbmNlJykpXG4gICAgZm9yIHNwYWNlLCBuYW1lcyBvZiBAZ2V0TmFtZXNXaXRoUGF0aHMoKVxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChAZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoc3BhY2UsIG5hbWVzKSlcbiAgICBmb3IgbnNwYyBpbiBAY29udGV4dC5nZXROYW1lU3BhY2VzKClcbiAgICAgIFtuc3BjTmFtZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsdHJ1ZSlcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQoQGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKG5zcGNOYW1lLCBAYXBwbHlTcGFjZU9uTmFtZXMobnNwYykpKVxuICAgIGZvciBuYW1lIGluIEBnZXREaXJlY3ROYW1lcygpXG4gICAgICBkaXJlY3QgPSBAcm9vdC5nZXRDbWQobmFtZSlcbiAgICAgIGlmIEBjbWRJc1ZhbGlkKGRpcmVjdClcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZGlyZWN0KVxuICAgIGlmIEB1c2VGYWxsYmFja3NcbiAgICAgIGZhbGxiYWNrID0gQHJvb3QuZ2V0Q21kKCdmYWxsYmFjaycpXG4gICAgICBpZiBAY21kSXNWYWxpZChmYWxsYmFjaylcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZmFsbGJhY2spXG4gICAgQHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllc1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXNcbiAgZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQ6IChjbWROYW1lLCBuYW1lcyA9IEBuYW1lcykgLT5cbiAgICBwb3NpYmlsaXRpZXMgPSBbXTtcbiAgICBuZXh0cyA9IEBnZXRDbWRGb2xsb3dBbGlhcyhjbWROYW1lKVxuICAgIGZvciBuZXh0IGluIG5leHRzXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgcG9zaWJpbGl0aWVzXG4gIGdldENtZEZvbGxvd0FsaWFzOiAobmFtZSkgLT5cbiAgICBjbWQgPSBAcm9vdC5nZXRDbWQobmFtZSlcbiAgICBpZiBjbWQ/IFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmFsaWFzT2Y/XG4gICAgICAgIHJldHVybiBbY21kLGNtZC5nZXRBbGlhc2VkKCldXG4gICAgICByZXR1cm4gW2NtZF1cbiAgICByZXR1cm4gW2NtZF1cbiAgY21kSXNWYWxpZDogKGNtZCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgaWYgY21kLm5hbWUgIT0gJ2ZhbGxiYWNrJyAmJiBjbWQgaW4gQGFuY2VzdG9ycygpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gIUBtdXN0RXhlY3V0ZSBvciBAY21kSXNFeGVjdXRhYmxlKGNtZClcbiAgYW5jZXN0b3JzOiAtPlxuICAgIGlmIEBjb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICByZXR1cm4gW11cbiAgY21kSXNFeGVjdXRhYmxlOiAoY21kKSAtPlxuICAgIG5hbWVzID0gQGdldERpcmVjdE5hbWVzKClcbiAgICBpZiBuYW1lcy5sZW5ndGggPT0gMVxuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZXNbMF0pXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgY21kU2NvcmU6IChjbWQpIC0+XG4gICAgc2NvcmUgPSBjbWQuZGVwdGhcbiAgICBpZiBjbWQubmFtZSA9PSAnZmFsbGJhY2snIFxuICAgICAgICBzY29yZSAtPSAxMDAwXG4gICAgcmV0dXJuIHNjb3JlXG4gIGJlc3RJblBvc2liaWxpdGllczogKHBvc3MpIC0+XG4gICAgaWYgcG9zcy5sZW5ndGggPiAwXG4gICAgICBiZXN0ID0gbnVsbFxuICAgICAgYmVzdFNjb3JlID0gbnVsbFxuICAgICAgZm9yIHAgaW4gcG9zc1xuICAgICAgICBzY29yZSA9IEBjbWRTY29yZShwKVxuICAgICAgICBpZiAhYmVzdD8gb3Igc2NvcmUgPj0gYmVzdFNjb3JlXG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmVcbiAgICAgICAgICBiZXN0ID0gcFxuICAgICAgcmV0dXJuIGJlc3Q7IiwidmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xuXG5pbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIE5hbWVzcGFjZUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIENtZEZpbmRlciA9IGNsYXNzIENtZEZpbmRlciB7XG4gIGNvbnN0cnVjdG9yKG5hbWVzLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdO1xuICAgIH1cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgcGFyZW50Q29udGV4dDogbnVsbCxcbiAgICAgIGNvbnRleHQ6IG51bGwsXG4gICAgICByb290OiBDb21tYW5kLmNtZHMsXG4gICAgICBtdXN0RXhlY3V0ZTogdHJ1ZSxcbiAgICAgIHVzZURldGVjdG9yczogdHJ1ZSxcbiAgICAgIHVzZUZhbGxiYWNrczogdHJ1ZSxcbiAgICAgIGluc3RhbmNlOiBudWxsLFxuICAgICAgY29kZXdhdmU6IG51bGxcbiAgICB9O1xuICAgIHRoaXMubmFtZXMgPSBuYW1lcztcbiAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddO1xuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSBpZiAoKHRoaXMucGFyZW50ICE9IG51bGwpICYmIGtleSAhPT0gJ3BhcmVudCcpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzLmNvZGV3YXZlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGFyZW50Q29udGV4dCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5wYXJlbnRDb250ZXh0O1xuICAgIH1cbiAgICBpZiAodGhpcy5uYW1lc3BhY2VzICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHRoaXMubmFtZXNwYWNlcyk7XG4gICAgfVxuICB9XG5cbiAgZmluZCgpIHtcbiAgICB0aGlzLnRyaWdnZXJEZXRlY3RvcnMoKTtcbiAgICB0aGlzLmNtZCA9IHRoaXMuZmluZEluKHRoaXMucm9vdCk7XG4gICAgcmV0dXJuIHRoaXMuY21kO1xuICB9XG5cbiAgLy8gIGdldFBvc2liaWxpdGllczogLT5cbiAgLy8gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAvLyAgICBwYXRoID0gbGlzdChAcGF0aClcbiAgLy8gICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcbiAgZ2V0TmFtZXNXaXRoUGF0aHMoKSB7XG4gICAgdmFyIGosIGxlbiwgbmFtZSwgcGF0aHMsIHJlZiwgcmVzdCwgc3BhY2U7XG4gICAgcGF0aHMgPSB7fTtcbiAgICByZWYgPSB0aGlzLm5hbWVzO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmFtZSA9IHJlZltqXTtcbiAgICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKTtcbiAgICAgIGlmICgoc3BhY2UgIT0gbnVsbCkgJiYgIShpbmRleE9mLmNhbGwodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwgc3BhY2UpID49IDApKSB7XG4gICAgICAgIGlmICghKHNwYWNlIGluIHBhdGhzKSkge1xuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGF0aHM7XG4gIH1cblxuICBhcHBseVNwYWNlT25OYW1lcyhuYW1lc3BhY2UpIHtcbiAgICB2YXIgcmVzdCwgc3BhY2U7XG4gICAgW3NwYWNlLCByZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMubmFtZXMubWFwKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBjdXJfcmVzdCwgY3VyX3NwYWNlO1xuICAgICAgW2N1cl9zcGFjZSwgY3VyX3Jlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG4gICAgICBpZiAoKGN1cl9zcGFjZSAhPSBudWxsKSAmJiBjdXJfc3BhY2UgPT09IHNwYWNlKSB7XG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXN0ICE9IG51bGwpIHtcbiAgICAgICAgbmFtZSA9IHJlc3QgKyAnOicgKyBuYW1lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXREaXJlY3ROYW1lcygpIHtcbiAgICB2YXIgbjtcbiAgICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgcmVmID0gdGhpcy5uYW1lcztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBuID0gcmVmW2pdO1xuICAgICAgICBpZiAobi5pbmRleE9mKFwiOlwiKSA9PT0gLTEpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gobik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0pLmNhbGwodGhpcyk7XG4gIH1cblxuICB0cmlnZ2VyRGV0ZWN0b3JzKCkge1xuICAgIHZhciBjbWQsIGRldGVjdG9yLCBpLCBqLCBsZW4sIHBvc2liaWxpdGllcywgcmVmLCByZXMsIHJlc3VsdHM7XG4gICAgaWYgKHRoaXMudXNlRGV0ZWN0b3JzKSB7XG4gICAgICB0aGlzLnVzZURldGVjdG9ycyA9IGZhbHNlO1xuICAgICAgcG9zaWJpbGl0aWVzID0gbmV3IENtZEZpbmRlcih0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCB7XG4gICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCk7XG4gICAgICBpID0gMDtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIHdoaWxlIChpIDwgcG9zaWJpbGl0aWVzLmxlbmd0aCkge1xuICAgICAgICBjbWQgPSBwb3NpYmlsaXRpZXNbaV07XG4gICAgICAgIHJlZiA9IGNtZC5kZXRlY3RvcnM7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIGRldGVjdG9yID0gcmVmW2pdO1xuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKTtcbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcyk7XG4gICAgICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIocmVzLCB7XG4gICAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICAgICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRJbihjbWQsIHBhdGggPSBudWxsKSB7XG4gICAgdmFyIGJlc3Q7XG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgYmVzdCA9IHRoaXMuYmVzdEluUG9zaWJpbGl0aWVzKHRoaXMuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICBpZiAoYmVzdCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxuICBmaW5kUG9zaWJpbGl0aWVzKCkge1xuICAgIHZhciBkaXJlY3QsIGZhbGxiYWNrLCBqLCBrLCBsZW4sIGxlbjEsIG5hbWUsIG5hbWVzLCBuc3BjLCBuc3BjTmFtZSwgcG9zaWJpbGl0aWVzLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlc3QsIHNwYWNlO1xuICAgIGlmICh0aGlzLnJvb3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICB0aGlzLnJvb3QuaW5pdCgpO1xuICAgIHBvc2liaWxpdGllcyA9IFtdO1xuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyAocmVmMSA9IHJlZi5pbkluc3RhbmNlKSAhPSBudWxsID8gcmVmMS5jbWQgOiB2b2lkIDAgOiB2b2lkIDApID09PSB0aGlzLnJvb3QpIHtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZCgnaW5faW5zdGFuY2UnKSk7XG4gICAgfVxuICAgIHJlZjIgPSB0aGlzLmdldE5hbWVzV2l0aFBhdGhzKCk7XG4gICAgZm9yIChzcGFjZSBpbiByZWYyKSB7XG4gICAgICBuYW1lcyA9IHJlZjJbc3BhY2VdO1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKHNwYWNlLCBuYW1lcykpO1xuICAgIH1cbiAgICByZWYzID0gdGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuc3BjID0gcmVmM1tqXTtcbiAgICAgIFtuc3BjTmFtZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLCB0cnVlKTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChuc3BjTmFtZSwgdGhpcy5hcHBseVNwYWNlT25OYW1lcyhuc3BjKSkpO1xuICAgIH1cbiAgICByZWY0ID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuICAgIGZvciAoayA9IDAsIGxlbjEgPSByZWY0Lmxlbmd0aDsgayA8IGxlbjE7IGsrKykge1xuICAgICAgbmFtZSA9IHJlZjRba107XG4gICAgICBkaXJlY3QgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpO1xuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChkaXJlY3QpKSB7XG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnVzZUZhbGxiYWNrcykge1xuICAgICAgZmFsbGJhY2sgPSB0aGlzLnJvb3QuZ2V0Q21kKCdmYWxsYmFjaycpO1xuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChmYWxsYmFjaykpIHtcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZmFsbGJhY2spO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcztcbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzO1xuICB9XG5cbiAgZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoY21kTmFtZSwgbmFtZXMgPSB0aGlzLm5hbWVzKSB7XG4gICAgdmFyIGosIGxlbiwgbmV4dCwgbmV4dHMsIHBvc2liaWxpdGllcztcbiAgICBwb3NpYmlsaXRpZXMgPSBbXTtcbiAgICBuZXh0cyA9IHRoaXMuZ2V0Q21kRm9sbG93QWxpYXMoY21kTmFtZSk7XG4gICAgZm9yIChqID0gMCwgbGVuID0gbmV4dHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5leHQgPSBuZXh0c1tqXTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIHJvb3Q6IG5leHRcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgfVxuICAgIHJldHVybiBwb3NpYmlsaXRpZXM7XG4gIH1cblxuICBnZXRDbWRGb2xsb3dBbGlhcyhuYW1lKSB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbY21kLCBjbWQuZ2V0QWxpYXNlZCgpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbY21kXTtcbiAgICB9XG4gICAgcmV0dXJuIFtjbWRdO1xuICB9XG5cbiAgY21kSXNWYWxpZChjbWQpIHtcbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGNtZC5uYW1lICE9PSAnZmFsbGJhY2snICYmIGluZGV4T2YuY2FsbCh0aGlzLmFuY2VzdG9ycygpLCBjbWQpID49IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLm11c3RFeGVjdXRlIHx8IHRoaXMuY21kSXNFeGVjdXRhYmxlKGNtZCk7XG4gIH1cblxuICBhbmNlc3RvcnMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gcmVmLmluSW5zdGFuY2UgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjbWRJc0V4ZWN1dGFibGUoY21kKSB7XG4gICAgdmFyIG5hbWVzO1xuICAgIG5hbWVzID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgfVxuICB9XG5cbiAgY21kU2NvcmUoY21kKSB7XG4gICAgdmFyIHNjb3JlO1xuICAgIHNjb3JlID0gY21kLmRlcHRoO1xuICAgIGlmIChjbWQubmFtZSA9PT0gJ2ZhbGxiYWNrJykge1xuICAgICAgc2NvcmUgLT0gMTAwMDtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3JlO1xuICB9XG5cbiAgYmVzdEluUG9zaWJpbGl0aWVzKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlO1xuICAgIGlmIChwb3NzLmxlbmd0aCA+IDApIHtcbiAgICAgIGJlc3QgPSBudWxsO1xuICAgICAgYmVzdFNjb3JlID0gbnVsbDtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHBvc3MubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHBvc3Nbal07XG4gICAgICAgIHNjb3JlID0gdGhpcy5jbWRTY29yZShwKTtcbiAgICAgICAgaWYgKChiZXN0ID09IG51bGwpIHx8IHNjb3JlID49IGJlc3RTY29yZSkge1xuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlO1xuICAgICAgICAgIGJlc3QgPSBwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBvcHRpb25hbFByb21pc2UgfSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IGNsYXNzIENtZEluc3RhbmNlXG4gIGNvbnN0cnVjdG9yOiAoQGNtZCxAY29udGV4dCkgLT5cbiAgXG4gIGluaXQ6IC0+XG4gICAgdW5sZXNzIEBpc0VtcHR5KCkgb3IgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIEBfZ2V0Q21kT2JqKClcbiAgICAgIEBfaW5pdFBhcmFtcygpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBAY21kT2JqLmluaXQoKVxuICAgIHJldHVybiB0aGlzXG4gIHNldFBhcmFtOihuYW1lLHZhbCktPlxuICAgIEBuYW1lZFtuYW1lXSA9IHZhbFxuICBwdXNoUGFyYW06KHZhbCktPlxuICAgIEBwYXJhbXMucHVzaCh2YWwpXG4gIGdldENvbnRleHQ6IC0+XG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgcmV0dXJuIEBjb250ZXh0IG9yIG5ldyBDb250ZXh0KClcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBnZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsbmFtZXNwYWNlczpAX2dldFBhcmVudE5hbWVzcGFjZXMoKSlcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzXG4gICAgcmV0dXJuIGZpbmRlclxuICBfZ2V0Q21kT2JqOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBAY21kLmluaXQoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWQoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuY2xzP1xuICAgICAgICBAY21kT2JqID0gbmV3IGNtZC5jbHModGhpcylcbiAgICAgICAgcmV0dXJuIEBjbWRPYmpcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQG5hbWVkID0gQGdldERlZmF1bHRzKClcbiAgX2dldFBhcmVudE5hbWVzcGFjZXM6IC0+XG4gICAgcmV0dXJuIFtdXG4gIGlzRW1wdHk6IC0+XG4gICAgcmV0dXJuIEBjbWQ/XG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWRGaW5hbCgpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICByZXR1cm4gQGNtZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldERlZmF1bHRzOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICByZXMgPSB7fVxuICAgICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBjbWQuZGVmYXVsdHMpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxAY21kT2JqLmdldERlZmF1bHRzKCkpXG4gICAgICByZXR1cm4gcmVzXG4gICAgZWxzZVxuICAgICAge31cbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIHJldHVybiBAYWxpYXNlZENtZCBvciBudWxsXG4gIGdldEFsaWFzZWRGaW5hbDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGFsaWFzZWRGaW5hbENtZD9cbiAgICAgICAgcmV0dXJuIEBhbGlhc2VkRmluYWxDbWQgb3IgbnVsbFxuICAgICAgaWYgQGNtZC5hbGlhc09mP1xuICAgICAgICBhbGlhc2VkID0gQGNtZFxuICAgICAgICB3aGlsZSBhbGlhc2VkPyBhbmQgYWxpYXNlZC5hbGlhc09mP1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcihAZ2V0RmluZGVyKEBhbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG4gICAgICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICAgICAgQGFsaWFzZWRDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIEBhbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIHJldHVybiBhbGlhc2VkXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBhbGlhc09mXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPcHRpb25zP1xuICAgICAgICByZXR1cm4gQGNtZE9wdGlvbnNcbiAgICAgIG9wdCA9IEBjbWQuX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxAY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIEBjbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIG9wdGlvbnM/IGFuZCBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBnZXRQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIG5hbWVzID0gW25hbWVzXSBpZiAodHlwZW9mIG5hbWVzIGluIFsnc3RyaW5nJywnbnVtYmVyJ10pXG4gICAgZm9yIG4gaW4gbmFtZXNcbiAgICAgIHJldHVybiBAbmFtZWRbbl0gaWYgQG5hbWVkW25dP1xuICAgICAgcmV0dXJuIEBwYXJhbXNbbl0gaWYgQHBhcmFtc1tuXT9cbiAgICByZXR1cm4gZGVmVmFsXG4gIGdldEJvb2xQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIGZhbHNlVmFscyA9IFtcIlwiLFwiMFwiLFwiZmFsc2VcIixcIm5vXCIsXCJub25lXCIsZmFsc2UsbnVsbCwwXVxuICAgIHZhbCA9IEBnZXRQYXJhbShuYW1lcywgZGVmVmFsKVxuICAgICFmYWxzZVZhbHMuaW5jbHVkZXModmFsKVxuICBhbmNlc3RvckNtZHM6IC0+XG4gICAgaWYgQGNvbnRleHQuY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvbnRleHQuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICByZXR1cm4gW11cbiAgYW5jZXN0b3JDbWRzQW5kU2VsZjogLT5cbiAgICByZXR1cm4gQGFuY2VzdG9yQ21kcygpLmNvbmNhdChbQGNtZF0pXG4gIHJ1bkV4ZWN1dGVGdW5jdDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmV0dXJuIEBjbWRPYmouZXhlY3V0ZSgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZEZpbmFsKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmV4ZWN1dGVGdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlRnVuY3QodGhpcylcbiAgcmF3UmVzdWx0OiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5yZXN1bHQoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWRGaW5hbCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5yZXN1bHRGdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRGdW5jdCh0aGlzKVxuICAgICAgaWYgY21kLnJlc3VsdFN0cj9cbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRTdHJcbiAgcmVzdWx0OiAtPiBcbiAgICBAaW5pdCgpXG4gICAgaWYgQHJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIG9wdGlvbmFsUHJvbWlzZShAcmF3UmVzdWx0KCkpLnRoZW4gKHJlcyk9PlxuICAgICAgICBpZiByZXM/XG4gICAgICAgICAgcmVzID0gQGZvcm1hdEluZGVudChyZXMpXG4gICAgICAgICAgaWYgcmVzLmxlbmd0aCA+IDAgYW5kIEBnZXRPcHRpb24oJ3BhcnNlJyx0aGlzKSBcbiAgICAgICAgICAgIHBhcnNlciA9IEBnZXRQYXJzZXJGb3JUZXh0KHJlcylcbiAgICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICAgICAgaWYgYWx0ZXJGdW5jdCA9IEBnZXRPcHRpb24oJ2FsdGVyUmVzdWx0Jyx0aGlzKVxuICAgICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsdGhpcylcbiAgICAgICAgICByZXR1cm4gcmVzXG4gICAgICAucmVzdWx0KClcbiAgZ2V0UGFyc2VyRm9yVGV4dDogKHR4dD0nJykgLT5cbiAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIodHh0KSwge2luSW5zdGFuY2U6dGhpc30pXG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2VcbiAgICByZXR1cm4gcGFyc2VyXG4gIGdldEluZGVudDogLT5cbiAgICByZXR1cm4gMFxuICBmb3JtYXRJbmRlbnQ6ICh0ZXh0KSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywnICAnKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gIGFwcGx5SW5kZW50OiAodGV4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmluZGVudE5vdEZpcnN0KHRleHQsQGdldEluZGVudCgpLFwiIFwiKSIsImltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgQ29kZXdhdmVcbn0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5cbmltcG9ydCB7XG4gIFRleHRQYXJzZXJcbn0gZnJvbSAnLi9UZXh0UGFyc2VyJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBvcHRpb25hbFByb21pc2Vcbn0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCB2YXIgQ21kSW5zdGFuY2UgPSBjbGFzcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yKGNtZDEsIGNvbnRleHQpIHtcbiAgICB0aGlzLmNtZCA9IGNtZDE7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCEodGhpcy5pc0VtcHR5KCkgfHwgdGhpcy5pbml0ZWQpKSB7XG4gICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICB0aGlzLl9nZXRDbWRPYmooKTtcbiAgICAgIHRoaXMuX2luaXRQYXJhbXMoKTtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqLmluaXQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRQYXJhbShuYW1lLCB2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lZFtuYW1lXSA9IHZhbDtcbiAgfVxuXG4gIHB1c2hQYXJhbSh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMucHVzaCh2YWwpO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRleHQgfHwgbmV3IENvbnRleHQoKTtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmdldENvbnRleHQoKS5nZXRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogdGhpcy5fZ2V0UGFyZW50TmFtZXNwYWNlcygpXG4gICAgfSk7XG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gZmluZGVyO1xuICB9XG5cbiAgX2dldENtZE9iaigpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNtZC5pbml0KCk7XG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWQoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmNscyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqID0gbmV3IGNtZC5jbHModGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iajtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaW5pdFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lZCA9IHRoaXMuZ2V0RGVmYXVsdHMoKTtcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY21kICE9IG51bGw7XG4gIH1cblxuICByZXN1bHRJc0F2YWlsYWJsZSgpIHtcbiAgICB2YXIgYWxpYXNlZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNtZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXREZWZhdWx0cygpIHtcbiAgICB2YXIgYWxpYXNlZCwgcmVzO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5jbWQuZGVmYXVsdHMpO1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kT2JqLmdldERlZmF1bHRzKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmdldEFsaWFzZWRGaW5hbCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZENtZCB8fCBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWRGaW5hbCgpIHtcbiAgICB2YXIgYWxpYXNlZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZEZpbmFsQ21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZEZpbmFsQ21kIHx8IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLmNtZDtcbiAgICAgICAgd2hpbGUgKChhbGlhc2VkICE9IG51bGwpICYmIChhbGlhc2VkLmFsaWFzT2YgIT0gbnVsbCkpIHtcbiAgICAgICAgICBhbGlhc2VkID0gYWxpYXNlZC5fYWxpYXNlZEZyb21GaW5kZXIodGhpcy5nZXRGaW5kZXIodGhpcy5hbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpO1xuICAgICAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hbGlhc2VkQ21kID0gYWxpYXNlZCB8fCBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIHx8IGZhbHNlO1xuICAgICAgICByZXR1cm4gYWxpYXNlZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhbHRlckFsaWFzT2YoYWxpYXNPZikge1xuICAgIHJldHVybiBhbGlhc09mO1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICB2YXIgb3B0O1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPcHRpb25zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT3B0aW9ucztcbiAgICAgIH1cbiAgICAgIG9wdCA9IHRoaXMuY21kLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSk7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5jbWRPYmouZ2V0T3B0aW9ucygpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY21kT3B0aW9ucyA9IG9wdDtcbiAgICAgIHJldHVybiBvcHQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0aW9uKGtleSkge1xuICAgIHZhciBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICBpZiAoKG9wdGlvbnMgIT0gbnVsbCkgJiYga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV07XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyYW0obmFtZXMsIGRlZlZhbCA9IG51bGwpIHtcbiAgICB2YXIgaSwgbGVuLCBuLCByZWY7XG4gICAgaWYgKCgocmVmID0gdHlwZW9mIG5hbWVzKSA9PT0gJ3N0cmluZycgfHwgcmVmID09PSAnbnVtYmVyJykpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXTtcbiAgICB9XG4gICAgZm9yIChpID0gMCwgbGVuID0gbmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG4gPSBuYW1lc1tpXTtcbiAgICAgIGlmICh0aGlzLm5hbWVkW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbl07XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wYXJhbXNbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXNbbl07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWZWYWw7XG4gIH1cblxuICBnZXRCb29sUGFyYW0obmFtZXMsIGRlZlZhbCA9IG51bGwpIHtcbiAgICB2YXIgZmFsc2VWYWxzLCB2YWw7XG4gICAgZmFsc2VWYWxzID0gW1wiXCIsIFwiMFwiLCBcImZhbHNlXCIsIFwibm9cIiwgXCJub25lXCIsIGZhbHNlLCBudWxsLCAwXTtcbiAgICB2YWwgPSB0aGlzLmdldFBhcmFtKG5hbWVzLCBkZWZWYWwpO1xuICAgIHJldHVybiAhZmFsc2VWYWxzLmluY2x1ZGVzKHZhbCk7XG4gIH1cblxuICBhbmNlc3RvckNtZHMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUpICE9IG51bGwgPyByZWYuaW5JbnN0YW5jZSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgYW5jZXN0b3JDbWRzQW5kU2VsZigpIHtcbiAgICByZXR1cm4gdGhpcy5hbmNlc3RvckNtZHMoKS5jb25jYXQoW3RoaXMuY21kXSk7XG4gIH1cblxuICBydW5FeGVjdXRlRnVuY3QoKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLmV4ZWN1dGUoKTtcbiAgICAgIH1cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5leGVjdXRlRnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByYXdSZXN1bHQoKSB7XG4gICAgdmFyIGNtZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdCgpO1xuICAgICAgfVxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLnJlc3VsdEZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjbWQucmVzdWx0U3RyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRTdHI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25hbFByb21pc2UodGhpcy5yYXdSZXN1bHQoKSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgIHZhciBhbHRlckZ1bmN0LCBwYXJzZXI7XG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIHJlcyA9IHRoaXMuZm9ybWF0SW5kZW50KHJlcyk7XG4gICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwICYmIHRoaXMuZ2V0T3B0aW9uKCdwYXJzZScsIHRoaXMpKSB7XG4gICAgICAgICAgICBwYXJzZXIgPSB0aGlzLmdldFBhcnNlckZvclRleHQocmVzKTtcbiAgICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYWx0ZXJGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdhbHRlclJlc3VsdCcsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXMgPSBhbHRlckZ1bmN0KHJlcywgdGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cbiAgICAgIH0pLnJlc3VsdCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldFBhcnNlckZvclRleHQodHh0ID0gJycpIHtcbiAgICB2YXIgcGFyc2VyO1xuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7XG4gICAgICBpbkluc3RhbmNlOiB0aGlzXG4gICAgfSk7XG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG4gICAgcmV0dXJuIHBhcnNlcjtcbiAgfVxuXG4gIGdldEluZGVudCgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZvcm1hdEluZGVudCh0ZXh0KSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx0L2csICcgICcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhcHBseUluZGVudCh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5pbmRlbnROb3RGaXJzdCh0ZXh0LCB0aGlzLmdldEluZGVudCgpLCBcIiBcIik7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFByb2Nlc3MgfSBmcm9tICcuL1Byb2Nlc3MnO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgfSBmcm9tICcuL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9Mb2dnZXInO1xuaW1wb3J0IHsgUG9zQ29sbGVjdGlvbiB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IENsb3NpbmdQcm9tcCB9IGZyb20gJy4vQ2xvc2luZ1Byb21wJztcblxuZXhwb3J0IGNsYXNzIENvZGV3YXZlXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIENvZGV3YXZlLmluaXQoKVxuICAgIEBtYXJrZXIgPSAnW1tbW2NvZGV3YXZlX21hcnF1ZXJdXV1dJ1xuICAgIEB2YXJzID0ge31cbiAgICBcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICdicmFrZXRzJyA6ICd+ficsXG4gICAgICAnZGVjbycgOiAnficsXG4gICAgICAnY2xvc2VDaGFyJyA6ICcvJyxcbiAgICAgICdub0V4ZWN1dGVDaGFyJyA6ICchJyxcbiAgICAgICdjYXJyZXRDaGFyJyA6ICd8JyxcbiAgICAgICdjaGVja0NhcnJldCcgOiB0cnVlLFxuICAgICAgJ2luSW5zdGFuY2UnIDogbnVsbFxuICAgIH1cbiAgICBAcGFyZW50ID0gb3B0aW9uc1sncGFyZW50J11cbiAgICBcbiAgICBAbmVzdGVkID0gaWYgQHBhcmVudD8gdGhlbiBAcGFyZW50Lm5lc3RlZCsxIGVsc2UgMFxuICAgIFxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIEBlZGl0b3IuYmluZGVkVG8odGhpcykgaWYgQGVkaXRvcj9cbiAgICBcbiAgICBAY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMpXG4gICAgaWYgQGluSW5zdGFuY2U/XG4gICAgICBAY29udGV4dC5wYXJlbnQgPSBAaW5JbnN0YW5jZS5jb250ZXh0XG5cbiAgICBAbG9nZ2VyID0gbmV3IExvZ2dlcigpXG5cbiAgb25BY3RpdmF0aW9uS2V5OiAtPlxuICAgIEBwcm9jZXNzID0gbmV3IFByb2Nlc3MoKVxuICAgIEBsb2dnZXIubG9nKCdhY3RpdmF0aW9uIGtleScpXG4gICAgQHJ1bkF0Q3Vyc29yUG9zKCkudGhlbiA9PlxuICAgICAgQHByb2Nlc3MgPSBudWxsXG4gIHJ1bkF0Q3Vyc29yUG9zOiAtPlxuICAgIGlmIEBlZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgICBAcnVuQXRNdWx0aVBvcyhAZWRpdG9yLmdldE11bHRpU2VsKCkpXG4gICAgZWxzZVxuICAgICAgQHJ1bkF0UG9zKEBlZGl0b3IuZ2V0Q3Vyc29yUG9zKCkpXG4gIHJ1bkF0UG9zOiAocG9zKS0+XG4gICAgdW5sZXNzIHBvcz9cbiAgICAgIHRocm93IG5ldyBFcnJvcignQ3Vyc29yIFBvc2l0aW9uIGlzIGVtcHR5JylcbiAgICBAcnVuQXRNdWx0aVBvcyhbcG9zXSlcbiAgcnVuQXRNdWx0aVBvczogKG11bHRpUG9zKS0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMFxuICAgICAgICBjbWQgPSBAY29tbWFuZE9uUG9zKG11bHRpUG9zWzBdLmVuZClcbiAgICAgICAgaWYgY21kP1xuICAgICAgICAgIGlmIG11bHRpUG9zLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcylcbiAgICAgICAgICBjbWQuaW5pdCgpXG4gICAgICAgICAgQGxvZ2dlci5sb2coY21kKVxuICAgICAgICAgIGNtZC5leGVjdXRlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIG11bHRpUG9zWzBdLnN0YXJ0ID09IG11bHRpUG9zWzBdLmVuZFxuICAgICAgICAgICAgQGFkZEJyYWtldHMobXVsdGlQb3MpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHByb21wdENsb3NpbmdDbWQobXVsdGlQb3MpXG4gIGNvbW1hbmRPblBvczogKHBvcykgLT5cbiAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGZvbGxvd2VkQnlCcmFrZXRzKHBvcykgYW5kIEBjb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT0gMSBcbiAgICAgIHByZXYgPSBwb3MtQGJyYWtldHMubGVuZ3RoXG4gICAgICBuZXh0ID0gcG9zXG4gICAgZWxzZVxuICAgICAgaWYgQHByZWNlZGVkQnlCcmFrZXRzKHBvcykgYW5kIEBjb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT0gMFxuICAgICAgICBwb3MgLT0gQGJyYWtldHMubGVuZ3RoXG4gICAgICBwcmV2ID0gQGZpbmRQcmV2QnJha2V0KHBvcylcbiAgICAgIHVubGVzcyBwcmV2P1xuICAgICAgICByZXR1cm4gbnVsbCBcbiAgICAgIG5leHQgPSBAZmluZE5leHRCcmFrZXQocG9zLTEpXG4gICAgICBpZiAhbmV4dD8gb3IgQGNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT0gMCBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLHByZXYsQGVkaXRvci50ZXh0U3Vic3RyKHByZXYsbmV4dCtAYnJha2V0cy5sZW5ndGgpKVxuICBuZXh0Q21kOiAoc3RhcnQgPSAwKSAtPlxuICAgIHBvcyA9IHN0YXJ0XG4gICAgd2hpbGUgZiA9IEBmaW5kQW55TmV4dChwb3MgLFtAYnJha2V0cyxcIlxcblwiXSlcbiAgICAgIHBvcyA9IGYucG9zICsgZi5zdHIubGVuZ3RoXG4gICAgICBpZiBmLnN0ciA9PSBAYnJha2V0c1xuICAgICAgICBpZiBiZWdpbm5pbmc/XG4gICAgICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgYmVnaW5uaW5nLCBAZWRpdG9yLnRleHRTdWJzdHIoYmVnaW5uaW5nLCBmLnBvcytAYnJha2V0cy5sZW5ndGgpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYmVnaW5uaW5nID0gZi5wb3NcbiAgICAgIGVsc2VcbiAgICAgICAgYmVnaW5uaW5nID0gbnVsbFxuICAgIG51bGxcbiAgZ2V0RW5jbG9zaW5nQ21kOiAocG9zID0gMCkgLT5cbiAgICBjcG9zID0gcG9zXG4gICAgY2xvc2luZ1ByZWZpeCA9IEBicmFrZXRzICsgQGNsb3NlQ2hhclxuICAgIHdoaWxlIChwID0gQGZpbmROZXh0KGNwb3MsY2xvc2luZ1ByZWZpeCkpP1xuICAgICAgaWYgY21kID0gQGNvbW1hbmRPblBvcyhwK2Nsb3NpbmdQcmVmaXgubGVuZ3RoKVxuICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpXG4gICAgICAgIGlmIGNtZC5wb3MgPCBwb3NcbiAgICAgICAgICByZXR1cm4gY21kXG4gICAgICBlbHNlXG4gICAgICAgIGNwb3MgPSBwK2Nsb3NpbmdQcmVmaXgubGVuZ3RoXG4gICAgbnVsbFxuICBwcmVjZWRlZEJ5QnJha2V0czogKHBvcykgLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcy1AYnJha2V0cy5sZW5ndGgscG9zKSA9PSBAYnJha2V0c1xuICBmb2xsb3dlZEJ5QnJha2V0czogKHBvcykgLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrQGJyYWtldHMubGVuZ3RoKSA9PSBAYnJha2V0c1xuICBjb3VudFByZXZCcmFrZXQ6IChzdGFydCkgLT4gXG4gICAgaSA9IDBcbiAgICB3aGlsZSAoc3RhcnQgPSBAZmluZFByZXZCcmFrZXQoc3RhcnQpKT9cbiAgICAgIGkrK1xuICAgIHJldHVybiBpXG4gIGlzRW5kTGluZTogKHBvcykgLT4gXG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dFN1YnN0cihwb3MscG9zKzEpID09IFwiXFxuXCIgb3IgcG9zICsgMSA+PSBAZWRpdG9yLnRleHRMZW4oKVxuICBmaW5kUHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICByZXR1cm4gQGZpbmROZXh0QnJha2V0KHN0YXJ0LC0xKVxuICBmaW5kTmV4dEJyYWtldDogKHN0YXJ0LGRpcmVjdGlvbiA9IDEpIC0+IFxuICAgIGYgPSBAZmluZEFueU5leHQoc3RhcnQgLFtAYnJha2V0cyxcIlxcblwiXSwgZGlyZWN0aW9uKVxuICAgIFxuICAgIGYucG9zIGlmIGYgYW5kIGYuc3RyID09IEBicmFrZXRzXG4gIGZpbmRQcmV2OiAoc3RhcnQsc3RyaW5nKSAtPiBcbiAgICByZXR1cm4gQGZpbmROZXh0KHN0YXJ0LHN0cmluZywtMSlcbiAgZmluZE5leHQ6IChzdGFydCxzdHJpbmcsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW3N0cmluZ10sIGRpcmVjdGlvbilcbiAgICBmLnBvcyBpZiBmXG4gIFxuICBmaW5kQW55TmV4dDogKHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgcmV0dXJuIEBlZGl0b3IuZmluZEFueU5leHQoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24pXG4gICAgXG4gIGZpbmRNYXRjaGluZ1BhaXI6IChzdGFydFBvcyxvcGVuaW5nLGNsb3NpbmcsZGlyZWN0aW9uID0gMSkgLT5cbiAgICBwb3MgPSBzdGFydFBvc1xuICAgIG5lc3RlZCA9IDBcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyxbY2xvc2luZyxvcGVuaW5nXSxkaXJlY3Rpb24pXG4gICAgICBwb3MgPSBmLnBvcyArIChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gZi5zdHIubGVuZ3RoIGVsc2UgMClcbiAgICAgIGlmIGYuc3RyID09IChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gY2xvc2luZyBlbHNlIG9wZW5pbmcpXG4gICAgICAgIGlmIG5lc3RlZCA+IDBcbiAgICAgICAgICBuZXN0ZWQtLVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGZcbiAgICAgIGVsc2VcbiAgICAgICAgbmVzdGVkKytcbiAgICBudWxsXG4gIGFkZEJyYWtldHM6IChwb3MpIC0+XG4gICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKVxuICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKEBicmFrZXRzLEBicmFrZXRzKS5tYXAoIChyKS0+ci5zZWxlY3RDb250ZW50KCkgKVxuICAgIEBlZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICBwcm9tcHRDbG9zaW5nQ21kOiAoc2VsZWN0aW9ucykgLT5cbiAgICBAY2xvc2luZ1Byb21wLnN0b3AoKSBpZiBAY2xvc2luZ1Byb21wP1xuICAgIEBjbG9zaW5nUHJvbXAgPSBDbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsc2VsZWN0aW9ucykuYmVnaW4oKVxuICBwYXJzZUFsbDogKHJlY3Vyc2l2ZSA9IHRydWUpIC0+XG4gICAgaWYgQG5lc3RlZCA+IDEwMFxuICAgICAgdGhyb3cgXCJJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvblwiXG4gICAgcG9zID0gMFxuICAgIHdoaWxlIGNtZCA9IEBuZXh0Q21kKHBvcylcbiAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKVxuICAgICAgQGVkaXRvci5zZXRDdXJzb3JQb3MocG9zKVxuICAgICAgIyBjb25zb2xlLmxvZyhjbWQpXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiByZWN1cnNpdmUgYW5kIGNtZC5jb250ZW50PyBhbmQgKCFjbWQuZ2V0Q21kKCk/IG9yICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSlcbiAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge3BhcmVudDogdGhpc30pXG4gICAgICAgIGNtZC5jb250ZW50ID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIHJlcyA9ICBjbWQuZXhlY3V0ZSgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGlmIHJlcy50aGVuP1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN5bmMgbmVzdGVkIGNvbW1hbmRzIGFyZSBub3Qgc3VwcG9ydGVkJylcbiAgICAgICAgaWYgY21kLnJlcGxhY2VFbmQ/XG4gICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBvcyA9IEBlZGl0b3IuZ2V0Q3Vyc29yUG9zKCkuZW5kXG4gICAgcmV0dXJuIEBnZXRUZXh0KClcbiAgZ2V0VGV4dDogLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0KClcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD8gYW5kICghQGluSW5zdGFuY2U/IG9yICFAaW5JbnN0YW5jZS5maW5kZXI/KVxuICBnZXRSb290OiAtPlxuICAgIGlmIEBpc1Jvb3QoKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICBlbHNlIGlmIEBwYXJlbnQ/XG4gICAgICByZXR1cm4gQHBhcmVudC5nZXRSb290KClcbiAgICBlbHNlIGlmIEBpbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBpbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICBnZXRGaWxlU3lzdGVtOiAtPlxuICAgIGlmIEBlZGl0b3IuZmlsZVN5c3RlbVxuICAgICAgcmV0dXJuIEBlZGl0b3IuZmlsZVN5c3RlbVxuICAgIGVsc2UgaWYgQGlzUm9vdCgpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIGVsc2UgaWYgQHBhcmVudD9cbiAgICAgIHJldHVybiBAcGFyZW50LmdldFJvb3QoKVxuICAgIGVsc2UgaWYgQGluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpXG4gIHJlbW92ZUNhcnJldDogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsQGNhcnJldENoYXIpXG4gIGdldENhcnJldFBvczogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldENhcnJldFBvcyh0eHQsQGNhcnJldENoYXIpXG4gIHJlZ01hcmtlcjogKGZsYWdzPVwiZ1wiKSAtPlxuICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQG1hcmtlciksIGZsYWdzKVxuICByZW1vdmVNYXJrZXJzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKEByZWdNYXJrZXIoKSwnJylcblxuICBAaW5pdDogLT5cbiAgICB1bmxlc3MgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIENvbW1hbmQuaW5pdENtZHMoKVxuICAgICAgQ29tbWFuZC5sb2FkQ21kcygpXG5cbiAgQGluaXRlZDogZmFsc2UiLCJpbXBvcnQge1xuICBQcm9jZXNzXG59IGZyb20gJy4vUHJvY2Vzcyc7XG5cbmltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgUG9zaXRpb25lZENtZEluc3RhbmNlXG59IGZyb20gJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJztcblxuaW1wb3J0IHtcbiAgVGV4dFBhcnNlclxufSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIExvZ2dlclxufSBmcm9tICcuL0xvZ2dlcic7XG5cbmltcG9ydCB7XG4gIFBvc0NvbGxlY3Rpb25cbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDbG9zaW5nUHJvbXBcbn0gZnJvbSAnLi9DbG9zaW5nUHJvbXAnO1xuXG5leHBvcnQgdmFyIENvZGV3YXZlID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBDb2Rld2F2ZSB7XG4gICAgY29uc3RydWN0b3IoZWRpdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICAgIENvZGV3YXZlLmluaXQoKTtcbiAgICAgIHRoaXMubWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSc7XG4gICAgICB0aGlzLnZhcnMgPSB7fTtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAnYnJha2V0cyc6ICd+ficsXG4gICAgICAgICdkZWNvJzogJ34nLFxuICAgICAgICAnY2xvc2VDaGFyJzogJy8nLFxuICAgICAgICAnbm9FeGVjdXRlQ2hhcic6ICchJyxcbiAgICAgICAgJ2NhcnJldENoYXInOiAnfCcsXG4gICAgICAgICdjaGVja0NhcnJldCc6IHRydWUsXG4gICAgICAgICdpbkluc3RhbmNlJzogbnVsbFxuICAgICAgfTtcbiAgICAgIHRoaXMucGFyZW50ID0gb3B0aW9uc1sncGFyZW50J107XG4gICAgICB0aGlzLm5lc3RlZCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC5uZXN0ZWQgKyAxIDogMDtcbiAgICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgfSBlbHNlIGlmICgodGhpcy5wYXJlbnQgIT0gbnVsbCkgJiYga2V5ICE9PSAncGFyZW50Jykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lZGl0b3IgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmVkaXRvci5iaW5kZWRUbyh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMpO1xuICAgICAgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5wYXJlbnQgPSB0aGlzLmluSW5zdGFuY2UuY29udGV4dDtcbiAgICAgIH1cbiAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgIH1cblxuICAgIG9uQWN0aXZhdGlvbktleSgpIHtcbiAgICAgIHRoaXMucHJvY2VzcyA9IG5ldyBQcm9jZXNzKCk7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ2FjdGl2YXRpb24ga2V5Jyk7XG4gICAgICByZXR1cm4gdGhpcy5ydW5BdEN1cnNvclBvcygpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJ1bkF0Q3Vyc29yUG9zKCkge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKHRoaXMuZWRpdG9yLmdldE11bHRpU2VsKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuQXRQb3ModGhpcy5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJ1bkF0UG9zKHBvcykge1xuICAgICAgaWYgKHBvcyA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ3Vyc29yIFBvc2l0aW9uIGlzIGVtcHR5Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKFtwb3NdKTtcbiAgICB9XG5cbiAgICBydW5BdE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBjbWQ7XG4gICAgICAgIGlmIChtdWx0aVBvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY21kID0gdGhpcy5jb21tYW5kT25Qb3MobXVsdGlQb3NbMF0uZW5kKTtcbiAgICAgICAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbWQuaW5pdCgpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGNtZCk7XG4gICAgICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zWzBdLnN0YXJ0ID09PSBtdWx0aVBvc1swXS5lbmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQnJha2V0cyhtdWx0aVBvcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9tcHRDbG9zaW5nQ21kKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbW1hbmRPblBvcyhwb3MpIHtcbiAgICAgIHZhciBuZXh0LCBwcmV2O1xuICAgICAgaWYgKHRoaXMucHJlY2VkZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmZvbGxvd2VkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDEpIHtcbiAgICAgICAgcHJldiA9IHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGg7XG4gICAgICAgIG5leHQgPSBwb3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09PSAwKSB7XG4gICAgICAgICAgcG9zIC09IHRoaXMuYnJha2V0cy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IHRoaXMuZmluZFByZXZCcmFrZXQocG9zKTtcbiAgICAgICAgaWYgKHByZXYgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIG5leHQgPSB0aGlzLmZpbmROZXh0QnJha2V0KHBvcyAtIDEpO1xuICAgICAgICBpZiAoKG5leHQgPT0gbnVsbCkgfHwgdGhpcy5jb3VudFByZXZCcmFrZXQocHJldikgJSAyICE9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIHByZXYsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocHJldiwgbmV4dCArIHRoaXMuYnJha2V0cy5sZW5ndGgpKTtcbiAgICB9XG5cbiAgICBuZXh0Q21kKHN0YXJ0ID0gMCkge1xuICAgICAgdmFyIGJlZ2lubmluZywgZiwgcG9zO1xuICAgICAgcG9zID0gc3RhcnQ7XG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSkpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGg7XG4gICAgICAgIGlmIChmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBiZWdpbm5pbmcgIT09IFwidW5kZWZpbmVkXCIgJiYgYmVnaW5uaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIoYmVnaW5uaW5nLCBmLnBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmVnaW5uaW5nID0gZi5wb3M7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJlZ2lubmluZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldEVuY2xvc2luZ0NtZChwb3MgPSAwKSB7XG4gICAgICB2YXIgY2xvc2luZ1ByZWZpeCwgY21kLCBjcG9zLCBwO1xuICAgICAgY3BvcyA9IHBvcztcbiAgICAgIGNsb3NpbmdQcmVmaXggPSB0aGlzLmJyYWtldHMgKyB0aGlzLmNsb3NlQ2hhcjtcbiAgICAgIHdoaWxlICgocCA9IHRoaXMuZmluZE5leHQoY3BvcywgY2xvc2luZ1ByZWZpeCkpICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGNtZCA9IHRoaXMuY29tbWFuZE9uUG9zKHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aCkpIHtcbiAgICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpO1xuICAgICAgICAgIGlmIChjbWQucG9zIDwgcG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gY21kO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcG9zID0gcCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGgsIHBvcykgPT09IHRoaXMuYnJha2V0cztcbiAgICB9XG5cbiAgICBmb2xsb3dlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcywgcG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkgPT09IHRoaXMuYnJha2V0cztcbiAgICB9XG5cbiAgICBjb3VudFByZXZCcmFrZXQoc3RhcnQpIHtcbiAgICAgIHZhciBpO1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoKHN0YXJ0ID0gdGhpcy5maW5kUHJldkJyYWtldChzdGFydCkpICE9IG51bGwpIHtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuXG4gICAgaXNFbmRMaW5lKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyAxKSA9PT0gXCJcXG5cIiB8fCBwb3MgKyAxID49IHRoaXMuZWRpdG9yLnRleHRMZW4oKTtcbiAgICB9XG5cbiAgICBmaW5kUHJldkJyYWtldChzdGFydCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHRCcmFrZXQoc3RhcnQsIC0xKTtcbiAgICB9XG5cbiAgICBmaW5kTmV4dEJyYWtldChzdGFydCwgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGY7XG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3RoaXMuYnJha2V0cywgXCJcXG5cIl0sIGRpcmVjdGlvbik7XG4gICAgICBpZiAoZiAmJiBmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgIHJldHVybiBmLnBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldihzdGFydCwgc3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dChzdGFydCwgc3RyaW5nLCAtMSk7XG4gICAgfVxuXG4gICAgZmluZE5leHQoc3RhcnQsIHN0cmluZywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGY7XG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3N0cmluZ10sIGRpcmVjdGlvbik7XG4gICAgICBpZiAoZikge1xuICAgICAgICByZXR1cm4gZi5wb3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5maW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBmaW5kTWF0Y2hpbmdQYWlyKHN0YXJ0UG9zLCBvcGVuaW5nLCBjbG9zaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZiwgbmVzdGVkLCBwb3M7XG4gICAgICBwb3MgPSBzdGFydFBvcztcbiAgICAgIG5lc3RlZCA9IDA7XG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbY2xvc2luZywgb3BlbmluZ10sIGRpcmVjdGlvbikpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyAoZGlyZWN0aW9uID4gMCA/IGYuc3RyLmxlbmd0aCA6IDApO1xuICAgICAgICBpZiAoZi5zdHIgPT09IChkaXJlY3Rpb24gPiAwID8gY2xvc2luZyA6IG9wZW5pbmcpKSB7XG4gICAgICAgICAgaWYgKG5lc3RlZCA+IDApIHtcbiAgICAgICAgICAgIG5lc3RlZC0tO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmVzdGVkKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFkZEJyYWtldHMocG9zKSB7XG4gICAgICB2YXIgcmVwbGFjZW1lbnRzO1xuICAgICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKTtcbiAgICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKHRoaXMuYnJha2V0cywgdGhpcy5icmFrZXRzKS5tYXAoZnVuY3Rpb24ocikge1xuICAgICAgICByZXR1cm4gci5zZWxlY3RDb250ZW50KCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICAgIH1cblxuICAgIHByb21wdENsb3NpbmdDbWQoc2VsZWN0aW9ucykge1xuICAgICAgaWYgKHRoaXMuY2xvc2luZ1Byb21wICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbG9zaW5nUHJvbXAuc3RvcCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wLm5ld0Zvcih0aGlzLCBzZWxlY3Rpb25zKS5iZWdpbigpO1xuICAgIH1cblxuICAgIHBhcnNlQWxsKHJlY3Vyc2l2ZSA9IHRydWUpIHtcbiAgICAgIHZhciBjbWQsIHBhcnNlciwgcG9zLCByZXM7XG4gICAgICBpZiAodGhpcy5uZXN0ZWQgPiAxMDApIHtcbiAgICAgICAgdGhyb3cgXCJJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvblwiO1xuICAgICAgfVxuICAgICAgcG9zID0gMDtcbiAgICAgIHdoaWxlIChjbWQgPSB0aGlzLm5leHRDbWQocG9zKSkge1xuICAgICAgICBwb3MgPSBjbWQuZ2V0RW5kUG9zKCk7XG4gICAgICAgIHRoaXMuZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhjbWQpXG4gICAgICAgIGNtZC5pbml0KCk7XG4gICAgICAgIGlmIChyZWN1cnNpdmUgJiYgKGNtZC5jb250ZW50ICE9IG51bGwpICYmICgoY21kLmdldENtZCgpID09IG51bGwpIHx8ICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSkpIHtcbiAgICAgICAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIoY21kLmNvbnRlbnQpLCB7XG4gICAgICAgICAgICBwYXJlbnQ6IHRoaXNcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IGNtZC5leGVjdXRlKCk7XG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIGlmIChyZXMudGhlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzeW5jIG5lc3RlZCBjb21tYW5kcyBhcmUgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY21kLnJlcGxhY2VFbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldFRleHQoKTtcbiAgICB9XG5cbiAgICBnZXRUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHQoKTtcbiAgICB9XG5cbiAgICBpc1Jvb3QoKSB7XG4gICAgICByZXR1cm4gKHRoaXMucGFyZW50ID09IG51bGwpICYmICgodGhpcy5pbkluc3RhbmNlID09IG51bGwpIHx8ICh0aGlzLmluSW5zdGFuY2UuZmluZGVyID09IG51bGwpKTtcbiAgICB9XG5cbiAgICBnZXRSb290KCkge1xuICAgICAgaWYgKHRoaXMuaXNSb290KCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RmlsZVN5c3RlbSgpIHtcbiAgICAgIGlmICh0aGlzLmVkaXRvci5maWxlU3lzdGVtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVkaXRvci5maWxlU3lzdGVtO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRSb290KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUNhcnJldCh0eHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHR4dCwgdGhpcy5jYXJyZXRDaGFyKTtcbiAgICB9XG5cbiAgICBnZXRDYXJyZXRQb3ModHh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldENhcnJldFBvcyh0eHQsIHRoaXMuY2FycmV0Q2hhcik7XG4gICAgfVxuXG4gICAgcmVnTWFya2VyKGZsYWdzID0gXCJnXCIpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5tYXJrZXIpLCBmbGFncyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWFya2Vycyh0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHRoaXMucmVnTWFya2VyKCksICcnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdCgpIHtcbiAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgICBDb21tYW5kLmluaXRDbWRzKCk7XG4gICAgICAgIHJldHVybiBDb21tYW5kLmxvYWRDbWRzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gIH07XG5cbiAgQ29kZXdhdmUuaW5pdGVkID0gZmFsc2U7XG5cbiAgcmV0dXJuIENvZGV3YXZlO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFN0b3JhZ2UgfSBmcm9tICcuL1N0b3JhZ2UnO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cblxuX29wdEtleSA9IChrZXksZGljdCxkZWZWYWwgPSBudWxsKSAtPlxuICAjIG9wdGlvbmFsIERpY3Rpb25hcnkga2V5XG4gIHJldHVybiBpZiBrZXkgb2YgZGljdCB0aGVuIGRpY3Rba2V5XSBlbHNlIGRlZlZhbFxuXG5cbmV4cG9ydCBjbGFzcyBDb21tYW5kXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsQGRhdGE9bnVsbCxwYXJlbnQ9bnVsbCkgLT5cbiAgICBAY21kcyA9IFtdXG4gICAgQGRldGVjdG9ycyA9IFtdXG4gICAgQGV4ZWN1dGVGdW5jdCA9IEByZXN1bHRGdW5jdCA9IEByZXN1bHRTdHIgPSBAYWxpYXNPZiA9IEBjbHMgPSBudWxsXG4gICAgQGFsaWFzZWQgPSBudWxsXG4gICAgQGZ1bGxOYW1lID0gQG5hbWVcbiAgICBAZGVwdGggPSAwXG4gICAgW0BfcGFyZW50LCBAX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdXG4gICAgQHNldFBhcmVudChwYXJlbnQpXG4gICAgQGRlZmF1bHRzID0ge31cbiAgICBcbiAgICBAZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBuYW1lVG9QYXJhbTogbnVsbCxcbiAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgYmVmb3JlRXhlY3V0ZTogbnVsbCxcbiAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgIHJlcGxhY2VCb3g6IGZhbHNlLFxuICAgICAgYWxsb3dlZE5hbWVkOiBudWxsXG4gICAgfVxuICAgIEBvcHRpb25zID0ge31cbiAgICBAZmluYWxPcHRpb25zID0gbnVsbFxuICBwYXJlbnQ6IC0+XG4gICAgcmV0dXJuIEBfcGFyZW50XG4gIHNldFBhcmVudDogKHZhbHVlKSAtPlxuICAgIGlmIEBfcGFyZW50ICE9IHZhbHVlXG4gICAgICBAX3BhcmVudCA9IHZhbHVlXG4gICAgICBAZnVsbE5hbWUgPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQubmFtZT9cbiAgICAgICAgICBAX3BhcmVudC5mdWxsTmFtZSArICc6JyArIEBuYW1lIFxuICAgICAgICBlbHNlIFxuICAgICAgICAgIEBuYW1lXG4gICAgICApXG4gICAgICBAZGVwdGggPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQuZGVwdGg/XG4gICAgICAgIHRoZW4gQF9wYXJlbnQuZGVwdGggKyAxXG4gICAgICAgIGVsc2UgMFxuICAgICAgKVxuICBpbml0OiAtPlxuICAgIGlmICFAX2luaXRlZFxuICAgICAgQF9pbml0ZWQgPSB0cnVlXG4gICAgICBAcGFyc2VEYXRhKEBkYXRhKVxuICAgIHJldHVybiB0aGlzXG4gIHVucmVnaXN0ZXI6IC0+XG4gICAgQF9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpXG4gIGlzRWRpdGFibGU6IC0+XG4gICAgcmV0dXJuIEByZXN1bHRTdHI/IG9yIEBhbGlhc09mP1xuICBpc0V4ZWN1dGFibGU6IC0+XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgZm9yIHAgaW4gWydyZXN1bHRTdHInLCdyZXN1bHRGdW5jdCcsJ2NscycsJ2V4ZWN1dGVGdW5jdCddXG4gICAgICBpZiB0aGlzW3BdP1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICBpc0V4ZWN1dGFibGVXaXRoTmFtZTogKG5hbWUpIC0+XG4gICAgaWYgQGFsaWFzT2Y/XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgYWxpYXNPZiA9IEBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsbmFtZSlcbiAgICAgIGFsaWFzZWQgPSBAX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKGFsaWFzT2YpKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gQGlzRXhlY3V0YWJsZSgpXG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICBmb3IgcCBpbiBbJ3Jlc3VsdFN0cicsJ3Jlc3VsdEZ1bmN0J11cbiAgICAgIGlmIHRoaXNbcF0/XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldERlZmF1bHRzOiAtPlxuICAgIHJlcyA9IHt9XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBkZWZhdWx0cylcbiAgICByZXR1cm4gcmVzXG4gIF9hbGlhc2VkRnJvbUZpbmRlcjogKGZpbmRlcikgLT5cbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2VcbiAgICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAYWxpYXNPZj9cbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICByZXR1cm4gQF9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihAYWxpYXNPZikpXG4gIHNldE9wdGlvbnM6IChkYXRhKSAtPlxuICAgIGZvciBrZXksIHZhbCBvZiBkYXRhXG4gICAgICBpZiBrZXkgb2YgQGRlZmF1bHRPcHRpb25zXG4gICAgICAgIEBvcHRpb25zW2tleV0gPSB2YWxcbiAgX29wdGlvbnNGb3JBbGlhc2VkOiAoYWxpYXNlZCkgLT5cbiAgICBvcHQgPSB7fVxuICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LEBkZWZhdWx0T3B0aW9ucylcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsYWxpYXNlZC5nZXRPcHRpb25zKCkpXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0LEBvcHRpb25zKVxuICBnZXRPcHRpb25zOiAtPlxuICAgIHJldHVybiBAX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gIGhlbHA6IC0+XG4gICAgY21kID0gQGdldENtZCgnaGVscCcpXG4gICAgaWYgY21kP1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkucmVzdWx0U3RyXG4gIHBhcnNlRGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBkYXRhXG4gICAgaWYgdHlwZW9mIGRhdGEgPT0gJ3N0cmluZydcbiAgICAgIEByZXN1bHRTdHIgPSBkYXRhXG4gICAgICBAb3B0aW9uc1sncGFyc2UnXSA9IHRydWVcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZSBpZiBkYXRhP1xuICAgICAgcmV0dXJuIEBwYXJzZURpY3REYXRhKGRhdGEpXG4gICAgcmV0dXJuIGZhbHNlXG4gIHBhcnNlRGljdERhdGE6IChkYXRhKSAtPlxuICAgIHJlcyA9IF9vcHRLZXkoJ3Jlc3VsdCcsZGF0YSlcbiAgICBpZiB0eXBlb2YgcmVzID09IFwiZnVuY3Rpb25cIlxuICAgICAgQHJlc3VsdEZ1bmN0ID0gcmVzXG4gICAgZWxzZSBpZiByZXM/XG4gICAgICBAcmVzdWx0U3RyID0gcmVzXG4gICAgICBAb3B0aW9uc1sncGFyc2UnXSA9IHRydWVcbiAgICBleGVjdXRlID0gX29wdEtleSgnZXhlY3V0ZScsZGF0YSlcbiAgICBpZiB0eXBlb2YgZXhlY3V0ZSA9PSBcImZ1bmN0aW9uXCJcbiAgICAgIEBleGVjdXRlRnVuY3QgPSBleGVjdXRlXG4gICAgQGFsaWFzT2YgPSBfb3B0S2V5KCdhbGlhc09mJyxkYXRhKVxuICAgIEBjbHMgPSBfb3B0S2V5KCdjbHMnLGRhdGEpXG4gICAgQGRlZmF1bHRzID0gX29wdEtleSgnZGVmYXVsdHMnLGRhdGEsQGRlZmF1bHRzKVxuICAgIFxuICAgIEBzZXRPcHRpb25zKGRhdGEpXG4gICAgXG4gICAgaWYgJ2hlbHAnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLGRhdGFbJ2hlbHAnXSx0aGlzKSlcbiAgICBpZiAnZmFsbGJhY2snIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2ZhbGxiYWNrJyxkYXRhWydmYWxsYmFjayddLHRoaXMpKVxuICAgICAgXG4gICAgaWYgJ2NtZHMnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWRzKGRhdGFbJ2NtZHMnXSlcbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDbWRzOiAoY21kcykgLT5cbiAgICBmb3IgbmFtZSwgZGF0YSBvZiBjbWRzXG4gICAgICBAYWRkQ21kKG5ldyBDb21tYW5kKG5hbWUsZGF0YSx0aGlzKSlcbiAgYWRkQ21kOiAoY21kKSAtPlxuICAgIGV4aXN0cyA9IEBnZXRDbWQoY21kLm5hbWUpXG4gICAgaWYgZXhpc3RzP1xuICAgICAgQHJlbW92ZUNtZChleGlzdHMpXG4gICAgY21kLnNldFBhcmVudCh0aGlzKVxuICAgIEBjbWRzLnB1c2goY21kKVxuICAgIHJldHVybiBjbWRcbiAgcmVtb3ZlQ21kOiAoY21kKSAtPlxuICAgIGlmIChpID0gQGNtZHMuaW5kZXhPZihjbWQpKSA+IC0xXG4gICAgICBAY21kcy5zcGxpY2UoaSwgMSlcbiAgICByZXR1cm4gY21kXG4gIGdldENtZDogKGZ1bGxuYW1lKSAtPlxuICAgIEBpbml0KClcbiAgICBbc3BhY2UsbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSlcbiAgICBpZiBzcGFjZT9cbiAgICAgIHJldHVybiBAZ2V0Q21kKHNwYWNlKT8uZ2V0Q21kKG5hbWUpXG4gICAgZm9yIGNtZCBpbiBAY21kc1xuICAgICAgaWYgY21kLm5hbWUgPT0gbmFtZVxuICAgICAgICByZXR1cm4gY21kXG4gIHNldENtZERhdGE6IChmdWxsbmFtZSxkYXRhKSAtPlxuICAgIEBzZXRDbWQoZnVsbG5hbWUsbmV3IENvbW1hbmQoZnVsbG5hbWUuc3BsaXQoJzonKS5wb3AoKSxkYXRhKSlcbiAgc2V0Q21kOiAoZnVsbG5hbWUsY21kKSAtPlxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgbmV4dCA9IEBnZXRDbWQoc3BhY2UpXG4gICAgICB1bmxlc3MgbmV4dD9cbiAgICAgICAgbmV4dCA9IEBhZGRDbWQobmV3IENvbW1hbmQoc3BhY2UpKVxuICAgICAgcmV0dXJuIG5leHQuc2V0Q21kKG5hbWUsY21kKVxuICAgIGVsc2VcbiAgICAgIEBhZGRDbWQoY21kKVxuICAgICAgcmV0dXJuIGNtZFxuICBhZGREZXRlY3RvcjogKGRldGVjdG9yKSAtPlxuICAgIEBkZXRlY3RvcnMucHVzaChkZXRlY3RvcilcbiAgICBcbiAgQHByb3ZpZGVycyA9IFtdXG5cbiAgQHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG5cbiAgQGluaXRDbWRzOiAtPlxuICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwse1xuICAgICAgJ2NtZHMnOntcbiAgICAgICAgJ2hlbGxvJzp7XG4gICAgICAgICAgaGVscDogXCJcIlwiXG4gICAgICAgICAgXCJIZWxsbywgd29ybGQhXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cbiAgICAgICAgICBtb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cbiAgICAgICAgICB2ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWFcbiAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICByZXN1bHQ6ICdIZWxsbywgV29ybGQhJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBmb3IgcHJvdmlkZXIgaW4gQHByb3ZpZGVyc1xuICAgICAgcHJvdmlkZXIucmVnaXN0ZXIoQ29tbWFuZC5jbWRzKVxuXG4gIEBzYXZlQ21kOiAoZnVsbG5hbWUsIGRhdGEpIC0+XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsZGF0YSlcbiAgICAudGhlbiA9PlxuICAgICAgQHN0b3JhZ2Uuc2F2ZUluUGF0aCgnY21kcycsIGZ1bGxuYW1lLCBkYXRhKVxuXG4gIEBsb2FkQ21kczogLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBzYXZlZENtZHMgPSBAc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAudGhlbiAoc2F2ZWRDbWRzKT0+XG4gICAgICBpZiBzYXZlZENtZHM/IFxuICAgICAgICBmb3IgZnVsbG5hbWUsIGRhdGEgb2Ygc2F2ZWRDbWRzXG4gICAgICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpXG5cbiAgQHJlc2V0U2F2ZWQ6IC0+XG4gICAgQHN0b3JhZ2Uuc2F2ZSgnY21kcycse30pXG5cbiAgQG1ha2VWYXJDbWQgPSAobmFtZSxiYXNlPXt9KSAtPiBcbiAgICBiYXNlLmV4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWwgaWYgdmFsP1xuICAgIHJldHVybiBiYXNlXG5cbiAgQG1ha2VCb29sVmFyQ21kID0gKG5hbWUsYmFzZT17fSkgLT4gXG4gICAgYmFzZS5leGVjdXRlID0gKGluc3RhbmNlKSAtPlxuICAgICAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSk/XG4gICAgICAgIHBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UuY29udGVudFxuICAgICAgICBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgdmFsPyBhbmQgdmFsIGluIFsnMCcsJ2ZhbHNlJywnbm8nXVxuICAgICAgICBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdHJ1ZVxuICAgIHJldHVybiBiYXNlXG4gIFxuXG5leHBvcnQgY2xhc3MgQmFzZUNvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAaW5zdGFuY2UpIC0+XG4gIGluaXQ6IC0+XG4gICAgI1xuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICByZXR1cm4gdGhpc1tcInJlc3VsdFwiXT9cbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgcmV0dXJuIHt9XG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIHt9XG4gICAgICAiLCJ2YXIgX29wdEtleTtcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBTdG9yYWdlXG59IGZyb20gJy4vU3RvcmFnZSc7XG5cbmltcG9ydCB7XG4gIE5hbWVzcGFjZUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuX29wdEtleSA9IGZ1bmN0aW9uKGtleSwgZGljdCwgZGVmVmFsID0gbnVsbCkge1xuICAvLyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICBpZiAoa2V5IGluIGRpY3QpIHtcbiAgICByZXR1cm4gZGljdFtrZXldO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkZWZWYWw7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgQ29tbWFuZCA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IobmFtZTEsIGRhdGExID0gbnVsbCwgcGFyZW50ID0gbnVsbCkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTE7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhMTtcbiAgICAgIHRoaXMuY21kcyA9IFtdO1xuICAgICAgdGhpcy5kZXRlY3RvcnMgPSBbXTtcbiAgICAgIHRoaXMuZXhlY3V0ZUZ1bmN0ID0gdGhpcy5yZXN1bHRGdW5jdCA9IHRoaXMucmVzdWx0U3RyID0gdGhpcy5hbGlhc09mID0gdGhpcy5jbHMgPSBudWxsO1xuICAgICAgdGhpcy5hbGlhc2VkID0gbnVsbDtcbiAgICAgIHRoaXMuZnVsbE5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICB0aGlzLmRlcHRoID0gMDtcbiAgICAgIFt0aGlzLl9wYXJlbnQsIHRoaXMuX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdO1xuICAgICAgdGhpcy5zZXRQYXJlbnQocGFyZW50KTtcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSB7fTtcbiAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgICBhbHRlclJlc3VsdDogbnVsbCxcbiAgICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgICAgIGFsbG93ZWROYW1lZDogbnVsbFxuICAgICAgfTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgICAgdGhpcy5maW5hbE9wdGlvbnMgPSBudWxsO1xuICAgIH1cblxuICAgIHBhcmVudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgfVxuXG4gICAgc2V0UGFyZW50KHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5fcGFyZW50ICE9PSB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5mdWxsTmFtZSA9ICgodGhpcy5fcGFyZW50ICE9IG51bGwpICYmICh0aGlzLl9wYXJlbnQubmFtZSAhPSBudWxsKSA/IHRoaXMuX3BhcmVudC5mdWxsTmFtZSArICc6JyArIHRoaXMubmFtZSA6IHRoaXMubmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlcHRoID0gKCh0aGlzLl9wYXJlbnQgIT0gbnVsbCkgJiYgKHRoaXMuX3BhcmVudC5kZXB0aCAhPSBudWxsKSA/IHRoaXMuX3BhcmVudC5kZXB0aCArIDEgOiAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wYXJzZURhdGEodGhpcy5kYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50LnJlbW92ZUNtZCh0aGlzKTtcbiAgICB9XG5cbiAgICBpc0VkaXRhYmxlKCkge1xuICAgICAgcmV0dXJuICh0aGlzLnJlc3VsdFN0ciAhPSBudWxsKSB8fCAodGhpcy5hbGlhc09mICE9IG51bGwpO1xuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZSgpIHtcbiAgICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZjtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgICAgfVxuICAgICAgcmVmID0gWydyZXN1bHRTdHInLCAncmVzdWx0RnVuY3QnLCAnY2xzJywgJ2V4ZWN1dGVGdW5jdCddO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal07XG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWUpIHtcbiAgICAgIHZhciBhbGlhc09mLCBhbGlhc2VkLCBjb250ZXh0O1xuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgICBhbGlhc09mID0gdGhpcy5hbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIG5hbWUpO1xuICAgICAgICBhbGlhc2VkID0gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpO1xuICAgICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmlzRXhlY3V0YWJsZSgpO1xuICAgIH1cblxuICAgIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmO1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuICAgICAgcmVmID0gWydyZXN1bHRTdHInLCAncmVzdWx0RnVuY3QnXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcmVmW2pdO1xuICAgICAgICBpZiAodGhpc1twXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXREZWZhdWx0cygpIHtcbiAgICAgIHZhciBhbGlhc2VkLCByZXM7XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5kZWZhdWx0cyk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIF9hbGlhc2VkRnJvbUZpbmRlcihmaW5kZXIpIHtcbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZTtcbiAgICAgIGZpbmRlci5tdXN0RXhlY3V0ZSA9IGZhbHNlO1xuICAgICAgZmluZGVyLnVzZURldGVjdG9ycyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKCk7XG4gICAgfVxuXG4gICAgZ2V0QWxpYXNlZCgpIHtcbiAgICAgIHZhciBjb250ZXh0O1xuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIodGhpcy5hbGlhc09mKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0T3B0aW9ucyhkYXRhKSB7XG4gICAgICB2YXIga2V5LCByZXN1bHRzLCB2YWw7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG4gICAgICAgIHZhbCA9IGRhdGFba2V5XTtcbiAgICAgICAgaWYgKGtleSBpbiB0aGlzLmRlZmF1bHRPcHRpb25zKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMub3B0aW9uc1trZXldID0gdmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgX29wdGlvbnNGb3JBbGlhc2VkKGFsaWFzZWQpIHtcbiAgICAgIHZhciBvcHQ7XG4gICAgICBvcHQgPSB7fTtcbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmRlZmF1bHRPcHRpb25zKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIGFsaWFzZWQuZ2V0T3B0aW9ucygpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5vcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb25zKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb24oa2V5KSB7XG4gICAgICB2YXIgb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhlbHAoKSB7XG4gICAgICB2YXIgY21kO1xuICAgICAgY21kID0gdGhpcy5nZXRDbWQoJ2hlbHAnKTtcbiAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VEYXRhKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gZGF0YTtcbiAgICAgICAgdGhpcy5vcHRpb25zWydwYXJzZSddID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGRhdGEgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURpY3REYXRhKGRhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHBhcnNlRGljdERhdGEoZGF0YSkge1xuICAgICAgdmFyIGV4ZWN1dGUsIHJlcztcbiAgICAgIHJlcyA9IF9vcHRLZXkoJ3Jlc3VsdCcsIGRhdGEpO1xuICAgICAgaWYgKHR5cGVvZiByZXMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLnJlc3VsdEZ1bmN0ID0gcmVzO1xuICAgICAgfSBlbHNlIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IHJlcztcbiAgICAgICAgdGhpcy5vcHRpb25zWydwYXJzZSddID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJywgZGF0YSk7XG4gICAgICBpZiAodHlwZW9mIGV4ZWN1dGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLmV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGU7XG4gICAgICB9XG4gICAgICB0aGlzLmFsaWFzT2YgPSBfb3B0S2V5KCdhbGlhc09mJywgZGF0YSk7XG4gICAgICB0aGlzLmNscyA9IF9vcHRLZXkoJ2NscycsIGRhdGEpO1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IF9vcHRLZXkoJ2RlZmF1bHRzJywgZGF0YSwgdGhpcy5kZWZhdWx0cyk7XG4gICAgICB0aGlzLnNldE9wdGlvbnMoZGF0YSk7XG4gICAgICBpZiAoJ2hlbHAnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLCBkYXRhWydoZWxwJ10sIHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIGlmICgnZmFsbGJhY2snIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2ZhbGxiYWNrJywgZGF0YVsnZmFsbGJhY2snXSwgdGhpcykpO1xuICAgICAgfVxuICAgICAgaWYgKCdjbWRzJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kcyhkYXRhWydjbWRzJ10pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYWRkQ21kcyhjbWRzKSB7XG4gICAgICB2YXIgZGF0YSwgbmFtZSwgcmVzdWx0cztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAobmFtZSBpbiBjbWRzKSB7XG4gICAgICAgIGRhdGEgPSBjbWRzW25hbWVdO1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGRDbWQobmV3IENvbW1hbmQobmFtZSwgZGF0YSwgdGhpcykpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIGFkZENtZChjbWQpIHtcbiAgICAgIHZhciBleGlzdHM7XG4gICAgICBleGlzdHMgPSB0aGlzLmdldENtZChjbWQubmFtZSk7XG4gICAgICBpZiAoZXhpc3RzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbWQoZXhpc3RzKTtcbiAgICAgIH1cbiAgICAgIGNtZC5zZXRQYXJlbnQodGhpcyk7XG4gICAgICB0aGlzLmNtZHMucHVzaChjbWQpO1xuICAgICAgcmV0dXJuIGNtZDtcbiAgICB9XG5cbiAgICByZW1vdmVDbWQoY21kKSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmICgoaSA9IHRoaXMuY21kcy5pbmRleE9mKGNtZCkpID4gLTEpIHtcbiAgICAgICAgdGhpcy5jbWRzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjbWQ7XG4gICAgfVxuXG4gICAgZ2V0Q21kKGZ1bGxuYW1lKSB7XG4gICAgICB2YXIgY21kLCBqLCBsZW4sIG5hbWUsIHJlZiwgcmVmMSwgc3BhY2U7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gKHJlZiA9IHRoaXMuZ2V0Q21kKHNwYWNlKSkgIT0gbnVsbCA/IHJlZi5nZXRDbWQobmFtZSkgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgICByZWYxID0gdGhpcy5jbWRzO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmMS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBjbWQgPSByZWYxW2pdO1xuICAgICAgICBpZiAoY21kLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gY21kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0Q21kKGZ1bGxuYW1lLCBuZXcgQ29tbWFuZChmdWxsbmFtZS5zcGxpdCgnOicpLnBvcCgpLCBkYXRhKSk7XG4gICAgfVxuXG4gICAgc2V0Q21kKGZ1bGxuYW1lLCBjbWQpIHtcbiAgICAgIHZhciBuYW1lLCBuZXh0LCBzcGFjZTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgICBuZXh0ID0gdGhpcy5nZXRDbWQoc3BhY2UpO1xuICAgICAgICBpZiAobmV4dCA9PSBudWxsKSB7XG4gICAgICAgICAgbmV4dCA9IHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKHNwYWNlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5leHQuc2V0Q21kKG5hbWUsIGNtZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFkZENtZChjbWQpO1xuICAgICAgICByZXR1cm4gY21kO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZERldGVjdG9yKGRldGVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXRlY3RvcnMucHVzaChkZXRlY3Rvcik7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXRDbWRzKCkge1xuICAgICAgdmFyIGosIGxlbiwgcHJvdmlkZXIsIHJlZiwgcmVzdWx0cztcbiAgICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwsIHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ2hlbGxvJzoge1xuICAgICAgICAgICAgaGVscDogXCJcXFwiSGVsbG8sIHdvcmxkIVxcXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cXG5tb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cXG52ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWFcIixcbiAgICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlZiA9IHRoaXMucHJvdmlkZXJzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHByb3ZpZGVyID0gcmVmW2pdO1xuICAgICAgICByZXN1bHRzLnB1c2gocHJvdmlkZXIucmVnaXN0ZXIoQ29tbWFuZC5jbWRzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBzdGF0aWMgc2F2ZUNtZChmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZUluUGF0aCgnY21kcycsIGZ1bGxuYW1lLCBkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBsb2FkQ21kcygpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcztcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHRoaXMuc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gICAgICB9KS50aGVuKChzYXZlZENtZHMpID0+IHtcbiAgICAgICAgdmFyIGRhdGEsIGZ1bGxuYW1lLCByZXN1bHRzO1xuICAgICAgICBpZiAoc2F2ZWRDbWRzICE9IG51bGwpIHtcbiAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChmdWxsbmFtZSBpbiBzYXZlZENtZHMpIHtcbiAgICAgICAgICAgIGRhdGEgPSBzYXZlZENtZHNbZnVsbG5hbWVdO1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXRTYXZlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZSgnY21kcycsIHt9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZVZhckNtZChuYW1lLCBiYXNlID0ge30pIHtcbiAgICAgIGJhc2UuZXhlY3V0ZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBwLCB2YWw7XG4gICAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gICAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIG1ha2VCb29sVmFyQ21kKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHAsIHZhbDtcbiAgICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcbiAgICAgICAgaWYgKCEoKHZhbCAhPSBudWxsKSAmJiAodmFsID09PSAnMCcgfHwgdmFsID09PSAnZmFsc2UnIHx8IHZhbCA9PT0gJ25vJykpKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuXG4gIH07XG5cbiAgQ29tbWFuZC5wcm92aWRlcnMgPSBbXTtcblxuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpO1xuXG4gIHJldHVybiBDb21tYW5kO1xuXG59KS5jYWxsKHRoaXMpO1xuXG5leHBvcnQgdmFyIEJhc2VDb21tYW5kID0gY2xhc3MgQmFzZUNvbW1hbmQge1xuICBjb25zdHJ1Y3RvcihpbnN0YW5jZTEpIHtcbiAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2UxO1xuICB9XG5cbiAgaW5pdCgpIHt9XG5cbiAgXG4gIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgIHJldHVybiB0aGlzW1wicmVzdWx0XCJdICE9IG51bGw7XG4gIH1cblxuICBnZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDbWRGaW5kZXIgfSBmcm9tICcuL0NtZEZpbmRlcic7XG5pbXBvcnQgeyBDbWRJbnN0YW5jZSB9IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgQ29udGV4dFxuICBjb25zdHJ1Y3RvcjogKEBjb2Rld2F2ZSkgLT5cbiAgICBAbmFtZVNwYWNlcyA9IFtdXG4gIFxuICBhZGROYW1lU3BhY2U6IChuYW1lKSAtPlxuICAgIGlmIG5hbWUgbm90IGluIEBuYW1lU3BhY2VzIFxuICAgICAgQG5hbWVTcGFjZXMucHVzaChuYW1lKVxuICAgICAgQF9uYW1lc3BhY2VzID0gbnVsbFxuICBhZGROYW1lc3BhY2VzOiAoc3BhY2VzKSAtPlxuICAgIGlmIHNwYWNlcyBcbiAgICAgIGlmIHR5cGVvZiBzcGFjZXMgPT0gJ3N0cmluZydcbiAgICAgICAgc3BhY2VzID0gW3NwYWNlc11cbiAgICAgIGZvciBzcGFjZSBpbiBzcGFjZXMgXG4gICAgICAgIEBhZGROYW1lU3BhY2Uoc3BhY2UpXG4gIHJlbW92ZU5hbWVTcGFjZTogKG5hbWUpIC0+XG4gICAgQG5hbWVTcGFjZXMgPSBAbmFtZVNwYWNlcy5maWx0ZXIgKG4pIC0+IG4gaXNudCBuYW1lXG5cbiAgZ2V0TmFtZVNwYWNlczogLT5cbiAgICB1bmxlc3MgQF9uYW1lc3BhY2VzP1xuICAgICAgbnBjcyA9IFsnY29yZSddLmNvbmNhdChAbmFtZVNwYWNlcylcbiAgICAgIGlmIEBwYXJlbnQ/XG4gICAgICAgIG5wY3MgPSBucGNzLmNvbmNhdChAcGFyZW50LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgIEBfbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLnVuaXF1ZShucGNzKVxuICAgIHJldHVybiBAX25hbWVzcGFjZXNcbiAgZ2V0Q21kOiAoY21kTmFtZSxvcHRpb25zID0ge30pIC0+XG4gICAgZmluZGVyID0gQGdldEZpbmRlcihjbWROYW1lLG9wdGlvbnMpXG4gICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSxvcHRpb25zID0ge30pIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRGaW5kZXIoY21kTmFtZSwgT2JqZWN0LmFzc2lnbih7XG4gICAgICBuYW1lc3BhY2VzOiBbXVxuICAgICAgdXNlRGV0ZWN0b3JzOiBAaXNSb290KClcbiAgICAgIGNvZGV3YXZlOiBAY29kZXdhdmVcbiAgICAgIHBhcmVudENvbnRleHQ6IHRoaXNcbiAgICB9LG9wdGlvbnMpKVxuICBpc1Jvb3Q6IC0+XG4gICAgcmV0dXJuICFAcGFyZW50P1xuICBnZXRQYXJlbnRPclJvb3Q6ICgpIC0+XG4gICAgaWYgQHBhcmVudD9cbiAgICAgIEBwYXJlbnRcbiAgICBlbHNlXG4gICAgICB0aGlzXG4gIHdyYXBDb21tZW50OiAoc3RyKSAtPlxuICAgIGNjID0gQGdldENvbW1lbnRDaGFyKClcbiAgICBpZiBjYy5pbmRleE9mKCclcycpID4gLTFcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsc3RyKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0ciArICcgJyArIGNjXG4gIHdyYXBDb21tZW50TGVmdDogKHN0ciA9ICcnKSAtPlxuICAgIGNjID0gQGdldENvbW1lbnRDaGFyKClcbiAgICBpZiAoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTFcbiAgICAgIHJldHVybiBjYy5zdWJzdHIoMCxpKSArIHN0clxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0clxuICB3cmFwQ29tbWVudFJpZ2h0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIHN0ciArIGNjLnN1YnN0cihpKzIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHN0ciArICcgJyArIGNjXG4gIGNtZEluc3RhbmNlRm9yOiAoY21kKSAtPlxuICAgIHJldHVybiBuZXcgQ21kSW5zdGFuY2UoY21kLHRoaXMpXG4gIGdldENvbW1lbnRDaGFyOiAtPlxuICAgIGlmIEBjb21tZW50Q2hhcj9cbiAgICAgIHJldHVybiBAY29tbWVudENoYXJcbiAgICBjbWQgPSBAZ2V0Q21kKCdjb21tZW50JylcbiAgICBjaGFyID0gJzwhLS0gJXMgLS0+J1xuICAgIGlmIGNtZD9cbiAgICAgIGluc3QgPSBAY21kSW5zdGFuY2VGb3IoY21kKVxuICAgICAgaW5zdC5jb250ZW50ID0gJyVzJ1xuICAgICAgcmVzID0gaW5zdC5yZXN1bHQoKVxuICAgICAgaWYgcmVzP1xuICAgICAgICBjaGFyID0gcmVzXG4gICAgQGNvbW1lbnRDaGFyID0gY2hhclxuICAgIHJldHVybiBAY29tbWVudENoYXIiLCJ2YXIgaW5kZXhPZiA9IFtdLmluZGV4T2Y7XG5cbmltcG9ydCB7XG4gIENtZEZpbmRlclxufSBmcm9tICcuL0NtZEZpbmRlcic7XG5cbmltcG9ydCB7XG4gIENtZEluc3RhbmNlXG59IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuXG5pbXBvcnQge1xuICBBcnJheUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuXG5leHBvcnQgdmFyIENvbnRleHQgPSBjbGFzcyBDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoY29kZXdhdmUpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmU7XG4gICAgdGhpcy5uYW1lU3BhY2VzID0gW107XG4gIH1cblxuICBhZGROYW1lU3BhY2UobmFtZSkge1xuICAgIGlmIChpbmRleE9mLmNhbGwodGhpcy5uYW1lU3BhY2VzLCBuYW1lKSA8IDApIHtcbiAgICAgIHRoaXMubmFtZVNwYWNlcy5wdXNoKG5hbWUpO1xuICAgICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZXMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFkZE5hbWVzcGFjZXMoc3BhY2VzKSB7XG4gICAgdmFyIGosIGxlbiwgcmVzdWx0cywgc3BhY2U7XG4gICAgaWYgKHNwYWNlcykge1xuICAgICAgaWYgKHR5cGVvZiBzcGFjZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNwYWNlcyA9IFtzcGFjZXNdO1xuICAgICAgfVxuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gc3BhY2VzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHNwYWNlID0gc3BhY2VzW2pdO1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGROYW1lU3BhY2Uoc3BhY2UpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZU5hbWVTcGFjZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZVNwYWNlcyA9IHRoaXMubmFtZVNwYWNlcy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4gIT09IG5hbWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXROYW1lU3BhY2VzKCkge1xuICAgIHZhciBucGNzO1xuICAgIGlmICh0aGlzLl9uYW1lc3BhY2VzID09IG51bGwpIHtcbiAgICAgIG5wY3MgPSBbJ2NvcmUnXS5jb25jYXQodGhpcy5uYW1lU3BhY2VzKTtcbiAgICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIG5wY3MgPSBucGNzLmNvbmNhdCh0aGlzLnBhcmVudC5nZXROYW1lU3BhY2VzKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLnVuaXF1ZShucGNzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZXM7XG4gIH1cblxuICBnZXRDbWQoY21kTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmdldEZpbmRlcihjbWROYW1lLCBvcHRpb25zKTtcbiAgICByZXR1cm4gZmluZGVyLmZpbmQoKTtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IENtZEZpbmRlcihjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0aGlzLmlzUm9vdCgpLFxuICAgICAgY29kZXdhdmU6IHRoaXMuY29kZXdhdmUsXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSwgb3B0aW9ucykpO1xuICB9XG5cbiAgaXNSb290KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9PSBudWxsO1xuICB9XG5cbiAgZ2V0UGFyZW50T3JSb290KCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50KHN0cikge1xuICAgIHZhciBjYztcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcbiAgICBpZiAoY2MuaW5kZXhPZignJXMnKSA+IC0xKSB7XG4gICAgICByZXR1cm4gY2MucmVwbGFjZSgnJXMnLCBzdHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHIgKyAnICcgKyBjYztcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudExlZnQoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGk7XG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKCk7XG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLCBpKSArIHN0cjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50UmlnaHQoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGk7XG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKCk7XG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIHN0ciArIGNjLnN1YnN0cihpICsgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdHIgKyAnICcgKyBjYztcbiAgICB9XG4gIH1cblxuICBjbWRJbnN0YW5jZUZvcihjbWQpIHtcbiAgICByZXR1cm4gbmV3IENtZEluc3RhbmNlKGNtZCwgdGhpcyk7XG4gIH1cblxuICBnZXRDb21tZW50Q2hhcigpIHtcbiAgICB2YXIgY2hhciwgY21kLCBpbnN0LCByZXM7XG4gICAgaWYgKHRoaXMuY29tbWVudENoYXIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tbWVudENoYXI7XG4gICAgfVxuICAgIGNtZCA9IHRoaXMuZ2V0Q21kKCdjb21tZW50Jyk7XG4gICAgY2hhciA9ICc8IS0tICVzIC0tPic7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBpbnN0ID0gdGhpcy5jbWRJbnN0YW5jZUZvcihjbWQpO1xuICAgICAgaW5zdC5jb250ZW50ID0gJyVzJztcbiAgICAgIHJlcyA9IGluc3QucmVzdWx0KCk7XG4gICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgY2hhciA9IHJlcztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb21tZW50Q2hhciA9IGNoYXI7XG4gICAgcmV0dXJuIHRoaXMuY29tbWVudENoYXI7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBhaXIgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgY2xhc3MgRGV0ZWN0b3JcbiAgY29uc3RydWN0b3I6IChAZGF0YT17fSkgLT5cbiAgZGV0ZWN0OiAoZmluZGVyKSAtPlxuICAgIGlmIEBkZXRlY3RlZChmaW5kZXIpXG4gICAgICByZXR1cm4gQGRhdGEucmVzdWx0IGlmIEBkYXRhLnJlc3VsdD9cbiAgICBlbHNlXG4gICAgICByZXR1cm4gQGRhdGEuZWxzZSBpZiBAZGF0YS5lbHNlP1xuICBkZXRlY3RlZDogKGZpbmRlcikgLT5cbiAgICAjXG5cbmV4cG9ydCBjbGFzcyBMYW5nRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvclxuICBkZXRlY3Q6IChmaW5kZXIpIC0+XG4gICAgaWYgZmluZGVyLmNvZGV3YXZlPyBcbiAgICAgIGxhbmcgPSBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLmdldExhbmcoKVxuICAgICAgaWYgbGFuZz8gXG4gICAgICAgIHJldHVybiBsYW5nLnRvTG93ZXJDYXNlKClcbiAgICAgICAgXG5leHBvcnQgY2xhc3MgUGFpckRldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3JcbiAgZGV0ZWN0ZWQ6IChmaW5kZXIpIC0+XG4gICAgaWYgQGRhdGEub3BlbmVyPyBhbmQgQGRhdGEuY2xvc2VyPyBhbmQgZmluZGVyLmluc3RhbmNlP1xuICAgICAgcGFpciA9IG5ldyBQYWlyKEBkYXRhLm9wZW5lciwgQGRhdGEuY2xvc2VyLCBAZGF0YSlcbiAgICAgIGlmIHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICAgICAgIiwiaW1wb3J0IHtcbiAgUGFpclxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgdmFyIERldGVjdG9yID0gY2xhc3MgRGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhID0ge30pIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICB9XG5cbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIGlmICh0aGlzLmRldGVjdGVkKGZpbmRlcikpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEucmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5yZXN1bHQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuZWxzZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuZWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXRlY3RlZChmaW5kZXIpIHt9XG5cbn07XG5cblxuZXhwb3J0IHZhciBMYW5nRGV0ZWN0b3IgPSBjbGFzcyBMYW5nRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdChmaW5kZXIpIHtcbiAgICB2YXIgbGFuZztcbiAgICBpZiAoZmluZGVyLmNvZGV3YXZlICE9IG51bGwpIHtcbiAgICAgIGxhbmcgPSBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLmdldExhbmcoKTtcbiAgICAgIGlmIChsYW5nICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcblxuZXhwb3J0IHZhciBQYWlyRGV0ZWN0b3IgPSBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdGVkKGZpbmRlcikge1xuICAgIHZhciBwYWlyO1xuICAgIGlmICgodGhpcy5kYXRhLm9wZW5lciAhPSBudWxsKSAmJiAodGhpcy5kYXRhLmNsb3NlciAhPSBudWxsKSAmJiAoZmluZGVyLmluc3RhbmNlICE9IG51bGwpKSB7XG4gICAgICBwYWlyID0gbmV3IFBhaXIodGhpcy5kYXRhLm9wZW5lciwgdGhpcy5kYXRhLmNsb3NlciwgdGhpcy5kYXRhKTtcbiAgICAgIGlmIChwYWlyLmlzV2FwcGVyT2YoZmluZGVyLmluc3RhbmNlLmdldFBvcygpLCBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLnRleHQoKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0Q21kUHJvcFxuICBjb25zdHJ1Y3RvcjogKEBuYW1lLG9wdGlvbnMpIC0+XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAndmFyJyA6IG51bGwsXG4gICAgICAnb3B0JyA6IG51bGwsXG4gICAgICAnZnVuY3QnIDogbnVsbCxcbiAgICAgICdkYXRhTmFtZScgOiBudWxsLFxuICAgICAgJ3Nob3dFbXB0eScgOiBmYWxzZSxcbiAgICAgICdjYXJyZXQnIDogZmFsc2UsXG4gICAgfVxuICAgIGZvciBrZXkgaW4gWyd2YXInLCdvcHQnLCdmdW5jdCddXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICBkZWZhdWx0c1snZGF0YU5hbWUnXSA9IG9wdGlvbnNba2V5XVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgICAgICBcbiAgc2V0Q21kOiAoY21kcykgLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZChAbmFtZSlcbiAgXG4gIHdyaXRlRm9yOiAocGFyc2VyLG9iaikgLT5cbiAgICBpZiBwYXJzZXIudmFyc1tAbmFtZV0/XG4gICAgICBvYmpbQGRhdGFOYW1lXSA9IHBhcnNlci52YXJzW0BuYW1lXVxuICB2YWxGcm9tQ21kOiAoY21kKSAtPlxuICAgIGlmIGNtZD9cbiAgICAgIGlmIEBvcHQ/XG4gICAgICAgIHJldHVybiBjbWQuZ2V0T3B0aW9uKEBvcHQpXG4gICAgICBpZiBAZnVuY3Q/XG4gICAgICAgIHJldHVybiBjbWRbQGZ1bmN0XSgpXG4gICAgICBpZiBAdmFyP1xuICAgICAgICByZXR1cm4gY21kW0B2YXJdXG4gIHNob3dGb3JDbWQ6IChjbWQpIC0+XG4gICAgdmFsID0gQHZhbEZyb21DbWQoY21kKVxuICAgIHJldHVybiBAc2hvd0VtcHR5IG9yIHZhbD9cbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICBpZiBAc2hvd0ZvckNtZChjbWQpXG4gICAgICBcIlwiXCJcbiAgICAgIH5+I3tAbmFtZX1+flxuICAgICAgI3tAdmFsRnJvbUNtZChjbWQpIG9yIFwiXCJ9I3tpZiBAY2FycmV0IHRoZW4gXCJ8XCIgZWxzZSBcIlwifVxuICAgICAgfn4vI3tAbmFtZX1+flxuICAgICAgXCJcIlwiXG4gICAgXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5zb3VyY2UgZXh0ZW5kcyBFZGl0Q21kUHJvcCBcbiAgdmFsRnJvbUNtZDogKGNtZCktPlxuICAgIHJlcyA9IHN1cGVyKGNtZClcbiAgICBpZiByZXM/XG4gICAgICByZXMgPSByZXMucmVwbGFjZSgvXFx8L2csICd8fCcpXG4gICAgcmV0dXJuIHJlc1xuICBzZXRDbWQ6IChjbWRzKS0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQoQG5hbWUseydwcmV2ZW50UGFyc2VBbGwnIDogdHJ1ZX0pXG4gIHNob3dGb3JDbWQ6IChjbWQpIC0+XG4gICAgdmFsID0gQHZhbEZyb21DbWQoY21kKVxuICAgIHJldHVybiAoQHNob3dFbXB0eSBhbmQgIShjbWQ/IGFuZCBjbWQuYWxpYXNPZj8pKSBvciB2YWw/XG4gICAgXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5zdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIGlmIEB2YWxGcm9tQ21kKGNtZCk/XG4gICAgICByZXR1cm4gXCJ+fiEje0BuYW1lfSAnI3tAdmFsRnJvbUNtZChjbWQpfSN7aWYgQGNhcnJldCB0aGVuIFwifFwiIGVsc2UgXCJcIn0nfn5cIlxuICAgIFxuICAgIFxuY2xhc3MgRWRpdENtZFByb3AucmV2Qm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIHNldENtZDogKGNtZHMpIC0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKEBuYW1lKVxuICB3cml0ZUZvcjogKHBhcnNlcixvYmopIC0+XG4gICAgaWYgcGFyc2VyLnZhcnNbQG5hbWVdP1xuICAgICAgb2JqW0BkYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbQG5hbWVdXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgdmFsID0gQHZhbEZyb21DbWQoY21kKVxuICAgIGlmIHZhbD8gYW5kICF2YWxcbiAgICAgIHJldHVybiBcIn5+ISN7QG5hbWV9fn5cIlxuXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5ib29sIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgc2V0Q21kOiAoY21kcykgLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQoQG5hbWUpXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgXCJ+fiEje0BuYW1lfX5+XCIgaWYgQHZhbEZyb21DbWQoY21kKSIsImltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBFZGl0Q21kUHJvcCA9IGNsYXNzIEVkaXRDbWRQcm9wIHtcbiAgY29uc3RydWN0b3IobmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywgaSwga2V5LCBsZW4sIHJlZiwgdmFsO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAndmFyJzogbnVsbCxcbiAgICAgICdvcHQnOiBudWxsLFxuICAgICAgJ2Z1bmN0JzogbnVsbCxcbiAgICAgICdkYXRhTmFtZSc6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JzogZmFsc2UsXG4gICAgICAnY2FycmV0JzogZmFsc2VcbiAgICB9O1xuICAgIHJlZiA9IFsndmFyJywgJ29wdCcsICdmdW5jdCddO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAga2V5ID0gcmVmW2ldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGRlZmF1bHRzWydkYXRhTmFtZSddID0gb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICB3cml0ZUZvcihwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSBwYXJzZXIudmFyc1t0aGlzLm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHZhbEZyb21DbWQoY21kKSB7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5vcHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmdldE9wdGlvbih0aGlzLm9wdCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5mdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy5mdW5jdF0oKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnZhciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy52YXJdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3dGb3JDbWQoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgfHwgKHZhbCAhPSBudWxsKTtcbiAgfVxuXG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMuc2hvd0ZvckNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+JHt0aGlzLm5hbWV9fn5cXG4ke3RoaXMudmFsRnJvbUNtZChjbWQpIHx8IFwiXCJ9JHsodGhpcy5jYXJyZXQgPyBcInxcIiA6IFwiXCIpfVxcbn5+LyR7dGhpcy5uYW1lfX5+YDtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZFByb3Auc291cmNlID0gY2xhc3Mgc291cmNlIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICB2YWxGcm9tQ21kKGNtZCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gc3VwZXIudmFsRnJvbUNtZChjbWQpO1xuICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgcmVzID0gcmVzLnJlcGxhY2UoL1xcfC9nLCAnfHwnKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZCh0aGlzLm5hbWUsIHtcbiAgICAgICdwcmV2ZW50UGFyc2VBbGwnOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBzaG93Rm9yQ21kKGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG4gICAgcmV0dXJuICh0aGlzLnNob3dFbXB0eSAmJiAhKChjbWQgIT0gbnVsbCkgJiYgKGNtZC5hbGlhc09mICE9IG51bGwpKSkgfHwgKHZhbCAhPSBudWxsKTtcbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5zdHJpbmcgPSBjbGFzcyBzdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9ICcke3RoaXMudmFsRnJvbUNtZChjbWQpfSR7KHRoaXMuY2FycmV0ID8gXCJ8XCIgOiBcIlwiKX0nfn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5yZXZCb29sID0gY2xhc3MgcmV2Qm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgd3JpdGVGb3IocGFyc2VyLCBvYmopIHtcbiAgICBpZiAocGFyc2VyLnZhcnNbdGhpcy5uYW1lXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gb2JqW3RoaXMuZGF0YU5hbWVdID0gIXBhcnNlci52YXJzW3RoaXMubmFtZV07XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIGlmICgodmFsICE9IG51bGwpICYmICF2YWwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5ib29sID0gY2xhc3MgYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgU3RyUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuaW1wb3J0IHsgb3B0aW9uYWxQcm9taXNlIH0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQG5hbWVzcGFjZSA9IG51bGxcbiAgICBAX2xhbmcgPSBudWxsXG4gIGJpbmRlZFRvOiAoY29kZXdhdmUpIC0+XG4gICAgI1xuICB0ZXh0OiAodmFsKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRMZW46IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCA9IG51bGwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBiZWdpblVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBlbmRVbmRvQWN0aW9uOiAtPlxuICAgICNcbiAgZ2V0TGFuZzogLT5cbiAgICByZXR1cm4gQF9sYW5nXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdDogLT5cbiAgICByZXR1cm4gbnVsbFxuICBhbGxvd011bHRpU2VsZWN0aW9uOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBzZXRNdWx0aVNlbDogKHNlbGVjdGlvbnMpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRNdWx0aVNlbDogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGNhbkxpc3RlblRvQ2hhbmdlOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIFxuICBnZXRMaW5lQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQGZpbmRMaW5lU3RhcnQocG9zKSxAZmluZExpbmVFbmQocG9zKSlcbiAgZmluZExpbmVTdGFydDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiXSwgLTEpXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcysxIGVsc2UgMFxuICBmaW5kTGluZUVuZDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiLFwiXFxyXCJdKVxuICAgIHJldHVybiBpZiBwIHRoZW4gcC5wb3MgZWxzZSBAdGV4dExlbigpXG4gIFxuICBmaW5kQW55TmV4dDogKHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgaWYgZGlyZWN0aW9uID4gMFxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LEB0ZXh0TGVuKCkpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKDAsc3RhcnQpXG4gICAgYmVzdFBvcyA9IG51bGxcbiAgICBmb3Igc3RyaSBpbiBzdHJpbmdzXG4gICAgICBwb3MgPSBpZiBkaXJlY3Rpb24gPiAwIHRoZW4gdGV4dC5pbmRleE9mKHN0cmkpIGVsc2UgdGV4dC5sYXN0SW5kZXhPZihzdHJpKVxuICAgICAgaWYgcG9zICE9IC0xXG4gICAgICAgIGlmICFiZXN0UG9zPyBvciBiZXN0UG9zKmRpcmVjdGlvbiA+IHBvcypkaXJlY3Rpb25cbiAgICAgICAgICBiZXN0UG9zID0gcG9zXG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmlcbiAgICBpZiBiZXN0U3RyP1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBiZXN0UG9zICsgc3RhcnQgZWxzZSBiZXN0UG9zKSxiZXN0U3RyKVxuICAgIHJldHVybiBudWxsXG4gIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICByZXBsYWNlbWVudHMucmVkdWNlKChwcm9taXNlLHJlcGwpPT5cbiAgICAgICAgcHJvbWlzZS50aGVuIChvcHQpPT5cbiAgICAgICAgICByZXBsLndpdGhFZGl0b3IodGhpcylcbiAgICAgICAgICByZXBsLmFwcGx5T2Zmc2V0KG9wdC5vZmZzZXQpXG4gICAgICAgICAgb3B0aW9uYWxQcm9taXNlKHJlcGwuYXBwbHkoKSkudGhlbiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzZWxlY3Rpb25zOiBvcHQuc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKSxcbiAgICAgICAgICAgICAgb2Zmc2V0OiBvcHQub2Zmc2V0K3JlcGwub2Zmc2V0QWZ0ZXIodGhpcykgXG4gICAgICAgICAgICB9XG4gICAgICAsIG9wdGlvbmFsUHJvbWlzZSh7c2VsZWN0aW9uczogW10sb2Zmc2V0OiAwfSkpXG4gICAgLnRoZW4gKG9wdCk9PlxuICAgICAgQGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhvcHQuc2VsZWN0aW9ucylcbiAgICAucmVzdWx0KClcbiAgICBcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnM6IChzZWxlY3Rpb25zKSAtPlxuICAgIGlmIHNlbGVjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgaWYgQGFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgICAgICBAc2V0TXVsdGlTZWwoc2VsZWN0aW9ucylcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldEN1cnNvclBvcyhzZWxlY3Rpb25zWzBdLnN0YXJ0LHNlbGVjdGlvbnNbMF0uZW5kKSIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFN0clBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5cbmltcG9ydCB7XG4gIG9wdGlvbmFsUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IHZhciBFZGl0b3IgPSBjbGFzcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG51bGw7XG4gICAgdGhpcy5fbGFuZyA9IG51bGw7XG4gIH1cblxuICBiaW5kZWRUbyhjb2Rld2F2ZSkge31cblxuICBcbiAgdGV4dCh2YWwpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dENoYXJBdChwb3MpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dExlbigpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dFN1YnN0cihzdGFydCwgZW5kKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGluc2VydFRleHRBdCh0ZXh0LCBwb3MpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGdldEN1cnNvclBvcygpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQgPSBudWxsKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGJlZ2luVW5kb0FjdGlvbigpIHt9XG5cbiAgXG4gIGVuZFVuZG9BY3Rpb24oKSB7fVxuXG4gIFxuICBnZXRMYW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICB9XG5cbiAgc2V0TGFuZyh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFuZyA9IHZhbDtcbiAgfVxuXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdCgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFsbG93TXVsdGlTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2V0TXVsdGlTZWwoc2VsZWN0aW9ucykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRNdWx0aVNlbCgpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0TGluZUF0KHBvcykge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMuZmluZExpbmVTdGFydChwb3MpLCB0aGlzLmZpbmRMaW5lRW5kKHBvcykpO1xuICB9XG5cbiAgZmluZExpbmVTdGFydChwb3MpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtcIlxcblwiXSwgLTEpO1xuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3MgKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICBmaW5kTGluZUVuZChwb3MpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtcIlxcblwiLCBcIlxcclwiXSk7XG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dExlbigpO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgdmFyIGJlc3RQb3MsIGJlc3RTdHIsIGksIGxlbiwgcG9zLCBzdHJpLCB0ZXh0O1xuICAgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0LCB0aGlzLnRleHRMZW4oKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoMCwgc3RhcnQpO1xuICAgIH1cbiAgICBiZXN0UG9zID0gbnVsbDtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzdHJpbmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzdHJpID0gc3RyaW5nc1tpXTtcbiAgICAgIHBvcyA9IGRpcmVjdGlvbiA+IDAgPyB0ZXh0LmluZGV4T2Yoc3RyaSkgOiB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpO1xuICAgICAgaWYgKHBvcyAhPT0gLTEpIHtcbiAgICAgICAgaWYgKChiZXN0UG9zID09IG51bGwpIHx8IGJlc3RQb3MgKiBkaXJlY3Rpb24gPiBwb3MgKiBkaXJlY3Rpb24pIHtcbiAgICAgICAgICBiZXN0UG9zID0gcG9zO1xuICAgICAgICAgIGJlc3RTdHIgPSBzdHJpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChiZXN0U3RyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3RyUG9zKChkaXJlY3Rpb24gPiAwID8gYmVzdFBvcyArIHN0YXJ0IDogYmVzdFBvcyksIGJlc3RTdHIpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cykge1xuICAgIHJldHVybiByZXBsYWNlbWVudHMucmVkdWNlKChwcm9taXNlLCByZXBsKSA9PiB7XG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKChvcHQpID0+IHtcbiAgICAgICAgcmVwbC53aXRoRWRpdG9yKHRoaXMpO1xuICAgICAgICByZXBsLmFwcGx5T2Zmc2V0KG9wdC5vZmZzZXQpO1xuICAgICAgICByZXR1cm4gb3B0aW9uYWxQcm9taXNlKHJlcGwuYXBwbHkoKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnM6IG9wdC5zZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpLFxuICAgICAgICAgICAgb2Zmc2V0OiBvcHQub2Zmc2V0ICsgcmVwbC5vZmZzZXRBZnRlcih0aGlzKVxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSwgb3B0aW9uYWxQcm9taXNlKHtcbiAgICAgIHNlbGVjdGlvbnM6IFtdLFxuICAgICAgb2Zmc2V0OiAwXG4gICAgfSkpLnRoZW4oKG9wdCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKG9wdC5zZWxlY3Rpb25zKTtcbiAgICB9KS5yZXN1bHQoKTtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhzZWxlY3Rpb25zKSB7XG4gICAgaWYgKHNlbGVjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHRoaXMuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldE11bHRpU2VsKHNlbGVjdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q3Vyc29yUG9zKHNlbGVjdGlvbnNbMF0uc3RhcnQsIHNlbGVjdGlvbnNbMF0uZW5kKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBMb2dnZXJcbiAgQGVuYWJsZWQgPSB0cnVlXG4gIGxvZzogKGFyZ3MuLi4pIC0+XG4gICAgaWYgQGlzRW5hYmxlZCgpXG4gICAgICBmb3IgbXNnIGluIGFyZ3NcbiAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICBpc0VuYWJsZWQ6IC0+XG4gICAgY29uc29sZT8ubG9nPyBhbmQgdGhpcy5lbmFibGVkIGFuZCBMb2dnZXIuZW5hYmxlZFxuICBlbmFibGVkOiB0cnVlXG4gIHJ1bnRpbWU6IChmdW5jdCxuYW1lID0gXCJmdW5jdGlvblwiKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGNvbnNvbGUubG9nKFwiI3tuYW1lfSB0b29rICN7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLlwiKVxuICAgIHJlc1xuICBtb25pdG9yRGF0YToge31cbiAgdG9Nb25pdG9yOiAob2JqLG5hbWUscHJlZml4PScnKSAtPlxuICAgIGZ1bmN0ID0gb2JqW25hbWVdXG4gICAgb2JqW25hbWVdID0gLT4gXG4gICAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgICB0aGlzLm1vbml0b3IoKC0+IGZ1bmN0LmFwcGx5KG9iaixhcmdzKSkscHJlZml4K25hbWUpXG4gIG1vbml0b3I6IChmdW5jdCxuYW1lKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGlmIHRoaXMubW9uaXRvckRhdGFbbmFtZV0/XG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLmNvdW50KytcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwrPSB0MSAtIHQwXG4gICAgZWxzZVxuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgY291bnQ6IDFcbiAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgIH1cbiAgICByZXNcbiAgcmVzdW1lOiAtPlxuICAgIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpXG4iLCJleHBvcnQgdmFyIExvZ2dlciA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgTG9nZ2VyIHtcbiAgICBsb2coLi4uYXJncykge1xuICAgICAgdmFyIGksIGxlbiwgbXNnLCByZXN1bHRzO1xuICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbXNnID0gYXJnc1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY29uc29sZS5sb2cobXNnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgcmV0dXJuICgodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZSAhPT0gbnVsbCA/IGNvbnNvbGUubG9nIDogdm9pZCAwKSAhPSBudWxsKSAmJiB0aGlzLmVuYWJsZWQgJiYgTG9nZ2VyLmVuYWJsZWQ7XG4gICAgfVxuXG4gICAgcnVudGltZShmdW5jdCwgbmFtZSA9IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgY29uc29sZS5sb2coYCR7bmFtZX0gdG9vayAke3QxIC0gdDB9IG1pbGxpc2Vjb25kcy5gKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgdG9Nb25pdG9yKG9iaiwgbmFtZSwgcHJlZml4ID0gJycpIHtcbiAgICAgIHZhciBmdW5jdDtcbiAgICAgIGZ1bmN0ID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIG9ialtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgcmV0dXJuIHRoaXMubW9uaXRvcigoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0LmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgIH0pLCBwcmVmaXggKyBuYW1lKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgbW9uaXRvcihmdW5jdCwgbmFtZSkge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgaWYgKHRoaXMubW9uaXRvckRhdGFbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLmNvdW50Kys7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwgKz0gdDEgLSB0MDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0gPSB7XG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgcmVzdW1lKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpO1xuICAgIH1cblxuICB9O1xuXG4gIExvZ2dlci5lbmFibGVkID0gdHJ1ZTtcblxuICBMb2dnZXIucHJvdG90eXBlLmVuYWJsZWQgPSB0cnVlO1xuXG4gIExvZ2dlci5wcm90b3R5cGUubW9uaXRvckRhdGEgPSB7fTtcblxuICByZXR1cm4gTG9nZ2VyO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiZXhwb3J0IGNsYXNzIE9wdGlvbk9iamVjdFxuICBzZXRPcHRzOiAob3B0aW9ucyxkZWZhdWx0cyktPlxuICAgIEBkZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgQHNldE9wdChrZXksb3B0aW9uc1trZXldKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0T3B0KGtleSx2YWwpXG4gICAgICAgIFxuICBzZXRPcHQ6IChrZXksIHZhbCktPlxuICAgIGlmIHRoaXNba2V5XT8uY2FsbD9cbiAgICAgIHRoaXNba2V5XSh2YWwpXG4gICAgZWxzZVxuICAgICAgdGhpc1trZXldPSB2YWxcbiAgICAgICAgXG4gIGdldE9wdDogKGtleSktPlxuICAgIGlmIHRoaXNba2V5XT8uY2FsbD9cbiAgICAgIHJldHVybiB0aGlzW2tleV0oKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0aGlzW2tleV1cbiAgXG4gIGdldE9wdHM6IC0+XG4gICAgb3B0cyA9IHt9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgb3B0c1trZXldID0gQGdldE9wdChrZXkpXG4gICAgcmV0dXJuIG9wdHMiLCJleHBvcnQgdmFyIE9wdGlvbk9iamVjdCA9IGNsYXNzIE9wdGlvbk9iamVjdCB7XG4gIHNldE9wdHMob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIga2V5LCByZWYsIHJlc3VsdHMsIHZhbDtcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCBvcHRpb25zW2tleV0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIHZhbCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIHNldE9wdChrZXksIHZhbCkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0odmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBnZXRPcHQoa2V5KSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdHMoKSB7XG4gICAgdmFyIGtleSwgb3B0cywgcmVmLCB2YWw7XG4gICAgb3B0cyA9IHt9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIG9wdHNba2V5XSA9IHRoaXMuZ2V0T3B0KGtleSk7XG4gICAgfVxuICAgIHJldHVybiBvcHRzO1xuICB9XG5cbn07XG4iLCJcbmV4cG9ydCBjbGFzcyBQYXJhbVBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEBwYXJhbVN0cmluZywgQG9wdGlvbnM9e30pIC0+XG4gICAgQHBhcnNlKClcblxuICBwYXJzZTogLT5cbiAgICBAcGFyYW1zID0gW11cbiAgICBAbmFtZWQgPSB7fVxuICAgIGlmIEBwYXJhbVN0cmluZy5sZW5ndGhcbiAgICAgIGFsbG93ZWROYW1lZCA9IEBvcHRpb25zLmFsbG93ZWROYW1lZFxuICAgICAgaW5TdHIgPSBmYWxzZVxuICAgICAgcGFyYW0gPSAnJ1xuICAgICAgbmFtZSA9IGZhbHNlXG4gICAgICBmb3IgaSBpbiBbMC4uKEBwYXJhbVN0cmluZy5sZW5ndGgtMSldXG4gICAgICAgIGNociA9IEBwYXJhbVN0cmluZ1tpXVxuICAgICAgICBpZiBjaHIgPT0gJyAnIGFuZCAhaW5TdHJcbiAgICAgICAgICBpZihuYW1lKVxuICAgICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGFyYW1zLnB1c2gocGFyYW0pXG4gICAgICAgICAgcGFyYW0gPSAnJ1xuICAgICAgICAgIG5hbWUgPSBmYWxzZVxuICAgICAgICBlbHNlIGlmIGNociBpbiBbJ1wiJyxcIidcIl0gYW5kIChpID09IDAgb3IgQHBhcmFtU3RyaW5nW2ktMV0gIT0gJ1xcXFwnKVxuICAgICAgICAgIGluU3RyID0gIWluU3RyXG4gICAgICAgIGVsc2UgaWYgY2hyID09ICc6JyBhbmQgIW5hbWUgYW5kICFpblN0ciBhbmQgKCFhbGxvd2VkTmFtZWQ/IG9yIHBhcmFtIGluIGFsbG93ZWROYW1lZClcbiAgICAgICAgICBuYW1lID0gcGFyYW1cbiAgICAgICAgICBwYXJhbSA9ICcnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwYXJhbSArPSBjaHJcbiAgICAgIGlmIHBhcmFtLmxlbmd0aFxuICAgICAgICBpZihuYW1lKVxuICAgICAgICAgIEBuYW1lZFtuYW1lXSA9IHBhcmFtXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcGFyYW1zLnB1c2gocGFyYW0pXG4iLCJ2YXIgaW5kZXhPZiA9IFtdLmluZGV4T2Y7XG5cbmV4cG9ydCB2YXIgUGFyYW1QYXJzZXIgPSBjbGFzcyBQYXJhbVBhcnNlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtU3RyaW5nLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnBhcmFtU3RyaW5nID0gcGFyYW1TdHJpbmc7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnBhcnNlKCk7XG4gIH1cblxuICBwYXJzZSgpIHtcbiAgICB2YXIgYWxsb3dlZE5hbWVkLCBjaHIsIGksIGluU3RyLCBqLCBuYW1lLCBwYXJhbSwgcmVmO1xuICAgIHRoaXMucGFyYW1zID0gW107XG4gICAgdGhpcy5uYW1lZCA9IHt9O1xuICAgIGlmICh0aGlzLnBhcmFtU3RyaW5nLmxlbmd0aCkge1xuICAgICAgYWxsb3dlZE5hbWVkID0gdGhpcy5vcHRpb25zLmFsbG93ZWROYW1lZDtcbiAgICAgIGluU3RyID0gZmFsc2U7XG4gICAgICBwYXJhbSA9ICcnO1xuICAgICAgbmFtZSA9IGZhbHNlO1xuICAgICAgZm9yIChpID0gaiA9IDAsIHJlZiA9IHRoaXMucGFyYW1TdHJpbmcubGVuZ3RoIC0gMTsgKDAgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGkgPSAwIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgICBjaHIgPSB0aGlzLnBhcmFtU3RyaW5nW2ldO1xuICAgICAgICBpZiAoY2hyID09PSAnICcgJiYgIWluU3RyKSB7XG4gICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZWRbbmFtZV0gPSBwYXJhbTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMucHVzaChwYXJhbSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmFtID0gJyc7XG4gICAgICAgICAgbmFtZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKChjaHIgPT09ICdcIicgfHwgY2hyID09PSBcIidcIikgJiYgKGkgPT09IDAgfHwgdGhpcy5wYXJhbVN0cmluZ1tpIC0gMV0gIT09ICdcXFxcJykpIHtcbiAgICAgICAgICBpblN0ciA9ICFpblN0cjtcbiAgICAgICAgfSBlbHNlIGlmIChjaHIgPT09ICc6JyAmJiAhbmFtZSAmJiAhaW5TdHIgJiYgKChhbGxvd2VkTmFtZWQgPT0gbnVsbCkgfHwgaW5kZXhPZi5jYWxsKGFsbG93ZWROYW1lZCwgcGFyYW0pID49IDApKSB7XG4gICAgICAgICAgbmFtZSA9IHBhcmFtO1xuICAgICAgICAgIHBhcmFtID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyYW0gKz0gY2hyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocGFyYW0ubGVuZ3RoKSB7XG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSBwYXJhbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXMucHVzaChwYXJhbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuL0JveEhlbHBlcic7XG5pbXBvcnQgeyBQYXJhbVBhcnNlciB9IGZyb20gJy4vUGFyYW1QYXJzZXInO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgU3RyUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcbmltcG9ydCB7IG9wdGlvbmFsUHJvbWlzZSB9IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsQHBvcyxAc3RyKSAtPlxuICAgIHN1cGVyKClcbiAgICB1bmxlc3MgQGlzRW1wdHkoKVxuICAgICAgQF9jaGVja0Nsb3NlcigpXG4gICAgICBAb3BlbmluZyA9IEBzdHJcbiAgICAgIEBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICAgIEBfc3BsaXRDb21wb25lbnRzKClcbiAgICAgIEBfZmluZENsb3NpbmcoKVxuICAgICAgQF9jaGVja0Vsb25nYXRlZCgpXG4gIF9jaGVja0Nsb3NlcjogLT5cbiAgICBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICBpZiBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5jbG9zZUNoYXIgYW5kIGYgPSBAX2ZpbmRPcGVuaW5nUG9zKClcbiAgICAgIEBjbG9zaW5nUG9zID0gbmV3IFN0clBvcyhAcG9zLCBAc3RyKVxuICAgICAgQHBvcyA9IGYucG9zXG4gICAgICBAc3RyID0gZi5zdHJcbiAgX2ZpbmRPcGVuaW5nUG9zOiAtPlxuICAgIGNtZE5hbWUgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cikuc3Vic3RyaW5nKEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKVxuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWVcbiAgICBjbG9zaW5nID0gQHN0clxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zLG9wZW5pbmcsY2xvc2luZywtMSlcbiAgICAgIGYuc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcytmLnN0ci5sZW5ndGgpK0Bjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgICAgIHJldHVybiBmXG4gIF9zcGxpdENvbXBvbmVudHM6IC0+XG4gICAgcGFydHMgPSBAbm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICBAY21kTmFtZSA9IHBhcnRzLnNoaWZ0KClcbiAgICBAcmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIilcbiAgX3BhcnNlUGFyYW1zOihwYXJhbXMpIC0+XG4gICAgcGFyc2VyID0gbmV3IFBhcmFtUGFyc2VyKHBhcmFtcywge1xuICAgICAgYWxsb3dlZE5hbWVkOiBAZ2V0T3B0aW9uKCdhbGxvd2VkTmFtZWQnKVxuICAgIH0pXG4gICAgQHBhcmFtcyA9IHBhcnNlci5wYXJhbXNcbiAgICBAbmFtZWQgPSBPYmplY3QuYXNzaWduKEBnZXREZWZhdWx0cygpLCBwYXJzZXIubmFtZWQpXG4gICAgaWYgQGNtZD9cbiAgICAgIG5hbWVUb1BhcmFtID0gQGdldE9wdGlvbignbmFtZVRvUGFyYW0nKVxuICAgICAgaWYgbmFtZVRvUGFyYW0/IFxuICAgICAgICBAbmFtZWRbbmFtZVRvUGFyYW1dID0gQGNtZE5hbWVcbiAgX2ZpbmRDbG9zaW5nOiAtPlxuICAgIGlmIGYgPSBAX2ZpbmRDbG9zaW5nUG9zKClcbiAgICAgIEBjb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUoQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MrQHN0ci5sZW5ndGgsZi5wb3MpKVxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGYucG9zK2Yuc3RyLmxlbmd0aClcbiAgX2ZpbmRDbG9zaW5nUG9zOiAtPlxuICAgIHJldHVybiBAY2xvc2luZ1BvcyBpZiBAY2xvc2luZ1Bvcz9cbiAgICBjbG9zaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZE5hbWUgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjbWROYW1lXG4gICAgaWYgZiA9IEBjb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKEBwb3MrQHN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpXG4gICAgICByZXR1cm4gQGNsb3NpbmdQb3MgPSBmXG4gIF9jaGVja0Vsb25nYXRlZDogLT5cbiAgICBlbmRQb3MgPSBAZ2V0RW5kUG9zKClcbiAgICBtYXggPSBAY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKVxuICAgIHdoaWxlIGVuZFBvcyA8IG1heCBhbmQgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyxlbmRQb3MrQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PSBAY29kZXdhdmUuZGVjb1xuICAgICAgZW5kUG9zKz1AY29kZXdhdmUuZGVjby5sZW5ndGhcbiAgICBpZiBlbmRQb3MgPj0gbWF4IG9yIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIEBjb2Rld2F2ZS5kZWNvLmxlbmd0aCkgaW4gWycgJyxcIlxcblwiLFwiXFxyXCJdXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICBfY2hlY2tCb3g6IC0+XG4gICAgaWYgQGNvZGV3YXZlLmluSW5zdGFuY2U/IGFuZCBAY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PSAnY29tbWVudCdcbiAgICAgIHJldHVyblxuICAgIGNsID0gQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KClcbiAgICBjciA9IEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKVxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKSArIGNyLmxlbmd0aFxuICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zIC0gY2wubGVuZ3RoLEBwb3MpID09IGNsIGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLGVuZFBvcykgPT0gY3JcbiAgICAgIEBwb3MgPSBAcG9zIC0gY2wubGVuZ3RoXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICAgICAgQF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICAgIGVsc2UgaWYgQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgYW5kIEBnZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xXG4gICAgICBAaW5Cb3ggPSAxXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQ6IC0+XG4gICAgaWYgQGNvbnRlbnRcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29kZXdhdmUuZGVjbylcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86I3tlZH0pKyN7ZWNyfSRcIiwgXCJnbVwiKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChcIl5cXFxccyooPzoje2VkfSkqI3tlY3J9XFxyP1xcblwiKVxuICAgICAgcmUzID0gbmV3IFJlZ0V4cChcIlxcblxcXFxzKiN7ZWNsfSg/OiN7ZWR9KSpcXFxccyokXCIpXG4gICAgICBAY29udGVudCA9IEBjb250ZW50LnJlcGxhY2UocmUxLCckMScpLnJlcGxhY2UocmUyLCcnKS5yZXBsYWNlKHJlMywnJylcbiAgX2dldFBhcmVudENtZHM6IC0+XG4gICAgQHBhcmVudCA9IEBjb2Rld2F2ZS5nZXRFbmNsb3NpbmdDbWQoQGdldEVuZFBvcygpKT8uaW5pdCgpXG4gIHNldE11bHRpUG9zOiAobXVsdGlQb3MpIC0+XG4gICAgQG11bHRpUG9zID0gbXVsdGlQb3NcbiAgX2dldENtZE9iajogLT5cbiAgICBAZ2V0Q21kKClcbiAgICBAX2NoZWNrQm94KClcbiAgICBAY29udGVudCA9IEByZW1vdmVJbmRlbnRGcm9tQ29udGVudChAY29udGVudClcbiAgICBzdXBlcigpXG4gIF9pbml0UGFyYW1zOiAtPlxuICAgIEBfcGFyc2VQYXJhbXMoQHJhd1BhcmFtcylcbiAgZ2V0Q29udGV4dDogLT5cbiAgICByZXR1cm4gQGNvbnRleHQgb3IgQGNvZGV3YXZlLmNvbnRleHRcbiAgZ2V0Q21kOiAtPlxuICAgIHVubGVzcyBAY21kP1xuICAgICAgQF9nZXRQYXJlbnRDbWRzKClcbiAgICAgIGlmIEBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIubGVuZ3RoKSA9PSBAY29kZXdhdmUubm9FeGVjdXRlQ2hhclxuICAgICAgICBAY21kID0gQ29tbWFuZC5jbWRzLmdldENtZCgnY29yZTpub19leGVjdXRlJylcbiAgICAgICAgQGNvbnRleHQgPSBAY29kZXdhdmUuY29udGV4dFxuICAgICAgZWxzZVxuICAgICAgICBAZmluZGVyID0gQGdldEZpbmRlcihAY21kTmFtZSlcbiAgICAgICAgQGNvbnRleHQgPSBAZmluZGVyLmNvbnRleHRcbiAgICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgICAgIGlmIEBjbWQ/XG4gICAgICAgICAgQGNvbnRleHQuYWRkTmFtZVNwYWNlKEBjbWQuZnVsbE5hbWUpXG4gICAgcmV0dXJuIEBjbWRcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBjb2Rld2F2ZS5jb250ZXh0LmdldEZpbmRlcihjbWROYW1lLG5hbWVzcGFjZXM6QF9nZXRQYXJlbnROYW1lc3BhY2VzKCkpXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgX2dldFBhcmVudE5hbWVzcGFjZXM6IC0+XG4gICAgbnNwY3MgPSBbXVxuICAgIG9iaiA9IHRoaXNcbiAgICB3aGlsZSBvYmoucGFyZW50P1xuICAgICAgb2JqID0gb2JqLnBhcmVudFxuICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKSBpZiBvYmouY21kPyBhbmQgb2JqLmNtZC5mdWxsTmFtZT9cbiAgICByZXR1cm4gbnNwY3NcbiAgX3JlbW92ZUJyYWNrZXQ6IChzdHIpLT5cbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyhAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgsc3RyLmxlbmd0aC1AY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQoQGNtZE5hbWUpXG4gICAgcmV0dXJuIGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJyxjbWROYW1lKVxuICBpc0VtcHR5OiAtPlxuICAgIHJldHVybiBAc3RyID09IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjb2Rld2F2ZS5icmFrZXRzIG9yIEBzdHIgPT0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuYnJha2V0c1xuICBleGVjdXRlOiAtPlxuICAgIGlmIEBpc0VtcHR5KClcbiAgICAgIGlmIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXA/IGFuZCBAY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKEBwb3MgKyBAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpP1xuICAgICAgICBAY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpXG4gICAgICBlbHNlXG4gICAgICAgIEByZXBsYWNlV2l0aCgnJylcbiAgICBlbHNlIGlmIEBjbWQ/XG4gICAgICBpZiBiZWZvcmVGdW5jdCA9IEBnZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKVxuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKVxuICAgICAgaWYgQHJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgICAgb3B0aW9uYWxQcm9taXNlKEByZXN1bHQoKSkudGhlbiAocmVzKT0+XG4gICAgICAgICAgaWYgcmVzP1xuICAgICAgICAgICAgQHJlcGxhY2VXaXRoKHJlcylcbiAgICAgICAgLnJlc3VsdCgpXG4gICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIEBydW5FeGVjdXRlRnVuY3QoKVxuICBnZXRFbmRQb3M6IC0+XG4gICAgcmV0dXJuIEBwb3MrQHN0ci5sZW5ndGhcbiAgZ2V0UG9zOiAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBwb3MsQHBvcytAc3RyLmxlbmd0aCkud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICBnZXRPcGVuaW5nUG9zOiAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBwb3MsQHBvcytAb3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHVubGVzcyBAaW5kZW50TGVuP1xuICAgICAgaWYgQGluQm94P1xuICAgICAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgICAgICBAaW5kZW50TGVuID0gaGVscGVyLnJlbW92ZUNvbW1lbnQoQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGhcbiAgICAgIGVsc2VcbiAgICAgICAgQGluZGVudExlbiA9IEBwb3MgLSBAZ2V0UG9zKCkucHJldkVPTCgpXG4gICAgcmV0dXJuIEBpbmRlbnRMZW5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQ6ICh0ZXh0KSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKCdeXFxcXHN7JytAZ2V0SW5kZW50KCkrJ30nLCdnbScpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywnJylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBhbHRlclJlc3VsdEZvckJveDogKHJlcGwpIC0+XG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKVxuICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGNvbnRleHQpXG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksZmFsc2UpXG4gICAgaWYgQGdldE9wdGlvbigncmVwbGFjZUJveCcpXG4gICAgICBib3ggPSBoZWxwZXIuZ2V0Qm94Rm9yUG9zKG9yaWdpbmFsKVxuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdXG4gICAgICBAaW5kZW50TGVuID0gaGVscGVyLmluZGVudFxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBlbHNlXG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgICAgcmVwbC5zdGFydCA9IG9yaWdpbmFsLnByZXZFT0woKVxuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKClcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgQGNvZGV3YXZlLm1hcmtlciArIHJlcGwudGV4dCArIEBjb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge211bHRpbGluZTpmYWxzZX0pXG4gICAgICBbcmVwbC5wcmVmaXgscmVwbC50ZXh0LHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdChAY29kZXdhdmUubWFya2VyKVxuICAgIHJldHVybiByZXBsXG4gIGdldEN1cnNvckZyb21SZXN1bHQ6IChyZXBsKSAtPlxuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KClcbiAgICBpZiBAY21kPyBhbmQgQGNvZGV3YXZlLmNoZWNrQ2FycmV0IGFuZCBAZ2V0T3B0aW9uKCdjaGVja0NhcnJldCcpXG4gICAgICBpZiAocCA9IEBjb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSk/IFxuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0K3JlcGwucHJlZml4Lmxlbmd0aCtwXG4gICAgICByZXBsLnRleHQgPSBAY29kZXdhdmUucmVtb3ZlQ2FycmV0KHJlcGwudGV4dClcbiAgICByZXR1cm4gY3Vyc29yUG9zXG4gIGNoZWNrTXVsdGk6IChyZXBsKSAtPlxuICAgIGlmIEBtdWx0aVBvcz8gYW5kIEBtdWx0aVBvcy5sZW5ndGggPiAxXG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF1cbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KClcbiAgICAgIGZvciBwb3MsIGkgaW4gQG11bHRpUG9zXG4gICAgICAgIGlmIGkgPT0gMFxuICAgICAgICAgIG9yaWdpbmFsUG9zID0gcG9zLnN0YXJ0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0LW9yaWdpbmFsUG9zKVxuICAgICAgICAgIGlmIG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT0gb3JpZ2luYWxUZXh0XG4gICAgICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXdSZXBsKVxuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50c1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBbcmVwbF1cbiAgcmVwbGFjZVdpdGg6ICh0ZXh0KSAtPlxuICAgIEBhcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChAcG9zLEBnZXRFbmRQb3MoKSx0ZXh0KSlcbiAgYXBwbHlSZXBsYWNlbWVudDogKHJlcGwpIC0+XG4gICAgcmVwbC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gICAgaWYgQGluQm94P1xuICAgICAgQGFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBjdXJzb3JQb3MgPSBAZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKVxuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKGN1cnNvclBvcywgY3Vyc29yUG9zKV1cbiAgICByZXBsYWNlbWVudHMgPSBAY2hlY2tNdWx0aShyZXBsKVxuICAgIEByZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0XG4gICAgQHJlcGxhY2VFbmQgPSByZXBsLnJlc0VuZCgpXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gICAgIiwiaW1wb3J0IHtcbiAgQ21kSW5zdGFuY2Vcbn0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5cbmltcG9ydCB7XG4gIEJveEhlbHBlclxufSBmcm9tICcuL0JveEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhcmFtUGFyc2VyXG59IGZyb20gJy4vUGFyYW1QYXJzZXInO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5pbXBvcnQge1xuICBTdHJQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBOYW1lc3BhY2VIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgb3B0aW9uYWxQcm9taXNlXG59IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgdmFyIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSA9IGNsYXNzIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSBleHRlbmRzIENtZEluc3RhbmNlIHtcbiAgY29uc3RydWN0b3IoY29kZXdhdmUsIHBvczEsIHN0cjEpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTtcbiAgICB0aGlzLnBvcyA9IHBvczE7XG4gICAgdGhpcy5zdHIgPSBzdHIxO1xuICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHRoaXMuX2NoZWNrQ2xvc2VyKCk7XG4gICAgICB0aGlzLm9wZW5pbmcgPSB0aGlzLnN0cjtcbiAgICAgIHRoaXMubm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cik7XG4gICAgICB0aGlzLl9zcGxpdENvbXBvbmVudHMoKTtcbiAgICAgIHRoaXMuX2ZpbmRDbG9zaW5nKCk7XG4gICAgICB0aGlzLl9jaGVja0Vsb25nYXRlZCgpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Nsb3NlcigpIHtcbiAgICB2YXIgZiwgbm9CcmFja2V0O1xuICAgIG5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpO1xuICAgIGlmIChub0JyYWNrZXQuc3Vic3RyaW5nKDAsIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICYmIChmID0gdGhpcy5fZmluZE9wZW5pbmdQb3MoKSkpIHtcbiAgICAgIHRoaXMuY2xvc2luZ1BvcyA9IG5ldyBTdHJQb3ModGhpcy5wb3MsIHRoaXMuc3RyKTtcbiAgICAgIHRoaXMucG9zID0gZi5wb3M7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSBmLnN0cjtcbiAgICB9XG4gIH1cblxuICBfZmluZE9wZW5pbmdQb3MoKSB7XG4gICAgdmFyIGNsb3NpbmcsIGNtZE5hbWUsIGYsIG9wZW5pbmc7XG4gICAgY21kTmFtZSA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpO1xuICAgIG9wZW5pbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyBjbWROYW1lO1xuICAgIGNsb3NpbmcgPSB0aGlzLnN0cjtcbiAgICBpZiAoZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcywgb3BlbmluZywgY2xvc2luZywgLTEpKSB7XG4gICAgICBmLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZi5wb3MsIHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoZi5wb3MgKyBmLnN0ci5sZW5ndGgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk7XG4gICAgICByZXR1cm4gZjtcbiAgICB9XG4gIH1cblxuICBfc3BsaXRDb21wb25lbnRzKCkge1xuICAgIHZhciBwYXJ0cztcbiAgICBwYXJ0cyA9IHRoaXMubm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICB0aGlzLmNtZE5hbWUgPSBwYXJ0cy5zaGlmdCgpO1xuICAgIHJldHVybiB0aGlzLnJhd1BhcmFtcyA9IHBhcnRzLmpvaW4oXCIgXCIpO1xuICB9XG5cbiAgX3BhcnNlUGFyYW1zKHBhcmFtcykge1xuICAgIHZhciBuYW1lVG9QYXJhbSwgcGFyc2VyO1xuICAgIHBhcnNlciA9IG5ldyBQYXJhbVBhcnNlcihwYXJhbXMsIHtcbiAgICAgIGFsbG93ZWROYW1lZDogdGhpcy5nZXRPcHRpb24oJ2FsbG93ZWROYW1lZCcpXG4gICAgfSk7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJzZXIucGFyYW1zO1xuICAgIHRoaXMubmFtZWQgPSBPYmplY3QuYXNzaWduKHRoaXMuZ2V0RGVmYXVsdHMoKSwgcGFyc2VyLm5hbWVkKTtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgbmFtZVRvUGFyYW0gPSB0aGlzLmdldE9wdGlvbignbmFtZVRvUGFyYW0nKTtcbiAgICAgIGlmIChuYW1lVG9QYXJhbSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVkW25hbWVUb1BhcmFtXSA9IHRoaXMuY21kTmFtZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmcoKSB7XG4gICAgdmFyIGY7XG4gICAgaWYgKGYgPSB0aGlzLl9maW5kQ2xvc2luZ1BvcygpKSB7XG4gICAgICB0aGlzLmNvbnRlbnQgPSBTdHJpbmdIZWxwZXIudHJpbUVtcHR5TGluZSh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBmLnBvcykpO1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZi5wb3MgKyBmLnN0ci5sZW5ndGgpO1xuICAgIH1cbiAgfVxuXG4gIF9maW5kQ2xvc2luZ1BvcygpIHtcbiAgICB2YXIgY2xvc2luZywgZiwgb3BlbmluZztcbiAgICBpZiAodGhpcy5jbG9zaW5nUG9zICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3M7XG4gICAgfVxuICAgIGNsb3NpbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY21kTmFtZSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWROYW1lO1xuICAgIGlmIChmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBvcGVuaW5nLCBjbG9zaW5nKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1BvcyA9IGY7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrRWxvbmdhdGVkKCkge1xuICAgIHZhciBlbmRQb3MsIG1heCwgcmVmO1xuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCk7XG4gICAgbWF4ID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpO1xuICAgIHdoaWxlIChlbmRQb3MgPCBtYXggJiYgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmRlY28pIHtcbiAgICAgIGVuZFBvcyArPSB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoO1xuICAgIH1cbiAgICBpZiAoZW5kUG9zID49IG1heCB8fCAoKHJlZiA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSkgPT09ICcgJyB8fCByZWYgPT09IFwiXFxuXCIgfHwgcmVmID09PSBcIlxcclwiKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKTtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tCb3goKSB7XG4gICAgdmFyIGNsLCBjciwgZW5kUG9zO1xuICAgIGlmICgodGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpICYmIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PT0gJ2NvbW1lbnQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsID0gdGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCgpO1xuICAgIGNyID0gdGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKTtcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpICsgY3IubGVuZ3RoO1xuICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zIC0gY2wubGVuZ3RoLCB0aGlzLnBvcykgPT09IGNsICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLCBlbmRQb3MpID09PSBjcikge1xuICAgICAgdGhpcy5wb3MgPSB0aGlzLnBvcyAtIGNsLmxlbmd0aDtcbiAgICAgIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKTtcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkuaW5kZXhPZihjbCkgPiAtMSAmJiB0aGlzLmdldFBvcygpLnNhbWVMaW5lc1N1ZmZpeCgpLmluZGV4T2YoY3IpID4gLTEpIHtcbiAgICAgIHRoaXMuaW5Cb3ggPSAxO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKSB7XG4gICAgdmFyIGVjbCwgZWNyLCBlZCwgcmUxLCByZTIsIHJlMztcbiAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29kZXdhdmUuZGVjbyk7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86JHtlZH0pKyR7ZWNyfSRgLCBcImdtXCIpO1xuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXlxcXFxzKig/OiR7ZWR9KSoke2Vjcn1cXHI/XFxuYCk7XG4gICAgICByZTMgPSBuZXcgUmVnRXhwKGBcXG5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHMqJGApO1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudC5yZXBsYWNlKHJlMSwgJyQxJykucmVwbGFjZShyZTIsICcnKS5yZXBsYWNlKHJlMywgJycpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRQYXJlbnRDbWRzKCkge1xuICAgIHZhciByZWY7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID0gKHJlZiA9IHRoaXMuY29kZXdhdmUuZ2V0RW5jbG9zaW5nQ21kKHRoaXMuZ2V0RW5kUG9zKCkpKSAhPSBudWxsID8gcmVmLmluaXQoKSA6IHZvaWQgMDtcbiAgfVxuXG4gIHNldE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlQb3MgPSBtdWx0aVBvcztcbiAgfVxuXG4gIF9nZXRDbWRPYmooKSB7XG4gICAgdGhpcy5nZXRDbWQoKTtcbiAgICB0aGlzLl9jaGVja0JveCgpO1xuICAgIHRoaXMuY29udGVudCA9IHRoaXMucmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGhpcy5jb250ZW50KTtcbiAgICByZXR1cm4gc3VwZXIuX2dldENtZE9iaigpO1xuICB9XG5cbiAgX2luaXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlUGFyYW1zKHRoaXMucmF3UGFyYW1zKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCB0aGlzLmNvZGV3YXZlLmNvbnRleHQ7XG4gIH1cblxuICBnZXRDbWQoKSB7XG4gICAgaWYgKHRoaXMuY21kID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2dldFBhcmVudENtZHMoKTtcbiAgICAgIGlmICh0aGlzLm5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikge1xuICAgICAgICB0aGlzLmNtZCA9IENvbW1hbmQuY21kcy5nZXRDbWQoJ2NvcmU6bm9fZXhlY3V0ZScpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSk7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZmluZGVyLmNvbnRleHQ7XG4gICAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpO1xuICAgICAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5jbWQuZnVsbE5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNtZDtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pO1xuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXM7XG4gICAgcmV0dXJuIGZpbmRlcjtcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzKCkge1xuICAgIHZhciBuc3Bjcywgb2JqO1xuICAgIG5zcGNzID0gW107XG4gICAgb2JqID0gdGhpcztcbiAgICB3aGlsZSAob2JqLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICBvYmogPSBvYmoucGFyZW50O1xuICAgICAgaWYgKChvYmouY21kICE9IG51bGwpICYmIChvYmouY21kLmZ1bGxOYW1lICE9IG51bGwpKSB7XG4gICAgICAgIG5zcGNzLnB1c2gob2JqLmNtZC5mdWxsTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuc3BjcztcbiAgfVxuXG4gIF9yZW1vdmVCcmFja2V0KHN0cikge1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgsIHN0ci5sZW5ndGggLSB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKTtcbiAgfVxuXG4gIGFsdGVyQWxpYXNPZihhbGlhc09mKSB7XG4gICAgdmFyIGNtZE5hbWUsIG5zcGM7XG4gICAgW25zcGMsIGNtZE5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0KHRoaXMuY21kTmFtZSk7XG4gICAgcmV0dXJuIGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJywgY21kTmFtZSk7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgfHwgdGhpcy5zdHIgPT09IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGJlZm9yZUZ1bmN0O1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgaWYgKCh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCAhPSBudWxsKSAmJiAodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAud2hpdGhpbk9wZW5Cb3VuZHModGhpcy5wb3MgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKSAhPSBudWxsKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAuY2FuY2VsKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aCgnJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAoYmVmb3JlRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpKSB7XG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucmVzdWx0SXNBdmFpbGFibGUoKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9uYWxQcm9taXNlKHRoaXMucmVzdWx0KCkpLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgocmVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnJlc3VsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRXhlY3V0ZUZ1bmN0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RW5kUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aDtcbiAgfVxuXG4gIGdldFBvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICB9XG5cbiAgZ2V0T3BlbmluZ1BvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLm9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcbiAgfVxuXG4gIGdldEluZGVudCgpIHtcbiAgICB2YXIgaGVscGVyO1xuICAgIGlmICh0aGlzLmluZGVudExlbiA9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5pbkJveCAhPSBudWxsKSB7XG4gICAgICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0KTtcbiAgICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIucmVtb3ZlQ29tbWVudCh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IHRoaXMucG9zIC0gdGhpcy5nZXRQb3MoKS5wcmV2RU9MKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluZGVudExlbjtcbiAgfVxuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50KHRleHQpIHtcbiAgICB2YXIgcmVnO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoJ15cXFxcc3snICsgdGhpcy5nZXRJbmRlbnQoKSArICd9JywgJ2dtJyk7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhbHRlclJlc3VsdEZvckJveChyZXBsKSB7XG4gICAgdmFyIGJveCwgaGVscGVyLCBvcmlnaW5hbCwgcmVzO1xuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KCk7XG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLCBmYWxzZSk7XG4gICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCdyZXBsYWNlQm94JykpIHtcbiAgICAgIGJveCA9IGhlbHBlci5nZXRCb3hGb3JQb3Mob3JpZ2luYWwpO1xuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdO1xuICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIuaW5kZW50O1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgICByZXBsLnN0YXJ0ID0gb3JpZ2luYWwucHJldkVPTCgpO1xuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKCk7XG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIHRoaXMuY29kZXdhdmUubWFya2VyICsgcmVwbC50ZXh0ICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge1xuICAgICAgICBtdWx0aWxpbmU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIFtyZXBsLnByZWZpeCwgcmVwbC50ZXh0LCByZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQodGhpcy5jb2Rld2F2ZS5tYXJrZXIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVwbDtcbiAgfVxuXG4gIGdldEN1cnNvckZyb21SZXN1bHQocmVwbCkge1xuICAgIHZhciBjdXJzb3JQb3MsIHA7XG4gICAgY3Vyc29yUG9zID0gcmVwbC5yZXNQb3NCZWZvcmVQcmVmaXgoKTtcbiAgICBpZiAoKHRoaXMuY21kICE9IG51bGwpICYmIHRoaXMuY29kZXdhdmUuY2hlY2tDYXJyZXQgJiYgdGhpcy5nZXRPcHRpb24oJ2NoZWNrQ2FycmV0JykpIHtcbiAgICAgIGlmICgocCA9IHRoaXMuY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCArIHJlcGwucHJlZml4Lmxlbmd0aCArIHA7XG4gICAgICB9XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gY3Vyc29yUG9zO1xuICB9XG5cbiAgY2hlY2tNdWx0aShyZXBsKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV3UmVwbCwgb3JpZ2luYWxQb3MsIG9yaWdpbmFsVGV4dCwgcG9zLCByZWYsIHJlcGxhY2VtZW50cztcbiAgICBpZiAoKHRoaXMubXVsdGlQb3MgIT0gbnVsbCkgJiYgdGhpcy5tdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF07XG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpO1xuICAgICAgcmVmID0gdGhpcy5tdWx0aVBvcztcbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgIHBvcyA9IHJlZltpXTtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0IC0gb3JpZ2luYWxQb3MpO1xuICAgICAgICAgIGlmIChuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09PSBvcmlnaW5hbFRleHQpIHtcbiAgICAgICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ld1JlcGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtyZXBsXTtcbiAgICB9XG4gIH1cblxuICByZXBsYWNlV2l0aCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQodGhpcy5wb3MsIHRoaXMuZ2V0RW5kUG9zKCksIHRleHQpKTtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnQocmVwbCkge1xuICAgIHZhciBjdXJzb3JQb3MsIHJlcGxhY2VtZW50cztcbiAgICByZXBsLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYWx0ZXJSZXN1bHRGb3JCb3gocmVwbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICB9XG4gICAgY3Vyc29yUG9zID0gdGhpcy5nZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpO1xuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKGN1cnNvclBvcywgY3Vyc29yUG9zKV07XG4gICAgcmVwbGFjZW1lbnRzID0gdGhpcy5jaGVja011bHRpKHJlcGwpO1xuICAgIHRoaXMucmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydDtcbiAgICB0aGlzLnJlcGxhY2VFbmQgPSByZXBsLnJlc0VuZCgpO1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUHJvY2Vzc1xuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAjIiwiXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcic7XG5cbmV4cG9ydCBjbGFzcyBTdG9yYWdlXG4gIGNvbnN0cnVjdG9yOiAoQGVuZ2luZSkgLT5cblxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBpZiBAZW5naW5lQXZhaWxhYmxlKClcbiAgICAgIEBlbmdpbmUuc2F2ZShrZXksdmFsKVxuXG4gIHNhdmVJblBhdGg6IChwYXRoLCBrZXksIHZhbCkgLT5cbiAgICBpZiBAZW5naW5lQXZhaWxhYmxlKClcbiAgICAgIEBlbmdpbmUuc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbClcblxuICBsb2FkOiAoa2V5KSAtPlxuICAgIGlmIEBlbmdpbmU/XG4gICAgICBAZW5naW5lLmxvYWQoa2V5KVxuXG4gIGVuZ2luZUF2YWlsYWJsZTogKCkgLT5cbiAgICBpZiBAZW5naW5lP1xuICAgICAgdHJ1ZVxuICAgIGVsc2VcbiAgICAgIEBsb2dnZXIgPSBAbG9nZ2VyIHx8IG5ldyBMb2dnZXIoKVxuICAgICAgQGxvZ2dlci5sb2coJ05vIHN0b3JhZ2UgZW5naW5lIGF2YWlsYWJsZScpXG4gICAgICBmYWxzZVxuICAgICIsImltcG9ydCB7XG4gIExvZ2dlclxufSBmcm9tICcuL0xvZ2dlcic7XG5cbmV4cG9ydCB2YXIgU3RvcmFnZSA9IGNsYXNzIFN0b3JhZ2Uge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgfVxuXG4gIHNhdmUoa2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmUoa2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuXG4gIGxvYWQoa2V5KSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5sb2FkKGtleSk7XG4gICAgfVxuICB9XG5cbiAgZW5naW5lQXZhaWxhYmxlKCkge1xuICAgIGlmICh0aGlzLmVuZ2luZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dnZXIgPSB0aGlzLmxvZ2dlciB8fCBuZXcgTG9nZ2VyKCk7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ05vIHN0b3JhZ2UgZW5naW5lIGF2YWlsYWJsZScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBEb21LZXlMaXN0ZW5lclxuICBzdGFydExpc3RlbmluZzogKHRhcmdldCkgLT5cbiAgXG4gICAgdGltZW91dCA9IG51bGxcbiAgICBcbiAgICBvbmtleWRvd24gPSAoZSkgPT4gXG4gICAgICBpZiAoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgb3IgQG9iaiA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSBhbmQgZS5rZXlDb2RlID09IDY5ICYmIGUuY3RybEtleVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgQG9uQWN0aXZhdGlvbktleT9cbiAgICAgICAgICBAb25BY3RpdmF0aW9uS2V5KClcbiAgICBvbmtleXVwID0gKGUpID0+IFxuICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICBAb25BbnlDaGFuZ2UoZSlcbiAgICBvbmtleXByZXNzID0gKGUpID0+IFxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpIGlmIHRpbWVvdXQ/XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCAoPT5cbiAgICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgICAgKSwgMTAwXG4gICAgICAgICAgICBcbiAgICBpZiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lclxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgb25rZXlwcmVzcylcbiAgICBlbHNlIGlmIHRhcmdldC5hdHRhY2hFdmVudFxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcylcblxuaXNFbGVtZW50ID0gKG9iaikgLT5cbiAgdHJ5XG4gICAgIyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICBjYXRjaCBlXG4gICAgIyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgIyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgIyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG4gICAgcmV0dXJuICh0eXBlb2Ygb2JqPT1cIm9iamVjdFwiKSAmJlxuICAgICAgKG9iai5ub2RlVHlwZT09MSkgJiYgKHR5cGVvZiBvYmouc3R5bGUgPT0gXCJvYmplY3RcIikgJiZcbiAgICAgICh0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT1cIm9iamVjdFwiKVxuXG4gICAgICAgIFxuZXhwb3J0IGNsYXNzIFRleHRBcmVhRWRpdG9yIGV4dGVuZHMgVGV4dFBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEB0YXJnZXQpIC0+XG4gICAgc3VwZXIoKVxuICAgIEBvYmogPSBpZiBpc0VsZW1lbnQoQHRhcmdldCkgdGhlbiBAdGFyZ2V0IGVsc2UgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQHRhcmdldClcbiAgICB1bmxlc3MgQG9iaj9cbiAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCJcbiAgICBAbmFtZXNwYWNlID0gJ3RleHRhcmVhJ1xuICAgIEBjaGFuZ2VMaXN0ZW5lcnMgPSBbXVxuICAgIEBfc2tpcENoYW5nZUV2ZW50ID0gMFxuICBzdGFydExpc3RlbmluZzogRG9tS2V5TGlzdGVuZXIucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nXG4gIG9uQW55Q2hhbmdlOiAoZSkgLT5cbiAgICBpZiBAX3NraXBDaGFuZ2VFdmVudCA8PSAwXG4gICAgICBmb3IgY2FsbGJhY2sgaW4gQGNoYW5nZUxpc3RlbmVyc1xuICAgICAgICBjYWxsYmFjaygpXG4gICAgZWxzZVxuICAgICAgQF9za2lwQ2hhbmdlRXZlbnQtLVxuICAgICAgQG9uU2tpcGVkQ2hhbmdlKCkgaWYgQG9uU2tpcGVkQ2hhbmdlP1xuICBza2lwQ2hhbmdlRXZlbnQ6IChuYiA9IDEpIC0+XG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgKz0gbmJcbiAgYmluZGVkVG86IChjb2Rld2F2ZSkgLT5cbiAgICBAb25BY3RpdmF0aW9uS2V5ID0gLT4gY29kZXdhdmUub25BY3RpdmF0aW9uS2V5KClcbiAgICBAc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpXG4gIHNlbGVjdGlvblByb3BFeGlzdHM6IC0+XG4gICAgXCJzZWxlY3Rpb25TdGFydFwiIG9mIEBvYmpcbiAgaGFzRm9jdXM6IC0+IFxuICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaXMgQG9ialxuICB0ZXh0OiAodmFsKSAtPlxuICAgIGlmIHZhbD9cbiAgICAgIHVubGVzcyBAdGV4dEV2ZW50Q2hhbmdlKHZhbClcbiAgICAgICAgQG9iai52YWx1ZSA9IHZhbFxuICAgIEBvYmoudmFsdWVcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCwgZW5kKSBvciBAc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSBvciBzdXBlcihzdGFydCwgZW5kLCB0ZXh0KVxuICB0ZXh0RXZlbnRDaGFuZ2U6ICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIC0+XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50JykgaWYgZG9jdW1lbnQuY3JlYXRlRXZlbnQ/XG4gICAgaWYgZXZlbnQ/IGFuZCBldmVudC5pbml0VGV4dEV2ZW50PyBhbmQgZXZlbnQuaXNUcnVzdGVkICE9IGZhbHNlXG4gICAgICBlbmQgPSBAdGV4dExlbigpIHVubGVzcyBlbmQ/XG4gICAgICBpZiB0ZXh0Lmxlbmd0aCA8IDFcbiAgICAgICAgaWYgc3RhcnQgIT0gMFxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihzdGFydC0xLHN0YXJ0KVxuICAgICAgICAgIHN0YXJ0LS1cbiAgICAgICAgZWxzZSBpZiBlbmQgIT0gQHRleHRMZW4oKVxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihlbmQsZW5kKzEpXG4gICAgICAgICAgZW5kKytcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSlcbiAgICAgICMgQHNldEN1cnNvclBvcyhzdGFydCxlbmQpXG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBAb2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgICBAc2tpcENoYW5nZUV2ZW50KClcbiAgICAgIHRydWVcbiAgICBlbHNlIFxuICAgICAgZmFsc2VcbiAgc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZDogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBpZiBkb2N1bWVudC5leGVjQ29tbWFuZD9cbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpO1xuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuXG4gIGdldEN1cnNvclBvczogLT5cbiAgICByZXR1cm4gQHRtcEN1cnNvclBvcyBpZiBAdG1wQ3Vyc29yUG9zP1xuICAgIGlmIEBoYXNGb2N1c1xuICAgICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgICAgbmV3IFBvcyhAb2JqLnNlbGVjdGlvblN0YXJ0LEBvYmouc2VsZWN0aW9uRW5kKVxuICAgICAgZWxzZVxuICAgICAgICBAZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKVxuICBnZXRDdXJzb3JQb3NGYWxsYmFjazogLT5cbiAgICBpZiBAb2JqLmNyZWF0ZVRleHRSYW5nZVxuICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKClcbiAgICAgIGlmIHNlbC5wYXJlbnRFbGVtZW50KCkgaXMgQG9ialxuICAgICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayBzZWwuZ2V0Qm9va21hcmsoKVxuICAgICAgICBsZW4gPSAwXG5cbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgbGVuKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcm5nLnNldEVuZFBvaW50IFwiU3RhcnRUb1N0YXJ0XCIsIEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcG9zID0gbmV3IFBvcygwLGxlbilcbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgcG9zLnN0YXJ0KytcbiAgICAgICAgICBwb3MuZW5kKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcmV0dXJuIHBvc1xuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kKSAtPlxuICAgIGVuZCA9IHN0YXJ0IGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgIEB0bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIHNldFRpbWVvdXQgKD0+XG4gICAgICAgIEB0bXBDdXJzb3JQb3MgPSBudWxsXG4gICAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgKSwgMVxuICAgIGVsc2UgXG4gICAgICBAc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZClcbiAgICByZXR1cm5cbiAgc2V0Q3Vyc29yUG9zRmFsbGJhY2s6IChzdGFydCwgZW5kKSAtPlxuICAgIGlmIEBvYmouY3JlYXRlVGV4dFJhbmdlXG4gICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICBybmcubW92ZVN0YXJ0IFwiY2hhcmFjdGVyXCIsIHN0YXJ0XG4gICAgICBybmcuY29sbGFwc2UoKVxuICAgICAgcm5nLm1vdmVFbmQgXCJjaGFyYWN0ZXJcIiwgZW5kIC0gc3RhcnRcbiAgICAgIHJuZy5zZWxlY3QoKVxuICBnZXRMYW5nOiAtPlxuICAgIHJldHVybiBAX2xhbmcgaWYgQF9sYW5nXG4gICAgQG9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpIGlmIEBvYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKVxuICBzZXRMYW5nOiAodmFsKSAtPlxuICAgIEBfbGFuZyA9IHZhbFxuICAgIEBvYmouc2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnLHZhbClcbiAgY2FuTGlzdGVuVG9DaGFuZ2U6IC0+XG4gICAgcmV0dXJuIHRydWVcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBAY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgaWYgKGkgPSBAY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xXG4gICAgICBAY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpLCAxKVxuICAgICAgXG4gICAgICBcbiAgYXBwbHlSZXBsYWNlbWVudHM6IChyZXBsYWNlbWVudHMpIC0+XG4gICAgaWYgcmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgYW5kIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDFcbiAgICAgIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zID0gW0BnZXRDdXJzb3JQb3MoKV1cbiAgICBzdXBlcihyZXBsYWNlbWVudHMpO1xuICAgICAgIiwidmFyIGlzRWxlbWVudDtcblxuaW1wb3J0IHtcbiAgVGV4dFBhcnNlclxufSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5leHBvcnQgdmFyIERvbUtleUxpc3RlbmVyID0gY2xhc3MgRG9tS2V5TGlzdGVuZXIge1xuICBzdGFydExpc3RlbmluZyh0YXJnZXQpIHtcbiAgICB2YXIgb25rZXlkb3duLCBvbmtleXByZXNzLCBvbmtleXVwLCB0aW1lb3V0O1xuICAgIHRpbWVvdXQgPSBudWxsO1xuICAgIG9ua2V5ZG93biA9IChlKSA9PiB7XG4gICAgICBpZiAoKENvZGV3YXZlLmluc3RhbmNlcy5sZW5ndGggPCAyIHx8IHRoaXMub2JqID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSAmJiBlLmtleUNvZGUgPT09IDY5ICYmIGUuY3RybEtleSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLm9uQWN0aXZhdGlvbktleSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BY3RpdmF0aW9uS2V5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIG9ua2V5dXAgPSAoZSkgPT4ge1xuICAgICAgaWYgKHRoaXMub25BbnlDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkFueUNoYW5nZShlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIG9ua2V5cHJlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYgKHRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGltZW91dCA9IHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMub25BbnlDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQW55Q2hhbmdlKGUpO1xuICAgICAgICB9XG4gICAgICB9KSwgMTAwKTtcbiAgICB9O1xuICAgIGlmICh0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9ua2V5ZG93bik7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9ua2V5dXApO1xuICAgICAgcmV0dXJuIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgb25rZXlwcmVzcyk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuYXR0YWNoRXZlbnQpIHtcbiAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBvbmtleWRvd24pO1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXl1cFwiLCBvbmtleXVwKTtcbiAgICAgIHJldHVybiB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXByZXNzXCIsIG9ua2V5cHJlc3MpO1xuICAgIH1cbiAgfVxuXG59O1xuXG5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGU7XG4gIHRyeSB7XG4gICAgLy8gVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb20pXG4gICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICAvLyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgLy8gYW4gZXhjZXB0aW9uIGlzIHRocm93biBhbmQgd2UgZW5kIHVwIGhlcmUuIFRlc3Rpbmcgc29tZVxuICAgIC8vIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcbiAgICByZXR1cm4gKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpICYmIChvYmoubm9kZVR5cGUgPT09IDEpICYmICh0eXBlb2Ygb2JqLnN0eWxlID09PSBcIm9iamVjdFwiKSAmJiAodHlwZW9mIG9iai5vd25lckRvY3VtZW50ID09PSBcIm9iamVjdFwiKTtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBUZXh0QXJlYUVkaXRvciA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQxKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQxO1xuICAgICAgdGhpcy5vYmogPSBpc0VsZW1lbnQodGhpcy50YXJnZXQpID8gdGhpcy50YXJnZXQgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldCk7XG4gICAgICBpZiAodGhpcy5vYmogPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBcIlRleHRBcmVhIG5vdCBmb3VuZFwiO1xuICAgICAgfVxuICAgICAgdGhpcy5uYW1lc3BhY2UgPSAndGV4dGFyZWEnO1xuICAgICAgdGhpcy5jaGFuZ2VMaXN0ZW5lcnMgPSBbXTtcbiAgICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudCA9IDA7XG4gICAgfVxuXG4gICAgb25BbnlDaGFuZ2UoZSkge1xuICAgICAgdmFyIGNhbGxiYWNrLCBqLCBsZW4xLCByZWYsIHJlc3VsdHM7XG4gICAgICBpZiAodGhpcy5fc2tpcENoYW5nZUV2ZW50IDw9IDApIHtcbiAgICAgICAgcmVmID0gdGhpcy5jaGFuZ2VMaXN0ZW5lcnM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZi5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBjYWxsYmFjayA9IHJlZltqXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY2FsbGJhY2soKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQtLTtcbiAgICAgICAgaWYgKHRoaXMub25Ta2lwZWRDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uU2tpcGVkQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBza2lwQ2hhbmdlRXZlbnQobmIgPSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2tpcENoYW5nZUV2ZW50ICs9IG5iO1xuICAgIH1cblxuICAgIGJpbmRlZFRvKGNvZGV3YXZlKSB7XG4gICAgICB0aGlzLm9uQWN0aXZhdGlvbktleSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29kZXdhdmUub25BY3RpdmF0aW9uS2V5KCk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpO1xuICAgIH1cblxuICAgIHNlbGVjdGlvblByb3BFeGlzdHMoKSB7XG4gICAgICByZXR1cm4gXCJzZWxlY3Rpb25TdGFydFwiIGluIHRoaXMub2JqO1xuICAgIH1cblxuICAgIGhhc0ZvY3VzKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMub2JqO1xuICAgIH1cblxuICAgIHRleHQodmFsKSB7XG4gICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHRFdmVudENoYW5nZSh2YWwpKSB7XG4gICAgICAgICAgdGhpcy5vYmoudmFsdWUgPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iai52YWx1ZTtcbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCwgZW5kKSB8fCB0aGlzLnNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQodGV4dCwgc3RhcnQsIGVuZCkgfHwgc3VwZXIuc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KTtcbiAgICB9XG5cbiAgICB0ZXh0RXZlbnRDaGFuZ2UodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSB7XG4gICAgICB2YXIgZXZlbnQ7XG4gICAgICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQgIT0gbnVsbCkge1xuICAgICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUZXh0RXZlbnQnKTtcbiAgICAgIH1cbiAgICAgIGlmICgoZXZlbnQgIT0gbnVsbCkgJiYgKGV2ZW50LmluaXRUZXh0RXZlbnQgIT0gbnVsbCkgJiYgZXZlbnQuaXNUcnVzdGVkICE9PSBmYWxzZSkge1xuICAgICAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgICAgICBlbmQgPSB0aGlzLnRleHRMZW4oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGV4dC5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgaWYgKHN0YXJ0ICE9PSAwKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0IC0gMSwgc3RhcnQpO1xuICAgICAgICAgICAgc3RhcnQtLTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVuZCAhPT0gdGhpcy50ZXh0TGVuKCkpIHtcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoZW5kLCBlbmQgKyAxKTtcbiAgICAgICAgICAgIGVuZCsrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGV2ZW50LmluaXRUZXh0RXZlbnQoJ3RleHRJbnB1dCcsIHRydWUsIHRydWUsIG51bGwsIHRleHQsIDkpO1xuICAgICAgICAvLyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICB0aGlzLm9iai5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgdGhpcy5za2lwQ2hhbmdlRXZlbnQoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIGlmIChkb2N1bWVudC5leGVjQ29tbWFuZCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZDtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEN1cnNvclBvcygpIHtcbiAgICAgIGlmICh0aGlzLnRtcEN1cnNvclBvcyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRtcEN1cnNvclBvcztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmhhc0ZvY3VzKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFBvcyh0aGlzLm9iai5zZWxlY3Rpb25TdGFydCwgdGhpcy5vYmouc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJzb3JQb3NGYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKSB7XG4gICAgICB2YXIgbGVuLCBwb3MsIHJuZywgc2VsO1xuICAgICAgaWYgKHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSkge1xuICAgICAgICBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgaWYgKHNlbC5wYXJlbnRFbGVtZW50KCkgPT09IHRoaXMub2JqKSB7XG4gICAgICAgICAgcm5nID0gdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgcm5nLm1vdmVUb0Jvb2ttYXJrKHNlbC5nZXRCb29rbWFyaygpKTtcbiAgICAgICAgICBsZW4gPSAwO1xuICAgICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIGxlbisrO1xuICAgICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBybmcuc2V0RW5kUG9pbnQoXCJTdGFydFRvU3RhcnRcIiwgdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKCkpO1xuICAgICAgICAgIHBvcyA9IG5ldyBQb3MoMCwgbGVuKTtcbiAgICAgICAgICB3aGlsZSAocm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwKSB7XG4gICAgICAgICAgICBwb3Muc3RhcnQrKztcbiAgICAgICAgICAgIHBvcy5lbmQrKztcbiAgICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25Qcm9wRXhpc3RzKSB7XG4gICAgICAgIHRoaXMudG1wQ3Vyc29yUG9zID0gbmV3IFBvcyhzdGFydCwgZW5kKTtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICBzZXRUaW1lb3V0KCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBudWxsO1xuICAgICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZDtcbiAgICAgICAgfSksIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKSB7XG4gICAgICB2YXIgcm5nO1xuICAgICAgaWYgKHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSkge1xuICAgICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgcm5nLm1vdmVTdGFydChcImNoYXJhY3RlclwiLCBzdGFydCk7XG4gICAgICAgIHJuZy5jb2xsYXBzZSgpO1xuICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCBlbmQgLSBzdGFydCk7XG4gICAgICAgIHJldHVybiBybmcuc2VsZWN0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGFuZygpIHtcbiAgICAgIGlmICh0aGlzLl9sYW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub2JqLmhhc0F0dHJpYnV0ZSgnZGF0YS1sYW5nJykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0TGFuZyh2YWwpIHtcbiAgICAgIHRoaXMuX2xhbmcgPSB2YWw7XG4gICAgICByZXR1cm4gdGhpcy5vYmouc2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnLCB2YWwpO1xuICAgIH1cblxuICAgIGNhbkxpc3RlblRvQ2hhbmdlKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYW5nZUxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgdmFyIGk7XG4gICAgICBpZiAoKGkgPSB0aGlzLmNoYW5nZUxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cykge1xuICAgICAgaWYgKHJlcGxhY2VtZW50cy5sZW5ndGggPiAwICYmIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbdGhpcy5nZXRDdXJzb3JQb3MoKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwZXIuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgICB9XG5cbiAgfTtcblxuICBUZXh0QXJlYUVkaXRvci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmcgPSBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmc7XG5cbiAgcmV0dXJuIFRleHRBcmVhRWRpdG9yO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSAnLi9FZGl0b3InO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5leHBvcnQgY2xhc3MgVGV4dFBhcnNlciBleHRlbmRzIEVkaXRvclxuICBjb25zdHJ1Y3RvcjogKEBfdGV4dCkgLT5cbiAgICBzdXBlcigpXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgQF90ZXh0ID0gdmFsIGlmIHZhbD9cbiAgICBAX3RleHRcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICByZXR1cm4gQHRleHQoKVtwb3NdXG4gIHRleHRMZW46IChwb3MpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KCkubGVuZ3RoXG4gIHRleHRTdWJzdHI6IChzdGFydCwgZW5kKSAtPlxuICAgIHJldHVybiBAdGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICBpbnNlcnRUZXh0QXQ6ICh0ZXh0LCBwb3MpIC0+XG4gICAgQHRleHQoQHRleHQoKS5zdWJzdHJpbmcoMCwgcG9zKSt0ZXh0K0B0ZXh0KCkuc3Vic3RyaW5nKHBvcyxAdGV4dCgpLmxlbmd0aCkpXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIEB0ZXh0KEB0ZXh0KCkuc2xpY2UoMCwgc3RhcnQpICsgKHRleHQgfHwgXCJcIikgKyBAdGV4dCgpLnNsaWNlKGVuZCkpXG4gIGdldEN1cnNvclBvczogLT5cbiAgICByZXR1cm4gQHRhcmdldFxuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kKSAtPlxuICAgIGVuZCA9IHN0YXJ0IGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgQHRhcmdldCA9IG5ldyBQb3MoIHN0YXJ0LCBlbmQgKSIsImltcG9ydCB7XG4gIEVkaXRvclxufSBmcm9tICcuL0VkaXRvcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCB2YXIgVGV4dFBhcnNlciA9IGNsYXNzIFRleHRQYXJzZXIgZXh0ZW5kcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcihfdGV4dCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fdGV4dCA9IF90ZXh0O1xuICB9XG5cbiAgdGV4dCh2YWwpIHtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHQgPSB2YWw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICB9XG5cbiAgdGV4dENoYXJBdChwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KClbcG9zXTtcbiAgfVxuXG4gIHRleHRMZW4ocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLmxlbmd0aDtcbiAgfVxuXG4gIHRleHRTdWJzdHIoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gIH1cblxuICBpbnNlcnRUZXh0QXQodGV4dCwgcG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zdWJzdHJpbmcoMCwgcG9zKSArIHRleHQgKyB0aGlzLnRleHQoKS5zdWJzdHJpbmcocG9zLCB0aGlzLnRleHQoKS5sZW5ndGgpKTtcbiAgfVxuXG4gIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLnRleHQodGhpcy50ZXh0KCkuc2xpY2UoMCwgc3RhcnQpICsgKHRleHQgfHwgXCJcIikgKyB0aGlzLnRleHQoKS5zbGljZShlbmQpKTtcbiAgfVxuXG4gIGdldEN1cnNvclBvcygpIHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXQ7XG4gIH1cblxuICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgZW5kID0gc3RhcnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRhcmdldCA9IG5ldyBQb3Moc3RhcnQsIGVuZCk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcbmltcG9ydCB7IENvcmVDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBKc0NvbW1hbmRQcm92aWRlciB9IGZyb20gJy4vY21kcy9Kc0NvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBQaHBDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyJztcbmltcG9ydCB7IEh0bWxDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBGaWxlQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0ZpbGVDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgV3JhcHBlZFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvV3JhcHBlZFBvcyc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VFbmdpbmUgfSBmcm9tICcuL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZSc7XG5cblBvcy53cmFwQ2xhc3MgPSBXcmFwcGVkUG9zXG5cbkNvZGV3YXZlLmluc3RhbmNlcyA9IFtdXG5cbkNvbW1hbmQucHJvdmlkZXJzID0gW1xuICBuZXcgQ29yZUNvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBQaHBDb21tYW5kUHJvdmlkZXIoKVxuICBuZXcgSHRtbENvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBGaWxlQ29tbWFuZFByb3ZpZGVyKClcbl1cblxuaWYgbG9jYWxTdG9yYWdlP1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlRW5naW5lKClcblxuZXhwb3J0IHsgQ29kZXdhdmUgfSIsImltcG9ydCB7XG4gIENvZGV3YXZlXG59IGZyb20gJy4vQ29kZXdhdmUnO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIENvcmVDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBKc0NvbW1hbmRQcm92aWRlclxufSBmcm9tICcuL2NtZHMvSnNDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBQaHBDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL1BocENvbW1hbmRQcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIEh0bWxDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBGaWxlQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9GaWxlQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgV3JhcHBlZFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MnO1xuXG5pbXBvcnQge1xuICBMb2NhbFN0b3JhZ2VFbmdpbmVcbn0gZnJvbSAnLi9zdG9yYWdlRW5naW5lcy9Mb2NhbFN0b3JhZ2VFbmdpbmUnO1xuXG5Qb3Mud3JhcENsYXNzID0gV3JhcHBlZFBvcztcblxuQ29kZXdhdmUuaW5zdGFuY2VzID0gW107XG5cbkNvbW1hbmQucHJvdmlkZXJzID0gW25ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpLCBuZXcgUGhwQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBGaWxlQ29tbWFuZFByb3ZpZGVyKCldO1xuXG5pZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZUVuZ2luZSgpO1xufVxuXG5leHBvcnQge1xuICBDb2Rld2F2ZVxufTtcbiIsIlxuaW1wb3J0IHsgQ29tbWFuZCwgQmFzZUNvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcbmltcG9ydCB7IExhbmdEZXRlY3RvciB9IGZyb20gJy4uL0RldGVjdG9yJztcbmltcG9ydCB7IEJveEhlbHBlciB9IGZyb20gJy4uL0JveEhlbHBlcic7XG5pbXBvcnQgeyBFZGl0Q21kUHJvcCB9IGZyb20gJy4uL0VkaXRDbWRQcm9wJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IFBhdGhIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1BhdGhIZWxwZXInO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCBjbGFzcyBDb3JlQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NvcmUnKSlcbiAgY29yZS5hZGREZXRlY3RvcihuZXcgTGFuZ0RldGVjdG9yKCkpXG4gIFxuICBjb3JlLmFkZENtZHMoe1xuICAgICdoZWxwJzp7XG4gICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgJ3Jlc3VsdCcgOiBoZWxwLFxuICAgICAgJ3BhcnNlJyA6IHRydWUsXG4gICAgICAnYWxsb3dlZE5hbWVkJyA6IFsnY21kJ10sXG4gICAgICAnaGVscCcgOiBcIlwiXCJcbiAgICAgICAgVG8gZ2V0IGhlbHAgb24gYSBwZWNpZmljIGNvbW1hbmQsIGRvIDpcbiAgICAgICAgfn5oZWxwIGhlbGxvfn4gKGhlbGxvIGJlaW5nIHRoZSBjb21tYW5kKVxuICAgICAgICBcIlwiXCIgXG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdvdmVydmlldyc6e1xuICAgICAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICAgIH5+cXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgICAgX19fICAgICAgICAgXyAgIF9fICAgICAgX19cbiAgICAgICAgICAgICAvIF9ffF9fXyAgX198IHxfX1xcXFwgXFxcXCAgICAvIC9fIF9fXyBfX19fX19cbiAgICAgICAgICAgIC8gL19fLyBfIFxcXFwvIF9gIC8gLV9cXFxcIFxcXFwvXFxcXC8gLyBfYCBcXFxcIFYgLyAtXy9cbiAgICAgICAgICAgIFxcXFxfX19fXFxcXF9fXy9cXFxcX18sX1xcXFxfX198XFxcXF8vXFxcXF8vXFxcXF9fLF98XFxcXF8vXFxcXF9fX3xcbiAgICAgICAgICAgIFRoZSB0ZXh0IGVkaXRvciBoZWxwZXJcbiAgICAgICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFdoZW4gdXNpbmcgQ29kZXdhdmUgeW91IHdpbGwgYmUgd3JpdGluZyBjb21tYW5kcyB3aXRoaW4gXG4gICAgICAgICAgICB5b3VyIHRleHQgZWRpdG9yLiBUaGVzZSBjb21tYW5kcyBtdXN0IGJlIHBsYWNlZCBiZXR3ZWVuIHR3byBcbiAgICAgICAgICAgIHBhaXJzIG9mIFwiflwiICh0aWxkZSkgYW5kIHRoZW4sIHRoZXkgY2FuIGJlIGV4ZWN1dGVkIGJ5IHByZXNzaW5nIFxuICAgICAgICAgICAgXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiLCB3aXRoIHlvdXIgY3Vyc29yIGluc2lkZSB0aGUgY29tbWFuZFxuICAgICAgICAgICAgRXg6IH5+IWhlbGxvfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgWW91IGRvbnQgbmVlZCB0byBhY3R1YWxseSB0eXBlIGFueSBcIn5cIiAodGlsZGUpLiBcbiAgICAgICAgICAgIFByZXNzaW5nIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiB3aWxsIGFkZCB0aGVtIGlmIHlvdSBhcmUgbm90IGFscmVhZHlcbiAgICAgICAgICAgIHdpdGhpbiBhIGNvbW1hbmQuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvZGV3YXZlIGRvZXMgbm90IHVzZSBVSSB0byBkaXNwbGF5IGFueSBpbmZvcm1hdGlvbi4gXG4gICAgICAgICAgICBJbnN0ZWFkLCBpdCB1c2VzIHRleHQgd2l0aGluIGNvZGUgY29tbWVudHMgdG8gbWltaWMgVUlzLiBcbiAgICAgICAgICAgIFRoZSBnZW5lcmF0ZWQgY29tbWVudCBibG9ja3Mgd2lsbCBiZSByZWZlcnJlZCB0byBhcyB3aW5kb3dzIFxuICAgICAgICAgICAgaW4gdGhlIGhlbHAgc2VjdGlvbnMuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFRvIGNsb3NlIHRoaXMgd2luZG93IChpLmUuIHJlbW92ZSB0aGlzIGNvbW1lbnQgYmxvY2spLCBwcmVzcyBcbiAgICAgICAgICAgIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiB3aXRoIHlvdXIgY3Vyc29yIG9uIHRoZSBsaW5lIGJlbGxvdy5cbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFVzZSB0aGUgZm9sbG93aW5nIGNvbW1hbmQgZm9yIGEgd2Fsa3Rocm91Z2ggb2Ygc29tZSBvZiB0aGUgbWFueVxuICAgICAgICAgICAgZmVhdHVyZXMgb2YgQ29kZXdhdmVcbiAgICAgICAgICAgIH5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiBvciB+fiFoZWxwOmRlbW9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBMaXN0IG9mIGFsbCBoZWxwIHN1YmplY3RzIFxuICAgICAgICAgICAgfn4haGVscDpzdWJqZWN0c35+IG9yIH5+IWhlbHA6c3Vifn4gXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+IWNsb3Nlfn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnc3ViamVjdHMnOntcbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICB+fiFoZWxwfn5cbiAgICAgICAgICAgIH5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiAofn4haGVscDpkZW1vfn4pXG4gICAgICAgICAgICB+fiFoZWxwOnN1YmplY3Rzfn4gKH5+IWhlbHA6c3Vifn4pXG4gICAgICAgICAgICB+fiFoZWxwOmVkaXRpbmd+fiAofn4haGVscDplZGl0fn4pXG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdzdWInOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOnN1YmplY3RzJ1xuICAgICAgICB9XG4gICAgICAgICdnZXRfc3RhcnRlZCc6e1xuICAgICAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICAgIFRoZSBjbGFzc2ljIEhlbGxvIFdvcmxkLlxuICAgICAgICAgICAgfn4haGVsbG98fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn5oZWxwOmVkaXRpbmc6aW50cm9+flxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBjcmVhdGluZyB5b3VyIG93biBjb21tYW5kcywgc2VlOlxuICAgICAgICAgICAgfn4haGVscDplZGl0aW5nfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29kZXdhdmUgY29tZXMgd2l0aCBtYW55IHByZS1leGlzdGluZyBjb21tYW5kcy4gSGVyZSBpcyBhbiBleGFtcGxlXG4gICAgICAgICAgICBvZiBKYXZhU2NyaXB0IGFiYnJldmlhdGlvbnNcbiAgICAgICAgICAgIH5+IWpzOmZ+flxuICAgICAgICAgICAgfn4hanM6aWZ+flxuICAgICAgICAgICAgICB+fiFqczpsb2d+flwifn4haGVsbG9+flwifn4hL2pzOmxvZ35+XG4gICAgICAgICAgICB+fiEvanM6aWZ+flxuICAgICAgICAgICAgfn4hL2pzOmZ+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXG4gICAgICAgICAgICBwcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxuICAgICAgICAgICAgdXNlZCBhdXRvbWF0aWNhbGx5IGlmIHlvdSBhcmUgaW4gYSBIVE1MIG9yIENTUyBmaWxlLlxuICAgICAgICAgICAgfn4hdWw+bGl+fiAoaWYgeW91IGFyZSBpbiBhIGh0bWwgZG9jY3VtZW50KVxuICAgICAgICAgICAgfn4hZW1tZXQgdWw+bGl+flxuICAgICAgICAgICAgfn4hZW1tZXQgbTIgY3Nzfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxuICAgICAgICAgICAgZGlmZmVyZW50IHJlc3VsdHMgZGVwZW5kaW5nIG9uIHRoZSBuYW1lc3BhY2UuXG4gICAgICAgICAgICB+fiFqczplYWNofn5cbiAgICAgICAgICAgIH5+IXBocDpvdXRlcjplYWNofn5cbiAgICAgICAgICAgIH5+IXBocDppbm5lcjplYWNofn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXG4gICAgICAgICAgICBmb2xsb3dpbmcgY29tbWFuZHMgYXJlIHRoZSBzYW1lIGFuZCB3aWxsIGRpc3BsYXkgdGhlIGN1cnJlbnRseVxuICAgICAgICAgICAgYWN0aXZlIG5hbWVzcGFjZS4gVGhlIGZpcnN0IGNvbW1hbmQgY29tbWFuZCB3b3JrcyBiZWNhdXNlIHRoZSBcbiAgICAgICAgICAgIGNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZX5+XG4gICAgICAgICAgICB+fiFjb3JlOm5hbWVzcGFjZX5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFlvdSBjYW4gbWFrZSBhIG5hbWVzcGFjZSBhY3RpdmUgd2l0aCB0aGUgZm9sbG93aW5nIGNvbW1hbmQuXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2UgcGhwfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ2hlY2sgdGhlIG5hbWVzcGFjZXMgYWdhaW5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZX5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEluIGFkZGl0aW9uIHRvIGRldGVjdGluZyB0aGUgZG9jdW1lbnQgdHlwZSwgQ29kZXdhdmUgY2FuIGRldGVjdCB0aGVcbiAgICAgICAgICAgIGNvbnRleHQgZnJvbSB0aGUgc3Vycm91bmRpbmcgdGV4dC4gSW4gYSBQSFAgZmlsZSwgaXQgbWVhbnMgQ29kZXdhdmUgXG4gICAgICAgICAgICB3aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fi9xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnZGVtbyc6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6Z2V0X3N0YXJ0ZWQnXG4gICAgICAgIH1cbiAgICAgICAgJ2VkaXRpbmcnOntcbiAgICAgICAgICAnY21kcycgOiB7XG4gICAgICAgICAgICAnaW50cm8nOntcbiAgICAgICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgICAgICBDb2Rld2F2ZSBhbGxvd3MgeW91IHRvIG1ha2UgeW91ciBvd24gY29tbWFuZHMgKG9yIGFiYnJldmlhdGlvbnMpIFxuICAgICAgICAgICAgICAgIHB1dCB5b3VyIGNvbnRlbnQgaW5zaWRlIFwic291cmNlXCIgdGhlIGRvIFwic2F2ZVwiLiBUcnkgYWRkaW5nIGFueSBcbiAgICAgICAgICAgICAgICB0ZXh0IHRoYXQgaXMgb24geW91ciBtaW5kLlxuICAgICAgICAgICAgICAgIH5+IWVkaXQgbXlfbmV3X2NvbW1hbmR8fn5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBJZiB5b3UgZGlkIHRoZSBsYXN0IHN0ZXAgcmlnaHQsIHlvdSBzaG91bGQgc2VlIHlvdXIgdGV4dCB3aGVuIHlvdVxuICAgICAgICAgICAgICAgIGRvIHRoZSBmb2xsb3dpbmcgY29tbWFuZC4gSXQgaXMgbm93IHNhdmVkIGFuZCB5b3UgY2FuIHVzZSBpdCBcbiAgICAgICAgICAgICAgICB3aGVuZXZlciB5b3Ugd2FudC5cbiAgICAgICAgICAgICAgICB+fiFteV9uZXdfY29tbWFuZH5+XG4gICAgICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICAgIH5+aGVscDplZGl0aW5nOmludHJvfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQWxsIHRoZSB3aW5kb3dzIG9mIENvZGV3YXZlIGFyZSBtYWRlIHdpdGggdGhlIGNvbW1hbmQgXCJib3hcIi4gXG4gICAgICAgICAgICBUaGV5IGFyZSBtZWFudCB0byBkaXNwbGF5IHRleHQgdGhhdCBzaG91bGQgbm90IHJlbWFpbiBpbiB5b3VyIGNvZGUuIFxuICAgICAgICAgICAgVGhleSBhcmUgdmFsaWQgY29tbWVudHMgc28gdGhleSB3b24ndCBicmVhayB5b3VyIGNvZGUgYW5kIHRoZSBjb21tYW5kIFxuICAgICAgICAgICAgXCJjbG9zZVwiIGNhbiBiZSB1c2VkIHRvIHJlbW92ZSB0aGVtIHJhcGlkbHkuIFlvdSBjYW4gbWFrZSB5b3VyIG93biBcbiAgICAgICAgICAgIGNvbW1hbmRzIHdpdGggdGhlbSBpZiB5b3UgbmVlZCB0byBkaXNwbGF5IHNvbWUgdGV4dCB0ZW1wb3JhcmlseS5cbiAgICAgICAgICAgIH5+IWJveH5+XG4gICAgICAgICAgICBUaGUgYm94IHdpbGwgc2NhbGUgd2l0aCB0aGUgY29udGVudCB5b3UgcHV0IGluIGl0XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4hL2JveH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+cXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIFdoZW4geW91IGNyZWF0ZSBhIGNvbW1hbmQsIHlvdSBtYXkgd2FudCB0byBzcGVjaWZ5IHdoZXJlIHRoZSBjdXJzb3IgXG4gICAgICAgICAgICB3aWxsIGJlIGxvY2F0ZWQgb25jZSB0aGUgY29tbWFuZCBpcyBleHBhbmRlZC4gVG8gZG8gdGhhdCwgdXNlIGEgXCJ8XCIgXG4gICAgICAgICAgICAoVmVydGljYWwgYmFyKS4gVXNlIDIgb2YgdGhlbSBpZiB5b3Ugd2FudCB0byBwcmludCB0aGUgYWN0dWFsIFxuICAgICAgICAgICAgY2hhcmFjdGVyLlxuICAgICAgICAgICAgfn4hYm94fn5cbiAgICAgICAgICAgIG9uZSA6IHwgXG4gICAgICAgICAgICB0d28gOiB8fFxuICAgICAgICAgICAgfn4hL2JveH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFlvdSBjYW4gYWxzbyB1c2UgdGhlIFwiZXNjYXBlX3BpcGVzXCIgY29tbWFuZCB0aGF0IHdpbGwgZXNjYXBlIGFueSBcbiAgICAgICAgICAgIHZlcnRpY2FsIGJhcnMgdGhhdCBhcmUgYmV0d2VlbiBpdHMgb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzXG4gICAgICAgICAgICB+fiFlc2NhcGVfcGlwZXN+flxuICAgICAgICAgICAgfFxuICAgICAgICAgICAgfn4hL2VzY2FwZV9waXBlc35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvbW1hbmRzIGluc2lkZSBvdGhlciBjb21tYW5kcyB3aWxsIGJlIGV4cGFuZGVkIGF1dG9tYXRpY2FsbHkuXG4gICAgICAgICAgICBJZiB5b3Ugd2FudCB0byBwcmludCBhIGNvbW1hbmQgd2l0aG91dCBoYXZpbmcgaXQgZXhwYW5kIHdoZW4gXG4gICAgICAgICAgICB0aGUgcGFyZW50IGNvbW1hbmQgaXMgZXhwYW5kZWQsIHVzZSBhIFwiIVwiIChleGNsYW1hdGlvbiBtYXJrKS5cbiAgICAgICAgICAgIH5+ISFoZWxsb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEZvciBjb21tYW5kcyB0aGF0IGhhdmUgYm90aCBhbiBvcGVuaW5nIGFuZCBhIGNsb3NpbmcgdGFnLCB5b3UgY2FuIHVzZVxuICAgICAgICAgICAgdGhlIFwiY29udGVudFwiIGNvbW1hbmQuIFwiY29udGVudFwiIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGV4dFxuICAgICAgICAgICAgdGhhdCBpcyBiZXR3ZWVuIHRoZSB0YWdzLiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgaG93IGl0IGNhbiBiZSB1c2VkLlxuICAgICAgICAgICAgfn4hZWRpdCBwaHA6aW5uZXI6aWZ+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fi9xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnZWRpdCc6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6ZWRpdGluZydcbiAgICAgICAgfVxuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICB9LFxuICAgICdub19leGVjdXRlJzp7XG4gICAgICAncmVzdWx0JyA6IG5vX2V4ZWN1dGVcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIFByZXZlbnQgZXZlcnl0aGluZyBpbnNpZGUgdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBmcm9tIGV4ZWN1dGluZ1xuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdlc2NhcGVfcGlwZXMnOntcbiAgICAgICdyZXN1bHQnIDogcXVvdGVfY2FycmV0LFxuICAgICAgJ2NoZWNrQ2FycmV0JyA6IGZhbHNlXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBFc2NhcGUgYWxsIGNhcnJldHMgKGZyb20gXCJ8XCIgdG8gXCJ8fFwiKVxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdxdW90ZV9jYXJyZXQnOntcbiAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXNjYXBlX3BpcGVzJ1xuICAgIH1cbiAgICAnZXhlY19wYXJlbnQnOntcbiAgICAgICdleGVjdXRlJyA6IGV4ZWNfcGFyZW50XG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBFeGVjdXRlIHRoZSBmaXJzdCBjb21tYW5kIHRoYXQgd3JhcCB0aGlzIGluIGl0J3Mgb3BlbiBhbmQgY2xvc2UgdGFnXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2NvbnRlbnQnOntcbiAgICAgICdyZXN1bHQnIDogZ2V0Q29udGVudFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgTWFpbmx5IHVzZWQgZm9yIGNvbW1hbmQgZWRpdGlvbiwgXG4gICAgICAgIHRoaXMgd2lsbCByZXR1cm4gd2hhdCB3YXMgYmV0d2VlbiB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIG9mIGEgY29tbWFuZFxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdib3gnOntcbiAgICAgICdjbHMnIDogQm94Q21kXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBDcmVhdGUgdGhlIGFwcGFyZW5jZSBvZiBhIGJveCBjb21wb3NlZCBmcm9tIGNoYXJhY3RlcnMuIFxuICAgICAgICBVc3VhbGx5IHdyYXBwZWQgaW4gYSBjb21tZW50LlxuXG4gICAgICAgIFRoZSBib3ggd2lsbCB0cnkgdG8gYWp1c3QgaXQncyBzaXplIGZyb20gdGhlIGNvbnRlbnRcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnY2xvc2UnOntcbiAgICAgICdjbHMnIDogQ2xvc2VDbWRcbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIFdpbGwgY2xvc2UgdGhlIGZpcnN0IGJveCBhcm91bmQgdGhpc1xuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdwYXJhbSc6e1xuICAgICAgJ3Jlc3VsdCcgOiBnZXRQYXJhbVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgTWFpbmx5IHVzZWQgZm9yIGNvbW1hbmQgZWRpdGlvbiwgXG4gICAgICAgIHRoaXMgd2lsbCByZXR1cm4gYSBwYXJhbWV0ZXIgZnJvbSB0aGlzIGNvbW1hbmQgY2FsbFxuXG4gICAgICAgIFlvdSBjYW4gcGFzcyBhIG51bWJlciwgYSBzdHJpbmcsIG9yIGJvdGguIFxuICAgICAgICBBIG51bWJlciBmb3IgYSBwb3NpdGlvbmVkIGFyZ3VtZW50IGFuZCBhIHN0cmluZ1xuICAgICAgICBmb3IgYSBuYW1lZCBwYXJhbWV0ZXJcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnZWRpdCc6e1xuICAgICAgJ2NtZHMnIDogRWRpdENtZC5zZXRDbWRzKHtcbiAgICAgICAgJ3NhdmUnOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmV4ZWNfcGFyZW50J1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgICdjbHMnIDogRWRpdENtZCxcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnY21kJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIEFsbG93cyB0byBlZGl0IGEgY29tbWFuZC4gXG4gICAgICAgIFNlZSB+fiFoZWxwOmVkaXRpbmd+fiBmb3IgYSBxdWljayB0dXRvcmlhbFxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdyZW5hbWUnOntcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ25vdF9hcHBsaWNhYmxlJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBZb3UgY2FuIG9ubHkgcmVuYW1lIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIixcbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgICAncmVzdWx0JyA6IHJlbmFtZUNvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZSxcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnZnJvbScsJ3RvJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIEFsbG93cyB0byByZW5hbWUgYSBjb21tYW5kIGFuZCBjaGFuZ2UgaXQncyBuYW1lc3BhY2UuIFxuICAgICAgICBZb3UgY2FuIG9ubHkgcmVuYW1lIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgIC0gVGhlIGZpcnN0IHBhcmFtIGlzIHRoZSBvbGQgbmFtZVxuICAgICAgICAtIFRoZW4gc2Vjb25kIHBhcmFtIGlzIHRoZSBuZXcgbmFtZSwgaWYgaXQgaGFzIG5vIG5hbWVzcGFjZSxcbiAgICAgICAgICBpdCB3aWxsIHVzZSB0aGUgb25lIGZyb20gdGhlIG9yaWdpbmFsIGNvbW1hbmQuXG5cbiAgICAgICAgZXguOiB+fiFyZW5hbWUgbXlfY29tbWFuZCBteV9jb21tYW5kMn5+XG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ3JlbW92ZSc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2FwcGxpY2FibGUnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIFlvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiLFxuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogcmVtb3ZlQ29tbWFuZCxcbiAgICAgICdwYXJzZScgOiB0cnVlXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2NtZCddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBBbGxvd3MgdG8gcmVtb3ZlIGEgY29tbWFuZC4gXG4gICAgICAgIFlvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnYWxpYXMnOntcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgICAncmVzdWx0JyA6IGFsaWFzQ29tbWFuZCxcbiAgICAgICdwYXJzZScgOiB0cnVlXG4gICAgfSxcbiAgICAnbmFtZXNwYWNlJzp7XG4gICAgICAnY2xzJyA6IE5hbWVTcGFjZUNtZFxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgU2hvdyB0aGUgY3VycmVudCBuYW1lc3BhY2VzLlxuXG4gICAgICAgIEEgbmFtZSBzcGFjZSBjb3VsZCBiZSB0aGUgbmFtZSBvZiB0aGUgbGFuZ3VhZ2VcbiAgICAgICAgb3Igb3RoZXIga2luZCBvZiBjb250ZXh0c1xuXG4gICAgICAgIElmIHlvdSBwYXNzIGEgcGFyYW0gdG8gdGhpcyBjb21tYW5kLCBpdCB3aWxsIFxuICAgICAgICBhZGQgdGhlIHBhcmFtIGFzIGEgbmFtZXNwYWNlIGZvciB0aGUgY3VycmVudCBlZGl0b3JcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnbnNwYyc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6bmFtZXNwYWNlJ1xuICAgIH0sXG4gICAgJ2xpc3QnOntcbiAgICAgICdyZXN1bHQnIDogbGlzdENvbW1hbmRcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnbmFtZScsJ2JveCcsJ2NvbnRleHQnXVxuICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICdwYXJzZScgOiB0cnVlXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBMaXN0IGF2YWlsYWJsZSBjb21tYW5kc1xuXG4gICAgICAgIFlvdSBjYW4gdXNlIHRoZSBmaXJzdCBhcmd1bWVudCB0byBjaG9vc2UgYSBzcGVjaWZpYyBuYW1lc3BhY2UsIFxuICAgICAgICBieSBkZWZhdWx0IGFsbCBjdXJlbnQgbmFtZXNwYWNlIHdpbGwgYmUgc2hvd25cbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnbHMnOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOmxpc3QnXG4gICAgfSxcbiAgICAnZ2V0Jzp7XG4gICAgICAncmVzdWx0JyA6IGdldENvbW1hbmRcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnbmFtZSddXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBvdXRwdXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICAnc2V0Jzp7XG4gICAgICAncmVzdWx0JyA6IHNldENvbW1hbmRcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnbmFtZScsJ3ZhbHVlJywndmFsJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHNldCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZVxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdzdG9yZV9qc29uJzp7XG4gICAgICAncmVzdWx0JyA6IHN0b3JlSnNvbkNvbW1hbmRcbiAgICAgICdhbGxvd2VkTmFtZWQnOlsnbmFtZScsJ2pzb24nXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgc2V0IGEgdmFyaWFibGUgd2l0aCBzb21lIGpzb24gZGF0YVxuICAgICAgICBcIlwiXCJcbiAgICB9LFxuICAgICdqc29uJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTpzdG9yZV9qc29uJ1xuICAgIH0sXG4gICAgJ3RlbXBsYXRlJzp7XG4gICAgICAnY2xzJyA6IFRlbXBsYXRlQ21kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ25hbWUnLCdzZXAnXVxuICAgICAgJ2hlbHAnOiBcIlwiXCJcbiAgICAgICAgcmVuZGVyIGEgdGVtcGxhdGUgZm9yIGEgdmFyaWFibGVcblxuICAgICAgICBJZiB0aGUgZmlyc3QgcGFyYW0gaXMgbm90IHNldCBpdCB3aWxsIHVzZSBhbGwgdmFyaWFibGVzIFxuICAgICAgICBmb3IgdGhlIHJlbmRlclxuICAgICAgICBJZiB0aGUgdmFyaWFibGUgaXMgYW4gYXJyYXkgdGhlIHRlbXBsYXRlIHdpbGwgYmUgcmVwZWF0ZWQgXG4gICAgICAgIGZvciBlYWNoIGl0ZW1zXG4gICAgICAgIFRoZSBgc2VwYCBwYXJhbSBkZWZpbmUgd2hhdCB3aWxsIHNlcGFyYXRlIGVhY2ggaXRlbSBcbiAgICAgICAgYW5kIGRlZmF1bHQgdG8gYSBsaW5lIGJyZWFrXG4gICAgICAgIFwiXCJcIlxuICAgIH0sXG4gICAgJ2VtbWV0Jzp7XG4gICAgICAnY2xzJyA6IEVtbWV0Q21kXG4gICAgICAnaGVscCc6IFwiXCJcIlxuICAgICAgICBDb2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXG4gICAgICAgIHByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLlxuXG4gICAgICAgIFBhc3MgdGhlIEVtbWV0IGFiYnJldmlhdGlvbiBhcyBhIHBhcmFtIHRvIGV4cGVuZCBpdC5cbiAgICAgICAgXCJcIlwiXG4gICAgfSxcbiAgICBcbiAgfSlcbiAgXG5oZWxwID0gKGluc3RhbmNlKSAtPlxuICBjbWROYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2NtZCddKVxuICBpZiBjbWROYW1lP1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKGNtZE5hbWUpXG4gICAgaWYgY21kP1xuICAgICAgaGVscENtZCA9IGNtZC5nZXRDbWQoJ2hlbHAnKVxuICAgICAgdGV4dCA9IGlmIGhlbHBDbWQgdGhlbiBcIn5+I3toZWxwQ21kLmZ1bGxOYW1lfX5+XCIgZWxzZSBcIlRoaXMgY29tbWFuZCBoYXMgbm8gaGVscCB0ZXh0XCJcbiAgICAgIHN1YmNvbW1hbmRzID0gaWYgY21kLmNtZHMubGVuZ3RoXG4gICAgICAgIFwiXCJcIlxuXG4gICAgICAgIFN1Yi1Db21tYW5kcyA6XG4gICAgICAgIH5+bHMgI3tjbWQuZnVsbE5hbWV9IGJveDpubyBjb250ZXh0Om5vfn5cbiAgICAgICAgXCJcIlwiXG4gICAgICBlbHNlIFxuICAgICAgICBcIlwiXG4gICAgICByZXR1cm4gXCJcIlwiXG4gICAgICAgIH5+Ym94fn5cbiAgICAgICAgSGVscCBmb3Igfn4hI3tjbWQuZnVsbE5hbWV9fn4gOlxuXG4gICAgICAgICN7dGV4dH1cbiAgICAgICAgI3tzdWJjb21tYW5kc31cblxuICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICB+fi9ib3h+flxuICAgICAgICBcIlwiXCJcbiAgICBlbHNlIFxuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG4gIGVsc2VcbiAgICByZXR1cm4gJ35+aGVscDpvdmVydmlld35+J1xuXG5ub19leGVjdXRlID0gKGluc3RhbmNlKSAtPlxuICByZWcgPSBuZXcgUmVnRXhwKFwiXihcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSlcbiAgcmV0dXJuIGluc3RhbmNlLnN0ci5yZXBsYWNlKHJlZywnJDEnKVxuICBcbnF1b3RlX2NhcnJldCA9IChpbnN0YW5jZSkgLT5cbiAgcmV0dXJuIGluc3RhbmNlLmNvbnRlbnQucmVwbGFjZSgvXFx8L2csICd8fCcpXG5leGVjX3BhcmVudCA9IChpbnN0YW5jZSkgLT5cbiAgaWYgaW5zdGFuY2UucGFyZW50P1xuICAgIHJlcyA9IGluc3RhbmNlLnBhcmVudC5leGVjdXRlKClcbiAgICBpbnN0YW5jZS5yZXBsYWNlU3RhcnQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZVN0YXJ0XG4gICAgaW5zdGFuY2UucmVwbGFjZUVuZCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlRW5kXG4gICAgcmV0dXJuIHJlc1xuZ2V0Q29udGVudCA9IChpbnN0YW5jZSkgLT5cbiAgYWZmaXhlc19lbXB0eSA9IGluc3RhbmNlLmdldFBhcmFtKFsnYWZmaXhlc19lbXB0eSddLGZhbHNlKVxuICBwcmVmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCcnKVxuICBzdWZmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCcnKVxuICBpZiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlP1xuICAgIHJldHVybiBwcmVmaXggKyAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5jb250ZW50IG9yICcnKSArIHN1ZmZpeFxuICBpZiBhZmZpeGVzX2VtcHR5XG4gICAgcmV0dXJuIHByZWZpeCArIHN1ZmZpeFxucmVuYW1lQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgIHN0b3JhZ2UgPSBDb21tYW5kLnN0b3JhZ2VcbiAgICBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAudGhlbiAoc2F2ZWRDbWRzKT0+XG4gICAgb3JpZ25pbmFsTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCdmcm9tJ10pXG4gICAgbmV3TmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCd0byddKVxuICAgIGlmIG9yaWduaW5hbE5hbWU/IGFuZCBuZXdOYW1lP1xuICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQob3JpZ25pbmFsTmFtZSlcbiAgICAgIGlmIHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXT8gYW5kIGNtZD9cbiAgICAgICAgdW5sZXNzIG5ld05hbWUuaW5kZXhPZignOicpID4gLTFcbiAgICAgICAgICBuZXdOYW1lID0gY21kLmZ1bGxOYW1lLnJlcGxhY2Uob3JpZ25pbmFsTmFtZSwnJykgKyBuZXdOYW1lXG4gICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEobmV3TmFtZSxjbWREYXRhKVxuICAgICAgICBjbWQudW5yZWdpc3RlcigpXG4gICAgICAgIHNhdmVkQ21kc1tuZXdOYW1lXSA9IGNtZERhdGFcbiAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXVxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICAgICAgc3RvcmFnZS5zYXZlKCdjbWRzJyxzYXZlZENtZHMpXG4gICAgICAgIC50aGVuID0+XG4gICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgIGVsc2UgaWYgY21kPyBcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCJcbiAgICAgIGVsc2UgXG4gICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIlxucmVtb3ZlQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnY21kJ10pXG4gICAgaWYgbmFtZT9cbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZVxuICAgICAgICBzYXZlZENtZHMgPSBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgICAgLnRoZW4gKHNhdmVkQ21kcyk9PlxuICAgICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChuYW1lKVxuICAgICAgICBpZiBzYXZlZENtZHNbbmFtZV0/IGFuZCBjbWQ/XG4gICAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tuYW1lXVxuICAgICAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW25hbWVdXG4gICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbiA9PlxuICAgICAgICAgICAgc3RvcmFnZS5zYXZlKCdjbWRzJyxzYXZlZENtZHMpXG4gICAgICAgICAgLnRoZW4gPT5cbiAgICAgICAgICAgIHJldHVybiBcIlwiXG4gICAgICAgIGVsc2UgaWYgY21kPyBcbiAgICAgICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIlxuICAgICAgICBlbHNlIFxuICAgICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIlxuYWxpYXNDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgYWxpYXMgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwnYWxpYXMnXSlcbiAgaWYgbmFtZT8gYW5kIGFsaWFzP1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0Q21kKG5hbWUpXG4gICAgaWYgY21kP1xuICAgICAgY21kID0gY21kLmdldEFsaWFzZWQoKSBvciBjbWRcbiAgICAgICMgdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAgICMgYWxpYXMgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShuYW1lLCcnKSArIGFsaWFzXG4gICAgICBDb21tYW5kLnNhdmVDbWQoYWxpYXMsIHsgYWxpYXNPZjogY21kLmZ1bGxOYW1lIH0pXG4gICAgICByZXR1cm4gXCJcIlxuICAgIGVsc2UgXG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcblxubGlzdENvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIGJveCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2JveCddLHRydWUpXG4gIHVzZUNvbnRleHQgPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydjb250ZXh0J10sdHJ1ZSlcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIG5hbWVzcGFjZXMgPSBpZiBuYW1lIFxuICAgIFtuYW1lXSBcbiAgZWxzZSBcbiAgICBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKS5maWx0ZXIoKG5zcGMpID0+IG5zcGMgIT0gaW5zdGFuY2UuY21kLmZ1bGxOYW1lKS5jb25jYXQoXCJfcm9vdFwiKVxuXG4gIGNvbnRleHQgPSBpZiB1c2VDb250ZXh0XG4gICAgaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKVxuICBlbHNlXG4gICAgaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHRcblxuICBjb21tYW5kcyA9IG5hbWVzcGFjZXMucmVkdWNlIChjb21tYW5kcywgbnNwYykgPT4gXG4gICAgICBjbWQgPSBpZiBuc3BjID09IFwiX3Jvb3RcIiB0aGVuIENvbW1hbmQuY21kcyBlbHNlIGNvbnRleHQuZ2V0Q21kKG5zcGMsbXVzdEV4ZWN1dGU6ZmFsc2UpXG4gICAgICBpZiBjbWQ/XG4gICAgICAgIGNtZC5pbml0KClcbiAgICAgICAgaWYgY21kLmNtZHNcbiAgICAgICAgICBjb21tYW5kcyA9IGNvbW1hbmRzLmNvbmNhdChjbWQuY21kcylcbiAgICAgIGNvbW1hbmRzXG4gICAgLCBbXVxuXG4gIHRleHQgPSBpZiBjb21tYW5kcy5sZW5ndGggXG4gICAgY29tbWFuZHMubWFwKChjbWQpPT4gXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICAoaWYgY21kLmlzRXhlY3V0YWJsZSgpIHRoZW4gJ35+IScgZWxzZSAnfn4hbHMgJykrY21kLmZ1bGxOYW1lKyd+fidcbiAgICApLmpvaW4oXCJcXG5cIilcbiAgZWxzZVxuICAgIFwiVGhpcyBjb250YWlucyBubyBzdWItY29tbWFuZHNcIlxuXG4gIGlmIGJveFxuICAgIFwiXCJcIlxuICAgICAgfn5ib3h+flxuICAgICAgI3t0ZXh0fVxuXG4gICAgICB+fiFjbG9zZXx+flxuICAgICAgfn4vYm94fn5cbiAgICAgIFwiXCJcIlxuICBlbHNlXG4gICAgdGV4dFxuICBcbmdldENvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICByZXMgPSBQYXRoSGVscGVyLmdldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycyxuYW1lKVxuICBpZiB0eXBlb2YgcmVzID09IFwib2JqZWN0XCJcbiAgICBKU09OLnN0cmluZ2lmeShyZXMsbnVsbCwnICAnKVxuICBlbHNlXG4gICAgcmVzXG5cbnNldENvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCd2YWx1ZScsJ3ZhbCddKSk/XG4gICAgcFxuICBlbHNlIGlmIGluc3RhbmNlLmNvbnRlbnRcbiAgICBpbnN0YW5jZS5jb250ZW50XG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLG5hbWUsdmFsKVxuICAnJ1xuXG5zdG9yZUpzb25Db21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwnanNvbiddKSk/XG4gICAgcFxuICBlbHNlIGlmIGluc3RhbmNlLmNvbnRlbnRcbiAgICBpbnN0YW5jZS5jb250ZW50XG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLG5hbWUsIEpTT04ucGFyc2UodmFsKSlcbiAgJydcblxuZ2V0UGFyYW0gPSAoaW5zdGFuY2UpIC0+XG4gIGlmIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2U/XG4gICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuZ2V0UGFyYW0oaW5zdGFuY2UucGFyYW1zLGluc3RhbmNlLmdldFBhcmFtKFsnZGVmJywnZGVmYXVsdCddKSlcbiAgXG5jbGFzcyBCb3hDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBpbnN0YW5jZS5jb250ZXh0KVxuICAgIEBjbWQgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydjbWQnXSlcbiAgICBpZiBAY21kP1xuICAgICAgQGhlbHBlci5vcGVuVGV4dCAgPSBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIEBjbWQgKyBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgICAgQGhlbHBlci5jbG9zZVRleHQgPSBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIEBpbnN0YW5jZS5jb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY21kLnNwbGl0KFwiIFwiKVswXSArIEBpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzXG4gICAgQGhlbHBlci5kZWNvID0gQGluc3RhbmNlLmNvZGV3YXZlLmRlY29cbiAgICBAaGVscGVyLnBhZCA9IDJcbiAgICBAaGVscGVyLnByZWZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCcnKVxuICAgIEBoZWxwZXIuc3VmZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sJycpXG4gICAgXG4gIGhlaWdodDogLT5cbiAgICBpZiBAYm91bmRzKCk/XG4gICAgICBoZWlnaHQgPSBAYm91bmRzKCkuaGVpZ2h0XG4gICAgZWxzZVxuICAgICAgaGVpZ2h0ID0gM1xuICAgICAgXG4gICAgcGFyYW1zID0gWydoZWlnaHQnXVxuICAgIGlmIEBpbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSBcbiAgICAgIHBhcmFtcy5wdXNoKDEpXG4gICAgZWxzZSBpZiBAaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDBcbiAgICAgIHBhcmFtcy5wdXNoKDApXG4gICAgcmV0dXJuIEBpbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsaGVpZ2h0KVxuICAgICAgXG4gIHdpZHRoOiAtPlxuICAgIGlmIEBib3VuZHMoKT9cbiAgICAgIHdpZHRoID0gQGJvdW5kcygpLndpZHRoXG4gICAgZWxzZVxuICAgICAgd2lkdGggPSAzXG4gICAgICBcbiAgICBwYXJhbXMgPSBbJ3dpZHRoJ11cbiAgICBpZiBAaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEgXG4gICAgICBwYXJhbXMucHVzaCgwKVxuICAgIHJldHVybiBNYXRoLm1heChAbWluV2lkdGgoKSwgQGluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgd2lkdGgpKVxuXG4gIFxuICBib3VuZHM6IC0+XG4gICAgaWYgQGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHVubGVzcyBAX2JvdW5kcz9cbiAgICAgICAgQF9ib3VuZHMgPSBAaGVscGVyLnRleHRCb3VuZHMoQGluc3RhbmNlLmNvbnRlbnQpXG4gICAgICByZXR1cm4gQF9ib3VuZHNcbiAgICAgIFxuICByZXN1bHQ6IC0+XG4gICAgQGhlbHBlci5oZWlnaHQgPSBAaGVpZ2h0KClcbiAgICBAaGVscGVyLndpZHRoID0gQHdpZHRoKClcbiAgICByZXR1cm4gQGhlbHBlci5kcmF3KEBpbnN0YW5jZS5jb250ZW50KVxuICBtaW5XaWR0aDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgcmV0dXJuIEBjbWQubGVuZ3RoXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIDBcbiAgXG5jbGFzcyBDbG9zZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGluc3RhbmNlLmNvbnRleHQpXG4gIGV4ZWN1dGU6IC0+XG4gICAgcHJlZml4ID0gQGhlbHBlci5wcmVmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgICBzdWZmaXggPSBAaGVscGVyLnN1ZmZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCcnKVxuICAgIGJveCA9IEBoZWxwZXIuZ2V0Qm94Rm9yUG9zKEBpbnN0YW5jZS5nZXRQb3MoKSlcbiAgICByZXF1aXJlZF9hZmZpeGVzID0gQGluc3RhbmNlLmdldFBhcmFtKFsncmVxdWlyZWRfYWZmaXhlcyddLHRydWUpXG4gICAgaWYgIXJlcXVpcmVkX2FmZml4ZXNcbiAgICAgIEBoZWxwZXIucHJlZml4ID0gQGhlbHBlci5zdWZmaXggPSAnJ1xuICAgICAgYm94MiA9IEBoZWxwZXIuZ2V0Qm94Rm9yUG9zKEBpbnN0YW5jZS5nZXRQb3MoKSlcbiAgICAgIGlmIGJveDI/IGFuZCAoIWJveD8gb3IgYm94LnN0YXJ0IDwgYm94Mi5zdGFydCAtIHByZWZpeC5sZW5ndGggb3IgYm94LmVuZCA+IGJveDIuZW5kICsgc3VmZml4Lmxlbmd0aClcbiAgICAgICAgYm94ID0gYm94MlxuICAgIGlmIGJveD9cbiAgICAgIGRlcHRoID0gQGhlbHBlci5nZXROZXN0ZWRMdmwoQGluc3RhbmNlLmdldFBvcygpLnN0YXJ0KVxuICAgICAgaWYgZGVwdGggPCAyXG4gICAgICAgIEBpbnN0YW5jZS5pbkJveCA9IG51bGxcbiAgICAgIEBpbnN0YW5jZS5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChib3guc3RhcnQsYm94LmVuZCwnJykpXG4gICAgZWxzZVxuICAgICAgQGluc3RhbmNlLnJlcGxhY2VXaXRoKCcnKVxuICAgICAgICAgIFxuY2xhc3MgRWRpdENtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQGNtZE5hbWUgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2NtZCddKVxuICAgIEB2ZXJiYWxpemUgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzFdKSBpbiBbJ3YnLCd2ZXJiYWxpemUnXVxuICAgIGlmIEBjbWROYW1lP1xuICAgICAgQGZpbmRlciA9IEBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldEZpbmRlcihAY21kTmFtZSkgXG4gICAgICBAZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlXG4gICAgICBAY21kID0gQGZpbmRlci5maW5kKClcbiAgICBAZWRpdGFibGUgPSBpZiBAY21kPyB0aGVuIEBjbWQuaXNFZGl0YWJsZSgpIGVsc2UgdHJ1ZVxuICByZXN1bHQ6IC0+XG4gICAgaWYgQGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHJldHVybiBAcmVzdWx0V2l0aENvbnRlbnQoKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAcmVzdWx0V2l0aG91dENvbnRlbnQoKVxuICByZXN1bHRXaXRoQ29udGVudDogLT5cbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIGRhdGEgPSB7fVxuICAgICAgZm9yIHAgaW4gRWRpdENtZC5wcm9wc1xuICAgICAgICBwLndyaXRlRm9yKHBhcnNlcixkYXRhKVxuICAgICAgQ29tbWFuZC5zYXZlQ21kKEBjbWROYW1lLCBkYXRhKVxuICAgICAgcmV0dXJuICcnXG4gIHByb3BzRGlzcGxheTogLT5cbiAgICAgIGNtZCA9IEBjbWRcbiAgICAgIHJldHVybiBFZGl0Q21kLnByb3BzLm1hcCggKHApLT4gcC5kaXNwbGF5KGNtZCkgKS5maWx0ZXIoIChwKS0+IHA/ICkuam9pbihcIlxcblwiKVxuICByZXN1bHRXaXRob3V0Q29udGVudDogLT5cbiAgICBpZiAhQGNtZCBvciBAZWRpdGFibGVcbiAgICAgIG5hbWUgPSBpZiBAY21kIHRoZW4gQGNtZC5mdWxsTmFtZSBlbHNlIEBjbWROYW1lXG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChcbiAgICAgICAgXCJcIlwiXG4gICAgICAgIH5+Ym94IGNtZDpcIiN7QGluc3RhbmNlLmNtZC5mdWxsTmFtZX0gI3tuYW1lfVwifn5cbiAgICAgICAgI3tAcHJvcHNEaXNwbGF5KCl9XG4gICAgICAgIH5+IXNhdmV+fiB+fiFjbG9zZX5+XG4gICAgICAgIH5+L2JveH5+XG4gICAgICAgIFwiXCJcIilcbiAgICAgIHBhcnNlci5jaGVja0NhcnJldCA9IG5vXG4gICAgICByZXR1cm4gaWYgQHZlcmJhbGl6ZSB0aGVuIHBhcnNlci5nZXRUZXh0KCkgZWxzZSBwYXJzZXIucGFyc2VBbGwoKVxuRWRpdENtZC5zZXRDbWRzID0gKGJhc2UpIC0+XG4gIGluSW5zdGFuY2UgPSBiYXNlLmluX2luc3RhbmNlID0ge2NtZHM6e319XG4gIGZvciBwIGluIEVkaXRDbWQucHJvcHNcbiAgICBwLnNldENtZChpbkluc3RhbmNlLmNtZHMpXG4gICAgIyBwLnNldENtZChiYXNlKVxuICByZXR1cm4gYmFzZVxuRWRpdENtZC5wcm9wcyA9IFtcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX2NhcnJldCcsICAgICAgICAge29wdDonY2hlY2tDYXJyZXQnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19wYXJzZScsICAgICAgICAgIHtvcHQ6J3BhcnNlJ30pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCggICAncHJldmVudF9wYXJzZV9hbGwnLCB7b3B0OidwcmV2ZW50UGFyc2VBbGwnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCAgICdyZXBsYWNlX2JveCcsICAgICAgIHtvcHQ6J3JlcGxhY2VCb3gnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoICduYW1lX3RvX3BhcmFtJywgICAgIHtvcHQ6J25hbWVUb1BhcmFtJ30pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCAnYWxpYXNfb2YnLCAgICAgICAgICB7dmFyOidhbGlhc09mJywgY2FycmV0OnRydWV9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSggJ2hlbHAnLCAgICAgICAgICAgICAge2Z1bmN0OidoZWxwJywgc2hvd0VtcHR5OnRydWV9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSggJ3NvdXJjZScsICAgICAgICAgICAge3ZhcjoncmVzdWx0U3RyJywgZGF0YU5hbWU6J3Jlc3VsdCcsIHNob3dFbXB0eTp0cnVlLCBjYXJyZXQ6dHJ1ZX0pLFxuXVxuY2xhc3MgTmFtZVNwYWNlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAbmFtZSA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMF0pXG4gIHJlc3VsdDogLT5cbiAgICBpZiBAbmFtZT9cbiAgICAgIEBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dC5hZGROYW1lU3BhY2UoQG5hbWUpXG4gICAgICByZXR1cm4gJydcbiAgICBlbHNlXG4gICAgICBuYW1lc3BhY2VzID0gQGluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICB0eHQgPSAnfn5ib3h+flxcbidcbiAgICAgIGZvciBuc3BjIGluIG5hbWVzcGFjZXMgXG4gICAgICAgIGlmIG5zcGMgIT0gQGluc3RhbmNlLmNtZC5mdWxsTmFtZVxuICAgICAgICAgIHR4dCArPSBuc3BjKydcXG4nXG4gICAgICB0eHQgKz0gJ35+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0eHQpXG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKClcblxuXG5jbGFzcyBUZW1wbGF0ZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kXG4gIGluaXQ6IC0+XG4gICAgQG5hbWUgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgICBAc2VwID0gQGluc3RhbmNlLmdldFBhcmFtKFsnc2VwJ10sXCJcXG5cIilcbiAgcmVzdWx0OiAtPlxuICAgIGRhdGEgPSBpZiBAbmFtZSB0aGVuIFBhdGhIZWxwZXIuZ2V0UGF0aChAaW5zdGFuY2UuY29kZXdhdmUudmFycywgQG5hbWUpIGVsc2UgQGluc3RhbmNlLmNvZGV3YXZlLnZhcnNcbiAgICBpZiBAaW5zdGFuY2UuY29udGVudCBhbmQgZGF0YT8gYW5kIGRhdGEgIT0gZmFsc2VcbiAgICAgIGlmIEFycmF5LmlzQXJyYXkoZGF0YSlcbiAgICAgICAgZGF0YS5tYXAgKGl0ZW0pPT5AcmVuZGVyVGVtcGxhdGUoaXRlbSlcbiAgICAgICAgICAuam9pbihAc2VwKVxuICAgICAgZWxzZVxuICAgICAgICBAcmVuZGVyVGVtcGxhdGUoZGF0YSlcbiAgICBlbHNlXG4gICAgICAnJ1xuICByZW5kZXJUZW1wbGF0ZTogKGRhdGEpIC0+XG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChAaW5zdGFuY2UuY29udGVudClcbiAgICAgIHBhcnNlci52YXJzID0gaWYgdHlwZW9mIGRhdGEgPT0gXCJvYmplY3RcIiB0aGVuIGRhdGEgZWxzZSB7dmFsdWU6ZGF0YX1cbiAgICAgIHBhcnNlci5jaGVja0NhcnJldCA9IG5vXG4gICAgICBwYXJzZXIucGFyc2VBbGwoKVxuXG5cbmNsYXNzIEVtbWV0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAYWJiciA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMCwnYWJicicsJ2FiYnJldmlhdGlvbiddKVxuICAgIEBsYW5nID0gQGluc3RhbmNlLmdldFBhcmFtKFsxLCdsYW5nJywnbGFuZ3VhZ2UnXSlcbiAgcmVzdWx0OiAtPlxuICAgIGVtbWV0ID0gaWYgd2luZG93Py5lbW1ldD9cbiAgICAgIHdpbmRvdy5lbW1ldFxuICAgIGVsc2UgaWYgd2luZG93Py5zZWxmPy5lbW1ldD9cbiAgICAgIHdpbmRvdy5zZWxmLmVtbWV0XG4gICAgZWxzZSBpZiB3aW5kb3c/Lmdsb2JhbD8uZW1tZXQ/XG4gICAgICB3aW5kb3cuZ2xvYmFsLmVtbWV0XG4gICAgZWxzZSBpZiByZXF1aXJlPyBcbiAgICAgIHRyeSBcbiAgICAgICAgcmVxdWlyZSgnZW1tZXQnKVxuICAgICAgY2F0Y2ggZXhcbiAgICAgICAgQGluc3RhbmNlLmNvZGV3YXZlLmxvZ2dlci5sb2coJ0VtbWV0IGlzIG5vdCBhdmFpbGFibGUsIGl0IG1heSBuZWVkIHRvIGJlIGluc3RhbGxlZCBtYW51YWxseScpXG4gICAgICAgIG51bGxcbiAgICBpZiBlbW1ldD9cbiAgICAgICMgZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKEBhYmJyLCBAbGFuZylcbiAgICAgIHJlcy5yZXBsYWNlKC9cXCRcXHswXFx9L2csICd8JylcblxuXG5cbiIsInZhciBCb3hDbWQsIENsb3NlQ21kLCBFZGl0Q21kLCBFbW1ldENtZCwgTmFtZVNwYWNlQ21kLCBUZW1wbGF0ZUNtZCwgYWxpYXNDb21tYW5kLCBleGVjX3BhcmVudCwgZ2V0Q29tbWFuZCwgZ2V0Q29udGVudCwgZ2V0UGFyYW0sIGhlbHAsIGxpc3RDb21tYW5kLCBub19leGVjdXRlLCBxdW90ZV9jYXJyZXQsIHJlbW92ZUNvbW1hbmQsIHJlbmFtZUNvbW1hbmQsIHNldENvbW1hbmQsIHN0b3JlSnNvbkNvbW1hbmQ7XG5cbmltcG9ydCB7XG4gIENvbW1hbmQsXG4gIEJhc2VDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBMYW5nRGV0ZWN0b3Jcbn0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuXG5pbXBvcnQge1xuICBCb3hIZWxwZXJcbn0gZnJvbSAnLi4vQm94SGVscGVyJztcblxuaW1wb3J0IHtcbiAgRWRpdENtZFByb3Bcbn0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYXRoSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvUGF0aEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IHZhciBDb3JlQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgQ29yZUNvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgY29yZTtcbiAgICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NvcmUnKSk7XG4gICAgY29yZS5hZGREZXRlY3RvcihuZXcgTGFuZ0RldGVjdG9yKCkpO1xuICAgIHJldHVybiBjb3JlLmFkZENtZHMoe1xuICAgICAgJ2hlbHAnOiB7XG4gICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgJ3Jlc3VsdCc6IGhlbHAsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2NtZCddLFxuICAgICAgICAnaGVscCc6IFwiVG8gZ2V0IGhlbHAgb24gYSBwZWNpZmljIGNvbW1hbmQsIGRvIDpcXG5+fmhlbHAgaGVsbG9+fiAoaGVsbG8gYmVpbmcgdGhlIGNvbW1hbmQpXCIsXG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdvdmVydmlldyc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuICBfX18gICAgICAgICBfICAgX18gICAgICBfX1xcbiAvIF9ffF9fXyAgX198IHxfX1xcXFwgXFxcXCAgICAvIC9fIF9fXyBfX19fX19cXG4vIC9fXy8gXyBcXFxcLyBfYCAvIC1fXFxcXCBcXFxcL1xcXFwvIC8gX2AgXFxcXCBWIC8gLV8vXFxuXFxcXF9fX19cXFxcX19fL1xcXFxfXyxfXFxcXF9fX3xcXFxcXy9cXFxcXy9cXFxcX18sX3xcXFxcXy9cXFxcX19ffFxcblRoZSB0ZXh0IGVkaXRvciBoZWxwZXJcXG5+fi9xdW90ZV9jYXJyZXR+flxcblxcbldoZW4gdXNpbmcgQ29kZXdhdmUgeW91IHdpbGwgYmUgd3JpdGluZyBjb21tYW5kcyB3aXRoaW4gXFxueW91ciB0ZXh0IGVkaXRvci4gVGhlc2UgY29tbWFuZHMgbXVzdCBiZSBwbGFjZWQgYmV0d2VlbiB0d28gXFxucGFpcnMgb2YgXFxcIn5cXFwiICh0aWxkZSkgYW5kIHRoZW4sIHRoZXkgY2FuIGJlIGV4ZWN1dGVkIGJ5IHByZXNzaW5nIFxcblxcXCJjdHJsXFxcIitcXFwic2hpZnRcXFwiK1xcXCJlXFxcIiwgd2l0aCB5b3VyIGN1cnNvciBpbnNpZGUgdGhlIGNvbW1hbmRcXG5FeDogfn4haGVsbG9+flxcblxcbllvdSBkb250IG5lZWQgdG8gYWN0dWFsbHkgdHlwZSBhbnkgXFxcIn5cXFwiICh0aWxkZSkuIFxcblByZXNzaW5nIFxcXCJjdHJsXFxcIitcXFwic2hpZnRcXFwiK1xcXCJlXFxcIiB3aWxsIGFkZCB0aGVtIGlmIHlvdSBhcmUgbm90IGFscmVhZHlcXG53aXRoaW4gYSBjb21tYW5kLlxcblxcbkNvZGV3YXZlIGRvZXMgbm90IHVzZSBVSSB0byBkaXNwbGF5IGFueSBpbmZvcm1hdGlvbi4gXFxuSW5zdGVhZCwgaXQgdXNlcyB0ZXh0IHdpdGhpbiBjb2RlIGNvbW1lbnRzIHRvIG1pbWljIFVJcy4gXFxuVGhlIGdlbmVyYXRlZCBjb21tZW50IGJsb2NrcyB3aWxsIGJlIHJlZmVycmVkIHRvIGFzIHdpbmRvd3MgXFxuaW4gdGhlIGhlbHAgc2VjdGlvbnMuXFxuXFxuVG8gY2xvc2UgdGhpcyB3aW5kb3cgKGkuZS4gcmVtb3ZlIHRoaXMgY29tbWVudCBibG9jayksIHByZXNzIFxcblxcXCJjdHJsXFxcIitcXFwic2hpZnRcXFwiK1xcXCJlXFxcIiB3aXRoIHlvdXIgY3Vyc29yIG9uIHRoZSBsaW5lIGJlbGxvdy5cXG5+fiFjbG9zZXx+flxcblxcblVzZSB0aGUgZm9sbG93aW5nIGNvbW1hbmQgZm9yIGEgd2Fsa3Rocm91Z2ggb2Ygc29tZSBvZiB0aGUgbWFueVxcbmZlYXR1cmVzIG9mIENvZGV3YXZlXFxufn4haGVscDpnZXRfc3RhcnRlZH5+IG9yIH5+IWhlbHA6ZGVtb35+XFxuXFxuTGlzdCBvZiBhbGwgaGVscCBzdWJqZWN0cyBcXG5+fiFoZWxwOnN1YmplY3Rzfn4gb3Igfn4haGVscDpzdWJ+fiBcXG5cXG5+fiFjbG9zZX5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3N1YmplY3RzJzoge1xuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+IWhlbHB+flxcbn5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiAofn4haGVscDpkZW1vfn4pXFxufn4haGVscDpzdWJqZWN0c35+ICh+fiFoZWxwOnN1Yn5+KVxcbn5+IWhlbHA6ZWRpdGluZ35+ICh+fiFoZWxwOmVkaXR+filcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdzdWInOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOnN1YmplY3RzJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2dldF9zdGFydGVkJzoge1xuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcblRoZSBjbGFzc2ljIEhlbGxvIFdvcmxkLlxcbn5+IWhlbGxvfH5+XFxuXFxufn5oZWxwOmVkaXRpbmc6aW50cm9+flxcbn5+cXVvdGVfY2FycmV0fn5cXG5cXG5Gb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBjcmVhdGluZyB5b3VyIG93biBjb21tYW5kcywgc2VlOlxcbn5+IWhlbHA6ZWRpdGluZ35+XFxuXFxuQ29kZXdhdmUgY29tZXMgd2l0aCBtYW55IHByZS1leGlzdGluZyBjb21tYW5kcy4gSGVyZSBpcyBhbiBleGFtcGxlXFxub2YgSmF2YVNjcmlwdCBhYmJyZXZpYXRpb25zXFxufn4hanM6Zn5+XFxufn4hanM6aWZ+flxcbiAgfn4hanM6bG9nfn5cXFwifn4haGVsbG9+flxcXCJ+fiEvanM6bG9nfn5cXG5+fiEvanM6aWZ+flxcbn5+IS9qczpmfn5cXG5cXG5Db2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXFxucHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuIEVtbWV0IGFiYnJldmlhdGlvbnMgd2lsbCBiZSBcXG51c2VkIGF1dG9tYXRpY2FsbHkgaWYgeW91IGFyZSBpbiBhIEhUTUwgb3IgQ1NTIGZpbGUuXFxufn4hdWw+bGl+fiAoaWYgeW91IGFyZSBpbiBhIGh0bWwgZG9jY3VtZW50KVxcbn5+IWVtbWV0IHVsPmxpfn5cXG5+fiFlbW1ldCBtMiBjc3N+flxcblxcbkNvbW1hbmRzIGFyZSBzdG9yZWQgaW4gbmFtZXNwYWNlcy4gVGhlIHNhbWUgY29tbWFuZCBjYW4gaGF2ZSBcXG5kaWZmZXJlbnQgcmVzdWx0cyBkZXBlbmRpbmcgb24gdGhlIG5hbWVzcGFjZS5cXG5+fiFqczplYWNofn5cXG5+fiFwaHA6b3V0ZXI6ZWFjaH5+XFxufn4hcGhwOmlubmVyOmVhY2h+flxcblxcblNvbWUgb2YgdGhlIG5hbWVzcGFjZXMgYXJlIGFjdGl2ZSBkZXBlbmRpbmcgb24gdGhlIGNvbnRleHQuIFRoZVxcbmZvbGxvd2luZyBjb21tYW5kcyBhcmUgdGhlIHNhbWUgYW5kIHdpbGwgZGlzcGxheSB0aGUgY3VycmVudGx5XFxuYWN0aXZlIG5hbWVzcGFjZS4gVGhlIGZpcnN0IGNvbW1hbmQgY29tbWFuZCB3b3JrcyBiZWNhdXNlIHRoZSBcXG5jb3JlIG5hbWVzcGFjZSBpcyBhY3RpdmUuXFxufn4hbmFtZXNwYWNlfn5cXG5+fiFjb3JlOm5hbWVzcGFjZX5+XFxuXFxuWW91IGNhbiBtYWtlIGEgbmFtZXNwYWNlIGFjdGl2ZSB3aXRoIHRoZSBmb2xsb3dpbmcgY29tbWFuZC5cXG5+fiFuYW1lc3BhY2UgcGhwfn5cXG5cXG5DaGVjayB0aGUgbmFtZXNwYWNlcyBhZ2Fpblxcbn5+IW5hbWVzcGFjZX5+XFxuXFxuSW4gYWRkaXRpb24gdG8gZGV0ZWN0aW5nIHRoZSBkb2N1bWVudCB0eXBlLCBDb2Rld2F2ZSBjYW4gZGV0ZWN0IHRoZVxcbmNvbnRleHQgZnJvbSB0aGUgc3Vycm91bmRpbmcgdGV4dC4gSW4gYSBQSFAgZmlsZSwgaXQgbWVhbnMgQ29kZXdhdmUgXFxud2lsbCBhZGQgdGhlIFBIUCB0YWdzIHdoZW4geW91IG5lZWQgdGhlbS5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2RlbW8nOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmdldF9zdGFydGVkJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2VkaXRpbmcnOiB7XG4gICAgICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAgICAgJ2ludHJvJzoge1xuICAgICAgICAgICAgICAgICdyZXN1bHQnOiBcIkNvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXFxucHV0IHlvdXIgY29udGVudCBpbnNpZGUgXFxcInNvdXJjZVxcXCIgdGhlIGRvIFxcXCJzYXZlXFxcIi4gVHJ5IGFkZGluZyBhbnkgXFxudGV4dCB0aGF0IGlzIG9uIHlvdXIgbWluZC5cXG5+fiFlZGl0IG15X25ld19jb21tYW5kfH5+XFxuXFxuSWYgeW91IGRpZCB0aGUgbGFzdCBzdGVwIHJpZ2h0LCB5b3Ugc2hvdWxkIHNlZSB5b3VyIHRleHQgd2hlbiB5b3VcXG5kbyB0aGUgZm9sbG93aW5nIGNvbW1hbmQuIEl0IGlzIG5vdyBzYXZlZCBhbmQgeW91IGNhbiB1c2UgaXQgXFxud2hlbmV2ZXIgeW91IHdhbnQuXFxufn4hbXlfbmV3X2NvbW1hbmR+flwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn5oZWxwOmVkaXRpbmc6aW50cm9+flxcblxcbkFsbCB0aGUgd2luZG93cyBvZiBDb2Rld2F2ZSBhcmUgbWFkZSB3aXRoIHRoZSBjb21tYW5kIFxcXCJib3hcXFwiLiBcXG5UaGV5IGFyZSBtZWFudCB0byBkaXNwbGF5IHRleHQgdGhhdCBzaG91bGQgbm90IHJlbWFpbiBpbiB5b3VyIGNvZGUuIFxcblRoZXkgYXJlIHZhbGlkIGNvbW1lbnRzIHNvIHRoZXkgd29uJ3QgYnJlYWsgeW91ciBjb2RlIGFuZCB0aGUgY29tbWFuZCBcXG5cXFwiY2xvc2VcXFwiIGNhbiBiZSB1c2VkIHRvIHJlbW92ZSB0aGVtIHJhcGlkbHkuIFlvdSBjYW4gbWFrZSB5b3VyIG93biBcXG5jb21tYW5kcyB3aXRoIHRoZW0gaWYgeW91IG5lZWQgdG8gZGlzcGxheSBzb21lIHRleHQgdGVtcG9yYXJpbHkuXFxufn4hYm94fn5cXG5UaGUgYm94IHdpbGwgc2NhbGUgd2l0aCB0aGUgY29udGVudCB5b3UgcHV0IGluIGl0XFxufn4hY2xvc2V8fn5cXG5+fiEvYm94fn5cXG5cXG5+fnF1b3RlX2NhcnJldH5+XFxuV2hlbiB5b3UgY3JlYXRlIGEgY29tbWFuZCwgeW91IG1heSB3YW50IHRvIHNwZWNpZnkgd2hlcmUgdGhlIGN1cnNvciBcXG53aWxsIGJlIGxvY2F0ZWQgb25jZSB0aGUgY29tbWFuZCBpcyBleHBhbmRlZC4gVG8gZG8gdGhhdCwgdXNlIGEgXFxcInxcXFwiIFxcbihWZXJ0aWNhbCBiYXIpLiBVc2UgMiBvZiB0aGVtIGlmIHlvdSB3YW50IHRvIHByaW50IHRoZSBhY3R1YWwgXFxuY2hhcmFjdGVyLlxcbn5+IWJveH5+XFxub25lIDogfCBcXG50d28gOiB8fFxcbn5+IS9ib3h+flxcblxcbllvdSBjYW4gYWxzbyB1c2UgdGhlIFxcXCJlc2NhcGVfcGlwZXNcXFwiIGNvbW1hbmQgdGhhdCB3aWxsIGVzY2FwZSBhbnkgXFxudmVydGljYWwgYmFycyB0aGF0IGFyZSBiZXR3ZWVuIGl0cyBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3NcXG5+fiFlc2NhcGVfcGlwZXN+flxcbnxcXG5+fiEvZXNjYXBlX3BpcGVzfn5cXG5cXG5Db21tYW5kcyBpbnNpZGUgb3RoZXIgY29tbWFuZHMgd2lsbCBiZSBleHBhbmRlZCBhdXRvbWF0aWNhbGx5LlxcbklmIHlvdSB3YW50IHRvIHByaW50IGEgY29tbWFuZCB3aXRob3V0IGhhdmluZyBpdCBleHBhbmQgd2hlbiBcXG50aGUgcGFyZW50IGNvbW1hbmQgaXMgZXhwYW5kZWQsIHVzZSBhIFxcXCIhXFxcIiAoZXhjbGFtYXRpb24gbWFyaykuXFxufn4hIWhlbGxvfn5cXG5cXG5Gb3IgY29tbWFuZHMgdGhhdCBoYXZlIGJvdGggYW4gb3BlbmluZyBhbmQgYSBjbG9zaW5nIHRhZywgeW91IGNhbiB1c2VcXG50aGUgXFxcImNvbnRlbnRcXFwiIGNvbW1hbmQuIFxcXCJjb250ZW50XFxcIiB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRleHRcXG50aGF0IGlzIGJldHdlZW4gdGhlIHRhZ3MuIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBob3cgaXQgY2FuIGJlIHVzZWQuXFxufn4hZWRpdCBwaHA6aW5uZXI6aWZ+flxcblxcbn5+L3F1b3RlX2NhcnJldH5+XFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZWRpdCc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6ZWRpdGluZydcbiAgICAgICAgICB9LFxuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ25vX2V4ZWN1dGUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBub19leGVjdXRlLFxuICAgICAgICAnaGVscCc6IFwiUHJldmVudCBldmVyeXRoaW5nIGluc2lkZSB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIGZyb20gZXhlY3V0aW5nXCJcbiAgICAgIH0sXG4gICAgICAnZXNjYXBlX3BpcGVzJzoge1xuICAgICAgICAncmVzdWx0JzogcXVvdGVfY2FycmV0LFxuICAgICAgICAnY2hlY2tDYXJyZXQnOiBmYWxzZSxcbiAgICAgICAgJ2hlbHAnOiBcIkVzY2FwZSBhbGwgY2FycmV0cyAoZnJvbSBcXFwifFxcXCIgdG8gXFxcInx8XFxcIilcIlxuICAgICAgfSxcbiAgICAgICdxdW90ZV9jYXJyZXQnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXNjYXBlX3BpcGVzJ1xuICAgICAgfSxcbiAgICAgICdleGVjX3BhcmVudCc6IHtcbiAgICAgICAgJ2V4ZWN1dGUnOiBleGVjX3BhcmVudCxcbiAgICAgICAgJ2hlbHAnOiBcIkV4ZWN1dGUgdGhlIGZpcnN0IGNvbW1hbmQgdGhhdCB3cmFwIHRoaXMgaW4gaXQncyBvcGVuIGFuZCBjbG9zZSB0YWdcIlxuICAgICAgfSxcbiAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAncmVzdWx0JzogZ2V0Q29udGVudCxcbiAgICAgICAgJ2hlbHAnOiBcIk1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gd2hhdCB3YXMgYmV0d2VlbiB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIG9mIGEgY29tbWFuZFwiXG4gICAgICB9LFxuICAgICAgJ2JveCc6IHtcbiAgICAgICAgJ2Nscyc6IEJveENtZCxcbiAgICAgICAgJ2hlbHAnOiBcIkNyZWF0ZSB0aGUgYXBwYXJlbmNlIG9mIGEgYm94IGNvbXBvc2VkIGZyb20gY2hhcmFjdGVycy4gXFxuVXN1YWxseSB3cmFwcGVkIGluIGEgY29tbWVudC5cXG5cXG5UaGUgYm94IHdpbGwgdHJ5IHRvIGFqdXN0IGl0J3Mgc2l6ZSBmcm9tIHRoZSBjb250ZW50XCJcbiAgICAgIH0sXG4gICAgICAnY2xvc2UnOiB7XG4gICAgICAgICdjbHMnOiBDbG9zZUNtZCxcbiAgICAgICAgJ2hlbHAnOiBcIldpbGwgY2xvc2UgdGhlIGZpcnN0IGJveCBhcm91bmQgdGhpc1wiXG4gICAgICB9LFxuICAgICAgJ3BhcmFtJzoge1xuICAgICAgICAncmVzdWx0JzogZ2V0UGFyYW0sXG4gICAgICAgICdoZWxwJzogXCJNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIGEgcGFyYW1ldGVyIGZyb20gdGhpcyBjb21tYW5kIGNhbGxcXG5cXG5Zb3UgY2FuIHBhc3MgYSBudW1iZXIsIGEgc3RyaW5nLCBvciBib3RoLiBcXG5BIG51bWJlciBmb3IgYSBwb3NpdGlvbmVkIGFyZ3VtZW50IGFuZCBhIHN0cmluZ1xcbmZvciBhIG5hbWVkIHBhcmFtZXRlclwiXG4gICAgICB9LFxuICAgICAgJ2VkaXQnOiB7XG4gICAgICAgICdjbWRzJzogRWRpdENtZC5zZXRDbWRzKHtcbiAgICAgICAgICAnc2F2ZSc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXhlY19wYXJlbnQnXG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgJ2Nscyc6IEVkaXRDbWQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2NtZCddLFxuICAgICAgICAnaGVscCc6IFwiQWxsb3dzIHRvIGVkaXQgYSBjb21tYW5kLiBcXG5TZWUgfn4haGVscDplZGl0aW5nfn4gZm9yIGEgcXVpY2sgdHV0b3JpYWxcIlxuICAgICAgfSxcbiAgICAgICdyZW5hbWUnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfYXBwbGljYWJsZSc6IFwifn5ib3h+flxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCIsXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiByZW5hbWVDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydmcm9tJywgJ3RvJ10sXG4gICAgICAgICdoZWxwJzogXCJBbGxvd3MgdG8gcmVuYW1lIGEgY29tbWFuZCBhbmQgY2hhbmdlIGl0J3MgbmFtZXNwYWNlLiBcXG5Zb3UgY2FuIG9ubHkgcmVuYW1lIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxuLSBUaGUgZmlyc3QgcGFyYW0gaXMgdGhlIG9sZCBuYW1lXFxuLSBUaGVuIHNlY29uZCBwYXJhbSBpcyB0aGUgbmV3IG5hbWUsIGlmIGl0IGhhcyBubyBuYW1lc3BhY2UsXFxuICBpdCB3aWxsIHVzZSB0aGUgb25lIGZyb20gdGhlIG9yaWdpbmFsIGNvbW1hbmQuXFxuXFxuZXguOiB+fiFyZW5hbWUgbXlfY29tbWFuZCBteV9jb21tYW5kMn5+XCJcbiAgICAgIH0sXG4gICAgICAncmVtb3ZlJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnbm90X2FwcGxpY2FibGUnOiBcIn5+Ym94fn5cXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiLFxuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogcmVtb3ZlQ29tbWFuZCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJBbGxvd3MgdG8gcmVtb3ZlIGEgY29tbWFuZC4gXFxuWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlwiXG4gICAgICB9LFxuICAgICAgJ2FsaWFzJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IGFsaWFzQ29tbWFuZCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZVxuICAgICAgfSxcbiAgICAgICduYW1lc3BhY2UnOiB7XG4gICAgICAgICdjbHMnOiBOYW1lU3BhY2VDbWQsXG4gICAgICAgICdoZWxwJzogXCJTaG93IHRoZSBjdXJyZW50IG5hbWVzcGFjZXMuXFxuXFxuQSBuYW1lIHNwYWNlIGNvdWxkIGJlIHRoZSBuYW1lIG9mIHRoZSBsYW5ndWFnZVxcbm9yIG90aGVyIGtpbmQgb2YgY29udGV4dHNcXG5cXG5JZiB5b3UgcGFzcyBhIHBhcmFtIHRvIHRoaXMgY29tbWFuZCwgaXQgd2lsbCBcXG5hZGQgdGhlIHBhcmFtIGFzIGEgbmFtZXNwYWNlIGZvciB0aGUgY3VycmVudCBlZGl0b3JcIlxuICAgICAgfSxcbiAgICAgICduc3BjJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOm5hbWVzcGFjZSdcbiAgICAgIH0sXG4gICAgICAnbGlzdCc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGxpc3RDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ2JveCcsICdjb250ZXh0J10sXG4gICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2hlbHAnOiBcIkxpc3QgYXZhaWxhYmxlIGNvbW1hbmRzXFxuXFxuWW91IGNhbiB1c2UgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGNob29zZSBhIHNwZWNpZmljIG5hbWVzcGFjZSwgXFxuYnkgZGVmYXVsdCBhbGwgY3VyZW50IG5hbWVzcGFjZSB3aWxsIGJlIHNob3duXCJcbiAgICAgIH0sXG4gICAgICAnbHMnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6bGlzdCdcbiAgICAgIH0sXG4gICAgICAnZ2V0Jzoge1xuICAgICAgICAncmVzdWx0JzogZ2V0Q29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZSddLFxuICAgICAgICAnaGVscCc6IFwib3V0cHV0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXCJcbiAgICAgIH0sXG4gICAgICAnc2V0Jzoge1xuICAgICAgICAncmVzdWx0Jzogc2V0Q29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZScsICd2YWx1ZScsICd2YWwnXSxcbiAgICAgICAgJ2hlbHAnOiBcInNldCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZVwiXG4gICAgICB9LFxuICAgICAgJ3N0b3JlX2pzb24nOiB7XG4gICAgICAgICdyZXN1bHQnOiBzdG9yZUpzb25Db21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ2pzb24nXSxcbiAgICAgICAgJ2hlbHAnOiBcInNldCBhIHZhcmlhYmxlIHdpdGggc29tZSBqc29uIGRhdGFcIlxuICAgICAgfSxcbiAgICAgICdqc29uJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOnN0b3JlX2pzb24nXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlJzoge1xuICAgICAgICAnY2xzJzogVGVtcGxhdGVDbWQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnc2VwJ10sXG4gICAgICAgICdoZWxwJzogXCJyZW5kZXIgYSB0ZW1wbGF0ZSBmb3IgYSB2YXJpYWJsZVxcblxcbklmIHRoZSBmaXJzdCBwYXJhbSBpcyBub3Qgc2V0IGl0IHdpbGwgdXNlIGFsbCB2YXJpYWJsZXMgXFxuZm9yIHRoZSByZW5kZXJcXG5JZiB0aGUgdmFyaWFibGUgaXMgYW4gYXJyYXkgdGhlIHRlbXBsYXRlIHdpbGwgYmUgcmVwZWF0ZWQgXFxuZm9yIGVhY2ggaXRlbXNcXG5UaGUgYHNlcGAgcGFyYW0gZGVmaW5lIHdoYXQgd2lsbCBzZXBhcmF0ZSBlYWNoIGl0ZW0gXFxuYW5kIGRlZmF1bHQgdG8gYSBsaW5lIGJyZWFrXCJcbiAgICAgIH0sXG4gICAgICAnZW1tZXQnOiB7XG4gICAgICAgICdjbHMnOiBFbW1ldENtZCxcbiAgICAgICAgJ2hlbHAnOiBcIkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy5cXG5cXG5QYXNzIHRoZSBFbW1ldCBhYmJyZXZpYXRpb24gYXMgYSBwYXJhbSB0byBleHBlbmQgaXQuXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuXG5oZWxwID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGNtZCwgY21kTmFtZSwgaGVscENtZCwgc3ViY29tbWFuZHMsIHRleHQ7XG4gIGNtZE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKTtcbiAgaWYgKGNtZE5hbWUgIT0gbnVsbCkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKGNtZE5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaGVscENtZCA9IGNtZC5nZXRDbWQoJ2hlbHAnKTtcbiAgICAgIHRleHQgPSBoZWxwQ21kID8gYH5+JHtoZWxwQ21kLmZ1bGxOYW1lfX5+YCA6IFwiVGhpcyBjb21tYW5kIGhhcyBubyBoZWxwIHRleHRcIjtcbiAgICAgIHN1YmNvbW1hbmRzID0gY21kLmNtZHMubGVuZ3RoID8gYFxcblN1Yi1Db21tYW5kcyA6XFxufn5scyAke2NtZC5mdWxsTmFtZX0gYm94Om5vIGNvbnRleHQ6bm9+fmAgOiBcIlwiO1xuICAgICAgcmV0dXJuIGB+fmJveH5+XFxuSGVscCBmb3Igfn4hJHtjbWQuZnVsbE5hbWV9fn4gOlxcblxcbiR7dGV4dH1cXG4ke3N1YmNvbW1hbmRzfVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiAnfn5oZWxwOm92ZXJ2aWV3fn4nO1xuICB9XG59O1xuXG5ub19leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIHJlZztcbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSk7XG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsICckMScpO1xufTtcblxucXVvdGVfY2FycmV0ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgcmV0dXJuIGluc3RhbmNlLmNvbnRlbnQucmVwbGFjZSgvXFx8L2csICd8fCcpO1xufTtcblxuZXhlY19wYXJlbnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgcmVzO1xuICBpZiAoaW5zdGFuY2UucGFyZW50ICE9IG51bGwpIHtcbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpO1xuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnQ7XG4gICAgaW5zdGFuY2UucmVwbGFjZUVuZCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlRW5kO1xuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbmdldENvbnRlbnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgYWZmaXhlc19lbXB0eSwgcHJlZml4LCBzdWZmaXg7XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSwgZmFsc2UpO1xuICBwcmVmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gIHN1ZmZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBwcmVmaXggKyAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5jb250ZW50IHx8ICcnKSArIHN1ZmZpeDtcbiAgfVxuICBpZiAoYWZmaXhlc19lbXB0eSkge1xuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXg7XG4gIH1cbn07XG5cbnJlbmFtZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIHN0b3JhZ2U7XG4gICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICByZXR1cm4gc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gIH0pLnRoZW4oKHNhdmVkQ21kcykgPT4ge1xuICAgIHZhciBjbWQsIGNtZERhdGEsIG5ld05hbWUsIG9yaWduaW5hbE5hbWU7XG4gICAgb3JpZ25pbmFsTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZnJvbSddKTtcbiAgICBuZXdOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd0byddKTtcbiAgICBpZiAoKG9yaWduaW5hbE5hbWUgIT0gbnVsbCkgJiYgKG5ld05hbWUgIT0gbnVsbCkpIHtcbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG9yaWduaW5hbE5hbWUpO1xuICAgICAgaWYgKChzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0gIT0gbnVsbCkgJiYgKGNtZCAhPSBudWxsKSkge1xuICAgICAgICBpZiAoIShuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xKSkge1xuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCAnJykgKyBuZXdOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV07XG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsIGNtZERhdGEpO1xuICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhO1xuICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbnJlbW92ZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIG5hbWU7XG4gICAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcywgc3RvcmFnZTtcbiAgICAgICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbigoc2F2ZWRDbWRzKSA9PiB7XG4gICAgICAgIHZhciBjbWQsIGNtZERhdGE7XG4gICAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG5hbWUpO1xuICAgICAgICBpZiAoKHNhdmVkQ21kc1tuYW1lXSAhPSBudWxsKSAmJiAoY21kICE9IG51bGwpKSB7XG4gICAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tuYW1lXTtcbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV07XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFsaWFzQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnYWxpYXMnXSk7XG4gIGlmICgobmFtZSAhPSBudWxsKSAmJiAoYWxpYXMgIT0gbnVsbCkpIHtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgfHwgY21kO1xuICAgICAgLy8gdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAvLyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChhbGlhcywge1xuICAgICAgICBhbGlhc09mOiBjbWQuZnVsbE5hbWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH1cbn07XG5cbmxpc3RDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGJveCwgY29tbWFuZHMsIGNvbnRleHQsIG5hbWUsIG5hbWVzcGFjZXMsIHRleHQsIHVzZUNvbnRleHQ7XG4gIGJveCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2JveCddLCB0cnVlKTtcbiAgdXNlQ29udGV4dCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2NvbnRleHQnXSwgdHJ1ZSk7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIG5hbWVzcGFjZXMgPSBuYW1lID8gW25hbWVdIDogaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCkuZmlsdGVyKChuc3BjKSA9PiB7XG4gICAgcmV0dXJuIG5zcGMgIT09IGluc3RhbmNlLmNtZC5mdWxsTmFtZTtcbiAgfSkuY29uY2F0KFwiX3Jvb3RcIik7XG4gIGNvbnRleHQgPSB1c2VDb250ZXh0ID8gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKSA6IGluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0O1xuICBjb21tYW5kcyA9IG5hbWVzcGFjZXMucmVkdWNlKChjb21tYW5kcywgbnNwYykgPT4ge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gbnNwYyA9PT0gXCJfcm9vdFwiID8gQ29tbWFuZC5jbWRzIDogY29udGV4dC5nZXRDbWQobnNwYywge1xuICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlXG4gICAgfSk7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5jbWRzKSB7XG4gICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGNtZC5jbWRzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbW1hbmRzO1xuICB9LCBbXSk7XG4gIHRleHQgPSBjb21tYW5kcy5sZW5ndGggPyBjb21tYW5kcy5tYXAoKGNtZCkgPT4ge1xuICAgIGNtZC5pbml0KCk7XG4gICAgcmV0dXJuIChjbWQuaXNFeGVjdXRhYmxlKCkgPyAnfn4hJyA6ICd+fiFscyAnKSArIGNtZC5mdWxsTmFtZSArICd+fic7XG4gIH0pLmpvaW4oXCJcXG5cIikgOiBcIlRoaXMgY29udGFpbnMgbm8gc3ViLWNvbW1hbmRzXCI7XG4gIGlmIChib3gpIHtcbiAgICByZXR1cm4gYH5+Ym94fn5cXG4ke3RleHR9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbn07XG5cbmdldENvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgbmFtZSwgcmVzO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICByZXMgPSBQYXRoSGVscGVyLmdldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSk7XG4gIGlmICh0eXBlb2YgcmVzID09PSBcIm9iamVjdFwiKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlcywgbnVsbCwgJyAgJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufTtcblxuc2V0Q29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWw7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd2YWx1ZScsICd2YWwnXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lLCB2YWwpO1xuICByZXR1cm4gJyc7XG59O1xuXG5zdG9yZUpzb25Db21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHAsIHZhbDtcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2pzb24nXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lLCBKU09OLnBhcnNlKHZhbCkpO1xuICByZXR1cm4gJyc7XG59O1xuXG5nZXRQYXJhbSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGlmIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5nZXRQYXJhbShpbnN0YW5jZS5wYXJhbXMsIGluc3RhbmNlLmdldFBhcmFtKFsnZGVmJywgJ2RlZmF1bHQnXSkpO1xuICB9XG59O1xuXG5Cb3hDbWQgPSBjbGFzcyBCb3hDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5oZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuaW5zdGFuY2UuY29udGV4dCk7XG4gICAgdGhpcy5jbWQgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmhlbHBlci5vcGVuVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY21kICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgdGhpcy5oZWxwZXIuY2xvc2VUZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZC5zcGxpdChcIiBcIilbMF0gKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgfVxuICAgIHRoaXMuaGVscGVyLmRlY28gPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmRlY287XG4gICAgdGhpcy5oZWxwZXIucGFkID0gMjtcbiAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuc3VmZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG4gIH1cblxuICBoZWlnaHQoKSB7XG4gICAgdmFyIGhlaWdodCwgcGFyYW1zO1xuICAgIGlmICh0aGlzLmJvdW5kcygpICE9IG51bGwpIHtcbiAgICAgIGhlaWdodCA9IHRoaXMuYm91bmRzKCkuaGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWlnaHQgPSAzO1xuICAgIH1cbiAgICBwYXJhbXMgPSBbJ2hlaWdodCddO1xuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgxKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIGhlaWdodCk7XG4gIH1cblxuICB3aWR0aCgpIHtcbiAgICB2YXIgcGFyYW1zLCB3aWR0aDtcbiAgICBpZiAodGhpcy5ib3VuZHMoKSAhPSBudWxsKSB7XG4gICAgICB3aWR0aCA9IHRoaXMuYm91bmRzKCkud2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpZHRoID0gMztcbiAgICB9XG4gICAgcGFyYW1zID0gWyd3aWR0aCddO1xuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgwKTtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgubWF4KHRoaXMubWluV2lkdGgoKSwgdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSk7XG4gIH1cblxuICBib3VuZHMoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgaWYgKHRoaXMuX2JvdW5kcyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2JvdW5kcyA9IHRoaXMuaGVscGVyLnRleHRCb3VuZHModGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9ib3VuZHM7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHRoaXMuaGVscGVyLmhlaWdodCA9IHRoaXMuaGVpZ2h0KCk7XG4gICAgdGhpcy5oZWxwZXIud2lkdGggPSB0aGlzLndpZHRoKCk7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVyLmRyYXcodGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgfVxuXG4gIG1pbldpZHRoKCkge1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbWQubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxufTtcblxuQ2xvc2VDbWQgPSBjbGFzcyBDbG9zZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuaW5zdGFuY2UuY29udGV4dCk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHZhciBib3gsIGJveDIsIGRlcHRoLCBwcmVmaXgsIHJlcXVpcmVkX2FmZml4ZXMsIHN1ZmZpeDtcbiAgICBwcmVmaXggPSB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgICBzdWZmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgICBib3ggPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSk7XG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydyZXF1aXJlZF9hZmZpeGVzJ10sIHRydWUpO1xuICAgIGlmICghcmVxdWlyZWRfYWZmaXhlcykge1xuICAgICAgdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5oZWxwZXIuc3VmZml4ID0gJyc7XG4gICAgICBib3gyID0gdGhpcy5oZWxwZXIuZ2V0Qm94Rm9yUG9zKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkpO1xuICAgICAgaWYgKChib3gyICE9IG51bGwpICYmICgoYm94ID09IG51bGwpIHx8IGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIHx8IGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpKSB7XG4gICAgICAgIGJveCA9IGJveDI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChib3ggIT0gbnVsbCkge1xuICAgICAgZGVwdGggPSB0aGlzLmhlbHBlci5nZXROZXN0ZWRMdmwodGhpcy5pbnN0YW5jZS5nZXRQb3MoKS5zdGFydCk7XG4gICAgICBpZiAoZGVwdGggPCAyKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UuaW5Cb3ggPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LCBib3guZW5kLCAnJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5yZXBsYWNlV2l0aCgnJyk7XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWQgPSBjbGFzcyBFZGl0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHZhciByZWY7XG4gICAgdGhpcy5jbWROYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKTtcbiAgICB0aGlzLnZlcmJhbGl6ZSA9IChyZWYgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxXSkpID09PSAndicgfHwgcmVmID09PSAndmVyYmFsaXplJztcbiAgICBpZiAodGhpcy5jbWROYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpO1xuICAgICAgdGhpcy5maW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2U7XG4gICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZWRpdGFibGUgPSB0aGlzLmNtZCAhPSBudWxsID8gdGhpcy5jbWQuaXNFZGl0YWJsZSgpIDogdHJ1ZTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRoQ29udGVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRob3V0Q29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdFdpdGhDb250ZW50KCkge1xuICAgIHZhciBkYXRhLCBpLCBsZW4sIHAsIHBhcnNlciwgcmVmO1xuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgIHBhcnNlci5wYXJzZUFsbCgpO1xuICAgIGRhdGEgPSB7fTtcbiAgICByZWYgPSBFZGl0Q21kLnByb3BzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgcCA9IHJlZltpXTtcbiAgICAgIHAud3JpdGVGb3IocGFyc2VyLCBkYXRhKTtcbiAgICB9XG4gICAgQ29tbWFuZC5zYXZlQ21kKHRoaXMuY21kTmFtZSwgZGF0YSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcHJvcHNEaXNwbGF5KCkge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gdGhpcy5jbWQ7XG4gICAgcmV0dXJuIEVkaXRDbWQucHJvcHMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBwLmRpc3BsYXkoY21kKTtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHAgIT0gbnVsbDtcbiAgICB9KS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmVzdWx0V2l0aG91dENvbnRlbnQoKSB7XG4gICAgdmFyIG5hbWUsIHBhcnNlcjtcbiAgICBpZiAoIXRoaXMuY21kIHx8IHRoaXMuZWRpdGFibGUpIHtcbiAgICAgIG5hbWUgPSB0aGlzLmNtZCA/IHRoaXMuY21kLmZ1bGxOYW1lIDogdGhpcy5jbWROYW1lO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KGB+fmJveCBjbWQ6XCIke3RoaXMuaW5zdGFuY2UuY21kLmZ1bGxOYW1lfSAke25hbWV9XCJ+flxcbiR7dGhpcy5wcm9wc0Rpc3BsYXkoKX1cXG5+fiFzYXZlfn4gfn4hY2xvc2V+flxcbn5+L2JveH5+YCk7XG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLnZlcmJhbGl6ZSkge1xuICAgICAgICByZXR1cm4gcGFyc2VyLmdldFRleHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZC5zZXRDbWRzID0gZnVuY3Rpb24oYmFzZSkge1xuICB2YXIgaSwgaW5JbnN0YW5jZSwgbGVuLCBwLCByZWY7XG4gIGluSW5zdGFuY2UgPSBiYXNlLmluX2luc3RhbmNlID0ge1xuICAgIGNtZHM6IHt9XG4gIH07XG4gIHJlZiA9IEVkaXRDbWQucHJvcHM7XG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHAgPSByZWZbaV07XG4gICAgcC5zZXRDbWQoaW5JbnN0YW5jZS5jbWRzKTtcbiAgfVxuICAvLyBwLnNldENtZChiYXNlKVxuICByZXR1cm4gYmFzZTtcbn07XG5cbkVkaXRDbWQucHJvcHMgPSBbXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19jYXJyZXQnLFxuICB7XG4gICAgb3B0OiAnY2hlY2tDYXJyZXQnXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fcGFyc2UnLFxuICB7XG4gICAgb3B0OiAncGFyc2UnXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCgncHJldmVudF9wYXJzZV9hbGwnLFxuICB7XG4gICAgb3B0OiAncHJldmVudFBhcnNlQWxsJ1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3JlcGxhY2VfYm94JyxcbiAge1xuICAgIG9wdDogJ3JlcGxhY2VCb3gnXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCduYW1lX3RvX3BhcmFtJyxcbiAge1xuICAgIG9wdDogJ25hbWVUb1BhcmFtJ1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnYWxpYXNfb2YnLFxuICB7XG4gICAgdmFyOiAnYWxpYXNPZicsXG4gICAgY2FycmV0OiB0cnVlXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCdoZWxwJyxcbiAge1xuICAgIGZ1bmN0OiAnaGVscCcsXG4gICAgc2hvd0VtcHR5OiB0cnVlXG4gIH0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCdzb3VyY2UnLFxuICB7XG4gICAgdmFyOiAncmVzdWx0U3RyJyxcbiAgICBkYXRhTmFtZTogJ3Jlc3VsdCcsXG4gICAgc2hvd0VtcHR5OiB0cnVlLFxuICAgIGNhcnJldDogdHJ1ZVxuICB9KVxuXTtcblxuTmFtZVNwYWNlQ21kID0gY2xhc3MgTmFtZVNwYWNlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHJldHVybiB0aGlzLm5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswXSk7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdmFyIGksIGxlbiwgbmFtZXNwYWNlcywgbnNwYywgcGFyc2VyLCB0eHQ7XG4gICAgaWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0LmFkZE5hbWVTcGFjZSh0aGlzLm5hbWUpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VzID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKTtcbiAgICAgIHR4dCA9ICd+fmJveH5+XFxuJztcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IG5hbWVzcGFjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbnNwYyA9IG5hbWVzcGFjZXNbaV07XG4gICAgICAgIGlmIChuc3BjICE9PSB0aGlzLmluc3RhbmNlLmNtZC5mdWxsTmFtZSkge1xuICAgICAgICAgIHR4dCArPSBuc3BjICsgJ1xcbic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHR4dCArPSAnfn4hY2xvc2V8fn5cXG5+fi9ib3h+fic7XG4gICAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodHh0KTtcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICB9XG4gIH1cblxufTtcblxuVGVtcGxhdGVDbWQgPSBjbGFzcyBUZW1wbGF0ZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgICByZXR1cm4gdGhpcy5zZXAgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc2VwJ10sIFwiXFxuXCIpO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBkYXRhO1xuICAgIGRhdGEgPSB0aGlzLm5hbWUgPyBQYXRoSGVscGVyLmdldFBhdGgodGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCB0aGlzLm5hbWUpIDogdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzO1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQgJiYgKGRhdGEgIT0gbnVsbCkgJiYgZGF0YSAhPT0gZmFsc2UpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBkYXRhLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclRlbXBsYXRlKGl0ZW0pO1xuICAgICAgICB9KS5qb2luKHRoaXMuc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclRlbXBsYXRlKGRhdGEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVGVtcGxhdGUoZGF0YSkge1xuICAgIHZhciBwYXJzZXI7XG4gICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgcGFyc2VyLnZhcnMgPSB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiA/IGRhdGEgOiB7XG4gICAgICB2YWx1ZTogZGF0YVxuICAgIH07XG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG4gICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpO1xuICB9XG5cbn07XG5cbkVtbWV0Q21kID0gY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5hYmJyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2FiYnInLCAnYWJicmV2aWF0aW9uJ10pO1xuICAgIHJldHVybiB0aGlzLmxhbmcgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxLCAnbGFuZycsICdsYW5ndWFnZSddKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgZW1tZXQsIGV4LCByZXM7XG4gICAgZW1tZXQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IHdpbmRvdy5lbW1ldCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmID0gd2luZG93LnNlbGYpICE9IG51bGwgPyByZWYuZW1tZXQgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZWxmLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmMSA9IHdpbmRvdy5nbG9iYWwpICE9IG51bGwgPyByZWYxLmVtbWV0IDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2xvYmFsLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiByZXF1aXJlICE9PSBudWxsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJ2VtbWV0Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmxvZ2dlci5sb2coJ0VtbWV0IGlzIG5vdCBhdmFpbGFibGUsIGl0IG1heSBuZWVkIHRvIGJlIGluc3RhbGxlZCBtYW51YWxseScpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkuY2FsbCh0aGlzKTtcbiAgICBpZiAoZW1tZXQgIT0gbnVsbCkge1xuICAgICAgLy8gZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKHRoaXMuYWJiciwgdGhpcy5sYW5nKTtcbiAgICAgIHJldHVybiByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kLCBCYXNlQ29tbWFuZCB9IGZyb20gJy4uL0NvbW1hbmQnO1xuaW1wb3J0IHsgTGFuZ0RldGVjdG9yIH0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi4vQm94SGVscGVyJztcbmltcG9ydCB7IEVkaXRDbWRQcm9wIH0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGF0aEhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvUGF0aEhlbHBlcic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIEZpbGVDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnZmlsZScpKVxuICBcbiAgY29yZS5hZGRDbWRzKHtcbiAgICBcInJlYWRcIjoge1xuICAgICAgJ3Jlc3VsdCcgOiByZWFkQ29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydmaWxlJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHJlYWQgdGhlIGNvbnRlbnQgb2YgYSBmaWxlXG4gICAgICAgIFwiXCJcIlxuICAgIH1cbiAgICBcIndyaXRlXCI6IHtcbiAgICAgICdyZXN1bHQnIDogd3JpdGVDb21tYW5kXG4gICAgICAnYWxsb3dlZE5hbWVkJzpbJ2ZpbGUnLCdjb250ZW50J11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIHNhdmUgaW50byBhIGZpbGVcbiAgICAgICAgXCJcIlwiXG4gICAgfVxuICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICdyZXN1bHQnIDogZGVsZXRlQ29tbWFuZFxuICAgICAgJ2FsbG93ZWROYW1lZCc6WydmaWxlJ11cbiAgICAgICdoZWxwJzogXCJcIlwiXG4gICAgICAgIGRlbGV0ZSBhIGZpbGVcbiAgICAgICAgXCJcIlwiXG4gICAgfVxuICB9KVxuXG5yZWFkQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKVxuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2ZpbGUnXSlcbiAgaWYgZmlsZVN5c3RlbVxuICAgIGZpbGVTeXN0ZW0ucmVhZEZpbGUoZmlsZSlcblxud3JpdGVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZmlsZSddKVxuICBjb250ZW50ID0gaW5zdGFuY2UuY29udGVudCBvciBpbnN0YW5jZS5nZXRQYXJhbShbMSwnY29udGVudCddKVxuICBpZiBmaWxlU3lzdGVtXG4gICAgZmlsZVN5c3RlbS53cml0ZUZpbGUoZmlsZSxjb250ZW50KVxuICAgICAgXG5kZWxldGVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnZmlsZSddKVxuICBpZiBmaWxlU3lzdGVtXG4gICAgZmlsZVN5c3RlbS5kZWxldGVGaWxlKGZpbGUpIiwidmFyIGRlbGV0ZUNvbW1hbmQsIHJlYWRDb21tYW5kLCB3cml0ZUNvbW1hbmQ7XG5cbmltcG9ydCB7XG4gIENvbW1hbmQsXG4gIEJhc2VDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBMYW5nRGV0ZWN0b3Jcbn0gZnJvbSAnLi4vRGV0ZWN0b3InO1xuXG5pbXBvcnQge1xuICBCb3hIZWxwZXJcbn0gZnJvbSAnLi4vQm94SGVscGVyJztcblxuaW1wb3J0IHtcbiAgRWRpdENtZFByb3Bcbn0gZnJvbSAnLi4vRWRpdENtZFByb3AnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYXRoSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvUGF0aEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IHZhciBGaWxlQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgRmlsZUNvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgY29yZTtcbiAgICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2ZpbGUnKSk7XG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICBcInJlYWRcIjoge1xuICAgICAgICAncmVzdWx0JzogcmVhZENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2ZpbGUnXSxcbiAgICAgICAgJ2hlbHAnOiBcInJlYWQgdGhlIGNvbnRlbnQgb2YgYSBmaWxlXCJcbiAgICAgIH0sXG4gICAgICBcIndyaXRlXCI6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHdyaXRlQ29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnZmlsZScsICdjb250ZW50J10sXG4gICAgICAgICdoZWxwJzogXCJzYXZlIGludG8gYSBmaWxlXCJcbiAgICAgIH0sXG4gICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICdyZXN1bHQnOiBkZWxldGVDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydmaWxlJ10sXG4gICAgICAgICdoZWxwJzogXCJkZWxldGUgYSBmaWxlXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuXG5yZWFkQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtO1xuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpO1xuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pO1xuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLnJlYWRGaWxlKGZpbGUpO1xuICB9XG59O1xuXG53cml0ZUNvbW1hbmQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB2YXIgY29udGVudCwgZmlsZSwgZmlsZVN5c3RlbTtcbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKTtcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKTtcbiAgY29udGVudCA9IGluc3RhbmNlLmNvbnRlbnQgfHwgaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdjb250ZW50J10pO1xuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLndyaXRlRmlsZShmaWxlLCBjb250ZW50KTtcbiAgfVxufTtcblxuZGVsZXRlQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtO1xuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpO1xuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pO1xuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLmRlbGV0ZUZpbGUoZmlsZSk7XG4gIH1cbn07XG4iLCJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEh0bWxDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGh0bWwgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnaHRtbCcpKVxuICBodG1sLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6ZW1tZXQnLFxuICAgICAgJ2RlZmF1bHRzJyA6IHsnbGFuZyc6J2h0bWwnfSxcbiAgICAgICduYW1lVG9QYXJhbScgOiAnYWJicidcbiAgICB9LFxuICB9KVxuICBcbiAgY3NzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NzcycpKVxuICBjc3MuYWRkQ21kcyh7XG4gICAgJ2ZhbGxiYWNrJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTplbW1ldCcsXG4gICAgICAnZGVmYXVsdHMnIDogeydsYW5nJzonY3NzJ30sXG4gICAgICAnbmFtZVRvUGFyYW0nIDogJ2FiYnInXG4gICAgfSxcbiAgfSlcblxuIiwiaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBIdG1sQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSHRtbENvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgY3NzLCBodG1sO1xuICAgIGh0bWwgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnaHRtbCcpKTtcbiAgICBodG1sLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmVtbWV0JyxcbiAgICAgICAgJ2RlZmF1bHRzJzoge1xuICAgICAgICAgICdsYW5nJzogJ2h0bWwnXG4gICAgICAgIH0sXG4gICAgICAgICduYW1lVG9QYXJhbSc6ICdhYmJyJ1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNzcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjc3MnKSk7XG4gICAgcmV0dXJuIGNzcy5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplbW1ldCcsXG4gICAgICAgICdkZWZhdWx0cyc6IHtcbiAgICAgICAgICAnbGFuZyc6ICdjc3MnXG4gICAgICAgIH0sXG4gICAgICAgICduYW1lVG9QYXJhbSc6ICdhYmJyJ1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEpzQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBqcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqcycpKVxuICBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnamF2YXNjcmlwdCcseyBhbGlhc09mOiAnanMnIH0pKVxuICBqcy5hZGRDbWRzKHtcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgJ2lmJzogICdpZih8KXtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdsb2cnOiAgJ2lmKHdpbmRvdy5jb25zb2xlKXtcXG5cXHRjb25zb2xlLmxvZyh+fmNvbnRlbnR+fnwpXFxufScsXG4gICAgJ2Z1bmN0aW9uJzpcdCdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2Z1bmN0Jzp7IGFsaWFzT2Y6ICdqczpmdW5jdGlvbicgfSxcbiAgICAnZic6eyAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJyB9LFxuICAgICdmb3InOiBcdFx0J2ZvciAodmFyIGkgPSAwOyBpIDwgfDsgaSsrKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnZm9yaW4nOidmb3IgKHZhciB2YWwgaW4gfCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2VhY2gnOnsgIGFsaWFzT2Y6ICdqczpmb3JpbicgfSxcbiAgICAnZm9yZWFjaCc6eyAgYWxpYXNPZjogJ2pzOmZvcmluJyB9LFxuICAgICd3aGlsZSc6ICAnd2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ3doaWxlaSc6ICd2YXIgaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxuXFx0aSsrO1xcbn0nLFxuICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICdpZmUnOnsgICBhbGlhc09mOiAnanM6aWZlbHNlJyB9LFxuICAgICdzd2l0Y2gnOlx0XCJcIlwiXG4gICAgICBzd2l0Y2goIHwgKSB7IFxuICAgICAgXFx0Y2FzZSA6XG4gICAgICBcXHRcXHR+fmNvbnRlbnR+flxuICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICBcXHRkZWZhdWx0IDpcbiAgICAgIFxcdFxcdFxuICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICB9XG4gICAgICBcIlwiXCIsXG4gIH0pXG4iLCJpbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4uL0NvbW1hbmQnO1xuXG5leHBvcnQgdmFyIEpzQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSnNDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGpzO1xuICAgIGpzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2pzJykpO1xuICAgIGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqYXZhc2NyaXB0Jywge1xuICAgICAgYWxpYXNPZjogJ2pzJ1xuICAgIH0pKTtcbiAgICByZXR1cm4ganMuYWRkQ21kcyh7XG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICAnaWYnOiAnaWYofCl7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdsb2cnOiAnaWYod2luZG93LmNvbnNvbGUpe1xcblxcdGNvbnNvbGUubG9nKH5+Y29udGVudH5+fClcXG59JyxcbiAgICAgICdmdW5jdGlvbic6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZnVuY3QnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZic6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmb3InOiAnZm9yICh2YXIgaSA9IDA7IGkgPCB8OyBpKyspIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2ZvcmluJzogJ2ZvciAodmFyIHZhbCBpbiB8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgJ2ZvcmVhY2gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmb3JpbidcbiAgICAgIH0sXG4gICAgICAnd2hpbGUnOiAnd2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnd2hpbGVpJzogJ3ZhciBpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG5cXHRpKys7XFxufScsXG4gICAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+Y29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAgICdpZmUnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczppZmVsc2UnXG4gICAgICB9LFxuICAgICAgJ3N3aXRjaCc6IFwic3dpdGNoKCB8ICkgeyBcXG5cXHRjYXNlIDpcXG5cXHRcXHR+fmNvbnRlbnR+flxcblxcdFxcdGJyZWFrO1xcblxcdGRlZmF1bHQgOlxcblxcdFxcdFxcblxcdFxcdGJyZWFrO1xcbn1cIlxuICAgIH0pO1xuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcbmltcG9ydCB7IFBhaXJEZXRlY3RvciB9IGZyb20gJy4uL0RldGVjdG9yJztcblxuZXhwb3J0IGNsYXNzIFBocENvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAgcGhwID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ3BocCcpKVxuICBwaHAuYWRkRGV0ZWN0b3IobmV3IFBhaXJEZXRlY3Rvcih7XG4gICAgcmVzdWx0OiAncGhwOmlubmVyJyxcbiAgICBvcGVuZXI6ICc8P3BocCcsXG4gICAgY2xvc2VyOiAnPz4nLFxuICAgIG9wdGlvbm5hbF9lbmQ6IHRydWUsXG4gICAgJ2Vsc2UnOiAncGhwOm91dGVyJ1xuICB9KSkgXG5cbiAgcGhwT3V0ZXIgPSBwaHAuYWRkQ21kKG5ldyBDb21tYW5kKCdvdXRlcicpKVxuICBwaHBPdXRlci5hZGRDbWRzKHtcbiAgICAnZmFsbGJhY2snOntcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ2FueV9jb250ZW50JzogeyBcbiAgICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50JyBcbiAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgcHJlZml4OiAnID8+XFxuJ1xuICAgICAgICAgICAgc3VmZml4OiAnXFxuPD9waHAgJ1xuICAgICAgICAgICAgYWZmaXhlc19lbXB0eTogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6JW5hbWUlJyxcbiAgICAgIGFsdGVyUmVzdWx0OiB3cmFwV2l0aFBocFxuICAgIH0sXG4gICAgJ2JveCc6IHsgXG4gICAgICBhbGlhc09mOiAnY29yZTpib3gnIFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nXG4gICAgICAgIHN1ZmZpeDogJ1xcbj8+J1xuICAgICAgfVxuICAgIH0sXG4gICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgIHBocDogJzw/cGhwXFxuXFx0fn5jb250ZW50fn58XFxuPz4nLFxuICB9KVxuICBcbiAgcGhwSW5uZXIgPSBwaHAuYWRkQ21kKG5ldyBDb21tYW5kKCdpbm5lcicpKVxuICBwaHBJbm5lci5hZGRDbWRzKHtcbiAgICAnYW55X2NvbnRlbnQnOiB7IGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnIH0sXG4gICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICdpZic6ICAgJ2lmKHwpe1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICdpbmZvJzogJ3BocGluZm8oKTsnLFxuICAgICdlY2hvJzogJ2VjaG8gfCcsXG4gICAgJ2UnOnsgICBhbGlhc09mOiAncGhwOmlubmVyOmVjaG8nIH0sXG4gICAgJ2NsYXNzJzp7XG4gICAgICByZXN1bHQgOiBcIlwiXCJcbiAgICAgICAgY2xhc3Mgfn5wYXJhbSAwIGNsYXNzIGRlZjp8fn4ge1xuICAgICAgICBcXHRmdW5jdGlvbiBfX2NvbnN0cnVjdCgpIHtcbiAgICAgICAgXFx0XFx0fn5jb250ZW50fn58XG4gICAgICAgIFxcdH1cbiAgICAgICAgfVxuICAgICAgICBcIlwiXCIsXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAnYyc6eyAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpjbGFzcycgfSxcbiAgICAnZnVuY3Rpb24nOlx0e1xuICAgICAgcmVzdWx0IDogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59J1xuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2Z1bmN0Jzp7IGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZnVuY3Rpb24nIH0sXG4gICAgJ2YnOnsgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZnVuY3Rpb24nIH0sXG4gICAgJ2FycmF5JzogICckfCA9IGFycmF5KCk7JyxcbiAgICAnYSc6XHQgICAgJ2FycmF5KCknLFxuICAgICdmb3InOiBcdFx0J2ZvciAoJGkgPSAwOyAkaSA8ICR8OyAkaSsrKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ2ZvcmVhY2gnOidmb3JlYWNoICgkfCBhcyAka2V5ID0+ICR2YWwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnZWFjaCc6eyAgYWxpYXNPZjogJ3BocDppbm5lcjpmb3JlYWNoJyB9LFxuICAgICd3aGlsZSc6ICAnd2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICd3aGlsZWknOiB7XG4gICAgICByZXN1bHQgOiAnJGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG5cXHQkaSsrO1xcbn0nLFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICdpZmUnOnsgICBhbGlhc09mOiAncGhwOmlubmVyOmlmZWxzZScgfSxcbiAgICAnc3dpdGNoJzpcdHtcbiAgICAgIHJlc3VsdCA6IFwiXCJcIlxuICAgICAgICBzd2l0Y2goIHwgKSB7IFxuICAgICAgICBcXHRjYXNlIDpcbiAgICAgICAgXFx0XFx0fn5hbnlfY29udGVudH5+XG4gICAgICAgIFxcdFxcdGJyZWFrO1xuICAgICAgICBcXHRkZWZhdWx0IDpcbiAgICAgICAgXFx0XFx0XG4gICAgICAgIFxcdFxcdGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIFwiXCJcIixcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgJ2Nsb3NlJzogeyBcbiAgICAgIGFsaWFzT2Y6ICdjb3JlOmNsb3NlJyBcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHByZWZpeDogJzw/cGhwXFxuJ1xuICAgICAgICBzdWZmaXg6ICdcXG4/PidcbiAgICAgICAgcmVxdWlyZWRfYWZmaXhlczogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICB9KVxuICBcblxud3JhcFdpdGhQaHAgPSAocmVzdWx0LGluc3RhbmNlKSAtPlxuICBpbmxpbmUgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3BocF9pbmxpbmUnLCdpbmxpbmUnXSx0cnVlKVxuICBpZiBpbmxpbmVcbiAgICByZWdPcGVuID0gLzxcXD9waHBcXHMoW1xcXFxuXFxcXHJcXHNdKykvZ1xuICAgIHJlZ0Nsb3NlID0gLyhbXFxuXFxyXFxzXSspXFxzXFw/Pi9nXG4gICAgcmV0dXJuICc8P3BocCAnICsgcmVzdWx0LnJlcGxhY2UocmVnT3BlbiwgJyQxPD9waHAgJykucmVwbGFjZShyZWdDbG9zZSwgJyA/PiQxJykgKyAnID8+J1xuICBlbHNlXG4gICAgJzw/cGhwXFxuJyArIFN0cmluZ0hlbHBlci5pbmRlbnQocmVzdWx0KSArICdcXG4/PidcblxuIyBjbG9zZVBocEZvckNvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4jICAgaW5zdGFuY2UuY29udGVudCA9ICcgPz4nKyhpbnN0YW5jZS5jb250ZW50IHx8ICcnKSsnPD9waHAgJyIsInZhciB3cmFwV2l0aFBocDtcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgUGFpckRldGVjdG9yXG59IGZyb20gJy4uL0RldGVjdG9yJztcblxuZXhwb3J0IHZhciBQaHBDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBQaHBDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIHBocCwgcGhwSW5uZXIsIHBocE91dGVyO1xuICAgIHBocCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdwaHAnKSk7XG4gICAgcGhwLmFkZERldGVjdG9yKG5ldyBQYWlyRGV0ZWN0b3Ioe1xuICAgICAgcmVzdWx0OiAncGhwOmlubmVyJyxcbiAgICAgIG9wZW5lcjogJzw/cGhwJyxcbiAgICAgIGNsb3NlcjogJz8+JyxcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IHRydWUsXG4gICAgICAnZWxzZSc6ICdwaHA6b3V0ZXInXG4gICAgfSkpO1xuICAgIHBocE91dGVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnb3V0ZXInKSk7XG4gICAgcGhwT3V0ZXIuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdhbnlfY29udGVudCc6IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnLFxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgcHJlZml4OiAnID8+XFxuJyxcbiAgICAgICAgICAgICAgc3VmZml4OiAnXFxuPD9waHAgJyxcbiAgICAgICAgICAgICAgYWZmaXhlc19lbXB0eTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjolbmFtZSUnLFxuICAgICAgICBhbHRlclJlc3VsdDogd3JhcFdpdGhQaHBcbiAgICAgIH0sXG4gICAgICAnYm94Jzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpib3gnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgIHBocDogJzw/cGhwXFxuXFx0fn5jb250ZW50fn58XFxuPz4nXG4gICAgfSk7XG4gICAgcGhwSW5uZXIgPSBwaHAuYWRkQ21kKG5ldyBDb21tYW5kKCdpbm5lcicpKTtcbiAgICByZXR1cm4gcGhwSW5uZXIuYWRkQ21kcyh7XG4gICAgICAnYW55X2NvbnRlbnQnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnXG4gICAgICB9LFxuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgJ2lmJzogJ2lmKHwpe1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2luZm8nOiAncGhwaW5mbygpOycsXG4gICAgICAnZWNobyc6ICdlY2hvIHwnLFxuICAgICAgJ2UnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZWNobydcbiAgICAgIH0sXG4gICAgICAnY2xhc3MnOiB7XG4gICAgICAgIHJlc3VsdDogXCJjbGFzcyB+fnBhcmFtIDAgY2xhc3MgZGVmOnx+fiB7XFxuXFx0ZnVuY3Rpb24gX19jb25zdHJ1Y3QoKSB7XFxuXFx0XFx0fn5jb250ZW50fn58XFxuXFx0fVxcbn1cIixcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnYyc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpjbGFzcydcbiAgICAgIH0sXG4gICAgICAnZnVuY3Rpb24nOiB7XG4gICAgICAgIHJlc3VsdDogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnZnVuY3QnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2YnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2FycmF5JzogJyR8ID0gYXJyYXkoKTsnLFxuICAgICAgJ2EnOiAnYXJyYXkoKScsXG4gICAgICAnZm9yJzogJ2ZvciAoJGkgPSAwOyAkaSA8ICR8OyAkaSsrKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnZm9yZWFjaCc6ICdmb3JlYWNoICgkfCBhcyAka2V5ID0+ICR2YWwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZvcmVhY2gnXG4gICAgICB9LFxuICAgICAgJ3doaWxlJzogJ3doaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICd3aGlsZWknOiB7XG4gICAgICAgIHJlc3VsdDogJyRpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxuXFx0JGkrKztcXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgICAnaWZlJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmlmZWxzZSdcbiAgICAgIH0sXG4gICAgICAnc3dpdGNoJzoge1xuICAgICAgICByZXN1bHQ6IFwic3dpdGNoKCB8ICkgeyBcXG5cXHRjYXNlIDpcXG5cXHRcXHR+fmFueV9jb250ZW50fn5cXG5cXHRcXHRicmVhaztcXG5cXHRkZWZhdWx0IDpcXG5cXHRcXHRcXG5cXHRcXHRicmVhaztcXG59XCIsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Nsb3NlJzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjbG9zZScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nLFxuICAgICAgICAgIHN1ZmZpeDogJ1xcbj8+JyxcbiAgICAgICAgICByZXF1aXJlZF9hZmZpeGVzOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcblxud3JhcFdpdGhQaHAgPSBmdW5jdGlvbihyZXN1bHQsIGluc3RhbmNlKSB7XG4gIHZhciBpbmxpbmUsIHJlZ0Nsb3NlLCByZWdPcGVuO1xuICBpbmxpbmUgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3BocF9pbmxpbmUnLCAnaW5saW5lJ10sIHRydWUpO1xuICBpZiAoaW5saW5lKSB7XG4gICAgcmVnT3BlbiA9IC88XFw/cGhwXFxzKFtcXFxcblxcXFxyXFxzXSspL2c7XG4gICAgcmVnQ2xvc2UgPSAvKFtcXG5cXHJcXHNdKylcXHNcXD8+L2c7XG4gICAgcmV0dXJuICc8P3BocCAnICsgcmVzdWx0LnJlcGxhY2UocmVnT3BlbiwgJyQxPD9waHAgJykucmVwbGFjZShyZWdDbG9zZSwgJyA/PiQxJykgKyAnID8+JztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJzw/cGhwXFxuJyArIFN0cmluZ0hlbHBlci5pbmRlbnQocmVzdWx0KSArICdcXG4/Pic7XG4gIH1cbn07XG5cbi8vIGNsb3NlUGhwRm9yQ29udGVudCA9IChpbnN0YW5jZSkgLT5cbi8vICAgaW5zdGFuY2UuY29udGVudCA9ICcgPz4nKyhpbnN0YW5jZS5jb250ZW50IHx8ICcnKSsnPD9waHAgJ1xuIiwiaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL2Jvb3RzdHJhcCc7XG5pbXBvcnQgeyBUZXh0QXJlYUVkaXRvciB9IGZyb20gJy4vVGV4dEFyZWFFZGl0b3InO1xuXG5Db2Rld2F2ZS5kZXRlY3QgPSAodGFyZ2V0KSAtPlxuICBjdyA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dEFyZWFFZGl0b3IodGFyZ2V0KSlcbiAgQ29kZXdhdmUuaW5zdGFuY2VzLnB1c2goY3cpXG4gIGN3XG5cbkNvZGV3YXZlLnJlcXVpcmUgPSByZXF1aXJlXG5cbndpbmRvdy5Db2Rld2F2ZSA9IENvZGV3YXZlXG5cbiAgIiwiaW1wb3J0IHtcbiAgQ29kZXdhdmVcbn0gZnJvbSAnLi9ib290c3RyYXAnO1xuXG5pbXBvcnQge1xuICBUZXh0QXJlYUVkaXRvclxufSBmcm9tICcuL1RleHRBcmVhRWRpdG9yJztcblxuQ29kZXdhdmUuZGV0ZWN0ID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gIHZhciBjdztcbiAgY3cgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRBcmVhRWRpdG9yKHRhcmdldCkpO1xuICBDb2Rld2F2ZS5pbnN0YW5jZXMucHVzaChjdyk7XG4gIHJldHVybiBjdztcbn07XG5cbkNvZGV3YXZlLnJlcXVpcmUgPSByZXF1aXJlO1xuXG53aW5kb3cuQ29kZXdhdmUgPSBDb2Rld2F2ZTtcbiIsImV4cG9ydCBjbGFzcyBBcnJheUhlbHBlclxuICBAaXNBcnJheTogKGFycikgLT5cbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCBhcnIgKSA9PSAnW29iamVjdCBBcnJheV0nXG4gIFxuICBAdW5pb246IChhMSxhMikgLT5cbiAgICBAdW5pcXVlKGExLmNvbmNhdChhMikpXG4gICAgXG4gIEB1bmlxdWU6IChhcnJheSkgLT5cbiAgICBhID0gYXJyYXkuY29uY2F0KClcbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCBhLmxlbmd0aFxuICAgICAgaiA9IGkgKyAxXG4gICAgICB3aGlsZSBqIDwgYS5sZW5ndGhcbiAgICAgICAgaWYgYVtpXSA9PSBhW2pdXG4gICAgICAgICAgYS5zcGxpY2Uoai0tLCAxKVxuICAgICAgICArK2pcbiAgICAgICsraVxuICAgIGEiLCJleHBvcnQgdmFyIEFycmF5SGVscGVyID0gY2xhc3MgQXJyYXlIZWxwZXIge1xuICBzdGF0aWMgaXNBcnJheShhcnIpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH1cblxuICBzdGF0aWMgdW5pb24oYTEsIGEyKSB7XG4gICAgcmV0dXJuIHRoaXMudW5pcXVlKGExLmNvbmNhdChhMikpO1xuICB9XG5cbiAgc3RhdGljIHVuaXF1ZShhcnJheSkge1xuICAgIHZhciBhLCBpLCBqO1xuICAgIGEgPSBhcnJheS5jb25jYXQoKTtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IGEubGVuZ3RoKSB7XG4gICAgICBqID0gaSArIDE7XG4gICAgICB3aGlsZSAoaiA8IGEubGVuZ3RoKSB7XG4gICAgICAgIGlmIChhW2ldID09PSBhW2pdKSB7XG4gICAgICAgICAgYS5zcGxpY2Uoai0tLCAxKTtcbiAgICAgICAgfVxuICAgICAgICArK2o7XG4gICAgICB9XG4gICAgICArK2k7XG4gICAgfVxuICAgIHJldHVybiBhO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgQ29tbW9uSGVscGVyXG5cbiAgQG1lcmdlOiAoeHMuLi4pIC0+XG4gICAgaWYgeHM/Lmxlbmd0aCA+IDBcbiAgICAgIEB0YXAge30sIChtKSAtPiBtW2tdID0gdiBmb3IgaywgdiBvZiB4IGZvciB4IGluIHhzXG4gXG4gIEB0YXA6IChvLCBmbikgLT4gXG4gICAgZm4obylcbiAgICBvXG5cbiAgQGFwcGx5TWl4aW5zOiAoZGVyaXZlZEN0b3IsIGJhc2VDdG9ycykgLT4gXG4gICAgYmFzZUN0b3JzLmZvckVhY2ggKGJhc2VDdG9yKSA9PiBcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2VDdG9yLnByb3RvdHlwZSkuZm9yRWFjaCAobmFtZSk9PiBcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVyaXZlZEN0b3IsIG5hbWUsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZUN0b3IucHJvdG90eXBlLCBuYW1lKSkiLCJleHBvcnQgdmFyIENvbW1vbkhlbHBlciA9IGNsYXNzIENvbW1vbkhlbHBlciB7XG4gIHN0YXRpYyBtZXJnZSguLi54cykge1xuICAgIGlmICgoeHMgIT0gbnVsbCA/IHhzLmxlbmd0aCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy50YXAoe30sIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgdmFyIGksIGssIGxlbiwgcmVzdWx0cywgdiwgeDtcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB4cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHggPSB4c1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMxO1xuICAgICAgICAgICAgcmVzdWx0czEgPSBbXTtcbiAgICAgICAgICAgIGZvciAoayBpbiB4KSB7XG4gICAgICAgICAgICAgIHYgPSB4W2tdO1xuICAgICAgICAgICAgICByZXN1bHRzMS5wdXNoKG1ba10gPSB2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzMTtcbiAgICAgICAgICB9KSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB0YXAobywgZm4pIHtcbiAgICBmbihvKTtcbiAgICByZXR1cm4gbztcbiAgfVxuXG4gIHN0YXRpYyBhcHBseU1peGlucyhkZXJpdmVkQ3RvciwgYmFzZUN0b3JzKSB7XG4gICAgcmV0dXJuIGJhc2VDdG9ycy5mb3JFYWNoKChiYXNlQ3RvcikgPT4ge1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2VDdG9yLnByb3RvdHlwZSkuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLCBuYW1lLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2VDdG9yLnByb3RvdHlwZSwgbmFtZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxufTtcbiIsIlxuZXhwb3J0IGNsYXNzIE5hbWVzcGFjZUhlbHBlclxuXG4gIEBzcGxpdEZpcnN0OiAoZnVsbG5hbWUsaXNTcGFjZSA9IGZhbHNlKSAtPlxuICAgIGlmIGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09IC0xIGFuZCAhaXNTcGFjZVxuICAgICAgcmV0dXJuIFtudWxsLGZ1bGxuYW1lXVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIHJldHVybiBbcGFydHMuc2hpZnQoKSxwYXJ0cy5qb2luKCc6JykgfHwgbnVsbF1cblxuICBAc3BsaXQ6IChmdWxsbmFtZSkgLT5cbiAgICBpZiBmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PSAtMVxuICAgICAgcmV0dXJuIFtudWxsLGZ1bGxuYW1lXVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIG5hbWUgPSBwYXJ0cy5wb3AoKVxuICAgIFtwYXJ0cy5qb2luKCc6JyksbmFtZV0iLCJleHBvcnQgdmFyIE5hbWVzcGFjZUhlbHBlciA9IGNsYXNzIE5hbWVzcGFjZUhlbHBlciB7XG4gIHN0YXRpYyBzcGxpdEZpcnN0KGZ1bGxuYW1lLCBpc1NwYWNlID0gZmFsc2UpIHtcbiAgICB2YXIgcGFydHM7XG4gICAgaWYgKGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09PSAtMSAmJiAhaXNTcGFjZSkge1xuICAgICAgcmV0dXJuIFtudWxsLCBmdWxsbmFtZV07XG4gICAgfVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKTtcbiAgICByZXR1cm4gW3BhcnRzLnNoaWZ0KCksIHBhcnRzLmpvaW4oJzonKSB8fCBudWxsXTtcbiAgfVxuXG4gIHN0YXRpYyBzcGxpdChmdWxsbmFtZSkge1xuICAgIHZhciBuYW1lLCBwYXJ0cztcbiAgICBpZiAoZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT09IC0xKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXTtcbiAgICB9XG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpO1xuICAgIG5hbWUgPSBwYXJ0cy5wb3AoKTtcbiAgICByZXR1cm4gW3BhcnRzLmpvaW4oJzonKSwgbmFtZV07XG4gIH1cblxufTtcbiIsIlxuZXhwb3J0IGNsYXNzIE9wdGlvbmFsUHJvbWlzZVxuICAgIGNvbnN0cnVjdG9yOiAoQHZhbCkgLT5cbiAgICAgICAgaWYgQHZhbD8gYW5kIEB2YWwudGhlbj8gYW5kIEB2YWwucmVzdWx0P1xuICAgICAgICAgICAgQHZhbCA9IEB2YWwucmVzdWx0KClcbiAgICB0aGVuOiAoY2IpIC0+XG4gICAgICAgIGlmIEB2YWw/IGFuZCBAdmFsLnRoZW4/XG4gICAgICAgICAgICBuZXcgT3B0aW9uYWxQcm9taXNlKEB2YWwudGhlbihjYikpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ldyBPcHRpb25hbFByb21pc2UoY2IoQHZhbCkpXG4gICAgcmVzdWx0OiAtPlxuICAgICAgICBAdmFsXG5cbmV4cG9ydCBvcHRpb25hbFByb21pc2UgPSAodmFsKS0+IFxuICAgIG5ldyBPcHRpb25hbFByb21pc2UodmFsKVxuXG5cbiIsImV4cG9ydCB2YXIgT3B0aW9uYWxQcm9taXNlID0gY2xhc3MgT3B0aW9uYWxQcm9taXNlIHtcbiAgY29uc3RydWN0b3IodmFsMSkge1xuICAgIHRoaXMudmFsID0gdmFsMTtcbiAgICBpZiAoKHRoaXMudmFsICE9IG51bGwpICYmICh0aGlzLnZhbC50aGVuICE9IG51bGwpICYmICh0aGlzLnZhbC5yZXN1bHQgIT0gbnVsbCkpIHtcbiAgICAgIHRoaXMudmFsID0gdGhpcy52YWwucmVzdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgdGhlbihjYikge1xuICAgIGlmICgodGhpcy52YWwgIT0gbnVsbCkgJiYgKHRoaXMudmFsLnRoZW4gIT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKHRoaXMudmFsLnRoZW4oY2IpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UoY2IodGhpcy52YWwpKTtcbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsO1xuICB9XG5cbn07XG5cbmV4cG9ydCB2YXIgb3B0aW9uYWxQcm9taXNlID0gZnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKHZhbCk7XG59O1xuIiwiZXhwb3J0IGNsYXNzIFBhdGhIZWxwZXJcbiAgQGdldFBhdGg6IChvYmoscGF0aCxzZXA9Jy4nKSAtPlxuICAgIHBhcnRzID0gcGF0aC5zcGxpdChzZXApXG4gICAgY3VyID0gb2JqXG4gICAgcGFydHMuZmluZCAocGFydCkgPT5cbiAgICAgIGN1ciA9IGN1cltwYXJ0XVxuICAgICAgdHlwZW9mIGN1ciA9PSBcInVuZGVmaW5lZFwiXG4gICAgY3VyXG4gICAgXG4gIFxuICBAc2V0UGF0aDogKG9iaixwYXRoLHZhbCxzZXA9Jy4nKSAtPlxuICAgIHBhcnRzID0gcGF0aC5zcGxpdChzZXApXG4gICAgbGFzdCA9IHBhcnRzLnBvcCgpXG4gICAgcGFydHMucmVkdWNlKChjdXIscGFydCkgPT5cbiAgICAgIGlmIGN1cltwYXJ0XT9cbiAgICAgICAgY3VyW3BhcnRdXG4gICAgICBlbHNlXG4gICAgICAgIGN1cltwYXJ0XSA9IHt9XG4gICAgLCBvYmopW2xhc3RdID0gdmFsXG4gICAgIiwiZXhwb3J0IHZhciBQYXRoSGVscGVyID0gY2xhc3MgUGF0aEhlbHBlciB7XG4gIHN0YXRpYyBnZXRQYXRoKG9iaiwgcGF0aCwgc2VwID0gJy4nKSB7XG4gICAgdmFyIGN1ciwgcGFydHM7XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcCk7XG4gICAgY3VyID0gb2JqO1xuICAgIHBhcnRzLmZpbmQoKHBhcnQpID0+IHtcbiAgICAgIGN1ciA9IGN1cltwYXJ0XTtcbiAgICAgIHJldHVybiB0eXBlb2YgY3VyID09PSBcInVuZGVmaW5lZFwiO1xuICAgIH0pO1xuICAgIHJldHVybiBjdXI7XG4gIH1cblxuICBzdGF0aWMgc2V0UGF0aChvYmosIHBhdGgsIHZhbCwgc2VwID0gJy4nKSB7XG4gICAgdmFyIGxhc3QsIHBhcnRzO1xuICAgIHBhcnRzID0gcGF0aC5zcGxpdChzZXApO1xuICAgIGxhc3QgPSBwYXJ0cy5wb3AoKTtcbiAgICByZXR1cm4gcGFydHMucmVkdWNlKChjdXIsIHBhcnQpID0+IHtcbiAgICAgIGlmIChjdXJbcGFydF0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY3VyW3BhcnRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGN1cltwYXJ0XSA9IHt9O1xuICAgICAgfVxuICAgIH0sIG9iailbbGFzdF0gPSB2YWw7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFNpemUgfSBmcm9tICcuLi9wb3NpdGlvbmluZy9TaXplJztcblxuZXhwb3J0IGNsYXNzIFN0cmluZ0hlbHBlclxuICBAdHJpbUVtcHR5TGluZTogKHR4dCkgLT5cbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJylcblxuICBAZXNjYXBlUmVnRXhwOiAoc3RyKSAtPlxuICAgIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIilcblxuICBAcmVwZWF0VG9MZW5ndGg6ICh0eHQsIGxlbmd0aCkgLT5cbiAgICByZXR1cm4gJycgaWYgbGVuZ3RoIDw9IDBcbiAgICBBcnJheShNYXRoLmNlaWwobGVuZ3RoL3R4dC5sZW5ndGgpKzEpLmpvaW4odHh0KS5zdWJzdHJpbmcoMCxsZW5ndGgpXG4gICAgXG4gIEByZXBlYXQ6ICh0eHQsIG5iKSAtPlxuICAgIEFycmF5KG5iKzEpLmpvaW4odHh0KVxuICAgIFxuICBAZ2V0VHh0U2l6ZTogKHR4dCkgLT5cbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywnJykuc3BsaXQoXCJcXG5cIilcbiAgICB3ID0gMFxuICAgIGZvciBsIGluIGxpbmVzXG4gICAgICB3ID0gTWF0aC5tYXgodyxsLmxlbmd0aClcbiAgICByZXR1cm4gbmV3IFNpemUodyxsaW5lcy5sZW5ndGgtMSlcblxuICBAaW5kZW50Tm90Rmlyc3Q6ICh0ZXh0LG5iPTEsc3BhY2VzPScgICcpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJlZyA9IC9cXG4vZ1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXFxuXCIgKyBAcmVwZWF0KHNwYWNlcywgbmIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgICBcbiAgQGluZGVudDogKHRleHQsbmI9MSxzcGFjZXM9JyAgJykgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmV0dXJuIHNwYWNlcyArIEBpbmRlbnROb3RGaXJzdCh0ZXh0LG5iLHNwYWNlcylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBcbiAgQHJldmVyc2VTdHI6ICh0eHQpIC0+XG4gICAgcmV0dXJuIHR4dC5zcGxpdChcIlwiKS5yZXZlcnNlKCkuam9pbihcIlwiKVxuICBcbiAgXG4gIEByZW1vdmVDYXJyZXQ6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSdcbiAgICByZUNhcnJldCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhcitjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgcmVUbXAgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAodG1wKSwgXCJnXCIpXG4gICAgdHh0LnJlcGxhY2UocmVRdW90ZWQsdG1wKS5yZXBsYWNlKHJlQ2FycmV0LCcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKVxuICAgIFxuICBAZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQ6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgcG9zID0gQGdldENhcnJldFBvcyh0eHQsY2FycmV0Q2hhcilcbiAgICBpZiBwb3M/XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAscG9zKSArIHR4dC5zdWJzdHIocG9zK2NhcnJldENoYXIubGVuZ3RoKVxuICAgICAgcmV0dXJuIFtwb3MsdHh0XVxuICAgICAgXG4gIEBnZXRDYXJyZXRQb3M6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhcitjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgdHh0ID0gdHh0LnJlcGxhY2UocmVRdW90ZWQsICcgJylcbiAgICBpZiAoaSA9IHR4dC5pbmRleE9mKGNhcnJldENoYXIpKSA+IC0xXG4gICAgICByZXR1cm4gaSIsImltcG9ydCB7XG4gIFNpemVcbn0gZnJvbSAnLi4vcG9zaXRpb25pbmcvU2l6ZSc7XG5cbmV4cG9ydCB2YXIgU3RyaW5nSGVscGVyID0gY2xhc3MgU3RyaW5nSGVscGVyIHtcbiAgc3RhdGljIHRyaW1FbXB0eUxpbmUodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKC9eXFxzKlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyP1xcblxccyokLywgJycpO1xuICB9XG5cbiAgc3RhdGljIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXRUb0xlbmd0aCh0eHQsIGxlbmd0aCkge1xuICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkoTWF0aC5jZWlsKGxlbmd0aCAvIHR4dC5sZW5ndGgpICsgMSkuam9pbih0eHQpLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuICB9XG5cbiAgc3RhdGljIHJlcGVhdCh0eHQsIG5iKSB7XG4gICAgcmV0dXJuIEFycmF5KG5iICsgMSkuam9pbih0eHQpO1xuICB9XG5cbiAgc3RhdGljIGdldFR4dFNpemUodHh0KSB7XG4gICAgdmFyIGosIGwsIGxlbiwgbGluZXMsIHc7XG4gICAgbGluZXMgPSB0eHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKTtcbiAgICB3ID0gMDtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbCA9IGxpbmVzW2pdO1xuICAgICAgdyA9IE1hdGgubWF4KHcsIGwubGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTaXplKHcsIGxpbmVzLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgc3RhdGljIGluZGVudE5vdEZpcnN0KHRleHQsIG5iID0gMSwgc3BhY2VzID0gJyAgJykge1xuICAgIHZhciByZWc7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gL1xcbi9nO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXFxuXCIgKyB0aGlzLnJlcGVhdChzcGFjZXMsIG5iKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnQodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNwYWNlcyArIHRoaXMuaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIsIHNwYWNlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZXZlcnNlU3RyKHR4dCkge1xuICAgIHJldHVybiB0eHQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIik7XG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlQ2FycmV0KHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciByZUNhcnJldCwgcmVRdW90ZWQsIHJlVG1wLCB0bXA7XG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSc7XG4gICAgcmVDYXJyZXQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHJlVG1wID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cCh0bXApLCBcImdcIik7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKHJlUXVvdGVkLCB0bXApLnJlcGxhY2UocmVDYXJyZXQsICcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcG9zO1xuICAgIHBvcyA9IHRoaXMuZ2V0Q2FycmV0UG9zKHR4dCwgY2FycmV0Q2hhcik7XG4gICAgaWYgKHBvcyAhPSBudWxsKSB7XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAsIHBvcykgKyB0eHQuc3Vic3RyKHBvcyArIGNhcnJldENoYXIubGVuZ3RoKTtcbiAgICAgIHJldHVybiBbcG9zLCB0eHRdO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXRDYXJyZXRQb3ModHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIGksIHJlUXVvdGVkO1xuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKTtcbiAgICBpZiAoKGkgPSB0eHQuaW5kZXhPZihjYXJyZXRDaGFyKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IFBhaXJNYXRjaCB9IGZyb20gJy4vUGFpck1hdGNoJztcblxuZXhwb3J0IGNsYXNzIFBhaXJcbiAgY29uc3RydWN0b3I6IChAb3BlbmVyLEBjbG9zZXIsQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IGZhbHNlXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIEBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IEBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gIG9wZW5lclJlZzogLT5cbiAgICBpZiB0eXBlb2YgQG9wZW5lciA9PSAnc3RyaW5nJyBcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQG9wZW5lcikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBvcGVuZXJcbiAgY2xvc2VyUmVnOiAtPlxuICAgIGlmIHR5cGVvZiBAY2xvc2VyID09ICdzdHJpbmcnIFxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY2xvc2VyKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQGNsb3NlclxuICBtYXRjaEFueVBhcnRzOiAtPlxuICAgIHJldHVybiB7XG4gICAgICBvcGVuZXI6IEBvcGVuZXJSZWcoKVxuICAgICAgY2xvc2VyOiBAY2xvc2VyUmVnKClcbiAgICB9XG4gIG1hdGNoQW55UGFydEtleXM6IC0+XG4gICAga2V5cyA9IFtdXG4gICAgZm9yIGtleSwgcmVnIG9mIEBtYXRjaEFueVBhcnRzKClcbiAgICAgIGtleXMucHVzaChrZXkpXG4gICAgcmV0dXJuIGtleXNcbiAgbWF0Y2hBbnlSZWc6IC0+XG4gICAgZ3JvdXBzID0gW11cbiAgICBmb3Iga2V5LCByZWcgb2YgQG1hdGNoQW55UGFydHMoKVxuICAgICAgZ3JvdXBzLnB1c2goJygnK3JlZy5zb3VyY2UrJyknKVxuICAgIHJldHVybiBuZXcgUmVnRXhwKGdyb3Vwcy5qb2luKCd8JykpXG4gIG1hdGNoQW55OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICB3aGlsZSAobWF0Y2ggPSBAX21hdGNoQW55KHRleHQsb2Zmc2V0KSk/IGFuZCAhbWF0Y2gudmFsaWQoKVxuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKClcbiAgICByZXR1cm4gbWF0Y2ggaWYgbWF0Y2g/IGFuZCBtYXRjaC52YWxpZCgpXG4gIF9tYXRjaEFueTogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgaWYgb2Zmc2V0XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KVxuICAgIG1hdGNoID0gQG1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KVxuICAgIGlmIG1hdGNoP1xuICAgICAgcmV0dXJuIG5ldyBQYWlyTWF0Y2godGhpcyxtYXRjaCxvZmZzZXQpXG4gIG1hdGNoQW55TmFtZWQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAX21hdGNoQW55R2V0TmFtZShAbWF0Y2hBbnkodGV4dCkpXG4gIG1hdGNoQW55TGFzdDogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgd2hpbGUgbWF0Y2ggPSBAbWF0Y2hBbnkodGV4dCxvZmZzZXQpXG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgICAgaWYgIXJlcyBvciByZXMuZW5kKCkgIT0gbWF0Y2guZW5kKClcbiAgICAgICAgcmVzID0gbWF0Y2hcbiAgICByZXR1cm4gcmVzXG4gIGlkZW50aWNhbDogLT5cbiAgICBAb3BlbmVyID09IEBjbG9zZXIgb3IgKFxuICAgICAgQG9wZW5lci5zb3VyY2U/IGFuZCBcbiAgICAgIEBjbG9zZXIuc291cmNlPyBhbmQgXG4gICAgICBAb3BlbmVyLnNvdXJjZSA9PSBAY2xvc2VyLnNvdXJjZVxuICAgIClcbiAgd3JhcHBlclBvczogKHBvcyx0ZXh0KSAtPlxuICAgIHN0YXJ0ID0gQG1hdGNoQW55TGFzdCh0ZXh0LnN1YnN0cigwLHBvcy5zdGFydCkpXG4gICAgaWYgc3RhcnQ/IGFuZCAoQGlkZW50aWNhbCgpIG9yIHN0YXJ0Lm5hbWUoKSA9PSAnb3BlbmVyJylcbiAgICAgIGVuZCA9IEBtYXRjaEFueSh0ZXh0LHBvcy5lbmQpXG4gICAgICBpZiBlbmQ/IGFuZCAoQGlkZW50aWNhbCgpIG9yIGVuZC5uYW1lKCkgPT0gJ2Nsb3NlcicpXG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksZW5kLmVuZCgpKVxuICAgICAgZWxzZSBpZiBAb3B0aW9ubmFsX2VuZFxuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLHRleHQubGVuZ3RoKVxuICBpc1dhcHBlck9mOiAocG9zLHRleHQpIC0+XG4gICAgcmV0dXJuIEB3cmFwcGVyUG9zKHBvcyx0ZXh0KT8iLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5pbXBvcnQge1xuICBQYWlyTWF0Y2hcbn0gZnJvbSAnLi9QYWlyTWF0Y2gnO1xuXG5leHBvcnQgdmFyIFBhaXIgPSBjbGFzcyBQYWlyIHtcbiAgY29uc3RydWN0b3Iob3BlbmVyLCBjbG9zZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgdGhpcy5vcGVuZXIgPSBvcGVuZXI7XG4gICAgdGhpcy5jbG9zZXIgPSBjbG9zZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IGZhbHNlLFxuICAgICAgdmFsaWRNYXRjaDogbnVsbFxuICAgIH07XG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG4gICAgICBpZiAoa2V5IGluIHRoaXMub3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSB0aGlzLm9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvcGVuZXJSZWcoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wZW5lciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5vcGVuZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMub3BlbmVyO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlclJlZygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuY2xvc2VyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNsb3NlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZXI7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BlbmVyOiB0aGlzLm9wZW5lclJlZygpLFxuICAgICAgY2xvc2VyOiB0aGlzLmNsb3NlclJlZygpXG4gICAgfTtcbiAgfVxuXG4gIG1hdGNoQW55UGFydEtleXMoKSB7XG4gICAgdmFyIGtleSwga2V5cywgcmVmLCByZWc7XG4gICAga2V5cyA9IFtdO1xuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV07XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG4gIH1cblxuICBtYXRjaEFueVJlZygpIHtcbiAgICB2YXIgZ3JvdXBzLCBrZXksIHJlZiwgcmVnO1xuICAgIGdyb3VwcyA9IFtdO1xuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV07XG4gICAgICBncm91cHMucHVzaCgnKCcgKyByZWcuc291cmNlICsgJyknKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoZ3JvdXBzLmpvaW4oJ3wnKSk7XG4gIH1cblxuICBtYXRjaEFueSh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoO1xuICAgIHdoaWxlICgoKG1hdGNoID0gdGhpcy5fbWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkgIT0gbnVsbCkgJiYgIW1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpO1xuICAgIH1cbiAgICBpZiAoKG1hdGNoICE9IG51bGwpICYmIG1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9XG4gIH1cblxuICBfbWF0Y2hBbnkodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaDtcbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KTtcbiAgICB9XG4gICAgbWF0Y2ggPSB0aGlzLm1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KTtcbiAgICBpZiAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBQYWlyTWF0Y2godGhpcywgbWF0Y2gsIG9mZnNldCk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlOYW1lZCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuX21hdGNoQW55R2V0TmFtZSh0aGlzLm1hdGNoQW55KHRleHQpKTtcbiAgfVxuXG4gIG1hdGNoQW55TGFzdCh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoLCByZXM7XG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKTtcbiAgICAgIGlmICghcmVzIHx8IHJlcy5lbmQoKSAhPT0gbWF0Y2guZW5kKCkpIHtcbiAgICAgICAgcmVzID0gbWF0Y2g7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBpZGVudGljYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVyID09PSB0aGlzLmNsb3NlciB8fCAoKHRoaXMub3BlbmVyLnNvdXJjZSAhPSBudWxsKSAmJiAodGhpcy5jbG9zZXIuc291cmNlICE9IG51bGwpICYmIHRoaXMub3BlbmVyLnNvdXJjZSA9PT0gdGhpcy5jbG9zZXIuc291cmNlKTtcbiAgfVxuXG4gIHdyYXBwZXJQb3MocG9zLCB0ZXh0KSB7XG4gICAgdmFyIGVuZCwgc3RhcnQ7XG4gICAgc3RhcnQgPSB0aGlzLm1hdGNoQW55TGFzdCh0ZXh0LnN1YnN0cigwLCBwb3Muc3RhcnQpKTtcbiAgICBpZiAoKHN0YXJ0ICE9IG51bGwpICYmICh0aGlzLmlkZW50aWNhbCgpIHx8IHN0YXJ0Lm5hbWUoKSA9PT0gJ29wZW5lcicpKSB7XG4gICAgICBlbmQgPSB0aGlzLm1hdGNoQW55KHRleHQsIHBvcy5lbmQpO1xuICAgICAgaWYgKChlbmQgIT0gbnVsbCkgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgZW5kLm5hbWUoKSA9PT0gJ2Nsb3NlcicpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIGVuZC5lbmQoKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ubmFsX2VuZCkge1xuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLCB0ZXh0Lmxlbmd0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNXYXBwZXJPZihwb3MsIHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy53cmFwcGVyUG9zKHBvcywgdGV4dCkgIT0gbnVsbDtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIFBhaXJNYXRjaFxuICBjb25zdHJ1Y3RvcjogKEBwYWlyLEBtYXRjaCxAb2Zmc2V0ID0gMCkgLT5cbiAgbmFtZTogLT5cbiAgICBpZiBAbWF0Y2hcbiAgICAgIHVubGVzcyBfbmFtZT9cbiAgICAgICAgZm9yIGdyb3VwLCBpIGluIEBtYXRjaFxuICAgICAgICAgIGlmIGkgPiAwIGFuZCBncm91cD9cbiAgICAgICAgICAgIF9uYW1lID0gQHBhaXIubWF0Y2hBbnlQYXJ0S2V5cygpW2ktMV1cbiAgICAgICAgICAgIHJldHVybiBfbmFtZVxuICAgICAgICBfbmFtZSA9IGZhbHNlXG4gICAgICByZXR1cm4gX25hbWUgfHwgbnVsbFxuICBzdGFydDogLT5cbiAgICBAbWF0Y2guaW5kZXggKyBAb2Zmc2V0XG4gIGVuZDogLT5cbiAgICBAbWF0Y2guaW5kZXggKyBAbWF0Y2hbMF0ubGVuZ3RoICsgQG9mZnNldFxuICB2YWxpZDogLT5cbiAgICByZXR1cm4gIUBwYWlyLnZhbGlkTWF0Y2ggfHwgQHBhaXIudmFsaWRNYXRjaCh0aGlzKVxuICBsZW5ndGg6IC0+XG4gICAgQG1hdGNoWzBdLmxlbmd0aCIsImV4cG9ydCB2YXIgUGFpck1hdGNoID0gY2xhc3MgUGFpck1hdGNoIHtcbiAgY29uc3RydWN0b3IocGFpciwgbWF0Y2gsIG9mZnNldCA9IDApIHtcbiAgICB0aGlzLnBhaXIgPSBwYWlyO1xuICAgIHRoaXMubWF0Y2ggPSBtYXRjaDtcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgfVxuXG4gIG5hbWUoKSB7XG4gICAgdmFyIF9uYW1lLCBncm91cCwgaSwgaiwgbGVuLCByZWY7XG4gICAgaWYgKHRoaXMubWF0Y2gpIHtcbiAgICAgIGlmICh0eXBlb2YgX25hbWUgPT09IFwidW5kZWZpbmVkXCIgfHwgX25hbWUgPT09IG51bGwpIHtcbiAgICAgICAgcmVmID0gdGhpcy5tYXRjaDtcbiAgICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgICBncm91cCA9IHJlZltpXTtcbiAgICAgICAgICBpZiAoaSA+IDAgJiYgKGdyb3VwICE9IG51bGwpKSB7XG4gICAgICAgICAgICBfbmFtZSA9IHRoaXMucGFpci5tYXRjaEFueVBhcnRLZXlzKClbaSAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuIF9uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfbmFtZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9uYW1lIHx8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm9mZnNldDtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMubWF0Y2hbMF0ubGVuZ3RoICsgdGhpcy5vZmZzZXQ7XG4gIH1cblxuICB2YWxpZCgpIHtcbiAgICByZXR1cm4gIXRoaXMucGFpci52YWxpZE1hdGNoIHx8IHRoaXMucGFpci52YWxpZE1hdGNoKHRoaXMpO1xuICB9XG5cbiAgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoWzBdLmxlbmd0aDtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIFBvc1xuICBjb25zdHJ1Y3RvcjogKEBzdGFydCxAZW5kKSAtPlxuICAgIEBlbmQgPSBAc3RhcnQgdW5sZXNzIEBlbmQ/XG4gIGNvbnRhaW5zUHQ6IChwdCkgLT5cbiAgICByZXR1cm4gQHN0YXJ0IDw9IHB0IGFuZCBwdCA8PSBAZW5kXG4gIGNvbnRhaW5zUG9zOiAocG9zKSAtPlxuICAgIHJldHVybiBAc3RhcnQgPD0gcG9zLnN0YXJ0IGFuZCBwb3MuZW5kIDw9IEBlbmRcbiAgd3JhcHBlZEJ5OiAocHJlZml4LHN1ZmZpeCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcy53cmFwQ2xhc3MoQHN0YXJ0LXByZWZpeC5sZW5ndGgsQHN0YXJ0LEBlbmQsQGVuZCtzdWZmaXgubGVuZ3RoKVxuICB3aXRoRWRpdG9yOiAodmFsKS0+XG4gICAgQF9lZGl0b3IgPSB2YWxcbiAgICByZXR1cm4gdGhpc1xuICBlZGl0b3I6IC0+XG4gICAgdW5sZXNzIEBfZWRpdG9yP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0JylcbiAgICByZXR1cm4gQF9lZGl0b3JcbiAgaGFzRWRpdG9yOiAtPlxuICAgIHJldHVybiBAX2VkaXRvcj9cbiAgdGV4dDogLT5cbiAgICBAZWRpdG9yKCkudGV4dFN1YnN0cihAc3RhcnQsIEBlbmQpXG4gIGFwcGx5T2Zmc2V0OiAob2Zmc2V0KS0+XG4gICAgaWYgb2Zmc2V0ICE9IDBcbiAgICAgIEBzdGFydCArPSBvZmZzZXRcbiAgICAgIEBlbmQgKz0gb2Zmc2V0XG4gICAgcmV0dXJuIHRoaXNcbiAgcHJldkVPTDogLT5cbiAgICB1bmxlc3MgQF9wcmV2RU9MP1xuICAgICAgQF9wcmV2RU9MID0gQGVkaXRvcigpLmZpbmRMaW5lU3RhcnQoQHN0YXJ0KVxuICAgIHJldHVybiBAX3ByZXZFT0xcbiAgbmV4dEVPTDogLT5cbiAgICB1bmxlc3MgQF9uZXh0RU9MP1xuICAgICAgQF9uZXh0RU9MID0gQGVkaXRvcigpLmZpbmRMaW5lRW5kKEBlbmQpXG4gICAgcmV0dXJuIEBfbmV4dEVPTFxuICB0ZXh0V2l0aEZ1bGxMaW5lczogLT5cbiAgICB1bmxlc3MgQF90ZXh0V2l0aEZ1bGxMaW5lcz9cbiAgICAgIEBfdGV4dFdpdGhGdWxsTGluZXMgPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAcHJldkVPTCgpLEBuZXh0RU9MKCkpXG4gICAgcmV0dXJuIEBfdGV4dFdpdGhGdWxsTGluZXNcbiAgc2FtZUxpbmVzUHJlZml4OiAtPlxuICAgIHVubGVzcyBAX3NhbWVMaW5lc1ByZWZpeD9cbiAgICAgIEBfc2FtZUxpbmVzUHJlZml4ID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQHByZXZFT0woKSxAc3RhcnQpXG4gICAgcmV0dXJuIEBfc2FtZUxpbmVzUHJlZml4XG4gIHNhbWVMaW5lc1N1ZmZpeDogLT5cbiAgICB1bmxlc3MgQF9zYW1lTGluZXNTdWZmaXg/XG4gICAgICBAX3NhbWVMaW5lc1N1ZmZpeCA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBlbmQsQG5leHRFT0woKSlcbiAgICByZXR1cm4gQF9zYW1lTGluZXNTdWZmaXhcbiAgY29weTogLT5cbiAgICByZXMgPSBuZXcgUG9zKEBzdGFydCxAZW5kKVxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgcmVzLndpdGhFZGl0b3IoQGVkaXRvcigpKVxuICAgIHJldHVybiByZXNcbiAgcmF3OiAtPlxuICAgIFtAc3RhcnQsQGVuZF0iLCJleHBvcnQgdmFyIFBvcyA9IGNsYXNzIFBvcyB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBlbmQpIHtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgaWYgKHRoaXMuZW5kID09IG51bGwpIHtcbiAgICAgIHRoaXMuZW5kID0gdGhpcy5zdGFydDtcbiAgICB9XG4gIH1cblxuICBjb250YWluc1B0KHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5lbmQ7XG4gIH1cblxuICBjb250YWluc1Bvcyhwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmVuZDtcbiAgfVxuXG4gIHdyYXBwZWRCeShwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyh0aGlzLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCwgdGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZW5kICsgc3VmZml4Lmxlbmd0aCk7XG4gIH1cblxuICB3aXRoRWRpdG9yKHZhbCkge1xuICAgIHRoaXMuX2VkaXRvciA9IHZhbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGVkaXRvcigpIHtcbiAgICBpZiAodGhpcy5fZWRpdG9yID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZWRpdG9yIHNldCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yO1xuICB9XG5cbiAgaGFzRWRpdG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9lZGl0b3IgIT0gbnVsbDtcbiAgfVxuXG4gIHRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gIH1cblxuICBhcHBseU9mZnNldChvZmZzZXQpIHtcbiAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgIHRoaXMuZW5kICs9IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcmV2RU9MKCkge1xuICAgIGlmICh0aGlzLl9wcmV2RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3ByZXZFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lU3RhcnQodGhpcy5zdGFydCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9wcmV2RU9MO1xuICB9XG5cbiAgbmV4dEVPTCgpIHtcbiAgICBpZiAodGhpcy5fbmV4dEVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9uZXh0RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZUVuZCh0aGlzLmVuZCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9uZXh0RU9MO1xuICB9XG5cbiAgdGV4dFdpdGhGdWxsTGluZXMoKSB7XG4gICAgaWYgKHRoaXMuX3RleHRXaXRoRnVsbExpbmVzID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHRXaXRoRnVsbExpbmVzID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMucHJldkVPTCgpLCB0aGlzLm5leHRFT0woKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcztcbiAgfVxuXG4gIHNhbWVMaW5lc1ByZWZpeCgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzUHJlZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5zdGFydCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNQcmVmaXg7XG4gIH1cblxuICBzYW1lTGluZXNTdWZmaXgoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNTdWZmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5lbmQsIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NhbWVMaW5lc1N1ZmZpeDtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBuZXcgUG9zKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICByYXcoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnN0YXJ0LCB0aGlzLmVuZF07XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFdyYXBwaW5nIH0gZnJvbSAnLi9XcmFwcGluZyc7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgQ29tbW9uSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUG9zQ29sbGVjdGlvblxuICBjb25zdHJ1Y3RvcjogKGFycikgLT5cbiAgICBpZiAhQXJyYXkuaXNBcnJheShhcnIpXG4gICAgICBhcnIgPSBbYXJyXVxuICAgIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhhcnIsW1Bvc0NvbGxlY3Rpb25dKVxuICAgIHJldHVybiBhcnJcbiAgICBcbiAgd3JhcDogKHByZWZpeCxzdWZmaXgpLT5cbiAgICAgIHJldHVybiBAbWFwKCAocCkgLT4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeCkpXG4gIHJlcGxhY2U6ICh0eHQpLT5cbiAgICAgIHJldHVybiBAbWFwKCAocCkgLT4gbmV3IFJlcGxhY2VtZW50KHAuc3RhcnQsIHAuZW5kLCB0eHQpKSIsImltcG9ydCB7XG4gIFdyYXBwaW5nXG59IGZyb20gJy4vV3JhcHBpbmcnO1xuXG5pbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuaW1wb3J0IHtcbiAgQ29tbW9uSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcblxuZXhwb3J0IHZhciBQb3NDb2xsZWN0aW9uID0gY2xhc3MgUG9zQ29sbGVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGFycikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICBhcnIgPSBbYXJyXTtcbiAgICB9XG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFyciwgW1Bvc0NvbGxlY3Rpb25dKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgd3JhcChwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeCk7XG4gICAgfSk7XG4gIH1cblxuICByZXBsYWNlKHR4dCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gbmV3IFJlcGxhY2VtZW50KHAuc3RhcnQsIHAuZW5kLCB0eHQpO1xuICAgIH0pO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL1Bvcyc7XG5pbXBvcnQgeyBDb21tb25IZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5pbXBvcnQgeyBPcHRpb25PYmplY3QgfSBmcm9tICcuLi9PcHRpb25PYmplY3QnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUmVwbGFjZW1lbnQgZXh0ZW5kcyBQb3NcbiAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKHRoaXMucHJvdG90eXBlLFtPcHRpb25PYmplY3RdKVxuICBjb25zdHJ1Y3RvcjogKEBzdGFydCwgQGVuZCwgQHRleHQsIEBvcHRpb25zID0ge30pIC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRPcHRzKEBvcHRpb25zLHtcbiAgICAgIHByZWZpeDogJydcbiAgICAgIHN1ZmZpeDogJydcbiAgICAgIHNlbGVjdGlvbnM6IFtdXG4gICAgfSlcbiAgcmVzUG9zQmVmb3JlUHJlZml4OiAtPlxuICAgIHJldHVybiBAc3RhcnQrQHByZWZpeC5sZW5ndGgrQHRleHQubGVuZ3RoXG4gIHJlc0VuZDogLT4gXG4gICAgcmV0dXJuIEBzdGFydCtAZmluYWxUZXh0KCkubGVuZ3RoXG4gIGFwcGx5OiAtPlxuICAgIEBlZGl0b3IoKS5zcGxpY2VUZXh0KEBzdGFydCwgQGVuZCwgQGZpbmFsVGV4dCgpKVxuICBuZWNlc3Nhcnk6IC0+XG4gICAgcmV0dXJuIEBmaW5hbFRleHQoKSAhPSBAb3JpZ2luYWxUZXh0KClcbiAgb3JpZ2luYWxUZXh0OiAtPlxuICAgIHJldHVybiBAZWRpdG9yKCkudGV4dFN1YnN0cihAc3RhcnQsIEBlbmQpXG4gIGZpbmFsVGV4dDogLT5cbiAgICByZXR1cm4gQHByZWZpeCtAdGV4dCtAc3VmZml4XG4gIG9mZnNldEFmdGVyOiAoKSAtPiBcbiAgICByZXR1cm4gQGZpbmFsVGV4dCgpLmxlbmd0aCAtIChAZW5kIC0gQHN0YXJ0KVxuICBhcHBseU9mZnNldDogKG9mZnNldCktPlxuICAgIGlmIG9mZnNldCAhPSAwXG4gICAgICBAc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBAZW5kICs9IG9mZnNldFxuICAgICAgZm9yIHNlbCBpbiBAc2VsZWN0aW9uc1xuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0XG4gICAgcmV0dXJuIHRoaXNcbiAgc2VsZWN0Q29udGVudDogLT4gXG4gICAgQHNlbGVjdGlvbnMgPSBbbmV3IFBvcyhAcHJlZml4Lmxlbmd0aCtAc3RhcnQsIEBwcmVmaXgubGVuZ3RoK0BzdGFydCtAdGV4dC5sZW5ndGgpXVxuICAgIHJldHVybiB0aGlzXG4gIGNhcnJldFRvU2VsOiAtPlxuICAgIEBzZWxlY3Rpb25zID0gW11cbiAgICB0ZXh0ID0gQGZpbmFsVGV4dCgpXG4gICAgQHByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHByZWZpeClcbiAgICBAdGV4dCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHRleHQpXG4gICAgQHN1ZmZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHN1ZmZpeClcbiAgICBzdGFydCA9IEBzdGFydFxuICAgIFxuICAgIHdoaWxlIChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpP1xuICAgICAgW3Bvcyx0ZXh0XSA9IHJlc1xuICAgICAgQHNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0K3Bvcywgc3RhcnQrcG9zKSlcbiAgICAgIFxuICAgIHJldHVybiB0aGlzXG4gIGNvcHk6IC0+IFxuICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudChAc3RhcnQsIEBlbmQsIEB0ZXh0LCBAZ2V0T3B0cygpKVxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgcmVzLndpdGhFZGl0b3IoQGVkaXRvcigpKVxuICAgIHJlcy5zZWxlY3Rpb25zID0gQHNlbGVjdGlvbnMubWFwKCAocyktPnMuY29weSgpIClcbiAgICByZXR1cm4gcmVzIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vUG9zJztcblxuaW1wb3J0IHtcbiAgQ29tbW9uSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcblxuaW1wb3J0IHtcbiAgT3B0aW9uT2JqZWN0XG59IGZyb20gJy4uL09wdGlvbk9iamVjdCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCB2YXIgUmVwbGFjZW1lbnQgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIFJlcGxhY2VtZW50IGV4dGVuZHMgUG9zIHtcbiAgICBjb25zdHJ1Y3RvcihzdGFydDEsIGVuZCwgdGV4dDEsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDE7XG4gICAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICAgIHRoaXMudGV4dCA9IHRleHQxO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgcHJlZml4OiAnJyxcbiAgICAgICAgc3VmZml4OiAnJyxcbiAgICAgICAgc2VsZWN0aW9uczogW11cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc1Bvc0JlZm9yZVByZWZpeCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy50ZXh0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXNFbmQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoO1xuICAgIH1cblxuICAgIGFwcGx5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkuc3BsaWNlVGV4dCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5maW5hbFRleHQoKSk7XG4gICAgfVxuXG4gICAgbmVjZXNzYXJ5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkgIT09IHRoaXMub3JpZ2luYWxUZXh0KCk7XG4gICAgfVxuXG4gICAgb3JpZ2luYWxUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gICAgfVxuXG4gICAgZmluYWxUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy50ZXh0ICsgdGhpcy5zdWZmaXg7XG4gICAgfVxuXG4gICAgb2Zmc2V0QWZ0ZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKS5sZW5ndGggLSAodGhpcy5lbmQgLSB0aGlzLnN0YXJ0KTtcbiAgICB9XG5cbiAgICBhcHBseU9mZnNldChvZmZzZXQpIHtcbiAgICAgIHZhciBpLCBsZW4sIHJlZiwgc2VsO1xuICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgICAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnM7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHNlbCA9IHJlZltpXTtcbiAgICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZWxlY3RDb250ZW50KCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW25ldyBQb3ModGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCwgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCArIHRoaXMudGV4dC5sZW5ndGgpXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNhcnJldFRvU2VsKCkge1xuICAgICAgdmFyIHBvcywgcmVzLCBzdGFydCwgdGV4dDtcbiAgICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtdO1xuICAgICAgdGV4dCA9IHRoaXMuZmluYWxUZXh0KCk7XG4gICAgICB0aGlzLnByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5wcmVmaXgpO1xuICAgICAgdGhpcy50ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnRleHQpO1xuICAgICAgdGhpcy5zdWZmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMuc3VmZml4KTtcbiAgICAgIHN0YXJ0ID0gdGhpcy5zdGFydDtcbiAgICAgIHdoaWxlICgocmVzID0gU3RyaW5nSGVscGVyLmdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHRleHQpKSAhPSBudWxsKSB7XG4gICAgICAgIFtwb3MsIHRleHRdID0gcmVzO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0ICsgcG9zLCBzdGFydCArIHBvcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgIHZhciByZXM7XG4gICAgICByZXMgPSBuZXcgUmVwbGFjZW1lbnQodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMudGV4dCwgdGhpcy5nZXRPcHRzKCkpO1xuICAgICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSk7XG4gICAgICB9XG4gICAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcy5jb3B5KCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gIH07XG5cbiAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKFJlcGxhY2VtZW50LnByb3RvdHlwZSwgW09wdGlvbk9iamVjdF0pO1xuXG4gIHJldHVybiBSZXBsYWNlbWVudDtcblxufSkuY2FsbCh0aGlzKTtcbiIsImV4cG9ydCBjbGFzcyBTaXplXG4gIGNvbnN0cnVjdG9yOiAoQHdpZHRoLEBoZWlnaHQpIC0+IiwiZXhwb3J0IGNsYXNzIFN0clBvc1xuICBjb25zdHJ1Y3RvcjogKEBwb3MsQHN0cikgLT5cbiAgZW5kOiAtPlxuICAgIEBwb3MgKyBAc3RyLmxlbmd0aCIsImV4cG9ydCB2YXIgU3RyUG9zID0gY2xhc3MgU3RyUG9zIHtcbiAgY29uc3RydWN0b3IocG9zLCBzdHIpIHtcbiAgICB0aGlzLnBvcyA9IHBvcztcbiAgICB0aGlzLnN0ciA9IHN0cjtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGg7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcblxuZXhwb3J0IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3NcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIC0+XG4gICAgc3VwZXIoKVxuICBpbm5lckNvbnRhaW5zUHQ6IChwdCkgLT5cbiAgICByZXR1cm4gQGlubmVyU3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBpbm5lckVuZFxuICBpbm5lckNvbnRhaW5zUG9zOiAocG9zKSAtPlxuICAgIHJldHVybiBAaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGlubmVyRW5kXG4gIGlubmVyVGV4dDogLT5cbiAgICBAZWRpdG9yKCkudGV4dFN1YnN0cihAaW5uZXJTdGFydCwgQGlubmVyRW5kKVxuICBzZXRJbm5lckxlbjogKGxlbikgLT5cbiAgICBAbW92ZVN1Zml4KEBpbm5lclN0YXJ0ICsgbGVuKVxuICBtb3ZlU3VmZml4OiAocHQpIC0+XG4gICAgc3VmZml4TGVuID0gQGVuZCAtIEBpbm5lckVuZFxuICAgIEBpbm5lckVuZCA9IHB0XG4gICAgQGVuZCA9IEBpbm5lckVuZCArIHN1ZmZpeExlblxuICBjb3B5OiAtPlxuICAgIHJldHVybiBuZXcgV3JhcHBlZFBvcyhAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIiwiaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vUG9zJztcblxuZXhwb3J0IHZhciBXcmFwcGVkUG9zID0gY2xhc3MgV3JhcHBlZFBvcyBleHRlbmRzIFBvcyB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBpbm5lclN0YXJ0LCBpbm5lckVuZCwgZW5kKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5pbm5lclN0YXJ0ID0gaW5uZXJTdGFydDtcbiAgICB0aGlzLmlubmVyRW5kID0gaW5uZXJFbmQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gIH1cblxuICBpbm5lckNvbnRhaW5zUHQocHQpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclN0YXJ0IDw9IHB0ICYmIHB0IDw9IHRoaXMuaW5uZXJFbmQ7XG4gIH1cblxuICBpbm5lckNvbnRhaW5zUG9zKHBvcykge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcG9zLnN0YXJ0ICYmIHBvcy5lbmQgPD0gdGhpcy5pbm5lckVuZDtcbiAgfVxuXG4gIGlubmVyVGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCk7XG4gIH1cblxuICBzZXRJbm5lckxlbihsZW4pIHtcbiAgICByZXR1cm4gdGhpcy5tb3ZlU3VmaXgodGhpcy5pbm5lclN0YXJ0ICsgbGVuKTtcbiAgfVxuXG4gIG1vdmVTdWZmaXgocHQpIHtcbiAgICB2YXIgc3VmZml4TGVuO1xuICAgIHN1ZmZpeExlbiA9IHRoaXMuZW5kIC0gdGhpcy5pbm5lckVuZDtcbiAgICB0aGlzLmlubmVyRW5kID0gcHQ7XG4gICAgcmV0dXJuIHRoaXMuZW5kID0gdGhpcy5pbm5lckVuZCArIHN1ZmZpeExlbjtcbiAgfVxuXG4gIGNvcHkoKSB7XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKHRoaXMuc3RhcnQsIHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCwgdGhpcy5lbmQpO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgY2xhc3MgV3JhcHBpbmcgZXh0ZW5kcyBSZXBsYWNlbWVudFxuICBjb25zdHJ1Y3RvcjogKEBzdGFydCwgQGVuZCwgcHJlZml4ID0nJywgc3VmZml4ID0gJycsIEBvcHRpb25zID0ge30pIC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRPcHRzKEBvcHRpb25zKVxuICAgIEB0ZXh0ID0gJydcbiAgICBAcHJlZml4ID0gcHJlZml4XG4gICAgQHN1ZmZpeCA9IHN1ZmZpeFxuICBhcHBseTogLT5cbiAgICBAYWRqdXN0U2VsKClcbiAgICBzdXBlcigpXG4gIGFkanVzdFNlbDogLT5cbiAgICBvZmZzZXQgPSBAb3JpZ2luYWxUZXh0KCkubGVuZ3RoXG4gICAgZm9yIHNlbCBpbiBAc2VsZWN0aW9uc1xuICAgICAgaWYgc2VsLnN0YXJ0ID4gQHN0YXJ0K0BwcmVmaXgubGVuZ3RoXG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgIGlmIHNlbC5lbmQgPj0gQHN0YXJ0K0BwcmVmaXgubGVuZ3RoXG4gICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0XG4gIGZpbmFsVGV4dDogLT5cbiAgICBpZiBAaGFzRWRpdG9yKClcbiAgICAgIHRleHQgPSBAb3JpZ2luYWxUZXh0KClcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gJydcbiAgICByZXR1cm4gQHByZWZpeCt0ZXh0K0BzdWZmaXhcbiAgb2Zmc2V0QWZ0ZXI6ICgpIC0+IFxuICAgIHJldHVybiBAcHJlZml4Lmxlbmd0aCtAc3VmZml4Lmxlbmd0aFxuICAgICAgICAgIFxuICBjb3B5OiAtPiBcbiAgICByZXMgPSBuZXcgV3JhcHBpbmcoQHN0YXJ0LCBAZW5kLCBAcHJlZml4LCBAc3VmZml4KVxuICAgIHJlcy5zZWxlY3Rpb25zID0gQHNlbGVjdGlvbnMubWFwKCAocyktPnMuY29weSgpIClcbiAgICByZXR1cm4gcmVzIiwiaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCB2YXIgV3JhcHBpbmcgPSBjbGFzcyBXcmFwcGluZyBleHRlbmRzIFJlcGxhY2VtZW50IHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGVuZCwgcHJlZml4ID0gJycsIHN1ZmZpeCA9ICcnLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMudGV4dCA9ICcnO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4O1xuICAgIHRoaXMuc3VmZml4ID0gc3VmZml4O1xuICB9XG5cbiAgYXBwbHkoKSB7XG4gICAgdGhpcy5hZGp1c3RTZWwoKTtcbiAgICByZXR1cm4gc3VwZXIuYXBwbHkoKTtcbiAgfVxuXG4gIGFkanVzdFNlbCgpIHtcbiAgICB2YXIgaSwgbGVuLCBvZmZzZXQsIHJlZiwgcmVzdWx0cywgc2VsO1xuICAgIG9mZnNldCA9IHRoaXMub3JpZ2luYWxUZXh0KCkubGVuZ3RoO1xuICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9ucztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzZWwgPSByZWZbaV07XG4gICAgICBpZiAoc2VsLnN0YXJ0ID4gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgfVxuICAgICAgaWYgKHNlbC5lbmQgPj0gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHRzLnB1c2goc2VsLmVuZCArPSBvZmZzZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgZmluYWxUZXh0KCkge1xuICAgIHZhciB0ZXh0O1xuICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICB0ZXh0ID0gdGhpcy5vcmlnaW5hbFRleHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9ICcnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0ZXh0ICsgdGhpcy5zdWZmaXg7XG4gIH1cblxuICBvZmZzZXRBZnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdWZmaXgubGVuZ3RoO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBXcmFwcGluZyh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5wcmVmaXgsIHRoaXMuc3VmZml4KTtcbiAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24ocykge1xuICAgICAgcmV0dXJuIHMuY29weSgpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxufTtcbiIsIlxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZUVuZ2luZVxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgc2F2ZTogKGtleSx2YWwpIC0+XG4gICAgaWYgbG9jYWxTdG9yYWdlP1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oQGZ1bGxLZXkoa2V5KSwgSlNPTi5zdHJpbmdpZnkodmFsKSlcbiAgc2F2ZUluUGF0aDogKHBhdGgsIGtleSwgdmFsKSAtPlxuICAgIGRhdGEgPSBAbG9hZChwYXRoKVxuICAgIHVubGVzcyBkYXRhP1xuICAgICAgZGF0YSA9IHt9XG4gICAgZGF0YVtrZXldID0gdmFsXG4gICAgQHNhdmUocGF0aCxkYXRhKVxuICBsb2FkOiAoa2V5KSAtPlxuICAgIGlmIGxvY2FsU3RvcmFnZT9cbiAgICAgIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oQGZ1bGxLZXkoa2V5KSkpXG4gIGZ1bGxLZXk6IChrZXkpIC0+XG4gICAgJ0NvZGVXYXZlXycra2V5IiwiZXhwb3J0IHZhciBMb2NhbFN0b3JhZ2VFbmdpbmUgPSBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmUge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgc2F2ZShrZXksIHZhbCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKTtcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZGF0YSA9IHRoaXMubG9hZChwYXRoKTtcbiAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfVxuICAgIGRhdGFba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gdGhpcy5zYXZlKHBhdGgsIGRhdGEpO1xuICB9XG5cbiAgbG9hZChrZXkpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpKSk7XG4gICAgfVxuICB9XG5cbiAgZnVsbEtleShrZXkpIHtcbiAgICByZXR1cm4gJ0NvZGVXYXZlXycgKyBrZXk7XG4gIH1cblxufTtcbiJdfQ==
