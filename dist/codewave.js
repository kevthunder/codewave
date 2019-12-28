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
      throw 'Not Implemented';
    }
  }, {
    key: "textCharAt",
    value: function textCharAt(pos) {
      throw 'Not Implemented';
    }
  }, {
    key: "textLen",
    value: function textLen() {
      throw 'Not Implemented';
    }
  }, {
    key: "textSubstr",
    value: function textSubstr(start, end) {
      throw 'Not Implemented';
    }
  }, {
    key: "insertTextAt",
    value: function insertTextAt(text, pos) {
      throw 'Not Implemented';
    }
  }, {
    key: "spliceText",
    value: function spliceText(start, end, text) {
      throw 'Not Implemented';
    }
  }, {
    key: "getCursorPos",
    value: function getCursorPos() {
      throw 'Not Implemented';
    }
  }, {
    key: "setCursorPos",
    value: function setCursorPos(start) {
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      throw 'Not Implemented';
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
      throw 'Not Implemented';
    }
  }, {
    key: "getMultiSel",
    value: function getMultiSel() {
      throw 'Not Implemented';
    }
  }, {
    key: "canListenToChange",
    value: function canListenToChange() {
      return false;
    }
  }, {
    key: "addChangeListener",
    value: function addChangeListener(callback) {
      throw 'Not Implemented';
    }
  }, {
    key: "removeChangeListener",
    value: function removeChangeListener(callback) {
      throw 'Not Implemented';
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
        return (typeof console !== 'undefined' && console !== null ? console.log : void 0) != null && this.enabled && Logger.enabled;
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
        return this.str = f.str;
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
      return this.rawParams = parts.join(' ');
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
      var f = this._findClosingPos();

      if (f) {
        this.content = StringHelper.trimEmptyLine(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos));
        return this.str = this.codewave.editor.textSubstr(this.pos, f.pos + f.str.length);
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

      if (endPos >= max || (ref = this.codewave.editor.textSubstr(endPos, endPos + this.codewave.deco.length)) === ' ' || ref === '\n' || ref === '\r') {
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
        re1 = new RegExp("^\\s*".concat(ecl, "(?:").concat(ed, ")+\\s*(.*?)\\s*(?:").concat(ed, ")+").concat(ecr, "$"), 'gm');
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
      return this.sep = this.instance.getParam(['sep'], '\n');
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
      return this.lang = this.instance.getParam([1, 'lang', 'language']);
    }
  }, {
    key: "result",
    value: function result() {
      var emmet, ex, res;

      emmet = function () {
        var ref, ref1;

        if ((typeof window !== 'undefined' && window !== null ? window.emmet : void 0) != null) {
          return window.emmet;
        } else if ((typeof window !== 'undefined' && window !== null ? (ref = window.self) != null ? ref.emmet : void 0 : void 0) != null) {
          return window.self.emmet;
        } else if ((typeof window !== 'undefined' && window !== null ? (ref1 = window.global) != null ? ref1.emmet : void 0 : void 0) != null) {
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
      return this.parent.content += ((ref = this.parser.options.vars) != null ? ref[this.content] : void 0) || '';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmpzIiwibGliL0Nsb3NpbmdQcm9tcC5qcyIsImxpYi9DbWRGaW5kZXIuanMiLCJsaWIvQ21kSW5zdGFuY2UuanMiLCJsaWIvQ29kZXdhdmUuanMiLCJsaWIvQ29tbWFuZC5qcyIsImxpYi9Db250ZXh0LmpzIiwibGliL0VkaXRDbWRQcm9wLmpzIiwibGliL0VkaXRvci5qcyIsImxpYi9Mb2dnZXIuanMiLCJsaWIvT3B0aW9uT2JqZWN0LmpzIiwibGliL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsImxpYi9Qcm9jZXNzLmpzIiwibGliL1N0b3JhZ2UuanMiLCJsaWIvVGV4dEFyZWFFZGl0b3IuanMiLCJsaWIvVGV4dFBhcnNlci5qcyIsImxpYi9ib290c3RyYXAuanMiLCJsaWIvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwibGliL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXIuanMiLCJsaWIvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1BocENvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZC5qcyIsImxpYi9kZXRlY3RvcnMvRGV0ZWN0b3IuanMiLCJsaWIvZGV0ZWN0b3JzL0xhbmdEZXRlY3Rvci5qcyIsImxpYi9kZXRlY3RvcnMvUGFpckRldGVjdG9yLmpzIiwibGliL2VudHJ5LmpzIiwibGliL2hlbHBlcnMvQXJyYXlIZWxwZXIuanMiLCJsaWIvaGVscGVycy9Db21tb25IZWxwZXIuanMiLCJsaWIvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCJsaWIvaGVscGVycy9PcHRpb25hbFByb21pc2UuanMiLCJsaWIvaGVscGVycy9QYXRoSGVscGVyLmpzIiwibGliL2hlbHBlcnMvU3RyaW5nSGVscGVyLmpzIiwibGliL3Bvc2l0aW9uaW5nL1BhaXIuanMiLCJsaWIvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwibGliL3Bvc2l0aW9uaW5nL1Bvcy5qcyIsImxpYi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmpzIiwibGliL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwibGliL3Bvc2l0aW9uaW5nL1NpemUuanMiLCJsaWIvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwibGliL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCJsaWIvcG9zaXRpb25pbmcvV3JhcHBpbmcuanMiLCJsaWIvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIiwibGliL3N0cmluZ1BhcnNlcnMvQ29udGV4dC5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL0VzY2FwZUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9OYW1lZENvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlci5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL1N0cmluZ0NvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9WYXJpYWJsZUNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvaW5mbGVjdGlvbi9saWIvaW5mbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQ0EsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUFELENBQVAsQ0FBa0MsWUFBdkQ7O0FBRUEsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQVAsQ0FBaUMsV0FBckQ7O0FBRUEsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQVAsQ0FBOEIsSUFBM0M7O0FBRUEsSUFBSSxTQUFTO0FBQUE7QUFBQTtBQUNYLHFCQUFhLE9BQWIsRUFBb0M7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IEFycmF5SGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL0FycmF5SGVscGVyJykuQXJyYXlIZWxwZXJcblxuY29uc3QgUGFpciA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUGFpcicpLlBhaXJcblxudmFyIEJveEhlbHBlciA9IGNsYXNzIEJveEhlbHBlciB7XG4gIGNvbnN0cnVjdG9yIChjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIga2V5LCByZWYsIHZhbFxuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogdGhpcy5jb250ZXh0LmNvZGV3YXZlLmRlY28sXG4gICAgICBwYWQ6IDIsXG4gICAgICB3aWR0aDogNTAsXG4gICAgICBoZWlnaHQ6IDMsXG4gICAgICBvcGVuVGV4dDogJycsXG4gICAgICBjbG9zZVRleHQ6ICcnLFxuICAgICAgcHJlZml4OiAnJyxcbiAgICAgIHN1ZmZpeDogJycsXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9XG4gICAgcmVmID0gdGhpcy5kZWZhdWx0c1xuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWwgPSByZWZba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9uZSAodGV4dCkge1xuICAgIHZhciBrZXksIG9wdCwgcmVmLCB2YWxcbiAgICBvcHQgPSB7fVxuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHNcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV1cbiAgICAgIG9wdFtrZXldID0gdGhpc1trZXldXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0LCBvcHQpXG4gIH1cblxuICBkcmF3ICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRTZXAoKSArICdcXG4nICsgdGhpcy5saW5lcyh0ZXh0KSArICdcXG4nICsgdGhpcy5lbmRTZXAoKVxuICB9XG5cbiAgd3JhcENvbW1lbnQgKHN0cikge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnQoc3RyKVxuICB9XG5cbiAgc2VwYXJhdG9yICgpIHtcbiAgICB2YXIgbGVuXG4gICAgbGVuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMud3JhcENvbW1lbnQodGhpcy5kZWNvTGluZShsZW4pKVxuICB9XG5cbiAgc3RhcnRTZXAgKCkge1xuICAgIHZhciBsblxuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5vcGVuVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLndyYXBDb21tZW50KHRoaXMub3BlblRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSlcbiAgfVxuXG4gIGVuZFNlcCAoKSB7XG4gICAgdmFyIGxuXG4gICAgbG4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGggLSB0aGlzLmNsb3NlVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmNsb3NlVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKSArIHRoaXMuc3VmZml4XG4gIH1cblxuICBkZWNvTGluZSAobGVuKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCh0aGlzLmRlY28sIGxlbilcbiAgfVxuXG4gIHBhZGRpbmcgKCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoJyAnLCB0aGlzLnBhZClcbiAgfVxuXG4gIGxpbmVzICh0ZXh0ID0gJycsIHVwdG9IZWlnaHQgPSB0cnVlKSB7XG4gICAgdmFyIGwsIGxpbmVzLCB4XG4gICAgdGV4dCA9IHRleHQgfHwgJydcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdCgnXFxuJylcblxuICAgIGlmICh1cHRvSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIHJlZiwgcmVzdWx0c1xuICAgICAgICByZXN1bHRzID0gW11cblxuICAgICAgICBmb3IgKHggPSBpID0gMCwgcmVmID0gdGhpcy5oZWlnaHQ7IHJlZiA+PSAwID8gaSA8PSByZWYgOiBpID49IHJlZjsgeCA9IHJlZiA+PSAwID8gKytpIDogLS1pKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsaW5lc1t4XSB8fCAnJykpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIGxlbjEsIHJlc3VsdHNcbiAgICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuMSA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICAgIGwgPSBsaW5lc1tpXVxuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobCkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKVxuICAgIH1cbiAgfVxuXG4gIGxpbmUgKHRleHQgPSAnJykge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoJyAnLCB0aGlzLmluZGVudCkgKyB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpICsgdGV4dCArIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCgnICcsIHRoaXMud2lkdGggLSB0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyB0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbylcbiAgfVxuXG4gIGxlZnQgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpKVxuICB9XG5cbiAgcmlnaHQgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbylcbiAgfVxuXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50ICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpXG4gIH1cblxuICB0ZXh0Qm91bmRzICh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRUeHRTaXplKHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpXG4gIH1cblxuICBnZXRCb3hGb3JQb3MgKHBvcykge1xuICAgIHZhciBjbG9uZSwgY3VyTGVmdCwgZGVwdGgsIGVuZEZpbmQsIGxlZnQsIHBhaXIsIHBsYWNlaG9sZGVyLCByZXMsIHN0YXJ0RmluZFxuICAgIGRlcHRoID0gdGhpcy5nZXROZXN0ZWRMdmwocG9zLnN0YXJ0KVxuXG4gICAgaWYgKGRlcHRoID4gMCkge1xuICAgICAgbGVmdCA9IHRoaXMubGVmdCgpXG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LCBkZXB0aCAtIDEpXG4gICAgICBjbG9uZSA9IHRoaXMuY2xvbmUoKVxuICAgICAgcGxhY2Vob2xkZXIgPSAnIyMjUGxhY2VIb2xkZXIjIyMnXG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aFxuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSB0aGlzLmRlY28gKyB0aGlzLmRlY28gKyBwbGFjZWhvbGRlciArIHRoaXMuZGVjbyArIHRoaXMuZGVjb1xuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKVxuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwgJy4qJykpXG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLCBlbmRGaW5kLCB7XG4gICAgICAgIHZhbGlkTWF0Y2g6IG1hdGNoID0+IHtcbiAgICAgICAgICB2YXIgZiAvLyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuXG4gICAgICAgICAgZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpLCBbbGVmdCwgJ1xcbicsICdcXHInXSwgLTEpXG4gICAgICAgICAgcmV0dXJuIGYgPT0gbnVsbCB8fCBmLnN0ciAhPT0gbGVmdFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcywgdGhpcy5jb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG5cbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE5lc3RlZEx2bCAoaW5kZXgpIHtcbiAgICB2YXIgZGVwdGgsIGYsIGxlZnRcbiAgICBkZXB0aCA9IDBcbiAgICBsZWZ0ID0gdGhpcy5sZWZ0KClcblxuICAgIHdoaWxlICgoZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCwgW2xlZnQsICdcXG4nLCAnXFxyJ10sIC0xKSkgIT0gbnVsbCAmJiBmLnN0ciA9PT0gbGVmdCkge1xuICAgICAgaW5kZXggPSBmLnBvc1xuICAgICAgZGVwdGgrK1xuICAgIH1cblxuICAgIHJldHVybiBkZXB0aFxuICB9XG5cbiAgZ2V0T3B0RnJvbUxpbmUgKGxpbmUsIGdldFBhZCA9IHRydWUpIHtcbiAgICB2YXIgZW5kUG9zLCByRW5kLCByU3RhcnQsIHJlc0VuZCwgcmVzU3RhcnQsIHN0YXJ0UG9zXG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cCgnKFxcXFxzKikoJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28pKSArICcpKFxcXFxzKiknKVxuICAgIHJFbmQgPSBuZXcgUmVnRXhwKCcoXFxcXHMqKSgnICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLmRlY28pKSArICcpKFxcbnwkKScpXG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKVxuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKVxuXG4gICAgaWYgKHJlc1N0YXJ0ICE9IG51bGwgJiYgcmVzRW5kICE9IG51bGwpIHtcbiAgICAgIGlmIChnZXRQYWQpIHtcbiAgICAgICAgdGhpcy5wYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgsIHJlc0VuZFsxXS5sZW5ndGgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW5kZW50ID0gcmVzU3RhcnRbMV0ubGVuZ3RoXG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgdGhpcy5wYWRcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSB0aGlzLnBhZFxuICAgICAgdGhpcy53aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHJlZm9ybWF0TGluZXMgKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzKHRoaXMucmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zKSwgZmFsc2UpXG4gIH1cblxuICByZW1vdmVDb21tZW50ICh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMsIGVjbCwgZWNyLCBlZCwgZmxhZywgb3B0LCByZTEsIHJlMlxuXG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIG11bHRpbGluZTogdHJ1ZVxuICAgICAgfVxuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpXG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmRlY28pXG4gICAgICBmbGFnID0gb3B0aW9ucy5tdWx0aWxpbmUgPyAnZ20nIDogJydcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHN7MCwke3RoaXMucGFkfX1gLCBmbGFnKVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChgXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxcXFxzKiRgLCBmbGFnKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsICcnKS5yZXBsYWNlKHJlMiwgJycpXG4gICAgfVxuICB9XG59XG5leHBvcnRzLkJveEhlbHBlciA9IEJveEhlbHBlclxuIiwiXG5jb25zdCBQb3NDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJykuUG9zQ29sbGVjdGlvblxuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnKS5SZXBsYWNlbWVudFxuXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKCcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJylcblxudmFyIENsb3NpbmdQcm9tcCA9IGNsYXNzIENsb3NpbmdQcm9tcCB7XG4gIGNvbnN0cnVjdG9yIChjb2Rld2F2ZTEsIHNlbGVjdGlvbnMpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmUxXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbFxuICAgIHRoaXMuX3R5cGVkID0gbnVsbFxuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG4gICAgdGhpcy5uYkNoYW5nZXMgPSAwXG4gICAgdGhpcy5zZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucylcbiAgfVxuXG4gIGJlZ2luICgpIHtcbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlXG4gICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh0aGlzLmFkZENhcnJldHMoKSkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKSkge1xuICAgICAgICB0aGlzLnByb3h5T25DaGFuZ2UgPSAoY2ggPSBudWxsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25DaGFuZ2UoY2gpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSkucmVzdWx0KClcbiAgfVxuXG4gIGFkZENhcnJldHMgKCkge1xuICAgIHRoaXMucmVwbGFjZW1lbnRzID0gdGhpcy5zZWxlY3Rpb25zLndyYXAodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgJ1xcbicsICdcXG4nICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMpLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAuY2FycmV0VG9TZWwoKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHRoaXMucmVwbGFjZW1lbnRzKVxuICB9XG5cbiAgaW52YWxpZFR5cGVkICgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZWQgPSBudWxsXG4gIH1cblxuICBvbkNoYW5nZSAoY2ggPSBudWxsKSB7XG4gICAgdGhpcy5pbnZhbGlkVHlwZWQoKVxuXG4gICAgaWYgKHRoaXMuc2tpcEV2ZW50KGNoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5uYkNoYW5nZXMrK1xuXG4gICAgaWYgKHRoaXMuc2hvdWxkU3RvcCgpKSB7XG4gICAgICB0aGlzLnN0b3AoKVxuICAgICAgcmV0dXJuIHRoaXMuY2xlYW5DbG9zZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VtZSgpXG4gICAgfVxuICB9XG5cbiAgc2tpcEV2ZW50IChjaCkge1xuICAgIHJldHVybiBjaCAhPSBudWxsICYmIGNoLmNoYXJDb2RlQXQoMCkgIT09IDMyXG4gIH1cblxuICByZXN1bWUgKCkge31cblxuICBzaG91bGRTdG9wICgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlZCgpID09PSBmYWxzZSB8fCB0aGlzLnR5cGVkKCkuaW5kZXhPZignICcpICE9PSAtMVxuICB9XG5cbiAgY2xlYW5DbG9zZSAoKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCByZXBsLCByZXBsYWNlbWVudHMsIHJlcywgc2VsLCBzZWxlY3Rpb25zLCBzdGFydFxuICAgIHJlcGxhY2VtZW50cyA9IFtdXG4gICAgc2VsZWN0aW9ucyA9IHRoaXMuZ2V0U2VsZWN0aW9ucygpXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBzZWxlY3Rpb25zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBzZWwgPSBzZWxlY3Rpb25zW2pdXG5cbiAgICAgIGNvbnN0IHBvcyA9IHRoaXMud2hpdGhpbk9wZW5Cb3VuZHMoc2VsKVxuICAgICAgaWYgKHBvcykge1xuICAgICAgICBzdGFydCA9IHNlbFxuICAgICAgfSBlbHNlIGlmICgoZW5kID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHMoc2VsKSkgJiYgc3RhcnQgIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBlbmQud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikuaW5uZXJUZXh0KCkuc3BsaXQoJyAnKVswXVxuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGVuZC5pbm5lclN0YXJ0LCBlbmQuaW5uZXJFbmQsIHJlcylcbiAgICAgICAgcmVwbC5zZWxlY3Rpb25zID0gW3N0YXJ0XVxuICAgICAgICByZXBsYWNlbWVudHMucHVzaChyZXBsKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldE11bHRpU2VsKClcbiAgfVxuXG4gIHN0b3AgKCkge1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG5cbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID09PSB0aGlzKSB7XG4gICAgICB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm94eU9uQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpXG4gICAgfVxuICB9XG5cbiAgY2FuY2VsICgpIHtcbiAgICBpZiAodGhpcy50eXBlZCgpICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jYW5jZWxTZWxlY3Rpb25zKHRoaXMuZ2V0U2VsZWN0aW9ucygpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0b3AoKVxuICB9XG5cbiAgY2FuY2VsU2VsZWN0aW9ucyAoc2VsZWN0aW9ucykge1xuICAgIHZhciBlbmQsIGosIGxlbiwgcmVwbGFjZW1lbnRzLCBzZWwsIHN0YXJ0XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzdGFydCA9IG51bGxcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNlbGVjdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNlbCA9IHNlbGVjdGlvbnNbal1cblxuICAgICAgY29uc3QgcG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICBpZiAocG9zKSB7XG4gICAgICAgIHN0YXJ0ID0gcG9zXG4gICAgICB9IGVsc2UgaWYgKChlbmQgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSAmJiBzdGFydCAhPSBudWxsKSB7XG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ldyBSZXBsYWNlbWVudChzdGFydC5zdGFydCwgZW5kLmVuZCwgdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihzdGFydC5lbmQgKyAxLCBlbmQuc3RhcnQgLSAxKSkuc2VsZWN0Q29udGVudCgpKVxuICAgICAgICBzdGFydCA9IG51bGxcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB9XG5cbiAgdHlwZWQgKCkge1xuICAgIHZhciBjcG9zLCBpbm5lckVuZCwgaW5uZXJTdGFydFxuXG4gICAgaWYgKHRoaXMuX3R5cGVkID09IG51bGwpIHtcbiAgICAgIGNwb3MgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKVxuICAgICAgaW5uZXJTdGFydCA9IHRoaXMucmVwbGFjZW1lbnRzWzBdLnN0YXJ0ICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aFxuXG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5maW5kUHJldkJyYWtldChjcG9zLnN0YXJ0KSA9PT0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgJiYgKGlubmVyRW5kID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChpbm5lclN0YXJ0KSkgIT0gbnVsbCAmJiBpbm5lckVuZCA+PSBjcG9zLmVuZCkge1xuICAgICAgICB0aGlzLl90eXBlZCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoaW5uZXJTdGFydCwgaW5uZXJFbmQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl90eXBlZCA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3R5cGVkXG4gIH1cblxuICB3aGl0aGluT3BlbkJvdW5kcyAocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHRcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50c1xuXG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV1cbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuc3RhcnRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0c1xuXG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyAocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgcmVmLCByZXBsLCB0YXJnZXRQb3MsIHRhcmdldFRleHRcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50c1xuXG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV1cbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSlcbiAgICAgIHRhcmdldFRleHQgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMudHlwZWQoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0c1xuXG4gICAgICBpZiAodGFyZ2V0UG9zLmlubmVyQ29udGFpbnNQb3MocG9zKSAmJiB0YXJnZXRQb3Mud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikudGV4dCgpID09PSB0YXJnZXRUZXh0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHN0YXJ0UG9zQXQgKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiksIHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzBdLmVuZCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyICsgMSkpLndyYXBwZWRCeSh0aGlzLmNvZGV3YXZlLmJyYWtldHMsIHRoaXMuY29kZXdhdmUuYnJha2V0cylcbiAgfVxuXG4gIGVuZFBvc0F0IChpbmRleCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XS5zZWxlY3Rpb25zWzFdLnN0YXJ0ICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAyKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLCB0aGlzLmNvZGV3YXZlLmJyYWtldHMpXG4gIH1cbn1cbmV4cG9ydHMuQ2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wXG52YXIgU2ltdWxhdGVkQ2xvc2luZ1Byb21wID0gY2xhc3MgU2ltdWxhdGVkQ2xvc2luZ1Byb21wIGV4dGVuZHMgQ2xvc2luZ1Byb21wIHtcbiAgcmVzdW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zaW11bGF0ZVR5cGUoKVxuICB9XG5cbiAgc2ltdWxhdGVUeXBlICgpIHtcbiAgICBpZiAodGhpcy50aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdmFyIGN1ckNsb3NlLCByZXBsLCB0YXJnZXRUZXh0XG4gICAgICB0aGlzLmludmFsaWRUeXBlZCgpXG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLnR5cGVkKCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIGN1ckNsb3NlID0gdGhpcy53aGl0aGluQ2xvc2VCb3VuZHModGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXS5jb3B5KCkuYXBwbHlPZmZzZXQodGhpcy50eXBlZCgpLmxlbmd0aCkpXG5cbiAgICAgIGlmIChjdXJDbG9zZSkge1xuICAgICAgICByZXBsID0gbmV3IFJlcGxhY2VtZW50KGN1ckNsb3NlLnN0YXJ0LCBjdXJDbG9zZS5lbmQsIHRhcmdldFRleHQpXG5cbiAgICAgICAgaWYgKHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcikubmVjZXNzYXJ5KCkpIHtcbiAgICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhbcmVwbF0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uVHlwZVNpbXVsYXRlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uVHlwZVNpbXVsYXRlZCgpXG4gICAgICB9XG4gICAgfSwgMilcbiAgfVxuXG4gIHNraXBFdmVudCAoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBnZXRTZWxlY3Rpb25zICgpIHtcbiAgICByZXR1cm4gW3RoaXMuY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpLCB0aGlzLnJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zWzFdICsgdGhpcy50eXBlZCgpLmxlbmd0aF1cbiAgfVxuXG4gIHdoaXRoaW5DbG9zZUJvdW5kcyAocG9zKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV4dCwgcmVmLCByZXBsLCB0YXJnZXRQb3NcbiAgICByZWYgPSB0aGlzLnJlcGxhY2VtZW50c1xuXG4gICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgIHJlcGwgPSByZWZbaV1cbiAgICAgIHRhcmdldFBvcyA9IHRoaXMuZW5kUG9zQXQoaSlcbiAgICAgIG5leHQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KHRhcmdldFBvcy5pbm5lclN0YXJ0KVxuXG4gICAgICBpZiAobmV4dCAhPSBudWxsKSB7XG4gICAgICAgIHRhcmdldFBvcy5tb3ZlU3VmZml4KG5leHQpXG5cbiAgICAgICAgaWYgKHRhcmdldFBvcy5pbm5lckNvbnRhaW5zUG9zKHBvcykpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0UG9zXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuZXhwb3J0cy5TaW11bGF0ZWRDbG9zaW5nUHJvbXAgPSBTaW11bGF0ZWRDbG9zaW5nUHJvbXBcblxuQ2xvc2luZ1Byb21wLm5ld0ZvciA9IGZ1bmN0aW9uIChjb2Rld2F2ZSwgc2VsZWN0aW9ucykge1xuICBpZiAoY29kZXdhdmUuZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKSkge1xuICAgIHJldHVybiBuZXcgQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgU2ltdWxhdGVkQ2xvc2luZ1Byb21wKGNvZGV3YXZlLCBzZWxlY3Rpb25zKVxuICB9XG59XG4iLCJcbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbmNvbnN0IE5hbWVzcGFjZUhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInKS5OYW1lc3BhY2VIZWxwZXJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpLkNvbW1hbmRcblxudmFyIGluZGV4T2YgPSBbXS5pbmRleE9mXG5cbnZhciBDbWRGaW5kZXIgPSBjbGFzcyBDbWRGaW5kZXIge1xuICBjb25zdHJ1Y3RvciAobmFtZXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMsIGtleSwgdmFsXG5cbiAgICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXMgPSBbbmFtZXNdXG4gICAgfVxuXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICBuYW1lc3BhY2VzOiBbXSxcbiAgICAgIHBhcmVudENvbnRleHQ6IG51bGwsXG4gICAgICBjb250ZXh0OiBudWxsLFxuICAgICAgcm9vdDogQ29tbWFuZC5jbWRzLFxuICAgICAgbXVzdEV4ZWN1dGU6IHRydWUsXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWUsXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWUsXG4gICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfVxuICAgIHRoaXMubmFtZXMgPSBuYW1lc1xuICAgIHRoaXMucGFyZW50ID0gb3B0aW9ucy5wYXJlbnRcblxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldXG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcy5jb2Rld2F2ZSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJlbnRDb250ZXh0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5wYXJlbnQgPSB0aGlzLnBhcmVudENvbnRleHRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5uYW1lc3BhY2VzICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHRoaXMubmFtZXNwYWNlcylcbiAgICB9XG4gIH1cblxuICBmaW5kICgpIHtcbiAgICB0aGlzLnRyaWdnZXJEZXRlY3RvcnMoKVxuICAgIHRoaXMuY21kID0gdGhpcy5maW5kSW4odGhpcy5yb290KVxuICAgIHJldHVybiB0aGlzLmNtZFxuICB9IC8vICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4gIC8vICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiAgLy8gICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4gIC8vICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG5cbiAgZ2V0TmFtZXNXaXRoUGF0aHMgKCkge1xuICAgIHZhciBqLCBsZW4sIG5hbWUsIHBhdGhzLCByZWYsIHJlc3QsIHNwYWNlXG4gICAgcGF0aHMgPSB7fVxuICAgIHJlZiA9IHRoaXMubmFtZXNcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmFtZSA9IHJlZltqXTtcbiAgICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lKVxuXG4gICAgICBpZiAoc3BhY2UgIT0gbnVsbCAmJiAhKGluZGV4T2YuY2FsbCh0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCBzcGFjZSkgPj0gMCkpIHtcbiAgICAgICAgaWYgKCEoc3BhY2UgaW4gcGF0aHMpKSB7XG4gICAgICAgICAgcGF0aHNbc3BhY2VdID0gW11cbiAgICAgICAgfVxuXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGhzXG4gIH1cblxuICBhcHBseVNwYWNlT25OYW1lcyAobmFtZXNwYWNlKSB7XG4gICAgdmFyIHJlc3QsIHNwYWNlO1xuICAgIFtzcGFjZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuYW1lc3BhY2UsIHRydWUpXG4gICAgcmV0dXJuIHRoaXMubmFtZXMubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgY3VyX3Jlc3QsIGN1cl9zcGFjZTtcbiAgICAgIFtjdXJfc3BhY2UsIGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG5cbiAgICAgIGlmIChjdXJfc3BhY2UgIT0gbnVsbCAmJiBjdXJfc3BhY2UgPT09IHNwYWNlKSB7XG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdFxuICAgICAgfVxuXG4gICAgICBpZiAocmVzdCAhPSBudWxsKSB7XG4gICAgICAgIG5hbWUgPSByZXN0ICsgJzonICsgbmFtZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmFtZVxuICAgIH0pXG4gIH1cblxuICBnZXREaXJlY3ROYW1lcyAoKSB7XG4gICAgdmFyIG5cbiAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0c1xuICAgICAgcmVmID0gdGhpcy5uYW1lc1xuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBuID0gcmVmW2pdXG5cbiAgICAgICAgaWYgKG4uaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChuKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfS5jYWxsKHRoaXMpKVxuICB9XG5cbiAgdHJpZ2dlckRldGVjdG9ycyAoKSB7XG4gICAgdmFyIGNtZCwgZGV0ZWN0b3IsIGksIGosIGxlbiwgcG9zaWJpbGl0aWVzLCByZWYsIHJlcywgcmVzdWx0c1xuXG4gICAgaWYgKHRoaXMudXNlRGV0ZWN0b3JzKSB7XG4gICAgICB0aGlzLnVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICBwb3NpYmlsaXRpZXMgPSBbdGhpcy5yb290XS5jb25jYXQobmV3IENtZEZpbmRlcih0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpLCB7XG4gICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgICBpID0gMFxuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIHdoaWxlIChpIDwgcG9zaWJpbGl0aWVzLmxlbmd0aCkge1xuICAgICAgICBjbWQgPSBwb3NpYmlsaXRpZXNbaV1cbiAgICAgICAgcmVmID0gY21kLmRldGVjdG9yc1xuXG4gICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgIGRldGVjdG9yID0gcmVmW2pdXG4gICAgICAgICAgcmVzID0gZGV0ZWN0b3IuZGV0ZWN0KHRoaXMpXG5cbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcylcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtcbiAgICAgICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgICAgICBtdXN0RXhlY3V0ZTogZmFsc2UsXG4gICAgICAgICAgICAgIHVzZUZhbGxiYWNrczogZmFsc2VcbiAgICAgICAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRzLnB1c2goaSsrKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cbiAgfVxuXG4gIGZpbmRJbiAoY21kLCBwYXRoID0gbnVsbCkge1xuICAgIHZhciBiZXN0XG5cbiAgICBpZiAoY21kID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgYmVzdCA9IHRoaXMuYmVzdEluUG9zaWJpbGl0aWVzKHRoaXMuZmluZFBvc2liaWxpdGllcygpKVxuXG4gICAgaWYgKGJlc3QgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGJlc3RcbiAgICB9XG4gIH1cblxuICBmaW5kUG9zaWJpbGl0aWVzICgpIHtcbiAgICB2YXIgZGlyZWN0LCBmYWxsYmFjaywgaiwgaywgbGVuLCBsZW4xLCBuYW1lLCBuYW1lcywgbnNwYywgbnNwY05hbWUsIHBvc2liaWxpdGllcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZXN0LCBzcGFjZVxuXG4gICAgaWYgKHRoaXMucm9vdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0aGlzLnJvb3QuaW5pdCgpXG4gICAgcG9zaWJpbGl0aWVzID0gW11cblxuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyAocmVmMSA9IHJlZi5pbkluc3RhbmNlKSAhPSBudWxsID8gcmVmMS5jbWQgOiB2b2lkIDAgOiB2b2lkIDApID09PSB0aGlzLnJvb3QpIHtcbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZCgnaW5faW5zdGFuY2UnKSlcbiAgICB9XG5cbiAgICByZWYyID0gdGhpcy5nZXROYW1lc1dpdGhQYXRocygpXG5cbiAgICBmb3IgKHNwYWNlIGluIHJlZjIpIHtcbiAgICAgIG5hbWVzID0gcmVmMltzcGFjZV1cbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQodGhpcy5nZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZChzcGFjZSwgbmFtZXMpKVxuICAgIH1cblxuICAgIHJlZjMgPSB0aGlzLmNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuc3BjID0gcmVmM1tqXTtcbiAgICAgIFtuc3BjTmFtZSwgcmVzdF0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChuc3BjLCB0cnVlKVxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKG5zcGNOYW1lLCB0aGlzLmFwcGx5U3BhY2VPbk5hbWVzKG5zcGMpKSlcbiAgICB9XG5cbiAgICByZWY0ID0gdGhpcy5nZXREaXJlY3ROYW1lcygpXG5cbiAgICBmb3IgKGsgPSAwLCBsZW4xID0gcmVmNC5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgIG5hbWUgPSByZWY0W2tdXG4gICAgICBkaXJlY3QgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpXG5cbiAgICAgIGlmICh0aGlzLmNtZElzVmFsaWQoZGlyZWN0KSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudXNlRmFsbGJhY2tzKSB7XG4gICAgICBmYWxsYmFjayA9IHRoaXMucm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJylcblxuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChmYWxsYmFjaykpIHtcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZmFsbGJhY2spXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXNcbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzXG4gIH1cblxuICBnZXRQb3NpYmlsaXRpZXNGcm9tQ29tbWFuZCAoY21kTmFtZSwgbmFtZXMgPSB0aGlzLm5hbWVzKSB7XG4gICAgdmFyIGosIGxlbiwgbmV4dCwgbmV4dHMsIHBvc2liaWxpdGllc1xuICAgIHBvc2liaWxpdGllcyA9IFtdXG4gICAgbmV4dHMgPSB0aGlzLmdldENtZEZvbGxvd0FsaWFzKGNtZE5hbWUpXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBuZXh0cy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbmV4dCA9IG5leHRzW2pdXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtcbiAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICByb290OiBuZXh0XG4gICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc2liaWxpdGllc1xuICB9XG5cbiAgZ2V0Q21kRm9sbG93QWxpYXMgKG5hbWUpIHtcbiAgICB2YXIgY21kXG4gICAgY21kID0gdGhpcy5yb290LmdldENtZChuYW1lKVxuXG4gICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICBjbWQuaW5pdCgpXG5cbiAgICAgIGlmIChjbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbY21kLCBjbWQuZ2V0QWxpYXNlZCgpXVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gW2NtZF1cbiAgICB9XG5cbiAgICByZXR1cm4gW2NtZF1cbiAgfVxuXG4gIGNtZElzVmFsaWQgKGNtZCkge1xuICAgIGlmIChjbWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKGNtZC5uYW1lICE9PSAnZmFsbGJhY2snICYmIGluZGV4T2YuY2FsbCh0aGlzLmFuY2VzdG9ycygpLCBjbWQpID49IDApIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiAhdGhpcy5tdXN0RXhlY3V0ZSB8fCB0aGlzLmNtZElzRXhlY3V0YWJsZShjbWQpXG4gIH1cblxuICBhbmNlc3RvcnMgKCkge1xuICAgIHZhciByZWZcblxuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyByZWYuaW5JbnN0YW5jZSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICB9XG5cbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGNtZElzRXhlY3V0YWJsZSAoY21kKSB7XG4gICAgdmFyIG5hbWVzXG4gICAgbmFtZXMgPSB0aGlzLmdldERpcmVjdE5hbWVzKClcblxuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgIH1cbiAgfVxuXG4gIGNtZFNjb3JlIChjbWQpIHtcbiAgICB2YXIgc2NvcmVcbiAgICBzY29yZSA9IGNtZC5kZXB0aFxuXG4gICAgaWYgKGNtZC5uYW1lID09PSAnZmFsbGJhY2snKSB7XG4gICAgICBzY29yZSAtPSAxMDAwXG4gICAgfVxuXG4gICAgcmV0dXJuIHNjb3JlXG4gIH1cblxuICBiZXN0SW5Qb3NpYmlsaXRpZXMgKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlXG5cbiAgICBpZiAocG9zcy5sZW5ndGggPiAwKSB7XG4gICAgICBiZXN0ID0gbnVsbFxuICAgICAgYmVzdFNjb3JlID0gbnVsbFxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBwb3NzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSBwb3NzW2pdXG4gICAgICAgIHNjb3JlID0gdGhpcy5jbWRTY29yZShwKVxuXG4gICAgICAgIGlmIChiZXN0ID09IG51bGwgfHwgc2NvcmUgPj0gYmVzdFNjb3JlKSB7XG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmVcbiAgICAgICAgICBiZXN0ID0gcFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiZXN0XG4gICAgfVxuICB9XG59XG5leHBvcnRzLkNtZEZpbmRlciA9IENtZEZpbmRlclxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBUZXh0UGFyc2VyID0gcmVxdWlyZSgnLi9UZXh0UGFyc2VyJykuVGV4dFBhcnNlclxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IE9wdGlvbmFsUHJvbWlzZSA9IHJlcXVpcmUoJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnKVxuXG52YXIgQ21kSW5zdGFuY2UgPSBjbGFzcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yIChjbWQxLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jbWQgPSBjbWQxXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dFxuICB9XG5cbiAgaW5pdCAoKSB7XG4gICAgaWYgKCEodGhpcy5pc0VtcHR5KCkgfHwgdGhpcy5pbml0ZWQpKSB7XG4gICAgICB0aGlzLmluaXRlZCA9IHRydWVcblxuICAgICAgdGhpcy5fZ2V0Q21kT2JqKClcblxuICAgICAgdGhpcy5faW5pdFBhcmFtcygpXG5cbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqLmluaXQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzZXRQYXJhbSAobmFtZSwgdmFsKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZV0gPSB2YWxcbiAgfVxuXG4gIHB1c2hQYXJhbSAodmFsKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnB1c2godmFsKVxuICB9XG5cbiAgZ2V0Q29udGV4dCAoKSB7XG4gICAgaWYgKHRoaXMuY29udGV4dCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCBuZXcgQ29udGV4dCgpXG4gIH1cblxuICBnZXRGaW5kZXIgKGNtZE5hbWUpIHtcbiAgICB2YXIgZmluZGVyXG4gICAgZmluZGVyID0gdGhpcy5nZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgfVxuXG4gIF9nZXRDbWRPYmogKCkge1xuICAgIHZhciBjbWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNtZC5pbml0KClcbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZCgpIHx8IHRoaXMuY21kXG4gICAgICBjbWQuaW5pdCgpXG5cbiAgICAgIGlmIChjbWQuY2xzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKVxuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmpcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaW5pdFBhcmFtcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZWQgPSB0aGlzLmdldERlZmF1bHRzKClcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzICgpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGlzRW1wdHkgKCkge1xuICAgIHJldHVybiB0aGlzLmNtZCAhPSBudWxsXG4gIH1cblxuICByZXN1bHRJc0F2YWlsYWJsZSAoKSB7XG4gICAgdmFyIGFsaWFzZWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmoucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgfVxuXG4gICAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKVxuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY21kLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGdldERlZmF1bHRzICgpIHtcbiAgICB2YXIgYWxpYXNlZCwgcmVzXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgcmVzID0ge31cbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKVxuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCBhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgICB9XG5cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmNtZC5kZWZhdWx0cylcblxuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kT2JqLmdldERlZmF1bHRzKCkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZCAoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmdldEFsaWFzZWRGaW5hbCgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmFsaWFzZWRDbWQgfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIGdldEFsaWFzZWRGaW5hbCAoKSB7XG4gICAgdmFyIGFsaWFzZWRcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hbGlhc2VkRmluYWxDbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGlhc2VkRmluYWxDbWQgfHwgbnVsbFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbWQuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGFsaWFzZWQgPSB0aGlzLmNtZFxuXG4gICAgICAgIHdoaWxlIChhbGlhc2VkICE9IG51bGwgJiYgYWxpYXNlZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgICBhbGlhc2VkID0gYWxpYXNlZC5fYWxpYXNlZEZyb21GaW5kZXIodGhpcy5nZXRGaW5kZXIodGhpcy5hbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG5cbiAgICAgICAgICBpZiAodGhpcy5hbGlhc2VkQ21kID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuYWxpYXNlZENtZCA9IGFsaWFzZWQgfHwgZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgfHwgZmFsc2VcbiAgICAgICAgcmV0dXJuIGFsaWFzZWRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhbHRlckFsaWFzT2YgKGFsaWFzT2YpIHtcbiAgICByZXR1cm4gYWxpYXNPZlxuICB9XG5cbiAgZ2V0T3B0aW9ucyAoKSB7XG4gICAgdmFyIG9wdFxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRPcHRpb25zXG4gICAgICB9XG5cbiAgICAgIG9wdCA9IHRoaXMuY21kLl9vcHRpb25zRm9yQWxpYXNlZCh0aGlzLmdldEFsaWFzZWQoKSlcblxuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIHRoaXMuY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0aW9uIChrZXkpIHtcbiAgICB2YXIgb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKVxuXG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCAmJiBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICAgIH1cbiAgfVxuXG4gIGdldFBhcmFtIChuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBpLCBsZW4sIG4sIHJlZlxuXG4gICAgaWYgKChyZWYgPSB0eXBlb2YgbmFtZXMpID09PSAnc3RyaW5nJyB8fCByZWYgPT09ICdudW1iZXInKSB7XG4gICAgICBuYW1lcyA9IFtuYW1lc11cbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBuYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbiA9IG5hbWVzW2ldXG5cbiAgICAgIGlmICh0aGlzLm5hbWVkW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbl1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucGFyYW1zW25dICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1zW25dXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZlZhbFxuICB9XG5cbiAgZ2V0Qm9vbFBhcmFtIChuYW1lcywgZGVmVmFsID0gbnVsbCkge1xuICAgIHZhciBmYWxzZVZhbHMsIHZhbFxuICAgIGZhbHNlVmFscyA9IFsnJywgJzAnLCAnZmFsc2UnLCAnbm8nLCAnbm9uZScsIGZhbHNlLCBudWxsLCAwXVxuICAgIHZhbCA9IHRoaXMuZ2V0UGFyYW0obmFtZXMsIGRlZlZhbClcbiAgICByZXR1cm4gIWZhbHNlVmFscy5pbmNsdWRlcyh2YWwpXG4gIH1cblxuICBhbmNlc3RvckNtZHMgKCkge1xuICAgIHZhciByZWZcblxuICAgIGlmICgoKHJlZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG4gIH1cblxuICBhbmNlc3RvckNtZHNBbmRTZWxmICgpIHtcbiAgICByZXR1cm4gdGhpcy5hbmNlc3RvckNtZHMoKS5jb25jYXQoW3RoaXMuY21kXSlcbiAgfVxuXG4gIHJ1bkV4ZWN1dGVGdW5jdCAoKSB7XG4gICAgdmFyIGNtZFxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5leGVjdXRlKClcbiAgICAgIH1cblxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZFxuICAgICAgY21kLmluaXQoKVxuXG4gICAgICBpZiAoY21kLmV4ZWN1dGVGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZUZ1bmN0KHRoaXMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmF3UmVzdWx0ICgpIHtcbiAgICB2YXIgY21kXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdCgpXG4gICAgICB9XG5cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWRcbiAgICAgIGNtZC5pbml0KClcblxuICAgICAgaWYgKGNtZC5yZXN1bHRGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0RnVuY3QodGhpcylcbiAgICAgIH1cblxuICAgICAgaWYgKGNtZC5yZXN1bHRTdHIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0clxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCAoKSB7XG4gICAgdGhpcy5pbml0KClcblxuICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkodGhpcy5yYXdSZXN1bHQoKSkudGhlbihyZXMgPT4ge1xuICAgICAgICB2YXIgcGFyc2VyXG5cbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzID0gdGhpcy5mb3JtYXRJbmRlbnQocmVzKVxuXG4gICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwICYmIHRoaXMuZ2V0T3B0aW9uKCdwYXJzZScsIHRoaXMpKSB7XG4gICAgICAgICAgICBwYXJzZXIgPSB0aGlzLmdldFBhcnNlckZvclRleHQocmVzKVxuICAgICAgICAgICAgcmVzID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBhbHRlckZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2FsdGVyUmVzdWx0JywgdGhpcylcbiAgICAgICAgICBpZiAoYWx0ZXJGdW5jdCkge1xuICAgICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsIHRoaXMpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICB9XG4gICAgICB9KS5yZXN1bHQoKVxuICAgIH1cbiAgfVxuXG4gIGdldFBhcnNlckZvclRleHQgKHR4dCA9ICcnKSB7XG4gICAgdmFyIHBhcnNlclxuICAgIHBhcnNlciA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5uZXdJbnN0YW5jZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7XG4gICAgICBpbkluc3RhbmNlOiB0aGlzXG4gICAgfSlcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuICAgIHJldHVybiBwYXJzZXJcbiAgfVxuXG4gIGdldEluZGVudCAoKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuXG4gIGZvcm1hdEluZGVudCAodGV4dCkge1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcdC9nLCAnICAnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dFxuICAgIH1cbiAgfVxuXG4gIGFwcGx5SW5kZW50ICh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5pbmRlbnROb3RGaXJzdCh0ZXh0LCB0aGlzLmdldEluZGVudCgpLCAnICcpXG4gIH1cbn1cbmV4cG9ydHMuQ21kSW5zdGFuY2UgPSBDbWRJbnN0YW5jZVxuIiwiXG5jb25zdCBQcm9jZXNzID0gcmVxdWlyZSgnLi9Qcm9jZXNzJykuUHJvY2Vzc1xuXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgPSByZXF1aXJlKCcuL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZScpLlBvc2l0aW9uZWRDbWRJbnN0YW5jZVxuXG5jb25zdCBUZXh0UGFyc2VyID0gcmVxdWlyZSgnLi9UZXh0UGFyc2VyJykuVGV4dFBhcnNlclxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBMb2dnZXIgPSByZXF1aXJlKCcuL0xvZ2dlcicpLkxvZ2dlclxuXG5jb25zdCBQb3NDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJykuUG9zQ29sbGVjdGlvblxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IENsb3NpbmdQcm9tcCA9IHJlcXVpcmUoJy4vQ2xvc2luZ1Byb21wJykuQ2xvc2luZ1Byb21wXG5cbnZhciBDb2Rld2F2ZSA9IChmdW5jdGlvbiAoKSB7XG4gIGNsYXNzIENvZGV3YXZlIHtcbiAgICBjb25zdHJ1Y3RvciAoZWRpdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWxcbiAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yXG4gICAgICBDb2Rld2F2ZS5pbml0KClcbiAgICAgIHRoaXMubWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSdcbiAgICAgIHRoaXMudmFycyA9IHt9XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgYnJha2V0czogJ35+JyxcbiAgICAgICAgZGVjbzogJ34nLFxuICAgICAgICBjbG9zZUNoYXI6ICcvJyxcbiAgICAgICAgbm9FeGVjdXRlQ2hhcjogJyEnLFxuICAgICAgICBjYXJyZXRDaGFyOiAnfCcsXG4gICAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgICBpbkluc3RhbmNlOiBudWxsXG4gICAgICB9XG4gICAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnMucGFyZW50XG4gICAgICB0aGlzLm5lc3RlZCA9IHRoaXMucGFyZW50ICE9IG51bGwgPyB0aGlzLnBhcmVudC5uZXN0ZWQgKyAxIDogMFxuXG4gICAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgICB2YWwgPSBkZWZhdWx0c1trZXldXG5cbiAgICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gdGhpcy5wYXJlbnRba2V5XVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmVkaXRvciAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLmJpbmRlZFRvKHRoaXMpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMpXG5cbiAgICAgIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5pbkluc3RhbmNlLmNvbnRleHRcbiAgICAgIH1cblxuICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKClcbiAgICB9XG5cbiAgICBvbkFjdGl2YXRpb25LZXkgKCkge1xuICAgICAgdGhpcy5wcm9jZXNzID0gbmV3IFByb2Nlc3MoKVxuICAgICAgdGhpcy5sb2dnZXIubG9nKCdhY3RpdmF0aW9uIGtleScpXG4gICAgICByZXR1cm4gdGhpcy5ydW5BdEN1cnNvclBvcygpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzID0gbnVsbFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBydW5BdEN1cnNvclBvcyAoKSB7XG4gICAgICBpZiAodGhpcy5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkF0TXVsdGlQb3ModGhpcy5lZGl0b3IuZ2V0TXVsdGlTZWwoKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bkF0UG9zKHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJ1bkF0UG9zIChwb3MpIHtcbiAgICAgIGlmIChwb3MgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0N1cnNvciBQb3NpdGlvbiBpcyBlbXB0eScpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ1bkF0TXVsdGlQb3MoW3Bvc10pXG4gICAgfVxuXG4gICAgcnVuQXRNdWx0aVBvcyAobXVsdGlQb3MpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIGNtZFxuXG4gICAgICAgIGlmIChtdWx0aVBvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY21kID0gdGhpcy5jb21tYW5kT25Qb3MobXVsdGlQb3NbMF0uZW5kKVxuXG4gICAgICAgICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBjbWQuc2V0TXVsdGlQb3MobXVsdGlQb3MpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNtZC5pbml0KClcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhjbWQpXG4gICAgICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGUoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobXVsdGlQb3NbMF0uc3RhcnQgPT09IG11bHRpUG9zWzBdLmVuZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGRCcmFrZXRzKG11bHRpUG9zKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29tbWFuZE9uUG9zIChwb3MpIHtcbiAgICAgIHZhciBuZXh0LCBwcmV2XG5cbiAgICAgIGlmICh0aGlzLnByZWNlZGVkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5mb2xsb3dlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuY291bnRQcmV2QnJha2V0KHBvcykgJSAyID09PSAxKSB7XG4gICAgICAgIHByZXYgPSBwb3MgLSB0aGlzLmJyYWtldHMubGVuZ3RoXG4gICAgICAgIG5leHQgPSBwb3NcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnByZWNlZGVkQnlCcmFrZXRzKHBvcykgJiYgdGhpcy5jb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT09IDApIHtcbiAgICAgICAgICBwb3MgLT0gdGhpcy5icmFrZXRzLmxlbmd0aFxuICAgICAgICB9XG5cbiAgICAgICAgcHJldiA9IHRoaXMuZmluZFByZXZCcmFrZXQocG9zKVxuXG4gICAgICAgIGlmIChwcmV2ID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCA9IHRoaXMuZmluZE5leHRCcmFrZXQocG9zIC0gMSlcblxuICAgICAgICBpZiAobmV4dCA9PSBudWxsIHx8IHRoaXMuY291bnRQcmV2QnJha2V0KHByZXYpICUgMiAhPT0gMCkge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgcHJldiwgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihwcmV2LCBuZXh0ICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpXG4gICAgfVxuXG4gICAgbmV4dENtZCAoc3RhcnQgPSAwKSB7XG4gICAgICB2YXIgYmVnaW5uaW5nLCBmLCBwb3NcbiAgICAgIHBvcyA9IHN0YXJ0XG5cbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFt0aGlzLmJyYWtldHMsICdcXG4nXSkpIHtcbiAgICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGhcblxuICAgICAgICBpZiAoZi5zdHIgPT09IHRoaXMuYnJha2V0cykge1xuICAgICAgICAgIGlmICh0eXBlb2YgYmVnaW5uaW5nICE9PSAndW5kZWZpbmVkJyAmJiBiZWdpbm5pbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMsIGJlZ2lubmluZywgdGhpcy5lZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJlZ2lubmluZyA9IGYucG9zXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJlZ2lubmluZyA9IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGdldEVuY2xvc2luZ0NtZCAocG9zID0gMCkge1xuICAgICAgdmFyIGNsb3NpbmdQcmVmaXgsIGNwb3MsIHBcbiAgICAgIGNwb3MgPSBwb3NcbiAgICAgIGNsb3NpbmdQcmVmaXggPSB0aGlzLmJyYWtldHMgKyB0aGlzLmNsb3NlQ2hhclxuXG4gICAgICB3aGlsZSAoKHAgPSB0aGlzLmZpbmROZXh0KGNwb3MsIGNsb3NpbmdQcmVmaXgpKSAhPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGNtZCA9IHRoaXMuY29tbWFuZE9uUG9zKHAgKyBjbG9zaW5nUHJlZml4Lmxlbmd0aClcbiAgICAgICAgaWYgKGNtZCkge1xuICAgICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKClcblxuICAgICAgICAgIGlmIChjbWQucG9zIDwgcG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gY21kXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNwb3MgPSBwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGhcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHByZWNlZGVkQnlCcmFrZXRzIChwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGgsIHBvcykgPT09IHRoaXMuYnJha2V0c1xuICAgIH1cblxuICAgIGZvbGxvd2VkQnlCcmFrZXRzIChwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcywgcG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkgPT09IHRoaXMuYnJha2V0c1xuICAgIH1cblxuICAgIGNvdW50UHJldkJyYWtldCAoc3RhcnQpIHtcbiAgICAgIHZhciBpXG4gICAgICBpID0gMFxuXG4gICAgICB3aGlsZSAoKHN0YXJ0ID0gdGhpcy5maW5kUHJldkJyYWtldChzdGFydCkpICE9IG51bGwpIHtcbiAgICAgICAgaSsrXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpXG4gICAgfVxuXG4gICAgaXNFbmRMaW5lIChwb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcywgcG9zICsgMSkgPT09ICdcXG4nIHx8IHBvcyArIDEgPj0gdGhpcy5lZGl0b3IudGV4dExlbigpXG4gICAgfVxuXG4gICAgZmluZFByZXZCcmFrZXQgKHN0YXJ0KSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dEJyYWtldChzdGFydCwgLTEpXG4gICAgfVxuXG4gICAgZmluZE5leHRCcmFrZXQgKHN0YXJ0LCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZlxuICAgICAgZiA9IHRoaXMuZmluZEFueU5leHQoc3RhcnQsIFt0aGlzLmJyYWtldHMsICdcXG4nXSwgZGlyZWN0aW9uKVxuXG4gICAgICBpZiAoZiAmJiBmLnN0ciA9PT0gdGhpcy5icmFrZXRzKSB7XG4gICAgICAgIHJldHVybiBmLnBvc1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRQcmV2IChzdGFydCwgc3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dChzdGFydCwgc3RyaW5nLCAtMSlcbiAgICB9XG5cbiAgICBmaW5kTmV4dCAoc3RhcnQsIHN0cmluZywgZGlyZWN0aW9uID0gMSkge1xuICAgICAgdmFyIGZcbiAgICAgIGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbc3RyaW5nXSwgZGlyZWN0aW9uKVxuXG4gICAgICBpZiAoZikge1xuICAgICAgICByZXR1cm4gZi5wb3NcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kQW55TmV4dCAoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5maW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uKVxuICAgIH1cblxuICAgIGZpbmRNYXRjaGluZ1BhaXIgKHN0YXJ0UG9zLCBvcGVuaW5nLCBjbG9zaW5nLCBkaXJlY3Rpb24gPSAxKSB7XG4gICAgICB2YXIgZiwgbmVzdGVkLCBwb3NcbiAgICAgIHBvcyA9IHN0YXJ0UG9zXG4gICAgICBuZXN0ZWQgPSAwXG5cbiAgICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtjbG9zaW5nLCBvcGVuaW5nXSwgZGlyZWN0aW9uKSkge1xuICAgICAgICBwb3MgPSBmLnBvcyArIChkaXJlY3Rpb24gPiAwID8gZi5zdHIubGVuZ3RoIDogMClcblxuICAgICAgICBpZiAoZi5zdHIgPT09IChkaXJlY3Rpb24gPiAwID8gY2xvc2luZyA6IG9wZW5pbmcpKSB7XG4gICAgICAgICAgaWYgKG5lc3RlZCA+IDApIHtcbiAgICAgICAgICAgIG5lc3RlZC0tXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5lc3RlZCsrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBhZGRCcmFrZXRzIChwb3MpIHtcbiAgICAgIHZhciByZXBsYWNlbWVudHNcbiAgICAgIHBvcyA9IG5ldyBQb3NDb2xsZWN0aW9uKHBvcylcbiAgICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKHRoaXMuYnJha2V0cywgdGhpcy5icmFrZXRzKS5tYXAoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgcmV0dXJuIHIuc2VsZWN0Q29udGVudCgpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgICB9XG5cbiAgICBwcm9tcHRDbG9zaW5nQ21kIChzZWxlY3Rpb25zKSB7XG4gICAgICBpZiAodGhpcy5jbG9zaW5nUHJvbXAgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNsb3NpbmdQcm9tcC5zdG9wKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wLm5ld0Zvcih0aGlzLCBzZWxlY3Rpb25zKS5iZWdpbigpXG4gICAgfVxuXG4gICAgbmV3SW5zdGFuY2UgKGVkaXRvciwgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBDb2Rld2F2ZShlZGl0b3IsIG9wdGlvbnMpXG4gICAgfVxuXG4gICAgcGFyc2VBbGwgKHJlY3Vyc2l2ZSA9IHRydWUpIHtcbiAgICAgIHZhciBjbWQsIHBhcnNlciwgcG9zLCByZXNcblxuICAgICAgaWYgKHRoaXMubmVzdGVkID4gMTAwKSB7XG4gICAgICAgIHRocm93ICdJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvbidcbiAgICAgIH1cblxuICAgICAgcG9zID0gMFxuXG4gICAgICB3aGlsZSAoY21kID0gdGhpcy5uZXh0Q21kKHBvcykpIHtcbiAgICAgICAgcG9zID0gY21kLmdldEVuZFBvcygpXG4gICAgICAgIHRoaXMuZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpIC8vIGNvbnNvbGUubG9nKGNtZClcblxuICAgICAgICBjbWQuaW5pdCgpXG5cbiAgICAgICAgaWYgKHJlY3Vyc2l2ZSAmJiBjbWQuY29udGVudCAhPSBudWxsICYmIChjbWQuZ2V0Q21kKCkgPT0gbnVsbCB8fCAhY21kLmdldE9wdGlvbigncHJldmVudFBhcnNlQWxsJykpKSB7XG4gICAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge1xuICAgICAgICAgICAgcGFyZW50OiB0aGlzXG4gICAgICAgICAgfSlcbiAgICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICAgIH1cblxuICAgICAgICByZXMgPSBjbWQuZXhlY3V0ZSgpXG5cbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgaWYgKHJlcy50aGVuICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN5bmMgbmVzdGVkIGNvbW1hbmRzIGFyZSBub3Qgc3VwcG9ydGVkJylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY21kLnJlcGxhY2VFbmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcG9zID0gY21kLnJlcGxhY2VFbmRcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yUG9zKCkuZW5kXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdldFRleHQoKVxuICAgIH1cblxuICAgIGdldFRleHQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHQoKVxuICAgIH1cblxuICAgIGlzUm9vdCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQgPT0gbnVsbCAmJiAodGhpcy5pbkluc3RhbmNlID09IG51bGwgfHwgdGhpcy5pbkluc3RhbmNlLmZpbmRlciA9PSBudWxsKVxuICAgIH1cblxuICAgIGdldFJvb3QgKCkge1xuICAgICAgaWYgKHRoaXMuaXNSb290KCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0Um9vdCgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluSW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RmlsZVN5c3RlbSAoKSB7XG4gICAgICBpZiAodGhpcy5lZGl0b3IuZmlsZVN5c3RlbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lZGl0b3IuZmlsZVN5c3RlbVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldFJvb3QoKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUNhcnJldCAodHh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0eHQsIHRoaXMuY2FycmV0Q2hhcilcbiAgICB9XG5cbiAgICBnZXRDYXJyZXRQb3MgKHR4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRDYXJyZXRQb3ModHh0LCB0aGlzLmNhcnJldENoYXIpXG4gICAgfVxuXG4gICAgcmVnTWFya2VyIChmbGFncyA9ICdnJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm1hcmtlciksIGZsYWdzKVxuICAgIH1cblxuICAgIHJlbW92ZU1hcmtlcnMgKHRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UodGhpcy5yZWdNYXJrZXIoKSwgJycpXG4gICAgfVxuXG4gICAgc3RhdGljIGluaXQgKCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRlZCkge1xuICAgICAgICB0aGlzLmluaXRlZCA9IHRydWVcblxuICAgICAgICBDb21tYW5kLmluaXRDbWRzKClcblxuICAgICAgICByZXR1cm4gQ29tbWFuZC5sb2FkQ21kcygpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgO1xuICBDb2Rld2F2ZS5pbml0ZWQgPSBmYWxzZVxuICByZXR1cm4gQ29kZXdhdmVcbn0uY2FsbCh2b2lkIDApKVxuXG5leHBvcnRzLkNvZGV3YXZlID0gQ29kZXdhdmVcbiIsIlxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxuY29uc3QgU3RvcmFnZSA9IHJlcXVpcmUoJy4vU3RvcmFnZScpLlN0b3JhZ2VcblxuY29uc3QgTmFtZXNwYWNlSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcicpLk5hbWVzcGFjZUhlbHBlclxuXG52YXIgX29wdEtleVxuXG5fb3B0S2V5ID0gZnVuY3Rpb24gKGtleSwgZGljdCwgZGVmVmFsID0gbnVsbCkge1xuICAvLyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICBpZiAoa2V5IGluIGRpY3QpIHtcbiAgICByZXR1cm4gZGljdFtrZXldXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRlZlZhbFxuICB9XG59XG5cbnZhciBDb21tYW5kID0gKGZ1bmN0aW9uICgpIHtcbiAgY2xhc3MgQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUxLCBkYXRhMSA9IG51bGwsIHBhcmVudCA9IG51bGwpIHtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWUxXG4gICAgICB0aGlzLmRhdGEgPSBkYXRhMVxuICAgICAgdGhpcy5jbWRzID0gW11cbiAgICAgIHRoaXMuZGV0ZWN0b3JzID0gW11cbiAgICAgIHRoaXMuZXhlY3V0ZUZ1bmN0ID0gdGhpcy5yZXN1bHRGdW5jdCA9IHRoaXMucmVzdWx0U3RyID0gdGhpcy5hbGlhc09mID0gdGhpcy5jbHMgPSBudWxsXG4gICAgICB0aGlzLmFsaWFzZWQgPSBudWxsXG4gICAgICB0aGlzLmZ1bGxOYW1lID0gdGhpcy5uYW1lXG4gICAgICB0aGlzLmRlcHRoID0gMDtcbiAgICAgIFt0aGlzLl9wYXJlbnQsIHRoaXMuX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdXG4gICAgICB0aGlzLnNldFBhcmVudChwYXJlbnQpXG4gICAgICB0aGlzLmRlZmF1bHRzID0ge31cbiAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIG5hbWVUb1BhcmFtOiBudWxsLFxuICAgICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgICBiZWZvcmVFeGVjdXRlOiBudWxsLFxuICAgICAgICBhbHRlclJlc3VsdDogbnVsbCxcbiAgICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgICAgcmVwbGFjZUJveDogZmFsc2UsXG4gICAgICAgIGFsbG93ZWROYW1lZDogbnVsbFxuICAgICAgfVxuICAgICAgdGhpcy5vcHRpb25zID0ge31cbiAgICAgIHRoaXMuZmluYWxPcHRpb25zID0gbnVsbFxuICAgIH1cblxuICAgIHBhcmVudCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50XG4gICAgfVxuXG4gICAgc2V0UGFyZW50ICh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMuX3BhcmVudCAhPT0gdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gdmFsdWVcbiAgICAgICAgdGhpcy5mdWxsTmFtZSA9IHRoaXMuX3BhcmVudCAhPSBudWxsICYmIHRoaXMuX3BhcmVudC5uYW1lICE9IG51bGwgPyB0aGlzLl9wYXJlbnQuZnVsbE5hbWUgKyAnOicgKyB0aGlzLm5hbWUgOiB0aGlzLm5hbWVcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVwdGggPSB0aGlzLl9wYXJlbnQgIT0gbnVsbCAmJiB0aGlzLl9wYXJlbnQuZGVwdGggIT0gbnVsbCA/IHRoaXMuX3BhcmVudC5kZXB0aCArIDEgOiAwXG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCAoKSB7XG4gICAgICBpZiAoIXRoaXMuX2luaXRlZCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlXG4gICAgICAgIHRoaXMucGFyc2VEYXRhKHRoaXMuZGF0YSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQucmVtb3ZlQ21kKHRoaXMpXG4gICAgfVxuXG4gICAgaXNFZGl0YWJsZSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRTdHIgIT0gbnVsbCB8fCB0aGlzLmFsaWFzT2YgIT0gbnVsbFxuICAgIH1cblxuICAgIGlzRXhlY3V0YWJsZSAoKSB7XG4gICAgICB2YXIgYWxpYXNlZCwgaiwgbGVuLCBwLCByZWZcbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKVxuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgICAgfVxuXG4gICAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCcsICdjbHMnLCAnZXhlY3V0ZUZ1bmN0J11cblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSByZWZbal1cblxuICAgICAgICBpZiAodGhpc1twXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpc0V4ZWN1dGFibGVXaXRoTmFtZSAobmFtZSkge1xuICAgICAgdmFyIGFsaWFzT2YsIGFsaWFzZWQsIGNvbnRleHRcblxuICAgICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICAgIGFsaWFzT2YgPSB0aGlzLmFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJywgbmFtZSlcbiAgICAgICAgYWxpYXNlZCA9IHRoaXMuX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKGFsaWFzT2YpKVxuXG4gICAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5pc0V4ZWN1dGFibGUoKVxuICAgIH1cblxuICAgIHJlc3VsdElzQXZhaWxhYmxlICgpIHtcbiAgICAgIHZhciBhbGlhc2VkLCBqLCBsZW4sIHAsIHJlZlxuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpXG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgfVxuXG4gICAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCddXG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBwID0gcmVmW2pdXG5cbiAgICAgICAgaWYgKHRoaXNbcF0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgZ2V0RGVmYXVsdHMgKCkge1xuICAgICAgdmFyIGFsaWFzZWQsIHJlc1xuICAgICAgcmVzID0ge31cbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWQoKVxuXG4gICAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCBhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgICB9XG5cbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCB0aGlzLmRlZmF1bHRzKVxuICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIF9hbGlhc2VkRnJvbUZpbmRlciAoZmluZGVyKSB7XG4gICAgICBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2VcbiAgICAgIGZpbmRlci5tdXN0RXhlY3V0ZSA9IGZhbHNlXG4gICAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2VcbiAgICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gICAgfVxuXG4gICAgZ2V0QWxpYXNlZCAoKSB7XG4gICAgICB2YXIgY29udGV4dFxuXG4gICAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKHRoaXMuYWxpYXNPZikpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QWxpYXNlZE9yVGhpcyAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRBbGlhc2VkKCkgfHwgdGhpc1xuICAgIH1cblxuICAgIHNldE9wdGlvbnMgKGRhdGEpIHtcbiAgICAgIHZhciBrZXksIHJlc3VsdHMsIHZhbFxuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgICAgdmFsID0gZGF0YVtrZXldXG5cbiAgICAgICAgaWYgKGtleSBpbiB0aGlzLmRlZmF1bHRPcHRpb25zKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMub3B0aW9uc1trZXldID0gdmFsKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cbiAgICBfb3B0aW9uc0ZvckFsaWFzZWQgKGFsaWFzZWQpIHtcbiAgICAgIHZhciBvcHRcbiAgICAgIG9wdCA9IHt9XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5kZWZhdWx0T3B0aW9ucylcblxuICAgICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgYWxpYXNlZC5nZXRPcHRpb25zKCkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5vcHRpb25zKVxuICAgIH1cblxuICAgIGdldE9wdGlvbnMgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKVxuICAgIH1cblxuICAgIGdldE9wdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpXG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gICAgICB9XG4gICAgfVxuXG4gICAgaGVscCAoKSB7XG4gICAgICB2YXIgY21kXG4gICAgICBjbWQgPSB0aGlzLmdldENtZCgnaGVscCcpXG5cbiAgICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZURhdGEgKGRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGFcblxuICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLnJlc3VsdFN0ciA9IGRhdGFcbiAgICAgICAgdGhpcy5vcHRpb25zLnBhcnNlID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBlbHNlIGlmIChkYXRhICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEaWN0RGF0YShkYXRhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBwYXJzZURpY3REYXRhIChkYXRhKSB7XG4gICAgICB2YXIgZXhlY3V0ZSwgcmVzXG4gICAgICByZXMgPSBfb3B0S2V5KCdyZXN1bHQnLCBkYXRhKVxuXG4gICAgICBpZiAodHlwZW9mIHJlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnJlc3VsdEZ1bmN0ID0gcmVzXG4gICAgICB9IGVsc2UgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyID0gcmVzXG4gICAgICAgIHRoaXMub3B0aW9ucy5wYXJzZSA9IHRydWVcbiAgICAgIH1cblxuICAgICAgZXhlY3V0ZSA9IF9vcHRLZXkoJ2V4ZWN1dGUnLCBkYXRhKVxuXG4gICAgICBpZiAodHlwZW9mIGV4ZWN1dGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlRnVuY3QgPSBleGVjdXRlXG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWxpYXNPZiA9IF9vcHRLZXkoJ2FsaWFzT2YnLCBkYXRhKVxuICAgICAgdGhpcy5jbHMgPSBfb3B0S2V5KCdjbHMnLCBkYXRhKVxuICAgICAgdGhpcy5kZWZhdWx0cyA9IF9vcHRLZXkoJ2RlZmF1bHRzJywgZGF0YSwgdGhpcy5kZWZhdWx0cylcbiAgICAgIHRoaXMuc2V0T3B0aW9ucyhkYXRhKVxuXG4gICAgICBpZiAoJ2hlbHAnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLCBkYXRhLmhlbHAsIHRoaXMpKVxuICAgICAgfVxuXG4gICAgICBpZiAoJ2ZhbGxiYWNrJyBpbiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKCdmYWxsYmFjaycsIGRhdGEuZmFsbGJhY2ssIHRoaXMpKVxuICAgICAgfVxuXG4gICAgICBpZiAoJ2NtZHMnIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5hZGRDbWRzKGRhdGEuY21kcylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBhZGRDbWRzIChjbWRzKSB7XG4gICAgICB2YXIgZGF0YSwgbmFtZSwgcmVzdWx0c1xuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIGZvciAobmFtZSBpbiBjbWRzKSB7XG4gICAgICAgIGRhdGEgPSBjbWRzW25hbWVdXG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZENtZChuZXcgQ29tbWFuZChuYW1lLCBkYXRhLCB0aGlzKSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG4gICAgYWRkQ21kIChjbWQpIHtcbiAgICAgIHZhciBleGlzdHNcbiAgICAgIGV4aXN0cyA9IHRoaXMuZ2V0Q21kKGNtZC5uYW1lKVxuXG4gICAgICBpZiAoZXhpc3RzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbWQoZXhpc3RzKVxuICAgICAgfVxuXG4gICAgICBjbWQuc2V0UGFyZW50KHRoaXMpXG4gICAgICB0aGlzLmNtZHMucHVzaChjbWQpXG4gICAgICByZXR1cm4gY21kXG4gICAgfVxuXG4gICAgcmVtb3ZlQ21kIChjbWQpIHtcbiAgICAgIHZhciBpXG5cbiAgICAgIGlmICgoaSA9IHRoaXMuY21kcy5pbmRleE9mKGNtZCkpID4gLTEpIHtcbiAgICAgICAgdGhpcy5jbWRzLnNwbGljZShpLCAxKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY21kXG4gICAgfVxuXG4gICAgZ2V0Q21kIChmdWxsbmFtZSkge1xuICAgICAgdmFyIGNtZCwgaiwgbGVuLCBuYW1lLCByZWYsIHJlZjEsIHNwYWNlXG4gICAgICB0aGlzLmluaXQoKTtcbiAgICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSlcblxuICAgICAgaWYgKHNwYWNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIChyZWYgPSB0aGlzLmdldENtZChzcGFjZSkpICE9IG51bGwgPyByZWYuZ2V0Q21kKG5hbWUpIDogdm9pZCAwXG4gICAgICB9XG5cbiAgICAgIHJlZjEgPSB0aGlzLmNtZHNcblxuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmMS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBjbWQgPSByZWYxW2pdXG5cbiAgICAgICAgaWYgKGNtZC5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q21kRGF0YSAoZnVsbG5hbWUsIGRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldENtZChmdWxsbmFtZSwgbmV3IENvbW1hbmQoZnVsbG5hbWUuc3BsaXQoJzonKS5wb3AoKSwgZGF0YSkpXG4gICAgfVxuXG4gICAgc2V0Q21kIChmdWxsbmFtZSwgY21kKSB7XG4gICAgICB2YXIgbmFtZSwgbmV4dCwgc3BhY2U7XG4gICAgICBbc3BhY2UsIG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpXG5cbiAgICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICAgIG5leHQgPSB0aGlzLmdldENtZChzcGFjZSlcblxuICAgICAgICBpZiAobmV4dCA9PSBudWxsKSB7XG4gICAgICAgICAgbmV4dCA9IHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKHNwYWNlKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXh0LnNldENtZChuYW1lLCBjbWQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFkZENtZChjbWQpXG4gICAgICAgIHJldHVybiBjbWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZGREZXRlY3RvciAoZGV0ZWN0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmRldGVjdG9ycy5wdXNoKGRldGVjdG9yKVxuICAgIH1cblxuICAgIHN0YXRpYyBpbml0Q21kcyAoKSB7XG4gICAgICB2YXIgaiwgbGVuLCBwcm92aWRlciwgcmVmLCByZXN1bHRzXG4gICAgICBDb21tYW5kLmNtZHMgPSBuZXcgQ29tbWFuZChudWxsLCB7XG4gICAgICAgIGNtZHM6IHtcbiAgICAgICAgICBoZWxsbzoge1xuICAgICAgICAgICAgaGVscDogJ1wiSGVsbG8sIHdvcmxkIVwiIGlzIHR5cGljYWxseSBvbmUgb2YgdGhlIHNpbXBsZXN0IHByb2dyYW1zIHBvc3NpYmxlIGluXFxubW9zdCBwcm9ncmFtbWluZyBsYW5ndWFnZXMsIGl0IGlzIGJ5IHRyYWRpdGlvbiBvZnRlbiAoLi4uKSB1c2VkIHRvXFxudmVyaWZ5IHRoYXQgYSBsYW5ndWFnZSBvciBzeXN0ZW0gaXMgb3BlcmF0aW5nIGNvcnJlY3RseSAtd2lraXBlZGlhJyxcbiAgICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmVmID0gdGhpcy5wcm92aWRlcnNcbiAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcHJvdmlkZXIgPSByZWZbal1cbiAgICAgICAgcmVzdWx0cy5wdXNoKHByb3ZpZGVyLnJlZ2lzdGVyKENvbW1hbmQuY21kcykpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG4gICAgc3RhdGljIHNhdmVDbWQgKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSlcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNhdmVJblBhdGgoJ2NtZHMnLCBmdWxsbmFtZSwgZGF0YSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIGxvYWRDbWRzICgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIHNhdmVkQ21kc1xuICAgICAgICByZXR1cm4gc2F2ZWRDbWRzID0gdGhpcy5zdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgICAgfSkudGhlbihzYXZlZENtZHMgPT4ge1xuICAgICAgICB2YXIgZGF0YSwgZnVsbG5hbWUsIHJlc3VsdHNcblxuICAgICAgICBpZiAoc2F2ZWRDbWRzICE9IG51bGwpIHtcbiAgICAgICAgICByZXN1bHRzID0gW11cblxuICAgICAgICAgIGZvciAoZnVsbG5hbWUgaW4gc2F2ZWRDbWRzKSB7XG4gICAgICAgICAgICBkYXRhID0gc2F2ZWRDbWRzW2Z1bGxuYW1lXVxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyByZXNldFNhdmVkICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZSgnY21kcycsIHt9KVxuICAgIH1cblxuICAgIHN0YXRpYyBtYWtlVmFyQ21kIChuYW1lLCBiYXNlID0ge30pIHtcbiAgICAgIGJhc2UuZXhlY3V0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICB2YXIgcCwgdmFsXG4gICAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDBcblxuICAgICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHZhbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiYXNlXG4gICAgfVxuXG4gICAgc3RhdGljIG1ha2VCb29sVmFyQ21kIChuYW1lLCBiYXNlID0ge30pIHtcbiAgICAgIGJhc2UuZXhlY3V0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICB2YXIgcCwgdmFsXG4gICAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDBcblxuICAgICAgICBpZiAoISh2YWwgIT0gbnVsbCAmJiAodmFsID09PSAnMCcgfHwgdmFsID09PSAnZmFsc2UnIHx8IHZhbCA9PT0gJ25vJykpKSB7XG4gICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJhc2VcbiAgICB9XG4gIH1cblxuICA7XG4gIENvbW1hbmQucHJvdmlkZXJzID0gW11cbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICByZXR1cm4gQ29tbWFuZFxufS5jYWxsKHZvaWQgMCkpXG5cbmV4cG9ydHMuQ29tbWFuZCA9IENvbW1hbmRcbnZhciBCYXNlQ29tbWFuZCA9IGNsYXNzIEJhc2VDb21tYW5kIHtcbiAgY29uc3RydWN0b3IgKGluc3RhbmNlMSkge1xuICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTFcbiAgfVxuXG4gIGluaXQgKCkge31cblxuICByZXN1bHRJc0F2YWlsYWJsZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0ICE9IG51bGxcbiAgfVxuXG4gIGdldERlZmF1bHRzICgpIHtcbiAgICByZXR1cm4ge31cbiAgfVxuXG4gIGdldE9wdGlvbnMgKCkge1xuICAgIHJldHVybiB7fVxuICB9XG59XG5leHBvcnRzLkJhc2VDb21tYW5kID0gQmFzZUNvbW1hbmRcbiIsImNvbnN0IEFycmF5SGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL0FycmF5SGVscGVyJykuQXJyYXlIZWxwZXJcblxudmFyIGluZGV4T2YgPSBbXS5pbmRleE9mXG52YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3RvciAoY29kZXdhdmUpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmVcbiAgICB0aGlzLm5hbWVTcGFjZXMgPSBbXVxuICB9XG5cbiAgYWRkTmFtZVNwYWNlIChuYW1lKSB7XG4gICAgaWYgKGluZGV4T2YuY2FsbCh0aGlzLm5hbWVTcGFjZXMsIG5hbWUpIDwgMCkge1xuICAgICAgdGhpcy5uYW1lU3BhY2VzLnB1c2gobmFtZSlcbiAgICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2VzID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGFkZE5hbWVzcGFjZXMgKHNwYWNlcykge1xuICAgIHZhciBqLCBsZW4sIHJlc3VsdHMsIHNwYWNlXG5cbiAgICBpZiAoc3BhY2VzKSB7XG4gICAgICBpZiAodHlwZW9mIHNwYWNlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3BhY2VzID0gW3NwYWNlc11cbiAgICAgIH1cblxuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHNwYWNlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBzcGFjZSA9IHNwYWNlc1tqXVxuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGROYW1lU3BhY2Uoc3BhY2UpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZU5hbWVTcGFjZSAobmFtZSkge1xuICAgIHJldHVybiB0aGlzLm5hbWVTcGFjZXMgPSB0aGlzLm5hbWVTcGFjZXMuZmlsdGVyKGZ1bmN0aW9uIChuKSB7XG4gICAgICByZXR1cm4gbiAhPT0gbmFtZVxuICAgIH0pXG4gIH1cblxuICBnZXROYW1lU3BhY2VzICgpIHtcbiAgICB2YXIgbnBjc1xuXG4gICAgaWYgKHRoaXMuX25hbWVzcGFjZXMgPT0gbnVsbCkge1xuICAgICAgbnBjcyA9IHRoaXMubmFtZVNwYWNlc1xuXG4gICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICBucGNzID0gbnBjcy5jb25jYXQodGhpcy5wYXJlbnQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9uYW1lc3BhY2VzID0gQXJyYXlIZWxwZXIudW5pcXVlKG5wY3MpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZXNcbiAgfVxuXG4gIGdldENtZCAoY21kTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGZpbmRlclxuICAgIGZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMpXG4gICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgfVxuXG4gIGdldEZpbmRlciAoY21kTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBDb250ZXh0LmNtZEZpbmRlckNsYXNzKGNtZE5hbWUsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgbmFtZXNwYWNlczogW10sXG4gICAgICB1c2VEZXRlY3RvcnM6IHRoaXMuaXNSb290KCksXG4gICAgICBjb2Rld2F2ZTogdGhpcy5jb2Rld2F2ZSxcbiAgICAgIHBhcmVudENvbnRleHQ6IHRoaXNcbiAgICB9LCBvcHRpb25zKSlcbiAgfVxuXG4gIGlzUm9vdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09IG51bGxcbiAgfVxuXG4gIGdldFBhcmVudE9yUm9vdCAoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50IChzdHIpIHtcbiAgICB2YXIgY2NcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKVxuXG4gICAgaWYgKGNjLmluZGV4T2YoJyVzJykgPiAtMSkge1xuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJywgc3RyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHIgKyAnICcgKyBjY1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50TGVmdCAoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGlcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKVxuXG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLCBpKSArIHN0clxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHJcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudFJpZ2h0IChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaVxuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpXG5cbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkgKyAyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2NcbiAgICB9XG4gIH1cblxuICBjbWRJbnN0YW5jZUZvciAoY21kKSB7XG4gICAgcmV0dXJuIG5ldyBDb250ZXh0LmNtZEluc3RhbmNlQ2xhc3MoY21kLCB0aGlzKVxuICB9XG5cbiAgZ2V0Q29tbWVudENoYXIgKCkge1xuICAgIHZhciBjaGFyLCBjbWQsIGluc3QsIHJlc1xuXG4gICAgaWYgKHRoaXMuY29tbWVudENoYXIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tbWVudENoYXJcbiAgICB9XG5cbiAgICBjbWQgPSB0aGlzLmdldENtZCgnY29tbWVudCcpXG4gICAgY2hhciA9ICc8IS0tICVzIC0tPidcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaW5zdCA9IHRoaXMuY21kSW5zdGFuY2VGb3IoY21kKVxuICAgICAgaW5zdC5jb250ZW50ID0gJyVzJ1xuICAgICAgcmVzID0gaW5zdC5yZXN1bHQoKVxuXG4gICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgY2hhciA9IHJlc1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY29tbWVudENoYXIgPSBjaGFyXG4gICAgcmV0dXJuIHRoaXMuY29tbWVudENoYXJcbiAgfVxufVxuZXhwb3J0cy5Db250ZXh0ID0gQ29udGV4dFxuIiwiXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi9Db21tYW5kJykuQ29tbWFuZFxuXG52YXIgRWRpdENtZFByb3AgPSBjbGFzcyBFZGl0Q21kUHJvcCB7XG4gIGNvbnN0cnVjdG9yIChuYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBpLCBrZXksIGxlbiwgcmVmLCB2YWxcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICB2YXI6IG51bGwsXG4gICAgICBvcHQ6IG51bGwsXG4gICAgICBmdW5jdDogbnVsbCxcbiAgICAgIGRhdGFOYW1lOiBudWxsLFxuICAgICAgc2hvd0VtcHR5OiBmYWxzZSxcbiAgICAgIGNhcnJldDogZmFsc2VcbiAgICB9XG4gICAgcmVmID0gWyd2YXInLCAnb3B0JywgJ2Z1bmN0J11cblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAga2V5ID0gcmVmW2ldXG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBkZWZhdWx0cy5kYXRhTmFtZSA9IG9wdGlvbnNba2V5XVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgICB2YWwgPSBkZWZhdWx0c1trZXldXG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldENtZCAoY21kcykge1xuICAgIHJldHVybiBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lKVxuICB9XG5cbiAgd3JpdGVGb3IgKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9ialt0aGlzLmRhdGFOYW1lXSA9IHBhcnNlci52YXJzW3RoaXMubmFtZV1cbiAgICB9XG4gIH1cblxuICB2YWxGcm9tQ21kIChjbWQpIHtcbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLm9wdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZ2V0T3B0aW9uKHRoaXMub3B0KVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5mdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy5mdW5jdF0oKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy52YXIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kW3RoaXMudmFyXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3dGb3JDbWQgKGNtZCkge1xuICAgIHZhciB2YWxcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKVxuICAgIHJldHVybiB0aGlzLnNob3dFbXB0eSB8fCB2YWwgIT0gbnVsbFxuICB9XG5cbiAgZGlzcGxheSAoY21kKSB7XG4gICAgaWYgKHRoaXMuc2hvd0ZvckNtZChjbWQpKSB7XG4gICAgICByZXR1cm4gYH5+JHt0aGlzLm5hbWV9fn5cXG4ke3RoaXMudmFsRnJvbUNtZChjbWQpIHx8ICcnfSR7dGhpcy5jYXJyZXQgPyAnfCcgOiAnJ31cXG5+fi8ke3RoaXMubmFtZX1+fmBcbiAgICB9XG4gIH1cbn1cbmV4cG9ydHMuRWRpdENtZFByb3AgPSBFZGl0Q21kUHJvcFxuRWRpdENtZFByb3Auc291cmNlID0gY2xhc3Mgc291cmNlIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICB2YWxGcm9tQ21kIChjbWQpIHtcbiAgICB2YXIgcmVzXG4gICAgcmVzID0gc3VwZXIudmFsRnJvbUNtZChjbWQpXG5cbiAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgIHJlcyA9IHJlcy5yZXBsYWNlKC9cXHwvZywgJ3x8JylcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICBzZXRDbWQgKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlVmFyQ21kKHRoaXMubmFtZSwge1xuICAgICAgcHJldmVudFBhcnNlQWxsOiB0cnVlXG4gICAgfSlcbiAgfVxuXG4gIHNob3dGb3JDbWQgKGNtZCkge1xuICAgIHZhciB2YWxcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKVxuICAgIHJldHVybiB0aGlzLnNob3dFbXB0eSAmJiAhKGNtZCAhPSBudWxsICYmIGNtZC5hbGlhc09mICE9IG51bGwpIHx8IHZhbCAhPSBudWxsXG4gIH1cbn1cbkVkaXRDbWRQcm9wLnN0cmluZyA9IGNsYXNzIHN0cmluZyBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgZGlzcGxheSAoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9ICcke3RoaXMudmFsRnJvbUNtZChjbWQpfSR7dGhpcy5jYXJyZXQgPyAnfCcgOiAnJ30nfn5gXG4gICAgfVxuICB9XG59XG5FZGl0Q21kUHJvcC5yZXZCb29sID0gY2xhc3MgcmV2Qm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kIChjbWRzKSB7XG4gICAgcmV0dXJuIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZUJvb2xWYXJDbWQodGhpcy5uYW1lKVxuICB9XG5cbiAgd3JpdGVGb3IgKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9ialt0aGlzLmRhdGFOYW1lXSA9ICFwYXJzZXIudmFyc1t0aGlzLm5hbWVdXG4gICAgfVxuICB9XG5cbiAgZGlzcGxheSAoY21kKSB7XG4gICAgdmFyIHZhbFxuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpXG5cbiAgICBpZiAodmFsICE9IG51bGwgJiYgIXZhbCkge1xuICAgICAgcmV0dXJuIGB+fiEke3RoaXMubmFtZX1+fmBcbiAgICB9XG4gIH1cbn1cbkVkaXRDbWRQcm9wLmJvb2wgPSBjbGFzcyBib29sIGV4dGVuZHMgRWRpdENtZFByb3Age1xuICBzZXRDbWQgKGNtZHMpIHtcbiAgICByZXR1cm4gY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpXG4gIH1cblxuICBkaXNwbGF5IChjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gXG4gICAgfVxuICB9XG59XG4iLCJcbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUG9zJykuUG9zXG5cbmNvbnN0IFN0clBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvU3RyUG9zJykuU3RyUG9zXG5cbmNvbnN0IE9wdGlvbmFsUHJvbWlzZSA9IHJlcXVpcmUoJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnKVxuXG52YXIgRWRpdG9yID0gY2xhc3MgRWRpdG9yIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMubmFtZXNwYWNlID0gbnVsbFxuICAgIHRoaXMuX2xhbmcgPSBudWxsXG4gIH1cblxuICBiaW5kZWRUbyAoY29kZXdhdmUpIHt9XG5cbiAgdGV4dCAodmFsKSB7XG4gICAgdGhyb3cgJ05vdCBJbXBsZW1lbnRlZCdcbiAgfVxuXG4gIHRleHRDaGFyQXQgKHBvcykge1xuICAgIHRocm93ICdOb3QgSW1wbGVtZW50ZWQnXG4gIH1cblxuICB0ZXh0TGVuICgpIHtcbiAgICB0aHJvdyAnTm90IEltcGxlbWVudGVkJ1xuICB9XG5cbiAgdGV4dFN1YnN0ciAoc3RhcnQsIGVuZCkge1xuICAgIHRocm93ICdOb3QgSW1wbGVtZW50ZWQnXG4gIH1cblxuICBpbnNlcnRUZXh0QXQgKHRleHQsIHBvcykge1xuICAgIHRocm93ICdOb3QgSW1wbGVtZW50ZWQnXG4gIH1cblxuICBzcGxpY2VUZXh0IChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgdGhyb3cgJ05vdCBJbXBsZW1lbnRlZCdcbiAgfVxuXG4gIGdldEN1cnNvclBvcyAoKSB7XG4gICAgdGhyb3cgJ05vdCBJbXBsZW1lbnRlZCdcbiAgfVxuXG4gIHNldEN1cnNvclBvcyAoc3RhcnQsIGVuZCA9IG51bGwpIHtcbiAgICB0aHJvdyAnTm90IEltcGxlbWVudGVkJ1xuICB9XG5cbiAgYmVnaW5VbmRvQWN0aW9uICgpIHt9XG5cbiAgZW5kVW5kb0FjdGlvbiAoKSB7fVxuXG4gIGdldExhbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9sYW5nXG4gIH1cblxuICBzZXRMYW5nICh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFuZyA9IHZhbFxuICB9XG5cbiAgZ2V0RW1tZXRDb250ZXh0T2JqZWN0ICgpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgYWxsb3dNdWx0aVNlbGVjdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBzZXRNdWx0aVNlbCAoc2VsZWN0aW9ucykge1xuICAgIHRocm93ICdOb3QgSW1wbGVtZW50ZWQnXG4gIH1cblxuICBnZXRNdWx0aVNlbCAoKSB7XG4gICAgdGhyb3cgJ05vdCBJbXBsZW1lbnRlZCdcbiAgfVxuXG4gIGNhbkxpc3RlblRvQ2hhbmdlICgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xuICAgIHRocm93ICdOb3QgSW1wbGVtZW50ZWQnXG4gIH1cblxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lciAoY2FsbGJhY2spIHtcbiAgICB0aHJvdyAnTm90IEltcGxlbWVudGVkJ1xuICB9XG5cbiAgZ2V0TGluZUF0IChwb3MpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLmZpbmRMaW5lU3RhcnQocG9zKSwgdGhpcy5maW5kTGluZUVuZChwb3MpKVxuICB9XG5cbiAgZmluZExpbmVTdGFydCAocG9zKSB7XG4gICAgdmFyIHBcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFsnXFxuJ10sIC0xKVxuXG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvcyArIDFcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gIH1cblxuICBmaW5kTGluZUVuZCAocG9zKSB7XG4gICAgdmFyIHBcbiAgICBwID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFsnXFxuJywgJ1xcciddKVxuXG4gICAgaWYgKHApIHtcbiAgICAgIHJldHVybiBwLnBvc1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0TGVuKClcbiAgICB9XG4gIH1cblxuICBmaW5kQW55TmV4dCAoc3RhcnQsIHN0cmluZ3MsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICB2YXIgYmVzdFBvcywgYmVzdFN0ciwgaSwgbGVuLCBwb3MsIHN0cmksIHRleHRcblxuICAgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0LCB0aGlzLnRleHRMZW4oKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9IHRoaXMudGV4dFN1YnN0cigwLCBzdGFydClcbiAgICB9XG5cbiAgICBiZXN0UG9zID0gbnVsbFxuXG4gICAgZm9yIChpID0gMCwgbGVuID0gc3RyaW5ncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc3RyaSA9IHN0cmluZ3NbaV1cbiAgICAgIHBvcyA9IGRpcmVjdGlvbiA+IDAgPyB0ZXh0LmluZGV4T2Yoc3RyaSkgOiB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpXG5cbiAgICAgIGlmIChwb3MgIT09IC0xKSB7XG4gICAgICAgIGlmIChiZXN0UG9zID09IG51bGwgfHwgYmVzdFBvcyAqIGRpcmVjdGlvbiA+IHBvcyAqIGRpcmVjdGlvbikge1xuICAgICAgICAgIGJlc3RQb3MgPSBwb3NcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJlc3RTdHIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJQb3MoZGlyZWN0aW9uID4gMCA/IGJlc3RQb3MgKyBzdGFydCA6IGJlc3RQb3MsIGJlc3RTdHIpXG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGFwcGx5UmVwbGFjZW1lbnRzIChyZXBsYWNlbWVudHMpIHtcbiAgICByZXR1cm4gcmVwbGFjZW1lbnRzLnJlZHVjZSgocHJvbWlzZSwgcmVwbCkgPT4ge1xuICAgICAgcmV0dXJuIHByb21pc2UudGhlbihvcHQgPT4ge1xuICAgICAgICByZXBsLndpdGhFZGl0b3IodGhpcylcbiAgICAgICAgcmVwbC5hcHBseU9mZnNldChvcHQub2Zmc2V0KVxuICAgICAgICByZXR1cm4gKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHJlcGwuYXBwbHkoKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnM6IG9wdC5zZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpLFxuICAgICAgICAgICAgb2Zmc2V0OiBvcHQub2Zmc2V0ICsgcmVwbC5vZmZzZXRBZnRlcih0aGlzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSwgKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHtcbiAgICAgIHNlbGVjdGlvbnM6IFtdLFxuICAgICAgb2Zmc2V0OiAwXG4gICAgfSkpLnRoZW4ob3B0ID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhvcHQuc2VsZWN0aW9ucylcbiAgICB9KS5yZXN1bHQoKVxuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zIChzZWxlY3Rpb25zKSB7XG4gICAgaWYgKHNlbGVjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHRoaXMuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldE11bHRpU2VsKHNlbGVjdGlvbnMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCwgc2VsZWN0aW9uc1swXS5lbmQpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5leHBvcnRzLkVkaXRvciA9IEVkaXRvclxuIiwiXG52YXIgTG9nZ2VyID0gKGZ1bmN0aW9uICgpIHtcbiAgY2xhc3MgTG9nZ2VyIHtcbiAgICBsb2cgKC4uLmFyZ3MpIHtcbiAgICAgIHZhciBpLCBsZW4sIG1zZywgcmVzdWx0c1xuXG4gICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICByZXN1bHRzID0gW11cblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbXNnID0gYXJnc1tpXVxuICAgICAgICAgIHJlc3VsdHMucHVzaChjb25zb2xlLmxvZyhtc2cpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQgKCkge1xuICAgICAgcmV0dXJuICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZSAhPT0gbnVsbCA/IGNvbnNvbGUubG9nIDogdm9pZCAwKSAhPSBudWxsICYmIHRoaXMuZW5hYmxlZCAmJiBMb2dnZXIuZW5hYmxlZFxuICAgIH1cblxuICAgIHJ1bnRpbWUgKGZ1bmN0LCBuYW1lID0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIHJlcywgdDAsIHQxXG4gICAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgICByZXMgPSBmdW5jdCgpXG4gICAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfSB0b29rICR7dDEgLSB0MH0gbWlsbGlzZWNvbmRzLmApXG4gICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgdG9Nb25pdG9yIChvYmosIG5hbWUsIHByZWZpeCA9ICcnKSB7XG4gICAgICB2YXIgZnVuY3RcbiAgICAgIGZ1bmN0ID0gb2JqW25hbWVdXG4gICAgICByZXR1cm4gb2JqW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJnc1xuICAgICAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgICAgIHJldHVybiB0aGlzLm1vbml0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBmdW5jdC5hcHBseShvYmosIGFyZ3MpXG4gICAgICAgIH0sIHByZWZpeCArIG5hbWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgbW9uaXRvciAoZnVuY3QsIG5hbWUpIHtcbiAgICAgIHZhciByZXMsIHQwLCB0MVxuICAgICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgICAgcmVzID0gZnVuY3QoKVxuICAgICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuXG4gICAgICBpZiAodGhpcy5tb25pdG9yRGF0YVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrK1xuICAgICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLnRvdGFsICs9IHQxIC0gdDBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0gPSB7XG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgdG90YWw6IHQxIC0gdDBcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgcmVzdW1lICgpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyh0aGlzLm1vbml0b3JEYXRhKVxuICAgIH1cbiAgfVxuXG4gIDtcbiAgTG9nZ2VyLmVuYWJsZWQgPSB0cnVlXG4gIExvZ2dlci5wcm90b3R5cGUuZW5hYmxlZCA9IHRydWVcbiAgTG9nZ2VyLnByb3RvdHlwZS5tb25pdG9yRGF0YSA9IHt9XG4gIHJldHVybiBMb2dnZXJcbn0uY2FsbCh2b2lkIDApKVxuXG5leHBvcnRzLkxvZ2dlciA9IExvZ2dlclxuIiwiXG52YXIgT3B0aW9uT2JqZWN0ID0gY2xhc3MgT3B0aW9uT2JqZWN0IHtcbiAgc2V0T3B0cyAob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIga2V5LCByZWYsIHJlc3VsdHMsIHZhbFxuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHNcbiAgICByZXN1bHRzID0gW11cblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV1cblxuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldE9wdChrZXksIG9wdGlvbnNba2V5XSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCB2YWwpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cblxuICBzZXRPcHQgKGtleSwgdmFsKSB7XG4gICAgdmFyIHJlZlxuXG4gICAgaWYgKCgocmVmID0gdGhpc1trZXldKSAhPSBudWxsID8gcmVmLmNhbGwgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0odmFsKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldID0gdmFsXG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0IChrZXkpIHtcbiAgICB2YXIgcmVmXG5cbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXNba2V5XSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV1cbiAgICB9XG4gIH1cblxuICBnZXRPcHRzICgpIHtcbiAgICB2YXIga2V5LCBvcHRzLCByZWYsIHZhbFxuICAgIG9wdHMgPSB7fVxuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHNcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV1cbiAgICAgIG9wdHNba2V5XSA9IHRoaXMuZ2V0T3B0KGtleSlcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0c1xuICB9XG59XG5leHBvcnRzLk9wdGlvbk9iamVjdCA9IE9wdGlvbk9iamVjdFxuIiwiXG5jb25zdCBDbWRJbnN0YW5jZSA9IHJlcXVpcmUoJy4vQ21kSW5zdGFuY2UnKS5DbWRJbnN0YW5jZVxuXG5jb25zdCBCb3hIZWxwZXIgPSByZXF1aXJlKCcuL0JveEhlbHBlcicpLkJveEhlbHBlclxuXG5jb25zdCBQYXJhbVBhcnNlciA9IHJlcXVpcmUoJy4vc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlcicpLlBhcmFtUGFyc2VyXG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUG9zJykuUG9zXG5cbmNvbnN0IFN0clBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvU3RyUG9zJykuU3RyUG9zXG5cbmNvbnN0IFJlcGxhY2VtZW50ID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCcpLlJlcGxhY2VtZW50XG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9TdHJpbmdIZWxwZXInKS5TdHJpbmdIZWxwZXJcblxuY29uc3QgTmFtZXNwYWNlSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcicpLk5hbWVzcGFjZUhlbHBlclxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKCcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJylcblxudmFyIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSA9IGNsYXNzIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSBleHRlbmRzIENtZEluc3RhbmNlIHtcbiAgY29uc3RydWN0b3IgKGNvZGV3YXZlLCBwb3MxLCBzdHIxKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZVxuICAgIHRoaXMucG9zID0gcG9zMVxuICAgIHRoaXMuc3RyID0gc3RyMVxuXG4gICAgaWYgKCF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgdGhpcy5fY2hlY2tDbG9zZXIoKVxuXG4gICAgICB0aGlzLm9wZW5pbmcgPSB0aGlzLnN0clxuICAgICAgdGhpcy5ub0JyYWNrZXQgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKVxuXG4gICAgICB0aGlzLl9zcGxpdENvbXBvbmVudHMoKVxuXG4gICAgICB0aGlzLl9maW5kQ2xvc2luZygpXG5cbiAgICAgIHRoaXMuX2NoZWNrRWxvbmdhdGVkKClcbiAgICB9XG4gIH1cblxuICBfY2hlY2tDbG9zZXIgKCkge1xuICAgIHZhciBmLCBub0JyYWNrZXRcbiAgICBub0JyYWNrZXQgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKVxuXG4gICAgaWYgKG5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgJiYgKGYgPSB0aGlzLl9maW5kT3BlbmluZ1BvcygpKSkge1xuICAgICAgdGhpcy5jbG9zaW5nUG9zID0gbmV3IFN0clBvcyh0aGlzLnBvcywgdGhpcy5zdHIpXG4gICAgICB0aGlzLnBvcyA9IGYucG9zXG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSBmLnN0clxuICAgIH1cbiAgfVxuXG4gIF9maW5kT3BlbmluZ1BvcyAoKSB7XG4gICAgdmFyIGNsb3NpbmcsIGNtZE5hbWUsIG9wZW5pbmdcbiAgICBjbWROYW1lID0gdGhpcy5fcmVtb3ZlQnJhY2tldCh0aGlzLnN0cikuc3Vic3RyaW5nKHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyLmxlbmd0aClcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgY21kTmFtZVxuICAgIGNsb3NpbmcgPSB0aGlzLnN0clxuXG4gICAgY29uc3QgZiA9IHRoaXMuY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcih0aGlzLnBvcywgb3BlbmluZywgY2xvc2luZywgLTEpXG4gICAgaWYgKGYpIHtcbiAgICAgIGYuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihmLnBvcywgdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcyArIGYuc3RyLmxlbmd0aCkgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZcbiAgICB9XG4gIH1cblxuICBfc3BsaXRDb21wb25lbnRzICgpIHtcbiAgICB2YXIgcGFydHNcbiAgICBwYXJ0cyA9IHRoaXMubm9CcmFja2V0LnNwbGl0KCcgJylcbiAgICB0aGlzLmNtZE5hbWUgPSBwYXJ0cy5zaGlmdCgpXG4gICAgcmV0dXJuIHRoaXMucmF3UGFyYW1zID0gcGFydHMuam9pbignICcpXG4gIH1cblxuICBfcGFyc2VQYXJhbXMgKHBhcmFtcykge1xuICAgIHZhciBuYW1lVG9QYXJhbSwgcGFyc2VyXG4gICAgcGFyc2VyID0gbmV3IFBhcmFtUGFyc2VyKHBhcmFtcywge1xuICAgICAgYWxsb3dlZE5hbWVkOiB0aGlzLmdldE9wdGlvbignYWxsb3dlZE5hbWVkJyksXG4gICAgICB2YXJzOiB0aGlzLmNvZGV3YXZlLnZhcnNcbiAgICB9KVxuICAgIHRoaXMucGFyYW1zID0gcGFyc2VyLnBhcmFtc1xuICAgIHRoaXMubmFtZWQgPSBPYmplY3QuYXNzaWduKHRoaXMuZ2V0RGVmYXVsdHMoKSwgcGFyc2VyLm5hbWVkKVxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIG5hbWVUb1BhcmFtID0gdGhpcy5nZXRPcHRpb24oJ25hbWVUb1BhcmFtJylcblxuICAgICAgaWYgKG5hbWVUb1BhcmFtICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZWRbbmFtZVRvUGFyYW1dID0gdGhpcy5jbWROYW1lXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRDbG9zaW5nICgpIHtcbiAgICBjb25zdCBmID0gdGhpcy5fZmluZENsb3NpbmdQb3MoKVxuICAgIGlmIChmKSB7XG4gICAgICB0aGlzLmNvbnRlbnQgPSBTdHJpbmdIZWxwZXIudHJpbUVtcHR5TGluZSh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBmLnBvcykpXG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBmLnBvcyArIGYuc3RyLmxlbmd0aClcbiAgICB9XG4gIH1cblxuICBfZmluZENsb3NpbmdQb3MgKCkge1xuICAgIHZhciBjbG9zaW5nLCBvcGVuaW5nXG5cbiAgICBpZiAodGhpcy5jbG9zaW5nUG9zICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3NcbiAgICB9XG5cbiAgICBjbG9zaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNtZE5hbWUgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHNcbiAgICBvcGVuaW5nID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWROYW1lXG5cbiAgICBjb25zdCBmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBvcGVuaW5nLCBjbG9zaW5nKVxuICAgIGlmIChmKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zaW5nUG9zID0gZlxuICAgIH1cbiAgfVxuXG4gIF9jaGVja0Vsb25nYXRlZCAoKSB7XG4gICAgdmFyIGVuZFBvcywgbWF4LCByZWZcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpXG4gICAgbWF4ID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dExlbigpXG5cbiAgICB3aGlsZSAoZW5kUG9zIDwgbWF4ICYmIHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyB0aGlzLmNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5kZWNvKSB7XG4gICAgICBlbmRQb3MgKz0gdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aFxuICAgIH1cblxuICAgIGlmIChlbmRQb3MgPj0gbWF4IHx8IChyZWYgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkpID09PSAnICcgfHwgcmVmID09PSAnXFxuJyB8fCByZWYgPT09ICdcXHInKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBlbmRQb3MpXG4gICAgfVxuICB9XG5cbiAgX2NoZWNrQm94ICgpIHtcbiAgICB2YXIgY2wsIGNyLCBlbmRQb3NcblxuICAgIGlmICh0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCAmJiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuY21kLm5hbWUgPT09ICdjb21tZW50Jykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY2wgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KClcbiAgICBjciA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KClcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpICsgY3IubGVuZ3RoXG5cbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyAtIGNsLmxlbmd0aCwgdGhpcy5wb3MpID09PSBjbCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyAtIGNyLmxlbmd0aCwgZW5kUG9zKSA9PT0gY3IpIHtcbiAgICAgIHRoaXMucG9zID0gdGhpcy5wb3MgLSBjbC5sZW5ndGhcbiAgICAgIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKVxuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgJiYgdGhpcy5nZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xKSB7XG4gICAgICB0aGlzLmluQm94ID0gMVxuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gICAgfVxuICB9XG5cbiAgX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCAoKSB7XG4gICAgdmFyIGVjbCwgZWNyLCBlZCwgcmUxLCByZTIsIHJlM1xuXG4gICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpXG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb2Rld2F2ZS5kZWNvKVxuICAgICAgcmUxID0gbmV3IFJlZ0V4cChgXlxcXFxzKiR7ZWNsfSg/OiR7ZWR9KStcXFxccyooLio/KVxcXFxzKig/OiR7ZWR9KSske2Vjcn0kYCwgJ2dtJylcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoYF5cXFxccyooPzoke2VkfSkqJHtlY3J9XFxyP1xcbmApXG4gICAgICByZTMgPSBuZXcgUmVnRXhwKGBcXG5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHMqJGApXG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50ID0gdGhpcy5jb250ZW50LnJlcGxhY2UocmUxLCAnJDEnKS5yZXBsYWNlKHJlMiwgJycpLnJlcGxhY2UocmUzLCAnJylcbiAgICB9XG4gIH1cblxuICBfZ2V0UGFyZW50Q21kcyAoKSB7XG4gICAgdmFyIHJlZlxuICAgIHJldHVybiB0aGlzLnBhcmVudCA9IChyZWYgPSB0aGlzLmNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZCh0aGlzLmdldEVuZFBvcygpKSkgIT0gbnVsbCA/IHJlZi5pbml0KCkgOiB2b2lkIDBcbiAgfVxuXG4gIHNldE11bHRpUG9zIChtdWx0aVBvcykge1xuICAgIHJldHVybiB0aGlzLm11bHRpUG9zID0gbXVsdGlQb3NcbiAgfVxuXG4gIF9nZXRDbWRPYmogKCkge1xuICAgIHRoaXMuZ2V0Q21kKClcblxuICAgIHRoaXMuX2NoZWNrQm94KClcblxuICAgIHRoaXMuY29udGVudCA9IHRoaXMucmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQodGhpcy5jb250ZW50KVxuICAgIHJldHVybiBzdXBlci5fZ2V0Q21kT2JqKClcbiAgfVxuXG4gIF9pbml0UGFyYW1zICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2VQYXJhbXModGhpcy5yYXdQYXJhbXMpXG4gIH1cblxuICBnZXRDb250ZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IHRoaXMuY29kZXdhdmUuY29udGV4dFxuICB9XG5cbiAgZ2V0Q21kICgpIHtcbiAgICBpZiAodGhpcy5jbWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fZ2V0UGFyZW50Q21kcygpXG5cbiAgICAgIGlmICh0aGlzLm5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikge1xuICAgICAgICB0aGlzLmNtZCA9IENvbW1hbmQuY21kcy5nZXRDbWQoJ2NvcmU6bm9fZXhlY3V0ZScpXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY29kZXdhdmUuY29udGV4dFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZmluZGVyLmNvbnRleHRcbiAgICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKClcblxuICAgICAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29udGV4dC5hZGROYW1lU3BhY2UodGhpcy5jbWQuZnVsbE5hbWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jbWRcbiAgfVxuXG4gIGdldEZpbmRlciAoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXJcbiAgICBmaW5kZXIgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IHRoaXMuX2dldFBhcmVudE5hbWVzcGFjZXMoKVxuICAgIH0pXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgfVxuXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzICgpIHtcbiAgICB2YXIgbnNwY3MsIG9ialxuICAgIG5zcGNzID0gW11cbiAgICBvYmogPSB0aGlzXG5cbiAgICB3aGlsZSAob2JqLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICBvYmogPSBvYmoucGFyZW50XG5cbiAgICAgIGlmIChvYmouY21kICE9IG51bGwgJiYgb2JqLmNtZC5mdWxsTmFtZSAhPSBudWxsKSB7XG4gICAgICAgIG5zcGNzLnB1c2gob2JqLmNtZC5mdWxsTmFtZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnNwY3NcbiAgfVxuXG4gIF9yZW1vdmVCcmFja2V0IChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyh0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoLCBzdHIubGVuZ3RoIC0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgfVxuXG4gIGFsdGVyQWxpYXNPZiAoYWxpYXNPZikge1xuICAgIHZhciBjbWROYW1lLCBuc3BjO1xuICAgIFtuc3BjLCBjbWROYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdCh0aGlzLmNtZE5hbWUpXG4gICAgcmV0dXJuIGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJywgY21kTmFtZSlcbiAgfVxuXG4gIGlzRW1wdHkgKCkge1xuICAgIHJldHVybiB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMgfHwgdGhpcy5zdHIgPT09IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuYnJha2V0c1xuICB9XG5cbiAgZXhlY3V0ZSAoKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgIT0gbnVsbCAmJiB0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcC53aGl0aGluT3BlbkJvdW5kcyh0aGlzLnBvcyArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aCgnJylcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IGJlZm9yZUZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKVxuICAgICAgaWYgKGJlZm9yZUZ1bmN0KSB7XG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh0aGlzLnJlc3VsdCgpKS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlV2l0aChyZXMpXG4gICAgICAgICAgfVxuICAgICAgICB9KS5yZXN1bHQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuRXhlY3V0ZUZ1bmN0KClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRFbmRQb3MgKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aFxuICB9XG5cbiAgZ2V0UG9zICgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpXG4gIH1cblxuICBnZXRPcGVuaW5nUG9zICgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLm9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKVxuICB9XG5cbiAgZ2V0SW5kZW50ICgpIHtcbiAgICB2YXIgaGVscGVyXG5cbiAgICBpZiAodGhpcy5pbmRlbnRMZW4gPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuaW5Cb3ggIT0gbnVsbCkge1xuICAgICAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dClcbiAgICAgICAgdGhpcy5pbmRlbnRMZW4gPSBoZWxwZXIucmVtb3ZlQ29tbWVudCh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5kZW50TGVuID0gdGhpcy5wb3MgLSB0aGlzLmdldFBvcygpLnByZXZFT0woKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmluZGVudExlblxuICB9XG5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQgKHRleHQpIHtcbiAgICB2YXIgcmVnXG5cbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKCdeXFxcXHN7JyArIHRoaXMuZ2V0SW5kZW50KCkgKyAnfScsICdnbScpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgJycpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgfVxuICB9XG5cbiAgYWx0ZXJSZXN1bHRGb3JCb3ggKHJlcGwpIHtcbiAgICB2YXIgYm94LCBoZWxwZXIsIG9yaWdpbmFsLCByZXNcbiAgICBvcmlnaW5hbCA9IHJlcGwuY29weSgpXG4gICAgaGVscGVyID0gbmV3IEJveEhlbHBlcih0aGlzLmNvbnRleHQpXG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksIGZhbHNlKVxuXG4gICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCdyZXBsYWNlQm94JykpIHtcbiAgICAgIGJveCA9IGhlbHBlci5nZXRCb3hGb3JQb3Mob3JpZ2luYWwpO1xuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdXG4gICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5pbmRlbnRcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKClcbiAgICAgIHJlcGwuZW5kID0gb3JpZ2luYWwubmV4dEVPTCgpXG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIHRoaXMuY29kZXdhdmUubWFya2VyICsgcmVwbC50ZXh0ICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge1xuICAgICAgICBtdWx0aWxpbmU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIFtyZXBsLnByZWZpeCwgcmVwbC50ZXh0LCByZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQodGhpcy5jb2Rld2F2ZS5tYXJrZXIpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcGxcbiAgfVxuXG4gIGdldEN1cnNvckZyb21SZXN1bHQgKHJlcGwpIHtcbiAgICB2YXIgY3Vyc29yUG9zLCBwXG4gICAgY3Vyc29yUG9zID0gcmVwbC5yZXNQb3NCZWZvcmVQcmVmaXgoKVxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwgJiYgdGhpcy5jb2Rld2F2ZS5jaGVja0NhcnJldCAmJiB0aGlzLmdldE9wdGlvbignY2hlY2tDYXJyZXQnKSkge1xuICAgICAgaWYgKChwID0gdGhpcy5jb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSkgIT0gbnVsbCkge1xuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0ICsgcmVwbC5wcmVmaXgubGVuZ3RoICsgcFxuICAgICAgfVxuXG4gICAgICByZXBsLnRleHQgPSB0aGlzLmNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpXG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnNvclBvc1xuICB9XG5cbiAgY2hlY2tNdWx0aSAocmVwbCkge1xuICAgIHZhciBpLCBqLCBsZW4sIG5ld1JlcGwsIG9yaWdpbmFsUG9zLCBvcmlnaW5hbFRleHQsIHBvcywgcmVmLCByZXBsYWNlbWVudHNcblxuICAgIGlmICh0aGlzLm11bHRpUG9zICE9IG51bGwgJiYgdGhpcy5tdWx0aVBvcy5sZW5ndGggPiAxKSB7XG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF1cbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KClcbiAgICAgIHJlZiA9IHRoaXMubXVsdGlQb3NcblxuICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgcG9zID0gcmVmW2ldXG5cbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1JlcGwgPSByZXBsLmNvcHkoKS5hcHBseU9mZnNldChwb3Muc3RhcnQgLSBvcmlnaW5hbFBvcylcblxuICAgICAgICAgIGlmIChuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09PSBvcmlnaW5hbFRleHQpIHtcbiAgICAgICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKG5ld1JlcGwpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXBsYWNlbWVudHNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtyZXBsXVxuICAgIH1cbiAgfVxuXG4gIHJlcGxhY2VXaXRoICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQodGhpcy5wb3MsIHRoaXMuZ2V0RW5kUG9zKCksIHRleHQpKVxuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudCAocmVwbCkge1xuICAgIHZhciBjdXJzb3JQb3MsIHJlcGxhY2VtZW50c1xuICAgIHJlcGwud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcilcblxuICAgIGlmICh0aGlzLmluQm94ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYWx0ZXJSZXN1bHRGb3JCb3gocmVwbClcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgfVxuXG4gICAgY3Vyc29yUG9zID0gdGhpcy5nZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpXG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBQb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXVxuICAgIHJlcGxhY2VtZW50cyA9IHRoaXMuY2hlY2tNdWx0aShyZXBsKVxuICAgIHRoaXMucmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydFxuICAgIHRoaXMucmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKClcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICB9XG59XG5leHBvcnRzLlBvc2l0aW9uZWRDbWRJbnN0YW5jZSA9IFBvc2l0aW9uZWRDbWRJbnN0YW5jZVxuIiwiXG52YXIgUHJvY2VzcyA9IGNsYXNzIFByb2Nlc3Mge1xuICBjb25zdHJ1Y3RvciAoKSB7fVxufVxuZXhwb3J0cy5Qcm9jZXNzID0gUHJvY2Vzc1xuIiwiXG5jb25zdCBMb2dnZXIgPSByZXF1aXJlKCcuL0xvZ2dlcicpLkxvZ2dlclxuXG52YXIgU3RvcmFnZSA9IGNsYXNzIFN0b3JhZ2Uge1xuICBjb25zdHJ1Y3RvciAoZW5naW5lKSB7XG4gICAgdGhpcy5lbmdpbmUgPSBlbmdpbmVcbiAgfVxuXG4gIHNhdmUgKGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5zYXZlKGtleSwgdmFsKVxuICAgIH1cbiAgfVxuXG4gIHNhdmVJblBhdGggKHBhdGgsIGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZW5naW5lQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5zYXZlSW5QYXRoKHBhdGgsIGtleSwgdmFsKVxuICAgIH1cbiAgfVxuXG4gIGxvYWQgKGtleSkge1xuICAgIGlmICh0aGlzLmVuZ2luZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmdpbmUubG9hZChrZXkpXG4gICAgfVxuICB9XG5cbiAgZW5naW5lQXZhaWxhYmxlICgpIHtcbiAgICBpZiAodGhpcy5lbmdpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dnZXIgPSB0aGlzLmxvZ2dlciB8fCBuZXcgTG9nZ2VyKClcbiAgICAgIHRoaXMubG9nZ2VyLmxvZygnTm8gc3RvcmFnZSBlbmdpbmUgYXZhaWxhYmxlJylcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5TdG9yYWdlID0gU3RvcmFnZVxuIiwiXG5jb25zdCBUZXh0UGFyc2VyID0gcmVxdWlyZSgnLi9UZXh0UGFyc2VyJykuVGV4dFBhcnNlclxuXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG52YXIgaXNFbGVtZW50XG52YXIgRG9tS2V5TGlzdGVuZXIgPSBjbGFzcyBEb21LZXlMaXN0ZW5lciB7XG4gIHN0YXJ0TGlzdGVuaW5nICh0YXJnZXQpIHtcbiAgICB2YXIgb25rZXlkb3duLCBvbmtleXByZXNzLCBvbmtleXVwLCB0aW1lb3V0XG4gICAgdGltZW91dCA9IG51bGxcblxuICAgIG9ua2V5ZG93biA9IGUgPT4ge1xuICAgICAgaWYgKChDb2Rld2F2ZS5pbnN0YW5jZXMubGVuZ3RoIDwgMiB8fCB0aGlzLm9iaiA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgJiYgZS5rZXlDb2RlID09PSA2OSAmJiBlLmN0cmxLZXkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgaWYgKHRoaXMub25BY3RpdmF0aW9uS2V5ICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFjdGl2YXRpb25LZXkoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgb25rZXl1cCA9IGUgPT4ge1xuICAgICAgaWYgKHRoaXMub25BbnlDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkFueUNoYW5nZShlKVxuICAgICAgfVxuICAgIH1cblxuICAgIG9ua2V5cHJlc3MgPSBlID0+IHtcbiAgICAgIGlmICh0aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9uQW55Q2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFueUNoYW5nZShlKVxuICAgICAgICB9XG4gICAgICB9LCAxMDApXG4gICAgfVxuXG4gICAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bilcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9ua2V5dXApXG4gICAgICByZXR1cm4gdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgb25rZXlwcmVzcylcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5hdHRhY2hFdmVudCkge1xuICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KCdvbmtleWRvd24nLCBvbmtleWRvd24pXG4gICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoJ29ua2V5dXAnLCBvbmtleXVwKVxuICAgICAgcmV0dXJuIHRhcmdldC5hdHRhY2hFdmVudCgnb25rZXlwcmVzcycsIG9ua2V5cHJlc3MpXG4gICAgfVxuICB9XG59XG5leHBvcnRzLkRvbUtleUxpc3RlbmVyID0gRG9tS2V5TGlzdGVuZXJcblxuaXNFbGVtZW50ID0gZnVuY3Rpb24gKG9iaikge1xuICB2YXIgZVxuXG4gIHRyeSB7XG4gICAgLy8gVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb20pXG4gICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yIC8vIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAvLyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuXG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygb2JqLnN0eWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT09ICdvYmplY3QnXG4gIH1cbn1cblxudmFyIFRleHRBcmVhRWRpdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvciAodGFyZ2V0MSkge1xuICAgICAgc3VwZXIoKVxuICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQxXG4gICAgICB0aGlzLm9iaiA9IGlzRWxlbWVudCh0aGlzLnRhcmdldCkgPyB0aGlzLnRhcmdldCA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0KVxuXG4gICAgICBpZiAodGhpcy5vYmogPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyAnVGV4dEFyZWEgbm90IGZvdW5kJ1xuICAgICAgfVxuXG4gICAgICB0aGlzLm5hbWVzcGFjZSA9ICd0ZXh0YXJlYSdcbiAgICAgIHRoaXMuY2hhbmdlTGlzdGVuZXJzID0gW11cbiAgICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudCA9IDBcbiAgICB9XG5cbiAgICBvbkFueUNoYW5nZSAoZSkge1xuICAgICAgdmFyIGNhbGxiYWNrLCBqLCBsZW4xLCByZWYsIHJlc3VsdHNcblxuICAgICAgaWYgKHRoaXMuX3NraXBDaGFuZ2VFdmVudCA8PSAwKSB7XG4gICAgICAgIHJlZiA9IHRoaXMuY2hhbmdlTGlzdGVuZXJzXG4gICAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgY2FsbGJhY2sgPSByZWZbal1cbiAgICAgICAgICByZXN1bHRzLnB1c2goY2FsbGJhY2soKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQtLVxuXG4gICAgICAgIGlmICh0aGlzLm9uU2tpcGVkQ2hhbmdlICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vblNraXBlZENoYW5nZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBza2lwQ2hhbmdlRXZlbnQgKG5iID0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NraXBDaGFuZ2VFdmVudCArPSBuYlxuICAgIH1cblxuICAgIGJpbmRlZFRvIChjb2Rld2F2ZSkge1xuICAgICAgdGhpcy5vbkFjdGl2YXRpb25LZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zdGFydExpc3RlbmluZyhkb2N1bWVudClcbiAgICB9XG5cbiAgICBzZWxlY3Rpb25Qcm9wRXhpc3RzICgpIHtcbiAgICAgIHJldHVybiAnc2VsZWN0aW9uU3RhcnQnIGluIHRoaXMub2JqXG4gICAgfVxuXG4gICAgaGFzRm9jdXMgKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMub2JqXG4gICAgfVxuXG4gICAgdGV4dCAodmFsKSB7XG4gICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHRFdmVudENoYW5nZSh2YWwpKSB7XG4gICAgICAgICAgdGhpcy5vYmoudmFsdWUgPSB2YWxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5vYmoudmFsdWVcbiAgICB9XG5cbiAgICBzcGxpY2VUZXh0IChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0RXZlbnRDaGFuZ2UodGV4dCwgc3RhcnQsIGVuZCkgfHwgdGhpcy5zcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kKHRleHQsIHN0YXJ0LCBlbmQpIHx8IHN1cGVyLnNwbGljZVRleHQoc3RhcnQsIGVuZCwgdGV4dClcbiAgICB9XG5cbiAgICB0ZXh0RXZlbnRDaGFuZ2UgKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgICAgdmFyIGV2ZW50XG5cbiAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RleHRFdmVudCcpXG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudCAhPSBudWxsICYmIGV2ZW50LmluaXRUZXh0RXZlbnQgIT0gbnVsbCAmJiBldmVudC5pc1RydXN0ZWQgIT09IGZhbHNlKSB7XG4gICAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGV4dC5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgaWYgKHN0YXJ0ICE9PSAwKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0IC0gMSwgc3RhcnQpXG4gICAgICAgICAgICBzdGFydC0tXG4gICAgICAgICAgfSBlbHNlIGlmIChlbmQgIT09IHRoaXMudGV4dExlbigpKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKGVuZCwgZW5kICsgMSlcbiAgICAgICAgICAgIGVuZCsrXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LmluaXRUZXh0RXZlbnQoJ3RleHRJbnB1dCcsIHRydWUsIHRydWUsIG51bGwsIHRleHQsIDkpIC8vIEBzZXRDdXJzb3JQb3Moc3RhcnQsZW5kKVxuXG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICAgIHRoaXMub2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgICAgIHRoaXMuc2tpcENoYW5nZUV2ZW50KClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIHNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQgKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkge1xuICAgICAgaWYgKGRvY3VtZW50LmV4ZWNDb21tYW5kICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0ZXh0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yUG9zICgpIHtcbiAgICAgIGlmICh0aGlzLnRtcEN1cnNvclBvcyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRtcEN1cnNvclBvc1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5oYXNGb2N1cykge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25Qcm9wRXhpc3RzKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQb3ModGhpcy5vYmouc2VsZWN0aW9uU3RhcnQsIHRoaXMub2JqLnNlbGVjdGlvbkVuZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJzb3JQb3NGYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDdXJzb3JQb3NGYWxsYmFjayAoKSB7XG4gICAgICB2YXIgbGVuLCBwb3MsIHJuZywgc2VsXG5cbiAgICAgIGlmICh0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKClcblxuICAgICAgICBpZiAoc2VsLnBhcmVudEVsZW1lbnQoKSA9PT0gdGhpcy5vYmopIHtcbiAgICAgICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayhzZWwuZ2V0Qm9va21hcmsoKSlcbiAgICAgICAgICBsZW4gPSAwXG5cbiAgICAgICAgICB3aGlsZSAocm5nLmNvbXBhcmVFbmRQb2ludHMoJ0VuZFRvU3RhcnQnLCBybmcpID4gMCkge1xuICAgICAgICAgICAgbGVuKytcbiAgICAgICAgICAgIHJuZy5tb3ZlRW5kKCdjaGFyYWN0ZXInLCAtMSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBybmcuc2V0RW5kUG9pbnQoJ1N0YXJ0VG9TdGFydCcsIHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpKVxuICAgICAgICAgIHBvcyA9IG5ldyBQb3MoMCwgbGVuKVxuXG4gICAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKCdFbmRUb1N0YXJ0Jywgcm5nKSA+IDApIHtcbiAgICAgICAgICAgIHBvcy5zdGFydCsrXG4gICAgICAgICAgICBwb3MuZW5kKytcbiAgICAgICAgICAgIHJuZy5tb3ZlRW5kKCdjaGFyYWN0ZXInLCAtMSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcG9zXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdXJzb3JQb3MgKHN0YXJ0LCBlbmQpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICBlbmQgPSBzdGFydFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25Qcm9wRXhpc3RzKSB7XG4gICAgICAgIHRoaXMudG1wQ3Vyc29yUG9zID0gbmV3IFBvcyhzdGFydCwgZW5kKVxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG51bGxcbiAgICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICAgICAgcmV0dXJuIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgICB9LCAxKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvclBvc0ZhbGxiYWNrIChzdGFydCwgZW5kKSB7XG4gICAgICB2YXIgcm5nXG5cbiAgICAgIGlmICh0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgICAgcm5nID0gdGhpcy5vYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcm5nLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgc3RhcnQpXG4gICAgICAgIHJuZy5jb2xsYXBzZSgpXG4gICAgICAgIHJuZy5tb3ZlRW5kKCdjaGFyYWN0ZXInLCBlbmQgLSBzdGFydClcbiAgICAgICAgcmV0dXJuIHJuZy5zZWxlY3QoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldExhbmcgKCkge1xuICAgICAgaWYgKHRoaXMuX2xhbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmdcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub2JqLmhhc0F0dHJpYnV0ZSgnZGF0YS1sYW5nJykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMYW5nICh2YWwpIHtcbiAgICAgIHRoaXMuX2xhbmcgPSB2YWxcbiAgICAgIHJldHVybiB0aGlzLm9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsIHZhbClcbiAgICB9XG5cbiAgICBjYW5MaXN0ZW5Ub0NoYW5nZSAoKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGFkZENoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spXG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIgKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaVxuXG4gICAgICBpZiAoKGkgPSB0aGlzLmNoYW5nZUxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpXG4gICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlSZXBsYWNlbWVudHMgKHJlcGxhY2VtZW50cykge1xuICAgICAgaWYgKHJlcGxhY2VtZW50cy5sZW5ndGggPiAwICYmIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbdGhpcy5nZXRDdXJzb3JQb3MoKV1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN1cGVyLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgICB9XG4gIH1cblxuICA7XG4gIFRleHRBcmVhRWRpdG9yLnByb3RvdHlwZS5zdGFydExpc3RlbmluZyA9IERvbUtleUxpc3RlbmVyLnByb3RvdHlwZS5zdGFydExpc3RlbmluZ1xuICByZXR1cm4gVGV4dEFyZWFFZGl0b3Jcbn0uY2FsbCh2b2lkIDApKVxuXG5leHBvcnRzLlRleHRBcmVhRWRpdG9yID0gVGV4dEFyZWFFZGl0b3JcbiIsIlxuY29uc3QgRWRpdG9yID0gcmVxdWlyZSgnLi9FZGl0b3InKS5FZGl0b3JcblxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3MnKS5Qb3NcblxudmFyIFRleHRQYXJzZXIgPSBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yIHtcbiAgY29uc3RydWN0b3IgKF90ZXh0KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuX3RleHQgPSBfdGV4dFxuICB9XG5cbiAgdGV4dCAodmFsKSB7XG4gICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl90ZXh0ID0gdmFsXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RleHRcbiAgfVxuXG4gIHRleHRDaGFyQXQgKHBvcykge1xuICAgIHJldHVybiB0aGlzLnRleHQoKVtwb3NdXG4gIH1cblxuICB0ZXh0TGVuIChwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KCkubGVuZ3RoXG4gIH1cblxuICB0ZXh0U3Vic3RyIChzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICB9XG5cbiAgaW5zZXJ0VGV4dEF0ICh0ZXh0LCBwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KHRoaXMudGV4dCgpLnN1YnN0cmluZygwLCBwb3MpICsgdGV4dCArIHRoaXMudGV4dCgpLnN1YnN0cmluZyhwb3MsIHRoaXMudGV4dCgpLmxlbmd0aCkpXG4gIH1cblxuICBzcGxpY2VUZXh0IChzdGFydCwgZW5kLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCAnJykgKyB0aGlzLnRleHQoKS5zbGljZShlbmQpKVxuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zICgpIHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXRcbiAgfVxuXG4gIHNldEN1cnNvclBvcyAoc3RhcnQsIGVuZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgZW5kID0gc3RhcnRcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldCA9IG5ldyBQb3Moc3RhcnQsIGVuZClcbiAgICByZXR1cm4gdGhpcy50YXJnZXRcbiAgfVxufVxuZXhwb3J0cy5UZXh0UGFyc2VyID0gVGV4dFBhcnNlclxuIiwiJ3VzZSBzdHJpY3QnXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0NvZGV3YXZlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gQ29kZXdhdmVcbiAgfVxufSlcblxuY29uc3QgQ29kZXdhdmUgPSByZXF1aXJlKCcuL0NvZGV3YXZlJykuQ29kZXdhdmVcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpLkNvbW1hbmRcblxuY29uc3QgQ29yZUNvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoJy4vY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyJykuQ29yZUNvbW1hbmRQcm92aWRlclxuXG5jb25zdCBKc0NvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoJy4vY21kcy9Kc0NvbW1hbmRQcm92aWRlcicpLkpzQ29tbWFuZFByb3ZpZGVyXG5cbmNvbnN0IFBocENvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoJy4vY21kcy9QaHBDb21tYW5kUHJvdmlkZXInKS5QaHBDb21tYW5kUHJvdmlkZXJcblxuY29uc3QgSHRtbENvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoJy4vY21kcy9IdG1sQ29tbWFuZFByb3ZpZGVyJykuSHRtbENvbW1hbmRQcm92aWRlclxuXG5jb25zdCBGaWxlQ29tbWFuZFByb3ZpZGVyID0gcmVxdWlyZSgnLi9jbWRzL0ZpbGVDb21tYW5kUHJvdmlkZXInKS5GaWxlQ29tbWFuZFByb3ZpZGVyXG5cbmNvbnN0IFN0cmluZ0NvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoJy4vY21kcy9TdHJpbmdDb21tYW5kUHJvdmlkZXInKS5TdHJpbmdDb21tYW5kUHJvdmlkZXJcblxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3MnKS5Qb3NcblxuY29uc3QgV3JhcHBlZFBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvV3JhcHBlZFBvcycpLldyYXBwZWRQb3NcblxuY29uc3QgTG9jYWxTdG9yYWdlRW5naW5lID0gcmVxdWlyZSgnLi9zdG9yYWdlRW5naW5lcy9Mb2NhbFN0b3JhZ2VFbmdpbmUnKS5Mb2NhbFN0b3JhZ2VFbmdpbmVcblxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxuY29uc3QgQ21kSW5zdGFuY2UgPSByZXF1aXJlKCcuL0NtZEluc3RhbmNlJykuQ21kSW5zdGFuY2VcblxuY29uc3QgQ21kRmluZGVyID0gcmVxdWlyZSgnLi9DbWRGaW5kZXInKS5DbWRGaW5kZXJcblxuQ29udGV4dC5jbWRJbnN0YW5jZUNsYXNzID0gQ21kSW5zdGFuY2VcbkNvbnRleHQuY21kRmluZGVyQ2xhc3MgPSBDbWRGaW5kZXJcblxuUG9zLndyYXBDbGFzcyA9IFdyYXBwZWRQb3NcbkNvZGV3YXZlLmluc3RhbmNlcyA9IFtdXG5Db21tYW5kLnByb3ZpZGVycyA9IFtuZXcgQ29yZUNvbW1hbmRQcm92aWRlcigpLCBuZXcgSnNDb21tYW5kUHJvdmlkZXIoKSwgbmV3IFBocENvbW1hbmRQcm92aWRlcigpLCBuZXcgSHRtbENvbW1hbmRQcm92aWRlcigpLCBuZXcgRmlsZUNvbW1hbmRQcm92aWRlcigpLCBuZXcgU3RyaW5nQ29tbWFuZFByb3ZpZGVyKCldXG5cbmlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZUVuZ2luZSgpXG59XG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuY29uc3QgQmFzZUNvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQmFzZUNvbW1hbmRcblxuY29uc3QgTGFuZ0RldGVjdG9yID0gcmVxdWlyZSgnLi4vZGV0ZWN0b3JzL0xhbmdEZXRlY3RvcicpLkxhbmdEZXRlY3RvclxuXG5jb25zdCBBbHdheXNFbmFibGVkID0gcmVxdWlyZSgnLi4vZGV0ZWN0b3JzL0Fsd2F5c0VuYWJsZWQnKS5BbHdheXNFbmFibGVkXG5cbmNvbnN0IEJveEhlbHBlciA9IHJlcXVpcmUoJy4uL0JveEhlbHBlcicpLkJveEhlbHBlclxuXG5jb25zdCBFZGl0Q21kUHJvcCA9IHJlcXVpcmUoJy4uL0VkaXRDbWRQcm9wJykuRWRpdENtZFByb3BcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInKS5TdHJpbmdIZWxwZXJcblxuY29uc3QgUGF0aEhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvUGF0aEhlbHBlcicpLlBhdGhIZWxwZXJcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKCcuLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCcpLlJlcGxhY2VtZW50XG5cbnZhciBCb3hDbWQsIENsb3NlQ21kLCBFZGl0Q21kLCBFbW1ldENtZCwgTmFtZVNwYWNlQ21kLCBUZW1wbGF0ZUNtZCwgYWxpYXNDb21tYW5kLCBleGVjX3BhcmVudCwgZ2V0Q29tbWFuZCwgZ2V0Q29udGVudCwgZ2V0UGFyYW0sIGhlbHAsIGxpc3RDb21tYW5kLCBub19leGVjdXRlLCBxdW90ZV9jYXJyZXQsIHJlbW92ZUNvbW1hbmQsIHJlbmFtZUNvbW1hbmQsIHNldENvbW1hbmQsIHN0b3JlSnNvbkNvbW1hbmRcbnZhciBDb3JlQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgQ29yZUNvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChjbWRzKSB7XG4gICAgdmFyIGNvcmVcbiAgICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NvcmUnKSlcbiAgICBjbWRzLmFkZERldGVjdG9yKG5ldyBBbHdheXNFbmFibGVkKCdjb3JlJykpXG4gICAgY29yZS5hZGREZXRlY3RvcihuZXcgTGFuZ0RldGVjdG9yKCkpXG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICBoZWxwOiB7XG4gICAgICAgIHJlcGxhY2VCb3g6IHRydWUsXG4gICAgICAgIHJlc3VsdDogaGVscCxcbiAgICAgICAgcGFyc2U6IHRydWUsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydjbWQnXSxcbiAgICAgICAgaGVscDogJ1RvIGdldCBoZWxwIG9uIGEgcGVjaWZpYyBjb21tYW5kLCBkbyA6XFxufn5oZWxwIGhlbGxvfn4gKGhlbGxvIGJlaW5nIHRoZSBjb21tYW5kKScsXG4gICAgICAgIGNtZHM6IHtcbiAgICAgICAgICBvdmVydmlldzoge1xuICAgICAgICAgICAgcmVwbGFjZUJveDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3VsdDogJ35+Ym94fn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuICBfX18gICAgICAgICBfICAgX18gICAgICBfX1xcbiAvIF9ffF9fXyAgX198IHxfX1xcXFwgXFxcXCAgICAvIC9fIF9fXyBfX19fX19cXG4vIC9fXy8gXyBcXFxcLyBfYCAvIC1fXFxcXCBcXFxcL1xcXFwvIC8gX2AgXFxcXCBWIC8gLV8vXFxuXFxcXF9fX19cXFxcX19fL1xcXFxfXyxfXFxcXF9fX3xcXFxcXy9cXFxcXy9cXFxcX18sX3xcXFxcXy9cXFxcX19ffFxcblRoZSB0ZXh0IGVkaXRvciBoZWxwZXJcXG5+fi9xdW90ZV9jYXJyZXR+flxcblxcbldoZW4gdXNpbmcgQ29kZXdhdmUgeW91IHdpbGwgYmUgd3JpdGluZyBjb21tYW5kcyB3aXRoaW4gXFxueW91ciB0ZXh0IGVkaXRvci4gVGhlc2UgY29tbWFuZHMgbXVzdCBiZSBwbGFjZWQgYmV0d2VlbiB0d28gXFxucGFpcnMgb2YgXCJ+XCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXFxuXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiLCB3aXRoIHlvdXIgY3Vyc29yIGluc2lkZSB0aGUgY29tbWFuZFxcbkV4OiB+fiFoZWxsb35+XFxuXFxuWW91IGRvbnQgbmVlZCB0byBhY3R1YWxseSB0eXBlIGFueSBcIn5cIiAodGlsZGUpLiBcXG5QcmVzc2luZyBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XFxud2l0aGluIGEgY29tbWFuZC5cXG5cXG5Db2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxcbkluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxcblRoZSBnZW5lcmF0ZWQgY29tbWVudCBibG9ja3Mgd2lsbCBiZSByZWZlcnJlZCB0byBhcyB3aW5kb3dzIFxcbmluIHRoZSBoZWxwIHNlY3Rpb25zLlxcblxcblRvIGNsb3NlIHRoaXMgd2luZG93IChpLmUuIHJlbW92ZSB0aGlzIGNvbW1lbnQgYmxvY2spLCBwcmVzcyBcXG5cImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXFxufn4hY2xvc2V8fn5cXG5cXG5Vc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcXG5mZWF0dXJlcyBvZiBDb2Rld2F2ZVxcbn5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiBvciB+fiFoZWxwOmRlbW9+flxcblxcbkxpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXFxufn4haGVscDpzdWJqZWN0c35+IG9yIH5+IWhlbHA6c3Vifn4gXFxuXFxufn4hY2xvc2V+flxcbn5+L2JveH5+J1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc3ViamVjdHM6IHtcbiAgICAgICAgICAgIHJlcGxhY2VCb3g6IHRydWUsXG4gICAgICAgICAgICByZXN1bHQ6ICd+fmJveH5+XFxufn4haGVscH5+XFxufn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcXG5+fiFoZWxwOnN1YmplY3Rzfn4gKH5+IWhlbHA6c3Vifn4pXFxufn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdWI6IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmhlbHA6c3ViamVjdHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRfc3RhcnRlZDoge1xuICAgICAgICAgICAgcmVwbGFjZUJveDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3VsdDogJ35+Ym94fn5cXG5UaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cXG5+fiFoZWxsb3x+flxcblxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuXFxuRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcXG5+fiFoZWxwOmVkaXRpbmd+flxcblxcbkNvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxcbm9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xcbn5+IWpzOmZ+flxcbn5+IWpzOmlmfn5cXG4gIH5+IWpzOmxvZ35+XCJ+fiFoZWxsb35+XCJ+fiEvanM6bG9nfn5cXG5+fiEvanM6aWZ+flxcbn5+IS9qczpmfn5cXG5cXG5Db2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXFxucHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuIEVtbWV0IGFiYnJldmlhdGlvbnMgd2lsbCBiZSBcXG51c2VkIGF1dG9tYXRpY2FsbHkgaWYgeW91IGFyZSBpbiBhIEhUTUwgb3IgQ1NTIGZpbGUuXFxufn4hdWw+bGl+fiAoaWYgeW91IGFyZSBpbiBhIGh0bWwgZG9jY3VtZW50KVxcbn5+IWVtbWV0IHVsPmxpfn5cXG5+fiFlbW1ldCBtMiBjc3N+flxcblxcbkNvbW1hbmRzIGFyZSBzdG9yZWQgaW4gbmFtZXNwYWNlcy4gVGhlIHNhbWUgY29tbWFuZCBjYW4gaGF2ZSBcXG5kaWZmZXJlbnQgcmVzdWx0cyBkZXBlbmRpbmcgb24gdGhlIG5hbWVzcGFjZS5cXG5+fiFqczplYWNofn5cXG5+fiFwaHA6b3V0ZXI6ZWFjaH5+XFxufn4hcGhwOmlubmVyOmVhY2h+flxcblxcblNvbWUgb2YgdGhlIG5hbWVzcGFjZXMgYXJlIGFjdGl2ZSBkZXBlbmRpbmcgb24gdGhlIGNvbnRleHQuIFRoZVxcbmZvbGxvd2luZyBjb21tYW5kcyBhcmUgdGhlIHNhbWUgYW5kIHdpbGwgZGlzcGxheSB0aGUgY3VycmVudGx5XFxuYWN0aXZlIG5hbWVzcGFjZS4gVGhlIGZpcnN0IGNvbW1hbmQgY29tbWFuZCB3b3JrcyBiZWNhdXNlIHRoZSBcXG5jb3JlIG5hbWVzcGFjZSBpcyBhY3RpdmUuXFxufn4hbmFtZXNwYWNlfn5cXG5+fiFjb3JlOm5hbWVzcGFjZX5+XFxuXFxuWW91IGNhbiBtYWtlIGEgbmFtZXNwYWNlIGFjdGl2ZSB3aXRoIHRoZSBmb2xsb3dpbmcgY29tbWFuZC5cXG5+fiFuYW1lc3BhY2UgcGhwfn5cXG5cXG5DaGVjayB0aGUgbmFtZXNwYWNlcyBhZ2Fpblxcbn5+IW5hbWVzcGFjZX5+XFxuXFxuSW4gYWRkaXRpb24gdG8gZGV0ZWN0aW5nIHRoZSBkb2N1bWVudCB0eXBlLCBDb2Rld2F2ZSBjYW4gZGV0ZWN0IHRoZVxcbmNvbnRleHQgZnJvbSB0aGUgc3Vycm91bmRpbmcgdGV4dC4gSW4gYSBQSFAgZmlsZSwgaXQgbWVhbnMgQ29kZXdhdmUgXFxud2lsbCBhZGQgdGhlIFBIUCB0YWdzIHdoZW4geW91IG5lZWQgdGhlbS5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZW1vOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpoZWxwOmdldF9zdGFydGVkJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZWRpdGluZzoge1xuICAgICAgICAgICAgY21kczoge1xuICAgICAgICAgICAgICBpbnRybzoge1xuICAgICAgICAgICAgICAgIHJlc3VsdDogJ0NvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXFxucHV0IHlvdXIgY29udGVudCBpbnNpZGUgXCJzb3VyY2VcIiB0aGUgZG8gXCJzYXZlXCIuIFRyeSBhZGRpbmcgYW55IFxcbnRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXFxufn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxcblxcbklmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XFxuZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxcbndoZW5ldmVyIHlvdSB3YW50Llxcbn5+IW15X25ld19jb21tYW5kfn4nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXBsYWNlQm94OiB0cnVlLFxuICAgICAgICAgICAgcmVzdWx0OiBcIn5+Ym94fn5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxuXFxuQWxsIHRoZSB3aW5kb3dzIG9mIENvZGV3YXZlIGFyZSBtYWRlIHdpdGggdGhlIGNvbW1hbmQgXFxcImJveFxcXCIuIFxcblRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXFxuVGhleSBhcmUgdmFsaWQgY29tbWVudHMgc28gdGhleSB3b24ndCBicmVhayB5b3VyIGNvZGUgYW5kIHRoZSBjb21tYW5kIFxcblxcXCJjbG9zZVxcXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxcbmNvbW1hbmRzIHdpdGggdGhlbSBpZiB5b3UgbmVlZCB0byBkaXNwbGF5IHNvbWUgdGV4dCB0ZW1wb3JhcmlseS5cXG5+fiFib3h+flxcblRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcXG5+fiFjbG9zZXx+flxcbn5+IS9ib3h+flxcblxcbn5+cXVvdGVfY2FycmV0fn5cXG5XaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxcbndpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcXFwifFxcXCIgXFxuKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcXG5jaGFyYWN0ZXIuXFxufn4hYm94fn5cXG5vbmUgOiB8IFxcbnR3byA6IHx8XFxufn4hL2JveH5+XFxuXFxuWW91IGNhbiBhbHNvIHVzZSB0aGUgXFxcImVzY2FwZV9waXBlc1xcXCIgY29tbWFuZCB0aGF0IHdpbGwgZXNjYXBlIGFueSBcXG52ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xcbn5+IWVzY2FwZV9waXBlc35+XFxufFxcbn5+IS9lc2NhcGVfcGlwZXN+flxcblxcbkNvbW1hbmRzIGluc2lkZSBvdGhlciBjb21tYW5kcyB3aWxsIGJlIGV4cGFuZGVkIGF1dG9tYXRpY2FsbHkuXFxuSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxcbnRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXFxcIiFcXFwiIChleGNsYW1hdGlvbiBtYXJrKS5cXG5+fiEhaGVsbG9+flxcblxcbkZvciBjb21tYW5kcyB0aGF0IGhhdmUgYm90aCBhbiBvcGVuaW5nIGFuZCBhIGNsb3NpbmcgdGFnLCB5b3UgY2FuIHVzZVxcbnRoZSBcXFwiY29udGVudFxcXCIgY29tbWFuZC4gXFxcImNvbnRlbnRcXFwiIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGV4dFxcbnRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cXG5+fiFlZGl0IHBocDppbm5lcjppZn5+XFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVkaXQ6IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmhlbHA6ZWRpdGluZydcbiAgICAgICAgICB9LFxuICAgICAgICAgIG5vdF9mb3VuZDogJ35+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBub19leGVjdXRlOiB7XG4gICAgICAgIHJlc3VsdDogbm9fZXhlY3V0ZSxcbiAgICAgICAgaGVscDogJ1ByZXZlbnQgZXZlcnl0aGluZyBpbnNpZGUgdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBmcm9tIGV4ZWN1dGluZydcbiAgICAgIH0sXG4gICAgICBlc2NhcGVfcGlwZXM6IHtcbiAgICAgICAgcmVzdWx0OiBxdW90ZV9jYXJyZXQsXG4gICAgICAgIGNoZWNrQ2FycmV0OiBmYWxzZSxcbiAgICAgICAgaGVscDogJ0VzY2FwZSBhbGwgY2FycmV0cyAoZnJvbSBcInxcIiB0byBcInx8XCIpJ1xuICAgICAgfSxcbiAgICAgIHF1b3RlX2NhcnJldDoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTplc2NhcGVfcGlwZXMnXG4gICAgICB9LFxuICAgICAgZXhlY19wYXJlbnQ6IHtcbiAgICAgICAgZXhlY3V0ZTogZXhlY19wYXJlbnQsXG4gICAgICAgIGhlbHA6IFwiRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1wiXG4gICAgICB9LFxuICAgICAgY29udGVudDoge1xuICAgICAgICByZXN1bHQ6IGdldENvbnRlbnQsXG4gICAgICAgIGhlbHA6ICdNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIHdoYXQgd2FzIGJldHdlZW4gdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBvZiBhIGNvbW1hbmQnXG4gICAgICB9LFxuICAgICAgYm94OiB7XG4gICAgICAgIGNsczogQm94Q21kLFxuICAgICAgICBoZWxwOiBcIkNyZWF0ZSB0aGUgYXBwYXJlbmNlIG9mIGEgYm94IGNvbXBvc2VkIGZyb20gY2hhcmFjdGVycy4gXFxuVXN1YWxseSB3cmFwcGVkIGluIGEgY29tbWVudC5cXG5cXG5UaGUgYm94IHdpbGwgdHJ5IHRvIGFqdXN0IGl0J3Mgc2l6ZSBmcm9tIHRoZSBjb250ZW50XCJcbiAgICAgIH0sXG4gICAgICBjbG9zZToge1xuICAgICAgICBjbHM6IENsb3NlQ21kLFxuICAgICAgICBoZWxwOiAnV2lsbCBjbG9zZSB0aGUgZmlyc3QgYm94IGFyb3VuZCB0aGlzJ1xuICAgICAgfSxcbiAgICAgIHBhcmFtOiB7XG4gICAgICAgIHJlc3VsdDogZ2V0UGFyYW0sXG4gICAgICAgIGhlbHA6ICdNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIGEgcGFyYW1ldGVyIGZyb20gdGhpcyBjb21tYW5kIGNhbGxcXG5cXG5Zb3UgY2FuIHBhc3MgYSBudW1iZXIsIGEgc3RyaW5nLCBvciBib3RoLiBcXG5BIG51bWJlciBmb3IgYSBwb3NpdGlvbmVkIGFyZ3VtZW50IGFuZCBhIHN0cmluZ1xcbmZvciBhIG5hbWVkIHBhcmFtZXRlcidcbiAgICAgIH0sXG4gICAgICBlZGl0OiB7XG4gICAgICAgIGNtZHM6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICAgc2F2ZToge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6ZXhlY19wYXJlbnQnXG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgY2xzOiBFZGl0Q21kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnY21kJ10sXG4gICAgICAgIGhlbHA6ICdBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxcblNlZSB+fiFoZWxwOmVkaXRpbmd+fiBmb3IgYSBxdWljayB0dXRvcmlhbCdcbiAgICAgIH0sXG4gICAgICByZW5hbWU6IHtcbiAgICAgICAgY21kczoge1xuICAgICAgICAgIG5vdF9hcHBsaWNhYmxlOiAnfn5ib3h+flxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+JyxcbiAgICAgICAgICBub3RfZm91bmQ6ICd+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgICB9LFxuICAgICAgICByZXN1bHQ6IHJlbmFtZUNvbW1hbmQsXG4gICAgICAgIHBhcnNlOiB0cnVlLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnZnJvbScsICd0byddLFxuICAgICAgICBoZWxwOiBcIkFsbG93cyB0byByZW5hbWUgYSBjb21tYW5kIGFuZCBjaGFuZ2UgaXQncyBuYW1lc3BhY2UuIFxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG4tIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcXG4tIFRoZW4gc2Vjb25kIHBhcmFtIGlzIHRoZSBuZXcgbmFtZSwgaWYgaXQgaGFzIG5vIG5hbWVzcGFjZSxcXG4gIGl0IHdpbGwgdXNlIHRoZSBvbmUgZnJvbSB0aGUgb3JpZ2luYWwgY29tbWFuZC5cXG5cXG5leC46IH5+IXJlbmFtZSBteV9jb21tYW5kIG15X2NvbW1hbmQyfn5cIlxuICAgICAgfSxcbiAgICAgIHJlbW92ZToge1xuICAgICAgICBjbWRzOiB7XG4gICAgICAgICAgbm90X2FwcGxpY2FibGU6ICd+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nLFxuICAgICAgICAgIG5vdF9mb3VuZDogJ35+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdDogcmVtb3ZlQ29tbWFuZCxcbiAgICAgICAgcGFyc2U6IHRydWUsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydjbWQnXSxcbiAgICAgICAgaGVscDogJ0FsbG93cyB0byByZW1vdmUgYSBjb21tYW5kLiBcXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuJ1xuICAgICAgfSxcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIGNtZHM6IHtcbiAgICAgICAgICBub3RfZm91bmQ6ICd+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgICB9LFxuICAgICAgICByZXN1bHQ6IGFsaWFzQ29tbWFuZCxcbiAgICAgICAgcGFyc2U6IHRydWVcbiAgICAgIH0sXG4gICAgICBuYW1lc3BhY2U6IHtcbiAgICAgICAgY2xzOiBOYW1lU3BhY2VDbWQsXG4gICAgICAgIGhlbHA6ICdTaG93IHRoZSBjdXJyZW50IG5hbWVzcGFjZXMuXFxuXFxuQSBuYW1lIHNwYWNlIGNvdWxkIGJlIHRoZSBuYW1lIG9mIHRoZSBsYW5ndWFnZVxcbm9yIG90aGVyIGtpbmQgb2YgY29udGV4dHNcXG5cXG5JZiB5b3UgcGFzcyBhIHBhcmFtIHRvIHRoaXMgY29tbWFuZCwgaXQgd2lsbCBcXG5hZGQgdGhlIHBhcmFtIGFzIGEgbmFtZXNwYWNlIGZvciB0aGUgY3VycmVudCBlZGl0b3InXG4gICAgICB9LFxuICAgICAgbnNwYzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpuYW1lc3BhY2UnXG4gICAgICB9LFxuICAgICAgbGlzdDoge1xuICAgICAgICByZXN1bHQ6IGxpc3RDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZScsICdib3gnLCAnY29udGV4dCddLFxuICAgICAgICByZXBsYWNlQm94OiB0cnVlLFxuICAgICAgICBwYXJzZTogdHJ1ZSxcbiAgICAgICAgaGVscDogJ0xpc3QgYXZhaWxhYmxlIGNvbW1hbmRzXFxuXFxuWW91IGNhbiB1c2UgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGNob29zZSBhIHNwZWNpZmljIG5hbWVzcGFjZSwgXFxuYnkgZGVmYXVsdCBhbGwgY3VyZW50IG5hbWVzcGFjZSB3aWxsIGJlIHNob3duJ1xuICAgICAgfSxcbiAgICAgIGxzOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmxpc3QnXG4gICAgICB9LFxuICAgICAgZ2V0OiB7XG4gICAgICAgIHJlc3VsdDogZ2V0Q29tbWFuZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ25hbWUnXSxcbiAgICAgICAgaGVscDogJ291dHB1dCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZSdcbiAgICAgIH0sXG4gICAgICBzZXQ6IHtcbiAgICAgICAgcmVzdWx0OiBzZXRDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZScsICd2YWx1ZScsICd2YWwnXSxcbiAgICAgICAgaGVscDogJ3NldCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZSdcbiAgICAgIH0sXG4gICAgICBzdG9yZV9qc29uOiB7XG4gICAgICAgIHJlc3VsdDogc3RvcmVKc29uQ29tbWFuZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ25hbWUnLCAnanNvbiddLFxuICAgICAgICBoZWxwOiAnc2V0IGEgdmFyaWFibGUgd2l0aCBzb21lIGpzb24gZGF0YSdcbiAgICAgIH0sXG4gICAgICBqc29uOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOnN0b3JlX2pzb24nXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgY2xzOiBUZW1wbGF0ZUNtZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ25hbWUnLCAnc2VwJ10sXG4gICAgICAgIGhlbHA6ICdyZW5kZXIgYSB0ZW1wbGF0ZSBmb3IgYSB2YXJpYWJsZVxcblxcbklmIHRoZSBmaXJzdCBwYXJhbSBpcyBub3Qgc2V0IGl0IHdpbGwgdXNlIGFsbCB2YXJpYWJsZXMgXFxuZm9yIHRoZSByZW5kZXJcXG5JZiB0aGUgdmFyaWFibGUgaXMgYW4gYXJyYXkgdGhlIHRlbXBsYXRlIHdpbGwgYmUgcmVwZWF0ZWQgXFxuZm9yIGVhY2ggaXRlbXNcXG5UaGUgYHNlcGAgcGFyYW0gZGVmaW5lIHdoYXQgd2lsbCBzZXBhcmF0ZSBlYWNoIGl0ZW0gXFxuYW5kIGRlZmF1bHQgdG8gYSBsaW5lIGJyZWFrJ1xuICAgICAgfSxcbiAgICAgIGVtbWV0OiB7XG4gICAgICAgIGNsczogRW1tZXRDbWQsXG4gICAgICAgIGhlbHA6ICdDb2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXFxucHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuXFxuXFxuUGFzcyB0aGUgRW1tZXQgYWJicmV2aWF0aW9uIGFzIGEgcGFyYW0gdG8gZXhwZW5kIGl0LidcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5leHBvcnRzLkNvcmVDb21tYW5kUHJvdmlkZXIgPSBDb3JlQ29tbWFuZFByb3ZpZGVyXG5cbmhlbHAgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGNtZCwgY21kTmFtZSwgaGVscENtZCwgc3ViY29tbWFuZHMsIHRleHRcbiAgY21kTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pXG5cbiAgaWYgKGNtZE5hbWUgIT0gbnVsbCkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKGNtZE5hbWUpXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGhlbHBDbWQgPSBjbWQuZ2V0Q21kKCdoZWxwJylcbiAgICAgIHRleHQgPSBoZWxwQ21kID8gYH5+JHtoZWxwQ21kLmZ1bGxOYW1lfX5+YCA6ICdUaGlzIGNvbW1hbmQgaGFzIG5vIGhlbHAgdGV4dCdcbiAgICAgIHN1YmNvbW1hbmRzID0gY21kLmNtZHMubGVuZ3RoID8gYFxcblN1Yi1Db21tYW5kcyA6XFxufn5scyAke2NtZC5mdWxsTmFtZX0gYm94Om5vIGNvbnRleHQ6bm9+fmAgOiAnJ1xuICAgICAgcmV0dXJuIGB+fmJveH5+XFxuSGVscCBmb3Igfn4hJHtjbWQuZnVsbE5hbWV9fn4gOlxcblxcbiR7dGV4dH1cXG4ke3N1YmNvbW1hbmRzfVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnfn5ub3RfZm91bmR+fidcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICd+fmhlbHA6b3ZlcnZpZXd+fidcbiAgfVxufVxuXG5ub19leGVjdXRlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciByZWdcbiAgcmVnID0gbmV3IFJlZ0V4cCgnXignICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzKSArICcpJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoaW5zdGFuY2UuY29kZXdhdmUubm9FeGVjdXRlQ2hhcikpXG4gIHJldHVybiBpbnN0YW5jZS5zdHIucmVwbGFjZShyZWcsICckMScpXG59XG5cbnF1b3RlX2NhcnJldCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICByZXR1cm4gaW5zdGFuY2UuY29udGVudC5yZXBsYWNlKC9cXHwvZywgJ3x8Jylcbn1cblxuZXhlY19wYXJlbnQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIHJlc1xuXG4gIGlmIChpbnN0YW5jZS5wYXJlbnQgIT0gbnVsbCkge1xuICAgIHJlcyA9IGluc3RhbmNlLnBhcmVudC5leGVjdXRlKClcbiAgICBpbnN0YW5jZS5yZXBsYWNlU3RhcnQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZVN0YXJ0XG4gICAgaW5zdGFuY2UucmVwbGFjZUVuZCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlRW5kXG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5cbmdldENvbnRlbnQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGFmZml4ZXNfZW1wdHksIHByZWZpeCwgc3VmZml4XG4gIGFmZml4ZXNfZW1wdHkgPSBpbnN0YW5jZS5nZXRQYXJhbShbJ2FmZml4ZXNfZW1wdHknXSwgZmFsc2UpXG4gIHByZWZpeCA9IGluc3RhbmNlLmdldFBhcmFtKFsncHJlZml4J10sICcnKVxuICBzdWZmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3N1ZmZpeCddLCAnJylcblxuICBpZiAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHByZWZpeCArIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlLmNvbnRlbnQgfHwgJycpICsgc3VmZml4XG4gIH1cblxuICBpZiAoYWZmaXhlc19lbXB0eSkge1xuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXhcbiAgfVxufVxuXG5yZW5hbWVDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICB2YXIgc3RvcmFnZVxuICAgIHN0b3JhZ2UgPSBDb21tYW5kLnN0b3JhZ2VcbiAgICByZXR1cm4gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgfSkudGhlbihzYXZlZENtZHMgPT4ge1xuICAgIHZhciBjbWQsIGNtZERhdGEsIG5ld05hbWUsIG9yaWduaW5hbE5hbWVcbiAgICBvcmlnbmluYWxOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmcm9tJ10pXG4gICAgbmV3TmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAndG8nXSlcblxuICAgIGlmIChvcmlnbmluYWxOYW1lICE9IG51bGwgJiYgbmV3TmFtZSAhPSBudWxsKSB7XG4gICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChvcmlnbmluYWxOYW1lKVxuXG4gICAgICBpZiAoc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdICE9IG51bGwgJiYgY21kICE9IG51bGwpIHtcbiAgICAgICAgaWYgKCEobmV3TmFtZS5pbmRleE9mKCc6JykgPiAtMSkpIHtcbiAgICAgICAgICBuZXdOYW1lID0gY21kLmZ1bGxOYW1lLnJlcGxhY2Uob3JpZ25pbmFsTmFtZSwgJycpICsgbmV3TmFtZVxuICAgICAgICB9XG5cbiAgICAgICAgY21kRGF0YSA9IHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXVxuXG4gICAgICAgIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKG5ld05hbWUsIGNtZERhdGEpXG5cbiAgICAgICAgY21kLnVucmVnaXN0ZXIoKVxuICAgICAgICBzYXZlZENtZHNbbmV3TmFtZV0gPSBjbWREYXRhXG4gICAgICAgIGRlbGV0ZSBzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV1cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBzdG9yYWdlLnNhdmUoJ2NtZHMnLCBzYXZlZENtZHMpXG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJ35+bm90X2FwcGxpY2FibGV+fidcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnfn5ub3RfZm91bmR+fidcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5cbnJlbW92ZUNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgIHZhciBuYW1lXG4gICAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pXG5cbiAgICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBzYXZlZENtZHMsIHN0b3JhZ2VcbiAgICAgICAgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZVxuICAgICAgICByZXR1cm4gc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAgIH0pLnRoZW4oc2F2ZWRDbWRzID0+IHtcbiAgICAgICAgdmFyIGNtZCwgY21kRGF0YVxuICAgICAgICBjbWQgPSBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldENtZChuYW1lKVxuXG4gICAgICAgIGlmIChzYXZlZENtZHNbbmFtZV0gIT0gbnVsbCAmJiBjbWQgIT0gbnVsbCkge1xuICAgICAgICAgIGNtZERhdGEgPSBzYXZlZENtZHNbbmFtZV1cbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpXG4gICAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tuYW1lXVxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLnNhdmUoJ2NtZHMnLCBzYXZlZENtZHMpXG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuICd+fm5vdF9hcHBsaWNhYmxlfn4nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICd+fm5vdF9mb3VuZH5+J1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcbn1cblxuYWxpYXNDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgYWxpYXMgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2FsaWFzJ10pXG5cbiAgaWYgKG5hbWUgIT0gbnVsbCAmJiBhbGlhcyAhPSBudWxsKSB7XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQobmFtZSlcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kID0gY21kLmdldEFsaWFzZWQoKSB8fCBjbWQgLy8gdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAvLyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcblxuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7XG4gICAgICAgIGFsaWFzT2Y6IGNtZC5mdWxsTmFtZVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnfn5ub3RfZm91bmR+fidcbiAgICB9XG4gIH1cbn1cblxubGlzdENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGJveCwgY29tbWFuZHMsIGNvbnRleHQsIG5hbWUsIG5hbWVzcGFjZXMsIHRleHQsIHVzZUNvbnRleHRcbiAgYm94ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnYm94J10sIHRydWUpXG4gIHVzZUNvbnRleHQgPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydjb250ZXh0J10sIHRydWUpXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgbmFtZXNwYWNlcyA9IG5hbWUgPyBbbmFtZV0gOiBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKS5maWx0ZXIobnNwYyA9PiB7XG4gICAgcmV0dXJuIG5zcGMgIT09IGluc3RhbmNlLmNtZC5mdWxsTmFtZVxuICB9KS5jb25jYXQoJ19yb290JylcbiAgY29udGV4dCA9IHVzZUNvbnRleHQgPyBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpIDogaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHRcbiAgY29tbWFuZHMgPSBuYW1lc3BhY2VzLnJlZHVjZSgoY29tbWFuZHMsIG5zcGMpID0+IHtcbiAgICB2YXIgY21kXG4gICAgY21kID0gbnNwYyA9PT0gJ19yb290JyA/IENvbW1hbmQuY21kcyA6IGNvbnRleHQuZ2V0Q21kKG5zcGMsIHtcbiAgICAgIG11c3RFeGVjdXRlOiBmYWxzZVxuICAgIH0pXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KClcblxuICAgICAgaWYgKGNtZC5jbWRzKSB7XG4gICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGNtZC5jbWRzKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb21tYW5kc1xuICB9LCBbXSlcbiAgdGV4dCA9IGNvbW1hbmRzLmxlbmd0aCA/IGNvbW1hbmRzLm1hcChjbWQgPT4ge1xuICAgIGNtZC5pbml0KClcbiAgICByZXR1cm4gKGNtZC5pc0V4ZWN1dGFibGUoKSA/ICd+fiEnIDogJ35+IWxzICcpICsgY21kLmZ1bGxOYW1lICsgJ35+J1xuICB9KS5qb2luKCdcXG4nKSA6ICdUaGlzIGNvbnRhaW5zIG5vIHN1Yi1jb21tYW5kcydcblxuICBpZiAoYm94KSB7XG4gICAgcmV0dXJuIGB+fmJveH5+XFxuJHt0ZXh0fVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRleHRcbiAgfVxufVxuXG5nZXRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCByZXNcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKVxuICByZXMgPSBQYXRoSGVscGVyLmdldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSlcblxuICBpZiAodHlwZW9mIHJlcyA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAnICAnKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiByZXNcbiAgfVxufVxuXG5zZXRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWxcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKVxuICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAndmFsdWUnLCAndmFsJ10pKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogdm9pZCAwXG5cbiAgUGF0aEhlbHBlci5zZXRQYXRoKGluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIG5hbWUsIHZhbClcblxuICByZXR1cm4gJydcbn1cblxuc3RvcmVKc29uQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgbmFtZSwgcCwgdmFsXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2pzb24nXSkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiB2b2lkIDBcblxuICBQYXRoSGVscGVyLnNldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSwgSlNPTi5wYXJzZSh2YWwpKVxuXG4gIHJldHVybiAnJ1xufVxuXG5nZXRQYXJhbSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICBpZiAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UuZ2V0UGFyYW0oaW5zdGFuY2UucGFyYW1zLCBpbnN0YW5jZS5nZXRQYXJhbShbJ2RlZicsICdkZWZhdWx0J10pKVxuICB9XG59XG5cbkJveENtZCA9IGNsYXNzIEJveENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCAoKSB7XG4gICAgdGhpcy5oZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuaW5zdGFuY2UuY29udGV4dClcbiAgICB0aGlzLmNtZCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydjbWQnXSlcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmhlbHBlci5vcGVuVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY21kICsgdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzXG4gICAgICB0aGlzLmhlbHBlci5jbG9zZVRleHQgPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY21kLnNwbGl0KCcgJylbMF0gKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICB9XG5cbiAgICB0aGlzLmhlbHBlci5kZWNvID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5kZWNvXG4gICAgdGhpcy5oZWxwZXIucGFkID0gMlxuICAgIHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydwcmVmaXgnXSwgJycpXG4gICAgcmV0dXJuIHRoaXMuaGVscGVyLnN1ZmZpeCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpXG4gIH1cblxuICBoZWlnaHQgKCkge1xuICAgIHZhciBoZWlnaHQsIHBhcmFtc1xuXG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5ib3VuZHMoKS5oZWlnaHRcbiAgICB9IGVsc2Uge1xuICAgICAgaGVpZ2h0ID0gM1xuICAgIH1cblxuICAgIHBhcmFtcyA9IFsnaGVpZ2h0J11cblxuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgxKVxuICAgIH0gZWxzZSBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLnB1c2goMClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIGhlaWdodClcbiAgfVxuXG4gIHdpZHRoICgpIHtcbiAgICB2YXIgcGFyYW1zLCB3aWR0aFxuXG4gICAgaWYgKHRoaXMuYm91bmRzKCkgIT0gbnVsbCkge1xuICAgICAgd2lkdGggPSB0aGlzLmJvdW5kcygpLndpZHRoXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpZHRoID0gM1xuICAgIH1cblxuICAgIHBhcmFtcyA9IFsnd2lkdGgnXVxuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApXG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWF4KHRoaXMubWluV2lkdGgoKSwgdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShwYXJhbXMsIHdpZHRoKSlcbiAgfVxuXG4gIGJvdW5kcyAoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuY29udGVudCkge1xuICAgICAgaWYgKHRoaXMuX2JvdW5kcyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2JvdW5kcyA9IHRoaXMuaGVscGVyLnRleHRCb3VuZHModGhpcy5pbnN0YW5jZS5jb250ZW50KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fYm91bmRzXG4gICAgfVxuICB9XG5cbiAgcmVzdWx0ICgpIHtcbiAgICB0aGlzLmhlbHBlci5oZWlnaHQgPSB0aGlzLmhlaWdodCgpXG4gICAgdGhpcy5oZWxwZXIud2lkdGggPSB0aGlzLndpZHRoKClcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuZHJhdyh0aGlzLmluc3RhbmNlLmNvbnRlbnQpXG4gIH1cblxuICBtaW5XaWR0aCAoKSB7XG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNtZC5sZW5ndGhcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gIH1cbn1cbkNsb3NlQ21kID0gY2xhc3MgQ2xvc2VDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQgKCkge1xuICAgIHJldHVybiB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KVxuICB9XG5cbiAgZXhlY3V0ZSAoKSB7XG4gICAgdmFyIGJveCwgYm94MiwgZGVwdGgsIHByZWZpeCwgcmVxdWlyZWRfYWZmaXhlcywgc3VmZml4XG4gICAgcHJlZml4ID0gdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJylcbiAgICBzdWZmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKVxuICAgIGJveCA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKVxuICAgIHJlcXVpcmVkX2FmZml4ZXMgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncmVxdWlyZWRfYWZmaXhlcyddLCB0cnVlKVxuXG4gICAgaWYgKCFyZXF1aXJlZF9hZmZpeGVzKSB7XG4gICAgICB0aGlzLmhlbHBlci5wcmVmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSAnJ1xuICAgICAgYm94MiA9IHRoaXMuaGVscGVyLmdldEJveEZvclBvcyh0aGlzLmluc3RhbmNlLmdldFBvcygpKVxuXG4gICAgICBpZiAoYm94MiAhPSBudWxsICYmIChib3ggPT0gbnVsbCB8fCBib3guc3RhcnQgPCBib3gyLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCB8fCBib3guZW5kID4gYm94Mi5lbmQgKyBzdWZmaXgubGVuZ3RoKSkge1xuICAgICAgICBib3ggPSBib3gyXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJveCAhPSBudWxsKSB7XG4gICAgICBkZXB0aCA9IHRoaXMuaGVscGVyLmdldE5lc3RlZEx2bCh0aGlzLmluc3RhbmNlLmdldFBvcygpLnN0YXJ0KVxuXG4gICAgICBpZiAoZGVwdGggPCAyKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UuaW5Cb3ggPSBudWxsXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmFwcGx5UmVwbGFjZW1lbnQobmV3IFJlcGxhY2VtZW50KGJveC5zdGFydCwgYm94LmVuZCwgJycpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5yZXBsYWNlV2l0aCgnJylcbiAgICB9XG4gIH1cbn1cbkVkaXRDbWQgPSBjbGFzcyBFZGl0Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0ICgpIHtcbiAgICB2YXIgcmVmXG4gICAgdGhpcy5jbWROYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2NtZCddKVxuICAgIHRoaXMudmVyYmFsaXplID0gKHJlZiA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzFdKSkgPT09ICd2JyB8fCByZWYgPT09ICd2ZXJiYWxpemUnXG5cbiAgICBpZiAodGhpcy5jbWROYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpLmdldEZpbmRlcih0aGlzLmNtZE5hbWUpXG4gICAgICB0aGlzLmZpbmRlci51c2VGYWxsYmFja3MgPSBmYWxzZVxuICAgICAgdGhpcy5jbWQgPSB0aGlzLmZpbmRlci5maW5kKClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lZGl0YWJsZSA9IHRoaXMuY21kICE9IG51bGwgPyB0aGlzLmNtZC5pc0VkaXRhYmxlKCkgOiB0cnVlXG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhDb250ZW50KClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0V2l0aG91dENvbnRlbnQoKVxuICAgIH1cbiAgfVxuXG4gIHJlc3VsdFdpdGhDb250ZW50ICgpIHtcbiAgICB2YXIgZGF0YSwgaSwgbGVuLCBwLCBwYXJzZXIsIHJlZlxuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpXG4gICAgcGFyc2VyLnBhcnNlQWxsKClcbiAgICBkYXRhID0ge31cbiAgICByZWYgPSBFZGl0Q21kLnByb3BzXG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHAgPSByZWZbaV1cbiAgICAgIHAud3JpdGVGb3IocGFyc2VyLCBkYXRhKVxuICAgIH1cblxuICAgIENvbW1hbmQuc2F2ZUNtZCh0aGlzLmNtZE5hbWUsIGRhdGEpXG5cbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIHByb3BzRGlzcGxheSAoKSB7XG4gICAgdmFyIGNtZFxuICAgIGNtZCA9IHRoaXMuY21kXG4gICAgcmV0dXJuIEVkaXRDbWQucHJvcHMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gcC5kaXNwbGF5KGNtZClcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBwICE9IG51bGxcbiAgICB9KS5qb2luKCdcXG4nKVxuICB9XG5cbiAgcmVzdWx0V2l0aG91dENvbnRlbnQgKCkge1xuICAgIHZhciBuYW1lLCBwYXJzZXJcblxuICAgIGlmICghdGhpcy5jbWQgfHwgdGhpcy5lZGl0YWJsZSkge1xuICAgICAgbmFtZSA9IHRoaXMuY21kID8gdGhpcy5jbWQuZnVsbE5hbWUgOiB0aGlzLmNtZE5hbWVcbiAgICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dChgfn5ib3ggY21kOlwiJHt0aGlzLmluc3RhbmNlLmNtZC5mdWxsTmFtZX0gJHtuYW1lfVwifn5cXG4ke3RoaXMucHJvcHNEaXNwbGF5KCl9XFxufn4hc2F2ZX5+IH5+IWNsb3Nlfn5cXG5+fi9ib3h+fmApXG4gICAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuXG4gICAgICBpZiAodGhpcy52ZXJiYWxpemUpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5nZXRUZXh0KClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5FZGl0Q21kLnNldENtZHMgPSBmdW5jdGlvbiAoYmFzZSkge1xuICB2YXIgaSwgaW5JbnN0YW5jZSwgbGVuLCBwLCByZWZcbiAgaW5JbnN0YW5jZSA9IGJhc2UuaW5faW5zdGFuY2UgPSB7XG4gICAgY21kczoge31cbiAgfVxuICByZWYgPSBFZGl0Q21kLnByb3BzXG5cbiAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcCA9IHJlZltpXVxuICAgIHAuc2V0Q21kKGluSW5zdGFuY2UuY21kcylcbiAgfSAvLyBwLnNldENtZChiYXNlKVxuXG4gIHJldHVybiBiYXNlXG59XG5cbkVkaXRDbWQucHJvcHMgPSBbbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX2NhcnJldCcsIHtcbiAgb3B0OiAnY2hlY2tDYXJyZXQnXG59KSwgbmV3IEVkaXRDbWRQcm9wLnJldkJvb2woJ25vX3BhcnNlJywge1xuICBvcHQ6ICdwYXJzZSdcbn0pLCBuZXcgRWRpdENtZFByb3AuYm9vbCgncHJldmVudF9wYXJzZV9hbGwnLCB7XG4gIG9wdDogJ3ByZXZlbnRQYXJzZUFsbCdcbn0pLCBuZXcgRWRpdENtZFByb3AuYm9vbCgncmVwbGFjZV9ib3gnLCB7XG4gIG9wdDogJ3JlcGxhY2VCb3gnXG59KSwgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnbmFtZV90b19wYXJhbScsIHtcbiAgb3B0OiAnbmFtZVRvUGFyYW0nXG59KSwgbmV3IEVkaXRDbWRQcm9wLnN0cmluZygnYWxpYXNfb2YnLCB7XG4gIHZhcjogJ2FsaWFzT2YnLFxuICBjYXJyZXQ6IHRydWVcbn0pLCBuZXcgRWRpdENtZFByb3Auc291cmNlKCdoZWxwJywge1xuICBmdW5jdDogJ2hlbHAnLFxuICBzaG93RW1wdHk6IHRydWVcbn0pLCBuZXcgRWRpdENtZFByb3Auc291cmNlKCdzb3VyY2UnLCB7XG4gIHZhcjogJ3Jlc3VsdFN0cicsXG4gIGRhdGFOYW1lOiAncmVzdWx0JyxcbiAgc2hvd0VtcHR5OiB0cnVlLFxuICBjYXJyZXQ6IHRydWVcbn0pXVxuTmFtZVNwYWNlQ21kID0gY2xhc3MgTmFtZVNwYWNlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMF0pXG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIHZhciBpLCBsZW4sIG5hbWVzcGFjZXMsIG5zcGMsIHBhcnNlciwgdHh0XG5cbiAgICBpZiAodGhpcy5uYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQuYWRkTmFtZVNwYWNlKHRoaXMubmFtZSlcbiAgICAgIHJldHVybiAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VzID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKVxuICAgICAgdHh0ID0gJ35+Ym94fn5cXG4nXG5cbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IG5hbWVzcGFjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbnNwYyA9IG5hbWVzcGFjZXNbaV1cblxuICAgICAgICBpZiAobnNwYyAhPT0gdGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWUpIHtcbiAgICAgICAgICB0eHQgKz0gbnNwYyArICdcXG4nXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdHh0ICs9ICd+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dClcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKVxuICAgIH1cbiAgfVxufVxuVGVtcGxhdGVDbWQgPSBjbGFzcyBUZW1wbGF0ZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCAoKSB7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgICByZXR1cm4gdGhpcy5zZXAgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc2VwJ10sICdcXG4nKVxuICB9XG5cbiAgcmVzdWx0ICgpIHtcbiAgICB2YXIgZGF0YVxuICAgIGRhdGEgPSB0aGlzLm5hbWUgPyBQYXRoSGVscGVyLmdldFBhdGgodGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCB0aGlzLm5hbWUpIDogdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS52YXJzXG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50ICYmIGRhdGEgIT0gbnVsbCAmJiBkYXRhICE9PSBmYWxzZSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclRlbXBsYXRlKGl0ZW0pXG4gICAgICAgIH0pLmpvaW4odGhpcy5zZXApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZShkYXRhKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICByZW5kZXJUZW1wbGF0ZSAoZGF0YSkge1xuICAgIHZhciBwYXJzZXJcbiAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodGhpcy5pbnN0YW5jZS5jb250ZW50KVxuICAgIHBhcnNlci52YXJzID0gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YSA6IHtcbiAgICAgIHZhbHVlOiBkYXRhXG4gICAgfVxuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlXG4gICAgcmV0dXJuIHBhcnNlci5wYXJzZUFsbCgpXG4gIH1cbn1cbkVtbWV0Q21kID0gY2xhc3MgRW1tZXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQgKCkge1xuICAgIHRoaXMuYWJiciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdhYmJyJywgJ2FiYnJldmlhdGlvbiddKVxuICAgIHJldHVybiB0aGlzLmxhbmcgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsxLCAnbGFuZycsICdsYW5ndWFnZSddKVxuICB9XG5cbiAgcmVzdWx0ICgpIHtcbiAgICB2YXIgZW1tZXQsIGV4LCByZXNcblxuICAgIGVtbWV0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciByZWYsIHJlZjFcblxuICAgICAgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgIT09IG51bGwgPyB3aW5kb3cuZW1tZXQgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5lbW1ldFxuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ICE9PSBudWxsID8gKHJlZiA9IHdpbmRvdy5zZWxmKSAhPSBudWxsID8gcmVmLmVtbWV0IDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuc2VsZi5lbW1ldFxuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ICE9PSBudWxsID8gKHJlZjEgPSB3aW5kb3cuZ2xvYmFsKSAhPSBudWxsID8gcmVmMS5lbW1ldCA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93Lmdsb2JhbC5lbW1ldFxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVxdWlyZSAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiByZXF1aXJlKCdlbW1ldCcpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZXggPSBlcnJvclxuICAgICAgICAgIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUubG9nZ2VyLmxvZygnRW1tZXQgaXMgbm90IGF2YWlsYWJsZSwgaXQgbWF5IG5lZWQgdG8gYmUgaW5zdGFsbGVkIG1hbnVhbGx5JylcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfS5jYWxsKHRoaXMpKVxuXG4gICAgaWYgKGVtbWV0ICE9IG51bGwpIHtcbiAgICAgIC8vIGVtbWV0LnJlcXVpcmUoJy4vcGFyc2VyL2FiYnJldmlhdGlvbicpLmV4cGFuZCgndWw+bGknLCB7cGFzdGVkQ29udGVudDonbG9yZW0nfSlcbiAgICAgIHJlcyA9IGVtbWV0LmV4cGFuZEFiYnJldmlhdGlvbih0aGlzLmFiYnIsIHRoaXMubGFuZylcbiAgICAgIHJldHVybiByZXMucmVwbGFjZSgvXFwkXFx7MFxcfS9nLCAnfCcpXG4gICAgfVxuICB9XG59XG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBCb3hIZWxwZXIgPSByZXF1aXJlKCcuLi9Cb3hIZWxwZXInKS5Cb3hIZWxwZXJcblxuY29uc3QgRWRpdENtZFByb3AgPSByZXF1aXJlKCcuLi9FZGl0Q21kUHJvcCcpLkVkaXRDbWRQcm9wXG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IFBhdGhIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL1BhdGhIZWxwZXInKS5QYXRoSGVscGVyXG5cbmNvbnN0IFJlcGxhY2VtZW50ID0gcmVxdWlyZSgnLi4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnKS5SZXBsYWNlbWVudFxuXG52YXIgZGVsZXRlQ29tbWFuZCwgcmVhZENvbW1hbmQsIHdyaXRlQ29tbWFuZFxudmFyIEZpbGVDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBGaWxlQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIgKGNtZHMpIHtcbiAgICB2YXIgY29yZVxuICAgIGNvcmUgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnZmlsZScpKVxuICAgIHJldHVybiBjb3JlLmFkZENtZHMoe1xuICAgICAgcmVhZDoge1xuICAgICAgICByZXN1bHQ6IHJlYWRDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnZmlsZSddLFxuICAgICAgICBoZWxwOiAncmVhZCB0aGUgY29udGVudCBvZiBhIGZpbGUnXG4gICAgICB9LFxuICAgICAgd3JpdGU6IHtcbiAgICAgICAgcmVzdWx0OiB3cml0ZUNvbW1hbmQsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydmaWxlJywgJ2NvbnRlbnQnXSxcbiAgICAgICAgaGVscDogJ3NhdmUgaW50byBhIGZpbGUnXG4gICAgICB9LFxuICAgICAgZGVsZXRlOiB7XG4gICAgICAgIHJlc3VsdDogZGVsZXRlQ29tbWFuZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ2ZpbGUnXSxcbiAgICAgICAgaGVscDogJ2RlbGV0ZSBhIGZpbGUnXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5GaWxlQ29tbWFuZFByb3ZpZGVyID0gRmlsZUNvbW1hbmRQcm92aWRlclxuXG5yZWFkQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgZmlsZSwgZmlsZVN5c3RlbVxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2ZpbGUnXSlcblxuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLnJlYWRGaWxlKGZpbGUpXG4gIH1cbn1cblxud3JpdGVDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBjb250ZW50LCBmaWxlLCBmaWxlU3lzdGVtXG4gIGZpbGVTeXN0ZW0gPSBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRGaWxlU3lzdGVtKClcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKVxuICBjb250ZW50ID0gaW5zdGFuY2UuY29udGVudCB8fCBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2NvbnRlbnQnXSlcblxuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLndyaXRlRmlsZShmaWxlLCBjb250ZW50KVxuICB9XG59XG5cbmRlbGV0ZUNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGZpbGUsIGZpbGVTeXN0ZW1cbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKVxuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pXG5cbiAgaWYgKGZpbGVTeXN0ZW0pIHtcbiAgICByZXR1cm4gZmlsZVN5c3RlbS5kZWxldGVGaWxlKGZpbGUpXG4gIH1cbn1cbiIsIlxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5Db21tYW5kXG5cbnZhciBIdG1sQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgSHRtbENvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChjbWRzKSB7XG4gICAgdmFyIGNzcywgaHRtbFxuICAgIGh0bWwgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnaHRtbCcpKVxuICAgIGh0bWwuYWRkQ21kcyh7XG4gICAgICBmYWxsYmFjazoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTplbW1ldCcsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgbGFuZzogJ2h0bWwnXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWVUb1BhcmFtOiAnYWJicidcbiAgICAgIH1cbiAgICB9KVxuICAgIGNzcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdjc3MnKSlcbiAgICByZXR1cm4gY3NzLmFkZENtZHMoe1xuICAgICAgZmFsbGJhY2s6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6ZW1tZXQnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGxhbmc6ICdjc3MnXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWVUb1BhcmFtOiAnYWJicidcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5leHBvcnRzLkh0bWxDb21tYW5kUHJvdmlkZXIgPSBIdG1sQ29tbWFuZFByb3ZpZGVyXG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuXG52YXIgSnNDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBKc0NvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChjbWRzKSB7XG4gICAgdmFyIGpzXG4gICAganMgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnanMnKSlcbiAgICBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgnamF2YXNjcmlwdCcsIHtcbiAgICAgIGFsaWFzT2Y6ICdqcydcbiAgICB9KSlcbiAgICByZXR1cm4ganMuYWRkQ21kcyh7XG4gICAgICBjb21tZW50OiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgaWY6ICdpZih8KXtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgbG9nOiAnaWYod2luZG93LmNvbnNvbGUpe1xcblxcdGNvbnNvbGUubG9nKH5+Y29udGVudH5+fClcXG59JyxcbiAgICAgIGZ1bmN0aW9uOiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgZnVuY3Q6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgIGY6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgIGZvcjogJ2ZvciAodmFyIGkgPSAwOyBpIDwgfDsgaSsrKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgIGZvcmluOiAnZm9yICh2YXIgdmFsIGluIHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgZWFjaDoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgZm9yZWFjaDoge1xuICAgICAgICBhbGlhc09mOiAnanM6Zm9yaW4nXG4gICAgICB9LFxuICAgICAgd2hpbGU6ICd3aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgIHdoaWxlaTogJ3ZhciBpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5jb250ZW50fn5cXG5cXHRpKys7XFxufScsXG4gICAgICBpZmVsc2U6ICdpZiggfCApIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgICBpZmU6IHtcbiAgICAgICAgYWxpYXNPZjogJ2pzOmlmZWxzZSdcbiAgICAgIH0sXG4gICAgICBzd2l0Y2g6ICdzd2l0Y2goIHwgKSB7IFxcblxcdGNhc2UgOlxcblxcdFxcdH5+Y29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufSdcbiAgICB9KVxuICB9XG59XG5leHBvcnRzLkpzQ29tbWFuZFByb3ZpZGVyID0gSnNDb21tYW5kUHJvdmlkZXJcbiIsIlxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInKS5TdHJpbmdIZWxwZXJcblxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5Db21tYW5kXG5cbmNvbnN0IFBhaXJEZXRlY3RvciA9IHJlcXVpcmUoJy4uL2RldGVjdG9ycy9QYWlyRGV0ZWN0b3InKS5QYWlyRGV0ZWN0b3JcblxudmFyIHdyYXBXaXRoUGhwXG52YXIgUGhwQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgUGhwQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIgKGNtZHMpIHtcbiAgICB2YXIgcGhwLCBwaHBJbm5lciwgcGhwT3V0ZXJcbiAgICBwaHAgPSBjbWRzLmFkZENtZChuZXcgQ29tbWFuZCgncGhwJykpXG4gICAgcGhwLmFkZERldGVjdG9yKG5ldyBQYWlyRGV0ZWN0b3Ioe1xuICAgICAgcmVzdWx0OiAncGhwOmlubmVyJyxcbiAgICAgIG9wZW5lcjogJzw/cGhwJyxcbiAgICAgIGNsb3NlcjogJz8+JyxcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IHRydWUsXG4gICAgICBlbHNlOiAncGhwOm91dGVyJ1xuICAgIH0pKVxuICAgIHBocE91dGVyID0gcGhwLmFkZENtZChuZXcgQ29tbWFuZCgnb3V0ZXInKSlcbiAgICBwaHBPdXRlci5hZGRDbWRzKHtcbiAgICAgIGZhbGxiYWNrOiB7XG4gICAgICAgIGNtZHM6IHtcbiAgICAgICAgICBhbnlfY29udGVudDoge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCcsXG4gICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICBwcmVmaXg6ICcgPz5cXG4nLFxuICAgICAgICAgICAgICBzdWZmaXg6ICdcXG48P3BocCAnLFxuICAgICAgICAgICAgICBhZmZpeGVzX2VtcHR5OiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOiVuYW1lJScsXG4gICAgICAgIGFsdGVyUmVzdWx0OiB3cmFwV2l0aFBocFxuICAgICAgfSxcbiAgICAgIGJveDoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpib3gnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbW1lbnQ6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBwaHA6ICc8P3BocFxcblxcdH5+Y29udGVudH5+fFxcbj8+J1xuICAgIH0pXG4gICAgcGhwSW5uZXIgPSBwaHAuYWRkQ21kKG5ldyBDb21tYW5kKCdpbm5lcicpKVxuICAgIHJldHVybiBwaHBJbm5lci5hZGRDbWRzKHtcbiAgICAgIGFueV9jb250ZW50OiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNvbnRlbnQnXG4gICAgICB9LFxuICAgICAgY29tbWVudDogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgIGlmOiAnaWYofCl7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICBpbmZvOiAncGhwaW5mbygpOycsXG4gICAgICBlY2hvOiAnZWNobyB8JyxcbiAgICAgIGU6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjplY2hvJ1xuICAgICAgfSxcbiAgICAgIGNsYXNzOiB7XG4gICAgICAgIHJlc3VsdDogJ2NsYXNzIH5+cGFyYW0gMCBjbGFzcyBkZWY6fH5+IHtcXG5cXHRmdW5jdGlvbiBfX2NvbnN0cnVjdCgpIHtcXG5cXHRcXHR+fmNvbnRlbnR+fnxcXG5cXHR9XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYzoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmNsYXNzJ1xuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uOiB7XG4gICAgICAgIHJlc3VsdDogJ2Z1bmN0aW9uIHwoKSB7XFxuXFx0fn5jb250ZW50fn5cXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmdW5jdDoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgIGY6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmdW5jdGlvbidcbiAgICAgIH0sXG4gICAgICBhcnJheTogJyR8ID0gYXJyYXkoKTsnLFxuICAgICAgYTogJ2FycmF5KCknLFxuICAgICAgZm9yOiAnZm9yICgkaSA9IDA7ICRpIDwgJHw7ICRpKyspIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgIGZvcmVhY2g6ICdmb3JlYWNoICgkfCBhcyAka2V5ID0+ICR2YWwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgIGVhY2g6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjpmb3JlYWNoJ1xuICAgICAgfSxcbiAgICAgIHdoaWxlOiAnd2hpbGUofCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgd2hpbGVpOiB7XG4gICAgICAgIHJlc3VsdDogJyRpID0gMDtcXG53aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxuXFx0JGkrKztcXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBpZmVsc2U6ICdpZiggfCApIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59IGVsc2Uge1xcblxcdFxcbn0nLFxuICAgICAgaWZlOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6aWZlbHNlJ1xuICAgICAgfSxcbiAgICAgIHN3aXRjaDoge1xuICAgICAgICByZXN1bHQ6ICdzd2l0Y2goIHwgKSB7IFxcblxcdGNhc2UgOlxcblxcdFxcdH5+YW55X2NvbnRlbnR+flxcblxcdFxcdGJyZWFrO1xcblxcdGRlZmF1bHQgOlxcblxcdFxcdFxcblxcdFxcdGJyZWFrO1xcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNsb3NlOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmNsb3NlJyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBwcmVmaXg6ICc8P3BocFxcbicsXG4gICAgICAgICAgc3VmZml4OiAnXFxuPz4nLFxuICAgICAgICAgIHJlcXVpcmVkX2FmZml4ZXM6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5leHBvcnRzLlBocENvbW1hbmRQcm92aWRlciA9IFBocENvbW1hbmRQcm92aWRlclxuXG53cmFwV2l0aFBocCA9IGZ1bmN0aW9uIChyZXN1bHQsIGluc3RhbmNlKSB7XG4gIHZhciBpbmxpbmUsIHJlZ0Nsb3NlLCByZWdPcGVuXG4gIGlubGluZSA9IGluc3RhbmNlLmdldFBhcmFtKFsncGhwX2lubGluZScsICdpbmxpbmUnXSwgdHJ1ZSlcblxuICBpZiAoaW5saW5lKSB7XG4gICAgcmVnT3BlbiA9IC88XFw/cGhwXFxzKFtcXFxcblxcXFxyXFxzXSspL2dcbiAgICByZWdDbG9zZSA9IC8oW1xcblxcclxcc10rKVxcc1xcPz4vZ1xuICAgIHJldHVybiAnPD9waHAgJyArIHJlc3VsdC5yZXBsYWNlKHJlZ09wZW4sICckMTw/cGhwICcpLnJlcGxhY2UocmVnQ2xvc2UsICcgPz4kMScpICsgJyA/PidcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJzw/cGhwXFxuJyArIFN0cmluZ0hlbHBlci5pbmRlbnQocmVzdWx0KSArICdcXG4/PidcbiAgfVxufSAvLyBjbG9zZVBocEZvckNvbnRlbnQgPSAoaW5zdGFuY2UpIC0+XG4vLyAgIGluc3RhbmNlLmNvbnRlbnQgPSAnID8+JysoaW5zdGFuY2UuY29udGVudCB8fCAnJykrJzw/cGhwICdcbiIsIlxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5Db21tYW5kXG5cbmNvbnN0IEFsd2F5c0VuYWJsZWQgPSByZXF1aXJlKCcuLi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZCcpLkFsd2F5c0VuYWJsZWRcblxudmFyIGluZmxlY3Rpb24gPSBpbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoJ2luZmxlY3Rpb24nKSlcblxuZnVuY3Rpb24gaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCAob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iaiB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKSB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldIH0gfSB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmogfSB9XG5cbnZhciBTdHJpbmdDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBTdHJpbmdDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlciAocm9vdCkge1xuICAgIHZhciBjbWRzXG4gICAgY21kcyA9IHJvb3QuYWRkQ21kKG5ldyBDb21tYW5kKCdzdHJpbmcnKSlcbiAgICByb290LmFkZENtZChuZXcgQ29tbWFuZCgnc3RyJywge1xuICAgICAgYWxpYXNPZjogJ3N0cmluZydcbiAgICB9KSlcbiAgICByb290LmFkZERldGVjdG9yKG5ldyBBbHdheXNFbmFibGVkKCdzdHJpbmcnKSlcbiAgICByZXR1cm4gY21kcy5hZGRDbWRzKHtcbiAgICAgIHBsdXJhbGl6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnBsdXJhbGl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0ciddLFxuICAgICAgICBoZWxwOiAnUGx1cmFsaXplIGEgc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIHNpbmd1bGFyaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uc2luZ3VsYXJpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1Npbmd1bGFyaXplIGEgc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGNhbWVsaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2FtZWxpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSksICFpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsICdmaXJzdCddLCB0cnVlKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0cicsICdmaXJzdCddLFxuICAgICAgICBoZWxwOiAnVHJhbnNmb3JtcyBhIFN0cmluZyBmcm9tIHVuZGVyc2NvcmUgdG8gY2FtZWxjYXNlJ1xuICAgICAgfSxcbiAgICAgIHVuZGVyc2NvcmU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi51bmRlcnNjb3JlKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pLCBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsICd1cHBlciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0cicsICd1cHBlciddLFxuICAgICAgICBoZWxwOiAnVHJhbnNmb3JtcyBhIFN0cmluZyBmcm9tIGNhbWVsY2FzZSB0byB1bmRlcnNjb3JlLidcbiAgICAgIH0sXG4gICAgICBodW1hbml6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmh1bWFuaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pLCBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWzEsICdmaXJzdCddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0cicsICdmaXJzdCddLFxuICAgICAgICBoZWxwOiAnVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIGh1bWFuIHJlYWRhYmxlIGZvcm1hdCdcbiAgICAgIH0sXG4gICAgICBjYXBpdGFsaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uY2FwaXRhbGl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0ciddLFxuICAgICAgICBoZWxwOiAnTWFrZSB0aGUgZmlyc3QgbGV0dGVyIG9mIGEgc3RyaW5nIHVwcGVyJ1xuICAgICAgfSxcbiAgICAgIGRhc2hlcml6ZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmRhc2hlcml6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0ciddLFxuICAgICAgICBoZWxwOiAnUmVwbGFjZXMgdW5kZXJzY29yZXMgd2l0aCBkYXNoZXMgaW4gYSBzdHJpbmcuJ1xuICAgICAgfSxcbiAgICAgIHRpdGxlaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24udGl0bGVpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSBodW1hbiByZWFkYWJsZSBmb3JtYXQgd2l0aCBtb3N0IHdvcmRzIGNhcGl0YWxpemVkJ1xuICAgICAgfSxcbiAgICAgIHRhYmxlaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24udGFibGVpemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSkpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydzdHInXSxcbiAgICAgICAgaGVscDogJ1RyYW5zZm9ybXMgYSBTdHJpbmcgdG8gYSB0YWJsZSBmb3JtYXQnXG4gICAgICB9LFxuICAgICAgY2xhc3NpZnk6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5jbGFzc2lmeShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0ciddLFxuICAgICAgICBoZWxwOiAnVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIGNsYXNzIGZvcm1hdCdcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5leHBvcnRzLlN0cmluZ0NvbW1hbmRQcm92aWRlciA9IFN0cmluZ0NvbW1hbmRQcm92aWRlclxuIiwiXG5jb25zdCBEZXRlY3RvciA9IHJlcXVpcmUoJy4vRGV0ZWN0b3InKS5EZXRlY3RvclxuXG52YXIgQWx3YXlzRW5hYmxlZCA9IGNsYXNzIEFsd2F5c0VuYWJsZWQgZXh0ZW5kcyBEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yIChuYW1lc3BhY2UpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5uYW1lc3BhY2UgPSBuYW1lc3BhY2VcbiAgfVxuXG4gIGRldGVjdCAoZmluZGVyKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlXG4gIH1cbn1cbmV4cG9ydHMuQWx3YXlzRW5hYmxlZCA9IEFsd2F5c0VuYWJsZWRcbiIsIlxudmFyIERldGVjdG9yID0gY2xhc3MgRGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvciAoZGF0YSA9IHt9KSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YVxuICB9XG5cbiAgZGV0ZWN0IChmaW5kZXIpIHtcbiAgICBpZiAodGhpcy5kZXRlY3RlZChmaW5kZXIpKSB7XG4gICAgICBpZiAodGhpcy5kYXRhLnJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucmVzdWx0XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuZWxzZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuZWxzZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRldGVjdGVkIChmaW5kZXIpIHt9XG59XG5leHBvcnRzLkRldGVjdG9yID0gRGV0ZWN0b3JcbiIsIlxuY29uc3QgRGV0ZWN0b3IgPSByZXF1aXJlKCcuL0RldGVjdG9yJykuRGV0ZWN0b3JcblxudmFyIExhbmdEZXRlY3RvciA9IGNsYXNzIExhbmdEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0IChmaW5kZXIpIHtcbiAgICB2YXIgbGFuZ1xuXG4gICAgaWYgKGZpbmRlci5jb2Rld2F2ZSAhPSBudWxsKSB7XG4gICAgICBsYW5nID0gZmluZGVyLmNvZGV3YXZlLmVkaXRvci5nZXRMYW5nKClcblxuICAgICAgaWYgKGxhbmcgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5leHBvcnRzLkxhbmdEZXRlY3RvciA9IExhbmdEZXRlY3RvclxuIiwiXG5jb25zdCBQYWlyID0gcmVxdWlyZSgnLi4vcG9zaXRpb25pbmcvUGFpcicpLlBhaXJcblxuY29uc3QgRGV0ZWN0b3IgPSByZXF1aXJlKCcuL0RldGVjdG9yJykuRGV0ZWN0b3JcblxudmFyIFBhaXJEZXRlY3RvciA9IGNsYXNzIFBhaXJEZXRlY3RvciBleHRlbmRzIERldGVjdG9yIHtcbiAgZGV0ZWN0ZWQgKGZpbmRlcikge1xuICAgIHZhciBwYWlyXG5cbiAgICBpZiAodGhpcy5kYXRhLm9wZW5lciAhPSBudWxsICYmIHRoaXMuZGF0YS5jbG9zZXIgIT0gbnVsbCAmJiBmaW5kZXIuaW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgcGFpciA9IG5ldyBQYWlyKHRoaXMuZGF0YS5vcGVuZXIsIHRoaXMuZGF0YS5jbG9zZXIsIHRoaXMuZGF0YSlcblxuICAgICAgaWYgKHBhaXIuaXNXYXBwZXJPZihmaW5kZXIuaW5zdGFuY2UuZ2V0UG9zKCksIGZpbmRlci5jb2Rld2F2ZS5lZGl0b3IudGV4dCgpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5leHBvcnRzLlBhaXJEZXRlY3RvciA9IFBhaXJEZXRlY3RvclxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGJvb3RzdHJhcCA9IHJlcXVpcmUoJy4vYm9vdHN0cmFwJylcblxuY29uc3QgVGV4dEFyZWFFZGl0b3IgPSByZXF1aXJlKCcuL1RleHRBcmVhRWRpdG9yJylcblxuYm9vdHN0cmFwLkNvZGV3YXZlLmRldGVjdCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgdmFyIGN3XG4gIGN3ID0gbmV3IGJvb3RzdHJhcC5Db2Rld2F2ZShuZXcgVGV4dEFyZWFFZGl0b3IuVGV4dEFyZWFFZGl0b3IodGFyZ2V0KSlcblxuICBib290c3RyYXAuQ29kZXdhdmUuaW5zdGFuY2VzLnB1c2goY3cpXG5cbiAgcmV0dXJuIGN3XG59XG5cbmJvb3RzdHJhcC5Db2Rld2F2ZS5yZXF1aXJlID0gcmVxdWlyZVxud2luZG93LkNvZGV3YXZlID0gYm9vdHN0cmFwLkNvZGV3YXZlXG4iLCJcbnZhciBBcnJheUhlbHBlciA9IGNsYXNzIEFycmF5SGVscGVyIHtcbiAgc3RhdGljIGlzQXJyYXkgKGFycikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9XG5cbiAgc3RhdGljIHVuaW9uIChhMSwgYTIpIHtcbiAgICByZXR1cm4gdGhpcy51bmlxdWUoYTEuY29uY2F0KGEyKSlcbiAgfVxuXG4gIHN0YXRpYyB1bmlxdWUgKGFycmF5KSB7XG4gICAgdmFyIGEsIGksIGpcbiAgICBhID0gYXJyYXkuY29uY2F0KClcbiAgICBpID0gMFxuXG4gICAgd2hpbGUgKGkgPCBhLmxlbmd0aCkge1xuICAgICAgaiA9IGkgKyAxXG5cbiAgICAgIHdoaWxlIChqIDwgYS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGFbaV0gPT09IGFbal0pIHtcbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpXG4gICAgICAgIH1cblxuICAgICAgICArK2pcbiAgICAgIH1cblxuICAgICAgKytpXG4gICAgfVxuXG4gICAgcmV0dXJuIGFcbiAgfVxufVxuZXhwb3J0cy5BcnJheUhlbHBlciA9IEFycmF5SGVscGVyXG4iLCJcbnZhciBDb21tb25IZWxwZXIgPSBjbGFzcyBDb21tb25IZWxwZXIge1xuICBzdGF0aWMgbWVyZ2UgKC4uLnhzKSB7XG4gICAgaWYgKCh4cyAhPSBudWxsID8geHMubGVuZ3RoIDogdm9pZCAwKSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcCh7fSwgZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgdmFyIGksIGssIGxlbiwgcmVzdWx0cywgdiwgeFxuICAgICAgICByZXN1bHRzID0gW11cblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB4cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHggPSB4c1tpXVxuICAgICAgICAgIHJlc3VsdHMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0czFcbiAgICAgICAgICAgIHJlc3VsdHMxID0gW11cblxuICAgICAgICAgICAgZm9yIChrIGluIHgpIHtcbiAgICAgICAgICAgICAgdiA9IHhba11cbiAgICAgICAgICAgICAgcmVzdWx0czEucHVzaChtW2tdID0gdilcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMxXG4gICAgICAgICAgfSgpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRhcCAobywgZm4pIHtcbiAgICBmbihvKVxuICAgIHJldHVybiBvXG4gIH1cblxuICBzdGF0aWMgYXBwbHlNaXhpbnMgKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIHtcbiAgICByZXR1cm4gYmFzZUN0b3JzLmZvckVhY2goYmFzZUN0b3IgPT4ge1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2VDdG9yLnByb3RvdHlwZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5leHBvcnRzLkNvbW1vbkhlbHBlciA9IENvbW1vbkhlbHBlclxuIiwiXG52YXIgTmFtZXNwYWNlSGVscGVyID0gY2xhc3MgTmFtZXNwYWNlSGVscGVyIHtcbiAgc3RhdGljIHNwbGl0Rmlyc3QgKGZ1bGxuYW1lLCBpc1NwYWNlID0gZmFsc2UpIHtcbiAgICB2YXIgcGFydHNcblxuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKCc6JykgPT09IC0xICYmICFpc1NwYWNlKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXVxuICAgIH1cblxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIHJldHVybiBbcGFydHMuc2hpZnQoKSwgcGFydHMuam9pbignOicpIHx8IG51bGxdXG4gIH1cblxuICBzdGF0aWMgc3BsaXQgKGZ1bGxuYW1lKSB7XG4gICAgdmFyIG5hbWUsIHBhcnRzXG5cbiAgICBpZiAoZnVsbG5hbWUuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgcmV0dXJuIFtudWxsLCBmdWxsbmFtZV1cbiAgICB9XG5cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6JylcbiAgICBuYW1lID0gcGFydHMucG9wKClcbiAgICByZXR1cm4gW3BhcnRzLmpvaW4oJzonKSwgbmFtZV1cbiAgfVxufVxuZXhwb3J0cy5OYW1lc3BhY2VIZWxwZXIgPSBOYW1lc3BhY2VIZWxwZXJcbiIsIlxudmFyIE9wdGlvbmFsUHJvbWlzZSA9IGNsYXNzIE9wdGlvbmFsUHJvbWlzZSB7XG4gIGNvbnN0cnVjdG9yICh2YWwxKSB7XG4gICAgdGhpcy52YWwgPSB2YWwxXG5cbiAgICBpZiAodGhpcy52YWwgIT0gbnVsbCAmJiB0aGlzLnZhbC50aGVuICE9IG51bGwgJiYgdGhpcy52YWwucmVzdWx0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMudmFsID0gdGhpcy52YWwucmVzdWx0KClcbiAgICB9XG4gIH1cblxuICB0aGVuIChjYikge1xuICAgIGlmICh0aGlzLnZhbCAhPSBudWxsICYmIHRoaXMudmFsLnRoZW4gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodGhpcy52YWwudGhlbihjYikpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKGNiKHRoaXMudmFsKSlcbiAgICB9XG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIHJldHVybiB0aGlzLnZhbFxuICB9XG59XG5leHBvcnRzLk9wdGlvbmFsUHJvbWlzZSA9IE9wdGlvbmFsUHJvbWlzZVxuXG52YXIgb3B0aW9uYWxQcm9taXNlID0gZnVuY3Rpb24gKHZhbCkge1xuICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh2YWwpXG59XG5cbmV4cG9ydHMub3B0aW9uYWxQcm9taXNlID0gb3B0aW9uYWxQcm9taXNlXG4iLCJcbnZhciBQYXRoSGVscGVyID0gY2xhc3MgUGF0aEhlbHBlciB7XG4gIHN0YXRpYyBnZXRQYXRoIChvYmosIHBhdGgsIHNlcCA9ICcuJykge1xuICAgIHZhciBjdXIsIHBhcnRzXG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcClcbiAgICBjdXIgPSBvYmpcbiAgICBwYXJ0cy5maW5kKHBhcnQgPT4ge1xuICAgICAgY3VyID0gY3VyW3BhcnRdXG4gICAgICByZXR1cm4gdHlwZW9mIGN1ciA9PT0gJ3VuZGVmaW5lZCdcbiAgICB9KVxuICAgIHJldHVybiBjdXJcbiAgfVxuXG4gIHN0YXRpYyBzZXRQYXRoIChvYmosIHBhdGgsIHZhbCwgc2VwID0gJy4nKSB7XG4gICAgdmFyIGxhc3QsIHBhcnRzXG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcClcbiAgICBsYXN0ID0gcGFydHMucG9wKClcbiAgICByZXR1cm4gcGFydHMucmVkdWNlKChjdXIsIHBhcnQpID0+IHtcbiAgICAgIGlmIChjdXJbcGFydF0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY3VyW3BhcnRdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY3VyW3BhcnRdID0ge31cbiAgICAgIH1cbiAgICB9LCBvYmopW2xhc3RdID0gdmFsXG4gIH1cbn1cbmV4cG9ydHMuUGF0aEhlbHBlciA9IFBhdGhIZWxwZXJcbiIsIlxuY29uc3QgU2l6ZSA9IHJlcXVpcmUoJy4uL3Bvc2l0aW9uaW5nL1NpemUnKS5TaXplXG5cbnZhciBTdHJpbmdIZWxwZXIgPSBjbGFzcyBTdHJpbmdIZWxwZXIge1xuICBzdGF0aWMgdHJpbUVtcHR5TGluZSAodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5yZXBsYWNlKC9eXFxzKlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyP1xcblxccyokLywgJycpXG4gIH1cblxuICBzdGF0aWMgZXNjYXBlUmVnRXhwIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCAnXFxcXCQmJylcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXRUb0xlbmd0aCAodHh0LCBsZW5ndGgpIHtcbiAgICBpZiAobGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIHJldHVybiBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gdHh0Lmxlbmd0aCkgKyAxKS5qb2luKHR4dCkuc3Vic3RyaW5nKDAsIGxlbmd0aClcbiAgfVxuXG4gIHN0YXRpYyByZXBlYXQgKHR4dCwgbmIpIHtcbiAgICByZXR1cm4gQXJyYXkobmIgKyAxKS5qb2luKHR4dClcbiAgfVxuXG4gIHN0YXRpYyBnZXRUeHRTaXplICh0eHQpIHtcbiAgICB2YXIgaiwgbCwgbGVuLCBsaW5lcywgd1xuICAgIGxpbmVzID0gdHh0LnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoJ1xcbicpXG4gICAgdyA9IDBcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBsID0gbGluZXNbal1cbiAgICAgIHcgPSBNYXRoLm1heCh3LCBsLmxlbmd0aClcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFNpemUodywgbGluZXMubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIHN0YXRpYyBpbmRlbnROb3RGaXJzdCAodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgdmFyIHJlZ1xuXG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmVnID0gL1xcbi9nXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywgJ1xcbicgKyB0aGlzLnJlcGVhdChzcGFjZXMsIG5iKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHRcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaW5kZW50ICh0ZXh0LCBuYiA9IDEsIHNwYWNlcyA9ICcgICcpIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gc3BhY2VzICsgdGhpcy5pbmRlbnROb3RGaXJzdCh0ZXh0LCBuYiwgc3BhY2VzKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dFxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZXZlcnNlU3RyICh0eHQpIHtcbiAgICByZXR1cm4gdHh0LnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJylcbiAgfVxuXG4gIHN0YXRpYyByZW1vdmVDYXJyZXQgKHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciByZUNhcnJldCwgcmVRdW90ZWQsIHJlVG1wLCB0bXBcbiAgICB0bXAgPSAnW1tbW3F1b3RlZF9jYXJyZXRdXV1dJ1xuICAgIHJlQ2FycmV0ID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyKSwgJ2cnKVxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksICdnJylcbiAgICByZVRtcCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAodG1wKSwgJ2cnKVxuICAgIHJldHVybiB0eHQucmVwbGFjZShyZVF1b3RlZCwgdG1wKS5yZXBsYWNlKHJlQ2FycmV0LCAnJykucmVwbGFjZShyZVRtcCwgY2FycmV0Q2hhcilcbiAgfVxuXG4gIHN0YXRpYyBnZXRBbmRSZW1vdmVGaXJzdENhcnJldCAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIHBvc1xuICAgIHBvcyA9IHRoaXMuZ2V0Q2FycmV0UG9zKHR4dCwgY2FycmV0Q2hhcilcblxuICAgIGlmIChwb3MgIT0gbnVsbCkge1xuICAgICAgdHh0ID0gdHh0LnN1YnN0cigwLCBwb3MpICsgdHh0LnN1YnN0cihwb3MgKyBjYXJyZXRDaGFyLmxlbmd0aClcbiAgICAgIHJldHVybiBbcG9zLCB0eHRdXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldENhcnJldFBvcyAodHh0LCBjYXJyZXRDaGFyID0gJ3wnKSB7XG4gICAgdmFyIGksIHJlUXVvdGVkXG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKGNhcnJldENoYXIgKyBjYXJyZXRDaGFyKSwgJ2cnKVxuICAgIHR4dCA9IHR4dC5yZXBsYWNlKHJlUXVvdGVkLCAnICcpXG5cbiAgICBpZiAoKGkgPSB0eHQuaW5kZXhPZihjYXJyZXRDaGFyKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGlcbiAgICB9XG4gIH1cbn1cbmV4cG9ydHMuU3RyaW5nSGVscGVyID0gU3RyaW5nSGVscGVyXG4iLCJcbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vUG9zJykuUG9zXG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IFBhaXJNYXRjaCA9IHJlcXVpcmUoJy4vUGFpck1hdGNoJykuUGFpck1hdGNoXG5cbnZhciBQYWlyID0gY2xhc3MgUGFpciB7XG4gIGNvbnN0cnVjdG9yIChvcGVuZXIsIGNsb3Nlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbFxuICAgIHRoaXMub3BlbmVyID0gb3BlbmVyXG4gICAgdGhpcy5jbG9zZXIgPSBjbG9zZXJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBvcHRpb25uYWxfZW5kOiBmYWxzZSxcbiAgICAgIHZhbGlkTWF0Y2g6IG51bGxcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIHRoaXMub3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSB0aGlzLm9wdGlvbnNba2V5XVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3BlbmVyUmVnICgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub3BlbmVyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLm9wZW5lcikpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm9wZW5lclxuICAgIH1cbiAgfVxuXG4gIGNsb3NlclJlZyAoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmNsb3NlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jbG9zZXIpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZXJcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueVBhcnRzICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BlbmVyOiB0aGlzLm9wZW5lclJlZygpLFxuICAgICAgY2xvc2VyOiB0aGlzLmNsb3NlclJlZygpXG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0S2V5cyAoKSB7XG4gICAgdmFyIGtleSwga2V5cywgcmVmLCByZWdcbiAgICBrZXlzID0gW11cbiAgICByZWYgPSB0aGlzLm1hdGNoQW55UGFydHMoKVxuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XVxuICAgICAga2V5cy5wdXNoKGtleSlcbiAgICB9XG5cbiAgICByZXR1cm4ga2V5c1xuICB9XG5cbiAgbWF0Y2hBbnlSZWcgKCkge1xuICAgIHZhciBncm91cHMsIGtleSwgcmVmLCByZWdcbiAgICBncm91cHMgPSBbXVxuICAgIHJlZiA9IHRoaXMubWF0Y2hBbnlQYXJ0cygpXG5cbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHJlZyA9IHJlZltrZXldXG4gICAgICBncm91cHMucHVzaCgnKCcgKyByZWcuc291cmNlICsgJyknKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVnRXhwKGdyb3Vwcy5qb2luKCd8JykpXG4gIH1cblxuICBtYXRjaEFueSAodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaFxuXG4gICAgd2hpbGUgKChtYXRjaCA9IHRoaXMuX21hdGNoQW55KHRleHQsIG9mZnNldCkpICE9IG51bGwgJiYgIW1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIG9mZnNldCA9IG1hdGNoLmVuZCgpXG4gICAgfVxuXG4gICAgaWYgKG1hdGNoICE9IG51bGwgJiYgbWF0Y2gudmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1hdGNoXG4gICAgfVxuICB9XG5cbiAgX21hdGNoQW55ICh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoXG5cbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KVxuICAgIH1cblxuICAgIG1hdGNoID0gdGhpcy5tYXRjaEFueVJlZygpLmV4ZWModGV4dClcblxuICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFBhaXJNYXRjaCh0aGlzLCBtYXRjaCwgb2Zmc2V0KVxuICAgIH1cbiAgfVxuXG4gIG1hdGNoQW55TmFtZWQgKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF0Y2hBbnlHZXROYW1lKHRoaXMubWF0Y2hBbnkodGV4dCkpXG4gIH1cblxuICBtYXRjaEFueUxhc3QgKHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2gsIHJlc1xuXG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuXG4gICAgICBpZiAoIXJlcyB8fCByZXMuZW5kKCkgIT09IG1hdGNoLmVuZCgpKSB7XG4gICAgICAgIHJlcyA9IG1hdGNoXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc1xuICB9XG5cbiAgaWRlbnRpY2FsICgpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZXIgPT09IHRoaXMuY2xvc2VyIHx8IHRoaXMub3BlbmVyLnNvdXJjZSAhPSBudWxsICYmIHRoaXMuY2xvc2VyLnNvdXJjZSAhPSBudWxsICYmIHRoaXMub3BlbmVyLnNvdXJjZSA9PT0gdGhpcy5jbG9zZXIuc291cmNlXG4gIH1cblxuICB3cmFwcGVyUG9zIChwb3MsIHRleHQpIHtcbiAgICB2YXIgZW5kLCBzdGFydFxuICAgIHN0YXJ0ID0gdGhpcy5tYXRjaEFueUxhc3QodGV4dC5zdWJzdHIoMCwgcG9zLnN0YXJ0KSlcblxuICAgIGlmIChzdGFydCAhPSBudWxsICYmICh0aGlzLmlkZW50aWNhbCgpIHx8IHN0YXJ0Lm5hbWUoKSA9PT0gJ29wZW5lcicpKSB7XG4gICAgICBlbmQgPSB0aGlzLm1hdGNoQW55KHRleHQsIHBvcy5lbmQpXG5cbiAgICAgIGlmIChlbmQgIT0gbnVsbCAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBlbmQubmFtZSgpID09PSAnY2xvc2VyJykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgZW5kLmVuZCgpKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbm5hbF9lbmQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3Moc3RhcnQuc3RhcnQoKSwgdGV4dC5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNXYXBwZXJPZiAocG9zLCB0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlclBvcyhwb3MsIHRleHQpICE9IG51bGxcbiAgfVxufVxuZXhwb3J0cy5QYWlyID0gUGFpclxuIiwiXG52YXIgUGFpck1hdGNoID0gY2xhc3MgUGFpck1hdGNoIHtcbiAgY29uc3RydWN0b3IgKHBhaXIsIG1hdGNoLCBvZmZzZXQgPSAwKSB7XG4gICAgdGhpcy5wYWlyID0gcGFpclxuICAgIHRoaXMubWF0Y2ggPSBtYXRjaFxuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0XG4gIH1cblxuICBuYW1lICgpIHtcbiAgICB2YXIgX25hbWUsIGdyb3VwLCBpLCBqLCBsZW4sIHJlZlxuXG4gICAgaWYgKHRoaXMubWF0Y2gpIHtcbiAgICAgIGlmICh0eXBlb2YgX25hbWUgPT09ICd1bmRlZmluZWQnIHx8IF9uYW1lID09PSBudWxsKSB7XG4gICAgICAgIHJlZiA9IHRoaXMubWF0Y2hcblxuICAgICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICAgIGdyb3VwID0gcmVmW2ldXG5cbiAgICAgICAgICBpZiAoaSA+IDAgJiYgZ3JvdXAgIT0gbnVsbCkge1xuICAgICAgICAgICAgX25hbWUgPSB0aGlzLnBhaXIubWF0Y2hBbnlQYXJ0S2V5cygpW2kgLSAxXVxuICAgICAgICAgICAgcmV0dXJuIF9uYW1lXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX25hbWUgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gX25hbWUgfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIHN0YXJ0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMub2Zmc2V0XG4gIH1cblxuICBlbmQgKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoLmluZGV4ICsgdGhpcy5tYXRjaFswXS5sZW5ndGggKyB0aGlzLm9mZnNldFxuICB9XG5cbiAgdmFsaWQgKCkge1xuICAgIHJldHVybiAhdGhpcy5wYWlyLnZhbGlkTWF0Y2ggfHwgdGhpcy5wYWlyLnZhbGlkTWF0Y2godGhpcylcbiAgfVxuXG4gIGxlbmd0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hbMF0ubGVuZ3RoXG4gIH1cbn1cbmV4cG9ydHMuUGFpck1hdGNoID0gUGFpck1hdGNoXG4iLCJcbnZhciBQb3MgPSBjbGFzcyBQb3Mge1xuICBjb25zdHJ1Y3RvciAoc3RhcnQsIGVuZCkge1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydFxuICAgIHRoaXMuZW5kID0gZW5kXG5cbiAgICBpZiAodGhpcy5lbmQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5lbmQgPSB0aGlzLnN0YXJ0XG4gICAgfVxuICB9XG5cbiAgY29udGFpbnNQdCAocHQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmVuZFxuICB9XG5cbiAgY29udGFpbnNQb3MgKHBvcykge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuZW5kXG4gIH1cblxuICB3cmFwcGVkQnkgKHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3Mud3JhcENsYXNzKHRoaXMuc3RhcnQgLSBwcmVmaXgubGVuZ3RoLCB0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5lbmQgKyBzdWZmaXgubGVuZ3RoKVxuICB9XG5cbiAgd2l0aEVkaXRvciAodmFsKSB7XG4gICAgdGhpcy5fZWRpdG9yID0gdmFsXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGVkaXRvciAoKSB7XG4gICAgaWYgKHRoaXMuX2VkaXRvciA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVkaXRvciBzZXQnKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9lZGl0b3JcbiAgfVxuXG4gIGhhc0VkaXRvciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvciAhPSBudWxsXG4gIH1cblxuICB0ZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuc3RhcnQsIHRoaXMuZW5kKVxuICB9XG5cbiAgYXBwbHlPZmZzZXQgKG9mZnNldCkge1xuICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgIHRoaXMuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICB0aGlzLmVuZCArPSBvZmZzZXRcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHJldkVPTCAoKSB7XG4gICAgaWYgKHRoaXMuX3ByZXZFT0wgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcHJldkVPTCA9IHRoaXMuZWRpdG9yKCkuZmluZExpbmVTdGFydCh0aGlzLnN0YXJ0KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wcmV2RU9MXG4gIH1cblxuICBuZXh0RU9MICgpIHtcbiAgICBpZiAodGhpcy5fbmV4dEVPTCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9uZXh0RU9MID0gdGhpcy5lZGl0b3IoKS5maW5kTGluZUVuZCh0aGlzLmVuZClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbmV4dEVPTFxuICB9XG5cbiAgdGV4dFdpdGhGdWxsTGluZXMgKCkge1xuICAgIGlmICh0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcyA9PSBudWxsKSB7XG4gICAgICB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lcyA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5uZXh0RU9MKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RleHRXaXRoRnVsbExpbmVzXG4gIH1cblxuICBzYW1lTGluZXNQcmVmaXggKCkge1xuICAgIGlmICh0aGlzLl9zYW1lTGluZXNQcmVmaXggPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2FtZUxpbmVzUHJlZml4ID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMucHJldkVPTCgpLCB0aGlzLnN0YXJ0KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNQcmVmaXhcbiAgfVxuXG4gIHNhbWVMaW5lc1N1ZmZpeCAoKSB7XG4gICAgaWYgKHRoaXMuX3NhbWVMaW5lc1N1ZmZpeCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zYW1lTGluZXNTdWZmaXggPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5lbmQsIHRoaXMubmV4dEVPTCgpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zYW1lTGluZXNTdWZmaXhcbiAgfVxuXG4gIGNvcHkgKCkge1xuICAgIHZhciByZXNcbiAgICByZXMgPSBuZXcgUG9zKHRoaXMuc3RhcnQsIHRoaXMuZW5kKVxuXG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc1xuICB9XG5cbiAgcmF3ICgpIHtcbiAgICByZXR1cm4gW3RoaXMuc3RhcnQsIHRoaXMuZW5kXVxuICB9XG59XG5leHBvcnRzLlBvcyA9IFBvc1xuIiwiXG5jb25zdCBXcmFwcGluZyA9IHJlcXVpcmUoJy4vV3JhcHBpbmcnKS5XcmFwcGluZ1xuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoJy4vUmVwbGFjZW1lbnQnKS5SZXBsYWNlbWVudFxuXG5jb25zdCBDb21tb25IZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcicpLkNvbW1vbkhlbHBlclxuXG52YXIgUG9zQ29sbGVjdGlvbiA9IGNsYXNzIFBvc0NvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3RvciAoYXJyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIGFyciA9IFthcnJdXG4gICAgfVxuXG4gICAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKGFyciwgW1Bvc0NvbGxlY3Rpb25dKVxuXG4gICAgcmV0dXJuIGFyclxuICB9XG5cbiAgd3JhcCAocHJlZml4LCBzdWZmaXgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBuZXcgV3JhcHBpbmcocC5zdGFydCwgcC5lbmQsIHByZWZpeCwgc3VmZml4KVxuICAgIH0pXG4gIH1cblxuICByZXBsYWNlICh0eHQpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBuZXcgUmVwbGFjZW1lbnQocC5zdGFydCwgcC5lbmQsIHR4dClcbiAgICB9KVxuICB9XG59XG5leHBvcnRzLlBvc0NvbGxlY3Rpb24gPSBQb3NDb2xsZWN0aW9uXG4iLCJcbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vUG9zJykuUG9zXG5cbmNvbnN0IENvbW1vbkhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJykuQ29tbW9uSGVscGVyXG5cbmNvbnN0IE9wdGlvbk9iamVjdCA9IHJlcXVpcmUoJy4uL09wdGlvbk9iamVjdCcpLk9wdGlvbk9iamVjdFxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG52YXIgUmVwbGFjZW1lbnQgPSAoZnVuY3Rpb24gKCkge1xuICBjbGFzcyBSZXBsYWNlbWVudCBleHRlbmRzIFBvcyB7XG4gICAgY29uc3RydWN0b3IgKHN0YXJ0MSwgZW5kLCB0ZXh0MSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcigpXG4gICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQxXG4gICAgICB0aGlzLmVuZCA9IGVuZFxuICAgICAgdGhpcy50ZXh0ID0gdGV4dDFcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICAgIHRoaXMuc2V0T3B0cyh0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgcHJlZml4OiAnJyxcbiAgICAgICAgc3VmZml4OiAnJyxcbiAgICAgICAgc2VsZWN0aW9uczogW11cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmVzUG9zQmVmb3JlUHJlZml4ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy50ZXh0Lmxlbmd0aFxuICAgIH1cblxuICAgIHJlc0VuZCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoXG4gICAgfVxuXG4gICAgYXBwbHkgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkuc3BsaWNlVGV4dCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5maW5hbFRleHQoKSlcbiAgICB9XG5cbiAgICBuZWNlc3NhcnkgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkgIT09IHRoaXMub3JpZ2luYWxUZXh0KClcbiAgICB9XG5cbiAgICBvcmlnaW5hbFRleHQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZClcbiAgICB9XG5cbiAgICBmaW5hbFRleHQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy50ZXh0ICsgdGhpcy5zdWZmaXhcbiAgICB9XG5cbiAgICBvZmZzZXRBZnRlciAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKS5sZW5ndGggLSAodGhpcy5lbmQgLSB0aGlzLnN0YXJ0KVxuICAgIH1cblxuICAgIGFwcGx5T2Zmc2V0IChvZmZzZXQpIHtcbiAgICAgIHZhciBpLCBsZW4sIHJlZiwgc2VsXG5cbiAgICAgIGlmIChvZmZzZXQgIT09IDApIHtcbiAgICAgICAgdGhpcy5zdGFydCArPSBvZmZzZXRcbiAgICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0XG4gICAgICAgIHJlZiA9IHRoaXMuc2VsZWN0aW9uc1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHNlbCA9IHJlZltpXVxuICAgICAgICAgIHNlbC5zdGFydCArPSBvZmZzZXRcbiAgICAgICAgICBzZWwuZW5kICs9IG9mZnNldFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgc2VsZWN0Q29udGVudCAoKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyh0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0LCB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN0YXJ0ICsgdGhpcy50ZXh0Lmxlbmd0aCldXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGNhcnJldFRvU2VsICgpIHtcbiAgICAgIHZhciBwb3MsIHJlcywgc3RhcnQsIHRleHRcbiAgICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtdXG4gICAgICB0ZXh0ID0gdGhpcy5maW5hbFRleHQoKVxuICAgICAgdGhpcy5wcmVmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMucHJlZml4KVxuICAgICAgdGhpcy50ZXh0ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnRleHQpXG4gICAgICB0aGlzLnN1ZmZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy5zdWZmaXgpXG4gICAgICBzdGFydCA9IHRoaXMuc3RhcnRcblxuICAgICAgd2hpbGUgKChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpICE9IG51bGwpIHtcbiAgICAgICAgW3BvcywgdGV4dF0gPSByZXNcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25zLnB1c2gobmV3IFBvcyhzdGFydCArIHBvcywgc3RhcnQgKyBwb3MpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGNvcHkgKCkge1xuICAgICAgdmFyIHJlc1xuICAgICAgcmVzID0gbmV3IFJlcGxhY2VtZW50KHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnRleHQsIHRoaXMuZ2V0T3B0cygpKVxuXG4gICAgICBpZiAodGhpcy5oYXNFZGl0b3IoKSkge1xuICAgICAgICByZXMud2l0aEVkaXRvcih0aGlzLmVkaXRvcigpKVxuICAgICAgfVxuXG4gICAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuIHMuY29weSgpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHJlc1xuICAgIH1cbiAgfVxuXG4gIDtcblxuICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoUmVwbGFjZW1lbnQucHJvdG90eXBlLCBbT3B0aW9uT2JqZWN0XSlcblxuICByZXR1cm4gUmVwbGFjZW1lbnRcbn0uY2FsbCh2b2lkIDApKVxuXG5leHBvcnRzLlJlcGxhY2VtZW50ID0gUmVwbGFjZW1lbnRcbiIsIlxudmFyIFNpemUgPSBjbGFzcyBTaXplIHtcbiAgY29uc3RydWN0b3IgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICB9XG59XG5leHBvcnRzLlNpemUgPSBTaXplXG4iLCJcbnZhciBTdHJQb3MgPSBjbGFzcyBTdHJQb3Mge1xuICBjb25zdHJ1Y3RvciAocG9zLCBzdHIpIHtcbiAgICB0aGlzLnBvcyA9IHBvc1xuICAgIHRoaXMuc3RyID0gc3RyXG4gIH1cblxuICBlbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aFxuICB9XG59XG5leHBvcnRzLlN0clBvcyA9IFN0clBvc1xuIiwiXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL1BvcycpLlBvc1xuXG52YXIgV3JhcHBlZFBvcyA9IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3Mge1xuICBjb25zdHJ1Y3RvciAoc3RhcnQsIGlubmVyU3RhcnQsIGlubmVyRW5kLCBlbmQpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0XG4gICAgdGhpcy5pbm5lclN0YXJ0ID0gaW5uZXJTdGFydFxuICAgIHRoaXMuaW5uZXJFbmQgPSBpbm5lckVuZFxuICAgIHRoaXMuZW5kID0gZW5kXG4gIH1cblxuICBpbm5lckNvbnRhaW5zUHQgKHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwdCAmJiBwdCA8PSB0aGlzLmlubmVyRW5kXG4gIH1cblxuICBpbm5lckNvbnRhaW5zUG9zIChwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclN0YXJ0IDw9IHBvcy5zdGFydCAmJiBwb3MuZW5kIDw9IHRoaXMuaW5uZXJFbmRcbiAgfVxuXG4gIGlubmVyVGV4dCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLmlubmVyU3RhcnQsIHRoaXMuaW5uZXJFbmQpXG4gIH1cblxuICBzZXRJbm5lckxlbiAobGVuKSB7XG4gICAgcmV0dXJuIHRoaXMubW92ZVN1Zml4KHRoaXMuaW5uZXJTdGFydCArIGxlbilcbiAgfVxuXG4gIG1vdmVTdWZmaXggKHB0KSB7XG4gICAgdmFyIHN1ZmZpeExlblxuICAgIHN1ZmZpeExlbiA9IHRoaXMuZW5kIC0gdGhpcy5pbm5lckVuZFxuICAgIHRoaXMuaW5uZXJFbmQgPSBwdFxuICAgIHJldHVybiB0aGlzLmVuZCA9IHRoaXMuaW5uZXJFbmQgKyBzdWZmaXhMZW5cbiAgfVxuXG4gIGNvcHkgKCkge1xuICAgIHJldHVybiBuZXcgV3JhcHBlZFBvcyh0aGlzLnN0YXJ0LCB0aGlzLmlubmVyU3RhcnQsIHRoaXMuaW5uZXJFbmQsIHRoaXMuZW5kKVxuICB9XG59XG5leHBvcnRzLldyYXBwZWRQb3MgPSBXcmFwcGVkUG9zXG4iLCJcbmNvbnN0IFJlcGxhY2VtZW50ID0gcmVxdWlyZSgnLi9SZXBsYWNlbWVudCcpLlJlcGxhY2VtZW50XG5cbnZhciBXcmFwcGluZyA9IGNsYXNzIFdyYXBwaW5nIGV4dGVuZHMgUmVwbGFjZW1lbnQge1xuICBjb25zdHJ1Y3RvciAoc3RhcnQsIGVuZCwgcHJlZml4ID0gJycsIHN1ZmZpeCA9ICcnLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0XG4gICAgdGhpcy5lbmQgPSBlbmRcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucylcbiAgICB0aGlzLnRleHQgPSAnJ1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4XG4gICAgdGhpcy5zdWZmaXggPSBzdWZmaXhcbiAgfVxuXG4gIGFwcGx5ICgpIHtcbiAgICB0aGlzLmFkanVzdFNlbCgpXG4gICAgcmV0dXJuIHN1cGVyLmFwcGx5KClcbiAgfVxuXG4gIGFkanVzdFNlbCAoKSB7XG4gICAgdmFyIGksIGxlbiwgb2Zmc2V0LCByZWYsIHJlc3VsdHMsIHNlbFxuICAgIG9mZnNldCA9IHRoaXMub3JpZ2luYWxUZXh0KCkubGVuZ3RoXG4gICAgcmVmID0gdGhpcy5zZWxlY3Rpb25zXG4gICAgcmVzdWx0cyA9IFtdXG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNlbCA9IHJlZltpXVxuXG4gICAgICBpZiAoc2VsLnN0YXJ0ID4gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWwuZW5kID49IHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHNlbC5lbmQgKz0gb2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgZmluYWxUZXh0ICgpIHtcbiAgICB2YXIgdGV4dFxuXG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHRleHQgPSB0aGlzLm9yaWdpbmFsVGV4dCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSAnJ1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRleHQgKyB0aGlzLnN1ZmZpeFxuICB9XG5cbiAgb2Zmc2V0QWZ0ZXIgKCkge1xuICAgIHJldHVybiB0aGlzLnByZWZpeC5sZW5ndGggKyB0aGlzLnN1ZmZpeC5sZW5ndGhcbiAgfVxuXG4gIGNvcHkgKCkge1xuICAgIHZhciByZXNcbiAgICByZXMgPSBuZXcgV3JhcHBpbmcodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMucHJlZml4LCB0aGlzLnN1ZmZpeClcbiAgICByZXMuc2VsZWN0aW9ucyA9IHRoaXMuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLmNvcHkoKVxuICAgIH0pXG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5leHBvcnRzLldyYXBwaW5nID0gV3JhcHBpbmdcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5cbnZhciBMb2NhbFN0b3JhZ2VFbmdpbmUgPSBjbGFzcyBMb2NhbFN0b3JhZ2VFbmdpbmUge1xuICBzYXZlIChrZXksIHZhbCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmZ1bGxLZXkoa2V5KSwgSlNPTi5zdHJpbmdpZnkodmFsKSlcbiAgICB9XG4gIH1cblxuICBzYXZlSW5QYXRoIChwYXRoLCBrZXksIHZhbCkge1xuICAgIHZhciBkYXRhXG4gICAgZGF0YSA9IHRoaXMubG9hZChwYXRoKVxuXG4gICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuXG4gICAgZGF0YVtrZXldID0gdmFsXG4gICAgcmV0dXJuIHRoaXMuc2F2ZShwYXRoLCBkYXRhKVxuICB9XG5cbiAgbG9hZCAoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5mdWxsS2V5KGtleSkpKVxuICAgIH1cbiAgfVxuXG4gIGZ1bGxLZXkgKGtleSkge1xuICAgIHJldHVybiAnQ29kZVdhdmVfJyArIGtleVxuICB9XG59XG5leHBvcnRzLkxvY2FsU3RvcmFnZUVuZ2luZSA9IExvY2FsU3RvcmFnZUVuZ2luZVxuIiwiXG52YXIgQ29udGV4dCA9IGNsYXNzIENvbnRleHQge1xuICBjb25zdHJ1Y3RvciAocGFyc2VyLCBwYXJlbnQpIHtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlclxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50XG4gICAgdGhpcy5jb250ZW50ID0gJydcbiAgfVxuXG4gIG9uU3RhcnQgKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0QXQgPSB0aGlzLnBhcnNlci5wb3NcbiAgfVxuXG4gIG9uQ2hhciAoY2hhcikge31cblxuICBlbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5zZXRDb250ZXh0KHRoaXMucGFyZW50KVxuICB9XG5cbiAgb25FbmQgKCkge31cblxuICB0ZXN0Q29udGV4dCAoY29udGV4dFR5cGUpIHtcbiAgICBpZiAoY29udGV4dFR5cGUudGVzdCh0aGlzLnBhcnNlci5jaGFyLCB0aGlzKSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLnNldENvbnRleHQobmV3IGNvbnRleHRUeXBlKHRoaXMucGFyc2VyLCB0aGlzKSlcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdGVzdCAoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbmV4cG9ydHMuQ29udGV4dCA9IENvbnRleHRcbiIsIlxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxudmFyIEVzY2FwZUNvbnRleHQgPSBjbGFzcyBFc2NhcGVDb250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uQ2hhciAoY2hhcikge1xuICAgIHRoaXMucGFyZW50LmNvbnRlbnQgKz0gY2hhclxuICAgIHJldHVybiB0aGlzLmVuZCgpXG4gIH1cblxuICBzdGF0aWMgdGVzdCAoY2hhcikge1xuICAgIHJldHVybiBjaGFyID09PSAnXFxcXCdcbiAgfVxufVxuZXhwb3J0cy5Fc2NhcGVDb250ZXh0ID0gRXNjYXBlQ29udGV4dFxuIiwiXG5jb25zdCBQYXJhbUNvbnRleHQgPSByZXF1aXJlKCcuL1BhcmFtQ29udGV4dCcpLlBhcmFtQ29udGV4dFxuXG52YXIgaW5kZXhPZiA9IFtdLmluZGV4T2ZcbnZhciBOYW1lZENvbnRleHQgPSBjbGFzcyBOYW1lZENvbnRleHQgZXh0ZW5kcyBQYXJhbUNvbnRleHQge1xuICBvblN0YXJ0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lID0gdGhpcy5wYXJlbnQuY29udGVudFxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5uYW1lZFt0aGlzLm5hbWVdID0gdGhpcy5jb250ZW50XG4gIH1cblxuICBzdGF0aWMgdGVzdCAoY2hhciwgcGFyZW50KSB7XG4gICAgdmFyIHJlZlxuICAgIHJldHVybiBjaGFyID09PSAnOicgJiYgKHBhcmVudC5wYXJzZXIub3B0aW9ucy5hbGxvd2VkTmFtZWQgPT0gbnVsbCB8fCAocmVmID0gcGFyZW50LmNvbnRlbnQsIGluZGV4T2YuY2FsbChwYXJlbnQucGFyc2VyLm9wdGlvbnMuYWxsb3dlZE5hbWVkLCByZWYpID49IDApKVxuICB9XG59XG5leHBvcnRzLk5hbWVkQ29udGV4dCA9IE5hbWVkQ29udGV4dFxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBTdHJpbmdDb250ZXh0ID0gcmVxdWlyZSgnLi9TdHJpbmdDb250ZXh0JykuU3RyaW5nQ29udGV4dFxuXG5jb25zdCBWYXJpYWJsZUNvbnRleHQgPSByZXF1aXJlKCcuL1ZhcmlhYmxlQ29udGV4dCcpLlZhcmlhYmxlQ29udGV4dFxuXG52YXIgUGFyYW1Db250ZXh0ID0gY2xhc3MgUGFyYW1Db250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uQ2hhciAoY2hhcikge1xuICAgIGlmICh0aGlzLnRlc3RDb250ZXh0KFN0cmluZ0NvbnRleHQpKSB7fSBlbHNlIGlmICh0aGlzLnRlc3RDb250ZXh0KFBhcmFtQ29udGV4dC5uYW1lZCkpIHt9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoVmFyaWFibGVDb250ZXh0KSkge30gZWxzZSBpZiAoY2hhciA9PT0gJyAnKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZXIuc2V0Q29udGV4dChuZXcgUGFyYW1Db250ZXh0KHRoaXMucGFyc2VyKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCArPSBjaGFyXG4gICAgfVxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5wYXJhbXMucHVzaCh0aGlzLmNvbnRlbnQpXG4gIH1cbn1cbmV4cG9ydHMuUGFyYW1Db250ZXh0ID0gUGFyYW1Db250ZXh0XG4iLCJcbmNvbnN0IFBhcmFtQ29udGV4dCA9IHJlcXVpcmUoJy4vUGFyYW1Db250ZXh0JykuUGFyYW1Db250ZXh0XG5cbmNvbnN0IE5hbWVkQ29udGV4dCA9IHJlcXVpcmUoJy4vTmFtZWRDb250ZXh0JykuTmFtZWRDb250ZXh0XG5cblBhcmFtQ29udGV4dC5uYW1lZCA9IE5hbWVkQ29udGV4dFxudmFyIFBhcmFtUGFyc2VyID0gY2xhc3MgUGFyYW1QYXJzZXIge1xuICBjb25zdHJ1Y3RvciAocGFyYW1TdHJpbmcsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMucGFyYW1TdHJpbmcgPSBwYXJhbVN0cmluZ1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLnBhcnNlKClcbiAgfVxuXG4gIHNldENvbnRleHQgKGNvbnRleHQpIHtcbiAgICB2YXIgb2xkQ29udGV4dFxuICAgIG9sZENvbnRleHQgPSB0aGlzLmNvbnRleHRcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XG5cbiAgICBpZiAob2xkQ29udGV4dCAhPSBudWxsICYmIG9sZENvbnRleHQgIT09IChjb250ZXh0ICE9IG51bGwgPyBjb250ZXh0LnBhcmVudCA6IHZvaWQgMCkpIHtcbiAgICAgIG9sZENvbnRleHQub25FbmQoKVxuICAgIH1cblxuICAgIGlmIChjb250ZXh0ICE9IG51bGwpIHtcbiAgICAgIGNvbnRleHQub25TdGFydCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dFxuICB9XG5cbiAgcGFyc2UgKCkge1xuICAgIHRoaXMucGFyYW1zID0gW11cbiAgICB0aGlzLm5hbWVkID0ge31cblxuICAgIGlmICh0aGlzLnBhcmFtU3RyaW5nLmxlbmd0aCkge1xuICAgICAgdGhpcy5zZXRDb250ZXh0KG5ldyBQYXJhbUNvbnRleHQodGhpcykpXG4gICAgICB0aGlzLnBvcyA9IDBcblxuICAgICAgd2hpbGUgKHRoaXMucG9zIDwgdGhpcy5wYXJhbVN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jaGFyID0gdGhpcy5wYXJhbVN0cmluZ1t0aGlzLnBvc11cbiAgICAgICAgdGhpcy5jb250ZXh0Lm9uQ2hhcih0aGlzLmNoYXIpXG4gICAgICAgIHRoaXMucG9zKytcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2V0Q29udGV4dChudWxsKVxuICAgIH1cbiAgfVxuXG4gIHRha2UgKG5iKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1TdHJpbmcuc3Vic3RyaW5nKHRoaXMucG9zLCB0aGlzLnBvcyArIG5iKVxuICB9XG5cbiAgc2tpcCAobmIgPSAxKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zICs9IG5iXG4gIH1cbn1cbmV4cG9ydHMuUGFyYW1QYXJzZXIgPSBQYXJhbVBhcnNlclxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBFc2NhcGVDb250ZXh0ID0gcmVxdWlyZSgnLi9Fc2NhcGVDb250ZXh0JykuRXNjYXBlQ29udGV4dFxuXG5jb25zdCBWYXJpYWJsZUNvbnRleHQgPSByZXF1aXJlKCcuL1ZhcmlhYmxlQ29udGV4dCcpLlZhcmlhYmxlQ29udGV4dFxuXG52YXIgU3RyaW5nQ29udGV4dCA9IGNsYXNzIFN0cmluZ0NvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25DaGFyIChjaGFyKSB7XG4gICAgaWYgKHRoaXMudGVzdENvbnRleHQoRXNjYXBlQ29udGV4dCkpIHt9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoVmFyaWFibGVDb250ZXh0KSkge30gZWxzZSBpZiAoU3RyaW5nQ29udGV4dC5pc0RlbGltaXRlcihjaGFyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5kKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudCArPSBjaGFyXG4gICAgfVxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5jb250ZW50ICs9IHRoaXMuY29udGVudFxuICB9XG5cbiAgc3RhdGljIHRlc3QgKGNoYXIpIHtcbiAgICByZXR1cm4gdGhpcy5pc0RlbGltaXRlcihjaGFyKVxuICB9XG5cbiAgc3RhdGljIGlzRGVsaW1pdGVyIChjaGFyKSB7XG4gICAgcmV0dXJuIGNoYXIgPT09ICdcIicgfHwgY2hhciA9PT0gXCInXCJcbiAgfVxufVxuZXhwb3J0cy5TdHJpbmdDb250ZXh0ID0gU3RyaW5nQ29udGV4dFxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG52YXIgVmFyaWFibGVDb250ZXh0ID0gY2xhc3MgVmFyaWFibGVDb250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uU3RhcnQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5za2lwKClcbiAgfVxuXG4gIG9uQ2hhciAoY2hhcikge1xuICAgIGlmIChjaGFyID09PSAnfScpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgKz0gY2hhclxuICAgIH1cbiAgfVxuXG4gIG9uRW5kICgpIHtcbiAgICB2YXIgcmVmXG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmNvbnRlbnQgKz0gKChyZWYgPSB0aGlzLnBhcnNlci5vcHRpb25zLnZhcnMpICE9IG51bGwgPyByZWZbdGhpcy5jb250ZW50XSA6IHZvaWQgMCkgfHwgJydcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0IChjaGFyLCBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50LnBhcnNlci50YWtlKDIpID09PSAnI3snXG4gIH1cbn1cbmV4cG9ydHMuVmFyaWFibGVDb250ZXh0ID0gVmFyaWFibGVDb250ZXh0XG4iLCIvKiFcbiAqIGluZmxlY3Rpb25cbiAqIENvcHlyaWdodChjKSAyMDExIEJlbiBMaW4gPGJlbkBkcmVhbWVyc2xhYi5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBBIHBvcnQgb2YgaW5mbGVjdGlvbi1qcyB0byBub2RlLmpzIG1vZHVsZS5cbiAqL1xuXG4oIGZ1bmN0aW9uICggcm9vdCwgZmFjdG9yeSApe1xuICBpZiggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICl7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5ICk7XG4gIH1lbHNlIGlmKCB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfWVsc2V7XG4gICAgcm9vdC5pbmZsZWN0aW9uID0gZmFjdG9yeSgpO1xuICB9XG59KCB0aGlzLCBmdW5jdGlvbiAoKXtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoaXMgaXMgYSBsaXN0IG9mIG5vdW5zIHRoYXQgdXNlIHRoZSBzYW1lIGZvcm0gZm9yIGJvdGggc2luZ3VsYXIgYW5kIHBsdXJhbC5cbiAgICogICAgICAgICAgICAgIFRoaXMgbGlzdCBzaG91bGQgcmVtYWluIGVudGlyZWx5IGluIGxvd2VyIGNhc2UgdG8gY29ycmVjdGx5IG1hdGNoIFN0cmluZ3MuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgdW5jb3VudGFibGVfd29yZHMgPSBbXG4gICAgLy8gJ2FjY2VzcycsXG4gICAgJ2FjY29tbW9kYXRpb24nLFxuICAgICdhZHVsdGhvb2QnLFxuICAgICdhZHZlcnRpc2luZycsXG4gICAgJ2FkdmljZScsXG4gICAgJ2FnZ3Jlc3Npb24nLFxuICAgICdhaWQnLFxuICAgICdhaXInLFxuICAgICdhaXJjcmFmdCcsXG4gICAgJ2FsY29ob2wnLFxuICAgICdhbmdlcicsXG4gICAgJ2FwcGxhdXNlJyxcbiAgICAnYXJpdGhtZXRpYycsXG4gICAgLy8gJ2FydCcsXG4gICAgJ2Fzc2lzdGFuY2UnLFxuICAgICdhdGhsZXRpY3MnLFxuICAgIC8vICdhdHRlbnRpb24nLFxuXG4gICAgJ2JhY29uJyxcbiAgICAnYmFnZ2FnZScsXG4gICAgLy8gJ2JhbGxldCcsXG4gICAgLy8gJ2JlYXV0eScsXG4gICAgJ2JlZWYnLFxuICAgIC8vICdiZWVyJyxcbiAgICAvLyAnYmVoYXZpb3InLFxuICAgICdiaW9sb2d5JyxcbiAgICAvLyAnYmlsbGlhcmRzJyxcbiAgICAnYmxvb2QnLFxuICAgICdib3RhbnknLFxuICAgIC8vICdib3dlbHMnLFxuICAgICdicmVhZCcsXG4gICAgLy8gJ2J1c2luZXNzJyxcbiAgICAnYnV0dGVyJyxcblxuICAgICdjYXJib24nLFxuICAgICdjYXJkYm9hcmQnLFxuICAgICdjYXNoJyxcbiAgICAnY2hhbGsnLFxuICAgICdjaGFvcycsXG4gICAgJ2NoZXNzJyxcbiAgICAnY3Jvc3Nyb2FkcycsXG4gICAgJ2NvdW50cnlzaWRlJyxcblxuICAgIC8vICdkYW1hZ2UnLFxuICAgICdkYW5jaW5nJyxcbiAgICAvLyAnZGFuZ2VyJyxcbiAgICAnZGVlcicsXG4gICAgLy8gJ2RlbGlnaHQnLFxuICAgIC8vICdkZXNzZXJ0JyxcbiAgICAnZGlnbml0eScsXG4gICAgJ2RpcnQnLFxuICAgIC8vICdkaXN0cmlidXRpb24nLFxuICAgICdkdXN0JyxcblxuICAgICdlY29ub21pY3MnLFxuICAgICdlZHVjYXRpb24nLFxuICAgICdlbGVjdHJpY2l0eScsXG4gICAgLy8gJ2VtcGxveW1lbnQnLFxuICAgIC8vICdlbmVyZ3knLFxuICAgICdlbmdpbmVlcmluZycsXG4gICAgJ2Vuam95bWVudCcsXG4gICAgLy8gJ2VudGVydGFpbm1lbnQnLFxuICAgICdlbnZ5JyxcbiAgICAnZXF1aXBtZW50JyxcbiAgICAnZXRoaWNzJyxcbiAgICAnZXZpZGVuY2UnLFxuICAgICdldm9sdXRpb24nLFxuXG4gICAgLy8gJ2ZhaWx1cmUnLFxuICAgIC8vICdmYWl0aCcsXG4gICAgJ2ZhbWUnLFxuICAgICdmaWN0aW9uJyxcbiAgICAvLyAnZmlzaCcsXG4gICAgJ2Zsb3VyJyxcbiAgICAnZmx1JyxcbiAgICAnZm9vZCcsXG4gICAgLy8gJ2ZyZWVkb20nLFxuICAgIC8vICdmcnVpdCcsXG4gICAgJ2Z1ZWwnLFxuICAgICdmdW4nLFxuICAgIC8vICdmdW5lcmFsJyxcbiAgICAnZnVybml0dXJlJyxcblxuICAgICdnYWxsb3dzJyxcbiAgICAnZ2FyYmFnZScsXG4gICAgJ2dhcmxpYycsXG4gICAgLy8gJ2dhcycsXG4gICAgJ2dlbmV0aWNzJyxcbiAgICAvLyAnZ2xhc3MnLFxuICAgICdnb2xkJyxcbiAgICAnZ29sZicsXG4gICAgJ2dvc3NpcCcsXG4gICAgJ2dyYW1tYXInLFxuICAgIC8vICdncmFzcycsXG4gICAgJ2dyYXRpdHVkZScsXG4gICAgJ2dyaWVmJyxcbiAgICAvLyAnZ3JvdW5kJyxcbiAgICAnZ3VpbHQnLFxuICAgICdneW1uYXN0aWNzJyxcblxuICAgIC8vICdoYWlyJyxcbiAgICAnaGFwcGluZXNzJyxcbiAgICAnaGFyZHdhcmUnLFxuICAgICdoYXJtJyxcbiAgICAnaGF0ZScsXG4gICAgJ2hhdHJlZCcsXG4gICAgJ2hlYWx0aCcsXG4gICAgJ2hlYXQnLFxuICAgIC8vICdoZWlnaHQnLFxuICAgICdoZWxwJyxcbiAgICAnaG9tZXdvcmsnLFxuICAgICdob25lc3R5JyxcbiAgICAnaG9uZXknLFxuICAgICdob3NwaXRhbGl0eScsXG4gICAgJ2hvdXNld29yaycsXG4gICAgJ2h1bW91cicsXG4gICAgJ2h1bmdlcicsXG4gICAgJ2h5ZHJvZ2VuJyxcblxuICAgICdpY2UnLFxuICAgICdpbXBvcnRhbmNlJyxcbiAgICAnaW5mbGF0aW9uJyxcbiAgICAnaW5mb3JtYXRpb24nLFxuICAgIC8vICdpbmp1c3RpY2UnLFxuICAgICdpbm5vY2VuY2UnLFxuICAgIC8vICdpbnRlbGxpZ2VuY2UnLFxuICAgICdpcm9uJyxcbiAgICAnaXJvbnknLFxuXG4gICAgJ2phbScsXG4gICAgLy8gJ2plYWxvdXN5JyxcbiAgICAvLyAnamVsbHknLFxuICAgICdqZXdlbHJ5JyxcbiAgICAvLyAnam95JyxcbiAgICAnanVkbycsXG4gICAgLy8gJ2p1aWNlJyxcbiAgICAvLyAnanVzdGljZScsXG5cbiAgICAna2FyYXRlJyxcbiAgICAvLyAna2luZG5lc3MnLFxuICAgICdrbm93bGVkZ2UnLFxuXG4gICAgLy8gJ2xhYm91cicsXG4gICAgJ2xhY2snLFxuICAgIC8vICdsYW5kJyxcbiAgICAnbGF1Z2h0ZXInLFxuICAgICdsYXZhJyxcbiAgICAnbGVhdGhlcicsXG4gICAgJ2xlaXN1cmUnLFxuICAgICdsaWdodG5pbmcnLFxuICAgICdsaW5ndWluZScsXG4gICAgJ2xpbmd1aW5pJyxcbiAgICAnbGluZ3Vpc3RpY3MnLFxuICAgICdsaXRlcmF0dXJlJyxcbiAgICAnbGl0dGVyJyxcbiAgICAnbGl2ZXN0b2NrJyxcbiAgICAnbG9naWMnLFxuICAgICdsb25lbGluZXNzJyxcbiAgICAvLyAnbG92ZScsXG4gICAgJ2x1Y2snLFxuICAgICdsdWdnYWdlJyxcblxuICAgICdtYWNhcm9uaScsXG4gICAgJ21hY2hpbmVyeScsXG4gICAgJ21hZ2ljJyxcbiAgICAvLyAnbWFpbCcsXG4gICAgJ21hbmFnZW1lbnQnLFxuICAgICdtYW5raW5kJyxcbiAgICAnbWFyYmxlJyxcbiAgICAnbWF0aGVtYXRpY3MnLFxuICAgICdtYXlvbm5haXNlJyxcbiAgICAnbWVhc2xlcycsXG4gICAgLy8gJ21lYXQnLFxuICAgIC8vICdtZXRhbCcsXG4gICAgJ21ldGhhbmUnLFxuICAgICdtaWxrJyxcbiAgICAnbWludXMnLFxuICAgICdtb25leScsXG4gICAgLy8gJ21vb3NlJyxcbiAgICAnbXVkJyxcbiAgICAnbXVzaWMnLFxuICAgICdtdW1wcycsXG5cbiAgICAnbmF0dXJlJyxcbiAgICAnbmV3cycsXG4gICAgJ25pdHJvZ2VuJyxcbiAgICAnbm9uc2Vuc2UnLFxuICAgICdudXJ0dXJlJyxcbiAgICAnbnV0cml0aW9uJyxcblxuICAgICdvYmVkaWVuY2UnLFxuICAgICdvYmVzaXR5JyxcbiAgICAvLyAnb2lsJyxcbiAgICAnb3h5Z2VuJyxcblxuICAgIC8vICdwYXBlcicsXG4gICAgLy8gJ3Bhc3Npb24nLFxuICAgICdwYXN0YScsXG4gICAgJ3BhdGllbmNlJyxcbiAgICAvLyAncGVybWlzc2lvbicsXG4gICAgJ3BoeXNpY3MnLFxuICAgICdwb2V0cnknLFxuICAgICdwb2xsdXRpb24nLFxuICAgICdwb3ZlcnR5JyxcbiAgICAvLyAncG93ZXInLFxuICAgICdwcmlkZScsXG4gICAgLy8gJ3Byb2R1Y3Rpb24nLFxuICAgIC8vICdwcm9ncmVzcycsXG4gICAgLy8gJ3Byb251bmNpYXRpb24nLFxuICAgICdwc3ljaG9sb2d5JyxcbiAgICAncHVibGljaXR5JyxcbiAgICAncHVuY3R1YXRpb24nLFxuXG4gICAgLy8gJ3F1YWxpdHknLFxuICAgIC8vICdxdWFudGl0eScsXG4gICAgJ3F1YXJ0eicsXG5cbiAgICAncmFjaXNtJyxcbiAgICAvLyAncmFpbicsXG4gICAgLy8gJ3JlY3JlYXRpb24nLFxuICAgICdyZWxheGF0aW9uJyxcbiAgICAncmVsaWFiaWxpdHknLFxuICAgICdyZXNlYXJjaCcsXG4gICAgJ3Jlc3BlY3QnLFxuICAgICdyZXZlbmdlJyxcbiAgICAncmljZScsXG4gICAgJ3J1YmJpc2gnLFxuICAgICdydW0nLFxuXG4gICAgJ3NhZmV0eScsXG4gICAgLy8gJ3NhbGFkJyxcbiAgICAvLyAnc2FsdCcsXG4gICAgLy8gJ3NhbmQnLFxuICAgIC8vICdzYXRpcmUnLFxuICAgICdzY2VuZXJ5JyxcbiAgICAnc2VhZm9vZCcsXG4gICAgJ3NlYXNpZGUnLFxuICAgICdzZXJpZXMnLFxuICAgICdzaGFtZScsXG4gICAgJ3NoZWVwJyxcbiAgICAnc2hvcHBpbmcnLFxuICAgIC8vICdzaWxlbmNlJyxcbiAgICAnc2xlZXAnLFxuICAgIC8vICdzbGFuZydcbiAgICAnc21va2UnLFxuICAgICdzbW9raW5nJyxcbiAgICAnc25vdycsXG4gICAgJ3NvYXAnLFxuICAgICdzb2Z0d2FyZScsXG4gICAgJ3NvaWwnLFxuICAgIC8vICdzb3Jyb3cnLFxuICAgIC8vICdzb3VwJyxcbiAgICAnc3BhZ2hldHRpJyxcbiAgICAvLyAnc3BlZWQnLFxuICAgICdzcGVjaWVzJyxcbiAgICAvLyAnc3BlbGxpbmcnLFxuICAgIC8vICdzcG9ydCcsXG4gICAgJ3N0ZWFtJyxcbiAgICAvLyAnc3RyZW5ndGgnLFxuICAgICdzdHVmZicsXG4gICAgJ3N0dXBpZGl0eScsXG4gICAgLy8gJ3N1Y2Nlc3MnLFxuICAgIC8vICdzdWdhcicsXG4gICAgJ3N1bnNoaW5lJyxcbiAgICAnc3ltbWV0cnknLFxuXG4gICAgLy8gJ3RlYScsXG4gICAgJ3Rlbm5pcycsXG4gICAgJ3RoaXJzdCcsXG4gICAgJ3RodW5kZXInLFxuICAgICd0aW1iZXInLFxuICAgIC8vICd0aW1lJyxcbiAgICAvLyAndG9hc3QnLFxuICAgIC8vICd0b2xlcmFuY2UnLFxuICAgIC8vICd0cmFkZScsXG4gICAgJ3RyYWZmaWMnLFxuICAgICd0cmFuc3BvcnRhdGlvbicsXG4gICAgLy8gJ3RyYXZlbCcsXG4gICAgJ3RydXN0JyxcblxuICAgIC8vICd1bmRlcnN0YW5kaW5nJyxcbiAgICAndW5kZXJ3ZWFyJyxcbiAgICAndW5lbXBsb3ltZW50JyxcbiAgICAndW5pdHknLFxuICAgIC8vICd1c2FnZScsXG5cbiAgICAndmFsaWRpdHknLFxuICAgICd2ZWFsJyxcbiAgICAndmVnZXRhdGlvbicsXG4gICAgJ3ZlZ2V0YXJpYW5pc20nLFxuICAgICd2ZW5nZWFuY2UnLFxuICAgICd2aW9sZW5jZScsXG4gICAgLy8gJ3Zpc2lvbicsXG4gICAgJ3ZpdGFsaXR5JyxcblxuICAgICd3YXJtdGgnLFxuICAgIC8vICd3YXRlcicsXG4gICAgJ3dlYWx0aCcsXG4gICAgJ3dlYXRoZXInLFxuICAgIC8vICd3ZWlnaHQnLFxuICAgICd3ZWxmYXJlJyxcbiAgICAnd2hlYXQnLFxuICAgIC8vICd3aGlza2V5JyxcbiAgICAvLyAnd2lkdGgnLFxuICAgICd3aWxkbGlmZScsXG4gICAgLy8gJ3dpbmUnLFxuICAgICd3aXNkb20nLFxuICAgIC8vICd3b29kJyxcbiAgICAvLyAnd29vbCcsXG4gICAgLy8gJ3dvcmsnLFxuXG4gICAgLy8gJ3llYXN0JyxcbiAgICAneW9nYScsXG5cbiAgICAnemluYycsXG4gICAgJ3pvb2xvZ3knXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBydWxlcyB0cmFuc2xhdGUgZnJvbSB0aGUgc2luZ3VsYXIgZm9ybSBvZiBhIG5vdW4gdG8gaXRzIHBsdXJhbCBmb3JtLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICB2YXIgcmVnZXggPSB7XG4gICAgcGx1cmFsIDoge1xuICAgICAgbWVuICAgICAgIDogbmV3IFJlZ0V4cCggJ14obXx3b20pZW4kJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBwZW9wbGUgICAgOiBuZXcgUmVnRXhwKCAnKHBlKW9wbGUkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNoaWxkcmVuICA6IG5ldyBSZWdFeHAoICcoY2hpbGQpcmVuJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdGlhICAgICAgIDogbmV3IFJlZ0V4cCggJyhbdGldKWEkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhbmFseXNlcyAgOiBuZXcgUmVnRXhwKCAnKChhKW5hbHl8KGIpYXwoZClpYWdub3wocClhcmVudGhlfChwKXJvZ25vfChzKXlub3B8KHQpaGUpc2VzJCcsJ2dpJyApLFxuICAgICAgaGl2ZXMgICAgIDogbmV3IFJlZ0V4cCggJyhoaXx0aSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjdXJ2ZXMgICAgOiBuZXcgUmVnRXhwKCAnKGN1cnZlKXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGxydmVzICAgICA6IG5ldyBSZWdFeHAoICcoW2xyXSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYXZlcyAgICAgIDogbmV3IFJlZ0V4cCggJyhbYV0pdmVzJCcgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBmb3ZlcyAgICAgOiBuZXcgUmVnRXhwKCAnKFteZm9dKXZlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1vdmllcyAgICA6IG5ldyBSZWdFeHAoICcobSlvdmllcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWVpb3V5aWVzIDogbmV3IFJlZ0V4cCggJyhbXmFlaW91eV18cXUpaWVzJCcgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzZXJpZXMgICAgOiBuZXcgUmVnRXhwKCAnKHMpZXJpZXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHhlcyAgICAgICA6IG5ldyBSZWdFeHAoICcoeHxjaHxzc3xzaCllcyQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWljZSAgICAgIDogbmV3IFJlZ0V4cCggJyhbbXxsXSlpY2UkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBidXNlcyAgICAgOiBuZXcgUmVnRXhwKCAnKGJ1cyllcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9lcyAgICAgICA6IG5ldyBSZWdFeHAoICcobyllcyQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc2hvZXMgICAgIDogbmV3IFJlZ0V4cCggJyhzaG9lKXMkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjcmlzZXMgICAgOiBuZXcgUmVnRXhwKCAnKGNyaXN8YXh8dGVzdCllcyQnICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9jdG9waSAgICA6IG5ldyBSZWdFeHAoICcob2N0b3B8dmlyKWkkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWxpYXNlcyAgIDogbmV3IFJlZ0V4cCggJyhhbGlhc3xjYW52YXN8c3RhdHVzfGNhbXB1cyllcyQnLCAnZ2knICksXG4gICAgICBzdW1tb25zZXMgOiBuZXcgUmVnRXhwKCAnXihzdW1tb25zKWVzJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG94ZW4gICAgICA6IG5ldyBSZWdFeHAoICdeKG94KWVuJyAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWF0cmljZXMgIDogbmV3IFJlZ0V4cCggJyhtYXRyKWljZXMkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB2ZXJ0aWNlcyAgOiBuZXcgUmVnRXhwKCAnKHZlcnR8aW5kKWljZXMkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZlZXQgICAgICA6IG5ldyBSZWdFeHAoICdeZmVldCQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdGVldGggICAgIDogbmV3IFJlZ0V4cCggJ150ZWV0aCQnICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBnZWVzZSAgICAgOiBuZXcgUmVnRXhwKCAnXmdlZXNlJCcgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHF1aXp6ZXMgICA6IG5ldyBSZWdFeHAoICcocXVpeil6ZXMkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgd2hlcmVhc2VzIDogbmV3IFJlZ0V4cCggJ14od2hlcmVhcyllcyQnICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjcml0ZXJpYSAgOiBuZXcgUmVnRXhwKCAnXihjcml0ZXJpKWEkJyAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlbmVyYSAgICA6IG5ldyBSZWdFeHAoICdeZ2VuZXJhJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc3MgICAgICAgIDogbmV3IFJlZ0V4cCggJ3NzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzICAgICAgICAgOiBuZXcgUmVnRXhwKCAncyQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKVxuICAgIH0sXG5cbiAgICBzaW5ndWxhciA6IHtcbiAgICAgIG1hbiAgICAgICA6IG5ldyBSZWdFeHAoICdeKG18d29tKWFuJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHBlcnNvbiAgICA6IG5ldyBSZWdFeHAoICcocGUpcnNvbiQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNoaWxkICAgICA6IG5ldyBSZWdFeHAoICcoY2hpbGQpJCcgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG94ICAgICAgICA6IG5ldyBSZWdFeHAoICdeKG94KSQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGF4aXMgICAgICA6IG5ldyBSZWdFeHAoICcoYXh8dGVzdClpcyQnICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9jdG9wdXMgICA6IG5ldyBSZWdFeHAoICcob2N0b3B8dmlyKXVzJCcgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFsaWFzICAgICA6IG5ldyBSZWdFeHAoICcoYWxpYXN8c3RhdHVzfGNhbnZhc3xjYW1wdXMpJCcsICdnaScgKSxcbiAgICAgIHN1bW1vbnMgICA6IG5ldyBSZWdFeHAoICdeKHN1bW1vbnMpJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1cyAgICAgICA6IG5ldyBSZWdFeHAoICcoYnUpcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1ZmZhbG8gICA6IG5ldyBSZWdFeHAoICcoYnVmZmFsfHRvbWF0fHBvdGF0KW8kJyAgICAgICAsICdnaScgKSxcbiAgICAgIHRpdW0gICAgICA6IG5ldyBSZWdFeHAoICcoW3RpXSl1bSQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHNpcyAgICAgICA6IG5ldyBSZWdFeHAoICdzaXMkJyAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZmZSAgICAgICA6IG5ldyBSZWdFeHAoICcoPzooW15mXSlmZXwoW2xyXSlmKSQnICAgICAgICAsICdnaScgKSxcbiAgICAgIGhpdmUgICAgICA6IG5ldyBSZWdFeHAoICcoaGl8dGkpdmUkJyAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFlaW91eXkgICA6IG5ldyBSZWdFeHAoICcoW15hZWlvdXldfHF1KXkkJyAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHggICAgICAgICA6IG5ldyBSZWdFeHAoICcoeHxjaHxzc3xzaCkkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1hdHJpeCAgICA6IG5ldyBSZWdFeHAoICcobWF0cilpeCQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHZlcnRleCAgICA6IG5ldyBSZWdFeHAoICcodmVydHxpbmQpZXgkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1vdXNlICAgICA6IG5ldyBSZWdFeHAoICcoW218bF0pb3VzZSQnICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZvb3QgICAgICA6IG5ldyBSZWdFeHAoICdeZm9vdCQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHRvb3RoICAgICA6IG5ldyBSZWdFeHAoICdedG9vdGgkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdvb3NlICAgICA6IG5ldyBSZWdFeHAoICdeZ29vc2UkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHF1aXogICAgICA6IG5ldyBSZWdFeHAoICcocXVpeikkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHdoZXJlYXMgICA6IG5ldyBSZWdFeHAoICdeKHdoZXJlYXMpJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXRlcmlvbiA6IG5ldyBSZWdFeHAoICdeKGNyaXRlcmkpb24kJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlbnVzICAgICA6IG5ldyBSZWdFeHAoICdeZ2VudXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHMgICAgICAgICA6IG5ldyBSZWdFeHAoICdzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNvbW1vbiAgICA6IG5ldyBSZWdFeHAoICckJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKVxuICAgIH1cbiAgfTtcblxuICB2YXIgcGx1cmFsX3J1bGVzID0gW1xuXG4gICAgLy8gZG8gbm90IHJlcGxhY2UgaWYgaXRzIGFscmVhZHkgYSBwbHVyYWwgd29yZFxuICAgIFsgcmVnZXgucGx1cmFsLm1lbiAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnBlb3BsZSAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNoaWxkcmVuICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnRpYSAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFuYWx5c2VzICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmhpdmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmN1cnZlcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmxydmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZvdmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFlaW91eWllcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNlcmllcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1vdmllcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnhlcyAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1pY2UgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmJ1c2VzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9lcyAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNob2VzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXNlcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9jdG9waSAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFsaWFzZXMgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnN1bW1vbnNlcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm94ZW4gICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1hdHJpY2VzICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZlZXQgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnRlZXRoICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlZXNlICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnF1aXp6ZXMgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLndoZXJlYXNlcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXRlcmlhICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlbmVyYSAgICBdLFxuXG4gICAgLy8gb3JpZ2luYWwgcnVsZVxuICAgIFsgcmVnZXguc2luZ3VsYXIubWFuICAgICAgLCAnJDFlbicgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnBlcnNvbiAgICwgJyQxb3BsZScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmNoaWxkICAgICwgJyQxcmVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub3ggICAgICAgLCAnJDFlbicgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmF4aXMgICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5vY3RvcHVzICAsICckMWknIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hbGlhcyAgICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc3VtbW9ucyAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmJ1cyAgICAgICwgJyQxc2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVmZmFsbyAgLCAnJDFvZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50aXVtICAgICAsICckMWEnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zaXMgICAgICAsICdzZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mZmUgICAgICAsICckMSQydmVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuaGl2ZSAgICAgLCAnJDF2ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hZWlvdXl5ICAsICckMWllcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm1hdHJpeCAgICwgJyQxaWNlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnZlcnRleCAgICwgJyQxaWNlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnggICAgICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tb3VzZSAgICAsICckMWljZScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmZvb3QgICAgICwgJ2ZlZXQnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50b290aCAgICAsICd0ZWV0aCcgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmdvb3NlICAgICwgJ2dlZXNlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucXVpeiAgICAgLCAnJDF6ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci53aGVyZWFzICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY3JpdGVyaW9uLCAnJDFhJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ2VudXMgICAgLCAnZ2VuZXJhJyBdLFxuXG4gICAgWyByZWdleC5zaW5ndWxhci5zICAgICAsICdzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY29tbW9uLCAncycgXVxuICBdO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhlc2UgcnVsZXMgdHJhbnNsYXRlIGZyb20gdGhlIHBsdXJhbCBmb3JtIG9mIGEgbm91biB0byBpdHMgc2luZ3VsYXIgZm9ybS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBzaW5ndWxhcl9ydWxlcyA9IFtcblxuICAgIC8vIGRvIG5vdCByZXBsYWNlIGlmIGl0cyBhbHJlYWR5IGEgc2luZ3VsYXIgd29yZFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWFuICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucGVyc29uICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY2hpbGQgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub3ggICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYXhpcyAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub2N0b3B1cyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYWxpYXMgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc3VtbW9ucyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVzICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVmZmFsbyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudGl1bSAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc2lzICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZmZlICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuaGl2ZSAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYWVpb3V5eSBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIueCAgICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWF0cml4ICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubW91c2UgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZm9vdCAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudG9vdGggICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ29vc2UgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucXVpeiAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIud2hlcmVhcyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY3JpdGVyaW9uIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nZW51cyBdLFxuXG4gICAgLy8gb3JpZ2luYWwgcnVsZVxuICAgIFsgcmVnZXgucGx1cmFsLm1lbiAgICAgICwgJyQxYW4nIF0sXG4gICAgWyByZWdleC5wbHVyYWwucGVvcGxlICAgLCAnJDFyc29uJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNoaWxkcmVuICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlbmVyYSAgICwgJ2dlbnVzJ10sXG4gICAgWyByZWdleC5wbHVyYWwuY3JpdGVyaWEgLCAnJDFvbiddLFxuICAgIFsgcmVnZXgucGx1cmFsLnRpYSAgICAgICwgJyQxdW0nIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYW5hbHlzZXMgLCAnJDEkMnNpcycgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5oaXZlcyAgICAsICckMXZlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmN1cnZlcyAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmxydmVzICAgICwgJyQxZicgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hdmVzICAgICAsICckMXZlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZvdmVzICAgICwgJyQxZmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubW92aWVzICAgLCAnJDFvdmllJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFlaW91eWllcywgJyQxeScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zZXJpZXMgICAsICckMWVyaWVzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnhlcyAgICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1pY2UgICAgICwgJyQxb3VzZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5idXNlcyAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5vZXMgICAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zaG9lcyAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5jcmlzZXMgICAsICckMWlzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9jdG9waSAgICwgJyQxdXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWxpYXNlcyAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc3VtbW9uc2VzLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwub3hlbiAgICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWF0cmljZXMgLCAnJDFpeCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC52ZXJ0aWNlcyAsICckMWV4JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZlZXQgICAgICwgJ2Zvb3QnIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGVldGggICAgLCAndG9vdGgnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2Vlc2UgICAgLCAnZ29vc2UnIF0sXG4gICAgWyByZWdleC5wbHVyYWwucXVpenplcyAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwud2hlcmVhc2VzLCAnJDEnIF0sXG5cbiAgICBbIHJlZ2V4LnBsdXJhbC5zcywgJ3NzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnMgLCAnJyBdXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGlzIGlzIGEgbGlzdCBvZiB3b3JkcyB0aGF0IHNob3VsZCBub3QgYmUgY2FwaXRhbGl6ZWQgZm9yIHRpdGxlIGNhc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgbm9uX3RpdGxlY2FzZWRfd29yZHMgPSBbXG4gICAgJ2FuZCcsICdvcicsICdub3InLCAnYScsICdhbicsICd0aGUnLCAnc28nLCAnYnV0JywgJ3RvJywgJ29mJywgJ2F0JywnYnknLFxuICAgICdmcm9tJywgJ2ludG8nLCAnb24nLCAnb250bycsICdvZmYnLCAnb3V0JywgJ2luJywgJ292ZXInLCAnd2l0aCcsICdmb3InXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBhcmUgcmVndWxhciBleHByZXNzaW9ucyB1c2VkIGZvciBjb252ZXJ0aW5nIGJldHdlZW4gU3RyaW5nIGZvcm1hdHMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgaWRfc3VmZml4ICAgICAgICAgPSBuZXcgUmVnRXhwKCAnKF9pZHN8X2lkKSQnLCAnZycgKTtcbiAgdmFyIHVuZGVyYmFyICAgICAgICAgID0gbmV3IFJlZ0V4cCggJ18nLCAnZycgKTtcbiAgdmFyIHNwYWNlX29yX3VuZGVyYmFyID0gbmV3IFJlZ0V4cCggJ1tcXCBfXScsICdnJyApO1xuICB2YXIgdXBwZXJjYXNlICAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFtBLVpdKScsICdnJyApO1xuICB2YXIgdW5kZXJiYXJfcHJlZml4ICAgPSBuZXcgUmVnRXhwKCAnXl8nICk7XG5cbiAgdmFyIGluZmxlY3RvciA9IHtcblxuICAvKipcbiAgICogQSBoZWxwZXIgbWV0aG9kIHRoYXQgYXBwbGllcyBydWxlcyBiYXNlZCByZXBsYWNlbWVudCB0byBhIFN0cmluZy5cbiAgICogQHByaXZhdGVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgU3RyaW5nIHRvIG1vZGlmeSBhbmQgcmV0dXJuIGJhc2VkIG9uIHRoZSBwYXNzZWQgcnVsZXMuXG4gICAqIEBwYXJhbSB7QXJyYXk6IFtSZWdFeHAsIFN0cmluZ119IHJ1bGVzIFJlZ2V4cCB0byBtYXRjaCBwYWlyZWQgd2l0aCBTdHJpbmcgdG8gdXNlIGZvciByZXBsYWNlbWVudFxuICAgKiBAcGFyYW0ge0FycmF5OiBbU3RyaW5nXX0gc2tpcCBTdHJpbmdzIHRvIHNraXAgaWYgdGhleSBtYXRjaFxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3ZlcnJpZGUgU3RyaW5nIHRvIHJldHVybiBhcyB0aG91Z2ggdGhpcyBtZXRob2Qgc3VjY2VlZGVkICh1c2VkIHRvIGNvbmZvcm0gdG8gQVBJcylcbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIHBhc3NlZCBTdHJpbmcgbW9kaWZpZWQgYnkgcGFzc2VkIHJ1bGVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdGhpcy5fYXBwbHlfcnVsZXMoICdjb3dzJywgc2luZ3VsYXJfcnVsZXMgKTsgLy8gPT09ICdjb3cnXG4gICAqL1xuICAgIF9hcHBseV9ydWxlcyA6IGZ1bmN0aW9uICggc3RyLCBydWxlcywgc2tpcCwgb3ZlcnJpZGUgKXtcbiAgICAgIGlmKCBvdmVycmlkZSApe1xuICAgICAgICBzdHIgPSBvdmVycmlkZTtcbiAgICAgIH1lbHNle1xuICAgICAgICB2YXIgaWdub3JlID0gKCBpbmZsZWN0b3IuaW5kZXhPZiggc2tpcCwgc3RyLnRvTG93ZXJDYXNlKCkpID4gLTEgKTtcblxuICAgICAgICBpZiggIWlnbm9yZSApe1xuICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICB2YXIgaiA9IHJ1bGVzLmxlbmd0aDtcblxuICAgICAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgICAgICBpZiggc3RyLm1hdGNoKCBydWxlc1sgaSBdWyAwIF0pKXtcbiAgICAgICAgICAgICAgaWYoIHJ1bGVzWyBpIF1bIDEgXSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoIHJ1bGVzWyBpIF1bIDAgXSwgcnVsZXNbIGkgXVsgMSBdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBsZXRzIHVzIGRldGVjdCBpZiBhbiBBcnJheSBjb250YWlucyBhIGdpdmVuIGVsZW1lbnQuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyciBUaGUgc3ViamVjdCBhcnJheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gT2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgQXJyYXkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tX2luZGV4IFN0YXJ0cyBjaGVja2luZyBmcm9tIHRoaXMgcG9zaXRpb24gaW4gdGhlIEFycmF5LihvcHRpb25hbClcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyZV9mdW5jIEZ1bmN0aW9uIHVzZWQgdG8gY29tcGFyZSBBcnJheSBpdGVtIHZzIHBhc3NlZCBpdGVtLihvcHRpb25hbClcbiAgICogQHJldHVybnMge051bWJlcn0gUmV0dXJuIGluZGV4IHBvc2l0aW9uIGluIHRoZSBBcnJheSBvZiB0aGUgcGFzc2VkIGl0ZW0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmRleE9mKFsgJ2hpJywndGhlcmUnIF0sICdndXlzJyApOyAvLyA9PT0gLTFcbiAgICogICAgIGluZmxlY3Rpb24uaW5kZXhPZihbICdoaScsJ3RoZXJlJyBdLCAnaGknICk7IC8vID09PSAwXG4gICAqL1xuICAgIGluZGV4T2YgOiBmdW5jdGlvbiAoIGFyciwgaXRlbSwgZnJvbV9pbmRleCwgY29tcGFyZV9mdW5jICl7XG4gICAgICBpZiggIWZyb21faW5kZXggKXtcbiAgICAgICAgZnJvbV9pbmRleCA9IC0xO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgIHZhciBpICAgICA9IGZyb21faW5kZXg7XG4gICAgICB2YXIgaiAgICAgPSBhcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBpZiggYXJyWyBpIF0gID09PSBpdGVtIHx8IGNvbXBhcmVfZnVuYyAmJiBjb21wYXJlX2Z1bmMoIGFyclsgaSBdLCBpdGVtICkpe1xuICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBwbHVyYWxpemF0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwbHVyYWwgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFNpbmd1bGFyIEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHBsdXJhbCBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAncGVyc29uJyApOyAvLyA9PT0gJ3Blb3BsZSdcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAnb2N0b3B1cycgKTsgLy8gPT09ICdvY3RvcGknXG4gICAqICAgICBpbmZsZWN0aW9uLnBsdXJhbGl6ZSggJ0hhdCcgKTsgLy8gPT09ICdIYXRzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdwZXJzb24nLCAnZ3V5cycgKTsgLy8gPT09ICdndXlzJ1xuICAgKi9cbiAgICBwbHVyYWxpemUgOiBmdW5jdGlvbiAoIHN0ciwgcGx1cmFsICl7XG4gICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBwbHVyYWxfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBwbHVyYWwgKTtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHNpbmd1bGFyaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2luZ3VsYXIgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFBsdXJhbCBFbmdsaXNoIGxhbmd1YWdlIG5vdW5zIGFyZSByZXR1cm5lZCBpbiBzaW5ndWxhciBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uc2luZ3VsYXJpemUoICdwZW9wbGUnICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ29jdG9waScgKTsgLy8gPT09ICdvY3RvcHVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ0hhdHMnICk7IC8vID09PSAnSGF0J1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ2d1eXMnLCAncGVyc29uJyApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICovXG4gICAgc2luZ3VsYXJpemUgOiBmdW5jdGlvbiAoIHN0ciwgc2luZ3VsYXIgKXtcbiAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHNpbmd1bGFyX3J1bGVzLCB1bmNvdW50YWJsZV93b3Jkcywgc2luZ3VsYXIgKTtcbiAgICB9LFxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBwbHVyYWxpemUgb3Igc2luZ3VsYXJsaXplIGEgU3RyaW5nIGFwcHJvcHJpYXRlbHkgYmFzZWQgb24gYW4gaW50ZWdlciB2YWx1ZVxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IFRoZSBudW1iZXIgdG8gYmFzZSBwbHVyYWxpemF0aW9uIG9mZiBvZi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpbmd1bGFyIE92ZXJyaWRlcyBub3JtYWwgb3V0cHV0IHdpdGggc2FpZCBTdHJpbmcuKG9wdGlvbmFsKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGx1cmFsIE92ZXJyaWRlcyBub3JtYWwgb3V0cHV0IHdpdGggc2FpZCBTdHJpbmcuKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBFbmdsaXNoIGxhbmd1YWdlIG5vdW5zIGFyZSByZXR1cm5lZCBpbiB0aGUgcGx1cmFsIG9yIHNpbmd1bGFyIGZvcm0gYmFzZWQgb24gdGhlIGNvdW50LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ3Blb3BsZScgMSApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ29jdG9waScgMSApOyAvLyA9PT0gJ29jdG9wdXMnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdIYXRzJyAxICk7IC8vID09PSAnSGF0J1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnZ3V5cycsIDEgLCAncGVyc29uJyApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ3BlcnNvbicsIDIgKTsgLy8gPT09ICdwZW9wbGUnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdvY3RvcHVzJywgMiApOyAvLyA9PT0gJ29jdG9waSdcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ0hhdCcsIDIgKTsgLy8gPT09ICdIYXRzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVyc29uJywgMiwgbnVsbCwgJ2d1eXMnICk7IC8vID09PSAnZ3V5cydcbiAgICovXG4gICAgaW5mbGVjdCA6IGZ1bmN0aW9uICggc3RyLCBjb3VudCwgc2luZ3VsYXIsIHBsdXJhbCApe1xuICAgICAgY291bnQgPSBwYXJzZUludCggY291bnQsIDEwICk7XG5cbiAgICAgIGlmKCBpc05hTiggY291bnQgKSkgcmV0dXJuIHN0cjtcblxuICAgICAgaWYoIGNvdW50ID09PSAwIHx8IGNvdW50ID4gMSApe1xuICAgICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBwbHVyYWxfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBwbHVyYWwgKTtcbiAgICAgIH1lbHNle1xuICAgICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBzaW5ndWxhcl9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHNpbmd1bGFyICk7XG4gICAgICB9XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBjYW1lbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBsb3dfZmlyc3RfbGV0dGVyIERlZmF1bHQgaXMgdG8gY2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSByZXN1bHRzLihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCBsb3dlcmNhc2UgaXQuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IExvd2VyIGNhc2UgdW5kZXJzY29yZWQgd29yZHMgd2lsbCBiZSByZXR1cm5lZCBpbiBjYW1lbCBjYXNlLlxuICAgKiAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxseSAnLycgaXMgdHJhbnNsYXRlZCB0byAnOjonXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5jYW1lbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlUHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uY2FtZWxpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZVByb3BlcnRpZXMnXG4gICAqL1xuICAgIGNhbWVsaXplIDogZnVuY3Rpb24gKCBzdHIsIGxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgIHZhciBzdHJfcGF0aCA9IHN0ci5zcGxpdCggJy8nICk7XG4gICAgICB2YXIgaSAgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgID0gc3RyX3BhdGgubGVuZ3RoO1xuICAgICAgdmFyIHN0cl9hcnIsIGluaXRfeCwgaywgbCwgZmlyc3Q7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIHN0cl9hcnIgPSBzdHJfcGF0aFsgaSBdLnNwbGl0KCAnXycgKTtcbiAgICAgICAgayAgICAgICA9IDA7XG4gICAgICAgIGwgICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcblxuICAgICAgICBmb3IoIDsgayA8IGw7IGsrKyApe1xuICAgICAgICAgIGlmKCBrICE9PSAwICl7XG4gICAgICAgICAgICBzdHJfYXJyWyBrIF0gPSBzdHJfYXJyWyBrIF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmaXJzdCA9IHN0cl9hcnJbIGsgXS5jaGFyQXQoIDAgKTtcbiAgICAgICAgICBmaXJzdCA9IGxvd19maXJzdF9sZXR0ZXIgJiYgaSA9PT0gMCAmJiBrID09PSAwXG4gICAgICAgICAgICA/IGZpcnN0LnRvTG93ZXJDYXNlKCkgOiBmaXJzdC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgIHN0cl9hcnJbIGsgXSA9IGZpcnN0ICsgc3RyX2FyclsgayBdLnN1YnN0cmluZyggMSApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyX3BhdGhbIGkgXSA9IHN0cl9hcnIuam9pbiggJycgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9wYXRoLmpvaW4oICc6OicgKTtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHVuZGVyc2NvcmUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGxfdXBwZXJfY2FzZSBEZWZhdWx0IGlzIHRvIGxvd2VyY2FzZSBhbmQgYWRkIHVuZGVyc2NvcmUgcHJlZml4LihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCByZXR1cm4gYXMgZW50ZXJlZC5cbiAgICogQHJldHVybnMge1N0cmluZ30gQ2FtZWwgY2FzZWQgd29yZHMgYXJlIHJldHVybmVkIGFzIGxvd2VyIGNhc2VkIGFuZCB1bmRlcnNjb3JlZC5cbiAgICogICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsbHkgJzo6JyBpcyB0cmFuc2xhdGVkIHRvICcvJy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdNZXNzYWdlUHJvcGVydGllcycgKTsgLy8gPT09ICdtZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdtZXNzYWdlUHJvcGVydGllcycgKTsgLy8gPT09ICdtZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdNUCcsIHRydWUgKTsgLy8gPT09ICdNUCdcbiAgICovXG4gICAgdW5kZXJzY29yZSA6IGZ1bmN0aW9uICggc3RyLCBhbGxfdXBwZXJfY2FzZSApe1xuICAgICAgaWYoIGFsbF91cHBlcl9jYXNlICYmIHN0ciA9PT0gc3RyLnRvVXBwZXJDYXNlKCkpIHJldHVybiBzdHI7XG5cbiAgICAgIHZhciBzdHJfcGF0aCA9IHN0ci5zcGxpdCggJzo6JyApO1xuICAgICAgdmFyIGkgICAgICAgID0gMDtcbiAgICAgIHZhciBqICAgICAgICA9IHN0cl9wYXRoLmxlbmd0aDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgc3RyX3BhdGhbIGkgXSA9IHN0cl9wYXRoWyBpIF0ucmVwbGFjZSggdXBwZXJjYXNlLCAnXyQxJyApO1xuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX3BhdGhbIGkgXS5yZXBsYWNlKCB1bmRlcmJhcl9wcmVmaXgsICcnICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJfcGF0aC5qb2luKCAnLycgKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgaHVtYW5pemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBsb3dfZmlyc3RfbGV0dGVyIERlZmF1bHQgaXMgdG8gY2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSByZXN1bHRzLihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCBsb3dlcmNhc2UgaXQuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IExvd2VyIGNhc2UgdW5kZXJzY29yZWQgd29yZHMgd2lsbCBiZSByZXR1cm5lZCBpbiBodW1hbml6ZWQgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmh1bWFuaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UgcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uaHVtYW5pemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBodW1hbml6ZSA6IGZ1bmN0aW9uICggc3RyLCBsb3dfZmlyc3RfbGV0dGVyICl7XG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCBpZF9zdWZmaXgsICcnICk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSggdW5kZXJiYXIsICcgJyApO1xuXG4gICAgICBpZiggIWxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgICAgc3RyID0gaW5mbGVjdG9yLmNhcGl0YWxpemUoIHN0ciApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgY2FwaXRhbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gQWxsIGNoYXJhY3RlcnMgd2lsbCBiZSBsb3dlciBjYXNlIGFuZCB0aGUgZmlyc3Qgd2lsbCBiZSB1cHBlci5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNhcGl0YWxpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZV9wcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5jYXBpdGFsaXplKCAnbWVzc2FnZSBwcm9wZXJ0aWVzJywgdHJ1ZSApOyAvLyA9PT0gJ01lc3NhZ2UgcHJvcGVydGllcydcbiAgICovXG4gICAgY2FwaXRhbGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcblxuICAgICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZyggMSApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHJlcGxhY2VzIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzIGluIHRoZSBzdHJpbmcuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXBsYWNlcyBhbGwgc3BhY2VzIG9yIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uZGFzaGVyaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2UtcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uZGFzaGVyaXplKCAnTWVzc2FnZSBQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UtUHJvcGVydGllcydcbiAgICovXG4gICAgZGFzaGVyaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSggc3BhY2Vfb3JfdW5kZXJiYXIsICctJyApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGl0bGVpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gQ2FwaXRhbGl6ZXMgd29yZHMgYXMgeW91IHdvdWxkIGZvciBhIGJvb2sgdGl0bGUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50aXRsZWl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlIFByb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnRpdGxlaXplKCAnbWVzc2FnZSBwcm9wZXJ0aWVzIHRvIGtlZXAnICk7IC8vID09PSAnTWVzc2FnZSBQcm9wZXJ0aWVzIHRvIEtlZXAnXG4gICAqL1xuICAgIHRpdGxlaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciAgICAgICAgID0gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSggdW5kZXJiYXIsICcgJyApO1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICcgJyApO1xuICAgICAgdmFyIGkgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcbiAgICAgIHZhciBkLCBrLCBsO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBkID0gc3RyX2FyclsgaSBdLnNwbGl0KCAnLScgKTtcbiAgICAgICAgayA9IDA7XG4gICAgICAgIGwgPSBkLmxlbmd0aDtcblxuICAgICAgICBmb3IoIDsgayA8IGw7IGsrKyl7XG4gICAgICAgICAgaWYoIGluZmxlY3Rvci5pbmRleE9mKCBub25fdGl0bGVjYXNlZF93b3JkcywgZFsgayBdLnRvTG93ZXJDYXNlKCkpIDwgMCApe1xuICAgICAgICAgICAgZFsgayBdID0gaW5mbGVjdG9yLmNhcGl0YWxpemUoIGRbIGsgXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RyX2FyclsgaSBdID0gZC5qb2luKCAnLScgKTtcbiAgICAgIH1cblxuICAgICAgc3RyID0gc3RyX2Fyci5qb2luKCAnICcgKTtcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZyggMSApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgZGVtb2R1bGl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZW1vdmVzIG1vZHVsZSBuYW1lcyBsZWF2aW5nIG9ubHkgY2xhc3MgbmFtZXMuKFJ1Ynkgc3R5bGUpXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5kZW1vZHVsaXplKCAnTWVzc2FnZTo6QnVzOjpQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ1Byb3BlcnRpZXMnXG4gICAqL1xuICAgIGRlbW9kdWxpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICc6OicgKTtcblxuICAgICAgcmV0dXJuIHN0cl9hcnJbIHN0cl9hcnIubGVuZ3RoIC0gMSBdO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGFibGVpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIGNhbWVsIGNhc2VkIHdvcmRzIGludG8gdGhlaXIgdW5kZXJzY29yZWQgcGx1cmFsIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50YWJsZWl6ZSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICB0YWJsZWl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IudW5kZXJzY29yZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IucGx1cmFsaXplKCBzdHIgKTtcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNsYXNzaWZpY2F0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFVuZGVyc2NvcmVkIHBsdXJhbCBub3VucyBiZWNvbWUgdGhlIGNhbWVsIGNhc2VkIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5jbGFzc2lmeSggJ21lc3NhZ2VfYnVzX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZUJ1c1Byb3BlcnR5J1xuICAgKi9cbiAgICBjbGFzc2lmeSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IuY2FtZWxpemUoIHN0ciApO1xuICAgICAgc3RyID0gaW5mbGVjdG9yLnNpbmd1bGFyaXplKCBzdHIgKTtcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGZvcmVpZ24ga2V5IHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZHJvcF9pZF91YmFyIERlZmF1bHQgaXMgdG8gc2VwZXJhdGUgaWQgd2l0aCBhbiB1bmRlcmJhciBhdCB0aGUgZW5kIG9mIHRoZSBjbGFzcyBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW91IGNhbiBwYXNzIHRydWUgdG8gc2tpcCBpdC4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFVuZGVyc2NvcmVkIHBsdXJhbCBub3VucyBiZWNvbWUgdGhlIGNhbWVsIGNhc2VkIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5mb3JlaWduX2tleSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0eV9pZCdcbiAgICogICAgIGluZmxlY3Rpb24uZm9yZWlnbl9rZXkoICdNZXNzYWdlQnVzUHJvcGVydHknLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZV9idXNfcHJvcGVydHlpZCdcbiAgICovXG4gICAgZm9yZWlnbl9rZXkgOiBmdW5jdGlvbiAoIHN0ciwgZHJvcF9pZF91YmFyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IuZGVtb2R1bGl6ZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IudW5kZXJzY29yZSggc3RyICkgKyAoKCBkcm9wX2lkX3ViYXIgKSA/ICggJycgKSA6ICggJ18nICkpICsgJ2lkJztcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIG9yZGluYWxpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIGFsbCBmb3VuZCBudW1iZXJzIHRoZWlyIHNlcXVlbmNlIGxpa2UgJzIybmQnLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24ub3JkaW5hbGl6ZSggJ3RoZSAxIHBpdGNoJyApOyAvLyA9PT0gJ3RoZSAxc3QgcGl0Y2gnXG4gICAqL1xuICAgIG9yZGluYWxpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICcgJyApO1xuICAgICAgdmFyIGkgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgdmFyIGsgPSBwYXJzZUludCggc3RyX2FyclsgaSBdLCAxMCApO1xuXG4gICAgICAgIGlmKCAhaXNOYU4oIGsgKSl7XG4gICAgICAgICAgdmFyIGx0ZCA9IHN0cl9hcnJbIGkgXS5zdWJzdHJpbmcoIHN0cl9hcnJbIGkgXS5sZW5ndGggLSAyICk7XG4gICAgICAgICAgdmFyIGxkICA9IHN0cl9hcnJbIGkgXS5zdWJzdHJpbmcoIHN0cl9hcnJbIGkgXS5sZW5ndGggLSAxICk7XG4gICAgICAgICAgdmFyIHN1ZiA9ICd0aCc7XG5cbiAgICAgICAgICBpZiggbHRkICE9ICcxMScgJiYgbHRkICE9ICcxMicgJiYgbHRkICE9ICcxMycgKXtcbiAgICAgICAgICAgIGlmKCBsZCA9PT0gJzEnICl7XG4gICAgICAgICAgICAgIHN1ZiA9ICdzdCc7XG4gICAgICAgICAgICB9ZWxzZSBpZiggbGQgPT09ICcyJyApe1xuICAgICAgICAgICAgICBzdWYgPSAnbmQnO1xuICAgICAgICAgICAgfWVsc2UgaWYoIGxkID09PSAnMycgKXtcbiAgICAgICAgICAgICAgc3VmID0gJ3JkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdHJfYXJyWyBpIF0gKz0gc3VmO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJfYXJyLmpvaW4oICcgJyApO1xuICAgIH0sXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gcGVyZm9ybXMgbXVsdGlwbGUgaW5mbGVjdGlvbiBtZXRob2RzIG9uIGEgc3RyaW5nXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnIgQW4gYXJyYXkgb2YgaW5mbGVjdGlvbiBtZXRob2RzLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24udHJhbnNmb3JtKCAnYWxsIGpvYicsIFsgJ3BsdXJhbGl6ZScsICdjYXBpdGFsaXplJywgJ2Rhc2hlcml6ZScgXSk7IC8vID09PSAnQWxsLWpvYnMnXG4gICAqL1xuICAgIHRyYW5zZm9ybSA6IGZ1bmN0aW9uICggc3RyLCBhcnIgKXtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHZhciBqID0gYXJyLmxlbmd0aDtcblxuICAgICAgZm9yKCA7aSA8IGo7IGkrKyApe1xuICAgICAgICB2YXIgbWV0aG9kID0gYXJyWyBpIF07XG5cbiAgICAgICAgaWYoIGluZmxlY3Rvci5oYXNPd25Qcm9wZXJ0eSggbWV0aG9kICkpe1xuICAgICAgICAgIHN0ciA9IGluZmxlY3RvclsgbWV0aG9kIF0oIHN0ciApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuICBpbmZsZWN0b3IudmVyc2lvbiA9ICcxLjEyLjAnO1xuXG4gIHJldHVybiBpbmZsZWN0b3I7XG59KSk7XG4iXX0=
