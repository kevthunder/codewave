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

var _Pair = require("./positioning/Pair"); // [pawa]
//   replace 'replace(/\r/g' "replace('\r'"


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

var _StringHelper = require("./helpers/StringHelper"); // [pawa]
//   replace 'replace(/\t/g' 'replace("\t"'


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

        return this.closingPromp = _ClosingPromp.ClosingPromp.newFor(this, selections).begin(); // [pawa python] replace /\(new (.*)\).begin/ $1.begin reparse
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
        var savedCmds;
        Command.cmds.setCmdData(fullname, data);
        savedCmds = this.storage.load('cmds');

        if (savedCmds == null) {
          savedCmds = {};
        }

        savedCmds[fullname] = data;
        return this.storage.save('cmds', savedCmds);
      }
    }, {
      key: "loadCmds",
      value: function loadCmds() {
        var data, fullname, results, savedCmds;
        savedCmds = this.storage.load('cmds');

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

var _Pair = require("./positioning/Pair"); // [pawa python]
//   replace /data.(\w+)/ data['$1']
//   replace codewave.editor.text() codewave.editor.text


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

var _Command = require("./Command"); // [pawa]
//   replace Codewave.Command.set codewave_core.core_cmds.set


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

var _Command = require("./Command"); // [pawa]
//   replace 'replace(/\t/g' 'replace("\t"'


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
  function Storage(engine1) {
    _classCallCheck(this, Storage);

    this.engine = engine1;
  }

  _createClass(Storage, [{
    key: "save",
    value: function save(key, val) {
      if (this.engineAvailable()) {
        return this.engine.save(key, val);
      }
    }
  }, {
    key: "load",
    value: function load(key) {
      if (this.engineAvailable()) {
        return this.engine.load(key);
      }
    }
  }, {
    key: "engineAvailable",
    value: function engineAvailable() {
      if (typeof engine !== "undefined" && engine !== null) {
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

var _Pos = require("./positioning/Pos"); // [pawa python]
//   replace (Editor) (editor.Editor)
//   replace @text()  self.text


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
  storage = _Command.Command.storage;
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
    storage = _Command.Command.storage;
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

var _Command = require("../Command"); // [pawa python]
//   replace @Codewave.Command.cmdInitialisers command.cmdInitialisersBaseCommand
//   replace (BaseCommand (command.BaseCommand
//   replace EditCmd.props editCmdProps
//   replace EditCmd.setCmds editCmdSetCmds reparse


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvQm94SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9Cb3hIZWxwZXIuanMiLCIuLi9zcmMvQ2xvc2luZ1Byb21wLmNvZmZlZSIsIi4uL3NyYy9DbG9zaW5nUHJvbXAuanMiLCIuLi9zcmMvQ21kRmluZGVyLmNvZmZlZSIsIi4uL3NyYy9DbWRGaW5kZXIuanMiLCIuLi9zcmMvQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL0NtZEluc3RhbmNlLmpzIiwiLi4vc3JjL0NvZGV3YXZlLmNvZmZlZSIsIi4uL3NyYy9Db2Rld2F2ZS5qcyIsIi4uL3NyYy9Db21tYW5kLmNvZmZlZSIsIi4uL3NyYy9Db21tYW5kLmpzIiwiLi4vc3JjL0NvbnRleHQuY29mZmVlIiwiLi4vc3JjL0NvbnRleHQuanMiLCIuLi9zcmMvRGV0ZWN0b3IuY29mZmVlIiwiLi4vc3JjL0RldGVjdG9yLmpzIiwiLi4vc3JjL0VkaXRDbWRQcm9wLmNvZmZlZSIsIi4uL3NyYy9FZGl0Q21kUHJvcC5qcyIsIi4uL3NyYy9FZGl0b3IuY29mZmVlIiwiLi4vc3JjL0VkaXRvci5qcyIsIi4uL3NyYy9Mb2dnZXIuY29mZmVlIiwiLi4vc3JjL0xvZ2dlci5qcyIsIi4uL3NyYy9PcHRpb25PYmplY3QuY29mZmVlIiwiLi4vc3JjL09wdGlvbk9iamVjdC5qcyIsIi4uL3NyYy9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UuY29mZmVlIiwiLi4vc3JjL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsIi4uL3NyYy9Qcm9jZXNzLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmNvZmZlZSIsIi4uL3NyYy9TdG9yYWdlLmpzIiwiLi4vc3JjL1RleHRBcmVhRWRpdG9yLmNvZmZlZSIsIi4uL3NyYy9UZXh0QXJlYUVkaXRvci5qcyIsIi4uL3NyYy9UZXh0UGFyc2VyLmNvZmZlZSIsIi4uL3NyYy9UZXh0UGFyc2VyLmpzIiwiLi4vc3JjL2Jvb3RzdHJhcC5jb2ZmZWUiLCIuLi9zcmMvYm9vdHN0cmFwLmpzIiwiLi4vc3JjL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlci5jb2ZmZWUiLCIuLi9zcmMvY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvSnNDb21tYW5kUHJvdmlkZXIuanMiLCIuLi9zcmMvY21kcy9QaHBDb21tYW5kUHJvdmlkZXIuY29mZmVlIiwiLi4vc3JjL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyLmpzIiwiLi4vc3JjL2VudHJ5LmNvZmZlZSIsIi4uL3NyYy9lbnRyeS5qcyIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0FycmF5SGVscGVyLmpzIiwiLi4vc3JjL2hlbHBlcnMvQ29tbW9uSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL0NvbW1vbkhlbHBlci5qcyIsIi4uL3NyYy9oZWxwZXJzL05hbWVzcGFjZUhlbHBlci5jb2ZmZWUiLCIuLi9zcmMvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCIuLi9zcmMvaGVscGVycy9PcHRpb25hbFByb21pc2UuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlLmpzIiwiLi4vc3JjL2hlbHBlcnMvU3RyaW5nSGVscGVyLmNvZmZlZSIsIi4uL3NyYy9oZWxwZXJzL1N0cmluZ0hlbHBlci5qcyIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmNvZmZlZSIsIi4uL3NyYy9wb3NpdGlvbmluZy9QYWlyLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1BhaXJNYXRjaC5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24uanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1NpemUuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1N0clBvcy5jb2ZmZWUiLCIuLi9zcmMvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCIuLi9zcmMvcG9zaXRpb25pbmcvV3JhcHBpbmcuY29mZmVlIiwiLi4vc3JjL3Bvc2l0aW9uaW5nL1dyYXBwaW5nLmpzIiwiLi4vc3JjL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZS5jb2ZmZWUiLCIuLi9zcmMvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQ0dBLElBQUEsYUFBQSxHQUFBLE9BQUEsQ0FBQSx3QkFBQSxDQUFBOztBQUNBLElBQUEsWUFBQSxHQUFBLE9BQUEsQ0FBQSx1QkFBQSxDQUFBOztBQUNBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxvQkFBQSxDQUFBLEMsQ0FMQTtBQ0NFOzs7QURNRixJQUFhLFNBQU47QUFBQTtBQUFBO0FBQ0wscUJBQWEsT0FBYixFQUFhO0FBQUEsUUFBVyxPQUFYLHVFQUFBLEVBQUE7O0FBQUE7O0FBQ1gsUUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFEWSxTQUFBLE9BQUEsR0FBQSxPQUFBO0FBQ1osU0FBQSxRQUFBLEdBQVk7QUFDVixNQUFBLElBQUEsRUFBTSxLQUFBLE9BQUEsQ0FB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LE1BQUEsRUFBb0MsS0FBMUMsTUFBTSxDQUFOO0FBQ0EsTUFBQSxHQUFHLENBQUgsVUFBQSxHQUFpQixLQUFBLFVBQUEsQ0FBQSxHQUFBLENBQWlCLFVBQUEsQ0FBQSxFQUFBO0FDNEJoQyxlRDVCcUMsQ0FBQyxDQUFELElBQUEsRUM0QnJDO0FENUJGLE9BQWlCLENBQWpCO0FBQ0EsYUFBQSxHQUFBO0FBSEk7QUExQkQ7O0FBQUE7QUFBQSxFQUF1QixZQUFBLENBQXZCLFdBQUEsQ0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFREEsSUFBYSxrQkFBTjtBQUFBO0FBQUE7QUFDTCxnQ0FBYTtBQUFBO0FBQUE7O0FBRFI7QUFBQTtBQUFBLHlCQUVDLEdBRkQsRUFFQyxHQUZELEVBRUM7QUFDSixVQUFHLE9BQUEsWUFBQSxLQUFBLFdBQUEsSUFBQSxZQUFBLEtBQUgsSUFBQSxFQUFBO0FDQ0UsZURBQSxZQUFZLENBQVosT0FBQSxDQUFxQixLQUFBLE9BQUEsQ0FBckIsR0FBcUIsQ0FBckIsRUFBb0MsSUFBSSxDQUFKLFNBQUEsQ0FBcEMsR0FBb0MsQ0FBcEMsQ0NBQTtBQUNEO0FESEc7QUFGRDtBQUFBO0FBQUEseUJBS0MsR0FMRCxFQUtDO0FBQ0osVUFBRyxPQUFBLFlBQUEsS0FBQSxXQUFBLElBQUEsWUFBQSxLQUFILElBQUEsRUFBQTtBQ0lFLGVESEEsSUFBSSxDQUFKLEtBQUEsQ0FBVyxZQUFZLENBQVosT0FBQSxDQUFxQixLQUFBLE9BQUEsQ0FBaEMsR0FBZ0MsQ0FBckIsQ0FBWCxDQ0dBO0FBQ0Q7QURORztBQUxEO0FBQUE7QUFBQSw0QkFRSSxHQVJKLEVBUUk7QUNPUCxhRE5BLGNBQVksR0NNWjtBRFBPO0FBUko7O0FBQUE7QUFBQSxHQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiIyBbcGF3YV1cbiMgICByZXBsYWNlICdyZXBsYWNlKC9cXHIvZycgXCJyZXBsYWNlKCdcXHInXCJcblxuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5pbXBvcnQgeyBQYWlyIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9QYWlyJztcblxuZXhwb3J0IGNsYXNzIEJveEhlbHBlclxuICBjb25zdHJ1Y3RvcjogKEBjb250ZXh0LCBvcHRpb25zID0ge30pIC0+XG4gICAgQGRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogQGNvbnRleHQuY29kZXdhdmUuZGVjb1xuICAgICAgcGFkOiAyXG4gICAgICB3aWR0aDogNTBcbiAgICAgIGhlaWdodDogM1xuICAgICAgb3BlblRleHQ6ICcnXG4gICAgICBjbG9zZVRleHQ6ICcnXG4gICAgICBwcmVmaXg6ICcnXG4gICAgICBzdWZmaXg6ICcnXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICBjbG9uZTogKHRleHQpIC0+XG4gICAgb3B0ID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XVxuICAgIHJldHVybiBuZXcgQm94SGVscGVyKEBjb250ZXh0LG9wdClcbiAgZHJhdzogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBzdGFydFNlcCgpICsgXCJcXG5cIiArIEBsaW5lcyh0ZXh0KSArIFwiXFxuXCIrIEBlbmRTZXAoKVxuICB3cmFwQ29tbWVudDogKHN0cikgLT5cbiAgICByZXR1cm4gQGNvbnRleHQud3JhcENvbW1lbnQoc3RyKVxuICBzZXBhcmF0b3I6IC0+XG4gICAgbGVuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAZGVjb0xpbmUobGVuKSlcbiAgc3RhcnRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAb3BlblRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEBwcmVmaXggKyBAd3JhcENvbW1lbnQoQG9wZW5UZXh0K0BkZWNvTGluZShsbikpXG4gIGVuZFNlcDogLT5cbiAgICBsbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aCAtIEBjbG9zZVRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAY2xvc2VUZXh0K0BkZWNvTGluZShsbikpICsgQHN1ZmZpeFxuICBkZWNvTGluZTogKGxlbikgLT5cbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKEBkZWNvLCBsZW4pXG4gIHBhZGRpbmc6IC0+IFxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIEBwYWQpXG4gIGxpbmVzOiAodGV4dCA9ICcnLCB1cHRvSGVpZ2h0PXRydWUpIC0+XG4gICAgdGV4dCA9IHRleHQgb3IgJydcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKVxuICAgIGlmIHVwdG9IZWlnaHRcbiAgICAgIHJldHVybiAoQGxpbmUobGluZXNbeF0gb3IgJycpIGZvciB4IGluIFswLi5AaGVpZ2h0XSkuam9pbignXFxuJykgXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIChAbGluZShsKSBmb3IgbCBpbiBsaW5lcykuam9pbignXFxuJykgXG4gIGxpbmU6ICh0ZXh0ID0gJycpIC0+XG4gICAgcmV0dXJuIChTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsQGluZGVudCkgK1xuICAgICAgQHdyYXBDb21tZW50KFxuICAgICAgICBAZGVjbyArXG4gICAgICAgIEBwYWRkaW5nKCkgK1xuICAgICAgICB0ZXh0ICtcbiAgICAgICAgU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCBAd2lkdGggLSBAcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkubGVuZ3RoKSArIFxuICAgICAgICBAcGFkZGluZygpICtcbiAgICAgICAgQGRlY29cbiAgICAgICkpXG4gIGxlZnQ6IC0+XG4gICAgQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KEBkZWNvICsgQHBhZGRpbmcoKSlcbiAgcmlnaHQ6IC0+XG4gICAgQGNvbnRleHQud3JhcENvbW1lbnRSaWdodChAcGFkZGluZygpICsgQGRlY28pXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50OiAodGV4dCkgLT5cbiAgICByZXR1cm4gQGNvbnRleHQuY29kZXdhdmUucmVtb3ZlTWFya2VycyhAY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpXG4gIHRleHRCb3VuZHM6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0VHh0U2l6ZShAcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpXG4gIGdldEJveEZvclBvczogKHBvcykgLT5cbiAgICBkZXB0aCA9IEBnZXROZXN0ZWRMdmwocG9zLnN0YXJ0KVxuICAgIGlmIGRlcHRoID4gMFxuICAgICAgbGVmdCA9IEBsZWZ0KClcbiAgICAgIGN1ckxlZnQgPSBTdHJpbmdIZWxwZXIucmVwZWF0KGxlZnQsZGVwdGgtMSlcbiAgICAgIFxuICAgICAgY2xvbmUgPSBAY2xvbmUoKVxuICAgICAgcGxhY2Vob2xkZXIgPSBcIiMjI1BsYWNlSG9sZGVyIyMjXCJcbiAgICAgIGNsb25lLndpZHRoID0gcGxhY2Vob2xkZXIubGVuZ3RoXG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IEBkZWNvICsgQGRlY28gKyBwbGFjZWhvbGRlciArIEBkZWNvICsgQGRlY29cbiAgICAgIFxuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsJy4qJykpXG4gICAgICBlbmRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLmVuZFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgXG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLGVuZEZpbmQse1xuICAgICAgICB2YWxpZE1hdGNoOiAobWF0Y2gpPT5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nKG1hdGNoLGxlZnQpXG4gICAgICAgICAgZiA9IEBjb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KG1hdGNoLnN0YXJ0KCkgLFtsZWZ0LFwiXFxuXCIsXCJcXHJcIl0sLTEpXG4gICAgICAgICAgcmV0dXJuICFmPyBvciBmLnN0ciAhPSBsZWZ0XG4gICAgICB9KVxuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcyxAY29udGV4dC5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKVxuICAgICAgaWYgcmVzP1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIFxuICBnZXROZXN0ZWRMdmw6IChpbmRleCkgLT5cbiAgICBkZXB0aCA9IDBcbiAgICBsZWZ0ID0gQGxlZnQoKVxuICAgIHdoaWxlIChmID0gQGNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQoaW5kZXggLFtsZWZ0LFwiXFxuXCIsXCJcXHJcIl0sLTEpKT8gJiYgZi5zdHIgPT0gbGVmdFxuICAgICAgaW5kZXggPSBmLnBvc1xuICAgICAgZGVwdGgrK1xuICAgIHJldHVybiBkZXB0aFxuICBnZXRPcHRGcm9tTGluZTogKGxpbmUsZ2V0UGFkPXRydWUpIC0+XG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KEBkZWNvKSkrXCIpKFxcXFxzKilcIilcbiAgICByRW5kID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodChAZGVjbykpK1wiKShcXG58JClcIilcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpXG4gICAgcmVzRW5kID0gckVuZC5leGVjKGxpbmUpXG4gICAgaWYgcmVzU3RhcnQ/IGFuZCByZXNFbmQ/XG4gICAgICBpZiBnZXRQYWRcbiAgICAgICAgQHBhZCA9IE1hdGgubWluKHJlc1N0YXJ0WzNdLmxlbmd0aCxyZXNFbmRbMV0ubGVuZ3RoKVxuICAgICAgQGluZGVudCA9IHJlc1N0YXJ0WzFdLmxlbmd0aFxuICAgICAgc3RhcnRQb3MgPSByZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCArIEBwYWQgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgJ3Jlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoJyByZXNTdGFydC5lbmQoMilcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSBAcGFkICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICdyZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoJyByZXNFbmQuc3RhcnQoMilcbiAgICAgIEB3aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zXG4gICAgcmV0dXJuIHRoaXNcbiAgcmVmb3JtYXRMaW5lczogKHRleHQsb3B0aW9ucz17fSkgLT5cbiAgICByZXR1cm4gQGxpbmVzKEByZW1vdmVDb21tZW50KHRleHQsb3B0aW9ucyksZmFsc2UpXG4gIHJlbW92ZUNvbW1lbnQ6ICh0ZXh0LG9wdGlvbnM9e30pLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIG11bHRpbGluZTogdHJ1ZVxuICAgICAgfVxuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSxkZWZhdWx0cyxvcHRpb25zKVxuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKVxuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBkZWNvKVxuICAgICAgZmxhZyA9IGlmIG9wdGlvbnNbJ211bHRpbGluZSddIHRoZW4gJ2dtJyBlbHNlICcnICAgICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIFwiJ2dtJ1wiIHJlLk1cbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzezAsI3tAcGFkfX1cIiwgZmxhZykgICAgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgI3tAcGFkfSAnXCIrc3RyKHNlbGYucGFkKStcIidcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoXCJcXFxccyooPzoje2VkfSkqI3tlY3J9XFxcXHMqJFwiLCBmbGFnKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsJycpLnJlcGxhY2UocmUyLCcnKVxuICAgXG4gICIsIiAgLy8gW3Bhd2FdXG4gIC8vICAgcmVwbGFjZSAncmVwbGFjZSgvXFxyL2cnIFwicmVwbGFjZSgnXFxyJ1wiXG5pbXBvcnQge1xuICBTdHJpbmdIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIEFycmF5SGVscGVyXG59IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhaXJcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9QYWlyJztcblxuZXhwb3J0IHZhciBCb3hIZWxwZXIgPSBjbGFzcyBCb3hIZWxwZXIge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIga2V5LCByZWYsIHZhbDtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBkZWNvOiB0aGlzLmNvbnRleHQuY29kZXdhdmUuZGVjbyxcbiAgICAgIHBhZDogMixcbiAgICAgIHdpZHRoOiA1MCxcbiAgICAgIGhlaWdodDogMyxcbiAgICAgIG9wZW5UZXh0OiAnJyxcbiAgICAgIGNsb3NlVGV4dDogJycsXG4gICAgICBwcmVmaXg6ICcnLFxuICAgICAgc3VmZml4OiAnJyxcbiAgICAgIGluZGVudDogMFxuICAgIH07XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9uZSh0ZXh0KSB7XG4gICAgdmFyIGtleSwgb3B0LCByZWYsIHZhbDtcbiAgICBvcHQgPSB7fTtcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0LCBvcHQpO1xuICB9XG5cbiAgZHJhdyh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRTZXAoKSArIFwiXFxuXCIgKyB0aGlzLmxpbmVzKHRleHQpICsgXCJcXG5cIiArIHRoaXMuZW5kU2VwKCk7XG4gIH1cblxuICB3cmFwQ29tbWVudChzdHIpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50KHN0cik7XG4gIH1cblxuICBzZXBhcmF0b3IoKSB7XG4gICAgdmFyIGxlbjtcbiAgICBsZW4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMud3JhcENvbW1lbnQodGhpcy5kZWNvTGluZShsZW4pKTtcbiAgfVxuXG4gIHN0YXJ0U2VwKCkge1xuICAgIHZhciBsbjtcbiAgICBsbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aCAtIHRoaXMub3BlblRleHQubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMud3JhcENvbW1lbnQodGhpcy5vcGVuVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKTtcbiAgfVxuXG4gIGVuZFNlcCgpIHtcbiAgICB2YXIgbG47XG4gICAgbG4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGggLSB0aGlzLmNsb3NlVGV4dC5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMud3JhcENvbW1lbnQodGhpcy5jbG9zZVRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSkgKyB0aGlzLnN1ZmZpeDtcbiAgfVxuXG4gIGRlY29MaW5lKGxlbikge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgodGhpcy5kZWNvLCBsZW4pO1xuICB9XG5cbiAgcGFkZGluZygpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLnBhZCk7XG4gIH1cblxuICBsaW5lcyh0ZXh0ID0gJycsIHVwdG9IZWlnaHQgPSB0cnVlKSB7XG4gICAgdmFyIGwsIGxpbmVzLCB4O1xuICAgIHRleHQgPSB0ZXh0IHx8ICcnO1xuICAgIGxpbmVzID0gdGV4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpO1xuICAgIGlmICh1cHRvSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gKChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGksIHJlZiwgcmVzdWx0cztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKHggPSBpID0gMCwgcmVmID0gdGhpcy5oZWlnaHQ7ICgwIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWYpOyB4ID0gMCA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5saW5lKGxpbmVzW3hdIHx8ICcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLCBsZW4xLCByZXN1bHRzO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbjEgPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW4xOyBpKyspIHtcbiAgICAgICAgICBsID0gbGluZXNbaV07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKTtcbiAgICB9XG4gIH1cblxuICBsaW5lKHRleHQgPSAnJykge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMuaW5kZW50KSArIHRoaXMud3JhcENvbW1lbnQodGhpcy5kZWNvICsgdGhpcy5wYWRkaW5nKCkgKyB0ZXh0ICsgU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLndpZHRoIC0gdGhpcy5yZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KS5sZW5ndGgpICsgdGhpcy5wYWRkaW5nKCkgKyB0aGlzLmRlY28pO1xuICB9XG5cbiAgbGVmdCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28gKyB0aGlzLnBhZGRpbmcoKSk7XG4gIH1cblxuICByaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQodGhpcy5wYWRkaW5nKCkgKyB0aGlzLmRlY28pO1xuICB9XG5cbiAgcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQuY29kZXdhdmUucmVtb3ZlTWFya2Vycyh0aGlzLmNvbnRleHQuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHRleHQpKTtcbiAgfVxuXG4gIHRleHRCb3VuZHModGV4dCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0VHh0U2l6ZSh0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpKTtcbiAgfVxuXG4gIGdldEJveEZvclBvcyhwb3MpIHtcbiAgICB2YXIgY2xvbmUsIGN1ckxlZnQsIGRlcHRoLCBlbmRGaW5kLCBsZWZ0LCBwYWlyLCBwbGFjZWhvbGRlciwgcmVzLCBzdGFydEZpbmQ7XG4gICAgZGVwdGggPSB0aGlzLmdldE5lc3RlZEx2bChwb3Muc3RhcnQpO1xuICAgIGlmIChkZXB0aCA+IDApIHtcbiAgICAgIGxlZnQgPSB0aGlzLmxlZnQoKTtcbiAgICAgIGN1ckxlZnQgPSBTdHJpbmdIZWxwZXIucmVwZWF0KGxlZnQsIGRlcHRoIC0gMSk7XG4gICAgICBjbG9uZSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiO1xuICAgICAgY2xvbmUud2lkdGggPSBwbGFjZWhvbGRlci5sZW5ndGg7XG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IHRoaXMuZGVjbyArIHRoaXMuZGVjbyArIHBsYWNlaG9sZGVyICsgdGhpcy5kZWNvICsgdGhpcy5kZWNvO1xuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKTtcbiAgICAgIGVuZEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuZW5kU2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKTtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcihzdGFydEZpbmQsIGVuZEZpbmQsIHtcbiAgICAgICAgdmFsaWRNYXRjaDogKG1hdGNoKSA9PiB7XG4gICAgICAgICAgdmFyIGY7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2cobWF0Y2gsbGVmdClcbiAgICAgICAgICBmID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KG1hdGNoLnN0YXJ0KCksIFtsZWZ0LCBcIlxcblwiLCBcIlxcclwiXSwgLTEpO1xuICAgICAgICAgIHJldHVybiAoZiA9PSBudWxsKSB8fCBmLnN0ciAhPT0gbGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXMgPSBwYWlyLndyYXBwZXJQb3MocG9zLCB0aGlzLmNvbnRleHQuY29kZXdhdmUuZWRpdG9yLnRleHQoKSk7XG4gICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgcmVzLnN0YXJ0ICs9IGN1ckxlZnQubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE5lc3RlZEx2bChpbmRleCkge1xuICAgIHZhciBkZXB0aCwgZiwgbGVmdDtcbiAgICBkZXB0aCA9IDA7XG4gICAgbGVmdCA9IHRoaXMubGVmdCgpO1xuICAgIHdoaWxlICgoKGYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQoaW5kZXgsIFtsZWZ0LCBcIlxcblwiLCBcIlxcclwiXSwgLTEpKSAhPSBudWxsKSAmJiBmLnN0ciA9PT0gbGVmdCkge1xuICAgICAgaW5kZXggPSBmLnBvcztcbiAgICAgIGRlcHRoKys7XG4gICAgfVxuICAgIHJldHVybiBkZXB0aDtcbiAgfVxuXG4gIGdldE9wdEZyb21MaW5lKGxpbmUsIGdldFBhZCA9IHRydWUpIHtcbiAgICB2YXIgZW5kUG9zLCByRW5kLCByU3RhcnQsIHJlc0VuZCwgcmVzU3RhcnQsIHN0YXJ0UG9zO1xuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28pKSArIFwiKShcXFxccyopXCIpO1xuICAgIHJFbmQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMuZGVjbykpICsgXCIpKFxcbnwkKVwiKTtcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpO1xuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKTtcbiAgICBpZiAoKHJlc1N0YXJ0ICE9IG51bGwpICYmIChyZXNFbmQgIT0gbnVsbCkpIHtcbiAgICAgIGlmIChnZXRQYWQpIHtcbiAgICAgICAgdGhpcy5wYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgsIHJlc0VuZFsxXS5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGg7XG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgdGhpcy5wYWQ7IC8vIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAncmVzU3RhcnQuaW5kZXggKyByZXNTdGFydFsxXS5sZW5ndGggKyByZXNTdGFydFsyXS5sZW5ndGgnIHJlc1N0YXJ0LmVuZCgyKVxuICAgICAgZW5kUG9zID0gcmVzRW5kLmluZGV4ICsgcmVzRW5kWzFdLmxlbmd0aCAtIHRoaXMucGFkOyAvLyBbcGF3YSBweXRob25dIHJlcGxhY2UgJ3Jlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGgnIHJlc0VuZC5zdGFydCgyKVxuICAgICAgdGhpcy53aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlZm9ybWF0TGluZXModGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMubGluZXModGhpcy5yZW1vdmVDb21tZW50KHRleHQsIG9wdGlvbnMpLCBmYWxzZSk7XG4gIH1cblxuICByZW1vdmVDb21tZW50KHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywgZWNsLCBlY3IsIGVkLCBmbGFnLCBvcHQsIHJlMSwgcmUyO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH07XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuZGVjbyk7XG4gICAgICBmbGFnID0gb3B0aW9uc1snbXVsdGlsaW5lJ10gPyAnZ20nIDogJyc7IC8vIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBcIidnbSdcIiByZS5NXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzezAsJHt0aGlzLnBhZH19YCwgZmxhZyk7IC8vIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAje0BwYWR9ICdcIitzdHIoc2VsZi5wYWQpK1wiJ1xuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxcXFxzKiRgLCBmbGFnKTtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmUxLCAnJykucmVwbGFjZShyZTIsICcnKTtcbiAgICB9XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvc0NvbGxlY3Rpb24gfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IG9wdGlvbmFsUHJvbWlzZSB9IGZyb20gJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnO1xuXG5leHBvcnQgY2xhc3MgQ2xvc2luZ1Byb21wXG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlLHNlbGVjdGlvbnMpIC0+XG4gICAgQHRpbWVvdXQgPSBudWxsXG4gICAgQF90eXBlZCA9IG51bGxcbiAgICBAc3RhcnRlZCA9IGZhbHNlXG4gICAgQG5iQ2hhbmdlcyA9IDBcbiAgICBAc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uKHNlbGVjdGlvbnMpXG4gIGJlZ2luOiAtPlxuICAgIEBzdGFydGVkID0gdHJ1ZVxuICAgIG9wdGlvbmFsUHJvbWlzZShAYWRkQ2FycmV0cygpKS50aGVuID0+XG4gICAgICBpZiBAY29kZXdhdmUuZWRpdG9yLmNhbkxpc3RlblRvQ2hhbmdlKClcbiAgICAgICAgQHByb3h5T25DaGFuZ2UgPSAoY2g9bnVsbCk9PiBAb25DaGFuZ2UoY2gpXG4gICAgICAgIEBjb2Rld2F2ZS5lZGl0b3IuYWRkQ2hhbmdlTGlzdGVuZXIoIEBwcm94eU9uQ2hhbmdlIClcbiAgICAgIHJldHVybiB0aGlzXG4gICAgLnJlc3VsdCgpXG4gIGFkZENhcnJldHM6IC0+XG4gICAgQHJlcGxhY2VtZW50cyA9IEBzZWxlY3Rpb25zLndyYXAoXG4gICAgICBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jYXJyZXRDaGFyICsgQGNvZGV3YXZlLmJyYWtldHMgKyBcIlxcblwiLFxuICAgICAgXCJcXG5cIiArIEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjb2Rld2F2ZS5jYXJyZXRDaGFyICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICApLm1hcCggKHApIC0+IHAuY2FycmV0VG9TZWwoKSApXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhAcmVwbGFjZW1lbnRzKVxuICBpbnZhbGlkVHlwZWQ6IC0+XG4gICAgQF90eXBlZCA9IG51bGxcbiAgb25DaGFuZ2U6IChjaCA9IG51bGwpLT5cbiAgICBAaW52YWxpZFR5cGVkKClcbiAgICBpZiBAc2tpcEV2ZW50KGNoKVxuICAgICAgcmV0dXJuXG4gICAgQG5iQ2hhbmdlcysrXG4gICAgaWYgQHNob3VsZFN0b3AoKVxuICAgICAgQHN0b3AoKVxuICAgICAgQGNsZWFuQ2xvc2UoKVxuICAgIGVsc2VcbiAgICAgIEByZXN1bWUoKVxuICAgICAgXG4gIHNraXBFdmVudDogKGNoKSAtPlxuICAgIHJldHVybiBjaD8gYW5kIGNoLmNoYXJDb2RlQXQoMCkgIT0gMzJcbiAgXG4gIHJlc3VtZTogLT5cbiAgICAjXG4gICAgXG4gIHNob3VsZFN0b3A6IC0+XG4gICAgcmV0dXJuIEB0eXBlZCgpID09IGZhbHNlIG9yIEB0eXBlZCgpLmluZGV4T2YoJyAnKSAhPSAtMVxuICBcbiAgY2xlYW5DbG9zZTogLT5cbiAgICByZXBsYWNlbWVudHMgPSBbXVxuICAgIHNlbGVjdGlvbnMgPSBAZ2V0U2VsZWN0aW9ucygpXG4gICAgZm9yIHNlbCBpbiBzZWxlY3Rpb25zXG4gICAgICBpZiBwb3MgPSBAd2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgICBzdGFydCA9IHNlbFxuICAgICAgZWxzZSBpZiAoZW5kID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSBhbmQgc3RhcnQ/XG4gICAgICAgIHJlcyA9IGVuZC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLmlubmVyVGV4dCgpLnNwbGl0KCcgJylbMF1cbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChlbmQuaW5uZXJTdGFydCxlbmQuaW5uZXJFbmQscmVzKVxuICAgICAgICByZXBsLnNlbGVjdGlvbnMgPSBbc3RhcnRdXG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKHJlcGwpXG4gICAgICAgIHN0YXJ0ID0gbnVsbFxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICBnZXRTZWxlY3Rpb25zOiAtPlxuICAgIHJldHVybiBAY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKClcbiAgc3RvcDogLT5cbiAgICBAc3RhcnRlZCA9IGZhbHNlXG4gICAgY2xlYXJUaW1lb3V0KEB0aW1lb3V0KSBpZiBAdGltZW91dD9cbiAgICBAY29kZXdhdmUuY2xvc2luZ1Byb21wID0gbnVsbCBpZiBAY29kZXdhdmUuY2xvc2luZ1Byb21wID09IHRoaXNcbiAgICBpZiBAcHJveHlPbkNoYW5nZT9cbiAgICAgIEBjb2Rld2F2ZS5lZGl0b3IucmVtb3ZlQ2hhbmdlTGlzdGVuZXIoQHByb3h5T25DaGFuZ2UpXG4gIGNhbmNlbDogLT5cbiAgICBpZiBAdHlwZWQoKSAhPSBmYWxzZVxuICAgICAgQGNhbmNlbFNlbGVjdGlvbnMoQGdldFNlbGVjdGlvbnMoKSlcbiAgICBAc3RvcCgpXG4gIGNhbmNlbFNlbGVjdGlvbnM6IChzZWxlY3Rpb25zKSAtPlxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc3RhcnQgPSBudWxsXG4gICAgZm9yIHNlbCBpbiBzZWxlY3Rpb25zXG4gICAgICBpZiBwb3MgPSBAd2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgICBzdGFydCA9IHBvc1xuICAgICAgZWxzZSBpZiAoZW5kID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSBhbmQgc3RhcnQ/XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ldyBSZXBsYWNlbWVudChzdGFydC5zdGFydCxlbmQuZW5kLEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihzdGFydC5lbmQrMSwgZW5kLnN0YXJ0LTEpKS5zZWxlY3RDb250ZW50KCkpXG4gICAgICAgIHN0YXJ0ID0gbnVsbFxuICAgIEBjb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB0eXBlZDogLT5cbiAgICB1bmxlc3MgQF90eXBlZD9cbiAgICAgIGNwb3MgPSBAY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpXG4gICAgICBpbm5lclN0YXJ0ID0gQHJlcGxhY2VtZW50c1swXS5zdGFydCArIEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aFxuICAgICAgaWYgQGNvZGV3YXZlLmZpbmRQcmV2QnJha2V0KGNwb3Muc3RhcnQpID09IEByZXBsYWNlbWVudHNbMF0uc3RhcnQgYW5kIChpbm5lckVuZCA9IEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChpbm5lclN0YXJ0KSk/IGFuZCBpbm5lckVuZCA+PSBjcG9zLmVuZFxuICAgICAgICBAX3R5cGVkID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGlubmVyU3RhcnQsIGlubmVyRW5kKVxuICAgICAgZWxzZVxuICAgICAgICBAX3R5cGVkID0gZmFsc2VcbiAgICByZXR1cm4gQF90eXBlZFxuICB3aGl0aGluT3BlbkJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAc3RhcnRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQHR5cGVkKCkgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgICAgaWYgdGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT0gdGFyZ2V0VGV4dFxuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG4gIHdoaXRoaW5DbG9zZUJvdW5kczogKHBvcykgLT5cbiAgICBmb3IgcmVwbCwgaSBpbiBAcmVwbGFjZW1lbnRzXG4gICAgICB0YXJnZXRQb3MgPSBAZW5kUG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAdHlwZWQoKSArIEBjb2Rld2F2ZS5icmFrZXRzXG4gICAgICBpZiB0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PSB0YXJnZXRUZXh0XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICByZXR1cm4gZmFsc2VcbiAgc3RhcnRQb3NBdDogKGluZGV4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zKFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLnN0YXJ0ICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIpLFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsxKVxuICAgICAgKS53cmFwcGVkQnkoQGNvZGV3YXZlLmJyYWtldHMsIEBjb2Rld2F2ZS5icmFrZXRzKVxuICBlbmRQb3NBdDogKGluZGV4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zKFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgQHR5cGVkKCkubGVuZ3RoICogKGluZGV4KjIgKzEpLFxuICAgICAgICBAcmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLmVuZCArIEB0eXBlZCgpLmxlbmd0aCAqIChpbmRleCoyICsyKVxuICAgICAgKS53cmFwcGVkQnkoQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyLCBAY29kZXdhdmUuYnJha2V0cylcblxuZXhwb3J0IGNsYXNzIFNpbXVsYXRlZENsb3NpbmdQcm9tcCBleHRlbmRzIENsb3NpbmdQcm9tcFxuICByZXN1bWU6IC0+XG4gICAgQHNpbXVsYXRlVHlwZSgpXG4gIHNpbXVsYXRlVHlwZTogLT5cbiAgICBjbGVhclRpbWVvdXQoQHRpbWVvdXQpIGlmIEB0aW1lb3V0P1xuICAgIEB0aW1lb3V0ID0gc2V0VGltZW91dCAoPT5cbiAgICAgIEBpbnZhbGlkVHlwZWQoKVxuICAgICAgdGFyZ2V0VGV4dCA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEB0eXBlZCgpICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGN1ckNsb3NlID0gQHdoaXRoaW5DbG9zZUJvdW5kcyhAcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0uY29weSgpLmFwcGx5T2Zmc2V0KEB0eXBlZCgpLmxlbmd0aCkpXG4gICAgICBpZiBjdXJDbG9zZVxuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LGN1ckNsb3NlLmVuZCx0YXJnZXRUZXh0KVxuICAgICAgICBpZiByZXBsLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KClcbiAgICAgICAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKFtyZXBsXSlcbiAgICAgIGVsc2VcbiAgICAgICAgQHN0b3AoKVxuICAgICAgQG9uVHlwZVNpbXVsYXRlZCgpIGlmIEBvblR5cGVTaW11bGF0ZWQ/XG4gICAgKSwgMlxuICBza2lwRXZlbnQ6IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldFNlbGVjdGlvbnM6IC0+XG4gICAgcmV0dXJuIFtcbiAgICAgICAgQGNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKVxuICAgICAgICBAcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0gKyBAdHlwZWQoKS5sZW5ndGhcbiAgICAgIF1cbiAgd2hpdGhpbkNsb3NlQm91bmRzOiAocG9zKSAtPlxuICAgIGZvciByZXBsLCBpIGluIEByZXBsYWNlbWVudHNcbiAgICAgIHRhcmdldFBvcyA9IEBlbmRQb3NBdChpKVxuICAgICAgbmV4dCA9IEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldCh0YXJnZXRQb3MuaW5uZXJTdGFydClcbiAgICAgIGlmIG5leHQ/XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpXG4gICAgICAgIGlmIHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgcmV0dXJuIGZhbHNlXG5cbkNsb3NpbmdQcm9tcC5uZXdGb3IgPSAoY29kZXdhdmUsc2VsZWN0aW9ucykgLT5cbiAgaWYgY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLHNlbGVjdGlvbnMpXG4gIGVsc2VcbiAgICByZXR1cm4gbmV3IFNpbXVsYXRlZENsb3NpbmdQcm9tcChjb2Rld2F2ZSxzZWxlY3Rpb25zKSIsImltcG9ydCB7XG4gIFBvc0NvbGxlY3Rpb25cbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIG9wdGlvbmFsUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IHZhciBDbG9zaW5nUHJvbXAgPSBjbGFzcyBDbG9zaW5nUHJvbXAge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZTEsIHNlbGVjdGlvbnMpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmUxO1xuICAgIHRoaXMudGltZW91dCA9IG51bGw7XG4gICAgdGhpcy5fdHlwZWQgPSBudWxsO1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMubmJDaGFuZ2VzID0gMDtcbiAgICB0aGlzLnNlbGVjdGlvbnMgPSBuZXcgUG9zQ29sbGVjdGlvbihzZWxlY3Rpb25zKTtcbiAgfVxuXG4gIGJlZ2luKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgcmV0dXJuIG9wdGlvbmFsUHJvbWlzZSh0aGlzLmFkZENhcnJldHMoKSkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKSkge1xuICAgICAgICB0aGlzLnByb3h5T25DaGFuZ2UgPSAoY2ggPSBudWxsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25DaGFuZ2UoY2gpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkucmVzdWx0KCk7XG4gIH1cblxuICBhZGRDYXJyZXRzKCkge1xuICAgIHRoaXMucmVwbGFjZW1lbnRzID0gdGhpcy5zZWxlY3Rpb25zLndyYXAodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgXCJcXG5cIiwgXCJcXG5cIiArIHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKS5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHAuY2FycmV0VG9TZWwoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHModGhpcy5yZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgaW52YWxpZFR5cGVkKCkge1xuICAgIHJldHVybiB0aGlzLl90eXBlZCA9IG51bGw7XG4gIH1cblxuICBvbkNoYW5nZShjaCA9IG51bGwpIHtcbiAgICB0aGlzLmludmFsaWRUeXBlZCgpO1xuICAgIGlmICh0aGlzLnNraXBFdmVudChjaCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5uYkNoYW5nZXMrKztcbiAgICBpZiAodGhpcy5zaG91bGRTdG9wKCkpIHtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYW5DbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bWUoKTtcbiAgICB9XG4gIH1cblxuICBza2lwRXZlbnQoY2gpIHtcbiAgICByZXR1cm4gKGNoICE9IG51bGwpICYmIGNoLmNoYXJDb2RlQXQoMCkgIT09IDMyO1xuICB9XG5cbiAgcmVzdW1lKCkge31cblxuICBcbiAgc2hvdWxkU3RvcCgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlZCgpID09PSBmYWxzZSB8fCB0aGlzLnR5cGVkKCkuaW5kZXhPZignICcpICE9PSAtMTtcbiAgfVxuXG4gIGNsZWFuQ2xvc2UoKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCBwb3MsIHJlcGwsIHJlcGxhY2VtZW50cywgcmVzLCBzZWwsIHNlbGVjdGlvbnMsIHN0YXJ0O1xuICAgIHJlcGxhY2VtZW50cyA9IFtdO1xuICAgIHNlbGVjdGlvbnMgPSB0aGlzLmdldFNlbGVjdGlvbnMoKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdO1xuICAgICAgaWYgKHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKSkge1xuICAgICAgICBzdGFydCA9IHNlbDtcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIChzdGFydCAhPSBudWxsKSkge1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXTtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChlbmQuaW5uZXJTdGFydCwgZW5kLmlubmVyRW5kLCByZXMpO1xuICAgICAgICByZXBsLnNlbGVjdGlvbnMgPSBbc3RhcnRdO1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKTtcbiAgICAgICAgc3RhcnQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9PT0gdGhpcykge1xuICAgICAgdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm94eU9uQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy50eXBlZCgpICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jYW5jZWxTZWxlY3Rpb25zKHRoaXMuZ2V0U2VsZWN0aW9ucygpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgY2FuY2VsU2VsZWN0aW9ucyhzZWxlY3Rpb25zKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCBwb3MsIHJlcGxhY2VtZW50cywgc2VsLCBzdGFydDtcbiAgICByZXBsYWNlbWVudHMgPSBbXTtcbiAgICBzdGFydCA9IG51bGw7XG4gICAgZm9yIChqID0gMCwgbGVuID0gc2VsZWN0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgc2VsID0gc2VsZWN0aW9uc1tqXTtcbiAgICAgIGlmIChwb3MgPSB0aGlzLndoaXRoaW5PcGVuQm91bmRzKHNlbCkpIHtcbiAgICAgICAgc3RhcnQgPSBwb3M7XG4gICAgICB9IGVsc2UgaWYgKChlbmQgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSAmJiAoc3RhcnQgIT0gbnVsbCkpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3IFJlcGxhY2VtZW50KHN0YXJ0LnN0YXJ0LCBlbmQuZW5kLCB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHN0YXJ0LmVuZCArIDEsIGVuZC5zdGFydCAtIDEpKS5zZWxlY3RDb250ZW50KCkpO1xuICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgdHlwZWQoKSB7XG4gICAgdmFyIGNwb3MsIGlubmVyRW5kLCBpbm5lclN0YXJ0O1xuICAgIGlmICh0aGlzLl90eXBlZCA9PSBudWxsKSB7XG4gICAgICBjcG9zID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCk7XG4gICAgICBpbm5lclN0YXJ0ID0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoO1xuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuZmluZFByZXZCcmFrZXQoY3Bvcy5zdGFydCkgPT09IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICYmICgoaW5uZXJFbmQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGlubmVyU3RhcnQpKSAhPSBudWxsKSAmJiBpbm5lckVuZCA+PSBjcG9zLmVuZCkge1xuICAgICAgICB0aGlzLl90eXBlZCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdHlwZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkO1xuICB9XG5cbiAgd2hpdGhpbk9wZW5Cb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHQ7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV07XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLnN0YXJ0UG9zQXQoaSk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB3aGl0aGluQ2xvc2VCb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHQ7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV07XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLmVuZFBvc0F0KGkpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGFydFBvc0F0KGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSkpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMsIHRoaXMuY29kZXdhdmUuYnJha2V0cyk7XG4gIH1cblxuICBlbmRQb3NBdChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAyKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLCB0aGlzLmNvZGV3YXZlLmJyYWtldHMpO1xuICB9XG5cbn07XG5cbmV4cG9ydCB2YXIgU2ltdWxhdGVkQ2xvc2luZ1Byb21wID0gY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wIHtcbiAgcmVzdW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNpbXVsYXRlVHlwZSgpO1xuICB9XG5cbiAgc2ltdWxhdGVUeXBlKCkge1xuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgoKSA9PiB7XG4gICAgICB2YXIgY3VyQ2xvc2UsIHJlcGwsIHRhcmdldFRleHQ7XG4gICAgICB0aGlzLmludmFsaWRUeXBlZCgpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgY3VyQ2xvc2UgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyh0aGlzLnJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdLmNvcHkoKS5hcHBseU9mZnNldCh0aGlzLnR5cGVkKCkubGVuZ3RoKSk7XG4gICAgICBpZiAoY3VyQ2xvc2UpIHtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChjdXJDbG9zZS5zdGFydCwgY3VyQ2xvc2UuZW5kLCB0YXJnZXRUZXh0KTtcbiAgICAgICAgaWYgKHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KCkpIHtcbiAgICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uVHlwZVNpbXVsYXRlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uVHlwZVNpbXVsYXRlZCgpO1xuICAgICAgfVxuICAgIH0pLCAyKTtcbiAgfVxuXG4gIHNraXBFdmVudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRTZWxlY3Rpb25zKCkge1xuICAgIHJldHVybiBbdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCksIHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0gKyB0aGlzLnR5cGVkKCkubGVuZ3RoXTtcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXh0LCByZWYsIHJlcGwsIHRhcmdldFBvcztcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSk7XG4gICAgICBuZXh0ID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldCh0YXJnZXRQb3MuaW5uZXJTdGFydCk7XG4gICAgICBpZiAobmV4dCAhPSBudWxsKSB7XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpO1xuICAgICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSkge1xuICAgICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG5cbkNsb3NpbmdQcm9tcC5uZXdGb3IgPSBmdW5jdGlvbihjb2Rld2F2ZSwgc2VsZWN0aW9ucykge1xuICBpZiAoY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFNpbXVsYXRlZENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucyk7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBDbWRGaW5kZXJcbiAgY29uc3RydWN0b3I6IChuYW1lcywgb3B0aW9ucykgLT5cbiAgICBpZiB0eXBlb2YgbmFtZXMgPT0gJ3N0cmluZydcbiAgICAgIG5hbWVzID0gW25hbWVzXVxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsXG4gICAgICBuYW1lc3BhY2VzOiBbXVxuICAgICAgcGFyZW50Q29udGV4dDogbnVsbFxuICAgICAgY29udGV4dDogbnVsbFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzXG4gICAgICBtdXN0RXhlY3V0ZTogdHJ1ZVxuICAgICAgdXNlRGV0ZWN0b3JzOiB0cnVlXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWVcbiAgICAgIGluc3RhbmNlOiBudWxsXG4gICAgICBjb2Rld2F2ZTogbnVsbFxuICAgIH1cbiAgICBAbmFtZXMgPSBuYW1lc1xuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoQGNvZGV3YXZlKVxuICAgIGlmIEBwYXJlbnRDb250ZXh0P1xuICAgICAgQGNvbnRleHQucGFyZW50ID0gQHBhcmVudENvbnRleHRcbiAgICBpZiBAbmFtZXNwYWNlcz9cbiAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMoQG5hbWVzcGFjZXMpXG4gIGZpbmQ6IC0+XG4gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAgIEBjbWQgPSBAZmluZEluKEByb290KVxuICAgIHJldHVybiBAY21kXG4jICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4jICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiMgICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4jICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzOiAtPlxuICAgIHBhdGhzID0ge31cbiAgICBmb3IgbmFtZSBpbiBAbmFtZXMgXG4gICAgICBbc3BhY2UscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgc3BhY2U/IGFuZCAhKHNwYWNlIGluIEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgICAgdW5sZXNzIHNwYWNlIG9mIHBhdGhzIFxuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpXG4gICAgcmV0dXJuIHBhdGhzXG4gIGFwcGx5U3BhY2VPbk5hbWVzOiAobmFtZXNwYWNlKSAtPlxuICAgIFtzcGFjZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSx0cnVlKVxuICAgIEBuYW1lcy5tYXAoIChuYW1lKSAtPlxuICAgICAgW2N1cl9zcGFjZSxjdXJfcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuICAgICAgaWYgY3VyX3NwYWNlPyBhbmQgY3VyX3NwYWNlID09IHNwYWNlXG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdFxuICAgICAgaWYgcmVzdD9cbiAgICAgICAgbmFtZSA9IHJlc3QgKyAnOicgKyBuYW1lXG4gICAgICByZXR1cm4gbmFtZVxuICAgIClcbiAgZ2V0RGlyZWN0TmFtZXM6IC0+XG4gICAgcmV0dXJuIChuIGZvciBuIGluIEBuYW1lcyB3aGVuIG4uaW5kZXhPZihcIjpcIikgPT0gLTEpXG4gIHRyaWdnZXJEZXRlY3RvcnM6IC0+XG4gICAgaWYgQHVzZURldGVjdG9ycyBcbiAgICAgIEB1c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcG9zaWJpbGl0aWVzID0gbmV3IENtZEZpbmRlcihAY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKVxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoXG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXVxuICAgICAgICBmb3IgZGV0ZWN0b3IgaW4gY21kLmRldGVjdG9ycyBcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcylcbiAgICAgICAgICBpZiByZXM/XG4gICAgICAgICAgICBAY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcylcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICAgICAgaSsrXG4gIGZpbmRJbjogKGNtZCxwYXRoID0gbnVsbCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIG51bGxcbiAgICBiZXN0ID0gQGJlc3RJblBvc2liaWxpdGllcyhAZmluZFBvc2liaWxpdGllcygpKVxuICAgIGlmIGJlc3Q/XG4gICAgICByZXR1cm4gYmVzdFxuICBmaW5kUG9zaWJpbGl0aWVzOiAtPlxuICAgIHVubGVzcyBAcm9vdD9cbiAgICAgIHJldHVybiBbXVxuICAgIEByb290LmluaXQoKVxuICAgIHBvc2liaWxpdGllcyA9IFtdXG4gICAgZm9yIHNwYWNlLCBuYW1lcyBvZiBAZ2V0TmFtZXNXaXRoUGF0aHMoKVxuICAgICAgbmV4dHMgPSBAZ2V0Q21kRm9sbG93QWxpYXMoc3BhY2UpXG4gICAgICBmb3IgbmV4dCBpbiBuZXh0c1xuICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgZm9yIG5zcGMgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICBbbnNwY05hbWUscmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLHRydWUpXG4gICAgICBuZXh0cyA9IEBnZXRDbWRGb2xsb3dBbGlhcyhuc3BjTmFtZSlcbiAgICAgIGZvciBuZXh0IGluIG5leHRzXG4gICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihAYXBwbHlTcGFjZU9uTmFtZXMobnNwYyksIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgZm9yIG5hbWUgaW4gQGdldERpcmVjdE5hbWVzKClcbiAgICAgIGRpcmVjdCA9IEByb290LmdldENtZChuYW1lKVxuICAgICAgaWYgQGNtZElzVmFsaWQoZGlyZWN0KVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpXG4gICAgaWYgQHVzZUZhbGxiYWNrc1xuICAgICAgZmFsbGJhY2sgPSBAcm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJylcbiAgICAgIGlmIEBjbWRJc1ZhbGlkKGZhbGxiYWNrKVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjaylcbiAgICBAcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzXG4gICAgcmV0dXJuIHBvc2liaWxpdGllc1xuICBnZXRDbWRGb2xsb3dBbGlhczogKG5hbWUpIC0+XG4gICAgY21kID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgaWYgY21kPyBcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5hbGlhc09mP1xuICAgICAgICByZXR1cm4gW2NtZCxjbWQuZ2V0QWxpYXNlZCgpXVxuICAgICAgcmV0dXJuIFtjbWRdXG4gICAgcmV0dXJuIFtjbWRdXG4gIGNtZElzVmFsaWQ6IChjbWQpIC0+XG4gICAgdW5sZXNzIGNtZD9cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIGNtZC5uYW1lICE9ICdmYWxsYmFjaycgJiYgY21kIGluIEBhbmNlc3RvcnMoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuICFAbXVzdEV4ZWN1dGUgb3IgQGNtZElzRXhlY3V0YWJsZShjbWQpXG4gIGFuY2VzdG9yczogLT5cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGNtZElzRXhlY3V0YWJsZTogKGNtZCkgLT5cbiAgICBuYW1lcyA9IEBnZXREaXJlY3ROYW1lcygpXG4gICAgaWYgbmFtZXMubGVuZ3RoID09IDFcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gIGNtZFNjb3JlOiAoY21kKSAtPlxuICAgIHNjb3JlID0gY21kLmRlcHRoXG4gICAgaWYgY21kLm5hbWUgPT0gJ2ZhbGxiYWNrJyBcbiAgICAgICAgc2NvcmUgLT0gMTAwMFxuICAgIHJldHVybiBzY29yZVxuICBiZXN0SW5Qb3NpYmlsaXRpZXM6IChwb3NzKSAtPlxuICAgIGlmIHBvc3MubGVuZ3RoID4gMFxuICAgICAgYmVzdCA9IG51bGxcbiAgICAgIGJlc3RTY29yZSA9IG51bGxcbiAgICAgIGZvciBwIGluIHBvc3NcbiAgICAgICAgc2NvcmUgPSBAY21kU2NvcmUocClcbiAgICAgICAgaWYgIWJlc3Q/IG9yIHNjb3JlID49IGJlc3RTY29yZVxuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlXG4gICAgICAgICAgYmVzdCA9IHBcbiAgICAgIHJldHVybiBiZXN0OyIsInZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcblxuaW1wb3J0IHtcbiAgQ29udGV4dFxufSBmcm9tICcuL0NvbnRleHQnO1xuXG5pbXBvcnQge1xuICBOYW1lc3BhY2VIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBDbWRGaW5kZXIgPSBjbGFzcyBDbWRGaW5kZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lcywgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXTtcbiAgICB9XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICBuYW1lc3BhY2VzOiBbXSxcbiAgICAgIHBhcmVudENvbnRleHQ6IG51bGwsXG4gICAgICBjb250ZXh0OiBudWxsLFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzLFxuICAgICAgbXVzdEV4ZWN1dGU6IHRydWUsXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWUsXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWUsXG4gICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfTtcbiAgICB0aGlzLm5hbWVzID0gbmFtZXM7XG4gICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2UgaWYgKCh0aGlzLnBhcmVudCAhPSBudWxsKSAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcy5jb2Rld2F2ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmVudENvbnRleHQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMucGFyZW50Q29udGV4dDtcbiAgICB9XG4gICAgaWYgKHRoaXMubmFtZXNwYWNlcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyh0aGlzLm5hbWVzcGFjZXMpO1xuICAgIH1cbiAgfVxuXG4gIGZpbmQoKSB7XG4gICAgdGhpcy50cmlnZ2VyRGV0ZWN0b3JzKCk7XG4gICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRJbih0aGlzLnJvb3QpO1xuICAgIHJldHVybiB0aGlzLmNtZDtcbiAgfVxuXG4gIC8vICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4gIC8vICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiAgLy8gICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4gIC8vICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzKCkge1xuICAgIHZhciBqLCBsZW4sIG5hbWUsIHBhdGhzLCByZWYsIHJlc3QsIHNwYWNlO1xuICAgIHBhdGhzID0ge307XG4gICAgcmVmID0gdGhpcy5uYW1lcztcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5hbWUgPSByZWZbal07XG4gICAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG4gICAgICBpZiAoKHNwYWNlICE9IG51bGwpICYmICEoaW5kZXhPZi5jYWxsKHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHNwYWNlKSA+PSAwKSkge1xuICAgICAgICBpZiAoIShzcGFjZSBpbiBwYXRocykpIHtcbiAgICAgICAgICBwYXRoc1tzcGFjZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBwYXRoc1tzcGFjZV0ucHVzaChyZXN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGhzO1xuICB9XG5cbiAgYXBwbHlTcGFjZU9uTmFtZXMobmFtZXNwYWNlKSB7XG4gICAgdmFyIHJlc3QsIHNwYWNlO1xuICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lc3BhY2UsIHRydWUpO1xuICAgIHJldHVybiB0aGlzLm5hbWVzLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgY3VyX3Jlc3QsIGN1cl9zcGFjZTtcbiAgICAgIFtjdXJfc3BhY2UsIGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpO1xuICAgICAgaWYgKChjdXJfc3BhY2UgIT0gbnVsbCkgJiYgY3VyX3NwYWNlID09PSBzcGFjZSkge1xuICAgICAgICBuYW1lID0gY3VyX3Jlc3Q7XG4gICAgICB9XG4gICAgICBpZiAocmVzdCAhPSBudWxsKSB7XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RGlyZWN0TmFtZXMoKSB7XG4gICAgdmFyIG47XG4gICAgcmV0dXJuIChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgIHJlZiA9IHRoaXMubmFtZXM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgbiA9IHJlZltqXTtcbiAgICAgICAgaWYgKG4uaW5kZXhPZihcIjpcIikgPT09IC0xKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9KS5jYWxsKHRoaXMpO1xuICB9XG5cbiAgdHJpZ2dlckRldGVjdG9ycygpIHtcbiAgICB2YXIgY21kLCBkZXRlY3RvciwgaSwgaiwgbGVuLCBwb3NpYmlsaXRpZXMsIHJlZiwgcmVzLCByZXN1bHRzO1xuICAgIGlmICh0aGlzLnVzZURldGVjdG9ycykge1xuICAgICAgdGhpcy51c2VEZXRlY3RvcnMgPSBmYWxzZTtcbiAgICAgIHBvc2liaWxpdGllcyA9IG5ldyBDbWRGaW5kZXIodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpO1xuICAgICAgaSA9IDA7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICB3aGlsZSAoaSA8IHBvc2liaWxpdGllcy5sZW5ndGgpIHtcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldO1xuICAgICAgICByZWYgPSBjbWQuZGV0ZWN0b3JzO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICBkZXRlY3RvciA9IHJlZltqXTtcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcyk7XG4gICAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyhyZXMpO1xuICAgICAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKHJlcywge1xuICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0cy5wdXNoKGkrKyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICBmaW5kSW4oY21kLCBwYXRoID0gbnVsbCkge1xuICAgIHZhciBiZXN0O1xuICAgIGlmIChjbWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGJlc3QgPSB0aGlzLmJlc3RJblBvc2liaWxpdGllcyh0aGlzLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgaWYgKGJlc3QgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgfVxuICB9XG5cbiAgZmluZFBvc2liaWxpdGllcygpIHtcbiAgICB2YXIgZGlyZWN0LCBmYWxsYmFjaywgaiwgaywgbCwgbGVuLCBsZW4xLCBsZW4yLCBsZW4zLCBtLCBuYW1lLCBuYW1lcywgbmV4dCwgbmV4dHMsIG5zcGMsIG5zcGNOYW1lLCBwb3NpYmlsaXRpZXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVzdCwgc3BhY2U7XG4gICAgaWYgKHRoaXMucm9vdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHRoaXMucm9vdC5pbml0KCk7XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG4gICAgcmVmID0gdGhpcy5nZXROYW1lc1dpdGhQYXRocygpO1xuICAgIGZvciAoc3BhY2UgaW4gcmVmKSB7XG4gICAgICBuYW1lcyA9IHJlZltzcGFjZV07XG4gICAgICBuZXh0cyA9IHRoaXMuZ2V0Q21kRm9sbG93QWxpYXMoc3BhY2UpO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gbmV4dHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgbmV4dCA9IG5leHRzW2pdO1xuICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcm9vdDogbmV4dFxuICAgICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZWYxID0gdGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKTtcbiAgICBmb3IgKGsgPSAwLCBsZW4xID0gcmVmMS5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgIG5zcGMgPSByZWYxW2tdO1xuICAgICAgW25zcGNOYW1lLCByZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsIHRydWUpO1xuICAgICAgbmV4dHMgPSB0aGlzLmdldENtZEZvbGxvd0FsaWFzKG5zcGNOYW1lKTtcbiAgICAgIGZvciAobCA9IDAsIGxlbjIgPSBuZXh0cy5sZW5ndGg7IGwgPCBsZW4yOyBsKyspIHtcbiAgICAgICAgbmV4dCA9IG5leHRzW2xdO1xuICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIodGhpcy5hcHBseVNwYWNlT25OYW1lcyhuc3BjKSwge1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByb290OiBuZXh0XG4gICAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlZjIgPSB0aGlzLmdldERpcmVjdE5hbWVzKCk7XG4gICAgZm9yIChtID0gMCwgbGVuMyA9IHJlZjIubGVuZ3RoOyBtIDwgbGVuMzsgbSsrKSB7XG4gICAgICBuYW1lID0gcmVmMlttXTtcbiAgICAgIGRpcmVjdCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSk7XG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGRpcmVjdCkpIHtcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZGlyZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMudXNlRmFsbGJhY2tzKSB7XG4gICAgICBmYWxsYmFjayA9IHRoaXMucm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJyk7XG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGZhbGxiYWNrKSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjayk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzO1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXM7XG4gIH1cblxuICBnZXRDbWRGb2xsb3dBbGlhcyhuYW1lKSB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbY21kLCBjbWQuZ2V0QWxpYXNlZCgpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbY21kXTtcbiAgICB9XG4gICAgcmV0dXJuIFtjbWRdO1xuICB9XG5cbiAgY21kSXNWYWxpZChjbWQpIHtcbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGNtZC5uYW1lICE9PSAnZmFsbGJhY2snICYmIGluZGV4T2YuY2FsbCh0aGlzLmFuY2VzdG9ycygpLCBjbWQpID49IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLm11c3RFeGVjdXRlIHx8IHRoaXMuY21kSXNFeGVjdXRhYmxlKGNtZCk7XG4gIH1cblxuICBhbmNlc3RvcnMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gcmVmLmluSW5zdGFuY2UgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjbWRJc0V4ZWN1dGFibGUoY21kKSB7XG4gICAgdmFyIG5hbWVzO1xuICAgIG5hbWVzID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgfVxuICB9XG5cbiAgY21kU2NvcmUoY21kKSB7XG4gICAgdmFyIHNjb3JlO1xuICAgIHNjb3JlID0gY21kLmRlcHRoO1xuICAgIGlmIChjbWQubmFtZSA9PT0gJ2ZhbGxiYWNrJykge1xuICAgICAgc2NvcmUgLT0gMTAwMDtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3JlO1xuICB9XG5cbiAgYmVzdEluUG9zaWJpbGl0aWVzKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlO1xuICAgIGlmIChwb3NzLmxlbmd0aCA+IDApIHtcbiAgICAgIGJlc3QgPSBudWxsO1xuICAgICAgYmVzdFNjb3JlID0gbnVsbDtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHBvc3MubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHBvc3Nbal07XG4gICAgICAgIHNjb3JlID0gdGhpcy5jbWRTY29yZShwKTtcbiAgICAgICAgaWYgKChiZXN0ID09IG51bGwpIHx8IHNjb3JlID49IGJlc3RTY29yZSkge1xuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlO1xuICAgICAgICAgIGJlc3QgPSBwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxufTtcbiIsIiMgW3Bhd2FdXG4jICAgcmVwbGFjZSAncmVwbGFjZSgvXFx0L2cnICdyZXBsYWNlKFwiXFx0XCInXG5cbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBDbWRJbnN0YW5jZVxuICBjb25zdHJ1Y3RvcjogKEBjbWQsQGNvbnRleHQpIC0+XG4gIFxuICBpbml0OiAtPlxuICAgIHVubGVzcyBAaXNFbXB0eSgpIG9yIEBpbml0ZWRcbiAgICAgIEBpbml0ZWQgPSB0cnVlXG4gICAgICBAX2dldENtZE9iaigpXG4gICAgICBAX2luaXRQYXJhbXMoKVxuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgQGNtZE9iai5pbml0KClcbiAgICByZXR1cm4gdGhpc1xuICBzZXRQYXJhbToobmFtZSx2YWwpLT5cbiAgICBAbmFtZWRbbmFtZV0gPSB2YWxcbiAgcHVzaFBhcmFtOih2YWwpLT5cbiAgICBAcGFyYW1zLnB1c2godmFsKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgIHJldHVybiBAY29udGV4dCBvciBuZXcgQ29udGV4dCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUpLT5cbiAgICBmaW5kZXIgPSBAZ2V0Q29udGV4dCgpLmdldEZpbmRlcihjbWROYW1lLEBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRDbWRPYmo6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIEBjbWQuaW5pdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5jbHM/XG4gICAgICAgIEBjbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKVxuICAgICAgICByZXR1cm4gQGNtZE9ialxuICBfaW5pdFBhcmFtczogLT5cbiAgICBAbmFtZWQgPSBAZ2V0RGVmYXVsdHMoKVxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICByZXR1cm4gW11cbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQGNtZD9cbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIHJldHVybiBAY21kLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJlcyA9IHt9XG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGNtZC5kZWZhdWx0cylcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBjbWRPYmouZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJldHVybiByZXNcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIHJldHVybiBAYWxpYXNlZENtZCBvciBudWxsXG4gIGdldEFsaWFzZWRGaW5hbDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGFsaWFzZWRGaW5hbENtZD9cbiAgICAgICAgcmV0dXJuIEBhbGlhc2VkRmluYWxDbWQgb3IgbnVsbFxuICAgICAgaWYgQGNtZC5hbGlhc09mP1xuICAgICAgICBhbGlhc2VkID0gQGNtZFxuICAgICAgICB3aGlsZSBhbGlhc2VkPyBhbmQgYWxpYXNlZC5hbGlhc09mP1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcihAZ2V0RmluZGVyKEBhbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG4gICAgICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICAgICAgQGFsaWFzZWRDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIEBhbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIHJldHVybiBhbGlhc2VkXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBhbGlhc09mXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPcHRpb25zP1xuICAgICAgICByZXR1cm4gQGNtZE9wdGlvbnNcbiAgICAgIG9wdCA9IEBjbWQuX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxAY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIEBjbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIG9wdGlvbnM/IGFuZCBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBnZXRQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIG5hbWVzID0gW25hbWVzXSBpZiAodHlwZW9mIG5hbWVzIGluIFsnc3RyaW5nJywnbnVtYmVyJ10pXG4gICAgZm9yIG4gaW4gbmFtZXNcbiAgICAgIHJldHVybiBAbmFtZWRbbl0gaWYgQG5hbWVkW25dP1xuICAgICAgcmV0dXJuIEBwYXJhbXNbbl0gaWYgQHBhcmFtc1tuXT9cbiAgICByZXR1cm4gZGVmVmFsXG4gIGFuY2VzdG9yQ21kczogLT5cbiAgICBpZiBAY29udGV4dC5jb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKVxuICAgIHJldHVybiBbXVxuICBhbmNlc3RvckNtZHNBbmRTZWxmOiAtPlxuICAgIHJldHVybiBAYW5jZXN0b3JDbWRzKCkuY29uY2F0KFtAY21kXSlcbiAgcnVuRXhlY3V0ZUZ1bmN0OiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5leGVjdXRlKClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkRmluYWwoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuZXhlY3V0ZUZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKVxuICByYXdSZXN1bHQ6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZEZpbmFsKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLnJlc3VsdEZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpXG4gICAgICBpZiBjbWQucmVzdWx0U3RyP1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0clxuICByZXN1bHQ6IC0+IFxuICAgIEBpbml0KClcbiAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgaWYgKHJlcyA9IEByYXdSZXN1bHQoKSk/XG4gICAgICAgIHJlcyA9IEBmb3JtYXRJbmRlbnQocmVzKVxuICAgICAgICBpZiByZXMubGVuZ3RoID4gMCBhbmQgQGdldE9wdGlvbigncGFyc2UnLHRoaXMpIFxuICAgICAgICAgIHBhcnNlciA9IEBnZXRQYXJzZXJGb3JUZXh0KHJlcylcbiAgICAgICAgICByZXMgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgICBpZiBhbHRlckZ1bmN0ID0gQGdldE9wdGlvbignYWx0ZXJSZXN1bHQnLHRoaXMpXG4gICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsdGhpcylcbiAgICAgICAgcmV0dXJuIHJlc1xuICBnZXRQYXJzZXJGb3JUZXh0OiAodHh0PScnKSAtPlxuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7aW5JbnN0YW5jZTp0aGlzfSlcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuICAgIHJldHVybiBwYXJzZXJcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHJldHVybiAwXG4gIGZvcm1hdEluZGVudDogKHRleHQpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcdC9nLCcgICcpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYXBwbHlJbmRlbnQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuaW5kZW50Tm90Rmlyc3QodGV4dCxAZ2V0SW5kZW50KCksXCIgXCIpIiwiICAvLyBbcGF3YV1cbiAgLy8gICByZXBsYWNlICdyZXBsYWNlKC9cXHQvZycgJ3JlcGxhY2UoXCJcXHRcIidcbmltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgQ29kZXdhdmVcbn0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5cbmltcG9ydCB7XG4gIFRleHRQYXJzZXJcbn0gZnJvbSAnLi9UZXh0UGFyc2VyJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgdmFyIENtZEluc3RhbmNlID0gY2xhc3MgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3RvcihjbWQxLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jbWQgPSBjbWQxO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICghKHRoaXMuaXNFbXB0eSgpIHx8IHRoaXMuaW5pdGVkKSkge1xuICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZ2V0Q21kT2JqKCk7XG4gICAgICB0aGlzLl9pbml0UGFyYW1zKCk7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNtZE9iai5pbml0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0UGFyYW0obmFtZSwgdmFsKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSB2YWw7XG4gIH1cblxuICBwdXNoUGFyYW0odmFsKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnB1c2godmFsKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IG5ldyBDb250ZXh0KCk7XG4gIH1cblxuICBnZXRGaW5kZXIoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXI7XG4gICAgZmluZGVyID0gdGhpcy5nZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsIHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKSk7XG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gZmluZGVyO1xuICB9XG5cbiAgX2dldENtZE9iaigpIHtcbiAgICB2YXIgY21kO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNtZC5pbml0KCk7XG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWQoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG4gICAgICBpZiAoY21kLmNscyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqID0gbmV3IGNtZC5jbHModGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iajtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaW5pdFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lZCA9IHRoaXMuZ2V0RGVmYXVsdHMoKTtcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY21kICE9IG51bGw7XG4gIH1cblxuICByZXN1bHRJc0F2YWlsYWJsZSgpIHtcbiAgICB2YXIgYWxpYXNlZDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNtZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXREZWZhdWx0cygpIHtcbiAgICB2YXIgYWxpYXNlZCwgcmVzO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5jbWQuZGVmYXVsdHMpO1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kT2JqLmdldERlZmF1bHRzKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gIH1cblxuICBnZXRBbGlhc2VkKCkge1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkQ21kID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5nZXRBbGlhc2VkRmluYWwoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmFsaWFzZWRDbWQgfHwgbnVsbDtcbiAgICB9XG4gIH1cblxuICBnZXRBbGlhc2VkRmluYWwoKSB7XG4gICAgdmFyIGFsaWFzZWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRGaW5hbENtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsaWFzZWRGaW5hbENtZCB8fCBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY21kLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBhbGlhc2VkID0gdGhpcy5jbWQ7XG4gICAgICAgIHdoaWxlICgoYWxpYXNlZCAhPSBudWxsKSAmJiAoYWxpYXNlZC5hbGlhc09mICE9IG51bGwpKSB7XG4gICAgICAgICAgYWxpYXNlZCA9IGFsaWFzZWQuX2FsaWFzZWRGcm9tRmluZGVyKHRoaXMuZ2V0RmluZGVyKHRoaXMuYWx0ZXJBbGlhc09mKGFsaWFzZWQuYWxpYXNPZikpKTtcbiAgICAgICAgICBpZiAodGhpcy5hbGlhc2VkQ21kID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuYWxpYXNlZENtZCA9IGFsaWFzZWQgfHwgZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWxpYXNlZEZpbmFsQ21kID0gYWxpYXNlZCB8fCBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWx0ZXJBbGlhc09mKGFsaWFzT2YpIHtcbiAgICByZXR1cm4gYWxpYXNPZjtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgdmFyIG9wdDtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9wdGlvbnM7XG4gICAgICB9XG4gICAgICBvcHQgPSB0aGlzLmNtZC5fb3B0aW9uc0ZvckFsaWFzZWQodGhpcy5nZXRBbGlhc2VkKCkpO1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMuY21kT2JqLmdldE9wdGlvbnMoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmNtZE9wdGlvbnMgPSBvcHQ7XG4gICAgICByZXR1cm4gb3B0O1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdGlvbihrZXkpIHtcbiAgICB2YXIgb3B0aW9ucztcbiAgICBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgaWYgKChvcHRpb25zICE9IG51bGwpICYmIGtleSBpbiBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIGdldFBhcmFtKG5hbWVzLCBkZWZWYWwgPSBudWxsKSB7XG4gICAgdmFyIGksIGxlbiwgbiwgcmVmO1xuICAgIGlmICgoKHJlZiA9IHR5cGVvZiBuYW1lcykgPT09ICdzdHJpbmcnIHx8IHJlZiA9PT0gJ251bWJlcicpKSB7XG4gICAgICBuYW1lcyA9IFtuYW1lc107XG4gICAgfVxuICAgIGZvciAoaSA9IDAsIGxlbiA9IG5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBuID0gbmFtZXNbaV07XG4gICAgICBpZiAodGhpcy5uYW1lZFtuXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVkW25dO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucGFyYW1zW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1zW25dO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGVmVmFsO1xuICB9XG5cbiAgYW5jZXN0b3JDbWRzKCkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlKSAhPSBudWxsID8gcmVmLmluSW5zdGFuY2UgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKCk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGFuY2VzdG9yQ21kc0FuZFNlbGYoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5jZXN0b3JDbWRzKCkuY29uY2F0KFt0aGlzLmNtZF0pO1xuICB9XG5cbiAgcnVuRXhlY3V0ZUZ1bmN0KCkge1xuICAgIHZhciBjbWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5leGVjdXRlKCk7XG4gICAgICB9XG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcbiAgICAgIGlmIChjbWQuZXhlY3V0ZUZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlRnVuY3QodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmF3UmVzdWx0KCkge1xuICAgIHZhciBjbWQ7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5yZXN1bHQoKTtcbiAgICAgIH1cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuICAgICAgaWYgKGNtZC5yZXN1bHRGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0RnVuY3QodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAoY21kLnJlc3VsdFN0ciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0U3RyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgYWx0ZXJGdW5jdCwgcGFyc2VyLCByZXM7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgaWYgKHRoaXMucmVzdWx0SXNBdmFpbGFibGUoKSkge1xuICAgICAgaWYgKChyZXMgPSB0aGlzLnJhd1Jlc3VsdCgpKSAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IHRoaXMuZm9ybWF0SW5kZW50KHJlcyk7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCAmJiB0aGlzLmdldE9wdGlvbigncGFyc2UnLCB0aGlzKSkge1xuICAgICAgICAgIHBhcnNlciA9IHRoaXMuZ2V0UGFyc2VyRm9yVGV4dChyZXMpO1xuICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbHRlckZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2FsdGVyUmVzdWx0JywgdGhpcykpIHtcbiAgICAgICAgICByZXMgPSBhbHRlckZ1bmN0KHJlcywgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRQYXJzZXJGb3JUZXh0KHR4dCA9ICcnKSB7XG4gICAgdmFyIHBhcnNlcjtcbiAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIodHh0KSwge1xuICAgICAgaW5JbnN0YW5jZTogdGhpc1xuICAgIH0pO1xuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlO1xuICAgIHJldHVybiBwYXJzZXI7XG4gIH1cblxuICBnZXRJbmRlbnQoKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmb3JtYXRJbmRlbnQodGV4dCkge1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcdC9nLCAnICAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgYXBwbHlJbmRlbnQodGV4dCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuaW5kZW50Tm90Rmlyc3QodGV4dCwgdGhpcy5nZXRJbmRlbnQoKSwgXCIgXCIpO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBQcm9jZXNzIH0gZnJvbSAnLi9Qcm9jZXNzJztcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgUG9zaXRpb25lZENtZEluc3RhbmNlIH0gZnJvbSAnLi9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UnO1xuaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vTG9nZ2VyJztcbmltcG9ydCB7IFBvc0NvbGxlY3Rpb24gfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBDbG9zaW5nUHJvbXAgfSBmcm9tICcuL0Nsb3NpbmdQcm9tcCc7XG5cbmV4cG9ydCBjbGFzcyBDb2Rld2F2ZVxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBDb2Rld2F2ZS5pbml0KClcbiAgICBAbWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSdcbiAgICBAdmFycyA9IHt9XG4gICAgXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAnYnJha2V0cycgOiAnfn4nLFxuICAgICAgJ2RlY28nIDogJ34nLFxuICAgICAgJ2Nsb3NlQ2hhcicgOiAnLycsXG4gICAgICAnbm9FeGVjdXRlQ2hhcicgOiAnIScsXG4gICAgICAnY2FycmV0Q2hhcicgOiAnfCcsXG4gICAgICAnY2hlY2tDYXJyZXQnIDogdHJ1ZSxcbiAgICAgICdpbkluc3RhbmNlJyA6IG51bGxcbiAgICB9XG4gICAgQHBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddXG4gICAgXG4gICAgQG5lc3RlZCA9IGlmIEBwYXJlbnQ/IHRoZW4gQHBhcmVudC5uZXN0ZWQrMSBlbHNlIDBcbiAgICBcbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZSBpZiBAcGFyZW50PyBhbmQga2V5ICE9ICdwYXJlbnQnXG4gICAgICAgIHRoaXNba2V5XSA9IEBwYXJlbnRba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICBAZWRpdG9yLmJpbmRlZFRvKHRoaXMpIGlmIEBlZGl0b3I/XG4gICAgXG4gICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzKVxuICAgIGlmIEBpbkluc3RhbmNlP1xuICAgICAgQGNvbnRleHQucGFyZW50ID0gQGluSW5zdGFuY2UuY29udGV4dFxuXG4gICAgQGxvZ2dlciA9IG5ldyBMb2dnZXIoKVxuXG4gIG9uQWN0aXZhdGlvbktleTogLT5cbiAgICBAcHJvY2VzcyA9IG5ldyBQcm9jZXNzKClcbiAgICBAbG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKVxuICAgIEBydW5BdEN1cnNvclBvcygpLnRoZW4gPT5cbiAgICAgIEBwcm9jZXNzID0gbnVsbFxuICBydW5BdEN1cnNvclBvczogLT5cbiAgICBpZiBAZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgICAgQHJ1bkF0TXVsdGlQb3MoQGVkaXRvci5nZXRNdWx0aVNlbCgpKVxuICAgIGVsc2VcbiAgICAgIEBydW5BdFBvcyhAZWRpdG9yLmdldEN1cnNvclBvcygpKVxuICBydW5BdFBvczogKHBvcyktPlxuICAgIEBydW5BdE11bHRpUG9zKFtwb3NdKVxuICBydW5BdE11bHRpUG9zOiAobXVsdGlQb3MpLT5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuID0+XG4gICAgICBpZiBtdWx0aVBvcy5sZW5ndGggPiAwXG4gICAgICAgIGNtZCA9IEBjb21tYW5kT25Qb3MobXVsdGlQb3NbMF0uZW5kKVxuICAgICAgICBpZiBjbWQ/XG4gICAgICAgICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgICAgICAgY21kLnNldE11bHRpUG9zKG11bHRpUG9zKVxuICAgICAgICAgIGNtZC5pbml0KClcbiAgICAgICAgICBAbG9nZ2VyLmxvZyhjbWQpXG4gICAgICAgICAgY21kLmV4ZWN1dGUoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbXVsdGlQb3NbMF0uc3RhcnQgPT0gbXVsdGlQb3NbMF0uZW5kXG4gICAgICAgICAgICBAYWRkQnJha2V0cyhtdWx0aVBvcylcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcylcbiAgY29tbWFuZE9uUG9zOiAocG9zKSAtPlxuICAgIGlmIEBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIGFuZCBAZm9sbG93ZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAxIFxuICAgICAgcHJldiA9IHBvcy1AYnJha2V0cy5sZW5ndGhcbiAgICAgIG5leHQgPSBwb3NcbiAgICBlbHNlXG4gICAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAwXG4gICAgICAgIHBvcyAtPSBAYnJha2V0cy5sZW5ndGhcbiAgICAgIHByZXYgPSBAZmluZFByZXZCcmFrZXQocG9zKVxuICAgICAgdW5sZXNzIHByZXY/XG4gICAgICAgIHJldHVybiBudWxsIFxuICAgICAgbmV4dCA9IEBmaW5kTmV4dEJyYWtldChwb3MtMSlcbiAgICAgIGlmICFuZXh0PyBvciBAY291bnRQcmV2QnJha2V0KHByZXYpICUgMiAhPSAwIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMscHJldixAZWRpdG9yLnRleHRTdWJzdHIocHJldixuZXh0K0BicmFrZXRzLmxlbmd0aCkpXG4gIG5leHRDbWQ6IChzdGFydCA9IDApIC0+XG4gICAgcG9zID0gc3RhcnRcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyAsW0BicmFrZXRzLFwiXFxuXCJdKVxuICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGhcbiAgICAgIGlmIGYuc3RyID09IEBicmFrZXRzXG4gICAgICAgIGlmIGJlZ2lubmluZz9cbiAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIEBlZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zK0BicmFrZXRzLmxlbmd0aCkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvc1xuICAgICAgZWxzZVxuICAgICAgICBiZWdpbm5pbmcgPSBudWxsXG4gICAgbnVsbFxuICBnZXRFbmNsb3NpbmdDbWQ6IChwb3MgPSAwKSAtPlxuICAgIGNwb3MgPSBwb3NcbiAgICBjbG9zaW5nUHJlZml4ID0gQGJyYWtldHMgKyBAY2xvc2VDaGFyXG4gICAgd2hpbGUgKHAgPSBAZmluZE5leHQoY3BvcyxjbG9zaW5nUHJlZml4KSk/XG4gICAgICBpZiBjbWQgPSBAY29tbWFuZE9uUG9zKHArY2xvc2luZ1ByZWZpeC5sZW5ndGgpXG4gICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgICAgaWYgY21kLnBvcyA8IHBvc1xuICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgIGVsc2VcbiAgICAgICAgY3BvcyA9IHArY2xvc2luZ1ByZWZpeC5sZW5ndGhcbiAgICBudWxsXG4gIHByZWNlZGVkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLUBicmFrZXRzLmxlbmd0aCxwb3MpID09IEBicmFrZXRzXG4gIGZvbGxvd2VkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLHBvcytAYnJha2V0cy5sZW5ndGgpID09IEBicmFrZXRzXG4gIGNvdW50UHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICBpID0gMFxuICAgIHdoaWxlIChzdGFydCA9IEBmaW5kUHJldkJyYWtldChzdGFydCkpP1xuICAgICAgaSsrXG4gICAgcmV0dXJuIGlcbiAgaXNFbmRMaW5lOiAocG9zKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrMSkgPT0gXCJcXG5cIiBvciBwb3MgKyAxID49IEBlZGl0b3IudGV4dExlbigpXG4gIGZpbmRQcmV2QnJha2V0OiAoc3RhcnQpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHRCcmFrZXQoc3RhcnQsLTEpXG4gIGZpbmROZXh0QnJha2V0OiAoc3RhcnQsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW0BicmFrZXRzLFwiXFxuXCJdLCBkaXJlY3Rpb24pXG4gICAgXG4gICAgZi5wb3MgaWYgZiBhbmQgZi5zdHIgPT0gQGJyYWtldHNcbiAgZmluZFByZXY6IChzdGFydCxzdHJpbmcpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHQoc3RhcnQsc3RyaW5nLC0xKVxuICBmaW5kTmV4dDogKHN0YXJ0LHN0cmluZyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBmID0gQGZpbmRBbnlOZXh0KHN0YXJ0ICxbc3RyaW5nXSwgZGlyZWN0aW9uKVxuICAgIGYucG9zIGlmIGZcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci5maW5kQW55TmV4dChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbilcbiAgICBcbiAgZmluZE1hdGNoaW5nUGFpcjogKHN0YXJ0UG9zLG9wZW5pbmcsY2xvc2luZyxkaXJlY3Rpb24gPSAxKSAtPlxuICAgIHBvcyA9IHN0YXJ0UG9zXG4gICAgbmVzdGVkID0gMFxuICAgIHdoaWxlIGYgPSBAZmluZEFueU5leHQocG9zLFtjbG9zaW5nLG9wZW5pbmddLGRpcmVjdGlvbilcbiAgICAgIHBvcyA9IGYucG9zICsgKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBmLnN0ci5sZW5ndGggZWxzZSAwKVxuICAgICAgaWYgZi5zdHIgPT0gKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBjbG9zaW5nIGVsc2Ugb3BlbmluZylcbiAgICAgICAgaWYgbmVzdGVkID4gMFxuICAgICAgICAgIG5lc3RlZC0tXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZlxuICAgICAgZWxzZVxuICAgICAgICBuZXN0ZWQrK1xuICAgIG51bGxcbiAgYWRkQnJha2V0czogKHBvcykgLT5cbiAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpXG4gICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAoQGJyYWtldHMsQGJyYWtldHMpLm1hcCggKHIpLT5yLnNlbGVjdENvbnRlbnQoKSApXG4gICAgQGVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIHByb21wdENsb3NpbmdDbWQ6IChzZWxlY3Rpb25zKSAtPlxuICAgIEBjbG9zaW5nUHJvbXAuc3RvcCgpIGlmIEBjbG9zaW5nUHJvbXA/XG4gICAgQGNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcC5uZXdGb3IodGhpcyxzZWxlY3Rpb25zKS5iZWdpbigpICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIC9cXChuZXcgKC4qKVxcKS5iZWdpbi8gJDEuYmVnaW4gcmVwYXJzZVxuICBwYXJzZUFsbDogKHJlY3Vyc2l2ZSA9IHRydWUpIC0+XG4gICAgaWYgQG5lc3RlZCA+IDEwMFxuICAgICAgdGhyb3cgXCJJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvblwiXG4gICAgcG9zID0gMFxuICAgIHdoaWxlIGNtZCA9IEBuZXh0Q21kKHBvcylcbiAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKVxuICAgICAgQGVkaXRvci5zZXRDdXJzb3JQb3MocG9zKVxuICAgICAgIyBjb25zb2xlLmxvZyhjbWQpXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiByZWN1cnNpdmUgYW5kIGNtZC5jb250ZW50PyBhbmQgKCFjbWQuZ2V0Q21kKCk/IG9yICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSlcbiAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge3BhcmVudDogdGhpc30pXG4gICAgICAgIGNtZC5jb250ZW50ID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIHJlcyA9ICBjbWQuZXhlY3V0ZSgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGlmIHJlcy50aGVuP1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN5bmMgbmVzdGVkIGNvbW1hbmRzIGFyZSBub3Qgc3VwcG9ydGVkJylcbiAgICAgICAgaWYgY21kLnJlcGxhY2VFbmQ/XG4gICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBvcyA9IEBlZGl0b3IuZ2V0Q3Vyc29yUG9zKCkuZW5kXG4gICAgcmV0dXJuIEBnZXRUZXh0KClcbiAgZ2V0VGV4dDogLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0KClcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD8gYW5kICghQGluSW5zdGFuY2U/IG9yICFAaW5JbnN0YW5jZS5maW5kZXI/KVxuICBnZXRSb290OiAtPlxuICAgIGlmIEBpc1Jvb3RcbiAgICAgIHJldHVybiB0aGlzXG4gICAgZWxzZSBpZiBAcGFyZW50P1xuICAgICAgcmV0dXJuIEBwYXJlbnQuZ2V0Um9vdCgpXG4gICAgZWxzZSBpZiBAaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KClcbiAgcmVtb3ZlQ2FycmV0OiAodHh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHR4dCxAY2FycmV0Q2hhcilcbiAgZ2V0Q2FycmV0UG9zOiAodHh0KSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCxAY2FycmV0Q2hhcilcbiAgcmVnTWFya2VyOiAoZmxhZ3M9XCJnXCIpIC0+ICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIGZsYWdzPVwiZ1wiIGZsYWdzPTAgXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAbWFya2VyKSwgZmxhZ3MpXG4gIHJlbW92ZU1hcmtlcnM6ICh0ZXh0KSAtPlxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoQHJlZ01hcmtlcigpLCcnKSAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBAcmVnTWFya2VyKCkgc2VsZi5tYXJrZXIgXG5cbiAgQGluaXQ6IC0+XG4gICAgdW5sZXNzIEBpbml0ZWRcbiAgICAgIEBpbml0ZWQgPSB0cnVlXG4gICAgICBDb21tYW5kLmluaXRDbWRzKClcbiAgICAgIENvbW1hbmQubG9hZENtZHMoKVxuXG4gIEBpbml0ZWQ6IGZhbHNlIiwiaW1wb3J0IHtcbiAgUHJvY2Vzc1xufSBmcm9tICcuL1Byb2Nlc3MnO1xuXG5pbXBvcnQge1xuICBDb250ZXh0XG59IGZyb20gJy4vQ29udGV4dCc7XG5cbmltcG9ydCB7XG4gIFBvc2l0aW9uZWRDbWRJbnN0YW5jZVxufSBmcm9tICcuL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZSc7XG5cbmltcG9ydCB7XG4gIFRleHRQYXJzZXJcbn0gZnJvbSAnLi9UZXh0UGFyc2VyJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBMb2dnZXJcbn0gZnJvbSAnLi9Mb2dnZXInO1xuXG5pbXBvcnQge1xuICBQb3NDb2xsZWN0aW9uXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbic7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgQ2xvc2luZ1Byb21wXG59IGZyb20gJy4vQ2xvc2luZ1Byb21wJztcblxuZXhwb3J0IHZhciBDb2Rld2F2ZSA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgQ29kZXdhdmUge1xuICAgIGNvbnN0cnVjdG9yKGVkaXRvciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsO1xuICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gICAgICBDb2Rld2F2ZS5pbml0KCk7XG4gICAgICB0aGlzLm1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nO1xuICAgICAgdGhpcy52YXJzID0ge307XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgJ2JyYWtldHMnOiAnfn4nLFxuICAgICAgICAnZGVjbyc6ICd+JyxcbiAgICAgICAgJ2Nsb3NlQ2hhcic6ICcvJyxcbiAgICAgICAgJ25vRXhlY3V0ZUNoYXInOiAnIScsXG4gICAgICAgICdjYXJyZXRDaGFyJzogJ3wnLFxuICAgICAgICAnY2hlY2tDYXJyZXQnOiB0cnVlLFxuICAgICAgICAnaW5JbnN0YW5jZSc6IG51bGxcbiAgICAgIH07XG4gICAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddO1xuICAgICAgdGhpcy5uZXN0ZWQgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQubmVzdGVkICsgMSA6IDA7XG4gICAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuICAgICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAoKHRoaXMucGFyZW50ICE9IG51bGwpICYmIGtleSAhPT0gJ3BhcmVudCcpIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSB0aGlzLnBhcmVudFtrZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWRpdG9yICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5lZGl0b3IuYmluZGVkVG8odGhpcyk7XG4gICAgICB9XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzKTtcbiAgICAgIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5pbkluc3RhbmNlLmNvbnRleHQ7XG4gICAgICB9XG4gICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcbiAgICB9XG5cbiAgICBvbkFjdGl2YXRpb25LZXkoKSB7XG4gICAgICB0aGlzLnByb2Nlc3MgPSBuZXcgUHJvY2VzcygpO1xuICAgICAgdGhpcy5sb2dnZXIubG9nKCdhY3RpdmF0aW9uIGtleScpO1xuICAgICAgcmV0dXJuIHRoaXMucnVuQXRDdXJzb3JQb3MoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2VzcyA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBydW5BdEN1cnNvclBvcygpIHtcbiAgICAgIGlmICh0aGlzLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuQXRNdWx0aVBvcyh0aGlzLmVkaXRvci5nZXRNdWx0aVNlbCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkF0UG9zKHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBydW5BdFBvcyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bkF0TXVsdGlQb3MoW3Bvc10pO1xuICAgIH1cblxuICAgIHJ1bkF0TXVsdGlQb3MobXVsdGlQb3MpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIGNtZDtcbiAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpO1xuICAgICAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgY21kLnNldE11bHRpUG9zKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNtZC5pbml0KCk7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coY21kKTtcbiAgICAgICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobXVsdGlQb3NbMF0uc3RhcnQgPT09IG11bHRpUG9zWzBdLmVuZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGRCcmFrZXRzKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21wdENsb3NpbmdDbWQobXVsdGlQb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29tbWFuZE9uUG9zKHBvcykge1xuICAgICAgdmFyIG5leHQsIHByZXY7XG4gICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuZm9sbG93ZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMSkge1xuICAgICAgICBwcmV2ID0gcG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgbmV4dCA9IHBvcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnByZWNlZGVkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDApIHtcbiAgICAgICAgICBwb3MgLT0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2ID0gdGhpcy5maW5kUHJldkJyYWtldChwb3MpO1xuICAgICAgICBpZiAocHJldiA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dCA9IHRoaXMuZmluZE5leHRCcmFrZXQocG9zIC0gMSk7XG4gICAgICAgIGlmICgobmV4dCA9PSBudWxsKSB8fCB0aGlzLmNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT09IDApIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgcHJldiwgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwcmV2LCBuZXh0ICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpO1xuICAgIH1cblxuICAgIG5leHRDbWQoc3RhcnQgPSAwKSB7XG4gICAgICB2YXIgYmVnaW5uaW5nLCBmLCBwb3M7XG4gICAgICBwb3MgPSBzdGFydDtcbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFt0aGlzLmJyYWtldHMsIFwiXFxuXCJdKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIGYuc3RyLmxlbmd0aDtcbiAgICAgICAgaWYgKGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGJlZ2lubmluZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBiZWdpbm5pbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIGJlZ2lubmluZywgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvcztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmVnaW5uaW5nID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0RW5jbG9zaW5nQ21kKHBvcyA9IDApIHtcbiAgICAgIHZhciBjbG9zaW5nUHJlZml4LCBjbWQsIGNwb3MsIHA7XG4gICAgICBjcG9zID0gcG9zO1xuICAgICAgY2xvc2luZ1ByZWZpeCA9IHRoaXMuYnJha2V0cyArIHRoaXMuY2xvc2VDaGFyO1xuICAgICAgd2hpbGUgKChwID0gdGhpcy5maW5kTmV4dChjcG9zLCBjbG9zaW5nUHJlZml4KSkgIT0gbnVsbCkge1xuICAgICAgICBpZiAoY21kID0gdGhpcy5jb21tYW5kT25Qb3MocCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoKSkge1xuICAgICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKCk7XG4gICAgICAgICAgaWYgKGNtZC5wb3MgPCBwb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNwb3MgPSBwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByZWNlZGVkQnlCcmFrZXRzKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aCwgcG9zKSA9PT0gdGhpcy5icmFrZXRzO1xuICAgIH1cblxuICAgIGZvbGxvd2VkQnlCcmFrZXRzKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSA9PT0gdGhpcy5icmFrZXRzO1xuICAgIH1cblxuICAgIGNvdW50UHJldkJyYWtldChzdGFydCkge1xuICAgICAgdmFyIGk7XG4gICAgICBpID0gMDtcbiAgICAgIHdoaWxlICgoc3RhcnQgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHN0YXJ0KSkgIT0gbnVsbCkge1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBpc0VuZExpbmUocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIDEpID09PSBcIlxcblwiIHx8IHBvcyArIDEgPj0gdGhpcy5lZGl0b3IudGV4dExlbigpO1xuICAgIH1cblxuICAgIGZpbmRQcmV2QnJha2V0KHN0YXJ0KSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dEJyYWtldChzdGFydCwgLTEpO1xuICAgIH1cblxuICAgIGZpbmROZXh0QnJha2V0KHN0YXJ0LCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZjtcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSwgZGlyZWN0aW9uKTtcbiAgICAgIGlmIChmICYmIGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgcmV0dXJuIGYucG9zO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRQcmV2KHN0YXJ0LCBzdHJpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmROZXh0KHN0YXJ0LCBzdHJpbmcsIC0xKTtcbiAgICB9XG5cbiAgICBmaW5kTmV4dChzdGFydCwgc3RyaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZjtcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbc3RyaW5nXSwgZGlyZWN0aW9uKTtcbiAgICAgIGlmIChmKSB7XG4gICAgICAgIHJldHVybiBmLnBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIGZpbmRNYXRjaGluZ1BhaXIoc3RhcnRQb3MsIG9wZW5pbmcsIGNsb3NpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmLCBuZXN0ZWQsIHBvcztcbiAgICAgIHBvcyA9IHN0YXJ0UG9zO1xuICAgICAgbmVzdGVkID0gMDtcbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtjbG9zaW5nLCBvcGVuaW5nXSwgZGlyZWN0aW9uKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIChkaXJlY3Rpb24gPiAwID8gZi5zdHIubGVuZ3RoIDogMCk7XG4gICAgICAgIGlmIChmLnN0ciA9PT0gKGRpcmVjdGlvbiA+IDAgPyBjbG9zaW5nIDogb3BlbmluZykpIHtcbiAgICAgICAgICBpZiAobmVzdGVkID4gMCkge1xuICAgICAgICAgICAgbmVzdGVkLS07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXN0ZWQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgYWRkQnJha2V0cyhwb3MpIHtcbiAgICAgIHZhciByZXBsYWNlbWVudHM7XG4gICAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpO1xuICAgICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAodGhpcy5icmFrZXRzLCB0aGlzLmJyYWtldHMpLm1hcChmdW5jdGlvbihyKSB7XG4gICAgICAgIHJldHVybiByLnNlbGVjdENvbnRlbnQoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gICAgfVxuXG4gICAgcHJvbXB0Q2xvc2luZ0NtZChzZWxlY3Rpb25zKSB7XG4gICAgICBpZiAodGhpcy5jbG9zaW5nUHJvbXAgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNsb3NpbmdQcm9tcC5zdG9wKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUHJvbXAgPSBDbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsIHNlbGVjdGlvbnMpLmJlZ2luKCk7IC8vIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAvXFwobmV3ICguKilcXCkuYmVnaW4vICQxLmJlZ2luIHJlcGFyc2VcbiAgICB9XG5cbiAgICBwYXJzZUFsbChyZWN1cnNpdmUgPSB0cnVlKSB7XG4gICAgICB2YXIgY21kLCBwYXJzZXIsIHBvcywgcmVzO1xuICAgICAgaWYgKHRoaXMubmVzdGVkID4gMTAwKSB7XG4gICAgICAgIHRocm93IFwiSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb25cIjtcbiAgICAgIH1cbiAgICAgIHBvcyA9IDA7XG4gICAgICB3aGlsZSAoY21kID0gdGhpcy5uZXh0Q21kKHBvcykpIHtcbiAgICAgICAgcG9zID0gY21kLmdldEVuZFBvcygpO1xuICAgICAgICB0aGlzLmVkaXRvci5zZXRDdXJzb3JQb3MocG9zKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coY21kKVxuICAgICAgICBjbWQuaW5pdCgpO1xuICAgICAgICBpZiAocmVjdXJzaXZlICYmIChjbWQuY29udGVudCAhPSBudWxsKSAmJiAoKGNtZC5nZXRDbWQoKSA9PSBudWxsKSB8fCAhY21kLmdldE9wdGlvbigncHJldmVudFBhcnNlQWxsJykpKSB7XG4gICAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge1xuICAgICAgICAgICAgcGFyZW50OiB0aGlzXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY21kLmNvbnRlbnQgPSBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBjbWQuZXhlY3V0ZSgpO1xuICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAocmVzLnRoZW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3luYyBuZXN0ZWQgY29tbWFuZHMgYXJlIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNtZC5yZXBsYWNlRW5kICE9IG51bGwpIHtcbiAgICAgICAgICAgIHBvcyA9IGNtZC5yZXBsYWNlRW5kO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3MgPSB0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKS5lbmQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5nZXRUZXh0KCk7XG4gICAgfVxuXG4gICAgZ2V0VGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0KCk7XG4gICAgfVxuXG4gICAgaXNSb290KCkge1xuICAgICAgcmV0dXJuICh0aGlzLnBhcmVudCA9PSBudWxsKSAmJiAoKHRoaXMuaW5JbnN0YW5jZSA9PSBudWxsKSB8fCAodGhpcy5pbkluc3RhbmNlLmZpbmRlciA9PSBudWxsKSk7XG4gICAgfVxuXG4gICAgZ2V0Um9vdCgpIHtcbiAgICAgIGlmICh0aGlzLmlzUm9vdCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Um9vdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVDYXJyZXQodHh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsIHRoaXMuY2FycmV0Q2hhcik7XG4gICAgfVxuXG4gICAgZ2V0Q2FycmV0UG9zKHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRDYXJyZXRQb3ModHh0LCB0aGlzLmNhcnJldENoYXIpO1xuICAgIH1cblxuICAgIHJlZ01hcmtlcihmbGFncyA9IFwiZ1wiKSB7IC8vIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBmbGFncz1cImdcIiBmbGFncz0wIFxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm1hcmtlciksIGZsYWdzKTtcbiAgICB9XG5cbiAgICByZW1vdmVNYXJrZXJzKHRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UodGhpcy5yZWdNYXJrZXIoKSwgJycpOyAvLyBbcGF3YSBweXRob25dIHJlcGxhY2UgQHJlZ01hcmtlcigpIHNlbGYubWFya2VyIFxuICAgIH1cblxuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRlZCkge1xuICAgICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICAgIENvbW1hbmQuaW5pdENtZHMoKTtcbiAgICAgICAgcmV0dXJuIENvbW1hbmQubG9hZENtZHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfTtcblxuICBDb2Rld2F2ZS5pbml0ZWQgPSBmYWxzZTtcblxuICByZXR1cm4gQ29kZXdhdmU7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgU3RvcmFnZSB9IGZyb20gJy4vU3RvcmFnZSc7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuXG5fb3B0S2V5ID0gKGtleSxkaWN0LGRlZlZhbCA9IG51bGwpIC0+XG4gICMgb3B0aW9uYWwgRGljdGlvbmFyeSBrZXlcbiAgcmV0dXJuIGlmIGtleSBvZiBkaWN0IHRoZW4gZGljdFtrZXldIGVsc2UgZGVmVmFsXG5cblxuZXhwb3J0IGNsYXNzIENvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAbmFtZSxAZGF0YT1udWxsLHBhcmVudD1udWxsKSAtPlxuICAgIEBjbWRzID0gW11cbiAgICBAZGV0ZWN0b3JzID0gW11cbiAgICBAZXhlY3V0ZUZ1bmN0ID0gQHJlc3VsdEZ1bmN0ID0gQHJlc3VsdFN0ciA9IEBhbGlhc09mID0gQGNscyA9IG51bGxcbiAgICBAYWxpYXNlZCA9IG51bGxcbiAgICBAZnVsbE5hbWUgPSBAbmFtZVxuICAgIEBkZXB0aCA9IDBcbiAgICBbQF9wYXJlbnQsIEBfaW5pdGVkXSA9IFtudWxsLCBmYWxzZV1cbiAgICBAc2V0UGFyZW50KHBhcmVudClcbiAgICBAZGVmYXVsdHMgPSB7fVxuICAgIFxuICAgIEBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgY2hlY2tDYXJyZXQ6IHRydWUsXG4gICAgICBwYXJzZTogZmFsc2UsXG4gICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgYWx0ZXJSZXN1bHQ6IG51bGwsXG4gICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgfVxuICAgIEBvcHRpb25zID0ge31cbiAgICBAZmluYWxPcHRpb25zID0gbnVsbFxuICBwYXJlbnQ6IC0+XG4gICAgcmV0dXJuIEBfcGFyZW50XG4gIHNldFBhcmVudDogKHZhbHVlKSAtPlxuICAgIGlmIEBfcGFyZW50ICE9IHZhbHVlXG4gICAgICBAX3BhcmVudCA9IHZhbHVlXG4gICAgICBAZnVsbE5hbWUgPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQubmFtZT9cbiAgICAgICAgICBAX3BhcmVudC5mdWxsTmFtZSArICc6JyArIEBuYW1lIFxuICAgICAgICBlbHNlIFxuICAgICAgICAgIEBuYW1lXG4gICAgICApXG4gICAgICBAZGVwdGggPSAoXG4gICAgICAgIGlmIEBfcGFyZW50PyBhbmQgQF9wYXJlbnQuZGVwdGg/XG4gICAgICAgIHRoZW4gQF9wYXJlbnQuZGVwdGggKyAxXG4gICAgICAgIGVsc2UgMFxuICAgICAgKVxuICBpbml0OiAtPlxuICAgIGlmICFAX2luaXRlZFxuICAgICAgQF9pbml0ZWQgPSB0cnVlXG4gICAgICBAcGFyc2VEYXRhKEBkYXRhKVxuICAgIHJldHVybiB0aGlzXG4gIHVucmVnaXN0ZXI6IC0+XG4gICAgQF9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpXG4gIGlzRWRpdGFibGU6IC0+XG4gICAgcmV0dXJuIEByZXN1bHRTdHI/IG9yIEBhbGlhc09mP1xuICBpc0V4ZWN1dGFibGU6IC0+XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgZm9yIHAgaW4gWydyZXN1bHRTdHInLCdyZXN1bHRGdW5jdCcsJ2NscycsJ2V4ZWN1dGVGdW5jdCddXG4gICAgICBpZiB0aGlzW3BdP1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICBpc0V4ZWN1dGFibGVXaXRoTmFtZTogKG5hbWUpIC0+XG4gICAgaWYgQGFsaWFzT2Y/XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgYWxpYXNPZiA9IEBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsbmFtZSlcbiAgICAgIGFsaWFzZWQgPSBAX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKGFsaWFzT2YpKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gQGlzRXhlY3V0YWJsZSgpXG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICBmb3IgcCBpbiBbJ3Jlc3VsdFN0cicsJ3Jlc3VsdEZ1bmN0J11cbiAgICAgIGlmIHRoaXNbcF0/XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIGdldERlZmF1bHRzOiAtPlxuICAgIHJlcyA9IHt9XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLEBkZWZhdWx0cylcbiAgICByZXR1cm4gcmVzXG4gIF9hbGlhc2VkRnJvbUZpbmRlcjogKGZpbmRlcikgLT5cbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2VcbiAgICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAYWxpYXNPZj9cbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICByZXR1cm4gQF9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihAYWxpYXNPZikpXG4gIHNldE9wdGlvbnM6IChkYXRhKSAtPlxuICAgIGZvciBrZXksIHZhbCBvZiBkYXRhXG4gICAgICBpZiBrZXkgb2YgQGRlZmF1bHRPcHRpb25zXG4gICAgICAgIEBvcHRpb25zW2tleV0gPSB2YWxcbiAgX29wdGlvbnNGb3JBbGlhc2VkOiAoYWxpYXNlZCkgLT5cbiAgICBvcHQgPSB7fVxuICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LEBkZWZhdWx0T3B0aW9ucylcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsYWxpYXNlZC5nZXRPcHRpb25zKCkpXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0LEBvcHRpb25zKVxuICBnZXRPcHRpb25zOiAtPlxuICAgIHJldHVybiBAX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gIGhlbHA6IC0+XG4gICAgY21kID0gQGdldENtZCgnaGVscCcpXG4gICAgaWYgY21kP1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkucmVzdWx0U3RyXG4gIHBhcnNlRGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBkYXRhXG4gICAgaWYgdHlwZW9mIGRhdGEgPT0gJ3N0cmluZydcbiAgICAgIEByZXN1bHRTdHIgPSBkYXRhXG4gICAgICBAb3B0aW9uc1sncGFyc2UnXSA9IHRydWVcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZSBpZiBkYXRhPyAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBkYXRhPyBcImlzaW5zdGFuY2UoZGF0YSxkaWN0KVwiXG4gICAgICByZXR1cm4gQHBhcnNlRGljdERhdGEoZGF0YSlcbiAgICByZXR1cm4gZmFsc2VcbiAgcGFyc2VEaWN0RGF0YTogKGRhdGEpIC0+XG4gICAgcmVzID0gX29wdEtleSgncmVzdWx0JyxkYXRhKVxuICAgIGlmIHR5cGVvZiByZXMgPT0gXCJmdW5jdGlvblwiXG4gICAgICBAcmVzdWx0RnVuY3QgPSByZXNcbiAgICBlbHNlIGlmIHJlcz9cbiAgICAgIEByZXN1bHRTdHIgPSByZXNcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJyxkYXRhKVxuICAgIGlmIHR5cGVvZiBleGVjdXRlID09IFwiZnVuY3Rpb25cIlxuICAgICAgQGV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGVcbiAgICBAYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLGRhdGEpXG4gICAgQGNscyA9IF9vcHRLZXkoJ2NscycsZGF0YSlcbiAgICBAZGVmYXVsdHMgPSBfb3B0S2V5KCdkZWZhdWx0cycsZGF0YSxAZGVmYXVsdHMpXG4gICAgXG4gICAgQHNldE9wdGlvbnMoZGF0YSlcbiAgICBcbiAgICBpZiAnaGVscCcgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsZGF0YVsnaGVscCddLHRoaXMpKVxuICAgIGlmICdmYWxsYmFjaycgb2YgZGF0YVxuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLGRhdGFbJ2ZhbGxiYWNrJ10sdGhpcykpXG4gICAgICBcbiAgICBpZiAnY21kcycgb2YgZGF0YVxuICAgICAgQGFkZENtZHMoZGF0YVsnY21kcyddKVxuICAgIHJldHVybiB0cnVlXG4gIGFkZENtZHM6IChjbWRzKSAtPlxuICAgIGZvciBuYW1lLCBkYXRhIG9mIGNtZHNcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQobmFtZSxkYXRhLHRoaXMpKVxuICBhZGRDbWQ6IChjbWQpIC0+XG4gICAgZXhpc3RzID0gQGdldENtZChjbWQubmFtZSlcbiAgICBpZiBleGlzdHM/XG4gICAgICBAcmVtb3ZlQ21kKGV4aXN0cylcbiAgICBjbWQuc2V0UGFyZW50KHRoaXMpXG4gICAgQGNtZHMucHVzaChjbWQpXG4gICAgcmV0dXJuIGNtZFxuICByZW1vdmVDbWQ6IChjbWQpIC0+XG4gICAgaWYgKGkgPSBAY21kcy5pbmRleE9mKGNtZCkpID4gLTFcbiAgICAgIEBjbWRzLnNwbGljZShpLCAxKVxuICAgIHJldHVybiBjbWRcbiAgZ2V0Q21kOiAoZnVsbG5hbWUpIC0+XG4gICAgQGluaXQoKVxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgcmV0dXJuIEBnZXRDbWQoc3BhY2UpPy5nZXRDbWQobmFtZSlcbiAgICBmb3IgY21kIGluIEBjbWRzXG4gICAgICBpZiBjbWQubmFtZSA9PSBuYW1lXG4gICAgICAgIHJldHVybiBjbWRcbiAgc2V0Q21kRGF0YTogKGZ1bGxuYW1lLGRhdGEpIC0+XG4gICAgQHNldENtZChmdWxsbmFtZSxuZXcgQ29tbWFuZChmdWxsbmFtZS5zcGxpdCgnOicpLnBvcCgpLGRhdGEpKVxuICBzZXRDbWQ6IChmdWxsbmFtZSxjbWQpIC0+XG4gICAgW3NwYWNlLG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpXG4gICAgaWYgc3BhY2U/XG4gICAgICBuZXh0ID0gQGdldENtZChzcGFjZSlcbiAgICAgIHVubGVzcyBuZXh0P1xuICAgICAgICBuZXh0ID0gQGFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpXG4gICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSxjbWQpXG4gICAgZWxzZVxuICAgICAgQGFkZENtZChjbWQpXG4gICAgICByZXR1cm4gY21kXG4gIGFkZERldGVjdG9yOiAoZGV0ZWN0b3IpIC0+XG4gICAgQGRldGVjdG9ycy5wdXNoKGRldGVjdG9yKVxuICAgIFxuICBAcHJvdmlkZXJzID0gW11cblxuICBAc3RvcmFnZSA9IG5ldyBTdG9yYWdlKClcblxuICBAaW5pdENtZHM6IC0+XG4gICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCx7XG4gICAgICAnY21kcyc6e1xuICAgICAgICAnaGVsbG8nOntcbiAgICAgICAgICBoZWxwOiBcIlwiXCJcbiAgICAgICAgICBcIkhlbGxvLCB3b3JsZCFcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxuICAgICAgICAgIG1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xuICAgICAgICAgIHZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYVxuICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGZvciBwcm92aWRlciBpbiBAcHJvdmlkZXJzXG4gICAgICBwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpXG5cbiAgQHNhdmVDbWQ6IChmdWxsbmFtZSwgZGF0YSkgLT5cbiAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSxkYXRhKVxuICAgIHNhdmVkQ21kcyA9IEBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgIHVubGVzcyBzYXZlZENtZHM/XG4gICAgICBzYXZlZENtZHMgPSB7fVxuICAgIHNhdmVkQ21kc1tmdWxsbmFtZV0gPSBkYXRhXG4gICAgQHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuXG4gIEBsb2FkQ21kczogLT5cbiAgICBzYXZlZENtZHMgPSBAc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICBpZiBzYXZlZENtZHM/IFxuICAgICAgZm9yIGZ1bGxuYW1lLCBkYXRhIG9mIHNhdmVkQ21kc1xuICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSlcblxuICBAcmVzZXRTYXZlZDogLT5cbiAgICBAc3RvcmFnZS5zYXZlKCdjbWRzJyx7fSlcblxuICBAbWFrZVZhckNtZCA9IChuYW1lLGJhc2U9e30pIC0+IFxuICAgIGJhc2UuZXhlY3V0ZSA9IChpbnN0YW5jZSkgLT5cbiAgICAgIHZhbCA9IGlmIChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpP1xuICAgICAgICBwXG4gICAgICBlbHNlIGlmIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgICAgaW5zdGFuY2UuY29udGVudFxuICAgICAgaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHZhbCBpZiB2YWw/XG4gICAgcmV0dXJuIGJhc2VcblxuICBAbWFrZUJvb2xWYXJDbWQgPSAobmFtZSxiYXNlPXt9KSAtPiBcbiAgICBiYXNlLmV4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gICAgICB2YWwgPSBpZiAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKT9cbiAgICAgICAgcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZS5jb250ZW50XG4gICAgICAgIGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHVubGVzcyB2YWw/IGFuZCB2YWwgaW4gWycwJywnZmFsc2UnLCdubyddXG4gICAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlXG4gICAgcmV0dXJuIGJhc2VcbiAgXG5cbmV4cG9ydCBjbGFzcyBCYXNlQ29tbWFuZFxuICBjb25zdHJ1Y3RvcjogKEBpbnN0YW5jZSkgLT5cbiAgaW5pdDogLT5cbiAgICAjXG4gIHJlc3VsdElzQXZhaWxhYmxlOiAtPlxuICAgIHJldHVybiB0aGlzW1wicmVzdWx0XCJdPyAjIFtwYXdhXSByZXBsYWNlIHRoaXNbXCJyZXN1bHRcIl0/ICdoYXNhdHRyKHNlbGYsXCJyZXN1bHRcIiknXG4gIGdldERlZmF1bHRzOiAtPlxuICAgIHJldHVybiB7fVxuICBnZXRPcHRpb25zOiAtPlxuICAgIHJldHVybiB7fVxuICAgICAgIiwidmFyIF9vcHRLZXk7XG5cbmltcG9ydCB7XG4gIENvbnRleHRcbn0gZnJvbSAnLi9Db250ZXh0JztcblxuaW1wb3J0IHtcbiAgU3RvcmFnZVxufSBmcm9tICcuL1N0b3JhZ2UnO1xuXG5pbXBvcnQge1xuICBOYW1lc3BhY2VIZWxwZXJcbn0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5cbl9vcHRLZXkgPSBmdW5jdGlvbihrZXksIGRpY3QsIGRlZlZhbCA9IG51bGwpIHtcbiAgLy8gb3B0aW9uYWwgRGljdGlvbmFyeSBrZXlcbiAgaWYgKGtleSBpbiBkaWN0KSB7XG4gICAgcmV0dXJuIGRpY3Rba2V5XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGVmVmFsO1xuICB9XG59O1xuXG5leHBvcnQgdmFyIENvbW1hbmQgPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIENvbW1hbmQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUxLCBkYXRhMSA9IG51bGwsIHBhcmVudCA9IG51bGwpIHtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWUxO1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTE7XG4gICAgICB0aGlzLmNtZHMgPSBbXTtcbiAgICAgIHRoaXMuZGV0ZWN0b3JzID0gW107XG4gICAgICB0aGlzLmV4ZWN1dGVGdW5jdCA9IHRoaXMucmVzdWx0RnVuY3QgPSB0aGlzLnJlc3VsdFN0ciA9IHRoaXMuYWxpYXNPZiA9IHRoaXMuY2xzID0gbnVsbDtcbiAgICAgIHRoaXMuYWxpYXNlZCA9IG51bGw7XG4gICAgICB0aGlzLmZ1bGxOYW1lID0gdGhpcy5uYW1lO1xuICAgICAgdGhpcy5kZXB0aCA9IDA7XG4gICAgICBbdGhpcy5fcGFyZW50LCB0aGlzLl9pbml0ZWRdID0gW251bGwsIGZhbHNlXTtcbiAgICAgIHRoaXMuc2V0UGFyZW50KHBhcmVudCk7XG4gICAgICB0aGlzLmRlZmF1bHRzID0ge307XG4gICAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBuYW1lVG9QYXJhbTogbnVsbCxcbiAgICAgICAgY2hlY2tDYXJyZXQ6IHRydWUsXG4gICAgICAgIHBhcnNlOiBmYWxzZSxcbiAgICAgICAgYmVmb3JlRXhlY3V0ZTogbnVsbCxcbiAgICAgICAgYWx0ZXJSZXN1bHQ6IG51bGwsXG4gICAgICAgIHByZXZlbnRQYXJzZUFsbDogZmFsc2UsXG4gICAgICAgIHJlcGxhY2VCb3g6IGZhbHNlXG4gICAgICB9O1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgICB0aGlzLmZpbmFsT3B0aW9ucyA9IG51bGw7XG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICB9XG5cbiAgICBzZXRQYXJlbnQodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLl9wYXJlbnQgIT09IHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHZhbHVlO1xuICAgICAgICB0aGlzLmZ1bGxOYW1lID0gKCh0aGlzLl9wYXJlbnQgIT0gbnVsbCkgJiYgKHRoaXMuX3BhcmVudC5uYW1lICE9IG51bGwpID8gdGhpcy5fcGFyZW50LmZ1bGxOYW1lICsgJzonICsgdGhpcy5uYW1lIDogdGhpcy5uYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwdGggPSAoKHRoaXMuX3BhcmVudCAhPSBudWxsKSAmJiAodGhpcy5fcGFyZW50LmRlcHRoICE9IG51bGwpID8gdGhpcy5fcGFyZW50LmRlcHRoICsgMSA6IDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoIXRoaXMuX2luaXRlZCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnBhcnNlRGF0YSh0aGlzLmRhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpO1xuICAgIH1cblxuICAgIGlzRWRpdGFibGUoKSB7XG4gICAgICByZXR1cm4gKHRoaXMucmVzdWx0U3RyICE9IG51bGwpIHx8ICh0aGlzLmFsaWFzT2YgIT0gbnVsbCk7XG4gICAgfVxuXG4gICAgaXNFeGVjdXRhYmxlKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmO1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICB9XG4gICAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCcsICdjbHMnLCAnZXhlY3V0ZUZ1bmN0J107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHJlZltqXTtcbiAgICAgICAgaWYgKHRoaXNbcF0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZSkge1xuICAgICAgdmFyIGFsaWFzT2YsIGFsaWFzZWQsIGNvbnRleHQ7XG4gICAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICAgIGFsaWFzT2YgPSB0aGlzLmFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJywgbmFtZSk7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLl9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihhbGlhc09mKSk7XG4gICAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaXNFeGVjdXRhYmxlKCk7XG4gICAgfVxuXG4gICAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgaiwgbGVuLCBwLCByZWY7XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG4gICAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCddO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal07XG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldERlZmF1bHRzKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIHJlcztcbiAgICAgIHJlcyA9IHt9O1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgYWxpYXNlZC5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgX2FsaWFzZWRGcm9tRmluZGVyKGZpbmRlcikge1xuICAgICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlO1xuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2U7XG4gICAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2U7XG4gICAgICByZXR1cm4gZmluZGVyLmZpbmQoKTtcbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkKCkge1xuICAgICAgdmFyIGNvbnRleHQ7XG4gICAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcih0aGlzLmFsaWFzT2YpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRPcHRpb25zKGRhdGEpIHtcbiAgICAgIHZhciBrZXksIHJlc3VsdHMsIHZhbDtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgICAgdmFsID0gZGF0YVtrZXldO1xuICAgICAgICBpZiAoa2V5IGluIHRoaXMuZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5vcHRpb25zW2tleV0gPSB2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBfb3B0aW9uc0ZvckFsaWFzZWQoYWxpYXNlZCkge1xuICAgICAgdmFyIG9wdDtcbiAgICAgIG9wdCA9IHt9O1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMuZGVmYXVsdE9wdGlvbnMpO1xuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgYWxpYXNlZC5nZXRPcHRpb25zKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldE9wdGlvbnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3B0aW9uc0ZvckFsaWFzZWQodGhpcy5nZXRBbGlhc2VkKCkpO1xuICAgIH1cblxuICAgIGdldE9wdGlvbihrZXkpIHtcbiAgICAgIHZhciBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGVscCgpIHtcbiAgICAgIHZhciBjbWQ7XG4gICAgICBjbWQgPSB0aGlzLmdldENtZCgnaGVscCcpO1xuICAgICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuaW5pdCgpLnJlc3VsdFN0cjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZURhdGEoZGF0YSkge1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRTdHIgPSBkYXRhO1xuICAgICAgICB0aGlzLm9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGljdERhdGEoZGF0YSk7IC8vIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBkYXRhPyBcImlzaW5zdGFuY2UoZGF0YSxkaWN0KVwiXG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcGFyc2VEaWN0RGF0YShkYXRhKSB7XG4gICAgICB2YXIgZXhlY3V0ZSwgcmVzO1xuICAgICAgcmVzID0gX29wdEtleSgncmVzdWx0JywgZGF0YSk7XG4gICAgICBpZiAodHlwZW9mIHJlcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMucmVzdWx0RnVuY3QgPSByZXM7XG4gICAgICB9IGVsc2UgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gcmVzO1xuICAgICAgICB0aGlzLm9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlO1xuICAgICAgfVxuICAgICAgZXhlY3V0ZSA9IF9vcHRLZXkoJ2V4ZWN1dGUnLCBkYXRhKTtcbiAgICAgIGlmICh0eXBlb2YgZXhlY3V0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0ZUZ1bmN0ID0gZXhlY3V0ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLCBkYXRhKTtcbiAgICAgIHRoaXMuY2xzID0gX29wdEtleSgnY2xzJywgZGF0YSk7XG4gICAgICB0aGlzLmRlZmF1bHRzID0gX29wdEtleSgnZGVmYXVsdHMnLCBkYXRhLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhkYXRhKTtcbiAgICAgIGlmICgnaGVscCcgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsIGRhdGFbJ2hlbHAnXSwgdGhpcykpO1xuICAgICAgfVxuICAgICAgaWYgKCdmYWxsYmFjaycgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLCBkYXRhWydmYWxsYmFjayddLCB0aGlzKSk7XG4gICAgICB9XG4gICAgICBpZiAoJ2NtZHMnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWRzKGRhdGFbJ2NtZHMnXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhZGRDbWRzKGNtZHMpIHtcbiAgICAgIHZhciBkYXRhLCBuYW1lLCByZXN1bHRzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChuYW1lIGluIGNtZHMpIHtcbiAgICAgICAgZGF0YSA9IGNtZHNbbmFtZV07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZENtZChuZXcgQ29tbWFuZChuYW1lLCBkYXRhLCB0aGlzKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkQ21kKGNtZCkge1xuICAgICAgdmFyIGV4aXN0cztcbiAgICAgIGV4aXN0cyA9IHRoaXMuZ2V0Q21kKGNtZC5uYW1lKTtcbiAgICAgIGlmIChleGlzdHMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlbW92ZUNtZChleGlzdHMpO1xuICAgICAgfVxuICAgICAgY21kLnNldFBhcmVudCh0aGlzKTtcbiAgICAgIHRoaXMuY21kcy5wdXNoKGNtZCk7XG4gICAgICByZXR1cm4gY21kO1xuICAgIH1cblxuICAgIHJlbW92ZUNtZChjbWQpIHtcbiAgICAgIHZhciBpO1xuICAgICAgaWYgKChpID0gdGhpcy5jbWRzLmluZGV4T2YoY21kKSkgPiAtMSkge1xuICAgICAgICB0aGlzLmNtZHMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNtZDtcbiAgICB9XG5cbiAgICBnZXRDbWQoZnVsbG5hbWUpIHtcbiAgICAgIHZhciBjbWQsIGosIGxlbiwgbmFtZSwgcmVmLCByZWYxLCBzcGFjZTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKTtcbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiAocmVmID0gdGhpcy5nZXRDbWQoc3BhY2UpKSAhPSBudWxsID8gcmVmLmdldENtZChuYW1lKSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIHJlZjEgPSB0aGlzLmNtZHM7XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYxLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGNtZCA9IHJlZjFbal07XG4gICAgICAgIGlmIChjbWQubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRDbWQoZnVsbG5hbWUsIG5ldyBDb21tYW5kKGZ1bGxuYW1lLnNwbGl0KCc6JykucG9wKCksIGRhdGEpKTtcbiAgICB9XG5cbiAgICBzZXRDbWQoZnVsbG5hbWUsIGNtZCkge1xuICAgICAgdmFyIG5hbWUsIG5leHQsIHNwYWNlO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKTtcbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIG5leHQgPSB0aGlzLmdldENtZChzcGFjZSk7XG4gICAgICAgIGlmIChuZXh0ID09IG51bGwpIHtcbiAgICAgICAgICBuZXh0ID0gdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoc3BhY2UpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSwgY21kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKGNtZCk7XG4gICAgICAgIHJldHVybiBjbWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkRGV0ZWN0b3IoZGV0ZWN0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmRldGVjdG9ycy5wdXNoKGRldGVjdG9yKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdENtZHMoKSB7XG4gICAgICB2YXIgaiwgbGVuLCBwcm92aWRlciwgcmVmLCByZXN1bHRzO1xuICAgICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCwge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnaGVsbG8nOiB7XG4gICAgICAgICAgICBoZWxwOiBcIlxcXCJIZWxsbywgd29ybGQhXFxcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxcbm1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xcbnZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYVwiLFxuICAgICAgICAgICAgcmVzdWx0OiAnSGVsbG8sIFdvcmxkISdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVmID0gdGhpcy5wcm92aWRlcnM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcHJvdmlkZXIgPSByZWZbal07XG4gICAgICAgIHJlc3VsdHMucHVzaChwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzYXZlQ21kKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICB2YXIgc2F2ZWRDbWRzO1xuICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpO1xuICAgICAgc2F2ZWRDbWRzID0gdGhpcy5zdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgICAgIGlmIChzYXZlZENtZHMgPT0gbnVsbCkge1xuICAgICAgICBzYXZlZENtZHMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHNhdmVkQ21kc1tmdWxsbmFtZV0gPSBkYXRhO1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlKCdjbWRzJywgc2F2ZWRDbWRzKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbG9hZENtZHMoKSB7XG4gICAgICB2YXIgZGF0YSwgZnVsbG5hbWUsIHJlc3VsdHMsIHNhdmVkQ21kcztcbiAgICAgIHNhdmVkQ21kcyA9IHRoaXMuc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gICAgICBpZiAoc2F2ZWRDbWRzICE9IG51bGwpIHtcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGZ1bGxuYW1lIGluIHNhdmVkQ21kcykge1xuICAgICAgICAgIGRhdGEgPSBzYXZlZENtZHNbZnVsbG5hbWVdO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyByZXNldFNhdmVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlKCdjbWRzJywge30pO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYWtlVmFyQ21kKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHAsIHZhbDtcbiAgICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcbiAgICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZUJvb2xWYXJDbWQobmFtZSwgYmFzZSA9IHt9KSB7XG4gICAgICBiYXNlLmV4ZWN1dGUgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgICB2YXIgcCwgdmFsO1xuICAgICAgICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuICAgICAgICBpZiAoISgodmFsICE9IG51bGwpICYmICh2YWwgPT09ICcwJyB8fCB2YWwgPT09ICdmYWxzZScgfHwgdmFsID09PSAnbm8nKSkpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgfTtcblxuICBDb21tYW5kLnByb3ZpZGVycyA9IFtdO1xuXG4gIENvbW1hbmQuc3RvcmFnZSA9IG5ldyBTdG9yYWdlKCk7XG5cbiAgcmV0dXJuIENvbW1hbmQ7XG5cbn0pLmNhbGwodGhpcyk7XG5cbmV4cG9ydCB2YXIgQmFzZUNvbW1hbmQgPSBjbGFzcyBCYXNlQ29tbWFuZCB7XG4gIGNvbnN0cnVjdG9yKGluc3RhbmNlMSkge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTE7XG4gIH1cblxuICBpbml0KCkge31cblxuICBcbiAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXNbXCJyZXN1bHRcIl0gIT0gbnVsbDtcbiAgfVxuXG4gIGdldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbn07XG4iLCJcbmltcG9ydCB7IENtZEZpbmRlciB9IGZyb20gJy4vQ21kRmluZGVyJztcbmltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9BcnJheUhlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBDb250ZXh0XG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlKSAtPlxuICAgIEBuYW1lU3BhY2VzID0gW11cbiAgXG4gIGFkZE5hbWVTcGFjZTogKG5hbWUpIC0+XG4gICAgaWYgbmFtZSBub3QgaW4gQG5hbWVTcGFjZXMgXG4gICAgICBAbmFtZVNwYWNlcy5wdXNoKG5hbWUpXG4gICAgICBAX25hbWVzcGFjZXMgPSBudWxsXG4gIGFkZE5hbWVzcGFjZXM6IChzcGFjZXMpIC0+XG4gICAgaWYgc3BhY2VzIFxuICAgICAgaWYgdHlwZW9mIHNwYWNlcyA9PSAnc3RyaW5nJ1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXVxuICAgICAgZm9yIHNwYWNlIGluIHNwYWNlcyBcbiAgICAgICAgQGFkZE5hbWVTcGFjZShzcGFjZSlcbiAgcmVtb3ZlTmFtZVNwYWNlOiAobmFtZSkgLT5cbiAgICBAbmFtZVNwYWNlcyA9IEBuYW1lU3BhY2VzLmZpbHRlciAobikgLT4gbiBpc250IG5hbWVcblxuICBnZXROYW1lU3BhY2VzOiAtPlxuICAgIHVubGVzcyBAX25hbWVzcGFjZXM/XG4gICAgICBucGNzID0gWydjb3JlJ10uY29uY2F0KEBuYW1lU3BhY2VzKVxuICAgICAgaWYgQHBhcmVudD9cbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KEBwYXJlbnQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgQF9uYW1lc3BhY2VzID0gQXJyYXlIZWxwZXIudW5pcXVlKG5wY3MpXG4gICAgcmV0dXJuIEBfbmFtZXNwYWNlc1xuICBnZXRDbWQ6IChjbWROYW1lLG5hbWVTcGFjZXMgPSBbXSkgLT5cbiAgICBmaW5kZXIgPSBAZ2V0RmluZGVyKGNtZE5hbWUsbmFtZVNwYWNlcylcbiAgICByZXR1cm4gZmluZGVyLmZpbmQoKVxuICBnZXRGaW5kZXI6IChjbWROYW1lLG5hbWVTcGFjZXMgPSBbXSkgLT5cbiAgICByZXR1cm4gbmV3IENtZEZpbmRlcihjbWROYW1lLCB7XG4gICAgICBuYW1lc3BhY2VzOiBuYW1lU3BhY2VzXG4gICAgICB1c2VEZXRlY3RvcnM6IEBpc1Jvb3QoKVxuICAgICAgY29kZXdhdmU6IEBjb2Rld2F2ZVxuICAgICAgcGFyZW50Q29udGV4dDogdGhpc1xuICAgIH0pXG4gIGlzUm9vdDogLT5cbiAgICByZXR1cm4gIUBwYXJlbnQ/XG4gIHdyYXBDb21tZW50OiAoc3RyKSAtPlxuICAgIGNjID0gQGdldENvbW1lbnRDaGFyKClcbiAgICBpZiBjYy5pbmRleE9mKCclcycpID4gLTFcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsc3RyKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0ciArICcgJyArIGNjXG4gIHdyYXBDb21tZW50TGVmdDogKHN0ciA9ICcnKSAtPlxuICAgIGNjID0gQGdldENvbW1lbnRDaGFyKClcbiAgICBpZiAoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTFcbiAgICAgIHJldHVybiBjYy5zdWJzdHIoMCxpKSArIHN0clxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0clxuICB3cmFwQ29tbWVudFJpZ2h0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIHN0ciArIGNjLnN1YnN0cihpKzIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHN0ciArICcgJyArIGNjXG4gIGNtZEluc3RhbmNlRm9yOiAoY21kKSAtPlxuICAgIHJldHVybiBuZXcgQ21kSW5zdGFuY2UoY21kLHRoaXMpXG4gIGdldENvbW1lbnRDaGFyOiAtPlxuICAgIGlmIEBjb21tZW50Q2hhcj9cbiAgICAgIHJldHVybiBAY29tbWVudENoYXJcbiAgICBjbWQgPSBAZ2V0Q21kKCdjb21tZW50JylcbiAgICBjaGFyID0gJzwhLS0gJXMgLS0+J1xuICAgIGlmIGNtZD9cbiAgICAgIGluc3QgPSBAY21kSW5zdGFuY2VGb3IoY21kKVxuICAgICAgaW5zdC5jb250ZW50ID0gJyVzJ1xuICAgICAgcmVzID0gaW5zdC5yZXN1bHQoKVxuICAgICAgaWYgcmVzP1xuICAgICAgICBjaGFyID0gcmVzXG4gICAgQGNvbW1lbnRDaGFyID0gY2hhclxuICAgIHJldHVybiBAY29tbWVudENoYXIiLCJ2YXIgaW5kZXhPZiA9IFtdLmluZGV4T2Y7XG5cbmltcG9ydCB7XG4gIENtZEZpbmRlclxufSBmcm9tICcuL0NtZEZpbmRlcic7XG5cbmltcG9ydCB7XG4gIENtZEluc3RhbmNlXG59IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuXG5pbXBvcnQge1xuICBBcnJheUhlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvQXJyYXlIZWxwZXInO1xuXG5leHBvcnQgdmFyIENvbnRleHQgPSBjbGFzcyBDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoY29kZXdhdmUpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmU7XG4gICAgdGhpcy5uYW1lU3BhY2VzID0gW107XG4gIH1cblxuICBhZGROYW1lU3BhY2UobmFtZSkge1xuICAgIGlmIChpbmRleE9mLmNhbGwodGhpcy5uYW1lU3BhY2VzLCBuYW1lKSA8IDApIHtcbiAgICAgIHRoaXMubmFtZVNwYWNlcy5wdXNoKG5hbWUpO1xuICAgICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZXMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFkZE5hbWVzcGFjZXMoc3BhY2VzKSB7XG4gICAgdmFyIGosIGxlbiwgcmVzdWx0cywgc3BhY2U7XG4gICAgaWYgKHNwYWNlcykge1xuICAgICAgaWYgKHR5cGVvZiBzcGFjZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNwYWNlcyA9IFtzcGFjZXNdO1xuICAgICAgfVxuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gc3BhY2VzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHNwYWNlID0gc3BhY2VzW2pdO1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGROYW1lU3BhY2Uoc3BhY2UpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZU5hbWVTcGFjZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZVNwYWNlcyA9IHRoaXMubmFtZVNwYWNlcy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4gIT09IG5hbWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXROYW1lU3BhY2VzKCkge1xuICAgIHZhciBucGNzO1xuICAgIGlmICh0aGlzLl9uYW1lc3BhY2VzID09IG51bGwpIHtcbiAgICAgIG5wY3MgPSBbJ2NvcmUnXS5jb25jYXQodGhpcy5uYW1lU3BhY2VzKTtcbiAgICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIG5wY3MgPSBucGNzLmNvbmNhdCh0aGlzLnBhcmVudC5nZXROYW1lU3BhY2VzKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLnVuaXF1ZShucGNzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZXM7XG4gIH1cblxuICBnZXRDbWQoY21kTmFtZSwgbmFtZVNwYWNlcyA9IFtdKSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmdldEZpbmRlcihjbWROYW1lLCBuYW1lU3BhY2VzKTtcbiAgICByZXR1cm4gZmluZGVyLmZpbmQoKTtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lLCBuYW1lU3BhY2VzID0gW10pIHtcbiAgICByZXR1cm4gbmV3IENtZEZpbmRlcihjbWROYW1lLCB7XG4gICAgICBuYW1lc3BhY2VzOiBuYW1lU3BhY2VzLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0aGlzLmlzUm9vdCgpLFxuICAgICAgY29kZXdhdmU6IHRoaXMuY29kZXdhdmUsXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSk7XG4gIH1cblxuICBpc1Jvb3QoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09IG51bGw7XG4gIH1cblxuICB3cmFwQ29tbWVudChzdHIpIHtcbiAgICB2YXIgY2M7XG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKCk7XG4gICAgaWYgKGNjLmluZGV4T2YoJyVzJykgPiAtMSkge1xuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJywgc3RyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2M7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnRMZWZ0KHN0ciA9ICcnKSB7XG4gICAgdmFyIGNjLCBpO1xuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpO1xuICAgIGlmICgoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5zdWJzdHIoMCwgaSkgKyBzdHI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0cjtcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudFJpZ2h0KHN0ciA9ICcnKSB7XG4gICAgdmFyIGNjLCBpO1xuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpO1xuICAgIGlmICgoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTEpIHtcbiAgICAgIHJldHVybiBzdHIgKyBjYy5zdWJzdHIoaSArIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2M7XG4gICAgfVxuICB9XG5cbiAgY21kSW5zdGFuY2VGb3IoY21kKSB7XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsIHRoaXMpO1xuICB9XG5cbiAgZ2V0Q29tbWVudENoYXIoKSB7XG4gICAgdmFyIGNoYXIsIGNtZCwgaW5zdCwgcmVzO1xuICAgIGlmICh0aGlzLmNvbW1lbnRDaGFyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbW1lbnRDaGFyO1xuICAgIH1cbiAgICBjbWQgPSB0aGlzLmdldENtZCgnY29tbWVudCcpO1xuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nO1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaW5zdCA9IHRoaXMuY21kSW5zdGFuY2VGb3IoY21kKTtcbiAgICAgIGluc3QuY29udGVudCA9ICclcyc7XG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpO1xuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIGNoYXIgPSByZXM7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29tbWVudENoYXIgPSBjaGFyO1xuICAgIHJldHVybiB0aGlzLmNvbW1lbnRDaGFyO1xuICB9XG5cbn07XG4iLCIjIFtwYXdhIHB5dGhvbl1cbiMgICByZXBsYWNlIC9kYXRhLihcXHcrKS8gZGF0YVsnJDEnXVxuIyAgIHJlcGxhY2UgY29kZXdhdmUuZWRpdG9yLnRleHQoKSBjb2Rld2F2ZS5lZGl0b3IudGV4dFxuXG5pbXBvcnQgeyBQYWlyIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9QYWlyJztcblxuZXhwb3J0IGNsYXNzIERldGVjdG9yXG4gIGNvbnN0cnVjdG9yOiAoQGRhdGE9e30pIC0+XG4gIGRldGVjdDogKGZpbmRlcikgLT5cbiAgICBpZiBAZGV0ZWN0ZWQoZmluZGVyKVxuICAgICAgcmV0dXJuIEBkYXRhLnJlc3VsdCBpZiBAZGF0YS5yZXN1bHQ/XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBkYXRhLmVsc2UgaWYgQGRhdGEuZWxzZT9cbiAgZGV0ZWN0ZWQ6IChmaW5kZXIpIC0+XG4gICAgI1xuXG5leHBvcnQgY2xhc3MgTGFuZ0RldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3JcbiAgZGV0ZWN0OiAoZmluZGVyKSAtPlxuICAgIGlmIGZpbmRlci5jb2Rld2F2ZT8gXG4gICAgICBsYW5nID0gZmluZGVyLmNvZGV3YXZlLmVkaXRvci5nZXRMYW5nKClcbiAgICAgIGlmIGxhbmc/IFxuICAgICAgICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpXG4gICAgICAgIFxuZXhwb3J0IGNsYXNzIFBhaXJEZXRlY3RvciBleHRlbmRzIERldGVjdG9yXG4gIGRldGVjdGVkOiAoZmluZGVyKSAtPlxuICAgIGlmIEBkYXRhLm9wZW5lcj8gYW5kIEBkYXRhLmNsb3Nlcj8gYW5kIGZpbmRlci5pbnN0YW5jZT9cbiAgICAgIHBhaXIgPSBuZXcgUGFpcihAZGF0YS5vcGVuZXIsIEBkYXRhLmNsb3NlciwgQGRhdGEpXG4gICAgICBpZiBwYWlyLmlzV2FwcGVyT2YoZmluZGVyLmluc3RhbmNlLmdldFBvcygpLCBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLnRleHQoKSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgICAgICIsIiAgLy8gW3Bhd2EgcHl0aG9uXVxuICAvLyAgIHJlcGxhY2UgL2RhdGEuKFxcdyspLyBkYXRhWyckMSddXG4gIC8vICAgcmVwbGFjZSBjb2Rld2F2ZS5lZGl0b3IudGV4dCgpIGNvZGV3YXZlLmVkaXRvci50ZXh0XG5pbXBvcnQge1xuICBQYWlyXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUGFpcic7XG5cbmV4cG9ydCB2YXIgRGV0ZWN0b3IgPSBjbGFzcyBEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEgPSB7fSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cblxuICBkZXRlY3QoZmluZGVyKSB7XG4gICAgaWYgKHRoaXMuZGV0ZWN0ZWQoZmluZGVyKSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5yZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnJlc3VsdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZGF0YS5lbHNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5lbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRldGVjdGVkKGZpbmRlcikge31cblxufTtcblxuXG5leHBvcnQgdmFyIExhbmdEZXRlY3RvciA9IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIHZhciBsYW5nO1xuICAgIGlmIChmaW5kZXIuY29kZXdhdmUgIT0gbnVsbCkge1xuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpO1xuICAgICAgaWYgKGxhbmcgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG5leHBvcnQgdmFyIFBhaXJEZXRlY3RvciA9IGNsYXNzIFBhaXJEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0ZWQoZmluZGVyKSB7XG4gICAgdmFyIHBhaXI7XG4gICAgaWYgKCh0aGlzLmRhdGEub3BlbmVyICE9IG51bGwpICYmICh0aGlzLmRhdGEuY2xvc2VyICE9IG51bGwpICYmIChmaW5kZXIuaW5zdGFuY2UgIT0gbnVsbCkpIHtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcih0aGlzLmRhdGEub3BlbmVyLCB0aGlzLmRhdGEuY2xvc2VyLCB0aGlzLmRhdGEpO1xuICAgICAgaWYgKHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG4iLCIjIFtwYXdhXVxuIyAgIHJlcGxhY2UgQ29kZXdhdmUuQ29tbWFuZC5zZXQgY29kZXdhdmVfY29yZS5jb3JlX2NtZHMuc2V0XG5cbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgRWRpdENtZFByb3BcbiAgY29uc3RydWN0b3I6IChAbmFtZSxvcHRpb25zKSAtPlxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ3ZhcicgOiBudWxsLFxuICAgICAgJ29wdCcgOiBudWxsLFxuICAgICAgJ2Z1bmN0JyA6IG51bGwsXG4gICAgICAnZGF0YU5hbWUnIDogbnVsbCxcbiAgICAgICdzaG93RW1wdHknIDogZmFsc2UsXG4gICAgICAnY2FycmV0JyA6IGZhbHNlLFxuICAgIH1cbiAgICBmb3Iga2V5IGluIFsndmFyJywnb3B0JywnZnVuY3QnXVxuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgZGVmYXVsdHNbJ2RhdGFOYW1lJ10gPSBvcHRpb25zW2tleV1cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgICAgXG4gIHNldENtZDogKGNtZHMpIC0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQoQG5hbWUpXG4gIFxuICB3cml0ZUZvcjogKHBhcnNlcixvYmopIC0+XG4gICAgaWYgcGFyc2VyLnZhcnNbQG5hbWVdP1xuICAgICAgb2JqW0BkYXRhTmFtZV0gPSBwYXJzZXIudmFyc1tAbmFtZV1cbiAgdmFsRnJvbUNtZDogKGNtZCkgLT5cbiAgICBpZiBjbWQ/XG4gICAgICBpZiBAb3B0P1xuICAgICAgICByZXR1cm4gY21kLmdldE9wdGlvbihAb3B0KVxuICAgICAgaWYgQGZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kW0BmdW5jdF0oKVxuICAgICAgaWYgQHZhcj9cbiAgICAgICAgcmV0dXJuIGNtZFtAdmFyXVxuICBzaG93Rm9yQ21kOiAoY21kKSAtPlxuICAgIHZhbCA9IEB2YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gQHNob3dFbXB0eSBvciB2YWw/XG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgaWYgQHNob3dGb3JDbWQoY21kKVxuICAgICAgXCJcIlwiXG4gICAgICB+fiN7QG5hbWV9fn5cbiAgICAgICN7QHZhbEZyb21DbWQoY21kKSBvciBcIlwifSN7aWYgQGNhcnJldCB0aGVuIFwifFwiIGVsc2UgXCJcIn1cbiAgICAgIH5+LyN7QG5hbWV9fn5cbiAgICAgIFwiXCJcIlxuICAgIFxuICAgIFxuY2xhc3MgRWRpdENtZFByb3Auc291cmNlIGV4dGVuZHMgRWRpdENtZFByb3AgXG4gIHZhbEZyb21DbWQ6IChjbWQpLT5cbiAgICByZXMgPSBzdXBlcihjbWQpXG4gICAgaWYgcmVzP1xuICAgICAgcmVzID0gcmVzLnJlcGxhY2UoL1xcfC9nLCAnfHwnKSAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAnL1xcfC9nJyBcIid8J1wiXG4gICAgcmV0dXJuIHJlc1xuICBzZXRDbWQ6IChjbWRzKS0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQoQG5hbWUseydwcmV2ZW50UGFyc2VBbGwnIDogdHJ1ZX0pXG4gIHNob3dGb3JDbWQ6IChjbWQpIC0+XG4gICAgdmFsID0gQHZhbEZyb21DbWQoY21kKVxuICAgIHJldHVybiAoQHNob3dFbXB0eSBhbmQgIShjbWQ/IGFuZCBjbWQuYWxpYXNPZj8pKSBvciB2YWw/XG4gICAgXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5zdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcFxuICBkaXNwbGF5OiAoY21kKSAtPlxuICAgIGlmIEB2YWxGcm9tQ21kKGNtZCk/XG4gICAgICByZXR1cm4gXCJ+fiEje0BuYW1lfSAnI3tAdmFsRnJvbUNtZChjbWQpfSN7aWYgQGNhcnJldCB0aGVuIFwifFwiIGVsc2UgXCJcIn0nfn5cIlxuICAgIFxuICAgIFxuY2xhc3MgRWRpdENtZFByb3AucmV2Qm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wXG4gIHNldENtZDogKGNtZHMpIC0+XG4gICAgY21kc1tAbmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKEBuYW1lKVxuICB3cml0ZUZvcjogKHBhcnNlcixvYmopIC0+XG4gICAgaWYgcGFyc2VyLnZhcnNbQG5hbWVdP1xuICAgICAgb2JqW0BkYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbQG5hbWVdXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgdmFsID0gQHZhbEZyb21DbWQoY21kKVxuICAgIGlmIHZhbD8gYW5kICF2YWxcbiAgICAgIHJldHVybiBcIn5+ISN7QG5hbWV9fn5cIlxuXG4gICAgXG5jbGFzcyBFZGl0Q21kUHJvcC5ib29sIGV4dGVuZHMgRWRpdENtZFByb3BcbiAgc2V0Q21kOiAoY21kcykgLT5cbiAgICBjbWRzW0BuYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQoQG5hbWUpXG4gIGRpc3BsYXk6IChjbWQpIC0+XG4gICAgXCJ+fiEje0BuYW1lfX5+XCIgaWYgQHZhbEZyb21DbWQoY21kKSIsIiAgLy8gW3Bhd2FdXG4gIC8vICAgcmVwbGFjZSBDb2Rld2F2ZS5Db21tYW5kLnNldCBjb2Rld2F2ZV9jb3JlLmNvcmVfY21kcy5zZXRcbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBFZGl0Q21kUHJvcCA9IGNsYXNzIEVkaXRDbWRQcm9wIHtcbiAgY29uc3RydWN0b3IobmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywgaSwga2V5LCBsZW4sIHJlZiwgdmFsO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAndmFyJzogbnVsbCxcbiAgICAgICdvcHQnOiBudWxsLFxuICAgICAgJ2Z1bmN0JzogbnVsbCxcbiAgICAgICdkYXRhTmFtZSc6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JzogZmFsc2UsXG4gICAgICAnY2FycmV0JzogZmFsc2VcbiAgICB9O1xuICAgIHJlZiA9IFsndmFyJywgJ29wdCcsICdmdW5jdCddO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAga2V5ID0gcmVmW2ldO1xuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGRlZmF1bHRzWydkYXRhTmFtZSddID0gb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICB3cml0ZUZvcihwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSBwYXJzZXIudmFyc1t0aGlzLm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHZhbEZyb21DbWQoY21kKSB7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5vcHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmdldE9wdGlvbih0aGlzLm9wdCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5mdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy5mdW5jdF0oKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnZhciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy52YXJdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3dGb3JDbWQoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgfHwgKHZhbCAhPSBudWxsKTtcbiAgfVxuXG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMuc2hvd0ZvckNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+JHt0aGlzLm5hbWV9fn5cXG4ke3RoaXMudmFsRnJvbUNtZChjbWQpIHx8IFwiXCJ9JHsodGhpcy5jYXJyZXQgPyBcInxcIiA6IFwiXCIpfVxcbn5+LyR7dGhpcy5uYW1lfX5+YDtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZFByb3Auc291cmNlID0gY2xhc3Mgc291cmNlIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICB2YWxGcm9tQ21kKGNtZCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gc3VwZXIudmFsRnJvbUNtZChjbWQpO1xuICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgcmVzID0gcmVzLnJlcGxhY2UoL1xcfC9nLCAnfHwnKTsgLy8gW3Bhd2EgcHl0aG9uXSByZXBsYWNlICcvXFx8L2cnIFwiJ3wnXCJcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZCh0aGlzLm5hbWUsIHtcbiAgICAgICdwcmV2ZW50UGFyc2VBbGwnOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBzaG93Rm9yQ21kKGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG4gICAgcmV0dXJuICh0aGlzLnNob3dFbXB0eSAmJiAhKChjbWQgIT0gbnVsbCkgJiYgKGNtZC5hbGlhc09mICE9IG51bGwpKSkgfHwgKHZhbCAhPSBudWxsKTtcbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5zdHJpbmcgPSBjbGFzcyBzdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9ICcke3RoaXMudmFsRnJvbUNtZChjbWQpfSR7KHRoaXMuY2FycmV0ID8gXCJ8XCIgOiBcIlwiKX0nfn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5yZXZCb29sID0gY2xhc3MgcmV2Qm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgd3JpdGVGb3IocGFyc2VyLCBvYmopIHtcbiAgICBpZiAocGFyc2VyLnZhcnNbdGhpcy5uYW1lXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gb2JqW3RoaXMuZGF0YU5hbWVdID0gIXBhcnNlci52YXJzW3RoaXMubmFtZV07XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIGlmICgodmFsICE9IG51bGwpICYmICF2YWwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG5FZGl0Q21kUHJvcC5ib29sID0gY2xhc3MgYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgU3RyUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuaW1wb3J0IHsgb3B0aW9uYWxQcm9taXNlIH0gZnJvbSAnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZSc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQG5hbWVzcGFjZSA9IG51bGxcbiAgICBAX2xhbmcgPSBudWxsXG4gIGJpbmRlZFRvOiAoY29kZXdhdmUpIC0+XG4gICAgI1xuICB0ZXh0OiAodmFsKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRMZW46IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCA9IG51bGwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBiZWdpblVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBlbmRVbmRvQWN0aW9uOiAtPlxuICAgICNcbiAgZ2V0TGFuZzogLT5cbiAgICByZXR1cm4gQF9sYW5nXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdDogLT5cbiAgICByZXR1cm4gbnVsbFxuICBhbGxvd011bHRpU2VsZWN0aW9uOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBzZXRNdWx0aVNlbDogKHNlbGVjdGlvbnMpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRNdWx0aVNlbDogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGNhbkxpc3RlblRvQ2hhbmdlOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIFxuICBnZXRMaW5lQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIG5ldyBQb3MoQGZpbmRMaW5lU3RhcnQocG9zKSxAZmluZExpbmVFbmQocG9zKSlcbiAgZmluZExpbmVTdGFydDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiXSwgLTEpXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcysxIGVsc2UgMFxuICBmaW5kTGluZUVuZDogKHBvcykgLT4gXG4gICAgcCA9IEBmaW5kQW55TmV4dChwb3MgLFtcIlxcblwiLFwiXFxyXCJdKVxuICAgIHJldHVybiBpZiBwIHRoZW4gcC5wb3MgZWxzZSBAdGV4dExlbigpXG4gIFxuICBmaW5kQW55TmV4dDogKHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgaWYgZGlyZWN0aW9uID4gMFxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LEB0ZXh0TGVuKCkpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKDAsc3RhcnQpXG4gICAgYmVzdFBvcyA9IG51bGxcbiAgICBmb3Igc3RyaSBpbiBzdHJpbmdzXG4gICAgICBwb3MgPSBpZiBkaXJlY3Rpb24gPiAwIHRoZW4gdGV4dC5pbmRleE9mKHN0cmkpIGVsc2UgdGV4dC5sYXN0SW5kZXhPZihzdHJpKVxuICAgICAgaWYgcG9zICE9IC0xXG4gICAgICAgIGlmICFiZXN0UG9zPyBvciBiZXN0UG9zKmRpcmVjdGlvbiA+IHBvcypkaXJlY3Rpb25cbiAgICAgICAgICBiZXN0UG9zID0gcG9zXG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmlcbiAgICBpZiBiZXN0U3RyP1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBiZXN0UG9zICsgc3RhcnQgZWxzZSBiZXN0UG9zKSxiZXN0U3RyKVxuICAgIHJldHVybiBudWxsXG4gIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICByZXBsYWNlbWVudHMucmVkdWNlKChwcm9taXNlLHJlcGwpPT5cbiAgICAgICAgcHJvbWlzZS50aGVuIChvcHQpPT5cbiAgICAgICAgICByZXBsLndpdGhFZGl0b3IodGhpcylcbiAgICAgICAgICByZXBsLmFwcGx5T2Zmc2V0KG9wdC5vZmZzZXQpXG4gICAgICAgICAgb3B0aW9uYWxQcm9taXNlKHJlcGwuYXBwbHkoKSkudGhlbiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzZWxlY3Rpb25zOiBvcHQuc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKSxcbiAgICAgICAgICAgICAgb2Zmc2V0OiBvcHQub2Zmc2V0K3JlcGwub2Zmc2V0QWZ0ZXIodGhpcykgXG4gICAgICAgICAgICB9XG4gICAgICAsIG9wdGlvbmFsUHJvbWlzZSh7c2VsZWN0aW9uczogW10sb2Zmc2V0OiAwfSkpXG4gICAgLnRoZW4gKG9wdCk9PlxuICAgICAgQGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhvcHQuc2VsZWN0aW9ucylcbiAgICAucmVzdWx0KClcbiAgICBcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnM6IChzZWxlY3Rpb25zKSAtPlxuICAgIGlmIHNlbGVjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgaWYgQGFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgICAgICBAc2V0TXVsdGlTZWwoc2VsZWN0aW9ucylcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldEN1cnNvclBvcyhzZWxlY3Rpb25zWzBdLnN0YXJ0LHNlbGVjdGlvbnNbMF0uZW5kKSIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFN0clBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1N0clBvcyc7XG5cbmltcG9ydCB7XG4gIG9wdGlvbmFsUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJztcblxuZXhwb3J0IHZhciBFZGl0b3IgPSBjbGFzcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG51bGw7XG4gICAgdGhpcy5fbGFuZyA9IG51bGw7XG4gIH1cblxuICBiaW5kZWRUbyhjb2Rld2F2ZSkge31cblxuICBcbiAgdGV4dCh2YWwpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dENoYXJBdChwb3MpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dExlbigpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgdGV4dFN1YnN0cihzdGFydCwgZW5kKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGluc2VydFRleHRBdCh0ZXh0LCBwb3MpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGdldEN1cnNvclBvcygpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQgPSBudWxsKSB7XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIjtcbiAgfVxuXG4gIGJlZ2luVW5kb0FjdGlvbigpIHt9XG5cbiAgXG4gIGVuZFVuZG9BY3Rpb24oKSB7fVxuXG4gIFxuICBnZXRMYW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICB9XG5cbiAgc2V0TGFuZyh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFuZyA9IHZhbDtcbiAgfVxuXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdCgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFsbG93TXVsdGlTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2V0TXVsdGlTZWwoc2VsZWN0aW9ucykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRNdWx0aVNlbCgpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0TGluZUF0KHBvcykge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMuZmluZExpbmVTdGFydChwb3MpLCB0aGlzLmZpbmRMaW5lRW5kKHBvcykpO1xuICB9XG5cbiAgZmluZExpbmVTdGFydChwb3MpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtcIlxcblwiXSwgLTEpO1xuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3MgKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICBmaW5kTGluZUVuZChwb3MpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtcIlxcblwiLCBcIlxcclwiXSk7XG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dExlbigpO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgdmFyIGJlc3RQb3MsIGJlc3RTdHIsIGksIGxlbiwgcG9zLCBzdHJpLCB0ZXh0O1xuICAgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0LCB0aGlzLnRleHRMZW4oKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoMCwgc3RhcnQpO1xuICAgIH1cbiAgICBiZXN0UG9zID0gbnVsbDtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzdHJpbmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzdHJpID0gc3RyaW5nc1tpXTtcbiAgICAgIHBvcyA9IGRpcmVjdGlvbiA+IDAgPyB0ZXh0LmluZGV4T2Yoc3RyaSkgOiB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpO1xuICAgICAgaWYgKHBvcyAhPT0gLTEpIHtcbiAgICAgICAgaWYgKChiZXN0UG9zID09IG51bGwpIHx8IGJlc3RQb3MgKiBkaXJlY3Rpb24gPiBwb3MgKiBkaXJlY3Rpb24pIHtcbiAgICAgICAgICBiZXN0UG9zID0gcG9zO1xuICAgICAgICAgIGJlc3RTdHIgPSBzdHJpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChiZXN0U3RyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3RyUG9zKChkaXJlY3Rpb24gPiAwID8gYmVzdFBvcyArIHN0YXJ0IDogYmVzdFBvcyksIGJlc3RTdHIpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cykge1xuICAgIHJldHVybiByZXBsYWNlbWVudHMucmVkdWNlKChwcm9taXNlLCByZXBsKSA9PiB7XG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKChvcHQpID0+IHtcbiAgICAgICAgcmVwbC53aXRoRWRpdG9yKHRoaXMpO1xuICAgICAgICByZXBsLmFwcGx5T2Zmc2V0KG9wdC5vZmZzZXQpO1xuICAgICAgICByZXR1cm4gb3B0aW9uYWxQcm9taXNlKHJlcGwuYXBwbHkoKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnM6IG9wdC5zZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpLFxuICAgICAgICAgICAgb2Zmc2V0OiBvcHQub2Zmc2V0ICsgcmVwbC5vZmZzZXRBZnRlcih0aGlzKVxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSwgb3B0aW9uYWxQcm9taXNlKHtcbiAgICAgIHNlbGVjdGlvbnM6IFtdLFxuICAgICAgb2Zmc2V0OiAwXG4gICAgfSkpLnRoZW4oKG9wdCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKG9wdC5zZWxlY3Rpb25zKTtcbiAgICB9KS5yZXN1bHQoKTtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhzZWxlY3Rpb25zKSB7XG4gICAgaWYgKHNlbGVjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHRoaXMuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldE11bHRpU2VsKHNlbGVjdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q3Vyc29yUG9zKHNlbGVjdGlvbnNbMF0uc3RhcnQsIHNlbGVjdGlvbnNbMF0uZW5kKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcbiIsImV4cG9ydCBjbGFzcyBMb2dnZXJcbiAgQGVuYWJsZWQgPSB0cnVlXG4gIGxvZzogKGFyZ3MuLi4pIC0+XG4gICAgaWYgQGlzRW5hYmxlZCgpXG4gICAgICBmb3IgbXNnIGluIGFyZ3NcbiAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICBpc0VuYWJsZWQ6IC0+XG4gICAgY29uc29sZT8ubG9nPyBhbmQgdGhpcy5lbmFibGVkIGFuZCBMb2dnZXIuZW5hYmxlZFxuICBlbmFibGVkOiB0cnVlXG4gIHJ1bnRpbWU6IChmdW5jdCxuYW1lID0gXCJmdW5jdGlvblwiKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGNvbnNvbGUubG9nKFwiI3tuYW1lfSB0b29rICN7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLlwiKVxuICAgIHJlc1xuICBtb25pdG9yRGF0YToge31cbiAgdG9Nb25pdG9yOiAob2JqLG5hbWUscHJlZml4PScnKSAtPlxuICAgIGZ1bmN0ID0gb2JqW25hbWVdXG4gICAgb2JqW25hbWVdID0gLT4gXG4gICAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgICB0aGlzLm1vbml0b3IoKC0+IGZ1bmN0LmFwcGx5KG9iaixhcmdzKSkscHJlZml4K25hbWUpXG4gIG1vbml0b3I6IChmdW5jdCxuYW1lKSAtPlxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGlmIHRoaXMubW9uaXRvckRhdGFbbmFtZV0/XG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLmNvdW50KytcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwrPSB0MSAtIHQwXG4gICAgZWxzZVxuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgY291bnQ6IDFcbiAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgIH1cbiAgICByZXNcbiAgcmVzdW1lOiAtPlxuICAgIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpXG4iLCJleHBvcnQgdmFyIExvZ2dlciA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgTG9nZ2VyIHtcbiAgICBsb2coLi4uYXJncykge1xuICAgICAgdmFyIGksIGxlbiwgbXNnLCByZXN1bHRzO1xuICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbXNnID0gYXJnc1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY29uc29sZS5sb2cobXNnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgcmV0dXJuICgodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZSAhPT0gbnVsbCA/IGNvbnNvbGUubG9nIDogdm9pZCAwKSAhPSBudWxsKSAmJiB0aGlzLmVuYWJsZWQgJiYgTG9nZ2VyLmVuYWJsZWQ7XG4gICAgfVxuXG4gICAgcnVudGltZShmdW5jdCwgbmFtZSA9IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgY29uc29sZS5sb2coYCR7bmFtZX0gdG9vayAke3QxIC0gdDB9IG1pbGxpc2Vjb25kcy5gKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgdG9Nb25pdG9yKG9iaiwgbmFtZSwgcHJlZml4ID0gJycpIHtcbiAgICAgIHZhciBmdW5jdDtcbiAgICAgIGZ1bmN0ID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIG9ialtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgcmV0dXJuIHRoaXMubW9uaXRvcigoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0LmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgIH0pLCBwcmVmaXggKyBuYW1lKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgbW9uaXRvcihmdW5jdCwgbmFtZSkge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgaWYgKHRoaXMubW9uaXRvckRhdGFbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLmNvdW50Kys7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwgKz0gdDEgLSB0MDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0gPSB7XG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgcmVzdW1lKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpO1xuICAgIH1cblxuICB9O1xuXG4gIExvZ2dlci5lbmFibGVkID0gdHJ1ZTtcblxuICBMb2dnZXIucHJvdG90eXBlLmVuYWJsZWQgPSB0cnVlO1xuXG4gIExvZ2dlci5wcm90b3R5cGUubW9uaXRvckRhdGEgPSB7fTtcblxuICByZXR1cm4gTG9nZ2VyO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiZXhwb3J0IGNsYXNzIE9wdGlvbk9iamVjdFxuICBzZXRPcHRzOiAob3B0aW9ucyxkZWZhdWx0cyktPlxuICAgIEBkZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgQHNldE9wdChrZXksb3B0aW9uc1trZXldKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0T3B0KGtleSx2YWwpXG4gICAgICAgIFxuICBzZXRPcHQ6IChrZXksIHZhbCktPlxuICAgIGlmIHRoaXNba2V5XT8uY2FsbD9cbiAgICAgIHRoaXNba2V5XSh2YWwpXG4gICAgZWxzZVxuICAgICAgdGhpc1trZXldPSB2YWxcbiAgICAgICAgXG4gIGdldE9wdDogKGtleSktPlxuICAgIGlmIHRoaXNba2V5XT8uY2FsbD9cbiAgICAgIHJldHVybiB0aGlzW2tleV0oKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0aGlzW2tleV1cbiAgXG4gIGdldE9wdHM6IC0+XG4gICAgb3B0cyA9IHt9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgb3B0c1trZXldID0gQGdldE9wdChrZXkpXG4gICAgcmV0dXJuIG9wdHMiLCJleHBvcnQgdmFyIE9wdGlvbk9iamVjdCA9IGNsYXNzIE9wdGlvbk9iamVjdCB7XG4gIHNldE9wdHMob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIga2V5LCByZWYsIHJlc3VsdHMsIHZhbDtcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCBvcHRpb25zW2tleV0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIHZhbCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIHNldE9wdChrZXksIHZhbCkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0odmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBnZXRPcHQoa2V5KSB7XG4gICAgdmFyIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdHMoKSB7XG4gICAgdmFyIGtleSwgb3B0cywgcmVmLCB2YWw7XG4gICAgb3B0cyA9IHt9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIG9wdHNba2V5XSA9IHRoaXMuZ2V0T3B0KGtleSk7XG4gICAgfVxuICAgIHJldHVybiBvcHRzO1xuICB9XG5cbn07XG4iLCIjIFtwYXdhXVxuIyAgIHJlcGxhY2UgJ3JlcGxhY2UoL1xcdC9nJyAncmVwbGFjZShcIlxcdFwiJ1xuXG5pbXBvcnQgeyBDbWRJbnN0YW5jZSB9IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi9Cb3hIZWxwZXInO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgU3RyUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9TdHJQb3MnO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgTmFtZXNwYWNlSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSBleHRlbmRzIENtZEluc3RhbmNlXG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlLEBwb3MsQHN0cikgLT5cbiAgICBzdXBlcigpXG4gICAgdW5sZXNzIEBpc0VtcHR5KClcbiAgICAgIEBfY2hlY2tDbG9zZXIoKVxuICAgICAgQG9wZW5pbmcgPSBAc3RyXG4gICAgICBAbm9CcmFja2V0ID0gQF9yZW1vdmVCcmFja2V0KEBzdHIpXG4gICAgICBAX3NwbGl0Q29tcG9uZW50cygpXG4gICAgICBAX2ZpbmRDbG9zaW5nKClcbiAgICAgIEBfY2hlY2tFbG9uZ2F0ZWQoKVxuICBfY2hlY2tDbG9zZXI6IC0+XG4gICAgbm9CcmFja2V0ID0gQF9yZW1vdmVCcmFja2V0KEBzdHIpXG4gICAgaWYgbm9CcmFja2V0LnN1YnN0cmluZygwLEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PSBAY29kZXdhdmUuY2xvc2VDaGFyIGFuZCBmID0gQF9maW5kT3BlbmluZ1BvcygpXG4gICAgICBAY2xvc2luZ1BvcyA9IG5ldyBTdHJQb3MoQHBvcywgQHN0cilcbiAgICAgIEBwb3MgPSBmLnBvc1xuICAgICAgQHN0ciA9IGYuc3RyXG4gIF9maW5kT3BlbmluZ1BvczogLT5cbiAgICBjbWROYW1lID0gQF9yZW1vdmVCcmFja2V0KEBzdHIpLnN1YnN0cmluZyhAY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aClcbiAgICBvcGVuaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBjbWROYW1lXG4gICAgY2xvc2luZyA9IEBzdHJcbiAgICBpZiBmID0gQGNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIoQHBvcyxvcGVuaW5nLGNsb3NpbmcsLTEpXG4gICAgICBmLnN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihmLnBvcyxAY29kZXdhdmUuZmluZE5leHRCcmFrZXQoZi5wb3MrZi5zdHIubGVuZ3RoKStAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gICAgICByZXR1cm4gZlxuICBfc3BsaXRDb21wb25lbnRzOiAtPlxuICAgIHBhcnRzID0gQG5vQnJhY2tldC5zcGxpdChcIiBcIik7XG4gICAgQGNtZE5hbWUgPSBwYXJ0cy5zaGlmdCgpXG4gICAgQHJhd1BhcmFtcyA9IHBhcnRzLmpvaW4oXCIgXCIpXG4gIF9wYXJzZVBhcmFtczoocGFyYW1zKSAtPlxuICAgIEBwYXJhbXMgPSBbXVxuICAgIEBuYW1lZCA9IEBnZXREZWZhdWx0cygpXG4gICAgaWYgQGNtZD9cbiAgICAgIG5hbWVUb1BhcmFtID0gQGdldE9wdGlvbignbmFtZVRvUGFyYW0nKVxuICAgICAgaWYgbmFtZVRvUGFyYW0/IFxuICAgICAgICBAbmFtZWRbbmFtZVRvUGFyYW1dID0gQGNtZE5hbWVcbiAgICBpZiBwYXJhbXMubGVuZ3RoXG4gICAgICBpZiBAY21kP1xuICAgICAgICBhbGxvd2VkTmFtZWQgPSBAZ2V0T3B0aW9uKCdhbGxvd2VkTmFtZWQnKSBcbiAgICAgIGluU3RyID0gZmFsc2VcbiAgICAgIHBhcmFtID0gJydcbiAgICAgIG5hbWUgPSBmYWxzZVxuICAgICAgZm9yIGkgaW4gWzAuLihwYXJhbXMubGVuZ3RoLTEpXVxuICAgICAgICBjaHIgPSBwYXJhbXNbaV1cbiAgICAgICAgaWYgY2hyID09ICcgJyBhbmQgIWluU3RyXG4gICAgICAgICAgaWYobmFtZSlcbiAgICAgICAgICAgIEBuYW1lZFtuYW1lXSA9IHBhcmFtXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHBhcmFtcy5wdXNoKHBhcmFtKVxuICAgICAgICAgIHBhcmFtID0gJydcbiAgICAgICAgICBuYW1lID0gZmFsc2VcbiAgICAgICAgZWxzZSBpZiBjaHIgaW4gWydcIicsXCInXCJdIGFuZCAoaSA9PSAwIG9yIHBhcmFtc1tpLTFdICE9ICdcXFxcJylcbiAgICAgICAgICBpblN0ciA9ICFpblN0clxuICAgICAgICBlbHNlIGlmIGNociA9PSAnOicgYW5kICFuYW1lIGFuZCAhaW5TdHIgYW5kICghYWxsb3dlZE5hbWVkPyBvciBuYW1lIGluIGFsbG93ZWROYW1lZClcbiAgICAgICAgICBuYW1lID0gcGFyYW1cbiAgICAgICAgICBwYXJhbSA9ICcnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwYXJhbSArPSBjaHJcbiAgICAgIGlmIHBhcmFtLmxlbmd0aFxuICAgICAgICBpZihuYW1lKVxuICAgICAgICAgIEBuYW1lZFtuYW1lXSA9IHBhcmFtXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcGFyYW1zLnB1c2gocGFyYW0pXG4gIF9maW5kQ2xvc2luZzogLT5cbiAgICBpZiBmID0gQF9maW5kQ2xvc2luZ1BvcygpXG4gICAgICBAY29udGVudCA9IFN0cmluZ0hlbHBlci50cmltRW1wdHlMaW5lKEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zK0BzdHIubGVuZ3RoLGYucG9zKSlcbiAgICAgIEBzdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyxmLnBvcytmLnN0ci5sZW5ndGgpXG4gIF9maW5kQ2xvc2luZ1BvczogLT5cbiAgICByZXR1cm4gQGNsb3NpbmdQb3MgaWYgQGNsb3NpbmdQb3M/XG4gICAgY2xvc2luZyA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjbWROYW1lICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICBvcGVuaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY21kTmFtZVxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zK0BzdHIubGVuZ3RoLCBvcGVuaW5nLCBjbG9zaW5nKVxuICAgICAgcmV0dXJuIEBjbG9zaW5nUG9zID0gZlxuICBfY2hlY2tFbG9uZ2F0ZWQ6IC0+XG4gICAgZW5kUG9zID0gQGdldEVuZFBvcygpXG4gICAgbWF4ID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0TGVuKClcbiAgICB3aGlsZSBlbmRQb3MgPCBtYXggYW5kIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsZW5kUG9zK0Bjb2Rld2F2ZS5kZWNvLmxlbmd0aCkgPT0gQGNvZGV3YXZlLmRlY29cbiAgICAgIGVuZFBvcys9QGNvZGV3YXZlLmRlY28ubGVuZ3RoXG4gICAgaWYgZW5kUG9zID49IG1heCBvciBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyBAY29kZXdhdmUuZGVjby5sZW5ndGgpIGluIFsnICcsXCJcXG5cIixcIlxcclwiXVxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGVuZFBvcylcbiAgX2NoZWNrQm94OiAtPlxuICAgIGlmIEBjb2Rld2F2ZS5pbkluc3RhbmNlPyBhbmQgQGNvZGV3YXZlLmluSW5zdGFuY2UuY21kLm5hbWUgPT0gJ2NvbW1lbnQnXG4gICAgICByZXR1cm5cbiAgICBjbCA9IEBjb250ZXh0LndyYXBDb21tZW50TGVmdCgpXG4gICAgY3IgPSBAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KClcbiAgICBlbmRQb3MgPSBAZ2V0RW5kUG9zKCkgKyBjci5sZW5ndGhcbiAgICBpZiBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyAtIGNsLmxlbmd0aCxAcG9zKSA9PSBjbCBhbmQgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyAtIGNyLmxlbmd0aCxlbmRQb3MpID09IGNyXG4gICAgICBAcG9zID0gQHBvcyAtIGNsLmxlbmd0aFxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGVuZFBvcylcbiAgICAgIEBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KClcbiAgICBlbHNlIGlmIEBnZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKS5pbmRleE9mKGNsKSA+IC0xIGFuZCBAZ2V0UG9zKCkuc2FtZUxpbmVzU3VmZml4KCkuaW5kZXhPZihjcikgPiAtMVxuICAgICAgQGluQm94ID0gMVxuICAgICAgQF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50OiAtPlxuICAgIGlmIEBjb250ZW50XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdCgpKVxuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpXG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvZGV3YXZlLmRlY28pXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKiN7ZWNsfSg/OiN7ZWR9KStcXFxccyooLio/KVxcXFxzKig/OiN7ZWR9KSsje2Vjcn0kXCIsIFwiZ21cIikgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgJ1wiZ21cIicgcmUuTVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChcIl5cXFxccyooPzoje2VkfSkqI3tlY3J9XFxyP1xcblwiKVxuICAgICAgcmUzID0gbmV3IFJlZ0V4cChcIlxcblxcXFxzKiN7ZWNsfSg/OiN7ZWR9KSpcXFxccyokXCIpXG4gICAgICBAY29udGVudCA9IEBjb250ZW50LnJlcGxhY2UocmUxLCckMScpLnJlcGxhY2UocmUyLCcnKS5yZXBsYWNlKHJlMywnJylcbiAgX2dldFBhcmVudENtZHM6IC0+XG4gICAgQHBhcmVudCA9IEBjb2Rld2F2ZS5nZXRFbmNsb3NpbmdDbWQoQGdldEVuZFBvcygpKT8uaW5pdCgpXG4gIHNldE11bHRpUG9zOiAobXVsdGlQb3MpIC0+XG4gICAgQG11bHRpUG9zID0gbXVsdGlQb3NcbiAgX2dldENtZE9iajogLT5cbiAgICBAZ2V0Q21kKClcbiAgICBAX2NoZWNrQm94KClcbiAgICBAY29udGVudCA9IEByZW1vdmVJbmRlbnRGcm9tQ29udGVudChAY29udGVudClcbiAgICBzdXBlcigpXG4gIF9pbml0UGFyYW1zOiAtPlxuICAgIEBfcGFyc2VQYXJhbXMoQHJhd1BhcmFtcylcbiAgZ2V0Q29udGV4dDogLT5cbiAgICByZXR1cm4gQGNvbnRleHQgb3IgQGNvZGV3YXZlLmNvbnRleHRcbiAgZ2V0Q21kOiAtPlxuICAgIHVubGVzcyBAY21kP1xuICAgICAgQF9nZXRQYXJlbnRDbWRzKClcbiAgICAgIGlmIEBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIubGVuZ3RoKSA9PSBAY29kZXdhdmUubm9FeGVjdXRlQ2hhclxuICAgICAgICBAY21kID0gQ29tbWFuZC5jbWRzLmdldENtZCgnY29yZTpub19leGVjdXRlJylcbiAgICAgICAgQGNvbnRleHQgPSBAY29kZXdhdmUuY29udGV4dFxuICAgICAgZWxzZVxuICAgICAgICBAZmluZGVyID0gQGdldEZpbmRlcihAY21kTmFtZSlcbiAgICAgICAgQGNvbnRleHQgPSBAZmluZGVyLmNvbnRleHRcbiAgICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgICAgIGlmIEBjbWQ/XG4gICAgICAgICAgQGNvbnRleHQuYWRkTmFtZVNwYWNlKEBjbWQuZnVsbE5hbWUpXG4gICAgcmV0dXJuIEBjbWRcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBjb2Rld2F2ZS5jb250ZXh0LmdldEZpbmRlcihjbWROYW1lLEBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzOiAtPlxuICAgIG5zcGNzID0gW11cbiAgICBvYmogPSB0aGlzXG4gICAgd2hpbGUgb2JqLnBhcmVudD9cbiAgICAgIG9iaiA9IG9iai5wYXJlbnRcbiAgICAgIG5zcGNzLnB1c2gob2JqLmNtZC5mdWxsTmFtZSkgaWYgb2JqLmNtZD8gYW5kIG9iai5jbWQuZnVsbE5hbWU/XG4gICAgcmV0dXJuIG5zcGNzXG4gIF9yZW1vdmVCcmFja2V0OiAoc3RyKS0+XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoLHN0ci5sZW5ndGgtQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKVxuICBhbHRlckFsaWFzT2Y6IChhbGlhc09mKS0+XG4gICAgW25zcGMsIGNtZE5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0KEBjbWROYW1lKVxuICAgIHJldHVybiBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsY21kTmFtZSlcbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQHN0ciA9PSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY29kZXdhdmUuYnJha2V0cyBvciBAc3RyID09IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgZXhlY3V0ZTogLT5cbiAgICBpZiBAaXNFbXB0eSgpXG4gICAgICBpZiBAY29kZXdhdmUuY2xvc2luZ1Byb21wPyBhbmQgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcC53aGl0aGluT3BlbkJvdW5kcyhAcG9zICsgQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKT9cbiAgICAgICAgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcC5jYW5jZWwoKVxuICAgICAgZWxzZVxuICAgICAgICBAcmVwbGFjZVdpdGgoJycpXG4gICAgZWxzZSBpZiBAY21kP1xuICAgICAgaWYgYmVmb3JlRnVuY3QgPSBAZ2V0T3B0aW9uKCdiZWZvcmVFeGVjdXRlJylcbiAgICAgICAgYmVmb3JlRnVuY3QodGhpcylcbiAgICAgIGlmIEByZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICAgIGlmIChyZXMgPSBAcmVzdWx0KCkpP1xuICAgICAgICAgIEByZXBsYWNlV2l0aChyZXMpXG4gICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIEBydW5FeGVjdXRlRnVuY3QoKVxuICBnZXRFbmRQb3M6IC0+XG4gICAgcmV0dXJuIEBwb3MrQHN0ci5sZW5ndGhcbiAgZ2V0UG9zOiAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBwb3MsQHBvcytAc3RyLmxlbmd0aCkud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICBnZXRPcGVuaW5nUG9zOiAtPlxuICAgIHJldHVybiBuZXcgUG9zKEBwb3MsQHBvcytAb3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHVubGVzcyBAaW5kZW50TGVuP1xuICAgICAgaWYgQGluQm94P1xuICAgICAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgICAgICBAaW5kZW50TGVuID0gaGVscGVyLnJlbW92ZUNvbW1lbnQoQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGhcbiAgICAgIGVsc2VcbiAgICAgICAgQGluZGVudExlbiA9IEBwb3MgLSBAZ2V0UG9zKCkucHJldkVPTCgpXG4gICAgcmV0dXJuIEBpbmRlbnRMZW5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQ6ICh0ZXh0KSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKCdeXFxcXHN7JytAZ2V0SW5kZW50KCkrJ30nLCdnbScpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywnJylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBhbHRlclJlc3VsdEZvckJveDogKHJlcGwpIC0+XG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKVxuICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGNvbnRleHQpXG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksZmFsc2UpXG4gICAgaWYgQGdldE9wdGlvbigncmVwbGFjZUJveCcpXG4gICAgICBib3ggPSBoZWxwZXIuZ2V0Qm94Rm9yUG9zKG9yaWdpbmFsKVxuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdXG4gICAgICBAaW5kZW50TGVuID0gaGVscGVyLmluZGVudFxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBlbHNlXG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgICAgcmVwbC5zdGFydCA9IG9yaWdpbmFsLnByZXZFT0woKVxuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKClcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgQGNvZGV3YXZlLm1hcmtlciArIHJlcGwudGV4dCArIEBjb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge211bHRpbGluZTpmYWxzZX0pXG4gICAgICBbcmVwbC5wcmVmaXgscmVwbC50ZXh0LHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdChAY29kZXdhdmUubWFya2VyKVxuICAgIHJldHVybiByZXBsXG4gIGdldEN1cnNvckZyb21SZXN1bHQ6IChyZXBsKSAtPlxuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KClcbiAgICBpZiBAY21kPyBhbmQgQGNvZGV3YXZlLmNoZWNrQ2FycmV0IGFuZCBAZ2V0T3B0aW9uKCdjaGVja0NhcnJldCcpXG4gICAgICBpZiAocCA9IEBjb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSk/IFxuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0K3JlcGwucHJlZml4Lmxlbmd0aCtwXG4gICAgICByZXBsLnRleHQgPSBAY29kZXdhdmUucmVtb3ZlQ2FycmV0KHJlcGwudGV4dClcbiAgICByZXR1cm4gY3Vyc29yUG9zXG4gIGNoZWNrTXVsdGk6IChyZXBsKSAtPlxuICAgIGlmIEBtdWx0aVBvcz8gYW5kIEBtdWx0aVBvcy5sZW5ndGggPiAxXG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF1cbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KClcbiAgICAgIGZvciBwb3MsIGkgaW4gQG11bHRpUG9zXG4gICAgICAgIGlmIGkgPT0gMFxuICAgICAgICAgIG9yaWdpbmFsUG9zID0gcG9zLnN0YXJ0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0LW9yaWdpbmFsUG9zKVxuICAgICAgICAgIGlmIG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT0gb3JpZ2luYWxUZXh0XG4gICAgICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXdSZXBsKVxuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50c1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBbcmVwbF1cbiAgcmVwbGFjZVdpdGg6ICh0ZXh0KSAtPlxuICAgIEBhcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChAcG9zLEBnZXRFbmRQb3MoKSx0ZXh0KSlcbiAgYXBwbHlSZXBsYWNlbWVudDogKHJlcGwpIC0+XG4gICAgcmVwbC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gICAgaWYgQGluQm94P1xuICAgICAgQGFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBjdXJzb3JQb3MgPSBAZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKVxuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKGN1cnNvclBvcywgY3Vyc29yUG9zKV1cbiAgICByZXBsYWNlbWVudHMgPSBAY2hlY2tNdWx0aShyZXBsKVxuICAgIEByZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0XG4gICAgQHJlcGxhY2VFbmQgPSByZXBsLnJlc0VuZCgpXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gICAgIiwiLy8gW3Bhd2FdXG4vLyAgIHJlcGxhY2UgJ3JlcGxhY2UoL1xcdC9nJyAncmVwbGFjZShcIlxcdFwiJ1xudmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xuXG5pbXBvcnQge1xuICBDbWRJbnN0YW5jZVxufSBmcm9tICcuL0NtZEluc3RhbmNlJztcblxuaW1wb3J0IHtcbiAgQm94SGVscGVyXG59IGZyb20gJy4vQm94SGVscGVyJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgU3RyUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgTmFtZXNwYWNlSGVscGVyXG59IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5pbXBvcnQge1xuICBDb21tYW5kXG59IGZyb20gJy4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgUG9zaXRpb25lZENtZEluc3RhbmNlID0gY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSwgcG9zMSwgc3RyMSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlO1xuICAgIHRoaXMucG9zID0gcG9zMTtcbiAgICB0aGlzLnN0ciA9IHN0cjE7XG4gICAgaWYgKCF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgdGhpcy5fY2hlY2tDbG9zZXIoKTtcbiAgICAgIHRoaXMub3BlbmluZyA9IHRoaXMuc3RyO1xuICAgICAgdGhpcy5ub0JyYWNrZXQgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKTtcbiAgICAgIHRoaXMuX3NwbGl0Q29tcG9uZW50cygpO1xuICAgICAgdGhpcy5fZmluZENsb3NpbmcoKTtcbiAgICAgIHRoaXMuX2NoZWNrRWxvbmdhdGVkKCk7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrQ2xvc2VyKCkge1xuICAgIHZhciBmLCBub0JyYWNrZXQ7XG4gICAgbm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cik7XG4gICAgaWYgKG5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgJiYgKGYgPSB0aGlzLl9maW5kT3BlbmluZ1BvcygpKSkge1xuICAgICAgdGhpcy5jbG9zaW5nUG9zID0gbmV3IFN0clBvcyh0aGlzLnBvcywgdGhpcy5zdHIpO1xuICAgICAgdGhpcy5wb3MgPSBmLnBvcztcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IGYuc3RyO1xuICAgIH1cbiAgfVxuXG4gIF9maW5kT3BlbmluZ1BvcygpIHtcbiAgICB2YXIgY2xvc2luZywgY21kTmFtZSwgZiwgb3BlbmluZztcbiAgICBjbWROYW1lID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cikuc3Vic3RyaW5nKHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCk7XG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWU7XG4gICAgY2xvc2luZyA9IHRoaXMuc3RyO1xuICAgIGlmIChmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zLCBvcGVuaW5nLCBjbG9zaW5nLCAtMSkpIHtcbiAgICAgIGYuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihmLnBvcywgdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcyArIGYuc3RyLmxlbmd0aCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKTtcbiAgICAgIHJldHVybiBmO1xuICAgIH1cbiAgfVxuXG4gIF9zcGxpdENvbXBvbmVudHMoKSB7XG4gICAgdmFyIHBhcnRzO1xuICAgIHBhcnRzID0gdGhpcy5ub0JyYWNrZXQuc3BsaXQoXCIgXCIpO1xuICAgIHRoaXMuY21kTmFtZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHRoaXMucmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIik7XG4gIH1cblxuICBfcGFyc2VQYXJhbXMocGFyYW1zKSB7XG4gICAgdmFyIGFsbG93ZWROYW1lZCwgY2hyLCBpLCBpblN0ciwgaiwgbmFtZSwgbmFtZVRvUGFyYW0sIHBhcmFtLCByZWY7XG4gICAgdGhpcy5wYXJhbXMgPSBbXTtcbiAgICB0aGlzLm5hbWVkID0gdGhpcy5nZXREZWZhdWx0cygpO1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBuYW1lVG9QYXJhbSA9IHRoaXMuZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpO1xuICAgICAgaWYgKG5hbWVUb1BhcmFtICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5uYW1lZFtuYW1lVG9QYXJhbV0gPSB0aGlzLmNtZE5hbWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJhbXMubGVuZ3RoKSB7XG4gICAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgICBhbGxvd2VkTmFtZWQgPSB0aGlzLmdldE9wdGlvbignYWxsb3dlZE5hbWVkJyk7XG4gICAgICB9XG4gICAgICBpblN0ciA9IGZhbHNlO1xuICAgICAgcGFyYW0gPSAnJztcbiAgICAgIG5hbWUgPSBmYWxzZTtcbiAgICAgIGZvciAoaSA9IGogPSAwLCByZWYgPSBwYXJhbXMubGVuZ3RoIC0gMTsgKDAgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGkgPSAwIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgICBjaHIgPSBwYXJhbXNbaV07XG4gICAgICAgIGlmIChjaHIgPT09ICcgJyAmJiAhaW5TdHIpIHtcbiAgICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgdGhpcy5uYW1lZFtuYW1lXSA9IHBhcmFtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcy5wdXNoKHBhcmFtKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyYW0gPSAnJztcbiAgICAgICAgICBuYW1lID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoKGNociA9PT0gJ1wiJyB8fCBjaHIgPT09IFwiJ1wiKSAmJiAoaSA9PT0gMCB8fCBwYXJhbXNbaSAtIDFdICE9PSAnXFxcXCcpKSB7XG4gICAgICAgICAgaW5TdHIgPSAhaW5TdHI7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hyID09PSAnOicgJiYgIW5hbWUgJiYgIWluU3RyICYmICgoYWxsb3dlZE5hbWVkID09IG51bGwpIHx8IGluZGV4T2YuY2FsbChhbGxvd2VkTmFtZWQsIG5hbWUpID49IDApKSB7XG4gICAgICAgICAgbmFtZSA9IHBhcmFtO1xuICAgICAgICAgIHBhcmFtID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyYW0gKz0gY2hyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocGFyYW0ubGVuZ3RoKSB7XG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSBwYXJhbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXMucHVzaChwYXJhbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmcoKSB7XG4gICAgdmFyIGY7XG4gICAgaWYgKGYgPSB0aGlzLl9maW5kQ2xvc2luZ1BvcygpKSB7XG4gICAgICB0aGlzLmNvbnRlbnQgPSBTdHJpbmdIZWxwZXIudHJpbUVtcHR5TGluZSh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBmLnBvcykpO1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZi5wb3MgKyBmLnN0ci5sZW5ndGgpO1xuICAgIH1cbiAgfVxuXG4gIF9maW5kQ2xvc2luZ1BvcygpIHtcbiAgICB2YXIgY2xvc2luZywgZiwgb3BlbmluZztcbiAgICBpZiAodGhpcy5jbG9zaW5nUG9zICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3M7XG4gICAgfVxuICAgIGNsb3NpbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY21kTmFtZSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWROYW1lO1xuICAgIGlmIChmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBvcGVuaW5nLCBjbG9zaW5nKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1BvcyA9IGY7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrRWxvbmdhdGVkKCkge1xuICAgIHZhciBlbmRQb3MsIG1heCwgcmVmO1xuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCk7XG4gICAgbWF4ID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpO1xuICAgIHdoaWxlIChlbmRQb3MgPCBtYXggJiYgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmRlY28pIHtcbiAgICAgIGVuZFBvcyArPSB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoO1xuICAgIH1cbiAgICBpZiAoZW5kUG9zID49IG1heCB8fCAoKHJlZiA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSkgPT09ICcgJyB8fCByZWYgPT09IFwiXFxuXCIgfHwgcmVmID09PSBcIlxcclwiKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKTtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tCb3goKSB7XG4gICAgdmFyIGNsLCBjciwgZW5kUG9zO1xuICAgIGlmICgodGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpICYmIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PT0gJ2NvbW1lbnQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsID0gdGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCgpO1xuICAgIGNyID0gdGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKTtcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpICsgY3IubGVuZ3RoO1xuICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zIC0gY2wubGVuZ3RoLCB0aGlzLnBvcykgPT09IGNsICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLCBlbmRQb3MpID09PSBjcikge1xuICAgICAgdGhpcy5wb3MgPSB0aGlzLnBvcyAtIGNsLmxlbmd0aDtcbiAgICAgIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKTtcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkuaW5kZXhPZihjbCkgPiAtMSAmJiB0aGlzLmdldFBvcygpLnNhbWVMaW5lc1N1ZmZpeCgpLmluZGV4T2YoY3IpID4gLTEpIHtcbiAgICAgIHRoaXMuaW5Cb3ggPSAxO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKSB7XG4gICAgdmFyIGVjbCwgZWNyLCBlZCwgcmUxLCByZTIsIHJlMztcbiAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29kZXdhdmUuZGVjbyk7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86JHtlZH0pKyR7ZWNyfSRgLCBcImdtXCIpOyAvLyBbcGF3YSBweXRob25dIHJlcGxhY2UgJ1wiZ21cIicgcmUuTVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXlxcXFxzKig/OiR7ZWR9KSoke2Vjcn1cXHI/XFxuYCk7XG4gICAgICByZTMgPSBuZXcgUmVnRXhwKGBcXG5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHMqJGApO1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudC5yZXBsYWNlKHJlMSwgJyQxJykucmVwbGFjZShyZTIsICcnKS5yZXBsYWNlKHJlMywgJycpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRQYXJlbnRDbWRzKCkge1xuICAgIHZhciByZWY7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID0gKHJlZiA9IHRoaXMuY29kZXdhdmUuZ2V0RW5jbG9zaW5nQ21kKHRoaXMuZ2V0RW5kUG9zKCkpKSAhPSBudWxsID8gcmVmLmluaXQoKSA6IHZvaWQgMDtcbiAgfVxuXG4gIHNldE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlQb3MgPSBtdWx0aVBvcztcbiAgfVxuXG4gIF9nZXRDbWRPYmooKSB7XG4gICAgdGhpcy5nZXRDbWQoKTtcbiAgICB0aGlzLl9jaGVja0JveCgpO1xuICAgIHRoaXMuY29udGVudCA9IHRoaXMucmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGhpcy5jb250ZW50KTtcbiAgICByZXR1cm4gc3VwZXIuX2dldENtZE9iaigpO1xuICB9XG5cbiAgX2luaXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlUGFyYW1zKHRoaXMucmF3UGFyYW1zKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCB0aGlzLmNvZGV3YXZlLmNvbnRleHQ7XG4gIH1cblxuICBnZXRDbWQoKSB7XG4gICAgaWYgKHRoaXMuY21kID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2dldFBhcmVudENtZHMoKTtcbiAgICAgIGlmICh0aGlzLm5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikge1xuICAgICAgICB0aGlzLmNtZCA9IENvbW1hbmQuY21kcy5nZXRDbWQoJ2NvcmU6bm9fZXhlY3V0ZScpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSk7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZmluZGVyLmNvbnRleHQ7XG4gICAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpO1xuICAgICAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5jbWQuZnVsbE5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNtZDtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsIHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKSk7XG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gZmluZGVyO1xuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMoKSB7XG4gICAgdmFyIG5zcGNzLCBvYmo7XG4gICAgbnNwY3MgPSBbXTtcbiAgICBvYmogPSB0aGlzO1xuICAgIHdoaWxlIChvYmoucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IG9iai5wYXJlbnQ7XG4gICAgICBpZiAoKG9iai5jbWQgIT0gbnVsbCkgJiYgKG9iai5jbWQuZnVsbE5hbWUgIT0gbnVsbCkpIHtcbiAgICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5zcGNzO1xuICB9XG5cbiAgX3JlbW92ZUJyYWNrZXQoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcodGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCwgc3RyLmxlbmd0aCAtIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpO1xuICB9XG5cbiAgYWx0ZXJBbGlhc09mKGFsaWFzT2YpIHtcbiAgICB2YXIgY21kTmFtZSwgbnNwYztcbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQodGhpcy5jbWROYW1lKTtcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBjbWROYW1lKTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cyB8fCB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgYmVmb3JlRnVuY3QsIHJlcztcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIGlmICgodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgIT0gbnVsbCkgJiYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKHRoaXMucG9zICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCkgIT0gbnVsbCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgoJycpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKGJlZm9yZUZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKSkge1xuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgaWYgKChyZXMgPSB0aGlzLnJlc3VsdCgpKSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgocmVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRXhlY3V0ZUZ1bmN0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RW5kUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aDtcbiAgfVxuXG4gIGdldFBvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICB9XG5cbiAgZ2V0T3BlbmluZ1BvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLm9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcbiAgfVxuXG4gIGdldEluZGVudCgpIHtcbiAgICB2YXIgaGVscGVyO1xuICAgIGlmICh0aGlzLmluZGVudExlbiA9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5pbkJveCAhPSBudWxsKSB7XG4gICAgICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0KTtcbiAgICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIucmVtb3ZlQ29tbWVudCh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IHRoaXMucG9zIC0gdGhpcy5nZXRQb3MoKS5wcmV2RU9MKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluZGVudExlbjtcbiAgfVxuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50KHRleHQpIHtcbiAgICB2YXIgcmVnO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoJ15cXFxcc3snICsgdGhpcy5nZXRJbmRlbnQoKSArICd9JywgJ2dtJyk7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhbHRlclJlc3VsdEZvckJveChyZXBsKSB7XG4gICAgdmFyIGJveCwgaGVscGVyLCBvcmlnaW5hbCwgcmVzO1xuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KCk7XG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLCBmYWxzZSk7XG4gICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCdyZXBsYWNlQm94JykpIHtcbiAgICAgIGJveCA9IGhlbHBlci5nZXRCb3hGb3JQb3Mob3JpZ2luYWwpO1xuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdO1xuICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIuaW5kZW50O1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgICByZXBsLnN0YXJ0ID0gb3JpZ2luYWwucHJldkVPTCgpO1xuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKCk7XG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIHRoaXMuY29kZXdhdmUubWFya2VyICsgcmVwbC50ZXh0ICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge1xuICAgICAgICBtdWx0aWxpbmU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIFtyZXBsLnByZWZpeCwgcmVwbC50ZXh0LCByZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQodGhpcy5jb2Rld2F2ZS5tYXJrZXIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVwbDtcbiAgfVxuXG4gIGdldEN1cnNvckZyb21SZXN1bHQocmVwbCkge1xuICAgIHZhciBjdXJzb3JQb3MsIHA7XG4gICAgY3Vyc29yUG9zID0gcmVwbC5yZXNQb3NCZWZvcmVQcmVmaXgoKTtcbiAgICBpZiAoKHRoaXMuY21kICE9IG51bGwpICYmIHRoaXMuY29kZXdhdmUuY2hlY2tDYXJyZXQgJiYgdGhpcy5nZXRPcHRpb24oJ2NoZWNrQ2FycmV0JykpIHtcbiAgICAgIGlmICgocCA9IHRoaXMuY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCArIHJlcGwucHJlZml4Lmxlbmd0aCArIHA7XG4gICAgICB9XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gY3Vyc29yUG9zO1xuICB9XG5cbiAgY2hlY2tNdWx0aShyZXBsKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV3UmVwbCwgb3JpZ2luYWxQb3MsIG9yaWdpbmFsVGV4dCwgcG9zLCByZWYsIHJlcGxhY2VtZW50cztcbiAgICBpZiAoKHRoaXMubXVsdGlQb3MgIT0gbnVsbCkgJiYgdGhpcy5tdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF07XG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpO1xuICAgICAgcmVmID0gdGhpcy5tdWx0aVBvcztcbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgIHBvcyA9IHJlZltpXTtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0IC0gb3JpZ2luYWxQb3MpO1xuICAgICAgICAgIGlmIChuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09PSBvcmlnaW5hbFRleHQpIHtcbiAgICAgICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ld1JlcGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtyZXBsXTtcbiAgICB9XG4gIH1cblxuICByZXBsYWNlV2l0aCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQodGhpcy5wb3MsIHRoaXMuZ2V0RW5kUG9zKCksIHRleHQpKTtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnQocmVwbCkge1xuICAgIHZhciBjdXJzb3JQb3MsIHJlcGxhY2VtZW50cztcbiAgICByZXBsLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYWx0ZXJSZXN1bHRGb3JCb3gocmVwbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICB9XG4gICAgY3Vyc29yUG9zID0gdGhpcy5nZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpO1xuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKGN1cnNvclBvcywgY3Vyc29yUG9zKV07XG4gICAgcmVwbGFjZW1lbnRzID0gdGhpcy5jaGVja011bHRpKHJlcGwpO1xuICAgIHRoaXMucmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydDtcbiAgICB0aGlzLnJlcGxhY2VFbmQgPSByZXBsLnJlc0VuZCgpO1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUHJvY2Vzc1xuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAjIiwiXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcic7XG5cbmV4cG9ydCBjbGFzcyBTdG9yYWdlXG4gIGNvbnN0cnVjdG9yOiAoQGVuZ2luZSkgLT5cblxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBpZiBAZW5naW5lQXZhaWxhYmxlKClcbiAgICAgIEBlbmdpbmUuc2F2ZShrZXksdmFsKVxuXG4gIGxvYWQ6IChrZXkpIC0+XG4gICAgaWYgQGVuZ2luZUF2YWlsYWJsZSgpXG4gICAgICBAZW5naW5lLmxvYWQoa2V5KVxuXG4gIGVuZ2luZUF2YWlsYWJsZTogKCkgLT5cbiAgICBpZiBlbmdpbmU/XG4gICAgICB0cnVlXG4gICAgZWxzZVxuICAgICAgQGxvZ2dlciA9IEBsb2dnZXIgfHwgbmV3IExvZ2dlcigpXG4gICAgICBAbG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJylcbiAgICAgIGZhbHNlXG4gICAgIiwiaW1wb3J0IHtcbiAgTG9nZ2VyXG59IGZyb20gJy4vTG9nZ2VyJztcblxuZXhwb3J0IHZhciBTdG9yYWdlID0gY2xhc3MgU3RvcmFnZSB7XG4gIGNvbnN0cnVjdG9yKGVuZ2luZTEpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTE7XG4gIH1cblxuICBzYXZlKGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5zYXZlKGtleSwgdmFsKTtcbiAgICB9XG4gIH1cblxuICBsb2FkKGtleSkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUubG9hZChrZXkpO1xuICAgIH1cbiAgfVxuXG4gIGVuZ2luZUF2YWlsYWJsZSgpIHtcbiAgICBpZiAodHlwZW9mIGVuZ2luZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlbmdpbmUgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlciA9IHRoaXMubG9nZ2VyIHx8IG5ldyBMb2dnZXIoKTtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IGNsYXNzIERvbUtleUxpc3RlbmVyXG4gIHN0YXJ0TGlzdGVuaW5nOiAodGFyZ2V0KSAtPlxuICBcbiAgICB0aW1lb3V0ID0gbnVsbFxuICAgIFxuICAgIG9ua2V5ZG93biA9IChlKSA9PiBcbiAgICAgIGlmIChDb2Rld2F2ZS5pbnN0YW5jZXMubGVuZ3RoIDwgMiBvciBAb2JqID09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIGFuZCBlLmtleUNvZGUgPT0gNjkgJiYgZS5jdHJsS2V5XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBpZiBAb25BY3RpdmF0aW9uS2V5P1xuICAgICAgICAgIEBvbkFjdGl2YXRpb25LZXkoKVxuICAgIG9ua2V5dXAgPSAoZSkgPT4gXG4gICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgIG9ua2V5cHJlc3MgPSAoZSkgPT4gXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCkgaWYgdGltZW91dD9cbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0ICg9PlxuICAgICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgICAgQG9uQW55Q2hhbmdlKGUpXG4gICAgICApLCAxMDBcbiAgICAgICAgICAgIFxuICAgIGlmIHRhcmdldC5hZGRFdmVudExpc3RlbmVyXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuICAgIGVsc2UgaWYgdGFyZ2V0LmF0dGFjaEV2ZW50XG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuXG5pc0VsZW1lbnQgPSAob2JqKSAtPlxuICB0cnlcbiAgICAjIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tKVxuICAgIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gIGNhdGNoIGVcbiAgICAjIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAjIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAjIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcbiAgICByZXR1cm4gKHR5cGVvZiBvYmo9PVwib2JqZWN0XCIpICYmXG4gICAgICAob2JqLm5vZGVUeXBlPT0xKSAmJiAodHlwZW9mIG9iai5zdHlsZSA9PSBcIm9iamVjdFwiKSAmJlxuICAgICAgKHR5cGVvZiBvYmoub3duZXJEb2N1bWVudCA9PVwib2JqZWN0XCIpXG5cbiAgICAgICAgXG5leHBvcnQgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyXG4gIGNvbnN0cnVjdG9yOiAoQHRhcmdldCkgLT5cbiAgICBzdXBlcigpXG4gICAgQG9iaiA9IGlmIGlzRWxlbWVudChAdGFyZ2V0KSB0aGVuIEB0YXJnZXQgZWxzZSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChAdGFyZ2V0KVxuICAgIHVubGVzcyBAb2JqP1xuICAgICAgdGhyb3cgXCJUZXh0QXJlYSBub3QgZm91bmRcIlxuICAgIEBuYW1lc3BhY2UgPSAndGV4dGFyZWEnXG4gICAgQGNoYW5nZUxpc3RlbmVycyA9IFtdXG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgPSAwXG4gIHN0YXJ0TGlzdGVuaW5nOiBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmdcbiAgb25BbnlDaGFuZ2U6IChlKSAtPlxuICAgIGlmIEBfc2tpcENoYW5nZUV2ZW50IDw9IDBcbiAgICAgIGZvciBjYWxsYmFjayBpbiBAY2hhbmdlTGlzdGVuZXJzXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICBlbHNlXG4gICAgICBAX3NraXBDaGFuZ2VFdmVudC0tXG4gICAgICBAb25Ta2lwZWRDaGFuZ2UoKSBpZiBAb25Ta2lwZWRDaGFuZ2U/XG4gIHNraXBDaGFuZ2VFdmVudDogKG5iID0gMSkgLT5cbiAgICBAX3NraXBDaGFuZ2VFdmVudCArPSBuYlxuICBiaW5kZWRUbzogKGNvZGV3YXZlKSAtPlxuICAgIEBvbkFjdGl2YXRpb25LZXkgPSAtPiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKVxuICAgIEBzdGFydExpc3RlbmluZyhkb2N1bWVudClcbiAgc2VsZWN0aW9uUHJvcEV4aXN0czogLT5cbiAgICBcInNlbGVjdGlvblN0YXJ0XCIgb2YgQG9ialxuICBoYXNGb2N1czogLT4gXG4gICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpcyBAb2JqXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgaWYgdmFsP1xuICAgICAgdW5sZXNzIEB0ZXh0RXZlbnRDaGFuZ2UodmFsKVxuICAgICAgICBAb2JqLnZhbHVlID0gdmFsXG4gICAgQG9iai52YWx1ZVxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICBAdGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIG9yIEBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0LCBlbmQpIG9yIHN1cGVyKHN0YXJ0LCBlbmQsIHRleHQpXG4gIHRleHRFdmVudENoYW5nZTogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUZXh0RXZlbnQnKSBpZiBkb2N1bWVudC5jcmVhdGVFdmVudD9cbiAgICBpZiBldmVudD8gYW5kIGV2ZW50LmluaXRUZXh0RXZlbnQ/IGFuZCBldmVudC5pc1RydXN0ZWQgIT0gZmFsc2VcbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIGlmIHRleHQubGVuZ3RoIDwgMVxuICAgICAgICBpZiBzdGFydCAhPSAwXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LTEsc3RhcnQpXG4gICAgICAgICAgc3RhcnQtLVxuICAgICAgICBlbHNlIGlmIGVuZCAhPSBAdGV4dExlbigpXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKGVuZCxlbmQrMSlcbiAgICAgICAgICBlbmQrK1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICBldmVudC5pbml0VGV4dEV2ZW50KCd0ZXh0SW5wdXQnLCB0cnVlLCB0cnVlLCBudWxsLCB0ZXh0LCA5KVxuICAgICAgIyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIEBvYmouZGlzcGF0Y2hFdmVudChldmVudClcbiAgICAgIEBza2lwQ2hhbmdlRXZlbnQoKVxuICAgICAgdHJ1ZVxuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kOiAodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSAtPlxuICAgIGlmIGRvY3VtZW50LmV4ZWNDb21tYW5kP1xuICAgICAgZW5kID0gQHRleHRMZW4oKSB1bmxlc3MgZW5kP1xuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dCk7XG4gICAgZWxzZSBcbiAgICAgIGZhbHNlXG5cbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdG1wQ3Vyc29yUG9zIGlmIEB0bXBDdXJzb3JQb3M/XG4gICAgaWYgQGhhc0ZvY3VzXG4gICAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgICBuZXcgUG9zKEBvYmouc2VsZWN0aW9uU3RhcnQsQG9iai5zZWxlY3Rpb25FbmQpXG4gICAgICBlbHNlXG4gICAgICAgIEBnZXRDdXJzb3JQb3NGYWxsYmFjaygpXG4gIGdldEN1cnNvclBvc0ZhbGxiYWNrOiAtPlxuICAgIGlmIEBvYmouY3JlYXRlVGV4dFJhbmdlXG4gICAgICBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKVxuICAgICAgaWYgc2VsLnBhcmVudEVsZW1lbnQoKSBpcyBAb2JqXG4gICAgICAgIHJuZyA9IEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcm5nLm1vdmVUb0Jvb2ttYXJrIHNlbC5nZXRCb29rbWFyaygpXG4gICAgICAgIGxlbiA9IDBcblxuICAgICAgICB3aGlsZSBybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDBcbiAgICAgICAgICBsZW4rK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKVxuICAgICAgICBybmcuc2V0RW5kUG9pbnQgXCJTdGFydFRvU3RhcnRcIiwgQG9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgICBwb3MgPSBuZXcgUG9zKDAsbGVuKVxuICAgICAgICB3aGlsZSBybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDBcbiAgICAgICAgICBwb3Muc3RhcnQrK1xuICAgICAgICAgIHBvcy5lbmQrK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKVxuICAgICAgICByZXR1cm4gcG9zXG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgQHRtcEN1cnNvclBvcyA9IG5ldyBQb3Moc3RhcnQsZW5kKVxuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgc2V0VGltZW91dCAoPT5cbiAgICAgICAgQHRtcEN1cnNvclBvcyA9IG51bGxcbiAgICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICApLCAxXG4gICAgZWxzZSBcbiAgICAgIEBzZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKVxuICAgIHJldHVyblxuICBzZXRDdXJzb3JQb3NGYWxsYmFjazogKHN0YXJ0LCBlbmQpIC0+XG4gICAgaWYgQG9iai5jcmVhdGVUZXh0UmFuZ2VcbiAgICAgIHJuZyA9IEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgIHJuZy5tb3ZlU3RhcnQgXCJjaGFyYWN0ZXJcIiwgc3RhcnRcbiAgICAgIHJuZy5jb2xsYXBzZSgpXG4gICAgICBybmcubW92ZUVuZCBcImNoYXJhY3RlclwiLCBlbmQgLSBzdGFydFxuICAgICAgcm5nLnNlbGVjdCgpXG4gIGdldExhbmc6IC0+XG4gICAgcmV0dXJuIEBfbGFuZyBpZiBAX2xhbmdcbiAgICBAb2JqLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJykgaWYgQG9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gICAgQG9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsdmFsKVxuICBjYW5MaXN0ZW5Ub0NoYW5nZTogLT5cbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIEBjaGFuZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjaylcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBpZiAoaSA9IEBjaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykpID4gLTFcbiAgICAgIEBjaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpXG4gICAgICBcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICBpZiByZXBsYWNlbWVudHMubGVuZ3RoID4gMCBhbmQgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMVxuICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbQGdldEN1cnNvclBvcygpXVxuICAgIHN1cGVyKHJlcGxhY2VtZW50cyk7XG4gICAgICAiLCJ2YXIgaXNFbGVtZW50O1xuXG5pbXBvcnQge1xuICBUZXh0UGFyc2VyXG59IGZyb20gJy4vVGV4dFBhcnNlcic7XG5cbmltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCB2YXIgRG9tS2V5TGlzdGVuZXIgPSBjbGFzcyBEb21LZXlMaXN0ZW5lciB7XG4gIHN0YXJ0TGlzdGVuaW5nKHRhcmdldCkge1xuICAgIHZhciBvbmtleWRvd24sIG9ua2V5cHJlc3MsIG9ua2V5dXAsIHRpbWVvdXQ7XG4gICAgdGltZW91dCA9IG51bGw7XG4gICAgb25rZXlkb3duID0gKGUpID0+IHtcbiAgICAgIGlmICgoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgfHwgdGhpcy5vYmogPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpICYmIGUua2V5Q29kZSA9PT0gNjkgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMub25BY3RpdmF0aW9uS2V5ICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFjdGl2YXRpb25LZXkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgb25rZXl1cCA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uQW55Q2hhbmdlKGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgb25rZXlwcmVzcyA9IChlKSA9PiB7XG4gICAgICBpZiAodGltZW91dCAhPSBudWxsKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aW1lb3V0ID0gc2V0VGltZW91dCgoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLCAxMDApO1xuICAgIH07XG4gICAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKTtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cCk7XG4gICAgICByZXR1cm4gdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5hdHRhY2hFdmVudCkge1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlkb3duXCIsIG9ua2V5ZG93bik7XG4gICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApO1xuICAgICAgcmV0dXJuIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcyk7XG4gICAgfVxuICB9XG5cbn07XG5cbmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgZTtcbiAgdHJ5IHtcbiAgICAvLyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIC8vIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAvLyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuICAgIHJldHVybiAodHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIikgJiYgKG9iai5ub2RlVHlwZSA9PT0gMSkgJiYgKHR5cGVvZiBvYmouc3R5bGUgPT09IFwib2JqZWN0XCIpICYmICh0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT09IFwib2JqZWN0XCIpO1xuICB9XG59O1xuXG5leHBvcnQgdmFyIFRleHRBcmVhRWRpdG9yID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBUZXh0QXJlYUVkaXRvciBleHRlbmRzIFRleHRQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldDEpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDE7XG4gICAgICB0aGlzLm9iaiA9IGlzRWxlbWVudCh0aGlzLnRhcmdldCkgPyB0aGlzLnRhcmdldCA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0KTtcbiAgICAgIGlmICh0aGlzLm9iaiA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCI7XG4gICAgICB9XG4gICAgICB0aGlzLm5hbWVzcGFjZSA9ICd0ZXh0YXJlYSc7XG4gICAgICB0aGlzLmNoYW5nZUxpc3RlbmVycyA9IFtdO1xuICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50ID0gMDtcbiAgICB9XG5cbiAgICBvbkFueUNoYW5nZShlKSB7XG4gICAgICB2YXIgY2FsbGJhY2ssIGosIGxlbjEsIHJlZiwgcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPD0gMCkge1xuICAgICAgICByZWYgPSB0aGlzLmNoYW5nZUxpc3RlbmVycztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIGNhbGxiYWNrID0gcmVmW2pdO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjYWxsYmFjaygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudC0tO1xuICAgICAgICBpZiAodGhpcy5vblNraXBlZENoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25Ta2lwZWRDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNraXBDaGFuZ2VFdmVudChuYiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgKz0gbmI7XG4gICAgfVxuXG4gICAgYmluZGVkVG8oY29kZXdhdmUpIHtcbiAgICAgIHRoaXMub25BY3RpdmF0aW9uS2V5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gdGhpcy5zdGFydExpc3RlbmluZyhkb2N1bWVudCk7XG4gICAgfVxuXG4gICAgc2VsZWN0aW9uUHJvcEV4aXN0cygpIHtcbiAgICAgIHJldHVybiBcInNlbGVjdGlvblN0YXJ0XCIgaW4gdGhpcy5vYmo7XG4gICAgfVxuXG4gICAgaGFzRm9jdXMoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5vYmo7XG4gICAgfVxuXG4gICAgdGV4dCh2YWwpIHtcbiAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICBpZiAoIXRoaXMudGV4dEV2ZW50Q2hhbmdlKHZhbCkpIHtcbiAgICAgICAgICB0aGlzLm9iai52YWx1ZSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqLnZhbHVlO1xuICAgIH1cblxuICAgIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHRoaXMuc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSB8fCBzdXBlci5zcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpO1xuICAgIH1cblxuICAgIHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIHZhciBldmVudDtcbiAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RleHRFdmVudCcpO1xuICAgICAgfVxuICAgICAgaWYgKChldmVudCAhPSBudWxsKSAmJiAoZXZlbnQuaW5pdFRleHRFdmVudCAhPSBudWxsKSAmJiBldmVudC5pc1RydXN0ZWQgIT09IGZhbHNlKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICBpZiAoc3RhcnQgIT09IDApIHtcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQgLSAxLCBzdGFydCk7XG4gICAgICAgICAgICBzdGFydC0tO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZW5kICE9PSB0aGlzLnRleHRMZW4oKSkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihlbmQsIGVuZCArIDEpO1xuICAgICAgICAgICAgZW5kKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSk7XG4gICAgICAgIC8vIEBzZXRDdXJzb3JQb3Moc3RhcnQsZW5kKVxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHRoaXMub2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLnNraXBDaGFuZ2VFdmVudCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgICAgaWYgKGRvY3VtZW50LmV4ZWNDb21tYW5kICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgICAgaWYgKHRoaXMudG1wQ3Vyc29yUG9zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG1wQ3Vyc29yUG9zO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaGFzRm9jdXMpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJvcEV4aXN0cykge1xuICAgICAgICAgIHJldHVybiBuZXcgUG9zKHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0LCB0aGlzLm9iai5zZWxlY3Rpb25FbmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldEN1cnNvclBvc0ZhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXJzb3JQb3NGYWxsYmFjaygpIHtcbiAgICAgIHZhciBsZW4sIHBvcywgcm5nLCBzZWw7XG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgICAgICBpZiAoc2VsLnBhcmVudEVsZW1lbnQoKSA9PT0gdGhpcy5vYmopIHtcbiAgICAgICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICBybmcubW92ZVRvQm9va21hcmsoc2VsLmdldEJvb2ttYXJrKCkpO1xuICAgICAgICAgIGxlbiA9IDA7XG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMCkge1xuICAgICAgICAgICAgbGVuKys7XG4gICAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJuZy5zZXRFbmRQb2ludChcIlN0YXJ0VG9TdGFydFwiLCB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKSk7XG4gICAgICAgICAgcG9zID0gbmV3IFBvcygwLCBsZW4pO1xuICAgICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIHBvcy5zdGFydCsrO1xuICAgICAgICAgICAgcG9zLmVuZCsrO1xuICAgICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcG9zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICBlbmQgPSBzdGFydDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHNldFRpbWVvdXQoKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG51bGw7XG4gICAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICB9KSwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHZhciBybmc7XG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICBybmcubW92ZVN0YXJ0KFwiY2hhcmFjdGVyXCIsIHN0YXJ0KTtcbiAgICAgICAgcm5nLmNvbGxhcHNlKCk7XG4gICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIGVuZCAtIHN0YXJ0KTtcbiAgICAgICAgcmV0dXJuIHJuZy5zZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYW5nKCkge1xuICAgICAgaWYgKHRoaXMuX2xhbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmc7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmouZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMYW5nKHZhbCkge1xuICAgICAgdGhpcy5fbGFuZyA9IHZhbDtcbiAgICAgIHJldHVybiB0aGlzLm9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsIHZhbCk7XG4gICAgfVxuXG4gICAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmICgoaSA9IHRoaXMuY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5nZUxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKSB7XG4gICAgICBpZiAocmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgJiYgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucyA9IFt0aGlzLmdldEN1cnNvclBvcygpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICAgIH1cblxuICB9O1xuXG4gIFRleHRBcmVhRWRpdG9yLnByb3RvdHlwZS5zdGFydExpc3RlbmluZyA9IERvbUtleUxpc3RlbmVyLnByb3RvdHlwZS5zdGFydExpc3RlbmluZztcblxuICByZXR1cm4gVGV4dEFyZWFFZGl0b3I7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIjIFtwYXdhIHB5dGhvbl1cbiMgICByZXBsYWNlIChFZGl0b3IpIChlZGl0b3IuRWRpdG9yKVxuIyAgIHJlcGxhY2UgQHRleHQoKSAgc2VsZi50ZXh0XG5cbmltcG9ydCB7IEVkaXRvciB9IGZyb20gJy4vRWRpdG9yJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuZXhwb3J0IGNsYXNzIFRleHRQYXJzZXIgZXh0ZW5kcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IChAX3RleHQpIC0+XG4gICAgc3VwZXIoKVxuICB0ZXh0OiAodmFsKSAtPlxuICAgIEBfdGV4dCA9IHZhbCBpZiB2YWw/XG4gICAgQF90ZXh0XG4gIHRleHRDaGFyQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KClbcG9zXVxuICB0ZXh0TGVuOiAocG9zKSAtPlxuICAgIHJldHVybiBAdGV4dCgpLmxlbmd0aFxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICByZXR1cm4gQHRleHQoKS5zdWJzdHJpbmcoc3RhcnQsIGVuZClcbiAgaW5zZXJ0VGV4dEF0OiAodGV4dCwgcG9zKSAtPlxuICAgIEB0ZXh0KEB0ZXh0KCkuc3Vic3RyaW5nKDAsIHBvcykrdGV4dCtAdGV4dCgpLnN1YnN0cmluZyhwb3MsQHRleHQoKS5sZW5ndGgpKVxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICBAdGV4dChAdGV4dCgpLnNsaWNlKDAsIHN0YXJ0KSArICh0ZXh0IHx8IFwiXCIpICsgQHRleHQoKS5zbGljZShlbmQpKVxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgcmV0dXJuIEB0YXJnZXRcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCkgLT5cbiAgICBlbmQgPSBzdGFydCBpZiBhcmd1bWVudHMubGVuZ3RoIDwgMlxuICAgIEB0YXJnZXQgPSBuZXcgUG9zKCBzdGFydCwgZW5kICkiLCIgIC8vIFtwYXdhIHB5dGhvbl1cbiAgLy8gICByZXBsYWNlIChFZGl0b3IpIChlZGl0b3IuRWRpdG9yKVxuICAvLyAgIHJlcGxhY2UgQHRleHQoKSAgc2VsZi50ZXh0XG5pbXBvcnQge1xuICBFZGl0b3Jcbn0gZnJvbSAnLi9FZGl0b3InO1xuXG5pbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuXG5leHBvcnQgdmFyIFRleHRQYXJzZXIgPSBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yIHtcbiAgY29uc3RydWN0b3IoX3RleHQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3RleHQgPSBfdGV4dDtcbiAgfVxuXG4gIHRleHQodmFsKSB7XG4gICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl90ZXh0ID0gdmFsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdGV4dDtcbiAgfVxuXG4gIHRleHRDaGFyQXQocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpW3Bvc107XG4gIH1cblxuICB0ZXh0TGVuKHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS5sZW5ndGg7XG4gIH1cblxuICB0ZXh0U3Vic3RyKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xuICB9XG5cbiAgaW5zZXJ0VGV4dEF0KHRleHQsIHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQodGhpcy50ZXh0KCkuc3Vic3RyaW5nKDAsIHBvcykgKyB0ZXh0ICsgdGhpcy50ZXh0KCkuc3Vic3RyaW5nKHBvcywgdGhpcy50ZXh0KCkubGVuZ3RoKSk7XG4gIH1cblxuICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnNsaWNlKDAsIHN0YXJ0KSArICh0ZXh0IHx8IFwiXCIpICsgdGhpcy50ZXh0KCkuc2xpY2UoZW5kKSk7XG4gIH1cblxuICBnZXRDdXJzb3JQb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0O1xuICB9XG5cbiAgc2V0Q3Vyc29yUG9zKHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIGVuZCA9IHN0YXJ0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50YXJnZXQgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICB9XG5cbn07XG4iLCJpbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vQ29kZXdhdmUnO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBDb3JlQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgSnNDb21tYW5kUHJvdmlkZXIgfSBmcm9tICcuL2NtZHMvSnNDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgUGhwQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL1BocENvbW1hbmRQcm92aWRlcic7XG5pbXBvcnQgeyBIdG1sQ29tbWFuZFByb3ZpZGVyIH0gZnJvbSAnLi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXInO1xuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9wb3NpdGlvbmluZy9Qb3MnO1xuaW1wb3J0IHsgV3JhcHBlZFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvV3JhcHBlZFBvcyc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VFbmdpbmUgfSBmcm9tICcuL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZSc7XG5cblBvcy53cmFwQ2xhc3MgPSBXcmFwcGVkUG9zXG5cbkNvZGV3YXZlLmluc3RhbmNlcyA9IFtdXG5cbkNvbW1hbmQucHJvdmlkZXJzID0gW1xuICBuZXcgQ29yZUNvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpXG4gIG5ldyBQaHBDb21tYW5kUHJvdmlkZXIoKVxuICBuZXcgSHRtbENvbW1hbmRQcm92aWRlcigpXG5dXG5cbmlmIGxvY2FsU3RvcmFnZT9cbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZUVuZ2luZSgpXG5cbmV4cG9ydCB7IENvZGV3YXZlIH0iLCJpbXBvcnQge1xuICBDb2Rld2F2ZVxufSBmcm9tICcuL0NvZGV3YXZlJztcblxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuL0NvbW1hbmQnO1xuXG5pbXBvcnQge1xuICBDb3JlQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgSnNDb21tYW5kUHJvdmlkZXJcbn0gZnJvbSAnLi9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgUGhwQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9QaHBDb21tYW5kUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBIdG1sQ29tbWFuZFByb3ZpZGVyXG59IGZyb20gJy4vY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyJztcblxuaW1wb3J0IHtcbiAgUG9zXG59IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcblxuaW1wb3J0IHtcbiAgV3JhcHBlZFBvc1xufSBmcm9tICcuL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MnO1xuXG5pbXBvcnQge1xuICBMb2NhbFN0b3JhZ2VFbmdpbmVcbn0gZnJvbSAnLi9zdG9yYWdlRW5naW5lcy9Mb2NhbFN0b3JhZ2VFbmdpbmUnO1xuXG5Qb3Mud3JhcENsYXNzID0gV3JhcHBlZFBvcztcblxuQ29kZXdhdmUuaW5zdGFuY2VzID0gW107XG5cbkNvbW1hbmQucHJvdmlkZXJzID0gW25ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpLCBuZXcgUGhwQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKCldO1xuXG5pZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZUVuZ2luZSgpO1xufVxuXG5leHBvcnQge1xuICBDb2Rld2F2ZVxufTtcbiIsIlxuaW1wb3J0IHsgQ29tbWFuZCwgQmFzZUNvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcbmltcG9ydCB7IExhbmdEZXRlY3RvciB9IGZyb20gJy4uL0RldGVjdG9yJztcbmltcG9ydCB7IEJveEhlbHBlciB9IGZyb20gJy4uL0JveEhlbHBlcic7XG5pbXBvcnQgeyBFZGl0Q21kUHJvcCB9IGZyb20gJy4uL0VkaXRDbWRQcm9wJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgY2xhc3MgQ29yZUNvbW1hbmRQcm92aWRlclxuIHJlZ2lzdGVyOiAoY21kcyktPiBcbiAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjb3JlJykpXG4gIGNvcmUuYWRkRGV0ZWN0b3IobmV3IExhbmdEZXRlY3RvcigpKVxuICBcbiAgY29yZS5hZGRDbWRzKHtcbiAgICAnaGVscCc6e1xuICAgICAgJ3JlcGxhY2VCb3gnIDogdHJ1ZSxcbiAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgIH5+Ym94fn5cbiAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXG4gICAgICAgICAvIF9ffF9fXyAgX198IHxfX1xcXFwgXFxcXCAgICAvIC9fIF9fXyBfX19fX19cbiAgICAgICAgLyAvX18vIF8gXFxcXC8gX2AgLyAtX1xcXFwgXFxcXC9cXFxcLyAvIF9gIFxcXFwgViAvIC1fL1xuICAgICAgICBcXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XG4gICAgICAgIFRoZSB0ZXh0IGVkaXRvciBoZWxwZXJcbiAgICAgICAgfn4vcXVvdGVfY2FycmV0fn5cbiAgICAgICAgXG4gICAgICAgIFdoZW4gdXNpbmcgQ29kZXdhdmUgeW91IHdpbGwgYmUgd3JpdGluZyBjb21tYW5kcyB3aXRoaW4gXG4gICAgICAgIHlvdXIgdGV4dCBlZGl0b3IuIFRoZXNlIGNvbW1hbmRzIG11c3QgYmUgcGxhY2VkIGJldHdlZW4gdHdvIFxuICAgICAgICBwYWlycyBvZiBcIn5cIiAodGlsZGUpIGFuZCB0aGVuLCB0aGV5IGNhbiBiZSBleGVjdXRlZCBieSBwcmVzc2luZyBcbiAgICAgICAgXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiLCB3aXRoIHlvdXIgY3Vyc29yIGluc2lkZSB0aGUgY29tbWFuZFxuICAgICAgICBFeDogfn4haGVsbG9+flxuICAgICAgICBcbiAgICAgICAgWW91IGRvbnQgbmVlZCB0byBhY3R1YWxseSB0eXBlIGFueSBcIn5cIiAodGlsZGUpLiBcbiAgICAgICAgUHJlc3NpbmcgXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiIHdpbGwgYWRkIHRoZW0gaWYgeW91IGFyZSBub3QgYWxyZWFkeVxuICAgICAgICB3aXRoaW4gYSBjb21tYW5kLlxuICAgICAgICBcbiAgICAgICAgQ29kZXdhdmUgZG9lcyBub3QgdXNlIFVJIHRvIGRpc3BsYXkgYW55IGluZm9ybWF0aW9uLiBcbiAgICAgICAgSW5zdGVhZCwgaXQgdXNlcyB0ZXh0IHdpdGhpbiBjb2RlIGNvbW1lbnRzIHRvIG1pbWljIFVJcy4gXG4gICAgICAgIFRoZSBnZW5lcmF0ZWQgY29tbWVudCBibG9ja3Mgd2lsbCBiZSByZWZlcnJlZCB0byBhcyB3aW5kb3dzIFxuICAgICAgICBpbiB0aGUgaGVscCBzZWN0aW9ucy5cbiAgICAgICAgXG4gICAgICAgIFRvIGNsb3NlIHRoaXMgd2luZG93IChpLmUuIHJlbW92ZSB0aGlzIGNvbW1lbnQgYmxvY2spLCBwcmVzcyBcbiAgICAgICAgXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiIHdpdGggeW91ciBjdXJzb3Igb24gdGhlIGxpbmUgYmVsbG93LlxuICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICBcbiAgICAgICAgVXNlIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBmb3IgYSB3YWxrdGhyb3VnaCBvZiBzb21lIG9mIHRoZSBtYW55XG4gICAgICAgIGZlYXR1cmVzIG9mIENvZGV3YXZlXG4gICAgICAgIH5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiBvciB+fiFoZWxwOmRlbW9+flxuICAgICAgICBcbiAgICAgICAgTGlzdCBvZiBhbGwgaGVscCBzdWJqZWN0cyBcbiAgICAgICAgfn4haGVscDpzdWJqZWN0c35+IG9yIH5+IWhlbHA6c3Vifn4gXG4gICAgICAgIFxuICAgICAgICB+fiFjbG9zZX5+XG4gICAgICAgIH5+L2JveH5+XG4gICAgICAgIFwiXCJcIlxuICAgICAgJ2NtZHMnIDoge1xuICAgICAgICAnc3ViamVjdHMnOntcbiAgICAgICAgICAncmVwbGFjZUJveCcgOiB0cnVlLFxuICAgICAgICAgICdyZXN1bHQnIDogXCJcIlwiXG4gICAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgICB+fiFoZWxwfn5cbiAgICAgICAgICAgIH5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiAofn4haGVscDpkZW1vfn4pXG4gICAgICAgICAgICB+fiFoZWxwOnN1YmplY3Rzfn4gKH5+IWhlbHA6c3Vifn4pXG4gICAgICAgICAgICB+fiFoZWxwOmVkaXRpbmd+fiAofn4haGVscDplZGl0fn4pXG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICB9XG4gICAgICAgICdzdWInOntcbiAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOnN1YmplY3RzJ1xuICAgICAgICB9XG4gICAgICAgICdnZXRfc3RhcnRlZCc6e1xuICAgICAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICAgIFRoZSBjbGFzc2ljIEhlbGxvIFdvcmxkLlxuICAgICAgICAgICAgfn4haGVsbG98fn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfn5oZWxwOmVkaXRpbmc6aW50cm9+flxuICAgICAgICAgICAgfn5xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBjcmVhdGluZyB5b3VyIG93biBjb21tYW5kcywgc2VlOlxuICAgICAgICAgICAgfn4haGVscDplZGl0aW5nfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29kZXdhdmUgY29tZXMgd2l0aCBtYW55IHByZS1leGlzdGluZyBjb21tYW5kcy4gSGVyZSBpcyBhbiBleGFtcGxlXG4gICAgICAgICAgICBvZiBKYXZhU2NyaXB0IGFiYnJldmlhdGlvbnNcbiAgICAgICAgICAgIH5+IWpzOmZ+flxuICAgICAgICAgICAgfn4hanM6aWZ+flxuICAgICAgICAgICAgICB+fiFqczpsb2d+flwifn4haGVsbG9+flwifn4hL2pzOmxvZ35+XG4gICAgICAgICAgICB+fiEvanM6aWZ+flxuICAgICAgICAgICAgfn4hL2pzOmZ+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICBDb2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXG4gICAgICAgICAgICBwcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxuICAgICAgICAgICAgdXNlZCBhdXRvbWF0aWNhbGx5IGlmIHlvdSBhcmUgaW4gYSBIVE1MIG9yIENTUyBmaWxlLlxuICAgICAgICAgICAgfn4hdWw+bGl+fiAoaWYgeW91IGFyZSBpbiBhIGh0bWwgZG9jY3VtZW50KVxuICAgICAgICAgICAgfn4hZW1tZXQgdWw+bGl+flxuICAgICAgICAgICAgfn4hZW1tZXQgbTIgY3Nzfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxuICAgICAgICAgICAgZGlmZmVyZW50IHJlc3VsdHMgZGVwZW5kaW5nIG9uIHRoZSBuYW1lc3BhY2UuXG4gICAgICAgICAgICB+fiFqczplYWNofn5cbiAgICAgICAgICAgIH5+IXBocDpvdXRlcjplYWNofn5cbiAgICAgICAgICAgIH5+IXBocDppbm5lcjplYWNofn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXG4gICAgICAgICAgICBmb2xsb3dpbmcgY29tbWFuZHMgYXJlIHRoZSBzYW1lIGFuZCB3aWxsIGRpc3BsYXkgdGhlIGN1cnJlbnRseVxuICAgICAgICAgICAgYWN0aXZlIG5hbWVzcGFjZS4gVGhlIGZpcnN0IGNvbW1hbmQgY29tbWFuZCB3b3JrcyBiZWNhdXNlIHRoZSBcbiAgICAgICAgICAgIGNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZX5+XG4gICAgICAgICAgICB+fiFjb3JlOm5hbWVzcGFjZX5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFlvdSBjYW4gbWFrZSBhIG5hbWVzcGFjZSBhY3RpdmUgd2l0aCB0aGUgZm9sbG93aW5nIGNvbW1hbmQuXG4gICAgICAgICAgICB+fiFuYW1lc3BhY2UgcGhwfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQ2hlY2sgdGhlIG5hbWVzcGFjZXMgYWdhaW5cbiAgICAgICAgICAgIH5+IW5hbWVzcGFjZX5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEluIGFkZGl0aW9uIHRvIGRldGVjdGluZyB0aGUgZG9jdW1lbnQgdHlwZSwgQ29kZXdhdmUgY2FuIGRldGVjdCB0aGVcbiAgICAgICAgICAgIGNvbnRleHQgZnJvbSB0aGUgc3Vycm91bmRpbmcgdGV4dC4gSW4gYSBQSFAgZmlsZSwgaXQgbWVhbnMgQ29kZXdhdmUgXG4gICAgICAgICAgICB3aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fi9xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnZGVtbyc6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6Z2V0X3N0YXJ0ZWQnXG4gICAgICAgIH1cbiAgICAgICAgJ2VkaXRpbmcnOntcbiAgICAgICAgICAnY21kcycgOiB7XG4gICAgICAgICAgICAnaW50cm8nOntcbiAgICAgICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgICAgICBDb2Rld2F2ZSBhbGxvd3MgeW91IHRvIG1ha2UgeW91ciBvd24gY29tbWFuZHMgKG9yIGFiYnJldmlhdGlvbnMpIFxuICAgICAgICAgICAgICAgIHB1dCB5b3VyIGNvbnRlbnQgaW5zaWRlIFwic291cmNlXCIgdGhlIGRvIFwic2F2ZVwiLiBUcnkgYWRkaW5nIGFueSBcbiAgICAgICAgICAgICAgICB0ZXh0IHRoYXQgaXMgb24geW91ciBtaW5kLlxuICAgICAgICAgICAgICAgIH5+IWVkaXQgbXlfbmV3X2NvbW1hbmR8fn5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBJZiB5b3UgZGlkIHRoZSBsYXN0IHN0ZXAgcmlnaHQsIHlvdSBzaG91bGQgc2VlIHlvdXIgdGV4dCB3aGVuIHlvdVxuICAgICAgICAgICAgICAgIGRvIHRoZSBmb2xsb3dpbmcgY29tbWFuZC4gSXQgaXMgbm93IHNhdmVkIGFuZCB5b3UgY2FuIHVzZSBpdCBcbiAgICAgICAgICAgICAgICB3aGVuZXZlciB5b3Ugd2FudC5cbiAgICAgICAgICAgICAgICB+fiFteV9uZXdfY29tbWFuZH5+XG4gICAgICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgICdyZXBsYWNlQm94JyA6IHRydWUsXG4gICAgICAgICAgJ3Jlc3VsdCcgOiBcIlwiXCJcbiAgICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICAgIH5+aGVscDplZGl0aW5nOmludHJvfn5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQWxsIHRoZSB3aW5kb3dzIG9mIENvZGV3YXZlIGFyZSBtYWRlIHdpdGggdGhlIGNvbW1hbmQgXCJib3hcIi4gXG4gICAgICAgICAgICBUaGV5IGFyZSBtZWFudCB0byBkaXNwbGF5IHRleHQgdGhhdCBzaG91bGQgbm90IHJlbWFpbiBpbiB5b3VyIGNvZGUuIFxuICAgICAgICAgICAgVGhleSBhcmUgdmFsaWQgY29tbWVudHMgc28gdGhleSB3b24ndCBicmVhayB5b3VyIGNvZGUgYW5kIHRoZSBjb21tYW5kIFxuICAgICAgICAgICAgXCJjbG9zZVwiIGNhbiBiZSB1c2VkIHRvIHJlbW92ZSB0aGVtIHJhcGlkbHkuIFlvdSBjYW4gbWFrZSB5b3VyIG93biBcbiAgICAgICAgICAgIGNvbW1hbmRzIHdpdGggdGhlbSBpZiB5b3UgbmVlZCB0byBkaXNwbGF5IHNvbWUgdGV4dCB0ZW1wb3JhcmlseS5cbiAgICAgICAgICAgIH5+IWJveH5+XG4gICAgICAgICAgICBUaGUgYm94IHdpbGwgc2NhbGUgd2l0aCB0aGUgY29udGVudCB5b3UgcHV0IGluIGl0XG4gICAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgICAgfn4hL2JveH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH5+cXVvdGVfY2FycmV0fn5cbiAgICAgICAgICAgIFdoZW4geW91IGNyZWF0ZSBhIGNvbW1hbmQsIHlvdSBtYXkgd2FudCB0byBzcGVjaWZ5IHdoZXJlIHRoZSBjdXJzb3IgXG4gICAgICAgICAgICB3aWxsIGJlIGxvY2F0ZWQgb25jZSB0aGUgY29tbWFuZCBpcyBleHBhbmRlZC4gVG8gZG8gdGhhdCwgdXNlIGEgXCJ8XCIgXG4gICAgICAgICAgICAoVmVydGljYWwgYmFyKS4gVXNlIDIgb2YgdGhlbSBpZiB5b3Ugd2FudCB0byBwcmludCB0aGUgYWN0dWFsIFxuICAgICAgICAgICAgY2hhcmFjdGVyLlxuICAgICAgICAgICAgfn4hYm94fn5cbiAgICAgICAgICAgIG9uZSA6IHwgXG4gICAgICAgICAgICB0d28gOiB8fFxuICAgICAgICAgICAgfn4hL2JveH5+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFlvdSBjYW4gYWxzbyB1c2UgdGhlIFwiZXNjYXBlX3BpcGVzXCIgY29tbWFuZCB0aGF0IHdpbGwgZXNjYXBlIGFueSBcbiAgICAgICAgICAgIHZlcnRpY2FsIGJhcnMgdGhhdCBhcmUgYmV0d2VlbiBpdHMgb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzXG4gICAgICAgICAgICB+fiFlc2NhcGVfcGlwZXN+flxuICAgICAgICAgICAgfFxuICAgICAgICAgICAgfn4hL2VzY2FwZV9waXBlc35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvbW1hbmRzIGluc2lkZSBvdGhlciBjb21tYW5kcyB3aWxsIGJlIGV4cGFuZGVkIGF1dG9tYXRpY2FsbHkuXG4gICAgICAgICAgICBJZiB5b3Ugd2FudCB0byBwcmludCBhIGNvbW1hbmQgd2l0aG91dCBoYXZpbmcgaXQgZXhwYW5kIHdoZW4gXG4gICAgICAgICAgICB0aGUgcGFyZW50IGNvbW1hbmQgaXMgZXhwYW5kZWQsIHVzZSBhIFwiIVwiIChleGNsYW1hdGlvbiBtYXJrKS5cbiAgICAgICAgICAgIH5+ISFoZWxsb35+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEZvciBjb21tYW5kcyB0aGF0IGhhdmUgYm90aCBhbiBvcGVuaW5nIGFuZCBhIGNsb3NpbmcgdGFnLCB5b3UgY2FuIHVzZVxuICAgICAgICAgICAgdGhlIFwiY29udGVudFwiIGNvbW1hbmQuIFwiY29udGVudFwiIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGV4dFxuICAgICAgICAgICAgdGhhdCBpcyBiZXR3ZWVuIHRoZSB0YWdzLiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgaG93IGl0IGNhbiBiZSB1c2VkLlxuICAgICAgICAgICAgfn4hZWRpdCBwaHA6aW5uZXI6aWZ+flxuICAgICAgICAgICAgXG4gICAgICAgICAgICB+fi9xdW90ZV9jYXJyZXR+flxuICAgICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgfVxuICAgICAgICAnZWRpdCc6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2hlbHA6ZWRpdGluZydcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgJ25vX2V4ZWN1dGUnOntcbiAgICAgICdyZXN1bHQnIDogbm9fZXhlY3V0ZVxuICAgIH0sXG4gICAgJ2VzY2FwZV9waXBlcyc6e1xuICAgICAgJ3Jlc3VsdCcgOiBxdW90ZV9jYXJyZXQsXG4gICAgICAnY2hlY2tDYXJyZXQnIDogZmFsc2VcbiAgICB9LFxuICAgICdxdW90ZV9jYXJyZXQnOntcbiAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXNjYXBlX3BpcGVzJ1xuICAgIH1cbiAgICAnZXhlY19wYXJlbnQnOntcbiAgICAgICdleGVjdXRlJyA6IGV4ZWNfcGFyZW50XG4gICAgfSxcbiAgICAnY29udGVudCc6e1xuICAgICAgJ3Jlc3VsdCcgOiBnZXRDb250ZW50XG4gICAgfSxcbiAgICAnYm94Jzp7XG4gICAgICAnY2xzJyA6IEJveENtZFxuICAgIH0sXG4gICAgJ2Nsb3NlJzp7XG4gICAgICAnY2xzJyA6IENsb3NlQ21kXG4gICAgfSxcbiAgICAncGFyYW0nOntcbiAgICAgICdyZXN1bHQnIDogZ2V0UGFyYW1cbiAgICB9LFxuICAgICdlZGl0Jzp7XG4gICAgICAnY21kcycgOiBFZGl0Q21kLnNldENtZHMoe1xuICAgICAgICAnc2F2ZSc6e1xuICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZXhlY19wYXJlbnQnXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgJ2NscycgOiBFZGl0Q21kXG4gICAgfSxcbiAgICAncmVuYW1lJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfYXBwbGljYWJsZScgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxuICAgICAgICAgIH5+IWNsb3NlfH5+XG4gICAgICAgICAgfn4vYm94fn5cbiAgICAgICAgICBcIlwiXCIsXG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiByZW5hbWVDb21tYW5kLFxuICAgICAgJ3BhcnNlJyA6IHRydWVcbiAgICB9LFxuICAgICdyZW1vdmUnOntcbiAgICAgICdjbWRzJyA6IHtcbiAgICAgICAgJ25vdF9hcHBsaWNhYmxlJyA6IFwiXCJcIlxuICAgICAgICAgIH5+Ym94fn5cbiAgICAgICAgICBZb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIixcbiAgICAgICAgJ25vdF9mb3VuZCcgOiBcIlwiXCJcbiAgICAgICAgICB+fmJveH5+XG4gICAgICAgICAgQ29tbWFuZCBub3QgZm91bmRcbiAgICAgICAgICB+fiFjbG9zZXx+flxuICAgICAgICAgIH5+L2JveH5+XG4gICAgICAgICAgXCJcIlwiXG4gICAgICB9XG4gICAgICAncmVzdWx0JyA6IHJlbW92ZUNvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgIH0sXG4gICAgJ2FsaWFzJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdub3RfZm91bmQnIDogXCJcIlwiXG4gICAgICAgICAgfn5ib3h+flxuICAgICAgICAgIENvbW1hbmQgbm90IGZvdW5kXG4gICAgICAgICAgfn4hY2xvc2V8fn5cbiAgICAgICAgICB+fi9ib3h+flxuICAgICAgICAgIFwiXCJcIlxuICAgICAgfVxuICAgICAgJ3Jlc3VsdCcgOiBhbGlhc0NvbW1hbmQsXG4gICAgICAncGFyc2UnIDogdHJ1ZVxuICAgIH0sXG4gICAgJ25hbWVzcGFjZSc6e1xuICAgICAgJ2NscycgOiBOYW1lU3BhY2VDbWRcbiAgICB9LFxuICAgICduc3BjJzp7XG4gICAgICAnYWxpYXNPZicgOiAnY29yZTpuYW1lc3BhY2UnXG4gICAgfSxcbiAgICAnZW1tZXQnOntcbiAgICAgICdjbHMnIDogRW1tZXRDbWRcbiAgICB9LFxuICAgIFxuICB9KVxuICBcbm5vX2V4ZWN1dGUgPSAoaW5zdGFuY2UpIC0+XG4gIHJlZyA9IG5ldyBSZWdFeHAoXCJeKFwiK1N0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cykgKyAnKScgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpKVxuICByZXR1cm4gaW5zdGFuY2Uuc3RyLnJlcGxhY2UocmVnLCckMScpXG4gIFxucXVvdGVfY2FycmV0ID0gKGluc3RhbmNlKSAtPlxuICByZXR1cm4gaW5zdGFuY2UuY29udGVudC5yZXBsYWNlKC9cXHwvZywgJ3x8JykgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgJy9cXHwvZycgXCInfCdcIlxuZXhlY19wYXJlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGlmIGluc3RhbmNlLnBhcmVudD9cbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpXG4gICAgaW5zdGFuY2UucmVwbGFjZVN0YXJ0ID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VTdGFydFxuICAgIGluc3RhbmNlLnJlcGxhY2VFbmQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZUVuZFxuICAgIHJldHVybiByZXNcbmdldENvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSxmYWxzZSlcbiAgcHJlZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgc3VmZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgaWYgaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZT9cbiAgICByZXR1cm4gcHJlZml4ICsgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuY29udGVudCBvciAnJykgKyBzdWZmaXhcbiAgaWYgYWZmaXhlc19lbXB0eVxuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXhcbnJlbmFtZUNvbW1hbmQgPSAoaW5zdGFuY2UpIC0+XG4gIHN0b3JhZ2UgPSBDb21tYW5kLnN0b3JhZ2VcbiAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgb3JpZ25pbmFsTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCdmcm9tJ10pXG4gIG5ld05hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwndG8nXSlcbiAgaWYgb3JpZ25pbmFsTmFtZT8gYW5kIG5ld05hbWU/XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQob3JpZ25pbmFsTmFtZSlcbiAgICBpZiBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0/IGFuZCBjbWQ/XG4gICAgICB1bmxlc3MgbmV3TmFtZS5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgICBuZXdOYW1lID0gY21kLmZ1bGxOYW1lLnJlcGxhY2Uob3JpZ25pbmFsTmFtZSwnJykgKyBuZXdOYW1lXG4gICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG4gICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShuZXdOYW1lLGNtZERhdGEpXG4gICAgICBjbWQudW5yZWdpc3RlcigpXG4gICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhXG4gICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG4gICAgICBzdG9yYWdlLnNhdmUoJ2NtZHMnLHNhdmVkQ21kcylcbiAgICAgIHJldHVybiBcIlwiXG4gICAgZWxzZSBpZiBjbWQ/IFxuICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCJcbiAgICBlbHNlIFxuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG5yZW1vdmVDb21tYW5kID0gKGluc3RhbmNlKSAtPlxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsJ25hbWUnXSlcbiAgaWYgbmFtZT9cbiAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG4gICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuICAgIGlmIHNhdmVkQ21kc1tuYW1lXT8gYW5kIGNtZD9cbiAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbbmFtZV1cbiAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV1cbiAgICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIGlmIGNtZD8gXG4gICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIlxuICAgIGVsc2UgXG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCJcbmFsaWFzQ29tbWFuZCA9IChpbnN0YW5jZSkgLT5cbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCduYW1lJ10pXG4gIGFsaWFzID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsJ2FsaWFzJ10pXG4gIGlmIG5hbWU/IGFuZCBhbGlhcz9cbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuICAgIGlmIGNtZD9cbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgb3IgY21kXG4gICAgICAjIHVubGVzcyBhbGlhcy5pbmRleE9mKCc6JykgPiAtMVxuICAgICAgICAjIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7IGFsaWFzT2Y6IGNtZC5mdWxsTmFtZSB9KVxuICAgICAgcmV0dXJuIFwiXCJcbiAgICBlbHNlIFxuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiXG4gICAgICBcbmdldFBhcmFtID0gKGluc3RhbmNlKSAtPlxuICBpZiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlP1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcyxpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsJ2RlZmF1bHQnXSkpXG4gIFxuY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAaGVscGVyID0gbmV3IEJveEhlbHBlcihAaW5zdGFuY2UuY29udGV4dClcbiAgICBAY21kID0gQGluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pXG4gICAgaWYgQGNtZD9cbiAgICAgIEBoZWxwZXIub3BlblRleHQgID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAY21kICsgQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIEBoZWxwZXIuY2xvc2VUZXh0ID0gQGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyBAaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZC5zcGxpdChcIiBcIilbMF0gKyBAaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgIEBoZWxwZXIuZGVjbyA9IEBpbnN0YW5jZS5jb2Rld2F2ZS5kZWNvXG4gICAgQGhlbHBlci5wYWQgPSAyXG4gICAgQGhlbHBlci5wcmVmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwnJylcbiAgICBAaGVscGVyLnN1ZmZpeCA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCcnKVxuICAgIFxuICBoZWlnaHQ6IC0+XG4gICAgaWYgQGJvdW5kcygpP1xuICAgICAgaGVpZ2h0ID0gQGJvdW5kcygpLmhlaWdodFxuICAgIGVsc2VcbiAgICAgIGhlaWdodCA9IDNcbiAgICAgIFxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J11cbiAgICBpZiBAaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEgXG4gICAgICBwYXJhbXMucHVzaCgxKVxuICAgIGVsc2UgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAwXG4gICAgICBwYXJhbXMucHVzaCgwKVxuICAgIHJldHVybiBAaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLGhlaWdodClcbiAgICAgIFxuICB3aWR0aDogLT5cbiAgICBpZiBAYm91bmRzKCk/XG4gICAgICB3aWR0aCA9IEBib3VuZHMoKS53aWR0aFxuICAgIGVsc2VcbiAgICAgIHdpZHRoID0gM1xuICAgICAgXG4gICAgcGFyYW1zID0gWyd3aWR0aCddXG4gICAgaWYgQGluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxIFxuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICByZXR1cm4gTWF0aC5tYXgoQG1pbldpZHRoKCksIEBpbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSlcblxuICBcbiAgYm91bmRzOiAtPlxuICAgIGlmIEBpbnN0YW5jZS5jb250ZW50XG4gICAgICB1bmxlc3MgQF9ib3VuZHM/XG4gICAgICAgIEBfYm91bmRzID0gQGhlbHBlci50ZXh0Qm91bmRzKEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcmV0dXJuIEBfYm91bmRzXG4gICAgICBcbiAgcmVzdWx0OiAtPlxuICAgIEBoZWxwZXIuaGVpZ2h0ID0gQGhlaWdodCgpXG4gICAgQGhlbHBlci53aWR0aCA9IEB3aWR0aCgpXG4gICAgcmV0dXJuIEBoZWxwZXIuZHJhdyhAaW5zdGFuY2UuY29udGVudClcbiAgbWluV2lkdGg6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJldHVybiBAY21kLmxlbmd0aFxuICAgIGVsc2VcbiAgICAgIHJldHVybiAwXG4gIFxuY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBpbnN0YW5jZS5jb250ZXh0KVxuICBleGVjdXRlOiAtPlxuICAgIHByZWZpeCA9IEBoZWxwZXIucHJlZml4ID0gQGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sJycpXG4gICAgc3VmZml4ID0gQGhlbHBlci5zdWZmaXggPSBAaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwnJylcbiAgICBib3ggPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IEBpbnN0YW5jZS5nZXRQYXJhbShbJ3JlcXVpcmVkX2FmZml4ZXMnXSx0cnVlKVxuICAgIGlmICFyZXF1aXJlZF9hZmZpeGVzXG4gICAgICBAaGVscGVyLnByZWZpeCA9IEBoZWxwZXIuc3VmZml4ID0gJydcbiAgICAgIGJveDIgPSBAaGVscGVyLmdldEJveEZvclBvcyhAaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgICBpZiBib3gyPyBhbmQgKCFib3g/IG9yIGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIG9yIGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpXG4gICAgICAgIGJveCA9IGJveDJcbiAgICBpZiBib3g/XG4gICAgICBkZXB0aCA9IEBoZWxwZXIuZ2V0TmVzdGVkTHZsKEBpbnN0YW5jZS5nZXRQb3MoKS5zdGFydClcbiAgICAgIGlmIGRlcHRoIDwgMlxuICAgICAgICBAaW5zdGFuY2UuaW5Cb3ggPSBudWxsXG4gICAgICBAaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LGJveC5lbmQsJycpKVxuICAgIGVsc2VcbiAgICAgIEBpbnN0YW5jZS5yZXBsYWNlV2l0aCgnJylcbiAgICAgICAgICBcbmNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZFxuICBpbml0OiAtPlxuICAgIEBjbWROYW1lID0gQGluc3RhbmNlLmdldFBhcmFtKFswLCdjbWQnXSlcbiAgICBAdmVyYmFsaXplID0gQGluc3RhbmNlLmdldFBhcmFtKFsxXSkgaW4gWyd2JywndmVyYmFsaXplJ11cbiAgICBpZiBAY21kTmFtZT9cbiAgICAgIEBmaW5kZXIgPSBAaW5zdGFuY2UuY29udGV4dC5nZXRGaW5kZXIoQGNtZE5hbWUpIFxuICAgICAgQGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgQGVkaXRhYmxlID0gaWYgQGNtZD8gdGhlbiBAY21kLmlzRWRpdGFibGUoKSBlbHNlIHRydWVcbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4ge1xuICAgICAgYWxsb3dlZE5hbWVkOiBbJ2NtZCddXG4gICAgfVxuICByZXN1bHQ6IC0+XG4gICAgaWYgQGluc3RhbmNlLmNvbnRlbnRcbiAgICAgIHJldHVybiBAcmVzdWx0V2l0aENvbnRlbnQoKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAcmVzdWx0V2l0aG91dENvbnRlbnQoKVxuICByZXN1bHRXaXRoQ29udGVudDogLT5cbiAgICAgIHBhcnNlciA9IEBpbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KEBpbnN0YW5jZS5jb250ZW50KVxuICAgICAgcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIGRhdGEgPSB7fVxuICAgICAgZm9yIHAgaW4gRWRpdENtZC5wcm9wc1xuICAgICAgICBwLndyaXRlRm9yKHBhcnNlcixkYXRhKVxuICAgICAgQ29tbWFuZC5zYXZlQ21kKEBjbWROYW1lLCBkYXRhKVxuICAgICAgcmV0dXJuICcnXG4gIHByb3BzRGlzcGxheTogLT5cbiAgICAgIGNtZCA9IEBjbWRcbiAgICAgIHJldHVybiBFZGl0Q21kLnByb3BzLm1hcCggKHApLT4gcC5kaXNwbGF5KGNtZCkgKS5maWx0ZXIoIChwKS0+IHA/ICkuam9pbihcIlxcblwiKVxuICByZXN1bHRXaXRob3V0Q29udGVudDogLT5cbiAgICBpZiAhQGNtZCBvciBAZWRpdGFibGVcbiAgICAgIG5hbWUgPSBpZiBAY21kIHRoZW4gQGNtZC5mdWxsTmFtZSBlbHNlIEBjbWROYW1lXG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChcbiAgICAgICAgXCJcIlwiXG4gICAgICAgIH5+Ym94IGNtZDpcIiN7QGluc3RhbmNlLmNtZC5mdWxsTmFtZX0gI3tuYW1lfVwifn5cbiAgICAgICAgI3tAcHJvcHNEaXNwbGF5KCl9XG4gICAgICAgIH5+IXNhdmV+fiB+fiFjbG9zZX5+XG4gICAgICAgIH5+L2JveH5+XG4gICAgICAgIFwiXCJcIilcbiAgICAgIHBhcnNlci5jaGVja0NhcnJldCA9IG5vXG4gICAgICByZXR1cm4gaWYgQHZlcmJhbGl6ZSB0aGVuIHBhcnNlci5nZXRUZXh0KCkgZWxzZSBwYXJzZXIucGFyc2VBbGwoKVxuRWRpdENtZC5zZXRDbWRzID0gKGJhc2UpIC0+XG4gIGZvciBwIGluIEVkaXRDbWQucHJvcHNcbiAgICBwLnNldENtZChiYXNlKVxuICByZXR1cm4gYmFzZVxuRWRpdENtZC5wcm9wcyA9IFtcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX2NhcnJldCcsICAgICAgICAge29wdDonY2hlY2tDYXJyZXQnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19wYXJzZScsICAgICAgICAgIHtvcHQ6J3BhcnNlJ30pLFxuICBuZXcgRWRpdENtZFByb3AuYm9vbCggICAncHJldmVudF9wYXJzZV9hbGwnLCB7b3B0OidwcmV2ZW50UGFyc2VBbGwnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCAgICdyZXBsYWNlX2JveCcsICAgICAgIHtvcHQ6J3JlcGxhY2VCb3gnfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoICduYW1lX3RvX3BhcmFtJywgICAgIHtvcHQ6J25hbWVUb1BhcmFtJ30pLFxuICBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCAnYWxpYXNfb2YnLCAgICAgICAgICB7dmFyOidhbGlhc09mJywgY2FycmV0OnRydWV9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSggJ2hlbHAnLCAgICAgICAgICAgICAge2Z1bmN0OidoZWxwJywgc2hvd0VtcHR5OnRydWV9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSggJ3NvdXJjZScsICAgICAgICAgICAge3ZhcjoncmVzdWx0U3RyJywgZGF0YU5hbWU6J3Jlc3VsdCcsIHNob3dFbXB0eTp0cnVlLCBjYXJyZXQ6dHJ1ZX0pLFxuXVxuY2xhc3MgTmFtZVNwYWNlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAbmFtZSA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMF0pXG4gIHJlc3VsdDogLT5cbiAgICBpZiBAbmFtZT9cbiAgICAgIEBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dC5hZGROYW1lU3BhY2UoQG5hbWUpXG4gICAgICByZXR1cm4gJydcbiAgICBlbHNlXG4gICAgICBuYW1lc3BhY2VzID0gQGluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICB0eHQgPSAnfn5ib3h+flxcbidcbiAgICAgIGZvciBuc3BjIGluIG5hbWVzcGFjZXMgXG4gICAgICAgIGlmIG5zcGMgIT0gQGluc3RhbmNlLmNtZC5mdWxsTmFtZVxuICAgICAgICAgIHR4dCArPSBuc3BjKydcXG4nXG4gICAgICB0eHQgKz0gJ35+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICBwYXJzZXIgPSBAaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0eHQpXG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKClcblxuXG5cbmNsYXNzIEVtbWV0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmRcbiAgaW5pdDogLT5cbiAgICBAYWJiciA9IEBpbnN0YW5jZS5nZXRQYXJhbShbMCwnYWJicicsJ2FiYnJldmlhdGlvbiddKVxuICAgIEBsYW5nID0gQGluc3RhbmNlLmdldFBhcmFtKFsxLCdsYW5nJywnbGFuZ3VhZ2UnXSlcbiAgcmVzdWx0OiAtPlxuICAgIGVtbWV0ID0gaWYgd2luZG93Py5lbW1ldD9cbiAgICAgIHdpbmRvdy5lbW1ldFxuICAgIGVsc2UgaWYgd2luZG93Py5zZWxmPy5lbW1ldD9cbiAgICAgIHdpbmRvdy5zZWxmLmVtbWV0XG4gICAgZWxzZSBpZiB3aW5kb3c/Lmdsb2JhbD8uZW1tZXQ/XG4gICAgICB3aW5kb3cuZ2xvYmFsLmVtbWV0XG4gICAgZWxzZSBpZiByZXF1aXJlPyBcbiAgICAgIHRyeSBcbiAgICAgICAgcmVxdWlyZSgnZW1tZXQnKVxuICAgICAgY2F0Y2ggZXhcbiAgICAgICAgQGluc3RhbmNlLmNvZGV3YXZlLmxvZ2dlci5sb2coJ0VtbWV0IGlzIG5vdCBhdmFpbGFibGUsIGl0IG1heSBuZWVkIHRvIGJlIGluc3RhbGxlZCBtYW51YWxseScpXG4gICAgICAgIG51bGxcbiAgICBpZiBlbW1ldD9cbiAgICAgICMgZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKEBhYmJyLCBAbGFuZylcbiAgICAgIHJlcy5yZXBsYWNlKC9cXCRcXHswXFx9L2csICd8JylcblxuXG5cbiIsInZhciBCb3hDbWQsIENsb3NlQ21kLCBFZGl0Q21kLCBFbW1ldENtZCwgTmFtZVNwYWNlQ21kLCBhbGlhc0NvbW1hbmQsIGV4ZWNfcGFyZW50LCBnZXRDb250ZW50LCBnZXRQYXJhbSwgbm9fZXhlY3V0ZSwgcXVvdGVfY2FycmV0LCByZW1vdmVDb21tYW5kLCByZW5hbWVDb21tYW5kO1xuXG5pbXBvcnQge1xuICBDb21tYW5kLFxuICBCYXNlQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuaW1wb3J0IHtcbiAgTGFuZ0RldGVjdG9yXG59IGZyb20gJy4uL0RldGVjdG9yJztcblxuaW1wb3J0IHtcbiAgQm94SGVscGVyXG59IGZyb20gJy4uL0JveEhlbHBlcic7XG5cbmltcG9ydCB7XG4gIEVkaXRDbWRQcm9wXG59IGZyb20gJy4uL0VkaXRDbWRQcm9wJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuaW1wb3J0IHtcbiAgUmVwbGFjZW1lbnRcbn0gZnJvbSAnLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnO1xuXG5leHBvcnQgdmFyIENvcmVDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBDb3JlQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBjb3JlO1xuICAgIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKTtcbiAgICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSk7XG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICAnaGVscCc6IHtcbiAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn5xdW90ZV9jYXJyZXR+flxcbiAgX19fICAgICAgICAgXyAgIF9fICAgICAgX19cXG4gLyBfX3xfX18gIF9ffCB8X19cXFxcIFxcXFwgICAgLyAvXyBfX18gX19fX19fXFxuLyAvX18vIF8gXFxcXC8gX2AgLyAtX1xcXFwgXFxcXC9cXFxcLyAvIF9gIFxcXFwgViAvIC1fL1xcblxcXFxfX19fXFxcXF9fXy9cXFxcX18sX1xcXFxfX198XFxcXF8vXFxcXF8vXFxcXF9fLF98XFxcXF8vXFxcXF9fX3xcXG5UaGUgdGV4dCBlZGl0b3IgaGVscGVyXFxufn4vcXVvdGVfY2FycmV0fn5cXG5cXG5XaGVuIHVzaW5nIENvZGV3YXZlIHlvdSB3aWxsIGJlIHdyaXRpbmcgY29tbWFuZHMgd2l0aGluIFxcbnlvdXIgdGV4dCBlZGl0b3IuIFRoZXNlIGNvbW1hbmRzIG11c3QgYmUgcGxhY2VkIGJldHdlZW4gdHdvIFxcbnBhaXJzIG9mIFxcXCJ+XFxcIiAodGlsZGUpIGFuZCB0aGVuLCB0aGV5IGNhbiBiZSBleGVjdXRlZCBieSBwcmVzc2luZyBcXG5cXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIsIHdpdGggeW91ciBjdXJzb3IgaW5zaWRlIHRoZSBjb21tYW5kXFxuRXg6IH5+IWhlbGxvfn5cXG5cXG5Zb3UgZG9udCBuZWVkIHRvIGFjdHVhbGx5IHR5cGUgYW55IFxcXCJ+XFxcIiAodGlsZGUpLiBcXG5QcmVzc2luZyBcXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XFxud2l0aGluIGEgY29tbWFuZC5cXG5cXG5Db2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxcbkluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxcblRoZSBnZW5lcmF0ZWQgY29tbWVudCBibG9ja3Mgd2lsbCBiZSByZWZlcnJlZCB0byBhcyB3aW5kb3dzIFxcbmluIHRoZSBoZWxwIHNlY3Rpb25zLlxcblxcblRvIGNsb3NlIHRoaXMgd2luZG93IChpLmUuIHJlbW92ZSB0aGlzIGNvbW1lbnQgYmxvY2spLCBwcmVzcyBcXG5cXFwiY3RybFxcXCIrXFxcInNoaWZ0XFxcIitcXFwiZVxcXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXFxufn4hY2xvc2V8fn5cXG5cXG5Vc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcXG5mZWF0dXJlcyBvZiBDb2Rld2F2ZVxcbn5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiBvciB+fiFoZWxwOmRlbW9+flxcblxcbkxpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXFxufn4haGVscDpzdWJqZWN0c35+IG9yIH5+IWhlbHA6c3Vifn4gXFxuXFxufn4hY2xvc2V+flxcbn5+L2JveH5+XCIsXG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdzdWJqZWN0cyc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5+fiFoZWxwfn5cXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxcbn5+IWhlbHA6c3ViamVjdHN+fiAofn4haGVscDpzdWJ+filcXG5+fiFoZWxwOmVkaXRpbmd+fiAofn4haGVscDplZGl0fn4pXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc3ViJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpzdWJqZWN0cydcbiAgICAgICAgICB9LFxuICAgICAgICAgICdnZXRfc3RhcnRlZCc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5UaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cXG5+fiFoZWxsb3x+flxcblxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuXFxuRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcXG5+fiFoZWxwOmVkaXRpbmd+flxcblxcbkNvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxcbm9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xcbn5+IWpzOmZ+flxcbn5+IWpzOmlmfn5cXG4gIH5+IWpzOmxvZ35+XFxcIn5+IWhlbGxvfn5cXFwifn4hL2pzOmxvZ35+XFxufn4hL2pzOmlmfn5cXG5+fiEvanM6Zn5+XFxuXFxuQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxcbnByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLiBFbW1ldCBhYmJyZXZpYXRpb25zIHdpbGwgYmUgXFxudXNlZCBhdXRvbWF0aWNhbGx5IGlmIHlvdSBhcmUgaW4gYSBIVE1MIG9yIENTUyBmaWxlLlxcbn5+IXVsPmxpfn4gKGlmIHlvdSBhcmUgaW4gYSBodG1sIGRvY2N1bWVudClcXG5+fiFlbW1ldCB1bD5saX5+XFxufn4hZW1tZXQgbTIgY3Nzfn5cXG5cXG5Db21tYW5kcyBhcmUgc3RvcmVkIGluIG5hbWVzcGFjZXMuIFRoZSBzYW1lIGNvbW1hbmQgY2FuIGhhdmUgXFxuZGlmZmVyZW50IHJlc3VsdHMgZGVwZW5kaW5nIG9uIHRoZSBuYW1lc3BhY2UuXFxufn4hanM6ZWFjaH5+XFxufn4hcGhwOm91dGVyOmVhY2h+flxcbn5+IXBocDppbm5lcjplYWNofn5cXG5cXG5Tb21lIG9mIHRoZSBuYW1lc3BhY2VzIGFyZSBhY3RpdmUgZGVwZW5kaW5nIG9uIHRoZSBjb250ZXh0LiBUaGVcXG5mb2xsb3dpbmcgY29tbWFuZHMgYXJlIHRoZSBzYW1lIGFuZCB3aWxsIGRpc3BsYXkgdGhlIGN1cnJlbnRseVxcbmFjdGl2ZSBuYW1lc3BhY2UuIFRoZSBmaXJzdCBjb21tYW5kIGNvbW1hbmQgd29ya3MgYmVjYXVzZSB0aGUgXFxuY29yZSBuYW1lc3BhY2UgaXMgYWN0aXZlLlxcbn5+IW5hbWVzcGFjZX5+XFxufn4hY29yZTpuYW1lc3BhY2V+flxcblxcbllvdSBjYW4gbWFrZSBhIG5hbWVzcGFjZSBhY3RpdmUgd2l0aCB0aGUgZm9sbG93aW5nIGNvbW1hbmQuXFxufn4hbmFtZXNwYWNlIHBocH5+XFxuXFxuQ2hlY2sgdGhlIG5hbWVzcGFjZXMgYWdhaW5cXG5+fiFuYW1lc3BhY2V+flxcblxcbkluIGFkZGl0aW9uIHRvIGRldGVjdGluZyB0aGUgZG9jdW1lbnQgdHlwZSwgQ29kZXdhdmUgY2FuIGRldGVjdCB0aGVcXG5jb250ZXh0IGZyb20gdGhlIHN1cnJvdW5kaW5nIHRleHQuIEluIGEgUEhQIGZpbGUsIGl0IG1lYW5zIENvZGV3YXZlIFxcbndpbGwgYWRkIHRoZSBQSFAgdGFncyB3aGVuIHlvdSBuZWVkIHRoZW0uXFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdkZW1vJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnaGVscDpnZXRfc3RhcnRlZCdcbiAgICAgICAgICB9LFxuICAgICAgICAgICdlZGl0aW5nJzoge1xuICAgICAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgICAgICdpbnRybyc6IHtcbiAgICAgICAgICAgICAgICAncmVzdWx0JzogXCJDb2Rld2F2ZSBhbGxvd3MgeW91IHRvIG1ha2UgeW91ciBvd24gY29tbWFuZHMgKG9yIGFiYnJldmlhdGlvbnMpIFxcbnB1dCB5b3VyIGNvbnRlbnQgaW5zaWRlIFxcXCJzb3VyY2VcXFwiIHRoZSBkbyBcXFwic2F2ZVxcXCIuIFRyeSBhZGRpbmcgYW55IFxcbnRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXFxufn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxcblxcbklmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XFxuZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxcbndoZW5ldmVyIHlvdSB3YW50Llxcbn5+IW15X25ld19jb21tYW5kfn5cIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5cXG5BbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcXFwiYm94XFxcIi4gXFxuVGhleSBhcmUgbWVhbnQgdG8gZGlzcGxheSB0ZXh0IHRoYXQgc2hvdWxkIG5vdCByZW1haW4gaW4geW91ciBjb2RlLiBcXG5UaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXFxuXFxcImNsb3NlXFxcIiBjYW4gYmUgdXNlZCB0byByZW1vdmUgdGhlbSByYXBpZGx5LiBZb3UgY2FuIG1ha2UgeW91ciBvd24gXFxuY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5Llxcbn5+IWJveH5+XFxuVGhlIGJveCB3aWxsIHNjYWxlIHdpdGggdGhlIGNvbnRlbnQgeW91IHB1dCBpbiBpdFxcbn5+IWNsb3NlfH5+XFxufn4hL2JveH5+XFxuXFxufn5xdW90ZV9jYXJyZXR+flxcbldoZW4geW91IGNyZWF0ZSBhIGNvbW1hbmQsIHlvdSBtYXkgd2FudCB0byBzcGVjaWZ5IHdoZXJlIHRoZSBjdXJzb3IgXFxud2lsbCBiZSBsb2NhdGVkIG9uY2UgdGhlIGNvbW1hbmQgaXMgZXhwYW5kZWQuIFRvIGRvIHRoYXQsIHVzZSBhIFxcXCJ8XFxcIiBcXG4oVmVydGljYWwgYmFyKS4gVXNlIDIgb2YgdGhlbSBpZiB5b3Ugd2FudCB0byBwcmludCB0aGUgYWN0dWFsIFxcbmNoYXJhY3Rlci5cXG5+fiFib3h+flxcbm9uZSA6IHwgXFxudHdvIDogfHxcXG5+fiEvYm94fn5cXG5cXG5Zb3UgY2FuIGFsc28gdXNlIHRoZSBcXFwiZXNjYXBlX3BpcGVzXFxcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxcbnZlcnRpY2FsIGJhcnMgdGhhdCBhcmUgYmV0d2VlbiBpdHMgb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzXFxufn4hZXNjYXBlX3BpcGVzfn5cXG58XFxufn4hL2VzY2FwZV9waXBlc35+XFxuXFxuQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cXG5JZiB5b3Ugd2FudCB0byBwcmludCBhIGNvbW1hbmQgd2l0aG91dCBoYXZpbmcgaXQgZXhwYW5kIHdoZW4gXFxudGhlIHBhcmVudCBjb21tYW5kIGlzIGV4cGFuZGVkLCB1c2UgYSBcXFwiIVxcXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxcbn5+ISFoZWxsb35+XFxuXFxuRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXFxudGhlIFxcXCJjb250ZW50XFxcIiBjb21tYW5kLiBcXFwiY29udGVudFxcXCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XFxudGhhdCBpcyBiZXR3ZWVuIHRoZSB0YWdzLiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgaG93IGl0IGNhbiBiZSB1c2VkLlxcbn5+IWVkaXQgcGhwOmlubmVyOmlmfn5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2VkaXQnOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdoZWxwOmVkaXRpbmcnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ25vX2V4ZWN1dGUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBub19leGVjdXRlXG4gICAgICB9LFxuICAgICAgJ2VzY2FwZV9waXBlcyc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHF1b3RlX2NhcnJldCxcbiAgICAgICAgJ2NoZWNrQ2FycmV0JzogZmFsc2VcbiAgICAgIH0sXG4gICAgICAncXVvdGVfY2FycmV0Jzoge1xuICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICAgIH0sXG4gICAgICAnZXhlY19wYXJlbnQnOiB7XG4gICAgICAgICdleGVjdXRlJzogZXhlY19wYXJlbnRcbiAgICAgIH0sXG4gICAgICAnY29udGVudCc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGdldENvbnRlbnRcbiAgICAgIH0sXG4gICAgICAnYm94Jzoge1xuICAgICAgICAnY2xzJzogQm94Q21kXG4gICAgICB9LFxuICAgICAgJ2Nsb3NlJzoge1xuICAgICAgICAnY2xzJzogQ2xvc2VDbWRcbiAgICAgIH0sXG4gICAgICAncGFyYW0nOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRQYXJhbVxuICAgICAgfSxcbiAgICAgICdlZGl0Jzoge1xuICAgICAgICAnY21kcyc6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICAgJ3NhdmUnOiB7XG4gICAgICAgICAgICAnYWxpYXNPZic6ICdjb3JlOmV4ZWNfcGFyZW50J1xuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgICdjbHMnOiBFZGl0Q21kXG4gICAgICB9LFxuICAgICAgJ3JlbmFtZSc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9hcHBsaWNhYmxlJzogXCJ+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIixcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IHJlbmFtZUNvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWVcbiAgICAgIH0sXG4gICAgICAncmVtb3ZlJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnbm90X2FwcGxpY2FibGUnOiBcIn5+Ym94fn5cXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiLFxuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogcmVtb3ZlQ29tbWFuZCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZVxuICAgICAgfSxcbiAgICAgICdhbGlhcyc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiBhbGlhc0NvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWVcbiAgICAgIH0sXG4gICAgICAnbmFtZXNwYWNlJzoge1xuICAgICAgICAnY2xzJzogTmFtZVNwYWNlQ21kXG4gICAgICB9LFxuICAgICAgJ25zcGMnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6bmFtZXNwYWNlJ1xuICAgICAgfSxcbiAgICAgICdlbW1ldCc6IHtcbiAgICAgICAgJ2Nscyc6IEVtbWV0Q21kXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcblxubm9fZXhlY3V0ZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciByZWc7XG4gIHJlZyA9IG5ldyBSZWdFeHAoXCJeKFwiICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzKSArICcpJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikpO1xuICByZXR1cm4gaW5zdGFuY2Uuc3RyLnJlcGxhY2UocmVnLCAnJDEnKTtcbn07XG5cbnF1b3RlX2NhcnJldCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHJldHVybiBpbnN0YW5jZS5jb250ZW50LnJlcGxhY2UoL1xcfC9nLCAnfHwnKTsgLy8gW3Bhd2EgcHl0aG9uXSByZXBsYWNlICcvXFx8L2cnIFwiJ3wnXCJcbn07XG5cbmV4ZWNfcGFyZW50ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIHJlcztcbiAgaWYgKGluc3RhbmNlLnBhcmVudCAhPSBudWxsKSB7XG4gICAgcmVzID0gaW5zdGFuY2UucGFyZW50LmV4ZWN1dGUoKTtcbiAgICBpbnN0YW5jZS5yZXBsYWNlU3RhcnQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZVN0YXJ0O1xuICAgIGluc3RhbmNlLnJlcGxhY2VFbmQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZUVuZDtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59O1xuXG5nZXRDb250ZW50ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGFmZml4ZXNfZW1wdHksIHByZWZpeCwgc3VmZml4O1xuICBhZmZpeGVzX2VtcHR5ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydhZmZpeGVzX2VtcHR5J10sIGZhbHNlKTtcbiAgcHJlZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICBzdWZmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG4gIGlmIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuY29udGVudCB8fCAnJykgKyBzdWZmaXg7XG4gIH1cbiAgaWYgKGFmZml4ZXNfZW1wdHkpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgc3VmZml4O1xuICB9XG59O1xuXG5yZW5hbWVDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGNtZCwgY21kRGF0YSwgbmV3TmFtZSwgb3JpZ25pbmFsTmFtZSwgc2F2ZWRDbWRzLCBzdG9yYWdlO1xuICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlO1xuICBzYXZlZENtZHMgPSBzdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgb3JpZ25pbmFsTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZnJvbSddKTtcbiAgbmV3TmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAndG8nXSk7XG4gIGlmICgob3JpZ25pbmFsTmFtZSAhPSBudWxsKSAmJiAobmV3TmFtZSAhPSBudWxsKSkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0Q21kKG9yaWduaW5hbE5hbWUpO1xuICAgIGlmICgoc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdICE9IG51bGwpICYmIChjbWQgIT0gbnVsbCkpIHtcbiAgICAgIGlmICghKG5ld05hbWUuaW5kZXhPZignOicpID4gLTEpKSB7XG4gICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCAnJykgKyBuZXdOYW1lO1xuICAgICAgfVxuICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXTtcbiAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsIGNtZERhdGEpO1xuICAgICAgY21kLnVucmVnaXN0ZXIoKTtcbiAgICAgIHNhdmVkQ21kc1tuZXdOYW1lXSA9IGNtZERhdGE7XG4gICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdO1xuICAgICAgc3RvcmFnZS5zYXZlKCdjbWRzJywgc2F2ZWRDbWRzKTtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH0gZWxzZSBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJ+fm5vdF9mb3VuZH5+XCI7XG4gICAgfVxuICB9XG59O1xuXG5yZW1vdmVDb21tYW5kID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgdmFyIGNtZCwgY21kRGF0YSwgbmFtZSwgc2F2ZWRDbWRzLCBzdG9yYWdlO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZTtcbiAgICBzYXZlZENtZHMgPSBzdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKTtcbiAgICBpZiAoKHNhdmVkQ21kc1tuYW1lXSAhPSBudWxsKSAmJiAoY21kICE9IG51bGwpKSB7XG4gICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW25hbWVdO1xuICAgICAgY21kLnVucmVnaXN0ZXIoKTtcbiAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV07XG4gICAgICBzdG9yYWdlLnNhdmUoJ2NtZHMnLCBzYXZlZENtZHMpO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH1cbn07XG5cbmFsaWFzQ29tbWFuZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnYWxpYXMnXSk7XG4gIGlmICgobmFtZSAhPSBudWxsKSAmJiAoYWxpYXMgIT0gbnVsbCkpIHtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKTtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgfHwgY21kO1xuICAgICAgLy8gdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAvLyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcbiAgICAgIENvbW1hbmQuc2F2ZUNtZChhbGlhcywge1xuICAgICAgICBhbGlhc09mOiBjbWQuZnVsbE5hbWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH1cbn07XG5cbmdldFBhcmFtID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcywgaW5zdGFuY2UuZ2V0UGFyYW0oWydkZWYnLCAnZGVmYXVsdCddKSk7XG4gIH1cbn07XG5cbkJveENtZCA9IGNsYXNzIEJveENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KTtcbiAgICB0aGlzLmNtZCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydjbWQnXSk7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaGVscGVyLm9wZW5UZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWQgKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgICB0aGlzLmhlbHBlci5jbG9zZVRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY21kLnNwbGl0KFwiIFwiKVswXSArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cztcbiAgICB9XG4gICAgdGhpcy5oZWxwZXIuZGVjbyA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZGVjbztcbiAgICB0aGlzLmhlbHBlci5wYWQgPSAyO1xuICAgIHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICAgIHJldHVybiB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgfVxuXG4gIGhlaWdodCgpIHtcbiAgICB2YXIgaGVpZ2h0LCBwYXJhbXM7XG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5ib3VuZHMoKS5oZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IDM7XG4gICAgfVxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J107XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLnB1c2goMCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgaGVpZ2h0KTtcbiAgfVxuXG4gIHdpZHRoKCkge1xuICAgIHZhciBwYXJhbXMsIHdpZHRoO1xuICAgIGlmICh0aGlzLmJvdW5kcygpICE9IG51bGwpIHtcbiAgICAgIHdpZHRoID0gdGhpcy5ib3VuZHMoKS53aWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgd2lkdGggPSAzO1xuICAgIH1cbiAgICBwYXJhbXMgPSBbJ3dpZHRoJ107XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5taW5XaWR0aCgpLCB0aGlzLmluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgd2lkdGgpKTtcbiAgfVxuXG4gIGJvdW5kcygpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50KSB7XG4gICAgICBpZiAodGhpcy5fYm91bmRzID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fYm91bmRzID0gdGhpcy5oZWxwZXIudGV4dEJvdW5kcyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kcztcbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdGhpcy5oZWxwZXIuaGVpZ2h0ID0gdGhpcy5oZWlnaHQoKTtcbiAgICB0aGlzLmhlbHBlci53aWR0aCA9IHRoaXMud2lkdGgoKTtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuZHJhdyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICB9XG5cbiAgbWluV2lkdGgoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNtZC5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG59O1xuXG5DbG9zZUNtZCA9IGNsYXNzIENsb3NlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHJldHVybiB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGJveCwgYm94MiwgZGVwdGgsIHByZWZpeCwgcmVxdWlyZWRfYWZmaXhlcywgc3VmZml4O1xuICAgIHByZWZpeCA9IHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICAgIHN1ZmZpeCA9IHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpO1xuICAgIGJveCA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKTtcbiAgICByZXF1aXJlZF9hZmZpeGVzID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3JlcXVpcmVkX2FmZml4ZXMnXSwgdHJ1ZSk7XG4gICAgaWYgKCFyZXF1aXJlZF9hZmZpeGVzKSB7XG4gICAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSAnJztcbiAgICAgIGJveDIgPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSk7XG4gICAgICBpZiAoKGJveDIgIT0gbnVsbCkgJiYgKChib3ggPT0gbnVsbCkgfHwgYm94LnN0YXJ0IDwgYm94Mi5zdGFydCAtIHByZWZpeC5sZW5ndGggfHwgYm94LmVuZCA+IGJveDIuZW5kICsgc3VmZml4Lmxlbmd0aCkpIHtcbiAgICAgICAgYm94ID0gYm94MjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJveCAhPSBudWxsKSB7XG4gICAgICBkZXB0aCA9IHRoaXMuaGVscGVyLmdldE5lc3RlZEx2bCh0aGlzLmluc3RhbmNlLmdldFBvcygpLnN0YXJ0KTtcbiAgICAgIGlmIChkZXB0aCA8IDIpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5pbkJveCA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChib3guc3RhcnQsIGJveC5lbmQsICcnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLnJlcGxhY2VXaXRoKCcnKTtcbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZCA9IGNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdmFyIHJlZjtcbiAgICB0aGlzLmNtZE5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuICAgIHRoaXMudmVyYmFsaXplID0gKHJlZiA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzFdKSkgPT09ICd2JyB8fCByZWYgPT09ICd2ZXJiYWxpemUnO1xuICAgIGlmICh0aGlzLmNtZE5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmluc3RhbmNlLmNvbnRleHQuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSk7XG4gICAgICB0aGlzLmZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZTtcbiAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lZGl0YWJsZSA9IHRoaXMuY21kICE9IG51bGwgPyB0aGlzLmNtZC5pc0VkaXRhYmxlKCkgOiB0cnVlO1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWxsb3dlZE5hbWVkOiBbJ2NtZCddXG4gICAgfTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRoQ29udGVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRob3V0Q29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdFdpdGhDb250ZW50KCkge1xuICAgIHZhciBkYXRhLCBpLCBsZW4sIHAsIHBhcnNlciwgcmVmO1xuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgIHBhcnNlci5wYXJzZUFsbCgpO1xuICAgIGRhdGEgPSB7fTtcbiAgICByZWYgPSBFZGl0Q21kLnByb3BzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgcCA9IHJlZltpXTtcbiAgICAgIHAud3JpdGVGb3IocGFyc2VyLCBkYXRhKTtcbiAgICB9XG4gICAgQ29tbWFuZC5zYXZlQ21kKHRoaXMuY21kTmFtZSwgZGF0YSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcHJvcHNEaXNwbGF5KCkge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gdGhpcy5jbWQ7XG4gICAgcmV0dXJuIEVkaXRDbWQucHJvcHMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBwLmRpc3BsYXkoY21kKTtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHAgIT0gbnVsbDtcbiAgICB9KS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmVzdWx0V2l0aG91dENvbnRlbnQoKSB7XG4gICAgdmFyIG5hbWUsIHBhcnNlcjtcbiAgICBpZiAoIXRoaXMuY21kIHx8IHRoaXMuZWRpdGFibGUpIHtcbiAgICAgIG5hbWUgPSB0aGlzLmNtZCA/IHRoaXMuY21kLmZ1bGxOYW1lIDogdGhpcy5jbWROYW1lO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KGB+fmJveCBjbWQ6XCIke3RoaXMuaW5zdGFuY2UuY21kLmZ1bGxOYW1lfSAke25hbWV9XCJ+flxcbiR7dGhpcy5wcm9wc0Rpc3BsYXkoKX1cXG5+fiFzYXZlfn4gfn4hY2xvc2V+flxcbn5+L2JveH5+YCk7XG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLnZlcmJhbGl6ZSkge1xuICAgICAgICByZXR1cm4gcGFyc2VyLmdldFRleHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZC5zZXRDbWRzID0gZnVuY3Rpb24oYmFzZSkge1xuICB2YXIgaSwgbGVuLCBwLCByZWY7XG4gIHJlZiA9IEVkaXRDbWQucHJvcHM7XG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHAgPSByZWZbaV07XG4gICAgcC5zZXRDbWQoYmFzZSk7XG4gIH1cbiAgcmV0dXJuIGJhc2U7XG59O1xuXG5FZGl0Q21kLnByb3BzID0gW1xuICBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fY2FycmV0JyxcbiAge1xuICAgIG9wdDogJ2NoZWNrQ2FycmV0J1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJyxcbiAge1xuICAgIG9wdDogJ3BhcnNlJ1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3ByZXZlbnRfcGFyc2VfYWxsJyxcbiAge1xuICAgIG9wdDogJ3ByZXZlbnRQYXJzZUFsbCdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5ib29sKCdyZXBsYWNlX2JveCcsXG4gIHtcbiAgICBvcHQ6ICdyZXBsYWNlQm94J1xuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnbmFtZV90b19wYXJhbScsXG4gIHtcbiAgICBvcHQ6ICduYW1lVG9QYXJhbSdcbiAgfSksXG4gIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoJ2FsaWFzX29mJyxcbiAge1xuICAgIHZhcjogJ2FsaWFzT2YnLFxuICAgIGNhcnJldDogdHJ1ZVxuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnaGVscCcsXG4gIHtcbiAgICBmdW5jdDogJ2hlbHAnLFxuICAgIHNob3dFbXB0eTogdHJ1ZVxuICB9KSxcbiAgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnc291cmNlJyxcbiAge1xuICAgIHZhcjogJ3Jlc3VsdFN0cicsXG4gICAgZGF0YU5hbWU6ICdyZXN1bHQnLFxuICAgIHNob3dFbXB0eTogdHJ1ZSxcbiAgICBjYXJyZXQ6IHRydWVcbiAgfSlcbl07XG5cbk5hbWVTcGFjZUNtZCA9IGNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMF0pO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBpLCBsZW4sIG5hbWVzcGFjZXMsIG5zcGMsIHBhcnNlciwgdHh0O1xuICAgIGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5uYW1lKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZXNwYWNlcyA9IHRoaXMuaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCk7XG4gICAgICB0eHQgPSAnfn5ib3h+flxcbic7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lc3BhY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIG5zcGMgPSBuYW1lc3BhY2VzW2ldO1xuICAgICAgICBpZiAobnNwYyAhPT0gdGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWUpIHtcbiAgICAgICAgICB0eHQgKz0gbnNwYyArICdcXG4nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0eHQgKz0gJ35+IWNsb3NlfH5+XFxufn4vYm94fn4nO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dCk7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgfVxuICB9XG5cbn07XG5cbkVtbWV0Q21kID0gY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5hYmJyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2FiYnInLCAnYWJicmV2aWF0aW9uJ10pO1xuICAgIHJldHVybiB0aGlzLmxhbmcgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxLCAnbGFuZycsICdsYW5ndWFnZSddKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgZW1tZXQsIGV4LCByZXM7XG4gICAgZW1tZXQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IHdpbmRvdy5lbW1ldCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmID0gd2luZG93LnNlbGYpICE9IG51bGwgPyByZWYuZW1tZXQgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZWxmLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmMSA9IHdpbmRvdy5nbG9iYWwpICE9IG51bGwgPyByZWYxLmVtbWV0IDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2xvYmFsLmVtbWV0O1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiByZXF1aXJlICE9PSBudWxsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJ2VtbWV0Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmxvZ2dlci5sb2coJ0VtbWV0IGlzIG5vdCBhdmFpbGFibGUsIGl0IG1heSBuZWVkIHRvIGJlIGluc3RhbGxlZCBtYW51YWxseScpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkuY2FsbCh0aGlzKTtcbiAgICBpZiAoZW1tZXQgIT0gbnVsbCkge1xuICAgICAgLy8gZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKHRoaXMuYWJiciwgdGhpcy5sYW5nKTtcbiAgICAgIHJldHVybiByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpO1xuICAgIH1cbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCBjbGFzcyBIdG1sQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBodG1sID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2h0bWwnKSlcbiAgaHRtbC5hZGRDbWRzKHtcbiAgICAnZmFsbGJhY2snOntcbiAgICAgICdhbGlhc09mJyA6ICdjb3JlOmVtbWV0JyxcbiAgICAgICdkZWZhdWx0cycgOiB7J2xhbmcnOidodG1sJ30sXG4gICAgICAnbmFtZVRvUGFyYW0nIDogJ2FiYnInXG4gICAgfSxcbiAgfSlcbiAgXG4gIGNzcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjc3MnKSlcbiAgY3NzLmFkZENtZHMoe1xuICAgICdmYWxsYmFjayc6e1xuICAgICAgJ2FsaWFzT2YnIDogJ2NvcmU6ZW1tZXQnLFxuICAgICAgJ2RlZmF1bHRzJyA6IHsnbGFuZyc6J2Nzcyd9LFxuICAgICAgJ25hbWVUb1BhcmFtJyA6ICdhYmJyJ1xuICAgIH0sXG4gIH0pXG5cbiIsImltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmV4cG9ydCB2YXIgSHRtbENvbW1hbmRQcm92aWRlciA9IGNsYXNzIEh0bWxDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNzcywgaHRtbDtcbiAgICBodG1sID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2h0bWwnKSk7XG4gICAgaHRtbC5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplbW1ldCcsXG4gICAgICAgICdkZWZhdWx0cyc6IHtcbiAgICAgICAgICAnbGFuZyc6ICdodG1sJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjc3MgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY3NzJykpO1xuICAgIHJldHVybiBjc3MuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICAnZGVmYXVsdHMnOiB7XG4gICAgICAgICAgJ2xhbmcnOiAnY3NzJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiIyBbcGF3YSBweXRob25dXG4jICAgcmVwbGFjZSBAQ29kZXdhdmUuQ29tbWFuZC5jbWRJbml0aWFsaXNlcnMgY29tbWFuZC5jbWRJbml0aWFsaXNlcnNCYXNlQ29tbWFuZFxuIyAgIHJlcGxhY2UgKEJhc2VDb21tYW5kIChjb21tYW5kLkJhc2VDb21tYW5kXG4jICAgcmVwbGFjZSBFZGl0Q21kLnByb3BzIGVkaXRDbWRQcm9wc1xuIyAgIHJlcGxhY2UgRWRpdENtZC5zZXRDbWRzIGVkaXRDbWRTZXRDbWRzIHJlcGFyc2VcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IGNsYXNzIEpzQ29tbWFuZFByb3ZpZGVyXG4gcmVnaXN0ZXI6IChjbWRzKS0+IFxuICBqcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqcycpKVxuICBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnamF2YXNjcmlwdCcseyBhbGlhc09mOiAnanMnIH0pKVxuICBqcy5hZGRDbWRzKHtcbiAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgJ2lmJzogICdpZih8KXtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICdsb2cnOiAgJ2lmKHdpbmRvdy5jb25zb2xlKXtcXG5cXHRjb25zb2xlLmxvZyh+fmNvbnRlbnR+fnwpXFxufScsXG4gICAgJ2Z1bmN0aW9uJzpcdCdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2Z1bmN0Jzp7IGFsaWFzT2Y6ICdqczpmdW5jdGlvbicgfSxcbiAgICAnZic6eyAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJyB9LFxuICAgICdmb3InOiBcdFx0J2ZvciAodmFyIGkgPSAwOyBpIDwgfDsgaSsrKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAnZm9yaW4nOidmb3IgKHZhciB2YWwgaW4gfCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ2VhY2gnOnsgIGFsaWFzT2Y6ICdqczpmb3JpbicgfSxcbiAgICAnZm9yZWFjaCc6eyAgYWxpYXNPZjogJ2pzOmZvcmluJyB9LFxuICAgICd3aGlsZSc6ICAnd2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgJ3doaWxlaSc6ICd2YXIgaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxuXFx0aSsrO1xcbn0nLFxuICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICdpZmUnOnsgICBhbGlhc09mOiAnanM6aWZlbHNlJyB9LFxuICAgICdzd2l0Y2gnOlx0XCJcIlwiXG4gICAgICBzd2l0Y2goIHwgKSB7IFxuICAgICAgXFx0Y2FzZSA6XG4gICAgICBcXHRcXHR+fmNvbnRlbnR+flxuICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICBcXHRkZWZhdWx0IDpcbiAgICAgIFxcdFxcdFxuICAgICAgXFx0XFx0YnJlYWs7XG4gICAgICB9XG4gICAgICBcIlwiXCIsXG4gIH0pXG4iLCIgIC8vIFtwYXdhIHB5dGhvbl1cbiAgLy8gICByZXBsYWNlIEBDb2Rld2F2ZS5Db21tYW5kLmNtZEluaXRpYWxpc2VycyBjb21tYW5kLmNtZEluaXRpYWxpc2Vyc0Jhc2VDb21tYW5kXG4gIC8vICAgcmVwbGFjZSAoQmFzZUNvbW1hbmQgKGNvbW1hbmQuQmFzZUNvbW1hbmRcbiAgLy8gICByZXBsYWNlIEVkaXRDbWQucHJvcHMgZWRpdENtZFByb3BzXG4gIC8vICAgcmVwbGFjZSBFZGl0Q21kLnNldENtZHMgZWRpdENtZFNldENtZHMgcmVwYXJzZVxuaW1wb3J0IHtcbiAgQ29tbWFuZFxufSBmcm9tICcuLi9Db21tYW5kJztcblxuZXhwb3J0IHZhciBKc0NvbW1hbmRQcm92aWRlciA9IGNsYXNzIEpzQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBqcztcbiAgICBqcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqcycpKTtcbiAgICBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnamF2YXNjcmlwdCcsIHtcbiAgICAgIGFsaWFzT2Y6ICdqcydcbiAgICB9KSk7XG4gICAgcmV0dXJuIGpzLmFkZENtZHMoe1xuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgJ2lmJzogJ2lmKHwpe1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnbG9nJzogJ2lmKHdpbmRvdy5jb25zb2xlKXtcXG5cXHRjb25zb2xlLmxvZyh+fmNvbnRlbnR+fnwpXFxufScsXG4gICAgICAnZnVuY3Rpb24nOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2YnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZm9yJzogJ2ZvciAodmFyIGkgPSAwOyBpIDwgfDsgaSsrKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdmb3Jpbic6ICdmb3IgKHZhciB2YWwgaW4gfCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgICdmb3JlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgJ3doaWxlJzogJ3doaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ3doaWxlaSc6ICd2YXIgaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxuXFx0aSsrO1xcbn0nLFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgICAnaWZlJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6aWZlbHNlJ1xuICAgICAgfSxcbiAgICAgICdzd2l0Y2gnOiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5jb250ZW50fn5cXG5cXHRcXHRicmVhaztcXG5cXHRkZWZhdWx0IDpcXG5cXHRcXHRcXG5cXHRcXHRicmVhaztcXG59XCJcbiAgICB9KTtcbiAgfVxuXG59O1xuIiwiXG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vQ29tbWFuZCc7XG5pbXBvcnQgeyBQYWlyRGV0ZWN0b3IgfSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCBjbGFzcyBQaHBDb21tYW5kUHJvdmlkZXJcbiByZWdpc3RlcjogKGNtZHMpLT4gXG4gIHBocCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdwaHAnKSlcbiAgcGhwLmFkZERldGVjdG9yKG5ldyBQYWlyRGV0ZWN0b3Ioe1xuICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgb3BlbmVyOiAnPD9waHAnLFxuICAgIGNsb3NlcjogJz8+JyxcbiAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICdlbHNlJzogJ3BocDpvdXRlcidcbiAgfSkpIFxuXG4gIHBocE91dGVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnb3V0ZXInKSlcbiAgcGhwT3V0ZXIuYWRkQ21kcyh7XG4gICAgJ2ZhbGxiYWNrJzp7XG4gICAgICAnY21kcycgOiB7XG4gICAgICAgICdhbnlfY29udGVudCc6IHsgXG4gICAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcgXG4gICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbidcbiAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICdcbiAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBhbGlhc09mOiAncGhwOmlubmVyOiVuYW1lJScsXG4gICAgICBhbHRlclJlc3VsdDogd3JhcFdpdGhQaHBcbiAgICB9LFxuICAgICdib3gnOiB7IFxuICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyBcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHByZWZpeDogJzw/cGhwXFxuJ1xuICAgICAgICBzdWZmaXg6ICdcXG4/PidcbiAgICAgIH1cbiAgICB9LFxuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+JyxcbiAgfSlcbiAgXG4gIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSlcbiAgcGhwSW5uZXIuYWRkQ21kcyh7XG4gICAgJ2FueV9jb250ZW50JzogeyBhbGlhc09mOiAnY29yZTpjb250ZW50JyB9LFxuICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAnaWYnOiAgICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnaW5mbyc6ICdwaHBpbmZvKCk7JyxcbiAgICAnZWNobyc6ICdlY2hvIHwnLFxuICAgICdlJzp7ICAgYWxpYXNPZjogJ3BocDppbm5lcjplY2hvJyB9LFxuICAgICdjbGFzcyc6e1xuICAgICAgcmVzdWx0IDogXCJcIlwiXG4gICAgICAgIGNsYXNzIH5+cGFyYW0gMCBjbGFzcyBkZWY6fH5+IHtcbiAgICAgICAgXFx0ZnVuY3Rpb24gX19jb25zdHJ1Y3QoKSB7XG4gICAgICAgIFxcdFxcdH5+Y29udGVudH5+fFxuICAgICAgICBcXHR9XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiLFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2MnOnsgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnIH0sXG4gICAgJ2Z1bmN0aW9uJzpcdHtcbiAgICAgIHJlc3VsdCA6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufSdcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdmdW5jdCc6eyBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJyB9LFxuICAgICdmJzp7ICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJyB9LFxuICAgICdhcnJheSc6ICAnJHwgPSBhcnJheSgpOycsXG4gICAgJ2EnOlx0ICAgICdhcnJheSgpJyxcbiAgICAnZm9yJzogXHRcdCdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICdmb3JlYWNoJzonZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgJ2VhY2gnOnsgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Zm9yZWFjaCcgfSxcbiAgICAnd2hpbGUnOiAgJ3doaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAnd2hpbGVpJzoge1xuICAgICAgcmVzdWx0IDogJyRpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxuXFx0JGkrKztcXG59JyxcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdpZmVsc2UnOiAnaWYoIHwgKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAnaWZlJzp7ICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnIH0sXG4gICAgJ3N3aXRjaCc6XHR7XG4gICAgICByZXN1bHQgOiBcIlwiXCJcbiAgICAgICAgc3dpdGNoKCB8ICkgeyBcbiAgICAgICAgXFx0Y2FzZSA6XG4gICAgICAgIFxcdFxcdH5+YW55X2NvbnRlbnR+flxuICAgICAgICBcXHRcXHRicmVhaztcbiAgICAgICAgXFx0ZGVmYXVsdCA6XG4gICAgICAgIFxcdFxcdFxuICAgICAgICBcXHRcXHRicmVhaztcbiAgICAgICAgfVxuICAgICAgICBcIlwiXCIsXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgICdjbG9zZSc6IHsgXG4gICAgICBhbGlhc09mOiAnY29yZTpjbG9zZScgXG4gICAgICBkZWZhdWx0czoge1xuICAgICAgICBwcmVmaXg6ICc8P3BocFxcbidcbiAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIHJlcXVpcmVkX2FmZml4ZXM6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgfSlcbiAgXG5cbndyYXBXaXRoUGhwID0gKHJlc3VsdCxpbnN0YW5jZSkgLT5cbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywnaW5saW5lJ10sdHJ1ZSlcbiAgaWYgaW5saW5lXG4gICAgcmVnT3BlbiA9IC88XFw/cGhwXFxzKFtcXFxcblxcXFxyXFxzXSspL2dcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZ1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/PidcbiAgZWxzZVxuICAgICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nXG5cbiMgY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuIyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICciLCJ2YXIgd3JhcFdpdGhQaHA7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIENvbW1hbmRcbn0gZnJvbSAnLi4vQ29tbWFuZCc7XG5cbmltcG9ydCB7XG4gIFBhaXJEZXRlY3RvclxufSBmcm9tICcuLi9EZXRlY3Rvcic7XG5cbmV4cG9ydCB2YXIgUGhwQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBwaHAsIHBocElubmVyLCBwaHBPdXRlcjtcbiAgICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpO1xuICAgIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgICBvcGVuZXI6ICc8P3BocCcsXG4gICAgICBjbG9zZXI6ICc/PicsXG4gICAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICAgJ2Vsc2UnOiAncGhwOm91dGVyJ1xuICAgIH0pKTtcbiAgICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpO1xuICAgIHBocE91dGVyLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnYW55X2NvbnRlbnQnOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50JyxcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbicsXG4gICAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICcsXG4gICAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6JW5hbWUlJyxcbiAgICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgICB9LFxuICAgICAgJ2JveCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+J1xuICAgIH0pO1xuICAgIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSk7XG4gICAgcmV0dXJuIHBocElubmVyLmFkZENtZHMoe1xuICAgICAgJ2FueV9jb250ZW50Jzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50J1xuICAgICAgfSxcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgICdpZic6ICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdpbmZvJzogJ3BocGluZm8oKTsnLFxuICAgICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAgICdlJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmVjaG8nXG4gICAgICB9LFxuICAgICAgJ2NsYXNzJzoge1xuICAgICAgICByZXN1bHQ6IFwiY2xhc3Mgfn5wYXJhbSAwIGNsYXNzIGRlZjp8fn4ge1xcblxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xcblxcdFxcdH5+Y29udGVudH5+fFxcblxcdH1cXG59XCIsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2MnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnXG4gICAgICB9LFxuICAgICAgJ2Z1bmN0aW9uJzoge1xuICAgICAgICByZXN1bHQ6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdhcnJheSc6ICckfCA9IGFycmF5KCk7JyxcbiAgICAgICdhJzogJ2FycmF5KCknLFxuICAgICAgJ2Zvcic6ICdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2ZvcmVhY2gnOiAnZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmb3JlYWNoJ1xuICAgICAgfSxcbiAgICAgICd3aGlsZSc6ICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnd2hpbGVpJzoge1xuICAgICAgICByZXN1bHQ6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgJ2lmZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnXG4gICAgICB9LFxuICAgICAgJ3N3aXRjaCc6IHtcbiAgICAgICAgcmVzdWx0OiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5hbnlfY29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufVwiLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PicsXG4gICAgICAgICAgcmVxdWlyZWRfYWZmaXhlczogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5cbndyYXBXaXRoUGhwID0gZnVuY3Rpb24ocmVzdWx0LCBpbnN0YW5jZSkge1xuICB2YXIgaW5saW5lLCByZWdDbG9zZSwgcmVnT3BlbjtcbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywgJ2lubGluZSddLCB0cnVlKTtcbiAgaWYgKGlubGluZSkge1xuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nO1xuICAgIHJlZ0Nsb3NlID0gLyhbXFxuXFxyXFxzXSspXFxzXFw/Pi9nO1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/Pic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nO1xuICB9XG59O1xuXG4vLyBjbG9zZVBocEZvckNvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4vLyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICdcbiIsImltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9ib290c3RyYXAnO1xuaW1wb3J0IHsgVGV4dEFyZWFFZGl0b3IgfSBmcm9tICcuL1RleHRBcmVhRWRpdG9yJztcblxuQ29kZXdhdmUuZGV0ZWN0ID0gKHRhcmdldCkgLT5cbiAgY3cgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRBcmVhRWRpdG9yKHRhcmdldCkpXG4gIENvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KVxuICBjd1xuXG5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZVxuXG53aW5kb3cuQ29kZXdhdmUgPSBDb2Rld2F2ZVxuXG4gICIsImltcG9ydCB7XG4gIENvZGV3YXZlXG59IGZyb20gJy4vYm9vdHN0cmFwJztcblxuaW1wb3J0IHtcbiAgVGV4dEFyZWFFZGl0b3Jcbn0gZnJvbSAnLi9UZXh0QXJlYUVkaXRvcic7XG5cbkNvZGV3YXZlLmRldGVjdCA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICB2YXIgY3c7XG4gIGN3ID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvcih0YXJnZXQpKTtcbiAgQ29kZXdhdmUuaW5zdGFuY2VzLnB1c2goY3cpO1xuICByZXR1cm4gY3c7XG59O1xuXG5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZTtcblxud2luZG93LkNvZGV3YXZlID0gQ29kZXdhdmU7XG4iLCJleHBvcnQgY2xhc3MgQXJyYXlIZWxwZXJcbiAgQGlzQXJyYXk6IChhcnIpIC0+XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggYXJyICkgPT0gJ1tvYmplY3QgQXJyYXldJ1xuICBcbiAgQHVuaW9uOiAoYTEsYTIpIC0+XG4gICAgQHVuaXF1ZShhMS5jb25jYXQoYTIpKVxuICAgIFxuICBAdW5pcXVlOiAoYXJyYXkpIC0+XG4gICAgYSA9IGFycmF5LmNvbmNhdCgpXG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgYS5sZW5ndGhcbiAgICAgIGogPSBpICsgMVxuICAgICAgd2hpbGUgaiA8IGEubGVuZ3RoXG4gICAgICAgIGlmIGFbaV0gPT0gYVtqXVxuICAgICAgICAgIGEuc3BsaWNlKGotLSwgMSlcbiAgICAgICAgKytqXG4gICAgICArK2lcbiAgICBhIiwiZXhwb3J0IHZhciBBcnJheUhlbHBlciA9IGNsYXNzIEFycmF5SGVscGVyIHtcbiAgc3RhdGljIGlzQXJyYXkoYXJyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9XG5cbiAgc3RhdGljIHVuaW9uKGExLCBhMikge1xuICAgIHJldHVybiB0aGlzLnVuaXF1ZShhMS5jb25jYXQoYTIpKTtcbiAgfVxuXG4gIHN0YXRpYyB1bmlxdWUoYXJyYXkpIHtcbiAgICB2YXIgYSwgaSwgajtcbiAgICBhID0gYXJyYXkuY29uY2F0KCk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBhLmxlbmd0aCkge1xuICAgICAgaiA9IGkgKyAxO1xuICAgICAgd2hpbGUgKGogPCBhLmxlbmd0aCkge1xuICAgICAgICBpZiAoYVtpXSA9PT0gYVtqXSkge1xuICAgICAgICAgIGEuc3BsaWNlKGotLSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgKytqO1xuICAgICAgfVxuICAgICAgKytpO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfVxuXG59O1xuIiwiZXhwb3J0IGNsYXNzIENvbW1vbkhlbHBlclxuXG4gIEBtZXJnZTogKHhzLi4uKSAtPlxuICAgIGlmIHhzPy5sZW5ndGggPiAwXG4gICAgICBAdGFwIHt9LCAobSkgLT4gbVtrXSA9IHYgZm9yIGssIHYgb2YgeCBmb3IgeCBpbiB4c1xuIFxuICBAdGFwOiAobywgZm4pIC0+IFxuICAgIGZuKG8pXG4gICAgb1xuXG4gIEBhcHBseU1peGluczogKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIC0+IFxuICAgIGJhc2VDdG9ycy5mb3JFYWNoIChiYXNlQ3RvcikgPT4gXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpLmZvckVhY2ggKG5hbWUpPT4gXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLCBuYW1lLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2VDdG9yLnByb3RvdHlwZSwgbmFtZSkpIiwiZXhwb3J0IHZhciBDb21tb25IZWxwZXIgPSBjbGFzcyBDb21tb25IZWxwZXIge1xuICBzdGF0aWMgbWVyZ2UoLi4ueHMpIHtcbiAgICBpZiAoKHhzICE9IG51bGwgPyB4cy5sZW5ndGggOiB2b2lkIDApID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFwKHt9LCBmdW5jdGlvbihtKSB7XG4gICAgICAgIHZhciBpLCBrLCBsZW4sIHJlc3VsdHMsIHYsIHg7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0geHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB4ID0geHNbaV07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzMTtcbiAgICAgICAgICAgIHJlc3VsdHMxID0gW107XG4gICAgICAgICAgICBmb3IgKGsgaW4geCkge1xuICAgICAgICAgICAgICB2ID0geFtrXTtcbiAgICAgICAgICAgICAgcmVzdWx0czEucHVzaChtW2tdID0gdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0czE7XG4gICAgICAgICAgfSkoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdGFwKG8sIGZuKSB7XG4gICAgZm4obyk7XG4gICAgcmV0dXJuIG87XG4gIH1cblxuICBzdGF0aWMgYXBwbHlNaXhpbnMoZGVyaXZlZEN0b3IsIGJhc2VDdG9ycykge1xuICAgIHJldHVybiBiYXNlQ3RvcnMuZm9yRWFjaCgoYmFzZUN0b3IpID0+IHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbn07XG4iLCJcbmV4cG9ydCBjbGFzcyBOYW1lc3BhY2VIZWxwZXJcblxuICBAc3BsaXRGaXJzdDogKGZ1bGxuYW1lLGlzU3BhY2UgPSBmYWxzZSkgLT5cbiAgICBpZiBmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PSAtMSBhbmQgIWlzU3BhY2VcbiAgICAgIHJldHVybiBbbnVsbCxmdWxsbmFtZV1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6JylcbiAgICByZXR1cm4gW3BhcnRzLnNoaWZ0KCkscGFydHMuam9pbignOicpIHx8IG51bGxdXG5cbiAgQHNwbGl0OiAoZnVsbG5hbWUpIC0+XG4gICAgaWYgZnVsbG5hbWUuaW5kZXhPZihcIjpcIikgPT0gLTFcbiAgICAgIHJldHVybiBbbnVsbCxmdWxsbmFtZV1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6JylcbiAgICBuYW1lID0gcGFydHMucG9wKClcbiAgICBbcGFydHMuam9pbignOicpLG5hbWVdIiwiZXhwb3J0IHZhciBOYW1lc3BhY2VIZWxwZXIgPSBjbGFzcyBOYW1lc3BhY2VIZWxwZXIge1xuICBzdGF0aWMgc3BsaXRGaXJzdChmdWxsbmFtZSwgaXNTcGFjZSA9IGZhbHNlKSB7XG4gICAgdmFyIHBhcnRzO1xuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PT0gLTEgJiYgIWlzU3BhY2UpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdO1xuICAgIH1cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6Jyk7XG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLCBwYXJ0cy5qb2luKCc6JykgfHwgbnVsbF07XG4gIH1cblxuICBzdGF0aWMgc3BsaXQoZnVsbG5hbWUpIHtcbiAgICB2YXIgbmFtZSwgcGFydHM7XG4gICAgaWYgKGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09PSAtMSkge1xuICAgICAgcmV0dXJuIFtudWxsLCBmdWxsbmFtZV07XG4gICAgfVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKTtcbiAgICBuYW1lID0gcGFydHMucG9wKCk7XG4gICAgcmV0dXJuIFtwYXJ0cy5qb2luKCc6JyksIG5hbWVdO1xuICB9XG5cbn07XG4iLCJcbmV4cG9ydCBjbGFzcyBPcHRpb25hbFByb21pc2VcbiAgICBjb25zdHJ1Y3RvcjogKEB2YWwpIC0+XG4gICAgICAgIGlmIEB2YWw/IGFuZCBAdmFsLnRoZW4/IGFuZCBAdmFsLnJlc3VsdD9cbiAgICAgICAgICAgIEB2YWwgPSBAdmFsLnJlc3VsdCgpXG4gICAgdGhlbjogKGNiKSAtPlxuICAgICAgICBpZiBAdmFsPyBhbmQgQHZhbC50aGVuP1xuICAgICAgICAgICAgbmV3IE9wdGlvbmFsUHJvbWlzZShAdmFsLnRoZW4oY2IpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXcgT3B0aW9uYWxQcm9taXNlKGNiKEB2YWwpKVxuICAgIHJlc3VsdDogLT5cbiAgICAgICAgQHZhbFxuXG5leHBvcnQgb3B0aW9uYWxQcm9taXNlID0gKHZhbCktPiBcbiAgICBuZXcgT3B0aW9uYWxQcm9taXNlKHZhbClcblxuXG4iLCJleHBvcnQgdmFyIE9wdGlvbmFsUHJvbWlzZSA9IGNsYXNzIE9wdGlvbmFsUHJvbWlzZSB7XG4gIGNvbnN0cnVjdG9yKHZhbDEpIHtcbiAgICB0aGlzLnZhbCA9IHZhbDE7XG4gICAgaWYgKCh0aGlzLnZhbCAhPSBudWxsKSAmJiAodGhpcy52YWwudGhlbiAhPSBudWxsKSAmJiAodGhpcy52YWwucmVzdWx0ICE9IG51bGwpKSB7XG4gICAgICB0aGlzLnZhbCA9IHRoaXMudmFsLnJlc3VsdCgpO1xuICAgIH1cbiAgfVxuXG4gIHRoZW4oY2IpIHtcbiAgICBpZiAoKHRoaXMudmFsICE9IG51bGwpICYmICh0aGlzLnZhbC50aGVuICE9IG51bGwpKSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh0aGlzLnZhbC50aGVuKGNiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKGNiKHRoaXMudmFsKSk7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHJldHVybiB0aGlzLnZhbDtcbiAgfVxuXG59O1xuXG5leHBvcnQgdmFyIG9wdGlvbmFsUHJvbWlzZSA9IGZ1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh2YWwpO1xufTtcbiIsImltcG9ydCB7IFNpemUgfSBmcm9tICcuLi9wb3NpdGlvbmluZy9TaXplJztcblxuZXhwb3J0IGNsYXNzIFN0cmluZ0hlbHBlclxuICBAdHJpbUVtcHR5TGluZTogKHR4dCkgLT5cbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJylcblxuICBAZXNjYXBlUmVnRXhwOiAoc3RyKSAtPlxuICAgIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIilcblxuICBAcmVwZWF0VG9MZW5ndGg6ICh0eHQsIGxlbmd0aCkgLT5cbiAgICByZXR1cm4gJycgaWYgbGVuZ3RoIDw9IDBcbiAgICBBcnJheShNYXRoLmNlaWwobGVuZ3RoL3R4dC5sZW5ndGgpKzEpLmpvaW4odHh0KS5zdWJzdHJpbmcoMCxsZW5ndGgpXG4gICAgXG4gIEByZXBlYXQ6ICh0eHQsIG5iKSAtPlxuICAgIEFycmF5KG5iKzEpLmpvaW4odHh0KVxuICAgIFxuICBAZ2V0VHh0U2l6ZTogKHR4dCkgLT5cbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywnJykuc3BsaXQoXCJcXG5cIikgICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICcvXFxyL2cnIFwiJ1xccidcIlxuICAgIHcgPSAwXG4gICAgZm9yIGwgaW4gbGluZXNcbiAgICAgIHcgPSBNYXRoLm1heCh3LGwubGVuZ3RoKVxuICAgIHJldHVybiBuZXcgU2l6ZSh3LGxpbmVzLmxlbmd0aC0xKVxuXG4gIEBpbmRlbnROb3RGaXJzdDogKHRleHQsbmI9MSxzcGFjZXM9JyAgJykgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmVnID0gL1xcbi9nICAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAnL1xcbi9nJyBcInJlLmNvbXBpbGUocidcXG4nLHJlLk0pXCJcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCBcIlxcblwiICsgQHJlcGVhdChzcGFjZXMsIG5iKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICAgICAgXG4gIEBpbmRlbnQ6ICh0ZXh0LG5iPTEsc3BhY2VzPScgICcpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJldHVybiBzcGFjZXMgKyBAaW5kZW50Tm90Rmlyc3QodGV4dCxuYixzcGFjZXMpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgXG4gIEByZXZlcnNlU3RyOiAodHh0KSAtPlxuICAgIHJldHVybiB0eHQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIilcbiAgXG4gIFxuICBAcmVtb3ZlQ2FycmV0OiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHRtcCA9ICdbW1tbcXVvdGVkX2NhcnJldF1dXV0nXG4gICAgcmVDYXJyZXQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIrY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHJlVG1wID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKHRtcCksIFwiZ1wiKVxuICAgIHR4dC5yZXBsYWNlKHJlUXVvdGVkLHRtcCkucmVwbGFjZShyZUNhcnJldCwnJykucmVwbGFjZShyZVRtcCwgY2FycmV0Q2hhcilcbiAgICBcbiAgQGdldEFuZFJlbW92ZUZpcnN0Q2FycmV0OiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHBvcyA9IEBnZXRDYXJyZXRQb3ModHh0LGNhcnJldENoYXIpXG4gICAgaWYgcG9zP1xuICAgICAgdHh0ID0gdHh0LnN1YnN0cigwLHBvcykgKyB0eHQuc3Vic3RyKHBvcytjYXJyZXRDaGFyLmxlbmd0aClcbiAgICAgIHJldHVybiBbcG9zLHR4dF1cbiAgICAgIFxuICBAZ2V0Q2FycmV0UG9zOiAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSAtPlxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cChAZXNjYXBlUmVnRXhwKGNhcnJldENoYXIrY2FycmV0Q2hhciksIFwiZ1wiKVxuICAgIHR4dCA9IHR4dC5yZXBsYWNlKHJlUXVvdGVkLCAnICcpICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIHJlUXVvdGVkIGNhcnJldENoYXIrY2FycmV0Q2hhclxuICAgIGlmIChpID0gdHh0LmluZGV4T2YoY2FycmV0Q2hhcikpID4gLTFcbiAgICAgIHJldHVybiBpIiwiaW1wb3J0IHtcbiAgU2l6ZVxufSBmcm9tICcuLi9wb3NpdGlvbmluZy9TaXplJztcblxuZXhwb3J0IHZhciBTdHJpbmdIZWxwZXIgPSBjbGFzcyBTdHJpbmdIZWxwZXIge1xuICBzdGF0aWMgdHJpbUVtcHR5TGluZSh0eHQpIHtcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJyk7XG4gIH1cblxuICBzdGF0aWMgZXNjYXBlUmVnRXhwKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpO1xuICB9XG5cbiAgc3RhdGljIHJlcGVhdFRvTGVuZ3RoKHR4dCwgbGVuZ3RoKSB7XG4gICAgaWYgKGxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gdHh0Lmxlbmd0aCkgKyAxKS5qb2luKHR4dCkuc3Vic3RyaW5nKDAsIGxlbmd0aCk7XG4gIH1cblxuICBzdGF0aWMgcmVwZWF0KHR4dCwgbmIpIHtcbiAgICByZXR1cm4gQXJyYXkobmIgKyAxKS5qb2luKHR4dCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0VHh0U2l6ZSh0eHQpIHtcbiAgICB2YXIgaiwgbCwgbGVuLCBsaW5lcywgdztcbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpOyAvLyBbcGF3YSBweXRob25dIHJlcGxhY2UgJy9cXHIvZycgXCInXFxyJ1wiXG4gICAgdyA9IDA7XG4gICAgZm9yIChqID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIGwgPSBsaW5lc1tqXTtcbiAgICAgIHcgPSBNYXRoLm1heCh3LCBsLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgU2l6ZSh3LCBsaW5lcy5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnROb3RGaXJzdCh0ZXh0LCBuYiA9IDEsIHNwYWNlcyA9ICcgICcpIHtcbiAgICB2YXIgcmVnO1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IC9cXG4vZzsgLy8gW3Bhd2EgcHl0aG9uXSByZXBsYWNlICcvXFxuL2cnIFwicmUuY29tcGlsZShyJ1xcbicscmUuTSlcIlxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXFxuXCIgKyB0aGlzLnJlcGVhdChzcGFjZXMsIG5iKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnQodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNwYWNlcyArIHRoaXMuaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIsIHNwYWNlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZXZlcnNlU3RyKHR4dCkge1xuICAgIHJldHVybiB0eHQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIik7XG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlQ2FycmV0KHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciByZUNhcnJldCwgcmVRdW90ZWQsIHJlVG1wLCB0bXA7XG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSc7XG4gICAgcmVDYXJyZXQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHJlVG1wID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cCh0bXApLCBcImdcIik7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKHJlUXVvdGVkLCB0bXApLnJlcGxhY2UocmVDYXJyZXQsICcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcG9zO1xuICAgIHBvcyA9IHRoaXMuZ2V0Q2FycmV0UG9zKHR4dCwgY2FycmV0Q2hhcik7XG4gICAgaWYgKHBvcyAhPSBudWxsKSB7XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAsIHBvcykgKyB0eHQuc3Vic3RyKHBvcyArIGNhcnJldENoYXIubGVuZ3RoKTtcbiAgICAgIHJldHVybiBbcG9zLCB0eHRdO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXRDYXJyZXRQb3ModHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIGksIHJlUXVvdGVkO1xuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKTsgLy8gW3Bhd2EgcHl0aG9uXSByZXBsYWNlIHJlUXVvdGVkIGNhcnJldENoYXIrY2FycmV0Q2hhclxuICAgIGlmICgoaSA9IHR4dC5pbmRleE9mKGNhcnJldENoYXIpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cblxufTtcbiIsIlxuaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuaW1wb3J0IHsgUGFpck1hdGNoIH0gZnJvbSAnLi9QYWlyTWF0Y2gnO1xuXG5leHBvcnQgY2xhc3MgUGFpclxuICBjb25zdHJ1Y3RvcjogKEBvcGVuZXIsQGNsb3NlcixAb3B0aW9ucyA9IHt9KSAtPlxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2VcbiAgICAgIHZhbGlkTWF0Y2g6IG51bGxcbiAgICB9XG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2YgQG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gQG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgb3BlbmVyUmVnOiAtPlxuICAgIGlmIHR5cGVvZiBAb3BlbmVyID09ICdzdHJpbmcnIFxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAb3BlbmVyKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQG9wZW5lclxuICBjbG9zZXJSZWc6IC0+XG4gICAgaWYgdHlwZW9mIEBjbG9zZXIgPT0gJ3N0cmluZycgXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjbG9zZXIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAY2xvc2VyXG4gIG1hdGNoQW55UGFydHM6IC0+XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW5lcjogQG9wZW5lclJlZygpXG4gICAgICBjbG9zZXI6IEBjbG9zZXJSZWcoKVxuICAgIH1cbiAgbWF0Y2hBbnlQYXJ0S2V5czogLT5cbiAgICBrZXlzID0gW11cbiAgICBmb3Iga2V5LCByZWcgb2YgQG1hdGNoQW55UGFydHMoKVxuICAgICAga2V5cy5wdXNoKGtleSlcbiAgICByZXR1cm4ga2V5c1xuICBtYXRjaEFueVJlZzogLT5cbiAgICBncm91cHMgPSBbXVxuICAgIGZvciBrZXksIHJlZyBvZiBAbWF0Y2hBbnlQYXJ0cygpXG4gICAgICBncm91cHMucHVzaCgnKCcrcmVnLnNvdXJjZSsnKScpICAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSByZWcuc291cmNlIHJlZy5wYXR0ZXJuXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoZ3JvdXBzLmpvaW4oJ3wnKSlcbiAgbWF0Y2hBbnk6ICh0ZXh0LG9mZnNldD0wKSAtPlxuICAgIHdoaWxlIChtYXRjaCA9IEBfbWF0Y2hBbnkodGV4dCxvZmZzZXQpKT8gYW5kICFtYXRjaC52YWxpZCgpXG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgIHJldHVybiBtYXRjaCBpZiBtYXRjaD8gYW5kIG1hdGNoLnZhbGlkKClcbiAgX21hdGNoQW55OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICBpZiBvZmZzZXRcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cihvZmZzZXQpXG4gICAgbWF0Y2ggPSBAbWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpXG4gICAgaWYgbWF0Y2g/XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLG1hdGNoLG9mZnNldClcbiAgbWF0Y2hBbnlOYW1lZDogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBfbWF0Y2hBbnlHZXROYW1lKEBtYXRjaEFueSh0ZXh0KSlcbiAgbWF0Y2hBbnlMYXN0OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICB3aGlsZSBtYXRjaCA9IEBtYXRjaEFueSh0ZXh0LG9mZnNldClcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpXG4gICAgICBpZiAhcmVzIG9yIHJlcy5lbmQoKSAhPSBtYXRjaC5lbmQoKVxuICAgICAgICByZXMgPSBtYXRjaFxuICAgIHJldHVybiByZXNcbiAgaWRlbnRpY2FsOiAtPlxuICAgIEBvcGVuZXIgPT0gQGNsb3NlciBvciAoXG4gICAgICBAb3BlbmVyLnNvdXJjZT8gYW5kIFxuICAgICAgQGNsb3Nlci5zb3VyY2U/IGFuZCBcbiAgICAgIEBvcGVuZXIuc291cmNlID09IEBjbG9zZXIuc291cmNlXG4gICAgKVxuICB3cmFwcGVyUG9zOiAocG9zLHRleHQpIC0+XG4gICAgc3RhcnQgPSBAbWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAscG9zLnN0YXJ0KSlcbiAgICBpZiBzdGFydD8gYW5kIChAaWRlbnRpY2FsKCkgb3Igc3RhcnQubmFtZSgpID09ICdvcGVuZXInKVxuICAgICAgZW5kID0gQG1hdGNoQW55KHRleHQscG9zLmVuZClcbiAgICAgIGlmIGVuZD8gYW5kIChAaWRlbnRpY2FsKCkgb3IgZW5kLm5hbWUoKSA9PSAnY2xvc2VyJylcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSxlbmQuZW5kKCkpXG4gICAgICBlbHNlIGlmIEBvcHRpb25uYWxfZW5kXG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksdGV4dC5sZW5ndGgpXG4gIGlzV2FwcGVyT2Y6IChwb3MsdGV4dCkgLT5cbiAgICByZXR1cm4gQHdyYXBwZXJQb3MocG9zLHRleHQpPyIsImltcG9ydCB7XG4gIFBvc1xufSBmcm9tICcuL1Bvcyc7XG5cbmltcG9ydCB7XG4gIFN0cmluZ0hlbHBlclxufSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmltcG9ydCB7XG4gIFBhaXJNYXRjaFxufSBmcm9tICcuL1BhaXJNYXRjaCc7XG5cbmV4cG9ydCB2YXIgUGFpciA9IGNsYXNzIFBhaXIge1xuICBjb25zdHJ1Y3RvcihvcGVuZXIsIGNsb3Nlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbDtcbiAgICB0aGlzLm9wZW5lciA9IG9wZW5lcjtcbiAgICB0aGlzLmNsb3NlciA9IGNsb3NlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2UsXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfTtcbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIGlmIChrZXkgaW4gdGhpcy5vcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMub3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5lclJlZygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub3BlbmVyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm9wZW5lcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuZXI7XG4gICAgfVxuICB9XG5cbiAgY2xvc2VyUmVnKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jbG9zZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY2xvc2VyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NlcjtcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueVBhcnRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvcGVuZXI6IHRoaXMub3BlbmVyUmVnKCksXG4gICAgICBjbG9zZXI6IHRoaXMuY2xvc2VyUmVnKClcbiAgICB9O1xuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0S2V5cygpIHtcbiAgICB2YXIga2V5LCBrZXlzLCByZWYsIHJlZztcbiAgICBrZXlzID0gW107XG4gICAgcmVmID0gdGhpcy5tYXRjaEFueVBhcnRzKCk7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XTtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIG1hdGNoQW55UmVnKCkge1xuICAgIHZhciBncm91cHMsIGtleSwgcmVmLCByZWc7XG4gICAgZ3JvdXBzID0gW107XG4gICAgcmVmID0gdGhpcy5tYXRjaEFueVBhcnRzKCk7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XTtcbiAgICAgIGdyb3Vwcy5wdXNoKCcoJyArIHJlZy5zb3VyY2UgKyAnKScpOyAvLyBbcGF3YSBweXRob25dIHJlcGxhY2UgcmVnLnNvdXJjZSByZWcucGF0dGVyblxuICAgIH1cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChncm91cHMuam9pbignfCcpKTtcbiAgfVxuXG4gIG1hdGNoQW55KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2g7XG4gICAgd2hpbGUgKCgobWF0Y2ggPSB0aGlzLl9tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSAhPSBudWxsKSAmJiAhbWF0Y2gudmFsaWQoKSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKCk7XG4gICAgfVxuICAgIGlmICgobWF0Y2ggIT0gbnVsbCkgJiYgbWF0Y2gudmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgfVxuXG4gIF9tYXRjaEFueSh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoO1xuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cihvZmZzZXQpO1xuICAgIH1cbiAgICBtYXRjaCA9IHRoaXMubWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpO1xuICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLCBtYXRjaCwgb2Zmc2V0KTtcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueU5hbWVkKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF0Y2hBbnlHZXROYW1lKHRoaXMubWF0Y2hBbnkodGV4dCkpO1xuICB9XG5cbiAgbWF0Y2hBbnlMYXN0KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2gsIHJlcztcbiAgICB3aGlsZSAobWF0Y2ggPSB0aGlzLm1hdGNoQW55KHRleHQsIG9mZnNldCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpO1xuICAgICAgaWYgKCFyZXMgfHwgcmVzLmVuZCgpICE9PSBtYXRjaC5lbmQoKSkge1xuICAgICAgICByZXMgPSBtYXRjaDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGlkZW50aWNhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZXIgPT09IHRoaXMuY2xvc2VyIHx8ICgodGhpcy5vcGVuZXIuc291cmNlICE9IG51bGwpICYmICh0aGlzLmNsb3Nlci5zb3VyY2UgIT0gbnVsbCkgJiYgdGhpcy5vcGVuZXIuc291cmNlID09PSB0aGlzLmNsb3Nlci5zb3VyY2UpO1xuICB9XG5cbiAgd3JhcHBlclBvcyhwb3MsIHRleHQpIHtcbiAgICB2YXIgZW5kLCBzdGFydDtcbiAgICBzdGFydCA9IHRoaXMubWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAsIHBvcy5zdGFydCkpO1xuICAgIGlmICgoc3RhcnQgIT0gbnVsbCkgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgc3RhcnQubmFtZSgpID09PSAnb3BlbmVyJykpIHtcbiAgICAgIGVuZCA9IHRoaXMubWF0Y2hBbnkodGV4dCwgcG9zLmVuZCk7XG4gICAgICBpZiAoKGVuZCAhPSBudWxsKSAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBlbmQubmFtZSgpID09PSAnY2xvc2VyJykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgZW5kLmVuZCgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25uYWxfZW5kKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIHRleHQubGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc1dhcHBlck9mKHBvcywgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZXJQb3MocG9zLCB0ZXh0KSAhPSBudWxsO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUGFpck1hdGNoXG4gIGNvbnN0cnVjdG9yOiAoQHBhaXIsQG1hdGNoLEBvZmZzZXQgPSAwKSAtPlxuICBuYW1lOiAtPlxuICAgIGlmIEBtYXRjaFxuICAgICAgdW5sZXNzIF9uYW1lP1xuICAgICAgICBmb3IgZ3JvdXAsIGkgaW4gQG1hdGNoXG4gICAgICAgICAgaWYgaSA+IDAgYW5kIGdyb3VwP1xuICAgICAgICAgICAgX25hbWUgPSBAcGFpci5tYXRjaEFueVBhcnRLZXlzKClbaS0xXVxuICAgICAgICAgICAgcmV0dXJuIF9uYW1lXG4gICAgICAgIF9uYW1lID0gZmFsc2VcbiAgICAgIHJldHVybiBfbmFtZSB8fCBudWxsXG4gIHN0YXJ0OiAtPlxuICAgIEBtYXRjaC5pbmRleCArIEBvZmZzZXRcbiAgZW5kOiAtPlxuICAgIEBtYXRjaC5pbmRleCArIEBtYXRjaFswXS5sZW5ndGggKyBAb2Zmc2V0XG4gIHZhbGlkOiAtPlxuICAgIHJldHVybiAhQHBhaXIudmFsaWRNYXRjaCB8fCBAcGFpci52YWxpZE1hdGNoKHRoaXMpXG4gIGxlbmd0aDogLT5cbiAgICBAbWF0Y2hbMF0ubGVuZ3RoIiwiZXhwb3J0IHZhciBQYWlyTWF0Y2ggPSBjbGFzcyBQYWlyTWF0Y2gge1xuICBjb25zdHJ1Y3RvcihwYWlyLCBtYXRjaCwgb2Zmc2V0ID0gMCkge1xuICAgIHRoaXMucGFpciA9IHBhaXI7XG4gICAgdGhpcy5tYXRjaCA9IG1hdGNoO1xuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICB9XG5cbiAgbmFtZSgpIHtcbiAgICB2YXIgX25hbWUsIGdyb3VwLCBpLCBqLCBsZW4sIHJlZjtcbiAgICBpZiAodGhpcy5tYXRjaCkge1xuICAgICAgaWYgKHR5cGVvZiBfbmFtZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBfbmFtZSA9PT0gbnVsbCkge1xuICAgICAgICByZWYgPSB0aGlzLm1hdGNoO1xuICAgICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICAgIGdyb3VwID0gcmVmW2ldO1xuICAgICAgICAgIGlmIChpID4gMCAmJiAoZ3JvdXAgIT0gbnVsbCkpIHtcbiAgICAgICAgICAgIF9uYW1lID0gdGhpcy5wYWlyLm1hdGNoQW55UGFydEtleXMoKVtpIC0gMV07XG4gICAgICAgICAgICByZXR1cm4gX25hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9uYW1lID0gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gX25hbWUgfHwgbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMub2Zmc2V0O1xuICB9XG5cbiAgZW5kKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoLmluZGV4ICsgdGhpcy5tYXRjaFswXS5sZW5ndGggKyB0aGlzLm9mZnNldDtcbiAgfVxuXG4gIHZhbGlkKCkge1xuICAgIHJldHVybiAhdGhpcy5wYWlyLnZhbGlkTWF0Y2ggfHwgdGhpcy5wYWlyLnZhbGlkTWF0Y2godGhpcyk7XG4gIH1cblxuICBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hbMF0ubGVuZ3RoO1xuICB9XG5cbn07XG4iLCJleHBvcnQgY2xhc3MgUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LEBlbmQpIC0+XG4gICAgQGVuZCA9IEBzdGFydCB1bmxlc3MgQGVuZD9cbiAgY29udGFpbnNQdDogKHB0KSAtPlxuICAgIHJldHVybiBAc3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBlbmRcbiAgY29udGFpbnNQb3M6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBzdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGVuZFxuICB3cmFwcGVkQnk6IChwcmVmaXgsc3VmZml4KSAtPlxuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyhAc3RhcnQtcHJlZml4Lmxlbmd0aCxAc3RhcnQsQGVuZCxAZW5kK3N1ZmZpeC5sZW5ndGgpXG4gIHdpdGhFZGl0b3I6ICh2YWwpLT5cbiAgICBAX2VkaXRvciA9IHZhbFxuICAgIHJldHVybiB0aGlzXG4gIGVkaXRvcjogLT5cbiAgICB1bmxlc3MgQF9lZGl0b3I/XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVkaXRvciBzZXQnKVxuICAgIHJldHVybiBAX2VkaXRvclxuICBoYXNFZGl0b3I6IC0+XG4gICAgcmV0dXJuIEBfZWRpdG9yP1xuICB0ZXh0OiAtPlxuICAgIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBzdGFydCwgQGVuZClcbiAgYXBwbHlPZmZzZXQ6IChvZmZzZXQpLT5cbiAgICBpZiBvZmZzZXQgIT0gMFxuICAgICAgQHN0YXJ0ICs9IG9mZnNldFxuICAgICAgQGVuZCArPSBvZmZzZXRcbiAgICByZXR1cm4gdGhpc1xuICBwcmV2RU9MOiAtPlxuICAgIHVubGVzcyBAX3ByZXZFT0w/XG4gICAgICBAX3ByZXZFT0wgPSBAZWRpdG9yKCkuZmluZExpbmVTdGFydChAc3RhcnQpXG4gICAgcmV0dXJuIEBfcHJldkVPTFxuICBuZXh0RU9MOiAtPlxuICAgIHVubGVzcyBAX25leHRFT0w/XG4gICAgICBAX25leHRFT0wgPSBAZWRpdG9yKCkuZmluZExpbmVFbmQoQGVuZClcbiAgICByZXR1cm4gQF9uZXh0RU9MXG4gIHRleHRXaXRoRnVsbExpbmVzOiAtPlxuICAgIHVubGVzcyBAX3RleHRXaXRoRnVsbExpbmVzP1xuICAgICAgQF90ZXh0V2l0aEZ1bGxMaW5lcyA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBwcmV2RU9MKCksQG5leHRFT0woKSlcbiAgICByZXR1cm4gQF90ZXh0V2l0aEZ1bGxMaW5lc1xuICBzYW1lTGluZXNQcmVmaXg6IC0+XG4gICAgdW5sZXNzIEBfc2FtZUxpbmVzUHJlZml4P1xuICAgICAgQF9zYW1lTGluZXNQcmVmaXggPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAcHJldkVPTCgpLEBzdGFydClcbiAgICByZXR1cm4gQF9zYW1lTGluZXNQcmVmaXhcbiAgc2FtZUxpbmVzU3VmZml4OiAtPlxuICAgIHVubGVzcyBAX3NhbWVMaW5lc1N1ZmZpeD9cbiAgICAgIEBfc2FtZUxpbmVzU3VmZml4ID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQGVuZCxAbmV4dEVPTCgpKVxuICAgIHJldHVybiBAX3NhbWVMaW5lc1N1ZmZpeFxuICBjb3B5OiAtPlxuICAgIHJlcyA9IG5ldyBQb3MoQHN0YXJ0LEBlbmQpXG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICByZXMud2l0aEVkaXRvcihAZWRpdG9yKCkpXG4gICAgcmV0dXJuIHJlc1xuICByYXc6IC0+XG4gICAgW0BzdGFydCxAZW5kXSIsImV4cG9ydCB2YXIgUG9zID0gY2xhc3MgUG9zIHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGVuZCkge1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICBpZiAodGhpcy5lbmQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5lbmQgPSB0aGlzLnN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIGNvbnRhaW5zUHQocHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmVuZDtcbiAgfVxuXG4gIGNvbnRhaW5zUG9zKHBvcykge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuZW5kO1xuICB9XG5cbiAgd3JhcHBlZEJ5KHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3Mud3JhcENsYXNzKHRoaXMuc3RhcnQgLSBwcmVmaXgubGVuZ3RoLCB0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5lbmQgKyBzdWZmaXgubGVuZ3RoKTtcbiAgfVxuXG4gIHdpdGhFZGl0b3IodmFsKSB7XG4gICAgdGhpcy5fZWRpdG9yID0gdmFsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZWRpdG9yKCkge1xuICAgIGlmICh0aGlzLl9lZGl0b3IgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0Jyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lZGl0b3I7XG4gIH1cblxuICBoYXNFZGl0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvciAhPSBudWxsO1xuICB9XG5cbiAgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgfVxuXG4gIGFwcGx5T2Zmc2V0KG9mZnNldCkge1xuICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHByZXZFT0woKSB7XG4gICAgaWYgKHRoaXMuX3ByZXZFT0wgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcHJldkVPTCA9IHRoaXMuZWRpdG9yKCkuZmluZExpbmVTdGFydCh0aGlzLnN0YXJ0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ByZXZFT0w7XG4gIH1cblxuICBuZXh0RU9MKCkge1xuICAgIGlmICh0aGlzLl9uZXh0RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX25leHRFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lRW5kKHRoaXMuZW5kKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25leHRFT0w7XG4gIH1cblxuICB0ZXh0V2l0aEZ1bGxMaW5lcygpIHtcbiAgICBpZiAodGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RleHRXaXRoRnVsbExpbmVzO1xuICB9XG5cbiAgc2FtZUxpbmVzUHJlZml4KCkge1xuICAgIGlmICh0aGlzLl9zYW1lTGluZXNQcmVmaXggPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2FtZUxpbmVzUHJlZml4ID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMucHJldkVPTCgpLCB0aGlzLnN0YXJ0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NhbWVMaW5lc1ByZWZpeDtcbiAgfVxuXG4gIHNhbWVMaW5lc1N1ZmZpeCgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzU3VmZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLmVuZCwgdGhpcy5uZXh0RU9MKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzU3VmZml4O1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBQb3ModGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICByZXMud2l0aEVkaXRvcih0aGlzLmVkaXRvcigpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHJhdygpIHtcbiAgICByZXR1cm4gW3RoaXMuc3RhcnQsIHRoaXMuZW5kXTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgV3JhcHBpbmcgfSBmcm9tICcuL1dyYXBwaW5nJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBDb21tb25IZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBQb3NDb2xsZWN0aW9uXG4gIGNvbnN0cnVjdG9yOiAoYXJyKSAtPlxuICAgIGlmICFBcnJheS5pc0FycmF5KGFycilcbiAgICAgIGFyciA9IFthcnJdXG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFycixbUG9zQ29sbGVjdGlvbl0pXG4gICAgcmV0dXJuIGFyclxuICAgIFxuICB3cmFwOiAocHJlZml4LHN1ZmZpeCktPlxuICAgICAgcmV0dXJuIEBtYXAoIChwKSAtPiBuZXcgV3JhcHBpbmcocC5zdGFydCwgcC5lbmQsIHByZWZpeCwgc3VmZml4KSlcbiAgcmVwbGFjZTogKHR4dCktPlxuICAgICAgcmV0dXJuIEBtYXAoIChwKSAtPiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dCkpIiwiaW1wb3J0IHtcbiAgV3JhcHBpbmdcbn0gZnJvbSAnLi9XcmFwcGluZyc7XG5cbmltcG9ydCB7XG4gIFJlcGxhY2VtZW50XG59IGZyb20gJy4vUmVwbGFjZW1lbnQnO1xuXG5pbXBvcnQge1xuICBDb21tb25IZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5leHBvcnQgdmFyIFBvc0NvbGxlY3Rpb24gPSBjbGFzcyBQb3NDb2xsZWN0aW9uIHtcbiAgY29uc3RydWN0b3IoYXJyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIGFyciA9IFthcnJdO1xuICAgIH1cbiAgICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoYXJyLCBbUG9zQ29sbGVjdGlvbl0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICB3cmFwKHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBuZXcgV3JhcHBpbmcocC5zdGFydCwgcC5lbmQsIHByZWZpeCwgc3VmZml4KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcGxhY2UodHh0KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dCk7XG4gICAgfSk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcbmltcG9ydCB7IENvbW1vbkhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcbmltcG9ydCB7IE9wdGlvbk9iamVjdCB9IGZyb20gJy4uL09wdGlvbk9iamVjdCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBSZXBsYWNlbWVudCBleHRlbmRzIFBvc1xuICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnModGhpcy5wcm90b3R5cGUsW09wdGlvbk9iamVjdF0pXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LCBAZW5kLCBAdGV4dCwgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBzdXBlcigpXG4gICAgQHNldE9wdHMoQG9wdGlvbnMse1xuICAgICAgcHJlZml4OiAnJ1xuICAgICAgc3VmZml4OiAnJ1xuICAgICAgc2VsZWN0aW9uczogW11cbiAgICB9KVxuICByZXNQb3NCZWZvcmVQcmVmaXg6IC0+XG4gICAgcmV0dXJuIEBzdGFydCtAcHJlZml4Lmxlbmd0aCtAdGV4dC5sZW5ndGhcbiAgcmVzRW5kOiAtPiBcbiAgICByZXR1cm4gQHN0YXJ0K0BmaW5hbFRleHQoKS5sZW5ndGhcbiAgYXBwbHk6IC0+XG4gICAgQGVkaXRvcigpLnNwbGljZVRleHQoQHN0YXJ0LCBAZW5kLCBAZmluYWxUZXh0KCkpXG4gIG5lY2Vzc2FyeTogLT5cbiAgICByZXR1cm4gQGZpbmFsVGV4dCgpICE9IEBvcmlnaW5hbFRleHQoKVxuICBvcmlnaW5hbFRleHQ6IC0+XG4gICAgcmV0dXJuIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBzdGFydCwgQGVuZClcbiAgZmluYWxUZXh0OiAtPlxuICAgIHJldHVybiBAcHJlZml4K0B0ZXh0K0BzdWZmaXhcbiAgb2Zmc2V0QWZ0ZXI6ICgpIC0+IFxuICAgIHJldHVybiBAZmluYWxUZXh0KCkubGVuZ3RoIC0gKEBlbmQgLSBAc3RhcnQpXG4gIGFwcGx5T2Zmc2V0OiAob2Zmc2V0KS0+XG4gICAgaWYgb2Zmc2V0ICE9IDBcbiAgICAgIEBzdGFydCArPSBvZmZzZXRcbiAgICAgIEBlbmQgKz0gb2Zmc2V0XG4gICAgICBmb3Igc2VsIGluIEBzZWxlY3Rpb25zXG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgICByZXR1cm4gdGhpc1xuICBzZWxlY3RDb250ZW50OiAtPiBcbiAgICBAc2VsZWN0aW9ucyA9IFtuZXcgUG9zKEBwcmVmaXgubGVuZ3RoK0BzdGFydCwgQHByZWZpeC5sZW5ndGgrQHN0YXJ0K0B0ZXh0Lmxlbmd0aCldXG4gICAgcmV0dXJuIHRoaXNcbiAgY2FycmV0VG9TZWw6IC0+XG4gICAgQHNlbGVjdGlvbnMgPSBbXVxuICAgIHRleHQgPSBAZmluYWxUZXh0KClcbiAgICBAcHJlZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAcHJlZml4KVxuICAgIEB0ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAdGV4dClcbiAgICBAc3VmZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldChAc3VmZml4KVxuICAgIHN0YXJ0ID0gQHN0YXJ0XG4gICAgXG4gICAgd2hpbGUgKHJlcyA9IFN0cmluZ0hlbHBlci5nZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0ZXh0KSk/XG4gICAgICBbcG9zLHRleHRdID0gcmVzXG4gICAgICBAc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3Moc3RhcnQrcG9zLCBzdGFydCtwb3MpKVxuICAgICAgXG4gICAgcmV0dXJuIHRoaXNcbiAgY29weTogLT4gXG4gICAgcmVzID0gbmV3IFJlcGxhY2VtZW50KEBzdGFydCwgQGVuZCwgQHRleHQsIEBnZXRPcHRzKCkpXG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICByZXMud2l0aEVkaXRvcihAZWRpdG9yKCkpXG4gICAgcmVzLnNlbGVjdGlvbnMgPSBAc2VsZWN0aW9ucy5tYXAoIChzKS0+cy5jb3B5KCkgKVxuICAgIHJldHVybiByZXMiLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5pbXBvcnQge1xuICBDb21tb25IZWxwZXJcbn0gZnJvbSAnLi4vaGVscGVycy9Db21tb25IZWxwZXInO1xuXG5pbXBvcnQge1xuICBPcHRpb25PYmplY3Rcbn0gZnJvbSAnLi4vT3B0aW9uT2JqZWN0JztcblxuaW1wb3J0IHtcbiAgU3RyaW5nSGVscGVyXG59IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuZXhwb3J0IHZhciBSZXBsYWNlbWVudCA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgUmVwbGFjZW1lbnQgZXh0ZW5kcyBQb3Mge1xuICAgIGNvbnN0cnVjdG9yKHN0YXJ0MSwgZW5kLCB0ZXh0MSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0MTtcbiAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgICAgdGhpcy50ZXh0ID0gdGV4dDE7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucywge1xuICAgICAgICBwcmVmaXg6ICcnLFxuICAgICAgICBzdWZmaXg6ICcnLFxuICAgICAgICBzZWxlY3Rpb25zOiBbXVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVzUG9zQmVmb3JlUHJlZml4KCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnRleHQubGVuZ3RoO1xuICAgIH1cblxuICAgIHJlc0VuZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5maW5hbFRleHQoKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgYXBwbHkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS5zcGxpY2VUZXh0KHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLmZpbmFsVGV4dCgpKTtcbiAgICB9XG5cbiAgICBuZWNlc3NhcnkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKSAhPT0gdGhpcy5vcmlnaW5hbFRleHQoKTtcbiAgICB9XG5cbiAgICBvcmlnaW5hbFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgICB9XG5cbiAgICBmaW5hbFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLnRleHQgKyB0aGlzLnN1ZmZpeDtcbiAgICB9XG5cbiAgICBvZmZzZXRBZnRlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmFsVGV4dCgpLmxlbmd0aCAtICh0aGlzLmVuZCAtIHRoaXMuc3RhcnQpO1xuICAgIH1cblxuICAgIGFwcGx5T2Zmc2V0KG9mZnNldCkge1xuICAgICAgdmFyIGksIGxlbiwgcmVmLCBzZWw7XG4gICAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgICB0aGlzLmVuZCArPSBvZmZzZXQ7XG4gICAgICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9ucztcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgc2VsID0gcmVmW2ldO1xuICAgICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXQ7XG4gICAgICAgICAgc2VsLmVuZCArPSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNlbGVjdENvbnRlbnQoKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyh0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0LCB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0ICsgdGhpcy50ZXh0Lmxlbmd0aCldO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2FycmV0VG9TZWwoKSB7XG4gICAgICB2YXIgcG9zLCByZXMsIHN0YXJ0LCB0ZXh0O1xuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW107XG4gICAgICB0ZXh0ID0gdGhpcy5maW5hbFRleHQoKTtcbiAgICAgIHRoaXMucHJlZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnByZWZpeCk7XG4gICAgICB0aGlzLnRleHQgPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMudGV4dCk7XG4gICAgICB0aGlzLnN1ZmZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5zdWZmaXgpO1xuICAgICAgc3RhcnQgPSB0aGlzLnN0YXJ0O1xuICAgICAgd2hpbGUgKChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgW3BvcywgdGV4dF0gPSByZXM7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3Moc3RhcnQgKyBwb3MsIHN0YXJ0ICsgcG9zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgdmFyIHJlcztcbiAgICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy50ZXh0LCB0aGlzLmdldE9wdHMoKSk7XG4gICAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgICByZXMud2l0aEVkaXRvcih0aGlzLmVkaXRvcigpKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZWxlY3Rpb25zID0gdGhpcy5zZWxlY3Rpb25zLm1hcChmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiBzLmNvcHkoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgfTtcblxuICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoUmVwbGFjZW1lbnQucHJvdG90eXBlLCBbT3B0aW9uT2JqZWN0XSk7XG5cbiAgcmV0dXJuIFJlcGxhY2VtZW50O1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiZXhwb3J0IGNsYXNzIFNpemVcbiAgY29uc3RydWN0b3I6IChAd2lkdGgsQGhlaWdodCkgLT4iLCJleHBvcnQgY2xhc3MgU3RyUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHBvcyxAc3RyKSAtPlxuICBlbmQ6IC0+XG4gICAgQHBvcyArIEBzdHIubGVuZ3RoIiwiZXhwb3J0IHZhciBTdHJQb3MgPSBjbGFzcyBTdHJQb3Mge1xuICBjb25zdHJ1Y3Rvcihwb3MsIHN0cikge1xuICAgIHRoaXMucG9zID0gcG9zO1xuICAgIHRoaXMuc3RyID0gc3RyO1xuICB9XG5cbiAgZW5kKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aDtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHsgUG9zIH0gZnJvbSAnLi9Qb3MnO1xuXG5leHBvcnQgY2xhc3MgV3JhcHBlZFBvcyBleHRlbmRzIFBvc1xuICBjb25zdHJ1Y3RvcjogKEBzdGFydCxAaW5uZXJTdGFydCxAaW5uZXJFbmQsQGVuZCkgLT5cbiAgICBzdXBlcigpXG4gIGlubmVyQ29udGFpbnNQdDogKHB0KSAtPlxuICAgIHJldHVybiBAaW5uZXJTdGFydCA8PSBwdCBhbmQgcHQgPD0gQGlubmVyRW5kXG4gIGlubmVyQ29udGFpbnNQb3M6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBpbm5lclN0YXJ0IDw9IHBvcy5zdGFydCBhbmQgcG9zLmVuZCA8PSBAaW5uZXJFbmRcbiAgaW5uZXJUZXh0OiAtPlxuICAgIEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBpbm5lclN0YXJ0LCBAaW5uZXJFbmQpXG4gIHNldElubmVyTGVuOiAobGVuKSAtPlxuICAgIEBtb3ZlU3VmaXgoQGlubmVyU3RhcnQgKyBsZW4pXG4gIG1vdmVTdWZmaXg6IChwdCkgLT5cbiAgICBzdWZmaXhMZW4gPSBAZW5kIC0gQGlubmVyRW5kXG4gICAgQGlubmVyRW5kID0gcHRcbiAgICBAZW5kID0gQGlubmVyRW5kICsgc3VmZml4TGVuXG4gIGNvcHk6IC0+XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKEBzdGFydCxAaW5uZXJTdGFydCxAaW5uZXJFbmQsQGVuZCkiLCJpbXBvcnQge1xuICBQb3Ncbn0gZnJvbSAnLi9Qb3MnO1xuXG5leHBvcnQgdmFyIFdyYXBwZWRQb3MgPSBjbGFzcyBXcmFwcGVkUG9zIGV4dGVuZHMgUG9zIHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGlubmVyU3RhcnQsIGlubmVyRW5kLCBlbmQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmlubmVyU3RhcnQgPSBpbm5lclN0YXJ0O1xuICAgIHRoaXMuaW5uZXJFbmQgPSBpbm5lckVuZDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQdChwdCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5pbm5lckVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQb3MocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmlubmVyRW5kO1xuICB9XG5cbiAgaW5uZXJUZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kKTtcbiAgfVxuXG4gIHNldElubmVyTGVuKGxlbikge1xuICAgIHJldHVybiB0aGlzLm1vdmVTdWZpeCh0aGlzLmlubmVyU3RhcnQgKyBsZW4pO1xuICB9XG5cbiAgbW92ZVN1ZmZpeChwdCkge1xuICAgIHZhciBzdWZmaXhMZW47XG4gICAgc3VmZml4TGVuID0gdGhpcy5lbmQgLSB0aGlzLmlubmVyRW5kO1xuICAgIHRoaXMuaW5uZXJFbmQgPSBwdDtcbiAgICByZXR1cm4gdGhpcy5lbmQgPSB0aGlzLmlubmVyRW5kICsgc3VmZml4TGVuO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICByZXR1cm4gbmV3IFdyYXBwZWRQb3ModGhpcy5zdGFydCwgdGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kLCB0aGlzLmVuZCk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9SZXBsYWNlbWVudCc7XG5cbmV4cG9ydCBjbGFzcyBXcmFwcGluZyBleHRlbmRzIFJlcGxhY2VtZW50XG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LCBAZW5kLCBwcmVmaXggPScnLCBzdWZmaXggPSAnJywgQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBzdXBlcigpXG4gICAgQHNldE9wdHMoQG9wdGlvbnMpXG4gICAgQHRleHQgPSAnJ1xuICAgIEBwcmVmaXggPSBwcmVmaXhcbiAgICBAc3VmZml4ID0gc3VmZml4XG4gIGFwcGx5OiAtPlxuICAgIEBhZGp1c3RTZWwoKVxuICAgIHN1cGVyKClcbiAgYWRqdXN0U2VsOiAtPlxuICAgIG9mZnNldCA9IEBvcmlnaW5hbFRleHQoKS5sZW5ndGhcbiAgICBmb3Igc2VsIGluIEBzZWxlY3Rpb25zXG4gICAgICBpZiBzZWwuc3RhcnQgPiBAc3RhcnQrQHByZWZpeC5sZW5ndGhcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgaWYgc2VsLmVuZCA+PSBAc3RhcnQrQHByZWZpeC5sZW5ndGhcbiAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgZmluYWxUZXh0OiAtPlxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgdGV4dCA9IEBvcmlnaW5hbFRleHQoKVxuICAgIGVsc2VcbiAgICAgIHRleHQgPSAnJ1xuICAgIHJldHVybiBAcHJlZml4K3RleHQrQHN1ZmZpeFxuICBvZmZzZXRBZnRlcjogKCkgLT4gXG4gICAgcmV0dXJuIEBwcmVmaXgubGVuZ3RoK0BzdWZmaXgubGVuZ3RoXG4gICAgICAgICAgXG4gIGNvcHk6IC0+IFxuICAgIHJlcyA9IG5ldyBXcmFwcGluZyhAc3RhcnQsIEBlbmQsIEBwcmVmaXgsIEBzdWZmaXgpXG4gICAgcmVzLnNlbGVjdGlvbnMgPSBAc2VsZWN0aW9ucy5tYXAoIChzKS0+cy5jb3B5KCkgKVxuICAgIHJldHVybiByZXMiLCJpbXBvcnQge1xuICBSZXBsYWNlbWVudFxufSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IHZhciBXcmFwcGluZyA9IGNsYXNzIFdyYXBwaW5nIGV4dGVuZHMgUmVwbGFjZW1lbnQge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgZW5kLCBwcmVmaXggPSAnJywgc3VmZml4ID0gJycsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy50ZXh0ID0gJyc7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXg7XG4gICAgdGhpcy5zdWZmaXggPSBzdWZmaXg7XG4gIH1cblxuICBhcHBseSgpIHtcbiAgICB0aGlzLmFkanVzdFNlbCgpO1xuICAgIHJldHVybiBzdXBlci5hcHBseSgpO1xuICB9XG5cbiAgYWRqdXN0U2VsKCkge1xuICAgIHZhciBpLCBsZW4sIG9mZnNldCwgcmVmLCByZXN1bHRzLCBzZWw7XG4gICAgb2Zmc2V0ID0gdGhpcy5vcmlnaW5hbFRleHQoKS5sZW5ndGg7XG4gICAgcmVmID0gdGhpcy5zZWxlY3Rpb25zO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNlbCA9IHJlZltpXTtcbiAgICAgIGlmIChzZWwuc3RhcnQgPiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXQ7XG4gICAgICB9XG4gICAgICBpZiAoc2VsLmVuZCA+PSB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChzZWwuZW5kICs9IG9mZnNldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBmaW5hbFRleHQoKSB7XG4gICAgdmFyIHRleHQ7XG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHRleHQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gJyc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRleHQgKyB0aGlzLnN1ZmZpeDtcbiAgfVxuXG4gIG9mZnNldEFmdGVyKCkge1xuICAgIHJldHVybiB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN1ZmZpeC5sZW5ndGg7XG4gIH1cblxuICBjb3B5KCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gbmV3IFdyYXBwaW5nKHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnByZWZpeCwgdGhpcy5zdWZmaXgpO1xuICAgIHJlcy5zZWxlY3Rpb25zID0gdGhpcy5zZWxlY3Rpb25zLm1hcChmdW5jdGlvbihzKSB7XG4gICAgICByZXR1cm4gcy5jb3B5KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG59O1xuIiwiXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlRW5naW5lXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBpZiBsb2NhbFN0b3JhZ2U/XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShAZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKVxuICBsb2FkOiAoa2V5KSAtPlxuICAgIGlmIGxvY2FsU3RvcmFnZT9cbiAgICAgIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oQGZ1bGxLZXkoa2V5KSkpXG4gIGZ1bGxLZXk6IChrZXkpIC0+XG4gICAgJ0NvZGVXYXZlXycra2V5IiwiZXhwb3J0IHZhciBMb2NhbFN0b3JhZ2VFbmdpbmUgPSBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmUge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgc2F2ZShrZXksIHZhbCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKTtcbiAgICB9XG4gIH1cblxuICBsb2FkKGtleSkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5mdWxsS2V5KGtleSkpKTtcbiAgICB9XG4gIH1cblxuICBmdWxsS2V5KGtleSkge1xuICAgIHJldHVybiAnQ29kZVdhdmVfJyArIGtleTtcbiAgfVxuXG59O1xuIl19
