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

},{"./helpers/ArrayHelper":23,"./helpers/StringHelper":26,"./positioning/Pair":27}],2:[function(require,module,exports){
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

},{"./positioning/Pos":29,"./positioning/PosCollection":30,"./positioning/Replacement":31}],3:[function(require,module,exports){
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

},{"./Command":6,"./Context":7,"./helpers/NamespaceHelper":25}],4:[function(require,module,exports){
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

},{"./Codewave":5,"./Context":7,"./TextParser":17,"./helpers/StringHelper":26}],5:[function(require,module,exports){
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

},{"./ClosingPromp":2,"./Command":6,"./Context":7,"./Logger":11,"./PositionedCmdInstance":13,"./Process":14,"./TextParser":17,"./helpers/StringHelper":26,"./positioning/PosCollection":30}],6:[function(require,module,exports){
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

},{"./Context":7,"./Storage":15,"./helpers/NamespaceHelper":25}],7:[function(require,module,exports){
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

},{"./CmdFinder":3,"./CmdInstance":4,"./helpers/ArrayHelper":23}],8:[function(require,module,exports){
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

},{"./positioning/Pair":27}],9:[function(require,module,exports){
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

},{"./positioning/Pos":29,"./positioning/StrPos":33}],11:[function(require,module,exports){
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

},{"./BoxHelper":1,"./CmdInstance":4,"./Command":6,"./helpers/NamespaceHelper":25,"./helpers/StringHelper":26,"./positioning/Pos":29,"./positioning/Replacement":31,"./positioning/StrPos":33}],14:[function(require,module,exports){
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

},{"./TextParser":17,"./positioning/Pos":29}],17:[function(require,module,exports){
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

var _JsCommandProvider = require("./cmds/JsCommandProvider");

var _PhpCommandProvider = require("./cmds/PhpCommandProvider");

var _Pos = require("./positioning/Pos");

var _WrappedPos = require("./positioning/WrappedPos");

_Pos.Pos.wrapClass = _WrappedPos.WrappedPos;
_Codewave.Codewave.instances = [];
_Command.Command.providers = [new _CoreCommandProvider.CoreCommandProvider(), new _JsCommandProvider.JsCommandProvider(), new _PhpCommandProvider.PhpCommandProvider()];

},{"./Codewave":5,"./Command":6,"./cmds/CoreCommandProvider":19,"./cmds/JsCommandProvider":20,"./cmds/PhpCommandProvider":21,"./positioning/Pos":29,"./positioning/WrappedPos":34}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreCommandProvider = void 0;

var _Command = require("../Command");

var _Detector = require("../Detector");

var _BoxHelper = require("../BoxHelper");

var _Storage = require("../Storage");

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
  storage = new _Storage.Storage();
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
    storage = new _Storage.Storage();
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

},{"../BoxHelper":1,"../Command":6,"../Detector":8,"../EditCmdProp":9,"../Storage":15,"../helpers/StringHelper":26,"../positioning/Replacement":31}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsCommandProvider = void 0;

var _Command = require("../Command");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{"../Command":6}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhpCommandProvider = void 0;

var _StringHelper = require("../helpers/StringHelper");

var _Command = require("../Command");

var _Detector = require("../Detector");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{"../Command":6,"../Detector":8,"../helpers/StringHelper":26}],22:[function(require,module,exports){
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

},{"./TextAreaEditor":16,"./bootstrap":18}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{"../positioning/Size":32}],27:[function(require,module,exports){
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

},{"../helpers/StringHelper":26,"./PairMatch":28,"./Pos":29}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{"../helpers/CommonHelper":24,"./Replacement":31,"./Wrapping":35}],31:[function(require,module,exports){
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

},{"../OptionObject":12,"../helpers/CommonHelper":24,"../helpers/StringHelper":26,"./Pos":29}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{"./Pos":29}],35:[function(require,module,exports){
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

},{"./Replacement":31}]},{},[22])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmNvZmZlZSIsImxpYi9DbG9zaW5nUHJvbXAuY29mZmVlIiwibGliL0NtZEZpbmRlci5jb2ZmZWUiLCJsaWIvQ21kSW5zdGFuY2UuY29mZmVlIiwibGliL0NvZGV3YXZlLmNvZmZlZSIsImxpYi9Db21tYW5kLmNvZmZlZSIsImxpYi9Db250ZXh0LmNvZmZlZSIsImxpYi9EZXRlY3Rvci5jb2ZmZWUiLCJsaWIvRWRpdENtZFByb3AuY29mZmVlIiwibGliL0VkaXRvci5jb2ZmZWUiLCJsaWIvTG9nZ2VyLmNvZmZlZSIsImxpYi9PcHRpb25PYmplY3QuY29mZmVlIiwibGliL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5jb2ZmZWUiLCJsaWIvUHJvY2Vzcy5jb2ZmZWUiLCJsaWIvU3RvcmFnZS5jb2ZmZWUiLCJsaWIvVGV4dEFyZWFFZGl0b3IuY29mZmVlIiwibGliL1RleHRQYXJzZXIuY29mZmVlIiwibGliL2Jvb3RzdHJhcC5jb2ZmZWUiLCJsaWIvY21kcy9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwibGliL2NtZHMvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCJsaWIvY21kcy9jbWRzL1BocENvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCJsaWIvZW50cnkuY29mZmVlIiwibGliL2hlbHBlcnMvaGVscGVycy9BcnJheUhlbHBlci5jb2ZmZWUiLCJsaWIvaGVscGVycy9oZWxwZXJzL0NvbW1vbkhlbHBlci5jb2ZmZWUiLCJsaWIvaGVscGVycy9oZWxwZXJzL05hbWVzcGFjZUhlbHBlci5jb2ZmZWUiLCJsaWIvaGVscGVycy9oZWxwZXJzL1N0cmluZ0hlbHBlci5jb2ZmZWUiLCJsaWIvcG9zaXRpb25pbmcvcG9zaXRpb25pbmcvUGFpci5jb2ZmZWUiLCJsaWIvcG9zaXRpb25pbmcvcG9zaXRpb25pbmcvUGFpck1hdGNoLmNvZmZlZSIsImxpYi9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy9Qb3MuY29mZmVlIiwibGliL3Bvc2l0aW9uaW5nL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uY29mZmVlIiwibGliL3Bvc2l0aW9uaW5nL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmNvZmZlZSIsImxpYi9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy9TaXplLmNvZmZlZSIsImxpYi9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy9TdHJQb3MuY29mZmVlIiwibGliL3Bvc2l0aW9uaW5nL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuY29mZmVlIiwibGliL3Bvc2l0aW9uaW5nL3Bvc2l0aW9uaW5nL1dyYXBwaW5nLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNHQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFhLFNBQU47QUFBQTtBQUFBO0FBQ0wscUJBQWEsT0FBYixFQUFhO0FBQUEsUUFBVyxPQUFYLHVFQUFBLEVBQUE7O0FBQUE7O0FBQ1gsUUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFEWSxTQUFDLE9BQUQsR0FBQyxPQUFEO0FBQ1osU0FBQSxRQUFBLEdBQVk7QUFDVixNQUFBLElBQUEsRUFBTSxLQUFDLE9BQUQsQ0FBUyxRQUFULENBREksSUFBQTtBQUVWLE1BQUEsR0FBQSxFQUZVLENBQUE7QUFHVixNQUFBLEtBQUEsRUFIVSxFQUFBO0FBSVYsTUFBQSxNQUFBLEVBSlUsQ0FBQTtBQUtWLE1BQUEsUUFBQSxFQUxVLEVBQUE7QUFNVixNQUFBLFNBQUEsRUFOVSxFQUFBO0FBT1YsTUFBQSxNQUFBLEVBUFUsRUFBQTtBQVFWLE1BQUEsTUFBQSxFQVJVLEVBQUE7QUFTVixNQUFBLE1BQUEsRUFBUTtBQVRFLEtBQVo7QUFXQSxJQUFBLEdBQUEsR0FBQSxLQUFBLFFBQUE7O0FBQUEsU0FBQSxHQUFBLElBQUEsR0FBQSxFQUFBOzs7QUFDRSxVQUFHLEdBQUEsSUFBSCxPQUFBLEVBQUE7QUFDRSxhQUFBLEdBQUEsSUFBWSxPQUFRLENBRHRCLEdBQ3NCLENBQXBCO0FBREYsT0FBQSxNQUFBO0FBR0UsYUFBQSxHQUFBLElBSEYsR0FHRTs7QUFKSjtBQVpXOztBQURSO0FBQUE7QUFBQSwwQkFrQkUsSUFsQkYsRUFrQkU7QUFDTCxVQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxFQUFOO0FBQ0EsTUFBQSxHQUFBLEdBQUEsS0FBQSxRQUFBOztBQUFBLFdBQUEsR0FBQSxJQUFBLEdBQUEsRUFBQTs7QUFDRSxRQUFBLEdBQUksQ0FBSixHQUFJLENBQUosR0FBVyxLQUFLLEdBQUwsQ0FBWDtBQURGOztBQUVBLGFBQU8sSUFBQSxTQUFBLENBQWMsS0FBZCxPQUFBLEVBQUEsR0FBQSxDQUFQO0FBSks7QUFsQkY7QUFBQTtBQUFBLHlCQXVCQyxJQXZCRCxFQXVCQztBQUNKLGFBQU8sS0FBQSxRQUFBLEtBQUEsSUFBQSxHQUFxQixLQUFBLEtBQUEsQ0FBckIsSUFBcUIsQ0FBckIsR0FBQSxJQUFBLEdBQTBDLEtBQUEsTUFBQSxFQUFqRDtBQURJO0FBdkJEO0FBQUE7QUFBQSxnQ0F5QlEsR0F6QlIsRUF5QlE7QUFDWCxhQUFPLEtBQUMsT0FBRCxDQUFBLFdBQUEsQ0FBQSxHQUFBLENBQVA7QUFEVztBQXpCUjtBQUFBO0FBQUEsZ0NBMkJNO0FBQ1QsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sS0FBQSxLQUFBLEdBQVMsSUFBSSxLQUFiLEdBQUEsR0FBb0IsSUFBSSxLQUFDLElBQUQsQ0FBTSxNQUFwQztBQUNBLGFBQU8sS0FBQSxXQUFBLENBQWEsS0FBQSxRQUFBLENBQWIsR0FBYSxDQUFiLENBQVA7QUFGUztBQTNCTjtBQUFBO0FBQUEsK0JBOEJLO0FBQ1IsVUFBQSxFQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssS0FBQSxLQUFBLEdBQVMsSUFBSSxLQUFiLEdBQUEsR0FBb0IsSUFBSSxLQUFDLElBQUQsQ0FBeEIsTUFBQSxHQUF1QyxLQUFDLFFBQUQsQ0FBVSxNQUF0RDtBQUNBLGFBQU8sS0FBQSxNQUFBLEdBQVUsS0FBQSxXQUFBLENBQWEsS0FBQSxRQUFBLEdBQVUsS0FBQSxRQUFBLENBQXZCLEVBQXVCLENBQXZCLENBQWpCO0FBRlE7QUE5Qkw7QUFBQTtBQUFBLDZCQWlDRztBQUNOLFVBQUEsRUFBQTtBQUFBLE1BQUEsRUFBQSxHQUFLLEtBQUEsS0FBQSxHQUFTLElBQUksS0FBYixHQUFBLEdBQW9CLElBQUksS0FBQyxJQUFELENBQXhCLE1BQUEsR0FBdUMsS0FBQyxTQUFELENBQVcsTUFBdkQ7QUFDQSxhQUFPLEtBQUEsV0FBQSxDQUFhLEtBQUEsU0FBQSxHQUFXLEtBQUEsUUFBQSxDQUF4QixFQUF3QixDQUF4QixJQUF5QyxLQUFDLE1BQWpEO0FBRk07QUFqQ0g7QUFBQTtBQUFBLDZCQW9DSyxHQXBDTCxFQW9DSztBQUNSLGFBQU8sMkJBQUEsY0FBQSxDQUE0QixLQUE1QixJQUFBLEVBQUEsR0FBQSxDQUFQO0FBRFE7QUFwQ0w7QUFBQTtBQUFBLDhCQXNDSTtBQUNQLGFBQU8sMkJBQUEsY0FBQSxDQUFBLEdBQUEsRUFBaUMsS0FBakMsR0FBQSxDQUFQO0FBRE87QUF0Q0o7QUFBQTtBQUFBLDRCQXdDRTtBQUFBLFVBQUMsSUFBRCx1RUFBQSxFQUFBO0FBQUEsVUFBWSxVQUFaLHVFQUFBLElBQUE7QUFDTCxVQUFBLENBQUEsRUFBQSxLQUFBLEVBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUEsSUFBUSxFQUFmO0FBQ0EsTUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFKLE9BQUEsQ0FBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsQ0FBQSxJQUFBLENBQVI7O0FBQ0EsVUFBQSxVQUFBLEVBQUE7QUFDRSxlQUFPLFlBQUE7O0FBQXVCLFVBQUEsT0FBQSxHQUFBLEVBQUE7O0FBQUEsZUFBUyxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsS0FBQSxNQUFULEVBQVMsS0FBQSxHQUFBLEdBQUEsQ0FBQSxJQUFBLEdBQUEsR0FBQSxDQUFBLElBQUEsR0FBVCxFQUFTLENBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFULENBQUEsRUFBQTt5QkFBdEIsS0FBQSxJQUFBLENBQU0sS0FBTSxDQUFOLENBQU0sQ0FBTixJQUFOLEVBQUEsQztBQUFzQjs7O1NBQXZCLEMsSUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEVCxJQUNTLENBQVA7QUFERixPQUFBLE1BQUE7QUFHRSxlQUFPLFlBQUE7O0FBQVUsVUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxlQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsSUFBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7eUJBQVQsS0FBQSxJQUFBLENBQUEsQ0FBQSxDO0FBQVM7OztTQUFWLEMsSUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIVCxJQUdTLENBQVA7O0FBTkc7QUF4Q0Y7QUFBQTtBQUFBLDJCQStDQztBQUFBLFVBQUMsSUFBRCx1RUFBQSxFQUFBO0FBQ0osYUFBUSwyQkFBQSxjQUFBLENBQUEsR0FBQSxFQUFnQyxLQUFoQyxNQUFBLElBQ04sS0FBQSxXQUFBLENBQ0UsS0FBQSxJQUFBLEdBQ0EsS0FEQSxPQUNBLEVBREEsR0FBQSxJQUFBLEdBR0EsMkJBQUEsY0FBQSxDQUFBLEdBQUEsRUFBaUMsS0FBQSxLQUFBLEdBQVMsS0FBQSxvQkFBQSxDQUFBLElBQUEsRUFIMUMsTUFHQSxDQUhBLEdBSUEsS0FKQSxPQUlBLEVBSkEsR0FLQSxLQU5GLElBQUEsQ0FERjtBQURJO0FBL0NEO0FBQUE7QUFBQSwyQkF5REM7YUFDSixLQUFDLE9BQUQsQ0FBQSxlQUFBLENBQXlCLEtBQUEsSUFBQSxHQUFRLEtBQWpDLE9BQWlDLEVBQWpDLEM7QUFESTtBQXpERDtBQUFBO0FBQUEsNEJBMkRFO2FBQ0wsS0FBQyxPQUFELENBQUEsZ0JBQUEsQ0FBMEIsS0FBQSxPQUFBLEtBQWEsS0FBdkMsSUFBQSxDO0FBREs7QUEzREY7QUFBQTtBQUFBLHlDQTZEaUIsSUE3RGpCLEVBNkRpQjtBQUNwQixhQUFPLEtBQUMsT0FBRCxDQUFTLFFBQVQsQ0FBQSxhQUFBLENBQWdDLEtBQUMsT0FBRCxDQUFTLFFBQVQsQ0FBQSxZQUFBLENBQWhDLElBQWdDLENBQWhDLENBQVA7QUFEb0I7QUE3RGpCO0FBQUE7QUFBQSwrQkErRE8sSUEvRFAsRUErRE87QUFDVixhQUFPLDJCQUFBLFVBQUEsQ0FBd0IsS0FBQSxvQkFBQSxDQUF4QixJQUF3QixDQUF4QixDQUFQO0FBRFU7QUEvRFA7QUFBQTtBQUFBLGlDQWlFUyxHQWpFVCxFQWlFUztBQUFBOztBQUNaLFVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsV0FBQSxFQUFBLEdBQUEsRUFBQSxTQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsS0FBQSxZQUFBLENBQWMsR0FBRyxDQUFqQixLQUFBLENBQVI7O0FBQ0EsVUFBRyxLQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sS0FBQSxJQUFBLEVBQVA7QUFDQSxRQUFBLE9BQUEsR0FBVSwyQkFBQSxNQUFBLENBQUEsSUFBQSxFQUF5QixLQUFBLEdBQXpCLENBQUEsQ0FBVjtBQUVBLFFBQUEsS0FBQSxHQUFRLEtBQUEsS0FBQSxFQUFSO0FBQ0EsUUFBQSxXQUFBLEdBQWMsbUJBQWQ7QUFDQSxRQUFBLEtBQUssQ0FBTCxLQUFBLEdBQWMsV0FBVyxDQUFDLE1BQTFCO0FBQ0EsUUFBQSxLQUFLLENBQUwsUUFBQSxHQUFpQixLQUFLLENBQUwsU0FBQSxHQUFrQixLQUFBLElBQUEsR0FBUSxLQUFSLElBQUEsR0FBQSxXQUFBLEdBQThCLEtBQTlCLElBQUEsR0FBc0MsS0FBQyxJQUExRTtBQUVBLFFBQUEsU0FBQSxHQUFZLE1BQUEsQ0FBTywyQkFBQSxZQUFBLENBQTBCLE9BQUEsR0FBVSxLQUFLLENBQXpDLFFBQW9DLEVBQXBDLEVBQUEsT0FBQSxDQUFBLFdBQUEsRUFBUCxJQUFPLENBQVAsQ0FBWjtBQUNBLFFBQUEsT0FBQSxHQUFVLE1BQUEsQ0FBTywyQkFBQSxZQUFBLENBQTBCLE9BQUEsR0FBVSxLQUFLLENBQXpDLE1BQW9DLEVBQXBDLEVBQUEsT0FBQSxDQUFBLFdBQUEsRUFBUCxJQUFPLENBQVAsQ0FBVjtBQUVBLFFBQUEsSUFBQSxHQUFPLElBQUEsVUFBQSxDQUFBLFNBQUEsRUFBQSxPQUFBLEVBQTJCO0FBQ2hDLFVBQUEsVUFBQSxFQUFZLG9CQUFBLEtBQUEsRUFBQTtBQUVWLGdCQUFBLENBQUEsQ0FGVSxDOztBQUVWLFlBQUEsQ0FBQSxHQUFJLEtBQUMsQ0FBQSxPQUFELENBQVMsUUFBVCxDQUFBLFdBQUEsQ0FBOEIsS0FBSyxDQUFuQyxLQUE4QixFQUE5QixFQUE2QyxDQUFBLElBQUEsRUFBQSxJQUFBLEVBQTdDLElBQTZDLENBQTdDLEVBQThELENBQTlELENBQUEsQ0FBSjtBQUNBLG1CQUFRLENBQUEsSUFBRCxJQUFDLElBQU0sQ0FBQyxDQUFELEdBQUEsS0FBUyxJQUF2QjtBQUhVO0FBRG9CLFNBQTNCLENBQVA7QUFNQSxRQUFBLEdBQUEsR0FBTSxJQUFJLENBQUosVUFBQSxDQUFBLEdBQUEsRUFBb0IsS0FBQyxPQUFELENBQVMsUUFBVCxDQUFrQixNQUFsQixDQUFwQixJQUFvQixFQUFwQixDQUFOOztBQUNBLFlBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsR0FBRyxDQUFILEtBQUEsSUFBYSxPQUFPLENBQUMsTUFBckI7QUFDQSxpQkFGRixHQUVFO0FBckJKOztBQUZZO0FBakVUO0FBQUE7QUFBQSxpQ0EwRlMsS0ExRlQsRUEwRlM7QUFDWixVQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLENBQVI7QUFDQSxNQUFBLElBQUEsR0FBTyxLQUFBLElBQUEsRUFBUDs7QUFDQSxhQUFNLENBQUEsQ0FBQSxHQUFBLEtBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxXQUFBLENBQUEsS0FBQSxFQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFBLElBQUEsSUFBb0UsQ0FBQyxDQUFELEdBQUEsS0FBMUUsSUFBQSxFQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLEdBQVY7QUFDQSxRQUFBLEtBQUE7QUFGRjs7QUFHQSxhQUFPLEtBQVA7QUFOWTtBQTFGVDtBQUFBO0FBQUEsbUNBaUdXLElBakdYLEVBaUdXO0FBQUEsVUFBTSxNQUFOLHVFQUFBLElBQUE7QUFDZCxVQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsUUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUEsTUFBQSxDQUFXLFlBQVUsMkJBQUEsWUFBQSxDQUEwQixLQUFDLE9BQUQsQ0FBQSxlQUFBLENBQXlCLEtBQTdELElBQW9DLENBQTFCLENBQVYsR0FBWCxTQUFBLENBQVQ7QUFDQSxNQUFBLElBQUEsR0FBTyxJQUFBLE1BQUEsQ0FBVyxZQUFVLDJCQUFBLFlBQUEsQ0FBMEIsS0FBQyxPQUFELENBQUEsZ0JBQUEsQ0FBMEIsS0FBOUQsSUFBb0MsQ0FBMUIsQ0FBVixHQUFYLFNBQUEsQ0FBUDtBQUNBLE1BQUEsUUFBQSxHQUFXLE1BQU0sQ0FBTixJQUFBLENBQUEsSUFBQSxDQUFYO0FBQ0EsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFKLElBQUEsQ0FBQSxJQUFBLENBQVQ7O0FBQ0EsVUFBRyxRQUFBLElBQUEsSUFBQSxJQUFjLE1BQUEsSUFBakIsSUFBQSxFQUFBO0FBQ0UsWUFBQSxNQUFBLEVBQUE7QUFDRSxlQUFBLEdBQUEsR0FBTyxJQUFJLENBQUosR0FBQSxDQUFTLFFBQVMsQ0FBQSxDQUFBLENBQVQsQ0FBVCxNQUFBLEVBQTRCLE1BQU8sQ0FBQSxDQUFBLENBQVAsQ0FEckMsTUFDUyxDQUFQOzs7QUFDRixhQUFBLE1BQUEsR0FBVSxRQUFTLENBQUEsQ0FBQSxDQUFULENBQVksTUFBdEI7QUFDQSxRQUFBLFFBQUEsR0FBVyxRQUFRLENBQVIsS0FBQSxHQUFpQixRQUFTLENBQUEsQ0FBQSxDQUFULENBQWpCLE1BQUEsR0FBc0MsUUFBUyxDQUFBLENBQUEsQ0FBVCxDQUF0QyxNQUFBLEdBQTJELEtBSHRFLEdBR0EsQ0FKRixDQUNFOztBQUlBLFFBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBTixLQUFBLEdBQWUsTUFBTyxDQUFBLENBQUEsQ0FBUCxDQUFmLE1BQUEsR0FBa0MsS0FKM0MsR0FJQSxDQUxGLENBQ0U7O0FBS0EsYUFBQSxLQUFBLEdBQVMsTUFBQSxHQU5YLFFBTUU7OztBQUNGLGFBQU8sSUFBUDtBQVpjO0FBakdYO0FBQUE7QUFBQSxrQ0E4R1UsSUE5R1YsRUE4R1U7QUFBQSxVQUFNLE9BQU4sdUVBQUEsRUFBQTtBQUNiLGFBQU8sS0FBQSxLQUFBLENBQU8sS0FBQSxhQUFBLENBQUEsSUFBQSxFQUFQLE9BQU8sQ0FBUCxFQUFBLEtBQUEsQ0FBUDtBQURhO0FBOUdWO0FBQUE7QUFBQSxrQ0FnSFUsSUFoSFYsRUFnSFU7QUFBQSxVQUFNLE9BQU4sdUVBQUEsRUFBQTtBQUNiLFVBQUEsUUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7O0FBQUEsVUFBRyxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxRQUFBLEdBQVc7QUFDVCxVQUFBLFNBQUEsRUFBVztBQURGLFNBQVg7QUFHQSxRQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEVBQUEsRUFBQSxRQUFBLEVBQUEsT0FBQSxDQUFOO0FBQ0EsUUFBQSxHQUFBLEdBQU0sMkJBQUEsWUFBQSxDQUEwQixLQUFDLE9BQUQsQ0FBMUIsZUFBMEIsRUFBMUIsQ0FBTjtBQUNBLFFBQUEsR0FBQSxHQUFNLDJCQUFBLFlBQUEsQ0FBMEIsS0FBQyxPQUFELENBQTFCLGdCQUEwQixFQUExQixDQUFOO0FBQ0EsUUFBQSxFQUFBLEdBQUssMkJBQUEsWUFBQSxDQUEwQixLQUExQixJQUFBLENBQUw7QUFDQSxRQUFBLElBQUEsR0FBVSxPQUFRLENBQVgsV0FBVyxDQUFSLEdBQUgsSUFBRyxHQVBWLEVBT0EsQ0FSRixDQUNFOztBQVFBLFFBQUEsR0FBQSxHQUFNLElBQUEsTUFBQSxnQkFBVyxHQUFYLGdCQUFXLEVBQVgscUJBQXlDLEtBQXpDLEdBQUEsUUFSTixJQVFNLENBQU4sQ0FURixDQUNFOztBQVNBLFFBQUEsR0FBQSxHQUFNLElBQUEsTUFBQSxrQkFBVyxFQUFYLGVBQUEsR0FBQSxZQUFBLElBQUEsQ0FBTjtBQUNBLGVBQU8sSUFBSSxDQUFKLE9BQUEsQ0FBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLEVBWFQsRUFXUyxDQUFQOztBQVpXO0FBaEhWOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7O0FDUEE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBYSxZQUFOO0FBQUE7QUFBQTtBQUNMLHdCQUFhLFNBQWIsRUFBYSxVQUFiLEVBQWE7QUFBQTs7QUFBQyxTQUFDLFFBQUQsR0FBQyxTQUFEO0FBQ1osU0FBQSxPQUFBLEdBQVcsSUFBWDtBQUNBLFNBQUEsTUFBQSxHQUFVLElBQVY7QUFDQSxTQUFBLE9BQUEsR0FBVyxLQUFYO0FBQ0EsU0FBQSxTQUFBLEdBQWEsQ0FBYjtBQUNBLFNBQUEsVUFBQSxHQUFjLElBQUEsNEJBQUEsQ0FBQSxVQUFBLENBQWQ7QUFMVzs7QUFEUjtBQUFBO0FBQUEsNEJBT0U7QUFBQTs7QUFDTCxXQUFBLE9BQUEsR0FBVyxJQUFYO0FBQ0EsV0FBQSxVQUFBOztBQUNBLFVBQUcsS0FBQyxRQUFELENBQVUsTUFBVixDQUFILGlCQUFHLEVBQUgsRUFBQTtBQUNFLGFBQUEsYUFBQSxHQUFpQixZQUFBO0FBQUEsY0FBQyxFQUFELHVFQUFBLElBQUE7aUJBQVksS0FBQyxDQUFELFFBQUEsQ0FBQSxFQUFBLEM7QUFBWixTQUFqQjs7QUFDQSxhQUFDLFFBQUQsQ0FBVSxNQUFWLENBQUEsaUJBQUEsQ0FBb0MsS0FGdEMsYUFFRTs7O0FBR0YsYUFBTyxJQUFQO0FBUks7QUFQRjtBQUFBO0FBQUEsaUNBZ0JPO0FBQ1YsV0FBQSxZQUFBLEdBQWdCLEtBQUMsVUFBRCxDQUFBLElBQUEsQ0FDZCxLQUFDLFFBQUQsQ0FBQSxPQUFBLEdBQW9CLEtBQUMsUUFBRCxDQUFwQixVQUFBLEdBQTJDLEtBQUMsUUFBRCxDQUEzQyxPQUFBLEdBRGMsSUFBQSxFQUVkLE9BQU8sS0FBQyxRQUFELENBQVAsT0FBQSxHQUEyQixLQUFDLFFBQUQsQ0FBM0IsU0FBQSxHQUFpRCxLQUFDLFFBQUQsQ0FBakQsVUFBQSxHQUF3RSxLQUFDLFFBQUQsQ0FGMUQsT0FBQSxFQUFBLEdBQUEsQ0FHVCxVQUFBLENBQUEsRUFBQTtlQUFPLENBQUMsQ0FBRCxXQUFBLEU7QUFIRSxPQUFBLENBQWhCO2FBSUEsS0FBQyxRQUFELENBQVUsTUFBVixDQUFBLGlCQUFBLENBQW1DLEtBQW5DLFlBQUEsQztBQUxVO0FBaEJQO0FBQUE7QUFBQSxtQ0FzQlM7YUFDWixLQUFBLE1BQUEsR0FBVSxJO0FBREU7QUF0QlQ7QUFBQTtBQUFBLCtCQXdCSztBQUFBLFVBQUMsRUFBRCx1RUFBQSxJQUFBO0FBQ1IsV0FBQSxZQUFBOztBQUNBLFVBQUcsS0FBQSxTQUFBLENBQUgsRUFBRyxDQUFILEVBQUE7QUFBQTs7O0FBRUEsV0FBQSxTQUFBOztBQUNBLFVBQUcsS0FBSCxVQUFHLEVBQUgsRUFBQTtBQUNFLGFBQUEsSUFBQTtlQUNBLEtBRkYsVUFFRSxFO0FBRkYsT0FBQSxNQUFBO2VBSUUsS0FKRixNQUlFLEU7O0FBVE07QUF4Qkw7QUFBQTtBQUFBLDhCQW1DTSxFQW5DTixFQW1DTTtBQUNULGFBQU8sRUFBQSxJQUFBLElBQUEsSUFBUSxFQUFFLENBQUYsVUFBQSxDQUFBLENBQUEsTUFBb0IsRUFBbkM7QUFEUztBQW5DTjtBQUFBO0FBQUEsNkJBc0NHLENBQUE7QUF0Q0g7QUFBQTtBQUFBLGlDQXlDTztBQUNWLGFBQU8sS0FBQSxLQUFBLE9BQUEsS0FBQSxJQUFxQixLQUFBLEtBQUEsR0FBQSxPQUFBLENBQUEsR0FBQSxNQUF5QixDQUFDLENBQXREO0FBRFU7QUF6Q1A7QUFBQTtBQUFBLGlDQTRDTztBQUNWLFVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxZQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEsS0FBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLEVBQWY7QUFDQSxNQUFBLFVBQUEsR0FBYSxLQUFBLGFBQUEsRUFBYjs7QUFDQSxXQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLFVBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7O0FBQ0UsWUFBRyxHQUFBLEdBQU0sS0FBQSxpQkFBQSxDQUFULEdBQVMsQ0FBVCxFQUFBO0FBQ0UsVUFBQSxLQUFBLEdBREYsR0FDRTtBQURGLFNBQUEsTUFFSyxJQUFHLENBQUMsR0FBQSxHQUFNLEtBQUEsa0JBQUEsQ0FBUCxHQUFPLENBQVAsS0FBcUMsS0FBQSxJQUF4QyxJQUFBLEVBQUE7QUFDSCxVQUFBLEdBQUEsR0FBTSxHQUFHLENBQUgsVUFBQSxDQUFlLEtBQUMsUUFBRCxDQUFmLE1BQUEsRUFBQSxTQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBd0QsQ0FBeEQsQ0FBTjtBQUNBLFVBQUEsSUFBQSxHQUFPLElBQUEsd0JBQUEsQ0FBZ0IsR0FBRyxDQUFuQixVQUFBLEVBQStCLEdBQUcsQ0FBbEMsUUFBQSxFQUFBLEdBQUEsQ0FBUDtBQUNBLFVBQUEsSUFBSSxDQUFKLFVBQUEsR0FBa0IsQ0FBQSxLQUFBLENBQWxCO0FBQ0EsVUFBQSxZQUFZLENBQVosSUFBQSxDQUFBLElBQUE7QUFDQSxVQUFBLEtBQUEsR0FMRyxJQUtIOztBQVJKOzthQVNBLEtBQUMsUUFBRCxDQUFVLE1BQVYsQ0FBQSxpQkFBQSxDQUFBLFlBQUEsQztBQVpVO0FBNUNQO0FBQUE7QUFBQSxvQ0F5RFU7QUFDYixhQUFPLEtBQUMsUUFBRCxDQUFVLE1BQVYsQ0FBQSxXQUFBLEVBQVA7QUFEYTtBQXpEVjtBQUFBO0FBQUEsMkJBMkRDO0FBQ0osV0FBQSxPQUFBLEdBQVcsS0FBWDs7QUFDQSxVQUEwQixLQUFBLE9BQUEsSUFBMUIsSUFBQSxFQUFBO0FBQUEsUUFBQSxZQUFBLENBQWEsS0FBYixPQUFBLENBQUE7OztBQUNBLFVBQWlDLEtBQUMsUUFBRCxDQUFBLFlBQUEsS0FBakMsSUFBQSxFQUFBO0FBQUEsYUFBQyxRQUFELENBQUEsWUFBQSxHQUFBLElBQUE7OztBQUNBLFVBQUcsS0FBQSxhQUFBLElBQUgsSUFBQSxFQUFBO2VBQ0UsS0FBQyxRQUFELENBQVUsTUFBVixDQUFBLG9CQUFBLENBQXNDLEtBRHhDLGFBQ0UsQzs7QUFMRTtBQTNERDtBQUFBO0FBQUEsNkJBaUVHO0FBQ04sVUFBRyxLQUFBLEtBQUEsT0FBSCxLQUFBLEVBQUE7QUFDRSxhQUFBLGdCQUFBLENBQWtCLEtBRHBCLGFBQ29CLEVBQWxCOzs7YUFDRixLQUFBLElBQUEsRTtBQUhNO0FBakVIO0FBQUE7QUFBQSxxQ0FxRWEsVUFyRWIsRUFxRWE7QUFDaEIsVUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsWUFBQSxFQUFBLEdBQUEsRUFBQSxLQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsRUFBZjtBQUNBLE1BQUEsS0FBQSxHQUFRLElBQVI7O0FBQ0EsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxVQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7OztBQUNFLFlBQUcsR0FBQSxHQUFNLEtBQUEsaUJBQUEsQ0FBVCxHQUFTLENBQVQsRUFBQTtBQUNFLFVBQUEsS0FBQSxHQURGLEdBQ0U7QUFERixTQUFBLE1BRUssSUFBRyxDQUFDLEdBQUEsR0FBTSxLQUFBLGtCQUFBLENBQVAsR0FBTyxDQUFQLEtBQXFDLEtBQUEsSUFBeEMsSUFBQSxFQUFBO0FBQ0gsVUFBQSxZQUFZLENBQVosSUFBQSxDQUFrQixJQUFBLHdCQUFBLENBQWdCLEtBQUssQ0FBckIsS0FBQSxFQUE0QixHQUFHLENBQS9CLEdBQUEsRUFBb0MsS0FBQyxRQUFELENBQVUsTUFBVixDQUFBLFVBQUEsQ0FBNEIsS0FBSyxDQUFMLEdBQUEsR0FBNUIsQ0FBQSxFQUF5QyxHQUFHLENBQUgsS0FBQSxHQUE3RSxDQUFvQyxDQUFwQyxFQUFsQixhQUFrQixFQUFsQjtBQUNBLFVBQUEsS0FBQSxHQUZHLElBRUg7O0FBTEo7O2FBTUEsS0FBQyxRQUFELENBQVUsTUFBVixDQUFBLGlCQUFBLENBQUEsWUFBQSxDO0FBVGdCO0FBckViO0FBQUE7QUFBQSw0QkErRUU7QUFDTCxVQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsVUFBQTs7QUFBQSxVQUFPLEtBQUEsTUFBQSxJQUFQLElBQUEsRUFBQTtBQUNFLFFBQUEsSUFBQSxHQUFPLEtBQUMsUUFBRCxDQUFVLE1BQVYsQ0FBQSxZQUFBLEVBQVA7QUFDQSxRQUFBLFVBQUEsR0FBYSxLQUFDLFlBQUQsQ0FBYyxDQUFkLEVBQUEsS0FBQSxHQUF5QixLQUFDLFFBQUQsQ0FBVSxPQUFWLENBQWtCLE1BQXhEOztBQUNBLFlBQUcsS0FBQyxRQUFELENBQUEsY0FBQSxDQUF5QixJQUFJLENBQTdCLEtBQUEsTUFBd0MsS0FBQyxZQUFELENBQWMsQ0FBZCxFQUF4QyxLQUFBLElBQW1FLENBQUEsUUFBQSxHQUFBLEtBQUEsUUFBQSxDQUFBLGNBQUEsQ0FBQSxVQUFBLENBQUEsS0FBbkUsSUFBQSxJQUEwSCxRQUFBLElBQVksSUFBSSxDQUE3SSxHQUFBLEVBQUE7QUFDRSxlQUFBLE1BQUEsR0FBVSxLQUFDLFFBQUQsQ0FBVSxNQUFWLENBQUEsVUFBQSxDQUFBLFVBQUEsRUFEWixRQUNZLENBQVY7QUFERixTQUFBLE1BQUE7QUFHRSxlQUFBLE1BQUEsR0FIRixLQUdFO0FBTko7OztBQU9BLGFBQU8sS0FBQyxNQUFSO0FBUks7QUEvRUY7QUFBQTtBQUFBLHNDQXdGYyxHQXhGZCxFQXdGYztBQUNqQixVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUE7QUFBQSxNQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTs7QUFDRSxRQUFBLFNBQUEsR0FBWSxLQUFBLFVBQUEsQ0FBQSxDQUFBLENBQVo7QUFDQSxRQUFBLFVBQUEsR0FBYSxLQUFDLFFBQUQsQ0FBQSxPQUFBLEdBQW9CLEtBQXBCLEtBQW9CLEVBQXBCLEdBQStCLEtBQUMsUUFBRCxDQUFVLE9BQXREOztBQUNBLFlBQUcsU0FBUyxDQUFULGdCQUFBLENBQUEsR0FBQSxLQUFtQyxTQUFTLENBQVQsVUFBQSxDQUFxQixLQUFDLFFBQUQsQ0FBckIsTUFBQSxFQUFBLElBQUEsT0FBdEMsVUFBQSxFQUFBO0FBQ0UsaUJBREYsU0FDRTs7QUFKSjs7QUFLQSxhQUFPLEtBQVA7QUFOaUI7QUF4RmQ7QUFBQTtBQUFBLHVDQStGZSxHQS9GZixFQStGZTtBQUNsQixVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUE7QUFBQSxNQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTs7QUFDRSxRQUFBLFNBQUEsR0FBWSxLQUFBLFFBQUEsQ0FBQSxDQUFBLENBQVo7QUFDQSxRQUFBLFVBQUEsR0FBYSxLQUFDLFFBQUQsQ0FBQSxPQUFBLEdBQW9CLEtBQUMsUUFBRCxDQUFwQixTQUFBLEdBQTBDLEtBQTFDLEtBQTBDLEVBQTFDLEdBQXFELEtBQUMsUUFBRCxDQUFVLE9BQTVFOztBQUNBLFlBQUcsU0FBUyxDQUFULGdCQUFBLENBQUEsR0FBQSxLQUFtQyxTQUFTLENBQVQsVUFBQSxDQUFxQixLQUFDLFFBQUQsQ0FBckIsTUFBQSxFQUFBLElBQUEsT0FBdEMsVUFBQSxFQUFBO0FBQ0UsaUJBREYsU0FDRTs7QUFKSjs7QUFLQSxhQUFPLEtBQVA7QUFOa0I7QUEvRmY7QUFBQTtBQUFBLCtCQXNHTyxLQXRHUCxFQXNHTztBQUNWLGFBQU8sSUFBQSxRQUFBLENBQ0gsS0FBQyxZQUFELENBQWMsS0FBZCxFQUFxQixVQUFyQixDQUFnQyxDQUFoQyxFQUFBLEtBQUEsR0FBMkMsS0FBQSxLQUFBLEdBQUEsTUFBQSxJQUFtQixLQUFBLEdBRDNELENBQ3dDLENBRHhDLEVBRUgsS0FBQyxZQUFELENBQWMsS0FBZCxFQUFxQixVQUFyQixDQUFnQyxDQUFoQyxFQUFBLEdBQUEsR0FBeUMsS0FBQSxLQUFBLEdBQUEsTUFBQSxJQUFtQixLQUFBLEdBQUEsQ0FBQSxHQUZ6RCxDQUVzQyxDQUZ0QyxFQUFBLFNBQUEsQ0FHTyxLQUFDLFFBQUQsQ0FIUCxPQUFBLEVBRzBCLEtBQUMsUUFBRCxDQUgxQixPQUFBLENBQVA7QUFEVTtBQXRHUDtBQUFBO0FBQUEsNkJBMkdLLEtBM0dMLEVBMkdLO0FBQ1IsYUFBTyxJQUFBLFFBQUEsQ0FDSCxLQUFDLFlBQUQsQ0FBYyxLQUFkLEVBQXFCLFVBQXJCLENBQWdDLENBQWhDLEVBQUEsS0FBQSxHQUEyQyxLQUFBLEtBQUEsR0FBQSxNQUFBLElBQW1CLEtBQUEsR0FBQSxDQUFBLEdBRDNELENBQ3dDLENBRHhDLEVBRUgsS0FBQyxZQUFELENBQWMsS0FBZCxFQUFxQixVQUFyQixDQUFnQyxDQUFoQyxFQUFBLEdBQUEsR0FBeUMsS0FBQSxLQUFBLEdBQUEsTUFBQSxJQUFtQixLQUFBLEdBQUEsQ0FBQSxHQUZ6RCxDQUVzQyxDQUZ0QyxFQUFBLFNBQUEsQ0FHTyxLQUFDLFFBQUQsQ0FBQSxPQUFBLEdBQW9CLEtBQUMsUUFBRCxDQUgzQixTQUFBLEVBR2dELEtBQUMsUUFBRCxDQUhoRCxPQUFBLENBQVA7QUFEUTtBQTNHTDs7QUFBQTtBQUFBLEdBQVA7Ozs7QUFpSEEsSUFBYSxxQkFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDZCQUNHO2FBQ04sS0FBQSxZQUFBLEU7QUFETTtBQURIO0FBQUE7QUFBQSxtQ0FHUztBQUFBOztBQUNaLFVBQTBCLEtBQUEsT0FBQSxJQUExQixJQUFBLEVBQUE7QUFBQSxRQUFBLFlBQUEsQ0FBYSxLQUFiLE9BQUEsQ0FBQTs7O2FBQ0EsS0FBQSxPQUFBLEdBQVcsVUFBQSxDQUFZLFlBQUE7QUFDckIsWUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLFVBQUE7O0FBQUEsUUFBQSxNQUFDLENBQUQsWUFBQTs7QUFDQSxRQUFBLFVBQUEsR0FBYSxNQUFDLENBQUEsUUFBRCxDQUFBLE9BQUEsR0FBb0IsTUFBQyxDQUFBLFFBQUQsQ0FBcEIsU0FBQSxHQUEwQyxNQUFDLENBQTNDLEtBQTBDLEVBQTFDLEdBQXFELE1BQUMsQ0FBQSxRQUFELENBQVUsT0FBNUU7QUFDQSxRQUFBLFFBQUEsR0FBVyxNQUFDLENBQUQsa0JBQUEsQ0FBb0IsTUFBQyxDQUFBLFlBQUQsQ0FBYyxDQUFkLEVBQWlCLFVBQWpCLENBQTRCLENBQTVCLEVBQUEsSUFBQSxHQUFBLFdBQUEsQ0FBa0QsTUFBQyxDQUFELEtBQUEsR0FBdEUsTUFBb0IsQ0FBcEIsQ0FBWDs7QUFDQSxZQUFBLFFBQUEsRUFBQTtBQUNFLFVBQUEsSUFBQSxHQUFPLElBQUEsd0JBQUEsQ0FBZ0IsUUFBUSxDQUF4QixLQUFBLEVBQStCLFFBQVEsQ0FBdkMsR0FBQSxFQUFBLFVBQUEsQ0FBUDs7QUFDQSxjQUFHLElBQUksQ0FBSixVQUFBLENBQWdCLE1BQUMsQ0FBQSxRQUFELENBQWhCLE1BQUEsRUFBSCxTQUFHLEVBQUgsRUFBQTtBQUNFLFlBQUEsTUFBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWLENBQUEsaUJBQUEsQ0FBbUMsQ0FEckMsSUFDcUMsQ0FBbkM7QUFISjtBQUFBLFNBQUEsTUFBQTtBQUtFLFVBQUEsTUFBQyxDQUxILElBS0U7OztBQUNGLFlBQXNCLE1BQUEsQ0FBQSxlQUFBLElBQXRCLElBQUEsRUFBQTtpQkFBQSxNQUFDLENBQUQsZUFBQSxFOztBQVZTLE9BQUEsRUFBQSxDQUFBLEM7QUFGQztBQUhUO0FBQUE7QUFBQSxnQ0FpQk07QUFDVCxhQUFPLEtBQVA7QUFEUztBQWpCTjtBQUFBO0FBQUEsb0NBbUJVO0FBQ2IsYUFBTyxDQUNILEtBQUMsUUFBRCxDQUFVLE1BQVYsQ0FERyxZQUNILEVBREcsRUFFSCxLQUFDLFlBQUQsQ0FBYyxDQUFkLEVBQWlCLFVBQWpCLENBQUEsQ0FBQSxJQUFpQyxLQUFBLEtBQUEsR0FGOUIsTUFBQSxDQUFQO0FBRGE7QUFuQlY7QUFBQTtBQUFBLHVDQXdCZSxHQXhCZixFQXdCZTtBQUNsQixVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUE7QUFBQSxNQUFBLEdBQUEsR0FBQSxLQUFBLFlBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTs7QUFDRSxRQUFBLFNBQUEsR0FBWSxLQUFBLFFBQUEsQ0FBQSxDQUFBLENBQVo7QUFDQSxRQUFBLElBQUEsR0FBTyxLQUFDLFFBQUQsQ0FBQSxjQUFBLENBQXlCLFNBQVMsQ0FBbEMsVUFBQSxDQUFQOztBQUNBLFlBQUcsSUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsU0FBUyxDQUFULFVBQUEsQ0FBQSxJQUFBOztBQUNBLGNBQUcsU0FBUyxDQUFULGdCQUFBLENBQUgsR0FBRyxDQUFILEVBQUE7QUFDRSxtQkFERixTQUNFO0FBSEo7O0FBSEY7O0FBT0EsYUFBTyxLQUFQO0FBUmtCO0FBeEJmOztBQUFBO0FBQUEsRUFBQSxZQUFBLENBQVA7Ozs7QUFrQ0EsWUFBWSxDQUFaLE1BQUEsR0FBc0IsVUFBQSxRQUFBLEVBQUEsVUFBQSxFQUFBO0FBQ3BCLE1BQUcsUUFBUSxDQUFDLE1BQVQsQ0FBSCxtQkFBRyxFQUFILEVBQUE7QUFDRSxXQUFPLElBQUEsWUFBQSxDQUFBLFFBQUEsRUFEVCxVQUNTLENBQVA7QUFERixHQUFBLE1BQUE7QUFHRSxXQUFPLElBQUEscUJBQUEsQ0FBQSxRQUFBLEVBSFQsVUFHUyxDQUFQOztBQUprQixDQUF0Qjs7Ozs7Ozs7OztBQ3ZKQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUZBLElBQUEsT0FBQSxHQUFBLEdBQUEsT0FBQTs7QUFJQSxJQUFhLFNBQU47QUFBQTtBQUFBO0FBQ0wscUJBQWEsS0FBYixFQUFhLE9BQWIsRUFBYTtBQUFBOztBQUNYLFFBQUEsUUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBOztBQUFBLFFBQUcsT0FBQSxLQUFBLEtBQUgsUUFBQSxFQUFBO0FBQ0UsTUFBQSxLQUFBLEdBQVEsQ0FEVixLQUNVLENBQVI7OztBQUNGLElBQUEsUUFBQSxHQUFXO0FBQ1QsTUFBQSxNQUFBLEVBRFMsSUFBQTtBQUVULE1BQUEsVUFBQSxFQUZTLEVBQUE7QUFHVCxNQUFBLGFBQUEsRUFIUyxJQUFBO0FBSVQsTUFBQSxPQUFBLEVBSlMsSUFBQTtBQUtULE1BQUEsSUFBQSxFQUFNLGlCQUxHLElBQUE7QUFNVCxNQUFBLFdBQUEsRUFOUyxJQUFBO0FBT1QsTUFBQSxZQUFBLEVBUFMsSUFBQTtBQVFULE1BQUEsWUFBQSxFQVJTLElBQUE7QUFTVCxNQUFBLFFBQUEsRUFUUyxJQUFBO0FBVVQsTUFBQSxRQUFBLEVBQVU7QUFWRCxLQUFYO0FBWUEsU0FBQSxLQUFBLEdBQVMsS0FBVDtBQUNBLFNBQUEsTUFBQSxHQUFVLE9BQVEsQ0FBQSxRQUFBLENBQWxCOztBQUNBLFNBQUEsR0FBQSxJQUFBLFFBQUEsRUFBQTs7O0FBQ0UsVUFBRyxHQUFBLElBQUgsT0FBQSxFQUFBO0FBQ0UsYUFBQSxHQUFBLElBQVksT0FBUSxDQUR0QixHQUNzQixDQUFwQjtBQURGLE9BQUEsTUFFSyxJQUFHLEtBQUEsTUFBQSxJQUFBLElBQUEsSUFBYSxHQUFBLEtBQWhCLFFBQUEsRUFBQTtBQUNILGFBQUEsR0FBQSxJQUFZLEtBQUMsTUFBRCxDQURULEdBQ1MsQ0FBWjtBQURHLE9BQUEsTUFBQTtBQUdILGFBQUEsR0FBQSxJQUhHLEdBR0g7O0FBTko7O0FBT0EsUUFBTyxLQUFBLE9BQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxXQUFBLE9BQUEsR0FBVyxJQUFBLGdCQUFBLENBQVksS0FEekIsUUFDYSxDQUFYOzs7QUFDRixRQUFHLEtBQUEsYUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFdBQUMsT0FBRCxDQUFBLE1BQUEsR0FBa0IsS0FEcEIsYUFDRTs7O0FBQ0YsUUFBRyxLQUFBLFVBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxXQUFDLE9BQUQsQ0FBQSxhQUFBLENBQXVCLEtBRHpCLFVBQ0U7O0FBN0JTOztBQURSO0FBQUE7QUFBQSwyQkErQkM7QUFDSixXQUFBLGdCQUFBO0FBQ0EsV0FBQSxHQUFBLEdBQU8sS0FBQSxNQUFBLENBQVEsS0FBUixJQUFBLENBQVA7QUFDQSxhQUFPLEtBQUMsR0FBUjtBQWpDRixLQURLLEM7Ozs7O0FBQUE7QUFBQTtBQUFBLHdDQXVDYztBQUNqQixVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxFQUFSO0FBQ0EsTUFBQSxHQUFBLEdBQUEsS0FBQSxLQUFBOztBQUFBLFdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBOzs7QUFBQSxvQ0FDaUIsaUNBQUEsVUFBQSxDQUFBLElBQUEsQ0FEakI7O0FBQUE7O0FBQ0UsUUFBQSxLQURGO0FBQ0UsUUFBQSxJQURGOztBQUVFLFlBQUcsS0FBQSxJQUFBLElBQUEsSUFBVyxFQUFFLE9BQUEsQ0FBQSxJQUFBLENBQVMsS0FBQyxPQUFELENBQVQsYUFBUyxFQUFULEVBQUEsS0FBQSxLQUFoQixDQUFjLENBQWQsRUFBQTtBQUNFLGNBQUEsRUFBTyxLQUFBLElBQVAsS0FBQSxDQUFBLEVBQUE7QUFDRSxZQUFBLEtBQU0sQ0FBTixLQUFNLENBQU4sR0FERixFQUNFOzs7QUFDRixVQUFBLEtBQU0sQ0FBQSxLQUFBLENBQU4sQ0FBQSxJQUFBLENBSEYsSUFHRTs7QUFMSjs7QUFNQSxhQUFPLEtBQVA7QUFSaUI7QUF2Q2Q7QUFBQTtBQUFBLHNDQWdEYyxTQWhEZCxFQWdEYztBQUNqQixVQUFBLElBQUEsRUFBQSxLQUFBOztBQURpQixtQ0FDRixpQ0FBQSxVQUFBLENBQUEsU0FBQSxFQUFBLElBQUEsQ0FERTs7QUFBQTs7QUFDakIsTUFBQSxLQURpQjtBQUNqQixNQUFBLElBRGlCO2FBRWpCLEtBQUMsS0FBRCxDQUFBLEdBQUEsQ0FBWSxVQUFBLElBQUEsRUFBQTtBQUNWLFlBQUEsUUFBQSxFQUFBLFNBQUE7O0FBRFUscUNBQ2EsaUNBQUEsVUFBQSxDQUFBLElBQUEsQ0FEYjs7QUFBQTs7QUFDVixRQUFBLFNBRFU7QUFDVixRQUFBLFFBRFU7O0FBRVYsWUFBRyxTQUFBLElBQUEsSUFBQSxJQUFlLFNBQUEsS0FBbEIsS0FBQSxFQUFBO0FBQ0UsVUFBQSxJQUFBLEdBREYsUUFDRTs7O0FBQ0YsWUFBRyxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsVUFBQSxJQUFBLEdBQU8sSUFBQSxHQUFBLEdBQUEsR0FEVCxJQUNFOzs7QUFDRixlQUFPLElBQVA7QUFORixPQUFBLEM7QUFGaUI7QUFoRGQ7QUFBQTtBQUFBLHFDQTBEVztBQUNkLFVBQUEsQ0FBQTtBQUFBLGFBQUEsWUFBQTs7QUFBVSxRQUFBLEdBQUEsR0FBQSxLQUFBLEtBQUE7QUFBQSxRQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGFBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBOzs7Y0FBcUIsQ0FBQyxDQUFELE9BQUEsQ0FBQSxHQUFBLE1BQWtCLENBQUMsQyxFQUFBO3lCQUExQyxDOztBQUFFOzs7T0FBVixDLElBQUEsQyxJQUFBLENBQUE7QUFEYztBQTFEWDtBQUFBO0FBQUEsdUNBNERhO0FBQ2hCLFVBQUEsR0FBQSxFQUFBLFFBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxZQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBOztBQUFBLFVBQUcsS0FBSCxZQUFBLEVBQUE7QUFDRSxhQUFBLFlBQUEsR0FBZ0IsS0FBaEI7QUFDQSxRQUFBLFlBQUEsR0FBZSxJQUFBLFNBQUEsQ0FBYyxLQUFDLE9BQUQsQ0FBZCxhQUFjLEVBQWQsRUFBd0M7QUFBQyxVQUFBLE1BQUEsRUFBRCxJQUFBO0FBQWUsVUFBQSxXQUFBLEVBQWYsS0FBQTtBQUFtQyxVQUFBLFlBQUEsRUFBYztBQUFqRCxTQUF4QyxFQUFBLGdCQUFBLEVBQWY7QUFDQSxRQUFBLENBQUEsR0FBSSxDQUFKO0FBQ0EsUUFBQSxPQUFBLEdBQUEsRUFBQTs7ZUFBTSxDQUFBLEdBQUksWUFBWSxDQUF0QixNLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxZQUFhLENBQUEsQ0FBQSxDQUFuQjtBQUNBLFVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxTQUFBOztBQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBOztBQUNFLFlBQUEsR0FBQSxHQUFNLFFBQVEsQ0FBUixNQUFBLENBQUEsSUFBQSxDQUFOOztBQUNBLGdCQUFHLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxtQkFBQyxPQUFELENBQUEsYUFBQSxDQUFBLEdBQUE7QUFDQSxjQUFBLFlBQUEsR0FBZSxZQUFZLENBQVosTUFBQSxDQUFvQixJQUFBLFNBQUEsQ0FBQSxHQUFBLEVBQW1CO0FBQUMsZ0JBQUEsTUFBQSxFQUFELElBQUE7QUFBZSxnQkFBQSxXQUFBLEVBQWYsS0FBQTtBQUFtQyxnQkFBQSxZQUFBLEVBQWM7QUFBakQsZUFBbkIsRUFGckMsZ0JBRXFDLEVBQXBCLENBQWY7O0FBSko7O3VCQUtBLENBQUEsRTtBQVBGOztlQUpGLE87O0FBRGdCO0FBNURiO0FBQUE7QUFBQSwyQkF5RUcsR0F6RUgsRUF5RUc7QUFBQSxVQUFLLElBQUwsdUVBQUEsSUFBQTtBQUNOLFVBQUEsSUFBQTs7QUFBQSxVQUFPLEdBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxlQURGLElBQ0U7OztBQUNGLE1BQUEsSUFBQSxHQUFPLEtBQUEsa0JBQUEsQ0FBb0IsS0FBcEIsZ0JBQW9CLEVBQXBCLENBQVA7O0FBQ0EsVUFBRyxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFERixJQUNFOztBQUxJO0FBekVIO0FBQUE7QUFBQSx1Q0ErRWE7QUFDaEIsVUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsWUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBOztBQUFBLFVBQU8sS0FBQSxJQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsZUFERixFQUNFOzs7QUFDRixXQUFDLElBQUQsQ0FBQSxJQUFBO0FBQ0EsTUFBQSxZQUFBLEdBQWUsRUFBZjtBQUNBLE1BQUEsR0FBQSxHQUFBLEtBQUEsaUJBQUEsRUFBQTs7QUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUE7O0FBQ0UsUUFBQSxLQUFBLEdBQVEsS0FBQSxpQkFBQSxDQUFBLEtBQUEsQ0FBUjs7QUFDQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7QUFDRSxVQUFBLFlBQUEsR0FBZSxZQUFZLENBQVosTUFBQSxDQUFvQixJQUFBLFNBQUEsQ0FBQSxLQUFBLEVBQXFCO0FBQUMsWUFBQSxNQUFBLEVBQUQsSUFBQTtBQUFlLFlBQUEsSUFBQSxFQUFNO0FBQXJCLFdBQXJCLEVBQXBCLGdCQUFvQixFQUFwQixDQUFmO0FBREY7QUFGRjs7QUFJQSxNQUFBLElBQUEsR0FBQSxLQUFBLE9BQUEsQ0FBQSxhQUFBLEVBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLElBQUEsR0FBQSxJQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7OztBQUFBLHFDQUNvQixpQ0FBQSxVQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsQ0FEcEI7O0FBQUE7O0FBQ0UsUUFBQSxRQURGO0FBQ0UsUUFBQSxJQURGO0FBRUUsUUFBQSxLQUFBLEdBQVEsS0FBQSxpQkFBQSxDQUFBLFFBQUEsQ0FBUjs7QUFDQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsSUFBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7QUFDRSxVQUFBLFlBQUEsR0FBZSxZQUFZLENBQVosTUFBQSxDQUFvQixJQUFBLFNBQUEsQ0FBYyxLQUFBLGlCQUFBLENBQWQsSUFBYyxDQUFkLEVBQXdDO0FBQUMsWUFBQSxNQUFBLEVBQUQsSUFBQTtBQUFlLFlBQUEsSUFBQSxFQUFNO0FBQXJCLFdBQXhDLEVBQXBCLGdCQUFvQixFQUFwQixDQUFmO0FBREY7QUFIRjs7QUFLQSxNQUFBLElBQUEsR0FBQSxLQUFBLGNBQUEsRUFBQTs7QUFBQSxXQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsSUFBQSxHQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7QUFDRSxRQUFBLE1BQUEsR0FBUyxLQUFDLElBQUQsQ0FBQSxNQUFBLENBQUEsSUFBQSxDQUFUOztBQUNBLFlBQUcsS0FBQSxVQUFBLENBQUgsTUFBRyxDQUFILEVBQUE7QUFDRSxVQUFBLFlBQVksQ0FBWixJQUFBLENBREYsTUFDRTs7QUFISjs7QUFJQSxVQUFHLEtBQUgsWUFBQSxFQUFBO0FBQ0UsUUFBQSxRQUFBLEdBQVcsS0FBQyxJQUFELENBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBWDs7QUFDQSxZQUFHLEtBQUEsVUFBQSxDQUFILFFBQUcsQ0FBSCxFQUFBO0FBQ0UsVUFBQSxZQUFZLENBQVosSUFBQSxDQURGLFFBQ0U7QUFISjs7O0FBSUEsV0FBQSxZQUFBLEdBQWdCLFlBQWhCO0FBQ0EsYUFBTyxZQUFQO0FBdkJnQjtBQS9FYjtBQUFBO0FBQUEsc0NBdUdjLElBdkdkLEVBdUdjO0FBQ2pCLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLEtBQUMsSUFBRCxDQUFBLE1BQUEsQ0FBQSxJQUFBLENBQU47O0FBQ0EsVUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxHQUFHLENBQUgsSUFBQTs7QUFDQSxZQUFHLEdBQUEsQ0FBQSxPQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sQ0FBQSxHQUFBLEVBQUssR0FBRyxDQURqQixVQUNjLEVBQUwsQ0FBUDs7O0FBQ0YsZUFBTyxDQUpULEdBSVMsQ0FBUDs7O0FBQ0YsYUFBTyxDQUFBLEdBQUEsQ0FBUDtBQVBpQjtBQXZHZDtBQUFBO0FBQUEsK0JBK0dPLEdBL0dQLEVBK0dPO0FBQ1YsVUFBTyxHQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsZUFERixLQUNFOzs7QUFDRixVQUFHLEdBQUcsQ0FBSCxJQUFBLEtBQUEsVUFBQSxJQUEwQixPQUFBLENBQUEsSUFBQSxDQUFPLEtBQVAsU0FBTyxFQUFQLEVBQUEsR0FBQSxLQUE3QixDQUFBLEVBQUE7QUFDRSxlQURGLEtBQ0U7OztBQUNGLGFBQU8sQ0FBQyxLQUFELFdBQUEsSUFBaUIsS0FBQSxlQUFBLENBQUEsR0FBQSxDQUF4QjtBQUxVO0FBL0dQO0FBQUE7QUFBQSxnQ0FxSE07QUFDVCxVQUFBLEdBQUE7O0FBQUEsVUFBRyxDQUFBLENBQUEsR0FBQSxHQUFBLEtBQUEsUUFBQSxLQUFBLElBQUEsR0FBQSxHQUFBLENBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQSxLQUFILElBQUEsRUFBQTtBQUNFLGVBQU8sS0FBQyxRQUFELENBQVUsVUFBVixDQURULG1CQUNTLEVBQVA7OztBQUNGLGFBQU8sRUFBUDtBQUhTO0FBckhOO0FBQUE7QUFBQSxvQ0F5SFksR0F6SFosRUF5SFk7QUFDZixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxLQUFBLGNBQUEsRUFBUjs7QUFDQSxVQUFHLEtBQUssQ0FBTCxNQUFBLEtBQUgsQ0FBQSxFQUFBO0FBQ0UsZUFBTyxHQUFHLENBQUgsSUFBQSxHQUFBLG9CQUFBLENBQWdDLEtBQU0sQ0FEL0MsQ0FDK0MsQ0FBdEMsQ0FBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sR0FBRyxDQUFILElBQUEsR0FIVCxZQUdTLEVBQVA7O0FBTGE7QUF6SFo7QUFBQTtBQUFBLDZCQStISyxHQS9ITCxFQStISztBQUNSLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUcsQ0FBQyxLQUFaOztBQUNBLFVBQUcsR0FBRyxDQUFILElBQUEsS0FBSCxVQUFBLEVBQUE7QUFDSSxRQUFBLEtBQUEsSUFESixJQUNJOzs7QUFDSixhQUFPLEtBQVA7QUFKUTtBQS9ITDtBQUFBO0FBQUEsdUNBb0llLElBcElmLEVBb0llO0FBQ2xCLFVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxLQUFBOztBQUFBLFVBQUcsSUFBSSxDQUFKLE1BQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFQO0FBQ0EsUUFBQSxTQUFBLEdBQVksSUFBWjs7QUFDQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7QUFDRSxVQUFBLEtBQUEsR0FBUSxLQUFBLFFBQUEsQ0FBQSxDQUFBLENBQVI7O0FBQ0EsY0FBSSxJQUFBLElBQUQsSUFBQyxJQUFTLEtBQUEsSUFBYixTQUFBLEVBQUE7QUFDRSxZQUFBLFNBQUEsR0FBWSxLQUFaO0FBQ0EsWUFBQSxJQUFBLEdBRkYsQ0FFRTs7QUFKSjs7QUFLQSxlQVJGLElBUUU7O0FBVGdCO0FBcElmOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7O0FDREE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFhLFdBQU47QUFBQTtBQUFBO0FBQ0wsdUJBQWEsSUFBYixFQUFhLE9BQWIsRUFBYTtBQUFBOztBQUFDLFNBQUMsR0FBRCxHQUFDLElBQUQ7QUFBSyxTQUFDLE9BQUQsR0FBQyxPQUFEO0FBQU47O0FBRFI7QUFBQTtBQUFBLDJCQUdDO0FBQ0osVUFBQSxFQUFPLEtBQUEsT0FBQSxNQUFjLEtBQXJCLE1BQUEsQ0FBQSxFQUFBO0FBQ0UsYUFBQSxNQUFBLEdBQVUsSUFBVjs7QUFDQSxhQUFBLFVBQUE7O0FBQ0EsYUFBQSxXQUFBOztBQUNBLFlBQUcsS0FBQSxNQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBQyxNQUFELENBREYsSUFDRTtBQUxKOzs7QUFNQSxhQUFPLElBQVA7QUFQSTtBQUhEO0FBQUE7QUFBQSw2QkFXSSxJQVhKLEVBV0ksR0FYSixFQVdJO2FBQ1AsS0FBQyxLQUFELENBQUEsSUFBQSxJQUFlLEc7QUFEUjtBQVhKO0FBQUE7QUFBQSw4QkFhSyxHQWJMLEVBYUs7YUFDUixLQUFDLE1BQUQsQ0FBQSxJQUFBLENBQUEsR0FBQSxDO0FBRFE7QUFiTDtBQUFBO0FBQUEsaUNBZU87QUFDVixVQUFPLEtBQUEsT0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGFBQUEsT0FBQSxHQUFXLElBRGIsZ0JBQ2EsRUFBWDs7O0FBQ0YsYUFBTyxLQUFBLE9BQUEsSUFBWSxJQUFBLGdCQUFBLEVBQW5CO0FBSFU7QUFmUDtBQUFBO0FBQUEsOEJBbUJNLE9BbkJOLEVBbUJNO0FBQ1QsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxVQUFBLEdBQUEsU0FBQSxDQUFBLE9BQUEsRUFBZ0MsS0FBaEMsb0JBQWdDLEVBQWhDLENBQVQ7QUFDQSxNQUFBLE1BQU0sQ0FBTixRQUFBLEdBQWtCLElBQWxCO0FBQ0EsYUFBTyxNQUFQO0FBSFM7QUFuQk47QUFBQTtBQUFBLGlDQXVCTztBQUNWLFVBQUEsR0FBQTs7QUFBQSxVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGFBQUMsR0FBRCxDQUFBLElBQUE7QUFDQSxRQUFBLEdBQUEsR0FBTSxLQUFBLFVBQUEsTUFBaUIsS0FBQyxHQUF4QjtBQUNBLFFBQUEsR0FBRyxDQUFILElBQUE7O0FBQ0EsWUFBRyxHQUFBLENBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGVBQUEsTUFBQSxHQUFVLElBQUksR0FBRyxDQUFQLEdBQUEsQ0FBQSxJQUFBLENBQVY7QUFDQSxpQkFBTyxLQUZULE1BRUU7QUFOSjs7QUFEVTtBQXZCUDtBQUFBO0FBQUEsa0NBK0JRO2FBQ1gsS0FBQSxLQUFBLEdBQVMsS0FBQSxXQUFBLEU7QUFERTtBQS9CUjtBQUFBO0FBQUEsMkNBaUNpQjtBQUNwQixhQUFPLEVBQVA7QUFEb0I7QUFqQ2pCO0FBQUE7QUFBQSw4QkFtQ0k7QUFDUCxhQUFPLEtBQUEsR0FBQSxJQUFBLElBQVA7QUFETztBQW5DSjtBQUFBO0FBQUEsd0NBcUNjO0FBQ2pCLFVBQUEsT0FBQTs7QUFBQSxVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFlBQUcsS0FBQSxNQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sS0FBQyxNQUFELENBRFQsaUJBQ1MsRUFBUDs7O0FBQ0YsUUFBQSxPQUFBLEdBQVUsS0FBQSxlQUFBLEVBQVY7O0FBQ0EsWUFBRyxPQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sT0FBTyxDQURoQixpQkFDUyxFQUFQOzs7QUFDRixlQUFPLEtBQUMsR0FBRCxDQU5ULGlCQU1TLEVBQVA7OztBQUNGLGFBQU8sS0FBUDtBQVJpQjtBQXJDZDtBQUFBO0FBQUEsa0NBOENRO0FBQ1gsVUFBQSxPQUFBLEVBQUEsR0FBQTs7QUFBQSxVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLEVBQU47QUFDQSxRQUFBLE9BQUEsR0FBVSxLQUFBLFVBQUEsRUFBVjs7QUFDQSxZQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsT0FBTyxDQURqQyxXQUMwQixFQUFsQixDQUFOOzs7QUFDRixRQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsS0FBQyxHQUFELENBQWxCLFFBQUEsQ0FBTjs7QUFDQSxZQUFHLEtBQUEsTUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBTixNQUFBLENBQUEsR0FBQSxFQUFrQixLQUFDLE1BQUQsQ0FEMUIsV0FDMEIsRUFBbEIsQ0FBTjs7O0FBQ0YsZUFSRixHQVFFOztBQVRTO0FBOUNSO0FBQUE7QUFBQSxpQ0F3RE87QUFDVixVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFlBQU8sS0FBQSxVQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsZUFERixlQUNFOzs7QUFDRixlQUFPLEtBQUEsVUFBQSxJQUhULElBR0U7O0FBSlE7QUF4RFA7QUFBQTtBQUFBLHNDQTZEWTtBQUNmLFVBQUEsT0FBQTs7QUFBQSxVQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFlBQUcsS0FBQSxlQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sS0FBQSxlQUFBLElBRFQsSUFDRTs7O0FBQ0YsWUFBRyxLQUFBLEdBQUEsQ0FBQSxPQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsVUFBQSxPQUFBLEdBQVUsS0FBQyxHQUFYOztBQUNBLGlCQUFNLE9BQUEsSUFBQSxJQUFBLElBQWEsT0FBQSxDQUFBLE9BQUEsSUFBbkIsSUFBQSxFQUFBO0FBQ0UsWUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFQLGtCQUFBLENBQTJCLEtBQUEsU0FBQSxDQUFXLEtBQUEsWUFBQSxDQUFjLE9BQU8sQ0FBM0QsT0FBc0MsQ0FBWCxDQUEzQixDQUFWOztBQUNBLGdCQUFPLEtBQUEsVUFBQSxJQUFQLElBQUEsRUFBQTtBQUNFLG1CQUFBLFVBQUEsR0FBYyxPQUFBLElBRGhCLEtBQ0U7O0FBSEo7O0FBSUEsZUFBQSxlQUFBLEdBQW1CLE9BQUEsSUFBVyxLQUE5QjtBQUNBLGlCQVBGLE9BT0U7QUFWSjs7QUFEZTtBQTdEWjtBQUFBO0FBQUEsaUNBeUVTLE9BekVULEVBeUVTO2FBQ1osTztBQURZO0FBekVUO0FBQUE7QUFBQSxpQ0EyRU87QUFDVixVQUFBLEdBQUE7O0FBQUEsVUFBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxZQUFHLEtBQUEsVUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLEtBRFQsVUFDRTs7O0FBQ0YsUUFBQSxHQUFBLEdBQU0sS0FBQyxHQUFELENBQUEsa0JBQUEsQ0FBd0IsS0FBeEIsVUFBd0IsRUFBeEIsQ0FBTjs7QUFDQSxZQUFHLEtBQUEsTUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBTixNQUFBLENBQUEsR0FBQSxFQUFrQixLQUFDLE1BQUQsQ0FEMUIsVUFDMEIsRUFBbEIsQ0FBTjs7O0FBQ0YsYUFBQSxVQUFBLEdBQWMsR0FBZDtBQUNBLGVBUEYsR0FPRTs7QUFSUTtBQTNFUDtBQUFBO0FBQUEsOEJBb0ZNLEdBcEZOLEVBb0ZNO0FBQ1QsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsS0FBQSxVQUFBLEVBQVY7O0FBQ0EsVUFBRyxPQUFBLElBQUEsSUFBQSxJQUFhLEdBQUEsSUFBaEIsT0FBQSxFQUFBO0FBQ0UsZUFBTyxPQUFRLENBRGpCLEdBQ2lCLENBQWY7O0FBSE87QUFwRk47QUFBQTtBQUFBLDZCQXdGSyxLQXhGTCxFQXdGSztBQUFBLFVBQVEsTUFBUix1RUFBQSxJQUFBO0FBQ1IsVUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBOztBQUFBLFVBQW1CLENBQUEsR0FBQSxXQUFDLEtBQUQsQ0FBQSxNQUFDLFFBQUQsSUFBQyxHQUFBLEtBQXBCLFFBQUEsRUFBQTtBQUFBLFFBQUEsS0FBQSxHQUFRLENBQVIsS0FBUSxDQUFSOzs7QUFDQSxXQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7O0FBQ0UsWUFBb0IsS0FBQSxLQUFBLENBQUEsQ0FBQSxLQUFwQixJQUFBLEVBQUE7QUFBQSxpQkFBTyxLQUFDLEtBQUQsQ0FBUCxDQUFPLENBQVA7OztBQUNBLFlBQXFCLEtBQUEsTUFBQSxDQUFBLENBQUEsS0FBckIsSUFBQSxFQUFBO0FBQUEsaUJBQU8sS0FBQyxNQUFELENBQVAsQ0FBTyxDQUFQOztBQUZGOztBQUdBLGFBQU8sTUFBUDtBQUxRO0FBeEZMO0FBQUE7QUFBQSxtQ0E4RlM7QUFDWixVQUFBLEdBQUE7O0FBQUEsVUFBRyxDQUFBLENBQUEsR0FBQSxHQUFBLEtBQUEsT0FBQSxDQUFBLFFBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxDQUFBLFVBQUEsR0FBQSxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLEtBQUMsT0FBRCxDQUFTLFFBQVQsQ0FBa0IsVUFBbEIsQ0FEVCxtQkFDUyxFQUFQOzs7QUFDRixhQUFPLEVBQVA7QUFIWTtBQTlGVDtBQUFBO0FBQUEsMENBa0dnQjtBQUNuQixhQUFPLEtBQUEsWUFBQSxHQUFBLE1BQUEsQ0FBdUIsQ0FBQyxLQUF4QixHQUF1QixDQUF2QixDQUFQO0FBRG1CO0FBbEdoQjtBQUFBO0FBQUEsc0NBb0dZO0FBQ2YsVUFBQSxHQUFBOztBQUFBLFVBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsWUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxLQUFDLE1BQUQsQ0FEVCxPQUNTLEVBQVA7OztBQUNGLFFBQUEsR0FBQSxHQUFNLEtBQUEsZUFBQSxNQUFzQixLQUFDLEdBQTdCO0FBQ0EsUUFBQSxHQUFHLENBQUgsSUFBQTs7QUFDQSxZQUFHLEdBQUEsQ0FBQSxZQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sR0FBRyxDQUFILFlBQUEsQ0FEVCxJQUNTLENBQVA7QUFOSjs7QUFEZTtBQXBHWjtBQUFBO0FBQUEsZ0NBNEdNO0FBQ1QsVUFBQSxHQUFBOztBQUFBLFVBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsWUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxLQUFDLE1BQUQsQ0FEVCxNQUNTLEVBQVA7OztBQUNGLFFBQUEsR0FBQSxHQUFNLEtBQUEsZUFBQSxNQUFzQixLQUFDLEdBQTdCO0FBQ0EsUUFBQSxHQUFHLENBQUgsSUFBQTs7QUFDQSxZQUFHLEdBQUEsQ0FBQSxXQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sR0FBRyxDQUFILFdBQUEsQ0FEVCxJQUNTLENBQVA7OztBQUNGLFlBQUcsR0FBQSxDQUFBLFNBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxHQUFHLENBRFosU0FDRTtBQVJKOztBQURTO0FBNUdOO0FBQUE7QUFBQSw2QkFzSEc7QUFDTixVQUFBLFVBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQTtBQUFBLFdBQUEsSUFBQTs7QUFDQSxVQUFHLEtBQUgsaUJBQUcsRUFBSCxFQUFBO0FBQ0UsWUFBRyxDQUFBLEdBQUEsR0FBQSxLQUFBLFNBQUEsRUFBQSxLQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFNLEtBQUEsWUFBQSxDQUFBLEdBQUEsQ0FBTjs7QUFDQSxjQUFHLEdBQUcsQ0FBSCxNQUFBLEdBQUEsQ0FBQSxJQUFtQixLQUFBLFNBQUEsQ0FBQSxPQUFBLEVBQXRCLElBQXNCLENBQXRCLEVBQUE7QUFDRSxZQUFBLE1BQUEsR0FBUyxLQUFBLGdCQUFBLENBQUEsR0FBQSxDQUFUO0FBQ0EsWUFBQSxHQUFBLEdBQU0sTUFBTSxDQUZkLFFBRVEsRUFBTjs7O0FBQ0YsY0FBRyxVQUFBLEdBQWEsS0FBQSxTQUFBLENBQUEsYUFBQSxFQUFoQixJQUFnQixDQUFoQixFQUFBO0FBQ0UsWUFBQSxHQUFBLEdBQU0sVUFBQSxDQUFBLEdBQUEsRUFEUixJQUNRLENBQU47OztBQUNGLGlCQVBGLEdBT0U7QUFSSjs7QUFGTTtBQXRISDtBQUFBO0FBQUEsdUNBaUlhO0FBQUEsVUFBQyxHQUFELHVFQUFBLEVBQUE7QUFDaEIsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQSxrQkFBQSxDQUFhLElBQUEsc0JBQUEsQ0FBYixHQUFhLENBQWIsRUFBa0M7QUFBQyxRQUFBLFVBQUEsRUFBVztBQUFaLE9BQWxDLENBQVQ7QUFDQSxNQUFBLE1BQU0sQ0FBTixXQUFBLEdBQXFCLEtBQXJCO0FBQ0EsYUFBTyxNQUFQO0FBSGdCO0FBakliO0FBQUE7QUFBQSxnQ0FxSU07QUFDVCxhQUFPLENBQVA7QUFEUztBQXJJTjtBQUFBO0FBQUEsaUNBdUlTLElBdklULEVBdUlTO0FBQ1osVUFBRyxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBTyxJQUFJLENBQUosT0FBQSxDQUFBLEtBQUEsRUFEVCxJQUNTLENBQVA7QUFERixPQUFBLE1BQUE7QUFHRSxlQUhGLElBR0U7O0FBSlU7QUF2SVQ7QUFBQTtBQUFBLGdDQTRJUSxJQTVJUixFQTRJUTtBQUNYLGFBQU8sMkJBQUEsY0FBQSxDQUFBLElBQUEsRUFBaUMsS0FBakMsU0FBaUMsRUFBakMsRUFBQSxHQUFBLENBQVA7QUFEVztBQTVJUjs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7OztBQ1JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQWEsUUFBQSxHQUFBLFlBQUE7QUFBQSxNQUFOLFFBQU07QUFBQTtBQUFBO0FBQ1gsc0JBQWEsTUFBYixFQUFhO0FBQUEsVUFBVSxPQUFWLHVFQUFBLEVBQUE7O0FBQUE7O0FBQ1gsVUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFEWSxXQUFDLE1BQUQsR0FBQyxNQUFEO0FBQ1osTUFBQSxRQUFRLENBQVIsSUFBQTtBQUNBLFdBQUEsTUFBQSxHQUFVLDBCQUFWO0FBQ0EsV0FBQSxJQUFBLEdBQVEsRUFBUjtBQUVBLE1BQUEsUUFBQSxHQUFXO0FBQ1QsbUJBRFMsSUFBQTtBQUVULGdCQUZTLEdBQUE7QUFHVCxxQkFIUyxHQUFBO0FBSVQseUJBSlMsR0FBQTtBQUtULHNCQUxTLEdBQUE7QUFNVCx1QkFOUyxJQUFBO0FBT1Qsc0JBQWU7QUFQTixPQUFYO0FBU0EsV0FBQSxNQUFBLEdBQVUsT0FBUSxDQUFBLFFBQUEsQ0FBbEI7QUFFQSxXQUFBLE1BQUEsR0FBYSxLQUFBLE1BQUEsSUFBSCxJQUFHLEdBQWMsS0FBQyxNQUFELENBQUEsTUFBQSxHQUFqQixDQUFHLEdBQW9DLENBQWpEOztBQUVBLFdBQUEsR0FBQSxJQUFBLFFBQUEsRUFBQTs7O0FBQ0UsWUFBRyxHQUFBLElBQUgsT0FBQSxFQUFBO0FBQ0UsZUFBQSxHQUFBLElBQVksT0FBUSxDQUR0QixHQUNzQixDQUFwQjtBQURGLFNBQUEsTUFFSyxJQUFHLEtBQUEsTUFBQSxJQUFBLElBQUEsSUFBYSxHQUFBLEtBQWhCLFFBQUEsRUFBQTtBQUNILGVBQUEsR0FBQSxJQUFZLEtBQUMsTUFBRCxDQURULEdBQ1MsQ0FBWjtBQURHLFNBQUEsTUFBQTtBQUdILGVBQUEsR0FBQSxJQUhHLEdBR0g7O0FBTko7O0FBT0EsVUFBMEIsS0FBQSxNQUFBLElBQTFCLElBQUEsRUFBQTtBQUFBLGFBQUMsTUFBRCxDQUFBLFFBQUEsQ0FBQSxJQUFBOzs7QUFFQSxXQUFBLE9BQUEsR0FBVyxJQUFBLGdCQUFBLENBQUEsSUFBQSxDQUFYOztBQUNBLFVBQUcsS0FBQSxVQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsYUFBQyxPQUFELENBQUEsTUFBQSxHQUFrQixLQUFDLFVBQUQsQ0FEcEIsT0FDRTs7O0FBRUYsV0FBQSxNQUFBLEdBQVUsSUFBQSxjQUFBLEVBQVY7QUEvQlc7O0FBREY7QUFBQTtBQUFBLHdDQWtDTTtBQUNmLGFBQUEsT0FBQSxHQUFXLElBQUEsZ0JBQUEsRUFBWDtBQUNBLGFBQUMsTUFBRCxDQUFBLEdBQUEsQ0FBQSxnQkFBQTtBQUNBLGFBQUEsY0FBQTtlQUNBLEtBQUEsT0FBQSxHQUFXLEk7QUFKSTtBQWxDTjtBQUFBO0FBQUEsdUNBdUNLO0FBQ2QsWUFBRyxLQUFDLE1BQUQsQ0FBSCxtQkFBRyxFQUFILEVBQUE7aUJBQ0UsS0FBQSxhQUFBLENBQWUsS0FBQyxNQUFELENBRGpCLFdBQ2lCLEVBQWYsQztBQURGLFNBQUEsTUFBQTtpQkFHRSxLQUFBLFFBQUEsQ0FBVSxLQUFDLE1BQUQsQ0FIWixZQUdZLEVBQVYsQzs7QUFKWTtBQXZDTDtBQUFBO0FBQUEsK0JBNENELEdBNUNDLEVBNENEO2VBQ1IsS0FBQSxhQUFBLENBQWUsQ0FBZixHQUFlLENBQWYsQztBQURRO0FBNUNDO0FBQUE7QUFBQSxvQ0E4Q0ksUUE5Q0osRUE4Q0k7QUFDYixZQUFBLEdBQUE7O0FBQUEsWUFBRyxRQUFRLENBQVIsTUFBQSxHQUFILENBQUEsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFNLEtBQUEsWUFBQSxDQUFjLFFBQVMsQ0FBQSxDQUFBLENBQVQsQ0FBZCxHQUFBLENBQU47O0FBQ0EsY0FBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZ0JBQUcsUUFBUSxDQUFSLE1BQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxjQUFBLEdBQUcsQ0FBSCxXQUFBLENBREYsUUFDRTs7O0FBQ0YsWUFBQSxHQUFHLENBQUgsSUFBQTtBQUNBLGlCQUFDLE1BQUQsQ0FBQSxHQUFBLENBQUEsR0FBQTttQkFDQSxHQUFHLENBTEwsT0FLRSxFO0FBTEYsV0FBQSxNQUFBO0FBT0UsZ0JBQUcsUUFBUyxDQUFBLENBQUEsQ0FBVCxDQUFBLEtBQUEsS0FBcUIsUUFBUyxDQUFBLENBQUEsQ0FBVCxDQUF4QixHQUFBLEVBQUE7cUJBQ0UsS0FBQSxVQUFBLENBREYsUUFDRSxDO0FBREYsYUFBQSxNQUFBO3FCQUdFLEtBQUEsZ0JBQUEsQ0FIRixRQUdFLEM7QUFWSjtBQUZGOztBQURhO0FBOUNKO0FBQUE7QUFBQSxtQ0E0REcsR0E1REgsRUE0REc7QUFDWixZQUFBLElBQUEsRUFBQSxJQUFBOztBQUFBLFlBQUcsS0FBQSxpQkFBQSxDQUFBLEdBQUEsS0FBNEIsS0FBQSxpQkFBQSxDQUE1QixHQUE0QixDQUE1QixJQUF3RCxLQUFBLGVBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxLQUEzRCxDQUFBLEVBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxHQUFBLEdBQUksS0FBQyxPQUFELENBQVMsTUFBcEI7QUFDQSxVQUFBLElBQUEsR0FGRixHQUVFO0FBRkYsU0FBQSxNQUFBO0FBSUUsY0FBRyxLQUFBLGlCQUFBLENBQUEsR0FBQSxLQUE0QixLQUFBLGVBQUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxLQUEvQixDQUFBLEVBQUE7QUFDRSxZQUFBLEdBQUEsSUFBTyxLQUFDLE9BQUQsQ0FEVCxNQUNFOzs7QUFDRixVQUFBLElBQUEsR0FBTyxLQUFBLGNBQUEsQ0FBQSxHQUFBLENBQVA7O0FBQ0EsY0FBTyxJQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsbUJBREYsSUFDRTs7O0FBQ0YsVUFBQSxJQUFBLEdBQU8sS0FBQSxjQUFBLENBQWdCLEdBQUEsR0FBaEIsQ0FBQSxDQUFQOztBQUNBLGNBQUksSUFBQSxJQUFELElBQUMsSUFBUyxLQUFBLGVBQUEsQ0FBQSxJQUFBLElBQUEsQ0FBQSxLQUFiLENBQUEsRUFBQTtBQUNFLG1CQURGLElBQ0U7QUFYSjs7O0FBWUEsZUFBTyxJQUFBLDRDQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBb0MsS0FBQyxNQUFELENBQUEsVUFBQSxDQUFBLElBQUEsRUFBd0IsSUFBQSxHQUFLLEtBQUMsT0FBRCxDQUFqRSxNQUFvQyxDQUFwQyxDQUFQO0FBYlk7QUE1REg7QUFBQTtBQUFBLGdDQTBFRjtBQUFBLFlBQUMsS0FBRCx1RUFBQSxDQUFBO0FBQ1AsWUFBQSxTQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxLQUFOOztBQUNBLGVBQU0sQ0FBQSxHQUFJLEtBQUEsV0FBQSxDQUFBLEdBQUEsRUFBa0IsQ0FBQyxLQUFELE9BQUEsRUFBNUIsSUFBNEIsQ0FBbEIsQ0FBVixFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFELEdBQUEsR0FBUSxDQUFDLENBQUMsR0FBRixDQUFNLE1BQXBCOztBQUNBLGNBQUcsQ0FBQyxDQUFELEdBQUEsS0FBUyxLQUFaLE9BQUEsRUFBQTtBQUNFLGdCQUFHLE9BQUEsU0FBQSxLQUFBLFdBQUEsSUFBQSxTQUFBLEtBQUgsSUFBQSxFQUFBO0FBQ0UscUJBQU8sSUFBQSw0Q0FBQSxDQUFBLElBQUEsRUFBQSxTQUFBLEVBQTJDLEtBQUMsTUFBRCxDQUFBLFVBQUEsQ0FBQSxTQUFBLEVBQThCLENBQUMsQ0FBRCxHQUFBLEdBQU0sS0FBQyxPQUFELENBRHhGLE1BQ29ELENBQTNDLENBQVA7QUFERixhQUFBLE1BQUE7QUFHRSxjQUFBLFNBQUEsR0FBWSxDQUFDLENBSGYsR0FHRTtBQUpKO0FBQUEsV0FBQSxNQUFBO0FBTUUsWUFBQSxTQUFBLEdBTkYsSUFNRTs7QUFSSjs7ZUFTQSxJO0FBWE87QUExRUU7QUFBQTtBQUFBLHdDQXNGTTtBQUFBLFlBQUMsR0FBRCx1RUFBQSxDQUFBO0FBQ2YsWUFBQSxhQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxDQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sR0FBUDtBQUNBLFFBQUEsYUFBQSxHQUFnQixLQUFBLE9BQUEsR0FBVyxLQUFDLFNBQTVCOztBQUNBLGVBQU0sQ0FBQSxDQUFBLEdBQUEsS0FBQSxRQUFBLENBQUEsSUFBQSxFQUFBLGFBQUEsQ0FBQSxLQUFOLElBQUEsRUFBQTtBQUNFLGNBQUcsR0FBQSxHQUFNLEtBQUEsWUFBQSxDQUFjLENBQUEsR0FBRSxhQUFhLENBQXRDLE1BQVMsQ0FBVCxFQUFBO0FBQ0UsWUFBQSxJQUFBLEdBQU8sR0FBRyxDQUFILFNBQUEsRUFBUDs7QUFDQSxnQkFBRyxHQUFHLENBQUgsR0FBQSxHQUFILEdBQUEsRUFBQTtBQUNFLHFCQURGLEdBQ0U7QUFISjtBQUFBLFdBQUEsTUFBQTtBQUtFLFlBQUEsSUFBQSxHQUFPLENBQUEsR0FBRSxhQUFhLENBTHhCLE1BS0U7O0FBTko7O2VBT0EsSTtBQVZlO0FBdEZOO0FBQUE7QUFBQSx3Q0FpR1EsR0FqR1IsRUFpR1E7QUFDakIsZUFBTyxLQUFDLE1BQUQsQ0FBQSxVQUFBLENBQW1CLEdBQUEsR0FBSSxLQUFDLE9BQUQsQ0FBdkIsTUFBQSxFQUFBLEdBQUEsTUFBK0MsS0FBQyxPQUF2RDtBQURpQjtBQWpHUjtBQUFBO0FBQUEsd0NBbUdRLEdBbkdSLEVBbUdRO0FBQ2pCLGVBQU8sS0FBQyxNQUFELENBQUEsVUFBQSxDQUFBLEdBQUEsRUFBdUIsR0FBQSxHQUFJLEtBQUMsT0FBRCxDQUEzQixNQUFBLE1BQStDLEtBQUMsT0FBdkQ7QUFEaUI7QUFuR1I7QUFBQTtBQUFBLHNDQXFHTSxLQXJHTixFQXFHTTtBQUNmLFlBQUEsQ0FBQTtBQUFBLFFBQUEsQ0FBQSxHQUFJLENBQUo7O0FBQ0EsZUFBTSxDQUFBLEtBQUEsR0FBQSxLQUFBLGNBQUEsQ0FBQSxLQUFBLENBQUEsS0FBTixJQUFBLEVBQUE7QUFDRSxVQUFBLENBQUE7QUFERjs7QUFFQSxlQUFPLENBQVA7QUFKZTtBQXJHTjtBQUFBO0FBQUEsZ0NBMEdBLEdBMUdBLEVBMEdBO0FBQ1QsZUFBTyxLQUFDLE1BQUQsQ0FBQSxVQUFBLENBQUEsR0FBQSxFQUF1QixHQUFBLEdBQXZCLENBQUEsTUFBQSxJQUFBLElBQXlDLEdBQUEsR0FBQSxDQUFBLElBQVcsS0FBQyxNQUFELENBQUEsT0FBQSxFQUEzRDtBQURTO0FBMUdBO0FBQUE7QUFBQSxxQ0E0R0ssS0E1R0wsRUE0R0s7QUFDZCxlQUFPLEtBQUEsY0FBQSxDQUFBLEtBQUEsRUFBc0IsQ0FBdEIsQ0FBQSxDQUFQO0FBRGM7QUE1R0w7QUFBQTtBQUFBLHFDQThHSyxLQTlHTCxFQThHSztBQUFBLFlBQU8sU0FBUCx1RUFBQSxDQUFBO0FBQ2QsWUFBQSxDQUFBO0FBQUEsUUFBQSxDQUFBLEdBQUksS0FBQSxXQUFBLENBQUEsS0FBQSxFQUFvQixDQUFDLEtBQUQsT0FBQSxFQUFwQixJQUFvQixDQUFwQixFQUFBLFNBQUEsQ0FBSjs7QUFFQSxZQUFTLENBQUEsSUFBTSxDQUFDLENBQUQsR0FBQSxLQUFTLEtBQXhCLE9BQUEsRUFBQTtpQkFBQSxDQUFDLENBQUQsRzs7QUFIYztBQTlHTDtBQUFBO0FBQUEsK0JBa0hELEtBbEhDLEVBa0hELE1BbEhDLEVBa0hEO0FBQ1IsZUFBTyxLQUFBLFFBQUEsQ0FBQSxLQUFBLEVBQUEsTUFBQSxFQUF1QixDQUF2QixDQUFBLENBQVA7QUFEUTtBQWxIQztBQUFBO0FBQUEsK0JBb0hELEtBcEhDLEVBb0hELE1BcEhDLEVBb0hEO0FBQUEsWUFBYyxTQUFkLHVFQUFBLENBQUE7QUFDUixZQUFBLENBQUE7QUFBQSxRQUFBLENBQUEsR0FBSSxLQUFBLFdBQUEsQ0FBQSxLQUFBLEVBQW9CLENBQXBCLE1BQW9CLENBQXBCLEVBQUEsU0FBQSxDQUFKOztBQUNBLFlBQUEsQ0FBQSxFQUFBO2lCQUFBLENBQUMsQ0FBRCxHOztBQUZRO0FBcEhDO0FBQUE7QUFBQSxrQ0F3SEUsS0F4SEYsRUF3SEUsT0F4SEYsRUF3SEU7QUFBQSxZQUFlLFNBQWYsdUVBQUEsQ0FBQTtBQUNYLGVBQU8sS0FBQyxNQUFELENBQUEsV0FBQSxDQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsU0FBQSxDQUFQO0FBRFc7QUF4SEY7QUFBQTtBQUFBLHVDQTJITyxRQTNIUCxFQTJITyxPQTNIUCxFQTJITyxPQTNIUCxFQTJITztBQUFBLFlBQTBCLFNBQTFCLHVFQUFBLENBQUE7QUFDaEIsWUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxRQUFOO0FBQ0EsUUFBQSxNQUFBLEdBQVMsQ0FBVDs7QUFDQSxlQUFNLENBQUEsR0FBSSxLQUFBLFdBQUEsQ0FBQSxHQUFBLEVBQWlCLENBQUEsT0FBQSxFQUFqQixPQUFpQixDQUFqQixFQUFWLFNBQVUsQ0FBVixFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFELEdBQUEsSUFBWSxTQUFBLEdBQUgsQ0FBRyxHQUFtQixDQUFDLENBQUMsR0FBRixDQUF0QixNQUFHLEdBQUosQ0FBUixDQUFOOztBQUNBLGNBQUcsQ0FBQyxDQUFELEdBQUEsTUFBYSxTQUFBLEdBQUgsQ0FBRyxHQUFILE9BQUcsR0FBaEIsT0FBRyxDQUFILEVBQUE7QUFDRSxnQkFBRyxNQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0UsY0FBQSxNQURGO0FBQUEsYUFBQSxNQUFBO0FBR0UscUJBSEYsQ0FHRTtBQUpKO0FBQUEsV0FBQSxNQUFBO0FBTUUsWUFBQSxNQU5GOztBQUZGOztlQVNBLEk7QUFaZ0I7QUEzSFA7QUFBQTtBQUFBLGlDQXdJQyxHQXhJRCxFQXdJQztBQUNWLFlBQUEsWUFBQTtBQUFBLFFBQUEsR0FBQSxHQUFNLElBQUEsNEJBQUEsQ0FBQSxHQUFBLENBQU47QUFDQSxRQUFBLFlBQUEsR0FBZSxHQUFHLENBQUgsSUFBQSxDQUFTLEtBQVQsT0FBQSxFQUFrQixLQUFsQixPQUFBLEVBQUEsR0FBQSxDQUFpQyxVQUFBLENBQUEsRUFBQTtpQkFBSyxDQUFDLENBQUQsYUFBQSxFO0FBQXRDLFNBQUEsQ0FBZjtlQUNBLEtBQUMsTUFBRCxDQUFBLGlCQUFBLENBQUEsWUFBQSxDO0FBSFU7QUF4SUQ7QUFBQTtBQUFBLHVDQTRJTyxVQTVJUCxFQTRJTztBQUNoQixZQUF3QixLQUFBLFlBQUEsSUFBeEIsSUFBQSxFQUFBO0FBQUEsZUFBQyxZQUFELENBQUEsSUFBQTs7O2VBQ0EsS0FBQSxZQUFBLEdBQWdCLDJCQUFBLE1BQUEsQ0FBQSxJQUFBLEVBQUEsVUFBQSxFQUZBLEtBRUEsRSxDQUZBLENBQUE7QUFBQTtBQTVJUDtBQUFBO0FBQUEsaUNBK0lEO0FBQUEsWUFBQyxTQUFELHVFQUFBLElBQUE7QUFDUixZQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQTs7QUFBQSxZQUFHLEtBQUEsTUFBQSxHQUFILEdBQUEsRUFBQTtBQUNFLGdCQURGLDRCQUNFOzs7QUFDRixRQUFBLEdBQUEsR0FBTSxDQUFOOztBQUNBLGVBQU0sR0FBQSxHQUFNLEtBQUEsT0FBQSxDQUFaLEdBQVksQ0FBWixFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFILFNBQUEsRUFBTjtBQUNBLGVBQUMsTUFBRCxDQUFBLFlBQUEsQ0FEQSxHQUNBLEVBRkYsQzs7QUFJRSxVQUFBLEdBQUcsQ0FBSCxJQUFBOztBQUNBLGNBQUcsU0FBQSxJQUFjLEdBQUEsQ0FBQSxPQUFBLElBQWQsSUFBQSxLQUFpQyxHQUFBLENBQUEsTUFBQSxNQUFELElBQUMsSUFBaUIsQ0FBQyxHQUFHLENBQUgsU0FBQSxDQUF0RCxpQkFBc0QsQ0FBbkQsQ0FBSCxFQUFBO0FBQ0UsWUFBQSxNQUFBLEdBQVMsSUFBQSxRQUFBLENBQWEsSUFBQSxzQkFBQSxDQUFlLEdBQUcsQ0FBL0IsT0FBYSxDQUFiLEVBQTBDO0FBQUMsY0FBQSxNQUFBLEVBQVE7QUFBVCxhQUExQyxDQUFUO0FBQ0EsWUFBQSxHQUFHLENBQUgsT0FBQSxHQUFjLE1BQU0sQ0FGdEIsUUFFZ0IsRUFBZDs7O0FBQ0YsY0FBRyxHQUFBLENBQUEsT0FBQSxNQUFILElBQUEsRUFBQTtBQUNFLGdCQUFHLEdBQUEsQ0FBQSxVQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsY0FBQSxHQUFBLEdBQU0sR0FBRyxDQURYLFVBQ0U7QUFERixhQUFBLE1BQUE7QUFHRSxjQUFBLEdBQUEsR0FBTSxLQUFDLE1BQUQsQ0FBQSxZQUFBLEdBSFIsR0FHRTtBQUpKOztBQVJGOztBQWFBLGVBQU8sS0FBQSxPQUFBLEVBQVA7QUFqQlE7QUEvSUM7QUFBQTtBQUFBLGdDQWlLRjtBQUNQLGVBQU8sS0FBQyxNQUFELENBQUEsSUFBQSxFQUFQO0FBRE87QUFqS0U7QUFBQTtBQUFBLCtCQW1LSDtBQUNOLGVBQVEsS0FBQSxNQUFBLElBQUQsSUFBQyxLQUFlLEtBQUEsVUFBQSxJQUFELElBQUMsSUFBaUIsS0FBQSxVQUFBLENBQUEsTUFBQSxJQUFuQixJQUFiLENBQVI7QUFETTtBQW5LRztBQUFBO0FBQUEsZ0NBcUtGO0FBQ1AsWUFBRyxLQUFILE1BQUEsRUFBQTtBQUNFLGlCQURGLElBQ0U7QUFERixTQUFBLE1BRUssSUFBRyxLQUFBLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDSCxpQkFBTyxLQUFDLE1BQUQsQ0FESixPQUNJLEVBQVA7QUFERyxTQUFBLE1BRUEsSUFBRyxLQUFBLFVBQUEsSUFBSCxJQUFBLEVBQUE7QUFDSCxpQkFBTyxLQUFDLFVBQUQsQ0FBWSxRQUFaLENBREosT0FDSSxFQUFQOztBQU5LO0FBcktFO0FBQUE7QUFBQSxtQ0E0S0csR0E1S0gsRUE0S0c7QUFDWixlQUFPLDJCQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQThCLEtBQTlCLFVBQUEsQ0FBUDtBQURZO0FBNUtIO0FBQUE7QUFBQSxtQ0E4S0csR0E5S0gsRUE4S0c7QUFDWixlQUFPLDJCQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQThCLEtBQTlCLFVBQUEsQ0FBUDtBQURZO0FBOUtIO0FBQUE7QUFBQSxrQ0FnTEE7QUFBQSxZQUFDLEtBQUQsdUVBQUEsR0FBQTtBQUFBO0FBQ1QsZUFBTyxJQUFBLE1BQUEsQ0FBVywyQkFBQSxZQUFBLENBQTBCLEtBQXJDLE1BQVcsQ0FBWCxFQUFBLEtBQUEsQ0FBUDtBQURTO0FBaExBO0FBQUE7QUFBQSxvQ0FrTEksSUFsTEosRUFrTEk7QUFDYixlQUFPLElBQUksQ0FBSixPQUFBLENBQWEsS0FBYixTQUFhLEVBQWIsRUFETSxFQUNOLENBQVAsQ0FEYSxDQUFBO0FBQUE7QUFsTEo7QUFBQTtBQUFBLDZCQXFMSjtBQUNMLFlBQUEsQ0FBTyxLQUFQLE1BQUEsRUFBQTtBQUNFLGVBQUEsTUFBQSxHQUFVLElBQVY7O0FBQ0EsMkJBQUEsUUFBQTs7aUJBQ0EsaUJBSEYsUUFHRSxFOztBQUpHO0FBckxJOztBQUFBO0FBQUE7O0FBQU47QUEyTEwsRUFBQSxRQUFDLENBQUQsTUFBQSxHQUFTLEtBQVQ7O0NBM0xXLEMsSUFBQSxRQUFiOzs7Ozs7Ozs7Ozs7QUNUQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUZBLElBQUEsT0FBQTs7QUFLQSxPQUFBLEdBQVUsaUJBQUEsR0FBQSxFQUFBLElBQUEsRUFBQTtBQUFBLE1BQVUsTUFBVix1RUFBQSxJQUFBOzs7QUFFRCxNQUFHLEdBQUEsSUFBSCxJQUFBLEVBQUE7V0FBb0IsSUFBSyxDQUF6QixHQUF5QixDO0FBQXpCLEdBQUEsTUFBQTtXQUFBLE07O0FBRkMsQ0FBVjs7QUFLQSxJQUFhLE9BQUEsR0FBQSxZQUFBO0FBQUEsTUFBTixPQUFNO0FBQUE7QUFBQTtBQUNYLHFCQUFhLEtBQWIsRUFBYTtBQUFBLFVBQUEsS0FBQSx1RUFBQSxJQUFBO0FBQUEsVUFBQSxPQUFBLHVFQUFBLElBQUE7O0FBQUE7O0FBQUMsV0FBQyxJQUFELEdBQUMsS0FBRDtBQUFNLFdBQUMsSUFBRCxHQUFDLEtBQUQ7QUFBVyxXQUFDLE1BQUQsR0FBQyxPQUFEO0FBQzdCLFdBQUEsSUFBQSxHQUFRLEVBQVI7QUFDQSxXQUFBLFNBQUEsR0FBYSxFQUFiO0FBQ0EsV0FBQSxZQUFBLEdBQWdCLEtBQUEsV0FBQSxHQUFlLEtBQUEsU0FBQSxHQUFhLEtBQUEsT0FBQSxHQUFXLEtBQUEsR0FBQSxHQUFPLElBQTlEO0FBQ0EsV0FBQSxPQUFBLEdBQVcsSUFBWDtBQUNBLFdBQUEsUUFBQSxHQUFZLEtBQUMsSUFBYjtBQUNBLFdBQUEsS0FBQSxHQUFTLENBQVQ7QUFOVyxpQkFPWSxDQUFBLElBQUEsRUFBQSxLQUFBLENBUFo7QUFPVixXQUFELE9BUFc7QUFPQSxXQUFYLE9BUFc7QUFRWCxXQUFBLFNBQUEsQ0FBQSxNQUFBO0FBQ0EsV0FBQSxRQUFBLEdBQVksRUFBWjtBQUVBLFdBQUEsY0FBQSxHQUFrQjtBQUNoQixRQUFBLFdBQUEsRUFEZ0IsSUFBQTtBQUVoQixRQUFBLFdBQUEsRUFGZ0IsSUFBQTtBQUdoQixRQUFBLEtBQUEsRUFIZ0IsS0FBQTtBQUloQixRQUFBLGFBQUEsRUFKZ0IsSUFBQTtBQUtoQixRQUFBLFdBQUEsRUFMZ0IsSUFBQTtBQU1oQixRQUFBLGVBQUEsRUFOZ0IsS0FBQTtBQU9oQixRQUFBLFVBQUEsRUFBWTtBQVBJLE9BQWxCO0FBU0EsV0FBQSxPQUFBLEdBQVcsRUFBWDtBQUNBLFdBQUEsWUFBQSxHQUFnQixJQUFoQjtBQXJCVzs7QUFERjtBQUFBO0FBQUEsK0JBdUJIO0FBQ04sZUFBTyxLQUFDLE9BQVI7QUFETTtBQXZCRztBQUFBO0FBQUEsZ0NBeUJBLEtBekJBLEVBeUJBO0FBQ1QsWUFBRyxLQUFBLE9BQUEsS0FBSCxLQUFBLEVBQUE7QUFDRSxlQUFBLE9BQUEsR0FBVyxLQUFYO0FBQ0EsZUFBQSxRQUFBLEdBQ0ssS0FBQSxPQUFBLElBQUEsSUFBQSxJQUFjLEtBQUEsT0FBQSxDQUFBLElBQUEsSUFBakIsSUFBRyxHQUNELEtBQUMsT0FBRCxDQUFBLFFBQUEsR0FBQSxHQUFBLEdBQTBCLEtBRDVCLElBQUcsR0FHRCxLQUpRLElBQVo7aUJBTUEsS0FBQSxLQUFBLEdBQ0ssS0FBQSxPQUFBLElBQUEsSUFBQSxJQUFjLEtBQUEsT0FBQSxDQUFBLEtBQUEsSUFBakIsSUFBRyxHQUNFLEtBQUMsT0FBRCxDQUFBLEtBQUEsR0FETCxDQUFHLEdBVFAsQzs7QUFEUztBQXpCQTtBQUFBO0FBQUEsNkJBdUNMO0FBQ0osWUFBRyxDQUFDLEtBQUosT0FBQSxFQUFBO0FBQ0UsZUFBQSxPQUFBLEdBQVcsSUFBWDtBQUNBLGVBQUEsU0FBQSxDQUFXLEtBRmIsSUFFRTs7O0FBQ0YsZUFBTyxJQUFQO0FBSkk7QUF2Q0s7QUFBQTtBQUFBLG1DQTRDQztlQUNWLEtBQUMsT0FBRCxDQUFBLFNBQUEsQ0FBQSxJQUFBLEM7QUFEVTtBQTVDRDtBQUFBO0FBQUEsbUNBOENDO0FBQ1YsZUFBTyxLQUFBLFNBQUEsSUFBQSxJQUFBLElBQWUsS0FBQSxPQUFBLElBQUEsSUFBdEI7QUFEVTtBQTlDRDtBQUFBO0FBQUEscUNBZ0RHO0FBQ1osWUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQTtBQUFBLFFBQUEsT0FBQSxHQUFVLEtBQUEsVUFBQSxFQUFWOztBQUNBLFlBQUcsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLE9BQU8sQ0FBUCxJQUFBLEdBRFQsWUFDUyxFQUFQOzs7QUFDRixRQUFBLEdBQUEsR0FBQSxDQUFBLFdBQUEsRUFBQSxhQUFBLEVBQUEsS0FBQSxFQUFBLGNBQUEsQ0FBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7O0FBQ0UsY0FBRyxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxtQkFERixJQUNFOztBQUZKOztBQUdBLGVBQU8sS0FBUDtBQVBZO0FBaERIO0FBQUE7QUFBQSwyQ0F3RFcsSUF4RFgsRUF3RFc7QUFDcEIsWUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUE7O0FBQUEsWUFBRyxLQUFBLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLE9BQUEsR0FBVSxJQUFBLGdCQUFBLEVBQVY7QUFDQSxVQUFBLE9BQUEsR0FBVSxLQUFDLE9BQUQsQ0FBQSxPQUFBLENBQUEsUUFBQSxFQUFBLElBQUEsQ0FBVjtBQUNBLFVBQUEsT0FBQSxHQUFVLEtBQUEsa0JBQUEsQ0FBb0IsT0FBTyxDQUFQLFNBQUEsQ0FBcEIsT0FBb0IsQ0FBcEIsQ0FBVjs7QUFDQSxjQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxtQkFBTyxPQUFPLENBQVAsSUFBQSxHQURULFlBQ1MsRUFBUDs7O0FBQ0YsaUJBTkYsS0FNRTs7O0FBQ0YsZUFBTyxLQUFBLFlBQUEsRUFBUDtBQVJvQjtBQXhEWDtBQUFBO0FBQUEsMENBaUVRO0FBQ2pCLFlBQUEsT0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUE7QUFBQSxRQUFBLE9BQUEsR0FBVSxLQUFBLFVBQUEsRUFBVjs7QUFDQSxZQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxPQUFPLENBRGhCLGlCQUNTLEVBQVA7OztBQUNGLFFBQUEsR0FBQSxHQUFBLENBQUEsV0FBQSxFQUFBLGFBQUEsQ0FBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7O0FBQ0UsY0FBRyxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxtQkFERixJQUNFOztBQUZKOztBQUdBLGVBQU8sS0FBUDtBQVBpQjtBQWpFUjtBQUFBO0FBQUEsb0NBeUVFO0FBQ1gsWUFBQSxPQUFBLEVBQUEsR0FBQTtBQUFBLFFBQUEsR0FBQSxHQUFNLEVBQU47QUFDQSxRQUFBLE9BQUEsR0FBVSxLQUFBLFVBQUEsRUFBVjs7QUFDQSxZQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsT0FBTyxDQURqQyxXQUMwQixFQUFsQixDQUFOOzs7QUFDRixRQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsS0FBbEIsUUFBQSxDQUFOO0FBQ0EsZUFBTyxHQUFQO0FBTlc7QUF6RUY7QUFBQTtBQUFBLHlDQWdGUyxNQWhGVCxFQWdGUztBQUNoQixRQUFBLE1BQU0sQ0FBTixZQUFBLEdBQXNCLEtBQXRCO0FBQ0EsUUFBQSxNQUFNLENBQU4sV0FBQSxHQUFxQixLQUFyQjtBQUNBLFFBQUEsTUFBTSxDQUFOLFlBQUEsR0FBc0IsS0FBdEI7QUFDQSxlQUFPLE1BQU0sQ0FBTixJQUFBLEVBQVA7QUFKZ0I7QUFoRlQ7QUFBQTtBQUFBLG1DQXFGQztBQUNWLFlBQUEsT0FBQTs7QUFBQSxZQUFHLEtBQUEsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsT0FBQSxHQUFVLElBQUEsZ0JBQUEsRUFBVjtBQUNBLGlCQUFPLEtBQUEsa0JBQUEsQ0FBb0IsT0FBTyxDQUFQLFNBQUEsQ0FBa0IsS0FGL0MsT0FFNkIsQ0FBcEIsQ0FBUDs7QUFIUTtBQXJGRDtBQUFBO0FBQUEsaUNBeUZDLElBekZELEVBeUZDO0FBQ1YsWUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUE7QUFBQSxRQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGFBQUEsR0FBQSxJQUFBLElBQUEsRUFBQTs7O0FBQ0UsY0FBRyxHQUFBLElBQU8sS0FBVixjQUFBLEVBQUE7eUJBQ0UsS0FBQyxPQUFELENBQUEsR0FBQSxJQURGLEc7QUFBQSxXQUFBLE1BQUE7OEJBQUEsQzs7QUFERjs7O0FBRFU7QUF6RkQ7QUFBQTtBQUFBLHlDQTZGUyxPQTdGVCxFQTZGUztBQUNsQixZQUFBLEdBQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxFQUFOO0FBQ0EsUUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFOLE1BQUEsQ0FBQSxHQUFBLEVBQWtCLEtBQWxCLGNBQUEsQ0FBTjs7QUFDQSxZQUFHLE9BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sTUFBQSxDQUFBLEdBQUEsRUFBa0IsT0FBTyxDQURqQyxVQUMwQixFQUFsQixDQUFOOzs7QUFDRixlQUFPLE1BQU0sQ0FBTixNQUFBLENBQUEsR0FBQSxFQUFrQixLQUFsQixPQUFBLENBQVA7QUFMa0I7QUE3RlQ7QUFBQTtBQUFBLG1DQW1HQztBQUNWLGVBQU8sS0FBQSxrQkFBQSxDQUFvQixLQUFwQixVQUFvQixFQUFwQixDQUFQO0FBRFU7QUFuR0Q7QUFBQTtBQUFBLGdDQXFHQSxHQXJHQSxFQXFHQTtBQUNULFlBQUEsT0FBQTtBQUFBLFFBQUEsT0FBQSxHQUFVLEtBQUEsVUFBQSxFQUFWOztBQUNBLFlBQUcsR0FBQSxJQUFILE9BQUEsRUFBQTtBQUNFLGlCQUFPLE9BQVEsQ0FEakIsR0FDaUIsQ0FBZjs7QUFITztBQXJHQTtBQUFBO0FBQUEsNkJBeUdMO0FBQ0osWUFBQSxHQUFBO0FBQUEsUUFBQSxHQUFBLEdBQU0sS0FBQSxNQUFBLENBQUEsTUFBQSxDQUFOOztBQUNBLFlBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLEdBQUcsQ0FBSCxJQUFBLEdBRFQsU0FDRTs7QUFIRTtBQXpHSztBQUFBO0FBQUEsZ0NBNkdBLElBN0dBLEVBNkdBO0FBQ1QsYUFBQSxJQUFBLEdBQVEsSUFBUjs7QUFDQSxZQUFHLE9BQUEsSUFBQSxLQUFILFFBQUEsRUFBQTtBQUNFLGVBQUEsU0FBQSxHQUFhLElBQWI7QUFDQSxlQUFDLE9BQUQsQ0FBQSxPQUFBLElBQW9CLElBQXBCO0FBQ0EsaUJBSEYsSUFHRTtBQUhGLFNBQUEsTUFJSyxJQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDSCxpQkFBTyxLQUFBLGFBQUEsQ0FESixJQUNJLENBQVAsQ0FERyxDQUFBOzs7QUFFTCxlQUFPLEtBQVA7QUFSUztBQTdHQTtBQUFBO0FBQUEsb0NBc0hJLElBdEhKLEVBc0hJO0FBQ2IsWUFBQSxPQUFBLEVBQUEsR0FBQTtBQUFBLFFBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBQSxRQUFBLEVBQUEsSUFBQSxDQUFOOztBQUNBLFlBQUcsT0FBQSxHQUFBLEtBQUgsVUFBQSxFQUFBO0FBQ0UsZUFBQSxXQUFBLEdBREYsR0FDRTtBQURGLFNBQUEsTUFFSyxJQUFHLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDSCxlQUFBLFNBQUEsR0FBYSxHQUFiO0FBQ0EsZUFBQyxPQUFELENBQUEsT0FBQSxJQUZHLElBRUg7OztBQUNGLFFBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBQSxTQUFBLEVBQUEsSUFBQSxDQUFWOztBQUNBLFlBQUcsT0FBQSxPQUFBLEtBQUgsVUFBQSxFQUFBO0FBQ0UsZUFBQSxZQUFBLEdBREYsT0FDRTs7O0FBQ0YsYUFBQSxPQUFBLEdBQVcsT0FBQSxDQUFBLFNBQUEsRUFBQSxJQUFBLENBQVg7QUFDQSxhQUFBLEdBQUEsR0FBTyxPQUFBLENBQUEsS0FBQSxFQUFBLElBQUEsQ0FBUDtBQUNBLGFBQUEsUUFBQSxHQUFZLE9BQUEsQ0FBQSxVQUFBLEVBQUEsSUFBQSxFQUF3QixLQUF4QixRQUFBLENBQVo7QUFFQSxhQUFBLFVBQUEsQ0FBQSxJQUFBOztBQUVBLFlBQUcsVUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFBLE1BQUEsQ0FBUSxJQUFBLE9BQUEsQ0FBQSxNQUFBLEVBQW1CLElBQUssQ0FBeEIsTUFBd0IsQ0FBeEIsRUFEVixJQUNVLENBQVI7OztBQUNGLFlBQUcsY0FBSCxJQUFBLEVBQUE7QUFDRSxlQUFBLE1BQUEsQ0FBUSxJQUFBLE9BQUEsQ0FBQSxVQUFBLEVBQXVCLElBQUssQ0FBNUIsVUFBNEIsQ0FBNUIsRUFEVixJQUNVLENBQVI7OztBQUVGLFlBQUcsVUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFBLE9BQUEsQ0FBUyxJQUFLLENBRGhCLE1BQ2dCLENBQWQ7OztBQUNGLGVBQU8sSUFBUDtBQXZCYTtBQXRISjtBQUFBO0FBQUEsOEJBOElGLElBOUlFLEVBOElGO0FBQ1AsWUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGFBQUEsSUFBQSxJQUFBLElBQUEsRUFBQTs7dUJBQ0UsS0FBQSxNQUFBLENBQVEsSUFBQSxPQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBUixJQUFRLENBQVIsQztBQURGOzs7QUFETztBQTlJRTtBQUFBO0FBQUEsNkJBaUpILEdBakpHLEVBaUpIO0FBQ04sWUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsS0FBQSxNQUFBLENBQVEsR0FBRyxDQUFYLElBQUEsQ0FBVDs7QUFDQSxZQUFHLE1BQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFBLFNBQUEsQ0FERixNQUNFOzs7QUFDRixRQUFBLEdBQUcsQ0FBSCxTQUFBLENBQUEsSUFBQTtBQUNBLGFBQUMsSUFBRCxDQUFBLElBQUEsQ0FBQSxHQUFBO0FBQ0EsZUFBTyxHQUFQO0FBTk07QUFqSkc7QUFBQTtBQUFBLGdDQXdKQSxHQXhKQSxFQXdKQTtBQUNULFlBQUEsQ0FBQTs7QUFBQSxZQUFHLENBQUMsQ0FBQSxHQUFJLEtBQUMsSUFBRCxDQUFBLE9BQUEsQ0FBTCxHQUFLLENBQUwsSUFBMkIsQ0FBOUIsQ0FBQSxFQUFBO0FBQ0UsZUFBQyxJQUFELENBQUEsTUFBQSxDQUFBLENBQUEsRUFERixDQUNFOzs7QUFDRixlQUFPLEdBQVA7QUFIUztBQXhKQTtBQUFBO0FBQUEsNkJBNEpILFFBNUpHLEVBNEpIO0FBQ04sWUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUE7QUFBQSxhQUFBLElBQUE7O0FBRE0sb0NBRVMsaUNBQUEsVUFBQSxDQUFBLFFBQUEsQ0FGVDs7QUFBQTs7QUFFTixRQUFBLEtBRk07QUFFTixRQUFBLElBRk07O0FBR04sWUFBRyxLQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQU8sS0FBQSxNQUFBLENBQUEsS0FBQSxFQUFBLE1BQUEsQ0FEVCxJQUNTLENBQVA7OztBQUNGLFFBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7O0FBQ0UsY0FBRyxHQUFHLENBQUgsSUFBQSxLQUFILElBQUEsRUFBQTtBQUNFLG1CQURGLEdBQ0U7O0FBRko7QUFMTTtBQTVKRztBQUFBO0FBQUEsaUNBb0tDLFFBcEtELEVBb0tDLElBcEtELEVBb0tDO2VBQ1YsS0FBQSxNQUFBLENBQUEsUUFBQSxFQUFpQixJQUFBLE9BQUEsQ0FBWSxRQUFRLENBQVIsS0FBQSxDQUFBLEdBQUEsRUFBWixHQUFZLEVBQVosRUFBakIsSUFBaUIsQ0FBakIsQztBQURVO0FBcEtEO0FBQUE7QUFBQSw2QkFzS0gsUUF0S0csRUFzS0gsR0F0S0csRUFzS0g7QUFDTixZQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQTs7QUFETSxxQ0FDUyxpQ0FBQSxVQUFBLENBQUEsUUFBQSxDQURUOztBQUFBOztBQUNOLFFBQUEsS0FETTtBQUNOLFFBQUEsSUFETTs7QUFFTixZQUFHLEtBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxLQUFBLE1BQUEsQ0FBQSxLQUFBLENBQVA7O0FBQ0EsY0FBTyxJQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsWUFBQSxJQUFBLEdBQU8sS0FBQSxNQUFBLENBQVEsSUFBQSxPQUFBLENBRGpCLEtBQ2lCLENBQVIsQ0FBUDs7O0FBQ0YsaUJBQU8sSUFBSSxDQUFKLE1BQUEsQ0FBQSxJQUFBLEVBSlQsR0FJUyxDQUFQO0FBSkYsU0FBQSxNQUFBO0FBTUUsZUFBQSxNQUFBLENBQUEsR0FBQTtBQUNBLGlCQVBGLEdBT0U7O0FBVEk7QUF0S0c7QUFBQTtBQUFBLGtDQWdMRSxRQWhMRixFQWdMRTtlQUNYLEtBQUMsU0FBRCxDQUFBLElBQUEsQ0FBQSxRQUFBLEM7QUFEVztBQWhMRjtBQUFBO0FBQUEsaUNBcUxBO0FBQ1QsWUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQTtBQUFBLFFBQUEsT0FBTyxDQUFQLElBQUEsR0FBZSxJQUFBLE9BQUEsQ0FBQSxJQUFBLEVBQWlCO0FBQzlCLGtCQUFPO0FBQ0wscUJBQVE7QUFDTixjQUFBLElBQUEsRUFETSxpTkFBQTtBQU1OLGNBQUEsTUFBQSxFQUFRO0FBTkY7QUFESDtBQUR1QixTQUFqQixDQUFmO0FBWUEsUUFBQSxHQUFBLEdBQUEsS0FBQSxTQUFBO0FBQUEsUUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7dUJBQ0UsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsT0FBTyxDQUF6QixJQUFBLEM7QUFERjs7O0FBYlM7QUFyTEE7QUFBQTtBQUFBLDhCQXFNRCxRQXJNQyxFQXFNRCxJQXJNQyxFQXFNRDtBQUNSLFlBQUEsU0FBQSxFQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBVSxJQUFBLGdCQUFBLEVBQVY7QUFDQSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQUEsVUFBQSxDQUFBLFFBQUEsRUFBQSxJQUFBO0FBQ0EsUUFBQSxTQUFBLEdBQVksT0FBTyxDQUFQLElBQUEsQ0FBQSxNQUFBLENBQVo7O0FBQ0EsWUFBTyxTQUFBLElBQVAsSUFBQSxFQUFBO0FBQ0UsVUFBQSxTQUFBLEdBREYsRUFDRTs7O0FBQ0YsUUFBQSxTQUFVLENBQVYsUUFBVSxDQUFWLEdBQXNCLElBQXRCO2VBQ0EsT0FBTyxDQUFQLElBQUEsQ0FBQSxNQUFBLEVBQUEsU0FBQSxDO0FBUFE7QUFyTUM7QUFBQTtBQUFBLGlDQThNQTtBQUNULFlBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxPQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBVSxJQUFBLGdCQUFBLEVBQVY7QUFDQSxRQUFBLFNBQUEsR0FBWSxPQUFPLENBQVAsSUFBQSxDQUFBLE1BQUEsQ0FBWjs7QUFDQSxZQUFHLFNBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGVBQUEsUUFBQSxJQUFBLFNBQUEsRUFBQTs7eUJBQ0UsT0FBTyxDQUFDLElBQVIsQ0FBQSxVQUFBLENBQUEsUUFBQSxFQUFBLElBQUEsQztBQURGOztpQkFERixPOztBQUhTO0FBOU1BO0FBQUE7QUFBQSxtQ0FxTkU7QUFDWCxZQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBVSxJQUFBLGdCQUFBLEVBQVY7ZUFDQSxPQUFPLENBQVAsSUFBQSxDQUFBLE1BQUEsRUFBQSxFQUFBLEM7QUFGVztBQXJORjtBQUFBO0FBQUEsaUNBeU5HLElBek5ILEVBeU5HO0FBQUEsWUFBTSxJQUFOLHVFQUFBLEVBQUE7O0FBQ1osUUFBQSxJQUFJLENBQUosT0FBQSxHQUFlLFVBQUEsUUFBQSxFQUFBO0FBQ2IsY0FBQSxDQUFBLEVBQUEsR0FBQTtBQUFBLFVBQUEsR0FBQSxHQUFTLENBQUEsQ0FBQSxHQUFBLFFBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUgsSUFBRyxHQUFILENBQUcsR0FFRCxRQUFRLENBQVgsT0FBRyxHQUNOLFFBQVEsQ0FETCxPQUFHLEdBQUgsS0FBQSxDQUZMOztBQUlBLGNBQXNDLEdBQUEsSUFBdEMsSUFBQSxFQUFBO21CQUFBLFFBQVEsQ0FBQyxRQUFULENBQWtCLElBQWxCLENBQUEsSUFBQSxJQUFBLEc7O0FBTGEsU0FBZjs7QUFNQSxlQUFPLElBQVA7QUFQWTtBQXpOSDtBQUFBO0FBQUEscUNBa09PLElBbE9QLEVBa09PO0FBQUEsWUFBTSxJQUFOLHVFQUFBLEVBQUE7O0FBQ2hCLFFBQUEsSUFBSSxDQUFKLE9BQUEsR0FBZSxVQUFBLFFBQUEsRUFBQTtBQUNiLGNBQUEsQ0FBQSxFQUFBLEdBQUE7QUFBQSxVQUFBLEdBQUEsR0FBUyxDQUFBLENBQUEsR0FBQSxRQUFBLENBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQSxLQUFILElBQUcsR0FBSCxDQUFHLEdBRUQsUUFBUSxDQUFYLE9BQUcsR0FDTixRQUFRLENBREwsT0FBRyxHQUFILEtBQUEsQ0FGTDs7QUFJQSxjQUFBLEVBQU8sR0FBQSxJQUFBLElBQUEsS0FBUyxHQUFBLEtBQUEsR0FBQSxJQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsR0FBQSxLQUFoQixJQUFPLENBQVAsQ0FBQSxFQUFBO21CQUNFLFFBQVEsQ0FBQyxRQUFULENBQWtCLElBQWxCLENBQUEsSUFBQSxJQURGLEk7O0FBTGEsU0FBZjs7QUFPQSxlQUFPLElBQVA7QUFSZ0I7QUFsT1A7O0FBQUE7QUFBQTs7QUFBTjtBQW1MTCxFQUFBLE9BQUMsQ0FBRCxTQUFBLEdBQWEsRUFBYjs7Q0FuTFcsQyxJQUFBLFFBQWI7Ozs7QUE2T0EsSUFBYSxXQUFOO0FBQUE7QUFBQTtBQUNMLHVCQUFhLFNBQWIsRUFBYTtBQUFBOztBQUFDLFNBQUMsUUFBRCxHQUFDLFNBQUQ7QUFBRDs7QUFEUjtBQUFBO0FBQUEsMkJBRUMsQ0FBQTtBQUZEO0FBQUE7QUFBQSx3Q0FJYztBQUNqQixhQUFPLEtBQUEsUUFBQSxLQUFBLElBQVA7QUFEaUI7QUFKZDtBQUFBO0FBQUEsa0NBTVE7QUFDWCxhQUFPLEVBQVA7QUFEVztBQU5SO0FBQUE7QUFBQSxpQ0FRTztBQUNWLGFBQU8sRUFBUDtBQURVO0FBUlA7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7QUN2UEE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRkEsSUFBQSxPQUFBLEdBQUEsR0FBQSxPQUFBOztBQUlBLElBQWEsT0FBTjtBQUFBO0FBQUE7QUFDTCxtQkFBYSxRQUFiLEVBQWE7QUFBQTs7QUFBQyxTQUFDLFFBQUQsR0FBQyxRQUFEO0FBQ1osU0FBQSxVQUFBLEdBQWMsRUFBZDtBQURXOztBQURSO0FBQUE7QUFBQSxpQ0FJUyxJQUpULEVBSVM7QUFDWixVQUFHLE9BQUEsQ0FBQSxJQUFBLENBQVksS0FBWixVQUFBLEVBQUEsSUFBQSxJQUFILENBQUEsRUFBQTtBQUNFLGFBQUMsVUFBRCxDQUFBLElBQUEsQ0FBQSxJQUFBO2VBQ0EsS0FBQSxXQUFBLEdBRkYsSTs7QUFEWTtBQUpUO0FBQUE7QUFBQSxrQ0FRVSxNQVJWLEVBUVU7QUFDYixVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7O0FBQUEsVUFBQSxNQUFBLEVBQUE7QUFDRSxZQUFHLE9BQUEsTUFBQSxLQUFILFFBQUEsRUFBQTtBQUNFLFVBQUEsTUFBQSxHQUFTLENBRFgsTUFDVyxDQUFUOzs7QUFDRixRQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLGFBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBOzt1QkFDRSxLQUFBLFlBQUEsQ0FBQSxLQUFBLEM7QUFERjs7ZUFIRixPOztBQURhO0FBUlY7QUFBQTtBQUFBLG9DQWNZLElBZFosRUFjWTthQUNmLEtBQUEsVUFBQSxHQUFjLEtBQUMsVUFBRCxDQUFBLE1BQUEsQ0FBbUIsVUFBQSxDQUFBLEVBQUE7ZUFBTyxDQUFBLEtBQU8sSTtBQUFqQyxPQUFBLEM7QUFEQztBQWRaO0FBQUE7QUFBQSxvQ0FpQlU7QUFDYixVQUFBLElBQUE7O0FBQUEsVUFBTyxLQUFBLFdBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxDQUFBLE1BQUEsRUFBQSxNQUFBLENBQWdCLEtBQWhCLFVBQUEsQ0FBUDs7QUFDQSxZQUFHLEtBQUEsTUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsSUFBQSxHQUFPLElBQUksQ0FBSixNQUFBLENBQVksS0FBQyxNQUFELENBRHJCLGFBQ3FCLEVBQVosQ0FBUDs7O0FBQ0YsYUFBQSxXQUFBLEdBQWUseUJBQUEsTUFBQSxDQUpqQixJQUlpQixDQUFmOzs7QUFDRixhQUFPLEtBQUMsV0FBUjtBQU5hO0FBakJWO0FBQUE7QUFBQSwyQkF3QkcsT0F4QkgsRUF3Qkc7QUFBQSxVQUFTLFVBQVQsdUVBQUEsRUFBQTtBQUNOLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEtBQUEsU0FBQSxDQUFBLE9BQUEsRUFBQSxVQUFBLENBQVQ7QUFDQSxhQUFPLE1BQU0sQ0FBTixJQUFBLEVBQVA7QUFGTTtBQXhCSDtBQUFBO0FBQUEsOEJBMkJNLE9BM0JOLEVBMkJNO0FBQUEsVUFBUyxVQUFULHVFQUFBLEVBQUE7QUFDVCxhQUFPLElBQUEsb0JBQUEsQ0FBQSxPQUFBLEVBQXVCO0FBQzVCLFFBQUEsVUFBQSxFQUQ0QixVQUFBO0FBRTVCLFFBQUEsWUFBQSxFQUFjLEtBRmMsTUFFZCxFQUZjO0FBRzVCLFFBQUEsUUFBQSxFQUFVLEtBSGtCLFFBQUE7QUFJNUIsUUFBQSxhQUFBLEVBQWU7QUFKYSxPQUF2QixDQUFQO0FBRFM7QUEzQk47QUFBQTtBQUFBLDZCQWtDRztBQUNOLGFBQVEsS0FBQSxNQUFBLElBQUEsSUFBUjtBQURNO0FBbENIO0FBQUE7QUFBQSxnQ0FvQ1EsR0FwQ1IsRUFvQ1E7QUFDWCxVQUFBLEVBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxLQUFBLGNBQUEsRUFBTDs7QUFDQSxVQUFHLEVBQUUsQ0FBRixPQUFBLENBQUEsSUFBQSxJQUFtQixDQUF0QixDQUFBLEVBQUE7QUFDRSxlQUFPLEVBQUUsQ0FBRixPQUFBLENBQUEsSUFBQSxFQURULEdBQ1MsQ0FBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sRUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUhULEVBR0U7O0FBTFM7QUFwQ1I7QUFBQTtBQUFBLHNDQTBDWTtBQUFBLFVBQUMsR0FBRCx1RUFBQSxFQUFBO0FBQ2YsVUFBQSxFQUFBLEVBQUEsQ0FBQTtBQUFBLE1BQUEsRUFBQSxHQUFLLEtBQUEsY0FBQSxFQUFMOztBQUNBLFVBQUcsQ0FBQyxDQUFBLEdBQUksRUFBRSxDQUFGLE9BQUEsQ0FBTCxJQUFLLENBQUwsSUFBeUIsQ0FBNUIsQ0FBQSxFQUFBO0FBQ0UsZUFBTyxFQUFFLENBQUYsTUFBQSxDQUFBLENBQUEsRUFBQSxDQUFBLElBRFQsR0FDRTtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sRUFBQSxHQUFBLEdBQUEsR0FIVCxHQUdFOztBQUxhO0FBMUNaO0FBQUE7QUFBQSx1Q0FnRGE7QUFBQSxVQUFDLEdBQUQsdUVBQUEsRUFBQTtBQUNoQixVQUFBLEVBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssS0FBQSxjQUFBLEVBQUw7O0FBQ0EsVUFBRyxDQUFDLENBQUEsR0FBSSxFQUFFLENBQUYsT0FBQSxDQUFMLElBQUssQ0FBTCxJQUF5QixDQUE1QixDQUFBLEVBQUE7QUFDRSxlQUFPLEdBQUEsR0FBTSxFQUFFLENBQUYsTUFBQSxDQUFVLENBQUEsR0FEekIsQ0FDZSxDQUFiO0FBREYsT0FBQSxNQUFBO0FBR0UsZUFBTyxHQUFBLEdBQUEsR0FBQSxHQUhULEVBR0U7O0FBTGM7QUFoRGI7QUFBQTtBQUFBLG1DQXNEVyxHQXREWCxFQXNEVztBQUNkLGFBQU8sSUFBQSx3QkFBQSxDQUFBLEdBQUEsRUFBQSxJQUFBLENBQVA7QUFEYztBQXREWDtBQUFBO0FBQUEscUNBd0RXO0FBQ2QsVUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBOztBQUFBLFVBQUcsS0FBQSxXQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBTyxLQURULFdBQ0U7OztBQUNGLE1BQUEsR0FBQSxHQUFNLEtBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBTjtBQUNBLE1BQUEsS0FBQSxHQUFPLGFBQVA7O0FBQ0EsVUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sS0FBQSxjQUFBLENBQUEsR0FBQSxDQUFQO0FBQ0EsUUFBQSxJQUFJLENBQUosT0FBQSxHQUFlLElBQWY7QUFDQSxRQUFBLEdBQUEsR0FBTSxJQUFJLENBQUosTUFBQSxFQUFOOztBQUNBLFlBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsS0FBQSxHQURGLEdBQ0U7QUFMSjs7O0FBTUEsV0FBQSxXQUFBLEdBQWUsS0FBZjtBQUNBLGFBQU8sS0FBQyxXQUFSO0FBWmM7QUF4RFg7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7QUNEQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFhLFFBQU47QUFBQTtBQUFBO0FBQ0wsc0JBQWE7QUFBQSxRQUFBLElBQUEsdUVBQUEsRUFBQTs7QUFBQTs7QUFBQyxTQUFDLElBQUQsR0FBQyxJQUFEO0FBQUQ7O0FBRFI7QUFBQTtBQUFBLDJCQUVHLE1BRkgsRUFFRztBQUNOLFVBQUcsS0FBQSxRQUFBLENBQUgsTUFBRyxDQUFILEVBQUE7QUFDRSxZQUF1QixLQUFBLElBQUEsQ0FBQSxNQUFBLElBQXZCLElBQUEsRUFBQTtBQUFBLGlCQUFPLEtBQUMsSUFBRCxDQUFQLE1BQUE7QUFERjtBQUFBLE9BQUEsTUFBQTtBQUdFLFlBQXFCLEtBQUEsSUFBQSxZQUFyQixJQUFBLEVBQUE7QUFBQSxpQkFBTyxLQUFQLElBQU8sUUFBUDtBQUhGOztBQURNO0FBRkg7QUFBQTtBQUFBLDZCQU9LLE1BUEwsRUFPSyxDQUFBO0FBUEw7O0FBQUE7QUFBQSxHQUFQOzs7O0FBVUEsSUFBYSxZQUFOO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMkJBQ0csTUFESCxFQUNHO0FBQ04sVUFBQSxJQUFBOztBQUFBLFVBQUcsTUFBQSxDQUFBLFFBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsUUFBUCxDQUFnQixNQUFoQixDQUFBLE9BQUEsRUFBUDs7QUFDQSxZQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxJQUFJLENBRGIsV0FDUyxFQUFQO0FBSEo7O0FBRE07QUFESDs7QUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFQOzs7O0FBT0EsSUFBYSxZQUFOO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNkJBQ0ssTUFETCxFQUNLO0FBQ1IsVUFBQSxJQUFBOztBQUFBLFVBQUcsS0FBQSxJQUFBLENBQUEsTUFBQSxJQUFBLElBQUEsSUFBa0IsS0FBQSxJQUFBLENBQUEsTUFBQSxJQUFsQixJQUFBLElBQW9DLE1BQUEsQ0FBQSxRQUFBLElBQXZDLElBQUEsRUFBQTtBQUNFLFFBQUEsSUFBQSxHQUFPLElBQUEsVUFBQSxDQUFTLEtBQUMsSUFBRCxDQUFULE1BQUEsRUFBdUIsS0FBQyxJQUFELENBQXZCLE1BQUEsRUFBcUMsS0FBckMsSUFBQSxDQUFQOztBQUNBLFlBQUcsSUFBSSxDQUFKLFVBQUEsQ0FBZ0IsTUFBTSxDQUFDLFFBQVAsQ0FBaEIsTUFBZ0IsRUFBaEIsRUFBMEMsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsTUFBaEIsQ0FBN0MsSUFBNkMsRUFBMUMsQ0FBSCxFQUFBO0FBQ0UsaUJBREYsSUFDRTtBQUhKOzs7QUFJQSxhQUFPLEtBQVA7QUFMUTtBQURMOztBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVA7Ozs7Ozs7Ozs7OztBQ3BCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBYSxXQUFOO0FBQUE7QUFBQTtBQUNMLHVCQUFhLElBQWIsRUFBYSxPQUFiLEVBQWE7QUFBQTs7QUFDWCxRQUFBLFFBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTtBQURZLFNBQUMsSUFBRCxHQUFDLElBQUQ7QUFDWixJQUFBLFFBQUEsR0FBVztBQUNULGFBRFMsSUFBQTtBQUVULGFBRlMsSUFBQTtBQUdULGVBSFMsSUFBQTtBQUlULGtCQUpTLElBQUE7QUFLVCxtQkFMUyxLQUFBO0FBTVQsZ0JBQVc7QUFORixLQUFYO0FBUUEsSUFBQSxHQUFBLEdBQUEsQ0FBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLE9BQUEsQ0FBQTs7QUFBQSxTQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7O0FBQ0UsVUFBRyxHQUFBLElBQUgsT0FBQSxFQUFBO0FBQ0UsUUFBQSxRQUFTLENBQVQsVUFBUyxDQUFULEdBQXVCLE9BQVEsQ0FEakMsR0FDaUMsQ0FBL0I7O0FBRko7O0FBR0EsU0FBQSxHQUFBLElBQUEsUUFBQSxFQUFBOzs7QUFDRSxVQUFHLEdBQUEsSUFBSCxPQUFBLEVBQUE7QUFDRSxhQUFBLEdBQUEsSUFBWSxPQUFRLENBRHRCLEdBQ3NCLENBQXBCO0FBREYsT0FBQSxNQUFBO0FBR0UsYUFBQSxHQUFBLElBSEYsR0FHRTs7QUFKSjtBQVpXOztBQURSO0FBQUE7QUFBQSwyQkFtQkcsSUFuQkgsRUFtQkc7YUFDTixJQUFLLENBQUEsS0FBTCxJQUFLLENBQUwsR0FBYyxpQkFBQSxVQUFBLENBQW1CLEtBQW5CLElBQUEsQztBQURSO0FBbkJIO0FBQUE7QUFBQSw2QkFzQkssTUF0QkwsRUFzQkssR0F0QkwsRUFzQks7QUFDUixVQUFHLE1BQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxJQUFBLEtBQUgsSUFBQSxFQUFBO2VBQ0UsR0FBSSxDQUFBLEtBQUosUUFBSSxDQUFKLEdBQWlCLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FEL0IsSUFDbUIsQzs7QUFGWDtBQXRCTDtBQUFBO0FBQUEsK0JBeUJPLEdBekJQLEVBeUJPO0FBQ1YsVUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsWUFBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxHQUFHLENBQUgsU0FBQSxDQUFjLEtBRHZCLEdBQ1MsQ0FBUDs7O0FBQ0YsWUFBRyxLQUFBLEtBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBTyxHQUFJLENBQUEsS0FEYixLQUNhLENBQUosRUFBUDs7O0FBQ0YsWUFBRyxlQUFILElBQUEsRUFBQTtBQUNFLGlCQUFPLEdBQUksQ0FEYixXQUNhLENBQVg7QUFOSjs7QUFEVTtBQXpCUDtBQUFBO0FBQUEsK0JBaUNPLEdBakNQLEVBaUNPO0FBQ1YsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sS0FBQSxVQUFBLENBQUEsR0FBQSxDQUFOO0FBQ0EsYUFBTyxLQUFBLFNBQUEsSUFBYyxHQUFBLElBQUEsSUFBckI7QUFGVTtBQWpDUDtBQUFBO0FBQUEsNEJBb0NJLEdBcENKLEVBb0NJO0FBQ1AsVUFBRyxLQUFBLFVBQUEsQ0FBSCxHQUFHLENBQUgsRUFBQTtBQUNFLDJCQUNJLEtBREosSUFBQSxpQkFFRSxLQUFBLFVBQUEsQ0FBQSxHQUFBLEtBRkYsRUFBQSxTQUU4QixLQUFILE1BQUcsR0FBSCxHQUFHLEdBRjlCLEVBQUEsa0JBR0ssS0FKUCxJQUNFOztBQUZLO0FBcENKOztBQUFBO0FBQUEsR0FBUDs7OztBQTZDTSxXQUFXLENBQWpCLE1BQU07QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwrQkFDUSxHQURSLEVBQ1E7QUFDVixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBREYsMEVBQ1EsR0FEUixDQUNFOztBQUNBLFVBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLEdBQUcsQ0FBSCxPQUFBLENBQUEsS0FBQSxFQURSLElBQ1EsQ0FBTixDQURGLENBQUE7OztBQUVBLGFBQU8sR0FBUDtBQUpVO0FBRFI7QUFBQTtBQUFBLDJCQU1JLElBTkosRUFNSTthQUNOLElBQUssQ0FBQSxLQUFMLElBQUssQ0FBTCxHQUFjLGlCQUFBLFVBQUEsQ0FBbUIsS0FBbkIsSUFBQSxFQUF5QjtBQUFDLDJCQUFvQjtBQUFyQixPQUF6QixDO0FBRFI7QUFOSjtBQUFBO0FBQUEsK0JBUVEsR0FSUixFQVFRO0FBQ1YsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sS0FBQSxVQUFBLENBQUEsR0FBQSxDQUFOO0FBQ0EsYUFBUSxLQUFBLFNBQUEsSUFBZSxFQUFFLEdBQUEsSUFBQSxJQUFBLElBQVMsR0FBQSxDQUFBLE9BQUEsSUFBM0IsSUFBZ0IsQ0FBaEIsSUFBNkMsR0FBQSxJQUFBLElBQXBEO0FBRlU7QUFSUjs7QUFBQTtBQUFBLEVBQU4sV0FBTTs7QUFhQSxXQUFXLENBQWpCLE1BQU07QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw0QkFDSyxHQURMLEVBQ0s7QUFDUCxVQUFHLEtBQUEsVUFBQSxDQUFBLEdBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSw0QkFBYSxLQUFOLElBQVAsZUFBdUIsS0FBQSxVQUFBLENBQWhCLEdBQWdCLENBQXZCLFNBQTZDLEtBQUgsTUFBRyxHQUFILEdBQUcsR0FEL0MsRUFDRTs7QUFGSztBQURMOztBQUFBO0FBQUEsRUFBTixXQUFNOztBQU1BLFdBQVcsQ0FBakIsT0FBTTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNJLElBREosRUFDSTthQUNOLElBQUssQ0FBQSxLQUFMLElBQUssQ0FBTCxHQUFjLGlCQUFBLGNBQUEsQ0FBdUIsS0FBdkIsSUFBQSxDO0FBRFI7QUFESjtBQUFBO0FBQUEsNkJBR00sTUFITixFQUdNLEdBSE4sRUFHTTtBQUNSLFVBQUcsTUFBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLElBQUEsS0FBSCxJQUFBLEVBQUE7ZUFDRSxHQUFJLENBQUEsS0FBSixRQUFJLENBQUosR0FBaUIsQ0FBQyxNQUFNLENBQUMsSUFBUCxDQUFZLEtBRGhDLElBQ29CLEM7O0FBRlo7QUFITjtBQUFBO0FBQUEsNEJBTUssR0FOTCxFQU1LO0FBQ1AsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sS0FBQSxVQUFBLENBQUEsR0FBQSxDQUFOOztBQUNBLFVBQUcsR0FBQSxJQUFBLElBQUEsSUFBUyxDQUFaLEdBQUEsRUFBQTtBQUNFLDRCQUFhLEtBRGYsSUFDRTs7QUFISztBQU5MOztBQUFBO0FBQUEsRUFBTixXQUFNOztBQVlBLFdBQVcsQ0FBakIsSUFBTTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNJLElBREosRUFDSTthQUNOLElBQUssQ0FBQSxLQUFMLElBQUssQ0FBTCxHQUFjLGlCQUFBLGNBQUEsQ0FBdUIsS0FBdkIsSUFBQSxDO0FBRFI7QUFESjtBQUFBO0FBQUEsNEJBR0ssR0FITCxFQUdLO0FBQ1AsVUFBbUIsS0FBQSxVQUFBLENBQW5CLEdBQW1CLENBQW5CLEVBQUE7QUFBQSw0QkFBTSxLQUFOLElBQUE7O0FBRE87QUFITDs7QUFBQTtBQUFBLEVBQU4sV0FBTTs7Ozs7Ozs7OztBQ2pGTjs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFhLE1BQU47QUFBQTtBQUFBO0FBQ0wsb0JBQWE7QUFBQTs7QUFDWCxTQUFBLFNBQUEsR0FBYSxJQUFiO0FBQ0EsU0FBQSxLQUFBLEdBQVMsSUFBVDtBQUZXOztBQURSO0FBQUE7QUFBQSw2QkFJSyxRQUpMLEVBSUssQ0FBQTtBQUpMO0FBQUE7QUFBQSx5QkFNQyxHQU5ELEVBTUM7QUFDSixZQUFNLGlCQUFOO0FBREk7QUFORDtBQUFBO0FBQUEsK0JBUU8sR0FSUCxFQVFPO0FBQ1YsWUFBTSxpQkFBTjtBQURVO0FBUlA7QUFBQTtBQUFBLDhCQVVJO0FBQ1AsWUFBTSxpQkFBTjtBQURPO0FBVko7QUFBQTtBQUFBLCtCQVlPLEtBWlAsRUFZTyxHQVpQLEVBWU87QUFDVixZQUFNLGlCQUFOO0FBRFU7QUFaUDtBQUFBO0FBQUEsaUNBY1MsSUFkVCxFQWNTLEdBZFQsRUFjUztBQUNaLFlBQU0saUJBQU47QUFEWTtBQWRUO0FBQUE7QUFBQSwrQkFnQk8sS0FoQlAsRUFnQk8sR0FoQlAsRUFnQk8sSUFoQlAsRUFnQk87QUFDVixZQUFNLGlCQUFOO0FBRFU7QUFoQlA7QUFBQTtBQUFBLG1DQWtCUztBQUNaLFlBQU0saUJBQU47QUFEWTtBQWxCVDtBQUFBO0FBQUEsaUNBb0JTLEtBcEJULEVBb0JTO0FBQUEsVUFBUSxHQUFSLHVFQUFBLElBQUE7QUFDWixZQUFNLGlCQUFOO0FBRFk7QUFwQlQ7QUFBQTtBQUFBLHNDQXNCWSxDQUFBO0FBdEJaO0FBQUE7QUFBQSxvQ0F3QlUsQ0FBQTtBQXhCVjtBQUFBO0FBQUEsOEJBMEJJO0FBQ1AsYUFBTyxLQUFDLEtBQVI7QUFETztBQTFCSjtBQUFBO0FBQUEsNEJBNEJJLEdBNUJKLEVBNEJJO2FBQ1AsS0FBQSxLQUFBLEdBQVMsRztBQURGO0FBNUJKO0FBQUE7QUFBQSw0Q0E4QmtCO0FBQ3JCLGFBQU8sSUFBUDtBQURxQjtBQTlCbEI7QUFBQTtBQUFBLDBDQWdDZ0I7QUFDbkIsYUFBTyxLQUFQO0FBRG1CO0FBaENoQjtBQUFBO0FBQUEsZ0NBa0NRLFVBbENSLEVBa0NRO0FBQ1gsWUFBTSxpQkFBTjtBQURXO0FBbENSO0FBQUE7QUFBQSxrQ0FvQ1E7QUFDWCxZQUFNLGlCQUFOO0FBRFc7QUFwQ1I7QUFBQTtBQUFBLHdDQXNDYztBQUNqQixhQUFPLEtBQVA7QUFEaUI7QUF0Q2Q7QUFBQTtBQUFBLHNDQXdDYyxRQXhDZCxFQXdDYztBQUNqQixZQUFNLGlCQUFOO0FBRGlCO0FBeENkO0FBQUE7QUFBQSx5Q0EwQ2lCLFFBMUNqQixFQTBDaUI7QUFDcEIsWUFBTSxpQkFBTjtBQURvQjtBQTFDakI7QUFBQTtBQUFBLDhCQTZDTSxHQTdDTixFQTZDTTtBQUNULGFBQU8sSUFBQSxRQUFBLENBQVEsS0FBQSxhQUFBLENBQVIsR0FBUSxDQUFSLEVBQTRCLEtBQUEsV0FBQSxDQUE1QixHQUE0QixDQUE1QixDQUFQO0FBRFM7QUE3Q047QUFBQTtBQUFBLGtDQStDVSxHQS9DVixFQStDVTtBQUNiLFVBQUEsQ0FBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLEtBQUEsV0FBQSxDQUFBLEdBQUEsRUFBa0IsQ0FBbEIsSUFBa0IsQ0FBbEIsRUFBMEIsQ0FBMUIsQ0FBQSxDQUFKOztBQUNPLFVBQUEsQ0FBQSxFQUFBO2VBQVUsQ0FBQyxDQUFELEdBQUEsR0FBVixDO0FBQUEsT0FBQSxNQUFBO2VBQUEsQzs7QUFGTTtBQS9DVjtBQUFBO0FBQUEsZ0NBa0RRLEdBbERSLEVBa0RRO0FBQ1gsVUFBQSxDQUFBO0FBQUEsTUFBQSxDQUFBLEdBQUksS0FBQSxXQUFBLENBQUEsR0FBQSxFQUFrQixDQUFBLElBQUEsRUFBbEIsSUFBa0IsQ0FBbEIsQ0FBSjs7QUFDTyxVQUFBLENBQUEsRUFBQTtlQUFVLENBQUMsQ0FBWCxHO0FBQUEsT0FBQSxNQUFBO2VBQXFCLEtBQXJCLE9BQXFCLEU7O0FBRmpCO0FBbERSO0FBQUE7QUFBQSxnQ0FzRFEsS0F0RFIsRUFzRFEsT0F0RFIsRUFzRFE7QUFBQSxVQUFlLFNBQWYsdUVBQUEsQ0FBQTtBQUNYLFVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQTs7QUFBQSxVQUFHLFNBQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxLQUFBLFVBQUEsQ0FBQSxLQUFBLEVBQWtCLEtBRDNCLE9BQzJCLEVBQWxCLENBQVA7QUFERixPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUEsR0FBTyxLQUFBLFVBQUEsQ0FBQSxDQUFBLEVBSFQsS0FHUyxDQUFQOzs7QUFDRixNQUFBLE9BQUEsR0FBVSxJQUFWOztBQUNBLFdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsT0FBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBOztBQUNFLFFBQUEsR0FBQSxHQUFTLFNBQUEsR0FBSCxDQUFHLEdBQW1CLElBQUksQ0FBSixPQUFBLENBQXRCLElBQXNCLENBQW5CLEdBQTJDLElBQUksQ0FBSixXQUFBLENBQUEsSUFBQSxDQUFwRDs7QUFDQSxZQUFHLEdBQUEsS0FBTyxDQUFWLENBQUEsRUFBQTtBQUNFLGNBQUksT0FBQSxJQUFELElBQUMsSUFBWSxPQUFBLEdBQUEsU0FBQSxHQUFvQixHQUFBLEdBQXBDLFNBQUEsRUFBQTtBQUNFLFlBQUEsT0FBQSxHQUFVLEdBQVY7QUFDQSxZQUFBLE9BQUEsR0FGRixJQUVFO0FBSEo7O0FBRkY7O0FBTUEsVUFBRyxPQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBTyxJQUFBLGNBQUEsQ0FBZSxTQUFBLEdBQUgsQ0FBRyxHQUFtQixPQUFBLEdBQXRCLEtBQUcsR0FBZixPQUFBLEVBRFQsT0FDUyxDQUFQOzs7QUFDRixhQUFPLElBQVA7QUFkVztBQXREUjtBQUFBO0FBQUEsc0NBc0VjLFlBdEVkLEVBc0VjO0FBQ2pCLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxFQUFiO0FBQ0EsTUFBQSxNQUFBLEdBQVMsQ0FBVDs7QUFDQSxXQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLFlBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7QUFDRSxRQUFBLElBQUksQ0FBSixVQUFBLENBQUEsSUFBQTtBQUNBLFFBQUEsSUFBSSxDQUFKLFdBQUEsQ0FBQSxNQUFBO0FBQ0EsUUFBQSxJQUFJLENBQUosS0FBQTtBQUNBLFFBQUEsTUFBQSxJQUFVLElBQUksQ0FBSixXQUFBLENBQUEsSUFBQSxDQUFWO0FBRUEsUUFBQSxVQUFBLEdBQWEsVUFBVSxDQUFWLE1BQUEsQ0FBa0IsSUFBSSxDQUF0QixVQUFBLENBQWI7QUFORjs7YUFPQSxLQUFBLDJCQUFBLENBQUEsVUFBQSxDO0FBVmlCO0FBdEVkO0FBQUE7QUFBQSxnREFrRndCLFVBbEZ4QixFQWtGd0I7QUFDM0IsVUFBRyxVQUFVLENBQVYsTUFBQSxHQUFILENBQUEsRUFBQTtBQUNFLFlBQUcsS0FBSCxtQkFBRyxFQUFILEVBQUE7aUJBQ0UsS0FBQSxXQUFBLENBREYsVUFDRSxDO0FBREYsU0FBQSxNQUFBO2lCQUdFLEtBQUEsWUFBQSxDQUFjLFVBQVcsQ0FBQSxDQUFBLENBQVgsQ0FBZCxLQUFBLEVBQWtDLFVBQVcsQ0FBQSxDQUFBLENBQVgsQ0FIcEMsR0FHRSxDO0FBSko7O0FBRDJCO0FBbEZ4Qjs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0hBLElBQWEsTUFBQSxHQUFBLFlBQUE7QUFBQSxNQUFOLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw0QkFDTjtBQUNILFlBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQTs7QUFBQSxZQUFHLE1BQU0sQ0FBTixPQUFBLElBQW1CLEtBQXRCLE9BQUEsRUFBQTtBQUNFLFVBQUEsT0FBQSxHQUFBLEVBQUE7O0FBREYsNENBREcsSUFDSDtBQURHLFlBQUEsSUFDSDtBQUFBOztBQUNFLGVBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBOzt5QkFDRSxPQUFPLENBQVAsR0FBQSxDQUFBLEdBQUEsQztBQURGOztpQkFERixPOztBQURHO0FBRE07QUFBQTtBQUFBLDhCQU1GLEtBTkUsRUFNRjtBQUFBLFlBQU8sSUFBUCx1RUFBQSxVQUFBO0FBQ1AsWUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUE7QUFBQSxRQUFBLEVBQUEsR0FBSyxXQUFXLENBQVgsR0FBQSxFQUFMO0FBQ0EsUUFBQSxHQUFBLEdBQU0sS0FBQSxFQUFOO0FBQ0EsUUFBQSxFQUFBLEdBQUssV0FBVyxDQUFYLEdBQUEsRUFBTDtBQUNBLFFBQUEsT0FBTyxDQUFQLEdBQUEsV0FBWSxJQUFaLG1CQUE0QixFQUFBLEdBQTVCLEVBQUE7ZUFDQSxHO0FBTE87QUFORTtBQUFBO0FBQUEsZ0NBYUEsR0FiQSxFQWFBLElBYkEsRUFhQTtBQUFBLFlBQVUsTUFBVix1RUFBQSxFQUFBO0FBQ1QsWUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLEdBQVEsR0FBSSxDQUFBLElBQUEsQ0FBWjtlQUNBLEdBQUksQ0FBSixJQUFJLENBQUosR0FBWSxZQUFBO0FBQ1YsY0FBQSxJQUFBO0FBQUEsVUFBQSxJQUFBLEdBQU8sU0FBUDtpQkFDQSxLQUFBLE9BQUEsQ0FBYyxZQUFBO21CQUFHLEtBQUssQ0FBTCxLQUFBLENBQUEsR0FBQSxFQUFBLElBQUEsQztBQUFqQixXQUFBLEVBQXdDLE1BQUEsR0FBeEMsSUFBQSxDO0FBRlUsUztBQUZIO0FBYkE7QUFBQTtBQUFBLDhCQWtCRixLQWxCRSxFQWtCRixJQWxCRSxFQWtCRjtBQUNQLFlBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBO0FBQUEsUUFBQSxFQUFBLEdBQUssV0FBVyxDQUFYLEdBQUEsRUFBTDtBQUNBLFFBQUEsR0FBQSxHQUFNLEtBQUEsRUFBTjtBQUNBLFFBQUEsRUFBQSxHQUFLLFdBQVcsQ0FBWCxHQUFBLEVBQUw7O0FBQ0EsWUFBRyxLQUFBLFdBQUEsQ0FBQSxJQUFBLEtBQUgsSUFBQSxFQUFBO0FBQ0UsZUFBSyxXQUFMLENBQWlCLElBQWpCLEVBQUEsS0FBQTtBQUNBLGVBQUssV0FBTCxDQUFpQixJQUFqQixFQUFBLEtBQUEsSUFBK0IsRUFBQSxHQUZqQyxFQUVFO0FBRkYsU0FBQSxNQUFBO0FBSUUsZUFBSyxXQUFMLENBQUEsSUFBQSxJQUF5QjtBQUN2QixZQUFBLEtBQUEsRUFEdUIsQ0FBQTtBQUV2QixZQUFBLEtBQUEsRUFBTyxFQUFBLEdBQUs7QUFGVyxXQUF6Qjs7O2VBSUYsRztBQVpPO0FBbEJFO0FBQUE7QUFBQSwrQkErQkg7ZUFDTixPQUFPLENBQVAsR0FBQSxDQUFZLEtBQVosV0FBQSxDO0FBRE07QUEvQkc7O0FBQUE7QUFBQTs7QUFBTjttQkFLTCxPLEdBQVMsSTttQkFPVCxXLEdBQWEsRTs7Q0FaRixDLElBQUEsUUFBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsSUFBYSxZQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNEJBQ0ksT0FESixFQUNJLFFBREosRUFDSTtBQUNQLFVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsR0FBQTtBQUFBLFdBQUEsUUFBQSxHQUFZLFFBQVo7QUFDQSxNQUFBLEdBQUEsR0FBQSxLQUFBLFFBQUE7QUFBQSxNQUFBLE9BQUEsR0FBQSxFQUFBOztBQUFBLFdBQUEsR0FBQSxJQUFBLEdBQUEsRUFBQTs7O0FBQ0UsWUFBRyxHQUFBLElBQUgsT0FBQSxFQUFBO3VCQUNFLEtBQUEsTUFBQSxDQUFBLEdBQUEsRUFBWSxPQUFRLENBRHRCLEdBQ3NCLENBQXBCLEM7QUFERixTQUFBLE1BQUE7dUJBR0UsS0FBQSxNQUFBLENBQUEsR0FBQSxFQUhGLEdBR0UsQzs7QUFKSjs7O0FBRk87QUFESjtBQUFBO0FBQUEsMkJBU0csR0FUSCxFQVNHLEdBVEgsRUFTRztBQUNOLFVBQUEsR0FBQTs7QUFBQSxVQUFHLENBQUEsQ0FBQSxHQUFBLEdBQUEsS0FBQSxHQUFBLENBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxDQUFBLElBQUEsR0FBQSxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7ZUFDRSxLQUFBLEdBQUEsRUFERixHQUNFLEM7QUFERixPQUFBLE1BQUE7ZUFHRSxLQUFBLEdBQUEsSUFIRixHOztBQURNO0FBVEg7QUFBQTtBQUFBLDJCQWVHLEdBZkgsRUFlRztBQUNOLFVBQUEsR0FBQTs7QUFBQSxVQUFHLENBQUEsQ0FBQSxHQUFBLEdBQUEsS0FBQSxHQUFBLENBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxDQUFBLElBQUEsR0FBQSxLQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLEtBRFQsR0FDUyxHQUFQO0FBREYsT0FBQSxNQUFBO0FBR0UsZUFBTyxLQUhULEdBR1MsQ0FBUDs7QUFKSTtBQWZIO0FBQUE7QUFBQSw4QkFxQkk7QUFDUCxVQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxFQUFQO0FBQ0EsTUFBQSxHQUFBLEdBQUEsS0FBQSxRQUFBOztBQUFBLFdBQUEsR0FBQSxJQUFBLEdBQUEsRUFBQTs7QUFDRSxRQUFBLElBQUssQ0FBTCxHQUFLLENBQUwsR0FBWSxLQUFBLE1BQUEsQ0FBQSxHQUFBLENBQVo7QUFERjs7QUFFQSxhQUFPLElBQVA7QUFKTztBQXJCSjs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7OztBQ0dBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVZBOztBQUFBLElBQUEsT0FBQSxHQUFBLEdBQUEsT0FBQTs7QUFZQSxJQUFhLHFCQUFOO0FBQUE7QUFBQTtBQUFBOztBQUNMLGlDQUFhLFFBQWIsRUFBYSxJQUFiLEVBQWEsSUFBYixFQUFhO0FBQUE7O0FBQUE7OztBQUFDLFVBQUMsUUFBRCxHQUFDLFFBQUQ7QUFBVSxVQUFDLEdBQUQsR0FBQyxJQUFEO0FBQUssVUFBQyxHQUFELEdBQUMsSUFBRDs7QUFFM0IsUUFBQSxDQUFPLE1BQVAsT0FBTyxFQUFQLEVBQUE7QUFDRSxZQUFBLFlBQUE7O0FBQ0EsWUFBQSxPQUFBLEdBQVcsTUFBQyxHQUFaO0FBQ0EsWUFBQSxTQUFBLEdBQWEsTUFBQSxjQUFBLENBQWdCLE1BQWhCLEdBQUEsQ0FBYjs7QUFDQSxZQUFBLGdCQUFBOztBQUNBLFlBQUEsWUFBQTs7QUFDQSxZQU5GLGVBTUU7OztBQVJTO0FBQUE7O0FBRFI7QUFBQTtBQUFBLG1DQVVTO0FBQ1osVUFBQSxDQUFBLEVBQUEsU0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLEtBQUEsY0FBQSxDQUFnQixLQUFoQixHQUFBLENBQVo7O0FBQ0EsVUFBRyxTQUFTLENBQVQsU0FBQSxDQUFBLENBQUEsRUFBc0IsS0FBQyxRQUFELENBQVUsU0FBVixDQUF0QixNQUFBLE1BQXFELEtBQUMsUUFBRCxDQUFyRCxTQUFBLEtBQTZFLENBQUEsR0FBSSxLQUFwRixlQUFvRixFQUFqRixDQUFILEVBQUE7QUFDRSxhQUFBLFVBQUEsR0FBYyxJQUFBLGNBQUEsQ0FBVyxLQUFYLEdBQUEsRUFBaUIsS0FBakIsR0FBQSxDQUFkO0FBQ0EsYUFBQSxHQUFBLEdBQU8sQ0FBQyxDQUFDLEdBQVQ7ZUFDQSxLQUFBLEdBQUEsR0FBTyxDQUFDLENBSFYsRzs7QUFGWTtBQVZUO0FBQUE7QUFBQSxzQ0FnQlk7QUFDZixVQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxLQUFBLGNBQUEsQ0FBZ0IsS0FBaEIsR0FBQSxFQUFBLFNBQUEsQ0FBZ0MsS0FBQyxRQUFELENBQVUsU0FBVixDQUFoQyxNQUFBLENBQVY7QUFDQSxNQUFBLE9BQUEsR0FBVSxLQUFDLFFBQUQsQ0FBQSxPQUFBLEdBQW9CLE9BQTlCO0FBQ0EsTUFBQSxPQUFBLEdBQVUsS0FBQyxHQUFYOztBQUNBLFVBQUcsQ0FBQSxHQUFJLEtBQUMsUUFBRCxDQUFBLGdCQUFBLENBQTJCLEtBQTNCLEdBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFnRCxDQUF2RCxDQUFPLENBQVAsRUFBQTtBQUNFLFFBQUEsQ0FBQyxDQUFELEdBQUEsR0FBUSxLQUFDLFFBQUQsQ0FBVSxNQUFWLENBQUEsVUFBQSxDQUE0QixDQUFDLENBQTdCLEdBQUEsRUFBa0MsS0FBQyxRQUFELENBQUEsY0FBQSxDQUF5QixDQUFDLENBQUQsR0FBQSxHQUFNLENBQUMsQ0FBQyxHQUFGLENBQS9CLE1BQUEsSUFBNkMsS0FBQyxRQUFELENBQVUsT0FBVixDQUEvRSxNQUFBLENBQVI7QUFDQSxlQUZGLENBRUU7O0FBTmE7QUFoQlo7QUFBQTtBQUFBLHVDQXVCYTtBQUNoQixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxLQUFDLFNBQUQsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFSO0FBQ0EsV0FBQSxPQUFBLEdBQVcsS0FBSyxDQUFMLEtBQUEsRUFBWDthQUNBLEtBQUEsU0FBQSxHQUFhLEtBQUssQ0FBTCxJQUFBLENBQUEsR0FBQSxDO0FBSEc7QUF2QmI7QUFBQTtBQUFBLGlDQTJCUSxNQTNCUixFQTJCUTtBQUNYLFVBQUEsWUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxJQUFBLEVBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxHQUFBO0FBQUEsV0FBQSxNQUFBLEdBQVUsRUFBVjtBQUNBLFdBQUEsS0FBQSxHQUFTLEtBQUEsV0FBQSxFQUFUOztBQUNBLFVBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxXQUFBLEdBQWMsS0FBQSxTQUFBLENBQUEsYUFBQSxDQUFkOztBQUNBLFlBQUcsV0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGVBQUMsS0FBRCxDQUFBLFdBQUEsSUFBc0IsS0FEeEIsT0FDRTtBQUhKOzs7QUFJQSxVQUFHLE1BQU0sQ0FBVCxNQUFBLEVBQUE7QUFDRSxZQUFHLEtBQUEsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsWUFBQSxHQUFlLEtBQUEsU0FBQSxDQURqQixjQUNpQixDQUFmOzs7QUFDRixRQUFBLEtBQUEsR0FBUSxLQUFSO0FBQ0EsUUFBQSxLQUFBLEdBQVEsRUFBUjtBQUNBLFFBQUEsSUFBQSxHQUFPLEtBQVA7O0FBQ0EsYUFBUyxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsR0FBQSxDQUFULEVBQVMsS0FBQSxHQUFBLEdBQUEsQ0FBQSxJQUFBLEdBQUEsR0FBQSxDQUFBLElBQUEsR0FBVCxFQUFTLENBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFULENBQUEsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFNLE1BQU8sQ0FBQSxDQUFBLENBQWI7O0FBQ0EsY0FBRyxHQUFBLEtBQUEsR0FBQSxJQUFlLENBQWxCLEtBQUEsRUFBQTtBQUNFLGdCQUFBLElBQUEsRUFBQTtBQUNFLG1CQUFDLEtBQUQsQ0FBQSxJQUFBLElBREYsS0FDRTtBQURGLGFBQUEsTUFBQTtBQUdFLG1CQUFDLE1BQUQsQ0FBQSxJQUFBLENBSEYsS0FHRTs7O0FBQ0YsWUFBQSxLQUFBLEdBQVEsRUFBUjtBQUNBLFlBQUEsSUFBQSxHQU5GLEtBTUU7QUFORixXQUFBLE1BT0ssSUFBRyxDQUFBLEdBQUEsS0FBQSxHQUFBLElBQUEsR0FBQSxLQUFBLEdBQUEsTUFBc0IsQ0FBQSxLQUFBLENBQUEsSUFBVSxNQUFPLENBQUEsQ0FBQSxHQUFQLENBQU8sQ0FBUCxLQUFuQyxJQUFHLENBQUgsRUFBQTtBQUNILFlBQUEsS0FBQSxHQUFRLENBREwsS0FDSDtBQURHLFdBQUEsTUFFQSxJQUFHLEdBQUEsS0FBQSxHQUFBLElBQWUsQ0FBZixJQUFBLElBQXlCLENBQXpCLEtBQUEsS0FBc0MsWUFBQSxJQUFELElBQUMsSUFBaUIsT0FBQSxDQUFBLElBQUEsQ0FBQSxZQUFBLEVBQUEsSUFBQSxLQUExRCxDQUFHLENBQUgsRUFBQTtBQUNILFlBQUEsSUFBQSxHQUFPLEtBQVA7QUFDQSxZQUFBLEtBQUEsR0FGRyxFQUVIO0FBRkcsV0FBQSxNQUFBO0FBSUgsWUFBQSxLQUFBLElBSkcsR0FJSDs7QUFmSjs7QUFnQkEsWUFBRyxLQUFLLENBQVIsTUFBQSxFQUFBO0FBQ0UsY0FBQSxJQUFBLEVBQUE7bUJBQ0UsS0FBQyxLQUFELENBQUEsSUFBQSxJQURGLEs7QUFBQSxXQUFBLE1BQUE7bUJBR0UsS0FBQyxNQUFELENBQUEsSUFBQSxDQUhGLEtBR0UsQztBQUpKO0FBdEJGOztBQVBXO0FBM0JSO0FBQUE7QUFBQSxtQ0E2RFM7QUFDWixVQUFBLENBQUE7O0FBQUEsVUFBRyxDQUFBLEdBQUksS0FBUCxlQUFPLEVBQVAsRUFBQTtBQUNFLGFBQUEsT0FBQSxHQUFXLDJCQUFBLGFBQUEsQ0FBMkIsS0FBQyxRQUFELENBQVUsTUFBVixDQUFBLFVBQUEsQ0FBNEIsS0FBQSxHQUFBLEdBQUssS0FBQyxHQUFELENBQWpDLE1BQUEsRUFBNkMsQ0FBQyxDQUF6RSxHQUEyQixDQUEzQixDQUFYO2VBQ0EsS0FBQSxHQUFBLEdBQU8sS0FBQyxRQUFELENBQVUsTUFBVixDQUFBLFVBQUEsQ0FBNEIsS0FBNUIsR0FBQSxFQUFpQyxDQUFDLENBQUQsR0FBQSxHQUFNLENBQUMsQ0FBQyxHQUFGLENBRmhELE1BRVMsQzs7QUFIRztBQTdEVDtBQUFBO0FBQUEsc0NBaUVZO0FBQ2YsVUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLE9BQUE7O0FBQUEsVUFBc0IsS0FBQSxVQUFBLElBQXRCLElBQUEsRUFBQTtBQUFBLGVBQU8sS0FBUCxVQUFBOzs7QUFDQSxNQUFBLE9BQUEsR0FBVSxLQUFDLFFBQUQsQ0FBQSxPQUFBLEdBQW9CLEtBQUMsUUFBRCxDQUFwQixTQUFBLEdBQTBDLEtBQTFDLE9BQUEsR0FBcUQsS0FBQyxRQUFELENBQVUsT0FBekU7QUFDQSxNQUFBLE9BQUEsR0FBVSxLQUFDLFFBQUQsQ0FBQSxPQUFBLEdBQW9CLEtBQUMsT0FBL0I7O0FBQ0EsVUFBRyxDQUFBLEdBQUksS0FBQyxRQUFELENBQUEsZ0JBQUEsQ0FBMkIsS0FBQSxHQUFBLEdBQUssS0FBQyxHQUFELENBQWhDLE1BQUEsRUFBQSxPQUFBLEVBQVAsT0FBTyxDQUFQLEVBQUE7QUFDRSxlQUFPLEtBQUEsVUFBQSxHQURULENBQ0U7O0FBTGE7QUFqRVo7QUFBQTtBQUFBLHNDQXVFWTtBQUNmLFVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxTQUFBLEVBQVQ7QUFDQSxNQUFBLEdBQUEsR0FBTSxLQUFDLFFBQUQsQ0FBVSxNQUFWLENBQUEsT0FBQSxFQUFOOztBQUNBLGFBQU0sTUFBQSxHQUFBLEdBQUEsSUFBaUIsS0FBQyxRQUFELENBQVUsTUFBVixDQUFBLFVBQUEsQ0FBQSxNQUFBLEVBQW1DLE1BQUEsR0FBTyxLQUFDLFFBQUQsQ0FBVSxJQUFWLENBQTFDLE1BQUEsTUFBb0UsS0FBQyxRQUFELENBQTNGLElBQUEsRUFBQTtBQUNFLFFBQUEsTUFBQSxJQUFRLEtBQUMsUUFBRCxDQUFVLElBQVYsQ0FBZSxNQUF2QjtBQURGOztBQUVBLFVBQUcsTUFBQSxJQUFBLEdBQUEsSUFBaUIsQ0FBQSxHQUFBLEdBQUEsS0FBQyxRQUFELENBQVUsTUFBVixDQUFBLFVBQUEsQ0FBQSxNQUFBLEVBQW9DLE1BQUEsR0FBUyxLQUFDLFFBQUQsQ0FBVSxJQUFWLENBQTdDLE1BQUEsQ0FBQSxNQUFBLEdBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsS0FBcEIsSUFBQSxFQUFBO2VBQ0UsS0FBQSxHQUFBLEdBQU8sS0FBQyxRQUFELENBQVUsTUFBVixDQUFBLFVBQUEsQ0FBNEIsS0FBNUIsR0FBQSxFQURULE1BQ1MsQzs7QUFOTTtBQXZFWjtBQUFBO0FBQUEsZ0NBOEVNO0FBQ1QsVUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLE1BQUE7O0FBQUEsVUFBRyxLQUFBLFFBQUEsQ0FBQSxVQUFBLElBQUEsSUFBQSxJQUEwQixLQUFDLFFBQUQsQ0FBVSxVQUFWLENBQXFCLEdBQXJCLENBQUEsSUFBQSxLQUE3QixTQUFBLEVBQUE7QUFBQTs7O0FBRUEsTUFBQSxFQUFBLEdBQUssS0FBQyxPQUFELENBQUEsZUFBQSxFQUFMO0FBQ0EsTUFBQSxFQUFBLEdBQUssS0FBQyxPQUFELENBQUEsZ0JBQUEsRUFBTDtBQUNBLE1BQUEsTUFBQSxHQUFTLEtBQUEsU0FBQSxLQUFlLEVBQUUsQ0FBQyxNQUEzQjs7QUFDQSxVQUFHLEtBQUMsUUFBRCxDQUFVLE1BQVYsQ0FBQSxVQUFBLENBQTRCLEtBQUEsR0FBQSxHQUFPLEVBQUUsQ0FBckMsTUFBQSxFQUE2QyxLQUE3QyxHQUFBLE1BQUEsRUFBQSxJQUE2RCxLQUFDLFFBQUQsQ0FBVSxNQUFWLENBQUEsVUFBQSxDQUE0QixNQUFBLEdBQVMsRUFBRSxDQUF2QyxNQUFBLEVBQUEsTUFBQSxNQUFoRSxFQUFBLEVBQUE7QUFDRSxhQUFBLEdBQUEsR0FBTyxLQUFBLEdBQUEsR0FBTyxFQUFFLENBQUMsTUFBakI7QUFDQSxhQUFBLEdBQUEsR0FBTyxLQUFDLFFBQUQsQ0FBVSxNQUFWLENBQUEsVUFBQSxDQUE0QixLQUE1QixHQUFBLEVBQUEsTUFBQSxDQUFQO2VBQ0EsS0FIRix5QkFHRSxFO0FBSEYsT0FBQSxNQUlLLElBQUcsS0FBQSxNQUFBLEdBQUEsZUFBQSxHQUFBLE9BQUEsQ0FBQSxFQUFBLElBQTBDLENBQTFDLENBQUEsSUFBaUQsS0FBQSxNQUFBLEdBQUEsZUFBQSxHQUFBLE9BQUEsQ0FBQSxFQUFBLElBQTBDLENBQTlGLENBQUEsRUFBQTtBQUNILGFBQUEsS0FBQSxHQUFTLENBQVQ7ZUFDQSxLQUZHLHlCQUVILEU7O0FBWk87QUE5RU47QUFBQTtBQUFBLGdEQTJGc0I7QUFDekIsVUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7O0FBQUEsVUFBRyxLQUFILE9BQUEsRUFBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLDJCQUFBLFlBQUEsQ0FBMEIsS0FBQyxPQUFELENBQTFCLGVBQTBCLEVBQTFCLENBQU47QUFDQSxRQUFBLEdBQUEsR0FBTSwyQkFBQSxZQUFBLENBQTBCLEtBQUMsT0FBRCxDQUExQixnQkFBMEIsRUFBMUIsQ0FBTjtBQUNBLFFBQUEsRUFBQSxHQUFLLDJCQUFBLFlBQUEsQ0FBMEIsS0FBQyxRQUFELENBQTFCLElBQUEsQ0FBTDtBQUNBLFFBQUEsR0FBQSxHQUFNLElBQUEsTUFBQSxnQkFBVyxHQUFYLGdCQUFXLEVBQVgsK0JBQVcsRUFBWCxlQUFBLEdBQUEsUUFITixJQUdNLENBQU4sQ0FKRixDQUNFOztBQUlBLFFBQUEsR0FBQSxHQUFNLElBQUEsTUFBQSxtQkFBVyxFQUFYLGVBQUEsR0FBQSxXQUFOO0FBQ0EsUUFBQSxHQUFBLEdBQU0sSUFBQSxNQUFBLGlCQUFXLEdBQVgsZ0JBQUEsRUFBQSxhQUFOO2VBQ0EsS0FBQSxPQUFBLEdBQVcsS0FBQyxPQUFELENBQUEsT0FBQSxDQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsRUFQYixFQU9hLEM7O0FBUlk7QUEzRnRCO0FBQUE7QUFBQSxxQ0FvR1c7QUFDZCxVQUFBLEdBQUE7YUFBQSxLQUFBLE1BQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxLQUFBLFFBQUEsQ0FBQSxlQUFBLENBQUEsS0FBQSxTQUFBLEVBQUEsQ0FBQSxLQUFBLElBQUEsR0FBQSxHQUFpRCxDQUF2QyxJQUFWLEVBQUEsR0FBVSxLQUFBLEM7QUFESTtBQXBHWDtBQUFBO0FBQUEsZ0NBc0dRLFFBdEdSLEVBc0dRO2FBQ1gsS0FBQSxRQUFBLEdBQVksUTtBQUREO0FBdEdSO0FBQUE7QUFBQSxpQ0F3R087QUFDVixXQUFBLE1BQUE7O0FBQ0EsV0FBQSxTQUFBOztBQUNBLFdBQUEsT0FBQSxHQUFXLEtBQUEsdUJBQUEsQ0FBeUIsS0FBekIsT0FBQSxDQUFYO0FBSEY7QUFBWTtBQXhHUDtBQUFBO0FBQUEsa0NBNkdRO2FBQ1gsS0FBQSxZQUFBLENBQWMsS0FBZCxTQUFBLEM7QUFEVztBQTdHUjtBQUFBO0FBQUEsaUNBK0dPO0FBQ1YsYUFBTyxLQUFBLE9BQUEsSUFBWSxLQUFDLFFBQUQsQ0FBVSxPQUE3QjtBQURVO0FBL0dQO0FBQUE7QUFBQSw2QkFpSEc7QUFDTixVQUFPLEtBQUEsR0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGFBQUEsY0FBQTs7QUFDQSxZQUFHLEtBQUMsU0FBRCxDQUFBLFNBQUEsQ0FBQSxDQUFBLEVBQXVCLEtBQUMsUUFBRCxDQUFVLGFBQVYsQ0FBdkIsTUFBQSxNQUEwRCxLQUFDLFFBQUQsQ0FBN0QsYUFBQSxFQUFBO0FBQ0UsZUFBQSxHQUFBLEdBQU8saUJBQVEsSUFBUixDQUFBLE1BQUEsQ0FBQSxpQkFBQSxDQUFQO0FBQ0EsZUFBQSxPQUFBLEdBQVcsS0FBQyxRQUFELENBRmIsT0FFRTtBQUZGLFNBQUEsTUFBQTtBQUlFLGVBQUEsTUFBQSxHQUFVLEtBQUEsU0FBQSxDQUFXLEtBQVgsT0FBQSxDQUFWO0FBQ0EsZUFBQSxPQUFBLEdBQVcsS0FBQyxNQUFELENBQVEsT0FBbkI7QUFDQSxlQUFBLEdBQUEsR0FBTyxLQUFDLE1BQUQsQ0FBQSxJQUFBLEVBQVA7O0FBQ0EsY0FBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxpQkFBQyxPQUFELENBQUEsWUFBQSxDQUFzQixLQUFDLEdBQUQsQ0FEeEIsUUFDRTtBQVJKO0FBRkY7OztBQVdBLGFBQU8sS0FBQyxHQUFSO0FBWk07QUFqSEg7QUFBQTtBQUFBLDhCQThITSxPQTlITixFQThITTtBQUNULFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEtBQUMsUUFBRCxDQUFVLE9BQVYsQ0FBQSxTQUFBLENBQUEsT0FBQSxFQUFvQyxLQUFwQyxvQkFBb0MsRUFBcEMsQ0FBVDtBQUNBLE1BQUEsTUFBTSxDQUFOLFFBQUEsR0FBa0IsSUFBbEI7QUFDQSxhQUFPLE1BQVA7QUFIUztBQTlITjtBQUFBO0FBQUEsMkNBa0lpQjtBQUNwQixVQUFBLEtBQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsRUFBUjtBQUNBLE1BQUEsR0FBQSxHQUFNLElBQU47O0FBQ0EsYUFBTSxHQUFBLENBQUEsTUFBQSxJQUFOLElBQUEsRUFBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxNQUFWOztBQUNBLFlBQWdDLEdBQUEsQ0FBQSxHQUFBLElBQUEsSUFBQSxJQUFhLEdBQUEsQ0FBQSxHQUFBLENBQUEsUUFBQSxJQUE3QyxJQUFBLEVBQUE7QUFBQSxVQUFBLEtBQUssQ0FBTCxJQUFBLENBQVcsR0FBRyxDQUFDLEdBQUosQ0FBWCxRQUFBOztBQUZGOztBQUdBLGFBQU8sS0FBUDtBQU5vQjtBQWxJakI7QUFBQTtBQUFBLG1DQXlJVyxHQXpJWCxFQXlJVztBQUNkLGFBQU8sR0FBRyxDQUFILFNBQUEsQ0FBYyxLQUFDLFFBQUQsQ0FBVSxPQUFWLENBQWQsTUFBQSxFQUF1QyxHQUFHLENBQUgsTUFBQSxHQUFXLEtBQUMsUUFBRCxDQUFVLE9BQVYsQ0FBbEQsTUFBQSxDQUFQO0FBRGM7QUF6SVg7QUFBQTtBQUFBLGlDQTJJUyxPQTNJVCxFQTJJUztBQUNaLFVBQUEsT0FBQSxFQUFBLElBQUE7O0FBRFksa0NBQ00saUNBQUEsS0FBQSxDQUFzQixLQUF0QixPQUFBLENBRE47O0FBQUE7O0FBQ1osTUFBQSxJQURZO0FBQ1osTUFBQSxPQURZO0FBRVosYUFBTyxPQUFPLENBQVAsT0FBQSxDQUFBLFFBQUEsRUFBQSxPQUFBLENBQVA7QUFGWTtBQTNJVDtBQUFBO0FBQUEsOEJBOElJO0FBQ1AsYUFBTyxLQUFBLEdBQUEsS0FBUSxLQUFDLFFBQUQsQ0FBQSxPQUFBLEdBQW9CLEtBQUMsUUFBRCxDQUFwQixTQUFBLEdBQTBDLEtBQUMsUUFBRCxDQUFsRCxPQUFBLElBQXVFLEtBQUEsR0FBQSxLQUFRLEtBQUMsUUFBRCxDQUFBLE9BQUEsR0FBb0IsS0FBQyxRQUFELENBQVUsT0FBcEg7QUFETztBQTlJSjtBQUFBO0FBQUEsOEJBZ0pJO0FBQ1AsVUFBQSxXQUFBLEVBQUEsR0FBQTs7QUFBQSxVQUFHLEtBQUgsT0FBRyxFQUFILEVBQUE7QUFDRSxZQUFHLEtBQUEsUUFBQSxDQUFBLFlBQUEsSUFBQSxJQUFBLElBQTRCLEtBQUEsUUFBQSxDQUFBLFlBQUEsQ0FBQSxpQkFBQSxDQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsUUFBQSxDQUFBLE9BQUEsQ0FBQSxNQUFBLEtBQS9CLElBQUEsRUFBQTtpQkFDRSxLQUFDLFFBQUQsQ0FBVSxZQUFWLENBREYsTUFDRSxFO0FBREYsU0FBQSxNQUFBO2lCQUdFLEtBQUEsV0FBQSxDQUhGLEVBR0UsQztBQUpKO0FBQUEsT0FBQSxNQUtLLElBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0gsWUFBRyxXQUFBLEdBQWMsS0FBQSxTQUFBLENBQWpCLGVBQWlCLENBQWpCLEVBQUE7QUFDRSxVQUFBLFdBQUEsQ0FERixJQUNFLENBQUE7OztBQUNGLFlBQUcsS0FBSCxpQkFBRyxFQUFILEVBQUE7QUFDRSxjQUFHLENBQUEsR0FBQSxHQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUgsSUFBQSxFQUFBO0FBQ0UsaUJBQUEsV0FBQSxDQUFBLEdBQUE7QUFDQSxtQkFGRixJQUVFO0FBSEo7QUFBQSxTQUFBLE1BQUE7QUFLSSxpQkFBTyxLQUxYLGVBS1csRUFBUDtBQVJEOztBQU5FO0FBaEpKO0FBQUE7QUFBQSxnQ0ErSk07QUFDVCxhQUFPLEtBQUEsR0FBQSxHQUFLLEtBQUMsR0FBRCxDQUFLLE1BQWpCO0FBRFM7QUEvSk47QUFBQTtBQUFBLDZCQWlLRztBQUNOLGFBQU8sSUFBQSxRQUFBLENBQVEsS0FBUixHQUFBLEVBQWEsS0FBQSxHQUFBLEdBQUssS0FBQyxHQUFELENBQWxCLE1BQUEsRUFBQSxVQUFBLENBQTBDLEtBQUMsUUFBRCxDQUExQyxNQUFBLENBQVA7QUFETTtBQWpLSDtBQUFBO0FBQUEsb0NBbUtVO0FBQ2IsYUFBTyxJQUFBLFFBQUEsQ0FBUSxLQUFSLEdBQUEsRUFBYSxLQUFBLEdBQUEsR0FBSyxLQUFDLE9BQUQsQ0FBbEIsTUFBQSxFQUFBLFVBQUEsQ0FBOEMsS0FBQyxRQUFELENBQTlDLE1BQUEsQ0FBUDtBQURhO0FBbktWO0FBQUE7QUFBQSxnQ0FxS007QUFDVCxVQUFBLE1BQUE7O0FBQUEsVUFBTyxLQUFBLFNBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxZQUFHLEtBQUEsS0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLFVBQUEsTUFBQSxHQUFTLElBQUEsb0JBQUEsQ0FBYyxLQUFkLE9BQUEsQ0FBVDtBQUNBLGVBQUEsU0FBQSxHQUFhLE1BQU0sQ0FBTixhQUFBLENBQXFCLEtBQUEsTUFBQSxHQUFyQixlQUFxQixFQUFyQixFQUZmLE1BRUU7QUFGRixTQUFBLE1BQUE7QUFJRSxlQUFBLFNBQUEsR0FBYSxLQUFBLEdBQUEsR0FBTyxLQUFBLE1BQUEsR0FKdEIsT0FJc0IsRUFBcEI7QUFMSjs7O0FBTUEsYUFBTyxLQUFDLFNBQVI7QUFQUztBQXJLTjtBQUFBO0FBQUEsNENBNktvQixJQTdLcEIsRUE2S29CO0FBQ3ZCLFVBQUEsR0FBQTs7QUFBQSxVQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBTSxJQUFBLE1BQUEsQ0FBVyxVQUFRLEtBQVIsU0FBUSxFQUFSLEdBQVgsR0FBQSxFQUFBLElBQUEsQ0FBTjtBQUNBLGVBQU8sSUFBSSxDQUFKLE9BQUEsQ0FBQSxHQUFBLEVBRlQsRUFFUyxDQUFQO0FBRkYsT0FBQSxNQUFBO0FBSUUsZUFKRixJQUlFOztBQUxxQjtBQTdLcEI7QUFBQTtBQUFBLHNDQW1MYyxJQW5MZCxFQW1MYztBQUNqQixVQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFJLENBQUosSUFBQSxFQUFYO0FBQ0EsTUFBQSxNQUFBLEdBQVMsSUFBQSxvQkFBQSxDQUFjLEtBQWQsT0FBQSxDQUFUO0FBQ0EsTUFBQSxNQUFNLENBQU4sY0FBQSxDQUFzQixRQUFRLENBQTlCLGlCQUFzQixFQUF0QixFQUFBLEtBQUE7O0FBQ0EsVUFBRyxLQUFBLFNBQUEsQ0FBSCxZQUFHLENBQUgsRUFBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBTixZQUFBLENBQUEsUUFBQSxDQUFOO0FBREYsbUJBRTJCLENBQUMsR0FBRyxDQUFKLEtBQUEsRUFBWSxHQUFHLENBQWYsR0FBQSxDQUYzQjtBQUVHLFFBQUEsSUFBSSxDQUFMLEtBRkY7QUFFZSxRQUFBLElBQUksQ0FBakIsR0FGRjtBQUdFLGFBQUEsU0FBQSxHQUFhLE1BQU0sQ0FBQyxNQUFwQjtBQUNBLFFBQUEsSUFBSSxDQUFKLElBQUEsR0FBWSxLQUFBLFdBQUEsQ0FBYSxJQUFJLENBSi9CLElBSWMsQ0FBWjtBQUpGLE9BQUEsTUFBQTtBQU1FLFFBQUEsSUFBSSxDQUFKLElBQUEsR0FBWSxLQUFBLFdBQUEsQ0FBYSxJQUFJLENBQWpCLElBQUEsQ0FBWjtBQUNBLFFBQUEsSUFBSSxDQUFKLEtBQUEsR0FBYSxRQUFRLENBQVIsT0FBQSxFQUFiO0FBQ0EsUUFBQSxJQUFJLENBQUosR0FBQSxHQUFXLFFBQVEsQ0FBUixPQUFBLEVBQVg7QUFDQSxRQUFBLEdBQUEsR0FBTSxNQUFNLENBQU4sYUFBQSxDQUFxQixRQUFRLENBQVIsZUFBQSxLQUE2QixLQUFDLFFBQUQsQ0FBN0IsTUFBQSxHQUFnRCxJQUFJLENBQXBELElBQUEsR0FBNEQsS0FBQyxRQUFELENBQTVELE1BQUEsR0FBK0UsUUFBUSxDQUE1RyxlQUFvRyxFQUFwRyxFQUFnSTtBQUFDLFVBQUEsU0FBQSxFQUFVO0FBQVgsU0FBaEksQ0FBTjs7QUFURix5QkFVd0MsR0FBRyxDQUFILEtBQUEsQ0FBVSxLQUFDLFFBQUQsQ0FWbEQsTUFVd0MsQ0FWeEM7O0FBQUE7O0FBVUcsUUFBQSxJQUFJLENBQUwsTUFWRjtBQVVlLFFBQUEsSUFBSSxDQUFqQixJQVZGO0FBVXlCLFFBQUEsSUFBSSxDQUEzQixNQVZGOzs7QUFXQSxhQUFPLElBQVA7QUFmaUI7QUFuTGQ7QUFBQTtBQUFBLHdDQW1NZ0IsSUFuTWhCLEVBbU1nQjtBQUNuQixVQUFBLFNBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksSUFBSSxDQUFKLGtCQUFBLEVBQVo7O0FBQ0EsVUFBRyxLQUFBLEdBQUEsSUFBQSxJQUFBLElBQVUsS0FBQyxRQUFELENBQVYsV0FBQSxJQUFvQyxLQUFBLFNBQUEsQ0FBdkMsYUFBdUMsQ0FBdkMsRUFBQTtBQUNFLFlBQUcsQ0FBQSxDQUFBLEdBQUEsS0FBQSxRQUFBLENBQUEsWUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsS0FBSCxJQUFBLEVBQUE7QUFDRSxVQUFBLFNBQUEsR0FBWSxJQUFJLENBQUosS0FBQSxHQUFXLElBQUksQ0FBQyxNQUFMLENBQVgsTUFBQSxHQURkLENBQ0U7OztBQUNGLFFBQUEsSUFBSSxDQUFKLElBQUEsR0FBWSxLQUFDLFFBQUQsQ0FBQSxZQUFBLENBQXVCLElBQUksQ0FIekMsSUFHYyxDQUFaOzs7QUFDRixhQUFPLFNBQVA7QUFObUI7QUFuTWhCO0FBQUE7QUFBQSwrQkEwTU8sSUExTVAsRUEwTU87QUFDVixVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxXQUFBLEVBQUEsWUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsWUFBQTs7QUFBQSxVQUFHLEtBQUEsUUFBQSxJQUFBLElBQUEsSUFBZSxLQUFDLFFBQUQsQ0FBQSxNQUFBLEdBQWxCLENBQUEsRUFBQTtBQUNFLFFBQUEsWUFBQSxHQUFlLENBQUEsSUFBQSxDQUFmO0FBQ0EsUUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFKLFlBQUEsRUFBZjtBQUNBLFFBQUEsR0FBQSxHQUFBLEtBQUEsUUFBQTs7QUFBQSxhQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBOzs7QUFDRSxjQUFHLENBQUEsS0FBSCxDQUFBLEVBQUE7QUFDRSxZQUFBLFdBQUEsR0FBYyxHQUFHLENBRG5CLEtBQ0U7QUFERixXQUFBLE1BQUE7QUFHRSxZQUFBLE9BQUEsR0FBVSxJQUFJLENBQUosSUFBQSxHQUFBLFdBQUEsQ0FBd0IsR0FBRyxDQUFILEtBQUEsR0FBeEIsV0FBQSxDQUFWOztBQUNBLGdCQUFHLE9BQU8sQ0FBUCxZQUFBLE9BQUgsWUFBQSxFQUFBO0FBQ0UsY0FBQSxZQUFZLENBQVosSUFBQSxDQURGLE9BQ0U7QUFMSjs7QUFERjs7QUFPQSxlQVZGLFlBVUU7QUFWRixPQUFBLE1BQUE7QUFZRSxlQUFPLENBWlQsSUFZUyxDQUFQOztBQWJRO0FBMU1QO0FBQUE7QUFBQSxnQ0F3TlEsSUF4TlIsRUF3TlE7YUFDWCxLQUFBLGdCQUFBLENBQWtCLElBQUEsd0JBQUEsQ0FBZ0IsS0FBaEIsR0FBQSxFQUFxQixLQUFyQixTQUFxQixFQUFyQixFQUFsQixJQUFrQixDQUFsQixDO0FBRFc7QUF4TlI7QUFBQTtBQUFBLHFDQTBOYSxJQTFOYixFQTBOYTtBQUNoQixVQUFBLFNBQUEsRUFBQSxZQUFBO0FBQUEsTUFBQSxJQUFJLENBQUosVUFBQSxDQUFnQixLQUFDLFFBQUQsQ0FBaEIsTUFBQTs7QUFDQSxVQUFHLEtBQUEsS0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGFBQUEsaUJBQUEsQ0FERixJQUNFO0FBREYsT0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFJLENBQUosSUFBQSxHQUFZLEtBQUEsV0FBQSxDQUFhLElBQUksQ0FIL0IsSUFHYyxDQUFaOzs7QUFDRixNQUFBLFNBQUEsR0FBWSxLQUFBLG1CQUFBLENBQUEsSUFBQSxDQUFaO0FBQ0EsTUFBQSxJQUFJLENBQUosVUFBQSxHQUFrQixDQUFDLElBQUEsUUFBQSxDQUFBLFNBQUEsRUFBRCxTQUFDLENBQUQsQ0FBbEI7QUFDQSxNQUFBLFlBQUEsR0FBZSxLQUFBLFVBQUEsQ0FBQSxJQUFBLENBQWY7QUFDQSxXQUFDLFFBQUQsQ0FBVSxNQUFWLENBQUEsaUJBQUEsQ0FBQSxZQUFBO0FBRUEsV0FBQSxZQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFyQjthQUNBLEtBQUEsVUFBQSxHQUFjLElBQUksQ0FBSixNQUFBLEU7QUFaRTtBQTFOYjs7QUFBQTtBQUFBLEVBQUEseUJBQUEsQ0FBUDs7Ozs7Ozs7Ozs7Ozs7QUNaQSxJQUFhLE9BQU4sR0FDTCxtQkFBYTtBQUFBO0FBQUEsQ0FEZjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQ0EsSUFBYSxPQUFOO0FBQUE7QUFBQTtBQUNMLHFCQUFhO0FBQUE7QUFBQTs7QUFEUjtBQUFBO0FBQUEseUJBRUMsR0FGRCxFQUVDLEdBRkQsRUFFQzthQUNKLFlBQVksQ0FBWixPQUFBLENBQXFCLEtBQUEsT0FBQSxDQUFyQixHQUFxQixDQUFyQixFQUFvQyxJQUFJLENBQUosU0FBQSxDQUFwQyxHQUFvQyxDQUFwQyxDO0FBREk7QUFGRDtBQUFBO0FBQUEseUJBSUMsR0FKRCxFQUlDO2FBQ0osSUFBSSxDQUFKLEtBQUEsQ0FBVyxZQUFZLENBQVosT0FBQSxDQUFxQixLQUFBLE9BQUEsQ0FBaEMsR0FBZ0MsQ0FBckIsQ0FBWCxDO0FBREk7QUFKRDtBQUFBO0FBQUEsNEJBTUksR0FOSixFQU1JO2FBQ1AsY0FBWSxHO0FBREw7QUFOSjs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7OztBQ0RBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFEQSxJQUFBLFNBQUE7O0FBR0EsSUFBYSxjQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsbUNBQ1csTUFEWCxFQUNXO0FBQUE7O0FBRWQsVUFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBVjs7QUFFQSxNQUFBLFNBQUEsR0FBWSxtQkFBQSxDQUFBLEVBQUE7QUFDVixZQUFHLENBQUMsUUFBUSxDQUFDLFNBQVQsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxJQUFpQyxLQUFDLENBQUQsR0FBQSxLQUFRLFFBQVEsQ0FBbEQsYUFBQSxLQUFzRSxDQUFDLENBQUQsT0FBQSxLQUF0RSxFQUFBLElBQXlGLENBQUMsQ0FBN0YsT0FBQSxFQUFBO0FBQ0UsVUFBQSxDQUFDLENBQUQsY0FBQTs7QUFDQSxjQUFHLEtBQUEsQ0FBQSxlQUFBLElBQUgsSUFBQSxFQUFBO21CQUNFLEtBQUMsQ0FESCxlQUNFLEU7QUFISjs7QUFEVSxPQUFaOztBQUtBLE1BQUEsT0FBQSxHQUFVLGlCQUFBLENBQUEsRUFBQTtBQUNSLFlBQUcsS0FBQSxDQUFBLFdBQUEsSUFBSCxJQUFBLEVBQUE7aUJBQ0UsS0FBQyxDQUFELFdBQUEsQ0FERixDQUNFLEM7O0FBRk0sT0FBVjs7QUFHQSxNQUFBLFVBQUEsR0FBYSxvQkFBQSxDQUFBLEVBQUE7QUFDWCxZQUF5QixPQUFBLElBQXpCLElBQUEsRUFBQTtBQUFBLFVBQUEsWUFBQSxDQUFBLE9BQUEsQ0FBQTs7O2VBQ0EsT0FBQSxHQUFVLFVBQUEsQ0FBWSxZQUFBO0FBQ3BCLGNBQUcsS0FBQSxDQUFBLFdBQUEsSUFBSCxJQUFBLEVBQUE7bUJBQ0UsS0FBQyxDQUFELFdBQUEsQ0FERixDQUNFLEM7O0FBRk0sU0FBQSxFQUFBLEdBQUEsQztBQUZDLE9BQWI7O0FBT0EsVUFBRyxNQUFNLENBQVQsZ0JBQUEsRUFBQTtBQUNJLFFBQUEsTUFBTSxDQUFOLGdCQUFBLENBQUEsU0FBQSxFQUFBLFNBQUE7QUFDQSxRQUFBLE1BQU0sQ0FBTixnQkFBQSxDQUFBLE9BQUEsRUFBQSxPQUFBO2VBQ0EsTUFBTSxDQUFOLGdCQUFBLENBQUEsVUFBQSxFQUhKLFVBR0ksQztBQUhKLE9BQUEsTUFJSyxJQUFHLE1BQU0sQ0FBVCxXQUFBLEVBQUE7QUFDRCxRQUFBLE1BQU0sQ0FBTixXQUFBLENBQUEsV0FBQSxFQUFBLFNBQUE7QUFDQSxRQUFBLE1BQU0sQ0FBTixXQUFBLENBQUEsU0FBQSxFQUFBLE9BQUE7ZUFDQSxNQUFNLENBQU4sV0FBQSxDQUFBLFlBQUEsRUFIQyxVQUdELEM7O0FBMUJVO0FBRFg7O0FBQUE7QUFBQSxHQUFQOzs7O0FBNkJBLFNBQUEsR0FBWSxtQkFBQSxHQUFBLEVBQUE7QUFDVixNQUFBLENBQUE7O0FBQUEsTUFBQTs7V0FFRSxHQUFBLFlBRkYsVztBQUFBLEdBQUEsQ0FBQSxPQUFBLEtBQUEsRUFBQTtBQUdNLElBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FITixDOzs7O0FBT0UsV0FBUSxRQUFBLEdBQUEsTUFBRCxRQUFBLElBQ0osR0FBRyxDQUFILFFBQUEsS0FESSxDQUFBLElBQ2lCLFFBQU8sR0FBRyxDQUFWLEtBQUEsTUFEakIsUUFBQSxJQUVKLFFBQU8sR0FBRyxDQUFWLGFBQUEsTUFUTCxRQU9FOztBQVJRLENBQVo7O0FBYUEsSUFBYSxjQUFBLEdBQUEsWUFBQTtBQUFBLE1BQU4sY0FBTTtBQUFBO0FBQUE7QUFBQTs7QUFDWCw0QkFBYSxPQUFiLEVBQWE7QUFBQTs7QUFBQTs7O0FBQUMsYUFBQyxNQUFELEdBQUMsT0FBRDtBQUVaLGFBQUEsR0FBQSxHQUFVLFNBQUEsQ0FBVSxPQUFiLE1BQUcsQ0FBQSxHQUF3QixPQUEzQixNQUFHLEdBQXFDLFFBQVEsQ0FBUixjQUFBLENBQXdCLE9BQXhCLE1BQUEsQ0FBL0M7O0FBQ0EsVUFBTyxPQUFBLEdBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxjQURGLG9CQUNFOzs7QUFDRixhQUFBLFNBQUEsR0FBYSxVQUFiO0FBQ0EsYUFBQSxlQUFBLEdBQW1CLEVBQW5CO0FBQ0EsYUFBQSxnQkFBQSxHQUFvQixDQUFwQjtBQVBXO0FBQUE7O0FBREY7QUFBQTtBQUFBLGtDQVVFLENBVkYsRUFVRTtBQUNYLFlBQUEsUUFBQSxFQUFBLENBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUE7O0FBQUEsWUFBRyxLQUFBLGdCQUFBLElBQUgsQ0FBQSxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQUEsS0FBQSxlQUFBO0FBQUEsVUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxlQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsSUFBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7eUJBQ0UsUUFBQSxFO0FBREY7O2lCQURGLE87QUFBQSxTQUFBLE1BQUE7QUFJRSxlQUFBLGdCQUFBOztBQUNBLGNBQXFCLEtBQUEsY0FBQSxJQUFyQixJQUFBLEVBQUE7bUJBQUEsS0FBQSxjQUFBLEU7QUFMRjs7QUFEVztBQVZGO0FBQUE7QUFBQSx3Q0FpQk07QUFBQSxZQUFDLEVBQUQsdUVBQUEsQ0FBQTtlQUNmLEtBQUEsZ0JBQUEsSUFBcUIsRTtBQUROO0FBakJOO0FBQUE7QUFBQSwrQkFtQkQsUUFuQkMsRUFtQkQ7QUFDUixhQUFBLGVBQUEsR0FBbUIsWUFBQTtpQkFBRyxRQUFRLENBQVIsZUFBQSxFO0FBQUgsU0FBbkI7O2VBQ0EsS0FBQSxjQUFBLENBQUEsUUFBQSxDO0FBRlE7QUFuQkM7QUFBQTtBQUFBLDRDQXNCVTtlQUNuQixvQkFBb0IsS0FBQyxHO0FBREY7QUF0QlY7QUFBQTtBQUFBLGlDQXdCRDtlQUNSLFFBQVEsQ0FBUixhQUFBLEtBQTBCLEtBQUMsRztBQURuQjtBQXhCQztBQUFBO0FBQUEsMkJBMEJMLEdBMUJLLEVBMEJMO0FBQ0osWUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsY0FBQSxDQUFPLEtBQUEsZUFBQSxDQUFQLEdBQU8sQ0FBUCxFQUFBO0FBQ0UsaUJBQUMsR0FBRCxDQUFBLEtBQUEsR0FERixHQUNFO0FBRko7OztlQUdBLEtBQUMsR0FBRCxDQUFLLEs7QUFKRDtBQTFCSztBQUFBO0FBQUEsaUNBK0JDLEtBL0JELEVBK0JDLEdBL0JELEVBK0JDLElBL0JELEVBK0JDO2VBQ1YsS0FBQSxlQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxHQUFBLEtBQXNDLEtBQUEseUJBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxFQUR4QyxHQUN3QyxDQUF0QyxtRkFBc0YsS0FBdEYsRUFBc0YsR0FBdEYsRUFBc0YsSUFBdEYsQztBQURVO0FBL0JEO0FBQUE7QUFBQSxzQ0FpQ00sSUFqQ04sRUFpQ007QUFBQSxZQUFPLEtBQVAsdUVBQUEsQ0FBQTtBQUFBLFlBQWtCLEdBQWxCLHVFQUFBLElBQUE7QUFDZixZQUFBLEtBQUE7O0FBQUEsWUFBNkMsUUFBQSxDQUFBLFdBQUEsSUFBN0MsSUFBQSxFQUFBO0FBQUEsVUFBQSxLQUFBLEdBQVEsUUFBUSxDQUFSLFdBQUEsQ0FBUixXQUFRLENBQVI7OztBQUNBLFlBQUcsS0FBQSxJQUFBLElBQUEsSUFBVyxLQUFBLENBQUEsYUFBQSxJQUFYLElBQUEsSUFBb0MsS0FBSyxDQUFMLFNBQUEsS0FBdkMsS0FBQSxFQUFBO0FBQ0UsY0FBd0IsR0FBQSxJQUF4QixJQUFBLEVBQUE7QUFBQSxZQUFBLEdBQUEsR0FBTSxLQUFOLE9BQU0sRUFBTjs7O0FBQ0EsY0FBRyxJQUFJLENBQUosTUFBQSxHQUFILENBQUEsRUFBQTtBQUNFLGdCQUFHLEtBQUEsS0FBSCxDQUFBLEVBQUE7QUFDRSxjQUFBLElBQUEsR0FBTyxLQUFBLFVBQUEsQ0FBWSxLQUFBLEdBQVosQ0FBQSxFQUFBLEtBQUEsQ0FBUDtBQUNBLGNBQUEsS0FGRjtBQUFBLGFBQUEsTUFHSyxJQUFHLEdBQUEsS0FBTyxLQUFWLE9BQVUsRUFBVixFQUFBO0FBQ0gsY0FBQSxJQUFBLEdBQU8sS0FBQSxVQUFBLENBQUEsR0FBQSxFQUFnQixHQUFBLEdBQWhCLENBQUEsQ0FBUDtBQUNBLGNBQUEsR0FGRztBQUFBLGFBQUEsTUFBQTtBQUlILHFCQUpHLEtBSUg7QUFSSjs7O0FBU0EsVUFBQSxLQUFLLENBQUwsYUFBQSxDQUFBLFdBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBVkEsQ0FVQSxFQVhGLEM7O0FBYUUsZUFBQyxHQUFELENBQUEsY0FBQSxHQUFzQixLQUF0QjtBQUNBLGVBQUMsR0FBRCxDQUFBLFlBQUEsR0FBb0IsR0FBcEI7QUFDQSxlQUFDLEdBQUQsQ0FBQSxhQUFBLENBQUEsS0FBQTtBQUNBLGVBQUEsZUFBQTtpQkFoQkYsSTtBQUFBLFNBQUEsTUFBQTtpQkFBQSxLOztBQUZlO0FBakNOO0FBQUE7QUFBQSxnREF1RGdCLElBdkRoQixFQXVEZ0I7QUFBQSxZQUFPLEtBQVAsdUVBQUEsQ0FBQTtBQUFBLFlBQWtCLEdBQWxCLHVFQUFBLElBQUE7O0FBQ3pCLFlBQUcsUUFBQSxDQUFBLFdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxjQUF3QixHQUFBLElBQXhCLElBQUEsRUFBQTtBQUFBLFlBQUEsR0FBQSxHQUFNLEtBQU4sT0FBTSxFQUFOOzs7QUFDQSxlQUFDLEdBQUQsQ0FBQSxjQUFBLEdBQXNCLEtBQXRCO0FBQ0EsZUFBQyxHQUFELENBQUEsWUFBQSxHQUFvQixHQUFwQjtpQkFDQSxRQUFRLENBQVIsV0FBQSxDQUFBLFlBQUEsRUFBQSxLQUFBLEVBSkYsSUFJRSxDO0FBSkYsU0FBQSxNQUFBO2lCQUFBLEs7O0FBRHlCO0FBdkRoQjtBQUFBO0FBQUEscUNBZ0VHO0FBQ1osWUFBd0IsS0FBQSxZQUFBLElBQXhCLElBQUEsRUFBQTtBQUFBLGlCQUFPLEtBQVAsWUFBQTs7O0FBQ0EsWUFBRyxLQUFILFFBQUEsRUFBQTtBQUNFLGNBQUcsS0FBSCxtQkFBQSxFQUFBO21CQUNFLElBQUEsUUFBQSxDQUFRLEtBQUMsR0FBRCxDQUFSLGNBQUEsRUFBNEIsS0FBQyxHQUFELENBRDlCLFlBQ0UsQztBQURGLFdBQUEsTUFBQTttQkFHRSxLQUhGLG9CQUdFLEU7QUFKSjs7QUFGWTtBQWhFSDtBQUFBO0FBQUEsNkNBdUVXO0FBQ3BCLFlBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTs7QUFBQSxZQUFHLEtBQUMsR0FBRCxDQUFILGVBQUEsRUFBQTtBQUNFLFVBQUEsR0FBQSxHQUFNLFFBQVEsQ0FBQyxTQUFULENBQUEsV0FBQSxFQUFOOztBQUNBLGNBQUcsR0FBRyxDQUFILGFBQUEsT0FBdUIsS0FBMUIsR0FBQSxFQUFBO0FBQ0UsWUFBQSxHQUFBLEdBQU0sS0FBQyxHQUFELENBQUEsZUFBQSxFQUFOO0FBQ0EsWUFBQSxHQUFHLENBQUgsY0FBQSxDQUFtQixHQUFHLENBQXRCLFdBQW1CLEVBQW5CO0FBQ0EsWUFBQSxHQUFBLEdBQU0sQ0FBTjs7QUFFQSxtQkFBTSxHQUFHLENBQUgsZ0JBQUEsQ0FBQSxZQUFBLEVBQUEsR0FBQSxJQUFOLENBQUEsRUFBQTtBQUNFLGNBQUEsR0FBQTtBQUNBLGNBQUEsR0FBRyxDQUFILE9BQUEsQ0FBQSxXQUFBLEVBQXlCLENBQXpCLENBQUE7QUFGRjs7QUFHQSxZQUFBLEdBQUcsQ0FBSCxXQUFBLENBQUEsY0FBQSxFQUFnQyxLQUFDLEdBQUQsQ0FBaEMsZUFBZ0MsRUFBaEM7QUFDQSxZQUFBLEdBQUEsR0FBTSxJQUFBLFFBQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFOOztBQUNBLG1CQUFNLEdBQUcsQ0FBSCxnQkFBQSxDQUFBLFlBQUEsRUFBQSxHQUFBLElBQU4sQ0FBQSxFQUFBO0FBQ0UsY0FBQSxHQUFHLENBQUgsS0FBQTtBQUNBLGNBQUEsR0FBRyxDQUFILEdBQUE7QUFDQSxjQUFBLEdBQUcsQ0FBSCxPQUFBLENBQUEsV0FBQSxFQUF5QixDQUF6QixDQUFBO0FBSEY7O0FBSUEsbUJBZEYsR0FjRTtBQWhCSjs7QUFEb0I7QUF2RVg7QUFBQTtBQUFBLG1DQXlGRyxLQXpGSCxFQXlGRyxHQXpGSCxFQXlGRztBQUFBOztBQUNaLFlBQWUsU0FBUyxDQUFULE1BQUEsR0FBZixDQUFBLEVBQUE7QUFBQSxVQUFBLEdBQUEsR0FBQSxLQUFBOzs7QUFDQSxZQUFHLEtBQUgsbUJBQUEsRUFBQTtBQUNFLGVBQUEsWUFBQSxHQUFnQixJQUFBLFFBQUEsQ0FBQSxLQUFBLEVBQUEsR0FBQSxDQUFoQjtBQUNBLGVBQUMsR0FBRCxDQUFBLGNBQUEsR0FBc0IsS0FBdEI7QUFDQSxlQUFDLEdBQUQsQ0FBQSxZQUFBLEdBQW9CLEdBQXBCO0FBQ0EsVUFBQSxVQUFBLENBQVksWUFBQTtBQUNWLFlBQUEsTUFBQyxDQUFELFlBQUEsR0FBZ0IsSUFBaEI7QUFDQSxZQUFBLE1BQUMsQ0FBQSxHQUFELENBQUEsY0FBQSxHQUFzQixLQUF0QjttQkFDQSxNQUFDLENBQUEsR0FBRCxDQUFBLFlBQUEsR0FBb0IsRztBQUh0QixXQUFBLEVBSkYsQ0FJRSxDQUFBO0FBSkYsU0FBQSxNQUFBO0FBVUUsZUFBQSxvQkFBQSxDQUFBLEtBQUEsRUFWRixHQVVFOztBQVpVO0FBekZIO0FBQUE7QUFBQSwyQ0F1R1csS0F2R1gsRUF1R1csR0F2R1gsRUF1R1c7QUFDcEIsWUFBQSxHQUFBOztBQUFBLFlBQUcsS0FBQyxHQUFELENBQUgsZUFBQSxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sS0FBQyxHQUFELENBQUEsZUFBQSxFQUFOO0FBQ0EsVUFBQSxHQUFHLENBQUgsU0FBQSxDQUFBLFdBQUEsRUFBQSxLQUFBO0FBQ0EsVUFBQSxHQUFHLENBQUgsUUFBQTtBQUNBLFVBQUEsR0FBRyxDQUFILE9BQUEsQ0FBQSxXQUFBLEVBQXlCLEdBQUEsR0FBekIsS0FBQTtpQkFDQSxHQUFHLENBTEwsTUFLRSxFOztBQU5rQjtBQXZHWDtBQUFBO0FBQUEsZ0NBOEdGO0FBQ1AsWUFBaUIsS0FBakIsS0FBQSxFQUFBO0FBQUEsaUJBQU8sS0FBUCxLQUFBOzs7QUFDQSxZQUFrQyxLQUFDLEdBQUQsQ0FBQSxZQUFBLENBQWxDLFdBQWtDLENBQWxDLEVBQUE7aUJBQUEsS0FBQyxHQUFELENBQUEsWUFBQSxDQUFBLFdBQUEsQzs7QUFGTztBQTlHRTtBQUFBO0FBQUEsOEJBaUhGLEdBakhFLEVBaUhGO0FBQ1AsYUFBQSxLQUFBLEdBQVMsR0FBVDtlQUNBLEtBQUMsR0FBRCxDQUFBLFlBQUEsQ0FBQSxXQUFBLEVBQUEsR0FBQSxDO0FBRk87QUFqSEU7QUFBQTtBQUFBLDBDQW9IUTtBQUNqQixlQUFPLElBQVA7QUFEaUI7QUFwSFI7QUFBQTtBQUFBLHdDQXNIUSxRQXRIUixFQXNIUTtlQUNqQixLQUFDLGVBQUQsQ0FBQSxJQUFBLENBQUEsUUFBQSxDO0FBRGlCO0FBdEhSO0FBQUE7QUFBQSwyQ0F3SFcsUUF4SFgsRUF3SFc7QUFDcEIsWUFBQSxDQUFBOztBQUFBLFlBQUcsQ0FBQyxDQUFBLEdBQUksS0FBQyxlQUFELENBQUEsT0FBQSxDQUFMLFFBQUssQ0FBTCxJQUEyQyxDQUE5QyxDQUFBLEVBQUE7aUJBQ0UsS0FBQyxlQUFELENBQUEsTUFBQSxDQUFBLENBQUEsRUFERixDQUNFLEM7O0FBRmtCO0FBeEhYO0FBQUE7QUFBQSx3Q0E2SFEsWUE3SFIsRUE2SFE7QUFDakIsWUFBRyxZQUFZLENBQVosTUFBQSxHQUFBLENBQUEsSUFBNEIsWUFBYSxDQUFBLENBQUEsQ0FBYixDQUFnQixVQUFoQixDQUFBLE1BQUEsR0FBL0IsQ0FBQSxFQUFBO0FBQ0UsVUFBQSxZQUFhLENBQUEsQ0FBQSxDQUFiLENBQUEsVUFBQSxHQUE2QixDQUFDLEtBRGhDLFlBQ2dDLEVBQUQsQ0FBN0I7OztBQUZKLHFHQUdFLFlBSEY7QUFBbUI7QUE3SFI7O0FBQUE7QUFBQSxJQUFOLHVCQUFNOztBQUFOOzJCQVNMLGMsR0FBZ0IsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsYzs7Q0FUOUIsQyxJQUFBLFFBQWI7Ozs7Ozs7Ozs7OztBQ3pDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFhLFVBQU47QUFBQTtBQUFBO0FBQUE7O0FBQ0wsc0JBQWEsS0FBYixFQUFhO0FBQUE7O0FBQUE7OztBQUFDLFVBQUMsS0FBRCxHQUFDLEtBQUQ7QUFFWixJQUFBLElBQUksQ0FBSixTQUFBLEdBQWlCLGFBQWpCO0FBRlc7QUFBQTs7QUFEUjtBQUFBO0FBQUEseUJBSUMsR0FKRCxFQUlDO0FBQ0osVUFBZ0IsR0FBQSxJQUFoQixJQUFBLEVBQUE7QUFBQSxhQUFBLEtBQUEsR0FBQSxHQUFBOzs7YUFDQSxLQUFDLEs7QUFGRztBQUpEO0FBQUE7QUFBQSwrQkFPTyxHQVBQLEVBT087QUFDVixhQUFPLEtBQUEsSUFBQSxHQUFRLEdBQVIsQ0FBUDtBQURVO0FBUFA7QUFBQTtBQUFBLDRCQVNJLEdBVEosRUFTSTtBQUNQLGFBQU8sS0FBQSxJQUFBLEdBQVEsTUFBZjtBQURPO0FBVEo7QUFBQTtBQUFBLCtCQVdPLEtBWFAsRUFXTyxHQVhQLEVBV087QUFDVixhQUFPLEtBQUEsSUFBQSxHQUFBLFNBQUEsQ0FBQSxLQUFBLEVBQUEsR0FBQSxDQUFQO0FBRFU7QUFYUDtBQUFBO0FBQUEsaUNBYVMsSUFiVCxFQWFTLEdBYlQsRUFhUzthQUNaLEtBQUEsSUFBQSxDQUFNLEtBQUEsSUFBQSxHQUFBLFNBQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsR0FBK0IsS0FBQSxJQUFBLEdBQUEsU0FBQSxDQUFBLEdBQUEsRUFBc0IsS0FBQSxJQUFBLEdBQTNELE1BQXFDLENBQXJDLEM7QUFEWTtBQWJUO0FBQUE7QUFBQSwrQkFlTyxLQWZQLEVBZU8sR0FmUCxFQWVPLElBZlAsRUFlTzthQUNWLEtBQUEsSUFBQSxDQUFNLEtBQUEsSUFBQSxHQUFBLEtBQUEsQ0FBQSxDQUFBLEVBQUEsS0FBQSxLQUEyQixJQUFBLElBQTNCLEVBQUEsSUFBeUMsS0FBQSxJQUFBLEdBQUEsS0FBQSxDQUEvQyxHQUErQyxDQUEvQyxDO0FBRFU7QUFmUDtBQUFBO0FBQUEsbUNBaUJTO0FBQ1osYUFBTyxLQUFDLE1BQVI7QUFEWTtBQWpCVDtBQUFBO0FBQUEsaUNBbUJTLEtBbkJULEVBbUJTLEdBbkJULEVBbUJTO0FBQ1osVUFBZSxTQUFTLENBQVQsTUFBQSxHQUFmLENBQUEsRUFBQTtBQUFBLFFBQUEsR0FBQSxHQUFBLEtBQUE7OzthQUNBLEtBQUEsTUFBQSxHQUNJO0FBQUEsUUFBQSxLQUFBLEVBQUEsS0FBQTtBQUNBLFFBQUEsR0FBQSxFQUFLO0FBREwsTztBQUhRO0FBbkJUOztBQUFBO0FBQUEsRUFBQSxlQUFBLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsU0FBQSxTQUFBLEdBQWdCLHNCQUFoQjtBQUVBLG1CQUFBLFNBQUEsR0FBcUIsRUFBckI7QUFFQSxpQkFBQSxTQUFBLEdBQW9CLENBQ2xCLElBRGtCLHdDQUNsQixFQURrQixFQUVsQixJQUZrQixvQ0FFbEIsRUFGa0IsRUFHbEIsSUFIa0Isc0NBR2xCLEVBSGtCLENBQXBCOzs7Ozs7Ozs7O0FDWEE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTkEsSUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsWUFBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFFBQUEsRUFBQSxVQUFBLEVBQUEsWUFBQSxFQUFBLGFBQUEsRUFBQSxhQUFBOztBQVFBLElBQWEsbUJBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw2QkFDSSxJQURKLEVBQ0k7QUFDVCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFJLENBQUosTUFBQSxDQUFZLElBQUEsZ0JBQUEsQ0FBWixNQUFZLENBQVosQ0FBUDtBQUNBLE1BQUEsSUFBSSxDQUFKLFdBQUEsQ0FBaUIsSUFBakIsc0JBQWlCLEVBQWpCO2FBRUEsSUFBSSxDQUFKLE9BQUEsQ0FBYTtBQUNYLGdCQUFPO0FBQ0wsd0JBREssSUFBQTtBQUVMLG9CQUZLLG9zQ0FBQTtBQXlDTCxrQkFBUztBQUNQLHdCQUFXO0FBQ1QsNEJBRFMsSUFBQTtBQUVULHdCQUFXO0FBRkYsYUFESjtBQWFQLG1CQUFNO0FBQ0oseUJBQVc7QUFEUCxhQWJDO0FBZ0JQLDJCQUFjO0FBQ1osNEJBRFksSUFBQTtBQUVaLHdCQUFXO0FBRkMsYUFoQlA7QUF3RVAsb0JBQU87QUFDTCx5QkFBVztBQUROLGFBeEVBO0FBMkVQLHVCQUFVO0FBQ1Isc0JBQVM7QUFDUCx5QkFBUTtBQUNOLDRCQUFXO0FBREw7QUFERCxlQUREO0FBZ0JSLDRCQWhCUSxJQUFBO0FBaUJSLHdCQUFXO0FBakJILGFBM0VIO0FBeUlQLG9CQUFPO0FBQ0wseUJBQVc7QUFETjtBQXpJQTtBQXpDSixTQURJO0FBd0xYLHNCQUFhO0FBQ1gsb0JBQVc7QUFEQSxTQXhMRjtBQTJMWCx3QkFBZTtBQUNiLG9CQURhLFlBQUE7QUFFYix5QkFBZ0I7QUFGSCxTQTNMSjtBQStMWCx3QkFBZTtBQUNiLHFCQUFXO0FBREUsU0EvTEo7QUFrTVgsdUJBQWM7QUFDWixxQkFBWTtBQURBLFNBbE1IO0FBcU1YLG1CQUFVO0FBQ1Isb0JBQVc7QUFESCxTQXJNQztBQXdNWCxlQUFNO0FBQ0osaUJBQVE7QUFESixTQXhNSztBQTJNWCxpQkFBUTtBQUNOLGlCQUFRO0FBREYsU0EzTUc7QUE4TVgsaUJBQVE7QUFDTixvQkFBVztBQURMLFNBOU1HO0FBaU5YLGdCQUFPO0FBQ0wsa0JBQVMsT0FBTyxDQUFQLE9BQUEsQ0FBZ0I7QUFDdkIsb0JBQU87QUFDTCx5QkFBVztBQUROO0FBRGdCLFdBQWhCLENBREo7QUFNTCxpQkFBUTtBQU5ILFNBak5JO0FBeU5YLGtCQUFTO0FBQ1Asa0JBQVM7QUFDUCw4QkFETyx5RkFBQTtBQU9QLHlCQUFjO0FBUFAsV0FERjtBQWVQLG9CQWZPLGFBQUE7QUFnQlAsbUJBQVU7QUFoQkgsU0F6TkU7QUEyT1gsa0JBQVM7QUFDUCxrQkFBUztBQUNQLDhCQURPLHlGQUFBO0FBT1AseUJBQWM7QUFQUCxXQURGO0FBZVAsb0JBZk8sYUFBQTtBQWdCUCxtQkFBVTtBQWhCSCxTQTNPRTtBQTZQWCxpQkFBUTtBQUNOLGtCQUFTO0FBQ1AseUJBQWM7QUFEUCxXQURIO0FBU04sb0JBVE0sWUFBQTtBQVVOLG1CQUFVO0FBVkosU0E3UEc7QUF5UVgscUJBQVk7QUFDVixpQkFBUTtBQURFLFNBelFEO0FBNFFYLGdCQUFPO0FBQ0wscUJBQVk7QUFEUCxTQTVRSTtBQStRWCxpQkFBUTtBQUNOLGlCQUFRO0FBREY7QUEvUUcsT0FBYixDO0FBSlM7QUFESjs7QUFBQTtBQUFBLEdBQVA7Ozs7QUEwUkEsVUFBQSxHQUFhLG9CQUFBLFFBQUEsRUFBQTtBQUNYLE1BQUEsR0FBQTtBQUFBLEVBQUEsR0FBQSxHQUFNLElBQUEsTUFBQSxDQUFXLE9BQUssMkJBQUEsWUFBQSxDQUEwQixRQUFRLENBQUMsUUFBVCxDQUEvQixPQUFLLENBQUwsR0FBQSxHQUFBLEdBQWtFLDJCQUFBLFlBQUEsQ0FBMEIsUUFBUSxDQUFDLFFBQVQsQ0FBdkcsYUFBNkUsQ0FBN0UsQ0FBTjtBQUNBLFNBQU8sUUFBUSxDQUFDLEdBQVQsQ0FBQSxPQUFBLENBQUEsR0FBQSxFQUFBLElBQUEsQ0FBUDtBQUZXLENBQWI7O0FBSUEsWUFBQSxHQUFlLHNCQUFBLFFBQUEsRUFBQTtBQUNiLFNBQU8sUUFBUSxDQUFDLE9BQVQsQ0FBQSxPQUFBLENBQUEsS0FBQSxFQURNLElBQ04sQ0FBUCxDQURhLENBQUE7QUFBQSxDQUFmOztBQUVBLFdBQUEsR0FBYyxxQkFBQSxRQUFBLEVBQUE7QUFDWixNQUFBLEdBQUE7O0FBQUEsTUFBRyxRQUFBLENBQUEsTUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLElBQUEsR0FBQSxHQUFNLFFBQVEsQ0FBQyxNQUFULENBQUEsT0FBQSxFQUFOO0FBQ0EsSUFBQSxRQUFRLENBQVIsWUFBQSxHQUF3QixRQUFRLENBQUMsTUFBVCxDQUFnQixZQUF4QztBQUNBLElBQUEsUUFBUSxDQUFSLFVBQUEsR0FBc0IsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsVUFBdEM7QUFDQSxXQUpGLEdBSUU7O0FBTFUsQ0FBZDs7QUFNQSxVQUFBLEdBQWEsb0JBQUEsUUFBQSxFQUFBO0FBQ1gsTUFBQSxhQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUE7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBbEIsZUFBa0IsQ0FBbEIsRUFBQSxLQUFBLENBQWhCO0FBQ0EsRUFBQSxNQUFBLEdBQVMsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBbEIsUUFBa0IsQ0FBbEIsRUFBQSxFQUFBLENBQVQ7QUFDQSxFQUFBLE1BQUEsR0FBUyxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFsQixRQUFrQixDQUFsQixFQUFBLEVBQUEsQ0FBVDs7QUFDQSxNQUFHLFFBQUEsQ0FBQSxRQUFBLENBQUEsVUFBQSxJQUFILElBQUEsRUFBQTtBQUNFLFdBQU8sTUFBQSxJQUFVLFFBQVEsQ0FBQyxRQUFULENBQWtCLFVBQWxCLENBQUEsT0FBQSxJQUFWLEVBQUEsQ0FBQSxHQURULE1BQ0U7OztBQUNGLE1BQUEsYUFBQSxFQUFBO0FBQ0UsV0FBTyxNQUFBLEdBRFQsTUFDRTs7QUFQUyxDQUFiOztBQVFBLGFBQUEsR0FBZ0IsdUJBQUEsUUFBQSxFQUFBO0FBQ2QsTUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxhQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUE7QUFBQSxFQUFBLE9BQUEsR0FBVSxJQUFBLGdCQUFBLEVBQVY7QUFDQSxFQUFBLFNBQUEsR0FBWSxPQUFPLENBQVAsSUFBQSxDQUFBLE1BQUEsQ0FBWjtBQUNBLEVBQUEsYUFBQSxHQUFnQixRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBbEIsTUFBa0IsQ0FBbEIsQ0FBaEI7QUFDQSxFQUFBLE9BQUEsR0FBVSxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBbEIsSUFBa0IsQ0FBbEIsQ0FBVjs7QUFDQSxNQUFHLGFBQUEsSUFBQSxJQUFBLElBQW1CLE9BQUEsSUFBdEIsSUFBQSxFQUFBO0FBQ0UsSUFBQSxHQUFBLEdBQU0sUUFBUSxDQUFDLE9BQVQsQ0FBQSxNQUFBLENBQUEsYUFBQSxDQUFOOztBQUNBLFFBQUcsU0FBQSxDQUFBLGFBQUEsQ0FBQSxJQUFBLElBQUEsSUFBOEIsR0FBQSxJQUFqQyxJQUFBLEVBQUE7QUFDRSxVQUFBLEVBQU8sT0FBTyxDQUFQLE9BQUEsQ0FBQSxHQUFBLElBQXVCLENBQTlCLENBQUEsQ0FBQSxFQUFBO0FBQ0UsUUFBQSxPQUFBLEdBQVUsR0FBRyxDQUFDLFFBQUosQ0FBQSxPQUFBLENBQUEsYUFBQSxFQUFBLEVBQUEsSUFEWixPQUNFOzs7QUFDRixNQUFBLE9BQUEsR0FBVSxTQUFVLENBQUEsYUFBQSxDQUFwQjs7QUFDQSx1QkFBUSxJQUFSLENBQUEsVUFBQSxDQUFBLE9BQUEsRUFBQSxPQUFBOztBQUNBLE1BQUEsR0FBRyxDQUFILFVBQUE7QUFDQSxNQUFBLFNBQVUsQ0FBVixPQUFVLENBQVYsR0FBcUIsT0FBckI7QUFDQSxhQUFPLFNBQVUsQ0FBQSxhQUFBLENBQWpCO0FBQ0EsTUFBQSxPQUFPLENBQVAsSUFBQSxDQUFBLE1BQUEsRUFBQSxTQUFBO0FBQ0EsYUFURixFQVNFO0FBVEYsS0FBQSxNQVVLLElBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNILGFBREcsb0JBQ0g7QUFERyxLQUFBLE1BQUE7QUFHSCxhQUhHLGVBR0g7QUFmSjs7QUFMYyxDQUFoQjs7QUFxQkEsYUFBQSxHQUFnQix1QkFBQSxRQUFBLEVBQUE7QUFDZCxNQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxPQUFBO0FBQUEsRUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBQSxDQUFBLEVBQWxCLE1BQWtCLENBQWxCLENBQVA7O0FBQ0EsTUFBRyxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsSUFBQSxPQUFBLEdBQVUsSUFBQSxnQkFBQSxFQUFWO0FBQ0EsSUFBQSxTQUFBLEdBQVksT0FBTyxDQUFQLElBQUEsQ0FBQSxNQUFBLENBQVo7QUFDQSxJQUFBLEdBQUEsR0FBTSxRQUFRLENBQUMsT0FBVCxDQUFBLE1BQUEsQ0FBQSxJQUFBLENBQU47O0FBQ0EsUUFBRyxTQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsSUFBQSxJQUFxQixHQUFBLElBQXhCLElBQUEsRUFBQTtBQUNFLE1BQUEsT0FBQSxHQUFVLFNBQVUsQ0FBQSxJQUFBLENBQXBCO0FBQ0EsTUFBQSxHQUFHLENBQUgsVUFBQTtBQUNBLGFBQU8sU0FBVSxDQUFBLElBQUEsQ0FBakI7QUFDQSxNQUFBLE9BQU8sQ0FBUCxJQUFBLENBQUEsTUFBQSxFQUFBLFNBQUE7QUFDQSxhQUxGLEVBS0U7QUFMRixLQUFBLE1BTUssSUFBRyxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0gsYUFERyxvQkFDSDtBQURHLEtBQUEsTUFBQTtBQUdILGFBSEcsZUFHSDtBQWJKOztBQUZjLENBQWhCOztBQWdCQSxZQUFBLEdBQWUsc0JBQUEsUUFBQSxFQUFBO0FBQ2IsTUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLElBQUE7QUFBQSxFQUFBLElBQUEsR0FBTyxRQUFRLENBQVIsUUFBQSxDQUFrQixDQUFBLENBQUEsRUFBbEIsTUFBa0IsQ0FBbEIsQ0FBUDtBQUNBLEVBQUEsS0FBQSxHQUFRLFFBQVEsQ0FBUixRQUFBLENBQWtCLENBQUEsQ0FBQSxFQUFsQixPQUFrQixDQUFsQixDQUFSOztBQUNBLE1BQUcsSUFBQSxJQUFBLElBQUEsSUFBVSxLQUFBLElBQWIsSUFBQSxFQUFBO0FBQ0UsSUFBQSxHQUFBLEdBQU0sUUFBUSxDQUFDLE9BQVQsQ0FBQSxNQUFBLENBQUEsSUFBQSxDQUFOOztBQUNBLFFBQUcsR0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLE1BQUEsR0FBQSxHQUFNLEdBQUcsQ0FBSCxVQUFBLE1BQU4sR0FBQSxDQURGLEM7OztBQUlFLHVCQUFBLE9BQUEsQ0FBQSxLQUFBLEVBQXVCO0FBQUUsUUFBQSxPQUFBLEVBQVMsR0FBRyxDQUFDO0FBQWYsT0FBdkI7O0FBQ0EsYUFMRixFQUtFO0FBTEYsS0FBQSxNQUFBO0FBT0UsYUFQRixlQU9FO0FBVEo7O0FBSGEsQ0FBZjs7QUFjQSxRQUFBLEdBQVcsa0JBQUEsUUFBQSxFQUFBO0FBQ1QsTUFBRyxRQUFBLENBQUEsUUFBQSxDQUFBLFVBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxXQUFPLFFBQVEsQ0FBQyxRQUFULENBQWtCLFVBQWxCLENBQUEsUUFBQSxDQUFzQyxRQUFRLENBQTlDLE1BQUEsRUFBc0QsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBQSxLQUFBLEVBRGpGLFNBQ2lGLENBQWxCLENBQXRELENBQVA7O0FBRk8sQ0FBWDs7QUFJTSxNQUFOO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMkJBQ1E7QUFDSixXQUFBLE1BQUEsR0FBVSxJQUFBLG9CQUFBLENBQWMsS0FBQyxRQUFELENBQWQsT0FBQSxDQUFWO0FBQ0EsV0FBQSxHQUFBLEdBQU8sS0FBQyxRQUFELENBQUEsUUFBQSxDQUFtQixDQUFuQixLQUFtQixDQUFuQixDQUFQOztBQUNBLFVBQUcsS0FBQSxHQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsYUFBQyxNQUFELENBQUEsUUFBQSxHQUFvQixLQUFDLFFBQUQsQ0FBVSxRQUFWLENBQUEsT0FBQSxHQUE2QixLQUE3QixHQUFBLEdBQW9DLEtBQUMsUUFBRCxDQUFVLFFBQVYsQ0FBbUIsT0FBM0U7QUFDQSxhQUFDLE1BQUQsQ0FBQSxTQUFBLEdBQW9CLEtBQUMsUUFBRCxDQUFVLFFBQVYsQ0FBQSxPQUFBLEdBQTZCLEtBQUMsUUFBRCxDQUFVLFFBQVYsQ0FBN0IsU0FBQSxHQUE0RCxLQUFDLEdBQUQsQ0FBQSxLQUFBLENBQUEsR0FBQSxFQUE1RCxDQUE0RCxDQUE1RCxHQUFpRixLQUFDLFFBQUQsQ0FBVSxRQUFWLENBRnZHLE9BRUU7OztBQUNGLFdBQUMsTUFBRCxDQUFBLElBQUEsR0FBZSxLQUFDLFFBQUQsQ0FBVSxRQUFWLENBQW1CLElBQWxDO0FBQ0EsV0FBQyxNQUFELENBQUEsR0FBQSxHQUFjLENBQWQ7QUFDQSxXQUFDLE1BQUQsQ0FBQSxNQUFBLEdBQWlCLEtBQUMsUUFBRCxDQUFBLFFBQUEsQ0FBbUIsQ0FBbkIsUUFBbUIsQ0FBbkIsRUFBQSxFQUFBLENBQWpCO2FBQ0EsS0FBQyxNQUFELENBQUEsTUFBQSxHQUFpQixLQUFDLFFBQUQsQ0FBQSxRQUFBLENBQW1CLENBQW5CLFFBQW1CLENBQW5CLEVBQUEsRUFBQSxDO0FBVGI7QUFEUjtBQUFBO0FBQUEsNkJBWVU7QUFDTixVQUFBLE1BQUEsRUFBQSxNQUFBOztBQUFBLFVBQUcsS0FBQSxNQUFBLE1BQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxNQUFBLEdBQVMsS0FBQSxNQUFBLEdBRFgsTUFDRTtBQURGLE9BQUEsTUFBQTtBQUdFLFFBQUEsTUFBQSxHQUhGLENBR0U7OztBQUVGLE1BQUEsTUFBQSxHQUFTLENBQUEsUUFBQSxDQUFUOztBQUNBLFVBQUcsS0FBQyxRQUFELENBQVUsTUFBVixDQUFBLE1BQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxRQUFBLE1BQU0sQ0FBTixJQUFBLENBREYsQ0FDRTtBQURGLE9BQUEsTUFFSyxJQUFHLEtBQUMsUUFBRCxDQUFVLE1BQVYsQ0FBQSxNQUFBLEdBQUgsQ0FBQSxFQUFBO0FBQ0gsUUFBQSxNQUFNLENBQU4sSUFBQSxDQURHLENBQ0g7OztBQUNGLGFBQU8sS0FBQyxRQUFELENBQUEsUUFBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLENBQVA7QUFYTTtBQVpWO0FBQUE7QUFBQSw0QkF5QlM7QUFDTCxVQUFBLE1BQUEsRUFBQSxLQUFBOztBQUFBLFVBQUcsS0FBQSxNQUFBLE1BQUgsSUFBQSxFQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsS0FBQSxNQUFBLEdBRFYsS0FDRTtBQURGLE9BQUEsTUFBQTtBQUdFLFFBQUEsS0FBQSxHQUhGLENBR0U7OztBQUVGLE1BQUEsTUFBQSxHQUFTLENBQUEsT0FBQSxDQUFUOztBQUNBLFVBQUcsS0FBQyxRQUFELENBQVUsTUFBVixDQUFBLE1BQUEsR0FBSCxDQUFBLEVBQUE7QUFDRSxRQUFBLE1BQU0sQ0FBTixJQUFBLENBREYsQ0FDRTs7O0FBQ0YsYUFBTyxJQUFJLENBQUosR0FBQSxDQUFTLEtBQVQsUUFBUyxFQUFULEVBQXNCLEtBQUMsUUFBRCxDQUFBLFFBQUEsQ0FBQSxNQUFBLEVBQXRCLEtBQXNCLENBQXRCLENBQVA7QUFUSztBQXpCVDtBQUFBO0FBQUEsNkJBcUNVO0FBQ04sVUFBRyxLQUFDLFFBQUQsQ0FBSCxPQUFBLEVBQUE7QUFDRSxZQUFPLEtBQUEsT0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGVBQUEsT0FBQSxHQUFXLEtBQUMsTUFBRCxDQUFBLFVBQUEsQ0FBbUIsS0FBQyxRQUFELENBRGhDLE9BQ2EsQ0FBWDs7O0FBQ0YsZUFBTyxLQUhULE9BR0U7O0FBSkk7QUFyQ1Y7QUFBQTtBQUFBLDZCQTJDVTtBQUNOLFdBQUMsTUFBRCxDQUFBLE1BQUEsR0FBaUIsS0FBQSxNQUFBLEVBQWpCO0FBQ0EsV0FBQyxNQUFELENBQUEsS0FBQSxHQUFnQixLQUFBLEtBQUEsRUFBaEI7QUFDQSxhQUFPLEtBQUMsTUFBRCxDQUFBLElBQUEsQ0FBYSxLQUFDLFFBQUQsQ0FBYixPQUFBLENBQVA7QUFITTtBQTNDVjtBQUFBO0FBQUEsK0JBK0NZO0FBQ1IsVUFBRyxLQUFBLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLEtBQUMsR0FBRCxDQURULE1BQ0U7QUFERixPQUFBLE1BQUE7QUFHRSxlQUhGLENBR0U7O0FBSk07QUEvQ1o7O0FBQUE7QUFBQSxFQUFBLG9CQUFBLENBQU07O0FBcURBLFFBQU47QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwyQkFDUTthQUNKLEtBQUEsTUFBQSxHQUFVLElBQUEsb0JBQUEsQ0FBYyxLQUFDLFFBQUQsQ0FBZCxPQUFBLEM7QUFETjtBQURSO0FBQUE7QUFBQSw4QkFHVztBQUNQLFVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLGdCQUFBLEVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEtBQUMsTUFBRCxDQUFBLE1BQUEsR0FBaUIsS0FBQyxRQUFELENBQUEsUUFBQSxDQUFtQixDQUFuQixRQUFtQixDQUFuQixFQUFBLEVBQUEsQ0FBMUI7QUFDQSxNQUFBLE1BQUEsR0FBUyxLQUFDLE1BQUQsQ0FBQSxNQUFBLEdBQWlCLEtBQUMsUUFBRCxDQUFBLFFBQUEsQ0FBbUIsQ0FBbkIsUUFBbUIsQ0FBbkIsRUFBQSxFQUFBLENBQTFCO0FBQ0EsTUFBQSxHQUFBLEdBQU0sS0FBQyxNQUFELENBQUEsWUFBQSxDQUFxQixLQUFDLFFBQUQsQ0FBckIsTUFBcUIsRUFBckIsQ0FBTjtBQUNBLE1BQUEsZ0JBQUEsR0FBbUIsS0FBQyxRQUFELENBQUEsUUFBQSxDQUFtQixDQUFuQixrQkFBbUIsQ0FBbkIsRUFBQSxJQUFBLENBQW5COztBQUNBLFVBQUcsQ0FBSCxnQkFBQSxFQUFBO0FBQ0UsYUFBQyxNQUFELENBQUEsTUFBQSxHQUFpQixLQUFDLE1BQUQsQ0FBQSxNQUFBLEdBQWlCLEVBQWxDO0FBQ0EsUUFBQSxJQUFBLEdBQU8sS0FBQyxNQUFELENBQUEsWUFBQSxDQUFxQixLQUFDLFFBQUQsQ0FBckIsTUFBcUIsRUFBckIsQ0FBUDs7QUFDQSxZQUFHLElBQUEsSUFBQSxJQUFBLEtBQVksR0FBQSxJQUFELElBQUMsSUFBUSxHQUFHLENBQUgsS0FBQSxHQUFZLElBQUksQ0FBSixLQUFBLEdBQWEsTUFBTSxDQUF4QyxNQUFDLElBQWtELEdBQUcsQ0FBSCxHQUFBLEdBQVUsSUFBSSxDQUFKLEdBQUEsR0FBVyxNQUFNLENBQTVGLE1BQUcsQ0FBSCxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBREYsSUFDRTtBQUpKOzs7QUFLQSxVQUFHLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLEtBQUEsR0FBUSxLQUFDLE1BQUQsQ0FBQSxZQUFBLENBQXFCLEtBQUMsUUFBRCxDQUFBLE1BQUEsR0FBckIsS0FBQSxDQUFSOztBQUNBLFlBQUcsS0FBQSxHQUFILENBQUEsRUFBQTtBQUNFLGVBQUMsUUFBRCxDQUFBLEtBQUEsR0FERixJQUNFOzs7ZUFDRixLQUFDLFFBQUQsQ0FBQSxnQkFBQSxDQUEyQixJQUFBLHdCQUFBLENBQWdCLEdBQUcsQ0FBbkIsS0FBQSxFQUEwQixHQUFHLENBQTdCLEdBQUEsRUFKN0IsRUFJNkIsQ0FBM0IsQztBQUpGLE9BQUEsTUFBQTtlQU1FLEtBQUMsUUFBRCxDQUFBLFdBQUEsQ0FORixFQU1FLEM7O0FBaEJLO0FBSFg7O0FBQUE7QUFBQSxFQUFBLG9CQUFBLENBQU07O0FBcUJBLE9BQU47QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwyQkFDUTtBQUNKLFVBQUEsR0FBQTtBQUFBLFdBQUEsT0FBQSxHQUFXLEtBQUMsUUFBRCxDQUFBLFFBQUEsQ0FBbUIsQ0FBQSxDQUFBLEVBQW5CLEtBQW1CLENBQW5CLENBQVg7QUFDQSxXQUFBLFNBQUEsR0FBQSxDQUFBLEdBQUEsR0FBYSxLQUFDLFFBQUQsQ0FBQSxRQUFBLENBQW1CLENBQW5CLENBQW1CLENBQW5CLENBQWIsTUFBYSxHQUFiLElBQWEsR0FBQSxLQUFnQyxXQUE3Qzs7QUFDQSxVQUFHLEtBQUEsT0FBQSxJQUFILElBQUEsRUFBQTtBQUNFLGFBQUEsTUFBQSxHQUFVLEtBQUMsUUFBRCxDQUFVLE9BQVYsQ0FBQSxTQUFBLENBQTRCLEtBQTVCLE9BQUEsQ0FBVjtBQUNBLGFBQUMsTUFBRCxDQUFBLFlBQUEsR0FBdUIsS0FBdkI7QUFDQSxhQUFBLEdBQUEsR0FBTyxLQUFDLE1BQUQsQ0FIVCxJQUdTLEVBQVA7OzthQUNGLEtBQUEsUUFBQSxHQUFlLEtBQUEsR0FBQSxJQUFILElBQUcsR0FBVyxLQUFDLEdBQUQsQ0FBZCxVQUFjLEVBQVgsR0FBa0MsSTtBQVA3QztBQURSO0FBQUE7QUFBQSxpQ0FTYztBQUNWLGFBQU87QUFDTCxRQUFBLFlBQUEsRUFBYyxDQUFBLEtBQUE7QUFEVCxPQUFQO0FBRFU7QUFUZDtBQUFBO0FBQUEsNkJBYVU7QUFDTixVQUFHLEtBQUMsUUFBRCxDQUFILE9BQUEsRUFBQTtBQUNFLGVBQU8sS0FEVCxpQkFDUyxFQUFQO0FBREYsT0FBQSxNQUFBO0FBR0UsZUFBTyxLQUhULG9CQUdTLEVBQVA7O0FBSkk7QUFiVjtBQUFBO0FBQUEsd0NBa0JxQjtBQUNmLFVBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQyxRQUFELENBQUEsZ0JBQUEsQ0FBMkIsS0FBQyxRQUFELENBQTNCLE9BQUEsQ0FBVDtBQUNBLE1BQUEsTUFBTSxDQUFOLFFBQUE7QUFDQSxNQUFBLElBQUEsR0FBTyxFQUFQO0FBQ0EsTUFBQSxHQUFBLEdBQUEsT0FBQSxDQUFBLEtBQUE7O0FBQUEsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7O0FBQ0UsUUFBQSxDQUFDLENBQUQsUUFBQSxDQUFBLE1BQUEsRUFBQSxJQUFBO0FBREY7O0FBRUEsdUJBQUEsT0FBQSxDQUFnQixLQUFoQixPQUFBLEVBQUEsSUFBQTs7QUFDQSxhQUFPLEVBQVA7QUFQZTtBQWxCckI7QUFBQTtBQUFBLG1DQTBCZ0I7QUFDVixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxLQUFDLEdBQVA7QUFDQSxhQUFPLE9BQU8sQ0FBQyxLQUFSLENBQUEsR0FBQSxDQUFtQixVQUFBLENBQUEsRUFBQTtlQUFNLENBQUMsQ0FBRCxPQUFBLENBQUEsR0FBQSxDO0FBQXpCLE9BQUEsRUFBQSxNQUFBLENBQWtELFVBQUEsQ0FBQSxFQUFBO2VBQU0sQ0FBQSxJQUFBLEk7QUFBeEQsT0FBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLENBQVA7QUFGVTtBQTFCaEI7QUFBQTtBQUFBLDJDQTZCd0I7QUFDcEIsVUFBQSxJQUFBLEVBQUEsTUFBQTs7QUFBQSxVQUFHLENBQUMsS0FBRCxHQUFBLElBQVMsS0FBWixRQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBVSxLQUFILEdBQUcsR0FBVSxLQUFDLEdBQUQsQ0FBYixRQUFHLEdBQTZCLEtBQUMsT0FBeEM7QUFDQSxRQUFBLE1BQUEsR0FBUyxLQUFDLFFBQUQsQ0FBQSxnQkFBQSx1QkFFTSxLQUFDLFFBQUQsQ0FBVSxHQUFWLENBRGIsUUFETyxjQUNQLElBRE8sbUJBR0wsS0FISyxZQUdMLEVBSEsscUNBQVQ7QUFPQSxRQUFBLE1BQU0sQ0FBTixXQUFBLEdBQXFCLEtBQXJCOztBQUNPLFlBQUcsS0FBSCxTQUFBLEVBQUE7aUJBQW1CLE1BQU0sQ0FBekIsT0FBbUIsRTtBQUFuQixTQUFBLE1BQUE7aUJBQXlDLE1BQU0sQ0FBL0MsUUFBeUMsRTtBQVZsRDs7QUFEb0I7QUE3QnhCOztBQUFBO0FBQUEsRUFBQSxvQkFBQSxDQUFNOztBQXlDTixPQUFPLENBQVAsT0FBQSxHQUFrQixVQUFBLElBQUEsRUFBQTtBQUNoQixNQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUE7QUFBQSxFQUFBLEdBQUEsR0FBQSxPQUFBLENBQUEsS0FBQTs7QUFBQSxPQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7QUFDRSxJQUFBLENBQUMsQ0FBRCxNQUFBLENBQUEsSUFBQTtBQURGOztBQUVBLFNBQU8sSUFBUDtBQUhnQixDQUFsQjs7QUFJQSxPQUFPLENBQVAsS0FBQSxHQUFnQixDQUNkLElBQUkseUJBQUosT0FBQSxDQUFBLFdBQUEsRUFBNkM7QUFBQyxFQUFBLEdBQUEsRUFBSTtBQUFMLENBQTdDLENBRGMsRUFFZCxJQUFJLHlCQUFKLE9BQUEsQ0FBQSxVQUFBLEVBQTZDO0FBQUMsRUFBQSxHQUFBLEVBQUk7QUFBTCxDQUE3QyxDQUZjLEVBR2QsSUFBSSx5QkFBSixJQUFBLENBQUEsbUJBQUEsRUFBNkM7QUFBQyxFQUFBLEdBQUEsRUFBSTtBQUFMLENBQTdDLENBSGMsRUFJZCxJQUFJLHlCQUFKLElBQUEsQ0FBQSxhQUFBLEVBQTZDO0FBQUMsRUFBQSxHQUFBLEVBQUk7QUFBTCxDQUE3QyxDQUpjLEVBS2QsSUFBSSx5QkFBSixNQUFBLENBQUEsZUFBQSxFQUE2QztBQUFDLEVBQUEsR0FBQSxFQUFJO0FBQUwsQ0FBN0MsQ0FMYyxFQU1kLElBQUkseUJBQUosTUFBQSxDQUFBLFVBQUEsRUFBNkM7QUFBQyxTQUFELFNBQUE7QUFBZ0IsRUFBQSxNQUFBLEVBQU87QUFBdkIsQ0FBN0MsQ0FOYyxFQU9kLElBQUkseUJBQUosTUFBQSxDQUFBLE1BQUEsRUFBNkM7QUFBQyxFQUFBLEtBQUEsRUFBRCxNQUFBO0FBQWUsRUFBQSxTQUFBLEVBQVU7QUFBekIsQ0FBN0MsQ0FQYyxFQVFkLElBQUkseUJBQUosTUFBQSxDQUFBLFFBQUEsRUFBNkM7QUFBQyxTQUFELFdBQUE7QUFBa0IsRUFBQSxRQUFBLEVBQWxCLFFBQUE7QUFBcUMsRUFBQSxTQUFBLEVBQXJDLElBQUE7QUFBcUQsRUFBQSxNQUFBLEVBQU87QUFBNUQsQ0FBN0MsQ0FSYyxDQUFoQjs7QUFVTSxZQUFOO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMkJBQ1E7YUFDSixLQUFBLElBQUEsR0FBUSxLQUFDLFFBQUQsQ0FBQSxRQUFBLENBQW1CLENBQW5CLENBQW1CLENBQW5CLEM7QUFESjtBQURSO0FBQUE7QUFBQSw2QkFHVTtBQUNOLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxHQUFBOztBQUFBLFVBQUcsS0FBQSxJQUFBLElBQUgsSUFBQSxFQUFBO0FBQ0UsYUFBQyxRQUFELENBQVUsUUFBVixDQUFBLE9BQUEsR0FBNkIsT0FBN0IsQ0FBQSxZQUFBLENBQWtELEtBQWxELElBQUE7QUFDQSxlQUZGLEVBRUU7QUFGRixPQUFBLE1BQUE7QUFJRSxRQUFBLFVBQUEsR0FBYSxLQUFDLFFBQUQsQ0FBVSxPQUFWLENBQUEsYUFBQSxFQUFiO0FBQ0EsUUFBQSxHQUFBLEdBQU0sV0FBTjs7QUFDQSxhQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLFVBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7O0FBQ0UsY0FBRyxJQUFBLEtBQVEsS0FBQyxRQUFELENBQVUsR0FBVixDQUFYLFFBQUEsRUFBQTtBQUNFLFlBQUEsR0FBQSxJQUFPLElBQUEsR0FEVCxJQUNFOztBQUZKOztBQUdBLFFBQUEsR0FBQSxJQUFPLHVCQUFQO0FBQ0EsUUFBQSxNQUFBLEdBQVMsS0FBQyxRQUFELENBQUEsZ0JBQUEsQ0FBQSxHQUFBLENBQVQ7QUFDQSxlQUFPLE1BQU0sQ0FYZixRQVdTLEVBQVA7O0FBWkk7QUFIVjs7QUFBQTtBQUFBLEVBQUEsb0JBQUEsQ0FBTTs7QUFtQkEsUUFBTjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNRO0FBQ0osV0FBQSxJQUFBLEdBQVEsS0FBQyxRQUFELENBQUEsUUFBQSxDQUFtQixDQUFBLENBQUEsRUFBQSxNQUFBLEVBQW5CLGNBQW1CLENBQW5CLENBQVI7YUFDQSxLQUFBLElBQUEsR0FBUSxLQUFDLFFBQUQsQ0FBQSxRQUFBLENBQW1CLENBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBbkIsVUFBbUIsQ0FBbkIsQztBQUZKO0FBRFI7QUFBQTtBQUFBLDZCQUlVO0FBQ04sVUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVcsTUFBQSxDQUFBLEtBQUEsSUFBSCxJQUFHLEdBQ1QsTUFBTSxDQURBLEtBQUcsR0FFSCxDQUFBLENBQUEsR0FBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsQ0FBQSxLQUFBLEdBQUEsS0FBQSxDQUFBLEtBQUgsSUFBRyxHQUNOLE1BQU0sQ0FBQyxJQUFQLENBREcsS0FBRyxHQUVBLENBQUEsQ0FBQSxJQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxDQUFBLEtBQUEsR0FBQSxLQUFBLENBQUEsS0FBSCxJQUFHLEdBQ04sTUFBTSxDQUFDLE1BQVAsQ0FERyxLQUFHLEdBQUgsS0FBQSxDQUpMOztBQU1BLFVBQUcsS0FBQSxJQUFILElBQUEsRUFBQTs7QUFFRSxRQUFBLEdBQUEsR0FBTSxLQUFLLENBQUwsa0JBQUEsQ0FBeUIsS0FBekIsSUFBQSxFQUFnQyxLQUFoQyxJQUFBLENBQU47ZUFDQSxHQUFHLENBQUgsT0FBQSxDQUFBLFVBQUEsRUFIRixHQUdFLEM7O0FBVkk7QUFKVjs7QUFBQTtBQUFBLEVBQUEsb0JBQUEsQ0FBTTs7Ozs7Ozs7OztBQzdmTjs7Ozs7Ozs7QUFFQSxJQUFhLGlCQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNkJBQ0ksSUFESixFQUNJO0FBQ1QsVUFBQSxFQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssSUFBSSxDQUFKLE1BQUEsQ0FBWSxJQUFBLGdCQUFBLENBQVosSUFBWSxDQUFaLENBQUw7QUFDQSxNQUFBLElBQUksQ0FBSixNQUFBLENBQVksSUFBQSxnQkFBQSxDQUFBLFlBQUEsRUFBeUI7QUFBRSxRQUFBLE9BQUEsRUFBUztBQUFYLE9BQXpCLENBQVo7YUFDQSxFQUFFLENBQUYsT0FBQSxDQUFXO0FBQ1QsbUJBRFMsbUJBQUE7QUFFVCxjQUZTLDBCQUFBO0FBR1QsZUFIUyxxREFBQTtBQUlULG9CQUpTLGtDQUFBO0FBS1QsaUJBQVE7QUFBRSxVQUFBLE9BQUEsRUFBUztBQUFYLFNBTEM7QUFNVCxhQUFJO0FBQU0sVUFBQSxPQUFBLEVBQVM7QUFBZixTQU5LO0FBT1QsZUFQUyxpREFBQTtBQVFULGlCQVJTLHdDQUFBO0FBU1QsZ0JBQU87QUFBRyxVQUFBLE9BQUEsRUFBUztBQUFaLFNBVEU7QUFVVCxtQkFBVTtBQUFHLFVBQUEsT0FBQSxFQUFTO0FBQVosU0FWRDtBQVdULGlCQVhTLDhCQUFBO0FBWVQsa0JBWlMsa0RBQUE7QUFhVCxrQkFiUywyQ0FBQTtBQWNULGVBQU07QUFBSSxVQUFBLE9BQUEsRUFBUztBQUFiLFNBZEc7QUFlVCxrQkFBVTtBQWZELE9BQVgsQztBQUhTO0FBREo7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7QUNOQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFGQSxJQUFBLFdBQUE7O0FBSUEsSUFBYSxrQkFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDZCQUNJLElBREosRUFDSTtBQUNULFVBQUEsR0FBQSxFQUFBLFFBQUEsRUFBQSxRQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFKLE1BQUEsQ0FBWSxJQUFBLGdCQUFBLENBQVosS0FBWSxDQUFaLENBQU47QUFDQSxNQUFBLEdBQUcsQ0FBSCxXQUFBLENBQWdCLElBQUEsc0JBQUEsQ0FBaUI7QUFDL0IsUUFBQSxNQUFBLEVBRCtCLFdBQUE7QUFFL0IsUUFBQSxNQUFBLEVBRitCLE9BQUE7QUFHL0IsUUFBQSxNQUFBLEVBSCtCLElBQUE7QUFJL0IsUUFBQSxhQUFBLEVBSitCLElBQUE7QUFLL0IsZ0JBQVE7QUFMdUIsT0FBakIsQ0FBaEI7QUFRQSxNQUFBLFFBQUEsR0FBVyxHQUFHLENBQUgsTUFBQSxDQUFXLElBQUEsZ0JBQUEsQ0FBWCxPQUFXLENBQVgsQ0FBWDtBQUNBLE1BQUEsUUFBUSxDQUFSLE9BQUEsQ0FBaUI7QUFDZixvQkFBVztBQUNULGtCQUFTO0FBQ1AsMkJBQWU7QUFDYixjQUFBLE9BQUEsRUFEYSxjQUFBO0FBRWIsY0FBQSxRQUFBLEVBQVU7QUFDUixnQkFBQSxNQUFBLEVBRFEsT0FBQTtBQUVSLGdCQUFBLE1BQUEsRUFGUSxVQUFBO0FBR1IsZ0JBQUEsYUFBQSxFQUFlO0FBSFA7QUFGRztBQURSLFdBREE7QUFXVCxVQUFBLE9BQUEsRUFYUyxrQkFBQTtBQVlULFVBQUEsV0FBQSxFQUFhO0FBWkosU0FESTtBQWVmLGVBQU87QUFDTCxVQUFBLE9BQUEsRUFESyxVQUFBO0FBRUwsVUFBQSxRQUFBLEVBQVU7QUFDUixZQUFBLE1BQUEsRUFEUSxTQUFBO0FBRVIsWUFBQSxNQUFBLEVBQVE7QUFGQTtBQUZMLFNBZlE7QUFzQmYsbUJBdEJlLG1CQUFBO0FBdUJmLFFBQUEsR0FBQSxFQUFLO0FBdkJVLE9BQWpCO0FBMEJBLE1BQUEsUUFBQSxHQUFXLEdBQUcsQ0FBSCxNQUFBLENBQVcsSUFBQSxnQkFBQSxDQUFYLE9BQVcsQ0FBWCxDQUFYO2FBQ0EsUUFBUSxDQUFSLE9BQUEsQ0FBaUI7QUFDZix1QkFBZTtBQUFFLFVBQUEsT0FBQSxFQUFTO0FBQVgsU0FEQTtBQUVmLG1CQUZlLG1CQUFBO0FBR2YsY0FIZSw4QkFBQTtBQUlmLGdCQUplLFlBQUE7QUFLZixnQkFMZSxRQUFBO0FBTWYsYUFBSTtBQUFJLFVBQUEsT0FBQSxFQUFTO0FBQWIsU0FOVztBQU9mLGlCQUFRO0FBQ04sVUFBQSxNQUFBLEVBRE0sdUZBQUE7QUFRTixVQUFBLFFBQUEsRUFBVTtBQUNSLFlBQUEsTUFBQSxFQUFRO0FBREE7QUFSSixTQVBPO0FBbUJmLGFBQUk7QUFBTSxVQUFBLE9BQUEsRUFBUztBQUFmLFNBbkJXO0FBb0JmLG9CQUFZO0FBQ1YsVUFBQSxNQUFBLEVBRFUsa0NBQUE7QUFFVixVQUFBLFFBQUEsRUFBVTtBQUNSLFlBQUEsTUFBQSxFQUFRO0FBREE7QUFGQSxTQXBCRztBQTBCZixpQkFBUTtBQUFFLFVBQUEsT0FBQSxFQUFTO0FBQVgsU0ExQk87QUEyQmYsYUFBSTtBQUFNLFVBQUEsT0FBQSxFQUFTO0FBQWYsU0EzQlc7QUE0QmYsaUJBNUJlLGVBQUE7QUE2QmYsYUE3QmUsU0FBQTtBQThCZixlQTlCZSxxREFBQTtBQStCZixtQkEvQmUsc0RBQUE7QUFnQ2YsZ0JBQU87QUFBRyxVQUFBLE9BQUEsRUFBUztBQUFaLFNBaENRO0FBaUNmLGlCQWpDZSxrQ0FBQTtBQWtDZixrQkFBVTtBQUNSLFVBQUEsTUFBQSxFQURRLG9EQUFBO0FBRVIsVUFBQSxRQUFBLEVBQVU7QUFDUixZQUFBLE1BQUEsRUFBUTtBQURBO0FBRkYsU0FsQ0s7QUF3Q2Ysa0JBeENlLCtDQUFBO0FBeUNmLGVBQU07QUFBSSxVQUFBLE9BQUEsRUFBUztBQUFiLFNBekNTO0FBMENmLGtCQUFVO0FBQ1IsVUFBQSxNQUFBLEVBRFEsNkZBQUE7QUFXUixVQUFBLFFBQUEsRUFBVTtBQUNSLFlBQUEsTUFBQSxFQUFRO0FBREE7QUFYRixTQTFDSztBQXlEZixpQkFBUztBQUNQLFVBQUEsT0FBQSxFQURPLFlBQUE7QUFFUCxVQUFBLFFBQUEsRUFBVTtBQUNSLFlBQUEsTUFBQSxFQURRLFNBQUE7QUFFUixZQUFBLE1BQUEsRUFGUSxNQUFBO0FBR1IsWUFBQSxnQkFBQSxFQUFrQjtBQUhWO0FBRkg7QUF6RE0sT0FBakIsQztBQXRDUztBQURKOztBQUFBO0FBQUEsR0FBUDs7OztBQTJHQSxXQUFBLEdBQWMscUJBQUEsTUFBQSxFQUFBLFFBQUEsRUFBQTtBQUNaLE1BQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxPQUFBO0FBQUEsRUFBQSxNQUFBLEdBQVMsUUFBUSxDQUFSLFFBQUEsQ0FBa0IsQ0FBQSxZQUFBLEVBQWxCLFFBQWtCLENBQWxCLEVBQUEsSUFBQSxDQUFUOztBQUNBLE1BQUEsTUFBQSxFQUFBO0FBQ0UsSUFBQSxPQUFBLEdBQVUsd0JBQVY7QUFDQSxJQUFBLFFBQUEsR0FBVyxtQkFBWDtBQUNBLFdBQU8sV0FBVyxNQUFNLENBQU4sT0FBQSxDQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsT0FBQSxDQUFBLFFBQUEsRUFBWCxPQUFXLENBQVgsR0FIVCxLQUdFO0FBSEYsR0FBQSxNQUFBO1dBS0UsWUFBWSwyQkFBQSxNQUFBLENBQVosTUFBWSxDQUFaLEdBTEYsTTs7QUFGWSxDQUFkLEMsQ0EvR0E7Ozs7OztBQ0RBOztBQUNBOztBQUVBLG9CQUFBLE1BQUEsR0FBa0IsVUFBQSxNQUFBLEVBQUE7QUFDaEIsTUFBQSxFQUFBO0FBQUEsRUFBQSxFQUFBLEdBQUssSUFBQSxtQkFBQSxDQUFhLElBQUEsOEJBQUEsQ0FBYixNQUFhLENBQWIsQ0FBTDs7QUFDQSxzQkFBUyxTQUFULENBQUEsSUFBQSxDQUFBLEVBQUE7O1NBQ0EsRTtBQUhnQixDQUFsQjs7QUFLQSxvQkFBQSxPQUFBLEdBQW1CLE9BQW5CO0FBRUEsTUFBTSxDQUFOLFFBQUEsR0FBa0IsbUJBQWxCOzs7Ozs7Ozs7Ozs7Ozs7O0FDVkEsSUFBYSxXQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNEJBQ0ssR0FETCxFQUNLO0FBQ1IsYUFBTyxNQUFNLENBQUMsU0FBUCxDQUFpQixRQUFqQixDQUFBLElBQUEsQ0FBQSxHQUFBLE1BQXlDLGdCQUFoRDtBQURRO0FBREw7QUFBQTtBQUFBLDBCQUlHLEVBSkgsRUFJRyxFQUpILEVBSUc7YUFDTixLQUFBLE1BQUEsQ0FBUSxFQUFFLENBQUYsTUFBQSxDQUFSLEVBQVEsQ0FBUixDO0FBRE07QUFKSDtBQUFBO0FBQUEsMkJBT0ksS0FQSixFQU9JO0FBQ1AsVUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUE7QUFBQSxNQUFBLENBQUEsR0FBSSxLQUFLLENBQUwsTUFBQSxFQUFKO0FBQ0EsTUFBQSxDQUFBLEdBQUksQ0FBSjs7QUFDQSxhQUFNLENBQUEsR0FBSSxDQUFDLENBQVgsTUFBQSxFQUFBO0FBQ0UsUUFBQSxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQVI7O0FBQ0EsZUFBTSxDQUFBLEdBQUksQ0FBQyxDQUFYLE1BQUEsRUFBQTtBQUNFLGNBQUcsQ0FBRSxDQUFGLENBQUUsQ0FBRixLQUFRLENBQUUsQ0FBYixDQUFhLENBQWIsRUFBQTtBQUNFLFlBQUEsQ0FBQyxDQUFELE1BQUEsQ0FBUyxDQUFULEVBQUEsRUFERixDQUNFOzs7QUFDRixZQUFFLENBQUY7QUFIRjs7QUFJQSxVQUFFLENBQUY7QUFORjs7YUFPQSxDO0FBVk87QUFQSjs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLElBQWEsWUFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDRCQUVHO0FBQUEsd0NBQUEsRUFBQTtBQUFBLFFBQUEsRUFBQTtBQUFBOztBQUNOLFVBQUEsQ0FBQSxFQUFBLElBQUEsSUFBQSxHQUFHLEVBQUUsQ0FBRSxNQUFQLEdBQU8sS0FBSixDQUFILElBQUEsQ0FBQSxFQUFBO2VBQ0UsS0FBQSxHQUFBLENBQUEsRUFBQSxFQUFTLFVBQUEsQ0FBQSxFQUFBO0FBQU8sY0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUE7QUFBdUIsVUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxlQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7OztBQUFkLGNBQUEsUUFBQSxHQUFBLEVBQUE7O0FBQUEsbUJBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQTs7OEJBQVQsQ0FBRSxDQUFGLENBQUUsQ0FBRixHQUFPLEM7QUFBRTs7OztBQUFjOzs7QUFEekMsU0FDRSxDOztBQUZJO0FBRkg7QUFBQTtBQUFBLHdCQU1DLENBTkQsRUFNQyxFQU5ELEVBTUM7QUFDSixNQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUE7YUFDQSxDO0FBRkk7QUFORDtBQUFBO0FBQUEsZ0NBVVMsV0FWVCxFQVVTLFNBVlQsRUFVUzthQUNaLFNBQVMsQ0FBVCxPQUFBLENBQWtCLFVBQUEsUUFBQSxFQUFBO2VBQ2hCLE1BQU0sQ0FBTixtQkFBQSxDQUEyQixRQUFRLENBQW5DLFNBQUEsRUFBQSxPQUFBLENBQXVELFVBQUEsSUFBQSxFQUFBO2lCQUNuRCxNQUFNLENBQU4sY0FBQSxDQUFBLFdBQUEsRUFBQSxJQUFBLEVBQXlDLE1BQU0sQ0FBTix3QkFBQSxDQUFnQyxRQUFRLENBQXhDLFNBQUEsRUFBekMsSUFBeUMsQ0FBekMsQztBQURKLFNBQUEsQztBQURGLE9BQUEsQztBQURZO0FBVlQ7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNDQSxJQUFhLGVBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwrQkFFUSxRQUZSLEVBRVE7QUFBQSxVQUFVLE9BQVYsdUVBQUEsS0FBQTtBQUNYLFVBQUEsS0FBQTs7QUFBQSxVQUFHLFFBQVEsQ0FBUixPQUFBLENBQUEsR0FBQSxNQUF5QixDQUF6QixDQUFBLElBQWdDLENBQW5DLE9BQUEsRUFBQTtBQUNFLGVBQU8sQ0FBQSxJQUFBLEVBRFQsUUFDUyxDQUFQOzs7QUFDRixNQUFBLEtBQUEsR0FBUSxRQUFRLENBQVIsS0FBQSxDQUFBLEdBQUEsQ0FBUjtBQUNBLGFBQU8sQ0FBQyxLQUFLLENBQU4sS0FBQyxFQUFELEVBQWUsS0FBSyxDQUFMLElBQUEsQ0FBQSxHQUFBLEtBQWYsSUFBQSxDQUFQO0FBSlc7QUFGUjtBQUFBO0FBQUEsMEJBUUcsUUFSSCxFQVFHO0FBQ04sVUFBQSxJQUFBLEVBQUEsS0FBQTs7QUFBQSxVQUFHLFFBQVEsQ0FBUixPQUFBLENBQUEsR0FBQSxNQUF5QixDQUE1QixDQUFBLEVBQUE7QUFDRSxlQUFPLENBQUEsSUFBQSxFQURULFFBQ1MsQ0FBUDs7O0FBQ0YsTUFBQSxLQUFBLEdBQVEsUUFBUSxDQUFSLEtBQUEsQ0FBQSxHQUFBLENBQVI7QUFDQSxNQUFBLElBQUEsR0FBTyxLQUFLLENBQUwsR0FBQSxFQUFQO2FBQ0EsQ0FBQyxLQUFLLENBQUwsSUFBQSxDQUFELEdBQUMsQ0FBRCxFQUFBLElBQUEsQztBQUxNO0FBUkg7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7QUNEQTs7Ozs7Ozs7QUFFQSxJQUFhLFlBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxrQ0FDVyxHQURYLEVBQ1c7QUFDZCxhQUFPLEdBQUcsQ0FBSCxPQUFBLENBQUEsV0FBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLENBQUEsV0FBQSxFQUFBLEVBQUEsQ0FBUDtBQURjO0FBRFg7QUFBQTtBQUFBLGlDQUlVLEdBSlYsRUFJVTthQUNiLEdBQUcsQ0FBSCxPQUFBLENBQUEscUNBQUEsRUFBQSxNQUFBLEM7QUFEYTtBQUpWO0FBQUE7QUFBQSxtQ0FPWSxHQVBaLEVBT1ksTUFQWixFQU9ZO0FBQ2YsVUFBYSxNQUFBLElBQWIsQ0FBQSxFQUFBO0FBQUEsZUFBQSxFQUFBOzs7YUFDQSxLQUFBLENBQU0sSUFBSSxDQUFKLElBQUEsQ0FBVSxNQUFBLEdBQU8sR0FBRyxDQUFwQixNQUFBLElBQU4sQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsRUFBQSxTQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUEsQztBQUZlO0FBUFo7QUFBQTtBQUFBLDJCQVdJLEdBWEosRUFXSSxFQVhKLEVBV0k7YUFDUCxLQUFBLENBQU0sRUFBQSxHQUFOLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLEM7QUFETztBQVhKO0FBQUE7QUFBQSwrQkFjUSxHQWRSLEVBY1E7QUFDWCxVQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBRyxDQUFILE9BQUEsQ0FBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsQ0FBUixJQUFRLENBQVIsQ0FEVyxDQUNYOztBQUNBLE1BQUEsQ0FBQSxHQUFJLENBQUo7O0FBQ0EsV0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7O0FBQ0UsUUFBQSxDQUFBLEdBQUksSUFBSSxDQUFKLEdBQUEsQ0FBQSxDQUFBLEVBQVcsQ0FBQyxDQUFaLE1BQUEsQ0FBSjtBQURGOztBQUVBLGFBQU8sSUFBQSxVQUFBLENBQUEsQ0FBQSxFQUFXLEtBQUssQ0FBTCxNQUFBLEdBQVgsQ0FBQSxDQUFQO0FBTFc7QUFkUjtBQUFBO0FBQUEsbUNBcUJZLElBckJaLEVBcUJZO0FBQUEsVUFBTSxFQUFOLHVFQUFBLENBQUE7QUFBQSxVQUFXLE1BQVgsdUVBQUEsSUFBQTtBQUNmLFVBQUEsR0FBQTs7QUFBQSxVQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBQSxLQUFBLENBREYsQ0FDRTs7QUFDQSxlQUFPLElBQUksQ0FBSixPQUFBLENBQUEsR0FBQSxFQUFrQixPQUFPLEtBQUEsTUFBQSxDQUFBLE1BQUEsRUFGbEMsRUFFa0MsQ0FBekIsQ0FBUDtBQUZGLE9BQUEsTUFBQTtBQUlFLGVBSkYsSUFJRTs7QUFMYTtBQXJCWjtBQUFBO0FBQUEsMkJBNEJJLElBNUJKLEVBNEJJO0FBQUEsVUFBTSxFQUFOLHVFQUFBLENBQUE7QUFBQSxVQUFXLE1BQVgsdUVBQUEsSUFBQTs7QUFDUCxVQUFHLElBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLE1BQUEsR0FBUyxLQUFBLGNBQUEsQ0FBQSxJQUFBLEVBQUEsRUFBQSxFQURsQixNQUNrQixDQUFoQjtBQURGLE9BQUEsTUFBQTtBQUdFLGVBSEYsSUFHRTs7QUFKSztBQTVCSjtBQUFBO0FBQUEsK0JBa0NRLEdBbENSLEVBa0NRO0FBQ1gsYUFBTyxHQUFHLENBQUgsS0FBQSxDQUFBLEVBQUEsRUFBQSxPQUFBLEdBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBUDtBQURXO0FBbENSO0FBQUE7QUFBQSxpQ0FzQ1UsR0F0Q1YsRUFzQ1U7QUFBQSxVQUFNLFVBQU4sdUVBQUEsR0FBQTtBQUNiLFVBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxLQUFBLEVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLHVCQUFOO0FBQ0EsTUFBQSxRQUFBLEdBQVcsSUFBQSxNQUFBLENBQVcsS0FBQSxZQUFBLENBQVgsVUFBVyxDQUFYLEVBQUEsR0FBQSxDQUFYO0FBQ0EsTUFBQSxRQUFBLEdBQVcsSUFBQSxNQUFBLENBQVcsS0FBQSxZQUFBLENBQWMsVUFBQSxHQUF6QixVQUFXLENBQVgsRUFBQSxHQUFBLENBQVg7QUFDQSxNQUFBLEtBQUEsR0FBUSxJQUFBLE1BQUEsQ0FBVyxLQUFBLFlBQUEsQ0FBWCxHQUFXLENBQVgsRUFBQSxHQUFBLENBQVI7YUFDQSxHQUFHLENBQUgsT0FBQSxDQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxDQUFBLFFBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxDQUFBLEtBQUEsRUFBQSxVQUFBLEM7QUFMYTtBQXRDVjtBQUFBO0FBQUEsNENBNkNxQixHQTdDckIsRUE2Q3FCO0FBQUEsVUFBTSxVQUFOLHVFQUFBLEdBQUE7QUFDeEIsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sS0FBQSxZQUFBLENBQUEsR0FBQSxFQUFBLFVBQUEsQ0FBTjs7QUFDQSxVQUFHLEdBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBTSxHQUFHLENBQUgsTUFBQSxDQUFBLENBQUEsRUFBQSxHQUFBLElBQW9CLEdBQUcsQ0FBSCxNQUFBLENBQVcsR0FBQSxHQUFJLFVBQVUsQ0FBekIsTUFBQSxDQUExQjtBQUNBLGVBQU8sQ0FBQSxHQUFBLEVBRlQsR0FFUyxDQUFQOztBQUpzQjtBQTdDckI7QUFBQTtBQUFBLGlDQW1EVSxHQW5EVixFQW1EVTtBQUFBLFVBQU0sVUFBTix1RUFBQSxHQUFBO0FBQ2IsVUFBQSxDQUFBLEVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUEsTUFBQSxDQUFXLEtBQUEsWUFBQSxDQUFjLFVBQUEsR0FBekIsVUFBVyxDQUFYLEVBQUEsR0FBQSxDQUFYO0FBQ0EsTUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFILE9BQUEsQ0FBQSxRQUFBLEVBRE4sR0FDTSxDQUFOLENBRmEsQ0FDYjs7QUFFQSxVQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBSCxPQUFBLENBQUwsVUFBSyxDQUFMLElBQWdDLENBQW5DLENBQUEsRUFBQTtBQUNFLGVBREYsQ0FDRTs7QUFKVztBQW5EVjs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7OztBQ0RBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQWEsSUFBTjtBQUFBO0FBQUE7QUFDTCxnQkFBYSxNQUFiLEVBQWEsTUFBYixFQUFhO0FBQUEsUUFBQSxPQUFBLHVFQUFBLEVBQUE7O0FBQUE7O0FBQ1gsUUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFEWSxTQUFDLE1BQUQsR0FBQyxNQUFEO0FBQVEsU0FBQyxNQUFELEdBQUMsTUFBRDtBQUFRLFNBQUMsT0FBRCxHQUFDLE9BQUQ7QUFDNUIsSUFBQSxRQUFBLEdBQVc7QUFDVCxNQUFBLGFBQUEsRUFEUyxLQUFBO0FBRVQsTUFBQSxVQUFBLEVBQVk7QUFGSCxLQUFYOztBQUlBLFNBQUEsR0FBQSxJQUFBLFFBQUEsRUFBQTs7O0FBQ0UsVUFBRyxHQUFBLElBQU8sS0FBVixPQUFBLEVBQUE7QUFDRSxhQUFBLEdBQUEsSUFBWSxLQUFDLE9BQUQsQ0FEZCxHQUNjLENBQVo7QUFERixPQUFBLE1BQUE7QUFHRSxhQUFBLEdBQUEsSUFIRixHQUdFOztBQUpKO0FBTFc7O0FBRFI7QUFBQTtBQUFBLGdDQVdNO0FBQ1QsVUFBRyxPQUFPLEtBQVAsTUFBQSxLQUFILFFBQUEsRUFBQTtBQUNFLGVBQU8sSUFBQSxNQUFBLENBQVcsMkJBQUEsWUFBQSxDQUEwQixLQUQ5QyxNQUNvQixDQUFYLENBQVA7QUFERixPQUFBLE1BQUE7QUFHRSxlQUFPLEtBSFQsTUFHRTs7QUFKTztBQVhOO0FBQUE7QUFBQSxnQ0FnQk07QUFDVCxVQUFHLE9BQU8sS0FBUCxNQUFBLEtBQUgsUUFBQSxFQUFBO0FBQ0UsZUFBTyxJQUFBLE1BQUEsQ0FBVywyQkFBQSxZQUFBLENBQTBCLEtBRDlDLE1BQ29CLENBQVgsQ0FBUDtBQURGLE9BQUEsTUFBQTtBQUdFLGVBQU8sS0FIVCxNQUdFOztBQUpPO0FBaEJOO0FBQUE7QUFBQSxvQ0FxQlU7QUFDYixhQUFPO0FBQ0wsUUFBQSxNQUFBLEVBQVEsS0FESCxTQUNHLEVBREg7QUFFTCxRQUFBLE1BQUEsRUFBUSxLQUFBLFNBQUE7QUFGSCxPQUFQO0FBRGE7QUFyQlY7QUFBQTtBQUFBLHVDQTBCYTtBQUNoQixVQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxFQUFQO0FBQ0EsTUFBQSxHQUFBLEdBQUEsS0FBQSxhQUFBLEVBQUE7O0FBQUEsV0FBQSxHQUFBLElBQUEsR0FBQSxFQUFBOztBQUNFLFFBQUEsSUFBSSxDQUFKLElBQUEsQ0FBQSxHQUFBO0FBREY7O0FBRUEsYUFBTyxJQUFQO0FBSmdCO0FBMUJiO0FBQUE7QUFBQSxrQ0ErQlE7QUFDWCxVQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxFQUFUO0FBQ0EsTUFBQSxHQUFBLEdBQUEsS0FBQSxhQUFBLEVBQUE7O0FBQUEsV0FBQSxHQUFBLElBQUEsR0FBQSxFQUFBOztBQUNFLFFBQUEsTUFBTSxDQUFOLElBQUEsQ0FBWSxNQUFJLEdBQUcsQ0FBUCxNQUFBLEdBRGQsR0FDRSxFQURGLENBQUE7QUFBQTs7QUFFQSxhQUFPLElBQUEsTUFBQSxDQUFXLE1BQU0sQ0FBTixJQUFBLENBQVgsR0FBVyxDQUFYLENBQVA7QUFKVztBQS9CUjtBQUFBO0FBQUEsNkJBb0NLLElBcENMLEVBb0NLO0FBQUEsVUFBTSxNQUFOLHVFQUFBLENBQUE7QUFDUixVQUFBLEtBQUE7O0FBQUEsYUFBTSxDQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUEsQ0FBQSxJQUFBLEVBQUEsTUFBQSxDQUFBLEtBQUEsSUFBQSxJQUF1QyxDQUFDLEtBQUssQ0FBbkQsS0FBOEMsRUFBOUMsRUFBQTtBQUNFLFFBQUEsTUFBQSxHQUFTLEtBQUssQ0FBTCxHQUFBLEVBQVQ7QUFERjs7QUFFQSxVQUFnQixLQUFBLElBQUEsSUFBQSxJQUFXLEtBQUssQ0FBaEMsS0FBMkIsRUFBM0IsRUFBQTtBQUFBLGVBQUEsS0FBQTs7QUFIUTtBQXBDTDtBQUFBO0FBQUEsOEJBd0NNLElBeENOLEVBd0NNO0FBQUEsVUFBTSxNQUFOLHVFQUFBLENBQUE7QUFDVCxVQUFBLEtBQUE7O0FBQUEsVUFBQSxNQUFBLEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFJLENBQUosTUFBQSxDQURULE1BQ1MsQ0FBUDs7O0FBQ0YsTUFBQSxLQUFBLEdBQVEsS0FBQSxXQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsQ0FBUjs7QUFDQSxVQUFHLEtBQUEsSUFBSCxJQUFBLEVBQUE7QUFDRSxlQUFPLElBQUEsb0JBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxFQURULE1BQ1MsQ0FBUDs7QUFMTztBQXhDTjtBQUFBO0FBQUEsa0NBOENVLElBOUNWLEVBOENVO0FBQ2IsYUFBTyxLQUFBLGdCQUFBLENBQWtCLEtBQUEsUUFBQSxDQUFsQixJQUFrQixDQUFsQixDQUFQO0FBRGE7QUE5Q1Y7QUFBQTtBQUFBLGlDQWdEUyxJQWhEVCxFQWdEUztBQUFBLFVBQU0sTUFBTix1RUFBQSxDQUFBO0FBQ1osVUFBQSxLQUFBLEVBQUEsR0FBQTs7QUFBQSxhQUFNLEtBQUEsR0FBUSxLQUFBLFFBQUEsQ0FBQSxJQUFBLEVBQWQsTUFBYyxDQUFkLEVBQUE7QUFDRSxRQUFBLE1BQUEsR0FBUyxLQUFLLENBQUwsR0FBQSxFQUFUOztBQUNBLFlBQUcsQ0FBQSxHQUFBLElBQVEsR0FBRyxDQUFILEdBQUEsT0FBYSxLQUFLLENBQTdCLEdBQXdCLEVBQXhCLEVBQUE7QUFDRSxVQUFBLEdBQUEsR0FERixLQUNFOztBQUhKOztBQUlBLGFBQU8sR0FBUDtBQUxZO0FBaERUO0FBQUE7QUFBQSxnQ0FzRE07YUFDVCxLQUFBLE1BQUEsS0FBVyxLQUFYLE1BQUEsSUFDRSxLQUFBLE1BQUEsQ0FBQSxNQUFBLElBQUEsSUFBQSxJQUNBLEtBQUEsTUFBQSxDQUFBLE1BQUEsSUFEQSxJQUFBLElBRUEsS0FBQyxNQUFELENBQUEsTUFBQSxLQUFrQixLQUFDLE1BQUQsQ0FIRSxNO0FBRGI7QUF0RE47QUFBQTtBQUFBLCtCQTRETyxHQTVEUCxFQTRETyxJQTVEUCxFQTRETztBQUNWLFVBQUEsR0FBQSxFQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxLQUFBLFlBQUEsQ0FBYyxJQUFJLENBQUosTUFBQSxDQUFBLENBQUEsRUFBYyxHQUFHLENBQS9CLEtBQWMsQ0FBZCxDQUFSOztBQUNBLFVBQUcsS0FBQSxJQUFBLElBQUEsS0FBWSxLQUFBLFNBQUEsTUFBZ0IsS0FBSyxDQUFMLElBQUEsT0FBL0IsUUFBRyxDQUFILEVBQUE7QUFDRSxRQUFBLEdBQUEsR0FBTSxLQUFBLFFBQUEsQ0FBQSxJQUFBLEVBQWUsR0FBRyxDQUFsQixHQUFBLENBQU47O0FBQ0EsWUFBRyxHQUFBLElBQUEsSUFBQSxLQUFVLEtBQUEsU0FBQSxNQUFnQixHQUFHLENBQUgsSUFBQSxPQUE3QixRQUFHLENBQUgsRUFBQTtBQUNFLGlCQUFPLElBQUEsUUFBQSxDQUFRLEtBQUssQ0FBYixLQUFRLEVBQVIsRUFBc0IsR0FBRyxDQURsQyxHQUMrQixFQUF0QixDQUFQO0FBREYsU0FBQSxNQUVLLElBQUcsS0FBSCxhQUFBLEVBQUE7QUFDSCxpQkFBTyxJQUFBLFFBQUEsQ0FBUSxLQUFLLENBQWIsS0FBUSxFQUFSLEVBQXNCLElBQUksQ0FEOUIsTUFDSSxDQUFQO0FBTEo7O0FBRlU7QUE1RFA7QUFBQTtBQUFBLCtCQW9FTyxHQXBFUCxFQW9FTyxJQXBFUCxFQW9FTztBQUNWLGFBQU8sS0FBQSxVQUFBLENBQUEsR0FBQSxFQUFBLElBQUEsS0FBQSxJQUFQO0FBRFU7QUFwRVA7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMQSxJQUFhLFNBQU47QUFBQTtBQUFBO0FBQ0wscUJBQWEsSUFBYixFQUFhLEtBQWIsRUFBYTtBQUFBLFFBQUEsTUFBQSx1RUFBQSxDQUFBOztBQUFBOztBQUFDLFNBQUMsSUFBRCxHQUFDLElBQUQ7QUFBTSxTQUFDLEtBQUQsR0FBQyxLQUFEO0FBQU8sU0FBQyxNQUFELEdBQUMsTUFBRDtBQUFkOztBQURSO0FBQUE7QUFBQSwyQkFFQztBQUNKLFVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBOztBQUFBLFVBQUcsS0FBSCxLQUFBLEVBQUE7QUFDRSxZQUFPLE9BQUEsS0FBQSxLQUFBLFdBQUEsSUFBQSxLQUFBLEtBQVAsSUFBQSxFQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQUEsS0FBQSxLQUFBOztBQUFBLGVBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUE7OztBQUNFLGdCQUFHLENBQUEsR0FBQSxDQUFBLElBQVUsS0FBQSxJQUFiLElBQUEsRUFBQTtBQUNFLGNBQUEsS0FBQSxHQUFRLEtBQUMsSUFBRCxDQUFBLGdCQUFBLEdBQXlCLENBQUEsR0FBQSxDQUF6QixDQUFSO0FBQ0EscUJBRkYsS0FFRTs7QUFISjs7QUFJQSxVQUFBLEtBQUEsR0FMRixLQUtFOzs7QUFDRixlQUFPLEtBQUEsSUFQVCxJQU9FOztBQVJFO0FBRkQ7QUFBQTtBQUFBLDRCQVdFO2FBQ0wsS0FBQyxLQUFELENBQUEsS0FBQSxHQUFlLEtBQUMsTTtBQURYO0FBWEY7QUFBQTtBQUFBLDBCQWFBO2FBQ0gsS0FBQyxLQUFELENBQUEsS0FBQSxHQUFlLEtBQUMsS0FBRCxDQUFPLENBQVAsRUFBZixNQUFBLEdBQWtDLEtBQUMsTTtBQURoQztBQWJBO0FBQUE7QUFBQSw0QkFlRTtBQUNMLGFBQU8sQ0FBQyxLQUFDLElBQUQsQ0FBRCxVQUFBLElBQXFCLEtBQUMsSUFBRCxDQUFBLFVBQUEsQ0FBQSxJQUFBLENBQTVCO0FBREs7QUFmRjtBQUFBO0FBQUEsNkJBaUJHO2FBQ04sS0FBQyxLQUFELENBQU8sQ0FBUCxFQUFVLE07QUFESjtBQWpCSDs7QUFBQTtBQUFBLEdBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLElBQWEsR0FBTjtBQUFBO0FBQUE7QUFDTCxlQUFhLEtBQWIsRUFBYSxHQUFiLEVBQWE7QUFBQTs7QUFBQyxTQUFDLEtBQUQsR0FBQyxLQUFEO0FBQU8sU0FBQyxHQUFELEdBQUMsR0FBRDs7QUFDbkIsUUFBcUIsS0FBQSxHQUFBLElBQXJCLElBQUEsRUFBQTtBQUFBLFdBQUEsR0FBQSxHQUFPLEtBQVAsS0FBQTs7QUFEVzs7QUFEUjtBQUFBO0FBQUEsK0JBR08sRUFIUCxFQUdPO0FBQ1YsYUFBTyxLQUFBLEtBQUEsSUFBQSxFQUFBLElBQWlCLEVBQUEsSUFBTSxLQUFDLEdBQS9CO0FBRFU7QUFIUDtBQUFBO0FBQUEsZ0NBS1EsR0FMUixFQUtRO0FBQ1gsYUFBTyxLQUFBLEtBQUEsSUFBVSxHQUFHLENBQWIsS0FBQSxJQUF3QixHQUFHLENBQUgsR0FBQSxJQUFXLEtBQUMsR0FBM0M7QUFEVztBQUxSO0FBQUE7QUFBQSw4QkFPTSxNQVBOLEVBT00sTUFQTixFQU9NO0FBQ1QsYUFBTyxJQUFJLEdBQUcsQ0FBUCxTQUFBLENBQWtCLEtBQUEsS0FBQSxHQUFPLE1BQU0sQ0FBL0IsTUFBQSxFQUF1QyxLQUF2QyxLQUFBLEVBQThDLEtBQTlDLEdBQUEsRUFBbUQsS0FBQSxHQUFBLEdBQUssTUFBTSxDQUE5RCxNQUFBLENBQVA7QUFEUztBQVBOO0FBQUE7QUFBQSwrQkFTTyxHQVRQLEVBU087QUFDVixXQUFBLE9BQUEsR0FBVyxHQUFYO0FBQ0EsYUFBTyxJQUFQO0FBRlU7QUFUUDtBQUFBO0FBQUEsNkJBWUc7QUFDTixVQUFPLEtBQUEsT0FBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGNBQU0sSUFBQSxLQUFBLENBRFIsZUFDUSxDQUFOOzs7QUFDRixhQUFPLEtBQUMsT0FBUjtBQUhNO0FBWkg7QUFBQTtBQUFBLGdDQWdCTTtBQUNULGFBQU8sS0FBQSxPQUFBLElBQUEsSUFBUDtBQURTO0FBaEJOO0FBQUE7QUFBQSwyQkFrQkM7YUFDSixLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLEtBQUEsRUFBNkIsS0FBN0IsR0FBQSxDO0FBREk7QUFsQkQ7QUFBQTtBQUFBLGdDQW9CUSxNQXBCUixFQW9CUTtBQUNYLFVBQUcsTUFBQSxLQUFILENBQUEsRUFBQTtBQUNFLGFBQUEsS0FBQSxJQUFVLE1BQVY7QUFDQSxhQUFBLEdBQUEsSUFGRixNQUVFOzs7QUFDRixhQUFPLElBQVA7QUFKVztBQXBCUjtBQUFBO0FBQUEsOEJBeUJJO0FBQ1AsVUFBTyxLQUFBLFFBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxhQUFBLFFBQUEsR0FBWSxLQUFBLE1BQUEsR0FBQSxhQUFBLENBQXdCLEtBRHRDLEtBQ2MsQ0FBWjs7O0FBQ0YsYUFBTyxLQUFDLFFBQVI7QUFITztBQXpCSjtBQUFBO0FBQUEsOEJBNkJJO0FBQ1AsVUFBTyxLQUFBLFFBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxhQUFBLFFBQUEsR0FBWSxLQUFBLE1BQUEsR0FBQSxXQUFBLENBQXNCLEtBRHBDLEdBQ2MsQ0FBWjs7O0FBQ0YsYUFBTyxLQUFDLFFBQVI7QUFITztBQTdCSjtBQUFBO0FBQUEsd0NBaUNjO0FBQ2pCLFVBQU8sS0FBQSxrQkFBQSxJQUFQLElBQUEsRUFBQTtBQUNFLGFBQUEsa0JBQUEsR0FBc0IsS0FBQSxNQUFBLEdBQUEsVUFBQSxDQUFxQixLQUFyQixPQUFxQixFQUFyQixFQUFnQyxLQUR4RCxPQUN3RCxFQUFoQyxDQUF0Qjs7O0FBQ0YsYUFBTyxLQUFDLGtCQUFSO0FBSGlCO0FBakNkO0FBQUE7QUFBQSxzQ0FxQ1k7QUFDZixVQUFPLEtBQUEsZ0JBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxhQUFBLGdCQUFBLEdBQW9CLEtBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBcUIsS0FBckIsT0FBcUIsRUFBckIsRUFBZ0MsS0FEdEQsS0FDc0IsQ0FBcEI7OztBQUNGLGFBQU8sS0FBQyxnQkFBUjtBQUhlO0FBckNaO0FBQUE7QUFBQSxzQ0F5Q1k7QUFDZixVQUFPLEtBQUEsZ0JBQUEsSUFBUCxJQUFBLEVBQUE7QUFDRSxhQUFBLGdCQUFBLEdBQW9CLEtBQUEsTUFBQSxHQUFBLFVBQUEsQ0FBcUIsS0FBckIsR0FBQSxFQUEwQixLQURoRCxPQUNnRCxFQUExQixDQUFwQjs7O0FBQ0YsYUFBTyxLQUFDLGdCQUFSO0FBSGU7QUF6Q1o7QUFBQTtBQUFBLDJCQTZDQztBQUNKLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUEsR0FBQSxDQUFRLEtBQVIsS0FBQSxFQUFlLEtBQWYsR0FBQSxDQUFOOztBQUNBLFVBQUcsS0FBSCxTQUFHLEVBQUgsRUFBQTtBQUNFLFFBQUEsR0FBRyxDQUFILFVBQUEsQ0FBZSxLQURqQixNQUNpQixFQUFmOzs7QUFDRixhQUFPLEdBQVA7QUFKSTtBQTdDRDtBQUFBO0FBQUEsMEJBa0RBO2FBQ0gsQ0FBQyxLQUFELEtBQUEsRUFBUSxLQUFSLEdBQUEsQztBQURHO0FBbERBOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7O0FDQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBYSxhQUFOO0FBQUE7QUFBQTtBQUNMLHlCQUFhLEdBQWIsRUFBYTtBQUFBOztBQUNYLFFBQUcsQ0FBQyxLQUFLLENBQUwsT0FBQSxDQUFKLEdBQUksQ0FBSixFQUFBO0FBQ0UsTUFBQSxHQUFBLEdBQU0sQ0FEUixHQUNRLENBQU47OztBQUNGLCtCQUFBLFdBQUEsQ0FBQSxHQUFBLEVBQTZCLENBQTdCLGFBQTZCLENBQTdCOztBQUNBLFdBQU8sR0FBUDtBQUpXOztBQURSO0FBQUE7QUFBQSx5QkFPQyxNQVBELEVBT0MsTUFQRCxFQU9DO0FBQ0YsYUFBTyxLQUFBLEdBQUEsQ0FBTSxVQUFBLENBQUEsRUFBQTtlQUFPLElBQUEsa0JBQUEsQ0FBYSxDQUFDLENBQWQsS0FBQSxFQUFzQixDQUFDLENBQXZCLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxDO0FBQWIsT0FBQSxDQUFQO0FBREU7QUFQRDtBQUFBO0FBQUEsNEJBU0ksR0FUSixFQVNJO0FBQ0wsYUFBTyxLQUFBLEdBQUEsQ0FBTSxVQUFBLENBQUEsRUFBQTtlQUFPLElBQUEsd0JBQUEsQ0FBZ0IsQ0FBQyxDQUFqQixLQUFBLEVBQXlCLENBQUMsQ0FBMUIsR0FBQSxFQUFBLEdBQUEsQztBQUFiLE9BQUEsQ0FBUDtBQURLO0FBVEo7O0FBQUE7QUFBQSxHQUFQOzs7Ozs7Ozs7Ozs7QUNKQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQWEsV0FBQSxHQUFBLFlBQUE7QUFBQSxNQUFOLFdBQU07QUFBQTtBQUFBO0FBQUE7O0FBRVgseUJBQWEsTUFBYixFQUFhLEdBQWIsRUFBYSxLQUFiLEVBQWE7QUFBQTs7QUFBQSxVQUFBLE9BQUEsdUVBQUEsRUFBQTs7QUFBQTs7O0FBQUMsWUFBQyxLQUFELEdBQUMsTUFBRDtBQUFRLFlBQUMsR0FBRCxHQUFDLEdBQUQ7QUFBTSxZQUFDLElBQUQsR0FBQyxLQUFEO0FBQU8sWUFBQyxPQUFELEdBQUMsT0FBRDs7QUFFakMsWUFBQSxPQUFBLENBQVMsTUFBVCxPQUFBLEVBQWtCO0FBQ2hCLFFBQUEsTUFBQSxFQURnQixFQUFBO0FBRWhCLFFBQUEsTUFBQSxFQUZnQixFQUFBO0FBR2hCLFFBQUEsVUFBQSxFQUFZO0FBSEksT0FBbEI7O0FBRlc7QUFBQTs7QUFGRjtBQUFBO0FBQUEsMkNBU1M7QUFDbEIsZUFBTyxLQUFBLEtBQUEsR0FBTyxLQUFDLE1BQUQsQ0FBUCxNQUFBLEdBQXNCLEtBQUMsSUFBRCxDQUFNLE1BQW5DO0FBRGtCO0FBVFQ7QUFBQTtBQUFBLCtCQVdIO0FBQ04sZUFBTyxLQUFBLEtBQUEsR0FBTyxLQUFBLFNBQUEsR0FBYSxNQUEzQjtBQURNO0FBWEc7QUFBQTtBQUFBLDhCQWFKO2VBQ0wsS0FBQSxNQUFBLEdBQUEsVUFBQSxDQUFxQixLQUFyQixLQUFBLEVBQTZCLEtBQTdCLEdBQUEsRUFBbUMsS0FBbkMsU0FBbUMsRUFBbkMsQztBQURLO0FBYkk7QUFBQTtBQUFBLGtDQWVBO0FBQ1QsZUFBTyxLQUFBLFNBQUEsT0FBZ0IsS0FBQSxZQUFBLEVBQXZCO0FBRFM7QUFmQTtBQUFBO0FBQUEscUNBaUJHO0FBQ1osZUFBTyxLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLEtBQUEsRUFBNkIsS0FBN0IsR0FBQSxDQUFQO0FBRFk7QUFqQkg7QUFBQTtBQUFBLGtDQW1CQTtBQUNULGVBQU8sS0FBQSxNQUFBLEdBQVEsS0FBUixJQUFBLEdBQWMsS0FBQyxNQUF0QjtBQURTO0FBbkJBO0FBQUE7QUFBQSxvQ0FxQkU7QUFDWCxlQUFPLEtBQUEsU0FBQSxHQUFBLE1BQUEsSUFBdUIsS0FBQSxHQUFBLEdBQU8sS0FBUixLQUF0QixDQUFQO0FBRFc7QUFyQkY7QUFBQTtBQUFBLGtDQXVCRSxNQXZCRixFQXVCRTtBQUNYLFlBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQTs7QUFBQSxZQUFHLE1BQUEsS0FBSCxDQUFBLEVBQUE7QUFDRSxlQUFBLEtBQUEsSUFBVSxNQUFWO0FBQ0EsZUFBQSxHQUFBLElBQVEsTUFBUjtBQUNBLFVBQUEsR0FBQSxHQUFBLEtBQUEsVUFBQTs7QUFBQSxlQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7QUFDRSxZQUFBLEdBQUcsQ0FBSCxLQUFBLElBQWEsTUFBYjtBQUNBLFlBQUEsR0FBRyxDQUFILEdBQUEsSUFBVyxNQUFYO0FBTEo7OztBQU1BLGVBQU8sSUFBUDtBQVBXO0FBdkJGO0FBQUE7QUFBQSxzQ0ErQkk7QUFDYixhQUFBLFVBQUEsR0FBYyxDQUFDLElBQUEsU0FBQSxDQUFRLEtBQUMsTUFBRCxDQUFBLE1BQUEsR0FBZSxLQUF2QixLQUFBLEVBQStCLEtBQUMsTUFBRCxDQUFBLE1BQUEsR0FBZSxLQUFmLEtBQUEsR0FBc0IsS0FBQyxJQUFELENBQXRELE1BQUMsQ0FBRCxDQUFkO0FBQ0EsZUFBTyxJQUFQO0FBRmE7QUEvQko7QUFBQTtBQUFBLG9DQWtDRTtBQUNYLFlBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQTtBQUFBLGFBQUEsVUFBQSxHQUFjLEVBQWQ7QUFDQSxRQUFBLElBQUEsR0FBTyxLQUFBLFNBQUEsRUFBUDtBQUNBLGFBQUEsTUFBQSxHQUFVLDJCQUFBLFlBQUEsQ0FBMEIsS0FBMUIsTUFBQSxDQUFWO0FBQ0EsYUFBQSxJQUFBLEdBQVEsMkJBQUEsWUFBQSxDQUEwQixLQUExQixJQUFBLENBQVI7QUFDQSxhQUFBLE1BQUEsR0FBVSwyQkFBQSxZQUFBLENBQTBCLEtBQTFCLE1BQUEsQ0FBVjtBQUNBLFFBQUEsS0FBQSxHQUFRLEtBQUMsS0FBVDs7QUFFQSxlQUFNLENBQUEsR0FBQSxHQUFBLDJCQUFBLHVCQUFBLENBQUEsSUFBQSxDQUFBLEtBQU4sSUFBQSxFQUFBO0FBQUEscUJBQ2UsR0FEZjs7QUFBQTs7QUFDRSxVQUFBLEdBREY7QUFDRSxVQUFBLElBREY7QUFFRSxlQUFDLFVBQUQsQ0FBQSxJQUFBLENBQWlCLElBQUEsU0FBQSxDQUFRLEtBQUEsR0FBUixHQUFBLEVBQW1CLEtBQUEsR0FBcEMsR0FBaUIsQ0FBakI7QUFGRjs7QUFJQSxlQUFPLElBQVA7QUFaVztBQWxDRjtBQUFBO0FBQUEsNkJBK0NMO0FBQ0osWUFBQSxHQUFBO0FBQUEsUUFBQSxHQUFBLEdBQU0sSUFBQSxXQUFBLENBQWdCLEtBQWhCLEtBQUEsRUFBd0IsS0FBeEIsR0FBQSxFQUE4QixLQUE5QixJQUFBLEVBQXFDLEtBQXJDLE9BQXFDLEVBQXJDLENBQU47O0FBQ0EsWUFBRyxLQUFILFNBQUcsRUFBSCxFQUFBO0FBQ0UsVUFBQSxHQUFHLENBQUgsVUFBQSxDQUFlLEtBRGpCLE1BQ2lCLEVBQWY7OztBQUNGLFFBQUEsR0FBRyxDQUFILFVBQUEsR0FBaUIsS0FBQyxVQUFELENBQUEsR0FBQSxDQUFpQixVQUFBLENBQUEsRUFBQTtpQkFBSyxDQUFDLENBQUQsSUFBQSxFO0FBQXRCLFNBQUEsQ0FBakI7QUFDQSxlQUFPLEdBQVA7QUFMSTtBQS9DSzs7QUFBQTtBQUFBLElBQU4sU0FBTTs7QUFBTjs7QUFDTCw2QkFBQSxXQUFBLENBQXlCLFdBQUksQ0FBN0IsU0FBQSxFQUF3QyxDQUF4QywwQkFBd0MsQ0FBeEM7OztDQURXLEMsSUFBQSxRQUFiOzs7Ozs7Ozs7Ozs7OztBQ0xBLElBQWEsSUFBTixHQUNMLGNBQWEsS0FBYixFQUFhLE1BQWIsRUFBYTtBQUFBOztBQUFDLE9BQUMsS0FBRCxHQUFDLEtBQUQ7QUFBTyxPQUFDLE1BQUQsR0FBQyxNQUFEO0FBQVIsQ0FEZjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsSUFBYSxNQUFOO0FBQUE7QUFBQTtBQUNMLGtCQUFhLEdBQWIsRUFBYSxHQUFiLEVBQWE7QUFBQTs7QUFBQyxTQUFDLEdBQUQsR0FBQyxHQUFEO0FBQUssU0FBQyxHQUFELEdBQUMsR0FBRDtBQUFOOztBQURSO0FBQUE7QUFBQSwwQkFFQTthQUNILEtBQUEsR0FBQSxHQUFPLEtBQUMsR0FBRCxDQUFLLE07QUFEVDtBQUZBOztBQUFBO0FBQUEsR0FBUDs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBYSxVQUFOO0FBQUE7QUFBQTtBQUFBOztBQUNMLHNCQUFhLEtBQWIsRUFBYSxVQUFiLEVBQWEsUUFBYixFQUFhLEdBQWIsRUFBYTtBQUFBOztBQUFBOzs7QUFBQyxVQUFDLEtBQUQsR0FBQyxLQUFEO0FBQU8sVUFBQyxVQUFELEdBQUMsVUFBRDtBQUFZLFVBQUMsUUFBRCxHQUFDLFFBQUQ7QUFBVSxVQUFDLEdBQUQsR0FBQyxHQUFEO0FBQTlCO0FBQUE7O0FBRFI7QUFBQTtBQUFBLG9DQUdZLEVBSFosRUFHWTtBQUNmLGFBQU8sS0FBQSxVQUFBLElBQUEsRUFBQSxJQUFzQixFQUFBLElBQU0sS0FBQyxRQUFwQztBQURlO0FBSFo7QUFBQTtBQUFBLHFDQUthLEdBTGIsRUFLYTtBQUNoQixhQUFPLEtBQUEsVUFBQSxJQUFlLEdBQUcsQ0FBbEIsS0FBQSxJQUE2QixHQUFHLENBQUgsR0FBQSxJQUFXLEtBQUMsUUFBaEQ7QUFEZ0I7QUFMYjtBQUFBO0FBQUEsZ0NBT007YUFDVCxLQUFBLE1BQUEsR0FBQSxVQUFBLENBQXFCLEtBQXJCLFVBQUEsRUFBa0MsS0FBbEMsUUFBQSxDO0FBRFM7QUFQTjtBQUFBO0FBQUEsZ0NBU1EsR0FUUixFQVNRO2FBQ1gsS0FBQSxTQUFBLENBQVcsS0FBQSxVQUFBLEdBQVgsR0FBQSxDO0FBRFc7QUFUUjtBQUFBO0FBQUEsK0JBV08sRUFYUCxFQVdPO0FBQ1YsVUFBQSxTQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksS0FBQSxHQUFBLEdBQU8sS0FBQyxRQUFwQjtBQUNBLFdBQUEsUUFBQSxHQUFZLEVBQVo7YUFDQSxLQUFBLEdBQUEsR0FBTyxLQUFBLFFBQUEsR0FBWSxTO0FBSFQ7QUFYUDtBQUFBO0FBQUEsMkJBZUM7QUFDSixhQUFPLElBQUEsVUFBQSxDQUFlLEtBQWYsS0FBQSxFQUFzQixLQUF0QixVQUFBLEVBQWtDLEtBQWxDLFFBQUEsRUFBNEMsS0FBNUMsR0FBQSxDQUFQO0FBREk7QUFmRDs7QUFBQTtBQUFBLEVBQUEsU0FBQSxDQUFQOzs7Ozs7Ozs7Ozs7QUNGQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBYSxRQUFOO0FBQUE7QUFBQTtBQUFBOztBQUNMLG9CQUFhLEtBQWIsRUFBYSxHQUFiLEVBQWE7QUFBQTs7QUFBQSxRQUFlLE1BQWYsdUVBQUEsRUFBQTtBQUFBLFFBQTJCLE1BQTNCLHVFQUFBLEVBQUE7QUFBQSxRQUFBLE9BQUEsdUVBQUEsRUFBQTs7QUFBQTs7O0FBQUMsVUFBQyxLQUFELEdBQUMsS0FBRDtBQUFRLFVBQUMsR0FBRCxHQUFDLEdBQUQ7QUFBK0IsVUFBQyxPQUFELEdBQUMsT0FBRDs7QUFFbkQsVUFBQSxPQUFBLENBQVMsTUFBVCxPQUFBOztBQUNBLFVBQUEsSUFBQSxHQUFRLEVBQVI7QUFDQSxVQUFBLE1BQUEsR0FBVSxNQUFWO0FBQ0EsVUFBQSxNQUFBLEdBQVUsTUFBVjtBQUxXO0FBQUE7O0FBRFI7QUFBQTtBQUFBLDRCQU9FO0FBQ0wsV0FBQSxTQUFBO0FBREY7QUFBTztBQVBGO0FBQUE7QUFBQSxnQ0FVTTtBQUNULFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxZQUFBLEdBQWdCLE1BQXpCO0FBQ0EsTUFBQSxHQUFBLEdBQUEsS0FBQSxVQUFBO0FBQUEsTUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxXQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7O0FBQ0UsWUFBRyxHQUFHLENBQUgsS0FBQSxHQUFZLEtBQUEsS0FBQSxHQUFPLEtBQUMsTUFBRCxDQUF0QixNQUFBLEVBQUE7QUFDRSxVQUFBLEdBQUcsQ0FBSCxLQUFBLElBREYsTUFDRTs7O0FBQ0YsWUFBRyxHQUFHLENBQUgsR0FBQSxJQUFXLEtBQUEsS0FBQSxHQUFPLEtBQUMsTUFBRCxDQUFyQixNQUFBLEVBQUE7dUJBQ0UsR0FBRyxDQUFILEdBQUEsSUFERixNO0FBQUEsU0FBQSxNQUFBOzRCQUFBLEM7O0FBSEY7OztBQUZTO0FBVk47QUFBQTtBQUFBLGdDQWlCTTtBQUNULFVBQUEsSUFBQTs7QUFBQSxVQUFHLEtBQUgsU0FBRyxFQUFILEVBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxLQURULFlBQ1MsRUFBUDtBQURGLE9BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQSxHQUhGLEVBR0U7OztBQUNGLGFBQU8sS0FBQSxNQUFBLEdBQUEsSUFBQSxHQUFhLEtBQUMsTUFBckI7QUFMUztBQWpCTjtBQUFBO0FBQUEsa0NBdUJRO0FBQ1gsYUFBTyxLQUFDLE1BQUQsQ0FBQSxNQUFBLEdBQWUsS0FBQyxNQUFELENBQVEsTUFBOUI7QUFEVztBQXZCUjtBQUFBO0FBQUEsMkJBMEJDO0FBQ0osVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBQSxRQUFBLENBQWEsS0FBYixLQUFBLEVBQXFCLEtBQXJCLEdBQUEsRUFBMkIsS0FBM0IsTUFBQSxFQUFvQyxLQUFwQyxNQUFBLENBQU47QUFDQSxNQUFBLEdBQUcsQ0FBSCxVQUFBLEdBQWlCLEtBQUMsVUFBRCxDQUFBLEdBQUEsQ0FBaUIsVUFBQSxDQUFBLEVBQUE7ZUFBSyxDQUFDLENBQUQsSUFBQSxFO0FBQXRCLE9BQUEsQ0FBakI7QUFDQSxhQUFPLEdBQVA7QUFISTtBQTFCRDs7QUFBQTtBQUFBLEVBQUEseUJBQUEsQ0FBUCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIiMgW3Bhd2FdXG4jICAgcmVwbGFjZSAncmVwbGFjZSgvXFxyL2cnIFwicmVwbGFjZSgnXFxyJ1wiXG5cbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuaW1wb3J0IHsgUGFpciB9IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCBjbGFzcyBCb3hIZWxwZXJcbiAgY29uc3RydWN0b3I6IChAY29udGV4dCwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIEBkZWZhdWx0cyA9IHtcbiAgICAgIGRlY286IEBjb250ZXh0LmNvZGV3YXZlLmRlY29cbiAgICAgIHBhZDogMlxuICAgICAgd2lkdGg6IDUwXG4gICAgICBoZWlnaHQ6IDNcbiAgICAgIG9wZW5UZXh0OiAnJ1xuICAgICAgY2xvc2VUZXh0OiAnJ1xuICAgICAgcHJlZml4OiAnJ1xuICAgICAgc3VmZml4OiAnJ1xuICAgICAgaW5kZW50OiAwXG4gICAgfVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgY2xvbmU6ICh0ZXh0KSAtPlxuICAgIG9wdCA9IHt9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgb3B0W2tleV0gPSB0aGlzW2tleV1cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcihAY29udGV4dCxvcHQpXG4gIGRyYXc6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAc3RhcnRTZXAoKSArIFwiXFxuXCIgKyBAbGluZXModGV4dCkgKyBcIlxcblwiKyBAZW5kU2VwKClcbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LndyYXBDb21tZW50KHN0cilcbiAgc2VwYXJhdG9yOiAtPlxuICAgIGxlbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGRlY29MaW5lKGxlbikpXG4gIHN0YXJ0U2VwOiAtPlxuICAgIGxuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoIC0gQG9wZW5UZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAcHJlZml4ICsgQHdyYXBDb21tZW50KEBvcGVuVGV4dCtAZGVjb0xpbmUobG4pKVxuICBlbmRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAY2xvc2VUZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGNsb3NlVGV4dCtAZGVjb0xpbmUobG4pKSArIEBzdWZmaXhcbiAgZGVjb0xpbmU6IChsZW4pIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChAZGVjbywgbGVuKVxuICBwYWRkaW5nOiAtPiBcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCBAcGFkKVxuICBsaW5lczogKHRleHQgPSAnJywgdXB0b0hlaWdodD10cnVlKSAtPlxuICAgIHRleHQgPSB0ZXh0IG9yICcnXG4gICAgbGluZXMgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIilcbiAgICBpZiB1cHRvSGVpZ2h0XG4gICAgICByZXR1cm4gKEBsaW5lKGxpbmVzW3hdIG9yICcnKSBmb3IgeCBpbiBbMC4uQGhlaWdodF0pLmpvaW4oJ1xcbicpIFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAoQGxpbmUobCkgZm9yIGwgaW4gbGluZXMpLmpvaW4oJ1xcbicpIFxuICBsaW5lOiAodGV4dCA9ICcnKSAtPlxuICAgIHJldHVybiAoU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLEBpbmRlbnQpICtcbiAgICAgIEB3cmFwQ29tbWVudChcbiAgICAgICAgQGRlY28gK1xuICAgICAgICBAcGFkZGluZygpICtcbiAgICAgICAgdGV4dCArXG4gICAgICAgIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgQHdpZHRoIC0gQHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyBcbiAgICAgICAgQHBhZGRpbmcoKSArXG4gICAgICAgIEBkZWNvXG4gICAgICApKVxuICBsZWZ0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50TGVmdChAZGVjbyArIEBwYWRkaW5nKCkpXG4gIHJpZ2h0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQHBhZGRpbmcoKSArIEBkZWNvKVxuICByZW1vdmVJZ25vcmVkQ29udGVudDogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnMoQGNvbnRleHQuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHRleHQpKVxuICB0ZXh0Qm91bmRzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldFR4dFNpemUoQHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpKVxuICBnZXRCb3hGb3JQb3M6IChwb3MpIC0+XG4gICAgZGVwdGggPSBAZ2V0TmVzdGVkTHZsKHBvcy5zdGFydClcbiAgICBpZiBkZXB0aCA+IDBcbiAgICAgIGxlZnQgPSBAbGVmdCgpXG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LGRlcHRoLTEpXG4gICAgICBcbiAgICAgIGNsb25lID0gQGNsb25lKClcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiXG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aFxuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSBAZGVjbyArIEBkZWNvICsgcGxhY2Vob2xkZXIgKyBAZGVjbyArIEBkZWNvXG4gICAgICBcbiAgICAgIHN0YXJ0RmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwnLionKSlcbiAgICAgIFxuICAgICAgcGFpciA9IG5ldyBQYWlyKHN0YXJ0RmluZCxlbmRGaW5kLHtcbiAgICAgICAgdmFsaWRNYXRjaDogKG1hdGNoKT0+XG4gICAgICAgICAgIyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuICAgICAgICAgIGYgPSBAY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKVxuICAgICAgICAgIHJldHVybiAhZj8gb3IgZi5zdHIgIT0gbGVmdFxuICAgICAgfSlcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsQGNvbnRleHQuY29kZXdhdmUuZWRpdG9yLnRleHQoKSlcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgcmVzLnN0YXJ0ICs9IGN1ckxlZnQubGVuZ3RoXG4gICAgICAgIHJldHVybiByZXNcbiAgICBcbiAgZ2V0TmVzdGVkTHZsOiAoaW5kZXgpIC0+XG4gICAgZGVwdGggPSAwXG4gICAgbGVmdCA9IEBsZWZ0KClcbiAgICB3aGlsZSAoZiA9IEBjb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KGluZGV4ICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKSk/ICYmIGYuc3RyID09IGxlZnRcbiAgICAgIGluZGV4ID0gZi5wb3NcbiAgICAgIGRlcHRoKytcbiAgICByZXR1cm4gZGVwdGhcbiAgZ2V0T3B0RnJvbUxpbmU6IChsaW5lLGdldFBhZD10cnVlKSAtPlxuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdChAZGVjbykpK1wiKShcXFxccyopXCIpXG4gICAgckVuZCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQGRlY28pKStcIikoXFxufCQpXCIpXG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKVxuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKVxuICAgIGlmIHJlc1N0YXJ0PyBhbmQgcmVzRW5kP1xuICAgICAgaWYgZ2V0UGFkXG4gICAgICAgIEBwYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgscmVzRW5kWzFdLmxlbmd0aClcbiAgICAgIEBpbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGhcbiAgICAgIHN0YXJ0UG9zID0gcmVzU3RhcnQuaW5kZXggKyByZXNTdGFydFsxXS5sZW5ndGggKyByZXNTdGFydFsyXS5sZW5ndGggKyBAcGFkICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICdyZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCcgcmVzU3RhcnQuZW5kKDIpXG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gQHBhZCAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAncmVzRW5kLmluZGV4ICsgcmVzRW5kWzFdLmxlbmd0aCcgcmVzRW5kLnN0YXJ0KDIpXG4gICAgICBAd2lkdGggPSBlbmRQb3MgLSBzdGFydFBvc1xuICAgIHJldHVybiB0aGlzXG4gIHJlZm9ybWF0TGluZXM6ICh0ZXh0LG9wdGlvbnM9e30pIC0+XG4gICAgcmV0dXJuIEBsaW5lcyhAcmVtb3ZlQ29tbWVudCh0ZXh0LG9wdGlvbnMpLGZhbHNlKVxuICByZW1vdmVDb21tZW50OiAodGV4dCxvcHRpb25zPXt9KS0+XG4gICAgaWYgdGV4dD9cbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH1cbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24oe30sZGVmYXVsdHMsb3B0aW9ucylcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAZGVjbylcbiAgICAgIGZsYWcgPSBpZiBvcHRpb25zWydtdWx0aWxpbmUnXSB0aGVuICdnbScgZWxzZSAnJyAgICAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBcIidnbSdcIiByZS5NXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKiN7ZWNsfSg/OiN7ZWR9KSpcXFxcc3swLCN7QHBhZH19XCIsIGZsYWcpICAgICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICN7QHBhZH0gJ1wiK3N0cihzZWxmLnBhZCkrXCInXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXFxcXHMqKD86I3tlZH0pKiN7ZWNyfVxcXFxzKiRcIiwgZmxhZylcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmUxLCcnKS5yZXBsYWNlKHJlMiwnJylcbiAgIFxuICAiLCJpbXBvcnQgeyBQb3NDb2xsZWN0aW9uIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBDbG9zaW5nUHJvbXBcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsc2VsZWN0aW9ucykgLT5cbiAgICBAdGltZW91dCA9IG51bGxcbiAgICBAX3R5cGVkID0gbnVsbFxuICAgIEBzdGFydGVkID0gZmFsc2VcbiAgICBAbmJDaGFuZ2VzID0gMFxuICAgIEBzZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucylcbiAgYmVnaW46IC0+XG4gICAgQHN0YXJ0ZWQgPSB0cnVlXG4gICAgQGFkZENhcnJldHMoKVxuICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKVxuICAgICAgQHByb3h5T25DaGFuZ2UgPSAoY2g9bnVsbCk9PiBAb25DaGFuZ2UoY2gpXG4gICAgICBAY29kZXdhdmUuZWRpdG9yLmFkZENoYW5nZUxpc3RlbmVyKCBAcHJveHlPbkNoYW5nZSApXG4gICAgICBcbiAgICBcbiAgICByZXR1cm4gdGhpc1xuICBhZGRDYXJyZXRzOiAtPlxuICAgIEByZXBsYWNlbWVudHMgPSBAc2VsZWN0aW9ucy53cmFwKFxuICAgICAgQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2FycmV0Q2hhciArIEBjb2Rld2F2ZS5icmFrZXRzICsgXCJcXG5cIixcbiAgICAgIFwiXFxuXCIgKyBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY29kZXdhdmUuY2FycmV0Q2hhciArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgKS5tYXAoIChwKSAtPiBwLmNhcnJldFRvU2VsKCkgKVxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoQHJlcGxhY2VtZW50cylcbiAgaW52YWxpZFR5cGVkOiAtPlxuICAgIEBfdHlwZWQgPSBudWxsXG4gIG9uQ2hhbmdlOiAoY2ggPSBudWxsKS0+XG4gICAgQGludmFsaWRUeXBlZCgpXG4gICAgaWYgQHNraXBFdmVudChjaClcbiAgICAgIHJldHVyblxuICAgIEBuYkNoYW5nZXMrK1xuICAgIGlmIEBzaG91bGRTdG9wKClcbiAgICAgIEBzdG9wKClcbiAgICAgIEBjbGVhbkNsb3NlKClcbiAgICBlbHNlXG4gICAgICBAcmVzdW1lKClcbiAgICAgIFxuICBza2lwRXZlbnQ6IChjaCkgLT5cbiAgICByZXR1cm4gY2g/IGFuZCBjaC5jaGFyQ29kZUF0KDApICE9IDMyXG4gIFxuICByZXN1bWU6IC0+XG4gICAgI1xuICAgIFxuICBzaG91bGRTdG9wOiAtPlxuICAgIHJldHVybiBAdHlwZWQoKSA9PSBmYWxzZSBvciBAdHlwZWQoKS5pbmRleE9mKCcgJykgIT0gLTFcbiAgXG4gIGNsZWFuQ2xvc2U6IC0+XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzZWxlY3Rpb25zID0gQGdldFNlbGVjdGlvbnMoKVxuICAgIGZvciBzZWwgaW4gc2VsZWN0aW9uc1xuICAgICAgaWYgcG9zID0gQHdoaXRoaW5PcGVuQm91bmRzKHNlbClcbiAgICAgICAgc3RhcnQgPSBzZWxcbiAgICAgIGVsc2UgaWYgKGVuZCA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgYW5kIHN0YXJ0P1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS5pbm5lclRleHQoKS5zcGxpdCgnICcpWzBdXG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoZW5kLmlubmVyU3RhcnQsZW5kLmlubmVyRW5kLHJlcylcbiAgICAgICAgcmVwbC5zZWxlY3Rpb25zID0gW3N0YXJ0XVxuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgZ2V0U2VsZWN0aW9uczogLT5cbiAgICByZXR1cm4gQGNvZGV3YXZlLmVkaXRvci5nZXRNdWx0aVNlbCgpXG4gIHN0b3A6IC0+XG4gICAgQHN0YXJ0ZWQgPSBmYWxzZVxuICAgIGNsZWFyVGltZW91dChAdGltZW91dCkgaWYgQHRpbWVvdXQ/XG4gICAgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGwgaWYgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9PSB0aGlzXG4gICAgaWYgQHByb3h5T25DaGFuZ2U/XG4gICAgICBAY29kZXdhdmUuZWRpdG9yLnJlbW92ZUNoYW5nZUxpc3RlbmVyKEBwcm94eU9uQ2hhbmdlKVxuICBjYW5jZWw6IC0+XG4gICAgaWYgQHR5cGVkKCkgIT0gZmFsc2VcbiAgICAgIEBjYW5jZWxTZWxlY3Rpb25zKEBnZXRTZWxlY3Rpb25zKCkpXG4gICAgQHN0b3AoKVxuICBjYW5jZWxTZWxlY3Rpb25zOiAoc2VsZWN0aW9ucykgLT5cbiAgICByZXBsYWNlbWVudHMgPSBbXVxuICAgIHN0YXJ0ID0gbnVsbFxuICAgIGZvciBzZWwgaW4gc2VsZWN0aW9uc1xuICAgICAgaWYgcG9zID0gQHdoaXRoaW5PcGVuQm91bmRzKHNlbClcbiAgICAgICAgc3RhcnQgPSBwb3NcbiAgICAgIGVsc2UgaWYgKGVuZCA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgYW5kIHN0YXJ0P1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXcgUmVwbGFjZW1lbnQoc3RhcnQuc3RhcnQsZW5kLmVuZCxAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoc3RhcnQuZW5kKzEsIGVuZC5zdGFydC0xKSkuc2VsZWN0Q29udGVudCgpKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgdHlwZWQ6IC0+XG4gICAgdW5sZXNzIEBfdHlwZWQ/XG4gICAgICBjcG9zID0gQGNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKVxuICAgICAgaW5uZXJTdGFydCA9IEByZXBsYWNlbWVudHNbMF0uc3RhcnQgKyBAY29kZXdhdmUuYnJha2V0cy5sZW5ndGhcbiAgICAgIGlmIEBjb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PSBAcmVwbGFjZW1lbnRzWzBdLnN0YXJ0IGFuZCAoaW5uZXJFbmQgPSBAY29kZXdhdmUuZmluZE5leHRCcmFrZXQoaW5uZXJTdGFydCkpPyBhbmQgaW5uZXJFbmQgPj0gY3Bvcy5lbmRcbiAgICAgICAgQF90eXBlZCA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihpbm5lclN0YXJ0LCBpbm5lckVuZClcbiAgICAgIGVsc2VcbiAgICAgICAgQF90eXBlZCA9IGZhbHNlXG4gICAgcmV0dXJuIEBfdHlwZWRcbiAgd2hpdGhpbk9wZW5Cb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQHN0YXJ0UG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09IHRhcmdldFRleHRcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuICB3aGl0aGluQ2xvc2VCb3VuZHM6IChwb3MpIC0+XG4gICAgZm9yIHJlcGwsIGkgaW4gQHJlcGxhY2VtZW50c1xuICAgICAgdGFyZ2V0UG9zID0gQGVuZFBvc0F0KGkpXG4gICAgICB0YXJnZXRUZXh0ID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT0gdGFyZ2V0VGV4dFxuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG4gIHN0YXJ0UG9zQXQ6IChpbmRleCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5zdGFydCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyKSxcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5lbmQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMSlcbiAgICAgICkud3JhcHBlZEJ5KEBjb2Rld2F2ZS5icmFrZXRzLCBAY29kZXdhdmUuYnJha2V0cylcbiAgZW5kUG9zQXQ6IChpbmRleCkgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5zdGFydCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsxKSxcbiAgICAgICAgQHJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5lbmQgKyBAdHlwZWQoKS5sZW5ndGggKiAoaW5kZXgqMiArMilcbiAgICAgICkud3JhcHBlZEJ5KEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciwgQGNvZGV3YXZlLmJyYWtldHMpXG5cbmV4cG9ydCBjbGFzcyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgZXh0ZW5kcyBDbG9zaW5nUHJvbXBcbiAgcmVzdW1lOiAtPlxuICAgIEBzaW11bGF0ZVR5cGUoKVxuICBzaW11bGF0ZVR5cGU6IC0+XG4gICAgY2xlYXJUaW1lb3V0KEB0aW1lb3V0KSBpZiBAdGltZW91dD9cbiAgICBAdGltZW91dCA9IHNldFRpbWVvdXQgKD0+XG4gICAgICBAaW52YWxpZFR5cGVkKClcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBjdXJDbG9zZSA9IEB3aGl0aGluQ2xvc2VCb3VuZHMoQHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdLmNvcHkoKS5hcHBseU9mZnNldChAdHlwZWQoKS5sZW5ndGgpKVxuICAgICAgaWYgY3VyQ2xvc2VcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChjdXJDbG9zZS5zdGFydCxjdXJDbG9zZS5lbmQsdGFyZ2V0VGV4dClcbiAgICAgICAgaWYgcmVwbC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLm5lY2Vzc2FyeSgpXG4gICAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pXG4gICAgICBlbHNlXG4gICAgICAgIEBzdG9wKClcbiAgICAgIEBvblR5cGVTaW11bGF0ZWQoKSBpZiBAb25UeXBlU2ltdWxhdGVkP1xuICAgICksIDJcbiAgc2tpcEV2ZW50OiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBnZXRTZWxlY3Rpb25zOiAtPlxuICAgIHJldHVybiBbXG4gICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKClcbiAgICAgICAgQHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdICsgQHR5cGVkKCkubGVuZ3RoXG4gICAgICBdXG4gIHdoaXRoaW5DbG9zZUJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAZW5kUG9zQXQoaSlcbiAgICAgIG5leHQgPSBAY29kZXdhdmUuZmluZE5leHRCcmFrZXQodGFyZ2V0UG9zLmlubmVyU3RhcnQpXG4gICAgICBpZiBuZXh0P1xuICAgICAgICB0YXJnZXRQb3MubW92ZVN1ZmZpeChuZXh0KVxuICAgICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgIHJldHVybiBmYWxzZVxuXG5DbG9zaW5nUHJvbXAubmV3Rm9yID0gKGNvZGV3YXZlLHNlbGVjdGlvbnMpIC0+XG4gIGlmIGNvZGV3YXZlLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICByZXR1cm4gbmV3IENsb3NpbmdQcm9tcChjb2Rld2F2ZSxzZWxlY3Rpb25zKVxuICBlbHNlXG4gICAgcmV0dXJuIG5ldyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAoY29kZXdhdmUsc2VsZWN0aW9ucykiLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBDbWRGaW5kZXJcbiAgY29uc3RydWN0b3I6IChuYW1lcywgb3B0aW9ucykgLT5cbiAgICBpZiB0eXBlb2YgbmFtZXMgPT0gJ3N0cmluZydcbiAgICAgIG5hbWVzID0gW25hbWVzXVxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsXG4gICAgICBuYW1lc3BhY2VzOiBbXVxuICAgICAgcGFyZW50Q29udGV4dDogbnVsbFxuICAgICAgY29udGV4dDogbnVsbFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzXG4gICAgICBtdXN0RXhlY3V0ZTogdHJ1ZVxuICAgICAgdXNlRGV0ZWN0b3JzOiB0cnVlXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWVcbiAgICAgIGluc3RhbmNlOiBudWxsXG4gICAgICBjb2Rld2F2ZTogbnVsbFxuICAgIH1cbiAgICBAbmFtZXMgPSBuYW1lc1xuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoQGNvZGV3YXZlKVxuICAgIGlmIEBwYXJlbnRDb250ZXh0P1xuICAgICAgQGNvbnRleHQucGFyZW50ID0gQHBhcmVudENvbnRleHRcbiAgICBpZiBAbmFtZXNwYWNlcz9cbiAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMoQG5hbWVzcGFjZXMpXG4gIGZpbmQ6IC0+XG4gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAgIEBjbWQgPSBAZmluZEluKEByb290KVxuICAgIHJldHVybiBAY21kXG4jICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4jICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiMgICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4jICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzOiAtPlxuICAgIHBhdGhzID0ge31cbiAgICBmb3IgbmFtZSBpbiBAbmFtZXMgXG4gICAgICBbc3BhY2UscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgc3BhY2U/IGFuZCAhKHNwYWNlIGluIEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgICAgdW5sZXNzIHNwYWNlIG9mIHBhdGhzIFxuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpXG4gICAgcmV0dXJuIHBhdGhzXG4gIGFwcGx5U3BhY2VPbk5hbWVzOiAobmFtZXNwYWNlKSAtPlxuICAgIFtzcGFjZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSx0cnVlKVxuICAgIEBuYW1lcy5tYXAoIChuYW1lKSAtPlxuICAgICAgW2N1cl9zcGFjZSxjdXJfcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgY3VyX3NwYWNlPyBhbmQgY3VyX3NwYWNlID09IHNwYWNlXG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdFxuICAgICAgaWYgcmVzdD9cbiAgICAgICAgbmFtZSA9IHJlc3QgKyAnOicgKyBuYW1lXG4gICAgICByZXR1cm4gbmFtZVxuICAgIClcbiAgZ2V0RGlyZWN0TmFtZXM6IC0+XG4gICAgcmV0dXJuIChuIGZvciBuIGluIEBuYW1lcyB3aGVuIG4uaW5kZXhPZihcIjpcIikgPT0gLTEpXG4gIHRyaWdnZXJEZXRlY3RvcnM6IC0+XG4gICAgaWYgQHVzZURldGVjdG9ycyBcbiAgICAgIEB1c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcG9zaWJpbGl0aWVzID0gbmV3IENtZEZpbmRlcihAY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKVxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoXG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXVxuICAgICAgICBmb3IgZGV0ZWN0b3IgaW4gY21kLmRldGVjdG9ycyBcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcylcbiAgICAgICAgICBpZiByZXM/XG4gICAgICAgICAgICBAY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcylcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICAgICAgaSsrXG4gIGZpbmRJbjogKGNtZCxwYXRoID0gbnVsbCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIG51bGxcbiAgICBiZXN0ID0gQGJlc3RJblBvc2liaWxpdGllcyhAZmluZFBvc2liaWxpdGllcygpKVxuICAgIGlmIGJlc3Q/XG4gICAgICByZXR1cm4gYmVzdFxuICBmaW5kUG9zaWJpbGl0aWVzOiAtPlxuICAgIHVubGVzcyBAcm9vdD9cbiAgICAgIHJldHVybiBbXVxuICAgIEByb290LmluaXQoKVxuICAgIHBvc2liaWxpdGllcyA9IFtdXG4gICAgZm9yIHNwYWNlLCBuYW1lcyBvZiBAZ2V0TmFtZXNXaXRoUGF0aHMoKVxuICAgICAgbmV4dHMgPSBAZ2V0Q21kRm9sbG93QWxpYXMoc3BhY2UpXG4gICAgICBmb3IgbmV4dCBpbiBuZXh0c1xuICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgZm9yIG5zcGMgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICBbbnNwY05hbWUscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLHRydWUpXG4gICAgICBuZXh0cyA9IEBnZXRDbWRGb2xsb3dBbGlhcyhuc3BjTmFtZSlcbiAgICAgIGZvciBuZXh0IGluIG5leHRzXG4gICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihAYXBwbHlTcGFjZU9uTmFtZXMobnNwYyksIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgZm9yIG5hbWUgaW4gQGdldERpcmVjdE5hbWVzKClcbiAgICAgIGRpcmVjdCA9IEByb290LmdldENtZChuYW1lKVxuICAgICAgaWYgQGNtZElzVmFsaWQoZGlyZWN0KVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpXG4gICAgaWYgQHVzZUZhbGxiYWNrc1xuICAgICAgZmFsbGJhY2sgPSBAcm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJylcbiAgICAgIGlmIEBjbWRJc1ZhbGlkKGZhbGxiYWNrKVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjaylcbiAgICBAcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzXG4gICAgcmV0dXJuIHBvc2liaWxpdGllc1xuICBnZXRDbWRGb2xsb3dBbGlhczogKG5hbWUpIC0+XG4gICAgY21kID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgaWYgY21kPyBcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5hbGlhc09mP1xuICAgICAgICByZXR1cm4gW2NtZCxjbWQuZ2V0QWxpYXNlZCgpXVxuICAgICAgcmV0dXJuIFtjbWRdXG4gICAgcmV0dXJuIFtjbWRdXG4gIGNtZElzVmFsaWQ6IChjbWQpIC0+XG4gICAgdW5sZXNzIGNtZD9cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIGNtZC5uYW1lICE9ICdmYWxsYmFjaycgJiYgY21kIGluIEBhbmNlc3RvcnMoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuICFAbXVzdEV4ZWN1dGUgb3IgQGNtZElzRXhlY3V0YWJsZShjbWQpXG4gIGFuY2VzdG9yczogLT5cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGNtZElzRXhlY3V0YWJsZTogKGNtZCkgLT5cbiAgICBuYW1lcyA9IEBnZXREaXJlY3ROYW1lcygpXG4gICAgaWYgbmFtZXMubGVuZ3RoID09IDFcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gIGNtZFNjb3JlOiAoY21kKSAtPlxuICAgIHNjb3JlID0gY21kLmRlcHRoXG4gICAgaWYgY21kLm5hbWUgPT0gJ2ZhbGxiYWNrJyBcbiAgICAgICAgc2NvcmUgLT0gMTAwMFxuICAgIHJldHVybiBzY29yZVxuICBiZXN0SW5Qb3NpYmlsaXRpZXM6IChwb3NzKSAtPlxuICAgIGlmIHBvc3MubGVuZ3RoID4gMFxuICAgICAgYmVzdCA9IG51bGxcbiAgICAgIGJlc3RTY29yZSA9IG51bGxcbiAgICAgIGZvciBwIGluIHBvc3NcbiAgICAgICAgc2NvcmUgPSBAY21kU2NvcmUocClcbiAgICAgICAgaWYgIWJlc3Q/IG9yIHNjb3JlID49IGJlc3RTY29yZVxuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlXG4gICAgICAgICAgYmVzdCA9IHBcbiAgICAgIHJldHVybiBiZXN0OyIsIiMgW3Bhd2FdXG4jICAgcmVwbGFjZSAncmVwbGFjZSgvXFx0L2cnICdyZXBsYWNlKFwiXFx0XCInXG5cbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBDbWRJbnN0YW5jZVxuICBjb25zdHJ1Y3RvcjogKEBjbWQsQGNvbnRleHQpIC0+XG4gIFxuICBpbml0OiAtPlxuICAgIHVubGVzcyBAaXNFbXB0eSgpIG9yIEBpbml0ZWRcbiAgICAgIEBpbml0ZWQgPSB0cnVlXG4gICAgICBAX2dldENtZE9iaigpXG4gICAgICBAX2luaXRQYXJhbXMoKVxuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgQGNtZE9iai5pbml0KClcbiAgICByZXR1cm4gdGhpc1xuICBzZXRQYXJhbToobmFtZSx2YWwpLT5cbiAgICBAbmFtZWRbbmFtZV0gPSB2YWxcbiAgcHVzaFBhcmFtOih2YWwpLT5cbiAgICBAcGFyYW1zLnB1c2godmFsKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgIHJldHVybiBAY29udGV4dCBvciBuZXcgQ29udGV4dCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUpLT5cbiAgICBmaW5kZXIgPSBAZ2V0Q29udGV4dCgpLmdldEZpbmRlcihjbWROYW1lLEBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRDbWRPYmo6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIEBjbWQuaW5pdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5jbHM/XG4gICAgICAgIEBjbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKVxuICAgICAgICByZXR1cm4gQGNtZE9ialxuICBfaW5pdFBhcmFtczogLT5cbiAgICBAbmFtZWQgPSBAZ2V0RGVmYXVsdHMoKVxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICByZXR1cm4gW11cbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQGNtZD9cbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIHJldHVybiBAY21kLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJlcyA9IHt9XG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGNtZC5kZWZhdWx0cylcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBjbWRPYmouZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJldHVybiByZXNcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIHJldHVybiBAYWxpYXNlZENtZCBvciBudWxsXG4gIGdldEFsaWFzZWRGaW5hbDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGFsaWFzZWRGaW5hbENtZD9cbiAgICAgICAgcmV0dXJuIEBhbGlhc2VkRmluYWxDbWQgb3IgbnVsbFxuICAgICAgaWYgQGNtZC5hbGlhc09mP1xuICAgICAgICBhbGlhc2VkID0gQGNtZFxuICAgICAgICB3aGlsZSBhbGlhc2VkPyBhbmQgYWxpYXNlZC5hbGlhc09mP1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcihAZ2V0RmluZGVyKEBhbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG4gICAgICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICAgICAgQGFsaWFzZWRDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIEBhbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIHJldHVybiBhbGlhc2VkXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBhbGlhc09mXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPcHRpb25zP1xuICAgICAgICByZXR1cm4gQGNtZE9wdGlvbnNcbiAgICAgIG9wdCA9IEBjbWQuX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxAY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIEBjbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIG9wdGlvbnM/IGFuZCBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBnZXRQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIG5hbWVzID0gW25hbWVzXSBpZiAodHlwZW9mIG5hbWVzIGluIFsnc3RyaW5nJywnbnVtYmVyJ10pXG4gICAgZm9yIG4gaW4gbmFtZXNcbiAgICAgIHJldHVybiBAbmFtZWRbbl0gaWYgQG5hbWVkW25dP1xuICAgICAgcmV0dXJuIEBwYXJhbXNbbl0gaWYgQHBhcmFtc1tuXT9cbiAgICByZXR1cm4gZGVmVmFsXG4gIGFuY2VzdG9yQ21kczogLT5cbiAgICBpZiBAY29udGV4dC5jb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKVxuICAgIHJldHVybiBbXVxuICBhbmNlc3RvckNtZHNBbmRTZWxmOiAtPlxuICAgIHJldHVybiBAYW5jZXN0b3JDbWRzKCkuY29uY2F0KFtAY21kXSlcbiAgcnVuRXhlY3V0ZUZ1bmN0OiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5leGVjdXRlKClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkRmluYWwoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuZXhlY3V0ZUZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKVxuICByYXdSZXN1bHQ6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZEZpbmFsKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLnJlc3VsdEZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpXG4gICAgICBpZiBjbWQucmVzdWx0U3RyP1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0clxuICByZXN1bHQ6IC0+IFxuICAgIEBpbml0KClcbiAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgaWYgKHJlcyA9IEByYXdSZXN1bHQoKSk/XG4gICAgICAgIHJlcyA9IEBmb3JtYXRJbmRlbnQocmVzKVxuICAgICAgICBpZiByZXMubGVuZ3RoID4gMCBhbmQgQGdldE9wdGlvbigncGFyc2UnLHRoaXMpIFxuICAgICAgICAgIHBhcnNlciA9IEBnZXRQYXJzZXJGb3JUZXh0KHJlcylcbiAgICAgICAgICByZXMgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgICBpZiBhbHRlckZ1bmN0ID0gQGdldE9wdGlvbignYWx0ZXJSZXN1bHQnLHRoaXMpXG4gICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsdGhpcylcbiAgICAgICAgcmV0dXJuIHJlc1xuICBnZXRQYXJzZXJGb3JUZXh0OiAodHh0PScnKSAtPlxuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7aW5JbnN0YW5jZTp0aGlzfSlcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuICAgIHJldHVybiBwYXJzZXJcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHJldHVybiAwXG4gIGZvcm1hdEluZGVudDogKHRleHQpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcdC9nLCcgICcpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYXBwbHlJbmRlbnQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuaW5kZW50Tm90Rmlyc3QodGV4dCxAZ2V0SW5kZW50KCksXCIgXCIpIiwiaW1wb3J0IHsgUHJvY2VzcyB9IGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSB9IGZyb20gJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcic7XG5pbXBvcnQgeyBQb3NDb2xsZWN0aW9uIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgQ2xvc2luZ1Byb21wIH0gZnJvbSAnLi9DbG9zaW5nUHJvbXAnO1xuXG5leHBvcnQgY2xhc3MgQ29kZXdhdmVcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBvcHRpb25zID0ge30pIC0+XG4gICAgQ29kZXdhdmUuaW5pdCgpXG4gICAgQG1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nXG4gICAgQHZhcnMgPSB7fVxuICAgIFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ2JyYWtldHMnIDogJ35+JyxcbiAgICAgICdkZWNvJyA6ICd+JyxcbiAgICAgICdjbG9zZUNoYXInIDogJy8nLFxuICAgICAgJ25vRXhlY3V0ZUNoYXInIDogJyEnLFxuICAgICAgJ2NhcnJldENoYXInIDogJ3wnLFxuICAgICAgJ2NoZWNrQ2FycmV0JyA6IHRydWUsXG4gICAgICAnaW5JbnN0YW5jZScgOiBudWxsXG4gICAgfVxuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIFxuICAgIEBuZXN0ZWQgPSBpZiBAcGFyZW50PyB0aGVuIEBwYXJlbnQubmVzdGVkKzEgZWxzZSAwXG4gICAgXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgQGVkaXRvci5iaW5kZWRUbyh0aGlzKSBpZiBAZWRpdG9yP1xuICAgIFxuICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQodGhpcylcbiAgICBpZiBAaW5JbnN0YW5jZT9cbiAgICAgIEBjb250ZXh0LnBhcmVudCA9IEBpbkluc3RhbmNlLmNvbnRleHRcblxuICAgIEBsb2dnZXIgPSBuZXcgTG9nZ2VyKClcblxuICBvbkFjdGl2YXRpb25LZXk6IC0+XG4gICAgQHByb2Nlc3MgPSBuZXcgUHJvY2VzcygpXG4gICAgQGxvZ2dlci5sb2coJ2FjdGl2YXRpb24ga2V5JylcbiAgICBAcnVuQXRDdXJzb3JQb3MoKVxuICAgIEBwcm9jZXNzID0gbnVsbFxuICBydW5BdEN1cnNvclBvczogLT5cbiAgICBpZiBAZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgICAgQHJ1bkF0TXVsdGlQb3MoQGVkaXRvci5nZXRNdWx0aVNlbCgpKVxuICAgIGVsc2VcbiAgICAgIEBydW5BdFBvcyhAZWRpdG9yLmdldEN1cnNvclBvcygpKVxuICBydW5BdFBvczogKHBvcyktPlxuICAgIEBydW5BdE11bHRpUG9zKFtwb3NdKVxuICBydW5BdE11bHRpUG9zOiAobXVsdGlQb3MpLT5cbiAgICBpZiBtdWx0aVBvcy5sZW5ndGggPiAwXG4gICAgICBjbWQgPSBAY29tbWFuZE9uUG9zKG11bHRpUG9zWzBdLmVuZClcbiAgICAgIGlmIGNtZD9cbiAgICAgICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcylcbiAgICAgICAgY21kLmluaXQoKVxuICAgICAgICBAbG9nZ2VyLmxvZyhjbWQpXG4gICAgICAgIGNtZC5leGVjdXRlKClcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbXVsdGlQb3NbMF0uc3RhcnQgPT0gbXVsdGlQb3NbMF0uZW5kXG4gICAgICAgICAgQGFkZEJyYWtldHMobXVsdGlQb3MpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcylcbiAgY29tbWFuZE9uUG9zOiAocG9zKSAtPlxuICAgIGlmIEBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIGFuZCBAZm9sbG93ZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAxIFxuICAgICAgcHJldiA9IHBvcy1AYnJha2V0cy5sZW5ndGhcbiAgICAgIG5leHQgPSBwb3NcbiAgICBlbHNlXG4gICAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAwXG4gICAgICAgIHBvcyAtPSBAYnJha2V0cy5sZW5ndGhcbiAgICAgIHByZXYgPSBAZmluZFByZXZCcmFrZXQocG9zKVxuICAgICAgdW5sZXNzIHByZXY/XG4gICAgICAgIHJldHVybiBudWxsIFxuICAgICAgbmV4dCA9IEBmaW5kTmV4dEJyYWtldChwb3MtMSlcbiAgICAgIGlmICFuZXh0PyBvciBAY291bnRQcmV2QnJha2V0KHByZXYpICUgMiAhPSAwIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMscHJldixAZWRpdG9yLnRleHRTdWJzdHIocHJldixuZXh0K0BicmFrZXRzLmxlbmd0aCkpXG4gIG5leHRDbWQ6IChzdGFydCA9IDApIC0+XG4gICAgcG9zID0gc3RhcnRcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyAsW0BicmFrZXRzLFwiXFxuXCJdKVxuICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGhcbiAgICAgIGlmIGYuc3RyID09IEBicmFrZXRzXG4gICAgICAgIGlmIGJlZ2lubmluZz9cbiAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIEBlZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zK0BicmFrZXRzLmxlbmd0aCkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvc1xuICAgICAgZWxzZVxuICAgICAgICBiZWdpbm5pbmcgPSBudWxsXG4gICAgbnVsbFxuICBnZXRFbmNsb3NpbmdDbWQ6IChwb3MgPSAwKSAtPlxuICAgIGNwb3MgPSBwb3NcbiAgICBjbG9zaW5nUHJlZml4ID0gQGJyYWtldHMgKyBAY2xvc2VDaGFyXG4gICAgd2hpbGUgKHAgPSBAZmluZE5leHQoY3BvcyxjbG9zaW5nUHJlZml4KSk/XG4gICAgICBpZiBjbWQgPSBAY29tbWFuZE9uUG9zKHArY2xvc2luZ1ByZWZpeC5sZW5ndGgpXG4gICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgICAgaWYgY21kLnBvcyA8IHBvc1xuICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgIGVsc2VcbiAgICAgICAgY3BvcyA9IHArY2xvc2luZ1ByZWZpeC5sZW5ndGhcbiAgICBudWxsXG4gIHByZWNlZGVkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLUBicmFrZXRzLmxlbmd0aCxwb3MpID09IEBicmFrZXRzXG4gIGZvbGxvd2VkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLHBvcytAYnJha2V0cy5sZW5ndGgpID09IEBicmFrZXRzXG4gIGNvdW50UHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICBpID0gMFxuICAgIHdoaWxlIChzdGFydCA9IEBmaW5kUHJldkJyYWtldChzdGFydCkpP1xuICAgICAgaSsrXG4gICAgcmV0dXJuIGlcbiAgaXNFbmRMaW5lOiAocG9zKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrMSkgPT0gXCJcXG5cIiBvciBwb3MgKyAxID49IEBlZGl0b3IudGV4dExlbigpXG4gIGZpbmRQcmV2QnJha2V0OiAoc3RhcnQpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHRCcmFrZXQoc3RhcnQsLTEpXG4gIGZpbmROZXh0QnJha2V0OiAoc3RhcnQsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW0BicmFrZXRzLFwiXFxuXCJdLCBkaXJlY3Rpb24pXG4gICAgXG4gICAgZi5wb3MgaWYgZiBhbmQgZi5zdHIgPT0gQGJyYWtldHNcbiAgZmluZFByZXY6IChzdGFydCxzdHJpbmcpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHQoc3RhcnQsc3RyaW5nLC0xKVxuICBmaW5kTmV4dDogKHN0YXJ0LHN0cmluZyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBmID0gQGZpbmRBbnlOZXh0KHN0YXJ0ICxbc3RyaW5nXSwgZGlyZWN0aW9uKVxuICAgIGYucG9zIGlmIGZcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci5maW5kQW55TmV4dChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbilcbiAgICBcbiAgZmluZE1hdGNoaW5nUGFpcjogKHN0YXJ0UG9zLG9wZW5pbmcsY2xvc2luZyxkaXJlY3Rpb24gPSAxKSAtPlxuICAgIHBvcyA9IHN0YXJ0UG9zXG4gICAgbmVzdGVkID0gMFxuICAgIHdoaWxlIGYgPSBAZmluZEFueU5leHQocG9zLFtjbG9zaW5nLG9wZW5pbmddLGRpcmVjdGlvbilcbiAgICAgIHBvcyA9IGYucG9zICsgKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBmLnN0ci5sZW5ndGggZWxzZSAwKVxuICAgICAgaWYgZi5zdHIgPT0gKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBjbG9zaW5nIGVsc2Ugb3BlbmluZylcbiAgICAgICAgaWYgbmVzdGVkID4gMFxuICAgICAgICAgIG5lc3RlZC0tXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZlxuICAgICAgZWxzZVxuICAgICAgICBuZXN0ZWQrK1xuICAgIG51bGxcbiAgYWRkQnJha2V0czogKHBvcykgLT5cbiAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpXG4gICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAoQGJyYWtldHMsQGJyYWtldHMpLm1hcCggKHIpLT5yLnNlbGVjdENvbnRlbnQoKSApXG4gICAgQGVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIHByb21wdENsb3NpbmdDbWQ6IChzZWxlY3Rpb25zKSAtPlxuICAgIEBjbG9zaW5nUHJvbXAuc3RvcCgpIGlmIEBjbG9zaW5nUHJvbXA/XG4gICAgQGNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcC5uZXdGb3IodGhpcyxzZWxlY3Rpb25zKS5iZWdpbigpICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIC9cXChuZXcgKC4qKVxcKS5iZWdpbi8gJDEuYmVnaW4gcmVwYXJzZVxuICBwYXJzZUFsbDogKHJlY3Vyc2l2ZSA9IHRydWUpIC0+XG4gICAgaWYgQG5lc3RlZCA+IDEwMFxuICAgICAgdGhyb3cgXCJJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvblwiXG4gICAgcG9zID0gMFxuICAgIHdoaWxlIGNtZCA9IEBuZXh0Q21kKHBvcylcbiAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKVxuICAgICAgQGVkaXRvci5zZXRDdXJzb3JQb3MocG9zKVxuICAgICAgIyBjb25zb2xlLmxvZyhjbWQpXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiByZWN1cnNpdmUgYW5kIGNtZC5jb250ZW50PyBhbmQgKCFjbWQuZ2V0Q21kKCk/IG9yICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSlcbiAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge3BhcmVudDogdGhpc30pXG4gICAgICAgIGNtZC5jb250ZW50ID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIGlmIGNtZC5leGVjdXRlKCk/XG4gICAgICAgIGlmIGNtZC5yZXBsYWNlRW5kP1xuICAgICAgICAgIHBvcyA9IGNtZC5yZXBsYWNlRW5kXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwb3MgPSBAZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZFxuICAgIHJldHVybiBAZ2V0VGV4dCgpXG4gIGdldFRleHQ6IC0+XG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dCgpXG4gIGlzUm9vdDogLT5cbiAgICByZXR1cm4gIUBwYXJlbnQ/IGFuZCAoIUBpbkluc3RhbmNlPyBvciAhQGluSW5zdGFuY2UuZmluZGVyPylcbiAgZ2V0Um9vdDogLT5cbiAgICBpZiBAaXNSb290XG4gICAgICByZXR1cm4gdGhpc1xuICAgIGVsc2UgaWYgQHBhcmVudD9cbiAgICAgIHJldHVybiBAcGFyZW50LmdldFJvb3QoKVxuICAgIGVsc2UgaWYgQGluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpXG4gIHJlbW92ZUNhcnJldDogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsQGNhcnJldENoYXIpXG4gIGdldENhcnJldFBvczogKHR4dCkgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldENhcnJldFBvcyh0eHQsQGNhcnJldENoYXIpXG4gIHJlZ01hcmtlcjogKGZsYWdzPVwiZ1wiKSAtPiAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBmbGFncz1cImdcIiBmbGFncz0wIFxuICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQG1hcmtlciksIGZsYWdzKVxuICByZW1vdmVNYXJrZXJzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKEByZWdNYXJrZXIoKSwnJykgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgQHJlZ01hcmtlcigpIHNlbGYubWFya2VyIFxuXG4gIEBpbml0OiAtPlxuICAgIHVubGVzcyBAaW5pdGVkXG4gICAgICBAaW5pdGVkID0gdHJ1ZVxuICAgICAgQ29tbWFuZC5pbml0Q21kcygpXG4gICAgICBDb21tYW5kLmxvYWRDbWRzKClcblxuICBAaW5pdGVkOiBmYWxzZSIsIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBTdG9yYWdlIH0gZnJvbSAnLi9TdG9yYWdlJztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5cbl9vcHRLZXkgPSAoa2V5LGRpY3QsZGVmVmFsID0gbnVsbCkgLT5cbiAgIyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICByZXR1cm4gaWYga2V5IG9mIGRpY3QgdGhlbiBkaWN0W2tleV0gZWxzZSBkZWZWYWxcblxuXG5leHBvcnQgY2xhc3MgQ29tbWFuZFxuICBjb25zdHJ1Y3RvcjogKEBuYW1lLEBkYXRhPW51bGwsQHBhcmVudD1udWxsKSAtPlxuICAgIEBjbWRzID0gW11cbiAgICBAZGV0ZWN0b3JzID0gW11cbiAgICBAZXhlY3V0ZUZ1bmN0ID0gQHJlc3VsdEZ1bmN0ID0gQHJlc3VsdFN0ciA9IEBhbGlhc09mID0gQGNscyA9IG51bGxcbiAgICBAYWxpYXNlZCA9IG51bGxcbiAgICBAZnVsbE5hbWUgPSBAbmFtZVxuICAgIEBkZXB0aCA9IDBcbiAgICBbQF9wYXJlbnQsIEBfaW5pdGVkXSA9IFtudWxsLCBmYWxzZV1cbiAgICBAc2V0UGFyZW50KHBhcmVudClcbiAgICBAZGVmYXVsdHMgPSB7fVxuICAgIFxuICAgIEBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgY2hlY2tDYXJyZXQ6IHRydWUsXG4gICAgICBwYXJzZTogZmFsc2UsXG4gICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgYWx0ZXJSZXN1bHQ6IG51bGwsXG4gICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgfVxuICAgIEBvcHRpb25zID0ge31cbiAgICBAZmluYWxPcHRpb25zID0gbnVsbFxuICBwYXJlbnQ6IC0+XG4gICAgcmV0dXJuIEBfcGFyZW50XG4gIHNldFBhcmVudDogKHZhbHVlKSAtPlxuICAgIGlmIEBfcGFyZW50ICE9IHZhbHVlXG4gICAgICBAX3BhcmVudCA9IHZhbHVlXG4gICAgICBAZnVsbE5hbWUgPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQubmFtZT9cbiAgICAgICAgICBAX3BhcmVudC5mdWxsTmFtZSArICc6JyArIEBuYW1lIFxuICAgICAgICBlbHNlIFxuICAgICAgICAgIEBuYW1lXG4gICAgICApXG4gICAgICBAZGVwdGggPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQuZGVwdGg/XG4gICAgICAgIHRoZW4gQF9wYXJlbnQuZGVwdGggKyAxXG4gICAgICAgIGVsc2UgMFxuICAgICAgKVxuICBpbml0OiAtPlxuICAgIGlmICFAX2luaXRlZFxuICAgICAgQF9pbml0ZWQgPSB0cnVlXG4gICAgICBAcGFyc2VEYXRhKEBkYXRhKVxuICAgIHJldHVybiB0aGlzXG4gIHVucmVnaXN0ZXI6IC0+XG4gICAgQF9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpXG4gIGlzRWRpdGFibGU6IC0+XG4gICAgcmV0dXJuIEByZXN1bHRTdHI/IG9yIEBhbGlhc09mP1xuICBpc0V4ZWN1dGFibGU6IC0+XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgZm9yIHAgaW4gWydyZXN1bHRTdHInLCdyZXN1bHRGdW5jdCcsJ2NscycsJ2V4ZWN1dGVGdW5jdCddXG4gICAgICBpZiB0aGlzW3BdP1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICBpc0V4ZWN1dGFibGVXaXRoTmFtZTogKG5hbWUpIC0+XG4gICAgaWYgQGFsaWFzT2Y/XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgYWxpYXNPZiA9IEBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsbmFtZSlcbiAgICAgIGFsaWFzZWQgPSBAX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKGFsaWFzT2YpKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gQGlzRXhlY3V0YWJsZSgpXG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICBmb3IgcCBpbiBbJ3Jlc3VsdFN0cicsJ3Jlc3VsdEZ1bmN0J11cbiAgICAgIGlmIHRoaXNbcF0/XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldERlZmF1bHRzOiAtPlxuICAgIHJlcyA9IHt9XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBkZWZhdWx0cylcbiAgICByZXR1cm4gcmVzXG4gIF9hbGlhc2VkRnJvbUZpbmRlcjogKGZpbmRlcikgLT5cbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2VcbiAgICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAYWxpYXNPZj9cbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICByZXR1cm4gQF9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihAYWxpYXNPZikpXG4gIHNldE9wdGlvbnM6IChkYXRhKSAtPlxuICAgIGZvciBrZXksIHZhbCBvZiBkYXRhXG4gICAgICBpZiBrZXkgb2YgQGRlZmF1bHRPcHRpb25zXG4gICAgICAgIEBvcHRpb25zW2tleV0gPSB2YWxcbiAgX29wdGlvbnNGb3JBbGlhc2VkOiAoYWxpYXNlZCkgLT5cbiAgICBvcHQgPSB7fVxuICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LEBkZWZhdWx0T3B0aW9ucylcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsYWxpYXNlZC5nZXRPcHRpb25zKCkpXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0LEBvcHRpb25zKVxuICBnZXRPcHRpb25zOiAtPlxuICAgIHJldHVybiBAX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gIGhlbHA6IC0+XG4gICAgY21kID0gQGdldENtZCgnaGVscCcpXG4gICAgaWYgY21kP1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkucmVzdWx0U3RyXG4gIHBhcnNlRGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBkYXRhXG4gICAgaWYgdHlwZW9mIGRhdGEgPT0gJ3N0cmluZydcbiAgICAgIEByZXN1bHRTdHIgPSBkYXRhXG4gICAgICBAb3B0aW9uc1sncGFyc2UnXSA9IHRydWVcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZSBpZiBkYXRhPyAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBkYXRhPyBcImlzaW5zdGFuY2UoZGF0YSxkaWN0KVwiXG4gICAgICByZXR1cm4gQHBhcnNlRGljdERhdGEoZGF0YSlcbiAgICByZXR1cm4gZmFsc2VcbiAgcGFyc2VEaWN0RGF0YTogKGRhdGEpIC0+XG4gICAgcmVzID0gX29wdEtleSgncmVzdWx0JyxkYXRhKVxuICAgIGlmIHR5cGVvZiByZXMgPT0gXCJmdW5jdGlvblwiXG4gICAgICBAcmVzdWx0RnVuY3QgPSByZXNcbiAgICBlbHNlIGlmIHJlcz9cbiAgICAgIEByZXN1bHRTdHIgPSByZXNcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJyxkYXRhKVxuICAgIGlmIHR5cGVvZiBleGVjdXRlID09IFwiZnVuY3Rpb25cIlxuICAgICAgQGV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGVcbiAgICBAYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLGRhdGEpXG4gICAgQGNscyA9IF9vcHRLZXkoJ2NscycsZGF0YSlcbiAgICBAZGVmYXVsdHMgPSBfb3B0S2V5KCdkZWZhdWx0cycsZGF0YSxAZGVmYXVsdHMpXG4gICAgXG4gICAgQHNldE9wdGlvbnMoZGF0YSlcbiAgICBcbiAgICBpZiAnaGVscCcgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsZGF0YVsnaGVscCddLHRoaXMpKVxuICAgIGlmICdmYWxsYmFjaycgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLGRhdGFbJ2ZhbGxiYWNrJ10sdGhpcykpXG4gICAgICBcbiAgICBpZiAnY21kcycgb2YgZGF0YVxuICAgICAgQGFkZENtZHMoZGF0YVsnY21kcyddKVxuICAgIHJldHVybiB0cnVlXG4gIGFkZENtZHM6IChjbWRzKSAtPlxuICAgIGZvciBuYW1lLCBkYXRhIG9mIGNtZHNcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQobmFtZSxkYXRhLHRoaXMpKVxuICBhZGRDbWQ6IChjbWQpIC0+XG4gICAgZXhpc3RzID0gQGdldENtZChjbWQubmFtZSlcbiAgICBpZiBleGlzdHM/XG4gICAgICBAcmVtb3ZlQ21kKGV4aXN0cylcbiAgICBjbWQuc2V0UGFyZW50KHRoaXMpXG4gICAgQGNtZHMucHVzaChjbWQpXG4gICAgcmV0dXJuIGNtZFxuICByZW1vdmVDbWQ6IChjbWQpIC0+XG4gICAgaWYgKGkgPSBAY21kcy5pbmRleE9mKGNtZCkpID4gLTFcbiAgICAgIEBjbWRzLnNwbGljZShpLCAxKVxuICAgIHJldHVybiBjbWRcbiAgZ2V0Q21kOiAoZnVsbG5hbWUpIC0+XG4gICAgQGluaXQoKVxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgcmV0dXJuIEBnZXRDbWQoc3BhY2UpLmdldENtZChuYW1lKVxuICAgIGZvciBjbWQgaW4gQGNtZHNcbiAgICAgIGlmIGNtZC5uYW1lID09IG5hbWVcbiAgICAgICAgcmV0dXJuIGNtZFxuICBzZXRDbWREYXRhOiAoZnVsbG5hbWUsZGF0YSkgLT5cbiAgICBAc2V0Q21kKGZ1bGxuYW1lLG5ldyBDb21tYW5kKGZ1bGxuYW1lLnNwbGl0KCc6JykucG9wKCksZGF0YSkpXG4gIHNldENtZDogKGZ1bGxuYW1lLGNtZCkgLT5cbiAgICBbc3BhY2UsbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSlcbiAgICBpZiBzcGFjZT9cbiAgICAgIG5leHQgPSBAZ2V0Q21kKHNwYWNlKVxuICAgICAgdW5sZXNzIG5leHQ/XG4gICAgICAgIG5leHQgPSBAYWRkQ21kKG5ldyBDb21tYW5kKHNwYWNlKSlcbiAgICAgIHJldHVybiBuZXh0LnNldENtZChuYW1lLGNtZClcbiAgICBlbHNlXG4gICAgICBAYWRkQ21kKGNtZClcbiAgICAgIHJldHVybiBjbWRcbiAgYWRkRGV0ZWN0b3I6IChkZXRlY3RvcikgLT5cbiAgICBAZGV0ZWN0b3JzLnB1c2goZGV0ZWN0b3IpXG4gICAgXG4gIEBwcm92aWRlcnMgPSBbXVxuXG4gIEBpbml0Q21kczogLT5cbiAgICBDb21tYW5kLmNtZHMgPSBuZXcgQ29tbWFuZChudWxsLHtcbiAgICAgICdjbWRzJzp7XG4gICAgICAgICdoZWxsbyc6e1xuICAgICAgICAgIGhlbHA6IFwiXCJcIlxuICAgICAgICAgIFwiSGVsbG8sIHdvcmxkIVwiIGlzIHR5cGljYWxseSBvbmUgb2YgdGhlIHNpbXBsZXN0IHByb2dyYW1zIHBvc3NpYmxlIGluXG4gICAgICAgICAgbW9zdCBwcm9ncmFtbWluZyBsYW5ndWFnZXMsIGl0IGlzIGJ5IHRyYWRpdGlvbiBvZnRlbiAoLi4uKSB1c2VkIHRvXG4gICAgICAgICAgdmVyaWZ5IHRoYXQgYSBsYW5ndWFnZSBvciBzeXN0ZW0gaXMgb3BlcmF0aW5nIGNvcnJlY3RseSAtd2lraXBlZGlhXG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgcmVzdWx0OiAnSGVsbG8sIFdvcmxkISdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgZm9yIHByb3ZpZGVyIGluIEBwcm92aWRlcnNcbiAgICAgIHByb3ZpZGVyLnJlZ2lzdGVyKENvbW1hbmQuY21kcylcblxuICBAc2F2ZUNtZDogKGZ1bGxuYW1lLCBkYXRhKSAtPlxuICAgIHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG4gICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsZGF0YSlcbiAgICBzYXZlZENtZHMgPSBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgIHVubGVzcyBzYXZlZENtZHM/XG4gICAgICBzYXZlZENtZHMgPSB7fVxuICAgIHNhdmVkQ21kc1tmdWxsbmFtZV0gPSBkYXRhXG4gICAgc3RvcmFnZS5zYXZlKCdjbWRzJyxzYXZlZENtZHMpXG5cbiAgQGxvYWRDbWRzOiAtPlxuICAgIHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG4gICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICBpZiBzYXZlZENtZHM/IFxuICAgICAgZm9yIGZ1bGxuYW1lLCBkYXRhIG9mIHNhdmVkQ21kc1xuICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSlcblxuICBAcmVzZXRTYXZlZDogLT5cbiAgICBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycse30pXG5cbiAgQG1ha2VWYXJDbWQgPSAobmFtZSxiYXNlPXt9KSAtPiBcbiAgICBiYXNlLmV4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWwgaWYgdmFsP1xuICAgIHJldHVybiBiYXNlXG5cbiAgQG1ha2VCb29sVmFyQ21kID0gKG5hbWUsYmFzZT17fSkgLT4gXG4gICAgYmFzZS5leGVjdXRlID0gKGluc3RhbmNlKSAtPlxuICAgICAgdmFsID0gaWYgKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSk/XG4gICAgICAgIHBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UuY29udGVudFxuICAgICAgICBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgdmFsPyBhbmQgdmFsIGluIFsnMCcsJ2ZhbHNlJywnbm8nXVxuICAgICAgICBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdHJ1ZVxuICAgIHJldHVybiBiYXNlXG4gIFxuXG5leHBvcnQgY2xhc3MgQmFzZUNvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAaW5zdGFuY2UpIC0+XG4gIGluaXQ6IC0+XG4gICAgI1xuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICByZXR1cm4gdGhpc1tcInJlc3VsdFwiXT8gIyBbcGF3YV0gcmVwbGFjZSB0aGlzW1wicmVzdWx0XCJdPyAnaGFzYXR0cihzZWxmLFwicmVzdWx0XCIpJ1xuICBnZXREZWZhdWx0czogLT5cbiAgICByZXR1cm4ge31cbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4ge31cbiAgICAgICIsIlxuaW1wb3J0IHsgQ21kRmluZGVyIH0gZnJvbSAnLi9DbWRGaW5kZXInO1xuaW1wb3J0IHsgQ21kSW5zdGFuY2UgfSBmcm9tICcuL0NtZEluc3RhbmNlJztcbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcblxuZXhwb3J0IGNsYXNzIENvbnRleHRcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUpIC0+XG4gICAgQG5hbWVTcGFjZXMgPSBbXVxuICBcbiAgYWRkTmFtZVNwYWNlOiAobmFtZSkgLT5cbiAgICBpZiBuYW1lIG5vdCBpbiBAbmFtZVNwYWNlcyBcbiAgICAgIEBuYW1lU3BhY2VzLnB1c2gobmFtZSlcbiAgICAgIEBfbmFtZXNwYWNlcyA9IG51bGxcbiAgYWRkTmFtZXNwYWNlczogKHNwYWNlcykgLT5cbiAgICBpZiBzcGFjZXMgXG4gICAgICBpZiB0eXBlb2Ygc3BhY2VzID09ICdzdHJpbmcnXG4gICAgICAgIHNwYWNlcyA9IFtzcGFjZXNdXG4gICAgICBmb3Igc3BhY2UgaW4gc3BhY2VzIFxuICAgICAgICBAYWRkTmFtZVNwYWNlKHNwYWNlKVxuICByZW1vdmVOYW1lU3BhY2U6IChuYW1lKSAtPlxuICAgIEBuYW1lU3BhY2VzID0gQG5hbWVTcGFjZXMuZmlsdGVyIChuKSAtPiBuIGlzbnQgbmFtZVxuXG4gIGdldE5hbWVTcGFjZXM6IC0+XG4gICAgdW5sZXNzIEBfbmFtZXNwYWNlcz9cbiAgICAgIG5wY3MgPSBbJ2NvcmUnXS5jb25jYXQoQG5hbWVTcGFjZXMpXG4gICAgICBpZiBAcGFyZW50P1xuICAgICAgICBucGNzID0gbnBjcy5jb25jYXQoQHBhcmVudC5nZXROYW1lU3BhY2VzKCkpXG4gICAgICBAX25hbWVzcGFjZXMgPSBBcnJheUhlbHBlci51bmlxdWUobnBjcylcbiAgICByZXR1cm4gQF9uYW1lc3BhY2VzXG4gIGdldENtZDogKGNtZE5hbWUsbmFtZVNwYWNlcyA9IFtdKSAtPlxuICAgIGZpbmRlciA9IEBnZXRGaW5kZXIoY21kTmFtZSxuYW1lU3BhY2VzKVxuICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUsbmFtZVNwYWNlcyA9IFtdKSAtPlxuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IG5hbWVTcGFjZXNcbiAgICAgIHVzZURldGVjdG9yczogQGlzUm9vdCgpXG4gICAgICBjb2Rld2F2ZTogQGNvZGV3YXZlXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSlcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD9cbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIGNjLmluZGV4T2YoJyVzJykgPiAtMVxuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJyxzdHIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgd3JhcENvbW1lbnRMZWZ0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLGkpICsgc3RyXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gIHdyYXBDb21tZW50UmlnaHQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkrMilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2NcbiAgY21kSW5zdGFuY2VGb3I6IChjbWQpIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsdGhpcylcbiAgZ2V0Q29tbWVudENoYXI6IC0+XG4gICAgaWYgQGNvbW1lbnRDaGFyP1xuICAgICAgcmV0dXJuIEBjb21tZW50Q2hhclxuICAgIGNtZCA9IEBnZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG4gICAgaWYgY21kP1xuICAgICAgaW5zdCA9IEBjbWRJbnN0YW5jZUZvcihjbWQpXG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnXG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICBAY29tbWVudENoYXIgPSBjaGFyXG4gICAgcmV0dXJuIEBjb21tZW50Q2hhciIsIiMgW3Bhd2EgcHl0aG9uXVxuIyAgIHJlcGxhY2UgL2RhdGEuKFxcdyspLyBkYXRhWyckMSddXG4jICAgcmVwbGFjZSBjb2Rld2F2ZS5lZGl0b3IudGV4dCgpIGNvZGV3YXZlLmVkaXRvci50ZXh0XG5cbmltcG9ydCB7IFBhaXIgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgY2xhc3MgRGV0ZWN0b3JcbiAgY29uc3RydWN0b3I6IChAZGF0YT17fSkgLT5cbiAgZGV0ZWN0OiAoZmluZGVyKSAtPlxuICAgIGlmIEBkZXRlY3RlZChmaW5kZXIpXG4gICAgICByZXR1cm4gQGRhdGEucmVzdWx0IGlmIEBkYXRhLnJlc3VsdD9cbiAgICBlbHNlXG4gICAgICByZXR1cm4gQGRhdGEuZWxzZSBpZiBAZGF0YS5lbHNlP1xuICBkZXRlY3RlZDogKGZpbmRlcikgLT5cbiAgICAjXG5cbmV4cG9ydCBjbGFzcyBMYW5nRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvclxuICBkZXRlY3Q6IChmaW5kZXIpIC0+XG4gICAgaWYgZmluZGVyLmNvZGV3YXZlPyBcbiAgICAgIGxhbmcgPSBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLmdldExhbmcoKVxuICAgICAgaWYgbGFuZz8gXG4gICAgICAgIHJldHVybiBsYW5nLnRvTG93ZXJDYXNlKClcbiAgICAgICAgXG5leHBvcnQgY2xhc3MgUGFpckRldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3JcbiAgZGV0ZWN0ZWQ6IChmaW5kZXIpIC0+XG4gICAgaWYgQGRhdGEub3BlbmVyPyBhbmQgQGRhdGEuY2xvc2VyPyBhbmQgZmluZGVyLmluc3RhbmNlP1xuICAgICAgcGFpciA9IG5ldyBQYWlyKEBkYXRhLm9wZW5lciwgQGRhdGEuY2xvc2VyLCBAZGF0YSlcbiAgICAgIGlmIHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICAgICAgIiwiIyBbcGF3YV1cbiMgICByZXBsYWNlIENvZGV3YXZlLkNvbW1hbmQuc2V0IGNvZGV3YXZlX2NvcmUuY29yZV9jbWRzLnNldFxuXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEVkaXRDbWRQcm9wXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsb3B0aW9ucykgLT5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICd2YXInIDogbnVsbCxcbiAgICAgICdvcHQnIDogbnVsbCxcbiAgICAgICdmdW5jdCcgOiBudWxsLFxuICAgICAgJ2RhdGFOYW1lJyA6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JyA6IGZhbHNlLFxuICAgICAgJ2NhcnJldCcgOiBmYWxzZSxcbiAgICB9XG4gICAgZm9yIGtleSBpbiBbJ3ZhcicsJ29wdCcsJ2Z1bmN0J11cbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIGRlZmF1bHRzWydkYXRhTmFtZSddID0gb3B0aW9uc1trZXldXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICAgIFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKEBuYW1lKVxuICBcbiAgd3JpdGVGb3I6IChwYXJzZXIsb2JqKSAtPlxuICAgIGlmIHBhcnNlci52YXJzW0BuYW1lXT9cbiAgICAgIG9ialtAZGF0YU5hbWVdID0gcGFyc2VyLnZhcnNbQG5hbWVdXG4gIHZhbEZyb21DbWQ6IChjbWQpIC0+XG4gICAgaWYgY21kP1xuICAgICAgaWYgQG9wdD9cbiAgICAgICAgcmV0dXJuIGNtZC5nZXRPcHRpb24oQG9wdClcbiAgICAgIGlmIEBmdW5jdD9cbiAgICAgICAgcmV0dXJuIGNtZFtAZnVuY3RdKClcbiAgICAgIGlmIEB2YXI/XG4gICAgICAgIHJldHVybiBjbWRbQHZhcl1cbiAgc2hvd0ZvckNtZDogKGNtZCkgLT5cbiAgICB2YWwgPSBAdmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIEBzaG93RW1wdHkgb3IgdmFsP1xuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIGlmIEBzaG93Rm9yQ21kKGNtZClcbiAgICAgIFwiXCJcIlxuICAgICAgfn4je0BuYW1lfX5+XG4gICAgICAje0B2YWxGcm9tQ21kKGNtZCkgb3IgXCJcIn0je2lmIEBjYXJyZXQgdGhlbiBcInxcIiBlbHNlIFwiXCJ9XG4gICAgICB+fi8je0BuYW1lfX5+XG4gICAgICBcIlwiXCJcbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnNvdXJjZSBleHRlbmRzIEVkaXRDbWRQcm9wIFxuICB2YWxGcm9tQ21kOiAoY21kKS0+XG4gICAgcmVzID0gc3VwZXIoY21kKVxuICAgIGlmIHJlcz9cbiAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKC9cXHwvZywgJ3x8JykgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgJy9cXHwvZycgXCInfCdcIlxuICAgIHJldHVybiByZXNcbiAgc2V0Q21kOiAoY21kcyktPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKEBuYW1lLHsncHJldmVudFBhcnNlQWxsJyA6IHRydWV9KVxuICBzaG93Rm9yQ21kOiAoY21kKSAtPlxuICAgIHZhbCA9IEB2YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gKEBzaG93RW1wdHkgYW5kICEoY21kPyBhbmQgY21kLmFsaWFzT2Y/KSkgb3IgdmFsP1xuICAgIFxuICAgIFxuY2xhc3MgRWRpdENtZFByb3Auc3RyaW5nIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgZGlzcGxheTogKGNtZCkgLT5cbiAgICBpZiBAdmFsRnJvbUNtZChjbWQpP1xuICAgICAgcmV0dXJuIFwifn4hI3tAbmFtZX0gJyN7QHZhbEZyb21DbWQoY21kKX0je2lmIEBjYXJyZXQgdGhlbiBcInxcIiBlbHNlIFwiXCJ9J35+XCJcbiAgICBcbiAgICBcbmNsYXNzIEVkaXRDbWRQcm9wLnJldkJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBzZXRDbWQ6IChjbWRzKSAtPlxuICAgIGNtZHNbQG5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZChAbmFtZSlcbiAgd3JpdGVGb3I6IChwYXJzZXIsb2JqKSAtPlxuICAgIGlmIHBhcnNlci52YXJzW0BuYW1lXT9cbiAgICAgIG9ialtAZGF0YU5hbWVdID0gIXBhcnNlci52YXJzW0BuYW1lXVxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIHZhbCA9IEB2YWxGcm9tQ21kKGNtZClcbiAgICBpZiB2YWw/IGFuZCAhdmFsXG4gICAgICByZXR1cm4gXCJ+fiEje0BuYW1lfX5+XCJcblxuICAgIFxuY2xhc3MgRWRpdENtZFByb3AuYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIHNldENtZDogKGNtZHMpIC0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKEBuYW1lKVxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIFwifn4hI3tAbmFtZX1+flwiIGlmIEB2YWxGcm9tQ21kKGNtZCkiLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQG5hbWVzcGFjZSA9IG51bGxcbiAgICBAX2xhbmcgPSBudWxsXG4gIGJpbmRlZFRvOiAoY29kZXdhdmUpIC0+XG4gICAgI1xuICB0ZXh0OiAodmFsKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRMZW46IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCA9IG51bGwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBiZWdpblVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBlbmRVbmRvQWN0aW9uOiAtPlxuICAgICNcbiAgZ2V0TGFuZzogLT5cbiAgICByZXR1cm4gQF9sYW5nXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdDogLT5cbiAgICByZXR1cm4gbnVsbFxuICBhbGxvd011bHRpU2VsZWN0aW9uOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBzZXRNdWx0aVNlbDogKHNlbGVjdGlvbnMpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRNdWx0aVNlbDogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGNhbkxpc3RlblRvQ2hhbmdlOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIFxuICBnZXRMaW5lQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQGZpbmRMaW5lU3RhcnQocG9zKSxAZmluZExpbmVFbmQocG9zKSlcbiAgZmluZExpbmVTdGFydDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiXSwgLTEpXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcysxIGVsc2UgMFxuICBmaW5kTGluZUVuZDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiLFwiXFxyXCJdKVxuICAgIHJldHVybiBpZiBwIHRoZW4gcC5wb3MgZWxzZSBAdGV4dExlbigpXG4gIFxuICBmaW5kQW55TmV4dDogKHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgaWYgZGlyZWN0aW9uID4gMFxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LEB0ZXh0TGVuKCkpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKDAsc3RhcnQpXG4gICAgYmVzdFBvcyA9IG51bGxcbiAgICBmb3Igc3RyaSBpbiBzdHJpbmdzXG4gICAgICBwb3MgPSBpZiBkaXJlY3Rpb24gPiAwIHRoZW4gdGV4dC5pbmRleE9mKHN0cmkpIGVsc2UgdGV4dC5sYXN0SW5kZXhPZihzdHJpKVxuICAgICAgaWYgcG9zICE9IC0xXG4gICAgICAgIGlmICFiZXN0UG9zPyBvciBiZXN0UG9zKmRpcmVjdGlvbiA+IHBvcypkaXJlY3Rpb25cbiAgICAgICAgICBiZXN0UG9zID0gcG9zXG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmlcbiAgICBpZiBiZXN0U3RyP1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBiZXN0UG9zICsgc3RhcnQgZWxzZSBiZXN0UG9zKSxiZXN0U3RyKVxuICAgIHJldHVybiBudWxsXG4gIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICBzZWxlY3Rpb25zID0gW11cbiAgICBvZmZzZXQgPSAwXG4gICAgZm9yIHJlcGwgaW4gcmVwbGFjZW1lbnRzXG4gICAgICByZXBsLndpdGhFZGl0b3IodGhpcylcbiAgICAgIHJlcGwuYXBwbHlPZmZzZXQob2Zmc2V0KVxuICAgICAgcmVwbC5hcHBseSgpXG4gICAgICBvZmZzZXQgKz0gcmVwbC5vZmZzZXRBZnRlcih0aGlzKVxuICAgICAgXG4gICAgICBzZWxlY3Rpb25zID0gc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKVxuICAgIEBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMoc2VsZWN0aW9ucylcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnM6IChzZWxlY3Rpb25zKSAtPlxuICAgIGlmIHNlbGVjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgaWYgQGFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgICAgICBAc2V0TXVsdGlTZWwoc2VsZWN0aW9ucylcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldEN1cnNvclBvcyhzZWxlY3Rpb25zWzBdLnN0YXJ0LHNlbGVjdGlvbnNbMF0uZW5kKSIsImV4cG9ydCBjbGFzcyBMb2dnZXJcbiAgbG9nOiAoYXJncy4uLikgLT5cbiAgICBpZiB3aW5kb3cuY29uc29sZSBhbmQgdGhpcy5lbmFibGVkXG4gICAgICBmb3IgbXNnIGluIGFyZ3NcbiAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICBlbmFibGVkOiB0cnVlXG4gIHJ1bnRpbWU6IChmdW5jdCxuYW1lID0gXCJmdW5jdGlvblwiKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGNvbnNvbGUubG9nKFwiI3tuYW1lfSB0b29rICN7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLlwiKVxuICAgIHJlc1xuICBtb25pdG9yRGF0YToge31cbiAgdG9Nb25pdG9yOiAob2JqLG5hbWUscHJlZml4PScnKSAtPlxuICAgIGZ1bmN0ID0gb2JqW25hbWVdXG4gICAgb2JqW25hbWVdID0gLT4gXG4gICAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgICB0aGlzLm1vbml0b3IoKC0+IGZ1bmN0LmFwcGx5KG9iaixhcmdzKSkscHJlZml4K25hbWUpXG4gIG1vbml0b3I6IChmdW5jdCxuYW1lKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGlmIHRoaXMubW9uaXRvckRhdGFbbmFtZV0/XG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLmNvdW50KytcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwrPSB0MSAtIHQwXG4gICAgZWxzZVxuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgY291bnQ6IDFcbiAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgIH1cbiAgICByZXNcbiAgcmVzdW1lOiAtPlxuICAgIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpXG4iLCJleHBvcnQgY2xhc3MgT3B0aW9uT2JqZWN0XG4gIHNldE9wdHM6IChvcHRpb25zLGRlZmF1bHRzKS0+XG4gICAgQGRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICBAc2V0T3B0KGtleSxvcHRpb25zW2tleV0pXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRPcHQoa2V5LHZhbClcbiAgICAgICAgXG4gIHNldE9wdDogKGtleSwgdmFsKS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgdGhpc1trZXldKHZhbClcbiAgICBlbHNlXG4gICAgICB0aGlzW2tleV09IHZhbFxuICAgICAgICBcbiAgZ2V0T3B0OiAoa2V5KS0+XG4gICAgaWYgdGhpc1trZXldPy5jYWxsP1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXNba2V5XVxuICBcbiAgZ2V0T3B0czogLT5cbiAgICBvcHRzID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRzW2tleV0gPSBAZ2V0T3B0KGtleSlcbiAgICByZXR1cm4gb3B0cyIsIiMgW3Bhd2FdXG4jICAgcmVwbGFjZSAncmVwbGFjZSgvXFx0L2cnICdyZXBsYWNlKFwiXFx0XCInXG5cbmltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuL0JveEhlbHBlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBTdHJQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsQHBvcyxAc3RyKSAtPlxuICAgIHN1cGVyKClcbiAgICB1bmxlc3MgQGlzRW1wdHkoKVxuICAgICAgQF9jaGVja0Nsb3NlcigpXG4gICAgICBAb3BlbmluZyA9IEBzdHJcbiAgICAgIEBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICAgIEBfc3BsaXRDb21wb25lbnRzKClcbiAgICAgIEBfZmluZENsb3NpbmcoKVxuICAgICAgQF9jaGVja0Vsb25nYXRlZCgpXG4gIF9jaGVja0Nsb3NlcjogLT5cbiAgICBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICBpZiBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5jbG9zZUNoYXIgYW5kIGYgPSBAX2ZpbmRPcGVuaW5nUG9zKClcbiAgICAgIEBjbG9zaW5nUG9zID0gbmV3IFN0clBvcyhAcG9zLCBAc3RyKVxuICAgICAgQHBvcyA9IGYucG9zXG4gICAgICBAc3RyID0gZi5zdHJcbiAgX2ZpbmRPcGVuaW5nUG9zOiAtPlxuICAgIGNtZE5hbWUgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cikuc3Vic3RyaW5nKEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKVxuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWVcbiAgICBjbG9zaW5nID0gQHN0clxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zLG9wZW5pbmcsY2xvc2luZywtMSlcbiAgICAgIGYuc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcytmLnN0ci5sZW5ndGgpK0Bjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgICAgIHJldHVybiBmXG4gIF9zcGxpdENvbXBvbmVudHM6IC0+XG4gICAgcGFydHMgPSBAbm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICBAY21kTmFtZSA9IHBhcnRzLnNoaWZ0KClcbiAgICBAcmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIilcbiAgX3BhcnNlUGFyYW1zOihwYXJhbXMpIC0+XG4gICAgQHBhcmFtcyA9IFtdXG4gICAgQG5hbWVkID0gQGdldERlZmF1bHRzKClcbiAgICBpZiBAY21kP1xuICAgICAgbmFtZVRvUGFyYW0gPSBAZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpXG4gICAgICBpZiBuYW1lVG9QYXJhbT8gXG4gICAgICAgIEBuYW1lZFtuYW1lVG9QYXJhbV0gPSBAY21kTmFtZVxuICAgIGlmIHBhcmFtcy5sZW5ndGhcbiAgICAgIGlmIEBjbWQ/XG4gICAgICAgIGFsbG93ZWROYW1lZCA9IEBnZXRPcHRpb24oJ2FsbG93ZWROYW1lZCcpIFxuICAgICAgaW5TdHIgPSBmYWxzZVxuICAgICAgcGFyYW0gPSAnJ1xuICAgICAgbmFtZSA9IGZhbHNlXG4gICAgICBmb3IgaSBpbiBbMC4uKHBhcmFtcy5sZW5ndGgtMSldXG4gICAgICAgIGNociA9IHBhcmFtc1tpXVxuICAgICAgICBpZiBjaHIgPT0gJyAnIGFuZCAhaW5TdHJcbiAgICAgICAgICBpZihuYW1lKVxuICAgICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGFyYW1zLnB1c2gocGFyYW0pXG4gICAgICAgICAgcGFyYW0gPSAnJ1xuICAgICAgICAgIG5hbWUgPSBmYWxzZVxuICAgICAgICBlbHNlIGlmIGNociBpbiBbJ1wiJyxcIidcIl0gYW5kIChpID09IDAgb3IgcGFyYW1zW2ktMV0gIT0gJ1xcXFwnKVxuICAgICAgICAgIGluU3RyID0gIWluU3RyXG4gICAgICAgIGVsc2UgaWYgY2hyID09ICc6JyBhbmQgIW5hbWUgYW5kICFpblN0ciBhbmQgKCFhbGxvd2VkTmFtZWQ/IG9yIG5hbWUgaW4gYWxsb3dlZE5hbWVkKVxuICAgICAgICAgIG5hbWUgPSBwYXJhbVxuICAgICAgICAgIHBhcmFtID0gJydcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBhcmFtICs9IGNoclxuICAgICAgaWYgcGFyYW0ubGVuZ3RoXG4gICAgICAgIGlmKG5hbWUpXG4gICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBwYXJhbXMucHVzaChwYXJhbSlcbiAgX2ZpbmRDbG9zaW5nOiAtPlxuICAgIGlmIGYgPSBAX2ZpbmRDbG9zaW5nUG9zKClcbiAgICAgIEBjb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUoQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MrQHN0ci5sZW5ndGgsZi5wb3MpKVxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGYucG9zK2Yuc3RyLmxlbmd0aClcbiAgX2ZpbmRDbG9zaW5nUG9zOiAtPlxuICAgIHJldHVybiBAY2xvc2luZ1BvcyBpZiBAY2xvc2luZ1Bvcz9cbiAgICBjbG9zaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZE5hbWUgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjbWROYW1lXG4gICAgaWYgZiA9IEBjb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKEBwb3MrQHN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpXG4gICAgICByZXR1cm4gQGNsb3NpbmdQb3MgPSBmXG4gIF9jaGVja0Vsb25nYXRlZDogLT5cbiAgICBlbmRQb3MgPSBAZ2V0RW5kUG9zKClcbiAgICBtYXggPSBAY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKVxuICAgIHdoaWxlIGVuZFBvcyA8IG1heCBhbmQgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyxlbmRQb3MrQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PSBAY29kZXdhdmUuZGVjb1xuICAgICAgZW5kUG9zKz1AY29kZXdhdmUuZGVjby5sZW5ndGhcbiAgICBpZiBlbmRQb3MgPj0gbWF4IG9yIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIEBjb2Rld2F2ZS5kZWNvLmxlbmd0aCkgaW4gWycgJyxcIlxcblwiLFwiXFxyXCJdXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICBfY2hlY2tCb3g6IC0+XG4gICAgaWYgQGNvZGV3YXZlLmluSW5zdGFuY2U/IGFuZCBAY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PSAnY29tbWVudCdcbiAgICAgIHJldHVyblxuICAgIGNsID0gQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KClcbiAgICBjciA9IEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKVxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKSArIGNyLmxlbmd0aFxuICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zIC0gY2wubGVuZ3RoLEBwb3MpID09IGNsIGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLGVuZFBvcykgPT0gY3JcbiAgICAgIEBwb3MgPSBAcG9zIC0gY2wubGVuZ3RoXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICAgICAgQF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICAgIGVsc2UgaWYgQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgYW5kIEBnZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xXG4gICAgICBAaW5Cb3ggPSAxXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQ6IC0+XG4gICAgaWYgQGNvbnRlbnRcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29kZXdhdmUuZGVjbylcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86I3tlZH0pKyN7ZWNyfSRcIiwgXCJnbVwiKSAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAnXCJnbVwiJyByZS5NXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXHI/XFxuXCIpXG4gICAgICByZTMgPSBuZXcgUmVnRXhwKFwiXFxuXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzKiRcIilcbiAgICAgIEBjb250ZW50ID0gQGNvbnRlbnQucmVwbGFjZShyZTEsJyQxJykucmVwbGFjZShyZTIsJycpLnJlcGxhY2UocmUzLCcnKVxuICBfZ2V0UGFyZW50Q21kczogLT5cbiAgICBAcGFyZW50ID0gQGNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZChAZ2V0RW5kUG9zKCkpPy5pbml0KClcbiAgc2V0TXVsdGlQb3M6IChtdWx0aVBvcykgLT5cbiAgICBAbXVsdGlQb3MgPSBtdWx0aVBvc1xuICBfZ2V0Q21kT2JqOiAtPlxuICAgIEBnZXRDbWQoKVxuICAgIEBfY2hlY2tCb3goKVxuICAgIEBjb250ZW50ID0gQHJlbW92ZUluZGVudEZyb21Db250ZW50KEBjb250ZW50KVxuICAgIHN1cGVyKClcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQF9wYXJzZVBhcmFtcyhAcmF3UGFyYW1zKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHJldHVybiBAY29udGV4dCBvciBAY29kZXdhdmUuY29udGV4dFxuICBnZXRDbWQ6IC0+XG4gICAgdW5sZXNzIEBjbWQ/XG4gICAgICBAX2dldFBhcmVudENtZHMoKVxuICAgICAgaWYgQG5vQnJhY2tldC5zdWJzdHJpbmcoMCxAY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyXG4gICAgICAgIEBjbWQgPSBDb21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKVxuICAgICAgICBAY29udGV4dCA9IEBjb2Rld2F2ZS5jb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIEBmaW5kZXIgPSBAZ2V0RmluZGVyKEBjbWROYW1lKVxuICAgICAgICBAY29udGV4dCA9IEBmaW5kZXIuY29udGV4dFxuICAgICAgICBAY21kID0gQGZpbmRlci5maW5kKClcbiAgICAgICAgaWYgQGNtZD9cbiAgICAgICAgICBAY29udGV4dC5hZGROYW1lU3BhY2UoQGNtZC5mdWxsTmFtZSlcbiAgICByZXR1cm4gQGNtZFxuICBnZXRGaW5kZXI6IChjbWROYW1lKS0+XG4gICAgZmluZGVyID0gQGNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsQF9nZXRQYXJlbnROYW1lc3BhY2VzKCkpXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgX2dldFBhcmVudE5hbWVzcGFjZXM6IC0+XG4gICAgbnNwY3MgPSBbXVxuICAgIG9iaiA9IHRoaXNcbiAgICB3aGlsZSBvYmoucGFyZW50P1xuICAgICAgb2JqID0gb2JqLnBhcmVudFxuICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKSBpZiBvYmouY21kPyBhbmQgb2JqLmNtZC5mdWxsTmFtZT9cbiAgICByZXR1cm4gbnNwY3NcbiAgX3JlbW92ZUJyYWNrZXQ6IChzdHIpLT5cbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyhAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgsc3RyLmxlbmd0aC1AY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQoQGNtZE5hbWUpXG4gICAgcmV0dXJuIGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJyxjbWROYW1lKVxuICBpc0VtcHR5OiAtPlxuICAgIHJldHVybiBAc3RyID09IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjb2Rld2F2ZS5icmFrZXRzIG9yIEBzdHIgPT0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuYnJha2V0c1xuICBleGVjdXRlOiAtPlxuICAgIGlmIEBpc0VtcHR5KClcbiAgICAgIGlmIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXA/IGFuZCBAY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKEBwb3MgKyBAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpP1xuICAgICAgICBAY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpXG4gICAgICBlbHNlXG4gICAgICAgIEByZXBsYWNlV2l0aCgnJylcbiAgICBlbHNlIGlmIEBjbWQ/XG4gICAgICBpZiBiZWZvcmVGdW5jdCA9IEBnZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKVxuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKVxuICAgICAgaWYgQHJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgICAgaWYgKHJlcyA9IEByZXN1bHQoKSk/XG4gICAgICAgICAgQHJlcGxhY2VXaXRoKHJlcylcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBAcnVuRXhlY3V0ZUZ1bmN0KClcbiAgZ2V0RW5kUG9zOiAtPlxuICAgIHJldHVybiBAcG9zK0BzdHIubGVuZ3RoXG4gIGdldFBvczogLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAcG9zLEBwb3MrQHN0ci5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0T3BlbmluZ1BvczogLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAcG9zLEBwb3MrQG9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gIGdldEluZGVudDogLT5cbiAgICB1bmxlc3MgQGluZGVudExlbj9cbiAgICAgIGlmIEBpbkJveD9cbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcihAY29udGV4dClcbiAgICAgICAgQGluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KEBnZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKSkubGVuZ3RoXG4gICAgICBlbHNlXG4gICAgICAgIEBpbmRlbnRMZW4gPSBAcG9zIC0gQGdldFBvcygpLnByZXZFT0woKVxuICAgIHJldHVybiBAaW5kZW50TGVuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50OiAodGV4dCkgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycrQGdldEluZGVudCgpKyd9JywnZ20nKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsJycpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYWx0ZXJSZXN1bHRGb3JCb3g6IChyZXBsKSAtPlxuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KClcbiAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLGZhbHNlKVxuICAgIGlmIEBnZXRPcHRpb24oJ3JlcGxhY2VCb3gnKVxuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbClcbiAgICAgIFtyZXBsLnN0YXJ0LCByZXBsLmVuZF0gPSBbYm94LnN0YXJ0LCBib3guZW5kXVxuICAgICAgQGluZGVudExlbiA9IGhlbHBlci5pbmRlbnRcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKClcbiAgICAgIHJlcGwuZW5kID0gb3JpZ2luYWwubmV4dEVPTCgpXG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIEBjb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyBAY29kZXdhdmUubWFya2VyICsgb3JpZ2luYWwuc2FtZUxpbmVzU3VmZml4KCksIHttdWx0aWxpbmU6ZmFsc2V9KVxuICAgICAgW3JlcGwucHJlZml4LHJlcGwudGV4dCxyZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQoQGNvZGV3YXZlLm1hcmtlcilcbiAgICByZXR1cm4gcmVwbFxuICBnZXRDdXJzb3JGcm9tUmVzdWx0OiAocmVwbCkgLT5cbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpXG4gICAgaWYgQGNtZD8gYW5kIEBjb2Rld2F2ZS5jaGVja0NhcnJldCBhbmQgQGdldE9wdGlvbignY2hlY2tDYXJyZXQnKVxuICAgICAgaWYgKHAgPSBAY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpPyBcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCtyZXBsLnByZWZpeC5sZW5ndGgrcFxuICAgICAgcmVwbC50ZXh0ID0gQGNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpXG4gICAgcmV0dXJuIGN1cnNvclBvc1xuICBjaGVja011bHRpOiAocmVwbCkgLT5cbiAgICBpZiBAbXVsdGlQb3M/IGFuZCBAbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgcmVwbGFjZW1lbnRzID0gW3JlcGxdXG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpXG4gICAgICBmb3IgcG9zLCBpIGluIEBtdWx0aVBvc1xuICAgICAgICBpZiBpID09IDBcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydFxuICAgICAgICBlbHNlXG4gICAgICAgICAgbmV3UmVwbCA9IHJlcGwuY29weSgpLmFwcGx5T2Zmc2V0KHBvcy5zdGFydC1vcmlnaW5hbFBvcylcbiAgICAgICAgICBpZiBuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09IG9yaWdpbmFsVGV4dFxuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbClcbiAgICAgIHJldHVybiByZXBsYWNlbWVudHNcbiAgICBlbHNlXG4gICAgICByZXR1cm4gW3JlcGxdXG4gIHJlcGxhY2VXaXRoOiAodGV4dCkgLT5cbiAgICBAYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoQHBvcyxAZ2V0RW5kUG9zKCksdGV4dCkpXG4gIGFwcGx5UmVwbGFjZW1lbnQ6IChyZXBsKSAtPlxuICAgIHJlcGwud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICAgIGlmIEBpbkJveD9cbiAgICAgIEBhbHRlclJlc3VsdEZvckJveChyZXBsKVxuICAgIGVsc2VcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgY3Vyc29yUG9zID0gQGdldEN1cnNvckZyb21SZXN1bHQocmVwbClcbiAgICByZXBsLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyhjdXJzb3JQb3MsIGN1cnNvclBvcyldXG4gICAgcmVwbGFjZW1lbnRzID0gQGNoZWNrTXVsdGkocmVwbClcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgICBcbiAgICBAcmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydFxuICAgIEByZXBsYWNlRW5kID0gcmVwbC5yZXNFbmQoKSIsImV4cG9ydCBjbGFzcyBQcm9jZXNzXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICMiLCJcbmV4cG9ydCBjbGFzcyBTdG9yYWdlXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShAZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKVxuICBsb2FkOiAoa2V5KSAtPlxuICAgIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oQGZ1bGxLZXkoa2V5KSkpXG4gIGZ1bGxLZXk6IChrZXkpIC0+XG4gICAgJ0NvZGVXYXZlXycra2V5IiwiaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBEb21LZXlMaXN0ZW5lclxuICBzdGFydExpc3RlbmluZzogKHRhcmdldCkgLT5cbiAgXG4gICAgdGltZW91dCA9IG51bGxcbiAgICBcbiAgICBvbmtleWRvd24gPSAoZSkgPT4gXG4gICAgICBpZiAoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgb3IgQG9iaiA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSBhbmQgZS5rZXlDb2RlID09IDY5ICYmIGUuY3RybEtleVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgQG9uQWN0aXZhdGlvbktleT9cbiAgICAgICAgICBAb25BY3RpdmF0aW9uS2V5KClcbiAgICBvbmtleXVwID0gKGUpID0+IFxuICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICBAb25BbnlDaGFuZ2UoZSlcbiAgICBvbmtleXByZXNzID0gKGUpID0+IFxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpIGlmIHRpbWVvdXQ/XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCAoPT5cbiAgICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgICAgKSwgMTAwXG4gICAgICAgICAgICBcbiAgICBpZiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lclxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgb25rZXlwcmVzcylcbiAgICBlbHNlIGlmIHRhcmdldC5hdHRhY2hFdmVudFxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcylcblxuaXNFbGVtZW50ID0gKG9iaikgLT5cbiAgdHJ5XG4gICAgIyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICBjYXRjaCBlXG4gICAgIyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgIyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgIyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG4gICAgcmV0dXJuICh0eXBlb2Ygb2JqPT1cIm9iamVjdFwiKSAmJlxuICAgICAgKG9iai5ub2RlVHlwZT09MSkgJiYgKHR5cGVvZiBvYmouc3R5bGUgPT0gXCJvYmplY3RcIikgJiZcbiAgICAgICh0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT1cIm9iamVjdFwiKVxuXG4gICAgICAgIFxuZXhwb3J0IGNsYXNzIFRleHRBcmVhRWRpdG9yIGV4dGVuZHMgVGV4dFBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEB0YXJnZXQpIC0+XG4gICAgc3VwZXIoKVxuICAgIEBvYmogPSBpZiBpc0VsZW1lbnQoQHRhcmdldCkgdGhlbiBAdGFyZ2V0IGVsc2UgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQHRhcmdldClcbiAgICB1bmxlc3MgQG9iaj9cbiAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCJcbiAgICBAbmFtZXNwYWNlID0gJ3RleHRhcmVhJ1xuICAgIEBjaGFuZ2VMaXN0ZW5lcnMgPSBbXVxuICAgIEBfc2tpcENoYW5nZUV2ZW50ID0gMFxuICBzdGFydExpc3RlbmluZzogRG9tS2V5TGlzdGVuZXIucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nXG4gIG9uQW55Q2hhbmdlOiAoZSkgLT5cbiAgICBpZiBAX3NraXBDaGFuZ2VFdmVudCA8PSAwXG4gICAgICBmb3IgY2FsbGJhY2sgaW4gQGNoYW5nZUxpc3RlbmVyc1xuICAgICAgICBjYWxsYmFjaygpXG4gICAgZWxzZVxuICAgICAgQF9za2lwQ2hhbmdlRXZlbnQtLVxuICAgICAgQG9uU2tpcGVkQ2hhbmdlKCkgaWYgQG9uU2tpcGVkQ2hhbmdlP1xuICBza2lwQ2hhbmdlRXZlbnQ6IChuYiA9IDEpIC0+XG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgKz0gbmJcbiAgYmluZGVkVG86IChjb2Rld2F2ZSkgLT5cbiAgICBAb25BY3RpdmF0aW9uS2V5ID0gLT4gY29kZXdhdmUub25BY3RpdmF0aW9uS2V5KClcbiAgICBAc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpXG4gIHNlbGVjdGlvblByb3BFeGlzdHM6IC0+XG4gICAgXCJzZWxlY3Rpb25TdGFydFwiIG9mIEBvYmpcbiAgaGFzRm9jdXM6IC0+IFxuICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaXMgQG9ialxuICB0ZXh0OiAodmFsKSAtPlxuICAgIGlmIHZhbD9cbiAgICAgIHVubGVzcyBAdGV4dEV2ZW50Q2hhbmdlKHZhbClcbiAgICAgICAgQG9iai52YWx1ZSA9IHZhbFxuICAgIEBvYmoudmFsdWVcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCwgZW5kKSBvciBAc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSBvciBzdXBlcihzdGFydCwgZW5kLCB0ZXh0KVxuICB0ZXh0RXZlbnRDaGFuZ2U6ICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIC0+XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50JykgaWYgZG9jdW1lbnQuY3JlYXRlRXZlbnQ/XG4gICAgaWYgZXZlbnQ/IGFuZCBldmVudC5pbml0VGV4dEV2ZW50PyBhbmQgZXZlbnQuaXNUcnVzdGVkICE9IGZhbHNlXG4gICAgICBlbmQgPSBAdGV4dExlbigpIHVubGVzcyBlbmQ/XG4gICAgICBpZiB0ZXh0Lmxlbmd0aCA8IDFcbiAgICAgICAgaWYgc3RhcnQgIT0gMFxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihzdGFydC0xLHN0YXJ0KVxuICAgICAgICAgIHN0YXJ0LS1cbiAgICAgICAgZWxzZSBpZiBlbmQgIT0gQHRleHRMZW4oKVxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihlbmQsZW5kKzEpXG4gICAgICAgICAgZW5kKytcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSlcbiAgICAgICMgQHNldEN1cnNvclBvcyhzdGFydCxlbmQpXG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBAb2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgICBAc2tpcENoYW5nZUV2ZW50KClcbiAgICAgIHRydWVcbiAgICBlbHNlIFxuICAgICAgZmFsc2VcbiAgc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZDogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBpZiBkb2N1bWVudC5leGVjQ29tbWFuZD9cbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpO1xuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuXG4gIGdldEN1cnNvclBvczogLT5cbiAgICByZXR1cm4gQHRtcEN1cnNvclBvcyBpZiBAdG1wQ3Vyc29yUG9zP1xuICAgIGlmIEBoYXNGb2N1c1xuICAgICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgICAgbmV3IFBvcyhAb2JqLnNlbGVjdGlvblN0YXJ0LEBvYmouc2VsZWN0aW9uRW5kKVxuICAgICAgZWxzZVxuICAgICAgICBAZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKVxuICBnZXRDdXJzb3JQb3NGYWxsYmFjazogLT5cbiAgICBpZiBAb2JqLmNyZWF0ZVRleHRSYW5nZVxuICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKClcbiAgICAgIGlmIHNlbC5wYXJlbnRFbGVtZW50KCkgaXMgQG9ialxuICAgICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayBzZWwuZ2V0Qm9va21hcmsoKVxuICAgICAgICBsZW4gPSAwXG5cbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgbGVuKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcm5nLnNldEVuZFBvaW50IFwiU3RhcnRUb1N0YXJ0XCIsIEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcG9zID0gbmV3IFBvcygwLGxlbilcbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgcG9zLnN0YXJ0KytcbiAgICAgICAgICBwb3MuZW5kKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcmV0dXJuIHBvc1xuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kKSAtPlxuICAgIGVuZCA9IHN0YXJ0IGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgIEB0bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIHNldFRpbWVvdXQgKD0+XG4gICAgICAgIEB0bXBDdXJzb3JQb3MgPSBudWxsXG4gICAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgKSwgMVxuICAgIGVsc2UgXG4gICAgICBAc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZClcbiAgICByZXR1cm5cbiAgc2V0Q3Vyc29yUG9zRmFsbGJhY2s6IChzdGFydCwgZW5kKSAtPlxuICAgIGlmIEBvYmouY3JlYXRlVGV4dFJhbmdlXG4gICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICBybmcubW92ZVN0YXJ0IFwiY2hhcmFjdGVyXCIsIHN0YXJ0XG4gICAgICBybmcuY29sbGFwc2UoKVxuICAgICAgcm5nLm1vdmVFbmQgXCJjaGFyYWN0ZXJcIiwgZW5kIC0gc3RhcnRcbiAgICAgIHJuZy5zZWxlY3QoKVxuICBnZXRMYW5nOiAtPlxuICAgIHJldHVybiBAX2xhbmcgaWYgQF9sYW5nXG4gICAgQG9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpIGlmIEBvYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKVxuICBzZXRMYW5nOiAodmFsKSAtPlxuICAgIEBfbGFuZyA9IHZhbFxuICAgIEBvYmouc2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnLHZhbClcbiAgY2FuTGlzdGVuVG9DaGFuZ2U6IC0+XG4gICAgcmV0dXJuIHRydWVcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBAY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgaWYgKGkgPSBAY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xXG4gICAgICBAY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpLCAxKVxuICAgICAgXG4gICAgICBcbiAgYXBwbHlSZXBsYWNlbWVudHM6IChyZXBsYWNlbWVudHMpIC0+XG4gICAgaWYgcmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgYW5kIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDFcbiAgICAgIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zID0gW0BnZXRDdXJzb3JQb3MoKV1cbiAgICBzdXBlcihyZXBsYWNlbWVudHMpO1xuICAgICAgIiwiIyBbcGF3YSBweXRob25dXG4jICAgcmVwbGFjZSAoRWRpdG9yKSAoZWRpdG9yLkVkaXRvcilcbiMgICByZXBsYWNlIEB0ZXh0KCkgIHNlbGYudGV4dFxuXG5pbXBvcnQgeyBFZGl0b3IgfSBmcm9tICcuL0VkaXRvcic7XG5cbmV4cG9ydCBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yXG4gIGNvbnN0cnVjdG9yOiAoQF90ZXh0KSAtPlxuICAgIHN1cGVyKClcbiAgICBzZWxmLm5hbWVzcGFjZSA9ICd0ZXh0X3BhcnNlcidcbiAgdGV4dDogKHZhbCkgLT5cbiAgICBAX3RleHQgPSB2YWwgaWYgdmFsP1xuICAgIEBfdGV4dFxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHJldHVybiBAdGV4dCgpW3Bvc11cbiAgdGV4dExlbjogKHBvcykgLT5cbiAgICByZXR1cm4gQHRleHQoKS5sZW5ndGhcbiAgdGV4dFN1YnN0cjogKHN0YXJ0LCBlbmQpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICBAdGV4dChAdGV4dCgpLnN1YnN0cmluZygwLCBwb3MpK3RleHQrQHRleHQoKS5zdWJzdHJpbmcocG9zLEB0ZXh0KCkubGVuZ3RoKSlcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHQoQHRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIEB0ZXh0KCkuc2xpY2UoZW5kKSlcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdGFyZ2V0XG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBAdGFyZ2V0ID0gKFxuICAgICAgICBzdGFydDogc3RhcnRcbiAgICAgICAgZW5kOiBlbmRcbiAgICAgICkiLCJpbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vQ29kZXdhdmUnO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBDb3JlQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgSnNDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvSnNDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgUGhwQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL1BocENvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5pbXBvcnQgeyBXcmFwcGVkUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9XcmFwcGVkUG9zJztcblxuUG9zLndyYXBDbGFzcyA9IFdyYXBwZWRQb3NcblxuQ29kZXdhdmUuaW5zdGFuY2VzID0gW11cblxuQ29tbWFuZC5wcm92aWRlcnMgPSBbXG4gIG5ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IEpzQ29tbWFuZFByb3ZpZGVyKClcbiAgbmV3IFBocENvbW1hbmRQcm92aWRlcigpXG5dXG5cbmV4cG9ydCB7IENvZGV3YXZlIH0iLCJcbmltcG9ydCB7IENvbW1hbmQsIEJhc2VDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMYW5nRGV0ZWN0b3IgfSBmcm9tICcuLi9EZXRlY3Rvcic7XG5pbXBvcnQgeyBCb3hIZWxwZXIgfSBmcm9tICcuLi9Cb3hIZWxwZXInO1xuaW1wb3J0IHsgU3RvcmFnZSB9IGZyb20gJy4uL1N0b3JhZ2UnO1xuaW1wb3J0IHsgRWRpdENtZFByb3AgfSBmcm9tICcuLi9FZGl0Q21kUHJvcCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKVxuICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSlcbiAgXG4gIGNvcmUuYWRkQ21kcyh7XG4gICAgJ2hlbHAnOntcbiAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICB+fmJveH5+XG4gICAgICAgIH5+cXVvdGVfY2FycmV0fn5cbiAgICAgICAgICBfX18gICAgICAgICBfICAgX18gICAgICBfX1xuICAgICAgICAgLyBfX3xfX18gIF9ffCB8X19cXFxcIFxcXFwgICAgLyAvXyBfX18gX19fX19fXG4gICAgICAgIC8gL19fLyBfIFxcXFwvIF9gIC8gLV9cXFxcIFxcXFwvXFxcXC8gLyBfYCBcXFxcIFYgLyAtXy9cbiAgICAgICAgXFxcXF9fX19cXFxcX19fL1xcXFxfXyxfXFxcXF9fX3xcXFxcXy9cXFxcXy9cXFxcX18sX3xcXFxcXy9cXFxcX19ffFxuICAgICAgICBUaGUgdGV4dCBlZGl0b3IgaGVscGVyXG4gICAgICAgIH5+L3F1b3RlX2NhcnJldH5+XG4gICAgICAgIFxuICAgICAgICBXaGVuIHVzaW5nIENvZGV3YXZlIHlvdSB3aWxsIGJlIHdyaXRpbmcgY29tbWFuZHMgd2l0aGluIFxuICAgICAgICB5b3VyIHRleHQgZWRpdG9yLiBUaGVzZSBjb21tYW5kcyBtdXN0IGJlIHBsYWNlZCBiZXR3ZWVuIHR3byBcbiAgICAgICAgcGFpcnMgb2YgXCJ+XCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXG4gICAgICAgIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiwgd2l0aCB5b3VyIGN1cnNvciBpbnNpZGUgdGhlIGNvbW1hbmRcbiAgICAgICAgRXg6IH5+IWhlbGxvfn5cbiAgICAgICAgXG4gICAgICAgIFlvdSBkb250IG5lZWQgdG8gYWN0dWFsbHkgdHlwZSBhbnkgXCJ+XCIgKHRpbGRlKS4gXG4gICAgICAgIFByZXNzaW5nIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiB3aWxsIGFkZCB0aGVtIGlmIHlvdSBhcmUgbm90IGFscmVhZHlcbiAgICAgICAgd2l0aGluIGEgY29tbWFuZC5cbiAgICAgICAgXG4gICAgICAgIENvZGV3YXZlIGRvZXMgbm90IHVzZSBVSSB0byBkaXNwbGF5IGFueSBpbmZvcm1hdGlvbi4gXG4gICAgICAgIEluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxuICAgICAgICBUaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcbiAgICAgICAgaW4gdGhlIGhlbHAgc2VjdGlvbnMuXG4gICAgICAgIFxuICAgICAgICBUbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXG4gICAgICAgIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiB3aXRoIHlvdXIgY3Vyc29yIG9uIHRoZSBsaW5lIGJlbGxvdy5cbiAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgXG4gICAgICAgIFVzZSB0aGUgZm9sbG93aW5nIGNvbW1hbmQgZm9yIGEgd2Fsa3Rocm91Z2ggb2Ygc29tZSBvZiB0aGUgbWFueVxuICAgICAgICBmZWF0dXJlcyBvZiBDb2Rld2F2ZVxuICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cbiAgICAgICAgXG4gICAgICAgIExpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXG4gICAgICAgIH5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxuICAgICAgICBcbiAgICAgICAgfn4hY2xvc2V+flxuICAgICAgICB+fi9ib3h+flxuICAgICAgICBcIlwiXCJcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ3N1YmplY3RzJzp7XG4gICAgICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICAgICAncmVzdWx0JyA6IFwiXCJcIlxuICAgICAgICAgICAgfn5ib3h+flxuICAgICAgICAgICAgfn4haGVscH5+XG4gICAgICAgICAgICB+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxuICAgICAgICAgICAgfn4haGVscDpzdWJqZWN0c35+ICh+fiFoZWxwOnN1Yn5+KVxuICAgICAgICAgICAgfn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnc3ViJzp7XG4gICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpzdWJqZWN0cydcbiAgICAgICAgfVxuICAgICAgICAnZ2V0X3N0YXJ0ZWQnOntcbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICBUaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cbiAgICAgICAgICAgIH5+IWhlbGxvfH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+aGVscDplZGl0aW5nOmludHJvfn5cbiAgICAgICAgICAgIH5+cXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcbiAgICAgICAgICAgIH5+IWhlbHA6ZWRpdGluZ35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxuICAgICAgICAgICAgb2YgSmF2YVNjcmlwdCBhYmJyZXZpYXRpb25zXG4gICAgICAgICAgICB+fiFqczpmfn5cbiAgICAgICAgICAgIH5+IWpzOmlmfn5cbiAgICAgICAgICAgICAgfn4hanM6bG9nfn5cIn5+IWhlbGxvfn5cIn5+IS9qczpsb2d+flxuICAgICAgICAgICAgfn4hL2pzOmlmfn5cbiAgICAgICAgICAgIH5+IS9qczpmfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxuICAgICAgICAgICAgcHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuIEVtbWV0IGFiYnJldmlhdGlvbnMgd2lsbCBiZSBcbiAgICAgICAgICAgIHVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cbiAgICAgICAgICAgIH5+IXVsPmxpfn4gKGlmIHlvdSBhcmUgaW4gYSBodG1sIGRvY2N1bWVudClcbiAgICAgICAgICAgIH5+IWVtbWV0IHVsPmxpfn5cbiAgICAgICAgICAgIH5+IWVtbWV0IG0yIGNzc35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvbW1hbmRzIGFyZSBzdG9yZWQgaW4gbmFtZXNwYWNlcy4gVGhlIHNhbWUgY29tbWFuZCBjYW4gaGF2ZSBcbiAgICAgICAgICAgIGRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxuICAgICAgICAgICAgfn4hanM6ZWFjaH5+XG4gICAgICAgICAgICB+fiFwaHA6b3V0ZXI6ZWFjaH5+XG4gICAgICAgICAgICB+fiFwaHA6aW5uZXI6ZWFjaH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFNvbWUgb2YgdGhlIG5hbWVzcGFjZXMgYXJlIGFjdGl2ZSBkZXBlbmRpbmcgb24gdGhlIGNvbnRleHQuIFRoZVxuICAgICAgICAgICAgZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcbiAgICAgICAgICAgIGFjdGl2ZSBuYW1lc3BhY2UuIFRoZSBmaXJzdCBjb21tYW5kIGNvbW1hbmQgd29ya3MgYmVjYXVzZSB0aGUgXG4gICAgICAgICAgICBjb3JlIG5hbWVzcGFjZSBpcyBhY3RpdmUuXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2V+flxuICAgICAgICAgICAgfn4hY29yZTpuYW1lc3BhY2V+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBZb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxuICAgICAgICAgICAgfn4hbmFtZXNwYWNlIHBocH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2V+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBJbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXG4gICAgICAgICAgICBjb250ZXh0IGZyb20gdGhlIHN1cnJvdW5kaW5nIHRleHQuIEluIGEgUEhQIGZpbGUsIGl0IG1lYW5zIENvZGV3YXZlIFxuICAgICAgICAgICAgd2lsbCBhZGQgdGhlIFBIUCB0YWdzIHdoZW4geW91IG5lZWQgdGhlbS5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ2RlbW8nOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmdldF9zdGFydGVkJ1xuICAgICAgICB9XG4gICAgICAgICdlZGl0aW5nJzp7XG4gICAgICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAgICAgJ2ludHJvJzp7XG4gICAgICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICAgICAgQ29kZXdhdmUgYWxsb3dzIHlvdSB0byBtYWtlIHlvdXIgb3duIGNvbW1hbmRzIChvciBhYmJyZXZpYXRpb25zKSBcbiAgICAgICAgICAgICAgICBwdXQgeW91ciBjb250ZW50IGluc2lkZSBcInNvdXJjZVwiIHRoZSBkbyBcInNhdmVcIi4gVHJ5IGFkZGluZyBhbnkgXG4gICAgICAgICAgICAgICAgdGV4dCB0aGF0IGlzIG9uIHlvdXIgbWluZC5cbiAgICAgICAgICAgICAgICB+fiFlZGl0IG15X25ld19jb21tYW5kfH5+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgSWYgeW91IGRpZCB0aGUgbGFzdCBzdGVwIHJpZ2h0LCB5b3Ugc2hvdWxkIHNlZSB5b3VyIHRleHQgd2hlbiB5b3VcbiAgICAgICAgICAgICAgICBkbyB0aGUgZm9sbG93aW5nIGNvbW1hbmQuIEl0IGlzIG5vdyBzYXZlZCBhbmQgeW91IGNhbiB1c2UgaXQgXG4gICAgICAgICAgICAgICAgd2hlbmV2ZXIgeW91IHdhbnQuXG4gICAgICAgICAgICAgICAgfn4hbXlfbmV3X2NvbW1hbmR+flxuICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICB+fmhlbHA6ZWRpdGluZzppbnRyb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEFsbCB0aGUgd2luZG93cyBvZiBDb2Rld2F2ZSBhcmUgbWFkZSB3aXRoIHRoZSBjb21tYW5kIFwiYm94XCIuIFxuICAgICAgICAgICAgVGhleSBhcmUgbWVhbnQgdG8gZGlzcGxheSB0ZXh0IHRoYXQgc2hvdWxkIG5vdCByZW1haW4gaW4geW91ciBjb2RlLiBcbiAgICAgICAgICAgIFRoZXkgYXJlIHZhbGlkIGNvbW1lbnRzIHNvIHRoZXkgd29uJ3QgYnJlYWsgeW91ciBjb2RlIGFuZCB0aGUgY29tbWFuZCBcbiAgICAgICAgICAgIFwiY2xvc2VcIiBjYW4gYmUgdXNlZCB0byByZW1vdmUgdGhlbSByYXBpZGx5LiBZb3UgY2FuIG1ha2UgeW91ciBvd24gXG4gICAgICAgICAgICBjb21tYW5kcyB3aXRoIHRoZW0gaWYgeW91IG5lZWQgdG8gZGlzcGxheSBzb21lIHRleHQgdGVtcG9yYXJpbHkuXG4gICAgICAgICAgICB+fiFib3h+flxuICAgICAgICAgICAgVGhlIGJveCB3aWxsIHNjYWxlIHdpdGggdGhlIGNvbnRlbnQgeW91IHB1dCBpbiBpdFxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+IS9ib3h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fnF1b3RlX2NhcnJldH5+XG4gICAgICAgICAgICBXaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxuICAgICAgICAgICAgd2lsbCBiZSBsb2NhdGVkIG9uY2UgdGhlIGNvbW1hbmQgaXMgZXhwYW5kZWQuIFRvIGRvIHRoYXQsIHVzZSBhIFwifFwiIFxuICAgICAgICAgICAgKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcbiAgICAgICAgICAgIGNoYXJhY3Rlci5cbiAgICAgICAgICAgIH5+IWJveH5+XG4gICAgICAgICAgICBvbmUgOiB8IFxuICAgICAgICAgICAgdHdvIDogfHxcbiAgICAgICAgICAgIH5+IS9ib3h+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBZb3UgY2FuIGFsc28gdXNlIHRoZSBcImVzY2FwZV9waXBlc1wiIGNvbW1hbmQgdGhhdCB3aWxsIGVzY2FwZSBhbnkgXG4gICAgICAgICAgICB2ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xuICAgICAgICAgICAgfn4hZXNjYXBlX3BpcGVzfn5cbiAgICAgICAgICAgIHxcbiAgICAgICAgICAgIH5+IS9lc2NhcGVfcGlwZXN+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb21tYW5kcyBpbnNpZGUgb3RoZXIgY29tbWFuZHMgd2lsbCBiZSBleHBhbmRlZCBhdXRvbWF0aWNhbGx5LlxuICAgICAgICAgICAgSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxuICAgICAgICAgICAgdGhlIHBhcmVudCBjb21tYW5kIGlzIGV4cGFuZGVkLCB1c2UgYSBcIiFcIiAoZXhjbGFtYXRpb24gbWFyaykuXG4gICAgICAgICAgICB+fiEhaGVsbG9+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBGb3IgY29tbWFuZHMgdGhhdCBoYXZlIGJvdGggYW4gb3BlbmluZyBhbmQgYSBjbG9zaW5nIHRhZywgeW91IGNhbiB1c2VcbiAgICAgICAgICAgIHRoZSBcImNvbnRlbnRcIiBjb21tYW5kLiBcImNvbnRlbnRcIiB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRleHRcbiAgICAgICAgICAgIHRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cbiAgICAgICAgICAgIH5+IWVkaXQgcGhwOmlubmVyOmlmfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIH1cbiAgICAgICAgJ2VkaXQnOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmVkaXRpbmcnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgICdub19leGVjdXRlJzp7XG4gICAgICAncmVzdWx0JyA6IG5vX2V4ZWN1dGVcbiAgICB9LFxuICAgICdlc2NhcGVfcGlwZXMnOntcbiAgICAgICdyZXN1bHQnIDogcXVvdGVfY2FycmV0LFxuICAgICAgJ2NoZWNrQ2FycmV0JyA6IGZhbHNlXG4gICAgfSxcbiAgICAncXVvdGVfY2FycmV0Jzp7XG4gICAgICAnYWxpYXNPZic6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICB9XG4gICAgJ2V4ZWNfcGFyZW50Jzp7XG4gICAgICAnZXhlY3V0ZScgOiBleGVjX3BhcmVudFxuICAgIH0sXG4gICAgJ2NvbnRlbnQnOntcbiAgICAgICdyZXN1bHQnIDogZ2V0Q29udGVudFxuICAgIH0sXG4gICAgJ2JveCc6e1xuICAgICAgJ2NscycgOiBCb3hDbWRcbiAgICB9LFxuICAgICdjbG9zZSc6e1xuICAgICAgJ2NscycgOiBDbG9zZUNtZFxuICAgIH0sXG4gICAgJ3BhcmFtJzp7XG4gICAgICAncmVzdWx0JyA6IGdldFBhcmFtXG4gICAgfSxcbiAgICAnZWRpdCc6e1xuICAgICAgJ2NtZHMnIDogRWRpdENtZC5zZXRDbWRzKHtcbiAgICAgICAgJ3NhdmUnOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmV4ZWNfcGFyZW50J1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgICdjbHMnIDogRWRpdENtZFxuICAgIH0sXG4gICAgJ3JlbmFtZSc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2FwcGxpY2FibGUnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIFlvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiLFxuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogcmVuYW1lQ29tbWFuZCxcbiAgICAgICdwYXJzZScgOiB0cnVlXG4gICAgfSxcbiAgICAncmVtb3ZlJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfYXBwbGljYWJsZScgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCIsXG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiByZW1vdmVDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICB9LFxuICAgICdhbGlhcyc6e1xuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnbm90X2ZvdW5kJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBDb21tYW5kIG5vdCBmb3VuZFxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgIH1cbiAgICAgICdyZXN1bHQnIDogYWxpYXNDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICB9LFxuICAgICduYW1lc3BhY2UnOntcbiAgICAgICdjbHMnIDogTmFtZVNwYWNlQ21kXG4gICAgfSxcbiAgICAnbnNwYyc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6bmFtZXNwYWNlJ1xuICAgIH0sXG4gICAgJ2VtbWV0Jzp7XG4gICAgICAnY2xzJyA6IEVtbWV0Q21kXG4gICAgfSxcbiAgICBcbiAgfSlcbiAgXG5ub19leGVjdXRlID0gKGluc3RhbmNlKSAtPlxuICByZWcgPSBuZXcgUmVnRXhwKFwiXihcIitTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSlcbiAgcmV0dXJuIGluc3RhbmNlLnN0ci5yZXBsYWNlKHJlZywnJDEnKVxuICBcbnF1b3RlX2NhcnJldCA9IChpbnN0YW5jZSkgLT5cbiAgcmV0dXJuIGluc3RhbmNlLmNvbnRlbnQucmVwbGFjZSgvXFx8L2csICd8fCcpICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICcvXFx8L2cnIFwiJ3wnXCJcbmV4ZWNfcGFyZW50ID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5wYXJlbnQ/XG4gICAgcmVzID0gaW5zdGFuY2UucGFyZW50LmV4ZWN1dGUoKVxuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnRcbiAgICBpbnN0YW5jZS5yZXBsYWNlRW5kID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VFbmRcbiAgICByZXR1cm4gcmVzXG5nZXRDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuICBhZmZpeGVzX2VtcHR5ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydhZmZpeGVzX2VtcHR5J10sZmFsc2UpXG4gIHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gIHN1ZmZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sJycpXG4gIGlmIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2U/XG4gICAgcmV0dXJuIHByZWZpeCArIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmNvbnRlbnQgb3IgJycpICsgc3VmZml4XG4gIGlmIGFmZml4ZXNfZW1wdHlcbiAgICByZXR1cm4gcHJlZml4ICsgc3VmZml4XG5yZW5hbWVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICBzYXZlZENtZHMgPSBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICBvcmlnbmluYWxOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ2Zyb20nXSlcbiAgbmV3TmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCd0byddKVxuICBpZiBvcmlnbmluYWxOYW1lPyBhbmQgbmV3TmFtZT9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChvcmlnbmluYWxOYW1lKVxuICAgIGlmIHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXT8gYW5kIGNtZD9cbiAgICAgIHVubGVzcyBuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCcnKSArIG5ld05hbWVcbiAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsY21kRGF0YSlcbiAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgIHNhdmVkQ21kc1tuZXdOYW1lXSA9IGNtZERhdGFcbiAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIGlmIGNtZD8gXG4gICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIlxuICAgIGVsc2UgXG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbnJlbW92ZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwnbmFtZSddKVxuICBpZiBuYW1lP1xuICAgIHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG4gICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuICAgIGlmIHNhdmVkQ21kc1tuYW1lXT8gYW5kIGNtZD9cbiAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbbmFtZV1cbiAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV1cbiAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIGlmIGNtZD8gXG4gICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIlxuICAgIGVsc2UgXG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbmFsaWFzQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIGFsaWFzID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2FsaWFzJ10pXG4gIGlmIG5hbWU/IGFuZCBhbGlhcz9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuICAgIGlmIGNtZD9cbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgb3IgY21kXG4gICAgICAjIHVubGVzcyBhbGlhcy5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgICAjIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7IGFsaWFzT2Y6IGNtZC5mdWxsTmFtZSB9KVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIFxuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG4gICAgICBcbmdldFBhcmFtID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlP1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcyxpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsJ2RlZmF1bHQnXSkpXG4gIFxuY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAaGVscGVyID0gbmV3IEJveEhlbHBlcihAaW5zdGFuY2UuY29udGV4dClcbiAgICBAY21kID0gQGluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pXG4gICAgaWYgQGNtZD9cbiAgICAgIEBoZWxwZXIub3BlblRleHQgID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAY21kICsgQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIEBoZWxwZXIuY2xvc2VUZXh0ID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZC5zcGxpdChcIiBcIilbMF0gKyBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgIEBoZWxwZXIuZGVjbyA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5kZWNvXG4gICAgQGhlbHBlci5wYWQgPSAyXG4gICAgQGhlbHBlci5wcmVmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgICBAaGVscGVyLnN1ZmZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCcnKVxuICAgIFxuICBoZWlnaHQ6IC0+XG4gICAgaWYgQGJvdW5kcygpP1xuICAgICAgaGVpZ2h0ID0gQGJvdW5kcygpLmhlaWdodFxuICAgIGVsc2VcbiAgICAgIGhlaWdodCA9IDNcbiAgICAgIFxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J11cbiAgICBpZiBAaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEgXG4gICAgICBwYXJhbXMucHVzaCgxKVxuICAgIGVsc2UgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAwXG4gICAgICBwYXJhbXMucHVzaCgwKVxuICAgIHJldHVybiBAaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLGhlaWdodClcbiAgICAgIFxuICB3aWR0aDogLT5cbiAgICBpZiBAYm91bmRzKCk/XG4gICAgICB3aWR0aCA9IEBib3VuZHMoKS53aWR0aFxuICAgIGVsc2VcbiAgICAgIHdpZHRoID0gM1xuICAgICAgXG4gICAgcGFyYW1zID0gWyd3aWR0aCddXG4gICAgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxIFxuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICByZXR1cm4gTWF0aC5tYXgoQG1pbldpZHRoKCksIEBpbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSlcblxuICBcbiAgYm91bmRzOiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgQF9ib3VuZHM/XG4gICAgICAgIEBfYm91bmRzID0gQGhlbHBlci50ZXh0Qm91bmRzKEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcmV0dXJuIEBfYm91bmRzXG4gICAgICBcbiAgcmVzdWx0OiAtPlxuICAgIEBoZWxwZXIuaGVpZ2h0ID0gQGhlaWdodCgpXG4gICAgQGhlbHBlci53aWR0aCA9IEB3aWR0aCgpXG4gICAgcmV0dXJuIEBoZWxwZXIuZHJhdyhAaW5zdGFuY2UuY29udGVudClcbiAgbWluV2lkdGg6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJldHVybiBAY21kLmxlbmd0aFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwXG4gIFxuY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBpbnN0YW5jZS5jb250ZXh0KVxuICBleGVjdXRlOiAtPlxuICAgIHByZWZpeCA9IEBoZWxwZXIucHJlZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gICAgc3VmZml4ID0gQGhlbHBlci5zdWZmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgICBib3ggPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3JlcXVpcmVkX2FmZml4ZXMnXSx0cnVlKVxuICAgIGlmICFyZXF1aXJlZF9hZmZpeGVzXG4gICAgICBAaGVscGVyLnByZWZpeCA9IEBoZWxwZXIuc3VmZml4ID0gJydcbiAgICAgIGJveDIgPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgICBpZiBib3gyPyBhbmQgKCFib3g/IG9yIGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIG9yIGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpXG4gICAgICAgIGJveCA9IGJveDJcbiAgICBpZiBib3g/XG4gICAgICBkZXB0aCA9IEBoZWxwZXIuZ2V0TmVzdGVkTHZsKEBpbnN0YW5jZS5nZXRQb3MoKS5zdGFydClcbiAgICAgIGlmIGRlcHRoIDwgMlxuICAgICAgICBAaW5zdGFuY2UuaW5Cb3ggPSBudWxsXG4gICAgICBAaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LGJveC5lbmQsJycpKVxuICAgIGVsc2VcbiAgICAgIEBpbnN0YW5jZS5yZXBsYWNlV2l0aCgnJylcbiAgICAgICAgICBcbmNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBjbWROYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgICBAdmVyYmFsaXplID0gQGluc3RhbmNlLmdldFBhcmFtKFsxXSkgaW4gWyd2JywndmVyYmFsaXplJ11cbiAgICBpZiBAY21kTmFtZT9cbiAgICAgIEBmaW5kZXIgPSBAaW5zdGFuY2UuY29udGV4dC5nZXRGaW5kZXIoQGNtZE5hbWUpIFxuICAgICAgQGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgQGVkaXRhYmxlID0gaWYgQGNtZD8gdGhlbiBAY21kLmlzRWRpdGFibGUoKSBlbHNlIHRydWVcbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4ge1xuICAgICAgYWxsb3dlZE5hbWVkOiBbJ2NtZCddXG4gICAgfVxuICByZXN1bHQ6IC0+XG4gICAgaWYgQGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHJldHVybiBAcmVzdWx0V2l0aENvbnRlbnQoKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAcmVzdWx0V2l0aG91dENvbnRlbnQoKVxuICByZXN1bHRXaXRoQ29udGVudDogLT5cbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIGRhdGEgPSB7fVxuICAgICAgZm9yIHAgaW4gRWRpdENtZC5wcm9wc1xuICAgICAgICBwLndyaXRlRm9yKHBhcnNlcixkYXRhKVxuICAgICAgQ29tbWFuZC5zYXZlQ21kKEBjbWROYW1lLCBkYXRhKVxuICAgICAgcmV0dXJuICcnXG4gIHByb3BzRGlzcGxheTogLT5cbiAgICAgIGNtZCA9IEBjbWRcbiAgICAgIHJldHVybiBFZGl0Q21kLnByb3BzLm1hcCggKHApLT4gcC5kaXNwbGF5KGNtZCkgKS5maWx0ZXIoIChwKS0+IHA/ICkuam9pbihcIlxcblwiKVxuICByZXN1bHRXaXRob3V0Q29udGVudDogLT5cbiAgICBpZiAhQGNtZCBvciBAZWRpdGFibGVcbiAgICAgIG5hbWUgPSBpZiBAY21kIHRoZW4gQGNtZC5mdWxsTmFtZSBlbHNlIEBjbWROYW1lXG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChcbiAgICAgICAgXCJcIlwiXG4gICAgICAgIH5+Ym94IGNtZDpcIiN7QGluc3RhbmNlLmNtZC5mdWxsTmFtZX0gI3tuYW1lfVwifn5cbiAgICAgICAgI3tAcHJvcHNEaXNwbGF5KCl9XG4gICAgICAgIH5+c2F2ZX5+IH5+IWNsb3Nlfn5cbiAgICAgICAgfn4vYm94fn5cbiAgICAgICAgXCJcIlwiKVxuICAgICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gbm9cbiAgICAgIHJldHVybiBpZiBAdmVyYmFsaXplIHRoZW4gcGFyc2VyLmdldFRleHQoKSBlbHNlIHBhcnNlci5wYXJzZUFsbCgpXG5FZGl0Q21kLnNldENtZHMgPSAoYmFzZSkgLT5cbiAgZm9yIHAgaW4gRWRpdENtZC5wcm9wc1xuICAgIHAuc2V0Q21kKGJhc2UpXG4gIHJldHVybiBiYXNlXG5FZGl0Q21kLnByb3BzID0gW1xuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fY2FycmV0JywgICAgICAgICB7b3B0OidjaGVja0NhcnJldCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJywgICAgICAgICAge29wdDoncGFyc2UnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCAgICdwcmV2ZW50X3BhcnNlX2FsbCcsIHtvcHQ6J3ByZXZlbnRQYXJzZUFsbCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woICAgJ3JlcGxhY2VfYm94JywgICAgICAge29wdDoncmVwbGFjZUJveCd9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZyggJ25hbWVfdG9fcGFyYW0nLCAgICAge29wdDonbmFtZVRvUGFyYW0nfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoICdhbGlhc19vZicsICAgICAgICAgIHt2YXI6J2FsaWFzT2YnLCBjYXJyZXQ6dHJ1ZX0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCAnaGVscCcsICAgICAgICAgICAgICB7ZnVuY3Q6J2hlbHAnLCBzaG93RW1wdHk6dHJ1ZX0pLFxuICBuZXcgRWRpdENtZFByb3Auc291cmNlKCAnc291cmNlJywgICAgICAgICAgICB7dmFyOidyZXN1bHRTdHInLCBkYXRhTmFtZToncmVzdWx0Jywgc2hvd0VtcHR5OnRydWUsIGNhcnJldDp0cnVlfSksXG5dXG5jbGFzcyBOYW1lU3BhY2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBuYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswXSlcbiAgcmVzdWx0OiAtPlxuICAgIGlmIEBuYW1lP1xuICAgICAgQGluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0LmFkZE5hbWVTcGFjZShAbmFtZSlcbiAgICAgIHJldHVybiAnJ1xuICAgIGVsc2VcbiAgICAgIG5hbWVzcGFjZXMgPSBAaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKClcbiAgICAgIHR4dCA9ICd+fmJveH5+XFxuJ1xuICAgICAgZm9yIG5zcGMgaW4gbmFtZXNwYWNlcyBcbiAgICAgICAgaWYgbnNwYyAhPSBAaW5zdGFuY2UuY21kLmZ1bGxOYW1lXG4gICAgICAgICAgdHh0ICs9IG5zcGMrJ1xcbidcbiAgICAgIHR4dCArPSAnfn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dClcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKVxuXG5cblxuY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBhYmJyID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCdhYmJyJywnYWJicmV2aWF0aW9uJ10pXG4gICAgQGxhbmcgPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2xhbmcnLCdsYW5ndWFnZSddKVxuICByZXN1bHQ6IC0+XG4gICAgZW1tZXQgPSBpZiB3aW5kb3cuZW1tZXQ/XG4gICAgICB3aW5kb3cuZW1tZXRcbiAgICBlbHNlIGlmIHdpbmRvdy5zZWxmPy5lbW1ldD9cbiAgICAgIHdpbmRvdy5zZWxmLmVtbWV0XG4gICAgZWxzZSBpZiB3aW5kb3cuZ2xvYmFsPy5lbW1ldD9cbiAgICAgIHdpbmRvdy5nbG9iYWwuZW1tZXRcbiAgICBpZiBlbW1ldD9cbiAgICAgICMgZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKEBhYmJyLCBAbGFuZylcbiAgICAgIHJlcy5yZXBsYWNlKC9cXCRcXHswXFx9L2csICd8JylcblxuXG5cbiIsIiMgW3Bhd2EgcHl0aG9uXVxuIyAgIHJlcGxhY2UgQENvZGV3YXZlLkNvbW1hbmQuY21kSW5pdGlhbGlzZXJzIGNvbW1hbmQuY21kSW5pdGlhbGlzZXJzQmFzZUNvbW1hbmRcbiMgICByZXBsYWNlIChCYXNlQ29tbWFuZCAoY29tbWFuZC5CYXNlQ29tbWFuZFxuIyAgIHJlcGxhY2UgRWRpdENtZC5wcm9wcyBlZGl0Q21kUHJvcHNcbiMgICByZXBsYWNlIEVkaXRDbWQuc2V0Q21kcyBlZGl0Q21kU2V0Q21kcyByZXBhcnNlXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBKc0NvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAganMgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnanMnKSlcbiAgY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2phdmFzY3JpcHQnLHsgYWxpYXNPZjogJ2pzJyB9KSlcbiAganMuYWRkQ21kcyh7XG4gICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICdpZic6ICAnaWYofCl7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnbG9nJzogICdpZih3aW5kb3cuY29uc29sZSl7XFxuXFx0Y29uc29sZS5sb2cofn5jb250ZW50fn58KVxcbn0nLFxuICAgICdmdW5jdGlvbic6XHQnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdmdW5jdCc6eyBhbGlhc09mOiAnanM6ZnVuY3Rpb24nIH0sXG4gICAgJ2YnOnsgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbicgfSxcbiAgICAnZm9yJzogXHRcdCdmb3IgKHZhciBpID0gMDsgaSA8IHw7IGkrKykge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2ZvcmluJzonZm9yICh2YXIgdmFsIGluIHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdlYWNoJzp7ICBhbGlhc09mOiAnanM6Zm9yaW4nIH0sXG4gICAgJ2ZvcmVhY2gnOnsgIGFsaWFzT2Y6ICdqczpmb3JpbicgfSxcbiAgICAnd2hpbGUnOiAgJ3doaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICd3aGlsZWknOiAndmFyIGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcblxcdGkrKztcXG59JyxcbiAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+Y29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAnaWZlJzp7ICAgYWxpYXNPZjogJ2pzOmlmZWxzZScgfSxcbiAgICAnc3dpdGNoJzpcdFwiXCJcIlxuICAgICAgc3dpdGNoKCB8ICkgeyBcbiAgICAgIFxcdGNhc2UgOlxuICAgICAgXFx0XFx0fn5jb250ZW50fn5cbiAgICAgIFxcdFxcdGJyZWFrO1xuICAgICAgXFx0ZGVmYXVsdCA6XG4gICAgICBcXHRcXHRcbiAgICAgIFxcdFxcdGJyZWFrO1xuICAgICAgfVxuICAgICAgXCJcIlwiLFxuICB9KVxuIiwiXG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5pbXBvcnQgeyBQYWlyRGV0ZWN0b3IgfSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCBjbGFzcyBQaHBDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIHBocCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdwaHAnKSlcbiAgcGhwLmFkZERldGVjdG9yKG5ldyBQYWlyRGV0ZWN0b3Ioe1xuICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgb3BlbmVyOiAnPD9waHAnLFxuICAgIGNsb3NlcjogJz8+JyxcbiAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICdlbHNlJzogJ3BocDpvdXRlcidcbiAgfSkpIFxuXG4gIHBocE91dGVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnb3V0ZXInKSlcbiAgcGhwT3V0ZXIuYWRkQ21kcyh7XG4gICAgJ2ZhbGxiYWNrJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdhbnlfY29udGVudCc6IHsgXG4gICAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcgXG4gICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbidcbiAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICdcbiAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBhbGlhc09mOiAncGhwOmlubmVyOiVuYW1lJScsXG4gICAgICBhbHRlclJlc3VsdDogd3JhcFdpdGhQaHBcbiAgICB9LFxuICAgICdib3gnOiB7IFxuICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyBcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHByZWZpeDogJzw/cGhwXFxuJ1xuICAgICAgICBzdWZmaXg6ICdcXG4/PidcbiAgICAgIH1cbiAgICB9LFxuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+JyxcbiAgfSlcbiAgXG4gIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSlcbiAgcGhwSW5uZXIuYWRkQ21kcyh7XG4gICAgJ2FueV9jb250ZW50JzogeyBhbGlhc09mOiAnY29yZTpjb250ZW50JyB9LFxuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAnaWYnOiAgICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnaW5mbyc6ICdwaHBpbmZvKCk7JyxcbiAgICAnZWNobyc6ICdlY2hvIHwnLFxuICAgICdlJzp7ICAgYWxpYXNPZjogJ3BocDppbm5lcjplY2hvJyB9LFxuICAgICdjbGFzcyc6e1xuICAgICAgcmVzdWx0IDogXCJcIlwiXG4gICAgICAgIGNsYXNzIH5+cGFyYW0gMCBjbGFzcyBkZWY6fH5+IHtcbiAgICAgICAgXFx0ZnVuY3Rpb24gX19jb25zdHJ1Y3QoKSB7XG4gICAgICAgIFxcdFxcdH5+Y29udGVudH5+fFxuICAgICAgICBcXHR9XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiLFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2MnOnsgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnIH0sXG4gICAgJ2Z1bmN0aW9uJzpcdHtcbiAgICAgIHJlc3VsdCA6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufSdcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdmdW5jdCc6eyBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJyB9LFxuICAgICdmJzp7ICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJyB9LFxuICAgICdhcnJheSc6ICAnJHwgPSBhcnJheSgpOycsXG4gICAgJ2EnOlx0ICAgICdhcnJheSgpJyxcbiAgICAnZm9yJzogXHRcdCdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICdmb3JlYWNoJzonZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ2VhY2gnOnsgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Zm9yZWFjaCcgfSxcbiAgICAnd2hpbGUnOiAgJ3doaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnd2hpbGVpJzoge1xuICAgICAgcmVzdWx0IDogJyRpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxuXFx0JGkrKztcXG59JyxcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAnaWZlJzp7ICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnIH0sXG4gICAgJ3N3aXRjaCc6XHR7XG4gICAgICByZXN1bHQgOiBcIlwiXCJcbiAgICAgICAgc3dpdGNoKCB8ICkgeyBcbiAgICAgICAgXFx0Y2FzZSA6XG4gICAgICAgIFxcdFxcdH5+YW55X2NvbnRlbnR+flxuICAgICAgICBcXHRcXHRicmVhaztcbiAgICAgICAgXFx0ZGVmYXVsdCA6XG4gICAgICAgIFxcdFxcdFxuICAgICAgICBcXHRcXHRicmVhaztcbiAgICAgICAgfVxuICAgICAgICBcIlwiXCIsXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgICdjbG9zZSc6IHsgXG4gICAgICBhbGlhc09mOiAnY29yZTpjbG9zZScgXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBwcmVmaXg6ICc8P3BocFxcbidcbiAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIHJlcXVpcmVkX2FmZml4ZXM6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgfSlcbiAgXG5cbndyYXBXaXRoUGhwID0gKHJlc3VsdCxpbnN0YW5jZSkgLT5cbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywnaW5saW5lJ10sdHJ1ZSlcbiAgaWYgaW5saW5lXG4gICAgcmVnT3BlbiA9IC88XFw/cGhwXFxzKFtcXFxcblxcXFxyXFxzXSspL2dcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZ1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/PidcbiAgZWxzZVxuICAgICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nXG5cbiMgY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuIyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICciLCJpbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vYm9vdHN0cmFwJztcbmltcG9ydCB7IFRleHRBcmVhRWRpdG9yIH0gZnJvbSAnLi9UZXh0QXJlYUVkaXRvcic7XG5cbkNvZGV3YXZlLmRldGVjdCA9ICh0YXJnZXQpIC0+XG4gIGN3ID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvcih0YXJnZXQpKVxuICBDb2Rld2F2ZS5pbnN0YW5jZXMucHVzaChjdylcbiAgY3dcblxuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmVcblxud2luZG93LkNvZGV3YXZlID0gQ29kZXdhdmVcbiAgIiwiZXhwb3J0IGNsYXNzIEFycmF5SGVscGVyXG4gIEBpc0FycmF5OiAoYXJyKSAtPlxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIGFyciApID09ICdbb2JqZWN0IEFycmF5XSdcbiAgXG4gIEB1bmlvbjogKGExLGEyKSAtPlxuICAgIEB1bmlxdWUoYTEuY29uY2F0KGEyKSlcbiAgICBcbiAgQHVuaXF1ZTogKGFycmF5KSAtPlxuICAgIGEgPSBhcnJheS5jb25jYXQoKVxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IGEubGVuZ3RoXG4gICAgICBqID0gaSArIDFcbiAgICAgIHdoaWxlIGogPCBhLmxlbmd0aFxuICAgICAgICBpZiBhW2ldID09IGFbal1cbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpXG4gICAgICAgICsralxuICAgICAgKytpXG4gICAgYSIsImV4cG9ydCBjbGFzcyBDb21tb25IZWxwZXJcblxuICBAbWVyZ2U6ICh4cy4uLikgLT5cbiAgICBpZiB4cz8ubGVuZ3RoID4gMFxuICAgICAgQHRhcCB7fSwgKG0pIC0+IG1ba10gPSB2IGZvciBrLCB2IG9mIHggZm9yIHggaW4geHNcbiBcbiAgQHRhcDogKG8sIGZuKSAtPiBcbiAgICBmbihvKVxuICAgIG9cblxuICBAYXBwbHlNaXhpbnM6IChkZXJpdmVkQ3RvciwgYmFzZUN0b3JzKSAtPiBcbiAgICBiYXNlQ3RvcnMuZm9yRWFjaCAoYmFzZUN0b3IpID0+IFxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoIChuYW1lKT0+IFxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKSIsIlxuZXhwb3J0IGNsYXNzIE5hbWVzcGFjZUhlbHBlclxuXG4gIEBzcGxpdEZpcnN0OiAoZnVsbG5hbWUsaXNTcGFjZSA9IGZhbHNlKSAtPlxuICAgIGlmIGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09IC0xIGFuZCAhaXNTcGFjZVxuICAgICAgcmV0dXJuIFtudWxsLGZ1bGxuYW1lXVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIHJldHVybiBbcGFydHMuc2hpZnQoKSxwYXJ0cy5qb2luKCc6JykgfHwgbnVsbF1cblxuICBAc3BsaXQ6IChmdWxsbmFtZSkgLT5cbiAgICBpZiBmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PSAtMVxuICAgICAgcmV0dXJuIFtudWxsLGZ1bGxuYW1lXVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIG5hbWUgPSBwYXJ0cy5wb3AoKVxuICAgIFtwYXJ0cy5qb2luKCc6JyksbmFtZV0iLCJpbXBvcnQgeyBTaXplIH0gZnJvbSAnLi4vcG9zaXRpb25pbmcvU2l6ZSc7XG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdIZWxwZXJcbiAgQHRyaW1FbXB0eUxpbmU6ICh0eHQpIC0+XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKC9eXFxzKlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyP1xcblxccyokLywgJycpXG5cbiAgQGVzY2FwZVJlZ0V4cDogKHN0cikgLT5cbiAgICBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpXG5cbiAgQHJlcGVhdFRvTGVuZ3RoOiAodHh0LCBsZW5ndGgpIC0+XG4gICAgcmV0dXJuICcnIGlmIGxlbmd0aCA8PSAwXG4gICAgQXJyYXkoTWF0aC5jZWlsKGxlbmd0aC90eHQubGVuZ3RoKSsxKS5qb2luKHR4dCkuc3Vic3RyaW5nKDAsbGVuZ3RoKVxuICAgIFxuICBAcmVwZWF0OiAodHh0LCBuYikgLT5cbiAgICBBcnJheShuYisxKS5qb2luKHR4dClcbiAgICBcbiAgQGdldFR4dFNpemU6ICh0eHQpIC0+XG4gICAgbGluZXMgPSB0eHQucmVwbGFjZSgvXFxyL2csJycpLnNwbGl0KFwiXFxuXCIpICAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAnL1xcci9nJyBcIidcXHInXCJcbiAgICB3ID0gMFxuICAgIGZvciBsIGluIGxpbmVzXG4gICAgICB3ID0gTWF0aC5tYXgodyxsLmxlbmd0aClcbiAgICByZXR1cm4gbmV3IFNpemUodyxsaW5lcy5sZW5ndGgtMSlcblxuICBAaW5kZW50Tm90Rmlyc3Q6ICh0ZXh0LG5iPTEsc3BhY2VzPScgICcpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJlZyA9IC9cXG4vZyAgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgJy9cXG4vZycgXCJyZS5jb21waWxlKHInXFxuJyxyZS5NKVwiXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgXCJcXG5cIiArIEByZXBlYXQoc3BhY2VzLCBuYikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgICAgIFxuICBAaW5kZW50OiAodGV4dCxuYj0xLHNwYWNlcz0nICAnKSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZXR1cm4gc3BhY2VzICsgQGluZGVudE5vdEZpcnN0KHRleHQsbmIsc3BhY2VzKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gIFxuICBAcmV2ZXJzZVN0cjogKHR4dCkgLT5cbiAgICByZXR1cm4gdHh0LnNwbGl0KFwiXCIpLnJldmVyc2UoKS5qb2luKFwiXCIpXG4gIFxuICBcbiAgQHJlbW92ZUNhcnJldDogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICB0bXAgPSAnW1tbW3F1b3RlZF9jYXJyZXRdXV1dJ1xuICAgIHJlQ2FycmV0ID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIpLCBcImdcIilcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyK2NhcnJldENoYXIpLCBcImdcIilcbiAgICByZVRtcCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cCh0bXApLCBcImdcIilcbiAgICB0eHQucmVwbGFjZShyZVF1b3RlZCx0bXApLnJlcGxhY2UocmVDYXJyZXQsJycpLnJlcGxhY2UocmVUbXAsIGNhcnJldENoYXIpXG4gICAgXG4gIEBnZXRBbmRSZW1vdmVGaXJzdENhcnJldDogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICBwb3MgPSBAZ2V0Q2FycmV0UG9zKHR4dCxjYXJyZXRDaGFyKVxuICAgIGlmIHBvcz9cbiAgICAgIHR4dCA9IHR4dC5zdWJzdHIoMCxwb3MpICsgdHh0LnN1YnN0cihwb3MrY2FycmV0Q2hhci5sZW5ndGgpXG4gICAgICByZXR1cm4gW3Bvcyx0eHRdXG4gICAgICBcbiAgQGdldENhcnJldFBvczogKHR4dCwgY2FycmV0Q2hhciA9ICd8JykgLT5cbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyK2NhcnJldENoYXIpLCBcImdcIilcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKSAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSByZVF1b3RlZCBjYXJyZXRDaGFyK2NhcnJldENoYXJcbiAgICBpZiAoaSA9IHR4dC5pbmRleE9mKGNhcnJldENoYXIpKSA+IC0xXG4gICAgICByZXR1cm4gaSIsIlxuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGFpck1hdGNoIH0gZnJvbSAnLi9QYWlyTWF0Y2gnO1xuXG5leHBvcnQgY2xhc3MgUGFpclxuICBjb25zdHJ1Y3RvcjogKEBvcGVuZXIsQGNsb3NlcixAb3B0aW9ucyA9IHt9KSAtPlxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2VcbiAgICAgIHZhbGlkTWF0Y2g6IG51bGxcbiAgICB9XG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2YgQG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gQG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgb3BlbmVyUmVnOiAtPlxuICAgIGlmIHR5cGVvZiBAb3BlbmVyID09ICdzdHJpbmcnIFxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAb3BlbmVyKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQG9wZW5lclxuICBjbG9zZXJSZWc6IC0+XG4gICAgaWYgdHlwZW9mIEBjbG9zZXIgPT0gJ3N0cmluZycgXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjbG9zZXIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAY2xvc2VyXG4gIG1hdGNoQW55UGFydHM6IC0+XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW5lcjogQG9wZW5lclJlZygpXG4gICAgICBjbG9zZXI6IEBjbG9zZXJSZWcoKVxuICAgIH1cbiAgbWF0Y2hBbnlQYXJ0S2V5czogLT5cbiAgICBrZXlzID0gW11cbiAgICBmb3Iga2V5LCByZWcgb2YgQG1hdGNoQW55UGFydHMoKVxuICAgICAga2V5cy5wdXNoKGtleSlcbiAgICByZXR1cm4ga2V5c1xuICBtYXRjaEFueVJlZzogLT5cbiAgICBncm91cHMgPSBbXVxuICAgIGZvciBrZXksIHJlZyBvZiBAbWF0Y2hBbnlQYXJ0cygpXG4gICAgICBncm91cHMucHVzaCgnKCcrcmVnLnNvdXJjZSsnKScpICAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSByZWcuc291cmNlIHJlZy5wYXR0ZXJuXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoZ3JvdXBzLmpvaW4oJ3wnKSlcbiAgbWF0Y2hBbnk6ICh0ZXh0LG9mZnNldD0wKSAtPlxuICAgIHdoaWxlIChtYXRjaCA9IEBfbWF0Y2hBbnkodGV4dCxvZmZzZXQpKT8gYW5kICFtYXRjaC52YWxpZCgpXG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgIHJldHVybiBtYXRjaCBpZiBtYXRjaD8gYW5kIG1hdGNoLnZhbGlkKClcbiAgX21hdGNoQW55OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICBpZiBvZmZzZXRcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cihvZmZzZXQpXG4gICAgbWF0Y2ggPSBAbWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpXG4gICAgaWYgbWF0Y2g/XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLG1hdGNoLG9mZnNldClcbiAgbWF0Y2hBbnlOYW1lZDogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBfbWF0Y2hBbnlHZXROYW1lKEBtYXRjaEFueSh0ZXh0KSlcbiAgbWF0Y2hBbnlMYXN0OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICB3aGlsZSBtYXRjaCA9IEBtYXRjaEFueSh0ZXh0LG9mZnNldClcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpXG4gICAgICBpZiAhcmVzIG9yIHJlcy5lbmQoKSAhPSBtYXRjaC5lbmQoKVxuICAgICAgICByZXMgPSBtYXRjaFxuICAgIHJldHVybiByZXNcbiAgaWRlbnRpY2FsOiAtPlxuICAgIEBvcGVuZXIgPT0gQGNsb3NlciBvciAoXG4gICAgICBAb3BlbmVyLnNvdXJjZT8gYW5kIFxuICAgICAgQGNsb3Nlci5zb3VyY2U/IGFuZCBcbiAgICAgIEBvcGVuZXIuc291cmNlID09IEBjbG9zZXIuc291cmNlXG4gICAgKVxuICB3cmFwcGVyUG9zOiAocG9zLHRleHQpIC0+XG4gICAgc3RhcnQgPSBAbWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAscG9zLnN0YXJ0KSlcbiAgICBpZiBzdGFydD8gYW5kIChAaWRlbnRpY2FsKCkgb3Igc3RhcnQubmFtZSgpID09ICdvcGVuZXInKVxuICAgICAgZW5kID0gQG1hdGNoQW55KHRleHQscG9zLmVuZClcbiAgICAgIGlmIGVuZD8gYW5kIChAaWRlbnRpY2FsKCkgb3IgZW5kLm5hbWUoKSA9PSAnY2xvc2VyJylcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSxlbmQuZW5kKCkpXG4gICAgICBlbHNlIGlmIEBvcHRpb25uYWxfZW5kXG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksdGV4dC5sZW5ndGgpXG4gIGlzV2FwcGVyT2Y6IChwb3MsdGV4dCkgLT5cbiAgICByZXR1cm4gQHdyYXBwZXJQb3MocG9zLHRleHQpPyIsImV4cG9ydCBjbGFzcyBQYWlyTWF0Y2hcbiAgY29uc3RydWN0b3I6IChAcGFpcixAbWF0Y2gsQG9mZnNldCA9IDApIC0+XG4gIG5hbWU6IC0+XG4gICAgaWYgQG1hdGNoXG4gICAgICB1bmxlc3MgX25hbWU/XG4gICAgICAgIGZvciBncm91cCwgaSBpbiBAbWF0Y2hcbiAgICAgICAgICBpZiBpID4gMCBhbmQgZ3JvdXA/XG4gICAgICAgICAgICBfbmFtZSA9IEBwYWlyLm1hdGNoQW55UGFydEtleXMoKVtpLTFdXG4gICAgICAgICAgICByZXR1cm4gX25hbWVcbiAgICAgICAgX25hbWUgPSBmYWxzZVxuICAgICAgcmV0dXJuIF9uYW1lIHx8IG51bGxcbiAgc3RhcnQ6IC0+XG4gICAgQG1hdGNoLmluZGV4ICsgQG9mZnNldFxuICBlbmQ6IC0+XG4gICAgQG1hdGNoLmluZGV4ICsgQG1hdGNoWzBdLmxlbmd0aCArIEBvZmZzZXRcbiAgdmFsaWQ6IC0+XG4gICAgcmV0dXJuICFAcGFpci52YWxpZE1hdGNoIHx8IEBwYWlyLnZhbGlkTWF0Y2godGhpcylcbiAgbGVuZ3RoOiAtPlxuICAgIEBtYXRjaFswXS5sZW5ndGgiLCJleHBvcnQgY2xhc3MgUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LEBlbmQpIC0+XG4gICAgQGVuZCA9IEBzdGFydCB1bmxlc3MgQGVuZD9cbiAgY29udGFpbnNQdDogKHB0KSAtPlxuICAgIHJldHVybiBAc3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBlbmRcbiAgY29udGFpbnNQb3M6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBzdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGVuZFxuICB3cmFwcGVkQnk6IChwcmVmaXgsc3VmZml4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyhAc3RhcnQtcHJlZml4Lmxlbmd0aCxAc3RhcnQsQGVuZCxAZW5kK3N1ZmZpeC5sZW5ndGgpXG4gIHdpdGhFZGl0b3I6ICh2YWwpLT5cbiAgICBAX2VkaXRvciA9IHZhbFxuICAgIHJldHVybiB0aGlzXG4gIGVkaXRvcjogLT5cbiAgICB1bmxlc3MgQF9lZGl0b3I/XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVkaXRvciBzZXQnKVxuICAgIHJldHVybiBAX2VkaXRvclxuICBoYXNFZGl0b3I6IC0+XG4gICAgcmV0dXJuIEBfZWRpdG9yP1xuICB0ZXh0OiAtPlxuICAgIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBzdGFydCwgQGVuZClcbiAgYXBwbHlPZmZzZXQ6IChvZmZzZXQpLT5cbiAgICBpZiBvZmZzZXQgIT0gMFxuICAgICAgQHN0YXJ0ICs9IG9mZnNldFxuICAgICAgQGVuZCArPSBvZmZzZXRcbiAgICByZXR1cm4gdGhpc1xuICBwcmV2RU9MOiAtPlxuICAgIHVubGVzcyBAX3ByZXZFT0w/XG4gICAgICBAX3ByZXZFT0wgPSBAZWRpdG9yKCkuZmluZExpbmVTdGFydChAc3RhcnQpXG4gICAgcmV0dXJuIEBfcHJldkVPTFxuICBuZXh0RU9MOiAtPlxuICAgIHVubGVzcyBAX25leHRFT0w/XG4gICAgICBAX25leHRFT0wgPSBAZWRpdG9yKCkuZmluZExpbmVFbmQoQGVuZClcbiAgICByZXR1cm4gQF9uZXh0RU9MXG4gIHRleHRXaXRoRnVsbExpbmVzOiAtPlxuICAgIHVubGVzcyBAX3RleHRXaXRoRnVsbExpbmVzP1xuICAgICAgQF90ZXh0V2l0aEZ1bGxMaW5lcyA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBwcmV2RU9MKCksQG5leHRFT0woKSlcbiAgICByZXR1cm4gQF90ZXh0V2l0aEZ1bGxMaW5lc1xuICBzYW1lTGluZXNQcmVmaXg6IC0+XG4gICAgdW5sZXNzIEBfc2FtZUxpbmVzUHJlZml4P1xuICAgICAgQF9zYW1lTGluZXNQcmVmaXggPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAcHJldkVPTCgpLEBzdGFydClcbiAgICByZXR1cm4gQF9zYW1lTGluZXNQcmVmaXhcbiAgc2FtZUxpbmVzU3VmZml4OiAtPlxuICAgIHVubGVzcyBAX3NhbWVMaW5lc1N1ZmZpeD9cbiAgICAgIEBfc2FtZUxpbmVzU3VmZml4ID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQGVuZCxAbmV4dEVPTCgpKVxuICAgIHJldHVybiBAX3NhbWVMaW5lc1N1ZmZpeFxuICBjb3B5OiAtPlxuICAgIHJlcyA9IG5ldyBQb3MoQHN0YXJ0LEBlbmQpXG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICByZXMud2l0aEVkaXRvcihAZWRpdG9yKCkpXG4gICAgcmV0dXJuIHJlc1xuICByYXc6IC0+XG4gICAgW0BzdGFydCxAZW5kXSIsImltcG9ydCB7IFdyYXBwaW5nIH0gZnJvbSAnLi9XcmFwcGluZyc7XG5pbXBvcnQgeyBSZXBsYWNlbWVudCB9IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuaW1wb3J0IHsgQ29tbW9uSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUG9zQ29sbGVjdGlvblxuICBjb25zdHJ1Y3RvcjogKGFycikgLT5cbiAgICBpZiAhQXJyYXkuaXNBcnJheShhcnIpXG4gICAgICBhcnIgPSBbYXJyXVxuICAgIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhhcnIsW1Bvc0NvbGxlY3Rpb25dKVxuICAgIHJldHVybiBhcnJcbiAgICBcbiAgd3JhcDogKHByZWZpeCxzdWZmaXgpLT5cbiAgICAgIHJldHVybiBAbWFwKCAocCkgLT4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeCkpXG4gIHJlcGxhY2U6ICh0eHQpLT5cbiAgICAgIHJldHVybiBAbWFwKCAocCkgLT4gbmV3IFJlcGxhY2VtZW50KHAuc3RhcnQsIHAuZW5kLCB0eHQpKSIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcbmltcG9ydCB7IENvbW1vbkhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcbmltcG9ydCB7IE9wdGlvbk9iamVjdCB9IGZyb20gJy4uL09wdGlvbk9iamVjdCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBSZXBsYWNlbWVudCBleHRlbmRzIFBvc1xuICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnModGhpcy5wcm90b3R5cGUsW09wdGlvbk9iamVjdF0pXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LCBAZW5kLCBAdGV4dCwgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBzdXBlcigpXG4gICAgQHNldE9wdHMoQG9wdGlvbnMse1xuICAgICAgcHJlZml4OiAnJ1xuICAgICAgc3VmZml4OiAnJ1xuICAgICAgc2VsZWN0aW9uczogW11cbiAgICB9KVxuICByZXNQb3NCZWZvcmVQcmVmaXg6IC0+XG4gICAgcmV0dXJuIEBzdGFydCtAcHJlZml4Lmxlbmd0aCtAdGV4dC5sZW5ndGhcbiAgcmVzRW5kOiAtPiBcbiAgICByZXR1cm4gQHN0YXJ0K0BmaW5hbFRleHQoKS5sZW5ndGhcbiAgYXBwbHk6IC0+XG4gICAgQGVkaXRvcigpLnNwbGljZVRleHQoQHN0YXJ0LCBAZW5kLCBAZmluYWxUZXh0KCkpXG4gIG5lY2Vzc2FyeTogLT5cbiAgICByZXR1cm4gQGZpbmFsVGV4dCgpICE9IEBvcmlnaW5hbFRleHQoKVxuICBvcmlnaW5hbFRleHQ6IC0+XG4gICAgcmV0dXJuIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBzdGFydCwgQGVuZClcbiAgZmluYWxUZXh0OiAtPlxuICAgIHJldHVybiBAcHJlZml4K0B0ZXh0K0BzdWZmaXhcbiAgb2Zmc2V0QWZ0ZXI6ICgpIC0+IFxuICAgIHJldHVybiBAZmluYWxUZXh0KCkubGVuZ3RoIC0gKEBlbmQgLSBAc3RhcnQpXG4gIGFwcGx5T2Zmc2V0OiAob2Zmc2V0KS0+XG4gICAgaWYgb2Zmc2V0ICE9IDBcbiAgICAgIEBzdGFydCArPSBvZmZzZXRcbiAgICAgIEBlbmQgKz0gb2Zmc2V0XG4gICAgICBmb3Igc2VsIGluIEBzZWxlY3Rpb25zXG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgICByZXR1cm4gdGhpc1xuICBzZWxlY3RDb250ZW50OiAtPiBcbiAgICBAc2VsZWN0aW9ucyA9IFtuZXcgUG9zKEBwcmVmaXgubGVuZ3RoK0BzdGFydCwgQHByZWZpeC5sZW5ndGgrQHN0YXJ0K0B0ZXh0Lmxlbmd0aCldXG4gICAgcmV0dXJuIHRoaXNcbiAgY2FycmV0VG9TZWw6IC0+XG4gICAgQHNlbGVjdGlvbnMgPSBbXVxuICAgIHRleHQgPSBAZmluYWxUZXh0KClcbiAgICBAcHJlZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAcHJlZml4KVxuICAgIEB0ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAdGV4dClcbiAgICBAc3VmZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAc3VmZml4KVxuICAgIHN0YXJ0ID0gQHN0YXJ0XG4gICAgXG4gICAgd2hpbGUgKHJlcyA9IFN0cmluZ0hlbHBlci5nZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0ZXh0KSk/XG4gICAgICBbcG9zLHRleHRdID0gcmVzXG4gICAgICBAc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3Moc3RhcnQrcG9zLCBzdGFydCtwb3MpKVxuICAgICAgXG4gICAgcmV0dXJuIHRoaXNcbiAgY29weTogLT4gXG4gICAgcmVzID0gbmV3IFJlcGxhY2VtZW50KEBzdGFydCwgQGVuZCwgQHRleHQsIEBnZXRPcHRzKCkpXG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICByZXMud2l0aEVkaXRvcihAZWRpdG9yKCkpXG4gICAgcmVzLnNlbGVjdGlvbnMgPSBAc2VsZWN0aW9ucy5tYXAoIChzKS0+cy5jb3B5KCkgKVxuICAgIHJldHVybiByZXMiLCJleHBvcnQgY2xhc3MgU2l6ZVxuICBjb25zdHJ1Y3RvcjogKEB3aWR0aCxAaGVpZ2h0KSAtPiIsImV4cG9ydCBjbGFzcyBTdHJQb3NcbiAgY29uc3RydWN0b3I6IChAcG9zLEBzdHIpIC0+XG4gIGVuZDogLT5cbiAgICBAcG9zICsgQHN0ci5sZW5ndGgiLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBXcmFwcGVkUG9zIGV4dGVuZHMgUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LEBpbm5lclN0YXJ0LEBpbm5lckVuZCxAZW5kKSAtPlxuICAgIHN1cGVyKClcbiAgaW5uZXJDb250YWluc1B0OiAocHQpIC0+XG4gICAgcmV0dXJuIEBpbm5lclN0YXJ0IDw9IHB0IGFuZCBwdCA8PSBAaW5uZXJFbmRcbiAgaW5uZXJDb250YWluc1BvczogKHBvcykgLT5cbiAgICByZXR1cm4gQGlubmVyU3RhcnQgPD0gcG9zLnN0YXJ0IGFuZCBwb3MuZW5kIDw9IEBpbm5lckVuZFxuICBpbm5lclRleHQ6IC0+XG4gICAgQGVkaXRvcigpLnRleHRTdWJzdHIoQGlubmVyU3RhcnQsIEBpbm5lckVuZClcbiAgc2V0SW5uZXJMZW46IChsZW4pIC0+XG4gICAgQG1vdmVTdWZpeChAaW5uZXJTdGFydCArIGxlbilcbiAgbW92ZVN1ZmZpeDogKHB0KSAtPlxuICAgIHN1ZmZpeExlbiA9IEBlbmQgLSBAaW5uZXJFbmRcbiAgICBAaW5uZXJFbmQgPSBwdFxuICAgIEBlbmQgPSBAaW5uZXJFbmQgKyBzdWZmaXhMZW5cbiAgY29weTogLT5cbiAgICByZXR1cm4gbmV3IFdyYXBwZWRQb3MoQHN0YXJ0LEBpbm5lclN0YXJ0LEBpbm5lckVuZCxAZW5kKSIsImltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCBjbGFzcyBXcmFwcGluZyBleHRlbmRzIFJlcGxhY2VtZW50XG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LCBAZW5kLCBwcmVmaXggPScnLCBzdWZmaXggPSAnJywgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBzdXBlcigpXG4gICAgQHNldE9wdHMoQG9wdGlvbnMpXG4gICAgQHRleHQgPSAnJ1xuICAgIEBwcmVmaXggPSBwcmVmaXhcbiAgICBAc3VmZml4ID0gc3VmZml4XG4gIGFwcGx5OiAtPlxuICAgIEBhZGp1c3RTZWwoKVxuICAgIHN1cGVyKClcbiAgYWRqdXN0U2VsOiAtPlxuICAgIG9mZnNldCA9IEBvcmlnaW5hbFRleHQoKS5sZW5ndGhcbiAgICBmb3Igc2VsIGluIEBzZWxlY3Rpb25zXG4gICAgICBpZiBzZWwuc3RhcnQgPiBAc3RhcnQrQHByZWZpeC5sZW5ndGhcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgaWYgc2VsLmVuZCA+PSBAc3RhcnQrQHByZWZpeC5sZW5ndGhcbiAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgZmluYWxUZXh0OiAtPlxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgdGV4dCA9IEBvcmlnaW5hbFRleHQoKVxuICAgIGVsc2VcbiAgICAgIHRleHQgPSAnJ1xuICAgIHJldHVybiBAcHJlZml4K3RleHQrQHN1ZmZpeFxuICBvZmZzZXRBZnRlcjogKCkgLT4gXG4gICAgcmV0dXJuIEBwcmVmaXgubGVuZ3RoK0BzdWZmaXgubGVuZ3RoXG4gICAgICAgICAgXG4gIGNvcHk6IC0+IFxuICAgIHJlcyA9IG5ldyBXcmFwcGluZyhAc3RhcnQsIEBlbmQsIEBwcmVmaXgsIEBzdWZmaXgpXG4gICAgcmVzLnNlbGVjdGlvbnMgPSBAc2VsZWN0aW9ucy5tYXAoIChzKS0+cy5jb3B5KCkgKVxuICAgIHJldHVybiByZXMiXX0=
