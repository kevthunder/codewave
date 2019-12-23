(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringHelper = require("./helpers/StringHelper");

var ArrayHelper = require("./helpers/ArrayHelper");

var Pair = require("./positioning/Pair");

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
      return StringHelper.StringHelper.repeatToLength(this.deco, len);
    }
  }, {
    key: "padding",
    value: function padding() {
      return StringHelper.StringHelper.repeatToLength(" ", this.pad);
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
      return StringHelper.StringHelper.repeatToLength(" ", this.indent) + this.wrapComment(this.deco + this.padding() + text + StringHelper.StringHelper.repeatToLength(" ", this.width - this.removeIgnoredContent(text).length) + this.padding() + this.deco);
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
      return StringHelper.StringHelper.getTxtSize(this.removeIgnoredContent(text));
    }
  }, {
    key: "getBoxForPos",
    value: function getBoxForPos(pos) {
      var _this = this;

      var clone, curLeft, depth, endFind, left, pair, placeholder, res, startFind;
      depth = this.getNestedLvl(pos.start);

      if (depth > 0) {
        left = this.left();
        curLeft = StringHelper.StringHelper.repeat(left, depth - 1);
        clone = this.clone();
        placeholder = "###PlaceHolder###";
        clone.width = placeholder.length;
        clone.openText = clone.closeText = this.deco + this.deco + placeholder + this.deco + this.deco;
        startFind = RegExp(StringHelper.StringHelper.escapeRegExp(curLeft + clone.startSep()).replace(placeholder, '.*'));
        endFind = RegExp(StringHelper.StringHelper.escapeRegExp(curLeft + clone.endSep()).replace(placeholder, '.*'));
        pair = new Pair.Pair(startFind, endFind, {
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
      rStart = new RegExp("(\\s*)(" + StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentLeft(this.deco)) + ")(\\s*)");
      rEnd = new RegExp("(\\s*)(" + StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentRight(this.deco)) + ")(\n|$)");
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
        ecl = StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentLeft());
        ecr = StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentRight());
        ed = StringHelper.StringHelper.escapeRegExp(this.deco);
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

},{"./helpers/ArrayHelper":29,"./helpers/StringHelper":34,"./positioning/Pair":35}],2:[function(require,module,exports){
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

var PosCollection = require("./positioning/PosCollection");

var Replacement = require("./positioning/Replacement");

var Pos = require("./positioning/Pos");

var OptionalPromise = require("./helpers/OptionalPromise");

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
    this.selections = new PosCollection.PosCollection(selections);
  }

  _createClass(ClosingPromp, [{
    key: "begin",
    value: function begin() {
      var _this = this;

      this.started = true;
      return (0, OptionalPromise.optionalPromise)(this.addCarrets()).then(function () {
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
          repl = new Replacement.Replacement(end.innerStart, end.innerEnd, res);
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
          replacements.push(new Replacement.Replacement(start.start, end.end, this.codewave.editor.textSubstr(start.end + 1, end.start - 1)).selectContent());
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
      return new Pos.Pos(this.replacements[index].selections[0].start + this.typed().length * (index * 2), this.replacements[index].selections[0].end + this.typed().length * (index * 2 + 1)).wrappedBy(this.codewave.brakets, this.codewave.brakets);
    }
  }, {
    key: "endPosAt",
    value: function endPosAt(index) {
      return new Pos.Pos(this.replacements[index].selections[1].start + this.typed().length * (index * 2 + 1), this.replacements[index].selections[1].end + this.typed().length * (index * 2 + 2)).wrappedBy(this.codewave.brakets + this.codewave.closeChar, this.codewave.brakets);
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
          repl = new Replacement.Replacement(curClose.start, curClose.end, targetText);

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

},{"./helpers/OptionalPromise":32,"./positioning/Pos":37,"./positioning/PosCollection":38,"./positioning/Replacement":39}],3:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Context = require("./Context");

var NamespaceHelper = require("./helpers/NamespaceHelper");

var Command = require("./Command");

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
      root: Command.Command.cmds,
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
      this.context = new Context.Context(this.codewave);
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

        var _NamespaceHelper$Name = NamespaceHelper.NamespaceHelper.splitFirst(name);

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

      var _NamespaceHelper$Name3 = NamespaceHelper.NamespaceHelper.splitFirst(namespace, true);

      var _NamespaceHelper$Name4 = _slicedToArray(_NamespaceHelper$Name3, 2);

      space = _NamespaceHelper$Name4[0];
      rest = _NamespaceHelper$Name4[1];
      return this.names.map(function (name) {
        var cur_rest, cur_space;

        var _NamespaceHelper$Name5 = NamespaceHelper.NamespaceHelper.splitFirst(name);

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
        posibilities = [this.root].concat(new CmdFinder(this.context.getNameSpaces(), {
          parent: this,
          mustExecute: false,
          useFallbacks: false
        }).findPosibilities());
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

        var _NamespaceHelper$Name7 = NamespaceHelper.NamespaceHelper.splitFirst(nspc, true);

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

},{"./Command":6,"./Context":7,"./helpers/NamespaceHelper":31}],4:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Context = require("./Context");

var Codewave = require("./Codewave");

var TextParser = require("./TextParser");

var StringHelper = require("./helpers/StringHelper");

var OptionalPromise = require("./helpers/OptionalPromise");

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
        this.context = new Context.Context();
      }

      return this.context || new Context.Context();
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
        return (0, OptionalPromise.optionalPromise)(this.rawResult()).then(function (res) {
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
      parser = new Codewave.Codewave(new TextParser.TextParser(txt), {
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
      return StringHelper.StringHelper.indentNotFirst(text, this.getIndent(), " ");
    }
  }]);

  return CmdInstance;
}();

exports.CmdInstance = CmdInstance;

},{"./Codewave":5,"./Context":7,"./TextParser":16,"./helpers/OptionalPromise":32,"./helpers/StringHelper":34}],5:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Process = require("./Process");

var Context = require("./Context");

var PositionedCmdInstance = require("./PositionedCmdInstance");

var TextParser = require("./TextParser");

var Command = require("./Command");

var Logger = require("./Logger");

var PosCollection = require("./positioning/PosCollection");

var StringHelper = require("./helpers/StringHelper");

var ClosingPromp = require("./ClosingPromp");

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

      this.context = new Context.Context(this);

      if (this.inInstance != null) {
        this.context.parent = this.inInstance.context;
      }

      this.logger = new Logger.Logger();
    }

    _createClass(Codewave, [{
      key: "onActivationKey",
      value: function onActivationKey() {
        var _this = this;

        this.process = new Process.Process();
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

        return new PositionedCmdInstance.PositionedCmdInstance(this, prev, this.editor.textSubstr(prev, next + this.brakets.length));
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
              return new PositionedCmdInstance.PositionedCmdInstance(this, beginning, this.editor.textSubstr(beginning, f.pos + this.brakets.length));
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
        pos = new PosCollection.PosCollection(pos);
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

        return this.closingPromp = ClosingPromp.ClosingPromp.newFor(this, selections).begin();
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
            parser = new Codewave(new TextParser.TextParser(cmd.content), {
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
        return StringHelper.StringHelper.removeCarret(txt, this.carretChar);
      }
    }, {
      key: "getCarretPos",
      value: function getCarretPos(txt) {
        return StringHelper.StringHelper.getCarretPos(txt, this.carretChar);
      }
    }, {
      key: "regMarker",
      value: function regMarker() {
        var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "g";
        return new RegExp(StringHelper.StringHelper.escapeRegExp(this.marker), flags);
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
          Command.Command.initCmds();
          return Command.Command.loadCmds();
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

},{"./ClosingPromp":2,"./Command":6,"./Context":7,"./Logger":10,"./PositionedCmdInstance":12,"./Process":13,"./TextParser":16,"./helpers/StringHelper":34,"./positioning/PosCollection":38}],6:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Context = require("./Context");

var Storage = require("./Storage");

var NamespaceHelper = require("./helpers/NamespaceHelper");

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
          context = new Context.Context();
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
          context = new Context.Context();
          return this._aliasedFromFinder(context.getFinder(this.aliasOf));
        }
      }
    }, {
      key: "getAliasedOrThis",
      value: function getAliasedOrThis() {
        return this.getAliased() || this;
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

        var _NamespaceHelper$Name = NamespaceHelper.NamespaceHelper.splitFirst(fullname);

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

        var _NamespaceHelper$Name3 = NamespaceHelper.NamespaceHelper.splitFirst(fullname);

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
  Command.storage = new Storage.Storage();
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

},{"./Context":7,"./Storage":14,"./helpers/NamespaceHelper":31}],7:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CmdFinder = require("./CmdFinder");

var CmdInstance = require("./CmdInstance");

var ArrayHelper = require("./helpers/ArrayHelper");

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
        npcs = this.nameSpaces;

        if (this.parent != null) {
          npcs = npcs.concat(this.parent.getNameSpaces());
        }

        this._namespaces = ArrayHelper.ArrayHelper.unique(npcs);
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
      return new CmdFinder.CmdFinder(cmdName, Object.assign({
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
      return new CmdInstance.CmdInstance(cmd, this);
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

},{"./CmdFinder":3,"./CmdInstance":4,"./helpers/ArrayHelper":29}],8:[function(require,module,exports){
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

var Command = require("./Command");

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
      return cmds[this.name] = Command.Command.makeVarCmd(this.name);
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
      return cmds[this.name] = Command.Command.makeVarCmd(this.name, {
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
      return cmds[this.name] = Command.Command.makeBoolVarCmd(this.name);
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
      return cmds[this.name] = Command.Command.makeBoolVarCmd(this.name);
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

},{"./Command":6}],9:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Pos = require("./positioning/Pos");

var StrPos = require("./positioning/StrPos");

var OptionalPromise = require("./helpers/OptionalPromise");

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
      return new Pos.Pos(this.findLineStart(pos), this.findLineEnd(pos));
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
        return new StrPos.StrPos(direction > 0 ? bestPos + start : bestPos, bestStr);
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
          return (0, OptionalPromise.optionalPromise)(repl.apply()).then(function () {
            return {
              selections: opt.selections.concat(repl.selections),
              offset: opt.offset + repl.offsetAfter(_this)
            };
          });
        });
      }, (0, OptionalPromise.optionalPromise)({
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

},{"./helpers/OptionalPromise":32,"./positioning/Pos":37,"./positioning/StrPos":41}],10:[function(require,module,exports){
"use strict";

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

},{}],11:[function(require,module,exports){
"use strict";

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

},{}],12:[function(require,module,exports){
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

var CmdInstance = require("./CmdInstance");

var BoxHelper = require("./BoxHelper");

var ParamParser = require("./stringParsers/ParamParser");

var Pos = require("./positioning/Pos");

var StrPos = require("./positioning/StrPos");

var Replacement = require("./positioning/Replacement");

var StringHelper = require("./helpers/StringHelper");

var NamespaceHelper = require("./helpers/NamespaceHelper");

var Command = require("./Command");

var OptionalPromise = require("./helpers/OptionalPromise");

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
        this.closingPos = new StrPos.StrPos(this.pos, this.str);
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
      parser = new ParamParser.ParamParser(params, {
        allowedNamed: this.getOption('allowedNamed'),
        vars: this.codewave.vars
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
        this.content = StringHelper.StringHelper.trimEmptyLine(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos));
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
        ecl = StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentLeft());
        ecr = StringHelper.StringHelper.escapeRegExp(this.context.wrapCommentRight());
        ed = StringHelper.StringHelper.escapeRegExp(this.codewave.deco);
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
          this.cmd = Command.Command.cmds.getCmd('core:no_execute');
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

      var _NamespaceHelper$Name = NamespaceHelper.NamespaceHelper.split(this.cmdName);

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
          return (0, OptionalPromise.optionalPromise)(this.result()).then(function (res) {
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
      return new Pos.Pos(this.pos, this.pos + this.str.length).withEditor(this.codewave.editor);
    }
  }, {
    key: "getOpeningPos",
    value: function getOpeningPos() {
      return new Pos.Pos(this.pos, this.pos + this.opening.length).withEditor(this.codewave.editor);
    }
  }, {
    key: "getIndent",
    value: function getIndent() {
      var helper;

      if (this.indentLen == null) {
        if (this.inBox != null) {
          helper = new BoxHelper.BoxHelper(this.context);
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
      helper = new BoxHelper.BoxHelper(this.context);
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
      return this.applyReplacement(new Replacement.Replacement(this.pos, this.getEndPos(), text));
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
      repl.selections = [new Pos.Pos(cursorPos, cursorPos)];
      replacements = this.checkMulti(repl);
      this.replaceStart = repl.start;
      this.replaceEnd = repl.resEnd();
      return this.codewave.editor.applyReplacements(replacements);
    }
  }]);

  return PositionedCmdInstance;
}(CmdInstance.CmdInstance);

exports.PositionedCmdInstance = PositionedCmdInstance;

},{"./BoxHelper":1,"./CmdInstance":4,"./Command":6,"./helpers/NamespaceHelper":31,"./helpers/OptionalPromise":32,"./helpers/StringHelper":34,"./positioning/Pos":37,"./positioning/Replacement":39,"./positioning/StrPos":41,"./stringParsers/ParamParser":49}],13:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Process = function Process() {
  _classCallCheck(this, Process);
};

exports.Process = Process;

},{}],14:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Logger = require("./Logger");

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
        this.logger = this.logger || new Logger.Logger();
        this.logger.log('No storage engine available');
        return false;
      }
    }
  }]);

  return Storage;
}();

exports.Storage = Storage;

},{"./Logger":10}],15:[function(require,module,exports){
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

var TextParser = require("./TextParser");

var Pos = require("./positioning/Pos");

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
            return new Pos.Pos(this.obj.selectionStart, this.obj.selectionEnd);
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
            pos = new Pos.Pos(0, len);

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
          this.tmpCursorPos = new Pos.Pos(start, end);
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
  }(TextParser.TextParser);

  ;
  TextAreaEditor.prototype.startListening = DomKeyListener.prototype.startListening;
  return TextAreaEditor;
}.call(void 0);

exports.TextAreaEditor = TextAreaEditor;

},{"./TextParser":16,"./positioning/Pos":37}],16:[function(require,module,exports){
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

var Editor = require("./Editor");

var Pos = require("./positioning/Pos");

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

      return this.target = new Pos.Pos(start, end);
    }
  }]);

  return TextParser;
}(Editor.Editor);

exports.TextParser = TextParser;

},{"./Editor":9,"./positioning/Pos":37}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Codewave", {
  enumerable: true,
  get: function get() {
    return Codewave.Codewave;
  }
});

var Codewave = require("./Codewave");

var Command = require("./Command");

var CoreCommandProvider = require("./cmds/CoreCommandProvider");

var JsCommandProvider = require("./cmds/JsCommandProvider");

var PhpCommandProvider = require("./cmds/PhpCommandProvider");

var HtmlCommandProvider = require("./cmds/HtmlCommandProvider");

var FileCommandProvider = require("./cmds/FileCommandProvider");

var StringCommandProvider = require("./cmds/StringCommandProvider");

var Pos = require("./positioning/Pos");

var WrappedPos = require("./positioning/WrappedPos");

var LocalStorageEngine = require("./storageEngines/LocalStorageEngine");

Pos.Pos.wrapClass = WrappedPos.WrappedPos;
Codewave.Codewave.instances = [];
Command.Command.providers = [new CoreCommandProvider.CoreCommandProvider(), new JsCommandProvider.JsCommandProvider(), new PhpCommandProvider.PhpCommandProvider(), new HtmlCommandProvider.HtmlCommandProvider(), new FileCommandProvider.FileCommandProvider(), new StringCommandProvider.StringCommandProvider()];

if (typeof localStorage !== "undefined" && localStorage !== null) {
  Command.Command.storage = new LocalStorageEngine.LocalStorageEngine();
}

},{"./Codewave":5,"./Command":6,"./cmds/CoreCommandProvider":18,"./cmds/FileCommandProvider":19,"./cmds/HtmlCommandProvider":20,"./cmds/JsCommandProvider":21,"./cmds/PhpCommandProvider":22,"./cmds/StringCommandProvider":23,"./positioning/Pos":37,"./positioning/WrappedPos":42,"./storageEngines/LocalStorageEngine":44}],18:[function(require,module,exports){
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

var Command = require("../Command");

var LangDetector = require("../detectors/LangDetector");

var AlwaysEnabled = require("../detectors/AlwaysEnabled");

var BoxHelper = require("../BoxHelper");

var EditCmdProp = require("../EditCmdProp");

var StringHelper = require("../helpers/StringHelper");

var PathHelper = require("../helpers/PathHelper");

var Replacement = require("../positioning/Replacement");

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
      core = cmds.addCmd(new Command.Command('core'));
      cmds.addDetector(new AlwaysEnabled.AlwaysEnabled('core'));
      core.addDetector(new LangDetector.LangDetector());
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
              'aliasOf': 'core:help:subjects'
            },
            'get_started': {
              'replaceBox': true,
              'result': "~~box~~\nThe classic Hello World.\n~~!hello|~~\n\n~~help:editing:intro~~\n~~quote_carret~~\n\nFor more information on creating your own commands, see:\n~~!help:editing~~\n\nCodewave comes with many pre-existing commands. Here is an example\nof JavaScript abbreviations\n~~!js:f~~\n~~!js:if~~\n  ~~!js:log~~\"~~!hello~~\"~~!/js:log~~\n~~!/js:if~~\n~~!/js:f~~\n\nCodeWave comes with the excellent Emmet ( http://emmet.io/ ) to \nprovide event more abbreviations. Emmet abbreviations will be \nused automatically if you are in a HTML or CSS file.\n~~!ul>li~~ (if you are in a html doccument)\n~~!emmet ul>li~~\n~~!emmet m2 css~~\n\nCommands are stored in namespaces. The same command can have \ndifferent results depending on the namespace.\n~~!js:each~~\n~~!php:outer:each~~\n~~!php:inner:each~~\n\nSome of the namespaces are active depending on the context. The\nfollowing commands are the same and will display the currently\nactive namespace. The first command command works because the \ncore namespace is active.\n~~!namespace~~\n~~!core:namespace~~\n\nYou can make a namespace active with the following command.\n~~!namespace php~~\n\nCheck the namespaces again\n~~!namespace~~\n\nIn addition to detecting the document type, Codewave can detect the\ncontext from the surrounding text. In a PHP file, it means Codewave \nwill add the PHP tags when you need them.\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
            },
            'demo': {
              'aliasOf': 'core:help:get_started'
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
              'aliasOf': 'core:help:editing'
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
  reg = new RegExp("^(" + StringHelper.StringHelper.escapeRegExp(instance.codewave.brakets) + ')' + StringHelper.StringHelper.escapeRegExp(instance.codewave.noExecuteChar));
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
    storage = Command.Command.storage;
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
        Command.Command.cmds.setCmdData(newName, cmdData);
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
        storage = Command.Command.storage;
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

      Command.Command.saveCmd(alias, {
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
    cmd = nspc === "_root" ? Command.Command.cmds : context.getCmd(nspc, {
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
  res = PathHelper.PathHelper.getPath(instance.codewave.vars, name);

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
  PathHelper.PathHelper.setPath(instance.codewave.vars, name, val);
  return '';
};

storeJsonCommand = function storeJsonCommand(instance) {
  var name, p, val;
  name = instance.getParam([0, 'name']);
  val = (p = instance.getParam([1, 'json'])) != null ? p : instance.content ? instance.content : void 0;
  PathHelper.PathHelper.setPath(instance.codewave.vars, name, JSON.parse(val));
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
      this.helper = new BoxHelper.BoxHelper(this.instance.context);
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
}(Command.BaseCommand);

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
      return this.helper = new BoxHelper.BoxHelper(this.instance.context);
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

        return this.instance.applyReplacement(new Replacement.Replacement(box.start, box.end, ''));
      } else {
        return this.instance.replaceWith('');
      }
    }
  }]);

  return CloseCmd;
}(Command.BaseCommand);

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

      Command.Command.saveCmd(this.cmdName, data);
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
}(Command.BaseCommand);

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

EditCmd.props = [new EditCmdProp.EditCmdProp.revBool('no_carret', {
  opt: 'checkCarret'
}), new EditCmdProp.EditCmdProp.revBool('no_parse', {
  opt: 'parse'
}), new EditCmdProp.EditCmdProp.bool('prevent_parse_all', {
  opt: 'preventParseAll'
}), new EditCmdProp.EditCmdProp.bool('replace_box', {
  opt: 'replaceBox'
}), new EditCmdProp.EditCmdProp.string('name_to_param', {
  opt: 'nameToParam'
}), new EditCmdProp.EditCmdProp.string('alias_of', {
  "var": 'aliasOf',
  carret: true
}), new EditCmdProp.EditCmdProp.source('help', {
  funct: 'help',
  showEmpty: true
}), new EditCmdProp.EditCmdProp.source('source', {
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
}(Command.BaseCommand);

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
      data = this.name ? PathHelper.PathHelper.getPath(this.instance.codewave.vars, this.name) : this.instance.codewave.vars;

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
}(Command.BaseCommand);

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
}(Command.BaseCommand);

},{"../BoxHelper":1,"../Command":6,"../EditCmdProp":8,"../detectors/AlwaysEnabled":24,"../detectors/LangDetector":26,"../helpers/PathHelper":33,"../helpers/StringHelper":34,"../positioning/Replacement":39,"emmet":"emmet"}],19:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Command = require("../Command");

var BoxHelper = require("../BoxHelper");

var EditCmdProp = require("../EditCmdProp");

var StringHelper = require("../helpers/StringHelper");

var PathHelper = require("../helpers/PathHelper");

var Replacement = require("../positioning/Replacement");

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
      core = cmds.addCmd(new Command.Command('file'));
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

},{"../BoxHelper":1,"../Command":6,"../EditCmdProp":8,"../helpers/PathHelper":33,"../helpers/StringHelper":34,"../positioning/Replacement":39}],20:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Command = require("../Command");

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
      html = cmds.addCmd(new Command.Command('html'));
      html.addCmds({
        'fallback': {
          'aliasOf': 'core:emmet',
          'defaults': {
            'lang': 'html'
          },
          'nameToParam': 'abbr'
        }
      });
      css = cmds.addCmd(new Command.Command('css'));
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

var Command = require("../Command");

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
      js = cmds.addCmd(new Command.Command('js'));
      cmds.addCmd(new Command.Command('javascript', {
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

var StringHelper = require("../helpers/StringHelper");

var Command = require("../Command");

var PairDetector = require("../detectors/PairDetector");

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
      php = cmds.addCmd(new Command.Command('php'));
      php.addDetector(new PairDetector.PairDetector({
        result: 'php:inner',
        opener: '<?php',
        closer: '?>',
        optionnal_end: true,
        'else': 'php:outer'
      }));
      phpOuter = php.addCmd(new Command.Command('outer'));
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
      phpInner = php.addCmd(new Command.Command('inner'));
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
    return '<?php\n' + StringHelper.StringHelper.indent(result) + '\n?>';
  }
}; // closePhpForContent = (instance) ->
//   instance.content = ' ?>'+(instance.content || '')+'<?php '

},{"../Command":6,"../detectors/PairDetector":27,"../helpers/StringHelper":34}],23:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Command = require("../Command");

var AlwaysEnabled = require("../detectors/AlwaysEnabled");

var inflection = interopRequireWildcard(require("inflection"));

function interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

var StringCommandProvider =
/*#__PURE__*/
function () {
  function StringCommandProvider() {
    _classCallCheck(this, StringCommandProvider);
  }

  _createClass(StringCommandProvider, [{
    key: "register",
    value: function register(root) {
      var cmds;
      cmds = root.addCmd(new Command.Command('string'));
      root.addCmd(new Command.Command('str', {
        aliasOf: 'string'
      }));
      root.addDetector(new AlwaysEnabled.AlwaysEnabled('string'));
      return cmds.addCmds({
        'pluralize': {
          'result': function result(instance) {
            return inflection.pluralize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Pluralize a string"
        },
        'singularize': {
          'result': function result(instance) {
            return inflection.singularize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Singularize a string"
        },
        'camelize': {
          'result': function result(instance) {
            return inflection.camelize(instance.getParam([0, 'str']), !instance.getBoolParam([1, 'first'], true));
          },
          'allowedNamed': ['str', 'first'],
          'help': "Transforms a String from underscore to camelcase"
        },
        'underscore': {
          'result': function result(instance) {
            return inflection.underscore(instance.getParam([0, 'str']), instance.getBoolParam([1, 'upper']));
          },
          'allowedNamed': ['str', 'upper'],
          'help': "Transforms a String from camelcase to underscore."
        },
        'humanize': {
          'result': function result(instance) {
            return inflection.humanize(instance.getParam([0, 'str']), instance.getBoolParam([1, 'first']));
          },
          'allowedNamed': ['str', 'first'],
          'help': "Transforms a String to a human readable format"
        },
        'capitalize': {
          'result': function result(instance) {
            return inflection.capitalize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Make the first letter of a string upper"
        },
        'dasherize': {
          'result': function result(instance) {
            return inflection.dasherize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Replaces underscores with dashes in a string."
        },
        'titleize': {
          'result': function result(instance) {
            return inflection.titleize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Transforms a String to a human readable format with most words capitalized"
        },
        'tableize': {
          'result': function result(instance) {
            return inflection.tableize(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Transforms a String to a table format"
        },
        'classify': {
          'result': function result(instance) {
            return inflection.classify(instance.getParam([0, 'str']));
          },
          'allowedNamed': ['str'],
          'help': "Transforms a String to a class format"
        }
      });
    }
  }]);

  return StringCommandProvider;
}();

exports.StringCommandProvider = StringCommandProvider;

},{"../Command":6,"../detectors/AlwaysEnabled":24,"inflection":52}],24:[function(require,module,exports){
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

var Detector = require("./Detector");

var AlwaysEnabled =
/*#__PURE__*/
function (_Detector$Detector) {
  _inherits(AlwaysEnabled, _Detector$Detector);

  function AlwaysEnabled(namespace) {
    var _this;

    _classCallCheck(this, AlwaysEnabled);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AlwaysEnabled).call(this));
    _this.namespace = namespace;
    return _this;
  }

  _createClass(AlwaysEnabled, [{
    key: "detect",
    value: function detect(finder) {
      return this.namespace;
    }
  }]);

  return AlwaysEnabled;
}(Detector.Detector);

exports.AlwaysEnabled = AlwaysEnabled;

},{"./Detector":25}],25:[function(require,module,exports){
"use strict";

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

},{}],26:[function(require,module,exports){
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

var Detector = require("./Detector");

var LangDetector =
/*#__PURE__*/
function (_Detector$Detector) {
  _inherits(LangDetector, _Detector$Detector);

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
}(Detector.Detector);

exports.LangDetector = LangDetector;

},{"./Detector":25}],27:[function(require,module,exports){
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

var Pair = require("../positioning/Pair");

var Detector = require("./Detector");

var PairDetector =
/*#__PURE__*/
function (_Detector$Detector) {
  _inherits(PairDetector, _Detector$Detector);

  function PairDetector() {
    _classCallCheck(this, PairDetector);

    return _possibleConstructorReturn(this, _getPrototypeOf(PairDetector).apply(this, arguments));
  }

  _createClass(PairDetector, [{
    key: "detected",
    value: function detected(finder) {
      var pair;

      if (this.data.opener != null && this.data.closer != null && finder.instance != null) {
        pair = new Pair.Pair(this.data.opener, this.data.closer, this.data);

        if (pair.isWapperOf(finder.instance.getPos(), finder.codewave.editor.text())) {
          return true;
        }
      }

      return false;
    }
  }]);

  return PairDetector;
}(Detector.Detector);

exports.PairDetector = PairDetector;

},{"../positioning/Pair":35,"./Detector":25}],28:[function(require,module,exports){
"use strict";

var bootstrap = require("./bootstrap");

var TextAreaEditor = require("./TextAreaEditor");

bootstrap.Codewave.detect = function (target) {
  var cw;
  cw = new bootstrap.Codewave(new TextAreaEditor.TextAreaEditor(target));
  bootstrap.Codewave.instances.push(cw);
  return cw;
};

bootstrap.Codewave.require = require;
window.Codewave = bootstrap.Codewave;

},{"./TextAreaEditor":15,"./bootstrap":17}],29:[function(require,module,exports){
"use strict";

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

},{}],30:[function(require,module,exports){
"use strict";

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

},{}],31:[function(require,module,exports){
"use strict";

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

},{}],32:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{}],33:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{}],34:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Size = require("../positioning/Size");

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

      return new Size.Size(w, lines.length - 1);
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

},{"../positioning/Size":40}],35:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Pos = require("./Pos");

var StringHelper = require("../helpers/StringHelper");

var PairMatch = require("./PairMatch");

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
        return new RegExp(StringHelper.StringHelper.escapeRegExp(this.opener));
      } else {
        return this.opener;
      }
    }
  }, {
    key: "closerReg",
    value: function closerReg() {
      if (typeof this.closer === 'string') {
        return new RegExp(StringHelper.StringHelper.escapeRegExp(this.closer));
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
        return new PairMatch.PairMatch(this, match, offset);
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
          return new Pos.Pos(start.start(), end.end());
        } else if (this.optionnal_end) {
          return new Pos.Pos(start.start(), text.length);
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

},{"../helpers/StringHelper":34,"./PairMatch":36,"./Pos":37}],36:[function(require,module,exports){
"use strict";

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

},{}],37:[function(require,module,exports){
"use strict";

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

},{}],38:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Wrapping = require("./Wrapping");

var Replacement = require("./Replacement");

var CommonHelper = require("../helpers/CommonHelper");

var PosCollection =
/*#__PURE__*/
function () {
  function PosCollection(arr) {
    _classCallCheck(this, PosCollection);

    if (!Array.isArray(arr)) {
      arr = [arr];
    }

    CommonHelper.CommonHelper.applyMixins(arr, [PosCollection]);
    return arr;
  }

  _createClass(PosCollection, [{
    key: "wrap",
    value: function wrap(prefix, suffix) {
      return this.map(function (p) {
        return new Wrapping.Wrapping(p.start, p.end, prefix, suffix);
      });
    }
  }, {
    key: "replace",
    value: function replace(txt) {
      return this.map(function (p) {
        return new Replacement.Replacement(p.start, p.end, txt);
      });
    }
  }]);

  return PosCollection;
}();

exports.PosCollection = PosCollection;

},{"../helpers/CommonHelper":30,"./Replacement":39,"./Wrapping":43}],39:[function(require,module,exports){
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

var Pos = require("./Pos");

var CommonHelper = require("../helpers/CommonHelper");

var OptionObject = require("../OptionObject");

var StringHelper = require("../helpers/StringHelper");

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
        this.selections = [new Pos.Pos(this.prefix.length + this.start, this.prefix.length + this.start + this.text.length)];
        return this;
      }
    }, {
      key: "carretToSel",
      value: function carretToSel() {
        var pos, res, start, text;
        this.selections = [];
        text = this.finalText();
        this.prefix = StringHelper.StringHelper.removeCarret(this.prefix);
        this.text = StringHelper.StringHelper.removeCarret(this.text);
        this.suffix = StringHelper.StringHelper.removeCarret(this.suffix);
        start = this.start;

        while ((res = StringHelper.StringHelper.getAndRemoveFirstCarret(text)) != null) {
          var _res = res;

          var _res2 = _slicedToArray(_res, 2);

          pos = _res2[0];
          text = _res2[1];
          this.selections.push(new Pos.Pos(start + pos, start + pos));
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
  }(Pos.Pos);

  ;
  CommonHelper.CommonHelper.applyMixins(Replacement.prototype, [OptionObject.OptionObject]);
  return Replacement;
}.call(void 0);

exports.Replacement = Replacement;

},{"../OptionObject":11,"../helpers/CommonHelper":30,"../helpers/StringHelper":34,"./Pos":37}],40:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Size = function Size(width, height) {
  _classCallCheck(this, Size);

  this.width = width;
  this.height = height;
};

exports.Size = Size;

},{}],41:[function(require,module,exports){
"use strict";

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

},{}],42:[function(require,module,exports){
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

var Pos = require("./Pos");

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
}(Pos.Pos);

exports.WrappedPos = WrappedPos;

},{"./Pos":37}],43:[function(require,module,exports){
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

var Replacement = require("./Replacement");

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
}(Replacement.Replacement);

exports.Wrapping = Wrapping;

},{"./Replacement":39}],44:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{}],45:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Context =
/*#__PURE__*/
function () {
  function Context(parser, parent) {
    _classCallCheck(this, Context);

    this.parser = parser;
    this.parent = parent;
    this.content = "";
  }

  _createClass(Context, [{
    key: "onStart",
    value: function onStart() {
      return this.startAt = this.parser.pos;
    }
  }, {
    key: "onChar",
    value: function onChar(_char) {}
  }, {
    key: "end",
    value: function end() {
      return this.parser.setContext(this.parent);
    }
  }, {
    key: "onEnd",
    value: function onEnd() {}
  }, {
    key: "testContext",
    value: function testContext(contextType) {
      if (contextType.test(this.parser["char"], this)) {
        return this.parser.setContext(new contextType(this.parser, this));
      }
    }
  }], [{
    key: "test",
    value: function test() {
      return false;
    }
  }]);

  return Context;
}();

exports.Context = Context;

},{}],46:[function(require,module,exports){
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

var Context = require("./Context");

var EscapeContext =
/*#__PURE__*/
function (_Context$Context) {
  _inherits(EscapeContext, _Context$Context);

  function EscapeContext() {
    _classCallCheck(this, EscapeContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(EscapeContext).apply(this, arguments));
  }

  _createClass(EscapeContext, [{
    key: "onChar",
    value: function onChar(_char) {
      this.parent.content += _char;
      return this.end();
    }
  }], [{
    key: "test",
    value: function test(_char2) {
      return _char2 === '\\';
    }
  }]);

  return EscapeContext;
}(Context.Context);

exports.EscapeContext = EscapeContext;

},{"./Context":45}],47:[function(require,module,exports){
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

var ParamContext = require("./ParamContext");

var indexOf = [].indexOf;

var NamedContext =
/*#__PURE__*/
function (_ParamContext$ParamCo) {
  _inherits(NamedContext, _ParamContext$ParamCo);

  function NamedContext() {
    _classCallCheck(this, NamedContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(NamedContext).apply(this, arguments));
  }

  _createClass(NamedContext, [{
    key: "onStart",
    value: function onStart() {
      return this.name = this.parent.content;
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      return this.parser.named[this.name] = this.content;
    }
  }], [{
    key: "test",
    value: function test(_char, parent) {
      var ref;
      return _char === ':' && (parent.parser.options.allowedNamed == null || (ref = parent.content, indexOf.call(parent.parser.options.allowedNamed, ref) >= 0));
    }
  }]);

  return NamedContext;
}(ParamContext.ParamContext);

exports.NamedContext = NamedContext;

},{"./ParamContext":48}],48:[function(require,module,exports){
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

var Context = require("./Context");

var StringContext = require("./StringContext");

var VariableContext = require("./VariableContext");

var ParamContext =
/*#__PURE__*/
function (_Context$Context) {
  _inherits(ParamContext, _Context$Context);

  function ParamContext() {
    _classCallCheck(this, ParamContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(ParamContext).apply(this, arguments));
  }

  _createClass(ParamContext, [{
    key: "onChar",
    value: function onChar(_char) {
      if (this.testContext(StringContext.StringContext)) {} else if (this.testContext(ParamContext.named)) {} else if (this.testContext(VariableContext.VariableContext)) {} else if (_char === ' ') {
        return this.parser.setContext(new ParamContext(this.parser));
      } else {
        return this.content += _char;
      }
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      return this.parser.params.push(this.content);
    }
  }]);

  return ParamContext;
}(Context.Context);

exports.ParamContext = ParamContext;

},{"./Context":45,"./StringContext":50,"./VariableContext":51}],49:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ParamContext = require("./ParamContext");

var NamedContext = require("./NamedContext");

ParamContext.ParamContext.named = NamedContext.NamedContext;

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
    key: "setContext",
    value: function setContext(context) {
      var oldContext;
      oldContext = this.context;
      this.context = context;

      if (oldContext != null && oldContext !== (context != null ? context.parent : void 0)) {
        oldContext.onEnd();
      }

      if (context != null) {
        context.onStart();
      }

      return this.context;
    }
  }, {
    key: "parse",
    value: function parse() {
      this.params = [];
      this.named = {};

      if (this.paramString.length) {
        this.setContext(new ParamContext.ParamContext(this));
        this.pos = 0;

        while (this.pos < this.paramString.length) {
          this["char"] = this.paramString[this.pos];
          this.context.onChar(this["char"]);
          this.pos++;
        }

        return this.setContext(null);
      }
    }
  }, {
    key: "take",
    value: function take(nb) {
      return this.paramString.substring(this.pos, this.pos + nb);
    }
  }, {
    key: "skip",
    value: function skip() {
      var nb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return this.pos += nb;
    }
  }]);

  return ParamParser;
}();

exports.ParamParser = ParamParser;

},{"./NamedContext":47,"./ParamContext":48}],50:[function(require,module,exports){
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

var Context = require("./Context");

var EscapeContext = require("./EscapeContext");

var VariableContext = require("./VariableContext");

var StringContext =
/*#__PURE__*/
function (_Context$Context) {
  _inherits(StringContext, _Context$Context);

  function StringContext() {
    _classCallCheck(this, StringContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(StringContext).apply(this, arguments));
  }

  _createClass(StringContext, [{
    key: "onChar",
    value: function onChar(_char) {
      if (this.testContext(EscapeContext.EscapeContext)) {} else if (this.testContext(VariableContext.VariableContext)) {} else if (StringContext.isDelimiter(_char)) {
        return this.end();
      } else {
        return this.content += _char;
      }
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      return this.parent.content += this.content;
    }
  }], [{
    key: "test",
    value: function test(_char2) {
      return this.isDelimiter(_char2);
    }
  }, {
    key: "isDelimiter",
    value: function isDelimiter(_char3) {
      return _char3 === '"' || _char3 === "'";
    }
  }]);

  return StringContext;
}(Context.Context);

exports.StringContext = StringContext;

},{"./Context":45,"./EscapeContext":46,"./VariableContext":51}],51:[function(require,module,exports){
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

var Context = require("./Context");

var VariableContext =
/*#__PURE__*/
function (_Context$Context) {
  _inherits(VariableContext, _Context$Context);

  function VariableContext() {
    _classCallCheck(this, VariableContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(VariableContext).apply(this, arguments));
  }

  _createClass(VariableContext, [{
    key: "onStart",
    value: function onStart() {
      return this.parser.skip();
    }
  }, {
    key: "onChar",
    value: function onChar(_char) {
      if (_char === '}') {
        return this.end();
      } else {
        return this.content += _char;
      }
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      var ref;
      return this.parent.content += ((ref = this.parser.options.vars) != null ? ref[this.content] : void 0) || '';
    }
  }], [{
    key: "test",
    value: function test(_char2, parent) {
      return parent.parser.take(2) === '#{';
    }
  }]);

  return VariableContext;
}(Context.Context);

exports.VariableContext = VariableContext;

},{"./Context":45}],52:[function(require,module,exports){
/*!
 * inflection
 * Copyright(c) 2011 Ben Lin <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * A port of inflection-js to node.js module.
 */

( function ( root, factory ){
  if( typeof define === 'function' && define.amd ){
    define([], factory );
  }else if( typeof exports === 'object' ){
    module.exports = factory();
  }else{
    root.inflection = factory();
  }
}( this, function (){

  /**
   * @description This is a list of nouns that use the same form for both singular and plural.
   *              This list should remain entirely in lower case to correctly match Strings.
   * @private
   */
  var uncountable_words = [
    // 'access',
    'accommodation',
    'adulthood',
    'advertising',
    'advice',
    'aggression',
    'aid',
    'air',
    'aircraft',
    'alcohol',
    'anger',
    'applause',
    'arithmetic',
    // 'art',
    'assistance',
    'athletics',
    // 'attention',

    'bacon',
    'baggage',
    // 'ballet',
    // 'beauty',
    'beef',
    // 'beer',
    // 'behavior',
    'biology',
    // 'billiards',
    'blood',
    'botany',
    // 'bowels',
    'bread',
    // 'business',
    'butter',

    'carbon',
    'cardboard',
    'cash',
    'chalk',
    'chaos',
    'chess',
    'crossroads',
    'countryside',

    // 'damage',
    'dancing',
    // 'danger',
    'deer',
    // 'delight',
    // 'dessert',
    'dignity',
    'dirt',
    // 'distribution',
    'dust',

    'economics',
    'education',
    'electricity',
    // 'employment',
    // 'energy',
    'engineering',
    'enjoyment',
    // 'entertainment',
    'envy',
    'equipment',
    'ethics',
    'evidence',
    'evolution',

    // 'failure',
    // 'faith',
    'fame',
    'fiction',
    // 'fish',
    'flour',
    'flu',
    'food',
    // 'freedom',
    // 'fruit',
    'fuel',
    'fun',
    // 'funeral',
    'furniture',

    'gallows',
    'garbage',
    'garlic',
    // 'gas',
    'genetics',
    // 'glass',
    'gold',
    'golf',
    'gossip',
    'grammar',
    // 'grass',
    'gratitude',
    'grief',
    // 'ground',
    'guilt',
    'gymnastics',

    // 'hair',
    'happiness',
    'hardware',
    'harm',
    'hate',
    'hatred',
    'health',
    'heat',
    // 'height',
    'help',
    'homework',
    'honesty',
    'honey',
    'hospitality',
    'housework',
    'humour',
    'hunger',
    'hydrogen',

    'ice',
    'importance',
    'inflation',
    'information',
    // 'injustice',
    'innocence',
    // 'intelligence',
    'iron',
    'irony',

    'jam',
    // 'jealousy',
    // 'jelly',
    'jewelry',
    // 'joy',
    'judo',
    // 'juice',
    // 'justice',

    'karate',
    // 'kindness',
    'knowledge',

    // 'labour',
    'lack',
    // 'land',
    'laughter',
    'lava',
    'leather',
    'leisure',
    'lightning',
    'linguine',
    'linguini',
    'linguistics',
    'literature',
    'litter',
    'livestock',
    'logic',
    'loneliness',
    // 'love',
    'luck',
    'luggage',

    'macaroni',
    'machinery',
    'magic',
    // 'mail',
    'management',
    'mankind',
    'marble',
    'mathematics',
    'mayonnaise',
    'measles',
    // 'meat',
    // 'metal',
    'methane',
    'milk',
    'minus',
    'money',
    // 'moose',
    'mud',
    'music',
    'mumps',

    'nature',
    'news',
    'nitrogen',
    'nonsense',
    'nurture',
    'nutrition',

    'obedience',
    'obesity',
    // 'oil',
    'oxygen',

    // 'paper',
    // 'passion',
    'pasta',
    'patience',
    // 'permission',
    'physics',
    'poetry',
    'pollution',
    'poverty',
    // 'power',
    'pride',
    // 'production',
    // 'progress',
    // 'pronunciation',
    'psychology',
    'publicity',
    'punctuation',

    // 'quality',
    // 'quantity',
    'quartz',

    'racism',
    // 'rain',
    // 'recreation',
    'relaxation',
    'reliability',
    'research',
    'respect',
    'revenge',
    'rice',
    'rubbish',
    'rum',

    'safety',
    // 'salad',
    // 'salt',
    // 'sand',
    // 'satire',
    'scenery',
    'seafood',
    'seaside',
    'series',
    'shame',
    'sheep',
    'shopping',
    // 'silence',
    'sleep',
    // 'slang'
    'smoke',
    'smoking',
    'snow',
    'soap',
    'software',
    'soil',
    // 'sorrow',
    // 'soup',
    'spaghetti',
    // 'speed',
    'species',
    // 'spelling',
    // 'sport',
    'steam',
    // 'strength',
    'stuff',
    'stupidity',
    // 'success',
    // 'sugar',
    'sunshine',
    'symmetry',

    // 'tea',
    'tennis',
    'thirst',
    'thunder',
    'timber',
    // 'time',
    // 'toast',
    // 'tolerance',
    // 'trade',
    'traffic',
    'transportation',
    // 'travel',
    'trust',

    // 'understanding',
    'underwear',
    'unemployment',
    'unity',
    // 'usage',

    'validity',
    'veal',
    'vegetation',
    'vegetarianism',
    'vengeance',
    'violence',
    // 'vision',
    'vitality',

    'warmth',
    // 'water',
    'wealth',
    'weather',
    // 'weight',
    'welfare',
    'wheat',
    // 'whiskey',
    // 'width',
    'wildlife',
    // 'wine',
    'wisdom',
    // 'wood',
    // 'wool',
    // 'work',

    // 'yeast',
    'yoga',

    'zinc',
    'zoology'
  ];

  /**
   * @description These rules translate from the singular form of a noun to its plural form.
   * @private
   */

  var regex = {
    plural : {
      men       : new RegExp( '^(m|wom)en$'                    , 'gi' ),
      people    : new RegExp( '(pe)ople$'                      , 'gi' ),
      children  : new RegExp( '(child)ren$'                    , 'gi' ),
      tia       : new RegExp( '([ti])a$'                       , 'gi' ),
      analyses  : new RegExp( '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi' ),
      hives     : new RegExp( '(hi|ti)ves$'                    , 'gi' ),
      curves    : new RegExp( '(curve)s$'                      , 'gi' ),
      lrves     : new RegExp( '([lr])ves$'                     , 'gi' ),
      aves      : new RegExp( '([a])ves$'                      , 'gi' ),
      foves     : new RegExp( '([^fo])ves$'                    , 'gi' ),
      movies    : new RegExp( '(m)ovies$'                      , 'gi' ),
      aeiouyies : new RegExp( '([^aeiouy]|qu)ies$'             , 'gi' ),
      series    : new RegExp( '(s)eries$'                      , 'gi' ),
      xes       : new RegExp( '(x|ch|ss|sh)es$'                , 'gi' ),
      mice      : new RegExp( '([m|l])ice$'                    , 'gi' ),
      buses     : new RegExp( '(bus)es$'                       , 'gi' ),
      oes       : new RegExp( '(o)es$'                         , 'gi' ),
      shoes     : new RegExp( '(shoe)s$'                       , 'gi' ),
      crises    : new RegExp( '(cris|ax|test)es$'              , 'gi' ),
      octopi    : new RegExp( '(octop|vir)i$'                  , 'gi' ),
      aliases   : new RegExp( '(alias|canvas|status|campus)es$', 'gi' ),
      summonses : new RegExp( '^(summons)es$'                  , 'gi' ),
      oxen      : new RegExp( '^(ox)en'                        , 'gi' ),
      matrices  : new RegExp( '(matr)ices$'                    , 'gi' ),
      vertices  : new RegExp( '(vert|ind)ices$'                , 'gi' ),
      feet      : new RegExp( '^feet$'                         , 'gi' ),
      teeth     : new RegExp( '^teeth$'                        , 'gi' ),
      geese     : new RegExp( '^geese$'                        , 'gi' ),
      quizzes   : new RegExp( '(quiz)zes$'                     , 'gi' ),
      whereases : new RegExp( '^(whereas)es$'                  , 'gi' ),
      criteria  : new RegExp( '^(criteri)a$'                   , 'gi' ),
      genera    : new RegExp( '^genera$'                       , 'gi' ),
      ss        : new RegExp( 'ss$'                            , 'gi' ),
      s         : new RegExp( 's$'                             , 'gi' )
    },

    singular : {
      man       : new RegExp( '^(m|wom)an$'                  , 'gi' ),
      person    : new RegExp( '(pe)rson$'                    , 'gi' ),
      child     : new RegExp( '(child)$'                     , 'gi' ),
      ox        : new RegExp( '^(ox)$'                       , 'gi' ),
      axis      : new RegExp( '(ax|test)is$'                 , 'gi' ),
      octopus   : new RegExp( '(octop|vir)us$'               , 'gi' ),
      alias     : new RegExp( '(alias|status|canvas|campus)$', 'gi' ),
      summons   : new RegExp( '^(summons)$'                  , 'gi' ),
      bus       : new RegExp( '(bu)s$'                       , 'gi' ),
      buffalo   : new RegExp( '(buffal|tomat|potat)o$'       , 'gi' ),
      tium      : new RegExp( '([ti])um$'                    , 'gi' ),
      sis       : new RegExp( 'sis$'                         , 'gi' ),
      ffe       : new RegExp( '(?:([^f])fe|([lr])f)$'        , 'gi' ),
      hive      : new RegExp( '(hi|ti)ve$'                   , 'gi' ),
      aeiouyy   : new RegExp( '([^aeiouy]|qu)y$'             , 'gi' ),
      x         : new RegExp( '(x|ch|ss|sh)$'                , 'gi' ),
      matrix    : new RegExp( '(matr)ix$'                    , 'gi' ),
      vertex    : new RegExp( '(vert|ind)ex$'                , 'gi' ),
      mouse     : new RegExp( '([m|l])ouse$'                 , 'gi' ),
      foot      : new RegExp( '^foot$'                       , 'gi' ),
      tooth     : new RegExp( '^tooth$'                      , 'gi' ),
      goose     : new RegExp( '^goose$'                      , 'gi' ),
      quiz      : new RegExp( '(quiz)$'                      , 'gi' ),
      whereas   : new RegExp( '^(whereas)$'                  , 'gi' ),
      criterion : new RegExp( '^(criteri)on$'                , 'gi' ),
      genus     : new RegExp( '^genus$'                      , 'gi' ),
      s         : new RegExp( 's$'                           , 'gi' ),
      common    : new RegExp( '$'                            , 'gi' )
    }
  };

  var plural_rules = [

    // do not replace if its already a plural word
    [ regex.plural.men       ],
    [ regex.plural.people    ],
    [ regex.plural.children  ],
    [ regex.plural.tia       ],
    [ regex.plural.analyses  ],
    [ regex.plural.hives     ],
    [ regex.plural.curves    ],
    [ regex.plural.lrves     ],
    [ regex.plural.foves     ],
    [ regex.plural.aeiouyies ],
    [ regex.plural.series    ],
    [ regex.plural.movies    ],
    [ regex.plural.xes       ],
    [ regex.plural.mice      ],
    [ regex.plural.buses     ],
    [ regex.plural.oes       ],
    [ regex.plural.shoes     ],
    [ regex.plural.crises    ],
    [ regex.plural.octopi    ],
    [ regex.plural.aliases   ],
    [ regex.plural.summonses ],
    [ regex.plural.oxen      ],
    [ regex.plural.matrices  ],
    [ regex.plural.feet      ],
    [ regex.plural.teeth     ],
    [ regex.plural.geese     ],
    [ regex.plural.quizzes   ],
    [ regex.plural.whereases ],
    [ regex.plural.criteria  ],
    [ regex.plural.genera    ],

    // original rule
    [ regex.singular.man      , '$1en' ],
    [ regex.singular.person   , '$1ople' ],
    [ regex.singular.child    , '$1ren' ],
    [ regex.singular.ox       , '$1en' ],
    [ regex.singular.axis     , '$1es' ],
    [ regex.singular.octopus  , '$1i' ],
    [ regex.singular.alias    , '$1es' ],
    [ regex.singular.summons  , '$1es' ],
    [ regex.singular.bus      , '$1ses' ],
    [ regex.singular.buffalo  , '$1oes' ],
    [ regex.singular.tium     , '$1a' ],
    [ regex.singular.sis      , 'ses' ],
    [ regex.singular.ffe      , '$1$2ves' ],
    [ regex.singular.hive     , '$1ves' ],
    [ regex.singular.aeiouyy  , '$1ies' ],
    [ regex.singular.matrix   , '$1ices' ],
    [ regex.singular.vertex   , '$1ices' ],
    [ regex.singular.x        , '$1es' ],
    [ regex.singular.mouse    , '$1ice' ],
    [ regex.singular.foot     , 'feet' ],
    [ regex.singular.tooth    , 'teeth' ],
    [ regex.singular.goose    , 'geese' ],
    [ regex.singular.quiz     , '$1zes' ],
    [ regex.singular.whereas  , '$1es' ],
    [ regex.singular.criterion, '$1a' ],
    [ regex.singular.genus    , 'genera' ],

    [ regex.singular.s     , 's' ],
    [ regex.singular.common, 's' ]
  ];

  /**
   * @description These rules translate from the plural form of a noun to its singular form.
   * @private
   */
  var singular_rules = [

    // do not replace if its already a singular word
    [ regex.singular.man     ],
    [ regex.singular.person  ],
    [ regex.singular.child   ],
    [ regex.singular.ox      ],
    [ regex.singular.axis    ],
    [ regex.singular.octopus ],
    [ regex.singular.alias   ],
    [ regex.singular.summons ],
    [ regex.singular.bus     ],
    [ regex.singular.buffalo ],
    [ regex.singular.tium    ],
    [ regex.singular.sis     ],
    [ regex.singular.ffe     ],
    [ regex.singular.hive    ],
    [ regex.singular.aeiouyy ],
    [ regex.singular.x       ],
    [ regex.singular.matrix  ],
    [ regex.singular.mouse   ],
    [ regex.singular.foot    ],
    [ regex.singular.tooth   ],
    [ regex.singular.goose   ],
    [ regex.singular.quiz    ],
    [ regex.singular.whereas ],
    [ regex.singular.criterion ],
    [ regex.singular.genus ],

    // original rule
    [ regex.plural.men      , '$1an' ],
    [ regex.plural.people   , '$1rson' ],
    [ regex.plural.children , '$1' ],
    [ regex.plural.genera   , 'genus'],
    [ regex.plural.criteria , '$1on'],
    [ regex.plural.tia      , '$1um' ],
    [ regex.plural.analyses , '$1$2sis' ],
    [ regex.plural.hives    , '$1ve' ],
    [ regex.plural.curves   , '$1' ],
    [ regex.plural.lrves    , '$1f' ],
    [ regex.plural.aves     , '$1ve' ],
    [ regex.plural.foves    , '$1fe' ],
    [ regex.plural.movies   , '$1ovie' ],
    [ regex.plural.aeiouyies, '$1y' ],
    [ regex.plural.series   , '$1eries' ],
    [ regex.plural.xes      , '$1' ],
    [ regex.plural.mice     , '$1ouse' ],
    [ regex.plural.buses    , '$1' ],
    [ regex.plural.oes      , '$1' ],
    [ regex.plural.shoes    , '$1' ],
    [ regex.plural.crises   , '$1is' ],
    [ regex.plural.octopi   , '$1us' ],
    [ regex.plural.aliases  , '$1' ],
    [ regex.plural.summonses, '$1' ],
    [ regex.plural.oxen     , '$1' ],
    [ regex.plural.matrices , '$1ix' ],
    [ regex.plural.vertices , '$1ex' ],
    [ regex.plural.feet     , 'foot' ],
    [ regex.plural.teeth    , 'tooth' ],
    [ regex.plural.geese    , 'goose' ],
    [ regex.plural.quizzes  , '$1' ],
    [ regex.plural.whereases, '$1' ],

    [ regex.plural.ss, 'ss' ],
    [ regex.plural.s , '' ]
  ];

  /**
   * @description This is a list of words that should not be capitalized for title case.
   * @private
   */
  var non_titlecased_words = [
    'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at','by',
    'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over', 'with', 'for'
  ];

  /**
   * @description These are regular expressions used for converting between String formats.
   * @private
   */
  var id_suffix         = new RegExp( '(_ids|_id)$', 'g' );
  var underbar          = new RegExp( '_', 'g' );
  var space_or_underbar = new RegExp( '[\ _]', 'g' );
  var uppercase         = new RegExp( '([A-Z])', 'g' );
  var underbar_prefix   = new RegExp( '^_' );

  var inflector = {

  /**
   * A helper method that applies rules based replacement to a String.
   * @private
   * @function
   * @param {String} str String to modify and return based on the passed rules.
   * @param {Array: [RegExp, String]} rules Regexp to match paired with String to use for replacement
   * @param {Array: [String]} skip Strings to skip if they match
   * @param {String} override String to return as though this method succeeded (used to conform to APIs)
   * @returns {String} Return passed String modified by passed rules.
   * @example
   *
   *     this._apply_rules( 'cows', singular_rules ); // === 'cow'
   */
    _apply_rules : function ( str, rules, skip, override ){
      if( override ){
        str = override;
      }else{
        var ignore = ( inflector.indexOf( skip, str.toLowerCase()) > -1 );

        if( !ignore ){
          var i = 0;
          var j = rules.length;

          for( ; i < j; i++ ){
            if( str.match( rules[ i ][ 0 ])){
              if( rules[ i ][ 1 ] !== undefined ){
                str = str.replace( rules[ i ][ 0 ], rules[ i ][ 1 ]);
              }
              break;
            }
          }
        }
      }

      return str;
    },



  /**
   * This lets us detect if an Array contains a given element.
   * @public
   * @function
   * @param {Array} arr The subject array.
   * @param {Object} item Object to locate in the Array.
   * @param {Number} from_index Starts checking from this position in the Array.(optional)
   * @param {Function} compare_func Function used to compare Array item vs passed item.(optional)
   * @returns {Number} Return index position in the Array of the passed item.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.indexOf([ 'hi','there' ], 'guys' ); // === -1
   *     inflection.indexOf([ 'hi','there' ], 'hi' ); // === 0
   */
    indexOf : function ( arr, item, from_index, compare_func ){
      if( !from_index ){
        from_index = -1;
      }

      var index = -1;
      var i     = from_index;
      var j     = arr.length;

      for( ; i < j; i++ ){
        if( arr[ i ]  === item || compare_func && compare_func( arr[ i ], item )){
          index = i;
          break;
        }
      }

      return index;
    },



  /**
   * This function adds pluralization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {String} plural Overrides normal output with said String.(optional)
   * @returns {String} Singular English language nouns are returned in plural form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.pluralize( 'person' ); // === 'people'
   *     inflection.pluralize( 'octopus' ); // === 'octopi'
   *     inflection.pluralize( 'Hat' ); // === 'Hats'
   *     inflection.pluralize( 'person', 'guys' ); // === 'guys'
   */
    pluralize : function ( str, plural ){
      return inflector._apply_rules( str, plural_rules, uncountable_words, plural );
    },



  /**
   * This function adds singularization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {String} singular Overrides normal output with said String.(optional)
   * @returns {String} Plural English language nouns are returned in singular form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.singularize( 'people' ); // === 'person'
   *     inflection.singularize( 'octopi' ); // === 'octopus'
   *     inflection.singularize( 'Hats' ); // === 'Hat'
   *     inflection.singularize( 'guys', 'person' ); // === 'person'
   */
    singularize : function ( str, singular ){
      return inflector._apply_rules( str, singular_rules, uncountable_words, singular );
    },


  /**
   * This function will pluralize or singularlize a String appropriately based on an integer value
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Number} count The number to base pluralization off of.
   * @param {String} singular Overrides normal output with said String.(optional)
   * @param {String} plural Overrides normal output with said String.(optional)
   * @returns {String} English language nouns are returned in the plural or singular form based on the count.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.inflect( 'people' 1 ); // === 'person'
   *     inflection.inflect( 'octopi' 1 ); // === 'octopus'
   *     inflection.inflect( 'Hats' 1 ); // === 'Hat'
   *     inflection.inflect( 'guys', 1 , 'person' ); // === 'person'
   *     inflection.inflect( 'person', 2 ); // === 'people'
   *     inflection.inflect( 'octopus', 2 ); // === 'octopi'
   *     inflection.inflect( 'Hat', 2 ); // === 'Hats'
   *     inflection.inflect( 'person', 2, null, 'guys' ); // === 'guys'
   */
    inflect : function ( str, count, singular, plural ){
      count = parseInt( count, 10 );

      if( isNaN( count )) return str;

      if( count === 0 || count > 1 ){
        return inflector._apply_rules( str, plural_rules, uncountable_words, plural );
      }else{
        return inflector._apply_rules( str, singular_rules, uncountable_words, singular );
      }
    },



  /**
   * This function adds camelization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Boolean} low_first_letter Default is to capitalize the first letter of the results.(optional)
   *                                 Passing true will lowercase it.
   * @returns {String} Lower case underscored words will be returned in camel case.
   *                  additionally '/' is translated to '::'
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.camelize( 'message_properties' ); // === 'MessageProperties'
   *     inflection.camelize( 'message_properties', true ); // === 'messageProperties'
   */
    camelize : function ( str, low_first_letter ){
      var str_path = str.split( '/' );
      var i        = 0;
      var j        = str_path.length;
      var str_arr, init_x, k, l, first;

      for( ; i < j; i++ ){
        str_arr = str_path[ i ].split( '_' );
        k       = 0;
        l       = str_arr.length;

        for( ; k < l; k++ ){
          if( k !== 0 ){
            str_arr[ k ] = str_arr[ k ].toLowerCase();
          }

          first = str_arr[ k ].charAt( 0 );
          first = low_first_letter && i === 0 && k === 0
            ? first.toLowerCase() : first.toUpperCase();
          str_arr[ k ] = first + str_arr[ k ].substring( 1 );
        }

        str_path[ i ] = str_arr.join( '' );
      }

      return str_path.join( '::' );
    },



  /**
   * This function adds underscore support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Boolean} all_upper_case Default is to lowercase and add underscore prefix.(optional)
   *                  Passing true will return as entered.
   * @returns {String} Camel cased words are returned as lower cased and underscored.
   *                  additionally '::' is translated to '/'.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.underscore( 'MessageProperties' ); // === 'message_properties'
   *     inflection.underscore( 'messageProperties' ); // === 'message_properties'
   *     inflection.underscore( 'MP', true ); // === 'MP'
   */
    underscore : function ( str, all_upper_case ){
      if( all_upper_case && str === str.toUpperCase()) return str;

      var str_path = str.split( '::' );
      var i        = 0;
      var j        = str_path.length;

      for( ; i < j; i++ ){
        str_path[ i ] = str_path[ i ].replace( uppercase, '_$1' );
        str_path[ i ] = str_path[ i ].replace( underbar_prefix, '' );
      }

      return str_path.join( '/' ).toLowerCase();
    },



  /**
   * This function adds humanize support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Boolean} low_first_letter Default is to capitalize the first letter of the results.(optional)
   *                                 Passing true will lowercase it.
   * @returns {String} Lower case underscored words will be returned in humanized form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.humanize( 'message_properties' ); // === 'Message properties'
   *     inflection.humanize( 'message_properties', true ); // === 'message properties'
   */
    humanize : function ( str, low_first_letter ){
      str = str.toLowerCase();
      str = str.replace( id_suffix, '' );
      str = str.replace( underbar, ' ' );

      if( !low_first_letter ){
        str = inflector.capitalize( str );
      }

      return str;
    },



  /**
   * This function adds capitalization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} All characters will be lower case and the first will be upper.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.capitalize( 'message_properties' ); // === 'Message_properties'
   *     inflection.capitalize( 'message properties', true ); // === 'Message properties'
   */
    capitalize : function ( str ){
      str = str.toLowerCase();

      return str.substring( 0, 1 ).toUpperCase() + str.substring( 1 );
    },



  /**
   * This function replaces underscores with dashes in the string.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Replaces all spaces or underscores with dashes.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.dasherize( 'message_properties' ); // === 'message-properties'
   *     inflection.dasherize( 'Message Properties' ); // === 'Message-Properties'
   */
    dasherize : function ( str ){
      return str.replace( space_or_underbar, '-' );
    },



  /**
   * This function adds titleize support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Capitalizes words as you would for a book title.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.titleize( 'message_properties' ); // === 'Message Properties'
   *     inflection.titleize( 'message properties to keep' ); // === 'Message Properties to Keep'
   */
    titleize : function ( str ){
      str         = str.toLowerCase().replace( underbar, ' ' );
      var str_arr = str.split( ' ' );
      var i       = 0;
      var j       = str_arr.length;
      var d, k, l;

      for( ; i < j; i++ ){
        d = str_arr[ i ].split( '-' );
        k = 0;
        l = d.length;

        for( ; k < l; k++){
          if( inflector.indexOf( non_titlecased_words, d[ k ].toLowerCase()) < 0 ){
            d[ k ] = inflector.capitalize( d[ k ]);
          }
        }

        str_arr[ i ] = d.join( '-' );
      }

      str = str_arr.join( ' ' );
      str = str.substring( 0, 1 ).toUpperCase() + str.substring( 1 );

      return str;
    },



  /**
   * This function adds demodulize support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Removes module names leaving only class names.(Ruby style)
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.demodulize( 'Message::Bus::Properties' ); // === 'Properties'
   */
    demodulize : function ( str ){
      var str_arr = str.split( '::' );

      return str_arr[ str_arr.length - 1 ];
    },



  /**
   * This function adds tableize support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Return camel cased words into their underscored plural form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.tableize( 'MessageBusProperty' ); // === 'message_bus_properties'
   */
    tableize : function ( str ){
      str = inflector.underscore( str );
      str = inflector.pluralize( str );

      return str;
    },



  /**
   * This function adds classification support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Underscored plural nouns become the camel cased singular form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.classify( 'message_bus_properties' ); // === 'MessageBusProperty'
   */
    classify : function ( str ){
      str = inflector.camelize( str );
      str = inflector.singularize( str );

      return str;
    },



  /**
   * This function adds foreign key support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Boolean} drop_id_ubar Default is to seperate id with an underbar at the end of the class name,
                                 you can pass true to skip it.(optional)
   * @returns {String} Underscored plural nouns become the camel cased singular form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.foreign_key( 'MessageBusProperty' ); // === 'message_bus_property_id'
   *     inflection.foreign_key( 'MessageBusProperty', true ); // === 'message_bus_propertyid'
   */
    foreign_key : function ( str, drop_id_ubar ){
      str = inflector.demodulize( str );
      str = inflector.underscore( str ) + (( drop_id_ubar ) ? ( '' ) : ( '_' )) + 'id';

      return str;
    },



  /**
   * This function adds ordinalize support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Return all found numbers their sequence like '22nd'.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.ordinalize( 'the 1 pitch' ); // === 'the 1st pitch'
   */
    ordinalize : function ( str ){
      var str_arr = str.split( ' ' );
      var i       = 0;
      var j       = str_arr.length;

      for( ; i < j; i++ ){
        var k = parseInt( str_arr[ i ], 10 );

        if( !isNaN( k )){
          var ltd = str_arr[ i ].substring( str_arr[ i ].length - 2 );
          var ld  = str_arr[ i ].substring( str_arr[ i ].length - 1 );
          var suf = 'th';

          if( ltd != '11' && ltd != '12' && ltd != '13' ){
            if( ld === '1' ){
              suf = 'st';
            }else if( ld === '2' ){
              suf = 'nd';
            }else if( ld === '3' ){
              suf = 'rd';
            }
          }

          str_arr[ i ] += suf;
        }
      }

      return str_arr.join( ' ' );
    },

  /**
   * This function performs multiple inflection methods on a string
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Array} arr An array of inflection methods.
   * @returns {String}
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.transform( 'all job', [ 'pluralize', 'capitalize', 'dasherize' ]); // === 'All-jobs'
   */
    transform : function ( str, arr ){
      var i = 0;
      var j = arr.length;

      for( ;i < j; i++ ){
        var method = arr[ i ];

        if( inflector.hasOwnProperty( method )){
          str = inflector[ method ]( str );
        }
      }

      return str;
    }
  };

/**
 * @public
 */
  inflector.version = '1.12.0';

  return inflector;
}));

},{}]},{},[28])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmpzIiwibGliL0Nsb3NpbmdQcm9tcC5qcyIsImxpYi9DbWRGaW5kZXIuanMiLCJsaWIvQ21kSW5zdGFuY2UuanMiLCJsaWIvQ29kZXdhdmUuanMiLCJsaWIvQ29tbWFuZC5qcyIsImxpYi9Db250ZXh0LmpzIiwibGliL0VkaXRDbWRQcm9wLmpzIiwibGliL0VkaXRvci5qcyIsImxpYi9Mb2dnZXIuanMiLCJsaWIvT3B0aW9uT2JqZWN0LmpzIiwibGliL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsImxpYi9Qcm9jZXNzLmpzIiwibGliL1N0b3JhZ2UuanMiLCJsaWIvVGV4dEFyZWFFZGl0b3IuanMiLCJsaWIvVGV4dFBhcnNlci5qcyIsImxpYi9ib290c3RyYXAuanMiLCJsaWIvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwibGliL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXIuanMiLCJsaWIvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1BocENvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZC5qcyIsImxpYi9kZXRlY3RvcnMvRGV0ZWN0b3IuanMiLCJsaWIvZGV0ZWN0b3JzL0xhbmdEZXRlY3Rvci5qcyIsImxpYi9kZXRlY3RvcnMvUGFpckRldGVjdG9yLmpzIiwibGliL2VudHJ5LmpzIiwibGliL2hlbHBlcnMvQXJyYXlIZWxwZXIuanMiLCJsaWIvaGVscGVycy9Db21tb25IZWxwZXIuanMiLCJsaWIvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCJsaWIvaGVscGVycy9PcHRpb25hbFByb21pc2UuanMiLCJsaWIvaGVscGVycy9QYXRoSGVscGVyLmpzIiwibGliL2hlbHBlcnMvU3RyaW5nSGVscGVyLmpzIiwibGliL3Bvc2l0aW9uaW5nL1BhaXIuanMiLCJsaWIvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwibGliL3Bvc2l0aW9uaW5nL1Bvcy5qcyIsImxpYi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmpzIiwibGliL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwibGliL3Bvc2l0aW9uaW5nL1NpemUuanMiLCJsaWIvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwibGliL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCJsaWIvcG9zaXRpb25pbmcvV3JhcHBpbmcuanMiLCJsaWIvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIiwibGliL3N0cmluZ1BhcnNlcnMvQ29udGV4dC5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL0VzY2FwZUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9OYW1lZENvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlci5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL1N0cmluZ0NvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9WYXJpYWJsZUNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvaW5mbGVjdGlvbi9saWIvaW5mbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDRUEsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUFELENBQTVCOztBQUVBLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyx1QkFBRCxDQUEzQjs7QUFFQSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsb0JBQUQsQ0FBcEI7O0FBRUEsSUFBSSxTQUFTO0FBQUE7QUFBQTtBQUNYLHFCQUFZLE9BQVosRUFBbUM7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFDakMsUUFBSSxHQUFKLEVBQVMsR0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZShcIi4vaGVscGVycy9TdHJpbmdIZWxwZXJcIik7XG5cbmNvbnN0IEFycmF5SGVscGVyID0gcmVxdWlyZShcIi4vaGVscGVycy9BcnJheUhlbHBlclwiKTtcblxuY29uc3QgUGFpciA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1BhaXJcIik7XG5cbnZhciBCb3hIZWxwZXIgPSBjbGFzcyBCb3hIZWxwZXIge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIga2V5LCByZWYsIHZhbDtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBkZWNvOiB0aGlzLmNvbnRleHQuY29kZXdhdmUuZGVjbyxcbiAgICAgIHBhZDogMixcbiAgICAgIHdpZHRoOiA1MCxcbiAgICAgIGhlaWdodDogMyxcbiAgICAgIG9wZW5UZXh0OiAnJyxcbiAgICAgIGNsb3NlVGV4dDogJycsXG4gICAgICBwcmVmaXg6ICcnLFxuICAgICAgc3VmZml4OiAnJyxcbiAgICAgIGluZGVudDogMFxuICAgIH07XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvbmUodGV4dCkge1xuICAgIHZhciBrZXksIG9wdCwgcmVmLCB2YWw7XG4gICAgb3B0ID0ge307XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQsIG9wdCk7XG4gIH1cblxuICBkcmF3KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydFNlcCgpICsgXCJcXG5cIiArIHRoaXMubGluZXModGV4dCkgKyBcIlxcblwiICsgdGhpcy5lbmRTZXAoKTtcbiAgfVxuXG4gIHdyYXBDb21tZW50KHN0cikge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnQoc3RyKTtcbiAgfVxuXG4gIHNlcGFyYXRvcigpIHtcbiAgICB2YXIgbGVuO1xuICAgIGxlbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmRlY29MaW5lKGxlbikpO1xuICB9XG5cbiAgc3RhcnRTZXAoKSB7XG4gICAgdmFyIGxuO1xuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5vcGVuVGV4dC5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy53cmFwQ29tbWVudCh0aGlzLm9wZW5UZXh0ICsgdGhpcy5kZWNvTGluZShsbikpO1xuICB9XG5cbiAgZW5kU2VwKCkge1xuICAgIHZhciBsbjtcbiAgICBsbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aCAtIHRoaXMuY2xvc2VUZXh0Lmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmNsb3NlVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKSArIHRoaXMuc3VmZml4O1xuICB9XG5cbiAgZGVjb0xpbmUobGVuKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgodGhpcy5kZWNvLCBsZW4pO1xuICB9XG5cbiAgcGFkZGluZygpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLlN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy5wYWQpO1xuICB9XG5cbiAgbGluZXModGV4dCA9ICcnLCB1cHRvSGVpZ2h0ID0gdHJ1ZSkge1xuICAgIHZhciBsLCBsaW5lcywgeDtcbiAgICB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKTtcblxuICAgIGlmICh1cHRvSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaSwgcmVmLCByZXN1bHRzO1xuICAgICAgICByZXN1bHRzID0gW107XG5cbiAgICAgICAgZm9yICh4ID0gaSA9IDAsIHJlZiA9IHRoaXMuaGVpZ2h0OyAwIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWY7IHggPSAwIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobGluZXNbeF0gfHwgJycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfS5jYWxsKHRoaXMpLmpvaW4oJ1xcbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaSwgbGVuMSwgcmVzdWx0cztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbjEgPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW4xOyBpKyspIHtcbiAgICAgICAgICBsID0gbGluZXNbaV07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0uY2FsbCh0aGlzKS5qb2luKCdcXG4nKTtcbiAgICB9XG4gIH1cblxuICBsaW5lKHRleHQgPSAnJykge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLmluZGVudCkgKyB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpICsgdGV4dCArIFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMud2lkdGggLSB0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyB0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbyk7XG4gIH1cblxuICBsZWZ0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpKTtcbiAgfVxuXG4gIHJpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbyk7XG4gIH1cblxuICByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpO1xuICB9XG5cbiAgdGV4dEJvdW5kcyh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIuZ2V0VHh0U2l6ZSh0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpKTtcbiAgfVxuXG4gIGdldEJveEZvclBvcyhwb3MpIHtcbiAgICB2YXIgY2xvbmUsIGN1ckxlZnQsIGRlcHRoLCBlbmRGaW5kLCBsZWZ0LCBwYWlyLCBwbGFjZWhvbGRlciwgcmVzLCBzdGFydEZpbmQ7XG4gICAgZGVwdGggPSB0aGlzLmdldE5lc3RlZEx2bChwb3Muc3RhcnQpO1xuXG4gICAgaWYgKGRlcHRoID4gMCkge1xuICAgICAgbGVmdCA9IHRoaXMubGVmdCgpO1xuICAgICAgY3VyTGVmdCA9IFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIucmVwZWF0KGxlZnQsIGRlcHRoIC0gMSk7XG4gICAgICBjbG9uZSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiO1xuICAgICAgY2xvbmUud2lkdGggPSBwbGFjZWhvbGRlci5sZW5ndGg7XG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IHRoaXMuZGVjbyArIHRoaXMuZGVjbyArIHBsYWNlaG9sZGVyICsgdGhpcy5kZWNvICsgdGhpcy5kZWNvO1xuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCAnLionKSk7XG4gICAgICBlbmRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwgJy4qJykpO1xuICAgICAgcGFpciA9IG5ldyBQYWlyLlBhaXIoc3RhcnRGaW5kLCBlbmRGaW5kLCB7XG4gICAgICAgIHZhbGlkTWF0Y2g6IG1hdGNoID0+IHtcbiAgICAgICAgICB2YXIgZjsgLy8gY29uc29sZS5sb2cobWF0Y2gsbGVmdClcblxuICAgICAgICAgIGYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQobWF0Y2guc3RhcnQoKSwgW2xlZnQsIFwiXFxuXCIsIFwiXFxyXCJdLCAtMSk7XG4gICAgICAgICAgcmV0dXJuIGYgPT0gbnVsbCB8fCBmLnN0ciAhPT0gbGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXMgPSBwYWlyLndyYXBwZXJQb3MocG9zLCB0aGlzLmNvbnRleHQuY29kZXdhdmUuZWRpdG9yLnRleHQoKSk7XG5cbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGg7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TmVzdGVkTHZsKGluZGV4KSB7XG4gICAgdmFyIGRlcHRoLCBmLCBsZWZ0O1xuICAgIGRlcHRoID0gMDtcbiAgICBsZWZ0ID0gdGhpcy5sZWZ0KCk7XG5cbiAgICB3aGlsZSAoKGYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQoaW5kZXgsIFtsZWZ0LCBcIlxcblwiLCBcIlxcclwiXSwgLTEpKSAhPSBudWxsICYmIGYuc3RyID09PSBsZWZ0KSB7XG4gICAgICBpbmRleCA9IGYucG9zO1xuICAgICAgZGVwdGgrKztcbiAgICB9XG5cbiAgICByZXR1cm4gZGVwdGg7XG4gIH1cblxuICBnZXRPcHRGcm9tTGluZShsaW5lLCBnZXRQYWQgPSB0cnVlKSB7XG4gICAgdmFyIGVuZFBvcywgckVuZCwgclN0YXJ0LCByZXNFbmQsIHJlc1N0YXJ0LCBzdGFydFBvcztcbiAgICByU3RhcnQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIgKyBTdHJpbmdIZWxwZXIuU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbykpICsgXCIpKFxcXFxzKilcIik7XG4gICAgckVuZCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIiArIFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMuZGVjbykpICsgXCIpKFxcbnwkKVwiKTtcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpO1xuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKTtcblxuICAgIGlmIChyZXNTdGFydCAhPSBudWxsICYmIHJlc0VuZCAhPSBudWxsKSB7XG4gICAgICBpZiAoZ2V0UGFkKSB7XG4gICAgICAgIHRoaXMucGFkID0gTWF0aC5taW4ocmVzU3RhcnRbM10ubGVuZ3RoLCByZXNFbmRbMV0ubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGg7XG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgdGhpcy5wYWQ7XG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gdGhpcy5wYWQ7XG4gICAgICB0aGlzLndpZHRoID0gZW5kUG9zIC0gc3RhcnRQb3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWZvcm1hdExpbmVzKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzKHRoaXMucmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zKSwgZmFsc2UpO1xuICB9XG5cbiAgcmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGVjbCwgZWNyLCBlZCwgZmxhZywgb3B0LCByZTEsIHJlMjtcblxuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH07XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpO1xuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLlN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSk7XG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuZGVjbyk7XG4gICAgICBmbGFnID0gb3B0aW9uc1snbXVsdGlsaW5lJ10gPyAnZ20nIDogJyc7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzezAsJHt0aGlzLnBhZH19YCwgZmxhZyk7XG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBcXFxccyooPzoke2VkfSkqJHtlY3J9XFxcXHMqJGAsIGZsYWcpO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsICcnKS5yZXBsYWNlKHJlMiwgJycpO1xuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5Cb3hIZWxwZXIgPSBCb3hIZWxwZXI7XG5cbiIsIlxuXG5jb25zdCBQb3NDb2xsZWN0aW9uID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvblwiKTtcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudFwiKTtcblxuY29uc3QgUG9zID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvUG9zXCIpO1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKFwiLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZVwiKTtcblxudmFyIENsb3NpbmdQcm9tcCA9IGNsYXNzIENsb3NpbmdQcm9tcCB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlMSwgc2VsZWN0aW9ucykge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTE7XG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLl90eXBlZCA9IG51bGw7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5uYkNoYW5nZXMgPSAwO1xuICAgIHRoaXMuc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uLlBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucyk7XG4gIH1cblxuICBiZWdpbigpIHtcbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgIHJldHVybiAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkodGhpcy5hZGRDYXJyZXRzKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuZWRpdG9yLmNhbkxpc3RlblRvQ2hhbmdlKCkpIHtcbiAgICAgICAgdGhpcy5wcm94eU9uQ2hhbmdlID0gKGNoID0gbnVsbCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQ2hhbmdlKGNoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KS5yZXN1bHQoKTtcbiAgfVxuXG4gIGFkZENhcnJldHMoKSB7XG4gICAgdGhpcy5yZXBsYWNlbWVudHMgPSB0aGlzLnNlbGVjdGlvbnMud3JhcCh0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyBcIlxcblwiLCBcIlxcblwiICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMpLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAuY2FycmV0VG9TZWwoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHModGhpcy5yZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgaW52YWxpZFR5cGVkKCkge1xuICAgIHJldHVybiB0aGlzLl90eXBlZCA9IG51bGw7XG4gIH1cblxuICBvbkNoYW5nZShjaCA9IG51bGwpIHtcbiAgICB0aGlzLmludmFsaWRUeXBlZCgpO1xuXG4gICAgaWYgKHRoaXMuc2tpcEV2ZW50KGNoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubmJDaGFuZ2VzKys7XG5cbiAgICBpZiAodGhpcy5zaG91bGRTdG9wKCkpIHtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYW5DbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bWUoKTtcbiAgICB9XG4gIH1cblxuICBza2lwRXZlbnQoY2gpIHtcbiAgICByZXR1cm4gY2ggIT0gbnVsbCAmJiBjaC5jaGFyQ29kZUF0KDApICE9PSAzMjtcbiAgfVxuXG4gIHJlc3VtZSgpIHt9XG5cbiAgc2hvdWxkU3RvcCgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlZCgpID09PSBmYWxzZSB8fCB0aGlzLnR5cGVkKCkuaW5kZXhPZignICcpICE9PSAtMTtcbiAgfVxuXG4gIGNsZWFuQ2xvc2UoKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCBwb3MsIHJlcGwsIHJlcGxhY2VtZW50cywgcmVzLCBzZWwsIHNlbGVjdGlvbnMsIHN0YXJ0O1xuICAgIHJlcGxhY2VtZW50cyA9IFtdO1xuICAgIHNlbGVjdGlvbnMgPSB0aGlzLmdldFNlbGVjdGlvbnMoKTtcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNlbGVjdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNlbCA9IHNlbGVjdGlvbnNbal07XG5cbiAgICAgIGlmIChwb3MgPSB0aGlzLndoaXRoaW5PcGVuQm91bmRzKHNlbCkpIHtcbiAgICAgICAgc3RhcnQgPSBzZWw7XG4gICAgICB9IGVsc2UgaWYgKChlbmQgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSAmJiBzdGFydCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IGVuZC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS5pbm5lclRleHQoKS5zcGxpdCgnICcpWzBdO1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50LlJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LCBlbmQuaW5uZXJFbmQsIHJlcyk7XG4gICAgICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtzdGFydF07XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKHJlcGwpO1xuICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxuICBnZXRTZWxlY3Rpb25zKCkge1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRNdWx0aVNlbCgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID09PSB0aGlzKSB7XG4gICAgICB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJveHlPbkNoYW5nZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5wcm94eU9uQ2hhbmdlKTtcbiAgICB9XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMudHlwZWQoKSAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuY2FuY2VsU2VsZWN0aW9ucyh0aGlzLmdldFNlbGVjdGlvbnMoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgY2FuY2VsU2VsZWN0aW9ucyhzZWxlY3Rpb25zKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCBwb3MsIHJlcGxhY2VtZW50cywgc2VsLCBzdGFydDtcbiAgICByZXBsYWNlbWVudHMgPSBbXTtcbiAgICBzdGFydCA9IG51bGw7XG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdO1xuXG4gICAgICBpZiAocG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpKSB7XG4gICAgICAgIHN0YXJ0ID0gcG9zO1xuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgc3RhcnQgIT0gbnVsbCkge1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXcgUmVwbGFjZW1lbnQuUmVwbGFjZW1lbnQoc3RhcnQuc3RhcnQsIGVuZC5lbmQsIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoc3RhcnQuZW5kICsgMSwgZW5kLnN0YXJ0IC0gMSkpLnNlbGVjdENvbnRlbnQoKSk7XG4gICAgICAgIHN0YXJ0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIHR5cGVkKCkge1xuICAgIHZhciBjcG9zLCBpbm5lckVuZCwgaW5uZXJTdGFydDtcblxuICAgIGlmICh0aGlzLl90eXBlZCA9PSBudWxsKSB7XG4gICAgICBjcG9zID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCk7XG4gICAgICBpbm5lclN0YXJ0ID0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoO1xuXG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PT0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgJiYgKGlubmVyRW5kID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChpbm5lclN0YXJ0KSkgIT0gbnVsbCAmJiBpbm5lckVuZCA+PSBjcG9zLmVuZCkge1xuICAgICAgICB0aGlzLl90eXBlZCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdHlwZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdHlwZWQ7XG4gIH1cblxuICB3aGl0aGluT3BlbkJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcblxuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5zdGFydFBvc0F0KGkpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcblxuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHJlcGwsIHRhcmdldFBvcywgdGFyZ2V0VGV4dDtcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcblxuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5lbmRQb3NBdChpKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcblxuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXJ0UG9zQXQoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcy5Qb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSkpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMsIHRoaXMuY29kZXdhdmUuYnJha2V0cyk7XG4gIH1cblxuICBlbmRQb3NBdChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zLlBvcyh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5zdGFydCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMikpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciwgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKTtcbiAgfVxuXG59O1xuZXhwb3J0cy5DbG9zaW5nUHJvbXAgPSBDbG9zaW5nUHJvbXA7XG52YXIgU2ltdWxhdGVkQ2xvc2luZ1Byb21wID0gY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wIHtcbiAgcmVzdW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNpbXVsYXRlVHlwZSgpO1xuICB9XG5cbiAgc2ltdWxhdGVUeXBlKCkge1xuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdmFyIGN1ckNsb3NlLCByZXBsLCB0YXJnZXRUZXh0O1xuICAgICAgdGhpcy5pbnZhbGlkVHlwZWQoKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIGN1ckNsb3NlID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHModGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXS5jb3B5KCkuYXBwbHlPZmZzZXQodGhpcy50eXBlZCgpLmxlbmd0aCkpO1xuXG4gICAgICBpZiAoY3VyQ2xvc2UpIHtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudC5SZXBsYWNlbWVudChjdXJDbG9zZS5zdGFydCwgY3VyQ2xvc2UuZW5kLCB0YXJnZXRUZXh0KTtcblxuICAgICAgICBpZiAocmVwbC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS5uZWNlc3NhcnkoKSkge1xuICAgICAgICAgIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKFtyZXBsXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vblR5cGVTaW11bGF0ZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vblR5cGVTaW11bGF0ZWQoKTtcbiAgICAgIH1cbiAgICB9LCAyKTtcbiAgfVxuXG4gIHNraXBFdmVudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRTZWxlY3Rpb25zKCkge1xuICAgIHJldHVybiBbdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCksIHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0gKyB0aGlzLnR5cGVkKCkubGVuZ3RoXTtcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyhwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXh0LCByZWYsIHJlcGwsIHRhcmdldFBvcztcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50cztcblxuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldO1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5lbmRQb3NBdChpKTtcbiAgICAgIG5leHQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KTtcblxuICAgICAgaWYgKG5leHQgIT0gbnVsbCkge1xuICAgICAgICB0YXJnZXRQb3MubW92ZVN1ZmZpeChuZXh0KTtcblxuICAgICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSkge1xuICAgICAgICAgIHJldHVybiB0YXJnZXRQb3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxufTtcbmV4cG9ydHMuU2ltdWxhdGVkQ2xvc2luZ1Byb21wID0gU2ltdWxhdGVkQ2xvc2luZ1Byb21wO1xuXG5DbG9zaW5nUHJvbXAubmV3Rm9yID0gZnVuY3Rpb24gKGNvZGV3YXZlLCBzZWxlY3Rpb25zKSB7XG4gIGlmIChjb2Rld2F2ZS5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgcmV0dXJuIG5ldyBDbG9zaW5nUHJvbXAoY29kZXdhdmUsIHNlbGVjdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKTtcbiAgfVxufTtcblxuIiwiXG5cbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKFwiLi9Db250ZXh0XCIpO1xuXG5jb25zdCBOYW1lc3BhY2VIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlclwiKTtcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuL0NvbW1hbmRcIik7XG5cbnZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcbnZhciBDbWRGaW5kZXIgPSBjbGFzcyBDbWRGaW5kZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lcywgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG5cbiAgICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdO1xuICAgIH1cblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgbmFtZXNwYWNlczogW10sXG4gICAgICBwYXJlbnRDb250ZXh0OiBudWxsLFxuICAgICAgY29udGV4dDogbnVsbCxcbiAgICAgIHJvb3Q6IENvbW1hbmQuQ29tbWFuZC5jbWRzLFxuICAgICAgbXVzdEV4ZWN1dGU6IHRydWUsXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWUsXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWUsXG4gICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfTtcbiAgICB0aGlzLm5hbWVzID0gbmFtZXM7XG4gICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcblxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsICYmIGtleSAhPT0gJ3BhcmVudCcpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0LkNvbnRleHQodGhpcy5jb2Rld2F2ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50Q29udGV4dCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5wYXJlbnRDb250ZXh0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLm5hbWVzcGFjZXMgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0LmFkZE5hbWVzcGFjZXModGhpcy5uYW1lc3BhY2VzKTtcbiAgICB9XG4gIH1cblxuICBmaW5kKCkge1xuICAgIHRoaXMudHJpZ2dlckRldGVjdG9ycygpO1xuICAgIHRoaXMuY21kID0gdGhpcy5maW5kSW4odGhpcy5yb290KTtcbiAgICByZXR1cm4gdGhpcy5jbWQ7XG4gIH0gLy8gIGdldFBvc2liaWxpdGllczogLT5cbiAgLy8gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAvLyAgICBwYXRoID0gbGlzdChAcGF0aClcbiAgLy8gICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcblxuXG4gIGdldE5hbWVzV2l0aFBhdGhzKCkge1xuICAgIHZhciBqLCBsZW4sIG5hbWUsIHBhdGhzLCByZWYsIHJlc3QsIHNwYWNlO1xuICAgIHBhdGhzID0ge307XG4gICAgcmVmID0gdGhpcy5uYW1lcztcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmFtZSA9IHJlZltqXTtcbiAgICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSk7XG5cbiAgICAgIGlmIChzcGFjZSAhPSBudWxsICYmICEoaW5kZXhPZi5jYWxsKHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHNwYWNlKSA+PSAwKSkge1xuICAgICAgICBpZiAoIShzcGFjZSBpbiBwYXRocykpIHtcbiAgICAgICAgICBwYXRoc1tzcGFjZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXRocztcbiAgfVxuXG4gIGFwcGx5U3BhY2VPbk5hbWVzKG5hbWVzcGFjZSkge1xuICAgIHZhciByZXN0LCBzcGFjZTtcbiAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLk5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMubmFtZXMubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgY3VyX3Jlc3QsIGN1cl9zcGFjZTtcbiAgICAgIFtjdXJfc3BhY2UsIGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5OYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKTtcblxuICAgICAgaWYgKGN1cl9zcGFjZSAhPSBudWxsICYmIGN1cl9zcGFjZSA9PT0gc3BhY2UpIHtcbiAgICAgICAgbmFtZSA9IGN1cl9yZXN0O1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdCAhPSBudWxsKSB7XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXREaXJlY3ROYW1lcygpIHtcbiAgICB2YXIgbjtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgcmVmID0gdGhpcy5uYW1lcztcbiAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIG4gPSByZWZbal07XG5cbiAgICAgICAgaWYgKG4uaW5kZXhPZihcIjpcIikgPT09IC0xKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0uY2FsbCh0aGlzKTtcbiAgfVxuXG4gIHRyaWdnZXJEZXRlY3RvcnMoKSB7XG4gICAgdmFyIGNtZCwgZGV0ZWN0b3IsIGksIGosIGxlbiwgcG9zaWJpbGl0aWVzLCByZWYsIHJlcywgcmVzdWx0cztcblxuICAgIGlmICh0aGlzLnVzZURldGVjdG9ycykge1xuICAgICAgdGhpcy51c2VEZXRlY3RvcnMgPSBmYWxzZTtcbiAgICAgIHBvc2liaWxpdGllcyA9IFt0aGlzLnJvb3RdLmNvbmNhdChuZXcgQ21kRmluZGVyKHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHtcbiAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICBtdXN0RXhlY3V0ZTogZmFsc2UsXG4gICAgICAgIHVzZUZhbGxiYWNrczogZmFsc2VcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgICBpID0gMDtcbiAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgd2hpbGUgKGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoKSB7XG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXTtcbiAgICAgICAgcmVmID0gY21kLmRldGVjdG9ycztcblxuICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICBkZXRlY3RvciA9IHJlZltqXTtcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcyk7XG5cbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcyk7XG4gICAgICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIocmVzLCB7XG4gICAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICAgICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdHMucHVzaChpKyspO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICBmaW5kSW4oY21kLCBwYXRoID0gbnVsbCkge1xuICAgIHZhciBiZXN0O1xuXG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBiZXN0ID0gdGhpcy5iZXN0SW5Qb3NpYmlsaXRpZXModGhpcy5maW5kUG9zaWJpbGl0aWVzKCkpO1xuXG4gICAgaWYgKGJlc3QgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgfVxuICB9XG5cbiAgZmluZFBvc2liaWxpdGllcygpIHtcbiAgICB2YXIgZGlyZWN0LCBmYWxsYmFjaywgaiwgaywgbGVuLCBsZW4xLCBuYW1lLCBuYW1lcywgbnNwYywgbnNwY05hbWUsIHBvc2liaWxpdGllcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZXN0LCBzcGFjZTtcblxuICAgIGlmICh0aGlzLnJvb3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHRoaXMucm9vdC5pbml0KCk7XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG5cbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gKHJlZjEgPSByZWYuaW5JbnN0YW5jZSkgIT0gbnVsbCA/IHJlZjEuY21kIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gdGhpcy5yb290KSB7XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoJ2luX2luc3RhbmNlJykpO1xuICAgIH1cblxuICAgIHJlZjIgPSB0aGlzLmdldE5hbWVzV2l0aFBhdGhzKCk7XG5cbiAgICBmb3IgKHNwYWNlIGluIHJlZjIpIHtcbiAgICAgIG5hbWVzID0gcmVmMltzcGFjZV07XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoc3BhY2UsIG5hbWVzKSk7XG4gICAgfVxuXG4gICAgcmVmMyA9IHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCk7XG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuc3BjID0gcmVmM1tqXTtcbiAgICAgIFtuc3BjTmFtZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobnNwYywgdHJ1ZSk7XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQobnNwY05hbWUsIHRoaXMuYXBwbHlTcGFjZU9uTmFtZXMobnNwYykpKTtcbiAgICB9XG5cbiAgICByZWY0ID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuXG4gICAgZm9yIChrID0gMCwgbGVuMSA9IHJlZjQubGVuZ3RoOyBrIDwgbGVuMTsgaysrKSB7XG4gICAgICBuYW1lID0gcmVmNFtrXTtcbiAgICAgIGRpcmVjdCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSk7XG5cbiAgICAgIGlmICh0aGlzLmNtZElzVmFsaWQoZGlyZWN0KSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnVzZUZhbGxiYWNrcykge1xuICAgICAgZmFsbGJhY2sgPSB0aGlzLnJvb3QuZ2V0Q21kKCdmYWxsYmFjaycpO1xuXG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGZhbGxiYWNrKSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjayk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXM7XG4gICAgcmV0dXJuIHBvc2liaWxpdGllcztcbiAgfVxuXG4gIGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKGNtZE5hbWUsIG5hbWVzID0gdGhpcy5uYW1lcykge1xuICAgIHZhciBqLCBsZW4sIG5leHQsIG5leHRzLCBwb3NpYmlsaXRpZXM7XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG4gICAgbmV4dHMgPSB0aGlzLmdldENtZEZvbGxvd0FsaWFzKGNtZE5hbWUpO1xuXG4gICAgZm9yIChqID0gMCwgbGVuID0gbmV4dHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5leHQgPSBuZXh0c1tqXTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIHJvb3Q6IG5leHRcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc2liaWxpdGllcztcbiAgfVxuXG4gIGdldENtZEZvbGxvd0FsaWFzKG5hbWUpIHtcbiAgICB2YXIgY21kO1xuICAgIGNtZCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSk7XG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KCk7XG5cbiAgICAgIGlmIChjbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbY21kLCBjbWQuZ2V0QWxpYXNlZCgpXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFtjbWRdO1xuICAgIH1cblxuICAgIHJldHVybiBbY21kXTtcbiAgfVxuXG4gIGNtZElzVmFsaWQoY21kKSB7XG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGNtZC5uYW1lICE9PSAnZmFsbGJhY2snICYmIGluZGV4T2YuY2FsbCh0aGlzLmFuY2VzdG9ycygpLCBjbWQpID49IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gIXRoaXMubXVzdEV4ZWN1dGUgfHwgdGhpcy5jbWRJc0V4ZWN1dGFibGUoY21kKTtcbiAgfVxuXG4gIGFuY2VzdG9ycygpIHtcbiAgICB2YXIgcmVmO1xuXG4gICAgaWYgKCgocmVmID0gdGhpcy5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjbWRJc0V4ZWN1dGFibGUoY21kKSB7XG4gICAgdmFyIG5hbWVzO1xuICAgIG5hbWVzID0gdGhpcy5nZXREaXJlY3ROYW1lcygpO1xuXG4gICAgaWYgKG5hbWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZXNbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGUoKTtcbiAgICB9XG4gIH1cblxuICBjbWRTY29yZShjbWQpIHtcbiAgICB2YXIgc2NvcmU7XG4gICAgc2NvcmUgPSBjbWQuZGVwdGg7XG5cbiAgICBpZiAoY21kLm5hbWUgPT09ICdmYWxsYmFjaycpIHtcbiAgICAgIHNjb3JlIC09IDEwMDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjb3JlO1xuICB9XG5cbiAgYmVzdEluUG9zaWJpbGl0aWVzKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlO1xuXG4gICAgaWYgKHBvc3MubGVuZ3RoID4gMCkge1xuICAgICAgYmVzdCA9IG51bGw7XG4gICAgICBiZXN0U2NvcmUgPSBudWxsO1xuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBwb3NzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSBwb3NzW2pdO1xuICAgICAgICBzY29yZSA9IHRoaXMuY21kU2NvcmUocCk7XG5cbiAgICAgICAgaWYgKGJlc3QgPT0gbnVsbCB8fCBzY29yZSA+PSBiZXN0U2NvcmUpIHtcbiAgICAgICAgICBiZXN0U2NvcmUgPSBzY29yZTtcbiAgICAgICAgICBiZXN0ID0gcDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gIH1cblxufTtcbmV4cG9ydHMuQ21kRmluZGVyID0gQ21kRmluZGVyO1xuXG4iLCJcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIik7XG5cbmNvbnN0IENvZGV3YXZlID0gcmVxdWlyZShcIi4vQ29kZXdhdmVcIik7XG5cbmNvbnN0IFRleHRQYXJzZXIgPSByZXF1aXJlKFwiLi9UZXh0UGFyc2VyXCIpO1xuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL1N0cmluZ0hlbHBlclwiKTtcblxuY29uc3QgT3B0aW9uYWxQcm9taXNlID0gcmVxdWlyZShcIi4vaGVscGVycy9PcHRpb25hbFByb21pc2VcIik7XG5cbnZhciBDbWRJbnN0YW5jZSA9IGNsYXNzIENtZEluc3RhbmNlIHtcbiAgY29uc3RydWN0b3IoY21kMSwgY29udGV4dCkge1xuICAgIHRoaXMuY21kID0gY21kMTtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoISh0aGlzLmlzRW1wdHkoKSB8fCB0aGlzLmluaXRlZCkpIHtcbiAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcblxuICAgICAgdGhpcy5fZ2V0Q21kT2JqKCk7XG5cbiAgICAgIHRoaXMuX2luaXRQYXJhbXMoKTtcblxuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbWRPYmouaW5pdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0UGFyYW0obmFtZSwgdmFsKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSB2YWw7XG4gIH1cblxuICBwdXNoUGFyYW0odmFsKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnB1c2godmFsKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dC5Db250ZXh0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCBuZXcgQ29udGV4dC5Db250ZXh0KCk7XG4gIH1cblxuICBnZXRGaW5kZXIoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXI7XG4gICAgZmluZGVyID0gdGhpcy5nZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pO1xuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXM7XG4gICAgcmV0dXJuIGZpbmRlcjtcbiAgfVxuXG4gIF9nZXRDbWRPYmooKSB7XG4gICAgdmFyIGNtZDtcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNtZC5pbml0KCk7XG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWQoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG5cbiAgICAgIGlmIChjbWQuY2xzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9pbml0UGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWVkID0gdGhpcy5nZXREZWZhdWx0cygpO1xuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5jbWQgIT0gbnVsbDtcbiAgfVxuXG4gIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgIHZhciBhbGlhc2VkO1xuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuXG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKTtcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jbWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXREZWZhdWx0cygpIHtcbiAgICB2YXIgYWxpYXNlZCwgcmVzO1xuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJlcyA9IHt9O1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCBhbGlhc2VkLmdldERlZmF1bHRzKCkpO1xuICAgICAgfVxuXG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5jbWQuZGVmYXVsdHMpO1xuXG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5jbWRPYmouZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cblxuICBnZXRBbGlhc2VkKCkge1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkQ21kID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5nZXRBbGlhc2VkRmluYWwoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZENtZCB8fCBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWRGaW5hbCgpIHtcbiAgICB2YXIgYWxpYXNlZDtcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkRmluYWxDbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGlhc2VkRmluYWxDbWQgfHwgbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY21kLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBhbGlhc2VkID0gdGhpcy5jbWQ7XG5cbiAgICAgICAgd2hpbGUgKGFsaWFzZWQgIT0gbnVsbCAmJiBhbGlhc2VkLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcih0aGlzLmdldEZpbmRlcih0aGlzLmFsdGVyQWxpYXNPZihhbGlhc2VkLmFsaWFzT2YpKSk7XG5cbiAgICAgICAgICBpZiAodGhpcy5hbGlhc2VkQ21kID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuYWxpYXNlZENtZCA9IGFsaWFzZWQgfHwgZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIHx8IGZhbHNlO1xuICAgICAgICByZXR1cm4gYWxpYXNlZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhbHRlckFsaWFzT2YoYWxpYXNPZikge1xuICAgIHJldHVybiBhbGlhc09mO1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICB2YXIgb3B0O1xuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPcHRpb25zO1xuICAgICAgfVxuXG4gICAgICBvcHQgPSB0aGlzLmNtZC5fb3B0aW9uc0ZvckFsaWFzZWQodGhpcy5nZXRBbGlhc2VkKCkpO1xuXG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5jbWRPYmouZ2V0T3B0aW9ucygpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbWRPcHRpb25zID0gb3B0O1xuICAgICAgcmV0dXJuIG9wdDtcbiAgICB9XG4gIH1cblxuICBnZXRPcHRpb24oa2V5KSB7XG4gICAgdmFyIG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuXG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCAmJiBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICBnZXRQYXJhbShuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBpLCBsZW4sIG4sIHJlZjtcblxuICAgIGlmICgocmVmID0gdHlwZW9mIG5hbWVzKSA9PT0gJ3N0cmluZycgfHwgcmVmID09PSAnbnVtYmVyJykge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IG5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBuID0gbmFtZXNbaV07XG5cbiAgICAgIGlmICh0aGlzLm5hbWVkW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbl07XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnBhcmFtc1tuXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtc1tuXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmVmFsO1xuICB9XG5cbiAgZ2V0Qm9vbFBhcmFtKG5hbWVzLCBkZWZWYWwgPSBudWxsKSB7XG4gICAgdmFyIGZhbHNlVmFscywgdmFsO1xuICAgIGZhbHNlVmFscyA9IFtcIlwiLCBcIjBcIiwgXCJmYWxzZVwiLCBcIm5vXCIsIFwibm9uZVwiLCBmYWxzZSwgbnVsbCwgMF07XG4gICAgdmFsID0gdGhpcy5nZXRQYXJhbShuYW1lcywgZGVmVmFsKTtcbiAgICByZXR1cm4gIWZhbHNlVmFscy5pbmNsdWRlcyh2YWwpO1xuICB9XG5cbiAgYW5jZXN0b3JDbWRzKCkge1xuICAgIHZhciByZWY7XG5cbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUpICE9IG51bGwgPyByZWYuaW5JbnN0YW5jZSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBhbmNlc3RvckNtZHNBbmRTZWxmKCkge1xuICAgIHJldHVybiB0aGlzLmFuY2VzdG9yQ21kcygpLmNvbmNhdChbdGhpcy5jbWRdKTtcbiAgfVxuXG4gIHJ1bkV4ZWN1dGVGdW5jdCgpIHtcbiAgICB2YXIgY21kO1xuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5leGVjdXRlKCk7XG4gICAgICB9XG5cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWQ7XG4gICAgICBjbWQuaW5pdCgpO1xuXG4gICAgICBpZiAoY21kLmV4ZWN1dGVGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZUZ1bmN0KHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJhd1Jlc3VsdCgpIHtcbiAgICB2YXIgY21kO1xuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5yZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG5cbiAgICAgIGlmIChjbWQucmVzdWx0RnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY21kLnJlc3VsdFN0ciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0U3RyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB0aGlzLmluaXQoKTtcblxuICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkodGhpcy5yYXdSZXN1bHQoKSkudGhlbihyZXMgPT4ge1xuICAgICAgICB2YXIgYWx0ZXJGdW5jdCwgcGFyc2VyO1xuXG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIHJlcyA9IHRoaXMuZm9ybWF0SW5kZW50KHJlcyk7XG5cbiAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDAgJiYgdGhpcy5nZXRPcHRpb24oJ3BhcnNlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHBhcnNlciA9IHRoaXMuZ2V0UGFyc2VyRm9yVGV4dChyZXMpO1xuICAgICAgICAgICAgcmVzID0gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGFsdGVyRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYWx0ZXJSZXN1bHQnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsIHRoaXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cbiAgICAgIH0pLnJlc3VsdCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldFBhcnNlckZvclRleHQodHh0ID0gJycpIHtcbiAgICB2YXIgcGFyc2VyO1xuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZS5Db2Rld2F2ZShuZXcgVGV4dFBhcnNlci5UZXh0UGFyc2VyKHR4dCksIHtcbiAgICAgIGluSW5zdGFuY2U6IHRoaXNcbiAgICB9KTtcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICByZXR1cm4gcGFyc2VyO1xuICB9XG5cbiAgZ2V0SW5kZW50KCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZm9ybWF0SW5kZW50KHRleHQpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywgJyAgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5SW5kZW50KHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLlN0cmluZ0hlbHBlci5pbmRlbnROb3RGaXJzdCh0ZXh0LCB0aGlzLmdldEluZGVudCgpLCBcIiBcIik7XG4gIH1cblxufTtcbmV4cG9ydHMuQ21kSW5zdGFuY2UgPSBDbWRJbnN0YW5jZTtcblxuIiwiXG5cbmNvbnN0IFByb2Nlc3MgPSByZXF1aXJlKFwiLi9Qcm9jZXNzXCIpO1xuXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZShcIi4vQ29udGV4dFwiKTtcblxuY29uc3QgUG9zaXRpb25lZENtZEluc3RhbmNlID0gcmVxdWlyZShcIi4vUG9zaXRpb25lZENtZEluc3RhbmNlXCIpO1xuXG5jb25zdCBUZXh0UGFyc2VyID0gcmVxdWlyZShcIi4vVGV4dFBhcnNlclwiKTtcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuL0NvbW1hbmRcIik7XG5cbmNvbnN0IExvZ2dlciA9IHJlcXVpcmUoXCIuL0xvZ2dlclwiKTtcblxuY29uc3QgUG9zQ29sbGVjdGlvbiA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb25cIik7XG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvU3RyaW5nSGVscGVyXCIpO1xuXG5jb25zdCBDbG9zaW5nUHJvbXAgPSByZXF1aXJlKFwiLi9DbG9zaW5nUHJvbXBcIik7XG5cbnZhciBDb2Rld2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgY2xhc3MgQ29kZXdhdmUge1xuICAgIGNvbnN0cnVjdG9yKGVkaXRvciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsO1xuICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gICAgICBDb2Rld2F2ZS5pbml0KCk7XG4gICAgICB0aGlzLm1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nO1xuICAgICAgdGhpcy52YXJzID0ge307XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgJ2JyYWtldHMnOiAnfn4nLFxuICAgICAgICAnZGVjbyc6ICd+JyxcbiAgICAgICAgJ2Nsb3NlQ2hhcic6ICcvJyxcbiAgICAgICAgJ25vRXhlY3V0ZUNoYXInOiAnIScsXG4gICAgICAgICdjYXJyZXRDaGFyJzogJ3wnLFxuICAgICAgICAnY2hlY2tDYXJyZXQnOiB0cnVlLFxuICAgICAgICAnaW5JbnN0YW5jZSc6IG51bGxcbiAgICAgIH07XG4gICAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddO1xuICAgICAgdGhpcy5uZXN0ZWQgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQubmVzdGVkICsgMSA6IDA7XG5cbiAgICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG5cbiAgICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwgJiYga2V5ICE9PSAncGFyZW50Jykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmVkaXRvciAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLmJpbmRlZFRvKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dC5Db250ZXh0KHRoaXMpO1xuXG4gICAgICBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMuaW5JbnN0YW5jZS5jb250ZXh0O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIuTG9nZ2VyKCk7XG4gICAgfVxuXG4gICAgb25BY3RpdmF0aW9uS2V5KCkge1xuICAgICAgdGhpcy5wcm9jZXNzID0gbmV3IFByb2Nlc3MuUHJvY2VzcygpO1xuICAgICAgdGhpcy5sb2dnZXIubG9nKCdhY3RpdmF0aW9uIGtleScpO1xuICAgICAgcmV0dXJuIHRoaXMucnVuQXRDdXJzb3JQb3MoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2VzcyA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBydW5BdEN1cnNvclBvcygpIHtcbiAgICAgIGlmICh0aGlzLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuQXRNdWx0aVBvcyh0aGlzLmVkaXRvci5nZXRNdWx0aVNlbCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkF0UG9zKHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBydW5BdFBvcyhwb3MpIHtcbiAgICAgIGlmIChwb3MgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0N1cnNvciBQb3NpdGlvbiBpcyBlbXB0eScpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKFtwb3NdKTtcbiAgICB9XG5cbiAgICBydW5BdE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBjbWQ7XG5cbiAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpO1xuXG4gICAgICAgICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBjbWQuc2V0TXVsdGlQb3MobXVsdGlQb3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbWQuaW5pdCgpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGNtZCk7XG4gICAgICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zWzBdLnN0YXJ0ID09PSBtdWx0aVBvc1swXS5lbmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQnJha2V0cyhtdWx0aVBvcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9tcHRDbG9zaW5nQ21kKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbW1hbmRPblBvcyhwb3MpIHtcbiAgICAgIHZhciBuZXh0LCBwcmV2O1xuXG4gICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuZm9sbG93ZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMSkge1xuICAgICAgICBwcmV2ID0gcG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgbmV4dCA9IHBvcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnByZWNlZGVkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDApIHtcbiAgICAgICAgICBwb3MgLT0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXYgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHBvcyk7XG5cbiAgICAgICAgaWYgKHByZXYgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCA9IHRoaXMuZmluZE5leHRCcmFrZXQocG9zIC0gMSk7XG5cbiAgICAgICAgaWYgKG5leHQgPT0gbnVsbCB8fCB0aGlzLmNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT09IDApIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZS5Qb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgcHJldiwgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwcmV2LCBuZXh0ICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpO1xuICAgIH1cblxuICAgIG5leHRDbWQoc3RhcnQgPSAwKSB7XG4gICAgICB2YXIgYmVnaW5uaW5nLCBmLCBwb3M7XG4gICAgICBwb3MgPSBzdGFydDtcblxuICAgICAgd2hpbGUgKGYgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW3RoaXMuYnJha2V0cywgXCJcXG5cIl0pKSB7XG4gICAgICAgIHBvcyA9IGYucG9zICsgZi5zdHIubGVuZ3RoO1xuXG4gICAgICAgIGlmIChmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBiZWdpbm5pbmcgIT09IFwidW5kZWZpbmVkXCIgJiYgYmVnaW5uaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZS5Qb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgYmVnaW5uaW5nLCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKGJlZ2lubmluZywgZi5wb3MgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJlZ2lubmluZyA9IGYucG9zO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiZWdpbm5pbmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldEVuY2xvc2luZ0NtZChwb3MgPSAwKSB7XG4gICAgICB2YXIgY2xvc2luZ1ByZWZpeCwgY21kLCBjcG9zLCBwO1xuICAgICAgY3BvcyA9IHBvcztcbiAgICAgIGNsb3NpbmdQcmVmaXggPSB0aGlzLmJyYWtldHMgKyB0aGlzLmNsb3NlQ2hhcjtcblxuICAgICAgd2hpbGUgKChwID0gdGhpcy5maW5kTmV4dChjcG9zLCBjbG9zaW5nUHJlZml4KSkgIT0gbnVsbCkge1xuICAgICAgICBpZiAoY21kID0gdGhpcy5jb21tYW5kT25Qb3MocCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoKSkge1xuICAgICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKCk7XG5cbiAgICAgICAgICBpZiAoY21kLnBvcyA8IHBvcykge1xuICAgICAgICAgICAgcmV0dXJuIGNtZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3BvcyA9IHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGgsIHBvcykgPT09IHRoaXMuYnJha2V0cztcbiAgICB9XG5cbiAgICBmb2xsb3dlZEJ5QnJha2V0cyhwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcywgcG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkgPT09IHRoaXMuYnJha2V0cztcbiAgICB9XG5cbiAgICBjb3VudFByZXZCcmFrZXQoc3RhcnQpIHtcbiAgICAgIHZhciBpO1xuICAgICAgaSA9IDA7XG5cbiAgICAgIHdoaWxlICgoc3RhcnQgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHN0YXJ0KSkgIT0gbnVsbCkge1xuICAgICAgICBpKys7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpO1xuICAgIH1cblxuICAgIGlzRW5kTGluZShwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcywgcG9zICsgMSkgPT09IFwiXFxuXCIgfHwgcG9zICsgMSA+PSB0aGlzLmVkaXRvci50ZXh0TGVuKCk7XG4gICAgfVxuXG4gICAgZmluZFByZXZCcmFrZXQoc3RhcnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmROZXh0QnJha2V0KHN0YXJ0LCAtMSk7XG4gICAgfVxuXG4gICAgZmluZE5leHRCcmFrZXQoc3RhcnQsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmO1xuICAgICAgZiA9IHRoaXMuZmluZEFueU5leHQoc3RhcnQsIFt0aGlzLmJyYWtldHMsIFwiXFxuXCJdLCBkaXJlY3Rpb24pO1xuXG4gICAgICBpZiAoZiAmJiBmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgIHJldHVybiBmLnBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldihzdGFydCwgc3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dChzdGFydCwgc3RyaW5nLCAtMSk7XG4gICAgfVxuXG4gICAgZmluZE5leHQoc3RhcnQsIHN0cmluZywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGY7XG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3N0cmluZ10sIGRpcmVjdGlvbik7XG5cbiAgICAgIGlmIChmKSB7XG4gICAgICAgIHJldHVybiBmLnBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIGZpbmRNYXRjaGluZ1BhaXIoc3RhcnRQb3MsIG9wZW5pbmcsIGNsb3NpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmLCBuZXN0ZWQsIHBvcztcbiAgICAgIHBvcyA9IHN0YXJ0UG9zO1xuICAgICAgbmVzdGVkID0gMDtcblxuICAgICAgd2hpbGUgKGYgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW2Nsb3NpbmcsIG9wZW5pbmddLCBkaXJlY3Rpb24pKSB7XG4gICAgICAgIHBvcyA9IGYucG9zICsgKGRpcmVjdGlvbiA+IDAgPyBmLnN0ci5sZW5ndGggOiAwKTtcblxuICAgICAgICBpZiAoZi5zdHIgPT09IChkaXJlY3Rpb24gPiAwID8gY2xvc2luZyA6IG9wZW5pbmcpKSB7XG4gICAgICAgICAgaWYgKG5lc3RlZCA+IDApIHtcbiAgICAgICAgICAgIG5lc3RlZC0tO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmVzdGVkKys7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgYWRkQnJha2V0cyhwb3MpIHtcbiAgICAgIHZhciByZXBsYWNlbWVudHM7XG4gICAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbi5Qb3NDb2xsZWN0aW9uKHBvcyk7XG4gICAgICByZXBsYWNlbWVudHMgPSBwb3Mud3JhcCh0aGlzLmJyYWtldHMsIHRoaXMuYnJha2V0cykubWFwKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHJldHVybiByLnNlbGVjdENvbnRlbnQoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gICAgfVxuXG4gICAgcHJvbXB0Q2xvc2luZ0NtZChzZWxlY3Rpb25zKSB7XG4gICAgICBpZiAodGhpcy5jbG9zaW5nUHJvbXAgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNsb3NpbmdQcm9tcC5zdG9wKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcC5DbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsIHNlbGVjdGlvbnMpLmJlZ2luKCk7XG4gICAgfVxuXG4gICAgcGFyc2VBbGwocmVjdXJzaXZlID0gdHJ1ZSkge1xuICAgICAgdmFyIGNtZCwgcGFyc2VyLCBwb3MsIHJlcztcblxuICAgICAgaWYgKHRoaXMubmVzdGVkID4gMTAwKSB7XG4gICAgICAgIHRocm93IFwiSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb25cIjtcbiAgICAgIH1cblxuICAgICAgcG9zID0gMDtcblxuICAgICAgd2hpbGUgKGNtZCA9IHRoaXMubmV4dENtZChwb3MpKSB7XG4gICAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKTtcbiAgICAgICAgdGhpcy5lZGl0b3Iuc2V0Q3Vyc29yUG9zKHBvcyk7IC8vIGNvbnNvbGUubG9nKGNtZClcblxuICAgICAgICBjbWQuaW5pdCgpO1xuXG4gICAgICAgIGlmIChyZWN1cnNpdmUgJiYgY21kLmNvbnRlbnQgIT0gbnVsbCAmJiAoY21kLmdldENtZCgpID09IG51bGwgfHwgIWNtZC5nZXRPcHRpb24oJ3ByZXZlbnRQYXJzZUFsbCcpKSkge1xuICAgICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlci5UZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge1xuICAgICAgICAgICAgcGFyZW50OiB0aGlzXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY21kLmNvbnRlbnQgPSBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcyA9IGNtZC5leGVjdXRlKCk7XG5cbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgaWYgKHJlcy50aGVuICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN5bmMgbmVzdGVkIGNvbW1hbmRzIGFyZSBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNtZC5yZXBsYWNlRW5kICE9IG51bGwpIHtcbiAgICAgICAgICAgIHBvcyA9IGNtZC5yZXBsYWNlRW5kO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3MgPSB0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKS5lbmQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdldFRleHQoKTtcbiAgICB9XG5cbiAgICBnZXRUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHQoKTtcbiAgICB9XG5cbiAgICBpc1Jvb3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQgPT0gbnVsbCAmJiAodGhpcy5pbkluc3RhbmNlID09IG51bGwgfHwgdGhpcy5pbkluc3RhbmNlLmZpbmRlciA9PSBudWxsKTtcbiAgICB9XG5cbiAgICBnZXRSb290KCkge1xuICAgICAgaWYgKHRoaXMuaXNSb290KCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RmlsZVN5c3RlbSgpIHtcbiAgICAgIGlmICh0aGlzLmVkaXRvci5maWxlU3lzdGVtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVkaXRvci5maWxlU3lzdGVtO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRSb290KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUNhcnJldCh0eHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmdIZWxwZXIuU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsIHRoaXMuY2FycmV0Q2hhcik7XG4gICAgfVxuXG4gICAgZ2V0Q2FycmV0UG9zKHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCwgdGhpcy5jYXJyZXRDaGFyKTtcbiAgICB9XG5cbiAgICByZWdNYXJrZXIoZmxhZ3MgPSBcImdcIikge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLlN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5tYXJrZXIpLCBmbGFncyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWFya2Vycyh0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHRoaXMucmVnTWFya2VyKCksICcnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdCgpIHtcbiAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuXG4gICAgICAgIENvbW1hbmQuQ29tbWFuZC5pbml0Q21kcygpO1xuXG4gICAgICAgIHJldHVybiBDb21tYW5kLkNvbW1hbmQubG9hZENtZHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIDtcbiAgQ29kZXdhdmUuaW5pdGVkID0gZmFsc2U7XG4gIHJldHVybiBDb2Rld2F2ZTtcbn0uY2FsbCh2b2lkIDApO1xuXG5leHBvcnRzLkNvZGV3YXZlID0gQ29kZXdhdmU7XG5cbiIsIlxuXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZShcIi4vQ29udGV4dFwiKTtcblxuY29uc3QgU3RvcmFnZSA9IHJlcXVpcmUoXCIuL1N0b3JhZ2VcIik7XG5cbmNvbnN0IE5hbWVzcGFjZUhlbHBlciA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyXCIpO1xuXG52YXIgX29wdEtleTtcblxuX29wdEtleSA9IGZ1bmN0aW9uIChrZXksIGRpY3QsIGRlZlZhbCA9IG51bGwpIHtcbiAgLy8gb3B0aW9uYWwgRGljdGlvbmFyeSBrZXlcbiAgaWYgKGtleSBpbiBkaWN0KSB7XG4gICAgcmV0dXJuIGRpY3Rba2V5XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGVmVmFsO1xuICB9XG59O1xuXG52YXIgQ29tbWFuZCA9IGZ1bmN0aW9uICgpIHtcbiAgY2xhc3MgQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IobmFtZTEsIGRhdGExID0gbnVsbCwgcGFyZW50ID0gbnVsbCkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTE7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhMTtcbiAgICAgIHRoaXMuY21kcyA9IFtdO1xuICAgICAgdGhpcy5kZXRlY3RvcnMgPSBbXTtcbiAgICAgIHRoaXMuZXhlY3V0ZUZ1bmN0ID0gdGhpcy5yZXN1bHRGdW5jdCA9IHRoaXMucmVzdWx0U3RyID0gdGhpcy5hbGlhc09mID0gdGhpcy5jbHMgPSBudWxsO1xuICAgICAgdGhpcy5hbGlhc2VkID0gbnVsbDtcbiAgICAgIHRoaXMuZnVsbE5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICB0aGlzLmRlcHRoID0gMDtcbiAgICAgIFt0aGlzLl9wYXJlbnQsIHRoaXMuX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdO1xuICAgICAgdGhpcy5zZXRQYXJlbnQocGFyZW50KTtcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSB7fTtcbiAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgICBhbHRlclJlc3VsdDogbnVsbCxcbiAgICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgICAgIGFsbG93ZWROYW1lZDogbnVsbFxuICAgICAgfTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgICAgdGhpcy5maW5hbE9wdGlvbnMgPSBudWxsO1xuICAgIH1cblxuICAgIHBhcmVudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgfVxuXG4gICAgc2V0UGFyZW50KHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5fcGFyZW50ICE9PSB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5mdWxsTmFtZSA9IHRoaXMuX3BhcmVudCAhPSBudWxsICYmIHRoaXMuX3BhcmVudC5uYW1lICE9IG51bGwgPyB0aGlzLl9wYXJlbnQuZnVsbE5hbWUgKyAnOicgKyB0aGlzLm5hbWUgOiB0aGlzLm5hbWU7XG4gICAgICAgIHJldHVybiB0aGlzLmRlcHRoID0gdGhpcy5fcGFyZW50ICE9IG51bGwgJiYgdGhpcy5fcGFyZW50LmRlcHRoICE9IG51bGwgPyB0aGlzLl9wYXJlbnQuZGVwdGggKyAxIDogMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wYXJzZURhdGEodGhpcy5kYXRhKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpO1xuICAgIH1cblxuICAgIGlzRWRpdGFibGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRTdHIgIT0gbnVsbCB8fCB0aGlzLmFsaWFzT2YgIT0gbnVsbDtcbiAgICB9XG5cbiAgICBpc0V4ZWN1dGFibGUoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgaiwgbGVuLCBwLCByZWY7XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgICAgfVxuXG4gICAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCcsICdjbHMnLCAnZXhlY3V0ZUZ1bmN0J107XG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcmVmW2pdO1xuXG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZSkge1xuICAgICAgdmFyIGFsaWFzT2YsIGFsaWFzZWQsIGNvbnRleHQ7XG5cbiAgICAgIGlmICh0aGlzLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQuQ29udGV4dCgpO1xuICAgICAgICBhbGlhc09mID0gdGhpcy5hbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIG5hbWUpO1xuICAgICAgICBhbGlhc2VkID0gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpO1xuXG4gICAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmlzRXhlY3V0YWJsZSgpO1xuICAgIH1cblxuICAgIHJlc3VsdElzQXZhaWxhYmxlKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmO1xuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpO1xuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG5cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0J107XG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcmVmW2pdO1xuXG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgcmVzO1xuICAgICAgcmVzID0ge307XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG5cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgX2FsaWFzZWRGcm9tRmluZGVyKGZpbmRlcikge1xuICAgICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlO1xuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2U7XG4gICAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2U7XG4gICAgICByZXR1cm4gZmluZGVyLmZpbmQoKTtcbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkKCkge1xuICAgICAgdmFyIGNvbnRleHQ7XG5cbiAgICAgIGlmICh0aGlzLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQuQ29udGV4dCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIodGhpcy5hbGlhc09mKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QWxpYXNlZE9yVGhpcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEFsaWFzZWQoKSB8fCB0aGlzO1xuICAgIH1cblxuICAgIHNldE9wdGlvbnMoZGF0YSkge1xuICAgICAgdmFyIGtleSwgcmVzdWx0cywgdmFsO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG4gICAgICAgIHZhbCA9IGRhdGFba2V5XTtcblxuICAgICAgICBpZiAoa2V5IGluIHRoaXMuZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5vcHRpb25zW2tleV0gPSB2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIF9vcHRpb25zRm9yQWxpYXNlZChhbGlhc2VkKSB7XG4gICAgICB2YXIgb3B0O1xuICAgICAgb3B0ID0ge307XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5kZWZhdWx0T3B0aW9ucyk7XG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIGFsaWFzZWQuZ2V0T3B0aW9ucygpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldE9wdGlvbnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3B0aW9uc0ZvckFsaWFzZWQodGhpcy5nZXRBbGlhc2VkKCkpO1xuICAgIH1cblxuICAgIGdldE9wdGlvbihrZXkpIHtcbiAgICAgIHZhciBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoZWxwKCkge1xuICAgICAgdmFyIGNtZDtcbiAgICAgIGNtZCA9IHRoaXMuZ2V0Q21kKCdoZWxwJyk7XG5cbiAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VEYXRhKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRTdHIgPSBkYXRhO1xuICAgICAgICB0aGlzLm9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGljdERhdGEoZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwYXJzZURpY3REYXRhKGRhdGEpIHtcbiAgICAgIHZhciBleGVjdXRlLCByZXM7XG4gICAgICByZXMgPSBfb3B0S2V5KCdyZXN1bHQnLCBkYXRhKTtcblxuICAgICAgaWYgKHR5cGVvZiByZXMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLnJlc3VsdEZ1bmN0ID0gcmVzO1xuICAgICAgfSBlbHNlIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IHJlcztcbiAgICAgICAgdGhpcy5vcHRpb25zWydwYXJzZSddID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZXhlY3V0ZSA9IF9vcHRLZXkoJ2V4ZWN1dGUnLCBkYXRhKTtcblxuICAgICAgaWYgKHR5cGVvZiBleGVjdXRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSBleGVjdXRlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFsaWFzT2YgPSBfb3B0S2V5KCdhbGlhc09mJywgZGF0YSk7XG4gICAgICB0aGlzLmNscyA9IF9vcHRLZXkoJ2NscycsIGRhdGEpO1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IF9vcHRLZXkoJ2RlZmF1bHRzJywgZGF0YSwgdGhpcy5kZWZhdWx0cyk7XG4gICAgICB0aGlzLnNldE9wdGlvbnMoZGF0YSk7XG5cbiAgICAgIGlmICgnaGVscCcgaW4gZGF0YSkge1xuICAgICAgICB0aGlzLmFkZENtZChuZXcgQ29tbWFuZCgnaGVscCcsIGRhdGFbJ2hlbHAnXSwgdGhpcykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoJ2ZhbGxiYWNrJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKCdmYWxsYmFjaycsIGRhdGFbJ2ZhbGxiYWNrJ10sIHRoaXMpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCdjbWRzJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kcyhkYXRhWydjbWRzJ10pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhZGRDbWRzKGNtZHMpIHtcbiAgICAgIHZhciBkYXRhLCBuYW1lLCByZXN1bHRzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICBmb3IgKG5hbWUgaW4gY21kcykge1xuICAgICAgICBkYXRhID0gY21kc1tuYW1lXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKG5hbWUsIGRhdGEsIHRoaXMpKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIGFkZENtZChjbWQpIHtcbiAgICAgIHZhciBleGlzdHM7XG4gICAgICBleGlzdHMgPSB0aGlzLmdldENtZChjbWQubmFtZSk7XG5cbiAgICAgIGlmIChleGlzdHMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlbW92ZUNtZChleGlzdHMpO1xuICAgICAgfVxuXG4gICAgICBjbWQuc2V0UGFyZW50KHRoaXMpO1xuICAgICAgdGhpcy5jbWRzLnB1c2goY21kKTtcbiAgICAgIHJldHVybiBjbWQ7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ21kKGNtZCkge1xuICAgICAgdmFyIGk7XG5cbiAgICAgIGlmICgoaSA9IHRoaXMuY21kcy5pbmRleE9mKGNtZCkpID4gLTEpIHtcbiAgICAgICAgdGhpcy5jbWRzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNtZDtcbiAgICB9XG5cbiAgICBnZXRDbWQoZnVsbG5hbWUpIHtcbiAgICAgIHZhciBjbWQsIGosIGxlbiwgbmFtZSwgcmVmLCByZWYxLCBzcGFjZTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5OYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG5cbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiAocmVmID0gdGhpcy5nZXRDbWQoc3BhY2UpKSAhPSBudWxsID8gcmVmLmdldENtZChuYW1lKSA6IHZvaWQgMDtcbiAgICAgIH1cblxuICAgICAgcmVmMSA9IHRoaXMuY21kcztcblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmMS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBjbWQgPSByZWYxW2pdO1xuXG4gICAgICAgIGlmIChjbWQubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRDbWQoZnVsbG5hbWUsIG5ldyBDb21tYW5kKGZ1bGxuYW1lLnNwbGl0KCc6JykucG9wKCksIGRhdGEpKTtcbiAgICB9XG5cbiAgICBzZXRDbWQoZnVsbG5hbWUsIGNtZCkge1xuICAgICAgdmFyIG5hbWUsIG5leHQsIHNwYWNlO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5OYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG5cbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIG5leHQgPSB0aGlzLmdldENtZChzcGFjZSk7XG5cbiAgICAgICAgaWYgKG5leHQgPT0gbnVsbCkge1xuICAgICAgICAgIG5leHQgPSB0aGlzLmFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5leHQuc2V0Q21kKG5hbWUsIGNtZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFkZENtZChjbWQpO1xuICAgICAgICByZXR1cm4gY21kO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZERldGVjdG9yKGRldGVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXRlY3RvcnMucHVzaChkZXRlY3Rvcik7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXRDbWRzKCkge1xuICAgICAgdmFyIGosIGxlbiwgcHJvdmlkZXIsIHJlZiwgcmVzdWx0cztcbiAgICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwsIHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ2hlbGxvJzoge1xuICAgICAgICAgICAgaGVscDogXCJcXFwiSGVsbG8sIHdvcmxkIVxcXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cXG5tb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cXG52ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWFcIixcbiAgICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlZiA9IHRoaXMucHJvdmlkZXJzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcHJvdmlkZXIgPSByZWZbal07XG4gICAgICAgIHJlc3VsdHMucHVzaChwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgc3RhdGljIHNhdmVDbWQoZnVsbG5hbWUsIGRhdGEpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKTtcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNhdmVJblBhdGgoJ2NtZHMnLCBmdWxsbmFtZSwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbG9hZENtZHMoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBzYXZlZENtZHM7XG4gICAgICAgIHJldHVybiBzYXZlZENtZHMgPSB0aGlzLnN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbihzYXZlZENtZHMgPT4ge1xuICAgICAgICB2YXIgZGF0YSwgZnVsbG5hbWUsIHJlc3VsdHM7XG5cbiAgICAgICAgaWYgKHNhdmVkQ21kcyAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgICAgZm9yIChmdWxsbmFtZSBpbiBzYXZlZENtZHMpIHtcbiAgICAgICAgICAgIGRhdGEgPSBzYXZlZENtZHNbZnVsbG5hbWVdO1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldFNhdmVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlKCdjbWRzJywge30pO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYWtlVmFyQ21kKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBwLCB2YWw7XG4gICAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG5cbiAgICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYWtlQm9vbFZhckNtZChuYW1lLCBiYXNlID0ge30pIHtcbiAgICAgIGJhc2UuZXhlY3V0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICB2YXIgcCwgdmFsO1xuICAgICAgICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuXG4gICAgICAgIGlmICghKHZhbCAhPSBudWxsICYmICh2YWwgPT09ICcwJyB8fCB2YWwgPT09ICdmYWxzZScgfHwgdmFsID09PSAnbm8nKSkpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH1cblxuICB9XG5cbiAgO1xuICBDb21tYW5kLnByb3ZpZGVycyA9IFtdO1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgU3RvcmFnZS5TdG9yYWdlKCk7XG4gIHJldHVybiBDb21tYW5kO1xufS5jYWxsKHZvaWQgMCk7XG5cbmV4cG9ydHMuQ29tbWFuZCA9IENvbW1hbmQ7XG52YXIgQmFzZUNvbW1hbmQgPSBjbGFzcyBCYXNlQ29tbWFuZCB7XG4gIGNvbnN0cnVjdG9yKGluc3RhbmNlMSkge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTE7XG4gIH1cblxuICBpbml0KCkge31cblxuICByZXN1bHRJc0F2YWlsYWJsZSgpIHtcbiAgICByZXR1cm4gdGhpc1tcInJlc3VsdFwiXSAhPSBudWxsO1xuICB9XG5cbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxufTtcbmV4cG9ydHMuQmFzZUNvbW1hbmQgPSBCYXNlQ29tbWFuZDtcblxuIiwiXG5cbmNvbnN0IENtZEZpbmRlciA9IHJlcXVpcmUoXCIuL0NtZEZpbmRlclwiKTtcblxuY29uc3QgQ21kSW5zdGFuY2UgPSByZXF1aXJlKFwiLi9DbWRJbnN0YW5jZVwiKTtcblxuY29uc3QgQXJyYXlIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL0FycmF5SGVscGVyXCIpO1xuXG52YXIgaW5kZXhPZiA9IFtdLmluZGV4T2Y7XG52YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSkge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTtcbiAgICB0aGlzLm5hbWVTcGFjZXMgPSBbXTtcbiAgfVxuXG4gIGFkZE5hbWVTcGFjZShuYW1lKSB7XG4gICAgaWYgKGluZGV4T2YuY2FsbCh0aGlzLm5hbWVTcGFjZXMsIG5hbWUpIDwgMCkge1xuICAgICAgdGhpcy5uYW1lU3BhY2VzLnB1c2gobmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYWRkTmFtZXNwYWNlcyhzcGFjZXMpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzLCBzcGFjZTtcblxuICAgIGlmIChzcGFjZXMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3BhY2VzID09PSAnc3RyaW5nJykge1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBzcGFjZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgc3BhY2UgPSBzcGFjZXNbal07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZE5hbWVTcGFjZShzcGFjZSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICByZW1vdmVOYW1lU3BhY2UobmFtZSkge1xuICAgIHJldHVybiB0aGlzLm5hbWVTcGFjZXMgPSB0aGlzLm5hbWVTcGFjZXMuZmlsdGVyKGZ1bmN0aW9uIChuKSB7XG4gICAgICByZXR1cm4gbiAhPT0gbmFtZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldE5hbWVTcGFjZXMoKSB7XG4gICAgdmFyIG5wY3M7XG5cbiAgICBpZiAodGhpcy5fbmFtZXNwYWNlcyA9PSBudWxsKSB7XG4gICAgICBucGNzID0gdGhpcy5uYW1lU3BhY2VzO1xuXG4gICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICBucGNzID0gbnBjcy5jb25jYXQodGhpcy5wYXJlbnQuZ2V0TmFtZVNwYWNlcygpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLkFycmF5SGVscGVyLnVuaXF1ZShucGNzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcztcbiAgfVxuXG4gIGdldENtZChjbWROYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMpO1xuICAgIHJldHVybiBmaW5kZXIuZmluZCgpO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgQ21kRmluZGVyLkNtZEZpbmRlcihjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0aGlzLmlzUm9vdCgpLFxuICAgICAgY29kZXdhdmU6IHRoaXMuY29kZXdhdmUsXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSwgb3B0aW9ucykpO1xuICB9XG5cbiAgaXNSb290KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9PSBudWxsO1xuICB9XG5cbiAgZ2V0UGFyZW50T3JSb290KCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50KHN0cikge1xuICAgIHZhciBjYztcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcblxuICAgIGlmIChjYy5pbmRleE9mKCclcycpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsIHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0ciArICcgJyArIGNjO1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50TGVmdChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcblxuICAgIGlmICgoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5zdWJzdHIoMCwgaSkgKyBzdHI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYyArICcgJyArIHN0cjtcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudFJpZ2h0KHN0ciA9ICcnKSB7XG4gICAgdmFyIGNjLCBpO1xuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpO1xuXG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIHN0ciArIGNjLnN1YnN0cihpICsgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdHIgKyAnICcgKyBjYztcbiAgICB9XG4gIH1cblxuICBjbWRJbnN0YW5jZUZvcihjbWQpIHtcbiAgICByZXR1cm4gbmV3IENtZEluc3RhbmNlLkNtZEluc3RhbmNlKGNtZCwgdGhpcyk7XG4gIH1cblxuICBnZXRDb21tZW50Q2hhcigpIHtcbiAgICB2YXIgY2hhciwgY21kLCBpbnN0LCByZXM7XG5cbiAgICBpZiAodGhpcy5jb21tZW50Q2hhciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgICB9XG5cbiAgICBjbWQgPSB0aGlzLmdldENtZCgnY29tbWVudCcpO1xuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nO1xuXG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBpbnN0ID0gdGhpcy5jbWRJbnN0YW5jZUZvcihjbWQpO1xuICAgICAgaW5zdC5jb250ZW50ID0gJyVzJztcbiAgICAgIHJlcyA9IGluc3QucmVzdWx0KCk7XG5cbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICBjaGFyID0gcmVzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY29tbWVudENoYXIgPSBjaGFyO1xuICAgIHJldHVybiB0aGlzLmNvbW1lbnRDaGFyO1xuICB9XG5cbn07XG5leHBvcnRzLkNvbnRleHQgPSBDb250ZXh0O1xuXG4iLCJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuL0NvbW1hbmRcIik7XG5cbnZhciBFZGl0Q21kUHJvcCA9IGNsYXNzIEVkaXRDbWRQcm9wIHtcbiAgY29uc3RydWN0b3IobmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywgaSwga2V5LCBsZW4sIHJlZiwgdmFsO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAndmFyJzogbnVsbCxcbiAgICAgICdvcHQnOiBudWxsLFxuICAgICAgJ2Z1bmN0JzogbnVsbCxcbiAgICAgICdkYXRhTmFtZSc6IG51bGwsXG4gICAgICAnc2hvd0VtcHR5JzogZmFsc2UsXG4gICAgICAnY2FycmV0JzogZmFsc2VcbiAgICB9O1xuICAgIHJlZiA9IFsndmFyJywgJ29wdCcsICdmdW5jdCddO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBrZXkgPSByZWZbaV07XG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBkZWZhdWx0c1snZGF0YU5hbWUnXSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcblxuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLkNvbW1hbmQubWFrZVZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgd3JpdGVGb3IocGFyc2VyLCBvYmopIHtcbiAgICBpZiAocGFyc2VyLnZhcnNbdGhpcy5uYW1lXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gb2JqW3RoaXMuZGF0YU5hbWVdID0gcGFyc2VyLnZhcnNbdGhpcy5uYW1lXTtcbiAgICB9XG4gIH1cblxuICB2YWxGcm9tQ21kKGNtZCkge1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMub3B0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5nZXRPcHRpb24odGhpcy5vcHQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5mdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy5mdW5jdF0oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudmFyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLnZhcl07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2hvd0ZvckNtZChjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuICAgIHJldHVybiB0aGlzLnNob3dFbXB0eSB8fCB2YWwgIT0gbnVsbDtcbiAgfVxuXG4gIGRpc3BsYXkoY21kKSB7XG4gICAgaWYgKHRoaXMuc2hvd0ZvckNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+JHt0aGlzLm5hbWV9fn5cXG4ke3RoaXMudmFsRnJvbUNtZChjbWQpIHx8IFwiXCJ9JHt0aGlzLmNhcnJldCA/IFwifFwiIDogXCJcIn1cXG5+fi8ke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG5leHBvcnRzLkVkaXRDbWRQcm9wID0gRWRpdENtZFByb3A7XG5FZGl0Q21kUHJvcC5zb3VyY2UgPSBjbGFzcyBzb3VyY2UgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHZhbEZyb21DbWQoY21kKSB7XG4gICAgdmFyIHJlcztcbiAgICByZXMgPSBzdXBlci52YWxGcm9tQ21kKGNtZCk7XG5cbiAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKC9cXHwvZywgJ3x8Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQuQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSwge1xuICAgICAgJ3ByZXZlbnRQYXJzZUFsbCc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHNob3dGb3JDbWQoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgJiYgIShjbWQgIT0gbnVsbCAmJiBjbWQuYWxpYXNPZiAhPSBudWxsKSB8fCB2YWwgIT0gbnVsbDtcbiAgfVxuXG59O1xuRWRpdENtZFByb3Auc3RyaW5nID0gY2xhc3Mgc3RyaW5nIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnZhbEZyb21DbWQoY21kKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfSAnJHt0aGlzLnZhbEZyb21DbWQoY21kKX0ke3RoaXMuY2FycmV0ID8gXCJ8XCIgOiBcIlwifSd+fmA7XG4gICAgfVxuICB9XG5cbn07XG5FZGl0Q21kUHJvcC5yZXZCb29sID0gY2xhc3MgcmV2Qm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5Db21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICB3cml0ZUZvcihwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbdGhpcy5uYW1lXTtcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG5cbiAgICBpZiAodmFsICE9IG51bGwgJiYgIXZhbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG5FZGl0Q21kUHJvcC5ib29sID0gY2xhc3MgYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5Db21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSk7XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnZhbEZyb21DbWQoY21kKSkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmA7XG4gICAgfVxuICB9XG5cbn07XG5cbiIsIlxuXG5jb25zdCBQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9Qb3NcIik7XG5cbmNvbnN0IFN0clBvcyA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1N0clBvc1wiKTtcblxuY29uc3QgT3B0aW9uYWxQcm9taXNlID0gcmVxdWlyZShcIi4vaGVscGVycy9PcHRpb25hbFByb21pc2VcIik7XG5cbnZhciBFZGl0b3IgPSBjbGFzcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG51bGw7XG4gICAgdGhpcy5fbGFuZyA9IG51bGw7XG4gIH1cblxuICBiaW5kZWRUbyhjb2Rld2F2ZSkge31cblxuICB0ZXh0KHZhbCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0TGVuKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0U3Vic3RyKHN0YXJ0LCBlbmQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgaW5zZXJ0VGV4dEF0KHRleHQsIHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCA9IG51bGwpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgYmVnaW5VbmRvQWN0aW9uKCkge31cblxuICBlbmRVbmRvQWN0aW9uKCkge31cblxuICBnZXRMYW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICB9XG5cbiAgc2V0TGFuZyh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFuZyA9IHZhbDtcbiAgfVxuXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdCgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFsbG93TXVsdGlTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2V0TXVsdGlTZWwoc2VsZWN0aW9ucykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRNdWx0aVNlbCgpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0TGluZUF0KHBvcykge1xuICAgIHJldHVybiBuZXcgUG9zLlBvcyh0aGlzLmZpbmRMaW5lU3RhcnQocG9zKSwgdGhpcy5maW5kTGluZUVuZChwb3MpKTtcbiAgfVxuXG4gIGZpbmRMaW5lU3RhcnQocG9zKSB7XG4gICAgdmFyIHA7XG4gICAgcCA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbXCJcXG5cIl0sIC0xKTtcblxuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3MgKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICBmaW5kTGluZUVuZChwb3MpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtcIlxcblwiLCBcIlxcclwiXSk7XG5cbiAgICBpZiAocCkge1xuICAgICAgcmV0dXJuIHAucG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0TGVuKCk7XG4gICAgfVxuICB9XG5cbiAgZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICB2YXIgYmVzdFBvcywgYmVzdFN0ciwgaSwgbGVuLCBwb3MsIHN0cmksIHRleHQ7XG5cbiAgICBpZiAoZGlyZWN0aW9uID4gMCkge1xuICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihzdGFydCwgdGhpcy50ZXh0TGVuKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKDAsIHN0YXJ0KTtcbiAgICB9XG5cbiAgICBiZXN0UG9zID0gbnVsbDtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHN0cmluZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0cmkgPSBzdHJpbmdzW2ldO1xuICAgICAgcG9zID0gZGlyZWN0aW9uID4gMCA/IHRleHQuaW5kZXhPZihzdHJpKSA6IHRleHQubGFzdEluZGV4T2Yoc3RyaSk7XG5cbiAgICAgIGlmIChwb3MgIT09IC0xKSB7XG4gICAgICAgIGlmIChiZXN0UG9zID09IG51bGwgfHwgYmVzdFBvcyAqIGRpcmVjdGlvbiA+IHBvcyAqIGRpcmVjdGlvbikge1xuICAgICAgICAgIGJlc3RQb3MgPSBwb3M7XG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYmVzdFN0ciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFN0clBvcy5TdHJQb3MoZGlyZWN0aW9uID4gMCA/IGJlc3RQb3MgKyBzdGFydCA6IGJlc3RQb3MsIGJlc3RTdHIpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VtZW50cy5yZWR1Y2UoKHByb21pc2UsIHJlcGwpID0+IHtcbiAgICAgIHJldHVybiBwcm9taXNlLnRoZW4ob3B0ID0+IHtcbiAgICAgICAgcmVwbC53aXRoRWRpdG9yKHRoaXMpO1xuICAgICAgICByZXBsLmFwcGx5T2Zmc2V0KG9wdC5vZmZzZXQpO1xuICAgICAgICByZXR1cm4gKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHJlcGwuYXBwbHkoKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnM6IG9wdC5zZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpLFxuICAgICAgICAgICAgb2Zmc2V0OiBvcHQub2Zmc2V0ICsgcmVwbC5vZmZzZXRBZnRlcih0aGlzKVxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSwgKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHtcbiAgICAgIHNlbGVjdGlvbnM6IFtdLFxuICAgICAgb2Zmc2V0OiAwXG4gICAgfSkpLnRoZW4ob3B0ID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhvcHQuc2VsZWN0aW9ucyk7XG4gICAgfSkucmVzdWx0KCk7XG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMoc2VsZWN0aW9ucykge1xuICAgIGlmIChzZWxlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0aGlzLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRNdWx0aVNlbChzZWxlY3Rpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEN1cnNvclBvcyhzZWxlY3Rpb25zWzBdLnN0YXJ0LCBzZWxlY3Rpb25zWzBdLmVuZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn07XG5leHBvcnRzLkVkaXRvciA9IEVkaXRvcjtcblxuIiwiXG5cbnZhciBMb2dnZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGNsYXNzIExvZ2dlciB7XG4gICAgbG9nKC4uLmFyZ3MpIHtcbiAgICAgIHZhciBpLCBsZW4sIG1zZywgcmVzdWx0cztcblxuICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBtc2cgPSBhcmdzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjb25zb2xlLmxvZyhtc2cpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgIHJldHVybiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZSAhPT0gbnVsbCA/IGNvbnNvbGUubG9nIDogdm9pZCAwKSAhPSBudWxsICYmIHRoaXMuZW5hYmxlZCAmJiBMb2dnZXIuZW5hYmxlZDtcbiAgICB9XG5cbiAgICBydW50aW1lKGZ1bmN0LCBuYW1lID0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDE7XG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgcmVzID0gZnVuY3QoKTtcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfSB0b29rICR7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLmApO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICB0b01vbml0b3Iob2JqLCBuYW1lLCBwcmVmaXggPSAnJykge1xuICAgICAgdmFyIGZ1bmN0O1xuICAgICAgZnVuY3QgPSBvYmpbbmFtZV07XG4gICAgICByZXR1cm4gb2JqW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgcmV0dXJuIHRoaXMubW9uaXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0LmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgIH0sIHByZWZpeCArIG5hbWUpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBtb25pdG9yKGZ1bmN0LCBuYW1lKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDE7XG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgcmVzID0gZnVuY3QoKTtcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgIGlmICh0aGlzLm1vbml0b3JEYXRhW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS5jb3VudCsrO1xuICAgICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLnRvdGFsICs9IHQxIC0gdDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdID0ge1xuICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgIHRvdGFsOiB0MSAtIHQwXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgcmVzdW1lKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpO1xuICAgIH1cblxuICB9XG5cbiAgO1xuICBMb2dnZXIuZW5hYmxlZCA9IHRydWU7XG4gIExvZ2dlci5wcm90b3R5cGUuZW5hYmxlZCA9IHRydWU7XG4gIExvZ2dlci5wcm90b3R5cGUubW9uaXRvckRhdGEgPSB7fTtcbiAgcmV0dXJuIExvZ2dlcjtcbn0uY2FsbCh2b2lkIDApO1xuXG5leHBvcnRzLkxvZ2dlciA9IExvZ2dlcjtcblxuIiwiXG52YXIgT3B0aW9uT2JqZWN0ID0gY2xhc3MgT3B0aW9uT2JqZWN0IHtcbiAgc2V0T3B0cyhvcHRpb25zLCBkZWZhdWx0cykge1xuICAgIHZhciBrZXksIHJlZiwgcmVzdWx0cywgdmFsO1xuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuICAgIHJlc3VsdHMgPSBbXTtcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCBvcHRpb25zW2tleV0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIHZhbCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgc2V0T3B0KGtleSwgdmFsKSB7XG4gICAgdmFyIHJlZjtcblxuICAgIGlmICgoKHJlZiA9IHRoaXNba2V5XSkgIT0gbnVsbCA/IHJlZi5jYWxsIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0KGtleSkge1xuICAgIHZhciByZWY7XG5cbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdHMoKSB7XG4gICAgdmFyIGtleSwgb3B0cywgcmVmLCB2YWw7XG4gICAgb3B0cyA9IHt9O1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHM7XG5cbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuICAgICAgb3B0c1trZXldID0gdGhpcy5nZXRPcHQoa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0cztcbiAgfVxuXG59O1xuZXhwb3J0cy5PcHRpb25PYmplY3QgPSBPcHRpb25PYmplY3Q7XG5cbiIsIlxuXG5jb25zdCBDbWRJbnN0YW5jZSA9IHJlcXVpcmUoXCIuL0NtZEluc3RhbmNlXCIpO1xuXG5jb25zdCBCb3hIZWxwZXIgPSByZXF1aXJlKFwiLi9Cb3hIZWxwZXJcIik7XG5cbmNvbnN0IFBhcmFtUGFyc2VyID0gcmVxdWlyZShcIi4vc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlclwiKTtcblxuY29uc3QgUG9zID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvUG9zXCIpO1xuXG5jb25zdCBTdHJQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9TdHJQb3NcIik7XG5cbmNvbnN0IFJlcGxhY2VtZW50ID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnRcIik7XG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvU3RyaW5nSGVscGVyXCIpO1xuXG5jb25zdCBOYW1lc3BhY2VIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlclwiKTtcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuL0NvbW1hbmRcIik7XG5cbmNvbnN0IE9wdGlvbmFsUHJvbWlzZSA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlXCIpO1xuXG52YXIgUG9zaXRpb25lZENtZEluc3RhbmNlID0gY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2UuQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSwgcG9zMSwgc3RyMSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlO1xuICAgIHRoaXMucG9zID0gcG9zMTtcbiAgICB0aGlzLnN0ciA9IHN0cjE7XG5cbiAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aGlzLl9jaGVja0Nsb3NlcigpO1xuXG4gICAgICB0aGlzLm9wZW5pbmcgPSB0aGlzLnN0cjtcbiAgICAgIHRoaXMubm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cik7XG5cbiAgICAgIHRoaXMuX3NwbGl0Q29tcG9uZW50cygpO1xuXG4gICAgICB0aGlzLl9maW5kQ2xvc2luZygpO1xuXG4gICAgICB0aGlzLl9jaGVja0Vsb25nYXRlZCgpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Nsb3NlcigpIHtcbiAgICB2YXIgZiwgbm9CcmFja2V0O1xuICAgIG5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpO1xuXG4gICAgaWYgKG5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgJiYgKGYgPSB0aGlzLl9maW5kT3BlbmluZ1BvcygpKSkge1xuICAgICAgdGhpcy5jbG9zaW5nUG9zID0gbmV3IFN0clBvcy5TdHJQb3ModGhpcy5wb3MsIHRoaXMuc3RyKTtcbiAgICAgIHRoaXMucG9zID0gZi5wb3M7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSBmLnN0cjtcbiAgICB9XG4gIH1cblxuICBfZmluZE9wZW5pbmdQb3MoKSB7XG4gICAgdmFyIGNsb3NpbmcsIGNtZE5hbWUsIGYsIG9wZW5pbmc7XG4gICAgY21kTmFtZSA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpO1xuICAgIG9wZW5pbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyBjbWROYW1lO1xuICAgIGNsb3NpbmcgPSB0aGlzLnN0cjtcblxuICAgIGlmIChmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zLCBvcGVuaW5nLCBjbG9zaW5nLCAtMSkpIHtcbiAgICAgIGYuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihmLnBvcywgdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcyArIGYuc3RyLmxlbmd0aCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKTtcbiAgICAgIHJldHVybiBmO1xuICAgIH1cbiAgfVxuXG4gIF9zcGxpdENvbXBvbmVudHMoKSB7XG4gICAgdmFyIHBhcnRzO1xuICAgIHBhcnRzID0gdGhpcy5ub0JyYWNrZXQuc3BsaXQoXCIgXCIpO1xuICAgIHRoaXMuY21kTmFtZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHRoaXMucmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIik7XG4gIH1cblxuICBfcGFyc2VQYXJhbXMocGFyYW1zKSB7XG4gICAgdmFyIG5hbWVUb1BhcmFtLCBwYXJzZXI7XG4gICAgcGFyc2VyID0gbmV3IFBhcmFtUGFyc2VyLlBhcmFtUGFyc2VyKHBhcmFtcywge1xuICAgICAgYWxsb3dlZE5hbWVkOiB0aGlzLmdldE9wdGlvbignYWxsb3dlZE5hbWVkJyksXG4gICAgICB2YXJzOiB0aGlzLmNvZGV3YXZlLnZhcnNcbiAgICB9KTtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcnNlci5wYXJhbXM7XG4gICAgdGhpcy5uYW1lZCA9IE9iamVjdC5hc3NpZ24odGhpcy5nZXREZWZhdWx0cygpLCBwYXJzZXIubmFtZWQpO1xuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIG5hbWVUb1BhcmFtID0gdGhpcy5nZXRPcHRpb24oJ25hbWVUb1BhcmFtJyk7XG5cbiAgICAgIGlmIChuYW1lVG9QYXJhbSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVkW25hbWVUb1BhcmFtXSA9IHRoaXMuY21kTmFtZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmcoKSB7XG4gICAgdmFyIGY7XG5cbiAgICBpZiAoZiA9IHRoaXMuX2ZpbmRDbG9zaW5nUG9zKCkpIHtcbiAgICAgIHRoaXMuY29udGVudCA9IFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIudHJpbUVtcHR5TGluZSh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBmLnBvcykpO1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZi5wb3MgKyBmLnN0ci5sZW5ndGgpO1xuICAgIH1cbiAgfVxuXG4gIF9maW5kQ2xvc2luZ1BvcygpIHtcbiAgICB2YXIgY2xvc2luZywgZiwgb3BlbmluZztcblxuICAgIGlmICh0aGlzLmNsb3NpbmdQb3MgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1BvcztcbiAgICB9XG5cbiAgICBjbG9zaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZE5hbWUgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY21kTmFtZTtcblxuICAgIGlmIChmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBvcGVuaW5nLCBjbG9zaW5nKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1BvcyA9IGY7XG4gICAgfVxuICB9XG5cbiAgX2NoZWNrRWxvbmdhdGVkKCkge1xuICAgIHZhciBlbmRQb3MsIG1heCwgcmVmO1xuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCk7XG4gICAgbWF4ID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpO1xuXG4gICAgd2hpbGUgKGVuZFBvcyA8IG1heCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUuZGVjbykge1xuICAgICAgZW5kUG9zICs9IHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGg7XG4gICAgfVxuXG4gICAgaWYgKGVuZFBvcyA+PSBtYXggfHwgKHJlZiA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSkgPT09ICcgJyB8fCByZWYgPT09IFwiXFxuXCIgfHwgcmVmID09PSBcIlxcclwiKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBlbmRQb3MpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0JveCgpIHtcbiAgICB2YXIgY2wsIGNyLCBlbmRQb3M7XG5cbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwgJiYgdGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlLmNtZC5uYW1lID09PSAnY29tbWVudCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjbCA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKTtcbiAgICBjciA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCk7XG4gICAgZW5kUG9zID0gdGhpcy5nZXRFbmRQb3MoKSArIGNyLmxlbmd0aDtcblxuICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zIC0gY2wubGVuZ3RoLCB0aGlzLnBvcykgPT09IGNsICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLCBlbmRQb3MpID09PSBjcikge1xuICAgICAgdGhpcy5wb3MgPSB0aGlzLnBvcyAtIGNsLmxlbmd0aDtcbiAgICAgIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKTtcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkuaW5kZXhPZihjbCkgPiAtMSAmJiB0aGlzLmdldFBvcygpLnNhbWVMaW5lc1N1ZmZpeCgpLmluZGV4T2YoY3IpID4gLTEpIHtcbiAgICAgIHRoaXMuaW5Cb3ggPSAxO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKSB7XG4gICAgdmFyIGVjbCwgZWNyLCBlZCwgcmUxLCByZTIsIHJlMztcblxuICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKTtcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLlN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb2Rld2F2ZS5kZWNvKTtcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2VjbH0oPzoke2VkfSkrXFxcXHMqKC4qPylcXFxccyooPzoke2VkfSkrJHtlY3J9JGAsIFwiZ21cIik7XG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBeXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxccj9cXG5gKTtcbiAgICAgIHJlMyA9IG5ldyBSZWdFeHAoYFxcblxcXFxzKiR7ZWNsfSg/OiR7ZWR9KSpcXFxccyokYCk7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ID0gdGhpcy5jb250ZW50LnJlcGxhY2UocmUxLCAnJDEnKS5yZXBsYWNlKHJlMiwgJycpLnJlcGxhY2UocmUzLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgX2dldFBhcmVudENtZHMoKSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQgPSAocmVmID0gdGhpcy5jb2Rld2F2ZS5nZXRFbmNsb3NpbmdDbWQodGhpcy5nZXRFbmRQb3MoKSkpICE9IG51bGwgPyByZWYuaW5pdCgpIDogdm9pZCAwO1xuICB9XG5cbiAgc2V0TXVsdGlQb3MobXVsdGlQb3MpIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0aVBvcyA9IG11bHRpUG9zO1xuICB9XG5cbiAgX2dldENtZE9iaigpIHtcbiAgICB0aGlzLmdldENtZCgpO1xuXG4gICAgdGhpcy5fY2hlY2tCb3goKTtcblxuICAgIHRoaXMuY29udGVudCA9IHRoaXMucmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGhpcy5jb250ZW50KTtcbiAgICByZXR1cm4gc3VwZXIuX2dldENtZE9iaigpO1xuICB9XG5cbiAgX2luaXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlUGFyYW1zKHRoaXMucmF3UGFyYW1zKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCB0aGlzLmNvZGV3YXZlLmNvbnRleHQ7XG4gIH1cblxuICBnZXRDbWQoKSB7XG4gICAgaWYgKHRoaXMuY21kID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2dldFBhcmVudENtZHMoKTtcblxuICAgICAgaWYgKHRoaXMubm9CcmFja2V0LnN1YnN0cmluZygwLCB0aGlzLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSB7XG4gICAgICAgIHRoaXMuY21kID0gQ29tbWFuZC5Db21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jb2Rld2F2ZS5jb250ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmZpbmRlci5jb250ZXh0O1xuICAgICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKTtcblxuICAgICAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5jbWQuZnVsbE5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY21kO1xuICB9XG5cbiAgZ2V0RmluZGVyKGNtZE5hbWUpIHtcbiAgICB2YXIgZmluZGVyO1xuICAgIGZpbmRlciA9IHRoaXMuY29kZXdhdmUuY29udGV4dC5nZXRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogdGhpcy5fZ2V0UGFyZW50TmFtZXNwYWNlcygpXG4gICAgfSk7XG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gZmluZGVyO1xuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMoKSB7XG4gICAgdmFyIG5zcGNzLCBvYmo7XG4gICAgbnNwY3MgPSBbXTtcbiAgICBvYmogPSB0aGlzO1xuXG4gICAgd2hpbGUgKG9iai5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgb2JqID0gb2JqLnBhcmVudDtcblxuICAgICAgaWYgKG9iai5jbWQgIT0gbnVsbCAmJiBvYmouY21kLmZ1bGxOYW1lICE9IG51bGwpIHtcbiAgICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnNwY3M7XG4gIH1cblxuICBfcmVtb3ZlQnJhY2tldChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoLCBzdHIubGVuZ3RoIC0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk7XG4gIH1cblxuICBhbHRlckFsaWFzT2YoYWxpYXNPZikge1xuICAgIHZhciBjbWROYW1lLCBuc3BjO1xuICAgIFtuc3BjLCBjbWROYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5OYW1lc3BhY2VIZWxwZXIuc3BsaXQodGhpcy5jbWROYW1lKTtcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBjbWROYW1lKTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cyB8fCB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgYmVmb3JlRnVuY3Q7XG5cbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCAhPSBudWxsICYmIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKHRoaXMucG9zICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAuY2FuY2VsKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aCgnJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAoYmVmb3JlRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpKSB7XG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICAgIHJldHVybiAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkodGhpcy5yZXN1bHQoKSkudGhlbihyZXMgPT4ge1xuICAgICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgocmVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnJlc3VsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRXhlY3V0ZUZ1bmN0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RW5kUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aDtcbiAgfVxuXG4gIGdldFBvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcy5Qb3ModGhpcy5wb3MsIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcbiAgfVxuXG4gIGdldE9wZW5pbmdQb3MoKSB7XG4gICAgcmV0dXJuIG5ldyBQb3MuUG9zKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMub3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICB9XG5cbiAgZ2V0SW5kZW50KCkge1xuICAgIHZhciBoZWxwZXI7XG5cbiAgICBpZiAodGhpcy5pbmRlbnRMZW4gPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuaW5Cb3ggIT0gbnVsbCkge1xuICAgICAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyLkJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkpLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gdGhpcy5wb3MgLSB0aGlzLmdldFBvcygpLnByZXZFT0woKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbmRlbnRMZW47XG4gIH1cblxuICByZW1vdmVJbmRlbnRGcm9tQ29udGVudCh0ZXh0KSB7XG4gICAgdmFyIHJlZztcblxuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoJ15cXFxcc3snICsgdGhpcy5nZXRJbmRlbnQoKSArICd9JywgJ2dtJyk7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhbHRlclJlc3VsdEZvckJveChyZXBsKSB7XG4gICAgdmFyIGJveCwgaGVscGVyLCBvcmlnaW5hbCwgcmVzO1xuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KCk7XG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlci5Cb3hIZWxwZXIodGhpcy5jb250ZXh0KTtcbiAgICBoZWxwZXIuZ2V0T3B0RnJvbUxpbmUob3JpZ2luYWwudGV4dFdpdGhGdWxsTGluZXMoKSwgZmFsc2UpO1xuXG4gICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCdyZXBsYWNlQm94JykpIHtcbiAgICAgIGJveCA9IGhlbHBlci5nZXRCb3hGb3JQb3Mob3JpZ2luYWwpO1xuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdO1xuICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIuaW5kZW50O1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgICByZXBsLnN0YXJ0ID0gb3JpZ2luYWwucHJldkVPTCgpO1xuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKCk7XG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIHRoaXMuY29kZXdhdmUubWFya2VyICsgcmVwbC50ZXh0ICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge1xuICAgICAgICBtdWx0aWxpbmU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIFtyZXBsLnByZWZpeCwgcmVwbC50ZXh0LCByZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQodGhpcy5jb2Rld2F2ZS5tYXJrZXIpO1xuICAgIH1cblxuICAgIHJldHVybiByZXBsO1xuICB9XG5cbiAgZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcDtcbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpO1xuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwgJiYgdGhpcy5jb2Rld2F2ZS5jaGVja0NhcnJldCAmJiB0aGlzLmdldE9wdGlvbignY2hlY2tDYXJyZXQnKSkge1xuICAgICAgaWYgKChwID0gdGhpcy5jb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSkgIT0gbnVsbCkge1xuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0ICsgcmVwbC5wcmVmaXgubGVuZ3RoICsgcDtcbiAgICAgIH1cblxuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQocmVwbC50ZXh0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3Vyc29yUG9zO1xuICB9XG5cbiAgY2hlY2tNdWx0aShyZXBsKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV3UmVwbCwgb3JpZ2luYWxQb3MsIG9yaWdpbmFsVGV4dCwgcG9zLCByZWYsIHJlcGxhY2VtZW50cztcblxuICAgIGlmICh0aGlzLm11bHRpUG9zICE9IG51bGwgJiYgdGhpcy5tdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF07XG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpO1xuICAgICAgcmVmID0gdGhpcy5tdWx0aVBvcztcblxuICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgcG9zID0gcmVmW2ldO1xuXG4gICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgb3JpZ2luYWxQb3MgPSBwb3Muc3RhcnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3UmVwbCA9IHJlcGwuY29weSgpLmFwcGx5T2Zmc2V0KHBvcy5zdGFydCAtIG9yaWdpbmFsUG9zKTtcblxuICAgICAgICAgIGlmIChuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09PSBvcmlnaW5hbFRleHQpIHtcbiAgICAgICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ld1JlcGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW3JlcGxdO1xuICAgIH1cbiAgfVxuXG4gIHJlcGxhY2VXaXRoKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudC5SZXBsYWNlbWVudCh0aGlzLnBvcywgdGhpcy5nZXRFbmRQb3MoKSwgdGV4dCkpO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcmVwbGFjZW1lbnRzO1xuICAgIHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcik7XG5cbiAgICBpZiAodGhpcy5pbkJveCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgfVxuXG4gICAgY3Vyc29yUG9zID0gdGhpcy5nZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpO1xuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zLlBvcyhjdXJzb3JQb3MsIGN1cnNvclBvcyldO1xuICAgIHJlcGxhY2VtZW50cyA9IHRoaXMuY2hlY2tNdWx0aShyZXBsKTtcbiAgICB0aGlzLnJlcGxhY2VTdGFydCA9IHJlcGwuc3RhcnQ7XG4gICAgdGhpcy5yZXBsYWNlRW5kID0gcmVwbC5yZXNFbmQoKTtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgfVxuXG59O1xuZXhwb3J0cy5Qb3NpdGlvbmVkQ21kSW5zdGFuY2UgPSBQb3NpdGlvbmVkQ21kSW5zdGFuY2U7XG5cbiIsIlxudmFyIFByb2Nlc3MgPSBjbGFzcyBQcm9jZXNzIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG59O1xuZXhwb3J0cy5Qcm9jZXNzID0gUHJvY2VzcztcblxuIiwiXG5cbmNvbnN0IExvZ2dlciA9IHJlcXVpcmUoXCIuL0xvZ2dlclwiKTtcblxudmFyIFN0b3JhZ2UgPSBjbGFzcyBTdG9yYWdlIHtcbiAgY29uc3RydWN0b3IoZW5naW5lKSB7XG4gICAgdGhpcy5lbmdpbmUgPSBlbmdpbmU7XG4gIH1cblxuICBzYXZlKGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5zYXZlKGtleSwgdmFsKTtcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5zYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKTtcbiAgICB9XG4gIH1cblxuICBsb2FkKGtleSkge1xuICAgIGlmICh0aGlzLmVuZ2luZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUubG9hZChrZXkpO1xuICAgIH1cbiAgfVxuXG4gIGVuZ2luZUF2YWlsYWJsZSgpIHtcbiAgICBpZiAodGhpcy5lbmdpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9nZ2VyID0gdGhpcy5sb2dnZXIgfHwgbmV3IExvZ2dlci5Mb2dnZXIoKTtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbn07XG5leHBvcnRzLlN0b3JhZ2UgPSBTdG9yYWdlO1xuXG4iLCJcblxuY29uc3QgVGV4dFBhcnNlciA9IHJlcXVpcmUoXCIuL1RleHRQYXJzZXJcIik7XG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1Bvc1wiKTtcblxudmFyIGlzRWxlbWVudDtcbnZhciBEb21LZXlMaXN0ZW5lciA9IGNsYXNzIERvbUtleUxpc3RlbmVyIHtcbiAgc3RhcnRMaXN0ZW5pbmcodGFyZ2V0KSB7XG4gICAgdmFyIG9ua2V5ZG93biwgb25rZXlwcmVzcywgb25rZXl1cCwgdGltZW91dDtcbiAgICB0aW1lb3V0ID0gbnVsbDtcblxuICAgIG9ua2V5ZG93biA9IGUgPT4ge1xuICAgICAgaWYgKChDb2Rld2F2ZS5pbnN0YW5jZXMubGVuZ3RoIDwgMiB8fCB0aGlzLm9iaiA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgJiYgZS5rZXlDb2RlID09PSA2OSAmJiBlLmN0cmxLZXkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICh0aGlzLm9uQWN0aXZhdGlvbktleSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BY3RpdmF0aW9uS2V5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgb25rZXl1cCA9IGUgPT4ge1xuICAgICAgaWYgKHRoaXMub25BbnlDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkFueUNoYW5nZShlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgb25rZXlwcmVzcyA9IGUgPT4ge1xuICAgICAgaWYgKHRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9uQW55Q2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFueUNoYW5nZShlKTtcbiAgICAgICAgfVxuICAgICAgfSwgMTAwKTtcbiAgICB9O1xuXG4gICAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKTtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cCk7XG4gICAgICByZXR1cm4gdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5hdHRhY2hFdmVudCkge1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlkb3duXCIsIG9ua2V5ZG93bik7XG4gICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApO1xuICAgICAgcmV0dXJuIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcyk7XG4gICAgfVxuICB9XG5cbn07XG5leHBvcnRzLkRvbUtleUxpc3RlbmVyID0gRG9tS2V5TGlzdGVuZXI7XG5cbmlzRWxlbWVudCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGU7XG5cbiAgdHJ5IHtcbiAgICAvLyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yOyAvLyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgLy8gYW4gZXhjZXB0aW9uIGlzIHRocm93biBhbmQgd2UgZW5kIHVwIGhlcmUuIFRlc3Rpbmcgc29tZVxuICAgIC8vIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcblxuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiICYmIG9iai5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygb2JqLnN0eWxlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBvYmoub3duZXJEb2N1bWVudCA9PT0gXCJvYmplY3RcIjtcbiAgfVxufTtcblxudmFyIFRleHRBcmVhRWRpdG9yID0gZnVuY3Rpb24gKCkge1xuICBjbGFzcyBUZXh0QXJlYUVkaXRvciBleHRlbmRzIFRleHRQYXJzZXIuVGV4dFBhcnNlciB7XG4gICAgY29uc3RydWN0b3IodGFyZ2V0MSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0MTtcbiAgICAgIHRoaXMub2JqID0gaXNFbGVtZW50KHRoaXMudGFyZ2V0KSA/IHRoaXMudGFyZ2V0IDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXQpO1xuXG4gICAgICBpZiAodGhpcy5vYmogPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBcIlRleHRBcmVhIG5vdCBmb3VuZFwiO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm5hbWVzcGFjZSA9ICd0ZXh0YXJlYSc7XG4gICAgICB0aGlzLmNoYW5nZUxpc3RlbmVycyA9IFtdO1xuICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50ID0gMDtcbiAgICB9XG5cbiAgICBvbkFueUNoYW5nZShlKSB7XG4gICAgICB2YXIgY2FsbGJhY2ssIGosIGxlbjEsIHJlZiwgcmVzdWx0cztcblxuICAgICAgaWYgKHRoaXMuX3NraXBDaGFuZ2VFdmVudCA8PSAwKSB7XG4gICAgICAgIHJlZiA9IHRoaXMuY2hhbmdlTGlzdGVuZXJzO1xuICAgICAgICByZXN1bHRzID0gW107XG5cbiAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZi5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBjYWxsYmFjayA9IHJlZltqXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY2FsbGJhY2soKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudC0tO1xuXG4gICAgICAgIGlmICh0aGlzLm9uU2tpcGVkQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vblNraXBlZENoYW5nZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2tpcENoYW5nZUV2ZW50KG5iID0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NraXBDaGFuZ2VFdmVudCArPSBuYjtcbiAgICB9XG5cbiAgICBiaW5kZWRUbyhjb2Rld2F2ZSkge1xuICAgICAgdGhpcy5vbkFjdGl2YXRpb25LZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0TGlzdGVuaW5nKGRvY3VtZW50KTtcbiAgICB9XG5cbiAgICBzZWxlY3Rpb25Qcm9wRXhpc3RzKCkge1xuICAgICAgcmV0dXJuIFwic2VsZWN0aW9uU3RhcnRcIiBpbiB0aGlzLm9iajtcbiAgICB9XG5cbiAgICBoYXNGb2N1cygpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLm9iajtcbiAgICB9XG5cbiAgICB0ZXh0KHZhbCkge1xuICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy50ZXh0RXZlbnRDaGFuZ2UodmFsKSkge1xuICAgICAgICAgIHRoaXMub2JqLnZhbHVlID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm9iai52YWx1ZTtcbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCwgZW5kKSB8fCB0aGlzLnNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQodGV4dCwgc3RhcnQsIGVuZCkgfHwgc3VwZXIuc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KTtcbiAgICB9XG5cbiAgICB0ZXh0RXZlbnRDaGFuZ2UodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSB7XG4gICAgICB2YXIgZXZlbnQ7XG5cbiAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RleHRFdmVudCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnQgIT0gbnVsbCAmJiBldmVudC5pbml0VGV4dEV2ZW50ICE9IG51bGwgJiYgZXZlbnQuaXNUcnVzdGVkICE9PSBmYWxzZSkge1xuICAgICAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgICAgICBlbmQgPSB0aGlzLnRleHRMZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICBpZiAoc3RhcnQgIT09IDApIHtcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQgLSAxLCBzdGFydCk7XG4gICAgICAgICAgICBzdGFydC0tO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZW5kICE9PSB0aGlzLnRleHRMZW4oKSkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihlbmQsIGVuZCArIDEpO1xuICAgICAgICAgICAgZW5kKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5pbml0VGV4dEV2ZW50KCd0ZXh0SW5wdXQnLCB0cnVlLCB0cnVlLCBudWxsLCB0ZXh0LCA5KTsgLy8gQHNldEN1cnNvclBvcyhzdGFydCxlbmQpXG5cbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICB0aGlzLm9iai5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgdGhpcy5za2lwQ2hhbmdlRXZlbnQoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIGlmIChkb2N1bWVudC5leGVjQ29tbWFuZCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgICAgaWYgKHRoaXMudG1wQ3Vyc29yUG9zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG1wQ3Vyc29yUG9zO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5oYXNGb2N1cykge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25Qcm9wRXhpc3RzKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQb3MuUG9zKHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0LCB0aGlzLm9iai5zZWxlY3Rpb25FbmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldEN1cnNvclBvc0ZhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXJzb3JQb3NGYWxsYmFjaygpIHtcbiAgICAgIHZhciBsZW4sIHBvcywgcm5nLCBzZWw7XG5cbiAgICAgIGlmICh0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCk7XG5cbiAgICAgICAgaWYgKHNlbC5wYXJlbnRFbGVtZW50KCkgPT09IHRoaXMub2JqKSB7XG4gICAgICAgICAgcm5nID0gdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICAgICAgcm5nLm1vdmVUb0Jvb2ttYXJrKHNlbC5nZXRCb29rbWFyaygpKTtcbiAgICAgICAgICBsZW4gPSAwO1xuXG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMCkge1xuICAgICAgICAgICAgbGVuKys7XG4gICAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcm5nLnNldEVuZFBvaW50KFwiU3RhcnRUb1N0YXJ0XCIsIHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpKTtcbiAgICAgICAgICBwb3MgPSBuZXcgUG9zLlBvcygwLCBsZW4pO1xuXG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMCkge1xuICAgICAgICAgICAgcG9zLnN0YXJ0Kys7XG4gICAgICAgICAgICBwb3MuZW5kKys7XG4gICAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBuZXcgUG9zLlBvcyhzdGFydCwgZW5kKTtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG51bGw7XG4gICAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kO1xuICAgICAgICB9LCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZCkge1xuICAgICAgdmFyIHJuZztcblxuICAgICAgaWYgKHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSkge1xuICAgICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgcm5nLm1vdmVTdGFydChcImNoYXJhY3RlclwiLCBzdGFydCk7XG4gICAgICAgIHJuZy5jb2xsYXBzZSgpO1xuICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCBlbmQgLSBzdGFydCk7XG4gICAgICAgIHJldHVybiBybmcuc2VsZWN0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGFuZygpIHtcbiAgICAgIGlmICh0aGlzLl9sYW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmouZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMYW5nKHZhbCkge1xuICAgICAgdGhpcy5fbGFuZyA9IHZhbDtcbiAgICAgIHJldHVybiB0aGlzLm9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsIHZhbCk7XG4gICAgfVxuXG4gICAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaTtcblxuICAgICAgaWYgKChpID0gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpIHtcbiAgICAgIGlmIChyZXBsYWNlbWVudHMubGVuZ3RoID4gMCAmJiByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zID0gW3RoaXMuZ2V0Q3Vyc29yUG9zKCldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3VwZXIuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgICB9XG5cbiAgfVxuXG4gIDtcbiAgVGV4dEFyZWFFZGl0b3IucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nID0gRG9tS2V5TGlzdGVuZXIucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nO1xuICByZXR1cm4gVGV4dEFyZWFFZGl0b3I7XG59LmNhbGwodm9pZCAwKTtcblxuZXhwb3J0cy5UZXh0QXJlYUVkaXRvciA9IFRleHRBcmVhRWRpdG9yO1xuXG4iLCJcblxuY29uc3QgRWRpdG9yID0gcmVxdWlyZShcIi4vRWRpdG9yXCIpO1xuXG5jb25zdCBQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9Qb3NcIik7XG5cbnZhciBUZXh0UGFyc2VyID0gY2xhc3MgVGV4dFBhcnNlciBleHRlbmRzIEVkaXRvci5FZGl0b3Ige1xuICBjb25zdHJ1Y3RvcihfdGV4dCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fdGV4dCA9IF90ZXh0O1xuICB9XG5cbiAgdGV4dCh2YWwpIHtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHQgPSB2YWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKVtwb3NdO1xuICB9XG5cbiAgdGV4dExlbihwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkubGVuZ3RoO1xuICB9XG5cbiAgdGV4dFN1YnN0cihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgfVxuXG4gIGluc2VydFRleHRBdCh0ZXh0LCBwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnN1YnN0cmluZygwLCBwb3MpICsgdGV4dCArIHRoaXMudGV4dCgpLnN1YnN0cmluZyhwb3MsIHRoaXMudGV4dCgpLmxlbmd0aCkpO1xuICB9XG5cbiAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIHRoaXMudGV4dCgpLnNsaWNlKGVuZCkpO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnRhcmdldDtcbiAgfVxuXG4gIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBlbmQgPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy50YXJnZXQgPSBuZXcgUG9zLlBvcyhzdGFydCwgZW5kKTtcbiAgfVxuXG59O1xuZXhwb3J0cy5UZXh0UGFyc2VyID0gVGV4dFBhcnNlcjtcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJDb2Rld2F2ZVwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBDb2Rld2F2ZS5Db2Rld2F2ZTtcbiAgfVxufSk7XG5cbmNvbnN0IENvZGV3YXZlID0gcmVxdWlyZShcIi4vQ29kZXdhdmVcIik7XG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi9Db21tYW5kXCIpO1xuXG5jb25zdCBDb3JlQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZShcIi4vY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyXCIpO1xuXG5jb25zdCBKc0NvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoXCIuL2NtZHMvSnNDb21tYW5kUHJvdmlkZXJcIik7XG5cbmNvbnN0IFBocENvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoXCIuL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyXCIpO1xuXG5jb25zdCBIdG1sQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZShcIi4vY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyXCIpO1xuXG5jb25zdCBGaWxlQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZShcIi4vY21kcy9GaWxlQ29tbWFuZFByb3ZpZGVyXCIpO1xuXG5jb25zdCBTdHJpbmdDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKFwiLi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlclwiKTtcblxuY29uc3QgUG9zID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvUG9zXCIpO1xuXG5jb25zdCBXcmFwcGVkUG9zID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvV3JhcHBlZFBvc1wiKTtcblxuY29uc3QgTG9jYWxTdG9yYWdlRW5naW5lID0gcmVxdWlyZShcIi4vc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lXCIpO1xuXG5Qb3MuUG9zLndyYXBDbGFzcyA9IFdyYXBwZWRQb3MuV3JhcHBlZFBvcztcbkNvZGV3YXZlLkNvZGV3YXZlLmluc3RhbmNlcyA9IFtdO1xuQ29tbWFuZC5Db21tYW5kLnByb3ZpZGVycyA9IFtuZXcgQ29yZUNvbW1hbmRQcm92aWRlci5Db3JlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBKc0NvbW1hbmRQcm92aWRlci5Kc0NvbW1hbmRQcm92aWRlcigpLCBuZXcgUGhwQ29tbWFuZFByb3ZpZGVyLlBocENvbW1hbmRQcm92aWRlcigpLCBuZXcgSHRtbENvbW1hbmRQcm92aWRlci5IdG1sQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBGaWxlQ29tbWFuZFByb3ZpZGVyLkZpbGVDb21tYW5kUHJvdmlkZXIoKSwgbmV3IFN0cmluZ0NvbW1hbmRQcm92aWRlci5TdHJpbmdDb21tYW5kUHJvdmlkZXIoKV07XG5cbmlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICBDb21tYW5kLkNvbW1hbmQuc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2VFbmdpbmUuTG9jYWxTdG9yYWdlRW5naW5lKCk7XG59XG5cbiIsIlxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZShcIi4uL0NvbW1hbmRcIik7XG5cbmNvbnN0IExhbmdEZXRlY3RvciA9IHJlcXVpcmUoXCIuLi9kZXRlY3RvcnMvTGFuZ0RldGVjdG9yXCIpO1xuXG5jb25zdCBBbHdheXNFbmFibGVkID0gcmVxdWlyZShcIi4uL2RldGVjdG9ycy9BbHdheXNFbmFibGVkXCIpO1xuXG5jb25zdCBCb3hIZWxwZXIgPSByZXF1aXJlKFwiLi4vQm94SGVscGVyXCIpO1xuXG5jb25zdCBFZGl0Q21kUHJvcCA9IHJlcXVpcmUoXCIuLi9FZGl0Q21kUHJvcFwiKTtcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvU3RyaW5nSGVscGVyXCIpO1xuXG5jb25zdCBQYXRoSGVscGVyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvUGF0aEhlbHBlclwiKTtcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKFwiLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnRcIik7XG5cbnZhciBCb3hDbWQsIENsb3NlQ21kLCBFZGl0Q21kLCBFbW1ldENtZCwgTmFtZVNwYWNlQ21kLCBUZW1wbGF0ZUNtZCwgYWxpYXNDb21tYW5kLCBleGVjX3BhcmVudCwgZ2V0Q29tbWFuZCwgZ2V0Q29udGVudCwgZ2V0UGFyYW0sIGhlbHAsIGxpc3RDb21tYW5kLCBub19leGVjdXRlLCBxdW90ZV9jYXJyZXQsIHJlbW92ZUNvbW1hbmQsIHJlbmFtZUNvbW1hbmQsIHNldENvbW1hbmQsIHN0b3JlSnNvbkNvbW1hbmQ7XG52YXIgQ29yZUNvbW1hbmRQcm92aWRlciA9IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNvcmU7XG4gICAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kLkNvbW1hbmQoJ2NvcmUnKSk7XG4gICAgY21kcy5hZGREZXRlY3RvcihuZXcgQWx3YXlzRW5hYmxlZC5BbHdheXNFbmFibGVkKCdjb3JlJykpO1xuICAgIGNvcmUuYWRkRGV0ZWN0b3IobmV3IExhbmdEZXRlY3Rvci5MYW5nRGV0ZWN0b3IoKSk7XG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICAnaGVscCc6IHtcbiAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAncmVzdWx0JzogaGVscCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJUbyBnZXQgaGVscCBvbiBhIHBlY2lmaWMgY29tbWFuZCwgZG8gOlxcbn5+aGVscCBoZWxsb35+IChoZWxsbyBiZWluZyB0aGUgY29tbWFuZClcIixcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ292ZXJ2aWV3Jzoge1xuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+cXVvdGVfY2FycmV0fn5cXG4gIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXFxuIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xcbi8gL19fLyBfIFxcXFwvIF9gIC8gLV9cXFxcIFxcXFwvXFxcXC8gLyBfYCBcXFxcIFYgLyAtXy9cXG5cXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XFxuVGhlIHRleHQgZWRpdG9yIGhlbHBlclxcbn5+L3F1b3RlX2NhcnJldH5+XFxuXFxuV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcXG55b3VyIHRleHQgZWRpdG9yLiBUaGVzZSBjb21tYW5kcyBtdXN0IGJlIHBsYWNlZCBiZXR3ZWVuIHR3byBcXG5wYWlycyBvZiBcXFwiflxcXCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiLCB3aXRoIHlvdXIgY3Vyc29yIGluc2lkZSB0aGUgY29tbWFuZFxcbkV4OiB+fiFoZWxsb35+XFxuXFxuWW91IGRvbnQgbmVlZCB0byBhY3R1YWxseSB0eXBlIGFueSBcXFwiflxcXCIgKHRpbGRlKS4gXFxuUHJlc3NpbmcgXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpbGwgYWRkIHRoZW0gaWYgeW91IGFyZSBub3QgYWxyZWFkeVxcbndpdGhpbiBhIGNvbW1hbmQuXFxuXFxuQ29kZXdhdmUgZG9lcyBub3QgdXNlIFVJIHRvIGRpc3BsYXkgYW55IGluZm9ybWF0aW9uLiBcXG5JbnN0ZWFkLCBpdCB1c2VzIHRleHQgd2l0aGluIGNvZGUgY29tbWVudHMgdG8gbWltaWMgVUlzLiBcXG5UaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcXG5pbiB0aGUgaGVscCBzZWN0aW9ucy5cXG5cXG5UbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpdGggeW91ciBjdXJzb3Igb24gdGhlIGxpbmUgYmVsbG93Llxcbn5+IWNsb3NlfH5+XFxuXFxuVXNlIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBmb3IgYSB3YWxrdGhyb3VnaCBvZiBzb21lIG9mIHRoZSBtYW55XFxuZmVhdHVyZXMgb2YgQ29kZXdhdmVcXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cXG5cXG5MaXN0IG9mIGFsbCBoZWxwIHN1YmplY3RzIFxcbn5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxcblxcbn5+IWNsb3Nlfn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc3ViamVjdHMnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn4haGVscH5+XFxufn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcXG5+fiFoZWxwOnN1YmplY3Rzfn4gKH5+IWhlbHA6c3Vifn4pXFxufn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6aGVscDpzdWJqZWN0cydcbiAgICAgICAgICB9LFxuICAgICAgICAgICdnZXRfc3RhcnRlZCc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5UaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cXG5+fiFoZWxsb3x+flxcblxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuXFxuRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcXG5+fiFoZWxwOmVkaXRpbmd+flxcblxcbkNvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxcbm9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xcbn5+IWpzOmZ+flxcbn5+IWpzOmlmfn5cXG4gIH5+IWpzOmxvZ35+XFxcIn5+IWhlbGxvfn5cXFwifn4hL2pzOmxvZ35+XFxufn4hL2pzOmlmfn5cXG5+fiEvanM6Zn5+XFxuXFxuQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxcbnByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLiBFbW1ldCBhYmJyZXZpYXRpb25zIHdpbGwgYmUgXFxudXNlZCBhdXRvbWF0aWNhbGx5IGlmIHlvdSBhcmUgaW4gYSBIVE1MIG9yIENTUyBmaWxlLlxcbn5+IXVsPmxpfn4gKGlmIHlvdSBhcmUgaW4gYSBodG1sIGRvY2N1bWVudClcXG5+fiFlbW1ldCB1bD5saX5+XFxufn4hZW1tZXQgbTIgY3Nzfn5cXG5cXG5Db21tYW5kcyBhcmUgc3RvcmVkIGluIG5hbWVzcGFjZXMuIFRoZSBzYW1lIGNvbW1hbmQgY2FuIGhhdmUgXFxuZGlmZmVyZW50IHJlc3VsdHMgZGVwZW5kaW5nIG9uIHRoZSBuYW1lc3BhY2UuXFxufn4hanM6ZWFjaH5+XFxufn4hcGhwOm91dGVyOmVhY2h+flxcbn5+IXBocDppbm5lcjplYWNofn5cXG5cXG5Tb21lIG9mIHRoZSBuYW1lc3BhY2VzIGFyZSBhY3RpdmUgZGVwZW5kaW5nIG9uIHRoZSBjb250ZXh0LiBUaGVcXG5mb2xsb3dpbmcgY29tbWFuZHMgYXJlIHRoZSBzYW1lIGFuZCB3aWxsIGRpc3BsYXkgdGhlIGN1cnJlbnRseVxcbmFjdGl2ZSBuYW1lc3BhY2UuIFRoZSBmaXJzdCBjb21tYW5kIGNvbW1hbmQgd29ya3MgYmVjYXVzZSB0aGUgXFxuY29yZSBuYW1lc3BhY2UgaXMgYWN0aXZlLlxcbn5+IW5hbWVzcGFjZX5+XFxufn4hY29yZTpuYW1lc3BhY2V+flxcblxcbllvdSBjYW4gbWFrZSBhIG5hbWVzcGFjZSBhY3RpdmUgd2l0aCB0aGUgZm9sbG93aW5nIGNvbW1hbmQuXFxufn4hbmFtZXNwYWNlIHBocH5+XFxuXFxuQ2hlY2sgdGhlIG5hbWVzcGFjZXMgYWdhaW5cXG5+fiFuYW1lc3BhY2V+flxcblxcbkluIGFkZGl0aW9uIHRvIGRldGVjdGluZyB0aGUgZG9jdW1lbnQgdHlwZSwgQ29kZXdhdmUgY2FuIGRldGVjdCB0aGVcXG5jb250ZXh0IGZyb20gdGhlIHN1cnJvdW5kaW5nIHRleHQuIEluIGEgUEhQIGZpbGUsIGl0IG1lYW5zIENvZGV3YXZlIFxcbndpbGwgYWRkIHRoZSBQSFAgdGFncyB3aGVuIHlvdSBuZWVkIHRoZW0uXFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdkZW1vJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpoZWxwOmdldF9zdGFydGVkJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2VkaXRpbmcnOiB7XG4gICAgICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAgICAgJ2ludHJvJzoge1xuICAgICAgICAgICAgICAgICdyZXN1bHQnOiBcIkNvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXFxucHV0IHlvdXIgY29udGVudCBpbnNpZGUgXFxcInNvdXJjZVxcXCIgdGhlIGRvIFxcXCJzYXZlXFxcIi4gVHJ5IGFkZGluZyBhbnkgXFxudGV4dCB0aGF0IGlzIG9uIHlvdXIgbWluZC5cXG5+fiFlZGl0IG15X25ld19jb21tYW5kfH5+XFxuXFxuSWYgeW91IGRpZCB0aGUgbGFzdCBzdGVwIHJpZ2h0LCB5b3Ugc2hvdWxkIHNlZSB5b3VyIHRleHQgd2hlbiB5b3VcXG5kbyB0aGUgZm9sbG93aW5nIGNvbW1hbmQuIEl0IGlzIG5vdyBzYXZlZCBhbmQgeW91IGNhbiB1c2UgaXQgXFxud2hlbmV2ZXIgeW91IHdhbnQuXFxufn4hbXlfbmV3X2NvbW1hbmR+flwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn5oZWxwOmVkaXRpbmc6aW50cm9+flxcblxcbkFsbCB0aGUgd2luZG93cyBvZiBDb2Rld2F2ZSBhcmUgbWFkZSB3aXRoIHRoZSBjb21tYW5kIFxcXCJib3hcXFwiLiBcXG5UaGV5IGFyZSBtZWFudCB0byBkaXNwbGF5IHRleHQgdGhhdCBzaG91bGQgbm90IHJlbWFpbiBpbiB5b3VyIGNvZGUuIFxcblRoZXkgYXJlIHZhbGlkIGNvbW1lbnRzIHNvIHRoZXkgd29uJ3QgYnJlYWsgeW91ciBjb2RlIGFuZCB0aGUgY29tbWFuZCBcXG5cXFwiY2xvc2VcXFwiIGNhbiBiZSB1c2VkIHRvIHJlbW92ZSB0aGVtIHJhcGlkbHkuIFlvdSBjYW4gbWFrZSB5b3VyIG93biBcXG5jb21tYW5kcyB3aXRoIHRoZW0gaWYgeW91IG5lZWQgdG8gZGlzcGxheSBzb21lIHRleHQgdGVtcG9yYXJpbHkuXFxufn4hYm94fn5cXG5UaGUgYm94IHdpbGwgc2NhbGUgd2l0aCB0aGUgY29udGVudCB5b3UgcHV0IGluIGl0XFxufn4hY2xvc2V8fn5cXG5+fiEvYm94fn5cXG5cXG5+fnF1b3RlX2NhcnJldH5+XFxuV2hlbiB5b3UgY3JlYXRlIGEgY29tbWFuZCwgeW91IG1heSB3YW50IHRvIHNwZWNpZnkgd2hlcmUgdGhlIGN1cnNvciBcXG53aWxsIGJlIGxvY2F0ZWQgb25jZSB0aGUgY29tbWFuZCBpcyBleHBhbmRlZC4gVG8gZG8gdGhhdCwgdXNlIGEgXFxcInxcXFwiIFxcbihWZXJ0aWNhbCBiYXIpLiBVc2UgMiBvZiB0aGVtIGlmIHlvdSB3YW50IHRvIHByaW50IHRoZSBhY3R1YWwgXFxuY2hhcmFjdGVyLlxcbn5+IWJveH5+XFxub25lIDogfCBcXG50d28gOiB8fFxcbn5+IS9ib3h+flxcblxcbllvdSBjYW4gYWxzbyB1c2UgdGhlIFxcXCJlc2NhcGVfcGlwZXNcXFwiIGNvbW1hbmQgdGhhdCB3aWxsIGVzY2FwZSBhbnkgXFxudmVydGljYWwgYmFycyB0aGF0IGFyZSBiZXR3ZWVuIGl0cyBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3NcXG5+fiFlc2NhcGVfcGlwZXN+flxcbnxcXG5+fiEvZXNjYXBlX3BpcGVzfn5cXG5cXG5Db21tYW5kcyBpbnNpZGUgb3RoZXIgY29tbWFuZHMgd2lsbCBiZSBleHBhbmRlZCBhdXRvbWF0aWNhbGx5LlxcbklmIHlvdSB3YW50IHRvIHByaW50IGEgY29tbWFuZCB3aXRob3V0IGhhdmluZyBpdCBleHBhbmQgd2hlbiBcXG50aGUgcGFyZW50IGNvbW1hbmQgaXMgZXhwYW5kZWQsIHVzZSBhIFxcXCIhXFxcIiAoZXhjbGFtYXRpb24gbWFyaykuXFxufn4hIWhlbGxvfn5cXG5cXG5Gb3IgY29tbWFuZHMgdGhhdCBoYXZlIGJvdGggYW4gb3BlbmluZyBhbmQgYSBjbG9zaW5nIHRhZywgeW91IGNhbiB1c2VcXG50aGUgXFxcImNvbnRlbnRcXFwiIGNvbW1hbmQuIFxcXCJjb250ZW50XFxcIiB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRleHRcXG50aGF0IGlzIGJldHdlZW4gdGhlIHRhZ3MuIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBob3cgaXQgY2FuIGJlIHVzZWQuXFxufn4hZWRpdCBwaHA6aW5uZXI6aWZ+flxcblxcbn5+L3F1b3RlX2NhcnJldH5+XFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZWRpdCc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6aGVscDplZGl0aW5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnbm9fZXhlY3V0ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IG5vX2V4ZWN1dGUsXG4gICAgICAgICdoZWxwJzogXCJQcmV2ZW50IGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgZnJvbSBleGVjdXRpbmdcIlxuICAgICAgfSxcbiAgICAgICdlc2NhcGVfcGlwZXMnOiB7XG4gICAgICAgICdyZXN1bHQnOiBxdW90ZV9jYXJyZXQsXG4gICAgICAgICdjaGVja0NhcnJldCc6IGZhbHNlLFxuICAgICAgICAnaGVscCc6IFwiRXNjYXBlIGFsbCBjYXJyZXRzIChmcm9tIFxcXCJ8XFxcIiB0byBcXFwifHxcXFwiKVwiXG4gICAgICB9LFxuICAgICAgJ3F1b3RlX2NhcnJldCc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgICB9LFxuICAgICAgJ2V4ZWNfcGFyZW50Jzoge1xuICAgICAgICAnZXhlY3V0ZSc6IGV4ZWNfcGFyZW50LFxuICAgICAgICAnaGVscCc6IFwiRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1wiXG4gICAgICB9LFxuICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRDb250ZW50LFxuICAgICAgICAnaGVscCc6IFwiTWFpbmx5IHVzZWQgZm9yIGNvbW1hbmQgZWRpdGlvbiwgXFxudGhpcyB3aWxsIHJldHVybiB3aGF0IHdhcyBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgb2YgYSBjb21tYW5kXCJcbiAgICAgIH0sXG4gICAgICAnYm94Jzoge1xuICAgICAgICAnY2xzJzogQm94Q21kLFxuICAgICAgICAnaGVscCc6IFwiQ3JlYXRlIHRoZSBhcHBhcmVuY2Ugb2YgYSBib3ggY29tcG9zZWQgZnJvbSBjaGFyYWN0ZXJzLiBcXG5Vc3VhbGx5IHdyYXBwZWQgaW4gYSBjb21tZW50LlxcblxcblRoZSBib3ggd2lsbCB0cnkgdG8gYWp1c3QgaXQncyBzaXplIGZyb20gdGhlIGNvbnRlbnRcIlxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgJ2Nscyc6IENsb3NlQ21kLFxuICAgICAgICAnaGVscCc6IFwiV2lsbCBjbG9zZSB0aGUgZmlyc3QgYm94IGFyb3VuZCB0aGlzXCJcbiAgICAgIH0sXG4gICAgICAncGFyYW0nOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRQYXJhbSxcbiAgICAgICAgJ2hlbHAnOiBcIk1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gYSBwYXJhbWV0ZXIgZnJvbSB0aGlzIGNvbW1hbmQgY2FsbFxcblxcbllvdSBjYW4gcGFzcyBhIG51bWJlciwgYSBzdHJpbmcsIG9yIGJvdGguIFxcbkEgbnVtYmVyIGZvciBhIHBvc2l0aW9uZWQgYXJndW1lbnQgYW5kIGEgc3RyaW5nXFxuZm9yIGEgbmFtZWQgcGFyYW1ldGVyXCJcbiAgICAgIH0sXG4gICAgICAnZWRpdCc6IHtcbiAgICAgICAgJ2NtZHMnOiBFZGl0Q21kLnNldENtZHMoe1xuICAgICAgICAgICdzYXZlJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICAnY2xzJzogRWRpdENtZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxcblNlZSB+fiFoZWxwOmVkaXRpbmd+fiBmb3IgYSBxdWljayB0dXRvcmlhbFwiXG4gICAgICB9LFxuICAgICAgJ3JlbmFtZSc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9hcHBsaWNhYmxlJzogXCJ+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIixcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IHJlbmFtZUNvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2Zyb20nLCAndG8nXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byByZW5hbWUgYSBjb21tYW5kIGFuZCBjaGFuZ2UgaXQncyBuYW1lc3BhY2UuIFxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG4tIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcXG4tIFRoZW4gc2Vjb25kIHBhcmFtIGlzIHRoZSBuZXcgbmFtZSwgaWYgaXQgaGFzIG5vIG5hbWVzcGFjZSxcXG4gIGl0IHdpbGwgdXNlIHRoZSBvbmUgZnJvbSB0aGUgb3JpZ2luYWwgY29tbWFuZC5cXG5cXG5leC46IH5+IXJlbmFtZSBteV9jb21tYW5kIG15X2NvbW1hbmQyfn5cIlxuICAgICAgfSxcbiAgICAgICdyZW1vdmUnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfYXBwbGljYWJsZSc6IFwifn5ib3h+flxcbllvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCIsXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiByZW1vdmVDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydjbWQnXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byByZW1vdmUgYSBjb21tYW5kLiBcXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXCJcbiAgICAgIH0sXG4gICAgICAnYWxpYXMnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogYWxpYXNDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ25hbWVzcGFjZSc6IHtcbiAgICAgICAgJ2Nscyc6IE5hbWVTcGFjZUNtZCxcbiAgICAgICAgJ2hlbHAnOiBcIlNob3cgdGhlIGN1cnJlbnQgbmFtZXNwYWNlcy5cXG5cXG5BIG5hbWUgc3BhY2UgY291bGQgYmUgdGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlXFxub3Igb3RoZXIga2luZCBvZiBjb250ZXh0c1xcblxcbklmIHlvdSBwYXNzIGEgcGFyYW0gdG8gdGhpcyBjb21tYW5kLCBpdCB3aWxsIFxcbmFkZCB0aGUgcGFyYW0gYXMgYSBuYW1lc3BhY2UgZm9yIHRoZSBjdXJyZW50IGVkaXRvclwiXG4gICAgICB9LFxuICAgICAgJ25zcGMnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6bmFtZXNwYWNlJ1xuICAgICAgfSxcbiAgICAgICdsaXN0Jzoge1xuICAgICAgICAncmVzdWx0JzogbGlzdENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnYm94JywgJ2NvbnRleHQnXSxcbiAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnaGVscCc6IFwiTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcXG5cXG5Zb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcXG5ieSBkZWZhdWx0IGFsbCBjdXJlbnQgbmFtZXNwYWNlIHdpbGwgYmUgc2hvd25cIlxuICAgICAgfSxcbiAgICAgICdscyc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpsaXN0J1xuICAgICAgfSxcbiAgICAgICdnZXQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJ10sXG4gICAgICAgICdoZWxwJzogXCJvdXRwdXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcIlxuICAgICAgfSxcbiAgICAgICdzZXQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBzZXRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ3ZhbHVlJywgJ3ZhbCddLFxuICAgICAgICAnaGVscCc6IFwic2V0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXCJcbiAgICAgIH0sXG4gICAgICAnc3RvcmVfanNvbic6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHN0b3JlSnNvbkNvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnanNvbiddLFxuICAgICAgICAnaGVscCc6IFwic2V0IGEgdmFyaWFibGUgd2l0aCBzb21lIGpzb24gZGF0YVwiXG4gICAgICB9LFxuICAgICAgJ2pzb24nOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6c3RvcmVfanNvbidcbiAgICAgIH0sXG4gICAgICAndGVtcGxhdGUnOiB7XG4gICAgICAgICdjbHMnOiBUZW1wbGF0ZUNtZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZScsICdzZXAnXSxcbiAgICAgICAgJ2hlbHAnOiBcInJlbmRlciBhIHRlbXBsYXRlIGZvciBhIHZhcmlhYmxlXFxuXFxuSWYgdGhlIGZpcnN0IHBhcmFtIGlzIG5vdCBzZXQgaXQgd2lsbCB1c2UgYWxsIHZhcmlhYmxlcyBcXG5mb3IgdGhlIHJlbmRlclxcbklmIHRoZSB2YXJpYWJsZSBpcyBhbiBhcnJheSB0aGUgdGVtcGxhdGUgd2lsbCBiZSByZXBlYXRlZCBcXG5mb3IgZWFjaCBpdGVtc1xcblRoZSBgc2VwYCBwYXJhbSBkZWZpbmUgd2hhdCB3aWxsIHNlcGFyYXRlIGVhY2ggaXRlbSBcXG5hbmQgZGVmYXVsdCB0byBhIGxpbmUgYnJlYWtcIlxuICAgICAgfSxcbiAgICAgICdlbW1ldCc6IHtcbiAgICAgICAgJ2Nscyc6IEVtbWV0Q21kLFxuICAgICAgICAnaGVscCc6IFwiQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxcbnByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLlxcblxcblBhc3MgdGhlIEVtbWV0IGFiYnJldmlhdGlvbiBhcyBhIHBhcmFtIHRvIGV4cGVuZCBpdC5cIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5leHBvcnRzLkNvcmVDb21tYW5kUHJvdmlkZXIgPSBDb3JlQ29tbWFuZFByb3ZpZGVyO1xuXG5oZWxwID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBjbWQsIGNtZE5hbWUsIGhlbHBDbWQsIHN1YmNvbW1hbmRzLCB0ZXh0O1xuICBjbWROYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG5cbiAgaWYgKGNtZE5hbWUgIT0gbnVsbCkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKGNtZE5hbWUpO1xuXG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBoZWxwQ21kID0gY21kLmdldENtZCgnaGVscCcpO1xuICAgICAgdGV4dCA9IGhlbHBDbWQgPyBgfn4ke2hlbHBDbWQuZnVsbE5hbWV9fn5gIDogXCJUaGlzIGNvbW1hbmQgaGFzIG5vIGhlbHAgdGV4dFwiO1xuICAgICAgc3ViY29tbWFuZHMgPSBjbWQuY21kcy5sZW5ndGggPyBgXFxuU3ViLUNvbW1hbmRzIDpcXG5+fmxzICR7Y21kLmZ1bGxOYW1lfSBib3g6bm8gY29udGV4dDpub35+YCA6IFwiXCI7XG4gICAgICByZXR1cm4gYH5+Ym94fn5cXG5IZWxwIGZvciB+fiEke2NtZC5mdWxsTmFtZX1+fiA6XFxuXFxuJHt0ZXh0fVxcbiR7c3ViY29tbWFuZHN9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICd+fmhlbHA6b3ZlcnZpZXd+fic7XG4gIH1cbn07XG5cbm5vX2V4ZWN1dGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIHJlZztcbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIgKyBTdHJpbmdIZWxwZXIuU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzKSArICcpJyArIFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpKTtcbiAgcmV0dXJuIGluc3RhbmNlLnN0ci5yZXBsYWNlKHJlZywgJyQxJyk7XG59O1xuXG5xdW90ZV9jYXJyZXQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgcmV0dXJuIGluc3RhbmNlLmNvbnRlbnQucmVwbGFjZSgvXFx8L2csICd8fCcpO1xufTtcblxuZXhlY19wYXJlbnQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIHJlcztcblxuICBpZiAoaW5zdGFuY2UucGFyZW50ICE9IG51bGwpIHtcbiAgICByZXMgPSBpbnN0YW5jZS5wYXJlbnQuZXhlY3V0ZSgpO1xuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnQ7XG4gICAgaW5zdGFuY2UucmVwbGFjZUVuZCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlRW5kO1xuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbmdldENvbnRlbnQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGFmZml4ZXNfZW1wdHksIHByZWZpeCwgc3VmZml4O1xuICBhZmZpeGVzX2VtcHR5ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydhZmZpeGVzX2VtcHR5J10sIGZhbHNlKTtcbiAgcHJlZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpO1xuICBzdWZmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG5cbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBwcmVmaXggKyAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5jb250ZW50IHx8ICcnKSArIHN1ZmZpeDtcbiAgfVxuXG4gIGlmIChhZmZpeGVzX2VtcHR5KSB7XG4gICAgcmV0dXJuIHByZWZpeCArIHN1ZmZpeDtcbiAgfVxufTtcblxucmVuYW1lQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIHN0b3JhZ2U7XG4gICAgc3RvcmFnZSA9IENvbW1hbmQuQ29tbWFuZC5zdG9yYWdlO1xuICAgIHJldHVybiBzdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgfSkudGhlbihzYXZlZENtZHMgPT4ge1xuICAgIHZhciBjbWQsIGNtZERhdGEsIG5ld05hbWUsIG9yaWduaW5hbE5hbWU7XG4gICAgb3JpZ25pbmFsTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZnJvbSddKTtcbiAgICBuZXdOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd0byddKTtcblxuICAgIGlmIChvcmlnbmluYWxOYW1lICE9IG51bGwgJiYgbmV3TmFtZSAhPSBudWxsKSB7XG4gICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChvcmlnbmluYWxOYW1lKTtcblxuICAgICAgaWYgKHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXSAhPSBudWxsICYmIGNtZCAhPSBudWxsKSB7XG4gICAgICAgIGlmICghKG5ld05hbWUuaW5kZXhPZignOicpID4gLTEpKSB7XG4gICAgICAgICAgbmV3TmFtZSA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG9yaWduaW5hbE5hbWUsICcnKSArIG5ld05hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdO1xuXG4gICAgICAgIENvbW1hbmQuQ29tbWFuZC5jbWRzLnNldENtZERhdGEobmV3TmFtZSwgY21kRGF0YSk7XG5cbiAgICAgICAgY21kLnVucmVnaXN0ZXIoKTtcbiAgICAgICAgc2F2ZWRDbWRzW25ld05hbWVdID0gY21kRGF0YTtcbiAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBzdG9yYWdlLnNhdmUoJ2NtZHMnLCBzYXZlZENtZHMpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5yZW1vdmVDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICB2YXIgbmFtZTtcbiAgICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG5cbiAgICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBzYXZlZENtZHMsIHN0b3JhZ2U7XG4gICAgICAgIHN0b3JhZ2UgPSBDb21tYW5kLkNvbW1hbmQuc3RvcmFnZTtcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbihzYXZlZENtZHMgPT4ge1xuICAgICAgICB2YXIgY21kLCBjbWREYXRhO1xuICAgICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChuYW1lKTtcblxuICAgICAgICBpZiAoc2F2ZWRDbWRzW25hbWVdICE9IG51bGwgJiYgY21kICE9IG51bGwpIHtcbiAgICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW25hbWVdO1xuICAgICAgICAgIGNtZC51bnJlZ2lzdGVyKCk7XG4gICAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tuYW1lXTtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZS5zYXZlKCdjbWRzJywgc2F2ZWRDbWRzKTtcbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfYXBwbGljYWJsZX5+XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuYWxpYXNDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnYWxpYXMnXSk7XG5cbiAgaWYgKG5hbWUgIT0gbnVsbCAmJiBhbGlhcyAhPSBudWxsKSB7XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQobmFtZSk7XG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZCA9IGNtZC5nZXRBbGlhc2VkKCkgfHwgY21kOyAvLyB1bmxlc3MgYWxpYXMuaW5kZXhPZignOicpID4gLTFcbiAgICAgIC8vIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuXG4gICAgICBDb21tYW5kLkNvbW1hbmQuc2F2ZUNtZChhbGlhcywge1xuICAgICAgICBhbGlhc09mOiBjbWQuZnVsbE5hbWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwifn5ub3RfZm91bmR+flwiO1xuICAgIH1cbiAgfVxufTtcblxubGlzdENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGJveCwgY29tbWFuZHMsIGNvbnRleHQsIG5hbWUsIG5hbWVzcGFjZXMsIHRleHQsIHVzZUNvbnRleHQ7XG4gIGJveCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2JveCddLCB0cnVlKTtcbiAgdXNlQ29udGV4dCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2NvbnRleHQnXSwgdHJ1ZSk7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIG5hbWVzcGFjZXMgPSBuYW1lID8gW25hbWVdIDogaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCkuZmlsdGVyKG5zcGMgPT4ge1xuICAgIHJldHVybiBuc3BjICE9PSBpbnN0YW5jZS5jbWQuZnVsbE5hbWU7XG4gIH0pLmNvbmNhdChcIl9yb290XCIpO1xuICBjb250ZXh0ID0gdXNlQ29udGV4dCA/IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkgOiBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dDtcbiAgY29tbWFuZHMgPSBuYW1lc3BhY2VzLnJlZHVjZSgoY29tbWFuZHMsIG5zcGMpID0+IHtcbiAgICB2YXIgY21kO1xuICAgIGNtZCA9IG5zcGMgPT09IFwiX3Jvb3RcIiA/IENvbW1hbmQuQ29tbWFuZC5jbWRzIDogY29udGV4dC5nZXRDbWQobnNwYywge1xuICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KCk7XG5cbiAgICAgIGlmIChjbWQuY21kcykge1xuICAgICAgICBjb21tYW5kcyA9IGNvbW1hbmRzLmNvbmNhdChjbWQuY21kcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbW1hbmRzO1xuICB9LCBbXSk7XG4gIHRleHQgPSBjb21tYW5kcy5sZW5ndGggPyBjb21tYW5kcy5tYXAoY21kID0+IHtcbiAgICBjbWQuaW5pdCgpO1xuICAgIHJldHVybiAoY21kLmlzRXhlY3V0YWJsZSgpID8gJ35+IScgOiAnfn4hbHMgJykgKyBjbWQuZnVsbE5hbWUgKyAnfn4nO1xuICB9KS5qb2luKFwiXFxuXCIpIDogXCJUaGlzIGNvbnRhaW5zIG5vIHN1Yi1jb21tYW5kc1wiO1xuXG4gIGlmIChib3gpIHtcbiAgICByZXR1cm4gYH5+Ym94fn5cXG4ke3RleHR9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbn07XG5cbmdldENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHJlcztcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgcmVzID0gUGF0aEhlbHBlci5QYXRoSGVscGVyLmdldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSk7XG5cbiAgaWYgKHR5cGVvZiByZXMgPT09IFwib2JqZWN0XCIpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAnICAnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59O1xuXG5zZXRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWw7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd2YWx1ZScsICd2YWwnXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG5cbiAgUGF0aEhlbHBlci5QYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSwgdmFsKTtcblxuICByZXR1cm4gJyc7XG59O1xuXG5zdG9yZUpzb25Db21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWw7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdqc29uJ10pKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuXG4gIFBhdGhIZWxwZXIuUGF0aEhlbHBlci5zZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIG5hbWUsIEpTT04ucGFyc2UodmFsKSk7XG5cbiAgcmV0dXJuICcnO1xufTtcblxuZ2V0UGFyYW0gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcywgaW5zdGFuY2UuZ2V0UGFyYW0oWydkZWYnLCAnZGVmYXVsdCddKSk7XG4gIH1cbn07XG5cbkJveENtZCA9IGNsYXNzIEJveENtZCBleHRlbmRzIENvbW1hbmQuQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlci5Cb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KTtcbiAgICB0aGlzLmNtZCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydjbWQnXSk7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5oZWxwZXIub3BlblRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZCArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIHRoaXMuaGVscGVyLmNsb3NlVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWQuc3BsaXQoXCIgXCIpWzBdICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzO1xuICAgIH1cblxuICAgIHRoaXMuaGVscGVyLmRlY28gPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmRlY287XG4gICAgdGhpcy5oZWxwZXIucGFkID0gMjtcbiAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuc3VmZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG4gIH1cblxuICBoZWlnaHQoKSB7XG4gICAgdmFyIGhlaWdodCwgcGFyYW1zO1xuXG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5ib3VuZHMoKS5oZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IDM7XG4gICAgfVxuXG4gICAgcGFyYW1zID0gWydoZWlnaHQnXTtcblxuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgxKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgaGVpZ2h0KTtcbiAgfVxuXG4gIHdpZHRoKCkge1xuICAgIHZhciBwYXJhbXMsIHdpZHRoO1xuXG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgd2lkdGggPSB0aGlzLmJvdW5kcygpLndpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aWR0aCA9IDM7XG4gICAgfVxuXG4gICAgcGFyYW1zID0gWyd3aWR0aCddO1xuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLm1heCh0aGlzLm1pbldpZHRoKCksIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCB3aWR0aCkpO1xuICB9XG5cbiAgYm91bmRzKCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIGlmICh0aGlzLl9ib3VuZHMgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9ib3VuZHMgPSB0aGlzLmhlbHBlci50ZXh0Qm91bmRzKHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9ib3VuZHM7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHRoaXMuaGVscGVyLmhlaWdodCA9IHRoaXMuaGVpZ2h0KCk7XG4gICAgdGhpcy5oZWxwZXIud2lkdGggPSB0aGlzLndpZHRoKCk7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVyLmRyYXcodGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgfVxuXG4gIG1pbldpZHRoKCkge1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbWQubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxufTtcbkNsb3NlQ21kID0gY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBDb21tYW5kLkJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIgPSBuZXcgQm94SGVscGVyLkJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgYm94LCBib3gyLCBkZXB0aCwgcHJlZml4LCByZXF1aXJlZF9hZmZpeGVzLCBzdWZmaXg7XG4gICAgcHJlZml4ID0gdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJyk7XG4gICAgc3VmZml4ID0gdGhpcy5oZWxwZXIuc3VmZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG4gICAgYm94ID0gdGhpcy5oZWxwZXIuZ2V0Qm94Rm9yUG9zKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkpO1xuICAgIHJlcXVpcmVkX2FmZml4ZXMgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncmVxdWlyZWRfYWZmaXhlcyddLCB0cnVlKTtcblxuICAgIGlmICghcmVxdWlyZWRfYWZmaXhlcykge1xuICAgICAgdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5oZWxwZXIuc3VmZml4ID0gJyc7XG4gICAgICBib3gyID0gdGhpcy5oZWxwZXIuZ2V0Qm94Rm9yUG9zKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkpO1xuXG4gICAgICBpZiAoYm94MiAhPSBudWxsICYmIChib3ggPT0gbnVsbCB8fCBib3guc3RhcnQgPCBib3gyLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCB8fCBib3guZW5kID4gYm94Mi5lbmQgKyBzdWZmaXgubGVuZ3RoKSkge1xuICAgICAgICBib3ggPSBib3gyO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChib3ggIT0gbnVsbCkge1xuICAgICAgZGVwdGggPSB0aGlzLmhlbHBlci5nZXROZXN0ZWRMdmwodGhpcy5pbnN0YW5jZS5nZXRQb3MoKS5zdGFydCk7XG5cbiAgICAgIGlmIChkZXB0aCA8IDIpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5pbkJveCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50LlJlcGxhY2VtZW50KGJveC5zdGFydCwgYm94LmVuZCwgJycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UucmVwbGFjZVdpdGgoJycpO1xuICAgIH1cbiAgfVxuXG59O1xuRWRpdENtZCA9IGNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBDb21tYW5kLkJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB2YXIgcmVmO1xuICAgIHRoaXMuY21kTmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG4gICAgdGhpcy52ZXJiYWxpemUgPSAocmVmID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMV0pKSA9PT0gJ3YnIHx8IHJlZiA9PT0gJ3ZlcmJhbGl6ZSc7XG5cbiAgICBpZiAodGhpcy5jbWROYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpO1xuICAgICAgdGhpcy5maW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2U7XG4gICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lZGl0YWJsZSA9IHRoaXMuY21kICE9IG51bGwgPyB0aGlzLmNtZC5pc0VkaXRhYmxlKCkgOiB0cnVlO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhDb250ZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhvdXRDb250ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0V2l0aENvbnRlbnQoKSB7XG4gICAgdmFyIGRhdGEsIGksIGxlbiwgcCwgcGFyc2VyLCByZWY7XG4gICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgZGF0YSA9IHt9O1xuICAgIHJlZiA9IEVkaXRDbWQucHJvcHM7XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHAgPSByZWZbaV07XG4gICAgICBwLndyaXRlRm9yKHBhcnNlciwgZGF0YSk7XG4gICAgfVxuXG4gICAgQ29tbWFuZC5Db21tYW5kLnNhdmVDbWQodGhpcy5jbWROYW1lLCBkYXRhKTtcblxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHByb3BzRGlzcGxheSgpIHtcbiAgICB2YXIgY21kO1xuICAgIGNtZCA9IHRoaXMuY21kO1xuICAgIHJldHVybiBFZGl0Q21kLnByb3BzLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAuZGlzcGxheShjbWQpO1xuICAgIH0pLmZpbHRlcihmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAgIT0gbnVsbDtcbiAgICB9KS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmVzdWx0V2l0aG91dENvbnRlbnQoKSB7XG4gICAgdmFyIG5hbWUsIHBhcnNlcjtcblxuICAgIGlmICghdGhpcy5jbWQgfHwgdGhpcy5lZGl0YWJsZSkge1xuICAgICAgbmFtZSA9IHRoaXMuY21kID8gdGhpcy5jbWQuZnVsbE5hbWUgOiB0aGlzLmNtZE5hbWU7XG4gICAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQoYH5+Ym94IGNtZDpcIiR7dGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWV9ICR7bmFtZX1cIn5+XFxuJHt0aGlzLnByb3BzRGlzcGxheSgpfVxcbn5+IXNhdmV+fiB+fiFjbG9zZX5+XFxufn4vYm94fn5gKTtcbiAgICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy52ZXJiYWxpemUpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5nZXRUZXh0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn07XG5cbkVkaXRDbWQuc2V0Q21kcyA9IGZ1bmN0aW9uIChiYXNlKSB7XG4gIHZhciBpLCBpbkluc3RhbmNlLCBsZW4sIHAsIHJlZjtcbiAgaW5JbnN0YW5jZSA9IGJhc2UuaW5faW5zdGFuY2UgPSB7XG4gICAgY21kczoge31cbiAgfTtcbiAgcmVmID0gRWRpdENtZC5wcm9wcztcblxuICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBwID0gcmVmW2ldO1xuICAgIHAuc2V0Q21kKGluSW5zdGFuY2UuY21kcyk7XG4gIH0gLy8gcC5zZXRDbWQoYmFzZSlcblxuXG4gIHJldHVybiBiYXNlO1xufTtcblxuRWRpdENtZC5wcm9wcyA9IFtuZXcgRWRpdENtZFByb3AuRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fY2FycmV0Jywge1xuICBvcHQ6ICdjaGVja0NhcnJldCdcbn0pLCBuZXcgRWRpdENtZFByb3AuRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fcGFyc2UnLCB7XG4gIG9wdDogJ3BhcnNlJ1xufSksIG5ldyBFZGl0Q21kUHJvcC5FZGl0Q21kUHJvcC5ib29sKCdwcmV2ZW50X3BhcnNlX2FsbCcsIHtcbiAgb3B0OiAncHJldmVudFBhcnNlQWxsJ1xufSksIG5ldyBFZGl0Q21kUHJvcC5FZGl0Q21kUHJvcC5ib29sKCdyZXBsYWNlX2JveCcsIHtcbiAgb3B0OiAncmVwbGFjZUJveCdcbn0pLCBuZXcgRWRpdENtZFByb3AuRWRpdENtZFByb3Auc3RyaW5nKCduYW1lX3RvX3BhcmFtJywge1xuICBvcHQ6ICduYW1lVG9QYXJhbSdcbn0pLCBuZXcgRWRpdENtZFByb3AuRWRpdENtZFByb3Auc3RyaW5nKCdhbGlhc19vZicsIHtcbiAgdmFyOiAnYWxpYXNPZicsXG4gIGNhcnJldDogdHJ1ZVxufSksIG5ldyBFZGl0Q21kUHJvcC5FZGl0Q21kUHJvcC5zb3VyY2UoJ2hlbHAnLCB7XG4gIGZ1bmN0OiAnaGVscCcsXG4gIHNob3dFbXB0eTogdHJ1ZVxufSksIG5ldyBFZGl0Q21kUHJvcC5FZGl0Q21kUHJvcC5zb3VyY2UoJ3NvdXJjZScsIHtcbiAgdmFyOiAncmVzdWx0U3RyJyxcbiAgZGF0YU5hbWU6ICdyZXN1bHQnLFxuICBzaG93RW1wdHk6IHRydWUsXG4gIGNhcnJldDogdHJ1ZVxufSldO1xuTmFtZVNwYWNlQ21kID0gY2xhc3MgTmFtZVNwYWNlQ21kIGV4dGVuZHMgQ29tbWFuZC5CYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzBdKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgaSwgbGVuLCBuYW1lc3BhY2VzLCBuc3BjLCBwYXJzZXIsIHR4dDtcblxuICAgIGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5uYW1lKTtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZXNwYWNlcyA9IHRoaXMuaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKCk7XG4gICAgICB0eHQgPSAnfn5ib3h+flxcbic7XG5cbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IG5hbWVzcGFjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbnNwYyA9IG5hbWVzcGFjZXNbaV07XG5cbiAgICAgICAgaWYgKG5zcGMgIT09IHRoaXMuaW5zdGFuY2UuY21kLmZ1bGxOYW1lKSB7XG4gICAgICAgICAgdHh0ICs9IG5zcGMgKyAnXFxuJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0eHQgKz0gJ35+IWNsb3NlfH5+XFxufn4vYm94fn4nO1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dCk7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKCk7XG4gICAgfVxuICB9XG5cbn07XG5UZW1wbGF0ZUNtZCA9IGNsYXNzIFRlbXBsYXRlQ21kIGV4dGVuZHMgQ29tbWFuZC5CYXNlQ29tbWFuZCB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gICAgcmV0dXJuIHRoaXMuc2VwID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3NlcCddLCBcIlxcblwiKTtcbiAgfVxuXG4gIHJlc3VsdCgpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0gdGhpcy5uYW1lID8gUGF0aEhlbHBlci5QYXRoSGVscGVyLmdldFBhdGgodGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCB0aGlzLm5hbWUpIDogdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzO1xuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCAmJiBkYXRhICE9IG51bGwgJiYgZGF0YSAhPT0gZmFsc2UpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBkYXRhLm1hcChpdGVtID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZShpdGVtKTtcbiAgICAgICAgfSkuam9pbih0aGlzLnNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZShkYXRhKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRlbXBsYXRlKGRhdGEpIHtcbiAgICB2YXIgcGFyc2VyO1xuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgIHBhcnNlci52YXJzID0gdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgPyBkYXRhIDoge1xuICAgICAgdmFsdWU6IGRhdGFcbiAgICB9O1xuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlO1xuICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgfVxuXG59O1xuRW1tZXRDbWQgPSBjbGFzcyBFbW1ldENtZCBleHRlbmRzIENvbW1hbmQuQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHRoaXMuYWJiciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdhYmJyJywgJ2FiYnJldmlhdGlvbiddKTtcbiAgICByZXR1cm4gdGhpcy5sYW5nID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2xhbmcnLCAnbGFuZ3VhZ2UnXSk7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdmFyIGVtbWV0LCBleCwgcmVzO1xuXG4gICAgZW1tZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuXG4gICAgICBpZiAoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsID8gd2luZG93LmVtbWV0IDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuZW1tZXQ7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IChyZWYgPSB3aW5kb3cuc2VsZikgIT0gbnVsbCA/IHJlZi5lbW1ldCA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnNlbGYuZW1tZXQ7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IChyZWYxID0gd2luZG93Lmdsb2JhbCkgIT0gbnVsbCA/IHJlZjEuZW1tZXQgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nbG9iYWwuZW1tZXQ7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXF1aXJlICE9PSBcInVuZGVmaW5lZFwiICYmIHJlcXVpcmUgIT09IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnZW1tZXQnKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICAgIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUubG9nZ2VyLmxvZygnRW1tZXQgaXMgbm90IGF2YWlsYWJsZSwgaXQgbWF5IG5lZWQgdG8gYmUgaW5zdGFsbGVkIG1hbnVhbGx5Jyk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LmNhbGwodGhpcyk7XG5cbiAgICBpZiAoZW1tZXQgIT0gbnVsbCkge1xuICAgICAgLy8gZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKHRoaXMuYWJiciwgdGhpcy5sYW5nKTtcbiAgICAgIHJldHVybiByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpO1xuICAgIH1cbiAgfVxuXG59O1xuXG4iLCJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuLi9Db21tYW5kXCIpO1xuXG5jb25zdCBCb3hIZWxwZXIgPSByZXF1aXJlKFwiLi4vQm94SGVscGVyXCIpO1xuXG5jb25zdCBFZGl0Q21kUHJvcCA9IHJlcXVpcmUoXCIuLi9FZGl0Q21kUHJvcFwiKTtcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvU3RyaW5nSGVscGVyXCIpO1xuXG5jb25zdCBQYXRoSGVscGVyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvUGF0aEhlbHBlclwiKTtcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKFwiLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnRcIik7XG5cbnZhciBkZWxldGVDb21tYW5kLCByZWFkQ29tbWFuZCwgd3JpdGVDb21tYW5kO1xudmFyIEZpbGVDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBGaWxlQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBjb3JlO1xuICAgIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZC5Db21tYW5kKCdmaWxlJykpO1xuICAgIHJldHVybiBjb3JlLmFkZENtZHMoe1xuICAgICAgXCJyZWFkXCI6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHJlYWRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydmaWxlJ10sXG4gICAgICAgICdoZWxwJzogXCJyZWFkIHRoZSBjb250ZW50IG9mIGEgZmlsZVwiXG4gICAgICB9LFxuICAgICAgXCJ3cml0ZVwiOiB7XG4gICAgICAgICdyZXN1bHQnOiB3cml0ZUNvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2ZpbGUnLCAnY29udGVudCddLFxuICAgICAgICAnaGVscCc6IFwic2F2ZSBpbnRvIGEgZmlsZVwiXG4gICAgICB9LFxuICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAncmVzdWx0JzogZGVsZXRlQ29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnZmlsZSddLFxuICAgICAgICAnaGVscCc6IFwiZGVsZXRlIGEgZmlsZVwiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcbmV4cG9ydHMuRmlsZUNvbW1hbmRQcm92aWRlciA9IEZpbGVDb21tYW5kUHJvdmlkZXI7XG5cbnJlYWRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtO1xuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpO1xuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pO1xuXG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0ucmVhZEZpbGUoZmlsZSk7XG4gIH1cbn07XG5cbndyaXRlQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgY29udGVudCwgZmlsZSwgZmlsZVN5c3RlbTtcbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKTtcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKTtcbiAgY29udGVudCA9IGluc3RhbmNlLmNvbnRlbnQgfHwgaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdjb250ZW50J10pO1xuXG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0ud3JpdGVGaWxlKGZpbGUsIGNvbnRlbnQpO1xuICB9XG59O1xuXG5kZWxldGVDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtO1xuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpO1xuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pO1xuXG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0uZGVsZXRlRmlsZShmaWxlKTtcbiAgfVxufTtcblxuIiwiXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi4vQ29tbWFuZFwiKTtcblxudmFyIEh0bWxDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBIdG1sQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIoY21kcykge1xuICAgIHZhciBjc3MsIGh0bWw7XG4gICAgaHRtbCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kLkNvbW1hbmQoJ2h0bWwnKSk7XG4gICAgaHRtbC5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplbW1ldCcsXG4gICAgICAgICdkZWZhdWx0cyc6IHtcbiAgICAgICAgICAnbGFuZyc6ICdodG1sJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjc3MgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZC5Db21tYW5kKCdjc3MnKSk7XG4gICAgcmV0dXJuIGNzcy5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplbW1ldCcsXG4gICAgICAgICdkZWZhdWx0cyc6IHtcbiAgICAgICAgICAnbGFuZyc6ICdjc3MnXG4gICAgICAgIH0sXG4gICAgICAgICduYW1lVG9QYXJhbSc6ICdhYmJyJ1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5leHBvcnRzLkh0bWxDb21tYW5kUHJvdmlkZXIgPSBIdG1sQ29tbWFuZFByb3ZpZGVyO1xuXG4iLCJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuLi9Db21tYW5kXCIpO1xuXG52YXIgSnNDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBKc0NvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIganM7XG4gICAganMgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZC5Db21tYW5kKCdqcycpKTtcbiAgICBjbWRzLmFkZENtZChuZXcgQ29tbWFuZC5Db21tYW5kKCdqYXZhc2NyaXB0Jywge1xuICAgICAgYWxpYXNPZjogJ2pzJ1xuICAgIH0pKTtcbiAgICByZXR1cm4ganMuYWRkQ21kcyh7XG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICAnaWYnOiAnaWYofCl7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdsb2cnOiAnaWYod2luZG93LmNvbnNvbGUpe1xcblxcdGNvbnNvbGUubG9nKH5+Y29udGVudH5+fClcXG59JyxcbiAgICAgICdmdW5jdGlvbic6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZnVuY3QnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZic6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmb3InOiAnZm9yICh2YXIgaSA9IDA7IGkgPCB8OyBpKyspIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2ZvcmluJzogJ2ZvciAodmFyIHZhbCBpbiB8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgJ2ZvcmVhY2gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmb3JpbidcbiAgICAgIH0sXG4gICAgICAnd2hpbGUnOiAnd2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnd2hpbGVpJzogJ3ZhciBpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG5cXHRpKys7XFxufScsXG4gICAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+Y29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAgICdpZmUnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczppZmVsc2UnXG4gICAgICB9LFxuICAgICAgJ3N3aXRjaCc6IFwic3dpdGNoKCB8ICkgeyBcXG5cXHRjYXNlIDpcXG5cXHRcXHR+fmNvbnRlbnR+flxcblxcdFxcdGJyZWFrO1xcblxcdGRlZmF1bHQgOlxcblxcdFxcdFxcblxcdFxcdGJyZWFrO1xcbn1cIlxuICAgIH0pO1xuICB9XG5cbn07XG5leHBvcnRzLkpzQ29tbWFuZFByb3ZpZGVyID0gSnNDb21tYW5kUHJvdmlkZXI7XG5cbiIsIlxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKFwiLi4vaGVscGVycy9TdHJpbmdIZWxwZXJcIik7XG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi4vQ29tbWFuZFwiKTtcblxuY29uc3QgUGFpckRldGVjdG9yID0gcmVxdWlyZShcIi4uL2RldGVjdG9ycy9QYWlyRGV0ZWN0b3JcIik7XG5cbnZhciB3cmFwV2l0aFBocDtcbnZhciBQaHBDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBQaHBDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIHBocCwgcGhwSW5uZXIsIHBocE91dGVyO1xuICAgIHBocCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kLkNvbW1hbmQoJ3BocCcpKTtcbiAgICBwaHAuYWRkRGV0ZWN0b3IobmV3IFBhaXJEZXRlY3Rvci5QYWlyRGV0ZWN0b3Ioe1xuICAgICAgcmVzdWx0OiAncGhwOmlubmVyJyxcbiAgICAgIG9wZW5lcjogJzw/cGhwJyxcbiAgICAgIGNsb3NlcjogJz8+JyxcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IHRydWUsXG4gICAgICAnZWxzZSc6ICdwaHA6b3V0ZXInXG4gICAgfSkpO1xuICAgIHBocE91dGVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZC5Db21tYW5kKCdvdXRlcicpKTtcbiAgICBwaHBPdXRlci5hZGRDbWRzKHtcbiAgICAgICdmYWxsYmFjayc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ2FueV9jb250ZW50Jzoge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcsXG4gICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICBwcmVmaXg6ICcgPz5cXG4nLFxuICAgICAgICAgICAgICBzdWZmaXg6ICdcXG48P3BocCAnLFxuICAgICAgICAgICAgICBhZmZpeGVzX2VtcHR5OiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOiVuYW1lJScsXG4gICAgICAgIGFsdGVyUmVzdWx0OiB3cmFwV2l0aFBocFxuICAgICAgfSxcbiAgICAgICdib3gnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmJveCcsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nLFxuICAgICAgICAgIHN1ZmZpeDogJ1xcbj8+J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgcGhwOiAnPD9waHBcXG5cXHR+fmNvbnRlbnR+fnxcXG4/PidcbiAgICB9KTtcbiAgICBwaHBJbm5lciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQuQ29tbWFuZCgnaW5uZXInKSk7XG4gICAgcmV0dXJuIHBocElubmVyLmFkZENtZHMoe1xuICAgICAgJ2FueV9jb250ZW50Jzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50J1xuICAgICAgfSxcbiAgICAgICdjb21tZW50JzogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgICdpZic6ICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdpbmZvJzogJ3BocGluZm8oKTsnLFxuICAgICAgJ2VjaG8nOiAnZWNobyB8JyxcbiAgICAgICdlJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmVjaG8nXG4gICAgICB9LFxuICAgICAgJ2NsYXNzJzoge1xuICAgICAgICByZXN1bHQ6IFwiY2xhc3Mgfn5wYXJhbSAwIGNsYXNzIGRlZjp8fn4ge1xcblxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xcblxcdFxcdH5+Y29udGVudH5+fFxcblxcdH1cXG59XCIsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2MnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnXG4gICAgICB9LFxuICAgICAgJ2Z1bmN0aW9uJzoge1xuICAgICAgICByZXN1bHQ6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdmJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgICdhcnJheSc6ICckfCA9IGFycmF5KCk7JyxcbiAgICAgICdhJzogJ2FycmF5KCknLFxuICAgICAgJ2Zvcic6ICdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2ZvcmVhY2gnOiAnZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmb3JlYWNoJ1xuICAgICAgfSxcbiAgICAgICd3aGlsZSc6ICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnd2hpbGVpJzoge1xuICAgICAgICByZXN1bHQ6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgJ2lmZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnXG4gICAgICB9LFxuICAgICAgJ3N3aXRjaCc6IHtcbiAgICAgICAgcmVzdWx0OiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5hbnlfY29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufVwiLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PicsXG4gICAgICAgICAgcmVxdWlyZWRfYWZmaXhlczogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5leHBvcnRzLlBocENvbW1hbmRQcm92aWRlciA9IFBocENvbW1hbmRQcm92aWRlcjtcblxud3JhcFdpdGhQaHAgPSBmdW5jdGlvbiAocmVzdWx0LCBpbnN0YW5jZSkge1xuICB2YXIgaW5saW5lLCByZWdDbG9zZSwgcmVnT3BlbjtcbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywgJ2lubGluZSddLCB0cnVlKTtcblxuICBpZiAoaW5saW5lKSB7XG4gICAgcmVnT3BlbiA9IC88XFw/cGhwXFxzKFtcXFxcblxcXFxyXFxzXSspL2c7XG4gICAgcmVnQ2xvc2UgPSAvKFtcXG5cXHJcXHNdKylcXHNcXD8+L2c7XG4gICAgcmV0dXJuICc8P3BocCAnICsgcmVzdWx0LnJlcGxhY2UocmVnT3BlbiwgJyQxPD9waHAgJykucmVwbGFjZShyZWdDbG9zZSwgJyA/PiQxJykgKyAnID8+JztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJzw/cGhwXFxuJyArIFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nO1xuICB9XG59OyAvLyBjbG9zZVBocEZvckNvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4vLyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICdcblxuIiwiXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi4vQ29tbWFuZFwiKTtcblxuY29uc3QgQWx3YXlzRW5hYmxlZCA9IHJlcXVpcmUoXCIuLi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZFwiKTtcblxudmFyIGluZmxlY3Rpb24gPSBpbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJpbmZsZWN0aW9uXCIpKTtcblxuZnVuY3Rpb24gaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbnZhciBTdHJpbmdDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBTdHJpbmdDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3Rlcihyb290KSB7XG4gICAgdmFyIGNtZHM7XG4gICAgY21kcyA9IHJvb3QuYWRkQ21kKG5ldyBDb21tYW5kLkNvbW1hbmQoJ3N0cmluZycpKTtcbiAgICByb290LmFkZENtZChuZXcgQ29tbWFuZC5Db21tYW5kKCdzdHInLCB7XG4gICAgICBhbGlhc09mOiAnc3RyaW5nJ1xuICAgIH0pKTtcbiAgICByb290LmFkZERldGVjdG9yKG5ldyBBbHdheXNFbmFibGVkLkFsd2F5c0VuYWJsZWQoJ3N0cmluZycpKTtcbiAgICByZXR1cm4gY21kcy5hZGRDbWRzKHtcbiAgICAgICdwbHVyYWxpemUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5wbHVyYWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlBsdXJhbGl6ZSBhIHN0cmluZ1wiXG4gICAgICB9LFxuICAgICAgJ3Npbmd1bGFyaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uc2luZ3VsYXJpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlNpbmd1bGFyaXplIGEgc3RyaW5nXCJcbiAgICAgIH0sXG4gICAgICAnY2FtZWxpemUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5jYW1lbGl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSwgIWluc3RhbmNlLmdldEJvb2xQYXJhbShbMSwgJ2ZpcnN0J10sIHRydWUpKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnc3RyJywgJ2ZpcnN0J10sXG4gICAgICAgICdoZWxwJzogXCJUcmFuc2Zvcm1zIGEgU3RyaW5nIGZyb20gdW5kZXJzY29yZSB0byBjYW1lbGNhc2VcIlxuICAgICAgfSxcbiAgICAgICd1bmRlcnNjb3JlJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24udW5kZXJzY29yZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSwgaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsxLCAndXBwZXInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInLCAndXBwZXInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRyYW5zZm9ybXMgYSBTdHJpbmcgZnJvbSBjYW1lbGNhc2UgdG8gdW5kZXJzY29yZS5cIlxuICAgICAgfSxcbiAgICAgICdodW1hbml6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmh1bWFuaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pLCBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsICdmaXJzdCddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0cicsICdmaXJzdCddLFxuICAgICAgICAnaGVscCc6IFwiVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIGh1bWFuIHJlYWRhYmxlIGZvcm1hdFwiXG4gICAgICB9LFxuICAgICAgJ2NhcGl0YWxpemUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5jYXBpdGFsaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnc3RyJ10sXG4gICAgICAgICdoZWxwJzogXCJNYWtlIHRoZSBmaXJzdCBsZXR0ZXIgb2YgYSBzdHJpbmcgdXBwZXJcIlxuICAgICAgfSxcbiAgICAgICdkYXNoZXJpemUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5kYXNoZXJpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlJlcGxhY2VzIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzIGluIGEgc3RyaW5nLlwiXG4gICAgICB9LFxuICAgICAgJ3RpdGxlaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24udGl0bGVpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSBodW1hbiByZWFkYWJsZSBmb3JtYXQgd2l0aCBtb3N0IHdvcmRzIGNhcGl0YWxpemVkXCJcbiAgICAgIH0sXG4gICAgICAndGFibGVpemUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi50YWJsZWl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0ciddLFxuICAgICAgICAnaGVscCc6IFwiVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIHRhYmxlIGZvcm1hdFwiXG4gICAgICB9LFxuICAgICAgJ2NsYXNzaWZ5Jzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2xhc3NpZnkoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSBjbGFzcyBmb3JtYXRcIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5leHBvcnRzLlN0cmluZ0NvbW1hbmRQcm92aWRlciA9IFN0cmluZ0NvbW1hbmRQcm92aWRlcjtcblxuIiwiXG5cbmNvbnN0IERldGVjdG9yID0gcmVxdWlyZShcIi4vRGV0ZWN0b3JcIik7XG5cbnZhciBBbHdheXNFbmFibGVkID0gY2xhc3MgQWx3YXlzRW5hYmxlZCBleHRlbmRzIERldGVjdG9yLkRldGVjdG9yIHtcbiAgY29uc3RydWN0b3IobmFtZXNwYWNlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcbiAgfVxuXG4gIGRldGVjdChmaW5kZXIpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2U7XG4gIH1cblxufTtcbmV4cG9ydHMuQWx3YXlzRW5hYmxlZCA9IEFsd2F5c0VuYWJsZWQ7XG5cbiIsIlxudmFyIERldGVjdG9yID0gY2xhc3MgRGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhID0ge30pIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICB9XG5cbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIGlmICh0aGlzLmRldGVjdGVkKGZpbmRlcikpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEucmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5yZXN1bHQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuZWxzZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuZWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXRlY3RlZChmaW5kZXIpIHt9XG5cbn07XG5leHBvcnRzLkRldGVjdG9yID0gRGV0ZWN0b3I7XG5cbiIsIlxuXG5jb25zdCBEZXRlY3RvciA9IHJlcXVpcmUoXCIuL0RldGVjdG9yXCIpO1xuXG52YXIgTGFuZ0RldGVjdG9yID0gY2xhc3MgTGFuZ0RldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3IuRGV0ZWN0b3Ige1xuICBkZXRlY3QoZmluZGVyKSB7XG4gICAgdmFyIGxhbmc7XG5cbiAgICBpZiAoZmluZGVyLmNvZGV3YXZlICE9IG51bGwpIHtcbiAgICAgIGxhbmcgPSBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLmdldExhbmcoKTtcblxuICAgICAgaWYgKGxhbmcgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5MYW5nRGV0ZWN0b3IgPSBMYW5nRGV0ZWN0b3I7XG5cbiIsIlxuXG5jb25zdCBQYWlyID0gcmVxdWlyZShcIi4uL3Bvc2l0aW9uaW5nL1BhaXJcIik7XG5cbmNvbnN0IERldGVjdG9yID0gcmVxdWlyZShcIi4vRGV0ZWN0b3JcIik7XG5cbnZhciBQYWlyRGV0ZWN0b3IgPSBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3Rvci5EZXRlY3RvciB7XG4gIGRldGVjdGVkKGZpbmRlcikge1xuICAgIHZhciBwYWlyO1xuXG4gICAgaWYgKHRoaXMuZGF0YS5vcGVuZXIgIT0gbnVsbCAmJiB0aGlzLmRhdGEuY2xvc2VyICE9IG51bGwgJiYgZmluZGVyLmluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHBhaXIgPSBuZXcgUGFpci5QYWlyKHRoaXMuZGF0YS5vcGVuZXIsIHRoaXMuZGF0YS5jbG9zZXIsIHRoaXMuZGF0YSk7XG5cbiAgICAgIGlmIChwYWlyLmlzV2FwcGVyT2YoZmluZGVyLmluc3RhbmNlLmdldFBvcygpLCBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLnRleHQoKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG5leHBvcnRzLlBhaXJEZXRlY3RvciA9IFBhaXJEZXRlY3RvcjtcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IGJvb3RzdHJhcCA9IHJlcXVpcmUoXCIuL2Jvb3RzdHJhcFwiKTtcblxuY29uc3QgVGV4dEFyZWFFZGl0b3IgPSByZXF1aXJlKFwiLi9UZXh0QXJlYUVkaXRvclwiKTtcblxuYm9vdHN0cmFwLkNvZGV3YXZlLmRldGVjdCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgdmFyIGN3O1xuICBjdyA9IG5ldyBib290c3RyYXAuQ29kZXdhdmUobmV3IFRleHRBcmVhRWRpdG9yLlRleHRBcmVhRWRpdG9yKHRhcmdldCkpO1xuXG4gIGJvb3RzdHJhcC5Db2Rld2F2ZS5pbnN0YW5jZXMucHVzaChjdyk7XG5cbiAgcmV0dXJuIGN3O1xufTtcblxuYm9vdHN0cmFwLkNvZGV3YXZlLnJlcXVpcmUgPSByZXF1aXJlO1xud2luZG93LkNvZGV3YXZlID0gYm9vdHN0cmFwLkNvZGV3YXZlO1xuXG4iLCJcbnZhciBBcnJheUhlbHBlciA9IGNsYXNzIEFycmF5SGVscGVyIHtcbiAgc3RhdGljIGlzQXJyYXkoYXJyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9XG5cbiAgc3RhdGljIHVuaW9uKGExLCBhMikge1xuICAgIHJldHVybiB0aGlzLnVuaXF1ZShhMS5jb25jYXQoYTIpKTtcbiAgfVxuXG4gIHN0YXRpYyB1bmlxdWUoYXJyYXkpIHtcbiAgICB2YXIgYSwgaSwgajtcbiAgICBhID0gYXJyYXkuY29uY2F0KCk7XG4gICAgaSA9IDA7XG5cbiAgICB3aGlsZSAoaSA8IGEubGVuZ3RoKSB7XG4gICAgICBqID0gaSArIDE7XG5cbiAgICAgIHdoaWxlIChqIDwgYS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGFbaV0gPT09IGFbal0pIHtcbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgKytqO1xuICAgICAgfVxuXG4gICAgICArK2k7XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG4gIH1cblxufTtcbmV4cG9ydHMuQXJyYXlIZWxwZXIgPSBBcnJheUhlbHBlcjtcblxuIiwiXG52YXIgQ29tbW9uSGVscGVyID0gY2xhc3MgQ29tbW9uSGVscGVyIHtcbiAgc3RhdGljIG1lcmdlKC4uLnhzKSB7XG4gICAgaWYgKCh4cyAhPSBudWxsID8geHMubGVuZ3RoIDogdm9pZCAwKSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcCh7fSwgZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgdmFyIGksIGssIGxlbiwgcmVzdWx0cywgdiwgeDtcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHhzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgeCA9IHhzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0czE7XG4gICAgICAgICAgICByZXN1bHRzMSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGsgaW4geCkge1xuICAgICAgICAgICAgICB2ID0geFtrXTtcbiAgICAgICAgICAgICAgcmVzdWx0czEucHVzaChtW2tdID0gdik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzMTtcbiAgICAgICAgICB9KCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdGFwKG8sIGZuKSB7XG4gICAgZm4obyk7XG4gICAgcmV0dXJuIG87XG4gIH1cblxuICBzdGF0aWMgYXBwbHlNaXhpbnMoZGVyaXZlZEN0b3IsIGJhc2VDdG9ycykge1xuICAgIHJldHVybiBiYXNlQ3RvcnMuZm9yRWFjaChiYXNlQ3RvciA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLCBuYW1lLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2VDdG9yLnByb3RvdHlwZSwgbmFtZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxufTtcbmV4cG9ydHMuQ29tbW9uSGVscGVyID0gQ29tbW9uSGVscGVyO1xuXG4iLCJcbnZhciBOYW1lc3BhY2VIZWxwZXIgPSBjbGFzcyBOYW1lc3BhY2VIZWxwZXIge1xuICBzdGF0aWMgc3BsaXRGaXJzdChmdWxsbmFtZSwgaXNTcGFjZSA9IGZhbHNlKSB7XG4gICAgdmFyIHBhcnRzO1xuXG4gICAgaWYgKGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09PSAtMSAmJiAhaXNTcGFjZSkge1xuICAgICAgcmV0dXJuIFtudWxsLCBmdWxsbmFtZV07XG4gICAgfVxuXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpO1xuICAgIHJldHVybiBbcGFydHMuc2hpZnQoKSwgcGFydHMuam9pbignOicpIHx8IG51bGxdO1xuICB9XG5cbiAgc3RhdGljIHNwbGl0KGZ1bGxuYW1lKSB7XG4gICAgdmFyIG5hbWUsIHBhcnRzO1xuXG4gICAgaWYgKGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09PSAtMSkge1xuICAgICAgcmV0dXJuIFtudWxsLCBmdWxsbmFtZV07XG4gICAgfVxuXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpO1xuICAgIG5hbWUgPSBwYXJ0cy5wb3AoKTtcbiAgICByZXR1cm4gW3BhcnRzLmpvaW4oJzonKSwgbmFtZV07XG4gIH1cblxufTtcbmV4cG9ydHMuTmFtZXNwYWNlSGVscGVyID0gTmFtZXNwYWNlSGVscGVyO1xuXG4iLCJcbnZhciBPcHRpb25hbFByb21pc2UgPSBjbGFzcyBPcHRpb25hbFByb21pc2Uge1xuICBjb25zdHJ1Y3Rvcih2YWwxKSB7XG4gICAgdGhpcy52YWwgPSB2YWwxO1xuXG4gICAgaWYgKHRoaXMudmFsICE9IG51bGwgJiYgdGhpcy52YWwudGhlbiAhPSBudWxsICYmIHRoaXMudmFsLnJlc3VsdCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnZhbCA9IHRoaXMudmFsLnJlc3VsdCgpO1xuICAgIH1cbiAgfVxuXG4gIHRoZW4oY2IpIHtcbiAgICBpZiAodGhpcy52YWwgIT0gbnVsbCAmJiB0aGlzLnZhbC50aGVuICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKHRoaXMudmFsLnRoZW4oY2IpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UoY2IodGhpcy52YWwpKTtcbiAgICB9XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsO1xuICB9XG5cbn07XG5leHBvcnRzLk9wdGlvbmFsUHJvbWlzZSA9IE9wdGlvbmFsUHJvbWlzZTtcblxudmFyIG9wdGlvbmFsUHJvbWlzZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodmFsKTtcbn07XG5cbmV4cG9ydHMub3B0aW9uYWxQcm9taXNlID0gb3B0aW9uYWxQcm9taXNlO1xuXG4iLCJcbnZhciBQYXRoSGVscGVyID0gY2xhc3MgUGF0aEhlbHBlciB7XG4gIHN0YXRpYyBnZXRQYXRoKG9iaiwgcGF0aCwgc2VwID0gJy4nKSB7XG4gICAgdmFyIGN1ciwgcGFydHM7XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcCk7XG4gICAgY3VyID0gb2JqO1xuICAgIHBhcnRzLmZpbmQocGFydCA9PiB7XG4gICAgICBjdXIgPSBjdXJbcGFydF07XG4gICAgICByZXR1cm4gdHlwZW9mIGN1ciA9PT0gXCJ1bmRlZmluZWRcIjtcbiAgICB9KTtcbiAgICByZXR1cm4gY3VyO1xuICB9XG5cbiAgc3RhdGljIHNldFBhdGgob2JqLCBwYXRoLCB2YWwsIHNlcCA9ICcuJykge1xuICAgIHZhciBsYXN0LCBwYXJ0cztcbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKTtcbiAgICBsYXN0ID0gcGFydHMucG9wKCk7XG4gICAgcmV0dXJuIHBhcnRzLnJlZHVjZSgoY3VyLCBwYXJ0KSA9PiB7XG4gICAgICBpZiAoY3VyW3BhcnRdICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGN1cltwYXJ0XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjdXJbcGFydF0gPSB7fTtcbiAgICAgIH1cbiAgICB9LCBvYmopW2xhc3RdID0gdmFsO1xuICB9XG5cbn07XG5leHBvcnRzLlBhdGhIZWxwZXIgPSBQYXRoSGVscGVyO1xuXG4iLCJcblxuY29uc3QgU2l6ZSA9IHJlcXVpcmUoXCIuLi9wb3NpdGlvbmluZy9TaXplXCIpO1xuXG52YXIgU3RyaW5nSGVscGVyID0gY2xhc3MgU3RyaW5nSGVscGVyIHtcbiAgc3RhdGljIHRyaW1FbXB0eUxpbmUodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKC9eXFxzKlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyP1xcblxccyokLywgJycpO1xuICB9XG5cbiAgc3RhdGljIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXRUb0xlbmd0aCh0eHQsIGxlbmd0aCkge1xuICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gdHh0Lmxlbmd0aCkgKyAxKS5qb2luKHR4dCkuc3Vic3RyaW5nKDAsIGxlbmd0aCk7XG4gIH1cblxuICBzdGF0aWMgcmVwZWF0KHR4dCwgbmIpIHtcbiAgICByZXR1cm4gQXJyYXkobmIgKyAxKS5qb2luKHR4dCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0VHh0U2l6ZSh0eHQpIHtcbiAgICB2YXIgaiwgbCwgbGVuLCBsaW5lcywgdztcbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpO1xuICAgIHcgPSAwO1xuXG4gICAgZm9yIChqID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIGwgPSBsaW5lc1tqXTtcbiAgICAgIHcgPSBNYXRoLm1heCh3LCBsLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTaXplLlNpemUodywgbGluZXMubGVuZ3RoIC0gMSk7XG4gIH1cblxuICBzdGF0aWMgaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgdmFyIHJlZztcblxuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IC9cXG4vZztcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCBcIlxcblwiICsgdGhpcy5yZXBlYXQoc3BhY2VzLCBuYikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaW5kZW50KHRleHQsIG5iID0gMSwgc3BhY2VzID0gJyAgJykge1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBzcGFjZXMgKyB0aGlzLmluZGVudE5vdEZpcnN0KHRleHQsIG5iLCBzcGFjZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcmV2ZXJzZVN0cih0eHQpIHtcbiAgICByZXR1cm4gdHh0LnNwbGl0KFwiXCIpLnJldmVyc2UoKS5qb2luKFwiXCIpO1xuICB9XG5cbiAgc3RhdGljIHJlbW92ZUNhcnJldCh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcmVDYXJyZXQsIHJlUXVvdGVkLCByZVRtcCwgdG1wO1xuICAgIHRtcCA9ICdbW1tbcXVvdGVkX2NhcnJldF1dXV0nO1xuICAgIHJlQ2FycmV0ID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyKSwgXCJnXCIpO1xuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICByZVRtcCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAodG1wKSwgXCJnXCIpO1xuICAgIHJldHVybiB0eHQucmVwbGFjZShyZVF1b3RlZCwgdG1wKS5yZXBsYWNlKHJlQ2FycmV0LCAnJykucmVwbGFjZShyZVRtcCwgY2FycmV0Q2hhcik7XG4gIH1cblxuICBzdGF0aWMgZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIHBvcztcbiAgICBwb3MgPSB0aGlzLmdldENhcnJldFBvcyh0eHQsIGNhcnJldENoYXIpO1xuXG4gICAgaWYgKHBvcyAhPSBudWxsKSB7XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAsIHBvcykgKyB0eHQuc3Vic3RyKHBvcyArIGNhcnJldENoYXIubGVuZ3RoKTtcbiAgICAgIHJldHVybiBbcG9zLCB0eHRdO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXRDYXJyZXRQb3ModHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIGksIHJlUXVvdGVkO1xuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKTtcblxuICAgIGlmICgoaSA9IHR4dC5pbmRleE9mKGNhcnJldENoYXIpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cblxufTtcbmV4cG9ydHMuU3RyaW5nSGVscGVyID0gU3RyaW5nSGVscGVyO1xuXG4iLCJcblxuY29uc3QgUG9zID0gcmVxdWlyZShcIi4vUG9zXCIpO1xuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKFwiLi4vaGVscGVycy9TdHJpbmdIZWxwZXJcIik7XG5cbmNvbnN0IFBhaXJNYXRjaCA9IHJlcXVpcmUoXCIuL1BhaXJNYXRjaFwiKTtcblxudmFyIFBhaXIgPSBjbGFzcyBQYWlyIHtcbiAgY29uc3RydWN0b3Iob3BlbmVyLCBjbG9zZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG4gICAgdGhpcy5vcGVuZXIgPSBvcGVuZXI7XG4gICAgdGhpcy5jbG9zZXIgPSBjbG9zZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IGZhbHNlLFxuICAgICAgdmFsaWRNYXRjaDogbnVsbFxuICAgIH07XG5cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XTtcblxuICAgICAgaWYgKGtleSBpbiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5vcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3BlbmVyUmVnKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vcGVuZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm9wZW5lcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuZXI7XG4gICAgfVxuICB9XG5cbiAgY2xvc2VyUmVnKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jbG9zZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNsb3NlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZXI7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BlbmVyOiB0aGlzLm9wZW5lclJlZygpLFxuICAgICAgY2xvc2VyOiB0aGlzLmNsb3NlclJlZygpXG4gICAgfTtcbiAgfVxuXG4gIG1hdGNoQW55UGFydEtleXMoKSB7XG4gICAgdmFyIGtleSwga2V5cywgcmVmLCByZWc7XG4gICAga2V5cyA9IFtdO1xuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpO1xuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XTtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBrZXlzO1xuICB9XG5cbiAgbWF0Y2hBbnlSZWcoKSB7XG4gICAgdmFyIGdyb3Vwcywga2V5LCByZWYsIHJlZztcbiAgICBncm91cHMgPSBbXTtcbiAgICByZWYgPSB0aGlzLm1hdGNoQW55UGFydHMoKTtcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV07XG4gICAgICBncm91cHMucHVzaCgnKCcgKyByZWcuc291cmNlICsgJyknKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChncm91cHMuam9pbignfCcpKTtcbiAgfVxuXG4gIG1hdGNoQW55KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2g7XG5cbiAgICB3aGlsZSAoKG1hdGNoID0gdGhpcy5fbWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkgIT0gbnVsbCAmJiAhbWF0Y2gudmFsaWQoKSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKCk7XG4gICAgfVxuXG4gICAgaWYgKG1hdGNoICE9IG51bGwgJiYgbWF0Y2gudmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgfVxuXG4gIF9tYXRjaEFueSh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoO1xuXG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKG9mZnNldCk7XG4gICAgfVxuXG4gICAgbWF0Y2ggPSB0aGlzLm1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KTtcblxuICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaC5QYWlyTWF0Y2godGhpcywgbWF0Y2gsIG9mZnNldCk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlOYW1lZCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuX21hdGNoQW55R2V0TmFtZSh0aGlzLm1hdGNoQW55KHRleHQpKTtcbiAgfVxuXG4gIG1hdGNoQW55TGFzdCh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoLCByZXM7XG5cbiAgICB3aGlsZSAobWF0Y2ggPSB0aGlzLm1hdGNoQW55KHRleHQsIG9mZnNldCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpO1xuXG4gICAgICBpZiAoIXJlcyB8fCByZXMuZW5kKCkgIT09IG1hdGNoLmVuZCgpKSB7XG4gICAgICAgIHJlcyA9IG1hdGNoO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBpZGVudGljYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVyID09PSB0aGlzLmNsb3NlciB8fCB0aGlzLm9wZW5lci5zb3VyY2UgIT0gbnVsbCAmJiB0aGlzLmNsb3Nlci5zb3VyY2UgIT0gbnVsbCAmJiB0aGlzLm9wZW5lci5zb3VyY2UgPT09IHRoaXMuY2xvc2VyLnNvdXJjZTtcbiAgfVxuXG4gIHdyYXBwZXJQb3MocG9zLCB0ZXh0KSB7XG4gICAgdmFyIGVuZCwgc3RhcnQ7XG4gICAgc3RhcnQgPSB0aGlzLm1hdGNoQW55TGFzdCh0ZXh0LnN1YnN0cigwLCBwb3Muc3RhcnQpKTtcblxuICAgIGlmIChzdGFydCAhPSBudWxsICYmICh0aGlzLmlkZW50aWNhbCgpIHx8IHN0YXJ0Lm5hbWUoKSA9PT0gJ29wZW5lcicpKSB7XG4gICAgICBlbmQgPSB0aGlzLm1hdGNoQW55KHRleHQsIHBvcy5lbmQpO1xuXG4gICAgICBpZiAoZW5kICE9IG51bGwgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgZW5kLm5hbWUoKSA9PT0gJ2Nsb3NlcicpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zLlBvcyhzdGFydC5zdGFydCgpLCBlbmQuZW5kKCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbm5hbF9lbmQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3MuUG9zKHN0YXJ0LnN0YXJ0KCksIHRleHQubGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc1dhcHBlck9mKHBvcywgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZXJQb3MocG9zLCB0ZXh0KSAhPSBudWxsO1xuICB9XG5cbn07XG5leHBvcnRzLlBhaXIgPSBQYWlyO1xuXG4iLCJcbnZhciBQYWlyTWF0Y2ggPSBjbGFzcyBQYWlyTWF0Y2gge1xuICBjb25zdHJ1Y3RvcihwYWlyLCBtYXRjaCwgb2Zmc2V0ID0gMCkge1xuICAgIHRoaXMucGFpciA9IHBhaXI7XG4gICAgdGhpcy5tYXRjaCA9IG1hdGNoO1xuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICB9XG5cbiAgbmFtZSgpIHtcbiAgICB2YXIgX25hbWUsIGdyb3VwLCBpLCBqLCBsZW4sIHJlZjtcblxuICAgIGlmICh0aGlzLm1hdGNoKSB7XG4gICAgICBpZiAodHlwZW9mIF9uYW1lID09PSBcInVuZGVmaW5lZFwiIHx8IF9uYW1lID09PSBudWxsKSB7XG4gICAgICAgIHJlZiA9IHRoaXMubWF0Y2g7XG5cbiAgICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgICBncm91cCA9IHJlZltpXTtcblxuICAgICAgICAgIGlmIChpID4gMCAmJiBncm91cCAhPSBudWxsKSB7XG4gICAgICAgICAgICBfbmFtZSA9IHRoaXMucGFpci5tYXRjaEFueVBhcnRLZXlzKClbaSAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuIF9uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9uYW1lID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfbmFtZSB8fCBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoLmluZGV4ICsgdGhpcy5vZmZzZXQ7XG4gIH1cblxuICBlbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm1hdGNoWzBdLmxlbmd0aCArIHRoaXMub2Zmc2V0O1xuICB9XG5cbiAgdmFsaWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLnBhaXIudmFsaWRNYXRjaCB8fCB0aGlzLnBhaXIudmFsaWRNYXRjaCh0aGlzKTtcbiAgfVxuXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaFswXS5sZW5ndGg7XG4gIH1cblxufTtcbmV4cG9ydHMuUGFpck1hdGNoID0gUGFpck1hdGNoO1xuXG4iLCJcbnZhciBQb3MgPSBjbGFzcyBQb3Mge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgZW5kKSB7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZW5kID0gZW5kO1xuXG4gICAgaWYgKHRoaXMuZW5kID09IG51bGwpIHtcbiAgICAgIHRoaXMuZW5kID0gdGhpcy5zdGFydDtcbiAgICB9XG4gIH1cblxuICBjb250YWluc1B0KHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5lbmQ7XG4gIH1cblxuICBjb250YWluc1Bvcyhwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmVuZDtcbiAgfVxuXG4gIHdyYXBwZWRCeShwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyh0aGlzLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCwgdGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZW5kICsgc3VmZml4Lmxlbmd0aCk7XG4gIH1cblxuICB3aXRoRWRpdG9yKHZhbCkge1xuICAgIHRoaXMuX2VkaXRvciA9IHZhbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGVkaXRvcigpIHtcbiAgICBpZiAodGhpcy5fZWRpdG9yID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZWRpdG9yIHNldCcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9lZGl0b3I7XG4gIH1cblxuICBoYXNFZGl0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvciAhPSBudWxsO1xuICB9XG5cbiAgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKTtcbiAgfVxuXG4gIGFwcGx5T2Zmc2V0KG9mZnNldCkge1xuICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJldkVPTCgpIHtcbiAgICBpZiAodGhpcy5fcHJldkVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9wcmV2RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZVN0YXJ0KHRoaXMuc3RhcnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wcmV2RU9MO1xuICB9XG5cbiAgbmV4dEVPTCgpIHtcbiAgICBpZiAodGhpcy5fbmV4dEVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9uZXh0RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZUVuZCh0aGlzLmVuZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25leHRFT0w7XG4gIH1cblxuICB0ZXh0V2l0aEZ1bGxMaW5lcygpIHtcbiAgICBpZiAodGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGV4dFdpdGhGdWxsTGluZXM7XG4gIH1cblxuICBzYW1lTGluZXNQcmVmaXgoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNQcmVmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMuc3RhcnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNQcmVmaXg7XG4gIH1cblxuICBzYW1lTGluZXNTdWZmaXgoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNTdWZmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5lbmQsIHRoaXMubmV4dEVPTCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzU3VmZml4O1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBQb3ModGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuXG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICByYXcoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnN0YXJ0LCB0aGlzLmVuZF07XG4gIH1cblxufTtcbmV4cG9ydHMuUG9zID0gUG9zO1xuXG4iLCJcblxuY29uc3QgV3JhcHBpbmcgPSByZXF1aXJlKFwiLi9XcmFwcGluZ1wiKTtcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKFwiLi9SZXBsYWNlbWVudFwiKTtcblxuY29uc3QgQ29tbW9uSGVscGVyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvQ29tbW9uSGVscGVyXCIpO1xuXG52YXIgUG9zQ29sbGVjdGlvbiA9IGNsYXNzIFBvc0NvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihhcnIpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgYXJyID0gW2Fycl07XG4gICAgfVxuXG4gICAgQ29tbW9uSGVscGVyLkNvbW1vbkhlbHBlci5hcHBseU1peGlucyhhcnIsIFtQb3NDb2xsZWN0aW9uXSk7XG5cbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgd3JhcChwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIG5ldyBXcmFwcGluZy5XcmFwcGluZyhwLnN0YXJ0LCBwLmVuZCwgcHJlZml4LCBzdWZmaXgpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVwbGFjZSh0eHQpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBuZXcgUmVwbGFjZW1lbnQuUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dCk7XG4gICAgfSk7XG4gIH1cblxufTtcbmV4cG9ydHMuUG9zQ29sbGVjdGlvbiA9IFBvc0NvbGxlY3Rpb247XG5cbiIsIlxuXG5jb25zdCBQb3MgPSByZXF1aXJlKFwiLi9Qb3NcIik7XG5cbmNvbnN0IENvbW1vbkhlbHBlciA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL0NvbW1vbkhlbHBlclwiKTtcblxuY29uc3QgT3B0aW9uT2JqZWN0ID0gcmVxdWlyZShcIi4uL09wdGlvbk9iamVjdFwiKTtcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvU3RyaW5nSGVscGVyXCIpO1xuXG52YXIgUmVwbGFjZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gIGNsYXNzIFJlcGxhY2VtZW50IGV4dGVuZHMgUG9zLlBvcyB7XG4gICAgY29uc3RydWN0b3Ioc3RhcnQxLCBlbmQsIHRleHQxLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQxO1xuICAgICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgICB0aGlzLnRleHQgPSB0ZXh0MTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zLCB7XG4gICAgICAgIHByZWZpeDogJycsXG4gICAgICAgIHN1ZmZpeDogJycsXG4gICAgICAgIHNlbGVjdGlvbnM6IFtdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXNQb3NCZWZvcmVQcmVmaXgoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMudGV4dC5sZW5ndGg7XG4gICAgfVxuXG4gICAgcmVzRW5kKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLmZpbmFsVGV4dCgpLmxlbmd0aDtcbiAgICB9XG5cbiAgICBhcHBseSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnNwbGljZVRleHQodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZmluYWxUZXh0KCkpO1xuICAgIH1cblxuICAgIG5lY2Vzc2FyeSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmFsVGV4dCgpICE9PSB0aGlzLm9yaWdpbmFsVGV4dCgpO1xuICAgIH1cblxuICAgIG9yaWdpbmFsVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICAgIH1cblxuICAgIGZpbmFsVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMudGV4dCArIHRoaXMuc3VmZml4O1xuICAgIH1cblxuICAgIG9mZnNldEFmdGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoIC0gKHRoaXMuZW5kIC0gdGhpcy5zdGFydCk7XG4gICAgfVxuXG4gICAgYXBwbHlPZmZzZXQob2Zmc2V0KSB7XG4gICAgICB2YXIgaSwgbGVuLCByZWYsIHNlbDtcblxuICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0O1xuICAgICAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnM7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgc2VsID0gcmVmW2ldO1xuICAgICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXQ7XG4gICAgICAgICAgc2VsLmVuZCArPSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2VsZWN0Q29udGVudCgpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtuZXcgUG9zLlBvcyh0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0LCB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0ICsgdGhpcy50ZXh0Lmxlbmd0aCldO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2FycmV0VG9TZWwoKSB7XG4gICAgICB2YXIgcG9zLCByZXMsIHN0YXJ0LCB0ZXh0O1xuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW107XG4gICAgICB0ZXh0ID0gdGhpcy5maW5hbFRleHQoKTtcbiAgICAgIHRoaXMucHJlZml4ID0gU3RyaW5nSGVscGVyLlN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5wcmVmaXgpO1xuICAgICAgdGhpcy50ZXh0ID0gU3RyaW5nSGVscGVyLlN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy50ZXh0KTtcbiAgICAgIHRoaXMuc3VmZml4ID0gU3RyaW5nSGVscGVyLlN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5zdWZmaXgpO1xuICAgICAgc3RhcnQgPSB0aGlzLnN0YXJ0O1xuXG4gICAgICB3aGlsZSAoKHJlcyA9IFN0cmluZ0hlbHBlci5TdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgW3BvcywgdGV4dF0gPSByZXM7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3MuUG9zKHN0YXJ0ICsgcG9zLCBzdGFydCArIHBvcykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgdmFyIHJlcztcbiAgICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy50ZXh0LCB0aGlzLmdldE9wdHMoKSk7XG5cbiAgICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpO1xuICAgICAgfVxuXG4gICAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuIHMuY29weSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICB9XG5cbiAgO1xuXG4gIENvbW1vbkhlbHBlci5Db21tb25IZWxwZXIuYXBwbHlNaXhpbnMoUmVwbGFjZW1lbnQucHJvdG90eXBlLCBbT3B0aW9uT2JqZWN0Lk9wdGlvbk9iamVjdF0pO1xuXG4gIHJldHVybiBSZXBsYWNlbWVudDtcbn0uY2FsbCh2b2lkIDApO1xuXG5leHBvcnRzLlJlcGxhY2VtZW50ID0gUmVwbGFjZW1lbnQ7XG5cbiIsIlxudmFyIFNpemUgPSBjbGFzcyBTaXplIHtcbiAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgfVxuXG59O1xuZXhwb3J0cy5TaXplID0gU2l6ZTtcblxuIiwiXG52YXIgU3RyUG9zID0gY2xhc3MgU3RyUG9zIHtcbiAgY29uc3RydWN0b3IocG9zLCBzdHIpIHtcbiAgICB0aGlzLnBvcyA9IHBvcztcbiAgICB0aGlzLnN0ciA9IHN0cjtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGg7XG4gIH1cblxufTtcbmV4cG9ydHMuU3RyUG9zID0gU3RyUG9zO1xuXG4iLCJcblxuY29uc3QgUG9zID0gcmVxdWlyZShcIi4vUG9zXCIpO1xuXG52YXIgV3JhcHBlZFBvcyA9IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3MuUG9zIHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGlubmVyU3RhcnQsIGlubmVyRW5kLCBlbmQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmlubmVyU3RhcnQgPSBpbm5lclN0YXJ0O1xuICAgIHRoaXMuaW5uZXJFbmQgPSBpbm5lckVuZDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQdChwdCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5pbm5lckVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQb3MocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmlubmVyRW5kO1xuICB9XG5cbiAgaW5uZXJUZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kKTtcbiAgfVxuXG4gIHNldElubmVyTGVuKGxlbikge1xuICAgIHJldHVybiB0aGlzLm1vdmVTdWZpeCh0aGlzLmlubmVyU3RhcnQgKyBsZW4pO1xuICB9XG5cbiAgbW92ZVN1ZmZpeChwdCkge1xuICAgIHZhciBzdWZmaXhMZW47XG4gICAgc3VmZml4TGVuID0gdGhpcy5lbmQgLSB0aGlzLmlubmVyRW5kO1xuICAgIHRoaXMuaW5uZXJFbmQgPSBwdDtcbiAgICByZXR1cm4gdGhpcy5lbmQgPSB0aGlzLmlubmVyRW5kICsgc3VmZml4TGVuO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICByZXR1cm4gbmV3IFdyYXBwZWRQb3ModGhpcy5zdGFydCwgdGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kLCB0aGlzLmVuZCk7XG4gIH1cblxufTtcbmV4cG9ydHMuV3JhcHBlZFBvcyA9IFdyYXBwZWRQb3M7XG5cbiIsIlxuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoXCIuL1JlcGxhY2VtZW50XCIpO1xuXG52YXIgV3JhcHBpbmcgPSBjbGFzcyBXcmFwcGluZyBleHRlbmRzIFJlcGxhY2VtZW50LlJlcGxhY2VtZW50IHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGVuZCwgcHJlZml4ID0gJycsIHN1ZmZpeCA9ICcnLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMudGV4dCA9ICcnO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4O1xuICAgIHRoaXMuc3VmZml4ID0gc3VmZml4O1xuICB9XG5cbiAgYXBwbHkoKSB7XG4gICAgdGhpcy5hZGp1c3RTZWwoKTtcbiAgICByZXR1cm4gc3VwZXIuYXBwbHkoKTtcbiAgfVxuXG4gIGFkanVzdFNlbCgpIHtcbiAgICB2YXIgaSwgbGVuLCBvZmZzZXQsIHJlZiwgcmVzdWx0cywgc2VsO1xuICAgIG9mZnNldCA9IHRoaXMub3JpZ2luYWxUZXh0KCkubGVuZ3RoO1xuICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9ucztcbiAgICByZXN1bHRzID0gW107XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNlbCA9IHJlZltpXTtcblxuICAgICAgaWYgKHNlbC5zdGFydCA+IHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGgpIHtcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbC5lbmQgPj0gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHRzLnB1c2goc2VsLmVuZCArPSBvZmZzZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBmaW5hbFRleHQoKSB7XG4gICAgdmFyIHRleHQ7XG5cbiAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgdGV4dCA9IHRoaXMub3JpZ2luYWxUZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0ZXh0ICsgdGhpcy5zdWZmaXg7XG4gIH1cblxuICBvZmZzZXRBZnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdWZmaXgubGVuZ3RoO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBXcmFwcGluZyh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5wcmVmaXgsIHRoaXMuc3VmZml4KTtcbiAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLmNvcHkoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbn07XG5leHBvcnRzLldyYXBwaW5nID0gV3JhcHBpbmc7XG5cbiIsIlxudmFyIExvY2FsU3RvcmFnZUVuZ2luZSA9IGNsYXNzIExvY2FsU3RvcmFnZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBzYXZlKGtleSwgdmFsKSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5mdWxsS2V5KGtleSksIEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0gdGhpcy5sb2FkKHBhdGgpO1xuXG4gICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgZGF0YSA9IHt9O1xuICAgIH1cblxuICAgIGRhdGFba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gdGhpcy5zYXZlKHBhdGgsIGRhdGEpO1xuICB9XG5cbiAgbG9hZChrZXkpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpKSk7XG4gICAgfVxuICB9XG5cbiAgZnVsbEtleShrZXkpIHtcbiAgICByZXR1cm4gJ0NvZGVXYXZlXycgKyBrZXk7XG4gIH1cblxufTtcbmV4cG9ydHMuTG9jYWxTdG9yYWdlRW5naW5lID0gTG9jYWxTdG9yYWdlRW5naW5lO1xuXG4iLCJcbnZhciBDb250ZXh0ID0gY2xhc3MgQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBhcnNlciwgcGFyZW50KSB7XG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZXI7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5jb250ZW50ID0gXCJcIjtcbiAgfVxuXG4gIG9uU3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRBdCA9IHRoaXMucGFyc2VyLnBvcztcbiAgfVxuXG4gIG9uQ2hhcihjaGFyKSB7fVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2V0Q29udGV4dCh0aGlzLnBhcmVudCk7XG4gIH1cblxuICBvbkVuZCgpIHt9XG5cbiAgdGVzdENvbnRleHQoY29udGV4dFR5cGUpIHtcbiAgICBpZiAoY29udGV4dFR5cGUudGVzdCh0aGlzLnBhcnNlci5jaGFyLCB0aGlzKSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLnNldENvbnRleHQobmV3IGNvbnRleHRUeXBlKHRoaXMucGFyc2VyLCB0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRlc3QoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG5leHBvcnRzLkNvbnRleHQgPSBDb250ZXh0O1xuXG4iLCJcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIik7XG5cbnZhciBFc2NhcGVDb250ZXh0ID0gY2xhc3MgRXNjYXBlQ29udGV4dCBleHRlbmRzIENvbnRleHQuQ29udGV4dCB7XG4gIG9uQ2hhcihjaGFyKSB7XG4gICAgdGhpcy5wYXJlbnQuY29udGVudCArPSBjaGFyO1xuICAgIHJldHVybiB0aGlzLmVuZCgpO1xuICB9XG5cbiAgc3RhdGljIHRlc3QoY2hhcikge1xuICAgIHJldHVybiBjaGFyID09PSAnXFxcXCc7XG4gIH1cblxufTtcbmV4cG9ydHMuRXNjYXBlQ29udGV4dCA9IEVzY2FwZUNvbnRleHQ7XG5cbiIsIlxuXG5jb25zdCBQYXJhbUNvbnRleHQgPSByZXF1aXJlKFwiLi9QYXJhbUNvbnRleHRcIik7XG5cbnZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcbnZhciBOYW1lZENvbnRleHQgPSBjbGFzcyBOYW1lZENvbnRleHQgZXh0ZW5kcyBQYXJhbUNvbnRleHQuUGFyYW1Db250ZXh0IHtcbiAgb25TdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5wYXJlbnQuY29udGVudDtcbiAgfVxuXG4gIG9uRW5kKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5uYW1lZFt0aGlzLm5hbWVdID0gdGhpcy5jb250ZW50O1xuICB9XG5cbiAgc3RhdGljIHRlc3QoY2hhciwgcGFyZW50KSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gY2hhciA9PT0gJzonICYmIChwYXJlbnQucGFyc2VyLm9wdGlvbnMuYWxsb3dlZE5hbWVkID09IG51bGwgfHwgKHJlZiA9IHBhcmVudC5jb250ZW50LCBpbmRleE9mLmNhbGwocGFyZW50LnBhcnNlci5vcHRpb25zLmFsbG93ZWROYW1lZCwgcmVmKSA+PSAwKSk7XG4gIH1cblxufTtcbmV4cG9ydHMuTmFtZWRDb250ZXh0ID0gTmFtZWRDb250ZXh0O1xuXG4iLCJcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIik7XG5cbmNvbnN0IFN0cmluZ0NvbnRleHQgPSByZXF1aXJlKFwiLi9TdHJpbmdDb250ZXh0XCIpO1xuXG5jb25zdCBWYXJpYWJsZUNvbnRleHQgPSByZXF1aXJlKFwiLi9WYXJpYWJsZUNvbnRleHRcIik7XG5cbnZhciBQYXJhbUNvbnRleHQgPSBjbGFzcyBQYXJhbUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0LkNvbnRleHQge1xuICBvbkNoYXIoY2hhcikge1xuICAgIGlmICh0aGlzLnRlc3RDb250ZXh0KFN0cmluZ0NvbnRleHQuU3RyaW5nQ29udGV4dCkpIHt9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoUGFyYW1Db250ZXh0Lm5hbWVkKSkge30gZWxzZSBpZiAodGhpcy50ZXN0Q29udGV4dChWYXJpYWJsZUNvbnRleHQuVmFyaWFibGVDb250ZXh0KSkge30gZWxzZSBpZiAoY2hhciA9PT0gJyAnKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2V0Q29udGV4dChuZXcgUGFyYW1Db250ZXh0KHRoaXMucGFyc2VyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgKz0gY2hhcjtcbiAgICB9XG4gIH1cblxuICBvbkVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZXIucGFyYW1zLnB1c2godGhpcy5jb250ZW50KTtcbiAgfVxuXG59O1xuZXhwb3J0cy5QYXJhbUNvbnRleHQgPSBQYXJhbUNvbnRleHQ7XG5cbiIsIlxuXG5jb25zdCBQYXJhbUNvbnRleHQgPSByZXF1aXJlKFwiLi9QYXJhbUNvbnRleHRcIik7XG5cbmNvbnN0IE5hbWVkQ29udGV4dCA9IHJlcXVpcmUoXCIuL05hbWVkQ29udGV4dFwiKTtcblxuUGFyYW1Db250ZXh0LlBhcmFtQ29udGV4dC5uYW1lZCA9IE5hbWVkQ29udGV4dC5OYW1lZENvbnRleHQ7XG52YXIgUGFyYW1QYXJzZXIgPSBjbGFzcyBQYXJhbVBhcnNlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtU3RyaW5nLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnBhcmFtU3RyaW5nID0gcGFyYW1TdHJpbmc7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnBhcnNlKCk7XG4gIH1cblxuICBzZXRDb250ZXh0KGNvbnRleHQpIHtcbiAgICB2YXIgb2xkQ29udGV4dDtcbiAgICBvbGRDb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICBpZiAob2xkQ29udGV4dCAhPSBudWxsICYmIG9sZENvbnRleHQgIT09IChjb250ZXh0ICE9IG51bGwgPyBjb250ZXh0LnBhcmVudCA6IHZvaWQgMCkpIHtcbiAgICAgIG9sZENvbnRleHQub25FbmQoKTtcbiAgICB9XG5cbiAgICBpZiAoY29udGV4dCAhPSBudWxsKSB7XG4gICAgICBjb250ZXh0Lm9uU3RhcnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb250ZXh0O1xuICB9XG5cbiAgcGFyc2UoKSB7XG4gICAgdGhpcy5wYXJhbXMgPSBbXTtcbiAgICB0aGlzLm5hbWVkID0ge307XG5cbiAgICBpZiAodGhpcy5wYXJhbVN0cmluZy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0Q29udGV4dChuZXcgUGFyYW1Db250ZXh0LlBhcmFtQ29udGV4dCh0aGlzKSk7XG4gICAgICB0aGlzLnBvcyA9IDA7XG5cbiAgICAgIHdoaWxlICh0aGlzLnBvcyA8IHRoaXMucGFyYW1TdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY2hhciA9IHRoaXMucGFyYW1TdHJpbmdbdGhpcy5wb3NdO1xuICAgICAgICB0aGlzLmNvbnRleHQub25DaGFyKHRoaXMuY2hhcik7XG4gICAgICAgIHRoaXMucG9zKys7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNldENvbnRleHQobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgdGFrZShuYikge1xuICAgIHJldHVybiB0aGlzLnBhcmFtU3RyaW5nLnN1YnN0cmluZyh0aGlzLnBvcywgdGhpcy5wb3MgKyBuYik7XG4gIH1cblxuICBza2lwKG5iID0gMSkge1xuICAgIHJldHVybiB0aGlzLnBvcyArPSBuYjtcbiAgfVxuXG59O1xuZXhwb3J0cy5QYXJhbVBhcnNlciA9IFBhcmFtUGFyc2VyO1xuXG4iLCJcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIik7XG5cbmNvbnN0IEVzY2FwZUNvbnRleHQgPSByZXF1aXJlKFwiLi9Fc2NhcGVDb250ZXh0XCIpO1xuXG5jb25zdCBWYXJpYWJsZUNvbnRleHQgPSByZXF1aXJlKFwiLi9WYXJpYWJsZUNvbnRleHRcIik7XG5cbnZhciBTdHJpbmdDb250ZXh0ID0gY2xhc3MgU3RyaW5nQ29udGV4dCBleHRlbmRzIENvbnRleHQuQ29udGV4dCB7XG4gIG9uQ2hhcihjaGFyKSB7XG4gICAgaWYgKHRoaXMudGVzdENvbnRleHQoRXNjYXBlQ29udGV4dC5Fc2NhcGVDb250ZXh0KSkge30gZWxzZSBpZiAodGhpcy50ZXN0Q29udGV4dChWYXJpYWJsZUNvbnRleHQuVmFyaWFibGVDb250ZXh0KSkge30gZWxzZSBpZiAoU3RyaW5nQ29udGV4dC5pc0RlbGltaXRlcihjaGFyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgKz0gY2hhcjtcbiAgICB9XG4gIH1cblxuICBvbkVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuY29udGVudCArPSB0aGlzLmNvbnRlbnQ7XG4gIH1cblxuICBzdGF0aWMgdGVzdChjaGFyKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNEZWxpbWl0ZXIoY2hhcik7XG4gIH1cblxuICBzdGF0aWMgaXNEZWxpbWl0ZXIoY2hhcikge1xuICAgIHJldHVybiBjaGFyID09PSAnXCInIHx8IGNoYXIgPT09IFwiJ1wiO1xuICB9XG5cbn07XG5leHBvcnRzLlN0cmluZ0NvbnRleHQgPSBTdHJpbmdDb250ZXh0O1xuXG4iLCJcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIik7XG5cbnZhciBWYXJpYWJsZUNvbnRleHQgPSBjbGFzcyBWYXJpYWJsZUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0LkNvbnRleHQge1xuICBvblN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5za2lwKCk7XG4gIH1cblxuICBvbkNoYXIoY2hhcikge1xuICAgIGlmIChjaGFyID09PSAnfScpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ICs9IGNoYXI7XG4gICAgfVxuICB9XG5cbiAgb25FbmQoKSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuY29udGVudCArPSAoKHJlZiA9IHRoaXMucGFyc2VyLm9wdGlvbnMudmFycykgIT0gbnVsbCA/IHJlZlt0aGlzLmNvbnRlbnRdIDogdm9pZCAwKSB8fCAnJztcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0KGNoYXIsIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQucGFyc2VyLnRha2UoMikgPT09ICcjeyc7XG4gIH1cblxufTtcbmV4cG9ydHMuVmFyaWFibGVDb250ZXh0ID0gVmFyaWFibGVDb250ZXh0O1xuXG4iLCIvKiFcbiAqIGluZmxlY3Rpb25cbiAqIENvcHlyaWdodChjKSAyMDExIEJlbiBMaW4gPGJlbkBkcmVhbWVyc2xhYi5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBBIHBvcnQgb2YgaW5mbGVjdGlvbi1qcyB0byBub2RlLmpzIG1vZHVsZS5cbiAqL1xuXG4oIGZ1bmN0aW9uICggcm9vdCwgZmFjdG9yeSApe1xuICBpZiggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICl7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5ICk7XG4gIH1lbHNlIGlmKCB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfWVsc2V7XG4gICAgcm9vdC5pbmZsZWN0aW9uID0gZmFjdG9yeSgpO1xuICB9XG59KCB0aGlzLCBmdW5jdGlvbiAoKXtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoaXMgaXMgYSBsaXN0IG9mIG5vdW5zIHRoYXQgdXNlIHRoZSBzYW1lIGZvcm0gZm9yIGJvdGggc2luZ3VsYXIgYW5kIHBsdXJhbC5cbiAgICogICAgICAgICAgICAgIFRoaXMgbGlzdCBzaG91bGQgcmVtYWluIGVudGlyZWx5IGluIGxvd2VyIGNhc2UgdG8gY29ycmVjdGx5IG1hdGNoIFN0cmluZ3MuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgdW5jb3VudGFibGVfd29yZHMgPSBbXG4gICAgLy8gJ2FjY2VzcycsXG4gICAgJ2FjY29tbW9kYXRpb24nLFxuICAgICdhZHVsdGhvb2QnLFxuICAgICdhZHZlcnRpc2luZycsXG4gICAgJ2FkdmljZScsXG4gICAgJ2FnZ3Jlc3Npb24nLFxuICAgICdhaWQnLFxuICAgICdhaXInLFxuICAgICdhaXJjcmFmdCcsXG4gICAgJ2FsY29ob2wnLFxuICAgICdhbmdlcicsXG4gICAgJ2FwcGxhdXNlJyxcbiAgICAnYXJpdGhtZXRpYycsXG4gICAgLy8gJ2FydCcsXG4gICAgJ2Fzc2lzdGFuY2UnLFxuICAgICdhdGhsZXRpY3MnLFxuICAgIC8vICdhdHRlbnRpb24nLFxuXG4gICAgJ2JhY29uJyxcbiAgICAnYmFnZ2FnZScsXG4gICAgLy8gJ2JhbGxldCcsXG4gICAgLy8gJ2JlYXV0eScsXG4gICAgJ2JlZWYnLFxuICAgIC8vICdiZWVyJyxcbiAgICAvLyAnYmVoYXZpb3InLFxuICAgICdiaW9sb2d5JyxcbiAgICAvLyAnYmlsbGlhcmRzJyxcbiAgICAnYmxvb2QnLFxuICAgICdib3RhbnknLFxuICAgIC8vICdib3dlbHMnLFxuICAgICdicmVhZCcsXG4gICAgLy8gJ2J1c2luZXNzJyxcbiAgICAnYnV0dGVyJyxcblxuICAgICdjYXJib24nLFxuICAgICdjYXJkYm9hcmQnLFxuICAgICdjYXNoJyxcbiAgICAnY2hhbGsnLFxuICAgICdjaGFvcycsXG4gICAgJ2NoZXNzJyxcbiAgICAnY3Jvc3Nyb2FkcycsXG4gICAgJ2NvdW50cnlzaWRlJyxcblxuICAgIC8vICdkYW1hZ2UnLFxuICAgICdkYW5jaW5nJyxcbiAgICAvLyAnZGFuZ2VyJyxcbiAgICAnZGVlcicsXG4gICAgLy8gJ2RlbGlnaHQnLFxuICAgIC8vICdkZXNzZXJ0JyxcbiAgICAnZGlnbml0eScsXG4gICAgJ2RpcnQnLFxuICAgIC8vICdkaXN0cmlidXRpb24nLFxuICAgICdkdXN0JyxcblxuICAgICdlY29ub21pY3MnLFxuICAgICdlZHVjYXRpb24nLFxuICAgICdlbGVjdHJpY2l0eScsXG4gICAgLy8gJ2VtcGxveW1lbnQnLFxuICAgIC8vICdlbmVyZ3knLFxuICAgICdlbmdpbmVlcmluZycsXG4gICAgJ2Vuam95bWVudCcsXG4gICAgLy8gJ2VudGVydGFpbm1lbnQnLFxuICAgICdlbnZ5JyxcbiAgICAnZXF1aXBtZW50JyxcbiAgICAnZXRoaWNzJyxcbiAgICAnZXZpZGVuY2UnLFxuICAgICdldm9sdXRpb24nLFxuXG4gICAgLy8gJ2ZhaWx1cmUnLFxuICAgIC8vICdmYWl0aCcsXG4gICAgJ2ZhbWUnLFxuICAgICdmaWN0aW9uJyxcbiAgICAvLyAnZmlzaCcsXG4gICAgJ2Zsb3VyJyxcbiAgICAnZmx1JyxcbiAgICAnZm9vZCcsXG4gICAgLy8gJ2ZyZWVkb20nLFxuICAgIC8vICdmcnVpdCcsXG4gICAgJ2Z1ZWwnLFxuICAgICdmdW4nLFxuICAgIC8vICdmdW5lcmFsJyxcbiAgICAnZnVybml0dXJlJyxcblxuICAgICdnYWxsb3dzJyxcbiAgICAnZ2FyYmFnZScsXG4gICAgJ2dhcmxpYycsXG4gICAgLy8gJ2dhcycsXG4gICAgJ2dlbmV0aWNzJyxcbiAgICAvLyAnZ2xhc3MnLFxuICAgICdnb2xkJyxcbiAgICAnZ29sZicsXG4gICAgJ2dvc3NpcCcsXG4gICAgJ2dyYW1tYXInLFxuICAgIC8vICdncmFzcycsXG4gICAgJ2dyYXRpdHVkZScsXG4gICAgJ2dyaWVmJyxcbiAgICAvLyAnZ3JvdW5kJyxcbiAgICAnZ3VpbHQnLFxuICAgICdneW1uYXN0aWNzJyxcblxuICAgIC8vICdoYWlyJyxcbiAgICAnaGFwcGluZXNzJyxcbiAgICAnaGFyZHdhcmUnLFxuICAgICdoYXJtJyxcbiAgICAnaGF0ZScsXG4gICAgJ2hhdHJlZCcsXG4gICAgJ2hlYWx0aCcsXG4gICAgJ2hlYXQnLFxuICAgIC8vICdoZWlnaHQnLFxuICAgICdoZWxwJyxcbiAgICAnaG9tZXdvcmsnLFxuICAgICdob25lc3R5JyxcbiAgICAnaG9uZXknLFxuICAgICdob3NwaXRhbGl0eScsXG4gICAgJ2hvdXNld29yaycsXG4gICAgJ2h1bW91cicsXG4gICAgJ2h1bmdlcicsXG4gICAgJ2h5ZHJvZ2VuJyxcblxuICAgICdpY2UnLFxuICAgICdpbXBvcnRhbmNlJyxcbiAgICAnaW5mbGF0aW9uJyxcbiAgICAnaW5mb3JtYXRpb24nLFxuICAgIC8vICdpbmp1c3RpY2UnLFxuICAgICdpbm5vY2VuY2UnLFxuICAgIC8vICdpbnRlbGxpZ2VuY2UnLFxuICAgICdpcm9uJyxcbiAgICAnaXJvbnknLFxuXG4gICAgJ2phbScsXG4gICAgLy8gJ2plYWxvdXN5JyxcbiAgICAvLyAnamVsbHknLFxuICAgICdqZXdlbHJ5JyxcbiAgICAvLyAnam95JyxcbiAgICAnanVkbycsXG4gICAgLy8gJ2p1aWNlJyxcbiAgICAvLyAnanVzdGljZScsXG5cbiAgICAna2FyYXRlJyxcbiAgICAvLyAna2luZG5lc3MnLFxuICAgICdrbm93bGVkZ2UnLFxuXG4gICAgLy8gJ2xhYm91cicsXG4gICAgJ2xhY2snLFxuICAgIC8vICdsYW5kJyxcbiAgICAnbGF1Z2h0ZXInLFxuICAgICdsYXZhJyxcbiAgICAnbGVhdGhlcicsXG4gICAgJ2xlaXN1cmUnLFxuICAgICdsaWdodG5pbmcnLFxuICAgICdsaW5ndWluZScsXG4gICAgJ2xpbmd1aW5pJyxcbiAgICAnbGluZ3Vpc3RpY3MnLFxuICAgICdsaXRlcmF0dXJlJyxcbiAgICAnbGl0dGVyJyxcbiAgICAnbGl2ZXN0b2NrJyxcbiAgICAnbG9naWMnLFxuICAgICdsb25lbGluZXNzJyxcbiAgICAvLyAnbG92ZScsXG4gICAgJ2x1Y2snLFxuICAgICdsdWdnYWdlJyxcblxuICAgICdtYWNhcm9uaScsXG4gICAgJ21hY2hpbmVyeScsXG4gICAgJ21hZ2ljJyxcbiAgICAvLyAnbWFpbCcsXG4gICAgJ21hbmFnZW1lbnQnLFxuICAgICdtYW5raW5kJyxcbiAgICAnbWFyYmxlJyxcbiAgICAnbWF0aGVtYXRpY3MnLFxuICAgICdtYXlvbm5haXNlJyxcbiAgICAnbWVhc2xlcycsXG4gICAgLy8gJ21lYXQnLFxuICAgIC8vICdtZXRhbCcsXG4gICAgJ21ldGhhbmUnLFxuICAgICdtaWxrJyxcbiAgICAnbWludXMnLFxuICAgICdtb25leScsXG4gICAgLy8gJ21vb3NlJyxcbiAgICAnbXVkJyxcbiAgICAnbXVzaWMnLFxuICAgICdtdW1wcycsXG5cbiAgICAnbmF0dXJlJyxcbiAgICAnbmV3cycsXG4gICAgJ25pdHJvZ2VuJyxcbiAgICAnbm9uc2Vuc2UnLFxuICAgICdudXJ0dXJlJyxcbiAgICAnbnV0cml0aW9uJyxcblxuICAgICdvYmVkaWVuY2UnLFxuICAgICdvYmVzaXR5JyxcbiAgICAvLyAnb2lsJyxcbiAgICAnb3h5Z2VuJyxcblxuICAgIC8vICdwYXBlcicsXG4gICAgLy8gJ3Bhc3Npb24nLFxuICAgICdwYXN0YScsXG4gICAgJ3BhdGllbmNlJyxcbiAgICAvLyAncGVybWlzc2lvbicsXG4gICAgJ3BoeXNpY3MnLFxuICAgICdwb2V0cnknLFxuICAgICdwb2xsdXRpb24nLFxuICAgICdwb3ZlcnR5JyxcbiAgICAvLyAncG93ZXInLFxuICAgICdwcmlkZScsXG4gICAgLy8gJ3Byb2R1Y3Rpb24nLFxuICAgIC8vICdwcm9ncmVzcycsXG4gICAgLy8gJ3Byb251bmNpYXRpb24nLFxuICAgICdwc3ljaG9sb2d5JyxcbiAgICAncHVibGljaXR5JyxcbiAgICAncHVuY3R1YXRpb24nLFxuXG4gICAgLy8gJ3F1YWxpdHknLFxuICAgIC8vICdxdWFudGl0eScsXG4gICAgJ3F1YXJ0eicsXG5cbiAgICAncmFjaXNtJyxcbiAgICAvLyAncmFpbicsXG4gICAgLy8gJ3JlY3JlYXRpb24nLFxuICAgICdyZWxheGF0aW9uJyxcbiAgICAncmVsaWFiaWxpdHknLFxuICAgICdyZXNlYXJjaCcsXG4gICAgJ3Jlc3BlY3QnLFxuICAgICdyZXZlbmdlJyxcbiAgICAncmljZScsXG4gICAgJ3J1YmJpc2gnLFxuICAgICdydW0nLFxuXG4gICAgJ3NhZmV0eScsXG4gICAgLy8gJ3NhbGFkJyxcbiAgICAvLyAnc2FsdCcsXG4gICAgLy8gJ3NhbmQnLFxuICAgIC8vICdzYXRpcmUnLFxuICAgICdzY2VuZXJ5JyxcbiAgICAnc2VhZm9vZCcsXG4gICAgJ3NlYXNpZGUnLFxuICAgICdzZXJpZXMnLFxuICAgICdzaGFtZScsXG4gICAgJ3NoZWVwJyxcbiAgICAnc2hvcHBpbmcnLFxuICAgIC8vICdzaWxlbmNlJyxcbiAgICAnc2xlZXAnLFxuICAgIC8vICdzbGFuZydcbiAgICAnc21va2UnLFxuICAgICdzbW9raW5nJyxcbiAgICAnc25vdycsXG4gICAgJ3NvYXAnLFxuICAgICdzb2Z0d2FyZScsXG4gICAgJ3NvaWwnLFxuICAgIC8vICdzb3Jyb3cnLFxuICAgIC8vICdzb3VwJyxcbiAgICAnc3BhZ2hldHRpJyxcbiAgICAvLyAnc3BlZWQnLFxuICAgICdzcGVjaWVzJyxcbiAgICAvLyAnc3BlbGxpbmcnLFxuICAgIC8vICdzcG9ydCcsXG4gICAgJ3N0ZWFtJyxcbiAgICAvLyAnc3RyZW5ndGgnLFxuICAgICdzdHVmZicsXG4gICAgJ3N0dXBpZGl0eScsXG4gICAgLy8gJ3N1Y2Nlc3MnLFxuICAgIC8vICdzdWdhcicsXG4gICAgJ3N1bnNoaW5lJyxcbiAgICAnc3ltbWV0cnknLFxuXG4gICAgLy8gJ3RlYScsXG4gICAgJ3Rlbm5pcycsXG4gICAgJ3RoaXJzdCcsXG4gICAgJ3RodW5kZXInLFxuICAgICd0aW1iZXInLFxuICAgIC8vICd0aW1lJyxcbiAgICAvLyAndG9hc3QnLFxuICAgIC8vICd0b2xlcmFuY2UnLFxuICAgIC8vICd0cmFkZScsXG4gICAgJ3RyYWZmaWMnLFxuICAgICd0cmFuc3BvcnRhdGlvbicsXG4gICAgLy8gJ3RyYXZlbCcsXG4gICAgJ3RydXN0JyxcblxuICAgIC8vICd1bmRlcnN0YW5kaW5nJyxcbiAgICAndW5kZXJ3ZWFyJyxcbiAgICAndW5lbXBsb3ltZW50JyxcbiAgICAndW5pdHknLFxuICAgIC8vICd1c2FnZScsXG5cbiAgICAndmFsaWRpdHknLFxuICAgICd2ZWFsJyxcbiAgICAndmVnZXRhdGlvbicsXG4gICAgJ3ZlZ2V0YXJpYW5pc20nLFxuICAgICd2ZW5nZWFuY2UnLFxuICAgICd2aW9sZW5jZScsXG4gICAgLy8gJ3Zpc2lvbicsXG4gICAgJ3ZpdGFsaXR5JyxcblxuICAgICd3YXJtdGgnLFxuICAgIC8vICd3YXRlcicsXG4gICAgJ3dlYWx0aCcsXG4gICAgJ3dlYXRoZXInLFxuICAgIC8vICd3ZWlnaHQnLFxuICAgICd3ZWxmYXJlJyxcbiAgICAnd2hlYXQnLFxuICAgIC8vICd3aGlza2V5JyxcbiAgICAvLyAnd2lkdGgnLFxuICAgICd3aWxkbGlmZScsXG4gICAgLy8gJ3dpbmUnLFxuICAgICd3aXNkb20nLFxuICAgIC8vICd3b29kJyxcbiAgICAvLyAnd29vbCcsXG4gICAgLy8gJ3dvcmsnLFxuXG4gICAgLy8gJ3llYXN0JyxcbiAgICAneW9nYScsXG5cbiAgICAnemluYycsXG4gICAgJ3pvb2xvZ3knXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBydWxlcyB0cmFuc2xhdGUgZnJvbSB0aGUgc2luZ3VsYXIgZm9ybSBvZiBhIG5vdW4gdG8gaXRzIHBsdXJhbCBmb3JtLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICB2YXIgcmVnZXggPSB7XG4gICAgcGx1cmFsIDoge1xuICAgICAgbWVuICAgICAgIDogbmV3IFJlZ0V4cCggJ14obXx3b20pZW4kJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBwZW9wbGUgICAgOiBuZXcgUmVnRXhwKCAnKHBlKW9wbGUkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNoaWxkcmVuICA6IG5ldyBSZWdFeHAoICcoY2hpbGQpcmVuJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdGlhICAgICAgIDogbmV3IFJlZ0V4cCggJyhbdGldKWEkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhbmFseXNlcyAgOiBuZXcgUmVnRXhwKCAnKChhKW5hbHl8KGIpYXwoZClpYWdub3wocClhcmVudGhlfChwKXJvZ25vfChzKXlub3B8KHQpaGUpc2VzJCcsJ2dpJyApLFxuICAgICAgaGl2ZXMgICAgIDogbmV3IFJlZ0V4cCggJyhoaXx0aSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjdXJ2ZXMgICAgOiBuZXcgUmVnRXhwKCAnKGN1cnZlKXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGxydmVzICAgICA6IG5ldyBSZWdFeHAoICcoW2xyXSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYXZlcyAgICAgIDogbmV3IFJlZ0V4cCggJyhbYV0pdmVzJCcgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBmb3ZlcyAgICAgOiBuZXcgUmVnRXhwKCAnKFteZm9dKXZlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1vdmllcyAgICA6IG5ldyBSZWdFeHAoICcobSlvdmllcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWVpb3V5aWVzIDogbmV3IFJlZ0V4cCggJyhbXmFlaW91eV18cXUpaWVzJCcgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzZXJpZXMgICAgOiBuZXcgUmVnRXhwKCAnKHMpZXJpZXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHhlcyAgICAgICA6IG5ldyBSZWdFeHAoICcoeHxjaHxzc3xzaCllcyQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWljZSAgICAgIDogbmV3IFJlZ0V4cCggJyhbbXxsXSlpY2UkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBidXNlcyAgICAgOiBuZXcgUmVnRXhwKCAnKGJ1cyllcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9lcyAgICAgICA6IG5ldyBSZWdFeHAoICcobyllcyQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc2hvZXMgICAgIDogbmV3IFJlZ0V4cCggJyhzaG9lKXMkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjcmlzZXMgICAgOiBuZXcgUmVnRXhwKCAnKGNyaXN8YXh8dGVzdCllcyQnICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9jdG9waSAgICA6IG5ldyBSZWdFeHAoICcob2N0b3B8dmlyKWkkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWxpYXNlcyAgIDogbmV3IFJlZ0V4cCggJyhhbGlhc3xjYW52YXN8c3RhdHVzfGNhbXB1cyllcyQnLCAnZ2knICksXG4gICAgICBzdW1tb25zZXMgOiBuZXcgUmVnRXhwKCAnXihzdW1tb25zKWVzJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG94ZW4gICAgICA6IG5ldyBSZWdFeHAoICdeKG94KWVuJyAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWF0cmljZXMgIDogbmV3IFJlZ0V4cCggJyhtYXRyKWljZXMkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB2ZXJ0aWNlcyAgOiBuZXcgUmVnRXhwKCAnKHZlcnR8aW5kKWljZXMkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZlZXQgICAgICA6IG5ldyBSZWdFeHAoICdeZmVldCQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdGVldGggICAgIDogbmV3IFJlZ0V4cCggJ150ZWV0aCQnICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBnZWVzZSAgICAgOiBuZXcgUmVnRXhwKCAnXmdlZXNlJCcgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHF1aXp6ZXMgICA6IG5ldyBSZWdFeHAoICcocXVpeil6ZXMkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgd2hlcmVhc2VzIDogbmV3IFJlZ0V4cCggJ14od2hlcmVhcyllcyQnICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjcml0ZXJpYSAgOiBuZXcgUmVnRXhwKCAnXihjcml0ZXJpKWEkJyAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlbmVyYSAgICA6IG5ldyBSZWdFeHAoICdeZ2VuZXJhJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc3MgICAgICAgIDogbmV3IFJlZ0V4cCggJ3NzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzICAgICAgICAgOiBuZXcgUmVnRXhwKCAncyQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKVxuICAgIH0sXG5cbiAgICBzaW5ndWxhciA6IHtcbiAgICAgIG1hbiAgICAgICA6IG5ldyBSZWdFeHAoICdeKG18d29tKWFuJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHBlcnNvbiAgICA6IG5ldyBSZWdFeHAoICcocGUpcnNvbiQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNoaWxkICAgICA6IG5ldyBSZWdFeHAoICcoY2hpbGQpJCcgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG94ICAgICAgICA6IG5ldyBSZWdFeHAoICdeKG94KSQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGF4aXMgICAgICA6IG5ldyBSZWdFeHAoICcoYXh8dGVzdClpcyQnICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9jdG9wdXMgICA6IG5ldyBSZWdFeHAoICcob2N0b3B8dmlyKXVzJCcgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFsaWFzICAgICA6IG5ldyBSZWdFeHAoICcoYWxpYXN8c3RhdHVzfGNhbnZhc3xjYW1wdXMpJCcsICdnaScgKSxcbiAgICAgIHN1bW1vbnMgICA6IG5ldyBSZWdFeHAoICdeKHN1bW1vbnMpJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1cyAgICAgICA6IG5ldyBSZWdFeHAoICcoYnUpcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1ZmZhbG8gICA6IG5ldyBSZWdFeHAoICcoYnVmZmFsfHRvbWF0fHBvdGF0KW8kJyAgICAgICAsICdnaScgKSxcbiAgICAgIHRpdW0gICAgICA6IG5ldyBSZWdFeHAoICcoW3RpXSl1bSQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHNpcyAgICAgICA6IG5ldyBSZWdFeHAoICdzaXMkJyAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZmZSAgICAgICA6IG5ldyBSZWdFeHAoICcoPzooW15mXSlmZXwoW2xyXSlmKSQnICAgICAgICAsICdnaScgKSxcbiAgICAgIGhpdmUgICAgICA6IG5ldyBSZWdFeHAoICcoaGl8dGkpdmUkJyAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFlaW91eXkgICA6IG5ldyBSZWdFeHAoICcoW15hZWlvdXldfHF1KXkkJyAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHggICAgICAgICA6IG5ldyBSZWdFeHAoICcoeHxjaHxzc3xzaCkkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1hdHJpeCAgICA6IG5ldyBSZWdFeHAoICcobWF0cilpeCQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHZlcnRleCAgICA6IG5ldyBSZWdFeHAoICcodmVydHxpbmQpZXgkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1vdXNlICAgICA6IG5ldyBSZWdFeHAoICcoW218bF0pb3VzZSQnICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZvb3QgICAgICA6IG5ldyBSZWdFeHAoICdeZm9vdCQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHRvb3RoICAgICA6IG5ldyBSZWdFeHAoICdedG9vdGgkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdvb3NlICAgICA6IG5ldyBSZWdFeHAoICdeZ29vc2UkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHF1aXogICAgICA6IG5ldyBSZWdFeHAoICcocXVpeikkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHdoZXJlYXMgICA6IG5ldyBSZWdFeHAoICdeKHdoZXJlYXMpJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXRlcmlvbiA6IG5ldyBSZWdFeHAoICdeKGNyaXRlcmkpb24kJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlbnVzICAgICA6IG5ldyBSZWdFeHAoICdeZ2VudXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHMgICAgICAgICA6IG5ldyBSZWdFeHAoICdzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNvbW1vbiAgICA6IG5ldyBSZWdFeHAoICckJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKVxuICAgIH1cbiAgfTtcblxuICB2YXIgcGx1cmFsX3J1bGVzID0gW1xuXG4gICAgLy8gZG8gbm90IHJlcGxhY2UgaWYgaXRzIGFscmVhZHkgYSBwbHVyYWwgd29yZFxuICAgIFsgcmVnZXgucGx1cmFsLm1lbiAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnBlb3BsZSAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNoaWxkcmVuICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnRpYSAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFuYWx5c2VzICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmhpdmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmN1cnZlcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmxydmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZvdmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFlaW91eWllcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNlcmllcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1vdmllcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnhlcyAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1pY2UgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmJ1c2VzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9lcyAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNob2VzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXNlcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9jdG9waSAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFsaWFzZXMgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnN1bW1vbnNlcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm94ZW4gICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1hdHJpY2VzICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZlZXQgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnRlZXRoICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlZXNlICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnF1aXp6ZXMgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLndoZXJlYXNlcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXRlcmlhICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlbmVyYSAgICBdLFxuXG4gICAgLy8gb3JpZ2luYWwgcnVsZVxuICAgIFsgcmVnZXguc2luZ3VsYXIubWFuICAgICAgLCAnJDFlbicgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnBlcnNvbiAgICwgJyQxb3BsZScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmNoaWxkICAgICwgJyQxcmVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub3ggICAgICAgLCAnJDFlbicgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmF4aXMgICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5vY3RvcHVzICAsICckMWknIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hbGlhcyAgICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc3VtbW9ucyAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmJ1cyAgICAgICwgJyQxc2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVmZmFsbyAgLCAnJDFvZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50aXVtICAgICAsICckMWEnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zaXMgICAgICAsICdzZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mZmUgICAgICAsICckMSQydmVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuaGl2ZSAgICAgLCAnJDF2ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hZWlvdXl5ICAsICckMWllcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm1hdHJpeCAgICwgJyQxaWNlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnZlcnRleCAgICwgJyQxaWNlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnggICAgICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tb3VzZSAgICAsICckMWljZScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmZvb3QgICAgICwgJ2ZlZXQnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50b290aCAgICAsICd0ZWV0aCcgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmdvb3NlICAgICwgJ2dlZXNlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucXVpeiAgICAgLCAnJDF6ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci53aGVyZWFzICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY3JpdGVyaW9uLCAnJDFhJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ2VudXMgICAgLCAnZ2VuZXJhJyBdLFxuXG4gICAgWyByZWdleC5zaW5ndWxhci5zICAgICAsICdzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY29tbW9uLCAncycgXVxuICBdO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhlc2UgcnVsZXMgdHJhbnNsYXRlIGZyb20gdGhlIHBsdXJhbCBmb3JtIG9mIGEgbm91biB0byBpdHMgc2luZ3VsYXIgZm9ybS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBzaW5ndWxhcl9ydWxlcyA9IFtcblxuICAgIC8vIGRvIG5vdCByZXBsYWNlIGlmIGl0cyBhbHJlYWR5IGEgc2luZ3VsYXIgd29yZFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWFuICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucGVyc29uICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY2hpbGQgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub3ggICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYXhpcyAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub2N0b3B1cyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYWxpYXMgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc3VtbW9ucyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVzICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVmZmFsbyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudGl1bSAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc2lzICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZmZlICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuaGl2ZSAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYWVpb3V5eSBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIueCAgICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWF0cml4ICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubW91c2UgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZm9vdCAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudG9vdGggICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ29vc2UgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucXVpeiAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIud2hlcmVhcyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY3JpdGVyaW9uIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nZW51cyBdLFxuXG4gICAgLy8gb3JpZ2luYWwgcnVsZVxuICAgIFsgcmVnZXgucGx1cmFsLm1lbiAgICAgICwgJyQxYW4nIF0sXG4gICAgWyByZWdleC5wbHVyYWwucGVvcGxlICAgLCAnJDFyc29uJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNoaWxkcmVuICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlbmVyYSAgICwgJ2dlbnVzJ10sXG4gICAgWyByZWdleC5wbHVyYWwuY3JpdGVyaWEgLCAnJDFvbiddLFxuICAgIFsgcmVnZXgucGx1cmFsLnRpYSAgICAgICwgJyQxdW0nIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYW5hbHlzZXMgLCAnJDEkMnNpcycgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5oaXZlcyAgICAsICckMXZlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmN1cnZlcyAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmxydmVzICAgICwgJyQxZicgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hdmVzICAgICAsICckMXZlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZvdmVzICAgICwgJyQxZmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubW92aWVzICAgLCAnJDFvdmllJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFlaW91eWllcywgJyQxeScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zZXJpZXMgICAsICckMWVyaWVzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnhlcyAgICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1pY2UgICAgICwgJyQxb3VzZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5idXNlcyAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5vZXMgICAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zaG9lcyAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5jcmlzZXMgICAsICckMWlzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9jdG9waSAgICwgJyQxdXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWxpYXNlcyAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc3VtbW9uc2VzLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwub3hlbiAgICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWF0cmljZXMgLCAnJDFpeCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC52ZXJ0aWNlcyAsICckMWV4JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZlZXQgICAgICwgJ2Zvb3QnIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGVldGggICAgLCAndG9vdGgnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2Vlc2UgICAgLCAnZ29vc2UnIF0sXG4gICAgWyByZWdleC5wbHVyYWwucXVpenplcyAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwud2hlcmVhc2VzLCAnJDEnIF0sXG5cbiAgICBbIHJlZ2V4LnBsdXJhbC5zcywgJ3NzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnMgLCAnJyBdXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGlzIGlzIGEgbGlzdCBvZiB3b3JkcyB0aGF0IHNob3VsZCBub3QgYmUgY2FwaXRhbGl6ZWQgZm9yIHRpdGxlIGNhc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgbm9uX3RpdGxlY2FzZWRfd29yZHMgPSBbXG4gICAgJ2FuZCcsICdvcicsICdub3InLCAnYScsICdhbicsICd0aGUnLCAnc28nLCAnYnV0JywgJ3RvJywgJ29mJywgJ2F0JywnYnknLFxuICAgICdmcm9tJywgJ2ludG8nLCAnb24nLCAnb250bycsICdvZmYnLCAnb3V0JywgJ2luJywgJ292ZXInLCAnd2l0aCcsICdmb3InXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBhcmUgcmVndWxhciBleHByZXNzaW9ucyB1c2VkIGZvciBjb252ZXJ0aW5nIGJldHdlZW4gU3RyaW5nIGZvcm1hdHMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgaWRfc3VmZml4ICAgICAgICAgPSBuZXcgUmVnRXhwKCAnKF9pZHN8X2lkKSQnLCAnZycgKTtcbiAgdmFyIHVuZGVyYmFyICAgICAgICAgID0gbmV3IFJlZ0V4cCggJ18nLCAnZycgKTtcbiAgdmFyIHNwYWNlX29yX3VuZGVyYmFyID0gbmV3IFJlZ0V4cCggJ1tcXCBfXScsICdnJyApO1xuICB2YXIgdXBwZXJjYXNlICAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFtBLVpdKScsICdnJyApO1xuICB2YXIgdW5kZXJiYXJfcHJlZml4ICAgPSBuZXcgUmVnRXhwKCAnXl8nICk7XG5cbiAgdmFyIGluZmxlY3RvciA9IHtcblxuICAvKipcbiAgICogQSBoZWxwZXIgbWV0aG9kIHRoYXQgYXBwbGllcyBydWxlcyBiYXNlZCByZXBsYWNlbWVudCB0byBhIFN0cmluZy5cbiAgICogQHByaXZhdGVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgU3RyaW5nIHRvIG1vZGlmeSBhbmQgcmV0dXJuIGJhc2VkIG9uIHRoZSBwYXNzZWQgcnVsZXMuXG4gICAqIEBwYXJhbSB7QXJyYXk6IFtSZWdFeHAsIFN0cmluZ119IHJ1bGVzIFJlZ2V4cCB0byBtYXRjaCBwYWlyZWQgd2l0aCBTdHJpbmcgdG8gdXNlIGZvciByZXBsYWNlbWVudFxuICAgKiBAcGFyYW0ge0FycmF5OiBbU3RyaW5nXX0gc2tpcCBTdHJpbmdzIHRvIHNraXAgaWYgdGhleSBtYXRjaFxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3ZlcnJpZGUgU3RyaW5nIHRvIHJldHVybiBhcyB0aG91Z2ggdGhpcyBtZXRob2Qgc3VjY2VlZGVkICh1c2VkIHRvIGNvbmZvcm0gdG8gQVBJcylcbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIHBhc3NlZCBTdHJpbmcgbW9kaWZpZWQgYnkgcGFzc2VkIHJ1bGVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdGhpcy5fYXBwbHlfcnVsZXMoICdjb3dzJywgc2luZ3VsYXJfcnVsZXMgKTsgLy8gPT09ICdjb3cnXG4gICAqL1xuICAgIF9hcHBseV9ydWxlcyA6IGZ1bmN0aW9uICggc3RyLCBydWxlcywgc2tpcCwgb3ZlcnJpZGUgKXtcbiAgICAgIGlmKCBvdmVycmlkZSApe1xuICAgICAgICBzdHIgPSBvdmVycmlkZTtcbiAgICAgIH1lbHNle1xuICAgICAgICB2YXIgaWdub3JlID0gKCBpbmZsZWN0b3IuaW5kZXhPZiggc2tpcCwgc3RyLnRvTG93ZXJDYXNlKCkpID4gLTEgKTtcblxuICAgICAgICBpZiggIWlnbm9yZSApe1xuICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICB2YXIgaiA9IHJ1bGVzLmxlbmd0aDtcblxuICAgICAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgICAgICBpZiggc3RyLm1hdGNoKCBydWxlc1sgaSBdWyAwIF0pKXtcbiAgICAgICAgICAgICAgaWYoIHJ1bGVzWyBpIF1bIDEgXSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoIHJ1bGVzWyBpIF1bIDAgXSwgcnVsZXNbIGkgXVsgMSBdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBsZXRzIHVzIGRldGVjdCBpZiBhbiBBcnJheSBjb250YWlucyBhIGdpdmVuIGVsZW1lbnQuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyciBUaGUgc3ViamVjdCBhcnJheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gT2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgQXJyYXkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tX2luZGV4IFN0YXJ0cyBjaGVja2luZyBmcm9tIHRoaXMgcG9zaXRpb24gaW4gdGhlIEFycmF5LihvcHRpb25hbClcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyZV9mdW5jIEZ1bmN0aW9uIHVzZWQgdG8gY29tcGFyZSBBcnJheSBpdGVtIHZzIHBhc3NlZCBpdGVtLihvcHRpb25hbClcbiAgICogQHJldHVybnMge051bWJlcn0gUmV0dXJuIGluZGV4IHBvc2l0aW9uIGluIHRoZSBBcnJheSBvZiB0aGUgcGFzc2VkIGl0ZW0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmRleE9mKFsgJ2hpJywndGhlcmUnIF0sICdndXlzJyApOyAvLyA9PT0gLTFcbiAgICogICAgIGluZmxlY3Rpb24uaW5kZXhPZihbICdoaScsJ3RoZXJlJyBdLCAnaGknICk7IC8vID09PSAwXG4gICAqL1xuICAgIGluZGV4T2YgOiBmdW5jdGlvbiAoIGFyciwgaXRlbSwgZnJvbV9pbmRleCwgY29tcGFyZV9mdW5jICl7XG4gICAgICBpZiggIWZyb21faW5kZXggKXtcbiAgICAgICAgZnJvbV9pbmRleCA9IC0xO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgIHZhciBpICAgICA9IGZyb21faW5kZXg7XG4gICAgICB2YXIgaiAgICAgPSBhcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBpZiggYXJyWyBpIF0gID09PSBpdGVtIHx8IGNvbXBhcmVfZnVuYyAmJiBjb21wYXJlX2Z1bmMoIGFyclsgaSBdLCBpdGVtICkpe1xuICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBwbHVyYWxpemF0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwbHVyYWwgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFNpbmd1bGFyIEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHBsdXJhbCBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAncGVyc29uJyApOyAvLyA9PT0gJ3Blb3BsZSdcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAnb2N0b3B1cycgKTsgLy8gPT09ICdvY3RvcGknXG4gICAqICAgICBpbmZsZWN0aW9uLnBsdXJhbGl6ZSggJ0hhdCcgKTsgLy8gPT09ICdIYXRzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdwZXJzb24nLCAnZ3V5cycgKTsgLy8gPT09ICdndXlzJ1xuICAgKi9cbiAgICBwbHVyYWxpemUgOiBmdW5jdGlvbiAoIHN0ciwgcGx1cmFsICl7XG4gICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBwbHVyYWxfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBwbHVyYWwgKTtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHNpbmd1bGFyaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2luZ3VsYXIgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFBsdXJhbCBFbmdsaXNoIGxhbmd1YWdlIG5vdW5zIGFyZSByZXR1cm5lZCBpbiBzaW5ndWxhciBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uc2luZ3VsYXJpemUoICdwZW9wbGUnICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ29jdG9waScgKTsgLy8gPT09ICdvY3RvcHVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ0hhdHMnICk7IC8vID09PSAnSGF0J1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ2d1eXMnLCAncGVyc29uJyApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICovXG4gICAgc2luZ3VsYXJpemUgOiBmdW5jdGlvbiAoIHN0ciwgc2luZ3VsYXIgKXtcbiAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHNpbmd1bGFyX3J1bGVzLCB1bmNvdW50YWJsZV93b3Jkcywgc2luZ3VsYXIgKTtcbiAgICB9LFxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBwbHVyYWxpemUgb3Igc2luZ3VsYXJsaXplIGEgU3RyaW5nIGFwcHJvcHJpYXRlbHkgYmFzZWQgb24gYW4gaW50ZWdlciB2YWx1ZVxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IFRoZSBudW1iZXIgdG8gYmFzZSBwbHVyYWxpemF0aW9uIG9mZiBvZi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpbmd1bGFyIE92ZXJyaWRlcyBub3JtYWwgb3V0cHV0IHdpdGggc2FpZCBTdHJpbmcuKG9wdGlvbmFsKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGx1cmFsIE92ZXJyaWRlcyBub3JtYWwgb3V0cHV0IHdpdGggc2FpZCBTdHJpbmcuKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBFbmdsaXNoIGxhbmd1YWdlIG5vdW5zIGFyZSByZXR1cm5lZCBpbiB0aGUgcGx1cmFsIG9yIHNpbmd1bGFyIGZvcm0gYmFzZWQgb24gdGhlIGNvdW50LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ3Blb3BsZScgMSApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ29jdG9waScgMSApOyAvLyA9PT0gJ29jdG9wdXMnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdIYXRzJyAxICk7IC8vID09PSAnSGF0J1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnZ3V5cycsIDEgLCAncGVyc29uJyApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ3BlcnNvbicsIDIgKTsgLy8gPT09ICdwZW9wbGUnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdvY3RvcHVzJywgMiApOyAvLyA9PT0gJ29jdG9waSdcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ0hhdCcsIDIgKTsgLy8gPT09ICdIYXRzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVyc29uJywgMiwgbnVsbCwgJ2d1eXMnICk7IC8vID09PSAnZ3V5cydcbiAgICovXG4gICAgaW5mbGVjdCA6IGZ1bmN0aW9uICggc3RyLCBjb3VudCwgc2luZ3VsYXIsIHBsdXJhbCApe1xuICAgICAgY291bnQgPSBwYXJzZUludCggY291bnQsIDEwICk7XG5cbiAgICAgIGlmKCBpc05hTiggY291bnQgKSkgcmV0dXJuIHN0cjtcblxuICAgICAgaWYoIGNvdW50ID09PSAwIHx8IGNvdW50ID4gMSApe1xuICAgICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBwbHVyYWxfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBwbHVyYWwgKTtcbiAgICAgIH1lbHNle1xuICAgICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBzaW5ndWxhcl9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHNpbmd1bGFyICk7XG4gICAgICB9XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBjYW1lbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBsb3dfZmlyc3RfbGV0dGVyIERlZmF1bHQgaXMgdG8gY2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSByZXN1bHRzLihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCBsb3dlcmNhc2UgaXQuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IExvd2VyIGNhc2UgdW5kZXJzY29yZWQgd29yZHMgd2lsbCBiZSByZXR1cm5lZCBpbiBjYW1lbCBjYXNlLlxuICAgKiAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxseSAnLycgaXMgdHJhbnNsYXRlZCB0byAnOjonXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5jYW1lbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlUHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uY2FtZWxpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZVByb3BlcnRpZXMnXG4gICAqL1xuICAgIGNhbWVsaXplIDogZnVuY3Rpb24gKCBzdHIsIGxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgIHZhciBzdHJfcGF0aCA9IHN0ci5zcGxpdCggJy8nICk7XG4gICAgICB2YXIgaSAgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgID0gc3RyX3BhdGgubGVuZ3RoO1xuICAgICAgdmFyIHN0cl9hcnIsIGluaXRfeCwgaywgbCwgZmlyc3Q7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIHN0cl9hcnIgPSBzdHJfcGF0aFsgaSBdLnNwbGl0KCAnXycgKTtcbiAgICAgICAgayAgICAgICA9IDA7XG4gICAgICAgIGwgICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcblxuICAgICAgICBmb3IoIDsgayA8IGw7IGsrKyApe1xuICAgICAgICAgIGlmKCBrICE9PSAwICl7XG4gICAgICAgICAgICBzdHJfYXJyWyBrIF0gPSBzdHJfYXJyWyBrIF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmaXJzdCA9IHN0cl9hcnJbIGsgXS5jaGFyQXQoIDAgKTtcbiAgICAgICAgICBmaXJzdCA9IGxvd19maXJzdF9sZXR0ZXIgJiYgaSA9PT0gMCAmJiBrID09PSAwXG4gICAgICAgICAgICA/IGZpcnN0LnRvTG93ZXJDYXNlKCkgOiBmaXJzdC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgIHN0cl9hcnJbIGsgXSA9IGZpcnN0ICsgc3RyX2FyclsgayBdLnN1YnN0cmluZyggMSApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyX3BhdGhbIGkgXSA9IHN0cl9hcnIuam9pbiggJycgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9wYXRoLmpvaW4oICc6OicgKTtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHVuZGVyc2NvcmUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGxfdXBwZXJfY2FzZSBEZWZhdWx0IGlzIHRvIGxvd2VyY2FzZSBhbmQgYWRkIHVuZGVyc2NvcmUgcHJlZml4LihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCByZXR1cm4gYXMgZW50ZXJlZC5cbiAgICogQHJldHVybnMge1N0cmluZ30gQ2FtZWwgY2FzZWQgd29yZHMgYXJlIHJldHVybmVkIGFzIGxvd2VyIGNhc2VkIGFuZCB1bmRlcnNjb3JlZC5cbiAgICogICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsbHkgJzo6JyBpcyB0cmFuc2xhdGVkIHRvICcvJy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdNZXNzYWdlUHJvcGVydGllcycgKTsgLy8gPT09ICdtZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdtZXNzYWdlUHJvcGVydGllcycgKTsgLy8gPT09ICdtZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdNUCcsIHRydWUgKTsgLy8gPT09ICdNUCdcbiAgICovXG4gICAgdW5kZXJzY29yZSA6IGZ1bmN0aW9uICggc3RyLCBhbGxfdXBwZXJfY2FzZSApe1xuICAgICAgaWYoIGFsbF91cHBlcl9jYXNlICYmIHN0ciA9PT0gc3RyLnRvVXBwZXJDYXNlKCkpIHJldHVybiBzdHI7XG5cbiAgICAgIHZhciBzdHJfcGF0aCA9IHN0ci5zcGxpdCggJzo6JyApO1xuICAgICAgdmFyIGkgICAgICAgID0gMDtcbiAgICAgIHZhciBqICAgICAgICA9IHN0cl9wYXRoLmxlbmd0aDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgc3RyX3BhdGhbIGkgXSA9IHN0cl9wYXRoWyBpIF0ucmVwbGFjZSggdXBwZXJjYXNlLCAnXyQxJyApO1xuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX3BhdGhbIGkgXS5yZXBsYWNlKCB1bmRlcmJhcl9wcmVmaXgsICcnICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJfcGF0aC5qb2luKCAnLycgKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgaHVtYW5pemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBsb3dfZmlyc3RfbGV0dGVyIERlZmF1bHQgaXMgdG8gY2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSByZXN1bHRzLihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCBsb3dlcmNhc2UgaXQuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IExvd2VyIGNhc2UgdW5kZXJzY29yZWQgd29yZHMgd2lsbCBiZSByZXR1cm5lZCBpbiBodW1hbml6ZWQgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmh1bWFuaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UgcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uaHVtYW5pemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBodW1hbml6ZSA6IGZ1bmN0aW9uICggc3RyLCBsb3dfZmlyc3RfbGV0dGVyICl7XG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCBpZF9zdWZmaXgsICcnICk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSggdW5kZXJiYXIsICcgJyApO1xuXG4gICAgICBpZiggIWxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgICAgc3RyID0gaW5mbGVjdG9yLmNhcGl0YWxpemUoIHN0ciApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgY2FwaXRhbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gQWxsIGNoYXJhY3RlcnMgd2lsbCBiZSBsb3dlciBjYXNlIGFuZCB0aGUgZmlyc3Qgd2lsbCBiZSB1cHBlci5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNhcGl0YWxpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZV9wcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5jYXBpdGFsaXplKCAnbWVzc2FnZSBwcm9wZXJ0aWVzJywgdHJ1ZSApOyAvLyA9PT0gJ01lc3NhZ2UgcHJvcGVydGllcydcbiAgICovXG4gICAgY2FwaXRhbGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcblxuICAgICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZyggMSApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHJlcGxhY2VzIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzIGluIHRoZSBzdHJpbmcuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXBsYWNlcyBhbGwgc3BhY2VzIG9yIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uZGFzaGVyaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2UtcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uZGFzaGVyaXplKCAnTWVzc2FnZSBQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UtUHJvcGVydGllcydcbiAgICovXG4gICAgZGFzaGVyaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSggc3BhY2Vfb3JfdW5kZXJiYXIsICctJyApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGl0bGVpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gQ2FwaXRhbGl6ZXMgd29yZHMgYXMgeW91IHdvdWxkIGZvciBhIGJvb2sgdGl0bGUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50aXRsZWl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlIFByb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnRpdGxlaXplKCAnbWVzc2FnZSBwcm9wZXJ0aWVzIHRvIGtlZXAnICk7IC8vID09PSAnTWVzc2FnZSBQcm9wZXJ0aWVzIHRvIEtlZXAnXG4gICAqL1xuICAgIHRpdGxlaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciAgICAgICAgID0gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSggdW5kZXJiYXIsICcgJyApO1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICcgJyApO1xuICAgICAgdmFyIGkgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcbiAgICAgIHZhciBkLCBrLCBsO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBkID0gc3RyX2FyclsgaSBdLnNwbGl0KCAnLScgKTtcbiAgICAgICAgayA9IDA7XG4gICAgICAgIGwgPSBkLmxlbmd0aDtcblxuICAgICAgICBmb3IoIDsgayA8IGw7IGsrKyl7XG4gICAgICAgICAgaWYoIGluZmxlY3Rvci5pbmRleE9mKCBub25fdGl0bGVjYXNlZF93b3JkcywgZFsgayBdLnRvTG93ZXJDYXNlKCkpIDwgMCApe1xuICAgICAgICAgICAgZFsgayBdID0gaW5mbGVjdG9yLmNhcGl0YWxpemUoIGRbIGsgXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RyX2FyclsgaSBdID0gZC5qb2luKCAnLScgKTtcbiAgICAgIH1cblxuICAgICAgc3RyID0gc3RyX2Fyci5qb2luKCAnICcgKTtcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZyggMSApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgZGVtb2R1bGl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZW1vdmVzIG1vZHVsZSBuYW1lcyBsZWF2aW5nIG9ubHkgY2xhc3MgbmFtZXMuKFJ1Ynkgc3R5bGUpXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5kZW1vZHVsaXplKCAnTWVzc2FnZTo6QnVzOjpQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ1Byb3BlcnRpZXMnXG4gICAqL1xuICAgIGRlbW9kdWxpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICc6OicgKTtcblxuICAgICAgcmV0dXJuIHN0cl9hcnJbIHN0cl9hcnIubGVuZ3RoIC0gMSBdO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGFibGVpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIGNhbWVsIGNhc2VkIHdvcmRzIGludG8gdGhlaXIgdW5kZXJzY29yZWQgcGx1cmFsIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50YWJsZWl6ZSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICB0YWJsZWl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IudW5kZXJzY29yZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IucGx1cmFsaXplKCBzdHIgKTtcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNsYXNzaWZpY2F0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFVuZGVyc2NvcmVkIHBsdXJhbCBub3VucyBiZWNvbWUgdGhlIGNhbWVsIGNhc2VkIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5jbGFzc2lmeSggJ21lc3NhZ2VfYnVzX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZUJ1c1Byb3BlcnR5J1xuICAgKi9cbiAgICBjbGFzc2lmeSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IuY2FtZWxpemUoIHN0ciApO1xuICAgICAgc3RyID0gaW5mbGVjdG9yLnNpbmd1bGFyaXplKCBzdHIgKTtcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGZvcmVpZ24ga2V5IHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZHJvcF9pZF91YmFyIERlZmF1bHQgaXMgdG8gc2VwZXJhdGUgaWQgd2l0aCBhbiB1bmRlcmJhciBhdCB0aGUgZW5kIG9mIHRoZSBjbGFzcyBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW91IGNhbiBwYXNzIHRydWUgdG8gc2tpcCBpdC4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFVuZGVyc2NvcmVkIHBsdXJhbCBub3VucyBiZWNvbWUgdGhlIGNhbWVsIGNhc2VkIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5mb3JlaWduX2tleSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0eV9pZCdcbiAgICogICAgIGluZmxlY3Rpb24uZm9yZWlnbl9rZXkoICdNZXNzYWdlQnVzUHJvcGVydHknLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZV9idXNfcHJvcGVydHlpZCdcbiAgICovXG4gICAgZm9yZWlnbl9rZXkgOiBmdW5jdGlvbiAoIHN0ciwgZHJvcF9pZF91YmFyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IuZGVtb2R1bGl6ZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IudW5kZXJzY29yZSggc3RyICkgKyAoKCBkcm9wX2lkX3ViYXIgKSA/ICggJycgKSA6ICggJ18nICkpICsgJ2lkJztcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIG9yZGluYWxpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIGFsbCBmb3VuZCBudW1iZXJzIHRoZWlyIHNlcXVlbmNlIGxpa2UgJzIybmQnLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24ub3JkaW5hbGl6ZSggJ3RoZSAxIHBpdGNoJyApOyAvLyA9PT0gJ3RoZSAxc3QgcGl0Y2gnXG4gICAqL1xuICAgIG9yZGluYWxpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICcgJyApO1xuICAgICAgdmFyIGkgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgdmFyIGsgPSBwYXJzZUludCggc3RyX2FyclsgaSBdLCAxMCApO1xuXG4gICAgICAgIGlmKCAhaXNOYU4oIGsgKSl7XG4gICAgICAgICAgdmFyIGx0ZCA9IHN0cl9hcnJbIGkgXS5zdWJzdHJpbmcoIHN0cl9hcnJbIGkgXS5sZW5ndGggLSAyICk7XG4gICAgICAgICAgdmFyIGxkICA9IHN0cl9hcnJbIGkgXS5zdWJzdHJpbmcoIHN0cl9hcnJbIGkgXS5sZW5ndGggLSAxICk7XG4gICAgICAgICAgdmFyIHN1ZiA9ICd0aCc7XG5cbiAgICAgICAgICBpZiggbHRkICE9ICcxMScgJiYgbHRkICE9ICcxMicgJiYgbHRkICE9ICcxMycgKXtcbiAgICAgICAgICAgIGlmKCBsZCA9PT0gJzEnICl7XG4gICAgICAgICAgICAgIHN1ZiA9ICdzdCc7XG4gICAgICAgICAgICB9ZWxzZSBpZiggbGQgPT09ICcyJyApe1xuICAgICAgICAgICAgICBzdWYgPSAnbmQnO1xuICAgICAgICAgICAgfWVsc2UgaWYoIGxkID09PSAnMycgKXtcbiAgICAgICAgICAgICAgc3VmID0gJ3JkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdHJfYXJyWyBpIF0gKz0gc3VmO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJfYXJyLmpvaW4oICcgJyApO1xuICAgIH0sXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gcGVyZm9ybXMgbXVsdGlwbGUgaW5mbGVjdGlvbiBtZXRob2RzIG9uIGEgc3RyaW5nXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnIgQW4gYXJyYXkgb2YgaW5mbGVjdGlvbiBtZXRob2RzLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24udHJhbnNmb3JtKCAnYWxsIGpvYicsIFsgJ3BsdXJhbGl6ZScsICdjYXBpdGFsaXplJywgJ2Rhc2hlcml6ZScgXSk7IC8vID09PSAnQWxsLWpvYnMnXG4gICAqL1xuICAgIHRyYW5zZm9ybSA6IGZ1bmN0aW9uICggc3RyLCBhcnIgKXtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHZhciBqID0gYXJyLmxlbmd0aDtcblxuICAgICAgZm9yKCA7aSA8IGo7IGkrKyApe1xuICAgICAgICB2YXIgbWV0aG9kID0gYXJyWyBpIF07XG5cbiAgICAgICAgaWYoIGluZmxlY3Rvci5oYXNPd25Qcm9wZXJ0eSggbWV0aG9kICkpe1xuICAgICAgICAgIHN0ciA9IGluZmxlY3RvclsgbWV0aG9kIF0oIHN0ciApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuICBpbmZsZWN0b3IudmVyc2lvbiA9ICcxLjEyLjAnO1xuXG4gIHJldHVybiBpbmZsZWN0b3I7XG59KSk7XG4iXX0=
