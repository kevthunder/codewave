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
          throw 'Infinite parsing Recursion';
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

        return timeout = setTimeout(function () {
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
  var e;

  try {
    // Using W3 DOM2 (works for FF, Opera and Chrom)
    return obj instanceof HTMLElement;
  } catch (error) {
    e = error; // Browsers not supporting W3 DOM2 don't have HTMLElement and
    // an exception is thrown and we end up here. Testing some
    // properties that all elements have. (works on IE7)

    return _typeof(obj) === 'object' && obj.nodeType === 1 && _typeof(obj.style) === 'object' && _typeof(obj.ownerDocument) === 'object';
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
        throw 'TextArea not found';
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

  ;
  TextAreaEditor.prototype.startListening = DomKeyListener.prototype.startListening;
  return TextAreaEditor;
}.call(null);

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
      return this.parent.content += ((ref = this.parser.options.vars) != null ? ref[this.content] : null) || '';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmpzIiwibGliL0Nsb3NpbmdQcm9tcC5qcyIsImxpYi9DbWRGaW5kZXIuanMiLCJsaWIvQ21kSW5zdGFuY2UuanMiLCJsaWIvQ29kZXdhdmUuanMiLCJsaWIvQ29tbWFuZC5qcyIsImxpYi9Db250ZXh0LmpzIiwibGliL0VkaXRDbWRQcm9wLmpzIiwibGliL0VkaXRvci5qcyIsImxpYi9Mb2dnZXIuanMiLCJsaWIvT3B0aW9uT2JqZWN0LmpzIiwibGliL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsImxpYi9Qcm9jZXNzLmpzIiwibGliL1N0b3JhZ2UuanMiLCJsaWIvVGV4dEFyZWFFZGl0b3IuanMiLCJsaWIvVGV4dFBhcnNlci5qcyIsImxpYi9ib290c3RyYXAuanMiLCJsaWIvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwibGliL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXIuanMiLCJsaWIvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1BocENvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZC5qcyIsImxpYi9kZXRlY3RvcnMvRGV0ZWN0b3IuanMiLCJsaWIvZGV0ZWN0b3JzL0xhbmdEZXRlY3Rvci5qcyIsImxpYi9kZXRlY3RvcnMvUGFpckRldGVjdG9yLmpzIiwibGliL2VudHJ5LmpzIiwibGliL2hlbHBlcnMvQXJyYXlIZWxwZXIuanMiLCJsaWIvaGVscGVycy9Db21tb25IZWxwZXIuanMiLCJsaWIvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCJsaWIvaGVscGVycy9PcHRpb25hbFByb21pc2UuanMiLCJsaWIvaGVscGVycy9QYXRoSGVscGVyLmpzIiwibGliL2hlbHBlcnMvU3RyaW5nSGVscGVyLmpzIiwibGliL3Bvc2l0aW9uaW5nL1BhaXIuanMiLCJsaWIvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwibGliL3Bvc2l0aW9uaW5nL1Bvcy5qcyIsImxpYi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmpzIiwibGliL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwibGliL3Bvc2l0aW9uaW5nL1NpemUuanMiLCJsaWIvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwibGliL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCJsaWIvcG9zaXRpb25pbmcvV3JhcHBpbmcuanMiLCJsaWIvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIiwibGliL3N0cmluZ1BhcnNlcnMvQ29udGV4dC5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL0VzY2FwZUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9OYW1lZENvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlci5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL1N0cmluZ0NvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9WYXJpYWJsZUNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvaW5mbGVjdGlvbi9saWIvaW5mbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQ0EsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUFELENBQVAsQ0FBa0MsWUFBdkQ7O0FBRUEsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQVAsQ0FBaUMsV0FBckQ7O0FBRUEsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQVAsQ0FBOEIsSUFBM0M7O0FBRUEsSUFBSSxTQUFTO0FBQUE7QUFBQTtBQUNYLHFCQUFhLE9BQWIsRUFBb0M7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IEFycmF5SGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL0FycmF5SGVscGVyJykuQXJyYXlIZWxwZXJcblxuY29uc3QgUGFpciA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUGFpcicpLlBhaXJcblxudmFyIEJveEhlbHBlciA9IGNsYXNzIEJveEhlbHBlciB7XG4gIGNvbnN0cnVjdG9yIChjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIga2V5LCByZWYsIHZhbFxuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogdGhpcy5jb250ZXh0LmNvZGV3YXZlLmRlY28sXG4gICAgICBwYWQ6IDIsXG4gICAgICB3aWR0aDogNTAsXG4gICAgICBoZWlnaHQ6IDMsXG4gICAgICBvcGVuVGV4dDogJycsXG4gICAgICBjbG9zZVRleHQ6ICcnLFxuICAgICAgcHJlZml4OiAnJyxcbiAgICAgIHN1ZmZpeDogJycsXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0c1xuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9uZSAodGV4dCkge1xuICAgIHZhciBrZXksIG9wdCwgcmVmLCB2YWxcbiAgICBvcHQgPSB7fVxuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHNcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV1cbiAgICAgIG9wdFtrZXldID0gdGhpc1trZXldXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0LCBvcHQpXG4gIH1cblxuICBkcmF3ICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRTZXAoKSArICdcXG4nICsgdGhpcy5saW5lcyh0ZXh0KSArICdcXG4nICsgdGhpcy5lbmRTZXAoKVxuICB9XG5cbiAgd3JhcENvbW1lbnQgKHN0cikge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnQoc3RyKVxuICB9XG5cbiAgc2VwYXJhdG9yICgpIHtcbiAgICB2YXIgbGVuXG4gICAgbGVuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMud3JhcENvbW1lbnQodGhpcy5kZWNvTGluZShsZW4pKVxuICB9XG5cbiAgc3RhcnRTZXAgKCkge1xuICAgIHZhciBsblxuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5vcGVuVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLndyYXBDb21tZW50KHRoaXMub3BlblRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSlcbiAgfVxuXG4gIGVuZFNlcCAoKSB7XG4gICAgdmFyIGxuXG4gICAgbG4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGggLSB0aGlzLmNsb3NlVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmNsb3NlVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKSArIHRoaXMuc3VmZml4XG4gIH1cblxuICBkZWNvTGluZSAobGVuKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCh0aGlzLmRlY28sIGxlbilcbiAgfVxuXG4gIHBhZGRpbmcgKCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoJyAnLCB0aGlzLnBhZClcbiAgfVxuXG4gIGxpbmVzICh0ZXh0ID0gJycsIHVwdG9IZWlnaHQgPSB0cnVlKSB7XG4gICAgdmFyIGwsIGxpbmVzLCB4XG4gICAgdGV4dCA9IHRleHQgfHwgJydcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdCgnXFxuJylcblxuICAgIGlmICh1cHRvSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIHJlZiwgcmVzdWx0c1xuICAgICAgICByZXN1bHRzID0gW11cblxuICAgICAgICBmb3IgKHggPSBpID0gMCwgcmVmID0gdGhpcy5oZWlnaHQ7IHJlZiA+PSAwID8gaSA8PSByZWYgOiBpID49IHJlZjsgeCA9IHJlZiA+PSAwID8gKytpIDogLS1pKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsaW5lc1t4XSB8fCAnJykpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIGxlbjEsIHJlc3VsdHNcbiAgICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuMSA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICAgIGwgPSBsaW5lc1tpXVxuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobCkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKVxuICAgIH1cbiAgfVxuXG4gIGxpbmUgKHRleHQgPSAnJykge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoJyAnLCB0aGlzLmluZGVudCkgKyB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpICsgdGV4dCArIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCgnICcsIHRoaXMud2lkdGggLSB0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyB0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbylcbiAgfVxuXG4gIGxlZnQgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpKVxuICB9XG5cbiAgcmlnaHQgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbylcbiAgfVxuXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50ICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpXG4gIH1cblxuICB0ZXh0Qm91bmRzICh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRUeHRTaXplKHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpXG4gIH1cblxuICBnZXRCb3hGb3JQb3MgKHBvcykge1xuICAgIHZhciBjbG9uZSwgY3VyTGVmdCwgZGVwdGgsIGVuZEZpbmQsIGxlZnQsIHBhaXIsIHBsYWNlaG9sZGVyLCByZXMsIHN0YXJ0RmluZFxuICAgIGRlcHRoID0gdGhpcy5nZXROZXN0ZWRMdmwocG9zLnN0YXJ0KVxuXG4gICAgaWYgKGRlcHRoID4gMCkge1xuICAgICAgbGVmdCA9IHRoaXMubGVmdCgpXG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LCBkZXB0aCAtIDEpXG4gICAgICBjbG9uZSA9IHRoaXMuY2xvbmUoKVxuICAgICAgcGxhY2Vob2xkZXIgPSAnIyMjUGxhY2VIb2xkZXIjIyMnXG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aFxuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSB0aGlzLmRlY28gKyB0aGlzLmRlY28gKyBwbGFjZWhvbGRlciArIHRoaXMuZGVjbyArIHRoaXMuZGVjb1xuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKVxuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwgJy4qJykpXG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLCBlbmRGaW5kLCB7XG4gICAgICAgIHZhbGlkTWF0Y2g6IG1hdGNoID0+IHtcbiAgICAgICAgICB2YXIgZiAvLyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuXG4gICAgICAgICAgZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpLCBbbGVmdCwgJ1xcbicsICdcXHInXSwgLTEpXG4gICAgICAgICAgcmV0dXJuIGYgPT0gbnVsbCB8fCBmLnN0ciAhPT0gbGVmdFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcywgdGhpcy5jb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG5cbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE5lc3RlZEx2bCAoaW5kZXgpIHtcbiAgICB2YXIgZGVwdGgsIGYsIGxlZnRcbiAgICBkZXB0aCA9IDBcbiAgICBsZWZ0ID0gdGhpcy5sZWZ0KClcblxuICAgIHdoaWxlICgoZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCwgW2xlZnQsICdcXG4nLCAnXFxyJ10sIC0xKSkgIT0gbnVsbCAmJiBmLnN0ciA9PT0gbGVmdCkge1xuICAgICAgaW5kZXggPSBmLnBvc1xuICAgICAgZGVwdGgrK1xuICAgIH1cblxuICAgIHJldHVybiBkZXB0aFxuICB9XG5cbiAgZ2V0T3B0RnJvbUxpbmUgKGxpbmUsIGdldFBhZCA9IHRydWUpIHtcbiAgICB2YXIgZW5kUG9zLCByRW5kLCByU3RhcnQsIHJlc0VuZCwgcmVzU3RhcnQsIHN0YXJ0UG9zXG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cCgnKFxcXFxzKikoJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28pKSArICcpKFxcXFxzKiknKVxuICAgIHJFbmQgPSBuZXcgUmVnRXhwKCcoXFxcXHMqKSgnICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLmRlY28pKSArICcpKFxcbnwkKScpXG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKVxuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKVxuXG4gICAgaWYgKHJlc1N0YXJ0ICE9IG51bGwgJiYgcmVzRW5kICE9IG51bGwpIHtcbiAgICAgIGlmIChnZXRQYWQpIHtcbiAgICAgICAgdGhpcy5wYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgsIHJlc0VuZFsxXS5sZW5ndGgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW5kZW50ID0gcmVzU3RhcnRbMV0ubGVuZ3RoXG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgdGhpcy5wYWRcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSB0aGlzLnBhZFxuICAgICAgdGhpcy53aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHJlZm9ybWF0TGluZXMgKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzKHRoaXMucmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zKSwgZmFsc2UpXG4gIH1cblxuICByZW1vdmVDb21tZW50ICh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGVjbCwgZWNyLCBlZCwgZmxhZywgb3B0LCByZTEsIHJlMlxuXG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIG11bHRpbGluZTogdHJ1ZVxuICAgICAgfVxuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpXG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmRlY28pXG4gICAgICBmbGFnID0gb3B0aW9ucy5tdWx0aWxpbmUgPyAnZ20nIDogJydcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHN7MCwke3RoaXMucGFkfX1gLCBmbGFnKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxcXFxzKiRgLCBmbGFnKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsICcnKS5yZXBsYWNlKHJlMiwgJycpXG4gICAgfVxuICB9XG59XG5leHBvcnRzLkJveEhlbHBlciA9IEJveEhlbHBlclxuIiwiXG5jb25zdCBQb3NDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJykuUG9zQ29sbGVjdGlvblxuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnKS5SZXBsYWNlbWVudFxuXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKCcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJylcblxudmFyIENsb3NpbmdQcm9tcCA9IGNsYXNzIENsb3NpbmdQcm9tcCB7XG4gIGNvbnN0cnVjdG9yIChjb2Rld2F2ZTEsIHNlbGVjdGlvbnMpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmUxXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbFxuICAgIHRoaXMuX3R5cGVkID0gbnVsbFxuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG4gICAgdGhpcy5uYkNoYW5nZXMgPSAwXG4gICAgdGhpcy5zZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucylcbiAgfVxuXG4gIGJlZ2luICgpIHtcbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlXG4gICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh0aGlzLmFkZENhcnJldHMoKSkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKSkge1xuICAgICAgICB0aGlzLnByb3h5T25DaGFuZ2UgPSAoY2ggPSBudWxsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25DaGFuZ2UoY2gpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSkucmVzdWx0KClcbiAgfVxuXG4gIGFkZENhcnJldHMgKCkge1xuICAgIHRoaXMucmVwbGFjZW1lbnRzID0gdGhpcy5zZWxlY3Rpb25zLndyYXAodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgJ1xcbicsICdcXG4nICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMpLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAuY2FycmV0VG9TZWwoKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHRoaXMucmVwbGFjZW1lbnRzKVxuICB9XG5cbiAgaW52YWxpZFR5cGVkICgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZWQgPSBudWxsXG4gIH1cblxuICBvbkNoYW5nZSAoY2ggPSBudWxsKSB7XG4gICAgdGhpcy5pbnZhbGlkVHlwZWQoKVxuXG4gICAgaWYgKHRoaXMuc2tpcEV2ZW50KGNoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5uYkNoYW5nZXMrK1xuXG4gICAgaWYgKHRoaXMuc2hvdWxkU3RvcCgpKSB7XG4gICAgICB0aGlzLnN0b3AoKVxuICAgICAgcmV0dXJuIHRoaXMuY2xlYW5DbG9zZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VtZSgpXG4gICAgfVxuICB9XG5cbiAgc2tpcEV2ZW50IChjaCkge1xuICAgIHJldHVybiBjaCAhPSBudWxsICYmIGNoLmNoYXJDb2RlQXQoMCkgIT09IDMyXG4gIH1cblxuICByZXN1bWUgKCkge31cblxuICBzaG91bGRTdG9wICgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlZCgpID09PSBmYWxzZSB8fCB0aGlzLnR5cGVkKCkuaW5kZXhPZignICcpICE9PSAtMVxuICB9XG5cbiAgY2xlYW5DbG9zZSAoKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCByZXBsLCByZXBsYWNlbWVudHMsIHJlcywgc2VsLCBzZWxlY3Rpb25zLCBzdGFydFxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc2VsZWN0aW9ucyA9IHRoaXMuZ2V0U2VsZWN0aW9ucygpXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdXG5cbiAgICAgIGNvbnN0IHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgaWYgKHBvcykge1xuICAgICAgICBzdGFydCA9IHNlbFxuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgc3RhcnQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXVxuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LCBlbmQuaW5uZXJFbmQsIHJlcylcbiAgICAgICAgcmVwbC5zZWxlY3Rpb25zID0gW3N0YXJ0XVxuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKClcbiAgfVxuXG4gIHN0b3AgKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG5cbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID09PSB0aGlzKSB7XG4gICAgICB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm94eU9uQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpXG4gICAgfVxuICB9XG5cbiAgY2FuY2VsICgpIHtcbiAgICBpZiAodGhpcy50eXBlZCgpICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jYW5jZWxTZWxlY3Rpb25zKHRoaXMuZ2V0U2VsZWN0aW9ucygpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0b3AoKVxuICB9XG5cbiAgY2FuY2VsU2VsZWN0aW9ucyAoc2VsZWN0aW9ucykge1xuICAgIHZhciBlbmQsIGosIGxlbiwgcmVwbGFjZW1lbnRzLCBzZWwsIHN0YXJ0XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzdGFydCA9IG51bGxcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNlbGVjdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNlbCA9IHNlbGVjdGlvbnNbal1cblxuICAgICAgY29uc3QgcG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICBpZiAocG9zKSB7XG4gICAgICAgIHN0YXJ0ID0gcG9zXG4gICAgICB9IGVsc2UgaWYgKChlbmQgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSAmJiBzdGFydCAhPSBudWxsKSB7XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ldyBSZXBsYWNlbWVudChzdGFydC5zdGFydCwgZW5kLmVuZCwgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihzdGFydC5lbmQgKyAxLCBlbmQuc3RhcnQgLSAxKSkuc2VsZWN0Q29udGVudCgpKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB9XG5cbiAgdHlwZWQgKCkge1xuICAgIHZhciBjcG9zLCBpbm5lckVuZCwgaW5uZXJTdGFydFxuXG4gICAgaWYgKHRoaXMuX3R5cGVkID09IG51bGwpIHtcbiAgICAgIGNwb3MgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKVxuICAgICAgaW5uZXJTdGFydCA9IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aFxuXG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PT0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgJiYgKGlubmVyRW5kID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChpbm5lclN0YXJ0KSkgIT0gbnVsbCAmJiBpbm5lckVuZCA+PSBjcG9zLmVuZCkge1xuICAgICAgICB0aGlzLl90eXBlZCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl90eXBlZCA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkXG4gIH1cblxuICB3aGl0aGluT3BlbkJvdW5kcyAocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHRcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50c1xuXG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV1cbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuc3RhcnRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0c1xuXG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyAocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHRcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50c1xuXG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV1cbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0c1xuXG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHN0YXJ0UG9zQXQgKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSkpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMsIHRoaXMuY29kZXdhdmUuYnJha2V0cylcbiAgfVxuXG4gIGVuZFBvc0F0IChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAyKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLCB0aGlzLmNvZGV3YXZlLmJyYWtldHMpXG4gIH1cbn1cbmV4cG9ydHMuQ2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wXG52YXIgU2ltdWxhdGVkQ2xvc2luZ1Byb21wID0gY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wIHtcbiAgcmVzdW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zaW11bGF0ZVR5cGUoKVxuICB9XG5cbiAgc2ltdWxhdGVUeXBlICgpIHtcbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdmFyIGN1ckNsb3NlLCByZXBsLCB0YXJnZXRUZXh0XG4gICAgICB0aGlzLmludmFsaWRUeXBlZCgpXG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGN1ckNsb3NlID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHModGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXS5jb3B5KCkuYXBwbHlPZmZzZXQodGhpcy50eXBlZCgpLmxlbmd0aCkpXG5cbiAgICAgIGlmIChjdXJDbG9zZSkge1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LCBjdXJDbG9zZS5lbmQsIHRhcmdldFRleHQpXG5cbiAgICAgICAgaWYgKHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KCkpIHtcbiAgICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uVHlwZVNpbXVsYXRlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uVHlwZVNpbXVsYXRlZCgpXG4gICAgICB9XG4gICAgfSwgMilcbiAgfVxuXG4gIHNraXBFdmVudCAoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBnZXRTZWxlY3Rpb25zICgpIHtcbiAgICByZXR1cm4gW3RoaXMuY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpLCB0aGlzLnJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdICsgdGhpcy50eXBlZCgpLmxlbmd0aF1cbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyAocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV4dCwgcmVmLCByZXBsLCB0YXJnZXRQb3NcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50c1xuXG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV1cbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSlcbiAgICAgIG5leHQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KVxuXG4gICAgICBpZiAobmV4dCAhPSBudWxsKSB7XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpXG5cbiAgICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuZXhwb3J0cy5TaW11bGF0ZWRDbG9zaW5nUHJvbXAgPSBTaW11bGF0ZWRDbG9zaW5nUHJvbXBcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IGZ1bmN0aW9uIChjb2Rld2F2ZSwgc2VsZWN0aW9ucykge1xuICBpZiAoY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKVxuICB9XG59XG4iLCJcbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbmNvbnN0IE5hbWVzcGFjZUhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInKS5OYW1lc3BhY2VIZWxwZXJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpLkNvbW1hbmRcblxudmFyIGluZGV4T2YgPSBbXS5pbmRleE9mXG5cbnZhciBDbWRGaW5kZXIgPSBjbGFzcyBDbWRGaW5kZXIge1xuICBjb25zdHJ1Y3RvciAobmFtZXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsXG5cbiAgICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdXG4gICAgfVxuXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICBuYW1lc3BhY2VzOiBbXSxcbiAgICAgIHBhcmVudENvbnRleHQ6IG51bGwsXG4gICAgICBjb250ZXh0OiBudWxsLFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzLFxuICAgICAgbXVzdEV4ZWN1dGU6IHRydWUsXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWUsXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWUsXG4gICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfVxuICAgIHRoaXMubmFtZXMgPSBuYW1lc1xuICAgIHRoaXMucGFyZW50ID0gb3B0aW9ucy5wYXJlbnRcblxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldXG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcy5jb2Rld2F2ZSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJlbnRDb250ZXh0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5wYXJlbnQgPSB0aGlzLnBhcmVudENvbnRleHRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5uYW1lc3BhY2VzICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHRoaXMubmFtZXNwYWNlcylcbiAgICB9XG4gIH1cblxuICBmaW5kICgpIHtcbiAgICB0aGlzLnRyaWdnZXJEZXRlY3RvcnMoKVxuICAgIHRoaXMuY21kID0gdGhpcy5maW5kSW4odGhpcy5yb290KVxuICAgIHJldHVybiB0aGlzLmNtZFxuICB9IC8vICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4gIC8vICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiAgLy8gICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4gIC8vICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG5cbiAgZ2V0TmFtZXNXaXRoUGF0aHMgKCkge1xuICAgIHZhciBqLCBsZW4sIG5hbWUsIHBhdGhzLCByZWYsIHJlc3QsIHNwYWNlXG4gICAgcGF0aHMgPSB7fVxuICAgIHJlZiA9IHRoaXMubmFtZXNcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmFtZSA9IHJlZltqXTtcbiAgICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuXG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCAmJiAhKGluZGV4T2YuY2FsbCh0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCBzcGFjZSkgPj0gMCkpIHtcbiAgICAgICAgaWYgKCEoc3BhY2UgaW4gcGF0aHMpKSB7XG4gICAgICAgICAgcGF0aHNbc3BhY2VdID0gW11cbiAgICAgICAgfVxuXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGhzXG4gIH1cblxuICBhcHBseVNwYWNlT25OYW1lcyAobmFtZXNwYWNlKSB7XG4gICAgdmFyIHJlc3QsIHNwYWNlO1xuICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lc3BhY2UsIHRydWUpXG4gICAgcmV0dXJuIHRoaXMubmFtZXMubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgY3VyX3Jlc3QsIGN1cl9zcGFjZTtcbiAgICAgIFtjdXJfc3BhY2UsIGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG5cbiAgICAgIGlmIChjdXJfc3BhY2UgIT0gbnVsbCAmJiBjdXJfc3BhY2UgPT09IHNwYWNlKSB7XG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdFxuICAgICAgfVxuXG4gICAgICBpZiAocmVzdCAhPSBudWxsKSB7XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmFtZVxuICAgIH0pXG4gIH1cblxuICBnZXREaXJlY3ROYW1lcyAoKSB7XG4gICAgdmFyIG5cbiAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0c1xuICAgICAgcmVmID0gdGhpcy5uYW1lc1xuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBuID0gcmVmW2pdXG5cbiAgICAgICAgaWYgKG4uaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChuKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfS5jYWxsKHRoaXMpKVxuICB9XG5cbiAgdHJpZ2dlckRldGVjdG9ycyAoKSB7XG4gICAgdmFyIGNtZCwgZGV0ZWN0b3IsIGksIGosIGxlbiwgcG9zaWJpbGl0aWVzLCByZWYsIHJlcywgcmVzdWx0c1xuXG4gICAgaWYgKHRoaXMudXNlRGV0ZWN0b3JzKSB7XG4gICAgICB0aGlzLnVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICBwb3NpYmlsaXRpZXMgPSBbdGhpcy5yb290XS5jb25jYXQobmV3IENtZEZpbmRlcih0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCB7XG4gICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgICBpID0gMFxuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIHdoaWxlIChpIDwgcG9zaWJpbGl0aWVzLmxlbmd0aCkge1xuICAgICAgICBjbWQgPSBwb3NpYmlsaXRpZXNbaV1cbiAgICAgICAgcmVmID0gY21kLmRldGVjdG9yc1xuXG4gICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIGRldGVjdG9yID0gcmVmW2pdXG4gICAgICAgICAgcmVzID0gZGV0ZWN0b3IuZGV0ZWN0KHRoaXMpXG5cbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcylcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtcbiAgICAgICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgICAgICBtdXN0RXhlY3V0ZTogZmFsc2UsXG4gICAgICAgICAgICAgIHVzZUZhbGxiYWNrczogZmFsc2VcbiAgICAgICAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRzLnB1c2goaSsrKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cbiAgfVxuXG4gIGZpbmRJbiAoY21kLCBwYXRoID0gbnVsbCkge1xuICAgIHZhciBiZXN0XG5cbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgYmVzdCA9IHRoaXMuYmVzdEluUG9zaWJpbGl0aWVzKHRoaXMuZmluZFBvc2liaWxpdGllcygpKVxuXG4gICAgaWYgKGJlc3QgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGJlc3RcbiAgICB9XG4gIH1cblxuICBmaW5kUG9zaWJpbGl0aWVzICgpIHtcbiAgICB2YXIgZGlyZWN0LCBmYWxsYmFjaywgaiwgaywgbGVuLCBsZW4xLCBuYW1lLCBuYW1lcywgbnNwYywgbnNwY05hbWUsIHBvc2liaWxpdGllcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZXN0LCBzcGFjZVxuXG4gICAgaWYgKHRoaXMucm9vdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0aGlzLnJvb3QuaW5pdCgpXG4gICAgcG9zaWJpbGl0aWVzID0gW11cblxuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyAocmVmMSA9IHJlZi5pbkluc3RhbmNlKSAhPSBudWxsID8gcmVmMS5jbWQgOiBudWxsIDogbnVsbCkgPT09IHRoaXMucm9vdCkge1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKCdpbl9pbnN0YW5jZScpKVxuICAgIH1cblxuICAgIHJlZjIgPSB0aGlzLmdldE5hbWVzV2l0aFBhdGhzKClcblxuICAgIGZvciAoc3BhY2UgaW4gcmVmMikge1xuICAgICAgbmFtZXMgPSByZWYyW3NwYWNlXVxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKHNwYWNlLCBuYW1lcykpXG4gICAgfVxuXG4gICAgcmVmMyA9IHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKClcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZjMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5zcGMgPSByZWYzW2pdO1xuICAgICAgW25zcGNOYW1lLCByZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsIHRydWUpXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQobnNwY05hbWUsIHRoaXMuYXBwbHlTcGFjZU9uTmFtZXMobnNwYykpKVxuICAgIH1cblxuICAgIHJlZjQgPSB0aGlzLmdldERpcmVjdE5hbWVzKClcblxuICAgIGZvciAoayA9IDAsIGxlbjEgPSByZWY0Lmxlbmd0aDsgayA8IGxlbjE7IGsrKykge1xuICAgICAgbmFtZSA9IHJlZjRba11cbiAgICAgIGRpcmVjdCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSlcblxuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChkaXJlY3QpKSB7XG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy51c2VGYWxsYmFja3MpIHtcbiAgICAgIGZhbGxiYWNrID0gdGhpcy5yb290LmdldENtZCgnZmFsbGJhY2snKVxuXG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGZhbGxiYWNrKSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjaylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllc1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXNcbiAgfVxuXG4gIGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kIChjbWROYW1lLCBuYW1lcyA9IHRoaXMubmFtZXMpIHtcbiAgICB2YXIgaiwgbGVuLCBuZXh0LCBuZXh0cywgcG9zaWJpbGl0aWVzXG4gICAgcG9zaWJpbGl0aWVzID0gW11cbiAgICBuZXh0cyA9IHRoaXMuZ2V0Q21kRm9sbG93QWxpYXMoY21kTmFtZSlcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IG5leHRzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuZXh0ID0gbmV4dHNbal1cbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIHJvb3Q6IG5leHRcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICB9XG5cbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzXG4gIH1cblxuICBnZXRDbWRGb2xsb3dBbGlhcyAobmFtZSkge1xuICAgIHZhciBjbWRcbiAgICBjbWQgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KClcblxuICAgICAgaWYgKGNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtjbWQsIGNtZC5nZXRBbGlhc2VkKCldXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbY21kXVxuICAgIH1cblxuICAgIHJldHVybiBbY21kXVxuICB9XG5cbiAgY21kSXNWYWxpZCAoY21kKSB7XG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoY21kLm5hbWUgIT09ICdmYWxsYmFjaycgJiYgaW5kZXhPZi5jYWxsKHRoaXMuYW5jZXN0b3JzKCksIGNtZCkgPj0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuICF0aGlzLm11c3RFeGVjdXRlIHx8IHRoaXMuY21kSXNFeGVjdXRhYmxlKGNtZClcbiAgfVxuXG4gIGFuY2VzdG9ycyAoKSB7XG4gICAgdmFyIHJlZlxuXG4gICAgaWYgKCgocmVmID0gdGhpcy5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogbnVsbCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICB9XG5cbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGNtZElzRXhlY3V0YWJsZSAoY21kKSB7XG4gICAgdmFyIG5hbWVzXG4gICAgbmFtZXMgPSB0aGlzLmdldERpcmVjdE5hbWVzKClcblxuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgIH1cbiAgfVxuXG4gIGNtZFNjb3JlIChjbWQpIHtcbiAgICB2YXIgc2NvcmVcbiAgICBzY29yZSA9IGNtZC5kZXB0aFxuXG4gICAgaWYgKGNtZC5uYW1lID09PSAnZmFsbGJhY2snKSB7XG4gICAgICBzY29yZSAtPSAxMDAwXG4gICAgfVxuXG4gICAgcmV0dXJuIHNjb3JlXG4gIH1cblxuICBiZXN0SW5Qb3NpYmlsaXRpZXMgKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlXG5cbiAgICBpZiAocG9zcy5sZW5ndGggPiAwKSB7XG4gICAgICBiZXN0ID0gbnVsbFxuICAgICAgYmVzdFNjb3JlID0gbnVsbFxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBwb3NzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSBwb3NzW2pdXG4gICAgICAgIHNjb3JlID0gdGhpcy5jbWRTY29yZShwKVxuXG4gICAgICAgIGlmIChiZXN0ID09IG51bGwgfHwgc2NvcmUgPj0gYmVzdFNjb3JlKSB7XG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmVcbiAgICAgICAgICBiZXN0ID0gcFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiZXN0XG4gICAgfVxuICB9XG59XG5leHBvcnRzLkNtZEZpbmRlciA9IENtZEZpbmRlclxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBUZXh0UGFyc2VyID0gcmVxdWlyZSgnLi9UZXh0UGFyc2VyJykuVGV4dFBhcnNlclxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IE9wdGlvbmFsUHJvbWlzZSA9IHJlcXVpcmUoJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnKVxuXG52YXIgQ21kSW5zdGFuY2UgPSBjbGFzcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yIChjbWQxLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jbWQgPSBjbWQxXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dFxuICB9XG5cbiAgaW5pdCAoKSB7XG4gICAgaWYgKCEodGhpcy5pc0VtcHR5KCkgfHwgdGhpcy5pbml0ZWQpKSB7XG4gICAgICB0aGlzLmluaXRlZCA9IHRydWVcblxuICAgICAgdGhpcy5fZ2V0Q21kT2JqKClcblxuICAgICAgdGhpcy5faW5pdFBhcmFtcygpXG5cbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqLmluaXQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzZXRQYXJhbSAobmFtZSwgdmFsKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSB2YWxcbiAgfVxuXG4gIHB1c2hQYXJhbSAodmFsKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnB1c2godmFsKVxuICB9XG5cbiAgZ2V0Q29udGV4dCAoKSB7XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCBuZXcgQ29udGV4dCgpXG4gIH1cblxuICBnZXRGaW5kZXIgKGNtZE5hbWUpIHtcbiAgICB2YXIgZmluZGVyXG4gICAgZmluZGVyID0gdGhpcy5nZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgfVxuXG4gIF9nZXRDbWRPYmogKCkge1xuICAgIHZhciBjbWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNtZC5pbml0KClcbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZCgpIHx8IHRoaXMuY21kXG4gICAgICBjbWQuaW5pdCgpXG5cbiAgICAgIGlmIChjbWQuY2xzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKVxuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmpcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaW5pdFBhcmFtcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWQgPSB0aGlzLmdldERlZmF1bHRzKClcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzICgpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGlzRW1wdHkgKCkge1xuICAgIHJldHVybiB0aGlzLmNtZCAhPSBudWxsXG4gIH1cblxuICByZXN1bHRJc0F2YWlsYWJsZSAoKSB7XG4gICAgdmFyIGFsaWFzZWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgfVxuXG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKVxuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY21kLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGdldERlZmF1bHRzICgpIHtcbiAgICB2YXIgYWxpYXNlZCwgcmVzXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgcmVzID0ge31cbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKVxuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCBhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgICB9XG5cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZC5kZWZhdWx0cylcblxuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kT2JqLmdldERlZmF1bHRzKCkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZCAoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmdldEFsaWFzZWRGaW5hbCgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmFsaWFzZWRDbWQgfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWRGaW5hbCAoKSB7XG4gICAgdmFyIGFsaWFzZWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkRmluYWxDbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGlhc2VkRmluYWxDbWQgfHwgbnVsbFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLmNtZFxuXG4gICAgICAgIHdoaWxlIChhbGlhc2VkICE9IG51bGwgJiYgYWxpYXNlZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgICBhbGlhc2VkID0gYWxpYXNlZC5fYWxpYXNlZEZyb21GaW5kZXIodGhpcy5nZXRGaW5kZXIodGhpcy5hbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG5cbiAgICAgICAgICBpZiAodGhpcy5hbGlhc2VkQ21kID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuYWxpYXNlZENtZCA9IGFsaWFzZWQgfHwgZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgfHwgZmFsc2VcbiAgICAgICAgcmV0dXJuIGFsaWFzZWRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhbHRlckFsaWFzT2YgKGFsaWFzT2YpIHtcbiAgICByZXR1cm4gYWxpYXNPZlxuICB9XG5cbiAgZ2V0T3B0aW9ucyAoKSB7XG4gICAgdmFyIG9wdFxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPcHRpb25zXG4gICAgICB9XG5cbiAgICAgIG9wdCA9IHRoaXMuY21kLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSlcblxuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMuY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0aW9uIChrZXkpIHtcbiAgICB2YXIgb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKVxuXG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCAmJiBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICAgIH1cbiAgfVxuXG4gIGdldFBhcmFtIChuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBpLCBsZW4sIG4sIHJlZlxuXG4gICAgaWYgKChyZWYgPSB0eXBlb2YgbmFtZXMpID09PSAnc3RyaW5nJyB8fCByZWYgPT09ICdudW1iZXInKSB7XG4gICAgICBuYW1lcyA9IFtuYW1lc11cbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbiA9IG5hbWVzW2ldXG5cbiAgICAgIGlmICh0aGlzLm5hbWVkW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbl1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucGFyYW1zW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1zW25dXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZlZhbFxuICB9XG5cbiAgZ2V0Qm9vbFBhcmFtIChuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBmYWxzZVZhbHMsIHZhbFxuICAgIGZhbHNlVmFscyA9IFsnJywgJzAnLCAnZmFsc2UnLCAnbm8nLCAnbm9uZScsIGZhbHNlLCBudWxsLCAwXVxuICAgIHZhbCA9IHRoaXMuZ2V0UGFyYW0obmFtZXMsIGRlZlZhbClcbiAgICByZXR1cm4gIWZhbHNlVmFscy5pbmNsdWRlcyh2YWwpXG4gIH1cblxuICBhbmNlc3RvckNtZHMgKCkge1xuICAgIHZhciByZWZcblxuICAgIGlmICgoKHJlZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogbnVsbCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKVxuICAgIH1cblxuICAgIHJldHVybiBbXVxuICB9XG5cbiAgYW5jZXN0b3JDbWRzQW5kU2VsZiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5jZXN0b3JDbWRzKCkuY29uY2F0KFt0aGlzLmNtZF0pXG4gIH1cblxuICBydW5FeGVjdXRlRnVuY3QgKCkge1xuICAgIHZhciBjbWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmouZXhlY3V0ZSgpXG4gICAgICB9XG5cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWRcbiAgICAgIGNtZC5pbml0KClcblxuICAgICAgaWYgKGNtZC5leGVjdXRlRnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJhd1Jlc3VsdCAoKSB7XG4gICAgdmFyIGNtZFxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5yZXN1bHQoKVxuICAgICAgfVxuXG4gICAgICBjbWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpIHx8IHRoaXMuY21kXG4gICAgICBjbWQuaW5pdCgpXG5cbiAgICAgIGlmIChjbWQucmVzdWx0RnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpXG4gICAgICB9XG5cbiAgICAgIGlmIChjbWQucmVzdWx0U3RyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5yZXN1bHRTdHJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIHRoaXMuaW5pdCgpXG5cbiAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHRoaXMucmF3UmVzdWx0KCkpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgdmFyIHBhcnNlclxuXG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIHJlcyA9IHRoaXMuZm9ybWF0SW5kZW50KHJlcylcblxuICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCAmJiB0aGlzLmdldE9wdGlvbigncGFyc2UnLCB0aGlzKSkge1xuICAgICAgICAgICAgcGFyc2VyID0gdGhpcy5nZXRQYXJzZXJGb3JUZXh0KHJlcylcbiAgICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgYWx0ZXJGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdhbHRlclJlc3VsdCcsIHRoaXMpXG4gICAgICAgICAgaWYgKGFsdGVyRnVuY3QpIHtcbiAgICAgICAgICAgIHJlcyA9IGFsdGVyRnVuY3QocmVzLCB0aGlzKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiByZXNcbiAgICAgICAgfVxuICAgICAgfSkucmVzdWx0KClcbiAgICB9XG4gIH1cblxuICBnZXRQYXJzZXJGb3JUZXh0ICh0eHQgPSAnJykge1xuICAgIHZhciBwYXJzZXJcbiAgICBwYXJzZXIgPSB0aGlzLmNvbnRleHQuY29kZXdhdmUubmV3SW5zdGFuY2UobmV3IFRleHRQYXJzZXIodHh0KSwge1xuICAgICAgaW5JbnN0YW5jZTogdGhpc1xuICAgIH0pXG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2VcbiAgICByZXR1cm4gcGFyc2VyXG4gIH1cblxuICBnZXRJbmRlbnQgKCkge1xuICAgIHJldHVybiAwXG4gIH1cblxuICBmb3JtYXRJbmRlbnQgKHRleHQpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHQvZywgJyAgJylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHRcbiAgICB9XG4gIH1cblxuICBhcHBseUluZGVudCAodGV4dCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuaW5kZW50Tm90Rmlyc3QodGV4dCwgdGhpcy5nZXRJbmRlbnQoKSwgJyAnKVxuICB9XG59XG5leHBvcnRzLkNtZEluc3RhbmNlID0gQ21kSW5zdGFuY2VcbiIsIlxuY29uc3QgUHJvY2VzcyA9IHJlcXVpcmUoJy4vUHJvY2VzcycpLlByb2Nlc3NcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxuY29uc3QgUG9zaXRpb25lZENtZEluc3RhbmNlID0gcmVxdWlyZSgnLi9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UnKS5Qb3NpdGlvbmVkQ21kSW5zdGFuY2VcblxuY29uc3QgVGV4dFBhcnNlciA9IHJlcXVpcmUoJy4vVGV4dFBhcnNlcicpLlRleHRQYXJzZXJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpLkNvbW1hbmRcblxuY29uc3QgTG9nZ2VyID0gcmVxdWlyZSgnLi9Mb2dnZXInKS5Mb2dnZXJcblxuY29uc3QgUG9zQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUG9zQ29sbGVjdGlvbicpLlBvc0NvbGxlY3Rpb25cblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBDbG9zaW5nUHJvbXAgPSByZXF1aXJlKCcuL0Nsb3NpbmdQcm9tcCcpLkNsb3NpbmdQcm9tcFxuXG52YXIgQ29kZXdhdmUgPSAoZnVuY3Rpb24gKCkge1xuICBjbGFzcyBDb2Rld2F2ZSB7XG4gICAgY29uc3RydWN0b3IgKGVkaXRvciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsXG4gICAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgICAgQ29kZXdhdmUuaW5pdCgpXG4gICAgICB0aGlzLm1hcmtlciA9ICdbW1tbY29kZXdhdmVfbWFycXVlcl1dXV0nXG4gICAgICB0aGlzLnZhcnMgPSB7fVxuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIGJyYWtldHM6ICd+ficsXG4gICAgICAgIGRlY286ICd+JyxcbiAgICAgICAgY2xvc2VDaGFyOiAnLycsXG4gICAgICAgIG5vRXhlY3V0ZUNoYXI6ICchJyxcbiAgICAgICAgY2FycmV0Q2hhcjogJ3wnLFxuICAgICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgICAgaW5JbnN0YW5jZTogbnVsbFxuICAgICAgfVxuICAgICAgdGhpcy5wYXJlbnQgPSBvcHRpb25zLnBhcmVudFxuICAgICAgdGhpcy5uZXN0ZWQgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQubmVzdGVkICsgMSA6IDBcblxuICAgICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgICAgdmFsID0gZGVmYXVsdHNba2V5XVxuXG4gICAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwgJiYga2V5ICE9PSAncGFyZW50Jykge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5lZGl0b3IgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmVkaXRvci5iaW5kZWRUbyh0aGlzKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzKVxuXG4gICAgICBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMuaW5JbnN0YW5jZS5jb250ZXh0XG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcigpXG4gICAgfVxuXG4gICAgb25BY3RpdmF0aW9uS2V5ICgpIHtcbiAgICAgIHRoaXMucHJvY2VzcyA9IG5ldyBQcm9jZXNzKClcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKVxuICAgICAgcmV0dXJuIHRoaXMucnVuQXRDdXJzb3JQb3MoKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2VzcyA9IG51bGxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcnVuQXRDdXJzb3JQb3MgKCkge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKHRoaXMuZWRpdG9yLmdldE11bHRpU2VsKCkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5BdFBvcyh0aGlzLmVkaXRvci5nZXRDdXJzb3JQb3MoKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBydW5BdFBvcyAocG9zKSB7XG4gICAgICBpZiAocG9zID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDdXJzb3IgUG9zaXRpb24gaXMgZW1wdHknKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKFtwb3NdKVxuICAgIH1cblxuICAgIHJ1bkF0TXVsdGlQb3MgKG11bHRpUG9zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBjbWRcblxuICAgICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNtZCA9IHRoaXMuY29tbWFuZE9uUG9zKG11bHRpUG9zWzBdLmVuZClcblxuICAgICAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgY21kLnNldE11bHRpUG9zKG11bHRpUG9zKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbWQuaW5pdCgpXG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coY21kKVxuICAgICAgICAgICAgcmV0dXJuIGNtZC5leGVjdXRlKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG11bHRpUG9zWzBdLnN0YXJ0ID09PSBtdWx0aVBvc1swXS5lbmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQnJha2V0cyhtdWx0aVBvcylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21wdENsb3NpbmdDbWQobXVsdGlQb3MpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbW1hbmRPblBvcyAocG9zKSB7XG4gICAgICB2YXIgbmV4dCwgcHJldlxuXG4gICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuZm9sbG93ZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMSkge1xuICAgICAgICBwcmV2ID0gcG9zIC0gdGhpcy5icmFrZXRzLmxlbmd0aFxuICAgICAgICBuZXh0ID0gcG9zXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09PSAwKSB7XG4gICAgICAgICAgcG9zIC09IHRoaXMuYnJha2V0cy5sZW5ndGhcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXYgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHBvcylcblxuICAgICAgICBpZiAocHJldiA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQgPSB0aGlzLmZpbmROZXh0QnJha2V0KHBvcyAtIDEpXG5cbiAgICAgICAgaWYgKG5leHQgPT0gbnVsbCB8fCB0aGlzLmNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT09IDApIHtcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIHByZXYsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocHJldiwgbmV4dCArIHRoaXMuYnJha2V0cy5sZW5ndGgpKVxuICAgIH1cblxuICAgIG5leHRDbWQgKHN0YXJ0ID0gMCkge1xuICAgICAgdmFyIGJlZ2lubmluZywgZiwgcG9zXG4gICAgICBwb3MgPSBzdGFydFxuXG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbdGhpcy5icmFrZXRzLCAnXFxuJ10pKSB7XG4gICAgICAgIHBvcyA9IGYucG9zICsgZi5zdHIubGVuZ3RoXG5cbiAgICAgICAgaWYgKGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGJlZ2lubmluZyAhPT0gJ3VuZGVmaW5lZCcgJiYgYmVnaW5uaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIoYmVnaW5uaW5nLCBmLnBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvc1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiZWdpbm5pbmcgPSBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBnZXRFbmNsb3NpbmdDbWQgKHBvcyA9IDApIHtcbiAgICAgIHZhciBjbG9zaW5nUHJlZml4LCBjcG9zLCBwXG4gICAgICBjcG9zID0gcG9zXG4gICAgICBjbG9zaW5nUHJlZml4ID0gdGhpcy5icmFrZXRzICsgdGhpcy5jbG9zZUNoYXJcblxuICAgICAgd2hpbGUgKChwID0gdGhpcy5maW5kTmV4dChjcG9zLCBjbG9zaW5nUHJlZml4KSkgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGgpXG4gICAgICAgIGlmIChjbWQpIHtcbiAgICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpXG5cbiAgICAgICAgICBpZiAoY21kLnBvcyA8IHBvcykge1xuICAgICAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcG9zID0gcCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBwcmVjZWRlZEJ5QnJha2V0cyAocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MgLSB0aGlzLmJyYWtldHMubGVuZ3RoLCBwb3MpID09PSB0aGlzLmJyYWtldHNcbiAgICB9XG5cbiAgICBmb2xsb3dlZEJ5QnJha2V0cyAocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIHRoaXMuYnJha2V0cy5sZW5ndGgpID09PSB0aGlzLmJyYWtldHNcbiAgICB9XG5cbiAgICBjb3VudFByZXZCcmFrZXQgKHN0YXJ0KSB7XG4gICAgICB2YXIgaVxuICAgICAgaSA9IDBcblxuICAgICAgd2hpbGUgKChzdGFydCA9IHRoaXMuZmluZFByZXZCcmFrZXQoc3RhcnQpKSAhPSBudWxsKSB7XG4gICAgICAgIGkrK1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaVxuICAgIH1cblxuICAgIGlzRW5kTGluZSAocG9zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwb3MsIHBvcyArIDEpID09PSAnXFxuJyB8fCBwb3MgKyAxID49IHRoaXMuZWRpdG9yLnRleHRMZW4oKVxuICAgIH1cblxuICAgIGZpbmRQcmV2QnJha2V0IChzdGFydCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHRCcmFrZXQoc3RhcnQsIC0xKVxuICAgIH1cblxuICAgIGZpbmROZXh0QnJha2V0IChzdGFydCwgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGZcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbdGhpcy5icmFrZXRzLCAnXFxuJ10sIGRpcmVjdGlvbilcblxuICAgICAgaWYgKGYgJiYgZi5zdHIgPT09IHRoaXMuYnJha2V0cykge1xuICAgICAgICByZXR1cm4gZi5wb3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldiAoc3RhcnQsIHN0cmluZykge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZE5leHQoc3RhcnQsIHN0cmluZywgLTEpXG4gICAgfVxuXG4gICAgZmluZE5leHQgKHN0YXJ0LCBzdHJpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHZhciBmXG4gICAgICBmID0gdGhpcy5maW5kQW55TmV4dChzdGFydCwgW3N0cmluZ10sIGRpcmVjdGlvbilcblxuICAgICAgaWYgKGYpIHtcbiAgICAgICAgcmV0dXJuIGYucG9zXG4gICAgICB9XG4gICAgfVxuXG4gICAgZmluZEFueU5leHQgKHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IuZmluZEFueU5leHQoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbilcbiAgICB9XG5cbiAgICBmaW5kTWF0Y2hpbmdQYWlyIChzdGFydFBvcywgb3BlbmluZywgY2xvc2luZywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGYsIG5lc3RlZCwgcG9zXG4gICAgICBwb3MgPSBzdGFydFBvc1xuICAgICAgbmVzdGVkID0gMFxuXG4gICAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbY2xvc2luZywgb3BlbmluZ10sIGRpcmVjdGlvbikpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyAoZGlyZWN0aW9uID4gMCA/IGYuc3RyLmxlbmd0aCA6IDApXG5cbiAgICAgICAgaWYgKGYuc3RyID09PSAoZGlyZWN0aW9uID4gMCA/IGNsb3NpbmcgOiBvcGVuaW5nKSkge1xuICAgICAgICAgIGlmIChuZXN0ZWQgPiAwKSB7XG4gICAgICAgICAgICBuZXN0ZWQtLVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZlxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXN0ZWQrK1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgYWRkQnJha2V0cyAocG9zKSB7XG4gICAgICB2YXIgcmVwbGFjZW1lbnRzXG4gICAgICBwb3MgPSBuZXcgUG9zQ29sbGVjdGlvbihwb3MpXG4gICAgICByZXBsYWNlbWVudHMgPSBwb3Mud3JhcCh0aGlzLmJyYWtldHMsIHRoaXMuYnJha2V0cykubWFwKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHJldHVybiByLnNlbGVjdENvbnRlbnQoKVxuICAgICAgfSlcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gICAgfVxuXG4gICAgcHJvbXB0Q2xvc2luZ0NtZCAoc2VsZWN0aW9ucykge1xuICAgICAgaWYgKHRoaXMuY2xvc2luZ1Byb21wICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbG9zaW5nUHJvbXAuc3RvcCgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQcm9tcCA9IENsb3NpbmdQcm9tcC5uZXdGb3IodGhpcywgc2VsZWN0aW9ucykuYmVnaW4oKVxuICAgIH1cblxuICAgIG5ld0luc3RhbmNlIChlZGl0b3IsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgQ29kZXdhdmUoZWRpdG9yLCBvcHRpb25zKVxuICAgIH1cblxuICAgIHBhcnNlQWxsIChyZWN1cnNpdmUgPSB0cnVlKSB7XG4gICAgICB2YXIgY21kLCBwYXJzZXIsIHBvcywgcmVzXG5cbiAgICAgIGlmICh0aGlzLm5lc3RlZCA+IDEwMCkge1xuICAgICAgICB0aHJvdyAnSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb24nXG4gICAgICB9XG5cbiAgICAgIHBvcyA9IDBcblxuICAgICAgd2hpbGUgKGNtZCA9IHRoaXMubmV4dENtZChwb3MpKSB7XG4gICAgICAgIHBvcyA9IGNtZC5nZXRFbmRQb3MoKVxuICAgICAgICB0aGlzLmVkaXRvci5zZXRDdXJzb3JQb3MocG9zKSAvLyBjb25zb2xlLmxvZyhjbWQpXG5cbiAgICAgICAgY21kLmluaXQoKVxuXG4gICAgICAgIGlmIChyZWN1cnNpdmUgJiYgY21kLmNvbnRlbnQgIT0gbnVsbCAmJiAoY21kLmdldENtZCgpID09IG51bGwgfHwgIWNtZC5nZXRPcHRpb24oJ3ByZXZlbnRQYXJzZUFsbCcpKSkge1xuICAgICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcihjbWQuY29udGVudCksIHtcbiAgICAgICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgICAgIH0pXG4gICAgICAgICAgY21kLmNvbnRlbnQgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzID0gY21kLmV4ZWN1dGUoKVxuXG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgIGlmIChyZXMudGhlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzeW5jIG5lc3RlZCBjb21tYW5kcyBhcmUgbm90IHN1cHBvcnRlZCcpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNtZC5yZXBsYWNlRW5kICE9IG51bGwpIHtcbiAgICAgICAgICAgIHBvcyA9IGNtZC5yZXBsYWNlRW5kXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZXRUZXh0KClcbiAgICB9XG5cbiAgICBnZXRUZXh0ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0KClcbiAgICB9XG5cbiAgICBpc1Jvb3QgKCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50ID09IG51bGwgJiYgKHRoaXMuaW5JbnN0YW5jZSA9PSBudWxsIHx8IHRoaXMuaW5JbnN0YW5jZS5maW5kZXIgPT0gbnVsbClcbiAgICB9XG5cbiAgICBnZXRSb290ICgpIHtcbiAgICAgIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldEZpbGVTeXN0ZW0gKCkge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmZpbGVTeXN0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmZpbGVTeXN0ZW1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRSb290KClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5JbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVDYXJyZXQgKHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodHh0LCB0aGlzLmNhcnJldENoYXIpXG4gICAgfVxuXG4gICAgZ2V0Q2FycmV0UG9zICh0eHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCwgdGhpcy5jYXJyZXRDaGFyKVxuICAgIH1cblxuICAgIHJlZ01hcmtlciAoZmxhZ3MgPSAnZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5tYXJrZXIpLCBmbGFncylcbiAgICB9XG5cbiAgICByZW1vdmVNYXJrZXJzICh0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHRoaXMucmVnTWFya2VyKCksICcnKVxuICAgIH1cblxuICAgIHN0YXRpYyBpbml0ICgpIHtcbiAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlXG5cbiAgICAgICAgQ29tbWFuZC5pbml0Q21kcygpXG5cbiAgICAgICAgcmV0dXJuIENvbW1hbmQubG9hZENtZHMoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIDtcbiAgQ29kZXdhdmUuaW5pdGVkID0gZmFsc2VcbiAgcmV0dXJuIENvZGV3YXZlXG59LmNhbGwobnVsbCkpXG5cbmV4cG9ydHMuQ29kZXdhdmUgPSBDb2Rld2F2ZVxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBTdG9yYWdlID0gcmVxdWlyZSgnLi9TdG9yYWdlJykuU3RvcmFnZVxuXG5jb25zdCBOYW1lc3BhY2VIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJykuTmFtZXNwYWNlSGVscGVyXG5cbnZhciBfb3B0S2V5XG5cbl9vcHRLZXkgPSBmdW5jdGlvbiAoa2V5LCBkaWN0LCBkZWZWYWwgPSBudWxsKSB7XG4gIC8vIG9wdGlvbmFsIERpY3Rpb25hcnkga2V5XG4gIGlmIChrZXkgaW4gZGljdCkge1xuICAgIHJldHVybiBkaWN0W2tleV1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGVmVmFsXG4gIH1cbn1cblxudmFyIENvbW1hbmQgPSAoZnVuY3Rpb24gKCkge1xuICBjbGFzcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZTEsIGRhdGExID0gbnVsbCwgcGFyZW50ID0gbnVsbCkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTFcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGExXG4gICAgICB0aGlzLmNtZHMgPSBbXVxuICAgICAgdGhpcy5kZXRlY3RvcnMgPSBbXVxuICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSB0aGlzLnJlc3VsdEZ1bmN0ID0gdGhpcy5yZXN1bHRTdHIgPSB0aGlzLmFsaWFzT2YgPSB0aGlzLmNscyA9IG51bGxcbiAgICAgIHRoaXMuYWxpYXNlZCA9IG51bGxcbiAgICAgIHRoaXMuZnVsbE5hbWUgPSB0aGlzLm5hbWVcbiAgICAgIHRoaXMuZGVwdGggPSAwO1xuICAgICAgW3RoaXMuX3BhcmVudCwgdGhpcy5faW5pdGVkXSA9IFtudWxsLCBmYWxzZV1cbiAgICAgIHRoaXMuc2V0UGFyZW50KHBhcmVudClcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSB7fVxuICAgICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgICBwYXJzZTogZmFsc2UsXG4gICAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgICBwcmV2ZW50UGFyc2VBbGw6IGZhbHNlLFxuICAgICAgICByZXBsYWNlQm94OiBmYWxzZSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBudWxsXG4gICAgICB9XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fVxuICAgICAgdGhpcy5maW5hbE9wdGlvbnMgPSBudWxsXG4gICAgfVxuXG4gICAgcGFyZW50ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnRcbiAgICB9XG5cbiAgICBzZXRQYXJlbnQgKHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5fcGFyZW50ICE9PSB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSB2YWx1ZVxuICAgICAgICB0aGlzLmZ1bGxOYW1lID0gdGhpcy5fcGFyZW50ICE9IG51bGwgJiYgdGhpcy5fcGFyZW50Lm5hbWUgIT0gbnVsbCA/IHRoaXMuX3BhcmVudC5mdWxsTmFtZSArICc6JyArIHRoaXMubmFtZSA6IHRoaXMubmFtZVxuICAgICAgICByZXR1cm4gdGhpcy5kZXB0aCA9IHRoaXMuX3BhcmVudCAhPSBudWxsICYmIHRoaXMuX3BhcmVudC5kZXB0aCAhPSBudWxsID8gdGhpcy5fcGFyZW50LmRlcHRoICsgMSA6IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0ICgpIHtcbiAgICAgIGlmICghdGhpcy5faW5pdGVkKSB7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IHRydWVcbiAgICAgICAgdGhpcy5wYXJzZURhdGEodGhpcy5kYXRhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXIgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5yZW1vdmVDbWQodGhpcylcbiAgICB9XG5cbiAgICBpc0VkaXRhYmxlICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFN0ciAhPSBudWxsIHx8IHRoaXMuYWxpYXNPZiAhPSBudWxsXG4gICAgfVxuXG4gICAgaXNFeGVjdXRhYmxlICgpIHtcbiAgICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZlxuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpXG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgICB9XG5cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0JywgJ2NscycsICdleGVjdXRlRnVuY3QnXVxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcCA9IHJlZltqXVxuXG4gICAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZVdpdGhOYW1lIChuYW1lKSB7XG4gICAgICB2YXIgYWxpYXNPZiwgYWxpYXNlZCwgY29udGV4dFxuXG4gICAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgICAgYWxpYXNPZiA9IHRoaXMuYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBuYW1lKVxuICAgICAgICBhbGlhc2VkID0gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpXG5cbiAgICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmlzRXhlY3V0YWJsZSgpXG4gICAgfVxuXG4gICAgcmVzdWx0SXNBdmFpbGFibGUgKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmXG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKClcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICB9XG5cbiAgICAgIHJlZiA9IFsncmVzdWx0U3RyJywgJ3Jlc3VsdEZ1bmN0J11cblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal1cblxuICAgICAgICBpZiAodGhpc1twXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBnZXREZWZhdWx0cyAoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgcmVzXG4gICAgICByZXMgPSB7fVxuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpXG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSlcbiAgICAgIH1cblxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuZGVmYXVsdHMpXG4gICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgX2FsaWFzZWRGcm9tRmluZGVyIChmaW5kZXIpIHtcbiAgICAgIGZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgZmluZGVyLm11c3RFeGVjdXRlID0gZmFsc2VcbiAgICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkICgpIHtcbiAgICAgIHZhciBjb250ZXh0XG5cbiAgICAgIGlmICh0aGlzLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgICByZXR1cm4gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIodGhpcy5hbGlhc09mKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRBbGlhc2VkT3JUaGlzICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEFsaWFzZWQoKSB8fCB0aGlzXG4gICAgfVxuXG4gICAgc2V0T3B0aW9ucyAoZGF0YSkge1xuICAgICAgdmFyIGtleSwgcmVzdWx0cywgdmFsXG4gICAgICByZXN1bHRzID0gW11cblxuICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgICB2YWwgPSBkYXRhW2tleV1cblxuICAgICAgICBpZiAoa2V5IGluIHRoaXMuZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5vcHRpb25zW2tleV0gPSB2YWwpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG51bGwpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cbiAgICBfb3B0aW9uc0ZvckFsaWFzZWQgKGFsaWFzZWQpIHtcbiAgICAgIHZhciBvcHRcbiAgICAgIG9wdCA9IHt9XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5kZWZhdWx0T3B0aW9ucylcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgYWxpYXNlZC5nZXRPcHRpb25zKCkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5vcHRpb25zKVxuICAgIH1cblxuICAgIGdldE9wdGlvbnMgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKVxuICAgIH1cblxuICAgIGdldE9wdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpXG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gICAgICB9XG4gICAgfVxuXG4gICAgaGVscCAoKSB7XG4gICAgICB2YXIgY21kXG4gICAgICBjbWQgPSB0aGlzLmdldENtZCgnaGVscCcpXG5cbiAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZURhdGEgKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGFcblxuICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IGRhdGFcbiAgICAgICAgdGhpcy5vcHRpb25zLnBhcnNlID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBlbHNlIGlmIChkYXRhICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEaWN0RGF0YShkYXRhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBwYXJzZURpY3REYXRhIChkYXRhKSB7XG4gICAgICB2YXIgZXhlY3V0ZSwgcmVzXG4gICAgICByZXMgPSBfb3B0S2V5KCdyZXN1bHQnLCBkYXRhKVxuXG4gICAgICBpZiAodHlwZW9mIHJlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnJlc3VsdEZ1bmN0ID0gcmVzXG4gICAgICB9IGVsc2UgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gcmVzXG4gICAgICAgIHRoaXMub3B0aW9ucy5wYXJzZSA9IHRydWVcbiAgICAgIH1cblxuICAgICAgZXhlY3V0ZSA9IF9vcHRLZXkoJ2V4ZWN1dGUnLCBkYXRhKVxuXG4gICAgICBpZiAodHlwZW9mIGV4ZWN1dGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSBleGVjdXRlXG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLCBkYXRhKVxuICAgICAgdGhpcy5jbHMgPSBfb3B0S2V5KCdjbHMnLCBkYXRhKVxuICAgICAgdGhpcy5kZWZhdWx0cyA9IF9vcHRLZXkoJ2RlZmF1bHRzJywgZGF0YSwgdGhpcy5kZWZhdWx0cylcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhkYXRhKVxuXG4gICAgICBpZiAoJ2hlbHAnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLCBkYXRhLmhlbHAsIHRoaXMpKVxuICAgICAgfVxuXG4gICAgICBpZiAoJ2ZhbGxiYWNrJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKCdmYWxsYmFjaycsIGRhdGEuZmFsbGJhY2ssIHRoaXMpKVxuICAgICAgfVxuXG4gICAgICBpZiAoJ2NtZHMnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWRzKGRhdGEuY21kcylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBhZGRDbWRzIChjbWRzKSB7XG4gICAgICB2YXIgZGF0YSwgbmFtZSwgcmVzdWx0c1xuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIGZvciAobmFtZSBpbiBjbWRzKSB7XG4gICAgICAgIGRhdGEgPSBjbWRzW25hbWVdXG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZENtZChuZXcgQ29tbWFuZChuYW1lLCBkYXRhLCB0aGlzKSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG4gICAgYWRkQ21kIChjbWQpIHtcbiAgICAgIHZhciBleGlzdHNcbiAgICAgIGV4aXN0cyA9IHRoaXMuZ2V0Q21kKGNtZC5uYW1lKVxuXG4gICAgICBpZiAoZXhpc3RzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbWQoZXhpc3RzKVxuICAgICAgfVxuXG4gICAgICBjbWQuc2V0UGFyZW50KHRoaXMpXG4gICAgICB0aGlzLmNtZHMucHVzaChjbWQpXG4gICAgICByZXR1cm4gY21kXG4gICAgfVxuXG4gICAgcmVtb3ZlQ21kIChjbWQpIHtcbiAgICAgIHZhciBpXG5cbiAgICAgIGlmICgoaSA9IHRoaXMuY21kcy5pbmRleE9mKGNtZCkpID4gLTEpIHtcbiAgICAgICAgdGhpcy5jbWRzLnNwbGljZShpLCAxKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY21kXG4gICAgfVxuXG4gICAgZ2V0Q21kIChmdWxsbmFtZSkge1xuICAgICAgdmFyIGNtZCwgaiwgbGVuLCBuYW1lLCByZWYsIHJlZjEsIHNwYWNlXG4gICAgICB0aGlzLmluaXQoKTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSlcblxuICAgICAgaWYgKHNwYWNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIChyZWYgPSB0aGlzLmdldENtZChzcGFjZSkpICE9IG51bGwgPyByZWYuZ2V0Q21kKG5hbWUpIDogbnVsbFxuICAgICAgfVxuXG4gICAgICByZWYxID0gdGhpcy5jbWRzXG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgY21kID0gcmVmMVtqXVxuXG4gICAgICAgIGlmIChjbWQubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldENtZERhdGEgKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRDbWQoZnVsbG5hbWUsIG5ldyBDb21tYW5kKGZ1bGxuYW1lLnNwbGl0KCc6JykucG9wKCksIGRhdGEpKVxuICAgIH1cblxuICAgIHNldENtZCAoZnVsbG5hbWUsIGNtZCkge1xuICAgICAgdmFyIG5hbWUsIG5leHQsIHNwYWNlO1xuICAgICAgW3NwYWNlLCBuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuXG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgICBuZXh0ID0gdGhpcy5nZXRDbWQoc3BhY2UpXG5cbiAgICAgICAgaWYgKG5leHQgPT0gbnVsbCkge1xuICAgICAgICAgIG5leHQgPSB0aGlzLmFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV4dC5zZXRDbWQobmFtZSwgY21kKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hZGRDbWQoY21kKVxuICAgICAgICByZXR1cm4gY21kXG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkRGV0ZWN0b3IgKGRldGVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXRlY3RvcnMucHVzaChkZXRlY3RvcilcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdENtZHMgKCkge1xuICAgICAgdmFyIGosIGxlbiwgcHJvdmlkZXIsIHJlZiwgcmVzdWx0c1xuICAgICAgQ29tbWFuZC5jbWRzID0gbmV3IENvbW1hbmQobnVsbCwge1xuICAgICAgICBjbWRzOiB7XG4gICAgICAgICAgaGVsbG86IHtcbiAgICAgICAgICAgIGhlbHA6ICdcIkhlbGxvLCB3b3JsZCFcIiBpcyB0eXBpY2FsbHkgb25lIG9mIHRoZSBzaW1wbGVzdCBwcm9ncmFtcyBwb3NzaWJsZSBpblxcbm1vc3QgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzLCBpdCBpcyBieSB0cmFkaXRpb24gb2Z0ZW4gKC4uLikgdXNlZCB0b1xcbnZlcmlmeSB0aGF0IGEgbGFuZ3VhZ2Ugb3Igc3lzdGVtIGlzIG9wZXJhdGluZyBjb3JyZWN0bHkgLXdpa2lwZWRpYScsXG4gICAgICAgICAgICByZXN1bHQ6ICdIZWxsbywgV29ybGQhJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJlZiA9IHRoaXMucHJvdmlkZXJzXG4gICAgICByZXN1bHRzID0gW11cblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHByb3ZpZGVyID0gcmVmW2pdXG4gICAgICAgIHJlc3VsdHMucHVzaChwcm92aWRlci5yZWdpc3RlcihDb21tYW5kLmNtZHMpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuICAgIHN0YXRpYyBzYXZlQ21kIChmdWxsbmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpXG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlSW5QYXRoKCdjbWRzJywgZnVsbG5hbWUsIGRhdGEpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBsb2FkQ21kcyAoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBzYXZlZENtZHNcbiAgICAgICAgcmV0dXJuIHNhdmVkQ21kcyA9IHRoaXMuc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAgIH0pLnRoZW4oc2F2ZWRDbWRzID0+IHtcbiAgICAgICAgdmFyIGRhdGEsIGZ1bGxuYW1lLCByZXN1bHRzXG5cbiAgICAgICAgaWYgKHNhdmVkQ21kcyAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgICAgICBmb3IgKGZ1bGxuYW1lIGluIHNhdmVkQ21kcykge1xuICAgICAgICAgICAgZGF0YSA9IHNhdmVkQ21kc1tmdWxsbmFtZV1cbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSkpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXRTYXZlZCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNhdmUoJ2NtZHMnLCB7fSlcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZVZhckNtZCAobmFtZSwgYmFzZSA9IHt9KSB7XG4gICAgICBiYXNlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIHAsIHZhbFxuICAgICAgICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKDApKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogbnVsbFxuXG4gICAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS52YXJzW25hbWVdID0gdmFsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJhc2VcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZUJvb2xWYXJDbWQgKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgICAgYmFzZS5leGVjdXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIHZhciBwLCB2YWxcbiAgICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IG51bGxcblxuICAgICAgICBpZiAoISh2YWwgIT0gbnVsbCAmJiAodmFsID09PSAnMCcgfHwgdmFsID09PSAnZmFsc2UnIHx8IHZhbCA9PT0gJ25vJykpKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJhc2VcbiAgICB9XG4gIH1cblxuICA7XG4gIENvbW1hbmQucHJvdmlkZXJzID0gW11cbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICByZXR1cm4gQ29tbWFuZFxufS5jYWxsKG51bGwpKVxuXG5leHBvcnRzLkNvbW1hbmQgPSBDb21tYW5kXG52YXIgQmFzZUNvbW1hbmQgPSBjbGFzcyBCYXNlQ29tbWFuZCB7XG4gIGNvbnN0cnVjdG9yIChpbnN0YW5jZTEpIHtcbiAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2UxXG4gIH1cblxuICBpbml0ICgpIHt9XG5cbiAgcmVzdWx0SXNBdmFpbGFibGUgKCkge1xuICAgIHJldHVybiB0aGlzLnJlc3VsdCAhPSBudWxsXG4gIH1cblxuICBnZXREZWZhdWx0cyAoKSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cblxuICBnZXRPcHRpb25zICgpIHtcbiAgICByZXR1cm4ge31cbiAgfVxufVxuZXhwb3J0cy5CYXNlQ29tbWFuZCA9IEJhc2VDb21tYW5kXG4iLCJjb25zdCBBcnJheUhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9BcnJheUhlbHBlcicpLkFycmF5SGVscGVyXG5cbnZhciBpbmRleE9mID0gW10uaW5kZXhPZlxudmFyIENvbnRleHQgPSBjbGFzcyBDb250ZXh0IHtcbiAgY29uc3RydWN0b3IgKGNvZGV3YXZlKSB7XG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlXG4gICAgdGhpcy5uYW1lU3BhY2VzID0gW11cbiAgfVxuXG4gIGFkZE5hbWVTcGFjZSAobmFtZSkge1xuICAgIGlmIChpbmRleE9mLmNhbGwodGhpcy5uYW1lU3BhY2VzLCBuYW1lKSA8IDApIHtcbiAgICAgIHRoaXMubmFtZVNwYWNlcy5wdXNoKG5hbWUpXG4gICAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlcyA9IG51bGxcbiAgICB9XG4gIH1cblxuICBhZGROYW1lc3BhY2VzIChzcGFjZXMpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzLCBzcGFjZVxuXG4gICAgaWYgKHNwYWNlcykge1xuICAgICAgaWYgKHR5cGVvZiBzcGFjZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNwYWNlcyA9IFtzcGFjZXNdXG4gICAgICB9XG5cbiAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBzcGFjZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgc3BhY2UgPSBzcGFjZXNbal1cbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuYWRkTmFtZVNwYWNlKHNwYWNlKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG4gIH1cblxuICByZW1vdmVOYW1lU3BhY2UgKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lU3BhY2VzID0gdGhpcy5uYW1lU3BhY2VzLmZpbHRlcihmdW5jdGlvbiAobikge1xuICAgICAgcmV0dXJuIG4gIT09IG5hbWVcbiAgICB9KVxuICB9XG5cbiAgZ2V0TmFtZVNwYWNlcyAoKSB7XG4gICAgdmFyIG5wY3NcblxuICAgIGlmICh0aGlzLl9uYW1lc3BhY2VzID09IG51bGwpIHtcbiAgICAgIG5wY3MgPSB0aGlzLm5hbWVTcGFjZXNcblxuICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KHRoaXMucGFyZW50LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbmFtZXNwYWNlcyA9IEFycmF5SGVscGVyLnVuaXF1ZShucGNzKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2VzXG4gIH1cblxuICBnZXRDbWQgKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBmaW5kZXJcbiAgICBmaW5kZXIgPSB0aGlzLmdldEZpbmRlcihjbWROYW1lLCBvcHRpb25zKVxuICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIH1cblxuICBnZXRGaW5kZXIgKGNtZE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgQ29udGV4dC5jbWRGaW5kZXJDbGFzcyhjbWROYW1lLCBPYmplY3QuYXNzaWduKHtcbiAgICAgIG5hbWVzcGFjZXM6IFtdLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0aGlzLmlzUm9vdCgpLFxuICAgICAgY29kZXdhdmU6IHRoaXMuY29kZXdhdmUsXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSwgb3B0aW9ucykpXG4gIH1cblxuICBpc1Jvb3QgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9PSBudWxsXG4gIH1cblxuICBnZXRQYXJlbnRPclJvb3QgKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudCAoc3RyKSB7XG4gICAgdmFyIGNjXG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKClcblxuICAgIGlmIChjYy5pbmRleE9mKCclcycpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5yZXBsYWNlKCclcycsIHN0cilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudExlZnQgKHN0ciA9ICcnKSB7XG4gICAgdmFyIGNjLCBpXG4gICAgY2MgPSB0aGlzLmdldENvbW1lbnRDaGFyKClcblxuICAgIGlmICgoaSA9IGNjLmluZGV4T2YoJyVzJykpID4gLTEpIHtcbiAgICAgIHJldHVybiBjYy5zdWJzdHIoMCwgaSkgKyBzdHJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gICAgfVxuICB9XG5cbiAgd3JhcENvbW1lbnRSaWdodCAoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGlcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKVxuXG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIHN0ciArIGNjLnN1YnN0cihpICsgMilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0ciArICcgJyArIGNjXG4gICAgfVxuICB9XG5cbiAgY21kSW5zdGFuY2VGb3IgKGNtZCkge1xuICAgIHJldHVybiBuZXcgQ29udGV4dC5jbWRJbnN0YW5jZUNsYXNzKGNtZCwgdGhpcylcbiAgfVxuXG4gIGdldENvbW1lbnRDaGFyICgpIHtcbiAgICB2YXIgY2hhciwgY21kLCBpbnN0LCByZXNcblxuICAgIGlmICh0aGlzLmNvbW1lbnRDaGFyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbW1lbnRDaGFyXG4gICAgfVxuXG4gICAgY21kID0gdGhpcy5nZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGluc3QgPSB0aGlzLmNtZEluc3RhbmNlRm9yKGNtZClcbiAgICAgIGluc3QuY29udGVudCA9ICclcydcbiAgICAgIHJlcyA9IGluc3QucmVzdWx0KClcblxuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbW1lbnRDaGFyID0gY2hhclxuICAgIHJldHVybiB0aGlzLmNvbW1lbnRDaGFyXG4gIH1cbn1cbmV4cG9ydHMuQ29udGV4dCA9IENvbnRleHRcbiIsIlxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpLkNvbW1hbmRcblxudmFyIEVkaXRDbWRQcm9wID0gY2xhc3MgRWRpdENtZFByb3Age1xuICBjb25zdHJ1Y3RvciAobmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywgaSwga2V5LCBsZW4sIHJlZiwgdmFsXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgdmFyOiBudWxsLFxuICAgICAgb3B0OiBudWxsLFxuICAgICAgZnVuY3Q6IG51bGwsXG4gICAgICBkYXRhTmFtZTogbnVsbCxcbiAgICAgIHNob3dFbXB0eTogZmFsc2UsXG4gICAgICBjYXJyZXQ6IGZhbHNlXG4gICAgfVxuICAgIHJlZiA9IFsndmFyJywgJ29wdCcsICdmdW5jdCddXG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGtleSA9IHJlZltpXVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgZGVmYXVsdHMuZGF0YU5hbWUgPSBvcHRpb25zW2tleV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRDbWQgKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSlcbiAgfVxuXG4gIHdyaXRlRm9yIChwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSBwYXJzZXIudmFyc1t0aGlzLm5hbWVdXG4gICAgfVxuICB9XG5cbiAgdmFsRnJvbUNtZCAoY21kKSB7XG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5vcHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmdldE9wdGlvbih0aGlzLm9wdClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZnVuY3QgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kW3RoaXMuZnVuY3RdKClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudmFyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLnZhcl1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzaG93Rm9yQ21kIChjbWQpIHtcbiAgICB2YXIgdmFsXG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgfHwgdmFsICE9IG51bGxcbiAgfVxuXG4gIGRpc3BsYXkgKGNtZCkge1xuICAgIGlmICh0aGlzLnNob3dGb3JDbWQoY21kKSkge1xuICAgICAgcmV0dXJuIGB+fiR7dGhpcy5uYW1lfX5+XFxuJHt0aGlzLnZhbEZyb21DbWQoY21kKSB8fCAnJ30ke3RoaXMuY2FycmV0ID8gJ3wnIDogJyd9XFxufn4vJHt0aGlzLm5hbWV9fn5gXG4gICAgfVxuICB9XG59XG5leHBvcnRzLkVkaXRDbWRQcm9wID0gRWRpdENtZFByb3BcbkVkaXRDbWRQcm9wLnNvdXJjZSA9IGNsYXNzIHNvdXJjZSBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgdmFsRnJvbUNtZCAoY21kKSB7XG4gICAgdmFyIHJlc1xuICAgIHJlcyA9IHN1cGVyLnZhbEZyb21DbWQoY21kKVxuXG4gICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICByZXMgPSByZXMucmVwbGFjZSgvXFx8L2csICd8fCcpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc1xuICB9XG5cbiAgc2V0Q21kIChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZCh0aGlzLm5hbWUsIHtcbiAgICAgIHByZXZlbnRQYXJzZUFsbDogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBzaG93Rm9yQ21kIChjbWQpIHtcbiAgICB2YXIgdmFsXG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgJiYgIShjbWQgIT0gbnVsbCAmJiBjbWQuYWxpYXNPZiAhPSBudWxsKSB8fCB2YWwgIT0gbnVsbFxuICB9XG59XG5FZGl0Q21kUHJvcC5zdHJpbmcgPSBjbGFzcyBzdHJpbmcgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIGRpc3BsYXkgKGNtZCkge1xuICAgIGlmICh0aGlzLnZhbEZyb21DbWQoY21kKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfSAnJHt0aGlzLnZhbEZyb21DbWQoY21kKX0ke3RoaXMuY2FycmV0ID8gJ3wnIDogJyd9J35+YFxuICAgIH1cbiAgfVxufVxuRWRpdENtZFByb3AucmV2Qm9vbCA9IGNsYXNzIHJldkJvb2wgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHNldENtZCAoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VCb29sVmFyQ21kKHRoaXMubmFtZSlcbiAgfVxuXG4gIHdyaXRlRm9yIChwYXJzZXIsIG9iaikge1xuICAgIGlmIChwYXJzZXIudmFyc1t0aGlzLm5hbWVdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmpbdGhpcy5kYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbdGhpcy5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXkgKGNtZCkge1xuICAgIHZhciB2YWxcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKVxuXG4gICAgaWYgKHZhbCAhPSBudWxsICYmICF2YWwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gXG4gICAgfVxuICB9XG59XG5FZGl0Q21kUHJvcC5ib29sID0gY2xhc3MgYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kIChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQodGhpcy5uYW1lKVxuICB9XG5cbiAgZGlzcGxheSAoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+ISR7dGhpcy5uYW1lfX5+YFxuICAgIH1cbiAgfVxufVxuIiwiXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG5jb25zdCBTdHJQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1N0clBvcycpLlN0clBvc1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKCcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJylcblxudmFyIEVkaXRvciA9IGNsYXNzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG51bGxcbiAgICB0aGlzLl9sYW5nID0gbnVsbFxuICB9XG5cbiAgYmluZGVkVG8gKGNvZGV3YXZlKSB7fVxuXG4gIHRleHQgKHZhbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHRleHRDaGFyQXQgKHBvcykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHRleHRMZW4gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHRleHRTdWJzdHIgKHN0YXJ0LCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBpbnNlcnRUZXh0QXQgKHRleHQsIHBvcykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHNwbGljZVRleHQgKHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBnZXRDdXJzb3JQb3MgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHNldEN1cnNvclBvcyAoc3RhcnQsIGVuZCA9IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBiZWdpblVuZG9BY3Rpb24gKCkge31cblxuICBlbmRVbmRvQWN0aW9uICgpIHt9XG5cbiAgZ2V0TGFuZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhbmdcbiAgfVxuXG4gIHNldExhbmcgKHZhbCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nID0gdmFsXG4gIH1cblxuICBnZXRFbW1ldENvbnRleHRPYmplY3QgKCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBhbGxvd011bHRpU2VsZWN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHNldE11bHRpU2VsIChzZWxlY3Rpb25zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgZ2V0TXVsdGlTZWwgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIGNhbkxpc3RlblRvQ2hhbmdlICgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIGdldExpbmVBdCAocG9zKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5maW5kTGluZVN0YXJ0KHBvcyksIHRoaXMuZmluZExpbmVFbmQocG9zKSlcbiAgfVxuXG4gIGZpbmRMaW5lU3RhcnQgKHBvcykge1xuICAgIHZhciBwXG4gICAgcCA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbJ1xcbiddLCAtMSlcblxuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3MgKyAxXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwXG4gICAgfVxuICB9XG5cbiAgZmluZExpbmVFbmQgKHBvcykge1xuICAgIHZhciBwXG4gICAgcCA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbJ1xcbicsICdcXHInXSlcblxuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcC5wb3NcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dExlbigpXG4gICAgfVxuICB9XG5cbiAgZmluZEFueU5leHQgKHN0YXJ0LCBzdHJpbmdzLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgdmFyIGJlc3RQb3MsIGJlc3RTdHIsIGksIGxlbiwgcG9zLCBzdHJpLCB0ZXh0XG5cbiAgICBpZiAoZGlyZWN0aW9uID4gMCkge1xuICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihzdGFydCwgdGhpcy50ZXh0TGVuKCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoMCwgc3RhcnQpXG4gICAgfVxuXG4gICAgYmVzdFBvcyA9IG51bGxcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHN0cmluZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0cmkgPSBzdHJpbmdzW2ldXG4gICAgICBwb3MgPSBkaXJlY3Rpb24gPiAwID8gdGV4dC5pbmRleE9mKHN0cmkpIDogdGV4dC5sYXN0SW5kZXhPZihzdHJpKVxuXG4gICAgICBpZiAocG9zICE9PSAtMSkge1xuICAgICAgICBpZiAoYmVzdFBvcyA9PSBudWxsIHx8IGJlc3RQb3MgKiBkaXJlY3Rpb24gPiBwb3MgKiBkaXJlY3Rpb24pIHtcbiAgICAgICAgICBiZXN0UG9zID0gcG9zXG4gICAgICAgICAgYmVzdFN0ciA9IHN0cmlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChiZXN0U3RyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3RyUG9zKGRpcmVjdGlvbiA+IDAgPyBiZXN0UG9zICsgc3RhcnQgOiBiZXN0UG9zLCBiZXN0U3RyKVxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50cyAocmVwbGFjZW1lbnRzKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VtZW50cy5yZWR1Y2UoKHByb21pc2UsIHJlcGwpID0+IHtcbiAgICAgIHJldHVybiBwcm9taXNlLnRoZW4ob3B0ID0+IHtcbiAgICAgICAgcmVwbC53aXRoRWRpdG9yKHRoaXMpXG4gICAgICAgIHJlcGwuYXBwbHlPZmZzZXQob3B0Lm9mZnNldClcbiAgICAgICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKShyZXBsLmFwcGx5KCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZWxlY3Rpb25zOiBvcHQuc2VsZWN0aW9ucy5jb25jYXQocmVwbC5zZWxlY3Rpb25zKSxcbiAgICAgICAgICAgIG9mZnNldDogb3B0Lm9mZnNldCArIHJlcGwub2Zmc2V0QWZ0ZXIodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh7XG4gICAgICBzZWxlY3Rpb25zOiBbXSxcbiAgICAgIG9mZnNldDogMFxuICAgIH0pKS50aGVuKG9wdCA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMob3B0LnNlbGVjdGlvbnMpXG4gICAgfSkucmVzdWx0KClcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyAoc2VsZWN0aW9ucykge1xuICAgIGlmIChzZWxlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0aGlzLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRNdWx0aVNlbChzZWxlY3Rpb25zKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q3Vyc29yUG9zKHNlbGVjdGlvbnNbMF0uc3RhcnQsIHNlbGVjdGlvbnNbMF0uZW5kKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5FZGl0b3IgPSBFZGl0b3JcbiIsIlxudmFyIExvZ2dlciA9IChmdW5jdGlvbiAoKSB7XG4gIGNsYXNzIExvZ2dlciB7XG4gICAgbG9nICguLi5hcmdzKSB7XG4gICAgICB2YXIgaSwgbGVuLCBtc2csIHJlc3VsdHNcblxuICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIG1zZyA9IGFyZ3NbaV1cbiAgICAgICAgICByZXN1bHRzLnB1c2goY29uc29sZS5sb2cobXNnKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9XG4gICAgfVxuXG4gICAgaXNFbmFibGVkICgpIHtcbiAgICAgIHJldHVybiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUgIT09IG51bGwgPyBjb25zb2xlLmxvZyA6IG51bGwpICE9IG51bGwgJiYgdGhpcy5lbmFibGVkICYmIExvZ2dlci5lbmFibGVkXG4gICAgfVxuXG4gICAgcnVudGltZSAoZnVuY3QsIG5hbWUgPSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcmVzLCB0MCwgdDFcbiAgICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICAgIHJlcyA9IGZ1bmN0KClcbiAgICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICAgIGNvbnNvbGUubG9nKGAke25hbWV9IHRvb2sgJHt0MSAtIHQwfSBtaWxsaXNlY29uZHMuYClcbiAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICB0b01vbml0b3IgKG9iaiwgbmFtZSwgcHJlZml4ID0gJycpIHtcbiAgICAgIHZhciBmdW5jdFxuICAgICAgZnVuY3QgPSBvYmpbbmFtZV1cbiAgICAgIHJldHVybiBvYmpbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICAgICAgcmV0dXJuIHRoaXMubW9uaXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0LmFwcGx5KG9iaiwgYXJncylcbiAgICAgICAgfSwgcHJlZml4ICsgbmFtZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtb25pdG9yIChmdW5jdCwgbmFtZSkge1xuICAgICAgdmFyIHJlcywgdDAsIHQxXG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgICByZXMgPSBmdW5jdCgpXG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG5cbiAgICAgIGlmICh0aGlzLm1vbml0b3JEYXRhW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS5jb3VudCsrXG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0udG90YWwgKz0gdDEgLSB0MFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXSA9IHtcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICByZXN1bWUgKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpXG4gICAgfVxuICB9XG5cbiAgO1xuICBMb2dnZXIuZW5hYmxlZCA9IHRydWVcbiAgTG9nZ2VyLnByb3RvdHlwZS5lbmFibGVkID0gdHJ1ZVxuICBMb2dnZXIucHJvdG90eXBlLm1vbml0b3JEYXRhID0ge31cbiAgcmV0dXJuIExvZ2dlclxufS5jYWxsKG51bGwpKVxuXG5leHBvcnRzLkxvZ2dlciA9IExvZ2dlclxuIiwiXG52YXIgT3B0aW9uT2JqZWN0ID0gY2xhc3MgT3B0aW9uT2JqZWN0IHtcbiAgc2V0T3B0cyAob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIga2V5LCByZWYsIHJlc3VsdHMsIHZhbFxuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHNcbiAgICByZXN1bHRzID0gW11cblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV1cblxuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIG9wdGlvbnNba2V5XSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCB2YWwpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cblxuICBzZXRPcHQgKGtleSwgdmFsKSB7XG4gICAgdmFyIHJlZlxuXG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiBudWxsKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKHZhbClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSA9IHZhbFxuICAgIH1cbiAgfVxuXG4gIGdldE9wdCAoa2V5KSB7XG4gICAgdmFyIHJlZlxuXG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiBudWxsKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XVxuICAgIH1cbiAgfVxuXG4gIGdldE9wdHMgKCkge1xuICAgIHZhciBrZXksIG9wdHMsIHJlZiwgdmFsXG4gICAgb3B0cyA9IHt9XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0c1xuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XVxuICAgICAgb3B0c1trZXldID0gdGhpcy5nZXRPcHQoa2V5KVxuICAgIH1cblxuICAgIHJldHVybiBvcHRzXG4gIH1cbn1cbmV4cG9ydHMuT3B0aW9uT2JqZWN0ID0gT3B0aW9uT2JqZWN0XG4iLCJcbmNvbnN0IENtZEluc3RhbmNlID0gcmVxdWlyZSgnLi9DbWRJbnN0YW5jZScpLkNtZEluc3RhbmNlXG5cbmNvbnN0IEJveEhlbHBlciA9IHJlcXVpcmUoJy4vQm94SGVscGVyJykuQm94SGVscGVyXG5cbmNvbnN0IFBhcmFtUGFyc2VyID0gcmVxdWlyZSgnLi9zdHJpbmdQYXJzZXJzL1BhcmFtUGFyc2VyJykuUGFyYW1QYXJzZXJcblxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3MnKS5Qb3NcblxuY29uc3QgU3RyUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9TdHJQb3MnKS5TdHJQb3NcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBOYW1lc3BhY2VIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJykuTmFtZXNwYWNlSGVscGVyXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuL0NvbW1hbmQnKS5Db21tYW5kXG5cbmNvbnN0IE9wdGlvbmFsUHJvbWlzZSA9IHJlcXVpcmUoJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnKVxuXG52YXIgUG9zaXRpb25lZENtZEluc3RhbmNlID0gY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3RvciAoY29kZXdhdmUsIHBvczEsIHN0cjEpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5jb2Rld2F2ZSA9IGNvZGV3YXZlXG4gICAgdGhpcy5wb3MgPSBwb3MxXG4gICAgdGhpcy5zdHIgPSBzdHIxXG5cbiAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aGlzLl9jaGVja0Nsb3NlcigpXG5cbiAgICAgIHRoaXMub3BlbmluZyA9IHRoaXMuc3RyXG4gICAgICB0aGlzLm5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpXG5cbiAgICAgIHRoaXMuX3NwbGl0Q29tcG9uZW50cygpXG5cbiAgICAgIHRoaXMuX2ZpbmRDbG9zaW5nKClcblxuICAgICAgdGhpcy5fY2hlY2tFbG9uZ2F0ZWQoKVxuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Nsb3NlciAoKSB7XG4gICAgdmFyIGYsIG5vQnJhY2tldFxuICAgIG5vQnJhY2tldCA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpXG5cbiAgICBpZiAobm9CcmFja2V0LnN1YnN0cmluZygwLCB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciAmJiAoZiA9IHRoaXMuX2ZpbmRPcGVuaW5nUG9zKCkpKSB7XG4gICAgICB0aGlzLmNsb3NpbmdQb3MgPSBuZXcgU3RyUG9zKHRoaXMucG9zLCB0aGlzLnN0cilcbiAgICAgIHRoaXMucG9zID0gZi5wb3NcbiAgICAgIHRoaXMuc3RyID0gZi5zdHJcbiAgICB9XG4gIH1cblxuICBfZmluZE9wZW5pbmdQb3MgKCkge1xuICAgIHZhciBjbG9zaW5nLCBjbWROYW1lLCBvcGVuaW5nXG4gICAgY21kTmFtZSA9IHRoaXMuX3JlbW92ZUJyYWNrZXQodGhpcy5zdHIpLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpXG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWVcbiAgICBjbG9zaW5nID0gdGhpcy5zdHJcblxuICAgIGNvbnN0IGYgPSB0aGlzLmNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIodGhpcy5wb3MsIG9wZW5pbmcsIGNsb3NpbmcsIC0xKVxuICAgIGlmIChmKSB7XG4gICAgICBmLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZi5wb3MsIHRoaXMuY29kZXdhdmUuZmluZE5leHRCcmFrZXQoZi5wb3MgKyBmLnN0ci5sZW5ndGgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgICAgIHJldHVybiBmXG4gICAgfVxuICB9XG5cbiAgX3NwbGl0Q29tcG9uZW50cyAoKSB7XG4gICAgdmFyIHBhcnRzXG4gICAgcGFydHMgPSB0aGlzLm5vQnJhY2tldC5zcGxpdCgnICcpXG4gICAgdGhpcy5jbWROYW1lID0gcGFydHMuc2hpZnQoKVxuICAgIHRoaXMucmF3UGFyYW1zID0gcGFydHMuam9pbignICcpXG4gIH1cblxuICBfcGFyc2VQYXJhbXMgKHBhcmFtcykge1xuICAgIHZhciBuYW1lVG9QYXJhbSwgcGFyc2VyXG4gICAgcGFyc2VyID0gbmV3IFBhcmFtUGFyc2VyKHBhcmFtcywge1xuICAgICAgYWxsb3dlZE5hbWVkOiB0aGlzLmdldE9wdGlvbignYWxsb3dlZE5hbWVkJyksXG4gICAgICB2YXJzOiB0aGlzLmNvZGV3YXZlLnZhcnNcbiAgICB9KVxuICAgIHRoaXMucGFyYW1zID0gcGFyc2VyLnBhcmFtc1xuICAgIHRoaXMubmFtZWQgPSBPYmplY3QuYXNzaWduKHRoaXMuZ2V0RGVmYXVsdHMoKSwgcGFyc2VyLm5hbWVkKVxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIG5hbWVUb1BhcmFtID0gdGhpcy5nZXRPcHRpb24oJ25hbWVUb1BhcmFtJylcblxuICAgICAgaWYgKG5hbWVUb1BhcmFtICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5uYW1lZFtuYW1lVG9QYXJhbV0gPSB0aGlzLmNtZE5hbWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmcgKCkge1xuICAgIGNvbnN0IGYgPSB0aGlzLl9maW5kQ2xvc2luZ1BvcygpXG4gICAgaWYgKGYpIHtcbiAgICAgIHRoaXMuY29udGVudCA9IFN0cmluZ0hlbHBlci50cmltRW1wdHlMaW5lKHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgsIGYucG9zKSlcbiAgICAgIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZi5wb3MgKyBmLnN0ci5sZW5ndGgpXG4gICAgfVxuICB9XG5cbiAgX2ZpbmRDbG9zaW5nUG9zICgpIHtcbiAgICB2YXIgY2xvc2luZywgb3BlbmluZ1xuXG4gICAgaWYgKHRoaXMuY2xvc2luZ1BvcyAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUG9zXG4gICAgfVxuXG4gICAgY2xvc2luZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWROYW1lICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzXG4gICAgb3BlbmluZyA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY21kTmFtZVxuXG4gICAgY29uc3QgZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCwgb3BlbmluZywgY2xvc2luZylcbiAgICBpZiAoZikge1xuICAgICAgdGhpcy5jbG9zaW5nUG9zID0gZlxuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1Bvc1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Vsb25nYXRlZCAoKSB7XG4gICAgdmFyIGVuZFBvcywgbWF4LCByZWZcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpXG4gICAgbWF4ID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpXG5cbiAgICB3aGlsZSAoZW5kUG9zIDwgbWF4ICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5kZWNvKSB7XG4gICAgICBlbmRQb3MgKz0gdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aFxuICAgIH1cblxuICAgIGlmIChlbmRQb3MgPj0gbWF4IHx8IChyZWYgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkpID09PSAnICcgfHwgcmVmID09PSAnXFxuJyB8fCByZWYgPT09ICdcXHInKSB7XG4gICAgICB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGVuZFBvcylcbiAgICB9XG4gIH1cblxuICBfY2hlY2tCb3ggKCkge1xuICAgIHZhciBjbCwgY3IsIGVuZFBvc1xuXG4gICAgaWYgKHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsICYmIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PT0gJ2NvbW1lbnQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjbCA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKVxuICAgIGNyID0gdGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKVxuICAgIGVuZFBvcyA9IHRoaXMuZ2V0RW5kUG9zKCkgKyBjci5sZW5ndGhcblxuICAgIGlmICh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zIC0gY2wubGVuZ3RoLCB0aGlzLnBvcykgPT09IGNsICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLCBlbmRQb3MpID09PSBjcikge1xuICAgICAgdGhpcy5wb3MgPSB0aGlzLnBvcyAtIGNsLmxlbmd0aFxuICAgICAgdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBlbmRQb3MpXG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KClcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkuaW5kZXhPZihjbCkgPiAtMSAmJiB0aGlzLmdldFBvcygpLnNhbWVMaW5lc1N1ZmZpeCgpLmluZGV4T2YoY3IpID4gLTEpIHtcbiAgICAgIHRoaXMuaW5Cb3ggPSAxXG4gICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KClcbiAgICB9XG4gIH1cblxuICBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50ICgpIHtcbiAgICB2YXIgZWNsLCBlY3IsIGVkLCByZTEsIHJlMiwgcmUzXG5cbiAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvZGV3YXZlLmRlY28pXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKGBeXFxcXHMqJHtlY2x9KD86JHtlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86JHtlZH0pKyR7ZWNyfSRgLCAnZ20nKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXlxcXFxzKig/OiR7ZWR9KSoke2Vjcn1cXHI/XFxuYClcbiAgICAgIHJlMyA9IG5ldyBSZWdFeHAoYFxcblxcXFxzKiR7ZWNsfSg/OiR7ZWR9KSpcXFxccyokYClcbiAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudC5yZXBsYWNlKHJlMSwgJyQxJykucmVwbGFjZShyZTIsICcnKS5yZXBsYWNlKHJlMywgJycpXG4gICAgfVxuICB9XG5cbiAgX2dldFBhcmVudENtZHMgKCkge1xuICAgIHZhciByZWZcbiAgICB0aGlzLnBhcmVudCA9IChyZWYgPSB0aGlzLmNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZCh0aGlzLmdldEVuZFBvcygpKSkgIT0gbnVsbCA/IHJlZi5pbml0KCkgOiBudWxsXG4gICAgcmV0dXJuIHRoaXMucGFyZW50XG4gIH1cblxuICBzZXRNdWx0aVBvcyAobXVsdGlQb3MpIHtcbiAgICB0aGlzLm11bHRpUG9zID0gbXVsdGlQb3NcbiAgfVxuXG4gIF9nZXRDbWRPYmogKCkge1xuICAgIHRoaXMuZ2V0Q21kKClcblxuICAgIHRoaXMuX2NoZWNrQm94KClcblxuICAgIHRoaXMuY29udGVudCA9IHRoaXMucmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGhpcy5jb250ZW50KVxuICAgIHJldHVybiBzdXBlci5fZ2V0Q21kT2JqKClcbiAgfVxuXG4gIF9pbml0UGFyYW1zICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2VQYXJhbXModGhpcy5yYXdQYXJhbXMpXG4gIH1cblxuICBnZXRDb250ZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IHRoaXMuY29kZXdhdmUuY29udGV4dFxuICB9XG5cbiAgZ2V0Q21kICgpIHtcbiAgICBpZiAodGhpcy5jbWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fZ2V0UGFyZW50Q21kcygpXG5cbiAgICAgIGlmICh0aGlzLm5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikge1xuICAgICAgICB0aGlzLmNtZCA9IENvbW1hbmQuY21kcy5nZXRDbWQoJ2NvcmU6bm9fZXhlY3V0ZScpXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY29kZXdhdmUuY29udGV4dFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZmluZGVyLmNvbnRleHRcbiAgICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKClcblxuICAgICAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5jbWQuZnVsbE5hbWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jbWRcbiAgfVxuXG4gIGdldEZpbmRlciAoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXJcbiAgICBmaW5kZXIgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzICgpIHtcbiAgICB2YXIgbnNwY3MsIG9ialxuICAgIG5zcGNzID0gW11cbiAgICBvYmogPSB0aGlzXG5cbiAgICB3aGlsZSAob2JqLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICBvYmogPSBvYmoucGFyZW50XG5cbiAgICAgIGlmIChvYmouY21kICE9IG51bGwgJiYgb2JqLmNtZC5mdWxsTmFtZSAhPSBudWxsKSB7XG4gICAgICAgIG5zcGNzLnB1c2gob2JqLmNtZC5mdWxsTmFtZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnNwY3NcbiAgfVxuXG4gIF9yZW1vdmVCcmFja2V0IChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoLCBzdHIubGVuZ3RoIC0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgfVxuXG4gIGFsdGVyQWxpYXNPZiAoYWxpYXNPZikge1xuICAgIGNvbnN0IGNtZE5hbWUgPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQodGhpcy5jbWROYW1lKVsxXVxuICAgIHJldHVybiBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIGNtZE5hbWUpXG4gIH1cblxuICBpc0VtcHR5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdHIgPT09IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzIHx8IHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHNcbiAgfVxuXG4gIGV4ZWN1dGUgKCkge1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgaWYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wICE9IG51bGwgJiYgdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAud2hpdGhpbk9wZW5Cb3VuZHModGhpcy5wb3MgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcC5jYW5jZWwoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgoJycpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBjb25zdCBiZWZvcmVGdW5jdCA9IHRoaXMuZ2V0T3B0aW9uKCdiZWZvcmVFeGVjdXRlJylcbiAgICAgIGlmIChiZWZvcmVGdW5jdCkge1xuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZXN1bHRJc0F2YWlsYWJsZSgpKSB7XG4gICAgICAgIHJldHVybiAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkodGhpcy5yZXN1bHQoKSkudGhlbihyZXMgPT4ge1xuICAgICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZVdpdGgocmVzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSkucmVzdWx0KClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkV4ZWN1dGVGdW5jdCgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RW5kUG9zICgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGhcbiAgfVxuXG4gIGdldFBvcyAoKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5wb3MsIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKVxuICB9XG5cbiAgZ2V0T3BlbmluZ1BvcyAoKSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5wb3MsIHRoaXMucG9zICsgdGhpcy5vcGVuaW5nLmxlbmd0aCkud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcilcbiAgfVxuXG4gIGdldEluZGVudCAoKSB7XG4gICAgdmFyIGhlbHBlclxuXG4gICAgaWYgKHRoaXMuaW5kZW50TGVuID09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpXG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gaGVscGVyLnJlbW92ZUNvbW1lbnQodGhpcy5nZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKSkubGVuZ3RoXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluZGVudExlbiA9IHRoaXMucG9zIC0gdGhpcy5nZXRQb3MoKS5wcmV2RU9MKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbmRlbnRMZW5cbiAgfVxuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50ICh0ZXh0KSB7XG4gICAgdmFyIHJlZ1xuXG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycgKyB0aGlzLmdldEluZGVudCgpICsgJ30nLCAnZ20nKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsICcnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dFxuICAgIH1cbiAgfVxuXG4gIGFsdGVyUmVzdWx0Rm9yQm94IChyZXBsKSB7XG4gICAgdmFyIGJveCwgaGVscGVyLCBvcmlnaW5hbCwgcmVzXG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKVxuICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0KVxuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLCBmYWxzZSlcblxuICAgIGlmICh0aGlzLmdldE9wdGlvbigncmVwbGFjZUJveCcpKSB7XG4gICAgICBib3ggPSBoZWxwZXIuZ2V0Qm94Rm9yUG9zKG9yaWdpbmFsKTtcbiAgICAgIFtyZXBsLnN0YXJ0LCByZXBsLmVuZF0gPSBbYm94LnN0YXJ0LCBib3guZW5kXVxuICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIuaW5kZW50XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgICByZXBsLnN0YXJ0ID0gb3JpZ2luYWwucHJldkVPTCgpXG4gICAgICByZXBsLmVuZCA9IG9yaWdpbmFsLm5leHRFT0woKVxuICAgICAgcmVzID0gaGVscGVyLnJlZm9ybWF0TGluZXMob3JpZ2luYWwuc2FtZUxpbmVzUHJlZml4KCkgKyB0aGlzLmNvZGV3YXZlLm1hcmtlciArIHJlcGwudGV4dCArIHRoaXMuY29kZXdhdmUubWFya2VyICsgb3JpZ2luYWwuc2FtZUxpbmVzU3VmZml4KCksIHtcbiAgICAgICAgbXVsdGlsaW5lOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBbcmVwbC5wcmVmaXgsIHJlcGwudGV4dCwgcmVwbC5zdWZmaXhdID0gcmVzLnNwbGl0KHRoaXMuY29kZXdhdmUubWFya2VyKVxuICAgIH1cblxuICAgIHJldHVybiByZXBsXG4gIH1cblxuICBnZXRDdXJzb3JGcm9tUmVzdWx0IChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcFxuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KClcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsICYmIHRoaXMuY29kZXdhdmUuY2hlY2tDYXJyZXQgJiYgdGhpcy5nZXRPcHRpb24oJ2NoZWNrQ2FycmV0JykpIHtcbiAgICAgIGlmICgocCA9IHRoaXMuY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCArIHJlcGwucHJlZml4Lmxlbmd0aCArIHBcbiAgICAgIH1cblxuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQocmVwbC50ZXh0KVxuICAgIH1cblxuICAgIHJldHVybiBjdXJzb3JQb3NcbiAgfVxuXG4gIGNoZWNrTXVsdGkgKHJlcGwpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBuZXdSZXBsLCBvcmlnaW5hbFBvcywgb3JpZ2luYWxUZXh0LCBwb3MsIHJlZiwgcmVwbGFjZW1lbnRzXG5cbiAgICBpZiAodGhpcy5tdWx0aVBvcyAhPSBudWxsICYmIHRoaXMubXVsdGlQb3MubGVuZ3RoID4gMSkge1xuICAgICAgcmVwbGFjZW1lbnRzID0gW3JlcGxdXG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpXG4gICAgICByZWYgPSB0aGlzLm11bHRpUG9zXG5cbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgIHBvcyA9IHJlZltpXVxuXG4gICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgb3JpZ2luYWxQb3MgPSBwb3Muc3RhcnRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0IC0gb3JpZ2luYWxQb3MpXG5cbiAgICAgICAgICBpZiAobmV3UmVwbC5vcmlnaW5hbFRleHQoKSA9PT0gb3JpZ2luYWxUZXh0KSB7XG4gICAgICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXdSZXBsKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRzXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbcmVwbF1cbiAgICB9XG4gIH1cblxuICByZXBsYWNlV2l0aCAodGV4dCkge1xuICAgIHJldHVybiB0aGlzLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KHRoaXMucG9zLCB0aGlzLmdldEVuZFBvcygpLCB0ZXh0KSlcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnQgKHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCByZXBsYWNlbWVudHNcbiAgICByZXBsLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpXG5cbiAgICBpZiAodGhpcy5pbkJveCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgIH1cblxuICAgIGN1cnNvclBvcyA9IHRoaXMuZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKVxuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKGN1cnNvclBvcywgY3Vyc29yUG9zKV1cbiAgICByZXBsYWNlbWVudHMgPSB0aGlzLmNoZWNrTXVsdGkocmVwbClcbiAgICB0aGlzLnJlcGxhY2VTdGFydCA9IHJlcGwuc3RhcnRcbiAgICB0aGlzLnJlcGxhY2VFbmQgPSByZXBsLnJlc0VuZCgpXG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgfVxufVxuZXhwb3J0cy5Qb3NpdGlvbmVkQ21kSW5zdGFuY2UgPSBQb3NpdGlvbmVkQ21kSW5zdGFuY2VcbiIsIlxudmFyIFByb2Nlc3MgPSBjbGFzcyBQcm9jZXNzIHtcbiAgY29uc3RydWN0b3IgKCkge31cbn1cbmV4cG9ydHMuUHJvY2VzcyA9IFByb2Nlc3NcbiIsIlxuY29uc3QgTG9nZ2VyID0gcmVxdWlyZSgnLi9Mb2dnZXInKS5Mb2dnZXJcblxudmFyIFN0b3JhZ2UgPSBjbGFzcyBTdG9yYWdlIHtcbiAgY29uc3RydWN0b3IgKGVuZ2luZSkge1xuICAgIHRoaXMuZW5naW5lID0gZW5naW5lXG4gIH1cblxuICBzYXZlIChrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZShrZXksIHZhbClcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoIChwYXRoLCBrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmVuZ2luZUF2YWlsYWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUuc2F2ZUluUGF0aChwYXRoLCBrZXksIHZhbClcbiAgICB9XG4gIH1cblxuICBsb2FkIChrZXkpIHtcbiAgICBpZiAodGhpcy5lbmdpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLmxvYWQoa2V5KVxuICAgIH1cbiAgfVxuXG4gIGVuZ2luZUF2YWlsYWJsZSAoKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9nZ2VyID0gdGhpcy5sb2dnZXIgfHwgbmV3IExvZ2dlcigpXG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ05vIHN0b3JhZ2UgZW5naW5lIGF2YWlsYWJsZScpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cbn1cbmV4cG9ydHMuU3RvcmFnZSA9IFN0b3JhZ2VcbiIsIlxuY29uc3QgVGV4dFBhcnNlciA9IHJlcXVpcmUoJy4vVGV4dFBhcnNlcicpLlRleHRQYXJzZXJcblxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3MnKS5Qb3NcblxudmFyIGlzRWxlbWVudFxudmFyIERvbUtleUxpc3RlbmVyID0gY2xhc3MgRG9tS2V5TGlzdGVuZXIge1xuICBzdGFydExpc3RlbmluZyAodGFyZ2V0KSB7XG4gICAgdmFyIG9ua2V5ZG93biwgb25rZXlwcmVzcywgb25rZXl1cCwgdGltZW91dFxuICAgIHRpbWVvdXQgPSBudWxsXG5cbiAgICBvbmtleWRvd24gPSBlID0+IHtcbiAgICAgIGlmICgoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgfHwgdGhpcy5vYmogPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpICYmIGUua2V5Q29kZSA9PT0gNjkgJiYgZS5jdHJsS2V5KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgIGlmICh0aGlzLm9uQWN0aXZhdGlvbktleSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BY3RpdmF0aW9uS2V5KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIG9ua2V5dXAgPSBlID0+IHtcbiAgICAgIGlmICh0aGlzLm9uQW55Q2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvbmtleXByZXNzID0gZSA9PiB7XG4gICAgICBpZiAodGltZW91dCAhPSBudWxsKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vbkFueUNoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25BbnlDaGFuZ2UoZSlcbiAgICAgICAgfVxuICAgICAgfSwgMTAwKVxuICAgIH1cblxuICAgIGlmICh0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbmtleWRvd24pXG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbmtleXVwKVxuICAgICAgcmV0dXJuIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIG9ua2V5cHJlc3MpXG4gICAgfSBlbHNlIGlmICh0YXJnZXQuYXR0YWNoRXZlbnQpIHtcbiAgICAgIHRhcmdldC5hdHRhY2hFdmVudCgnb25rZXlkb3duJywgb25rZXlkb3duKVxuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KCdvbmtleXVwJywgb25rZXl1cClcbiAgICAgIHJldHVybiB0YXJnZXQuYXR0YWNoRXZlbnQoJ29ua2V5cHJlc3MnLCBvbmtleXByZXNzKVxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5Eb21LZXlMaXN0ZW5lciA9IERvbUtleUxpc3RlbmVyXG5cbmlzRWxlbWVudCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGVcblxuICB0cnkge1xuICAgIC8vIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tKVxuICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvciAvLyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgLy8gYW4gZXhjZXB0aW9uIGlzIHRocm93biBhbmQgd2UgZW5kIHVwIGhlcmUuIFRlc3Rpbmcgc29tZVxuICAgIC8vIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcblxuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmoubm9kZVR5cGUgPT09IDEgJiYgdHlwZW9mIG9iai5zdHlsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9iai5vd25lckRvY3VtZW50ID09PSAnb2JqZWN0J1xuICB9XG59XG5cbnZhciBUZXh0QXJlYUVkaXRvciA9IChmdW5jdGlvbiAoKSB7XG4gIGNsYXNzIFRleHRBcmVhRWRpdG9yIGV4dGVuZHMgVGV4dFBhcnNlciB7XG4gICAgY29uc3RydWN0b3IgKHRhcmdldDEpIHtcbiAgICAgIHN1cGVyKClcbiAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0MVxuICAgICAgdGhpcy5vYmogPSBpc0VsZW1lbnQodGhpcy50YXJnZXQpID8gdGhpcy50YXJnZXQgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldClcblxuICAgICAgaWYgKHRoaXMub2JqID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgJ1RleHRBcmVhIG5vdCBmb3VuZCdcbiAgICAgIH1cblxuICAgICAgdGhpcy5uYW1lc3BhY2UgPSAndGV4dGFyZWEnXG4gICAgICB0aGlzLmNoYW5nZUxpc3RlbmVycyA9IFtdXG4gICAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPSAwXG4gICAgfVxuXG4gICAgb25BbnlDaGFuZ2UgKGUpIHtcbiAgICAgIHZhciBjYWxsYmFjaywgaiwgbGVuMSwgcmVmLCByZXN1bHRzXG5cbiAgICAgIGlmICh0aGlzLl9za2lwQ2hhbmdlRXZlbnQgPD0gMCkge1xuICAgICAgICByZWYgPSB0aGlzLmNoYW5nZUxpc3RlbmVyc1xuICAgICAgICByZXN1bHRzID0gW11cblxuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIGNhbGxiYWNrID0gcmVmW2pdXG4gICAgICAgICAgcmVzdWx0cy5wdXNoKGNhbGxiYWNrKCkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50LS1cblxuICAgICAgICBpZiAodGhpcy5vblNraXBlZENoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25Ta2lwZWRDaGFuZ2UoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2tpcENoYW5nZUV2ZW50IChuYiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLl9za2lwQ2hhbmdlRXZlbnQgKz0gbmJcbiAgICB9XG5cbiAgICBiaW5kZWRUbyAoY29kZXdhdmUpIHtcbiAgICAgIHRoaXMub25BY3RpdmF0aW9uS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY29kZXdhdmUub25BY3RpdmF0aW9uS2V5KClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpXG4gICAgfVxuXG4gICAgc2VsZWN0aW9uUHJvcEV4aXN0cyAoKSB7XG4gICAgICByZXR1cm4gJ3NlbGVjdGlvblN0YXJ0JyBpbiB0aGlzLm9ialxuICAgIH1cblxuICAgIGhhc0ZvY3VzICgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLm9ialxuICAgIH1cblxuICAgIHRleHQgKHZhbCkge1xuICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy50ZXh0RXZlbnRDaGFuZ2UodmFsKSkge1xuICAgICAgICAgIHRoaXMub2JqLnZhbHVlID0gdmFsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMub2JqLnZhbHVlXG4gICAgfVxuXG4gICAgc3BsaWNlVGV4dCAoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHRoaXMuc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSB8fCBzdXBlci5zcGxpY2VUZXh0KHN0YXJ0LCBlbmQsIHRleHQpXG4gICAgfVxuXG4gICAgdGV4dEV2ZW50Q2hhbmdlICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIHZhciBldmVudFxuXG4gICAgICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQgIT0gbnVsbCkge1xuICAgICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUZXh0RXZlbnQnKVxuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnQgIT0gbnVsbCAmJiBldmVudC5pbml0VGV4dEV2ZW50ICE9IG51bGwgJiYgZXZlbnQuaXNUcnVzdGVkICE9PSBmYWxzZSkge1xuICAgICAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgICAgICBlbmQgPSB0aGlzLnRleHRMZW4oKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIGlmIChzdGFydCAhPT0gMCkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihzdGFydCAtIDEsIHN0YXJ0KVxuICAgICAgICAgICAgc3RhcnQtLVxuICAgICAgICAgIH0gZWxzZSBpZiAoZW5kICE9PSB0aGlzLnRleHRMZW4oKSkge1xuICAgICAgICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cihlbmQsIGVuZCArIDEpXG4gICAgICAgICAgICBlbmQrK1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5pbml0VGV4dEV2ZW50KCd0ZXh0SW5wdXQnLCB0cnVlLCB0cnVlLCBudWxsLCB0ZXh0LCA5KSAvLyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcblxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgICB0aGlzLm9iai5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgICAgICB0aGlzLnNraXBDaGFuZ2VFdmVudCgpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICAgIGlmIChkb2N1bWVudC5leGVjQ29tbWFuZCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgdGV4dClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldEN1cnNvclBvcyAoKSB7XG4gICAgICBpZiAodGhpcy50bXBDdXJzb3JQb3MgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy50bXBDdXJzb3JQb3NcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaGFzRm9jdXMpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJvcEV4aXN0cykge1xuICAgICAgICAgIHJldHVybiBuZXcgUG9zKHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0LCB0aGlzLm9iai5zZWxlY3Rpb25FbmQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zRmFsbGJhY2sgKCkge1xuICAgICAgdmFyIGxlbiwgcG9zLCBybmcsIHNlbFxuXG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpXG5cbiAgICAgICAgaWYgKHNlbC5wYXJlbnRFbGVtZW50KCkgPT09IHRoaXMub2JqKSB7XG4gICAgICAgICAgcm5nID0gdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgICBybmcubW92ZVRvQm9va21hcmsoc2VsLmdldEJvb2ttYXJrKCkpXG4gICAgICAgICAgbGVuID0gMFxuXG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKCdFbmRUb1N0YXJ0Jywgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIGxlbisrXG4gICAgICAgICAgICBybmcubW92ZUVuZCgnY2hhcmFjdGVyJywgLTEpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcm5nLnNldEVuZFBvaW50KCdTdGFydFRvU3RhcnQnLCB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKSlcbiAgICAgICAgICBwb3MgPSBuZXcgUG9zKDAsIGxlbilcblxuICAgICAgICAgIHdoaWxlIChybmcuY29tcGFyZUVuZFBvaW50cygnRW5kVG9TdGFydCcsIHJuZykgPiAwKSB7XG4gICAgICAgICAgICBwb3Muc3RhcnQrK1xuICAgICAgICAgICAgcG9zLmVuZCsrXG4gICAgICAgICAgICBybmcubW92ZUVuZCgnY2hhcmFjdGVyJywgLTEpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHBvc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yUG9zIChzdGFydCwgZW5kKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgZW5kID0gc3RhcnRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJvcEV4aXN0cykge1xuICAgICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG5ldyBQb3Moc3RhcnQsIGVuZClcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBudWxsXG4gICAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgICAgIHJldHVybiB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgICAgfSwgMSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdXJzb3JQb3NGYWxsYmFjayAoc3RhcnQsIGVuZCkge1xuICAgICAgdmFyIHJuZ1xuXG4gICAgICBpZiAodGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHJuZy5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIHN0YXJ0KVxuICAgICAgICBybmcuY29sbGFwc2UoKVxuICAgICAgICBybmcubW92ZUVuZCgnY2hhcmFjdGVyJywgZW5kIC0gc3RhcnQpXG4gICAgICAgIHJldHVybiBybmcuc2VsZWN0KClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYW5nICgpIHtcbiAgICAgIGlmICh0aGlzLl9sYW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYW5nXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpXG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0TGFuZyAodmFsKSB7XG4gICAgICB0aGlzLl9sYW5nID0gdmFsXG4gICAgICByZXR1cm4gdGhpcy5vYmouc2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnLCB2YWwpXG4gICAgfVxuXG4gICAgY2FuTGlzdGVuVG9DaGFuZ2UgKCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBhZGRDaGFuZ2VMaXN0ZW5lciAoY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYW5nZUxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKVxuICAgIH1cblxuICAgIHJlbW92ZUNoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xuICAgICAgdmFyIGlcblxuICAgICAgaWYgKChpID0gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpLCAxKVxuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5UmVwbGFjZW1lbnRzIChyZXBsYWNlbWVudHMpIHtcbiAgICAgIGlmIChyZXBsYWNlbWVudHMubGVuZ3RoID4gMCAmJiByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zID0gW3RoaXMuZ2V0Q3Vyc29yUG9zKCldXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdXBlci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gICAgfVxuICB9XG5cbiAgO1xuICBUZXh0QXJlYUVkaXRvci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmcgPSBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmdcbiAgcmV0dXJuIFRleHRBcmVhRWRpdG9yXG59LmNhbGwobnVsbCkpXG5cbmV4cG9ydHMuVGV4dEFyZWFFZGl0b3IgPSBUZXh0QXJlYUVkaXRvclxuIiwiXG5jb25zdCBFZGl0b3IgPSByZXF1aXJlKCcuL0VkaXRvcicpLkVkaXRvclxuXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG52YXIgVGV4dFBhcnNlciA9IGNsYXNzIFRleHRQYXJzZXIgZXh0ZW5kcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvciAoX3RleHQpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5fdGV4dCA9IF90ZXh0XG4gIH1cblxuICB0ZXh0ICh2YWwpIHtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RleHQgPSB2YWxcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGV4dFxuICB9XG5cbiAgdGV4dENoYXJBdCAocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpW3Bvc11cbiAgfVxuXG4gIHRleHRMZW4gKHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS5sZW5ndGhcbiAgfVxuXG4gIHRleHRTdWJzdHIgKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gIH1cblxuICBpbnNlcnRUZXh0QXQgKHRleHQsIHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQodGhpcy50ZXh0KCkuc3Vic3RyaW5nKDAsIHBvcykgKyB0ZXh0ICsgdGhpcy50ZXh0KCkuc3Vic3RyaW5nKHBvcywgdGhpcy50ZXh0KCkubGVuZ3RoKSlcbiAgfVxuXG4gIHNwbGljZVRleHQgKHN0YXJ0LCBlbmQsIHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnNsaWNlKDAsIHN0YXJ0KSArICh0ZXh0IHx8ICcnKSArIHRoaXMudGV4dCgpLnNsaWNlKGVuZCkpXG4gIH1cblxuICBnZXRDdXJzb3JQb3MgKCkge1xuICAgIHJldHVybiB0aGlzLnRhcmdldFxuICB9XG5cbiAgc2V0Q3Vyc29yUG9zIChzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBlbmQgPSBzdGFydFxuICAgIH1cblxuICAgIHRoaXMudGFyZ2V0ID0gbmV3IFBvcyhzdGFydCwgZW5kKVxuICAgIHJldHVybiB0aGlzLnRhcmdldFxuICB9XG59XG5leHBvcnRzLlRleHRQYXJzZXIgPSBUZXh0UGFyc2VyXG4iLCIndXNlIHN0cmljdCdcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSlcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnQ29kZXdhdmUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBDb2Rld2F2ZVxuICB9XG59KVxuXG5jb25zdCBDb2Rld2F2ZSA9IHJlcXVpcmUoJy4vQ29kZXdhdmUnKS5Db2Rld2F2ZVxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBDb3JlQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL0NvcmVDb21tYW5kUHJvdmlkZXInKS5Db3JlQ29tbWFuZFByb3ZpZGVyXG5cbmNvbnN0IEpzQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL0pzQ29tbWFuZFByb3ZpZGVyJykuSnNDb21tYW5kUHJvdmlkZXJcblxuY29uc3QgUGhwQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL1BocENvbW1hbmRQcm92aWRlcicpLlBocENvbW1hbmRQcm92aWRlclxuXG5jb25zdCBIdG1sQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXInKS5IdG1sQ29tbWFuZFByb3ZpZGVyXG5cbmNvbnN0IEZpbGVDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKCcuL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlcicpLkZpbGVDb21tYW5kUHJvdmlkZXJcblxuY29uc3QgU3RyaW5nQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlcicpLlN0cmluZ0NvbW1hbmRQcm92aWRlclxuXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG5jb25zdCBXcmFwcGVkUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9XcmFwcGVkUG9zJykuV3JhcHBlZFBvc1xuXG5jb25zdCBMb2NhbFN0b3JhZ2VFbmdpbmUgPSByZXF1aXJlKCcuL3N0b3JhZ2VFbmdpbmVzL0xvY2FsU3RvcmFnZUVuZ2luZScpLkxvY2FsU3RvcmFnZUVuZ2luZVxuXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBDbWRJbnN0YW5jZSA9IHJlcXVpcmUoJy4vQ21kSW5zdGFuY2UnKS5DbWRJbnN0YW5jZVxuXG5jb25zdCBDbWRGaW5kZXIgPSByZXF1aXJlKCcuL0NtZEZpbmRlcicpLkNtZEZpbmRlclxuXG5Db250ZXh0LmNtZEluc3RhbmNlQ2xhc3MgPSBDbWRJbnN0YW5jZVxuQ29udGV4dC5jbWRGaW5kZXJDbGFzcyA9IENtZEZpbmRlclxuXG5Qb3Mud3JhcENsYXNzID0gV3JhcHBlZFBvc1xuQ29kZXdhdmUuaW5zdGFuY2VzID0gW11cbkNvbW1hbmQucHJvdmlkZXJzID0gW25ldyBDb3JlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBKc0NvbW1hbmRQcm92aWRlcigpLCBuZXcgUGhwQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBIdG1sQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBGaWxlQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBTdHJpbmdDb21tYW5kUHJvdmlkZXIoKV1cblxuaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICBDb21tYW5kLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlRW5naW5lKClcbn1cbiIsIlxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5Db21tYW5kXG5jb25zdCBCYXNlQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5CYXNlQ29tbWFuZFxuXG5jb25zdCBMYW5nRGV0ZWN0b3IgPSByZXF1aXJlKCcuLi9kZXRlY3RvcnMvTGFuZ0RldGVjdG9yJykuTGFuZ0RldGVjdG9yXG5cbmNvbnN0IEFsd2F5c0VuYWJsZWQgPSByZXF1aXJlKCcuLi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZCcpLkFsd2F5c0VuYWJsZWRcblxuY29uc3QgQm94SGVscGVyID0gcmVxdWlyZSgnLi4vQm94SGVscGVyJykuQm94SGVscGVyXG5cbmNvbnN0IEVkaXRDbWRQcm9wID0gcmVxdWlyZSgnLi4vRWRpdENtZFByb3AnKS5FZGl0Q21kUHJvcFxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBQYXRoSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9QYXRoSGVscGVyJykuUGF0aEhlbHBlclxuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoJy4uL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxudmFyIEJveENtZCwgQ2xvc2VDbWQsIEVkaXRDbWQsIEVtbWV0Q21kLCBOYW1lU3BhY2VDbWQsIFRlbXBsYXRlQ21kLCBhbGlhc0NvbW1hbmQsIGV4ZWNfcGFyZW50LCBnZXRDb21tYW5kLCBnZXRDb250ZW50LCBnZXRQYXJhbSwgaGVscCwgbGlzdENvbW1hbmQsIG5vX2V4ZWN1dGUsIHF1b3RlX2NhcnJldCwgcmVtb3ZlQ29tbWFuZCwgcmVuYW1lQ29tbWFuZCwgc2V0Q29tbWFuZCwgc3RvcmVKc29uQ29tbWFuZFxudmFyIENvcmVDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBDb3JlQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIgKGNtZHMpIHtcbiAgICB2YXIgY29yZVxuICAgIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnY29yZScpKVxuICAgIGNtZHMuYWRkRGV0ZWN0b3IobmV3IEFsd2F5c0VuYWJsZWQoJ2NvcmUnKSlcbiAgICBjb3JlLmFkZERldGVjdG9yKG5ldyBMYW5nRGV0ZWN0b3IoKSlcbiAgICByZXR1cm4gY29yZS5hZGRDbWRzKHtcbiAgICAgIGhlbHA6IHtcbiAgICAgICAgcmVwbGFjZUJveDogdHJ1ZSxcbiAgICAgICAgcmVzdWx0OiBoZWxwLFxuICAgICAgICBwYXJzZTogdHJ1ZSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ2NtZCddLFxuICAgICAgICBoZWxwOiAnVG8gZ2V0IGhlbHAgb24gYSBwZWNpZmljIGNvbW1hbmQsIGRvIDpcXG5+fmhlbHAgaGVsbG9+fiAoaGVsbG8gYmVpbmcgdGhlIGNvbW1hbmQpJyxcbiAgICAgICAgY21kczoge1xuICAgICAgICAgIG92ZXJ2aWV3OiB7XG4gICAgICAgICAgICByZXBsYWNlQm94OiB0cnVlLFxuICAgICAgICAgICAgcmVzdWx0OiAnfn5ib3h+flxcbn5+cXVvdGVfY2FycmV0fn5cXG4gIF9fXyAgICAgICAgIF8gICBfXyAgICAgIF9fXFxuIC8gX198X19fICBfX3wgfF9fXFxcXCBcXFxcICAgIC8gL18gX19fIF9fX19fX1xcbi8gL19fLyBfIFxcXFwvIF9gIC8gLV9cXFxcIFxcXFwvXFxcXC8gLyBfYCBcXFxcIFYgLyAtXy9cXG5cXFxcX19fX1xcXFxfX18vXFxcXF9fLF9cXFxcX19ffFxcXFxfL1xcXFxfL1xcXFxfXyxffFxcXFxfL1xcXFxfX198XFxuVGhlIHRleHQgZWRpdG9yIGhlbHBlclxcbn5+L3F1b3RlX2NhcnJldH5+XFxuXFxuV2hlbiB1c2luZyBDb2Rld2F2ZSB5b3Ugd2lsbCBiZSB3cml0aW5nIGNvbW1hbmRzIHdpdGhpbiBcXG55b3VyIHRleHQgZWRpdG9yLiBUaGVzZSBjb21tYW5kcyBtdXN0IGJlIHBsYWNlZCBiZXR3ZWVuIHR3byBcXG5wYWlycyBvZiBcIn5cIiAodGlsZGUpIGFuZCB0aGVuLCB0aGV5IGNhbiBiZSBleGVjdXRlZCBieSBwcmVzc2luZyBcXG5cImN0cmxcIitcInNoaWZ0XCIrXCJlXCIsIHdpdGggeW91ciBjdXJzb3IgaW5zaWRlIHRoZSBjb21tYW5kXFxuRXg6IH5+IWhlbGxvfn5cXG5cXG5Zb3UgZG9udCBuZWVkIHRvIGFjdHVhbGx5IHR5cGUgYW55IFwiflwiICh0aWxkZSkuIFxcblByZXNzaW5nIFwiY3RybFwiK1wic2hpZnRcIitcImVcIiB3aWxsIGFkZCB0aGVtIGlmIHlvdSBhcmUgbm90IGFscmVhZHlcXG53aXRoaW4gYSBjb21tYW5kLlxcblxcbkNvZGV3YXZlIGRvZXMgbm90IHVzZSBVSSB0byBkaXNwbGF5IGFueSBpbmZvcm1hdGlvbi4gXFxuSW5zdGVhZCwgaXQgdXNlcyB0ZXh0IHdpdGhpbiBjb2RlIGNvbW1lbnRzIHRvIG1pbWljIFVJcy4gXFxuVGhlIGdlbmVyYXRlZCBjb21tZW50IGJsb2NrcyB3aWxsIGJlIHJlZmVycmVkIHRvIGFzIHdpbmRvd3MgXFxuaW4gdGhlIGhlbHAgc2VjdGlvbnMuXFxuXFxuVG8gY2xvc2UgdGhpcyB3aW5kb3cgKGkuZS4gcmVtb3ZlIHRoaXMgY29tbWVudCBibG9jayksIHByZXNzIFxcblwiY3RybFwiK1wic2hpZnRcIitcImVcIiB3aXRoIHlvdXIgY3Vyc29yIG9uIHRoZSBsaW5lIGJlbGxvdy5cXG5+fiFjbG9zZXx+flxcblxcblVzZSB0aGUgZm9sbG93aW5nIGNvbW1hbmQgZm9yIGEgd2Fsa3Rocm91Z2ggb2Ygc29tZSBvZiB0aGUgbWFueVxcbmZlYXR1cmVzIG9mIENvZGV3YXZlXFxufn4haGVscDpnZXRfc3RhcnRlZH5+IG9yIH5+IWhlbHA6ZGVtb35+XFxuXFxuTGlzdCBvZiBhbGwgaGVscCBzdWJqZWN0cyBcXG5+fiFoZWxwOnN1YmplY3Rzfn4gb3Igfn4haGVscDpzdWJ+fiBcXG5cXG5+fiFjbG9zZX5+XFxufn4vYm94fn4nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdWJqZWN0czoge1xuICAgICAgICAgICAgcmVwbGFjZUJveDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3VsdDogJ35+Ym94fn5cXG5+fiFoZWxwfn5cXG5+fiFoZWxwOmdldF9zdGFydGVkfn4gKH5+IWhlbHA6ZGVtb35+KVxcbn5+IWhlbHA6c3ViamVjdHN+fiAofn4haGVscDpzdWJ+filcXG5+fiFoZWxwOmVkaXRpbmd+fiAofn4haGVscDplZGl0fn4pXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN1Yjoge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6aGVscDpzdWJqZWN0cydcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldF9zdGFydGVkOiB7XG4gICAgICAgICAgICByZXBsYWNlQm94OiB0cnVlLFxuICAgICAgICAgICAgcmVzdWx0OiAnfn5ib3h+flxcblRoZSBjbGFzc2ljIEhlbGxvIFdvcmxkLlxcbn5+IWhlbGxvfH5+XFxuXFxufn5oZWxwOmVkaXRpbmc6aW50cm9+flxcbn5+cXVvdGVfY2FycmV0fn5cXG5cXG5Gb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBjcmVhdGluZyB5b3VyIG93biBjb21tYW5kcywgc2VlOlxcbn5+IWhlbHA6ZWRpdGluZ35+XFxuXFxuQ29kZXdhdmUgY29tZXMgd2l0aCBtYW55IHByZS1leGlzdGluZyBjb21tYW5kcy4gSGVyZSBpcyBhbiBleGFtcGxlXFxub2YgSmF2YVNjcmlwdCBhYmJyZXZpYXRpb25zXFxufn4hanM6Zn5+XFxufn4hanM6aWZ+flxcbiAgfn4hanM6bG9nfn5cIn5+IWhlbGxvfn5cIn5+IS9qczpsb2d+flxcbn5+IS9qczppZn5+XFxufn4hL2pzOmZ+flxcblxcbkNvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy4gRW1tZXQgYWJicmV2aWF0aW9ucyB3aWxsIGJlIFxcbnVzZWQgYXV0b21hdGljYWxseSBpZiB5b3UgYXJlIGluIGEgSFRNTCBvciBDU1MgZmlsZS5cXG5+fiF1bD5saX5+IChpZiB5b3UgYXJlIGluIGEgaHRtbCBkb2NjdW1lbnQpXFxufn4hZW1tZXQgdWw+bGl+flxcbn5+IWVtbWV0IG0yIGNzc35+XFxuXFxuQ29tbWFuZHMgYXJlIHN0b3JlZCBpbiBuYW1lc3BhY2VzLiBUaGUgc2FtZSBjb21tYW5kIGNhbiBoYXZlIFxcbmRpZmZlcmVudCByZXN1bHRzIGRlcGVuZGluZyBvbiB0aGUgbmFtZXNwYWNlLlxcbn5+IWpzOmVhY2h+flxcbn5+IXBocDpvdXRlcjplYWNofn5cXG5+fiFwaHA6aW5uZXI6ZWFjaH5+XFxuXFxuU29tZSBvZiB0aGUgbmFtZXNwYWNlcyBhcmUgYWN0aXZlIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dC4gVGhlXFxuZm9sbG93aW5nIGNvbW1hbmRzIGFyZSB0aGUgc2FtZSBhbmQgd2lsbCBkaXNwbGF5IHRoZSBjdXJyZW50bHlcXG5hY3RpdmUgbmFtZXNwYWNlLiBUaGUgZmlyc3QgY29tbWFuZCBjb21tYW5kIHdvcmtzIGJlY2F1c2UgdGhlIFxcbmNvcmUgbmFtZXNwYWNlIGlzIGFjdGl2ZS5cXG5+fiFuYW1lc3BhY2V+flxcbn5+IWNvcmU6bmFtZXNwYWNlfn5cXG5cXG5Zb3UgY2FuIG1ha2UgYSBuYW1lc3BhY2UgYWN0aXZlIHdpdGggdGhlIGZvbGxvd2luZyBjb21tYW5kLlxcbn5+IW5hbWVzcGFjZSBwaHB+flxcblxcbkNoZWNrIHRoZSBuYW1lc3BhY2VzIGFnYWluXFxufn4hbmFtZXNwYWNlfn5cXG5cXG5JbiBhZGRpdGlvbiB0byBkZXRlY3RpbmcgdGhlIGRvY3VtZW50IHR5cGUsIENvZGV3YXZlIGNhbiBkZXRlY3QgdGhlXFxuY29udGV4dCBmcm9tIHRoZSBzdXJyb3VuZGluZyB0ZXh0LiBJbiBhIFBIUCBmaWxlLCBpdCBtZWFucyBDb2Rld2F2ZSBcXG53aWxsIGFkZCB0aGUgUEhQIHRhZ3Mgd2hlbiB5b3UgbmVlZCB0aGVtLlxcblxcbn5+L3F1b3RlX2NhcnJldH5+XFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlbW86IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmhlbHA6Z2V0X3N0YXJ0ZWQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlZGl0aW5nOiB7XG4gICAgICAgICAgICBjbWRzOiB7XG4gICAgICAgICAgICAgIGludHJvOiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiAnQ29kZXdhdmUgYWxsb3dzIHlvdSB0byBtYWtlIHlvdXIgb3duIGNvbW1hbmRzIChvciBhYmJyZXZpYXRpb25zKSBcXG5wdXQgeW91ciBjb250ZW50IGluc2lkZSBcInNvdXJjZVwiIHRoZSBkbyBcInNhdmVcIi4gVHJ5IGFkZGluZyBhbnkgXFxudGV4dCB0aGF0IGlzIG9uIHlvdXIgbWluZC5cXG5+fiFlZGl0IG15X25ld19jb21tYW5kfH5+XFxuXFxuSWYgeW91IGRpZCB0aGUgbGFzdCBzdGVwIHJpZ2h0LCB5b3Ugc2hvdWxkIHNlZSB5b3VyIHRleHQgd2hlbiB5b3VcXG5kbyB0aGUgZm9sbG93aW5nIGNvbW1hbmQuIEl0IGlzIG5vdyBzYXZlZCBhbmQgeW91IGNhbiB1c2UgaXQgXFxud2hlbmV2ZXIgeW91IHdhbnQuXFxufn4hbXlfbmV3X2NvbW1hbmR+fidcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcGxhY2VCb3g6IHRydWUsXG4gICAgICAgICAgICByZXN1bHQ6IFwifn5ib3h+flxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5cXG5BbGwgdGhlIHdpbmRvd3Mgb2YgQ29kZXdhdmUgYXJlIG1hZGUgd2l0aCB0aGUgY29tbWFuZCBcXFwiYm94XFxcIi4gXFxuVGhleSBhcmUgbWVhbnQgdG8gZGlzcGxheSB0ZXh0IHRoYXQgc2hvdWxkIG5vdCByZW1haW4gaW4geW91ciBjb2RlLiBcXG5UaGV5IGFyZSB2YWxpZCBjb21tZW50cyBzbyB0aGV5IHdvbid0IGJyZWFrIHlvdXIgY29kZSBhbmQgdGhlIGNvbW1hbmQgXFxuXFxcImNsb3NlXFxcIiBjYW4gYmUgdXNlZCB0byByZW1vdmUgdGhlbSByYXBpZGx5LiBZb3UgY2FuIG1ha2UgeW91ciBvd24gXFxuY29tbWFuZHMgd2l0aCB0aGVtIGlmIHlvdSBuZWVkIHRvIGRpc3BsYXkgc29tZSB0ZXh0IHRlbXBvcmFyaWx5Llxcbn5+IWJveH5+XFxuVGhlIGJveCB3aWxsIHNjYWxlIHdpdGggdGhlIGNvbnRlbnQgeW91IHB1dCBpbiBpdFxcbn5+IWNsb3NlfH5+XFxufn4hL2JveH5+XFxuXFxufn5xdW90ZV9jYXJyZXR+flxcbldoZW4geW91IGNyZWF0ZSBhIGNvbW1hbmQsIHlvdSBtYXkgd2FudCB0byBzcGVjaWZ5IHdoZXJlIHRoZSBjdXJzb3IgXFxud2lsbCBiZSBsb2NhdGVkIG9uY2UgdGhlIGNvbW1hbmQgaXMgZXhwYW5kZWQuIFRvIGRvIHRoYXQsIHVzZSBhIFxcXCJ8XFxcIiBcXG4oVmVydGljYWwgYmFyKS4gVXNlIDIgb2YgdGhlbSBpZiB5b3Ugd2FudCB0byBwcmludCB0aGUgYWN0dWFsIFxcbmNoYXJhY3Rlci5cXG5+fiFib3h+flxcbm9uZSA6IHwgXFxudHdvIDogfHxcXG5+fiEvYm94fn5cXG5cXG5Zb3UgY2FuIGFsc28gdXNlIHRoZSBcXFwiZXNjYXBlX3BpcGVzXFxcIiBjb21tYW5kIHRoYXQgd2lsbCBlc2NhcGUgYW55IFxcbnZlcnRpY2FsIGJhcnMgdGhhdCBhcmUgYmV0d2VlbiBpdHMgb3BlbmluZyBhbmQgY2xvc2luZyB0YWdzXFxufn4hZXNjYXBlX3BpcGVzfn5cXG58XFxufn4hL2VzY2FwZV9waXBlc35+XFxuXFxuQ29tbWFuZHMgaW5zaWRlIG90aGVyIGNvbW1hbmRzIHdpbGwgYmUgZXhwYW5kZWQgYXV0b21hdGljYWxseS5cXG5JZiB5b3Ugd2FudCB0byBwcmludCBhIGNvbW1hbmQgd2l0aG91dCBoYXZpbmcgaXQgZXhwYW5kIHdoZW4gXFxudGhlIHBhcmVudCBjb21tYW5kIGlzIGV4cGFuZGVkLCB1c2UgYSBcXFwiIVxcXCIgKGV4Y2xhbWF0aW9uIG1hcmspLlxcbn5+ISFoZWxsb35+XFxuXFxuRm9yIGNvbW1hbmRzIHRoYXQgaGF2ZSBib3RoIGFuIG9wZW5pbmcgYW5kIGEgY2xvc2luZyB0YWcsIHlvdSBjYW4gdXNlXFxudGhlIFxcXCJjb250ZW50XFxcIiBjb21tYW5kLiBcXFwiY29udGVudFxcXCIgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZXh0XFxudGhhdCBpcyBiZXR3ZWVuIHRoZSB0YWdzLiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgaG93IGl0IGNhbiBiZSB1c2VkLlxcbn5+IWVkaXQgcGhwOmlubmVyOmlmfn5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZWRpdDoge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6aGVscDplZGl0aW5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbm90X2ZvdW5kOiAnfn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG5vX2V4ZWN1dGU6IHtcbiAgICAgICAgcmVzdWx0OiBub19leGVjdXRlLFxuICAgICAgICBoZWxwOiAnUHJldmVudCBldmVyeXRoaW5nIGluc2lkZSB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIGZyb20gZXhlY3V0aW5nJ1xuICAgICAgfSxcbiAgICAgIGVzY2FwZV9waXBlczoge1xuICAgICAgICByZXN1bHQ6IHF1b3RlX2NhcnJldCxcbiAgICAgICAgY2hlY2tDYXJyZXQ6IGZhbHNlLFxuICAgICAgICBoZWxwOiAnRXNjYXBlIGFsbCBjYXJyZXRzIChmcm9tIFwifFwiIHRvIFwifHxcIiknXG4gICAgICB9LFxuICAgICAgcXVvdGVfY2FycmV0OiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmVzY2FwZV9waXBlcydcbiAgICAgIH0sXG4gICAgICBleGVjX3BhcmVudDoge1xuICAgICAgICBleGVjdXRlOiBleGVjX3BhcmVudCxcbiAgICAgICAgaGVscDogXCJFeGVjdXRlIHRoZSBmaXJzdCBjb21tYW5kIHRoYXQgd3JhcCB0aGlzIGluIGl0J3Mgb3BlbiBhbmQgY2xvc2UgdGFnXCJcbiAgICAgIH0sXG4gICAgICBjb250ZW50OiB7XG4gICAgICAgIHJlc3VsdDogZ2V0Q29udGVudCxcbiAgICAgICAgaGVscDogJ01haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gd2hhdCB3YXMgYmV0d2VlbiB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIG9mIGEgY29tbWFuZCdcbiAgICAgIH0sXG4gICAgICBib3g6IHtcbiAgICAgICAgY2xzOiBCb3hDbWQsXG4gICAgICAgIGhlbHA6IFwiQ3JlYXRlIHRoZSBhcHBhcmVuY2Ugb2YgYSBib3ggY29tcG9zZWQgZnJvbSBjaGFyYWN0ZXJzLiBcXG5Vc3VhbGx5IHdyYXBwZWQgaW4gYSBjb21tZW50LlxcblxcblRoZSBib3ggd2lsbCB0cnkgdG8gYWp1c3QgaXQncyBzaXplIGZyb20gdGhlIGNvbnRlbnRcIlxuICAgICAgfSxcbiAgICAgIGNsb3NlOiB7XG4gICAgICAgIGNsczogQ2xvc2VDbWQsXG4gICAgICAgIGhlbHA6ICdXaWxsIGNsb3NlIHRoZSBmaXJzdCBib3ggYXJvdW5kIHRoaXMnXG4gICAgICB9LFxuICAgICAgcGFyYW06IHtcbiAgICAgICAgcmVzdWx0OiBnZXRQYXJhbSxcbiAgICAgICAgaGVscDogJ01haW5seSB1c2VkIGZvciBjb21tYW5kIGVkaXRpb24sIFxcbnRoaXMgd2lsbCByZXR1cm4gYSBwYXJhbWV0ZXIgZnJvbSB0aGlzIGNvbW1hbmQgY2FsbFxcblxcbllvdSBjYW4gcGFzcyBhIG51bWJlciwgYSBzdHJpbmcsIG9yIGJvdGguIFxcbkEgbnVtYmVyIGZvciBhIHBvc2l0aW9uZWQgYXJndW1lbnQgYW5kIGEgc3RyaW5nXFxuZm9yIGEgbmFtZWQgcGFyYW1ldGVyJ1xuICAgICAgfSxcbiAgICAgIGVkaXQ6IHtcbiAgICAgICAgY21kczogRWRpdENtZC5zZXRDbWRzKHtcbiAgICAgICAgICBzYXZlOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpleGVjX3BhcmVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBjbHM6IEVkaXRDbWQsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydjbWQnXSxcbiAgICAgICAgaGVscDogJ0FsbG93cyB0byBlZGl0IGEgY29tbWFuZC4gXFxuU2VlIH5+IWhlbHA6ZWRpdGluZ35+IGZvciBhIHF1aWNrIHR1dG9yaWFsJ1xuICAgICAgfSxcbiAgICAgIHJlbmFtZToge1xuICAgICAgICBjbWRzOiB7XG4gICAgICAgICAgbm90X2FwcGxpY2FibGU6ICd+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nLFxuICAgICAgICAgIG5vdF9mb3VuZDogJ35+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdDogcmVuYW1lQ29tbWFuZCxcbiAgICAgICAgcGFyc2U6IHRydWUsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydmcm9tJywgJ3RvJ10sXG4gICAgICAgIGhlbHA6IFwiQWxsb3dzIHRvIHJlbmFtZSBhIGNvbW1hbmQgYW5kIGNoYW5nZSBpdCdzIG5hbWVzcGFjZS4gXFxuWW91IGNhbiBvbmx5IHJlbmFtZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbi0gVGhlIGZpcnN0IHBhcmFtIGlzIHRoZSBvbGQgbmFtZVxcbi0gVGhlbiBzZWNvbmQgcGFyYW0gaXMgdGhlIG5ldyBuYW1lLCBpZiBpdCBoYXMgbm8gbmFtZXNwYWNlLFxcbiAgaXQgd2lsbCB1c2UgdGhlIG9uZSBmcm9tIHRoZSBvcmlnaW5hbCBjb21tYW5kLlxcblxcbmV4Ljogfn4hcmVuYW1lIG15X2NvbW1hbmQgbXlfY29tbWFuZDJ+flwiXG4gICAgICB9LFxuICAgICAgcmVtb3ZlOiB7XG4gICAgICAgIGNtZHM6IHtcbiAgICAgICAgICBub3RfYXBwbGljYWJsZTogJ35+Ym94fn5cXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+ficsXG4gICAgICAgICAgbm90X2ZvdW5kOiAnfn5ib3h+flxcbkNvbW1hbmQgbm90IGZvdW5kXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fidcbiAgICAgICAgfSxcbiAgICAgICAgcmVzdWx0OiByZW1vdmVDb21tYW5kLFxuICAgICAgICBwYXJzZTogdHJ1ZSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ2NtZCddLFxuICAgICAgICBoZWxwOiAnQWxsb3dzIHRvIHJlbW92ZSBhIGNvbW1hbmQuIFxcbllvdSBjYW4gb25seSByZW1vdmUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi4nXG4gICAgICB9LFxuICAgICAgYWxpYXM6IHtcbiAgICAgICAgY21kczoge1xuICAgICAgICAgIG5vdF9mb3VuZDogJ35+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdDogYWxpYXNDb21tYW5kLFxuICAgICAgICBwYXJzZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIG5hbWVzcGFjZToge1xuICAgICAgICBjbHM6IE5hbWVTcGFjZUNtZCxcbiAgICAgICAgaGVscDogJ1Nob3cgdGhlIGN1cnJlbnQgbmFtZXNwYWNlcy5cXG5cXG5BIG5hbWUgc3BhY2UgY291bGQgYmUgdGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlXFxub3Igb3RoZXIga2luZCBvZiBjb250ZXh0c1xcblxcbklmIHlvdSBwYXNzIGEgcGFyYW0gdG8gdGhpcyBjb21tYW5kLCBpdCB3aWxsIFxcbmFkZCB0aGUgcGFyYW0gYXMgYSBuYW1lc3BhY2UgZm9yIHRoZSBjdXJyZW50IGVkaXRvcidcbiAgICAgIH0sXG4gICAgICBuc3BjOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOm5hbWVzcGFjZSdcbiAgICAgIH0sXG4gICAgICBsaXN0OiB7XG4gICAgICAgIHJlc3VsdDogbGlzdENvbW1hbmQsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWyduYW1lJywgJ2JveCcsICdjb250ZXh0J10sXG4gICAgICAgIHJlcGxhY2VCb3g6IHRydWUsXG4gICAgICAgIHBhcnNlOiB0cnVlLFxuICAgICAgICBoZWxwOiAnTGlzdCBhdmFpbGFibGUgY29tbWFuZHNcXG5cXG5Zb3UgY2FuIHVzZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gY2hvb3NlIGEgc3BlY2lmaWMgbmFtZXNwYWNlLCBcXG5ieSBkZWZhdWx0IGFsbCBjdXJlbnQgbmFtZXNwYWNlIHdpbGwgYmUgc2hvd24nXG4gICAgICB9LFxuICAgICAgbHM6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6bGlzdCdcbiAgICAgIH0sXG4gICAgICBnZXQ6IHtcbiAgICAgICAgcmVzdWx0OiBnZXRDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZSddLFxuICAgICAgICBoZWxwOiAnb3V0cHV0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlJ1xuICAgICAgfSxcbiAgICAgIHNldDoge1xuICAgICAgICByZXN1bHQ6IHNldENvbW1hbmQsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWyduYW1lJywgJ3ZhbHVlJywgJ3ZhbCddLFxuICAgICAgICBoZWxwOiAnc2V0IHRoZSB2YWx1ZSBvZiBhIHZhcmlhYmxlJ1xuICAgICAgfSxcbiAgICAgIHN0b3JlX2pzb246IHtcbiAgICAgICAgcmVzdWx0OiBzdG9yZUpzb25Db21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZScsICdqc29uJ10sXG4gICAgICAgIGhlbHA6ICdzZXQgYSB2YXJpYWJsZSB3aXRoIHNvbWUganNvbiBkYXRhJ1xuICAgICAgfSxcbiAgICAgIGpzb246IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6c3RvcmVfanNvbidcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZToge1xuICAgICAgICBjbHM6IFRlbXBsYXRlQ21kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZScsICdzZXAnXSxcbiAgICAgICAgaGVscDogJ3JlbmRlciBhIHRlbXBsYXRlIGZvciBhIHZhcmlhYmxlXFxuXFxuSWYgdGhlIGZpcnN0IHBhcmFtIGlzIG5vdCBzZXQgaXQgd2lsbCB1c2UgYWxsIHZhcmlhYmxlcyBcXG5mb3IgdGhlIHJlbmRlclxcbklmIHRoZSB2YXJpYWJsZSBpcyBhbiBhcnJheSB0aGUgdGVtcGxhdGUgd2lsbCBiZSByZXBlYXRlZCBcXG5mb3IgZWFjaCBpdGVtc1xcblRoZSBgc2VwYCBwYXJhbSBkZWZpbmUgd2hhdCB3aWxsIHNlcGFyYXRlIGVhY2ggaXRlbSBcXG5hbmQgZGVmYXVsdCB0byBhIGxpbmUgYnJlYWsnXG4gICAgICB9LFxuICAgICAgZW1tZXQ6IHtcbiAgICAgICAgY2xzOiBFbW1ldENtZCxcbiAgICAgICAgaGVscDogJ0NvZGVXYXZlIGNvbWVzIHdpdGggdGhlIGV4Y2VsbGVudCBFbW1ldCAoIGh0dHA6Ly9lbW1ldC5pby8gKSB0byBcXG5wcm92aWRlIGV2ZW50IG1vcmUgYWJicmV2aWF0aW9ucy5cXG5cXG5QYXNzIHRoZSBFbW1ldCBhYmJyZXZpYXRpb24gYXMgYSBwYXJhbSB0byBleHBlbmQgaXQuJ1xuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbmV4cG9ydHMuQ29yZUNvbW1hbmRQcm92aWRlciA9IENvcmVDb21tYW5kUHJvdmlkZXJcblxuaGVscCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgY21kLCBjbWROYW1lLCBoZWxwQ21kLCBzdWJjb21tYW5kcywgdGV4dFxuICBjbWROYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSlcblxuICBpZiAoY21kTmFtZSAhPSBudWxsKSB7XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQoY21kTmFtZSlcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaGVscENtZCA9IGNtZC5nZXRDbWQoJ2hlbHAnKVxuICAgICAgdGV4dCA9IGhlbHBDbWQgPyBgfn4ke2hlbHBDbWQuZnVsbE5hbWV9fn5gIDogJ1RoaXMgY29tbWFuZCBoYXMgbm8gaGVscCB0ZXh0J1xuICAgICAgc3ViY29tbWFuZHMgPSBjbWQuY21kcy5sZW5ndGggPyBgXFxuU3ViLUNvbW1hbmRzIDpcXG5+fmxzICR7Y21kLmZ1bGxOYW1lfSBib3g6bm8gY29udGV4dDpub35+YCA6ICcnXG4gICAgICByZXR1cm4gYH5+Ym94fn5cXG5IZWxwIGZvciB+fiEke2NtZC5mdWxsTmFtZX1+fiA6XFxuXFxuJHt0ZXh0fVxcbiR7c3ViY29tbWFuZHN9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICd+fm5vdF9mb3VuZH5+J1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ35+aGVscDpvdmVydmlld35+J1xuICB9XG59XG5cbm5vX2V4ZWN1dGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIHJlZ1xuICByZWcgPSBuZXcgUmVnRXhwKCdeKCcgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSlcbiAgcmV0dXJuIGluc3RhbmNlLnN0ci5yZXBsYWNlKHJlZywgJyQxJylcbn1cblxucXVvdGVfY2FycmV0ID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHJldHVybiBpbnN0YW5jZS5jb250ZW50LnJlcGxhY2UoL1xcfC9nLCAnfHwnKVxufVxuXG5leGVjX3BhcmVudCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgcmVzXG5cbiAgaWYgKGluc3RhbmNlLnBhcmVudCAhPSBudWxsKSB7XG4gICAgcmVzID0gaW5zdGFuY2UucGFyZW50LmV4ZWN1dGUoKVxuICAgIGluc3RhbmNlLnJlcGxhY2VTdGFydCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlU3RhcnRcbiAgICBpbnN0YW5jZS5yZXBsYWNlRW5kID0gaW5zdGFuY2UucGFyZW50LnJlcGxhY2VFbmRcbiAgICByZXR1cm4gcmVzXG4gIH1cbn1cblxuZ2V0Q29udGVudCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgYWZmaXhlc19lbXB0eSwgcHJlZml4LCBzdWZmaXhcbiAgYWZmaXhlc19lbXB0eSA9IGluc3RhbmNlLmdldFBhcmFtKFsnYWZmaXhlc19lbXB0eSddLCBmYWxzZSlcbiAgcHJlZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpXG4gIHN1ZmZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKVxuXG4gIGlmIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuY29udGVudCB8fCAnJykgKyBzdWZmaXhcbiAgfVxuXG4gIGlmIChhZmZpeGVzX2VtcHR5KSB7XG4gICAgcmV0dXJuIHByZWZpeCArIHN1ZmZpeFxuICB9XG59XG5cbnJlbmFtZUNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgIHZhciBzdG9yYWdlXG4gICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZVxuICAgIHJldHVybiBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICB9KS50aGVuKHNhdmVkQ21kcyA9PiB7XG4gICAgdmFyIGNtZCwgY21kRGF0YSwgbmV3TmFtZSwgb3JpZ25pbmFsTmFtZVxuICAgIG9yaWduaW5hbE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2Zyb20nXSlcbiAgICBuZXdOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd0byddKVxuXG4gICAgaWYgKG9yaWduaW5hbE5hbWUgIT0gbnVsbCAmJiBuZXdOYW1lICE9IG51bGwpIHtcbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG9yaWduaW5hbE5hbWUpXG5cbiAgICAgIGlmIChzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0gIT0gbnVsbCAmJiBjbWQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoIShuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xKSkge1xuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCAnJykgKyBuZXdOYW1lXG4gICAgICAgIH1cblxuICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG5cbiAgICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEobmV3TmFtZSwgY21kRGF0YSlcblxuICAgICAgICBjbWQudW5yZWdpc3RlcigpXG4gICAgICAgIHNhdmVkQ21kc1tuZXdOYW1lXSA9IGNtZERhdGFcbiAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcylcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuICcnXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnfn5ub3RfYXBwbGljYWJsZX5+J1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICd+fm5vdF9mb3VuZH5+J1xuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxucmVtb3ZlQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgdmFyIG5hbWVcbiAgICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdjbWQnXSlcblxuICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kcywgc3RvcmFnZVxuICAgICAgICBzdG9yYWdlID0gQ29tbWFuZC5zdG9yYWdlXG4gICAgICAgIHJldHVybiBzYXZlZENtZHMgPSBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgICAgfSkudGhlbihzYXZlZENtZHMgPT4ge1xuICAgICAgICB2YXIgY21kLCBjbWREYXRhXG4gICAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG5hbWUpXG5cbiAgICAgICAgaWYgKHNhdmVkQ21kc1tuYW1lXSAhPSBudWxsICYmIGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tuYW1lXVxuICAgICAgICAgIGNtZC51bnJlZ2lzdGVyKClcbiAgICAgICAgICBkZWxldGUgc2F2ZWRDbWRzW25hbWVdXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcylcbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gJ35+bm90X2FwcGxpY2FibGV+fidcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJ35+bm90X2ZvdW5kfn4nXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9KVxufVxuXG5hbGlhc0NvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGFsaWFzLCBjbWQsIG5hbWVcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKVxuICBhbGlhcyA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnYWxpYXMnXSlcblxuICBpZiAobmFtZSAhPSBudWxsICYmIGFsaWFzICE9IG51bGwpIHtcbiAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldENtZChuYW1lKVxuXG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQgPSBjbWQuZ2V0QWxpYXNlZCgpIHx8IGNtZCAvLyB1bmxlc3MgYWxpYXMuaW5kZXhPZignOicpID4gLTFcbiAgICAgIC8vIGFsaWFzID0gY21kLmZ1bGxOYW1lLnJlcGxhY2UobmFtZSwnJykgKyBhbGlhc1xuXG4gICAgICBDb21tYW5kLnNhdmVDbWQoYWxpYXMsIHtcbiAgICAgICAgYWxpYXNPZjogY21kLmZ1bGxOYW1lXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gJydcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICd+fm5vdF9mb3VuZH5+J1xuICAgIH1cbiAgfVxufVxuXG5saXN0Q29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgYm94LCBjb21tYW5kcywgY29udGV4dCwgbmFtZSwgbmFtZXNwYWNlcywgdGV4dCwgdXNlQ29udGV4dFxuICBib3ggPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydib3gnXSwgdHJ1ZSlcbiAgdXNlQ29udGV4dCA9IGluc3RhbmNlLmdldEJvb2xQYXJhbShbJ2NvbnRleHQnXSwgdHJ1ZSlcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKVxuICBuYW1lc3BhY2VzID0gbmFtZSA/IFtuYW1lXSA6IGluc3RhbmNlLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLmZpbHRlcihuc3BjID0+IHtcbiAgICByZXR1cm4gbnNwYyAhPT0gaW5zdGFuY2UuY21kLmZ1bGxOYW1lXG4gIH0pLmNvbmNhdCgnX3Jvb3QnKVxuICBjb250ZXh0ID0gdXNlQ29udGV4dCA/IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkgOiBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRSb290KCkuY29udGV4dFxuICBjb21tYW5kcyA9IG5hbWVzcGFjZXMucmVkdWNlKChjb21tYW5kcywgbnNwYykgPT4ge1xuICAgIHZhciBjbWRcbiAgICBjbWQgPSBuc3BjID09PSAnX3Jvb3QnID8gQ29tbWFuZC5jbWRzIDogY29udGV4dC5nZXRDbWQobnNwYywge1xuICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlXG4gICAgfSlcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kLmluaXQoKVxuXG4gICAgICBpZiAoY21kLmNtZHMpIHtcbiAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5jb25jYXQoY21kLmNtZHMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbW1hbmRzXG4gIH0sIFtdKVxuICB0ZXh0ID0gY29tbWFuZHMubGVuZ3RoID8gY29tbWFuZHMubWFwKGNtZCA9PiB7XG4gICAgY21kLmluaXQoKVxuICAgIHJldHVybiAoY21kLmlzRXhlY3V0YWJsZSgpID8gJ35+IScgOiAnfn4hbHMgJykgKyBjbWQuZnVsbE5hbWUgKyAnfn4nXG4gIH0pLmpvaW4oJ1xcbicpIDogJ1RoaXMgY29udGFpbnMgbm8gc3ViLWNvbW1hbmRzJ1xuXG4gIGlmIChib3gpIHtcbiAgICByZXR1cm4gYH5+Ym94fn5cXG4ke3RleHR9XFxuXFxufn4hY2xvc2V8fn5cXG5+fi9ib3h+fmBcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGV4dFxuICB9XG59XG5cbmdldENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHJlc1xuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pXG4gIHJlcyA9IFBhdGhIZWxwZXIuZ2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lKVxuXG4gIGlmICh0eXBlb2YgcmVzID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsICcgICcpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5cbnNldENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHAsIHZhbFxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pXG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd2YWx1ZScsICd2YWwnXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiBudWxsXG5cbiAgUGF0aEhlbHBlci5zZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIG5hbWUsIHZhbClcblxuICByZXR1cm4gJydcbn1cblxuc3RvcmVKc29uQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgbmFtZSwgcCwgdmFsXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2pzb24nXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiBudWxsXG5cbiAgUGF0aEhlbHBlci5zZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIG5hbWUsIEpTT04ucGFyc2UodmFsKSlcblxuICByZXR1cm4gJydcbn1cblxuZ2V0UGFyYW0gPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmdldFBhcmFtKGluc3RhbmNlLnBhcmFtcywgaW5zdGFuY2UuZ2V0UGFyYW0oWydkZWYnLCAnZGVmYXVsdCddKSlcbiAgfVxufVxuXG5Cb3hDbWQgPSBjbGFzcyBCb3hDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQgKCkge1xuICAgIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpXG4gICAgdGhpcy5jbWQgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnY21kJ10pXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5oZWxwZXIub3BlblRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZCArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgICAgdGhpcy5oZWxwZXIuY2xvc2VUZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZC5zcGxpdCgnICcpWzBdICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzXG4gICAgfVxuXG4gICAgdGhpcy5oZWxwZXIuZGVjbyA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZGVjb1xuICAgIHRoaXMuaGVscGVyLnBhZCA9IDJcbiAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKVxuICAgIHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpXG4gIH1cblxuICBoZWlnaHQgKCkge1xuICAgIHZhciBoZWlnaHQsIHBhcmFtc1xuXG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5ib3VuZHMoKS5oZWlnaHRcbiAgICB9IGVsc2Uge1xuICAgICAgaGVpZ2h0ID0gM1xuICAgIH1cblxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J11cblxuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgxKVxuICAgIH0gZWxzZSBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIGhlaWdodClcbiAgfVxuXG4gIHdpZHRoICgpIHtcbiAgICB2YXIgcGFyYW1zLCB3aWR0aFxuXG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgd2lkdGggPSB0aGlzLmJvdW5kcygpLndpZHRoXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpZHRoID0gM1xuICAgIH1cblxuICAgIHBhcmFtcyA9IFsnd2lkdGgnXVxuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApXG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWF4KHRoaXMubWluV2lkdGgoKSwgdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSlcbiAgfVxuXG4gIGJvdW5kcyAoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgaWYgKHRoaXMuX2JvdW5kcyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2JvdW5kcyA9IHRoaXMuaGVscGVyLnRleHRCb3VuZHModGhpcy5pbnN0YW5jZS5jb250ZW50KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fYm91bmRzXG4gICAgfVxuICB9XG5cbiAgcmVzdWx0ICgpIHtcbiAgICB0aGlzLmhlbHBlci5oZWlnaHQgPSB0aGlzLmhlaWdodCgpXG4gICAgdGhpcy5oZWxwZXIud2lkdGggPSB0aGlzLndpZHRoKClcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuZHJhdyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpXG4gIH1cblxuICBtaW5XaWR0aCAoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNtZC5sZW5ndGhcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gIH1cbn1cbkNsb3NlQ21kID0gY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQgKCkge1xuICAgIHRoaXMuaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmluc3RhbmNlLmNvbnRleHQpXG4gIH1cblxuICBleGVjdXRlICgpIHtcbiAgICB2YXIgYm94LCBib3gyLCBkZXB0aCwgcHJlZml4LCByZXF1aXJlZF9hZmZpeGVzLCBzdWZmaXhcbiAgICBwcmVmaXggPSB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKVxuICAgIHN1ZmZpeCA9IHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpXG4gICAgYm94ID0gdGhpcy5oZWxwZXIuZ2V0Qm94Rm9yUG9zKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkpXG4gICAgcmVxdWlyZWRfYWZmaXhlcyA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydyZXF1aXJlZF9hZmZpeGVzJ10sIHRydWUpXG5cbiAgICBpZiAoIXJlcXVpcmVkX2FmZml4ZXMpIHtcbiAgICAgIHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaGVscGVyLnN1ZmZpeCA9ICcnXG4gICAgICBib3gyID0gdGhpcy5oZWxwZXIuZ2V0Qm94Rm9yUG9zKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkpXG5cbiAgICAgIGlmIChib3gyICE9IG51bGwgJiYgKGJveCA9PSBudWxsIHx8IGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIHx8IGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpKSB7XG4gICAgICAgIGJveCA9IGJveDJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYm94ICE9IG51bGwpIHtcbiAgICAgIGRlcHRoID0gdGhpcy5oZWxwZXIuZ2V0TmVzdGVkTHZsKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkuc3RhcnQpXG5cbiAgICAgIGlmIChkZXB0aCA8IDIpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5pbkJveCA9IG51bGxcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LCBib3guZW5kLCAnJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLnJlcGxhY2VXaXRoKCcnKVxuICAgIH1cbiAgfVxufVxuRWRpdENtZCA9IGNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQgKCkge1xuICAgIHZhciByZWZcbiAgICB0aGlzLmNtZE5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pXG4gICAgdGhpcy52ZXJiYWxpemUgPSAocmVmID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMV0pKSA9PT0gJ3YnIHx8IHJlZiA9PT0gJ3ZlcmJhbGl6ZSdcblxuICAgIGlmICh0aGlzLmNtZE5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSlcbiAgICAgIHRoaXMuZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlXG4gICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKVxuICAgIH1cblxuICAgIHRoaXMuZWRpdGFibGUgPSB0aGlzLmNtZCAhPSBudWxsID8gdGhpcy5jbWQuaXNFZGl0YWJsZSgpIDogdHJ1ZVxuICB9XG5cbiAgcmVzdWx0ICgpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRoQ29udGVudCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhvdXRDb250ZW50KClcbiAgICB9XG4gIH1cblxuICByZXN1bHRXaXRoQ29udGVudCAoKSB7XG4gICAgdmFyIGRhdGEsIGksIGxlbiwgcCwgcGFyc2VyLCByZWZcbiAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodGhpcy5pbnN0YW5jZS5jb250ZW50KVxuICAgIHBhcnNlci5wYXJzZUFsbCgpXG4gICAgZGF0YSA9IHt9XG4gICAgcmVmID0gRWRpdENtZC5wcm9wc1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBwID0gcmVmW2ldXG4gICAgICBwLndyaXRlRm9yKHBhcnNlciwgZGF0YSlcbiAgICB9XG5cbiAgICBDb21tYW5kLnNhdmVDbWQodGhpcy5jbWROYW1lLCBkYXRhKVxuXG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBwcm9wc0Rpc3BsYXkgKCkge1xuICAgIHZhciBjbWRcbiAgICBjbWQgPSB0aGlzLmNtZFxuICAgIHJldHVybiBFZGl0Q21kLnByb3BzLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAuZGlzcGxheShjbWQpXG4gICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gcCAhPSBudWxsXG4gICAgfSkuam9pbignXFxuJylcbiAgfVxuXG4gIHJlc3VsdFdpdGhvdXRDb250ZW50ICgpIHtcbiAgICB2YXIgbmFtZSwgcGFyc2VyXG5cbiAgICBpZiAoIXRoaXMuY21kIHx8IHRoaXMuZWRpdGFibGUpIHtcbiAgICAgIG5hbWUgPSB0aGlzLmNtZCA/IHRoaXMuY21kLmZ1bGxOYW1lIDogdGhpcy5jbWROYW1lXG4gICAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQoYH5+Ym94IGNtZDpcIiR7dGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWV9ICR7bmFtZX1cIn5+XFxuJHt0aGlzLnByb3BzRGlzcGxheSgpfVxcbn5+IXNhdmV+fiB+fiFjbG9zZX5+XFxufn4vYm94fn5gKVxuICAgICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2VcblxuICAgICAgaWYgKHRoaXMudmVyYmFsaXplKSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIuZ2V0VGV4dCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuRWRpdENtZC5zZXRDbWRzID0gZnVuY3Rpb24gKGJhc2UpIHtcbiAgdmFyIGksIGluSW5zdGFuY2UsIGxlbiwgcCwgcmVmXG4gIGluSW5zdGFuY2UgPSBiYXNlLmluX2luc3RhbmNlID0ge1xuICAgIGNtZHM6IHt9XG4gIH1cbiAgcmVmID0gRWRpdENtZC5wcm9wc1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHAgPSByZWZbaV1cbiAgICBwLnNldENtZChpbkluc3RhbmNlLmNtZHMpXG4gIH0gLy8gcC5zZXRDbWQoYmFzZSlcblxuICByZXR1cm4gYmFzZVxufVxuXG5FZGl0Q21kLnByb3BzID0gW25ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19jYXJyZXQnLCB7XG4gIG9wdDogJ2NoZWNrQ2FycmV0J1xufSksIG5ldyBFZGl0Q21kUHJvcC5yZXZCb29sKCdub19wYXJzZScsIHtcbiAgb3B0OiAncGFyc2UnXG59KSwgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3ByZXZlbnRfcGFyc2VfYWxsJywge1xuICBvcHQ6ICdwcmV2ZW50UGFyc2VBbGwnXG59KSwgbmV3IEVkaXRDbWRQcm9wLmJvb2woJ3JlcGxhY2VfYm94Jywge1xuICBvcHQ6ICdyZXBsYWNlQm94J1xufSksIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoJ25hbWVfdG9fcGFyYW0nLCB7XG4gIG9wdDogJ25hbWVUb1BhcmFtJ1xufSksIG5ldyBFZGl0Q21kUHJvcC5zdHJpbmcoJ2FsaWFzX29mJywge1xuICB2YXI6ICdhbGlhc09mJyxcbiAgY2FycmV0OiB0cnVlXG59KSwgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnaGVscCcsIHtcbiAgZnVuY3Q6ICdoZWxwJyxcbiAgc2hvd0VtcHR5OiB0cnVlXG59KSwgbmV3IEVkaXRDbWRQcm9wLnNvdXJjZSgnc291cmNlJywge1xuICB2YXI6ICdyZXN1bHRTdHInLFxuICBkYXRhTmFtZTogJ3Jlc3VsdCcsXG4gIHNob3dFbXB0eTogdHJ1ZSxcbiAgY2FycmV0OiB0cnVlXG59KV1cbk5hbWVTcGFjZUNtZCA9IGNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCAoKSB7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMF0pXG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIHZhciBpLCBsZW4sIG5hbWVzcGFjZXMsIG5zcGMsIHBhcnNlciwgdHh0XG5cbiAgICBpZiAodGhpcy5uYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQuYWRkTmFtZVNwYWNlKHRoaXMubmFtZSlcbiAgICAgIHJldHVybiAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VzID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKVxuICAgICAgdHh0ID0gJ35+Ym94fn5cXG4nXG5cbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IG5hbWVzcGFjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbnNwYyA9IG5hbWVzcGFjZXNbaV1cblxuICAgICAgICBpZiAobnNwYyAhPT0gdGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWUpIHtcbiAgICAgICAgICB0eHQgKz0gbnNwYyArICdcXG4nXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdHh0ICs9ICd+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dClcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKVxuICAgIH1cbiAgfVxufVxuVGVtcGxhdGVDbWQgPSBjbGFzcyBUZW1wbGF0ZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCAoKSB7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgICB0aGlzLnNlcCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzZXAnXSwgJ1xcbicpXG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIHZhciBkYXRhXG4gICAgZGF0YSA9IHRoaXMubmFtZSA/IFBhdGhIZWxwZXIuZ2V0UGF0aCh0aGlzLmluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIHRoaXMubmFtZSkgOiB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLnZhcnNcblxuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQgJiYgZGF0YSAhPSBudWxsICYmIGRhdGEgIT09IGZhbHNlKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICByZXR1cm4gZGF0YS5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVGVtcGxhdGUoaXRlbSlcbiAgICAgICAgfSkuam9pbih0aGlzLnNlcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclRlbXBsYXRlKGRhdGEpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRlbXBsYXRlIChkYXRhKSB7XG4gICAgdmFyIHBhcnNlclxuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpXG4gICAgcGFyc2VyLnZhcnMgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge1xuICAgICAgdmFsdWU6IGRhdGFcbiAgICB9XG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2VcbiAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKClcbiAgfVxufVxuRW1tZXRDbWQgPSBjbGFzcyBFbW1ldENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCAoKSB7XG4gICAgdGhpcy5hYmJyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2FiYnInLCAnYWJicmV2aWF0aW9uJ10pXG4gICAgdGhpcy5sYW5nID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2xhbmcnLCAnbGFuZ3VhZ2UnXSlcbiAgfVxuXG4gIHJlc3VsdCAoKSB7XG4gICAgdmFyIGVtbWV0LCBleCwgcmVzXG5cbiAgICBlbW1ldCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmVmLCByZWYxXG5cbiAgICAgIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ICE9PSBudWxsID8gd2luZG93LmVtbWV0IDogbnVsbCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmVtbWV0XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgIT09IG51bGwgPyAocmVmID0gd2luZG93LnNlbGYpICE9IG51bGwgPyByZWYuZW1tZXQgOiBudWxsIDogbnVsbCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnNlbGYuZW1tZXRcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyAhPT0gbnVsbCA/IChyZWYxID0gd2luZG93Lmdsb2JhbCkgIT0gbnVsbCA/IHJlZjEuZW1tZXQgOiBudWxsIDogbnVsbCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93Lmdsb2JhbC5lbW1ldFxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVxdWlyZSAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiByZXF1aXJlKCdlbW1ldCcpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZXggPSBlcnJvclxuICAgICAgICAgIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUubG9nZ2VyLmxvZygnRW1tZXQgaXMgbm90IGF2YWlsYWJsZSwgaXQgbWF5IG5lZWQgdG8gYmUgaW5zdGFsbGVkIG1hbnVhbGx5JylcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfS5jYWxsKHRoaXMpKVxuXG4gICAgaWYgKGVtbWV0ICE9IG51bGwpIHtcbiAgICAgIC8vIGVtbWV0LnJlcXVpcmUoJy4vcGFyc2VyL2FiYnJldmlhdGlvbicpLmV4cGFuZCgndWw+bGknLCB7cGFzdGVkQ29udGVudDonbG9yZW0nfSlcbiAgICAgIHJlcyA9IGVtbWV0LmV4cGFuZEFiYnJldmlhdGlvbih0aGlzLmFiYnIsIHRoaXMubGFuZylcbiAgICAgIHJldHVybiByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpXG4gICAgfVxuICB9XG59XG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBCb3hIZWxwZXIgPSByZXF1aXJlKCcuLi9Cb3hIZWxwZXInKS5Cb3hIZWxwZXJcblxuY29uc3QgRWRpdENtZFByb3AgPSByZXF1aXJlKCcuLi9FZGl0Q21kUHJvcCcpLkVkaXRDbWRQcm9wXG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IFBhdGhIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL1BhdGhIZWxwZXInKS5QYXRoSGVscGVyXG5cbmNvbnN0IFJlcGxhY2VtZW50ID0gcmVxdWlyZSgnLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnKS5SZXBsYWNlbWVudFxuXG52YXIgZGVsZXRlQ29tbWFuZCwgcmVhZENvbW1hbmQsIHdyaXRlQ29tbWFuZFxudmFyIEZpbGVDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBGaWxlQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIgKGNtZHMpIHtcbiAgICB2YXIgY29yZVxuICAgIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnZmlsZScpKVxuICAgIHJldHVybiBjb3JlLmFkZENtZHMoe1xuICAgICAgcmVhZDoge1xuICAgICAgICByZXN1bHQ6IHJlYWRDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnZmlsZSddLFxuICAgICAgICBoZWxwOiAncmVhZCB0aGUgY29udGVudCBvZiBhIGZpbGUnXG4gICAgICB9LFxuICAgICAgd3JpdGU6IHtcbiAgICAgICAgcmVzdWx0OiB3cml0ZUNvbW1hbmQsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydmaWxlJywgJ2NvbnRlbnQnXSxcbiAgICAgICAgaGVscDogJ3NhdmUgaW50byBhIGZpbGUnXG4gICAgICB9LFxuICAgICAgZGVsZXRlOiB7XG4gICAgICAgIHJlc3VsdDogZGVsZXRlQ29tbWFuZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ2ZpbGUnXSxcbiAgICAgICAgaGVscDogJ2RlbGV0ZSBhIGZpbGUnXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5GaWxlQ29tbWFuZFByb3ZpZGVyID0gRmlsZUNvbW1hbmRQcm92aWRlclxuXG5yZWFkQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgZmlsZSwgZmlsZVN5c3RlbVxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2ZpbGUnXSlcblxuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLnJlYWRGaWxlKGZpbGUpXG4gIH1cbn1cblxud3JpdGVDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBjb250ZW50LCBmaWxlLCBmaWxlU3lzdGVtXG4gIGZpbGVTeXN0ZW0gPSBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRGaWxlU3lzdGVtKClcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKVxuICBjb250ZW50ID0gaW5zdGFuY2UuY29udGVudCB8fCBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2NvbnRlbnQnXSlcblxuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLndyaXRlRmlsZShmaWxlLCBjb250ZW50KVxuICB9XG59XG5cbmRlbGV0ZUNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGZpbGUsIGZpbGVTeXN0ZW1cbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKVxuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pXG5cbiAgaWYgKGZpbGVTeXN0ZW0pIHtcbiAgICByZXR1cm4gZmlsZVN5c3RlbS5kZWxldGVGaWxlKGZpbGUpXG4gIH1cbn1cbiIsIlxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5Db21tYW5kXG5cbnZhciBIdG1sQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSHRtbENvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChjbWRzKSB7XG4gICAgdmFyIGNzcywgaHRtbFxuICAgIGh0bWwgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnaHRtbCcpKVxuICAgIGh0bWwuYWRkQ21kcyh7XG4gICAgICBmYWxsYmFjazoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTplbW1ldCcsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgbGFuZzogJ2h0bWwnXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWVUb1BhcmFtOiAnYWJicidcbiAgICAgIH1cbiAgICB9KVxuICAgIGNzcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjc3MnKSlcbiAgICByZXR1cm4gY3NzLmFkZENtZHMoe1xuICAgICAgZmFsbGJhY2s6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGxhbmc6ICdjc3MnXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWVUb1BhcmFtOiAnYWJicidcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5leHBvcnRzLkh0bWxDb21tYW5kUHJvdmlkZXIgPSBIdG1sQ29tbWFuZFByb3ZpZGVyXG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuXG52YXIgSnNDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBKc0NvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChjbWRzKSB7XG4gICAgdmFyIGpzXG4gICAganMgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnanMnKSlcbiAgICBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnamF2YXNjcmlwdCcsIHtcbiAgICAgIGFsaWFzT2Y6ICdqcydcbiAgICB9KSlcbiAgICByZXR1cm4ganMuYWRkQ21kcyh7XG4gICAgICBjb21tZW50OiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgaWY6ICdpZih8KXtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgbG9nOiAnaWYod2luZG93LmNvbnNvbGUpe1xcblxcdGNvbnNvbGUubG9nKH5+Y29udGVudH5+fClcXG59JyxcbiAgICAgIGZ1bmN0aW9uOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgZnVuY3Q6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgIGY6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgIGZvcjogJ2ZvciAodmFyIGkgPSAwOyBpIDwgfDsgaSsrKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgIGZvcmluOiAnZm9yICh2YXIgdmFsIGluIHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgZWFjaDoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgZm9yZWFjaDoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgd2hpbGU6ICd3aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgIHdoaWxlaTogJ3ZhciBpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG5cXHRpKys7XFxufScsXG4gICAgICBpZmVsc2U6ICdpZiggfCApIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgICBpZmU6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmlmZWxzZSdcbiAgICAgIH0sXG4gICAgICBzd2l0Y2g6ICdzd2l0Y2goIHwgKSB7IFxcblxcdGNhc2UgOlxcblxcdFxcdH5+Y29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufSdcbiAgICB9KVxuICB9XG59XG5leHBvcnRzLkpzQ29tbWFuZFByb3ZpZGVyID0gSnNDb21tYW5kUHJvdmlkZXJcbiIsIlxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInKS5TdHJpbmdIZWxwZXJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5Db21tYW5kXG5cbmNvbnN0IFBhaXJEZXRlY3RvciA9IHJlcXVpcmUoJy4uL2RldGVjdG9ycy9QYWlyRGV0ZWN0b3InKS5QYWlyRGV0ZWN0b3JcblxudmFyIHdyYXBXaXRoUGhwXG52YXIgUGhwQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIgKGNtZHMpIHtcbiAgICB2YXIgcGhwLCBwaHBJbm5lciwgcGhwT3V0ZXJcbiAgICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpXG4gICAgcGhwLmFkZERldGVjdG9yKG5ldyBQYWlyRGV0ZWN0b3Ioe1xuICAgICAgcmVzdWx0OiAncGhwOmlubmVyJyxcbiAgICAgIG9wZW5lcjogJzw/cGhwJyxcbiAgICAgIGNsb3NlcjogJz8+JyxcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IHRydWUsXG4gICAgICBlbHNlOiAncGhwOm91dGVyJ1xuICAgIH0pKVxuICAgIHBocE91dGVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnb3V0ZXInKSlcbiAgICBwaHBPdXRlci5hZGRDbWRzKHtcbiAgICAgIGZhbGxiYWNrOiB7XG4gICAgICAgIGNtZHM6IHtcbiAgICAgICAgICBhbnlfY29udGVudDoge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcsXG4gICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICBwcmVmaXg6ICcgPz5cXG4nLFxuICAgICAgICAgICAgICBzdWZmaXg6ICdcXG48P3BocCAnLFxuICAgICAgICAgICAgICBhZmZpeGVzX2VtcHR5OiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOiVuYW1lJScsXG4gICAgICAgIGFsdGVyUmVzdWx0OiB3cmFwV2l0aFBocFxuICAgICAgfSxcbiAgICAgIGJveDoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpib3gnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbW1lbnQ6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+J1xuICAgIH0pXG4gICAgcGhwSW5uZXIgPSBwaHAuYWRkQ21kKG5ldyBDb21tYW5kKCdpbm5lcicpKVxuICAgIHJldHVybiBwaHBJbm5lci5hZGRDbWRzKHtcbiAgICAgIGFueV9jb250ZW50OiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnXG4gICAgICB9LFxuICAgICAgY29tbWVudDogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgIGlmOiAnaWYofCl7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICBpbmZvOiAncGhwaW5mbygpOycsXG4gICAgICBlY2hvOiAnZWNobyB8JyxcbiAgICAgIGU6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjplY2hvJ1xuICAgICAgfSxcbiAgICAgIGNsYXNzOiB7XG4gICAgICAgIHJlc3VsdDogJ2NsYXNzIH5+cGFyYW0gMCBjbGFzcyBkZWY6fH5+IHtcXG5cXHRmdW5jdGlvbiBfX2NvbnN0cnVjdCgpIHtcXG5cXHRcXHR+fmNvbnRlbnR+fnxcXG5cXHR9XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmNsYXNzJ1xuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uOiB7XG4gICAgICAgIHJlc3VsdDogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmdW5jdDoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgIGY6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICBhcnJheTogJyR8ID0gYXJyYXkoKTsnLFxuICAgICAgYTogJ2FycmF5KCknLFxuICAgICAgZm9yOiAnZm9yICgkaSA9IDA7ICRpIDwgJHw7ICRpKyspIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgIGZvcmVhY2g6ICdmb3JlYWNoICgkfCBhcyAka2V5ID0+ICR2YWwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgIGVhY2g6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmb3JlYWNoJ1xuICAgICAgfSxcbiAgICAgIHdoaWxlOiAnd2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgd2hpbGVpOiB7XG4gICAgICAgIHJlc3VsdDogJyRpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxuXFx0JGkrKztcXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBpZmVsc2U6ICdpZiggfCApIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgaWZlOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6aWZlbHNlJ1xuICAgICAgfSxcbiAgICAgIHN3aXRjaDoge1xuICAgICAgICByZXN1bHQ6ICdzd2l0Y2goIHwgKSB7IFxcblxcdGNhc2UgOlxcblxcdFxcdH5+YW55X2NvbnRlbnR+flxcblxcdFxcdGJyZWFrO1xcblxcdGRlZmF1bHQgOlxcblxcdFxcdFxcblxcdFxcdGJyZWFrO1xcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNsb3NlOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNsb3NlJyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nLFxuICAgICAgICAgIHJlcXVpcmVkX2FmZml4ZXM6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5leHBvcnRzLlBocENvbW1hbmRQcm92aWRlciA9IFBocENvbW1hbmRQcm92aWRlclxuXG53cmFwV2l0aFBocCA9IGZ1bmN0aW9uIChyZXN1bHQsIGluc3RhbmNlKSB7XG4gIHZhciBpbmxpbmUsIHJlZ0Nsb3NlLCByZWdPcGVuXG4gIGlubGluZSA9IGluc3RhbmNlLmdldFBhcmFtKFsncGhwX2lubGluZScsICdpbmxpbmUnXSwgdHJ1ZSlcblxuICBpZiAoaW5saW5lKSB7XG4gICAgcmVnT3BlbiA9IC88XFw/cGhwXFxzKFtcXFxcblxcXFxyXFxzXSspL2dcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZ1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/PidcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJzw/cGhwXFxuJyArIFN0cmluZ0hlbHBlci5pbmRlbnQocmVzdWx0KSArICdcXG4/PidcbiAgfVxufSAvLyBjbG9zZVBocEZvckNvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4vLyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICdcbiIsIlxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5Db21tYW5kXG5cbmNvbnN0IEFsd2F5c0VuYWJsZWQgPSByZXF1aXJlKCcuLi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZCcpLkFsd2F5c0VuYWJsZWRcblxudmFyIGluZmxlY3Rpb24gPSBpbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoJ2luZmxlY3Rpb24nKSlcblxuZnVuY3Rpb24gaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCAob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iaiB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKSB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldIH0gfSB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmogfSB9XG5cbnZhciBTdHJpbmdDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBTdHJpbmdDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlciAocm9vdCkge1xuICAgIHZhciBjbWRzXG4gICAgY21kcyA9IHJvb3QuYWRkQ21kKG5ldyBDb21tYW5kKCdzdHJpbmcnKSlcbiAgICByb290LmFkZENtZChuZXcgQ29tbWFuZCgnc3RyJywge1xuICAgICAgYWxpYXNPZjogJ3N0cmluZydcbiAgICB9KSlcbiAgICByb290LmFkZERldGVjdG9yKG5ldyBBbHdheXNFbmFibGVkKCdzdHJpbmcnKSlcbiAgICByZXR1cm4gY21kcy5hZGRDbWRzKHtcbiAgICAgIHBsdXJhbGl6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnBsdXJhbGl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0ciddLFxuICAgICAgICBoZWxwOiAnUGx1cmFsaXplIGEgc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHNpbmd1bGFyaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uc2luZ3VsYXJpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1Npbmd1bGFyaXplIGEgc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGNhbWVsaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2FtZWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSksICFpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsICdmaXJzdCddLCB0cnVlKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0cicsICdmaXJzdCddLFxuICAgICAgICBoZWxwOiAnVHJhbnNmb3JtcyBhIFN0cmluZyBmcm9tIHVuZGVyc2NvcmUgdG8gY2FtZWxjYXNlJ1xuICAgICAgfSxcbiAgICAgIHVuZGVyc2NvcmU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi51bmRlcnNjb3JlKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pLCBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsICd1cHBlciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0cicsICd1cHBlciddLFxuICAgICAgICBoZWxwOiAnVHJhbnNmb3JtcyBhIFN0cmluZyBmcm9tIGNhbWVsY2FzZSB0byB1bmRlcnNjb3JlLidcbiAgICAgIH0sXG4gICAgICBodW1hbml6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmh1bWFuaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pLCBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsICdmaXJzdCddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0cicsICdmaXJzdCddLFxuICAgICAgICBoZWxwOiAnVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIGh1bWFuIHJlYWRhYmxlIGZvcm1hdCdcbiAgICAgIH0sXG4gICAgICBjYXBpdGFsaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2FwaXRhbGl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0ciddLFxuICAgICAgICBoZWxwOiAnTWFrZSB0aGUgZmlyc3QgbGV0dGVyIG9mIGEgc3RyaW5nIHVwcGVyJ1xuICAgICAgfSxcbiAgICAgIGRhc2hlcml6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmRhc2hlcml6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0ciddLFxuICAgICAgICBoZWxwOiAnUmVwbGFjZXMgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMgaW4gYSBzdHJpbmcuJ1xuICAgICAgfSxcbiAgICAgIHRpdGxlaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24udGl0bGVpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSBodW1hbiByZWFkYWJsZSBmb3JtYXQgd2l0aCBtb3N0IHdvcmRzIGNhcGl0YWxpemVkJ1xuICAgICAgfSxcbiAgICAgIHRhYmxlaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24udGFibGVpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSB0YWJsZSBmb3JtYXQnXG4gICAgICB9LFxuICAgICAgY2xhc3NpZnk6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5jbGFzc2lmeShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0ciddLFxuICAgICAgICBoZWxwOiAnVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIGNsYXNzIGZvcm1hdCdcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5leHBvcnRzLlN0cmluZ0NvbW1hbmRQcm92aWRlciA9IFN0cmluZ0NvbW1hbmRQcm92aWRlclxuIiwiXG5jb25zdCBEZXRlY3RvciA9IHJlcXVpcmUoJy4vRGV0ZWN0b3InKS5EZXRlY3RvclxuXG52YXIgQWx3YXlzRW5hYmxlZCA9IGNsYXNzIEFsd2F5c0VuYWJsZWQgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yIChuYW1lc3BhY2UpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5uYW1lc3BhY2UgPSBuYW1lc3BhY2VcbiAgfVxuXG4gIGRldGVjdCAoZmluZGVyKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlXG4gIH1cbn1cbmV4cG9ydHMuQWx3YXlzRW5hYmxlZCA9IEFsd2F5c0VuYWJsZWRcbiIsIlxudmFyIERldGVjdG9yID0gY2xhc3MgRGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvciAoZGF0YSA9IHt9KSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YVxuICB9XG5cbiAgZGV0ZWN0IChmaW5kZXIpIHtcbiAgICBpZiAodGhpcy5kZXRlY3RlZChmaW5kZXIpKSB7XG4gICAgICBpZiAodGhpcy5kYXRhLnJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucmVzdWx0XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuZWxzZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuZWxzZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRldGVjdGVkIChmaW5kZXIpIHt9XG59XG5leHBvcnRzLkRldGVjdG9yID0gRGV0ZWN0b3JcbiIsIlxuY29uc3QgRGV0ZWN0b3IgPSByZXF1aXJlKCcuL0RldGVjdG9yJykuRGV0ZWN0b3JcblxudmFyIExhbmdEZXRlY3RvciA9IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0IChmaW5kZXIpIHtcbiAgICB2YXIgbGFuZ1xuXG4gICAgaWYgKGZpbmRlci5jb2Rld2F2ZSAhPSBudWxsKSB7XG4gICAgICBsYW5nID0gZmluZGVyLmNvZGV3YXZlLmVkaXRvci5nZXRMYW5nKClcblxuICAgICAgaWYgKGxhbmcgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5leHBvcnRzLkxhbmdEZXRlY3RvciA9IExhbmdEZXRlY3RvclxuIiwiXG5jb25zdCBQYWlyID0gcmVxdWlyZSgnLi4vcG9zaXRpb25pbmcvUGFpcicpLlBhaXJcblxuY29uc3QgRGV0ZWN0b3IgPSByZXF1aXJlKCcuL0RldGVjdG9yJykuRGV0ZWN0b3JcblxudmFyIFBhaXJEZXRlY3RvciA9IGNsYXNzIFBhaXJEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0ZWQgKGZpbmRlcikge1xuICAgIHZhciBwYWlyXG5cbiAgICBpZiAodGhpcy5kYXRhLm9wZW5lciAhPSBudWxsICYmIHRoaXMuZGF0YS5jbG9zZXIgIT0gbnVsbCAmJiBmaW5kZXIuaW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgcGFpciA9IG5ldyBQYWlyKHRoaXMuZGF0YS5vcGVuZXIsIHRoaXMuZGF0YS5jbG9zZXIsIHRoaXMuZGF0YSlcblxuICAgICAgaWYgKHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5leHBvcnRzLlBhaXJEZXRlY3RvciA9IFBhaXJEZXRlY3RvclxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGJvb3RzdHJhcCA9IHJlcXVpcmUoJy4vYm9vdHN0cmFwJylcblxuY29uc3QgVGV4dEFyZWFFZGl0b3IgPSByZXF1aXJlKCcuL1RleHRBcmVhRWRpdG9yJylcblxuYm9vdHN0cmFwLkNvZGV3YXZlLmRldGVjdCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgdmFyIGN3XG4gIGN3ID0gbmV3IGJvb3RzdHJhcC5Db2Rld2F2ZShuZXcgVGV4dEFyZWFFZGl0b3IuVGV4dEFyZWFFZGl0b3IodGFyZ2V0KSlcblxuICBib290c3RyYXAuQ29kZXdhdmUuaW5zdGFuY2VzLnB1c2goY3cpXG5cbiAgcmV0dXJuIGN3XG59XG5cbmJvb3RzdHJhcC5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZVxud2luZG93LkNvZGV3YXZlID0gYm9vdHN0cmFwLkNvZGV3YXZlXG4iLCJcbnZhciBBcnJheUhlbHBlciA9IGNsYXNzIEFycmF5SGVscGVyIHtcbiAgc3RhdGljIGlzQXJyYXkgKGFycikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9XG5cbiAgc3RhdGljIHVuaW9uIChhMSwgYTIpIHtcbiAgICByZXR1cm4gdGhpcy51bmlxdWUoYTEuY29uY2F0KGEyKSlcbiAgfVxuXG4gIHN0YXRpYyB1bmlxdWUgKGFycmF5KSB7XG4gICAgdmFyIGEsIGksIGpcbiAgICBhID0gYXJyYXkuY29uY2F0KClcbiAgICBpID0gMFxuXG4gICAgd2hpbGUgKGkgPCBhLmxlbmd0aCkge1xuICAgICAgaiA9IGkgKyAxXG5cbiAgICAgIHdoaWxlIChqIDwgYS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGFbaV0gPT09IGFbal0pIHtcbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpXG4gICAgICAgIH1cblxuICAgICAgICArK2pcbiAgICAgIH1cblxuICAgICAgKytpXG4gICAgfVxuXG4gICAgcmV0dXJuIGFcbiAgfVxufVxuZXhwb3J0cy5BcnJheUhlbHBlciA9IEFycmF5SGVscGVyXG4iLCJcbnZhciBDb21tb25IZWxwZXIgPSBjbGFzcyBDb21tb25IZWxwZXIge1xuICBzdGF0aWMgbWVyZ2UgKC4uLnhzKSB7XG4gICAgaWYgKCh4cyAhPSBudWxsID8geHMubGVuZ3RoIDogbnVsbCkgPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy50YXAoe30sIGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHZhciBpLCBrLCBsZW4sIHJlc3VsdHMsIHYsIHhcbiAgICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0geHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB4ID0geHNbaV1cbiAgICAgICAgICByZXN1bHRzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMxXG4gICAgICAgICAgICByZXN1bHRzMSA9IFtdXG5cbiAgICAgICAgICAgIGZvciAoayBpbiB4KSB7XG4gICAgICAgICAgICAgIHYgPSB4W2tdXG4gICAgICAgICAgICAgIHJlc3VsdHMxLnB1c2gobVtrXSA9IHYpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzMVxuICAgICAgICAgIH0oKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB0YXAgKG8sIGZuKSB7XG4gICAgZm4obylcbiAgICByZXR1cm4gb1xuICB9XG5cbiAgc3RhdGljIGFwcGx5TWl4aW5zIChkZXJpdmVkQ3RvciwgYmFzZUN0b3JzKSB7XG4gICAgcmV0dXJuIGJhc2VDdG9ycy5mb3JFYWNoKGJhc2VDdG9yID0+IHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVyaXZlZEN0b3IsIG5hbWUsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZUN0b3IucHJvdG90eXBlLCBuYW1lKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5Db21tb25IZWxwZXIgPSBDb21tb25IZWxwZXJcbiIsIlxudmFyIE5hbWVzcGFjZUhlbHBlciA9IGNsYXNzIE5hbWVzcGFjZUhlbHBlciB7XG4gIHN0YXRpYyBzcGxpdEZpcnN0IChmdWxsbmFtZSwgaXNTcGFjZSA9IGZhbHNlKSB7XG4gICAgdmFyIHBhcnRzXG5cbiAgICBpZiAoZnVsbG5hbWUuaW5kZXhPZignOicpID09PSAtMSAmJiAhaXNTcGFjZSkge1xuICAgICAgcmV0dXJuIFtudWxsLCBmdWxsbmFtZV1cbiAgICB9XG5cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6JylcbiAgICByZXR1cm4gW3BhcnRzLnNoaWZ0KCksIHBhcnRzLmpvaW4oJzonKSB8fCBudWxsXVxuICB9XG5cbiAgc3RhdGljIHNwbGl0IChmdWxsbmFtZSkge1xuICAgIHZhciBuYW1lLCBwYXJ0c1xuXG4gICAgaWYgKGZ1bGxuYW1lLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBbbnVsbCwgZnVsbG5hbWVdXG4gICAgfVxuXG4gICAgcGFydHMgPSBmdWxsbmFtZS5zcGxpdCgnOicpXG4gICAgbmFtZSA9IHBhcnRzLnBvcCgpXG4gICAgcmV0dXJuIFtwYXJ0cy5qb2luKCc6JyksIG5hbWVdXG4gIH1cbn1cbmV4cG9ydHMuTmFtZXNwYWNlSGVscGVyID0gTmFtZXNwYWNlSGVscGVyXG4iLCJcbnZhciBPcHRpb25hbFByb21pc2UgPSBjbGFzcyBPcHRpb25hbFByb21pc2Uge1xuICBjb25zdHJ1Y3RvciAodmFsMSkge1xuICAgIHRoaXMudmFsID0gdmFsMVxuXG4gICAgaWYgKHRoaXMudmFsICE9IG51bGwgJiYgdGhpcy52YWwudGhlbiAhPSBudWxsICYmIHRoaXMudmFsLnJlc3VsdCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnZhbCA9IHRoaXMudmFsLnJlc3VsdCgpXG4gICAgfVxuICB9XG5cbiAgdGhlbiAoY2IpIHtcbiAgICBpZiAodGhpcy52YWwgIT0gbnVsbCAmJiB0aGlzLnZhbC50aGVuICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKHRoaXMudmFsLnRoZW4oY2IpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZShjYih0aGlzLnZhbCkpXG4gICAgfVxuICB9XG5cbiAgcmVzdWx0ICgpIHtcbiAgICByZXR1cm4gdGhpcy52YWxcbiAgfVxufVxuZXhwb3J0cy5PcHRpb25hbFByb21pc2UgPSBPcHRpb25hbFByb21pc2VcblxudmFyIG9wdGlvbmFsUHJvbWlzZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodmFsKVxufVxuXG5leHBvcnRzLm9wdGlvbmFsUHJvbWlzZSA9IG9wdGlvbmFsUHJvbWlzZVxuIiwiXG52YXIgUGF0aEhlbHBlciA9IGNsYXNzIFBhdGhIZWxwZXIge1xuICBzdGF0aWMgZ2V0UGF0aCAob2JqLCBwYXRoLCBzZXAgPSAnLicpIHtcbiAgICB2YXIgY3VyLCBwYXJ0c1xuICAgIHBhcnRzID0gcGF0aC5zcGxpdChzZXApXG4gICAgY3VyID0gb2JqXG4gICAgcGFydHMuZmluZChwYXJ0ID0+IHtcbiAgICAgIGN1ciA9IGN1cltwYXJ0XVxuICAgICAgcmV0dXJuIHR5cGVvZiBjdXIgPT09ICd1bmRlZmluZWQnXG4gICAgfSlcbiAgICByZXR1cm4gY3VyXG4gIH1cblxuICBzdGF0aWMgc2V0UGF0aCAob2JqLCBwYXRoLCB2YWwsIHNlcCA9ICcuJykge1xuICAgIHZhciBsYXN0LCBwYXJ0c1xuICAgIHBhcnRzID0gcGF0aC5zcGxpdChzZXApXG4gICAgbGFzdCA9IHBhcnRzLnBvcCgpXG4gICAgcmV0dXJuIHBhcnRzLnJlZHVjZSgoY3VyLCBwYXJ0KSA9PiB7XG4gICAgICBpZiAoY3VyW3BhcnRdICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGN1cltwYXJ0XVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGN1cltwYXJ0XSA9IHt9XG4gICAgICB9XG4gICAgfSwgb2JqKVtsYXN0XSA9IHZhbFxuICB9XG59XG5leHBvcnRzLlBhdGhIZWxwZXIgPSBQYXRoSGVscGVyXG4iLCJcbmNvbnN0IFNpemUgPSByZXF1aXJlKCcuLi9wb3NpdGlvbmluZy9TaXplJykuU2l6ZVxuXG52YXIgU3RyaW5nSGVscGVyID0gY2xhc3MgU3RyaW5nSGVscGVyIHtcbiAgc3RhdGljIHRyaW1FbXB0eUxpbmUgKHR4dCkge1xuICAgIHJldHVybiB0eHQucmVwbGFjZSgvXlxccypcXHI/XFxuLywgJycpLnJlcGxhY2UoL1xccj9cXG5cXHMqJC8sICcnKVxuICB9XG5cbiAgc3RhdGljIGVzY2FwZVJlZ0V4cCAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgJ1xcXFwkJicpXG4gIH1cblxuICBzdGF0aWMgcmVwZWF0VG9MZW5ndGggKHR4dCwgbGVuZ3RoKSB7XG4gICAgaWYgKGxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG5cbiAgICByZXR1cm4gQXJyYXkoTWF0aC5jZWlsKGxlbmd0aCAvIHR4dC5sZW5ndGgpICsgMSkuam9pbih0eHQpLnN1YnN0cmluZygwLCBsZW5ndGgpXG4gIH1cblxuICBzdGF0aWMgcmVwZWF0ICh0eHQsIG5iKSB7XG4gICAgcmV0dXJuIEFycmF5KG5iICsgMSkuam9pbih0eHQpXG4gIH1cblxuICBzdGF0aWMgZ2V0VHh0U2l6ZSAodHh0KSB7XG4gICAgdmFyIGosIGwsIGxlbiwgbGluZXMsIHdcbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KCdcXG4nKVxuICAgIHcgPSAwXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbCA9IGxpbmVzW2pdXG4gICAgICB3ID0gTWF0aC5tYXgodywgbC5sZW5ndGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTaXplKHcsIGxpbmVzLmxlbmd0aCAtIDEpXG4gIH1cblxuICBzdGF0aWMgaW5kZW50Tm90Rmlyc3QgKHRleHQsIG5iID0gMSwgc3BhY2VzID0gJyAgJykge1xuICAgIHZhciByZWdcblxuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IC9cXG4vZ1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsICdcXG4nICsgdGhpcy5yZXBlYXQoc3BhY2VzLCBuYikpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGluZGVudCAodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNwYWNlcyArIHRoaXMuaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIsIHNwYWNlcylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHRcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcmV2ZXJzZVN0ciAodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5zcGxpdCgnJykucmV2ZXJzZSgpLmpvaW4oJycpXG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlQ2FycmV0ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcmVDYXJyZXQsIHJlUXVvdGVkLCByZVRtcCwgdG1wXG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSdcbiAgICByZUNhcnJldCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciksICdnJylcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciArIGNhcnJldENoYXIpLCAnZycpXG4gICAgcmVUbXAgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKHRtcCksICdnJylcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UocmVRdW90ZWQsIHRtcCkucmVwbGFjZShyZUNhcnJldCwgJycpLnJlcGxhY2UocmVUbXAsIGNhcnJldENoYXIpXG4gIH1cblxuICBzdGF0aWMgZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQgKHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciBwb3NcbiAgICBwb3MgPSB0aGlzLmdldENhcnJldFBvcyh0eHQsIGNhcnJldENoYXIpXG5cbiAgICBpZiAocG9zICE9IG51bGwpIHtcbiAgICAgIHR4dCA9IHR4dC5zdWJzdHIoMCwgcG9zKSArIHR4dC5zdWJzdHIocG9zICsgY2FycmV0Q2hhci5sZW5ndGgpXG4gICAgICByZXR1cm4gW3BvcywgdHh0XVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXRDYXJyZXRQb3MgKHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciBpLCByZVF1b3RlZFxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksICdnJylcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKVxuXG4gICAgaWYgKChpID0gdHh0LmluZGV4T2YoY2FycmV0Q2hhcikpID4gLTEpIHtcbiAgICAgIHJldHVybiBpXG4gICAgfVxuICB9XG59XG5leHBvcnRzLlN0cmluZ0hlbHBlciA9IFN0cmluZ0hlbHBlclxuIiwiXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL1BvcycpLlBvc1xuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBQYWlyTWF0Y2ggPSByZXF1aXJlKCcuL1BhaXJNYXRjaCcpLlBhaXJNYXRjaFxuXG52YXIgUGFpciA9IGNsYXNzIFBhaXIge1xuICBjb25zdHJ1Y3RvciAob3BlbmVyLCBjbG9zZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWxcbiAgICB0aGlzLm9wZW5lciA9IG9wZW5lclxuICAgIHRoaXMuY2xvc2VyID0gY2xvc2VyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2UsXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV1cblxuICAgICAgaWYgKGtleSBpbiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5vcHRpb25zW2tleV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5lclJlZyAoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wZW5lciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5vcGVuZXIpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuZXJcbiAgICB9XG4gIH1cblxuICBjbG9zZXJSZWcgKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jbG9zZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY2xvc2VyKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2VyXG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0cyAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW5lcjogdGhpcy5vcGVuZXJSZWcoKSxcbiAgICAgIGNsb3NlcjogdGhpcy5jbG9zZXJSZWcoKVxuICAgIH1cbiAgfVxuXG4gIG1hdGNoQW55UGFydEtleXMgKCkge1xuICAgIHZhciBrZXksIGtleXMsIHJlZiwgcmVnXG4gICAga2V5cyA9IFtdXG4gICAgcmVmID0gdGhpcy5tYXRjaEFueVBhcnRzKClcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgcmVnID0gcmVmW2tleV1cbiAgICAgIGtleXMucHVzaChrZXkpXG4gICAgfVxuXG4gICAgcmV0dXJuIGtleXNcbiAgfVxuXG4gIG1hdGNoQW55UmVnICgpIHtcbiAgICB2YXIgZ3JvdXBzLCBrZXksIHJlZiwgcmVnXG4gICAgZ3JvdXBzID0gW11cbiAgICByZWYgPSB0aGlzLm1hdGNoQW55UGFydHMoKVxuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XVxuICAgICAgZ3JvdXBzLnB1c2goJygnICsgcmVnLnNvdXJjZSArICcpJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChncm91cHMuam9pbignfCcpKVxuICB9XG5cbiAgbWF0Y2hBbnkgKHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2hcblxuICAgIHdoaWxlICgobWF0Y2ggPSB0aGlzLl9tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSAhPSBudWxsICYmICFtYXRjaC52YWxpZCgpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgIH1cblxuICAgIGlmIChtYXRjaCAhPSBudWxsICYmIG1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtYXRjaFxuICAgIH1cbiAgfVxuXG4gIF9tYXRjaEFueSAodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaFxuXG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKG9mZnNldClcbiAgICB9XG5cbiAgICBtYXRjaCA9IHRoaXMubWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpXG5cbiAgICBpZiAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBQYWlyTWF0Y2godGhpcywgbWF0Y2gsIG9mZnNldClcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueU5hbWVkICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuX21hdGNoQW55R2V0TmFtZSh0aGlzLm1hdGNoQW55KHRleHQpKVxuICB9XG5cbiAgbWF0Y2hBbnlMYXN0ICh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoLCByZXNcblxuICAgIHdoaWxlIChtYXRjaCA9IHRoaXMubWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKClcblxuICAgICAgaWYgKCFyZXMgfHwgcmVzLmVuZCgpICE9PSBtYXRjaC5lbmQoKSkge1xuICAgICAgICByZXMgPSBtYXRjaFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIGlkZW50aWNhbCAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVyID09PSB0aGlzLmNsb3NlciB8fCB0aGlzLm9wZW5lci5zb3VyY2UgIT0gbnVsbCAmJiB0aGlzLmNsb3Nlci5zb3VyY2UgIT0gbnVsbCAmJiB0aGlzLm9wZW5lci5zb3VyY2UgPT09IHRoaXMuY2xvc2VyLnNvdXJjZVxuICB9XG5cbiAgd3JhcHBlclBvcyAocG9zLCB0ZXh0KSB7XG4gICAgdmFyIGVuZCwgc3RhcnRcbiAgICBzdGFydCA9IHRoaXMubWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAsIHBvcy5zdGFydCkpXG5cbiAgICBpZiAoc3RhcnQgIT0gbnVsbCAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBzdGFydC5uYW1lKCkgPT09ICdvcGVuZXInKSkge1xuICAgICAgZW5kID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBwb3MuZW5kKVxuXG4gICAgICBpZiAoZW5kICE9IG51bGwgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgZW5kLm5hbWUoKSA9PT0gJ2Nsb3NlcicpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIGVuZC5lbmQoKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25uYWxfZW5kKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIHRleHQubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzV2FwcGVyT2YgKHBvcywgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZXJQb3MocG9zLCB0ZXh0KSAhPSBudWxsXG4gIH1cbn1cbmV4cG9ydHMuUGFpciA9IFBhaXJcbiIsIlxudmFyIFBhaXJNYXRjaCA9IGNsYXNzIFBhaXJNYXRjaCB7XG4gIGNvbnN0cnVjdG9yIChwYWlyLCBtYXRjaCwgb2Zmc2V0ID0gMCkge1xuICAgIHRoaXMucGFpciA9IHBhaXJcbiAgICB0aGlzLm1hdGNoID0gbWF0Y2hcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldFxuICB9XG5cbiAgbmFtZSAoKSB7XG4gICAgdmFyIF9uYW1lLCBncm91cCwgaSwgaiwgbGVuLCByZWZcblxuICAgIGlmICh0aGlzLm1hdGNoKSB7XG4gICAgICBpZiAodHlwZW9mIF9uYW1lID09PSAndW5kZWZpbmVkJyB8fCBfbmFtZSA9PT0gbnVsbCkge1xuICAgICAgICByZWYgPSB0aGlzLm1hdGNoXG5cbiAgICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgICBncm91cCA9IHJlZltpXVxuXG4gICAgICAgICAgaWYgKGkgPiAwICYmIGdyb3VwICE9IG51bGwpIHtcbiAgICAgICAgICAgIF9uYW1lID0gdGhpcy5wYWlyLm1hdGNoQW55UGFydEtleXMoKVtpIC0gMV1cbiAgICAgICAgICAgIHJldHVybiBfbmFtZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9uYW1lID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9uYW1lIHx8IG51bGxcbiAgICB9XG4gIH1cblxuICBzdGFydCAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm9mZnNldFxuICB9XG5cbiAgZW5kICgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMubWF0Y2hbMF0ubGVuZ3RoICsgdGhpcy5vZmZzZXRcbiAgfVxuXG4gIHZhbGlkICgpIHtcbiAgICByZXR1cm4gIXRoaXMucGFpci52YWxpZE1hdGNoIHx8IHRoaXMucGFpci52YWxpZE1hdGNoKHRoaXMpXG4gIH1cblxuICBsZW5ndGggKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoWzBdLmxlbmd0aFxuICB9XG59XG5leHBvcnRzLlBhaXJNYXRjaCA9IFBhaXJNYXRjaFxuIiwiXG52YXIgUG9zID0gY2xhc3MgUG9zIHtcbiAgY29uc3RydWN0b3IgKHN0YXJ0LCBlbmQpIHtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnRcbiAgICB0aGlzLmVuZCA9IGVuZFxuXG4gICAgaWYgKHRoaXMuZW5kID09IG51bGwpIHtcbiAgICAgIHRoaXMuZW5kID0gdGhpcy5zdGFydFxuICAgIH1cbiAgfVxuXG4gIGNvbnRhaW5zUHQgKHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5lbmRcbiAgfVxuXG4gIGNvbnRhaW5zUG9zIChwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmVuZFxuICB9XG5cbiAgd3JhcHBlZEJ5IChwcmVmaXgsIHN1ZmZpeCkge1xuICAgIHJldHVybiBuZXcgUG9zLndyYXBDbGFzcyh0aGlzLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCwgdGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZW5kICsgc3VmZml4Lmxlbmd0aClcbiAgfVxuXG4gIHdpdGhFZGl0b3IgKHZhbCkge1xuICAgIHRoaXMuX2VkaXRvciA9IHZhbFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBlZGl0b3IgKCkge1xuICAgIGlmICh0aGlzLl9lZGl0b3IgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0JylcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yXG4gIH1cblxuICBoYXNFZGl0b3IgKCkge1xuICAgIHJldHVybiB0aGlzLl9lZGl0b3IgIT0gbnVsbFxuICB9XG5cbiAgdGV4dCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZClcbiAgfVxuXG4gIGFwcGx5T2Zmc2V0IChvZmZzZXQpIHtcbiAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHByZXZFT0wgKCkge1xuICAgIGlmICh0aGlzLl9wcmV2RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3ByZXZFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lU3RhcnQodGhpcy5zdGFydClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcHJldkVPTFxuICB9XG5cbiAgbmV4dEVPTCAoKSB7XG4gICAgaWYgKHRoaXMuX25leHRFT0wgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fbmV4dEVPTCA9IHRoaXMuZWRpdG9yKCkuZmluZExpbmVFbmQodGhpcy5lbmQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25leHRFT0xcbiAgfVxuXG4gIHRleHRXaXRoRnVsbExpbmVzICgpIHtcbiAgICBpZiAodGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMubmV4dEVPTCgpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lc1xuICB9XG5cbiAgc2FtZUxpbmVzUHJlZml4ICgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzUHJlZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5zdGFydClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzUHJlZml4XG4gIH1cblxuICBzYW1lTGluZXNTdWZmaXggKCkge1xuICAgIGlmICh0aGlzLl9zYW1lTGluZXNTdWZmaXggPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2FtZUxpbmVzU3VmZml4ID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuZW5kLCB0aGlzLm5leHRFT0woKSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzU3VmZml4XG4gIH1cblxuICBjb3B5ICgpIHtcbiAgICB2YXIgcmVzXG4gICAgcmVzID0gbmV3IFBvcyh0aGlzLnN0YXJ0LCB0aGlzLmVuZClcblxuICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICByZXMud2l0aEVkaXRvcih0aGlzLmVkaXRvcigpKVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIHJhdyAoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnN0YXJ0LCB0aGlzLmVuZF1cbiAgfVxufVxuZXhwb3J0cy5Qb3MgPSBQb3NcbiIsIlxuY29uc3QgV3JhcHBpbmcgPSByZXF1aXJlKCcuL1dyYXBwaW5nJykuV3JhcHBpbmdcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKCcuL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxuY29uc3QgQ29tbW9uSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9Db21tb25IZWxwZXInKS5Db21tb25IZWxwZXJcblxudmFyIFBvc0NvbGxlY3Rpb24gPSBjbGFzcyBQb3NDb2xsZWN0aW9uIHtcbiAgY29uc3RydWN0b3IgKGFycikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICBhcnIgPSBbYXJyXVxuICAgIH1cblxuICAgIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhhcnIsIFtQb3NDb2xsZWN0aW9uXSlcblxuICAgIHJldHVybiBhcnJcbiAgfVxuXG4gIHdyYXAgKHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeClcbiAgICB9KVxuICB9XG5cbiAgcmVwbGFjZSAodHh0KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gbmV3IFJlcGxhY2VtZW50KHAuc3RhcnQsIHAuZW5kLCB0eHQpXG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5Qb3NDb2xsZWN0aW9uID0gUG9zQ29sbGVjdGlvblxuIiwiXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL1BvcycpLlBvc1xuXG5jb25zdCBDb21tb25IZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcicpLkNvbW1vbkhlbHBlclxuXG5jb25zdCBPcHRpb25PYmplY3QgPSByZXF1aXJlKCcuLi9PcHRpb25PYmplY3QnKS5PcHRpb25PYmplY3RcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInKS5TdHJpbmdIZWxwZXJcblxudmFyIFJlcGxhY2VtZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgY2xhc3MgUmVwbGFjZW1lbnQgZXh0ZW5kcyBQb3Mge1xuICAgIGNvbnN0cnVjdG9yIChzdGFydDEsIGVuZCwgdGV4dDEsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoKVxuICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0MVxuICAgICAgdGhpcy5lbmQgPSBlbmRcbiAgICAgIHRoaXMudGV4dCA9IHRleHQxXG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zLCB7XG4gICAgICAgIHByZWZpeDogJycsXG4gICAgICAgIHN1ZmZpeDogJycsXG4gICAgICAgIHNlbGVjdGlvbnM6IFtdXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJlc1Bvc0JlZm9yZVByZWZpeCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMudGV4dC5sZW5ndGhcbiAgICB9XG5cbiAgICByZXNFbmQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQgKyB0aGlzLmZpbmFsVGV4dCgpLmxlbmd0aFxuICAgIH1cblxuICAgIGFwcGx5ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnNwbGljZVRleHQodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZmluYWxUZXh0KCkpXG4gICAgfVxuXG4gICAgbmVjZXNzYXJ5ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmFsVGV4dCgpICE9PSB0aGlzLm9yaWdpbmFsVGV4dCgpXG4gICAgfVxuXG4gICAgb3JpZ2luYWxUZXh0ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5zdGFydCwgdGhpcy5lbmQpXG4gICAgfVxuXG4gICAgZmluYWxUZXh0ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMudGV4dCArIHRoaXMuc3VmZml4XG4gICAgfVxuXG4gICAgb2Zmc2V0QWZ0ZXIgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoIC0gKHRoaXMuZW5kIC0gdGhpcy5zdGFydClcbiAgICB9XG5cbiAgICBhcHBseU9mZnNldCAob2Zmc2V0KSB7XG4gICAgICB2YXIgaSwgbGVuLCByZWYsIHNlbFxuXG4gICAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICAgIHRoaXMuZW5kICs9IG9mZnNldFxuICAgICAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnNcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBzZWwgPSByZWZbaV1cbiAgICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICAgICAgc2VsLmVuZCArPSBvZmZzZXRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHNlbGVjdENvbnRlbnQgKCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25zID0gW25ldyBQb3ModGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCwgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdGFydCArIHRoaXMudGV4dC5sZW5ndGgpXVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBjYXJyZXRUb1NlbCAoKSB7XG4gICAgICB2YXIgcG9zLCByZXMsIHN0YXJ0LCB0ZXh0XG4gICAgICB0aGlzLnNlbGVjdGlvbnMgPSBbXVxuICAgICAgdGV4dCA9IHRoaXMuZmluYWxUZXh0KClcbiAgICAgIHRoaXMucHJlZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnByZWZpeClcbiAgICAgIHRoaXMudGV4dCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy50ZXh0KVxuICAgICAgdGhpcy5zdWZmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMuc3VmZml4KVxuICAgICAgc3RhcnQgPSB0aGlzLnN0YXJ0XG5cbiAgICAgIHdoaWxlICgocmVzID0gU3RyaW5nSGVscGVyLmdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHRleHQpKSAhPSBudWxsKSB7XG4gICAgICAgIFtwb3MsIHRleHRdID0gcmVzXG4gICAgICAgIHRoaXMuc2VsZWN0aW9ucy5wdXNoKG5ldyBQb3Moc3RhcnQgKyBwb3MsIHN0YXJ0ICsgcG9zKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBjb3B5ICgpIHtcbiAgICAgIHZhciByZXNcbiAgICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy50ZXh0LCB0aGlzLmdldE9wdHMoKSlcblxuICAgICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgICAgcmVzLndpdGhFZGl0b3IodGhpcy5lZGl0b3IoKSlcbiAgICAgIH1cblxuICAgICAgcmVzLnNlbGVjdGlvbnMgPSB0aGlzLnNlbGVjdGlvbnMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiBzLmNvcHkoKVxuICAgICAgfSlcbiAgICAgIHJldHVybiByZXNcbiAgICB9XG4gIH1cblxuICA7XG5cbiAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKFJlcGxhY2VtZW50LnByb3RvdHlwZSwgW09wdGlvbk9iamVjdF0pXG5cbiAgcmV0dXJuIFJlcGxhY2VtZW50XG59LmNhbGwobnVsbCkpXG5cbmV4cG9ydHMuUmVwbGFjZW1lbnQgPSBSZXBsYWNlbWVudFxuIiwiXG52YXIgU2l6ZSA9IGNsYXNzIFNpemUge1xuICBjb25zdHJ1Y3RvciAod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIH1cbn1cbmV4cG9ydHMuU2l6ZSA9IFNpemVcbiIsIlxudmFyIFN0clBvcyA9IGNsYXNzIFN0clBvcyB7XG4gIGNvbnN0cnVjdG9yIChwb3MsIHN0cikge1xuICAgIHRoaXMucG9zID0gcG9zXG4gICAgdGhpcy5zdHIgPSBzdHJcbiAgfVxuXG4gIGVuZCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoXG4gIH1cbn1cbmV4cG9ydHMuU3RyUG9zID0gU3RyUG9zXG4iLCJcbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vUG9zJykuUG9zXG5cbnZhciBXcmFwcGVkUG9zID0gY2xhc3MgV3JhcHBlZFBvcyBleHRlbmRzIFBvcyB7XG4gIGNvbnN0cnVjdG9yIChzdGFydCwgaW5uZXJTdGFydCwgaW5uZXJFbmQsIGVuZCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnRcbiAgICB0aGlzLmlubmVyU3RhcnQgPSBpbm5lclN0YXJ0XG4gICAgdGhpcy5pbm5lckVuZCA9IGlubmVyRW5kXG4gICAgdGhpcy5lbmQgPSBlbmRcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQdCAocHQpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclN0YXJ0IDw9IHB0ICYmIHB0IDw9IHRoaXMuaW5uZXJFbmRcbiAgfVxuXG4gIGlubmVyQ29udGFpbnNQb3MgKHBvcykge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcG9zLnN0YXJ0ICYmIHBvcy5lbmQgPD0gdGhpcy5pbm5lckVuZFxuICB9XG5cbiAgaW5uZXJUZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZClcbiAgfVxuXG4gIHNldElubmVyTGVuIChsZW4pIHtcbiAgICByZXR1cm4gdGhpcy5tb3ZlU3VmaXgodGhpcy5pbm5lclN0YXJ0ICsgbGVuKVxuICB9XG5cbiAgbW92ZVN1ZmZpeCAocHQpIHtcbiAgICB2YXIgc3VmZml4TGVuXG4gICAgc3VmZml4TGVuID0gdGhpcy5lbmQgLSB0aGlzLmlubmVyRW5kXG4gICAgdGhpcy5pbm5lckVuZCA9IHB0XG4gICAgcmV0dXJuIHRoaXMuZW5kID0gdGhpcy5pbm5lckVuZCArIHN1ZmZpeExlblxuICB9XG5cbiAgY29weSAoKSB7XG4gICAgcmV0dXJuIG5ldyBXcmFwcGVkUG9zKHRoaXMuc3RhcnQsIHRoaXMuaW5uZXJTdGFydCwgdGhpcy5pbm5lckVuZCwgdGhpcy5lbmQpXG4gIH1cbn1cbmV4cG9ydHMuV3JhcHBlZFBvcyA9IFdyYXBwZWRQb3NcbiIsIlxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKCcuL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxudmFyIFdyYXBwaW5nID0gY2xhc3MgV3JhcHBpbmcgZXh0ZW5kcyBSZXBsYWNlbWVudCB7XG4gIGNvbnN0cnVjdG9yIChzdGFydCwgZW5kLCBwcmVmaXggPSAnJywgc3VmZml4ID0gJycsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnRcbiAgICB0aGlzLmVuZCA9IGVuZFxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLnNldE9wdHModGhpcy5vcHRpb25zKVxuICAgIHRoaXMudGV4dCA9ICcnXG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXhcbiAgICB0aGlzLnN1ZmZpeCA9IHN1ZmZpeFxuICB9XG5cbiAgYXBwbHkgKCkge1xuICAgIHRoaXMuYWRqdXN0U2VsKClcbiAgICByZXR1cm4gc3VwZXIuYXBwbHkoKVxuICB9XG5cbiAgYWRqdXN0U2VsICgpIHtcbiAgICB2YXIgaSwgbGVuLCBvZmZzZXQsIHJlZiwgcmVzdWx0cywgc2VsXG4gICAgb2Zmc2V0ID0gdGhpcy5vcmlnaW5hbFRleHQoKS5sZW5ndGhcbiAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnNcbiAgICByZXN1bHRzID0gW11cblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2VsID0gcmVmW2ldXG5cbiAgICAgIGlmIChzZWwuc3RhcnQgPiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoKSB7XG4gICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbC5lbmQgPj0gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHRzLnB1c2goc2VsLmVuZCArPSBvZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2gobnVsbClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgZmluYWxUZXh0ICgpIHtcbiAgICB2YXIgdGV4dFxuXG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHRleHQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSAnJ1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRleHQgKyB0aGlzLnN1ZmZpeFxuICB9XG5cbiAgb2Zmc2V0QWZ0ZXIgKCkge1xuICAgIHJldHVybiB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN1ZmZpeC5sZW5ndGhcbiAgfVxuXG4gIGNvcHkgKCkge1xuICAgIHZhciByZXNcbiAgICByZXMgPSBuZXcgV3JhcHBpbmcodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMucHJlZml4LCB0aGlzLnN1ZmZpeClcbiAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLmNvcHkoKVxuICAgIH0pXG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5leHBvcnRzLldyYXBwaW5nID0gV3JhcHBpbmdcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5cbnZhciBMb2NhbFN0b3JhZ2VFbmdpbmUgPSBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmUge1xuICBzYXZlIChrZXksIHZhbCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmZ1bGxLZXkoa2V5KSwgSlNPTi5zdHJpbmdpZnkodmFsKSlcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoIChwYXRoLCBrZXksIHZhbCkge1xuICAgIHZhciBkYXRhXG4gICAgZGF0YSA9IHRoaXMubG9hZChwYXRoKVxuXG4gICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuXG4gICAgZGF0YVtrZXldID0gdmFsXG4gICAgcmV0dXJuIHRoaXMuc2F2ZShwYXRoLCBkYXRhKVxuICB9XG5cbiAgbG9hZCAoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5mdWxsS2V5KGtleSkpKVxuICAgIH1cbiAgfVxuXG4gIGZ1bGxLZXkgKGtleSkge1xuICAgIHJldHVybiAnQ29kZVdhdmVfJyArIGtleVxuICB9XG59XG5leHBvcnRzLkxvY2FsU3RvcmFnZUVuZ2luZSA9IExvY2FsU3RvcmFnZUVuZ2luZVxuIiwiXG52YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3RvciAocGFyc2VyLCBwYXJlbnQpIHtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlclxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50XG4gICAgdGhpcy5jb250ZW50ID0gJydcbiAgfVxuXG4gIG9uU3RhcnQgKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0QXQgPSB0aGlzLnBhcnNlci5wb3NcbiAgfVxuXG4gIG9uQ2hhciAoY2hhcikge31cblxuICBlbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5zZXRDb250ZXh0KHRoaXMucGFyZW50KVxuICB9XG5cbiAgb25FbmQgKCkge31cblxuICB0ZXN0Q29udGV4dCAoY29udGV4dFR5cGUpIHtcbiAgICBpZiAoY29udGV4dFR5cGUudGVzdCh0aGlzLnBhcnNlci5jaGFyLCB0aGlzKSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLnNldENvbnRleHQobmV3IGNvbnRleHRUeXBlKHRoaXMucGFyc2VyLCB0aGlzKSlcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdGVzdCAoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbmV4cG9ydHMuQ29udGV4dCA9IENvbnRleHRcbiIsIlxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxudmFyIEVzY2FwZUNvbnRleHQgPSBjbGFzcyBFc2NhcGVDb250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uQ2hhciAoY2hhcikge1xuICAgIHRoaXMucGFyZW50LmNvbnRlbnQgKz0gY2hhclxuICAgIHJldHVybiB0aGlzLmVuZCgpXG4gIH1cblxuICBzdGF0aWMgdGVzdCAoY2hhcikge1xuICAgIHJldHVybiBjaGFyID09PSAnXFxcXCdcbiAgfVxufVxuZXhwb3J0cy5Fc2NhcGVDb250ZXh0ID0gRXNjYXBlQ29udGV4dFxuIiwiXG5jb25zdCBQYXJhbUNvbnRleHQgPSByZXF1aXJlKCcuL1BhcmFtQ29udGV4dCcpLlBhcmFtQ29udGV4dFxuXG52YXIgaW5kZXhPZiA9IFtdLmluZGV4T2ZcbnZhciBOYW1lZENvbnRleHQgPSBjbGFzcyBOYW1lZENvbnRleHQgZXh0ZW5kcyBQYXJhbUNvbnRleHQge1xuICBvblN0YXJ0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5wYXJlbnQuY29udGVudFxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5uYW1lZFt0aGlzLm5hbWVdID0gdGhpcy5jb250ZW50XG4gIH1cblxuICBzdGF0aWMgdGVzdCAoY2hhciwgcGFyZW50KSB7XG4gICAgdmFyIHJlZlxuICAgIHJldHVybiBjaGFyID09PSAnOicgJiYgKHBhcmVudC5wYXJzZXIub3B0aW9ucy5hbGxvd2VkTmFtZWQgPT0gbnVsbCB8fCAocmVmID0gcGFyZW50LmNvbnRlbnQsIGluZGV4T2YuY2FsbChwYXJlbnQucGFyc2VyLm9wdGlvbnMuYWxsb3dlZE5hbWVkLCByZWYpID49IDApKVxuICB9XG59XG5leHBvcnRzLk5hbWVkQ29udGV4dCA9IE5hbWVkQ29udGV4dFxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBTdHJpbmdDb250ZXh0ID0gcmVxdWlyZSgnLi9TdHJpbmdDb250ZXh0JykuU3RyaW5nQ29udGV4dFxuXG5jb25zdCBWYXJpYWJsZUNvbnRleHQgPSByZXF1aXJlKCcuL1ZhcmlhYmxlQ29udGV4dCcpLlZhcmlhYmxlQ29udGV4dFxuXG52YXIgUGFyYW1Db250ZXh0ID0gY2xhc3MgUGFyYW1Db250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uQ2hhciAoY2hhcikge1xuICAgIGlmICh0aGlzLnRlc3RDb250ZXh0KFN0cmluZ0NvbnRleHQpKSB7fSBlbHNlIGlmICh0aGlzLnRlc3RDb250ZXh0KFBhcmFtQ29udGV4dC5uYW1lZCkpIHt9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoVmFyaWFibGVDb250ZXh0KSkge30gZWxzZSBpZiAoY2hhciA9PT0gJyAnKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2V0Q29udGV4dChuZXcgUGFyYW1Db250ZXh0KHRoaXMucGFyc2VyKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCArPSBjaGFyXG4gICAgfVxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5wYXJhbXMucHVzaCh0aGlzLmNvbnRlbnQpXG4gIH1cbn1cbmV4cG9ydHMuUGFyYW1Db250ZXh0ID0gUGFyYW1Db250ZXh0XG4iLCJcbmNvbnN0IFBhcmFtQ29udGV4dCA9IHJlcXVpcmUoJy4vUGFyYW1Db250ZXh0JykuUGFyYW1Db250ZXh0XG5cbmNvbnN0IE5hbWVkQ29udGV4dCA9IHJlcXVpcmUoJy4vTmFtZWRDb250ZXh0JykuTmFtZWRDb250ZXh0XG5cblBhcmFtQ29udGV4dC5uYW1lZCA9IE5hbWVkQ29udGV4dFxudmFyIFBhcmFtUGFyc2VyID0gY2xhc3MgUGFyYW1QYXJzZXIge1xuICBjb25zdHJ1Y3RvciAocGFyYW1TdHJpbmcsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMucGFyYW1TdHJpbmcgPSBwYXJhbVN0cmluZ1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLnBhcnNlKClcbiAgfVxuXG4gIHNldENvbnRleHQgKGNvbnRleHQpIHtcbiAgICB2YXIgb2xkQ29udGV4dFxuICAgIG9sZENvbnRleHQgPSB0aGlzLmNvbnRleHRcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XG5cbiAgICBpZiAob2xkQ29udGV4dCAhPSBudWxsICYmIG9sZENvbnRleHQgIT09IChjb250ZXh0ICE9IG51bGwgPyBjb250ZXh0LnBhcmVudCA6IG51bGwpKSB7XG4gICAgICBvbGRDb250ZXh0Lm9uRW5kKClcbiAgICB9XG5cbiAgICBpZiAoY29udGV4dCAhPSBudWxsKSB7XG4gICAgICBjb250ZXh0Lm9uU3RhcnQoKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvbnRleHRcbiAgfVxuXG4gIHBhcnNlICgpIHtcbiAgICB0aGlzLnBhcmFtcyA9IFtdXG4gICAgdGhpcy5uYW1lZCA9IHt9XG5cbiAgICBpZiAodGhpcy5wYXJhbVN0cmluZy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0Q29udGV4dChuZXcgUGFyYW1Db250ZXh0KHRoaXMpKVxuICAgICAgdGhpcy5wb3MgPSAwXG5cbiAgICAgIHdoaWxlICh0aGlzLnBvcyA8IHRoaXMucGFyYW1TdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY2hhciA9IHRoaXMucGFyYW1TdHJpbmdbdGhpcy5wb3NdXG4gICAgICAgIHRoaXMuY29udGV4dC5vbkNoYXIodGhpcy5jaGFyKVxuICAgICAgICB0aGlzLnBvcysrXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNldENvbnRleHQobnVsbClcbiAgICB9XG4gIH1cblxuICB0YWtlIChuYikge1xuICAgIHJldHVybiB0aGlzLnBhcmFtU3RyaW5nLnN1YnN0cmluZyh0aGlzLnBvcywgdGhpcy5wb3MgKyBuYilcbiAgfVxuXG4gIHNraXAgKG5iID0gMSkge1xuICAgIHJldHVybiB0aGlzLnBvcyArPSBuYlxuICB9XG59XG5leHBvcnRzLlBhcmFtUGFyc2VyID0gUGFyYW1QYXJzZXJcbiIsIlxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxuY29uc3QgRXNjYXBlQ29udGV4dCA9IHJlcXVpcmUoJy4vRXNjYXBlQ29udGV4dCcpLkVzY2FwZUNvbnRleHRcblxuY29uc3QgVmFyaWFibGVDb250ZXh0ID0gcmVxdWlyZSgnLi9WYXJpYWJsZUNvbnRleHQnKS5WYXJpYWJsZUNvbnRleHRcblxudmFyIFN0cmluZ0NvbnRleHQgPSBjbGFzcyBTdHJpbmdDb250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uQ2hhciAoY2hhcikge1xuICAgIGlmICh0aGlzLnRlc3RDb250ZXh0KEVzY2FwZUNvbnRleHQpKSB7fSBlbHNlIGlmICh0aGlzLnRlc3RDb250ZXh0KFZhcmlhYmxlQ29udGV4dCkpIHt9IGVsc2UgaWYgKFN0cmluZ0NvbnRleHQuaXNEZWxpbWl0ZXIoY2hhcikpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgKz0gY2hhclxuICAgIH1cbiAgfVxuXG4gIG9uRW5kICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuY29udGVudCArPSB0aGlzLmNvbnRlbnRcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0IChjaGFyKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNEZWxpbWl0ZXIoY2hhcilcbiAgfVxuXG4gIHN0YXRpYyBpc0RlbGltaXRlciAoY2hhcikge1xuICAgIHJldHVybiBjaGFyID09PSAnXCInIHx8IGNoYXIgPT09IFwiJ1wiXG4gIH1cbn1cbmV4cG9ydHMuU3RyaW5nQ29udGV4dCA9IFN0cmluZ0NvbnRleHRcbiIsIlxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxudmFyIFZhcmlhYmxlQ29udGV4dCA9IGNsYXNzIFZhcmlhYmxlQ29udGV4dCBleHRlbmRzIENvbnRleHQge1xuICBvblN0YXJ0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2tpcCgpXG4gIH1cblxuICBvbkNoYXIgKGNoYXIpIHtcbiAgICBpZiAoY2hhciA9PT0gJ30nKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmQoKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ICs9IGNoYXJcbiAgICB9XG4gIH1cblxuICBvbkVuZCAoKSB7XG4gICAgdmFyIHJlZlxuICAgIHJldHVybiB0aGlzLnBhcmVudC5jb250ZW50ICs9ICgocmVmID0gdGhpcy5wYXJzZXIub3B0aW9ucy52YXJzKSAhPSBudWxsID8gcmVmW3RoaXMuY29udGVudF0gOiBudWxsKSB8fCAnJ1xuICB9XG5cbiAgc3RhdGljIHRlc3QgKGNoYXIsIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQucGFyc2VyLnRha2UoMikgPT09ICcjeydcbiAgfVxufVxuZXhwb3J0cy5WYXJpYWJsZUNvbnRleHQgPSBWYXJpYWJsZUNvbnRleHRcbiIsIi8qIVxuICogaW5mbGVjdGlvblxuICogQ29weXJpZ2h0KGMpIDIwMTEgQmVuIExpbiA8YmVuQGRyZWFtZXJzbGFiLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICpcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEEgcG9ydCBvZiBpbmZsZWN0aW9uLWpzIHRvIG5vZGUuanMgbW9kdWxlLlxuICovXG5cbiggZnVuY3Rpb24gKCByb290LCBmYWN0b3J5ICl7XG4gIGlmKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKXtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkgKTtcbiAgfWVsc2UgaWYoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApe1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9ZWxzZXtcbiAgICByb290LmluZmxlY3Rpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0oIHRoaXMsIGZ1bmN0aW9uICgpe1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhpcyBpcyBhIGxpc3Qgb2Ygbm91bnMgdGhhdCB1c2UgdGhlIHNhbWUgZm9ybSBmb3IgYm90aCBzaW5ndWxhciBhbmQgcGx1cmFsLlxuICAgKiAgICAgICAgICAgICAgVGhpcyBsaXN0IHNob3VsZCByZW1haW4gZW50aXJlbHkgaW4gbG93ZXIgY2FzZSB0byBjb3JyZWN0bHkgbWF0Y2ggU3RyaW5ncy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciB1bmNvdW50YWJsZV93b3JkcyA9IFtcbiAgICAvLyAnYWNjZXNzJyxcbiAgICAnYWNjb21tb2RhdGlvbicsXG4gICAgJ2FkdWx0aG9vZCcsXG4gICAgJ2FkdmVydGlzaW5nJyxcbiAgICAnYWR2aWNlJyxcbiAgICAnYWdncmVzc2lvbicsXG4gICAgJ2FpZCcsXG4gICAgJ2FpcicsXG4gICAgJ2FpcmNyYWZ0JyxcbiAgICAnYWxjb2hvbCcsXG4gICAgJ2FuZ2VyJyxcbiAgICAnYXBwbGF1c2UnLFxuICAgICdhcml0aG1ldGljJyxcbiAgICAvLyAnYXJ0JyxcbiAgICAnYXNzaXN0YW5jZScsXG4gICAgJ2F0aGxldGljcycsXG4gICAgLy8gJ2F0dGVudGlvbicsXG5cbiAgICAnYmFjb24nLFxuICAgICdiYWdnYWdlJyxcbiAgICAvLyAnYmFsbGV0JyxcbiAgICAvLyAnYmVhdXR5JyxcbiAgICAnYmVlZicsXG4gICAgLy8gJ2JlZXInLFxuICAgIC8vICdiZWhhdmlvcicsXG4gICAgJ2Jpb2xvZ3knLFxuICAgIC8vICdiaWxsaWFyZHMnLFxuICAgICdibG9vZCcsXG4gICAgJ2JvdGFueScsXG4gICAgLy8gJ2Jvd2VscycsXG4gICAgJ2JyZWFkJyxcbiAgICAvLyAnYnVzaW5lc3MnLFxuICAgICdidXR0ZXInLFxuXG4gICAgJ2NhcmJvbicsXG4gICAgJ2NhcmRib2FyZCcsXG4gICAgJ2Nhc2gnLFxuICAgICdjaGFsaycsXG4gICAgJ2NoYW9zJyxcbiAgICAnY2hlc3MnLFxuICAgICdjcm9zc3JvYWRzJyxcbiAgICAnY291bnRyeXNpZGUnLFxuXG4gICAgLy8gJ2RhbWFnZScsXG4gICAgJ2RhbmNpbmcnLFxuICAgIC8vICdkYW5nZXInLFxuICAgICdkZWVyJyxcbiAgICAvLyAnZGVsaWdodCcsXG4gICAgLy8gJ2Rlc3NlcnQnLFxuICAgICdkaWduaXR5JyxcbiAgICAnZGlydCcsXG4gICAgLy8gJ2Rpc3RyaWJ1dGlvbicsXG4gICAgJ2R1c3QnLFxuXG4gICAgJ2Vjb25vbWljcycsXG4gICAgJ2VkdWNhdGlvbicsXG4gICAgJ2VsZWN0cmljaXR5JyxcbiAgICAvLyAnZW1wbG95bWVudCcsXG4gICAgLy8gJ2VuZXJneScsXG4gICAgJ2VuZ2luZWVyaW5nJyxcbiAgICAnZW5qb3ltZW50JyxcbiAgICAvLyAnZW50ZXJ0YWlubWVudCcsXG4gICAgJ2VudnknLFxuICAgICdlcXVpcG1lbnQnLFxuICAgICdldGhpY3MnLFxuICAgICdldmlkZW5jZScsXG4gICAgJ2V2b2x1dGlvbicsXG5cbiAgICAvLyAnZmFpbHVyZScsXG4gICAgLy8gJ2ZhaXRoJyxcbiAgICAnZmFtZScsXG4gICAgJ2ZpY3Rpb24nLFxuICAgIC8vICdmaXNoJyxcbiAgICAnZmxvdXInLFxuICAgICdmbHUnLFxuICAgICdmb29kJyxcbiAgICAvLyAnZnJlZWRvbScsXG4gICAgLy8gJ2ZydWl0JyxcbiAgICAnZnVlbCcsXG4gICAgJ2Z1bicsXG4gICAgLy8gJ2Z1bmVyYWwnLFxuICAgICdmdXJuaXR1cmUnLFxuXG4gICAgJ2dhbGxvd3MnLFxuICAgICdnYXJiYWdlJyxcbiAgICAnZ2FybGljJyxcbiAgICAvLyAnZ2FzJyxcbiAgICAnZ2VuZXRpY3MnLFxuICAgIC8vICdnbGFzcycsXG4gICAgJ2dvbGQnLFxuICAgICdnb2xmJyxcbiAgICAnZ29zc2lwJyxcbiAgICAnZ3JhbW1hcicsXG4gICAgLy8gJ2dyYXNzJyxcbiAgICAnZ3JhdGl0dWRlJyxcbiAgICAnZ3JpZWYnLFxuICAgIC8vICdncm91bmQnLFxuICAgICdndWlsdCcsXG4gICAgJ2d5bW5hc3RpY3MnLFxuXG4gICAgLy8gJ2hhaXInLFxuICAgICdoYXBwaW5lc3MnLFxuICAgICdoYXJkd2FyZScsXG4gICAgJ2hhcm0nLFxuICAgICdoYXRlJyxcbiAgICAnaGF0cmVkJyxcbiAgICAnaGVhbHRoJyxcbiAgICAnaGVhdCcsXG4gICAgLy8gJ2hlaWdodCcsXG4gICAgJ2hlbHAnLFxuICAgICdob21ld29yaycsXG4gICAgJ2hvbmVzdHknLFxuICAgICdob25leScsXG4gICAgJ2hvc3BpdGFsaXR5JyxcbiAgICAnaG91c2V3b3JrJyxcbiAgICAnaHVtb3VyJyxcbiAgICAnaHVuZ2VyJyxcbiAgICAnaHlkcm9nZW4nLFxuXG4gICAgJ2ljZScsXG4gICAgJ2ltcG9ydGFuY2UnLFxuICAgICdpbmZsYXRpb24nLFxuICAgICdpbmZvcm1hdGlvbicsXG4gICAgLy8gJ2luanVzdGljZScsXG4gICAgJ2lubm9jZW5jZScsXG4gICAgLy8gJ2ludGVsbGlnZW5jZScsXG4gICAgJ2lyb24nLFxuICAgICdpcm9ueScsXG5cbiAgICAnamFtJyxcbiAgICAvLyAnamVhbG91c3knLFxuICAgIC8vICdqZWxseScsXG4gICAgJ2pld2VscnknLFxuICAgIC8vICdqb3knLFxuICAgICdqdWRvJyxcbiAgICAvLyAnanVpY2UnLFxuICAgIC8vICdqdXN0aWNlJyxcblxuICAgICdrYXJhdGUnLFxuICAgIC8vICdraW5kbmVzcycsXG4gICAgJ2tub3dsZWRnZScsXG5cbiAgICAvLyAnbGFib3VyJyxcbiAgICAnbGFjaycsXG4gICAgLy8gJ2xhbmQnLFxuICAgICdsYXVnaHRlcicsXG4gICAgJ2xhdmEnLFxuICAgICdsZWF0aGVyJyxcbiAgICAnbGVpc3VyZScsXG4gICAgJ2xpZ2h0bmluZycsXG4gICAgJ2xpbmd1aW5lJyxcbiAgICAnbGluZ3VpbmknLFxuICAgICdsaW5ndWlzdGljcycsXG4gICAgJ2xpdGVyYXR1cmUnLFxuICAgICdsaXR0ZXInLFxuICAgICdsaXZlc3RvY2snLFxuICAgICdsb2dpYycsXG4gICAgJ2xvbmVsaW5lc3MnLFxuICAgIC8vICdsb3ZlJyxcbiAgICAnbHVjaycsXG4gICAgJ2x1Z2dhZ2UnLFxuXG4gICAgJ21hY2Fyb25pJyxcbiAgICAnbWFjaGluZXJ5JyxcbiAgICAnbWFnaWMnLFxuICAgIC8vICdtYWlsJyxcbiAgICAnbWFuYWdlbWVudCcsXG4gICAgJ21hbmtpbmQnLFxuICAgICdtYXJibGUnLFxuICAgICdtYXRoZW1hdGljcycsXG4gICAgJ21heW9ubmFpc2UnLFxuICAgICdtZWFzbGVzJyxcbiAgICAvLyAnbWVhdCcsXG4gICAgLy8gJ21ldGFsJyxcbiAgICAnbWV0aGFuZScsXG4gICAgJ21pbGsnLFxuICAgICdtaW51cycsXG4gICAgJ21vbmV5JyxcbiAgICAvLyAnbW9vc2UnLFxuICAgICdtdWQnLFxuICAgICdtdXNpYycsXG4gICAgJ211bXBzJyxcblxuICAgICduYXR1cmUnLFxuICAgICduZXdzJyxcbiAgICAnbml0cm9nZW4nLFxuICAgICdub25zZW5zZScsXG4gICAgJ251cnR1cmUnLFxuICAgICdudXRyaXRpb24nLFxuXG4gICAgJ29iZWRpZW5jZScsXG4gICAgJ29iZXNpdHknLFxuICAgIC8vICdvaWwnLFxuICAgICdveHlnZW4nLFxuXG4gICAgLy8gJ3BhcGVyJyxcbiAgICAvLyAncGFzc2lvbicsXG4gICAgJ3Bhc3RhJyxcbiAgICAncGF0aWVuY2UnLFxuICAgIC8vICdwZXJtaXNzaW9uJyxcbiAgICAncGh5c2ljcycsXG4gICAgJ3BvZXRyeScsXG4gICAgJ3BvbGx1dGlvbicsXG4gICAgJ3BvdmVydHknLFxuICAgIC8vICdwb3dlcicsXG4gICAgJ3ByaWRlJyxcbiAgICAvLyAncHJvZHVjdGlvbicsXG4gICAgLy8gJ3Byb2dyZXNzJyxcbiAgICAvLyAncHJvbnVuY2lhdGlvbicsXG4gICAgJ3BzeWNob2xvZ3knLFxuICAgICdwdWJsaWNpdHknLFxuICAgICdwdW5jdHVhdGlvbicsXG5cbiAgICAvLyAncXVhbGl0eScsXG4gICAgLy8gJ3F1YW50aXR5JyxcbiAgICAncXVhcnR6JyxcblxuICAgICdyYWNpc20nLFxuICAgIC8vICdyYWluJyxcbiAgICAvLyAncmVjcmVhdGlvbicsXG4gICAgJ3JlbGF4YXRpb24nLFxuICAgICdyZWxpYWJpbGl0eScsXG4gICAgJ3Jlc2VhcmNoJyxcbiAgICAncmVzcGVjdCcsXG4gICAgJ3JldmVuZ2UnLFxuICAgICdyaWNlJyxcbiAgICAncnViYmlzaCcsXG4gICAgJ3J1bScsXG5cbiAgICAnc2FmZXR5JyxcbiAgICAvLyAnc2FsYWQnLFxuICAgIC8vICdzYWx0JyxcbiAgICAvLyAnc2FuZCcsXG4gICAgLy8gJ3NhdGlyZScsXG4gICAgJ3NjZW5lcnknLFxuICAgICdzZWFmb29kJyxcbiAgICAnc2Vhc2lkZScsXG4gICAgJ3NlcmllcycsXG4gICAgJ3NoYW1lJyxcbiAgICAnc2hlZXAnLFxuICAgICdzaG9wcGluZycsXG4gICAgLy8gJ3NpbGVuY2UnLFxuICAgICdzbGVlcCcsXG4gICAgLy8gJ3NsYW5nJ1xuICAgICdzbW9rZScsXG4gICAgJ3Ntb2tpbmcnLFxuICAgICdzbm93JyxcbiAgICAnc29hcCcsXG4gICAgJ3NvZnR3YXJlJyxcbiAgICAnc29pbCcsXG4gICAgLy8gJ3NvcnJvdycsXG4gICAgLy8gJ3NvdXAnLFxuICAgICdzcGFnaGV0dGknLFxuICAgIC8vICdzcGVlZCcsXG4gICAgJ3NwZWNpZXMnLFxuICAgIC8vICdzcGVsbGluZycsXG4gICAgLy8gJ3Nwb3J0JyxcbiAgICAnc3RlYW0nLFxuICAgIC8vICdzdHJlbmd0aCcsXG4gICAgJ3N0dWZmJyxcbiAgICAnc3R1cGlkaXR5JyxcbiAgICAvLyAnc3VjY2VzcycsXG4gICAgLy8gJ3N1Z2FyJyxcbiAgICAnc3Vuc2hpbmUnLFxuICAgICdzeW1tZXRyeScsXG5cbiAgICAvLyAndGVhJyxcbiAgICAndGVubmlzJyxcbiAgICAndGhpcnN0JyxcbiAgICAndGh1bmRlcicsXG4gICAgJ3RpbWJlcicsXG4gICAgLy8gJ3RpbWUnLFxuICAgIC8vICd0b2FzdCcsXG4gICAgLy8gJ3RvbGVyYW5jZScsXG4gICAgLy8gJ3RyYWRlJyxcbiAgICAndHJhZmZpYycsXG4gICAgJ3RyYW5zcG9ydGF0aW9uJyxcbiAgICAvLyAndHJhdmVsJyxcbiAgICAndHJ1c3QnLFxuXG4gICAgLy8gJ3VuZGVyc3RhbmRpbmcnLFxuICAgICd1bmRlcndlYXInLFxuICAgICd1bmVtcGxveW1lbnQnLFxuICAgICd1bml0eScsXG4gICAgLy8gJ3VzYWdlJyxcblxuICAgICd2YWxpZGl0eScsXG4gICAgJ3ZlYWwnLFxuICAgICd2ZWdldGF0aW9uJyxcbiAgICAndmVnZXRhcmlhbmlzbScsXG4gICAgJ3ZlbmdlYW5jZScsXG4gICAgJ3Zpb2xlbmNlJyxcbiAgICAvLyAndmlzaW9uJyxcbiAgICAndml0YWxpdHknLFxuXG4gICAgJ3dhcm10aCcsXG4gICAgLy8gJ3dhdGVyJyxcbiAgICAnd2VhbHRoJyxcbiAgICAnd2VhdGhlcicsXG4gICAgLy8gJ3dlaWdodCcsXG4gICAgJ3dlbGZhcmUnLFxuICAgICd3aGVhdCcsXG4gICAgLy8gJ3doaXNrZXknLFxuICAgIC8vICd3aWR0aCcsXG4gICAgJ3dpbGRsaWZlJyxcbiAgICAvLyAnd2luZScsXG4gICAgJ3dpc2RvbScsXG4gICAgLy8gJ3dvb2QnLFxuICAgIC8vICd3b29sJyxcbiAgICAvLyAnd29yaycsXG5cbiAgICAvLyAneWVhc3QnLFxuICAgICd5b2dhJyxcblxuICAgICd6aW5jJyxcbiAgICAnem9vbG9neSdcbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoZXNlIHJ1bGVzIHRyYW5zbGF0ZSBmcm9tIHRoZSBzaW5ndWxhciBmb3JtIG9mIGEgbm91biB0byBpdHMgcGx1cmFsIGZvcm0uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIHZhciByZWdleCA9IHtcbiAgICBwbHVyYWwgOiB7XG4gICAgICBtZW4gICAgICAgOiBuZXcgUmVnRXhwKCAnXihtfHdvbSllbiQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHBlb3BsZSAgICA6IG5ldyBSZWdFeHAoICcocGUpb3BsZSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY2hpbGRyZW4gIDogbmV3IFJlZ0V4cCggJyhjaGlsZClyZW4kJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB0aWEgICAgICAgOiBuZXcgUmVnRXhwKCAnKFt0aV0pYSQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFuYWx5c2VzICA6IG5ldyBSZWdFeHAoICcoKGEpbmFseXwoYilhfChkKWlhZ25vfChwKWFyZW50aGV8KHApcm9nbm98KHMpeW5vcHwodCloZSlzZXMkJywnZ2knICksXG4gICAgICBoaXZlcyAgICAgOiBuZXcgUmVnRXhwKCAnKGhpfHRpKXZlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGN1cnZlcyAgICA6IG5ldyBSZWdFeHAoICcoY3VydmUpcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbHJ2ZXMgICAgIDogbmV3IFJlZ0V4cCggJyhbbHJdKXZlcyQnICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhdmVzICAgICAgOiBuZXcgUmVnRXhwKCAnKFthXSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZvdmVzICAgICA6IG5ldyBSZWdFeHAoICcoW15mb10pdmVzJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbW92aWVzICAgIDogbmV3IFJlZ0V4cCggJyhtKW92aWVzJCcgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhZWlvdXlpZXMgOiBuZXcgUmVnRXhwKCAnKFteYWVpb3V5XXxxdSlpZXMkJyAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHNlcmllcyAgICA6IG5ldyBSZWdFeHAoICcocyllcmllcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgeGVzICAgICAgIDogbmV3IFJlZ0V4cCggJyh4fGNofHNzfHNoKWVzJCcgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBtaWNlICAgICAgOiBuZXcgUmVnRXhwKCAnKFttfGxdKWljZSQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1c2VzICAgICA6IG5ldyBSZWdFeHAoICcoYnVzKWVzJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2VzICAgICAgIDogbmV3IFJlZ0V4cCggJyhvKWVzJCcgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzaG9lcyAgICAgOiBuZXcgUmVnRXhwKCAnKHNob2UpcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXNlcyAgICA6IG5ldyBSZWdFeHAoICcoY3Jpc3xheHx0ZXN0KWVzJCcgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2N0b3BpICAgIDogbmV3IFJlZ0V4cCggJyhvY3RvcHx2aXIpaSQnICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhbGlhc2VzICAgOiBuZXcgUmVnRXhwKCAnKGFsaWFzfGNhbnZhc3xzdGF0dXN8Y2FtcHVzKWVzJCcsICdnaScgKSxcbiAgICAgIHN1bW1vbnNlcyA6IG5ldyBSZWdFeHAoICdeKHN1bW1vbnMpZXMkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb3hlbiAgICAgIDogbmV3IFJlZ0V4cCggJ14ob3gpZW4nICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBtYXRyaWNlcyAgOiBuZXcgUmVnRXhwKCAnKG1hdHIpaWNlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHZlcnRpY2VzICA6IG5ldyBSZWdFeHAoICcodmVydHxpbmQpaWNlcyQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZmVldCAgICAgIDogbmV3IFJlZ0V4cCggJ15mZWV0JCcgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB0ZWV0aCAgICAgOiBuZXcgUmVnRXhwKCAnXnRlZXRoJCcgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlZXNlICAgICA6IG5ldyBSZWdFeHAoICdeZ2Vlc2UkJyAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcXVpenplcyAgIDogbmV3IFJlZ0V4cCggJyhxdWl6KXplcyQnICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB3aGVyZWFzZXMgOiBuZXcgUmVnRXhwKCAnXih3aGVyZWFzKWVzJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXRlcmlhICA6IG5ldyBSZWdFeHAoICdeKGNyaXRlcmkpYSQnICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ2VuZXJhICAgIDogbmV3IFJlZ0V4cCggJ15nZW5lcmEkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzcyAgICAgICAgOiBuZXcgUmVnRXhwKCAnc3MkJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHMgICAgICAgICA6IG5ldyBSZWdFeHAoICdzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApXG4gICAgfSxcblxuICAgIHNpbmd1bGFyIDoge1xuICAgICAgbWFuICAgICAgIDogbmV3IFJlZ0V4cCggJ14obXx3b20pYW4kJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcGVyc29uICAgIDogbmV3IFJlZ0V4cCggJyhwZSlyc29uJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY2hpbGQgICAgIDogbmV3IFJlZ0V4cCggJyhjaGlsZCkkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb3ggICAgICAgIDogbmV3IFJlZ0V4cCggJ14ob3gpJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYXhpcyAgICAgIDogbmV3IFJlZ0V4cCggJyhheHx0ZXN0KWlzJCcgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgb2N0b3B1cyAgIDogbmV3IFJlZ0V4cCggJyhvY3RvcHx2aXIpdXMkJyAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWxpYXMgICAgIDogbmV3IFJlZ0V4cCggJyhhbGlhc3xzdGF0dXN8Y2FudmFzfGNhbXB1cykkJywgJ2dpJyApLFxuICAgICAgc3VtbW9ucyAgIDogbmV3IFJlZ0V4cCggJ14oc3VtbW9ucykkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYnVzICAgICAgIDogbmV3IFJlZ0V4cCggJyhidSlzJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYnVmZmFsbyAgIDogbmV3IFJlZ0V4cCggJyhidWZmYWx8dG9tYXR8cG90YXQpbyQnICAgICAgICwgJ2dpJyApLFxuICAgICAgdGl1bSAgICAgIDogbmV3IFJlZ0V4cCggJyhbdGldKXVtJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc2lzICAgICAgIDogbmV3IFJlZ0V4cCggJ3NpcyQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZmZlICAgICAgIDogbmV3IFJlZ0V4cCggJyg/OihbXmZdKWZlfChbbHJdKWYpJCcgICAgICAgICwgJ2dpJyApLFxuICAgICAgaGl2ZSAgICAgIDogbmV3IFJlZ0V4cCggJyhoaXx0aSl2ZSQnICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWVpb3V5eSAgIDogbmV3IFJlZ0V4cCggJyhbXmFlaW91eV18cXUpeSQnICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgeCAgICAgICAgIDogbmV3IFJlZ0V4cCggJyh4fGNofHNzfHNoKSQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWF0cml4ICAgIDogbmV3IFJlZ0V4cCggJyhtYXRyKWl4JCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdmVydGV4ICAgIDogbmV3IFJlZ0V4cCggJyh2ZXJ0fGluZClleCQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbW91c2UgICAgIDogbmV3IFJlZ0V4cCggJyhbbXxsXSlvdXNlJCcgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZm9vdCAgICAgIDogbmV3IFJlZ0V4cCggJ15mb290JCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdG9vdGggICAgIDogbmV3IFJlZ0V4cCggJ150b290aCQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ29vc2UgICAgIDogbmV3IFJlZ0V4cCggJ15nb29zZSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcXVpeiAgICAgIDogbmV3IFJlZ0V4cCggJyhxdWl6KSQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgd2hlcmVhcyAgIDogbmV3IFJlZ0V4cCggJ14od2hlcmVhcykkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY3JpdGVyaW9uIDogbmV3IFJlZ0V4cCggJ14oY3JpdGVyaSlvbiQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgZ2VudXMgICAgIDogbmV3IFJlZ0V4cCggJ15nZW51cyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgcyAgICAgICAgIDogbmV3IFJlZ0V4cCggJ3MkJyAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgY29tbW9uICAgIDogbmV3IFJlZ0V4cCggJyQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApXG4gICAgfVxuICB9O1xuXG4gIHZhciBwbHVyYWxfcnVsZXMgPSBbXG5cbiAgICAvLyBkbyBub3QgcmVwbGFjZSBpZiBpdHMgYWxyZWFkeSBhIHBsdXJhbCB3b3JkXG4gICAgWyByZWdleC5wbHVyYWwubWVuICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwucGVvcGxlICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY2hpbGRyZW4gIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGlhICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYW5hbHlzZXMgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuaGl2ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3VydmVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubHJ2ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZm92ZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWVpb3V5aWVzIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc2VyaWVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubW92aWVzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwueGVzICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWljZSAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYnVzZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2VzICAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc2hvZXMgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3Jpc2VzICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2N0b3BpICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWxpYXNlcyAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc3VtbW9uc2VzIF0sXG4gICAgWyByZWdleC5wbHVyYWwub3hlbiAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWF0cmljZXMgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZmVldCAgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGVldGggICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2Vlc2UgICAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwucXVpenplcyAgIF0sXG4gICAgWyByZWdleC5wbHVyYWwud2hlcmVhc2VzIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3JpdGVyaWEgIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2VuZXJhICAgIF0sXG5cbiAgICAvLyBvcmlnaW5hbCBydWxlXG4gICAgWyByZWdleC5zaW5ndWxhci5tYW4gICAgICAsICckMWVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucGVyc29uICAgLCAnJDFvcGxlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY2hpbGQgICAgLCAnJDFyZW4nIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5veCAgICAgICAsICckMWVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYXhpcyAgICAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm9jdG9wdXMgICwgJyQxaScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmFsaWFzICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zdW1tb25zICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVzICAgICAgLCAnJDFzZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idWZmYWxvICAsICckMW9lcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnRpdW0gICAgICwgJyQxYScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnNpcyAgICAgICwgJ3NlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmZmZSAgICAgICwgJyQxJDJ2ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5oaXZlICAgICAsICckMXZlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmFlaW91eXkgICwgJyQxaWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWF0cml4ICAgLCAnJDFpY2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudmVydGV4ICAgLCAnJDFpY2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIueCAgICAgICAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm1vdXNlICAgICwgJyQxaWNlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZm9vdCAgICAgLCAnZmVldCcgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnRvb3RoICAgICwgJ3RlZXRoJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ29vc2UgICAgLCAnZ2Vlc2UnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5xdWl6ICAgICAsICckMXplcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLndoZXJlYXMgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jcml0ZXJpb24sICckMWEnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nZW51cyAgICAsICdnZW5lcmEnIF0sXG5cbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnMgICAgICwgJ3MnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jb21tb24sICdzJyBdXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBydWxlcyB0cmFuc2xhdGUgZnJvbSB0aGUgcGx1cmFsIGZvcm0gb2YgYSBub3VuIHRvIGl0cyBzaW5ndWxhciBmb3JtLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdmFyIHNpbmd1bGFyX3J1bGVzID0gW1xuXG4gICAgLy8gZG8gbm90IHJlcGxhY2UgaWYgaXRzIGFscmVhZHkgYSBzaW5ndWxhciB3b3JkXG4gICAgWyByZWdleC5zaW5ndWxhci5tYW4gICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5wZXJzb24gIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jaGlsZCAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5veCAgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5heGlzICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5vY3RvcHVzIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hbGlhcyAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zdW1tb25zIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idXMgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5idWZmYWxvIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50aXVtICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zaXMgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mZmUgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5oaXZlICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hZWlvdXl5IF0sXG4gICAgWyByZWdleC5zaW5ndWxhci54ICAgICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tYXRyaXggIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tb3VzZSAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mb290ICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50b290aCAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nb29zZSAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5xdWl6ICAgIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci53aGVyZWFzIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5jcml0ZXJpb24gXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmdlbnVzIF0sXG5cbiAgICAvLyBvcmlnaW5hbCBydWxlXG4gICAgWyByZWdleC5wbHVyYWwubWVuICAgICAgLCAnJDFhbicgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5wZW9wbGUgICAsICckMXJzb24nIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY2hpbGRyZW4gLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2VuZXJhICAgLCAnZ2VudXMnXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5jcml0ZXJpYSAsICckMW9uJ10sXG4gICAgWyByZWdleC5wbHVyYWwudGlhICAgICAgLCAnJDF1bScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hbmFseXNlcyAsICckMSQyc2lzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmhpdmVzICAgICwgJyQxdmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuY3VydmVzICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubHJ2ZXMgICAgLCAnJDFmJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmF2ZXMgICAgICwgJyQxdmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZm92ZXMgICAgLCAnJDFmZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5tb3ZpZXMgICAsICckMW92aWUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWVpb3V5aWVzLCAnJDF5JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNlcmllcyAgICwgJyQxZXJpZXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwueGVzICAgICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWljZSAgICAgLCAnJDFvdXNlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmJ1c2VzICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9lcyAgICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNob2VzICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXNlcyAgICwgJyQxaXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwub2N0b3BpICAgLCAnJDF1cycgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hbGlhc2VzICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zdW1tb25zZXMsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5veGVuICAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5tYXRyaWNlcyAsICckMWl4JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnZlcnRpY2VzICwgJyQxZXgnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZmVldCAgICAgLCAnZm9vdCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC50ZWV0aCAgICAsICd0b290aCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5nZWVzZSAgICAsICdnb29zZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5xdWl6emVzICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC53aGVyZWFzZXMsICckMScgXSxcblxuICAgIFsgcmVnZXgucGx1cmFsLnNzLCAnc3MnIF0sXG4gICAgWyByZWdleC5wbHVyYWwucyAsICcnIF1cbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoaXMgaXMgYSBsaXN0IG9mIHdvcmRzIHRoYXQgc2hvdWxkIG5vdCBiZSBjYXBpdGFsaXplZCBmb3IgdGl0bGUgY2FzZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBub25fdGl0bGVjYXNlZF93b3JkcyA9IFtcbiAgICAnYW5kJywgJ29yJywgJ25vcicsICdhJywgJ2FuJywgJ3RoZScsICdzbycsICdidXQnLCAndG8nLCAnb2YnLCAnYXQnLCdieScsXG4gICAgJ2Zyb20nLCAnaW50bycsICdvbicsICdvbnRvJywgJ29mZicsICdvdXQnLCAnaW4nLCAnb3ZlcicsICd3aXRoJywgJ2ZvcidcbiAgXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoZXNlIGFyZSByZWd1bGFyIGV4cHJlc3Npb25zIHVzZWQgZm9yIGNvbnZlcnRpbmcgYmV0d2VlbiBTdHJpbmcgZm9ybWF0cy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBpZF9zdWZmaXggICAgICAgICA9IG5ldyBSZWdFeHAoICcoX2lkc3xfaWQpJCcsICdnJyApO1xuICB2YXIgdW5kZXJiYXIgICAgICAgICAgPSBuZXcgUmVnRXhwKCAnXycsICdnJyApO1xuICB2YXIgc3BhY2Vfb3JfdW5kZXJiYXIgPSBuZXcgUmVnRXhwKCAnW1xcIF9dJywgJ2cnICk7XG4gIHZhciB1cHBlcmNhc2UgICAgICAgICA9IG5ldyBSZWdFeHAoICcoW0EtWl0pJywgJ2cnICk7XG4gIHZhciB1bmRlcmJhcl9wcmVmaXggICA9IG5ldyBSZWdFeHAoICdeXycgKTtcblxuICB2YXIgaW5mbGVjdG9yID0ge1xuXG4gIC8qKlxuICAgKiBBIGhlbHBlciBtZXRob2QgdGhhdCBhcHBsaWVzIHJ1bGVzIGJhc2VkIHJlcGxhY2VtZW50IHRvIGEgU3RyaW5nLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBTdHJpbmcgdG8gbW9kaWZ5IGFuZCByZXR1cm4gYmFzZWQgb24gdGhlIHBhc3NlZCBydWxlcy5cbiAgICogQHBhcmFtIHtBcnJheTogW1JlZ0V4cCwgU3RyaW5nXX0gcnVsZXMgUmVnZXhwIHRvIG1hdGNoIHBhaXJlZCB3aXRoIFN0cmluZyB0byB1c2UgZm9yIHJlcGxhY2VtZW50XG4gICAqIEBwYXJhbSB7QXJyYXk6IFtTdHJpbmddfSBza2lwIFN0cmluZ3MgdG8gc2tpcCBpZiB0aGV5IG1hdGNoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvdmVycmlkZSBTdHJpbmcgdG8gcmV0dXJuIGFzIHRob3VnaCB0aGlzIG1ldGhvZCBzdWNjZWVkZWQgKHVzZWQgdG8gY29uZm9ybSB0byBBUElzKVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gcGFzc2VkIFN0cmluZyBtb2RpZmllZCBieSBwYXNzZWQgcnVsZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB0aGlzLl9hcHBseV9ydWxlcyggJ2Nvd3MnLCBzaW5ndWxhcl9ydWxlcyApOyAvLyA9PT0gJ2NvdydcbiAgICovXG4gICAgX2FwcGx5X3J1bGVzIDogZnVuY3Rpb24gKCBzdHIsIHJ1bGVzLCBza2lwLCBvdmVycmlkZSApe1xuICAgICAgaWYoIG92ZXJyaWRlICl7XG4gICAgICAgIHN0ciA9IG92ZXJyaWRlO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHZhciBpZ25vcmUgPSAoIGluZmxlY3Rvci5pbmRleE9mKCBza2lwLCBzdHIudG9Mb3dlckNhc2UoKSkgPiAtMSApO1xuXG4gICAgICAgIGlmKCAhaWdub3JlICl7XG4gICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgIHZhciBqID0gcnVsZXMubGVuZ3RoO1xuXG4gICAgICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgICAgIGlmKCBzdHIubWF0Y2goIHJ1bGVzWyBpIF1bIDAgXSkpe1xuICAgICAgICAgICAgICBpZiggcnVsZXNbIGkgXVsgMSBdICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSggcnVsZXNbIGkgXVsgMCBdLCBydWxlc1sgaSBdWyAxIF0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGxldHMgdXMgZGV0ZWN0IGlmIGFuIEFycmF5IGNvbnRhaW5zIGEgZ2l2ZW4gZWxlbWVudC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtBcnJheX0gYXJyIFRoZSBzdWJqZWN0IGFycmF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gaXRlbSBPYmplY3QgdG8gbG9jYXRlIGluIHRoZSBBcnJheS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZyb21faW5kZXggU3RhcnRzIGNoZWNraW5nIGZyb20gdGhpcyBwb3NpdGlvbiBpbiB0aGUgQXJyYXkuKG9wdGlvbmFsKVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJlX2Z1bmMgRnVuY3Rpb24gdXNlZCB0byBjb21wYXJlIEFycmF5IGl0ZW0gdnMgcGFzc2VkIGl0ZW0uKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm4gaW5kZXggcG9zaXRpb24gaW4gdGhlIEFycmF5IG9mIHRoZSBwYXNzZWQgaXRlbS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmluZGV4T2YoWyAnaGknLCd0aGVyZScgXSwgJ2d1eXMnICk7IC8vID09PSAtMVxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmRleE9mKFsgJ2hpJywndGhlcmUnIF0sICdoaScgKTsgLy8gPT09IDBcbiAgICovXG4gICAgaW5kZXhPZiA6IGZ1bmN0aW9uICggYXJyLCBpdGVtLCBmcm9tX2luZGV4LCBjb21wYXJlX2Z1bmMgKXtcbiAgICAgIGlmKCAhZnJvbV9pbmRleCApe1xuICAgICAgICBmcm9tX2luZGV4ID0gLTE7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgdmFyIGkgICAgID0gZnJvbV9pbmRleDtcbiAgICAgIHZhciBqICAgICA9IGFyci5sZW5ndGg7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIGlmKCBhcnJbIGkgXSAgPT09IGl0ZW0gfHwgY29tcGFyZV9mdW5jICYmIGNvbXBhcmVfZnVuYyggYXJyWyBpIF0sIGl0ZW0gKSl7XG4gICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHBsdXJhbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHBsdXJhbCBPdmVycmlkZXMgbm9ybWFsIG91dHB1dCB3aXRoIHNhaWQgU3RyaW5nLihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gU2luZ3VsYXIgRW5nbGlzaCBsYW5ndWFnZSBub3VucyBhcmUgcmV0dXJuZWQgaW4gcGx1cmFsIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdwZXJzb24nICk7IC8vID09PSAncGVvcGxlJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdvY3RvcHVzJyApOyAvLyA9PT0gJ29jdG9waSdcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAnSGF0JyApOyAvLyA9PT0gJ0hhdHMnXG4gICAqICAgICBpbmZsZWN0aW9uLnBsdXJhbGl6ZSggJ3BlcnNvbicsICdndXlzJyApOyAvLyA9PT0gJ2d1eXMnXG4gICAqL1xuICAgIHBsdXJhbGl6ZSA6IGZ1bmN0aW9uICggc3RyLCBwbHVyYWwgKXtcbiAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHBsdXJhbF9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHBsdXJhbCApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgc2luZ3VsYXJpemF0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzaW5ndWxhciBPdmVycmlkZXMgbm9ybWFsIG91dHB1dCB3aXRoIHNhaWQgU3RyaW5nLihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gUGx1cmFsIEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ3Blb3BsZScgKTsgLy8gPT09ICdwZXJzb24nXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnb2N0b3BpJyApOyAvLyA9PT0gJ29jdG9wdXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnSGF0cycgKTsgLy8gPT09ICdIYXQnXG4gICAqICAgICBpbmZsZWN0aW9uLnNpbmd1bGFyaXplKCAnZ3V5cycsICdwZXJzb24nICk7IC8vID09PSAncGVyc29uJ1xuICAgKi9cbiAgICBzaW5ndWxhcml6ZSA6IGZ1bmN0aW9uICggc3RyLCBzaW5ndWxhciApe1xuICAgICAgcmV0dXJuIGluZmxlY3Rvci5fYXBwbHlfcnVsZXMoIHN0ciwgc2luZ3VsYXJfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBzaW5ndWxhciApO1xuICAgIH0sXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiB3aWxsIHBsdXJhbGl6ZSBvciBzaW5ndWxhcmxpemUgYSBTdHJpbmcgYXBwcm9wcmlhdGVseSBiYXNlZCBvbiBhbiBpbnRlZ2VyIHZhbHVlXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgVGhlIG51bWJlciB0byBiYXNlIHBsdXJhbGl6YXRpb24gb2ZmIG9mLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2luZ3VsYXIgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwbHVyYWwgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHRoZSBwbHVyYWwgb3Igc2luZ3VsYXIgZm9ybSBiYXNlZCBvbiB0aGUgY291bnQuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVvcGxlJyAxICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnb2N0b3BpJyAxICk7IC8vID09PSAnb2N0b3B1cydcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ0hhdHMnIDEgKTsgLy8gPT09ICdIYXQnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdndXlzJywgMSAsICdwZXJzb24nICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVyc29uJywgMiApOyAvLyA9PT0gJ3Blb3BsZSdcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ29jdG9wdXMnLCAyICk7IC8vID09PSAnb2N0b3BpJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnSGF0JywgMiApOyAvLyA9PT0gJ0hhdHMnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdwZXJzb24nLCAyLCBudWxsLCAnZ3V5cycgKTsgLy8gPT09ICdndXlzJ1xuICAgKi9cbiAgICBpbmZsZWN0IDogZnVuY3Rpb24gKCBzdHIsIGNvdW50LCBzaW5ndWxhciwgcGx1cmFsICl7XG4gICAgICBjb3VudCA9IHBhcnNlSW50KCBjb3VudCwgMTAgKTtcblxuICAgICAgaWYoIGlzTmFOKCBjb3VudCApKSByZXR1cm4gc3RyO1xuXG4gICAgICBpZiggY291bnQgPT09IDAgfHwgY291bnQgPiAxICl7XG4gICAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHBsdXJhbF9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHBsdXJhbCApO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHNpbmd1bGFyX3J1bGVzLCB1bmNvdW50YWJsZV93b3Jkcywgc2luZ3VsYXIgKTtcbiAgICAgIH1cbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNhbWVsaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGxvd19maXJzdF9sZXR0ZXIgRGVmYXVsdCBpcyB0byBjYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHJlc3VsdHMuKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIGxvd2VyY2FzZSBpdC5cbiAgICogQHJldHVybnMge1N0cmluZ30gTG93ZXIgY2FzZSB1bmRlcnNjb3JlZCB3b3JkcyB3aWxsIGJlIHJldHVybmVkIGluIGNhbWVsIGNhc2UuXG4gICAqICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbGx5ICcvJyBpcyB0cmFuc2xhdGVkIHRvICc6OidcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNhbWVsaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2VQcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5jYW1lbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlUHJvcGVydGllcydcbiAgICovXG4gICAgY2FtZWxpemUgOiBmdW5jdGlvbiAoIHN0ciwgbG93X2ZpcnN0X2xldHRlciApe1xuICAgICAgdmFyIHN0cl9wYXRoID0gc3RyLnNwbGl0KCAnLycgKTtcbiAgICAgIHZhciBpICAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICAgPSBzdHJfcGF0aC5sZW5ndGg7XG4gICAgICB2YXIgc3RyX2FyciwgaW5pdF94LCBrLCBsLCBmaXJzdDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgc3RyX2FyciA9IHN0cl9wYXRoWyBpIF0uc3BsaXQoICdfJyApO1xuICAgICAgICBrICAgICAgID0gMDtcbiAgICAgICAgbCAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuXG4gICAgICAgIGZvciggOyBrIDwgbDsgaysrICl7XG4gICAgICAgICAgaWYoIGsgIT09IDAgKXtcbiAgICAgICAgICAgIHN0cl9hcnJbIGsgXSA9IHN0cl9hcnJbIGsgXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZpcnN0ID0gc3RyX2FyclsgayBdLmNoYXJBdCggMCApO1xuICAgICAgICAgIGZpcnN0ID0gbG93X2ZpcnN0X2xldHRlciAmJiBpID09PSAwICYmIGsgPT09IDBcbiAgICAgICAgICAgID8gZmlyc3QudG9Mb3dlckNhc2UoKSA6IGZpcnN0LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgc3RyX2FyclsgayBdID0gZmlyc3QgKyBzdHJfYXJyWyBrIF0uc3Vic3RyaW5nKCAxICk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX2Fyci5qb2luKCAnJyApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyX3BhdGguam9pbiggJzo6JyApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdW5kZXJzY29yZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbF91cHBlcl9jYXNlIERlZmF1bHQgaXMgdG8gbG93ZXJjYXNlIGFuZCBhZGQgdW5kZXJzY29yZSBwcmVmaXguKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIHJldHVybiBhcyBlbnRlcmVkLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBDYW1lbCBjYXNlZCB3b3JkcyBhcmUgcmV0dXJuZWQgYXMgbG93ZXIgY2FzZWQgYW5kIHVuZGVyc2NvcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxseSAnOjonIGlzIHRyYW5zbGF0ZWQgdG8gJy8nLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ01lc3NhZ2VQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2VfcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ21lc3NhZ2VQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2VfcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udW5kZXJzY29yZSggJ01QJywgdHJ1ZSApOyAvLyA9PT0gJ01QJ1xuICAgKi9cbiAgICB1bmRlcnNjb3JlIDogZnVuY3Rpb24gKCBzdHIsIGFsbF91cHBlcl9jYXNlICl7XG4gICAgICBpZiggYWxsX3VwcGVyX2Nhc2UgJiYgc3RyID09PSBzdHIudG9VcHBlckNhc2UoKSkgcmV0dXJuIHN0cjtcblxuICAgICAgdmFyIHN0cl9wYXRoID0gc3RyLnNwbGl0KCAnOjonICk7XG4gICAgICB2YXIgaSAgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgID0gc3RyX3BhdGgubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX3BhdGhbIGkgXS5yZXBsYWNlKCB1cHBlcmNhc2UsICdfJDEnICk7XG4gICAgICAgIHN0cl9wYXRoWyBpIF0gPSBzdHJfcGF0aFsgaSBdLnJlcGxhY2UoIHVuZGVyYmFyX3ByZWZpeCwgJycgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9wYXRoLmpvaW4oICcvJyApLnRvTG93ZXJDYXNlKCk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBodW1hbml6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGxvd19maXJzdF9sZXR0ZXIgRGVmYXVsdCBpcyB0byBjYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHJlc3VsdHMuKG9wdGlvbmFsKVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3NpbmcgdHJ1ZSB3aWxsIGxvd2VyY2FzZSBpdC5cbiAgICogQHJldHVybnMge1N0cmluZ30gTG93ZXIgY2FzZSB1bmRlcnNjb3JlZCB3b3JkcyB3aWxsIGJlIHJldHVybmVkIGluIGh1bWFuaXplZCBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uaHVtYW5pemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5odW1hbml6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlIHByb3BlcnRpZXMnXG4gICAqL1xuICAgIGh1bWFuaXplIDogZnVuY3Rpb24gKCBzdHIsIGxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UoIGlkX3N1ZmZpeCwgJycgKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCB1bmRlcmJhciwgJyAnICk7XG5cbiAgICAgIGlmKCAhbG93X2ZpcnN0X2xldHRlciApe1xuICAgICAgICBzdHIgPSBpbmZsZWN0b3IuY2FwaXRhbGl6ZSggc3RyICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBjYXBpdGFsaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBBbGwgY2hhcmFjdGVycyB3aWxsIGJlIGxvd2VyIGNhc2UgYW5kIHRoZSBmaXJzdCB3aWxsIGJlIHVwcGVyLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uY2FwaXRhbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLmNhcGl0YWxpemUoICdtZXNzYWdlIHByb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnTWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBjYXBpdGFsaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICByZXR1cm4gc3RyLnN1YnN0cmluZyggMCwgMSApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyaW5nKCAxICk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMgaW4gdGhlIHN0cmluZy5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFJlcGxhY2VzIGFsbCBzcGFjZXMgb3IgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5kYXNoZXJpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnbWVzc2FnZS1wcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5kYXNoZXJpemUoICdNZXNzYWdlIFByb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZS1Qcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBkYXNoZXJpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKCBzcGFjZV9vcl91bmRlcmJhciwgJy0nICk7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0aXRsZWl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBDYXBpdGFsaXplcyB3b3JkcyBhcyB5b3Ugd291bGQgZm9yIGEgYm9vayB0aXRsZS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnRpdGxlaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UgUHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24udGl0bGVpemUoICdtZXNzYWdlIHByb3BlcnRpZXMgdG8ga2VlcCcgKTsgLy8gPT09ICdNZXNzYWdlIFByb3BlcnRpZXMgdG8gS2VlcCdcbiAgICovXG4gICAgdGl0bGVpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgc3RyICAgICAgICAgPSBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCB1bmRlcmJhciwgJyAnICk7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJyAnICk7XG4gICAgICB2YXIgaSAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuICAgICAgdmFyIGQsIGssIGw7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIGQgPSBzdHJfYXJyWyBpIF0uc3BsaXQoICctJyApO1xuICAgICAgICBrID0gMDtcbiAgICAgICAgbCA9IGQubGVuZ3RoO1xuXG4gICAgICAgIGZvciggOyBrIDwgbDsgaysrKXtcbiAgICAgICAgICBpZiggaW5mbGVjdG9yLmluZGV4T2YoIG5vbl90aXRsZWNhc2VkX3dvcmRzLCBkWyBrIF0udG9Mb3dlckNhc2UoKSkgPCAwICl7XG4gICAgICAgICAgICBkWyBrIF0gPSBpbmZsZWN0b3IuY2FwaXRhbGl6ZSggZFsgayBdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdHJfYXJyWyBpIF0gPSBkLmpvaW4oICctJyApO1xuICAgICAgfVxuXG4gICAgICBzdHIgPSBzdHJfYXJyLmpvaW4oICcgJyApO1xuICAgICAgc3RyID0gc3RyLnN1YnN0cmluZyggMCwgMSApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyaW5nKCAxICk7XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBkZW1vZHVsaXplIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFJlbW92ZXMgbW9kdWxlIG5hbWVzIGxlYXZpbmcgb25seSBjbGFzcyBuYW1lcy4oUnVieSBzdHlsZSlcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmRlbW9kdWxpemUoICdNZXNzYWdlOjpCdXM6OlByb3BlcnRpZXMnICk7IC8vID09PSAnUHJvcGVydGllcydcbiAgICovXG4gICAgZGVtb2R1bGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJzo6JyApO1xuXG4gICAgICByZXR1cm4gc3RyX2Fyclsgc3RyX2Fyci5sZW5ndGggLSAxIF07XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyB0YWJsZWl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gY2FtZWwgY2FzZWQgd29yZHMgaW50byB0aGVpciB1bmRlcnNjb3JlZCBwbHVyYWwgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnRhYmxlaXplKCAnTWVzc2FnZUJ1c1Byb3BlcnR5JyApOyAvLyA9PT0gJ21lc3NhZ2VfYnVzX3Byb3BlcnRpZXMnXG4gICAqL1xuICAgIHRhYmxlaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci51bmRlcnNjb3JlKCBzdHIgKTtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5wbHVyYWxpemUoIHN0ciApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgY2xhc3NpZmljYXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gVW5kZXJzY29yZWQgcGx1cmFsIG5vdW5zIGJlY29tZSB0aGUgY2FtZWwgY2FzZWQgc2luZ3VsYXIgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNsYXNzaWZ5KCAnbWVzc2FnZV9idXNfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlQnVzUHJvcGVydHknXG4gICAqL1xuICAgIGNsYXNzaWZ5IDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5jYW1lbGl6ZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3Iuc2luZ3VsYXJpemUoIHN0ciApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgZm9yZWlnbiBrZXkgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBkcm9wX2lkX3ViYXIgRGVmYXVsdCBpcyB0byBzZXBlcmF0ZSBpZCB3aXRoIGFuIHVuZGVyYmFyIGF0IHRoZSBlbmQgb2YgdGhlIGNsYXNzIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5b3UgY2FuIHBhc3MgdHJ1ZSB0byBza2lwIGl0LihvcHRpb25hbClcbiAgICogQHJldHVybnMge1N0cmluZ30gVW5kZXJzY29yZWQgcGx1cmFsIG5vdW5zIGJlY29tZSB0aGUgY2FtZWwgY2FzZWQgc2luZ3VsYXIgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmZvcmVpZ25fa2V5KCAnTWVzc2FnZUJ1c1Byb3BlcnR5JyApOyAvLyA9PT0gJ21lc3NhZ2VfYnVzX3Byb3BlcnR5X2lkJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5mb3JlaWduX2tleSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScsIHRydWUgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0eWlkJ1xuICAgKi9cbiAgICBmb3JlaWduX2tleSA6IGZ1bmN0aW9uICggc3RyLCBkcm9wX2lkX3ViYXIgKXtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci5kZW1vZHVsaXplKCBzdHIgKTtcbiAgICAgIHN0ciA9IGluZmxlY3Rvci51bmRlcnNjb3JlKCBzdHIgKSArICgoIGRyb3BfaWRfdWJhciApID8gKCAnJyApIDogKCAnXycgKSkgKyAnaWQnO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgb3JkaW5hbGl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm4gYWxsIGZvdW5kIG51bWJlcnMgdGhlaXIgc2VxdWVuY2UgbGlrZSAnMjJuZCcuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5vcmRpbmFsaXplKCAndGhlIDEgcGl0Y2gnICk7IC8vID09PSAndGhlIDFzdCBwaXRjaCdcbiAgICovXG4gICAgb3JkaW5hbGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICB2YXIgc3RyX2FyciA9IHN0ci5zcGxpdCggJyAnICk7XG4gICAgICB2YXIgaSAgICAgICA9IDA7XG4gICAgICB2YXIgaiAgICAgICA9IHN0cl9hcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICB2YXIgayA9IHBhcnNlSW50KCBzdHJfYXJyWyBpIF0sIDEwICk7XG5cbiAgICAgICAgaWYoICFpc05hTiggayApKXtcbiAgICAgICAgICB2YXIgbHRkID0gc3RyX2FyclsgaSBdLnN1YnN0cmluZyggc3RyX2FyclsgaSBdLmxlbmd0aCAtIDIgKTtcbiAgICAgICAgICB2YXIgbGQgID0gc3RyX2FyclsgaSBdLnN1YnN0cmluZyggc3RyX2FyclsgaSBdLmxlbmd0aCAtIDEgKTtcbiAgICAgICAgICB2YXIgc3VmID0gJ3RoJztcblxuICAgICAgICAgIGlmKCBsdGQgIT0gJzExJyAmJiBsdGQgIT0gJzEyJyAmJiBsdGQgIT0gJzEzJyApe1xuICAgICAgICAgICAgaWYoIGxkID09PSAnMScgKXtcbiAgICAgICAgICAgICAgc3VmID0gJ3N0JztcbiAgICAgICAgICAgIH1lbHNlIGlmKCBsZCA9PT0gJzInICl7XG4gICAgICAgICAgICAgIHN1ZiA9ICduZCc7XG4gICAgICAgICAgICB9ZWxzZSBpZiggbGQgPT09ICczJyApe1xuICAgICAgICAgICAgICBzdWYgPSAncmQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHN0cl9hcnJbIGkgXSArPSBzdWY7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9hcnIuam9pbiggJyAnICk7XG4gICAgfSxcblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBwZXJmb3JtcyBtdWx0aXBsZSBpbmZsZWN0aW9uIG1ldGhvZHMgb24gYSBzdHJpbmdcbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyciBBbiBhcnJheSBvZiBpbmZsZWN0aW9uIG1ldGhvZHMuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50cmFuc2Zvcm0oICdhbGwgam9iJywgWyAncGx1cmFsaXplJywgJ2NhcGl0YWxpemUnLCAnZGFzaGVyaXplJyBdKTsgLy8gPT09ICdBbGwtam9icydcbiAgICovXG4gICAgdHJhbnNmb3JtIDogZnVuY3Rpb24gKCBzdHIsIGFyciApe1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgdmFyIGogPSBhcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDtpIDwgajsgaSsrICl7XG4gICAgICAgIHZhciBtZXRob2QgPSBhcnJbIGkgXTtcblxuICAgICAgICBpZiggaW5mbGVjdG9yLmhhc093blByb3BlcnR5KCBtZXRob2QgKSl7XG4gICAgICAgICAgc3RyID0gaW5mbGVjdG9yWyBtZXRob2QgXSggc3RyICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogQHB1YmxpY1xuICovXG4gIGluZmxlY3Rvci52ZXJzaW9uID0gJzEuMTIuMCc7XG5cbiAgcmV0dXJuIGluZmxlY3Rvcjtcbn0pKTtcbiJdfQ==
