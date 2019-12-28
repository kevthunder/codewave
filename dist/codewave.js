(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringHelper = require('./helpers/StringHelper').StringHelper;

var ArrayHelper = require('./helpers/ArrayHelper').ArrayHelper;

var Pair = require('./positioning/Pair').Pair;

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
      return this.startSep() + '\n' + this.lines(text) + '\n' + this.endSep();
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
      return StringHelper.repeatToLength(' ', this.pad);
    }
  }, {
    key: "lines",
    value: function lines() {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var uptoHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var l, lines, x;
      text = text || '';
      lines = text.replace(/\r/g, '').split('\n');

      if (uptoHeight) {
        return function () {
          var i, ref, results;
          results = [];

          for (x = i = 0, ref = this.height; ref >= 0 ? i <= ref : i >= ref; x = ref >= 0 ? ++i : --i) {
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
      return StringHelper.repeatToLength(' ', this.indent) + this.wrapComment(this.deco + this.padding() + text + StringHelper.repeatToLength(' ', this.width - this.removeIgnoredContent(text).length) + this.padding() + this.deco);
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
        placeholder = '###PlaceHolder###';
        clone.width = placeholder.length;
        clone.openText = clone.closeText = this.deco + this.deco + placeholder + this.deco + this.deco;
        startFind = RegExp(StringHelper.escapeRegExp(curLeft + clone.startSep()).replace(placeholder, '.*'));
        endFind = RegExp(StringHelper.escapeRegExp(curLeft + clone.endSep()).replace(placeholder, '.*'));
        pair = new Pair(startFind, endFind, {
          validMatch: function validMatch(match) {
            var f; // console.log(match,left)

            f = _this.context.codewave.findAnyNext(match.start(), [left, '\n', '\r'], -1);
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

      while ((f = this.context.codewave.findAnyNext(index, [left, '\n', '\r'], -1)) != null && f.str === left) {
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
      rStart = new RegExp('(\\s*)(' + StringHelper.escapeRegExp(this.context.wrapCommentLeft(this.deco)) + ')(\\s*)');
      rEnd = new RegExp('(\\s*)(' + StringHelper.escapeRegExp(this.context.wrapCommentRight(this.deco)) + ')(\n|$)');
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
        flag = options.multiline ? 'gm' : '';
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

var PosCollection = require('./positioning/PosCollection').PosCollection;

var Replacement = require('./positioning/Replacement').Replacement;

var Pos = require('./positioning/Pos').Pos;

var OptionalPromise = require('./helpers/OptionalPromise');

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
      this.replacements = this.selections.wrap(this.codewave.brakets + this.codewave.carretChar + this.codewave.brakets + '\n', '\n' + this.codewave.brakets + this.codewave.closeChar + this.codewave.carretChar + this.codewave.brakets).map(function (p) {
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
      var end, j, len, repl, replacements, res, sel, selections, start;
      replacements = [];
      selections = this.getSelections();

      for (j = 0, len = selections.length; j < len; j++) {
        sel = selections[j];
        var pos = this.whithinOpenBounds(sel);

        if (pos) {
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
      var end, j, len, replacements, sel, start;
      replacements = [];
      start = null;

      for (j = 0, len = selections.length; j < len; j++) {
        sel = selections[j];
        var pos = this.whithinOpenBounds(sel);

        if (pos) {
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

var Context = require('./Context').Context;

var NamespaceHelper = require('./helpers/NamespaceHelper').NamespaceHelper;

var Command = require('./Command').Command;

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
      root: Command.cmds,
      mustExecute: true,
      useDetectors: true,
      useFallbacks: true,
      instance: null,
      codewave: null
    };
    this.names = names;
    this.parent = options.parent;

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
      this.context = new Context(this.codewave);
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

          if (n.indexOf(':') === -1) {
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

      if (((ref = this.codewave) != null ? (ref1 = ref.inInstance) != null ? ref1.cmd : null : null) === this.root) {
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

      if (((ref = this.codewave) != null ? ref.inInstance : null) != null) {
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

var Context = require('./Context').Context;

var TextParser = require('./TextParser').TextParser;

var StringHelper = require('./helpers/StringHelper').StringHelper;

var OptionalPromise = require('./helpers/OptionalPromise');

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
        this.context = new Context();
      }

      return this.context || new Context();
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
      falseVals = ['', '0', 'false', 'no', 'none', false, null, 0];
      val = this.getParam(names, defVal);
      return !falseVals.includes(val);
    }
  }, {
    key: "ancestorCmds",
    value: function ancestorCmds() {
      var ref;

      if (((ref = this.context.codewave) != null ? ref.inInstance : null) != null) {
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
          var parser;

          if (res != null) {
            res = _this.formatIndent(res);

            if (res.length > 0 && _this.getOption('parse', _this)) {
              parser = _this.getParserForText(res);
              res = parser.parseAll();
            }

            var alterFunct = _this.getOption('alterResult', _this);

            if (alterFunct) {
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
      parser = this.context.codewave.newInstance(new TextParser(txt), {
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
      return StringHelper.indentNotFirst(text, this.getIndent(), ' ');
    }
  }]);

  return CmdInstance;
}();

exports.CmdInstance = CmdInstance;

},{"./Context":7,"./TextParser":16,"./helpers/OptionalPromise":32,"./helpers/StringHelper":34}],5:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Process = require('./Process').Process;

var Context = require('./Context').Context;

var PositionedCmdInstance = require('./PositionedCmdInstance').PositionedCmdInstance;

var TextParser = require('./TextParser').TextParser;

var Command = require('./Command').Command;

var Logger = require('./Logger').Logger;

var PosCollection = require('./positioning/PosCollection').PosCollection;

var StringHelper = require('./helpers/StringHelper').StringHelper;

var ClosingPromp = require('./ClosingPromp').ClosingPromp;

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
        brakets: '~~',
        deco: '~',
        closeChar: '/',
        noExecuteChar: '!',
        carretChar: '|',
        checkCarret: true,
        inInstance: null
      };
      this.parent = options.parent;
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

      this.context = new Context(this);

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

        while (f = this.findAnyNext(pos, [this.brakets, '\n'])) {
          pos = f.pos + f.str.length;

          if (f.str === this.brakets) {
            if (typeof beginning !== 'undefined' && beginning !== null) {
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
        var closingPrefix, cpos, p;
        cpos = pos;
        closingPrefix = this.brakets + this.closeChar;

        while ((p = this.findNext(cpos, closingPrefix)) != null) {
          var cmd = this.commandOnPos(p + closingPrefix.length);

          if (cmd) {
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
        return this.editor.textSubstr(pos, pos + 1) === '\n' || pos + 1 >= this.editor.textLen();
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
        f = this.findAnyNext(start, [this.brakets, '\n'], direction);

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
      key: "newInstance",
      value: function newInstance(editor, options) {
        return new Codewave(editor, options);
      }
    }, {
      key: "parseAll",
      value: function parseAll() {
        var recursive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var cmd, parser, pos, res;

        if (this.nested > 100) {
          throw new Error('Infinite parsing Recursion');
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
        var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'g';
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
          Command.initCmds();
          return Command.loadCmds();
        }
      }
    }]);

    return Codewave;
  }();

  ;
  Codewave.inited = false;
  return Codewave;
}.call(null);

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

var Context = require('./Context').Context;

var Storage = require('./Storage').Storage;

var NamespaceHelper = require('./helpers/NamespaceHelper').NamespaceHelper;

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
        this.depth = this._parent != null && this._parent.depth != null ? this._parent.depth + 1 : 0;
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
        context = new Context();
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
        context = new Context();
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
          results.push(null);
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
        this.options.parse = true;
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

      if (typeof res === 'function') {
        this.resultFunct = res;
      } else if (res != null) {
        this.resultStr = res;
        this.options.parse = true;
      }

      execute = _optKey('execute', data);

      if (typeof execute === 'function') {
        this.executeFunct = execute;
      }

      this.aliasOf = _optKey('aliasOf', data);
      this.cls = _optKey('cls', data);
      this.defaults = _optKey('defaults', data, this.defaults);
      this.setOptions(data);

      if ('help' in data) {
        this.addCmd(new Command('help', data.help, this));
      }

      if ('fallback' in data) {
        this.addCmd(new Command('fallback', data.fallback, this));
      }

      if ('cmds' in data) {
        this.addCmds(data.cmds);
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
        return (ref = this.getCmd(space)) != null ? ref.getCmd(name) : null;
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
        cmds: {
          hello: {
            help: '"Hello, world!" is typically one of the simplest programs possible in\nmost programming languages, it is by tradition often (...) used to\nverify that a language or system is operating correctly -wikipedia',
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
        return _this2.storage.load('cmds');
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
        val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : null;

        if (val != null) {
          instance.codewave.vars[name] = val;
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
        val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : null;

        if (!(val != null && (val === '0' || val === 'false' || val === 'no'))) {
          instance.codewave.vars[name] = true;
        }
      };

      return base;
    }
  }]);

  return Command;
}();

Command.providers = [];
Command.storage = new Storage();
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
      return this.result != null;
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

var ArrayHelper = require('./helpers/ArrayHelper').ArrayHelper;

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
        this._namespaces = null;
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
      this.nameSpaces = this.nameSpaces.filter(function (n) {
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
      var CmdFinder = Context.cmdFinderClass;
      return new CmdFinder(cmdName, Object.assign({
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
      var CmdInstance = Context.cmdInstanceClass;
      return new CmdInstance(cmd, this);
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

},{"./helpers/ArrayHelper":29}],8:[function(require,module,exports){
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

var Command = require('./Command').Command;

var EditCmdProp =
/*#__PURE__*/
function () {
  function EditCmdProp(name, options) {
    _classCallCheck(this, EditCmdProp);

    var defaults, i, key, len, ref, val;
    this.name = name;
    defaults = {
      "var": null,
      opt: null,
      funct: null,
      dataName: null,
      showEmpty: false,
      carret: false
    };
    ref = ['var', 'opt', 'funct'];

    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];

      if (key in options) {
        defaults.dataName = options[key];
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
      cmds[this.name] = Command.makeVarCmd(this.name);
    }
  }, {
    key: "writeFor",
    value: function writeFor(parser, obj) {
      if (parser.vars[this.name] != null) {
        obj[this.dataName] = parser.vars[this.name];
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
        return "~~".concat(this.name, "~~\n").concat(this.valFromCmd(cmd) || '').concat(this.carret ? '|' : '', "\n~~/").concat(this.name, "~~");
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
      cmds[this.name] = Command.makeVarCmd(this.name, {
        preventParseAll: true
      });
    }
  }, {
    key: "showForCmd",
    value: function showForCmd(cmd) {
      var val;
      val = this.valFromCmd(cmd);
      return this.showEmpty && (cmd == null || cmd.aliasOf == null || val != null);
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
        return "~~!".concat(this.name, " '").concat(this.valFromCmd(cmd)).concat(this.carret ? '|' : '', "'~~");
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
      cmds[this.name] = Command.makeBoolVarCmd(this.name);
    }
  }, {
    key: "writeFor",
    value: function writeFor(parser, obj) {
      if (parser.vars[this.name] != null) {
        obj[this.dataName] = !parser.vars[this.name];
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
      cmds[this.name] = Command.makeBoolVarCmd(this.name);
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

var Pos = require('./positioning/Pos').Pos;

var StrPos = require('./positioning/StrPos').StrPos;

var OptionalPromise = require('./helpers/OptionalPromise');

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
      throw new Error('Not Implemented');
    }
  }, {
    key: "textCharAt",
    value: function textCharAt(pos) {
      throw new Error('Not Implemented');
    }
  }, {
    key: "textLen",
    value: function textLen() {
      throw new Error('Not Implemented');
    }
  }, {
    key: "textSubstr",
    value: function textSubstr(start, end) {
      throw new Error('Not Implemented');
    }
  }, {
    key: "insertTextAt",
    value: function insertTextAt(text, pos) {
      throw new Error('Not Implemented');
    }
  }, {
    key: "spliceText",
    value: function spliceText(start, end, text) {
      throw new Error('Not Implemented');
    }
  }, {
    key: "getCursorPos",
    value: function getCursorPos() {
      throw new Error('Not Implemented');
    }
  }, {
    key: "setCursorPos",
    value: function setCursorPos(start) {
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      throw new Error('Not Implemented');
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
      this._lang = val;
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
      throw new Error('Not Implemented');
    }
  }, {
    key: "getMultiSel",
    value: function getMultiSel() {
      throw new Error('Not Implemented');
    }
  }, {
    key: "canListenToChange",
    value: function canListenToChange() {
      return false;
    }
  }, {
    key: "addChangeListener",
    value: function addChangeListener(callback) {
      throw new Error('Not Implemented');
    }
  }, {
    key: "removeChangeListener",
    value: function removeChangeListener(callback) {
      throw new Error('Not Implemented');
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
      p = this.findAnyNext(pos, ['\n'], -1);

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
      p = this.findAnyNext(pos, ['\n', '\r']);

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

/* eslint-disable no-undef */
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
      return (typeof console !== 'undefined' && console !== null ? console.log : null) != null && this.enabled && Logger.enabled;
    }
  }, {
    key: "runtime",
    value: function runtime(funct) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'function';
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

      obj[name] = function () {
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

Logger.enabled = true;
Logger.prototype.enabled = true;
Logger.prototype.monitorData = {};
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

      if (((ref = this[key]) != null ? ref.call : null) != null) {
        this[key](val);
      } else {
        this[key] = val;
      }
    }
  }, {
    key: "getOpt",
    value: function getOpt(key) {
      var ref;

      if (((ref = this[key]) != null ? ref.call : null) != null) {
        return this[key]();
      } else {
        return this[key];
      }
    }
  }, {
    key: "getOpts",
    value: function getOpts() {
      var _this = this;

      return Object.keys(this.defaults).reduce(function (opts, key) {
        opts[key] = _this.getOpt(key);
        return opts;
      }, {});
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

var CmdInstance = require('./CmdInstance').CmdInstance;

var BoxHelper = require('./BoxHelper').BoxHelper;

var ParamParser = require('./stringParsers/ParamParser').ParamParser;

var Pos = require('./positioning/Pos').Pos;

var StrPos = require('./positioning/StrPos').StrPos;

var Replacement = require('./positioning/Replacement').Replacement;

var StringHelper = require('./helpers/StringHelper').StringHelper;

var NamespaceHelper = require('./helpers/NamespaceHelper').NamespaceHelper;

var Command = require('./Command').Command;

var OptionalPromise = require('./helpers/OptionalPromise');

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
        this.closingPos = new StrPos(this.pos, this.str);
        this.pos = f.pos;
        this.str = f.str;
      }
    }
  }, {
    key: "_findOpeningPos",
    value: function _findOpeningPos() {
      var closing, cmdName, opening;
      cmdName = this._removeBracket(this.str).substring(this.codewave.closeChar.length);
      opening = this.codewave.brakets + cmdName;
      closing = this.str;
      var f = this.codewave.findMatchingPair(this.pos, opening, closing, -1);

      if (f) {
        f.str = this.codewave.editor.textSubstr(f.pos, this.codewave.findNextBraket(f.pos + f.str.length) + this.codewave.brakets.length);
        return f;
      }
    }
  }, {
    key: "_splitComponents",
    value: function _splitComponents() {
      var parts;
      parts = this.noBracket.split(' ');
      this.cmdName = parts.shift();
      this.rawParams = parts.join(' ');
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
          this.named[nameToParam] = this.cmdName;
        }
      }
    }
  }, {
    key: "_findClosing",
    value: function _findClosing() {
      var f = this._findClosingPos();

      if (f) {
        this.content = StringHelper.trimEmptyLine(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos));
        this.str = this.codewave.editor.textSubstr(this.pos, f.pos + f.str.length);
      }
    }
  }, {
    key: "_findClosingPos",
    value: function _findClosingPos() {
      var closing, opening;

      if (this.closingPos != null) {
        return this.closingPos;
      }

      closing = this.codewave.brakets + this.codewave.closeChar + this.cmdName + this.codewave.brakets;
      opening = this.codewave.brakets + this.cmdName;
      var f = this.codewave.findMatchingPair(this.pos + this.str.length, opening, closing);

      if (f) {
        this.closingPos = f;
        return this.closingPos;
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

      if (endPos >= max || (ref = this.codewave.editor.textSubstr(endPos, endPos + this.codewave.deco.length)) === ' ' || ref === '\n' || ref === '\r') {
        this.str = this.codewave.editor.textSubstr(this.pos, endPos);
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
        re1 = new RegExp("^\\s*".concat(ecl, "(?:").concat(ed, ")+\\s*(.*?)\\s*(?:").concat(ed, ")+").concat(ecr, "$"), 'gm');
        re2 = new RegExp("^\\s*(?:".concat(ed, ")*").concat(ecr, "\r?\n"));
        re3 = new RegExp("\n\\s*".concat(ecl, "(?:").concat(ed, ")*\\s*$"));
        this.content = this.content.replace(re1, '$1').replace(re2, '').replace(re3, '');
      }
    }
  }, {
    key: "_getParentCmds",
    value: function _getParentCmds() {
      var ref;
      this.parent = (ref = this.codewave.getEnclosingCmd(this.getEndPos())) != null ? ref.init() : null;
      return this.parent;
    }
  }, {
    key: "setMultiPos",
    value: function setMultiPos(multiPos) {
      this.multiPos = multiPos;
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
          this.cmd = Command.cmds.getCmd('core:no_execute');
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
      var cmdName = NamespaceHelper.split(this.cmdName)[1];
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

      if (this.isEmpty()) {
        if (this.codewave.closingPromp != null && this.codewave.closingPromp.whithinOpenBounds(this.pos + this.codewave.brakets.length) != null) {
          return this.codewave.closingPromp.cancel();
        } else {
          return this.replaceWith('');
        }
      } else if (this.cmd != null) {
        var beforeFunct = this.getOption('beforeExecute');

        if (beforeFunct) {
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
}(CmdInstance);

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

var Logger = require('./Logger').Logger;

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

/* eslint-disable no-undef */
var TextParser = require('./TextParser').TextParser;

var Pos = require('./positioning/Pos').Pos;

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

        timeout = setTimeout(function () {
          if (_this.onAnyChange != null) {
            return _this.onAnyChange(e);
          }
        }, 100);
      };

      if (target.addEventListener) {
        target.addEventListener('keydown', onkeydown);
        target.addEventListener('keyup', onkeyup);
        return target.addEventListener('keypress', onkeypress);
      } else if (target.attachEvent) {
        target.attachEvent('onkeydown', onkeydown);
        target.attachEvent('onkeyup', onkeyup);
        return target.attachEvent('onkeypress', onkeypress);
      }
    }
  }]);

  return DomKeyListener;
}();

exports.DomKeyListener = DomKeyListener;

isElement = function isElement(obj) {
  try {
    // Using W3 DOM2 (works for FF, Opera and Chrom)
    return obj instanceof HTMLElement;
  } catch (error) {
    // Browsers not supporting W3 DOM2 don't have HTMLElement and
    // an exception is thrown and we end up here. Testing some
    // properties that all elements have. (works on IE7)
    return _typeof(obj) === 'object' && obj.nodeType === 1 && _typeof(obj.style) === 'object' && _typeof(obj.ownerDocument) === 'object';
  }
};

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
      throw new Error('TextArea not found');
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
      this._skipChangeEvent += nb;
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
      return 'selectionStart' in this.obj;
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

          while (rng.compareEndPoints('EndToStart', rng) > 0) {
            len++;
            rng.moveEnd('character', -1);
          }

          rng.setEndPoint('StartToStart', this.obj.createTextRange());
          pos = new Pos(0, len);

          while (rng.compareEndPoints('EndToStart', rng) > 0) {
            pos.start++;
            pos.end++;
            rng.moveEnd('character', -1);
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
          _this3.obj.selectionEnd = end;
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
        rng.moveStart('character', start);
        rng.collapse();
        rng.moveEnd('character', end - start);
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

TextAreaEditor.prototype.startListening = DomKeyListener.prototype.startListening;
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

var Editor = require('./Editor').Editor;

var Pos = require('./positioning/Pos').Pos;

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
      return this.text(this.text().slice(0, start) + (text || '') + this.text().slice(end));
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

      this.target = new Pos(start, end);
      return this.target;
    }
  }]);

  return TextParser;
}(Editor);

exports.TextParser = TextParser;

},{"./Editor":9,"./positioning/Pos":37}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
Object.defineProperty(exports, 'Codewave', {
  enumerable: true,
  get: function get() {
    return Codewave;
  }
});

var Codewave = require('./Codewave').Codewave;

var Command = require('./Command').Command;

var CoreCommandProvider = require('./cmds/CoreCommandProvider').CoreCommandProvider;

var JsCommandProvider = require('./cmds/JsCommandProvider').JsCommandProvider;

var PhpCommandProvider = require('./cmds/PhpCommandProvider').PhpCommandProvider;

var HtmlCommandProvider = require('./cmds/HtmlCommandProvider').HtmlCommandProvider;

var FileCommandProvider = require('./cmds/FileCommandProvider').FileCommandProvider;

var StringCommandProvider = require('./cmds/StringCommandProvider').StringCommandProvider;

var Pos = require('./positioning/Pos').Pos;

var WrappedPos = require('./positioning/WrappedPos').WrappedPos;

var LocalStorageEngine = require('./storageEngines/LocalStorageEngine').LocalStorageEngine;

var Context = require('./Context').Context;

var CmdInstance = require('./CmdInstance').CmdInstance;

var CmdFinder = require('./CmdFinder').CmdFinder;

Context.cmdInstanceClass = CmdInstance;
Context.cmdFinderClass = CmdFinder;
Pos.wrapClass = WrappedPos;
Codewave.instances = [];
Command.providers = [new CoreCommandProvider(), new JsCommandProvider(), new PhpCommandProvider(), new HtmlCommandProvider(), new FileCommandProvider(), new StringCommandProvider()];

if (typeof localStorage !== 'undefined' && localStorage !== null) {
  Command.storage = new LocalStorageEngine();
}

},{"./CmdFinder":3,"./CmdInstance":4,"./Codewave":5,"./Command":6,"./Context":7,"./cmds/CoreCommandProvider":18,"./cmds/FileCommandProvider":19,"./cmds/HtmlCommandProvider":20,"./cmds/JsCommandProvider":21,"./cmds/PhpCommandProvider":22,"./cmds/StringCommandProvider":23,"./positioning/Pos":37,"./positioning/WrappedPos":42,"./storageEngines/LocalStorageEngine":44}],18:[function(require,module,exports){
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

var Command = require('../Command').Command;

var BaseCommand = require('../Command').BaseCommand;

var LangDetector = require('../detectors/LangDetector').LangDetector;

var AlwaysEnabled = require('../detectors/AlwaysEnabled').AlwaysEnabled;

var BoxHelper = require('../BoxHelper').BoxHelper;

var EditCmdProp = require('../EditCmdProp').EditCmdProp;

var StringHelper = require('../helpers/StringHelper').StringHelper;

var PathHelper = require('../helpers/PathHelper').PathHelper;

var Replacement = require('../positioning/Replacement').Replacement;

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
      core = cmds.addCmd(new Command('core'));
      cmds.addDetector(new AlwaysEnabled('core'));
      core.addDetector(new LangDetector());
      return core.addCmds({
        help: {
          replaceBox: true,
          result: help,
          parse: true,
          allowedNamed: ['cmd'],
          help: 'To get help on a pecific command, do :\n~~help hello~~ (hello being the command)',
          cmds: {
            overview: {
              replaceBox: true,
              result: '~~box~~\n~~quote_carret~~\n  ___         _   __      __\n / __|___  __| |__\\ \\    / /_ ___ ______\n/ /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/\n\\____\\___/\\__,_\\___|\\_/\\_/\\__,_|\\_/\\___|\nThe text editor helper\n~~/quote_carret~~\n\nWhen using Codewave you will be writing commands within \nyour text editor. These commands must be placed between two \npairs of "~" (tilde) and then, they can be executed by pressing \n"ctrl"+"shift"+"e", with your cursor inside the command\nEx: ~~!hello~~\n\nYou dont need to actually type any "~" (tilde). \nPressing "ctrl"+"shift"+"e" will add them if you are not already\nwithin a command.\n\nCodewave does not use UI to display any information. \nInstead, it uses text within code comments to mimic UIs. \nThe generated comment blocks will be referred to as windows \nin the help sections.\n\nTo close this window (i.e. remove this comment block), press \n"ctrl"+"shift"+"e" with your cursor on the line bellow.\n~~!close|~~\n\nUse the following command for a walkthrough of some of the many\nfeatures of Codewave\n~~!help:get_started~~ or ~~!help:demo~~\n\nList of all help subjects \n~~!help:subjects~~ or ~~!help:sub~~ \n\n~~!close~~\n~~/box~~'
            },
            subjects: {
              replaceBox: true,
              result: '~~box~~\n~~!help~~\n~~!help:get_started~~ (~~!help:demo~~)\n~~!help:subjects~~ (~~!help:sub~~)\n~~!help:editing~~ (~~!help:edit~~)\n~~!close|~~\n~~/box~~'
            },
            sub: {
              aliasOf: 'core:help:subjects'
            },
            get_started: {
              replaceBox: true,
              result: '~~box~~\nThe classic Hello World.\n~~!hello|~~\n\n~~help:editing:intro~~\n~~quote_carret~~\n\nFor more information on creating your own commands, see:\n~~!help:editing~~\n\nCodewave comes with many pre-existing commands. Here is an example\nof JavaScript abbreviations\n~~!js:f~~\n~~!js:if~~\n  ~~!js:log~~"~~!hello~~"~~!/js:log~~\n~~!/js:if~~\n~~!/js:f~~\n\nCodeWave comes with the excellent Emmet ( http://emmet.io/ ) to \nprovide event more abbreviations. Emmet abbreviations will be \nused automatically if you are in a HTML or CSS file.\n~~!ul>li~~ (if you are in a html doccument)\n~~!emmet ul>li~~\n~~!emmet m2 css~~\n\nCommands are stored in namespaces. The same command can have \ndifferent results depending on the namespace.\n~~!js:each~~\n~~!php:outer:each~~\n~~!php:inner:each~~\n\nSome of the namespaces are active depending on the context. The\nfollowing commands are the same and will display the currently\nactive namespace. The first command command works because the \ncore namespace is active.\n~~!namespace~~\n~~!core:namespace~~\n\nYou can make a namespace active with the following command.\n~~!namespace php~~\n\nCheck the namespaces again\n~~!namespace~~\n\nIn addition to detecting the document type, Codewave can detect the\ncontext from the surrounding text. In a PHP file, it means Codewave \nwill add the PHP tags when you need them.\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~'
            },
            demo: {
              aliasOf: 'core:help:get_started'
            },
            editing: {
              cmds: {
                intro: {
                  result: 'Codewave allows you to make your own commands (or abbreviations) \nput your content inside "source" the do "save". Try adding any \ntext that is on your mind.\n~~!edit my_new_command|~~\n\nIf you did the last step right, you should see your text when you\ndo the following command. It is now saved and you can use it \nwhenever you want.\n~~!my_new_command~~'
                }
              },
              replaceBox: true,
              result: "~~box~~\n~~help:editing:intro~~\n\nAll the windows of Codewave are made with the command \"box\". \nThey are meant to display text that should not remain in your code. \nThey are valid comments so they won't break your code and the command \n\"close\" can be used to remove them rapidly. You can make your own \ncommands with them if you need to display some text temporarily.\n~~!box~~\nThe box will scale with the content you put in it\n~~!close|~~\n~~!/box~~\n\n~~quote_carret~~\nWhen you create a command, you may want to specify where the cursor \nwill be located once the command is expanded. To do that, use a \"|\" \n(Vertical bar). Use 2 of them if you want to print the actual \ncharacter.\n~~!box~~\none : | \ntwo : ||\n~~!/box~~\n\nYou can also use the \"escape_pipes\" command that will escape any \nvertical bars that are between its opening and closing tags\n~~!escape_pipes~~\n|\n~~!/escape_pipes~~\n\nCommands inside other commands will be expanded automatically.\nIf you want to print a command without having it expand when \nthe parent command is expanded, use a \"!\" (exclamation mark).\n~~!!hello~~\n\nFor commands that have both an opening and a closing tag, you can use\nthe \"content\" command. \"content\" will be replaced with the text\nthat is between the tags. Here is an example of how it can be used.\n~~!edit php:inner:if~~\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
            },
            edit: {
              aliasOf: 'core:help:editing'
            },
            not_found: '~~box~~\nCommand not found\n~~!close|~~\n~~/box~~'
          }
        },
        no_execute: {
          result: no_execute,
          help: 'Prevent everything inside the open and close tag from executing'
        },
        escape_pipes: {
          result: quote_carret,
          checkCarret: false,
          help: 'Escape all carrets (from "|" to "||")'
        },
        quote_carret: {
          aliasOf: 'core:escape_pipes'
        },
        exec_parent: {
          execute: exec_parent,
          help: "Execute the first command that wrap this in it's open and close tag"
        },
        content: {
          result: getContent,
          help: 'Mainly used for command edition, \nthis will return what was between the open and close tag of a command'
        },
        box: {
          cls: BoxCmd,
          help: "Create the apparence of a box composed from characters. \nUsually wrapped in a comment.\n\nThe box will try to ajust it's size from the content"
        },
        close: {
          cls: CloseCmd,
          help: 'Will close the first box around this'
        },
        param: {
          result: getParam,
          help: 'Mainly used for command edition, \nthis will return a parameter from this command call\n\nYou can pass a number, a string, or both. \nA number for a positioned argument and a string\nfor a named parameter'
        },
        edit: {
          cmds: EditCmd.setCmds({
            save: {
              aliasOf: 'core:exec_parent'
            }
          }),
          cls: EditCmd,
          allowedNamed: ['cmd'],
          help: 'Allows to edit a command. \nSee ~~!help:editing~~ for a quick tutorial'
        },
        rename: {
          cmds: {
            not_applicable: '~~box~~\nYou can only rename commands that you created yourself.\n~~!close|~~\n~~/box~~',
            not_found: '~~box~~\nCommand not found\n~~!close|~~\n~~/box~~'
          },
          result: renameCommand,
          parse: true,
          allowedNamed: ['from', 'to'],
          help: "Allows to rename a command and change it's namespace. \nYou can only rename commands that you created yourself.\n- The first param is the old name\n- Then second param is the new name, if it has no namespace,\n  it will use the one from the original command.\n\nex.: ~~!rename my_command my_command2~~"
        },
        remove: {
          cmds: {
            not_applicable: '~~box~~\nYou can only remove commands that you created yourself.\n~~!close|~~\n~~/box~~',
            not_found: '~~box~~\nCommand not found\n~~!close|~~\n~~/box~~'
          },
          result: removeCommand,
          parse: true,
          allowedNamed: ['cmd'],
          help: 'Allows to remove a command. \nYou can only remove commands that you created yourself.'
        },
        alias: {
          cmds: {
            not_found: '~~box~~\nCommand not found\n~~!close|~~\n~~/box~~'
          },
          result: aliasCommand,
          parse: true
        },
        namespace: {
          cls: NameSpaceCmd,
          help: 'Show the current namespaces.\n\nA name space could be the name of the language\nor other kind of contexts\n\nIf you pass a param to this command, it will \nadd the param as a namespace for the current editor'
        },
        nspc: {
          aliasOf: 'core:namespace'
        },
        list: {
          result: listCommand,
          allowedNamed: ['name', 'box', 'context'],
          replaceBox: true,
          parse: true,
          help: 'List available commands\n\nYou can use the first argument to choose a specific namespace, \nby default all curent namespace will be shown'
        },
        ls: {
          aliasOf: 'core:list'
        },
        get: {
          result: getCommand,
          allowedNamed: ['name'],
          help: 'output the value of a variable'
        },
        set: {
          result: setCommand,
          allowedNamed: ['name', 'value', 'val'],
          help: 'set the value of a variable'
        },
        store_json: {
          result: storeJsonCommand,
          allowedNamed: ['name', 'json'],
          help: 'set a variable with some json data'
        },
        json: {
          aliasOf: 'core:store_json'
        },
        template: {
          cls: TemplateCmd,
          allowedNamed: ['name', 'sep'],
          help: 'render a template for a variable\n\nIf the first param is not set it will use all variables \nfor the render\nIf the variable is an array the template will be repeated \nfor each items\nThe `sep` param define what will separate each item \nand default to a line break'
        },
        emmet: {
          cls: EmmetCmd,
          help: 'CodeWave comes with the excellent Emmet ( http://emmet.io/ ) to \nprovide event more abbreviations.\n\nPass the Emmet abbreviation as a param to expend it.'
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
      text = helpCmd ? "~~".concat(helpCmd.fullName, "~~") : 'This command has no help text';
      subcommands = cmd.cmds.length ? "\nSub-Commands :\n~~ls ".concat(cmd.fullName, " box:no context:no~~") : '';
      return "~~box~~\nHelp for ~~!".concat(cmd.fullName, "~~ :\n\n").concat(text, "\n").concat(subcommands, "\n\n~~!close|~~\n~~/box~~");
    } else {
      return '~~not_found~~';
    }
  } else {
    return '~~help:overview~~';
  }
};

no_execute = function no_execute(instance) {
  var reg;
  reg = new RegExp('^(' + StringHelper.escapeRegExp(instance.codewave.brakets) + ')' + StringHelper.escapeRegExp(instance.codewave.noExecuteChar));
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
  var affixesEmpty = instance.getParam(['affixes_empty'], false);
  var prefix = instance.getParam(['prefix'], '');
  var suffix = instance.getParam(['suffix'], '');

  if (instance.codewave.inInstance != null) {
    return prefix + (instance.codewave.inInstance.content || '') + suffix;
  }

  if (affixesEmpty) {
    return prefix + suffix;
  }
};

renameCommand = function renameCommand(instance) {
  var storage = Command.storage;
  return Promise.resolve().then(function () {
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
        Command.cmds.setCmdData(newName, cmdData);
        cmd.unregister();
        savedCmds[newName] = cmdData;
        delete savedCmds[origninalName];
        return Promise.resolve().then(function () {
          return storage.save('cmds', savedCmds);
        }).then(function () {
          return '';
        });
      } else if (cmd != null) {
        return '~~not_applicable~~';
      } else {
        return '~~not_found~~';
      }
    }
  });
};

removeCommand = function removeCommand(instance) {
  return Promise.resolve().then(function () {
    var name = instance.getParam([0, 'cmd']);
    var storage = Command.storage;

    if (name != null) {
      return Promise.resolve().then(function () {
        return storage.load('cmds');
      }).then(function (savedCmds) {
        var cmd = instance.context.getParentOrRoot().getCmd(name);

        if (savedCmds[name] != null && cmd != null) {
          cmd.unregister();
          delete savedCmds[name];
          return Promise.resolve().then(function () {
            return storage.save('cmds', savedCmds);
          }).then(function () {
            return '';
          });
        } else if (cmd != null) {
          return '~~not_applicable~~';
        } else {
          return '~~not_found~~';
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

      Command.saveCmd(alias, {
        aliasOf: cmd.fullName
      });
      return '';
    } else {
      return '~~not_found~~';
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
  }).concat('_root');
  context = useContext ? instance.context.getParentOrRoot() : instance.codewave.getRoot().context;
  commands = namespaces.reduce(function (commands, nspc) {
    var cmd;
    cmd = nspc === '_root' ? Command.cmds : context.getCmd(nspc, {
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
  }).join('\n') : 'This contains no sub-commands';

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

  if (_typeof(res) === 'object') {
    return JSON.stringify(res, null, '  ');
  } else {
    return res;
  }
};

setCommand = function setCommand(instance) {
  var name, p, val;
  name = instance.getParam([0, 'name']);
  val = (p = instance.getParam([1, 'value', 'val'])) != null ? p : instance.content ? instance.content : null;
  PathHelper.setPath(instance.codewave.vars, name, val);
  return '';
};

storeJsonCommand = function storeJsonCommand(instance) {
  var name, p, val;
  name = instance.getParam([0, 'name']);
  val = (p = instance.getParam([1, 'json'])) != null ? p : instance.content ? instance.content : null;
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
function (_BaseCommand) {
  _inherits(BoxCmd, _BaseCommand);

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
        this.helper.closeText = this.instance.codewave.brakets + this.instance.codewave.closeChar + this.cmd.split(' ')[0] + this.instance.codewave.brakets;
      }

      this.helper.deco = this.instance.codewave.deco;
      this.helper.pad = 2;
      this.helper.prefix = this.instance.getParam(['prefix'], '');
      this.helper.suffix = this.instance.getParam(['suffix'], '');
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
}(BaseCommand);

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
      this.helper = new BoxHelper(this.instance.context);
    }
  }, {
    key: "execute",
    value: function execute() {
      var prefix = this.helper.prefix = this.instance.getParam(['prefix'], '');
      var suffix = this.helper.suffix = this.instance.getParam(['suffix'], '');
      var box = this.helper.getBoxForPos(this.instance.getPos());
      var requiredAffixes = this.instance.getParam(['required_affixes'], true);

      if (!requiredAffixes) {
        this.helper.prefix = this.helper.suffix = '';
        var box2 = this.helper.getBoxForPos(this.instance.getPos());

        if (box2 != null && (box == null || box.start < box2.start - prefix.length || box.end > box2.end + suffix.length)) {
          box = box2;
        }
      }

      if (box != null) {
        var depth = this.helper.getNestedLvl(this.instance.getPos().start);

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
}(BaseCommand);

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
        this.finder = this.instance.context.getParentOrRoot().getFinder(this.cmdName);
        this.finder.useFallbacks = false;
        this.cmd = this.finder.find();
      }

      this.editable = this.cmd != null ? this.cmd.isEditable() : true;
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

      Command.saveCmd(this.cmdName, data);
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
      }).join('\n');
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
}(BaseCommand);

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
function (_BaseCommand4) {
  _inherits(NameSpaceCmd, _BaseCommand4);

  function NameSpaceCmd() {
    _classCallCheck(this, NameSpaceCmd);

    return _possibleConstructorReturn(this, _getPrototypeOf(NameSpaceCmd).apply(this, arguments));
  }

  _createClass(NameSpaceCmd, [{
    key: "init",
    value: function init() {
      this.name = this.instance.getParam([0]);
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
}(BaseCommand);

TemplateCmd =
/*#__PURE__*/
function (_BaseCommand5) {
  _inherits(TemplateCmd, _BaseCommand5);

  function TemplateCmd() {
    _classCallCheck(this, TemplateCmd);

    return _possibleConstructorReturn(this, _getPrototypeOf(TemplateCmd).apply(this, arguments));
  }

  _createClass(TemplateCmd, [{
    key: "init",
    value: function init() {
      this.name = this.instance.getParam([0, 'name']);
      this.sep = this.instance.getParam(['sep'], '\n');
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
      parser.vars = _typeof(data) === 'object' ? data : {
        value: data
      };
      parser.checkCarret = false;
      return parser.parseAll();
    }
  }]);

  return TemplateCmd;
}(BaseCommand);

EmmetCmd =
/*#__PURE__*/
function (_BaseCommand6) {
  _inherits(EmmetCmd, _BaseCommand6);

  function EmmetCmd() {
    _classCallCheck(this, EmmetCmd);

    return _possibleConstructorReturn(this, _getPrototypeOf(EmmetCmd).apply(this, arguments));
  }

  _createClass(EmmetCmd, [{
    key: "init",
    value: function init() {
      this.abbr = this.instance.getParam([0, 'abbr', 'abbreviation']);
      this.lang = this.instance.getParam([1, 'lang', 'language']);
    }
  }, {
    key: "getEmmet",
    value: function getEmmet() {
      if (typeof window !== 'undefined' && window !== null && window.emmet != null) {
        return window.emmet;
      } else if (typeof window !== 'undefined' && window !== null && window.self !== null && window.self.emmet != null) {
        return window.self.emmet;
      } else if (typeof window !== 'undefined' && window !== null && window.global !== null && window.global.emmet != null) {
        return window.global.emmet;
      } else if (typeof require !== 'undefined' && require !== null) {
        try {
          return require('emmet');
        } catch (error) {
          this.instance.codewave.logger.log('Emmet is not available, it may need to be installed manually');
          return null;
        }
      }
    }
  }, {
    key: "result",
    value: function result() {
      var emmet = this.getEmmet();

      if (emmet != null) {
        // emmet.require('./parser/abbreviation').expand('ul>li', {pastedContent:'lorem'})
        var res = emmet.expandAbbreviation(this.abbr, this.lang);
        return res.replace(/\$\{0\}/g, '|');
      }
    }
  }]);

  return EmmetCmd;
}(BaseCommand);

},{"../BoxHelper":1,"../Command":6,"../EditCmdProp":8,"../detectors/AlwaysEnabled":24,"../detectors/LangDetector":26,"../helpers/PathHelper":33,"../helpers/StringHelper":34,"../positioning/Replacement":39,"emmet":"emmet"}],19:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Command = require('../Command').Command;

var BoxHelper = require('../BoxHelper').BoxHelper;

var EditCmdProp = require('../EditCmdProp').EditCmdProp;

var StringHelper = require('../helpers/StringHelper').StringHelper;

var PathHelper = require('../helpers/PathHelper').PathHelper;

var Replacement = require('../positioning/Replacement').Replacement;

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
      core = cmds.addCmd(new Command('file'));
      return core.addCmds({
        read: {
          result: readCommand,
          allowedNamed: ['file'],
          help: 'read the content of a file'
        },
        write: {
          result: writeCommand,
          allowedNamed: ['file', 'content'],
          help: 'save into a file'
        },
        "delete": {
          result: deleteCommand,
          allowedNamed: ['file'],
          help: 'delete a file'
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

var Command = require('../Command').Command;

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
      html = cmds.addCmd(new Command('html'));
      html.addCmds({
        fallback: {
          aliasOf: 'core:emmet',
          defaults: {
            lang: 'html'
          },
          nameToParam: 'abbr'
        }
      });
      css = cmds.addCmd(new Command('css'));
      return css.addCmds({
        fallback: {
          aliasOf: 'core:emmet',
          defaults: {
            lang: 'css'
          },
          nameToParam: 'abbr'
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

var Command = require('../Command').Command;

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
      js = cmds.addCmd(new Command('js'));
      cmds.addCmd(new Command('javascript', {
        aliasOf: 'js'
      }));
      return js.addCmds({
        comment: '/* ~~content~~ */',
        "if": 'if(|){\n\t~~content~~\n}',
        log: 'if(window.console){\n\tconsole.log(~~content~~|)\n}',
        "function": 'function |() {\n\t~~content~~\n}',
        funct: {
          aliasOf: 'js:function'
        },
        f: {
          aliasOf: 'js:function'
        },
        "for": 'for (var i = 0; i < |; i++) {\n\t~~content~~\n}',
        forin: 'for (var val in |) {\n\t~~content~~\n}',
        each: {
          aliasOf: 'js:forin'
        },
        foreach: {
          aliasOf: 'js:forin'
        },
        "while": 'while(|) {\n\t~~content~~\n}',
        whilei: 'var i = 0;\nwhile(|) {\n\t~~content~~\n\ti++;\n}',
        ifelse: 'if( | ) {\n\t~~content~~\n} else {\n\t\n}',
        ife: {
          aliasOf: 'js:ifelse'
        },
        "switch": 'switch( | ) { \n\tcase :\n\t\t~~content~~\n\t\tbreak;\n\tdefault :\n\t\t\n\t\tbreak;\n}'
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

var StringHelper = require('../helpers/StringHelper').StringHelper;

var Command = require('../Command').Command;

var PairDetector = require('../detectors/PairDetector').PairDetector;

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
      php = cmds.addCmd(new Command('php'));
      php.addDetector(new PairDetector({
        result: 'php:inner',
        opener: '<?php',
        closer: '?>',
        optionnal_end: true,
        "else": 'php:outer'
      }));
      phpOuter = php.addCmd(new Command('outer'));
      phpOuter.addCmds({
        fallback: {
          cmds: {
            any_content: {
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
        box: {
          aliasOf: 'core:box',
          defaults: {
            prefix: '<?php\n',
            suffix: '\n?>'
          }
        },
        comment: '/* ~~content~~ */',
        php: '<?php\n\t~~content~~|\n?>'
      });
      phpInner = php.addCmd(new Command('inner'));
      return phpInner.addCmds({
        any_content: {
          aliasOf: 'core:content'
        },
        comment: '/* ~~content~~ */',
        "if": 'if(|){\n\t~~any_content~~\n}',
        info: 'phpinfo();',
        echo: 'echo |',
        e: {
          aliasOf: 'php:inner:echo'
        },
        "class": {
          result: 'class ~~param 0 class def:|~~ {\n\tfunction __construct() {\n\t\t~~content~~|\n\t}\n}',
          defaults: {
            inline: false
          }
        },
        c: {
          aliasOf: 'php:inner:class'
        },
        "function": {
          result: 'function |() {\n\t~~content~~\n}',
          defaults: {
            inline: false
          }
        },
        funct: {
          aliasOf: 'php:inner:function'
        },
        f: {
          aliasOf: 'php:inner:function'
        },
        array: '$| = array();',
        a: 'array()',
        "for": 'for ($i = 0; $i < $|; $i++) {\n\t~~any_content~~\n}',
        foreach: 'foreach ($| as $key => $val) {\n\t~~any_content~~\n}',
        each: {
          aliasOf: 'php:inner:foreach'
        },
        "while": 'while(|) {\n\t~~any_content~~\n}',
        whilei: {
          result: '$i = 0;\nwhile(|) {\n\t~~any_content~~\n\t$i++;\n}',
          defaults: {
            inline: false
          }
        },
        ifelse: 'if( | ) {\n\t~~any_content~~\n} else {\n\t\n}',
        ife: {
          aliasOf: 'php:inner:ifelse'
        },
        "switch": {
          result: 'switch( | ) { \n\tcase :\n\t\t~~any_content~~\n\t\tbreak;\n\tdefault :\n\t\t\n\t\tbreak;\n}',
          defaults: {
            inline: false
          }
        },
        close: {
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

var Command = require('../Command').Command;

var AlwaysEnabled = require('../detectors/AlwaysEnabled').AlwaysEnabled;

var inflection = interopRequireWildcard(require('inflection'));

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
      cmds = root.addCmd(new Command('string'));
      root.addCmd(new Command('str', {
        aliasOf: 'string'
      }));
      root.addDetector(new AlwaysEnabled('string'));
      return cmds.addCmds({
        pluralize: {
          result: function result(instance) {
            return inflection.pluralize(instance.getParam([0, 'str']));
          },
          allowedNamed: ['str'],
          help: 'Pluralize a string'
        },
        singularize: {
          result: function result(instance) {
            return inflection.singularize(instance.getParam([0, 'str']));
          },
          allowedNamed: ['str'],
          help: 'Singularize a string'
        },
        camelize: {
          result: function result(instance) {
            return inflection.camelize(instance.getParam([0, 'str']), !instance.getBoolParam([1, 'first'], true));
          },
          allowedNamed: ['str', 'first'],
          help: 'Transforms a String from underscore to camelcase'
        },
        underscore: {
          result: function result(instance) {
            return inflection.underscore(instance.getParam([0, 'str']), instance.getBoolParam([1, 'upper']));
          },
          allowedNamed: ['str', 'upper'],
          help: 'Transforms a String from camelcase to underscore.'
        },
        humanize: {
          result: function result(instance) {
            return inflection.humanize(instance.getParam([0, 'str']), instance.getBoolParam([1, 'first']));
          },
          allowedNamed: ['str', 'first'],
          help: 'Transforms a String to a human readable format'
        },
        capitalize: {
          result: function result(instance) {
            return inflection.capitalize(instance.getParam([0, 'str']));
          },
          allowedNamed: ['str'],
          help: 'Make the first letter of a string upper'
        },
        dasherize: {
          result: function result(instance) {
            return inflection.dasherize(instance.getParam([0, 'str']));
          },
          allowedNamed: ['str'],
          help: 'Replaces underscores with dashes in a string.'
        },
        titleize: {
          result: function result(instance) {
            return inflection.titleize(instance.getParam([0, 'str']));
          },
          allowedNamed: ['str'],
          help: 'Transforms a String to a human readable format with most words capitalized'
        },
        tableize: {
          result: function result(instance) {
            return inflection.tableize(instance.getParam([0, 'str']));
          },
          allowedNamed: ['str'],
          help: 'Transforms a String to a table format'
        },
        classify: {
          result: function result(instance) {
            return inflection.classify(instance.getParam([0, 'str']));
          },
          allowedNamed: ['str'],
          help: 'Transforms a String to a class format'
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

var Detector = require('./Detector').Detector;

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

var Detector = require('./Detector').Detector;

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

var Pair = require('../positioning/Pair').Pair;

var Detector = require('./Detector').Detector;

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
'use strict';

var bootstrap = require('./bootstrap');

var TextAreaEditor = require('./TextAreaEditor');

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

      if ((xs != null ? xs.length : null) > 0) {
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

      if (fullname.indexOf(':') === -1 && !isSpace) {
        return [null, fullname];
      }

      parts = fullname.split(':');
      return [parts.shift(), parts.join(':') || null];
    }
  }, {
    key: "split",
    value: function split(fullname) {
      var name, parts;

      if (fullname.indexOf(':') === -1) {
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
        return typeof cur === 'undefined';
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
      var target = parts.reduce(function (cur, part) {
        if (cur[part] == null) {
          cur[part] = {};
        }

        return cur[part];
      }, obj);
      target[last] = val;
      return val;
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

var Size = require('../positioning/Size').Size;

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
      return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
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
      lines = txt.replace(/\r/g, '').split('\n');
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
        return text.replace(reg, '\n' + this.repeat(spaces, nb));
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
      return txt.split('').reverse().join('');
    }
  }, {
    key: "removeCarret",
    value: function removeCarret(txt) {
      var carretChar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '|';
      var reCarret, reQuoted, reTmp, tmp;
      tmp = '[[[[quoted_carret]]]]';
      reCarret = new RegExp(this.escapeRegExp(carretChar), 'g');
      reQuoted = new RegExp(this.escapeRegExp(carretChar + carretChar), 'g');
      reTmp = new RegExp(this.escapeRegExp(tmp), 'g');
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
      reQuoted = new RegExp(this.escapeRegExp(carretChar + carretChar), 'g');
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

var Pos = require('./Pos').Pos;

var StringHelper = require('../helpers/StringHelper').StringHelper;

var PairMatch = require('./PairMatch').PairMatch;

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
      return Object.keys(this.matchAnyParts());
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
      var match, res; // eslint-disable-next-line no-cond-assign

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
        if (typeof _name === 'undefined' || _name === null) {
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
      var WrapClass = Pos.wrapClass;
      return new WrapClass(this.start - prefix.length, this.start, this.end, this.end + suffix.length);
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

var Wrapping = require('./Wrapping').Wrapping;

var Replacement = require('./Replacement').Replacement;

var CommonHelper = require('../helpers/CommonHelper').CommonHelper;

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

var Pos = require('./Pos').Pos;

var CommonHelper = require('../helpers/CommonHelper').CommonHelper;

var OptionObject = require('../OptionObject').OptionObject;

var StringHelper = require('../helpers/StringHelper').StringHelper;

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

CommonHelper.applyMixins(Replacement.prototype, [OptionObject]);
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

var Pos = require('./Pos').Pos;

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
      this.end = this.innerEnd + suffixLen;
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

var Replacement = require('./Replacement').Replacement;

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
          results.push(null);
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

/* eslint-disable no-undef */
var LocalStorageEngine =
/*#__PURE__*/
function () {
  function LocalStorageEngine() {
    _classCallCheck(this, LocalStorageEngine);
  }

  _createClass(LocalStorageEngine, [{
    key: "save",
    value: function save(key, val) {
      if (typeof localStorage !== 'undefined' && localStorage !== null) {
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
      if (typeof localStorage !== 'undefined' && localStorage !== null) {
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
    this.content = '';
  }

  _createClass(Context, [{
    key: "onStart",
    value: function onStart() {
      this.startAt = this.parser.pos;
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
    value: function testContext(ContextType) {
      if (ContextType.test(this.parser["char"], this)) {
        return this.parser.setContext(new ContextType(this.parser, this));
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

var Context = require('./Context').Context;

var EscapeContext =
/*#__PURE__*/
function (_Context) {
  _inherits(EscapeContext, _Context);

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
}(Context);

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

var ParamContext = require('./ParamContext').ParamContext;

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
      this.name = this.parent.content;
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      this.parser.named[this.name] = this.content;
    }
  }], [{
    key: "test",
    value: function test(_char, parent) {
      return _char === ':' && (parent.parser.options.allowedNamed == null || parent.parser.options.allowedNamed.indexOf(parent.content) >= 0);
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

var Context = require('./Context').Context;

var StringContext = require('./StringContext').StringContext;

var VariableContext = require('./VariableContext').VariableContext;

var ParamContext =
/*#__PURE__*/
function (_Context) {
  _inherits(ParamContext, _Context);

  function ParamContext() {
    _classCallCheck(this, ParamContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(ParamContext).apply(this, arguments));
  }

  _createClass(ParamContext, [{
    key: "onChar",
    value: function onChar(_char) {
      if (this.testContext(StringContext)) {} else if (this.testContext(ParamContext.named)) {} else if (this.testContext(VariableContext)) {} else if (_char === ' ') {
        this.parser.setContext(new ParamContext(this.parser));
      } else {
        this.content += _char;
      }
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      this.parser.params.push(this.content);
    }
  }]);

  return ParamContext;
}(Context);

exports.ParamContext = ParamContext;

},{"./Context":45,"./StringContext":50,"./VariableContext":51}],49:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ParamContext = require('./ParamContext').ParamContext;

var NamedContext = require('./NamedContext').NamedContext;

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

      if (oldContext != null && oldContext !== (context != null ? context.parent : null)) {
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
      this.pos += nb;
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

var Context = require('./Context').Context;

var EscapeContext = require('./EscapeContext').EscapeContext;

var VariableContext = require('./VariableContext').VariableContext;

var StringContext =
/*#__PURE__*/
function (_Context) {
  _inherits(StringContext, _Context);

  function StringContext() {
    _classCallCheck(this, StringContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(StringContext).apply(this, arguments));
  }

  _createClass(StringContext, [{
    key: "onChar",
    value: function onChar(_char) {
      if (this.testContext(EscapeContext)) {} else if (this.testContext(VariableContext)) {} else if (StringContext.isDelimiter(_char)) {
        this.end();
      } else {
        this.content += _char;
      }
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      this.parent.content += this.content;
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
}(Context);

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

var Context = require('./Context').Context;

var VariableContext =
/*#__PURE__*/
function (_Context) {
  _inherits(VariableContext, _Context);

  function VariableContext() {
    _classCallCheck(this, VariableContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(VariableContext).apply(this, arguments));
  }

  _createClass(VariableContext, [{
    key: "onStart",
    value: function onStart() {
      this.parser.skip();
    }
  }, {
    key: "onChar",
    value: function onChar(_char) {
      if (_char === '}') {
        this.end();
      } else {
        this.content += _char;
      }
    }
  }, {
    key: "onEnd",
    value: function onEnd() {
      var ref;
      this.parent.content += ((ref = this.parser.options.vars) != null ? ref[this.content] : null) || '';
    }
  }], [{
    key: "test",
    value: function test(_char2, parent) {
      return parent.parser.take(2) === '#{';
    }
  }]);

  return VariableContext;
}(Context);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmpzIiwibGliL0Nsb3NpbmdQcm9tcC5qcyIsImxpYi9DbWRGaW5kZXIuanMiLCJsaWIvQ21kSW5zdGFuY2UuanMiLCJsaWIvQ29kZXdhdmUuanMiLCJsaWIvQ29tbWFuZC5qcyIsImxpYi9Db250ZXh0LmpzIiwibGliL0VkaXRDbWRQcm9wLmpzIiwibGliL0VkaXRvci5qcyIsImxpYi9Mb2dnZXIuanMiLCJsaWIvT3B0aW9uT2JqZWN0LmpzIiwibGliL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsImxpYi9Qcm9jZXNzLmpzIiwibGliL1N0b3JhZ2UuanMiLCJsaWIvVGV4dEFyZWFFZGl0b3IuanMiLCJsaWIvVGV4dFBhcnNlci5qcyIsImxpYi9ib290c3RyYXAuanMiLCJsaWIvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwibGliL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXIuanMiLCJsaWIvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1BocENvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZC5qcyIsImxpYi9kZXRlY3RvcnMvRGV0ZWN0b3IuanMiLCJsaWIvZGV0ZWN0b3JzL0xhbmdEZXRlY3Rvci5qcyIsImxpYi9kZXRlY3RvcnMvUGFpckRldGVjdG9yLmpzIiwibGliL2VudHJ5LmpzIiwibGliL2hlbHBlcnMvQXJyYXlIZWxwZXIuanMiLCJsaWIvaGVscGVycy9Db21tb25IZWxwZXIuanMiLCJsaWIvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCJsaWIvaGVscGVycy9PcHRpb25hbFByb21pc2UuanMiLCJsaWIvaGVscGVycy9QYXRoSGVscGVyLmpzIiwibGliL2hlbHBlcnMvU3RyaW5nSGVscGVyLmpzIiwibGliL3Bvc2l0aW9uaW5nL1BhaXIuanMiLCJsaWIvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwibGliL3Bvc2l0aW9uaW5nL1Bvcy5qcyIsImxpYi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmpzIiwibGliL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwibGliL3Bvc2l0aW9uaW5nL1NpemUuanMiLCJsaWIvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwibGliL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCJsaWIvcG9zaXRpb25pbmcvV3JhcHBpbmcuanMiLCJsaWIvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIiwibGliL3N0cmluZ1BhcnNlcnMvQ29udGV4dC5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL0VzY2FwZUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9OYW1lZENvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlci5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL1N0cmluZ0NvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9WYXJpYWJsZUNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvaW5mbGVjdGlvbi9saWIvaW5mbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQ0EsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUFELENBQVAsQ0FBa0MsWUFBdkQ7O0FBRUEsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQVAsQ0FBaUMsV0FBckQ7O0FBRUEsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQVAsQ0FBOEIsSUFBM0M7O0FBRUEsSUFBSSxTQUFTO0FBQUE7QUFBQTtBQUNYLHFCQUFhLE9BQWIsRUFBb0M7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IEFycmF5SGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL0FycmF5SGVscGVyJykuQXJyYXlIZWxwZXJcblxuY29uc3QgUGFpciA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUGFpcicpLlBhaXJcblxudmFyIEJveEhlbHBlciA9IGNsYXNzIEJveEhlbHBlciB7XG4gIGNvbnN0cnVjdG9yIChjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIga2V5LCByZWYsIHZhbFxuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogdGhpcy5jb250ZXh0LmNvZGV3YXZlLmRlY28sXG4gICAgICBwYWQ6IDIsXG4gICAgICB3aWR0aDogNTAsXG4gICAgICBoZWlnaHQ6IDMsXG4gICAgICBvcGVuVGV4dDogJycsXG4gICAgICBjbG9zZVRleHQ6ICcnLFxuICAgICAgcHJlZml4OiAnJyxcbiAgICAgIHN1ZmZpeDogJycsXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0c1xuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9uZSAodGV4dCkge1xuICAgIHZhciBrZXksIG9wdCwgcmVmLCB2YWxcbiAgICBvcHQgPSB7fVxuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHNcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV1cbiAgICAgIG9wdFtrZXldID0gdGhpc1trZXldXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0LCBvcHQpXG4gIH1cblxuICBkcmF3ICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRTZXAoKSArICdcXG4nICsgdGhpcy5saW5lcyh0ZXh0KSArICdcXG4nICsgdGhpcy5lbmRTZXAoKVxuICB9XG5cbiAgd3JhcENvbW1lbnQgKHN0cikge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnQoc3RyKVxuICB9XG5cbiAgc2VwYXJhdG9yICgpIHtcbiAgICB2YXIgbGVuXG4gICAgbGVuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMud3JhcENvbW1lbnQodGhpcy5kZWNvTGluZShsZW4pKVxuICB9XG5cbiAgc3RhcnRTZXAgKCkge1xuICAgIHZhciBsblxuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5vcGVuVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLndyYXBDb21tZW50KHRoaXMub3BlblRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSlcbiAgfVxuXG4gIGVuZFNlcCAoKSB7XG4gICAgdmFyIGxuXG4gICAgbG4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGggLSB0aGlzLmNsb3NlVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmNsb3NlVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKSArIHRoaXMuc3VmZml4XG4gIH1cblxuICBkZWNvTGluZSAobGVuKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCh0aGlzLmRlY28sIGxlbilcbiAgfVxuXG4gIHBhZGRpbmcgKCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoJyAnLCB0aGlzLnBhZClcbiAgfVxuXG4gIGxpbmVzICh0ZXh0ID0gJycsIHVwdG9IZWlnaHQgPSB0cnVlKSB7XG4gICAgdmFyIGwsIGxpbmVzLCB4XG4gICAgdGV4dCA9IHRleHQgfHwgJydcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdCgnXFxuJylcblxuICAgIGlmICh1cHRvSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIHJlZiwgcmVzdWx0c1xuICAgICAgICByZXN1bHRzID0gW11cblxuICAgICAgICBmb3IgKHggPSBpID0gMCwgcmVmID0gdGhpcy5oZWlnaHQ7IHJlZiA+PSAwID8gaSA8PSByZWYgOiBpID49IHJlZjsgeCA9IHJlZiA+PSAwID8gKytpIDogLS1pKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsaW5lc1t4XSB8fCAnJykpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIGxlbjEsIHJlc3VsdHNcbiAgICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuMSA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICAgIGwgPSBsaW5lc1tpXVxuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobCkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKVxuICAgIH1cbiAgfVxuXG4gIGxpbmUgKHRleHQgPSAnJykge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoJyAnLCB0aGlzLmluZGVudCkgKyB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpICsgdGV4dCArIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCgnICcsIHRoaXMud2lkdGggLSB0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyB0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbylcbiAgfVxuXG4gIGxlZnQgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpKVxuICB9XG5cbiAgcmlnaHQgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbylcbiAgfVxuXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50ICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpXG4gIH1cblxuICB0ZXh0Qm91bmRzICh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRUeHRTaXplKHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpXG4gIH1cblxuICBnZXRCb3hGb3JQb3MgKHBvcykge1xuICAgIHZhciBjbG9uZSwgY3VyTGVmdCwgZGVwdGgsIGVuZEZpbmQsIGxlZnQsIHBhaXIsIHBsYWNlaG9sZGVyLCByZXMsIHN0YXJ0RmluZFxuICAgIGRlcHRoID0gdGhpcy5nZXROZXN0ZWRMdmwocG9zLnN0YXJ0KVxuXG4gICAgaWYgKGRlcHRoID4gMCkge1xuICAgICAgbGVmdCA9IHRoaXMubGVmdCgpXG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LCBkZXB0aCAtIDEpXG4gICAgICBjbG9uZSA9IHRoaXMuY2xvbmUoKVxuICAgICAgcGxhY2Vob2xkZXIgPSAnIyMjUGxhY2VIb2xkZXIjIyMnXG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aFxuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSB0aGlzLmRlY28gKyB0aGlzLmRlY28gKyBwbGFjZWhvbGRlciArIHRoaXMuZGVjbyArIHRoaXMuZGVjb1xuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKVxuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwgJy4qJykpXG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLCBlbmRGaW5kLCB7XG4gICAgICAgIHZhbGlkTWF0Y2g6IG1hdGNoID0+IHtcbiAgICAgICAgICB2YXIgZiAvLyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuXG4gICAgICAgICAgZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpLCBbbGVmdCwgJ1xcbicsICdcXHInXSwgLTEpXG4gICAgICAgICAgcmV0dXJuIGYgPT0gbnVsbCB8fCBmLnN0ciAhPT0gbGVmdFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcywgdGhpcy5jb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG5cbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE5lc3RlZEx2bCAoaW5kZXgpIHtcbiAgICB2YXIgZGVwdGgsIGYsIGxlZnRcbiAgICBkZXB0aCA9IDBcbiAgICBsZWZ0ID0gdGhpcy5sZWZ0KClcblxuICAgIHdoaWxlICgoZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCwgW2xlZnQsICdcXG4nLCAnXFxyJ10sIC0xKSkgIT0gbnVsbCAmJiBmLnN0ciA9PT0gbGVmdCkge1xuICAgICAgaW5kZXggPSBmLnBvc1xuICAgICAgZGVwdGgrK1xuICAgIH1cblxuICAgIHJldHVybiBkZXB0aFxuICB9XG5cbiAgZ2V0T3B0RnJvbUxpbmUgKGxpbmUsIGdldFBhZCA9IHRydWUpIHtcbiAgICB2YXIgZW5kUG9zLCByRW5kLCByU3RhcnQsIHJlc0VuZCwgcmVzU3RhcnQsIHN0YXJ0UG9zXG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cCgnKFxcXFxzKikoJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28pKSArICcpKFxcXFxzKiknKVxuICAgIHJFbmQgPSBuZXcgUmVnRXhwKCcoXFxcXHMqKSgnICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLmRlY28pKSArICcpKFxcbnwkKScpXG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKVxuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKVxuXG4gICAgaWYgKHJlc1N0YXJ0ICE9IG51bGwgJiYgcmVzRW5kICE9IG51bGwpIHtcbiAgICAgIGlmIChnZXRQYWQpIHtcbiAgICAgICAgdGhpcy5wYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgsIHJlc0VuZFsxXS5sZW5ndGgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW5kZW50ID0gcmVzU3RhcnRbMV0ubGVuZ3RoXG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgdGhpcy5wYWRcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSB0aGlzLnBhZFxuICAgICAgdGhpcy53aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHJlZm9ybWF0TGluZXMgKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzKHRoaXMucmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zKSwgZmFsc2UpXG4gIH1cblxuICByZW1vdmVDb21tZW50ICh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGVjbCwgZWNyLCBlZCwgZmxhZywgb3B0LCByZTEsIHJlMlxuXG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIG11bHRpbGluZTogdHJ1ZVxuICAgICAgfVxuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpXG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmRlY28pXG4gICAgICBmbGFnID0gb3B0aW9ucy5tdWx0aWxpbmUgPyAnZ20nIDogJydcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHN7MCwke3RoaXMucGFkfX1gLCBmbGFnKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxcXFxzKiRgLCBmbGFnKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsICcnKS5yZXBsYWNlKHJlMiwgJycpXG4gICAgfVxuICB9XG59XG5leHBvcnRzLkJveEhlbHBlciA9IEJveEhlbHBlclxuIiwiXG5jb25zdCBQb3NDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJykuUG9zQ29sbGVjdGlvblxuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnKS5SZXBsYWNlbWVudFxuXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKCcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJylcblxudmFyIENsb3NpbmdQcm9tcCA9IGNsYXNzIENsb3NpbmdQcm9tcCB7XG4gIGNvbnN0cnVjdG9yIChjb2Rld2F2ZTEsIHNlbGVjdGlvbnMpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmUxXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbFxuICAgIHRoaXMuX3R5cGVkID0gbnVsbFxuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG4gICAgdGhpcy5uYkNoYW5nZXMgPSAwXG4gICAgdGhpcy5zZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucylcbiAgfVxuXG4gIGJlZ2luICgpIHtcbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlXG4gICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh0aGlzLmFkZENhcnJldHMoKSkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKSkge1xuICAgICAgICB0aGlzLnByb3h5T25DaGFuZ2UgPSAoY2ggPSBudWxsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25DaGFuZ2UoY2gpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSkucmVzdWx0KClcbiAgfVxuXG4gIGFkZENhcnJldHMgKCkge1xuICAgIHRoaXMucmVwbGFjZW1lbnRzID0gdGhpcy5zZWxlY3Rpb25zLndyYXAodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgJ1xcbicsICdcXG4nICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMpLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAuY2FycmV0VG9TZWwoKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHRoaXMucmVwbGFjZW1lbnRzKVxuICB9XG5cbiAgaW52YWxpZFR5cGVkICgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZWQgPSBudWxsXG4gIH1cblxuICBvbkNoYW5nZSAoY2ggPSBudWxsKSB7XG4gICAgdGhpcy5pbnZhbGlkVHlwZWQoKVxuXG4gICAgaWYgKHRoaXMuc2tpcEV2ZW50KGNoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5uYkNoYW5nZXMrK1xuXG4gICAgaWYgKHRoaXMuc2hvdWxkU3RvcCgpKSB7XG4gICAgICB0aGlzLnN0b3AoKVxuICAgICAgcmV0dXJuIHRoaXMuY2xlYW5DbG9zZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VtZSgpXG4gICAgfVxuICB9XG5cbiAgc2tpcEV2ZW50IChjaCkge1xuICAgIHJldHVybiBjaCAhPSBudWxsICYmIGNoLmNoYXJDb2RlQXQoMCkgIT09IDMyXG4gIH1cblxuICByZXN1bWUgKCkge31cblxuICBzaG91bGRTdG9wICgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlZCgpID09PSBmYWxzZSB8fCB0aGlzLnR5cGVkKCkuaW5kZXhPZignICcpICE9PSAtMVxuICB9XG5cbiAgY2xlYW5DbG9zZSAoKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCByZXBsLCByZXBsYWNlbWVudHMsIHJlcywgc2VsLCBzZWxlY3Rpb25zLCBzdGFydFxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc2VsZWN0aW9ucyA9IHRoaXMuZ2V0U2VsZWN0aW9ucygpXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdXG5cbiAgICAgIGNvbnN0IHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgaWYgKHBvcykge1xuICAgICAgICBzdGFydCA9IHNlbFxuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgc3RhcnQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXVxuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LCBlbmQuaW5uZXJFbmQsIHJlcylcbiAgICAgICAgcmVwbC5zZWxlY3Rpb25zID0gW3N0YXJ0XVxuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKClcbiAgfVxuXG4gIHN0b3AgKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG5cbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID09PSB0aGlzKSB7XG4gICAgICB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm94eU9uQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpXG4gICAgfVxuICB9XG5cbiAgY2FuY2VsICgpIHtcbiAgICBpZiAodGhpcy50eXBlZCgpICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jYW5jZWxTZWxlY3Rpb25zKHRoaXMuZ2V0U2VsZWN0aW9ucygpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0b3AoKVxuICB9XG5cbiAgY2FuY2VsU2VsZWN0aW9ucyAoc2VsZWN0aW9ucykge1xuICAgIHZhciBlbmQsIGosIGxlbiwgcmVwbGFjZW1lbnRzLCBzZWwsIHN0YXJ0XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzdGFydCA9IG51bGxcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNlbGVjdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNlbCA9IHNlbGVjdGlvbnNbal1cblxuICAgICAgY29uc3QgcG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICBpZiAocG9zKSB7XG4gICAgICAgIHN0YXJ0ID0gcG9zXG4gICAgICB9IGVsc2UgaWYgKChlbmQgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSAmJiBzdGFydCAhPSBudWxsKSB7XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ldyBSZXBsYWNlbWVudChzdGFydC5zdGFydCwgZW5kLmVuZCwgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihzdGFydC5lbmQgKyAxLCBlbmQuc3RhcnQgLSAxKSkuc2VsZWN0Q29udGVudCgpKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB9XG5cbiAgdHlwZWQgKCkge1xuICAgIHZhciBjcG9zLCBpbm5lckVuZCwgaW5uZXJTdGFydFxuXG4gICAgaWYgKHRoaXMuX3R5cGVkID09IG51bGwpIHtcbiAgICAgIGNwb3MgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKVxuICAgICAgaW5uZXJTdGFydCA9IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aFxuXG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PT0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgJiYgKGlubmVyRW5kID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChpbm5lclN0YXJ0KSkgIT0gbnVsbCAmJiBpbm5lckVuZCA+PSBjcG9zLmVuZCkge1xuICAgICAgICB0aGlzLl90eXBlZCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl90eXBlZCA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkXG4gIH1cblxuICB3aGl0aGluT3BlbkJvdW5kcyAocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHRcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50c1xuXG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV1cbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuc3RhcnRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0c1xuXG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyAocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHRcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50c1xuXG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV1cbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0c1xuXG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHN0YXJ0UG9zQXQgKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSkpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMsIHRoaXMuY29kZXdhdmUuYnJha2V0cylcbiAgfVxuXG4gIGVuZFBvc0F0IChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAyKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLCB0aGlzLmNvZGV3YXZlLmJyYWtldHMpXG4gIH1cbn1cbmV4cG9ydHMuQ2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wXG52YXIgU2ltdWxhdGVkQ2xvc2luZ1Byb21wID0gY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wIHtcbiAgcmVzdW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zaW11bGF0ZVR5cGUoKVxuICB9XG5cbiAgc2ltdWxhdGVUeXBlICgpIHtcbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdmFyIGN1ckNsb3NlLCByZXBsLCB0YXJnZXRUZXh0XG4gICAgICB0aGlzLmludmFsaWRUeXBlZCgpXG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGN1ckNsb3NlID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHModGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXS5jb3B5KCkuYXBwbHlPZmZzZXQodGhpcy50eXBlZCgpLmxlbmd0aCkpXG5cbiAgICAgIGlmIChjdXJDbG9zZSkge1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LCBjdXJDbG9zZS5lbmQsIHRhcmdldFRleHQpXG5cbiAgICAgICAgaWYgKHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KCkpIHtcbiAgICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uVHlwZVNpbXVsYXRlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uVHlwZVNpbXVsYXRlZCgpXG4gICAgICB9XG4gICAgfSwgMilcbiAgfVxuXG4gIHNraXBFdmVudCAoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBnZXRTZWxlY3Rpb25zICgpIHtcbiAgICByZXR1cm4gW3RoaXMuY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpLCB0aGlzLnJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdICsgdGhpcy50eXBlZCgpLmxlbmd0aF1cbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyAocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV4dCwgcmVmLCByZXBsLCB0YXJnZXRQb3NcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50c1xuXG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV1cbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSlcbiAgICAgIG5leHQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KVxuXG4gICAgICBpZiAobmV4dCAhPSBudWxsKSB7XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpXG5cbiAgICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuZXhwb3J0cy5TaW11bGF0ZWRDbG9zaW5nUHJvbXAgPSBTaW11bGF0ZWRDbG9zaW5nUHJvbXBcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IGZ1bmN0aW9uIChjb2Rld2F2ZSwgc2VsZWN0aW9ucykge1xuICBpZiAoY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKVxuICB9XG59XG4iLCJcbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbmNvbnN0IE5hbWVzcGFjZUhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInKS5OYW1lc3BhY2VIZWxwZXJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpLkNvbW1hbmRcblxudmFyIGluZGV4T2YgPSBbXS5pbmRleE9mXG5cbnZhciBDbWRGaW5kZXIgPSBjbGFzcyBDbWRGaW5kZXIge1xuICBjb25zdHJ1Y3RvciAobmFtZXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsXG5cbiAgICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdXG4gICAgfVxuXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICBuYW1lc3BhY2VzOiBbXSxcbiAgICAgIHBhcmVudENvbnRleHQ6IG51bGwsXG4gICAgICBjb250ZXh0OiBudWxsLFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzLFxuICAgICAgbXVzdEV4ZWN1dGU6IHRydWUsXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWUsXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWUsXG4gICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfVxuICAgIHRoaXMubmFtZXMgPSBuYW1lc1xuICAgIHRoaXMucGFyZW50ID0gb3B0aW9ucy5wYXJlbnRcblxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldXG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcy5jb2Rld2F2ZSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJlbnRDb250ZXh0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5wYXJlbnQgPSB0aGlzLnBhcmVudENvbnRleHRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5uYW1lc3BhY2VzICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHRoaXMubmFtZXNwYWNlcylcbiAgICB9XG4gIH1cblxuICBmaW5kICgpIHtcbiAgICB0aGlzLnRyaWdnZXJEZXRlY3RvcnMoKVxuICAgIHRoaXMuY21kID0gdGhpcy5maW5kSW4odGhpcy5yb290KVxuICAgIHJldHVybiB0aGlzLmNtZFxuICB9IC8vICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4gIC8vICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiAgLy8gICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4gIC8vICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG5cbiAgZ2V0TmFtZXNXaXRoUGF0aHMgKCkge1xuICAgIHZhciBqLCBsZW4sIG5hbWUsIHBhdGhzLCByZWYsIHJlc3QsIHNwYWNlXG4gICAgcGF0aHMgPSB7fVxuICAgIHJlZiA9IHRoaXMubmFtZXNcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmFtZSA9IHJlZltqXTtcbiAgICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuXG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCAmJiAhKGluZGV4T2YuY2FsbCh0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCBzcGFjZSkgPj0gMCkpIHtcbiAgICAgICAgaWYgKCEoc3BhY2UgaW4gcGF0aHMpKSB7XG4gICAgICAgICAgcGF0aHNbc3BhY2VdID0gW11cbiAgICAgICAgfVxuXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGhzXG4gIH1cblxuICBhcHBseVNwYWNlT25OYW1lcyAobmFtZXNwYWNlKSB7XG4gICAgdmFyIHJlc3QsIHNwYWNlO1xuICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lc3BhY2UsIHRydWUpXG4gICAgcmV0dXJuIHRoaXMubmFtZXMubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgY3VyX3Jlc3QsIGN1cl9zcGFjZTtcbiAgICAgIFtjdXJfc3BhY2UsIGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG5cbiAgICAgIGlmIChjdXJfc3BhY2UgIT0gbnVsbCAmJiBjdXJfc3BhY2UgPT09IHNwYWNlKSB7XG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdFxuICAgICAgfVxuXG4gICAgICBpZiAocmVzdCAhPSBudWxsKSB7XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmFtZVxuICAgIH0pXG4gIH1cblxuICBnZXREaXJlY3ROYW1lcyAoKSB7XG4gICAgdmFyIG5cbiAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0c1xuICAgICAgcmVmID0gdGhpcy5uYW1lc1xuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBuID0gcmVmW2pdXG5cbiAgICAgICAgaWYgKG4uaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChuKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfS5jYWxsKHRoaXMpKVxuICB9XG5cbiAgdHJpZ2dlckRldGVjdG9ycyAoKSB7XG4gICAgdmFyIGNtZCwgZGV0ZWN0b3IsIGksIGosIGxlbiwgcG9zaWJpbGl0aWVzLCByZWYsIHJlcywgcmVzdWx0c1xuXG4gICAgaWYgKHRoaXMudXNlRGV0ZWN0b3JzKSB7XG4gICAgICB0aGlzLnVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICBwb3NpYmlsaXRpZXMgPSBbdGhpcy5yb290XS5jb25jYXQobmV3IENtZEZpbmRlcih0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCB7XG4gICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgICBpID0gMFxuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIHdoaWxlIChpIDwgcG9zaWJpbGl0aWVzLmxlbmd0aCkge1xuICAgICAgICBjbWQgPSBwb3NpYmlsaXRpZXNbaV1cbiAgICAgICAgcmVmID0gY21kLmRldGVjdG9yc1xuXG4gICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIGRldGVjdG9yID0gcmVmW2pdXG4gICAgICAgICAgcmVzID0gZGV0ZWN0b3IuZGV0ZWN0KHRoaXMpXG5cbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcylcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtcbiAgICAgICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgICAgICBtdXN0RXhlY3V0ZTogZmFsc2UsXG4gICAgICAgICAgICAgIHVzZUZhbGxiYWNrczogZmFsc2VcbiAgICAgICAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRzLnB1c2goaSsrKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cbiAgfVxuXG4gIGZpbmRJbiAoY21kLCBwYXRoID0gbnVsbCkge1xuICAgIHZhciBiZXN0XG5cbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgYmVzdCA9IHRoaXMuYmVzdEluUG9zaWJpbGl0aWVzKHRoaXMuZmluZFBvc2liaWxpdGllcygpKVxuXG4gICAgaWYgKGJlc3QgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGJlc3RcbiAgICB9XG4gIH1cblxuICBmaW5kUG9zaWJpbGl0aWVzICgpIHtcbiAgICB2YXIgZGlyZWN0LCBmYWxsYmFjaywgaiwgaywgbGVuLCBsZW4xLCBuYW1lLCBuYW1lcywgbnNwYywgbnNwY05hbWUsIHBvc2liaWxpdGllcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZXN0LCBzcGFjZVxuXG4gICAgaWYgKHRoaXMucm9vdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0aGlzLnJvb3QuaW5pdCgpXG4gICAgcG9zaWJpbGl0aWVzID0gW11cblxuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyAocmVmMSA9IHJlZi5pbkluc3RhbmNlKSAhPSBudWxsID8gcmVmMS5jbWQgOiBudWxsIDogbnVsbCkgPT09IHRoaXMucm9vdCkge1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKCdpbl9pbnN0YW5jZScpKVxuICAgIH1cblxuICAgIHJlZjIgPSB0aGlzLmdldE5hbWVzV2l0aFBhdGhzKClcblxuICAgIGZvciAoc3BhY2UgaW4gcmVmMikge1xuICAgICAgbmFtZXMgPSByZWYyW3NwYWNlXVxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKHNwYWNlLCBuYW1lcykpXG4gICAgfVxuXG4gICAgcmVmMyA9IHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKClcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZjMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5zcGMgPSByZWYzW2pdO1xuICAgICAgW25zcGNOYW1lLCByZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsIHRydWUpXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQobnNwY05hbWUsIHRoaXMuYXBwbHlTcGFjZU9uTmFtZXMobnNwYykpKVxuICAgIH1cblxuICAgIHJlZjQgPSB0aGlzLmdldERpcmVjdE5hbWVzKClcblxuICAgIGZvciAoayA9IDAsIGxlbjEgPSByZWY0Lmxlbmd0aDsgayA8IGxlbjE7IGsrKykge1xuICAgICAgbmFtZSA9IHJlZjRba11cbiAgICAgIGRpcmVjdCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSlcblxuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChkaXJlY3QpKSB7XG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy51c2VGYWxsYmFja3MpIHtcbiAgICAgIGZhbGxiYWNrID0gdGhpcy5yb290LmdldENtZCgnZmFsbGJhY2snKVxuXG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGZhbGxiYWNrKSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjaylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllc1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXNcbiAgfVxuXG4gIGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kIChjbWROYW1lLCBuYW1lcyA9IHRoaXMubmFtZXMpIHtcbiAgICB2YXIgaiwgbGVuLCBuZXh0LCBuZXh0cywgcG9zaWJpbGl0aWVzXG4gICAgcG9zaWJpbGl0aWVzID0gW11cbiAgICBuZXh0cyA9IHRoaXMuZ2V0Q21kRm9sbG93QWxpYXMoY21kTmFtZSlcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IG5leHRzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuZXh0ID0gbmV4dHNbal1cbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIHJvb3Q6IG5leHRcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICB9XG5cbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzXG4gIH1cblxuICBnZXRDbWRGb2xsb3dBbGlhcyAobmFtZSkge1xuICAgIHZhciBjbWRcbiAgICBjbWQgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KClcblxuICAgICAgaWYgKGNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtjbWQsIGNtZC5nZXRBbGlhc2VkKCldXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbY21kXVxuICAgIH1cblxuICAgIHJldHVybiBbY21kXVxuICB9XG5cbiAgY21kSXNWYWxpZCAoY21kKSB7XG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoY21kLm5hbWUgIT09ICdmYWxsYmFjaycgJiYgaW5kZXhPZi5jYWxsKHRoaXMuYW5jZXN0b3JzKCksIGNtZCkgPj0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuICF0aGlzLm11c3RFeGVjdXRlIHx8IHRoaXMuY21kSXNFeGVjdXRhYmxlKGNtZClcbiAgfVxuXG4gIGFuY2VzdG9ycyAoKSB7XG4gICAgdmFyIHJlZlxuXG4gICAgaWYgKCgocmVmID0gdGhpcy5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogbnVsbCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICB9XG5cbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGNtZElzRXhlY3V0YWJsZSAoY21kKSB7XG4gICAgdmFyIG5hbWVzXG4gICAgbmFtZXMgPSB0aGlzLmdldERpcmVjdE5hbWVzKClcblxuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgIH1cbiAgfVxuXG4gIGNtZFNjb3JlIChjbWQpIHtcbiAgICB2YXIgc2NvcmVcbiAgICBzY29yZSA9IGNtZC5kZXB0aFxuXG4gICAgaWYgKGNtZC5uYW1lID09PSAnZmFsbGJhY2snKSB7XG4gICAgICBzY29yZSAtPSAxMDAwXG4gICAgfVxuXG4gICAgcmV0dXJuIHNjb3JlXG4gIH1cblxuICBiZXN0SW5Qb3NpYmlsaXRpZXMgKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlXG5cbiAgICBpZiAocG9zcy5sZW5ndGggPiAwKSB7XG4gICAgICBiZXN0ID0gbnVsbFxuICAgICAgYmVzdFNjb3JlID0gbnVsbFxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBwb3NzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSBwb3NzW2pdXG4gICAgICAgIHNjb3JlID0gdGhpcy5jbWRTY29yZShwKVxuXG4gICAgICAgIGlmIChiZXN0ID09IG51bGwgfHwgc2NvcmUgPj0gYmVzdFNjb3JlKSB7XG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmVcbiAgICAgICAgICBiZXN0ID0gcFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiZXN0XG4gICAgfVxuICB9XG59XG5leHBvcnRzLkNtZEZpbmRlciA9IENtZEZpbmRlclxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBUZXh0UGFyc2VyID0gcmVxdWlyZSgnLi9UZXh0UGFyc2VyJykuVGV4dFBhcnNlclxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IE9wdGlvbmFsUHJvbWlzZSA9IHJlcXVpcmUoJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnKVxuXG52YXIgQ21kSW5zdGFuY2UgPSBjbGFzcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yIChjbWQxLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jbWQgPSBjbWQxXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dFxuICB9XG5cbiAgaW5pdCAoKSB7XG4gICAgaWYgKCEodGhpcy5pc0VtcHR5KCkgfHwgdGhpcy5pbml0ZWQpKSB7XG4gICAgICB0aGlzLmluaXRlZCA9IHRydWVcblxuICAgICAgdGhpcy5fZ2V0Q21kT2JqKClcblxuICAgICAgdGhpcy5faW5pdFBhcmFtcygpXG5cbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqLmluaXQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzZXRQYXJhbSAobmFtZSwgdmFsKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSB2YWxcbiAgfVxuXG4gIHB1c2hQYXJhbSAodmFsKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnB1c2godmFsKVxuICB9XG5cbiAgZ2V0Q29udGV4dCAoKSB7XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCBuZXcgQ29udGV4dCgpXG4gIH1cblxuICBnZXRGaW5kZXIgKGNtZE5hbWUpIHtcbiAgICB2YXIgZmluZGVyXG4gICAgZmluZGVyID0gdGhpcy5nZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgfVxuXG4gIF9nZXRDbWRPYmogKCkge1xuICAgIHZhciBjbWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNtZC5pbml0KClcbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZCgpIHx8IHRoaXMuY21kXG4gICAgICBjbWQuaW5pdCgpXG5cbiAgICAgIGlmIChjbWQuY2xzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKVxuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmpcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaW5pdFBhcmFtcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWQgPSB0aGlzLmdldERlZmF1bHRzKClcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzICgpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGlzRW1wdHkgKCkge1xuICAgIHJldHVybiB0aGlzLmNtZCAhPSBudWxsXG4gIH1cblxuICByZXN1bHRJc0F2YWlsYWJsZSAoKSB7XG4gICAgdmFyIGFsaWFzZWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgfVxuXG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKVxuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY21kLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGdldERlZmF1bHRzICgpIHtcbiAgICB2YXIgYWxpYXNlZCwgcmVzXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgcmVzID0ge31cbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKVxuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCBhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgICB9XG5cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZC5kZWZhdWx0cylcblxuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kT2JqLmdldERlZmF1bHRzKCkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZCAoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmdldEFsaWFzZWRGaW5hbCgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmFsaWFzZWRDbWQgfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWRGaW5hbCAoKSB7XG4gICAgdmFyIGFsaWFzZWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkRmluYWxDbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGlhc2VkRmluYWxDbWQgfHwgbnVsbFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLmNtZFxuXG4gICAgICAgIHdoaWxlIChhbGlhc2VkICE9IG51bGwgJiYgYWxpYXNlZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgICBhbGlhc2VkID0gYWxpYXNlZC5fYWxpYXNlZEZyb21GaW5kZXIodGhpcy5nZXRGaW5kZXIodGhpcy5hbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG5cbiAgICAgICAgICBpZiAodGhpcy5hbGlhc2VkQ21kID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuYWxpYXNlZENtZCA9IGFsaWFzZWQgfHwgZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgfHwgZmFsc2VcbiAgICAgICAgcmV0dXJuIGFsaWFzZWRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhbHRlckFsaWFzT2YgKGFsaWFzT2YpIHtcbiAgICByZXR1cm4gYWxpYXNPZlxuICB9XG5cbiAgZ2V0T3B0aW9ucyAoKSB7XG4gICAgdmFyIG9wdFxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPcHRpb25zXG4gICAgICB9XG5cbiAgICAgIG9wdCA9IHRoaXMuY21kLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSlcblxuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMuY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0aW9uIChrZXkpIHtcbiAgICB2YXIgb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKVxuXG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCAmJiBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICAgIH1cbiAgfVxuXG4gIGdldFBhcmFtIChuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBpLCBsZW4sIG4sIHJlZlxuXG4gICAgaWYgKChyZWYgPSB0eXBlb2YgbmFtZXMpID09PSAnc3RyaW5nJyB8fCByZWYgPT09ICdudW1iZXInKSB7XG4gICAgICBuYW1lcyA9IFtuYW1lc11cbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbiA9IG5hbWVzW2ldXG5cbiAgICAgIGlmICh0aGlzLm5hbWVkW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbl1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucGFyYW1zW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1zW25dXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZlZhbFxuICB9XG5cbiAgZ2V0Qm9vbFBhcmFtIChuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBmYWxzZVZhbHMsIHZhbFxuICAgIGZhbHNlVmFscyA9IFsnJywgJzAnLCAnZmFsc2UnLCAnbm8nLCAnbm9uZScsIGZhbHNlLCBudWxsLCAwXVxuICAgIHZhbCA9IHRoaXMuZ2V0UGFyYW0obmFtZXMsIGRlZlZhbClcbiAgICByZXR1cm4gIWZhbHNlVmFscy5pbmNsdWRlcyh2YWwpXG4gIH1cblxuICBhbmNlc3RvckNtZHMgKCkge1xuICAgIHZhciByZWZcblxuICAgIGlmICgoKHJlZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogbnVsbCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKVxuICAgIH1cblxuICAgIHJldHVybiBbXVxuICB9XG5cbiAgYW5jZXN0b3JDbWRzQW5kU2VsZiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5jZXN0b3JDbWRzKCkuY29uY2F0KFt0aGlzLmNtZF0pXG4gIH1cblxuICBydW5FeGVjdXRlRnVuY3QgKCkge1xuICAgIHZhciBjbWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmouZXhlY3V0ZSgpXG4gICAgICB9XG5cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWRcbiAgICAgIGNtZC5pbml0KClcblxuICAgICAgaWYgKGNtZC5leGVjdXRlRnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJhd1Jlc3VsdCAoKSB7XG4gICAgdmFyIGNtZFxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5yZXN1bHQoKVxuICAgICAgfVxuXG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpIHx8IHRoaXMuY21kXG4gICAgICBjbWQuaW5pdCgpXG5cbiAgICAgIGlmIChjbWQucmVzdWx0RnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpXG4gICAgICB9XG5cbiAgICAgIGlmIChjbWQucmVzdWx0U3RyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRTdHJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIHRoaXMuaW5pdCgpXG5cbiAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHRoaXMucmF3UmVzdWx0KCkpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgdmFyIHBhcnNlclxuXG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIHJlcyA9IHRoaXMuZm9ybWF0SW5kZW50KHJlcylcblxuICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCAmJiB0aGlzLmdldE9wdGlvbigncGFyc2UnLCB0aGlzKSkge1xuICAgICAgICAgICAgcGFyc2VyID0gdGhpcy5nZXRQYXJzZXJGb3JUZXh0KHJlcylcbiAgICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgYWx0ZXJGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdhbHRlclJlc3VsdCcsIHRoaXMpXG4gICAgICAgICAgaWYgKGFsdGVyRnVuY3QpIHtcbiAgICAgICAgICAgIHJlcyA9IGFsdGVyRnVuY3QocmVzLCB0aGlzKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiByZXNcbiAgICAgICAgfVxuICAgICAgfSkucmVzdWx0KClcbiAgICB9XG4gIH1cblxuICBnZXRQYXJzZXJGb3JUZXh0ICh0eHQgPSAnJykge1xuICAgIHZhciBwYXJzZXJcbiAgICBwYXJzZXIgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUubmV3SW5zdGFuY2UobmV3IFRleHRQYXJzZXIodHh0KSwge1xuICAgICAgaW5JbnN0YW5jZTogdGhpc1xuICAgIH0pXG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2VcbiAgICByZXR1cm4gcGFyc2VyXG4gIH1cblxuICBnZXRJbmRlbnQgKCkge1xuICAgIHJldHVybiAwXG4gIH1cblxuICBmb3JtYXRJbmRlbnQgKHRleHQpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywgJyAgJylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHRcbiAgICB9XG4gIH1cblxuICBhcHBseUluZGVudCAodGV4dCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuaW5kZW50Tm90Rmlyc3QodGV4dCwgdGhpcy5nZXRJbmRlbnQoKSwgJyAnKVxuICB9XG59XG5leHBvcnRzLkNtZEluc3RhbmNlID0gQ21kSW5zdGFuY2VcbiIsIlxuY29uc3QgUHJvY2VzcyA9IHJlcXVpcmUoJy4vUHJvY2VzcycpLlByb2Nlc3NcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxuY29uc3QgUG9zaXRpb25lZENtZEluc3RhbmNlID0gcmVxdWlyZSgnLi9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UnKS5Qb3NpdGlvbmVkQ21kSW5zdGFuY2VcblxuY29uc3QgVGV4dFBhcnNlciA9IHJlcXVpcmUoJy4vVGV4dFBhcnNlcicpLlRleHRQYXJzZXJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpLkNvbW1hbmRcblxuY29uc3QgTG9nZ2VyID0gcmVxdWlyZSgnLi9Mb2dnZXInKS5Mb2dnZXJcblxuY29uc3QgUG9zQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbicpLlBvc0NvbGxlY3Rpb25cblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBDbG9zaW5nUHJvbXAgPSByZXF1aXJlKCcuL0Nsb3NpbmdQcm9tcCcpLkNsb3NpbmdQcm9tcFxuXG52YXIgQ29kZXdhdmUgPSAoZnVuY3Rpb24gKCkge1xuICBjbGFzcyBDb2Rld2F2ZSB7XG4gICAgY29uc3RydWN0b3IgKGVkaXRvciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsXG4gICAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgICAgQ29kZXdhdmUuaW5pdCgpXG4gICAgICB0aGlzLm1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nXG4gICAgICB0aGlzLnZhcnMgPSB7fVxuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIGJyYWtldHM6ICd+ficsXG4gICAgICAgIGRlY286ICd+JyxcbiAgICAgICAgY2xvc2VDaGFyOiAnLycsXG4gICAgICAgIG5vRXhlY3V0ZUNoYXI6ICchJyxcbiAgICAgICAgY2FycmV0Q2hhcjogJ3wnLFxuICAgICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgICAgaW5JbnN0YW5jZTogbnVsbFxuICAgICAgfVxuICAgICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zLnBhcmVudFxuICAgICAgdGhpcy5uZXN0ZWQgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQubmVzdGVkICsgMSA6IDBcblxuICAgICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgICAgdmFsID0gZGVmYXVsdHNba2V5XVxuXG4gICAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwgJiYga2V5ICE9PSAncGFyZW50Jykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5lZGl0b3IgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmVkaXRvci5iaW5kZWRUbyh0aGlzKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzKVxuXG4gICAgICBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMuaW5JbnN0YW5jZS5jb250ZXh0XG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcigpXG4gICAgfVxuXG4gICAgb25BY3RpdmF0aW9uS2V5ICgpIHtcbiAgICAgIHRoaXMucHJvY2VzcyA9IG5ldyBQcm9jZXNzKClcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKVxuICAgICAgcmV0dXJuIHRoaXMucnVuQXRDdXJzb3JQb3MoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2VzcyA9IG51bGxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcnVuQXRDdXJzb3JQb3MgKCkge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKHRoaXMuZWRpdG9yLmdldE11bHRpU2VsKCkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdFBvcyh0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBydW5BdFBvcyAocG9zKSB7XG4gICAgICBpZiAocG9zID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDdXJzb3IgUG9zaXRpb24gaXMgZW1wdHknKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKFtwb3NdKVxuICAgIH1cblxuICAgIHJ1bkF0TXVsdGlQb3MgKG11bHRpUG9zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBjbWRcblxuICAgICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNtZCA9IHRoaXMuY29tbWFuZE9uUG9zKG11bHRpUG9zWzBdLmVuZClcblxuICAgICAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgY21kLnNldE11bHRpUG9zKG11bHRpUG9zKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbWQuaW5pdCgpXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coY21kKVxuICAgICAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zWzBdLnN0YXJ0ID09PSBtdWx0aVBvc1swXS5lbmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQnJha2V0cyhtdWx0aVBvcylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21wdENsb3NpbmdDbWQobXVsdGlQb3MpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbW1hbmRPblBvcyAocG9zKSB7XG4gICAgICB2YXIgbmV4dCwgcHJldlxuXG4gICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuZm9sbG93ZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMSkge1xuICAgICAgICBwcmV2ID0gcG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aFxuICAgICAgICBuZXh0ID0gcG9zXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09PSAwKSB7XG4gICAgICAgICAgcG9zIC09IHRoaXMuYnJha2V0cy5sZW5ndGhcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXYgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHBvcylcblxuICAgICAgICBpZiAocHJldiA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQgPSB0aGlzLmZpbmROZXh0QnJha2V0KHBvcyAtIDEpXG5cbiAgICAgICAgaWYgKG5leHQgPT0gbnVsbCB8fCB0aGlzLmNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT09IDApIHtcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIHByZXYsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocHJldiwgbmV4dCArIHRoaXMuYnJha2V0cy5sZW5ndGgpKVxuICAgIH1cblxuICAgIG5leHRDbWQgKHN0YXJ0ID0gMCkge1xuICAgICAgdmFyIGJlZ2lubmluZywgZiwgcG9zXG4gICAgICBwb3MgPSBzdGFydFxuXG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbdGhpcy5icmFrZXRzLCAnXFxuJ10pKSB7XG4gICAgICAgIHBvcyA9IGYucG9zICsgZi5zdHIubGVuZ3RoXG5cbiAgICAgICAgaWYgKGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGJlZ2lubmluZyAhPT0gJ3VuZGVmaW5lZCcgJiYgYmVnaW5uaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIoYmVnaW5uaW5nLCBmLnBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvc1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiZWdpbm5pbmcgPSBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBnZXRFbmNsb3NpbmdDbWQgKHBvcyA9IDApIHtcbiAgICAgIHZhciBjbG9zaW5nUHJlZml4LCBjcG9zLCBwXG4gICAgICBjcG9zID0gcG9zXG4gICAgICBjbG9zaW5nUHJlZml4ID0gdGhpcy5icmFrZXRzICsgdGhpcy5jbG9zZUNoYXJcblxuICAgICAgd2hpbGUgKChwID0gdGhpcy5maW5kTmV4dChjcG9zLCBjbG9zaW5nUHJlZml4KSkgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGgpXG4gICAgICAgIGlmIChjbWQpIHtcbiAgICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpXG5cbiAgICAgICAgICBpZiAoY21kLnBvcyA8IHBvcykge1xuICAgICAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcG9zID0gcCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBwcmVjZWRlZEJ5QnJha2V0cyAocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MgLSB0aGlzLmJyYWtldHMubGVuZ3RoLCBwb3MpID09PSB0aGlzLmJyYWtldHNcbiAgICB9XG5cbiAgICBmb2xsb3dlZEJ5QnJha2V0cyAocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpID09PSB0aGlzLmJyYWtldHNcbiAgICB9XG5cbiAgICBjb3VudFByZXZCcmFrZXQgKHN0YXJ0KSB7XG4gICAgICB2YXIgaVxuICAgICAgaSA9IDBcblxuICAgICAgd2hpbGUgKChzdGFydCA9IHRoaXMuZmluZFByZXZCcmFrZXQoc3RhcnQpKSAhPSBudWxsKSB7XG4gICAgICAgIGkrK1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaVxuICAgIH1cblxuICAgIGlzRW5kTGluZSAocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIDEpID09PSAnXFxuJyB8fCBwb3MgKyAxID49IHRoaXMuZWRpdG9yLnRleHRMZW4oKVxuICAgIH1cblxuICAgIGZpbmRQcmV2QnJha2V0IChzdGFydCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHRCcmFrZXQoc3RhcnQsIC0xKVxuICAgIH1cblxuICAgIGZpbmROZXh0QnJha2V0IChzdGFydCwgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGZcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbdGhpcy5icmFrZXRzLCAnXFxuJ10sIGRpcmVjdGlvbilcblxuICAgICAgaWYgKGYgJiYgZi5zdHIgPT09IHRoaXMuYnJha2V0cykge1xuICAgICAgICByZXR1cm4gZi5wb3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldiAoc3RhcnQsIHN0cmluZykge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHQoc3RhcnQsIHN0cmluZywgLTEpXG4gICAgfVxuXG4gICAgZmluZE5leHQgKHN0YXJ0LCBzdHJpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmXG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3N0cmluZ10sIGRpcmVjdGlvbilcblxuICAgICAgaWYgKGYpIHtcbiAgICAgICAgcmV0dXJuIGYucG9zXG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZEFueU5leHQgKHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IuZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbilcbiAgICB9XG5cbiAgICBmaW5kTWF0Y2hpbmdQYWlyIChzdGFydFBvcywgb3BlbmluZywgY2xvc2luZywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGYsIG5lc3RlZCwgcG9zXG4gICAgICBwb3MgPSBzdGFydFBvc1xuICAgICAgbmVzdGVkID0gMFxuXG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbY2xvc2luZywgb3BlbmluZ10sIGRpcmVjdGlvbikpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyAoZGlyZWN0aW9uID4gMCA/IGYuc3RyLmxlbmd0aCA6IDApXG5cbiAgICAgICAgaWYgKGYuc3RyID09PSAoZGlyZWN0aW9uID4gMCA/IGNsb3NpbmcgOiBvcGVuaW5nKSkge1xuICAgICAgICAgIGlmIChuZXN0ZWQgPiAwKSB7XG4gICAgICAgICAgICBuZXN0ZWQtLVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZlxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXN0ZWQrK1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgYWRkQnJha2V0cyAocG9zKSB7XG4gICAgICB2YXIgcmVwbGFjZW1lbnRzXG4gICAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpXG4gICAgICByZXBsYWNlbWVudHMgPSBwb3Mud3JhcCh0aGlzLmJyYWtldHMsIHRoaXMuYnJha2V0cykubWFwKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHJldHVybiByLnNlbGVjdENvbnRlbnQoKVxuICAgICAgfSlcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gICAgfVxuXG4gICAgcHJvbXB0Q2xvc2luZ0NtZCAoc2VsZWN0aW9ucykge1xuICAgICAgaWYgKHRoaXMuY2xvc2luZ1Byb21wICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbG9zaW5nUHJvbXAuc3RvcCgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcC5uZXdGb3IodGhpcywgc2VsZWN0aW9ucykuYmVnaW4oKVxuICAgIH1cblxuICAgIG5ld0luc3RhbmNlIChlZGl0b3IsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgQ29kZXdhdmUoZWRpdG9yLCBvcHRpb25zKVxuICAgIH1cblxuICAgIHBhcnNlQWxsIChyZWN1cnNpdmUgPSB0cnVlKSB7XG4gICAgICB2YXIgY21kLCBwYXJzZXIsIHBvcywgcmVzXG5cbiAgICAgIGlmICh0aGlzLm5lc3RlZCA+IDEwMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIHBhcnNpbmcgUmVjdXJzaW9uJylcbiAgICAgIH1cblxuICAgICAgcG9zID0gMFxuXG4gICAgICB3aGlsZSAoY21kID0gdGhpcy5uZXh0Q21kKHBvcykpIHtcbiAgICAgICAgcG9zID0gY21kLmdldEVuZFBvcygpXG4gICAgICAgIHRoaXMuZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpIC8vIGNvbnNvbGUubG9nKGNtZClcblxuICAgICAgICBjbWQuaW5pdCgpXG5cbiAgICAgICAgaWYgKHJlY3Vyc2l2ZSAmJiBjbWQuY29udGVudCAhPSBudWxsICYmIChjbWQuZ2V0Q21kKCkgPT0gbnVsbCB8fCAhY21kLmdldE9wdGlvbigncHJldmVudFBhcnNlQWxsJykpKSB7XG4gICAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge1xuICAgICAgICAgICAgcGFyZW50OiB0aGlzXG4gICAgICAgICAgfSlcbiAgICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICAgIH1cblxuICAgICAgICByZXMgPSBjbWQuZXhlY3V0ZSgpXG5cbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgaWYgKHJlcy50aGVuICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN5bmMgbmVzdGVkIGNvbW1hbmRzIGFyZSBub3Qgc3VwcG9ydGVkJylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY21kLnJlcGxhY2VFbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmRcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCkuZW5kXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdldFRleHQoKVxuICAgIH1cblxuICAgIGdldFRleHQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHQoKVxuICAgIH1cblxuICAgIGlzUm9vdCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQgPT0gbnVsbCAmJiAodGhpcy5pbkluc3RhbmNlID09IG51bGwgfHwgdGhpcy5pbkluc3RhbmNlLmZpbmRlciA9PSBudWxsKVxuICAgIH1cblxuICAgIGdldFJvb3QgKCkge1xuICAgICAgaWYgKHRoaXMuaXNSb290KCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Um9vdCgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RmlsZVN5c3RlbSAoKSB7XG4gICAgICBpZiAodGhpcy5lZGl0b3IuZmlsZVN5c3RlbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lZGl0b3IuZmlsZVN5c3RlbVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUNhcnJldCAodHh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsIHRoaXMuY2FycmV0Q2hhcilcbiAgICB9XG5cbiAgICBnZXRDYXJyZXRQb3MgKHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRDYXJyZXRQb3ModHh0LCB0aGlzLmNhcnJldENoYXIpXG4gICAgfVxuXG4gICAgcmVnTWFya2VyIChmbGFncyA9ICdnJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm1hcmtlciksIGZsYWdzKVxuICAgIH1cblxuICAgIHJlbW92ZU1hcmtlcnMgKHRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UodGhpcy5yZWdNYXJrZXIoKSwgJycpXG4gICAgfVxuXG4gICAgc3RhdGljIGluaXQgKCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRlZCkge1xuICAgICAgICB0aGlzLmluaXRlZCA9IHRydWVcblxuICAgICAgICBDb21tYW5kLmluaXRDbWRzKClcblxuICAgICAgICByZXR1cm4gQ29tbWFuZC5sb2FkQ21kcygpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgO1xuICBDb2Rld2F2ZS5pbml0ZWQgPSBmYWxzZVxuICByZXR1cm4gQ29kZXdhdmVcbn0uY2FsbChudWxsKSlcblxuZXhwb3J0cy5Db2Rld2F2ZSA9IENvZGV3YXZlXG4iLCJcbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbmNvbnN0IFN0b3JhZ2UgPSByZXF1aXJlKCcuL1N0b3JhZ2UnKS5TdG9yYWdlXG5cbmNvbnN0IE5hbWVzcGFjZUhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInKS5OYW1lc3BhY2VIZWxwZXJcblxudmFyIF9vcHRLZXlcblxuX29wdEtleSA9IGZ1bmN0aW9uIChrZXksIGRpY3QsIGRlZlZhbCA9IG51bGwpIHtcbiAgLy8gb3B0aW9uYWwgRGljdGlvbmFyeSBrZXlcbiAgaWYgKGtleSBpbiBkaWN0KSB7XG4gICAgcmV0dXJuIGRpY3Rba2V5XVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBkZWZWYWxcbiAgfVxufVxuXG52YXIgQ29tbWFuZCA9IGNsYXNzIENvbW1hbmQge1xuICBjb25zdHJ1Y3RvciAobmFtZTEsIGRhdGExID0gbnVsbCwgcGFyZW50ID0gbnVsbCkge1xuICAgIHRoaXMubmFtZSA9IG5hbWUxXG4gICAgdGhpcy5kYXRhID0gZGF0YTFcbiAgICB0aGlzLmNtZHMgPSBbXVxuICAgIHRoaXMuZGV0ZWN0b3JzID0gW11cbiAgICB0aGlzLmV4ZWN1dGVGdW5jdCA9IHRoaXMucmVzdWx0RnVuY3QgPSB0aGlzLnJlc3VsdFN0ciA9IHRoaXMuYWxpYXNPZiA9IHRoaXMuY2xzID0gbnVsbFxuICAgIHRoaXMuYWxpYXNlZCA9IG51bGxcbiAgICB0aGlzLmZ1bGxOYW1lID0gdGhpcy5uYW1lXG4gICAgdGhpcy5kZXB0aCA9IDA7XG4gICAgW3RoaXMuX3BhcmVudCwgdGhpcy5faW5pdGVkXSA9IFtudWxsLCBmYWxzZV1cbiAgICB0aGlzLnNldFBhcmVudChwYXJlbnQpXG4gICAgdGhpcy5kZWZhdWx0cyA9IHt9XG4gICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgY2hlY2tDYXJyZXQ6IHRydWUsXG4gICAgICBwYXJzZTogZmFsc2UsXG4gICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgYWx0ZXJSZXN1bHQ6IG51bGwsXG4gICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgICBhbGxvd2VkTmFtZWQ6IG51bGxcbiAgICB9XG4gICAgdGhpcy5vcHRpb25zID0ge31cbiAgICB0aGlzLmZpbmFsT3B0aW9ucyA9IG51bGxcbiAgfVxuXG4gIHBhcmVudCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcmVudFxuICB9XG5cbiAgc2V0UGFyZW50ICh2YWx1ZSkge1xuICAgIGlmICh0aGlzLl9wYXJlbnQgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9wYXJlbnQgPSB2YWx1ZVxuICAgICAgdGhpcy5mdWxsTmFtZSA9IHRoaXMuX3BhcmVudCAhPSBudWxsICYmIHRoaXMuX3BhcmVudC5uYW1lICE9IG51bGwgPyB0aGlzLl9wYXJlbnQuZnVsbE5hbWUgKyAnOicgKyB0aGlzLm5hbWUgOiB0aGlzLm5hbWVcbiAgICAgIHRoaXMuZGVwdGggPSB0aGlzLl9wYXJlbnQgIT0gbnVsbCAmJiB0aGlzLl9wYXJlbnQuZGVwdGggIT0gbnVsbCA/IHRoaXMuX3BhcmVudC5kZXB0aCArIDEgOiAwXG4gICAgfVxuICB9XG5cbiAgaW5pdCAoKSB7XG4gICAgaWYgKCF0aGlzLl9pbml0ZWQpIHtcbiAgICAgIHRoaXMuX2luaXRlZCA9IHRydWVcbiAgICAgIHRoaXMucGFyc2VEYXRhKHRoaXMuZGF0YSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgdW5yZWdpc3RlciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcmVudC5yZW1vdmVDbWQodGhpcylcbiAgfVxuXG4gIGlzRWRpdGFibGUgKCkge1xuICAgIHJldHVybiB0aGlzLnJlc3VsdFN0ciAhPSBudWxsIHx8IHRoaXMuYWxpYXNPZiAhPSBudWxsXG4gIH1cblxuICBpc0V4ZWN1dGFibGUgKCkge1xuICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZlxuICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKVxuXG4gICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgfVxuXG4gICAgcmVmID0gWydyZXN1bHRTdHInLCAncmVzdWx0RnVuY3QnLCAnY2xzJywgJ2V4ZWN1dGVGdW5jdCddXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHAgPSByZWZbal1cblxuICAgICAgaWYgKHRoaXNbcF0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgaXNFeGVjdXRhYmxlV2l0aE5hbWUgKG5hbWUpIHtcbiAgICB2YXIgYWxpYXNPZiwgYWxpYXNlZCwgY29udGV4dFxuXG4gICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgYWxpYXNPZiA9IHRoaXMuYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBuYW1lKVxuICAgICAgYWxpYXNlZCA9IHRoaXMuX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKGFsaWFzT2YpKVxuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pc0V4ZWN1dGFibGUoKVxuICB9XG5cbiAgcmVzdWx0SXNBdmFpbGFibGUgKCkge1xuICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZlxuICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKVxuXG4gICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgIH1cblxuICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0J11cblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgcCA9IHJlZltqXVxuXG4gICAgICBpZiAodGhpc1twXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBnZXREZWZhdWx0cyAoKSB7XG4gICAgdmFyIGFsaWFzZWQsIHJlc1xuICAgIHJlcyA9IHt9XG4gICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpXG5cbiAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgIH1cblxuICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmRlZmF1bHRzKVxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIF9hbGlhc2VkRnJvbUZpbmRlciAoZmluZGVyKSB7XG4gICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlXG4gICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2VcbiAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2VcbiAgICByZXR1cm4gZmluZGVyLmZpbmQoKVxuICB9XG5cbiAgZ2V0QWxpYXNlZCAoKSB7XG4gICAgdmFyIGNvbnRleHRcblxuICAgIGlmICh0aGlzLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgIHJldHVybiB0aGlzLl9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcih0aGlzLmFsaWFzT2YpKVxuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWRPclRoaXMgKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFsaWFzZWQoKSB8fCB0aGlzXG4gIH1cblxuICBzZXRPcHRpb25zIChkYXRhKSB7XG4gICAgdmFyIGtleSwgcmVzdWx0cywgdmFsXG4gICAgcmVzdWx0cyA9IFtdXG5cbiAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG4gICAgICB2YWwgPSBkYXRhW2tleV1cblxuICAgICAgaWYgKGtleSBpbiB0aGlzLmRlZmF1bHRPcHRpb25zKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLm9wdGlvbnNba2V5XSA9IHZhbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChudWxsKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cblxuICBfb3B0aW9uc0ZvckFsaWFzZWQgKGFsaWFzZWQpIHtcbiAgICB2YXIgb3B0XG4gICAgb3B0ID0ge31cbiAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5kZWZhdWx0T3B0aW9ucylcblxuICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCBhbGlhc2VkLmdldE9wdGlvbnMoKSlcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMub3B0aW9ucylcbiAgfVxuXG4gIGdldE9wdGlvbnMgKCkge1xuICAgIHJldHVybiB0aGlzLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSlcbiAgfVxuXG4gIGdldE9wdGlvbiAoa2V5KSB7XG4gICAgdmFyIG9wdGlvbnNcbiAgICBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKClcblxuICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICAgIH1cbiAgfVxuXG4gIGhlbHAgKCkge1xuICAgIHZhciBjbWRcbiAgICBjbWQgPSB0aGlzLmdldENtZCgnaGVscCcpXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLnJlc3VsdFN0clxuICAgIH1cbiAgfVxuXG4gIHBhcnNlRGF0YSAoZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGFcblxuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMucmVzdWx0U3RyID0gZGF0YVxuICAgICAgdGhpcy5vcHRpb25zLnBhcnNlID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2UgaWYgKGRhdGEgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VEaWN0RGF0YShkYXRhKVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcGFyc2VEaWN0RGF0YSAoZGF0YSkge1xuICAgIHZhciBleGVjdXRlLCByZXNcbiAgICByZXMgPSBfb3B0S2V5KCdyZXN1bHQnLCBkYXRhKVxuXG4gICAgaWYgKHR5cGVvZiByZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMucmVzdWx0RnVuY3QgPSByZXNcbiAgICB9IGVsc2UgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLnJlc3VsdFN0ciA9IHJlc1xuICAgICAgdGhpcy5vcHRpb25zLnBhcnNlID0gdHJ1ZVxuICAgIH1cblxuICAgIGV4ZWN1dGUgPSBfb3B0S2V5KCdleGVjdXRlJywgZGF0YSlcblxuICAgIGlmICh0eXBlb2YgZXhlY3V0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSBleGVjdXRlXG4gICAgfVxuXG4gICAgdGhpcy5hbGlhc09mID0gX29wdEtleSgnYWxpYXNPZicsIGRhdGEpXG4gICAgdGhpcy5jbHMgPSBfb3B0S2V5KCdjbHMnLCBkYXRhKVxuICAgIHRoaXMuZGVmYXVsdHMgPSBfb3B0S2V5KCdkZWZhdWx0cycsIGRhdGEsIHRoaXMuZGVmYXVsdHMpXG4gICAgdGhpcy5zZXRPcHRpb25zKGRhdGEpXG5cbiAgICBpZiAoJ2hlbHAnIGluIGRhdGEpIHtcbiAgICAgIHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKCdoZWxwJywgZGF0YS5oZWxwLCB0aGlzKSlcbiAgICB9XG5cbiAgICBpZiAoJ2ZhbGxiYWNrJyBpbiBkYXRhKSB7XG4gICAgICB0aGlzLmFkZENtZChuZXcgQ29tbWFuZCgnZmFsbGJhY2snLCBkYXRhLmZhbGxiYWNrLCB0aGlzKSlcbiAgICB9XG5cbiAgICBpZiAoJ2NtZHMnIGluIGRhdGEpIHtcbiAgICAgIHRoaXMuYWRkQ21kcyhkYXRhLmNtZHMpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGFkZENtZHMgKGNtZHMpIHtcbiAgICB2YXIgZGF0YSwgbmFtZSwgcmVzdWx0c1xuICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgZm9yIChuYW1lIGluIGNtZHMpIHtcbiAgICAgIGRhdGEgPSBjbWRzW25hbWVdXG4gICAgICByZXN1bHRzLnB1c2godGhpcy5hZGRDbWQobmV3IENvbW1hbmQobmFtZSwgZGF0YSwgdGhpcykpKVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cblxuICBhZGRDbWQgKGNtZCkge1xuICAgIHZhciBleGlzdHNcbiAgICBleGlzdHMgPSB0aGlzLmdldENtZChjbWQubmFtZSlcblxuICAgIGlmIChleGlzdHMgIT0gbnVsbCkge1xuICAgICAgdGhpcy5yZW1vdmVDbWQoZXhpc3RzKVxuICAgIH1cblxuICAgIGNtZC5zZXRQYXJlbnQodGhpcylcbiAgICB0aGlzLmNtZHMucHVzaChjbWQpXG4gICAgcmV0dXJuIGNtZFxuICB9XG5cbiAgcmVtb3ZlQ21kIChjbWQpIHtcbiAgICB2YXIgaVxuXG4gICAgaWYgKChpID0gdGhpcy5jbWRzLmluZGV4T2YoY21kKSkgPiAtMSkge1xuICAgICAgdGhpcy5jbWRzLnNwbGljZShpLCAxKVxuICAgIH1cblxuICAgIHJldHVybiBjbWRcbiAgfVxuXG4gIGdldENtZCAoZnVsbG5hbWUpIHtcbiAgICB2YXIgY21kLCBqLCBsZW4sIG5hbWUsIHJlZiwgcmVmMSwgc3BhY2VcbiAgICB0aGlzLmluaXQoKTtcbiAgICBbc3BhY2UsIG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpXG5cbiAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIChyZWYgPSB0aGlzLmdldENtZChzcGFjZSkpICE9IG51bGwgPyByZWYuZ2V0Q21kKG5hbWUpIDogbnVsbFxuICAgIH1cblxuICAgIHJlZjEgPSB0aGlzLmNtZHNcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIGNtZCA9IHJlZjFbal1cblxuICAgICAgaWYgKGNtZC5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgIHJldHVybiBjbWRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRDbWREYXRhIChmdWxsbmFtZSwgZGF0YSkge1xuICAgIHJldHVybiB0aGlzLnNldENtZChmdWxsbmFtZSwgbmV3IENvbW1hbmQoZnVsbG5hbWUuc3BsaXQoJzonKS5wb3AoKSwgZGF0YSkpXG4gIH1cblxuICBzZXRDbWQgKGZ1bGxuYW1lLCBjbWQpIHtcbiAgICB2YXIgbmFtZSwgbmV4dCwgc3BhY2U7XG4gICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuXG4gICAgaWYgKHNwYWNlICE9IG51bGwpIHtcbiAgICAgIG5leHQgPSB0aGlzLmdldENtZChzcGFjZSlcblxuICAgICAgaWYgKG5leHQgPT0gbnVsbCkge1xuICAgICAgICBuZXh0ID0gdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoc3BhY2UpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSwgY21kKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZENtZChjbWQpXG4gICAgICByZXR1cm4gY21kXG4gICAgfVxuICB9XG5cbiAgYWRkRGV0ZWN0b3IgKGRldGVjdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZGV0ZWN0b3JzLnB1c2goZGV0ZWN0b3IpXG4gIH1cblxuICBzdGF0aWMgaW5pdENtZHMgKCkge1xuICAgIHZhciBqLCBsZW4sIHByb3ZpZGVyLCByZWYsIHJlc3VsdHNcbiAgICBDb21tYW5kLmNtZHMgPSBuZXcgQ29tbWFuZChudWxsLCB7XG4gICAgICBjbWRzOiB7XG4gICAgICAgIGhlbGxvOiB7XG4gICAgICAgICAgaGVscDogJ1wiSGVsbG8sIHdvcmxkIVwiIGlzIHR5cGljYWxseSBvbmUgb2YgdGhlIHNpbXBsZXN0IHByb2dyYW1zIHBvc3NpYmxlIGluXFxubW9zdCBwcm9ncmFtbWluZyBsYW5ndWFnZXMsIGl0IGlzIGJ5IHRyYWRpdGlvbiBvZnRlbiAoLi4uKSB1c2VkIHRvXFxudmVyaWZ5IHRoYXQgYSBsYW5ndWFnZSBvciBzeXN0ZW0gaXMgb3BlcmF0aW5nIGNvcnJlY3RseSAtd2lraXBlZGlhJyxcbiAgICAgICAgICByZXN1bHQ6ICdIZWxsbywgV29ybGQhJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICByZWYgPSB0aGlzLnByb3ZpZGVyc1xuICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBwcm92aWRlciA9IHJlZltqXVxuICAgICAgcmVzdWx0cy5wdXNoKHByb3ZpZGVyLnJlZ2lzdGVyKENvbW1hbmQuY21kcykpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuXG4gIHN0YXRpYyBzYXZlQ21kIChmdWxsbmFtZSwgZGF0YSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSlcbiAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZUluUGF0aCgnY21kcycsIGZ1bGxuYW1lLCBkYXRhKVxuICAgIH0pXG4gIH1cblxuICBzdGF0aWMgbG9hZENtZHMgKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2UubG9hZCgnY21kcycpXG4gICAgfSkudGhlbihzYXZlZENtZHMgPT4ge1xuICAgICAgdmFyIGRhdGEsIGZ1bGxuYW1lLCByZXN1bHRzXG5cbiAgICAgIGlmIChzYXZlZENtZHMgIT0gbnVsbCkge1xuICAgICAgICByZXN1bHRzID0gW11cblxuICAgICAgICBmb3IgKGZ1bGxuYW1lIGluIHNhdmVkQ21kcykge1xuICAgICAgICAgIGRhdGEgPSBzYXZlZENtZHNbZnVsbG5hbWVdXG4gICAgICAgICAgcmVzdWx0cy5wdXNoKENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHN0YXRpYyByZXNldFNhdmVkICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNhdmUoJ2NtZHMnLCB7fSlcbiAgfVxuXG4gIHN0YXRpYyBtYWtlVmFyQ21kIChuYW1lLCBiYXNlID0ge30pIHtcbiAgICBiYXNlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgIHZhciBwLCB2YWxcbiAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiBudWxsXG5cbiAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdmFsXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VcbiAgfVxuXG4gIHN0YXRpYyBtYWtlQm9vbFZhckNtZCAobmFtZSwgYmFzZSA9IHt9KSB7XG4gICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICB2YXIgcCwgdmFsXG4gICAgICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogbnVsbFxuXG4gICAgICBpZiAoISh2YWwgIT0gbnVsbCAmJiAodmFsID09PSAnMCcgfHwgdmFsID09PSAnZmFsc2UnIHx8IHZhbCA9PT0gJ25vJykpKSB7XG4gICAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VcbiAgfVxufVxuXG5Db21tYW5kLnByb3ZpZGVycyA9IFtdXG5Db21tYW5kLnN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG5cbmV4cG9ydHMuQ29tbWFuZCA9IENvbW1hbmRcbnZhciBCYXNlQ29tbWFuZCA9IGNsYXNzIEJhc2VDb21tYW5kIHtcbiAgY29uc3RydWN0b3IgKGluc3RhbmNlMSkge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTFcbiAgfVxuXG4gIGluaXQgKCkge31cblxuICByZXN1bHRJc0F2YWlsYWJsZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0ICE9IG51bGxcbiAgfVxuXG4gIGdldERlZmF1bHRzICgpIHtcbiAgICByZXR1cm4ge31cbiAgfVxuXG4gIGdldE9wdGlvbnMgKCkge1xuICAgIHJldHVybiB7fVxuICB9XG59XG5leHBvcnRzLkJhc2VDb21tYW5kID0gQmFzZUNvbW1hbmRcbiIsImNvbnN0IEFycmF5SGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL0FycmF5SGVscGVyJykuQXJyYXlIZWxwZXJcblxudmFyIGluZGV4T2YgPSBbXS5pbmRleE9mXG52YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3RvciAoY29kZXdhdmUpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmVcbiAgICB0aGlzLm5hbWVTcGFjZXMgPSBbXVxuICB9XG5cbiAgYWRkTmFtZVNwYWNlIChuYW1lKSB7XG4gICAgaWYgKGluZGV4T2YuY2FsbCh0aGlzLm5hbWVTcGFjZXMsIG5hbWUpIDwgMCkge1xuICAgICAgdGhpcy5uYW1lU3BhY2VzLnB1c2gobmFtZSlcbiAgICAgIHRoaXMuX25hbWVzcGFjZXMgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgYWRkTmFtZXNwYWNlcyAoc3BhY2VzKSB7XG4gICAgdmFyIGosIGxlbiwgcmVzdWx0cywgc3BhY2VcblxuICAgIGlmIChzcGFjZXMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3BhY2VzID09PSAnc3RyaW5nJykge1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXVxuICAgICAgfVxuXG4gICAgICByZXN1bHRzID0gW11cblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gc3BhY2VzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHNwYWNlID0gc3BhY2VzW2pdXG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZE5hbWVTcGFjZShzcGFjZSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTmFtZVNwYWNlIChuYW1lKSB7XG4gICAgdGhpcy5uYW1lU3BhY2VzID0gdGhpcy5uYW1lU3BhY2VzLmZpbHRlcihmdW5jdGlvbiAobikge1xuICAgICAgcmV0dXJuIG4gIT09IG5hbWVcbiAgICB9KVxuICB9XG5cbiAgZ2V0TmFtZVNwYWNlcyAoKSB7XG4gICAgdmFyIG5wY3NcblxuICAgIGlmICh0aGlzLl9uYW1lc3BhY2VzID09IG51bGwpIHtcbiAgICAgIG5wY3MgPSB0aGlzLm5hbWVTcGFjZXNcblxuICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KHRoaXMucGFyZW50LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLnVuaXF1ZShucGNzKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2VzXG4gIH1cblxuICBnZXRDbWQgKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBmaW5kZXJcbiAgICBmaW5kZXIgPSB0aGlzLmdldEZpbmRlcihjbWROYW1lLCBvcHRpb25zKVxuICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIH1cblxuICBnZXRGaW5kZXIgKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IENtZEZpbmRlciA9IENvbnRleHQuY21kRmluZGVyQ2xhc3NcbiAgICByZXR1cm4gbmV3IENtZEZpbmRlcihjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0aGlzLmlzUm9vdCgpLFxuICAgICAgY29kZXdhdmU6IHRoaXMuY29kZXdhdmUsXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSwgb3B0aW9ucykpXG4gIH1cblxuICBpc1Jvb3QgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9PSBudWxsXG4gIH1cblxuICBnZXRQYXJlbnRPclJvb3QgKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudCAoc3RyKSB7XG4gICAgdmFyIGNjXG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKClcblxuICAgIGlmIChjYy5pbmRleE9mKCclcycpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsIHN0cilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudExlZnQgKHN0ciA9ICcnKSB7XG4gICAgdmFyIGNjLCBpXG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKClcblxuICAgIGlmICgoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5zdWJzdHIoMCwgaSkgKyBzdHJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnRSaWdodCAoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGlcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKVxuXG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIHN0ciArIGNjLnN1YnN0cihpICsgMilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0ciArICcgJyArIGNjXG4gICAgfVxuICB9XG5cbiAgY21kSW5zdGFuY2VGb3IgKGNtZCkge1xuICAgIGNvbnN0IENtZEluc3RhbmNlID0gQ29udGV4dC5jbWRJbnN0YW5jZUNsYXNzXG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsIHRoaXMpXG4gIH1cblxuICBnZXRDb21tZW50Q2hhciAoKSB7XG4gICAgdmFyIGNoYXIsIGNtZCwgaW5zdCwgcmVzXG5cbiAgICBpZiAodGhpcy5jb21tZW50Q2hhciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhclxuICAgIH1cblxuICAgIGNtZCA9IHRoaXMuZ2V0Q21kKCdjb21tZW50JylcbiAgICBjaGFyID0gJzwhLS0gJXMgLS0+J1xuXG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBpbnN0ID0gdGhpcy5jbWRJbnN0YW5jZUZvcihjbWQpXG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnXG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpXG5cbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICBjaGFyID0gcmVzXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jb21tZW50Q2hhciA9IGNoYXJcbiAgICByZXR1cm4gdGhpcy5jb21tZW50Q2hhclxuICB9XG59XG5leHBvcnRzLkNvbnRleHQgPSBDb250ZXh0XG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuL0NvbW1hbmQnKS5Db21tYW5kXG5cbnZhciBFZGl0Q21kUHJvcCA9IGNsYXNzIEVkaXRDbWRQcm9wIHtcbiAgY29uc3RydWN0b3IgKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMsIGksIGtleSwgbGVuLCByZWYsIHZhbFxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIHZhcjogbnVsbCxcbiAgICAgIG9wdDogbnVsbCxcbiAgICAgIGZ1bmN0OiBudWxsLFxuICAgICAgZGF0YU5hbWU6IG51bGwsXG4gICAgICBzaG93RW1wdHk6IGZhbHNlLFxuICAgICAgY2FycmV0OiBmYWxzZVxuICAgIH1cbiAgICByZWYgPSBbJ3ZhcicsICdvcHQnLCAnZnVuY3QnXVxuXG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBrZXkgPSByZWZbaV1cblxuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIGRlZmF1bHRzLmRhdGFOYW1lID0gb3B0aW9uc1trZXldXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV1cblxuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0Q21kIChjbWRzKSB7XG4gICAgY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSlcbiAgfVxuXG4gIHdyaXRlRm9yIChwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIG9ialt0aGlzLmRhdGFOYW1lXSA9IHBhcnNlci52YXJzW3RoaXMubmFtZV1cbiAgICB9XG4gIH1cblxuICB2YWxGcm9tQ21kIChjbWQpIHtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLm9wdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZ2V0T3B0aW9uKHRoaXMub3B0KVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5mdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy5mdW5jdF0oKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy52YXIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kW3RoaXMudmFyXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3dGb3JDbWQgKGNtZCkge1xuICAgIHZhciB2YWxcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKVxuICAgIHJldHVybiB0aGlzLnNob3dFbXB0eSB8fCB2YWwgIT0gbnVsbFxuICB9XG5cbiAgZGlzcGxheSAoY21kKSB7XG4gICAgaWYgKHRoaXMuc2hvd0ZvckNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+JHt0aGlzLm5hbWV9fn5cXG4ke3RoaXMudmFsRnJvbUNtZChjbWQpIHx8ICcnfSR7dGhpcy5jYXJyZXQgPyAnfCcgOiAnJ31cXG5+fi8ke3RoaXMubmFtZX1+fmBcbiAgICB9XG4gIH1cbn1cbmV4cG9ydHMuRWRpdENtZFByb3AgPSBFZGl0Q21kUHJvcFxuRWRpdENtZFByb3Auc291cmNlID0gY2xhc3Mgc291cmNlIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICB2YWxGcm9tQ21kIChjbWQpIHtcbiAgICB2YXIgcmVzXG4gICAgcmVzID0gc3VwZXIudmFsRnJvbUNtZChjbWQpXG5cbiAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKC9cXHwvZywgJ3x8JylcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICBzZXRDbWQgKGNtZHMpIHtcbiAgICBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lLCB7XG4gICAgICBwcmV2ZW50UGFyc2VBbGw6IHRydWVcbiAgICB9KVxuICB9XG5cbiAgc2hvd0ZvckNtZCAoY21kKSB7XG4gICAgdmFyIHZhbFxuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIHRoaXMuc2hvd0VtcHR5ICYmIChjbWQgPT0gbnVsbCB8fCBjbWQuYWxpYXNPZiA9PSBudWxsIHx8IHZhbCAhPSBudWxsKVxuICB9XG59XG5FZGl0Q21kUHJvcC5zdHJpbmcgPSBjbGFzcyBzdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIGRpc3BsYXkgKGNtZCkge1xuICAgIGlmICh0aGlzLnZhbEZyb21DbWQoY21kKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfSAnJHt0aGlzLnZhbEZyb21DbWQoY21kKX0ke3RoaXMuY2FycmV0ID8gJ3wnIDogJyd9J35+YFxuICAgIH1cbiAgfVxufVxuRWRpdENtZFByb3AucmV2Qm9vbCA9IGNsYXNzIHJldkJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHNldENtZCAoY21kcykge1xuICAgIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQodGhpcy5uYW1lKVxuICB9XG5cbiAgd3JpdGVGb3IgKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgb2JqW3RoaXMuZGF0YU5hbWVdID0gIXBhcnNlci52YXJzW3RoaXMubmFtZV1cbiAgICB9XG4gIH1cblxuICBkaXNwbGF5IChjbWQpIHtcbiAgICB2YXIgdmFsXG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZClcblxuICAgIGlmICh2YWwgIT0gbnVsbCAmJiAhdmFsKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfX5+YFxuICAgIH1cbiAgfVxufVxuRWRpdENtZFByb3AuYm9vbCA9IGNsYXNzIGJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHNldENtZCAoY21kcykge1xuICAgIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQodGhpcy5uYW1lKVxuICB9XG5cbiAgZGlzcGxheSAoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfX5+YFxuICAgIH1cbiAgfVxufVxuIiwiXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG5jb25zdCBTdHJQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1N0clBvcycpLlN0clBvc1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKCcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJylcblxudmFyIEVkaXRvciA9IGNsYXNzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG51bGxcbiAgICB0aGlzLl9sYW5nID0gbnVsbFxuICB9XG5cbiAgYmluZGVkVG8gKGNvZGV3YXZlKSB7fVxuXG4gIHRleHQgKHZhbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHRleHRDaGFyQXQgKHBvcykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHRleHRMZW4gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHRleHRTdWJzdHIgKHN0YXJ0LCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBpbnNlcnRUZXh0QXQgKHRleHQsIHBvcykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHNwbGljZVRleHQgKHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBnZXRDdXJzb3JQb3MgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHNldEN1cnNvclBvcyAoc3RhcnQsIGVuZCA9IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBiZWdpblVuZG9BY3Rpb24gKCkge31cblxuICBlbmRVbmRvQWN0aW9uICgpIHt9XG5cbiAgZ2V0TGFuZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhbmdcbiAgfVxuXG4gIHNldExhbmcgKHZhbCkge1xuICAgIHRoaXMuX2xhbmcgPSB2YWxcbiAgfVxuXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdCAoKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGFsbG93TXVsdGlTZWxlY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgc2V0TXVsdGlTZWwgKHNlbGVjdGlvbnMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBnZXRNdWx0aVNlbCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgY2FuTGlzdGVuVG9DaGFuZ2UgKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIgKGNhbGxiYWNrKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIgKGNhbGxiYWNrKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgZ2V0TGluZUF0IChwb3MpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLmZpbmRMaW5lU3RhcnQocG9zKSwgdGhpcy5maW5kTGluZUVuZChwb3MpKVxuICB9XG5cbiAgZmluZExpbmVTdGFydCAocG9zKSB7XG4gICAgdmFyIHBcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFsnXFxuJ10sIC0xKVxuXG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcyArIDFcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gIH1cblxuICBmaW5kTGluZUVuZCAocG9zKSB7XG4gICAgdmFyIHBcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFsnXFxuJywgJ1xcciddKVxuXG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvc1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0TGVuKClcbiAgICB9XG4gIH1cblxuICBmaW5kQW55TmV4dCAoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICB2YXIgYmVzdFBvcywgYmVzdFN0ciwgaSwgbGVuLCBwb3MsIHN0cmksIHRleHRcblxuICAgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0LCB0aGlzLnRleHRMZW4oKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cigwLCBzdGFydClcbiAgICB9XG5cbiAgICBiZXN0UG9zID0gbnVsbFxuXG4gICAgZm9yIChpID0gMCwgbGVuID0gc3RyaW5ncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc3RyaSA9IHN0cmluZ3NbaV1cbiAgICAgIHBvcyA9IGRpcmVjdGlvbiA+IDAgPyB0ZXh0LmluZGV4T2Yoc3RyaSkgOiB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpXG5cbiAgICAgIGlmIChwb3MgIT09IC0xKSB7XG4gICAgICAgIGlmIChiZXN0UG9zID09IG51bGwgfHwgYmVzdFBvcyAqIGRpcmVjdGlvbiA+IHBvcyAqIGRpcmVjdGlvbikge1xuICAgICAgICAgIGJlc3RQb3MgPSBwb3NcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJlc3RTdHIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoZGlyZWN0aW9uID4gMCA/IGJlc3RQb3MgKyBzdGFydCA6IGJlc3RQb3MsIGJlc3RTdHIpXG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzIChyZXBsYWNlbWVudHMpIHtcbiAgICByZXR1cm4gcmVwbGFjZW1lbnRzLnJlZHVjZSgocHJvbWlzZSwgcmVwbCkgPT4ge1xuICAgICAgcmV0dXJuIHByb21pc2UudGhlbihvcHQgPT4ge1xuICAgICAgICByZXBsLndpdGhFZGl0b3IodGhpcylcbiAgICAgICAgcmVwbC5hcHBseU9mZnNldChvcHQub2Zmc2V0KVxuICAgICAgICByZXR1cm4gKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHJlcGwuYXBwbHkoKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnM6IG9wdC5zZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpLFxuICAgICAgICAgICAgb2Zmc2V0OiBvcHQub2Zmc2V0ICsgcmVwbC5vZmZzZXRBZnRlcih0aGlzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSwgKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHtcbiAgICAgIHNlbGVjdGlvbnM6IFtdLFxuICAgICAgb2Zmc2V0OiAwXG4gICAgfSkpLnRoZW4ob3B0ID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhvcHQuc2VsZWN0aW9ucylcbiAgICB9KS5yZXN1bHQoKVxuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zIChzZWxlY3Rpb25zKSB7XG4gICAgaWYgKHNlbGVjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHRoaXMuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldE11bHRpU2VsKHNlbGVjdGlvbnMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCwgc2VsZWN0aW9uc1swXS5lbmQpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5leHBvcnRzLkVkaXRvciA9IEVkaXRvclxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cblxuY29uc3QgTG9nZ2VyID0gY2xhc3MgTG9nZ2VyIHtcbiAgbG9nICguLi5hcmdzKSB7XG4gICAgdmFyIGksIGxlbiwgbXNnLCByZXN1bHRzXG5cbiAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbXNnID0gYXJnc1tpXVxuICAgICAgICByZXN1bHRzLnB1c2goY29uc29sZS5sb2cobXNnKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG4gIH1cblxuICBpc0VuYWJsZWQgKCkge1xuICAgIHJldHVybiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUgIT09IG51bGwgPyBjb25zb2xlLmxvZyA6IG51bGwpICE9IG51bGwgJiYgdGhpcy5lbmFibGVkICYmIExvZ2dlci5lbmFibGVkXG4gIH1cblxuICBydW50aW1lIChmdW5jdCwgbmFtZSA9ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgcmVzLCB0MCwgdDFcbiAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgcmVzID0gZnVuY3QoKVxuICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICBjb25zb2xlLmxvZyhgJHtuYW1lfSB0b29rICR7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLmApXG4gICAgcmV0dXJuIHJlc1xuICB9XG5cbiAgdG9Nb25pdG9yIChvYmosIG5hbWUsIHByZWZpeCA9ICcnKSB7XG4gICAgdmFyIGZ1bmN0XG4gICAgZnVuY3QgPSBvYmpbbmFtZV1cbiAgICBvYmpbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJnc1xuICAgICAgYXJncyA9IGFyZ3VtZW50c1xuICAgICAgcmV0dXJuIHRoaXMubW9uaXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdC5hcHBseShvYmosIGFyZ3MpXG4gICAgICB9LCBwcmVmaXggKyBuYW1lKVxuICAgIH1cbiAgfVxuXG4gIG1vbml0b3IgKGZ1bmN0LCBuYW1lKSB7XG4gICAgdmFyIHJlcywgdDAsIHQxXG4gICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlcyA9IGZ1bmN0KClcbiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG5cbiAgICBpZiAodGhpcy5tb25pdG9yRGF0YVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLmNvdW50KytcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwgKz0gdDEgLSB0MFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdID0ge1xuICAgICAgICBjb3VudDogMSxcbiAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICByZXN1bWUgKCkge1xuICAgIHJldHVybiBjb25zb2xlLmxvZyh0aGlzLm1vbml0b3JEYXRhKVxuICB9XG59XG5cbkxvZ2dlci5lbmFibGVkID0gdHJ1ZVxuTG9nZ2VyLnByb3RvdHlwZS5lbmFibGVkID0gdHJ1ZVxuTG9nZ2VyLnByb3RvdHlwZS5tb25pdG9yRGF0YSA9IHt9XG5cbmV4cG9ydHMuTG9nZ2VyID0gTG9nZ2VyXG4iLCJcbnZhciBPcHRpb25PYmplY3QgPSBjbGFzcyBPcHRpb25PYmplY3Qge1xuICBzZXRPcHRzIChvcHRpb25zLCBkZWZhdWx0cykge1xuICAgIHZhciBrZXksIHJlZiwgcmVzdWx0cywgdmFsXG4gICAgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgcmVmID0gdGhpcy5kZWZhdWx0c1xuICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc2V0T3B0KGtleSwgb3B0aW9uc1trZXldKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIHZhbCkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuXG4gIHNldE9wdCAoa2V5LCB2YWwpIHtcbiAgICB2YXIgcmVmXG5cbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IG51bGwpICE9IG51bGwpIHtcbiAgICAgIHRoaXNba2V5XSh2YWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIH1cbiAgfVxuXG4gIGdldE9wdCAoa2V5KSB7XG4gICAgdmFyIHJlZlxuXG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiBudWxsKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XVxuICAgIH1cbiAgfVxuXG4gIGdldE9wdHMgKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmRlZmF1bHRzKS5yZWR1Y2UoKG9wdHMsIGtleSkgPT4ge1xuICAgICAgb3B0c1trZXldID0gdGhpcy5nZXRPcHQoa2V5KVxuICAgICAgcmV0dXJuIG9wdHNcbiAgICB9LCB7fSlcbiAgfVxufVxuZXhwb3J0cy5PcHRpb25PYmplY3QgPSBPcHRpb25PYmplY3RcbiIsIlxuY29uc3QgQ21kSW5zdGFuY2UgPSByZXF1aXJlKCcuL0NtZEluc3RhbmNlJykuQ21kSW5zdGFuY2VcblxuY29uc3QgQm94SGVscGVyID0gcmVxdWlyZSgnLi9Cb3hIZWxwZXInKS5Cb3hIZWxwZXJcblxuY29uc3QgUGFyYW1QYXJzZXIgPSByZXF1aXJlKCcuL3N0cmluZ1BhcnNlcnMvUGFyYW1QYXJzZXInKS5QYXJhbVBhcnNlclxuXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG5jb25zdCBTdHJQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1N0clBvcycpLlN0clBvc1xuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnKS5SZXBsYWNlbWVudFxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IE5hbWVzcGFjZUhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInKS5OYW1lc3BhY2VIZWxwZXJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpLkNvbW1hbmRcblxuY29uc3QgT3B0aW9uYWxQcm9taXNlID0gcmVxdWlyZSgnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZScpXG5cbnZhciBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgPSBjbGFzcyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgZXh0ZW5kcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yIChjb2Rld2F2ZSwgcG9zMSwgc3RyMSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmVcbiAgICB0aGlzLnBvcyA9IHBvczFcbiAgICB0aGlzLnN0ciA9IHN0cjFcblxuICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHRoaXMuX2NoZWNrQ2xvc2VyKClcblxuICAgICAgdGhpcy5vcGVuaW5nID0gdGhpcy5zdHJcbiAgICAgIHRoaXMubm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cilcblxuICAgICAgdGhpcy5fc3BsaXRDb21wb25lbnRzKClcblxuICAgICAgdGhpcy5fZmluZENsb3NpbmcoKVxuXG4gICAgICB0aGlzLl9jaGVja0Vsb25nYXRlZCgpXG4gICAgfVxuICB9XG5cbiAgX2NoZWNrQ2xvc2VyICgpIHtcbiAgICB2YXIgZiwgbm9CcmFja2V0XG4gICAgbm9CcmFja2V0ID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cilcblxuICAgIGlmIChub0JyYWNrZXQuc3Vic3RyaW5nKDAsIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICYmIChmID0gdGhpcy5fZmluZE9wZW5pbmdQb3MoKSkpIHtcbiAgICAgIHRoaXMuY2xvc2luZ1BvcyA9IG5ldyBTdHJQb3ModGhpcy5wb3MsIHRoaXMuc3RyKVxuICAgICAgdGhpcy5wb3MgPSBmLnBvc1xuICAgICAgdGhpcy5zdHIgPSBmLnN0clxuICAgIH1cbiAgfVxuXG4gIF9maW5kT3BlbmluZ1BvcyAoKSB7XG4gICAgdmFyIGNsb3NpbmcsIGNtZE5hbWUsIG9wZW5pbmdcbiAgICBjbWROYW1lID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cikuc3Vic3RyaW5nKHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aClcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgY21kTmFtZVxuICAgIGNsb3NpbmcgPSB0aGlzLnN0clxuXG4gICAgY29uc3QgZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcywgb3BlbmluZywgY2xvc2luZywgLTEpXG4gICAgaWYgKGYpIHtcbiAgICAgIGYuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihmLnBvcywgdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcyArIGYuc3RyLmxlbmd0aCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZcbiAgICB9XG4gIH1cblxuICBfc3BsaXRDb21wb25lbnRzICgpIHtcbiAgICB2YXIgcGFydHNcbiAgICBwYXJ0cyA9IHRoaXMubm9CcmFja2V0LnNwbGl0KCcgJylcbiAgICB0aGlzLmNtZE5hbWUgPSBwYXJ0cy5zaGlmdCgpXG4gICAgdGhpcy5yYXdQYXJhbXMgPSBwYXJ0cy5qb2luKCcgJylcbiAgfVxuXG4gIF9wYXJzZVBhcmFtcyAocGFyYW1zKSB7XG4gICAgdmFyIG5hbWVUb1BhcmFtLCBwYXJzZXJcbiAgICBwYXJzZXIgPSBuZXcgUGFyYW1QYXJzZXIocGFyYW1zLCB7XG4gICAgICBhbGxvd2VkTmFtZWQ6IHRoaXMuZ2V0T3B0aW9uKCdhbGxvd2VkTmFtZWQnKSxcbiAgICAgIHZhcnM6IHRoaXMuY29kZXdhdmUudmFyc1xuICAgIH0pXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJzZXIucGFyYW1zXG4gICAgdGhpcy5uYW1lZCA9IE9iamVjdC5hc3NpZ24odGhpcy5nZXREZWZhdWx0cygpLCBwYXJzZXIubmFtZWQpXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgbmFtZVRvUGFyYW0gPSB0aGlzLmdldE9wdGlvbignbmFtZVRvUGFyYW0nKVxuXG4gICAgICBpZiAobmFtZVRvUGFyYW0gIT0gbnVsbCkge1xuICAgICAgICB0aGlzLm5hbWVkW25hbWVUb1BhcmFtXSA9IHRoaXMuY21kTmFtZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9maW5kQ2xvc2luZyAoKSB7XG4gICAgY29uc3QgZiA9IHRoaXMuX2ZpbmRDbG9zaW5nUG9zKClcbiAgICBpZiAoZikge1xuICAgICAgdGhpcy5jb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgZi5wb3MpKVxuICAgICAgdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBmLnBvcyArIGYuc3RyLmxlbmd0aClcbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmdQb3MgKCkge1xuICAgIHZhciBjbG9zaW5nLCBvcGVuaW5nXG5cbiAgICBpZiAodGhpcy5jbG9zaW5nUG9zICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3NcbiAgICB9XG5cbiAgICBjbG9zaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZE5hbWUgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHNcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWROYW1lXG5cbiAgICBjb25zdCBmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBvcGVuaW5nLCBjbG9zaW5nKVxuICAgIGlmIChmKSB7XG4gICAgICB0aGlzLmNsb3NpbmdQb3MgPSBmXG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUG9zXG4gICAgfVxuICB9XG5cbiAgX2NoZWNrRWxvbmdhdGVkICgpIHtcbiAgICB2YXIgZW5kUG9zLCBtYXgsIHJlZlxuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKClcbiAgICBtYXggPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0TGVuKClcblxuICAgIHdoaWxlIChlbmRQb3MgPCBtYXggJiYgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmRlY28pIHtcbiAgICAgIGVuZFBvcyArPSB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoXG4gICAgfVxuXG4gICAgaWYgKGVuZFBvcyA+PSBtYXggfHwgKHJlZiA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSkgPT09ICcgJyB8fCByZWYgPT09ICdcXG4nIHx8IHJlZiA9PT0gJ1xccicpIHtcbiAgICAgIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKVxuICAgIH1cbiAgfVxuXG4gIF9jaGVja0JveCAoKSB7XG4gICAgdmFyIGNsLCBjciwgZW5kUG9zXG5cbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwgJiYgdGhpcy5jb2Rld2F2ZS5pbkluc3RhbmNlLmNtZC5uYW1lID09PSAnY29tbWVudCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNsID0gdGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCgpXG4gICAgY3IgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpXG4gICAgZW5kUG9zID0gdGhpcy5nZXRFbmRQb3MoKSArIGNyLmxlbmd0aFxuXG4gICAgaWYgKHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MgLSBjbC5sZW5ndGgsIHRoaXMucG9zKSA9PT0gY2wgJiYgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MgLSBjci5sZW5ndGgsIGVuZFBvcykgPT09IGNyKSB7XG4gICAgICB0aGlzLnBvcyA9IHRoaXMucG9zIC0gY2wubGVuZ3RoXG4gICAgICB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGVuZFBvcylcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICAgIH0gZWxzZSBpZiAodGhpcy5nZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKS5pbmRleE9mKGNsKSA+IC0xICYmIHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzU3VmZml4KCkuaW5kZXhPZihjcikgPiAtMSkge1xuICAgICAgdGhpcy5pbkJveCA9IDFcbiAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICAgIH1cbiAgfVxuXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQgKCkge1xuICAgIHZhciBlY2wsIGVjciwgZWQsIHJlMSwgcmUyLCByZTNcblxuICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCgpKVxuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKVxuICAgICAgZWQgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29kZXdhdmUuZGVjbylcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2VjbH0oPzoke2VkfSkrXFxcXHMqKC4qPylcXFxccyooPzoke2VkfSkrJHtlY3J9JGAsICdnbScpXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKGBeXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxccj9cXG5gKVxuICAgICAgcmUzID0gbmV3IFJlZ0V4cChgXFxuXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzKiRgKVxuICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5jb250ZW50LnJlcGxhY2UocmUxLCAnJDEnKS5yZXBsYWNlKHJlMiwgJycpLnJlcGxhY2UocmUzLCAnJylcbiAgICB9XG4gIH1cblxuICBfZ2V0UGFyZW50Q21kcyAoKSB7XG4gICAgdmFyIHJlZlxuICAgIHRoaXMucGFyZW50ID0gKHJlZiA9IHRoaXMuY29kZXdhdmUuZ2V0RW5jbG9zaW5nQ21kKHRoaXMuZ2V0RW5kUG9zKCkpKSAhPSBudWxsID8gcmVmLmluaXQoKSA6IG51bGxcbiAgICByZXR1cm4gdGhpcy5wYXJlbnRcbiAgfVxuXG4gIHNldE11bHRpUG9zIChtdWx0aVBvcykge1xuICAgIHRoaXMubXVsdGlQb3MgPSBtdWx0aVBvc1xuICB9XG5cbiAgX2dldENtZE9iaiAoKSB7XG4gICAgdGhpcy5nZXRDbWQoKVxuXG4gICAgdGhpcy5fY2hlY2tCb3goKVxuXG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5yZW1vdmVJbmRlbnRGcm9tQ29udGVudCh0aGlzLmNvbnRlbnQpXG4gICAgcmV0dXJuIHN1cGVyLl9nZXRDbWRPYmooKVxuICB9XG5cbiAgX2luaXRQYXJhbXMgKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJzZVBhcmFtcyh0aGlzLnJhd1BhcmFtcylcbiAgfVxuXG4gIGdldENvbnRleHQgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQgfHwgdGhpcy5jb2Rld2F2ZS5jb250ZXh0XG4gIH1cblxuICBnZXRDbWQgKCkge1xuICAgIGlmICh0aGlzLmNtZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9nZXRQYXJlbnRDbWRzKClcblxuICAgICAgaWYgKHRoaXMubm9CcmFja2V0LnN1YnN0cmluZygwLCB0aGlzLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSB7XG4gICAgICAgIHRoaXMuY21kID0gQ29tbWFuZC5jbWRzLmdldENtZCgnY29yZTpub19leGVjdXRlJylcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jb2Rld2F2ZS5jb250ZXh0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSlcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5maW5kZXIuY29udGV4dFxuICAgICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKVxuXG4gICAgICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5jb250ZXh0LmFkZE5hbWVTcGFjZSh0aGlzLmNtZC5mdWxsTmFtZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNtZFxuICB9XG5cbiAgZ2V0RmluZGVyIChjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlclxuICAgIGZpbmRlciA9IHRoaXMuY29kZXdhdmUuY29udGV4dC5nZXRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogdGhpcy5fZ2V0UGFyZW50TmFtZXNwYWNlcygpXG4gICAgfSlcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzXG4gICAgcmV0dXJuIGZpbmRlclxuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMgKCkge1xuICAgIHZhciBuc3Bjcywgb2JqXG4gICAgbnNwY3MgPSBbXVxuICAgIG9iaiA9IHRoaXNcblxuICAgIHdoaWxlIChvYmoucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IG9iai5wYXJlbnRcblxuICAgICAgaWYgKG9iai5jbWQgIT0gbnVsbCAmJiBvYmouY21kLmZ1bGxOYW1lICE9IG51bGwpIHtcbiAgICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuc3Bjc1xuICB9XG5cbiAgX3JlbW92ZUJyYWNrZXQgKHN0cikge1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgsIHN0ci5sZW5ndGggLSB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKVxuICB9XG5cbiAgYWx0ZXJBbGlhc09mIChhbGlhc09mKSB7XG4gICAgY29uc3QgY21kTmFtZSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdCh0aGlzLmNtZE5hbWUpWzFdXG4gICAgcmV0dXJuIGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJywgY21kTmFtZSlcbiAgfVxuXG4gIGlzRW1wdHkgKCkge1xuICAgIHJldHVybiB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgfHwgdGhpcy5zdHIgPT09IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuYnJha2V0c1xuICB9XG5cbiAgZXhlY3V0ZSAoKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgIT0gbnVsbCAmJiB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcC53aGl0aGluT3BlbkJvdW5kcyh0aGlzLnBvcyArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aCgnJylcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IGJlZm9yZUZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKVxuICAgICAgaWYgKGJlZm9yZUZ1bmN0KSB7XG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh0aGlzLnJlc3VsdCgpKS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aChyZXMpXG4gICAgICAgICAgfVxuICAgICAgICB9KS5yZXN1bHQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRXhlY3V0ZUZ1bmN0KClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRFbmRQb3MgKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aFxuICB9XG5cbiAgZ2V0UG9zICgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpXG4gIH1cblxuICBnZXRPcGVuaW5nUG9zICgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLm9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKVxuICB9XG5cbiAgZ2V0SW5kZW50ICgpIHtcbiAgICB2YXIgaGVscGVyXG5cbiAgICBpZiAodGhpcy5pbmRlbnRMZW4gPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuaW5Cb3ggIT0gbnVsbCkge1xuICAgICAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dClcbiAgICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIucmVtb3ZlQ29tbWVudCh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gdGhpcy5wb3MgLSB0aGlzLmdldFBvcygpLnByZXZFT0woKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmluZGVudExlblxuICB9XG5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQgKHRleHQpIHtcbiAgICB2YXIgcmVnXG5cbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKCdeXFxcXHN7JyArIHRoaXMuZ2V0SW5kZW50KCkgKyAnfScsICdnbScpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgJycpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgfVxuICB9XG5cbiAgYWx0ZXJSZXN1bHRGb3JCb3ggKHJlcGwpIHtcbiAgICB2YXIgYm94LCBoZWxwZXIsIG9yaWdpbmFsLCByZXNcbiAgICBvcmlnaW5hbCA9IHJlcGwuY29weSgpXG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpXG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksIGZhbHNlKVxuXG4gICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCdyZXBsYWNlQm94JykpIHtcbiAgICAgIGJveCA9IGhlbHBlci5nZXRCb3hGb3JQb3Mob3JpZ2luYWwpO1xuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdXG4gICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5pbmRlbnRcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKClcbiAgICAgIHJlcGwuZW5kID0gb3JpZ2luYWwubmV4dEVPTCgpXG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIHRoaXMuY29kZXdhdmUubWFya2VyICsgcmVwbC50ZXh0ICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge1xuICAgICAgICBtdWx0aWxpbmU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIFtyZXBsLnByZWZpeCwgcmVwbC50ZXh0LCByZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQodGhpcy5jb2Rld2F2ZS5tYXJrZXIpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcGxcbiAgfVxuXG4gIGdldEN1cnNvckZyb21SZXN1bHQgKHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCBwXG4gICAgY3Vyc29yUG9zID0gcmVwbC5yZXNQb3NCZWZvcmVQcmVmaXgoKVxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwgJiYgdGhpcy5jb2Rld2F2ZS5jaGVja0NhcnJldCAmJiB0aGlzLmdldE9wdGlvbignY2hlY2tDYXJyZXQnKSkge1xuICAgICAgaWYgKChwID0gdGhpcy5jb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSkgIT0gbnVsbCkge1xuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0ICsgcmVwbC5wcmVmaXgubGVuZ3RoICsgcFxuICAgICAgfVxuXG4gICAgICByZXBsLnRleHQgPSB0aGlzLmNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpXG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnNvclBvc1xuICB9XG5cbiAgY2hlY2tNdWx0aSAocmVwbCkge1xuICAgIHZhciBpLCBqLCBsZW4sIG5ld1JlcGwsIG9yaWdpbmFsUG9zLCBvcmlnaW5hbFRleHQsIHBvcywgcmVmLCByZXBsYWNlbWVudHNcblxuICAgIGlmICh0aGlzLm11bHRpUG9zICE9IG51bGwgJiYgdGhpcy5tdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF1cbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KClcbiAgICAgIHJlZiA9IHRoaXMubXVsdGlQb3NcblxuICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgcG9zID0gcmVmW2ldXG5cbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1JlcGwgPSByZXBsLmNvcHkoKS5hcHBseU9mZnNldChwb3Muc3RhcnQgLSBvcmlnaW5hbFBvcylcblxuICAgICAgICAgIGlmIChuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09PSBvcmlnaW5hbFRleHQpIHtcbiAgICAgICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ld1JlcGwpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXBsYWNlbWVudHNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtyZXBsXVxuICAgIH1cbiAgfVxuXG4gIHJlcGxhY2VXaXRoICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQodGhpcy5wb3MsIHRoaXMuZ2V0RW5kUG9zKCksIHRleHQpKVxuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudCAocmVwbCkge1xuICAgIHZhciBjdXJzb3JQb3MsIHJlcGxhY2VtZW50c1xuICAgIHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcilcblxuICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYWx0ZXJSZXN1bHRGb3JCb3gocmVwbClcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgfVxuXG4gICAgY3Vyc29yUG9zID0gdGhpcy5nZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpXG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBQb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXVxuICAgIHJlcGxhY2VtZW50cyA9IHRoaXMuY2hlY2tNdWx0aShyZXBsKVxuICAgIHRoaXMucmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydFxuICAgIHRoaXMucmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKClcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB9XG59XG5leHBvcnRzLlBvc2l0aW9uZWRDbWRJbnN0YW5jZSA9IFBvc2l0aW9uZWRDbWRJbnN0YW5jZVxuIiwiXG52YXIgUHJvY2VzcyA9IGNsYXNzIFByb2Nlc3Mge1xufVxuZXhwb3J0cy5Qcm9jZXNzID0gUHJvY2Vzc1xuIiwiXG5jb25zdCBMb2dnZXIgPSByZXF1aXJlKCcuL0xvZ2dlcicpLkxvZ2dlclxuXG52YXIgU3RvcmFnZSA9IGNsYXNzIFN0b3JhZ2Uge1xuICBjb25zdHJ1Y3RvciAoZW5naW5lKSB7XG4gICAgdGhpcy5lbmdpbmUgPSBlbmdpbmVcbiAgfVxuXG4gIHNhdmUgKGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5zYXZlKGtleSwgdmFsKVxuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGggKHBhdGgsIGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5zYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKVxuICAgIH1cbiAgfVxuXG4gIGxvYWQgKGtleSkge1xuICAgIGlmICh0aGlzLmVuZ2luZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUubG9hZChrZXkpXG4gICAgfVxuICB9XG5cbiAgZW5naW5lQXZhaWxhYmxlICgpIHtcbiAgICBpZiAodGhpcy5lbmdpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dnZXIgPSB0aGlzLmxvZ2dlciB8fCBuZXcgTG9nZ2VyKClcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJylcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5TdG9yYWdlID0gU3RvcmFnZVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cblxuY29uc3QgVGV4dFBhcnNlciA9IHJlcXVpcmUoJy4vVGV4dFBhcnNlcicpLlRleHRQYXJzZXJcblxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3MnKS5Qb3NcblxudmFyIGlzRWxlbWVudFxudmFyIERvbUtleUxpc3RlbmVyID0gY2xhc3MgRG9tS2V5TGlzdGVuZXIge1xuICBzdGFydExpc3RlbmluZyAodGFyZ2V0KSB7XG4gICAgdmFyIG9ua2V5ZG93biwgb25rZXlwcmVzcywgb25rZXl1cCwgdGltZW91dFxuICAgIHRpbWVvdXQgPSBudWxsXG5cbiAgICBvbmtleWRvd24gPSBlID0+IHtcbiAgICAgIGlmICgoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgfHwgdGhpcy5vYmogPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpICYmIGUua2V5Q29kZSA9PT0gNjkgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgIGlmICh0aGlzLm9uQWN0aXZhdGlvbktleSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BY3RpdmF0aW9uS2V5KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIG9ua2V5dXAgPSBlID0+IHtcbiAgICAgIGlmICh0aGlzLm9uQW55Q2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvbmtleXByZXNzID0gZSA9PiB7XG4gICAgICBpZiAodGltZW91dCAhPSBudWxsKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KVxuICAgICAgfVxuXG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9uQW55Q2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFueUNoYW5nZShlKVxuICAgICAgICB9XG4gICAgICB9LCAxMDApXG4gICAgfVxuXG4gICAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bilcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9ua2V5dXApXG4gICAgICByZXR1cm4gdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgb25rZXlwcmVzcylcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5hdHRhY2hFdmVudCkge1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KCdvbmtleWRvd24nLCBvbmtleWRvd24pXG4gICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoJ29ua2V5dXAnLCBvbmtleXVwKVxuICAgICAgcmV0dXJuIHRhcmdldC5hdHRhY2hFdmVudCgnb25rZXlwcmVzcycsIG9ua2V5cHJlc3MpXG4gICAgfVxuICB9XG59XG5leHBvcnRzLkRvbUtleUxpc3RlbmVyID0gRG9tS2V5TGlzdGVuZXJcblxuaXNFbGVtZW50ID0gZnVuY3Rpb24gKG9iaikge1xuICB0cnkge1xuICAgIC8vIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tKVxuICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAvLyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuXG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygb2JqLnN0eWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT09ICdvYmplY3QnXG4gIH1cbn1cblxudmFyIFRleHRBcmVhRWRpdG9yID0gY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyIHtcbiAgY29uc3RydWN0b3IgKHRhcmdldDEpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQxXG4gICAgdGhpcy5vYmogPSBpc0VsZW1lbnQodGhpcy50YXJnZXQpID8gdGhpcy50YXJnZXQgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldClcblxuICAgIGlmICh0aGlzLm9iaiA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RleHRBcmVhIG5vdCBmb3VuZCcpXG4gICAgfVxuXG4gICAgdGhpcy5uYW1lc3BhY2UgPSAndGV4dGFyZWEnXG4gICAgdGhpcy5jaGFuZ2VMaXN0ZW5lcnMgPSBbXVxuICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudCA9IDBcbiAgfVxuXG4gIG9uQW55Q2hhbmdlIChlKSB7XG4gICAgdmFyIGNhbGxiYWNrLCBqLCBsZW4xLCByZWYsIHJlc3VsdHNcblxuICAgIGlmICh0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPD0gMCkge1xuICAgICAgcmVmID0gdGhpcy5jaGFuZ2VMaXN0ZW5lcnNcbiAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICBjYWxsYmFjayA9IHJlZltqXVxuICAgICAgICByZXN1bHRzLnB1c2goY2FsbGJhY2soKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50LS1cblxuICAgICAgaWYgKHRoaXMub25Ta2lwZWRDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vblNraXBlZENoYW5nZSgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2tpcENoYW5nZUV2ZW50IChuYiA9IDEpIHtcbiAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgKz0gbmJcbiAgfVxuXG4gIGJpbmRlZFRvIChjb2Rld2F2ZSkge1xuICAgIHRoaXMub25BY3RpdmF0aW9uS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNvZGV3YXZlLm9uQWN0aXZhdGlvbktleSgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpXG4gIH1cblxuICBzZWxlY3Rpb25Qcm9wRXhpc3RzICgpIHtcbiAgICByZXR1cm4gJ3NlbGVjdGlvblN0YXJ0JyBpbiB0aGlzLm9ialxuICB9XG5cbiAgaGFzRm9jdXMgKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLm9ialxuICB9XG5cbiAgdGV4dCAodmFsKSB7XG4gICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICBpZiAoIXRoaXMudGV4dEV2ZW50Q2hhbmdlKHZhbCkpIHtcbiAgICAgICAgdGhpcy5vYmoudmFsdWUgPSB2YWxcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vYmoudmFsdWVcbiAgfVxuXG4gIHNwbGljZVRleHQgKHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0RXZlbnRDaGFuZ2UodGV4dCwgc3RhcnQsIGVuZCkgfHwgdGhpcy5zcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHN1cGVyLnNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dClcbiAgfVxuXG4gIHRleHRFdmVudENoYW5nZSAodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSB7XG4gICAgdmFyIGV2ZW50XG5cbiAgICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQgIT0gbnVsbCkge1xuICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50JylcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQgIT0gbnVsbCAmJiBldmVudC5pbml0VGV4dEV2ZW50ICE9IG51bGwgJiYgZXZlbnQuaXNUcnVzdGVkICE9PSBmYWxzZSkge1xuICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpXG4gICAgICB9XG5cbiAgICAgIGlmICh0ZXh0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgaWYgKHN0YXJ0ICE9PSAwKSB7XG4gICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihzdGFydCAtIDEsIHN0YXJ0KVxuICAgICAgICAgIHN0YXJ0LS1cbiAgICAgICAgfSBlbHNlIGlmIChlbmQgIT09IHRoaXMudGV4dExlbigpKSB7XG4gICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihlbmQsIGVuZCArIDEpXG4gICAgICAgICAgZW5kKytcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBldmVudC5pbml0VGV4dEV2ZW50KCd0ZXh0SW5wdXQnLCB0cnVlLCB0cnVlLCBudWxsLCB0ZXh0LCA5KSAvLyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcblxuICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICB0aGlzLm9iai5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgICAgdGhpcy5za2lwQ2hhbmdlRXZlbnQoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCAodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSB7XG4gICAgaWYgKGRvY3VtZW50LmV4ZWNDb21tYW5kICE9IG51bGwpIHtcbiAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICBlbmQgPSB0aGlzLnRleHRMZW4oKVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIHJldHVybiBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0ZXh0KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICBnZXRDdXJzb3JQb3MgKCkge1xuICAgIGlmICh0aGlzLnRtcEN1cnNvclBvcyAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy50bXBDdXJzb3JQb3NcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNGb2N1cykge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJvcEV4aXN0cykge1xuICAgICAgICByZXR1cm4gbmV3IFBvcyh0aGlzLm9iai5zZWxlY3Rpb25TdGFydCwgdGhpcy5vYmouc2VsZWN0aW9uRW5kKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldEN1cnNvclBvc0ZhbGxiYWNrICgpIHtcbiAgICB2YXIgbGVuLCBwb3MsIHJuZywgc2VsXG5cbiAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKVxuXG4gICAgICBpZiAoc2VsLnBhcmVudEVsZW1lbnQoKSA9PT0gdGhpcy5vYmopIHtcbiAgICAgICAgcm5nID0gdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcm5nLm1vdmVUb0Jvb2ttYXJrKHNlbC5nZXRCb29rbWFyaygpKVxuICAgICAgICBsZW4gPSAwXG5cbiAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKCdFbmRUb1N0YXJ0Jywgcm5nKSA+IDApIHtcbiAgICAgICAgICBsZW4rK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKCdjaGFyYWN0ZXInLCAtMSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJuZy5zZXRFbmRQb2ludCgnU3RhcnRUb1N0YXJ0JywgdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKCkpXG4gICAgICAgIHBvcyA9IG5ldyBQb3MoMCwgbGVuKVxuXG4gICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cygnRW5kVG9TdGFydCcsIHJuZykgPiAwKSB7XG4gICAgICAgICAgcG9zLnN0YXJ0KytcbiAgICAgICAgICBwb3MuZW5kKytcbiAgICAgICAgICBybmcubW92ZUVuZCgnY2hhcmFjdGVyJywgLTEpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcG9zXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0Q3Vyc29yUG9zIChzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBlbmQgPSBzdGFydFxuICAgIH1cblxuICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgIHRoaXMudG1wQ3Vyc29yUG9zID0gbmV3IFBvcyhzdGFydCwgZW5kKVxuICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBudWxsXG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICB9LCAxKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpXG4gICAgfVxuICB9XG5cbiAgc2V0Q3Vyc29yUG9zRmFsbGJhY2sgKHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgcm5nXG5cbiAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgcm5nLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgc3RhcnQpXG4gICAgICBybmcuY29sbGFwc2UoKVxuICAgICAgcm5nLm1vdmVFbmQoJ2NoYXJhY3RlcicsIGVuZCAtIHN0YXJ0KVxuICAgICAgcmV0dXJuIHJuZy5zZWxlY3QoKVxuICAgIH1cbiAgfVxuXG4gIGdldExhbmcgKCkge1xuICAgIGlmICh0aGlzLl9sYW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbGFuZ1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpKSB7XG4gICAgICByZXR1cm4gdGhpcy5vYmouZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKVxuICAgIH1cbiAgfVxuXG4gIHNldExhbmcgKHZhbCkge1xuICAgIHRoaXMuX2xhbmcgPSB2YWxcbiAgICByZXR1cm4gdGhpcy5vYmouc2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnLCB2YWwpXG4gIH1cblxuICBjYW5MaXN0ZW5Ub0NoYW5nZSAoKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmNoYW5nZUxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKVxuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIgKGNhbGxiYWNrKSB7XG4gICAgdmFyIGlcblxuICAgIGlmICgoaSA9IHRoaXMuY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpXG4gICAgfVxuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHMgKHJlcGxhY2VtZW50cykge1xuICAgIGlmIChyZXBsYWNlbWVudHMubGVuZ3RoID4gMCAmJiByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucy5sZW5ndGggPCAxKSB7XG4gICAgICByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucyA9IFt0aGlzLmdldEN1cnNvclBvcygpXVxuICAgIH1cblxuICAgIHJldHVybiBzdXBlci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIH1cbn1cblxuVGV4dEFyZWFFZGl0b3IucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nID0gRG9tS2V5TGlzdGVuZXIucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nXG5cbmV4cG9ydHMuVGV4dEFyZWFFZGl0b3IgPSBUZXh0QXJlYUVkaXRvclxuIiwiXG5jb25zdCBFZGl0b3IgPSByZXF1aXJlKCcuL0VkaXRvcicpLkVkaXRvclxuXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG52YXIgVGV4dFBhcnNlciA9IGNsYXNzIFRleHRQYXJzZXIgZXh0ZW5kcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvciAoX3RleHQpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5fdGV4dCA9IF90ZXh0XG4gIH1cblxuICB0ZXh0ICh2YWwpIHtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHQgPSB2YWxcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGV4dFxuICB9XG5cbiAgdGV4dENoYXJBdCAocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpW3Bvc11cbiAgfVxuXG4gIHRleHRMZW4gKHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS5sZW5ndGhcbiAgfVxuXG4gIHRleHRTdWJzdHIgKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gIH1cblxuICBpbnNlcnRUZXh0QXQgKHRleHQsIHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQodGhpcy50ZXh0KCkuc3Vic3RyaW5nKDAsIHBvcykgKyB0ZXh0ICsgdGhpcy50ZXh0KCkuc3Vic3RyaW5nKHBvcywgdGhpcy50ZXh0KCkubGVuZ3RoKSlcbiAgfVxuXG4gIHNwbGljZVRleHQgKHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnNsaWNlKDAsIHN0YXJ0KSArICh0ZXh0IHx8ICcnKSArIHRoaXMudGV4dCgpLnNsaWNlKGVuZCkpXG4gIH1cblxuICBnZXRDdXJzb3JQb3MgKCkge1xuICAgIHJldHVybiB0aGlzLnRhcmdldFxuICB9XG5cbiAgc2V0Q3Vyc29yUG9zIChzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBlbmQgPSBzdGFydFxuICAgIH1cblxuICAgIHRoaXMudGFyZ2V0ID0gbmV3IFBvcyhzdGFydCwgZW5kKVxuICAgIHJldHVybiB0aGlzLnRhcmdldFxuICB9XG59XG5leHBvcnRzLlRleHRQYXJzZXIgPSBUZXh0UGFyc2VyXG4iLCIndXNlIHN0cmljdCdcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSlcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ29kZXdhdmUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBDb2Rld2F2ZVxuICB9XG59KVxuXG5jb25zdCBDb2Rld2F2ZSA9IHJlcXVpcmUoJy4vQ29kZXdhdmUnKS5Db2Rld2F2ZVxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBDb3JlQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXInKS5Db3JlQ29tbWFuZFByb3ZpZGVyXG5cbmNvbnN0IEpzQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyJykuSnNDb21tYW5kUHJvdmlkZXJcblxuY29uc3QgUGhwQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL1BocENvbW1hbmRQcm92aWRlcicpLlBocENvbW1hbmRQcm92aWRlclxuXG5jb25zdCBIdG1sQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXInKS5IdG1sQ29tbWFuZFByb3ZpZGVyXG5cbmNvbnN0IEZpbGVDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKCcuL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlcicpLkZpbGVDb21tYW5kUHJvdmlkZXJcblxuY29uc3QgU3RyaW5nQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlcicpLlN0cmluZ0NvbW1hbmRQcm92aWRlclxuXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG5jb25zdCBXcmFwcGVkUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9XcmFwcGVkUG9zJykuV3JhcHBlZFBvc1xuXG5jb25zdCBMb2NhbFN0b3JhZ2VFbmdpbmUgPSByZXF1aXJlKCcuL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZScpLkxvY2FsU3RvcmFnZUVuZ2luZVxuXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBDbWRJbnN0YW5jZSA9IHJlcXVpcmUoJy4vQ21kSW5zdGFuY2UnKS5DbWRJbnN0YW5jZVxuXG5jb25zdCBDbWRGaW5kZXIgPSByZXF1aXJlKCcuL0NtZEZpbmRlcicpLkNtZEZpbmRlclxuXG5Db250ZXh0LmNtZEluc3RhbmNlQ2xhc3MgPSBDbWRJbnN0YW5jZVxuQ29udGV4dC5jbWRGaW5kZXJDbGFzcyA9IENtZEZpbmRlclxuXG5Qb3Mud3JhcENsYXNzID0gV3JhcHBlZFBvc1xuQ29kZXdhdmUuaW5zdGFuY2VzID0gW11cbkNvbW1hbmQucHJvdmlkZXJzID0gW25ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpLCBuZXcgUGhwQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBGaWxlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBTdHJpbmdDb21tYW5kUHJvdmlkZXIoKV1cblxuaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlRW5naW5lKClcbn1cbiIsIlxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5Db21tYW5kXG5jb25zdCBCYXNlQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5CYXNlQ29tbWFuZFxuXG5jb25zdCBMYW5nRGV0ZWN0b3IgPSByZXF1aXJlKCcuLi9kZXRlY3RvcnMvTGFuZ0RldGVjdG9yJykuTGFuZ0RldGVjdG9yXG5cbmNvbnN0IEFsd2F5c0VuYWJsZWQgPSByZXF1aXJlKCcuLi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZCcpLkFsd2F5c0VuYWJsZWRcblxuY29uc3QgQm94SGVscGVyID0gcmVxdWlyZSgnLi4vQm94SGVscGVyJykuQm94SGVscGVyXG5cbmNvbnN0IEVkaXRDbWRQcm9wID0gcmVxdWlyZSgnLi4vRWRpdENtZFByb3AnKS5FZGl0Q21kUHJvcFxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBQYXRoSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9QYXRoSGVscGVyJykuUGF0aEhlbHBlclxuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxudmFyIEJveENtZCwgQ2xvc2VDbWQsIEVkaXRDbWQsIEVtbWV0Q21kLCBOYW1lU3BhY2VDbWQsIFRlbXBsYXRlQ21kLCBhbGlhc0NvbW1hbmQsIGV4ZWNfcGFyZW50LCBnZXRDb21tYW5kLCBnZXRDb250ZW50LCBnZXRQYXJhbSwgaGVscCwgbGlzdENvbW1hbmQsIG5vX2V4ZWN1dGUsIHF1b3RlX2NhcnJldCwgcmVtb3ZlQ29tbWFuZCwgcmVuYW1lQ29tbWFuZCwgc2V0Q29tbWFuZCwgc3RvcmVKc29uQ29tbWFuZFxudmFyIENvcmVDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBDb3JlQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIgKGNtZHMpIHtcbiAgICB2YXIgY29yZVxuICAgIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKVxuICAgIGNtZHMuYWRkRGV0ZWN0b3IobmV3IEFsd2F5c0VuYWJsZWQoJ2NvcmUnKSlcbiAgICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSlcbiAgICByZXR1cm4gY29yZS5hZGRDbWRzKHtcbiAgICAgIGhlbHA6IHtcbiAgICAgICAgcmVwbGFjZUJveDogdHJ1ZSxcbiAgICAgICAgcmVzdWx0OiBoZWxwLFxuICAgICAgICBwYXJzZTogdHJ1ZSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ2NtZCddLFxuICAgICAgICBoZWxwOiAnVG8gZ2V0IGhlbHAgb24gYSBwZWNpZmljIGNvbW1hbmQsIGRvIDpcXG5+fmhlbHAgaGVsbG9+fiAoaGVsbG8gYmVpbmcgdGhlIGNvbW1hbmQpJyxcbiAgICAgICAgY21kczoge1xuICAgICAgICAgIG92ZXJ2aWV3OiB7XG4gICAgICAgICAgICByZXBsYWNlQm94OiB0cnVlLFxuICAgICAgICAgICAgcmVzdWx0OiAnfn5ib3h+flxcbn5+cXVvdGVfY2FycmV0fn5cXG4gIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXFxuIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xcbi8gL19fLyBfIFxcXFwvIF9gIC8gLV9cXFxcIFxcXFwvXFxcXC8gLyBfYCBcXFxcIFYgLyAtXy9cXG5cXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XFxuVGhlIHRleHQgZWRpdG9yIGhlbHBlclxcbn5+L3F1b3RlX2NhcnJldH5+XFxuXFxuV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcXG55b3VyIHRleHQgZWRpdG9yLiBUaGVzZSBjb21tYW5kcyBtdXN0IGJlIHBsYWNlZCBiZXR3ZWVuIHR3byBcXG5wYWlycyBvZiBcIn5cIiAodGlsZGUpIGFuZCB0aGVuLCB0aGV5IGNhbiBiZSBleGVjdXRlZCBieSBwcmVzc2luZyBcXG5cImN0cmxcIitcInNoaWZ0XCIrXCJlXCIsIHdpdGggeW91ciBjdXJzb3IgaW5zaWRlIHRoZSBjb21tYW5kXFxuRXg6IH5+IWhlbGxvfn5cXG5cXG5Zb3UgZG9udCBuZWVkIHRvIGFjdHVhbGx5IHR5cGUgYW55IFwiflwiICh0aWxkZSkuIFxcblByZXNzaW5nIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiB3aWxsIGFkZCB0aGVtIGlmIHlvdSBhcmUgbm90IGFscmVhZHlcXG53aXRoaW4gYSBjb21tYW5kLlxcblxcbkNvZGV3YXZlIGRvZXMgbm90IHVzZSBVSSB0byBkaXNwbGF5IGFueSBpbmZvcm1hdGlvbi4gXFxuSW5zdGVhZCwgaXQgdXNlcyB0ZXh0IHdpdGhpbiBjb2RlIGNvbW1lbnRzIHRvIG1pbWljIFVJcy4gXFxuVGhlIGdlbmVyYXRlZCBjb21tZW50IGJsb2NrcyB3aWxsIGJlIHJlZmVycmVkIHRvIGFzIHdpbmRvd3MgXFxuaW4gdGhlIGhlbHAgc2VjdGlvbnMuXFxuXFxuVG8gY2xvc2UgdGhpcyB3aW5kb3cgKGkuZS4gcmVtb3ZlIHRoaXMgY29tbWVudCBibG9jayksIHByZXNzIFxcblwiY3RybFwiK1wic2hpZnRcIitcImVcIiB3aXRoIHlvdXIgY3Vyc29yIG9uIHRoZSBsaW5lIGJlbGxvdy5cXG5+fiFjbG9zZXx+flxcblxcblVzZSB0aGUgZm9sbG93aW5nIGNvbW1hbmQgZm9yIGEgd2Fsa3Rocm91Z2ggb2Ygc29tZSBvZiB0aGUgbWFueVxcbmZlYXR1cmVzIG9mIENvZGV3YXZlXFxufn4haGVscDpnZXRfc3RhcnRlZH5+IG9yIH5+IWhlbHA6ZGVtb35+XFxuXFxuTGlzdCBvZiBhbGwgaGVscCBzdWJqZWN0cyBcXG5+fiFoZWxwOnN1YmplY3Rzfn4gb3Igfn4haGVscDpzdWJ+fiBcXG5cXG5+fiFjbG9zZX5+XFxufn4vYm94fn4nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdWJqZWN0czoge1xuICAgICAgICAgICAgcmVwbGFjZUJveDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3VsdDogJ35+Ym94fn5cXG5+fiFoZWxwfn5cXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxcbn5+IWhlbHA6c3ViamVjdHN+fiAofn4haGVscDpzdWJ+filcXG5+fiFoZWxwOmVkaXRpbmd+fiAofn4haGVscDplZGl0fn4pXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN1Yjoge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6aGVscDpzdWJqZWN0cydcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldF9zdGFydGVkOiB7XG4gICAgICAgICAgICByZXBsYWNlQm94OiB0cnVlLFxuICAgICAgICAgICAgcmVzdWx0OiAnfn5ib3h+flxcblRoZSBjbGFzc2ljIEhlbGxvIFdvcmxkLlxcbn5+IWhlbGxvfH5+XFxuXFxufn5oZWxwOmVkaXRpbmc6aW50cm9+flxcbn5+cXVvdGVfY2FycmV0fn5cXG5cXG5Gb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBjcmVhdGluZyB5b3VyIG93biBjb21tYW5kcywgc2VlOlxcbn5+IWhlbHA6ZWRpdGluZ35+XFxuXFxuQ29kZXdhdmUgY29tZXMgd2l0aCBtYW55IHByZS1leGlzdGluZyBjb21tYW5kcy4gSGVyZSBpcyBhbiBleGFtcGxlXFxub2YgSmF2YVNjcmlwdCBhYmJyZXZpYXRpb25zXFxufn4hanM6Zn5+XFxufn4hanM6aWZ+flxcbiAgfn4hanM6bG9nfn5cIn5+IWhlbGxvfn5cIn5+IS9qczpsb2d+flxcbn5+IS9qczppZn5+XFxufn4hL2pzOmZ+flxcblxcbkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxcbnVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cXG5+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXFxufn4hZW1tZXQgdWw+bGl+flxcbn5+IWVtbWV0IG0yIGNzc35+XFxuXFxuQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxcbmRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxcbn5+IWpzOmVhY2h+flxcbn5+IXBocDpvdXRlcjplYWNofn5cXG5+fiFwaHA6aW5uZXI6ZWFjaH5+XFxuXFxuU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXFxuZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcXG5hY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxcbmNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cXG5+fiFuYW1lc3BhY2V+flxcbn5+IWNvcmU6bmFtZXNwYWNlfn5cXG5cXG5Zb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxcbn5+IW5hbWVzcGFjZSBwaHB+flxcblxcbkNoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXFxufn4hbmFtZXNwYWNlfn5cXG5cXG5JbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXFxuY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcXG53aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxcblxcbn5+L3F1b3RlX2NhcnJldH5+XFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlbW86IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmhlbHA6Z2V0X3N0YXJ0ZWQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlZGl0aW5nOiB7XG4gICAgICAgICAgICBjbWRzOiB7XG4gICAgICAgICAgICAgIGludHJvOiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiAnQ29kZXdhdmUgYWxsb3dzIHlvdSB0byBtYWtlIHlvdXIgb3duIGNvbW1hbmRzIChvciBhYmJyZXZpYXRpb25zKSBcXG5wdXQgeW91ciBjb250ZW50IGluc2lkZSBcInNvdXJjZVwiIHRoZSBkbyBcInNhdmVcIi4gVHJ5IGFkZGluZyBhbnkgXFxudGV4dCB0aGF0IGlzIG9uIHlvdXIgbWluZC5cXG5+fiFlZGl0IG15X25ld19jb21tYW5kfH5+XFxuXFxuSWYgeW91IGRpZCB0aGUgbGFzdCBzdGVwIHJpZ2h0LCB5b3Ugc2hvdWxkIHNlZSB5b3VyIHRleHQgd2hlbiB5b3VcXG5kbyB0aGUgZm9sbG93aW5nIGNvbW1hbmQuIEl0IGlzIG5vdyBzYXZlZCBhbmQgeW91IGNhbiB1c2UgaXQgXFxud2hlbmV2ZXIgeW91IHdhbnQuXFxufn4hbXlfbmV3X2NvbW1hbmR+fidcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcGxhY2VCb3g6IHRydWUsXG4gICAgICAgICAgICByZXN1bHQ6IFwifn5ib3h+flxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5cXG5BbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcXFwiYm94XFxcIi4gXFxuVGhleSBhcmUgbWVhbnQgdG8gZGlzcGxheSB0ZXh0IHRoYXQgc2hvdWxkIG5vdCByZW1haW4gaW4geW91ciBjb2RlLiBcXG5UaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXFxuXFxcImNsb3NlXFxcIiBjYW4gYmUgdXNlZCB0byByZW1vdmUgdGhlbSByYXBpZGx5LiBZb3UgY2FuIG1ha2UgeW91ciBvd24gXFxuY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5Llxcbn5+IWJveH5+XFxuVGhlIGJveCB3aWxsIHNjYWxlIHdpdGggdGhlIGNvbnRlbnQgeW91IHB1dCBpbiBpdFxcbn5+IWNsb3NlfH5+XFxufn4hL2JveH5+XFxuXFxufn5xdW90ZV9jYXJyZXR+flxcbldoZW4geW91IGNyZWF0ZSBhIGNvbW1hbmQsIHlvdSBtYXkgd2FudCB0byBzcGVjaWZ5IHdoZXJlIHRoZSBjdXJzb3IgXFxud2lsbCBiZSBsb2NhdGVkIG9uY2UgdGhlIGNvbW1hbmQgaXMgZXhwYW5kZWQuIFRvIGRvIHRoYXQsIHVzZSBhIFxcXCJ8XFxcIiBcXG4oVmVydGljYWwgYmFyKS4gVXNlIDIgb2YgdGhlbSBpZiB5b3Ugd2FudCB0byBwcmludCB0aGUgYWN0dWFsIFxcbmNoYXJhY3Rlci5cXG5+fiFib3h+flxcbm9uZSA6IHwgXFxudHdvIDogfHxcXG5+fiEvYm94fn5cXG5cXG5Zb3UgY2FuIGFsc28gdXNlIHRoZSBcXFwiZXNjYXBlX3BpcGVzXFxcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxcbnZlcnRpY2FsIGJhcnMgdGhhdCBhcmUgYmV0d2VlbiBpdHMgb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzXFxufn4hZXNjYXBlX3BpcGVzfn5cXG58XFxufn4hL2VzY2FwZV9waXBlc35+XFxuXFxuQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cXG5JZiB5b3Ugd2FudCB0byBwcmludCBhIGNvbW1hbmQgd2l0aG91dCBoYXZpbmcgaXQgZXhwYW5kIHdoZW4gXFxudGhlIHBhcmVudCBjb21tYW5kIGlzIGV4cGFuZGVkLCB1c2UgYSBcXFwiIVxcXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxcbn5+ISFoZWxsb35+XFxuXFxuRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXFxudGhlIFxcXCJjb250ZW50XFxcIiBjb21tYW5kLiBcXFwiY29udGVudFxcXCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XFxudGhhdCBpcyBiZXR3ZWVuIHRoZSB0YWdzLiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgaG93IGl0IGNhbiBiZSB1c2VkLlxcbn5+IWVkaXQgcGhwOmlubmVyOmlmfn5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZWRpdDoge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6aGVscDplZGl0aW5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbm90X2ZvdW5kOiAnfn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG5vX2V4ZWN1dGU6IHtcbiAgICAgICAgcmVzdWx0OiBub19leGVjdXRlLFxuICAgICAgICBoZWxwOiAnUHJldmVudCBldmVyeXRoaW5nIGluc2lkZSB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIGZyb20gZXhlY3V0aW5nJ1xuICAgICAgfSxcbiAgICAgIGVzY2FwZV9waXBlczoge1xuICAgICAgICByZXN1bHQ6IHF1b3RlX2NhcnJldCxcbiAgICAgICAgY2hlY2tDYXJyZXQ6IGZhbHNlLFxuICAgICAgICBoZWxwOiAnRXNjYXBlIGFsbCBjYXJyZXRzIChmcm9tIFwifFwiIHRvIFwifHxcIiknXG4gICAgICB9LFxuICAgICAgcXVvdGVfY2FycmV0OiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICAgIH0sXG4gICAgICBleGVjX3BhcmVudDoge1xuICAgICAgICBleGVjdXRlOiBleGVjX3BhcmVudCxcbiAgICAgICAgaGVscDogXCJFeGVjdXRlIHRoZSBmaXJzdCBjb21tYW5kIHRoYXQgd3JhcCB0aGlzIGluIGl0J3Mgb3BlbiBhbmQgY2xvc2UgdGFnXCJcbiAgICAgIH0sXG4gICAgICBjb250ZW50OiB7XG4gICAgICAgIHJlc3VsdDogZ2V0Q29udGVudCxcbiAgICAgICAgaGVscDogJ01haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gd2hhdCB3YXMgYmV0d2VlbiB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIG9mIGEgY29tbWFuZCdcbiAgICAgIH0sXG4gICAgICBib3g6IHtcbiAgICAgICAgY2xzOiBCb3hDbWQsXG4gICAgICAgIGhlbHA6IFwiQ3JlYXRlIHRoZSBhcHBhcmVuY2Ugb2YgYSBib3ggY29tcG9zZWQgZnJvbSBjaGFyYWN0ZXJzLiBcXG5Vc3VhbGx5IHdyYXBwZWQgaW4gYSBjb21tZW50LlxcblxcblRoZSBib3ggd2lsbCB0cnkgdG8gYWp1c3QgaXQncyBzaXplIGZyb20gdGhlIGNvbnRlbnRcIlxuICAgICAgfSxcbiAgICAgIGNsb3NlOiB7XG4gICAgICAgIGNsczogQ2xvc2VDbWQsXG4gICAgICAgIGhlbHA6ICdXaWxsIGNsb3NlIHRoZSBmaXJzdCBib3ggYXJvdW5kIHRoaXMnXG4gICAgICB9LFxuICAgICAgcGFyYW06IHtcbiAgICAgICAgcmVzdWx0OiBnZXRQYXJhbSxcbiAgICAgICAgaGVscDogJ01haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gYSBwYXJhbWV0ZXIgZnJvbSB0aGlzIGNvbW1hbmQgY2FsbFxcblxcbllvdSBjYW4gcGFzcyBhIG51bWJlciwgYSBzdHJpbmcsIG9yIGJvdGguIFxcbkEgbnVtYmVyIGZvciBhIHBvc2l0aW9uZWQgYXJndW1lbnQgYW5kIGEgc3RyaW5nXFxuZm9yIGEgbmFtZWQgcGFyYW1ldGVyJ1xuICAgICAgfSxcbiAgICAgIGVkaXQ6IHtcbiAgICAgICAgY21kczogRWRpdENtZC5zZXRDbWRzKHtcbiAgICAgICAgICBzYXZlOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBjbHM6IEVkaXRDbWQsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydjbWQnXSxcbiAgICAgICAgaGVscDogJ0FsbG93cyB0byBlZGl0IGEgY29tbWFuZC4gXFxuU2VlIH5+IWhlbHA6ZWRpdGluZ35+IGZvciBhIHF1aWNrIHR1dG9yaWFsJ1xuICAgICAgfSxcbiAgICAgIHJlbmFtZToge1xuICAgICAgICBjbWRzOiB7XG4gICAgICAgICAgbm90X2FwcGxpY2FibGU6ICd+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nLFxuICAgICAgICAgIG5vdF9mb3VuZDogJ35+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdDogcmVuYW1lQ29tbWFuZCxcbiAgICAgICAgcGFyc2U6IHRydWUsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydmcm9tJywgJ3RvJ10sXG4gICAgICAgIGhlbHA6IFwiQWxsb3dzIHRvIHJlbmFtZSBhIGNvbW1hbmQgYW5kIGNoYW5nZSBpdCdzIG5hbWVzcGFjZS4gXFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbi0gVGhlIGZpcnN0IHBhcmFtIGlzIHRoZSBvbGQgbmFtZVxcbi0gVGhlbiBzZWNvbmQgcGFyYW0gaXMgdGhlIG5ldyBuYW1lLCBpZiBpdCBoYXMgbm8gbmFtZXNwYWNlLFxcbiAgaXQgd2lsbCB1c2UgdGhlIG9uZSBmcm9tIHRoZSBvcmlnaW5hbCBjb21tYW5kLlxcblxcbmV4Ljogfn4hcmVuYW1lIG15X2NvbW1hbmQgbXlfY29tbWFuZDJ+flwiXG4gICAgICB9LFxuICAgICAgcmVtb3ZlOiB7XG4gICAgICAgIGNtZHM6IHtcbiAgICAgICAgICBub3RfYXBwbGljYWJsZTogJ35+Ym94fn5cXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+ficsXG4gICAgICAgICAgbm90X2ZvdW5kOiAnfn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgICAgfSxcbiAgICAgICAgcmVzdWx0OiByZW1vdmVDb21tYW5kLFxuICAgICAgICBwYXJzZTogdHJ1ZSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ2NtZCddLFxuICAgICAgICBoZWxwOiAnQWxsb3dzIHRvIHJlbW92ZSBhIGNvbW1hbmQuIFxcbllvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi4nXG4gICAgICB9LFxuICAgICAgYWxpYXM6IHtcbiAgICAgICAgY21kczoge1xuICAgICAgICAgIG5vdF9mb3VuZDogJ35+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdDogYWxpYXNDb21tYW5kLFxuICAgICAgICBwYXJzZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIG5hbWVzcGFjZToge1xuICAgICAgICBjbHM6IE5hbWVTcGFjZUNtZCxcbiAgICAgICAgaGVscDogJ1Nob3cgdGhlIGN1cnJlbnQgbmFtZXNwYWNlcy5cXG5cXG5BIG5hbWUgc3BhY2UgY291bGQgYmUgdGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlXFxub3Igb3RoZXIga2luZCBvZiBjb250ZXh0c1xcblxcbklmIHlvdSBwYXNzIGEgcGFyYW0gdG8gdGhpcyBjb21tYW5kLCBpdCB3aWxsIFxcbmFkZCB0aGUgcGFyYW0gYXMgYSBuYW1lc3BhY2UgZm9yIHRoZSBjdXJyZW50IGVkaXRvcidcbiAgICAgIH0sXG4gICAgICBuc3BjOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOm5hbWVzcGFjZSdcbiAgICAgIH0sXG4gICAgICBsaXN0OiB7XG4gICAgICAgIHJlc3VsdDogbGlzdENvbW1hbmQsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWyduYW1lJywgJ2JveCcsICdjb250ZXh0J10sXG4gICAgICAgIHJlcGxhY2VCb3g6IHRydWUsXG4gICAgICAgIHBhcnNlOiB0cnVlLFxuICAgICAgICBoZWxwOiAnTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcXG5cXG5Zb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcXG5ieSBkZWZhdWx0IGFsbCBjdXJlbnQgbmFtZXNwYWNlIHdpbGwgYmUgc2hvd24nXG4gICAgICB9LFxuICAgICAgbHM6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6bGlzdCdcbiAgICAgIH0sXG4gICAgICBnZXQ6IHtcbiAgICAgICAgcmVzdWx0OiBnZXRDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZSddLFxuICAgICAgICBoZWxwOiAnb3V0cHV0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlJ1xuICAgICAgfSxcbiAgICAgIHNldDoge1xuICAgICAgICByZXN1bHQ6IHNldENvbW1hbmQsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWyduYW1lJywgJ3ZhbHVlJywgJ3ZhbCddLFxuICAgICAgICBoZWxwOiAnc2V0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlJ1xuICAgICAgfSxcbiAgICAgIHN0b3JlX2pzb246IHtcbiAgICAgICAgcmVzdWx0OiBzdG9yZUpzb25Db21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZScsICdqc29uJ10sXG4gICAgICAgIGhlbHA6ICdzZXQgYSB2YXJpYWJsZSB3aXRoIHNvbWUganNvbiBkYXRhJ1xuICAgICAgfSxcbiAgICAgIGpzb246IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6c3RvcmVfanNvbidcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZToge1xuICAgICAgICBjbHM6IFRlbXBsYXRlQ21kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZScsICdzZXAnXSxcbiAgICAgICAgaGVscDogJ3JlbmRlciBhIHRlbXBsYXRlIGZvciBhIHZhcmlhYmxlXFxuXFxuSWYgdGhlIGZpcnN0IHBhcmFtIGlzIG5vdCBzZXQgaXQgd2lsbCB1c2UgYWxsIHZhcmlhYmxlcyBcXG5mb3IgdGhlIHJlbmRlclxcbklmIHRoZSB2YXJpYWJsZSBpcyBhbiBhcnJheSB0aGUgdGVtcGxhdGUgd2lsbCBiZSByZXBlYXRlZCBcXG5mb3IgZWFjaCBpdGVtc1xcblRoZSBgc2VwYCBwYXJhbSBkZWZpbmUgd2hhdCB3aWxsIHNlcGFyYXRlIGVhY2ggaXRlbSBcXG5hbmQgZGVmYXVsdCB0byBhIGxpbmUgYnJlYWsnXG4gICAgICB9LFxuICAgICAgZW1tZXQ6IHtcbiAgICAgICAgY2xzOiBFbW1ldENtZCxcbiAgICAgICAgaGVscDogJ0NvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy5cXG5cXG5QYXNzIHRoZSBFbW1ldCBhYmJyZXZpYXRpb24gYXMgYSBwYXJhbSB0byBleHBlbmQgaXQuJ1xuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbmV4cG9ydHMuQ29yZUNvbW1hbmRQcm92aWRlciA9IENvcmVDb21tYW5kUHJvdmlkZXJcblxuaGVscCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgY21kLCBjbWROYW1lLCBoZWxwQ21kLCBzdWJjb21tYW5kcywgdGV4dFxuICBjbWROYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSlcblxuICBpZiAoY21kTmFtZSAhPSBudWxsKSB7XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQoY21kTmFtZSlcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaGVscENtZCA9IGNtZC5nZXRDbWQoJ2hlbHAnKVxuICAgICAgdGV4dCA9IGhlbHBDbWQgPyBgfn4ke2hlbHBDbWQuZnVsbE5hbWV9fn5gIDogJ1RoaXMgY29tbWFuZCBoYXMgbm8gaGVscCB0ZXh0J1xuICAgICAgc3ViY29tbWFuZHMgPSBjbWQuY21kcy5sZW5ndGggPyBgXFxuU3ViLUNvbW1hbmRzIDpcXG5+fmxzICR7Y21kLmZ1bGxOYW1lfSBib3g6bm8gY29udGV4dDpub35+YCA6ICcnXG4gICAgICByZXR1cm4gYH5+Ym94fn5cXG5IZWxwIGZvciB+fiEke2NtZC5mdWxsTmFtZX1+fiA6XFxuXFxuJHt0ZXh0fVxcbiR7c3ViY29tbWFuZHN9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICd+fm5vdF9mb3VuZH5+J1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ35+aGVscDpvdmVydmlld35+J1xuICB9XG59XG5cbm5vX2V4ZWN1dGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIHJlZ1xuICByZWcgPSBuZXcgUmVnRXhwKCdeKCcgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSlcbiAgcmV0dXJuIGluc3RhbmNlLnN0ci5yZXBsYWNlKHJlZywgJyQxJylcbn1cblxucXVvdGVfY2FycmV0ID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHJldHVybiBpbnN0YW5jZS5jb250ZW50LnJlcGxhY2UoL1xcfC9nLCAnfHwnKVxufVxuXG5leGVjX3BhcmVudCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgcmVzXG5cbiAgaWYgKGluc3RhbmNlLnBhcmVudCAhPSBudWxsKSB7XG4gICAgcmVzID0gaW5zdGFuY2UucGFyZW50LmV4ZWN1dGUoKVxuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnRcbiAgICBpbnN0YW5jZS5yZXBsYWNlRW5kID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VFbmRcbiAgICByZXR1cm4gcmVzXG4gIH1cbn1cblxuZ2V0Q29udGVudCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICBjb25zdCBhZmZpeGVzRW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSwgZmFsc2UpXG4gIGNvbnN0IHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKVxuICBjb25zdCBzdWZmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJylcblxuICBpZiAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHByZWZpeCArIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmNvbnRlbnQgfHwgJycpICsgc3VmZml4XG4gIH1cblxuICBpZiAoYWZmaXhlc0VtcHR5KSB7XG4gICAgcmV0dXJuIHByZWZpeCArIHN1ZmZpeFxuICB9XG59XG5cbnJlbmFtZUNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgY29uc3Qgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgcmV0dXJuIHN0b3JhZ2UubG9hZCgnY21kcycpXG4gIH0pLnRoZW4oc2F2ZWRDbWRzID0+IHtcbiAgICB2YXIgY21kLCBjbWREYXRhLCBuZXdOYW1lLCBvcmlnbmluYWxOYW1lXG4gICAgb3JpZ25pbmFsTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZnJvbSddKVxuICAgIG5ld05hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ3RvJ10pXG5cbiAgICBpZiAob3JpZ25pbmFsTmFtZSAhPSBudWxsICYmIG5ld05hbWUgIT0gbnVsbCkge1xuICAgICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQob3JpZ25pbmFsTmFtZSlcblxuICAgICAgaWYgKHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXSAhPSBudWxsICYmIGNtZCAhPSBudWxsKSB7XG4gICAgICAgIGlmICghKG5ld05hbWUuaW5kZXhPZignOicpID4gLTEpKSB7XG4gICAgICAgICAgbmV3TmFtZSA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG9yaWduaW5hbE5hbWUsICcnKSArIG5ld05hbWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cblxuICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShuZXdOYW1lLCBjbWREYXRhKVxuXG4gICAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgICAgc2F2ZWRDbWRzW25ld05hbWVdID0gY21kRGF0YVxuICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gc3RvcmFnZS5zYXZlKCdjbWRzJywgc2F2ZWRDbWRzKVxuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICd+fm5vdF9hcHBsaWNhYmxlfn4nXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ35+bm90X2ZvdW5kfn4nXG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuXG5yZW1vdmVDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICBjb25zdCBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSlcbiAgICBjb25zdCBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG5cbiAgICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgICAgfSkudGhlbihzYXZlZENtZHMgPT4ge1xuICAgICAgICBjb25zdCBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChuYW1lKVxuXG4gICAgICAgIGlmIChzYXZlZENtZHNbbmFtZV0gIT0gbnVsbCAmJiBjbWQgIT0gbnVsbCkge1xuICAgICAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW25hbWVdXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcylcbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gJ35+bm90X2FwcGxpY2FibGV+fidcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJ35+bm90X2ZvdW5kfn4nXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9KVxufVxuXG5hbGlhc0NvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGFsaWFzLCBjbWQsIG5hbWVcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKVxuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnYWxpYXMnXSlcblxuICBpZiAobmFtZSAhPSBudWxsICYmIGFsaWFzICE9IG51bGwpIHtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuXG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQgPSBjbWQuZ2V0QWxpYXNlZCgpIHx8IGNtZCAvLyB1bmxlc3MgYWxpYXMuaW5kZXhPZignOicpID4gLTFcbiAgICAgIC8vIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuXG4gICAgICBDb21tYW5kLnNhdmVDbWQoYWxpYXMsIHtcbiAgICAgICAgYWxpYXNPZjogY21kLmZ1bGxOYW1lXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gJydcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICd+fm5vdF9mb3VuZH5+J1xuICAgIH1cbiAgfVxufVxuXG5saXN0Q29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgYm94LCBjb21tYW5kcywgY29udGV4dCwgbmFtZSwgbmFtZXNwYWNlcywgdGV4dCwgdXNlQ29udGV4dFxuICBib3ggPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydib3gnXSwgdHJ1ZSlcbiAgdXNlQ29udGV4dCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2NvbnRleHQnXSwgdHJ1ZSlcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKVxuICBuYW1lc3BhY2VzID0gbmFtZSA/IFtuYW1lXSA6IGluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLmZpbHRlcihuc3BjID0+IHtcbiAgICByZXR1cm4gbnNwYyAhPT0gaW5zdGFuY2UuY21kLmZ1bGxOYW1lXG4gIH0pLmNvbmNhdCgnX3Jvb3QnKVxuICBjb250ZXh0ID0gdXNlQ29udGV4dCA/IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkgOiBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dFxuICBjb21tYW5kcyA9IG5hbWVzcGFjZXMucmVkdWNlKChjb21tYW5kcywgbnNwYykgPT4ge1xuICAgIHZhciBjbWRcbiAgICBjbWQgPSBuc3BjID09PSAnX3Jvb3QnID8gQ29tbWFuZC5jbWRzIDogY29udGV4dC5nZXRDbWQobnNwYywge1xuICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlXG4gICAgfSlcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKVxuXG4gICAgICBpZiAoY21kLmNtZHMpIHtcbiAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5jb25jYXQoY21kLmNtZHMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbW1hbmRzXG4gIH0sIFtdKVxuICB0ZXh0ID0gY29tbWFuZHMubGVuZ3RoID8gY29tbWFuZHMubWFwKGNtZCA9PiB7XG4gICAgY21kLmluaXQoKVxuICAgIHJldHVybiAoY21kLmlzRXhlY3V0YWJsZSgpID8gJ35+IScgOiAnfn4hbHMgJykgKyBjbWQuZnVsbE5hbWUgKyAnfn4nXG4gIH0pLmpvaW4oJ1xcbicpIDogJ1RoaXMgY29udGFpbnMgbm8gc3ViLWNvbW1hbmRzJ1xuXG4gIGlmIChib3gpIHtcbiAgICByZXR1cm4gYH5+Ym94fn5cXG4ke3RleHR9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmBcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGV4dFxuICB9XG59XG5cbmdldENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHJlc1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pXG4gIHJlcyA9IFBhdGhIZWxwZXIuZ2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lKVxuXG4gIGlmICh0eXBlb2YgcmVzID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsICcgICcpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5cbnNldENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHAsIHZhbFxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pXG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd2YWx1ZScsICd2YWwnXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiBudWxsXG5cbiAgUGF0aEhlbHBlci5zZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIG5hbWUsIHZhbClcblxuICByZXR1cm4gJydcbn1cblxuc3RvcmVKc29uQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgbmFtZSwgcCwgdmFsXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2pzb24nXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiBudWxsXG5cbiAgUGF0aEhlbHBlci5zZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIG5hbWUsIEpTT04ucGFyc2UodmFsKSlcblxuICByZXR1cm4gJydcbn1cblxuZ2V0UGFyYW0gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcywgaW5zdGFuY2UuZ2V0UGFyYW0oWydkZWYnLCAnZGVmYXVsdCddKSlcbiAgfVxufVxuXG5Cb3hDbWQgPSBjbGFzcyBCb3hDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQgKCkge1xuICAgIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpXG4gICAgdGhpcy5jbWQgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5oZWxwZXIub3BlblRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZCArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgICAgdGhpcy5oZWxwZXIuY2xvc2VUZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZC5zcGxpdCgnICcpWzBdICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzXG4gICAgfVxuXG4gICAgdGhpcy5oZWxwZXIuZGVjbyA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZGVjb1xuICAgIHRoaXMuaGVscGVyLnBhZCA9IDJcbiAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKVxuICAgIHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpXG4gIH1cblxuICBoZWlnaHQgKCkge1xuICAgIHZhciBoZWlnaHQsIHBhcmFtc1xuXG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5ib3VuZHMoKS5oZWlnaHRcbiAgICB9IGVsc2Uge1xuICAgICAgaGVpZ2h0ID0gM1xuICAgIH1cblxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J11cblxuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgxKVxuICAgIH0gZWxzZSBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIGhlaWdodClcbiAgfVxuXG4gIHdpZHRoICgpIHtcbiAgICB2YXIgcGFyYW1zLCB3aWR0aFxuXG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgd2lkdGggPSB0aGlzLmJvdW5kcygpLndpZHRoXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpZHRoID0gM1xuICAgIH1cblxuICAgIHBhcmFtcyA9IFsnd2lkdGgnXVxuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApXG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWF4KHRoaXMubWluV2lkdGgoKSwgdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSlcbiAgfVxuXG4gIGJvdW5kcyAoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgaWYgKHRoaXMuX2JvdW5kcyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2JvdW5kcyA9IHRoaXMuaGVscGVyLnRleHRCb3VuZHModGhpcy5pbnN0YW5jZS5jb250ZW50KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fYm91bmRzXG4gICAgfVxuICB9XG5cbiAgcmVzdWx0ICgpIHtcbiAgICB0aGlzLmhlbHBlci5oZWlnaHQgPSB0aGlzLmhlaWdodCgpXG4gICAgdGhpcy5oZWxwZXIud2lkdGggPSB0aGlzLndpZHRoKClcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuZHJhdyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpXG4gIH1cblxuICBtaW5XaWR0aCAoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNtZC5sZW5ndGhcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gIH1cbn1cbkNsb3NlQ21kID0gY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQgKCkge1xuICAgIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpXG4gIH1cblxuICBleGVjdXRlICgpIHtcbiAgICBjb25zdCBwcmVmaXggPSB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKVxuICAgIGNvbnN0IHN1ZmZpeCA9IHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpXG4gICAgbGV0IGJveCA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKVxuICAgIGNvbnN0IHJlcXVpcmVkQWZmaXhlcyA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydyZXF1aXJlZF9hZmZpeGVzJ10sIHRydWUpXG5cbiAgICBpZiAoIXJlcXVpcmVkQWZmaXhlcykge1xuICAgICAgdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5oZWxwZXIuc3VmZml4ID0gJydcbiAgICAgIGNvbnN0IGJveDIgPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSlcblxuICAgICAgaWYgKGJveDIgIT0gbnVsbCAmJiAoYm94ID09IG51bGwgfHwgYm94LnN0YXJ0IDwgYm94Mi5zdGFydCAtIHByZWZpeC5sZW5ndGggfHwgYm94LmVuZCA+IGJveDIuZW5kICsgc3VmZml4Lmxlbmd0aCkpIHtcbiAgICAgICAgYm94ID0gYm94MlxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChib3ggIT0gbnVsbCkge1xuICAgICAgY29uc3QgZGVwdGggPSB0aGlzLmhlbHBlci5nZXROZXN0ZWRMdmwodGhpcy5pbnN0YW5jZS5nZXRQb3MoKS5zdGFydClcblxuICAgICAgaWYgKGRlcHRoIDwgMikge1xuICAgICAgICB0aGlzLmluc3RhbmNlLmluQm94ID0gbnVsbFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudChib3guc3RhcnQsIGJveC5lbmQsICcnKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UucmVwbGFjZVdpdGgoJycpXG4gICAgfVxuICB9XG59XG5FZGl0Q21kID0gY2xhc3MgRWRpdENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCAoKSB7XG4gICAgdmFyIHJlZlxuICAgIHRoaXMuY21kTmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSlcbiAgICB0aGlzLnZlcmJhbGl6ZSA9IChyZWYgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxXSkpID09PSAndicgfHwgcmVmID09PSAndmVyYmFsaXplJ1xuXG4gICAgaWYgKHRoaXMuY21kTmFtZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmZpbmRlciA9IHRoaXMuaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRGaW5kZXIodGhpcy5jbWROYW1lKVxuICAgICAgdGhpcy5maW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2VcbiAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpXG4gICAgfVxuXG4gICAgdGhpcy5lZGl0YWJsZSA9IHRoaXMuY21kICE9IG51bGwgPyB0aGlzLmNtZC5pc0VkaXRhYmxlKCkgOiB0cnVlXG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhDb250ZW50KClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0V2l0aG91dENvbnRlbnQoKVxuICAgIH1cbiAgfVxuXG4gIHJlc3VsdFdpdGhDb250ZW50ICgpIHtcbiAgICB2YXIgZGF0YSwgaSwgbGVuLCBwLCBwYXJzZXIsIHJlZlxuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpXG4gICAgcGFyc2VyLnBhcnNlQWxsKClcbiAgICBkYXRhID0ge31cbiAgICByZWYgPSBFZGl0Q21kLnByb3BzXG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHAgPSByZWZbaV1cbiAgICAgIHAud3JpdGVGb3IocGFyc2VyLCBkYXRhKVxuICAgIH1cblxuICAgIENvbW1hbmQuc2F2ZUNtZCh0aGlzLmNtZE5hbWUsIGRhdGEpXG5cbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIHByb3BzRGlzcGxheSAoKSB7XG4gICAgdmFyIGNtZFxuICAgIGNtZCA9IHRoaXMuY21kXG4gICAgcmV0dXJuIEVkaXRDbWQucHJvcHMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gcC5kaXNwbGF5KGNtZClcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBwICE9IG51bGxcbiAgICB9KS5qb2luKCdcXG4nKVxuICB9XG5cbiAgcmVzdWx0V2l0aG91dENvbnRlbnQgKCkge1xuICAgIHZhciBuYW1lLCBwYXJzZXJcblxuICAgIGlmICghdGhpcy5jbWQgfHwgdGhpcy5lZGl0YWJsZSkge1xuICAgICAgbmFtZSA9IHRoaXMuY21kID8gdGhpcy5jbWQuZnVsbE5hbWUgOiB0aGlzLmNtZE5hbWVcbiAgICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChgfn5ib3ggY21kOlwiJHt0aGlzLmluc3RhbmNlLmNtZC5mdWxsTmFtZX0gJHtuYW1lfVwifn5cXG4ke3RoaXMucHJvcHNEaXNwbGF5KCl9XFxufn4hc2F2ZX5+IH5+IWNsb3Nlfn5cXG5+fi9ib3h+fmApXG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuXG4gICAgICBpZiAodGhpcy52ZXJiYWxpemUpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5nZXRUZXh0KClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5FZGl0Q21kLnNldENtZHMgPSBmdW5jdGlvbiAoYmFzZSkge1xuICB2YXIgaSwgaW5JbnN0YW5jZSwgbGVuLCBwLCByZWZcbiAgaW5JbnN0YW5jZSA9IGJhc2UuaW5faW5zdGFuY2UgPSB7XG4gICAgY21kczoge31cbiAgfVxuICByZWYgPSBFZGl0Q21kLnByb3BzXG5cbiAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcCA9IHJlZltpXVxuICAgIHAuc2V0Q21kKGluSW5zdGFuY2UuY21kcylcbiAgfSAvLyBwLnNldENtZChiYXNlKVxuXG4gIHJldHVybiBiYXNlXG59XG5cbkVkaXRDbWQucHJvcHMgPSBbbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX2NhcnJldCcsIHtcbiAgb3B0OiAnY2hlY2tDYXJyZXQnXG59KSwgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJywge1xuICBvcHQ6ICdwYXJzZSdcbn0pLCBuZXcgRWRpdENtZFByb3AuYm9vbCgncHJldmVudF9wYXJzZV9hbGwnLCB7XG4gIG9wdDogJ3ByZXZlbnRQYXJzZUFsbCdcbn0pLCBuZXcgRWRpdENtZFByb3AuYm9vbCgncmVwbGFjZV9ib3gnLCB7XG4gIG9wdDogJ3JlcGxhY2VCb3gnXG59KSwgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnbmFtZV90b19wYXJhbScsIHtcbiAgb3B0OiAnbmFtZVRvUGFyYW0nXG59KSwgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnYWxpYXNfb2YnLCB7XG4gIHZhcjogJ2FsaWFzT2YnLFxuICBjYXJyZXQ6IHRydWVcbn0pLCBuZXcgRWRpdENtZFByb3Auc291cmNlKCdoZWxwJywge1xuICBmdW5jdDogJ2hlbHAnLFxuICBzaG93RW1wdHk6IHRydWVcbn0pLCBuZXcgRWRpdENtZFByb3Auc291cmNlKCdzb3VyY2UnLCB7XG4gIHZhcjogJ3Jlc3VsdFN0cicsXG4gIGRhdGFOYW1lOiAncmVzdWx0JyxcbiAgc2hvd0VtcHR5OiB0cnVlLFxuICBjYXJyZXQ6IHRydWVcbn0pXVxuTmFtZVNwYWNlQ21kID0gY2xhc3MgTmFtZVNwYWNlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0ICgpIHtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswXSlcbiAgfVxuXG4gIHJlc3VsdCAoKSB7XG4gICAgdmFyIGksIGxlbiwgbmFtZXNwYWNlcywgbnNwYywgcGFyc2VyLCB0eHRcblxuICAgIGlmICh0aGlzLm5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5uYW1lKVxuICAgICAgcmV0dXJuICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWVzcGFjZXMgPSB0aGlzLmluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICB0eHQgPSAnfn5ib3h+flxcbidcblxuICAgICAgZm9yIChpID0gMCwgbGVuID0gbmFtZXNwYWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBuc3BjID0gbmFtZXNwYWNlc1tpXVxuXG4gICAgICAgIGlmIChuc3BjICE9PSB0aGlzLmluc3RhbmNlLmNtZC5mdWxsTmFtZSkge1xuICAgICAgICAgIHR4dCArPSBuc3BjICsgJ1xcbidcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0eHQgKz0gJ35+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodHh0KVxuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpXG4gICAgfVxuICB9XG59XG5UZW1wbGF0ZUNtZCA9IGNsYXNzIFRlbXBsYXRlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0ICgpIHtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKVxuICAgIHRoaXMuc2VwID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3NlcCddLCAnXFxuJylcbiAgfVxuXG4gIHJlc3VsdCAoKSB7XG4gICAgdmFyIGRhdGFcbiAgICBkYXRhID0gdGhpcy5uYW1lID8gUGF0aEhlbHBlci5nZXRQYXRoKHRoaXMuaW5zdGFuY2UuY29kZXdhdmUudmFycywgdGhpcy5uYW1lKSA6IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUudmFyc1xuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCAmJiBkYXRhICE9IG51bGwgJiYgZGF0YSAhPT0gZmFsc2UpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBkYXRhLm1hcChpdGVtID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZShpdGVtKVxuICAgICAgICB9KS5qb2luKHRoaXMuc2VwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVGVtcGxhdGUoZGF0YSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVGVtcGxhdGUgKGRhdGEpIHtcbiAgICB2YXIgcGFyc2VyXG4gICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHRoaXMuaW5zdGFuY2UuY29udGVudClcbiAgICBwYXJzZXIudmFycyA9IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyA/IGRhdGEgOiB7XG4gICAgICB2YWx1ZTogZGF0YVxuICAgIH1cbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKVxuICB9XG59XG5FbW1ldENtZCA9IGNsYXNzIEVtbWV0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0ICgpIHtcbiAgICB0aGlzLmFiYnIgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnYWJicicsICdhYmJyZXZpYXRpb24nXSlcbiAgICB0aGlzLmxhbmcgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxLCAnbGFuZycsICdsYW5ndWFnZSddKVxuICB9XG5cbiAgZ2V0RW1tZXQgKCkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgIT09IG51bGwgJiYgd2luZG93LmVtbWV0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB3aW5kb3cuZW1tZXRcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyAhPT0gbnVsbCAmJiB3aW5kb3cuc2VsZiAhPT0gbnVsbCAmJiB3aW5kb3cuc2VsZi5lbW1ldCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gd2luZG93LnNlbGYuZW1tZXRcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyAhPT0gbnVsbCAmJiB3aW5kb3cuZ2xvYmFsICE9PSBudWxsICYmIHdpbmRvdy5nbG9iYWwuZW1tZXQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5nbG9iYWwuZW1tZXRcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXF1aXJlICE9PSAndW5kZWZpbmVkJyAmJiByZXF1aXJlICE9PSBudWxsKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gcmVxdWlyZSgnZW1tZXQnKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5sb2dnZXIubG9nKCdFbW1ldCBpcyBub3QgYXZhaWxhYmxlLCBpdCBtYXkgbmVlZCB0byBiZSBpbnN0YWxsZWQgbWFudWFsbHknKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCAoKSB7XG4gICAgY29uc3QgZW1tZXQgPSB0aGlzLmdldEVtbWV0KClcblxuICAgIGlmIChlbW1ldCAhPSBudWxsKSB7XG4gICAgICAvLyBlbW1ldC5yZXF1aXJlKCcuL3BhcnNlci9hYmJyZXZpYXRpb24nKS5leHBhbmQoJ3VsPmxpJywge3Bhc3RlZENvbnRlbnQ6J2xvcmVtJ30pXG4gICAgICBjb25zdCByZXMgPSBlbW1ldC5leHBhbmRBYmJyZXZpYXRpb24odGhpcy5hYmJyLCB0aGlzLmxhbmcpXG4gICAgICByZXR1cm4gcmVzLnJlcGxhY2UoL1xcJFxcezBcXH0vZywgJ3wnKVxuICAgIH1cbiAgfVxufVxuIiwiXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi4vQ29tbWFuZCcpLkNvbW1hbmRcblxuY29uc3QgQm94SGVscGVyID0gcmVxdWlyZSgnLi4vQm94SGVscGVyJykuQm94SGVscGVyXG5cbmNvbnN0IEVkaXRDbWRQcm9wID0gcmVxdWlyZSgnLi4vRWRpdENtZFByb3AnKS5FZGl0Q21kUHJvcFxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBQYXRoSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9QYXRoSGVscGVyJykuUGF0aEhlbHBlclxuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxudmFyIGRlbGV0ZUNvbW1hbmQsIHJlYWRDb21tYW5kLCB3cml0ZUNvbW1hbmRcbnZhciBGaWxlQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgRmlsZUNvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChjbWRzKSB7XG4gICAgdmFyIGNvcmVcbiAgICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2ZpbGUnKSlcbiAgICByZXR1cm4gY29yZS5hZGRDbWRzKHtcbiAgICAgIHJlYWQ6IHtcbiAgICAgICAgcmVzdWx0OiByZWFkQ29tbWFuZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ2ZpbGUnXSxcbiAgICAgICAgaGVscDogJ3JlYWQgdGhlIGNvbnRlbnQgb2YgYSBmaWxlJ1xuICAgICAgfSxcbiAgICAgIHdyaXRlOiB7XG4gICAgICAgIHJlc3VsdDogd3JpdGVDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnZmlsZScsICdjb250ZW50J10sXG4gICAgICAgIGhlbHA6ICdzYXZlIGludG8gYSBmaWxlJ1xuICAgICAgfSxcbiAgICAgIGRlbGV0ZToge1xuICAgICAgICByZXN1bHQ6IGRlbGV0ZUNvbW1hbmQsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydmaWxlJ10sXG4gICAgICAgIGhlbHA6ICdkZWxldGUgYSBmaWxlJ1xuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbmV4cG9ydHMuRmlsZUNvbW1hbmRQcm92aWRlciA9IEZpbGVDb21tYW5kUHJvdmlkZXJcblxucmVhZENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGZpbGUsIGZpbGVTeXN0ZW1cbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKVxuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pXG5cbiAgaWYgKGZpbGVTeXN0ZW0pIHtcbiAgICByZXR1cm4gZmlsZVN5c3RlbS5yZWFkRmlsZShmaWxlKVxuICB9XG59XG5cbndyaXRlQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgY29udGVudCwgZmlsZSwgZmlsZVN5c3RlbVxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2ZpbGUnXSlcbiAgY29udGVudCA9IGluc3RhbmNlLmNvbnRlbnQgfHwgaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdjb250ZW50J10pXG5cbiAgaWYgKGZpbGVTeXN0ZW0pIHtcbiAgICByZXR1cm4gZmlsZVN5c3RlbS53cml0ZUZpbGUoZmlsZSwgY29udGVudClcbiAgfVxufVxuXG5kZWxldGVDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtXG4gIGZpbGVTeXN0ZW0gPSBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRGaWxlU3lzdGVtKClcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKVxuXG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0uZGVsZXRlRmlsZShmaWxlKVxuICB9XG59XG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuXG52YXIgSHRtbENvbW1hbmRQcm92aWRlciA9IGNsYXNzIEh0bWxDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlciAoY21kcykge1xuICAgIHZhciBjc3MsIGh0bWxcbiAgICBodG1sID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2h0bWwnKSlcbiAgICBodG1sLmFkZENtZHMoe1xuICAgICAgZmFsbGJhY2s6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGxhbmc6ICdodG1sJ1xuICAgICAgICB9LFxuICAgICAgICBuYW1lVG9QYXJhbTogJ2FiYnInXG4gICAgICB9XG4gICAgfSlcbiAgICBjc3MgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY3NzJykpXG4gICAgcmV0dXJuIGNzcy5hZGRDbWRzKHtcbiAgICAgIGZhbGxiYWNrOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmVtbWV0JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBsYW5nOiAnY3NzJ1xuICAgICAgICB9LFxuICAgICAgICBuYW1lVG9QYXJhbTogJ2FiYnInXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5IdG1sQ29tbWFuZFByb3ZpZGVyID0gSHRtbENvbW1hbmRQcm92aWRlclxuIiwiXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi4vQ29tbWFuZCcpLkNvbW1hbmRcblxudmFyIEpzQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSnNDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlciAoY21kcykge1xuICAgIHZhciBqc1xuICAgIGpzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2pzJykpXG4gICAgY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2phdmFzY3JpcHQnLCB7XG4gICAgICBhbGlhc09mOiAnanMnXG4gICAgfSkpXG4gICAgcmV0dXJuIGpzLmFkZENtZHMoe1xuICAgICAgY29tbWVudDogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgIGlmOiAnaWYofCl7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgIGxvZzogJ2lmKHdpbmRvdy5jb25zb2xlKXtcXG5cXHRjb25zb2xlLmxvZyh+fmNvbnRlbnR+fnwpXFxufScsXG4gICAgICBmdW5jdGlvbjogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgIGZ1bmN0OiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICBmOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICBmb3I6ICdmb3IgKHZhciBpID0gMDsgaSA8IHw7IGkrKykge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICBmb3JpbjogJ2ZvciAodmFyIHZhbCBpbiB8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgIGVhY2g6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgIGZvcmVhY2g6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgIHdoaWxlOiAnd2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICB3aGlsZWk6ICd2YXIgaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxuXFx0aSsrO1xcbn0nLFxuICAgICAgaWZlbHNlOiAnaWYoIHwgKSB7XFxuXFx0fn5jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgaWZlOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczppZmVsc2UnXG4gICAgICB9LFxuICAgICAgc3dpdGNoOiAnc3dpdGNoKCB8ICkgeyBcXG5cXHRjYXNlIDpcXG5cXHRcXHR+fmNvbnRlbnR+flxcblxcdFxcdGJyZWFrO1xcblxcdGRlZmF1bHQgOlxcblxcdFxcdFxcblxcdFxcdGJyZWFrO1xcbn0nXG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5Kc0NvbW1hbmRQcm92aWRlciA9IEpzQ29tbWFuZFByb3ZpZGVyXG4iLCJcbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBQYWlyRGV0ZWN0b3IgPSByZXF1aXJlKCcuLi9kZXRlY3RvcnMvUGFpckRldGVjdG9yJykuUGFpckRldGVjdG9yXG5cbnZhciB3cmFwV2l0aFBocFxudmFyIFBocENvbW1hbmRQcm92aWRlciA9IGNsYXNzIFBocENvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChjbWRzKSB7XG4gICAgdmFyIHBocCwgcGhwSW5uZXIsIHBocE91dGVyXG4gICAgcGhwID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ3BocCcpKVxuICAgIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgICBvcGVuZXI6ICc8P3BocCcsXG4gICAgICBjbG9zZXI6ICc/PicsXG4gICAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICAgZWxzZTogJ3BocDpvdXRlcidcbiAgICB9KSlcbiAgICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpXG4gICAgcGhwT3V0ZXIuYWRkQ21kcyh7XG4gICAgICBmYWxsYmFjazoge1xuICAgICAgICBjbWRzOiB7XG4gICAgICAgICAgYW55X2NvbnRlbnQ6IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnLFxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgcHJlZml4OiAnID8+XFxuJyxcbiAgICAgICAgICAgICAgc3VmZml4OiAnXFxuPD9waHAgJyxcbiAgICAgICAgICAgICAgYWZmaXhlc19lbXB0eTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjolbmFtZSUnLFxuICAgICAgICBhbHRlclJlc3VsdDogd3JhcFdpdGhQaHBcbiAgICAgIH0sXG4gICAgICBib3g6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb21tZW50OiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgcGhwOiAnPD9waHBcXG5cXHR+fmNvbnRlbnR+fnxcXG4/PidcbiAgICB9KVxuICAgIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSlcbiAgICByZXR1cm4gcGhwSW5uZXIuYWRkQ21kcyh7XG4gICAgICBhbnlfY29udGVudDoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50J1xuICAgICAgfSxcbiAgICAgIGNvbW1lbnQ6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBpZjogJ2lmKHwpe1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgaW5mbzogJ3BocGluZm8oKTsnLFxuICAgICAgZWNobzogJ2VjaG8gfCcsXG4gICAgICBlOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZWNobydcbiAgICAgIH0sXG4gICAgICBjbGFzczoge1xuICAgICAgICByZXN1bHQ6ICdjbGFzcyB+fnBhcmFtIDAgY2xhc3MgZGVmOnx+fiB7XFxuXFx0ZnVuY3Rpb24gX19jb25zdHJ1Y3QoKSB7XFxuXFx0XFx0fn5jb250ZW50fn58XFxuXFx0fVxcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGM6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpjbGFzcydcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbjoge1xuICAgICAgICByZXN1bHQ6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZnVuY3Q6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICBmOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgYXJyYXk6ICckfCA9IGFycmF5KCk7JyxcbiAgICAgIGE6ICdhcnJheSgpJyxcbiAgICAgIGZvcjogJ2ZvciAoJGkgPSAwOyAkaSA8ICR8OyAkaSsrKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICBmb3JlYWNoOiAnZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICBlYWNoOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Zm9yZWFjaCdcbiAgICAgIH0sXG4gICAgICB3aGlsZTogJ3doaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgIHdoaWxlaToge1xuICAgICAgICByZXN1bHQ6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaWZlbHNlOiAnaWYoIHwgKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAgIGlmZToge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmlmZWxzZSdcbiAgICAgIH0sXG4gICAgICBzd2l0Y2g6IHtcbiAgICAgICAgcmVzdWx0OiAnc3dpdGNoKCB8ICkgeyBcXG5cXHRjYXNlIDpcXG5cXHRcXHR+fmFueV9jb250ZW50fn5cXG5cXHRcXHRicmVhaztcXG5cXHRkZWZhdWx0IDpcXG5cXHRcXHRcXG5cXHRcXHRicmVhaztcXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjbG9zZToge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjbG9zZScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nLFxuICAgICAgICAgIHN1ZmZpeDogJ1xcbj8+JyxcbiAgICAgICAgICByZXF1aXJlZF9hZmZpeGVzOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5QaHBDb21tYW5kUHJvdmlkZXIgPSBQaHBDb21tYW5kUHJvdmlkZXJcblxud3JhcFdpdGhQaHAgPSBmdW5jdGlvbiAocmVzdWx0LCBpbnN0YW5jZSkge1xuICB2YXIgaW5saW5lLCByZWdDbG9zZSwgcmVnT3BlblxuICBpbmxpbmUgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3BocF9pbmxpbmUnLCAnaW5saW5lJ10sIHRydWUpXG5cbiAgaWYgKGlubGluZSkge1xuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nXG4gICAgcmVnQ2xvc2UgPSAvKFtcXG5cXHJcXHNdKylcXHNcXD8+L2dcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nXG4gIH1cbn0gLy8gY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuLy8gICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnXG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBBbHdheXNFbmFibGVkID0gcmVxdWlyZSgnLi4vZGV0ZWN0b3JzL0Fsd2F5c0VuYWJsZWQnKS5BbHdheXNFbmFibGVkXG5cbnZhciBpbmZsZWN0aW9uID0gaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKCdpbmZsZWN0aW9uJykpXG5cbmZ1bmN0aW9uIGludGVyb3BSZXF1aXJlV2lsZGNhcmQgKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmogfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYykgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XSB9IH0gfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqIH0gfVxuXG52YXIgU3RyaW5nQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgU3RyaW5nQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIgKHJvb3QpIHtcbiAgICB2YXIgY21kc1xuICAgIGNtZHMgPSByb290LmFkZENtZChuZXcgQ29tbWFuZCgnc3RyaW5nJykpXG4gICAgcm9vdC5hZGRDbWQobmV3IENvbW1hbmQoJ3N0cicsIHtcbiAgICAgIGFsaWFzT2Y6ICdzdHJpbmcnXG4gICAgfSkpXG4gICAgcm9vdC5hZGREZXRlY3RvcihuZXcgQWx3YXlzRW5hYmxlZCgnc3RyaW5nJykpXG4gICAgcmV0dXJuIGNtZHMuYWRkQ21kcyh7XG4gICAgICBwbHVyYWxpemU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5wbHVyYWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1BsdXJhbGl6ZSBhIHN0cmluZydcbiAgICAgIH0sXG4gICAgICBzaW5ndWxhcml6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJ10sXG4gICAgICAgIGhlbHA6ICdTaW5ndWxhcml6ZSBhIHN0cmluZydcbiAgICAgIH0sXG4gICAgICBjYW1lbGl6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmNhbWVsaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pLCAhaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsxLCAnZmlyc3QnXSwgdHJ1ZSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInLCAnZmlyc3QnXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgZnJvbSB1bmRlcnNjb3JlIHRvIGNhbWVsY2FzZSdcbiAgICAgIH0sXG4gICAgICB1bmRlcnNjb3JlOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24udW5kZXJzY29yZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSwgaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsxLCAndXBwZXInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInLCAndXBwZXInXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgZnJvbSBjYW1lbGNhc2UgdG8gdW5kZXJzY29yZS4nXG4gICAgICB9LFxuICAgICAgaHVtYW5pemU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5odW1hbml6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSwgaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsxLCAnZmlyc3QnXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInLCAnZmlyc3QnXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSBodW1hbiByZWFkYWJsZSBmb3JtYXQnXG4gICAgICB9LFxuICAgICAgY2FwaXRhbGl6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmNhcGl0YWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ01ha2UgdGhlIGZpcnN0IGxldHRlciBvZiBhIHN0cmluZyB1cHBlcidcbiAgICAgIH0sXG4gICAgICBkYXNoZXJpemU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5kYXNoZXJpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1JlcGxhY2VzIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzIGluIGEgc3RyaW5nLidcbiAgICAgIH0sXG4gICAgICB0aXRsZWl6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnRpdGxlaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJ10sXG4gICAgICAgIGhlbHA6ICdUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgaHVtYW4gcmVhZGFibGUgZm9ybWF0IHdpdGggbW9zdCB3b3JkcyBjYXBpdGFsaXplZCdcbiAgICAgIH0sXG4gICAgICB0YWJsZWl6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnRhYmxlaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJ10sXG4gICAgICAgIGhlbHA6ICdUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgdGFibGUgZm9ybWF0J1xuICAgICAgfSxcbiAgICAgIGNsYXNzaWZ5OiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2xhc3NpZnkoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSBjbGFzcyBmb3JtYXQnXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5TdHJpbmdDb21tYW5kUHJvdmlkZXIgPSBTdHJpbmdDb21tYW5kUHJvdmlkZXJcbiIsIlxuY29uc3QgRGV0ZWN0b3IgPSByZXF1aXJlKCcuL0RldGVjdG9yJykuRGV0ZWN0b3JcblxudmFyIEFsd2F5c0VuYWJsZWQgPSBjbGFzcyBBbHdheXNFbmFibGVkIGV4dGVuZHMgRGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvciAobmFtZXNwYWNlKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlXG4gIH1cblxuICBkZXRlY3QgKGZpbmRlcikge1xuICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZVxuICB9XG59XG5leHBvcnRzLkFsd2F5c0VuYWJsZWQgPSBBbHdheXNFbmFibGVkXG4iLCJcbnZhciBEZXRlY3RvciA9IGNsYXNzIERldGVjdG9yIHtcbiAgY29uc3RydWN0b3IgKGRhdGEgPSB7fSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGFcbiAgfVxuXG4gIGRldGVjdCAoZmluZGVyKSB7XG4gICAgaWYgKHRoaXMuZGV0ZWN0ZWQoZmluZGVyKSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5yZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnJlc3VsdFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5kYXRhLmVsc2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmVsc2VcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXRlY3RlZCAoZmluZGVyKSB7fVxufVxuZXhwb3J0cy5EZXRlY3RvciA9IERldGVjdG9yXG4iLCJcbmNvbnN0IERldGVjdG9yID0gcmVxdWlyZSgnLi9EZXRlY3RvcicpLkRldGVjdG9yXG5cbnZhciBMYW5nRGV0ZWN0b3IgPSBjbGFzcyBMYW5nRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdCAoZmluZGVyKSB7XG4gICAgdmFyIGxhbmdcblxuICAgIGlmIChmaW5kZXIuY29kZXdhdmUgIT0gbnVsbCkge1xuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpXG5cbiAgICAgIGlmIChsYW5nICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5MYW5nRGV0ZWN0b3IgPSBMYW5nRGV0ZWN0b3JcbiIsIlxuY29uc3QgUGFpciA9IHJlcXVpcmUoJy4uL3Bvc2l0aW9uaW5nL1BhaXInKS5QYWlyXG5cbmNvbnN0IERldGVjdG9yID0gcmVxdWlyZSgnLi9EZXRlY3RvcicpLkRldGVjdG9yXG5cbnZhciBQYWlyRGV0ZWN0b3IgPSBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdGVkIChmaW5kZXIpIHtcbiAgICB2YXIgcGFpclxuXG4gICAgaWYgKHRoaXMuZGF0YS5vcGVuZXIgIT0gbnVsbCAmJiB0aGlzLmRhdGEuY2xvc2VyICE9IG51bGwgJiYgZmluZGVyLmluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcih0aGlzLmRhdGEub3BlbmVyLCB0aGlzLmRhdGEuY2xvc2VyLCB0aGlzLmRhdGEpXG5cbiAgICAgIGlmIChwYWlyLmlzV2FwcGVyT2YoZmluZGVyLmluc3RhbmNlLmdldFBvcygpLCBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLnRleHQoKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuZXhwb3J0cy5QYWlyRGV0ZWN0b3IgPSBQYWlyRGV0ZWN0b3JcbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBib290c3RyYXAgPSByZXF1aXJlKCcuL2Jvb3RzdHJhcCcpXG5cbmNvbnN0IFRleHRBcmVhRWRpdG9yID0gcmVxdWlyZSgnLi9UZXh0QXJlYUVkaXRvcicpXG5cbmJvb3RzdHJhcC5Db2Rld2F2ZS5kZXRlY3QgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIHZhciBjd1xuICBjdyA9IG5ldyBib290c3RyYXAuQ29kZXdhdmUobmV3IFRleHRBcmVhRWRpdG9yLlRleHRBcmVhRWRpdG9yKHRhcmdldCkpXG5cbiAgYm9vdHN0cmFwLkNvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KVxuXG4gIHJldHVybiBjd1xufVxuXG5ib290c3RyYXAuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmVcbndpbmRvdy5Db2Rld2F2ZSA9IGJvb3RzdHJhcC5Db2Rld2F2ZVxuIiwiXG52YXIgQXJyYXlIZWxwZXIgPSBjbGFzcyBBcnJheUhlbHBlciB7XG4gIHN0YXRpYyBpc0FycmF5IChhcnIpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfVxuXG4gIHN0YXRpYyB1bmlvbiAoYTEsIGEyKSB7XG4gICAgcmV0dXJuIHRoaXMudW5pcXVlKGExLmNvbmNhdChhMikpXG4gIH1cblxuICBzdGF0aWMgdW5pcXVlIChhcnJheSkge1xuICAgIHZhciBhLCBpLCBqXG4gICAgYSA9IGFycmF5LmNvbmNhdCgpXG4gICAgaSA9IDBcblxuICAgIHdoaWxlIChpIDwgYS5sZW5ndGgpIHtcbiAgICAgIGogPSBpICsgMVxuXG4gICAgICB3aGlsZSAoaiA8IGEubGVuZ3RoKSB7XG4gICAgICAgIGlmIChhW2ldID09PSBhW2pdKSB7XG4gICAgICAgICAgYS5zcGxpY2Uoai0tLCAxKVxuICAgICAgICB9XG5cbiAgICAgICAgKytqXG4gICAgICB9XG5cbiAgICAgICsraVxuICAgIH1cblxuICAgIHJldHVybiBhXG4gIH1cbn1cbmV4cG9ydHMuQXJyYXlIZWxwZXIgPSBBcnJheUhlbHBlclxuIiwiXG52YXIgQ29tbW9uSGVscGVyID0gY2xhc3MgQ29tbW9uSGVscGVyIHtcbiAgc3RhdGljIG1lcmdlICguLi54cykge1xuICAgIGlmICgoeHMgIT0gbnVsbCA/IHhzLmxlbmd0aCA6IG51bGwpID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFwKHt9LCBmdW5jdGlvbiAobSkge1xuICAgICAgICB2YXIgaSwgaywgbGVuLCByZXN1bHRzLCB2LCB4XG4gICAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHhzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgeCA9IHhzW2ldXG4gICAgICAgICAgcmVzdWx0cy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzMVxuICAgICAgICAgICAgcmVzdWx0czEgPSBbXVxuXG4gICAgICAgICAgICBmb3IgKGsgaW4geCkge1xuICAgICAgICAgICAgICB2ID0geFtrXVxuICAgICAgICAgICAgICByZXN1bHRzMS5wdXNoKG1ba10gPSB2KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0czFcbiAgICAgICAgICB9KCkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdGFwIChvLCBmbikge1xuICAgIGZuKG8pXG4gICAgcmV0dXJuIG9cbiAgfVxuXG4gIHN0YXRpYyBhcHBseU1peGlucyAoZGVyaXZlZEN0b3IsIGJhc2VDdG9ycykge1xuICAgIHJldHVybiBiYXNlQ3RvcnMuZm9yRWFjaChiYXNlQ3RvciA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLCBuYW1lLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2VDdG9yLnByb3RvdHlwZSwgbmFtZSkpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbmV4cG9ydHMuQ29tbW9uSGVscGVyID0gQ29tbW9uSGVscGVyXG4iLCJcbnZhciBOYW1lc3BhY2VIZWxwZXIgPSBjbGFzcyBOYW1lc3BhY2VIZWxwZXIge1xuICBzdGF0aWMgc3BsaXRGaXJzdCAoZnVsbG5hbWUsIGlzU3BhY2UgPSBmYWxzZSkge1xuICAgIHZhciBwYXJ0c1xuXG4gICAgaWYgKGZ1bGxuYW1lLmluZGV4T2YoJzonKSA9PT0gLTEgJiYgIWlzU3BhY2UpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdXG4gICAgfVxuXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLCBwYXJ0cy5qb2luKCc6JykgfHwgbnVsbF1cbiAgfVxuXG4gIHN0YXRpYyBzcGxpdCAoZnVsbG5hbWUpIHtcbiAgICB2YXIgbmFtZSwgcGFydHNcblxuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKCc6JykgPT09IC0xKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXVxuICAgIH1cblxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIG5hbWUgPSBwYXJ0cy5wb3AoKVxuICAgIHJldHVybiBbcGFydHMuam9pbignOicpLCBuYW1lXVxuICB9XG59XG5leHBvcnRzLk5hbWVzcGFjZUhlbHBlciA9IE5hbWVzcGFjZUhlbHBlclxuIiwiXG52YXIgT3B0aW9uYWxQcm9taXNlID0gY2xhc3MgT3B0aW9uYWxQcm9taXNlIHtcbiAgY29uc3RydWN0b3IgKHZhbDEpIHtcbiAgICB0aGlzLnZhbCA9IHZhbDFcblxuICAgIGlmICh0aGlzLnZhbCAhPSBudWxsICYmIHRoaXMudmFsLnRoZW4gIT0gbnVsbCAmJiB0aGlzLnZhbC5yZXN1bHQgIT0gbnVsbCkge1xuICAgICAgdGhpcy52YWwgPSB0aGlzLnZhbC5yZXN1bHQoKVxuICAgIH1cbiAgfVxuXG4gIHRoZW4gKGNiKSB7XG4gICAgaWYgKHRoaXMudmFsICE9IG51bGwgJiYgdGhpcy52YWwudGhlbiAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh0aGlzLnZhbC50aGVuKGNiKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UoY2IodGhpcy52YWwpKVxuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsXG4gIH1cbn1cbmV4cG9ydHMuT3B0aW9uYWxQcm9taXNlID0gT3B0aW9uYWxQcm9taXNlXG5cbnZhciBvcHRpb25hbFByb21pc2UgPSBmdW5jdGlvbiAodmFsKSB7XG4gIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKHZhbClcbn1cblxuZXhwb3J0cy5vcHRpb25hbFByb21pc2UgPSBvcHRpb25hbFByb21pc2VcbiIsIlxudmFyIFBhdGhIZWxwZXIgPSBjbGFzcyBQYXRoSGVscGVyIHtcbiAgc3RhdGljIGdldFBhdGggKG9iaiwgcGF0aCwgc2VwID0gJy4nKSB7XG4gICAgdmFyIGN1ciwgcGFydHNcbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKVxuICAgIGN1ciA9IG9ialxuICAgIHBhcnRzLmZpbmQocGFydCA9PiB7XG4gICAgICBjdXIgPSBjdXJbcGFydF1cbiAgICAgIHJldHVybiB0eXBlb2YgY3VyID09PSAndW5kZWZpbmVkJ1xuICAgIH0pXG4gICAgcmV0dXJuIGN1clxuICB9XG5cbiAgc3RhdGljIHNldFBhdGggKG9iaiwgcGF0aCwgdmFsLCBzZXAgPSAnLicpIHtcbiAgICB2YXIgbGFzdCwgcGFydHNcbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKVxuICAgIGxhc3QgPSBwYXJ0cy5wb3AoKVxuICAgIGNvbnN0IHRhcmdldCA9IHBhcnRzLnJlZHVjZSgoY3VyLCBwYXJ0KSA9PiB7XG4gICAgICBpZiAoY3VyW3BhcnRdID09IG51bGwpIHtcbiAgICAgICAgY3VyW3BhcnRdID0ge31cbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXJbcGFydF1cbiAgICB9LCBvYmopXG4gICAgdGFyZ2V0W2xhc3RdID0gdmFsXG4gICAgcmV0dXJuIHZhbFxuICB9XG59XG5leHBvcnRzLlBhdGhIZWxwZXIgPSBQYXRoSGVscGVyXG4iLCJcbmNvbnN0IFNpemUgPSByZXF1aXJlKCcuLi9wb3NpdGlvbmluZy9TaXplJykuU2l6ZVxuXG52YXIgU3RyaW5nSGVscGVyID0gY2xhc3MgU3RyaW5nSGVscGVyIHtcbiAgc3RhdGljIHRyaW1FbXB0eUxpbmUgKHR4dCkge1xuICAgIHJldHVybiB0eHQucmVwbGFjZSgvXlxccypcXHI/XFxuLywgJycpLnJlcGxhY2UoL1xccj9cXG5cXHMqJC8sICcnKVxuICB9XG5cbiAgc3RhdGljIGVzY2FwZVJlZ0V4cCAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLVtcXF0ve30oKSorPy5cXFxcXiR8XS9nLCAnXFxcXCQmJylcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXRUb0xlbmd0aCAodHh0LCBsZW5ndGgpIHtcbiAgICBpZiAobGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIHJldHVybiBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gdHh0Lmxlbmd0aCkgKyAxKS5qb2luKHR4dCkuc3Vic3RyaW5nKDAsIGxlbmd0aClcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXQgKHR4dCwgbmIpIHtcbiAgICByZXR1cm4gQXJyYXkobmIgKyAxKS5qb2luKHR4dClcbiAgfVxuXG4gIHN0YXRpYyBnZXRUeHRTaXplICh0eHQpIHtcbiAgICB2YXIgaiwgbCwgbGVuLCBsaW5lcywgd1xuICAgIGxpbmVzID0gdHh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoJ1xcbicpXG4gICAgdyA9IDBcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBsID0gbGluZXNbal1cbiAgICAgIHcgPSBNYXRoLm1heCh3LCBsLmxlbmd0aClcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFNpemUodywgbGluZXMubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnROb3RGaXJzdCAodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgdmFyIHJlZ1xuXG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gL1xcbi9nXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgJ1xcbicgKyB0aGlzLnJlcGVhdChzcGFjZXMsIG5iKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHRcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaW5kZW50ICh0ZXh0LCBuYiA9IDEsIHNwYWNlcyA9ICcgICcpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gc3BhY2VzICsgdGhpcy5pbmRlbnROb3RGaXJzdCh0ZXh0LCBuYiwgc3BhY2VzKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dFxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZXZlcnNlU3RyICh0eHQpIHtcbiAgICByZXR1cm4gdHh0LnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJylcbiAgfVxuXG4gIHN0YXRpYyByZW1vdmVDYXJyZXQgKHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciByZUNhcnJldCwgcmVRdW90ZWQsIHJlVG1wLCB0bXBcbiAgICB0bXAgPSAnW1tbW3F1b3RlZF9jYXJyZXRdXV1dJ1xuICAgIHJlQ2FycmV0ID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyKSwgJ2cnKVxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksICdnJylcbiAgICByZVRtcCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAodG1wKSwgJ2cnKVxuICAgIHJldHVybiB0eHQucmVwbGFjZShyZVF1b3RlZCwgdG1wKS5yZXBsYWNlKHJlQ2FycmV0LCAnJykucmVwbGFjZShyZVRtcCwgY2FycmV0Q2hhcilcbiAgfVxuXG4gIHN0YXRpYyBnZXRBbmRSZW1vdmVGaXJzdENhcnJldCAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIHBvc1xuICAgIHBvcyA9IHRoaXMuZ2V0Q2FycmV0UG9zKHR4dCwgY2FycmV0Q2hhcilcblxuICAgIGlmIChwb3MgIT0gbnVsbCkge1xuICAgICAgdHh0ID0gdHh0LnN1YnN0cigwLCBwb3MpICsgdHh0LnN1YnN0cihwb3MgKyBjYXJyZXRDaGFyLmxlbmd0aClcbiAgICAgIHJldHVybiBbcG9zLCB0eHRdXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldENhcnJldFBvcyAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIGksIHJlUXVvdGVkXG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgJ2cnKVxuICAgIHR4dCA9IHR4dC5yZXBsYWNlKHJlUXVvdGVkLCAnICcpXG5cbiAgICBpZiAoKGkgPSB0eHQuaW5kZXhPZihjYXJyZXRDaGFyKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGlcbiAgICB9XG4gIH1cbn1cbmV4cG9ydHMuU3RyaW5nSGVscGVyID0gU3RyaW5nSGVscGVyXG4iLCJcbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vUG9zJykuUG9zXG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IFBhaXJNYXRjaCA9IHJlcXVpcmUoJy4vUGFpck1hdGNoJykuUGFpck1hdGNoXG5cbnZhciBQYWlyID0gY2xhc3MgUGFpciB7XG4gIGNvbnN0cnVjdG9yIChvcGVuZXIsIGNsb3Nlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbFxuICAgIHRoaXMub3BlbmVyID0gb3BlbmVyXG4gICAgdGhpcy5jbG9zZXIgPSBjbG9zZXJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBvcHRpb25uYWxfZW5kOiBmYWxzZSxcbiAgICAgIHZhbGlkTWF0Y2g6IG51bGxcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIHRoaXMub3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSB0aGlzLm9wdGlvbnNba2V5XVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3BlbmVyUmVnICgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub3BlbmVyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm9wZW5lcikpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm9wZW5lclxuICAgIH1cbiAgfVxuXG4gIGNsb3NlclJlZyAoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmNsb3NlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jbG9zZXIpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZXJcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueVBhcnRzICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BlbmVyOiB0aGlzLm9wZW5lclJlZygpLFxuICAgICAgY2xvc2VyOiB0aGlzLmNsb3NlclJlZygpXG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0S2V5cyAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMubWF0Y2hBbnlQYXJ0cygpKVxuICB9XG5cbiAgbWF0Y2hBbnlSZWcgKCkge1xuICAgIHZhciBncm91cHMsIGtleSwgcmVmLCByZWdcbiAgICBncm91cHMgPSBbXVxuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpXG5cbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHJlZyA9IHJlZltrZXldXG4gICAgICBncm91cHMucHVzaCgnKCcgKyByZWcuc291cmNlICsgJyknKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVnRXhwKGdyb3Vwcy5qb2luKCd8JykpXG4gIH1cblxuICBtYXRjaEFueSAodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaFxuXG4gICAgd2hpbGUgKChtYXRjaCA9IHRoaXMuX21hdGNoQW55KHRleHQsIG9mZnNldCkpICE9IG51bGwgJiYgIW1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpXG4gICAgfVxuXG4gICAgaWYgKG1hdGNoICE9IG51bGwgJiYgbWF0Y2gudmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1hdGNoXG4gICAgfVxuICB9XG5cbiAgX21hdGNoQW55ICh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoXG5cbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KVxuICAgIH1cblxuICAgIG1hdGNoID0gdGhpcy5tYXRjaEFueVJlZygpLmV4ZWModGV4dClcblxuICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLCBtYXRjaCwgb2Zmc2V0KVxuICAgIH1cbiAgfVxuXG4gIG1hdGNoQW55TmFtZWQgKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF0Y2hBbnlHZXROYW1lKHRoaXMubWF0Y2hBbnkodGV4dCkpXG4gIH1cblxuICBtYXRjaEFueUxhc3QgKHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2gsIHJlc1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbmQtYXNzaWduXG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuXG4gICAgICBpZiAoIXJlcyB8fCByZXMuZW5kKCkgIT09IG1hdGNoLmVuZCgpKSB7XG4gICAgICAgIHJlcyA9IG1hdGNoXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc1xuICB9XG5cbiAgaWRlbnRpY2FsICgpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZXIgPT09IHRoaXMuY2xvc2VyIHx8IChcbiAgICAgIHRoaXMub3BlbmVyLnNvdXJjZSAhPSBudWxsICYmXG4gICAgICB0aGlzLmNsb3Nlci5zb3VyY2UgIT0gbnVsbCAmJlxuICAgICAgdGhpcy5vcGVuZXIuc291cmNlID09PSB0aGlzLmNsb3Nlci5zb3VyY2VcbiAgICApXG4gIH1cblxuICB3cmFwcGVyUG9zIChwb3MsIHRleHQpIHtcbiAgICB2YXIgZW5kLCBzdGFydFxuICAgIHN0YXJ0ID0gdGhpcy5tYXRjaEFueUxhc3QodGV4dC5zdWJzdHIoMCwgcG9zLnN0YXJ0KSlcblxuICAgIGlmIChzdGFydCAhPSBudWxsICYmICh0aGlzLmlkZW50aWNhbCgpIHx8IHN0YXJ0Lm5hbWUoKSA9PT0gJ29wZW5lcicpKSB7XG4gICAgICBlbmQgPSB0aGlzLm1hdGNoQW55KHRleHQsIHBvcy5lbmQpXG5cbiAgICAgIGlmIChlbmQgIT0gbnVsbCAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBlbmQubmFtZSgpID09PSAnY2xvc2VyJykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgZW5kLmVuZCgpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbm5hbF9lbmQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgdGV4dC5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNXYXBwZXJPZiAocG9zLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlclBvcyhwb3MsIHRleHQpICE9IG51bGxcbiAgfVxufVxuZXhwb3J0cy5QYWlyID0gUGFpclxuIiwiXG52YXIgUGFpck1hdGNoID0gY2xhc3MgUGFpck1hdGNoIHtcbiAgY29uc3RydWN0b3IgKHBhaXIsIG1hdGNoLCBvZmZzZXQgPSAwKSB7XG4gICAgdGhpcy5wYWlyID0gcGFpclxuICAgIHRoaXMubWF0Y2ggPSBtYXRjaFxuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0XG4gIH1cblxuICBuYW1lICgpIHtcbiAgICB2YXIgX25hbWUsIGdyb3VwLCBpLCBqLCBsZW4sIHJlZlxuXG4gICAgaWYgKHRoaXMubWF0Y2gpIHtcbiAgICAgIGlmICh0eXBlb2YgX25hbWUgPT09ICd1bmRlZmluZWQnIHx8IF9uYW1lID09PSBudWxsKSB7XG4gICAgICAgIHJlZiA9IHRoaXMubWF0Y2hcblxuICAgICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICAgIGdyb3VwID0gcmVmW2ldXG5cbiAgICAgICAgICBpZiAoaSA+IDAgJiYgZ3JvdXAgIT0gbnVsbCkge1xuICAgICAgICAgICAgX25hbWUgPSB0aGlzLnBhaXIubWF0Y2hBbnlQYXJ0S2V5cygpW2kgLSAxXVxuICAgICAgICAgICAgcmV0dXJuIF9uYW1lXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX25hbWUgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gX25hbWUgfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIHN0YXJ0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMub2Zmc2V0XG4gIH1cblxuICBlbmQgKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoLmluZGV4ICsgdGhpcy5tYXRjaFswXS5sZW5ndGggKyB0aGlzLm9mZnNldFxuICB9XG5cbiAgdmFsaWQgKCkge1xuICAgIHJldHVybiAhdGhpcy5wYWlyLnZhbGlkTWF0Y2ggfHwgdGhpcy5wYWlyLnZhbGlkTWF0Y2godGhpcylcbiAgfVxuXG4gIGxlbmd0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hbMF0ubGVuZ3RoXG4gIH1cbn1cbmV4cG9ydHMuUGFpck1hdGNoID0gUGFpck1hdGNoXG4iLCJcbnZhciBQb3MgPSBjbGFzcyBQb3Mge1xuICBjb25zdHJ1Y3RvciAoc3RhcnQsIGVuZCkge1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydFxuICAgIHRoaXMuZW5kID0gZW5kXG5cbiAgICBpZiAodGhpcy5lbmQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5lbmQgPSB0aGlzLnN0YXJ0XG4gICAgfVxuICB9XG5cbiAgY29udGFpbnNQdCAocHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmVuZFxuICB9XG5cbiAgY29udGFpbnNQb3MgKHBvcykge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuZW5kXG4gIH1cblxuICB3cmFwcGVkQnkgKHByZWZpeCwgc3VmZml4KSB7XG4gICAgY29uc3QgV3JhcENsYXNzID0gUG9zLndyYXBDbGFzc1xuICAgIHJldHVybiBuZXcgV3JhcENsYXNzKHRoaXMuc3RhcnQgLSBwcmVmaXgubGVuZ3RoLCB0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5lbmQgKyBzdWZmaXgubGVuZ3RoKVxuICB9XG5cbiAgd2l0aEVkaXRvciAodmFsKSB7XG4gICAgdGhpcy5fZWRpdG9yID0gdmFsXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGVkaXRvciAoKSB7XG4gICAgaWYgKHRoaXMuX2VkaXRvciA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVkaXRvciBzZXQnKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9lZGl0b3JcbiAgfVxuXG4gIGhhc0VkaXRvciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvciAhPSBudWxsXG4gIH1cblxuICB0ZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKVxuICB9XG5cbiAgYXBwbHlPZmZzZXQgKG9mZnNldCkge1xuICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICB0aGlzLmVuZCArPSBvZmZzZXRcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHJldkVPTCAoKSB7XG4gICAgaWYgKHRoaXMuX3ByZXZFT0wgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcHJldkVPTCA9IHRoaXMuZWRpdG9yKCkuZmluZExpbmVTdGFydCh0aGlzLnN0YXJ0KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wcmV2RU9MXG4gIH1cblxuICBuZXh0RU9MICgpIHtcbiAgICBpZiAodGhpcy5fbmV4dEVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9uZXh0RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZUVuZCh0aGlzLmVuZClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbmV4dEVPTFxuICB9XG5cbiAgdGV4dFdpdGhGdWxsTGluZXMgKCkge1xuICAgIGlmICh0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcyA9PSBudWxsKSB7XG4gICAgICB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcyA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5uZXh0RU9MKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RleHRXaXRoRnVsbExpbmVzXG4gIH1cblxuICBzYW1lTGluZXNQcmVmaXggKCkge1xuICAgIGlmICh0aGlzLl9zYW1lTGluZXNQcmVmaXggPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2FtZUxpbmVzUHJlZml4ID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMucHJldkVPTCgpLCB0aGlzLnN0YXJ0KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNQcmVmaXhcbiAgfVxuXG4gIHNhbWVMaW5lc1N1ZmZpeCAoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNTdWZmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5lbmQsIHRoaXMubmV4dEVPTCgpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNTdWZmaXhcbiAgfVxuXG4gIGNvcHkgKCkge1xuICAgIHZhciByZXNcbiAgICByZXMgPSBuZXcgUG9zKHRoaXMuc3RhcnQsIHRoaXMuZW5kKVxuXG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc1xuICB9XG5cbiAgcmF3ICgpIHtcbiAgICByZXR1cm4gW3RoaXMuc3RhcnQsIHRoaXMuZW5kXVxuICB9XG59XG5leHBvcnRzLlBvcyA9IFBvc1xuIiwiXG5jb25zdCBXcmFwcGluZyA9IHJlcXVpcmUoJy4vV3JhcHBpbmcnKS5XcmFwcGluZ1xuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoJy4vUmVwbGFjZW1lbnQnKS5SZXBsYWNlbWVudFxuXG5jb25zdCBDb21tb25IZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcicpLkNvbW1vbkhlbHBlclxuXG52YXIgUG9zQ29sbGVjdGlvbiA9IGNsYXNzIFBvc0NvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3RvciAoYXJyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIGFyciA9IFthcnJdXG4gICAgfVxuXG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFyciwgW1Bvc0NvbGxlY3Rpb25dKVxuXG4gICAgcmV0dXJuIGFyclxuICB9XG5cbiAgd3JhcCAocHJlZml4LCBzdWZmaXgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBuZXcgV3JhcHBpbmcocC5zdGFydCwgcC5lbmQsIHByZWZpeCwgc3VmZml4KVxuICAgIH0pXG4gIH1cblxuICByZXBsYWNlICh0eHQpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dClcbiAgICB9KVxuICB9XG59XG5leHBvcnRzLlBvc0NvbGxlY3Rpb24gPSBQb3NDb2xsZWN0aW9uXG4iLCJcbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vUG9zJykuUG9zXG5cbmNvbnN0IENvbW1vbkhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJykuQ29tbW9uSGVscGVyXG5cbmNvbnN0IE9wdGlvbk9iamVjdCA9IHJlcXVpcmUoJy4uL09wdGlvbk9iamVjdCcpLk9wdGlvbk9iamVjdFxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG52YXIgUmVwbGFjZW1lbnQgPSBjbGFzcyBSZXBsYWNlbWVudCBleHRlbmRzIFBvcyB7XG4gIGNvbnN0cnVjdG9yIChzdGFydDEsIGVuZCwgdGV4dDEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQxXG4gICAgdGhpcy5lbmQgPSBlbmRcbiAgICB0aGlzLnRleHQgPSB0ZXh0MVxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zLCB7XG4gICAgICBwcmVmaXg6ICcnLFxuICAgICAgc3VmZml4OiAnJyxcbiAgICAgIHNlbGVjdGlvbnM6IFtdXG4gICAgfSlcbiAgfVxuXG4gIHJlc1Bvc0JlZm9yZVByZWZpeCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnRleHQubGVuZ3RoXG4gIH1cblxuICByZXNFbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5maW5hbFRleHQoKS5sZW5ndGhcbiAgfVxuXG4gIGFwcGx5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS5zcGxpY2VUZXh0KHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLmZpbmFsVGV4dCgpKVxuICB9XG5cbiAgbmVjZXNzYXJ5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKSAhPT0gdGhpcy5vcmlnaW5hbFRleHQoKVxuICB9XG5cbiAgb3JpZ2luYWxUZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKVxuICB9XG5cbiAgZmluYWxUZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLnRleHQgKyB0aGlzLnN1ZmZpeFxuICB9XG5cbiAgb2Zmc2V0QWZ0ZXIgKCkge1xuICAgIHJldHVybiB0aGlzLmZpbmFsVGV4dCgpLmxlbmd0aCAtICh0aGlzLmVuZCAtIHRoaXMuc3RhcnQpXG4gIH1cblxuICBhcHBseU9mZnNldCAob2Zmc2V0KSB7XG4gICAgdmFyIGksIGxlbiwgcmVmLCBzZWxcblxuICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICB0aGlzLmVuZCArPSBvZmZzZXRcbiAgICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9uc1xuXG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc2VsID0gcmVmW2ldXG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc2VsZWN0Q29udGVudCAoKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25zID0gW25ldyBQb3ModGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCwgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCArIHRoaXMudGV4dC5sZW5ndGgpXVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBjYXJyZXRUb1NlbCAoKSB7XG4gICAgdmFyIHBvcywgcmVzLCBzdGFydCwgdGV4dFxuICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtdXG4gICAgdGV4dCA9IHRoaXMuZmluYWxUZXh0KClcbiAgICB0aGlzLnByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5wcmVmaXgpXG4gICAgdGhpcy50ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnRleHQpXG4gICAgdGhpcy5zdWZmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMuc3VmZml4KVxuICAgIHN0YXJ0ID0gdGhpcy5zdGFydFxuXG4gICAgd2hpbGUgKChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpICE9IG51bGwpIHtcbiAgICAgIFtwb3MsIHRleHRdID0gcmVzXG4gICAgICB0aGlzLnNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0ICsgcG9zLCBzdGFydCArIHBvcykpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGNvcHkgKCkge1xuICAgIHZhciByZXNcbiAgICByZXMgPSBuZXcgUmVwbGFjZW1lbnQodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMudGV4dCwgdGhpcy5nZXRPcHRzKCkpXG5cbiAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSlcbiAgICB9XG5cbiAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLmNvcHkoKVxuICAgIH0pXG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5cbkNvbW1vbkhlbHBlci5hcHBseU1peGlucyhSZXBsYWNlbWVudC5wcm90b3R5cGUsIFtPcHRpb25PYmplY3RdKVxuXG5leHBvcnRzLlJlcGxhY2VtZW50ID0gUmVwbGFjZW1lbnRcbiIsIlxudmFyIFNpemUgPSBjbGFzcyBTaXplIHtcbiAgY29uc3RydWN0b3IgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICB9XG59XG5leHBvcnRzLlNpemUgPSBTaXplXG4iLCJcbnZhciBTdHJQb3MgPSBjbGFzcyBTdHJQb3Mge1xuICBjb25zdHJ1Y3RvciAocG9zLCBzdHIpIHtcbiAgICB0aGlzLnBvcyA9IHBvc1xuICAgIHRoaXMuc3RyID0gc3RyXG4gIH1cblxuICBlbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aFxuICB9XG59XG5leHBvcnRzLlN0clBvcyA9IFN0clBvc1xuIiwiXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL1BvcycpLlBvc1xuXG52YXIgV3JhcHBlZFBvcyA9IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3Mge1xuICBjb25zdHJ1Y3RvciAoc3RhcnQsIGlubmVyU3RhcnQsIGlubmVyRW5kLCBlbmQpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0XG4gICAgdGhpcy5pbm5lclN0YXJ0ID0gaW5uZXJTdGFydFxuICAgIHRoaXMuaW5uZXJFbmQgPSBpbm5lckVuZFxuICAgIHRoaXMuZW5kID0gZW5kXG4gIH1cblxuICBpbm5lckNvbnRhaW5zUHQgKHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmlubmVyRW5kXG4gIH1cblxuICBpbm5lckNvbnRhaW5zUG9zIChwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuaW5uZXJFbmRcbiAgfVxuXG4gIGlubmVyVGV4dCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLmlubmVyU3RhcnQsIHRoaXMuaW5uZXJFbmQpXG4gIH1cblxuICBzZXRJbm5lckxlbiAobGVuKSB7XG4gICAgcmV0dXJuIHRoaXMubW92ZVN1Zml4KHRoaXMuaW5uZXJTdGFydCArIGxlbilcbiAgfVxuXG4gIG1vdmVTdWZmaXggKHB0KSB7XG4gICAgdmFyIHN1ZmZpeExlblxuICAgIHN1ZmZpeExlbiA9IHRoaXMuZW5kIC0gdGhpcy5pbm5lckVuZFxuICAgIHRoaXMuaW5uZXJFbmQgPSBwdFxuICAgIHRoaXMuZW5kID0gdGhpcy5pbm5lckVuZCArIHN1ZmZpeExlblxuICB9XG5cbiAgY29weSAoKSB7XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKHRoaXMuc3RhcnQsIHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCwgdGhpcy5lbmQpXG4gIH1cbn1cbmV4cG9ydHMuV3JhcHBlZFBvcyA9IFdyYXBwZWRQb3NcbiIsIlxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKCcuL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxudmFyIFdyYXBwaW5nID0gY2xhc3MgV3JhcHBpbmcgZXh0ZW5kcyBSZXBsYWNlbWVudCB7XG4gIGNvbnN0cnVjdG9yIChzdGFydCwgZW5kLCBwcmVmaXggPSAnJywgc3VmZml4ID0gJycsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnRcbiAgICB0aGlzLmVuZCA9IGVuZFxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zKVxuICAgIHRoaXMudGV4dCA9ICcnXG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXhcbiAgICB0aGlzLnN1ZmZpeCA9IHN1ZmZpeFxuICB9XG5cbiAgYXBwbHkgKCkge1xuICAgIHRoaXMuYWRqdXN0U2VsKClcbiAgICByZXR1cm4gc3VwZXIuYXBwbHkoKVxuICB9XG5cbiAgYWRqdXN0U2VsICgpIHtcbiAgICB2YXIgaSwgbGVuLCBvZmZzZXQsIHJlZiwgcmVzdWx0cywgc2VsXG4gICAgb2Zmc2V0ID0gdGhpcy5vcmlnaW5hbFRleHQoKS5sZW5ndGhcbiAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnNcbiAgICByZXN1bHRzID0gW11cblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2VsID0gcmVmW2ldXG5cbiAgICAgIGlmIChzZWwuc3RhcnQgPiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbC5lbmQgPj0gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHRzLnB1c2goc2VsLmVuZCArPSBvZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2gobnVsbClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgZmluYWxUZXh0ICgpIHtcbiAgICB2YXIgdGV4dFxuXG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHRleHQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSAnJ1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRleHQgKyB0aGlzLnN1ZmZpeFxuICB9XG5cbiAgb2Zmc2V0QWZ0ZXIgKCkge1xuICAgIHJldHVybiB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN1ZmZpeC5sZW5ndGhcbiAgfVxuXG4gIGNvcHkgKCkge1xuICAgIHZhciByZXNcbiAgICByZXMgPSBuZXcgV3JhcHBpbmcodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMucHJlZml4LCB0aGlzLnN1ZmZpeClcbiAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLmNvcHkoKVxuICAgIH0pXG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5leHBvcnRzLldyYXBwaW5nID0gV3JhcHBpbmdcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5cbnZhciBMb2NhbFN0b3JhZ2VFbmdpbmUgPSBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmUge1xuICBzYXZlIChrZXksIHZhbCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmZ1bGxLZXkoa2V5KSwgSlNPTi5zdHJpbmdpZnkodmFsKSlcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoIChwYXRoLCBrZXksIHZhbCkge1xuICAgIHZhciBkYXRhXG4gICAgZGF0YSA9IHRoaXMubG9hZChwYXRoKVxuXG4gICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuXG4gICAgZGF0YVtrZXldID0gdmFsXG4gICAgcmV0dXJuIHRoaXMuc2F2ZShwYXRoLCBkYXRhKVxuICB9XG5cbiAgbG9hZCAoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5mdWxsS2V5KGtleSkpKVxuICAgIH1cbiAgfVxuXG4gIGZ1bGxLZXkgKGtleSkge1xuICAgIHJldHVybiAnQ29kZVdhdmVfJyArIGtleVxuICB9XG59XG5leHBvcnRzLkxvY2FsU3RvcmFnZUVuZ2luZSA9IExvY2FsU3RvcmFnZUVuZ2luZVxuIiwiXG52YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3RvciAocGFyc2VyLCBwYXJlbnQpIHtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlclxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50XG4gICAgdGhpcy5jb250ZW50ID0gJydcbiAgfVxuXG4gIG9uU3RhcnQgKCkge1xuICAgIHRoaXMuc3RhcnRBdCA9IHRoaXMucGFyc2VyLnBvc1xuICB9XG5cbiAgb25DaGFyIChjaGFyKSB7fVxuXG4gIGVuZCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VyLnNldENvbnRleHQodGhpcy5wYXJlbnQpXG4gIH1cblxuICBvbkVuZCAoKSB7fVxuXG4gIHRlc3RDb250ZXh0IChDb250ZXh0VHlwZSkge1xuICAgIGlmIChDb250ZXh0VHlwZS50ZXN0KHRoaXMucGFyc2VyLmNoYXIsIHRoaXMpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2V0Q29udGV4dChuZXcgQ29udGV4dFR5cGUodGhpcy5wYXJzZXIsIHRoaXMpKVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB0ZXN0ICgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuZXhwb3J0cy5Db250ZXh0ID0gQ29udGV4dFxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG52YXIgRXNjYXBlQ29udGV4dCA9IGNsYXNzIEVzY2FwZUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25DaGFyIChjaGFyKSB7XG4gICAgdGhpcy5wYXJlbnQuY29udGVudCArPSBjaGFyXG4gICAgcmV0dXJuIHRoaXMuZW5kKClcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0IChjaGFyKSB7XG4gICAgcmV0dXJuIGNoYXIgPT09ICdcXFxcJ1xuICB9XG59XG5leHBvcnRzLkVzY2FwZUNvbnRleHQgPSBFc2NhcGVDb250ZXh0XG4iLCJcbmNvbnN0IFBhcmFtQ29udGV4dCA9IHJlcXVpcmUoJy4vUGFyYW1Db250ZXh0JykuUGFyYW1Db250ZXh0XG5cbnZhciBOYW1lZENvbnRleHQgPSBjbGFzcyBOYW1lZENvbnRleHQgZXh0ZW5kcyBQYXJhbUNvbnRleHQge1xuICBvblN0YXJ0ICgpIHtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLnBhcmVudC5jb250ZW50XG4gIH1cblxuICBvbkVuZCAoKSB7XG4gICAgdGhpcy5wYXJzZXIubmFtZWRbdGhpcy5uYW1lXSA9IHRoaXMuY29udGVudFxuICB9XG5cbiAgc3RhdGljIHRlc3QgKGNoYXIsIHBhcmVudCkge1xuICAgIHJldHVybiBjaGFyID09PSAnOicgJiYgKHBhcmVudC5wYXJzZXIub3B0aW9ucy5hbGxvd2VkTmFtZWQgPT0gbnVsbCB8fCBwYXJlbnQucGFyc2VyLm9wdGlvbnMuYWxsb3dlZE5hbWVkLmluZGV4T2YocGFyZW50LmNvbnRlbnQpID49IDApXG4gIH1cbn1cbmV4cG9ydHMuTmFtZWRDb250ZXh0ID0gTmFtZWRDb250ZXh0XG4iLCJcbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbmNvbnN0IFN0cmluZ0NvbnRleHQgPSByZXF1aXJlKCcuL1N0cmluZ0NvbnRleHQnKS5TdHJpbmdDb250ZXh0XG5cbmNvbnN0IFZhcmlhYmxlQ29udGV4dCA9IHJlcXVpcmUoJy4vVmFyaWFibGVDb250ZXh0JykuVmFyaWFibGVDb250ZXh0XG5cbnZhciBQYXJhbUNvbnRleHQgPSBjbGFzcyBQYXJhbUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25DaGFyIChjaGFyKSB7XG4gICAgaWYgKHRoaXMudGVzdENvbnRleHQoU3RyaW5nQ29udGV4dCkpIHt9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoUGFyYW1Db250ZXh0Lm5hbWVkKSkge30gZWxzZSBpZiAodGhpcy50ZXN0Q29udGV4dChWYXJpYWJsZUNvbnRleHQpKSB7fSBlbHNlIGlmIChjaGFyID09PSAnICcpIHtcbiAgICAgIHRoaXMucGFyc2VyLnNldENvbnRleHQobmV3IFBhcmFtQ29udGV4dCh0aGlzLnBhcnNlcikpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudCArPSBjaGFyXG4gICAgfVxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHRoaXMucGFyc2VyLnBhcmFtcy5wdXNoKHRoaXMuY29udGVudClcbiAgfVxufVxuZXhwb3J0cy5QYXJhbUNvbnRleHQgPSBQYXJhbUNvbnRleHRcbiIsIlxuY29uc3QgUGFyYW1Db250ZXh0ID0gcmVxdWlyZSgnLi9QYXJhbUNvbnRleHQnKS5QYXJhbUNvbnRleHRcblxuY29uc3QgTmFtZWRDb250ZXh0ID0gcmVxdWlyZSgnLi9OYW1lZENvbnRleHQnKS5OYW1lZENvbnRleHRcblxuUGFyYW1Db250ZXh0Lm5hbWVkID0gTmFtZWRDb250ZXh0XG52YXIgUGFyYW1QYXJzZXIgPSBjbGFzcyBQYXJhbVBhcnNlciB7XG4gIGNvbnN0cnVjdG9yIChwYXJhbVN0cmluZywgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5wYXJhbVN0cmluZyA9IHBhcmFtU3RyaW5nXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMucGFyc2UoKVxuICB9XG5cbiAgc2V0Q29udGV4dCAoY29udGV4dCkge1xuICAgIHZhciBvbGRDb250ZXh0XG4gICAgb2xkQ29udGV4dCA9IHRoaXMuY29udGV4dFxuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRcblxuICAgIGlmIChvbGRDb250ZXh0ICE9IG51bGwgJiYgb2xkQ29udGV4dCAhPT0gKGNvbnRleHQgIT0gbnVsbCA/IGNvbnRleHQucGFyZW50IDogbnVsbCkpIHtcbiAgICAgIG9sZENvbnRleHQub25FbmQoKVxuICAgIH1cblxuICAgIGlmIChjb250ZXh0ICE9IG51bGwpIHtcbiAgICAgIGNvbnRleHQub25TdGFydCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dFxuICB9XG5cbiAgcGFyc2UgKCkge1xuICAgIHRoaXMucGFyYW1zID0gW11cbiAgICB0aGlzLm5hbWVkID0ge31cblxuICAgIGlmICh0aGlzLnBhcmFtU3RyaW5nLmxlbmd0aCkge1xuICAgICAgdGhpcy5zZXRDb250ZXh0KG5ldyBQYXJhbUNvbnRleHQodGhpcykpXG4gICAgICB0aGlzLnBvcyA9IDBcblxuICAgICAgd2hpbGUgKHRoaXMucG9zIDwgdGhpcy5wYXJhbVN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jaGFyID0gdGhpcy5wYXJhbVN0cmluZ1t0aGlzLnBvc11cbiAgICAgICAgdGhpcy5jb250ZXh0Lm9uQ2hhcih0aGlzLmNoYXIpXG4gICAgICAgIHRoaXMucG9zKytcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2V0Q29udGV4dChudWxsKVxuICAgIH1cbiAgfVxuXG4gIHRha2UgKG5iKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1TdHJpbmcuc3Vic3RyaW5nKHRoaXMucG9zLCB0aGlzLnBvcyArIG5iKVxuICB9XG5cbiAgc2tpcCAobmIgPSAxKSB7XG4gICAgdGhpcy5wb3MgKz0gbmJcbiAgfVxufVxuZXhwb3J0cy5QYXJhbVBhcnNlciA9IFBhcmFtUGFyc2VyXG4iLCJcbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbmNvbnN0IEVzY2FwZUNvbnRleHQgPSByZXF1aXJlKCcuL0VzY2FwZUNvbnRleHQnKS5Fc2NhcGVDb250ZXh0XG5cbmNvbnN0IFZhcmlhYmxlQ29udGV4dCA9IHJlcXVpcmUoJy4vVmFyaWFibGVDb250ZXh0JykuVmFyaWFibGVDb250ZXh0XG5cbnZhciBTdHJpbmdDb250ZXh0ID0gY2xhc3MgU3RyaW5nQ29udGV4dCBleHRlbmRzIENvbnRleHQge1xuICBvbkNoYXIgKGNoYXIpIHtcbiAgICBpZiAodGhpcy50ZXN0Q29udGV4dChFc2NhcGVDb250ZXh0KSkge30gZWxzZSBpZiAodGhpcy50ZXN0Q29udGV4dChWYXJpYWJsZUNvbnRleHQpKSB7fSBlbHNlIGlmIChTdHJpbmdDb250ZXh0LmlzRGVsaW1pdGVyKGNoYXIpKSB7XG4gICAgICB0aGlzLmVuZCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudCArPSBjaGFyXG4gICAgfVxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHRoaXMucGFyZW50LmNvbnRlbnQgKz0gdGhpcy5jb250ZW50XG4gIH1cblxuICBzdGF0aWMgdGVzdCAoY2hhcikge1xuICAgIHJldHVybiB0aGlzLmlzRGVsaW1pdGVyKGNoYXIpXG4gIH1cblxuICBzdGF0aWMgaXNEZWxpbWl0ZXIgKGNoYXIpIHtcbiAgICByZXR1cm4gY2hhciA9PT0gJ1wiJyB8fCBjaGFyID09PSBcIidcIlxuICB9XG59XG5leHBvcnRzLlN0cmluZ0NvbnRleHQgPSBTdHJpbmdDb250ZXh0XG4iLCJcbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbnZhciBWYXJpYWJsZUNvbnRleHQgPSBjbGFzcyBWYXJpYWJsZUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25TdGFydCAoKSB7XG4gICAgdGhpcy5wYXJzZXIuc2tpcCgpXG4gIH1cblxuICBvbkNoYXIgKGNoYXIpIHtcbiAgICBpZiAoY2hhciA9PT0gJ30nKSB7XG4gICAgICB0aGlzLmVuZCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudCArPSBjaGFyXG4gICAgfVxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHZhciByZWZcbiAgICB0aGlzLnBhcmVudC5jb250ZW50ICs9ICgocmVmID0gdGhpcy5wYXJzZXIub3B0aW9ucy52YXJzKSAhPSBudWxsID8gcmVmW3RoaXMuY29udGVudF0gOiBudWxsKSB8fCAnJ1xuICB9XG5cbiAgc3RhdGljIHRlc3QgKGNoYXIsIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQucGFyc2VyLnRha2UoMikgPT09ICcjeydcbiAgfVxufVxuZXhwb3J0cy5WYXJpYWJsZUNvbnRleHQgPSBWYXJpYWJsZUNvbnRleHRcbiIsIi8qIVxuICogaW5mbGVjdGlvblxuICogQ29weXJpZ2h0KGMpIDIwMTEgQmVuIExpbiA8YmVuQGRyZWFtZXJzbGFiLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICpcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEEgcG9ydCBvZiBpbmZsZWN0aW9uLWpzIHRvIG5vZGUuanMgbW9kdWxlLlxuICovXG5cbiggZnVuY3Rpb24gKCByb290LCBmYWN0b3J5ICl7XG4gIGlmKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKXtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkgKTtcbiAgfWVsc2UgaWYoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApe1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9ZWxzZXtcbiAgICByb290LmluZmxlY3Rpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0oIHRoaXMsIGZ1bmN0aW9uICgpe1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhpcyBpcyBhIGxpc3Qgb2Ygbm91bnMgdGhhdCB1c2UgdGhlIHNhbWUgZm9ybSBmb3IgYm90aCBzaW5ndWxhciBhbmQgcGx1cmFsLlxuICAgKiAgICAgICAgICAgICAgVGhpcyBsaXN0IHNob3VsZCByZW1haW4gZW50aXJlbHkgaW4gbG93ZXIgY2FzZSB0byBjb3JyZWN0bHkgbWF0Y2ggU3RyaW5ncy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciB1bmNvdW50YWJsZV93b3JkcyA9IFtcbiAgICAvLyAnYWNjZXNzJyxcbiAgICAnYWNjb21tb2RhdGlvbicsXG4gICAgJ2FkdWx0aG9vZCcsXG4gICAgJ2FkdmVydGlzaW5nJyxcbiAgICAnYWR2aWNlJyxcbiAgICAnYWdncmVzc2lvbicsXG4gICAgJ2FpZCcsXG4gICAgJ2FpcicsXG4gICAgJ2FpcmNyYWZ0JyxcbiAgICAnYWxjb2hvbCcsXG4gICAgJ2FuZ2VyJyxcbiAgICAnYXBwbGF1c2UnLFxuICAgICdhcml0aG1ldGljJyxcbiAgICAvLyAnYXJ0JyxcbiAgICAnYXNzaXN0YW5jZScsXG4gICAgJ2F0aGxldGljcycsXG4gICAgLy8gJ2F0dGVudGlvbicsXG5cbiAgICAnYmFjb24nLFxuICAgICdiYWdnYWdlJyxcbiAgICAvLyAnYmFsbGV0JyxcbiAgICAvLyAnYmVhdXR5JyxcbiAgICAnYmVlZicsXG4gICAgLy8gJ2JlZXInLFxuICAgIC8vICdiZWhhdmlvcicsXG4gICAgJ2Jpb2xvZ3knLFxuICAgIC8vICdiaWxsaWFyZHMnLFxuICAgICdibG9vZCcsXG4gICAgJ2JvdGFueScsXG4gICAgLy8gJ2Jvd2VscycsXG4gICAgJ2JyZWFkJyxcbiAgICAvLyAnYnVzaW5lc3MnLFxuICAgICdidXR0ZXInLFxuXG4gICAgJ2NhcmJvbicsXG4gICAgJ2NhcmRib2FyZCcsXG4gICAgJ2Nhc2gnLFxuICAgICdjaGFsaycsXG4gICAgJ2NoYW9zJyxcbiAgICAnY2hlc3MnLFxuICAgICdjcm9zc3JvYWRzJyxcbiAgICAnY291bnRyeXNpZGUnLFxuXG4gICAgLy8gJ2RhbWFnZScsXG4gICAgJ2RhbmNpbmcnLFxuICAgIC8vICdkYW5nZXInLFxuICAgICdkZWVyJyxcbiAgICAvLyAnZGVsaWdodCcsXG4gICAgLy8gJ2Rlc3NlcnQnLFxuICAgICdkaWduaXR5JyxcbiAgICAnZGlydCcsXG4gICAgLy8gJ2Rpc3RyaWJ1dGlvbicsXG4gICAgJ2R1c3QnLFxuXG4gICAgJ2Vjb25vbWljcycsXG4gICAgJ2VkdWNhdGlvbicsXG4gICAgJ2VsZWN0cmljaXR5JyxcbiAgICAvLyAnZW1wbG95bWVudCcsXG4gICAgLy8gJ2VuZXJneScsXG4gICAgJ2VuZ2luZWVyaW5nJyxcbiAgICAnZW5qb3ltZW50JyxcbiAgICAvLyAnZW50ZXJ0YWlubWVudCcsXG4gICAgJ2VudnknLFxuICAgICdlcXVpcG1lbnQnLFxuICAgICdldGhpY3MnLFxuICAgICdldmlkZW5jZScsXG4gICAgJ2V2b2x1dGlvbicsXG5cbiAgICAvLyAnZmFpbHVyZScsXG4gICAgLy8gJ2ZhaXRoJyxcbiAgICAnZmFtZScsXG4gICAgJ2ZpY3Rpb24nLFxuICAgIC8vICdmaXNoJyxcbiAgICAnZmxvdXInLFxuICAgICdmbHUnLFxuICAgICdmb29kJyxcbiAgICAvLyAnZnJlZWRvbScsXG4gICAgLy8gJ2ZydWl0JyxcbiAgICAnZnVlbCcsXG4gICAgJ2Z1bicsXG4gICAgLy8gJ2Z1bmVyYWwnLFxuICAgICdmdXJuaXR1cmUnLFxuXG4gICAgJ2dhbGxvd3MnLFxuICAgICdnYXJiYWdlJyxcbiAgICAnZ2FybGljJyxcbiAgICAvLyAnZ2FzJyxcbiAgICAnZ2VuZXRpY3MnLFxuICAgIC8vICdnbGFzcycsXG4gICAgJ2dvbGQnLFxuICAgICdnb2xmJyxcbiAgICAnZ29zc2lwJyxcbiAgICAnZ3JhbW1hcicsXG4gICAgLy8gJ2dyYXNzJyxcbiAgICAnZ3JhdGl0dWRlJyxcbiAgICAnZ3JpZWYnLFxuICAgIC8vICdncm91bmQnLFxuICAgICdndWlsdCcsXG4gICAgJ2d5bW5hc3RpY3MnLFxuXG4gICAgLy8gJ2hhaXInLFxuICAgICdoYXBwaW5lc3MnLFxuICAgICdoYXJkd2FyZScsXG4gICAgJ2hhcm0nLFxuICAgICdoYXRlJyxcbiAgICAnaGF0cmVkJyxcbiAgICAnaGVhbHRoJyxcbiAgICAnaGVhdCcsXG4gICAgLy8gJ2hlaWdodCcsXG4gICAgJ2hlbHAnLFxuICAgICdob21ld29yaycsXG4gICAgJ2hvbmVzdHknLFxuICAgICdob25leScsXG4gICAgJ2hvc3BpdGFsaXR5JyxcbiAgICAnaG91c2V3b3JrJyxcbiAgICAnaHVtb3VyJyxcbiAgICAnaHVuZ2VyJyxcbiAgICAnaHlkcm9nZW4nLFxuXG4gICAgJ2ljZScsXG4gICAgJ2ltcG9ydGFuY2UnLFxuICAgICdpbmZsYXRpb24nLFxuICAgICdpbmZvcm1hdGlvbicsXG4gICAgLy8gJ2luanVzdGljZScsXG4gICAgJ2lubm9jZW5jZScsXG4gICAgLy8gJ2ludGVsbGlnZW5jZScsXG4gICAgJ2lyb24nLFxuICAgICdpcm9ueScsXG5cbiAgICAnamFtJyxcbiAgICAvLyAnamVhbG91c3knLFxuICAgIC8vICdqZWxseScsXG4gICAgJ2pld2VscnknLFxuICAgIC8vICdqb3knLFxuICAgICdqdWRvJyxcbiAgICAvLyAnanVpY2UnLFxuICAgIC8vICdqdXN0aWNlJyxcblxuICAgICdrYXJhdGUnLFxuICAgIC8vICdraW5kbmVzcycsXG4gICAgJ2tub3dsZWRnZScsXG5cbiAgICAvLyAnbGFib3VyJyxcbiAgICAnbGFjaycsXG4gICAgLy8gJ2xhbmQnLFxuICAgICdsYXVnaHRlcicsXG4gICAgJ2xhdmEnLFxuICAgICdsZWF0aGVyJyxcbiAgICAnbGVpc3VyZScsXG4gICAgJ2xpZ2h0bmluZycsXG4gICAgJ2xpbmd1aW5lJyxcbiAgICAnbGluZ3VpbmknLFxuICAgICdsaW5ndWlzdGljcycsXG4gICAgJ2xpdGVyYXR1cmUnLFxuICAgICdsaXR0ZXInLFxuICAgICdsaXZlc3RvY2snLFxuICAgICdsb2dpYycsXG4gICAgJ2xvbmVsaW5lc3MnLFxuICAgIC8vICdsb3ZlJyxcbiAgICAnbHVjaycsXG4gICAgJ2x1Z2dhZ2UnLFxuXG4gICAgJ21hY2Fyb25pJyxcbiAgICAnbWFjaGluZXJ5JyxcbiAgICAnbWFnaWMnLFxuICAgIC8vICdtYWlsJyxcbiAgICAnbWFuYWdlbWVudCcsXG4gICAgJ21hbmtpbmQnLFxuICAgICdtYXJibGUnLFxuICAgICdtYXRoZW1hdGljcycsXG4gICAgJ21heW9ubmFpc2UnLFxuICAgICdtZWFzbGVzJyxcbiAgICAvLyAnbWVhdCcsXG4gICAgLy8gJ21ldGFsJyxcbiAgICAnbWV0aGFuZScsXG4gICAgJ21pbGsnLFxuICAgICdtaW51cycsXG4gICAgJ21vbmV5JyxcbiAgICAvLyAnbW9vc2UnLFxuICAgICdtdWQnLFxuICAgICdtdXNpYycsXG4gICAgJ211bXBzJyxcblxuICAgICduYXR1cmUnLFxuICAgICduZXdzJyxcbiAgICAnbml0cm9nZW4nLFxuICAgICdub25zZW5zZScsXG4gICAgJ251cnR1cmUnLFxuICAgICdudXRyaXRpb24nLFxuXG4gICAgJ29iZWRpZW5jZScsXG4gICAgJ29iZXNpdHknLFxuICAgIC8vICdvaWwnLFxuICAgICdveHlnZW4nLFxuXG4gICAgLy8gJ3BhcGVyJyxcbiAgICAvLyAncGFzc2lvbicsXG4gICAgJ3Bhc3RhJyxcbiAgICAncGF0aWVuY2UnLFxuICAgIC8vICdwZXJtaXNzaW9uJyxcbiAgICAncGh5c2ljcycsXG4gICAgJ3BvZXRyeScsXG4gICAgJ3BvbGx1dGlvbicsXG4gICAgJ3BvdmVydHknLFxuICAgIC8vICdwb3dlcicsXG4gICAgJ3ByaWRlJyxcbiAgICAvLyAncHJvZHVjdGlvbicsXG4gICAgLy8gJ3Byb2dyZXNzJyxcbiAgICAvLyAncHJvbnVuY2lhdGlvbicsXG4gICAgJ3BzeWNob2xvZ3knLFxuICAgICdwdWJsaWNpdHknLFxuICAgICdwdW5jdHVhdGlvbicsXG5cbiAgICAvLyAncXVhbGl0eScsXG4gICAgLy8gJ3F1YW50aXR5JyxcbiAgICAncXVhcnR6JyxcblxuICAgICdyYWNpc20nLFxuICAgIC8vICdyYWluJyxcbiAgICAvLyAncmVjcmVhdGlvbicsXG4gICAgJ3JlbGF4YXRpb24nLFxuICAgICdyZWxpYWJpbGl0eScsXG4gICAgJ3Jlc2VhcmNoJyxcbiAgICAncmVzcGVjdCcsXG4gICAgJ3JldmVuZ2UnLFxuICAgICdyaWNlJyxcbiAgICAncnViYmlzaCcsXG4gICAgJ3J1bScsXG5cbiAgICAnc2FmZXR5JyxcbiAgICAvLyAnc2FsYWQnLFxuICAgIC8vICdzYWx0JyxcbiAgICAvLyAnc2FuZCcsXG4gICAgLy8gJ3NhdGlyZScsXG4gICAgJ3NjZW5lcnknLFxuICAgICdzZWFmb29kJyxcbiAgICAnc2Vhc2lkZScsXG4gICAgJ3NlcmllcycsXG4gICAgJ3NoYW1lJyxcbiAgICAnc2hlZXAnLFxuICAgICdzaG9wcGluZycsXG4gICAgLy8gJ3NpbGVuY2UnLFxuICAgICdzbGVlcCcsXG4gICAgLy8gJ3NsYW5nJ1xuICAgICdzbW9rZScsXG4gICAgJ3Ntb2tpbmcnLFxuICAgICdzbm93JyxcbiAgICAnc29hcCcsXG4gICAgJ3NvZnR3YXJlJyxcbiAgICAnc29pbCcsXG4gICAgLy8gJ3NvcnJvdycsXG4gICAgLy8gJ3NvdXAnLFxuICAgICdzcGFnaGV0dGknLFxuICAgIC8vICdzcGVlZCcsXG4gICAgJ3NwZWNpZXMnLFxuICAgIC8vICdzcGVsbGluZycsXG4gICAgLy8gJ3Nwb3J0JyxcbiAgICAnc3RlYW0nLFxuICAgIC8vICdzdHJlbmd0aCcsXG4gICAgJ3N0dWZmJyxcbiAgICAnc3R1cGlkaXR5JyxcbiAgICAvLyAnc3VjY2VzcycsXG4gICAgLy8gJ3N1Z2FyJyxcbiAgICAnc3Vuc2hpbmUnLFxuICAgICdzeW1tZXRyeScsXG5cbiAgICAvLyAndGVhJyxcbiAgICAndGVubmlzJyxcbiAgICAndGhpcnN0JyxcbiAgICAndGh1bmRlcicsXG4gICAgJ3RpbWJlcicsXG4gICAgLy8gJ3RpbWUnLFxuICAgIC8vICd0b2FzdCcsXG4gICAgLy8gJ3RvbGVyYW5jZScsXG4gICAgLy8gJ3RyYWRlJyxcbiAgICAndHJhZmZpYycsXG4gICAgJ3RyYW5zcG9ydGF0aW9uJyxcbiAgICAvLyAndHJhdmVsJyxcbiAgICAndHJ1c3QnLFxuXG4gICAgLy8gJ3VuZGVyc3RhbmRpbmcnLFxuICAgICd1bmRlcndlYXInLFxuICAgICd1bmVtcGxveW1lbnQnLFxuICAgICd1bml0eScsXG4gICAgLy8gJ3VzYWdlJyxcblxuICAgICd2YWxpZGl0eScsXG4gICAgJ3ZlYWwnLFxuICAgICd2ZWdldGF0aW9uJyxcbiAgICAndmVnZXRhcmlhbmlzbScsXG4gICAgJ3ZlbmdlYW5jZScsXG4gICAgJ3Zpb2xlbmNlJyxcbiAgICAvLyAndmlzaW9uJyxcbiAgICAndml0YWxpdHknLFxuXG4gICAgJ3dhcm10aCcsXG4gICAgLy8gJ3dhdGVyJyxcbiAgICAnd2VhbHRoJyxcbiAgICAnd2VhdGhlcicsXG4gICAgLy8gJ3dlaWdodCcsXG4gICAgJ3dlbGZhcmUnLFxuICAgICd3aGVhdCcsXG4gICAgLy8gJ3doaXNrZXknLFxuICAgIC8vICd3aWR0aCcsXG4gICAgJ3dpbGRsaWZlJyxcbiAgICAvLyAnd2luZScsXG4gICAgJ3dpc2RvbScsXG4gICAgLy8gJ3dvb2QnLFxuICAgIC8vICd3b29sJyxcbiAgICAvLyAnd29yaycsXG5cbiAgICAvLyAneWVhc3QnLFxuICAgICd5b2dhJyxcblxuICAgICd6aW5jJyxcbiAgICAnem9vbG9neSdcbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoZXNlIHJ1bGVzIHRyYW5zbGF0ZSBmcm9tIHRoZSBzaW5ndWxhciBmb3JtIG9mIGEgbm91biB0byBpdHMgcGx1cmFsIGZvcm0uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIHZhciByZWdleCA9IHtcbiAgICBwbHVyYWwgOiB7XG4gICAgICBtZW4gICAgICAgOiBuZXcgUmVnRXhwKCAnXihtfHdvbSllbiQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHBlb3BsZSAgICA6IG5ldyBSZWdFeHAoICcocGUpb3BsZSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY2hpbGRyZW4gIDogbmV3IFJlZ0V4cCggJyhjaGlsZClyZW4kJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB0aWEgICAgICAgOiBuZXcgUmVnRXhwKCAnKFt0aV0pYSQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFuYWx5c2VzICA6IG5ldyBSZWdFeHAoICcoKGEpbmFseXwoYilhfChkKWlhZ25vfChwKWFyZW50aGV8KHApcm9nbm98KHMpeW5vcHwodCloZSlzZXMkJywnZ2knICksXG4gICAgICBoaXZlcyAgICAgOiBuZXcgUmVnRXhwKCAnKGhpfHRpKXZlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGN1cnZlcyAgICA6IG5ldyBSZWdFeHAoICcoY3VydmUpcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbHJ2ZXMgICAgIDogbmV3IFJlZ0V4cCggJyhbbHJdKXZlcyQnICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhdmVzICAgICAgOiBuZXcgUmVnRXhwKCAnKFthXSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZvdmVzICAgICA6IG5ldyBSZWdFeHAoICcoW15mb10pdmVzJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbW92aWVzICAgIDogbmV3IFJlZ0V4cCggJyhtKW92aWVzJCcgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhZWlvdXlpZXMgOiBuZXcgUmVnRXhwKCAnKFteYWVpb3V5XXxxdSlpZXMkJyAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHNlcmllcyAgICA6IG5ldyBSZWdFeHAoICcocyllcmllcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgeGVzICAgICAgIDogbmV3IFJlZ0V4cCggJyh4fGNofHNzfHNoKWVzJCcgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBtaWNlICAgICAgOiBuZXcgUmVnRXhwKCAnKFttfGxdKWljZSQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1c2VzICAgICA6IG5ldyBSZWdFeHAoICcoYnVzKWVzJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2VzICAgICAgIDogbmV3IFJlZ0V4cCggJyhvKWVzJCcgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzaG9lcyAgICAgOiBuZXcgUmVnRXhwKCAnKHNob2UpcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXNlcyAgICA6IG5ldyBSZWdFeHAoICcoY3Jpc3xheHx0ZXN0KWVzJCcgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2N0b3BpICAgIDogbmV3IFJlZ0V4cCggJyhvY3RvcHx2aXIpaSQnICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhbGlhc2VzICAgOiBuZXcgUmVnRXhwKCAnKGFsaWFzfGNhbnZhc3xzdGF0dXN8Y2FtcHVzKWVzJCcsICdnaScgKSxcbiAgICAgIHN1bW1vbnNlcyA6IG5ldyBSZWdFeHAoICdeKHN1bW1vbnMpZXMkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb3hlbiAgICAgIDogbmV3IFJlZ0V4cCggJ14ob3gpZW4nICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBtYXRyaWNlcyAgOiBuZXcgUmVnRXhwKCAnKG1hdHIpaWNlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHZlcnRpY2VzICA6IG5ldyBSZWdFeHAoICcodmVydHxpbmQpaWNlcyQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZmVldCAgICAgIDogbmV3IFJlZ0V4cCggJ15mZWV0JCcgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB0ZWV0aCAgICAgOiBuZXcgUmVnRXhwKCAnXnRlZXRoJCcgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlZXNlICAgICA6IG5ldyBSZWdFeHAoICdeZ2Vlc2UkJyAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcXVpenplcyAgIDogbmV3IFJlZ0V4cCggJyhxdWl6KXplcyQnICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB3aGVyZWFzZXMgOiBuZXcgUmVnRXhwKCAnXih3aGVyZWFzKWVzJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXRlcmlhICA6IG5ldyBSZWdFeHAoICdeKGNyaXRlcmkpYSQnICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ2VuZXJhICAgIDogbmV3IFJlZ0V4cCggJ15nZW5lcmEkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzcyAgICAgICAgOiBuZXcgUmVnRXhwKCAnc3MkJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHMgICAgICAgICA6IG5ldyBSZWdFeHAoICdzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApXG4gICAgfSxcblxuICAgIHNpbmd1bGFyIDoge1xuICAgICAgbWFuICAgICAgIDogbmV3IFJlZ0V4cCggJ14obXx3b20pYW4kJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcGVyc29uICAgIDogbmV3IFJlZ0V4cCggJyhwZSlyc29uJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY2hpbGQgICAgIDogbmV3IFJlZ0V4cCggJyhjaGlsZCkkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb3ggICAgICAgIDogbmV3IFJlZ0V4cCggJ14ob3gpJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYXhpcyAgICAgIDogbmV3IFJlZ0V4cCggJyhheHx0ZXN0KWlzJCcgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2N0b3B1cyAgIDogbmV3IFJlZ0V4cCggJyhvY3RvcHx2aXIpdXMkJyAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWxpYXMgICAgIDogbmV3IFJlZ0V4cCggJyhhbGlhc3xzdGF0dXN8Y2FudmFzfGNhbXB1cykkJywgJ2dpJyApLFxuICAgICAgc3VtbW9ucyAgIDogbmV3IFJlZ0V4cCggJ14oc3VtbW9ucykkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYnVzICAgICAgIDogbmV3IFJlZ0V4cCggJyhidSlzJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYnVmZmFsbyAgIDogbmV3IFJlZ0V4cCggJyhidWZmYWx8dG9tYXR8cG90YXQpbyQnICAgICAgICwgJ2dpJyApLFxuICAgICAgdGl1bSAgICAgIDogbmV3IFJlZ0V4cCggJyhbdGldKXVtJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc2lzICAgICAgIDogbmV3IFJlZ0V4cCggJ3NpcyQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZmZlICAgICAgIDogbmV3IFJlZ0V4cCggJyg/OihbXmZdKWZlfChbbHJdKWYpJCcgICAgICAgICwgJ2dpJyApLFxuICAgICAgaGl2ZSAgICAgIDogbmV3IFJlZ0V4cCggJyhoaXx0aSl2ZSQnICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWVpb3V5eSAgIDogbmV3IFJlZ0V4cCggJyhbXmFlaW91eV18cXUpeSQnICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgeCAgICAgICAgIDogbmV3IFJlZ0V4cCggJyh4fGNofHNzfHNoKSQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWF0cml4ICAgIDogbmV3IFJlZ0V4cCggJyhtYXRyKWl4JCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdmVydGV4ICAgIDogbmV3IFJlZ0V4cCggJyh2ZXJ0fGluZClleCQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbW91c2UgICAgIDogbmV3IFJlZ0V4cCggJyhbbXxsXSlvdXNlJCcgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZm9vdCAgICAgIDogbmV3IFJlZ0V4cCggJ15mb290JCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdG9vdGggICAgIDogbmV3IFJlZ0V4cCggJ150b290aCQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ29vc2UgICAgIDogbmV3IFJlZ0V4cCggJ15nb29zZSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcXVpeiAgICAgIDogbmV3IFJlZ0V4cCggJyhxdWl6KSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgd2hlcmVhcyAgIDogbmV3IFJlZ0V4cCggJ14od2hlcmVhcykkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY3JpdGVyaW9uIDogbmV3IFJlZ0V4cCggJ14oY3JpdGVyaSlvbiQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ2VudXMgICAgIDogbmV3IFJlZ0V4cCggJ15nZW51cyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcyAgICAgICAgIDogbmV3IFJlZ0V4cCggJ3MkJyAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY29tbW9uICAgIDogbmV3IFJlZ0V4cCggJyQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApXG4gICAgfVxuICB9O1xuXG4gIHZhciBwbHVyYWxfcnVsZXMgPSBbXG5cbiAgICAvLyBkbyBub3QgcmVwbGFjZSBpZiBpdHMgYWxyZWFkeSBhIHBsdXJhbCB3b3JkXG4gICAgWyByZWdleC5wbHVyYWwubWVuICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwucGVvcGxlICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY2hpbGRyZW4gIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGlhICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYW5hbHlzZXMgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuaGl2ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3VydmVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubHJ2ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZm92ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWVpb3V5aWVzIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc2VyaWVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubW92aWVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwueGVzICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWljZSAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYnVzZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2VzICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc2hvZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3Jpc2VzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2N0b3BpICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWxpYXNlcyAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc3VtbW9uc2VzIF0sXG4gICAgWyByZWdleC5wbHVyYWwub3hlbiAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWF0cmljZXMgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZmVldCAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGVldGggICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2Vlc2UgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwucXVpenplcyAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwud2hlcmVhc2VzIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3JpdGVyaWEgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2VuZXJhICAgIF0sXG5cbiAgICAvLyBvcmlnaW5hbCBydWxlXG4gICAgWyByZWdleC5zaW5ndWxhci5tYW4gICAgICAsICckMWVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucGVyc29uICAgLCAnJDFvcGxlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY2hpbGQgICAgLCAnJDFyZW4nIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5veCAgICAgICAsICckMWVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYXhpcyAgICAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm9jdG9wdXMgICwgJyQxaScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmFsaWFzICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zdW1tb25zICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVzICAgICAgLCAnJDFzZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idWZmYWxvICAsICckMW9lcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnRpdW0gICAgICwgJyQxYScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnNpcyAgICAgICwgJ3NlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmZmZSAgICAgICwgJyQxJDJ2ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5oaXZlICAgICAsICckMXZlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmFlaW91eXkgICwgJyQxaWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWF0cml4ICAgLCAnJDFpY2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudmVydGV4ICAgLCAnJDFpY2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIueCAgICAgICAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm1vdXNlICAgICwgJyQxaWNlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZm9vdCAgICAgLCAnZmVldCcgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnRvb3RoICAgICwgJ3RlZXRoJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ29vc2UgICAgLCAnZ2Vlc2UnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5xdWl6ICAgICAsICckMXplcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLndoZXJlYXMgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jcml0ZXJpb24sICckMWEnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nZW51cyAgICAsICdnZW5lcmEnIF0sXG5cbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnMgICAgICwgJ3MnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jb21tb24sICdzJyBdXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBydWxlcyB0cmFuc2xhdGUgZnJvbSB0aGUgcGx1cmFsIGZvcm0gb2YgYSBub3VuIHRvIGl0cyBzaW5ndWxhciBmb3JtLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdmFyIHNpbmd1bGFyX3J1bGVzID0gW1xuXG4gICAgLy8gZG8gbm90IHJlcGxhY2UgaWYgaXRzIGFscmVhZHkgYSBzaW5ndWxhciB3b3JkXG4gICAgWyByZWdleC5zaW5ndWxhci5tYW4gICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5wZXJzb24gIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jaGlsZCAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5veCAgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5heGlzICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5vY3RvcHVzIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hbGlhcyAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zdW1tb25zIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idXMgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idWZmYWxvIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50aXVtICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zaXMgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mZmUgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5oaXZlICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hZWlvdXl5IF0sXG4gICAgWyByZWdleC5zaW5ndWxhci54ICAgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tYXRyaXggIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tb3VzZSAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mb290ICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50b290aCAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nb29zZSAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5xdWl6ICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci53aGVyZWFzIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jcml0ZXJpb24gXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmdlbnVzIF0sXG5cbiAgICAvLyBvcmlnaW5hbCBydWxlXG4gICAgWyByZWdleC5wbHVyYWwubWVuICAgICAgLCAnJDFhbicgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5wZW9wbGUgICAsICckMXJzb24nIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY2hpbGRyZW4gLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2VuZXJhICAgLCAnZ2VudXMnXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5jcml0ZXJpYSAsICckMW9uJ10sXG4gICAgWyByZWdleC5wbHVyYWwudGlhICAgICAgLCAnJDF1bScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hbmFseXNlcyAsICckMSQyc2lzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmhpdmVzICAgICwgJyQxdmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3VydmVzICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubHJ2ZXMgICAgLCAnJDFmJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmF2ZXMgICAgICwgJyQxdmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZm92ZXMgICAgLCAnJDFmZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5tb3ZpZXMgICAsICckMW92aWUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWVpb3V5aWVzLCAnJDF5JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNlcmllcyAgICwgJyQxZXJpZXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwueGVzICAgICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWljZSAgICAgLCAnJDFvdXNlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmJ1c2VzICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9lcyAgICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNob2VzICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXNlcyAgICwgJyQxaXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2N0b3BpICAgLCAnJDF1cycgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hbGlhc2VzICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zdW1tb25zZXMsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5veGVuICAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5tYXRyaWNlcyAsICckMWl4JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnZlcnRpY2VzICwgJyQxZXgnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZmVldCAgICAgLCAnZm9vdCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC50ZWV0aCAgICAsICd0b290aCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5nZWVzZSAgICAsICdnb29zZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5xdWl6emVzICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC53aGVyZWFzZXMsICckMScgXSxcblxuICAgIFsgcmVnZXgucGx1cmFsLnNzLCAnc3MnIF0sXG4gICAgWyByZWdleC5wbHVyYWwucyAsICcnIF1cbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoaXMgaXMgYSBsaXN0IG9mIHdvcmRzIHRoYXQgc2hvdWxkIG5vdCBiZSBjYXBpdGFsaXplZCBmb3IgdGl0bGUgY2FzZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBub25fdGl0bGVjYXNlZF93b3JkcyA9IFtcbiAgICAnYW5kJywgJ29yJywgJ25vcicsICdhJywgJ2FuJywgJ3RoZScsICdzbycsICdidXQnLCAndG8nLCAnb2YnLCAnYXQnLCdieScsXG4gICAgJ2Zyb20nLCAnaW50bycsICdvbicsICdvbnRvJywgJ29mZicsICdvdXQnLCAnaW4nLCAnb3ZlcicsICd3aXRoJywgJ2ZvcidcbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoZXNlIGFyZSByZWd1bGFyIGV4cHJlc3Npb25zIHVzZWQgZm9yIGNvbnZlcnRpbmcgYmV0d2VlbiBTdHJpbmcgZm9ybWF0cy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBpZF9zdWZmaXggICAgICAgICA9IG5ldyBSZWdFeHAoICcoX2lkc3xfaWQpJCcsICdnJyApO1xuICB2YXIgdW5kZXJiYXIgICAgICAgICAgPSBuZXcgUmVnRXhwKCAnXycsICdnJyApO1xuICB2YXIgc3BhY2Vfb3JfdW5kZXJiYXIgPSBuZXcgUmVnRXhwKCAnW1xcIF9dJywgJ2cnICk7XG4gIHZhciB1cHBlcmNhc2UgICAgICAgICA9IG5ldyBSZWdFeHAoICcoW0EtWl0pJywgJ2cnICk7XG4gIHZhciB1bmRlcmJhcl9wcmVmaXggICA9IG5ldyBSZWdFeHAoICdeXycgKTtcblxuICB2YXIgaW5mbGVjdG9yID0ge1xuXG4gIC8qKlxuICAgKiBBIGhlbHBlciBtZXRob2QgdGhhdCBhcHBsaWVzIHJ1bGVzIGJhc2VkIHJlcGxhY2VtZW50IHRvIGEgU3RyaW5nLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBTdHJpbmcgdG8gbW9kaWZ5IGFuZCByZXR1cm4gYmFzZWQgb24gdGhlIHBhc3NlZCBydWxlcy5cbiAgICogQHBhcmFtIHtBcnJheTogW1JlZ0V4cCwgU3RyaW5nXX0gcnVsZXMgUmVnZXhwIHRvIG1hdGNoIHBhaXJlZCB3aXRoIFN0cmluZyB0byB1c2UgZm9yIHJlcGxhY2VtZW50XG4gICAqIEBwYXJhbSB7QXJyYXk6IFtTdHJpbmddfSBza2lwIFN0cmluZ3MgdG8gc2tpcCBpZiB0aGV5IG1hdGNoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvdmVycmlkZSBTdHJpbmcgdG8gcmV0dXJuIGFzIHRob3VnaCB0aGlzIG1ldGhvZCBzdWNjZWVkZWQgKHVzZWQgdG8gY29uZm9ybSB0byBBUElzKVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gcGFzc2VkIFN0cmluZyBtb2RpZmllZCBieSBwYXNzZWQgcnVsZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB0aGlzLl9hcHBseV9ydWxlcyggJ2Nvd3MnLCBzaW5ndWxhcl9ydWxlcyApOyAvLyA9PT0gJ2NvdydcbiAgICovXG4gICAgX2FwcGx5X3J1bGVzIDogZnVuY3Rpb24gKCBzdHIsIHJ1bGVzLCBza2lwLCBvdmVycmlkZSApe1xuICAgICAgaWYoIG92ZXJyaWRlICl7XG4gICAgICAgIHN0ciA9IG92ZXJyaWRlO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHZhciBpZ25vcmUgPSAoIGluZmxlY3Rvci5pbmRleE9mKCBza2lwLCBzdHIudG9Mb3dlckNhc2UoKSkgPiAtMSApO1xuXG4gICAgICAgIGlmKCAhaWdub3JlICl7XG4gICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgIHZhciBqID0gcnVsZXMubGVuZ3RoO1xuXG4gICAgICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgICAgIGlmKCBzdHIubWF0Y2goIHJ1bGVzWyBpIF1bIDAgXSkpe1xuICAgICAgICAgICAgICBpZiggcnVsZXNbIGkgXVsgMSBdICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSggcnVsZXNbIGkgXVsgMCBdLCBydWxlc1sgaSBdWyAxIF0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGxldHMgdXMgZGV0ZWN0IGlmIGFuIEFycmF5IGNvbnRhaW5zIGEgZ2l2ZW4gZWxlbWVudC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtBcnJheX0gYXJyIFRoZSBzdWJqZWN0IGFycmF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gaXRlbSBPYmplY3QgdG8gbG9jYXRlIGluIHRoZSBBcnJheS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZyb21faW5kZXggU3RhcnRzIGNoZWNraW5nIGZyb20gdGhpcyBwb3NpdGlvbiBpbiB0aGUgQXJyYXkuKG9wdGlvbmFsKVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJlX2Z1bmMgRnVuY3Rpb24gdXNlZCB0byBjb21wYXJlIEFycmF5IGl0ZW0gdnMgcGFzc2VkIGl0ZW0uKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm4gaW5kZXggcG9zaXRpb24gaW4gdGhlIEFycmF5IG9mIHRoZSBwYXNzZWQgaXRlbS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmluZGV4T2YoWyAnaGknLCd0aGVyZScgXSwgJ2d1eXMnICk7IC8vID09PSAtMVxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmRleE9mKFsgJ2hpJywndGhlcmUnIF0sICdoaScgKTsgLy8gPT09IDBcbiAgICovXG4gICAgaW5kZXhPZiA6IGZ1bmN0aW9uICggYXJyLCBpdGVtLCBmcm9tX2luZGV4LCBjb21wYXJlX2Z1bmMgKXtcbiAgICAgIGlmKCAhZnJvbV9pbmRleCApe1xuICAgICAgICBmcm9tX2luZGV4ID0gLTE7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgdmFyIGkgICAgID0gZnJvbV9pbmRleDtcbiAgICAgIHZhciBqICAgICA9IGFyci5sZW5ndGg7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIGlmKCBhcnJbIGkgXSAgPT09IGl0ZW0gfHwgY29tcGFyZV9mdW5jICYmIGNvbXBhcmVfZnVuYyggYXJyWyBpIF0sIGl0ZW0gKSl7XG4gICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHBsdXJhbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHBsdXJhbCBPdmVycmlkZXMgbm9ybWFsIG91dHB1dCB3aXRoIHNhaWQgU3RyaW5nLihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gU2luZ3VsYXIgRW5nbGlzaCBsYW5ndWFnZSBub3VucyBhcmUgcmV0dXJuZWQgaW4gcGx1cmFsIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdwZXJzb24nICk7IC8vID09PSAncGVvcGxlJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdvY3RvcHVzJyApOyAvLyA9PT0gJ29jdG9waSdcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAnSGF0JyApOyAvLyA9PT0gJ0hhdHMnXG4gICAqICAgICBpbmZsZWN0aW9uLnBsdXJhbGl6ZSggJ3BlcnNvbicsICdndXlzJyApOyAvLyA9PT0gJ2d1eXMnXG4gICAqL1xuICAgIHBsdXJhbGl6ZSA6IGZ1bmN0aW9uICggc3RyLCBwbHVyYWwgKXtcbiAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHBsdXJhbF9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHBsdXJhbCApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgc2luZ3VsYXJpemF0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzaW5ndWxhciBPdmVycmlkZXMgbm9ybWFsIG91dHB1dCB3aXRoIHNhaWQgU3RyaW5nLihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gUGx1cmFsIEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ3Blb3BsZScgKTsgLy8gPT09ICdwZXJzb24nXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnb2N0b3BpJyApOyAvLyA9PT0gJ29jdG9wdXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnSGF0cycgKTsgLy8gPT09ICdIYXQnXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnZ3V5cycsICdwZXJzb24nICk7IC8vID09PSAncGVyc29uJ1xuICAgKi9cbiAgICBzaW5ndWxhcml6ZSA6IGZ1bmN0aW9uICggc3RyLCBzaW5ndWxhciApe1xuICAgICAgcmV0dXJuIGluZmxlY3Rvci5fYXBwbHlfcnVsZXMoIHN0ciwgc2luZ3VsYXJfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBzaW5ndWxhciApO1xuICAgIH0sXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiB3aWxsIHBsdXJhbGl6ZSBvciBzaW5ndWxhcmxpemUgYSBTdHJpbmcgYXBwcm9wcmlhdGVseSBiYXNlZCBvbiBhbiBpbnRlZ2VyIHZhbHVlXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgVGhlIG51bWJlciB0byBiYXNlIHBsdXJhbGl6YXRpb24gb2ZmIG9mLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2luZ3VsYXIgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwbHVyYWwgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHRoZSBwbHVyYWwgb3Igc2luZ3VsYXIgZm9ybSBiYXNlZCBvbiB0aGUgY291bnQuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVvcGxlJyAxICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnb2N0b3BpJyAxICk7IC8vID09PSAnb2N0b3B1cydcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ0hhdHMnIDEgKTsgLy8gPT09ICdIYXQnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdndXlzJywgMSAsICdwZXJzb24nICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVyc29uJywgMiApOyAvLyA9PT0gJ3Blb3BsZSdcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ29jdG9wdXMnLCAyICk7IC8vID09PSAnb2N0b3BpJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnSGF0JywgMiApOyAvLyA9PT0gJ0hhdHMnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdwZXJzb24nLCAyLCBudWxsLCAnZ3V5cycgKTsgLy8gPT09ICdndXlzJ1xuICAgKi9cbiAgICBpbmZsZWN0IDogZnVuY3Rpb24gKCBzdHIsIGNvdW50LCBzaW5ndWxhciwgcGx1cmFsICl7XG4gICAgICBjb3VudCA9IHBhcnNlSW50KCBjb3VudCwgMTAgKTtcblxuICAgICAgaWYoIGlzTmFOKCBjb3VudCApKSByZXR1cm4gc3RyO1xuXG4gICAgICBpZiggY291bnQgPT09IDAgfHwgY291bnQgPiAxICl7XG4gICAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHBsdXJhbF9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHBsdXJhbCApO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHNpbmd1bGFyX3J1bGVzLCB1bmNvdW50YWJsZV93b3Jkcywgc2luZ3VsYXIgKTtcbiAgICAgIH1cbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNhbWVsaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGxvd19maXJzdF9sZXR0ZXIgRGVmYXVsdCBpcyB0byBjYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHJlc3VsdHMuKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIGxvd2VyY2FzZSBpdC5cbiAgICogQHJldHVybnMge1N0cmluZ30gTG93ZXIgY2FzZSB1bmRlcnNjb3JlZCB3b3JkcyB3aWxsIGJlIHJldHVybmVkIGluIGNhbWVsIGNhc2UuXG4gICAqICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbGx5ICcvJyBpcyB0cmFuc2xhdGVkIHRvICc6OidcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNhbWVsaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2VQcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5jYW1lbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlUHJvcGVydGllcydcbiAgICovXG4gICAgY2FtZWxpemUgOiBmdW5jdGlvbiAoIHN0ciwgbG93X2ZpcnN0X2xldHRlciApe1xuICAgICAgdmFyIHN0cl9wYXRoID0gc3RyLnNwbGl0KCAnLycgKTtcbiAgICAgIHZhciBpICAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICAgPSBzdHJfcGF0aC5sZW5ndGg7XG4gICAgICB2YXIgc3RyX2FyciwgaW5pdF94LCBrLCBsLCBmaXJzdDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgc3RyX2FyciA9IHN0cl9wYXRoWyBpIF0uc3BsaXQoICdfJyApO1xuICAgICAgICBrICAgICAgID0gMDtcbiAgICAgICAgbCAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuXG4gICAgICAgIGZvciggOyBrIDwgbDsgaysrICl7XG4gICAgICAgICAgaWYoIGsgIT09IDAgKXtcbiAgICAgICAgICAgIHN0cl9hcnJbIGsgXSA9IHN0cl9hcnJbIGsgXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZpcnN0ID0gc3RyX2FyclsgayBdLmNoYXJBdCggMCApO1xuICAgICAgICAgIGZpcnN0ID0gbG93X2ZpcnN0X2xldHRlciAmJiBpID09PSAwICYmIGsgPT09IDBcbiAgICAgICAgICAgID8gZmlyc3QudG9Mb3dlckNhc2UoKSA6IGZpcnN0LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgc3RyX2FyclsgayBdID0gZmlyc3QgKyBzdHJfYXJyWyBrIF0uc3Vic3RyaW5nKCAxICk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX2Fyci5qb2luKCAnJyApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyX3BhdGguam9pbiggJzo6JyApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdW5kZXJzY29yZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbF91cHBlcl9jYXNlIERlZmF1bHQgaXMgdG8gbG93ZXJjYXNlIGFuZCBhZGQgdW5kZXJzY29yZSBwcmVmaXguKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIHJldHVybiBhcyBlbnRlcmVkLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBDYW1lbCBjYXNlZCB3b3JkcyBhcmUgcmV0dXJuZWQgYXMgbG93ZXIgY2FzZWQgYW5kIHVuZGVyc2NvcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxseSAnOjonIGlzIHRyYW5zbGF0ZWQgdG8gJy8nLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ01lc3NhZ2VQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2VfcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ21lc3NhZ2VQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2VfcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ01QJywgdHJ1ZSApOyAvLyA9PT0gJ01QJ1xuICAgKi9cbiAgICB1bmRlcnNjb3JlIDogZnVuY3Rpb24gKCBzdHIsIGFsbF91cHBlcl9jYXNlICl7XG4gICAgICBpZiggYWxsX3VwcGVyX2Nhc2UgJiYgc3RyID09PSBzdHIudG9VcHBlckNhc2UoKSkgcmV0dXJuIHN0cjtcblxuICAgICAgdmFyIHN0cl9wYXRoID0gc3RyLnNwbGl0KCAnOjonICk7XG4gICAgICB2YXIgaSAgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgID0gc3RyX3BhdGgubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX3BhdGhbIGkgXS5yZXBsYWNlKCB1cHBlcmNhc2UsICdfJDEnICk7XG4gICAgICAgIHN0cl9wYXRoWyBpIF0gPSBzdHJfcGF0aFsgaSBdLnJlcGxhY2UoIHVuZGVyYmFyX3ByZWZpeCwgJycgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9wYXRoLmpvaW4oICcvJyApLnRvTG93ZXJDYXNlKCk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBodW1hbml6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGxvd19maXJzdF9sZXR0ZXIgRGVmYXVsdCBpcyB0byBjYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHJlc3VsdHMuKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIGxvd2VyY2FzZSBpdC5cbiAgICogQHJldHVybnMge1N0cmluZ30gTG93ZXIgY2FzZSB1bmRlcnNjb3JlZCB3b3JkcyB3aWxsIGJlIHJldHVybmVkIGluIGh1bWFuaXplZCBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uaHVtYW5pemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5odW1hbml6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlIHByb3BlcnRpZXMnXG4gICAqL1xuICAgIGh1bWFuaXplIDogZnVuY3Rpb24gKCBzdHIsIGxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UoIGlkX3N1ZmZpeCwgJycgKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCB1bmRlcmJhciwgJyAnICk7XG5cbiAgICAgIGlmKCAhbG93X2ZpcnN0X2xldHRlciApe1xuICAgICAgICBzdHIgPSBpbmZsZWN0b3IuY2FwaXRhbGl6ZSggc3RyICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBjYXBpdGFsaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBBbGwgY2hhcmFjdGVycyB3aWxsIGJlIGxvd2VyIGNhc2UgYW5kIHRoZSBmaXJzdCB3aWxsIGJlIHVwcGVyLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uY2FwaXRhbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLmNhcGl0YWxpemUoICdtZXNzYWdlIHByb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnTWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBjYXBpdGFsaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICByZXR1cm4gc3RyLnN1YnN0cmluZyggMCwgMSApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyaW5nKCAxICk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMgaW4gdGhlIHN0cmluZy5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFJlcGxhY2VzIGFsbCBzcGFjZXMgb3IgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5kYXNoZXJpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnbWVzc2FnZS1wcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5kYXNoZXJpemUoICdNZXNzYWdlIFByb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZS1Qcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBkYXNoZXJpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKCBzcGFjZV9vcl91bmRlcmJhciwgJy0nICk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0aXRsZWl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBDYXBpdGFsaXplcyB3b3JkcyBhcyB5b3Ugd291bGQgZm9yIGEgYm9vayB0aXRsZS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnRpdGxlaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UgUHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udGl0bGVpemUoICdtZXNzYWdlIHByb3BlcnRpZXMgdG8ga2VlcCcgKTsgLy8gPT09ICdNZXNzYWdlIFByb3BlcnRpZXMgdG8gS2VlcCdcbiAgICovXG4gICAgdGl0bGVpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgc3RyICAgICAgICAgPSBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCB1bmRlcmJhciwgJyAnICk7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJyAnICk7XG4gICAgICB2YXIgaSAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuICAgICAgdmFyIGQsIGssIGw7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIGQgPSBzdHJfYXJyWyBpIF0uc3BsaXQoICctJyApO1xuICAgICAgICBrID0gMDtcbiAgICAgICAgbCA9IGQubGVuZ3RoO1xuXG4gICAgICAgIGZvciggOyBrIDwgbDsgaysrKXtcbiAgICAgICAgICBpZiggaW5mbGVjdG9yLmluZGV4T2YoIG5vbl90aXRsZWNhc2VkX3dvcmRzLCBkWyBrIF0udG9Mb3dlckNhc2UoKSkgPCAwICl7XG4gICAgICAgICAgICBkWyBrIF0gPSBpbmZsZWN0b3IuY2FwaXRhbGl6ZSggZFsgayBdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdHJfYXJyWyBpIF0gPSBkLmpvaW4oICctJyApO1xuICAgICAgfVxuXG4gICAgICBzdHIgPSBzdHJfYXJyLmpvaW4oICcgJyApO1xuICAgICAgc3RyID0gc3RyLnN1YnN0cmluZyggMCwgMSApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyaW5nKCAxICk7XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBkZW1vZHVsaXplIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFJlbW92ZXMgbW9kdWxlIG5hbWVzIGxlYXZpbmcgb25seSBjbGFzcyBuYW1lcy4oUnVieSBzdHlsZSlcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmRlbW9kdWxpemUoICdNZXNzYWdlOjpCdXM6OlByb3BlcnRpZXMnICk7IC8vID09PSAnUHJvcGVydGllcydcbiAgICovXG4gICAgZGVtb2R1bGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJzo6JyApO1xuXG4gICAgICByZXR1cm4gc3RyX2Fyclsgc3RyX2Fyci5sZW5ndGggLSAxIF07XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0YWJsZWl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gY2FtZWwgY2FzZWQgd29yZHMgaW50byB0aGVpciB1bmRlcnNjb3JlZCBwbHVyYWwgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnRhYmxlaXplKCAnTWVzc2FnZUJ1c1Byb3BlcnR5JyApOyAvLyA9PT0gJ21lc3NhZ2VfYnVzX3Byb3BlcnRpZXMnXG4gICAqL1xuICAgIHRhYmxlaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci51bmRlcnNjb3JlKCBzdHIgKTtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5wbHVyYWxpemUoIHN0ciApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgY2xhc3NpZmljYXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gVW5kZXJzY29yZWQgcGx1cmFsIG5vdW5zIGJlY29tZSB0aGUgY2FtZWwgY2FzZWQgc2luZ3VsYXIgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNsYXNzaWZ5KCAnbWVzc2FnZV9idXNfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlQnVzUHJvcGVydHknXG4gICAqL1xuICAgIGNsYXNzaWZ5IDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5jYW1lbGl6ZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3Iuc2luZ3VsYXJpemUoIHN0ciApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgZm9yZWlnbiBrZXkgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBkcm9wX2lkX3ViYXIgRGVmYXVsdCBpcyB0byBzZXBlcmF0ZSBpZCB3aXRoIGFuIHVuZGVyYmFyIGF0IHRoZSBlbmQgb2YgdGhlIGNsYXNzIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5b3UgY2FuIHBhc3MgdHJ1ZSB0byBza2lwIGl0LihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gVW5kZXJzY29yZWQgcGx1cmFsIG5vdW5zIGJlY29tZSB0aGUgY2FtZWwgY2FzZWQgc2luZ3VsYXIgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmZvcmVpZ25fa2V5KCAnTWVzc2FnZUJ1c1Byb3BlcnR5JyApOyAvLyA9PT0gJ21lc3NhZ2VfYnVzX3Byb3BlcnR5X2lkJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5mb3JlaWduX2tleSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0eWlkJ1xuICAgKi9cbiAgICBmb3JlaWduX2tleSA6IGZ1bmN0aW9uICggc3RyLCBkcm9wX2lkX3ViYXIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5kZW1vZHVsaXplKCBzdHIgKTtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci51bmRlcnNjb3JlKCBzdHIgKSArICgoIGRyb3BfaWRfdWJhciApID8gKCAnJyApIDogKCAnXycgKSkgKyAnaWQnO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgb3JkaW5hbGl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gYWxsIGZvdW5kIG51bWJlcnMgdGhlaXIgc2VxdWVuY2UgbGlrZSAnMjJuZCcuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5vcmRpbmFsaXplKCAndGhlIDEgcGl0Y2gnICk7IC8vID09PSAndGhlIDFzdCBwaXRjaCdcbiAgICovXG4gICAgb3JkaW5hbGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJyAnICk7XG4gICAgICB2YXIgaSAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICB2YXIgayA9IHBhcnNlSW50KCBzdHJfYXJyWyBpIF0sIDEwICk7XG5cbiAgICAgICAgaWYoICFpc05hTiggayApKXtcbiAgICAgICAgICB2YXIgbHRkID0gc3RyX2FyclsgaSBdLnN1YnN0cmluZyggc3RyX2FyclsgaSBdLmxlbmd0aCAtIDIgKTtcbiAgICAgICAgICB2YXIgbGQgID0gc3RyX2FyclsgaSBdLnN1YnN0cmluZyggc3RyX2FyclsgaSBdLmxlbmd0aCAtIDEgKTtcbiAgICAgICAgICB2YXIgc3VmID0gJ3RoJztcblxuICAgICAgICAgIGlmKCBsdGQgIT0gJzExJyAmJiBsdGQgIT0gJzEyJyAmJiBsdGQgIT0gJzEzJyApe1xuICAgICAgICAgICAgaWYoIGxkID09PSAnMScgKXtcbiAgICAgICAgICAgICAgc3VmID0gJ3N0JztcbiAgICAgICAgICAgIH1lbHNlIGlmKCBsZCA9PT0gJzInICl7XG4gICAgICAgICAgICAgIHN1ZiA9ICduZCc7XG4gICAgICAgICAgICB9ZWxzZSBpZiggbGQgPT09ICczJyApe1xuICAgICAgICAgICAgICBzdWYgPSAncmQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHN0cl9hcnJbIGkgXSArPSBzdWY7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9hcnIuam9pbiggJyAnICk7XG4gICAgfSxcblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBwZXJmb3JtcyBtdWx0aXBsZSBpbmZsZWN0aW9uIG1ldGhvZHMgb24gYSBzdHJpbmdcbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyciBBbiBhcnJheSBvZiBpbmZsZWN0aW9uIG1ldGhvZHMuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50cmFuc2Zvcm0oICdhbGwgam9iJywgWyAncGx1cmFsaXplJywgJ2NhcGl0YWxpemUnLCAnZGFzaGVyaXplJyBdKTsgLy8gPT09ICdBbGwtam9icydcbiAgICovXG4gICAgdHJhbnNmb3JtIDogZnVuY3Rpb24gKCBzdHIsIGFyciApe1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgdmFyIGogPSBhcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDtpIDwgajsgaSsrICl7XG4gICAgICAgIHZhciBtZXRob2QgPSBhcnJbIGkgXTtcblxuICAgICAgICBpZiggaW5mbGVjdG9yLmhhc093blByb3BlcnR5KCBtZXRob2QgKSl7XG4gICAgICAgICAgc3RyID0gaW5mbGVjdG9yWyBtZXRob2QgXSggc3RyICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG4gIGluZmxlY3Rvci52ZXJzaW9uID0gJzEuMTIuMCc7XG5cbiAgcmV0dXJuIGluZmxlY3Rvcjtcbn0pKTtcbiJdfQ==
