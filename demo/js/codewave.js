(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoxHelper = void 0;

var _StringHelper = require("./helpers/StringHelper");

var _ArrayHelper = require("./helpers/ArrayHelper");

var _Pair = require("./positioning/Pair");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
        startPos = resStart.index + resStart[1].length + resStart[2].length + this.pad; // [pawa python] replace 'resStart.index + resStart[1].length + resStart[2].length' resStart.end(2)

        endPos = resEnd.index + resEnd[1].length - this.pad; // [pawa python] replace 'resEnd.index + resEnd[1].length' resEnd.start(2)

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
        flag = options['multiline'] ? 'gm' : ''; // [pawa python] replace "'gm'" re.M

        re1 = new RegExp("^\\s*".concat(ecl, "(?:").concat(ed, ")*\\s{0,").concat(this.pad, "}"), flag); // [pawa python] replace #{@pad} '"+str(self.pad)+"'

        re2 = new RegExp("\\s*(?:".concat(ed, ")*").concat(ecr, "\\s*$"), flag);
        return text.replace(re1, '').replace(re2, '');
      }
    }
  }]);

  return BoxHelper;
}();

exports.BoxHelper = BoxHelper;

},{"./helpers/ArrayHelper":21,"./helpers/StringHelper":24,"./positioning/Pair":25}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimulatedClosingPromp = exports.ClosingPromp = void 0;

var _PosCollection = require("./positioning/PosCollection");

var _Replacement = require("./positioning/Replacement");

var _Pos = require("./positioning/Pos");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
      this.addCarrets();

      if (this.codewave.editor.canListenToChange()) {
        this.proxyOnChange = function () {
          var ch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          return _this.onChange(ch);
        };

        this.codewave.editor.addChangeListener(this.proxyOnChange);
      }

      return this;
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

},{"./positioning/Pos":27,"./positioning/PosCollection":28,"./positioning/Replacement":29}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CmdFinder = void 0;

var _Context = require("./Context");

var _NamespaceHelper = require("./helpers/NamespaceHelper");

var _Command = require("./Command");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

        var _NamespaceHelper$spli = _NamespaceHelper.NamespaceHelper.splitFirst(name);

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

      var _NamespaceHelper$spli3 = _NamespaceHelper.NamespaceHelper.splitFirst(namespace, true);

      var _NamespaceHelper$spli4 = _slicedToArray(_NamespaceHelper$spli3, 2);

      space = _NamespaceHelper$spli4[0];
      rest = _NamespaceHelper$spli4[1];
      return this.names.map(function (name) {
        var cur_rest, cur_space;

        var _NamespaceHelper$spli5 = _NamespaceHelper.NamespaceHelper.splitFirst(name);

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

        var _NamespaceHelper$spli7 = _NamespaceHelper.NamespaceHelper.splitFirst(nspc, true);

        var _NamespaceHelper$spli8 = _slicedToArray(_NamespaceHelper$spli7, 2);

        nspcName = _NamespaceHelper$spli8[0];
        rest = _NamespaceHelper$spli8[1];
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

},{"./Command":6,"./Context":7,"./helpers/NamespaceHelper":23}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CmdInstance = void 0;

var _Context = require("./Context");

var _Codewave = require("./Codewave");

var _TextParser = require("./TextParser");

var _StringHelper = require("./helpers/StringHelper");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{"./Codewave":5,"./Context":7,"./TextParser":17,"./helpers/StringHelper":24}],5:[function(require,module,exports){
"use strict";

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
        this.process = new _Process.Process();
        this.logger.log('activation key');
        this.runAtCursorPos();
        return this.process = null;
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
        var cmd;

        if (multiPos.length > 0) {
          cmd = this.commandOnPos(multiPos[0].end);

          if (cmd != null) {
            if (multiPos.length > 1) {
              cmd.setMultiPos(multiPos);
            }

            cmd.init();
            this.logger.log(cmd);
            return cmd.execute();
          } else {
            if (multiPos[0].start === multiPos[0].end) {
              return this.addBrakets(multiPos);
            } else {
              return this.promptClosingCmd(multiPos);
            }
          }
        }
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

        return this.closingPromp = _ClosingPromp.ClosingPromp.newFor(this, selections).begin(); // [pawa python] replace /\(new (.*)\).begin/ $1.begin reparse
      }
    }, {
      key: "parseAll",
      value: function parseAll() {
        var recursive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var cmd, parser, pos;

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

          if (cmd.execute() != null) {
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
        // [pawa python] replace flags="g" flags=0 
        return new RegExp(_StringHelper.StringHelper.escapeRegExp(this.marker), flags);
      }
    }, {
      key: "removeMarkers",
      value: function removeMarkers(text) {
        return text.replace(this.regMarker(), ''); // [pawa python] replace @regMarker() self.marker 
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

},{"./ClosingPromp":2,"./Command":6,"./Context":7,"./Logger":11,"./PositionedCmdInstance":13,"./Process":14,"./TextParser":17,"./helpers/StringHelper":24,"./positioning/PosCollection":28}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseCommand = exports.Command = void 0;

var _Context = require("./Context");

var _Storage = require("./Storage");

var _NamespaceHelper = require("./helpers/NamespaceHelper");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
      var parent1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      _classCallCheck(this, Command);

      this.name = name1;
      this.data = data1;
      this.parent = parent1;
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
          return this.parseDictData(data); // [pawa python] replace data? "isinstance(data,dict)"
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
        var cmd, j, len, name, ref, space;
        this.init();

        var _NamespaceHelper$spli = _NamespaceHelper.NamespaceHelper.splitFirst(fullname);

        var _NamespaceHelper$spli2 = _slicedToArray(_NamespaceHelper$spli, 2);

        space = _NamespaceHelper$spli2[0];
        name = _NamespaceHelper$spli2[1];

        if (space != null) {
          return this.getCmd(space).getCmd(name);
        }

        ref = this.cmds;

        for (j = 0, len = ref.length; j < len; j++) {
          cmd = ref[j];

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

        var _NamespaceHelper$spli3 = _NamespaceHelper.NamespaceHelper.splitFirst(fullname);

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
        var savedCmds, storage;
        storage = new _Storage.Storage();
        Command.cmds.setCmdData(fullname, data);
        savedCmds = storage.load('cmds');

        if (savedCmds == null) {
          savedCmds = {};
        }

        savedCmds[fullname] = data;
        return storage.save('cmds', savedCmds);
      }
    }, {
      key: "loadCmds",
      value: function loadCmds() {
        var data, fullname, results, savedCmds, storage;
        storage = new _Storage.Storage();
        savedCmds = storage.load('cmds');

        if (savedCmds != null) {
          results = [];

          for (fullname in savedCmds) {
            data = savedCmds[fullname];
            results.push(Command.cmds.setCmdData(fullname, data));
          }

          return results;
        }
      }
    }, {
      key: "resetSaved",
      value: function resetSaved() {
        var storage;
        storage = new _Storage.Storage();
        return storage.save('cmds', {});
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

},{"./Context":7,"./Storage":15,"./helpers/NamespaceHelper":23}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = void 0;

var _CmdFinder = require("./CmdFinder");

var _CmdInstance = require("./CmdInstance");

var _ArrayHelper = require("./helpers/ArrayHelper");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{"./CmdFinder":3,"./CmdInstance":4,"./helpers/ArrayHelper":21}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PairDetector = exports.LangDetector = exports.Detector = void 0;

var _Pair = require("./positioning/Pair");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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

},{"./positioning/Pair":25}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditCmdProp = void 0;

var _Command = require("./Command");

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
        res = res.replace(/\|/g, '||'); // [pawa python] replace '/\|/g' "'|'"
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = void 0;

var _Pos = require("./positioning/Pos");

var _StrPos = require("./positioning/StrPos");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
      var i, len, offset, repl, selections;
      selections = [];
      offset = 0;

      for (i = 0, len = replacements.length; i < len; i++) {
        repl = replacements[i];
        repl.withEditor(this);
        repl.applyOffset(offset);
        repl.apply();
        offset += repl.offsetAfter(this);
        selections = selections.concat(repl.selections);
      }

      return this.applyReplacementsSelections(selections);
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

},{"./positioning/Pos":27,"./positioning/StrPos":31}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = void 0;

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

        if (window.console && this.enabled) {
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
  Logger.prototype.enabled = true;
  Logger.prototype.monitorData = {};
  return Logger;
}.call(void 0);

exports.Logger = Logger;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptionObject = void 0;

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

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PositionedCmdInstance = void 0;

var _CmdInstance2 = require("./CmdInstance");

var _BoxHelper = require("./BoxHelper");

var _Pos = require("./positioning/Pos");

var _StrPos = require("./positioning/StrPos");

var _Replacement = require("./positioning/Replacement");

var _StringHelper = require("./helpers/StringHelper");

var _NamespaceHelper = require("./helpers/NamespaceHelper");

var _Command = require("./Command");

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

// [pawa]
//   replace 'replace(/\t/g' 'replace("\t"'
var indexOf = [].indexOf;

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
        re1 = new RegExp("^\\s*".concat(ecl, "(?:").concat(ed, ")+\\s*(.*?)\\s*(?:").concat(ed, ")+").concat(ecr, "$"), "gm"); // [pawa python] replace '"gm"' re.M

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

      var _NamespaceHelper$spli = _NamespaceHelper.NamespaceHelper.split(this.cmdName);

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
            this.replaceWith(res);
            return true;
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
      this.codewave.editor.applyReplacements(replacements);
      this.replaceStart = repl.start;
      return this.replaceEnd = repl.resEnd();
    }
  }]);

  return PositionedCmdInstance;
}(_CmdInstance2.CmdInstance);

exports.PositionedCmdInstance = PositionedCmdInstance;

},{"./BoxHelper":1,"./CmdInstance":4,"./Command":6,"./helpers/NamespaceHelper":23,"./helpers/StringHelper":24,"./positioning/Pos":27,"./positioning/Replacement":29,"./positioning/StrPos":31}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Process = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Process = function Process() {
  _classCallCheck(this, Process);
};

exports.Process = Process;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Storage = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Storage =
/*#__PURE__*/
function () {
  function Storage() {
    _classCallCheck(this, Storage);
  }

  _createClass(Storage, [{
    key: "save",
    value: function save(key, val) {
      return localStorage.setItem(this.fullKey(key), JSON.stringify(val));
    }
  }, {
    key: "load",
    value: function load(key) {
      return JSON.parse(localStorage.getItem(this.fullKey(key)));
    }
  }, {
    key: "fullKey",
    value: function fullKey(key) {
      return 'CodeWave_' + key;
    }
  }]);

  return Storage;
}();

exports.Storage = Storage;

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextAreaEditor = exports.DomKeyListener = void 0;

var _TextParser2 = require("./TextParser");

var _Pos = require("./positioning/Pos");

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
  }(_TextParser2.TextParser);

  ;
  TextAreaEditor.prototype.startListening = DomKeyListener.prototype.startListening;
  return TextAreaEditor;
}.call(void 0);

exports.TextAreaEditor = TextAreaEditor;

},{"./TextParser":17,"./positioning/Pos":27}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextParser = void 0;

var _Editor2 = require("./Editor");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TextParser =
/*#__PURE__*/
function (_Editor) {
  _inherits(TextParser, _Editor);

  function TextParser(_text) {
    var _this;

    _classCallCheck(this, TextParser);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextParser).call(this));
    _this._text = _text;
    self.namespace = 'text_parser';
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

      return this.target = {
        start: start,
        end: end
      };
    }
  }]);

  return TextParser;
}(_Editor2.Editor);

exports.TextParser = TextParser;

},{"./Editor":10}],18:[function(require,module,exports){
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

var _Pos = require("./positioning/Pos");

var _WrappedPos = require("./positioning/WrappedPos");

_Pos.Pos.wrapClass = _WrappedPos.WrappedPos;
_Codewave.Codewave.instances = [];
_Command.Command.providers = [new _CoreCommandProvider.CoreCommandProvider()];

},{"./Codewave":5,"./Command":6,"./cmds/CoreCommandProvider":19,"./positioning/Pos":27,"./positioning/WrappedPos":32}],19:[function(require,module,exports){
"use strict";

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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
  return instance.content.replace(/\|/g, '||'); // [pawa python] replace '/\|/g' "'|'"
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
  var cmd, cmdData, newName, origninalName, savedCmds, storage;
  storage = new Storage();
  savedCmds = storage.load('cmds');
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
      storage.save('cmds', savedCmds);
      return "";
    } else if (cmd != null) {
      return "~~not_applicable~~";
    } else {
      return "~~not_found~~";
    }
  }
};

removeCommand = function removeCommand(instance) {
  var cmd, cmdData, name, savedCmds, storage;
  name = instance.getParam([0, 'name']);

  if (name != null) {
    storage = new Storage();
    savedCmds = storage.load('cmds');
    cmd = instance.context.getCmd(name);

    if (savedCmds[name] != null && cmd != null) {
      cmdData = savedCmds[name];
      cmd.unregister();
      delete savedCmds[name];
      storage.save('cmds', savedCmds);
      return "";
    } else if (cmd != null) {
      return "~~not_applicable~~";
    } else {
      return "~~not_found~~";
    }
  }
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
function (_BaseCommand) {
  _inherits(BoxCmd, _BaseCommand);

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
function (_BaseCommand2) {
  _inherits(CloseCmd, _BaseCommand2);

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
        parser = this.instance.getParserForText("~~box cmd:\"".concat(this.instance.cmd.fullName, " ").concat(name, "\"~~\n").concat(this.propsDisplay(), "\n~~save~~ ~~!close~~\n~~/box~~"));
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
}(_Command.BaseCommand);

EmmetCmd =
/*#__PURE__*/
function (_BaseCommand5) {
  _inherits(EmmetCmd, _BaseCommand5);

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
      var emmet, ref, ref1, res;
      emmet = window.emmet != null ? window.emmet : ((ref = window.self) != null ? ref.emmet : void 0) != null ? window.self.emmet : ((ref1 = window.global) != null ? ref1.emmet : void 0) != null ? window.global.emmet : void 0;

      if (emmet != null) {
        // emmet.require('./parser/abbreviation').expand('ul>li', {pastedContent:'lorem'})
        res = emmet.expandAbbreviation(this.abbr, this.lang);
        return res.replace(/\$\{0\}/g, '|');
      }
    }
  }]);

  return EmmetCmd;
}(_Command.BaseCommand);

},{"../BoxHelper":1,"../Command":6,"../Detector":8,"../EditCmdProp":9,"../helpers/StringHelper":24,"../positioning/Replacement":29}],20:[function(require,module,exports){
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

},{"./TextAreaEditor":16,"./bootstrap":18}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrayHelper = void 0;

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

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommonHelper = void 0;

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

},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NamespaceHelper = void 0;

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

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringHelper = void 0;

var _Size = require("../positioning/Size");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
      lines = txt.replace(/\r/g, '').split("\n"); // [pawa python] replace '/\r/g' "'\r'"

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
        reg = /\n/g; // [pawa python] replace '/\n/g' "re.compile(r'\n',re.M)"

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
      txt = txt.replace(reQuoted, ' '); // [pawa python] replace reQuoted carretChar+carretChar

      if ((i = txt.indexOf(carretChar)) > -1) {
        return i;
      }
    }
  }]);

  return StringHelper;
}();

exports.StringHelper = StringHelper;

},{"../positioning/Size":30}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pair = void 0;

var _Pos = require("./Pos");

var _StringHelper = require("../helpers/StringHelper");

var _PairMatch = require("./PairMatch");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
        groups.push('(' + reg.source + ')'); // [pawa python] replace reg.source reg.pattern
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

},{"../helpers/StringHelper":24,"./PairMatch":26,"./Pos":27}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PairMatch = void 0;

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

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pos = void 0;

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

},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PosCollection = void 0;

var _Wrapping = require("./Wrapping");

var _Replacement = require("./Replacement");

var _CommonHelper = require("../helpers/CommonHelper");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{"../helpers/CommonHelper":22,"./Replacement":29,"./Wrapping":33}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Replacement = void 0;

var _Pos2 = require("./Pos");

var _CommonHelper = require("../helpers/CommonHelper");

var _OptionObject = require("../OptionObject");

var _StringHelper = require("../helpers/StringHelper");

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
        this.selections = [new _Pos2.Pos(this.prefix.length + this.start, this.prefix.length + this.start + this.text.length)];
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
          this.selections.push(new _Pos2.Pos(start + pos, start + pos));
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
  }(_Pos2.Pos);

  ;

  _CommonHelper.CommonHelper.applyMixins(Replacement.prototype, [_OptionObject.OptionObject]);

  return Replacement;
}.call(void 0);

exports.Replacement = Replacement;

},{"../OptionObject":12,"../helpers/CommonHelper":22,"../helpers/StringHelper":24,"./Pos":27}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Size = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Size = function Size(width, height) {
  _classCallCheck(this, Size);

  this.width = width;
  this.height = height;
};

exports.Size = Size;

},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StrPos = void 0;

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

},{}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WrappedPos = void 0;

var _Pos2 = require("./Pos");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
}(_Pos2.Pos);

exports.WrappedPos = WrappedPos;

},{"./Pos":27}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapping = void 0;

var _Replacement2 = require("./Replacement");

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
}(_Replacement2.Replacement);

