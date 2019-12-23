(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringHelper = require("./helpers/StringHelper").StringHelper;

var ArrayHelper = require("./helpers/ArrayHelper").ArrayHelper;

var Pair = require("./positioning/Pair").Pair;

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
      return StringHelper.repeatToLength(this.deco, len);
    }
  }, {
    key: "padding",
    value: function padding() {
      return StringHelper.repeatToLength(" ", this.pad);
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
      return StringHelper.repeatToLength(" ", this.indent) + this.wrapComment(this.deco + this.padding() + text + StringHelper.repeatToLength(" ", this.width - this.removeIgnoredContent(text).length) + this.padding() + this.deco);
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
      return StringHelper.getTxtSize(this.removeIgnoredContent(text));
    }
  }, {
    key: "getBoxForPos",
    value: function getBoxForPos(pos) {
      var _this = this;

      var clone, curLeft, depth, endFind, left, pair, placeholder, res, startFind;
      depth = this.getNestedLvl(pos.start);

      if (depth > 0) {
        left = this.left();
        curLeft = StringHelper.repeat(left, depth - 1);
        clone = this.clone();
        placeholder = "###PlaceHolder###";
        clone.width = placeholder.length;
        clone.openText = clone.closeText = this.deco + this.deco + placeholder + this.deco + this.deco;
        startFind = RegExp(StringHelper.escapeRegExp(curLeft + clone.startSep()).replace(placeholder, '.*'));
        endFind = RegExp(StringHelper.escapeRegExp(curLeft + clone.endSep()).replace(placeholder, '.*'));
        pair = new Pair(startFind, endFind, {
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
      rStart = new RegExp("(\\s*)(" + StringHelper.escapeRegExp(this.context.wrapCommentLeft(this.deco)) + ")(\\s*)");
      rEnd = new RegExp("(\\s*)(" + StringHelper.escapeRegExp(this.context.wrapCommentRight(this.deco)) + ")(\n|$)");
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
        ecl = StringHelper.escapeRegExp(this.context.wrapCommentLeft());
        ecr = StringHelper.escapeRegExp(this.context.wrapCommentRight());
        ed = StringHelper.escapeRegExp(this.deco);
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

var PosCollection = require("./positioning/PosCollection").PosCollection;

var Replacement = require("./positioning/Replacement").Replacement;

var Pos = require("./positioning/Pos").Pos;

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
    this.selections = new PosCollection(selections);
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
          repl = new Replacement(end.innerStart, end.innerEnd, res);
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
          replacements.push(new Replacement(start.start, end.end, this.codewave.editor.textSubstr(start.end + 1, end.start - 1)).selectContent());
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
      return new Pos(this.replacements[index].selections[0].start + this.typed().length * (index * 2), this.replacements[index].selections[0].end + this.typed().length * (index * 2 + 1)).wrappedBy(this.codewave.brakets, this.codewave.brakets);
    }
  }, {
    key: "endPosAt",
    value: function endPosAt(index) {
      return new Pos(this.replacements[index].selections[1].start + this.typed().length * (index * 2 + 1), this.replacements[index].selections[1].end + this.typed().length * (index * 2 + 2)).wrappedBy(this.codewave.brakets + this.codewave.closeChar, this.codewave.brakets);
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
          repl = new Replacement(curClose.start, curClose.end, targetText);

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

var NamespaceHelper = require("./helpers/NamespaceHelper").NamespaceHelper;

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

        var _NamespaceHelper$spli = NamespaceHelper.splitFirst(name);

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

      var _NamespaceHelper$spli3 = NamespaceHelper.splitFirst(namespace, true);

      var _NamespaceHelper$spli4 = _slicedToArray(_NamespaceHelper$spli3, 2);

      space = _NamespaceHelper$spli4[0];
      rest = _NamespaceHelper$spli4[1];
      return this.names.map(function (name) {
        var cur_rest, cur_space;

        var _NamespaceHelper$spli5 = NamespaceHelper.splitFirst(name);

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

        var _NamespaceHelper$spli7 = NamespaceHelper.splitFirst(nspc, true);

        var _NamespaceHelper$spli8 = _slicedToArray(_NamespaceHelper$spli7, 2);

        nspcName = _NamespaceHelper$spli8[0];
        rest = _NamespaceHelper$spli8[1];
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

var TextParser = require("./TextParser").TextParser;

var StringHelper = require("./helpers/StringHelper").StringHelper;

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
      parser = new Codewave.Codewave(new TextParser(txt), {
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
      return StringHelper.indentNotFirst(text, this.getIndent(), " ");
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

var Process = require("./Process").Process;

var Context = require("./Context");

var PositionedCmdInstance = require("./PositionedCmdInstance").PositionedCmdInstance;

var TextParser = require("./TextParser").TextParser;

var Command = require("./Command");

var Logger = require("./Logger").Logger;

var PosCollection = require("./positioning/PosCollection").PosCollection;

var StringHelper = require("./helpers/StringHelper").StringHelper;

var ClosingPromp = require("./ClosingPromp").ClosingPromp;

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

      this.logger = new Logger();
    }

    _createClass(Codewave, [{
      key: "onActivationKey",
      value: function onActivationKey() {
        var _this = this;

        this.process = new Process();
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

        return new PositionedCmdInstance(this, prev, this.editor.textSubstr(prev, next + this.brakets.length));
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
              return new PositionedCmdInstance(this, beginning, this.editor.textSubstr(beginning, f.pos + this.brakets.length));
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
        pos = new PosCollection(pos);
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

        return this.closingPromp = ClosingPromp.newFor(this, selections).begin();
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
            parser = new Codewave(new TextParser(cmd.content), {
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
        return StringHelper.removeCarret(txt, this.carretChar);
      }
    }, {
      key: "getCarretPos",
      value: function getCarretPos(txt) {
        return StringHelper.getCarretPos(txt, this.carretChar);
      }
    }, {
      key: "regMarker",
      value: function regMarker() {
        var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "g";
        return new RegExp(StringHelper.escapeRegExp(this.marker), flags);
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

var Storage = require("./Storage").Storage;

var NamespaceHelper = require("./helpers/NamespaceHelper").NamespaceHelper;

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

        var _NamespaceHelper$spli = NamespaceHelper.splitFirst(fullname);

        var _NamespaceHelper$spli2 = _slicedToArray(_NamespaceHelper$spli, 2);

        space = _NamespaceHelper$spli2[0];
        name = _NamespaceHelper$spli2[1];

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

        var _NamespaceHelper$spli3 = NamespaceHelper.splitFirst(fullname);

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
  Command.storage = new Storage();
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

var ArrayHelper = require("./helpers/ArrayHelper").ArrayHelper;

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

        this._namespaces = ArrayHelper.unique(npcs);
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

var Pos = require("./positioning/Pos").Pos;

var StrPos = require("./positioning/StrPos").StrPos;

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
      return new Pos(this.findLineStart(pos), this.findLineEnd(pos));
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
        return new StrPos(direction > 0 ? bestPos + start : bestPos, bestStr);
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

var BoxHelper = require("./BoxHelper").BoxHelper;

var ParamParser = require("./stringParsers/ParamParser").ParamParser;

var Pos = require("./positioning/Pos").Pos;

var StrPos = require("./positioning/StrPos").StrPos;

var Replacement = require("./positioning/Replacement").Replacement;

var StringHelper = require("./helpers/StringHelper").StringHelper;

var NamespaceHelper = require("./helpers/NamespaceHelper").NamespaceHelper;

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
        this.closingPos = new StrPos(this.pos, this.str);
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
      parser = new ParamParser(params, {
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
        this.content = StringHelper.trimEmptyLine(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos));
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
        ecl = StringHelper.escapeRegExp(this.context.wrapCommentLeft());
        ecr = StringHelper.escapeRegExp(this.context.wrapCommentRight());
        ed = StringHelper.escapeRegExp(this.codewave.deco);
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

      var _NamespaceHelper$spli = NamespaceHelper.split(this.cmdName);

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
      return new Pos(this.pos, this.pos + this.str.length).withEditor(this.codewave.editor);
    }
  }, {
    key: "getOpeningPos",
    value: function getOpeningPos() {
      return new Pos(this.pos, this.pos + this.opening.length).withEditor(this.codewave.editor);
    }
  }, {
    key: "getIndent",
    value: function getIndent() {
      var helper;

      if (this.indentLen == null) {
        if (this.inBox != null) {
          helper = new BoxHelper(this.context);
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
      helper = new BoxHelper(this.context);
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
      return this.applyReplacement(new Replacement(this.pos, this.getEndPos(), text));
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
      repl.selections = [new Pos(cursorPos, cursorPos)];
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

var Logger = require("./Logger").Logger;

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
        this.logger = this.logger || new Logger();
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

var TextParser = require("./TextParser").TextParser;

var Pos = require("./positioning/Pos").Pos;

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
            return new Pos(this.obj.selectionStart, this.obj.selectionEnd);
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
            pos = new Pos(0, len);

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
          this.tmpCursorPos = new Pos(start, end);
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
  }(TextParser);

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

var Editor = require("./Editor").Editor;

var Pos = require("./positioning/Pos").Pos;

var TextParser =
/*#__PURE__*/
function (_Editor) {
  _inherits(TextParser, _Editor);

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

      return this.target = new Pos(start, end);
    }
  }]);

  return TextParser;
}(Editor);

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

var CoreCommandProvider = require("./cmds/CoreCommandProvider").CoreCommandProvider;

var JsCommandProvider = require("./cmds/JsCommandProvider").JsCommandProvider;

var PhpCommandProvider = require("./cmds/PhpCommandProvider").PhpCommandProvider;

var HtmlCommandProvider = require("./cmds/HtmlCommandProvider").HtmlCommandProvider;

var FileCommandProvider = require("./cmds/FileCommandProvider").FileCommandProvider;

var StringCommandProvider = require("./cmds/StringCommandProvider").StringCommandProvider;

var Pos = require("./positioning/Pos").Pos;

var WrappedPos = require("./positioning/WrappedPos").WrappedPos;

var LocalStorageEngine = require("./storageEngines/LocalStorageEngine").LocalStorageEngine;

Pos.wrapClass = WrappedPos;
Codewave.Codewave.instances = [];
Command.Command.providers = [new CoreCommandProvider(), new JsCommandProvider(), new PhpCommandProvider(), new HtmlCommandProvider(), new FileCommandProvider(), new StringCommandProvider()];

if (typeof localStorage !== "undefined" && localStorage !== null) {
  Command.Command.storage = new LocalStorageEngine();
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

var LangDetector = require("../detectors/LangDetector").LangDetector;

var AlwaysEnabled = require("../detectors/AlwaysEnabled").AlwaysEnabled;

var BoxHelper = require("../BoxHelper").BoxHelper;

var EditCmdProp = require("../EditCmdProp").EditCmdProp;

var StringHelper = require("../helpers/StringHelper").StringHelper;

var PathHelper = require("../helpers/PathHelper").PathHelper;

var Replacement = require("../positioning/Replacement").Replacement;

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
      cmds.addDetector(new AlwaysEnabled('core'));
      core.addDetector(new LangDetector());
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
  reg = new RegExp("^(" + StringHelper.escapeRegExp(instance.codewave.brakets) + ')' + StringHelper.escapeRegExp(instance.codewave.noExecuteChar));
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
  res = PathHelper.getPath(instance.codewave.vars, name);

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
  PathHelper.setPath(instance.codewave.vars, name, val);
  return '';
};

storeJsonCommand = function storeJsonCommand(instance) {
  var name, p, val;
  name = instance.getParam([0, 'name']);
  val = (p = instance.getParam([1, 'json'])) != null ? p : instance.content ? instance.content : void 0;
  PathHelper.setPath(instance.codewave.vars, name, JSON.parse(val));
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
      this.helper = new BoxHelper(this.instance.context);
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
      return this.helper = new BoxHelper(this.instance.context);
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

        return this.instance.applyReplacement(new Replacement(box.start, box.end, ''));
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

EditCmd.props = [new EditCmdProp.revBool('no_carret', {
  opt: 'checkCarret'
}), new EditCmdProp.revBool('no_parse', {
  opt: 'parse'
}), new EditCmdProp.bool('prevent_parse_all', {
  opt: 'preventParseAll'
}), new EditCmdProp.bool('replace_box', {
  opt: 'replaceBox'
}), new EditCmdProp.string('name_to_param', {
  opt: 'nameToParam'
}), new EditCmdProp.string('alias_of', {
  "var": 'aliasOf',
  carret: true
}), new EditCmdProp.source('help', {
  funct: 'help',
  showEmpty: true
}), new EditCmdProp.source('source', {
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
      data = this.name ? PathHelper.getPath(this.instance.codewave.vars, this.name) : this.instance.codewave.vars;

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

var BoxHelper = require("../BoxHelper").BoxHelper;

var EditCmdProp = require("../EditCmdProp").EditCmdProp;

var StringHelper = require("../helpers/StringHelper").StringHelper;

var PathHelper = require("../helpers/PathHelper").PathHelper;

var Replacement = require("../positioning/Replacement").Replacement;

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

var StringHelper = require("../helpers/StringHelper").StringHelper;

var Command = require("../Command");

var PairDetector = require("../detectors/PairDetector").PairDetector;

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
      php.addDetector(new PairDetector({
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
    return '<?php\n' + StringHelper.indent(result) + '\n?>';
  }
}; // closePhpForContent = (instance) ->
//   instance.content = ' ?>'+(instance.content || '')+'<?php '

},{"../Command":6,"../detectors/PairDetector":27,"../helpers/StringHelper":34}],23:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Command = require("../Command");

var AlwaysEnabled = require("../detectors/AlwaysEnabled").AlwaysEnabled;

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
      root.addDetector(new AlwaysEnabled('string'));
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

var Detector = require("./Detector").Detector;

var AlwaysEnabled =
/*#__PURE__*/
function (_Detector) {
  _inherits(AlwaysEnabled, _Detector);

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
}(Detector);

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

var Detector = require("./Detector").Detector;

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

var Pair = require("../positioning/Pair").Pair;

var Detector = require("./Detector").Detector;

var PairDetector =
/*#__PURE__*/
function (_Detector) {
  _inherits(PairDetector, _Detector);

  function PairDetector() {
    _classCallCheck(this, PairDetector);

    return _possibleConstructorReturn(this, _getPrototypeOf(PairDetector).apply(this, arguments));
  }

  _createClass(PairDetector, [{
    key: "detected",
    value: function detected(finder) {
      var pair;

      if (this.data.opener != null && this.data.closer != null && finder.instance != null) {
        pair = new Pair(this.data.opener, this.data.closer, this.data);

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

var Size = require("../positioning/Size").Size;

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

      return new Size(w, lines.length - 1);
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

var Pos = require("./Pos").Pos;

var StringHelper = require("../helpers/StringHelper").StringHelper;

var PairMatch = require("./PairMatch").PairMatch;

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
        return new RegExp(StringHelper.escapeRegExp(this.opener));
      } else {
        return this.opener;
      }
    }
  }, {
    key: "closerReg",
    value: function closerReg() {
      if (typeof this.closer === 'string') {
        return new RegExp(StringHelper.escapeRegExp(this.closer));
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
        return new PairMatch(this, match, offset);
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
          return new Pos(start.start(), end.end());
        } else if (this.optionnal_end) {
          return new Pos(start.start(), text.length);
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

var Wrapping = require("./Wrapping").Wrapping;

var Replacement = require("./Replacement").Replacement;

var CommonHelper = require("../helpers/CommonHelper").CommonHelper;

var PosCollection =
/*#__PURE__*/
function () {
  function PosCollection(arr) {
    _classCallCheck(this, PosCollection);

    if (!Array.isArray(arr)) {
      arr = [arr];
    }

    CommonHelper.applyMixins(arr, [PosCollection]);
    return arr;
  }

  _createClass(PosCollection, [{
    key: "wrap",
    value: function wrap(prefix, suffix) {
      return this.map(function (p) {
        return new Wrapping(p.start, p.end, prefix, suffix);
      });
    }
  }, {
    key: "replace",
    value: function replace(txt) {
      return this.map(function (p) {
        return new Replacement(p.start, p.end, txt);
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

var Pos = require("./Pos").Pos;

var CommonHelper = require("../helpers/CommonHelper").CommonHelper;

var OptionObject = require("../OptionObject").OptionObject;

var StringHelper = require("../helpers/StringHelper").StringHelper;

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
        this.selections = [new Pos(this.prefix.length + this.start, this.prefix.length + this.start + this.text.length)];
        return this;
      }
    }, {
      key: "carretToSel",
      value: function carretToSel() {
        var pos, res, start, text;
        this.selections = [];
        text = this.finalText();
        this.prefix = StringHelper.removeCarret(this.prefix);
        this.text = StringHelper.removeCarret(this.text);
        this.suffix = StringHelper.removeCarret(this.suffix);
        start = this.start;

        while ((res = StringHelper.getAndRemoveFirstCarret(text)) != null) {
          var _res = res;

          var _res2 = _slicedToArray(_res, 2);

          pos = _res2[0];
          text = _res2[1];
          this.selections.push(new Pos(start + pos, start + pos));
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
  }(Pos);

  ;
  CommonHelper.applyMixins(Replacement.prototype, [OptionObject]);
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

var Pos = require("./Pos").Pos;

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
}(Pos);

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

var Replacement = require("./Replacement").Replacement;

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
}(Replacement);

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

var ParamContext = require("./ParamContext").ParamContext;

var indexOf = [].indexOf;

var NamedContext =
/*#__PURE__*/
function (_ParamContext) {
  _inherits(NamedContext, _ParamContext);

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
}(ParamContext);

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

var StringContext = require("./StringContext").StringContext;

var VariableContext = require("./VariableContext").VariableContext;

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
      if (this.testContext(StringContext)) {} else if (this.testContext(ParamContext.named)) {} else if (this.testContext(VariableContext)) {} else if (_char === ' ') {
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

var ParamContext = require("./ParamContext").ParamContext;

var NamedContext = require("./NamedContext").NamedContext;

ParamContext.named = NamedContext;

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
        this.setContext(new ParamContext(this));
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

var EscapeContext = require("./EscapeContext").EscapeContext;

var VariableContext = require("./VariableContext").VariableContext;

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
      if (this.testContext(EscapeContext)) {} else if (this.testContext(VariableContext)) {} else if (StringContext.isDelimiter(_char)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmpzIiwibGliL0Nsb3NpbmdQcm9tcC5qcyIsImxpYi9DbWRGaW5kZXIuanMiLCJsaWIvQ21kSW5zdGFuY2UuanMiLCJsaWIvQ29kZXdhdmUuanMiLCJsaWIvQ29tbWFuZC5qcyIsImxpYi9Db250ZXh0LmpzIiwibGliL0VkaXRDbWRQcm9wLmpzIiwibGliL0VkaXRvci5qcyIsImxpYi9Mb2dnZXIuanMiLCJsaWIvT3B0aW9uT2JqZWN0LmpzIiwibGliL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsImxpYi9Qcm9jZXNzLmpzIiwibGliL1N0b3JhZ2UuanMiLCJsaWIvVGV4dEFyZWFFZGl0b3IuanMiLCJsaWIvVGV4dFBhcnNlci5qcyIsImxpYi9ib290c3RyYXAuanMiLCJsaWIvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwibGliL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXIuanMiLCJsaWIvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1BocENvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZC5qcyIsImxpYi9kZXRlY3RvcnMvRGV0ZWN0b3IuanMiLCJsaWIvZGV0ZWN0b3JzL0xhbmdEZXRlY3Rvci5qcyIsImxpYi9kZXRlY3RvcnMvUGFpckRldGVjdG9yLmpzIiwibGliL2VudHJ5LmpzIiwibGliL2hlbHBlcnMvQXJyYXlIZWxwZXIuanMiLCJsaWIvaGVscGVycy9Db21tb25IZWxwZXIuanMiLCJsaWIvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCJsaWIvaGVscGVycy9PcHRpb25hbFByb21pc2UuanMiLCJsaWIvaGVscGVycy9QYXRoSGVscGVyLmpzIiwibGliL2hlbHBlcnMvU3RyaW5nSGVscGVyLmpzIiwibGliL3Bvc2l0aW9uaW5nL1BhaXIuanMiLCJsaWIvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwibGliL3Bvc2l0aW9uaW5nL1Bvcy5qcyIsImxpYi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmpzIiwibGliL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwibGliL3Bvc2l0aW9uaW5nL1NpemUuanMiLCJsaWIvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwibGliL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCJsaWIvcG9zaXRpb25pbmcvV3JhcHBpbmcuanMiLCJsaWIvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIiwibGliL3N0cmluZ1BhcnNlcnMvQ29udGV4dC5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL0VzY2FwZUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9OYW1lZENvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlci5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL1N0cmluZ0NvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9WYXJpYWJsZUNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvaW5mbGVjdGlvbi9saWIvaW5mbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDRUEsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUFELENBQVAsQ0FBa0MsWUFBdkQ7O0FBRUEsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQVAsQ0FBaUMsV0FBckQ7O0FBRUEsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQVAsQ0FBOEIsSUFBM0M7O0FBRUEsSUFBSSxTQUFTO0FBQUE7QUFBQTtBQUNYLHFCQUFZLE9BQVosRUFBbUM7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZShcIi4vaGVscGVycy9TdHJpbmdIZWxwZXJcIikuU3RyaW5nSGVscGVyO1xuXG5jb25zdCBBcnJheUhlbHBlciA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvQXJyYXlIZWxwZXJcIikuQXJyYXlIZWxwZXI7XG5cbmNvbnN0IFBhaXIgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9QYWlyXCIpLlBhaXI7XG5cbnZhciBCb3hIZWxwZXIgPSBjbGFzcyBCb3hIZWxwZXIge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIga2V5LCByZWYsIHZhbDtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBkZWNvOiB0aGlzLmNvbnRleHQuY29kZXdhdmUuZGVjbyxcbiAgICAgIHBhZDogMixcbiAgICAgIHdpZHRoOiA1MCxcbiAgICAgIGhlaWdodDogMyxcbiAgICAgIG9wZW5UZXh0OiAnJyxcbiAgICAgIGNsb3NlVGV4dDogJycsXG4gICAgICBwcmVmaXg6ICcnLFxuICAgICAgc3VmZml4OiAnJyxcbiAgICAgIGluZGVudDogMFxuICAgIH07XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvbmUodGV4dCkge1xuICAgIHZhciBrZXksIG9wdCwgcmVmLCB2YWw7XG4gICAgb3B0ID0ge307XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV07XG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQsIG9wdCk7XG4gIH1cblxuICBkcmF3KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydFNlcCgpICsgXCJcXG5cIiArIHRoaXMubGluZXModGV4dCkgKyBcIlxcblwiICsgdGhpcy5lbmRTZXAoKTtcbiAgfVxuXG4gIHdyYXBDb21tZW50KHN0cikge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnQoc3RyKTtcbiAgfVxuXG4gIHNlcGFyYXRvcigpIHtcbiAgICB2YXIgbGVuO1xuICAgIGxlbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmRlY29MaW5lKGxlbikpO1xuICB9XG5cbiAgc3RhcnRTZXAoKSB7XG4gICAgdmFyIGxuO1xuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5vcGVuVGV4dC5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy53cmFwQ29tbWVudCh0aGlzLm9wZW5UZXh0ICsgdGhpcy5kZWNvTGluZShsbikpO1xuICB9XG5cbiAgZW5kU2VwKCkge1xuICAgIHZhciBsbjtcbiAgICBsbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aCAtIHRoaXMuY2xvc2VUZXh0Lmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmNsb3NlVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKSArIHRoaXMuc3VmZml4O1xuICB9XG5cbiAgZGVjb0xpbmUobGVuKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCh0aGlzLmRlY28sIGxlbik7XG4gIH1cblxuICBwYWRkaW5nKCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIHRoaXMucGFkKTtcbiAgfVxuXG4gIGxpbmVzKHRleHQgPSAnJywgdXB0b0hlaWdodCA9IHRydWUpIHtcbiAgICB2YXIgbCwgbGluZXMsIHg7XG4gICAgdGV4dCA9IHRleHQgfHwgJyc7XG4gICAgbGluZXMgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoXCJcXG5cIik7XG5cbiAgICBpZiAodXB0b0hlaWdodCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIHJlZiwgcmVzdWx0cztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgIGZvciAoeCA9IGkgPSAwLCByZWYgPSB0aGlzLmhlaWdodDsgMCA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmOyB4ID0gMCA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5saW5lKGxpbmVzW3hdIHx8ICcnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0uY2FsbCh0aGlzKS5qb2luKCdcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIGxlbjEsIHJlc3VsdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4xID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuMTsgaSsrKSB7XG4gICAgICAgICAgbCA9IGxpbmVzW2ldO1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9LmNhbGwodGhpcykuam9pbignXFxuJyk7XG4gICAgfVxuICB9XG5cbiAgbGluZSh0ZXh0ID0gJycpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLCB0aGlzLmluZGVudCkgKyB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpICsgdGV4dCArIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgdGhpcy53aWR0aCAtIHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkubGVuZ3RoKSArIHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQodGhpcy5kZWNvICsgdGhpcy5wYWRkaW5nKCkpO1xuICB9XG5cbiAgcmlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMucGFkZGluZygpICsgdGhpcy5kZWNvKTtcbiAgfVxuXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnModGhpcy5jb250ZXh0LmNvZGV3YXZlLnJlbW92ZUNhcnJldCh0ZXh0KSk7XG4gIH1cblxuICB0ZXh0Qm91bmRzKHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmdldFR4dFNpemUodGhpcy5yZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSk7XG4gIH1cblxuICBnZXRCb3hGb3JQb3MocG9zKSB7XG4gICAgdmFyIGNsb25lLCBjdXJMZWZ0LCBkZXB0aCwgZW5kRmluZCwgbGVmdCwgcGFpciwgcGxhY2Vob2xkZXIsIHJlcywgc3RhcnRGaW5kO1xuICAgIGRlcHRoID0gdGhpcy5nZXROZXN0ZWRMdmwocG9zLnN0YXJ0KTtcblxuICAgIGlmIChkZXB0aCA+IDApIHtcbiAgICAgIGxlZnQgPSB0aGlzLmxlZnQoKTtcbiAgICAgIGN1ckxlZnQgPSBTdHJpbmdIZWxwZXIucmVwZWF0KGxlZnQsIGRlcHRoIC0gMSk7XG4gICAgICBjbG9uZSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiO1xuICAgICAgY2xvbmUud2lkdGggPSBwbGFjZWhvbGRlci5sZW5ndGg7XG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IHRoaXMuZGVjbyArIHRoaXMuZGVjbyArIHBsYWNlaG9sZGVyICsgdGhpcy5kZWNvICsgdGhpcy5kZWNvO1xuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKTtcbiAgICAgIGVuZEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuZW5kU2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKTtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcihzdGFydEZpbmQsIGVuZEZpbmQsIHtcbiAgICAgICAgdmFsaWRNYXRjaDogbWF0Y2ggPT4ge1xuICAgICAgICAgIHZhciBmOyAvLyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuXG4gICAgICAgICAgZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpLCBbbGVmdCwgXCJcXG5cIiwgXCJcXHJcIl0sIC0xKTtcbiAgICAgICAgICByZXR1cm4gZiA9PSBudWxsIHx8IGYuc3RyICE9PSBsZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKTtcblxuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGFydCArPSBjdXJMZWZ0Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXROZXN0ZWRMdmwoaW5kZXgpIHtcbiAgICB2YXIgZGVwdGgsIGYsIGxlZnQ7XG4gICAgZGVwdGggPSAwO1xuICAgIGxlZnQgPSB0aGlzLmxlZnQoKTtcblxuICAgIHdoaWxlICgoZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCwgW2xlZnQsIFwiXFxuXCIsIFwiXFxyXCJdLCAtMSkpICE9IG51bGwgJiYgZi5zdHIgPT09IGxlZnQpIHtcbiAgICAgIGluZGV4ID0gZi5wb3M7XG4gICAgICBkZXB0aCsrO1xuICAgIH1cblxuICAgIHJldHVybiBkZXB0aDtcbiAgfVxuXG4gIGdldE9wdEZyb21MaW5lKGxpbmUsIGdldFBhZCA9IHRydWUpIHtcbiAgICB2YXIgZW5kUG9zLCByRW5kLCByU3RhcnQsIHJlc0VuZCwgcmVzU3RhcnQsIHN0YXJ0UG9zO1xuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIiArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28pKSArIFwiKShcXFxccyopXCIpO1xuICAgIHJFbmQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KHRoaXMuZGVjbykpICsgXCIpKFxcbnwkKVwiKTtcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpO1xuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKTtcblxuICAgIGlmIChyZXNTdGFydCAhPSBudWxsICYmIHJlc0VuZCAhPSBudWxsKSB7XG4gICAgICBpZiAoZ2V0UGFkKSB7XG4gICAgICAgIHRoaXMucGFkID0gTWF0aC5taW4ocmVzU3RhcnRbM10ubGVuZ3RoLCByZXNFbmRbMV0ubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGg7XG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgdGhpcy5wYWQ7XG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gdGhpcy5wYWQ7XG4gICAgICB0aGlzLndpZHRoID0gZW5kUG9zIC0gc3RhcnRQb3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWZvcm1hdExpbmVzKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzKHRoaXMucmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zKSwgZmFsc2UpO1xuICB9XG5cbiAgcmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGVjbCwgZWNyLCBlZCwgZmxhZywgb3B0LCByZTEsIHJlMjtcblxuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH07XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuZGVjbyk7XG4gICAgICBmbGFnID0gb3B0aW9uc1snbXVsdGlsaW5lJ10gPyAnZ20nIDogJyc7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzezAsJHt0aGlzLnBhZH19YCwgZmxhZyk7XG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBcXFxccyooPzoke2VkfSkqJHtlY3J9XFxcXHMqJGAsIGZsYWcpO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsICcnKS5yZXBsYWNlKHJlMiwgJycpO1xuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5Cb3hIZWxwZXIgPSBCb3hIZWxwZXI7XG5cbiIsIlxuXG5jb25zdCBQb3NDb2xsZWN0aW9uID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvblwiKS5Qb3NDb2xsZWN0aW9uO1xuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50XCIpLlJlcGxhY2VtZW50O1xuXG5jb25zdCBQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9Qb3NcIikuUG9zO1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKFwiLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZVwiKTtcblxudmFyIENsb3NpbmdQcm9tcCA9IGNsYXNzIENsb3NpbmdQcm9tcCB7XG4gIGNvbnN0cnVjdG9yKGNvZGV3YXZlMSwgc2VsZWN0aW9ucykge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZTE7XG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLl90eXBlZCA9IG51bGw7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5uYkNoYW5nZXMgPSAwO1xuICAgIHRoaXMuc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uKHNlbGVjdGlvbnMpO1xuICB9XG5cbiAgYmVnaW4oKSB7XG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHRoaXMuYWRkQ2FycmV0cygpKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci5jYW5MaXN0ZW5Ub0NoYW5nZSgpKSB7XG4gICAgICAgIHRoaXMucHJveHlPbkNoYW5nZSA9IChjaCA9IG51bGwpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkNoYW5nZShjaCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5wcm94eU9uQ2hhbmdlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkucmVzdWx0KCk7XG4gIH1cblxuICBhZGRDYXJyZXRzKCkge1xuICAgIHRoaXMucmVwbGFjZW1lbnRzID0gdGhpcy5zZWxlY3Rpb25zLndyYXAodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgXCJcXG5cIiwgXCJcXG5cIiArIHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKS5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBwLmNhcnJldFRvU2VsKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHRoaXMucmVwbGFjZW1lbnRzKTtcbiAgfVxuXG4gIGludmFsaWRUeXBlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZWQgPSBudWxsO1xuICB9XG5cbiAgb25DaGFuZ2UoY2ggPSBudWxsKSB7XG4gICAgdGhpcy5pbnZhbGlkVHlwZWQoKTtcblxuICAgIGlmICh0aGlzLnNraXBFdmVudChjaCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm5iQ2hhbmdlcysrO1xuXG4gICAgaWYgKHRoaXMuc2hvdWxkU3RvcCgpKSB7XG4gICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIHJldHVybiB0aGlzLmNsZWFuQ2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdW1lKCk7XG4gICAgfVxuICB9XG5cbiAgc2tpcEV2ZW50KGNoKSB7XG4gICAgcmV0dXJuIGNoICE9IG51bGwgJiYgY2guY2hhckNvZGVBdCgwKSAhPT0gMzI7XG4gIH1cblxuICByZXN1bWUoKSB7fVxuXG4gIHNob3VsZFN0b3AoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZWQoKSA9PT0gZmFsc2UgfHwgdGhpcy50eXBlZCgpLmluZGV4T2YoJyAnKSAhPT0gLTE7XG4gIH1cblxuICBjbGVhbkNsb3NlKCkge1xuICAgIHZhciBlbmQsIGosIGxlbiwgcG9zLCByZXBsLCByZXBsYWNlbWVudHMsIHJlcywgc2VsLCBzZWxlY3Rpb25zLCBzdGFydDtcbiAgICByZXBsYWNlbWVudHMgPSBbXTtcbiAgICBzZWxlY3Rpb25zID0gdGhpcy5nZXRTZWxlY3Rpb25zKCk7XG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdO1xuXG4gICAgICBpZiAocG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpKSB7XG4gICAgICAgIHN0YXJ0ID0gc2VsO1xuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgc3RhcnQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXTtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChlbmQuaW5uZXJTdGFydCwgZW5kLmlubmVyRW5kLCByZXMpO1xuICAgICAgICByZXBsLnNlbGVjdGlvbnMgPSBbc3RhcnRdO1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKTtcbiAgICAgICAgc3RhcnQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0TXVsdGlTZWwoKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9PT0gdGhpcykge1xuICAgICAgdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3h5T25DaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMucHJveHlPbkNoYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIGlmICh0aGlzLnR5cGVkKCkgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmNhbmNlbFNlbGVjdGlvbnModGhpcy5nZXRTZWxlY3Rpb25zKCkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0b3AoKTtcbiAgfVxuXG4gIGNhbmNlbFNlbGVjdGlvbnMoc2VsZWN0aW9ucykge1xuICAgIHZhciBlbmQsIGosIGxlbiwgcG9zLCByZXBsYWNlbWVudHMsIHNlbCwgc3RhcnQ7XG4gICAgcmVwbGFjZW1lbnRzID0gW107XG4gICAgc3RhcnQgPSBudWxsO1xuXG4gICAgZm9yIChqID0gMCwgbGVuID0gc2VsZWN0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgc2VsID0gc2VsZWN0aW9uc1tqXTtcblxuICAgICAgaWYgKHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKSkge1xuICAgICAgICBzdGFydCA9IHBvcztcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIHN0YXJ0ICE9IG51bGwpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3IFJlcGxhY2VtZW50KHN0YXJ0LnN0YXJ0LCBlbmQuZW5kLCB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHN0YXJ0LmVuZCArIDEsIGVuZC5zdGFydCAtIDEpKS5zZWxlY3RDb250ZW50KCkpO1xuICAgICAgICBzdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxuICB0eXBlZCgpIHtcbiAgICB2YXIgY3BvcywgaW5uZXJFbmQsIGlubmVyU3RhcnQ7XG5cbiAgICBpZiAodGhpcy5fdHlwZWQgPT0gbnVsbCkge1xuICAgICAgY3BvcyA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpO1xuICAgICAgaW5uZXJTdGFydCA9IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aDtcblxuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuZmluZFByZXZCcmFrZXQoY3Bvcy5zdGFydCkgPT09IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICYmIChpbm5lckVuZCA9IHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoaW5uZXJTdGFydCkpICE9IG51bGwgJiYgaW5uZXJFbmQgPj0gY3Bvcy5lbmQpIHtcbiAgICAgICAgdGhpcy5fdHlwZWQgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGlubmVyU3RhcnQsIGlubmVyRW5kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3R5cGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkO1xuICB9XG5cbiAgd2hpdGhpbk9wZW5Cb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHQ7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG5cbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuc3RhcnRQb3NBdChpKTtcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG5cbiAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT09IHRhcmdldFRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB3aGl0aGluQ2xvc2VCb3VuZHMocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHQ7XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHM7XG5cbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgcmVwbCA9IHJlZltpXTtcbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSk7XG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHM7XG5cbiAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT09IHRhcmdldFRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGFydFBvc0F0KGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSkpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMsIHRoaXMuY29kZXdhdmUuYnJha2V0cyk7XG4gIH1cblxuICBlbmRQb3NBdChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAyKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLCB0aGlzLmNvZGV3YXZlLmJyYWtldHMpO1xuICB9XG5cbn07XG5leHBvcnRzLkNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcDtcbnZhciBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgPSBjbGFzcyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgZXh0ZW5kcyBDbG9zaW5nUHJvbXAge1xuICByZXN1bWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2ltdWxhdGVUeXBlKCk7XG4gIH1cblxuICBzaW11bGF0ZVR5cGUoKSB7XG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB2YXIgY3VyQ2xvc2UsIHJlcGwsIHRhcmdldFRleHQ7XG4gICAgICB0aGlzLmludmFsaWRUeXBlZCgpO1xuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgICAgY3VyQ2xvc2UgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyh0aGlzLnJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdLmNvcHkoKS5hcHBseU9mZnNldCh0aGlzLnR5cGVkKCkubGVuZ3RoKSk7XG5cbiAgICAgIGlmIChjdXJDbG9zZSkge1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LCBjdXJDbG9zZS5lbmQsIHRhcmdldFRleHQpO1xuXG4gICAgICAgIGlmIChyZXBsLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLm5lY2Vzc2FyeSgpKSB7XG4gICAgICAgICAgdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoW3JlcGxdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uVHlwZVNpbXVsYXRlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uVHlwZVNpbXVsYXRlZCgpO1xuICAgICAgfVxuICAgIH0sIDIpO1xuICB9XG5cbiAgc2tpcEV2ZW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIFt0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKSwgdGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXSArIHRoaXMudHlwZWQoKS5sZW5ndGhdO1xuICB9XG5cbiAgd2hpdGhpbkNsb3NlQm91bmRzKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIG5leHQsIHJlZiwgcmVwbCwgdGFyZ2V0UG9zO1xuICAgIHJlZiA9IHRoaXMucmVwbGFjZW1lbnRzO1xuXG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV07XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLmVuZFBvc0F0KGkpO1xuICAgICAgbmV4dCA9IHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQodGFyZ2V0UG9zLmlubmVyU3RhcnQpO1xuXG4gICAgICBpZiAobmV4dCAhPSBudWxsKSB7XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpO1xuXG4gICAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldFBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG59O1xuZXhwb3J0cy5TaW11bGF0ZWRDbG9zaW5nUHJvbXAgPSBTaW11bGF0ZWRDbG9zaW5nUHJvbXA7XG5cbkNsb3NpbmdQcm9tcC5uZXdGb3IgPSBmdW5jdGlvbiAoY29kZXdhdmUsIHNlbGVjdGlvbnMpIHtcbiAgaWYgKGNvZGV3YXZlLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICByZXR1cm4gbmV3IENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAoY29kZXdhdmUsIHNlbGVjdGlvbnMpO1xuICB9XG59O1xuXG4iLCJcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIik7XG5cbmNvbnN0IE5hbWVzcGFjZUhlbHBlciA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyXCIpLk5hbWVzcGFjZUhlbHBlcjtcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuL0NvbW1hbmRcIik7XG5cbnZhciBpbmRleE9mID0gW10uaW5kZXhPZjtcbnZhciBDbWRGaW5kZXIgPSBjbGFzcyBDbWRGaW5kZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lcywgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWw7XG5cbiAgICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdO1xuICAgIH1cblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgbmFtZXNwYWNlczogW10sXG4gICAgICBwYXJlbnRDb250ZXh0OiBudWxsLFxuICAgICAgY29udGV4dDogbnVsbCxcbiAgICAgIHJvb3Q6IENvbW1hbmQuQ29tbWFuZC5jbWRzLFxuICAgICAgbXVzdEV4ZWN1dGU6IHRydWUsXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWUsXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWUsXG4gICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfTtcbiAgICB0aGlzLm5hbWVzID0gbmFtZXM7XG4gICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXTtcblxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldO1xuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsICYmIGtleSAhPT0gJ3BhcmVudCcpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0LkNvbnRleHQodGhpcy5jb2Rld2F2ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50Q29udGV4dCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5wYXJlbnRDb250ZXh0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLm5hbWVzcGFjZXMgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0LmFkZE5hbWVzcGFjZXModGhpcy5uYW1lc3BhY2VzKTtcbiAgICB9XG4gIH1cblxuICBmaW5kKCkge1xuICAgIHRoaXMudHJpZ2dlckRldGVjdG9ycygpO1xuICAgIHRoaXMuY21kID0gdGhpcy5maW5kSW4odGhpcy5yb290KTtcbiAgICByZXR1cm4gdGhpcy5jbWQ7XG4gIH0gLy8gIGdldFBvc2liaWxpdGllczogLT5cbiAgLy8gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAvLyAgICBwYXRoID0gbGlzdChAcGF0aClcbiAgLy8gICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcblxuXG4gIGdldE5hbWVzV2l0aFBhdGhzKCkge1xuICAgIHZhciBqLCBsZW4sIG5hbWUsIHBhdGhzLCByZWYsIHJlc3QsIHNwYWNlO1xuICAgIHBhdGhzID0ge307XG4gICAgcmVmID0gdGhpcy5uYW1lcztcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmFtZSA9IHJlZltqXTtcbiAgICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKTtcblxuICAgICAgaWYgKHNwYWNlICE9IG51bGwgJiYgIShpbmRleE9mLmNhbGwodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwgc3BhY2UpID49IDApKSB7XG4gICAgICAgIGlmICghKHNwYWNlIGluIHBhdGhzKSkge1xuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF0aHNbc3BhY2VdLnB1c2gocmVzdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGhzO1xuICB9XG5cbiAgYXBwbHlTcGFjZU9uTmFtZXMobmFtZXNwYWNlKSB7XG4gICAgdmFyIHJlc3QsIHNwYWNlO1xuICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lc3BhY2UsIHRydWUpO1xuICAgIHJldHVybiB0aGlzLm5hbWVzLm1hcChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGN1cl9yZXN0LCBjdXJfc3BhY2U7XG4gICAgICBbY3VyX3NwYWNlLCBjdXJfcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKTtcblxuICAgICAgaWYgKGN1cl9zcGFjZSAhPSBudWxsICYmIGN1cl9zcGFjZSA9PT0gc3BhY2UpIHtcbiAgICAgICAgbmFtZSA9IGN1cl9yZXN0O1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdCAhPSBudWxsKSB7XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXREaXJlY3ROYW1lcygpIHtcbiAgICB2YXIgbjtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgcmVmID0gdGhpcy5uYW1lcztcbiAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIG4gPSByZWZbal07XG5cbiAgICAgICAgaWYgKG4uaW5kZXhPZihcIjpcIikgPT09IC0xKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0uY2FsbCh0aGlzKTtcbiAgfVxuXG4gIHRyaWdnZXJEZXRlY3RvcnMoKSB7XG4gICAgdmFyIGNtZCwgZGV0ZWN0b3IsIGksIGosIGxlbiwgcG9zaWJpbGl0aWVzLCByZWYsIHJlcywgcmVzdWx0cztcblxuICAgIGlmICh0aGlzLnVzZURldGVjdG9ycykge1xuICAgICAgdGhpcy51c2VEZXRlY3RvcnMgPSBmYWxzZTtcbiAgICAgIHBvc2liaWxpdGllcyA9IFt0aGlzLnJvb3RdLmNvbmNhdChuZXcgQ21kRmluZGVyKHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHtcbiAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICBtdXN0RXhlY3V0ZTogZmFsc2UsXG4gICAgICAgIHVzZUZhbGxiYWNrczogZmFsc2VcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSk7XG4gICAgICBpID0gMDtcbiAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgd2hpbGUgKGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoKSB7XG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXTtcbiAgICAgICAgcmVmID0gY21kLmRldGVjdG9ycztcblxuICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICBkZXRlY3RvciA9IHJlZltqXTtcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcyk7XG5cbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcyk7XG4gICAgICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIocmVzLCB7XG4gICAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICAgICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdHMucHVzaChpKyspO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICBmaW5kSW4oY21kLCBwYXRoID0gbnVsbCkge1xuICAgIHZhciBiZXN0O1xuXG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBiZXN0ID0gdGhpcy5iZXN0SW5Qb3NpYmlsaXRpZXModGhpcy5maW5kUG9zaWJpbGl0aWVzKCkpO1xuXG4gICAgaWYgKGJlc3QgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgfVxuICB9XG5cbiAgZmluZFBvc2liaWxpdGllcygpIHtcbiAgICB2YXIgZGlyZWN0LCBmYWxsYmFjaywgaiwgaywgbGVuLCBsZW4xLCBuYW1lLCBuYW1lcywgbnNwYywgbnNwY05hbWUsIHBvc2liaWxpdGllcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZXN0LCBzcGFjZTtcblxuICAgIGlmICh0aGlzLnJvb3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHRoaXMucm9vdC5pbml0KCk7XG4gICAgcG9zaWJpbGl0aWVzID0gW107XG5cbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gKHJlZjEgPSByZWYuaW5JbnN0YW5jZSkgIT0gbnVsbCA/IHJlZjEuY21kIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gdGhpcy5yb290KSB7XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoJ2luX2luc3RhbmNlJykpO1xuICAgIH1cblxuICAgIHJlZjIgPSB0aGlzLmdldE5hbWVzV2l0aFBhdGhzKCk7XG5cbiAgICBmb3IgKHNwYWNlIGluIHJlZjIpIHtcbiAgICAgIG5hbWVzID0gcmVmMltzcGFjZV07XG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoc3BhY2UsIG5hbWVzKSk7XG4gICAgfVxuXG4gICAgcmVmMyA9IHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKCk7XG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuc3BjID0gcmVmM1tqXTtcbiAgICAgIFtuc3BjTmFtZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLCB0cnVlKTtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChuc3BjTmFtZSwgdGhpcy5hcHBseVNwYWNlT25OYW1lcyhuc3BjKSkpO1xuICAgIH1cblxuICAgIHJlZjQgPSB0aGlzLmdldERpcmVjdE5hbWVzKCk7XG5cbiAgICBmb3IgKGsgPSAwLCBsZW4xID0gcmVmNC5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgIG5hbWUgPSByZWY0W2tdO1xuICAgICAgZGlyZWN0ID0gdGhpcy5yb290LmdldENtZChuYW1lKTtcblxuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChkaXJlY3QpKSB7XG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudXNlRmFsbGJhY2tzKSB7XG4gICAgICBmYWxsYmFjayA9IHRoaXMucm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJyk7XG5cbiAgICAgIGlmICh0aGlzLmNtZElzVmFsaWQoZmFsbGJhY2spKSB7XG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGZhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcztcbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzO1xuICB9XG5cbiAgZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQoY21kTmFtZSwgbmFtZXMgPSB0aGlzLm5hbWVzKSB7XG4gICAgdmFyIGosIGxlbiwgbmV4dCwgbmV4dHMsIHBvc2liaWxpdGllcztcbiAgICBwb3NpYmlsaXRpZXMgPSBbXTtcbiAgICBuZXh0cyA9IHRoaXMuZ2V0Q21kRm9sbG93QWxpYXMoY21kTmFtZSk7XG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBuZXh0cy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmV4dCA9IG5leHRzW2pdO1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKG5hbWVzLCB7XG4gICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgcm9vdDogbmV4dFxuICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzO1xuICB9XG5cbiAgZ2V0Q21kRm9sbG93QWxpYXMobmFtZSkge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gdGhpcy5yb290LmdldENtZChuYW1lKTtcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKTtcblxuICAgICAgaWYgKGNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtjbWQsIGNtZC5nZXRBbGlhc2VkKCldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gW2NtZF07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtjbWRdO1xuICB9XG5cbiAgY21kSXNWYWxpZChjbWQpIHtcbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoY21kLm5hbWUgIT09ICdmYWxsYmFjaycgJiYgaW5kZXhPZi5jYWxsKHRoaXMuYW5jZXN0b3JzKCksIGNtZCkgPj0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAhdGhpcy5tdXN0RXhlY3V0ZSB8fCB0aGlzLmNtZElzRXhlY3V0YWJsZShjbWQpO1xuICB9XG5cbiAgYW5jZXN0b3JzKCkge1xuICAgIHZhciByZWY7XG5cbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gcmVmLmluSW5zdGFuY2UgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cblxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNtZElzRXhlY3V0YWJsZShjbWQpIHtcbiAgICB2YXIgbmFtZXM7XG4gICAgbmFtZXMgPSB0aGlzLmdldERpcmVjdE5hbWVzKCk7XG5cbiAgICBpZiAobmFtZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGVXaXRoTmFtZShuYW1lc1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNtZFNjb3JlKGNtZCkge1xuICAgIHZhciBzY29yZTtcbiAgICBzY29yZSA9IGNtZC5kZXB0aDtcblxuICAgIGlmIChjbWQubmFtZSA9PT0gJ2ZhbGxiYWNrJykge1xuICAgICAgc2NvcmUgLT0gMTAwMDtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NvcmU7XG4gIH1cblxuICBiZXN0SW5Qb3NpYmlsaXRpZXMocG9zcykge1xuICAgIHZhciBiZXN0LCBiZXN0U2NvcmUsIGosIGxlbiwgcCwgc2NvcmU7XG5cbiAgICBpZiAocG9zcy5sZW5ndGggPiAwKSB7XG4gICAgICBiZXN0ID0gbnVsbDtcbiAgICAgIGJlc3RTY29yZSA9IG51bGw7XG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHBvc3MubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHBvc3Nbal07XG4gICAgICAgIHNjb3JlID0gdGhpcy5jbWRTY29yZShwKTtcblxuICAgICAgICBpZiAoYmVzdCA9PSBudWxsIHx8IHNjb3JlID49IGJlc3RTY29yZSkge1xuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlO1xuICAgICAgICAgIGJlc3QgPSBwO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiZXN0O1xuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5DbWRGaW5kZXIgPSBDbWRGaW5kZXI7XG5cbiIsIlxuXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZShcIi4vQ29udGV4dFwiKTtcblxuY29uc3QgQ29kZXdhdmUgPSByZXF1aXJlKFwiLi9Db2Rld2F2ZVwiKTtcblxuY29uc3QgVGV4dFBhcnNlciA9IHJlcXVpcmUoXCIuL1RleHRQYXJzZXJcIikuVGV4dFBhcnNlcjtcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZShcIi4vaGVscGVycy9TdHJpbmdIZWxwZXJcIikuU3RyaW5nSGVscGVyO1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKFwiLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZVwiKTtcblxudmFyIENtZEluc3RhbmNlID0gY2xhc3MgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3RvcihjbWQxLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jbWQgPSBjbWQxO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICghKHRoaXMuaXNFbXB0eSgpIHx8IHRoaXMuaW5pdGVkKSkge1xuICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuXG4gICAgICB0aGlzLl9nZXRDbWRPYmooKTtcblxuICAgICAgdGhpcy5faW5pdFBhcmFtcygpO1xuXG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNtZE9iai5pbml0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRQYXJhbShuYW1lLCB2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lZFtuYW1lXSA9IHZhbDtcbiAgfVxuXG4gIHB1c2hQYXJhbSh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMucHVzaCh2YWwpO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0LkNvbnRleHQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IG5ldyBDb250ZXh0LkNvbnRleHQoKTtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmdldENvbnRleHQoKS5nZXRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogdGhpcy5fZ2V0UGFyZW50TmFtZXNwYWNlcygpXG4gICAgfSk7XG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gZmluZGVyO1xuICB9XG5cbiAgX2dldENtZE9iaigpIHtcbiAgICB2YXIgY21kO1xuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY21kLmluaXQoKTtcbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcblxuICAgICAgaWYgKGNtZC5jbHMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNtZE9iaiA9IG5ldyBjbWQuY2xzKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmo7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2luaXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWQgPSB0aGlzLmdldERlZmF1bHRzKCk7XG4gIH1cblxuICBfZ2V0UGFyZW50TmFtZXNwYWNlcygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLmNtZCAhPSBudWxsO1xuICB9XG5cbiAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgdmFyIGFsaWFzZWQ7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG5cbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpO1xuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNtZC5yZXN1bHRJc0F2YWlsYWJsZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldERlZmF1bHRzKCkge1xuICAgIHZhciBhbGlhc2VkLCByZXM7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgcmVzID0ge307XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSk7XG4gICAgICB9XG5cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZC5kZWZhdWx0cyk7XG5cbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZE9iai5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmdldEFsaWFzZWRGaW5hbCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5hbGlhc2VkQ21kIHx8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZEZpbmFsKCkge1xuICAgIHZhciBhbGlhc2VkO1xuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRGaW5hbENtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsaWFzZWRGaW5hbENtZCB8fCBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLmNtZDtcblxuICAgICAgICB3aGlsZSAoYWxpYXNlZCAhPSBudWxsICYmIGFsaWFzZWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgICAgYWxpYXNlZCA9IGFsaWFzZWQuX2FsaWFzZWRGcm9tRmluZGVyKHRoaXMuZ2V0RmluZGVyKHRoaXMuYWx0ZXJBbGlhc09mKGFsaWFzZWQuYWxpYXNPZikpKTtcblxuICAgICAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hbGlhc2VkQ21kID0gYWxpYXNlZCB8fCBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgfHwgZmFsc2U7XG4gICAgICAgIHJldHVybiBhbGlhc2VkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFsdGVyQWxpYXNPZihhbGlhc09mKSB7XG4gICAgcmV0dXJuIGFsaWFzT2Y7XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHZhciBvcHQ7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9wdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIG9wdCA9IHRoaXMuY21kLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSk7XG5cbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmNtZE9iai5nZXRPcHRpb25zKCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNtZE9wdGlvbnMgPSBvcHQ7XG4gICAgICByZXR1cm4gb3B0O1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdGlvbihrZXkpIHtcbiAgICB2YXIgb3B0aW9ucztcbiAgICBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG5cbiAgICBpZiAob3B0aW9ucyAhPSBudWxsICYmIGtleSBpbiBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIGdldFBhcmFtKG5hbWVzLCBkZWZWYWwgPSBudWxsKSB7XG4gICAgdmFyIGksIGxlbiwgbiwgcmVmO1xuXG4gICAgaWYgKChyZWYgPSB0eXBlb2YgbmFtZXMpID09PSAnc3RyaW5nJyB8fCByZWYgPT09ICdudW1iZXInKSB7XG4gICAgICBuYW1lcyA9IFtuYW1lc107XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgbGVuID0gbmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG4gPSBuYW1lc1tpXTtcblxuICAgICAgaWYgKHRoaXMubmFtZWRbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lZFtuXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucGFyYW1zW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1zW25dO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWZWYWw7XG4gIH1cblxuICBnZXRCb29sUGFyYW0obmFtZXMsIGRlZlZhbCA9IG51bGwpIHtcbiAgICB2YXIgZmFsc2VWYWxzLCB2YWw7XG4gICAgZmFsc2VWYWxzID0gW1wiXCIsIFwiMFwiLCBcImZhbHNlXCIsIFwibm9cIiwgXCJub25lXCIsIGZhbHNlLCBudWxsLCAwXTtcbiAgICB2YWwgPSB0aGlzLmdldFBhcmFtKG5hbWVzLCBkZWZWYWwpO1xuICAgIHJldHVybiAhZmFsc2VWYWxzLmluY2x1ZGVzKHZhbCk7XG4gIH1cblxuICBhbmNlc3RvckNtZHMoKSB7XG4gICAgdmFyIHJlZjtcblxuICAgIGlmICgoKHJlZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpO1xuICAgIH1cblxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGFuY2VzdG9yQ21kc0FuZFNlbGYoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5jZXN0b3JDbWRzKCkuY29uY2F0KFt0aGlzLmNtZF0pO1xuICB9XG5cbiAgcnVuRXhlY3V0ZUZ1bmN0KCkge1xuICAgIHZhciBjbWQ7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLmV4ZWN1dGUoKTtcbiAgICAgIH1cblxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZDtcbiAgICAgIGNtZC5pbml0KCk7XG5cbiAgICAgIGlmIChjbWQuZXhlY3V0ZUZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlRnVuY3QodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmF3UmVzdWx0KCkge1xuICAgIHZhciBjbWQ7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpIHx8IHRoaXMuY21kO1xuICAgICAgY21kLmluaXQoKTtcblxuICAgICAgaWYgKGNtZC5yZXN1bHRGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0RnVuY3QodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjbWQucmVzdWx0U3RyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRTdHI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgaWYgKHRoaXMucmVzdWx0SXNBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh0aGlzLnJhd1Jlc3VsdCgpKS50aGVuKHJlcyA9PiB7XG4gICAgICAgIHZhciBhbHRlckZ1bmN0LCBwYXJzZXI7XG5cbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzID0gdGhpcy5mb3JtYXRJbmRlbnQocmVzKTtcblxuICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCAmJiB0aGlzLmdldE9wdGlvbigncGFyc2UnLCB0aGlzKSkge1xuICAgICAgICAgICAgcGFyc2VyID0gdGhpcy5nZXRQYXJzZXJGb3JUZXh0KHJlcyk7XG4gICAgICAgICAgICByZXMgPSBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYWx0ZXJGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdhbHRlclJlc3VsdCcsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXMgPSBhbHRlckZ1bmN0KHJlcywgdGhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuICAgICAgfSkucmVzdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyc2VyRm9yVGV4dCh0eHQgPSAnJykge1xuICAgIHZhciBwYXJzZXI7XG4gICAgcGFyc2VyID0gbmV3IENvZGV3YXZlLkNvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKHR4dCksIHtcbiAgICAgIGluSW5zdGFuY2U6IHRoaXNcbiAgICB9KTtcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZTtcbiAgICByZXR1cm4gcGFyc2VyO1xuICB9XG5cbiAgZ2V0SW5kZW50KCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZm9ybWF0SW5kZW50KHRleHQpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywgJyAgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5SW5kZW50KHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmluZGVudE5vdEZpcnN0KHRleHQsIHRoaXMuZ2V0SW5kZW50KCksIFwiIFwiKTtcbiAgfVxuXG59O1xuZXhwb3J0cy5DbWRJbnN0YW5jZSA9IENtZEluc3RhbmNlO1xuXG4iLCJcblxuY29uc3QgUHJvY2VzcyA9IHJlcXVpcmUoXCIuL1Byb2Nlc3NcIikuUHJvY2VzcztcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIik7XG5cbmNvbnN0IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSA9IHJlcXVpcmUoXCIuL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZVwiKS5Qb3NpdGlvbmVkQ21kSW5zdGFuY2U7XG5cbmNvbnN0IFRleHRQYXJzZXIgPSByZXF1aXJlKFwiLi9UZXh0UGFyc2VyXCIpLlRleHRQYXJzZXI7XG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi9Db21tYW5kXCIpO1xuXG5jb25zdCBMb2dnZXIgPSByZXF1aXJlKFwiLi9Mb2dnZXJcIikuTG9nZ2VyO1xuXG5jb25zdCBQb3NDb2xsZWN0aW9uID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvblwiKS5Qb3NDb2xsZWN0aW9uO1xuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL1N0cmluZ0hlbHBlclwiKS5TdHJpbmdIZWxwZXI7XG5cbmNvbnN0IENsb3NpbmdQcm9tcCA9IHJlcXVpcmUoXCIuL0Nsb3NpbmdQcm9tcFwiKS5DbG9zaW5nUHJvbXA7XG5cbnZhciBDb2Rld2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgY2xhc3MgQ29kZXdhdmUge1xuICAgIGNvbnN0cnVjdG9yKGVkaXRvciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsO1xuICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gICAgICBDb2Rld2F2ZS5pbml0KCk7XG4gICAgICB0aGlzLm1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nO1xuICAgICAgdGhpcy52YXJzID0ge307XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgJ2JyYWtldHMnOiAnfn4nLFxuICAgICAgICAnZGVjbyc6ICd+JyxcbiAgICAgICAgJ2Nsb3NlQ2hhcic6ICcvJyxcbiAgICAgICAgJ25vRXhlY3V0ZUNoYXInOiAnIScsXG4gICAgICAgICdjYXJyZXRDaGFyJzogJ3wnLFxuICAgICAgICAnY2hlY2tDYXJyZXQnOiB0cnVlLFxuICAgICAgICAnaW5JbnN0YW5jZSc6IG51bGxcbiAgICAgIH07XG4gICAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddO1xuICAgICAgdGhpcy5uZXN0ZWQgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQubmVzdGVkICsgMSA6IDA7XG5cbiAgICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG5cbiAgICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwgJiYga2V5ICE9PSAncGFyZW50Jykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmVkaXRvciAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLmJpbmRlZFRvKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dC5Db250ZXh0KHRoaXMpO1xuXG4gICAgICBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMuaW5JbnN0YW5jZS5jb250ZXh0O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcbiAgICB9XG5cbiAgICBvbkFjdGl2YXRpb25LZXkoKSB7XG4gICAgICB0aGlzLnByb2Nlc3MgPSBuZXcgUHJvY2VzcygpO1xuICAgICAgdGhpcy5sb2dnZXIubG9nKCdhY3RpdmF0aW9uIGtleScpO1xuICAgICAgcmV0dXJuIHRoaXMucnVuQXRDdXJzb3JQb3MoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2VzcyA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBydW5BdEN1cnNvclBvcygpIHtcbiAgICAgIGlmICh0aGlzLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuQXRNdWx0aVBvcyh0aGlzLmVkaXRvci5nZXRNdWx0aVNlbCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkF0UG9zKHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBydW5BdFBvcyhwb3MpIHtcbiAgICAgIGlmIChwb3MgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0N1cnNvciBQb3NpdGlvbiBpcyBlbXB0eScpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKFtwb3NdKTtcbiAgICB9XG5cbiAgICBydW5BdE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBjbWQ7XG5cbiAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpO1xuXG4gICAgICAgICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBjbWQuc2V0TXVsdGlQb3MobXVsdGlQb3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbWQuaW5pdCgpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGNtZCk7XG4gICAgICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zWzBdLnN0YXJ0ID09PSBtdWx0aVBvc1swXS5lbmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQnJha2V0cyhtdWx0aVBvcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9tcHRDbG9zaW5nQ21kKG11bHRpUG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbW1hbmRPblBvcyhwb3MpIHtcbiAgICAgIHZhciBuZXh0LCBwcmV2O1xuXG4gICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuZm9sbG93ZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMSkge1xuICAgICAgICBwcmV2ID0gcG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgbmV4dCA9IHBvcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnByZWNlZGVkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDApIHtcbiAgICAgICAgICBwb3MgLT0gdGhpcy5icmFrZXRzLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXYgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHBvcyk7XG5cbiAgICAgICAgaWYgKHByZXYgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCA9IHRoaXMuZmluZE5leHRCcmFrZXQocG9zIC0gMSk7XG5cbiAgICAgICAgaWYgKG5leHQgPT0gbnVsbCB8fCB0aGlzLmNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT09IDApIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBwcmV2LCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHByZXYsIG5leHQgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSk7XG4gICAgfVxuXG4gICAgbmV4dENtZChzdGFydCA9IDApIHtcbiAgICAgIHZhciBiZWdpbm5pbmcsIGYsIHBvcztcbiAgICAgIHBvcyA9IHN0YXJ0O1xuXG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSkpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGJlZ2lubmluZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBiZWdpbm5pbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIGJlZ2lubmluZywgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvcztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmVnaW5uaW5nID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRFbmNsb3NpbmdDbWQocG9zID0gMCkge1xuICAgICAgdmFyIGNsb3NpbmdQcmVmaXgsIGNtZCwgY3BvcywgcDtcbiAgICAgIGNwb3MgPSBwb3M7XG4gICAgICBjbG9zaW5nUHJlZml4ID0gdGhpcy5icmFrZXRzICsgdGhpcy5jbG9zZUNoYXI7XG5cbiAgICAgIHdoaWxlICgocCA9IHRoaXMuZmluZE5leHQoY3BvcywgY2xvc2luZ1ByZWZpeCkpICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGNtZCA9IHRoaXMuY29tbWFuZE9uUG9zKHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aCkpIHtcbiAgICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpO1xuXG4gICAgICAgICAgaWYgKGNtZC5wb3MgPCBwb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBjbWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNwb3MgPSBwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHJlY2VkZWRCeUJyYWtldHMocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MgLSB0aGlzLmJyYWtldHMubGVuZ3RoLCBwb3MpID09PSB0aGlzLmJyYWtldHM7XG4gICAgfVxuXG4gICAgZm9sbG93ZWRCeUJyYWtldHMocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpID09PSB0aGlzLmJyYWtldHM7XG4gICAgfVxuXG4gICAgY291bnRQcmV2QnJha2V0KHN0YXJ0KSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGkgPSAwO1xuXG4gICAgICB3aGlsZSAoKHN0YXJ0ID0gdGhpcy5maW5kUHJldkJyYWtldChzdGFydCkpICE9IG51bGwpIHtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBpc0VuZExpbmUocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIDEpID09PSBcIlxcblwiIHx8IHBvcyArIDEgPj0gdGhpcy5lZGl0b3IudGV4dExlbigpO1xuICAgIH1cblxuICAgIGZpbmRQcmV2QnJha2V0KHN0YXJ0KSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dEJyYWtldChzdGFydCwgLTEpO1xuICAgIH1cblxuICAgIGZpbmROZXh0QnJha2V0KHN0YXJ0LCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZjtcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbdGhpcy5icmFrZXRzLCBcIlxcblwiXSwgZGlyZWN0aW9uKTtcblxuICAgICAgaWYgKGYgJiYgZi5zdHIgPT09IHRoaXMuYnJha2V0cykge1xuICAgICAgICByZXR1cm4gZi5wb3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZFByZXYoc3RhcnQsIHN0cmluZykge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHQoc3RhcnQsIHN0cmluZywgLTEpO1xuICAgIH1cblxuICAgIGZpbmROZXh0KHN0YXJ0LCBzdHJpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmO1xuICAgICAgZiA9IHRoaXMuZmluZEFueU5leHQoc3RhcnQsIFtzdHJpbmddLCBkaXJlY3Rpb24pO1xuXG4gICAgICBpZiAoZikge1xuICAgICAgICByZXR1cm4gZi5wb3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5maW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICBmaW5kTWF0Y2hpbmdQYWlyKHN0YXJ0UG9zLCBvcGVuaW5nLCBjbG9zaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZiwgbmVzdGVkLCBwb3M7XG4gICAgICBwb3MgPSBzdGFydFBvcztcbiAgICAgIG5lc3RlZCA9IDA7XG5cbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtjbG9zaW5nLCBvcGVuaW5nXSwgZGlyZWN0aW9uKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIChkaXJlY3Rpb24gPiAwID8gZi5zdHIubGVuZ3RoIDogMCk7XG5cbiAgICAgICAgaWYgKGYuc3RyID09PSAoZGlyZWN0aW9uID4gMCA/IGNsb3NpbmcgOiBvcGVuaW5nKSkge1xuICAgICAgICAgIGlmIChuZXN0ZWQgPiAwKSB7XG4gICAgICAgICAgICBuZXN0ZWQtLTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGY7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5lc3RlZCsrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFkZEJyYWtldHMocG9zKSB7XG4gICAgICB2YXIgcmVwbGFjZW1lbnRzO1xuICAgICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKTtcbiAgICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKHRoaXMuYnJha2V0cywgdGhpcy5icmFrZXRzKS5tYXAoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgcmV0dXJuIHIuc2VsZWN0Q29udGVudCgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKTtcbiAgICB9XG5cbiAgICBwcm9tcHRDbG9zaW5nQ21kKHNlbGVjdGlvbnMpIHtcbiAgICAgIGlmICh0aGlzLmNsb3NpbmdQcm9tcCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY2xvc2luZ1Byb21wLnN0b3AoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wLm5ld0Zvcih0aGlzLCBzZWxlY3Rpb25zKS5iZWdpbigpO1xuICAgIH1cblxuICAgIHBhcnNlQWxsKHJlY3Vyc2l2ZSA9IHRydWUpIHtcbiAgICAgIHZhciBjbWQsIHBhcnNlciwgcG9zLCByZXM7XG5cbiAgICAgIGlmICh0aGlzLm5lc3RlZCA+IDEwMCkge1xuICAgICAgICB0aHJvdyBcIkluZmluaXRlIHBhcnNpbmcgUmVjdXJzaW9uXCI7XG4gICAgICB9XG5cbiAgICAgIHBvcyA9IDA7XG5cbiAgICAgIHdoaWxlIChjbWQgPSB0aGlzLm5leHRDbWQocG9zKSkge1xuICAgICAgICBwb3MgPSBjbWQuZ2V0RW5kUG9zKCk7XG4gICAgICAgIHRoaXMuZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpOyAvLyBjb25zb2xlLmxvZyhjbWQpXG5cbiAgICAgICAgY21kLmluaXQoKTtcblxuICAgICAgICBpZiAocmVjdXJzaXZlICYmIGNtZC5jb250ZW50ICE9IG51bGwgJiYgKGNtZC5nZXRDbWQoKSA9PSBudWxsIHx8ICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSkpIHtcbiAgICAgICAgICBwYXJzZXIgPSBuZXcgQ29kZXdhdmUobmV3IFRleHRQYXJzZXIoY21kLmNvbnRlbnQpLCB7XG4gICAgICAgICAgICBwYXJlbnQ6IHRoaXNcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzID0gY21kLmV4ZWN1dGUoKTtcblxuICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAocmVzLnRoZW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3luYyBuZXN0ZWQgY29tbWFuZHMgYXJlIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY21kLnJlcGxhY2VFbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VGV4dCgpO1xuICAgIH1cblxuICAgIGdldFRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dCgpO1xuICAgIH1cblxuICAgIGlzUm9vdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudCA9PSBudWxsICYmICh0aGlzLmluSW5zdGFuY2UgPT0gbnVsbCB8fCB0aGlzLmluSW5zdGFuY2UuZmluZGVyID09IG51bGwpO1xuICAgIH1cblxuICAgIGdldFJvb3QoKSB7XG4gICAgICBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Um9vdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRGaWxlU3lzdGVtKCkge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmZpbGVTeXN0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbGVTeXN0ZW07XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNSb290KCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2FycmV0KHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodHh0LCB0aGlzLmNhcnJldENoYXIpO1xuICAgIH1cblxuICAgIGdldENhcnJldFBvcyh0eHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCwgdGhpcy5jYXJyZXRDaGFyKTtcbiAgICB9XG5cbiAgICByZWdNYXJrZXIoZmxhZ3MgPSBcImdcIikge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm1hcmtlciksIGZsYWdzKTtcbiAgICB9XG5cbiAgICByZW1vdmVNYXJrZXJzKHRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UodGhpcy5yZWdNYXJrZXIoKSwgJycpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRlZCkge1xuICAgICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG5cbiAgICAgICAgQ29tbWFuZC5Db21tYW5kLmluaXRDbWRzKCk7XG5cbiAgICAgICAgcmV0dXJuIENvbW1hbmQuQ29tbWFuZC5sb2FkQ21kcygpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgO1xuICBDb2Rld2F2ZS5pbml0ZWQgPSBmYWxzZTtcbiAgcmV0dXJuIENvZGV3YXZlO1xufS5jYWxsKHZvaWQgMCk7XG5cbmV4cG9ydHMuQ29kZXdhdmUgPSBDb2Rld2F2ZTtcblxuIiwiXG5cbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKFwiLi9Db250ZXh0XCIpO1xuXG5jb25zdCBTdG9yYWdlID0gcmVxdWlyZShcIi4vU3RvcmFnZVwiKS5TdG9yYWdlO1xuXG5jb25zdCBOYW1lc3BhY2VIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlclwiKS5OYW1lc3BhY2VIZWxwZXI7XG5cbnZhciBfb3B0S2V5O1xuXG5fb3B0S2V5ID0gZnVuY3Rpb24gKGtleSwgZGljdCwgZGVmVmFsID0gbnVsbCkge1xuICAvLyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICBpZiAoa2V5IGluIGRpY3QpIHtcbiAgICByZXR1cm4gZGljdFtrZXldO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkZWZWYWw7XG4gIH1cbn07XG5cbnZhciBDb21tYW5kID0gZnVuY3Rpb24gKCkge1xuICBjbGFzcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lMSwgZGF0YTEgPSBudWxsLCBwYXJlbnQgPSBudWxsKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lMTtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGExO1xuICAgICAgdGhpcy5jbWRzID0gW107XG4gICAgICB0aGlzLmRldGVjdG9ycyA9IFtdO1xuICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSB0aGlzLnJlc3VsdEZ1bmN0ID0gdGhpcy5yZXN1bHRTdHIgPSB0aGlzLmFsaWFzT2YgPSB0aGlzLmNscyA9IG51bGw7XG4gICAgICB0aGlzLmFsaWFzZWQgPSBudWxsO1xuICAgICAgdGhpcy5mdWxsTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgIHRoaXMuZGVwdGggPSAwO1xuICAgICAgW3RoaXMuX3BhcmVudCwgdGhpcy5faW5pdGVkXSA9IFtudWxsLCBmYWxzZV07XG4gICAgICB0aGlzLnNldFBhcmVudChwYXJlbnQpO1xuICAgICAgdGhpcy5kZWZhdWx0cyA9IHt9O1xuICAgICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgICBwYXJzZTogZmFsc2UsXG4gICAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgICByZXBsYWNlQm94OiBmYWxzZSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBudWxsXG4gICAgICB9O1xuICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgICB0aGlzLmZpbmFsT3B0aW9ucyA9IG51bGw7XG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICB9XG5cbiAgICBzZXRQYXJlbnQodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLl9wYXJlbnQgIT09IHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHZhbHVlO1xuICAgICAgICB0aGlzLmZ1bGxOYW1lID0gdGhpcy5fcGFyZW50ICE9IG51bGwgJiYgdGhpcy5fcGFyZW50Lm5hbWUgIT0gbnVsbCA/IHRoaXMuX3BhcmVudC5mdWxsTmFtZSArICc6JyArIHRoaXMubmFtZSA6IHRoaXMubmFtZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwdGggPSB0aGlzLl9wYXJlbnQgIT0gbnVsbCAmJiB0aGlzLl9wYXJlbnQuZGVwdGggIT0gbnVsbCA/IHRoaXMuX3BhcmVudC5kZXB0aCArIDEgOiAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoIXRoaXMuX2luaXRlZCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnBhcnNlRGF0YSh0aGlzLmRhdGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5yZW1vdmVDbWQodGhpcyk7XG4gICAgfVxuXG4gICAgaXNFZGl0YWJsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFN0ciAhPSBudWxsIHx8IHRoaXMuYWxpYXNPZiAhPSBudWxsO1xuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZSgpIHtcbiAgICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZjtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKCk7XG4gICAgICB9XG5cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0JywgJ2NscycsICdleGVjdXRlRnVuY3QnXTtcblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal07XG5cbiAgICAgICAgaWYgKHRoaXNbcF0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpc0V4ZWN1dGFibGVXaXRoTmFtZShuYW1lKSB7XG4gICAgICB2YXIgYWxpYXNPZiwgYWxpYXNlZCwgY29udGV4dDtcblxuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dC5Db250ZXh0KCk7XG4gICAgICAgIGFsaWFzT2YgPSB0aGlzLmFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJywgbmFtZSk7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLl9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihhbGlhc09mKSk7XG5cbiAgICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaXNFeGVjdXRhYmxlKCk7XG4gICAgfVxuXG4gICAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgaiwgbGVuLCBwLCByZWY7XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKCk7XG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKTtcbiAgICAgIH1cblxuICAgICAgcmVmID0gWydyZXN1bHRTdHInLCAncmVzdWx0RnVuY3QnXTtcblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal07XG5cbiAgICAgICAgaWYgKHRoaXNbcF0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXREZWZhdWx0cygpIHtcbiAgICAgIHZhciBhbGlhc2VkLCByZXM7XG4gICAgICByZXMgPSB7fTtcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKTtcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgYWxpYXNlZC5nZXREZWZhdWx0cygpKTtcbiAgICAgIH1cblxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuZGVmYXVsdHMpO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBfYWxpYXNlZEZyb21GaW5kZXIoZmluZGVyKSB7XG4gICAgICBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2U7XG4gICAgICBmaW5kZXIubXVzdEV4ZWN1dGUgPSBmYWxzZTtcbiAgICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZTtcbiAgICAgIHJldHVybiBmaW5kZXIuZmluZCgpO1xuICAgIH1cblxuICAgIGdldEFsaWFzZWQoKSB7XG4gICAgICB2YXIgY29udGV4dDtcblxuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dC5Db250ZXh0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcih0aGlzLmFsaWFzT2YpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkT3JUaGlzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxpYXNlZCgpIHx8IHRoaXM7XG4gICAgfVxuXG4gICAgc2V0T3B0aW9ucyhkYXRhKSB7XG4gICAgICB2YXIga2V5LCByZXN1bHRzLCB2YWw7XG4gICAgICByZXN1bHRzID0gW107XG5cbiAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgICAgdmFsID0gZGF0YVtrZXldO1xuXG4gICAgICAgIGlmIChrZXkgaW4gdGhpcy5kZWZhdWx0T3B0aW9ucykge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLm9wdGlvbnNba2V5XSA9IHZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgX29wdGlvbnNGb3JBbGlhc2VkKGFsaWFzZWQpIHtcbiAgICAgIHZhciBvcHQ7XG4gICAgICBvcHQgPSB7fTtcbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmRlZmF1bHRPcHRpb25zKTtcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgYWxpYXNlZC5nZXRPcHRpb25zKCkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9ucygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSk7XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9uKGtleSkge1xuICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhlbHAoKSB7XG4gICAgICB2YXIgY21kO1xuICAgICAgY21kID0gdGhpcy5nZXRDbWQoJ2hlbHAnKTtcblxuICAgICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuaW5pdCgpLnJlc3VsdFN0cjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZURhdGEoZGF0YSkge1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IGRhdGE7XG4gICAgICAgIHRoaXMub3B0aW9uc1sncGFyc2UnXSA9IHRydWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChkYXRhICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEaWN0RGF0YShkYXRhKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHBhcnNlRGljdERhdGEoZGF0YSkge1xuICAgICAgdmFyIGV4ZWN1dGUsIHJlcztcbiAgICAgIHJlcyA9IF9vcHRLZXkoJ3Jlc3VsdCcsIGRhdGEpO1xuXG4gICAgICBpZiAodHlwZW9mIHJlcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMucmVzdWx0RnVuY3QgPSByZXM7XG4gICAgICB9IGVsc2UgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gcmVzO1xuICAgICAgICB0aGlzLm9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBleGVjdXRlID0gX29wdEtleSgnZXhlY3V0ZScsIGRhdGEpO1xuXG4gICAgICBpZiAodHlwZW9mIGV4ZWN1dGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLmV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLCBkYXRhKTtcbiAgICAgIHRoaXMuY2xzID0gX29wdEtleSgnY2xzJywgZGF0YSk7XG4gICAgICB0aGlzLmRlZmF1bHRzID0gX29wdEtleSgnZGVmYXVsdHMnLCBkYXRhLCB0aGlzLmRlZmF1bHRzKTtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhkYXRhKTtcblxuICAgICAgaWYgKCdoZWxwJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKCdoZWxwJywgZGF0YVsnaGVscCddLCB0aGlzKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICgnZmFsbGJhY2snIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2ZhbGxiYWNrJywgZGF0YVsnZmFsbGJhY2snXSwgdGhpcykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoJ2NtZHMnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWRzKGRhdGFbJ2NtZHMnXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFkZENtZHMoY21kcykge1xuICAgICAgdmFyIGRhdGEsIG5hbWUsIHJlc3VsdHM7XG4gICAgICByZXN1bHRzID0gW107XG5cbiAgICAgIGZvciAobmFtZSBpbiBjbWRzKSB7XG4gICAgICAgIGRhdGEgPSBjbWRzW25hbWVdO1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGRDbWQobmV3IENvbW1hbmQobmFtZSwgZGF0YSwgdGhpcykpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgYWRkQ21kKGNtZCkge1xuICAgICAgdmFyIGV4aXN0cztcbiAgICAgIGV4aXN0cyA9IHRoaXMuZ2V0Q21kKGNtZC5uYW1lKTtcblxuICAgICAgaWYgKGV4aXN0cyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ21kKGV4aXN0cyk7XG4gICAgICB9XG5cbiAgICAgIGNtZC5zZXRQYXJlbnQodGhpcyk7XG4gICAgICB0aGlzLmNtZHMucHVzaChjbWQpO1xuICAgICAgcmV0dXJuIGNtZDtcbiAgICB9XG5cbiAgICByZW1vdmVDbWQoY21kKSB7XG4gICAgICB2YXIgaTtcblxuICAgICAgaWYgKChpID0gdGhpcy5jbWRzLmluZGV4T2YoY21kKSkgPiAtMSkge1xuICAgICAgICB0aGlzLmNtZHMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY21kO1xuICAgIH1cblxuICAgIGdldENtZChmdWxsbmFtZSkge1xuICAgICAgdmFyIGNtZCwgaiwgbGVuLCBuYW1lLCByZWYsIHJlZjEsIHNwYWNlO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgICBbc3BhY2UsIG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpO1xuXG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gKHJlZiA9IHRoaXMuZ2V0Q21kKHNwYWNlKSkgIT0gbnVsbCA/IHJlZi5nZXRDbWQobmFtZSkgOiB2b2lkIDA7XG4gICAgICB9XG5cbiAgICAgIHJlZjEgPSB0aGlzLmNtZHM7XG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgY21kID0gcmVmMVtqXTtcblxuICAgICAgICBpZiAoY21kLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gY21kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0Q21kKGZ1bGxuYW1lLCBuZXcgQ29tbWFuZChmdWxsbmFtZS5zcGxpdCgnOicpLnBvcCgpLCBkYXRhKSk7XG4gICAgfVxuXG4gICAgc2V0Q21kKGZ1bGxuYW1lLCBjbWQpIHtcbiAgICAgIHZhciBuYW1lLCBuZXh0LCBzcGFjZTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSk7XG5cbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIG5leHQgPSB0aGlzLmdldENtZChzcGFjZSk7XG5cbiAgICAgICAgaWYgKG5leHQgPT0gbnVsbCkge1xuICAgICAgICAgIG5leHQgPSB0aGlzLmFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5leHQuc2V0Q21kKG5hbWUsIGNtZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFkZENtZChjbWQpO1xuICAgICAgICByZXR1cm4gY21kO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZERldGVjdG9yKGRldGVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXRlY3RvcnMucHVzaChkZXRlY3Rvcik7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXRDbWRzKCkge1xuICAgICAgdmFyIGosIGxlbiwgcHJvdmlkZXIsIHJlZiwgcmVzdWx0cztcbiAgICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwsIHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ2hlbGxvJzoge1xuICAgICAgICAgICAgaGVscDogXCJcXFwiSGVsbG8sIHdvcmxkIVxcXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cXG5tb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cXG52ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWFcIixcbiAgICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlZiA9IHRoaXMucHJvdmlkZXJzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcHJvdmlkZXIgPSByZWZbal07XG4gICAgICAgIHJlc3VsdHMucHVzaChwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgc3RhdGljIHNhdmVDbWQoZnVsbG5hbWUsIGRhdGEpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKTtcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNhdmVJblBhdGgoJ2NtZHMnLCBmdWxsbmFtZSwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbG9hZENtZHMoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBzYXZlZENtZHM7XG4gICAgICAgIHJldHVybiBzYXZlZENtZHMgPSB0aGlzLnN0b3JhZ2UubG9hZCgnY21kcycpO1xuICAgICAgfSkudGhlbihzYXZlZENtZHMgPT4ge1xuICAgICAgICB2YXIgZGF0YSwgZnVsbG5hbWUsIHJlc3VsdHM7XG5cbiAgICAgICAgaWYgKHNhdmVkQ21kcyAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgICAgZm9yIChmdWxsbmFtZSBpbiBzYXZlZENtZHMpIHtcbiAgICAgICAgICAgIGRhdGEgPSBzYXZlZENtZHNbZnVsbG5hbWVdO1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldFNhdmVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlKCdjbWRzJywge30pO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYWtlVmFyQ21kKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBwLCB2YWw7XG4gICAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDA7XG5cbiAgICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBtYWtlQm9vbFZhckNtZChuYW1lLCBiYXNlID0ge30pIHtcbiAgICAgIGJhc2UuZXhlY3V0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICB2YXIgcCwgdmFsO1xuICAgICAgICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuXG4gICAgICAgIGlmICghKHZhbCAhPSBudWxsICYmICh2YWwgPT09ICcwJyB8fCB2YWwgPT09ICdmYWxzZScgfHwgdmFsID09PSAnbm8nKSkpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH1cblxuICB9XG5cbiAgO1xuICBDb21tYW5kLnByb3ZpZGVycyA9IFtdO1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpO1xuICByZXR1cm4gQ29tbWFuZDtcbn0uY2FsbCh2b2lkIDApO1xuXG5leHBvcnRzLkNvbW1hbmQgPSBDb21tYW5kO1xudmFyIEJhc2VDb21tYW5kID0gY2xhc3MgQmFzZUNvbW1hbmQge1xuICBjb25zdHJ1Y3RvcihpbnN0YW5jZTEpIHtcbiAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2UxO1xuICB9XG5cbiAgaW5pdCgpIHt9XG5cbiAgcmVzdWx0SXNBdmFpbGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXNbXCJyZXN1bHRcIl0gIT0gbnVsbDtcbiAgfVxuXG4gIGdldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbn07XG5leHBvcnRzLkJhc2VDb21tYW5kID0gQmFzZUNvbW1hbmQ7XG5cbiIsIlxuXG5jb25zdCBDbWRGaW5kZXIgPSByZXF1aXJlKFwiLi9DbWRGaW5kZXJcIik7XG5cbmNvbnN0IENtZEluc3RhbmNlID0gcmVxdWlyZShcIi4vQ21kSW5zdGFuY2VcIik7XG5cbmNvbnN0IEFycmF5SGVscGVyID0gcmVxdWlyZShcIi4vaGVscGVycy9BcnJheUhlbHBlclwiKS5BcnJheUhlbHBlcjtcblxudmFyIGluZGV4T2YgPSBbXS5pbmRleE9mO1xudmFyIENvbnRleHQgPSBjbGFzcyBDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoY29kZXdhdmUpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmU7XG4gICAgdGhpcy5uYW1lU3BhY2VzID0gW107XG4gIH1cblxuICBhZGROYW1lU3BhY2UobmFtZSkge1xuICAgIGlmIChpbmRleE9mLmNhbGwodGhpcy5uYW1lU3BhY2VzLCBuYW1lKSA8IDApIHtcbiAgICAgIHRoaXMubmFtZVNwYWNlcy5wdXNoKG5hbWUpO1xuICAgICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZXMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFkZE5hbWVzcGFjZXMoc3BhY2VzKSB7XG4gICAgdmFyIGosIGxlbiwgcmVzdWx0cywgc3BhY2U7XG5cbiAgICBpZiAoc3BhY2VzKSB7XG4gICAgICBpZiAodHlwZW9mIHNwYWNlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3BhY2VzID0gW3NwYWNlc107XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gc3BhY2VzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHNwYWNlID0gc3BhY2VzW2pdO1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGROYW1lU3BhY2Uoc3BhY2UpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTmFtZVNwYWNlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lU3BhY2VzID0gdGhpcy5uYW1lU3BhY2VzLmZpbHRlcihmdW5jdGlvbiAobikge1xuICAgICAgcmV0dXJuIG4gIT09IG5hbWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXROYW1lU3BhY2VzKCkge1xuICAgIHZhciBucGNzO1xuXG4gICAgaWYgKHRoaXMuX25hbWVzcGFjZXMgPT0gbnVsbCkge1xuICAgICAgbnBjcyA9IHRoaXMubmFtZVNwYWNlcztcblxuICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KHRoaXMucGFyZW50LmdldE5hbWVTcGFjZXMoKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX25hbWVzcGFjZXMgPSBBcnJheUhlbHBlci51bmlxdWUobnBjcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZXM7XG4gIH1cblxuICBnZXRDbWQoY21kTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmdldEZpbmRlcihjbWROYW1lLCBvcHRpb25zKTtcbiAgICByZXR1cm4gZmluZGVyLmZpbmQoKTtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IENtZEZpbmRlci5DbWRGaW5kZXIoY21kTmFtZSwgT2JqZWN0LmFzc2lnbih7XG4gICAgICBuYW1lc3BhY2VzOiBbXSxcbiAgICAgIHVzZURldGVjdG9yczogdGhpcy5pc1Jvb3QoKSxcbiAgICAgIGNvZGV3YXZlOiB0aGlzLmNvZGV3YXZlLFxuICAgICAgcGFyZW50Q29udGV4dDogdGhpc1xuICAgIH0sIG9wdGlvbnMpKTtcbiAgfVxuXG4gIGlzUm9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQgPT0gbnVsbDtcbiAgfVxuXG4gIGdldFBhcmVudE9yUm9vdCgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudChzdHIpIHtcbiAgICB2YXIgY2M7XG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKCk7XG5cbiAgICBpZiAoY2MuaW5kZXhPZignJXMnKSA+IC0xKSB7XG4gICAgICByZXR1cm4gY2MucmVwbGFjZSgnJXMnLCBzdHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHIgKyAnICcgKyBjYztcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudExlZnQoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGk7XG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKCk7XG5cbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gY2Muc3Vic3RyKDAsIGkpICsgc3RyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHI7XG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnRSaWdodChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaTtcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKTtcblxuICAgIGlmICgoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTEpIHtcbiAgICAgIHJldHVybiBzdHIgKyBjYy5zdWJzdHIoaSArIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2M7XG4gICAgfVxuICB9XG5cbiAgY21kSW5zdGFuY2VGb3IoY21kKSB7XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZS5DbWRJbnN0YW5jZShjbWQsIHRoaXMpO1xuICB9XG5cbiAgZ2V0Q29tbWVudENoYXIoKSB7XG4gICAgdmFyIGNoYXIsIGNtZCwgaW5zdCwgcmVzO1xuXG4gICAgaWYgKHRoaXMuY29tbWVudENoYXIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tbWVudENoYXI7XG4gICAgfVxuXG4gICAgY21kID0gdGhpcy5nZXRDbWQoJ2NvbW1lbnQnKTtcbiAgICBjaGFyID0gJzwhLS0gJXMgLS0+JztcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaW5zdCA9IHRoaXMuY21kSW5zdGFuY2VGb3IoY21kKTtcbiAgICAgIGluc3QuY29udGVudCA9ICclcyc7XG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpO1xuXG4gICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgY2hhciA9IHJlcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbW1lbnRDaGFyID0gY2hhcjtcbiAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhcjtcbiAgfVxuXG59O1xuZXhwb3J0cy5Db250ZXh0ID0gQ29udGV4dDtcblxuIiwiXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi9Db21tYW5kXCIpO1xuXG52YXIgRWRpdENtZFByb3AgPSBjbGFzcyBFZGl0Q21kUHJvcCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMsIGksIGtleSwgbGVuLCByZWYsIHZhbDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIGRlZmF1bHRzID0ge1xuICAgICAgJ3Zhcic6IG51bGwsXG4gICAgICAnb3B0JzogbnVsbCxcbiAgICAgICdmdW5jdCc6IG51bGwsXG4gICAgICAnZGF0YU5hbWUnOiBudWxsLFxuICAgICAgJ3Nob3dFbXB0eSc6IGZhbHNlLFxuICAgICAgJ2NhcnJldCc6IGZhbHNlXG4gICAgfTtcbiAgICByZWYgPSBbJ3ZhcicsICdvcHQnLCAnZnVuY3QnXTtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAga2V5ID0gcmVmW2ldO1xuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgZGVmYXVsdHNbJ2RhdGFOYW1lJ10gPSBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0Q21kKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5Db21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIHdyaXRlRm9yKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9ialt0aGlzLmRhdGFOYW1lXSA9IHBhcnNlci52YXJzW3RoaXMubmFtZV07XG4gICAgfVxuICB9XG5cbiAgdmFsRnJvbUNtZChjbWQpIHtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLm9wdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZ2V0T3B0aW9uKHRoaXMub3B0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kW3RoaXMuZnVuY3RdKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnZhciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy52YXJdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3dGb3JDbWQoY21kKSB7XG4gICAgdmFyIHZhbDtcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKTtcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgfHwgdmFsICE9IG51bGw7XG4gIH1cblxuICBkaXNwbGF5KGNtZCkge1xuICAgIGlmICh0aGlzLnNob3dGb3JDbWQoY21kKSkge1xuICAgICAgcmV0dXJuIGB+fiR7dGhpcy5uYW1lfX5+XFxuJHt0aGlzLnZhbEZyb21DbWQoY21kKSB8fCBcIlwifSR7dGhpcy5jYXJyZXQgPyBcInxcIiA6IFwiXCJ9XFxufn4vJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5FZGl0Q21kUHJvcCA9IEVkaXRDbWRQcm9wO1xuRWRpdENtZFByb3Auc291cmNlID0gY2xhc3Mgc291cmNlIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICB2YWxGcm9tQ21kKGNtZCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gc3VwZXIudmFsRnJvbUNtZChjbWQpO1xuXG4gICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICByZXMgPSByZXMucmVwbGFjZSgvXFx8L2csICd8fCcpO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzZXRDbWQoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLkNvbW1hbmQubWFrZVZhckNtZCh0aGlzLm5hbWUsIHtcbiAgICAgICdwcmV2ZW50UGFyc2VBbGwnOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBzaG93Rm9yQ21kKGNtZCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZCk7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0VtcHR5ICYmICEoY21kICE9IG51bGwgJiYgY21kLmFsaWFzT2YgIT0gbnVsbCkgfHwgdmFsICE9IG51bGw7XG4gIH1cblxufTtcbkVkaXRDbWRQcm9wLnN0cmluZyA9IGNsYXNzIHN0cmluZyBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX0gJyR7dGhpcy52YWxGcm9tQ21kKGNtZCl9JHt0aGlzLmNhcnJldCA/IFwifFwiIDogXCJcIn0nfn5gO1xuICAgIH1cbiAgfVxuXG59O1xuRWRpdENtZFByb3AucmV2Qm9vbCA9IGNsYXNzIHJldkJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQuQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgd3JpdGVGb3IocGFyc2VyLCBvYmopIHtcbiAgICBpZiAocGFyc2VyLnZhcnNbdGhpcy5uYW1lXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gb2JqW3RoaXMuZGF0YU5hbWVdID0gIXBhcnNlci52YXJzW3RoaXMubmFtZV07XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpO1xuXG4gICAgaWYgKHZhbCAhPSBudWxsICYmICF2YWwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuRWRpdENtZFByb3AuYm9vbCA9IGNsYXNzIGJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHNldENtZChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQuQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpO1xuICB9XG5cbiAgZGlzcGxheShjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gO1xuICAgIH1cbiAgfVxuXG59O1xuXG4iLCJcblxuY29uc3QgUG9zID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvUG9zXCIpLlBvcztcblxuY29uc3QgU3RyUG9zID0gcmVxdWlyZShcIi4vcG9zaXRpb25pbmcvU3RyUG9zXCIpLlN0clBvcztcblxuY29uc3QgT3B0aW9uYWxQcm9taXNlID0gcmVxdWlyZShcIi4vaGVscGVycy9PcHRpb25hbFByb21pc2VcIik7XG5cbnZhciBFZGl0b3IgPSBjbGFzcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG51bGw7XG4gICAgdGhpcy5fbGFuZyA9IG51bGw7XG4gIH1cblxuICBiaW5kZWRUbyhjb2Rld2F2ZSkge31cblxuICB0ZXh0KHZhbCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0TGVuKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICB0ZXh0U3Vic3RyKHN0YXJ0LCBlbmQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgaW5zZXJ0VGV4dEF0KHRleHQsIHBvcykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBzZXRDdXJzb3JQb3Moc3RhcnQsIGVuZCA9IG51bGwpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgYmVnaW5VbmRvQWN0aW9uKCkge31cblxuICBlbmRVbmRvQWN0aW9uKCkge31cblxuICBnZXRMYW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICB9XG5cbiAgc2V0TGFuZyh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFuZyA9IHZhbDtcbiAgfVxuXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdCgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFsbG93TXVsdGlTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2V0TXVsdGlTZWwoc2VsZWN0aW9ucykge1xuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCI7XG4gIH1cblxuICBnZXRNdWx0aVNlbCgpIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgY2FuTGlzdGVuVG9DaGFuZ2UoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiO1xuICB9XG5cbiAgZ2V0TGluZUF0KHBvcykge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMuZmluZExpbmVTdGFydChwb3MpLCB0aGlzLmZpbmRMaW5lRW5kKHBvcykpO1xuICB9XG5cbiAgZmluZExpbmVTdGFydChwb3MpIHtcbiAgICB2YXIgcDtcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtcIlxcblwiXSwgLTEpO1xuXG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcyArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRMaW5lRW5kKHBvcykge1xuICAgIHZhciBwO1xuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW1wiXFxuXCIsIFwiXFxyXCJdKTtcblxuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRMZW4oKTtcbiAgICB9XG4gIH1cblxuICBmaW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgIHZhciBiZXN0UG9zLCBiZXN0U3RyLCBpLCBsZW4sIHBvcywgc3RyaSwgdGV4dDtcblxuICAgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0LCB0aGlzLnRleHRMZW4oKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoMCwgc3RhcnQpO1xuICAgIH1cblxuICAgIGJlc3RQb3MgPSBudWxsO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gc3RyaW5ncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc3RyaSA9IHN0cmluZ3NbaV07XG4gICAgICBwb3MgPSBkaXJlY3Rpb24gPiAwID8gdGV4dC5pbmRleE9mKHN0cmkpIDogdGV4dC5sYXN0SW5kZXhPZihzdHJpKTtcblxuICAgICAgaWYgKHBvcyAhPT0gLTEpIHtcbiAgICAgICAgaWYgKGJlc3RQb3MgPT0gbnVsbCB8fCBiZXN0UG9zICogZGlyZWN0aW9uID4gcG9zICogZGlyZWN0aW9uKSB7XG4gICAgICAgICAgYmVzdFBvcyA9IHBvcztcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChiZXN0U3RyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3RyUG9zKGRpcmVjdGlvbiA+IDAgPyBiZXN0UG9zICsgc3RhcnQgOiBiZXN0UG9zLCBiZXN0U3RyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cykge1xuICAgIHJldHVybiByZXBsYWNlbWVudHMucmVkdWNlKChwcm9taXNlLCByZXBsKSA9PiB7XG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKG9wdCA9PiB7XG4gICAgICAgIHJlcGwud2l0aEVkaXRvcih0aGlzKTtcbiAgICAgICAgcmVwbC5hcHBseU9mZnNldChvcHQub2Zmc2V0KTtcbiAgICAgICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKShyZXBsLmFwcGx5KCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZWxlY3Rpb25zOiBvcHQuc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKSxcbiAgICAgICAgICAgIG9mZnNldDogb3B0Lm9mZnNldCArIHJlcGwub2Zmc2V0QWZ0ZXIodGhpcylcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh7XG4gICAgICBzZWxlY3Rpb25zOiBbXSxcbiAgICAgIG9mZnNldDogMFxuICAgIH0pKS50aGVuKG9wdCA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMob3B0LnNlbGVjdGlvbnMpO1xuICAgIH0pLnJlc3VsdCgpO1xuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKHNlbGVjdGlvbnMpIHtcbiAgICBpZiAoc2VsZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TXVsdGlTZWwoc2VsZWN0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCwgc2VsZWN0aW9uc1swXS5lbmQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5FZGl0b3IgPSBFZGl0b3I7XG5cbiIsIlxuXG52YXIgTG9nZ2VyID0gZnVuY3Rpb24gKCkge1xuICBjbGFzcyBMb2dnZXIge1xuICAgIGxvZyguLi5hcmdzKSB7XG4gICAgICB2YXIgaSwgbGVuLCBtc2csIHJlc3VsdHM7XG5cbiAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbXNnID0gYXJnc1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY29uc29sZS5sb2cobXNnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICByZXR1cm4gKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUgIT09IG51bGwgPyBjb25zb2xlLmxvZyA6IHZvaWQgMCkgIT0gbnVsbCAmJiB0aGlzLmVuYWJsZWQgJiYgTG9nZ2VyLmVuYWJsZWQ7XG4gICAgfVxuXG4gICAgcnVudGltZShmdW5jdCwgbmFtZSA9IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgY29uc29sZS5sb2coYCR7bmFtZX0gdG9vayAke3QxIC0gdDB9IG1pbGxpc2Vjb25kcy5gKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgdG9Nb25pdG9yKG9iaiwgbmFtZSwgcHJlZml4ID0gJycpIHtcbiAgICAgIHZhciBmdW5jdDtcbiAgICAgIGZ1bmN0ID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIG9ialtuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbml0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBmdW5jdC5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgICB9LCBwcmVmaXggKyBuYW1lKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgbW9uaXRvcihmdW5jdCwgbmFtZSkge1xuICAgICAgdmFyIHJlcywgdDAsIHQxO1xuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIHJlcyA9IGZ1bmN0KCk7XG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICBpZiAodGhpcy5tb25pdG9yRGF0YVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrKztcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCArPSB0MSAtIHQwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHJlc3VtZSgpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyh0aGlzLm1vbml0b3JEYXRhKTtcbiAgICB9XG5cbiAgfVxuXG4gIDtcbiAgTG9nZ2VyLmVuYWJsZWQgPSB0cnVlO1xuICBMb2dnZXIucHJvdG90eXBlLmVuYWJsZWQgPSB0cnVlO1xuICBMb2dnZXIucHJvdG90eXBlLm1vbml0b3JEYXRhID0ge307XG4gIHJldHVybiBMb2dnZXI7XG59LmNhbGwodm9pZCAwKTtcblxuZXhwb3J0cy5Mb2dnZXIgPSBMb2dnZXI7XG5cbiIsIlxudmFyIE9wdGlvbk9iamVjdCA9IGNsYXNzIE9wdGlvbk9iamVjdCB7XG4gIHNldE9wdHMob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIga2V5LCByZWYsIHJlc3VsdHMsIHZhbDtcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0cztcbiAgICByZXN1bHRzID0gW107XG5cbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldO1xuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc2V0T3B0KGtleSwgb3B0aW9uc1trZXldKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCB2YWwpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIHNldE9wdChrZXksIHZhbCkge1xuICAgIHZhciByZWY7XG5cbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGdldE9wdChrZXkpIHtcbiAgICB2YXIgcmVmO1xuXG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XTtcbiAgICB9XG4gIH1cblxuICBnZXRPcHRzKCkge1xuICAgIHZhciBrZXksIG9wdHMsIHJlZiwgdmFsO1xuICAgIG9wdHMgPSB7fTtcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzO1xuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XTtcbiAgICAgIG9wdHNba2V5XSA9IHRoaXMuZ2V0T3B0KGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdHM7XG4gIH1cblxufTtcbmV4cG9ydHMuT3B0aW9uT2JqZWN0ID0gT3B0aW9uT2JqZWN0O1xuXG4iLCJcblxuY29uc3QgQ21kSW5zdGFuY2UgPSByZXF1aXJlKFwiLi9DbWRJbnN0YW5jZVwiKTtcblxuY29uc3QgQm94SGVscGVyID0gcmVxdWlyZShcIi4vQm94SGVscGVyXCIpLkJveEhlbHBlcjtcblxuY29uc3QgUGFyYW1QYXJzZXIgPSByZXF1aXJlKFwiLi9zdHJpbmdQYXJzZXJzL1BhcmFtUGFyc2VyXCIpLlBhcmFtUGFyc2VyO1xuXG5jb25zdCBQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9Qb3NcIikuUG9zO1xuXG5jb25zdCBTdHJQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9TdHJQb3NcIikuU3RyUG9zO1xuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50XCIpLlJlcGxhY2VtZW50O1xuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKFwiLi9oZWxwZXJzL1N0cmluZ0hlbHBlclwiKS5TdHJpbmdIZWxwZXI7XG5cbmNvbnN0IE5hbWVzcGFjZUhlbHBlciA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyXCIpLk5hbWVzcGFjZUhlbHBlcjtcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuL0NvbW1hbmRcIik7XG5cbmNvbnN0IE9wdGlvbmFsUHJvbWlzZSA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlXCIpO1xuXG52YXIgUG9zaXRpb25lZENtZEluc3RhbmNlID0gY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2UuQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3Rvcihjb2Rld2F2ZSwgcG9zMSwgc3RyMSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlO1xuICAgIHRoaXMucG9zID0gcG9zMTtcbiAgICB0aGlzLnN0ciA9IHN0cjE7XG5cbiAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aGlzLl9jaGVja0Nsb3NlcigpO1xuXG4gICAgICB0aGlzLm9wZW5pbmcgPSB0aGlzLnN0cjtcbiAgICAgIHRoaXMubm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cik7XG5cbiAgICAgIHRoaXMuX3NwbGl0Q29tcG9uZW50cygpO1xuXG4gICAgICB0aGlzLl9maW5kQ2xvc2luZygpO1xuXG4gICAgICB0aGlzLl9jaGVja0Vsb25nYXRlZCgpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Nsb3NlcigpIHtcbiAgICB2YXIgZiwgbm9CcmFja2V0O1xuICAgIG5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpO1xuXG4gICAgaWYgKG5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgJiYgKGYgPSB0aGlzLl9maW5kT3BlbmluZ1BvcygpKSkge1xuICAgICAgdGhpcy5jbG9zaW5nUG9zID0gbmV3IFN0clBvcyh0aGlzLnBvcywgdGhpcy5zdHIpO1xuICAgICAgdGhpcy5wb3MgPSBmLnBvcztcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IGYuc3RyO1xuICAgIH1cbiAgfVxuXG4gIF9maW5kT3BlbmluZ1BvcygpIHtcbiAgICB2YXIgY2xvc2luZywgY21kTmFtZSwgZiwgb3BlbmluZztcbiAgICBjbWROYW1lID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cikuc3Vic3RyaW5nKHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCk7XG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWU7XG4gICAgY2xvc2luZyA9IHRoaXMuc3RyO1xuXG4gICAgaWYgKGYgPSB0aGlzLmNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIodGhpcy5wb3MsIG9wZW5pbmcsIGNsb3NpbmcsIC0xKSkge1xuICAgICAgZi5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLCB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGYucG9zICsgZi5zdHIubGVuZ3RoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpO1xuICAgICAgcmV0dXJuIGY7XG4gICAgfVxuICB9XG5cbiAgX3NwbGl0Q29tcG9uZW50cygpIHtcbiAgICB2YXIgcGFydHM7XG4gICAgcGFydHMgPSB0aGlzLm5vQnJhY2tldC5zcGxpdChcIiBcIik7XG4gICAgdGhpcy5jbWROYW1lID0gcGFydHMuc2hpZnQoKTtcbiAgICByZXR1cm4gdGhpcy5yYXdQYXJhbXMgPSBwYXJ0cy5qb2luKFwiIFwiKTtcbiAgfVxuXG4gIF9wYXJzZVBhcmFtcyhwYXJhbXMpIHtcbiAgICB2YXIgbmFtZVRvUGFyYW0sIHBhcnNlcjtcbiAgICBwYXJzZXIgPSBuZXcgUGFyYW1QYXJzZXIocGFyYW1zLCB7XG4gICAgICBhbGxvd2VkTmFtZWQ6IHRoaXMuZ2V0T3B0aW9uKCdhbGxvd2VkTmFtZWQnKSxcbiAgICAgIHZhcnM6IHRoaXMuY29kZXdhdmUudmFyc1xuICAgIH0pO1xuICAgIHRoaXMucGFyYW1zID0gcGFyc2VyLnBhcmFtcztcbiAgICB0aGlzLm5hbWVkID0gT2JqZWN0LmFzc2lnbih0aGlzLmdldERlZmF1bHRzKCksIHBhcnNlci5uYW1lZCk7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgbmFtZVRvUGFyYW0gPSB0aGlzLmdldE9wdGlvbignbmFtZVRvUGFyYW0nKTtcblxuICAgICAgaWYgKG5hbWVUb1BhcmFtICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZVRvUGFyYW1dID0gdGhpcy5jbWROYW1lO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9maW5kQ2xvc2luZygpIHtcbiAgICB2YXIgZjtcblxuICAgIGlmIChmID0gdGhpcy5fZmluZENsb3NpbmdQb3MoKSkge1xuICAgICAgdGhpcy5jb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgZi5wb3MpKTtcbiAgICAgIHJldHVybiB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGYucG9zICsgZi5zdHIubGVuZ3RoKTtcbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmdQb3MoKSB7XG4gICAgdmFyIGNsb3NpbmcsIGYsIG9wZW5pbmc7XG5cbiAgICBpZiAodGhpcy5jbG9zaW5nUG9zICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3M7XG4gICAgfVxuXG4gICAgY2xvc2luZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWROYW1lICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICAgIG9wZW5pbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZE5hbWU7XG5cbiAgICBpZiAoZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgb3BlbmluZywgY2xvc2luZykpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3MgPSBmO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Vsb25nYXRlZCgpIHtcbiAgICB2YXIgZW5kUG9zLCBtYXgsIHJlZjtcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpO1xuICAgIG1heCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKTtcblxuICAgIHdoaWxlIChlbmRQb3MgPCBtYXggJiYgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmRlY28pIHtcbiAgICAgIGVuZFBvcyArPSB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoO1xuICAgIH1cblxuICAgIGlmIChlbmRQb3MgPj0gbWF4IHx8IChyZWYgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkpID09PSAnICcgfHwgcmVmID09PSBcIlxcblwiIHx8IHJlZiA9PT0gXCJcXHJcIikge1xuICAgICAgcmV0dXJuIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKTtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tCb3goKSB7XG4gICAgdmFyIGNsLCBjciwgZW5kUG9zO1xuXG4gICAgaWYgKHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsICYmIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PT0gJ2NvbW1lbnQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2wgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCk7XG4gICAgY3IgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpO1xuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCkgKyBjci5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyAtIGNsLmxlbmd0aCwgdGhpcy5wb3MpID09PSBjbCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyAtIGNyLmxlbmd0aCwgZW5kUG9zKSA9PT0gY3IpIHtcbiAgICAgIHRoaXMucG9zID0gdGhpcy5wb3MgLSBjbC5sZW5ndGg7XG4gICAgICB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGVuZFBvcyk7XG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgJiYgdGhpcy5nZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xKSB7XG4gICAgICB0aGlzLmluQm94ID0gMTtcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KCkge1xuICAgIHZhciBlY2wsIGVjciwgZWQsIHJlMSwgcmUyLCByZTM7XG5cbiAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSk7XG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpO1xuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29kZXdhdmUuZGVjbyk7XG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86JHtlZH0pKyR7ZWNyfSRgLCBcImdtXCIpO1xuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXlxcXFxzKig/OiR7ZWR9KSoke2Vjcn1cXHI/XFxuYCk7XG4gICAgICByZTMgPSBuZXcgUmVnRXhwKGBcXG5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHMqJGApO1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudC5yZXBsYWNlKHJlMSwgJyQxJykucmVwbGFjZShyZTIsICcnKS5yZXBsYWNlKHJlMywgJycpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRQYXJlbnRDbWRzKCkge1xuICAgIHZhciByZWY7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID0gKHJlZiA9IHRoaXMuY29kZXdhdmUuZ2V0RW5jbG9zaW5nQ21kKHRoaXMuZ2V0RW5kUG9zKCkpKSAhPSBudWxsID8gcmVmLmluaXQoKSA6IHZvaWQgMDtcbiAgfVxuXG4gIHNldE11bHRpUG9zKG11bHRpUG9zKSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlQb3MgPSBtdWx0aVBvcztcbiAgfVxuXG4gIF9nZXRDbWRPYmooKSB7XG4gICAgdGhpcy5nZXRDbWQoKTtcblxuICAgIHRoaXMuX2NoZWNrQm94KCk7XG5cbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnJlbW92ZUluZGVudEZyb21Db250ZW50KHRoaXMuY29udGVudCk7XG4gICAgcmV0dXJuIHN1cGVyLl9nZXRDbWRPYmooKTtcbiAgfVxuXG4gIF9pbml0UGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJzZVBhcmFtcyh0aGlzLnJhd1BhcmFtcyk7XG4gIH1cblxuICBnZXRDb250ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQgfHwgdGhpcy5jb2Rld2F2ZS5jb250ZXh0O1xuICB9XG5cbiAgZ2V0Q21kKCkge1xuICAgIGlmICh0aGlzLmNtZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9nZXRQYXJlbnRDbWRzKCk7XG5cbiAgICAgIGlmICh0aGlzLm5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikge1xuICAgICAgICB0aGlzLmNtZCA9IENvbW1hbmQuQ29tbWFuZC5jbWRzLmdldENtZCgnY29yZTpub19leGVjdXRlJyk7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY29kZXdhdmUuY29udGV4dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5nZXRGaW5kZXIodGhpcy5jbWROYW1lKTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5maW5kZXIuY29udGV4dDtcbiAgICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZVNwYWNlKHRoaXMuY21kLmZ1bGxOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNtZDtcbiAgfVxuXG4gIGdldEZpbmRlcihjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlcjtcbiAgICBmaW5kZXIgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pO1xuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXM7XG4gICAgcmV0dXJuIGZpbmRlcjtcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzKCkge1xuICAgIHZhciBuc3Bjcywgb2JqO1xuICAgIG5zcGNzID0gW107XG4gICAgb2JqID0gdGhpcztcblxuICAgIHdoaWxlIChvYmoucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IG9iai5wYXJlbnQ7XG5cbiAgICAgIGlmIChvYmouY21kICE9IG51bGwgJiYgb2JqLmNtZC5mdWxsTmFtZSAhPSBudWxsKSB7XG4gICAgICAgIG5zcGNzLnB1c2gob2JqLmNtZC5mdWxsTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5zcGNzO1xuICB9XG5cbiAgX3JlbW92ZUJyYWNrZXQoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcodGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCwgc3RyLmxlbmd0aCAtIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpO1xuICB9XG5cbiAgYWx0ZXJBbGlhc09mKGFsaWFzT2YpIHtcbiAgICB2YXIgY21kTmFtZSwgbnNwYztcbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQodGhpcy5jbWROYW1lKTtcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBjbWROYW1lKTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cyB8fCB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgYmVmb3JlRnVuY3Q7XG5cbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCAhPSBudWxsICYmIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKHRoaXMucG9zICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAuY2FuY2VsKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aCgnJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAoYmVmb3JlRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpKSB7XG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICAgIHJldHVybiAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkodGhpcy5yZXN1bHQoKSkudGhlbihyZXMgPT4ge1xuICAgICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgocmVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnJlc3VsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRXhlY3V0ZUZ1bmN0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RW5kUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aDtcbiAgfVxuXG4gIGdldFBvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpO1xuICB9XG5cbiAgZ2V0T3BlbmluZ1BvcygpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLm9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcbiAgfVxuXG4gIGdldEluZGVudCgpIHtcbiAgICB2YXIgaGVscGVyO1xuXG4gICAgaWYgKHRoaXMuaW5kZW50TGVuID09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkpLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gdGhpcy5wb3MgLSB0aGlzLmdldFBvcygpLnByZXZFT0woKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbmRlbnRMZW47XG4gIH1cblxuICByZW1vdmVJbmRlbnRGcm9tQ29udGVudCh0ZXh0KSB7XG4gICAgdmFyIHJlZztcblxuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoJ15cXFxcc3snICsgdGhpcy5nZXRJbmRlbnQoKSArICd9JywgJ2dtJyk7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBhbHRlclJlc3VsdEZvckJveChyZXBsKSB7XG4gICAgdmFyIGJveCwgaGVscGVyLCBvcmlnaW5hbCwgcmVzO1xuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KCk7XG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpO1xuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLCBmYWxzZSk7XG5cbiAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3JlcGxhY2VCb3gnKSkge1xuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbCk7XG4gICAgICBbcmVwbC5zdGFydCwgcmVwbC5lbmRdID0gW2JveC5zdGFydCwgYm94LmVuZF07XG4gICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5pbmRlbnQ7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKCk7XG4gICAgICByZXBsLmVuZCA9IG9yaWdpbmFsLm5leHRFT0woKTtcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyB0aGlzLmNvZGV3YXZlLm1hcmtlciArIG9yaWdpbmFsLnNhbWVMaW5lc1N1ZmZpeCgpLCB7XG4gICAgICAgIG11bHRpbGluZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgW3JlcGwucHJlZml4LCByZXBsLnRleHQsIHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdCh0aGlzLmNvZGV3YXZlLm1hcmtlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcGw7XG4gIH1cblxuICBnZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCBwO1xuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KCk7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCAmJiB0aGlzLmNvZGV3YXZlLmNoZWNrQ2FycmV0ICYmIHRoaXMuZ2V0T3B0aW9uKCdjaGVja0NhcnJldCcpKSB7XG4gICAgICBpZiAoKHAgPSB0aGlzLmNvZGV3YXZlLmdldENhcnJldFBvcyhyZXBsLnRleHQpKSAhPSBudWxsKSB7XG4gICAgICAgIGN1cnNvclBvcyA9IHJlcGwuc3RhcnQgKyByZXBsLnByZWZpeC5sZW5ndGggKyBwO1xuICAgICAgfVxuXG4gICAgICByZXBsLnRleHQgPSB0aGlzLmNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiBjdXJzb3JQb3M7XG4gIH1cblxuICBjaGVja011bHRpKHJlcGwpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXdSZXBsLCBvcmlnaW5hbFBvcywgb3JpZ2luYWxUZXh0LCBwb3MsIHJlZiwgcmVwbGFjZW1lbnRzO1xuXG4gICAgaWYgKHRoaXMubXVsdGlQb3MgIT0gbnVsbCAmJiB0aGlzLm11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJlcGxhY2VtZW50cyA9IFtyZXBsXTtcbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KCk7XG4gICAgICByZWYgPSB0aGlzLm11bHRpUG9zO1xuXG4gICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICBwb3MgPSByZWZbaV07XG5cbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0IC0gb3JpZ2luYWxQb3MpO1xuXG4gICAgICAgICAgaWYgKG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT09IG9yaWdpbmFsVGV4dCkge1xuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXBsYWNlbWVudHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbcmVwbF07XG4gICAgfVxuICB9XG5cbiAgcmVwbGFjZVdpdGgodGV4dCkge1xuICAgIHJldHVybiB0aGlzLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KHRoaXMucG9zLCB0aGlzLmdldEVuZFBvcygpLCB0ZXh0KSk7XG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50KHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCByZXBsYWNlbWVudHM7XG4gICAgcmVwbC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKTtcblxuICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYWx0ZXJSZXN1bHRGb3JCb3gocmVwbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KTtcbiAgICB9XG5cbiAgICBjdXJzb3JQb3MgPSB0aGlzLmdldEN1cnNvckZyb21SZXN1bHQocmVwbCk7XG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBQb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXTtcbiAgICByZXBsYWNlbWVudHMgPSB0aGlzLmNoZWNrTXVsdGkocmVwbCk7XG4gICAgdGhpcy5yZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0O1xuICAgIHRoaXMucmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKCk7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cyk7XG4gIH1cblxufTtcbmV4cG9ydHMuUG9zaXRpb25lZENtZEluc3RhbmNlID0gUG9zaXRpb25lZENtZEluc3RhbmNlO1xuXG4iLCJcbnZhciBQcm9jZXNzID0gY2xhc3MgUHJvY2VzcyB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxufTtcbmV4cG9ydHMuUHJvY2VzcyA9IFByb2Nlc3M7XG5cbiIsIlxuXG5jb25zdCBMb2dnZXIgPSByZXF1aXJlKFwiLi9Mb2dnZXJcIikuTG9nZ2VyO1xuXG52YXIgU3RvcmFnZSA9IGNsYXNzIFN0b3JhZ2Uge1xuICBjb25zdHJ1Y3RvcihlbmdpbmUpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgfVxuXG4gIHNhdmUoa2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmUoa2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpO1xuICAgIH1cbiAgfVxuXG4gIGxvYWQoa2V5KSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5sb2FkKGtleSk7XG4gICAgfVxuICB9XG5cbiAgZW5naW5lQXZhaWxhYmxlKCkge1xuICAgIGlmICh0aGlzLmVuZ2luZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dnZXIgPSB0aGlzLmxvZ2dlciB8fCBuZXcgTG9nZ2VyKCk7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ05vIHN0b3JhZ2UgZW5naW5lIGF2YWlsYWJsZScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5TdG9yYWdlID0gU3RvcmFnZTtcblxuIiwiXG5cbmNvbnN0IFRleHRQYXJzZXIgPSByZXF1aXJlKFwiLi9UZXh0UGFyc2VyXCIpLlRleHRQYXJzZXI7XG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1Bvc1wiKS5Qb3M7XG5cbnZhciBpc0VsZW1lbnQ7XG52YXIgRG9tS2V5TGlzdGVuZXIgPSBjbGFzcyBEb21LZXlMaXN0ZW5lciB7XG4gIHN0YXJ0TGlzdGVuaW5nKHRhcmdldCkge1xuICAgIHZhciBvbmtleWRvd24sIG9ua2V5cHJlc3MsIG9ua2V5dXAsIHRpbWVvdXQ7XG4gICAgdGltZW91dCA9IG51bGw7XG5cbiAgICBvbmtleWRvd24gPSBlID0+IHtcbiAgICAgIGlmICgoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgfHwgdGhpcy5vYmogPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpICYmIGUua2V5Q29kZSA9PT0gNjkgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAodGhpcy5vbkFjdGl2YXRpb25LZXkgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQWN0aXZhdGlvbktleSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIG9ua2V5dXAgPSBlID0+IHtcbiAgICAgIGlmICh0aGlzLm9uQW55Q2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIG9ua2V5cHJlc3MgPSBlID0+IHtcbiAgICAgIGlmICh0aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMCk7XG4gICAgfTtcblxuICAgIGlmICh0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9ua2V5ZG93bik7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9ua2V5dXApO1xuICAgICAgcmV0dXJuIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgb25rZXlwcmVzcyk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuYXR0YWNoRXZlbnQpIHtcbiAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBvbmtleWRvd24pO1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXl1cFwiLCBvbmtleXVwKTtcbiAgICAgIHJldHVybiB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXByZXNzXCIsIG9ua2V5cHJlc3MpO1xuICAgIH1cbiAgfVxuXG59O1xuZXhwb3J0cy5Eb21LZXlMaXN0ZW5lciA9IERvbUtleUxpc3RlbmVyO1xuXG5pc0VsZW1lbnQgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBlO1xuXG4gIHRyeSB7XG4gICAgLy8gVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb20pXG4gICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjsgLy8gQnJvd3NlcnMgbm90IHN1cHBvcnRpbmcgVzMgRE9NMiBkb24ndCBoYXZlIEhUTUxFbGVtZW50IGFuZFxuICAgIC8vIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG5cbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiBvYmoubm9kZVR5cGUgPT09IDEgJiYgdHlwZW9mIG9iai5zdHlsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT09IFwib2JqZWN0XCI7XG4gIH1cbn07XG5cbnZhciBUZXh0QXJlYUVkaXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQxKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQxO1xuICAgICAgdGhpcy5vYmogPSBpc0VsZW1lbnQodGhpcy50YXJnZXQpID8gdGhpcy50YXJnZXQgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldCk7XG5cbiAgICAgIGlmICh0aGlzLm9iaiA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubmFtZXNwYWNlID0gJ3RleHRhcmVhJztcbiAgICAgIHRoaXMuY2hhbmdlTGlzdGVuZXJzID0gW107XG4gICAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPSAwO1xuICAgIH1cblxuICAgIG9uQW55Q2hhbmdlKGUpIHtcbiAgICAgIHZhciBjYWxsYmFjaywgaiwgbGVuMSwgcmVmLCByZXN1bHRzO1xuXG4gICAgICBpZiAodGhpcy5fc2tpcENoYW5nZUV2ZW50IDw9IDApIHtcbiAgICAgICAgcmVmID0gdGhpcy5jaGFuZ2VMaXN0ZW5lcnM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIGNhbGxiYWNrID0gcmVmW2pdO1xuICAgICAgICAgIHJlc3VsdHMucHVzaChjYWxsYmFjaygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50LS07XG5cbiAgICAgICAgaWYgKHRoaXMub25Ta2lwZWRDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uU2tpcGVkQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBza2lwQ2hhbmdlRXZlbnQobmIgPSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2tpcENoYW5nZUV2ZW50ICs9IG5iO1xuICAgIH1cblxuICAgIGJpbmRlZFRvKGNvZGV3YXZlKSB7XG4gICAgICB0aGlzLm9uQWN0aXZhdGlvbktleSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNvZGV3YXZlLm9uQWN0aXZhdGlvbktleSgpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHRoaXMuc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpO1xuICAgIH1cblxuICAgIHNlbGVjdGlvblByb3BFeGlzdHMoKSB7XG4gICAgICByZXR1cm4gXCJzZWxlY3Rpb25TdGFydFwiIGluIHRoaXMub2JqO1xuICAgIH1cblxuICAgIGhhc0ZvY3VzKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMub2JqO1xuICAgIH1cblxuICAgIHRleHQodmFsKSB7XG4gICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHRFdmVudENoYW5nZSh2YWwpKSB7XG4gICAgICAgICAgdGhpcy5vYmoudmFsdWUgPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMub2JqLnZhbHVlO1xuICAgIH1cblxuICAgIHNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHRoaXMuc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSB8fCBzdXBlci5zcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpO1xuICAgIH1cblxuICAgIHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIHZhciBldmVudDtcblxuICAgICAgaWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50ICE9IG51bGwpIHtcbiAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudCAhPSBudWxsICYmIGV2ZW50LmluaXRUZXh0RXZlbnQgIT0gbnVsbCAmJiBldmVudC5pc1RydXN0ZWQgIT09IGZhbHNlKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIGlmIChzdGFydCAhPT0gMCkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihzdGFydCAtIDEsIHN0YXJ0KTtcbiAgICAgICAgICAgIHN0YXJ0LS07XG4gICAgICAgICAgfSBlbHNlIGlmIChlbmQgIT09IHRoaXMudGV4dExlbigpKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKGVuZCwgZW5kICsgMSk7XG4gICAgICAgICAgICBlbmQrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LmluaXRUZXh0RXZlbnQoJ3RleHRJbnB1dCcsIHRydWUsIHRydWUsIG51bGwsIHRleHQsIDkpOyAvLyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcblxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHRoaXMub2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLnNraXBDaGFuZ2VFdmVudCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgICAgaWYgKGRvY3VtZW50LmV4ZWNDb21tYW5kICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXJzb3JQb3MoKSB7XG4gICAgICBpZiAodGhpcy50bXBDdXJzb3JQb3MgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy50bXBDdXJzb3JQb3M7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmhhc0ZvY3VzKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFBvcyh0aGlzLm9iai5zZWxlY3Rpb25TdGFydCwgdGhpcy5vYmouc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJzb3JQb3NGYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKSB7XG4gICAgICB2YXIgbGVuLCBwb3MsIHJuZywgc2VsO1xuXG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuXG4gICAgICAgIGlmIChzZWwucGFyZW50RWxlbWVudCgpID09PSB0aGlzLm9iaikge1xuICAgICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayhzZWwuZ2V0Qm9va21hcmsoKSk7XG4gICAgICAgICAgbGVuID0gMDtcblxuICAgICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIGxlbisrO1xuICAgICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJuZy5zZXRFbmRQb2ludChcIlN0YXJ0VG9TdGFydFwiLCB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKSk7XG4gICAgICAgICAgcG9zID0gbmV3IFBvcygwLCBsZW4pO1xuXG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMCkge1xuICAgICAgICAgICAgcG9zLnN0YXJ0Kys7XG4gICAgICAgICAgICBwb3MuZW5kKys7XG4gICAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudG1wQ3Vyc29yUG9zID0gbnVsbDtcbiAgICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0O1xuICAgICAgICAgIHJldHVybiB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmQ7XG4gICAgICAgIH0sIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKSB7XG4gICAgICB2YXIgcm5nO1xuXG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICBybmcubW92ZVN0YXJ0KFwiY2hhcmFjdGVyXCIsIHN0YXJ0KTtcbiAgICAgICAgcm5nLmNvbGxhcHNlKCk7XG4gICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIGVuZCAtIHN0YXJ0KTtcbiAgICAgICAgcmV0dXJuIHJuZy5zZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYW5nKCkge1xuICAgICAgaWYgKHRoaXMuX2xhbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmc7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldExhbmcodmFsKSB7XG4gICAgICB0aGlzLl9sYW5nID0gdmFsO1xuICAgICAgcmV0dXJuIHRoaXMub2JqLnNldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJywgdmFsKTtcbiAgICB9XG5cbiAgICBjYW5MaXN0ZW5Ub0NoYW5nZSgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICAgIHZhciBpO1xuXG4gICAgICBpZiAoKGkgPSB0aGlzLmNoYW5nZUxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cykge1xuICAgICAgaWYgKHJlcGxhY2VtZW50cy5sZW5ndGggPiAwICYmIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbdGhpcy5nZXRDdXJzb3JQb3MoKV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdXBlci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpO1xuICAgIH1cblxuICB9XG5cbiAgO1xuICBUZXh0QXJlYUVkaXRvci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmcgPSBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmc7XG4gIHJldHVybiBUZXh0QXJlYUVkaXRvcjtcbn0uY2FsbCh2b2lkIDApO1xuXG5leHBvcnRzLlRleHRBcmVhRWRpdG9yID0gVGV4dEFyZWFFZGl0b3I7XG5cbiIsIlxuXG5jb25zdCBFZGl0b3IgPSByZXF1aXJlKFwiLi9FZGl0b3JcIikuRWRpdG9yO1xuXG5jb25zdCBQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9Qb3NcIikuUG9zO1xuXG52YXIgVGV4dFBhcnNlciA9IGNsYXNzIFRleHRQYXJzZXIgZXh0ZW5kcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcihfdGV4dCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fdGV4dCA9IF90ZXh0O1xuICB9XG5cbiAgdGV4dCh2YWwpIHtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHQgPSB2YWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gIH1cblxuICB0ZXh0Q2hhckF0KHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKVtwb3NdO1xuICB9XG5cbiAgdGV4dExlbihwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkubGVuZ3RoO1xuICB9XG5cbiAgdGV4dFN1YnN0cihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgfVxuXG4gIGluc2VydFRleHRBdCh0ZXh0LCBwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnN1YnN0cmluZygwLCBwb3MpICsgdGV4dCArIHRoaXMudGV4dCgpLnN1YnN0cmluZyhwb3MsIHRoaXMudGV4dCgpLmxlbmd0aCkpO1xuICB9XG5cbiAgc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIHRoaXMudGV4dCgpLnNsaWNlKGVuZCkpO1xuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zKCkge1xuICAgIHJldHVybiB0aGlzLnRhcmdldDtcbiAgfVxuXG4gIHNldEN1cnNvclBvcyhzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBlbmQgPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy50YXJnZXQgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpO1xuICB9XG5cbn07XG5leHBvcnRzLlRleHRQYXJzZXIgPSBUZXh0UGFyc2VyO1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkNvZGV3YXZlXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIENvZGV3YXZlLkNvZGV3YXZlO1xuICB9XG59KTtcblxuY29uc3QgQ29kZXdhdmUgPSByZXF1aXJlKFwiLi9Db2Rld2F2ZVwiKTtcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuL0NvbW1hbmRcIik7XG5cbmNvbnN0IENvcmVDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKFwiLi9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXJcIikuQ29yZUNvbW1hbmRQcm92aWRlcjtcblxuY29uc3QgSnNDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKFwiLi9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyXCIpLkpzQ29tbWFuZFByb3ZpZGVyO1xuXG5jb25zdCBQaHBDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKFwiLi9jbWRzL1BocENvbW1hbmRQcm92aWRlclwiKS5QaHBDb21tYW5kUHJvdmlkZXI7XG5cbmNvbnN0IEh0bWxDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKFwiLi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXJcIikuSHRtbENvbW1hbmRQcm92aWRlcjtcblxuY29uc3QgRmlsZUNvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoXCIuL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlclwiKS5GaWxlQ29tbWFuZFByb3ZpZGVyO1xuXG5jb25zdCBTdHJpbmdDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKFwiLi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlclwiKS5TdHJpbmdDb21tYW5kUHJvdmlkZXI7XG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uaW5nL1Bvc1wiKS5Qb3M7XG5cbmNvbnN0IFdyYXBwZWRQb3MgPSByZXF1aXJlKFwiLi9wb3NpdGlvbmluZy9XcmFwcGVkUG9zXCIpLldyYXBwZWRQb3M7XG5cbmNvbnN0IExvY2FsU3RvcmFnZUVuZ2luZSA9IHJlcXVpcmUoXCIuL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZVwiKS5Mb2NhbFN0b3JhZ2VFbmdpbmU7XG5cblBvcy53cmFwQ2xhc3MgPSBXcmFwcGVkUG9zO1xuQ29kZXdhdmUuQ29kZXdhdmUuaW5zdGFuY2VzID0gW107XG5Db21tYW5kLkNvbW1hbmQucHJvdmlkZXJzID0gW25ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpLCBuZXcgUGhwQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBGaWxlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBTdHJpbmdDb21tYW5kUHJvdmlkZXIoKV07XG5cbmlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICBDb21tYW5kLkNvbW1hbmQuc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2VFbmdpbmUoKTtcbn1cblxuIiwiXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi4vQ29tbWFuZFwiKTtcblxuY29uc3QgTGFuZ0RldGVjdG9yID0gcmVxdWlyZShcIi4uL2RldGVjdG9ycy9MYW5nRGV0ZWN0b3JcIikuTGFuZ0RldGVjdG9yO1xuXG5jb25zdCBBbHdheXNFbmFibGVkID0gcmVxdWlyZShcIi4uL2RldGVjdG9ycy9BbHdheXNFbmFibGVkXCIpLkFsd2F5c0VuYWJsZWQ7XG5cbmNvbnN0IEJveEhlbHBlciA9IHJlcXVpcmUoXCIuLi9Cb3hIZWxwZXJcIikuQm94SGVscGVyO1xuXG5jb25zdCBFZGl0Q21kUHJvcCA9IHJlcXVpcmUoXCIuLi9FZGl0Q21kUHJvcFwiKS5FZGl0Q21kUHJvcDtcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvU3RyaW5nSGVscGVyXCIpLlN0cmluZ0hlbHBlcjtcblxuY29uc3QgUGF0aEhlbHBlciA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL1BhdGhIZWxwZXJcIikuUGF0aEhlbHBlcjtcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKFwiLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnRcIikuUmVwbGFjZW1lbnQ7XG5cbnZhciBCb3hDbWQsIENsb3NlQ21kLCBFZGl0Q21kLCBFbW1ldENtZCwgTmFtZVNwYWNlQ21kLCBUZW1wbGF0ZUNtZCwgYWxpYXNDb21tYW5kLCBleGVjX3BhcmVudCwgZ2V0Q29tbWFuZCwgZ2V0Q29udGVudCwgZ2V0UGFyYW0sIGhlbHAsIGxpc3RDb21tYW5kLCBub19leGVjdXRlLCBxdW90ZV9jYXJyZXQsIHJlbW92ZUNvbW1hbmQsIHJlbmFtZUNvbW1hbmQsIHNldENvbW1hbmQsIHN0b3JlSnNvbkNvbW1hbmQ7XG52YXIgQ29yZUNvbW1hbmRQcm92aWRlciA9IGNsYXNzIENvcmVDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGNvcmU7XG4gICAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kLkNvbW1hbmQoJ2NvcmUnKSk7XG4gICAgY21kcy5hZGREZXRlY3RvcihuZXcgQWx3YXlzRW5hYmxlZCgnY29yZScpKTtcbiAgICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSk7XG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICAnaGVscCc6IHtcbiAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAncmVzdWx0JzogaGVscCxcbiAgICAgICAgJ3BhcnNlJzogdHJ1ZSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJUbyBnZXQgaGVscCBvbiBhIHBlY2lmaWMgY29tbWFuZCwgZG8gOlxcbn5+aGVscCBoZWxsb35+IChoZWxsbyBiZWluZyB0aGUgY29tbWFuZClcIixcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ292ZXJ2aWV3Jzoge1xuICAgICAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAgICAgJ3Jlc3VsdCc6IFwifn5ib3h+flxcbn5+cXVvdGVfY2FycmV0fn5cXG4gIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXFxuIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xcbi8gL19fLyBfIFxcXFwvIF9gIC8gLV9cXFxcIFxcXFwvXFxcXC8gLyBfYCBcXFxcIFYgLyAtXy9cXG5cXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XFxuVGhlIHRleHQgZWRpdG9yIGhlbHBlclxcbn5+L3F1b3RlX2NhcnJldH5+XFxuXFxuV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcXG55b3VyIHRleHQgZWRpdG9yLiBUaGVzZSBjb21tYW5kcyBtdXN0IGJlIHBsYWNlZCBiZXR3ZWVuIHR3byBcXG5wYWlycyBvZiBcXFwiflxcXCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiLCB3aXRoIHlvdXIgY3Vyc29yIGluc2lkZSB0aGUgY29tbWFuZFxcbkV4OiB+fiFoZWxsb35+XFxuXFxuWW91IGRvbnQgbmVlZCB0byBhY3R1YWxseSB0eXBlIGFueSBcXFwiflxcXCIgKHRpbGRlKS4gXFxuUHJlc3NpbmcgXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpbGwgYWRkIHRoZW0gaWYgeW91IGFyZSBub3QgYWxyZWFkeVxcbndpdGhpbiBhIGNvbW1hbmQuXFxuXFxuQ29kZXdhdmUgZG9lcyBub3QgdXNlIFVJIHRvIGRpc3BsYXkgYW55IGluZm9ybWF0aW9uLiBcXG5JbnN0ZWFkLCBpdCB1c2VzIHRleHQgd2l0aGluIGNvZGUgY29tbWVudHMgdG8gbWltaWMgVUlzLiBcXG5UaGUgZ2VuZXJhdGVkIGNvbW1lbnQgYmxvY2tzIHdpbGwgYmUgcmVmZXJyZWQgdG8gYXMgd2luZG93cyBcXG5pbiB0aGUgaGVscCBzZWN0aW9ucy5cXG5cXG5UbyBjbG9zZSB0aGlzIHdpbmRvdyAoaS5lLiByZW1vdmUgdGhpcyBjb21tZW50IGJsb2NrKSwgcHJlc3MgXFxuXFxcImN0cmxcXFwiK1xcXCJzaGlmdFxcXCIrXFxcImVcXFwiIHdpdGggeW91ciBjdXJzb3Igb24gdGhlIGxpbmUgYmVsbG93Llxcbn5+IWNsb3NlfH5+XFxuXFxuVXNlIHRoZSBmb2xsb3dpbmcgY29tbWFuZCBmb3IgYSB3YWxrdGhyb3VnaCBvZiBzb21lIG9mIHRoZSBtYW55XFxuZmVhdHVyZXMgb2YgQ29kZXdhdmVcXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gb3Igfn4haGVscDpkZW1vfn5cXG5cXG5MaXN0IG9mIGFsbCBoZWxwIHN1YmplY3RzIFxcbn5+IWhlbHA6c3ViamVjdHN+fiBvciB+fiFoZWxwOnN1Yn5+IFxcblxcbn5+IWNsb3Nlfn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnc3ViamVjdHMnOiB7XG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn4haGVscH5+XFxufn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcXG5+fiFoZWxwOnN1YmplY3Rzfn4gKH5+IWhlbHA6c3Vifn4pXFxufn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6aGVscDpzdWJqZWN0cydcbiAgICAgICAgICB9LFxuICAgICAgICAgICdnZXRfc3RhcnRlZCc6IHtcbiAgICAgICAgICAgICdyZXBsYWNlQm94JzogdHJ1ZSxcbiAgICAgICAgICAgICdyZXN1bHQnOiBcIn5+Ym94fn5cXG5UaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cXG5+fiFoZWxsb3x+flxcblxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuXFxuRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcXG5+fiFoZWxwOmVkaXRpbmd+flxcblxcbkNvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxcbm9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xcbn5+IWpzOmZ+flxcbn5+IWpzOmlmfn5cXG4gIH5+IWpzOmxvZ35+XFxcIn5+IWhlbGxvfn5cXFwifn4hL2pzOmxvZ35+XFxufn4hL2pzOmlmfn5cXG5+fiEvanM6Zn5+XFxuXFxuQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxcbnByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLiBFbW1ldCBhYmJyZXZpYXRpb25zIHdpbGwgYmUgXFxudXNlZCBhdXRvbWF0aWNhbGx5IGlmIHlvdSBhcmUgaW4gYSBIVE1MIG9yIENTUyBmaWxlLlxcbn5+IXVsPmxpfn4gKGlmIHlvdSBhcmUgaW4gYSBodG1sIGRvY2N1bWVudClcXG5+fiFlbW1ldCB1bD5saX5+XFxufn4hZW1tZXQgbTIgY3Nzfn5cXG5cXG5Db21tYW5kcyBhcmUgc3RvcmVkIGluIG5hbWVzcGFjZXMuIFRoZSBzYW1lIGNvbW1hbmQgY2FuIGhhdmUgXFxuZGlmZmVyZW50IHJlc3VsdHMgZGVwZW5kaW5nIG9uIHRoZSBuYW1lc3BhY2UuXFxufn4hanM6ZWFjaH5+XFxufn4hcGhwOm91dGVyOmVhY2h+flxcbn5+IXBocDppbm5lcjplYWNofn5cXG5cXG5Tb21lIG9mIHRoZSBuYW1lc3BhY2VzIGFyZSBhY3RpdmUgZGVwZW5kaW5nIG9uIHRoZSBjb250ZXh0LiBUaGVcXG5mb2xsb3dpbmcgY29tbWFuZHMgYXJlIHRoZSBzYW1lIGFuZCB3aWxsIGRpc3BsYXkgdGhlIGN1cnJlbnRseVxcbmFjdGl2ZSBuYW1lc3BhY2UuIFRoZSBmaXJzdCBjb21tYW5kIGNvbW1hbmQgd29ya3MgYmVjYXVzZSB0aGUgXFxuY29yZSBuYW1lc3BhY2UgaXMgYWN0aXZlLlxcbn5+IW5hbWVzcGFjZX5+XFxufn4hY29yZTpuYW1lc3BhY2V+flxcblxcbllvdSBjYW4gbWFrZSBhIG5hbWVzcGFjZSBhY3RpdmUgd2l0aCB0aGUgZm9sbG93aW5nIGNvbW1hbmQuXFxufn4hbmFtZXNwYWNlIHBocH5+XFxuXFxuQ2hlY2sgdGhlIG5hbWVzcGFjZXMgYWdhaW5cXG5+fiFuYW1lc3BhY2V+flxcblxcbkluIGFkZGl0aW9uIHRvIGRldGVjdGluZyB0aGUgZG9jdW1lbnQgdHlwZSwgQ29kZXdhdmUgY2FuIGRldGVjdCB0aGVcXG5jb250ZXh0IGZyb20gdGhlIHN1cnJvdW5kaW5nIHRleHQuIEluIGEgUEhQIGZpbGUsIGl0IG1lYW5zIENvZGV3YXZlIFxcbndpbGwgYWRkIHRoZSBQSFAgdGFncyB3aGVuIHlvdSBuZWVkIHRoZW0uXFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgICdkZW1vJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpoZWxwOmdldF9zdGFydGVkJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2VkaXRpbmcnOiB7XG4gICAgICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAgICAgJ2ludHJvJzoge1xuICAgICAgICAgICAgICAgICdyZXN1bHQnOiBcIkNvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXFxucHV0IHlvdXIgY29udGVudCBpbnNpZGUgXFxcInNvdXJjZVxcXCIgdGhlIGRvIFxcXCJzYXZlXFxcIi4gVHJ5IGFkZGluZyBhbnkgXFxudGV4dCB0aGF0IGlzIG9uIHlvdXIgbWluZC5cXG5+fiFlZGl0IG15X25ld19jb21tYW5kfH5+XFxuXFxuSWYgeW91IGRpZCB0aGUgbGFzdCBzdGVwIHJpZ2h0LCB5b3Ugc2hvdWxkIHNlZSB5b3VyIHRleHQgd2hlbiB5b3VcXG5kbyB0aGUgZm9sbG93aW5nIGNvbW1hbmQuIEl0IGlzIG5vdyBzYXZlZCBhbmQgeW91IGNhbiB1c2UgaXQgXFxud2hlbmV2ZXIgeW91IHdhbnQuXFxufn4hbXlfbmV3X2NvbW1hbmR+flwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAncmVwbGFjZUJveCc6IHRydWUsXG4gICAgICAgICAgICAncmVzdWx0JzogXCJ+fmJveH5+XFxufn5oZWxwOmVkaXRpbmc6aW50cm9+flxcblxcbkFsbCB0aGUgd2luZG93cyBvZiBDb2Rld2F2ZSBhcmUgbWFkZSB3aXRoIHRoZSBjb21tYW5kIFxcXCJib3hcXFwiLiBcXG5UaGV5IGFyZSBtZWFudCB0byBkaXNwbGF5IHRleHQgdGhhdCBzaG91bGQgbm90IHJlbWFpbiBpbiB5b3VyIGNvZGUuIFxcblRoZXkgYXJlIHZhbGlkIGNvbW1lbnRzIHNvIHRoZXkgd29uJ3QgYnJlYWsgeW91ciBjb2RlIGFuZCB0aGUgY29tbWFuZCBcXG5cXFwiY2xvc2VcXFwiIGNhbiBiZSB1c2VkIHRvIHJlbW92ZSB0aGVtIHJhcGlkbHkuIFlvdSBjYW4gbWFrZSB5b3VyIG93biBcXG5jb21tYW5kcyB3aXRoIHRoZW0gaWYgeW91IG5lZWQgdG8gZGlzcGxheSBzb21lIHRleHQgdGVtcG9yYXJpbHkuXFxufn4hYm94fn5cXG5UaGUgYm94IHdpbGwgc2NhbGUgd2l0aCB0aGUgY29udGVudCB5b3UgcHV0IGluIGl0XFxufn4hY2xvc2V8fn5cXG5+fiEvYm94fn5cXG5cXG5+fnF1b3RlX2NhcnJldH5+XFxuV2hlbiB5b3UgY3JlYXRlIGEgY29tbWFuZCwgeW91IG1heSB3YW50IHRvIHNwZWNpZnkgd2hlcmUgdGhlIGN1cnNvciBcXG53aWxsIGJlIGxvY2F0ZWQgb25jZSB0aGUgY29tbWFuZCBpcyBleHBhbmRlZC4gVG8gZG8gdGhhdCwgdXNlIGEgXFxcInxcXFwiIFxcbihWZXJ0aWNhbCBiYXIpLiBVc2UgMiBvZiB0aGVtIGlmIHlvdSB3YW50IHRvIHByaW50IHRoZSBhY3R1YWwgXFxuY2hhcmFjdGVyLlxcbn5+IWJveH5+XFxub25lIDogfCBcXG50d28gOiB8fFxcbn5+IS9ib3h+flxcblxcbllvdSBjYW4gYWxzbyB1c2UgdGhlIFxcXCJlc2NhcGVfcGlwZXNcXFwiIGNvbW1hbmQgdGhhdCB3aWxsIGVzY2FwZSBhbnkgXFxudmVydGljYWwgYmFycyB0aGF0IGFyZSBiZXR3ZWVuIGl0cyBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3NcXG5+fiFlc2NhcGVfcGlwZXN+flxcbnxcXG5+fiEvZXNjYXBlX3BpcGVzfn5cXG5cXG5Db21tYW5kcyBpbnNpZGUgb3RoZXIgY29tbWFuZHMgd2lsbCBiZSBleHBhbmRlZCBhdXRvbWF0aWNhbGx5LlxcbklmIHlvdSB3YW50IHRvIHByaW50IGEgY29tbWFuZCB3aXRob3V0IGhhdmluZyBpdCBleHBhbmQgd2hlbiBcXG50aGUgcGFyZW50IGNvbW1hbmQgaXMgZXhwYW5kZWQsIHVzZSBhIFxcXCIhXFxcIiAoZXhjbGFtYXRpb24gbWFyaykuXFxufn4hIWhlbGxvfn5cXG5cXG5Gb3IgY29tbWFuZHMgdGhhdCBoYXZlIGJvdGggYW4gb3BlbmluZyBhbmQgYSBjbG9zaW5nIHRhZywgeW91IGNhbiB1c2VcXG50aGUgXFxcImNvbnRlbnRcXFwiIGNvbW1hbmQuIFxcXCJjb250ZW50XFxcIiB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRleHRcXG50aGF0IGlzIGJldHdlZW4gdGhlIHRhZ3MuIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBob3cgaXQgY2FuIGJlIHVzZWQuXFxufn4hZWRpdCBwaHA6aW5uZXI6aWZ+flxcblxcbn5+L3F1b3RlX2NhcnJldH5+XFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnZWRpdCc6IHtcbiAgICAgICAgICAgICdhbGlhc09mJzogJ2NvcmU6aGVscDplZGl0aW5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnbm9fZXhlY3V0ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IG5vX2V4ZWN1dGUsXG4gICAgICAgICdoZWxwJzogXCJQcmV2ZW50IGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgZnJvbSBleGVjdXRpbmdcIlxuICAgICAgfSxcbiAgICAgICdlc2NhcGVfcGlwZXMnOiB7XG4gICAgICAgICdyZXN1bHQnOiBxdW90ZV9jYXJyZXQsXG4gICAgICAgICdjaGVja0NhcnJldCc6IGZhbHNlLFxuICAgICAgICAnaGVscCc6IFwiRXNjYXBlIGFsbCBjYXJyZXRzIChmcm9tIFxcXCJ8XFxcIiB0byBcXFwifHxcXFwiKVwiXG4gICAgICB9LFxuICAgICAgJ3F1b3RlX2NhcnJldCc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgICB9LFxuICAgICAgJ2V4ZWNfcGFyZW50Jzoge1xuICAgICAgICAnZXhlY3V0ZSc6IGV4ZWNfcGFyZW50LFxuICAgICAgICAnaGVscCc6IFwiRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1wiXG4gICAgICB9LFxuICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRDb250ZW50LFxuICAgICAgICAnaGVscCc6IFwiTWFpbmx5IHVzZWQgZm9yIGNvbW1hbmQgZWRpdGlvbiwgXFxudGhpcyB3aWxsIHJldHVybiB3aGF0IHdhcyBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZSB0YWcgb2YgYSBjb21tYW5kXCJcbiAgICAgIH0sXG4gICAgICAnYm94Jzoge1xuICAgICAgICAnY2xzJzogQm94Q21kLFxuICAgICAgICAnaGVscCc6IFwiQ3JlYXRlIHRoZSBhcHBhcmVuY2Ugb2YgYSBib3ggY29tcG9zZWQgZnJvbSBjaGFyYWN0ZXJzLiBcXG5Vc3VhbGx5IHdyYXBwZWQgaW4gYSBjb21tZW50LlxcblxcblRoZSBib3ggd2lsbCB0cnkgdG8gYWp1c3QgaXQncyBzaXplIGZyb20gdGhlIGNvbnRlbnRcIlxuICAgICAgfSxcbiAgICAgICdjbG9zZSc6IHtcbiAgICAgICAgJ2Nscyc6IENsb3NlQ21kLFxuICAgICAgICAnaGVscCc6IFwiV2lsbCBjbG9zZSB0aGUgZmlyc3QgYm94IGFyb3VuZCB0aGlzXCJcbiAgICAgIH0sXG4gICAgICAncGFyYW0nOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRQYXJhbSxcbiAgICAgICAgJ2hlbHAnOiBcIk1haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gYSBwYXJhbWV0ZXIgZnJvbSB0aGlzIGNvbW1hbmQgY2FsbFxcblxcbllvdSBjYW4gcGFzcyBhIG51bWJlciwgYSBzdHJpbmcsIG9yIGJvdGguIFxcbkEgbnVtYmVyIGZvciBhIHBvc2l0aW9uZWQgYXJndW1lbnQgYW5kIGEgc3RyaW5nXFxuZm9yIGEgbmFtZWQgcGFyYW1ldGVyXCJcbiAgICAgIH0sXG4gICAgICAnZWRpdCc6IHtcbiAgICAgICAgJ2NtZHMnOiBFZGl0Q21kLnNldENtZHMoe1xuICAgICAgICAgICdzYXZlJzoge1xuICAgICAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICAnY2xzJzogRWRpdENtZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnY21kJ10sXG4gICAgICAgICdoZWxwJzogXCJBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxcblNlZSB+fiFoZWxwOmVkaXRpbmd+fiBmb3IgYSBxdWljayB0dXRvcmlhbFwiXG4gICAgICB9LFxuICAgICAgJ3JlbmFtZSc6IHtcbiAgICAgICAgJ2NtZHMnOiB7XG4gICAgICAgICAgJ25vdF9hcHBsaWNhYmxlJzogXCJ+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIixcbiAgICAgICAgICAnbm90X2ZvdW5kJzogXCJ+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc3VsdCc6IHJlbmFtZUNvbW1hbmQsXG4gICAgICAgICdwYXJzZSc6IHRydWUsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2Zyb20nLCAndG8nXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byByZW5hbWUgYSBjb21tYW5kIGFuZCBjaGFuZ2UgaXQncyBuYW1lc3BhY2UuIFxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG4tIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcXG4tIFRoZW4gc2Vjb25kIHBhcmFtIGlzIHRoZSBuZXcgbmFtZSwgaWYgaXQgaGFzIG5vIG5hbWVzcGFjZSxcXG4gIGl0IHdpbGwgdXNlIHRoZSBvbmUgZnJvbSB0aGUgb3JpZ2luYWwgY29tbWFuZC5cXG5cXG5leC46IH5+IXJlbmFtZSBteV9jb21tYW5kIG15X2NvbW1hbmQyfn5cIlxuICAgICAgfSxcbiAgICAgICdyZW1vdmUnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfYXBwbGljYWJsZSc6IFwifn5ib3h+flxcbllvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCIsXG4gICAgICAgICAgJ25vdF9mb3VuZCc6IFwifn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+flwiXG4gICAgICAgIH0sXG4gICAgICAgICdyZXN1bHQnOiByZW1vdmVDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydjbWQnXSxcbiAgICAgICAgJ2hlbHAnOiBcIkFsbG93cyB0byByZW1vdmUgYSBjb21tYW5kLiBcXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXCJcbiAgICAgIH0sXG4gICAgICAnYWxpYXMnOiB7XG4gICAgICAgICdjbWRzJzoge1xuICAgICAgICAgICdub3RfZm91bmQnOiBcIn5+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICB9LFxuICAgICAgICAncmVzdWx0JzogYWxpYXNDb21tYW5kLFxuICAgICAgICAncGFyc2UnOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ25hbWVzcGFjZSc6IHtcbiAgICAgICAgJ2Nscyc6IE5hbWVTcGFjZUNtZCxcbiAgICAgICAgJ2hlbHAnOiBcIlNob3cgdGhlIGN1cnJlbnQgbmFtZXNwYWNlcy5cXG5cXG5BIG5hbWUgc3BhY2UgY291bGQgYmUgdGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlXFxub3Igb3RoZXIga2luZCBvZiBjb250ZXh0c1xcblxcbklmIHlvdSBwYXNzIGEgcGFyYW0gdG8gdGhpcyBjb21tYW5kLCBpdCB3aWxsIFxcbmFkZCB0aGUgcGFyYW0gYXMgYSBuYW1lc3BhY2UgZm9yIHRoZSBjdXJyZW50IGVkaXRvclwiXG4gICAgICB9LFxuICAgICAgJ25zcGMnOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6bmFtZXNwYWNlJ1xuICAgICAgfSxcbiAgICAgICdsaXN0Jzoge1xuICAgICAgICAncmVzdWx0JzogbGlzdENvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnYm94JywgJ2NvbnRleHQnXSxcbiAgICAgICAgJ3JlcGxhY2VCb3gnOiB0cnVlLFxuICAgICAgICAncGFyc2UnOiB0cnVlLFxuICAgICAgICAnaGVscCc6IFwiTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcXG5cXG5Zb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcXG5ieSBkZWZhdWx0IGFsbCBjdXJlbnQgbmFtZXNwYWNlIHdpbGwgYmUgc2hvd25cIlxuICAgICAgfSxcbiAgICAgICdscyc6IHtcbiAgICAgICAgJ2FsaWFzT2YnOiAnY29yZTpsaXN0J1xuICAgICAgfSxcbiAgICAgICdnZXQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBnZXRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJ10sXG4gICAgICAgICdoZWxwJzogXCJvdXRwdXQgdGhlIHZhbHVlIG9mIGEgdmFyaWFibGVcIlxuICAgICAgfSxcbiAgICAgICdzZXQnOiB7XG4gICAgICAgICdyZXN1bHQnOiBzZXRDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWyduYW1lJywgJ3ZhbHVlJywgJ3ZhbCddLFxuICAgICAgICAnaGVscCc6IFwic2V0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlXCJcbiAgICAgIH0sXG4gICAgICAnc3RvcmVfanNvbic6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IHN0b3JlSnNvbkNvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ25hbWUnLCAnanNvbiddLFxuICAgICAgICAnaGVscCc6IFwic2V0IGEgdmFyaWFibGUgd2l0aCBzb21lIGpzb24gZGF0YVwiXG4gICAgICB9LFxuICAgICAgJ2pzb24nOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6c3RvcmVfanNvbidcbiAgICAgIH0sXG4gICAgICAndGVtcGxhdGUnOiB7XG4gICAgICAgICdjbHMnOiBUZW1wbGF0ZUNtZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnbmFtZScsICdzZXAnXSxcbiAgICAgICAgJ2hlbHAnOiBcInJlbmRlciBhIHRlbXBsYXRlIGZvciBhIHZhcmlhYmxlXFxuXFxuSWYgdGhlIGZpcnN0IHBhcmFtIGlzIG5vdCBzZXQgaXQgd2lsbCB1c2UgYWxsIHZhcmlhYmxlcyBcXG5mb3IgdGhlIHJlbmRlclxcbklmIHRoZSB2YXJpYWJsZSBpcyBhbiBhcnJheSB0aGUgdGVtcGxhdGUgd2lsbCBiZSByZXBlYXRlZCBcXG5mb3IgZWFjaCBpdGVtc1xcblRoZSBgc2VwYCBwYXJhbSBkZWZpbmUgd2hhdCB3aWxsIHNlcGFyYXRlIGVhY2ggaXRlbSBcXG5hbmQgZGVmYXVsdCB0byBhIGxpbmUgYnJlYWtcIlxuICAgICAgfSxcbiAgICAgICdlbW1ldCc6IHtcbiAgICAgICAgJ2Nscyc6IEVtbWV0Q21kLFxuICAgICAgICAnaGVscCc6IFwiQ29kZVdhdmUgY29tZXMgd2l0aCB0aGUgZXhjZWxsZW50IEVtbWV0ICggaHR0cDovL2VtbWV0LmlvLyApIHRvIFxcbnByb3ZpZGUgZXZlbnQgbW9yZSBhYmJyZXZpYXRpb25zLlxcblxcblBhc3MgdGhlIEVtbWV0IGFiYnJldmlhdGlvbiBhcyBhIHBhcmFtIHRvIGV4cGVuZCBpdC5cIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5leHBvcnRzLkNvcmVDb21tYW5kUHJvdmlkZXIgPSBDb3JlQ29tbWFuZFByb3ZpZGVyO1xuXG5oZWxwID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBjbWQsIGNtZE5hbWUsIGhlbHBDbWQsIHN1YmNvbW1hbmRzLCB0ZXh0O1xuICBjbWROYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSk7XG5cbiAgaWYgKGNtZE5hbWUgIT0gbnVsbCkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKGNtZE5hbWUpO1xuXG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBoZWxwQ21kID0gY21kLmdldENtZCgnaGVscCcpO1xuICAgICAgdGV4dCA9IGhlbHBDbWQgPyBgfn4ke2hlbHBDbWQuZnVsbE5hbWV9fn5gIDogXCJUaGlzIGNvbW1hbmQgaGFzIG5vIGhlbHAgdGV4dFwiO1xuICAgICAgc3ViY29tbWFuZHMgPSBjbWQuY21kcy5sZW5ndGggPyBgXFxuU3ViLUNvbW1hbmRzIDpcXG5+fmxzICR7Y21kLmZ1bGxOYW1lfSBib3g6bm8gY29udGV4dDpub35+YCA6IFwiXCI7XG4gICAgICByZXR1cm4gYH5+Ym94fn5cXG5IZWxwIGZvciB+fiEke2NtZC5mdWxsTmFtZX1+fiA6XFxuXFxuJHt0ZXh0fVxcbiR7c3ViY29tbWFuZHN9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICd+fmhlbHA6b3ZlcnZpZXd+fic7XG4gIH1cbn07XG5cbm5vX2V4ZWN1dGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIHJlZztcbiAgcmVnID0gbmV3IFJlZ0V4cChcIl4oXCIgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSk7XG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsICckMScpO1xufTtcblxucXVvdGVfY2FycmV0ID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHJldHVybiBpbnN0YW5jZS5jb250ZW50LnJlcGxhY2UoL1xcfC9nLCAnfHwnKTtcbn07XG5cbmV4ZWNfcGFyZW50ID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciByZXM7XG5cbiAgaWYgKGluc3RhbmNlLnBhcmVudCAhPSBudWxsKSB7XG4gICAgcmVzID0gaW5zdGFuY2UucGFyZW50LmV4ZWN1dGUoKTtcbiAgICBpbnN0YW5jZS5yZXBsYWNlU3RhcnQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZVN0YXJ0O1xuICAgIGluc3RhbmNlLnJlcGxhY2VFbmQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZUVuZDtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59O1xuXG5nZXRDb250ZW50ID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBhZmZpeGVzX2VtcHR5LCBwcmVmaXgsIHN1ZmZpeDtcbiAgYWZmaXhlc19lbXB0eSA9IGluc3RhbmNlLmdldFBhcmFtKFsnYWZmaXhlc19lbXB0eSddLCBmYWxzZSk7XG4gIHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgc3VmZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpO1xuXG4gIGlmIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuY29udGVudCB8fCAnJykgKyBzdWZmaXg7XG4gIH1cblxuICBpZiAoYWZmaXhlc19lbXB0eSkge1xuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXg7XG4gIH1cbn07XG5cbnJlbmFtZUNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgIHZhciBzdG9yYWdlO1xuICAgIHN0b3JhZ2UgPSBDb21tYW5kLkNvbW1hbmQuc3RvcmFnZTtcbiAgICByZXR1cm4gc3RvcmFnZS5sb2FkKCdjbWRzJyk7XG4gIH0pLnRoZW4oc2F2ZWRDbWRzID0+IHtcbiAgICB2YXIgY21kLCBjbWREYXRhLCBuZXdOYW1lLCBvcmlnbmluYWxOYW1lO1xuICAgIG9yaWduaW5hbE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2Zyb20nXSk7XG4gICAgbmV3TmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAndG8nXSk7XG5cbiAgICBpZiAob3JpZ25pbmFsTmFtZSAhPSBudWxsICYmIG5ld05hbWUgIT0gbnVsbCkge1xuICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQob3JpZ25pbmFsTmFtZSk7XG5cbiAgICAgIGlmIChzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0gIT0gbnVsbCAmJiBjbWQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoIShuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xKSkge1xuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCAnJykgKyBuZXdOYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXTtcblxuICAgICAgICBDb21tYW5kLkNvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsIGNtZERhdGEpO1xuXG4gICAgICAgIGNtZC51bnJlZ2lzdGVyKCk7XG4gICAgICAgIHNhdmVkQ21kc1tuZXdOYW1lXSA9IGNtZERhdGE7XG4gICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV07XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gc3RvcmFnZS5zYXZlKCdjbWRzJywgc2F2ZWRDbWRzKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gXCJ+fm5vdF9hcHBsaWNhYmxlfn5cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxucmVtb3ZlQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIG5hbWU7XG4gICAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pO1xuXG4gICAgaWYgKG5hbWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgc2F2ZWRDbWRzLCBzdG9yYWdlO1xuICAgICAgICBzdG9yYWdlID0gQ29tbWFuZC5Db21tYW5kLnN0b3JhZ2U7XG4gICAgICAgIHJldHVybiBzYXZlZENtZHMgPSBzdG9yYWdlLmxvYWQoJ2NtZHMnKTtcbiAgICAgIH0pLnRoZW4oc2F2ZWRDbWRzID0+IHtcbiAgICAgICAgdmFyIGNtZCwgY21kRGF0YTtcbiAgICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQobmFtZSk7XG5cbiAgICAgICAgaWYgKHNhdmVkQ21kc1tuYW1lXSAhPSBudWxsICYmIGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tuYW1lXTtcbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpO1xuICAgICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbbmFtZV07XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcyk7XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2FwcGxpY2FibGV+flwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmFsaWFzQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgYWxpYXMsIGNtZCwgbmFtZTtcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgYWxpYXMgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2FsaWFzJ10pO1xuXG4gIGlmIChuYW1lICE9IG51bGwgJiYgYWxpYXMgIT0gbnVsbCkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0Q21kKG5hbWUpO1xuXG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQgPSBjbWQuZ2V0QWxpYXNlZCgpIHx8IGNtZDsgLy8gdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAvLyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcblxuICAgICAgQ29tbWFuZC5Db21tYW5kLnNhdmVDbWQoYWxpYXMsIHtcbiAgICAgICAgYWxpYXNPZjogY21kLmZ1bGxOYW1lXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIn5+bm90X2ZvdW5kfn5cIjtcbiAgICB9XG4gIH1cbn07XG5cbmxpc3RDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBib3gsIGNvbW1hbmRzLCBjb250ZXh0LCBuYW1lLCBuYW1lc3BhY2VzLCB0ZXh0LCB1c2VDb250ZXh0O1xuICBib3ggPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydib3gnXSwgdHJ1ZSk7XG4gIHVzZUNvbnRleHQgPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydjb250ZXh0J10sIHRydWUpO1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pO1xuICBuYW1lc3BhY2VzID0gbmFtZSA/IFtuYW1lXSA6IGluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLmZpbHRlcihuc3BjID0+IHtcbiAgICByZXR1cm4gbnNwYyAhPT0gaW5zdGFuY2UuY21kLmZ1bGxOYW1lO1xuICB9KS5jb25jYXQoXCJfcm9vdFwiKTtcbiAgY29udGV4dCA9IHVzZUNvbnRleHQgPyBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpIDogaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQ7XG4gIGNvbW1hbmRzID0gbmFtZXNwYWNlcy5yZWR1Y2UoKGNvbW1hbmRzLCBuc3BjKSA9PiB7XG4gICAgdmFyIGNtZDtcbiAgICBjbWQgPSBuc3BjID09PSBcIl9yb290XCIgPyBDb21tYW5kLkNvbW1hbmQuY21kcyA6IGNvbnRleHQuZ2V0Q21kKG5zcGMsIHtcbiAgICAgIG11c3RFeGVjdXRlOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQuaW5pdCgpO1xuXG4gICAgICBpZiAoY21kLmNtZHMpIHtcbiAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5jb25jYXQoY21kLmNtZHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb21tYW5kcztcbiAgfSwgW10pO1xuICB0ZXh0ID0gY29tbWFuZHMubGVuZ3RoID8gY29tbWFuZHMubWFwKGNtZCA9PiB7XG4gICAgY21kLmluaXQoKTtcbiAgICByZXR1cm4gKGNtZC5pc0V4ZWN1dGFibGUoKSA/ICd+fiEnIDogJ35+IWxzICcpICsgY21kLmZ1bGxOYW1lICsgJ35+JztcbiAgfSkuam9pbihcIlxcblwiKSA6IFwiVGhpcyBjb250YWlucyBubyBzdWItY29tbWFuZHNcIjtcblxuICBpZiAoYm94KSB7XG4gICAgcmV0dXJuIGB+fmJveH5+XFxuJHt0ZXh0fVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0ZXh0O1xuICB9XG59O1xuXG5nZXRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCByZXM7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIHJlcyA9IFBhdGhIZWxwZXIuZ2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lKTtcblxuICBpZiAodHlwZW9mIHJlcyA9PT0gXCJvYmplY3RcIikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsICcgICcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByZXM7XG4gIH1cbn07XG5cbnNldENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHAsIHZhbDtcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ3ZhbHVlJywgJ3ZhbCddKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IHZvaWQgMDtcblxuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSwgdmFsKTtcblxuICByZXR1cm4gJyc7XG59O1xuXG5zdG9yZUpzb25Db21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWw7XG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSk7XG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdqc29uJ10pKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwO1xuXG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lLCBKU09OLnBhcnNlKHZhbCkpO1xuXG4gIHJldHVybiAnJztcbn07XG5cbmdldFBhcmFtID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIGlmIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5nZXRQYXJhbShpbnN0YW5jZS5wYXJhbXMsIGluc3RhbmNlLmdldFBhcmFtKFsnZGVmJywgJ2RlZmF1bHQnXSkpO1xuICB9XG59O1xuXG5Cb3hDbWQgPSBjbGFzcyBCb3hDbWQgZXh0ZW5kcyBDb21tYW5kLkJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KTtcbiAgICB0aGlzLmNtZCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydjbWQnXSk7XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5oZWxwZXIub3BlblRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZCArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cztcbiAgICAgIHRoaXMuaGVscGVyLmNsb3NlVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWQuc3BsaXQoXCIgXCIpWzBdICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzO1xuICAgIH1cblxuICAgIHRoaXMuaGVscGVyLmRlY28gPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmRlY287XG4gICAgdGhpcy5oZWxwZXIucGFkID0gMjtcbiAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuc3VmZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJyk7XG4gIH1cblxuICBoZWlnaHQoKSB7XG4gICAgdmFyIGhlaWdodCwgcGFyYW1zO1xuXG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5ib3VuZHMoKS5oZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IDM7XG4gICAgfVxuXG4gICAgcGFyYW1zID0gWydoZWlnaHQnXTtcblxuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgxKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmdldFBhcmFtKHBhcmFtcywgaGVpZ2h0KTtcbiAgfVxuXG4gIHdpZHRoKCkge1xuICAgIHZhciBwYXJhbXMsIHdpZHRoO1xuXG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgd2lkdGggPSB0aGlzLmJvdW5kcygpLndpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aWR0aCA9IDM7XG4gICAgfVxuXG4gICAgcGFyYW1zID0gWyd3aWR0aCddO1xuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLm1heCh0aGlzLm1pbldpZHRoKCksIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCB3aWR0aCkpO1xuICB9XG5cbiAgYm91bmRzKCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIGlmICh0aGlzLl9ib3VuZHMgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9ib3VuZHMgPSB0aGlzLmhlbHBlci50ZXh0Qm91bmRzKHRoaXMuaW5zdGFuY2UuY29udGVudCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9ib3VuZHM7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHRoaXMuaGVscGVyLmhlaWdodCA9IHRoaXMuaGVpZ2h0KCk7XG4gICAgdGhpcy5oZWxwZXIud2lkdGggPSB0aGlzLndpZHRoKCk7XG4gICAgcmV0dXJuIHRoaXMuaGVscGVyLmRyYXcodGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgfVxuXG4gIG1pbldpZHRoKCkge1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbWQubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxufTtcbkNsb3NlQ21kID0gY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBDb21tYW5kLkJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuaW5zdGFuY2UuY29udGV4dCk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHZhciBib3gsIGJveDIsIGRlcHRoLCBwcmVmaXgsIHJlcXVpcmVkX2FmZml4ZXMsIHN1ZmZpeDtcbiAgICBwcmVmaXggPSB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKTtcbiAgICBzdWZmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKTtcbiAgICBib3ggPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSk7XG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydyZXF1aXJlZF9hZmZpeGVzJ10sIHRydWUpO1xuXG4gICAgaWYgKCFyZXF1aXJlZF9hZmZpeGVzKSB7XG4gICAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSAnJztcbiAgICAgIGJveDIgPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSk7XG5cbiAgICAgIGlmIChib3gyICE9IG51bGwgJiYgKGJveCA9PSBudWxsIHx8IGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIHx8IGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpKSB7XG4gICAgICAgIGJveCA9IGJveDI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJveCAhPSBudWxsKSB7XG4gICAgICBkZXB0aCA9IHRoaXMuaGVscGVyLmdldE5lc3RlZEx2bCh0aGlzLmluc3RhbmNlLmdldFBvcygpLnN0YXJ0KTtcblxuICAgICAgaWYgKGRlcHRoIDwgMikge1xuICAgICAgICB0aGlzLmluc3RhbmNlLmluQm94ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LCBib3guZW5kLCAnJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5yZXBsYWNlV2l0aCgnJyk7XG4gICAgfVxuICB9XG5cbn07XG5FZGl0Q21kID0gY2xhc3MgRWRpdENtZCBleHRlbmRzIENvbW1hbmQuQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHZhciByZWY7XG4gICAgdGhpcy5jbWROYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKTtcbiAgICB0aGlzLnZlcmJhbGl6ZSA9IChyZWYgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxXSkpID09PSAndicgfHwgcmVmID09PSAndmVyYmFsaXplJztcblxuICAgIGlmICh0aGlzLmNtZE5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSk7XG4gICAgICB0aGlzLmZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZTtcbiAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmVkaXRhYmxlID0gdGhpcy5jbWQgIT0gbnVsbCA/IHRoaXMuY21kLmlzRWRpdGFibGUoKSA6IHRydWU7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0V2l0aENvbnRlbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0V2l0aG91dENvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICByZXN1bHRXaXRoQ29udGVudCgpIHtcbiAgICB2YXIgZGF0YSwgaSwgbGVuLCBwLCBwYXJzZXIsIHJlZjtcbiAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodGhpcy5pbnN0YW5jZS5jb250ZW50KTtcbiAgICBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICBkYXRhID0ge307XG4gICAgcmVmID0gRWRpdENtZC5wcm9wcztcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgcCA9IHJlZltpXTtcbiAgICAgIHAud3JpdGVGb3IocGFyc2VyLCBkYXRhKTtcbiAgICB9XG5cbiAgICBDb21tYW5kLkNvbW1hbmQuc2F2ZUNtZCh0aGlzLmNtZE5hbWUsIGRhdGEpO1xuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcHJvcHNEaXNwbGF5KCkge1xuICAgIHZhciBjbWQ7XG4gICAgY21kID0gdGhpcy5jbWQ7XG4gICAgcmV0dXJuIEVkaXRDbWQucHJvcHMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gcC5kaXNwbGF5KGNtZCk7XG4gICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gcCAhPSBudWxsO1xuICAgIH0pLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICByZXN1bHRXaXRob3V0Q29udGVudCgpIHtcbiAgICB2YXIgbmFtZSwgcGFyc2VyO1xuXG4gICAgaWYgKCF0aGlzLmNtZCB8fCB0aGlzLmVkaXRhYmxlKSB7XG4gICAgICBuYW1lID0gdGhpcy5jbWQgPyB0aGlzLmNtZC5mdWxsTmFtZSA6IHRoaXMuY21kTmFtZTtcbiAgICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChgfn5ib3ggY21kOlwiJHt0aGlzLmluc3RhbmNlLmNtZC5mdWxsTmFtZX0gJHtuYW1lfVwifn5cXG4ke3RoaXMucHJvcHNEaXNwbGF5KCl9XFxufn4hc2F2ZX5+IH5+IWNsb3Nlfn5cXG5+fi9ib3h+fmApO1xuICAgICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2U7XG5cbiAgICAgIGlmICh0aGlzLnZlcmJhbGl6ZSkge1xuICAgICAgICByZXR1cm4gcGFyc2VyLmdldFRleHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcblxuRWRpdENtZC5zZXRDbWRzID0gZnVuY3Rpb24gKGJhc2UpIHtcbiAgdmFyIGksIGluSW5zdGFuY2UsIGxlbiwgcCwgcmVmO1xuICBpbkluc3RhbmNlID0gYmFzZS5pbl9pbnN0YW5jZSA9IHtcbiAgICBjbWRzOiB7fVxuICB9O1xuICByZWYgPSBFZGl0Q21kLnByb3BzO1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHAgPSByZWZbaV07XG4gICAgcC5zZXRDbWQoaW5JbnN0YW5jZS5jbWRzKTtcbiAgfSAvLyBwLnNldENtZChiYXNlKVxuXG5cbiAgcmV0dXJuIGJhc2U7XG59O1xuXG5FZGl0Q21kLnByb3BzID0gW25ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19jYXJyZXQnLCB7XG4gIG9wdDogJ2NoZWNrQ2FycmV0J1xufSksIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19wYXJzZScsIHtcbiAgb3B0OiAncGFyc2UnXG59KSwgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3ByZXZlbnRfcGFyc2VfYWxsJywge1xuICBvcHQ6ICdwcmV2ZW50UGFyc2VBbGwnXG59KSwgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3JlcGxhY2VfYm94Jywge1xuICBvcHQ6ICdyZXBsYWNlQm94J1xufSksIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoJ25hbWVfdG9fcGFyYW0nLCB7XG4gIG9wdDogJ25hbWVUb1BhcmFtJ1xufSksIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoJ2FsaWFzX29mJywge1xuICB2YXI6ICdhbGlhc09mJyxcbiAgY2FycmV0OiB0cnVlXG59KSwgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnaGVscCcsIHtcbiAgZnVuY3Q6ICdoZWxwJyxcbiAgc2hvd0VtcHR5OiB0cnVlXG59KSwgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnc291cmNlJywge1xuICB2YXI6ICdyZXN1bHRTdHInLFxuICBkYXRhTmFtZTogJ3Jlc3VsdCcsXG4gIHNob3dFbXB0eTogdHJ1ZSxcbiAgY2FycmV0OiB0cnVlXG59KV07XG5OYW1lU3BhY2VDbWQgPSBjbGFzcyBOYW1lU3BhY2VDbWQgZXh0ZW5kcyBDb21tYW5kLkJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMF0pO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBpLCBsZW4sIG5hbWVzcGFjZXMsIG5zcGMsIHBhcnNlciwgdHh0O1xuXG4gICAgaWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0LmFkZE5hbWVTcGFjZSh0aGlzLm5hbWUpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VzID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKTtcbiAgICAgIHR4dCA9ICd+fmJveH5+XFxuJztcblxuICAgICAgZm9yIChpID0gMCwgbGVuID0gbmFtZXNwYWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBuc3BjID0gbmFtZXNwYWNlc1tpXTtcblxuICAgICAgICBpZiAobnNwYyAhPT0gdGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWUpIHtcbiAgICAgICAgICB0eHQgKz0gbnNwYyArICdcXG4nO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHR4dCArPSAnfn4hY2xvc2V8fn5cXG5+fi9ib3h+fic7XG4gICAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodHh0KTtcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgICB9XG4gIH1cblxufTtcblRlbXBsYXRlQ21kID0gY2xhc3MgVGVtcGxhdGVDbWQgZXh0ZW5kcyBDb21tYW5kLkJhc2VDb21tYW5kIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKTtcbiAgICByZXR1cm4gdGhpcy5zZXAgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc2VwJ10sIFwiXFxuXCIpO1xuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHZhciBkYXRhO1xuICAgIGRhdGEgPSB0aGlzLm5hbWUgPyBQYXRoSGVscGVyLmdldFBhdGgodGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCB0aGlzLm5hbWUpIDogdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzO1xuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCAmJiBkYXRhICE9IG51bGwgJiYgZGF0YSAhPT0gZmFsc2UpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBkYXRhLm1hcChpdGVtID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZShpdGVtKTtcbiAgICAgICAgfSkuam9pbih0aGlzLnNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZShkYXRhKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRlbXBsYXRlKGRhdGEpIHtcbiAgICB2YXIgcGFyc2VyO1xuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpO1xuICAgIHBhcnNlci52YXJzID0gdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgPyBkYXRhIDoge1xuICAgICAgdmFsdWU6IGRhdGFcbiAgICB9O1xuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlO1xuICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKTtcbiAgfVxuXG59O1xuRW1tZXRDbWQgPSBjbGFzcyBFbW1ldENtZCBleHRlbmRzIENvbW1hbmQuQmFzZUNvbW1hbmQge1xuICBpbml0KCkge1xuICAgIHRoaXMuYWJiciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdhYmJyJywgJ2FiYnJldmlhdGlvbiddKTtcbiAgICByZXR1cm4gdGhpcy5sYW5nID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2xhbmcnLCAnbGFuZ3VhZ2UnXSk7XG4gIH1cblxuICByZXN1bHQoKSB7XG4gICAgdmFyIGVtbWV0LCBleCwgcmVzO1xuXG4gICAgZW1tZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuXG4gICAgICBpZiAoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsID8gd2luZG93LmVtbWV0IDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuZW1tZXQ7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IChyZWYgPSB3aW5kb3cuc2VsZikgIT0gbnVsbCA/IHJlZi5lbW1ldCA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnNlbGYuZW1tZXQ7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdyAhPT0gbnVsbCA/IChyZWYxID0gd2luZG93Lmdsb2JhbCkgIT0gbnVsbCA/IHJlZjEuZW1tZXQgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nbG9iYWwuZW1tZXQ7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXF1aXJlICE9PSBcInVuZGVmaW5lZFwiICYmIHJlcXVpcmUgIT09IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnZW1tZXQnKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICAgIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUubG9nZ2VyLmxvZygnRW1tZXQgaXMgbm90IGF2YWlsYWJsZSwgaXQgbWF5IG5lZWQgdG8gYmUgaW5zdGFsbGVkIG1hbnVhbGx5Jyk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LmNhbGwodGhpcyk7XG5cbiAgICBpZiAoZW1tZXQgIT0gbnVsbCkge1xuICAgICAgLy8gZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKHRoaXMuYWJiciwgdGhpcy5sYW5nKTtcbiAgICAgIHJldHVybiByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpO1xuICAgIH1cbiAgfVxuXG59O1xuXG4iLCJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuLi9Db21tYW5kXCIpO1xuXG5jb25zdCBCb3hIZWxwZXIgPSByZXF1aXJlKFwiLi4vQm94SGVscGVyXCIpLkJveEhlbHBlcjtcblxuY29uc3QgRWRpdENtZFByb3AgPSByZXF1aXJlKFwiLi4vRWRpdENtZFByb3BcIikuRWRpdENtZFByb3A7XG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL1N0cmluZ0hlbHBlclwiKS5TdHJpbmdIZWxwZXI7XG5cbmNvbnN0IFBhdGhIZWxwZXIgPSByZXF1aXJlKFwiLi4vaGVscGVycy9QYXRoSGVscGVyXCIpLlBhdGhIZWxwZXI7XG5cbmNvbnN0IFJlcGxhY2VtZW50ID0gcmVxdWlyZShcIi4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50XCIpLlJlcGxhY2VtZW50O1xuXG52YXIgZGVsZXRlQ29tbWFuZCwgcmVhZENvbW1hbmQsIHdyaXRlQ29tbWFuZDtcbnZhciBGaWxlQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgRmlsZUNvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgY29yZTtcbiAgICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQuQ29tbWFuZCgnZmlsZScpKTtcbiAgICByZXR1cm4gY29yZS5hZGRDbWRzKHtcbiAgICAgIFwicmVhZFwiOiB7XG4gICAgICAgICdyZXN1bHQnOiByZWFkQ29tbWFuZCxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnZmlsZSddLFxuICAgICAgICAnaGVscCc6IFwicmVhZCB0aGUgY29udGVudCBvZiBhIGZpbGVcIlxuICAgICAgfSxcbiAgICAgIFwid3JpdGVcIjoge1xuICAgICAgICAncmVzdWx0Jzogd3JpdGVDb21tYW5kLFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydmaWxlJywgJ2NvbnRlbnQnXSxcbiAgICAgICAgJ2hlbHAnOiBcInNhdmUgaW50byBhIGZpbGVcIlxuICAgICAgfSxcbiAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGRlbGV0ZUNvbW1hbmQsXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ2ZpbGUnXSxcbiAgICAgICAgJ2hlbHAnOiBcImRlbGV0ZSBhIGZpbGVcIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn07XG5leHBvcnRzLkZpbGVDb21tYW5kUHJvdmlkZXIgPSBGaWxlQ29tbWFuZFByb3ZpZGVyO1xuXG5yZWFkQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgZmlsZSwgZmlsZVN5c3RlbTtcbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKTtcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKTtcblxuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLnJlYWRGaWxlKGZpbGUpO1xuICB9XG59O1xuXG53cml0ZUNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGNvbnRlbnQsIGZpbGUsIGZpbGVTeXN0ZW07XG4gIGZpbGVTeXN0ZW0gPSBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRGaWxlU3lzdGVtKCk7XG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2ZpbGUnXSk7XG4gIGNvbnRlbnQgPSBpbnN0YW5jZS5jb250ZW50IHx8IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnY29udGVudCddKTtcblxuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLndyaXRlRmlsZShmaWxlLCBjb250ZW50KTtcbiAgfVxufTtcblxuZGVsZXRlQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgZmlsZSwgZmlsZVN5c3RlbTtcbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKTtcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKTtcblxuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLmRlbGV0ZUZpbGUoZmlsZSk7XG4gIH1cbn07XG5cbiIsIlxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZShcIi4uL0NvbW1hbmRcIik7XG5cbnZhciBIdG1sQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSHRtbENvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyKGNtZHMpIHtcbiAgICB2YXIgY3NzLCBodG1sO1xuICAgIGh0bWwgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZC5Db21tYW5kKCdodG1sJykpO1xuICAgIGh0bWwuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICAnZGVmYXVsdHMnOiB7XG4gICAgICAgICAgJ2xhbmcnOiAnaHRtbCdcbiAgICAgICAgfSxcbiAgICAgICAgJ25hbWVUb1BhcmFtJzogJ2FiYnInXG4gICAgICB9XG4gICAgfSk7XG4gICAgY3NzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQuQ29tbWFuZCgnY3NzJykpO1xuICAgIHJldHVybiBjc3MuYWRkQ21kcyh7XG4gICAgICAnZmFsbGJhY2snOiB7XG4gICAgICAgICdhbGlhc09mJzogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICAnZGVmYXVsdHMnOiB7XG4gICAgICAgICAgJ2xhbmcnOiAnY3NzJ1xuICAgICAgICB9LFxuICAgICAgICAnbmFtZVRvUGFyYW0nOiAnYWJicidcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuZXhwb3J0cy5IdG1sQ29tbWFuZFByb3ZpZGVyID0gSHRtbENvbW1hbmRQcm92aWRlcjtcblxuIiwiXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKFwiLi4vQ29tbWFuZFwiKTtcblxudmFyIEpzQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSnNDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIGpzO1xuICAgIGpzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQuQ29tbWFuZCgnanMnKSk7XG4gICAgY21kcy5hZGRDbWQobmV3IENvbW1hbmQuQ29tbWFuZCgnamF2YXNjcmlwdCcsIHtcbiAgICAgIGFsaWFzT2Y6ICdqcydcbiAgICB9KSk7XG4gICAgcmV0dXJuIGpzLmFkZENtZHMoe1xuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgJ2lmJzogJ2lmKHwpe1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnbG9nJzogJ2lmKHdpbmRvdy5jb25zb2xlKXtcXG5cXHRjb25zb2xlLmxvZyh+fmNvbnRlbnR+fnwpXFxufScsXG4gICAgICAnZnVuY3Rpb24nOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ2Z1bmN0Jzoge1xuICAgICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2YnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICAnZm9yJzogJ2ZvciAodmFyIGkgPSAwOyBpIDwgfDsgaSsrKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICdmb3Jpbic6ICdmb3IgKHZhciB2YWwgaW4gfCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAnZWFjaCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgICdmb3JlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgJ3doaWxlJzogJ3doaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgJ3doaWxlaSc6ICd2YXIgaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxuXFx0aSsrO1xcbn0nLFxuICAgICAgJ2lmZWxzZSc6ICdpZiggfCApIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgICAnaWZlJzoge1xuICAgICAgICBhbGlhc09mOiAnanM6aWZlbHNlJ1xuICAgICAgfSxcbiAgICAgICdzd2l0Y2gnOiBcInN3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5jb250ZW50fn5cXG5cXHRcXHRicmVhaztcXG5cXHRkZWZhdWx0IDpcXG5cXHRcXHRcXG5cXHRcXHRicmVhaztcXG59XCJcbiAgICB9KTtcbiAgfVxuXG59O1xuZXhwb3J0cy5Kc0NvbW1hbmRQcm92aWRlciA9IEpzQ29tbWFuZFByb3ZpZGVyO1xuXG4iLCJcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvU3RyaW5nSGVscGVyXCIpLlN0cmluZ0hlbHBlcjtcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoXCIuLi9Db21tYW5kXCIpO1xuXG5jb25zdCBQYWlyRGV0ZWN0b3IgPSByZXF1aXJlKFwiLi4vZGV0ZWN0b3JzL1BhaXJEZXRlY3RvclwiKS5QYWlyRGV0ZWN0b3I7XG5cbnZhciB3cmFwV2l0aFBocDtcbnZhciBQaHBDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBQaHBDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlcihjbWRzKSB7XG4gICAgdmFyIHBocCwgcGhwSW5uZXIsIHBocE91dGVyO1xuICAgIHBocCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kLkNvbW1hbmQoJ3BocCcpKTtcbiAgICBwaHAuYWRkRGV0ZWN0b3IobmV3IFBhaXJEZXRlY3Rvcih7XG4gICAgICByZXN1bHQ6ICdwaHA6aW5uZXInLFxuICAgICAgb3BlbmVyOiAnPD9waHAnLFxuICAgICAgY2xvc2VyOiAnPz4nLFxuICAgICAgb3B0aW9ubmFsX2VuZDogdHJ1ZSxcbiAgICAgICdlbHNlJzogJ3BocDpvdXRlcidcbiAgICB9KSk7XG4gICAgcGhwT3V0ZXIgPSBwaHAuYWRkQ21kKG5ldyBDb21tYW5kLkNvbW1hbmQoJ291dGVyJykpO1xuICAgIHBocE91dGVyLmFkZENtZHMoe1xuICAgICAgJ2ZhbGxiYWNrJzoge1xuICAgICAgICAnY21kcyc6IHtcbiAgICAgICAgICAnYW55X2NvbnRlbnQnOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50JyxcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbicsXG4gICAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICcsXG4gICAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6JW5hbWUlJyxcbiAgICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgICB9LFxuICAgICAgJ2JveCc6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnY29tbWVudCc6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+J1xuICAgIH0pO1xuICAgIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZC5Db21tYW5kKCdpbm5lcicpKTtcbiAgICByZXR1cm4gcGhwSW5uZXIuYWRkQ21kcyh7XG4gICAgICAnYW55X2NvbnRlbnQnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnXG4gICAgICB9LFxuICAgICAgJ2NvbW1lbnQnOiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgJ2lmJzogJ2lmKHwpe1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgJ2luZm8nOiAncGhwaW5mbygpOycsXG4gICAgICAnZWNobyc6ICdlY2hvIHwnLFxuICAgICAgJ2UnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZWNobydcbiAgICAgIH0sXG4gICAgICAnY2xhc3MnOiB7XG4gICAgICAgIHJlc3VsdDogXCJjbGFzcyB+fnBhcmFtIDAgY2xhc3MgZGVmOnx+fiB7XFxuXFx0ZnVuY3Rpb24gX19jb25zdHJ1Y3QoKSB7XFxuXFx0XFx0fn5jb250ZW50fn58XFxuXFx0fVxcbn1cIixcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnYyc6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpjbGFzcydcbiAgICAgIH0sXG4gICAgICAnZnVuY3Rpb24nOiB7XG4gICAgICAgIHJlc3VsdDogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnZnVuY3QnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2YnOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgJ2FycmF5JzogJyR8ID0gYXJyYXkoKTsnLFxuICAgICAgJ2EnOiAnYXJyYXkoKScsXG4gICAgICAnZm9yJzogJ2ZvciAoJGkgPSAwOyAkaSA8ICR8OyAkaSsrKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICAnZm9yZWFjaCc6ICdmb3JlYWNoICgkfCBhcyAka2V5ID0+ICR2YWwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICdlYWNoJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZvcmVhY2gnXG4gICAgICB9LFxuICAgICAgJ3doaWxlJzogJ3doaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgICd3aGlsZWknOiB7XG4gICAgICAgIHJlc3VsdDogJyRpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxuXFx0JGkrKztcXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnaWZlbHNlJzogJ2lmKCB8ICkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgICAnaWZlJzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmlmZWxzZSdcbiAgICAgIH0sXG4gICAgICAnc3dpdGNoJzoge1xuICAgICAgICByZXN1bHQ6IFwic3dpdGNoKCB8ICkgeyBcXG5cXHRjYXNlIDpcXG5cXHRcXHR+fmFueV9jb250ZW50fn5cXG5cXHRcXHRicmVhaztcXG5cXHRkZWZhdWx0IDpcXG5cXHRcXHRcXG5cXHRcXHRicmVhaztcXG59XCIsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2Nsb3NlJzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjbG9zZScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nLFxuICAgICAgICAgIHN1ZmZpeDogJ1xcbj8+JyxcbiAgICAgICAgICByZXF1aXJlZF9hZmZpeGVzOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcbmV4cG9ydHMuUGhwQ29tbWFuZFByb3ZpZGVyID0gUGhwQ29tbWFuZFByb3ZpZGVyO1xuXG53cmFwV2l0aFBocCA9IGZ1bmN0aW9uIChyZXN1bHQsIGluc3RhbmNlKSB7XG4gIHZhciBpbmxpbmUsIHJlZ0Nsb3NlLCByZWdPcGVuO1xuICBpbmxpbmUgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3BocF9pbmxpbmUnLCAnaW5saW5lJ10sIHRydWUpO1xuXG4gIGlmIChpbmxpbmUpIHtcbiAgICByZWdPcGVuID0gLzxcXD9waHBcXHMoW1xcXFxuXFxcXHJcXHNdKykvZztcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZztcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnPD9waHBcXG4nICsgU3RyaW5nSGVscGVyLmluZGVudChyZXN1bHQpICsgJ1xcbj8+JztcbiAgfVxufTsgLy8gY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuLy8gICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnXG5cbiIsIlxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZShcIi4uL0NvbW1hbmRcIik7XG5cbmNvbnN0IEFsd2F5c0VuYWJsZWQgPSByZXF1aXJlKFwiLi4vZGV0ZWN0b3JzL0Fsd2F5c0VuYWJsZWRcIikuQWx3YXlzRW5hYmxlZDtcblxudmFyIGluZmxlY3Rpb24gPSBpbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJpbmZsZWN0aW9uXCIpKTtcblxuZnVuY3Rpb24gaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbnZhciBTdHJpbmdDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBTdHJpbmdDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3Rlcihyb290KSB7XG4gICAgdmFyIGNtZHM7XG4gICAgY21kcyA9IHJvb3QuYWRkQ21kKG5ldyBDb21tYW5kLkNvbW1hbmQoJ3N0cmluZycpKTtcbiAgICByb290LmFkZENtZChuZXcgQ29tbWFuZC5Db21tYW5kKCdzdHInLCB7XG4gICAgICBhbGlhc09mOiAnc3RyaW5nJ1xuICAgIH0pKTtcbiAgICByb290LmFkZERldGVjdG9yKG5ldyBBbHdheXNFbmFibGVkKCdzdHJpbmcnKSk7XG4gICAgcmV0dXJuIGNtZHMuYWRkQ21kcyh7XG4gICAgICAncGx1cmFsaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24ucGx1cmFsaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnc3RyJ10sXG4gICAgICAgICdoZWxwJzogXCJQbHVyYWxpemUgYSBzdHJpbmdcIlxuICAgICAgfSxcbiAgICAgICdzaW5ndWxhcml6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnc3RyJ10sXG4gICAgICAgICdoZWxwJzogXCJTaW5ndWxhcml6ZSBhIHN0cmluZ1wiXG4gICAgICB9LFxuICAgICAgJ2NhbWVsaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2FtZWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSksICFpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsICdmaXJzdCddLCB0cnVlKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0cicsICdmaXJzdCddLFxuICAgICAgICAnaGVscCc6IFwiVHJhbnNmb3JtcyBhIFN0cmluZyBmcm9tIHVuZGVyc2NvcmUgdG8gY2FtZWxjYXNlXCJcbiAgICAgIH0sXG4gICAgICAndW5kZXJzY29yZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSksIGluc3RhbmNlLmdldEJvb2xQYXJhbShbMSwgJ3VwcGVyJ10pKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnc3RyJywgJ3VwcGVyJ10sXG4gICAgICAgICdoZWxwJzogXCJUcmFuc2Zvcm1zIGEgU3RyaW5nIGZyb20gY2FtZWxjYXNlIHRvIHVuZGVyc2NvcmUuXCJcbiAgICAgIH0sXG4gICAgICAnaHVtYW5pemUnOiB7XG4gICAgICAgICdyZXN1bHQnOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5odW1hbml6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSwgaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsxLCAnZmlyc3QnXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInLCAnZmlyc3QnXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSBodW1hbiByZWFkYWJsZSBmb3JtYXRcIlxuICAgICAgfSxcbiAgICAgICdjYXBpdGFsaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2FwaXRhbGl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSk7XG4gICAgICAgIH0sXG4gICAgICAgICdhbGxvd2VkTmFtZWQnOiBbJ3N0ciddLFxuICAgICAgICAnaGVscCc6IFwiTWFrZSB0aGUgZmlyc3QgbGV0dGVyIG9mIGEgc3RyaW5nIHVwcGVyXCJcbiAgICAgIH0sXG4gICAgICAnZGFzaGVyaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uZGFzaGVyaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnc3RyJ10sXG4gICAgICAgICdoZWxwJzogXCJSZXBsYWNlcyB1bmRlcnNjb3JlcyB3aXRoIGRhc2hlcyBpbiBhIHN0cmluZy5cIlxuICAgICAgfSxcbiAgICAgICd0aXRsZWl6ZSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnRpdGxlaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnc3RyJ10sXG4gICAgICAgICdoZWxwJzogXCJUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgaHVtYW4gcmVhZGFibGUgZm9ybWF0IHdpdGggbW9zdCB3b3JkcyBjYXBpdGFsaXplZFwiXG4gICAgICB9LFxuICAgICAgJ3RhYmxlaXplJzoge1xuICAgICAgICAncmVzdWx0JzogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24udGFibGVpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpO1xuICAgICAgICB9LFxuICAgICAgICAnYWxsb3dlZE5hbWVkJzogWydzdHInXSxcbiAgICAgICAgJ2hlbHAnOiBcIlRyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSB0YWJsZSBmb3JtYXRcIlxuICAgICAgfSxcbiAgICAgICdjbGFzc2lmeSc6IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmNsYXNzaWZ5KGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ2FsbG93ZWROYW1lZCc6IFsnc3RyJ10sXG4gICAgICAgICdoZWxwJzogXCJUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgY2xhc3MgZm9ybWF0XCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59O1xuZXhwb3J0cy5TdHJpbmdDb21tYW5kUHJvdmlkZXIgPSBTdHJpbmdDb21tYW5kUHJvdmlkZXI7XG5cbiIsIlxuXG5jb25zdCBEZXRlY3RvciA9IHJlcXVpcmUoXCIuL0RldGVjdG9yXCIpLkRldGVjdG9yO1xuXG52YXIgQWx3YXlzRW5hYmxlZCA9IGNsYXNzIEFsd2F5c0VuYWJsZWQgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKG5hbWVzcGFjZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4gIH1cblxuICBkZXRlY3QoZmluZGVyKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlO1xuICB9XG5cbn07XG5leHBvcnRzLkFsd2F5c0VuYWJsZWQgPSBBbHdheXNFbmFibGVkO1xuXG4iLCJcbnZhciBEZXRlY3RvciA9IGNsYXNzIERldGVjdG9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSA9IHt9KSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGRldGVjdChmaW5kZXIpIHtcbiAgICBpZiAodGhpcy5kZXRlY3RlZChmaW5kZXIpKSB7XG4gICAgICBpZiAodGhpcy5kYXRhLnJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucmVzdWx0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5kYXRhLmVsc2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmVsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGV0ZWN0ZWQoZmluZGVyKSB7fVxuXG59O1xuZXhwb3J0cy5EZXRlY3RvciA9IERldGVjdG9yO1xuXG4iLCJcblxuY29uc3QgRGV0ZWN0b3IgPSByZXF1aXJlKFwiLi9EZXRlY3RvclwiKS5EZXRlY3RvcjtcblxudmFyIExhbmdEZXRlY3RvciA9IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0KGZpbmRlcikge1xuICAgIHZhciBsYW5nO1xuXG4gICAgaWYgKGZpbmRlci5jb2Rld2F2ZSAhPSBudWxsKSB7XG4gICAgICBsYW5nID0gZmluZGVyLmNvZGV3YXZlLmVkaXRvci5nZXRMYW5nKCk7XG5cbiAgICAgIGlmIChsYW5nICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcbmV4cG9ydHMuTGFuZ0RldGVjdG9yID0gTGFuZ0RldGVjdG9yO1xuXG4iLCJcblxuY29uc3QgUGFpciA9IHJlcXVpcmUoXCIuLi9wb3NpdGlvbmluZy9QYWlyXCIpLlBhaXI7XG5cbmNvbnN0IERldGVjdG9yID0gcmVxdWlyZShcIi4vRGV0ZWN0b3JcIikuRGV0ZWN0b3I7XG5cbnZhciBQYWlyRGV0ZWN0b3IgPSBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdGVkKGZpbmRlcikge1xuICAgIHZhciBwYWlyO1xuXG4gICAgaWYgKHRoaXMuZGF0YS5vcGVuZXIgIT0gbnVsbCAmJiB0aGlzLmRhdGEuY2xvc2VyICE9IG51bGwgJiYgZmluZGVyLmluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcih0aGlzLmRhdGEub3BlbmVyLCB0aGlzLmRhdGEuY2xvc2VyLCB0aGlzLmRhdGEpO1xuXG4gICAgICBpZiAocGFpci5pc1dhcHBlck9mKGZpbmRlci5pbnN0YW5jZS5nZXRQb3MoKSwgZmluZGVyLmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG59O1xuZXhwb3J0cy5QYWlyRGV0ZWN0b3IgPSBQYWlyRGV0ZWN0b3I7XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBib290c3RyYXAgPSByZXF1aXJlKFwiLi9ib290c3RyYXBcIik7XG5cbmNvbnN0IFRleHRBcmVhRWRpdG9yID0gcmVxdWlyZShcIi4vVGV4dEFyZWFFZGl0b3JcIik7XG5cbmJvb3RzdHJhcC5Db2Rld2F2ZS5kZXRlY3QgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIHZhciBjdztcbiAgY3cgPSBuZXcgYm9vdHN0cmFwLkNvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvci5UZXh0QXJlYUVkaXRvcih0YXJnZXQpKTtcblxuICBib290c3RyYXAuQ29kZXdhdmUuaW5zdGFuY2VzLnB1c2goY3cpO1xuXG4gIHJldHVybiBjdztcbn07XG5cbmJvb3RzdHJhcC5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZTtcbndpbmRvdy5Db2Rld2F2ZSA9IGJvb3RzdHJhcC5Db2Rld2F2ZTtcblxuIiwiXG52YXIgQXJyYXlIZWxwZXIgPSBjbGFzcyBBcnJheUhlbHBlciB7XG4gIHN0YXRpYyBpc0FycmF5KGFycikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfVxuXG4gIHN0YXRpYyB1bmlvbihhMSwgYTIpIHtcbiAgICByZXR1cm4gdGhpcy51bmlxdWUoYTEuY29uY2F0KGEyKSk7XG4gIH1cblxuICBzdGF0aWMgdW5pcXVlKGFycmF5KSB7XG4gICAgdmFyIGEsIGksIGo7XG4gICAgYSA9IGFycmF5LmNvbmNhdCgpO1xuICAgIGkgPSAwO1xuXG4gICAgd2hpbGUgKGkgPCBhLmxlbmd0aCkge1xuICAgICAgaiA9IGkgKyAxO1xuXG4gICAgICB3aGlsZSAoaiA8IGEubGVuZ3RoKSB7XG4gICAgICAgIGlmIChhW2ldID09PSBhW2pdKSB7XG4gICAgICAgICAgYS5zcGxpY2Uoai0tLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgICsrajtcbiAgICAgIH1cblxuICAgICAgKytpO1xuICAgIH1cblxuICAgIHJldHVybiBhO1xuICB9XG5cbn07XG5leHBvcnRzLkFycmF5SGVscGVyID0gQXJyYXlIZWxwZXI7XG5cbiIsIlxudmFyIENvbW1vbkhlbHBlciA9IGNsYXNzIENvbW1vbkhlbHBlciB7XG4gIHN0YXRpYyBtZXJnZSguLi54cykge1xuICAgIGlmICgoeHMgIT0gbnVsbCA/IHhzLmxlbmd0aCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy50YXAoe30sIGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHZhciBpLCBrLCBsZW4sIHJlc3VsdHMsIHYsIHg7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB4cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHggPSB4c1tpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMxO1xuICAgICAgICAgICAgcmVzdWx0czEgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChrIGluIHgpIHtcbiAgICAgICAgICAgICAgdiA9IHhba107XG4gICAgICAgICAgICAgIHJlc3VsdHMxLnB1c2gobVtrXSA9IHYpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0czE7XG4gICAgICAgICAgfSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRhcChvLCBmbikge1xuICAgIGZuKG8pO1xuICAgIHJldHVybiBvO1xuICB9XG5cbiAgc3RhdGljIGFwcGx5TWl4aW5zKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIHtcbiAgICByZXR1cm4gYmFzZUN0b3JzLmZvckVhY2goYmFzZUN0b3IgPT4ge1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2VDdG9yLnByb3RvdHlwZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbn07XG5leHBvcnRzLkNvbW1vbkhlbHBlciA9IENvbW1vbkhlbHBlcjtcblxuIiwiXG52YXIgTmFtZXNwYWNlSGVscGVyID0gY2xhc3MgTmFtZXNwYWNlSGVscGVyIHtcbiAgc3RhdGljIHNwbGl0Rmlyc3QoZnVsbG5hbWUsIGlzU3BhY2UgPSBmYWxzZSkge1xuICAgIHZhciBwYXJ0cztcblxuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PT0gLTEgJiYgIWlzU3BhY2UpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdO1xuICAgIH1cblxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKTtcbiAgICByZXR1cm4gW3BhcnRzLnNoaWZ0KCksIHBhcnRzLmpvaW4oJzonKSB8fCBudWxsXTtcbiAgfVxuXG4gIHN0YXRpYyBzcGxpdChmdWxsbmFtZSkge1xuICAgIHZhciBuYW1lLCBwYXJ0cztcblxuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdO1xuICAgIH1cblxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKTtcbiAgICBuYW1lID0gcGFydHMucG9wKCk7XG4gICAgcmV0dXJuIFtwYXJ0cy5qb2luKCc6JyksIG5hbWVdO1xuICB9XG5cbn07XG5leHBvcnRzLk5hbWVzcGFjZUhlbHBlciA9IE5hbWVzcGFjZUhlbHBlcjtcblxuIiwiXG52YXIgT3B0aW9uYWxQcm9taXNlID0gY2xhc3MgT3B0aW9uYWxQcm9taXNlIHtcbiAgY29uc3RydWN0b3IodmFsMSkge1xuICAgIHRoaXMudmFsID0gdmFsMTtcblxuICAgIGlmICh0aGlzLnZhbCAhPSBudWxsICYmIHRoaXMudmFsLnRoZW4gIT0gbnVsbCAmJiB0aGlzLnZhbC5yZXN1bHQgIT0gbnVsbCkge1xuICAgICAgdGhpcy52YWwgPSB0aGlzLnZhbC5yZXN1bHQoKTtcbiAgICB9XG4gIH1cblxuICB0aGVuKGNiKSB7XG4gICAgaWYgKHRoaXMudmFsICE9IG51bGwgJiYgdGhpcy52YWwudGhlbiAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh0aGlzLnZhbC50aGVuKGNiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKGNiKHRoaXMudmFsKSk7XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0KCkge1xuICAgIHJldHVybiB0aGlzLnZhbDtcbiAgfVxuXG59O1xuZXhwb3J0cy5PcHRpb25hbFByb21pc2UgPSBPcHRpb25hbFByb21pc2U7XG5cbnZhciBvcHRpb25hbFByb21pc2UgPSBmdW5jdGlvbiAodmFsKSB7XG4gIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKHZhbCk7XG59O1xuXG5leHBvcnRzLm9wdGlvbmFsUHJvbWlzZSA9IG9wdGlvbmFsUHJvbWlzZTtcblxuIiwiXG52YXIgUGF0aEhlbHBlciA9IGNsYXNzIFBhdGhIZWxwZXIge1xuICBzdGF0aWMgZ2V0UGF0aChvYmosIHBhdGgsIHNlcCA9ICcuJykge1xuICAgIHZhciBjdXIsIHBhcnRzO1xuICAgIHBhcnRzID0gcGF0aC5zcGxpdChzZXApO1xuICAgIGN1ciA9IG9iajtcbiAgICBwYXJ0cy5maW5kKHBhcnQgPT4ge1xuICAgICAgY3VyID0gY3VyW3BhcnRdO1xuICAgICAgcmV0dXJuIHR5cGVvZiBjdXIgPT09IFwidW5kZWZpbmVkXCI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGN1cjtcbiAgfVxuXG4gIHN0YXRpYyBzZXRQYXRoKG9iaiwgcGF0aCwgdmFsLCBzZXAgPSAnLicpIHtcbiAgICB2YXIgbGFzdCwgcGFydHM7XG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcCk7XG4gICAgbGFzdCA9IHBhcnRzLnBvcCgpO1xuICAgIHJldHVybiBwYXJ0cy5yZWR1Y2UoKGN1ciwgcGFydCkgPT4ge1xuICAgICAgaWYgKGN1cltwYXJ0XSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjdXJbcGFydF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY3VyW3BhcnRdID0ge307XG4gICAgICB9XG4gICAgfSwgb2JqKVtsYXN0XSA9IHZhbDtcbiAgfVxuXG59O1xuZXhwb3J0cy5QYXRoSGVscGVyID0gUGF0aEhlbHBlcjtcblxuIiwiXG5cbmNvbnN0IFNpemUgPSByZXF1aXJlKFwiLi4vcG9zaXRpb25pbmcvU2l6ZVwiKS5TaXplO1xuXG52YXIgU3RyaW5nSGVscGVyID0gY2xhc3MgU3RyaW5nSGVscGVyIHtcbiAgc3RhdGljIHRyaW1FbXB0eUxpbmUodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKC9eXFxzKlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyP1xcblxccyokLywgJycpO1xuICB9XG5cbiAgc3RhdGljIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXRUb0xlbmd0aCh0eHQsIGxlbmd0aCkge1xuICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gdHh0Lmxlbmd0aCkgKyAxKS5qb2luKHR4dCkuc3Vic3RyaW5nKDAsIGxlbmd0aCk7XG4gIH1cblxuICBzdGF0aWMgcmVwZWF0KHR4dCwgbmIpIHtcbiAgICByZXR1cm4gQXJyYXkobmIgKyAxKS5qb2luKHR4dCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0VHh0U2l6ZSh0eHQpIHtcbiAgICB2YXIgaiwgbCwgbGVuLCBsaW5lcywgdztcbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpO1xuICAgIHcgPSAwO1xuXG4gICAgZm9yIChqID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIGwgPSBsaW5lc1tqXTtcbiAgICAgIHcgPSBNYXRoLm1heCh3LCBsLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTaXplKHcsIGxpbmVzLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgc3RhdGljIGluZGVudE5vdEZpcnN0KHRleHQsIG5iID0gMSwgc3BhY2VzID0gJyAgJykge1xuICAgIHZhciByZWc7XG5cbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZWcgPSAvXFxuL2c7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgXCJcXG5cIiArIHRoaXMucmVwZWF0KHNwYWNlcywgbmIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGluZGVudCh0ZXh0LCBuYiA9IDEsIHNwYWNlcyA9ICcgICcpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gc3BhY2VzICsgdGhpcy5pbmRlbnROb3RGaXJzdCh0ZXh0LCBuYiwgc3BhY2VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHJldmVyc2VTdHIodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5zcGxpdChcIlwiKS5yZXZlcnNlKCkuam9pbihcIlwiKTtcbiAgfVxuXG4gIHN0YXRpYyByZW1vdmVDYXJyZXQodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIHJlQ2FycmV0LCByZVF1b3RlZCwgcmVUbXAsIHRtcDtcbiAgICB0bXAgPSAnW1tbW3F1b3RlZF9jYXJyZXRdXV1dJztcbiAgICByZUNhcnJldCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciksIFwiZ1wiKTtcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciArIGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgcmVUbXAgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKHRtcCksIFwiZ1wiKTtcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UocmVRdW90ZWQsIHRtcCkucmVwbGFjZShyZUNhcnJldCwgJycpLnJlcGxhY2UocmVUbXAsIGNhcnJldENoYXIpO1xuICB9XG5cbiAgc3RhdGljIGdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciBwb3M7XG4gICAgcG9zID0gdGhpcy5nZXRDYXJyZXRQb3ModHh0LCBjYXJyZXRDaGFyKTtcblxuICAgIGlmIChwb3MgIT0gbnVsbCkge1xuICAgICAgdHh0ID0gdHh0LnN1YnN0cigwLCBwb3MpICsgdHh0LnN1YnN0cihwb3MgKyBjYXJyZXRDaGFyLmxlbmd0aCk7XG4gICAgICByZXR1cm4gW3BvcywgdHh0XTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0Q2FycmV0UG9zKHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciBpLCByZVF1b3RlZDtcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciArIGNhcnJldENoYXIpLCBcImdcIik7XG4gICAgdHh0ID0gdHh0LnJlcGxhY2UocmVRdW90ZWQsICcgJyk7XG5cbiAgICBpZiAoKGkgPSB0eHQuaW5kZXhPZihjYXJyZXRDaGFyKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG5cbn07XG5leHBvcnRzLlN0cmluZ0hlbHBlciA9IFN0cmluZ0hlbHBlcjtcblxuIiwiXG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoXCIuL1Bvc1wiKS5Qb3M7XG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL1N0cmluZ0hlbHBlclwiKS5TdHJpbmdIZWxwZXI7XG5cbmNvbnN0IFBhaXJNYXRjaCA9IHJlcXVpcmUoXCIuL1BhaXJNYXRjaFwiKS5QYWlyTWF0Y2g7XG5cbnZhciBQYWlyID0gY2xhc3MgUGFpciB7XG4gIGNvbnN0cnVjdG9yKG9wZW5lciwgY2xvc2VyLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsO1xuICAgIHRoaXMub3BlbmVyID0gb3BlbmVyO1xuICAgIHRoaXMuY2xvc2VyID0gY2xvc2VyO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBvcHRpb25uYWxfZW5kOiBmYWxzZSxcbiAgICAgIHZhbGlkTWF0Y2g6IG51bGxcbiAgICB9O1xuXG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV07XG5cbiAgICAgIGlmIChrZXkgaW4gdGhpcy5vcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMub3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5lclJlZygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub3BlbmVyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm9wZW5lcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuZXI7XG4gICAgfVxuICB9XG5cbiAgY2xvc2VyUmVnKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jbG9zZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY2xvc2VyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NlcjtcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueVBhcnRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvcGVuZXI6IHRoaXMub3BlbmVyUmVnKCksXG4gICAgICBjbG9zZXI6IHRoaXMuY2xvc2VyUmVnKClcbiAgICB9O1xuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0S2V5cygpIHtcbiAgICB2YXIga2V5LCBrZXlzLCByZWYsIHJlZztcbiAgICBrZXlzID0gW107XG4gICAgcmVmID0gdGhpcy5tYXRjaEFueVBhcnRzKCk7XG5cbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHJlZyA9IHJlZltrZXldO1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGtleXM7XG4gIH1cblxuICBtYXRjaEFueVJlZygpIHtcbiAgICB2YXIgZ3JvdXBzLCBrZXksIHJlZiwgcmVnO1xuICAgIGdyb3VwcyA9IFtdO1xuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpO1xuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XTtcbiAgICAgIGdyb3Vwcy5wdXNoKCcoJyArIHJlZy5zb3VyY2UgKyAnKScpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVnRXhwKGdyb3Vwcy5qb2luKCd8JykpO1xuICB9XG5cbiAgbWF0Y2hBbnkodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaDtcblxuICAgIHdoaWxlICgobWF0Y2ggPSB0aGlzLl9tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSAhPSBudWxsICYmICFtYXRjaC52YWxpZCgpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKTtcbiAgICB9XG5cbiAgICBpZiAobWF0Y2ggIT0gbnVsbCAmJiBtYXRjaC52YWxpZCgpKSB7XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfVxuICB9XG5cbiAgX21hdGNoQW55KHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2g7XG5cbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KTtcbiAgICB9XG5cbiAgICBtYXRjaCA9IHRoaXMubWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpO1xuXG4gICAgaWYgKG1hdGNoICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgUGFpck1hdGNoKHRoaXMsIG1hdGNoLCBvZmZzZXQpO1xuICAgIH1cbiAgfVxuXG4gIG1hdGNoQW55TmFtZWQodGV4dCkge1xuICAgIHJldHVybiB0aGlzLl9tYXRjaEFueUdldE5hbWUodGhpcy5tYXRjaEFueSh0ZXh0KSk7XG4gIH1cblxuICBtYXRjaEFueUxhc3QodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaCwgcmVzO1xuXG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKTtcblxuICAgICAgaWYgKCFyZXMgfHwgcmVzLmVuZCgpICE9PSBtYXRjaC5lbmQoKSkge1xuICAgICAgICByZXMgPSBtYXRjaDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgaWRlbnRpY2FsKCkge1xuICAgIHJldHVybiB0aGlzLm9wZW5lciA9PT0gdGhpcy5jbG9zZXIgfHwgdGhpcy5vcGVuZXIuc291cmNlICE9IG51bGwgJiYgdGhpcy5jbG9zZXIuc291cmNlICE9IG51bGwgJiYgdGhpcy5vcGVuZXIuc291cmNlID09PSB0aGlzLmNsb3Nlci5zb3VyY2U7XG4gIH1cblxuICB3cmFwcGVyUG9zKHBvcywgdGV4dCkge1xuICAgIHZhciBlbmQsIHN0YXJ0O1xuICAgIHN0YXJ0ID0gdGhpcy5tYXRjaEFueUxhc3QodGV4dC5zdWJzdHIoMCwgcG9zLnN0YXJ0KSk7XG5cbiAgICBpZiAoc3RhcnQgIT0gbnVsbCAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBzdGFydC5uYW1lKCkgPT09ICdvcGVuZXInKSkge1xuICAgICAgZW5kID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBwb3MuZW5kKTtcblxuICAgICAgaWYgKGVuZCAhPSBudWxsICYmICh0aGlzLmlkZW50aWNhbCgpIHx8IGVuZC5uYW1lKCkgPT09ICdjbG9zZXInKSkge1xuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLCBlbmQuZW5kKCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbm5hbF9lbmQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgdGV4dC5sZW5ndGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzV2FwcGVyT2YocG9zLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlclBvcyhwb3MsIHRleHQpICE9IG51bGw7XG4gIH1cblxufTtcbmV4cG9ydHMuUGFpciA9IFBhaXI7XG5cbiIsIlxudmFyIFBhaXJNYXRjaCA9IGNsYXNzIFBhaXJNYXRjaCB7XG4gIGNvbnN0cnVjdG9yKHBhaXIsIG1hdGNoLCBvZmZzZXQgPSAwKSB7XG4gICAgdGhpcy5wYWlyID0gcGFpcjtcbiAgICB0aGlzLm1hdGNoID0gbWF0Y2g7XG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gIH1cblxuICBuYW1lKCkge1xuICAgIHZhciBfbmFtZSwgZ3JvdXAsIGksIGosIGxlbiwgcmVmO1xuXG4gICAgaWYgKHRoaXMubWF0Y2gpIHtcbiAgICAgIGlmICh0eXBlb2YgX25hbWUgPT09IFwidW5kZWZpbmVkXCIgfHwgX25hbWUgPT09IG51bGwpIHtcbiAgICAgICAgcmVmID0gdGhpcy5tYXRjaDtcblxuICAgICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICAgIGdyb3VwID0gcmVmW2ldO1xuXG4gICAgICAgICAgaWYgKGkgPiAwICYmIGdyb3VwICE9IG51bGwpIHtcbiAgICAgICAgICAgIF9uYW1lID0gdGhpcy5wYWlyLm1hdGNoQW55UGFydEtleXMoKVtpIC0gMV07XG4gICAgICAgICAgICByZXR1cm4gX25hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX25hbWUgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9uYW1lIHx8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm9mZnNldDtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMubWF0Y2hbMF0ubGVuZ3RoICsgdGhpcy5vZmZzZXQ7XG4gIH1cblxuICB2YWxpZCgpIHtcbiAgICByZXR1cm4gIXRoaXMucGFpci52YWxpZE1hdGNoIHx8IHRoaXMucGFpci52YWxpZE1hdGNoKHRoaXMpO1xuICB9XG5cbiAgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoWzBdLmxlbmd0aDtcbiAgfVxuXG59O1xuZXhwb3J0cy5QYWlyTWF0Y2ggPSBQYWlyTWF0Y2g7XG5cbiIsIlxudmFyIFBvcyA9IGNsYXNzIFBvcyB7XG4gIGNvbnN0cnVjdG9yKHN0YXJ0LCBlbmQpIHtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG5cbiAgICBpZiAodGhpcy5lbmQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5lbmQgPSB0aGlzLnN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIGNvbnRhaW5zUHQocHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmVuZDtcbiAgfVxuXG4gIGNvbnRhaW5zUG9zKHBvcykge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuZW5kO1xuICB9XG5cbiAgd3JhcHBlZEJ5KHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3Mud3JhcENsYXNzKHRoaXMuc3RhcnQgLSBwcmVmaXgubGVuZ3RoLCB0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5lbmQgKyBzdWZmaXgubGVuZ3RoKTtcbiAgfVxuXG4gIHdpdGhFZGl0b3IodmFsKSB7XG4gICAgdGhpcy5fZWRpdG9yID0gdmFsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZWRpdG9yKCkge1xuICAgIGlmICh0aGlzLl9lZGl0b3IgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvcjtcbiAgfVxuXG4gIGhhc0VkaXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yICE9IG51bGw7XG4gIH1cblxuICB0ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5zdGFydCwgdGhpcy5lbmQpO1xuICB9XG5cbiAgYXBwbHlPZmZzZXQob2Zmc2V0KSB7XG4gICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgdGhpcy5zdGFydCArPSBvZmZzZXQ7XG4gICAgICB0aGlzLmVuZCArPSBvZmZzZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcmV2RU9MKCkge1xuICAgIGlmICh0aGlzLl9wcmV2RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3ByZXZFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lU3RhcnQodGhpcy5zdGFydCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3ByZXZFT0w7XG4gIH1cblxuICBuZXh0RU9MKCkge1xuICAgIGlmICh0aGlzLl9uZXh0RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX25leHRFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lRW5kKHRoaXMuZW5kKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbmV4dEVPTDtcbiAgfVxuXG4gIHRleHRXaXRoRnVsbExpbmVzKCkge1xuICAgIGlmICh0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcyA9PSBudWxsKSB7XG4gICAgICB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcyA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5uZXh0RU9MKCkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcztcbiAgfVxuXG4gIHNhbWVMaW5lc1ByZWZpeCgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzUHJlZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5zdGFydCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NhbWVMaW5lc1ByZWZpeDtcbiAgfVxuXG4gIHNhbWVMaW5lc1N1ZmZpeCgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzU3VmZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLmVuZCwgdGhpcy5uZXh0RU9MKCkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNTdWZmaXg7XG4gIH1cblxuICBjb3B5KCkge1xuICAgIHZhciByZXM7XG4gICAgcmVzID0gbmV3IFBvcyh0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG5cbiAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHJhdygpIHtcbiAgICByZXR1cm4gW3RoaXMuc3RhcnQsIHRoaXMuZW5kXTtcbiAgfVxuXG59O1xuZXhwb3J0cy5Qb3MgPSBQb3M7XG5cbiIsIlxuXG5jb25zdCBXcmFwcGluZyA9IHJlcXVpcmUoXCIuL1dyYXBwaW5nXCIpLldyYXBwaW5nO1xuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoXCIuL1JlcGxhY2VtZW50XCIpLlJlcGxhY2VtZW50O1xuXG5jb25zdCBDb21tb25IZWxwZXIgPSByZXF1aXJlKFwiLi4vaGVscGVycy9Db21tb25IZWxwZXJcIikuQ29tbW9uSGVscGVyO1xuXG52YXIgUG9zQ29sbGVjdGlvbiA9IGNsYXNzIFBvc0NvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihhcnIpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgYXJyID0gW2Fycl07XG4gICAgfVxuXG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFyciwgW1Bvc0NvbGxlY3Rpb25dKTtcblxuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICB3cmFwKHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeCk7XG4gICAgfSk7XG4gIH1cblxuICByZXBsYWNlKHR4dCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIG5ldyBSZXBsYWNlbWVudChwLnN0YXJ0LCBwLmVuZCwgdHh0KTtcbiAgICB9KTtcbiAgfVxuXG59O1xuZXhwb3J0cy5Qb3NDb2xsZWN0aW9uID0gUG9zQ29sbGVjdGlvbjtcblxuIiwiXG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoXCIuL1Bvc1wiKS5Qb3M7XG5cbmNvbnN0IENvbW1vbkhlbHBlciA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL0NvbW1vbkhlbHBlclwiKS5Db21tb25IZWxwZXI7XG5cbmNvbnN0IE9wdGlvbk9iamVjdCA9IHJlcXVpcmUoXCIuLi9PcHRpb25PYmplY3RcIikuT3B0aW9uT2JqZWN0O1xuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKFwiLi4vaGVscGVycy9TdHJpbmdIZWxwZXJcIikuU3RyaW5nSGVscGVyO1xuXG52YXIgUmVwbGFjZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gIGNsYXNzIFJlcGxhY2VtZW50IGV4dGVuZHMgUG9zIHtcbiAgICBjb25zdHJ1Y3RvcihzdGFydDEsIGVuZCwgdGV4dDEsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDE7XG4gICAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICAgIHRoaXMudGV4dCA9IHRleHQxO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgcHJlZml4OiAnJyxcbiAgICAgICAgc3VmZml4OiAnJyxcbiAgICAgICAgc2VsZWN0aW9uczogW11cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc1Bvc0JlZm9yZVByZWZpeCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy50ZXh0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXNFbmQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoO1xuICAgIH1cblxuICAgIGFwcGx5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkuc3BsaWNlVGV4dCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5maW5hbFRleHQoKSk7XG4gICAgfVxuXG4gICAgbmVjZXNzYXJ5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkgIT09IHRoaXMub3JpZ2luYWxUZXh0KCk7XG4gICAgfVxuXG4gICAgb3JpZ2luYWxUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZCk7XG4gICAgfVxuXG4gICAgZmluYWxUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy50ZXh0ICsgdGhpcy5zdWZmaXg7XG4gICAgfVxuXG4gICAgb2Zmc2V0QWZ0ZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKS5sZW5ndGggLSAodGhpcy5lbmQgLSB0aGlzLnN0YXJ0KTtcbiAgICB9XG5cbiAgICBhcHBseU9mZnNldChvZmZzZXQpIHtcbiAgICAgIHZhciBpLCBsZW4sIHJlZiwgc2VsO1xuXG4gICAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0O1xuICAgICAgICB0aGlzLmVuZCArPSBvZmZzZXQ7XG4gICAgICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9ucztcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBzZWwgPSByZWZbaV07XG4gICAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgICAgICBzZWwuZW5kICs9IG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZWxlY3RDb250ZW50KCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW25ldyBQb3ModGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCwgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCArIHRoaXMudGV4dC5sZW5ndGgpXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNhcnJldFRvU2VsKCkge1xuICAgICAgdmFyIHBvcywgcmVzLCBzdGFydCwgdGV4dDtcbiAgICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtdO1xuICAgICAgdGV4dCA9IHRoaXMuZmluYWxUZXh0KCk7XG4gICAgICB0aGlzLnByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5wcmVmaXgpO1xuICAgICAgdGhpcy50ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnRleHQpO1xuICAgICAgdGhpcy5zdWZmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMuc3VmZml4KTtcbiAgICAgIHN0YXJ0ID0gdGhpcy5zdGFydDtcblxuICAgICAgd2hpbGUgKChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgW3BvcywgdGV4dF0gPSByZXM7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3Moc3RhcnQgKyBwb3MsIHN0YXJ0ICsgcG9zKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvcHkoKSB7XG4gICAgICB2YXIgcmVzO1xuICAgICAgcmVzID0gbmV3IFJlcGxhY2VtZW50KHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnRleHQsIHRoaXMuZ2V0T3B0cygpKTtcblxuICAgICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSk7XG4gICAgICB9XG5cbiAgICAgIHJlcy5zZWxlY3Rpb25zID0gdGhpcy5zZWxlY3Rpb25zLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gcy5jb3B5KCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gIH1cblxuICA7XG5cbiAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKFJlcGxhY2VtZW50LnByb3RvdHlwZSwgW09wdGlvbk9iamVjdF0pO1xuXG4gIHJldHVybiBSZXBsYWNlbWVudDtcbn0uY2FsbCh2b2lkIDApO1xuXG5leHBvcnRzLlJlcGxhY2VtZW50ID0gUmVwbGFjZW1lbnQ7XG5cbiIsIlxudmFyIFNpemUgPSBjbGFzcyBTaXplIHtcbiAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgfVxuXG59O1xuZXhwb3J0cy5TaXplID0gU2l6ZTtcblxuIiwiXG52YXIgU3RyUG9zID0gY2xhc3MgU3RyUG9zIHtcbiAgY29uc3RydWN0b3IocG9zLCBzdHIpIHtcbiAgICB0aGlzLnBvcyA9IHBvcztcbiAgICB0aGlzLnN0ciA9IHN0cjtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGg7XG4gIH1cblxufTtcbmV4cG9ydHMuU3RyUG9zID0gU3RyUG9zO1xuXG4iLCJcblxuY29uc3QgUG9zID0gcmVxdWlyZShcIi4vUG9zXCIpLlBvcztcblxudmFyIFdyYXBwZWRQb3MgPSBjbGFzcyBXcmFwcGVkUG9zIGV4dGVuZHMgUG9zIHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGlubmVyU3RhcnQsIGlubmVyRW5kLCBlbmQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmlubmVyU3RhcnQgPSBpbm5lclN0YXJ0O1xuICAgIHRoaXMuaW5uZXJFbmQgPSBpbm5lckVuZDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQdChwdCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5pbm5lckVuZDtcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQb3MocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmlubmVyRW5kO1xuICB9XG5cbiAgaW5uZXJUZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kKTtcbiAgfVxuXG4gIHNldElubmVyTGVuKGxlbikge1xuICAgIHJldHVybiB0aGlzLm1vdmVTdWZpeCh0aGlzLmlubmVyU3RhcnQgKyBsZW4pO1xuICB9XG5cbiAgbW92ZVN1ZmZpeChwdCkge1xuICAgIHZhciBzdWZmaXhMZW47XG4gICAgc3VmZml4TGVuID0gdGhpcy5lbmQgLSB0aGlzLmlubmVyRW5kO1xuICAgIHRoaXMuaW5uZXJFbmQgPSBwdDtcbiAgICByZXR1cm4gdGhpcy5lbmQgPSB0aGlzLmlubmVyRW5kICsgc3VmZml4TGVuO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICByZXR1cm4gbmV3IFdyYXBwZWRQb3ModGhpcy5zdGFydCwgdGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kLCB0aGlzLmVuZCk7XG4gIH1cblxufTtcbmV4cG9ydHMuV3JhcHBlZFBvcyA9IFdyYXBwZWRQb3M7XG5cbiIsIlxuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoXCIuL1JlcGxhY2VtZW50XCIpLlJlcGxhY2VtZW50O1xuXG52YXIgV3JhcHBpbmcgPSBjbGFzcyBXcmFwcGluZyBleHRlbmRzIFJlcGxhY2VtZW50IHtcbiAgY29uc3RydWN0b3Ioc3RhcnQsIGVuZCwgcHJlZml4ID0gJycsIHN1ZmZpeCA9ICcnLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMudGV4dCA9ICcnO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4O1xuICAgIHRoaXMuc3VmZml4ID0gc3VmZml4O1xuICB9XG5cbiAgYXBwbHkoKSB7XG4gICAgdGhpcy5hZGp1c3RTZWwoKTtcbiAgICByZXR1cm4gc3VwZXIuYXBwbHkoKTtcbiAgfVxuXG4gIGFkanVzdFNlbCgpIHtcbiAgICB2YXIgaSwgbGVuLCBvZmZzZXQsIHJlZiwgcmVzdWx0cywgc2VsO1xuICAgIG9mZnNldCA9IHRoaXMub3JpZ2luYWxUZXh0KCkubGVuZ3RoO1xuICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9ucztcbiAgICByZXN1bHRzID0gW107XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNlbCA9IHJlZltpXTtcblxuICAgICAgaWYgKHNlbC5zdGFydCA+IHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGgpIHtcbiAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldDtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbC5lbmQgPj0gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHRzLnB1c2goc2VsLmVuZCArPSBvZmZzZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBmaW5hbFRleHQoKSB7XG4gICAgdmFyIHRleHQ7XG5cbiAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgdGV4dCA9IHRoaXMub3JpZ2luYWxUZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0ZXh0ICsgdGhpcy5zdWZmaXg7XG4gIH1cblxuICBvZmZzZXRBZnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdWZmaXgubGVuZ3RoO1xuICB9XG5cbiAgY29weSgpIHtcbiAgICB2YXIgcmVzO1xuICAgIHJlcyA9IG5ldyBXcmFwcGluZyh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5wcmVmaXgsIHRoaXMuc3VmZml4KTtcbiAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLmNvcHkoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbn07XG5leHBvcnRzLldyYXBwaW5nID0gV3JhcHBpbmc7XG5cbiIsIlxudmFyIExvY2FsU3RvcmFnZUVuZ2luZSA9IGNsYXNzIExvY2FsU3RvcmFnZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBzYXZlKGtleSwgdmFsKSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIgJiYgbG9jYWxTdG9yYWdlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5mdWxsS2V5KGtleSksIEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBkYXRhID0gdGhpcy5sb2FkKHBhdGgpO1xuXG4gICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgZGF0YSA9IHt9O1xuICAgIH1cblxuICAgIGRhdGFba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gdGhpcy5zYXZlKHBhdGgsIGRhdGEpO1xuICB9XG5cbiAgbG9hZChrZXkpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpKSk7XG4gICAgfVxuICB9XG5cbiAgZnVsbEtleShrZXkpIHtcbiAgICByZXR1cm4gJ0NvZGVXYXZlXycgKyBrZXk7XG4gIH1cblxufTtcbmV4cG9ydHMuTG9jYWxTdG9yYWdlRW5naW5lID0gTG9jYWxTdG9yYWdlRW5naW5lO1xuXG4iLCJcbnZhciBDb250ZXh0ID0gY2xhc3MgQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBhcnNlciwgcGFyZW50KSB7XG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZXI7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5jb250ZW50ID0gXCJcIjtcbiAgfVxuXG4gIG9uU3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRBdCA9IHRoaXMucGFyc2VyLnBvcztcbiAgfVxuXG4gIG9uQ2hhcihjaGFyKSB7fVxuXG4gIGVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2V0Q29udGV4dCh0aGlzLnBhcmVudCk7XG4gIH1cblxuICBvbkVuZCgpIHt9XG5cbiAgdGVzdENvbnRleHQoY29udGV4dFR5cGUpIHtcbiAgICBpZiAoY29udGV4dFR5cGUudGVzdCh0aGlzLnBhcnNlci5jaGFyLCB0aGlzKSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLnNldENvbnRleHQobmV3IGNvbnRleHRUeXBlKHRoaXMucGFyc2VyLCB0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRlc3QoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn07XG5leHBvcnRzLkNvbnRleHQgPSBDb250ZXh0O1xuXG4iLCJcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIik7XG5cbnZhciBFc2NhcGVDb250ZXh0ID0gY2xhc3MgRXNjYXBlQ29udGV4dCBleHRlbmRzIENvbnRleHQuQ29udGV4dCB7XG4gIG9uQ2hhcihjaGFyKSB7XG4gICAgdGhpcy5wYXJlbnQuY29udGVudCArPSBjaGFyO1xuICAgIHJldHVybiB0aGlzLmVuZCgpO1xuICB9XG5cbiAgc3RhdGljIHRlc3QoY2hhcikge1xuICAgIHJldHVybiBjaGFyID09PSAnXFxcXCc7XG4gIH1cblxufTtcbmV4cG9ydHMuRXNjYXBlQ29udGV4dCA9IEVzY2FwZUNvbnRleHQ7XG5cbiIsIlxuXG5jb25zdCBQYXJhbUNvbnRleHQgPSByZXF1aXJlKFwiLi9QYXJhbUNvbnRleHRcIikuUGFyYW1Db250ZXh0O1xuXG52YXIgaW5kZXhPZiA9IFtdLmluZGV4T2Y7XG52YXIgTmFtZWRDb250ZXh0ID0gY2xhc3MgTmFtZWRDb250ZXh0IGV4dGVuZHMgUGFyYW1Db250ZXh0IHtcbiAgb25TdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5wYXJlbnQuY29udGVudDtcbiAgfVxuXG4gIG9uRW5kKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5uYW1lZFt0aGlzLm5hbWVdID0gdGhpcy5jb250ZW50O1xuICB9XG5cbiAgc3RhdGljIHRlc3QoY2hhciwgcGFyZW50KSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gY2hhciA9PT0gJzonICYmIChwYXJlbnQucGFyc2VyLm9wdGlvbnMuYWxsb3dlZE5hbWVkID09IG51bGwgfHwgKHJlZiA9IHBhcmVudC5jb250ZW50LCBpbmRleE9mLmNhbGwocGFyZW50LnBhcnNlci5vcHRpb25zLmFsbG93ZWROYW1lZCwgcmVmKSA+PSAwKSk7XG4gIH1cblxufTtcbmV4cG9ydHMuTmFtZWRDb250ZXh0ID0gTmFtZWRDb250ZXh0O1xuXG4iLCJcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoXCIuL0NvbnRleHRcIik7XG5cbmNvbnN0IFN0cmluZ0NvbnRleHQgPSByZXF1aXJlKFwiLi9TdHJpbmdDb250ZXh0XCIpLlN0cmluZ0NvbnRleHQ7XG5cbmNvbnN0IFZhcmlhYmxlQ29udGV4dCA9IHJlcXVpcmUoXCIuL1ZhcmlhYmxlQ29udGV4dFwiKS5WYXJpYWJsZUNvbnRleHQ7XG5cbnZhciBQYXJhbUNvbnRleHQgPSBjbGFzcyBQYXJhbUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0LkNvbnRleHQge1xuICBvbkNoYXIoY2hhcikge1xuICAgIGlmICh0aGlzLnRlc3RDb250ZXh0KFN0cmluZ0NvbnRleHQpKSB7fSBlbHNlIGlmICh0aGlzLnRlc3RDb250ZXh0KFBhcmFtQ29udGV4dC5uYW1lZCkpIHt9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoVmFyaWFibGVDb250ZXh0KSkge30gZWxzZSBpZiAoY2hhciA9PT0gJyAnKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2V0Q29udGV4dChuZXcgUGFyYW1Db250ZXh0KHRoaXMucGFyc2VyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgKz0gY2hhcjtcbiAgICB9XG4gIH1cblxuICBvbkVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZXIucGFyYW1zLnB1c2godGhpcy5jb250ZW50KTtcbiAgfVxuXG59O1xuZXhwb3J0cy5QYXJhbUNvbnRleHQgPSBQYXJhbUNvbnRleHQ7XG5cbiIsIlxuXG5jb25zdCBQYXJhbUNvbnRleHQgPSByZXF1aXJlKFwiLi9QYXJhbUNvbnRleHRcIikuUGFyYW1Db250ZXh0O1xuXG5jb25zdCBOYW1lZENvbnRleHQgPSByZXF1aXJlKFwiLi9OYW1lZENvbnRleHRcIikuTmFtZWRDb250ZXh0O1xuXG5QYXJhbUNvbnRleHQubmFtZWQgPSBOYW1lZENvbnRleHQ7XG52YXIgUGFyYW1QYXJzZXIgPSBjbGFzcyBQYXJhbVBhcnNlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtU3RyaW5nLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnBhcmFtU3RyaW5nID0gcGFyYW1TdHJpbmc7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnBhcnNlKCk7XG4gIH1cblxuICBzZXRDb250ZXh0KGNvbnRleHQpIHtcbiAgICB2YXIgb2xkQ29udGV4dDtcbiAgICBvbGRDb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICBpZiAob2xkQ29udGV4dCAhPSBudWxsICYmIG9sZENvbnRleHQgIT09IChjb250ZXh0ICE9IG51bGwgPyBjb250ZXh0LnBhcmVudCA6IHZvaWQgMCkpIHtcbiAgICAgIG9sZENvbnRleHQub25FbmQoKTtcbiAgICB9XG5cbiAgICBpZiAoY29udGV4dCAhPSBudWxsKSB7XG4gICAgICBjb250ZXh0Lm9uU3RhcnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb250ZXh0O1xuICB9XG5cbiAgcGFyc2UoKSB7XG4gICAgdGhpcy5wYXJhbXMgPSBbXTtcbiAgICB0aGlzLm5hbWVkID0ge307XG5cbiAgICBpZiAodGhpcy5wYXJhbVN0cmluZy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0Q29udGV4dChuZXcgUGFyYW1Db250ZXh0KHRoaXMpKTtcbiAgICAgIHRoaXMucG9zID0gMDtcblxuICAgICAgd2hpbGUgKHRoaXMucG9zIDwgdGhpcy5wYXJhbVN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jaGFyID0gdGhpcy5wYXJhbVN0cmluZ1t0aGlzLnBvc107XG4gICAgICAgIHRoaXMuY29udGV4dC5vbkNoYXIodGhpcy5jaGFyKTtcbiAgICAgICAgdGhpcy5wb3MrKztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2V0Q29udGV4dChudWxsKTtcbiAgICB9XG4gIH1cblxuICB0YWtlKG5iKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1TdHJpbmcuc3Vic3RyaW5nKHRoaXMucG9zLCB0aGlzLnBvcyArIG5iKTtcbiAgfVxuXG4gIHNraXAobmIgPSAxKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zICs9IG5iO1xuICB9XG5cbn07XG5leHBvcnRzLlBhcmFtUGFyc2VyID0gUGFyYW1QYXJzZXI7XG5cbiIsIlxuXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZShcIi4vQ29udGV4dFwiKTtcblxuY29uc3QgRXNjYXBlQ29udGV4dCA9IHJlcXVpcmUoXCIuL0VzY2FwZUNvbnRleHRcIikuRXNjYXBlQ29udGV4dDtcblxuY29uc3QgVmFyaWFibGVDb250ZXh0ID0gcmVxdWlyZShcIi4vVmFyaWFibGVDb250ZXh0XCIpLlZhcmlhYmxlQ29udGV4dDtcblxudmFyIFN0cmluZ0NvbnRleHQgPSBjbGFzcyBTdHJpbmdDb250ZXh0IGV4dGVuZHMgQ29udGV4dC5Db250ZXh0IHtcbiAgb25DaGFyKGNoYXIpIHtcbiAgICBpZiAodGhpcy50ZXN0Q29udGV4dChFc2NhcGVDb250ZXh0KSkge30gZWxzZSBpZiAodGhpcy50ZXN0Q29udGV4dChWYXJpYWJsZUNvbnRleHQpKSB7fSBlbHNlIGlmIChTdHJpbmdDb250ZXh0LmlzRGVsaW1pdGVyKGNoYXIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCArPSBjaGFyO1xuICAgIH1cbiAgfVxuXG4gIG9uRW5kKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5jb250ZW50ICs9IHRoaXMuY29udGVudDtcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0KGNoYXIpIHtcbiAgICByZXR1cm4gdGhpcy5pc0RlbGltaXRlcihjaGFyKTtcbiAgfVxuXG4gIHN0YXRpYyBpc0RlbGltaXRlcihjaGFyKSB7XG4gICAgcmV0dXJuIGNoYXIgPT09ICdcIicgfHwgY2hhciA9PT0gXCInXCI7XG4gIH1cblxufTtcbmV4cG9ydHMuU3RyaW5nQ29udGV4dCA9IFN0cmluZ0NvbnRleHQ7XG5cbiIsIlxuXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZShcIi4vQ29udGV4dFwiKTtcblxudmFyIFZhcmlhYmxlQ29udGV4dCA9IGNsYXNzIFZhcmlhYmxlQ29udGV4dCBleHRlbmRzIENvbnRleHQuQ29udGV4dCB7XG4gIG9uU3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VyLnNraXAoKTtcbiAgfVxuXG4gIG9uQ2hhcihjaGFyKSB7XG4gICAgaWYgKGNoYXIgPT09ICd9Jykge1xuICAgICAgcmV0dXJuIHRoaXMuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgKz0gY2hhcjtcbiAgICB9XG4gIH1cblxuICBvbkVuZCgpIHtcbiAgICB2YXIgcmVmO1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5jb250ZW50ICs9ICgocmVmID0gdGhpcy5wYXJzZXIub3B0aW9ucy52YXJzKSAhPSBudWxsID8gcmVmW3RoaXMuY29udGVudF0gOiB2b2lkIDApIHx8ICcnO1xuICB9XG5cbiAgc3RhdGljIHRlc3QoY2hhciwgcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5wYXJzZXIudGFrZSgyKSA9PT0gJyN7JztcbiAgfVxuXG59O1xuZXhwb3J0cy5WYXJpYWJsZUNvbnRleHQgPSBWYXJpYWJsZUNvbnRleHQ7XG5cbiIsIi8qIVxuICogaW5mbGVjdGlvblxuICogQ29weXJpZ2h0KGMpIDIwMTEgQmVuIExpbiA8YmVuQGRyZWFtZXJzbGFiLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICpcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEEgcG9ydCBvZiBpbmZsZWN0aW9uLWpzIHRvIG5vZGUuanMgbW9kdWxlLlxuICovXG5cbiggZnVuY3Rpb24gKCByb290LCBmYWN0b3J5ICl7XG4gIGlmKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKXtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkgKTtcbiAgfWVsc2UgaWYoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApe1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9ZWxzZXtcbiAgICByb290LmluZmxlY3Rpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0oIHRoaXMsIGZ1bmN0aW9uICgpe1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhpcyBpcyBhIGxpc3Qgb2Ygbm91bnMgdGhhdCB1c2UgdGhlIHNhbWUgZm9ybSBmb3IgYm90aCBzaW5ndWxhciBhbmQgcGx1cmFsLlxuICAgKiAgICAgICAgICAgICAgVGhpcyBsaXN0IHNob3VsZCByZW1haW4gZW50aXJlbHkgaW4gbG93ZXIgY2FzZSB0byBjb3JyZWN0bHkgbWF0Y2ggU3RyaW5ncy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciB1bmNvdW50YWJsZV93b3JkcyA9IFtcbiAgICAvLyAnYWNjZXNzJyxcbiAgICAnYWNjb21tb2RhdGlvbicsXG4gICAgJ2FkdWx0aG9vZCcsXG4gICAgJ2FkdmVydGlzaW5nJyxcbiAgICAnYWR2aWNlJyxcbiAgICAnYWdncmVzc2lvbicsXG4gICAgJ2FpZCcsXG4gICAgJ2FpcicsXG4gICAgJ2FpcmNyYWZ0JyxcbiAgICAnYWxjb2hvbCcsXG4gICAgJ2FuZ2VyJyxcbiAgICAnYXBwbGF1c2UnLFxuICAgICdhcml0aG1ldGljJyxcbiAgICAvLyAnYXJ0JyxcbiAgICAnYXNzaXN0YW5jZScsXG4gICAgJ2F0aGxldGljcycsXG4gICAgLy8gJ2F0dGVudGlvbicsXG5cbiAgICAnYmFjb24nLFxuICAgICdiYWdnYWdlJyxcbiAgICAvLyAnYmFsbGV0JyxcbiAgICAvLyAnYmVhdXR5JyxcbiAgICAnYmVlZicsXG4gICAgLy8gJ2JlZXInLFxuICAgIC8vICdiZWhhdmlvcicsXG4gICAgJ2Jpb2xvZ3knLFxuICAgIC8vICdiaWxsaWFyZHMnLFxuICAgICdibG9vZCcsXG4gICAgJ2JvdGFueScsXG4gICAgLy8gJ2Jvd2VscycsXG4gICAgJ2JyZWFkJyxcbiAgICAvLyAnYnVzaW5lc3MnLFxuICAgICdidXR0ZXInLFxuXG4gICAgJ2NhcmJvbicsXG4gICAgJ2NhcmRib2FyZCcsXG4gICAgJ2Nhc2gnLFxuICAgICdjaGFsaycsXG4gICAgJ2NoYW9zJyxcbiAgICAnY2hlc3MnLFxuICAgICdjcm9zc3JvYWRzJyxcbiAgICAnY291bnRyeXNpZGUnLFxuXG4gICAgLy8gJ2RhbWFnZScsXG4gICAgJ2RhbmNpbmcnLFxuICAgIC8vICdkYW5nZXInLFxuICAgICdkZWVyJyxcbiAgICAvLyAnZGVsaWdodCcsXG4gICAgLy8gJ2Rlc3NlcnQnLFxuICAgICdkaWduaXR5JyxcbiAgICAnZGlydCcsXG4gICAgLy8gJ2Rpc3RyaWJ1dGlvbicsXG4gICAgJ2R1c3QnLFxuXG4gICAgJ2Vjb25vbWljcycsXG4gICAgJ2VkdWNhdGlvbicsXG4gICAgJ2VsZWN0cmljaXR5JyxcbiAgICAvLyAnZW1wbG95bWVudCcsXG4gICAgLy8gJ2VuZXJneScsXG4gICAgJ2VuZ2luZWVyaW5nJyxcbiAgICAnZW5qb3ltZW50JyxcbiAgICAvLyAnZW50ZXJ0YWlubWVudCcsXG4gICAgJ2VudnknLFxuICAgICdlcXVpcG1lbnQnLFxuICAgICdldGhpY3MnLFxuICAgICdldmlkZW5jZScsXG4gICAgJ2V2b2x1dGlvbicsXG5cbiAgICAvLyAnZmFpbHVyZScsXG4gICAgLy8gJ2ZhaXRoJyxcbiAgICAnZmFtZScsXG4gICAgJ2ZpY3Rpb24nLFxuICAgIC8vICdmaXNoJyxcbiAgICAnZmxvdXInLFxuICAgICdmbHUnLFxuICAgICdmb29kJyxcbiAgICAvLyAnZnJlZWRvbScsXG4gICAgLy8gJ2ZydWl0JyxcbiAgICAnZnVlbCcsXG4gICAgJ2Z1bicsXG4gICAgLy8gJ2Z1bmVyYWwnLFxuICAgICdmdXJuaXR1cmUnLFxuXG4gICAgJ2dhbGxvd3MnLFxuICAgICdnYXJiYWdlJyxcbiAgICAnZ2FybGljJyxcbiAgICAvLyAnZ2FzJyxcbiAgICAnZ2VuZXRpY3MnLFxuICAgIC8vICdnbGFzcycsXG4gICAgJ2dvbGQnLFxuICAgICdnb2xmJyxcbiAgICAnZ29zc2lwJyxcbiAgICAnZ3JhbW1hcicsXG4gICAgLy8gJ2dyYXNzJyxcbiAgICAnZ3JhdGl0dWRlJyxcbiAgICAnZ3JpZWYnLFxuICAgIC8vICdncm91bmQnLFxuICAgICdndWlsdCcsXG4gICAgJ2d5bW5hc3RpY3MnLFxuXG4gICAgLy8gJ2hhaXInLFxuICAgICdoYXBwaW5lc3MnLFxuICAgICdoYXJkd2FyZScsXG4gICAgJ2hhcm0nLFxuICAgICdoYXRlJyxcbiAgICAnaGF0cmVkJyxcbiAgICAnaGVhbHRoJyxcbiAgICAnaGVhdCcsXG4gICAgLy8gJ2hlaWdodCcsXG4gICAgJ2hlbHAnLFxuICAgICdob21ld29yaycsXG4gICAgJ2hvbmVzdHknLFxuICAgICdob25leScsXG4gICAgJ2hvc3BpdGFsaXR5JyxcbiAgICAnaG91c2V3b3JrJyxcbiAgICAnaHVtb3VyJyxcbiAgICAnaHVuZ2VyJyxcbiAgICAnaHlkcm9nZW4nLFxuXG4gICAgJ2ljZScsXG4gICAgJ2ltcG9ydGFuY2UnLFxuICAgICdpbmZsYXRpb24nLFxuICAgICdpbmZvcm1hdGlvbicsXG4gICAgLy8gJ2luanVzdGljZScsXG4gICAgJ2lubm9jZW5jZScsXG4gICAgLy8gJ2ludGVsbGlnZW5jZScsXG4gICAgJ2lyb24nLFxuICAgICdpcm9ueScsXG5cbiAgICAnamFtJyxcbiAgICAvLyAnamVhbG91c3knLFxuICAgIC8vICdqZWxseScsXG4gICAgJ2pld2VscnknLFxuICAgIC8vICdqb3knLFxuICAgICdqdWRvJyxcbiAgICAvLyAnanVpY2UnLFxuICAgIC8vICdqdXN0aWNlJyxcblxuICAgICdrYXJhdGUnLFxuICAgIC8vICdraW5kbmVzcycsXG4gICAgJ2tub3dsZWRnZScsXG5cbiAgICAvLyAnbGFib3VyJyxcbiAgICAnbGFjaycsXG4gICAgLy8gJ2xhbmQnLFxuICAgICdsYXVnaHRlcicsXG4gICAgJ2xhdmEnLFxuICAgICdsZWF0aGVyJyxcbiAgICAnbGVpc3VyZScsXG4gICAgJ2xpZ2h0bmluZycsXG4gICAgJ2xpbmd1aW5lJyxcbiAgICAnbGluZ3VpbmknLFxuICAgICdsaW5ndWlzdGljcycsXG4gICAgJ2xpdGVyYXR1cmUnLFxuICAgICdsaXR0ZXInLFxuICAgICdsaXZlc3RvY2snLFxuICAgICdsb2dpYycsXG4gICAgJ2xvbmVsaW5lc3MnLFxuICAgIC8vICdsb3ZlJyxcbiAgICAnbHVjaycsXG4gICAgJ2x1Z2dhZ2UnLFxuXG4gICAgJ21hY2Fyb25pJyxcbiAgICAnbWFjaGluZXJ5JyxcbiAgICAnbWFnaWMnLFxuICAgIC8vICdtYWlsJyxcbiAgICAnbWFuYWdlbWVudCcsXG4gICAgJ21hbmtpbmQnLFxuICAgICdtYXJibGUnLFxuICAgICdtYXRoZW1hdGljcycsXG4gICAgJ21heW9ubmFpc2UnLFxuICAgICdtZWFzbGVzJyxcbiAgICAvLyAnbWVhdCcsXG4gICAgLy8gJ21ldGFsJyxcbiAgICAnbWV0aGFuZScsXG4gICAgJ21pbGsnLFxuICAgICdtaW51cycsXG4gICAgJ21vbmV5JyxcbiAgICAvLyAnbW9vc2UnLFxuICAgICdtdWQnLFxuICAgICdtdXNpYycsXG4gICAgJ211bXBzJyxcblxuICAgICduYXR1cmUnLFxuICAgICduZXdzJyxcbiAgICAnbml0cm9nZW4nLFxuICAgICdub25zZW5zZScsXG4gICAgJ251cnR1cmUnLFxuICAgICdudXRyaXRpb24nLFxuXG4gICAgJ29iZWRpZW5jZScsXG4gICAgJ29iZXNpdHknLFxuICAgIC8vICdvaWwnLFxuICAgICdveHlnZW4nLFxuXG4gICAgLy8gJ3BhcGVyJyxcbiAgICAvLyAncGFzc2lvbicsXG4gICAgJ3Bhc3RhJyxcbiAgICAncGF0aWVuY2UnLFxuICAgIC8vICdwZXJtaXNzaW9uJyxcbiAgICAncGh5c2ljcycsXG4gICAgJ3BvZXRyeScsXG4gICAgJ3BvbGx1dGlvbicsXG4gICAgJ3BvdmVydHknLFxuICAgIC8vICdwb3dlcicsXG4gICAgJ3ByaWRlJyxcbiAgICAvLyAncHJvZHVjdGlvbicsXG4gICAgLy8gJ3Byb2dyZXNzJyxcbiAgICAvLyAncHJvbnVuY2lhdGlvbicsXG4gICAgJ3BzeWNob2xvZ3knLFxuICAgICdwdWJsaWNpdHknLFxuICAgICdwdW5jdHVhdGlvbicsXG5cbiAgICAvLyAncXVhbGl0eScsXG4gICAgLy8gJ3F1YW50aXR5JyxcbiAgICAncXVhcnR6JyxcblxuICAgICdyYWNpc20nLFxuICAgIC8vICdyYWluJyxcbiAgICAvLyAncmVjcmVhdGlvbicsXG4gICAgJ3JlbGF4YXRpb24nLFxuICAgICdyZWxpYWJpbGl0eScsXG4gICAgJ3Jlc2VhcmNoJyxcbiAgICAncmVzcGVjdCcsXG4gICAgJ3JldmVuZ2UnLFxuICAgICdyaWNlJyxcbiAgICAncnViYmlzaCcsXG4gICAgJ3J1bScsXG5cbiAgICAnc2FmZXR5JyxcbiAgICAvLyAnc2FsYWQnLFxuICAgIC8vICdzYWx0JyxcbiAgICAvLyAnc2FuZCcsXG4gICAgLy8gJ3NhdGlyZScsXG4gICAgJ3NjZW5lcnknLFxuICAgICdzZWFmb29kJyxcbiAgICAnc2Vhc2lkZScsXG4gICAgJ3NlcmllcycsXG4gICAgJ3NoYW1lJyxcbiAgICAnc2hlZXAnLFxuICAgICdzaG9wcGluZycsXG4gICAgLy8gJ3NpbGVuY2UnLFxuICAgICdzbGVlcCcsXG4gICAgLy8gJ3NsYW5nJ1xuICAgICdzbW9rZScsXG4gICAgJ3Ntb2tpbmcnLFxuICAgICdzbm93JyxcbiAgICAnc29hcCcsXG4gICAgJ3NvZnR3YXJlJyxcbiAgICAnc29pbCcsXG4gICAgLy8gJ3NvcnJvdycsXG4gICAgLy8gJ3NvdXAnLFxuICAgICdzcGFnaGV0dGknLFxuICAgIC8vICdzcGVlZCcsXG4gICAgJ3NwZWNpZXMnLFxuICAgIC8vICdzcGVsbGluZycsXG4gICAgLy8gJ3Nwb3J0JyxcbiAgICAnc3RlYW0nLFxuICAgIC8vICdzdHJlbmd0aCcsXG4gICAgJ3N0dWZmJyxcbiAgICAnc3R1cGlkaXR5JyxcbiAgICAvLyAnc3VjY2VzcycsXG4gICAgLy8gJ3N1Z2FyJyxcbiAgICAnc3Vuc2hpbmUnLFxuICAgICdzeW1tZXRyeScsXG5cbiAgICAvLyAndGVhJyxcbiAgICAndGVubmlzJyxcbiAgICAndGhpcnN0JyxcbiAgICAndGh1bmRlcicsXG4gICAgJ3RpbWJlcicsXG4gICAgLy8gJ3RpbWUnLFxuICAgIC8vICd0b2FzdCcsXG4gICAgLy8gJ3RvbGVyYW5jZScsXG4gICAgLy8gJ3RyYWRlJyxcbiAgICAndHJhZmZpYycsXG4gICAgJ3RyYW5zcG9ydGF0aW9uJyxcbiAgICAvLyAndHJhdmVsJyxcbiAgICAndHJ1c3QnLFxuXG4gICAgLy8gJ3VuZGVyc3RhbmRpbmcnLFxuICAgICd1bmRlcndlYXInLFxuICAgICd1bmVtcGxveW1lbnQnLFxuICAgICd1bml0eScsXG4gICAgLy8gJ3VzYWdlJyxcblxuICAgICd2YWxpZGl0eScsXG4gICAgJ3ZlYWwnLFxuICAgICd2ZWdldGF0aW9uJyxcbiAgICAndmVnZXRhcmlhbmlzbScsXG4gICAgJ3ZlbmdlYW5jZScsXG4gICAgJ3Zpb2xlbmNlJyxcbiAgICAvLyAndmlzaW9uJyxcbiAgICAndml0YWxpdHknLFxuXG4gICAgJ3dhcm10aCcsXG4gICAgLy8gJ3dhdGVyJyxcbiAgICAnd2VhbHRoJyxcbiAgICAnd2VhdGhlcicsXG4gICAgLy8gJ3dlaWdodCcsXG4gICAgJ3dlbGZhcmUnLFxuICAgICd3aGVhdCcsXG4gICAgLy8gJ3doaXNrZXknLFxuICAgIC8vICd3aWR0aCcsXG4gICAgJ3dpbGRsaWZlJyxcbiAgICAvLyAnd2luZScsXG4gICAgJ3dpc2RvbScsXG4gICAgLy8gJ3dvb2QnLFxuICAgIC8vICd3b29sJyxcbiAgICAvLyAnd29yaycsXG5cbiAgICAvLyAneWVhc3QnLFxuICAgICd5b2dhJyxcblxuICAgICd6aW5jJyxcbiAgICAnem9vbG9neSdcbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoZXNlIHJ1bGVzIHRyYW5zbGF0ZSBmcm9tIHRoZSBzaW5ndWxhciBmb3JtIG9mIGEgbm91biB0byBpdHMgcGx1cmFsIGZvcm0uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIHZhciByZWdleCA9IHtcbiAgICBwbHVyYWwgOiB7XG4gICAgICBtZW4gICAgICAgOiBuZXcgUmVnRXhwKCAnXihtfHdvbSllbiQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHBlb3BsZSAgICA6IG5ldyBSZWdFeHAoICcocGUpb3BsZSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY2hpbGRyZW4gIDogbmV3IFJlZ0V4cCggJyhjaGlsZClyZW4kJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB0aWEgICAgICAgOiBuZXcgUmVnRXhwKCAnKFt0aV0pYSQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFuYWx5c2VzICA6IG5ldyBSZWdFeHAoICcoKGEpbmFseXwoYilhfChkKWlhZ25vfChwKWFyZW50aGV8KHApcm9nbm98KHMpeW5vcHwodCloZSlzZXMkJywnZ2knICksXG4gICAgICBoaXZlcyAgICAgOiBuZXcgUmVnRXhwKCAnKGhpfHRpKXZlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGN1cnZlcyAgICA6IG5ldyBSZWdFeHAoICcoY3VydmUpcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbHJ2ZXMgICAgIDogbmV3IFJlZ0V4cCggJyhbbHJdKXZlcyQnICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhdmVzICAgICAgOiBuZXcgUmVnRXhwKCAnKFthXSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZvdmVzICAgICA6IG5ldyBSZWdFeHAoICcoW15mb10pdmVzJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbW92aWVzICAgIDogbmV3IFJlZ0V4cCggJyhtKW92aWVzJCcgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhZWlvdXlpZXMgOiBuZXcgUmVnRXhwKCAnKFteYWVpb3V5XXxxdSlpZXMkJyAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHNlcmllcyAgICA6IG5ldyBSZWdFeHAoICcocyllcmllcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgeGVzICAgICAgIDogbmV3IFJlZ0V4cCggJyh4fGNofHNzfHNoKWVzJCcgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBtaWNlICAgICAgOiBuZXcgUmVnRXhwKCAnKFttfGxdKWljZSQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1c2VzICAgICA6IG5ldyBSZWdFeHAoICcoYnVzKWVzJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2VzICAgICAgIDogbmV3IFJlZ0V4cCggJyhvKWVzJCcgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzaG9lcyAgICAgOiBuZXcgUmVnRXhwKCAnKHNob2UpcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXNlcyAgICA6IG5ldyBSZWdFeHAoICcoY3Jpc3xheHx0ZXN0KWVzJCcgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2N0b3BpICAgIDogbmV3IFJlZ0V4cCggJyhvY3RvcHx2aXIpaSQnICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhbGlhc2VzICAgOiBuZXcgUmVnRXhwKCAnKGFsaWFzfGNhbnZhc3xzdGF0dXN8Y2FtcHVzKWVzJCcsICdnaScgKSxcbiAgICAgIHN1bW1vbnNlcyA6IG5ldyBSZWdFeHAoICdeKHN1bW1vbnMpZXMkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb3hlbiAgICAgIDogbmV3IFJlZ0V4cCggJ14ob3gpZW4nICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBtYXRyaWNlcyAgOiBuZXcgUmVnRXhwKCAnKG1hdHIpaWNlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHZlcnRpY2VzICA6IG5ldyBSZWdFeHAoICcodmVydHxpbmQpaWNlcyQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZmVldCAgICAgIDogbmV3IFJlZ0V4cCggJ15mZWV0JCcgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB0ZWV0aCAgICAgOiBuZXcgUmVnRXhwKCAnXnRlZXRoJCcgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlZXNlICAgICA6IG5ldyBSZWdFeHAoICdeZ2Vlc2UkJyAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcXVpenplcyAgIDogbmV3IFJlZ0V4cCggJyhxdWl6KXplcyQnICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB3aGVyZWFzZXMgOiBuZXcgUmVnRXhwKCAnXih3aGVyZWFzKWVzJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXRlcmlhICA6IG5ldyBSZWdFeHAoICdeKGNyaXRlcmkpYSQnICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ2VuZXJhICAgIDogbmV3IFJlZ0V4cCggJ15nZW5lcmEkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzcyAgICAgICAgOiBuZXcgUmVnRXhwKCAnc3MkJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHMgICAgICAgICA6IG5ldyBSZWdFeHAoICdzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApXG4gICAgfSxcblxuICAgIHNpbmd1bGFyIDoge1xuICAgICAgbWFuICAgICAgIDogbmV3IFJlZ0V4cCggJ14obXx3b20pYW4kJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcGVyc29uICAgIDogbmV3IFJlZ0V4cCggJyhwZSlyc29uJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY2hpbGQgICAgIDogbmV3IFJlZ0V4cCggJyhjaGlsZCkkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb3ggICAgICAgIDogbmV3IFJlZ0V4cCggJ14ob3gpJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYXhpcyAgICAgIDogbmV3IFJlZ0V4cCggJyhheHx0ZXN0KWlzJCcgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2N0b3B1cyAgIDogbmV3IFJlZ0V4cCggJyhvY3RvcHx2aXIpdXMkJyAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWxpYXMgICAgIDogbmV3IFJlZ0V4cCggJyhhbGlhc3xzdGF0dXN8Y2FudmFzfGNhbXB1cykkJywgJ2dpJyApLFxuICAgICAgc3VtbW9ucyAgIDogbmV3IFJlZ0V4cCggJ14oc3VtbW9ucykkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYnVzICAgICAgIDogbmV3IFJlZ0V4cCggJyhidSlzJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYnVmZmFsbyAgIDogbmV3IFJlZ0V4cCggJyhidWZmYWx8dG9tYXR8cG90YXQpbyQnICAgICAgICwgJ2dpJyApLFxuICAgICAgdGl1bSAgICAgIDogbmV3IFJlZ0V4cCggJyhbdGldKXVtJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc2lzICAgICAgIDogbmV3IFJlZ0V4cCggJ3NpcyQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZmZlICAgICAgIDogbmV3IFJlZ0V4cCggJyg/OihbXmZdKWZlfChbbHJdKWYpJCcgICAgICAgICwgJ2dpJyApLFxuICAgICAgaGl2ZSAgICAgIDogbmV3IFJlZ0V4cCggJyhoaXx0aSl2ZSQnICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWVpb3V5eSAgIDogbmV3IFJlZ0V4cCggJyhbXmFlaW91eV18cXUpeSQnICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgeCAgICAgICAgIDogbmV3IFJlZ0V4cCggJyh4fGNofHNzfHNoKSQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWF0cml4ICAgIDogbmV3IFJlZ0V4cCggJyhtYXRyKWl4JCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdmVydGV4ICAgIDogbmV3IFJlZ0V4cCggJyh2ZXJ0fGluZClleCQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbW91c2UgICAgIDogbmV3IFJlZ0V4cCggJyhbbXxsXSlvdXNlJCcgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZm9vdCAgICAgIDogbmV3IFJlZ0V4cCggJ15mb290JCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdG9vdGggICAgIDogbmV3IFJlZ0V4cCggJ150b290aCQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ29vc2UgICAgIDogbmV3IFJlZ0V4cCggJ15nb29zZSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcXVpeiAgICAgIDogbmV3IFJlZ0V4cCggJyhxdWl6KSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgd2hlcmVhcyAgIDogbmV3IFJlZ0V4cCggJ14od2hlcmVhcykkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY3JpdGVyaW9uIDogbmV3IFJlZ0V4cCggJ14oY3JpdGVyaSlvbiQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ2VudXMgICAgIDogbmV3IFJlZ0V4cCggJ15nZW51cyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcyAgICAgICAgIDogbmV3IFJlZ0V4cCggJ3MkJyAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY29tbW9uICAgIDogbmV3IFJlZ0V4cCggJyQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApXG4gICAgfVxuICB9O1xuXG4gIHZhciBwbHVyYWxfcnVsZXMgPSBbXG5cbiAgICAvLyBkbyBub3QgcmVwbGFjZSBpZiBpdHMgYWxyZWFkeSBhIHBsdXJhbCB3b3JkXG4gICAgWyByZWdleC5wbHVyYWwubWVuICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwucGVvcGxlICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY2hpbGRyZW4gIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGlhICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYW5hbHlzZXMgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuaGl2ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3VydmVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubHJ2ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZm92ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWVpb3V5aWVzIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc2VyaWVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubW92aWVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwueGVzICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWljZSAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYnVzZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2VzICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc2hvZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3Jpc2VzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2N0b3BpICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWxpYXNlcyAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc3VtbW9uc2VzIF0sXG4gICAgWyByZWdleC5wbHVyYWwub3hlbiAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWF0cmljZXMgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZmVldCAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGVldGggICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2Vlc2UgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwucXVpenplcyAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwud2hlcmVhc2VzIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3JpdGVyaWEgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2VuZXJhICAgIF0sXG5cbiAgICAvLyBvcmlnaW5hbCBydWxlXG4gICAgWyByZWdleC5zaW5ndWxhci5tYW4gICAgICAsICckMWVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucGVyc29uICAgLCAnJDFvcGxlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY2hpbGQgICAgLCAnJDFyZW4nIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5veCAgICAgICAsICckMWVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYXhpcyAgICAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm9jdG9wdXMgICwgJyQxaScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmFsaWFzICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zdW1tb25zICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVzICAgICAgLCAnJDFzZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idWZmYWxvICAsICckMW9lcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnRpdW0gICAgICwgJyQxYScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnNpcyAgICAgICwgJ3NlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmZmZSAgICAgICwgJyQxJDJ2ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5oaXZlICAgICAsICckMXZlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmFlaW91eXkgICwgJyQxaWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWF0cml4ICAgLCAnJDFpY2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudmVydGV4ICAgLCAnJDFpY2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIueCAgICAgICAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm1vdXNlICAgICwgJyQxaWNlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZm9vdCAgICAgLCAnZmVldCcgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnRvb3RoICAgICwgJ3RlZXRoJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ29vc2UgICAgLCAnZ2Vlc2UnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5xdWl6ICAgICAsICckMXplcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLndoZXJlYXMgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jcml0ZXJpb24sICckMWEnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nZW51cyAgICAsICdnZW5lcmEnIF0sXG5cbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnMgICAgICwgJ3MnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jb21tb24sICdzJyBdXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBydWxlcyB0cmFuc2xhdGUgZnJvbSB0aGUgcGx1cmFsIGZvcm0gb2YgYSBub3VuIHRvIGl0cyBzaW5ndWxhciBmb3JtLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdmFyIHNpbmd1bGFyX3J1bGVzID0gW1xuXG4gICAgLy8gZG8gbm90IHJlcGxhY2UgaWYgaXRzIGFscmVhZHkgYSBzaW5ndWxhciB3b3JkXG4gICAgWyByZWdleC5zaW5ndWxhci5tYW4gICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5wZXJzb24gIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jaGlsZCAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5veCAgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5heGlzICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5vY3RvcHVzIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hbGlhcyAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zdW1tb25zIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idXMgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idWZmYWxvIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50aXVtICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zaXMgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mZmUgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5oaXZlICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hZWlvdXl5IF0sXG4gICAgWyByZWdleC5zaW5ndWxhci54ICAgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tYXRyaXggIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tb3VzZSAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mb290ICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50b290aCAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nb29zZSAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5xdWl6ICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci53aGVyZWFzIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jcml0ZXJpb24gXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmdlbnVzIF0sXG5cbiAgICAvLyBvcmlnaW5hbCBydWxlXG4gICAgWyByZWdleC5wbHVyYWwubWVuICAgICAgLCAnJDFhbicgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5wZW9wbGUgICAsICckMXJzb24nIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY2hpbGRyZW4gLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2VuZXJhICAgLCAnZ2VudXMnXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5jcml0ZXJpYSAsICckMW9uJ10sXG4gICAgWyByZWdleC5wbHVyYWwudGlhICAgICAgLCAnJDF1bScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hbmFseXNlcyAsICckMSQyc2lzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmhpdmVzICAgICwgJyQxdmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3VydmVzICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubHJ2ZXMgICAgLCAnJDFmJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmF2ZXMgICAgICwgJyQxdmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZm92ZXMgICAgLCAnJDFmZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5tb3ZpZXMgICAsICckMW92aWUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWVpb3V5aWVzLCAnJDF5JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNlcmllcyAgICwgJyQxZXJpZXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwueGVzICAgICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWljZSAgICAgLCAnJDFvdXNlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmJ1c2VzICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9lcyAgICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNob2VzICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXNlcyAgICwgJyQxaXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2N0b3BpICAgLCAnJDF1cycgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hbGlhc2VzICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zdW1tb25zZXMsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5veGVuICAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5tYXRyaWNlcyAsICckMWl4JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnZlcnRpY2VzICwgJyQxZXgnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZmVldCAgICAgLCAnZm9vdCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC50ZWV0aCAgICAsICd0b290aCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5nZWVzZSAgICAsICdnb29zZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5xdWl6emVzICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC53aGVyZWFzZXMsICckMScgXSxcblxuICAgIFsgcmVnZXgucGx1cmFsLnNzLCAnc3MnIF0sXG4gICAgWyByZWdleC5wbHVyYWwucyAsICcnIF1cbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoaXMgaXMgYSBsaXN0IG9mIHdvcmRzIHRoYXQgc2hvdWxkIG5vdCBiZSBjYXBpdGFsaXplZCBmb3IgdGl0bGUgY2FzZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBub25fdGl0bGVjYXNlZF93b3JkcyA9IFtcbiAgICAnYW5kJywgJ29yJywgJ25vcicsICdhJywgJ2FuJywgJ3RoZScsICdzbycsICdidXQnLCAndG8nLCAnb2YnLCAnYXQnLCdieScsXG4gICAgJ2Zyb20nLCAnaW50bycsICdvbicsICdvbnRvJywgJ29mZicsICdvdXQnLCAnaW4nLCAnb3ZlcicsICd3aXRoJywgJ2ZvcidcbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoZXNlIGFyZSByZWd1bGFyIGV4cHJlc3Npb25zIHVzZWQgZm9yIGNvbnZlcnRpbmcgYmV0d2VlbiBTdHJpbmcgZm9ybWF0cy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBpZF9zdWZmaXggICAgICAgICA9IG5ldyBSZWdFeHAoICcoX2lkc3xfaWQpJCcsICdnJyApO1xuICB2YXIgdW5kZXJiYXIgICAgICAgICAgPSBuZXcgUmVnRXhwKCAnXycsICdnJyApO1xuICB2YXIgc3BhY2Vfb3JfdW5kZXJiYXIgPSBuZXcgUmVnRXhwKCAnW1xcIF9dJywgJ2cnICk7XG4gIHZhciB1cHBlcmNhc2UgICAgICAgICA9IG5ldyBSZWdFeHAoICcoW0EtWl0pJywgJ2cnICk7XG4gIHZhciB1bmRlcmJhcl9wcmVmaXggICA9IG5ldyBSZWdFeHAoICdeXycgKTtcblxuICB2YXIgaW5mbGVjdG9yID0ge1xuXG4gIC8qKlxuICAgKiBBIGhlbHBlciBtZXRob2QgdGhhdCBhcHBsaWVzIHJ1bGVzIGJhc2VkIHJlcGxhY2VtZW50IHRvIGEgU3RyaW5nLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBTdHJpbmcgdG8gbW9kaWZ5IGFuZCByZXR1cm4gYmFzZWQgb24gdGhlIHBhc3NlZCBydWxlcy5cbiAgICogQHBhcmFtIHtBcnJheTogW1JlZ0V4cCwgU3RyaW5nXX0gcnVsZXMgUmVnZXhwIHRvIG1hdGNoIHBhaXJlZCB3aXRoIFN0cmluZyB0byB1c2UgZm9yIHJlcGxhY2VtZW50XG4gICAqIEBwYXJhbSB7QXJyYXk6IFtTdHJpbmddfSBza2lwIFN0cmluZ3MgdG8gc2tpcCBpZiB0aGV5IG1hdGNoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvdmVycmlkZSBTdHJpbmcgdG8gcmV0dXJuIGFzIHRob3VnaCB0aGlzIG1ldGhvZCBzdWNjZWVkZWQgKHVzZWQgdG8gY29uZm9ybSB0byBBUElzKVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gcGFzc2VkIFN0cmluZyBtb2RpZmllZCBieSBwYXNzZWQgcnVsZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB0aGlzLl9hcHBseV9ydWxlcyggJ2Nvd3MnLCBzaW5ndWxhcl9ydWxlcyApOyAvLyA9PT0gJ2NvdydcbiAgICovXG4gICAgX2FwcGx5X3J1bGVzIDogZnVuY3Rpb24gKCBzdHIsIHJ1bGVzLCBza2lwLCBvdmVycmlkZSApe1xuICAgICAgaWYoIG92ZXJyaWRlICl7XG4gICAgICAgIHN0ciA9IG92ZXJyaWRlO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHZhciBpZ25vcmUgPSAoIGluZmxlY3Rvci5pbmRleE9mKCBza2lwLCBzdHIudG9Mb3dlckNhc2UoKSkgPiAtMSApO1xuXG4gICAgICAgIGlmKCAhaWdub3JlICl7XG4gICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgIHZhciBqID0gcnVsZXMubGVuZ3RoO1xuXG4gICAgICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgICAgIGlmKCBzdHIubWF0Y2goIHJ1bGVzWyBpIF1bIDAgXSkpe1xuICAgICAgICAgICAgICBpZiggcnVsZXNbIGkgXVsgMSBdICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSggcnVsZXNbIGkgXVsgMCBdLCBydWxlc1sgaSBdWyAxIF0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGxldHMgdXMgZGV0ZWN0IGlmIGFuIEFycmF5IGNvbnRhaW5zIGEgZ2l2ZW4gZWxlbWVudC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtBcnJheX0gYXJyIFRoZSBzdWJqZWN0IGFycmF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gaXRlbSBPYmplY3QgdG8gbG9jYXRlIGluIHRoZSBBcnJheS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZyb21faW5kZXggU3RhcnRzIGNoZWNraW5nIGZyb20gdGhpcyBwb3NpdGlvbiBpbiB0aGUgQXJyYXkuKG9wdGlvbmFsKVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJlX2Z1bmMgRnVuY3Rpb24gdXNlZCB0byBjb21wYXJlIEFycmF5IGl0ZW0gdnMgcGFzc2VkIGl0ZW0uKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm4gaW5kZXggcG9zaXRpb24gaW4gdGhlIEFycmF5IG9mIHRoZSBwYXNzZWQgaXRlbS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmluZGV4T2YoWyAnaGknLCd0aGVyZScgXSwgJ2d1eXMnICk7IC8vID09PSAtMVxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmRleE9mKFsgJ2hpJywndGhlcmUnIF0sICdoaScgKTsgLy8gPT09IDBcbiAgICovXG4gICAgaW5kZXhPZiA6IGZ1bmN0aW9uICggYXJyLCBpdGVtLCBmcm9tX2luZGV4LCBjb21wYXJlX2Z1bmMgKXtcbiAgICAgIGlmKCAhZnJvbV9pbmRleCApe1xuICAgICAgICBmcm9tX2luZGV4ID0gLTE7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgdmFyIGkgICAgID0gZnJvbV9pbmRleDtcbiAgICAgIHZhciBqICAgICA9IGFyci5sZW5ndGg7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIGlmKCBhcnJbIGkgXSAgPT09IGl0ZW0gfHwgY29tcGFyZV9mdW5jICYmIGNvbXBhcmVfZnVuYyggYXJyWyBpIF0sIGl0ZW0gKSl7XG4gICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHBsdXJhbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHBsdXJhbCBPdmVycmlkZXMgbm9ybWFsIG91dHB1dCB3aXRoIHNhaWQgU3RyaW5nLihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gU2luZ3VsYXIgRW5nbGlzaCBsYW5ndWFnZSBub3VucyBhcmUgcmV0dXJuZWQgaW4gcGx1cmFsIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdwZXJzb24nICk7IC8vID09PSAncGVvcGxlJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdvY3RvcHVzJyApOyAvLyA9PT0gJ29jdG9waSdcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAnSGF0JyApOyAvLyA9PT0gJ0hhdHMnXG4gICAqICAgICBpbmZsZWN0aW9uLnBsdXJhbGl6ZSggJ3BlcnNvbicsICdndXlzJyApOyAvLyA9PT0gJ2d1eXMnXG4gICAqL1xuICAgIHBsdXJhbGl6ZSA6IGZ1bmN0aW9uICggc3RyLCBwbHVyYWwgKXtcbiAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHBsdXJhbF9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHBsdXJhbCApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgc2luZ3VsYXJpemF0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzaW5ndWxhciBPdmVycmlkZXMgbm9ybWFsIG91dHB1dCB3aXRoIHNhaWQgU3RyaW5nLihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gUGx1cmFsIEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ3Blb3BsZScgKTsgLy8gPT09ICdwZXJzb24nXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnb2N0b3BpJyApOyAvLyA9PT0gJ29jdG9wdXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnSGF0cycgKTsgLy8gPT09ICdIYXQnXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnZ3V5cycsICdwZXJzb24nICk7IC8vID09PSAncGVyc29uJ1xuICAgKi9cbiAgICBzaW5ndWxhcml6ZSA6IGZ1bmN0aW9uICggc3RyLCBzaW5ndWxhciApe1xuICAgICAgcmV0dXJuIGluZmxlY3Rvci5fYXBwbHlfcnVsZXMoIHN0ciwgc2luZ3VsYXJfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBzaW5ndWxhciApO1xuICAgIH0sXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiB3aWxsIHBsdXJhbGl6ZSBvciBzaW5ndWxhcmxpemUgYSBTdHJpbmcgYXBwcm9wcmlhdGVseSBiYXNlZCBvbiBhbiBpbnRlZ2VyIHZhbHVlXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgVGhlIG51bWJlciB0byBiYXNlIHBsdXJhbGl6YXRpb24gb2ZmIG9mLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2luZ3VsYXIgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwbHVyYWwgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHRoZSBwbHVyYWwgb3Igc2luZ3VsYXIgZm9ybSBiYXNlZCBvbiB0aGUgY291bnQuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVvcGxlJyAxICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnb2N0b3BpJyAxICk7IC8vID09PSAnb2N0b3B1cydcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ0hhdHMnIDEgKTsgLy8gPT09ICdIYXQnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdndXlzJywgMSAsICdwZXJzb24nICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVyc29uJywgMiApOyAvLyA9PT0gJ3Blb3BsZSdcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ29jdG9wdXMnLCAyICk7IC8vID09PSAnb2N0b3BpJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnSGF0JywgMiApOyAvLyA9PT0gJ0hhdHMnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdwZXJzb24nLCAyLCBudWxsLCAnZ3V5cycgKTsgLy8gPT09ICdndXlzJ1xuICAgKi9cbiAgICBpbmZsZWN0IDogZnVuY3Rpb24gKCBzdHIsIGNvdW50LCBzaW5ndWxhciwgcGx1cmFsICl7XG4gICAgICBjb3VudCA9IHBhcnNlSW50KCBjb3VudCwgMTAgKTtcblxuICAgICAgaWYoIGlzTmFOKCBjb3VudCApKSByZXR1cm4gc3RyO1xuXG4gICAgICBpZiggY291bnQgPT09IDAgfHwgY291bnQgPiAxICl7XG4gICAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHBsdXJhbF9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHBsdXJhbCApO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHNpbmd1bGFyX3J1bGVzLCB1bmNvdW50YWJsZV93b3Jkcywgc2luZ3VsYXIgKTtcbiAgICAgIH1cbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNhbWVsaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGxvd19maXJzdF9sZXR0ZXIgRGVmYXVsdCBpcyB0byBjYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHJlc3VsdHMuKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIGxvd2VyY2FzZSBpdC5cbiAgICogQHJldHVybnMge1N0cmluZ30gTG93ZXIgY2FzZSB1bmRlcnNjb3JlZCB3b3JkcyB3aWxsIGJlIHJldHVybmVkIGluIGNhbWVsIGNhc2UuXG4gICAqICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbGx5ICcvJyBpcyB0cmFuc2xhdGVkIHRvICc6OidcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNhbWVsaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2VQcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5jYW1lbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlUHJvcGVydGllcydcbiAgICovXG4gICAgY2FtZWxpemUgOiBmdW5jdGlvbiAoIHN0ciwgbG93X2ZpcnN0X2xldHRlciApe1xuICAgICAgdmFyIHN0cl9wYXRoID0gc3RyLnNwbGl0KCAnLycgKTtcbiAgICAgIHZhciBpICAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICAgPSBzdHJfcGF0aC5sZW5ndGg7XG4gICAgICB2YXIgc3RyX2FyciwgaW5pdF94LCBrLCBsLCBmaXJzdDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgc3RyX2FyciA9IHN0cl9wYXRoWyBpIF0uc3BsaXQoICdfJyApO1xuICAgICAgICBrICAgICAgID0gMDtcbiAgICAgICAgbCAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuXG4gICAgICAgIGZvciggOyBrIDwgbDsgaysrICl7XG4gICAgICAgICAgaWYoIGsgIT09IDAgKXtcbiAgICAgICAgICAgIHN0cl9hcnJbIGsgXSA9IHN0cl9hcnJbIGsgXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZpcnN0ID0gc3RyX2FyclsgayBdLmNoYXJBdCggMCApO1xuICAgICAgICAgIGZpcnN0ID0gbG93X2ZpcnN0X2xldHRlciAmJiBpID09PSAwICYmIGsgPT09IDBcbiAgICAgICAgICAgID8gZmlyc3QudG9Mb3dlckNhc2UoKSA6IGZpcnN0LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgc3RyX2FyclsgayBdID0gZmlyc3QgKyBzdHJfYXJyWyBrIF0uc3Vic3RyaW5nKCAxICk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX2Fyci5qb2luKCAnJyApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyX3BhdGguam9pbiggJzo6JyApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdW5kZXJzY29yZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbF91cHBlcl9jYXNlIERlZmF1bHQgaXMgdG8gbG93ZXJjYXNlIGFuZCBhZGQgdW5kZXJzY29yZSBwcmVmaXguKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIHJldHVybiBhcyBlbnRlcmVkLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBDYW1lbCBjYXNlZCB3b3JkcyBhcmUgcmV0dXJuZWQgYXMgbG93ZXIgY2FzZWQgYW5kIHVuZGVyc2NvcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxseSAnOjonIGlzIHRyYW5zbGF0ZWQgdG8gJy8nLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ01lc3NhZ2VQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2VfcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ21lc3NhZ2VQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2VfcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ01QJywgdHJ1ZSApOyAvLyA9PT0gJ01QJ1xuICAgKi9cbiAgICB1bmRlcnNjb3JlIDogZnVuY3Rpb24gKCBzdHIsIGFsbF91cHBlcl9jYXNlICl7XG4gICAgICBpZiggYWxsX3VwcGVyX2Nhc2UgJiYgc3RyID09PSBzdHIudG9VcHBlckNhc2UoKSkgcmV0dXJuIHN0cjtcblxuICAgICAgdmFyIHN0cl9wYXRoID0gc3RyLnNwbGl0KCAnOjonICk7XG4gICAgICB2YXIgaSAgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgID0gc3RyX3BhdGgubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX3BhdGhbIGkgXS5yZXBsYWNlKCB1cHBlcmNhc2UsICdfJDEnICk7XG4gICAgICAgIHN0cl9wYXRoWyBpIF0gPSBzdHJfcGF0aFsgaSBdLnJlcGxhY2UoIHVuZGVyYmFyX3ByZWZpeCwgJycgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9wYXRoLmpvaW4oICcvJyApLnRvTG93ZXJDYXNlKCk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBodW1hbml6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGxvd19maXJzdF9sZXR0ZXIgRGVmYXVsdCBpcyB0byBjYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHJlc3VsdHMuKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIGxvd2VyY2FzZSBpdC5cbiAgICogQHJldHVybnMge1N0cmluZ30gTG93ZXIgY2FzZSB1bmRlcnNjb3JlZCB3b3JkcyB3aWxsIGJlIHJldHVybmVkIGluIGh1bWFuaXplZCBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uaHVtYW5pemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5odW1hbml6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlIHByb3BlcnRpZXMnXG4gICAqL1xuICAgIGh1bWFuaXplIDogZnVuY3Rpb24gKCBzdHIsIGxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UoIGlkX3N1ZmZpeCwgJycgKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCB1bmRlcmJhciwgJyAnICk7XG5cbiAgICAgIGlmKCAhbG93X2ZpcnN0X2xldHRlciApe1xuICAgICAgICBzdHIgPSBpbmZsZWN0b3IuY2FwaXRhbGl6ZSggc3RyICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBjYXBpdGFsaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBBbGwgY2hhcmFjdGVycyB3aWxsIGJlIGxvd2VyIGNhc2UgYW5kIHRoZSBmaXJzdCB3aWxsIGJlIHVwcGVyLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uY2FwaXRhbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLmNhcGl0YWxpemUoICdtZXNzYWdlIHByb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnTWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBjYXBpdGFsaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICByZXR1cm4gc3RyLnN1YnN0cmluZyggMCwgMSApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyaW5nKCAxICk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMgaW4gdGhlIHN0cmluZy5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFJlcGxhY2VzIGFsbCBzcGFjZXMgb3IgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5kYXNoZXJpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnbWVzc2FnZS1wcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5kYXNoZXJpemUoICdNZXNzYWdlIFByb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZS1Qcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBkYXNoZXJpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKCBzcGFjZV9vcl91bmRlcmJhciwgJy0nICk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0aXRsZWl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBDYXBpdGFsaXplcyB3b3JkcyBhcyB5b3Ugd291bGQgZm9yIGEgYm9vayB0aXRsZS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnRpdGxlaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UgUHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udGl0bGVpemUoICdtZXNzYWdlIHByb3BlcnRpZXMgdG8ga2VlcCcgKTsgLy8gPT09ICdNZXNzYWdlIFByb3BlcnRpZXMgdG8gS2VlcCdcbiAgICovXG4gICAgdGl0bGVpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgc3RyICAgICAgICAgPSBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCB1bmRlcmJhciwgJyAnICk7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJyAnICk7XG4gICAgICB2YXIgaSAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuICAgICAgdmFyIGQsIGssIGw7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIGQgPSBzdHJfYXJyWyBpIF0uc3BsaXQoICctJyApO1xuICAgICAgICBrID0gMDtcbiAgICAgICAgbCA9IGQubGVuZ3RoO1xuXG4gICAgICAgIGZvciggOyBrIDwgbDsgaysrKXtcbiAgICAgICAgICBpZiggaW5mbGVjdG9yLmluZGV4T2YoIG5vbl90aXRsZWNhc2VkX3dvcmRzLCBkWyBrIF0udG9Mb3dlckNhc2UoKSkgPCAwICl7XG4gICAgICAgICAgICBkWyBrIF0gPSBpbmZsZWN0b3IuY2FwaXRhbGl6ZSggZFsgayBdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdHJfYXJyWyBpIF0gPSBkLmpvaW4oICctJyApO1xuICAgICAgfVxuXG4gICAgICBzdHIgPSBzdHJfYXJyLmpvaW4oICcgJyApO1xuICAgICAgc3RyID0gc3RyLnN1YnN0cmluZyggMCwgMSApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyaW5nKCAxICk7XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBkZW1vZHVsaXplIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFJlbW92ZXMgbW9kdWxlIG5hbWVzIGxlYXZpbmcgb25seSBjbGFzcyBuYW1lcy4oUnVieSBzdHlsZSlcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmRlbW9kdWxpemUoICdNZXNzYWdlOjpCdXM6OlByb3BlcnRpZXMnICk7IC8vID09PSAnUHJvcGVydGllcydcbiAgICovXG4gICAgZGVtb2R1bGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJzo6JyApO1xuXG4gICAgICByZXR1cm4gc3RyX2Fyclsgc3RyX2Fyci5sZW5ndGggLSAxIF07XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0YWJsZWl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gY2FtZWwgY2FzZWQgd29yZHMgaW50byB0aGVpciB1bmRlcnNjb3JlZCBwbHVyYWwgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnRhYmxlaXplKCAnTWVzc2FnZUJ1c1Byb3BlcnR5JyApOyAvLyA9PT0gJ21lc3NhZ2VfYnVzX3Byb3BlcnRpZXMnXG4gICAqL1xuICAgIHRhYmxlaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci51bmRlcnNjb3JlKCBzdHIgKTtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5wbHVyYWxpemUoIHN0ciApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgY2xhc3NpZmljYXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gVW5kZXJzY29yZWQgcGx1cmFsIG5vdW5zIGJlY29tZSB0aGUgY2FtZWwgY2FzZWQgc2luZ3VsYXIgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNsYXNzaWZ5KCAnbWVzc2FnZV9idXNfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlQnVzUHJvcGVydHknXG4gICAqL1xuICAgIGNsYXNzaWZ5IDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5jYW1lbGl6ZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3Iuc2luZ3VsYXJpemUoIHN0ciApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgZm9yZWlnbiBrZXkgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBkcm9wX2lkX3ViYXIgRGVmYXVsdCBpcyB0byBzZXBlcmF0ZSBpZCB3aXRoIGFuIHVuZGVyYmFyIGF0IHRoZSBlbmQgb2YgdGhlIGNsYXNzIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5b3UgY2FuIHBhc3MgdHJ1ZSB0byBza2lwIGl0LihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gVW5kZXJzY29yZWQgcGx1cmFsIG5vdW5zIGJlY29tZSB0aGUgY2FtZWwgY2FzZWQgc2luZ3VsYXIgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmZvcmVpZ25fa2V5KCAnTWVzc2FnZUJ1c1Byb3BlcnR5JyApOyAvLyA9PT0gJ21lc3NhZ2VfYnVzX3Byb3BlcnR5X2lkJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5mb3JlaWduX2tleSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0eWlkJ1xuICAgKi9cbiAgICBmb3JlaWduX2tleSA6IGZ1bmN0aW9uICggc3RyLCBkcm9wX2lkX3ViYXIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5kZW1vZHVsaXplKCBzdHIgKTtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci51bmRlcnNjb3JlKCBzdHIgKSArICgoIGRyb3BfaWRfdWJhciApID8gKCAnJyApIDogKCAnXycgKSkgKyAnaWQnO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgb3JkaW5hbGl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gYWxsIGZvdW5kIG51bWJlcnMgdGhlaXIgc2VxdWVuY2UgbGlrZSAnMjJuZCcuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5vcmRpbmFsaXplKCAndGhlIDEgcGl0Y2gnICk7IC8vID09PSAndGhlIDFzdCBwaXRjaCdcbiAgICovXG4gICAgb3JkaW5hbGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJyAnICk7XG4gICAgICB2YXIgaSAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICB2YXIgayA9IHBhcnNlSW50KCBzdHJfYXJyWyBpIF0sIDEwICk7XG5cbiAgICAgICAgaWYoICFpc05hTiggayApKXtcbiAgICAgICAgICB2YXIgbHRkID0gc3RyX2FyclsgaSBdLnN1YnN0cmluZyggc3RyX2FyclsgaSBdLmxlbmd0aCAtIDIgKTtcbiAgICAgICAgICB2YXIgbGQgID0gc3RyX2FyclsgaSBdLnN1YnN0cmluZyggc3RyX2FyclsgaSBdLmxlbmd0aCAtIDEgKTtcbiAgICAgICAgICB2YXIgc3VmID0gJ3RoJztcblxuICAgICAgICAgIGlmKCBsdGQgIT0gJzExJyAmJiBsdGQgIT0gJzEyJyAmJiBsdGQgIT0gJzEzJyApe1xuICAgICAgICAgICAgaWYoIGxkID09PSAnMScgKXtcbiAgICAgICAgICAgICAgc3VmID0gJ3N0JztcbiAgICAgICAgICAgIH1lbHNlIGlmKCBsZCA9PT0gJzInICl7XG4gICAgICAgICAgICAgIHN1ZiA9ICduZCc7XG4gICAgICAgICAgICB9ZWxzZSBpZiggbGQgPT09ICczJyApe1xuICAgICAgICAgICAgICBzdWYgPSAncmQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHN0cl9hcnJbIGkgXSArPSBzdWY7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9hcnIuam9pbiggJyAnICk7XG4gICAgfSxcblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBwZXJmb3JtcyBtdWx0aXBsZSBpbmZsZWN0aW9uIG1ldGhvZHMgb24gYSBzdHJpbmdcbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyciBBbiBhcnJheSBvZiBpbmZsZWN0aW9uIG1ldGhvZHMuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50cmFuc2Zvcm0oICdhbGwgam9iJywgWyAncGx1cmFsaXplJywgJ2NhcGl0YWxpemUnLCAnZGFzaGVyaXplJyBdKTsgLy8gPT09ICdBbGwtam9icydcbiAgICovXG4gICAgdHJhbnNmb3JtIDogZnVuY3Rpb24gKCBzdHIsIGFyciApe1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgdmFyIGogPSBhcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDtpIDwgajsgaSsrICl7XG4gICAgICAgIHZhciBtZXRob2QgPSBhcnJbIGkgXTtcblxuICAgICAgICBpZiggaW5mbGVjdG9yLmhhc093blByb3BlcnR5KCBtZXRob2QgKSl7XG4gICAgICAgICAgc3RyID0gaW5mbGVjdG9yWyBtZXRob2QgXSggc3RyICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG4gIGluZmxlY3Rvci52ZXJzaW9uID0gJzEuMTIuMCc7XG5cbiAgcmV0dXJuIGluZmxlY3Rvcjtcbn0pKTtcbiJdfQ==
