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
          val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : null;

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
          val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : null;

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
}.call(null);

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
      return new Context.cmdFinderClass(cmdName, Object.assign({
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
      return new Context.cmdInstanceClass(cmd, this);
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
      return cmds[this.name] = Command.makeVarCmd(this.name);
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
      return cmds[this.name] = Command.makeVarCmd(this.name, {
        preventParseAll: true
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
      return cmds[this.name] = Command.makeBoolVarCmd(this.name);
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
      return cmds[this.name] = Command.makeBoolVarCmd(this.name);
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
}.call(null);

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
        return this[key](val);
      } else {
        return this[key] = val;
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
    storage = Command.storage;
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
    var name;
    name = instance.getParam([0, 'cmd']);

    if (name != null) {
      return Promise.resolve().then(function () {
        var savedCmds, storage;
        storage = Command.storage;
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
    key: "result",
    value: function result() {
      var emmet, ex, res;

      emmet = function () {
        var ref, ref1;

        if ((typeof window !== 'undefined' && window !== null ? window.emmet : null) != null) {
          return window.emmet;
        } else if ((typeof window !== 'undefined' && window !== null ? (ref = window.self) != null ? ref.emmet : null : null) != null) {
          return window.self.emmet;
        } else if ((typeof window !== 'undefined' && window !== null ? (ref1 = window.global) != null ? ref1.emmet : null : null) != null) {
          return window.global.emmet;
        } else if (typeof require !== 'undefined' && require !== null) {
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
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
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
}.call(null);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmpzIiwibGliL0Nsb3NpbmdQcm9tcC5qcyIsImxpYi9DbWRGaW5kZXIuanMiLCJsaWIvQ21kSW5zdGFuY2UuanMiLCJsaWIvQ29kZXdhdmUuanMiLCJsaWIvQ29tbWFuZC5qcyIsImxpYi9Db250ZXh0LmpzIiwibGliL0VkaXRDbWRQcm9wLmpzIiwibGliL0VkaXRvci5qcyIsImxpYi9Mb2dnZXIuanMiLCJsaWIvT3B0aW9uT2JqZWN0LmpzIiwibGliL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsImxpYi9Qcm9jZXNzLmpzIiwibGliL1N0b3JhZ2UuanMiLCJsaWIvVGV4dEFyZWFFZGl0b3IuanMiLCJsaWIvVGV4dFBhcnNlci5qcyIsImxpYi9ib290c3RyYXAuanMiLCJsaWIvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwibGliL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXIuanMiLCJsaWIvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1BocENvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZC5qcyIsImxpYi9kZXRlY3RvcnMvRGV0ZWN0b3IuanMiLCJsaWIvZGV0ZWN0b3JzL0xhbmdEZXRlY3Rvci5qcyIsImxpYi9kZXRlY3RvcnMvUGFpckRldGVjdG9yLmpzIiwibGliL2VudHJ5LmpzIiwibGliL2hlbHBlcnMvQXJyYXlIZWxwZXIuanMiLCJsaWIvaGVscGVycy9Db21tb25IZWxwZXIuanMiLCJsaWIvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCJsaWIvaGVscGVycy9PcHRpb25hbFByb21pc2UuanMiLCJsaWIvaGVscGVycy9QYXRoSGVscGVyLmpzIiwibGliL2hlbHBlcnMvU3RyaW5nSGVscGVyLmpzIiwibGliL3Bvc2l0aW9uaW5nL1BhaXIuanMiLCJsaWIvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwibGliL3Bvc2l0aW9uaW5nL1Bvcy5qcyIsImxpYi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmpzIiwibGliL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwibGliL3Bvc2l0aW9uaW5nL1NpemUuanMiLCJsaWIvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwibGliL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCJsaWIvcG9zaXRpb25pbmcvV3JhcHBpbmcuanMiLCJsaWIvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIiwibGliL3N0cmluZ1BhcnNlcnMvQ29udGV4dC5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL0VzY2FwZUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9OYW1lZENvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlci5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL1N0cmluZ0NvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9WYXJpYWJsZUNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvaW5mbGVjdGlvbi9saWIvaW5mbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQ0EsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUFELENBQVAsQ0FBa0MsWUFBdkQ7O0FBRUEsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQVAsQ0FBaUMsV0FBckQ7O0FBRUEsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQVAsQ0FBOEIsSUFBM0M7O0FBRUEsSUFBSSxTQUFTO0FBQUE7QUFBQTtBQUNYLHFCQUFhLE9BQWIsRUFBb0M7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFB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QUFzQkEsT0FBTyxDQUFDLGVBQVIsR0FBMEIsZUFBMUI7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBBcnJheUhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9BcnJheUhlbHBlcicpLkFycmF5SGVscGVyXG5cbmNvbnN0IFBhaXIgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BhaXInKS5QYWlyXG5cbnZhciBCb3hIZWxwZXIgPSBjbGFzcyBCb3hIZWxwZXIge1xuICBjb25zdHJ1Y3RvciAoY29udGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGtleSwgcmVmLCB2YWxcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIGRlY286IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5kZWNvLFxuICAgICAgcGFkOiAyLFxuICAgICAgd2lkdGg6IDUwLFxuICAgICAgaGVpZ2h0OiAzLFxuICAgICAgb3BlblRleHQ6ICcnLFxuICAgICAgY2xvc2VUZXh0OiAnJyxcbiAgICAgIHByZWZpeDogJycsXG4gICAgICBzdWZmaXg6ICcnLFxuICAgICAgaW5kZW50OiAwXG4gICAgfVxuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHNcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV1cblxuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvbmUgKHRleHQpIHtcbiAgICB2YXIga2V5LCBvcHQsIHJlZiwgdmFsXG4gICAgb3B0ID0ge31cbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzXG5cbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldXG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dCwgb3B0KVxuICB9XG5cbiAgZHJhdyAodGV4dCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0U2VwKCkgKyAnXFxuJyArIHRoaXMubGluZXModGV4dCkgKyAnXFxuJyArIHRoaXMuZW5kU2VwKClcbiAgfVxuXG4gIHdyYXBDb21tZW50IChzdHIpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50KHN0cilcbiAgfVxuXG4gIHNlcGFyYXRvciAoKSB7XG4gICAgdmFyIGxlblxuICAgIGxlbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aFxuICAgIHJldHVybiB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjb0xpbmUobGVuKSlcbiAgfVxuXG4gIHN0YXJ0U2VwICgpIHtcbiAgICB2YXIgbG5cbiAgICBsbiA9IHRoaXMud2lkdGggKyAyICogdGhpcy5wYWQgKyAyICogdGhpcy5kZWNvLmxlbmd0aCAtIHRoaXMub3BlblRleHQubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy53cmFwQ29tbWVudCh0aGlzLm9wZW5UZXh0ICsgdGhpcy5kZWNvTGluZShsbikpXG4gIH1cblxuICBlbmRTZXAgKCkge1xuICAgIHZhciBsblxuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5jbG9zZVRleHQubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMud3JhcENvbW1lbnQodGhpcy5jbG9zZVRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSkgKyB0aGlzLnN1ZmZpeFxuICB9XG5cbiAgZGVjb0xpbmUgKGxlbikge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgodGhpcy5kZWNvLCBsZW4pXG4gIH1cblxuICBwYWRkaW5nICgpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKCcgJywgdGhpcy5wYWQpXG4gIH1cblxuICBsaW5lcyAodGV4dCA9ICcnLCB1cHRvSGVpZ2h0ID0gdHJ1ZSkge1xuICAgIHZhciBsLCBsaW5lcywgeFxuICAgIHRleHQgPSB0ZXh0IHx8ICcnXG4gICAgbGluZXMgPSB0ZXh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoJ1xcbicpXG5cbiAgICBpZiAodXB0b0hlaWdodCkge1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpLCByZWYsIHJlc3VsdHNcbiAgICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgICAgZm9yICh4ID0gaSA9IDAsIHJlZiA9IHRoaXMuaGVpZ2h0OyByZWYgPj0gMCA/IGkgPD0gcmVmIDogaSA+PSByZWY7IHggPSByZWYgPj0gMCA/ICsraSA6IC0taSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobGluZXNbeF0gfHwgJycpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH0uY2FsbCh0aGlzKSkuam9pbignXFxuJylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpLCBsZW4xLCByZXN1bHRzXG4gICAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbjEgPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW4xOyBpKyspIHtcbiAgICAgICAgICBsID0gbGluZXNbaV1cbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5saW5lKGwpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH0uY2FsbCh0aGlzKSkuam9pbignXFxuJylcbiAgICB9XG4gIH1cblxuICBsaW5lICh0ZXh0ID0gJycpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlcGVhdFRvTGVuZ3RoKCcgJywgdGhpcy5pbmRlbnQpICsgdGhpcy53cmFwQ29tbWVudCh0aGlzLmRlY28gKyB0aGlzLnBhZGRpbmcoKSArIHRleHQgKyBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoJyAnLCB0aGlzLndpZHRoIC0gdGhpcy5yZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KS5sZW5ndGgpICsgdGhpcy5wYWRkaW5nKCkgKyB0aGlzLmRlY28pXG4gIH1cblxuICBsZWZ0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28gKyB0aGlzLnBhZGRpbmcoKSlcbiAgfVxuXG4gIHJpZ2h0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQodGhpcy5wYWRkaW5nKCkgKyB0aGlzLmRlY28pXG4gIH1cblxuICByZW1vdmVJZ25vcmVkQ29udGVudCAodGV4dCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQuY29kZXdhdmUucmVtb3ZlTWFya2Vycyh0aGlzLmNvbnRleHQuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHRleHQpKVxuICB9XG5cbiAgdGV4dEJvdW5kcyAodGV4dCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0VHh0U2l6ZSh0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpKVxuICB9XG5cbiAgZ2V0Qm94Rm9yUG9zIChwb3MpIHtcbiAgICB2YXIgY2xvbmUsIGN1ckxlZnQsIGRlcHRoLCBlbmRGaW5kLCBsZWZ0LCBwYWlyLCBwbGFjZWhvbGRlciwgcmVzLCBzdGFydEZpbmRcbiAgICBkZXB0aCA9IHRoaXMuZ2V0TmVzdGVkTHZsKHBvcy5zdGFydClcblxuICAgIGlmIChkZXB0aCA+IDApIHtcbiAgICAgIGxlZnQgPSB0aGlzLmxlZnQoKVxuICAgICAgY3VyTGVmdCA9IFN0cmluZ0hlbHBlci5yZXBlYXQobGVmdCwgZGVwdGggLSAxKVxuICAgICAgY2xvbmUgPSB0aGlzLmNsb25lKClcbiAgICAgIHBsYWNlaG9sZGVyID0gJyMjI1BsYWNlSG9sZGVyIyMjJ1xuICAgICAgY2xvbmUud2lkdGggPSBwbGFjZWhvbGRlci5sZW5ndGhcbiAgICAgIGNsb25lLm9wZW5UZXh0ID0gY2xvbmUuY2xvc2VUZXh0ID0gdGhpcy5kZWNvICsgdGhpcy5kZWNvICsgcGxhY2Vob2xkZXIgKyB0aGlzLmRlY28gKyB0aGlzLmRlY29cbiAgICAgIHN0YXJ0RmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCAnLionKSlcbiAgICAgIGVuZEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuZW5kU2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKVxuICAgICAgcGFpciA9IG5ldyBQYWlyKHN0YXJ0RmluZCwgZW5kRmluZCwge1xuICAgICAgICB2YWxpZE1hdGNoOiBtYXRjaCA9PiB7XG4gICAgICAgICAgdmFyIGYgLy8gY29uc29sZS5sb2cobWF0Y2gsbGVmdClcblxuICAgICAgICAgIGYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQobWF0Y2guc3RhcnQoKSwgW2xlZnQsICdcXG4nLCAnXFxyJ10sIC0xKVxuICAgICAgICAgIHJldHVybiBmID09IG51bGwgfHwgZi5zdHIgIT09IGxlZnRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKVxuXG4gICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgcmVzLnN0YXJ0ICs9IGN1ckxlZnQubGVuZ3RoXG4gICAgICAgIHJldHVybiByZXNcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXROZXN0ZWRMdmwgKGluZGV4KSB7XG4gICAgdmFyIGRlcHRoLCBmLCBsZWZ0XG4gICAgZGVwdGggPSAwXG4gICAgbGVmdCA9IHRoaXMubGVmdCgpXG5cbiAgICB3aGlsZSAoKGYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQoaW5kZXgsIFtsZWZ0LCAnXFxuJywgJ1xcciddLCAtMSkpICE9IG51bGwgJiYgZi5zdHIgPT09IGxlZnQpIHtcbiAgICAgIGluZGV4ID0gZi5wb3NcbiAgICAgIGRlcHRoKytcbiAgICB9XG5cbiAgICByZXR1cm4gZGVwdGhcbiAgfVxuXG4gIGdldE9wdEZyb21MaW5lIChsaW5lLCBnZXRQYWQgPSB0cnVlKSB7XG4gICAgdmFyIGVuZFBvcywgckVuZCwgclN0YXJ0LCByZXNFbmQsIHJlc1N0YXJ0LCBzdGFydFBvc1xuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoJyhcXFxccyopKCcgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQodGhpcy5kZWNvKSkgKyAnKShcXFxccyopJylcbiAgICByRW5kID0gbmV3IFJlZ0V4cCgnKFxcXFxzKikoJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQodGhpcy5kZWNvKSkgKyAnKShcXG58JCknKVxuICAgIHJlc1N0YXJ0ID0gclN0YXJ0LmV4ZWMobGluZSlcbiAgICByZXNFbmQgPSByRW5kLmV4ZWMobGluZSlcblxuICAgIGlmIChyZXNTdGFydCAhPSBudWxsICYmIHJlc0VuZCAhPSBudWxsKSB7XG4gICAgICBpZiAoZ2V0UGFkKSB7XG4gICAgICAgIHRoaXMucGFkID0gTWF0aC5taW4ocmVzU3RhcnRbM10ubGVuZ3RoLCByZXNFbmRbMV0ubGVuZ3RoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmluZGVudCA9IHJlc1N0YXJ0WzFdLmxlbmd0aFxuICAgICAgc3RhcnRQb3MgPSByZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCArIHRoaXMucGFkXG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gdGhpcy5wYWRcbiAgICAgIHRoaXMud2lkdGggPSBlbmRQb3MgLSBzdGFydFBvc1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICByZWZvcm1hdExpbmVzICh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5saW5lcyh0aGlzLnJlbW92ZUNvbW1lbnQodGV4dCwgb3B0aW9ucyksIGZhbHNlKVxuICB9XG5cbiAgcmVtb3ZlQ29tbWVudCAodGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzLCBlY2wsIGVjciwgZWQsIGZsYWcsIG9wdCwgcmUxLCByZTJcblxuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH1cbiAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKVxuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpXG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5kZWNvKVxuICAgICAgZmxhZyA9IG9wdGlvbnMubXVsdGlsaW5lID8gJ2dtJyA6ICcnXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pKlxcXFxzezAsJHt0aGlzLnBhZH19YCwgZmxhZylcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoYFxcXFxzKig/OiR7ZWR9KSoke2Vjcn1cXFxccyokYCwgZmxhZylcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmUxLCAnJykucmVwbGFjZShyZTIsICcnKVxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5Cb3hIZWxwZXIgPSBCb3hIZWxwZXJcbiIsIlxuY29uc3QgUG9zQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbicpLlBvc0NvbGxlY3Rpb25cblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3MnKS5Qb3NcblxuY29uc3QgT3B0aW9uYWxQcm9taXNlID0gcmVxdWlyZSgnLi9oZWxwZXJzL09wdGlvbmFsUHJvbWlzZScpXG5cbnZhciBDbG9zaW5nUHJvbXAgPSBjbGFzcyBDbG9zaW5nUHJvbXAge1xuICBjb25zdHJ1Y3RvciAoY29kZXdhdmUxLCBzZWxlY3Rpb25zKSB7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlMVxuICAgIHRoaXMudGltZW91dCA9IG51bGxcbiAgICB0aGlzLl90eXBlZCA9IG51bGxcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZVxuICAgIHRoaXMubmJDaGFuZ2VzID0gMFxuICAgIHRoaXMuc2VsZWN0aW9ucyA9IG5ldyBQb3NDb2xsZWN0aW9uKHNlbGVjdGlvbnMpXG4gIH1cblxuICBiZWdpbiAoKSB7XG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZVxuICAgIHJldHVybiAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkodGhpcy5hZGRDYXJyZXRzKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuZWRpdG9yLmNhbkxpc3RlblRvQ2hhbmdlKCkpIHtcbiAgICAgICAgdGhpcy5wcm94eU9uQ2hhbmdlID0gKGNoID0gbnVsbCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQ2hhbmdlKGNoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5wcm94eU9uQ2hhbmdlKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH0pLnJlc3VsdCgpXG4gIH1cblxuICBhZGRDYXJyZXRzICgpIHtcbiAgICB0aGlzLnJlcGxhY2VtZW50cyA9IHRoaXMuc2VsZWN0aW9ucy53cmFwKHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2FycmV0Q2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cyArICdcXG4nLCAnXFxuJyArIHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKS5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBwLmNhcnJldFRvU2VsKClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyh0aGlzLnJlcGxhY2VtZW50cylcbiAgfVxuXG4gIGludmFsaWRUeXBlZCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkID0gbnVsbFxuICB9XG5cbiAgb25DaGFuZ2UgKGNoID0gbnVsbCkge1xuICAgIHRoaXMuaW52YWxpZFR5cGVkKClcblxuICAgIGlmICh0aGlzLnNraXBFdmVudChjaCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMubmJDaGFuZ2VzKytcblxuICAgIGlmICh0aGlzLnNob3VsZFN0b3AoKSkge1xuICAgICAgdGhpcy5zdG9wKClcbiAgICAgIHJldHVybiB0aGlzLmNsZWFuQ2xvc2UoKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bWUoKVxuICAgIH1cbiAgfVxuXG4gIHNraXBFdmVudCAoY2gpIHtcbiAgICByZXR1cm4gY2ggIT0gbnVsbCAmJiBjaC5jaGFyQ29kZUF0KDApICE9PSAzMlxuICB9XG5cbiAgcmVzdW1lICgpIHt9XG5cbiAgc2hvdWxkU3RvcCAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZWQoKSA9PT0gZmFsc2UgfHwgdGhpcy50eXBlZCgpLmluZGV4T2YoJyAnKSAhPT0gLTFcbiAgfVxuXG4gIGNsZWFuQ2xvc2UgKCkge1xuICAgIHZhciBlbmQsIGosIGxlbiwgcmVwbCwgcmVwbGFjZW1lbnRzLCByZXMsIHNlbCwgc2VsZWN0aW9ucywgc3RhcnRcbiAgICByZXBsYWNlbWVudHMgPSBbXVxuICAgIHNlbGVjdGlvbnMgPSB0aGlzLmdldFNlbGVjdGlvbnMoKVxuXG4gICAgZm9yIChqID0gMCwgbGVuID0gc2VsZWN0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgc2VsID0gc2VsZWN0aW9uc1tqXVxuXG4gICAgICBjb25zdCBwb3MgPSB0aGlzLndoaXRoaW5PcGVuQm91bmRzKHNlbClcbiAgICAgIGlmIChwb3MpIHtcbiAgICAgICAgc3RhcnQgPSBzZWxcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIHN0YXJ0ICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gZW5kLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLmlubmVyVGV4dCgpLnNwbGl0KCcgJylbMF1cbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChlbmQuaW5uZXJTdGFydCwgZW5kLmlubmVyRW5kLCByZXMpXG4gICAgICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtzdGFydF1cbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gocmVwbClcbiAgICAgICAgc3RhcnQgPSBudWxsXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRNdWx0aVNlbCgpXG4gIH1cblxuICBzdG9wICgpIHtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZVxuXG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICAgIH1cblxuICAgIGlmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9PT0gdGhpcykge1xuICAgICAgdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJveHlPbkNoYW5nZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5wcm94eU9uQ2hhbmdlKVxuICAgIH1cbiAgfVxuXG4gIGNhbmNlbCAoKSB7XG4gICAgaWYgKHRoaXMudHlwZWQoKSAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuY2FuY2VsU2VsZWN0aW9ucyh0aGlzLmdldFNlbGVjdGlvbnMoKSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdG9wKClcbiAgfVxuXG4gIGNhbmNlbFNlbGVjdGlvbnMgKHNlbGVjdGlvbnMpIHtcbiAgICB2YXIgZW5kLCBqLCBsZW4sIHJlcGxhY2VtZW50cywgc2VsLCBzdGFydFxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc3RhcnQgPSBudWxsXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdXG5cbiAgICAgIGNvbnN0IHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgaWYgKHBvcykge1xuICAgICAgICBzdGFydCA9IHBvc1xuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgc3RhcnQgIT0gbnVsbCkge1xuICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXcgUmVwbGFjZW1lbnQoc3RhcnQuc3RhcnQsIGVuZC5lbmQsIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoc3RhcnQuZW5kICsgMSwgZW5kLnN0YXJ0IC0gMSkpLnNlbGVjdENvbnRlbnQoKSlcbiAgICAgICAgc3RhcnQgPSBudWxsXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgfVxuXG4gIHR5cGVkICgpIHtcbiAgICB2YXIgY3BvcywgaW5uZXJFbmQsIGlubmVyU3RhcnRcblxuICAgIGlmICh0aGlzLl90eXBlZCA9PSBudWxsKSB7XG4gICAgICBjcG9zID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0Q3Vyc29yUG9zKClcbiAgICAgIGlubmVyU3RhcnQgPSB0aGlzLnJlcGxhY2VtZW50c1swXS5zdGFydCArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGhcblxuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuZmluZFByZXZCcmFrZXQoY3Bvcy5zdGFydCkgPT09IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICYmIChpbm5lckVuZCA9IHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoaW5uZXJTdGFydCkpICE9IG51bGwgJiYgaW5uZXJFbmQgPj0gY3Bvcy5lbmQpIHtcbiAgICAgICAgdGhpcy5fdHlwZWQgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGlubmVyU3RhcnQsIGlubmVyRW5kKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdHlwZWQgPSBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90eXBlZFxuICB9XG5cbiAgd2hpdGhpbk9wZW5Cb3VuZHMgKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIHJlZiwgcmVwbCwgdGFyZ2V0UG9zLCB0YXJnZXRUZXh0XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHNcblxuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldXG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLnN0YXJ0UG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHNcblxuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICB3aGl0aGluQ2xvc2VCb3VuZHMgKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIHJlZiwgcmVwbCwgdGFyZ2V0UG9zLCB0YXJnZXRUZXh0XG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHNcblxuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldXG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLmVuZFBvc0F0KGkpXG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHNcblxuICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykgJiYgdGFyZ2V0UG9zLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLnRleHQoKSA9PT0gdGFyZ2V0VGV4dCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBzdGFydFBvc0F0IChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLnN0YXJ0ICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIpLCB0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5lbmQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDEpKS53cmFwcGVkQnkodGhpcy5jb2Rld2F2ZS5icmFrZXRzLCB0aGlzLmNvZGV3YXZlLmJyYWtldHMpXG4gIH1cblxuICBlbmRQb3NBdCAoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5zdGFydCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMikpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciwgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKVxuICB9XG59XG5leHBvcnRzLkNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcFxudmFyIFNpbXVsYXRlZENsb3NpbmdQcm9tcCA9IGNsYXNzIFNpbXVsYXRlZENsb3NpbmdQcm9tcCBleHRlbmRzIENsb3NpbmdQcm9tcCB7XG4gIHJlc3VtZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2ltdWxhdGVUeXBlKClcbiAgfVxuXG4gIHNpbXVsYXRlVHlwZSAoKSB7XG4gICAgaWYgKHRoaXMudGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHZhciBjdXJDbG9zZSwgcmVwbCwgdGFyZ2V0VGV4dFxuICAgICAgdGhpcy5pbnZhbGlkVHlwZWQoKVxuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzXG4gICAgICBjdXJDbG9zZSA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0uY29weSgpLmFwcGx5T2Zmc2V0KHRoaXMudHlwZWQoKS5sZW5ndGgpKVxuXG4gICAgICBpZiAoY3VyQ2xvc2UpIHtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChjdXJDbG9zZS5zdGFydCwgY3VyQ2xvc2UuZW5kLCB0YXJnZXRUZXh0KVxuXG4gICAgICAgIGlmIChyZXBsLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLm5lY2Vzc2FyeSgpKSB7XG4gICAgICAgICAgdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoW3JlcGxdKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vblR5cGVTaW11bGF0ZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vblR5cGVTaW11bGF0ZWQoKVxuICAgICAgfVxuICAgIH0sIDIpXG4gIH1cblxuICBza2lwRXZlbnQgKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIFt0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKSwgdGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXSArIHRoaXMudHlwZWQoKS5sZW5ndGhdXG4gIH1cblxuICB3aGl0aGluQ2xvc2VCb3VuZHMgKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIG5leHQsIHJlZiwgcmVwbCwgdGFyZ2V0UG9zXG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHNcblxuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICByZXBsID0gcmVmW2ldXG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLmVuZFBvc0F0KGkpXG4gICAgICBuZXh0ID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldCh0YXJnZXRQb3MuaW5uZXJTdGFydClcblxuICAgICAgaWYgKG5leHQgIT0gbnVsbCkge1xuICAgICAgICB0YXJnZXRQb3MubW92ZVN1ZmZpeChuZXh0KVxuXG4gICAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbmV4cG9ydHMuU2ltdWxhdGVkQ2xvc2luZ1Byb21wID0gU2ltdWxhdGVkQ2xvc2luZ1Byb21wXG5cbkNsb3NpbmdQcm9tcC5uZXdGb3IgPSBmdW5jdGlvbiAoY29kZXdhdmUsIHNlbGVjdGlvbnMpIHtcbiAgaWYgKGNvZGV3YXZlLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICByZXR1cm4gbmV3IENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucylcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFNpbXVsYXRlZENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucylcbiAgfVxufVxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBOYW1lc3BhY2VIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJykuTmFtZXNwYWNlSGVscGVyXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuL0NvbW1hbmQnKS5Db21tYW5kXG5cbnZhciBpbmRleE9mID0gW10uaW5kZXhPZlxuXG52YXIgQ21kRmluZGVyID0gY2xhc3MgQ21kRmluZGVyIHtcbiAgY29uc3RydWN0b3IgKG5hbWVzLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbFxuXG4gICAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXVxuICAgIH1cblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgbmFtZXNwYWNlczogW10sXG4gICAgICBwYXJlbnRDb250ZXh0OiBudWxsLFxuICAgICAgY29udGV4dDogbnVsbCxcbiAgICAgIHJvb3Q6IENvbW1hbmQuY21kcyxcbiAgICAgIG11c3RFeGVjdXRlOiB0cnVlLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0cnVlLFxuICAgICAgdXNlRmFsbGJhY2tzOiB0cnVlLFxuICAgICAgaW5zdGFuY2U6IG51bGwsXG4gICAgICBjb2Rld2F2ZTogbnVsbFxuICAgIH1cbiAgICB0aGlzLm5hbWVzID0gbmFtZXNcbiAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnMucGFyZW50XG5cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwgJiYga2V5ICE9PSAncGFyZW50Jykge1xuICAgICAgICB0aGlzW2tleV0gPSB0aGlzLnBhcmVudFtrZXldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMuY29kZXdhdmUpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50Q29udGV4dCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5wYXJlbnRDb250ZXh0XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubmFtZXNwYWNlcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyh0aGlzLm5hbWVzcGFjZXMpXG4gICAgfVxuICB9XG5cbiAgZmluZCAoKSB7XG4gICAgdGhpcy50cmlnZ2VyRGV0ZWN0b3JzKClcbiAgICB0aGlzLmNtZCA9IHRoaXMuZmluZEluKHRoaXMucm9vdClcbiAgICByZXR1cm4gdGhpcy5jbWRcbiAgfSAvLyAgZ2V0UG9zaWJpbGl0aWVzOiAtPlxuICAvLyAgICBAdHJpZ2dlckRldGVjdG9ycygpXG4gIC8vICAgIHBhdGggPSBsaXN0KEBwYXRoKVxuICAvLyAgICByZXR1cm4gQGZpbmRQb3NpYmlsaXRpZXNJbihAcm9vdCxwYXRoKVxuXG4gIGdldE5hbWVzV2l0aFBhdGhzICgpIHtcbiAgICB2YXIgaiwgbGVuLCBuYW1lLCBwYXRocywgcmVmLCByZXN0LCBzcGFjZVxuICAgIHBhdGhzID0ge31cbiAgICByZWYgPSB0aGlzLm5hbWVzXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5hbWUgPSByZWZbal07XG4gICAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSlcblxuICAgICAgaWYgKHNwYWNlICE9IG51bGwgJiYgIShpbmRleE9mLmNhbGwodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwgc3BhY2UpID49IDApKSB7XG4gICAgICAgIGlmICghKHNwYWNlIGluIHBhdGhzKSkge1xuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdXG4gICAgICAgIH1cblxuICAgICAgICBwYXRoc1tzcGFjZV0ucHVzaChyZXN0KVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXRoc1xuICB9XG5cbiAgYXBwbHlTcGFjZU9uTmFtZXMgKG5hbWVzcGFjZSkge1xuICAgIHZhciByZXN0LCBzcGFjZTtcbiAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZXNwYWNlLCB0cnVlKVxuICAgIHJldHVybiB0aGlzLm5hbWVzLm1hcChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGN1cl9yZXN0LCBjdXJfc3BhY2U7XG4gICAgICBbY3VyX3NwYWNlLCBjdXJfcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuXG4gICAgICBpZiAoY3VyX3NwYWNlICE9IG51bGwgJiYgY3VyX3NwYWNlID09PSBzcGFjZSkge1xuICAgICAgICBuYW1lID0gY3VyX3Jlc3RcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3QgIT0gbnVsbCkge1xuICAgICAgICBuYW1lID0gcmVzdCArICc6JyArIG5hbWVcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5hbWVcbiAgICB9KVxuICB9XG5cbiAgZ2V0RGlyZWN0TmFtZXMgKCkge1xuICAgIHZhciBuXG4gICAgcmV0dXJuIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaiwgbGVuLCByZWYsIHJlc3VsdHNcbiAgICAgIHJlZiA9IHRoaXMubmFtZXNcbiAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgbiA9IHJlZltqXVxuXG4gICAgICAgIGlmIChuLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gobilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH0uY2FsbCh0aGlzKSlcbiAgfVxuXG4gIHRyaWdnZXJEZXRlY3RvcnMgKCkge1xuICAgIHZhciBjbWQsIGRldGVjdG9yLCBpLCBqLCBsZW4sIHBvc2liaWxpdGllcywgcmVmLCByZXMsIHJlc3VsdHNcblxuICAgIGlmICh0aGlzLnVzZURldGVjdG9ycykge1xuICAgICAgdGhpcy51c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcG9zaWJpbGl0aWVzID0gW3RoaXMucm9vdF0uY29uY2F0KG5ldyBDbWRGaW5kZXIodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgICAgaSA9IDBcbiAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICB3aGlsZSAoaSA8IHBvc2liaWxpdGllcy5sZW5ndGgpIHtcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldXG4gICAgICAgIHJlZiA9IGNtZC5kZXRlY3RvcnNcblxuICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICBkZXRlY3RvciA9IHJlZltqXVxuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKVxuXG4gICAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyhyZXMpXG4gICAgICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIocmVzLCB7XG4gICAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICAgICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0cy5wdXNoKGkrKylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG4gIH1cblxuICBmaW5kSW4gKGNtZCwgcGF0aCA9IG51bGwpIHtcbiAgICB2YXIgYmVzdFxuXG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGJlc3QgPSB0aGlzLmJlc3RJblBvc2liaWxpdGllcyh0aGlzLmZpbmRQb3NpYmlsaXRpZXMoKSlcblxuICAgIGlmIChiZXN0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBiZXN0XG4gICAgfVxuICB9XG5cbiAgZmluZFBvc2liaWxpdGllcyAoKSB7XG4gICAgdmFyIGRpcmVjdCwgZmFsbGJhY2ssIGosIGssIGxlbiwgbGVuMSwgbmFtZSwgbmFtZXMsIG5zcGMsIG5zcGNOYW1lLCBwb3NpYmlsaXRpZXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVzdCwgc3BhY2VcblxuICAgIGlmICh0aGlzLnJvb3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgdGhpcy5yb290LmluaXQoKVxuICAgIHBvc2liaWxpdGllcyA9IFtdXG5cbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvZGV3YXZlKSAhPSBudWxsID8gKHJlZjEgPSByZWYuaW5JbnN0YW5jZSkgIT0gbnVsbCA/IHJlZjEuY21kIDogbnVsbCA6IG51bGwpID09PSB0aGlzLnJvb3QpIHtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZCgnaW5faW5zdGFuY2UnKSlcbiAgICB9XG5cbiAgICByZWYyID0gdGhpcy5nZXROYW1lc1dpdGhQYXRocygpXG5cbiAgICBmb3IgKHNwYWNlIGluIHJlZjIpIHtcbiAgICAgIG5hbWVzID0gcmVmMltzcGFjZV1cbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChzcGFjZSwgbmFtZXMpKVxuICAgIH1cblxuICAgIHJlZjMgPSB0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuc3BjID0gcmVmM1tqXTtcbiAgICAgIFtuc3BjTmFtZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLCB0cnVlKVxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKG5zcGNOYW1lLCB0aGlzLmFwcGx5U3BhY2VPbk5hbWVzKG5zcGMpKSlcbiAgICB9XG5cbiAgICByZWY0ID0gdGhpcy5nZXREaXJlY3ROYW1lcygpXG5cbiAgICBmb3IgKGsgPSAwLCBsZW4xID0gcmVmNC5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgIG5hbWUgPSByZWY0W2tdXG4gICAgICBkaXJlY3QgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpXG5cbiAgICAgIGlmICh0aGlzLmNtZElzVmFsaWQoZGlyZWN0KSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudXNlRmFsbGJhY2tzKSB7XG4gICAgICBmYWxsYmFjayA9IHRoaXMucm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJylcblxuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChmYWxsYmFjaykpIHtcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZmFsbGJhY2spXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXNcbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzXG4gIH1cblxuICBnZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZCAoY21kTmFtZSwgbmFtZXMgPSB0aGlzLm5hbWVzKSB7XG4gICAgdmFyIGosIGxlbiwgbmV4dCwgbmV4dHMsIHBvc2liaWxpdGllc1xuICAgIHBvc2liaWxpdGllcyA9IFtdXG4gICAgbmV4dHMgPSB0aGlzLmdldENtZEZvbGxvd0FsaWFzKGNtZE5hbWUpXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBuZXh0cy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmV4dCA9IG5leHRzW2pdXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtcbiAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICByb290OiBuZXh0XG4gICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc2liaWxpdGllc1xuICB9XG5cbiAgZ2V0Q21kRm9sbG93QWxpYXMgKG5hbWUpIHtcbiAgICB2YXIgY21kXG4gICAgY21kID0gdGhpcy5yb290LmdldENtZChuYW1lKVxuXG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQuaW5pdCgpXG5cbiAgICAgIGlmIChjbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbY21kLCBjbWQuZ2V0QWxpYXNlZCgpXVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gW2NtZF1cbiAgICB9XG5cbiAgICByZXR1cm4gW2NtZF1cbiAgfVxuXG4gIGNtZElzVmFsaWQgKGNtZCkge1xuICAgIGlmIChjbWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKGNtZC5uYW1lICE9PSAnZmFsbGJhY2snICYmIGluZGV4T2YuY2FsbCh0aGlzLmFuY2VzdG9ycygpLCBjbWQpID49IDApIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiAhdGhpcy5tdXN0RXhlY3V0ZSB8fCB0aGlzLmNtZElzRXhlY3V0YWJsZShjbWQpXG4gIH1cblxuICBhbmNlc3RvcnMgKCkge1xuICAgIHZhciByZWZcblxuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyByZWYuaW5JbnN0YW5jZSA6IG51bGwpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG4gIH1cblxuICBjbWRJc0V4ZWN1dGFibGUgKGNtZCkge1xuICAgIHZhciBuYW1lc1xuICAgIG5hbWVzID0gdGhpcy5nZXREaXJlY3ROYW1lcygpXG5cbiAgICBpZiAobmFtZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGVXaXRoTmFtZShuYW1lc1swXSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICB9XG4gIH1cblxuICBjbWRTY29yZSAoY21kKSB7XG4gICAgdmFyIHNjb3JlXG4gICAgc2NvcmUgPSBjbWQuZGVwdGhcblxuICAgIGlmIChjbWQubmFtZSA9PT0gJ2ZhbGxiYWNrJykge1xuICAgICAgc2NvcmUgLT0gMTAwMFxuICAgIH1cblxuICAgIHJldHVybiBzY29yZVxuICB9XG5cbiAgYmVzdEluUG9zaWJpbGl0aWVzIChwb3NzKSB7XG4gICAgdmFyIGJlc3QsIGJlc3RTY29yZSwgaiwgbGVuLCBwLCBzY29yZVxuXG4gICAgaWYgKHBvc3MubGVuZ3RoID4gMCkge1xuICAgICAgYmVzdCA9IG51bGxcbiAgICAgIGJlc3RTY29yZSA9IG51bGxcblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcG9zcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcG9zc1tqXVxuICAgICAgICBzY29yZSA9IHRoaXMuY21kU2NvcmUocClcblxuICAgICAgICBpZiAoYmVzdCA9PSBudWxsIHx8IHNjb3JlID49IGJlc3RTY29yZSkge1xuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlXG4gICAgICAgICAgYmVzdCA9IHBcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYmVzdFxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5DbWRGaW5kZXIgPSBDbWRGaW5kZXJcbiIsIlxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxuY29uc3QgVGV4dFBhcnNlciA9IHJlcXVpcmUoJy4vVGV4dFBhcnNlcicpLlRleHRQYXJzZXJcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKCcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJylcblxudmFyIENtZEluc3RhbmNlID0gY2xhc3MgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3RvciAoY21kMSwgY29udGV4dCkge1xuICAgIHRoaXMuY21kID0gY21kMVxuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRcbiAgfVxuXG4gIGluaXQgKCkge1xuICAgIGlmICghKHRoaXMuaXNFbXB0eSgpIHx8IHRoaXMuaW5pdGVkKSkge1xuICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlXG5cbiAgICAgIHRoaXMuX2dldENtZE9iaigpXG5cbiAgICAgIHRoaXMuX2luaXRQYXJhbXMoKVxuXG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNtZE9iai5pbml0KClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc2V0UGFyYW0gKG5hbWUsIHZhbCkge1xuICAgIHJldHVybiB0aGlzLm5hbWVkW25hbWVdID0gdmFsXG4gIH1cblxuICBwdXNoUGFyYW0gKHZhbCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5wdXNoKHZhbClcbiAgfVxuXG4gIGdldENvbnRleHQgKCkge1xuICAgIGlmICh0aGlzLmNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvbnRleHQgfHwgbmV3IENvbnRleHQoKVxuICB9XG5cbiAgZ2V0RmluZGVyIChjbWROYW1lKSB7XG4gICAgdmFyIGZpbmRlclxuICAgIGZpbmRlciA9IHRoaXMuZ2V0Q29udGV4dCgpLmdldEZpbmRlcihjbWROYW1lLCB7XG4gICAgICBuYW1lc3BhY2VzOiB0aGlzLl9nZXRQYXJlbnROYW1lc3BhY2VzKClcbiAgICB9KVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIH1cblxuICBfZ2V0Q21kT2JqICgpIHtcbiAgICB2YXIgY21kXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jbWQuaW5pdCgpXG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWQoKSB8fCB0aGlzLmNtZFxuICAgICAgY21kLmluaXQoKVxuXG4gICAgICBpZiAoY21kLmNscyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqID0gbmV3IGNtZC5jbHModGhpcylcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2luaXRQYXJhbXMgKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWVkID0gdGhpcy5nZXREZWZhdWx0cygpXG4gIH1cblxuICBfZ2V0UGFyZW50TmFtZXNwYWNlcyAoKSB7XG4gICAgcmV0dXJuIFtdXG4gIH1cblxuICBpc0VtcHR5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5jbWQgIT0gbnVsbFxuICB9XG5cbiAgcmVzdWx0SXNBdmFpbGFibGUgKCkge1xuICAgIHZhciBhbGlhc2VkXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIH1cblxuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKClcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNtZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBnZXREZWZhdWx0cyAoKSB7XG4gICAgdmFyIGFsaWFzZWQsIHJlc1xuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJlcyA9IHt9XG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKClcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgICAgfVxuXG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5jbWQuZGVmYXVsdHMpXG5cbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZE9iai5nZXREZWZhdWx0cygpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fVxuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWQgKCkge1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkQ21kID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5nZXRBbGlhc2VkRmluYWwoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5hbGlhc2VkQ21kIHx8IG51bGxcbiAgICB9XG4gIH1cblxuICBnZXRBbGlhc2VkRmluYWwgKCkge1xuICAgIHZhciBhbGlhc2VkXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZEZpbmFsQ21kICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZEZpbmFsQ21kIHx8IG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY21kLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBhbGlhc2VkID0gdGhpcy5jbWRcblxuICAgICAgICB3aGlsZSAoYWxpYXNlZCAhPSBudWxsICYmIGFsaWFzZWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgICAgYWxpYXNlZCA9IGFsaWFzZWQuX2FsaWFzZWRGcm9tRmluZGVyKHRoaXMuZ2V0RmluZGVyKHRoaXMuYWx0ZXJBbGlhc09mKGFsaWFzZWQuYWxpYXNPZikpKVxuXG4gICAgICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmFsaWFzZWRDbWQgPSBhbGlhc2VkIHx8IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIHx8IGZhbHNlXG4gICAgICAgIHJldHVybiBhbGlhc2VkXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWx0ZXJBbGlhc09mIChhbGlhc09mKSB7XG4gICAgcmV0dXJuIGFsaWFzT2ZcbiAgfVxuXG4gIGdldE9wdGlvbnMgKCkge1xuICAgIHZhciBvcHRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPcHRpb25zICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT3B0aW9uc1xuICAgICAgfVxuXG4gICAgICBvcHQgPSB0aGlzLmNtZC5fb3B0aW9uc0ZvckFsaWFzZWQodGhpcy5nZXRBbGlhc2VkKCkpXG5cbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmNtZE9iai5nZXRPcHRpb25zKCkpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY21kT3B0aW9ucyA9IG9wdFxuICAgICAgcmV0dXJuIG9wdFxuICAgIH1cbiAgfVxuXG4gIGdldE9wdGlvbiAoa2V5KSB7XG4gICAgdmFyIG9wdGlvbnNcbiAgICBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKClcblxuICAgIGlmIChvcHRpb25zICE9IG51bGwgJiYga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV1cbiAgICB9XG4gIH1cblxuICBnZXRQYXJhbSAobmFtZXMsIGRlZlZhbCA9IG51bGwpIHtcbiAgICB2YXIgaSwgbGVuLCBuLCByZWZcblxuICAgIGlmICgocmVmID0gdHlwZW9mIG5hbWVzKSA9PT0gJ3N0cmluZycgfHwgcmVmID09PSAnbnVtYmVyJykge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdXG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgbGVuID0gbmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG4gPSBuYW1lc1tpXVxuXG4gICAgICBpZiAodGhpcy5uYW1lZFtuXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVkW25dXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnBhcmFtc1tuXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtc1tuXVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWZWYWxcbiAgfVxuXG4gIGdldEJvb2xQYXJhbSAobmFtZXMsIGRlZlZhbCA9IG51bGwpIHtcbiAgICB2YXIgZmFsc2VWYWxzLCB2YWxcbiAgICBmYWxzZVZhbHMgPSBbJycsICcwJywgJ2ZhbHNlJywgJ25vJywgJ25vbmUnLCBmYWxzZSwgbnVsbCwgMF1cbiAgICB2YWwgPSB0aGlzLmdldFBhcmFtKG5hbWVzLCBkZWZWYWwpXG4gICAgcmV0dXJuICFmYWxzZVZhbHMuaW5jbHVkZXModmFsKVxuICB9XG5cbiAgYW5jZXN0b3JDbWRzICgpIHtcbiAgICB2YXIgcmVmXG5cbiAgICBpZiAoKChyZWYgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUpICE9IG51bGwgPyByZWYuaW5JbnN0YW5jZSA6IG51bGwpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICB9XG5cbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGFuY2VzdG9yQ21kc0FuZFNlbGYgKCkge1xuICAgIHJldHVybiB0aGlzLmFuY2VzdG9yQ21kcygpLmNvbmNhdChbdGhpcy5jbWRdKVxuICB9XG5cbiAgcnVuRXhlY3V0ZUZ1bmN0ICgpIHtcbiAgICB2YXIgY21kXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLmV4ZWN1dGUoKVxuICAgICAgfVxuXG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpIHx8IHRoaXMuY21kXG4gICAgICBjbWQuaW5pdCgpXG5cbiAgICAgIGlmIChjbWQuZXhlY3V0ZUZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlRnVuY3QodGhpcylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByYXdSZXN1bHQgKCkge1xuICAgIHZhciBjbWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0KClcbiAgICAgIH1cblxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZFxuICAgICAgY21kLmluaXQoKVxuXG4gICAgICBpZiAoY21kLnJlc3VsdEZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRGdW5jdCh0aGlzKVxuICAgICAgfVxuXG4gICAgICBpZiAoY21kLnJlc3VsdFN0ciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0U3RyXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0ICgpIHtcbiAgICB0aGlzLmluaXQoKVxuXG4gICAgaWYgKHRoaXMucmVzdWx0SXNBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh0aGlzLnJhd1Jlc3VsdCgpKS50aGVuKHJlcyA9PiB7XG4gICAgICAgIHZhciBwYXJzZXJcblxuICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICByZXMgPSB0aGlzLmZvcm1hdEluZGVudChyZXMpXG5cbiAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDAgJiYgdGhpcy5nZXRPcHRpb24oJ3BhcnNlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHBhcnNlciA9IHRoaXMuZ2V0UGFyc2VyRm9yVGV4dChyZXMpXG4gICAgICAgICAgICByZXMgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGFsdGVyRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYWx0ZXJSZXN1bHQnLCB0aGlzKVxuICAgICAgICAgIGlmIChhbHRlckZ1bmN0KSB7XG4gICAgICAgICAgICByZXMgPSBhbHRlckZ1bmN0KHJlcywgdGhpcylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmVzXG4gICAgICAgIH1cbiAgICAgIH0pLnJlc3VsdCgpXG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyc2VyRm9yVGV4dCAodHh0ID0gJycpIHtcbiAgICB2YXIgcGFyc2VyXG4gICAgcGFyc2VyID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlLm5ld0luc3RhbmNlKG5ldyBUZXh0UGFyc2VyKHR4dCksIHtcbiAgICAgIGluSW5zdGFuY2U6IHRoaXNcbiAgICB9KVxuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlXG4gICAgcmV0dXJuIHBhcnNlclxuICB9XG5cbiAgZ2V0SW5kZW50ICgpIHtcbiAgICByZXR1cm4gMFxuICB9XG5cbiAgZm9ybWF0SW5kZW50ICh0ZXh0KSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx0L2csICcgICcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgfVxuICB9XG5cbiAgYXBwbHlJbmRlbnQgKHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nSGVscGVyLmluZGVudE5vdEZpcnN0KHRleHQsIHRoaXMuZ2V0SW5kZW50KCksICcgJylcbiAgfVxufVxuZXhwb3J0cy5DbWRJbnN0YW5jZSA9IENtZEluc3RhbmNlXG4iLCJcbmNvbnN0IFByb2Nlc3MgPSByZXF1aXJlKCcuL1Byb2Nlc3MnKS5Qcm9jZXNzXG5cbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbmNvbnN0IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSA9IHJlcXVpcmUoJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJykuUG9zaXRpb25lZENtZEluc3RhbmNlXG5cbmNvbnN0IFRleHRQYXJzZXIgPSByZXF1aXJlKCcuL1RleHRQYXJzZXInKS5UZXh0UGFyc2VyXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuL0NvbW1hbmQnKS5Db21tYW5kXG5cbmNvbnN0IExvZ2dlciA9IHJlcXVpcmUoJy4vTG9nZ2VyJykuTG9nZ2VyXG5cbmNvbnN0IFBvc0NvbGxlY3Rpb24gPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nKS5Qb3NDb2xsZWN0aW9uXG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9TdHJpbmdIZWxwZXInKS5TdHJpbmdIZWxwZXJcblxuY29uc3QgQ2xvc2luZ1Byb21wID0gcmVxdWlyZSgnLi9DbG9zaW5nUHJvbXAnKS5DbG9zaW5nUHJvbXBcblxudmFyIENvZGV3YXZlID0gKGZ1bmN0aW9uICgpIHtcbiAgY2xhc3MgQ29kZXdhdmUge1xuICAgIGNvbnN0cnVjdG9yIChlZGl0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbFxuICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JcbiAgICAgIENvZGV3YXZlLmluaXQoKVxuICAgICAgdGhpcy5tYXJrZXIgPSAnW1tbW2NvZGV3YXZlX21hcnF1ZXJdXV1dJ1xuICAgICAgdGhpcy52YXJzID0ge31cbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBicmFrZXRzOiAnfn4nLFxuICAgICAgICBkZWNvOiAnficsXG4gICAgICAgIGNsb3NlQ2hhcjogJy8nLFxuICAgICAgICBub0V4ZWN1dGVDaGFyOiAnIScsXG4gICAgICAgIGNhcnJldENoYXI6ICd8JyxcbiAgICAgICAgY2hlY2tDYXJyZXQ6IHRydWUsXG4gICAgICAgIGluSW5zdGFuY2U6IG51bGxcbiAgICAgIH1cbiAgICAgIHRoaXMucGFyZW50ID0gb3B0aW9ucy5wYXJlbnRcbiAgICAgIHRoaXMubmVzdGVkID0gdGhpcy5wYXJlbnQgIT0gbnVsbCA/IHRoaXMucGFyZW50Lm5lc3RlZCArIDEgOiAwXG5cbiAgICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV1cblxuICAgICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsICYmIGtleSAhPT0gJ3BhcmVudCcpIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSB0aGlzLnBhcmVudFtrZXldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZWRpdG9yICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5lZGl0b3IuYmluZGVkVG8odGhpcylcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcylcblxuICAgICAgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5wYXJlbnQgPSB0aGlzLmluSW5zdGFuY2UuY29udGV4dFxuICAgICAgfVxuXG4gICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoKVxuICAgIH1cblxuICAgIG9uQWN0aXZhdGlvbktleSAoKSB7XG4gICAgICB0aGlzLnByb2Nlc3MgPSBuZXcgUHJvY2VzcygpXG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ2FjdGl2YXRpb24ga2V5JylcbiAgICAgIHJldHVybiB0aGlzLnJ1bkF0Q3Vyc29yUG9zKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3MgPSBudWxsXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJ1bkF0Q3Vyc29yUG9zICgpIHtcbiAgICAgIGlmICh0aGlzLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuQXRNdWx0aVBvcyh0aGlzLmVkaXRvci5nZXRNdWx0aVNlbCgpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuQXRQb3ModGhpcy5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcnVuQXRQb3MgKHBvcykge1xuICAgICAgaWYgKHBvcyA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ3Vyc29yIFBvc2l0aW9uIGlzIGVtcHR5JylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnVuQXRNdWx0aVBvcyhbcG9zXSlcbiAgICB9XG5cbiAgICBydW5BdE11bHRpUG9zIChtdWx0aVBvcykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgY21kXG5cbiAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpXG5cbiAgICAgICAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY21kLmluaXQoKVxuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGNtZClcbiAgICAgICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZSgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtdWx0aVBvc1swXS5zdGFydCA9PT0gbXVsdGlQb3NbMF0uZW5kKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZEJyYWtldHMobXVsdGlQb3MpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9tcHRDbG9zaW5nQ21kKG11bHRpUG9zKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb21tYW5kT25Qb3MgKHBvcykge1xuICAgICAgdmFyIG5leHQsIHByZXZcblxuICAgICAgaWYgKHRoaXMucHJlY2VkZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmZvbGxvd2VkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDEpIHtcbiAgICAgICAgcHJldiA9IHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGhcbiAgICAgICAgbmV4dCA9IHBvc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMucHJlY2VkZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMCkge1xuICAgICAgICAgIHBvcyAtPSB0aGlzLmJyYWtldHMubGVuZ3RoXG4gICAgICAgIH1cblxuICAgICAgICBwcmV2ID0gdGhpcy5maW5kUHJldkJyYWtldChwb3MpXG5cbiAgICAgICAgaWYgKHByZXYgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBuZXh0ID0gdGhpcy5maW5kTmV4dEJyYWtldChwb3MgLSAxKVxuXG4gICAgICAgIGlmIChuZXh0ID09IG51bGwgfHwgdGhpcy5jb3VudFByZXZCcmFrZXQocHJldikgJSAyICE9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBwcmV2LCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHByZXYsIG5leHQgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSlcbiAgICB9XG5cbiAgICBuZXh0Q21kIChzdGFydCA9IDApIHtcbiAgICAgIHZhciBiZWdpbm5pbmcsIGYsIHBvc1xuICAgICAgcG9zID0gc3RhcnRcblxuICAgICAgd2hpbGUgKGYgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW3RoaXMuYnJha2V0cywgJ1xcbiddKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIGYuc3RyLmxlbmd0aFxuXG4gICAgICAgIGlmIChmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBiZWdpbm5pbmcgIT09ICd1bmRlZmluZWQnICYmIGJlZ2lubmluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgYmVnaW5uaW5nLCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKGJlZ2lubmluZywgZi5wb3MgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmVnaW5uaW5nID0gZi5wb3NcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmVnaW5uaW5nID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgZ2V0RW5jbG9zaW5nQ21kIChwb3MgPSAwKSB7XG4gICAgICB2YXIgY2xvc2luZ1ByZWZpeCwgY3BvcywgcFxuICAgICAgY3BvcyA9IHBvc1xuICAgICAgY2xvc2luZ1ByZWZpeCA9IHRoaXMuYnJha2V0cyArIHRoaXMuY2xvc2VDaGFyXG5cbiAgICAgIHdoaWxlICgocCA9IHRoaXMuZmluZE5leHQoY3BvcywgY2xvc2luZ1ByZWZpeCkpICE9IG51bGwpIHtcbiAgICAgICAgY29uc3QgY21kID0gdGhpcy5jb21tYW5kT25Qb3MocCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoKVxuICAgICAgICBpZiAoY21kKSB7XG4gICAgICAgICAgY3BvcyA9IGNtZC5nZXRFbmRQb3MoKVxuXG4gICAgICAgICAgaWYgKGNtZC5wb3MgPCBwb3MpIHtcbiAgICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3BvcyA9IHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgcHJlY2VkZWRCeUJyYWtldHMgKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aCwgcG9zKSA9PT0gdGhpcy5icmFrZXRzXG4gICAgfVxuXG4gICAgZm9sbG93ZWRCeUJyYWtldHMgKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSA9PT0gdGhpcy5icmFrZXRzXG4gICAgfVxuXG4gICAgY291bnRQcmV2QnJha2V0IChzdGFydCkge1xuICAgICAgdmFyIGlcbiAgICAgIGkgPSAwXG5cbiAgICAgIHdoaWxlICgoc3RhcnQgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHN0YXJ0KSkgIT0gbnVsbCkge1xuICAgICAgICBpKytcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlcbiAgICB9XG5cbiAgICBpc0VuZExpbmUgKHBvcykge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyAxKSA9PT0gJ1xcbicgfHwgcG9zICsgMSA+PSB0aGlzLmVkaXRvci50ZXh0TGVuKClcbiAgICB9XG5cbiAgICBmaW5kUHJldkJyYWtldCAoc3RhcnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmROZXh0QnJha2V0KHN0YXJ0LCAtMSlcbiAgICB9XG5cbiAgICBmaW5kTmV4dEJyYWtldCAoc3RhcnQsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmXG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3RoaXMuYnJha2V0cywgJ1xcbiddLCBkaXJlY3Rpb24pXG5cbiAgICAgIGlmIChmICYmIGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgcmV0dXJuIGYucG9zXG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZFByZXYgKHN0YXJ0LCBzdHJpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmROZXh0KHN0YXJ0LCBzdHJpbmcsIC0xKVxuICAgIH1cblxuICAgIGZpbmROZXh0IChzdGFydCwgc3RyaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZlxuICAgICAgZiA9IHRoaXMuZmluZEFueU5leHQoc3RhcnQsIFtzdHJpbmddLCBkaXJlY3Rpb24pXG5cbiAgICAgIGlmIChmKSB7XG4gICAgICAgIHJldHVybiBmLnBvc1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRBbnlOZXh0IChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbmRBbnlOZXh0KHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24pXG4gICAgfVxuXG4gICAgZmluZE1hdGNoaW5nUGFpciAoc3RhcnRQb3MsIG9wZW5pbmcsIGNsb3NpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmLCBuZXN0ZWQsIHBvc1xuICAgICAgcG9zID0gc3RhcnRQb3NcbiAgICAgIG5lc3RlZCA9IDBcblxuICAgICAgd2hpbGUgKGYgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgW2Nsb3NpbmcsIG9wZW5pbmddLCBkaXJlY3Rpb24pKSB7XG4gICAgICAgIHBvcyA9IGYucG9zICsgKGRpcmVjdGlvbiA+IDAgPyBmLnN0ci5sZW5ndGggOiAwKVxuXG4gICAgICAgIGlmIChmLnN0ciA9PT0gKGRpcmVjdGlvbiA+IDAgPyBjbG9zaW5nIDogb3BlbmluZykpIHtcbiAgICAgICAgICBpZiAobmVzdGVkID4gMCkge1xuICAgICAgICAgICAgbmVzdGVkLS1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmVzdGVkKytcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGFkZEJyYWtldHMgKHBvcykge1xuICAgICAgdmFyIHJlcGxhY2VtZW50c1xuICAgICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKVxuICAgICAgcmVwbGFjZW1lbnRzID0gcG9zLndyYXAodGhpcy5icmFrZXRzLCB0aGlzLmJyYWtldHMpLm1hcChmdW5jdGlvbiAocikge1xuICAgICAgICByZXR1cm4gci5zZWxlY3RDb250ZW50KClcbiAgICAgIH0pXG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICAgIH1cblxuICAgIHByb21wdENsb3NpbmdDbWQgKHNlbGVjdGlvbnMpIHtcbiAgICAgIGlmICh0aGlzLmNsb3NpbmdQcm9tcCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY2xvc2luZ1Byb21wLnN0b3AoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUHJvbXAgPSBDbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsIHNlbGVjdGlvbnMpLmJlZ2luKClcbiAgICB9XG5cbiAgICBuZXdJbnN0YW5jZSAoZWRpdG9yLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gbmV3IENvZGV3YXZlKGVkaXRvciwgb3B0aW9ucylcbiAgICB9XG5cbiAgICBwYXJzZUFsbCAocmVjdXJzaXZlID0gdHJ1ZSkge1xuICAgICAgdmFyIGNtZCwgcGFyc2VyLCBwb3MsIHJlc1xuXG4gICAgICBpZiAodGhpcy5uZXN0ZWQgPiAxMDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvbicpXG4gICAgICB9XG5cbiAgICAgIHBvcyA9IDBcblxuICAgICAgd2hpbGUgKGNtZCA9IHRoaXMubmV4dENtZChwb3MpKSB7XG4gICAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKVxuICAgICAgICB0aGlzLmVkaXRvci5zZXRDdXJzb3JQb3MocG9zKSAvLyBjb25zb2xlLmxvZyhjbWQpXG5cbiAgICAgICAgY21kLmluaXQoKVxuXG4gICAgICAgIGlmIChyZWN1cnNpdmUgJiYgY21kLmNvbnRlbnQgIT0gbnVsbCAmJiAoY21kLmdldENtZCgpID09IG51bGwgfHwgIWNtZC5nZXRPcHRpb24oJ3ByZXZlbnRQYXJzZUFsbCcpKSkge1xuICAgICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcihjbWQuY29udGVudCksIHtcbiAgICAgICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgICAgIH0pXG4gICAgICAgICAgY21kLmNvbnRlbnQgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzID0gY21kLmV4ZWN1dGUoKVxuXG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIGlmIChyZXMudGhlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzeW5jIG5lc3RlZCBjb21tYW5kcyBhcmUgbm90IHN1cHBvcnRlZCcpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNtZC5yZXBsYWNlRW5kICE9IG51bGwpIHtcbiAgICAgICAgICAgIHBvcyA9IGNtZC5yZXBsYWNlRW5kXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZXRUZXh0KClcbiAgICB9XG5cbiAgICBnZXRUZXh0ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0KClcbiAgICB9XG5cbiAgICBpc1Jvb3QgKCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50ID09IG51bGwgJiYgKHRoaXMuaW5JbnN0YW5jZSA9PSBudWxsIHx8IHRoaXMuaW5JbnN0YW5jZS5maW5kZXIgPT0gbnVsbClcbiAgICB9XG5cbiAgICBnZXRSb290ICgpIHtcbiAgICAgIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldEZpbGVTeXN0ZW0gKCkge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmZpbGVTeXN0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbGVTeXN0ZW1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRSb290KClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVDYXJyZXQgKHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodHh0LCB0aGlzLmNhcnJldENoYXIpXG4gICAgfVxuXG4gICAgZ2V0Q2FycmV0UG9zICh0eHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCwgdGhpcy5jYXJyZXRDaGFyKVxuICAgIH1cblxuICAgIHJlZ01hcmtlciAoZmxhZ3MgPSAnZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5tYXJrZXIpLCBmbGFncylcbiAgICB9XG5cbiAgICByZW1vdmVNYXJrZXJzICh0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHRoaXMucmVnTWFya2VyKCksICcnKVxuICAgIH1cblxuICAgIHN0YXRpYyBpbml0ICgpIHtcbiAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlXG5cbiAgICAgICAgQ29tbWFuZC5pbml0Q21kcygpXG5cbiAgICAgICAgcmV0dXJuIENvbW1hbmQubG9hZENtZHMoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIDtcbiAgQ29kZXdhdmUuaW5pdGVkID0gZmFsc2VcbiAgcmV0dXJuIENvZGV3YXZlXG59LmNhbGwobnVsbCkpXG5cbmV4cG9ydHMuQ29kZXdhdmUgPSBDb2Rld2F2ZVxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBTdG9yYWdlID0gcmVxdWlyZSgnLi9TdG9yYWdlJykuU3RvcmFnZVxuXG5jb25zdCBOYW1lc3BhY2VIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJykuTmFtZXNwYWNlSGVscGVyXG5cbnZhciBfb3B0S2V5XG5cbl9vcHRLZXkgPSBmdW5jdGlvbiAoa2V5LCBkaWN0LCBkZWZWYWwgPSBudWxsKSB7XG4gIC8vIG9wdGlvbmFsIERpY3Rpb25hcnkga2V5XG4gIGlmIChrZXkgaW4gZGljdCkge1xuICAgIHJldHVybiBkaWN0W2tleV1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGVmVmFsXG4gIH1cbn1cblxudmFyIENvbW1hbmQgPSAoZnVuY3Rpb24gKCkge1xuICBjbGFzcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZTEsIGRhdGExID0gbnVsbCwgcGFyZW50ID0gbnVsbCkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTFcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGExXG4gICAgICB0aGlzLmNtZHMgPSBbXVxuICAgICAgdGhpcy5kZXRlY3RvcnMgPSBbXVxuICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSB0aGlzLnJlc3VsdEZ1bmN0ID0gdGhpcy5yZXN1bHRTdHIgPSB0aGlzLmFsaWFzT2YgPSB0aGlzLmNscyA9IG51bGxcbiAgICAgIHRoaXMuYWxpYXNlZCA9IG51bGxcbiAgICAgIHRoaXMuZnVsbE5hbWUgPSB0aGlzLm5hbWVcbiAgICAgIHRoaXMuZGVwdGggPSAwO1xuICAgICAgW3RoaXMuX3BhcmVudCwgdGhpcy5faW5pdGVkXSA9IFtudWxsLCBmYWxzZV1cbiAgICAgIHRoaXMuc2V0UGFyZW50KHBhcmVudClcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSB7fVxuICAgICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgICBwYXJzZTogZmFsc2UsXG4gICAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgICByZXBsYWNlQm94OiBmYWxzZSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBudWxsXG4gICAgICB9XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fVxuICAgICAgdGhpcy5maW5hbE9wdGlvbnMgPSBudWxsXG4gICAgfVxuXG4gICAgcGFyZW50ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnRcbiAgICB9XG5cbiAgICBzZXRQYXJlbnQgKHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5fcGFyZW50ICE9PSB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSB2YWx1ZVxuICAgICAgICB0aGlzLmZ1bGxOYW1lID0gdGhpcy5fcGFyZW50ICE9IG51bGwgJiYgdGhpcy5fcGFyZW50Lm5hbWUgIT0gbnVsbCA/IHRoaXMuX3BhcmVudC5mdWxsTmFtZSArICc6JyArIHRoaXMubmFtZSA6IHRoaXMubmFtZVxuICAgICAgICByZXR1cm4gdGhpcy5kZXB0aCA9IHRoaXMuX3BhcmVudCAhPSBudWxsICYmIHRoaXMuX3BhcmVudC5kZXB0aCAhPSBudWxsID8gdGhpcy5fcGFyZW50LmRlcHRoICsgMSA6IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0ICgpIHtcbiAgICAgIGlmICghdGhpcy5faW5pdGVkKSB7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IHRydWVcbiAgICAgICAgdGhpcy5wYXJzZURhdGEodGhpcy5kYXRhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXIgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5yZW1vdmVDbWQodGhpcylcbiAgICB9XG5cbiAgICBpc0VkaXRhYmxlICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFN0ciAhPSBudWxsIHx8IHRoaXMuYWxpYXNPZiAhPSBudWxsXG4gICAgfVxuXG4gICAgaXNFeGVjdXRhYmxlICgpIHtcbiAgICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZlxuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpXG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgICB9XG5cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0JywgJ2NscycsICdleGVjdXRlRnVuY3QnXVxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHJlZltqXVxuXG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZVdpdGhOYW1lIChuYW1lKSB7XG4gICAgICB2YXIgYWxpYXNPZiwgYWxpYXNlZCwgY29udGV4dFxuXG4gICAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgICAgYWxpYXNPZiA9IHRoaXMuYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBuYW1lKVxuICAgICAgICBhbGlhc2VkID0gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpXG5cbiAgICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmlzRXhlY3V0YWJsZSgpXG4gICAgfVxuXG4gICAgcmVzdWx0SXNBdmFpbGFibGUgKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmXG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKClcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICB9XG5cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0J11cblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal1cblxuICAgICAgICBpZiAodGhpc1twXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBnZXREZWZhdWx0cyAoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgcmVzXG4gICAgICByZXMgPSB7fVxuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpXG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSlcbiAgICAgIH1cblxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuZGVmYXVsdHMpXG4gICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgX2FsaWFzZWRGcm9tRmluZGVyIChmaW5kZXIpIHtcbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2VcbiAgICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkICgpIHtcbiAgICAgIHZhciBjb250ZXh0XG5cbiAgICAgIGlmICh0aGlzLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgICByZXR1cm4gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIodGhpcy5hbGlhc09mKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkT3JUaGlzICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEFsaWFzZWQoKSB8fCB0aGlzXG4gICAgfVxuXG4gICAgc2V0T3B0aW9ucyAoZGF0YSkge1xuICAgICAgdmFyIGtleSwgcmVzdWx0cywgdmFsXG4gICAgICByZXN1bHRzID0gW11cblxuICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgICB2YWwgPSBkYXRhW2tleV1cblxuICAgICAgICBpZiAoa2V5IGluIHRoaXMuZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5vcHRpb25zW2tleV0gPSB2YWwpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG51bGwpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cbiAgICBfb3B0aW9uc0ZvckFsaWFzZWQgKGFsaWFzZWQpIHtcbiAgICAgIHZhciBvcHRcbiAgICAgIG9wdCA9IHt9XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5kZWZhdWx0T3B0aW9ucylcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgYWxpYXNlZC5nZXRPcHRpb25zKCkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5vcHRpb25zKVxuICAgIH1cblxuICAgIGdldE9wdGlvbnMgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKVxuICAgIH1cblxuICAgIGdldE9wdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpXG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gICAgICB9XG4gICAgfVxuXG4gICAgaGVscCAoKSB7XG4gICAgICB2YXIgY21kXG4gICAgICBjbWQgPSB0aGlzLmdldENtZCgnaGVscCcpXG5cbiAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZURhdGEgKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGFcblxuICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IGRhdGFcbiAgICAgICAgdGhpcy5vcHRpb25zLnBhcnNlID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBlbHNlIGlmIChkYXRhICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEaWN0RGF0YShkYXRhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBwYXJzZURpY3REYXRhIChkYXRhKSB7XG4gICAgICB2YXIgZXhlY3V0ZSwgcmVzXG4gICAgICByZXMgPSBfb3B0S2V5KCdyZXN1bHQnLCBkYXRhKVxuXG4gICAgICBpZiAodHlwZW9mIHJlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnJlc3VsdEZ1bmN0ID0gcmVzXG4gICAgICB9IGVsc2UgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gcmVzXG4gICAgICAgIHRoaXMub3B0aW9ucy5wYXJzZSA9IHRydWVcbiAgICAgIH1cblxuICAgICAgZXhlY3V0ZSA9IF9vcHRLZXkoJ2V4ZWN1dGUnLCBkYXRhKVxuXG4gICAgICBpZiAodHlwZW9mIGV4ZWN1dGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSBleGVjdXRlXG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLCBkYXRhKVxuICAgICAgdGhpcy5jbHMgPSBfb3B0S2V5KCdjbHMnLCBkYXRhKVxuICAgICAgdGhpcy5kZWZhdWx0cyA9IF9vcHRLZXkoJ2RlZmF1bHRzJywgZGF0YSwgdGhpcy5kZWZhdWx0cylcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhkYXRhKVxuXG4gICAgICBpZiAoJ2hlbHAnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLCBkYXRhLmhlbHAsIHRoaXMpKVxuICAgICAgfVxuXG4gICAgICBpZiAoJ2ZhbGxiYWNrJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKCdmYWxsYmFjaycsIGRhdGEuZmFsbGJhY2ssIHRoaXMpKVxuICAgICAgfVxuXG4gICAgICBpZiAoJ2NtZHMnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWRzKGRhdGEuY21kcylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBhZGRDbWRzIChjbWRzKSB7XG4gICAgICB2YXIgZGF0YSwgbmFtZSwgcmVzdWx0c1xuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIGZvciAobmFtZSBpbiBjbWRzKSB7XG4gICAgICAgIGRhdGEgPSBjbWRzW25hbWVdXG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZENtZChuZXcgQ29tbWFuZChuYW1lLCBkYXRhLCB0aGlzKSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG4gICAgYWRkQ21kIChjbWQpIHtcbiAgICAgIHZhciBleGlzdHNcbiAgICAgIGV4aXN0cyA9IHRoaXMuZ2V0Q21kKGNtZC5uYW1lKVxuXG4gICAgICBpZiAoZXhpc3RzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbWQoZXhpc3RzKVxuICAgICAgfVxuXG4gICAgICBjbWQuc2V0UGFyZW50KHRoaXMpXG4gICAgICB0aGlzLmNtZHMucHVzaChjbWQpXG4gICAgICByZXR1cm4gY21kXG4gICAgfVxuXG4gICAgcmVtb3ZlQ21kIChjbWQpIHtcbiAgICAgIHZhciBpXG5cbiAgICAgIGlmICgoaSA9IHRoaXMuY21kcy5pbmRleE9mKGNtZCkpID4gLTEpIHtcbiAgICAgICAgdGhpcy5jbWRzLnNwbGljZShpLCAxKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY21kXG4gICAgfVxuXG4gICAgZ2V0Q21kIChmdWxsbmFtZSkge1xuICAgICAgdmFyIGNtZCwgaiwgbGVuLCBuYW1lLCByZWYsIHJlZjEsIHNwYWNlXG4gICAgICB0aGlzLmluaXQoKTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSlcblxuICAgICAgaWYgKHNwYWNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIChyZWYgPSB0aGlzLmdldENtZChzcGFjZSkpICE9IG51bGwgPyByZWYuZ2V0Q21kKG5hbWUpIDogbnVsbFxuICAgICAgfVxuXG4gICAgICByZWYxID0gdGhpcy5jbWRzXG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgY21kID0gcmVmMVtqXVxuXG4gICAgICAgIGlmIChjbWQubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldENtZERhdGEgKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRDbWQoZnVsbG5hbWUsIG5ldyBDb21tYW5kKGZ1bGxuYW1lLnNwbGl0KCc6JykucG9wKCksIGRhdGEpKVxuICAgIH1cblxuICAgIHNldENtZCAoZnVsbG5hbWUsIGNtZCkge1xuICAgICAgdmFyIG5hbWUsIG5leHQsIHNwYWNlO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuXG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgICBuZXh0ID0gdGhpcy5nZXRDbWQoc3BhY2UpXG5cbiAgICAgICAgaWYgKG5leHQgPT0gbnVsbCkge1xuICAgICAgICAgIG5leHQgPSB0aGlzLmFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSwgY21kKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hZGRDbWQoY21kKVxuICAgICAgICByZXR1cm4gY21kXG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkRGV0ZWN0b3IgKGRldGVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXRlY3RvcnMucHVzaChkZXRlY3RvcilcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdENtZHMgKCkge1xuICAgICAgdmFyIGosIGxlbiwgcHJvdmlkZXIsIHJlZiwgcmVzdWx0c1xuICAgICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCwge1xuICAgICAgICBjbWRzOiB7XG4gICAgICAgICAgaGVsbG86IHtcbiAgICAgICAgICAgIGhlbHA6ICdcIkhlbGxvLCB3b3JsZCFcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxcbm1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xcbnZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYScsXG4gICAgICAgICAgICByZXN1bHQ6ICdIZWxsbywgV29ybGQhJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJlZiA9IHRoaXMucHJvdmlkZXJzXG4gICAgICByZXN1bHRzID0gW11cblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHByb3ZpZGVyID0gcmVmW2pdXG4gICAgICAgIHJlc3VsdHMucHVzaChwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuICAgIHN0YXRpYyBzYXZlQ21kIChmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpXG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlSW5QYXRoKCdjbWRzJywgZnVsbG5hbWUsIGRhdGEpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBsb2FkQ21kcyAoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBzYXZlZENtZHNcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHRoaXMuc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAgIH0pLnRoZW4oc2F2ZWRDbWRzID0+IHtcbiAgICAgICAgdmFyIGRhdGEsIGZ1bGxuYW1lLCByZXN1bHRzXG5cbiAgICAgICAgaWYgKHNhdmVkQ21kcyAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgICAgICBmb3IgKGZ1bGxuYW1lIGluIHNhdmVkQ21kcykge1xuICAgICAgICAgICAgZGF0YSA9IHNhdmVkQ21kc1tmdWxsbmFtZV1cbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSkpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXRTYXZlZCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNhdmUoJ2NtZHMnLCB7fSlcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZVZhckNtZCAobmFtZSwgYmFzZSA9IHt9KSB7XG4gICAgICBiYXNlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHAsIHZhbFxuICAgICAgICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogbnVsbFxuXG4gICAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdmFsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJhc2VcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZUJvb2xWYXJDbWQgKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBwLCB2YWxcbiAgICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IG51bGxcblxuICAgICAgICBpZiAoISh2YWwgIT0gbnVsbCAmJiAodmFsID09PSAnMCcgfHwgdmFsID09PSAnZmFsc2UnIHx8IHZhbCA9PT0gJ25vJykpKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJhc2VcbiAgICB9XG4gIH1cblxuICA7XG4gIENvbW1hbmQucHJvdmlkZXJzID0gW11cbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICByZXR1cm4gQ29tbWFuZFxufS5jYWxsKG51bGwpKVxuXG5leHBvcnRzLkNvbW1hbmQgPSBDb21tYW5kXG52YXIgQmFzZUNvbW1hbmQgPSBjbGFzcyBCYXNlQ29tbWFuZCB7XG4gIGNvbnN0cnVjdG9yIChpbnN0YW5jZTEpIHtcbiAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2UxXG4gIH1cblxuICBpbml0ICgpIHt9XG5cbiAgcmVzdWx0SXNBdmFpbGFibGUgKCkge1xuICAgIHJldHVybiB0aGlzLnJlc3VsdCAhPSBudWxsXG4gIH1cblxuICBnZXREZWZhdWx0cyAoKSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cblxuICBnZXRPcHRpb25zICgpIHtcbiAgICByZXR1cm4ge31cbiAgfVxufVxuZXhwb3J0cy5CYXNlQ29tbWFuZCA9IEJhc2VDb21tYW5kXG4iLCJjb25zdCBBcnJheUhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9BcnJheUhlbHBlcicpLkFycmF5SGVscGVyXG5cbnZhciBpbmRleE9mID0gW10uaW5kZXhPZlxudmFyIENvbnRleHQgPSBjbGFzcyBDb250ZXh0IHtcbiAgY29uc3RydWN0b3IgKGNvZGV3YXZlKSB7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlXG4gICAgdGhpcy5uYW1lU3BhY2VzID0gW11cbiAgfVxuXG4gIGFkZE5hbWVTcGFjZSAobmFtZSkge1xuICAgIGlmIChpbmRleE9mLmNhbGwodGhpcy5uYW1lU3BhY2VzLCBuYW1lKSA8IDApIHtcbiAgICAgIHRoaXMubmFtZVNwYWNlcy5wdXNoKG5hbWUpXG4gICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcyA9IG51bGxcbiAgICB9XG4gIH1cblxuICBhZGROYW1lc3BhY2VzIChzcGFjZXMpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzLCBzcGFjZVxuXG4gICAgaWYgKHNwYWNlcykge1xuICAgICAgaWYgKHR5cGVvZiBzcGFjZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNwYWNlcyA9IFtzcGFjZXNdXG4gICAgICB9XG5cbiAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBzcGFjZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgc3BhY2UgPSBzcGFjZXNbal1cbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuYWRkTmFtZVNwYWNlKHNwYWNlKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG4gIH1cblxuICByZW1vdmVOYW1lU3BhY2UgKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lU3BhY2VzID0gdGhpcy5uYW1lU3BhY2VzLmZpbHRlcihmdW5jdGlvbiAobikge1xuICAgICAgcmV0dXJuIG4gIT09IG5hbWVcbiAgICB9KVxuICB9XG5cbiAgZ2V0TmFtZVNwYWNlcyAoKSB7XG4gICAgdmFyIG5wY3NcblxuICAgIGlmICh0aGlzLl9uYW1lc3BhY2VzID09IG51bGwpIHtcbiAgICAgIG5wY3MgPSB0aGlzLm5hbWVTcGFjZXNcblxuICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KHRoaXMucGFyZW50LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLnVuaXF1ZShucGNzKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2VzXG4gIH1cblxuICBnZXRDbWQgKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBmaW5kZXJcbiAgICBmaW5kZXIgPSB0aGlzLmdldEZpbmRlcihjbWROYW1lLCBvcHRpb25zKVxuICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIH1cblxuICBnZXRGaW5kZXIgKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgQ29udGV4dC5jbWRGaW5kZXJDbGFzcyhjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0aGlzLmlzUm9vdCgpLFxuICAgICAgY29kZXdhdmU6IHRoaXMuY29kZXdhdmUsXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSwgb3B0aW9ucykpXG4gIH1cblxuICBpc1Jvb3QgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9PSBudWxsXG4gIH1cblxuICBnZXRQYXJlbnRPclJvb3QgKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudCAoc3RyKSB7XG4gICAgdmFyIGNjXG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKClcblxuICAgIGlmIChjYy5pbmRleE9mKCclcycpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsIHN0cilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudExlZnQgKHN0ciA9ICcnKSB7XG4gICAgdmFyIGNjLCBpXG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKClcblxuICAgIGlmICgoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5zdWJzdHIoMCwgaSkgKyBzdHJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnRSaWdodCAoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGlcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKVxuXG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIHN0ciArIGNjLnN1YnN0cihpICsgMilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0ciArICcgJyArIGNjXG4gICAgfVxuICB9XG5cbiAgY21kSW5zdGFuY2VGb3IgKGNtZCkge1xuICAgIHJldHVybiBuZXcgQ29udGV4dC5jbWRJbnN0YW5jZUNsYXNzKGNtZCwgdGhpcylcbiAgfVxuXG4gIGdldENvbW1lbnRDaGFyICgpIHtcbiAgICB2YXIgY2hhciwgY21kLCBpbnN0LCByZXNcblxuICAgIGlmICh0aGlzLmNvbW1lbnRDaGFyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbW1lbnRDaGFyXG4gICAgfVxuXG4gICAgY21kID0gdGhpcy5nZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGluc3QgPSB0aGlzLmNtZEluc3RhbmNlRm9yKGNtZClcbiAgICAgIGluc3QuY29udGVudCA9ICclcydcbiAgICAgIHJlcyA9IGluc3QucmVzdWx0KClcblxuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbW1lbnRDaGFyID0gY2hhclxuICAgIHJldHVybiB0aGlzLmNvbW1lbnRDaGFyXG4gIH1cbn1cbmV4cG9ydHMuQ29udGV4dCA9IENvbnRleHRcbiIsIlxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpLkNvbW1hbmRcblxudmFyIEVkaXRDbWRQcm9wID0gY2xhc3MgRWRpdENtZFByb3Age1xuICBjb25zdHJ1Y3RvciAobmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywgaSwga2V5LCBsZW4sIHJlZiwgdmFsXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgdmFyOiBudWxsLFxuICAgICAgb3B0OiBudWxsLFxuICAgICAgZnVuY3Q6IG51bGwsXG4gICAgICBkYXRhTmFtZTogbnVsbCxcbiAgICAgIHNob3dFbXB0eTogZmFsc2UsXG4gICAgICBjYXJyZXQ6IGZhbHNlXG4gICAgfVxuICAgIHJlZiA9IFsndmFyJywgJ29wdCcsICdmdW5jdCddXG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGtleSA9IHJlZltpXVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgZGVmYXVsdHMuZGF0YU5hbWUgPSBvcHRpb25zW2tleV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRDbWQgKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSlcbiAgfVxuXG4gIHdyaXRlRm9yIChwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSBwYXJzZXIudmFyc1t0aGlzLm5hbWVdXG4gICAgfVxuICB9XG5cbiAgdmFsRnJvbUNtZCAoY21kKSB7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5vcHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmdldE9wdGlvbih0aGlzLm9wdClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kW3RoaXMuZnVuY3RdKClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudmFyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLnZhcl1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzaG93Rm9yQ21kIChjbWQpIHtcbiAgICB2YXIgdmFsXG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgfHwgdmFsICE9IG51bGxcbiAgfVxuXG4gIGRpc3BsYXkgKGNtZCkge1xuICAgIGlmICh0aGlzLnNob3dGb3JDbWQoY21kKSkge1xuICAgICAgcmV0dXJuIGB+fiR7dGhpcy5uYW1lfX5+XFxuJHt0aGlzLnZhbEZyb21DbWQoY21kKSB8fCAnJ30ke3RoaXMuY2FycmV0ID8gJ3wnIDogJyd9XFxufn4vJHt0aGlzLm5hbWV9fn5gXG4gICAgfVxuICB9XG59XG5leHBvcnRzLkVkaXRDbWRQcm9wID0gRWRpdENtZFByb3BcbkVkaXRDbWRQcm9wLnNvdXJjZSA9IGNsYXNzIHNvdXJjZSBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgdmFsRnJvbUNtZCAoY21kKSB7XG4gICAgdmFyIHJlc1xuICAgIHJlcyA9IHN1cGVyLnZhbEZyb21DbWQoY21kKVxuXG4gICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICByZXMgPSByZXMucmVwbGFjZSgvXFx8L2csICd8fCcpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc1xuICB9XG5cbiAgc2V0Q21kIChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZCh0aGlzLm5hbWUsIHtcbiAgICAgIHByZXZlbnRQYXJzZUFsbDogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBzaG93Rm9yQ21kIChjbWQpIHtcbiAgICB2YXIgdmFsXG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgJiYgIShjbWQgIT0gbnVsbCAmJiBjbWQuYWxpYXNPZiAhPSBudWxsKSB8fCB2YWwgIT0gbnVsbFxuICB9XG59XG5FZGl0Q21kUHJvcC5zdHJpbmcgPSBjbGFzcyBzdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIGRpc3BsYXkgKGNtZCkge1xuICAgIGlmICh0aGlzLnZhbEZyb21DbWQoY21kKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfSAnJHt0aGlzLnZhbEZyb21DbWQoY21kKX0ke3RoaXMuY2FycmV0ID8gJ3wnIDogJyd9J35+YFxuICAgIH1cbiAgfVxufVxuRWRpdENtZFByb3AucmV2Qm9vbCA9IGNsYXNzIHJldkJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHNldENtZCAoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSlcbiAgfVxuXG4gIHdyaXRlRm9yIChwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbdGhpcy5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXkgKGNtZCkge1xuICAgIHZhciB2YWxcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKVxuXG4gICAgaWYgKHZhbCAhPSBudWxsICYmICF2YWwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gXG4gICAgfVxuICB9XG59XG5FZGl0Q21kUHJvcC5ib29sID0gY2xhc3MgYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kIChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQodGhpcy5uYW1lKVxuICB9XG5cbiAgZGlzcGxheSAoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfX5+YFxuICAgIH1cbiAgfVxufVxuIiwiXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG5jb25zdCBTdHJQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1N0clBvcycpLlN0clBvc1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKCcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJylcblxudmFyIEVkaXRvciA9IGNsYXNzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG51bGxcbiAgICB0aGlzLl9sYW5nID0gbnVsbFxuICB9XG5cbiAgYmluZGVkVG8gKGNvZGV3YXZlKSB7fVxuXG4gIHRleHQgKHZhbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHRleHRDaGFyQXQgKHBvcykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHRleHRMZW4gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHRleHRTdWJzdHIgKHN0YXJ0LCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBpbnNlcnRUZXh0QXQgKHRleHQsIHBvcykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHNwbGljZVRleHQgKHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBnZXRDdXJzb3JQb3MgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHNldEN1cnNvclBvcyAoc3RhcnQsIGVuZCA9IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBiZWdpblVuZG9BY3Rpb24gKCkge31cblxuICBlbmRVbmRvQWN0aW9uICgpIHt9XG5cbiAgZ2V0TGFuZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhbmdcbiAgfVxuXG4gIHNldExhbmcgKHZhbCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nID0gdmFsXG4gIH1cblxuICBnZXRFbW1ldENvbnRleHRPYmplY3QgKCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBhbGxvd011bHRpU2VsZWN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHNldE11bHRpU2VsIChzZWxlY3Rpb25zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgZ2V0TXVsdGlTZWwgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIGNhbkxpc3RlblRvQ2hhbmdlICgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIGdldExpbmVBdCAocG9zKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5maW5kTGluZVN0YXJ0KHBvcyksIHRoaXMuZmluZExpbmVFbmQocG9zKSlcbiAgfVxuXG4gIGZpbmRMaW5lU3RhcnQgKHBvcykge1xuICAgIHZhciBwXG4gICAgcCA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbJ1xcbiddLCAtMSlcblxuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3MgKyAxXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwXG4gICAgfVxuICB9XG5cbiAgZmluZExpbmVFbmQgKHBvcykge1xuICAgIHZhciBwXG4gICAgcCA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbJ1xcbicsICdcXHInXSlcblxuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3NcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dExlbigpXG4gICAgfVxuICB9XG5cbiAgZmluZEFueU5leHQgKHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgdmFyIGJlc3RQb3MsIGJlc3RTdHIsIGksIGxlbiwgcG9zLCBzdHJpLCB0ZXh0XG5cbiAgICBpZiAoZGlyZWN0aW9uID4gMCkge1xuICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihzdGFydCwgdGhpcy50ZXh0TGVuKCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoMCwgc3RhcnQpXG4gICAgfVxuXG4gICAgYmVzdFBvcyA9IG51bGxcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHN0cmluZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0cmkgPSBzdHJpbmdzW2ldXG4gICAgICBwb3MgPSBkaXJlY3Rpb24gPiAwID8gdGV4dC5pbmRleE9mKHN0cmkpIDogdGV4dC5sYXN0SW5kZXhPZihzdHJpKVxuXG4gICAgICBpZiAocG9zICE9PSAtMSkge1xuICAgICAgICBpZiAoYmVzdFBvcyA9PSBudWxsIHx8IGJlc3RQb3MgKiBkaXJlY3Rpb24gPiBwb3MgKiBkaXJlY3Rpb24pIHtcbiAgICAgICAgICBiZXN0UG9zID0gcG9zXG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChiZXN0U3RyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3RyUG9zKGRpcmVjdGlvbiA+IDAgPyBiZXN0UG9zICsgc3RhcnQgOiBiZXN0UG9zLCBiZXN0U3RyKVxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50cyAocmVwbGFjZW1lbnRzKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VtZW50cy5yZWR1Y2UoKHByb21pc2UsIHJlcGwpID0+IHtcbiAgICAgIHJldHVybiBwcm9taXNlLnRoZW4ob3B0ID0+IHtcbiAgICAgICAgcmVwbC53aXRoRWRpdG9yKHRoaXMpXG4gICAgICAgIHJlcGwuYXBwbHlPZmZzZXQob3B0Lm9mZnNldClcbiAgICAgICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKShyZXBsLmFwcGx5KCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZWxlY3Rpb25zOiBvcHQuc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKSxcbiAgICAgICAgICAgIG9mZnNldDogb3B0Lm9mZnNldCArIHJlcGwub2Zmc2V0QWZ0ZXIodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh7XG4gICAgICBzZWxlY3Rpb25zOiBbXSxcbiAgICAgIG9mZnNldDogMFxuICAgIH0pKS50aGVuKG9wdCA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMob3B0LnNlbGVjdGlvbnMpXG4gICAgfSkucmVzdWx0KClcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyAoc2VsZWN0aW9ucykge1xuICAgIGlmIChzZWxlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0aGlzLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRNdWx0aVNlbChzZWxlY3Rpb25zKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q3Vyc29yUG9zKHNlbGVjdGlvbnNbMF0uc3RhcnQsIHNlbGVjdGlvbnNbMF0uZW5kKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5FZGl0b3IgPSBFZGl0b3JcbiIsIlxudmFyIExvZ2dlciA9IChmdW5jdGlvbiAoKSB7XG4gIGNsYXNzIExvZ2dlciB7XG4gICAgbG9nICguLi5hcmdzKSB7XG4gICAgICB2YXIgaSwgbGVuLCBtc2csIHJlc3VsdHNcblxuICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIG1zZyA9IGFyZ3NbaV1cbiAgICAgICAgICByZXN1bHRzLnB1c2goY29uc29sZS5sb2cobXNnKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9XG4gICAgfVxuXG4gICAgaXNFbmFibGVkICgpIHtcbiAgICAgIHJldHVybiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUgIT09IG51bGwgPyBjb25zb2xlLmxvZyA6IG51bGwpICE9IG51bGwgJiYgdGhpcy5lbmFibGVkICYmIExvZ2dlci5lbmFibGVkXG4gICAgfVxuXG4gICAgcnVudGltZSAoZnVuY3QsIG5hbWUgPSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDFcbiAgICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICAgIHJlcyA9IGZ1bmN0KClcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICAgIGNvbnNvbGUubG9nKGAke25hbWV9IHRvb2sgJHt0MSAtIHQwfSBtaWxsaXNlY29uZHMuYClcbiAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICB0b01vbml0b3IgKG9iaiwgbmFtZSwgcHJlZml4ID0gJycpIHtcbiAgICAgIHZhciBmdW5jdFxuICAgICAgZnVuY3QgPSBvYmpbbmFtZV1cbiAgICAgIHJldHVybiBvYmpbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICAgICAgcmV0dXJuIHRoaXMubW9uaXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0LmFwcGx5KG9iaiwgYXJncylcbiAgICAgICAgfSwgcHJlZml4ICsgbmFtZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtb25pdG9yIChmdW5jdCwgbmFtZSkge1xuICAgICAgdmFyIHJlcywgdDAsIHQxXG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgICByZXMgPSBmdW5jdCgpXG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG5cbiAgICAgIGlmICh0aGlzLm1vbml0b3JEYXRhW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS5jb3VudCsrXG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwgKz0gdDEgLSB0MFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICByZXN1bWUgKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpXG4gICAgfVxuICB9XG5cbiAgO1xuICBMb2dnZXIuZW5hYmxlZCA9IHRydWVcbiAgTG9nZ2VyLnByb3RvdHlwZS5lbmFibGVkID0gdHJ1ZVxuICBMb2dnZXIucHJvdG90eXBlLm1vbml0b3JEYXRhID0ge31cbiAgcmV0dXJuIExvZ2dlclxufS5jYWxsKG51bGwpKVxuXG5leHBvcnRzLkxvZ2dlciA9IExvZ2dlclxuIiwiXG52YXIgT3B0aW9uT2JqZWN0ID0gY2xhc3MgT3B0aW9uT2JqZWN0IHtcbiAgc2V0T3B0cyAob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIga2V5LCByZWYsIHJlc3VsdHMsIHZhbFxuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHNcbiAgICByZXN1bHRzID0gW11cblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV1cblxuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIG9wdGlvbnNba2V5XSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCB2YWwpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cblxuICBzZXRPcHQgKGtleSwgdmFsKSB7XG4gICAgdmFyIHJlZlxuXG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiBudWxsKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKHZhbClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSA9IHZhbFxuICAgIH1cbiAgfVxuXG4gIGdldE9wdCAoa2V5KSB7XG4gICAgdmFyIHJlZlxuXG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiBudWxsKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XVxuICAgIH1cbiAgfVxuXG4gIGdldE9wdHMgKCkge1xuICAgIHZhciBrZXksIG9wdHMsIHJlZiwgdmFsXG4gICAgb3B0cyA9IHt9XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0c1xuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XVxuICAgICAgb3B0c1trZXldID0gdGhpcy5nZXRPcHQoa2V5KVxuICAgIH1cblxuICAgIHJldHVybiBvcHRzXG4gIH1cbn1cbmV4cG9ydHMuT3B0aW9uT2JqZWN0ID0gT3B0aW9uT2JqZWN0XG4iLCJcbmNvbnN0IENtZEluc3RhbmNlID0gcmVxdWlyZSgnLi9DbWRJbnN0YW5jZScpLkNtZEluc3RhbmNlXG5cbmNvbnN0IEJveEhlbHBlciA9IHJlcXVpcmUoJy4vQm94SGVscGVyJykuQm94SGVscGVyXG5cbmNvbnN0IFBhcmFtUGFyc2VyID0gcmVxdWlyZSgnLi9zdHJpbmdQYXJzZXJzL1BhcmFtUGFyc2VyJykuUGFyYW1QYXJzZXJcblxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3MnKS5Qb3NcblxuY29uc3QgU3RyUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9TdHJQb3MnKS5TdHJQb3NcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBOYW1lc3BhY2VIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJykuTmFtZXNwYWNlSGVscGVyXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuL0NvbW1hbmQnKS5Db21tYW5kXG5cbmNvbnN0IE9wdGlvbmFsUHJvbWlzZSA9IHJlcXVpcmUoJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnKVxuXG52YXIgUG9zaXRpb25lZENtZEluc3RhbmNlID0gY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3RvciAoY29kZXdhdmUsIHBvczEsIHN0cjEpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlXG4gICAgdGhpcy5wb3MgPSBwb3MxXG4gICAgdGhpcy5zdHIgPSBzdHIxXG5cbiAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aGlzLl9jaGVja0Nsb3NlcigpXG5cbiAgICAgIHRoaXMub3BlbmluZyA9IHRoaXMuc3RyXG4gICAgICB0aGlzLm5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpXG5cbiAgICAgIHRoaXMuX3NwbGl0Q29tcG9uZW50cygpXG5cbiAgICAgIHRoaXMuX2ZpbmRDbG9zaW5nKClcblxuICAgICAgdGhpcy5fY2hlY2tFbG9uZ2F0ZWQoKVxuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Nsb3NlciAoKSB7XG4gICAgdmFyIGYsIG5vQnJhY2tldFxuICAgIG5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpXG5cbiAgICBpZiAobm9CcmFja2V0LnN1YnN0cmluZygwLCB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciAmJiAoZiA9IHRoaXMuX2ZpbmRPcGVuaW5nUG9zKCkpKSB7XG4gICAgICB0aGlzLmNsb3NpbmdQb3MgPSBuZXcgU3RyUG9zKHRoaXMucG9zLCB0aGlzLnN0cilcbiAgICAgIHRoaXMucG9zID0gZi5wb3NcbiAgICAgIHRoaXMuc3RyID0gZi5zdHJcbiAgICB9XG4gIH1cblxuICBfZmluZE9wZW5pbmdQb3MgKCkge1xuICAgIHZhciBjbG9zaW5nLCBjbWROYW1lLCBvcGVuaW5nXG4gICAgY21kTmFtZSA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpXG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWVcbiAgICBjbG9zaW5nID0gdGhpcy5zdHJcblxuICAgIGNvbnN0IGYgPSB0aGlzLmNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIodGhpcy5wb3MsIG9wZW5pbmcsIGNsb3NpbmcsIC0xKVxuICAgIGlmIChmKSB7XG4gICAgICBmLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZi5wb3MsIHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoZi5wb3MgKyBmLnN0ci5sZW5ndGgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgICAgIHJldHVybiBmXG4gICAgfVxuICB9XG5cbiAgX3NwbGl0Q29tcG9uZW50cyAoKSB7XG4gICAgdmFyIHBhcnRzXG4gICAgcGFydHMgPSB0aGlzLm5vQnJhY2tldC5zcGxpdCgnICcpXG4gICAgdGhpcy5jbWROYW1lID0gcGFydHMuc2hpZnQoKVxuICAgIHRoaXMucmF3UGFyYW1zID0gcGFydHMuam9pbignICcpXG4gIH1cblxuICBfcGFyc2VQYXJhbXMgKHBhcmFtcykge1xuICAgIHZhciBuYW1lVG9QYXJhbSwgcGFyc2VyXG4gICAgcGFyc2VyID0gbmV3IFBhcmFtUGFyc2VyKHBhcmFtcywge1xuICAgICAgYWxsb3dlZE5hbWVkOiB0aGlzLmdldE9wdGlvbignYWxsb3dlZE5hbWVkJyksXG4gICAgICB2YXJzOiB0aGlzLmNvZGV3YXZlLnZhcnNcbiAgICB9KVxuICAgIHRoaXMucGFyYW1zID0gcGFyc2VyLnBhcmFtc1xuICAgIHRoaXMubmFtZWQgPSBPYmplY3QuYXNzaWduKHRoaXMuZ2V0RGVmYXVsdHMoKSwgcGFyc2VyLm5hbWVkKVxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIG5hbWVUb1BhcmFtID0gdGhpcy5nZXRPcHRpb24oJ25hbWVUb1BhcmFtJylcblxuICAgICAgaWYgKG5hbWVUb1BhcmFtICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5uYW1lZFtuYW1lVG9QYXJhbV0gPSB0aGlzLmNtZE5hbWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmcgKCkge1xuICAgIGNvbnN0IGYgPSB0aGlzLl9maW5kQ2xvc2luZ1BvcygpXG4gICAgaWYgKGYpIHtcbiAgICAgIHRoaXMuY29udGVudCA9IFN0cmluZ0hlbHBlci50cmltRW1wdHlMaW5lKHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgsIGYucG9zKSlcbiAgICAgIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZi5wb3MgKyBmLnN0ci5sZW5ndGgpXG4gICAgfVxuICB9XG5cbiAgX2ZpbmRDbG9zaW5nUG9zICgpIHtcbiAgICB2YXIgY2xvc2luZywgb3BlbmluZ1xuXG4gICAgaWYgKHRoaXMuY2xvc2luZ1BvcyAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUG9zXG4gICAgfVxuXG4gICAgY2xvc2luZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWROYW1lICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzXG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY21kTmFtZVxuXG4gICAgY29uc3QgZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgb3BlbmluZywgY2xvc2luZylcbiAgICBpZiAoZikge1xuICAgICAgdGhpcy5jbG9zaW5nUG9zID0gZlxuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1Bvc1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Vsb25nYXRlZCAoKSB7XG4gICAgdmFyIGVuZFBvcywgbWF4LCByZWZcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpXG4gICAgbWF4ID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpXG5cbiAgICB3aGlsZSAoZW5kUG9zIDwgbWF4ICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5kZWNvKSB7XG4gICAgICBlbmRQb3MgKz0gdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aFxuICAgIH1cblxuICAgIGlmIChlbmRQb3MgPj0gbWF4IHx8IChyZWYgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkpID09PSAnICcgfHwgcmVmID09PSAnXFxuJyB8fCByZWYgPT09ICdcXHInKSB7XG4gICAgICB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGVuZFBvcylcbiAgICB9XG4gIH1cblxuICBfY2hlY2tCb3ggKCkge1xuICAgIHZhciBjbCwgY3IsIGVuZFBvc1xuXG4gICAgaWYgKHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsICYmIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PT0gJ2NvbW1lbnQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjbCA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKVxuICAgIGNyID0gdGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKVxuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCkgKyBjci5sZW5ndGhcblxuICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zIC0gY2wubGVuZ3RoLCB0aGlzLnBvcykgPT09IGNsICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLCBlbmRQb3MpID09PSBjcikge1xuICAgICAgdGhpcy5wb3MgPSB0aGlzLnBvcyAtIGNsLmxlbmd0aFxuICAgICAgdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBlbmRQb3MpXG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KClcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkuaW5kZXhPZihjbCkgPiAtMSAmJiB0aGlzLmdldFBvcygpLnNhbWVMaW5lc1N1ZmZpeCgpLmluZGV4T2YoY3IpID4gLTEpIHtcbiAgICAgIHRoaXMuaW5Cb3ggPSAxXG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KClcbiAgICB9XG4gIH1cblxuICBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50ICgpIHtcbiAgICB2YXIgZWNsLCBlY3IsIGVkLCByZTEsIHJlMiwgcmUzXG5cbiAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvZGV3YXZlLmRlY28pXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86JHtlZH0pKyR7ZWNyfSRgLCAnZ20nKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXlxcXFxzKig/OiR7ZWR9KSoke2Vjcn1cXHI/XFxuYClcbiAgICAgIHJlMyA9IG5ldyBSZWdFeHAoYFxcblxcXFxzKiR7ZWNsfSg/OiR7ZWR9KSpcXFxccyokYClcbiAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudC5yZXBsYWNlKHJlMSwgJyQxJykucmVwbGFjZShyZTIsICcnKS5yZXBsYWNlKHJlMywgJycpXG4gICAgfVxuICB9XG5cbiAgX2dldFBhcmVudENtZHMgKCkge1xuICAgIHZhciByZWZcbiAgICB0aGlzLnBhcmVudCA9IChyZWYgPSB0aGlzLmNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZCh0aGlzLmdldEVuZFBvcygpKSkgIT0gbnVsbCA/IHJlZi5pbml0KCkgOiBudWxsXG4gICAgcmV0dXJuIHRoaXMucGFyZW50XG4gIH1cblxuICBzZXRNdWx0aVBvcyAobXVsdGlQb3MpIHtcbiAgICB0aGlzLm11bHRpUG9zID0gbXVsdGlQb3NcbiAgfVxuXG4gIF9nZXRDbWRPYmogKCkge1xuICAgIHRoaXMuZ2V0Q21kKClcblxuICAgIHRoaXMuX2NoZWNrQm94KClcblxuICAgIHRoaXMuY29udGVudCA9IHRoaXMucmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGhpcy5jb250ZW50KVxuICAgIHJldHVybiBzdXBlci5fZ2V0Q21kT2JqKClcbiAgfVxuXG4gIF9pbml0UGFyYW1zICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2VQYXJhbXModGhpcy5yYXdQYXJhbXMpXG4gIH1cblxuICBnZXRDb250ZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IHRoaXMuY29kZXdhdmUuY29udGV4dFxuICB9XG5cbiAgZ2V0Q21kICgpIHtcbiAgICBpZiAodGhpcy5jbWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fZ2V0UGFyZW50Q21kcygpXG5cbiAgICAgIGlmICh0aGlzLm5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikge1xuICAgICAgICB0aGlzLmNtZCA9IENvbW1hbmQuY21kcy5nZXRDbWQoJ2NvcmU6bm9fZXhlY3V0ZScpXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY29kZXdhdmUuY29udGV4dFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZmluZGVyLmNvbnRleHRcbiAgICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKClcblxuICAgICAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5jbWQuZnVsbE5hbWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jbWRcbiAgfVxuXG4gIGdldEZpbmRlciAoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXJcbiAgICBmaW5kZXIgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzICgpIHtcbiAgICB2YXIgbnNwY3MsIG9ialxuICAgIG5zcGNzID0gW11cbiAgICBvYmogPSB0aGlzXG5cbiAgICB3aGlsZSAob2JqLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICBvYmogPSBvYmoucGFyZW50XG5cbiAgICAgIGlmIChvYmouY21kICE9IG51bGwgJiYgb2JqLmNtZC5mdWxsTmFtZSAhPSBudWxsKSB7XG4gICAgICAgIG5zcGNzLnB1c2gob2JqLmNtZC5mdWxsTmFtZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnNwY3NcbiAgfVxuXG4gIF9yZW1vdmVCcmFja2V0IChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoLCBzdHIubGVuZ3RoIC0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgfVxuXG4gIGFsdGVyQWxpYXNPZiAoYWxpYXNPZikge1xuICAgIGNvbnN0IGNtZE5hbWUgPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQodGhpcy5jbWROYW1lKVsxXVxuICAgIHJldHVybiBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIGNtZE5hbWUpXG4gIH1cblxuICBpc0VtcHR5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdHIgPT09IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzIHx8IHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHNcbiAgfVxuXG4gIGV4ZWN1dGUgKCkge1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wICE9IG51bGwgJiYgdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAud2hpdGhpbk9wZW5Cb3VuZHModGhpcy5wb3MgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcC5jYW5jZWwoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgoJycpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBjb25zdCBiZWZvcmVGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdiZWZvcmVFeGVjdXRlJylcbiAgICAgIGlmIChiZWZvcmVGdW5jdCkge1xuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICAgIHJldHVybiAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkodGhpcy5yZXN1bHQoKSkudGhlbihyZXMgPT4ge1xuICAgICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgocmVzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSkucmVzdWx0KClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkV4ZWN1dGVGdW5jdCgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RW5kUG9zICgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGhcbiAgfVxuXG4gIGdldFBvcyAoKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5wb3MsIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKVxuICB9XG5cbiAgZ2V0T3BlbmluZ1BvcyAoKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5wb3MsIHRoaXMucG9zICsgdGhpcy5vcGVuaW5nLmxlbmd0aCkud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcilcbiAgfVxuXG4gIGdldEluZGVudCAoKSB7XG4gICAgdmFyIGhlbHBlclxuXG4gICAgaWYgKHRoaXMuaW5kZW50TGVuID09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpXG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gaGVscGVyLnJlbW92ZUNvbW1lbnQodGhpcy5nZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKSkubGVuZ3RoXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IHRoaXMucG9zIC0gdGhpcy5nZXRQb3MoKS5wcmV2RU9MKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbmRlbnRMZW5cbiAgfVxuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50ICh0ZXh0KSB7XG4gICAgdmFyIHJlZ1xuXG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycgKyB0aGlzLmdldEluZGVudCgpICsgJ30nLCAnZ20nKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsICcnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dFxuICAgIH1cbiAgfVxuXG4gIGFsdGVyUmVzdWx0Rm9yQm94IChyZXBsKSB7XG4gICAgdmFyIGJveCwgaGVscGVyLCBvcmlnaW5hbCwgcmVzXG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKVxuICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0KVxuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLCBmYWxzZSlcblxuICAgIGlmICh0aGlzLmdldE9wdGlvbigncmVwbGFjZUJveCcpKSB7XG4gICAgICBib3ggPSBoZWxwZXIuZ2V0Qm94Rm9yUG9zKG9yaWdpbmFsKTtcbiAgICAgIFtyZXBsLnN0YXJ0LCByZXBsLmVuZF0gPSBbYm94LnN0YXJ0LCBib3guZW5kXVxuICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIuaW5kZW50XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgICByZXBsLnN0YXJ0ID0gb3JpZ2luYWwucHJldkVPTCgpXG4gICAgICByZXBsLmVuZCA9IG9yaWdpbmFsLm5leHRFT0woKVxuICAgICAgcmVzID0gaGVscGVyLnJlZm9ybWF0TGluZXMob3JpZ2luYWwuc2FtZUxpbmVzUHJlZml4KCkgKyB0aGlzLmNvZGV3YXZlLm1hcmtlciArIHJlcGwudGV4dCArIHRoaXMuY29kZXdhdmUubWFya2VyICsgb3JpZ2luYWwuc2FtZUxpbmVzU3VmZml4KCksIHtcbiAgICAgICAgbXVsdGlsaW5lOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBbcmVwbC5wcmVmaXgsIHJlcGwudGV4dCwgcmVwbC5zdWZmaXhdID0gcmVzLnNwbGl0KHRoaXMuY29kZXdhdmUubWFya2VyKVxuICAgIH1cblxuICAgIHJldHVybiByZXBsXG4gIH1cblxuICBnZXRDdXJzb3JGcm9tUmVzdWx0IChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcFxuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KClcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsICYmIHRoaXMuY29kZXdhdmUuY2hlY2tDYXJyZXQgJiYgdGhpcy5nZXRPcHRpb24oJ2NoZWNrQ2FycmV0JykpIHtcbiAgICAgIGlmICgocCA9IHRoaXMuY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCArIHJlcGwucHJlZml4Lmxlbmd0aCArIHBcbiAgICAgIH1cblxuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQocmVwbC50ZXh0KVxuICAgIH1cblxuICAgIHJldHVybiBjdXJzb3JQb3NcbiAgfVxuXG4gIGNoZWNrTXVsdGkgKHJlcGwpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXdSZXBsLCBvcmlnaW5hbFBvcywgb3JpZ2luYWxUZXh0LCBwb3MsIHJlZiwgcmVwbGFjZW1lbnRzXG5cbiAgICBpZiAodGhpcy5tdWx0aVBvcyAhPSBudWxsICYmIHRoaXMubXVsdGlQb3MubGVuZ3RoID4gMSkge1xuICAgICAgcmVwbGFjZW1lbnRzID0gW3JlcGxdXG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpXG4gICAgICByZWYgPSB0aGlzLm11bHRpUG9zXG5cbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgIHBvcyA9IHJlZltpXVxuXG4gICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgb3JpZ2luYWxQb3MgPSBwb3Muc3RhcnRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0IC0gb3JpZ2luYWxQb3MpXG5cbiAgICAgICAgICBpZiAobmV3UmVwbC5vcmlnaW5hbFRleHQoKSA9PT0gb3JpZ2luYWxUZXh0KSB7XG4gICAgICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXdSZXBsKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRzXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbcmVwbF1cbiAgICB9XG4gIH1cblxuICByZXBsYWNlV2l0aCAodGV4dCkge1xuICAgIHJldHVybiB0aGlzLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KHRoaXMucG9zLCB0aGlzLmdldEVuZFBvcygpLCB0ZXh0KSlcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnQgKHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCByZXBsYWNlbWVudHNcbiAgICByZXBsLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpXG5cbiAgICBpZiAodGhpcy5pbkJveCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgIH1cblxuICAgIGN1cnNvclBvcyA9IHRoaXMuZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKVxuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKGN1cnNvclBvcywgY3Vyc29yUG9zKV1cbiAgICByZXBsYWNlbWVudHMgPSB0aGlzLmNoZWNrTXVsdGkocmVwbClcbiAgICB0aGlzLnJlcGxhY2VTdGFydCA9IHJlcGwuc3RhcnRcbiAgICB0aGlzLnJlcGxhY2VFbmQgPSByZXBsLnJlc0VuZCgpXG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgfVxufVxuZXhwb3J0cy5Qb3NpdGlvbmVkQ21kSW5zdGFuY2UgPSBQb3NpdGlvbmVkQ21kSW5zdGFuY2VcbiIsIlxudmFyIFByb2Nlc3MgPSBjbGFzcyBQcm9jZXNzIHtcbn1cbmV4cG9ydHMuUHJvY2VzcyA9IFByb2Nlc3NcbiIsIlxuY29uc3QgTG9nZ2VyID0gcmVxdWlyZSgnLi9Mb2dnZXInKS5Mb2dnZXJcblxudmFyIFN0b3JhZ2UgPSBjbGFzcyBTdG9yYWdlIHtcbiAgY29uc3RydWN0b3IgKGVuZ2luZSkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lXG4gIH1cblxuICBzYXZlIChrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZShrZXksIHZhbClcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoIChwYXRoLCBrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbClcbiAgICB9XG4gIH1cblxuICBsb2FkIChrZXkpIHtcbiAgICBpZiAodGhpcy5lbmdpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLmxvYWQoa2V5KVxuICAgIH1cbiAgfVxuXG4gIGVuZ2luZUF2YWlsYWJsZSAoKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9nZ2VyID0gdGhpcy5sb2dnZXIgfHwgbmV3IExvZ2dlcigpXG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ05vIHN0b3JhZ2UgZW5naW5lIGF2YWlsYWJsZScpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cbn1cbmV4cG9ydHMuU3RvcmFnZSA9IFN0b3JhZ2VcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5cbmNvbnN0IFRleHRQYXJzZXIgPSByZXF1aXJlKCcuL1RleHRQYXJzZXInKS5UZXh0UGFyc2VyXG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUG9zJykuUG9zXG5cbnZhciBpc0VsZW1lbnRcbnZhciBEb21LZXlMaXN0ZW5lciA9IGNsYXNzIERvbUtleUxpc3RlbmVyIHtcbiAgc3RhcnRMaXN0ZW5pbmcgKHRhcmdldCkge1xuICAgIHZhciBvbmtleWRvd24sIG9ua2V5cHJlc3MsIG9ua2V5dXAsIHRpbWVvdXRcbiAgICB0aW1lb3V0ID0gbnVsbFxuXG4gICAgb25rZXlkb3duID0gZSA9PiB7XG4gICAgICBpZiAoKENvZGV3YXZlLmluc3RhbmNlcy5sZW5ndGggPCAyIHx8IHRoaXMub2JqID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSAmJiBlLmtleUNvZGUgPT09IDY5ICYmIGUuY3RybEtleSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICBpZiAodGhpcy5vbkFjdGl2YXRpb25LZXkgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQWN0aXZhdGlvbktleSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBvbmtleXVwID0gZSA9PiB7XG4gICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uQW55Q2hhbmdlKGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgb25rZXlwcmVzcyA9IGUgPT4ge1xuICAgICAgaWYgKHRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgIH1cblxuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSlcbiAgICAgICAgfVxuICAgICAgfSwgMTAwKVxuICAgIH1cblxuICAgIGlmICh0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbmtleWRvd24pXG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbmtleXVwKVxuICAgICAgcmV0dXJuIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIG9ua2V5cHJlc3MpXG4gICAgfSBlbHNlIGlmICh0YXJnZXQuYXR0YWNoRXZlbnQpIHtcbiAgICAgIHRhcmdldC5hdHRhY2hFdmVudCgnb25rZXlkb3duJywgb25rZXlkb3duKVxuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KCdvbmtleXVwJywgb25rZXl1cClcbiAgICAgIHJldHVybiB0YXJnZXQuYXR0YWNoRXZlbnQoJ29ua2V5cHJlc3MnLCBvbmtleXByZXNzKVxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5Eb21LZXlMaXN0ZW5lciA9IERvbUtleUxpc3RlbmVyXG5cbmlzRWxlbWVudCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgdHJ5IHtcbiAgICAvLyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgLy8gYW4gZXhjZXB0aW9uIGlzIHRocm93biBhbmQgd2UgZW5kIHVwIGhlcmUuIFRlc3Rpbmcgc29tZVxuICAgIC8vIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcblxuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmoubm9kZVR5cGUgPT09IDEgJiYgdHlwZW9mIG9iai5zdHlsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9iai5vd25lckRvY3VtZW50ID09PSAnb2JqZWN0J1xuICB9XG59XG5cbnZhciBUZXh0QXJlYUVkaXRvciA9IGNsYXNzIFRleHRBcmVhRWRpdG9yIGV4dGVuZHMgVGV4dFBhcnNlciB7XG4gIGNvbnN0cnVjdG9yICh0YXJnZXQxKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0MVxuICAgIHRoaXMub2JqID0gaXNFbGVtZW50KHRoaXMudGFyZ2V0KSA/IHRoaXMudGFyZ2V0IDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXQpXG5cbiAgICBpZiAodGhpcy5vYmogPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUZXh0QXJlYSBub3QgZm91bmQnKVxuICAgIH1cblxuICAgIHRoaXMubmFtZXNwYWNlID0gJ3RleHRhcmVhJ1xuICAgIHRoaXMuY2hhbmdlTGlzdGVuZXJzID0gW11cbiAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPSAwXG4gIH1cblxuICBvbkFueUNoYW5nZSAoZSkge1xuICAgIHZhciBjYWxsYmFjaywgaiwgbGVuMSwgcmVmLCByZXN1bHRzXG5cbiAgICBpZiAodGhpcy5fc2tpcENoYW5nZUV2ZW50IDw9IDApIHtcbiAgICAgIHJlZiA9IHRoaXMuY2hhbmdlTGlzdGVuZXJzXG4gICAgICByZXN1bHRzID0gW11cblxuICAgICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZi5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgY2FsbGJhY2sgPSByZWZbal1cbiAgICAgICAgcmVzdWx0cy5wdXNoKGNhbGxiYWNrKCkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudC0tXG5cbiAgICAgIGlmICh0aGlzLm9uU2tpcGVkQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25Ta2lwZWRDaGFuZ2UoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNraXBDaGFuZ2VFdmVudCAobmIgPSAxKSB7XG4gICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50ICs9IG5iXG4gIH1cblxuICBiaW5kZWRUbyAoY29kZXdhdmUpIHtcbiAgICB0aGlzLm9uQWN0aXZhdGlvbktleSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YXJ0TGlzdGVuaW5nKGRvY3VtZW50KVxuICB9XG5cbiAgc2VsZWN0aW9uUHJvcEV4aXN0cyAoKSB7XG4gICAgcmV0dXJuICdzZWxlY3Rpb25TdGFydCcgaW4gdGhpcy5vYmpcbiAgfVxuXG4gIGhhc0ZvY3VzICgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5vYmpcbiAgfVxuXG4gIHRleHQgKHZhbCkge1xuICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgaWYgKCF0aGlzLnRleHRFdmVudENoYW5nZSh2YWwpKSB7XG4gICAgICAgIHRoaXMub2JqLnZhbHVlID0gdmFsXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub2JqLnZhbHVlXG4gIH1cblxuICBzcGxpY2VUZXh0IChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHRoaXMuc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSB8fCBzdXBlci5zcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpXG4gIH1cblxuICB0ZXh0RXZlbnRDaGFuZ2UgKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgIHZhciBldmVudFxuXG4gICAgaWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50ICE9IG51bGwpIHtcbiAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RleHRFdmVudCcpXG4gICAgfVxuXG4gICAgaWYgKGV2ZW50ICE9IG51bGwgJiYgZXZlbnQuaW5pdFRleHRFdmVudCAhPSBudWxsICYmIGV2ZW50LmlzVHJ1c3RlZCAhPT0gZmFsc2UpIHtcbiAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICBlbmQgPSB0aGlzLnRleHRMZW4oKVxuICAgICAgfVxuXG4gICAgICBpZiAodGV4dC5sZW5ndGggPCAxKSB7XG4gICAgICAgIGlmIChzdGFydCAhPT0gMCkge1xuICAgICAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQgLSAxLCBzdGFydClcbiAgICAgICAgICBzdGFydC0tXG4gICAgICAgIH0gZWxzZSBpZiAoZW5kICE9PSB0aGlzLnRleHRMZW4oKSkge1xuICAgICAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoZW5kLCBlbmQgKyAxKVxuICAgICAgICAgIGVuZCsrXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSkgLy8gQHNldEN1cnNvclBvcyhzdGFydCxlbmQpXG5cbiAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgdGhpcy5vYmouZGlzcGF0Y2hFdmVudChldmVudClcbiAgICAgIHRoaXMuc2tpcENoYW5nZUV2ZW50KClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIHNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQgKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgIGlmIChkb2N1bWVudC5leGVjQ29tbWFuZCAhPSBudWxsKSB7XG4gICAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKClcbiAgICAgIH1cblxuICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICByZXR1cm4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zICgpIHtcbiAgICBpZiAodGhpcy50bXBDdXJzb3JQb3MgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMudG1wQ3Vyc29yUG9zXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzRm9jdXMpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblByb3BFeGlzdHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3ModGhpcy5vYmouc2VsZWN0aW9uU3RhcnQsIHRoaXMub2JqLnNlbGVjdGlvbkVuZClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEN1cnNvclBvc0ZhbGxiYWNrKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRDdXJzb3JQb3NGYWxsYmFjayAoKSB7XG4gICAgdmFyIGxlbiwgcG9zLCBybmcsIHNlbFxuXG4gICAgaWYgKHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSkge1xuICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKClcblxuICAgICAgaWYgKHNlbC5wYXJlbnRFbGVtZW50KCkgPT09IHRoaXMub2JqKSB7XG4gICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayhzZWwuZ2V0Qm9va21hcmsoKSlcbiAgICAgICAgbGVuID0gMFxuXG4gICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cygnRW5kVG9TdGFydCcsIHJuZykgPiAwKSB7XG4gICAgICAgICAgbGVuKytcbiAgICAgICAgICBybmcubW92ZUVuZCgnY2hhcmFjdGVyJywgLTEpXG4gICAgICAgIH1cblxuICAgICAgICBybmcuc2V0RW5kUG9pbnQoJ1N0YXJ0VG9TdGFydCcsIHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpKVxuICAgICAgICBwb3MgPSBuZXcgUG9zKDAsIGxlbilcblxuICAgICAgICB3aGlsZSAocm5nLmNvbXBhcmVFbmRQb2ludHMoJ0VuZFRvU3RhcnQnLCBybmcpID4gMCkge1xuICAgICAgICAgIHBvcy5zdGFydCsrXG4gICAgICAgICAgcG9zLmVuZCsrXG4gICAgICAgICAgcm5nLm1vdmVFbmQoJ2NoYXJhY3RlcicsIC0xKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBvc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldEN1cnNvclBvcyAoc3RhcnQsIGVuZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgZW5kID0gc3RhcnRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZWxlY3Rpb25Qcm9wRXhpc3RzKSB7XG4gICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG5ldyBQb3Moc3RhcnQsIGVuZClcbiAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudG1wQ3Vyc29yUG9zID0gbnVsbFxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgfSwgMSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKVxuICAgIH1cbiAgfVxuXG4gIHNldEN1cnNvclBvc0ZhbGxiYWNrIChzdGFydCwgZW5kKSB7XG4gICAgdmFyIHJuZ1xuXG4gICAgaWYgKHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSkge1xuICAgICAgcm5nID0gdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgIHJuZy5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIHN0YXJ0KVxuICAgICAgcm5nLmNvbGxhcHNlKClcbiAgICAgIHJuZy5tb3ZlRW5kKCdjaGFyYWN0ZXInLCBlbmQgLSBzdGFydClcbiAgICAgIHJldHVybiBybmcuc2VsZWN0KClcbiAgICB9XG4gIH1cblxuICBnZXRMYW5nICgpIHtcbiAgICBpZiAodGhpcy5fbGFuZykge1xuICAgICAgcmV0dXJuIHRoaXMuX2xhbmdcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKSkge1xuICAgICAgcmV0dXJuIHRoaXMub2JqLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJylcbiAgICB9XG4gIH1cblxuICBzZXRMYW5nICh2YWwpIHtcbiAgICB0aGlzLl9sYW5nID0gdmFsXG4gICAgcmV0dXJuIHRoaXMub2JqLnNldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJywgdmFsKVxuICB9XG5cbiAgY2FuTGlzdGVuVG9DaGFuZ2UgKCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBhZGRDaGFuZ2VMaXN0ZW5lciAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjaylcbiAgfVxuXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xuICAgIHZhciBpXG5cbiAgICBpZiAoKGkgPSB0aGlzLmNoYW5nZUxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpLCAxKVxuICAgIH1cbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzIChyZXBsYWNlbWVudHMpIHtcbiAgICBpZiAocmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgJiYgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbdGhpcy5nZXRDdXJzb3JQb3MoKV1cbiAgICB9XG5cbiAgICByZXR1cm4gc3VwZXIuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB9XG59XG5cblRleHRBcmVhRWRpdG9yLnByb3RvdHlwZS5zdGFydExpc3RlbmluZyA9IERvbUtleUxpc3RlbmVyLnByb3RvdHlwZS5zdGFydExpc3RlbmluZ1xuXG5leHBvcnRzLlRleHRBcmVhRWRpdG9yID0gVGV4dEFyZWFFZGl0b3JcbiIsIlxuY29uc3QgRWRpdG9yID0gcmVxdWlyZSgnLi9FZGl0b3InKS5FZGl0b3JcblxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3MnKS5Qb3NcblxudmFyIFRleHRQYXJzZXIgPSBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yIHtcbiAgY29uc3RydWN0b3IgKF90ZXh0KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuX3RleHQgPSBfdGV4dFxuICB9XG5cbiAgdGV4dCAodmFsKSB7XG4gICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl90ZXh0ID0gdmFsXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RleHRcbiAgfVxuXG4gIHRleHRDaGFyQXQgKHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKVtwb3NdXG4gIH1cblxuICB0ZXh0TGVuIChwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkubGVuZ3RoXG4gIH1cblxuICB0ZXh0U3Vic3RyIChzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICB9XG5cbiAgaW5zZXJ0VGV4dEF0ICh0ZXh0LCBwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnN1YnN0cmluZygwLCBwb3MpICsgdGV4dCArIHRoaXMudGV4dCgpLnN1YnN0cmluZyhwb3MsIHRoaXMudGV4dCgpLmxlbmd0aCkpXG4gIH1cblxuICBzcGxpY2VUZXh0IChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCAnJykgKyB0aGlzLnRleHQoKS5zbGljZShlbmQpKVxuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zICgpIHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXRcbiAgfVxuXG4gIHNldEN1cnNvclBvcyAoc3RhcnQsIGVuZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgZW5kID0gc3RhcnRcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldCA9IG5ldyBQb3Moc3RhcnQsIGVuZClcbiAgICByZXR1cm4gdGhpcy50YXJnZXRcbiAgfVxufVxuZXhwb3J0cy5UZXh0UGFyc2VyID0gVGV4dFBhcnNlclxuIiwiJ3VzZSBzdHJpY3QnXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NvZGV3YXZlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gQ29kZXdhdmVcbiAgfVxufSlcblxuY29uc3QgQ29kZXdhdmUgPSByZXF1aXJlKCcuL0NvZGV3YXZlJykuQ29kZXdhdmVcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpLkNvbW1hbmRcblxuY29uc3QgQ29yZUNvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoJy4vY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyJykuQ29yZUNvbW1hbmRQcm92aWRlclxuXG5jb25zdCBKc0NvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoJy4vY21kcy9Kc0NvbW1hbmRQcm92aWRlcicpLkpzQ29tbWFuZFByb3ZpZGVyXG5cbmNvbnN0IFBocENvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoJy4vY21kcy9QaHBDb21tYW5kUHJvdmlkZXInKS5QaHBDb21tYW5kUHJvdmlkZXJcblxuY29uc3QgSHRtbENvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoJy4vY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyJykuSHRtbENvbW1hbmRQcm92aWRlclxuXG5jb25zdCBGaWxlQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL0ZpbGVDb21tYW5kUHJvdmlkZXInKS5GaWxlQ29tbWFuZFByb3ZpZGVyXG5cbmNvbnN0IFN0cmluZ0NvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoJy4vY21kcy9TdHJpbmdDb21tYW5kUHJvdmlkZXInKS5TdHJpbmdDb21tYW5kUHJvdmlkZXJcblxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3MnKS5Qb3NcblxuY29uc3QgV3JhcHBlZFBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvV3JhcHBlZFBvcycpLldyYXBwZWRQb3NcblxuY29uc3QgTG9jYWxTdG9yYWdlRW5naW5lID0gcmVxdWlyZSgnLi9zdG9yYWdlRW5naW5lcy9Mb2NhbFN0b3JhZ2VFbmdpbmUnKS5Mb2NhbFN0b3JhZ2VFbmdpbmVcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxuY29uc3QgQ21kSW5zdGFuY2UgPSByZXF1aXJlKCcuL0NtZEluc3RhbmNlJykuQ21kSW5zdGFuY2VcblxuY29uc3QgQ21kRmluZGVyID0gcmVxdWlyZSgnLi9DbWRGaW5kZXInKS5DbWRGaW5kZXJcblxuQ29udGV4dC5jbWRJbnN0YW5jZUNsYXNzID0gQ21kSW5zdGFuY2VcbkNvbnRleHQuY21kRmluZGVyQ2xhc3MgPSBDbWRGaW5kZXJcblxuUG9zLndyYXBDbGFzcyA9IFdyYXBwZWRQb3NcbkNvZGV3YXZlLmluc3RhbmNlcyA9IFtdXG5Db21tYW5kLnByb3ZpZGVycyA9IFtuZXcgQ29yZUNvbW1hbmRQcm92aWRlcigpLCBuZXcgSnNDb21tYW5kUHJvdmlkZXIoKSwgbmV3IFBocENvbW1hbmRQcm92aWRlcigpLCBuZXcgSHRtbENvbW1hbmRQcm92aWRlcigpLCBuZXcgRmlsZUNvbW1hbmRQcm92aWRlcigpLCBuZXcgU3RyaW5nQ29tbWFuZFByb3ZpZGVyKCldXG5cbmlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZUVuZ2luZSgpXG59XG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuY29uc3QgQmFzZUNvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQmFzZUNvbW1hbmRcblxuY29uc3QgTGFuZ0RldGVjdG9yID0gcmVxdWlyZSgnLi4vZGV0ZWN0b3JzL0xhbmdEZXRlY3RvcicpLkxhbmdEZXRlY3RvclxuXG5jb25zdCBBbHdheXNFbmFibGVkID0gcmVxdWlyZSgnLi4vZGV0ZWN0b3JzL0Fsd2F5c0VuYWJsZWQnKS5BbHdheXNFbmFibGVkXG5cbmNvbnN0IEJveEhlbHBlciA9IHJlcXVpcmUoJy4uL0JveEhlbHBlcicpLkJveEhlbHBlclxuXG5jb25zdCBFZGl0Q21kUHJvcCA9IHJlcXVpcmUoJy4uL0VkaXRDbWRQcm9wJykuRWRpdENtZFByb3BcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInKS5TdHJpbmdIZWxwZXJcblxuY29uc3QgUGF0aEhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvUGF0aEhlbHBlcicpLlBhdGhIZWxwZXJcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKCcuLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCcpLlJlcGxhY2VtZW50XG5cbnZhciBCb3hDbWQsIENsb3NlQ21kLCBFZGl0Q21kLCBFbW1ldENtZCwgTmFtZVNwYWNlQ21kLCBUZW1wbGF0ZUNtZCwgYWxpYXNDb21tYW5kLCBleGVjX3BhcmVudCwgZ2V0Q29tbWFuZCwgZ2V0Q29udGVudCwgZ2V0UGFyYW0sIGhlbHAsIGxpc3RDb21tYW5kLCBub19leGVjdXRlLCBxdW90ZV9jYXJyZXQsIHJlbW92ZUNvbW1hbmQsIHJlbmFtZUNvbW1hbmQsIHNldENvbW1hbmQsIHN0b3JlSnNvbkNvbW1hbmRcbnZhciBDb3JlQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgQ29yZUNvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChjbWRzKSB7XG4gICAgdmFyIGNvcmVcbiAgICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NvcmUnKSlcbiAgICBjbWRzLmFkZERldGVjdG9yKG5ldyBBbHdheXNFbmFibGVkKCdjb3JlJykpXG4gICAgY29yZS5hZGREZXRlY3RvcihuZXcgTGFuZ0RldGVjdG9yKCkpXG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICBoZWxwOiB7XG4gICAgICAgIHJlcGxhY2VCb3g6IHRydWUsXG4gICAgICAgIHJlc3VsdDogaGVscCxcbiAgICAgICAgcGFyc2U6IHRydWUsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydjbWQnXSxcbiAgICAgICAgaGVscDogJ1RvIGdldCBoZWxwIG9uIGEgcGVjaWZpYyBjb21tYW5kLCBkbyA6XFxufn5oZWxwIGhlbGxvfn4gKGhlbGxvIGJlaW5nIHRoZSBjb21tYW5kKScsXG4gICAgICAgIGNtZHM6IHtcbiAgICAgICAgICBvdmVydmlldzoge1xuICAgICAgICAgICAgcmVwbGFjZUJveDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3VsdDogJ35+Ym94fn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuICBfX18gICAgICAgICBfICAgX18gICAgICBfX1xcbiAvIF9ffF9fXyAgX198IHxfX1xcXFwgXFxcXCAgICAvIC9fIF9fXyBfX19fX19cXG4vIC9fXy8gXyBcXFxcLyBfYCAvIC1fXFxcXCBcXFxcL1xcXFwvIC8gX2AgXFxcXCBWIC8gLV8vXFxuXFxcXF9fX19cXFxcX19fL1xcXFxfXyxfXFxcXF9fX3xcXFxcXy9cXFxcXy9cXFxcX18sX3xcXFxcXy9cXFxcX19ffFxcblRoZSB0ZXh0IGVkaXRvciBoZWxwZXJcXG5+fi9xdW90ZV9jYXJyZXR+flxcblxcbldoZW4gdXNpbmcgQ29kZXdhdmUgeW91IHdpbGwgYmUgd3JpdGluZyBjb21tYW5kcyB3aXRoaW4gXFxueW91ciB0ZXh0IGVkaXRvci4gVGhlc2UgY29tbWFuZHMgbXVzdCBiZSBwbGFjZWQgYmV0d2VlbiB0d28gXFxucGFpcnMgb2YgXCJ+XCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXFxuXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiLCB3aXRoIHlvdXIgY3Vyc29yIGluc2lkZSB0aGUgY29tbWFuZFxcbkV4OiB+fiFoZWxsb35+XFxuXFxuWW91IGRvbnQgbmVlZCB0byBhY3R1YWxseSB0eXBlIGFueSBcIn5cIiAodGlsZGUpLiBcXG5QcmVzc2luZyBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XFxud2l0aGluIGEgY29tbWFuZC5cXG5cXG5Db2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxcbkluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxcblRoZSBnZW5lcmF0ZWQgY29tbWVudCBibG9ja3Mgd2lsbCBiZSByZWZlcnJlZCB0byBhcyB3aW5kb3dzIFxcbmluIHRoZSBoZWxwIHNlY3Rpb25zLlxcblxcblRvIGNsb3NlIHRoaXMgd2luZG93IChpLmUuIHJlbW92ZSB0aGlzIGNvbW1lbnQgYmxvY2spLCBwcmVzcyBcXG5cImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXFxufn4hY2xvc2V8fn5cXG5cXG5Vc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcXG5mZWF0dXJlcyBvZiBDb2Rld2F2ZVxcbn5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiBvciB+fiFoZWxwOmRlbW9+flxcblxcbkxpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXFxufn4haGVscDpzdWJqZWN0c35+IG9yIH5+IWhlbHA6c3Vifn4gXFxuXFxufn4hY2xvc2V+flxcbn5+L2JveH5+J1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc3ViamVjdHM6IHtcbiAgICAgICAgICAgIHJlcGxhY2VCb3g6IHRydWUsXG4gICAgICAgICAgICByZXN1bHQ6ICd+fmJveH5+XFxufn4haGVscH5+XFxufn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcXG5+fiFoZWxwOnN1YmplY3Rzfn4gKH5+IWhlbHA6c3Vifn4pXFxufn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdWI6IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmhlbHA6c3ViamVjdHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRfc3RhcnRlZDoge1xuICAgICAgICAgICAgcmVwbGFjZUJveDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3VsdDogJ35+Ym94fn5cXG5UaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cXG5+fiFoZWxsb3x+flxcblxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuXFxuRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcXG5+fiFoZWxwOmVkaXRpbmd+flxcblxcbkNvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxcbm9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xcbn5+IWpzOmZ+flxcbn5+IWpzOmlmfn5cXG4gIH5+IWpzOmxvZ35+XCJ+fiFoZWxsb35+XCJ+fiEvanM6bG9nfn5cXG5+fiEvanM6aWZ+flxcbn5+IS9qczpmfn5cXG5cXG5Db2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXFxucHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuIEVtbWV0IGFiYnJldmlhdGlvbnMgd2lsbCBiZSBcXG51c2VkIGF1dG9tYXRpY2FsbHkgaWYgeW91IGFyZSBpbiBhIEhUTUwgb3IgQ1NTIGZpbGUuXFxufn4hdWw+bGl+fiAoaWYgeW91IGFyZSBpbiBhIGh0bWwgZG9jY3VtZW50KVxcbn5+IWVtbWV0IHVsPmxpfn5cXG5+fiFlbW1ldCBtMiBjc3N+flxcblxcbkNvbW1hbmRzIGFyZSBzdG9yZWQgaW4gbmFtZXNwYWNlcy4gVGhlIHNhbWUgY29tbWFuZCBjYW4gaGF2ZSBcXG5kaWZmZXJlbnQgcmVzdWx0cyBkZXBlbmRpbmcgb24gdGhlIG5hbWVzcGFjZS5cXG5+fiFqczplYWNofn5cXG5+fiFwaHA6b3V0ZXI6ZWFjaH5+XFxufn4hcGhwOmlubmVyOmVhY2h+flxcblxcblNvbWUgb2YgdGhlIG5hbWVzcGFjZXMgYXJlIGFjdGl2ZSBkZXBlbmRpbmcgb24gdGhlIGNvbnRleHQuIFRoZVxcbmZvbGxvd2luZyBjb21tYW5kcyBhcmUgdGhlIHNhbWUgYW5kIHdpbGwgZGlzcGxheSB0aGUgY3VycmVudGx5XFxuYWN0aXZlIG5hbWVzcGFjZS4gVGhlIGZpcnN0IGNvbW1hbmQgY29tbWFuZCB3b3JrcyBiZWNhdXNlIHRoZSBcXG5jb3JlIG5hbWVzcGFjZSBpcyBhY3RpdmUuXFxufn4hbmFtZXNwYWNlfn5cXG5+fiFjb3JlOm5hbWVzcGFjZX5+XFxuXFxuWW91IGNhbiBtYWtlIGEgbmFtZXNwYWNlIGFjdGl2ZSB3aXRoIHRoZSBmb2xsb3dpbmcgY29tbWFuZC5cXG5+fiFuYW1lc3BhY2UgcGhwfn5cXG5cXG5DaGVjayB0aGUgbmFtZXNwYWNlcyBhZ2Fpblxcbn5+IW5hbWVzcGFjZX5+XFxuXFxuSW4gYWRkaXRpb24gdG8gZGV0ZWN0aW5nIHRoZSBkb2N1bWVudCB0eXBlLCBDb2Rld2F2ZSBjYW4gZGV0ZWN0IHRoZVxcbmNvbnRleHQgZnJvbSB0aGUgc3Vycm91bmRpbmcgdGV4dC4gSW4gYSBQSFAgZmlsZSwgaXQgbWVhbnMgQ29kZXdhdmUgXFxud2lsbCBhZGQgdGhlIFBIUCB0YWdzIHdoZW4geW91IG5lZWQgdGhlbS5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZW1vOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpoZWxwOmdldF9zdGFydGVkJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZWRpdGluZzoge1xuICAgICAgICAgICAgY21kczoge1xuICAgICAgICAgICAgICBpbnRybzoge1xuICAgICAgICAgICAgICAgIHJlc3VsdDogJ0NvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXFxucHV0IHlvdXIgY29udGVudCBpbnNpZGUgXCJzb3VyY2VcIiB0aGUgZG8gXCJzYXZlXCIuIFRyeSBhZGRpbmcgYW55IFxcbnRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXFxufn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxcblxcbklmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XFxuZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxcbndoZW5ldmVyIHlvdSB3YW50Llxcbn5+IW15X25ld19jb21tYW5kfn4nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXBsYWNlQm94OiB0cnVlLFxuICAgICAgICAgICAgcmVzdWx0OiBcIn5+Ym94fn5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxuXFxuQWxsIHRoZSB3aW5kb3dzIG9mIENvZGV3YXZlIGFyZSBtYWRlIHdpdGggdGhlIGNvbW1hbmQgXFxcImJveFxcXCIuIFxcblRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXFxuVGhleSBhcmUgdmFsaWQgY29tbWVudHMgc28gdGhleSB3b24ndCBicmVhayB5b3VyIGNvZGUgYW5kIHRoZSBjb21tYW5kIFxcblxcXCJjbG9zZVxcXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxcbmNvbW1hbmRzIHdpdGggdGhlbSBpZiB5b3UgbmVlZCB0byBkaXNwbGF5IHNvbWUgdGV4dCB0ZW1wb3JhcmlseS5cXG5+fiFib3h+flxcblRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcXG5+fiFjbG9zZXx+flxcbn5+IS9ib3h+flxcblxcbn5+cXVvdGVfY2FycmV0fn5cXG5XaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxcbndpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcXFwifFxcXCIgXFxuKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcXG5jaGFyYWN0ZXIuXFxufn4hYm94fn5cXG5vbmUgOiB8IFxcbnR3byA6IHx8XFxufn4hL2JveH5+XFxuXFxuWW91IGNhbiBhbHNvIHVzZSB0aGUgXFxcImVzY2FwZV9waXBlc1xcXCIgY29tbWFuZCB0aGF0IHdpbGwgZXNjYXBlIGFueSBcXG52ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xcbn5+IWVzY2FwZV9waXBlc35+XFxufFxcbn5+IS9lc2NhcGVfcGlwZXN+flxcblxcbkNvbW1hbmRzIGluc2lkZSBvdGhlciBjb21tYW5kcyB3aWxsIGJlIGV4cGFuZGVkIGF1dG9tYXRpY2FsbHkuXFxuSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxcbnRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXFxcIiFcXFwiIChleGNsYW1hdGlvbiBtYXJrKS5cXG5+fiEhaGVsbG9+flxcblxcbkZvciBjb21tYW5kcyB0aGF0IGhhdmUgYm90aCBhbiBvcGVuaW5nIGFuZCBhIGNsb3NpbmcgdGFnLCB5b3UgY2FuIHVzZVxcbnRoZSBcXFwiY29udGVudFxcXCIgY29tbWFuZC4gXFxcImNvbnRlbnRcXFwiIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGV4dFxcbnRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cXG5+fiFlZGl0IHBocDppbm5lcjppZn5+XFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVkaXQ6IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmhlbHA6ZWRpdGluZydcbiAgICAgICAgICB9LFxuICAgICAgICAgIG5vdF9mb3VuZDogJ35+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBub19leGVjdXRlOiB7XG4gICAgICAgIHJlc3VsdDogbm9fZXhlY3V0ZSxcbiAgICAgICAgaGVscDogJ1ByZXZlbnQgZXZlcnl0aGluZyBpbnNpZGUgdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBmcm9tIGV4ZWN1dGluZydcbiAgICAgIH0sXG4gICAgICBlc2NhcGVfcGlwZXM6IHtcbiAgICAgICAgcmVzdWx0OiBxdW90ZV9jYXJyZXQsXG4gICAgICAgIGNoZWNrQ2FycmV0OiBmYWxzZSxcbiAgICAgICAgaGVscDogJ0VzY2FwZSBhbGwgY2FycmV0cyAoZnJvbSBcInxcIiB0byBcInx8XCIpJ1xuICAgICAgfSxcbiAgICAgIHF1b3RlX2NhcnJldDoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgICB9LFxuICAgICAgZXhlY19wYXJlbnQ6IHtcbiAgICAgICAgZXhlY3V0ZTogZXhlY19wYXJlbnQsXG4gICAgICAgIGhlbHA6IFwiRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1wiXG4gICAgICB9LFxuICAgICAgY29udGVudDoge1xuICAgICAgICByZXN1bHQ6IGdldENvbnRlbnQsXG4gICAgICAgIGhlbHA6ICdNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIHdoYXQgd2FzIGJldHdlZW4gdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBvZiBhIGNvbW1hbmQnXG4gICAgICB9LFxuICAgICAgYm94OiB7XG4gICAgICAgIGNsczogQm94Q21kLFxuICAgICAgICBoZWxwOiBcIkNyZWF0ZSB0aGUgYXBwYXJlbmNlIG9mIGEgYm94IGNvbXBvc2VkIGZyb20gY2hhcmFjdGVycy4gXFxuVXN1YWxseSB3cmFwcGVkIGluIGEgY29tbWVudC5cXG5cXG5UaGUgYm94IHdpbGwgdHJ5IHRvIGFqdXN0IGl0J3Mgc2l6ZSBmcm9tIHRoZSBjb250ZW50XCJcbiAgICAgIH0sXG4gICAgICBjbG9zZToge1xuICAgICAgICBjbHM6IENsb3NlQ21kLFxuICAgICAgICBoZWxwOiAnV2lsbCBjbG9zZSB0aGUgZmlyc3QgYm94IGFyb3VuZCB0aGlzJ1xuICAgICAgfSxcbiAgICAgIHBhcmFtOiB7XG4gICAgICAgIHJlc3VsdDogZ2V0UGFyYW0sXG4gICAgICAgIGhlbHA6ICdNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIGEgcGFyYW1ldGVyIGZyb20gdGhpcyBjb21tYW5kIGNhbGxcXG5cXG5Zb3UgY2FuIHBhc3MgYSBudW1iZXIsIGEgc3RyaW5nLCBvciBib3RoLiBcXG5BIG51bWJlciBmb3IgYSBwb3NpdGlvbmVkIGFyZ3VtZW50IGFuZCBhIHN0cmluZ1xcbmZvciBhIG5hbWVkIHBhcmFtZXRlcidcbiAgICAgIH0sXG4gICAgICBlZGl0OiB7XG4gICAgICAgIGNtZHM6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICAgc2F2ZToge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6ZXhlY19wYXJlbnQnXG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgY2xzOiBFZGl0Q21kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnY21kJ10sXG4gICAgICAgIGhlbHA6ICdBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxcblNlZSB+fiFoZWxwOmVkaXRpbmd+fiBmb3IgYSBxdWljayB0dXRvcmlhbCdcbiAgICAgIH0sXG4gICAgICByZW5hbWU6IHtcbiAgICAgICAgY21kczoge1xuICAgICAgICAgIG5vdF9hcHBsaWNhYmxlOiAnfn5ib3h+flxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+JyxcbiAgICAgICAgICBub3RfZm91bmQ6ICd+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgICB9LFxuICAgICAgICByZXN1bHQ6IHJlbmFtZUNvbW1hbmQsXG4gICAgICAgIHBhcnNlOiB0cnVlLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnZnJvbScsICd0byddLFxuICAgICAgICBoZWxwOiBcIkFsbG93cyB0byByZW5hbWUgYSBjb21tYW5kIGFuZCBjaGFuZ2UgaXQncyBuYW1lc3BhY2UuIFxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG4tIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcXG4tIFRoZW4gc2Vjb25kIHBhcmFtIGlzIHRoZSBuZXcgbmFtZSwgaWYgaXQgaGFzIG5vIG5hbWVzcGFjZSxcXG4gIGl0IHdpbGwgdXNlIHRoZSBvbmUgZnJvbSB0aGUgb3JpZ2luYWwgY29tbWFuZC5cXG5cXG5leC46IH5+IXJlbmFtZSBteV9jb21tYW5kIG15X2NvbW1hbmQyfn5cIlxuICAgICAgfSxcbiAgICAgIHJlbW92ZToge1xuICAgICAgICBjbWRzOiB7XG4gICAgICAgICAgbm90X2FwcGxpY2FibGU6ICd+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nLFxuICAgICAgICAgIG5vdF9mb3VuZDogJ35+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdDogcmVtb3ZlQ29tbWFuZCxcbiAgICAgICAgcGFyc2U6IHRydWUsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydjbWQnXSxcbiAgICAgICAgaGVscDogJ0FsbG93cyB0byByZW1vdmUgYSBjb21tYW5kLiBcXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuJ1xuICAgICAgfSxcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIGNtZHM6IHtcbiAgICAgICAgICBub3RfZm91bmQ6ICd+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgICB9LFxuICAgICAgICByZXN1bHQ6IGFsaWFzQ29tbWFuZCxcbiAgICAgICAgcGFyc2U6IHRydWVcbiAgICAgIH0sXG4gICAgICBuYW1lc3BhY2U6IHtcbiAgICAgICAgY2xzOiBOYW1lU3BhY2VDbWQsXG4gICAgICAgIGhlbHA6ICdTaG93IHRoZSBjdXJyZW50IG5hbWVzcGFjZXMuXFxuXFxuQSBuYW1lIHNwYWNlIGNvdWxkIGJlIHRoZSBuYW1lIG9mIHRoZSBsYW5ndWFnZVxcbm9yIG90aGVyIGtpbmQgb2YgY29udGV4dHNcXG5cXG5JZiB5b3UgcGFzcyBhIHBhcmFtIHRvIHRoaXMgY29tbWFuZCwgaXQgd2lsbCBcXG5hZGQgdGhlIHBhcmFtIGFzIGEgbmFtZXNwYWNlIGZvciB0aGUgY3VycmVudCBlZGl0b3InXG4gICAgICB9LFxuICAgICAgbnNwYzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpuYW1lc3BhY2UnXG4gICAgICB9LFxuICAgICAgbGlzdDoge1xuICAgICAgICByZXN1bHQ6IGxpc3RDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZScsICdib3gnLCAnY29udGV4dCddLFxuICAgICAgICByZXBsYWNlQm94OiB0cnVlLFxuICAgICAgICBwYXJzZTogdHJ1ZSxcbiAgICAgICAgaGVscDogJ0xpc3QgYXZhaWxhYmxlIGNvbW1hbmRzXFxuXFxuWW91IGNhbiB1c2UgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGNob29zZSBhIHNwZWNpZmljIG5hbWVzcGFjZSwgXFxuYnkgZGVmYXVsdCBhbGwgY3VyZW50IG5hbWVzcGFjZSB3aWxsIGJlIHNob3duJ1xuICAgICAgfSxcbiAgICAgIGxzOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmxpc3QnXG4gICAgICB9LFxuICAgICAgZ2V0OiB7XG4gICAgICAgIHJlc3VsdDogZ2V0Q29tbWFuZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ25hbWUnXSxcbiAgICAgICAgaGVscDogJ291dHB1dCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZSdcbiAgICAgIH0sXG4gICAgICBzZXQ6IHtcbiAgICAgICAgcmVzdWx0OiBzZXRDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZScsICd2YWx1ZScsICd2YWwnXSxcbiAgICAgICAgaGVscDogJ3NldCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZSdcbiAgICAgIH0sXG4gICAgICBzdG9yZV9qc29uOiB7XG4gICAgICAgIHJlc3VsdDogc3RvcmVKc29uQ29tbWFuZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ25hbWUnLCAnanNvbiddLFxuICAgICAgICBoZWxwOiAnc2V0IGEgdmFyaWFibGUgd2l0aCBzb21lIGpzb24gZGF0YSdcbiAgICAgIH0sXG4gICAgICBqc29uOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOnN0b3JlX2pzb24nXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgY2xzOiBUZW1wbGF0ZUNtZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ25hbWUnLCAnc2VwJ10sXG4gICAgICAgIGhlbHA6ICdyZW5kZXIgYSB0ZW1wbGF0ZSBmb3IgYSB2YXJpYWJsZVxcblxcbklmIHRoZSBmaXJzdCBwYXJhbSBpcyBub3Qgc2V0IGl0IHdpbGwgdXNlIGFsbCB2YXJpYWJsZXMgXFxuZm9yIHRoZSByZW5kZXJcXG5JZiB0aGUgdmFyaWFibGUgaXMgYW4gYXJyYXkgdGhlIHRlbXBsYXRlIHdpbGwgYmUgcmVwZWF0ZWQgXFxuZm9yIGVhY2ggaXRlbXNcXG5UaGUgYHNlcGAgcGFyYW0gZGVmaW5lIHdoYXQgd2lsbCBzZXBhcmF0ZSBlYWNoIGl0ZW0gXFxuYW5kIGRlZmF1bHQgdG8gYSBsaW5lIGJyZWFrJ1xuICAgICAgfSxcbiAgICAgIGVtbWV0OiB7XG4gICAgICAgIGNsczogRW1tZXRDbWQsXG4gICAgICAgIGhlbHA6ICdDb2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXFxucHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuXFxuXFxuUGFzcyB0aGUgRW1tZXQgYWJicmV2aWF0aW9uIGFzIGEgcGFyYW0gdG8gZXhwZW5kIGl0LidcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5leHBvcnRzLkNvcmVDb21tYW5kUHJvdmlkZXIgPSBDb3JlQ29tbWFuZFByb3ZpZGVyXG5cbmhlbHAgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGNtZCwgY21kTmFtZSwgaGVscENtZCwgc3ViY29tbWFuZHMsIHRleHRcbiAgY21kTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pXG5cbiAgaWYgKGNtZE5hbWUgIT0gbnVsbCkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKGNtZE5hbWUpXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGhlbHBDbWQgPSBjbWQuZ2V0Q21kKCdoZWxwJylcbiAgICAgIHRleHQgPSBoZWxwQ21kID8gYH5+JHtoZWxwQ21kLmZ1bGxOYW1lfX5+YCA6ICdUaGlzIGNvbW1hbmQgaGFzIG5vIGhlbHAgdGV4dCdcbiAgICAgIHN1YmNvbW1hbmRzID0gY21kLmNtZHMubGVuZ3RoID8gYFxcblN1Yi1Db21tYW5kcyA6XFxufn5scyAke2NtZC5mdWxsTmFtZX0gYm94Om5vIGNvbnRleHQ6bm9+fmAgOiAnJ1xuICAgICAgcmV0dXJuIGB+fmJveH5+XFxuSGVscCBmb3Igfn4hJHtjbWQuZnVsbE5hbWV9fn4gOlxcblxcbiR7dGV4dH1cXG4ke3N1YmNvbW1hbmRzfVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnfn5ub3RfZm91bmR+fidcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICd+fmhlbHA6b3ZlcnZpZXd+fidcbiAgfVxufVxuXG5ub19leGVjdXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciByZWdcbiAgcmVnID0gbmV3IFJlZ0V4cCgnXignICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzKSArICcpJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikpXG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsICckMScpXG59XG5cbnF1b3RlX2NhcnJldCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICByZXR1cm4gaW5zdGFuY2UuY29udGVudC5yZXBsYWNlKC9cXHwvZywgJ3x8Jylcbn1cblxuZXhlY19wYXJlbnQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIHJlc1xuXG4gIGlmIChpbnN0YW5jZS5wYXJlbnQgIT0gbnVsbCkge1xuICAgIHJlcyA9IGluc3RhbmNlLnBhcmVudC5leGVjdXRlKClcbiAgICBpbnN0YW5jZS5yZXBsYWNlU3RhcnQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZVN0YXJ0XG4gICAgaW5zdGFuY2UucmVwbGFjZUVuZCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlRW5kXG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5cbmdldENvbnRlbnQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGFmZml4ZXNfZW1wdHksIHByZWZpeCwgc3VmZml4XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSwgZmFsc2UpXG4gIHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKVxuICBzdWZmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJylcblxuICBpZiAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHByZWZpeCArIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmNvbnRlbnQgfHwgJycpICsgc3VmZml4XG4gIH1cblxuICBpZiAoYWZmaXhlc19lbXB0eSkge1xuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXhcbiAgfVxufVxuXG5yZW5hbWVDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICB2YXIgc3RvcmFnZVxuICAgIHN0b3JhZ2UgPSBDb21tYW5kLnN0b3JhZ2VcbiAgICByZXR1cm4gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgfSkudGhlbihzYXZlZENtZHMgPT4ge1xuICAgIHZhciBjbWQsIGNtZERhdGEsIG5ld05hbWUsIG9yaWduaW5hbE5hbWVcbiAgICBvcmlnbmluYWxOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmcm9tJ10pXG4gICAgbmV3TmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAndG8nXSlcblxuICAgIGlmIChvcmlnbmluYWxOYW1lICE9IG51bGwgJiYgbmV3TmFtZSAhPSBudWxsKSB7XG4gICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChvcmlnbmluYWxOYW1lKVxuXG4gICAgICBpZiAoc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdICE9IG51bGwgJiYgY21kICE9IG51bGwpIHtcbiAgICAgICAgaWYgKCEobmV3TmFtZS5pbmRleE9mKCc6JykgPiAtMSkpIHtcbiAgICAgICAgICBuZXdOYW1lID0gY21kLmZ1bGxOYW1lLnJlcGxhY2Uob3JpZ25pbmFsTmFtZSwgJycpICsgbmV3TmFtZVxuICAgICAgICB9XG5cbiAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXVxuXG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsIGNtZERhdGEpXG5cbiAgICAgICAgY21kLnVucmVnaXN0ZXIoKVxuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhXG4gICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBzdG9yYWdlLnNhdmUoJ2NtZHMnLCBzYXZlZENtZHMpXG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJ35+bm90X2FwcGxpY2FibGV+fidcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnfn5ub3RfZm91bmR+fidcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5cbnJlbW92ZUNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgIHZhciBuYW1lXG4gICAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pXG5cbiAgICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBzYXZlZENtZHMsIHN0b3JhZ2VcbiAgICAgICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZVxuICAgICAgICByZXR1cm4gc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAgIH0pLnRoZW4oc2F2ZWRDbWRzID0+IHtcbiAgICAgICAgdmFyIGNtZCwgY21kRGF0YVxuICAgICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChuYW1lKVxuXG4gICAgICAgIGlmIChzYXZlZENtZHNbbmFtZV0gIT0gbnVsbCAmJiBjbWQgIT0gbnVsbCkge1xuICAgICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbbmFtZV1cbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpXG4gICAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tuYW1lXVxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLnNhdmUoJ2NtZHMnLCBzYXZlZENtZHMpXG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuICd+fm5vdF9hcHBsaWNhYmxlfn4nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICd+fm5vdF9mb3VuZH5+J1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcbn1cblxuYWxpYXNDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgYWxpYXMgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2FsaWFzJ10pXG5cbiAgaWYgKG5hbWUgIT0gbnVsbCAmJiBhbGlhcyAhPSBudWxsKSB7XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQobmFtZSlcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kID0gY21kLmdldEFsaWFzZWQoKSB8fCBjbWQgLy8gdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAvLyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcblxuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7XG4gICAgICAgIGFsaWFzT2Y6IGNtZC5mdWxsTmFtZVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnfn5ub3RfZm91bmR+fidcbiAgICB9XG4gIH1cbn1cblxubGlzdENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGJveCwgY29tbWFuZHMsIGNvbnRleHQsIG5hbWUsIG5hbWVzcGFjZXMsIHRleHQsIHVzZUNvbnRleHRcbiAgYm94ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnYm94J10sIHRydWUpXG4gIHVzZUNvbnRleHQgPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydjb250ZXh0J10sIHRydWUpXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgbmFtZXNwYWNlcyA9IG5hbWUgPyBbbmFtZV0gOiBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKS5maWx0ZXIobnNwYyA9PiB7XG4gICAgcmV0dXJuIG5zcGMgIT09IGluc3RhbmNlLmNtZC5mdWxsTmFtZVxuICB9KS5jb25jYXQoJ19yb290JylcbiAgY29udGV4dCA9IHVzZUNvbnRleHQgPyBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpIDogaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHRcbiAgY29tbWFuZHMgPSBuYW1lc3BhY2VzLnJlZHVjZSgoY29tbWFuZHMsIG5zcGMpID0+IHtcbiAgICB2YXIgY21kXG4gICAgY21kID0gbnNwYyA9PT0gJ19yb290JyA/IENvbW1hbmQuY21kcyA6IGNvbnRleHQuZ2V0Q21kKG5zcGMsIHtcbiAgICAgIG11c3RFeGVjdXRlOiBmYWxzZVxuICAgIH0pXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KClcblxuICAgICAgaWYgKGNtZC5jbWRzKSB7XG4gICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGNtZC5jbWRzKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb21tYW5kc1xuICB9LCBbXSlcbiAgdGV4dCA9IGNvbW1hbmRzLmxlbmd0aCA/IGNvbW1hbmRzLm1hcChjbWQgPT4ge1xuICAgIGNtZC5pbml0KClcbiAgICByZXR1cm4gKGNtZC5pc0V4ZWN1dGFibGUoKSA/ICd+fiEnIDogJ35+IWxzICcpICsgY21kLmZ1bGxOYW1lICsgJ35+J1xuICB9KS5qb2luKCdcXG4nKSA6ICdUaGlzIGNvbnRhaW5zIG5vIHN1Yi1jb21tYW5kcydcblxuICBpZiAoYm94KSB7XG4gICAgcmV0dXJuIGB+fmJveH5+XFxuJHt0ZXh0fVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRleHRcbiAgfVxufVxuXG5nZXRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCByZXNcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKVxuICByZXMgPSBQYXRoSGVscGVyLmdldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSlcblxuICBpZiAodHlwZW9mIHJlcyA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAnICAnKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiByZXNcbiAgfVxufVxuXG5zZXRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWxcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKVxuICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAndmFsdWUnLCAndmFsJ10pKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogbnVsbFxuXG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lLCB2YWwpXG5cbiAgcmV0dXJuICcnXG59XG5cbnN0b3JlSnNvbkNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHAsIHZhbFxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pXG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdqc29uJ10pKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogbnVsbFxuXG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lLCBKU09OLnBhcnNlKHZhbCkpXG5cbiAgcmV0dXJuICcnXG59XG5cbmdldFBhcmFtID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIGlmIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5nZXRQYXJhbShpbnN0YW5jZS5wYXJhbXMsIGluc3RhbmNlLmdldFBhcmFtKFsnZGVmJywgJ2RlZmF1bHQnXSkpXG4gIH1cbn1cblxuQm94Q21kID0gY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0ICgpIHtcbiAgICB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KVxuICAgIHRoaXMuY21kID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ2NtZCddKVxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaGVscGVyLm9wZW5UZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWQgKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIHRoaXMuaGVscGVyLmNsb3NlVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWQuc3BsaXQoJyAnKVswXSArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgIH1cblxuICAgIHRoaXMuaGVscGVyLmRlY28gPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmRlY29cbiAgICB0aGlzLmhlbHBlci5wYWQgPSAyXG4gICAgdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJylcbiAgICB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKVxuICB9XG5cbiAgaGVpZ2h0ICgpIHtcbiAgICB2YXIgaGVpZ2h0LCBwYXJhbXNcblxuICAgIGlmICh0aGlzLmJvdW5kcygpICE9IG51bGwpIHtcbiAgICAgIGhlaWdodCA9IHRoaXMuYm91bmRzKCkuaGVpZ2h0XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IDNcbiAgICB9XG5cbiAgICBwYXJhbXMgPSBbJ2hlaWdodCddXG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSkge1xuICAgICAgcGFyYW1zLnB1c2goMSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCBoZWlnaHQpXG4gIH1cblxuICB3aWR0aCAoKSB7XG4gICAgdmFyIHBhcmFtcywgd2lkdGhcblxuICAgIGlmICh0aGlzLmJvdW5kcygpICE9IG51bGwpIHtcbiAgICAgIHdpZHRoID0gdGhpcy5ib3VuZHMoKS53aWR0aFxuICAgIH0gZWxzZSB7XG4gICAgICB3aWR0aCA9IDNcbiAgICB9XG5cbiAgICBwYXJhbXMgPSBbJ3dpZHRoJ11cblxuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgwKVxuICAgIH1cblxuICAgIHJldHVybiBNYXRoLm1heCh0aGlzLm1pbldpZHRoKCksIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCB3aWR0aCkpXG4gIH1cblxuICBib3VuZHMgKCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIGlmICh0aGlzLl9ib3VuZHMgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9ib3VuZHMgPSB0aGlzLmhlbHBlci50ZXh0Qm91bmRzKHRoaXMuaW5zdGFuY2UuY29udGVudClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCAoKSB7XG4gICAgdGhpcy5oZWxwZXIuaGVpZ2h0ID0gdGhpcy5oZWlnaHQoKVxuICAgIHRoaXMuaGVscGVyLndpZHRoID0gdGhpcy53aWR0aCgpXG4gICAgcmV0dXJuIHRoaXMuaGVscGVyLmRyYXcodGhpcy5pbnN0YW5jZS5jb250ZW50KVxuICB9XG5cbiAgbWluV2lkdGggKCkge1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbWQubGVuZ3RoXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwXG4gICAgfVxuICB9XG59XG5DbG9zZUNtZCA9IGNsYXNzIENsb3NlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0ICgpIHtcbiAgICB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KVxuICB9XG5cbiAgZXhlY3V0ZSAoKSB7XG4gICAgdmFyIGJveCwgYm94MiwgZGVwdGgsIHByZWZpeCwgcmVxdWlyZWRfYWZmaXhlcywgc3VmZml4XG4gICAgcHJlZml4ID0gdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJylcbiAgICBzdWZmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKVxuICAgIGJveCA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKVxuICAgIHJlcXVpcmVkX2FmZml4ZXMgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncmVxdWlyZWRfYWZmaXhlcyddLCB0cnVlKVxuXG4gICAgaWYgKCFyZXF1aXJlZF9hZmZpeGVzKSB7XG4gICAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSAnJ1xuICAgICAgYm94MiA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKVxuXG4gICAgICBpZiAoYm94MiAhPSBudWxsICYmIChib3ggPT0gbnVsbCB8fCBib3guc3RhcnQgPCBib3gyLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCB8fCBib3guZW5kID4gYm94Mi5lbmQgKyBzdWZmaXgubGVuZ3RoKSkge1xuICAgICAgICBib3ggPSBib3gyXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJveCAhPSBudWxsKSB7XG4gICAgICBkZXB0aCA9IHRoaXMuaGVscGVyLmdldE5lc3RlZEx2bCh0aGlzLmluc3RhbmNlLmdldFBvcygpLnN0YXJ0KVxuXG4gICAgICBpZiAoZGVwdGggPCAyKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UuaW5Cb3ggPSBudWxsXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KGJveC5zdGFydCwgYm94LmVuZCwgJycpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5yZXBsYWNlV2l0aCgnJylcbiAgICB9XG4gIH1cbn1cbkVkaXRDbWQgPSBjbGFzcyBFZGl0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0ICgpIHtcbiAgICB2YXIgcmVmXG4gICAgdGhpcy5jbWROYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKVxuICAgIHRoaXMudmVyYmFsaXplID0gKHJlZiA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzFdKSkgPT09ICd2JyB8fCByZWYgPT09ICd2ZXJiYWxpemUnXG5cbiAgICBpZiAodGhpcy5jbWROYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpXG4gICAgICB0aGlzLmZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKClcbiAgICB9XG5cbiAgICB0aGlzLmVkaXRhYmxlID0gdGhpcy5jbWQgIT0gbnVsbCA/IHRoaXMuY21kLmlzRWRpdGFibGUoKSA6IHRydWVcbiAgfVxuXG4gIHJlc3VsdCAoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0V2l0aENvbnRlbnQoKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRob3V0Q29udGVudCgpXG4gICAgfVxuICB9XG5cbiAgcmVzdWx0V2l0aENvbnRlbnQgKCkge1xuICAgIHZhciBkYXRhLCBpLCBsZW4sIHAsIHBhcnNlciwgcmVmXG4gICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHRoaXMuaW5zdGFuY2UuY29udGVudClcbiAgICBwYXJzZXIucGFyc2VBbGwoKVxuICAgIGRhdGEgPSB7fVxuICAgIHJlZiA9IEVkaXRDbWQucHJvcHNcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgcCA9IHJlZltpXVxuICAgICAgcC53cml0ZUZvcihwYXJzZXIsIGRhdGEpXG4gICAgfVxuXG4gICAgQ29tbWFuZC5zYXZlQ21kKHRoaXMuY21kTmFtZSwgZGF0YSlcblxuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgcHJvcHNEaXNwbGF5ICgpIHtcbiAgICB2YXIgY21kXG4gICAgY21kID0gdGhpcy5jbWRcbiAgICByZXR1cm4gRWRpdENtZC5wcm9wcy5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBwLmRpc3BsYXkoY21kKVxuICAgIH0pLmZpbHRlcihmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAgIT0gbnVsbFxuICAgIH0pLmpvaW4oJ1xcbicpXG4gIH1cblxuICByZXN1bHRXaXRob3V0Q29udGVudCAoKSB7XG4gICAgdmFyIG5hbWUsIHBhcnNlclxuXG4gICAgaWYgKCF0aGlzLmNtZCB8fCB0aGlzLmVkaXRhYmxlKSB7XG4gICAgICBuYW1lID0gdGhpcy5jbWQgPyB0aGlzLmNtZC5mdWxsTmFtZSA6IHRoaXMuY21kTmFtZVxuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KGB+fmJveCBjbWQ6XCIke3RoaXMuaW5zdGFuY2UuY21kLmZ1bGxOYW1lfSAke25hbWV9XCJ+flxcbiR7dGhpcy5wcm9wc0Rpc3BsYXkoKX1cXG5+fiFzYXZlfn4gfn4hY2xvc2V+flxcbn5+L2JveH5+YClcbiAgICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlXG5cbiAgICAgIGlmICh0aGlzLnZlcmJhbGl6ZSkge1xuICAgICAgICByZXR1cm4gcGFyc2VyLmdldFRleHQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbkVkaXRDbWQuc2V0Q21kcyA9IGZ1bmN0aW9uIChiYXNlKSB7XG4gIHZhciBpLCBpbkluc3RhbmNlLCBsZW4sIHAsIHJlZlxuICBpbkluc3RhbmNlID0gYmFzZS5pbl9pbnN0YW5jZSA9IHtcbiAgICBjbWRzOiB7fVxuICB9XG4gIHJlZiA9IEVkaXRDbWQucHJvcHNcblxuICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBwID0gcmVmW2ldXG4gICAgcC5zZXRDbWQoaW5JbnN0YW5jZS5jbWRzKVxuICB9IC8vIHAuc2V0Q21kKGJhc2UpXG5cbiAgcmV0dXJuIGJhc2Vcbn1cblxuRWRpdENtZC5wcm9wcyA9IFtuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fY2FycmV0Jywge1xuICBvcHQ6ICdjaGVja0NhcnJldCdcbn0pLCBuZXcgRWRpdENtZFByb3AucmV2Qm9vbCgnbm9fcGFyc2UnLCB7XG4gIG9wdDogJ3BhcnNlJ1xufSksIG5ldyBFZGl0Q21kUHJvcC5ib29sKCdwcmV2ZW50X3BhcnNlX2FsbCcsIHtcbiAgb3B0OiAncHJldmVudFBhcnNlQWxsJ1xufSksIG5ldyBFZGl0Q21kUHJvcC5ib29sKCdyZXBsYWNlX2JveCcsIHtcbiAgb3B0OiAncmVwbGFjZUJveCdcbn0pLCBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCduYW1lX3RvX3BhcmFtJywge1xuICBvcHQ6ICduYW1lVG9QYXJhbSdcbn0pLCBuZXcgRWRpdENtZFByb3Auc3RyaW5nKCdhbGlhc19vZicsIHtcbiAgdmFyOiAnYWxpYXNPZicsXG4gIGNhcnJldDogdHJ1ZVxufSksIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoJ2hlbHAnLCB7XG4gIGZ1bmN0OiAnaGVscCcsXG4gIHNob3dFbXB0eTogdHJ1ZVxufSksIG5ldyBFZGl0Q21kUHJvcC5zb3VyY2UoJ3NvdXJjZScsIHtcbiAgdmFyOiAncmVzdWx0U3RyJyxcbiAgZGF0YU5hbWU6ICdyZXN1bHQnLFxuICBzaG93RW1wdHk6IHRydWUsXG4gIGNhcnJldDogdHJ1ZVxufSldXG5OYW1lU3BhY2VDbWQgPSBjbGFzcyBOYW1lU3BhY2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQgKCkge1xuICAgIHRoaXMubmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzBdKVxuICB9XG5cbiAgcmVzdWx0ICgpIHtcbiAgICB2YXIgaSwgbGVuLCBuYW1lc3BhY2VzLCBuc3BjLCBwYXJzZXIsIHR4dFxuXG4gICAgaWYgKHRoaXMubmFtZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKS5jb250ZXh0LmFkZE5hbWVTcGFjZSh0aGlzLm5hbWUpXG4gICAgICByZXR1cm4gJydcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZXNwYWNlcyA9IHRoaXMuaW5zdGFuY2UuY29udGV4dC5nZXROYW1lU3BhY2VzKClcbiAgICAgIHR4dCA9ICd+fmJveH5+XFxuJ1xuXG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lc3BhY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIG5zcGMgPSBuYW1lc3BhY2VzW2ldXG5cbiAgICAgICAgaWYgKG5zcGMgIT09IHRoaXMuaW5zdGFuY2UuY21kLmZ1bGxOYW1lKSB7XG4gICAgICAgICAgdHh0ICs9IG5zcGMgKyAnXFxuJ1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHR4dCArPSAnfn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0eHQpXG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKClcbiAgICB9XG4gIH1cbn1cblRlbXBsYXRlQ21kID0gY2xhc3MgVGVtcGxhdGVDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQgKCkge1xuICAgIHRoaXMubmFtZSA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pXG4gICAgdGhpcy5zZXAgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc2VwJ10sICdcXG4nKVxuICB9XG5cbiAgcmVzdWx0ICgpIHtcbiAgICB2YXIgZGF0YVxuICAgIGRhdGEgPSB0aGlzLm5hbWUgPyBQYXRoSGVscGVyLmdldFBhdGgodGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCB0aGlzLm5hbWUpIDogdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzXG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50ICYmIGRhdGEgIT0gbnVsbCAmJiBkYXRhICE9PSBmYWxzZSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclRlbXBsYXRlKGl0ZW0pXG4gICAgICAgIH0pLmpvaW4odGhpcy5zZXApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZShkYXRhKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICByZW5kZXJUZW1wbGF0ZSAoZGF0YSkge1xuICAgIHZhciBwYXJzZXJcbiAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodGhpcy5pbnN0YW5jZS5jb250ZW50KVxuICAgIHBhcnNlci52YXJzID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHtcbiAgICAgIHZhbHVlOiBkYXRhXG4gICAgfVxuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlXG4gICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpXG4gIH1cbn1cbkVtbWV0Q21kID0gY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQgKCkge1xuICAgIHRoaXMuYWJiciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdhYmJyJywgJ2FiYnJldmlhdGlvbiddKVxuICAgIHRoaXMubGFuZyA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdsYW5nJywgJ2xhbmd1YWdlJ10pXG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIHZhciBlbW1ldCwgZXgsIHJlc1xuXG4gICAgZW1tZXQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJlZiwgcmVmMVxuXG4gICAgICBpZiAoKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyAhPT0gbnVsbCA/IHdpbmRvdy5lbW1ldCA6IG51bGwpICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5lbW1ldFxuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ICE9PSBudWxsID8gKHJlZiA9IHdpbmRvdy5zZWxmKSAhPSBudWxsID8gcmVmLmVtbWV0IDogbnVsbCA6IG51bGwpICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZWxmLmVtbWV0XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmMSA9IHdpbmRvdy5nbG9iYWwpICE9IG51bGwgPyByZWYxLmVtbWV0IDogbnVsbCA6IG51bGwpICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nbG9iYWwuZW1tZXRcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlcXVpcmUgIT09ICd1bmRlZmluZWQnICYmIHJlcXVpcmUgIT09IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnZW1tZXQnKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGV4ID0gZXJyb3JcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmxvZ2dlci5sb2coJ0VtbWV0IGlzIG5vdCBhdmFpbGFibGUsIGl0IG1heSBuZWVkIHRvIGJlIGluc3RhbGxlZCBtYW51YWxseScpXG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0uY2FsbCh0aGlzKSlcblxuICAgIGlmIChlbW1ldCAhPSBudWxsKSB7XG4gICAgICAvLyBlbW1ldC5yZXF1aXJlKCcuL3BhcnNlci9hYmJyZXZpYXRpb24nKS5leHBhbmQoJ3VsPmxpJywge3Bhc3RlZENvbnRlbnQ6J2xvcmVtJ30pXG4gICAgICByZXMgPSBlbW1ldC5leHBhbmRBYmJyZXZpYXRpb24odGhpcy5hYmJyLCB0aGlzLmxhbmcpXG4gICAgICByZXR1cm4gcmVzLnJlcGxhY2UoL1xcJFxcezBcXH0vZywgJ3wnKVxuICAgIH1cbiAgfVxufVxuIiwiXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi4vQ29tbWFuZCcpLkNvbW1hbmRcblxuY29uc3QgQm94SGVscGVyID0gcmVxdWlyZSgnLi4vQm94SGVscGVyJykuQm94SGVscGVyXG5cbmNvbnN0IEVkaXRDbWRQcm9wID0gcmVxdWlyZSgnLi4vRWRpdENtZFByb3AnKS5FZGl0Q21kUHJvcFxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBQYXRoSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9QYXRoSGVscGVyJykuUGF0aEhlbHBlclxuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxudmFyIGRlbGV0ZUNvbW1hbmQsIHJlYWRDb21tYW5kLCB3cml0ZUNvbW1hbmRcbnZhciBGaWxlQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgRmlsZUNvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChjbWRzKSB7XG4gICAgdmFyIGNvcmVcbiAgICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2ZpbGUnKSlcbiAgICByZXR1cm4gY29yZS5hZGRDbWRzKHtcbiAgICAgIHJlYWQ6IHtcbiAgICAgICAgcmVzdWx0OiByZWFkQ29tbWFuZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ2ZpbGUnXSxcbiAgICAgICAgaGVscDogJ3JlYWQgdGhlIGNvbnRlbnQgb2YgYSBmaWxlJ1xuICAgICAgfSxcbiAgICAgIHdyaXRlOiB7XG4gICAgICAgIHJlc3VsdDogd3JpdGVDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnZmlsZScsICdjb250ZW50J10sXG4gICAgICAgIGhlbHA6ICdzYXZlIGludG8gYSBmaWxlJ1xuICAgICAgfSxcbiAgICAgIGRlbGV0ZToge1xuICAgICAgICByZXN1bHQ6IGRlbGV0ZUNvbW1hbmQsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydmaWxlJ10sXG4gICAgICAgIGhlbHA6ICdkZWxldGUgYSBmaWxlJ1xuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbmV4cG9ydHMuRmlsZUNvbW1hbmRQcm92aWRlciA9IEZpbGVDb21tYW5kUHJvdmlkZXJcblxucmVhZENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGZpbGUsIGZpbGVTeXN0ZW1cbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKVxuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pXG5cbiAgaWYgKGZpbGVTeXN0ZW0pIHtcbiAgICByZXR1cm4gZmlsZVN5c3RlbS5yZWFkRmlsZShmaWxlKVxuICB9XG59XG5cbndyaXRlQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgY29udGVudCwgZmlsZSwgZmlsZVN5c3RlbVxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2ZpbGUnXSlcbiAgY29udGVudCA9IGluc3RhbmNlLmNvbnRlbnQgfHwgaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdjb250ZW50J10pXG5cbiAgaWYgKGZpbGVTeXN0ZW0pIHtcbiAgICByZXR1cm4gZmlsZVN5c3RlbS53cml0ZUZpbGUoZmlsZSwgY29udGVudClcbiAgfVxufVxuXG5kZWxldGVDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtXG4gIGZpbGVTeXN0ZW0gPSBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRGaWxlU3lzdGVtKClcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKVxuXG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0uZGVsZXRlRmlsZShmaWxlKVxuICB9XG59XG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuXG52YXIgSHRtbENvbW1hbmRQcm92aWRlciA9IGNsYXNzIEh0bWxDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlciAoY21kcykge1xuICAgIHZhciBjc3MsIGh0bWxcbiAgICBodG1sID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2h0bWwnKSlcbiAgICBodG1sLmFkZENtZHMoe1xuICAgICAgZmFsbGJhY2s6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGxhbmc6ICdodG1sJ1xuICAgICAgICB9LFxuICAgICAgICBuYW1lVG9QYXJhbTogJ2FiYnInXG4gICAgICB9XG4gICAgfSlcbiAgICBjc3MgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY3NzJykpXG4gICAgcmV0dXJuIGNzcy5hZGRDbWRzKHtcbiAgICAgIGZhbGxiYWNrOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmVtbWV0JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBsYW5nOiAnY3NzJ1xuICAgICAgICB9LFxuICAgICAgICBuYW1lVG9QYXJhbTogJ2FiYnInXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5IdG1sQ29tbWFuZFByb3ZpZGVyID0gSHRtbENvbW1hbmRQcm92aWRlclxuIiwiXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi4vQ29tbWFuZCcpLkNvbW1hbmRcblxudmFyIEpzQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSnNDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlciAoY21kcykge1xuICAgIHZhciBqc1xuICAgIGpzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2pzJykpXG4gICAgY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2phdmFzY3JpcHQnLCB7XG4gICAgICBhbGlhc09mOiAnanMnXG4gICAgfSkpXG4gICAgcmV0dXJuIGpzLmFkZENtZHMoe1xuICAgICAgY29tbWVudDogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgIGlmOiAnaWYofCl7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgIGxvZzogJ2lmKHdpbmRvdy5jb25zb2xlKXtcXG5cXHRjb25zb2xlLmxvZyh+fmNvbnRlbnR+fnwpXFxufScsXG4gICAgICBmdW5jdGlvbjogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgIGZ1bmN0OiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICBmOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICBmb3I6ICdmb3IgKHZhciBpID0gMDsgaSA8IHw7IGkrKykge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICBmb3JpbjogJ2ZvciAodmFyIHZhbCBpbiB8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgIGVhY2g6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgIGZvcmVhY2g6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZvcmluJ1xuICAgICAgfSxcbiAgICAgIHdoaWxlOiAnd2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICB3aGlsZWk6ICd2YXIgaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+Y29udGVudH5+XFxuXFx0aSsrO1xcbn0nLFxuICAgICAgaWZlbHNlOiAnaWYoIHwgKSB7XFxuXFx0fn5jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgaWZlOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczppZmVsc2UnXG4gICAgICB9LFxuICAgICAgc3dpdGNoOiAnc3dpdGNoKCB8ICkgeyBcXG5cXHRjYXNlIDpcXG5cXHRcXHR+fmNvbnRlbnR+flxcblxcdFxcdGJyZWFrO1xcblxcdGRlZmF1bHQgOlxcblxcdFxcdFxcblxcdFxcdGJyZWFrO1xcbn0nXG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5Kc0NvbW1hbmRQcm92aWRlciA9IEpzQ29tbWFuZFByb3ZpZGVyXG4iLCJcbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBQYWlyRGV0ZWN0b3IgPSByZXF1aXJlKCcuLi9kZXRlY3RvcnMvUGFpckRldGVjdG9yJykuUGFpckRldGVjdG9yXG5cbnZhciB3cmFwV2l0aFBocFxudmFyIFBocENvbW1hbmRQcm92aWRlciA9IGNsYXNzIFBocENvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChjbWRzKSB7XG4gICAgdmFyIHBocCwgcGhwSW5uZXIsIHBocE91dGVyXG4gICAgcGhwID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ3BocCcpKVxuICAgIHBocC5hZGREZXRlY3RvcihuZXcgUGFpckRldGVjdG9yKHtcbiAgICAgIHJlc3VsdDogJ3BocDppbm5lcicsXG4gICAgICBvcGVuZXI6ICc8P3BocCcsXG4gICAgICBjbG9zZXI6ICc/PicsXG4gICAgICBvcHRpb25uYWxfZW5kOiB0cnVlLFxuICAgICAgZWxzZTogJ3BocDpvdXRlcidcbiAgICB9KSlcbiAgICBwaHBPdXRlciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ291dGVyJykpXG4gICAgcGhwT3V0ZXIuYWRkQ21kcyh7XG4gICAgICBmYWxsYmFjazoge1xuICAgICAgICBjbWRzOiB7XG4gICAgICAgICAgYW55X2NvbnRlbnQ6IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnLFxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgcHJlZml4OiAnID8+XFxuJyxcbiAgICAgICAgICAgICAgc3VmZml4OiAnXFxuPD9waHAgJyxcbiAgICAgICAgICAgICAgYWZmaXhlc19lbXB0eTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjolbmFtZSUnLFxuICAgICAgICBhbHRlclJlc3VsdDogd3JhcFdpdGhQaHBcbiAgICAgIH0sXG4gICAgICBib3g6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Ym94JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb21tZW50OiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgcGhwOiAnPD9waHBcXG5cXHR+fmNvbnRlbnR+fnxcXG4/PidcbiAgICB9KVxuICAgIHBocElubmVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnaW5uZXInKSlcbiAgICByZXR1cm4gcGhwSW5uZXIuYWRkQ21kcyh7XG4gICAgICBhbnlfY29udGVudDoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50J1xuICAgICAgfSxcbiAgICAgIGNvbW1lbnQ6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBpZjogJ2lmKHwpe1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgaW5mbzogJ3BocGluZm8oKTsnLFxuICAgICAgZWNobzogJ2VjaG8gfCcsXG4gICAgICBlOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZWNobydcbiAgICAgIH0sXG4gICAgICBjbGFzczoge1xuICAgICAgICByZXN1bHQ6ICdjbGFzcyB+fnBhcmFtIDAgY2xhc3MgZGVmOnx+fiB7XFxuXFx0ZnVuY3Rpb24gX19jb25zdHJ1Y3QoKSB7XFxuXFx0XFx0fn5jb250ZW50fn58XFxuXFx0fVxcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGM6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpjbGFzcydcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbjoge1xuICAgICAgICByZXN1bHQ6ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZnVuY3Q6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICBmOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgYXJyYXk6ICckfCA9IGFycmF5KCk7JyxcbiAgICAgIGE6ICdhcnJheSgpJyxcbiAgICAgIGZvcjogJ2ZvciAoJGkgPSAwOyAkaSA8ICR8OyAkaSsrKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICBmb3JlYWNoOiAnZm9yZWFjaCAoJHwgYXMgJGtleSA9PiAkdmFsKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICBlYWNoOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Zm9yZWFjaCdcbiAgICAgIH0sXG4gICAgICB3aGlsZTogJ3doaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgIHdoaWxlaToge1xuICAgICAgICByZXN1bHQ6ICckaSA9IDA7XFxud2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcblxcdCRpKys7XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaWZlbHNlOiAnaWYoIHwgKSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAgIGlmZToge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmlmZWxzZSdcbiAgICAgIH0sXG4gICAgICBzd2l0Y2g6IHtcbiAgICAgICAgcmVzdWx0OiAnc3dpdGNoKCB8ICkgeyBcXG5cXHRjYXNlIDpcXG5cXHRcXHR+fmFueV9jb250ZW50fn5cXG5cXHRcXHRicmVhaztcXG5cXHRkZWZhdWx0IDpcXG5cXHRcXHRcXG5cXHRcXHRicmVhaztcXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjbG9zZToge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpjbG9zZScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nLFxuICAgICAgICAgIHN1ZmZpeDogJ1xcbj8+JyxcbiAgICAgICAgICByZXF1aXJlZF9hZmZpeGVzOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5QaHBDb21tYW5kUHJvdmlkZXIgPSBQaHBDb21tYW5kUHJvdmlkZXJcblxud3JhcFdpdGhQaHAgPSBmdW5jdGlvbiAocmVzdWx0LCBpbnN0YW5jZSkge1xuICB2YXIgaW5saW5lLCByZWdDbG9zZSwgcmVnT3BlblxuICBpbmxpbmUgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3BocF9pbmxpbmUnLCAnaW5saW5lJ10sIHRydWUpXG5cbiAgaWYgKGlubGluZSkge1xuICAgIHJlZ09wZW4gPSAvPFxcP3BocFxccyhbXFxcXG5cXFxcclxcc10rKS9nXG4gICAgcmVnQ2xvc2UgPSAvKFtcXG5cXHJcXHNdKylcXHNcXD8+L2dcbiAgICByZXR1cm4gJzw/cGhwICcgKyByZXN1bHQucmVwbGFjZShyZWdPcGVuLCAnJDE8P3BocCAnKS5yZXBsYWNlKHJlZ0Nsb3NlLCAnID8+JDEnKSArICcgPz4nXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8P3BocFxcbicgKyBTdHJpbmdIZWxwZXIuaW5kZW50KHJlc3VsdCkgKyAnXFxuPz4nXG4gIH1cbn0gLy8gY2xvc2VQaHBGb3JDb250ZW50ID0gKGluc3RhbmNlKSAtPlxuLy8gICBpbnN0YW5jZS5jb250ZW50ID0gJyA/PicrKGluc3RhbmNlLmNvbnRlbnQgfHwgJycpKyc8P3BocCAnXG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBBbHdheXNFbmFibGVkID0gcmVxdWlyZSgnLi4vZGV0ZWN0b3JzL0Fsd2F5c0VuYWJsZWQnKS5BbHdheXNFbmFibGVkXG5cbnZhciBpbmZsZWN0aW9uID0gaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKCdpbmZsZWN0aW9uJykpXG5cbmZ1bmN0aW9uIGludGVyb3BSZXF1aXJlV2lsZGNhcmQgKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmogfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYykgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XSB9IH0gfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqIH0gfVxuXG52YXIgU3RyaW5nQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgU3RyaW5nQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIgKHJvb3QpIHtcbiAgICB2YXIgY21kc1xuICAgIGNtZHMgPSByb290LmFkZENtZChuZXcgQ29tbWFuZCgnc3RyaW5nJykpXG4gICAgcm9vdC5hZGRDbWQobmV3IENvbW1hbmQoJ3N0cicsIHtcbiAgICAgIGFsaWFzT2Y6ICdzdHJpbmcnXG4gICAgfSkpXG4gICAgcm9vdC5hZGREZXRlY3RvcihuZXcgQWx3YXlzRW5hYmxlZCgnc3RyaW5nJykpXG4gICAgcmV0dXJuIGNtZHMuYWRkQ21kcyh7XG4gICAgICBwbHVyYWxpemU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5wbHVyYWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1BsdXJhbGl6ZSBhIHN0cmluZydcbiAgICAgIH0sXG4gICAgICBzaW5ndWxhcml6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJ10sXG4gICAgICAgIGhlbHA6ICdTaW5ndWxhcml6ZSBhIHN0cmluZydcbiAgICAgIH0sXG4gICAgICBjYW1lbGl6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmNhbWVsaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pLCAhaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsxLCAnZmlyc3QnXSwgdHJ1ZSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInLCAnZmlyc3QnXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgZnJvbSB1bmRlcnNjb3JlIHRvIGNhbWVsY2FzZSdcbiAgICAgIH0sXG4gICAgICB1bmRlcnNjb3JlOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24udW5kZXJzY29yZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSwgaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsxLCAndXBwZXInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInLCAndXBwZXInXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgZnJvbSBjYW1lbGNhc2UgdG8gdW5kZXJzY29yZS4nXG4gICAgICB9LFxuICAgICAgaHVtYW5pemU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5odW1hbml6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSwgaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsxLCAnZmlyc3QnXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInLCAnZmlyc3QnXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSBodW1hbiByZWFkYWJsZSBmb3JtYXQnXG4gICAgICB9LFxuICAgICAgY2FwaXRhbGl6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmNhcGl0YWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ01ha2UgdGhlIGZpcnN0IGxldHRlciBvZiBhIHN0cmluZyB1cHBlcidcbiAgICAgIH0sXG4gICAgICBkYXNoZXJpemU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5kYXNoZXJpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1JlcGxhY2VzIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzIGluIGEgc3RyaW5nLidcbiAgICAgIH0sXG4gICAgICB0aXRsZWl6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnRpdGxlaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJ10sXG4gICAgICAgIGhlbHA6ICdUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgaHVtYW4gcmVhZGFibGUgZm9ybWF0IHdpdGggbW9zdCB3b3JkcyBjYXBpdGFsaXplZCdcbiAgICAgIH0sXG4gICAgICB0YWJsZWl6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnRhYmxlaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJ10sXG4gICAgICAgIGhlbHA6ICdUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgdGFibGUgZm9ybWF0J1xuICAgICAgfSxcbiAgICAgIGNsYXNzaWZ5OiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2xhc3NpZnkoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSBjbGFzcyBmb3JtYXQnXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5TdHJpbmdDb21tYW5kUHJvdmlkZXIgPSBTdHJpbmdDb21tYW5kUHJvdmlkZXJcbiIsIlxuY29uc3QgRGV0ZWN0b3IgPSByZXF1aXJlKCcuL0RldGVjdG9yJykuRGV0ZWN0b3JcblxudmFyIEFsd2F5c0VuYWJsZWQgPSBjbGFzcyBBbHdheXNFbmFibGVkIGV4dGVuZHMgRGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvciAobmFtZXNwYWNlKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlXG4gIH1cblxuICBkZXRlY3QgKGZpbmRlcikge1xuICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZVxuICB9XG59XG5leHBvcnRzLkFsd2F5c0VuYWJsZWQgPSBBbHdheXNFbmFibGVkXG4iLCJcbnZhciBEZXRlY3RvciA9IGNsYXNzIERldGVjdG9yIHtcbiAgY29uc3RydWN0b3IgKGRhdGEgPSB7fSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGFcbiAgfVxuXG4gIGRldGVjdCAoZmluZGVyKSB7XG4gICAgaWYgKHRoaXMuZGV0ZWN0ZWQoZmluZGVyKSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5yZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnJlc3VsdFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5kYXRhLmVsc2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmVsc2VcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXRlY3RlZCAoZmluZGVyKSB7fVxufVxuZXhwb3J0cy5EZXRlY3RvciA9IERldGVjdG9yXG4iLCJcbmNvbnN0IERldGVjdG9yID0gcmVxdWlyZSgnLi9EZXRlY3RvcicpLkRldGVjdG9yXG5cbnZhciBMYW5nRGV0ZWN0b3IgPSBjbGFzcyBMYW5nRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdCAoZmluZGVyKSB7XG4gICAgdmFyIGxhbmdcblxuICAgIGlmIChmaW5kZXIuY29kZXdhdmUgIT0gbnVsbCkge1xuICAgICAgbGFuZyA9IGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IuZ2V0TGFuZygpXG5cbiAgICAgIGlmIChsYW5nICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5MYW5nRGV0ZWN0b3IgPSBMYW5nRGV0ZWN0b3JcbiIsIlxuY29uc3QgUGFpciA9IHJlcXVpcmUoJy4uL3Bvc2l0aW9uaW5nL1BhaXInKS5QYWlyXG5cbmNvbnN0IERldGVjdG9yID0gcmVxdWlyZSgnLi9EZXRlY3RvcicpLkRldGVjdG9yXG5cbnZhciBQYWlyRGV0ZWN0b3IgPSBjbGFzcyBQYWlyRGV0ZWN0b3IgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGRldGVjdGVkIChmaW5kZXIpIHtcbiAgICB2YXIgcGFpclxuXG4gICAgaWYgKHRoaXMuZGF0YS5vcGVuZXIgIT0gbnVsbCAmJiB0aGlzLmRhdGEuY2xvc2VyICE9IG51bGwgJiYgZmluZGVyLmluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHBhaXIgPSBuZXcgUGFpcih0aGlzLmRhdGEub3BlbmVyLCB0aGlzLmRhdGEuY2xvc2VyLCB0aGlzLmRhdGEpXG5cbiAgICAgIGlmIChwYWlyLmlzV2FwcGVyT2YoZmluZGVyLmluc3RhbmNlLmdldFBvcygpLCBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLnRleHQoKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuZXhwb3J0cy5QYWlyRGV0ZWN0b3IgPSBQYWlyRGV0ZWN0b3JcbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBib290c3RyYXAgPSByZXF1aXJlKCcuL2Jvb3RzdHJhcCcpXG5cbmNvbnN0IFRleHRBcmVhRWRpdG9yID0gcmVxdWlyZSgnLi9UZXh0QXJlYUVkaXRvcicpXG5cbmJvb3RzdHJhcC5Db2Rld2F2ZS5kZXRlY3QgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIHZhciBjd1xuICBjdyA9IG5ldyBib290c3RyYXAuQ29kZXdhdmUobmV3IFRleHRBcmVhRWRpdG9yLlRleHRBcmVhRWRpdG9yKHRhcmdldCkpXG5cbiAgYm9vdHN0cmFwLkNvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KVxuXG4gIHJldHVybiBjd1xufVxuXG5ib290c3RyYXAuQ29kZXdhdmUucmVxdWlyZSA9IHJlcXVpcmVcbndpbmRvdy5Db2Rld2F2ZSA9IGJvb3RzdHJhcC5Db2Rld2F2ZVxuIiwiXG52YXIgQXJyYXlIZWxwZXIgPSBjbGFzcyBBcnJheUhlbHBlciB7XG4gIHN0YXRpYyBpc0FycmF5IChhcnIpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfVxuXG4gIHN0YXRpYyB1bmlvbiAoYTEsIGEyKSB7XG4gICAgcmV0dXJuIHRoaXMudW5pcXVlKGExLmNvbmNhdChhMikpXG4gIH1cblxuICBzdGF0aWMgdW5pcXVlIChhcnJheSkge1xuICAgIHZhciBhLCBpLCBqXG4gICAgYSA9IGFycmF5LmNvbmNhdCgpXG4gICAgaSA9IDBcblxuICAgIHdoaWxlIChpIDwgYS5sZW5ndGgpIHtcbiAgICAgIGogPSBpICsgMVxuXG4gICAgICB3aGlsZSAoaiA8IGEubGVuZ3RoKSB7XG4gICAgICAgIGlmIChhW2ldID09PSBhW2pdKSB7XG4gICAgICAgICAgYS5zcGxpY2Uoai0tLCAxKVxuICAgICAgICB9XG5cbiAgICAgICAgKytqXG4gICAgICB9XG5cbiAgICAgICsraVxuICAgIH1cblxuICAgIHJldHVybiBhXG4gIH1cbn1cbmV4cG9ydHMuQXJyYXlIZWxwZXIgPSBBcnJheUhlbHBlclxuIiwiXG52YXIgQ29tbW9uSGVscGVyID0gY2xhc3MgQ29tbW9uSGVscGVyIHtcbiAgc3RhdGljIG1lcmdlICguLi54cykge1xuICAgIGlmICgoeHMgIT0gbnVsbCA/IHhzLmxlbmd0aCA6IG51bGwpID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFwKHt9LCBmdW5jdGlvbiAobSkge1xuICAgICAgICB2YXIgaSwgaywgbGVuLCByZXN1bHRzLCB2LCB4XG4gICAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHhzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgeCA9IHhzW2ldXG4gICAgICAgICAgcmVzdWx0cy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzMVxuICAgICAgICAgICAgcmVzdWx0czEgPSBbXVxuXG4gICAgICAgICAgICBmb3IgKGsgaW4geCkge1xuICAgICAgICAgICAgICB2ID0geFtrXVxuICAgICAgICAgICAgICByZXN1bHRzMS5wdXNoKG1ba10gPSB2KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0czFcbiAgICAgICAgICB9KCkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdGFwIChvLCBmbikge1xuICAgIGZuKG8pXG4gICAgcmV0dXJuIG9cbiAgfVxuXG4gIHN0YXRpYyBhcHBseU1peGlucyAoZGVyaXZlZEN0b3IsIGJhc2VDdG9ycykge1xuICAgIHJldHVybiBiYXNlQ3RvcnMuZm9yRWFjaChiYXNlQ3RvciA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLCBuYW1lLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2VDdG9yLnByb3RvdHlwZSwgbmFtZSkpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbmV4cG9ydHMuQ29tbW9uSGVscGVyID0gQ29tbW9uSGVscGVyXG4iLCJcbnZhciBOYW1lc3BhY2VIZWxwZXIgPSBjbGFzcyBOYW1lc3BhY2VIZWxwZXIge1xuICBzdGF0aWMgc3BsaXRGaXJzdCAoZnVsbG5hbWUsIGlzU3BhY2UgPSBmYWxzZSkge1xuICAgIHZhciBwYXJ0c1xuXG4gICAgaWYgKGZ1bGxuYW1lLmluZGV4T2YoJzonKSA9PT0gLTEgJiYgIWlzU3BhY2UpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdXG4gICAgfVxuXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgcmV0dXJuIFtwYXJ0cy5zaGlmdCgpLCBwYXJ0cy5qb2luKCc6JykgfHwgbnVsbF1cbiAgfVxuXG4gIHN0YXRpYyBzcGxpdCAoZnVsbG5hbWUpIHtcbiAgICB2YXIgbmFtZSwgcGFydHNcblxuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKCc6JykgPT09IC0xKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXVxuICAgIH1cblxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIG5hbWUgPSBwYXJ0cy5wb3AoKVxuICAgIHJldHVybiBbcGFydHMuam9pbignOicpLCBuYW1lXVxuICB9XG59XG5leHBvcnRzLk5hbWVzcGFjZUhlbHBlciA9IE5hbWVzcGFjZUhlbHBlclxuIiwiXG52YXIgT3B0aW9uYWxQcm9taXNlID0gY2xhc3MgT3B0aW9uYWxQcm9taXNlIHtcbiAgY29uc3RydWN0b3IgKHZhbDEpIHtcbiAgICB0aGlzLnZhbCA9IHZhbDFcblxuICAgIGlmICh0aGlzLnZhbCAhPSBudWxsICYmIHRoaXMudmFsLnRoZW4gIT0gbnVsbCAmJiB0aGlzLnZhbC5yZXN1bHQgIT0gbnVsbCkge1xuICAgICAgdGhpcy52YWwgPSB0aGlzLnZhbC5yZXN1bHQoKVxuICAgIH1cbiAgfVxuXG4gIHRoZW4gKGNiKSB7XG4gICAgaWYgKHRoaXMudmFsICE9IG51bGwgJiYgdGhpcy52YWwudGhlbiAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh0aGlzLnZhbC50aGVuKGNiKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UoY2IodGhpcy52YWwpKVxuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsXG4gIH1cbn1cbmV4cG9ydHMuT3B0aW9uYWxQcm9taXNlID0gT3B0aW9uYWxQcm9taXNlXG5cbnZhciBvcHRpb25hbFByb21pc2UgPSBmdW5jdGlvbiAodmFsKSB7XG4gIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKHZhbClcbn1cblxuZXhwb3J0cy5vcHRpb25hbFByb21pc2UgPSBvcHRpb25hbFByb21pc2VcbiIsIlxudmFyIFBhdGhIZWxwZXIgPSBjbGFzcyBQYXRoSGVscGVyIHtcbiAgc3RhdGljIGdldFBhdGggKG9iaiwgcGF0aCwgc2VwID0gJy4nKSB7XG4gICAgdmFyIGN1ciwgcGFydHNcbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKVxuICAgIGN1ciA9IG9ialxuICAgIHBhcnRzLmZpbmQocGFydCA9PiB7XG4gICAgICBjdXIgPSBjdXJbcGFydF1cbiAgICAgIHJldHVybiB0eXBlb2YgY3VyID09PSAndW5kZWZpbmVkJ1xuICAgIH0pXG4gICAgcmV0dXJuIGN1clxuICB9XG5cbiAgc3RhdGljIHNldFBhdGggKG9iaiwgcGF0aCwgdmFsLCBzZXAgPSAnLicpIHtcbiAgICB2YXIgbGFzdCwgcGFydHNcbiAgICBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKVxuICAgIGxhc3QgPSBwYXJ0cy5wb3AoKVxuICAgIHJldHVybiBwYXJ0cy5yZWR1Y2UoKGN1ciwgcGFydCkgPT4ge1xuICAgICAgaWYgKGN1cltwYXJ0XSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjdXJbcGFydF1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjdXJbcGFydF0gPSB7fVxuICAgICAgfVxuICAgIH0sIG9iailbbGFzdF0gPSB2YWxcbiAgfVxufVxuZXhwb3J0cy5QYXRoSGVscGVyID0gUGF0aEhlbHBlclxuIiwiXG5jb25zdCBTaXplID0gcmVxdWlyZSgnLi4vcG9zaXRpb25pbmcvU2l6ZScpLlNpemVcblxudmFyIFN0cmluZ0hlbHBlciA9IGNsYXNzIFN0cmluZ0hlbHBlciB7XG4gIHN0YXRpYyB0cmltRW1wdHlMaW5lICh0eHQpIHtcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJylcbiAgfVxuXG4gIHN0YXRpYyBlc2NhcGVSZWdFeHAgKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csICdcXFxcJCYnKVxuICB9XG5cbiAgc3RhdGljIHJlcGVhdFRvTGVuZ3RoICh0eHQsIGxlbmd0aCkge1xuICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuXG4gICAgcmV0dXJuIEFycmF5KE1hdGguY2VpbChsZW5ndGggLyB0eHQubGVuZ3RoKSArIDEpLmpvaW4odHh0KS5zdWJzdHJpbmcoMCwgbGVuZ3RoKVxuICB9XG5cbiAgc3RhdGljIHJlcGVhdCAodHh0LCBuYikge1xuICAgIHJldHVybiBBcnJheShuYiArIDEpLmpvaW4odHh0KVxuICB9XG5cbiAgc3RhdGljIGdldFR4dFNpemUgKHR4dCkge1xuICAgIHZhciBqLCBsLCBsZW4sIGxpbmVzLCB3XG4gICAgbGluZXMgPSB0eHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdCgnXFxuJylcbiAgICB3ID0gMFxuXG4gICAgZm9yIChqID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIGwgPSBsaW5lc1tqXVxuICAgICAgdyA9IE1hdGgubWF4KHcsIGwubGVuZ3RoKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgU2l6ZSh3LCBsaW5lcy5sZW5ndGggLSAxKVxuICB9XG5cbiAgc3RhdGljIGluZGVudE5vdEZpcnN0ICh0ZXh0LCBuYiA9IDEsIHNwYWNlcyA9ICcgICcpIHtcbiAgICB2YXIgcmVnXG5cbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZWcgPSAvXFxuL2dcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCAnXFxuJyArIHRoaXMucmVwZWF0KHNwYWNlcywgbmIpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dFxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnQgKHRleHQsIG5iID0gMSwgc3BhY2VzID0gJyAgJykge1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBzcGFjZXMgKyB0aGlzLmluZGVudE5vdEZpcnN0KHRleHQsIG5iLCBzcGFjZXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHJldmVyc2VTdHIgKHR4dCkge1xuICAgIHJldHVybiB0eHQuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKVxuICB9XG5cbiAgc3RhdGljIHJlbW92ZUNhcnJldCAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIHJlQ2FycmV0LCByZVF1b3RlZCwgcmVUbXAsIHRtcFxuICAgIHRtcCA9ICdbW1tbcXVvdGVkX2NhcnJldF1dXV0nXG4gICAgcmVDYXJyZXQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIpLCAnZycpXG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgJ2cnKVxuICAgIHJlVG1wID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cCh0bXApLCAnZycpXG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKHJlUXVvdGVkLCB0bXApLnJlcGxhY2UocmVDYXJyZXQsICcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKVxuICB9XG5cbiAgc3RhdGljIGdldEFuZFJlbW92ZUZpcnN0Q2FycmV0ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcG9zXG4gICAgcG9zID0gdGhpcy5nZXRDYXJyZXRQb3ModHh0LCBjYXJyZXRDaGFyKVxuXG4gICAgaWYgKHBvcyAhPSBudWxsKSB7XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAsIHBvcykgKyB0eHQuc3Vic3RyKHBvcyArIGNhcnJldENoYXIubGVuZ3RoKVxuICAgICAgcmV0dXJuIFtwb3MsIHR4dF1cbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0Q2FycmV0UG9zICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgaSwgcmVRdW90ZWRcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciArIGNhcnJldENoYXIpLCAnZycpXG4gICAgdHh0ID0gdHh0LnJlcGxhY2UocmVRdW90ZWQsICcgJylcblxuICAgIGlmICgoaSA9IHR4dC5pbmRleE9mKGNhcnJldENoYXIpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gaVxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5TdHJpbmdIZWxwZXIgPSBTdHJpbmdIZWxwZXJcbiIsIlxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9Qb3MnKS5Qb3NcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInKS5TdHJpbmdIZWxwZXJcblxuY29uc3QgUGFpck1hdGNoID0gcmVxdWlyZSgnLi9QYWlyTWF0Y2gnKS5QYWlyTWF0Y2hcblxudmFyIFBhaXIgPSBjbGFzcyBQYWlyIHtcbiAgY29uc3RydWN0b3IgKG9wZW5lciwgY2xvc2VyLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsXG4gICAgdGhpcy5vcGVuZXIgPSBvcGVuZXJcbiAgICB0aGlzLmNsb3NlciA9IGNsb3NlclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IGZhbHNlLFxuICAgICAgdmFsaWRNYXRjaDogbnVsbFxuICAgIH1cblxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldXG5cbiAgICAgIGlmIChrZXkgaW4gdGhpcy5vcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMub3B0aW9uc1trZXldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvcGVuZXJSZWcgKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vcGVuZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMub3BlbmVyKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMub3BlbmVyXG4gICAgfVxuICB9XG5cbiAgY2xvc2VyUmVnICgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuY2xvc2VyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNsb3NlcikpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NlclxuICAgIH1cbiAgfVxuXG4gIG1hdGNoQW55UGFydHMgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvcGVuZXI6IHRoaXMub3BlbmVyUmVnKCksXG4gICAgICBjbG9zZXI6IHRoaXMuY2xvc2VyUmVnKClcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueVBhcnRLZXlzICgpIHtcbiAgICB2YXIga2V5LCBrZXlzLCByZWYsIHJlZ1xuICAgIGtleXMgPSBbXVxuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpXG5cbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHJlZyA9IHJlZltrZXldXG4gICAgICBrZXlzLnB1c2goa2V5KVxuICAgIH1cblxuICAgIHJldHVybiBrZXlzXG4gIH1cblxuICBtYXRjaEFueVJlZyAoKSB7XG4gICAgdmFyIGdyb3Vwcywga2V5LCByZWYsIHJlZ1xuICAgIGdyb3VwcyA9IFtdXG4gICAgcmVmID0gdGhpcy5tYXRjaEFueVBhcnRzKClcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV1cbiAgICAgIGdyb3Vwcy5wdXNoKCcoJyArIHJlZy5zb3VyY2UgKyAnKScpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoZ3JvdXBzLmpvaW4oJ3wnKSlcbiAgfVxuXG4gIG1hdGNoQW55ICh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoXG5cbiAgICB3aGlsZSAoKG1hdGNoID0gdGhpcy5fbWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkgIT0gbnVsbCAmJiAhbWF0Y2gudmFsaWQoKSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKClcbiAgICB9XG5cbiAgICBpZiAobWF0Y2ggIT0gbnVsbCAmJiBtYXRjaC52YWxpZCgpKSB7XG4gICAgICByZXR1cm4gbWF0Y2hcbiAgICB9XG4gIH1cblxuICBfbWF0Y2hBbnkgKHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2hcblxuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cihvZmZzZXQpXG4gICAgfVxuXG4gICAgbWF0Y2ggPSB0aGlzLm1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KVxuXG4gICAgaWYgKG1hdGNoICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgUGFpck1hdGNoKHRoaXMsIG1hdGNoLCBvZmZzZXQpXG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlOYW1lZCAodGV4dCkge1xuICAgIHJldHVybiB0aGlzLl9tYXRjaEFueUdldE5hbWUodGhpcy5tYXRjaEFueSh0ZXh0KSlcbiAgfVxuXG4gIG1hdGNoQW55TGFzdCAodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaCwgcmVzXG5cbiAgICB3aGlsZSAobWF0Y2ggPSB0aGlzLm1hdGNoQW55KHRleHQsIG9mZnNldCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpXG5cbiAgICAgIGlmICghcmVzIHx8IHJlcy5lbmQoKSAhPT0gbWF0Y2guZW5kKCkpIHtcbiAgICAgICAgcmVzID0gbWF0Y2hcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICBpZGVudGljYWwgKCkge1xuICAgIHJldHVybiB0aGlzLm9wZW5lciA9PT0gdGhpcy5jbG9zZXIgfHwgdGhpcy5vcGVuZXIuc291cmNlICE9IG51bGwgJiYgdGhpcy5jbG9zZXIuc291cmNlICE9IG51bGwgJiYgdGhpcy5vcGVuZXIuc291cmNlID09PSB0aGlzLmNsb3Nlci5zb3VyY2VcbiAgfVxuXG4gIHdyYXBwZXJQb3MgKHBvcywgdGV4dCkge1xuICAgIHZhciBlbmQsIHN0YXJ0XG4gICAgc3RhcnQgPSB0aGlzLm1hdGNoQW55TGFzdCh0ZXh0LnN1YnN0cigwLCBwb3Muc3RhcnQpKVxuXG4gICAgaWYgKHN0YXJ0ICE9IG51bGwgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgc3RhcnQubmFtZSgpID09PSAnb3BlbmVyJykpIHtcbiAgICAgIGVuZCA9IHRoaXMubWF0Y2hBbnkodGV4dCwgcG9zLmVuZClcblxuICAgICAgaWYgKGVuZCAhPSBudWxsICYmICh0aGlzLmlkZW50aWNhbCgpIHx8IGVuZC5uYW1lKCkgPT09ICdjbG9zZXInKSkge1xuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLCBlbmQuZW5kKCkpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ubmFsX2VuZCkge1xuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLCB0ZXh0Lmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc1dhcHBlck9mIChwb3MsIHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy53cmFwcGVyUG9zKHBvcywgdGV4dCkgIT0gbnVsbFxuICB9XG59XG5leHBvcnRzLlBhaXIgPSBQYWlyXG4iLCJcbnZhciBQYWlyTWF0Y2ggPSBjbGFzcyBQYWlyTWF0Y2gge1xuICBjb25zdHJ1Y3RvciAocGFpciwgbWF0Y2gsIG9mZnNldCA9IDApIHtcbiAgICB0aGlzLnBhaXIgPSBwYWlyXG4gICAgdGhpcy5tYXRjaCA9IG1hdGNoXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXRcbiAgfVxuXG4gIG5hbWUgKCkge1xuICAgIHZhciBfbmFtZSwgZ3JvdXAsIGksIGosIGxlbiwgcmVmXG5cbiAgICBpZiAodGhpcy5tYXRjaCkge1xuICAgICAgaWYgKHR5cGVvZiBfbmFtZSA9PT0gJ3VuZGVmaW5lZCcgfHwgX25hbWUgPT09IG51bGwpIHtcbiAgICAgICAgcmVmID0gdGhpcy5tYXRjaFxuXG4gICAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgICAgZ3JvdXAgPSByZWZbaV1cblxuICAgICAgICAgIGlmIChpID4gMCAmJiBncm91cCAhPSBudWxsKSB7XG4gICAgICAgICAgICBfbmFtZSA9IHRoaXMucGFpci5tYXRjaEFueVBhcnRLZXlzKClbaSAtIDFdXG4gICAgICAgICAgICByZXR1cm4gX25hbWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfbmFtZSA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfbmFtZSB8fCBudWxsXG4gICAgfVxuICB9XG5cbiAgc3RhcnQgKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoLmluZGV4ICsgdGhpcy5vZmZzZXRcbiAgfVxuXG4gIGVuZCAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm1hdGNoWzBdLmxlbmd0aCArIHRoaXMub2Zmc2V0XG4gIH1cblxuICB2YWxpZCAoKSB7XG4gICAgcmV0dXJuICF0aGlzLnBhaXIudmFsaWRNYXRjaCB8fCB0aGlzLnBhaXIudmFsaWRNYXRjaCh0aGlzKVxuICB9XG5cbiAgbGVuZ3RoICgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaFswXS5sZW5ndGhcbiAgfVxufVxuZXhwb3J0cy5QYWlyTWF0Y2ggPSBQYWlyTWF0Y2hcbiIsIlxudmFyIFBvcyA9IGNsYXNzIFBvcyB7XG4gIGNvbnN0cnVjdG9yIChzdGFydCwgZW5kKSB7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0XG4gICAgdGhpcy5lbmQgPSBlbmRcblxuICAgIGlmICh0aGlzLmVuZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmVuZCA9IHRoaXMuc3RhcnRcbiAgICB9XG4gIH1cblxuICBjb250YWluc1B0IChwdCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0IDw9IHB0ICYmIHB0IDw9IHRoaXMuZW5kXG4gIH1cblxuICBjb250YWluc1BvcyAocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgPD0gcG9zLnN0YXJ0ICYmIHBvcy5lbmQgPD0gdGhpcy5lbmRcbiAgfVxuXG4gIHdyYXBwZWRCeSAocHJlZml4LCBzdWZmaXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcy53cmFwQ2xhc3ModGhpcy5zdGFydCAtIHByZWZpeC5sZW5ndGgsIHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLmVuZCArIHN1ZmZpeC5sZW5ndGgpXG4gIH1cblxuICB3aXRoRWRpdG9yICh2YWwpIHtcbiAgICB0aGlzLl9lZGl0b3IgPSB2YWxcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgZWRpdG9yICgpIHtcbiAgICBpZiAodGhpcy5fZWRpdG9yID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZWRpdG9yIHNldCcpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvclxuICB9XG5cbiAgaGFzRWRpdG9yICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yICE9IG51bGxcbiAgfVxuXG4gIHRleHQgKCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5zdGFydCwgdGhpcy5lbmQpXG4gIH1cblxuICBhcHBseU9mZnNldCAob2Zmc2V0KSB7XG4gICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgdGhpcy5zdGFydCArPSBvZmZzZXRcbiAgICAgIHRoaXMuZW5kICs9IG9mZnNldFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwcmV2RU9MICgpIHtcbiAgICBpZiAodGhpcy5fcHJldkVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9wcmV2RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZVN0YXJ0KHRoaXMuc3RhcnQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3ByZXZFT0xcbiAgfVxuXG4gIG5leHRFT0wgKCkge1xuICAgIGlmICh0aGlzLl9uZXh0RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX25leHRFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lRW5kKHRoaXMuZW5kKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9uZXh0RU9MXG4gIH1cblxuICB0ZXh0V2l0aEZ1bGxMaW5lcyAoKSB7XG4gICAgaWYgKHRoaXMuX3RleHRXaXRoRnVsbExpbmVzID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHRXaXRoRnVsbExpbmVzID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMucHJldkVPTCgpLCB0aGlzLm5leHRFT0woKSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGV4dFdpdGhGdWxsTGluZXNcbiAgfVxuXG4gIHNhbWVMaW5lc1ByZWZpeCAoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNQcmVmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMuc3RhcnQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NhbWVMaW5lc1ByZWZpeFxuICB9XG5cbiAgc2FtZUxpbmVzU3VmZml4ICgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzU3VmZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLmVuZCwgdGhpcy5uZXh0RU9MKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NhbWVMaW5lc1N1ZmZpeFxuICB9XG5cbiAgY29weSAoKSB7XG4gICAgdmFyIHJlc1xuICAgIHJlcyA9IG5ldyBQb3ModGhpcy5zdGFydCwgdGhpcy5lbmQpXG5cbiAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSlcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICByYXcgKCkge1xuICAgIHJldHVybiBbdGhpcy5zdGFydCwgdGhpcy5lbmRdXG4gIH1cbn1cbmV4cG9ydHMuUG9zID0gUG9zXG4iLCJcbmNvbnN0IFdyYXBwaW5nID0gcmVxdWlyZSgnLi9XcmFwcGluZycpLldyYXBwaW5nXG5cbmNvbnN0IFJlcGxhY2VtZW50ID0gcmVxdWlyZSgnLi9SZXBsYWNlbWVudCcpLlJlcGxhY2VtZW50XG5cbmNvbnN0IENvbW1vbkhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJykuQ29tbW9uSGVscGVyXG5cbnZhciBQb3NDb2xsZWN0aW9uID0gY2xhc3MgUG9zQ29sbGVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yIChhcnIpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgYXJyID0gW2Fycl1cbiAgICB9XG5cbiAgICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoYXJyLCBbUG9zQ29sbGVjdGlvbl0pXG5cbiAgICByZXR1cm4gYXJyXG4gIH1cblxuICB3cmFwIChwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIG5ldyBXcmFwcGluZyhwLnN0YXJ0LCBwLmVuZCwgcHJlZml4LCBzdWZmaXgpXG4gICAgfSlcbiAgfVxuXG4gIHJlcGxhY2UgKHR4dCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIG5ldyBSZXBsYWNlbWVudChwLnN0YXJ0LCBwLmVuZCwgdHh0KVxuICAgIH0pXG4gIH1cbn1cbmV4cG9ydHMuUG9zQ29sbGVjdGlvbiA9IFBvc0NvbGxlY3Rpb25cbiIsIlxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9Qb3MnKS5Qb3NcblxuY29uc3QgQ29tbW9uSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9Db21tb25IZWxwZXInKS5Db21tb25IZWxwZXJcblxuY29uc3QgT3B0aW9uT2JqZWN0ID0gcmVxdWlyZSgnLi4vT3B0aW9uT2JqZWN0JykuT3B0aW9uT2JqZWN0XG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbnZhciBSZXBsYWNlbWVudCA9IChmdW5jdGlvbiAoKSB7XG4gIGNsYXNzIFJlcGxhY2VtZW50IGV4dGVuZHMgUG9zIHtcbiAgICBjb25zdHJ1Y3RvciAoc3RhcnQxLCBlbmQsIHRleHQxLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKClcbiAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDFcbiAgICAgIHRoaXMuZW5kID0gZW5kXG4gICAgICB0aGlzLnRleHQgPSB0ZXh0MVxuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucywge1xuICAgICAgICBwcmVmaXg6ICcnLFxuICAgICAgICBzdWZmaXg6ICcnLFxuICAgICAgICBzZWxlY3Rpb25zOiBbXVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXNQb3NCZWZvcmVQcmVmaXggKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnRleHQubGVuZ3RoXG4gICAgfVxuXG4gICAgcmVzRW5kICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5maW5hbFRleHQoKS5sZW5ndGhcbiAgICB9XG5cbiAgICBhcHBseSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS5zcGxpY2VUZXh0KHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLmZpbmFsVGV4dCgpKVxuICAgIH1cblxuICAgIG5lY2Vzc2FyeSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKSAhPT0gdGhpcy5vcmlnaW5hbFRleHQoKVxuICAgIH1cblxuICAgIG9yaWdpbmFsVGV4dCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKVxuICAgIH1cblxuICAgIGZpbmFsVGV4dCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLnRleHQgKyB0aGlzLnN1ZmZpeFxuICAgIH1cblxuICAgIG9mZnNldEFmdGVyICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmFsVGV4dCgpLmxlbmd0aCAtICh0aGlzLmVuZCAtIHRoaXMuc3RhcnQpXG4gICAgfVxuXG4gICAgYXBwbHlPZmZzZXQgKG9mZnNldCkge1xuICAgICAgdmFyIGksIGxlbiwgcmVmLCBzZWxcblxuICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgICB0aGlzLmVuZCArPSBvZmZzZXRcbiAgICAgICAgcmVmID0gdGhpcy5zZWxlY3Rpb25zXG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgc2VsID0gcmVmW2ldXG4gICAgICAgICAgc2VsLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBzZWxlY3RDb250ZW50ICgpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3RhcnQsIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3RhcnQgKyB0aGlzLnRleHQubGVuZ3RoKV1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgY2FycmV0VG9TZWwgKCkge1xuICAgICAgdmFyIHBvcywgcmVzLCBzdGFydCwgdGV4dFxuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW11cbiAgICAgIHRleHQgPSB0aGlzLmZpbmFsVGV4dCgpXG4gICAgICB0aGlzLnByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5wcmVmaXgpXG4gICAgICB0aGlzLnRleHQgPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMudGV4dClcbiAgICAgIHRoaXMuc3VmZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnN1ZmZpeClcbiAgICAgIHN0YXJ0ID0gdGhpcy5zdGFydFxuXG4gICAgICB3aGlsZSAoKHJlcyA9IFN0cmluZ0hlbHBlci5nZXRBbmRSZW1vdmVGaXJzdENhcnJldCh0ZXh0KSkgIT0gbnVsbCkge1xuICAgICAgICBbcG9zLCB0ZXh0XSA9IHJlc1xuICAgICAgICB0aGlzLnNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0ICsgcG9zLCBzdGFydCArIHBvcykpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgY29weSAoKSB7XG4gICAgICB2YXIgcmVzXG4gICAgICByZXMgPSBuZXcgUmVwbGFjZW1lbnQodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMudGV4dCwgdGhpcy5nZXRPcHRzKCkpXG5cbiAgICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpXG4gICAgICB9XG5cbiAgICAgIHJlcy5zZWxlY3Rpb25zID0gdGhpcy5zZWxlY3Rpb25zLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gcy5jb3B5KClcbiAgICAgIH0pXG4gICAgICByZXR1cm4gcmVzXG4gICAgfVxuICB9XG5cbiAgO1xuXG4gIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhSZXBsYWNlbWVudC5wcm90b3R5cGUsIFtPcHRpb25PYmplY3RdKVxuXG4gIHJldHVybiBSZXBsYWNlbWVudFxufS5jYWxsKG51bGwpKVxuXG5leHBvcnRzLlJlcGxhY2VtZW50ID0gUmVwbGFjZW1lbnRcbiIsIlxudmFyIFNpemUgPSBjbGFzcyBTaXplIHtcbiAgY29uc3RydWN0b3IgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICB9XG59XG5leHBvcnRzLlNpemUgPSBTaXplXG4iLCJcbnZhciBTdHJQb3MgPSBjbGFzcyBTdHJQb3Mge1xuICBjb25zdHJ1Y3RvciAocG9zLCBzdHIpIHtcbiAgICB0aGlzLnBvcyA9IHBvc1xuICAgIHRoaXMuc3RyID0gc3RyXG4gIH1cblxuICBlbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aFxuICB9XG59XG5leHBvcnRzLlN0clBvcyA9IFN0clBvc1xuIiwiXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL1BvcycpLlBvc1xuXG52YXIgV3JhcHBlZFBvcyA9IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3Mge1xuICBjb25zdHJ1Y3RvciAoc3RhcnQsIGlubmVyU3RhcnQsIGlubmVyRW5kLCBlbmQpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0XG4gICAgdGhpcy5pbm5lclN0YXJ0ID0gaW5uZXJTdGFydFxuICAgIHRoaXMuaW5uZXJFbmQgPSBpbm5lckVuZFxuICAgIHRoaXMuZW5kID0gZW5kXG4gIH1cblxuICBpbm5lckNvbnRhaW5zUHQgKHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmlubmVyRW5kXG4gIH1cblxuICBpbm5lckNvbnRhaW5zUG9zIChwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuaW5uZXJFbmRcbiAgfVxuXG4gIGlubmVyVGV4dCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLmlubmVyU3RhcnQsIHRoaXMuaW5uZXJFbmQpXG4gIH1cblxuICBzZXRJbm5lckxlbiAobGVuKSB7XG4gICAgcmV0dXJuIHRoaXMubW92ZVN1Zml4KHRoaXMuaW5uZXJTdGFydCArIGxlbilcbiAgfVxuXG4gIG1vdmVTdWZmaXggKHB0KSB7XG4gICAgdmFyIHN1ZmZpeExlblxuICAgIHN1ZmZpeExlbiA9IHRoaXMuZW5kIC0gdGhpcy5pbm5lckVuZFxuICAgIHRoaXMuaW5uZXJFbmQgPSBwdFxuICAgIHRoaXMuZW5kID0gdGhpcy5pbm5lckVuZCArIHN1ZmZpeExlblxuICB9XG5cbiAgY29weSAoKSB7XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKHRoaXMuc3RhcnQsIHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCwgdGhpcy5lbmQpXG4gIH1cbn1cbmV4cG9ydHMuV3JhcHBlZFBvcyA9IFdyYXBwZWRQb3NcbiIsIlxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKCcuL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxudmFyIFdyYXBwaW5nID0gY2xhc3MgV3JhcHBpbmcgZXh0ZW5kcyBSZXBsYWNlbWVudCB7XG4gIGNvbnN0cnVjdG9yIChzdGFydCwgZW5kLCBwcmVmaXggPSAnJywgc3VmZml4ID0gJycsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnRcbiAgICB0aGlzLmVuZCA9IGVuZFxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zKVxuICAgIHRoaXMudGV4dCA9ICcnXG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXhcbiAgICB0aGlzLnN1ZmZpeCA9IHN1ZmZpeFxuICB9XG5cbiAgYXBwbHkgKCkge1xuICAgIHRoaXMuYWRqdXN0U2VsKClcbiAgICByZXR1cm4gc3VwZXIuYXBwbHkoKVxuICB9XG5cbiAgYWRqdXN0U2VsICgpIHtcbiAgICB2YXIgaSwgbGVuLCBvZmZzZXQsIHJlZiwgcmVzdWx0cywgc2VsXG4gICAgb2Zmc2V0ID0gdGhpcy5vcmlnaW5hbFRleHQoKS5sZW5ndGhcbiAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnNcbiAgICByZXN1bHRzID0gW11cblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2VsID0gcmVmW2ldXG5cbiAgICAgIGlmIChzZWwuc3RhcnQgPiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbC5lbmQgPj0gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHRzLnB1c2goc2VsLmVuZCArPSBvZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2gobnVsbClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgZmluYWxUZXh0ICgpIHtcbiAgICB2YXIgdGV4dFxuXG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHRleHQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSAnJ1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRleHQgKyB0aGlzLnN1ZmZpeFxuICB9XG5cbiAgb2Zmc2V0QWZ0ZXIgKCkge1xuICAgIHJldHVybiB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN1ZmZpeC5sZW5ndGhcbiAgfVxuXG4gIGNvcHkgKCkge1xuICAgIHZhciByZXNcbiAgICByZXMgPSBuZXcgV3JhcHBpbmcodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMucHJlZml4LCB0aGlzLnN1ZmZpeClcbiAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLmNvcHkoKVxuICAgIH0pXG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5leHBvcnRzLldyYXBwaW5nID0gV3JhcHBpbmdcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5cbnZhciBMb2NhbFN0b3JhZ2VFbmdpbmUgPSBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmUge1xuICBzYXZlIChrZXksIHZhbCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmZ1bGxLZXkoa2V5KSwgSlNPTi5zdHJpbmdpZnkodmFsKSlcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoIChwYXRoLCBrZXksIHZhbCkge1xuICAgIHZhciBkYXRhXG4gICAgZGF0YSA9IHRoaXMubG9hZChwYXRoKVxuXG4gICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuXG4gICAgZGF0YVtrZXldID0gdmFsXG4gICAgcmV0dXJuIHRoaXMuc2F2ZShwYXRoLCBkYXRhKVxuICB9XG5cbiAgbG9hZCAoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5mdWxsS2V5KGtleSkpKVxuICAgIH1cbiAgfVxuXG4gIGZ1bGxLZXkgKGtleSkge1xuICAgIHJldHVybiAnQ29kZVdhdmVfJyArIGtleVxuICB9XG59XG5leHBvcnRzLkxvY2FsU3RvcmFnZUVuZ2luZSA9IExvY2FsU3RvcmFnZUVuZ2luZVxuIiwiXG52YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3RvciAocGFyc2VyLCBwYXJlbnQpIHtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlclxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50XG4gICAgdGhpcy5jb250ZW50ID0gJydcbiAgfVxuXG4gIG9uU3RhcnQgKCkge1xuICAgIHRoaXMuc3RhcnRBdCA9IHRoaXMucGFyc2VyLnBvc1xuICB9XG5cbiAgb25DaGFyIChjaGFyKSB7fVxuXG4gIGVuZCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VyLnNldENvbnRleHQodGhpcy5wYXJlbnQpXG4gIH1cblxuICBvbkVuZCAoKSB7fVxuXG4gIHRlc3RDb250ZXh0IChDb250ZXh0VHlwZSkge1xuICAgIGlmIChDb250ZXh0VHlwZS50ZXN0KHRoaXMucGFyc2VyLmNoYXIsIHRoaXMpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2V0Q29udGV4dChuZXcgQ29udGV4dFR5cGUodGhpcy5wYXJzZXIsIHRoaXMpKVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB0ZXN0ICgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuZXhwb3J0cy5Db250ZXh0ID0gQ29udGV4dFxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG52YXIgRXNjYXBlQ29udGV4dCA9IGNsYXNzIEVzY2FwZUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25DaGFyIChjaGFyKSB7XG4gICAgdGhpcy5wYXJlbnQuY29udGVudCArPSBjaGFyXG4gICAgcmV0dXJuIHRoaXMuZW5kKClcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0IChjaGFyKSB7XG4gICAgcmV0dXJuIGNoYXIgPT09ICdcXFxcJ1xuICB9XG59XG5leHBvcnRzLkVzY2FwZUNvbnRleHQgPSBFc2NhcGVDb250ZXh0XG4iLCJcbmNvbnN0IFBhcmFtQ29udGV4dCA9IHJlcXVpcmUoJy4vUGFyYW1Db250ZXh0JykuUGFyYW1Db250ZXh0XG5cbnZhciBOYW1lZENvbnRleHQgPSBjbGFzcyBOYW1lZENvbnRleHQgZXh0ZW5kcyBQYXJhbUNvbnRleHQge1xuICBvblN0YXJ0ICgpIHtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLnBhcmVudC5jb250ZW50XG4gIH1cblxuICBvbkVuZCAoKSB7XG4gICAgdGhpcy5wYXJzZXIubmFtZWRbdGhpcy5uYW1lXSA9IHRoaXMuY29udGVudFxuICB9XG5cbiAgc3RhdGljIHRlc3QgKGNoYXIsIHBhcmVudCkge1xuICAgIHJldHVybiBjaGFyID09PSAnOicgJiYgKHBhcmVudC5wYXJzZXIub3B0aW9ucy5hbGxvd2VkTmFtZWQgPT0gbnVsbCB8fCBwYXJlbnQucGFyc2VyLm9wdGlvbnMuYWxsb3dlZE5hbWVkLmluZGV4T2YocGFyZW50LmNvbnRlbnQpID49IDApXG4gIH1cbn1cbmV4cG9ydHMuTmFtZWRDb250ZXh0ID0gTmFtZWRDb250ZXh0XG4iLCJcbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbmNvbnN0IFN0cmluZ0NvbnRleHQgPSByZXF1aXJlKCcuL1N0cmluZ0NvbnRleHQnKS5TdHJpbmdDb250ZXh0XG5cbmNvbnN0IFZhcmlhYmxlQ29udGV4dCA9IHJlcXVpcmUoJy4vVmFyaWFibGVDb250ZXh0JykuVmFyaWFibGVDb250ZXh0XG5cbnZhciBQYXJhbUNvbnRleHQgPSBjbGFzcyBQYXJhbUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25DaGFyIChjaGFyKSB7XG4gICAgaWYgKHRoaXMudGVzdENvbnRleHQoU3RyaW5nQ29udGV4dCkpIHt9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoUGFyYW1Db250ZXh0Lm5hbWVkKSkge30gZWxzZSBpZiAodGhpcy50ZXN0Q29udGV4dChWYXJpYWJsZUNvbnRleHQpKSB7fSBlbHNlIGlmIChjaGFyID09PSAnICcpIHtcbiAgICAgIHRoaXMucGFyc2VyLnNldENvbnRleHQobmV3IFBhcmFtQ29udGV4dCh0aGlzLnBhcnNlcikpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudCArPSBjaGFyXG4gICAgfVxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHRoaXMucGFyc2VyLnBhcmFtcy5wdXNoKHRoaXMuY29udGVudClcbiAgfVxufVxuZXhwb3J0cy5QYXJhbUNvbnRleHQgPSBQYXJhbUNvbnRleHRcbiIsIlxuY29uc3QgUGFyYW1Db250ZXh0ID0gcmVxdWlyZSgnLi9QYXJhbUNvbnRleHQnKS5QYXJhbUNvbnRleHRcblxuY29uc3QgTmFtZWRDb250ZXh0ID0gcmVxdWlyZSgnLi9OYW1lZENvbnRleHQnKS5OYW1lZENvbnRleHRcblxuUGFyYW1Db250ZXh0Lm5hbWVkID0gTmFtZWRDb250ZXh0XG52YXIgUGFyYW1QYXJzZXIgPSBjbGFzcyBQYXJhbVBhcnNlciB7XG4gIGNvbnN0cnVjdG9yIChwYXJhbVN0cmluZywgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5wYXJhbVN0cmluZyA9IHBhcmFtU3RyaW5nXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMucGFyc2UoKVxuICB9XG5cbiAgc2V0Q29udGV4dCAoY29udGV4dCkge1xuICAgIHZhciBvbGRDb250ZXh0XG4gICAgb2xkQ29udGV4dCA9IHRoaXMuY29udGV4dFxuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRcblxuICAgIGlmIChvbGRDb250ZXh0ICE9IG51bGwgJiYgb2xkQ29udGV4dCAhPT0gKGNvbnRleHQgIT0gbnVsbCA/IGNvbnRleHQucGFyZW50IDogbnVsbCkpIHtcbiAgICAgIG9sZENvbnRleHQub25FbmQoKVxuICAgIH1cblxuICAgIGlmIChjb250ZXh0ICE9IG51bGwpIHtcbiAgICAgIGNvbnRleHQub25TdGFydCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dFxuICB9XG5cbiAgcGFyc2UgKCkge1xuICAgIHRoaXMucGFyYW1zID0gW11cbiAgICB0aGlzLm5hbWVkID0ge31cblxuICAgIGlmICh0aGlzLnBhcmFtU3RyaW5nLmxlbmd0aCkge1xuICAgICAgdGhpcy5zZXRDb250ZXh0KG5ldyBQYXJhbUNvbnRleHQodGhpcykpXG4gICAgICB0aGlzLnBvcyA9IDBcblxuICAgICAgd2hpbGUgKHRoaXMucG9zIDwgdGhpcy5wYXJhbVN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jaGFyID0gdGhpcy5wYXJhbVN0cmluZ1t0aGlzLnBvc11cbiAgICAgICAgdGhpcy5jb250ZXh0Lm9uQ2hhcih0aGlzLmNoYXIpXG4gICAgICAgIHRoaXMucG9zKytcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2V0Q29udGV4dChudWxsKVxuICAgIH1cbiAgfVxuXG4gIHRha2UgKG5iKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1TdHJpbmcuc3Vic3RyaW5nKHRoaXMucG9zLCB0aGlzLnBvcyArIG5iKVxuICB9XG5cbiAgc2tpcCAobmIgPSAxKSB7XG4gICAgdGhpcy5wb3MgKz0gbmJcbiAgfVxufVxuZXhwb3J0cy5QYXJhbVBhcnNlciA9IFBhcmFtUGFyc2VyXG4iLCJcbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbmNvbnN0IEVzY2FwZUNvbnRleHQgPSByZXF1aXJlKCcuL0VzY2FwZUNvbnRleHQnKS5Fc2NhcGVDb250ZXh0XG5cbmNvbnN0IFZhcmlhYmxlQ29udGV4dCA9IHJlcXVpcmUoJy4vVmFyaWFibGVDb250ZXh0JykuVmFyaWFibGVDb250ZXh0XG5cbnZhciBTdHJpbmdDb250ZXh0ID0gY2xhc3MgU3RyaW5nQ29udGV4dCBleHRlbmRzIENvbnRleHQge1xuICBvbkNoYXIgKGNoYXIpIHtcbiAgICBpZiAodGhpcy50ZXN0Q29udGV4dChFc2NhcGVDb250ZXh0KSkge30gZWxzZSBpZiAodGhpcy50ZXN0Q29udGV4dChWYXJpYWJsZUNvbnRleHQpKSB7fSBlbHNlIGlmIChTdHJpbmdDb250ZXh0LmlzRGVsaW1pdGVyKGNoYXIpKSB7XG4gICAgICB0aGlzLmVuZCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudCArPSBjaGFyXG4gICAgfVxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHRoaXMucGFyZW50LmNvbnRlbnQgKz0gdGhpcy5jb250ZW50XG4gIH1cblxuICBzdGF0aWMgdGVzdCAoY2hhcikge1xuICAgIHJldHVybiB0aGlzLmlzRGVsaW1pdGVyKGNoYXIpXG4gIH1cblxuICBzdGF0aWMgaXNEZWxpbWl0ZXIgKGNoYXIpIHtcbiAgICByZXR1cm4gY2hhciA9PT0gJ1wiJyB8fCBjaGFyID09PSBcIidcIlxuICB9XG59XG5leHBvcnRzLlN0cmluZ0NvbnRleHQgPSBTdHJpbmdDb250ZXh0XG4iLCJcbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbnZhciBWYXJpYWJsZUNvbnRleHQgPSBjbGFzcyBWYXJpYWJsZUNvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25TdGFydCAoKSB7XG4gICAgdGhpcy5wYXJzZXIuc2tpcCgpXG4gIH1cblxuICBvbkNoYXIgKGNoYXIpIHtcbiAgICBpZiAoY2hhciA9PT0gJ30nKSB7XG4gICAgICB0aGlzLmVuZCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udGVudCArPSBjaGFyXG4gICAgfVxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHZhciByZWZcbiAgICB0aGlzLnBhcmVudC5jb250ZW50ICs9ICgocmVmID0gdGhpcy5wYXJzZXIub3B0aW9ucy52YXJzKSAhPSBudWxsID8gcmVmW3RoaXMuY29udGVudF0gOiBudWxsKSB8fCAnJ1xuICB9XG5cbiAgc3RhdGljIHRlc3QgKGNoYXIsIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQucGFyc2VyLnRha2UoMikgPT09ICcjeydcbiAgfVxufVxuZXhwb3J0cy5WYXJpYWJsZUNvbnRleHQgPSBWYXJpYWJsZUNvbnRleHRcbiIsIi8qIVxuICogaW5mbGVjdGlvblxuICogQ29weXJpZ2h0KGMpIDIwMTEgQmVuIExpbiA8YmVuQGRyZWFtZXJzbGFiLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICpcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEEgcG9ydCBvZiBpbmZsZWN0aW9uLWpzIHRvIG5vZGUuanMgbW9kdWxlLlxuICovXG5cbiggZnVuY3Rpb24gKCByb290LCBmYWN0b3J5ICl7XG4gIGlmKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKXtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkgKTtcbiAgfWVsc2UgaWYoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApe1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9ZWxzZXtcbiAgICByb290LmluZmxlY3Rpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0oIHRoaXMsIGZ1bmN0aW9uICgpe1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhpcyBpcyBhIGxpc3Qgb2Ygbm91bnMgdGhhdCB1c2UgdGhlIHNhbWUgZm9ybSBmb3IgYm90aCBzaW5ndWxhciBhbmQgcGx1cmFsLlxuICAgKiAgICAgICAgICAgICAgVGhpcyBsaXN0IHNob3VsZCByZW1haW4gZW50aXJlbHkgaW4gbG93ZXIgY2FzZSB0byBjb3JyZWN0bHkgbWF0Y2ggU3RyaW5ncy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciB1bmNvdW50YWJsZV93b3JkcyA9IFtcbiAgICAvLyAnYWNjZXNzJyxcbiAgICAnYWNjb21tb2RhdGlvbicsXG4gICAgJ2FkdWx0aG9vZCcsXG4gICAgJ2FkdmVydGlzaW5nJyxcbiAgICAnYWR2aWNlJyxcbiAgICAnYWdncmVzc2lvbicsXG4gICAgJ2FpZCcsXG4gICAgJ2FpcicsXG4gICAgJ2FpcmNyYWZ0JyxcbiAgICAnYWxjb2hvbCcsXG4gICAgJ2FuZ2VyJyxcbiAgICAnYXBwbGF1c2UnLFxuICAgICdhcml0aG1ldGljJyxcbiAgICAvLyAnYXJ0JyxcbiAgICAnYXNzaXN0YW5jZScsXG4gICAgJ2F0aGxldGljcycsXG4gICAgLy8gJ2F0dGVudGlvbicsXG5cbiAgICAnYmFjb24nLFxuICAgICdiYWdnYWdlJyxcbiAgICAvLyAnYmFsbGV0JyxcbiAgICAvLyAnYmVhdXR5JyxcbiAgICAnYmVlZicsXG4gICAgLy8gJ2JlZXInLFxuICAgIC8vICdiZWhhdmlvcicsXG4gICAgJ2Jpb2xvZ3knLFxuICAgIC8vICdiaWxsaWFyZHMnLFxuICAgICdibG9vZCcsXG4gICAgJ2JvdGFueScsXG4gICAgLy8gJ2Jvd2VscycsXG4gICAgJ2JyZWFkJyxcbiAgICAvLyAnYnVzaW5lc3MnLFxuICAgICdidXR0ZXInLFxuXG4gICAgJ2NhcmJvbicsXG4gICAgJ2NhcmRib2FyZCcsXG4gICAgJ2Nhc2gnLFxuICAgICdjaGFsaycsXG4gICAgJ2NoYW9zJyxcbiAgICAnY2hlc3MnLFxuICAgICdjcm9zc3JvYWRzJyxcbiAgICAnY291bnRyeXNpZGUnLFxuXG4gICAgLy8gJ2RhbWFnZScsXG4gICAgJ2RhbmNpbmcnLFxuICAgIC8vICdkYW5nZXInLFxuICAgICdkZWVyJyxcbiAgICAvLyAnZGVsaWdodCcsXG4gICAgLy8gJ2Rlc3NlcnQnLFxuICAgICdkaWduaXR5JyxcbiAgICAnZGlydCcsXG4gICAgLy8gJ2Rpc3RyaWJ1dGlvbicsXG4gICAgJ2R1c3QnLFxuXG4gICAgJ2Vjb25vbWljcycsXG4gICAgJ2VkdWNhdGlvbicsXG4gICAgJ2VsZWN0cmljaXR5JyxcbiAgICAvLyAnZW1wbG95bWVudCcsXG4gICAgLy8gJ2VuZXJneScsXG4gICAgJ2VuZ2luZWVyaW5nJyxcbiAgICAnZW5qb3ltZW50JyxcbiAgICAvLyAnZW50ZXJ0YWlubWVudCcsXG4gICAgJ2VudnknLFxuICAgICdlcXVpcG1lbnQnLFxuICAgICdldGhpY3MnLFxuICAgICdldmlkZW5jZScsXG4gICAgJ2V2b2x1dGlvbicsXG5cbiAgICAvLyAnZmFpbHVyZScsXG4gICAgLy8gJ2ZhaXRoJyxcbiAgICAnZmFtZScsXG4gICAgJ2ZpY3Rpb24nLFxuICAgIC8vICdmaXNoJyxcbiAgICAnZmxvdXInLFxuICAgICdmbHUnLFxuICAgICdmb29kJyxcbiAgICAvLyAnZnJlZWRvbScsXG4gICAgLy8gJ2ZydWl0JyxcbiAgICAnZnVlbCcsXG4gICAgJ2Z1bicsXG4gICAgLy8gJ2Z1bmVyYWwnLFxuICAgICdmdXJuaXR1cmUnLFxuXG4gICAgJ2dhbGxvd3MnLFxuICAgICdnYXJiYWdlJyxcbiAgICAnZ2FybGljJyxcbiAgICAvLyAnZ2FzJyxcbiAgICAnZ2VuZXRpY3MnLFxuICAgIC8vICdnbGFzcycsXG4gICAgJ2dvbGQnLFxuICAgICdnb2xmJyxcbiAgICAnZ29zc2lwJyxcbiAgICAnZ3JhbW1hcicsXG4gICAgLy8gJ2dyYXNzJyxcbiAgICAnZ3JhdGl0dWRlJyxcbiAgICAnZ3JpZWYnLFxuICAgIC8vICdncm91bmQnLFxuICAgICdndWlsdCcsXG4gICAgJ2d5bW5hc3RpY3MnLFxuXG4gICAgLy8gJ2hhaXInLFxuICAgICdoYXBwaW5lc3MnLFxuICAgICdoYXJkd2FyZScsXG4gICAgJ2hhcm0nLFxuICAgICdoYXRlJyxcbiAgICAnaGF0cmVkJyxcbiAgICAnaGVhbHRoJyxcbiAgICAnaGVhdCcsXG4gICAgLy8gJ2hlaWdodCcsXG4gICAgJ2hlbHAnLFxuICAgICdob21ld29yaycsXG4gICAgJ2hvbmVzdHknLFxuICAgICdob25leScsXG4gICAgJ2hvc3BpdGFsaXR5JyxcbiAgICAnaG91c2V3b3JrJyxcbiAgICAnaHVtb3VyJyxcbiAgICAnaHVuZ2VyJyxcbiAgICAnaHlkcm9nZW4nLFxuXG4gICAgJ2ljZScsXG4gICAgJ2ltcG9ydGFuY2UnLFxuICAgICdpbmZsYXRpb24nLFxuICAgICdpbmZvcm1hdGlvbicsXG4gICAgLy8gJ2luanVzdGljZScsXG4gICAgJ2lubm9jZW5jZScsXG4gICAgLy8gJ2ludGVsbGlnZW5jZScsXG4gICAgJ2lyb24nLFxuICAgICdpcm9ueScsXG5cbiAgICAnamFtJyxcbiAgICAvLyAnamVhbG91c3knLFxuICAgIC8vICdqZWxseScsXG4gICAgJ2pld2VscnknLFxuICAgIC8vICdqb3knLFxuICAgICdqdWRvJyxcbiAgICAvLyAnanVpY2UnLFxuICAgIC8vICdqdXN0aWNlJyxcblxuICAgICdrYXJhdGUnLFxuICAgIC8vICdraW5kbmVzcycsXG4gICAgJ2tub3dsZWRnZScsXG5cbiAgICAvLyAnbGFib3VyJyxcbiAgICAnbGFjaycsXG4gICAgLy8gJ2xhbmQnLFxuICAgICdsYXVnaHRlcicsXG4gICAgJ2xhdmEnLFxuICAgICdsZWF0aGVyJyxcbiAgICAnbGVpc3VyZScsXG4gICAgJ2xpZ2h0bmluZycsXG4gICAgJ2xpbmd1aW5lJyxcbiAgICAnbGluZ3VpbmknLFxuICAgICdsaW5ndWlzdGljcycsXG4gICAgJ2xpdGVyYXR1cmUnLFxuICAgICdsaXR0ZXInLFxuICAgICdsaXZlc3RvY2snLFxuICAgICdsb2dpYycsXG4gICAgJ2xvbmVsaW5lc3MnLFxuICAgIC8vICdsb3ZlJyxcbiAgICAnbHVjaycsXG4gICAgJ2x1Z2dhZ2UnLFxuXG4gICAgJ21hY2Fyb25pJyxcbiAgICAnbWFjaGluZXJ5JyxcbiAgICAnbWFnaWMnLFxuICAgIC8vICdtYWlsJyxcbiAgICAnbWFuYWdlbWVudCcsXG4gICAgJ21hbmtpbmQnLFxuICAgICdtYXJibGUnLFxuICAgICdtYXRoZW1hdGljcycsXG4gICAgJ21heW9ubmFpc2UnLFxuICAgICdtZWFzbGVzJyxcbiAgICAvLyAnbWVhdCcsXG4gICAgLy8gJ21ldGFsJyxcbiAgICAnbWV0aGFuZScsXG4gICAgJ21pbGsnLFxuICAgICdtaW51cycsXG4gICAgJ21vbmV5JyxcbiAgICAvLyAnbW9vc2UnLFxuICAgICdtdWQnLFxuICAgICdtdXNpYycsXG4gICAgJ211bXBzJyxcblxuICAgICduYXR1cmUnLFxuICAgICduZXdzJyxcbiAgICAnbml0cm9nZW4nLFxuICAgICdub25zZW5zZScsXG4gICAgJ251cnR1cmUnLFxuICAgICdudXRyaXRpb24nLFxuXG4gICAgJ29iZWRpZW5jZScsXG4gICAgJ29iZXNpdHknLFxuICAgIC8vICdvaWwnLFxuICAgICdveHlnZW4nLFxuXG4gICAgLy8gJ3BhcGVyJyxcbiAgICAvLyAncGFzc2lvbicsXG4gICAgJ3Bhc3RhJyxcbiAgICAncGF0aWVuY2UnLFxuICAgIC8vICdwZXJtaXNzaW9uJyxcbiAgICAncGh5c2ljcycsXG4gICAgJ3BvZXRyeScsXG4gICAgJ3BvbGx1dGlvbicsXG4gICAgJ3BvdmVydHknLFxuICAgIC8vICdwb3dlcicsXG4gICAgJ3ByaWRlJyxcbiAgICAvLyAncHJvZHVjdGlvbicsXG4gICAgLy8gJ3Byb2dyZXNzJyxcbiAgICAvLyAncHJvbnVuY2lhdGlvbicsXG4gICAgJ3BzeWNob2xvZ3knLFxuICAgICdwdWJsaWNpdHknLFxuICAgICdwdW5jdHVhdGlvbicsXG5cbiAgICAvLyAncXVhbGl0eScsXG4gICAgLy8gJ3F1YW50aXR5JyxcbiAgICAncXVhcnR6JyxcblxuICAgICdyYWNpc20nLFxuICAgIC8vICdyYWluJyxcbiAgICAvLyAncmVjcmVhdGlvbicsXG4gICAgJ3JlbGF4YXRpb24nLFxuICAgICdyZWxpYWJpbGl0eScsXG4gICAgJ3Jlc2VhcmNoJyxcbiAgICAncmVzcGVjdCcsXG4gICAgJ3JldmVuZ2UnLFxuICAgICdyaWNlJyxcbiAgICAncnViYmlzaCcsXG4gICAgJ3J1bScsXG5cbiAgICAnc2FmZXR5JyxcbiAgICAvLyAnc2FsYWQnLFxuICAgIC8vICdzYWx0JyxcbiAgICAvLyAnc2FuZCcsXG4gICAgLy8gJ3NhdGlyZScsXG4gICAgJ3NjZW5lcnknLFxuICAgICdzZWFmb29kJyxcbiAgICAnc2Vhc2lkZScsXG4gICAgJ3NlcmllcycsXG4gICAgJ3NoYW1lJyxcbiAgICAnc2hlZXAnLFxuICAgICdzaG9wcGluZycsXG4gICAgLy8gJ3NpbGVuY2UnLFxuICAgICdzbGVlcCcsXG4gICAgLy8gJ3NsYW5nJ1xuICAgICdzbW9rZScsXG4gICAgJ3Ntb2tpbmcnLFxuICAgICdzbm93JyxcbiAgICAnc29hcCcsXG4gICAgJ3NvZnR3YXJlJyxcbiAgICAnc29pbCcsXG4gICAgLy8gJ3NvcnJvdycsXG4gICAgLy8gJ3NvdXAnLFxuICAgICdzcGFnaGV0dGknLFxuICAgIC8vICdzcGVlZCcsXG4gICAgJ3NwZWNpZXMnLFxuICAgIC8vICdzcGVsbGluZycsXG4gICAgLy8gJ3Nwb3J0JyxcbiAgICAnc3RlYW0nLFxuICAgIC8vICdzdHJlbmd0aCcsXG4gICAgJ3N0dWZmJyxcbiAgICAnc3R1cGlkaXR5JyxcbiAgICAvLyAnc3VjY2VzcycsXG4gICAgLy8gJ3N1Z2FyJyxcbiAgICAnc3Vuc2hpbmUnLFxuICAgICdzeW1tZXRyeScsXG5cbiAgICAvLyAndGVhJyxcbiAgICAndGVubmlzJyxcbiAgICAndGhpcnN0JyxcbiAgICAndGh1bmRlcicsXG4gICAgJ3RpbWJlcicsXG4gICAgLy8gJ3RpbWUnLFxuICAgIC8vICd0b2FzdCcsXG4gICAgLy8gJ3RvbGVyYW5jZScsXG4gICAgLy8gJ3RyYWRlJyxcbiAgICAndHJhZmZpYycsXG4gICAgJ3RyYW5zcG9ydGF0aW9uJyxcbiAgICAvLyAndHJhdmVsJyxcbiAgICAndHJ1c3QnLFxuXG4gICAgLy8gJ3VuZGVyc3RhbmRpbmcnLFxuICAgICd1bmRlcndlYXInLFxuICAgICd1bmVtcGxveW1lbnQnLFxuICAgICd1bml0eScsXG4gICAgLy8gJ3VzYWdlJyxcblxuICAgICd2YWxpZGl0eScsXG4gICAgJ3ZlYWwnLFxuICAgICd2ZWdldGF0aW9uJyxcbiAgICAndmVnZXRhcmlhbmlzbScsXG4gICAgJ3ZlbmdlYW5jZScsXG4gICAgJ3Zpb2xlbmNlJyxcbiAgICAvLyAndmlzaW9uJyxcbiAgICAndml0YWxpdHknLFxuXG4gICAgJ3dhcm10aCcsXG4gICAgLy8gJ3dhdGVyJyxcbiAgICAnd2VhbHRoJyxcbiAgICAnd2VhdGhlcicsXG4gICAgLy8gJ3dlaWdodCcsXG4gICAgJ3dlbGZhcmUnLFxuICAgICd3aGVhdCcsXG4gICAgLy8gJ3doaXNrZXknLFxuICAgIC8vICd3aWR0aCcsXG4gICAgJ3dpbGRsaWZlJyxcbiAgICAvLyAnd2luZScsXG4gICAgJ3dpc2RvbScsXG4gICAgLy8gJ3dvb2QnLFxuICAgIC8vICd3b29sJyxcbiAgICAvLyAnd29yaycsXG5cbiAgICAvLyAneWVhc3QnLFxuICAgICd5b2dhJyxcblxuICAgICd6aW5jJyxcbiAgICAnem9vbG9neSdcbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoZXNlIHJ1bGVzIHRyYW5zbGF0ZSBmcm9tIHRoZSBzaW5ndWxhciBmb3JtIG9mIGEgbm91biB0byBpdHMgcGx1cmFsIGZvcm0uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIHZhciByZWdleCA9IHtcbiAgICBwbHVyYWwgOiB7XG4gICAgICBtZW4gICAgICAgOiBuZXcgUmVnRXhwKCAnXihtfHdvbSllbiQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHBlb3BsZSAgICA6IG5ldyBSZWdFeHAoICcocGUpb3BsZSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY2hpbGRyZW4gIDogbmV3IFJlZ0V4cCggJyhjaGlsZClyZW4kJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB0aWEgICAgICAgOiBuZXcgUmVnRXhwKCAnKFt0aV0pYSQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFuYWx5c2VzICA6IG5ldyBSZWdFeHAoICcoKGEpbmFseXwoYilhfChkKWlhZ25vfChwKWFyZW50aGV8KHApcm9nbm98KHMpeW5vcHwodCloZSlzZXMkJywnZ2knICksXG4gICAgICBoaXZlcyAgICAgOiBuZXcgUmVnRXhwKCAnKGhpfHRpKXZlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGN1cnZlcyAgICA6IG5ldyBSZWdFeHAoICcoY3VydmUpcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbHJ2ZXMgICAgIDogbmV3IFJlZ0V4cCggJyhbbHJdKXZlcyQnICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhdmVzICAgICAgOiBuZXcgUmVnRXhwKCAnKFthXSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZvdmVzICAgICA6IG5ldyBSZWdFeHAoICcoW15mb10pdmVzJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbW92aWVzICAgIDogbmV3IFJlZ0V4cCggJyhtKW92aWVzJCcgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhZWlvdXlpZXMgOiBuZXcgUmVnRXhwKCAnKFteYWVpb3V5XXxxdSlpZXMkJyAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHNlcmllcyAgICA6IG5ldyBSZWdFeHAoICcocyllcmllcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgeGVzICAgICAgIDogbmV3IFJlZ0V4cCggJyh4fGNofHNzfHNoKWVzJCcgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBtaWNlICAgICAgOiBuZXcgUmVnRXhwKCAnKFttfGxdKWljZSQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1c2VzICAgICA6IG5ldyBSZWdFeHAoICcoYnVzKWVzJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2VzICAgICAgIDogbmV3IFJlZ0V4cCggJyhvKWVzJCcgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzaG9lcyAgICAgOiBuZXcgUmVnRXhwKCAnKHNob2UpcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXNlcyAgICA6IG5ldyBSZWdFeHAoICcoY3Jpc3xheHx0ZXN0KWVzJCcgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2N0b3BpICAgIDogbmV3IFJlZ0V4cCggJyhvY3RvcHx2aXIpaSQnICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhbGlhc2VzICAgOiBuZXcgUmVnRXhwKCAnKGFsaWFzfGNhbnZhc3xzdGF0dXN8Y2FtcHVzKWVzJCcsICdnaScgKSxcbiAgICAgIHN1bW1vbnNlcyA6IG5ldyBSZWdFeHAoICdeKHN1bW1vbnMpZXMkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb3hlbiAgICAgIDogbmV3IFJlZ0V4cCggJ14ob3gpZW4nICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBtYXRyaWNlcyAgOiBuZXcgUmVnRXhwKCAnKG1hdHIpaWNlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHZlcnRpY2VzICA6IG5ldyBSZWdFeHAoICcodmVydHxpbmQpaWNlcyQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZmVldCAgICAgIDogbmV3IFJlZ0V4cCggJ15mZWV0JCcgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB0ZWV0aCAgICAgOiBuZXcgUmVnRXhwKCAnXnRlZXRoJCcgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlZXNlICAgICA6IG5ldyBSZWdFeHAoICdeZ2Vlc2UkJyAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcXVpenplcyAgIDogbmV3IFJlZ0V4cCggJyhxdWl6KXplcyQnICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB3aGVyZWFzZXMgOiBuZXcgUmVnRXhwKCAnXih3aGVyZWFzKWVzJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXRlcmlhICA6IG5ldyBSZWdFeHAoICdeKGNyaXRlcmkpYSQnICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ2VuZXJhICAgIDogbmV3IFJlZ0V4cCggJ15nZW5lcmEkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzcyAgICAgICAgOiBuZXcgUmVnRXhwKCAnc3MkJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHMgICAgICAgICA6IG5ldyBSZWdFeHAoICdzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApXG4gICAgfSxcblxuICAgIHNpbmd1bGFyIDoge1xuICAgICAgbWFuICAgICAgIDogbmV3IFJlZ0V4cCggJ14obXx3b20pYW4kJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcGVyc29uICAgIDogbmV3IFJlZ0V4cCggJyhwZSlyc29uJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY2hpbGQgICAgIDogbmV3IFJlZ0V4cCggJyhjaGlsZCkkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb3ggICAgICAgIDogbmV3IFJlZ0V4cCggJ14ob3gpJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYXhpcyAgICAgIDogbmV3IFJlZ0V4cCggJyhheHx0ZXN0KWlzJCcgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2N0b3B1cyAgIDogbmV3IFJlZ0V4cCggJyhvY3RvcHx2aXIpdXMkJyAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWxpYXMgICAgIDogbmV3IFJlZ0V4cCggJyhhbGlhc3xzdGF0dXN8Y2FudmFzfGNhbXB1cykkJywgJ2dpJyApLFxuICAgICAgc3VtbW9ucyAgIDogbmV3IFJlZ0V4cCggJ14oc3VtbW9ucykkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYnVzICAgICAgIDogbmV3IFJlZ0V4cCggJyhidSlzJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYnVmZmFsbyAgIDogbmV3IFJlZ0V4cCggJyhidWZmYWx8dG9tYXR8cG90YXQpbyQnICAgICAgICwgJ2dpJyApLFxuICAgICAgdGl1bSAgICAgIDogbmV3IFJlZ0V4cCggJyhbdGldKXVtJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc2lzICAgICAgIDogbmV3IFJlZ0V4cCggJ3NpcyQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZmZlICAgICAgIDogbmV3IFJlZ0V4cCggJyg/OihbXmZdKWZlfChbbHJdKWYpJCcgICAgICAgICwgJ2dpJyApLFxuICAgICAgaGl2ZSAgICAgIDogbmV3IFJlZ0V4cCggJyhoaXx0aSl2ZSQnICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWVpb3V5eSAgIDogbmV3IFJlZ0V4cCggJyhbXmFlaW91eV18cXUpeSQnICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgeCAgICAgICAgIDogbmV3IFJlZ0V4cCggJyh4fGNofHNzfHNoKSQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWF0cml4ICAgIDogbmV3IFJlZ0V4cCggJyhtYXRyKWl4JCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdmVydGV4ICAgIDogbmV3IFJlZ0V4cCggJyh2ZXJ0fGluZClleCQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbW91c2UgICAgIDogbmV3IFJlZ0V4cCggJyhbbXxsXSlvdXNlJCcgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZm9vdCAgICAgIDogbmV3IFJlZ0V4cCggJ15mb290JCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdG9vdGggICAgIDogbmV3IFJlZ0V4cCggJ150b290aCQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ29vc2UgICAgIDogbmV3IFJlZ0V4cCggJ15nb29zZSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcXVpeiAgICAgIDogbmV3IFJlZ0V4cCggJyhxdWl6KSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgd2hlcmVhcyAgIDogbmV3IFJlZ0V4cCggJ14od2hlcmVhcykkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY3JpdGVyaW9uIDogbmV3IFJlZ0V4cCggJ14oY3JpdGVyaSlvbiQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ2VudXMgICAgIDogbmV3IFJlZ0V4cCggJ15nZW51cyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcyAgICAgICAgIDogbmV3IFJlZ0V4cCggJ3MkJyAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY29tbW9uICAgIDogbmV3IFJlZ0V4cCggJyQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApXG4gICAgfVxuICB9O1xuXG4gIHZhciBwbHVyYWxfcnVsZXMgPSBbXG5cbiAgICAvLyBkbyBub3QgcmVwbGFjZSBpZiBpdHMgYWxyZWFkeSBhIHBsdXJhbCB3b3JkXG4gICAgWyByZWdleC5wbHVyYWwubWVuICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwucGVvcGxlICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY2hpbGRyZW4gIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGlhICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYW5hbHlzZXMgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuaGl2ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3VydmVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubHJ2ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZm92ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWVpb3V5aWVzIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc2VyaWVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubW92aWVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwueGVzICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWljZSAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYnVzZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2VzICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc2hvZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3Jpc2VzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2N0b3BpICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWxpYXNlcyAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc3VtbW9uc2VzIF0sXG4gICAgWyByZWdleC5wbHVyYWwub3hlbiAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWF0cmljZXMgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZmVldCAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGVldGggICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2Vlc2UgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwucXVpenplcyAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwud2hlcmVhc2VzIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3JpdGVyaWEgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2VuZXJhICAgIF0sXG5cbiAgICAvLyBvcmlnaW5hbCBydWxlXG4gICAgWyByZWdleC5zaW5ndWxhci5tYW4gICAgICAsICckMWVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucGVyc29uICAgLCAnJDFvcGxlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY2hpbGQgICAgLCAnJDFyZW4nIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5veCAgICAgICAsICckMWVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYXhpcyAgICAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm9jdG9wdXMgICwgJyQxaScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmFsaWFzICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zdW1tb25zICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVzICAgICAgLCAnJDFzZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idWZmYWxvICAsICckMW9lcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnRpdW0gICAgICwgJyQxYScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnNpcyAgICAgICwgJ3NlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmZmZSAgICAgICwgJyQxJDJ2ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5oaXZlICAgICAsICckMXZlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmFlaW91eXkgICwgJyQxaWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWF0cml4ICAgLCAnJDFpY2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudmVydGV4ICAgLCAnJDFpY2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIueCAgICAgICAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm1vdXNlICAgICwgJyQxaWNlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZm9vdCAgICAgLCAnZmVldCcgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnRvb3RoICAgICwgJ3RlZXRoJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ29vc2UgICAgLCAnZ2Vlc2UnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5xdWl6ICAgICAsICckMXplcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLndoZXJlYXMgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jcml0ZXJpb24sICckMWEnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nZW51cyAgICAsICdnZW5lcmEnIF0sXG5cbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnMgICAgICwgJ3MnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jb21tb24sICdzJyBdXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBydWxlcyB0cmFuc2xhdGUgZnJvbSB0aGUgcGx1cmFsIGZvcm0gb2YgYSBub3VuIHRvIGl0cyBzaW5ndWxhciBmb3JtLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdmFyIHNpbmd1bGFyX3J1bGVzID0gW1xuXG4gICAgLy8gZG8gbm90IHJlcGxhY2UgaWYgaXRzIGFscmVhZHkgYSBzaW5ndWxhciB3b3JkXG4gICAgWyByZWdleC5zaW5ndWxhci5tYW4gICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5wZXJzb24gIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jaGlsZCAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5veCAgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5heGlzICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5vY3RvcHVzIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hbGlhcyAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zdW1tb25zIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idXMgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idWZmYWxvIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50aXVtICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zaXMgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mZmUgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5oaXZlICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hZWlvdXl5IF0sXG4gICAgWyByZWdleC5zaW5ndWxhci54ICAgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tYXRyaXggIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tb3VzZSAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mb290ICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50b290aCAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nb29zZSAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5xdWl6ICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci53aGVyZWFzIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jcml0ZXJpb24gXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmdlbnVzIF0sXG5cbiAgICAvLyBvcmlnaW5hbCBydWxlXG4gICAgWyByZWdleC5wbHVyYWwubWVuICAgICAgLCAnJDFhbicgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5wZW9wbGUgICAsICckMXJzb24nIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY2hpbGRyZW4gLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2VuZXJhICAgLCAnZ2VudXMnXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5jcml0ZXJpYSAsICckMW9uJ10sXG4gICAgWyByZWdleC5wbHVyYWwudGlhICAgICAgLCAnJDF1bScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hbmFseXNlcyAsICckMSQyc2lzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmhpdmVzICAgICwgJyQxdmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3VydmVzICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubHJ2ZXMgICAgLCAnJDFmJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmF2ZXMgICAgICwgJyQxdmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZm92ZXMgICAgLCAnJDFmZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5tb3ZpZXMgICAsICckMW92aWUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWVpb3V5aWVzLCAnJDF5JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNlcmllcyAgICwgJyQxZXJpZXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwueGVzICAgICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWljZSAgICAgLCAnJDFvdXNlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmJ1c2VzICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9lcyAgICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNob2VzICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXNlcyAgICwgJyQxaXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2N0b3BpICAgLCAnJDF1cycgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hbGlhc2VzICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zdW1tb25zZXMsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5veGVuICAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5tYXRyaWNlcyAsICckMWl4JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnZlcnRpY2VzICwgJyQxZXgnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZmVldCAgICAgLCAnZm9vdCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC50ZWV0aCAgICAsICd0b290aCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5nZWVzZSAgICAsICdnb29zZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5xdWl6emVzICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC53aGVyZWFzZXMsICckMScgXSxcblxuICAgIFsgcmVnZXgucGx1cmFsLnNzLCAnc3MnIF0sXG4gICAgWyByZWdleC5wbHVyYWwucyAsICcnIF1cbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoaXMgaXMgYSBsaXN0IG9mIHdvcmRzIHRoYXQgc2hvdWxkIG5vdCBiZSBjYXBpdGFsaXplZCBmb3IgdGl0bGUgY2FzZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBub25fdGl0bGVjYXNlZF93b3JkcyA9IFtcbiAgICAnYW5kJywgJ29yJywgJ25vcicsICdhJywgJ2FuJywgJ3RoZScsICdzbycsICdidXQnLCAndG8nLCAnb2YnLCAnYXQnLCdieScsXG4gICAgJ2Zyb20nLCAnaW50bycsICdvbicsICdvbnRvJywgJ29mZicsICdvdXQnLCAnaW4nLCAnb3ZlcicsICd3aXRoJywgJ2ZvcidcbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoZXNlIGFyZSByZWd1bGFyIGV4cHJlc3Npb25zIHVzZWQgZm9yIGNvbnZlcnRpbmcgYmV0d2VlbiBTdHJpbmcgZm9ybWF0cy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBpZF9zdWZmaXggICAgICAgICA9IG5ldyBSZWdFeHAoICcoX2lkc3xfaWQpJCcsICdnJyApO1xuICB2YXIgdW5kZXJiYXIgICAgICAgICAgPSBuZXcgUmVnRXhwKCAnXycsICdnJyApO1xuICB2YXIgc3BhY2Vfb3JfdW5kZXJiYXIgPSBuZXcgUmVnRXhwKCAnW1xcIF9dJywgJ2cnICk7XG4gIHZhciB1cHBlcmNhc2UgICAgICAgICA9IG5ldyBSZWdFeHAoICcoW0EtWl0pJywgJ2cnICk7XG4gIHZhciB1bmRlcmJhcl9wcmVmaXggICA9IG5ldyBSZWdFeHAoICdeXycgKTtcblxuICB2YXIgaW5mbGVjdG9yID0ge1xuXG4gIC8qKlxuICAgKiBBIGhlbHBlciBtZXRob2QgdGhhdCBhcHBsaWVzIHJ1bGVzIGJhc2VkIHJlcGxhY2VtZW50IHRvIGEgU3RyaW5nLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBTdHJpbmcgdG8gbW9kaWZ5IGFuZCByZXR1cm4gYmFzZWQgb24gdGhlIHBhc3NlZCBydWxlcy5cbiAgICogQHBhcmFtIHtBcnJheTogW1JlZ0V4cCwgU3RyaW5nXX0gcnVsZXMgUmVnZXhwIHRvIG1hdGNoIHBhaXJlZCB3aXRoIFN0cmluZyB0byB1c2UgZm9yIHJlcGxhY2VtZW50XG4gICAqIEBwYXJhbSB7QXJyYXk6IFtTdHJpbmddfSBza2lwIFN0cmluZ3MgdG8gc2tpcCBpZiB0aGV5IG1hdGNoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvdmVycmlkZSBTdHJpbmcgdG8gcmV0dXJuIGFzIHRob3VnaCB0aGlzIG1ldGhvZCBzdWNjZWVkZWQgKHVzZWQgdG8gY29uZm9ybSB0byBBUElzKVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gcGFzc2VkIFN0cmluZyBtb2RpZmllZCBieSBwYXNzZWQgcnVsZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB0aGlzLl9hcHBseV9ydWxlcyggJ2Nvd3MnLCBzaW5ndWxhcl9ydWxlcyApOyAvLyA9PT0gJ2NvdydcbiAgICovXG4gICAgX2FwcGx5X3J1bGVzIDogZnVuY3Rpb24gKCBzdHIsIHJ1bGVzLCBza2lwLCBvdmVycmlkZSApe1xuICAgICAgaWYoIG92ZXJyaWRlICl7XG4gICAgICAgIHN0ciA9IG92ZXJyaWRlO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHZhciBpZ25vcmUgPSAoIGluZmxlY3Rvci5pbmRleE9mKCBza2lwLCBzdHIudG9Mb3dlckNhc2UoKSkgPiAtMSApO1xuXG4gICAgICAgIGlmKCAhaWdub3JlICl7XG4gICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgIHZhciBqID0gcnVsZXMubGVuZ3RoO1xuXG4gICAgICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgICAgIGlmKCBzdHIubWF0Y2goIHJ1bGVzWyBpIF1bIDAgXSkpe1xuICAgICAgICAgICAgICBpZiggcnVsZXNbIGkgXVsgMSBdICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSggcnVsZXNbIGkgXVsgMCBdLCBydWxlc1sgaSBdWyAxIF0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGxldHMgdXMgZGV0ZWN0IGlmIGFuIEFycmF5IGNvbnRhaW5zIGEgZ2l2ZW4gZWxlbWVudC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtBcnJheX0gYXJyIFRoZSBzdWJqZWN0IGFycmF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gaXRlbSBPYmplY3QgdG8gbG9jYXRlIGluIHRoZSBBcnJheS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZyb21faW5kZXggU3RhcnRzIGNoZWNraW5nIGZyb20gdGhpcyBwb3NpdGlvbiBpbiB0aGUgQXJyYXkuKG9wdGlvbmFsKVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJlX2Z1bmMgRnVuY3Rpb24gdXNlZCB0byBjb21wYXJlIEFycmF5IGl0ZW0gdnMgcGFzc2VkIGl0ZW0uKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm4gaW5kZXggcG9zaXRpb24gaW4gdGhlIEFycmF5IG9mIHRoZSBwYXNzZWQgaXRlbS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmluZGV4T2YoWyAnaGknLCd0aGVyZScgXSwgJ2d1eXMnICk7IC8vID09PSAtMVxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmRleE9mKFsgJ2hpJywndGhlcmUnIF0sICdoaScgKTsgLy8gPT09IDBcbiAgICovXG4gICAgaW5kZXhPZiA6IGZ1bmN0aW9uICggYXJyLCBpdGVtLCBmcm9tX2luZGV4LCBjb21wYXJlX2Z1bmMgKXtcbiAgICAgIGlmKCAhZnJvbV9pbmRleCApe1xuICAgICAgICBmcm9tX2luZGV4ID0gLTE7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgdmFyIGkgICAgID0gZnJvbV9pbmRleDtcbiAgICAgIHZhciBqICAgICA9IGFyci5sZW5ndGg7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIGlmKCBhcnJbIGkgXSAgPT09IGl0ZW0gfHwgY29tcGFyZV9mdW5jICYmIGNvbXBhcmVfZnVuYyggYXJyWyBpIF0sIGl0ZW0gKSl7XG4gICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHBsdXJhbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHBsdXJhbCBPdmVycmlkZXMgbm9ybWFsIG91dHB1dCB3aXRoIHNhaWQgU3RyaW5nLihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gU2luZ3VsYXIgRW5nbGlzaCBsYW5ndWFnZSBub3VucyBhcmUgcmV0dXJuZWQgaW4gcGx1cmFsIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdwZXJzb24nICk7IC8vID09PSAncGVvcGxlJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdvY3RvcHVzJyApOyAvLyA9PT0gJ29jdG9waSdcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAnSGF0JyApOyAvLyA9PT0gJ0hhdHMnXG4gICAqICAgICBpbmZsZWN0aW9uLnBsdXJhbGl6ZSggJ3BlcnNvbicsICdndXlzJyApOyAvLyA9PT0gJ2d1eXMnXG4gICAqL1xuICAgIHBsdXJhbGl6ZSA6IGZ1bmN0aW9uICggc3RyLCBwbHVyYWwgKXtcbiAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHBsdXJhbF9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHBsdXJhbCApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgc2luZ3VsYXJpemF0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzaW5ndWxhciBPdmVycmlkZXMgbm9ybWFsIG91dHB1dCB3aXRoIHNhaWQgU3RyaW5nLihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gUGx1cmFsIEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ3Blb3BsZScgKTsgLy8gPT09ICdwZXJzb24nXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnb2N0b3BpJyApOyAvLyA9PT0gJ29jdG9wdXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnSGF0cycgKTsgLy8gPT09ICdIYXQnXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnZ3V5cycsICdwZXJzb24nICk7IC8vID09PSAncGVyc29uJ1xuICAgKi9cbiAgICBzaW5ndWxhcml6ZSA6IGZ1bmN0aW9uICggc3RyLCBzaW5ndWxhciApe1xuICAgICAgcmV0dXJuIGluZmxlY3Rvci5fYXBwbHlfcnVsZXMoIHN0ciwgc2luZ3VsYXJfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBzaW5ndWxhciApO1xuICAgIH0sXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiB3aWxsIHBsdXJhbGl6ZSBvciBzaW5ndWxhcmxpemUgYSBTdHJpbmcgYXBwcm9wcmlhdGVseSBiYXNlZCBvbiBhbiBpbnRlZ2VyIHZhbHVlXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgVGhlIG51bWJlciB0byBiYXNlIHBsdXJhbGl6YXRpb24gb2ZmIG9mLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2luZ3VsYXIgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwbHVyYWwgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHRoZSBwbHVyYWwgb3Igc2luZ3VsYXIgZm9ybSBiYXNlZCBvbiB0aGUgY291bnQuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVvcGxlJyAxICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnb2N0b3BpJyAxICk7IC8vID09PSAnb2N0b3B1cydcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ0hhdHMnIDEgKTsgLy8gPT09ICdIYXQnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdndXlzJywgMSAsICdwZXJzb24nICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVyc29uJywgMiApOyAvLyA9PT0gJ3Blb3BsZSdcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ29jdG9wdXMnLCAyICk7IC8vID09PSAnb2N0b3BpJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnSGF0JywgMiApOyAvLyA9PT0gJ0hhdHMnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdwZXJzb24nLCAyLCBudWxsLCAnZ3V5cycgKTsgLy8gPT09ICdndXlzJ1xuICAgKi9cbiAgICBpbmZsZWN0IDogZnVuY3Rpb24gKCBzdHIsIGNvdW50LCBzaW5ndWxhciwgcGx1cmFsICl7XG4gICAgICBjb3VudCA9IHBhcnNlSW50KCBjb3VudCwgMTAgKTtcblxuICAgICAgaWYoIGlzTmFOKCBjb3VudCApKSByZXR1cm4gc3RyO1xuXG4gICAgICBpZiggY291bnQgPT09IDAgfHwgY291bnQgPiAxICl7XG4gICAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHBsdXJhbF9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHBsdXJhbCApO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHNpbmd1bGFyX3J1bGVzLCB1bmNvdW50YWJsZV93b3Jkcywgc2luZ3VsYXIgKTtcbiAgICAgIH1cbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNhbWVsaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGxvd19maXJzdF9sZXR0ZXIgRGVmYXVsdCBpcyB0byBjYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHJlc3VsdHMuKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIGxvd2VyY2FzZSBpdC5cbiAgICogQHJldHVybnMge1N0cmluZ30gTG93ZXIgY2FzZSB1bmRlcnNjb3JlZCB3b3JkcyB3aWxsIGJlIHJldHVybmVkIGluIGNhbWVsIGNhc2UuXG4gICAqICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbGx5ICcvJyBpcyB0cmFuc2xhdGVkIHRvICc6OidcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNhbWVsaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2VQcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5jYW1lbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlUHJvcGVydGllcydcbiAgICovXG4gICAgY2FtZWxpemUgOiBmdW5jdGlvbiAoIHN0ciwgbG93X2ZpcnN0X2xldHRlciApe1xuICAgICAgdmFyIHN0cl9wYXRoID0gc3RyLnNwbGl0KCAnLycgKTtcbiAgICAgIHZhciBpICAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICAgPSBzdHJfcGF0aC5sZW5ndGg7XG4gICAgICB2YXIgc3RyX2FyciwgaW5pdF94LCBrLCBsLCBmaXJzdDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgc3RyX2FyciA9IHN0cl9wYXRoWyBpIF0uc3BsaXQoICdfJyApO1xuICAgICAgICBrICAgICAgID0gMDtcbiAgICAgICAgbCAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuXG4gICAgICAgIGZvciggOyBrIDwgbDsgaysrICl7XG4gICAgICAgICAgaWYoIGsgIT09IDAgKXtcbiAgICAgICAgICAgIHN0cl9hcnJbIGsgXSA9IHN0cl9hcnJbIGsgXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZpcnN0ID0gc3RyX2FyclsgayBdLmNoYXJBdCggMCApO1xuICAgICAgICAgIGZpcnN0ID0gbG93X2ZpcnN0X2xldHRlciAmJiBpID09PSAwICYmIGsgPT09IDBcbiAgICAgICAgICAgID8gZmlyc3QudG9Mb3dlckNhc2UoKSA6IGZpcnN0LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgc3RyX2FyclsgayBdID0gZmlyc3QgKyBzdHJfYXJyWyBrIF0uc3Vic3RyaW5nKCAxICk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX2Fyci5qb2luKCAnJyApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyX3BhdGguam9pbiggJzo6JyApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdW5kZXJzY29yZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbF91cHBlcl9jYXNlIERlZmF1bHQgaXMgdG8gbG93ZXJjYXNlIGFuZCBhZGQgdW5kZXJzY29yZSBwcmVmaXguKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIHJldHVybiBhcyBlbnRlcmVkLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBDYW1lbCBjYXNlZCB3b3JkcyBhcmUgcmV0dXJuZWQgYXMgbG93ZXIgY2FzZWQgYW5kIHVuZGVyc2NvcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxseSAnOjonIGlzIHRyYW5zbGF0ZWQgdG8gJy8nLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ01lc3NhZ2VQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2VfcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ21lc3NhZ2VQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2VfcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ01QJywgdHJ1ZSApOyAvLyA9PT0gJ01QJ1xuICAgKi9cbiAgICB1bmRlcnNjb3JlIDogZnVuY3Rpb24gKCBzdHIsIGFsbF91cHBlcl9jYXNlICl7XG4gICAgICBpZiggYWxsX3VwcGVyX2Nhc2UgJiYgc3RyID09PSBzdHIudG9VcHBlckNhc2UoKSkgcmV0dXJuIHN0cjtcblxuICAgICAgdmFyIHN0cl9wYXRoID0gc3RyLnNwbGl0KCAnOjonICk7XG4gICAgICB2YXIgaSAgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgID0gc3RyX3BhdGgubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX3BhdGhbIGkgXS5yZXBsYWNlKCB1cHBlcmNhc2UsICdfJDEnICk7XG4gICAgICAgIHN0cl9wYXRoWyBpIF0gPSBzdHJfcGF0aFsgaSBdLnJlcGxhY2UoIHVuZGVyYmFyX3ByZWZpeCwgJycgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9wYXRoLmpvaW4oICcvJyApLnRvTG93ZXJDYXNlKCk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBodW1hbml6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGxvd19maXJzdF9sZXR0ZXIgRGVmYXVsdCBpcyB0byBjYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHJlc3VsdHMuKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIGxvd2VyY2FzZSBpdC5cbiAgICogQHJldHVybnMge1N0cmluZ30gTG93ZXIgY2FzZSB1bmRlcnNjb3JlZCB3b3JkcyB3aWxsIGJlIHJldHVybmVkIGluIGh1bWFuaXplZCBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uaHVtYW5pemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5odW1hbml6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlIHByb3BlcnRpZXMnXG4gICAqL1xuICAgIGh1bWFuaXplIDogZnVuY3Rpb24gKCBzdHIsIGxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UoIGlkX3N1ZmZpeCwgJycgKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCB1bmRlcmJhciwgJyAnICk7XG5cbiAgICAgIGlmKCAhbG93X2ZpcnN0X2xldHRlciApe1xuICAgICAgICBzdHIgPSBpbmZsZWN0b3IuY2FwaXRhbGl6ZSggc3RyICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBjYXBpdGFsaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBBbGwgY2hhcmFjdGVycyB3aWxsIGJlIGxvd2VyIGNhc2UgYW5kIHRoZSBmaXJzdCB3aWxsIGJlIHVwcGVyLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uY2FwaXRhbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLmNhcGl0YWxpemUoICdtZXNzYWdlIHByb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnTWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBjYXBpdGFsaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICByZXR1cm4gc3RyLnN1YnN0cmluZyggMCwgMSApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyaW5nKCAxICk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMgaW4gdGhlIHN0cmluZy5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFJlcGxhY2VzIGFsbCBzcGFjZXMgb3IgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5kYXNoZXJpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnbWVzc2FnZS1wcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5kYXNoZXJpemUoICdNZXNzYWdlIFByb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZS1Qcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBkYXNoZXJpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKCBzcGFjZV9vcl91bmRlcmJhciwgJy0nICk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0aXRsZWl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBDYXBpdGFsaXplcyB3b3JkcyBhcyB5b3Ugd291bGQgZm9yIGEgYm9vayB0aXRsZS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnRpdGxlaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UgUHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udGl0bGVpemUoICdtZXNzYWdlIHByb3BlcnRpZXMgdG8ga2VlcCcgKTsgLy8gPT09ICdNZXNzYWdlIFByb3BlcnRpZXMgdG8gS2VlcCdcbiAgICovXG4gICAgdGl0bGVpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgc3RyICAgICAgICAgPSBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCB1bmRlcmJhciwgJyAnICk7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJyAnICk7XG4gICAgICB2YXIgaSAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuICAgICAgdmFyIGQsIGssIGw7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIGQgPSBzdHJfYXJyWyBpIF0uc3BsaXQoICctJyApO1xuICAgICAgICBrID0gMDtcbiAgICAgICAgbCA9IGQubGVuZ3RoO1xuXG4gICAgICAgIGZvciggOyBrIDwgbDsgaysrKXtcbiAgICAgICAgICBpZiggaW5mbGVjdG9yLmluZGV4T2YoIG5vbl90aXRsZWNhc2VkX3dvcmRzLCBkWyBrIF0udG9Mb3dlckNhc2UoKSkgPCAwICl7XG4gICAgICAgICAgICBkWyBrIF0gPSBpbmZsZWN0b3IuY2FwaXRhbGl6ZSggZFsgayBdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdHJfYXJyWyBpIF0gPSBkLmpvaW4oICctJyApO1xuICAgICAgfVxuXG4gICAgICBzdHIgPSBzdHJfYXJyLmpvaW4oICcgJyApO1xuICAgICAgc3RyID0gc3RyLnN1YnN0cmluZyggMCwgMSApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyaW5nKCAxICk7XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBkZW1vZHVsaXplIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFJlbW92ZXMgbW9kdWxlIG5hbWVzIGxlYXZpbmcgb25seSBjbGFzcyBuYW1lcy4oUnVieSBzdHlsZSlcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmRlbW9kdWxpemUoICdNZXNzYWdlOjpCdXM6OlByb3BlcnRpZXMnICk7IC8vID09PSAnUHJvcGVydGllcydcbiAgICovXG4gICAgZGVtb2R1bGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJzo6JyApO1xuXG4gICAgICByZXR1cm4gc3RyX2Fyclsgc3RyX2Fyci5sZW5ndGggLSAxIF07XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0YWJsZWl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gY2FtZWwgY2FzZWQgd29yZHMgaW50byB0aGVpciB1bmRlcnNjb3JlZCBwbHVyYWwgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnRhYmxlaXplKCAnTWVzc2FnZUJ1c1Byb3BlcnR5JyApOyAvLyA9PT0gJ21lc3NhZ2VfYnVzX3Byb3BlcnRpZXMnXG4gICAqL1xuICAgIHRhYmxlaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci51bmRlcnNjb3JlKCBzdHIgKTtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5wbHVyYWxpemUoIHN0ciApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgY2xhc3NpZmljYXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gVW5kZXJzY29yZWQgcGx1cmFsIG5vdW5zIGJlY29tZSB0aGUgY2FtZWwgY2FzZWQgc2luZ3VsYXIgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNsYXNzaWZ5KCAnbWVzc2FnZV9idXNfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlQnVzUHJvcGVydHknXG4gICAqL1xuICAgIGNsYXNzaWZ5IDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5jYW1lbGl6ZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3Iuc2luZ3VsYXJpemUoIHN0ciApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgZm9yZWlnbiBrZXkgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBkcm9wX2lkX3ViYXIgRGVmYXVsdCBpcyB0byBzZXBlcmF0ZSBpZCB3aXRoIGFuIHVuZGVyYmFyIGF0IHRoZSBlbmQgb2YgdGhlIGNsYXNzIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5b3UgY2FuIHBhc3MgdHJ1ZSB0byBza2lwIGl0LihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gVW5kZXJzY29yZWQgcGx1cmFsIG5vdW5zIGJlY29tZSB0aGUgY2FtZWwgY2FzZWQgc2luZ3VsYXIgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmZvcmVpZ25fa2V5KCAnTWVzc2FnZUJ1c1Byb3BlcnR5JyApOyAvLyA9PT0gJ21lc3NhZ2VfYnVzX3Byb3BlcnR5X2lkJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5mb3JlaWduX2tleSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0eWlkJ1xuICAgKi9cbiAgICBmb3JlaWduX2tleSA6IGZ1bmN0aW9uICggc3RyLCBkcm9wX2lkX3ViYXIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5kZW1vZHVsaXplKCBzdHIgKTtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci51bmRlcnNjb3JlKCBzdHIgKSArICgoIGRyb3BfaWRfdWJhciApID8gKCAnJyApIDogKCAnXycgKSkgKyAnaWQnO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgb3JkaW5hbGl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gYWxsIGZvdW5kIG51bWJlcnMgdGhlaXIgc2VxdWVuY2UgbGlrZSAnMjJuZCcuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5vcmRpbmFsaXplKCAndGhlIDEgcGl0Y2gnICk7IC8vID09PSAndGhlIDFzdCBwaXRjaCdcbiAgICovXG4gICAgb3JkaW5hbGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJyAnICk7XG4gICAgICB2YXIgaSAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICB2YXIgayA9IHBhcnNlSW50KCBzdHJfYXJyWyBpIF0sIDEwICk7XG5cbiAgICAgICAgaWYoICFpc05hTiggayApKXtcbiAgICAgICAgICB2YXIgbHRkID0gc3RyX2FyclsgaSBdLnN1YnN0cmluZyggc3RyX2FyclsgaSBdLmxlbmd0aCAtIDIgKTtcbiAgICAgICAgICB2YXIgbGQgID0gc3RyX2FyclsgaSBdLnN1YnN0cmluZyggc3RyX2FyclsgaSBdLmxlbmd0aCAtIDEgKTtcbiAgICAgICAgICB2YXIgc3VmID0gJ3RoJztcblxuICAgICAgICAgIGlmKCBsdGQgIT0gJzExJyAmJiBsdGQgIT0gJzEyJyAmJiBsdGQgIT0gJzEzJyApe1xuICAgICAgICAgICAgaWYoIGxkID09PSAnMScgKXtcbiAgICAgICAgICAgICAgc3VmID0gJ3N0JztcbiAgICAgICAgICAgIH1lbHNlIGlmKCBsZCA9PT0gJzInICl7XG4gICAgICAgICAgICAgIHN1ZiA9ICduZCc7XG4gICAgICAgICAgICB9ZWxzZSBpZiggbGQgPT09ICczJyApe1xuICAgICAgICAgICAgICBzdWYgPSAncmQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHN0cl9hcnJbIGkgXSArPSBzdWY7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9hcnIuam9pbiggJyAnICk7XG4gICAgfSxcblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBwZXJmb3JtcyBtdWx0aXBsZSBpbmZsZWN0aW9uIG1ldGhvZHMgb24gYSBzdHJpbmdcbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyciBBbiBhcnJheSBvZiBpbmZsZWN0aW9uIG1ldGhvZHMuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50cmFuc2Zvcm0oICdhbGwgam9iJywgWyAncGx1cmFsaXplJywgJ2NhcGl0YWxpemUnLCAnZGFzaGVyaXplJyBdKTsgLy8gPT09ICdBbGwtam9icydcbiAgICovXG4gICAgdHJhbnNmb3JtIDogZnVuY3Rpb24gKCBzdHIsIGFyciApe1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgdmFyIGogPSBhcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDtpIDwgajsgaSsrICl7XG4gICAgICAgIHZhciBtZXRob2QgPSBhcnJbIGkgXTtcblxuICAgICAgICBpZiggaW5mbGVjdG9yLmhhc093blByb3BlcnR5KCBtZXRob2QgKSl7XG4gICAgICAgICAgc3RyID0gaW5mbGVjdG9yWyBtZXRob2QgXSggc3RyICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG4gIGluZmxlY3Rvci52ZXJzaW9uID0gJzEuMTIuMCc7XG5cbiAgcmV0dXJuIGluZmxlY3Rvcjtcbn0pKTtcbiJdfQ==