exports.Wrapping = Wrapping;

},{"./Replacement":29}]},{},[20])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmNvZmZlZSIsImxpYi9DbG9zaW5nUHJvbXAuY29mZmVlIiwibGliL0NtZEZpbmRlci5jb2ZmZWUiLCJsaWIvQ21kSW5zdGFuY2UuY29mZmVlIiwibGliL0NvZGV3YXZlLmNvZmZlZSIsImxpYi9Db21tYW5kLmNvZmZlZSIsImxpYi9Db250ZXh0LmNvZmZlZSIsImxpYi9EZXRlY3Rvci5jb2ZmZWUiLCJsaWIvRWRpdENtZFByb3AuY29mZmVlIiwibGliL0VkaXRvci5jb2ZmZWUiLCJsaWIvTG9nZ2VyLmNvZmZlZSIsImxpYi9PcHRpb25PYmplY3QuY29mZmVlIiwibGliL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5jb2ZmZWUiLCJsaWIvUHJvY2Vzcy5jb2ZmZWUiLCJsaWIvU3RvcmFnZS5jb2ZmZWUiLCJsaWIvVGV4dEFyZWFFZGl0b3IuY29mZmVlIiwibGliL1RleHRQYXJzZXIuY29mZmVlIiwibGliL2Jvb3RzdHJhcC5jb2ZmZWUiLCJsaWIvY21kcy9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwibGliL2VudHJ5LmNvZmZlZSIsImxpYi9oZWxwZXJzL2hlbHBlcnMvQXJyYXlIZWxwZXIuY29mZmVlIiwibGliL2hlbHBlcnMvaGVscGVycy9Db21tb25IZWxwZXIuY29mZmVlIiwibGliL2hlbHBlcnMvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuY29mZmVlIiwibGliL2hlbHBlcnMvaGVscGVycy9TdHJpbmdIZWxwZXIuY29mZmVlIiwibGliL3Bvc2l0aW9uaW5nL3Bvc2l0aW9uaW5nL1BhaXIuY29mZmVlIiwibGliL3Bvc2l0aW9uaW5nL3Bvc2l0aW9uaW5nL1BhaXJNYXRjaC5jb2ZmZWUiLCJsaWIvcG9zaXRpb25pbmcvcG9zaXRpb25pbmcvUG9zLmNvZmZlZSIsImxpYi9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmNvZmZlZSIsImxpYi9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy9SZXBsYWNlbWVudC5jb2ZmZWUiLCJsaWIvcG9zaXRpb25pbmcvcG9zaXRpb25pbmcvU2l6ZS5jb2ZmZWUiLCJsaWIvcG9zaXRpb25pbmcvcG9zaXRpb25pbmcvU3RyUG9zLmNvZmZlZSIsImxpYi9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy9XcmFwcGVkUG9zLmNvZmZlZSIsImxpYi9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy9XcmFwcGluZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDR0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBYSxTQUFOO0FBQUE7QUFBQTtBQUNMLHFCQUFhLE9BQWIsRUFBYTtBQUFBLFFBQVcsT0FBWCx1RUFBQSxFQUFBOztBQUFBOztBQUNYLFFBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBO0FBRFksU0FBQyxPQUFELEdBQUMsT0FBRDtBQUNaLFNBQUEsUUFBQSxHQUFZO0FBQ1YsTUFBQSxJQUFBLEVBQU0sS0FBQyxPQUFELENBQVMsUUFBVCxDQURJLElBQUE7QUFFVixNQUFBLEdBQUEsRUFGVSxDQUFBO0FBR1YsTUFBQSxLQUFBLEVBSFUsRUFBQTtBQUlWLE1BQUEsTUFBQSxFQUpVLENBQUE7QUFLVixNQUFBLFFBQUEsRUFMVSxFQUFBO0FBTVYsTUFBQSxTQUFBLEVBTlUsRUFBQTtBQU9WLE1BQUEsTUFBQSxFQVBVLEVBQUE7QUFRVixNQUFBLE1BQUEsRUFSVSxFQUFBO0FBU1YsTUFBQSxNQUFBLEVBQVE7QUFURSxLQUFaO0FBV0EsSUFBQSxHQUFBLEdBQUEsS0FBQSxRQUFBOztBQUFBLFNBQUEsR0FBQSxJQUFBLEdBQUEsRUFBQTs7O0FBQ0UsVUFBRyxHQUFBLElBQUgsT0FBQSxFQUFBO0FBQ0UsYUFBQSxHQUFBLElBQVksT0FBUSxDQUR0QixHQUNzQixDQUFwQjtBQURGLE9BQUEsTUFBQTtBQUdFLGFBQUEsR0FBQSxJQUhGLEdBR0U7O0FBSko7QUFaVzs7QUFEUjtB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O0FBQUEsa0NBdUJRO0FBQ1gsYUFBTyxLQUFDLE1BQUQsQ0FBQSxNQUFBLEdBQWUsS0FBQyxNQUFELENBQVEsTUFBOUI7QUFEVztBQXZCUjtBQUFBO0FBQUEsMkJBMEJDO0FBQ0osVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBQSxRQUFBLENBQWEsS0FBYixLQUFBLEVBQXFCLEtBQXJCLEdBQUEsRUFBMkIsS0FBM0IsTUFBQSxFQUFvQyxLQUFwQyxNQUFBLENBQU47QUFDQSxNQUFBLEdBQUcsQ0FBSCxVQUFBLEdBQWlCLEtBQUMsVUFBRCxDQUFBLEdBQUEsQ0FBaUIsVUFBQSxDQUFBLEVBQUE7ZUFBSyxDQUFDLENBQUQsSUFBQSxFO0FBQXRCLE9BQUEsQ0FBakI7QUFDQSxhQUFPLEdBQVA7QUFISTtBQTFCRDs7QUFBQTtBQUFBLEVBQUEseUJBQUEsQ0FBUCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIiMgW3Bhd2FdXG4jICAgcmVwbGFjZSAncmVwbGFjZSgvXFxyL2cnIFwicmVwbGFjZSgnXFxyJ1wiXG5cbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuaW1wb3J0IHsgUGFpciB9IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCBjbGFzcyBCb3hIZWxwZXJcbiAgY29uc3RydWN0b3I6IChAY29udGV4dCwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIEBkZWZhdWx0cyA9IHtcbiAgICAgIGRlY286IEBjb250ZXh0LmNvZGV3YXZlLmRlY29cbiAgICAgIHBhZDogMlxuICAgICAgd2lkdGg6IDUwXG4gICAgICBoZWlnaHQ6IDNcbiAgICAgIG9wZW5UZXh0OiAnJ1xuICAgICAgY2xvc2VUZXh0OiAnJ1xuICAgICAgcHJlZml4OiAnJ1xuICAgICAgc3VmZml4OiAnJ1xuICAgICAgaW5kZW50OiAwXG4gICAgfVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgY2xvbmU6ICh0ZXh0KSAtPlxuICAgIG9wdCA9IHt9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgb3B0W2tleV0gPSB0aGlzW2tleV1cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcihAY29udGV4dCxvcHQpXG4gIGRyYXc6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAc3RhcnRTZXAoKSArIFwiXFxuXCIgKyBAbGluZXModGV4dCkgKyBcIlxcblwiKyBAZW5kU2VwKClcbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LndyYXBDb21tZW50KHN0cilcbiAgc2VwYXJhdG9yOiAtPlxuICAgIGxlbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGRlY29MaW5lKGxlbikpXG4gIHN0YXJ0U2VwOiAtPlxuICAgIGxuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoIC0gQG9wZW5UZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAcHJlZml4ICsgQHdyYXBDb21tZW50KEBvcGVuVGV4dCtAZGVjb0xpbmUobG4pKVxuICBlbmRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAY2xvc2VUZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGNsb3NlVGV4dCtAZGVjb0xpbmUobG4pKSArIEBzdWZmaXhcbiAgZGVjb0xpbmU6IChsZW4pIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChAZGVjbywgbGVuKVxuICBwYWRkaW5nOiAtPiBcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCBAcGFkKVxuICBsaW5lczogKHRleHQgPSAnJywgdXB0b0hlaWdodD10cnVlKSAtPlxuICAgIHRleHQgPSB0ZXh0IG9yICcnXG4gICAgbGluZXMgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIilcbiAgICBpZiB1cHRvSGVpZ2h0XG4gICAgICByZXR1cm4gKEBsaW5lKGxpbmVzW3hdIG9yICcnKSBmb3IgeCBpbiBbMC4uQGhlaWdodF0pLmpvaW4oJ1xcbicpIFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoQGxpbmUobCkgZm9yIGwgaW4gbGluZXMpLmpvaW4oJ1xcbicpIFxuICBsaW5lOiAodGV4dCA9ICcnKSAtPlxuICAgIHJldHVybiAoU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLEBpbmRlbnQpICtcbiAgICAgIEB3cmFwQ29tbWVudChcbiAgICAgICAgQGRlY28gK1xuICAgICAgICBAcGFkZGluZygpICtcbiAgICAgICAgdGV4dCArXG4gICAgICAgIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgQHdpZHRoIC0gQHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyBcbiAgICAgICAgQHBhZGRpbmcoKSArXG4gICAgICAgIEBkZWNvXG4gICAgICApKVxuICBsZWZ0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50TGVmdChAZGVjbyArIEBwYWRkaW5nKCkpXG4gIHJpZ2h0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQHBhZGRpbmcoKSArIEBkZWNvKVxuICByZW1vdmVJZ25vcmVkQ29udGVudDogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnMoQGNvbnRleHQuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHRleHQpKVxuICB0ZXh0Qm91bmRzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldFR4dFNpemUoQHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpKVxuICBnZXRCb3hGb3JQb3M6IChwb3MpIC0+XG4gICAgZGVwdGggPSBAZ2V0TmVzdGVkTHZsKHBvcy5zdGFydClcbiAgICBpZiBkZXB0aCA+IDBcbiAgICAgIGxlZnQgPSBAbGVmdCgpXG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LGRlcHRoLTEpXG4gICAgICBcbiAgICAgIGNsb25lID0gQGNsb25lKClcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiXG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aFxuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSBAZGVjbyArIEBkZWNvICsgcGxhY2Vob2xkZXIgKyBAZGVjbyArIEBkZWNvXG4gICAgICBcbiAgICAgIHN0YXJ0RmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwnLionKSlcbiAgICAgIFxuICAgICAgcGFpciA9IG5ldyBQYWlyKHN0YXJ0RmluZCxlbmRGaW5kLHtcbiAgICAgICAgdmFsaWRNYXRjaDogKG1hdGNoKT0+XG4gICAgICAgICAgIyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuICAgICAgICAgIGYgPSBAY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKVxuICAgICAgICAgIHJldHVybiAhZj8gb3IgZi5zdHIgIT0gbGVmdFxuICAgICAgfSlcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsQGNvbnRleHQuY29kZXdhdmUuZWRpdG9yLnRleHQoKSlcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgcmVzLnN0YXJ0ICs9IGN1ckxlZnQubGVuZ3RoXG4gICAgICAgIHJldHVybiByZXNcbiAgICBcbiAgZ2V0TmVzdGVkTHZsOiAoaW5kZXgpIC0+XG4gICAgZGVwdGggPSAwXG4gICAgbGVmdCA9IEBsZWZ0KClcbiAgICB3aGlsZSAoZiA9IEBjb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KGluZGV4ICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKSk/ICYmIGYuc3RyID09IGxlZnRcbiAgICAgIGluZGV4ID0gZi5wb3NcbiAgICAgIGRlcHRoKytcbiAgICByZXR1cm4gZGVwdGhcbiAgZ2V0T3B0RnJvbUxpbmU6IChsaW5lLGdldFBhZD10cnVlKSAtPlxuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdChAZGVjbykpK1wiKShcXFxccyopXCIpXG4gICAgckVuZCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQGRlY28pKStcIikoXFxufCQpXCIpXG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKVxuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKVxuICAgIGlmIHJlc1N0YXJ0PyBhbmQgcmVzRW5kP1xuICAgICAgaWYgZ2V0UGFkXG4gICAgICAgIEBwYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgscmVzRW5kWzFdLmxlbmd0aClcbiAgICAgIEBpbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGhcbiAgICAgIHN0YXJ0UG9zID0gcmVzU3RhcnQuaW5kZXggKyByZXNTdGFydFsxXS5sZW5ndGggKyByZXNTdGFydFsyXS5sZW5ndGggKyBAcGFkICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICdyZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCcgcmVzU3RhcnQuZW5kKDIpXG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gQHBhZCAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAncmVzRW5kLmluZGV4ICsgcmVzRW5kWzFdLmxlbmd0aCcgcmVzRW5kLnN0YXJ0KDIpXG4gICAgICBAd2lkdGggPSBlbmRQb3MgLSBzdGFydFBvc1xuICAgIHJldHVybiB0aGlzXG4gIHJlZm9ybWF0TGluZXM6ICh0ZXh0LG9wdGlvbnM9e30pIC0+XG4gICAgcmV0dXJuIEBsaW5lcyhAcmVtb3ZlQ29tbWVudCh0ZXh0LG9wdGlvbnMpLGZhbHNlKVxuICByZW1vdmVDb21tZW50OiAodGV4dCxvcHRpb25zPXt9KS0+XG4gICAgaWYgdGV4dD9cbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH1cbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24oe30sZGVmYXVsdHMsb3B0aW9ucylcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAZGVjbylcbiAgICAgIGZsYWcgPSBpZiBvcHRpb25zWydtdWx0aWxpbmUnXSB0aGVuICdnbScgZWxzZSAnJyAgICAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBcIidnbSdcIiByZS5NXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKiN7ZWNsfSg/OiN7ZWR9KSpcXFxcc3swLCN7QHBhZH19XCIsIGZsYWcpICAgICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICN7QHBhZH0gJ1wiK3N0cihzZWxmLnBhZCkrXCInXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXFxcXHMqKD86I3tlZH0pKiN7ZWNyfVxcXFxzKiRcIiwgZmxhZylcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmUxLCcnKS5yZXBsYWNlKHJlMiwnJylcbiAgIFxuICAiLCJpbXBvcnQgeyBQb3NDb2xsZWN0aW9uIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBDbG9zaW5nUHJvbXBcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsc2VsZWN0aW9ucykgLT5cbiAgICBAdGltZW91dCA9IG51bGxcbiAgICBAX3R5cGVkID0gbnVsbFxuICAgIEBzdGFydGVkID0gZmFsc2VcbiAgICBAbmJDaGFuZ2VzID0gMFxuICAgIEBzZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucylcbiAgYmVnaW46IC0+XG4gICAgQHN0YXJ0ZWQgPSB0cnVlXG4gICAgQGFkZENhcnJldHMoKVxuICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKVxuICAgICAgQHByb3h5T25DaGFuZ2UgPSAoY2g9bnVsbCk9PiBAb25DaGFuZ2UoY2gpXG4gICAgICBAY29kZXdhdmUuZWRpdG9yLmFkZENoYW5nZUxpc3RlbmVyKCBAcHJveHlPbkNoYW5nZSApXG4gICAgICBcbiAgICBcbiAgICByZXR1cm4gdGhpc1xuICBhZGRDYXJyZXRzOiAtPlxuICAgIEByZXBsYWNlbWVudHMgPSBAc2VsZWN0aW9ucy53cmFwKFxuICAgICAgQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2FycmV0Q2hhciArIEBjb2Rld2F2ZS5icmFrZXRzICsgXCJcXG5cIixcbiAgICAgIFwiXFxuXCIgKyBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY29kZXdhdmUuY2FycmV0Q2hhciArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgKS5tYXAoIChwKSAtPiBwLmNhcnJldFRvU2VsKCkgKVxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoQHJlcGxhY2VtZW50cylcbiAgaW52YWxpZFR5cGVkOiAtPlxuICAgIEBfdHlwZWQgPSBudWxsXG4gIG9uQ2hhbmdlOiAoY2ggPSBudWxsKS0+XG4gICAgQGludmFsaWRUeXBlZCgpXG4gICAgaWYgQHNraXBFdmVudChjaClcbiAgICAgIHJldHVyblxuICAgIEBuYkNoYW5nZXMrK1xuICAgIGlmIEBzaG91bGRTdG9wKClcbiAgICAgIEBzdG9wKClcbiAgICAgIEBjbGVhbkNsb3NlKClcbiAgICBlbHNlXG4gICAgICBAcmVzdW1lKClcbiAgICAgIFxuICBza2lwRXZlbnQ6IChjaCkgLT5cbiAgICByZXR1cm4gY2g/IGFuZCBjaC5jaGFyQ29kZUF0KDApICE9IDMyXG4gIFxuICByZXN1bWU6IC0+XG4gICAgI1xuICAgIFxuICBzaG91bGRTdG9wOiAtPlxuICAgIHJldHVybiBAdHlwZWQoKSA9PSBmYWxzZSBvciBAdHlwZWQoKS5pbmRleE9mKCcgJykgIT0gLTFcbiAgXG4gIGNsZWFuQ2xvc2U6IC0+XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzZWxlY3Rpb25zID0gQGdldFNlbGVjdGlvbnMoKVxuICAgIGZvciBzZWwgaW4gc2VsZWN0aW9uc1xuICAgICAgaWYgcG9zID0gQHdoaXRoaW5PcGVuQm91bmRzKHNlbClcbiAgICAgICAgc3RhcnQgPSBzZWxcbiAgICAgIGVsc2UgaWYgKGVuZCA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgYW5kIHN0YXJ0P1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS5pbm5lclRleHQoKS5zcGxpdCgnICcpWzBdXG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoZW5kLmlubmVyU3RhcnQsZW5kLmlubmVyRW5kLHJlcylcbiAgICAgICAgcmVwbC5zZWxlY3Rpb25zID0gW3N0YXJ0XVxuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgZ2V0U2VsZWN0aW9uczogLT5cbiAgICByZXR1cm4gQGNvZGV3YXZlLmVkaXRvci5nZXRNdWx0aVNlbCgpXG4gIHN0b3A6IC0+XG4gICAgQHN0YXJ0ZWQgPSBmYWxzZVxuICAgIGNsZWFyVGltZW91dChAdGltZW91dCkgaWYgQHRpbWVvdXQ/XG4gICAgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGwgaWYgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9PSB0aGlzXG4gICAgaWYgQHByb3h5T25DaGFuZ2U/XG4gICAgICBAY29kZXdhdmUuZWRpdG9yLnJlbW92ZUNoYW5nZUxpc3RlbmVyKEBwcm94eU9uQ2hhbmdlKVxuICBjYW5jZWw6IC0+XG4gICAgaWYgQHR5cGVkKCkgIT0gZmFsc2VcbiAgICAgIEBjYW5jZWxTZWxlY3Rpb25zKEBnZXRTZWxlY3Rpb25zKCkpXG4gICAgQHN0b3AoKVxuICBjYW5jZWxTZWxlY3Rpb25zOiAoc2VsZWN0aW9ucykgLT5cbiAgICByZXBsYWNlbWVudHMgPSBbXVxuICAgIHN0YXJ0ID0gbnVsbFxuICAgIGZvciBzZWwgaW4gc2VsZWN0aW9uc1xuICAgICAgaWYgcG9zID0gQHdoaXRoaW5PcGVuQm91bmRzKHNlbClcbiAgICAgICAgc3RhcnQgPSBwb3NcbiAgICAgIGVsc2UgaWYgKGVuZCA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgYW5kIHN0YXJ0P1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXcgUmVwbGFjZW1lbnQoc3RhcnQuc3RhcnQsZW5kLmVuZCxAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoc3RhcnQuZW5kKzEsIGVuZC5zdGFydC0xKSkuc2VsZWN0Q29udGVudCgpKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgdHlwZWQ6IC0+XG4gICAgdW5sZXNzIEBfdHlwZWQ/XG4gICAgICBjcG9zID0gQGNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKVxuICAgICAgaW5uZXJTdGFydCA9IEByZXBsYWNlbWVudHNbMF0uc3RhcnQgKyBAY29kZXdhdmUuYnJha2V0cy5sZW5ndGhcbiAgICAgIGlmIEBjb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PSBAcmVwbGFjZW1lbnRzWzBdLnN0YXJ0IGFuZCAoaW5uZXJFbmQgPSBAY29kZXdhdmUuZmluZE5leHRCcmFrZXQoaW5uZXJTdGFydCkpPyBhbmQgaW5uZXJFbmQgPj0gY3Bvcy5lbmRcbiAgICAgICAgQF90eXBlZCA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihpbm5lclN0YXJ0LCBpbm5lckVuZClcbiAgICAgIGVsc2VcbiAgICAgICAgQF90eXBlZCA9IGZhbHNlXG4gICAgcmV0dXJuIEBfdHlwZWRcbiAgd2hpdGhpbk9wZW5Cb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQHN0YXJ0UG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09IHRhcmdldFRleHRcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuICB3aGl0aGluQ2xvc2VCb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQGVuZFBvc0F0KGkpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT0gdGFyZ2V0VGV4dFxuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG4gIHN0YXJ0UG9zQXQ6IChpbmRleCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5zdGFydCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyKSxcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5lbmQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMSlcbiAgICAgICkud3JhcHBlZEJ5KEBjb2Rld2F2ZS5icmFrZXRzLCBAY29kZXdhdmUuYnJha2V0cylcbiAgZW5kUG9zQXQ6IChpbmRleCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5zdGFydCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsxKSxcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5lbmQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMilcbiAgICAgICkud3JhcHBlZEJ5KEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciwgQGNvZGV3YXZlLmJyYWtldHMpXG5cbmV4cG9ydCBjbGFzcyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgZXh0ZW5kcyBDbG9zaW5nUHJvbXBcbiAgcmVzdW1lOiAtPlxuICAgIEBzaW11bGF0ZVR5cGUoKVxuICBzaW11bGF0ZVR5cGU6IC0+XG4gICAgY2xlYXJUaW1lb3V0KEB0aW1lb3V0KSBpZiBAdGltZW91dD9cbiAgICBAdGltZW91dCA9IHNldFRpbWVvdXQgKD0+XG4gICAgICBAaW52YWxpZFR5cGVkKClcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBjdXJDbG9zZSA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoQHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdLmNvcHkoKS5hcHBseU9mZnNldChAdHlwZWQoKS5sZW5ndGgpKVxuICAgICAgaWYgY3VyQ2xvc2VcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChjdXJDbG9zZS5zdGFydCxjdXJDbG9zZS5lbmQsdGFyZ2V0VGV4dClcbiAgICAgICAgaWYgcmVwbC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLm5lY2Vzc2FyeSgpXG4gICAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pXG4gICAgICBlbHNlXG4gICAgICAgIEBzdG9wKClcbiAgICAgIEBvblR5cGVTaW11bGF0ZWQoKSBpZiBAb25UeXBlU2ltdWxhdGVkP1xuICAgICksIDJcbiAgc2tpcEV2ZW50OiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBnZXRTZWxlY3Rpb25zOiAtPlxuICAgIHJldHVybiBbXG4gICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKClcbiAgICAgICAgQHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdICsgQHR5cGVkKCkubGVuZ3RoXG4gICAgICBdXG4gIHdoaXRoaW5DbG9zZUJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAZW5kUG9zQXQoaSlcbiAgICAgIG5leHQgPSBAY29kZXdhdmUuZmluZE5leHRCcmFrZXQodGFyZ2V0UG9zLmlubmVyU3RhcnQpXG4gICAgICBpZiBuZXh0P1xuICAgICAgICB0YXJnZXRQb3MubW92ZVN1ZmZpeChuZXh0KVxuICAgICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuXG5DbG9zaW5nUHJvbXAubmV3Rm9yID0gKGNvZGV3YXZlLHNlbGVjdGlvbnMpIC0+XG4gIGlmIGNvZGV3YXZlLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICByZXR1cm4gbmV3IENsb3NpbmdQcm9tcChjb2Rld2F2ZSxzZWxlY3Rpb25zKVxuICBlbHNlXG4gICAgcmV0dXJuIG5ldyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAoY29kZXdhdmUsc2VsZWN0aW9ucykiLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBDbWRGaW5kZXJcbiAgY29uc3RydWN0b3I6IChuYW1lcywgb3B0aW9ucykgLT5cbiAgICBpZiB0eXBlb2YgbmFtZXMgPT0gJ3N0cmluZydcbiAgICAgIG5hbWVzID0gW25hbWVzXVxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsXG4gICAgICBuYW1lc3BhY2VzOiBbXVxuICAgICAgcGFyZW50Q29udGV4dDogbnVsbFxuICAgICAgY29udGV4dDogbnVsbFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzXG4gICAgICBtdXN0RXhlY3V0ZTogdHJ1ZVxuICAgICAgdXNlRGV0ZWN0b3JzOiB0cnVlXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWVcbiAgICAgIGluc3RhbmNlOiBudWxsXG4gICAgICBjb2Rld2F2ZTogbnVsbFxuICAgIH1cbiAgICBAbmFtZXMgPSBuYW1lc1xuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoQGNvZGV3YXZlKVxuICAgIGlmIEBwYXJlbnRDb250ZXh0P1xuICAgICAgQGNvbnRleHQucGFyZW50ID0gQHBhcmVudENvbnRleHRcbiAgICBpZiBAbmFtZXNwYWNlcz9cbiAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMoQG5hbWVzcGFjZXMpXG4gIGZpbmQ6IC0+XG4gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAgIEBjbWQgPSBAZmluZEluKEByb290KVxuICAgIHJldHVybiBAY21kXG4jICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4jICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiMgICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4jICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzOiAtPlxuICAgIHBhdGhzID0ge31cbiAgICBmb3IgbmFtZSBpbiBAbmFtZXMgXG4gICAgICBbc3BhY2UscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgc3BhY2U/IGFuZCAhKHNwYWNlIGluIEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgICAgdW5sZXNzIHNwYWNlIG9mIHBhdGhzIFxuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpXG4gICAgcmV0dXJuIHBhdGhzXG4gIGFwcGx5U3BhY2VPbk5hbWVzOiAobmFtZXNwYWNlKSAtPlxuICAgIFtzcGFjZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSx0cnVlKVxuICAgIEBuYW1lcy5tYXAoIChuYW1lKSAtPlxuICAgICAgW2N1cl9zcGFjZSxjdXJfcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgY3VyX3NwYWNlPyBhbmQgY3VyX3NwYWNlID09IHNwYWNlXG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdFxuICAgICAgaWYgcmVzdD9cbiAgICAgICAgbmFtZSA9IHJlc3QgKyAnOicgKyBuYW1lXG4gICAgICByZXR1cm4gbmFtZVxuICAgIClcbiAgZ2V0RGlyZWN0TmFtZXM6IC0+XG4gICAgcmV0dXJuIChuIGZvciBuIGluIEBuYW1lcyB3aGVuIG4uaW5kZXhPZihcIjpcIikgPT0gLTEpXG4gIHRyaWdnZXJEZXRlY3RvcnM6IC0+XG4gICAgaWYgQHVzZURldGVjdG9ycyBcbiAgICAgIEB1c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcG9zaWJpbGl0aWVzID0gbmV3IENtZEZpbmRlcihAY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKVxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoXG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXVxuICAgICAgICBmb3IgZGV0ZWN0b3IgaW4gY21kLmRldGVjdG9ycyBcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcylcbiAgICAgICAgICBpZiByZXM/XG4gICAgICAgICAgICBAY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcylcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICAgICAgaSsrXG4gIGZpbmRJbjogKGNtZCxwYXRoID0gbnVsbCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIG51bGxcbiAgICBiZXN0ID0gQGJlc3RJblBvc2liaWxpdGllcyhAZmluZFBvc2liaWxpdGllcygpKVxuICAgIGlmIGJlc3Q/XG4gICAgICByZXR1cm4gYmVzdFxuICBmaW5kUG9zaWJpbGl0aWVzOiAtPlxuICAgIHVubGVzcyBAcm9vdD9cbiAgICAgIHJldHVybiBbXVxuICAgIEByb290LmluaXQoKVxuICAgIHBvc2liaWxpdGllcyA9IFtdXG4gICAgZm9yIHNwYWNlLCBuYW1lcyBvZiBAZ2V0TmFtZXNXaXRoUGF0aHMoKVxuICAgICAgbmV4dHMgPSBAZ2V0Q21kRm9sbG93QWxpYXMoc3BhY2UpXG4gICAgICBmb3IgbmV4dCBpbiBuZXh0c1xuICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgZm9yIG5zcGMgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICBbbnNwY05hbWUscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLHRydWUpXG4gICAgICBuZXh0cyA9IEBnZXRDbWRGb2xsb3dBbGlhcyhuc3BjTmFtZSlcbiAgICAgIGZvciBuZXh0IGluIG5leHRzXG4gICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihAYXBwbHlTcGFjZU9uTmFtZXMobnNwYyksIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgZm9yIG5hbWUgaW4gQGdldERpcmVjdE5hbWVzKClcbiAgICAgIGRpcmVjdCA9IEByb290LmdldENtZChuYW1lKVxuICAgICAgaWYgQGNtZElzVmFsaWQoZGlyZWN0KVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpXG4gICAgaWYgQHVzZUZhbGxiYWNrc1xuICAgICAgZmFsbGJhY2sgPSBAcm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJylcbiAgICAgIGlmIEBjbWRJc1ZhbGlkKGZhbGxiYWNrKVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjaylcbiAgICBAcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzXG4gICAgcmV0dXJuIHBvc2liaWxpdGllc1xuICBnZXRDbWRGb2xsb3dBbGlhczogKG5hbWUpIC0+XG4gICAgY21kID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgaWYgY21kPyBcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5hbGlhc09mP1xuICAgICAgICByZXR1cm4gW2NtZCxjbWQuZ2V0QWxpYXNlZCgpXVxuICAgICAgcmV0dXJuIFtjbWRdXG4gICAgcmV0dXJuIFtjbWRdXG4gIGNtZElzVmFsaWQ6IChjbWQpIC0+XG4gICAgdW5sZXNzIGNtZD9cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIGNtZC5uYW1lICE9ICdmYWxsYmFjaycgJiYgY21kIGluIEBhbmNlc3RvcnMoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuICFAbXVzdEV4ZWN1dGUgb3IgQGNtZElzRXhlY3V0YWJsZShjbWQpXG4gIGFuY2VzdG9yczogLT5cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGNtZElzRXhlY3V0YWJsZTogKGNtZCkgLT5cbiAgICBuYW1lcyA9IEBnZXREaXJlY3ROYW1lcygpXG4gICAgaWYgbmFtZXMubGVuZ3RoID09IDFcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gIGNtZFNjb3JlOiAoY21kKSAtPlxuICAgIHNjb3JlID0gY21kLmRlcHRoXG4gICAgaWYgY21kLm5hbWUgPT0gJ2ZhbGxiYWNrJyBcbiAgICAgICAgc2NvcmUgLT0gMTAwMFxuICAgIHJldHVybiBzY29yZVxuICBiZXN0SW5Qb3NpYmlsaXRpZXM6IChwb3NzKSAtPlxuICAgIGlmIHBvc3MubGVuZ3RoID4gMFxuICAgICAgYmVzdCA9IG51bGxcbiAgICAgIGJlc3RTY29yZSA9IG51bGxcbiAgICAgIGZvciBwIGluIHBvc3NcbiAgICAgICAgc2NvcmUgPSBAY21kU2NvcmUocClcbiAgICAgICAgaWYgIWJlc3Q/IG9yIHNjb3JlID49IGJlc3RTY29yZVxuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlXG4gICAgICAgICAgYmVzdCA9IHBcbiAgICAgIHJldHVybiBiZXN0OyIsIiMgW3Bhd2FdXG4jICAgcmVwbGFjZSAncmVwbGFjZSgvXFx0L2cnICdyZXBsYWNlKFwiXFx0XCInXG5cbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBDbWRJbnN0YW5jZVxuICBjb25zdHJ1Y3RvcjogKEBjbWQsQGNvbnRleHQpIC0+XG4gIFxuICBpbml0OiAtPlxuICAgIHVubGVzcyBAaXNFbXB0eSgpIG9yIEBpbml0ZWRcbiAgICAgIEBpbml0ZWQgPSB0cnVlXG4gICAgICBAX2dldENtZE9iaigpXG4gICAgICBAX2luaXRQYXJhbXMoKVxuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgQGNtZE9iai5pbml0KClcbiAgICByZXR1cm4gdGhpc1xuICBzZXRQYXJhbToobmFtZSx2YWwpLT5cbiAgICBAbmFtZWRbbmFtZV0gPSB2YWxcbiAgcHVzaFBhcmFtOih2YWwpLT5cbiAgICBAcGFyYW1zLnB1c2godmFsKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgIHJldHVybiBAY29udGV4dCBvciBuZXcgQ29udGV4dCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUpLT5cbiAgICBmaW5kZXIgPSBAZ2V0Q29udGV4dCgpLmdldEZpbmRlcihjbWROYW1lLEBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRDbWRPYmo6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIEBjbWQuaW5pdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5jbHM/XG4gICAgICAgIEBjbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKVxuICAgICAgICByZXR1cm4gQGNtZE9ialxuICBfaW5pdFBhcmFtczogLT5cbiAgICBAbmFtZWQgPSBAZ2V0RGVmYXVsdHMoKVxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICByZXR1cm4gW11cbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQGNtZD9cbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIHJldHVybiBAY21kLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJlcyA9IHt9XG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGNtZC5kZWZhdWx0cylcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBjbWRPYmouZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJldHVybiByZXNcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIHJldHVybiBAYWxpYXNlZENtZCBvciBudWxsXG4gIGdldEFsaWFzZWRGaW5hbDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGFsaWFzZWRGaW5hbENtZD9cbiAgICAgICAgcmV0dXJuIEBhbGlhc2VkRmluYWxDbWQgb3IgbnVsbFxuICAgICAgaWYgQGNtZC5hbGlhc09mP1xuICAgICAgICBhbGlhc2VkID0gQGNtZFxuICAgICAgICB3aGlsZSBhbGlhc2VkPyBhbmQgYWxpYXNlZC5hbGlhc09mP1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcihAZ2V0RmluZGVyKEBhbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG4gICAgICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICAgICAgQGFsaWFzZWRDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIEBhbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIHJldHVybiBhbGlhc2VkXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBhbGlhc09mXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPcHRpb25zP1xuICAgICAgICByZXR1cm4gQGNtZE9wdGlvbnNcbiAgICAgIG9wdCA9IEBjbWQuX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxAY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIEBjbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIG9wdGlvbnM/IGFuZCBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBnZXRQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIG5hbWVzID0gW25hbWVzXSBpZiAodHlwZW9mIG5hbWVzIGluIFsnc3RyaW5nJywnbnVtYmVyJ10pXG4gICAgZm9yIG4gaW4gbmFtZXNcbiAgICAgIHJldHVybiBAbmFtZWRbbl0gaWYgQG5hbWVkW25dP1xuICAgICAgcmV0dXJuIEBwYXJhbXNbbl0gaWYgQHBhcmFtc1tuXT9cbiAgICByZXR1cm4gZGVmVmFsXG4gIGFuY2VzdG9yQ21kczogLT5cbiAgICBpZiBAY29udGV4dC5jb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKVxuICAgIHJldHVybiBbXVxuICBhbmNlc3RvckNtZHNBbmRTZWxmOiAtPlxuICAgIHJldHVybiBAYW5jZXN0b3JDbWRzKCkuY29uY2F0KFtAY21kXSlcbiAgcnVuRXhlY3V0ZUZ1bmN0OiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5leGVjdXRlKClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkRmluYWwoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuZXhlY3V0ZUZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKVxuICByYXdSZXN1bHQ6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZEZpbmFsKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLnJlc3VsdEZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpXG4gICAgICBpZiBjbWQucmVzdWx0U3RyP1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0clxuICByZXN1bHQ6IC0+IFxuICAgIEBpbml0KClcbiAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgaWYgKHJlcyA9IEByYXdSZXN1bHQoKSk/XG4gICAgICAgIHJlcyA9IEBmb3JtYXRJbmRlbnQocmVzKVxuICAgICAgICBpZiByZXMubGVuZ3RoID4gMCBhbmQgQGdldE9wdGlvbigncGFyc2UnLHRoaXMpIFxuICAgICAgICAgIHBhcnNlciA9IEBnZXRQYXJzZXJGb3JUZXh0KHJlcylcbiAgICAgICAgICByZXMgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgICBpZiBhbHRlckZ1bmN0ID0gQGdldE9wdGlvbignYWx0ZXJSZXN1bHQnLHRoaXMpXG4gICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsdGhpcylcbiAgICAgICAgcmV0dXJuIHJlc1xuICBnZXRQYXJzZXJGb3JUZXh0OiAodHh0PScnKSAtPlxuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7aW5JbnN0YW5jZTp0aGlzfSlcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuICAgIHJldHVybiBwYXJzZXJcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHJldHVybiAwXG4gIGZvcm1hdEluZGVudDogKHRleHQpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcdC9nLCcgICcpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYXBwbHlJbmRlbnQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuaW5kZW50Tm90Rmlyc3QodGV4dCxAZ2V0SW5kZW50KCksXCIgXCIpIiwiaW1wb3J0IHsgUHJvY2VzcyB9IGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSB9IGZyb20gJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcic7XG5pbXBvcnQgeyBQb3NDb2xsZWN0aW9uIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQ2xvc2luZ1Byb21wIH0gZnJvbSAnLi9DbG9zaW5nUHJvbXAnO1xuXG5leHBvcnQgY2xhc3MgQ29kZXdhdmVcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBvcHRpb25zID0ge30pIC0+XG4gICAgQ29kZXdhdmUuaW5pdCgpXG4gICAgQG1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nXG4gICAgQHZhcnMgPSB7fVxuICAgIFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ2JyYWtldHMnIDogJ35+JyxcbiAgICAgICdkZWNvJyA6ICd+JyxcbiAgICAgICdjbG9zZUNoYXInIDogJy8nLFxuICAgICAgJ25vRXhlY3V0ZUNoYXInIDogJyEnLFxuICAgICAgJ2NhcnJldENoYXInIDogJ3wnLFxuICAgICAgJ2NoZWNrQ2FycmV0JyA6IHRydWUsXG4gICAgICAnaW5JbnN0YW5jZScgOiBudWxsXG4gICAgfVxuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIFxuICAgIEBuZXN0ZWQgPSBpZiBAcGFyZW50PyB0aGVuIEBwYXJlbnQubmVzdGVkKzEgZWxzZSAwXG4gICAgXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgQGVkaXRvci5iaW5kZWRUbyh0aGlzKSBpZiBAZWRpdG9yP1xuICAgIFxuICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQodGhpcylcbiAgICBpZiBAaW5JbnN0YW5jZT9cbiAgICAgIEBjb250ZXh0LnBhcmVudCA9IEBpbkluc3RhbmNlLmNvbnRleHRcblxuICAgIEBsb2dnZXIgPSBuZXcgTG9nZ2VyKClcblxuICBvbkFjdGl2YXRpb25LZXk6IC0+XG4gICAgQHByb2Nlc3MgPSBuZXcgUHJvY2VzcygpXG4gICAgQGxvZ2dlci5sb2coJ2FjdGl2YXRpb24ga2V5JylcbiAgICBAcnVuQXRDdXJzb3JQb3MoKVxuICAgIEBwcm9jZXNzID0gbnVsbFxuICBydW5BdEN1cnNvclBvczogLT5cbiAgICBpZiBAZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgICAgQHJ1bkF0TXVsdGlQb3MoQGVkaXRvci5nZXRNdWx0aVNlbCgpKVxuICAgIGVsc2VcbiAgICAgIEBydW5BdFBvcyhAZWRpdG9yLmdldEN1cnNvclBvcygpKVxuICBydW5BdFBvczogKHBvcyktPlxuICAgIEBydW5BdE11bHRpUG9zKFtwb3NdKVxuICBydW5BdE11bHRpUG9zOiAobXVsdGlQb3MpLT5cbiAgICBpZiBtdWx0aVBvcy5sZW5ndGggPiAwXG4gICAgICBjbWQgPSBAY29tbWFuZE9uUG9zKG11bHRpUG9zWzBdLmVuZClcbiAgICAgIGlmIGNtZD9cbiAgICAgICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcylcbiAgICAgICAgY21kLmluaXQoKVxuICAgICAgICBAbG9nZ2VyLmxvZyhjbWQpXG4gICAgICAgIGNtZC5leGVjdXRlKClcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbXVsdGlQb3NbMF0uc3RhcnQgPT0gbXVsdGlQb3NbMF0uZW5kXG4gICAgICAgICAgQGFkZEJyYWtldHMobXVsdGlQb3MpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcylcbiAgY29tbWFuZE9uUG9zOiAocG9zKSAtPlxuICAgIGlmIEBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIGFuZCBAZm9sbG93ZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAxIFxuICAgICAgcHJldiA9IHBvcy1AYnJha2V0cy5sZW5ndGhcbiAgICAgIG5leHQgPSBwb3NcbiAgICBlbHNlXG4gICAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAwXG4gICAgICAgIHBvcyAtPSBAYnJha2V0cy5sZW5ndGhcbiAgICAgIHByZXYgPSBAZmluZFByZXZCcmFrZXQocG9zKVxuICAgICAgdW5sZXNzIHByZXY/XG4gICAgICAgIHJldHVybiBudWxsIFxuICAgICAgbmV4dCA9IEBmaW5kTmV4dEJyYWtldChwb3MtMSlcbiAgICAgIGlmICFuZXh0PyBvciBAY291bnRQcmV2QnJha2V0KHByZXYpICUgMiAhPSAwIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMscHJldixAZWRpdG9yLnRleHRTdWJzdHIocHJldixuZXh0K0BicmFrZXRzLmxlbmd0aCkpXG4gIG5leHRDbWQ6IChzdGFydCA9IDApIC0+XG4gICAgcG9zID0gc3RhcnRcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyAsW0BicmFrZXRzLFwiXFxuXCJdKVxuICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGhcbiAgICAgIGlmIGYuc3RyID09IEBicmFrZXRzXG4gICAgICAgIGlmIGJlZ2lubmluZz9cbiAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIEBlZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zK0BicmFrZXRzLmxlbmd0aCkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvc1xuICAgICAgZWxzZVxuICAgICAgICBiZWdpbm5pbmcgPSBudWxsXG4gICAgbnVsbFxuICBnZXRFbmNsb3NpbmdDbWQ6IChwb3MgPSAwKSAtPlxuICAgIGNwb3MgPSBwb3NcbiAgICBjbG9zaW5nUHJlZml4ID0gQGJyYWtldHMgKyBAY2xvc2VDaGFyXG4gICAgd2hpbGUgKHAgPSBAZmluZE5leHQoY3BvcyxjbG9zaW5nUHJlZml4KSk/XG4gICAgICBpZiBjbWQgPSBAY29tbWFuZE9uUG9zKHArY2xvc2luZ1ByZWZpeC5sZW5ndGgpXG4gICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgICAgaWYgY21kLnBvcyA8IHBvc1xuICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgIGVsc2VcbiAgICAgICAgY3BvcyA9IHArY2xvc2luZ1ByZWZpeC5sZW5ndGhcbiAgICBudWxsXG4gIHByZWNlZGVkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLUBicmFrZXRzLmxlbmd0aCxwb3MpID09IEBicmFrZXRzXG4gIGZvbGxvd2VkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLHBvcytAYnJha2V0cy5sZW5ndGgpID09IEBicmFrZXRzXG4gIGNvdW50UHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICBpID0gMFxuICAgIHdoaWxlIChzdGFydCA9IEBmaW5kUHJldkJyYWtldChzdGFydCkpP1xuICAgICAgaSsrXG4gICAgcmV0dXJuIGlcbiAgaXNFbmRMaW5lOiAocG9zKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrMSkgPT0gXCJcXG5cIiBvciBwb3MgKyAxID49IEBlZGl0b3IudGV4dExlbigpXG4gIGZpbmRQcmV2QnJha2V0OiAoc3RhcnQpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHRCcmFrZXQoc3RhcnQsLTEpXG4gIGZpbmROZXh0QnJha2V0OiAoc3RhcnQsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW0BicmFrZXRzLFwiXFxuXCJdLCBkaXJlY3Rpb24pXG4gICAgXG4gICAgZi5wb3MgaWYgZiBhbmQgZi5zdHIgPT0gQGJyYWtldHNcbiAgZmluZFByZXY6IChzdGFydCxzdHJpbmcpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHQoc3RhcnQsc3RyaW5nLC0xKVxuICBmaW5kTmV4dDogKHN0YXJ0LHN0cmluZyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBmID0gQGZpbmRBbnlOZXh0KHN0YXJ0ICxbc3RyaW5nXSwgZGlyZWN0aW9uKVxuICAgIGYucG9zIGlmIGZcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci5maW5kQW55TmV4dChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbilcbiAgICBcbiAgZmluZE1hdGNoaW5nUGFpcjogKHN0YXJ0UG9zLG9wZW5pbmcsY2xvc2luZyxkaXJlY3Rpb24gPSAxKSAtPlxuICAgIHBvcyA9IHN0YXJ0UG9zXG4gICAgbmVzdGVkID0gMFxuICAgIHdoaWxlIGYgPSBAZmluZEFueU5leHQocG9zLFtjbG9zaW5nLG9wZW5pbmddLGRpcmVjdGlvbilcbiAgICAgIHBvcyA9IGYucG9zICsgKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBmLnN0ci5sZW5ndGggZWxzZSAwKVxuICAgICAgaWYgZi5zdHIgPT0gKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBjbG9zaW5nIGVsc2Ugb3BlbmluZylcbiAgICAgICAgaWYgbmVzdGVkID4gMFxuICAgICAgICAgIG5lc3RlZC0tXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZlxuICAgICAgZWxzZVxuICAgICAgICBuZXN0ZWQrK1xuICAgIG51bGxcbiAgYWRkQnJha2V0czogKHBvcykgLT5cbiAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpXG4gICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAoQGJyYWtldHMsQGJyYWtldHMpLm1hcCggKHIpLT5yLnNlbGVjdENvbnRlbnQoKSApXG4gICAgQGVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIHByb21wdENsb3NpbmdDbWQ6IChzZWxlY3Rpb25zKSAtPlxuICAgIEBjbG9zaW5nUHJvbXAuc3RvcCgpIGlmIEBjbG9zaW5nUHJvbXA/XG4gICAgQGNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcC5uZXdGb3IodGhpcyxzZWxlY3Rpb25zKS5iZWdpbigpICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIC9cXChuZXcgKC4qKVxcKS5iZWdpbi8gJDEuYmVnaW4gcmVwYXJzZVxuICBwYXJzZUFsbDogKHJlY3Vyc2l2ZSA9IHRydWUpIC0+XG4gICAgaWYgQG5lc3RlZCA+IDEwMFxuICAgICAgdGhyb3cgXCJJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvblwiXG4gICAgcG9zID0gMFxuICAgIHdoaWxlIGNtZCA9IEBuZXh0Q21kKHBvcylcbiAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKVxuICAgICAgQGVkaXRvci5zZXRDdXJzb3JQb3MocG9zKVxuICAgICAgIyBjb25zb2xlLmxvZyhjbWQpXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiByZWN1cnNpdmUgYW5kIGNtZC5jb250ZW50PyBhbmQgKCFjbWQuZ2V0Q21kKCk/IG9yICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSlcbiAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge3BhcmVudDogdGhpc30pXG4gICAgICAgIGNtZC5jb250ZW50ID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIGlmIGNtZC5leGVjdXRlKCk/XG4gICAgICAgIGlmIGNtZC5yZXBsYWNlRW5kP1xuICAgICAgICAgIHBvcyA9IGNtZC5yZXBsYWNlRW5kXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwb3MgPSBAZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZFxuICAgIHJldHVybiBAZ2V0VGV4dCgpXG4gIGdldFRleHQ6IC0+XG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dCgpXG4gIGlzUm9vdDogLT5cbiAgICByZXR1cm4gIUBwYXJlbnQ/IGFuZCAoIUBpbkluc3RhbmNlPyBvciAhQGluSW5zdGFuY2UuZmluZGVyPylcbiAgZ2V0Um9vdDogLT5cbiAgICBpZiBAaXNSb290XG4gICAgICByZXR1cm4gdGhpc1xuICAgIGVsc2UgaWYgQHBhcmVudD9cbiAgICAgIHJldHVybiBAcGFyZW50LmdldFJvb3QoKVxuICAgIGVsc2UgaWYgQGluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpXG4gIHJlbW92ZUNhcnJldDogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsQGNhcnJldENoYXIpXG4gIGdldENhcnJldFBvczogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldENhcnJldFBvcyh0eHQsQGNhcnJldENoYXIpXG4gIHJlZ01hcmtlcjogKGZsYWdzPVwiZ1wiKSAtPiAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBmbGFncz1cImdcIiBmbGFncz0wIFxuICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQG1hcmtlciksIGZsYWdzKVxuICByZW1vdmVNYXJrZXJzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKEByZWdNYXJrZXIoKSwnJykgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgQHJlZ01hcmtlcigpIHNlbGYubWFya2VyIFxuXG4gIEBpbml0OiAtPlxuICAgIHVubGVzcyBAaW5pdGVkXG4gICAgICBAaW5pdGVkID0gdHJ1ZVxuICAgICAgQ29tbWFuZC5pbml0Q21kcygpXG4gICAgICBDb21tYW5kLmxvYWRDbWRzKClcblxuICBAaW5pdGVkOiBmYWxzZSIsIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBTdG9yYWdlIH0gZnJvbSAnLi9TdG9yYWdlJztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5cbl9vcHRLZXkgPSAoa2V5LGRpY3QsZGVmVmFsID0gbnVsbCkgLT5cbiAgIyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICByZXR1cm4gaWYga2V5IG9mIGRpY3QgdGhlbiBkaWN0W2tleV0gZWxzZSBkZWZWYWxcblxuXG5leHBvcnQgY2xhc3MgQ29tbWFuZFxuICBjb25zdHJ1Y3RvcjogKEBuYW1lLEBkYXRhPW51bGwsQHBhcmVudD1udWxsKSAtPlxuICAgIEBjbWRzID0gW11cbiAgICBAZGV0ZWN0b3JzID0gW11cbiAgICBAZXhlY3V0ZUZ1bmN0ID0gQHJlc3VsdEZ1bmN0ID0gQHJlc3VsdFN0ciA9IEBhbGlhc09mID0gQGNscyA9IG51bGxcbiAgICBAYWxpYXNlZCA9IG51bGxcbiAgICBAZnVsbE5hbWUgPSBAbmFtZVxuICAgIEBkZXB0aCA9IDBcbiAgICBbQF9wYXJlbnQsIEBfaW5pdGVkXSA9IFtudWxsLCBmYWxzZV1cbiAgICBAc2V0UGFyZW50KHBhcmVudClcbiAgICBAZGVmYXVsdHMgPSB7fVxuICAgIFxuICAgIEBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgY2hlY2tDYXJyZXQ6IHRydWUsXG4gICAgICBwYXJzZTogZmFsc2UsXG4gICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgYWx0ZXJSZXN1bHQ6IG51bGwsXG4gICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgfVxuICAgIEBvcHRpb25zID0ge31cbiAgICBAZmluYWxPcHRpb25zID0gbnVsbFxuICBwYXJlbnQ6IC0+XG4gICAgcmV0dXJuIEBfcGFyZW50XG4gIHNldFBhcmVudDogKHZhbHVlKSAtPlxuICAgIGlmIEBfcGFyZW50ICE9IHZhbHVlXG4gICAgICBAX3BhcmVudCA9IHZhbHVlXG4gICAgICBAZnVsbE5hbWUgPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQubmFtZT9cbiAgICAgICAgICBAX3BhcmVudC5mdWxsTmFtZSArICc6JyArIEBuYW1lIFxuICAgICAgICBlbHNlIFxuICAgICAgICAgIEBuYW1lXG4gICAgICApXG4gICAgICBAZGVwdGggPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQuZGVwdGg/XG4gICAgICAgIHRoZW4gQF9wYXJlbnQuZGVwdGggKyAxXG4gICAgICAgIGVsc2UgMFxuICAgICAgKVxuICBpbml0OiAtPlxuICAgIGlmICFAX2luaXRlZFxuICAgICAgQF9pbml0ZWQgPSB0cnVlXG4gICAgICBAcGFyc2VEYXRhKEBkYXRhKVxuICAgIHJldHVybiB0aGlzXG4gIHVucmVnaXN0ZXI6IC0+XG4gICAgQF9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpXG4gIGlzRWRpdGFibGU6IC0+XG4gICAgcmV0dXJuIEByZXN1bHRTdHI/IG9yIEBhbGlhc09mP1xuICBpc0V4ZWN1dGFibGU6IC0+XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgZm9yIHAgaW4gWydyZXN1bHRTdHInLCdyZXN1bHRGdW5jdCcsJ2NscycsJ2V4ZWN1dGVGdW5jdCddXG4gICAgICBpZiB0aGlzW3BdP1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICBpc0V4ZWN1dGFibGVXaXRoTmFtZTogKG5hbWUpIC0+XG4gICAgaWYgQGFsaWFzT2Y/XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgYWxpYXNPZiA9IEBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsbmFtZSlcbiAgICAgIGFsaWFzZWQgPSBAX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKGFsaWFzT2YpKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gQGlzRXhlY3V0YWJsZSgpXG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICBmb3IgcCBpbiBbJ3Jlc3VsdFN0cicsJ3Jlc3VsdEZ1bmN0J11cbiAgICAgIGlmIHRoaXNbcF0/XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldERlZmF1bHRzOiAtPlxuICAgIHJlcyA9IHt9XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBkZWZhdWx0cylcbiAgICByZXR1cm4gcmVzXG4gIF9hbGlhc2VkRnJvbUZpbmRlcjogKGZpbmRlcikgLT5cbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2VcbiAgICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAYWxpYXNPZj9cbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICByZXR1cm4gQF9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihAYWxpYXNPZikpXG4gIHNldE9wdGlvbnM6IChkYXRhKSAtPlxuICAgIGZvciBrZXksIHZhbCBvZiBkYXRhXG4gICAgICBpZiBrZXkgb2YgQGRlZmF1bHRPcHRpb25zXG4gICAgICAgIEBvcHRpb25zW2tleV0gPSB2YWxcbiAgX29wdGlvbnNGb3JBbGlhc2VkOiAoYWxpYXNlZCkgLT5cbiAgICBvcHQgPSB7fVxuICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LEBkZWZhdWx0T3B0aW9ucylcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsYWxpYXNlZC5nZXRPcHRpb25zKCkpXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0LEBvcHRpb25zKVxuICBnZXRPcHRpb25zOiAtPlxuICAgIHJldHVybiBAX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gIGhlbHA6IC0+XG4gICAgY21kID0gQGdldENtZCgnaGVscCcpXG4gICAgaWYgY21kP1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkucmVzdWx0U3RyXG4gIHBhcnNlRGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBkYXRhXG4gICAgaWYgdHlwZW9mIGRhdGEgPT0gJ3N0cmluZydcbiAgICAgIEByZXN1bHRTdHIgPSBkYXRhXG4gICAgICBAb3B0aW9uc1sncGFyc2UnXSA9IHRydWVcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZSBpZiBkYXRhPyAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBkYXRhPyBcImlzaW5zdGFuY2UoZGF0YSxkaWN0KVwiXG4gICAgICByZXR1cm4gQHBhcnNlRGljdERhdGEoZGF0YSlcbiAgICByZXR1cm4gZmFsc2VcbiAgcGFyc2VEaWN0RGF0YTogKGRhdGEpIC0+XG4gICAgcmVzID0gX29wdEtleSgncmVzdWx0JyxkYXRhKVxuICAgIGlmIHR5cGVvZiByZXMgPT0gXCJmdW5jdGlvblwiXG4gICAgICBAcmVzdWx0RnVuY3QgPSByZXNcbiAgICBlbHNlIGlmIHJlcz9cbiAgICAgIEByZXN1bHRTdHIgPSByZXNcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJyxkYXRhKVxuICAgIGlmIHR5cGVvZiBleGVjdXRlID09IFwiZnVuY3Rpb25cIlxuICAgICAgQGV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGVcbiAgICBAYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLGRhdGEpXG4gICAgQGNscyA9IF9vcHRLZXkoJ2NscycsZGF0YSlcbiAgICBAZGVmYXVsdHMgPSBfb3B0S2V5KCdkZWZhdWx0cycsZGF0YSxAZGVmYXVsdHMpXG4gICAgXG4gICAgQHNldE9wdGlvbnMoZGF0YSlcbiAgICBcbiAgICBpZiAnaGVscCcgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsZGF0YVsnaGVscCddLHRoaXMpKVxuICAgIGlmICdmYWxsYmFjaycgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLGRhdGFbJ2ZhbGxiYWNrJ10sdGhpcykpXG4gICAgICBcbiAgICBpZiAnY21kcycgb2YgZGF0YVxuICAgICAgQGFkZENtZHMoZGF0YVsnY21kcyddKVxuICAgIHJldHVybiB0cnVlXG4gIGFkZENtZHM6IChjbWRzKSAtPlxuICAgIGZvciBuYW1lLCBkYXRhIG9mIGNtZHNcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQobmFtZSxkYXRhLHRoaXMpKVxuICBhZGRDbWQ6IChjbWQpIC0+XG4gICAgZXhpc3RzID0gQGdldENtZChjbWQubmFtZSlcbiAgICBpZiBleGlzdHM/XG4gICAgICBAcmVtb3ZlQ21kKGV4aXN0cylcbiAgICBjbWQuc2V0UGFyZW50KHRoaXMpXG4gICAgQGNtZHMucHVzaChjbWQpXG4gICAgcmV0dXJuIGNtZFxuICByZW1vdmVDbWQ6IChjbWQpIC0+XG4gICAgaWYgKGkgPSBAY21kcy5pbmRleE9mKGNtZCkpID4gLTFcbiAgICAgIEBjbWRzLnNwbGljZShpLCAxKVxuICAgIHJldHVybiBjbWRcbiAgZ2V0Q21kOiAoZnVsbG5hbWUpIC0+XG4gICAgQGluaXQoKVxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgcmV0dXJuIEBnZXRDbWQoc3BhY2UpLmdldENtZChuYW1lKVxuICAgIGZvciBjbWQgaW4gQGNtZHNcbiAgICAgIGlmIGNtZC5uYW1lID09IG5hbWVcbiAgICAgICAgcmV0dXJuIGNtZFxuICBzZXRDbWREYXRhOiAoZnVsbG5hbWUsZGF0YSkgLT5cbiAgICBAc2V0Q21kKGZ1bGxuYW1lLG5ldyBDb21tYW5kKGZ1bGxuYW1lLnNwbGl0KCc6JykucG9wKCksZGF0YSkpXG4gIHNldENtZDogKGZ1bGxuYW1lLGNtZCkgLT5cbiAgICBbc3BhY2UsbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSlcbiAgICBpZiBzcGFjZT9cbiAgICAgIG5leHQgPSBAZ2V0Q21kKHNwYWNlKVxuICAgICAgdW5sZXNzIG5leHQ/XG4gICAgICAgIG5leHQgPSBAYWRkQ21kKG5ldyBDb21tYW5kKHNwYWNlKSlcbiAgICAgIHJldHVybiBuZXh0LnNldENtZChuYW1lLGNtZClcbiAgICBlbHNlXG4gICAgICBAYWRkQ21kKGNtZClcbiAgICAgIHJldHVybiBjbWRcbiAgYWRkRGV0ZWN0b3I6IChkZXRlY3RvcikgLT5cbiAgICBAZGV0ZWN0b3JzLnB1c2goZGV0ZWN0b3IpXG4gICAgXG4gIEBwcm92aWRlcnMgPSBbXVxuXG4gIEBpbml0Q21kczogLT5cbiAgICBDb21tYW5kLmNtZHMgPSBuZXcgQ29tbWFuZChudWxsLHtcbiAgICAgICdjbWRzJzp7XG4gICAgICAgICdoZWxsbyc6e1xuICAgICAgICAgIGhlbHA6IFwiXCJcIlxuICAgICAgICAgIFwiSGVsbG8sIHdvcmxkIVwiIGlzIHR5cGljYWxseSBvbmUgb2YgdGhlIHNpbXBsZXN0IHByb2dyYW1zIHBvc3NpYmxlIGluXG4gICAgICAgICAgbW9zdCBwcm9ncmFtbWluZyBsYW5ndWFnZXMsIGl0IGlzIGJ5IHRyYWRpdGlvbiBvZnRlbiAoLi4uKSB1c2VkIHRvXG4gICAgICAgICAgdmVyaWZ5IHRoYXQgYSBsYW5ndWFnZSBvciBzeXN0ZW0gaXMgb3BlcmF0aW5nIGNvcnJlY3RseSAtd2lraXBlZGlhXG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgcmVzdWx0OiAnSGVsbG8sIFdvcmxkISdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgZm9yIHByb3ZpZGVyIGluIEBwcm92aWRlcnNcbiAgICAgIHByb3ZpZGVyLnJlZ2lzdGVyKENvbW1hbmQuY21kcylcblxuICBAc2F2ZUNtZDogKGZ1bGxuYW1lLCBkYXRhKSAtPlxuICAgIHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG4gICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsZGF0YSlcbiAgICBzYXZlZENtZHMgPSBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgIHVubGVzcyBzYXZlZENtZHM/XG4gICAgICBzYXZlZENtZHMgPSB7fVxuICAgIHNhdmVkQ21kc1tmdWxsbmFtZV0gPSBkYXRhXG4gICAgc3RvcmFnZS5zYXZlKCdjbWRzJyxzYXZlZENtZHMpXG5cbiAgQGxvYWRDbWRzOiAtPlxuICAgIHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG4gICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICBpZiBzYXZlZENtZHM/IFxuICAgICAgZm9yIGZ1bGxuYW1lLCBkYXRhIG9mIHNhdmVkQ21kc1xuICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSlcblxuICBAcmVzZXRTYXZlZDogLT5cbiAgICBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycse30pXG5cbiAgQG1ha2VWYXJDbWQgPSAobmFtZSxiYXNlPXt9KSAtPiBcbiAgICBiYXNlLmV4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWwgaWYgdmFsP1xuICAgIHJldHVybiBiYXNlXG5cbiAgQG1ha2VCb29sVmFyQ21kID0gKG5hbWUsYmFzZT17fSkgLT4gXG4gICAgYmFzZS5leGVjdXRlID0gKGluc3RhbmNlKSAtPlxuICAgICAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSk/XG4gICAgICAgIHBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UuY29udGVudFxuICAgICAgICBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgdmFsPyBhbmQgdmFsIGluIFsnMCcsJ2ZhbHNlJywnbm8nXVxuICAgICAgICBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdHJ1ZVxuICAgIHJldHVybiBiYXNlXG4gIFxuXG5leHBvcnQgY2xhc3MgQmFzZUNvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAaW5zdGFuY2UpIC0+XG4gIGluaXQ6IC0+XG4gICAgI1xuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICByZXR1cm4gdGhpc1tcInJlc3VsdFwiXT8gIyBbcGF3YV0gcmVwbGFjZSB0aGlzW1wicmVzdWx0XCJdPyAnaGFzYXR0cihzZWxmLFwicmVzdWx0XCIpJ1xuICBnZXREZWZhdWx0czogLT5cbiAgICByZXR1cm4ge31cbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4ge31cbiAgICAgICIsIlxuaW1wb3J0IHsgQ21kRmluZGVyIH0gZnJvbSAnLi9DbWRGaW5kZXInO1xuaW1wb3J0IHsgQ21kSW5zdGFuY2UgfSBmcm9tICcuL0NtZEluc3RhbmNlJztcbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcblxuZXhwb3J0IGNsYXNzIENvbnRleHRcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUpIC0+XG4gICAgQG5hbWVTcGFjZXMgPSBbXVxuICBcbiAgYWRkTmFtZVNwYWNlOiAobmFtZSkgLT5cbiAgICBpZiBuYW1lIG5vdCBpbiBAbmFtZVNwYWNlcyBcbiAgICAgIEBuYW1lU3BhY2VzLnB1c2gobmFtZSlcbiAgICAgIEBfbmFtZXNwYWNlcyA9IG51bGxcbiAgYWRkTmFtZXNwYWNlczogKHNwYWNlcykgLT5cbiAgICBpZiBzcGFjZXMgXG4gICAgICBpZiB0eXBlb2Ygc3BhY2VzID09ICdzdHJpbmcnXG4gICAgICAgIHNwYWNlcyA9IFtzcGFjZXNdXG4gICAgICBmb3Igc3BhY2UgaW4gc3BhY2VzIFxuICAgICAgICBAYWRkTmFtZVNwYWNlKHNwYWNlKVxuICByZW1vdmVOYW1lU3BhY2U6IChuYW1lKSAtPlxuICAgIEBuYW1lU3BhY2VzID0gQG5hbWVTcGFjZXMuZmlsdGVyIChuKSAtPiBuIGlzbnQgbmFtZVxuXG4gIGdldE5hbWVTcGFjZXM6IC0+XG4gICAgdW5sZXNzIEBfbmFtZXNwYWNlcz9cbiAgICAgIG5wY3MgPSBbJ2NvcmUnXS5jb25jYXQoQG5hbWVTcGFjZXMpXG4gICAgICBpZiBAcGFyZW50P1xuICAgICAgICBucGNzID0gbnBjcy5jb25jYXQoQHBhcmVudC5nZXROYW1lU3BhY2VzKCkpXG4gICAgICBAX25hbWVzcGFjZXMgPSBBcnJheUhlbHBlci51bmlxdWUobnBjcylcbiAgICByZXR1cm4gQF9uYW1lc3BhY2VzXG4gIGdldENtZDogKGNtZE5hbWUsbmFtZVNwYWNlcyA9IFtdKSAtPlxuICAgIGZpbmRlciA9IEBnZXRGaW5kZXIoY21kTmFtZSxuYW1lU3BhY2VzKVxuICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUsbmFtZVNwYWNlcyA9IFtdKSAtPlxuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IG5hbWVTcGFjZXNcbiAgICAgIHVzZURldGVjdG9yczogQGlzUm9vdCgpXG4gICAgICBjb2Rld2F2ZTogQGNvZGV3YXZlXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSlcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD9cbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIGNjLmluZGV4T2YoJyVzJykgPiAtMVxuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJyxzdHIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgd3JhcENvbW1lbnRMZWZ0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLGkpICsgc3RyXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gIHdyYXBDb21tZW50UmlnaHQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkrMilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2NcbiAgY21kSW5zdGFuY2VGb3I6IChjbWQpIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsdGhpcylcbiAgZ2V0Q29tbWVudENoYXI6IC0+XG4gICAgaWYgQGNvbW1lbnRDaGFyP1xuICAgICAgcmV0dXJuIEBjb21tZW50Q2hhclxuICAgIGNtZCA9IEBnZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG4gICAgaWYgY21kP1xuICAgICAgaW5zdCA9IEBjbWRJbnN0YW5jZUZvcihjbWQpXG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnXG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICBAY29tbWVudENoYXIgPSBjaGFyXG4gICAgcmV0dXJuIEBjb21tZW50Q2hhciIsIiMgW3Bhd2EgcHl0aG9uXVxuIyAgIHJlcGxhY2UgL2RhdGEuKFxcdyspLyBkYXRhWyckMSddXG4jICAgcmVwbGFjZSBjb2Rld2F2ZS5lZGl0b3IudGV4dCgpIGNvZGV3YXZlLmVkaXRvci50ZXh0XG5cbmltcG9ydCB7IFBhaXIgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgY2xhc3MgRGV0ZWN0b3JcbiAgY29uc3RydWN0b3I6IChAZGF0YT17fSkgLT5cbiAgZGV0ZWN0OiAoZmluZGVyKSAtPlxuICAgIGlmIEBkZXRlY3RlZChmaW5kZXIpXG4gICAgICByZXR1cm4gQGRhdGEucmVzdWx0IGlmIEBkYXRhLnJlc3VsdD9cbiAgICBlbHNlXG4gICAgICByZXR1cm4gQGRhdGEuZWxzZSBpZiBAZGF0YS5lbHNlP1xuICBkZXRlY3RlZDogKGZpbmRlcikgLT5cbiAgICAjXG5cbmV4cG9ydCBjbGFzcyBMYW5nRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvclxuICBkZXRlY3Q6IChmaW5kZXIpIC0+XG4gICAgaWYgZmluZGVyLmNvZGV3YXZlPyBcbiAgICAgIGxhbmcgPSBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLmdldExhbmcoKVxuICAgICAgaWYgbGFuZz8gXG4gICAgICAgIHJldHVybiBsYW5nLnRvTG93ZXJDYXNlKClcbiAgICAgICAgXG5leHBvcnQgY2xhc3MgUGFpckRldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3JcbiAgZGV0ZWN0ZWQ6IChmaW5kZXIpIC0+XG4gICAgaWYgQGRhdGEub3BlbmVyPyBhbmQgQGRhdGEuY2xvc2VyPyBhbmQgZmluZGVyLmluc3RhbmNlP1xuICAgICAgcGFpciA9IG5ldyBQYWlyKEBkYXRhLm9wZW5lciwgQGRhdGEuY2xvc2VyLCBAZGF0YSlcbiAgICAgIGlmIHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICAgICAgIiwiIyBbcGF3YV1cbiMgICByZXBsYWNlIENvZGV3YXZlLkNvbW1hbmQuc2V0IGNvZGV3YXZlX2NvcmUuY29yZV9jbWRzLnNldFxuXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEVkaXRDbWRQcm9wXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsb3B0aW9ucykgLT5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICd2YXInIDogbnVsbCxcbiAgICAgICdvcHQnIDogbnVsbCxcbiAgICAgICdmdW5jdCcgOiBudWxsLFxuICAgICAgJ2RhdGFOYW1lJyA6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JyA6IGZhbHNlLFxuICAgICAgJ2NhcnJldCcgOiBmYWxzZSxcbiAgICB9XG4gICAgZm9yIGtleSBpbiBbJ3ZhcicsJ29wdCcsJ2Z1bmN0J11cbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIGRlZmF1bHRzWydkYXRhTmFtZSddID0gb3B0aW9uc1trZXldXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICAgIFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKEBuYW1lKVxuICBcbiAgd3JpdGVGb3I6IChwYXJzZXIsb2JqKSAtPlxuICAgIGlmIHBhcnNlci52YXJzW0BuYW1lXT9cbiAgICAgIG9ialtAZGF0YU5hbWVdID0gcGFyc2VyLnZhcnNbQG5hbWVdXG4gIHZhbEZyb21DbWQ6IChjbWQpIC0+XG4gICAgaWYgY21kP1xuICAgICAgaWYgQG9wdD9cbiAgICAgICAgcmV0dXJuIGNtZC5nZXRPcHRpb24oQG9wdClcbiAgICAgIGlmIEBmdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZFtAZnVuY3RdKClcbiAgICAgIGlmIEB2YXI/XG4gICAgICAgIHJldHVybiBjbWRbQHZhcl1cbiAgc2hvd0ZvckNtZDogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIEBzaG93RW1wdHkgb3IgdmFsP1xuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIGlmIEBzaG93Rm9yQ21kKGNtZClcbiAgICAgIFwiXCJcIlxuICAgICAgfn4je0BuYW1lfX5+XG4gICAgICAje0B2YWxGcm9tQ21kKGNtZCkgb3IgXCJcIn0je2lmIEBjYXJyZXQgdGhlbiBcInxcIiBlbHNlIFwiXCJ9XG4gICAgICB+fi8je0BuYW1lfX5+XG4gICAgICBcIlwiXCJcbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnNvdXJjZSBleHRlbmRzIEVkaXRDbWRQcm9wIFxuICB2YWxGcm9tQ21kOiAoY21kKS0+XG4gICAgcmVzID0gc3VwZXIoY21kKVxuICAgIGlmIHJlcz9cbiAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKC9cXHwvZywgJ3x8JykgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgJy9cXHwvZycgXCInfCdcIlxuICAgIHJldHVybiByZXNcbiAgc2V0Q21kOiAoY21kcyktPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKEBuYW1lLHsncHJldmVudFBhcnNlQWxsJyA6IHRydWV9KVxuICBzaG93Rm9yQ21kOiAoY21kKSAtPlxuICAgIHZhbCA9IEB2YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gKEBzaG93RW1wdHkgYW5kICEoY21kPyBhbmQgY21kLmFsaWFzT2Y/KSkgb3IgdmFsP1xuICAgIFxuICAgIFxuY2xhc3MgRWRpdENtZFByb3Auc3RyaW5nIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICBpZiBAdmFsRnJvbUNtZChjbWQpP1xuICAgICAgcmV0dXJuIFwifn4hI3tAbmFtZX0gJyN7QHZhbEZyb21DbWQoY21kKX0je2lmIEBjYXJyZXQgdGhlbiBcInxcIiBlbHNlIFwiXCJ9J35+XCJcbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnJldkJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZChAbmFtZSlcbiAgd3JpdGVGb3I6IChwYXJzZXIsb2JqKSAtPlxuICAgIGlmIHBhcnNlci52YXJzW0BuYW1lXT9cbiAgICAgIG9ialtAZGF0YU5hbWVdID0gIXBhcnNlci52YXJzW0BuYW1lXVxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIHZhbCA9IEB2YWxGcm9tQ21kKGNtZClcbiAgICBpZiB2YWw/IGFuZCAhdmFsXG4gICAgICByZXR1cm4gXCJ+fiEje0BuYW1lfX5+XCJcblxuICAgIFxuY2xhc3MgRWRpdENtZFByb3AuYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIHNldENtZDogKGNtZHMpIC0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKEBuYW1lKVxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIFwifn4hI3tAbmFtZX1+flwiIGlmIEB2YWxGcm9tQ21kKGNtZCkiLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQG5hbWVzcGFjZSA9IG51bGxcbiAgICBAX2xhbmcgPSBudWxsXG4gIGJpbmRlZFRvOiAoY29kZXdhdmUpIC0+XG4gICAgI1xuICB0ZXh0OiAodmFsKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRMZW46IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCA9IG51bGwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBiZWdpblVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBlbmRVbmRvQWN0aW9uOiAtPlxuICAgICNcbiAgZ2V0TGFuZzogLT5cbiAgICByZXR1cm4gQF9sYW5nXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdDogLT5cbiAgICByZXR1cm4gbnVsbFxuICBhbGxvd011bHRpU2VsZWN0aW9uOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBzZXRNdWx0aVNlbDogKHNlbGVjdGlvbnMpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRNdWx0aVNlbDogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGNhbkxpc3RlblRvQ2hhbmdlOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIFxuICBnZXRMaW5lQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQGZpbmRMaW5lU3RhcnQocG9zKSxAZmluZExpbmVFbmQocG9zKSlcbiAgZmluZExpbmVTdGFydDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiXSwgLTEpXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcysxIGVsc2UgMFxuICBmaW5kTGluZUVuZDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiLFwiXFxyXCJdKVxuICAgIHJldHVybiBpZiBwIHRoZW4gcC5wb3MgZWxzZSBAdGV4dExlbigpXG4gIFxuICBmaW5kQW55TmV4dDogKHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgaWYgZGlyZWN0aW9uID4gMFxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LEB0ZXh0TGVuKCkpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKDAsc3RhcnQpXG4gICAgYmVzdFBvcyA9IG51bGxcbiAgICBmb3Igc3RyaSBpbiBzdHJpbmdzXG4gICAgICBwb3MgPSBpZiBkaXJlY3Rpb24gPiAwIHRoZW4gdGV4dC5pbmRleE9mKHN0cmkpIGVsc2UgdGV4dC5sYXN0SW5kZXhPZihzdHJpKVxuICAgICAgaWYgcG9zICE9IC0xXG4gICAgICAgIGlmICFiZXN0UG9zPyBvciBiZXN0UG9zKmRpcmVjdGlvbiA+IHBvcypkaXJlY3Rpb25cbiAgICAgICAgICBiZXN0UG9zID0gcG9zXG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmlcbiAgICBpZiBiZXN0U3RyP1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBiZXN0UG9zICsgc3RhcnQgZWxzZSBiZXN0UG9zKSxiZXN0U3RyKVxuICAgIHJldHVybiBudWxsXG4gIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICBzZWxlY3Rpb25zID0gW11cbiAgICBvZmZzZXQgPSAwXG4gICAgZm9yIHJlcGwgaW4gcmVwbGFjZW1lbnRzXG4gICAgICByZXBsLndpdGhFZGl0b3IodGhpcylcbiAgICAgIHJlcGwuYXBwbHlPZmZzZXQob2Zmc2V0KVxuICAgICAgcmVwbC5hcHBseSgpXG4gICAgICBvZmZzZXQgKz0gcmVwbC5vZmZzZXRBZnRlcih0aGlzKVxuICAgICAgXG4gICAgICBzZWxlY3Rpb25zID0gc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKVxuICAgIEBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMoc2VsZWN0aW9ucylcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnM6IChzZWxlY3Rpb25zKSAtPlxuICAgIGlmIHNlbGVjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgaWYgQGFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgICAgICBAc2V0TXVsdGlTZWwoc2VsZWN0aW9ucylcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldEN1cnNvclBvcyhzZWxlY3Rpb25zWzBdLnN0YXJ0LHNlbGVjdGlvbnNbMF0uZW5kKSIsImV4cG9ydCBjbGFzcyBMb2dnZXJcbiAgbG9nOiAoYXJncy4uLikgLT5cbiAgICBpZiB3aW5kb3cuY29uc29sZSBhbmQgdGhpcy5lbmFibGVkXG4gICAgICBmb3IgbXNnIGluIGFyZ3NcbiAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICBlbmFibGVkOiB0cnVlXG4gIHJ1bnRpbWU6IChmdW5jdCxuYW1lID0gXCJmdW5jdGlvblwiKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGNvbnNvbGUubG9nKFwiI3tuYW1lfSB0b29rICN7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLlwiKVxuICAgIHJlc1xuICBtb25pdG9yRGF0YToge31cbiAgdG9Nb25pdG9yOiAob2JqLG5hbWUscHJlZml4PScnKSAtPlxuICAgIGZ1bmN0ID0gb2JqW25hbWVdXG4gICAgb2JqW25hbWVdID0gLT4gXG4gICAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgICB0aGlzLm1vbml0b3IoKC0+IGZ1bmN0LmFwcGx5KG9iaixhcmdzKSkscHJlZml4K25hbWUpXG4gIG1vbml0b3I6IChmdW5jdCxuYW1lKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGlmIHRoaXMubW9uaXRvckRhdGFbbmFtZV0/XG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLmNvdW50KytcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwrPSB0MSAtIHQwXG4gICAgZWxzZVxuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgY291bnQ6IDFcbiAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgIH1cbiAgICByZXNcbiAgcmVzdW1lOiAtPlxuICAgIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpXG4iLCJleHBvcnQgY2xhc3MgT3B0aW9uT2JqZWN0XG4gIHNldE9wdHM6IChvcHRpb25zLGRlZmF1bHRzKS0+XG4gICAgQGRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICBAc2V0T3B0KGtleSxvcHRpb25zW2tleV0pXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRPcHQoa2V5LHZhbClcbiAgICAgICAgXG4gIHNldE9wdDogKGtleSwgdmFsKS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgdGhpc1trZXldKHZhbClcbiAgICBlbHNlXG4gICAgICB0aGlzW2tleV09IHZhbFxuICAgICAgICBcbiAgZ2V0T3B0OiAoa2V5KS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXNba2V5XVxuICBcbiAgZ2V0T3B0czogLT5cbiAgICBvcHRzID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRzW2tleV0gPSBAZ2V0T3B0KGtleSlcbiAgICByZXR1cm4gb3B0cyIsIiMgW3Bhd2FdXG4jICAgcmVwbGFjZSAncmVwbGFjZSgvXFx0L2cnICdyZXBsYWNlKFwiXFx0XCInXG5cbmltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuL0JveEhlbHBlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsQHBvcyxAc3RyKSAtPlxuICAgIHN1cGVyKClcbiAgICB1bmxlc3MgQGlzRW1wdHkoKVxuICAgICAgQF9jaGVja0Nsb3NlcigpXG4gICAgICBAb3BlbmluZyA9IEBzdHJcbiAgICAgIEBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICAgIEBfc3BsaXRDb21wb25lbnRzKClcbiAgICAgIEBfZmluZENsb3NpbmcoKVxuICAgICAgQF9jaGVja0Vsb25nYXRlZCgpXG4gIF9jaGVja0Nsb3NlcjogLT5cbiAgICBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICBpZiBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5jbG9zZUNoYXIgYW5kIGYgPSBAX2ZpbmRPcGVuaW5nUG9zKClcbiAgICAgIEBjbG9zaW5nUG9zID0gbmV3IFN0clBvcyhAcG9zLCBAc3RyKVxuICAgICAgQHBvcyA9IGYucG9zXG4gICAgICBAc3RyID0gZi5zdHJcbiAgX2ZpbmRPcGVuaW5nUG9zOiAtPlxuICAgIGNtZE5hbWUgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cikuc3Vic3RyaW5nKEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKVxuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWVcbiAgICBjbG9zaW5nID0gQHN0clxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zLG9wZW5pbmcsY2xvc2luZywtMSlcbiAgICAgIGYuc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcytmLnN0ci5sZW5ndGgpK0Bjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgICAgIHJldHVybiBmXG4gIF9zcGxpdENvbXBvbmVudHM6IC0+XG4gICAgcGFydHMgPSBAbm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICBAY21kTmFtZSA9IHBhcnRzLnNoaWZ0KClcbiAgICBAcmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIilcbiAgX3BhcnNlUGFyYW1zOihwYXJhbXMpIC0+XG4gICAgQHBhcmFtcyA9IFtdXG4gICAgQG5hbWVkID0gQGdldERlZmF1bHRzKClcbiAgICBpZiBAY21kP1xuICAgICAgbmFtZVRvUGFyYW0gPSBAZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpXG4gICAgICBpZiBuYW1lVG9QYXJhbT8gXG4gICAgICAgIEBuYW1lZFtuYW1lVG9QYXJhbV0gPSBAY21kTmFtZVxuICAgIGlmIHBhcmFtcy5sZW5ndGhcbiAgICAgIGlmIEBjbWQ/XG4gICAgICAgIGFsbG93ZWROYW1lZCA9IEBnZXRPcHRpb24oJ2FsbG93ZWROYW1lZCcpIFxuICAgICAgaW5TdHIgPSBmYWxzZVxuICAgICAgcGFyYW0gPSAnJ1xuICAgICAgbmFtZSA9IGZhbHNlXG4gICAgICBmb3IgaSBpbiBbMC4uKHBhcmFtcy5sZW5ndGgtMSldXG4gICAgICAgIGNociA9IHBhcmFtc1tpXVxuICAgICAgICBpZiBjaHIgPT0gJyAnIGFuZCAhaW5TdHJcbiAgICAgICAgICBpZihuYW1lKVxuICAgICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGFyYW1zLnB1c2gocGFyYW0pXG4gICAgICAgICAgcGFyYW0gPSAnJ1xuICAgICAgICAgIG5hbWUgPSBmYWxzZVxuICAgICAgICBlbHNlIGlmIGNociBpbiBbJ1wiJyxcIidcIl0gYW5kIChpID09IDAgb3IgcGFyYW1zW2ktMV0gIT0gJ1xcXFwnKVxuICAgICAgICAgIGluU3RyID0gIWluU3RyXG4gICAgICAgIGVsc2UgaWYgY2hyID09ICc6JyBhbmQgIW5hbWUgYW5kICFpblN0ciBhbmQgKCFhbGxvd2VkTmFtZWQ/IG9yIG5hbWUgaW4gYWxsb3dlZE5hbWVkKVxuICAgICAgICAgIG5hbWUgPSBwYXJhbVxuICAgICAgICAgIHBhcmFtID0gJydcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBhcmFtICs9IGNoclxuICAgICAgaWYgcGFyYW0ubGVuZ3RoXG4gICAgICAgIGlmKG5hbWUpXG4gICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBwYXJhbXMucHVzaChwYXJhbSlcbiAgX2ZpbmRDbG9zaW5nOiAtPlxuICAgIGlmIGYgPSBAX2ZpbmRDbG9zaW5nUG9zKClcbiAgICAgIEBjb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUoQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MrQHN0ci5sZW5ndGgsZi5wb3MpKVxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGYucG9zK2Yuc3RyLmxlbmd0aClcbiAgX2ZpbmRDbG9zaW5nUG9zOiAtPlxuICAgIHJldHVybiBAY2xvc2luZ1BvcyBpZiBAY2xvc2luZ1Bvcz9cbiAgICBjbG9zaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZE5hbWUgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjbWROYW1lXG4gICAgaWYgZiA9IEBjb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKEBwb3MrQHN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpXG4gICAgICByZXR1cm4gQGNsb3NpbmdQb3MgPSBmXG4gIF9jaGVja0Vsb25nYXRlZDogLT5cbiAgICBlbmRQb3MgPSBAZ2V0RW5kUG9zKClcbiAgICBtYXggPSBAY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKVxuICAgIHdoaWxlIGVuZFBvcyA8IG1heCBhbmQgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyxlbmRQb3MrQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PSBAY29kZXdhdmUuZGVjb1xuICAgICAgZW5kUG9zKz1AY29kZXdhdmUuZGVjby5sZW5ndGhcbiAgICBpZiBlbmRQb3MgPj0gbWF4IG9yIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIEBjb2Rld2F2ZS5kZWNvLmxlbmd0aCkgaW4gWycgJyxcIlxcblwiLFwiXFxyXCJdXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICBfY2hlY2tCb3g6IC0+XG4gICAgaWYgQGNvZGV3YXZlLmluSW5zdGFuY2U/IGFuZCBAY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PSAnY29tbWVudCdcbiAgICAgIHJldHVyblxuICAgIGNsID0gQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KClcbiAgICBjciA9IEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKVxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKSArIGNyLmxlbmd0aFxuICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zIC0gY2wubGVuZ3RoLEBwb3MpID09IGNsIGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLGVuZFBvcykgPT0gY3JcbiAgICAgIEBwb3MgPSBAcG9zIC0gY2wubGVuZ3RoXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICAgICAgQF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICAgIGVsc2UgaWYgQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgYW5kIEBnZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xXG4gICAgICBAaW5Cb3ggPSAxXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQ6IC0+XG4gICAgaWYgQGNvbnRlbnRcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29kZXdhdmUuZGVjbylcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86I3tlZH0pKyN7ZWNyfSRcIiwgXCJnbVwiKSAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAnXCJnbVwiJyByZS5NXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXHI/XFxuXCIpXG4gICAgICByZTMgPSBuZXcgUmVnRXhwKFwiXFxuXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzKiRcIilcbiAgICAgIEBjb250ZW50ID0gQGNvbnRlbnQucmVwbGFjZShyZTEsJyQxJykucmVwbGFjZShyZTIsJycpLnJlcGxhY2UocmUzLCcnKVxuICBfZ2V0UGFyZW50Q21kczogLT5cbiAgICBAcGFyZW50ID0gQGNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZChAZ2V0RW5kUG9zKCkpPy5pbml0KClcbiAgc2V0TXVsdGlQb3M6IChtdWx0aVBvcykgLT5cbiAgICBAbXVsdGlQb3MgPSBtdWx0aVBvc1xuICBfZ2V0Q21kT2JqOiAtPlxuICAgIEBnZXRDbWQoKVxuICAgIEBfY2hlY2tCb3goKVxuICAgIEBjb250ZW50ID0gQHJlbW92ZUluZGVudEZyb21Db250ZW50KEBjb250ZW50KVxuICAgIHN1cGVyKClcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQF9wYXJzZVBhcmFtcyhAcmF3UGFyYW1zKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHJldHVybiBAY29udGV4dCBvciBAY29kZXdhdmUuY29udGV4dFxuICBnZXRDbWQ6IC0+XG4gICAgdW5sZXNzIEBjbWQ/XG4gICAgICBAX2dldFBhcmVudENtZHMoKVxuICAgICAgaWYgQG5vQnJhY2tldC5zdWJzdHJpbmcoMCxAY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyXG4gICAgICAgIEBjbWQgPSBDb21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKVxuICAgICAgICBAY29udGV4dCA9IEBjb2Rld2F2ZS5jb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIEBmaW5kZXIgPSBAZ2V0RmluZGVyKEBjbWROYW1lKVxuICAgICAgICBAY29udGV4dCA9IEBmaW5kZXIuY29udGV4dFxuICAgICAgICBAY21kID0gQGZpbmRlci5maW5kKClcbiAgICAgICAgaWYgQGNtZD9cbiAgICAgICAgICBAY29udGV4dC5hZGROYW1lU3BhY2UoQGNtZC5mdWxsTmFtZSlcbiAgICByZXR1cm4gQGNtZFxuICBnZXRGaW5kZXI6IChjbWROYW1lKS0+XG4gICAgZmluZGVyID0gQGNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsQF9nZXRQYXJlbnROYW1lc3BhY2VzKCkpXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgX2dldFBhcmVudE5hbWVzcGFjZXM6IC0+XG4gICAgbnNwY3MgPSBbXVxuICAgIG9iaiA9IHRoaXNcbiAgICB3aGlsZSBvYmoucGFyZW50P1xuICAgICAgb2JqID0gb2JqLnBhcmVudFxuICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKSBpZiBvYmouY21kPyBhbmQgb2JqLmNtZC5mdWxsTmFtZT9cbiAgICByZXR1cm4gbnNwY3NcbiAgX3JlbW92ZUJyYWNrZXQ6IChzdHIpLT5cbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyhAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgsc3RyLmxlbmd0aC1AY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQoQGNtZE5hbWUpXG4gICAgcmV0dXJuIGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJyxjbWROYW1lKVxuICBpc0VtcHR5OiAtPlxuICAgIHJldHVybiBAc3RyID09IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjb2Rld2F2ZS5icmFrZXRzIG9yIEBzdHIgPT0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuYnJha2V0c1xuICBleGVjdXRlOiAtPlxuICAgIGlmIEBpc0VtcHR5KClcbiAgICAgIGlmIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXA/IGFuZCBAY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKEBwb3MgKyBAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpP1xuICAgICAgICBAY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpXG4gICAgICBlbHNlXG4gICAgICAgIEByZXBsYWNlV2l0aCgnJylcbiAgICBlbHNlIGlmIEBjbWQ/XG4gICAgICBpZiBiZWZvcmVGdW5jdCA9IEBnZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKVxuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKVxuICAgICAgaWYgQHJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgICAgaWYgKHJlcyA9IEByZXN1bHQoKSk/XG4gICAgICAgICAgQHJlcGxhY2VXaXRoKHJlcylcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBAcnVuRXhlY3V0ZUZ1bmN0KClcbiAgZ2V0RW5kUG9zOiAtPlxuICAgIHJldHVybiBAcG9zK0BzdHIubGVuZ3RoXG4gIGdldFBvczogLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAcG9zLEBwb3MrQHN0ci5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0T3BlbmluZ1BvczogLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAcG9zLEBwb3MrQG9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gIGdldEluZGVudDogLT5cbiAgICB1bmxlc3MgQGluZGVudExlbj9cbiAgICAgIGlmIEBpbkJveD9cbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcihAY29udGV4dClcbiAgICAgICAgQGluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KEBnZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKSkubGVuZ3RoXG4gICAgICBlbHNlXG4gICAgICAgIEBpbmRlbnRMZW4gPSBAcG9zIC0gQGdldFBvcygpLnByZXZFT0woKVxuICAgIHJldHVybiBAaW5kZW50TGVuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50OiAodGV4dCkgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycrQGdldEluZGVudCgpKyd9JywnZ20nKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsJycpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYWx0ZXJSZXN1bHRGb3JCb3g6IChyZXBsKSAtPlxuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KClcbiAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLGZhbHNlKVxuICAgIGlmIEBnZXRPcHRpb24oJ3JlcGxhY2VCb3gnKVxuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbClcbiAgICAgIFtyZXBsLnN0YXJ0LCByZXBsLmVuZF0gPSBbYm94LnN0YXJ0LCBib3guZW5kXVxuICAgICAgQGluZGVudExlbiA9IGhlbHBlci5pbmRlbnRcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKClcbiAgICAgIHJlcGwuZW5kID0gb3JpZ2luYWwubmV4dEVPTCgpXG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIEBjb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyBAY29kZXdhdmUubWFya2VyICsgb3JpZ2luYWwuc2FtZUxpbmVzU3VmZml4KCksIHttdWx0aWxpbmU6ZmFsc2V9KVxuICAgICAgW3JlcGwucHJlZml4LHJlcGwudGV4dCxyZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQoQGNvZGV3YXZlLm1hcmtlcilcbiAgICByZXR1cm4gcmVwbFxuICBnZXRDdXJzb3JGcm9tUmVzdWx0OiAocmVwbCkgLT5cbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpXG4gICAgaWYgQGNtZD8gYW5kIEBjb2Rld2F2ZS5jaGVja0NhcnJldCBhbmQgQGdldE9wdGlvbignY2hlY2tDYXJyZXQnKVxuICAgICAgaWYgKHAgPSBAY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpPyBcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCtyZXBsLnByZWZpeC5sZW5ndGgrcFxuICAgICAgcmVwbC50ZXh0ID0gQGNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpXG4gICAgcmV0dXJuIGN1cnNvclBvc1xuICBjaGVja011bHRpOiAocmVwbCkgLT5cbiAgICBpZiBAbXVsdGlQb3M/IGFuZCBAbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgcmVwbGFjZW1lbnRzID0gW3JlcGxdXG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpXG4gICAgICBmb3IgcG9zLCBpIGluIEBtdWx0aVBvc1xuICAgICAgICBpZiBpID09IDBcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydFxuICAgICAgICBlbHNlXG4gICAgICAgICAgbmV3UmVwbCA9IHJlcGwuY29weSgpLmFwcGx5T2Zmc2V0KHBvcy5zdGFydC1vcmlnaW5hbFBvcylcbiAgICAgICAgICBpZiBuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09IG9yaWdpbmFsVGV4dFxuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbClcbiAgICAgIHJldHVybiByZXBsYWNlbWVudHNcbiAgICBlbHNlXG4gICAgICByZXR1cm4gW3JlcGxdXG4gIHJlcGxhY2VXaXRoOiAodGV4dCkgLT5cbiAgICBAYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoQHBvcyxAZ2V0RW5kUG9zKCksdGV4dCkpXG4gIGFwcGx5UmVwbGFjZW1lbnQ6IChyZXBsKSAtPlxuICAgIHJlcGwud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICAgIGlmIEBpbkJveD9cbiAgICAgIEBhbHRlclJlc3VsdEZvckJveChyZXBsKVxuICAgIGVsc2VcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgY3Vyc29yUG9zID0gQGdldEN1cnNvckZyb21SZXN1bHQocmVwbClcbiAgICByZXBsLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyhjdXJzb3JQb3MsIGN1cnNvclBvcyldXG4gICAgcmVwbGFjZW1lbnRzID0gQGNoZWNrTXVsdGkocmVwbClcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgICBcbiAgICBAcmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydFxuICAgIEByZXBsYWNlRW5kID0gcmVwbC5yZXNFbmQoKSIsImV4cG9ydCBjbGFzcyBQcm9jZXNzXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICMiLCJcbmV4cG9ydCBjbGFzcyBTdG9yYWdlXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShAZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKVxuICBsb2FkOiAoa2V5KSAtPlxuICAgIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oQGZ1bGxLZXkoa2V5KSkpXG4gIGZ1bGxLZXk6IChrZXkpIC0+XG4gICAgJ0NvZGVXYXZlXycra2V5IiwiaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBEb21LZXlMaXN0ZW5lclxuICBzdGFydExpc3RlbmluZzogKHRhcmdldCkgLT5cbiAgXG4gICAgdGltZW91dCA9IG51bGxcbiAgICBcbiAgICBvbmtleWRvd24gPSAoZSkgPT4gXG4gICAgICBpZiAoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgb3IgQG9iaiA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSBhbmQgZS5rZXlDb2RlID09IDY5ICYmIGUuY3RybEtleVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgQG9uQWN0aXZhdGlvbktleT9cbiAgICAgICAgICBAb25BY3RpdmF0aW9uS2V5KClcbiAgICBvbmtleXVwID0gKGUpID0+IFxuICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICBAb25BbnlDaGFuZ2UoZSlcbiAgICBvbmtleXByZXNzID0gKGUpID0+IFxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpIGlmIHRpbWVvdXQ/XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCAoPT5cbiAgICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgICAgKSwgMTAwXG4gICAgICAgICAgICBcbiAgICBpZiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lclxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgb25rZXlwcmVzcylcbiAgICBlbHNlIGlmIHRhcmdldC5hdHRhY2hFdmVudFxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcylcblxuaXNFbGVtZW50ID0gKG9iaikgLT5cbiAgdHJ5XG4gICAgIyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICBjYXRjaCBlXG4gICAgIyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgIyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgIyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG4gICAgcmV0dXJuICh0eXBlb2Ygb2JqPT1cIm9iamVjdFwiKSAmJlxuICAgICAgKG9iai5ub2RlVHlwZT09MSkgJiYgKHR5cGVvZiBvYmouc3R5bGUgPT0gXCJvYmplY3RcIikgJiZcbiAgICAgICh0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT1cIm9iamVjdFwiKVxuXG4gICAgICAgIFxuZXhwb3J0IGNsYXNzIFRleHRBcmVhRWRpdG9yIGV4dGVuZHMgVGV4dFBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEB0YXJnZXQpIC0+XG4gICAgc3VwZXIoKVxuICAgIEBvYmogPSBpZiBpc0VsZW1lbnQoQHRhcmdldCkgdGhlbiBAdGFyZ2V0IGVsc2UgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQHRhcmdldClcbiAgICB1bmxlc3MgQG9iaj9cbiAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCJcbiAgICBAbmFtZXNwYWNlID0gJ3RleHRhcmVhJ1xuICAgIEBjaGFuZ2VMaXN0ZW5lcnMgPSBbXVxuICAgIEBfc2tpcENoYW5nZUV2ZW50ID0gMFxuICBzdGFydExpc3RlbmluZzogRG9tS2V5TGlzdGVuZXIucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nXG4gIG9uQW55Q2hhbmdlOiAoZSkgLT5cbiAgICBpZiBAX3NraXBDaGFuZ2VFdmVudCA8PSAwXG4gICAgICBmb3IgY2FsbGJhY2sgaW4gQGNoYW5nZUxpc3RlbmVyc1xuICAgICAgICBjYWxsYmFjaygpXG4gICAgZWxzZVxuICAgICAgQF9za2lwQ2hhbmdlRXZlbnQtLVxuICAgICAgQG9uU2tpcGVkQ2hhbmdlKCkgaWYgQG9uU2tpcGVkQ2hhbmdlP1xuICBza2lwQ2hhbmdlRXZlbnQ6IChuYiA9IDEpIC0+XG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgKz0gbmJcbiAgYmluZGVkVG86IChjb2Rld2F2ZSkgLT5cbiAgICBAb25BY3RpdmF0aW9uS2V5ID0gLT4gY29kZXdhdmUub25BY3RpdmF0aW9uS2V5KClcbiAgICBAc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpXG4gIHNlbGVjdGlvblByb3BFeGlzdHM6IC0+XG4gICAgXCJzZWxlY3Rpb25TdGFydFwiIG9mIEBvYmpcbiAgaGFzRm9jdXM6IC0+IFxuICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaXMgQG9ialxuICB0ZXh0OiAodmFsKSAtPlxuICAgIGlmIHZhbD9cbiAgICAgIHVubGVzcyBAdGV4dEV2ZW50Q2hhbmdlKHZhbClcbiAgICAgICAgQG9iai52YWx1ZSA9IHZhbFxuICAgIEBvYmoudmFsdWVcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCwgZW5kKSBvciBAc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSBvciBzdXBlcihzdGFydCwgZW5kLCB0ZXh0KVxuICB0ZXh0RXZlbnRDaGFuZ2U6ICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIC0+XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50JykgaWYgZG9jdW1lbnQuY3JlYXRlRXZlbnQ/XG4gICAgaWYgZXZlbnQ/IGFuZCBldmVudC5pbml0VGV4dEV2ZW50PyBhbmQgZXZlbnQuaXNUcnVzdGVkICE9IGZhbHNlXG4gICAgICBlbmQgPSBAdGV4dExlbigpIHVubGVzcyBlbmQ/XG4gICAgICBpZiB0ZXh0Lmxlbmd0aCA8IDFcbiAgICAgICAgaWYgc3RhcnQgIT0gMFxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihzdGFydC0xLHN0YXJ0KVxuICAgICAgICAgIHN0YXJ0LS1cbiAgICAgICAgZWxzZSBpZiBlbmQgIT0gQHRleHRMZW4oKVxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihlbmQsZW5kKzEpXG4gICAgICAgICAgZW5kKytcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSlcbiAgICAgICMgQHNldEN1cnNvclBvcyhzdGFydCxlbmQpXG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBAb2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgICBAc2tpcENoYW5nZUV2ZW50KClcbiAgICAgIHRydWVcbiAgICBlbHNlIFxuICAgICAgZmFsc2VcbiAgc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZDogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBpZiBkb2N1bWVudC5leGVjQ29tbWFuZD9cbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpO1xuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuXG4gIGdldEN1cnNvclBvczogLT5cbiAgICByZXR1cm4gQHRtcEN1cnNvclBvcyBpZiBAdG1wQ3Vyc29yUG9zP1xuICAgIGlmIEBoYXNGb2N1c1xuICAgICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgICAgbmV3IFBvcyhAb2JqLnNlbGVjdGlvblN0YXJ0LEBvYmouc2VsZWN0aW9uRW5kKVxuICAgICAgZWxzZVxuICAgICAgICBAZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKVxuICBnZXRDdXJzb3JQb3NGYWxsYmFjazogLT5cbiAgICBpZiBAb2JqLmNyZWF0ZVRleHRSYW5nZVxuICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKClcbiAgICAgIGlmIHNlbC5wYXJlbnRFbGVtZW50KCkgaXMgQG9ialxuICAgICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayBzZWwuZ2V0Qm9va21hcmsoKVxuICAgICAgICBsZW4gPSAwXG5cbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgbGVuKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcm5nLnNldEVuZFBvaW50IFwiU3RhcnRUb1N0YXJ0XCIsIEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcG9zID0gbmV3IFBvcygwLGxlbilcbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgcG9zLnN0YXJ0KytcbiAgICAgICAgICBwb3MuZW5kKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcmV0dXJuIHBvc1xuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kKSAtPlxuICAgIGVuZCA9IHN0YXJ0IGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgIEB0bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIHNldFRpbWVvdXQgKD0+XG4gICAgICAgIEB0bXBDdXJzb3JQb3MgPSBudWxsXG4gICAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgKSwgMVxuICAgIGVsc2UgXG4gICAgICBAc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZClcbiAgICByZXR1cm5cbiAgc2V0Q3Vyc29yUG9zRmFsbGJhY2s6IChzdGFydCwgZW5kKSAtPlxuICAgIGlmIEBvYmouY3JlYXRlVGV4dFJhbmdlXG4gICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICBybmcubW92ZVN0YXJ0IFwiY2hhcmFjdGVyXCIsIHN0YXJ0XG4gICAgICBybmcuY29sbGFwc2UoKVxuICAgICAgcm5nLm1vdmVFbmQgXCJjaGFyYWN0ZXJcIiwgZW5kIC0gc3RhcnRcbiAgICAgIHJuZy5zZWxlY3QoKVxuICBnZXRMYW5nOiAtPlxuICAgIHJldHVybiBAX2xhbmcgaWYgQF9sYW5nXG4gICAgQG9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpIGlmIEBvYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKVxuICBzZXRMYW5nOiAodmFsKSAtPlxuICAgIEBfbGFuZyA9IHZhbFxuICAgIEBvYmouc2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnLHZhbClcbiAgY2FuTGlzdGVuVG9DaGFuZ2U6IC0+XG4gICAgcmV0dXJuIHRydWVcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBAY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgaWYgKGkgPSBAY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xXG4gICAgICBAY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpLCAxKVxuICAgICAgXG4gICAgICBcbiAgYXBwbHlSZXBsYWNlbWVudHM6IChyZXBsYWNlbWVudHMpIC0+XG4gICAgaWYgcmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgYW5kIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDFcbiAgICAgIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zID0gW0BnZXRDdXJzb3JQb3MoKV1cbiAgICBzdXBlcihyZXBsYWNlbWVudHMpO1xuICAgICAgIiwiIyBbcGF3YSBweXRob25dXG4jICAgcmVwbGFjZSAoRWRpdG9yKSAoZWRpdG9yLkVkaXRvcilcbiMgICByZXBsYWNlIEB0ZXh0KCkgIHNlbGYudGV4dFxuXG5pbXBvcnQgeyBFZGl0b3IgfSBmcm9tICcuL0VkaXRvcic7XG5cbmV4cG9ydCBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yXG4gIGNvbnN0cnVjdG9yOiAoQF90ZXh0KSAtPlxuICAgIHN1cGVyKClcbiAgICBzZWxmLm5hbWVzcGFjZSA9ICd0ZXh0X3BhcnNlcidcbiAgdGV4dDogKHZhbCkgLT5cbiAgICBAX3RleHQgPSB2YWwgaWYgdmFsP1xuICAgIEBfdGV4dFxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHJldHVybiBAdGV4dCgpW3Bvc11cbiAgdGV4dExlbjogKHBvcykgLT5cbiAgICByZXR1cm4gQHRleHQoKS5sZW5ndGhcbiAgdGV4dFN1YnN0cjogKHN0YXJ0LCBlbmQpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICBAdGV4dChAdGV4dCgpLnN1YnN0cmluZygwLCBwb3MpK3RleHQrQHRleHQoKS5zdWJzdHJpbmcocG9zLEB0ZXh0KCkubGVuZ3RoKSlcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHQoQHRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIEB0ZXh0KCkuc2xpY2UoZW5kKSlcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdGFyZ2V0XG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBAdGFyZ2V0ID0gKFxuICAgICAgICBzdGFydDogc3RhcnRcbiAgICAgICAgZW5kOiBlbmRcbiAgICAgICkiLCJpbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vQ29kZXdhdmUnO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBDb3JlQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgV3JhcHBlZFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvV3JhcHBlZFBvcyc7XG5cblBvcy53cmFwQ2xhc3MgPSBXcmFwcGVkUG9zXG5cbkNvZGV3YXZlLmluc3RhbmNlcyA9IFtdXG5cbkNvbW1hbmQucHJvdmlkZXJzID0gW1xuICBuZXcgQ29yZUNvbW1hbmRQcm92aWRlcigpXG5dXG5cbmV4cG9ydCB7IENvZGV3YXZlIH0iLCJcbmltcG9ydCB7IENvbW1hbmQsIEJhc2VDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMYW5nRGV0ZWN0b3IgfSBmcm9tICcuLi9EZXRlY3Rvcic7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuLi9Cb3hIZWxwZXInO1xuaW1wb3J0IHsgRWRpdENtZFByb3AgfSBmcm9tICcuLi9FZGl0Q21kUHJvcCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKVxuICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSlcbiAgXG4gIGNvcmUuYWRkQ21kcyh7XG4gICAgJ2hlbHAnOntcbiAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICB+fmJveH5+XG4gICAgICAgIH5+cXVvdGVfY2FycmV0fn5cbiAgICAgICAgICBfX18gICAgICAgICBfICAgX18gICAgICBfX1xuICAgICAgICAgLyBfX3xfX18gIF9ffCB8X19cXFxcIFxcXFwgICAgLyAvXyBfX18gX19fX19fXG4gICAgICAgIC8gL19fLyBfIFxcXFwvIF9gIC8gLV9cXFxcIFxcXFwvXFxcXC8gLyBfYCBcXFxcIFYgLyAtXy9cbiAgICAgICAgXFxcXF9fX19cXFxcX19fL1xcXFxfXyxfXFxcXF9fX3xcXFxcXy9cXFxcXy9cXFxcX18sX3xcXFxcXy9cXFxcX19ffFxuICAgICAgICBUaGUgdGV4dCBlZGl0b3IgaGVscGVyXG4gICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgIFxuICAgICAgICBXaGVuIHVzaW5nIENvZGV3YXZlIHlvdSB3aWxsIGJlIHdyaXRpbmcgY29tbWFuZHMgd2l0aGluIFxuICAgICAgICB5b3VyIHRleHQgZWRpdG9yLiBUaGVzZSBjb21tYW5kcyBtdXN0IGJlIHBsYWNlZCBiZXR3ZWVuIHR3byBcbiAgICAgICAgcGFpcnMgb2YgXCJ+XCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXG4gICAgICAgIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiwgd2l0aCB5b3VyIGN1cnNvciBpbnNpZGUgdGhlIGNvbW1hbmRcbiAgICAgICAgRXg6IH5+IWhlbGxvfn5cbiAgICAgICAgXG4gICAgICAgIFlvdSBkb250IG5lZWQgdG8gYWN0dWFsbHkgdHlwZSBhbnkgXCJ+XCIgKHRpbGRlKS4gXG4gICAgICAgIFByZXNzaW5nIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiB3aWxsIGFkZCB0aGVtIGlmIHlvdSBhcmUgbm90IGFscmVhZHlcbiAgICAgICAgd2l0aGluIGEgY29tbWFuZC5cbiAgICAgICAgXG4gICAgICAgIENvZGV3YXZlIGRvZXMgbm90IHVzZSBVSSB0byBkaXNwbGF5IGFueSBpbmZvcm1hdGlvbi4gXG4gICAgICAgIEluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxuICAgICAgICBUaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcbiAgICAgICAgaW4gdGhlIGhlbHAgc2VjdGlvbnMuXG4gICAgICAgIFxuICAgICAgICBUbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXG4gICAgICAgIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiB3aXRoIHlvdXIgY3Vyc29yIG9uIHRoZSBsaW5lIGJlbGxvdy5cbiAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgXG4gICAgICAgIFVzZSB0aGUgZm9sbG93aW5nIGNvbW1hbmQgZm9yIGEgd2Fsa3Rocm91Z2ggb2Ygc29tZSBvZiB0aGUgbWFueVxuICAgICAgICBmZWF0dXJlcyBvZiBDb2Rld2F2ZVxuICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cbiAgICAgICAgXG4gICAgICAgIExpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXG4gICAgICAgIH5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxuICAgICAgICBcbiAgICAgICAgfn4hY2xvc2V+flxuICAgICAgICB+fi9ib3h+flxuICAgICAgICBcIlwiXCJcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ3N1YmplY3RzJzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn4haGVscH5+XG4gICAgICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxuICAgICAgICAgICAgfn4haGVscDpzdWJqZWN0c35+ICh+fiFoZWxwOnN1Yn5+KVxuICAgICAgICAgICAgfn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnc3ViJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpzdWJqZWN0cydcbiAgICAgICAgfVxuICAgICAgICAnZ2V0X3N0YXJ0ZWQnOntcbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICBUaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cbiAgICAgICAgICAgIH5+IWhlbGxvfH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+aGVscDplZGl0aW5nOmludHJvfn5cbiAgICAgICAgICAgIH5+cXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcbiAgICAgICAgICAgIH5+IWhlbHA6ZWRpdGluZ35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxuICAgICAgICAgICAgb2YgSmF2YVNjcmlwdCBhYmJyZXZpYXRpb25zXG4gICAgICAgICAgICB+fiFqczpmfn5cbiAgICAgICAgICAgIH5+IWpzOmlmfn5cbiAgICAgICAgICAgICAgfn4hanM6bG9nfn5cIn5+IWhlbGxvfn5cIn5+IS9qczpsb2d+flxuICAgICAgICAgICAgfn4hL2pzOmlmfn5cbiAgICAgICAgICAgIH5+IS9qczpmfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxuICAgICAgICAgICAgcHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuIEVtbWV0IGFiYnJldmlhdGlvbnMgd2lsbCBiZSBcbiAgICAgICAgICAgIHVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cbiAgICAgICAgICAgIH5+IXVsPmxpfn4gKGlmIHlvdSBhcmUgaW4gYSBodG1sIGRvY2N1bWVudClcbiAgICAgICAgICAgIH5+IWVtbWV0IHVsPmxpfn5cbiAgICAgICAgICAgIH5+IWVtbWV0IG0yIGNzc35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvbW1hbmRzIGFyZSBzdG9yZWQgaW4gbmFtZXNwYWNlcy4gVGhlIHNhbWUgY29tbWFuZCBjYW4gaGF2ZSBcbiAgICAgICAgICAgIGRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxuICAgICAgICAgICAgfn4hanM6ZWFjaH5+XG4gICAgICAgICAgICB+fiFwaHA6b3V0ZXI6ZWFjaH5+XG4gICAgICAgICAgICB+fiFwaHA6aW5uZXI6ZWFjaH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFNvbWUgb2YgdGhlIG5hbWVzcGFjZXMgYXJlIGFjdGl2ZSBkZXBlbmRpbmcgb24gdGhlIGNvbnRleHQuIFRoZVxuICAgICAgICAgICAgZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcbiAgICAgICAgICAgIGFjdGl2ZSBuYW1lc3BhY2UuIFRoZSBmaXJzdCBjb21tYW5kIGNvbW1hbmQgd29ya3MgYmVjYXVzZSB0aGUgXG4gICAgICAgICAgICBjb3JlIG5hbWVzcGFjZSBpcyBhY3RpdmUuXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2V+flxuICAgICAgICAgICAgfn4hY29yZTpuYW1lc3BhY2V+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBZb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlIHBocH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2V+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBJbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXG4gICAgICAgICAgICBjb250ZXh0IGZyb20gdGhlIHN1cnJvdW5kaW5nIHRleHQuIEluIGEgUEhQIGZpbGUsIGl0IG1lYW5zIENvZGV3YXZlIFxuICAgICAgICAgICAgd2lsbCBhZGQgdGhlIFBIUCB0YWdzIHdoZW4geW91IG5lZWQgdGhlbS5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ2RlbW8nOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmdldF9zdGFydGVkJ1xuICAgICAgICB9XG4gICAgICAgICdlZGl0aW5nJzp7XG4gICAgICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAgICAgJ2ludHJvJzp7XG4gICAgICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICAgICAgQ29kZXdhdmUgYWxsb3dzIHlvdSB0byBtYWtlIHlvdXIgb3duIGNvbW1hbmRzIChvciBhYmJyZXZpYXRpb25zKSBcbiAgICAgICAgICAgICAgICBwdXQgeW91ciBjb250ZW50IGluc2lkZSBcInNvdXJjZVwiIHRoZSBkbyBcInNhdmVcIi4gVHJ5IGFkZGluZyBhbnkgXG4gICAgICAgICAgICAgICAgdGV4dCB0aGF0IGlzIG9uIHlvdXIgbWluZC5cbiAgICAgICAgICAgICAgICB+fiFlZGl0IG15X25ld19jb21tYW5kfH5+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgSWYgeW91IGRpZCB0aGUgbGFzdCBzdGVwIHJpZ2h0LCB5b3Ugc2hvdWxkIHNlZSB5b3VyIHRleHQgd2hlbiB5b3VcbiAgICAgICAgICAgICAgICBkbyB0aGUgZm9sbG93aW5nIGNvbW1hbmQuIEl0IGlzIG5vdyBzYXZlZCBhbmQgeW91IGNhbiB1c2UgaXQgXG4gICAgICAgICAgICAgICAgd2hlbmV2ZXIgeW91IHdhbnQuXG4gICAgICAgICAgICAgICAgfn4hbXlfbmV3X2NvbW1hbmR+flxuICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICB+fmhlbHA6ZWRpdGluZzppbnRyb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEFsbCB0aGUgd2luZG93cyBvZiBDb2Rld2F2ZSBhcmUgbWFkZSB3aXRoIHRoZSBjb21tYW5kIFwiYm94XCIuIFxuICAgICAgICAgICAgVGhleSBhcmUgbWVhbnQgdG8gZGlzcGxheSB0ZXh0IHRoYXQgc2hvdWxkIG5vdCByZW1haW4gaW4geW91ciBjb2RlLiBcbiAgICAgICAgICAgIFRoZXkgYXJlIHZhbGlkIGNvbW1lbnRzIHNvIHRoZXkgd29uJ3QgYnJlYWsgeW91ciBjb2RlIGFuZCB0aGUgY29tbWFuZCBcbiAgICAgICAgICAgIFwiY2xvc2VcIiBjYW4gYmUgdXNlZCB0byByZW1vdmUgdGhlbSByYXBpZGx5LiBZb3UgY2FuIG1ha2UgeW91ciBvd24gXG4gICAgICAgICAgICBjb21tYW5kcyB3aXRoIHRoZW0gaWYgeW91IG5lZWQgdG8gZGlzcGxheSBzb21lIHRleHQgdGVtcG9yYXJpbHkuXG4gICAgICAgICAgICB+fiFib3h+flxuICAgICAgICAgICAgVGhlIGJveCB3aWxsIHNjYWxlIHdpdGggdGhlIGNvbnRlbnQgeW91IHB1dCBpbiBpdFxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+IS9ib3h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICBXaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxuICAgICAgICAgICAgd2lsbCBiZSBsb2NhdGVkIG9uY2UgdGhlIGNvbW1hbmQgaXMgZXhwYW5kZWQuIFRvIGRvIHRoYXQsIHVzZSBhIFwifFwiIFxuICAgICAgICAgICAgKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcbiAgICAgICAgICAgIGNoYXJhY3Rlci5cbiAgICAgICAgICAgIH5+IWJveH5+XG4gICAgICAgICAgICBvbmUgOiB8IFxuICAgICAgICAgICAgdHdvIDogfHxcbiAgICAgICAgICAgIH5+IS9ib3h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBZb3UgY2FuIGFsc28gdXNlIHRoZSBcImVzY2FwZV9waXBlc1wiIGNvbW1hbmQgdGhhdCB3aWxsIGVzY2FwZSBhbnkgXG4gICAgICAgICAgICB2ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xuICAgICAgICAgICAgfn4hZXNjYXBlX3BpcGVzfn5cbiAgICAgICAgICAgIHxcbiAgICAgICAgICAgIH5+IS9lc2NhcGVfcGlwZXN+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb21tYW5kcyBpbnNpZGUgb3RoZXIgY29tbWFuZHMgd2lsbCBiZSBleHBhbmRlZCBhdXRvbWF0aWNhbGx5LlxuICAgICAgICAgICAgSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxuICAgICAgICAgICAgdGhlIHBhcmVudCBjb21tYW5kIGlzIGV4cGFuZGVkLCB1c2UgYSBcIiFcIiAoZXhjbGFtYXRpb24gbWFyaykuXG4gICAgICAgICAgICB+fiEhaGVsbG9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBGb3IgY29tbWFuZHMgdGhhdCBoYXZlIGJvdGggYW4gb3BlbmluZyBhbmQgYSBjbG9zaW5nIHRhZywgeW91IGNhbiB1c2VcbiAgICAgICAgICAgIHRoZSBcImNvbnRlbnRcIiBjb21tYW5kLiBcImNvbnRlbnRcIiB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRleHRcbiAgICAgICAgICAgIHRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cbiAgICAgICAgICAgIH5+IWVkaXQgcGhwOmlubmVyOmlmfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ2VkaXQnOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmVkaXRpbmcnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgICdub19leGVjdXRlJzp7XG4gICAgICAncmVzdWx0JyA6IG5vX2V4ZWN1dGVcbiAgICB9LFxuICAgICdlc2NhcGVfcGlwZXMnOntcbiAgICAgICdyZXN1bHQnIDogcXVvdGVfY2FycmV0LFxuICAgICAgJ2NoZWNrQ2FycmV0JyA6IGZhbHNlXG4gICAgfSxcbiAgICAncXVvdGVfY2FycmV0Jzp7XG4gICAgICAnYWxpYXNPZic6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICB9XG4gICAgJ2V4ZWNfcGFyZW50Jzp7XG4gICAgICAnZXhlY3V0ZScgOiBleGVjX3BhcmVudFxuICAgIH0sXG4gICAgJ2NvbnRlbnQnOntcbiAgICAgICdyZXN1bHQnIDogZ2V0Q29udGVudFxuICAgIH0sXG4gICAgJ2JveCc6e1xuICAgICAgJ2NscycgOiBCb3hDbWRcbiAgICB9LFxuICAgICdjbG9zZSc6e1xuICAgICAgJ2NscycgOiBDbG9zZUNtZFxuICAgIH0sXG4gICAgJ3BhcmFtJzp7XG4gICAgICAncmVzdWx0JyA6IGdldFBhcmFtXG4gICAgfSxcbiAgICAnZWRpdCc6e1xuICAgICAgJ2NtZHMnIDogRWRpdENtZC5zZXRDbWRzKHtcbiAgICAgICAgJ3NhdmUnOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmV4ZWNfcGFyZW50J1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgICdjbHMnIDogRWRpdENtZFxuICAgIH0sXG4gICAgJ3JlbmFtZSc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2FwcGxpY2FibGUnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIFlvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiLFxuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogcmVuYW1lQ29tbWFuZCxcbiAgICAgICdwYXJzZScgOiB0cnVlXG4gICAgfSxcbiAgICAncmVtb3ZlJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfYXBwbGljYWJsZScgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCIsXG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiByZW1vdmVDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICB9LFxuICAgICdhbGlhcyc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogYWxpYXNDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICB9LFxuICAgICduYW1lc3BhY2UnOntcbiAgICAgICdjbHMnIDogTmFtZVNwYWNlQ21kXG4gICAgfSxcbiAgICAnbnNwYyc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6bmFtZXNwYWNlJ1xuICAgIH0sXG4gICAgJ2VtbWV0Jzp7XG4gICAgICAnY2xzJyA6IEVtbWV0Q21kXG4gICAgfSxcbiAgICBcbiAgfSlcbiAgXG5ub19leGVjdXRlID0gKGluc3RhbmNlKSAtPlxuICByZWcgPSBuZXcgUmVnRXhwKFwiXihcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSlcbiAgcmV0dXJuIGluc3RhbmNlLnN0ci5yZXBsYWNlKHJlZywnJDEnKVxuICBcbnF1b3RlX2NhcnJldCA9IChpbnN0YW5jZSkgLT5cbiAgcmV0dXJuIGluc3RhbmNlLmNvbnRlbnQucmVwbGFjZSgvXFx8L2csICd8fCcpICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICcvXFx8L2cnIFwiJ3wnXCJcbmV4ZWNfcGFyZW50ID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5wYXJlbnQ/XG4gICAgcmVzID0gaW5zdGFuY2UucGFyZW50LmV4ZWN1dGUoKVxuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnRcbiAgICBpbnN0YW5jZS5yZXBsYWNlRW5kID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VFbmRcbiAgICByZXR1cm4gcmVzXG5nZXRDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuICBhZmZpeGVzX2VtcHR5ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydhZmZpeGVzX2VtcHR5J10sZmFsc2UpXG4gIHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gIHN1ZmZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sJycpXG4gIGlmIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2U/XG4gICAgcmV0dXJuIHByZWZpeCArIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmNvbnRlbnQgb3IgJycpICsgc3VmZml4XG4gIGlmIGFmZml4ZXNfZW1wdHlcbiAgICByZXR1cm4gcHJlZml4ICsgc3VmZml4XG5yZW5hbWVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICBzYXZlZENtZHMgPSBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICBvcmlnbmluYWxOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2Zyb20nXSlcbiAgbmV3TmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCd0byddKVxuICBpZiBvcmlnbmluYWxOYW1lPyBhbmQgbmV3TmFtZT9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChvcmlnbmluYWxOYW1lKVxuICAgIGlmIHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXT8gYW5kIGNtZD9cbiAgICAgIHVubGVzcyBuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCcnKSArIG5ld05hbWVcbiAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsY21kRGF0YSlcbiAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgIHNhdmVkQ21kc1tuZXdOYW1lXSA9IGNtZERhdGFcbiAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIGlmIGNtZD8gXG4gICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIlxuICAgIGVsc2UgXG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbnJlbW92ZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICBpZiBuYW1lP1xuICAgIHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG4gICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuICAgIGlmIHNhdmVkQ21kc1tuYW1lXT8gYW5kIGNtZD9cbiAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbbmFtZV1cbiAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV1cbiAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIGlmIGNtZD8gXG4gICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIlxuICAgIGVsc2UgXG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbmFsaWFzQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIGFsaWFzID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2FsaWFzJ10pXG4gIGlmIG5hbWU/IGFuZCBhbGlhcz9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuICAgIGlmIGNtZD9cbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgb3IgY21kXG4gICAgICAjIHVubGVzcyBhbGlhcy5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgICAjIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7IGFsaWFzT2Y6IGNtZC5mdWxsTmFtZSB9KVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIFxuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG4gICAgICBcbmdldFBhcmFtID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlP1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcyxpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsJ2RlZmF1bHQnXSkpXG4gIFxuY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAaGVscGVyID0gbmV3IEJveEhlbHBlcihAaW5zdGFuY2UuY29udGV4dClcbiAgICBAY21kID0gQGluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pXG4gICAgaWYgQGNtZD9cbiAgICAgIEBoZWxwZXIub3BlblRleHQgID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAY21kICsgQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIEBoZWxwZXIuY2xvc2VUZXh0ID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZC5zcGxpdChcIiBcIilbMF0gKyBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgIEBoZWxwZXIuZGVjbyA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5kZWNvXG4gICAgQGhlbHBlci5wYWQgPSAyXG4gICAgQGhlbHBlci5wcmVmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgICBAaGVscGVyLnN1ZmZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCcnKVxuICAgIFxuICBoZWlnaHQ6IC0+XG4gICAgaWYgQGJvdW5kcygpP1xuICAgICAgaGVpZ2h0ID0gQGJvdW5kcygpLmhlaWdodFxuICAgIGVsc2VcbiAgICAgIGhlaWdodCA9IDNcbiAgICAgIFxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J11cbiAgICBpZiBAaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEgXG4gICAgICBwYXJhbXMucHVzaCgxKVxuICAgIGVsc2UgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAwXG4gICAgICBwYXJhbXMucHVzaCgwKVxuICAgIHJldHVybiBAaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLGhlaWdodClcbiAgICAgIFxuICB3aWR0aDogLT5cbiAgICBpZiBAYm91bmRzKCk/XG4gICAgICB3aWR0aCA9IEBib3VuZHMoKS53aWR0aFxuICAgIGVsc2VcbiAgICAgIHdpZHRoID0gM1xuICAgICAgXG4gICAgcGFyYW1zID0gWyd3aWR0aCddXG4gICAgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxIFxuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICByZXR1cm4gTWF0aC5tYXgoQG1pbldpZHRoKCksIEBpbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSlcblxuICBcbiAgYm91bmRzOiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgQF9ib3VuZHM/XG4gICAgICAgIEBfYm91bmRzID0gQGhlbHBlci50ZXh0Qm91bmRzKEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcmV0dXJuIEBfYm91bmRzXG4gICAgICBcbiAgcmVzdWx0OiAtPlxuICAgIEBoZWxwZXIuaGVpZ2h0ID0gQGhlaWdodCgpXG4gICAgQGhlbHBlci53aWR0aCA9IEB3aWR0aCgpXG4gICAgcmV0dXJuIEBoZWxwZXIuZHJhdyhAaW5zdGFuY2UuY29udGVudClcbiAgbWluV2lkdGg6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJldHVybiBAY21kLmxlbmd0aFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwXG4gIFxuY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBpbnN0YW5jZS5jb250ZXh0KVxuICBleGVjdXRlOiAtPlxuICAgIHByZWZpeCA9IEBoZWxwZXIucHJlZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gICAgc3VmZml4ID0gQGhlbHBlci5zdWZmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgICBib3ggPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3JlcXVpcmVkX2FmZml4ZXMnXSx0cnVlKVxuICAgIGlmICFyZXF1aXJlZF9hZmZpeGVzXG4gICAgICBAaGVscGVyLnByZWZpeCA9IEBoZWxwZXIuc3VmZml4ID0gJydcbiAgICAgIGJveDIgPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgICBpZiBib3gyPyBhbmQgKCFib3g/IG9yIGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIG9yIGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpXG4gICAgICAgIGJveCA9IGJveDJcbiAgICBpZiBib3g/XG4gICAgICBkZXB0aCA9IEBoZWxwZXIuZ2V0TmVzdGVkTHZsKEBpbnN0YW5jZS5nZXRQb3MoKS5zdGFydClcbiAgICAgIGlmIGRlcHRoIDwgMlxuICAgICAgICBAaW5zdGFuY2UuaW5Cb3ggPSBudWxsXG4gICAgICBAaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LGJveC5lbmQsJycpKVxuICAgIGVsc2VcbiAgICAgIEBpbnN0YW5jZS5yZXBsYWNlV2l0aCgnJylcbiAgICAgICAgICBcbmNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBjbWROYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgICBAdmVyYmFsaXplID0gQGluc3RhbmNlLmdldFBhcmFtKFsxXSkgaW4gWyd2JywndmVyYmFsaXplJ11cbiAgICBpZiBAY21kTmFtZT9cbiAgICAgIEBmaW5kZXIgPSBAaW5zdGFuY2UuY29udGV4dC5nZXRGaW5kZXIoQGNtZE5hbWUpIFxuICAgICAgQGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgQGVkaXRhYmxlID0gaWYgQGNtZD8gdGhlbiBAY21kLmlzRWRpdGFibGUoKSBlbHNlIHRydWVcbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4ge1xuICAgICAgYWxsb3dlZE5hbWVkOiBbJ2NtZCddXG4gICAgfVxuICByZXN1bHQ6IC0+XG4gICAgaWYgQGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHJldHVybiBAcmVzdWx0V2l0aENvbnRlbnQoKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAcmVzdWx0V2l0aG91dENvbnRlbnQoKVxuICByZXN1bHRXaXRoQ29udGVudDogLT5cbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIGRhdGEgPSB7fVxuICAgICAgZm9yIHAgaW4gRWRpdENtZC5wcm9wc1xuICAgICAgICBwLndyaXRlRm9yKHBhcnNlcixkYXRhKVxuICAgICAgQ29tbWFuZC5zYXZlQ21kKEBjbWROYW1lLCBkYXRhKVxuICAgICAgcmV0dXJuICcnXG4gIHByb3BzRGlzcGxheTogLT5cbiAgICAgIGNtZCA9IEBjbWRcbiAgICAgIHJldHVybiBFZGl0Q21kLnByb3BzLm1hcCggKHApLT4gcC5kaXNwbGF5KGNtZCkgKS5maWx0ZXIoIChwKS0+IHA/ICkuam9pbihcIlxcblwiKVxuICByZXN1bHRXaXRob3V0Q29udGVudDogLT5cbiAgICBpZiAhQGNtZCBvciBAZWRpdGFibGVcbiAgICAgIG5hbWUgPSBpZiBAY21kIHRoZW4gQGNtZC5mdWxsTmFtZSBlbHNlIEBjbWROYW1lXG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChcbiAgICAgICAgXCJcIlwiXG4gICAgICAgIH5+Ym94IGNtZDpcIiN7QGluc3RhbmNlLmNtZC5mdWxsTmFtZX0gI3tuYW1lfVwifn5cbiAgICAgICAgI3tAcHJvcHNEaXNwbGF5KCl9XG4gICAgICAgIH5+c2F2ZX5+IH5+IWNsb3Nlfn5cbiAgICAgICAgfn4vYm94fn5cbiAgICAgICAgXCJcIlwiKVxuICAgICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gbm9cbiAgICAgIHJldHVybiBpZiBAdmVyYmFsaXplIHRoZW4gcGFyc2VyLmdldFRleHQoKSBlbHNlIHBhcnNlci5wYXJzZUFsbCgpXG5FZGl0Q21kLnNldENtZHMgPSAoYmFzZSkgLT5cbiAgZm9yIHAgaW4gRWRpdENtZC5wcm9wc1xuICAgIHAuc2V0Q21kKGJhc2UpXG4gIHJldHVybiBiYXNlXG5FZGl0Q21kLnByb3BzID0gW1xuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fY2FycmV0JywgICAgICAgICB7b3B0OidjaGVja0NhcnJldCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJywgICAgICAgICAge29wdDoncGFyc2UnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCAgICdwcmV2ZW50X3BhcnNlX2FsbCcsIHtvcHQ6J3ByZXZlbnRQYXJzZUFsbCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woICAgJ3JlcGxhY2VfYm94JywgICAgICAge29wdDoncmVwbGFjZUJveCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZyggJ25hbWVfdG9fcGFyYW0nLCAgICAge29wdDonbmFtZVRvUGFyYW0nfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoICdhbGlhc19vZicsICAgICAgICAgIHt2YXI6J2FsaWFzT2YnLCBjYXJyZXQ6dHJ1ZX0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCAnaGVscCcsICAgICAgICAgICAgICB7ZnVuY3Q6J2hlbHAnLCBzaG93RW1wdHk6dHJ1ZX0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCAnc291cmNlJywgICAgICAgICAgICB7dmFyOidyZXN1bHRTdHInLCBkYXRhTmFtZToncmVzdWx0Jywgc2hvd0VtcHR5OnRydWUsIGNhcnJldDp0cnVlfSksXG5dXG5jbGFzcyBOYW1lU3BhY2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBuYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswXSlcbiAgcmVzdWx0OiAtPlxuICAgIGlmIEBuYW1lP1xuICAgICAgQGluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0LmFkZE5hbWVTcGFjZShAbmFtZSlcbiAgICAgIHJldHVybiAnJ1xuICAgIGVsc2VcbiAgICAgIG5hbWVzcGFjZXMgPSBAaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKClcbiAgICAgIHR4dCA9ICd+fmJveH5+XFxuJ1xuICAgICAgZm9yIG5zcGMgaW4gbmFtZXNwYWNlcyBcbiAgICAgICAgaWYgbnNwYyAhPSBAaW5zdGFuY2UuY21kLmZ1bGxOYW1lXG4gICAgICAgICAgdHh0ICs9IG5zcGMrJ1xcbidcbiAgICAgIHR4dCArPSAnfn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dClcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKVxuXG5cblxuY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBhYmJyID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCdhYmJyJywnYWJicmV2aWF0aW9uJ10pXG4gICAgQGxhbmcgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2xhbmcnLCdsYW5ndWFnZSddKVxuICByZXN1bHQ6IC0+XG4gICAgZW1tZXQgPSBpZiB3aW5kb3cuZW1tZXQ/XG4gICAgICB3aW5kb3cuZW1tZXRcbiAgICBlbHNlIGlmIHdpbmRvdy5zZWxmPy5lbW1ldD9cbiAgICAgIHdpbmRvdy5zZWxmLmVtbWV0XG4gICAgZWxzZSBpZiB3aW5kb3cuZ2xvYmFsPy5lbW1ldD9cbiAgICAgIHdpbmRvdy5nbG9iYWwuZW1tZXRcbiAgICBpZiBlbW1ldD9cbiAgICAgICMgZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKEBhYmJyLCBAbGFuZylcbiAgICAgIHJlcy5yZXBsYWNlKC9cXCRcXHswXFx9L2csICd8JylcblxuXG5cbiIsImltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9ib290c3RyYXAnO1xuaW1wb3J0IHsgVGV4dEFyZWFFZGl0b3IgfSBmcm9tICcuL1RleHRBcmVhRWRpdG9yJztcblxuQ29kZXdhdmUuZGV0ZWN0ID0gKHRhcmdldCkgLT5cbiAgY3cgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRBcmVhRWRpdG9yKHRhcmdldCkpXG4gIENvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KVxuICBjd1xuXG5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZVxuXG53aW5kb3cuQ29kZXdhdmUgPSBDb2Rld2F2ZVxuICAiLCJleHBvcnQgY2xhc3MgQXJyYXlIZWxwZXJcbiAgQGlzQXJyYXk6IChhcnIpIC0+XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggYXJyICkgPT0gJ1tvYmplY3QgQXJyYXldJ1xuICBcbiAgQHVuaW9uOiAoYTEsYTIpIC0+XG4gICAgQHVuaXF1ZShhMS5jb25jYXQoYTIpKVxuICAgIFxuICBAdW5pcXVlOiAoYXJyYXkpIC0+XG4gICAgYSA9IGFycmF5LmNvbmNhdCgpXG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgYS5sZW5ndGhcbiAgICAgIGogPSBpICsgMVxuICAgICAgd2hpbGUgaiA8IGEubGVuZ3RoXG4gICAgICAgIGlmIGFbaV0gPT0gYVtqXVxuICAgICAgICAgIGEuc3BsaWNlKGotLSwgMSlcbiAgICAgICAgKytqXG4gICAgICArK2lcbiAgICBhIiwiZXhwb3J0IGNsYXNzIENvbW1vbkhlbHBlclxuXG4gIEBtZXJnZTogKHhzLi4uKSAtPlxuICAgIGlmIHhzPy5sZW5ndGggPiAwXG4gICAgICBAdGFwIHt9LCAobSkgLT4gbVtrXSA9IHYgZm9yIGssIHYgb2YgeCBmb3IgeCBpbiB4c1xuIFxuICBAdGFwOiAobywgZm4pIC0+IFxuICAgIGZuKG8pXG4gICAgb1xuXG4gIEBhcHBseU1peGluczogKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIC0+IFxuICAgIGJhc2VDdG9ycy5mb3JFYWNoIChiYXNlQ3RvcikgPT4gXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpLmZvckVhY2ggKG5hbWUpPT4gXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLCBuYW1lLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2VDdG9yLnByb3RvdHlwZSwgbmFtZSkpIiwiXG5leHBvcnQgY2xhc3MgTmFtZXNwYWNlSGVscGVyXG5cbiAgQHNwbGl0Rmlyc3Q6IChmdWxsbmFtZSxpc1NwYWNlID0gZmFsc2UpIC0+XG4gICAgaWYgZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT0gLTEgYW5kICFpc1NwYWNlXG4gICAgICByZXR1cm4gW251bGwsZnVsbG5hbWVdXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLHBhcnRzLmpvaW4oJzonKSB8fCBudWxsXVxuXG4gIEBzcGxpdDogKGZ1bGxuYW1lKSAtPlxuICAgIGlmIGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09IC0xXG4gICAgICByZXR1cm4gW251bGwsZnVsbG5hbWVdXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgbmFtZSA9IHBhcnRzLnBvcCgpXG4gICAgW3BhcnRzLmpvaW4oJzonKSxuYW1lXSIsImltcG9ydCB7IFNpemUgfSBmcm9tICcuLi9wb3NpdGlvbmluZy9TaXplJztcblxuZXhwb3J0IGNsYXNzIFN0cmluZ0hlbHBlclxuICBAdHJpbUVtcHR5TGluZTogKHR4dCkgLT5cbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJylcblxuICBAZXNjYXBlUmVnRXhwOiAoc3RyKSAtPlxuICAgIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIilcblxuICBAcmVwZWF0VG9MZW5ndGg6ICh0eHQsIGxlbmd0aCkgLT5cbiAgICByZXR1cm4gJycgaWYgbGVuZ3RoIDw9IDBcbiAgICBBcnJheShNYXRoLmNlaWwobGVuZ3RoL3R4dC5sZW5ndGgpKzEpLmpvaW4odHh0KS5zdWJzdHJpbmcoMCxsZW5ndGgpXG4gICAgXG4gIEByZXBlYXQ6ICh0eHQsIG5iKSAtPlxuICAgIEFycmF5KG5iKzEpLmpvaW4odHh0KVxuICAgIFxuICBAZ2V0VHh0U2l6ZTogKHR4dCkgLT5cbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywnJykuc3BsaXQoXCJcXG5cIikgICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICcvXFxyL2cnIFwiJ1xccidcIlxuICAgIHcgPSAwXG4gICAgZm9yIGwgaW4gbGluZXNcbiAgICAgIHcgPSBNYXRoLm1heCh3LGwubGVuZ3RoKVxuICAgIHJldHVybiBuZXcgU2l6ZSh3LGxpbmVzLmxlbmd0aC0xKVxuXG4gIEBpbmRlbnROb3RGaXJzdDogKHRleHQsbmI9MSxzcGFjZXM9JyAgJykgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmVnID0gL1xcbi9nICAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAnL1xcbi9nJyBcInJlLmNvbXBpbGUocidcXG4nLHJlLk0pXCJcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCBcIlxcblwiICsgQHJlcGVhdChzcGFjZXMsIG5iKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICAgICAgXG4gIEBpbmRlbnQ6ICh0ZXh0LG5iPTEsc3BhY2VzPScgICcpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJldHVybiBzcGFjZXMgKyBAaW5kZW50Tm90Rmlyc3QodGV4dCxuYixzcGFjZXMpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgXG4gIEByZXZlcnNlU3RyOiAodHh0KSAtPlxuICAgIHJldHVybiB0eHQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIilcbiAgXG4gIFxuICBAcmVtb3ZlQ2FycmV0OiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHRtcCA9ICdbW1tbcXVvdGVkX2NhcnJldF1dXV0nXG4gICAgcmVDYXJyZXQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIrY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHJlVG1wID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKHRtcCksIFwiZ1wiKVxuICAgIHR4dC5yZXBsYWNlKHJlUXVvdGVkLHRtcCkucmVwbGFjZShyZUNhcnJldCwnJykucmVwbGFjZShyZVRtcCwgY2FycmV0Q2hhcilcbiAgICBcbiAgQGdldEFuZFJlbW92ZUZpcnN0Q2FycmV0OiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHBvcyA9IEBnZXRDYXJyZXRQb3ModHh0LGNhcnJldENoYXIpXG4gICAgaWYgcG9zP1xuICAgICAgdHh0ID0gdHh0LnN1YnN0cigwLHBvcykgKyB0eHQuc3Vic3RyKHBvcytjYXJyZXRDaGFyLmxlbmd0aClcbiAgICAgIHJldHVybiBbcG9zLHR4dF1cbiAgICAgIFxuICBAZ2V0Q2FycmV0UG9zOiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIrY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHR4dCA9IHR4dC5yZXBsYWNlKHJlUXVvdGVkLCAnICcpICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIHJlUXVvdGVkIGNhcnJldENoYXIrY2FycmV0Q2hhclxuICAgIGlmIChpID0gdHh0LmluZGV4T2YoY2FycmV0Q2hhcikpID4gLTFcbiAgICAgIHJldHVybiBpIiwiXG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL1Bvcyc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBQYWlyTWF0Y2ggfSBmcm9tICcuL1BhaXJNYXRjaCc7XG5cbmV4cG9ydCBjbGFzcyBQYWlyXG4gIGNvbnN0cnVjdG9yOiAoQG9wZW5lcixAY2xvc2VyLEBvcHRpb25zID0ge30pIC0+XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBvcHRpb25uYWxfZW5kOiBmYWxzZVxuICAgICAgdmFsaWRNYXRjaDogbnVsbFxuICAgIH1cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBAb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBAb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICBvcGVuZXJSZWc6IC0+XG4gICAgaWYgdHlwZW9mIEBvcGVuZXIgPT0gJ3N0cmluZycgXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBvcGVuZXIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAb3BlbmVyXG4gIGNsb3NlclJlZzogLT5cbiAgICBpZiB0eXBlb2YgQGNsb3NlciA9PSAnc3RyaW5nJyBcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNsb3NlcikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBjbG9zZXJcbiAgbWF0Y2hBbnlQYXJ0czogLT5cbiAgICByZXR1cm4ge1xuICAgICAgb3BlbmVyOiBAb3BlbmVyUmVnKClcbiAgICAgIGNsb3NlcjogQGNsb3NlclJlZygpXG4gICAgfVxuICBtYXRjaEFueVBhcnRLZXlzOiAtPlxuICAgIGtleXMgPSBbXVxuICAgIGZvciBrZXksIHJlZyBvZiBAbWF0Y2hBbnlQYXJ0cygpXG4gICAgICBrZXlzLnB1c2goa2V5KVxuICAgIHJldHVybiBrZXlzXG4gIG1hdGNoQW55UmVnOiAtPlxuICAgIGdyb3VwcyA9IFtdXG4gICAgZm9yIGtleSwgcmVnIG9mIEBtYXRjaEFueVBhcnRzKClcbiAgICAgIGdyb3Vwcy5wdXNoKCcoJytyZWcuc291cmNlKycpJykgICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIHJlZy5zb3VyY2UgcmVnLnBhdHRlcm5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChncm91cHMuam9pbignfCcpKVxuICBtYXRjaEFueTogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgd2hpbGUgKG1hdGNoID0gQF9tYXRjaEFueSh0ZXh0LG9mZnNldCkpPyBhbmQgIW1hdGNoLnZhbGlkKClcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpXG4gICAgcmV0dXJuIG1hdGNoIGlmIG1hdGNoPyBhbmQgbWF0Y2gudmFsaWQoKVxuICBfbWF0Y2hBbnk6ICh0ZXh0LG9mZnNldD0wKSAtPlxuICAgIGlmIG9mZnNldFxuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKG9mZnNldClcbiAgICBtYXRjaCA9IEBtYXRjaEFueVJlZygpLmV4ZWModGV4dClcbiAgICBpZiBtYXRjaD9cbiAgICAgIHJldHVybiBuZXcgUGFpck1hdGNoKHRoaXMsbWF0Y2gsb2Zmc2V0KVxuICBtYXRjaEFueU5hbWVkOiAodGV4dCkgLT5cbiAgICByZXR1cm4gQF9tYXRjaEFueUdldE5hbWUoQG1hdGNoQW55KHRleHQpKVxuICBtYXRjaEFueUxhc3Q6ICh0ZXh0LG9mZnNldD0wKSAtPlxuICAgIHdoaWxlIG1hdGNoID0gQG1hdGNoQW55KHRleHQsb2Zmc2V0KVxuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKClcbiAgICAgIGlmICFyZXMgb3IgcmVzLmVuZCgpICE9IG1hdGNoLmVuZCgpXG4gICAgICAgIHJlcyA9IG1hdGNoXG4gICAgcmV0dXJuIHJlc1xuICBpZGVudGljYWw6IC0+XG4gICAgQG9wZW5lciA9PSBAY2xvc2VyIG9yIChcbiAgICAgIEBvcGVuZXIuc291cmNlPyBhbmQgXG4gICAgICBAY2xvc2VyLnNvdXJjZT8gYW5kIFxuICAgICAgQG9wZW5lci5zb3VyY2UgPT0gQGNsb3Nlci5zb3VyY2VcbiAgICApXG4gIHdyYXBwZXJQb3M6IChwb3MsdGV4dCkgLT5cbiAgICBzdGFydCA9IEBtYXRjaEFueUxhc3QodGV4dC5zdWJzdHIoMCxwb3Muc3RhcnQpKVxuICAgIGlmIHN0YXJ0PyBhbmQgKEBpZGVudGljYWwoKSBvciBzdGFydC5uYW1lKCkgPT0gJ29wZW5lcicpXG4gICAgICBlbmQgPSBAbWF0Y2hBbnkodGV4dCxwb3MuZW5kKVxuICAgICAgaWYgZW5kPyBhbmQgKEBpZGVudGljYWwoKSBvciBlbmQubmFtZSgpID09ICdjbG9zZXInKVxuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLGVuZC5lbmQoKSlcbiAgICAgIGVsc2UgaWYgQG9wdGlvbm5hbF9lbmRcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSx0ZXh0Lmxlbmd0aClcbiAgaXNXYXBwZXJPZjogKHBvcyx0ZXh0KSAtPlxuICAgIHJldHVybiBAd3JhcHBlclBvcyhwb3MsdGV4dCk/IiwiZXhwb3J0IGNsYXNzIFBhaXJNYXRjaFxuICBjb25zdHJ1Y3RvcjogKEBwYWlyLEBtYXRjaCxAb2Zmc2V0ID0gMCkgLT5cbiAgbmFtZTogLT5cbiAgICBpZiBAbWF0Y2hcbiAgICAgIHVubGVzcyBfbmFtZT9cbiAgICAgICAgZm9yIGdyb3VwLCBpIGluIEBtYXRjaFxuICAgICAgICAgIGlmIGkgPiAwIGFuZCBncm91cD9cbiAgICAgICAgICAgIF9uYW1lID0gQHBhaXIubWF0Y2hBbnlQYXJ0S2V5cygpW2ktMV1cbiAgICAgICAgICAgIHJldHVybiBfbmFtZVxuICAgICAgICBfbmFtZSA9IGZhbHNlXG4gICAgICByZXR1cm4gX25hbWUgfHwgbnVsbFxuICBzdGFydDogLT5cbiAgICBAbWF0Y2guaW5kZXggKyBAb2Zmc2V0XG4gIGVuZDogLT5cbiAgICBAbWF0Y2guaW5kZXggKyBAbWF0Y2hbMF0ubGVuZ3RoICsgQG9mZnNldFxuICB2YWxpZDogLT5cbiAgICByZXR1cm4gIUBwYWlyLnZhbGlkTWF0Y2ggfHwgQHBhaXIudmFsaWRNYXRjaCh0aGlzKVxuICBsZW5ndGg6IC0+XG4gICAgQG1hdGNoWzBdLmxlbmd0aCIsImV4cG9ydCBjbGFzcyBQb3NcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsQGVuZCkgLT5cbiAgICBAZW5kID0gQHN0YXJ0IHVubGVzcyBAZW5kP1xuICBjb250YWluc1B0OiAocHQpIC0+XG4gICAgcmV0dXJuIEBzdGFydCA8PSBwdCBhbmQgcHQgPD0gQGVuZFxuICBjb250YWluc1BvczogKHBvcykgLT5cbiAgICByZXR1cm4gQHN0YXJ0IDw9IHBvcy5zdGFydCBhbmQgcG9zLmVuZCA8PSBAZW5kXG4gIHdyYXBwZWRCeTogKHByZWZpeCxzdWZmaXgpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3Mud3JhcENsYXNzKEBzdGFydC1wcmVmaXgubGVuZ3RoLEBzdGFydCxAZW5kLEBlbmQrc3VmZml4Lmxlbmd0aClcbiAgd2l0aEVkaXRvcjogKHZhbCktPlxuICAgIEBfZWRpdG9yID0gdmFsXG4gICAgcmV0dXJuIHRoaXNcbiAgZWRpdG9yOiAtPlxuICAgIHVubGVzcyBAX2VkaXRvcj9cbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZWRpdG9yIHNldCcpXG4gICAgcmV0dXJuIEBfZWRpdG9yXG4gIGhhc0VkaXRvcjogLT5cbiAgICByZXR1cm4gQF9lZGl0b3I/XG4gIHRleHQ6IC0+XG4gICAgQGVkaXRvcigpLnRleHRTdWJzdHIoQHN0YXJ0LCBAZW5kKVxuICBhcHBseU9mZnNldDogKG9mZnNldCktPlxuICAgIGlmIG9mZnNldCAhPSAwXG4gICAgICBAc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBAZW5kICs9IG9mZnNldFxuICAgIHJldHVybiB0aGlzXG4gIHByZXZFT0w6IC0+XG4gICAgdW5sZXNzIEBfcHJldkVPTD9cbiAgICAgIEBfcHJldkVPTCA9IEBlZGl0b3IoKS5maW5kTGluZVN0YXJ0KEBzdGFydClcbiAgICByZXR1cm4gQF9wcmV2RU9MXG4gIG5leHRFT0w6IC0+XG4gICAgdW5sZXNzIEBfbmV4dEVPTD9cbiAgICAgIEBfbmV4dEVPTCA9IEBlZGl0b3IoKS5maW5kTGluZUVuZChAZW5kKVxuICAgIHJldHVybiBAX25leHRFT0xcbiAgdGV4dFdpdGhGdWxsTGluZXM6IC0+XG4gICAgdW5sZXNzIEBfdGV4dFdpdGhGdWxsTGluZXM/XG4gICAgICBAX3RleHRXaXRoRnVsbExpbmVzID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQHByZXZFT0woKSxAbmV4dEVPTCgpKVxuICAgIHJldHVybiBAX3RleHRXaXRoRnVsbExpbmVzXG4gIHNhbWVMaW5lc1ByZWZpeDogLT5cbiAgICB1bmxlc3MgQF9zYW1lTGluZXNQcmVmaXg/XG4gICAgICBAX3NhbWVMaW5lc1ByZWZpeCA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBwcmV2RU9MKCksQHN0YXJ0KVxuICAgIHJldHVybiBAX3NhbWVMaW5lc1ByZWZpeFxuICBzYW1lTGluZXNTdWZmaXg6IC0+XG4gICAgdW5sZXNzIEBfc2FtZUxpbmVzU3VmZml4P1xuICAgICAgQF9zYW1lTGluZXNTdWZmaXggPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAZW5kLEBuZXh0RU9MKCkpXG4gICAgcmV0dXJuIEBfc2FtZUxpbmVzU3VmZml4XG4gIGNvcHk6IC0+XG4gICAgcmVzID0gbmV3IFBvcyhAc3RhcnQsQGVuZClcbiAgICBpZiBAaGFzRWRpdG9yKClcbiAgICAgIHJlcy53aXRoRWRpdG9yKEBlZGl0b3IoKSlcbiAgICByZXR1cm4gcmVzXG4gIHJhdzogLT5cbiAgICBbQHN0YXJ0LEBlbmRdIiwiaW1wb3J0IHsgV3JhcHBpbmcgfSBmcm9tICcuL1dyYXBwaW5nJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBDb21tb25IZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBQb3NDb2xsZWN0aW9uXG4gIGNvbnN0cnVjdG9yOiAoYXJyKSAtPlxuICAgIGlmICFBcnJheS5pc0FycmF5KGFycilcbiAgICAgIGFyciA9IFthcnJdXG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFycixbUG9zQ29sbGVjdGlvbl0pXG4gICAgcmV0dXJuIGFyclxuICAgIFxuICB3cmFwOiAocHJlZml4LHN1ZmZpeCktPlxuICAgICAgcmV0dXJuIEBtYXAoIChwKSAtPiBuZXcgV3JhcHBpbmcocC5zdGFydCwgcC5lbmQsIHByZWZpeCwgc3VmZml4KSlcbiAgcmVwbGFjZTogKHR4dCktPlxuICAgICAgcmV0dXJuIEBtYXAoIChwKSAtPiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dCkpIiwiaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuaW1wb3J0IHsgQ29tbW9uSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuaW1wb3J0IHsgT3B0aW9uT2JqZWN0IH0gZnJvbSAnLi4vT3B0aW9uT2JqZWN0JztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuZXhwb3J0IGNsYXNzIFJlcGxhY2VtZW50IGV4dGVuZHMgUG9zXG4gIENvbW1vbkhlbHBlci5hcHBseU1peGlucyh0aGlzLnByb3RvdHlwZSxbT3B0aW9uT2JqZWN0XSlcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsIEBlbmQsIEB0ZXh0LCBAb3B0aW9ucyA9IHt9KSAtPlxuICAgIHN1cGVyKClcbiAgICBAc2V0T3B0cyhAb3B0aW9ucyx7XG4gICAgICBwcmVmaXg6ICcnXG4gICAgICBzdWZmaXg6ICcnXG4gICAgICBzZWxlY3Rpb25zOiBbXVxuICAgIH0pXG4gIHJlc1Bvc0JlZm9yZVByZWZpeDogLT5cbiAgICByZXR1cm4gQHN0YXJ0K0BwcmVmaXgubGVuZ3RoK0B0ZXh0Lmxlbmd0aFxuICByZXNFbmQ6IC0+IFxuICAgIHJldHVybiBAc3RhcnQrQGZpbmFsVGV4dCgpLmxlbmd0aFxuICBhcHBseTogLT5cbiAgICBAZWRpdG9yKCkuc3BsaWNlVGV4dChAc3RhcnQsIEBlbmQsIEBmaW5hbFRleHQoKSlcbiAgbmVjZXNzYXJ5OiAtPlxuICAgIHJldHVybiBAZmluYWxUZXh0KCkgIT0gQG9yaWdpbmFsVGV4dCgpXG4gIG9yaWdpbmFsVGV4dDogLT5cbiAgICByZXR1cm4gQGVkaXRvcigpLnRleHRTdWJzdHIoQHN0YXJ0LCBAZW5kKVxuICBmaW5hbFRleHQ6IC0+XG4gICAgcmV0dXJuIEBwcmVmaXgrQHRleHQrQHN1ZmZpeFxuICBvZmZzZXRBZnRlcjogKCkgLT4gXG4gICAgcmV0dXJuIEBmaW5hbFRleHQoKS5sZW5ndGggLSAoQGVuZCAtIEBzdGFydClcbiAgYXBwbHlPZmZzZXQ6IChvZmZzZXQpLT5cbiAgICBpZiBvZmZzZXQgIT0gMFxuICAgICAgQHN0YXJ0ICs9IG9mZnNldFxuICAgICAgQGVuZCArPSBvZmZzZXRcbiAgICAgIGZvciBzZWwgaW4gQHNlbGVjdGlvbnNcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgICBzZWwuZW5kICs9IG9mZnNldFxuICAgIHJldHVybiB0aGlzXG4gIHNlbGVjdENvbnRlbnQ6IC0+IFxuICAgIEBzZWxlY3Rpb25zID0gW25ldyBQb3MoQHByZWZpeC5sZW5ndGgrQHN0YXJ0LCBAcHJlZml4Lmxlbmd0aCtAc3RhcnQrQHRleHQubGVuZ3RoKV1cbiAgICByZXR1cm4gdGhpc1xuICBjYXJyZXRUb1NlbDogLT5cbiAgICBAc2VsZWN0aW9ucyA9IFtdXG4gICAgdGV4dCA9IEBmaW5hbFRleHQoKVxuICAgIEBwcmVmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KEBwcmVmaXgpXG4gICAgQHRleHQgPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KEB0ZXh0KVxuICAgIEBzdWZmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KEBzdWZmaXgpXG4gICAgc3RhcnQgPSBAc3RhcnRcbiAgICBcbiAgICB3aGlsZSAocmVzID0gU3RyaW5nSGVscGVyLmdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHRleHQpKT9cbiAgICAgIFtwb3MsdGV4dF0gPSByZXNcbiAgICAgIEBzZWxlY3Rpb25zLnB1c2gobmV3IFBvcyhzdGFydCtwb3MsIHN0YXJ0K3BvcykpXG4gICAgICBcbiAgICByZXR1cm4gdGhpc1xuICBjb3B5OiAtPiBcbiAgICByZXMgPSBuZXcgUmVwbGFjZW1lbnQoQHN0YXJ0LCBAZW5kLCBAdGV4dCwgQGdldE9wdHMoKSlcbiAgICBpZiBAaGFzRWRpdG9yKClcbiAgICAgIHJlcy53aXRoRWRpdG9yKEBlZGl0b3IoKSlcbiAgICByZXMuc2VsZWN0aW9ucyA9IEBzZWxlY3Rpb25zLm1hcCggKHMpLT5zLmNvcHkoKSApXG4gICAgcmV0dXJuIHJlcyIsImV4cG9ydCBjbGFzcyBTaXplXG4gIGNvbnN0cnVjdG9yOiAoQHdpZHRoLEBoZWlnaHQpIC0+IiwiZXhwb3J0IGNsYXNzIFN0clBvc1xuICBjb25zdHJ1Y3RvcjogKEBwb3MsQHN0cikgLT5cbiAgZW5kOiAtPlxuICAgIEBwb3MgKyBAc3RyLmxlbmd0aCIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcblxuZXhwb3J0IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3NcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIC0+XG4gICAgc3VwZXIoKVxuICBpbm5lckNvbnRhaW5zUHQ6IChwdCkgLT5cbiAgICByZXR1cm4gQGlubmVyU3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBpbm5lckVuZFxuICBpbm5lckNvbnRhaW5zUG9zOiAocG9zKSAtPlxuICAgIHJldHVybiBAaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGlubmVyRW5kXG4gIGlubmVyVGV4dDogLT5cbiAgICBAZWRpdG9yKCkudGV4dFN1YnN0cihAaW5uZXJTdGFydCwgQGlubmVyRW5kKVxuICBzZXRJbm5lckxlbjogKGxlbikgLT5cbiAgICBAbW92ZVN1Zml4KEBpbm5lclN0YXJ0ICsgbGVuKVxuICBtb3ZlU3VmZml4OiAocHQpIC0+XG4gICAgc3VmZml4TGVuID0gQGVuZCAtIEBpbm5lckVuZFxuICAgIEBpbm5lckVuZCA9IHB0XG4gICAgQGVuZCA9IEBpbm5lckVuZCArIHN1ZmZpeExlblxuICBjb3B5OiAtPlxuICAgIHJldHVybiBuZXcgV3JhcHBlZFBvcyhAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIiwiaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIFdyYXBwaW5nIGV4dGVuZHMgUmVwbGFjZW1lbnRcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsIEBlbmQsIHByZWZpeCA9JycsIHN1ZmZpeCA9ICcnLCBAb3B0aW9ucyA9IHt9KSAtPlxuICAgIHN1cGVyKClcbiAgICBAc2V0T3B0cyhAb3B0aW9ucylcbiAgICBAdGV4dCA9ICcnXG4gICAgQHByZWZpeCA9IHByZWZpeFxuICAgIEBzdWZmaXggPSBzdWZmaXhcbiAgYXBwbHk6IC0+XG4gICAgQGFkanVzdFNlbCgpXG4gICAgc3VwZXIoKVxuICBhZGp1c3RTZWw6IC0+XG4gICAgb2Zmc2V0ID0gQG9yaWdpbmFsVGV4dCgpLmxlbmd0aFxuICAgIGZvciBzZWwgaW4gQHNlbGVjdGlvbnNcbiAgICAgIGlmIHNlbC5zdGFydCA+IEBzdGFydCtAcHJlZml4Lmxlbmd0aFxuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBpZiBzZWwuZW5kID49IEBzdGFydCtAcHJlZml4Lmxlbmd0aFxuICAgICAgICBzZWwuZW5kICs9IG9mZnNldFxuICBmaW5hbFRleHQ6IC0+XG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICB0ZXh0ID0gQG9yaWdpbmFsVGV4dCgpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9ICcnXG4gICAgcmV0dXJuIEBwcmVmaXgrdGV4dCtAc3VmZml4XG4gIG9mZnNldEFmdGVyOiAoKSAtPiBcbiAgICByZXR1cm4gQHByZWZpeC5sZW5ndGgrQHN1ZmZpeC5sZW5ndGhcbiAgICAgICAgICBcbiAgY29weTogLT4gXG4gICAgcmVzID0gbmV3IFdyYXBwaW5nKEBzdGFydCwgQGVuZCwgQHByZWZpeCwgQHN1ZmZpeClcbiAgICByZXMuc2VsZWN0aW9ucyA9IEBzZWxlY3Rpb25zLm1hcCggKHMpLT5zLmNvcHkoKSApXG4gICAgcmV0dXJuIHJlcyJdfQ==
