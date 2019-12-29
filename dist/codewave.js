(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringHelper = require('./helpers/StringHelper').StringHelper;

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
      var _this = this;

      var opt = Object.keys(this.defaults).reduce(function (opt, key) {
        opt[key] = _this[key];
        return opt;
      }, {});
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
      var _this2 = this;

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

            f = _this2.context.codewave.findAnyNext(match.start(), [left, '\n', '\r'], -1);
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

      if (text != null) {
        var ecl = StringHelper.escapeRegExp(this.context.wrapCommentLeft());
        var ecr = StringHelper.escapeRegExp(this.context.wrapCommentRight());
        var ed = StringHelper.escapeRegExp(this.deco);
        var flag = options.multiline ? 'gm' : '';
        var re1 = new RegExp("^\\s*".concat(ecl, "(?:").concat(ed, ")*\\s{0,").concat(this.pad, "}"), flag);
        var re2 = new RegExp("\\s*(?:".concat(ed, ")*").concat(ecr, "\\s*$"), flag);
        return text.replace(re1, '').replace(re2, '');
      }
    }
  }]);

  return BoxHelper;
}();

exports.BoxHelper = BoxHelper;

},{"./helpers/StringHelper":34,"./positioning/Pair":35}],2:[function(require,module,exports){
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
      this._typed = null;
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
      var i, j, len, ref, targetPos, targetText;
      ref = this.replacements;

      for (i = j = 0, len = ref.length; j < len; i = ++j) {
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
      var i, j, len, ref, targetPos, targetText;
      ref = this.replacements;

      for (i = j = 0, len = ref.length; j < len; i = ++j) {
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

      this.timeout = setTimeout(function () {
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
      var i, j, len, next, ref, targetPos;
      ref = this.replacements;

      for (i = j = 0, len = ref.length; j < len; i = ++j) {
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
      var _NamespaceHelper$spli3 = NamespaceHelper.splitFirst(namespace, true),
          _NamespaceHelper$spli4 = _slicedToArray(_NamespaceHelper$spli3, 2),
          space = _NamespaceHelper$spli4[0],
          remain = _NamespaceHelper$spli4[1];

      return this.names.map(function (name) {
        var _NamespaceHelper$spli5 = NamespaceHelper.splitFirst(name),
            _NamespaceHelper$spli6 = _slicedToArray(_NamespaceHelper$spli5, 2),
            curSpace = _NamespaceHelper$spli6[0],
            curRemain = _NamespaceHelper$spli6[1];

        if (curSpace === space) {
          name = curRemain;
        }

        if (remain != null) {
          name = remain + ':' + name;
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
      var direct, fallback, j, k, len, len1, name, names, nspc, posibilities, ref, ref1, ref2, ref3, ref4, space;

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
        var nspcName = NamespaceHelper.splitFirst(nspc, true)[0];
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
      this.named[name] = val;
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
          var CommandClass = cmd.cls;
          this.cmdObj = new CommandClass(this);
          return this.cmdObj;
        }
      }
    }
  }, {
    key: "_initParams",
    value: function _initParams() {
      this.named = this.getDefaults();
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

var defaultOptions = {
  brakets: '~~',
  deco: '~',
  closeChar: '/',
  noExecuteChar: '!',
  carretChar: '|',
  checkCarret: true,
  inInstance: null
};

var Codewave =
/*#__PURE__*/
function () {
  function Codewave(editor) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Codewave);

    this.editor = editor;
    Codewave.init();
    this.marker = '[[[[codewave_marquer]]]]';
    this.vars = {};
    var defaults = Codewave.defaultOptions;
    this.parent = options.parent;
    this.nested = this.parent != null ? this.parent.nested + 1 : 0;
    Object.keys(defaults).forEach(function (key) {
      if (key in options) {
        _this[key] = options[key];
      } else if (_this.parent != null && key !== 'parent') {
        _this[key] = _this.parent[key];
      } else {
        _this[key] = defaults[key];
      }
    });

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
      var _this2 = this;

      this.process = new Process();
      this.logger.log('activation key');
      return this.runAtCursorPos().then(function () {
        _this2.process = null;
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
      var _this3 = this;

      return Promise.resolve().then(function () {
        if (multiPos.length > 0) {
          var cmd = _this3.commandOnPos(multiPos[0].end);

          if (cmd != null) {
            if (multiPos.length > 1) {
              cmd.setMultiPos(multiPos);
            }

            cmd.init();

            _this3.logger.log(cmd);

            return cmd.execute();
          } else {
            if (multiPos[0].start === multiPos[0].end) {
              return _this3.addBrakets(multiPos);
            } else {
              return _this3.promptClosingCmd(multiPos);
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
      pos = start; // eslint-disable-next-line no-cond-assign

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
      var f = this.findAnyNext(start, [this.brakets, '\n'], direction);

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
      var f = this.findAnyNext(start, [string], direction);

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
      nested = 0; // eslint-disable-next-line no-cond-assign

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
      pos = new PosCollection(pos);
      var replacements = pos.wrap(this.brakets, this.brakets).map(function (r) {
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

      this.closingPromp = ClosingPromp.newFor(this, selections).begin();
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

      pos = 0; // eslint-disable-next-line no-cond-assign

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

Codewave.inited = false;
Codewave.defaultOptions = defaultOptions;
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

EditCmdProp.Source =
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

EditCmdProp.String =
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

EditCmdProp.RevBool =
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

EditCmdProp.Bool =
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
Command.providers = [new CoreCommandProvider(), new JsCommandProvider(), new PhpCommandProvider(), new HtmlCommandProvider(), new FileCommandProvider(), new StringCommandProvider()]; // eslint-disable-next-line no-undef

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

var BoxCmd, CloseCmd, EditCmd, EmmetCmd, NameSpaceCmd, TemplateCmd, aliasCommand, getCommand, getContent, getParam, help, listCommand, removeCommand, renameCommand, setCommand, storeJsonCommand;

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
          result: noExecute,
          help: 'Prevent everything inside the open and close tag from executing'
        },
        escape_pipes: {
          result: quoteCarret,
          checkCarret: false,
          help: 'Escape all carrets (from "|" to "||")'
        },
        quote_carret: {
          aliasOf: 'core:escape_pipes'
        },
        exec_parent: {
          execute: execParent,
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

var noExecute = function noExecute(instance) {
  var reg;
  reg = new RegExp('^(' + StringHelper.escapeRegExp(instance.codewave.brakets) + ')' + StringHelper.escapeRegExp(instance.codewave.noExecuteChar));
  return instance.str.replace(reg, '$1');
};

var quoteCarret = function quoteCarret(instance) {
  return instance.content.replace(/\|/g, '||');
};

var execParent = function execParent(instance) {
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

EditCmd.props = [new EditCmdProp.RevBool('no_carret', {
  opt: 'checkCarret'
}), new EditCmdProp.RevBool('no_parse', {
  opt: 'parse'
}), new EditCmdProp.Bool('prevent_parse_all', {
  opt: 'preventParseAll'
}), new EditCmdProp.Bool('replace_box', {
  opt: 'replaceBox'
}), new EditCmdProp.String('name_to_param', {
  opt: 'nameToParam'
}), new EditCmdProp.String('alias_of', {
  "var": 'aliasOf',
  carret: true
}), new EditCmdProp.Source('help', {
  funct: 'help',
  showEmpty: true
}), new EditCmdProp.Source('source', {
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

},{"../Command":6}],20:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmpzIiwibGliL0Nsb3NpbmdQcm9tcC5qcyIsImxpYi9DbWRGaW5kZXIuanMiLCJsaWIvQ21kSW5zdGFuY2UuanMiLCJsaWIvQ29kZXdhdmUuanMiLCJsaWIvQ29tbWFuZC5qcyIsImxpYi9Db250ZXh0LmpzIiwibGliL0VkaXRDbWRQcm9wLmpzIiwibGliL0VkaXRvci5qcyIsImxpYi9Mb2dnZXIuanMiLCJsaWIvT3B0aW9uT2JqZWN0LmpzIiwibGliL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5qcyIsImxpYi9Qcm9jZXNzLmpzIiwibGliL1N0b3JhZ2UuanMiLCJsaWIvVGV4dEFyZWFFZGl0b3IuanMiLCJsaWIvVGV4dFBhcnNlci5qcyIsImxpYi9ib290c3RyYXAuanMiLCJsaWIvY21kcy9Db3JlQ29tbWFuZFByb3ZpZGVyLmpzIiwibGliL2NtZHMvRmlsZUNvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL0h0bWxDb21tYW5kUHJvdmlkZXIuanMiLCJsaWIvY21kcy9Kc0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1BocENvbW1hbmRQcm92aWRlci5qcyIsImxpYi9jbWRzL1N0cmluZ0NvbW1hbmRQcm92aWRlci5qcyIsImxpYi9kZXRlY3RvcnMvQWx3YXlzRW5hYmxlZC5qcyIsImxpYi9kZXRlY3RvcnMvRGV0ZWN0b3IuanMiLCJsaWIvZGV0ZWN0b3JzL0xhbmdEZXRlY3Rvci5qcyIsImxpYi9kZXRlY3RvcnMvUGFpckRldGVjdG9yLmpzIiwibGliL2VudHJ5LmpzIiwibGliL2hlbHBlcnMvQXJyYXlIZWxwZXIuanMiLCJsaWIvaGVscGVycy9Db21tb25IZWxwZXIuanMiLCJsaWIvaGVscGVycy9OYW1lc3BhY2VIZWxwZXIuanMiLCJsaWIvaGVscGVycy9PcHRpb25hbFByb21pc2UuanMiLCJsaWIvaGVscGVycy9QYXRoSGVscGVyLmpzIiwibGliL2hlbHBlcnMvU3RyaW5nSGVscGVyLmpzIiwibGliL3Bvc2l0aW9uaW5nL1BhaXIuanMiLCJsaWIvcG9zaXRpb25pbmcvUGFpck1hdGNoLmpzIiwibGliL3Bvc2l0aW9uaW5nL1Bvcy5qcyIsImxpYi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmpzIiwibGliL3Bvc2l0aW9uaW5nL1JlcGxhY2VtZW50LmpzIiwibGliL3Bvc2l0aW9uaW5nL1NpemUuanMiLCJsaWIvcG9zaXRpb25pbmcvU3RyUG9zLmpzIiwibGliL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MuanMiLCJsaWIvcG9zaXRpb25pbmcvV3JhcHBpbmcuanMiLCJsaWIvc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lLmpzIiwibGliL3N0cmluZ1BhcnNlcnMvQ29udGV4dC5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL0VzY2FwZUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9OYW1lZENvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbUNvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlci5qcyIsImxpYi9zdHJpbmdQYXJzZXJzL1N0cmluZ0NvbnRleHQuanMiLCJsaWIvc3RyaW5nUGFyc2Vycy9WYXJpYWJsZUNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvaW5mbGVjdGlvbi9saWIvaW5mbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQ0EsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUFELENBQVAsQ0FBa0MsWUFBdkQ7O0FBRUEsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQVAsQ0FBOEIsSUFBM0M7O0FBRUEsSUFBSSxTQUFTO0FBQUE7QUFBQTtBQUNYLHFCQUFhLE9BQWIsRUFBb0M7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFDbEMsUUFBSSxHQUFKLEVBQVMsR0FBVCxFQUFjLEdBQWQ7QUFDQSxTQUFL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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IFBhaXIgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BhaXInKS5QYWlyXG5cbnZhciBCb3hIZWxwZXIgPSBjbGFzcyBCb3hIZWxwZXIge1xuICBjb25zdHJ1Y3RvciAoY29udGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGtleSwgcmVmLCB2YWxcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIGRlY286IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5kZWNvLFxuICAgICAgcGFkOiAyLFxuICAgICAgd2lkdGg6IDUwLFxuICAgICAgaGVpZ2h0OiAzLFxuICAgICAgb3BlblRleHQ6ICcnLFxuICAgICAgY2xvc2VUZXh0OiAnJyxcbiAgICAgIHByZWZpeDogJycsXG4gICAgICBzdWZmaXg6ICcnLFxuICAgICAgaW5kZW50OiAwXG4gICAgfVxuICAgIHJlZiA9IHRoaXMuZGVmYXVsdHNcblxuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsID0gcmVmW2tleV1cblxuICAgICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvbmUgKHRleHQpIHtcbiAgICBjb25zdCBvcHQgPSBPYmplY3Qua2V5cyh0aGlzLmRlZmF1bHRzKS5yZWR1Y2UoKG9wdCwga2V5KSA9PiB7XG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XVxuICAgICAgcmV0dXJuIG9wdFxuICAgIH0sIHt9KVxuXG4gICAgcmV0dXJuIG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0LCBvcHQpXG4gIH1cblxuICBkcmF3ICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRTZXAoKSArICdcXG4nICsgdGhpcy5saW5lcyh0ZXh0KSArICdcXG4nICsgdGhpcy5lbmRTZXAoKVxuICB9XG5cbiAgd3JhcENvbW1lbnQgKHN0cikge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnQoc3RyKVxuICB9XG5cbiAgc2VwYXJhdG9yICgpIHtcbiAgICB2YXIgbGVuXG4gICAgbGVuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMud3JhcENvbW1lbnQodGhpcy5kZWNvTGluZShsZW4pKVxuICB9XG5cbiAgc3RhcnRTZXAgKCkge1xuICAgIHZhciBsblxuICAgIGxuID0gdGhpcy53aWR0aCArIDIgKiB0aGlzLnBhZCArIDIgKiB0aGlzLmRlY28ubGVuZ3RoIC0gdGhpcy5vcGVuVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLndyYXBDb21tZW50KHRoaXMub3BlblRleHQgKyB0aGlzLmRlY29MaW5lKGxuKSlcbiAgfVxuXG4gIGVuZFNlcCAoKSB7XG4gICAgdmFyIGxuXG4gICAgbG4gPSB0aGlzLndpZHRoICsgMiAqIHRoaXMucGFkICsgMiAqIHRoaXMuZGVjby5sZW5ndGggLSB0aGlzLmNsb3NlVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy53cmFwQ29tbWVudCh0aGlzLmNsb3NlVGV4dCArIHRoaXMuZGVjb0xpbmUobG4pKSArIHRoaXMuc3VmZml4XG4gIH1cblxuICBkZWNvTGluZSAobGVuKSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCh0aGlzLmRlY28sIGxlbilcbiAgfVxuXG4gIHBhZGRpbmcgKCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoJyAnLCB0aGlzLnBhZClcbiAgfVxuXG4gIGxpbmVzICh0ZXh0ID0gJycsIHVwdG9IZWlnaHQgPSB0cnVlKSB7XG4gICAgdmFyIGwsIGxpbmVzLCB4XG4gICAgdGV4dCA9IHRleHQgfHwgJydcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdCgnXFxuJylcblxuICAgIGlmICh1cHRvSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIHJlZiwgcmVzdWx0c1xuICAgICAgICByZXN1bHRzID0gW11cblxuICAgICAgICBmb3IgKHggPSBpID0gMCwgcmVmID0gdGhpcy5oZWlnaHQ7IHJlZiA+PSAwID8gaSA8PSByZWYgOiBpID49IHJlZjsgeCA9IHJlZiA+PSAwID8gKytpIDogLS1pKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMubGluZShsaW5lc1t4XSB8fCAnJykpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksIGxlbjEsIHJlc3VsdHNcbiAgICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuMSA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICAgIGwgPSBsaW5lc1tpXVxuICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmxpbmUobCkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgfS5jYWxsKHRoaXMpKS5qb2luKCdcXG4nKVxuICAgIH1cbiAgfVxuXG4gIGxpbmUgKHRleHQgPSAnJykge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoJyAnLCB0aGlzLmluZGVudCkgKyB0aGlzLndyYXBDb21tZW50KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpICsgdGV4dCArIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aCgnICcsIHRoaXMud2lkdGggLSB0aGlzLnJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyB0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbylcbiAgfVxuXG4gIGxlZnQgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KHRoaXMuZGVjbyArIHRoaXMucGFkZGluZygpKVxuICB9XG5cbiAgcmlnaHQgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLnBhZGRpbmcoKSArIHRoaXMuZGVjbylcbiAgfVxuXG4gIHJlbW92ZUlnbm9yZWRDb250ZW50ICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKHRoaXMuY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVDYXJyZXQodGV4dCkpXG4gIH1cblxuICB0ZXh0Qm91bmRzICh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRUeHRTaXplKHRoaXMucmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpXG4gIH1cblxuICBnZXRCb3hGb3JQb3MgKHBvcykge1xuICAgIHZhciBjbG9uZSwgY3VyTGVmdCwgZGVwdGgsIGVuZEZpbmQsIGxlZnQsIHBhaXIsIHBsYWNlaG9sZGVyLCByZXMsIHN0YXJ0RmluZFxuICAgIGRlcHRoID0gdGhpcy5nZXROZXN0ZWRMdmwocG9zLnN0YXJ0KVxuXG4gICAgaWYgKGRlcHRoID4gMCkge1xuICAgICAgbGVmdCA9IHRoaXMubGVmdCgpXG4gICAgICBjdXJMZWZ0ID0gU3RyaW5nSGVscGVyLnJlcGVhdChsZWZ0LCBkZXB0aCAtIDEpXG4gICAgICBjbG9uZSA9IHRoaXMuY2xvbmUoKVxuICAgICAgcGxhY2Vob2xkZXIgPSAnIyMjUGxhY2VIb2xkZXIjIyMnXG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aFxuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSB0aGlzLmRlY28gKyB0aGlzLmRlY28gKyBwbGFjZWhvbGRlciArIHRoaXMuZGVjbyArIHRoaXMuZGVjb1xuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLnN0YXJ0U2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsICcuKicpKVxuICAgICAgZW5kRmluZCA9IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5lbmRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwgJy4qJykpXG4gICAgICBwYWlyID0gbmV3IFBhaXIoc3RhcnRGaW5kLCBlbmRGaW5kLCB7XG4gICAgICAgIHZhbGlkTWF0Y2g6IG1hdGNoID0+IHtcbiAgICAgICAgICB2YXIgZiAvLyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuXG4gICAgICAgICAgZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpLCBbbGVmdCwgJ1xcbicsICdcXHInXSwgLTEpXG4gICAgICAgICAgcmV0dXJuIGYgPT0gbnVsbCB8fCBmLnN0ciAhPT0gbGVmdFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmVzID0gcGFpci53cmFwcGVyUG9zKHBvcywgdGhpcy5jb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG5cbiAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhcnQgKz0gY3VyTGVmdC5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE5lc3RlZEx2bCAoaW5kZXgpIHtcbiAgICB2YXIgZGVwdGgsIGYsIGxlZnRcbiAgICBkZXB0aCA9IDBcbiAgICBsZWZ0ID0gdGhpcy5sZWZ0KClcblxuICAgIHdoaWxlICgoZiA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCwgW2xlZnQsICdcXG4nLCAnXFxyJ10sIC0xKSkgIT0gbnVsbCAmJiBmLnN0ciA9PT0gbGVmdCkge1xuICAgICAgaW5kZXggPSBmLnBvc1xuICAgICAgZGVwdGgrK1xuICAgIH1cblxuICAgIHJldHVybiBkZXB0aFxuICB9XG5cbiAgZ2V0T3B0RnJvbUxpbmUgKGxpbmUsIGdldFBhZCA9IHRydWUpIHtcbiAgICB2YXIgZW5kUG9zLCByRW5kLCByU3RhcnQsIHJlc0VuZCwgcmVzU3RhcnQsIHN0YXJ0UG9zXG4gICAgclN0YXJ0ID0gbmV3IFJlZ0V4cCgnKFxcXFxzKikoJyArIFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50TGVmdCh0aGlzLmRlY28pKSArICcpKFxcXFxzKiknKVxuICAgIHJFbmQgPSBuZXcgUmVnRXhwKCcoXFxcXHMqKSgnICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRSaWdodCh0aGlzLmRlY28pKSArICcpKFxcbnwkKScpXG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKVxuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKVxuXG4gICAgaWYgKHJlc1N0YXJ0ICE9IG51bGwgJiYgcmVzRW5kICE9IG51bGwpIHtcbiAgICAgIGlmIChnZXRQYWQpIHtcbiAgICAgICAgdGhpcy5wYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgsIHJlc0VuZFsxXS5sZW5ndGgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW5kZW50ID0gcmVzU3RhcnRbMV0ubGVuZ3RoXG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgdGhpcy5wYWRcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSB0aGlzLnBhZFxuICAgICAgdGhpcy53aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHJlZm9ybWF0TGluZXMgKHRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzKHRoaXMucmVtb3ZlQ29tbWVudCh0ZXh0LCBvcHRpb25zKSwgZmFsc2UpXG4gIH1cblxuICByZW1vdmVDb21tZW50ICh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAodGV4dCAhPSBudWxsKSB7XG4gICAgICBjb25zdCBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGNvbnN0IGVjciA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGNvbnN0IGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmRlY28pXG4gICAgICBjb25zdCBmbGFnID0gb3B0aW9ucy5tdWx0aWxpbmUgPyAnZ20nIDogJydcbiAgICAgIGNvbnN0IHJlMSA9IG5ldyBSZWdFeHAoYF5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHN7MCwke3RoaXMucGFkfX1gLCBmbGFnKVxuICAgICAgY29uc3QgcmUyID0gbmV3IFJlZ0V4cChgXFxcXHMqKD86JHtlZH0pKiR7ZWNyfVxcXFxzKiRgLCBmbGFnKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsICcnKS5yZXBsYWNlKHJlMiwgJycpXG4gICAgfVxuICB9XG59XG5leHBvcnRzLkJveEhlbHBlciA9IEJveEhlbHBlclxuIiwiXG5jb25zdCBQb3NDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJykuUG9zQ29sbGVjdGlvblxuXG5jb25zdCBSZXBsYWNlbWVudCA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUmVwbGFjZW1lbnQnKS5SZXBsYWNlbWVudFxuXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKCcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJylcblxudmFyIENsb3NpbmdQcm9tcCA9IGNsYXNzIENsb3NpbmdQcm9tcCB7XG4gIGNvbnN0cnVjdG9yIChjb2Rld2F2ZTEsIHNlbGVjdGlvbnMpIHtcbiAgICB0aGlzLmNvZGV3YXZlID0gY29kZXdhdmUxXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbFxuICAgIHRoaXMuX3R5cGVkID0gbnVsbFxuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG4gICAgdGhpcy5uYkNoYW5nZXMgPSAwXG4gICAgdGhpcy5zZWxlY3Rpb25zID0gbmV3IFBvc0NvbGxlY3Rpb24oc2VsZWN0aW9ucylcbiAgfVxuXG4gIGJlZ2luICgpIHtcbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlXG4gICAgcmV0dXJuICgwLCBPcHRpb25hbFByb21pc2Uub3B0aW9uYWxQcm9taXNlKSh0aGlzLmFkZENhcnJldHMoKSkudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IuY2FuTGlzdGVuVG9DaGFuZ2UoKSkge1xuICAgICAgICB0aGlzLnByb3h5T25DaGFuZ2UgPSAoY2ggPSBudWxsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25DaGFuZ2UoY2gpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvZGV3YXZlLmVkaXRvci5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnByb3h5T25DaGFuZ2UpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSkucmVzdWx0KClcbiAgfVxuXG4gIGFkZENhcnJldHMgKCkge1xuICAgIHRoaXMucmVwbGFjZW1lbnRzID0gdGhpcy5zZWxlY3Rpb25zLndyYXAodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jYXJyZXRDaGFyICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgJ1xcbicsICdcXG4nICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgKyB0aGlzLmNvZGV3YXZlLmNhcnJldENoYXIgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMpLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAuY2FycmV0VG9TZWwoKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHRoaXMucmVwbGFjZW1lbnRzKVxuICB9XG5cbiAgaW52YWxpZFR5cGVkICgpIHtcbiAgICB0aGlzLl90eXBlZCA9IG51bGxcbiAgfVxuXG4gIG9uQ2hhbmdlIChjaCA9IG51bGwpIHtcbiAgICB0aGlzLmludmFsaWRUeXBlZCgpXG5cbiAgICBpZiAodGhpcy5za2lwRXZlbnQoY2gpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLm5iQ2hhbmdlcysrXG5cbiAgICBpZiAodGhpcy5zaG91bGRTdG9wKCkpIHtcbiAgICAgIHRoaXMuc3RvcCgpXG4gICAgICByZXR1cm4gdGhpcy5jbGVhbkNsb3NlKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdW1lKClcbiAgICB9XG4gIH1cblxuICBza2lwRXZlbnQgKGNoKSB7XG4gICAgcmV0dXJuIGNoICE9IG51bGwgJiYgY2guY2hhckNvZGVBdCgwKSAhPT0gMzJcbiAgfVxuXG4gIHJlc3VtZSAoKSB7fVxuXG4gIHNob3VsZFN0b3AgKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGVkKCkgPT09IGZhbHNlIHx8IHRoaXMudHlwZWQoKS5pbmRleE9mKCcgJykgIT09IC0xXG4gIH1cblxuICBjbGVhbkNsb3NlICgpIHtcbiAgICB2YXIgZW5kLCBqLCBsZW4sIHJlcGwsIHJlcGxhY2VtZW50cywgcmVzLCBzZWwsIHNlbGVjdGlvbnMsIHN0YXJ0XG4gICAgcmVwbGFjZW1lbnRzID0gW11cbiAgICBzZWxlY3Rpb25zID0gdGhpcy5nZXRTZWxlY3Rpb25zKClcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNlbGVjdGlvbnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNlbCA9IHNlbGVjdGlvbnNbal1cblxuICAgICAgY29uc3QgcG9zID0gdGhpcy53aGl0aGluT3BlbkJvdW5kcyhzZWwpXG4gICAgICBpZiAocG9zKSB7XG4gICAgICAgIHN0YXJ0ID0gc2VsXG4gICAgICB9IGVsc2UgaWYgKChlbmQgPSB0aGlzLndoaXRoaW5DbG9zZUJvdW5kcyhzZWwpKSAmJiBzdGFydCAhPSBudWxsKSB7XG4gICAgICAgIHJlcyA9IGVuZC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS5pbm5lclRleHQoKS5zcGxpdCgnICcpWzBdXG4gICAgICAgIHJlcGwgPSBuZXcgUmVwbGFjZW1lbnQoZW5kLmlubmVyU3RhcnQsIGVuZC5pbm5lckVuZCwgcmVzKVxuICAgICAgICByZXBsLnNlbGVjdGlvbnMgPSBbc3RhcnRdXG4gICAgICAgIHJlcGxhY2VtZW50cy5wdXNoKHJlcGwpXG4gICAgICAgIHN0YXJ0ID0gbnVsbFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIH1cblxuICBnZXRTZWxlY3Rpb25zICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5lZGl0b3IuZ2V0TXVsdGlTZWwoKVxuICB9XG5cbiAgc3RvcCAoKSB7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2VcblxuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAgPT09IHRoaXMpIHtcbiAgICAgIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wID0gbnVsbFxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3h5T25DaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuZWRpdG9yLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMucHJveHlPbkNoYW5nZSlcbiAgICB9XG4gIH1cblxuICBjYW5jZWwgKCkge1xuICAgIGlmICh0aGlzLnR5cGVkKCkgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmNhbmNlbFNlbGVjdGlvbnModGhpcy5nZXRTZWxlY3Rpb25zKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RvcCgpXG4gIH1cblxuICBjYW5jZWxTZWxlY3Rpb25zIChzZWxlY3Rpb25zKSB7XG4gICAgdmFyIGVuZCwgaiwgbGVuLCByZXBsYWNlbWVudHMsIHNlbCwgc3RhcnRcbiAgICByZXBsYWNlbWVudHMgPSBbXVxuICAgIHN0YXJ0ID0gbnVsbFxuXG4gICAgZm9yIChqID0gMCwgbGVuID0gc2VsZWN0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgc2VsID0gc2VsZWN0aW9uc1tqXVxuXG4gICAgICBjb25zdCBwb3MgPSB0aGlzLndoaXRoaW5PcGVuQm91bmRzKHNlbClcbiAgICAgIGlmIChwb3MpIHtcbiAgICAgICAgc3RhcnQgPSBwb3NcbiAgICAgIH0gZWxzZSBpZiAoKGVuZCA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHNlbCkpICYmIHN0YXJ0ICE9IG51bGwpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3IFJlcGxhY2VtZW50KHN0YXJ0LnN0YXJ0LCBlbmQuZW5kLCB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHN0YXJ0LmVuZCArIDEsIGVuZC5zdGFydCAtIDEpKS5zZWxlY3RDb250ZW50KCkpXG4gICAgICAgIHN0YXJ0ID0gbnVsbFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIH1cblxuICB0eXBlZCAoKSB7XG4gICAgdmFyIGNwb3MsIGlubmVyRW5kLCBpbm5lclN0YXJ0XG5cbiAgICBpZiAodGhpcy5fdHlwZWQgPT0gbnVsbCkge1xuICAgICAgY3BvcyA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLmdldEN1cnNvclBvcygpXG4gICAgICBpbm5lclN0YXJ0ID0gdGhpcy5yZXBsYWNlbWVudHNbMF0uc3RhcnQgKyB0aGlzLmNvZGV3YXZlLmJyYWtldHMubGVuZ3RoXG5cbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmZpbmRQcmV2QnJha2V0KGNwb3Muc3RhcnQpID09PSB0aGlzLnJlcGxhY2VtZW50c1swXS5zdGFydCAmJiAoaW5uZXJFbmQgPSB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGlubmVyU3RhcnQpKSAhPSBudWxsICYmIGlubmVyRW5kID49IGNwb3MuZW5kKSB7XG4gICAgICAgIHRoaXMuX3R5cGVkID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihpbm5lclN0YXJ0LCBpbm5lckVuZClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3R5cGVkID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdHlwZWRcbiAgfVxuXG4gIHdoaXRoaW5PcGVuQm91bmRzIChwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHRhcmdldFBvcywgdGFyZ2V0VGV4dFxuICAgIHJlZiA9IHRoaXMucmVwbGFjZW1lbnRzXG5cbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5zdGFydFBvc0F0KGkpXG4gICAgICB0YXJnZXRUZXh0ID0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzXG5cbiAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT09IHRhcmdldFRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgd2hpdGhpbkNsb3NlQm91bmRzIChwb3MpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCByZWYsIHRhcmdldFBvcywgdGFyZ2V0VGV4dFxuICAgIHJlZiA9IHRoaXMucmVwbGFjZW1lbnRzXG5cbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgdGFyZ2V0UG9zID0gdGhpcy5lbmRQb3NBdChpKVxuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzXG5cbiAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpICYmIHRhcmdldFBvcy53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKS50ZXh0KCkgPT09IHRhcmdldFRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgc3RhcnRQb3NBdCAoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1swXS5zdGFydCArIHRoaXMudHlwZWQoKS5sZW5ndGggKiAoaW5kZXggKiAyKSwgdGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMF0uZW5kICsgdGhpcy50eXBlZCgpLmxlbmd0aCAqIChpbmRleCAqIDIgKyAxKSkud3JhcHBlZEJ5KHRoaXMuY29kZXdhdmUuYnJha2V0cywgdGhpcy5jb2Rld2F2ZS5icmFrZXRzKVxuICB9XG5cbiAgZW5kUG9zQXQgKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQb3ModGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLnNlbGVjdGlvbnNbMV0uc3RhcnQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDEpLCB0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0uc2VsZWN0aW9uc1sxXS5lbmQgKyB0aGlzLnR5cGVkKCkubGVuZ3RoICogKGluZGV4ICogMiArIDIpKS53cmFwcGVkQnkodGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIsIHRoaXMuY29kZXdhdmUuYnJha2V0cylcbiAgfVxufVxuZXhwb3J0cy5DbG9zaW5nUHJvbXAgPSBDbG9zaW5nUHJvbXBcbnZhciBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgPSBjbGFzcyBTaW11bGF0ZWRDbG9zaW5nUHJvbXAgZXh0ZW5kcyBDbG9zaW5nUHJvbXAge1xuICByZXN1bWUgKCkge1xuICAgIHJldHVybiB0aGlzLnNpbXVsYXRlVHlwZSgpXG4gIH1cblxuICBzaW11bGF0ZVR5cGUgKCkge1xuICAgIGlmICh0aGlzLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICB9XG5cbiAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHZhciBjdXJDbG9zZSwgcmVwbCwgdGFyZ2V0VGV4dFxuICAgICAgdGhpcy5pbnZhbGlkVHlwZWQoKVxuICAgICAgdGFyZ2V0VGV4dCA9IHRoaXMuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy50eXBlZCgpICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzXG4gICAgICBjdXJDbG9zZSA9IHRoaXMud2hpdGhpbkNsb3NlQm91bmRzKHRoaXMucmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnNbMV0uY29weSgpLmFwcGx5T2Zmc2V0KHRoaXMudHlwZWQoKS5sZW5ndGgpKVxuXG4gICAgICBpZiAoY3VyQ2xvc2UpIHtcbiAgICAgICAgcmVwbCA9IG5ldyBSZXBsYWNlbWVudChjdXJDbG9zZS5zdGFydCwgY3VyQ2xvc2UuZW5kLCB0YXJnZXRUZXh0KVxuXG4gICAgICAgIGlmIChyZXBsLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpLm5lY2Vzc2FyeSgpKSB7XG4gICAgICAgICAgdGhpcy5jb2Rld2F2ZS5lZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMoW3JlcGxdKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vblR5cGVTaW11bGF0ZWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vblR5cGVTaW11bGF0ZWQoKVxuICAgICAgfVxuICAgIH0sIDIpXG4gIH1cblxuICBza2lwRXZlbnQgKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIFt0aGlzLmNvZGV3YXZlLmVkaXRvci5nZXRDdXJzb3JQb3MoKSwgdGhpcy5yZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9uc1sxXSArIHRoaXMudHlwZWQoKS5sZW5ndGhdXG4gIH1cblxuICB3aGl0aGluQ2xvc2VCb3VuZHMgKHBvcykge1xuICAgIHZhciBpLCBqLCBsZW4sIG5leHQsIHJlZiwgdGFyZ2V0UG9zXG4gICAgcmVmID0gdGhpcy5yZXBsYWNlbWVudHNcblxuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICB0YXJnZXRQb3MgPSB0aGlzLmVuZFBvc0F0KGkpXG4gICAgICBuZXh0ID0gdGhpcy5jb2Rld2F2ZS5maW5kTmV4dEJyYWtldCh0YXJnZXRQb3MuaW5uZXJTdGFydClcblxuICAgICAgaWYgKG5leHQgIT0gbnVsbCkge1xuICAgICAgICB0YXJnZXRQb3MubW92ZVN1ZmZpeChuZXh0KVxuXG4gICAgICAgIGlmICh0YXJnZXRQb3MuaW5uZXJDb250YWluc1Bvcyhwb3MpKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldFBvc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbmV4cG9ydHMuU2ltdWxhdGVkQ2xvc2luZ1Byb21wID0gU2ltdWxhdGVkQ2xvc2luZ1Byb21wXG5cbkNsb3NpbmdQcm9tcC5uZXdGb3IgPSBmdW5jdGlvbiAoY29kZXdhdmUsIHNlbGVjdGlvbnMpIHtcbiAgaWYgKGNvZGV3YXZlLmVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICByZXR1cm4gbmV3IENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucylcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFNpbXVsYXRlZENsb3NpbmdQcm9tcChjb2Rld2F2ZSwgc2VsZWN0aW9ucylcbiAgfVxufVxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBOYW1lc3BhY2VIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJykuTmFtZXNwYWNlSGVscGVyXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuL0NvbW1hbmQnKS5Db21tYW5kXG5cbnZhciBpbmRleE9mID0gW10uaW5kZXhPZlxuXG52YXIgQ21kRmluZGVyID0gY2xhc3MgQ21kRmluZGVyIHtcbiAgY29uc3RydWN0b3IgKG5hbWVzLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzLCBrZXksIHZhbFxuXG4gICAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXVxuICAgIH1cblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgbmFtZXNwYWNlczogW10sXG4gICAgICBwYXJlbnRDb250ZXh0OiBudWxsLFxuICAgICAgY29udGV4dDogbnVsbCxcbiAgICAgIHJvb3Q6IENvbW1hbmQuY21kcyxcbiAgICAgIG11c3RFeGVjdXRlOiB0cnVlLFxuICAgICAgdXNlRGV0ZWN0b3JzOiB0cnVlLFxuICAgICAgdXNlRmFsbGJhY2tzOiB0cnVlLFxuICAgICAgaW5zdGFuY2U6IG51bGwsXG4gICAgICBjb2Rld2F2ZTogbnVsbFxuICAgIH1cbiAgICB0aGlzLm5hbWVzID0gbmFtZXNcbiAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnMucGFyZW50XG5cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwgJiYga2V5ICE9PSAncGFyZW50Jykge1xuICAgICAgICB0aGlzW2tleV0gPSB0aGlzLnBhcmVudFtrZXldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMuY29kZXdhdmUpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50Q29udGV4dCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQucGFyZW50ID0gdGhpcy5wYXJlbnRDb250ZXh0XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubmFtZXNwYWNlcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyh0aGlzLm5hbWVzcGFjZXMpXG4gICAgfVxuICB9XG5cbiAgZmluZCAoKSB7XG4gICAgdGhpcy50cmlnZ2VyRGV0ZWN0b3JzKClcbiAgICB0aGlzLmNtZCA9IHRoaXMuZmluZEluKHRoaXMucm9vdClcbiAgICByZXR1cm4gdGhpcy5jbWRcbiAgfSAvLyAgZ2V0UG9zaWJpbGl0aWVzOiAtPlxuICAvLyAgICBAdHJpZ2dlckRldGVjdG9ycygpXG4gIC8vICAgIHBhdGggPSBsaXN0KEBwYXRoKVxuICAvLyAgICByZXR1cm4gQGZpbmRQb3NpYmlsaXRpZXNJbihAcm9vdCxwYXRoKVxuXG4gIGdldE5hbWVzV2l0aFBhdGhzICgpIHtcbiAgICB2YXIgaiwgbGVuLCBuYW1lLCBwYXRocywgcmVmLCByZXN0LCBzcGFjZVxuICAgIHBhdGhzID0ge31cbiAgICByZWYgPSB0aGlzLm5hbWVzXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5hbWUgPSByZWZbal07XG4gICAgICBbc3BhY2UsIHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZSlcblxuICAgICAgaWYgKHNwYWNlICE9IG51bGwgJiYgIShpbmRleE9mLmNhbGwodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwgc3BhY2UpID49IDApKSB7XG4gICAgICAgIGlmICghKHNwYWNlIGluIHBhdGhzKSkge1xuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdXG4gICAgICAgIH1cblxuICAgICAgICBwYXRoc1tzcGFjZV0ucHVzaChyZXN0KVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXRoc1xuICB9XG5cbiAgYXBwbHlTcGFjZU9uTmFtZXMgKG5hbWVzcGFjZSkge1xuICAgIGNvbnN0IFtzcGFjZSwgcmVtYWluXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWVzcGFjZSwgdHJ1ZSlcbiAgICByZXR1cm4gdGhpcy5uYW1lcy5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGNvbnN0IFtjdXJTcGFjZSwgY3VyUmVtYWluXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG5cbiAgICAgIGlmIChjdXJTcGFjZSA9PT0gc3BhY2UpIHtcbiAgICAgICAgbmFtZSA9IGN1clJlbWFpblxuICAgICAgfVxuXG4gICAgICBpZiAocmVtYWluICE9IG51bGwpIHtcbiAgICAgICAgbmFtZSA9IHJlbWFpbiArICc6JyArIG5hbWVcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5hbWVcbiAgICB9KVxuICB9XG5cbiAgZ2V0RGlyZWN0TmFtZXMgKCkge1xuICAgIHZhciBuXG4gICAgcmV0dXJuIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaiwgbGVuLCByZWYsIHJlc3VsdHNcbiAgICAgIHJlZiA9IHRoaXMubmFtZXNcbiAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgbiA9IHJlZltqXVxuXG4gICAgICAgIGlmIChuLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gobilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH0uY2FsbCh0aGlzKSlcbiAgfVxuXG4gIHRyaWdnZXJEZXRlY3RvcnMgKCkge1xuICAgIHZhciBjbWQsIGRldGVjdG9yLCBpLCBqLCBsZW4sIHBvc2liaWxpdGllcywgcmVmLCByZXMsIHJlc3VsdHNcblxuICAgIGlmICh0aGlzLnVzZURldGVjdG9ycykge1xuICAgICAgdGhpcy51c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcG9zaWJpbGl0aWVzID0gW3RoaXMucm9vdF0uY29uY2F0KG5ldyBDbWRGaW5kZXIodGhpcy5jb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIG11c3RFeGVjdXRlOiBmYWxzZSxcbiAgICAgICAgdXNlRmFsbGJhY2tzOiBmYWxzZVxuICAgICAgfSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgICAgaSA9IDBcbiAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICB3aGlsZSAoaSA8IHBvc2liaWxpdGllcy5sZW5ndGgpIHtcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldXG4gICAgICAgIHJlZiA9IGNtZC5kZXRlY3RvcnNcblxuICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICBkZXRlY3RvciA9IHJlZltqXVxuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKVxuXG4gICAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZXNwYWNlcyhyZXMpXG4gICAgICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIocmVzLCB7XG4gICAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICAgICAgbXVzdEV4ZWN1dGU6IGZhbHNlLFxuICAgICAgICAgICAgICB1c2VGYWxsYmFja3M6IGZhbHNlXG4gICAgICAgICAgICB9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0cy5wdXNoKGkrKylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG4gIH1cblxuICBmaW5kSW4gKGNtZCwgcGF0aCA9IG51bGwpIHtcbiAgICB2YXIgYmVzdFxuXG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGJlc3QgPSB0aGlzLmJlc3RJblBvc2liaWxpdGllcyh0aGlzLmZpbmRQb3NpYmlsaXRpZXMoKSlcblxuICAgIGlmIChiZXN0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBiZXN0XG4gICAgfVxuICB9XG5cbiAgZmluZFBvc2liaWxpdGllcyAoKSB7XG4gICAgdmFyIGRpcmVjdCwgZmFsbGJhY2ssIGosIGssIGxlbiwgbGVuMSwgbmFtZSwgbmFtZXMsIG5zcGMsIHBvc2liaWxpdGllcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCBzcGFjZVxuXG4gICAgaWYgKHRoaXMucm9vdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0aGlzLnJvb3QuaW5pdCgpXG4gICAgcG9zaWJpbGl0aWVzID0gW11cblxuICAgIGlmICgoKHJlZiA9IHRoaXMuY29kZXdhdmUpICE9IG51bGwgPyAocmVmMSA9IHJlZi5pbkluc3RhbmNlKSAhPSBudWxsID8gcmVmMS5jbWQgOiBudWxsIDogbnVsbCkgPT09IHRoaXMucm9vdCkge1xuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKCdpbl9pbnN0YW5jZScpKVxuICAgIH1cblxuICAgIHJlZjIgPSB0aGlzLmdldE5hbWVzV2l0aFBhdGhzKClcblxuICAgIGZvciAoc3BhY2UgaW4gcmVmMikge1xuICAgICAgbmFtZXMgPSByZWYyW3NwYWNlXVxuICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdCh0aGlzLmdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kKHNwYWNlLCBuYW1lcykpXG4gICAgfVxuXG4gICAgcmVmMyA9IHRoaXMuY29udGV4dC5nZXROYW1lU3BhY2VzKClcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZjMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG5zcGMgPSByZWYzW2pdXG4gICAgICBjb25zdCBuc3BjTmFtZSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsIHRydWUpWzBdXG4gICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KHRoaXMuZ2V0UG9zaWJpbGl0aWVzRnJvbUNvbW1hbmQobnNwY05hbWUsIHRoaXMuYXBwbHlTcGFjZU9uTmFtZXMobnNwYykpKVxuICAgIH1cblxuICAgIHJlZjQgPSB0aGlzLmdldERpcmVjdE5hbWVzKClcblxuICAgIGZvciAoayA9IDAsIGxlbjEgPSByZWY0Lmxlbmd0aDsgayA8IGxlbjE7IGsrKykge1xuICAgICAgbmFtZSA9IHJlZjRba11cbiAgICAgIGRpcmVjdCA9IHRoaXMucm9vdC5nZXRDbWQobmFtZSlcblxuICAgICAgaWYgKHRoaXMuY21kSXNWYWxpZChkaXJlY3QpKSB7XG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy51c2VGYWxsYmFja3MpIHtcbiAgICAgIGZhbGxiYWNrID0gdGhpcy5yb290LmdldENtZCgnZmFsbGJhY2snKVxuXG4gICAgICBpZiAodGhpcy5jbWRJc1ZhbGlkKGZhbGxiYWNrKSkge1xuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjaylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllc1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXNcbiAgfVxuXG4gIGdldFBvc2liaWxpdGllc0Zyb21Db21tYW5kIChjbWROYW1lLCBuYW1lcyA9IHRoaXMubmFtZXMpIHtcbiAgICB2YXIgaiwgbGVuLCBuZXh0LCBuZXh0cywgcG9zaWJpbGl0aWVzXG4gICAgcG9zaWJpbGl0aWVzID0gW11cbiAgICBuZXh0cyA9IHRoaXMuZ2V0Q21kRm9sbG93QWxpYXMoY21kTmFtZSlcblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IG5leHRzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBuZXh0ID0gbmV4dHNbal1cbiAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIHJvb3Q6IG5leHRcbiAgICAgIH0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICB9XG5cbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzXG4gIH1cblxuICBnZXRDbWRGb2xsb3dBbGlhcyAobmFtZSkge1xuICAgIHZhciBjbWRcbiAgICBjbWQgPSB0aGlzLnJvb3QuZ2V0Q21kKG5hbWUpXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KClcblxuICAgICAgaWYgKGNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtjbWQsIGNtZC5nZXRBbGlhc2VkKCldXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbY21kXVxuICAgIH1cblxuICAgIHJldHVybiBbY21kXVxuICB9XG5cbiAgY21kSXNWYWxpZCAoY21kKSB7XG4gICAgaWYgKGNtZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoY21kLm5hbWUgIT09ICdmYWxsYmFjaycgJiYgaW5kZXhPZi5jYWxsKHRoaXMuYW5jZXN0b3JzKCksIGNtZCkgPj0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuICF0aGlzLm11c3RFeGVjdXRlIHx8IHRoaXMuY21kSXNFeGVjdXRhYmxlKGNtZClcbiAgfVxuXG4gIGFuY2VzdG9ycyAoKSB7XG4gICAgdmFyIHJlZlxuXG4gICAgaWYgKCgocmVmID0gdGhpcy5jb2Rld2F2ZSkgIT0gbnVsbCA/IHJlZi5pbkluc3RhbmNlIDogbnVsbCkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICB9XG5cbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGNtZElzRXhlY3V0YWJsZSAoY21kKSB7XG4gICAgdmFyIG5hbWVzXG4gICAgbmFtZXMgPSB0aGlzLmdldERpcmVjdE5hbWVzKClcblxuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgIH1cbiAgfVxuXG4gIGNtZFNjb3JlIChjbWQpIHtcbiAgICB2YXIgc2NvcmVcbiAgICBzY29yZSA9IGNtZC5kZXB0aFxuXG4gICAgaWYgKGNtZC5uYW1lID09PSAnZmFsbGJhY2snKSB7XG4gICAgICBzY29yZSAtPSAxMDAwXG4gICAgfVxuXG4gICAgcmV0dXJuIHNjb3JlXG4gIH1cblxuICBiZXN0SW5Qb3NpYmlsaXRpZXMgKHBvc3MpIHtcbiAgICB2YXIgYmVzdCwgYmVzdFNjb3JlLCBqLCBsZW4sIHAsIHNjb3JlXG5cbiAgICBpZiAocG9zcy5sZW5ndGggPiAwKSB7XG4gICAgICBiZXN0ID0gbnVsbFxuICAgICAgYmVzdFNjb3JlID0gbnVsbFxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBwb3NzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHAgPSBwb3NzW2pdXG4gICAgICAgIHNjb3JlID0gdGhpcy5jbWRTY29yZShwKVxuXG4gICAgICAgIGlmIChiZXN0ID09IG51bGwgfHwgc2NvcmUgPj0gYmVzdFNjb3JlKSB7XG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmVcbiAgICAgICAgICBiZXN0ID0gcFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiZXN0XG4gICAgfVxuICB9XG59XG5leHBvcnRzLkNtZEZpbmRlciA9IENtZEZpbmRlclxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBUZXh0UGFyc2VyID0gcmVxdWlyZSgnLi9UZXh0UGFyc2VyJykuVGV4dFBhcnNlclxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IE9wdGlvbmFsUHJvbWlzZSA9IHJlcXVpcmUoJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnKVxuXG52YXIgQ21kSW5zdGFuY2UgPSBjbGFzcyBDbWRJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yIChjbWQxLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jbWQgPSBjbWQxXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dFxuICB9XG5cbiAgaW5pdCAoKSB7XG4gICAgaWYgKCEodGhpcy5pc0VtcHR5KCkgfHwgdGhpcy5pbml0ZWQpKSB7XG4gICAgICB0aGlzLmluaXRlZCA9IHRydWVcblxuICAgICAgdGhpcy5fZ2V0Q21kT2JqKClcblxuICAgICAgdGhpcy5faW5pdFBhcmFtcygpXG5cbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY21kT2JqLmluaXQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzZXRQYXJhbSAobmFtZSwgdmFsKSB7XG4gICAgdGhpcy5uYW1lZFtuYW1lXSA9IHZhbFxuICB9XG5cbiAgcHVzaFBhcmFtICh2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMucHVzaCh2YWwpXG4gIH1cblxuICBnZXRDb250ZXh0ICgpIHtcbiAgICBpZiAodGhpcy5jb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb250ZXh0IHx8IG5ldyBDb250ZXh0KClcbiAgfVxuXG4gIGdldEZpbmRlciAoY21kTmFtZSkge1xuICAgIHZhciBmaW5kZXJcbiAgICBmaW5kZXIgPSB0aGlzLmdldENvbnRleHQoKS5nZXRGaW5kZXIoY21kTmFtZSwge1xuICAgICAgbmFtZXNwYWNlczogdGhpcy5fZ2V0UGFyZW50TmFtZXNwYWNlcygpXG4gICAgfSlcbiAgICBmaW5kZXIuaW5zdGFuY2UgPSB0aGlzXG4gICAgcmV0dXJuIGZpbmRlclxuICB9XG5cbiAgX2dldENtZE9iaiAoKSB7XG4gICAgdmFyIGNtZFxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY21kLmluaXQoKVxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkKCkgfHwgdGhpcy5jbWRcbiAgICAgIGNtZC5pbml0KClcblxuICAgICAgaWYgKGNtZC5jbHMgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBDb21tYW5kQ2xhc3MgPSBjbWQuY2xzXG4gICAgICAgIHRoaXMuY21kT2JqID0gbmV3IENvbW1hbmRDbGFzcyh0aGlzKVxuICAgICAgICByZXR1cm4gdGhpcy5jbWRPYmpcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaW5pdFBhcmFtcyAoKSB7XG4gICAgdGhpcy5uYW1lZCA9IHRoaXMuZ2V0RGVmYXVsdHMoKVxuICB9XG5cbiAgX2dldFBhcmVudE5hbWVzcGFjZXMgKCkge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgaXNFbXB0eSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY21kICE9IG51bGxcbiAgfVxuXG4gIHJlc3VsdElzQXZhaWxhYmxlICgpIHtcbiAgICB2YXIgYWxpYXNlZFxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICB9XG5cbiAgICAgIGFsaWFzZWQgPSB0aGlzLmdldEFsaWFzZWRGaW5hbCgpXG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jbWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZ2V0RGVmYXVsdHMgKCkge1xuICAgIHZhciBhbGlhc2VkLCByZXNcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXMgPSB7fVxuICAgICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpXG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSlcbiAgICAgIH1cblxuICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuY21kLmRlZmF1bHRzKVxuXG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5jbWRPYmouZ2V0RGVmYXVsdHMoKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG4gIH1cblxuICBnZXRBbGlhc2VkICgpIHtcbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYWxpYXNlZENtZCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuYWxpYXNlZENtZCB8fCBudWxsXG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZEZpbmFsICgpIHtcbiAgICB2YXIgYWxpYXNlZFxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFsaWFzZWRGaW5hbENtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsaWFzZWRGaW5hbENtZCB8fCBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNtZC5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgICAgYWxpYXNlZCA9IHRoaXMuY21kXG5cbiAgICAgICAgd2hpbGUgKGFsaWFzZWQgIT0gbnVsbCAmJiBhbGlhc2VkLmFsaWFzT2YgIT0gbnVsbCkge1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcih0aGlzLmdldEZpbmRlcih0aGlzLmFsdGVyQWxpYXNPZihhbGlhc2VkLmFsaWFzT2YpKSlcblxuICAgICAgICAgIGlmICh0aGlzLmFsaWFzZWRDbWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hbGlhc2VkQ21kID0gYWxpYXNlZCB8fCBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWxpYXNlZEZpbmFsQ21kID0gYWxpYXNlZCB8fCBmYWxzZVxuICAgICAgICByZXR1cm4gYWxpYXNlZFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFsdGVyQWxpYXNPZiAoYWxpYXNPZikge1xuICAgIHJldHVybiBhbGlhc09mXG4gIH1cblxuICBnZXRPcHRpb25zICgpIHtcbiAgICB2YXIgb3B0XG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9wdGlvbnNcbiAgICAgIH1cblxuICAgICAgb3B0ID0gdGhpcy5jbWQuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKVxuXG4gICAgICBpZiAodGhpcy5jbWRPYmogIT0gbnVsbCkge1xuICAgICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5jbWRPYmouZ2V0T3B0aW9ucygpKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNtZE9wdGlvbnMgPSBvcHRcbiAgICAgIHJldHVybiBvcHRcbiAgICB9XG4gIH1cblxuICBnZXRPcHRpb24gKGtleSkge1xuICAgIHZhciBvcHRpb25zXG4gICAgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpXG5cbiAgICBpZiAob3B0aW9ucyAhPSBudWxsICYmIGtleSBpbiBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gICAgfVxuICB9XG5cbiAgZ2V0UGFyYW0gKG5hbWVzLCBkZWZWYWwgPSBudWxsKSB7XG4gICAgdmFyIGksIGxlbiwgbiwgcmVmXG5cbiAgICBpZiAoKHJlZiA9IHR5cGVvZiBuYW1lcykgPT09ICdzdHJpbmcnIHx8IHJlZiA9PT0gJ251bWJlcicpIHtcbiAgICAgIG5hbWVzID0gW25hbWVzXVxuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IG5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBuID0gbmFtZXNbaV1cblxuICAgICAgaWYgKHRoaXMubmFtZWRbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lZFtuXVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wYXJhbXNbbl0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXNbbl1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmVmFsXG4gIH1cblxuICBnZXRCb29sUGFyYW0gKG5hbWVzLCBkZWZWYWwgPSBudWxsKSB7XG4gICAgdmFyIGZhbHNlVmFscywgdmFsXG4gICAgZmFsc2VWYWxzID0gWycnLCAnMCcsICdmYWxzZScsICdubycsICdub25lJywgZmFsc2UsIG51bGwsIDBdXG4gICAgdmFsID0gdGhpcy5nZXRQYXJhbShuYW1lcywgZGVmVmFsKVxuICAgIHJldHVybiAhZmFsc2VWYWxzLmluY2x1ZGVzKHZhbClcbiAgfVxuXG4gIGFuY2VzdG9yQ21kcyAoKSB7XG4gICAgdmFyIHJlZlxuXG4gICAgaWYgKCgocmVmID0gdGhpcy5jb250ZXh0LmNvZGV3YXZlKSAhPSBudWxsID8gcmVmLmluSW5zdGFuY2UgOiBudWxsKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG4gIH1cblxuICBhbmNlc3RvckNtZHNBbmRTZWxmICgpIHtcbiAgICByZXR1cm4gdGhpcy5hbmNlc3RvckNtZHMoKS5jb25jYXQoW3RoaXMuY21kXSlcbiAgfVxuXG4gIHJ1bkV4ZWN1dGVGdW5jdCAoKSB7XG4gICAgdmFyIGNtZFxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmNtZE9iaiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZE9iai5leGVjdXRlKClcbiAgICAgIH1cblxuICAgICAgY21kID0gdGhpcy5nZXRBbGlhc2VkRmluYWwoKSB8fCB0aGlzLmNtZFxuICAgICAgY21kLmluaXQoKVxuXG4gICAgICBpZiAoY21kLmV4ZWN1dGVGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZUZ1bmN0KHRoaXMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmF3UmVzdWx0ICgpIHtcbiAgICB2YXIgY21kXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuY21kT2JqICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kT2JqLnJlc3VsdCgpXG4gICAgICB9XG5cbiAgICAgIGNtZCA9IHRoaXMuZ2V0QWxpYXNlZEZpbmFsKCkgfHwgdGhpcy5jbWRcbiAgICAgIGNtZC5pbml0KClcblxuICAgICAgaWYgKGNtZC5yZXN1bHRGdW5jdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0RnVuY3QodGhpcylcbiAgICAgIH1cblxuICAgICAgaWYgKGNtZC5yZXN1bHRTdHIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0clxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCAoKSB7XG4gICAgdGhpcy5pbml0KClcblxuICAgIGlmICh0aGlzLnJlc3VsdElzQXZhaWxhYmxlKCkpIHtcbiAgICAgIHJldHVybiAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkodGhpcy5yYXdSZXN1bHQoKSkudGhlbihyZXMgPT4ge1xuICAgICAgICB2YXIgcGFyc2VyXG5cbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgICAgcmVzID0gdGhpcy5mb3JtYXRJbmRlbnQocmVzKVxuXG4gICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwICYmIHRoaXMuZ2V0T3B0aW9uKCdwYXJzZScsIHRoaXMpKSB7XG4gICAgICAgICAgICBwYXJzZXIgPSB0aGlzLmdldFBhcnNlckZvclRleHQocmVzKVxuICAgICAgICAgICAgcmVzID0gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBhbHRlckZ1bmN0ID0gdGhpcy5nZXRPcHRpb24oJ2FsdGVyUmVzdWx0JywgdGhpcylcbiAgICAgICAgICBpZiAoYWx0ZXJGdW5jdCkge1xuICAgICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsIHRoaXMpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICB9XG4gICAgICB9KS5yZXN1bHQoKVxuICAgIH1cbiAgfVxuXG4gIGdldFBhcnNlckZvclRleHQgKHR4dCA9ICcnKSB7XG4gICAgdmFyIHBhcnNlclxuICAgIHBhcnNlciA9IHRoaXMuY29udGV4dC5jb2Rld2F2ZS5uZXdJbnN0YW5jZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7XG4gICAgICBpbkluc3RhbmNlOiB0aGlzXG4gICAgfSlcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuICAgIHJldHVybiBwYXJzZXJcbiAgfVxuXG4gIGdldEluZGVudCAoKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuXG4gIGZvcm1hdEluZGVudCAodGV4dCkge1xuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcdC9nLCAnICAnKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dFxuICAgIH1cbiAgfVxuXG4gIGFwcGx5SW5kZW50ICh0ZXh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5pbmRlbnROb3RGaXJzdCh0ZXh0LCB0aGlzLmdldEluZGVudCgpLCAnICcpXG4gIH1cbn1cbmV4cG9ydHMuQ21kSW5zdGFuY2UgPSBDbWRJbnN0YW5jZVxuIiwiXG5jb25zdCBQcm9jZXNzID0gcmVxdWlyZSgnLi9Qcm9jZXNzJykuUHJvY2Vzc1xuXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgPSByZXF1aXJlKCcuL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZScpLlBvc2l0aW9uZWRDbWRJbnN0YW5jZVxuXG5jb25zdCBUZXh0UGFyc2VyID0gcmVxdWlyZSgnLi9UZXh0UGFyc2VyJykuVGV4dFBhcnNlclxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBMb2dnZXIgPSByZXF1aXJlKCcuL0xvZ2dlcicpLkxvZ2dlclxuXG5jb25zdCBQb3NDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uJykuUG9zQ29sbGVjdGlvblxuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJykuU3RyaW5nSGVscGVyXG5cbmNvbnN0IENsb3NpbmdQcm9tcCA9IHJlcXVpcmUoJy4vQ2xvc2luZ1Byb21wJykuQ2xvc2luZ1Byb21wXG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBicmFrZXRzOiAnfn4nLFxuICBkZWNvOiAnficsXG4gIGNsb3NlQ2hhcjogJy8nLFxuICBub0V4ZWN1dGVDaGFyOiAnIScsXG4gIGNhcnJldENoYXI6ICd8JyxcbiAgY2hlY2tDYXJyZXQ6IHRydWUsXG4gIGluSW5zdGFuY2U6IG51bGxcbn1cblxudmFyIENvZGV3YXZlID0gY2xhc3MgQ29kZXdhdmUge1xuICBjb25zdHJ1Y3RvciAoZWRpdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgIENvZGV3YXZlLmluaXQoKVxuICAgIHRoaXMubWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSdcbiAgICB0aGlzLnZhcnMgPSB7fVxuICAgIGNvbnN0IGRlZmF1bHRzID0gQ29kZXdhdmUuZGVmYXVsdE9wdGlvbnNcbiAgICB0aGlzLnBhcmVudCA9IG9wdGlvbnMucGFyZW50XG4gICAgdGhpcy5uZXN0ZWQgPSB0aGlzLnBhcmVudCAhPSBudWxsID8gdGhpcy5wYXJlbnQubmVzdGVkICsgMSA6IDBcblxuICAgIE9iamVjdC5rZXlzKGRlZmF1bHRzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCAmJiBrZXkgIT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHRoaXMucGFyZW50W2tleV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRzW2tleV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHRoaXMuZWRpdG9yICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZWRpdG9yLmJpbmRlZFRvKHRoaXMpXG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0ID0gbmV3IENvbnRleHQodGhpcylcblxuICAgIGlmICh0aGlzLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250ZXh0LnBhcmVudCA9IHRoaXMuaW5JbnN0YW5jZS5jb250ZXh0XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKClcbiAgfVxuXG4gIG9uQWN0aXZhdGlvbktleSAoKSB7XG4gICAgdGhpcy5wcm9jZXNzID0gbmV3IFByb2Nlc3MoKVxuICAgIHRoaXMubG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKVxuICAgIHJldHVybiB0aGlzLnJ1bkF0Q3Vyc29yUG9zKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLnByb2Nlc3MgPSBudWxsXG4gICAgfSlcbiAgfVxuXG4gIHJ1bkF0Q3Vyc29yUG9zICgpIHtcbiAgICBpZiAodGhpcy5lZGl0b3IuYWxsb3dNdWx0aVNlbGVjdGlvbigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKHRoaXMuZWRpdG9yLmdldE11bHRpU2VsKCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bkF0UG9zKHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpKVxuICAgIH1cbiAgfVxuXG4gIHJ1bkF0UG9zIChwb3MpIHtcbiAgICBpZiAocG9zID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ3Vyc29yIFBvc2l0aW9uIGlzIGVtcHR5JylcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ydW5BdE11bHRpUG9zKFtwb3NdKVxuICB9XG5cbiAgcnVuQXRNdWx0aVBvcyAobXVsdGlQb3MpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICBpZiAobXVsdGlQb3MubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjbWQgPSB0aGlzLmNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpXG5cbiAgICAgICAgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgaWYgKG11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjbWQuaW5pdCgpXG4gICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGNtZClcbiAgICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChtdWx0aVBvc1swXS5zdGFydCA9PT0gbXVsdGlQb3NbMF0uZW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGRCcmFrZXRzKG11bHRpUG9zKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9tcHRDbG9zaW5nQ21kKG11bHRpUG9zKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjb21tYW5kT25Qb3MgKHBvcykge1xuICAgIGxldCBuZXh0LCBwcmV2XG5cbiAgICBpZiAodGhpcy5wcmVjZWRlZEJ5QnJha2V0cyhwb3MpICYmIHRoaXMuZm9sbG93ZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMSkge1xuICAgICAgcHJldiA9IHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGhcbiAgICAgIG5leHQgPSBwb3NcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMucHJlY2VkZWRCeUJyYWtldHMocG9zKSAmJiB0aGlzLmNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PT0gMCkge1xuICAgICAgICBwb3MgLT0gdGhpcy5icmFrZXRzLmxlbmd0aFxuICAgICAgfVxuXG4gICAgICBwcmV2ID0gdGhpcy5maW5kUHJldkJyYWtldChwb3MpXG5cbiAgICAgIGlmIChwcmV2ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cblxuICAgICAgbmV4dCA9IHRoaXMuZmluZE5leHRCcmFrZXQocG9zIC0gMSlcblxuICAgICAgaWYgKG5leHQgPT0gbnVsbCB8fCB0aGlzLmNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT09IDApIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBwcmV2LCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHByZXYsIG5leHQgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSlcbiAgfVxuXG4gIG5leHRDbWQgKHN0YXJ0ID0gMCkge1xuICAgIHZhciBiZWdpbm5pbmcsIGYsIHBvc1xuICAgIHBvcyA9IHN0YXJ0XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICB3aGlsZSAoZiA9IHRoaXMuZmluZEFueU5leHQocG9zLCBbdGhpcy5icmFrZXRzLCAnXFxuJ10pKSB7XG4gICAgICBwb3MgPSBmLnBvcyArIGYuc3RyLmxlbmd0aFxuXG4gICAgICBpZiAoZi5zdHIgPT09IHRoaXMuYnJha2V0cykge1xuICAgICAgICBpZiAodHlwZW9mIGJlZ2lubmluZyAhPT0gJ3VuZGVmaW5lZCcgJiYgYmVnaW5uaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgYmVnaW5uaW5nLCB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKGJlZ2lubmluZywgZi5wb3MgKyB0aGlzLmJyYWtldHMubGVuZ3RoKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvc1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiZWdpbm5pbmcgPSBudWxsXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGdldEVuY2xvc2luZ0NtZCAocG9zID0gMCkge1xuICAgIHZhciBjbG9zaW5nUHJlZml4LCBjcG9zLCBwXG4gICAgY3BvcyA9IHBvc1xuICAgIGNsb3NpbmdQcmVmaXggPSB0aGlzLmJyYWtldHMgKyB0aGlzLmNsb3NlQ2hhclxuXG4gICAgd2hpbGUgKChwID0gdGhpcy5maW5kTmV4dChjcG9zLCBjbG9zaW5nUHJlZml4KSkgIT0gbnVsbCkge1xuICAgICAgY29uc3QgY21kID0gdGhpcy5jb21tYW5kT25Qb3MocCArIGNsb3NpbmdQcmVmaXgubGVuZ3RoKVxuICAgICAgaWYgKGNtZCkge1xuICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpXG5cbiAgICAgICAgaWYgKGNtZC5wb3MgPCBwb3MpIHtcbiAgICAgICAgICByZXR1cm4gY21kXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNwb3MgPSBwICsgY2xvc2luZ1ByZWZpeC5sZW5ndGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcHJlY2VkZWRCeUJyYWtldHMgKHBvcykge1xuICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcyAtIHRoaXMuYnJha2V0cy5sZW5ndGgsIHBvcykgPT09IHRoaXMuYnJha2V0c1xuICB9XG5cbiAgZm9sbG93ZWRCeUJyYWtldHMgKHBvcykge1xuICAgIHJldHVybiB0aGlzLmVkaXRvci50ZXh0U3Vic3RyKHBvcywgcG9zICsgdGhpcy5icmFrZXRzLmxlbmd0aCkgPT09IHRoaXMuYnJha2V0c1xuICB9XG5cbiAgY291bnRQcmV2QnJha2V0IChzdGFydCkge1xuICAgIHZhciBpXG4gICAgaSA9IDBcblxuICAgIHdoaWxlICgoc3RhcnQgPSB0aGlzLmZpbmRQcmV2QnJha2V0KHN0YXJ0KSkgIT0gbnVsbCkge1xuICAgICAgaSsrXG4gICAgfVxuXG4gICAgcmV0dXJuIGlcbiAgfVxuXG4gIGlzRW5kTGluZSAocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLnRleHRTdWJzdHIocG9zLCBwb3MgKyAxKSA9PT0gJ1xcbicgfHwgcG9zICsgMSA+PSB0aGlzLmVkaXRvci50ZXh0TGVuKClcbiAgfVxuXG4gIGZpbmRQcmV2QnJha2V0IChzdGFydCkge1xuICAgIHJldHVybiB0aGlzLmZpbmROZXh0QnJha2V0KHN0YXJ0LCAtMSlcbiAgfVxuXG4gIGZpbmROZXh0QnJha2V0IChzdGFydCwgZGlyZWN0aW9uID0gMSkge1xuICAgIGNvbnN0IGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbdGhpcy5icmFrZXRzLCAnXFxuJ10sIGRpcmVjdGlvbilcblxuICAgIGlmIChmICYmIGYuc3RyID09PSB0aGlzLmJyYWtldHMpIHtcbiAgICAgIHJldHVybiBmLnBvc1xuICAgIH1cbiAgfVxuXG4gIGZpbmRQcmV2IChzdGFydCwgc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZE5leHQoc3RhcnQsIHN0cmluZywgLTEpXG4gIH1cblxuICBmaW5kTmV4dCAoc3RhcnQsIHN0cmluZywgZGlyZWN0aW9uID0gMSkge1xuICAgIGNvbnN0IGYgPSB0aGlzLmZpbmRBbnlOZXh0KHN0YXJ0LCBbc3RyaW5nXSwgZGlyZWN0aW9uKVxuXG4gICAgaWYgKGYpIHtcbiAgICAgIHJldHVybiBmLnBvc1xuICAgIH1cbiAgfVxuXG4gIGZpbmRBbnlOZXh0IChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvci5maW5kQW55TmV4dChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uKVxuICB9XG5cbiAgZmluZE1hdGNoaW5nUGFpciAoc3RhcnRQb3MsIG9wZW5pbmcsIGNsb3NpbmcsIGRpcmVjdGlvbiA9IDEpIHtcbiAgICB2YXIgZiwgbmVzdGVkLCBwb3NcbiAgICBwb3MgPSBzdGFydFBvc1xuICAgIG5lc3RlZCA9IDBcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25kLWFzc2lnblxuICAgIHdoaWxlIChmID0gdGhpcy5maW5kQW55TmV4dChwb3MsIFtjbG9zaW5nLCBvcGVuaW5nXSwgZGlyZWN0aW9uKSkge1xuICAgICAgcG9zID0gZi5wb3MgKyAoZGlyZWN0aW9uID4gMCA/IGYuc3RyLmxlbmd0aCA6IDApXG5cbiAgICAgIGlmIChmLnN0ciA9PT0gKGRpcmVjdGlvbiA+IDAgPyBjbG9zaW5nIDogb3BlbmluZykpIHtcbiAgICAgICAgaWYgKG5lc3RlZCA+IDApIHtcbiAgICAgICAgICBuZXN0ZWQtLVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5lc3RlZCsrXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGFkZEJyYWtldHMgKHBvcykge1xuICAgIHBvcyA9IG5ldyBQb3NDb2xsZWN0aW9uKHBvcylcbiAgICBjb25zdCByZXBsYWNlbWVudHMgPSBwb3Mud3JhcCh0aGlzLmJyYWtldHMsIHRoaXMuYnJha2V0cykubWFwKGZ1bmN0aW9uIChyKSB7XG4gICAgICByZXR1cm4gci5zZWxlY3RDb250ZW50KClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIH1cblxuICBwcm9tcHRDbG9zaW5nQ21kIChzZWxlY3Rpb25zKSB7XG4gICAgaWYgKHRoaXMuY2xvc2luZ1Byb21wICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY2xvc2luZ1Byb21wLnN0b3AoKVxuICAgIH1cblxuICAgIHRoaXMuY2xvc2luZ1Byb21wID0gQ2xvc2luZ1Byb21wLm5ld0Zvcih0aGlzLCBzZWxlY3Rpb25zKS5iZWdpbigpXG4gIH1cblxuICBuZXdJbnN0YW5jZSAoZWRpdG9yLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBDb2Rld2F2ZShlZGl0b3IsIG9wdGlvbnMpXG4gIH1cblxuICBwYXJzZUFsbCAocmVjdXJzaXZlID0gdHJ1ZSkge1xuICAgIHZhciBjbWQsIHBhcnNlciwgcG9zLCByZXNcblxuICAgIGlmICh0aGlzLm5lc3RlZCA+IDEwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSBwYXJzaW5nIFJlY3Vyc2lvbicpXG4gICAgfVxuXG4gICAgcG9zID0gMFxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbmQtYXNzaWduXG4gICAgd2hpbGUgKGNtZCA9IHRoaXMubmV4dENtZChwb3MpKSB7XG4gICAgICBwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgIHRoaXMuZWRpdG9yLnNldEN1cnNvclBvcyhwb3MpIC8vIGNvbnNvbGUubG9nKGNtZClcblxuICAgICAgY21kLmluaXQoKVxuXG4gICAgICBpZiAocmVjdXJzaXZlICYmIGNtZC5jb250ZW50ICE9IG51bGwgJiYgKGNtZC5nZXRDbWQoKSA9PSBudWxsIHx8ICFjbWQuZ2V0T3B0aW9uKCdwcmV2ZW50UGFyc2VBbGwnKSkpIHtcbiAgICAgICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKGNtZC5jb250ZW50KSwge1xuICAgICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgICB9KVxuICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICB9XG5cbiAgICAgIHJlcyA9IGNtZC5leGVjdXRlKClcblxuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIGlmIChyZXMudGhlbiAhPSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3luYyBuZXN0ZWQgY29tbWFuZHMgYXJlIG5vdCBzdXBwb3J0ZWQnKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNtZC5yZXBsYWNlRW5kICE9IG51bGwpIHtcbiAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBvcyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvclBvcygpLmVuZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0VGV4dCgpXG4gIH1cblxuICBnZXRUZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IudGV4dCgpXG4gIH1cblxuICBpc1Jvb3QgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA9PSBudWxsICYmICh0aGlzLmluSW5zdGFuY2UgPT0gbnVsbCB8fCB0aGlzLmluSW5zdGFuY2UuZmluZGVyID09IG51bGwpXG4gIH1cblxuICBnZXRSb290ICgpIHtcbiAgICBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRSb290KClcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICAgIH1cbiAgfVxuXG4gIGdldEZpbGVTeXN0ZW0gKCkge1xuICAgIGlmICh0aGlzLmVkaXRvci5maWxlU3lzdGVtKSB7XG4gICAgICByZXR1cm4gdGhpcy5lZGl0b3IuZmlsZVN5c3RlbVxuICAgIH0gZWxzZSBpZiAodGhpcy5pc1Jvb3QoKSkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRSb290KClcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5JbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUNhcnJldCAodHh0KSB7XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodHh0LCB0aGlzLmNhcnJldENoYXIpXG4gIH1cblxuICBnZXRDYXJyZXRQb3MgKHR4dCkge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuZ2V0Q2FycmV0UG9zKHR4dCwgdGhpcy5jYXJyZXRDaGFyKVxuICB9XG5cbiAgcmVnTWFya2VyIChmbGFncyA9ICdnJykge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5tYXJrZXIpLCBmbGFncylcbiAgfVxuXG4gIHJlbW92ZU1hcmtlcnMgKHRleHQpIHtcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHRoaXMucmVnTWFya2VyKCksICcnKVxuICB9XG5cbiAgc3RhdGljIGluaXQgKCkge1xuICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZVxuXG4gICAgICBDb21tYW5kLmluaXRDbWRzKClcblxuICAgICAgcmV0dXJuIENvbW1hbmQubG9hZENtZHMoKVxuICAgIH1cbiAgfVxufVxuXG5Db2Rld2F2ZS5pbml0ZWQgPSBmYWxzZVxuQ29kZXdhdmUuZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9uc1xuXG5leHBvcnRzLkNvZGV3YXZlID0gQ29kZXdhdmVcbiIsIlxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxuY29uc3QgU3RvcmFnZSA9IHJlcXVpcmUoJy4vU3RvcmFnZScpLlN0b3JhZ2VcblxuY29uc3QgTmFtZXNwYWNlSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcicpLk5hbWVzcGFjZUhlbHBlclxuXG52YXIgX29wdEtleVxuXG5fb3B0S2V5ID0gZnVuY3Rpb24gKGtleSwgZGljdCwgZGVmVmFsID0gbnVsbCkge1xuICAvLyBvcHRpb25hbCBEaWN0aW9uYXJ5IGtleVxuICBpZiAoa2V5IGluIGRpY3QpIHtcbiAgICByZXR1cm4gZGljdFtrZXldXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRlZlZhbFxuICB9XG59XG5cbnZhciBDb21tYW5kID0gY2xhc3MgQ29tbWFuZCB7XG4gIGNvbnN0cnVjdG9yIChuYW1lMSwgZGF0YTEgPSBudWxsLCBwYXJlbnQgPSBudWxsKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTFcbiAgICB0aGlzLmRhdGEgPSBkYXRhMVxuICAgIHRoaXMuY21kcyA9IFtdXG4gICAgdGhpcy5kZXRlY3RvcnMgPSBbXVxuICAgIHRoaXMuZXhlY3V0ZUZ1bmN0ID0gdGhpcy5yZXN1bHRGdW5jdCA9IHRoaXMucmVzdWx0U3RyID0gdGhpcy5hbGlhc09mID0gdGhpcy5jbHMgPSBudWxsXG4gICAgdGhpcy5hbGlhc2VkID0gbnVsbFxuICAgIHRoaXMuZnVsbE5hbWUgPSB0aGlzLm5hbWVcbiAgICB0aGlzLmRlcHRoID0gMDtcbiAgICBbdGhpcy5fcGFyZW50LCB0aGlzLl9pbml0ZWRdID0gW251bGwsIGZhbHNlXVxuICAgIHRoaXMuc2V0UGFyZW50KHBhcmVudClcbiAgICB0aGlzLmRlZmF1bHRzID0ge31cbiAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgIHBhcnNlOiBmYWxzZSxcbiAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICBhbHRlclJlc3VsdDogbnVsbCxcbiAgICAgIHByZXZlbnRQYXJzZUFsbDogZmFsc2UsXG4gICAgICByZXBsYWNlQm94OiBmYWxzZSxcbiAgICAgIGFsbG93ZWROYW1lZDogbnVsbFxuICAgIH1cbiAgICB0aGlzLm9wdGlvbnMgPSB7fVxuICAgIHRoaXMuZmluYWxPcHRpb25zID0gbnVsbFxuICB9XG5cbiAgcGFyZW50ICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50XG4gIH1cblxuICBzZXRQYXJlbnQgKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuX3BhcmVudCAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX3BhcmVudCA9IHZhbHVlXG4gICAgICB0aGlzLmZ1bGxOYW1lID0gdGhpcy5fcGFyZW50ICE9IG51bGwgJiYgdGhpcy5fcGFyZW50Lm5hbWUgIT0gbnVsbCA/IHRoaXMuX3BhcmVudC5mdWxsTmFtZSArICc6JyArIHRoaXMubmFtZSA6IHRoaXMubmFtZVxuICAgICAgdGhpcy5kZXB0aCA9IHRoaXMuX3BhcmVudCAhPSBudWxsICYmIHRoaXMuX3BhcmVudC5kZXB0aCAhPSBudWxsID8gdGhpcy5fcGFyZW50LmRlcHRoICsgMSA6IDBcbiAgICB9XG4gIH1cblxuICBpbml0ICgpIHtcbiAgICBpZiAoIXRoaXMuX2luaXRlZCkge1xuICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZVxuICAgICAgdGhpcy5wYXJzZURhdGEodGhpcy5kYXRhKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICB1bnJlZ2lzdGVyICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50LnJlbW92ZUNtZCh0aGlzKVxuICB9XG5cbiAgaXNFZGl0YWJsZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0U3RyICE9IG51bGwgfHwgdGhpcy5hbGlhc09mICE9IG51bGxcbiAgfVxuXG4gIGlzRXhlY3V0YWJsZSAoKSB7XG4gICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmXG4gICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpXG5cbiAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICB9XG5cbiAgICByZWYgPSBbJ3Jlc3VsdFN0cicsICdyZXN1bHRGdW5jdCcsICdjbHMnLCAnZXhlY3V0ZUZ1bmN0J11cblxuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgcCA9IHJlZltqXVxuXG4gICAgICBpZiAodGhpc1twXSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpc0V4ZWN1dGFibGVXaXRoTmFtZSAobmFtZSkge1xuICAgIHZhciBhbGlhc09mLCBhbGlhc2VkLCBjb250ZXh0XG5cbiAgICBpZiAodGhpcy5hbGlhc09mICE9IG51bGwpIHtcbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICBhbGlhc09mID0gdGhpcy5hbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsIG5hbWUpXG4gICAgICBhbGlhc2VkID0gdGhpcy5fYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpXG5cbiAgICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGFsaWFzZWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmlzRXhlY3V0YWJsZSgpXG4gIH1cblxuICByZXN1bHRJc0F2YWlsYWJsZSAoKSB7XG4gICAgdmFyIGFsaWFzZWQsIGosIGxlbiwgcCwgcmVmXG4gICAgYWxpYXNlZCA9IHRoaXMuZ2V0QWxpYXNlZCgpXG5cbiAgICBpZiAoYWxpYXNlZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgfVxuXG4gICAgcmVmID0gWydyZXN1bHRTdHInLCAncmVzdWx0RnVuY3QnXVxuXG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBwID0gcmVmW2pdXG5cbiAgICAgIGlmICh0aGlzW3BdICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGdldERlZmF1bHRzICgpIHtcbiAgICB2YXIgYWxpYXNlZCwgcmVzXG4gICAgcmVzID0ge31cbiAgICBhbGlhc2VkID0gdGhpcy5nZXRBbGlhc2VkKClcblxuICAgIGlmIChhbGlhc2VkICE9IG51bGwpIHtcbiAgICAgIHJlcyA9IE9iamVjdC5hc3NpZ24ocmVzLCBhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgfVxuXG4gICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsIHRoaXMuZGVmYXVsdHMpXG4gICAgcmV0dXJuIHJlc1xuICB9XG5cbiAgX2FsaWFzZWRGcm9tRmluZGVyIChmaW5kZXIpIHtcbiAgICBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2VcbiAgICBmaW5kZXIubXVzdEV4ZWN1dGUgPSBmYWxzZVxuICAgIGZpbmRlci51c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIH1cblxuICBnZXRBbGlhc2VkICgpIHtcbiAgICB2YXIgY29udGV4dFxuXG4gICAgaWYgKHRoaXMuYWxpYXNPZiAhPSBudWxsKSB7XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgcmV0dXJuIHRoaXMuX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKHRoaXMuYWxpYXNPZikpXG4gICAgfVxuICB9XG5cbiAgZ2V0QWxpYXNlZE9yVGhpcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxpYXNlZCgpIHx8IHRoaXNcbiAgfVxuXG4gIHNldE9wdGlvbnMgKGRhdGEpIHtcbiAgICB2YXIga2V5LCByZXN1bHRzLCB2YWxcbiAgICByZXN1bHRzID0gW11cblxuICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgIHZhbCA9IGRhdGFba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIHRoaXMuZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMub3B0aW9uc1trZXldID0gdmFsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKG51bGwpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuXG4gIF9vcHRpb25zRm9yQWxpYXNlZCAoYWxpYXNlZCkge1xuICAgIHZhciBvcHRcbiAgICBvcHQgPSB7fVxuICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LCB0aGlzLmRlZmF1bHRPcHRpb25zKVxuXG4gICAgaWYgKGFsaWFzZWQgIT0gbnVsbCkge1xuICAgICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsIGFsaWFzZWQuZ2V0T3B0aW9ucygpKVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdCwgdGhpcy5vcHRpb25zKVxuICB9XG5cbiAgZ2V0T3B0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNGb3JBbGlhc2VkKHRoaXMuZ2V0QWxpYXNlZCgpKVxuICB9XG5cbiAgZ2V0T3B0aW9uIChrZXkpIHtcbiAgICB2YXIgb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKVxuXG4gICAgaWYgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gICAgfVxuICB9XG5cbiAgaGVscCAoKSB7XG4gICAgdmFyIGNtZFxuICAgIGNtZCA9IHRoaXMuZ2V0Q21kKCdoZWxwJylcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNtZC5pbml0KCkucmVzdWx0U3RyXG4gICAgfVxuICB9XG5cbiAgcGFyc2VEYXRhIChkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YVxuXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5yZXN1bHRTdHIgPSBkYXRhXG4gICAgICB0aGlzLm9wdGlvbnMucGFyc2UgPSB0cnVlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSBpZiAoZGF0YSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZURpY3REYXRhKGRhdGEpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBwYXJzZURpY3REYXRhIChkYXRhKSB7XG4gICAgdmFyIGV4ZWN1dGUsIHJlc1xuICAgIHJlcyA9IF9vcHRLZXkoJ3Jlc3VsdCcsIGRhdGEpXG5cbiAgICBpZiAodHlwZW9mIHJlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5yZXN1bHRGdW5jdCA9IHJlc1xuICAgIH0gZWxzZSBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgIHRoaXMucmVzdWx0U3RyID0gcmVzXG4gICAgICB0aGlzLm9wdGlvbnMucGFyc2UgPSB0cnVlXG4gICAgfVxuXG4gICAgZXhlY3V0ZSA9IF9vcHRLZXkoJ2V4ZWN1dGUnLCBkYXRhKVxuXG4gICAgaWYgKHR5cGVvZiBleGVjdXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLmV4ZWN1dGVGdW5jdCA9IGV4ZWN1dGVcbiAgICB9XG5cbiAgICB0aGlzLmFsaWFzT2YgPSBfb3B0S2V5KCdhbGlhc09mJywgZGF0YSlcbiAgICB0aGlzLmNscyA9IF9vcHRLZXkoJ2NscycsIGRhdGEpXG4gICAgdGhpcy5kZWZhdWx0cyA9IF9vcHRLZXkoJ2RlZmF1bHRzJywgZGF0YSwgdGhpcy5kZWZhdWx0cylcbiAgICB0aGlzLnNldE9wdGlvbnMoZGF0YSlcblxuICAgIGlmICgnaGVscCcgaW4gZGF0YSkge1xuICAgICAgdGhpcy5hZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLCBkYXRhLmhlbHAsIHRoaXMpKVxuICAgIH1cblxuICAgIGlmICgnZmFsbGJhY2snIGluIGRhdGEpIHtcbiAgICAgIHRoaXMuYWRkQ21kKG5ldyBDb21tYW5kKCdmYWxsYmFjaycsIGRhdGEuZmFsbGJhY2ssIHRoaXMpKVxuICAgIH1cblxuICAgIGlmICgnY21kcycgaW4gZGF0YSkge1xuICAgICAgdGhpcy5hZGRDbWRzKGRhdGEuY21kcylcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgYWRkQ21kcyAoY21kcykge1xuICAgIHZhciBkYXRhLCBuYW1lLCByZXN1bHRzXG4gICAgcmVzdWx0cyA9IFtdXG5cbiAgICBmb3IgKG5hbWUgaW4gY21kcykge1xuICAgICAgZGF0YSA9IGNtZHNbbmFtZV1cbiAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZENtZChuZXcgQ29tbWFuZChuYW1lLCBkYXRhLCB0aGlzKSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuXG4gIGFkZENtZCAoY21kKSB7XG4gICAgdmFyIGV4aXN0c1xuICAgIGV4aXN0cyA9IHRoaXMuZ2V0Q21kKGNtZC5uYW1lKVxuXG4gICAgaWYgKGV4aXN0cyAhPSBudWxsKSB7XG4gICAgICB0aGlzLnJlbW92ZUNtZChleGlzdHMpXG4gICAgfVxuXG4gICAgY21kLnNldFBhcmVudCh0aGlzKVxuICAgIHRoaXMuY21kcy5wdXNoKGNtZClcbiAgICByZXR1cm4gY21kXG4gIH1cblxuICByZW1vdmVDbWQgKGNtZCkge1xuICAgIHZhciBpXG5cbiAgICBpZiAoKGkgPSB0aGlzLmNtZHMuaW5kZXhPZihjbWQpKSA+IC0xKSB7XG4gICAgICB0aGlzLmNtZHMuc3BsaWNlKGksIDEpXG4gICAgfVxuXG4gICAgcmV0dXJuIGNtZFxuICB9XG5cbiAgZ2V0Q21kIChmdWxsbmFtZSkge1xuICAgIHZhciBjbWQsIGosIGxlbiwgbmFtZSwgcmVmLCByZWYxLCBzcGFjZVxuICAgIHRoaXMuaW5pdCgpO1xuICAgIFtzcGFjZSwgbmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXRGaXJzdChmdWxsbmFtZSlcblxuICAgIGlmIChzcGFjZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gKHJlZiA9IHRoaXMuZ2V0Q21kKHNwYWNlKSkgIT0gbnVsbCA/IHJlZi5nZXRDbWQobmFtZSkgOiBudWxsXG4gICAgfVxuXG4gICAgcmVmMSA9IHRoaXMuY21kc1xuXG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmMS5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgY21kID0gcmVmMVtqXVxuXG4gICAgICBpZiAoY21kLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldENtZERhdGEgKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0Q21kKGZ1bGxuYW1lLCBuZXcgQ29tbWFuZChmdWxsbmFtZS5zcGxpdCgnOicpLnBvcCgpLCBkYXRhKSlcbiAgfVxuXG4gIHNldENtZCAoZnVsbG5hbWUsIGNtZCkge1xuICAgIHZhciBuYW1lLCBuZXh0LCBzcGFjZTtcbiAgICBbc3BhY2UsIG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpXG5cbiAgICBpZiAoc3BhY2UgIT0gbnVsbCkge1xuICAgICAgbmV4dCA9IHRoaXMuZ2V0Q21kKHNwYWNlKVxuXG4gICAgICBpZiAobmV4dCA9PSBudWxsKSB7XG4gICAgICAgIG5leHQgPSB0aGlzLmFkZENtZChuZXcgQ29tbWFuZChzcGFjZSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXh0LnNldENtZChuYW1lLCBjbWQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkQ21kKGNtZClcbiAgICAgIHJldHVybiBjbWRcbiAgICB9XG4gIH1cblxuICBhZGREZXRlY3RvciAoZGV0ZWN0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5kZXRlY3RvcnMucHVzaChkZXRlY3RvcilcbiAgfVxuXG4gIHN0YXRpYyBpbml0Q21kcyAoKSB7XG4gICAgdmFyIGosIGxlbiwgcHJvdmlkZXIsIHJlZiwgcmVzdWx0c1xuICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwsIHtcbiAgICAgIGNtZHM6IHtcbiAgICAgICAgaGVsbG86IHtcbiAgICAgICAgICBoZWxwOiAnXCJIZWxsbywgd29ybGQhXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cXG5tb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cXG52ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWEnLFxuICAgICAgICAgIHJlc3VsdDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIHJlZiA9IHRoaXMucHJvdmlkZXJzXG4gICAgcmVzdWx0cyA9IFtdXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHByb3ZpZGVyID0gcmVmW2pdXG4gICAgICByZXN1bHRzLnB1c2gocHJvdmlkZXIucmVnaXN0ZXIoQ29tbWFuZC5jbWRzKSlcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgc3RhdGljIHNhdmVDbWQgKGZ1bGxuYW1lLCBkYXRhKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIENvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLCBkYXRhKVxuICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zYXZlSW5QYXRoKCdjbWRzJywgZnVsbG5hbWUsIGRhdGEpXG4gICAgfSlcbiAgfVxuXG4gIHN0YXRpYyBsb2FkQ21kcyAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICB9KS50aGVuKHNhdmVkQ21kcyA9PiB7XG4gICAgICB2YXIgZGF0YSwgZnVsbG5hbWUsIHJlc3VsdHNcblxuICAgICAgaWYgKHNhdmVkQ21kcyAhPSBudWxsKSB7XG4gICAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICAgIGZvciAoZnVsbG5hbWUgaW4gc2F2ZWRDbWRzKSB7XG4gICAgICAgICAgZGF0YSA9IHNhdmVkQ21kc1tmdWxsbmFtZV1cbiAgICAgICAgICByZXN1bHRzLnB1c2goQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgc3RhdGljIHJlc2V0U2F2ZWQgKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JhZ2Uuc2F2ZSgnY21kcycsIHt9KVxuICB9XG5cbiAgc3RhdGljIG1ha2VWYXJDbWQgKG5hbWUsIGJhc2UgPSB7fSkge1xuICAgIGJhc2UuZXhlY3V0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgdmFyIHAsIHZhbFxuICAgICAgdmFsID0gKHAgPSBpbnN0YW5jZS5nZXRQYXJhbSgwKSkgIT0gbnVsbCA/IHAgOiBpbnN0YW5jZS5jb250ZW50ID8gaW5zdGFuY2UuY29udGVudCA6IG51bGxcblxuICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgIGluc3RhbmNlLmNvZGV3YXZlLnZhcnNbbmFtZV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmFzZVxuICB9XG5cbiAgc3RhdGljIG1ha2VCb29sVmFyQ21kIChuYW1lLCBiYXNlID0ge30pIHtcbiAgICBiYXNlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgIHZhciBwLCB2YWxcbiAgICAgIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oMCkpICE9IG51bGwgPyBwIDogaW5zdGFuY2UuY29udGVudCA/IGluc3RhbmNlLmNvbnRlbnQgOiBudWxsXG5cbiAgICAgIGlmICghKHZhbCAhPSBudWxsICYmICh2YWwgPT09ICcwJyB8fCB2YWwgPT09ICdmYWxzZScgfHwgdmFsID09PSAnbm8nKSkpIHtcbiAgICAgICAgaW5zdGFuY2UuY29kZXdhdmUudmFyc1tuYW1lXSA9IHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmFzZVxuICB9XG59XG5cbkNvbW1hbmQucHJvdmlkZXJzID0gW11cbkNvbW1hbmQuc3RvcmFnZSA9IG5ldyBTdG9yYWdlKClcblxuZXhwb3J0cy5Db21tYW5kID0gQ29tbWFuZFxudmFyIEJhc2VDb21tYW5kID0gY2xhc3MgQmFzZUNvbW1hbmQge1xuICBjb25zdHJ1Y3RvciAoaW5zdGFuY2UxKSB7XG4gICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlMVxuICB9XG5cbiAgaW5pdCAoKSB7fVxuXG4gIHJlc3VsdElzQXZhaWxhYmxlICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXN1bHQgIT0gbnVsbFxuICB9XG5cbiAgZ2V0RGVmYXVsdHMgKCkge1xuICAgIHJldHVybiB7fVxuICB9XG5cbiAgZ2V0T3B0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cbn1cbmV4cG9ydHMuQmFzZUNvbW1hbmQgPSBCYXNlQ29tbWFuZFxuIiwiY29uc3QgQXJyYXlIZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlcnMvQXJyYXlIZWxwZXInKS5BcnJheUhlbHBlclxuXG52YXIgaW5kZXhPZiA9IFtdLmluZGV4T2ZcbnZhciBDb250ZXh0ID0gY2xhc3MgQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yIChjb2Rld2F2ZSkge1xuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZVxuICAgIHRoaXMubmFtZVNwYWNlcyA9IFtdXG4gIH1cblxuICBhZGROYW1lU3BhY2UgKG5hbWUpIHtcbiAgICBpZiAoaW5kZXhPZi5jYWxsKHRoaXMubmFtZVNwYWNlcywgbmFtZSkgPCAwKSB7XG4gICAgICB0aGlzLm5hbWVTcGFjZXMucHVzaChuYW1lKVxuICAgICAgdGhpcy5fbmFtZXNwYWNlcyA9IG51bGxcbiAgICB9XG4gIH1cblxuICBhZGROYW1lc3BhY2VzIChzcGFjZXMpIHtcbiAgICB2YXIgaiwgbGVuLCByZXN1bHRzLCBzcGFjZVxuXG4gICAgaWYgKHNwYWNlcykge1xuICAgICAgaWYgKHR5cGVvZiBzcGFjZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNwYWNlcyA9IFtzcGFjZXNdXG4gICAgICB9XG5cbiAgICAgIHJlc3VsdHMgPSBbXVxuXG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBzcGFjZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgc3BhY2UgPSBzcGFjZXNbal1cbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuYWRkTmFtZVNwYWNlKHNwYWNlKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG4gIH1cblxuICByZW1vdmVOYW1lU3BhY2UgKG5hbWUpIHtcbiAgICB0aGlzLm5hbWVTcGFjZXMgPSB0aGlzLm5hbWVTcGFjZXMuZmlsdGVyKGZ1bmN0aW9uIChuKSB7XG4gICAgICByZXR1cm4gbiAhPT0gbmFtZVxuICAgIH0pXG4gIH1cblxuICBnZXROYW1lU3BhY2VzICgpIHtcbiAgICB2YXIgbnBjc1xuXG4gICAgaWYgKHRoaXMuX25hbWVzcGFjZXMgPT0gbnVsbCkge1xuICAgICAgbnBjcyA9IHRoaXMubmFtZVNwYWNlc1xuXG4gICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgICBucGNzID0gbnBjcy5jb25jYXQodGhpcy5wYXJlbnQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9uYW1lc3BhY2VzID0gQXJyYXlIZWxwZXIudW5pcXVlKG5wY3MpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZXNcbiAgfVxuXG4gIGdldENtZCAoY21kTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGZpbmRlclxuICAgIGZpbmRlciA9IHRoaXMuZ2V0RmluZGVyKGNtZE5hbWUsIG9wdGlvbnMpXG4gICAgcmV0dXJuIGZpbmRlci5maW5kKClcbiAgfVxuXG4gIGdldEZpbmRlciAoY21kTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgQ21kRmluZGVyID0gQ29udGV4dC5jbWRGaW5kZXJDbGFzc1xuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgbmFtZXNwYWNlczogW10sXG4gICAgICB1c2VEZXRlY3RvcnM6IHRoaXMuaXNSb290KCksXG4gICAgICBjb2Rld2F2ZTogdGhpcy5jb2Rld2F2ZSxcbiAgICAgIHBhcmVudENvbnRleHQ6IHRoaXNcbiAgICB9LCBvcHRpb25zKSlcbiAgfVxuXG4gIGlzUm9vdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09IG51bGxcbiAgfVxuXG4gIGdldFBhcmVudE9yUm9vdCAoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50IChzdHIpIHtcbiAgICB2YXIgY2NcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKVxuXG4gICAgaWYgKGNjLmluZGV4T2YoJyVzJykgPiAtMSkge1xuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJywgc3RyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHIgKyAnICcgKyBjY1xuICAgIH1cbiAgfVxuXG4gIHdyYXBDb21tZW50TGVmdCAoc3RyID0gJycpIHtcbiAgICB2YXIgY2MsIGlcbiAgICBjYyA9IHRoaXMuZ2V0Q29tbWVudENoYXIoKVxuXG4gICAgaWYgKChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMSkge1xuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLCBpKSArIHN0clxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2MgKyAnICcgKyBzdHJcbiAgICB9XG4gIH1cblxuICB3cmFwQ29tbWVudFJpZ2h0IChzdHIgPSAnJykge1xuICAgIHZhciBjYywgaVxuICAgIGNjID0gdGhpcy5nZXRDb21tZW50Q2hhcigpXG5cbiAgICBpZiAoKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xKSB7XG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkgKyAyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2NcbiAgICB9XG4gIH1cblxuICBjbWRJbnN0YW5jZUZvciAoY21kKSB7XG4gICAgY29uc3QgQ21kSW5zdGFuY2UgPSBDb250ZXh0LmNtZEluc3RhbmNlQ2xhc3NcbiAgICByZXR1cm4gbmV3IENtZEluc3RhbmNlKGNtZCwgdGhpcylcbiAgfVxuXG4gIGdldENvbW1lbnRDaGFyICgpIHtcbiAgICB2YXIgY2hhciwgY21kLCBpbnN0LCByZXNcblxuICAgIGlmICh0aGlzLmNvbW1lbnRDaGFyICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbW1lbnRDaGFyXG4gICAgfVxuXG4gICAgY21kID0gdGhpcy5nZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGluc3QgPSB0aGlzLmNtZEluc3RhbmNlRm9yKGNtZClcbiAgICAgIGluc3QuY29udGVudCA9ICclcydcbiAgICAgIHJlcyA9IGluc3QucmVzdWx0KClcblxuICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbW1lbnRDaGFyID0gY2hhclxuICAgIHJldHVybiB0aGlzLmNvbW1lbnRDaGFyXG4gIH1cbn1cbmV4cG9ydHMuQ29udGV4dCA9IENvbnRleHRcbiIsIlxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vQ29tbWFuZCcpLkNvbW1hbmRcblxudmFyIEVkaXRDbWRQcm9wID0gY2xhc3MgRWRpdENtZFByb3Age1xuICBjb25zdHJ1Y3RvciAobmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cywgaSwga2V5LCBsZW4sIHJlZiwgdmFsXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgdmFyOiBudWxsLFxuICAgICAgb3B0OiBudWxsLFxuICAgICAgZnVuY3Q6IG51bGwsXG4gICAgICBkYXRhTmFtZTogbnVsbCxcbiAgICAgIHNob3dFbXB0eTogZmFsc2UsXG4gICAgICBjYXJyZXQ6IGZhbHNlXG4gICAgfVxuICAgIHJlZiA9IFsndmFyJywgJ29wdCcsICdmdW5jdCddXG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGtleSA9IHJlZltpXVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgZGVmYXVsdHMuZGF0YU5hbWUgPSBvcHRpb25zW2tleV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgdmFsID0gZGVmYXVsdHNba2V5XVxuXG4gICAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRDbWQgKGNtZHMpIHtcbiAgICBjbWRzW3RoaXMubmFtZV0gPSBDb21tYW5kLm1ha2VWYXJDbWQodGhpcy5uYW1lKVxuICB9XG5cbiAgd3JpdGVGb3IgKHBhcnNlciwgb2JqKSB7XG4gICAgaWYgKHBhcnNlci52YXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgb2JqW3RoaXMuZGF0YU5hbWVdID0gcGFyc2VyLnZhcnNbdGhpcy5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIHZhbEZyb21DbWQgKGNtZCkge1xuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMub3B0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZC5nZXRPcHRpb24odGhpcy5vcHQpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmZ1bmN0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNtZFt0aGlzLmZ1bmN0XSgpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnZhciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbWRbdGhpcy52YXJdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2hvd0ZvckNtZCAoY21kKSB7XG4gICAgdmFyIHZhbFxuICAgIHZhbCA9IHRoaXMudmFsRnJvbUNtZChjbWQpXG4gICAgcmV0dXJuIHRoaXMuc2hvd0VtcHR5IHx8IHZhbCAhPSBudWxsXG4gIH1cblxuICBkaXNwbGF5IChjbWQpIHtcbiAgICBpZiAodGhpcy5zaG93Rm9yQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4ke3RoaXMubmFtZX1+flxcbiR7dGhpcy52YWxGcm9tQ21kKGNtZCkgfHwgJyd9JHt0aGlzLmNhcnJldCA/ICd8JyA6ICcnfVxcbn5+LyR7dGhpcy5uYW1lfX5+YFxuICAgIH1cbiAgfVxufVxuZXhwb3J0cy5FZGl0Q21kUHJvcCA9IEVkaXRDbWRQcm9wXG5FZGl0Q21kUHJvcC5Tb3VyY2UgPSBjbGFzcyBzb3VyY2UgZXh0ZW5kcyBFZGl0Q21kUHJvcCB7XG4gIHZhbEZyb21DbWQgKGNtZCkge1xuICAgIHZhciByZXNcbiAgICByZXMgPSBzdXBlci52YWxGcm9tQ21kKGNtZClcblxuICAgIGlmIChyZXMgIT0gbnVsbCkge1xuICAgICAgcmVzID0gcmVzLnJlcGxhY2UoL1xcfC9nLCAnfHwnKVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIHNldENtZCAoY21kcykge1xuICAgIGNtZHNbdGhpcy5uYW1lXSA9IENvbW1hbmQubWFrZVZhckNtZCh0aGlzLm5hbWUsIHtcbiAgICAgIHByZXZlbnRQYXJzZUFsbDogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBzaG93Rm9yQ21kIChjbWQpIHtcbiAgICB2YXIgdmFsXG4gICAgdmFsID0gdGhpcy52YWxGcm9tQ21kKGNtZClcbiAgICByZXR1cm4gdGhpcy5zaG93RW1wdHkgJiYgKGNtZCA9PSBudWxsIHx8IGNtZC5hbGlhc09mID09IG51bGwgfHwgdmFsICE9IG51bGwpXG4gIH1cbn1cbkVkaXRDbWRQcm9wLlN0cmluZyA9IGNsYXNzIHN0cmluZyBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgZGlzcGxheSAoY21kKSB7XG4gICAgaWYgKHRoaXMudmFsRnJvbUNtZChjbWQpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9ICcke3RoaXMudmFsRnJvbUNtZChjbWQpfSR7dGhpcy5jYXJyZXQgPyAnfCcgOiAnJ30nfn5gXG4gICAgfVxuICB9XG59XG5FZGl0Q21kUHJvcC5SZXZCb29sID0gY2xhc3MgcmV2Qm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kIChjbWRzKSB7XG4gICAgY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpXG4gIH1cblxuICB3cml0ZUZvciAocGFyc2VyLCBvYmopIHtcbiAgICBpZiAocGFyc2VyLnZhcnNbdGhpcy5uYW1lXSAhPSBudWxsKSB7XG4gICAgICBvYmpbdGhpcy5kYXRhTmFtZV0gPSAhcGFyc2VyLnZhcnNbdGhpcy5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXkgKGNtZCkge1xuICAgIHZhciB2YWxcbiAgICB2YWwgPSB0aGlzLnZhbEZyb21DbWQoY21kKVxuXG4gICAgaWYgKHZhbCAhPSBudWxsICYmICF2YWwpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gXG4gICAgfVxuICB9XG59XG5FZGl0Q21kUHJvcC5Cb29sID0gY2xhc3MgYm9vbCBleHRlbmRzIEVkaXRDbWRQcm9wIHtcbiAgc2V0Q21kIChjbWRzKSB7XG4gICAgY21kc1t0aGlzLm5hbWVdID0gQ29tbWFuZC5tYWtlQm9vbFZhckNtZCh0aGlzLm5hbWUpXG4gIH1cblxuICBkaXNwbGF5IChjbWQpIHtcbiAgICBpZiAodGhpcy52YWxGcm9tQ21kKGNtZCkpIHtcbiAgICAgIHJldHVybiBgfn4hJHt0aGlzLm5hbWV9fn5gXG4gICAgfVxuICB9XG59XG4iLCJcbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUG9zJykuUG9zXG5cbmNvbnN0IFN0clBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvU3RyUG9zJykuU3RyUG9zXG5cbmNvbnN0IE9wdGlvbmFsUHJvbWlzZSA9IHJlcXVpcmUoJy4vaGVscGVycy9PcHRpb25hbFByb21pc2UnKVxuXG52YXIgRWRpdG9yID0gY2xhc3MgRWRpdG9yIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMubmFtZXNwYWNlID0gbnVsbFxuICAgIHRoaXMuX2xhbmcgPSBudWxsXG4gIH1cblxuICBiaW5kZWRUbyAoY29kZXdhdmUpIHt9XG5cbiAgdGV4dCAodmFsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgdGV4dENoYXJBdCAocG9zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgdGV4dExlbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgdGV4dFN1YnN0ciAoc3RhcnQsIGVuZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIGluc2VydFRleHRBdCAodGV4dCwgcG9zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgc3BsaWNlVGV4dCAoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIGdldEN1cnNvclBvcyAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKVxuICB9XG5cbiAgc2V0Q3Vyc29yUG9zIChzdGFydCwgZW5kID0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIGJlZ2luVW5kb0FjdGlvbiAoKSB7fVxuXG4gIGVuZFVuZG9BY3Rpb24gKCkge31cblxuICBnZXRMYW5nICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFuZ1xuICB9XG5cbiAgc2V0TGFuZyAodmFsKSB7XG4gICAgdGhpcy5fbGFuZyA9IHZhbFxuICB9XG5cbiAgZ2V0RW1tZXRDb250ZXh0T2JqZWN0ICgpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgYWxsb3dNdWx0aVNlbGVjdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBzZXRNdWx0aVNlbCAoc2VsZWN0aW9ucykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJylcbiAgfVxuXG4gIGdldE11bHRpU2VsICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBjYW5MaXN0ZW5Ub0NoYW5nZSAoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBhZGRDaGFuZ2VMaXN0ZW5lciAoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lciAoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpXG4gIH1cblxuICBnZXRMaW5lQXQgKHBvcykge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMuZmluZExpbmVTdGFydChwb3MpLCB0aGlzLmZpbmRMaW5lRW5kKHBvcykpXG4gIH1cblxuICBmaW5kTGluZVN0YXJ0IChwb3MpIHtcbiAgICB2YXIgcFxuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgWydcXG4nXSwgLTEpXG5cbiAgICBpZiAocCkge1xuICAgICAgcmV0dXJuIHAucG9zICsgMVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMFxuICAgIH1cbiAgfVxuXG4gIGZpbmRMaW5lRW5kIChwb3MpIHtcbiAgICB2YXIgcFxuICAgIHAgPSB0aGlzLmZpbmRBbnlOZXh0KHBvcywgWydcXG4nLCAnXFxyJ10pXG5cbiAgICBpZiAocCkge1xuICAgICAgcmV0dXJuIHAucG9zXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRMZW4oKVxuICAgIH1cbiAgfVxuXG4gIGZpbmRBbnlOZXh0IChzdGFydCwgc3RyaW5ncywgZGlyZWN0aW9uID0gMSkge1xuICAgIHZhciBiZXN0UG9zLCBiZXN0U3RyLCBpLCBsZW4sIHBvcywgc3RyaSwgdGV4dFxuXG4gICAgaWYgKGRpcmVjdGlvbiA+IDApIHtcbiAgICAgIHRleHQgPSB0aGlzLnRleHRTdWJzdHIoc3RhcnQsIHRoaXMudGV4dExlbigpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKDAsIHN0YXJ0KVxuICAgIH1cblxuICAgIGJlc3RQb3MgPSBudWxsXG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzdHJpbmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzdHJpID0gc3RyaW5nc1tpXVxuICAgICAgcG9zID0gZGlyZWN0aW9uID4gMCA/IHRleHQuaW5kZXhPZihzdHJpKSA6IHRleHQubGFzdEluZGV4T2Yoc3RyaSlcblxuICAgICAgaWYgKHBvcyAhPT0gLTEpIHtcbiAgICAgICAgaWYgKGJlc3RQb3MgPT0gbnVsbCB8fCBiZXN0UG9zICogZGlyZWN0aW9uID4gcG9zICogZGlyZWN0aW9uKSB7XG4gICAgICAgICAgYmVzdFBvcyA9IHBvc1xuICAgICAgICAgIGJlc3RTdHIgPSBzdHJpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYmVzdFN0ciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFN0clBvcyhkaXJlY3Rpb24gPiAwID8gYmVzdFBvcyArIHN0YXJ0IDogYmVzdFBvcywgYmVzdFN0cilcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgYXBwbHlSZXBsYWNlbWVudHMgKHJlcGxhY2VtZW50cykge1xuICAgIHJldHVybiByZXBsYWNlbWVudHMucmVkdWNlKChwcm9taXNlLCByZXBsKSA9PiB7XG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKG9wdCA9PiB7XG4gICAgICAgIHJlcGwud2l0aEVkaXRvcih0aGlzKVxuICAgICAgICByZXBsLmFwcGx5T2Zmc2V0KG9wdC5vZmZzZXQpXG4gICAgICAgIHJldHVybiAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkocmVwbC5hcHBseSgpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0aW9uczogb3B0LnNlbGVjdGlvbnMuY29uY2F0KHJlcGwuc2VsZWN0aW9ucyksXG4gICAgICAgICAgICBvZmZzZXQ6IG9wdC5vZmZzZXQgKyByZXBsLm9mZnNldEFmdGVyKHRoaXMpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LCAoMCwgT3B0aW9uYWxQcm9taXNlLm9wdGlvbmFsUHJvbWlzZSkoe1xuICAgICAgc2VsZWN0aW9uczogW10sXG4gICAgICBvZmZzZXQ6IDBcbiAgICB9KSkudGhlbihvcHQgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKG9wdC5zZWxlY3Rpb25zKVxuICAgIH0pLnJlc3VsdCgpXG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50c1NlbGVjdGlvbnMgKHNlbGVjdGlvbnMpIHtcbiAgICBpZiAoc2VsZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy5hbGxvd011bHRpU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TXVsdGlTZWwoc2VsZWN0aW9ucylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldEN1cnNvclBvcyhzZWxlY3Rpb25zWzBdLnN0YXJ0LCBzZWxlY3Rpb25zWzBdLmVuZClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmV4cG9ydHMuRWRpdG9yID0gRWRpdG9yXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuXG5jb25zdCBMb2dnZXIgPSBjbGFzcyBMb2dnZXIge1xuICBsb2cgKC4uLmFyZ3MpIHtcbiAgICB2YXIgaSwgbGVuLCBtc2csIHJlc3VsdHNcblxuICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICByZXN1bHRzID0gW11cblxuICAgICAgZm9yIChpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBtc2cgPSBhcmdzW2ldXG4gICAgICAgIHJlc3VsdHMucHVzaChjb25zb2xlLmxvZyhtc2cpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cbiAgfVxuXG4gIGlzRW5hYmxlZCAoKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZSAhPT0gbnVsbCA/IGNvbnNvbGUubG9nIDogbnVsbCkgIT0gbnVsbCAmJiB0aGlzLmVuYWJsZWQgJiYgTG9nZ2VyLmVuYWJsZWRcbiAgfVxuXG4gIHJ1bnRpbWUgKGZ1bmN0LCBuYW1lID0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciByZXMsIHQwLCB0MVxuICAgIHQwID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZXMgPSBmdW5jdCgpXG4gICAgdDEgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIGNvbnNvbGUubG9nKGAke25hbWV9IHRvb2sgJHt0MSAtIHQwfSBtaWxsaXNlY29uZHMuYClcbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICB0b01vbml0b3IgKG9iaiwgbmFtZSwgcHJlZml4ID0gJycpIHtcbiAgICB2YXIgZnVuY3RcbiAgICBmdW5jdCA9IG9ialtuYW1lXVxuICAgIG9ialtuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzXG4gICAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgICByZXR1cm4gdGhpcy5tb25pdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0LmFwcGx5KG9iaiwgYXJncylcbiAgICAgIH0sIHByZWZpeCArIG5hbWUpXG4gICAgfVxuICB9XG5cbiAgbW9uaXRvciAoZnVuY3QsIG5hbWUpIHtcbiAgICB2YXIgcmVzLCB0MCwgdDFcbiAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgcmVzID0gZnVuY3QoKVxuICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KClcblxuICAgIGlmICh0aGlzLm1vbml0b3JEYXRhW25hbWVdICE9IG51bGwpIHtcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrK1xuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCArPSB0MSAtIHQwXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0gPSB7XG4gICAgICAgIGNvdW50OiAxLFxuICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIHJlc3VtZSAoKSB7XG4gICAgcmV0dXJuIGNvbnNvbGUubG9nKHRoaXMubW9uaXRvckRhdGEpXG4gIH1cbn1cblxuTG9nZ2VyLmVuYWJsZWQgPSB0cnVlXG5Mb2dnZXIucHJvdG90eXBlLmVuYWJsZWQgPSB0cnVlXG5Mb2dnZXIucHJvdG90eXBlLm1vbml0b3JEYXRhID0ge31cblxuZXhwb3J0cy5Mb2dnZXIgPSBMb2dnZXJcbiIsIlxudmFyIE9wdGlvbk9iamVjdCA9IGNsYXNzIE9wdGlvbk9iamVjdCB7XG4gIHNldE9wdHMgKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gICAgdmFyIGtleSwgcmVmLCByZXN1bHRzLCB2YWxcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICByZWYgPSB0aGlzLmRlZmF1bHRzXG4gICAgcmVzdWx0cyA9IFtdXG5cbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbCA9IHJlZltrZXldXG5cbiAgICAgIGlmIChrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRPcHQoa2V5LCBvcHRpb25zW2tleV0pKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc2V0T3B0KGtleSwgdmFsKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgc2V0T3B0IChrZXksIHZhbCkge1xuICAgIHZhciByZWZcblxuICAgIGlmICgoKHJlZiA9IHRoaXNba2V5XSkgIT0gbnVsbCA/IHJlZi5jYWxsIDogbnVsbCkgIT0gbnVsbCkge1xuICAgICAgdGhpc1trZXldKHZhbClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0IChrZXkpIHtcbiAgICB2YXIgcmVmXG5cbiAgICBpZiAoKChyZWYgPSB0aGlzW2tleV0pICE9IG51bGwgPyByZWYuY2FsbCA6IG51bGwpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzW2tleV0oKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldXG4gICAgfVxuICB9XG5cbiAgZ2V0T3B0cyAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuZGVmYXVsdHMpLnJlZHVjZSgob3B0cywga2V5KSA9PiB7XG4gICAgICBvcHRzW2tleV0gPSB0aGlzLmdldE9wdChrZXkpXG4gICAgICByZXR1cm4gb3B0c1xuICAgIH0sIHt9KVxuICB9XG59XG5leHBvcnRzLk9wdGlvbk9iamVjdCA9IE9wdGlvbk9iamVjdFxuIiwiXG5jb25zdCBDbWRJbnN0YW5jZSA9IHJlcXVpcmUoJy4vQ21kSW5zdGFuY2UnKS5DbWRJbnN0YW5jZVxuXG5jb25zdCBCb3hIZWxwZXIgPSByZXF1aXJlKCcuL0JveEhlbHBlcicpLkJveEhlbHBlclxuXG5jb25zdCBQYXJhbVBhcnNlciA9IHJlcXVpcmUoJy4vc3RyaW5nUGFyc2Vycy9QYXJhbVBhcnNlcicpLlBhcmFtUGFyc2VyXG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUG9zJykuUG9zXG5cbmNvbnN0IFN0clBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvU3RyUG9zJykuU3RyUG9zXG5cbmNvbnN0IFJlcGxhY2VtZW50ID0gcmVxdWlyZSgnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCcpLlJlcGxhY2VtZW50XG5cbmNvbnN0IFN0cmluZ0hlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVycy9TdHJpbmdIZWxwZXInKS5TdHJpbmdIZWxwZXJcblxuY29uc3QgTmFtZXNwYWNlSGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXJzL05hbWVzcGFjZUhlbHBlcicpLk5hbWVzcGFjZUhlbHBlclxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi9Db21tYW5kJykuQ29tbWFuZFxuXG5jb25zdCBPcHRpb25hbFByb21pc2UgPSByZXF1aXJlKCcuL2hlbHBlcnMvT3B0aW9uYWxQcm9taXNlJylcblxudmFyIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSA9IGNsYXNzIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSBleHRlbmRzIENtZEluc3RhbmNlIHtcbiAgY29uc3RydWN0b3IgKGNvZGV3YXZlLCBwb3MxLCBzdHIxKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuY29kZXdhdmUgPSBjb2Rld2F2ZVxuICAgIHRoaXMucG9zID0gcG9zMVxuICAgIHRoaXMuc3RyID0gc3RyMVxuXG4gICAgaWYgKCF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgdGhpcy5fY2hlY2tDbG9zZXIoKVxuXG4gICAgICB0aGlzLm9wZW5pbmcgPSB0aGlzLnN0clxuICAgICAgdGhpcy5ub0JyYWNrZXQgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKVxuXG4gICAgICB0aGlzLl9zcGxpdENvbXBvbmVudHMoKVxuXG4gICAgICB0aGlzLl9maW5kQ2xvc2luZygpXG5cbiAgICAgIHRoaXMuX2NoZWNrRWxvbmdhdGVkKClcbiAgICB9XG4gIH1cblxuICBfY2hlY2tDbG9zZXIgKCkge1xuICAgIHZhciBmLCBub0JyYWNrZXRcbiAgICBub0JyYWNrZXQgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKVxuXG4gICAgaWYgKG5vQnJhY2tldC5zdWJzdHJpbmcoMCwgdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PT0gdGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIgJiYgKGYgPSB0aGlzLl9maW5kT3BlbmluZ1BvcygpKSkge1xuICAgICAgdGhpcy5jbG9zaW5nUG9zID0gbmV3IFN0clBvcyh0aGlzLnBvcywgdGhpcy5zdHIpXG4gICAgICB0aGlzLnBvcyA9IGYucG9zXG4gICAgICB0aGlzLnN0ciA9IGYuc3RyXG4gICAgfVxuICB9XG5cbiAgX2ZpbmRPcGVuaW5nUG9zICgpIHtcbiAgICB2YXIgY2xvc2luZywgY21kTmFtZSwgb3BlbmluZ1xuICAgIGNtZE5hbWUgPSB0aGlzLl9yZW1vdmVCcmFja2V0KHRoaXMuc3RyKS5zdWJzdHJpbmcodGhpcy5jb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKVxuICAgIG9wZW5pbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyBjbWROYW1lXG4gICAgY2xvc2luZyA9IHRoaXMuc3RyXG5cbiAgICBjb25zdCBmID0gdGhpcy5jb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKHRoaXMucG9zLCBvcGVuaW5nLCBjbG9zaW5nLCAtMSlcbiAgICBpZiAoZikge1xuICAgICAgZi5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLCB0aGlzLmNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGYucG9zICsgZi5zdHIubGVuZ3RoKSArIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gICAgICByZXR1cm4gZlxuICAgIH1cbiAgfVxuXG4gIF9zcGxpdENvbXBvbmVudHMgKCkge1xuICAgIHZhciBwYXJ0c1xuICAgIHBhcnRzID0gdGhpcy5ub0JyYWNrZXQuc3BsaXQoJyAnKVxuICAgIHRoaXMuY21kTmFtZSA9IHBhcnRzLnNoaWZ0KClcbiAgICB0aGlzLnJhd1BhcmFtcyA9IHBhcnRzLmpvaW4oJyAnKVxuICB9XG5cbiAgX3BhcnNlUGFyYW1zIChwYXJhbXMpIHtcbiAgICB2YXIgbmFtZVRvUGFyYW0sIHBhcnNlclxuICAgIHBhcnNlciA9IG5ldyBQYXJhbVBhcnNlcihwYXJhbXMsIHtcbiAgICAgIGFsbG93ZWROYW1lZDogdGhpcy5nZXRPcHRpb24oJ2FsbG93ZWROYW1lZCcpLFxuICAgICAgdmFyczogdGhpcy5jb2Rld2F2ZS52YXJzXG4gICAgfSlcbiAgICB0aGlzLnBhcmFtcyA9IHBhcnNlci5wYXJhbXNcbiAgICB0aGlzLm5hbWVkID0gT2JqZWN0LmFzc2lnbih0aGlzLmdldERlZmF1bHRzKCksIHBhcnNlci5uYW1lZClcblxuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICBuYW1lVG9QYXJhbSA9IHRoaXMuZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpXG5cbiAgICAgIGlmIChuYW1lVG9QYXJhbSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubmFtZWRbbmFtZVRvUGFyYW1dID0gdGhpcy5jbWROYW1lXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2ZpbmRDbG9zaW5nICgpIHtcbiAgICBjb25zdCBmID0gdGhpcy5fZmluZENsb3NpbmdQb3MoKVxuICAgIGlmIChmKSB7XG4gICAgICB0aGlzLmNvbnRlbnQgPSBTdHJpbmdIZWxwZXIudHJpbUVtcHR5TGluZSh0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoLCBmLnBvcykpXG4gICAgICB0aGlzLnN0ciA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIodGhpcy5wb3MsIGYucG9zICsgZi5zdHIubGVuZ3RoKVxuICAgIH1cbiAgfVxuXG4gIF9maW5kQ2xvc2luZ1BvcyAoKSB7XG4gICAgdmFyIGNsb3NpbmcsIG9wZW5pbmdcblxuICAgIGlmICh0aGlzLmNsb3NpbmdQb3MgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2luZ1Bvc1xuICAgIH1cblxuICAgIGNsb3NpbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY21kTmFtZSArIHRoaXMuY29kZXdhdmUuYnJha2V0c1xuICAgIG9wZW5pbmcgPSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNtZE5hbWVcblxuICAgIGNvbnN0IGYgPSB0aGlzLmNvZGV3YXZlLmZpbmRNYXRjaGluZ1BhaXIodGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpXG4gICAgaWYgKGYpIHtcbiAgICAgIHRoaXMuY2xvc2luZ1BvcyA9IGZcbiAgICAgIHJldHVybiB0aGlzLmNsb3NpbmdQb3NcbiAgICB9XG4gIH1cblxuICBfY2hlY2tFbG9uZ2F0ZWQgKCkge1xuICAgIHZhciBlbmRQb3MsIG1heCwgcmVmXG4gICAgZW5kUG9zID0gdGhpcy5nZXRFbmRQb3MoKVxuICAgIG1heCA9IHRoaXMuY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKVxuXG4gICAgd2hpbGUgKGVuZFBvcyA8IG1heCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcywgZW5kUG9zICsgdGhpcy5jb2Rld2F2ZS5kZWNvLmxlbmd0aCkgPT09IHRoaXMuY29kZXdhdmUuZGVjbykge1xuICAgICAgZW5kUG9zICs9IHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGhcbiAgICB9XG5cbiAgICBpZiAoZW5kUG9zID49IG1heCB8fCAocmVmID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIHRoaXMuY29kZXdhdmUuZGVjby5sZW5ndGgpKSA9PT0gJyAnIHx8IHJlZiA9PT0gJ1xcbicgfHwgcmVmID09PSAnXFxyJykge1xuICAgICAgdGhpcy5zdHIgPSB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKHRoaXMucG9zLCBlbmRQb3MpXG4gICAgfVxuICB9XG5cbiAgX2NoZWNrQm94ICgpIHtcbiAgICB2YXIgY2wsIGNyLCBlbmRQb3NcblxuICAgIGlmICh0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCAmJiB0aGlzLmNvZGV3YXZlLmluSW5zdGFuY2UuY21kLm5hbWUgPT09ICdjb21tZW50Jykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY2wgPSB0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KClcbiAgICBjciA9IHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KClcbiAgICBlbmRQb3MgPSB0aGlzLmdldEVuZFBvcygpICsgY3IubGVuZ3RoXG5cbiAgICBpZiAodGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcyAtIGNsLmxlbmd0aCwgdGhpcy5wb3MpID09PSBjbCAmJiB0aGlzLmNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyAtIGNyLmxlbmd0aCwgZW5kUG9zKSA9PT0gY3IpIHtcbiAgICAgIHRoaXMucG9zID0gdGhpcy5wb3MgLSBjbC5sZW5ndGhcbiAgICAgIHRoaXMuc3RyID0gdGhpcy5jb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cih0aGlzLnBvcywgZW5kUG9zKVxuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgJiYgdGhpcy5nZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xKSB7XG4gICAgICB0aGlzLmluQm94ID0gMVxuICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gICAgfVxuICB9XG5cbiAgX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCAoKSB7XG4gICAgdmFyIGVjbCwgZWNyLCBlZCwgcmUxLCByZTIsIHJlM1xuXG4gICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgZWNsID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cCh0aGlzLmNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpXG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5jb2Rld2F2ZS5kZWNvKVxuICAgICAgcmUxID0gbmV3IFJlZ0V4cChgXlxcXFxzKiR7ZWNsfSg/OiR7ZWR9KStcXFxccyooLio/KVxcXFxzKig/OiR7ZWR9KSske2Vjcn0kYCwgJ2dtJylcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoYF5cXFxccyooPzoke2VkfSkqJHtlY3J9XFxyP1xcbmApXG4gICAgICByZTMgPSBuZXcgUmVnRXhwKGBcXG5cXFxccyoke2VjbH0oPzoke2VkfSkqXFxcXHMqJGApXG4gICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRlbnQucmVwbGFjZShyZTEsICckMScpLnJlcGxhY2UocmUyLCAnJykucmVwbGFjZShyZTMsICcnKVxuICAgIH1cbiAgfVxuXG4gIF9nZXRQYXJlbnRDbWRzICgpIHtcbiAgICB2YXIgcmVmXG4gICAgdGhpcy5wYXJlbnQgPSAocmVmID0gdGhpcy5jb2Rld2F2ZS5nZXRFbmNsb3NpbmdDbWQodGhpcy5nZXRFbmRQb3MoKSkpICE9IG51bGwgPyByZWYuaW5pdCgpIDogbnVsbFxuICAgIHJldHVybiB0aGlzLnBhcmVudFxuICB9XG5cbiAgc2V0TXVsdGlQb3MgKG11bHRpUG9zKSB7XG4gICAgdGhpcy5tdWx0aVBvcyA9IG11bHRpUG9zXG4gIH1cblxuICBfZ2V0Q21kT2JqICgpIHtcbiAgICB0aGlzLmdldENtZCgpXG5cbiAgICB0aGlzLl9jaGVja0JveCgpXG5cbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnJlbW92ZUluZGVudEZyb21Db250ZW50KHRoaXMuY29udGVudClcbiAgICByZXR1cm4gc3VwZXIuX2dldENtZE9iaigpXG4gIH1cblxuICBfaW5pdFBhcmFtcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlUGFyYW1zKHRoaXMucmF3UGFyYW1zKVxuICB9XG5cbiAgZ2V0Q29udGV4dCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dCB8fCB0aGlzLmNvZGV3YXZlLmNvbnRleHRcbiAgfVxuXG4gIGdldENtZCAoKSB7XG4gICAgaWYgKHRoaXMuY21kID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2dldFBhcmVudENtZHMoKVxuXG4gICAgICBpZiAodGhpcy5ub0JyYWNrZXQuc3Vic3RyaW5nKDAsIHRoaXMuY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09PSB0aGlzLmNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIpIHtcbiAgICAgICAgdGhpcy5jbWQgPSBDb21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKVxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNvZGV3YXZlLmNvbnRleHRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZmluZGVyID0gdGhpcy5nZXRGaW5kZXIodGhpcy5jbWROYW1lKVxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmZpbmRlci5jb250ZXh0XG4gICAgICAgIHRoaXMuY21kID0gdGhpcy5maW5kZXIuZmluZCgpXG5cbiAgICAgICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvbnRleHQuYWRkTmFtZVNwYWNlKHRoaXMuY21kLmZ1bGxOYW1lKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY21kXG4gIH1cblxuICBnZXRGaW5kZXIgKGNtZE5hbWUpIHtcbiAgICB2YXIgZmluZGVyXG4gICAgZmluZGVyID0gdGhpcy5jb2Rld2F2ZS5jb250ZXh0LmdldEZpbmRlcihjbWROYW1lLCB7XG4gICAgICBuYW1lc3BhY2VzOiB0aGlzLl9nZXRQYXJlbnROYW1lc3BhY2VzKClcbiAgICB9KVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIH1cblxuICBfZ2V0UGFyZW50TmFtZXNwYWNlcyAoKSB7XG4gICAgdmFyIG5zcGNzLCBvYmpcbiAgICBuc3BjcyA9IFtdXG4gICAgb2JqID0gdGhpc1xuXG4gICAgd2hpbGUgKG9iai5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgb2JqID0gb2JqLnBhcmVudFxuXG4gICAgICBpZiAob2JqLmNtZCAhPSBudWxsICYmIG9iai5jbWQuZnVsbE5hbWUgIT0gbnVsbCkge1xuICAgICAgICBuc3Bjcy5wdXNoKG9iai5jbWQuZnVsbE5hbWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5zcGNzXG4gIH1cblxuICBfcmVtb3ZlQnJhY2tldCAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcodGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCwgc3RyLmxlbmd0aCAtIHRoaXMuY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gIH1cblxuICBhbHRlckFsaWFzT2YgKGFsaWFzT2YpIHtcbiAgICBjb25zdCBjbWROYW1lID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0KHRoaXMuY21kTmFtZSlbMV1cbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLCBjbWROYW1lKVxuICB9XG5cbiAgaXNFbXB0eSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyID09PSB0aGlzLmNvZGV3YXZlLmJyYWtldHMgKyB0aGlzLmNvZGV3YXZlLmNsb3NlQ2hhciArIHRoaXMuY29kZXdhdmUuYnJha2V0cyB8fCB0aGlzLnN0ciA9PT0gdGhpcy5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzXG4gIH1cblxuICBleGVjdXRlICgpIHtcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIGlmICh0aGlzLmNvZGV3YXZlLmNsb3NpbmdQcm9tcCAhPSBudWxsICYmIHRoaXMuY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKHRoaXMucG9zICsgdGhpcy5jb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2Rld2F2ZS5jbG9zaW5nUHJvbXAuY2FuY2VsKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoKCcnKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5jbWQgIT0gbnVsbCkge1xuICAgICAgY29uc3QgYmVmb3JlRnVuY3QgPSB0aGlzLmdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpXG4gICAgICBpZiAoYmVmb3JlRnVuY3QpIHtcbiAgICAgICAgYmVmb3JlRnVuY3QodGhpcylcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucmVzdWx0SXNBdmFpbGFibGUoKSkge1xuICAgICAgICByZXR1cm4gKDAsIE9wdGlvbmFsUHJvbWlzZS5vcHRpb25hbFByb21pc2UpKHRoaXMucmVzdWx0KCkpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoKHJlcylcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnJlc3VsdCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5FeGVjdXRlRnVuY3QoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldEVuZFBvcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zICsgdGhpcy5zdHIubGVuZ3RoXG4gIH1cblxuICBnZXRQb3MgKCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMuc3RyLmxlbmd0aCkud2l0aEVkaXRvcih0aGlzLmNvZGV3YXZlLmVkaXRvcilcbiAgfVxuXG4gIGdldE9wZW5pbmdQb3MgKCkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucG9zLCB0aGlzLnBvcyArIHRoaXMub3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IodGhpcy5jb2Rld2F2ZS5lZGl0b3IpXG4gIH1cblxuICBnZXRJbmRlbnQgKCkge1xuICAgIHZhciBoZWxwZXJcblxuICAgIGlmICh0aGlzLmluZGVudExlbiA9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5pbkJveCAhPSBudWxsKSB7XG4gICAgICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5jb250ZXh0KVxuICAgICAgICB0aGlzLmluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KHRoaXMuZ2V0UG9zKCkuc2FtZUxpbmVzUHJlZml4KCkpLmxlbmd0aFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbmRlbnRMZW4gPSB0aGlzLnBvcyAtIHRoaXMuZ2V0UG9zKCkucHJldkVPTCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5kZW50TGVuXG4gIH1cblxuICByZW1vdmVJbmRlbnRGcm9tQ29udGVudCAodGV4dCkge1xuICAgIHZhciByZWdcblxuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IG5ldyBSZWdFeHAoJ15cXFxcc3snICsgdGhpcy5nZXRJbmRlbnQoKSArICd9JywgJ2dtJylcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnLCAnJylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHRcbiAgICB9XG4gIH1cblxuICBhbHRlclJlc3VsdEZvckJveCAocmVwbCkge1xuICAgIHZhciBib3gsIGhlbHBlciwgb3JpZ2luYWwsIHJlc1xuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KClcbiAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKHRoaXMuY29udGV4dClcbiAgICBoZWxwZXIuZ2V0T3B0RnJvbUxpbmUob3JpZ2luYWwudGV4dFdpdGhGdWxsTGluZXMoKSwgZmFsc2UpXG5cbiAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3JlcGxhY2VCb3gnKSkge1xuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbCk7XG4gICAgICBbcmVwbC5zdGFydCwgcmVwbC5lbmRdID0gW2JveC5zdGFydCwgYm94LmVuZF1cbiAgICAgIHRoaXMuaW5kZW50TGVuID0gaGVscGVyLmluZGVudFxuICAgICAgcmVwbC50ZXh0ID0gdGhpcy5hcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgICAgcmVwbC5zdGFydCA9IG9yaWdpbmFsLnByZXZFT0woKVxuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKClcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgdGhpcy5jb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyB0aGlzLmNvZGV3YXZlLm1hcmtlciArIG9yaWdpbmFsLnNhbWVMaW5lc1N1ZmZpeCgpLCB7XG4gICAgICAgIG11bHRpbGluZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgW3JlcGwucHJlZml4LCByZXBsLnRleHQsIHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdCh0aGlzLmNvZGV3YXZlLm1hcmtlcilcbiAgICB9XG5cbiAgICByZXR1cm4gcmVwbFxuICB9XG5cbiAgZ2V0Q3Vyc29yRnJvbVJlc3VsdCAocmVwbCkge1xuICAgIHZhciBjdXJzb3JQb3MsIHBcbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpXG5cbiAgICBpZiAodGhpcy5jbWQgIT0gbnVsbCAmJiB0aGlzLmNvZGV3YXZlLmNoZWNrQ2FycmV0ICYmIHRoaXMuZ2V0T3B0aW9uKCdjaGVja0NhcnJldCcpKSB7XG4gICAgICBpZiAoKHAgPSB0aGlzLmNvZGV3YXZlLmdldENhcnJldFBvcyhyZXBsLnRleHQpKSAhPSBudWxsKSB7XG4gICAgICAgIGN1cnNvclBvcyA9IHJlcGwuc3RhcnQgKyByZXBsLnByZWZpeC5sZW5ndGggKyBwXG4gICAgICB9XG5cbiAgICAgIHJlcGwudGV4dCA9IHRoaXMuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHJlcGwudGV4dClcbiAgICB9XG5cbiAgICByZXR1cm4gY3Vyc29yUG9zXG4gIH1cblxuICBjaGVja011bHRpIChyZXBsKSB7XG4gICAgdmFyIGksIGosIGxlbiwgbmV3UmVwbCwgb3JpZ2luYWxQb3MsIG9yaWdpbmFsVGV4dCwgcG9zLCByZWYsIHJlcGxhY2VtZW50c1xuXG4gICAgaWYgKHRoaXMubXVsdGlQb3MgIT0gbnVsbCAmJiB0aGlzLm11bHRpUG9zLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJlcGxhY2VtZW50cyA9IFtyZXBsXVxuICAgICAgb3JpZ2luYWxUZXh0ID0gcmVwbC5vcmlnaW5hbFRleHQoKVxuICAgICAgcmVmID0gdGhpcy5tdWx0aVBvc1xuXG4gICAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgICBwb3MgPSByZWZbaV1cblxuICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgIG9yaWdpbmFsUG9zID0gcG9zLnN0YXJ0XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3UmVwbCA9IHJlcGwuY29weSgpLmFwcGx5T2Zmc2V0KHBvcy5zdGFydCAtIG9yaWdpbmFsUG9zKVxuXG4gICAgICAgICAgaWYgKG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT09IG9yaWdpbmFsVGV4dCkge1xuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50c1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW3JlcGxdXG4gICAgfVxuICB9XG5cbiAgcmVwbGFjZVdpdGggKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBseVJlcGxhY2VtZW50KG5ldyBSZXBsYWNlbWVudCh0aGlzLnBvcywgdGhpcy5nZXRFbmRQb3MoKSwgdGV4dCkpXG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50IChyZXBsKSB7XG4gICAgdmFyIGN1cnNvclBvcywgcmVwbGFjZW1lbnRzXG4gICAgcmVwbC53aXRoRWRpdG9yKHRoaXMuY29kZXdhdmUuZWRpdG9yKVxuXG4gICAgaWYgKHRoaXMuaW5Cb3ggIT0gbnVsbCkge1xuICAgICAgdGhpcy5hbHRlclJlc3VsdEZvckJveChyZXBsKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXBsLnRleHQgPSB0aGlzLmFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICB9XG5cbiAgICBjdXJzb3JQb3MgPSB0aGlzLmdldEN1cnNvckZyb21SZXN1bHQocmVwbClcbiAgICByZXBsLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyhjdXJzb3JQb3MsIGN1cnNvclBvcyldXG4gICAgcmVwbGFjZW1lbnRzID0gdGhpcy5jaGVja011bHRpKHJlcGwpXG4gICAgdGhpcy5yZXBsYWNlU3RhcnQgPSByZXBsLnN0YXJ0XG4gICAgdGhpcy5yZXBsYWNlRW5kID0gcmVwbC5yZXNFbmQoKVxuICAgIHJldHVybiB0aGlzLmNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gIH1cbn1cbmV4cG9ydHMuUG9zaXRpb25lZENtZEluc3RhbmNlID0gUG9zaXRpb25lZENtZEluc3RhbmNlXG4iLCJcbnZhciBQcm9jZXNzID0gY2xhc3MgUHJvY2VzcyB7XG59XG5leHBvcnRzLlByb2Nlc3MgPSBQcm9jZXNzXG4iLCJcbmNvbnN0IExvZ2dlciA9IHJlcXVpcmUoJy4vTG9nZ2VyJykuTG9nZ2VyXG5cbnZhciBTdG9yYWdlID0gY2xhc3MgU3RvcmFnZSB7XG4gIGNvbnN0cnVjdG9yIChlbmdpbmUpIHtcbiAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZVxuICB9XG5cbiAgc2F2ZSAoa2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmUoa2V5LCB2YWwpXG4gICAgfVxuICB9XG5cbiAgc2F2ZUluUGF0aCAocGF0aCwga2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5lbmdpbmVBdmFpbGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLnNhdmVJblBhdGgocGF0aCwga2V5LCB2YWwpXG4gICAgfVxuICB9XG5cbiAgbG9hZCAoa2V5KSB7XG4gICAgaWYgKHRoaXMuZW5naW5lICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5sb2FkKGtleSlcbiAgICB9XG4gIH1cblxuICBlbmdpbmVBdmFpbGFibGUgKCkge1xuICAgIGlmICh0aGlzLmVuZ2luZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlciA9IHRoaXMubG9nZ2VyIHx8IG5ldyBMb2dnZXIoKVxuICAgICAgdGhpcy5sb2dnZXIubG9nKCdObyBzdG9yYWdlIGVuZ2luZSBhdmFpbGFibGUnKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG59XG5leHBvcnRzLlN0b3JhZ2UgPSBTdG9yYWdlXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuXG5jb25zdCBUZXh0UGFyc2VyID0gcmVxdWlyZSgnLi9UZXh0UGFyc2VyJykuVGV4dFBhcnNlclxuXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1BvcycpLlBvc1xuXG52YXIgaXNFbGVtZW50XG52YXIgRG9tS2V5TGlzdGVuZXIgPSBjbGFzcyBEb21LZXlMaXN0ZW5lciB7XG4gIHN0YXJ0TGlzdGVuaW5nICh0YXJnZXQpIHtcbiAgICB2YXIgb25rZXlkb3duLCBvbmtleXByZXNzLCBvbmtleXVwLCB0aW1lb3V0XG4gICAgdGltZW91dCA9IG51bGxcblxuICAgIG9ua2V5ZG93biA9IGUgPT4ge1xuICAgICAgaWYgKChDb2Rld2F2ZS5pbnN0YW5jZXMubGVuZ3RoIDwgMiB8fCB0aGlzLm9iaiA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgJiYgZS5rZXlDb2RlID09PSA2OSAmJiBlLmN0cmxLZXkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgaWYgKHRoaXMub25BY3RpdmF0aW9uS2V5ICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbkFjdGl2YXRpb25LZXkoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgb25rZXl1cCA9IGUgPT4ge1xuICAgICAgaWYgKHRoaXMub25BbnlDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkFueUNoYW5nZShlKVxuICAgICAgfVxuICAgIH1cblxuICAgIG9ua2V5cHJlc3MgPSBlID0+IHtcbiAgICAgIGlmICh0aW1lb3V0ICE9IG51bGwpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgICB9XG5cbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMub25BbnlDaGFuZ2UgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9uQW55Q2hhbmdlKGUpXG4gICAgICAgIH1cbiAgICAgIH0sIDEwMClcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25rZXlkb3duKVxuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25rZXl1cClcbiAgICAgIHJldHVybiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBvbmtleXByZXNzKVxuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmF0dGFjaEV2ZW50KSB7XG4gICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoJ29ua2V5ZG93bicsIG9ua2V5ZG93bilcbiAgICAgIHRhcmdldC5hdHRhY2hFdmVudCgnb25rZXl1cCcsIG9ua2V5dXApXG4gICAgICByZXR1cm4gdGFyZ2V0LmF0dGFjaEV2ZW50KCdvbmtleXByZXNzJywgb25rZXlwcmVzcylcbiAgICB9XG4gIH1cbn1cbmV4cG9ydHMuRG9tS2V5TGlzdGVuZXIgPSBEb21LZXlMaXN0ZW5lclxuXG5pc0VsZW1lbnQgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb20pXG4gICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gQnJvd3NlcnMgbm90IHN1cHBvcnRpbmcgVzMgRE9NMiBkb24ndCBoYXZlIEhUTUxFbGVtZW50IGFuZFxuICAgIC8vIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG5cbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLm5vZGVUeXBlID09PSAxICYmIHR5cGVvZiBvYmouc3R5bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBvYmoub3duZXJEb2N1bWVudCA9PT0gJ29iamVjdCdcbiAgfVxufVxuXG52YXIgVGV4dEFyZWFFZGl0b3IgPSBjbGFzcyBUZXh0QXJlYUVkaXRvciBleHRlbmRzIFRleHRQYXJzZXIge1xuICBjb25zdHJ1Y3RvciAodGFyZ2V0MSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDFcbiAgICB0aGlzLm9iaiA9IGlzRWxlbWVudCh0aGlzLnRhcmdldCkgPyB0aGlzLnRhcmdldCA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0KVxuXG4gICAgaWYgKHRoaXMub2JqID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGV4dEFyZWEgbm90IGZvdW5kJylcbiAgICB9XG5cbiAgICB0aGlzLm5hbWVzcGFjZSA9ICd0ZXh0YXJlYSdcbiAgICB0aGlzLmNoYW5nZUxpc3RlbmVycyA9IFtdXG4gICAgdGhpcy5fc2tpcENoYW5nZUV2ZW50ID0gMFxuICB9XG5cbiAgb25BbnlDaGFuZ2UgKGUpIHtcbiAgICB2YXIgY2FsbGJhY2ssIGosIGxlbjEsIHJlZiwgcmVzdWx0c1xuXG4gICAgaWYgKHRoaXMuX3NraXBDaGFuZ2VFdmVudCA8PSAwKSB7XG4gICAgICByZWYgPSB0aGlzLmNoYW5nZUxpc3RlbmVyc1xuICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gcmVmW2pdXG4gICAgICAgIHJlc3VsdHMucHVzaChjYWxsYmFjaygpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9za2lwQ2hhbmdlRXZlbnQtLVxuXG4gICAgICBpZiAodGhpcy5vblNraXBlZENoYW5nZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uU2tpcGVkQ2hhbmdlKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBza2lwQ2hhbmdlRXZlbnQgKG5iID0gMSkge1xuICAgIHRoaXMuX3NraXBDaGFuZ2VFdmVudCArPSBuYlxuICB9XG5cbiAgYmluZGVkVG8gKGNvZGV3YXZlKSB7XG4gICAgdGhpcy5vbkFjdGl2YXRpb25LZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gY29kZXdhdmUub25BY3RpdmF0aW9uS2V5KClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGFydExpc3RlbmluZyhkb2N1bWVudClcbiAgfVxuXG4gIHNlbGVjdGlvblByb3BFeGlzdHMgKCkge1xuICAgIHJldHVybiAnc2VsZWN0aW9uU3RhcnQnIGluIHRoaXMub2JqXG4gIH1cblxuICBoYXNGb2N1cyAoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMub2JqXG4gIH1cblxuICB0ZXh0ICh2YWwpIHtcbiAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgIGlmICghdGhpcy50ZXh0RXZlbnRDaGFuZ2UodmFsKSkge1xuICAgICAgICB0aGlzLm9iai52YWx1ZSA9IHZhbFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9iai52YWx1ZVxuICB9XG5cbiAgc3BsaWNlVGV4dCAoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLnRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCwgZW5kKSB8fCB0aGlzLnNwbGljZVRleHRXaXRoRXhlY0NvbW1hbmQodGV4dCwgc3RhcnQsIGVuZCkgfHwgc3VwZXIuc3BsaWNlVGV4dChzdGFydCwgZW5kLCB0ZXh0KVxuICB9XG5cbiAgdGV4dEV2ZW50Q2hhbmdlICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICB2YXIgZXZlbnRcblxuICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCAhPSBudWxsKSB7XG4gICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUZXh0RXZlbnQnKVxuICAgIH1cblxuICAgIGlmIChldmVudCAhPSBudWxsICYmIGV2ZW50LmluaXRUZXh0RXZlbnQgIT0gbnVsbCAmJiBldmVudC5pc1RydXN0ZWQgIT09IGZhbHNlKSB7XG4gICAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgICAgZW5kID0gdGhpcy50ZXh0TGVuKClcbiAgICAgIH1cblxuICAgICAgaWYgKHRleHQubGVuZ3RoIDwgMSkge1xuICAgICAgICBpZiAoc3RhcnQgIT09IDApIHtcbiAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKHN0YXJ0IC0gMSwgc3RhcnQpXG4gICAgICAgICAgc3RhcnQtLVxuICAgICAgICB9IGVsc2UgaWYgKGVuZCAhPT0gdGhpcy50ZXh0TGVuKCkpIHtcbiAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0U3Vic3RyKGVuZCwgZW5kICsgMSlcbiAgICAgICAgICBlbmQrK1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGV2ZW50LmluaXRUZXh0RXZlbnQoJ3RleHRJbnB1dCcsIHRydWUsIHRydWUsIG51bGwsIHRleHQsIDkpIC8vIEBzZXRDdXJzb3JQb3Moc3RhcnQsZW5kKVxuXG4gICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIHRoaXMub2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgICB0aGlzLnNraXBDaGFuZ2VFdmVudCgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICBzcGxpY2VUZXh0V2l0aEV4ZWNDb21tYW5kICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIHtcbiAgICBpZiAoZG9jdW1lbnQuZXhlY0NvbW1hbmQgIT0gbnVsbCkge1xuICAgICAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgICAgIGVuZCA9IHRoaXMudGV4dExlbigpXG4gICAgICB9XG5cbiAgICAgIHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIHRoaXMub2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgcmV0dXJuIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGdldEN1cnNvclBvcyAoKSB7XG4gICAgaWYgKHRoaXMudG1wQ3Vyc29yUG9zICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnRtcEN1cnNvclBvc1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc0ZvY3VzKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25Qcm9wRXhpc3RzKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHRoaXMub2JqLnNlbGVjdGlvblN0YXJ0LCB0aGlzLm9iai5zZWxlY3Rpb25FbmQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJzb3JQb3NGYWxsYmFjaygpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0Q3Vyc29yUG9zRmFsbGJhY2sgKCkge1xuICAgIHZhciBsZW4sIHBvcywgcm5nLCBzZWxcblxuICAgIGlmICh0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpXG5cbiAgICAgIGlmIChzZWwucGFyZW50RWxlbWVudCgpID09PSB0aGlzLm9iaikge1xuICAgICAgICBybmcgPSB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgICBybmcubW92ZVRvQm9va21hcmsoc2VsLmdldEJvb2ttYXJrKCkpXG4gICAgICAgIGxlbiA9IDBcblxuICAgICAgICB3aGlsZSAocm5nLmNvbXBhcmVFbmRQb2ludHMoJ0VuZFRvU3RhcnQnLCBybmcpID4gMCkge1xuICAgICAgICAgIGxlbisrXG4gICAgICAgICAgcm5nLm1vdmVFbmQoJ2NoYXJhY3RlcicsIC0xKVxuICAgICAgICB9XG5cbiAgICAgICAgcm5nLnNldEVuZFBvaW50KCdTdGFydFRvU3RhcnQnLCB0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UoKSlcbiAgICAgICAgcG9zID0gbmV3IFBvcygwLCBsZW4pXG5cbiAgICAgICAgd2hpbGUgKHJuZy5jb21wYXJlRW5kUG9pbnRzKCdFbmRUb1N0YXJ0Jywgcm5nKSA+IDApIHtcbiAgICAgICAgICBwb3Muc3RhcnQrK1xuICAgICAgICAgIHBvcy5lbmQrK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKCdjaGFyYWN0ZXInLCAtMSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwb3NcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRDdXJzb3JQb3MgKHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIGVuZCA9IHN0YXJ0XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uUHJvcEV4aXN0cykge1xuICAgICAgdGhpcy50bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpXG4gICAgICB0aGlzLm9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnRtcEN1cnNvclBvcyA9IG51bGxcbiAgICAgICAgdGhpcy5vYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgICB0aGlzLm9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIH0sIDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZClcbiAgICB9XG4gIH1cblxuICBzZXRDdXJzb3JQb3NGYWxsYmFjayAoc3RhcnQsIGVuZCkge1xuICAgIHZhciBybmdcblxuICAgIGlmICh0aGlzLm9iai5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgIHJuZyA9IHRoaXMub2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICBybmcubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCBzdGFydClcbiAgICAgIHJuZy5jb2xsYXBzZSgpXG4gICAgICBybmcubW92ZUVuZCgnY2hhcmFjdGVyJywgZW5kIC0gc3RhcnQpXG4gICAgICByZXR1cm4gcm5nLnNlbGVjdCgpXG4gICAgfVxuICB9XG5cbiAgZ2V0TGFuZyAoKSB7XG4gICAgaWYgKHRoaXMuX2xhbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9sYW5nXG4gICAgfVxuXG4gICAgaWYgKHRoaXMub2JqLmhhc0F0dHJpYnV0ZSgnZGF0YS1sYW5nJykpIHtcbiAgICAgIHJldHVybiB0aGlzLm9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpXG4gICAgfVxuICB9XG5cbiAgc2V0TGFuZyAodmFsKSB7XG4gICAgdGhpcy5fbGFuZyA9IHZhbFxuICAgIHJldHVybiB0aGlzLm9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsIHZhbClcbiAgfVxuXG4gIGNhbkxpc3RlblRvQ2hhbmdlICgpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spXG4gIH1cblxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lciAoY2FsbGJhY2spIHtcbiAgICB2YXIgaVxuXG4gICAgaWYgKChpID0gdGhpcy5jaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykpID4gLTEpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYW5nZUxpc3RlbmVycy5zcGxpY2UoaSwgMSlcbiAgICB9XG4gIH1cblxuICBhcHBseVJlcGxhY2VtZW50cyAocmVwbGFjZW1lbnRzKSB7XG4gICAgaWYgKHJlcGxhY2VtZW50cy5sZW5ndGggPiAwICYmIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zID0gW3RoaXMuZ2V0Q3Vyc29yUG9zKCldXG4gICAgfVxuXG4gICAgcmV0dXJuIHN1cGVyLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgfVxufVxuXG5UZXh0QXJlYUVkaXRvci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmcgPSBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmdcblxuZXhwb3J0cy5UZXh0QXJlYUVkaXRvciA9IFRleHRBcmVhRWRpdG9yXG4iLCJcbmNvbnN0IEVkaXRvciA9IHJlcXVpcmUoJy4vRWRpdG9yJykuRWRpdG9yXG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUG9zJykuUG9zXG5cbnZhciBUZXh0UGFyc2VyID0gY2xhc3MgVGV4dFBhcnNlciBleHRlbmRzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yIChfdGV4dCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLl90ZXh0ID0gX3RleHRcbiAgfVxuXG4gIHRleHQgKHZhbCkge1xuICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dCA9IHZhbFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90ZXh0XG4gIH1cblxuICB0ZXh0Q2hhckF0IChwb3MpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0KClbcG9zXVxuICB9XG5cbiAgdGV4dExlbiAocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLmxlbmd0aFxuICB9XG5cbiAgdGV4dFN1YnN0ciAoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiB0aGlzLnRleHQoKS5zdWJzdHJpbmcoc3RhcnQsIGVuZClcbiAgfVxuXG4gIGluc2VydFRleHRBdCAodGV4dCwgcG9zKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCh0aGlzLnRleHQoKS5zdWJzdHJpbmcoMCwgcG9zKSArIHRleHQgKyB0aGlzLnRleHQoKS5zdWJzdHJpbmcocG9zLCB0aGlzLnRleHQoKS5sZW5ndGgpKVxuICB9XG5cbiAgc3BsaWNlVGV4dCAoc3RhcnQsIGVuZCwgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLnRleHQodGhpcy50ZXh0KCkuc2xpY2UoMCwgc3RhcnQpICsgKHRleHQgfHwgJycpICsgdGhpcy50ZXh0KCkuc2xpY2UoZW5kKSlcbiAgfVxuXG4gIGdldEN1cnNvclBvcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0XG4gIH1cblxuICBzZXRDdXJzb3JQb3MgKHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIGVuZCA9IHN0YXJ0XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQgPSBuZXcgUG9zKHN0YXJ0LCBlbmQpXG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0XG4gIH1cbn1cbmV4cG9ydHMuVGV4dFBhcnNlciA9IFRleHRQYXJzZXJcbiIsIid1c2Ugc3RyaWN0J1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdDb2Rld2F2ZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIENvZGV3YXZlXG4gIH1cbn0pXG5cbmNvbnN0IENvZGV3YXZlID0gcmVxdWlyZSgnLi9Db2Rld2F2ZScpLkNvZGV3YXZlXG5cbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuL0NvbW1hbmQnKS5Db21tYW5kXG5cbmNvbnN0IENvcmVDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKCcuL2NtZHMvQ29yZUNvbW1hbmRQcm92aWRlcicpLkNvcmVDb21tYW5kUHJvdmlkZXJcblxuY29uc3QgSnNDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKCcuL2NtZHMvSnNDb21tYW5kUHJvdmlkZXInKS5Kc0NvbW1hbmRQcm92aWRlclxuXG5jb25zdCBQaHBDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKCcuL2NtZHMvUGhwQ29tbWFuZFByb3ZpZGVyJykuUGhwQ29tbWFuZFByb3ZpZGVyXG5cbmNvbnN0IEh0bWxDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKCcuL2NtZHMvSHRtbENvbW1hbmRQcm92aWRlcicpLkh0bWxDb21tYW5kUHJvdmlkZXJcblxuY29uc3QgRmlsZUNvbW1hbmRQcm92aWRlciA9IHJlcXVpcmUoJy4vY21kcy9GaWxlQ29tbWFuZFByb3ZpZGVyJykuRmlsZUNvbW1hbmRQcm92aWRlclxuXG5jb25zdCBTdHJpbmdDb21tYW5kUHJvdmlkZXIgPSByZXF1aXJlKCcuL2NtZHMvU3RyaW5nQ29tbWFuZFByb3ZpZGVyJykuU3RyaW5nQ29tbWFuZFByb3ZpZGVyXG5cbmNvbnN0IFBvcyA9IHJlcXVpcmUoJy4vcG9zaXRpb25pbmcvUG9zJykuUG9zXG5cbmNvbnN0IFdyYXBwZWRQb3MgPSByZXF1aXJlKCcuL3Bvc2l0aW9uaW5nL1dyYXBwZWRQb3MnKS5XcmFwcGVkUG9zXG5cbmNvbnN0IExvY2FsU3RvcmFnZUVuZ2luZSA9IHJlcXVpcmUoJy4vc3RvcmFnZUVuZ2luZXMvTG9jYWxTdG9yYWdlRW5naW5lJykuTG9jYWxTdG9yYWdlRW5naW5lXG5cbmNvbnN0IENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKS5Db250ZXh0XG5cbmNvbnN0IENtZEluc3RhbmNlID0gcmVxdWlyZSgnLi9DbWRJbnN0YW5jZScpLkNtZEluc3RhbmNlXG5cbmNvbnN0IENtZEZpbmRlciA9IHJlcXVpcmUoJy4vQ21kRmluZGVyJykuQ21kRmluZGVyXG5cbkNvbnRleHQuY21kSW5zdGFuY2VDbGFzcyA9IENtZEluc3RhbmNlXG5Db250ZXh0LmNtZEZpbmRlckNsYXNzID0gQ21kRmluZGVyXG5cblBvcy53cmFwQ2xhc3MgPSBXcmFwcGVkUG9zXG5Db2Rld2F2ZS5pbnN0YW5jZXMgPSBbXVxuQ29tbWFuZC5wcm92aWRlcnMgPSBbbmV3IENvcmVDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEpzQ29tbWFuZFByb3ZpZGVyKCksIG5ldyBQaHBDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEh0bWxDb21tYW5kUHJvdmlkZXIoKSwgbmV3IEZpbGVDb21tYW5kUHJvdmlkZXIoKSwgbmV3IFN0cmluZ0NvbW1hbmRQcm92aWRlcigpXVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbmlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgQ29tbWFuZC5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZUVuZ2luZSgpXG59XG4iLCJcbmNvbnN0IENvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQ29tbWFuZFxuY29uc3QgQmFzZUNvbW1hbmQgPSByZXF1aXJlKCcuLi9Db21tYW5kJykuQmFzZUNvbW1hbmRcblxuY29uc3QgTGFuZ0RldGVjdG9yID0gcmVxdWlyZSgnLi4vZGV0ZWN0b3JzL0xhbmdEZXRlY3RvcicpLkxhbmdEZXRlY3RvclxuXG5jb25zdCBBbHdheXNFbmFibGVkID0gcmVxdWlyZSgnLi4vZGV0ZWN0b3JzL0Fsd2F5c0VuYWJsZWQnKS5BbHdheXNFbmFibGVkXG5cbmNvbnN0IEJveEhlbHBlciA9IHJlcXVpcmUoJy4uL0JveEhlbHBlcicpLkJveEhlbHBlclxuXG5jb25zdCBFZGl0Q21kUHJvcCA9IHJlcXVpcmUoJy4uL0VkaXRDbWRQcm9wJykuRWRpdENtZFByb3BcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInKS5TdHJpbmdIZWxwZXJcblxuY29uc3QgUGF0aEhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvUGF0aEhlbHBlcicpLlBhdGhIZWxwZXJcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKCcuLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCcpLlJlcGxhY2VtZW50XG5cbnZhciBCb3hDbWQsIENsb3NlQ21kLCBFZGl0Q21kLCBFbW1ldENtZCwgTmFtZVNwYWNlQ21kLCBUZW1wbGF0ZUNtZCwgYWxpYXNDb21tYW5kLCBnZXRDb21tYW5kLCBnZXRDb250ZW50LCBnZXRQYXJhbSwgaGVscCwgbGlzdENvbW1hbmQsIHJlbW92ZUNvbW1hbmQsIHJlbmFtZUNvbW1hbmQsIHNldENvbW1hbmQsIHN0b3JlSnNvbkNvbW1hbmRcbnZhciBDb3JlQ29tbWFuZFByb3ZpZGVyID0gY2xhc3MgQ29yZUNvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChjbWRzKSB7XG4gICAgdmFyIGNvcmVcbiAgICBjb3JlID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NvcmUnKSlcbiAgICBjbWRzLmFkZERldGVjdG9yKG5ldyBBbHdheXNFbmFibGVkKCdjb3JlJykpXG4gICAgY29yZS5hZGREZXRlY3RvcihuZXcgTGFuZ0RldGVjdG9yKCkpXG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICBoZWxwOiB7XG4gICAgICAgIHJlcGxhY2VCb3g6IHRydWUsXG4gICAgICAgIHJlc3VsdDogaGVscCxcbiAgICAgICAgcGFyc2U6IHRydWUsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydjbWQnXSxcbiAgICAgICAgaGVscDogJ1RvIGdldCBoZWxwIG9uIGEgcGVjaWZpYyBjb21tYW5kLCBkbyA6XFxufn5oZWxwIGhlbGxvfn4gKGhlbGxvIGJlaW5nIHRoZSBjb21tYW5kKScsXG4gICAgICAgIGNtZHM6IHtcbiAgICAgICAgICBvdmVydmlldzoge1xuICAgICAgICAgICAgcmVwbGFjZUJveDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3VsdDogJ35+Ym94fn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuICBfX18gICAgICAgICBfICAgX18gICAgICBfX1xcbiAvIF9ffF9fXyAgX198IHxfX1xcXFwgXFxcXCAgICAvIC9fIF9fXyBfX19fX19cXG4vIC9fXy8gXyBcXFxcLyBfYCAvIC1fXFxcXCBcXFxcL1xcXFwvIC8gX2AgXFxcXCBWIC8gLV8vXFxuXFxcXF9fX19cXFxcX19fL1xcXFxfXyxfXFxcXF9fX3xcXFxcXy9cXFxcXy9cXFxcX18sX3xcXFxcXy9cXFxcX19ffFxcblRoZSB0ZXh0IGVkaXRvciBoZWxwZXJcXG5+fi9xdW90ZV9jYXJyZXR+flxcblxcbldoZW4gdXNpbmcgQ29kZXdhdmUgeW91IHdpbGwgYmUgd3JpdGluZyBjb21tYW5kcyB3aXRoaW4gXFxueW91ciB0ZXh0IGVkaXRvci4gVGhlc2UgY29tbWFuZHMgbXVzdCBiZSBwbGFjZWQgYmV0d2VlbiB0d28gXFxucGFpcnMgb2YgXCJ+XCIgKHRpbGRlKSBhbmQgdGhlbiwgdGhleSBjYW4gYmUgZXhlY3V0ZWQgYnkgcHJlc3NpbmcgXFxuXCJjdHJsXCIrXCJzaGlmdFwiK1wiZVwiLCB3aXRoIHlvdXIgY3Vyc29yIGluc2lkZSB0aGUgY29tbWFuZFxcbkV4OiB+fiFoZWxsb35+XFxuXFxuWW91IGRvbnQgbmVlZCB0byBhY3R1YWxseSB0eXBlIGFueSBcIn5cIiAodGlsZGUpLiBcXG5QcmVzc2luZyBcImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2lsbCBhZGQgdGhlbSBpZiB5b3UgYXJlIG5vdCBhbHJlYWR5XFxud2l0aGluIGEgY29tbWFuZC5cXG5cXG5Db2Rld2F2ZSBkb2VzIG5vdCB1c2UgVUkgdG8gZGlzcGxheSBhbnkgaW5mb3JtYXRpb24uIFxcbkluc3RlYWQsIGl0IHVzZXMgdGV4dCB3aXRoaW4gY29kZSBjb21tZW50cyB0byBtaW1pYyBVSXMuIFxcblRoZSBnZW5lcmF0ZWQgY29tbWVudCBibG9ja3Mgd2lsbCBiZSByZWZlcnJlZCB0byBhcyB3aW5kb3dzIFxcbmluIHRoZSBoZWxwIHNlY3Rpb25zLlxcblxcblRvIGNsb3NlIHRoaXMgd2luZG93IChpLmUuIHJlbW92ZSB0aGlzIGNvbW1lbnQgYmxvY2spLCBwcmVzcyBcXG5cImN0cmxcIitcInNoaWZ0XCIrXCJlXCIgd2l0aCB5b3VyIGN1cnNvciBvbiB0aGUgbGluZSBiZWxsb3cuXFxufn4hY2xvc2V8fn5cXG5cXG5Vc2UgdGhlIGZvbGxvd2luZyBjb21tYW5kIGZvciBhIHdhbGt0aHJvdWdoIG9mIHNvbWUgb2YgdGhlIG1hbnlcXG5mZWF0dXJlcyBvZiBDb2Rld2F2ZVxcbn5+IWhlbHA6Z2V0X3N0YXJ0ZWR+fiBvciB+fiFoZWxwOmRlbW9+flxcblxcbkxpc3Qgb2YgYWxsIGhlbHAgc3ViamVjdHMgXFxufn4haGVscDpzdWJqZWN0c35+IG9yIH5+IWhlbHA6c3Vifn4gXFxuXFxufn4hY2xvc2V+flxcbn5+L2JveH5+J1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc3ViamVjdHM6IHtcbiAgICAgICAgICAgIHJlcGxhY2VCb3g6IHRydWUsXG4gICAgICAgICAgICByZXN1bHQ6ICd+fmJveH5+XFxufn4haGVscH5+XFxufn4haGVscDpnZXRfc3RhcnRlZH5+ICh+fiFoZWxwOmRlbW9+filcXG5+fiFoZWxwOnN1YmplY3Rzfn4gKH5+IWhlbHA6c3Vifn4pXFxufn4haGVscDplZGl0aW5nfn4gKH5+IWhlbHA6ZWRpdH5+KVxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdWI6IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmhlbHA6c3ViamVjdHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRfc3RhcnRlZDoge1xuICAgICAgICAgICAgcmVwbGFjZUJveDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3VsdDogJ35+Ym94fn5cXG5UaGUgY2xhc3NpYyBIZWxsbyBXb3JsZC5cXG5+fiFoZWxsb3x+flxcblxcbn5+aGVscDplZGl0aW5nOmludHJvfn5cXG5+fnF1b3RlX2NhcnJldH5+XFxuXFxuRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY3JlYXRpbmcgeW91ciBvd24gY29tbWFuZHMsIHNlZTpcXG5+fiFoZWxwOmVkaXRpbmd+flxcblxcbkNvZGV3YXZlIGNvbWVzIHdpdGggbWFueSBwcmUtZXhpc3RpbmcgY29tbWFuZHMuIEhlcmUgaXMgYW4gZXhhbXBsZVxcbm9mIEphdmFTY3JpcHQgYWJicmV2aWF0aW9uc1xcbn5+IWpzOmZ+flxcbn5+IWpzOmlmfn5cXG4gIH5+IWpzOmxvZ35+XCJ+fiFoZWxsb35+XCJ+fiEvanM6bG9nfn5cXG5+fiEvanM6aWZ+flxcbn5+IS9qczpmfn5cXG5cXG5Db2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXFxucHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuIEVtbWV0IGFiYnJldmlhdGlvbnMgd2lsbCBiZSBcXG51c2VkIGF1dG9tYXRpY2FsbHkgaWYgeW91IGFyZSBpbiBhIEhUTUwgb3IgQ1NTIGZpbGUuXFxufn4hdWw+bGl+fiAoaWYgeW91IGFyZSBpbiBhIGh0bWwgZG9jY3VtZW50KVxcbn5+IWVtbWV0IHVsPmxpfn5cXG5+fiFlbW1ldCBtMiBjc3N+flxcblxcbkNvbW1hbmRzIGFyZSBzdG9yZWQgaW4gbmFtZXNwYWNlcy4gVGhlIHNhbWUgY29tbWFuZCBjYW4gaGF2ZSBcXG5kaWZmZXJlbnQgcmVzdWx0cyBkZXBlbmRpbmcgb24gdGhlIG5hbWVzcGFjZS5cXG5+fiFqczplYWNofn5cXG5+fiFwaHA6b3V0ZXI6ZWFjaH5+XFxufn4hcGhwOmlubmVyOmVhY2h+flxcblxcblNvbWUgb2YgdGhlIG5hbWVzcGFjZXMgYXJlIGFjdGl2ZSBkZXBlbmRpbmcgb24gdGhlIGNvbnRleHQuIFRoZVxcbmZvbGxvd2luZyBjb21tYW5kcyBhcmUgdGhlIHNhbWUgYW5kIHdpbGwgZGlzcGxheSB0aGUgY3VycmVudGx5XFxuYWN0aXZlIG5hbWVzcGFjZS4gVGhlIGZpcnN0IGNvbW1hbmQgY29tbWFuZCB3b3JrcyBiZWNhdXNlIHRoZSBcXG5jb3JlIG5hbWVzcGFjZSBpcyBhY3RpdmUuXFxufn4hbmFtZXNwYWNlfn5cXG5+fiFjb3JlOm5hbWVzcGFjZX5+XFxuXFxuWW91IGNhbiBtYWtlIGEgbmFtZXNwYWNlIGFjdGl2ZSB3aXRoIHRoZSBmb2xsb3dpbmcgY29tbWFuZC5cXG5+fiFuYW1lc3BhY2UgcGhwfn5cXG5cXG5DaGVjayB0aGUgbmFtZXNwYWNlcyBhZ2Fpblxcbn5+IW5hbWVzcGFjZX5+XFxuXFxuSW4gYWRkaXRpb24gdG8gZGV0ZWN0aW5nIHRoZSBkb2N1bWVudCB0eXBlLCBDb2Rld2F2ZSBjYW4gZGV0ZWN0IHRoZVxcbmNvbnRleHQgZnJvbSB0aGUgc3Vycm91bmRpbmcgdGV4dC4gSW4gYSBQSFAgZmlsZSwgaXQgbWVhbnMgQ29kZXdhdmUgXFxud2lsbCBhZGQgdGhlIFBIUCB0YWdzIHdoZW4geW91IG5lZWQgdGhlbS5cXG5cXG5+fi9xdW90ZV9jYXJyZXR+flxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZW1vOiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpoZWxwOmdldF9zdGFydGVkJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZWRpdGluZzoge1xuICAgICAgICAgICAgY21kczoge1xuICAgICAgICAgICAgICBpbnRybzoge1xuICAgICAgICAgICAgICAgIHJlc3VsdDogJ0NvZGV3YXZlIGFsbG93cyB5b3UgdG8gbWFrZSB5b3VyIG93biBjb21tYW5kcyAob3IgYWJicmV2aWF0aW9ucykgXFxucHV0IHlvdXIgY29udGVudCBpbnNpZGUgXCJzb3VyY2VcIiB0aGUgZG8gXCJzYXZlXCIuIFRyeSBhZGRpbmcgYW55IFxcbnRleHQgdGhhdCBpcyBvbiB5b3VyIG1pbmQuXFxufn4hZWRpdCBteV9uZXdfY29tbWFuZHx+flxcblxcbklmIHlvdSBkaWQgdGhlIGxhc3Qgc3RlcCByaWdodCwgeW91IHNob3VsZCBzZWUgeW91ciB0ZXh0IHdoZW4geW91XFxuZG8gdGhlIGZvbGxvd2luZyBjb21tYW5kLiBJdCBpcyBub3cgc2F2ZWQgYW5kIHlvdSBjYW4gdXNlIGl0IFxcbndoZW5ldmVyIHlvdSB3YW50Llxcbn5+IW15X25ld19jb21tYW5kfn4nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXBsYWNlQm94OiB0cnVlLFxuICAgICAgICAgICAgcmVzdWx0OiBcIn5+Ym94fn5cXG5+fmhlbHA6ZWRpdGluZzppbnRyb35+XFxuXFxuQWxsIHRoZSB3aW5kb3dzIG9mIENvZGV3YXZlIGFyZSBtYWRlIHdpdGggdGhlIGNvbW1hbmQgXFxcImJveFxcXCIuIFxcblRoZXkgYXJlIG1lYW50IHRvIGRpc3BsYXkgdGV4dCB0aGF0IHNob3VsZCBub3QgcmVtYWluIGluIHlvdXIgY29kZS4gXFxuVGhleSBhcmUgdmFsaWQgY29tbWVudHMgc28gdGhleSB3b24ndCBicmVhayB5b3VyIGNvZGUgYW5kIHRoZSBjb21tYW5kIFxcblxcXCJjbG9zZVxcXCIgY2FuIGJlIHVzZWQgdG8gcmVtb3ZlIHRoZW0gcmFwaWRseS4gWW91IGNhbiBtYWtlIHlvdXIgb3duIFxcbmNvbW1hbmRzIHdpdGggdGhlbSBpZiB5b3UgbmVlZCB0byBkaXNwbGF5IHNvbWUgdGV4dCB0ZW1wb3JhcmlseS5cXG5+fiFib3h+flxcblRoZSBib3ggd2lsbCBzY2FsZSB3aXRoIHRoZSBjb250ZW50IHlvdSBwdXQgaW4gaXRcXG5+fiFjbG9zZXx+flxcbn5+IS9ib3h+flxcblxcbn5+cXVvdGVfY2FycmV0fn5cXG5XaGVuIHlvdSBjcmVhdGUgYSBjb21tYW5kLCB5b3UgbWF5IHdhbnQgdG8gc3BlY2lmeSB3aGVyZSB0aGUgY3Vyc29yIFxcbndpbGwgYmUgbG9jYXRlZCBvbmNlIHRoZSBjb21tYW5kIGlzIGV4cGFuZGVkLiBUbyBkbyB0aGF0LCB1c2UgYSBcXFwifFxcXCIgXFxuKFZlcnRpY2FsIGJhcikuIFVzZSAyIG9mIHRoZW0gaWYgeW91IHdhbnQgdG8gcHJpbnQgdGhlIGFjdHVhbCBcXG5jaGFyYWN0ZXIuXFxufn4hYm94fn5cXG5vbmUgOiB8IFxcbnR3byA6IHx8XFxufn4hL2JveH5+XFxuXFxuWW91IGNhbiBhbHNvIHVzZSB0aGUgXFxcImVzY2FwZV9waXBlc1xcXCIgY29tbWFuZCB0aGF0IHdpbGwgZXNjYXBlIGFueSBcXG52ZXJ0aWNhbCBiYXJzIHRoYXQgYXJlIGJldHdlZW4gaXRzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnc1xcbn5+IWVzY2FwZV9waXBlc35+XFxufFxcbn5+IS9lc2NhcGVfcGlwZXN+flxcblxcbkNvbW1hbmRzIGluc2lkZSBvdGhlciBjb21tYW5kcyB3aWxsIGJlIGV4cGFuZGVkIGF1dG9tYXRpY2FsbHkuXFxuSWYgeW91IHdhbnQgdG8gcHJpbnQgYSBjb21tYW5kIHdpdGhvdXQgaGF2aW5nIGl0IGV4cGFuZCB3aGVuIFxcbnRoZSBwYXJlbnQgY29tbWFuZCBpcyBleHBhbmRlZCwgdXNlIGEgXFxcIiFcXFwiIChleGNsYW1hdGlvbiBtYXJrKS5cXG5+fiEhaGVsbG9+flxcblxcbkZvciBjb21tYW5kcyB0aGF0IGhhdmUgYm90aCBhbiBvcGVuaW5nIGFuZCBhIGNsb3NpbmcgdGFnLCB5b3UgY2FuIHVzZVxcbnRoZSBcXFwiY29udGVudFxcXCIgY29tbWFuZC4gXFxcImNvbnRlbnRcXFwiIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGV4dFxcbnRoYXQgaXMgYmV0d2VlbiB0aGUgdGFncy4gSGVyZSBpcyBhbiBleGFtcGxlIG9mIGhvdyBpdCBjYW4gYmUgdXNlZC5cXG5+fiFlZGl0IHBocDppbm5lcjppZn5+XFxuXFxufn4vcXVvdGVfY2FycmV0fn5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVkaXQ6IHtcbiAgICAgICAgICAgIGFsaWFzT2Y6ICdjb3JlOmhlbHA6ZWRpdGluZydcbiAgICAgICAgICB9LFxuICAgICAgICAgIG5vdF9mb3VuZDogJ35+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBub19leGVjdXRlOiB7XG4gICAgICAgIHJlc3VsdDogbm9FeGVjdXRlLFxuICAgICAgICBoZWxwOiAnUHJldmVudCBldmVyeXRoaW5nIGluc2lkZSB0aGUgb3BlbiBhbmQgY2xvc2UgdGFnIGZyb20gZXhlY3V0aW5nJ1xuICAgICAgfSxcbiAgICAgIGVzY2FwZV9waXBlczoge1xuICAgICAgICByZXN1bHQ6IHF1b3RlQ2FycmV0LFxuICAgICAgICBjaGVja0NhcnJldDogZmFsc2UsXG4gICAgICAgIGhlbHA6ICdFc2NhcGUgYWxsIGNhcnJldHMgKGZyb20gXCJ8XCIgdG8gXCJ8fFwiKSdcbiAgICAgIH0sXG4gICAgICBxdW90ZV9jYXJyZXQ6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6ZXNjYXBlX3BpcGVzJ1xuICAgICAgfSxcbiAgICAgIGV4ZWNfcGFyZW50OiB7XG4gICAgICAgIGV4ZWN1dGU6IGV4ZWNQYXJlbnQsXG4gICAgICAgIGhlbHA6IFwiRXhlY3V0ZSB0aGUgZmlyc3QgY29tbWFuZCB0aGF0IHdyYXAgdGhpcyBpbiBpdCdzIG9wZW4gYW5kIGNsb3NlIHRhZ1wiXG4gICAgICB9LFxuICAgICAgY29udGVudDoge1xuICAgICAgICByZXN1bHQ6IGdldENvbnRlbnQsXG4gICAgICAgIGhlbHA6ICdNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIHdoYXQgd2FzIGJldHdlZW4gdGhlIG9wZW4gYW5kIGNsb3NlIHRhZyBvZiBhIGNvbW1hbmQnXG4gICAgICB9LFxuICAgICAgYm94OiB7XG4gICAgICAgIGNsczogQm94Q21kLFxuICAgICAgICBoZWxwOiBcIkNyZWF0ZSB0aGUgYXBwYXJlbmNlIG9mIGEgYm94IGNvbXBvc2VkIGZyb20gY2hhcmFjdGVycy4gXFxuVXN1YWxseSB3cmFwcGVkIGluIGEgY29tbWVudC5cXG5cXG5UaGUgYm94IHdpbGwgdHJ5IHRvIGFqdXN0IGl0J3Mgc2l6ZSBmcm9tIHRoZSBjb250ZW50XCJcbiAgICAgIH0sXG4gICAgICBjbG9zZToge1xuICAgICAgICBjbHM6IENsb3NlQ21kLFxuICAgICAgICBoZWxwOiAnV2lsbCBjbG9zZSB0aGUgZmlyc3QgYm94IGFyb3VuZCB0aGlzJ1xuICAgICAgfSxcbiAgICAgIHBhcmFtOiB7XG4gICAgICAgIHJlc3VsdDogZ2V0UGFyYW0sXG4gICAgICAgIGhlbHA6ICdNYWlubHkgdXNlZCBmb3IgY29tbWFuZCBlZGl0aW9uLCBcXG50aGlzIHdpbGwgcmV0dXJuIGEgcGFyYW1ldGVyIGZyb20gdGhpcyBjb21tYW5kIGNhbGxcXG5cXG5Zb3UgY2FuIHBhc3MgYSBudW1iZXIsIGEgc3RyaW5nLCBvciBib3RoLiBcXG5BIG51bWJlciBmb3IgYSBwb3NpdGlvbmVkIGFyZ3VtZW50IGFuZCBhIHN0cmluZ1xcbmZvciBhIG5hbWVkIHBhcmFtZXRlcidcbiAgICAgIH0sXG4gICAgICBlZGl0OiB7XG4gICAgICAgIGNtZHM6IEVkaXRDbWQuc2V0Q21kcyh7XG4gICAgICAgICAgc2F2ZToge1xuICAgICAgICAgICAgYWxpYXNPZjogJ2NvcmU6ZXhlY19wYXJlbnQnXG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgY2xzOiBFZGl0Q21kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnY21kJ10sXG4gICAgICAgIGhlbHA6ICdBbGxvd3MgdG8gZWRpdCBhIGNvbW1hbmQuIFxcblNlZSB+fiFoZWxwOmVkaXRpbmd+fiBmb3IgYSBxdWljayB0dXRvcmlhbCdcbiAgICAgIH0sXG4gICAgICByZW5hbWU6IHtcbiAgICAgICAgY21kczoge1xuICAgICAgICAgIG5vdF9hcHBsaWNhYmxlOiAnfn5ib3h+flxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+JyxcbiAgICAgICAgICBub3RfZm91bmQ6ICd+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgICB9LFxuICAgICAgICByZXN1bHQ6IHJlbmFtZUNvbW1hbmQsXG4gICAgICAgIHBhcnNlOiB0cnVlLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnZnJvbScsICd0byddLFxuICAgICAgICBoZWxwOiBcIkFsbG93cyB0byByZW5hbWUgYSBjb21tYW5kIGFuZCBjaGFuZ2UgaXQncyBuYW1lc3BhY2UuIFxcbllvdSBjYW4gb25seSByZW5hbWUgY29tbWFuZHMgdGhhdCB5b3UgY3JlYXRlZCB5b3Vyc2VsZi5cXG4tIFRoZSBmaXJzdCBwYXJhbSBpcyB0aGUgb2xkIG5hbWVcXG4tIFRoZW4gc2Vjb25kIHBhcmFtIGlzIHRoZSBuZXcgbmFtZSwgaWYgaXQgaGFzIG5vIG5hbWVzcGFjZSxcXG4gIGl0IHdpbGwgdXNlIHRoZSBvbmUgZnJvbSB0aGUgb3JpZ2luYWwgY29tbWFuZC5cXG5cXG5leC46IH5+IXJlbmFtZSBteV9jb21tYW5kIG15X2NvbW1hbmQyfn5cIlxuICAgICAgfSxcbiAgICAgIHJlbW92ZToge1xuICAgICAgICBjbWRzOiB7XG4gICAgICAgICAgbm90X2FwcGxpY2FibGU6ICd+fmJveH5+XFxuWW91IGNhbiBvbmx5IHJlbW92ZSBjb21tYW5kcyB0aGF0IHlvdSBjcmVhdGVkIHlvdXJzZWxmLlxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nLFxuICAgICAgICAgIG5vdF9mb3VuZDogJ35+Ym94fn5cXG5Db21tYW5kIG5vdCBmb3VuZFxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn4nXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdDogcmVtb3ZlQ29tbWFuZCxcbiAgICAgICAgcGFyc2U6IHRydWUsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydjbWQnXSxcbiAgICAgICAgaGVscDogJ0FsbG93cyB0byByZW1vdmUgYSBjb21tYW5kLiBcXG5Zb3UgY2FuIG9ubHkgcmVtb3ZlIGNvbW1hbmRzIHRoYXQgeW91IGNyZWF0ZWQgeW91cnNlbGYuJ1xuICAgICAgfSxcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIGNtZHM6IHtcbiAgICAgICAgICBub3RfZm91bmQ6ICd+fmJveH5+XFxuQ29tbWFuZCBub3QgZm91bmRcXG5+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgICB9LFxuICAgICAgICByZXN1bHQ6IGFsaWFzQ29tbWFuZCxcbiAgICAgICAgcGFyc2U6IHRydWVcbiAgICAgIH0sXG4gICAgICBuYW1lc3BhY2U6IHtcbiAgICAgICAgY2xzOiBOYW1lU3BhY2VDbWQsXG4gICAgICAgIGhlbHA6ICdTaG93IHRoZSBjdXJyZW50IG5hbWVzcGFjZXMuXFxuXFxuQSBuYW1lIHNwYWNlIGNvdWxkIGJlIHRoZSBuYW1lIG9mIHRoZSBsYW5ndWFnZVxcbm9yIG90aGVyIGtpbmQgb2YgY29udGV4dHNcXG5cXG5JZiB5b3UgcGFzcyBhIHBhcmFtIHRvIHRoaXMgY29tbWFuZCwgaXQgd2lsbCBcXG5hZGQgdGhlIHBhcmFtIGFzIGEgbmFtZXNwYWNlIGZvciB0aGUgY3VycmVudCBlZGl0b3InXG4gICAgICB9LFxuICAgICAgbnNwYzoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTpuYW1lc3BhY2UnXG4gICAgICB9LFxuICAgICAgbGlzdDoge1xuICAgICAgICByZXN1bHQ6IGxpc3RDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZScsICdib3gnLCAnY29udGV4dCddLFxuICAgICAgICByZXBsYWNlQm94OiB0cnVlLFxuICAgICAgICBwYXJzZTogdHJ1ZSxcbiAgICAgICAgaGVscDogJ0xpc3QgYXZhaWxhYmxlIGNvbW1hbmRzXFxuXFxuWW91IGNhbiB1c2UgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGNob29zZSBhIHNwZWNpZmljIG5hbWVzcGFjZSwgXFxuYnkgZGVmYXVsdCBhbGwgY3VyZW50IG5hbWVzcGFjZSB3aWxsIGJlIHNob3duJ1xuICAgICAgfSxcbiAgICAgIGxzOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmxpc3QnXG4gICAgICB9LFxuICAgICAgZ2V0OiB7XG4gICAgICAgIHJlc3VsdDogZ2V0Q29tbWFuZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ25hbWUnXSxcbiAgICAgICAgaGVscDogJ291dHB1dCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZSdcbiAgICAgIH0sXG4gICAgICBzZXQ6IHtcbiAgICAgICAgcmVzdWx0OiBzZXRDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnbmFtZScsICd2YWx1ZScsICd2YWwnXSxcbiAgICAgICAgaGVscDogJ3NldCB0aGUgdmFsdWUgb2YgYSB2YXJpYWJsZSdcbiAgICAgIH0sXG4gICAgICBzdG9yZV9qc29uOiB7XG4gICAgICAgIHJlc3VsdDogc3RvcmVKc29uQ29tbWFuZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ25hbWUnLCAnanNvbiddLFxuICAgICAgICBoZWxwOiAnc2V0IGEgdmFyaWFibGUgd2l0aCBzb21lIGpzb24gZGF0YSdcbiAgICAgIH0sXG4gICAgICBqc29uOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOnN0b3JlX2pzb24nXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgY2xzOiBUZW1wbGF0ZUNtZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ25hbWUnLCAnc2VwJ10sXG4gICAgICAgIGhlbHA6ICdyZW5kZXIgYSB0ZW1wbGF0ZSBmb3IgYSB2YXJpYWJsZVxcblxcbklmIHRoZSBmaXJzdCBwYXJhbSBpcyBub3Qgc2V0IGl0IHdpbGwgdXNlIGFsbCB2YXJpYWJsZXMgXFxuZm9yIHRoZSByZW5kZXJcXG5JZiB0aGUgdmFyaWFibGUgaXMgYW4gYXJyYXkgdGhlIHRlbXBsYXRlIHdpbGwgYmUgcmVwZWF0ZWQgXFxuZm9yIGVhY2ggaXRlbXNcXG5UaGUgYHNlcGAgcGFyYW0gZGVmaW5lIHdoYXQgd2lsbCBzZXBhcmF0ZSBlYWNoIGl0ZW0gXFxuYW5kIGRlZmF1bHQgdG8gYSBsaW5lIGJyZWFrJ1xuICAgICAgfSxcbiAgICAgIGVtbWV0OiB7XG4gICAgICAgIGNsczogRW1tZXRDbWQsXG4gICAgICAgIGhlbHA6ICdDb2RlV2F2ZSBjb21lcyB3aXRoIHRoZSBleGNlbGxlbnQgRW1tZXQgKCBodHRwOi8vZW1tZXQuaW8vICkgdG8gXFxucHJvdmlkZSBldmVudCBtb3JlIGFiYnJldmlhdGlvbnMuXFxuXFxuUGFzcyB0aGUgRW1tZXQgYWJicmV2aWF0aW9uIGFzIGEgcGFyYW0gdG8gZXhwZW5kIGl0LidcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5leHBvcnRzLkNvcmVDb21tYW5kUHJvdmlkZXIgPSBDb3JlQ29tbWFuZFByb3ZpZGVyXG5cbmhlbHAgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGNtZCwgY21kTmFtZSwgaGVscENtZCwgc3ViY29tbWFuZHMsIHRleHRcbiAgY21kTmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pXG5cbiAgaWYgKGNtZE5hbWUgIT0gbnVsbCkge1xuICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKGNtZE5hbWUpXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGhlbHBDbWQgPSBjbWQuZ2V0Q21kKCdoZWxwJylcbiAgICAgIHRleHQgPSBoZWxwQ21kID8gYH5+JHtoZWxwQ21kLmZ1bGxOYW1lfX5+YCA6ICdUaGlzIGNvbW1hbmQgaGFzIG5vIGhlbHAgdGV4dCdcbiAgICAgIHN1YmNvbW1hbmRzID0gY21kLmNtZHMubGVuZ3RoID8gYFxcblN1Yi1Db21tYW5kcyA6XFxufn5scyAke2NtZC5mdWxsTmFtZX0gYm94Om5vIGNvbnRleHQ6bm9+fmAgOiAnJ1xuICAgICAgcmV0dXJuIGB+fmJveH5+XFxuSGVscCBmb3Igfn4hJHtjbWQuZnVsbE5hbWV9fn4gOlxcblxcbiR7dGV4dH1cXG4ke3N1YmNvbW1hbmRzfVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnfn5ub3RfZm91bmR+fidcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICd+fmhlbHA6b3ZlcnZpZXd+fidcbiAgfVxufVxuXG5jb25zdCBub0V4ZWN1dGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIHJlZ1xuICByZWcgPSBuZXcgUmVnRXhwKCdeKCcgKyBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKGluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHMpICsgJyknICsgU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChpbnN0YW5jZS5jb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyKSlcbiAgcmV0dXJuIGluc3RhbmNlLnN0ci5yZXBsYWNlKHJlZywgJyQxJylcbn1cblxuY29uc3QgcXVvdGVDYXJyZXQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgcmV0dXJuIGluc3RhbmNlLmNvbnRlbnQucmVwbGFjZSgvXFx8L2csICd8fCcpXG59XG5cbmNvbnN0IGV4ZWNQYXJlbnQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIHJlc1xuXG4gIGlmIChpbnN0YW5jZS5wYXJlbnQgIT0gbnVsbCkge1xuICAgIHJlcyA9IGluc3RhbmNlLnBhcmVudC5leGVjdXRlKClcbiAgICBpbnN0YW5jZS5yZXBsYWNlU3RhcnQgPSBpbnN0YW5jZS5wYXJlbnQucmVwbGFjZVN0YXJ0XG4gICAgaW5zdGFuY2UucmVwbGFjZUVuZCA9IGluc3RhbmNlLnBhcmVudC5yZXBsYWNlRW5kXG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5cbmdldENvbnRlbnQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgY29uc3QgYWZmaXhlc0VtcHR5ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydhZmZpeGVzX2VtcHR5J10sIGZhbHNlKVxuICBjb25zdCBwcmVmaXggPSBpbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJylcbiAgY29uc3Qgc3VmZml4ID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydzdWZmaXgnXSwgJycpXG5cbiAgaWYgKGluc3RhbmNlLmNvZGV3YXZlLmluSW5zdGFuY2UgIT0gbnVsbCkge1xuICAgIHJldHVybiBwcmVmaXggKyAoaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5jb250ZW50IHx8ICcnKSArIHN1ZmZpeFxuICB9XG5cbiAgaWYgKGFmZml4ZXNFbXB0eSkge1xuICAgIHJldHVybiBwcmVmaXggKyBzdWZmaXhcbiAgfVxufVxuXG5yZW5hbWVDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIGNvbnN0IHN0b3JhZ2UgPSBDb21tYW5kLnN0b3JhZ2VcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgIHJldHVybiBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICB9KS50aGVuKHNhdmVkQ21kcyA9PiB7XG4gICAgdmFyIGNtZCwgY21kRGF0YSwgbmV3TmFtZSwgb3JpZ25pbmFsTmFtZVxuICAgIG9yaWduaW5hbE5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2Zyb20nXSlcbiAgICBuZXdOYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICd0byddKVxuXG4gICAgaWYgKG9yaWduaW5hbE5hbWUgIT0gbnVsbCAmJiBuZXdOYW1lICE9IG51bGwpIHtcbiAgICAgIGNtZCA9IGluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0Q21kKG9yaWduaW5hbE5hbWUpXG5cbiAgICAgIGlmIChzYXZlZENtZHNbb3JpZ25pbmFsTmFtZV0gIT0gbnVsbCAmJiBjbWQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoIShuZXdOYW1lLmluZGV4T2YoJzonKSA+IC0xKSkge1xuICAgICAgICAgIG5ld05hbWUgPSBjbWQuZnVsbE5hbWUucmVwbGFjZShvcmlnbmluYWxOYW1lLCAnJykgKyBuZXdOYW1lXG4gICAgICAgIH1cblxuICAgICAgICBjbWREYXRhID0gc2F2ZWRDbWRzW29yaWduaW5hbE5hbWVdXG5cbiAgICAgICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEobmV3TmFtZSwgY21kRGF0YSlcblxuICAgICAgICBjbWQudW5yZWdpc3RlcigpXG4gICAgICAgIHNhdmVkQ21kc1tuZXdOYW1lXSA9IGNtZERhdGFcbiAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tvcmlnbmluYWxOYW1lXVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHN0b3JhZ2Uuc2F2ZSgnY21kcycsIHNhdmVkQ21kcylcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuICcnXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnfn5ub3RfYXBwbGljYWJsZX5+J1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICd+fm5vdF9mb3VuZH5+J1xuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxucmVtb3ZlQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgY29uc3QgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pXG4gICAgY29uc3Qgc3RvcmFnZSA9IENvbW1hbmQuc3RvcmFnZVxuXG4gICAgaWYgKG5hbWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICAgIH0pLnRoZW4oc2F2ZWRDbWRzID0+IHtcbiAgICAgICAgY29uc3QgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRQYXJlbnRPclJvb3QoKS5nZXRDbWQobmFtZSlcblxuICAgICAgICBpZiAoc2F2ZWRDbWRzW25hbWVdICE9IG51bGwgJiYgY21kICE9IG51bGwpIHtcbiAgICAgICAgICBjbWQudW5yZWdpc3RlcigpXG4gICAgICAgICAgZGVsZXRlIHNhdmVkQ21kc1tuYW1lXVxuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yYWdlLnNhdmUoJ2NtZHMnLCBzYXZlZENtZHMpXG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKGNtZCAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuICd+fm5vdF9hcHBsaWNhYmxlfn4nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICd+fm5vdF9mb3VuZH5+J1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcbn1cblxuYWxpYXNDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBhbGlhcywgY21kLCBuYW1lXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgYWxpYXMgPSBpbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2FsaWFzJ10pXG5cbiAgaWYgKG5hbWUgIT0gbnVsbCAmJiBhbGlhcyAhPSBudWxsKSB7XG4gICAgY21kID0gaW5zdGFuY2UuY29udGV4dC5nZXRDbWQobmFtZSlcblxuICAgIGlmIChjbWQgIT0gbnVsbCkge1xuICAgICAgY21kID0gY21kLmdldEFsaWFzZWQoKSB8fCBjbWQgLy8gdW5sZXNzIGFsaWFzLmluZGV4T2YoJzonKSA+IC0xXG4gICAgICAvLyBhbGlhcyA9IGNtZC5mdWxsTmFtZS5yZXBsYWNlKG5hbWUsJycpICsgYWxpYXNcblxuICAgICAgQ29tbWFuZC5zYXZlQ21kKGFsaWFzLCB7XG4gICAgICAgIGFsaWFzT2Y6IGNtZC5mdWxsTmFtZVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnfn5ub3RfZm91bmR+fidcbiAgICB9XG4gIH1cbn1cblxubGlzdENvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGJveCwgY29tbWFuZHMsIGNvbnRleHQsIG5hbWUsIG5hbWVzcGFjZXMsIHRleHQsIHVzZUNvbnRleHRcbiAgYm94ID0gaW5zdGFuY2UuZ2V0Qm9vbFBhcmFtKFsnYm94J10sIHRydWUpXG4gIHVzZUNvbnRleHQgPSBpbnN0YW5jZS5nZXRCb29sUGFyYW0oWydjb250ZXh0J10sIHRydWUpXG4gIG5hbWUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgbmFtZXNwYWNlcyA9IG5hbWUgPyBbbmFtZV0gOiBpbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKS5maWx0ZXIobnNwYyA9PiB7XG4gICAgcmV0dXJuIG5zcGMgIT09IGluc3RhbmNlLmNtZC5mdWxsTmFtZVxuICB9KS5jb25jYXQoJ19yb290JylcbiAgY29udGV4dCA9IHVzZUNvbnRleHQgPyBpbnN0YW5jZS5jb250ZXh0LmdldFBhcmVudE9yUm9vdCgpIDogaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHRcbiAgY29tbWFuZHMgPSBuYW1lc3BhY2VzLnJlZHVjZSgoY29tbWFuZHMsIG5zcGMpID0+IHtcbiAgICB2YXIgY21kXG4gICAgY21kID0gbnNwYyA9PT0gJ19yb290JyA/IENvbW1hbmQuY21kcyA6IGNvbnRleHQuZ2V0Q21kKG5zcGMsIHtcbiAgICAgIG11c3RFeGVjdXRlOiBmYWxzZVxuICAgIH0pXG5cbiAgICBpZiAoY21kICE9IG51bGwpIHtcbiAgICAgIGNtZC5pbml0KClcblxuICAgICAgaWYgKGNtZC5jbWRzKSB7XG4gICAgICAgIGNvbW1hbmRzID0gY29tbWFuZHMuY29uY2F0KGNtZC5jbWRzKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb21tYW5kc1xuICB9LCBbXSlcbiAgdGV4dCA9IGNvbW1hbmRzLmxlbmd0aCA/IGNvbW1hbmRzLm1hcChjbWQgPT4ge1xuICAgIGNtZC5pbml0KClcbiAgICByZXR1cm4gKGNtZC5pc0V4ZWN1dGFibGUoKSA/ICd+fiEnIDogJ35+IWxzICcpICsgY21kLmZ1bGxOYW1lICsgJ35+J1xuICB9KS5qb2luKCdcXG4nKSA6ICdUaGlzIGNvbnRhaW5zIG5vIHN1Yi1jb21tYW5kcydcblxuICBpZiAoYm94KSB7XG4gICAgcmV0dXJuIGB+fmJveH5+XFxuJHt0ZXh0fVxcblxcbn5+IWNsb3NlfH5+XFxufn4vYm94fn5gXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRleHRcbiAgfVxufVxuXG5nZXRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCByZXNcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKVxuICByZXMgPSBQYXRoSGVscGVyLmdldFBhdGgoaW5zdGFuY2UuY29kZXdhdmUudmFycywgbmFtZSlcblxuICBpZiAodHlwZW9mIHJlcyA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAnICAnKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiByZXNcbiAgfVxufVxuXG5zZXRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBuYW1lLCBwLCB2YWxcbiAgbmFtZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnbmFtZSddKVxuICB2YWwgPSAocCA9IGluc3RhbmNlLmdldFBhcmFtKFsxLCAndmFsdWUnLCAndmFsJ10pKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogbnVsbFxuXG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lLCB2YWwpXG5cbiAgcmV0dXJuICcnXG59XG5cbnN0b3JlSnNvbkNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIG5hbWUsIHAsIHZhbFxuICBuYW1lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICduYW1lJ10pXG4gIHZhbCA9IChwID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzEsICdqc29uJ10pKSAhPSBudWxsID8gcCA6IGluc3RhbmNlLmNvbnRlbnQgPyBpbnN0YW5jZS5jb250ZW50IDogbnVsbFxuXG4gIFBhdGhIZWxwZXIuc2V0UGF0aChpbnN0YW5jZS5jb2Rld2F2ZS52YXJzLCBuYW1lLCBKU09OLnBhcnNlKHZhbCkpXG5cbiAgcmV0dXJuICcnXG59XG5cbmdldFBhcmFtID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIGlmIChpbnN0YW5jZS5jb2Rld2F2ZS5pbkluc3RhbmNlICE9IG51bGwpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuY29kZXdhdmUuaW5JbnN0YW5jZS5nZXRQYXJhbShpbnN0YW5jZS5wYXJhbXMsIGluc3RhbmNlLmdldFBhcmFtKFsnZGVmJywgJ2RlZmF1bHQnXSkpXG4gIH1cbn1cblxuQm94Q21kID0gY2xhc3MgQm94Q21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0ICgpIHtcbiAgICB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KVxuICAgIHRoaXMuY21kID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ2NtZCddKVxuXG4gICAgaWYgKHRoaXMuY21kICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaGVscGVyLm9wZW5UZXh0ID0gdGhpcy5pbnN0YW5jZS5jb2Rld2F2ZS5icmFrZXRzICsgdGhpcy5jbWQgKyB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmJyYWtldHNcbiAgICAgIHRoaXMuaGVscGVyLmNsb3NlVGV4dCA9IHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0cyArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuY2xvc2VDaGFyICsgdGhpcy5jbWQuc3BsaXQoJyAnKVswXSArIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuYnJha2V0c1xuICAgIH1cblxuICAgIHRoaXMuaGVscGVyLmRlY28gPSB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLmRlY29cbiAgICB0aGlzLmhlbHBlci5wYWQgPSAyXG4gICAgdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJylcbiAgICB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKVxuICB9XG5cbiAgaGVpZ2h0ICgpIHtcbiAgICB2YXIgaGVpZ2h0LCBwYXJhbXNcblxuICAgIGlmICh0aGlzLmJvdW5kcygpICE9IG51bGwpIHtcbiAgICAgIGhlaWdodCA9IHRoaXMuYm91bmRzKCkuaGVpZ2h0XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IDNcbiAgICB9XG5cbiAgICBwYXJhbXMgPSBbJ2hlaWdodCddXG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZS5wYXJhbXMubGVuZ3RoID4gMSkge1xuICAgICAgcGFyYW1zLnB1c2goMSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5zdGFuY2UucGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy5wdXNoKDApXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCBoZWlnaHQpXG4gIH1cblxuICB3aWR0aCAoKSB7XG4gICAgdmFyIHBhcmFtcywgd2lkdGhcblxuICAgIGlmICh0aGlzLmJvdW5kcygpICE9IG51bGwpIHtcbiAgICAgIHdpZHRoID0gdGhpcy5ib3VuZHMoKS53aWR0aFxuICAgIH0gZWxzZSB7XG4gICAgICB3aWR0aCA9IDNcbiAgICB9XG5cbiAgICBwYXJhbXMgPSBbJ3dpZHRoJ11cblxuICAgIGlmICh0aGlzLmluc3RhbmNlLnBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICBwYXJhbXMucHVzaCgwKVxuICAgIH1cblxuICAgIHJldHVybiBNYXRoLm1heCh0aGlzLm1pbldpZHRoKCksIHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0ocGFyYW1zLCB3aWR0aCkpXG4gIH1cblxuICBib3VuZHMgKCkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQpIHtcbiAgICAgIGlmICh0aGlzLl9ib3VuZHMgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9ib3VuZHMgPSB0aGlzLmhlbHBlci50ZXh0Qm91bmRzKHRoaXMuaW5zdGFuY2UuY29udGVudClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kc1xuICAgIH1cbiAgfVxuXG4gIHJlc3VsdCAoKSB7XG4gICAgdGhpcy5oZWxwZXIuaGVpZ2h0ID0gdGhpcy5oZWlnaHQoKVxuICAgIHRoaXMuaGVscGVyLndpZHRoID0gdGhpcy53aWR0aCgpXG4gICAgcmV0dXJuIHRoaXMuaGVscGVyLmRyYXcodGhpcy5pbnN0YW5jZS5jb250ZW50KVxuICB9XG5cbiAgbWluV2lkdGggKCkge1xuICAgIGlmICh0aGlzLmNtZCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbWQubGVuZ3RoXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwXG4gICAgfVxuICB9XG59XG5DbG9zZUNtZCA9IGNsYXNzIENsb3NlQ21kIGV4dGVuZHMgQmFzZUNvbW1hbmQge1xuICBpbml0ICgpIHtcbiAgICB0aGlzLmhlbHBlciA9IG5ldyBCb3hIZWxwZXIodGhpcy5pbnN0YW5jZS5jb250ZXh0KVxuICB9XG5cbiAgZXhlY3V0ZSAoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gdGhpcy5oZWxwZXIucHJlZml4ID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbJ3ByZWZpeCddLCAnJylcbiAgICBjb25zdCBzdWZmaXggPSB0aGlzLmhlbHBlci5zdWZmaXggPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsnc3VmZml4J10sICcnKVxuICAgIGxldCBib3ggPSB0aGlzLmhlbHBlci5nZXRCb3hGb3JQb3ModGhpcy5pbnN0YW5jZS5nZXRQb3MoKSlcbiAgICBjb25zdCByZXF1aXJlZEFmZml4ZXMgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFsncmVxdWlyZWRfYWZmaXhlcyddLCB0cnVlKVxuXG4gICAgaWYgKCFyZXF1aXJlZEFmZml4ZXMpIHtcbiAgICAgIHRoaXMuaGVscGVyLnByZWZpeCA9IHRoaXMuaGVscGVyLnN1ZmZpeCA9ICcnXG4gICAgICBjb25zdCBib3gyID0gdGhpcy5oZWxwZXIuZ2V0Qm94Rm9yUG9zKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkpXG5cbiAgICAgIGlmIChib3gyICE9IG51bGwgJiYgKGJveCA9PSBudWxsIHx8IGJveC5zdGFydCA8IGJveDIuc3RhcnQgLSBwcmVmaXgubGVuZ3RoIHx8IGJveC5lbmQgPiBib3gyLmVuZCArIHN1ZmZpeC5sZW5ndGgpKSB7XG4gICAgICAgIGJveCA9IGJveDJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYm94ICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IGRlcHRoID0gdGhpcy5oZWxwZXIuZ2V0TmVzdGVkTHZsKHRoaXMuaW5zdGFuY2UuZ2V0UG9zKCkuc3RhcnQpXG5cbiAgICAgIGlmIChkZXB0aCA8IDIpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5pbkJveCA9IG51bGxcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoYm94LnN0YXJ0LCBib3guZW5kLCAnJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlLnJlcGxhY2VXaXRoKCcnKVxuICAgIH1cbiAgfVxufVxuRWRpdENtZCA9IGNsYXNzIEVkaXRDbWQgZXh0ZW5kcyBCYXNlQ29tbWFuZCB7XG4gIGluaXQgKCkge1xuICAgIHZhciByZWZcbiAgICB0aGlzLmNtZE5hbWUgPSB0aGlzLmluc3RhbmNlLmdldFBhcmFtKFswLCAnY21kJ10pXG4gICAgdGhpcy52ZXJiYWxpemUgPSAocmVmID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMV0pKSA9PT0gJ3YnIHx8IHJlZiA9PT0gJ3ZlcmJhbGl6ZSdcblxuICAgIGlmICh0aGlzLmNtZE5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5maW5kZXIgPSB0aGlzLmluc3RhbmNlLmNvbnRleHQuZ2V0UGFyZW50T3JSb290KCkuZ2V0RmluZGVyKHRoaXMuY21kTmFtZSlcbiAgICAgIHRoaXMuZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlXG4gICAgICB0aGlzLmNtZCA9IHRoaXMuZmluZGVyLmZpbmQoKVxuICAgIH1cblxuICAgIHRoaXMuZWRpdGFibGUgPSB0aGlzLmNtZCAhPSBudWxsID8gdGhpcy5jbWQuaXNFZGl0YWJsZSgpIDogdHJ1ZVxuICB9XG5cbiAgcmVzdWx0ICgpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5jb250ZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRXaXRoQ29udGVudCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdFdpdGhvdXRDb250ZW50KClcbiAgICB9XG4gIH1cblxuICByZXN1bHRXaXRoQ29udGVudCAoKSB7XG4gICAgdmFyIGRhdGEsIGksIGxlbiwgcCwgcGFyc2VyLCByZWZcbiAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQodGhpcy5pbnN0YW5jZS5jb250ZW50KVxuICAgIHBhcnNlci5wYXJzZUFsbCgpXG4gICAgZGF0YSA9IHt9XG4gICAgcmVmID0gRWRpdENtZC5wcm9wc1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBwID0gcmVmW2ldXG4gICAgICBwLndyaXRlRm9yKHBhcnNlciwgZGF0YSlcbiAgICB9XG5cbiAgICBDb21tYW5kLnNhdmVDbWQodGhpcy5jbWROYW1lLCBkYXRhKVxuXG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBwcm9wc0Rpc3BsYXkgKCkge1xuICAgIHZhciBjbWRcbiAgICBjbWQgPSB0aGlzLmNtZFxuICAgIHJldHVybiBFZGl0Q21kLnByb3BzLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAuZGlzcGxheShjbWQpXG4gICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gcCAhPSBudWxsXG4gICAgfSkuam9pbignXFxuJylcbiAgfVxuXG4gIHJlc3VsdFdpdGhvdXRDb250ZW50ICgpIHtcbiAgICB2YXIgbmFtZSwgcGFyc2VyXG5cbiAgICBpZiAoIXRoaXMuY21kIHx8IHRoaXMuZWRpdGFibGUpIHtcbiAgICAgIG5hbWUgPSB0aGlzLmNtZCA/IHRoaXMuY21kLmZ1bGxOYW1lIDogdGhpcy5jbWROYW1lXG4gICAgICBwYXJzZXIgPSB0aGlzLmluc3RhbmNlLmdldFBhcnNlckZvclRleHQoYH5+Ym94IGNtZDpcIiR7dGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWV9ICR7bmFtZX1cIn5+XFxuJHt0aGlzLnByb3BzRGlzcGxheSgpfVxcbn5+IXNhdmV+fiB+fiFjbG9zZX5+XFxufn4vYm94fn5gKVxuICAgICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2VcblxuICAgICAgaWYgKHRoaXMudmVyYmFsaXplKSB7XG4gICAgICAgIHJldHVybiBwYXJzZXIuZ2V0VGV4dCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuRWRpdENtZC5zZXRDbWRzID0gZnVuY3Rpb24gKGJhc2UpIHtcbiAgdmFyIGksIGluSW5zdGFuY2UsIGxlbiwgcCwgcmVmXG4gIGluSW5zdGFuY2UgPSBiYXNlLmluX2luc3RhbmNlID0ge1xuICAgIGNtZHM6IHt9XG4gIH1cbiAgcmVmID0gRWRpdENtZC5wcm9wc1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHAgPSByZWZbaV1cbiAgICBwLnNldENtZChpbkluc3RhbmNlLmNtZHMpXG4gIH0gLy8gcC5zZXRDbWQoYmFzZSlcblxuICByZXR1cm4gYmFzZVxufVxuXG5FZGl0Q21kLnByb3BzID0gW25ldyBFZGl0Q21kUHJvcC5SZXZCb29sKCdub19jYXJyZXQnLCB7XG4gIG9wdDogJ2NoZWNrQ2FycmV0J1xufSksIG5ldyBFZGl0Q21kUHJvcC5SZXZCb29sKCdub19wYXJzZScsIHtcbiAgb3B0OiAncGFyc2UnXG59KSwgbmV3IEVkaXRDbWRQcm9wLkJvb2woJ3ByZXZlbnRfcGFyc2VfYWxsJywge1xuICBvcHQ6ICdwcmV2ZW50UGFyc2VBbGwnXG59KSwgbmV3IEVkaXRDbWRQcm9wLkJvb2woJ3JlcGxhY2VfYm94Jywge1xuICBvcHQ6ICdyZXBsYWNlQm94J1xufSksIG5ldyBFZGl0Q21kUHJvcC5TdHJpbmcoJ25hbWVfdG9fcGFyYW0nLCB7XG4gIG9wdDogJ25hbWVUb1BhcmFtJ1xufSksIG5ldyBFZGl0Q21kUHJvcC5TdHJpbmcoJ2FsaWFzX29mJywge1xuICB2YXI6ICdhbGlhc09mJyxcbiAgY2FycmV0OiB0cnVlXG59KSwgbmV3IEVkaXRDbWRQcm9wLlNvdXJjZSgnaGVscCcsIHtcbiAgZnVuY3Q6ICdoZWxwJyxcbiAgc2hvd0VtcHR5OiB0cnVlXG59KSwgbmV3IEVkaXRDbWRQcm9wLlNvdXJjZSgnc291cmNlJywge1xuICB2YXI6ICdyZXN1bHRTdHInLFxuICBkYXRhTmFtZTogJ3Jlc3VsdCcsXG4gIHNob3dFbXB0eTogdHJ1ZSxcbiAgY2FycmV0OiB0cnVlXG59KV1cbk5hbWVTcGFjZUNtZCA9IGNsYXNzIE5hbWVTcGFjZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCAoKSB7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMF0pXG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIHZhciBpLCBsZW4sIG5hbWVzcGFjZXMsIG5zcGMsIHBhcnNlciwgdHh0XG5cbiAgICBpZiAodGhpcy5uYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUuZ2V0Um9vdCgpLmNvbnRleHQuYWRkTmFtZVNwYWNlKHRoaXMubmFtZSlcbiAgICAgIHJldHVybiAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VzID0gdGhpcy5pbnN0YW5jZS5jb250ZXh0LmdldE5hbWVTcGFjZXMoKVxuICAgICAgdHh0ID0gJ35+Ym94fn5cXG4nXG5cbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IG5hbWVzcGFjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbnNwYyA9IG5hbWVzcGFjZXNbaV1cblxuICAgICAgICBpZiAobnNwYyAhPT0gdGhpcy5pbnN0YW5jZS5jbWQuZnVsbE5hbWUpIHtcbiAgICAgICAgICB0eHQgKz0gbnNwYyArICdcXG4nXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdHh0ICs9ICd+fiFjbG9zZXx+flxcbn5+L2JveH5+J1xuICAgICAgcGFyc2VyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJzZXJGb3JUZXh0KHR4dClcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBbGwoKVxuICAgIH1cbiAgfVxufVxuVGVtcGxhdGVDbWQgPSBjbGFzcyBUZW1wbGF0ZUNtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCAoKSB7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ25hbWUnXSlcbiAgICB0aGlzLnNlcCA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyYW0oWydzZXAnXSwgJ1xcbicpXG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIHZhciBkYXRhXG4gICAgZGF0YSA9IHRoaXMubmFtZSA/IFBhdGhIZWxwZXIuZ2V0UGF0aCh0aGlzLmluc3RhbmNlLmNvZGV3YXZlLnZhcnMsIHRoaXMubmFtZSkgOiB0aGlzLmluc3RhbmNlLmNvZGV3YXZlLnZhcnNcblxuICAgIGlmICh0aGlzLmluc3RhbmNlLmNvbnRlbnQgJiYgZGF0YSAhPSBudWxsICYmIGRhdGEgIT09IGZhbHNlKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICByZXR1cm4gZGF0YS5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVGVtcGxhdGUoaXRlbSlcbiAgICAgICAgfSkuam9pbih0aGlzLnNlcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclRlbXBsYXRlKGRhdGEpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRlbXBsYXRlIChkYXRhKSB7XG4gICAgdmFyIHBhcnNlclxuICAgIHBhcnNlciA9IHRoaXMuaW5zdGFuY2UuZ2V0UGFyc2VyRm9yVGV4dCh0aGlzLmluc3RhbmNlLmNvbnRlbnQpXG4gICAgcGFyc2VyLnZhcnMgPSB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhIDoge1xuICAgICAgdmFsdWU6IGRhdGFcbiAgICB9XG4gICAgcGFyc2VyLmNoZWNrQ2FycmV0ID0gZmFsc2VcbiAgICByZXR1cm4gcGFyc2VyLnBhcnNlQWxsKClcbiAgfVxufVxuRW1tZXRDbWQgPSBjbGFzcyBFbW1ldENtZCBleHRlbmRzIEJhc2VDb21tYW5kIHtcbiAgaW5pdCAoKSB7XG4gICAgdGhpcy5hYmJyID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2FiYnInLCAnYWJicmV2aWF0aW9uJ10pXG4gICAgdGhpcy5sYW5nID0gdGhpcy5pbnN0YW5jZS5nZXRQYXJhbShbMSwgJ2xhbmcnLCAnbGFuZ3VhZ2UnXSlcbiAgfVxuXG4gIGdldEVtbWV0ICgpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ICE9PSBudWxsICYmIHdpbmRvdy5lbW1ldCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gd2luZG93LmVtbWV0XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgIT09IG51bGwgJiYgd2luZG93LnNlbGYgIT09IG51bGwgJiYgd2luZG93LnNlbGYuZW1tZXQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5zZWxmLmVtbWV0XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgIT09IG51bGwgJiYgd2luZG93Lmdsb2JhbCAhPT0gbnVsbCAmJiB3aW5kb3cuZ2xvYmFsLmVtbWV0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB3aW5kb3cuZ2xvYmFsLmVtbWV0XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVxdWlyZSAhPT0gbnVsbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHJlcXVpcmUoJ2VtbWV0JylcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UuY29kZXdhdmUubG9nZ2VyLmxvZygnRW1tZXQgaXMgbm90IGF2YWlsYWJsZSwgaXQgbWF5IG5lZWQgdG8gYmUgaW5zdGFsbGVkIG1hbnVhbGx5JylcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIGNvbnN0IGVtbWV0ID0gdGhpcy5nZXRFbW1ldCgpXG5cbiAgICBpZiAoZW1tZXQgIT0gbnVsbCkge1xuICAgICAgLy8gZW1tZXQucmVxdWlyZSgnLi9wYXJzZXIvYWJicmV2aWF0aW9uJykuZXhwYW5kKCd1bD5saScsIHtwYXN0ZWRDb250ZW50Oidsb3JlbSd9KVxuICAgICAgY29uc3QgcmVzID0gZW1tZXQuZXhwYW5kQWJicmV2aWF0aW9uKHRoaXMuYWJiciwgdGhpcy5sYW5nKVxuICAgICAgcmV0dXJuIHJlcy5yZXBsYWNlKC9cXCRcXHswXFx9L2csICd8JylcbiAgICB9XG4gIH1cbn1cbiIsIlxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5Db21tYW5kXG5cbnZhciBkZWxldGVDb21tYW5kLCByZWFkQ29tbWFuZCwgd3JpdGVDb21tYW5kXG52YXIgRmlsZUNvbW1hbmRQcm92aWRlciA9IGNsYXNzIEZpbGVDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlciAoY21kcykge1xuICAgIHZhciBjb3JlXG4gICAgY29yZSA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdmaWxlJykpXG4gICAgcmV0dXJuIGNvcmUuYWRkQ21kcyh7XG4gICAgICByZWFkOiB7XG4gICAgICAgIHJlc3VsdDogcmVhZENvbW1hbmQsXG4gICAgICAgIGFsbG93ZWROYW1lZDogWydmaWxlJ10sXG4gICAgICAgIGhlbHA6ICdyZWFkIHRoZSBjb250ZW50IG9mIGEgZmlsZSdcbiAgICAgIH0sXG4gICAgICB3cml0ZToge1xuICAgICAgICByZXN1bHQ6IHdyaXRlQ29tbWFuZCxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ2ZpbGUnLCAnY29udGVudCddLFxuICAgICAgICBoZWxwOiAnc2F2ZSBpbnRvIGEgZmlsZSdcbiAgICAgIH0sXG4gICAgICBkZWxldGU6IHtcbiAgICAgICAgcmVzdWx0OiBkZWxldGVDb21tYW5kLFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnZmlsZSddLFxuICAgICAgICBoZWxwOiAnZGVsZXRlIGEgZmlsZSdcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5leHBvcnRzLkZpbGVDb21tYW5kUHJvdmlkZXIgPSBGaWxlQ29tbWFuZFByb3ZpZGVyXG5cbnJlYWRDb21tYW5kID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBmaWxlLCBmaWxlU3lzdGVtXG4gIGZpbGVTeXN0ZW0gPSBpbnN0YW5jZS5jb2Rld2F2ZS5nZXRGaWxlU3lzdGVtKClcbiAgZmlsZSA9IGluc3RhbmNlLmdldFBhcmFtKFswLCAnZmlsZSddKVxuXG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0ucmVhZEZpbGUoZmlsZSlcbiAgfVxufVxuXG53cml0ZUNvbW1hbmQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgdmFyIGNvbnRlbnQsIGZpbGUsIGZpbGVTeXN0ZW1cbiAgZmlsZVN5c3RlbSA9IGluc3RhbmNlLmNvZGV3YXZlLmdldEZpbGVTeXN0ZW0oKVxuICBmaWxlID0gaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdmaWxlJ10pXG4gIGNvbnRlbnQgPSBpbnN0YW5jZS5jb250ZW50IHx8IGluc3RhbmNlLmdldFBhcmFtKFsxLCAnY29udGVudCddKVxuXG4gIGlmIChmaWxlU3lzdGVtKSB7XG4gICAgcmV0dXJuIGZpbGVTeXN0ZW0ud3JpdGVGaWxlKGZpbGUsIGNvbnRlbnQpXG4gIH1cbn1cblxuZGVsZXRlQ29tbWFuZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgZmlsZSwgZmlsZVN5c3RlbVxuICBmaWxlU3lzdGVtID0gaW5zdGFuY2UuY29kZXdhdmUuZ2V0RmlsZVN5c3RlbSgpXG4gIGZpbGUgPSBpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ2ZpbGUnXSlcblxuICBpZiAoZmlsZVN5c3RlbSkge1xuICAgIHJldHVybiBmaWxlU3lzdGVtLmRlbGV0ZUZpbGUoZmlsZSlcbiAgfVxufVxuIiwiXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi4vQ29tbWFuZCcpLkNvbW1hbmRcblxudmFyIEh0bWxDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBIdG1sQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIgKGNtZHMpIHtcbiAgICB2YXIgY3NzLCBodG1sXG4gICAgaHRtbCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdodG1sJykpXG4gICAgaHRtbC5hZGRDbWRzKHtcbiAgICAgIGZhbGxiYWNrOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmVtbWV0JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBsYW5nOiAnaHRtbCdcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZVRvUGFyYW06ICdhYmJyJ1xuICAgICAgfVxuICAgIH0pXG4gICAgY3NzID0gY21kcy5hZGRDbWQobmV3IENvbW1hbmQoJ2NzcycpKVxuICAgIHJldHVybiBjc3MuYWRkQ21kcyh7XG4gICAgICBmYWxsYmFjazoge1xuICAgICAgICBhbGlhc09mOiAnY29yZTplbW1ldCcsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgbGFuZzogJ2NzcydcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZVRvUGFyYW06ICdhYmJyJ1xuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbmV4cG9ydHMuSHRtbENvbW1hbmRQcm92aWRlciA9IEh0bWxDb21tYW5kUHJvdmlkZXJcbiIsIlxuY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4uL0NvbW1hbmQnKS5Db21tYW5kXG5cbnZhciBKc0NvbW1hbmRQcm92aWRlciA9IGNsYXNzIEpzQ29tbWFuZFByb3ZpZGVyIHtcbiAgcmVnaXN0ZXIgKGNtZHMpIHtcbiAgICB2YXIganNcbiAgICBqcyA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqcycpKVxuICAgIGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdqYXZhc2NyaXB0Jywge1xuICAgICAgYWxpYXNPZjogJ2pzJ1xuICAgIH0pKVxuICAgIHJldHVybiBqcy5hZGRDbWRzKHtcbiAgICAgIGNvbW1lbnQ6ICcvKiB+fmNvbnRlbnR+fiAqLycsXG4gICAgICBpZjogJ2lmKHwpe1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICBsb2c6ICdpZih3aW5kb3cuY29uc29sZSl7XFxuXFx0Y29uc29sZS5sb2cofn5jb250ZW50fn58KVxcbn0nLFxuICAgICAgZnVuY3Rpb246ICdmdW5jdGlvbiB8KCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICBmdW5jdDoge1xuICAgICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgZjoge1xuICAgICAgICBhbGlhc09mOiAnanM6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgZm9yOiAnZm9yICh2YXIgaSA9IDA7IGkgPCB8OyBpKyspIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgZm9yaW46ICdmb3IgKHZhciB2YWwgaW4gfCkge1xcblxcdH5+Y29udGVudH5+XFxufScsXG4gICAgICBlYWNoOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmb3JpbidcbiAgICAgIH0sXG4gICAgICBmb3JlYWNoOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdqczpmb3JpbidcbiAgICAgIH0sXG4gICAgICB3aGlsZTogJ3doaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgd2hpbGVpOiAndmFyIGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmNvbnRlbnR+flxcblxcdGkrKztcXG59JyxcbiAgICAgIGlmZWxzZTogJ2lmKCB8ICkge1xcblxcdH5+Y29udGVudH5+XFxufSBlbHNlIHtcXG5cXHRcXG59JyxcbiAgICAgIGlmZToge1xuICAgICAgICBhbGlhc09mOiAnanM6aWZlbHNlJ1xuICAgICAgfSxcbiAgICAgIHN3aXRjaDogJ3N3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5jb250ZW50fn5cXG5cXHRcXHRicmVhaztcXG5cXHRkZWZhdWx0IDpcXG5cXHRcXHRcXG5cXHRcXHRicmVhaztcXG59J1xuICAgIH0pXG4gIH1cbn1cbmV4cG9ydHMuSnNDb21tYW5kUHJvdmlkZXIgPSBKc0NvbW1hbmRQcm92aWRlclxuIiwiXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi4vQ29tbWFuZCcpLkNvbW1hbmRcblxuY29uc3QgUGFpckRldGVjdG9yID0gcmVxdWlyZSgnLi4vZGV0ZWN0b3JzL1BhaXJEZXRlY3RvcicpLlBhaXJEZXRlY3RvclxuXG52YXIgd3JhcFdpdGhQaHBcbnZhciBQaHBDb21tYW5kUHJvdmlkZXIgPSBjbGFzcyBQaHBDb21tYW5kUHJvdmlkZXIge1xuICByZWdpc3RlciAoY21kcykge1xuICAgIHZhciBwaHAsIHBocElubmVyLCBwaHBPdXRlclxuICAgIHBocCA9IGNtZHMuYWRkQ21kKG5ldyBDb21tYW5kKCdwaHAnKSlcbiAgICBwaHAuYWRkRGV0ZWN0b3IobmV3IFBhaXJEZXRlY3Rvcih7XG4gICAgICByZXN1bHQ6ICdwaHA6aW5uZXInLFxuICAgICAgb3BlbmVyOiAnPD9waHAnLFxuICAgICAgY2xvc2VyOiAnPz4nLFxuICAgICAgb3B0aW9ubmFsX2VuZDogdHJ1ZSxcbiAgICAgIGVsc2U6ICdwaHA6b3V0ZXInXG4gICAgfSkpXG4gICAgcGhwT3V0ZXIgPSBwaHAuYWRkQ21kKG5ldyBDb21tYW5kKCdvdXRlcicpKVxuICAgIHBocE91dGVyLmFkZENtZHMoe1xuICAgICAgZmFsbGJhY2s6IHtcbiAgICAgICAgY21kczoge1xuICAgICAgICAgIGFueV9jb250ZW50OiB7XG4gICAgICAgICAgICBhbGlhc09mOiAnY29yZTpjb250ZW50JyxcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgIHByZWZpeDogJyA/PlxcbicsXG4gICAgICAgICAgICAgIHN1ZmZpeDogJ1xcbjw/cGhwICcsXG4gICAgICAgICAgICAgIGFmZml4ZXNfZW1wdHk6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6JW5hbWUlJyxcbiAgICAgICAgYWx0ZXJSZXN1bHQ6IHdyYXBXaXRoUGhwXG4gICAgICB9LFxuICAgICAgYm94OiB7XG4gICAgICAgIGFsaWFzT2Y6ICdjb3JlOmJveCcsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgcHJlZml4OiAnPD9waHBcXG4nLFxuICAgICAgICAgIHN1ZmZpeDogJ1xcbj8+J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29tbWVudDogJy8qIH5+Y29udGVudH5+ICovJyxcbiAgICAgIHBocDogJzw/cGhwXFxuXFx0fn5jb250ZW50fn58XFxuPz4nXG4gICAgfSlcbiAgICBwaHBJbm5lciA9IHBocC5hZGRDbWQobmV3IENvbW1hbmQoJ2lubmVyJykpXG4gICAgcmV0dXJuIHBocElubmVyLmFkZENtZHMoe1xuICAgICAgYW55X2NvbnRlbnQ6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y29udGVudCdcbiAgICAgIH0sXG4gICAgICBjb21tZW50OiAnLyogfn5jb250ZW50fn4gKi8nLFxuICAgICAgaWY6ICdpZih8KXtcXG5cXHR+fmFueV9jb250ZW50fn5cXG59JyxcbiAgICAgIGluZm86ICdwaHBpbmZvKCk7JyxcbiAgICAgIGVjaG86ICdlY2hvIHwnLFxuICAgICAgZToge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmVjaG8nXG4gICAgICB9LFxuICAgICAgY2xhc3M6IHtcbiAgICAgICAgcmVzdWx0OiAnY2xhc3Mgfn5wYXJhbSAwIGNsYXNzIGRlZjp8fn4ge1xcblxcdGZ1bmN0aW9uIF9fY29uc3RydWN0KCkge1xcblxcdFxcdH5+Y29udGVudH5+fFxcblxcdH1cXG59JyxcbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICBpbmxpbmU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjOiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6Y2xhc3MnXG4gICAgICB9LFxuICAgICAgZnVuY3Rpb246IHtcbiAgICAgICAgcmVzdWx0OiAnZnVuY3Rpb24gfCgpIHtcXG5cXHR+fmNvbnRlbnR+flxcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZ1bmN0OiB7XG4gICAgICAgIGFsaWFzT2Y6ICdwaHA6aW5uZXI6ZnVuY3Rpb24nXG4gICAgICB9LFxuICAgICAgZjoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZ1bmN0aW9uJ1xuICAgICAgfSxcbiAgICAgIGFycmF5OiAnJHwgPSBhcnJheSgpOycsXG4gICAgICBhOiAnYXJyYXkoKScsXG4gICAgICBmb3I6ICdmb3IgKCRpID0gMDsgJGkgPCAkfDsgJGkrKykge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgZm9yZWFjaDogJ2ZvcmVhY2ggKCR8IGFzICRrZXkgPT4gJHZhbCkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0nLFxuICAgICAgZWFjaDoge1xuICAgICAgICBhbGlhc09mOiAncGhwOmlubmVyOmZvcmVhY2gnXG4gICAgICB9LFxuICAgICAgd2hpbGU6ICd3aGlsZSh8KSB7XFxuXFx0fn5hbnlfY29udGVudH5+XFxufScsXG4gICAgICB3aGlsZWk6IHtcbiAgICAgICAgcmVzdWx0OiAnJGkgPSAwO1xcbndoaWxlKHwpIHtcXG5cXHR+fmFueV9jb250ZW50fn5cXG5cXHQkaSsrO1xcbn0nLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIGlubGluZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGlmZWxzZTogJ2lmKCB8ICkge1xcblxcdH5+YW55X2NvbnRlbnR+flxcbn0gZWxzZSB7XFxuXFx0XFxufScsXG4gICAgICBpZmU6IHtcbiAgICAgICAgYWxpYXNPZjogJ3BocDppbm5lcjppZmVsc2UnXG4gICAgICB9LFxuICAgICAgc3dpdGNoOiB7XG4gICAgICAgIHJlc3VsdDogJ3N3aXRjaCggfCApIHsgXFxuXFx0Y2FzZSA6XFxuXFx0XFx0fn5hbnlfY29udGVudH5+XFxuXFx0XFx0YnJlYWs7XFxuXFx0ZGVmYXVsdCA6XFxuXFx0XFx0XFxuXFx0XFx0YnJlYWs7XFxufScsXG4gICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgaW5saW5lOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY2xvc2U6IHtcbiAgICAgICAgYWxpYXNPZjogJ2NvcmU6Y2xvc2UnLFxuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgIHByZWZpeDogJzw/cGhwXFxuJyxcbiAgICAgICAgICBzdWZmaXg6ICdcXG4/PicsXG4gICAgICAgICAgcmVxdWlyZWRfYWZmaXhlczogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbmV4cG9ydHMuUGhwQ29tbWFuZFByb3ZpZGVyID0gUGhwQ29tbWFuZFByb3ZpZGVyXG5cbndyYXBXaXRoUGhwID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5zdGFuY2UpIHtcbiAgdmFyIGlubGluZSwgcmVnQ2xvc2UsIHJlZ09wZW5cbiAgaW5saW5lID0gaW5zdGFuY2UuZ2V0UGFyYW0oWydwaHBfaW5saW5lJywgJ2lubGluZSddLCB0cnVlKVxuXG4gIGlmIChpbmxpbmUpIHtcbiAgICByZWdPcGVuID0gLzxcXD9waHBcXHMoW1xcXFxuXFxcXHJcXHNdKykvZ1xuICAgIHJlZ0Nsb3NlID0gLyhbXFxuXFxyXFxzXSspXFxzXFw/Pi9nXG4gICAgcmV0dXJuICc8P3BocCAnICsgcmVzdWx0LnJlcGxhY2UocmVnT3BlbiwgJyQxPD9waHAgJykucmVwbGFjZShyZWdDbG9zZSwgJyA/PiQxJykgKyAnID8+J1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnPD9waHBcXG4nICsgU3RyaW5nSGVscGVyLmluZGVudChyZXN1bHQpICsgJ1xcbj8+J1xuICB9XG59IC8vIGNsb3NlUGhwRm9yQ29udGVudCA9IChpbnN0YW5jZSkgLT5cbi8vICAgaW5zdGFuY2UuY29udGVudCA9ICcgPz4nKyhpbnN0YW5jZS5jb250ZW50IHx8ICcnKSsnPD9waHAgJ1xuIiwiXG5jb25zdCBDb21tYW5kID0gcmVxdWlyZSgnLi4vQ29tbWFuZCcpLkNvbW1hbmRcblxuY29uc3QgQWx3YXlzRW5hYmxlZCA9IHJlcXVpcmUoJy4uL2RldGVjdG9ycy9BbHdheXNFbmFibGVkJykuQWx3YXlzRW5hYmxlZFxuXG52YXIgaW5mbGVjdGlvbiA9IGludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZSgnaW5mbGVjdGlvbicpKVxuXG5mdW5jdGlvbiBpbnRlcm9wUmVxdWlyZVdpbGRjYXJkIChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqIH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpIH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV0gfSB9IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iaiB9IH1cblxudmFyIFN0cmluZ0NvbW1hbmRQcm92aWRlciA9IGNsYXNzIFN0cmluZ0NvbW1hbmRQcm92aWRlciB7XG4gIHJlZ2lzdGVyIChyb290KSB7XG4gICAgdmFyIGNtZHNcbiAgICBjbWRzID0gcm9vdC5hZGRDbWQobmV3IENvbW1hbmQoJ3N0cmluZycpKVxuICAgIHJvb3QuYWRkQ21kKG5ldyBDb21tYW5kKCdzdHInLCB7XG4gICAgICBhbGlhc09mOiAnc3RyaW5nJ1xuICAgIH0pKVxuICAgIHJvb3QuYWRkRGV0ZWN0b3IobmV3IEFsd2F5c0VuYWJsZWQoJ3N0cmluZycpKVxuICAgIHJldHVybiBjbWRzLmFkZENtZHMoe1xuICAgICAgcGx1cmFsaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24ucGx1cmFsaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJ10sXG4gICAgICAgIGhlbHA6ICdQbHVyYWxpemUgYSBzdHJpbmcnXG4gICAgICB9LFxuICAgICAgc2luZ3VsYXJpemU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5zaW5ndWxhcml6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0ciddLFxuICAgICAgICBoZWxwOiAnU2luZ3VsYXJpemUgYSBzdHJpbmcnXG4gICAgICB9LFxuICAgICAgY2FtZWxpemU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5jYW1lbGl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSwgIWluc3RhbmNlLmdldEJvb2xQYXJhbShbMSwgJ2ZpcnN0J10sIHRydWUpKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJywgJ2ZpcnN0J10sXG4gICAgICAgIGhlbHA6ICdUcmFuc2Zvcm1zIGEgU3RyaW5nIGZyb20gdW5kZXJzY29yZSB0byBjYW1lbGNhc2UnXG4gICAgICB9LFxuICAgICAgdW5kZXJzY29yZToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSksIGluc3RhbmNlLmdldEJvb2xQYXJhbShbMSwgJ3VwcGVyJ10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJywgJ3VwcGVyJ10sXG4gICAgICAgIGhlbHA6ICdUcmFuc2Zvcm1zIGEgU3RyaW5nIGZyb20gY2FtZWxjYXNlIHRvIHVuZGVyc2NvcmUuJ1xuICAgICAgfSxcbiAgICAgIGh1bWFuaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uaHVtYW5pemUoaW5zdGFuY2UuZ2V0UGFyYW0oWzAsICdzdHInXSksIGluc3RhbmNlLmdldEJvb2xQYXJhbShbMSwgJ2ZpcnN0J10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJywgJ2ZpcnN0J10sXG4gICAgICAgIGhlbHA6ICdUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgaHVtYW4gcmVhZGFibGUgZm9ybWF0J1xuICAgICAgfSxcbiAgICAgIGNhcGl0YWxpemU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi5jYXBpdGFsaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJ10sXG4gICAgICAgIGhlbHA6ICdNYWtlIHRoZSBmaXJzdCBsZXR0ZXIgb2YgYSBzdHJpbmcgdXBwZXInXG4gICAgICB9LFxuICAgICAgZGFzaGVyaXplOiB7XG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZmxlY3Rpb24uZGFzaGVyaXplKGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJ10sXG4gICAgICAgIGhlbHA6ICdSZXBsYWNlcyB1bmRlcnNjb3JlcyB3aXRoIGRhc2hlcyBpbiBhIHN0cmluZy4nXG4gICAgICB9LFxuICAgICAgdGl0bGVpemU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi50aXRsZWl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0ciddLFxuICAgICAgICBoZWxwOiAnVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIGh1bWFuIHJlYWRhYmxlIGZvcm1hdCB3aXRoIG1vc3Qgd29yZHMgY2FwaXRhbGl6ZWQnXG4gICAgICB9LFxuICAgICAgdGFibGVpemU6IHtcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gaW5mbGVjdGlvbi50YWJsZWl6ZShpbnN0YW5jZS5nZXRQYXJhbShbMCwgJ3N0ciddKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZE5hbWVkOiBbJ3N0ciddLFxuICAgICAgICBoZWxwOiAnVHJhbnNmb3JtcyBhIFN0cmluZyB0byBhIHRhYmxlIGZvcm1hdCdcbiAgICAgIH0sXG4gICAgICBjbGFzc2lmeToge1xuICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiBpbmZsZWN0aW9uLmNsYXNzaWZ5KGluc3RhbmNlLmdldFBhcmFtKFswLCAnc3RyJ10pKVxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkTmFtZWQ6IFsnc3RyJ10sXG4gICAgICAgIGhlbHA6ICdUcmFuc2Zvcm1zIGEgU3RyaW5nIHRvIGEgY2xhc3MgZm9ybWF0J1xuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbmV4cG9ydHMuU3RyaW5nQ29tbWFuZFByb3ZpZGVyID0gU3RyaW5nQ29tbWFuZFByb3ZpZGVyXG4iLCJcbmNvbnN0IERldGVjdG9yID0gcmVxdWlyZSgnLi9EZXRlY3RvcicpLkRldGVjdG9yXG5cbnZhciBBbHdheXNFbmFibGVkID0gY2xhc3MgQWx3YXlzRW5hYmxlZCBleHRlbmRzIERldGVjdG9yIHtcbiAgY29uc3RydWN0b3IgKG5hbWVzcGFjZSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG5hbWVzcGFjZVxuICB9XG5cbiAgZGV0ZWN0IChmaW5kZXIpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2VcbiAgfVxufVxuZXhwb3J0cy5BbHdheXNFbmFibGVkID0gQWx3YXlzRW5hYmxlZFxuIiwiXG52YXIgRGV0ZWN0b3IgPSBjbGFzcyBEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yIChkYXRhID0ge30pIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhXG4gIH1cblxuICBkZXRlY3QgKGZpbmRlcikge1xuICAgIGlmICh0aGlzLmRldGVjdGVkKGZpbmRlcikpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEucmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5yZXN1bHRcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZGF0YS5lbHNlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5lbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGV0ZWN0ZWQgKGZpbmRlcikge31cbn1cbmV4cG9ydHMuRGV0ZWN0b3IgPSBEZXRlY3RvclxuIiwiXG5jb25zdCBEZXRlY3RvciA9IHJlcXVpcmUoJy4vRGV0ZWN0b3InKS5EZXRlY3RvclxuXG52YXIgTGFuZ0RldGVjdG9yID0gY2xhc3MgTGFuZ0RldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3Ige1xuICBkZXRlY3QgKGZpbmRlcikge1xuICAgIHZhciBsYW5nXG5cbiAgICBpZiAoZmluZGVyLmNvZGV3YXZlICE9IG51bGwpIHtcbiAgICAgIGxhbmcgPSBmaW5kZXIuY29kZXdhdmUuZWRpdG9yLmdldExhbmcoKVxuXG4gICAgICBpZiAobGFuZyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBsYW5nLnRvTG93ZXJDYXNlKClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmV4cG9ydHMuTGFuZ0RldGVjdG9yID0gTGFuZ0RldGVjdG9yXG4iLCJcbmNvbnN0IFBhaXIgPSByZXF1aXJlKCcuLi9wb3NpdGlvbmluZy9QYWlyJykuUGFpclxuXG5jb25zdCBEZXRlY3RvciA9IHJlcXVpcmUoJy4vRGV0ZWN0b3InKS5EZXRlY3RvclxuXG52YXIgUGFpckRldGVjdG9yID0gY2xhc3MgUGFpckRldGVjdG9yIGV4dGVuZHMgRGV0ZWN0b3Ige1xuICBkZXRlY3RlZCAoZmluZGVyKSB7XG4gICAgdmFyIHBhaXJcblxuICAgIGlmICh0aGlzLmRhdGEub3BlbmVyICE9IG51bGwgJiYgdGhpcy5kYXRhLmNsb3NlciAhPSBudWxsICYmIGZpbmRlci5pbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICBwYWlyID0gbmV3IFBhaXIodGhpcy5kYXRhLm9wZW5lciwgdGhpcy5kYXRhLmNsb3NlciwgdGhpcy5kYXRhKVxuXG4gICAgICBpZiAocGFpci5pc1dhcHBlck9mKGZpbmRlci5pbnN0YW5jZS5nZXRQb3MoKSwgZmluZGVyLmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbmV4cG9ydHMuUGFpckRldGVjdG9yID0gUGFpckRldGVjdG9yXG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgYm9vdHN0cmFwID0gcmVxdWlyZSgnLi9ib290c3RyYXAnKVxuXG5jb25zdCBUZXh0QXJlYUVkaXRvciA9IHJlcXVpcmUoJy4vVGV4dEFyZWFFZGl0b3InKVxuXG5ib290c3RyYXAuQ29kZXdhdmUuZGV0ZWN0ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICB2YXIgY3dcbiAgY3cgPSBuZXcgYm9vdHN0cmFwLkNvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvci5UZXh0QXJlYUVkaXRvcih0YXJnZXQpKVxuXG4gIGJvb3RzdHJhcC5Db2Rld2F2ZS5pbnN0YW5jZXMucHVzaChjdylcblxuICByZXR1cm4gY3dcbn1cblxuYm9vdHN0cmFwLkNvZGV3YXZlLnJlcXVpcmUgPSByZXF1aXJlXG53aW5kb3cuQ29kZXdhdmUgPSBib290c3RyYXAuQ29kZXdhdmVcbiIsIlxudmFyIEFycmF5SGVscGVyID0gY2xhc3MgQXJyYXlIZWxwZXIge1xuICBzdGF0aWMgaXNBcnJheSAoYXJyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH1cblxuICBzdGF0aWMgdW5pb24gKGExLCBhMikge1xuICAgIHJldHVybiB0aGlzLnVuaXF1ZShhMS5jb25jYXQoYTIpKVxuICB9XG5cbiAgc3RhdGljIHVuaXF1ZSAoYXJyYXkpIHtcbiAgICB2YXIgYSwgaSwgalxuICAgIGEgPSBhcnJheS5jb25jYXQoKVxuICAgIGkgPSAwXG5cbiAgICB3aGlsZSAoaSA8IGEubGVuZ3RoKSB7XG4gICAgICBqID0gaSArIDFcblxuICAgICAgd2hpbGUgKGogPCBhLmxlbmd0aCkge1xuICAgICAgICBpZiAoYVtpXSA9PT0gYVtqXSkge1xuICAgICAgICAgIGEuc3BsaWNlKGotLSwgMSlcbiAgICAgICAgfVxuXG4gICAgICAgICsralxuICAgICAgfVxuXG4gICAgICArK2lcbiAgICB9XG5cbiAgICByZXR1cm4gYVxuICB9XG59XG5leHBvcnRzLkFycmF5SGVscGVyID0gQXJyYXlIZWxwZXJcbiIsIlxudmFyIENvbW1vbkhlbHBlciA9IGNsYXNzIENvbW1vbkhlbHBlciB7XG4gIHN0YXRpYyBtZXJnZSAoLi4ueHMpIHtcbiAgICBpZiAoKHhzICE9IG51bGwgPyB4cy5sZW5ndGggOiBudWxsKSA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcCh7fSwgZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgdmFyIGksIGssIGxlbiwgcmVzdWx0cywgdiwgeFxuICAgICAgICByZXN1bHRzID0gW11cblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB4cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHggPSB4c1tpXVxuICAgICAgICAgIHJlc3VsdHMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0czFcbiAgICAgICAgICAgIHJlc3VsdHMxID0gW11cblxuICAgICAgICAgICAgZm9yIChrIGluIHgpIHtcbiAgICAgICAgICAgICAgdiA9IHhba11cbiAgICAgICAgICAgICAgcmVzdWx0czEucHVzaChtW2tdID0gdilcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMxXG4gICAgICAgICAgfSgpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHRhcCAobywgZm4pIHtcbiAgICBmbihvKVxuICAgIHJldHVybiBvXG4gIH1cblxuICBzdGF0aWMgYXBwbHlNaXhpbnMgKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIHtcbiAgICByZXR1cm4gYmFzZUN0b3JzLmZvckVhY2goYmFzZUN0b3IgPT4ge1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2VDdG9yLnByb3RvdHlwZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5leHBvcnRzLkNvbW1vbkhlbHBlciA9IENvbW1vbkhlbHBlclxuIiwiXG52YXIgTmFtZXNwYWNlSGVscGVyID0gY2xhc3MgTmFtZXNwYWNlSGVscGVyIHtcbiAgc3RhdGljIHNwbGl0Rmlyc3QgKGZ1bGxuYW1lLCBpc1NwYWNlID0gZmFsc2UpIHtcbiAgICB2YXIgcGFydHNcblxuICAgIGlmIChmdWxsbmFtZS5pbmRleE9mKCc6JykgPT09IC0xICYmICFpc1NwYWNlKSB7XG4gICAgICByZXR1cm4gW251bGwsIGZ1bGxuYW1lXVxuICAgIH1cblxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIHJldHVybiBbcGFydHMuc2hpZnQoKSwgcGFydHMuam9pbignOicpIHx8IG51bGxdXG4gIH1cblxuICBzdGF0aWMgc3BsaXQgKGZ1bGxuYW1lKSB7XG4gICAgdmFyIG5hbWUsIHBhcnRzXG5cbiAgICBpZiAoZnVsbG5hbWUuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgcmV0dXJuIFtudWxsLCBmdWxsbmFtZV1cbiAgICB9XG5cbiAgICBwYXJ0cyA9IGZ1bGxuYW1lLnNwbGl0KCc6JylcbiAgICBuYW1lID0gcGFydHMucG9wKClcbiAgICByZXR1cm4gW3BhcnRzLmpvaW4oJzonKSwgbmFtZV1cbiAgfVxufVxuZXhwb3J0cy5OYW1lc3BhY2VIZWxwZXIgPSBOYW1lc3BhY2VIZWxwZXJcbiIsIlxudmFyIE9wdGlvbmFsUHJvbWlzZSA9IGNsYXNzIE9wdGlvbmFsUHJvbWlzZSB7XG4gIGNvbnN0cnVjdG9yICh2YWwxKSB7XG4gICAgdGhpcy52YWwgPSB2YWwxXG5cbiAgICBpZiAodGhpcy52YWwgIT0gbnVsbCAmJiB0aGlzLnZhbC50aGVuICE9IG51bGwgJiYgdGhpcy52YWwucmVzdWx0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMudmFsID0gdGhpcy52YWwucmVzdWx0KClcbiAgICB9XG4gIH1cblxuICB0aGVuIChjYikge1xuICAgIGlmICh0aGlzLnZhbCAhPSBudWxsICYmIHRoaXMudmFsLnRoZW4gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBPcHRpb25hbFByb21pc2UodGhpcy52YWwudGhlbihjYikpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgT3B0aW9uYWxQcm9taXNlKGNiKHRoaXMudmFsKSlcbiAgICB9XG4gIH1cblxuICByZXN1bHQgKCkge1xuICAgIHJldHVybiB0aGlzLnZhbFxuICB9XG59XG5leHBvcnRzLk9wdGlvbmFsUHJvbWlzZSA9IE9wdGlvbmFsUHJvbWlzZVxuXG52YXIgb3B0aW9uYWxQcm9taXNlID0gZnVuY3Rpb24gKHZhbCkge1xuICByZXR1cm4gbmV3IE9wdGlvbmFsUHJvbWlzZSh2YWwpXG59XG5cbmV4cG9ydHMub3B0aW9uYWxQcm9taXNlID0gb3B0aW9uYWxQcm9taXNlXG4iLCJcbnZhciBQYXRoSGVscGVyID0gY2xhc3MgUGF0aEhlbHBlciB7XG4gIHN0YXRpYyBnZXRQYXRoIChvYmosIHBhdGgsIHNlcCA9ICcuJykge1xuICAgIHZhciBjdXIsIHBhcnRzXG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcClcbiAgICBjdXIgPSBvYmpcbiAgICBwYXJ0cy5maW5kKHBhcnQgPT4ge1xuICAgICAgY3VyID0gY3VyW3BhcnRdXG4gICAgICByZXR1cm4gdHlwZW9mIGN1ciA9PT0gJ3VuZGVmaW5lZCdcbiAgICB9KVxuICAgIHJldHVybiBjdXJcbiAgfVxuXG4gIHN0YXRpYyBzZXRQYXRoIChvYmosIHBhdGgsIHZhbCwgc2VwID0gJy4nKSB7XG4gICAgdmFyIGxhc3QsIHBhcnRzXG4gICAgcGFydHMgPSBwYXRoLnNwbGl0KHNlcClcbiAgICBsYXN0ID0gcGFydHMucG9wKClcbiAgICBjb25zdCB0YXJnZXQgPSBwYXJ0cy5yZWR1Y2UoKGN1ciwgcGFydCkgPT4ge1xuICAgICAgaWYgKGN1cltwYXJ0XSA9PSBudWxsKSB7XG4gICAgICAgIGN1cltwYXJ0XSA9IHt9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VyW3BhcnRdXG4gICAgfSwgb2JqKVxuICAgIHRhcmdldFtsYXN0XSA9IHZhbFxuICAgIHJldHVybiB2YWxcbiAgfVxufVxuZXhwb3J0cy5QYXRoSGVscGVyID0gUGF0aEhlbHBlclxuIiwiXG5jb25zdCBTaXplID0gcmVxdWlyZSgnLi4vcG9zaXRpb25pbmcvU2l6ZScpLlNpemVcblxudmFyIFN0cmluZ0hlbHBlciA9IGNsYXNzIFN0cmluZ0hlbHBlciB7XG4gIHN0YXRpYyB0cmltRW1wdHlMaW5lICh0eHQpIHtcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UoL15cXHMqXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHI/XFxuXFxzKiQvLCAnJylcbiAgfVxuXG4gIHN0YXRpYyBlc2NhcGVSZWdFeHAgKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvWy1bXFxdL3t9KCkqKz8uXFxcXF4kfF0vZywgJ1xcXFwkJicpXG4gIH1cblxuICBzdGF0aWMgcmVwZWF0VG9MZW5ndGggKHR4dCwgbGVuZ3RoKSB7XG4gICAgaWYgKGxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG5cbiAgICByZXR1cm4gQXJyYXkoTWF0aC5jZWlsKGxlbmd0aCAvIHR4dC5sZW5ndGgpICsgMSkuam9pbih0eHQpLnN1YnN0cmluZygwLCBsZW5ndGgpXG4gIH1cblxuICBzdGF0aWMgcmVwZWF0ICh0eHQsIG5iKSB7XG4gICAgcmV0dXJuIEFycmF5KG5iICsgMSkuam9pbih0eHQpXG4gIH1cblxuICBzdGF0aWMgZ2V0VHh0U2l6ZSAodHh0KSB7XG4gICAgdmFyIGosIGwsIGxlbiwgbGluZXMsIHdcbiAgICBsaW5lcyA9IHR4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KCdcXG4nKVxuICAgIHcgPSAwXG5cbiAgICBmb3IgKGogPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbCA9IGxpbmVzW2pdXG4gICAgICB3ID0gTWF0aC5tYXgodywgbC5sZW5ndGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTaXplKHcsIGxpbmVzLmxlbmd0aCAtIDEpXG4gIH1cblxuICBzdGF0aWMgaW5kZW50Tm90Rmlyc3QgKHRleHQsIG5iID0gMSwgc3BhY2VzID0gJyAgJykge1xuICAgIHZhciByZWdcblxuICAgIGlmICh0ZXh0ICE9IG51bGwpIHtcbiAgICAgIHJlZyA9IC9cXG4vZ1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsICdcXG4nICsgdGhpcy5yZXBlYXQoc3BhY2VzLCBuYikpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGluZGVudCAodGV4dCwgbmIgPSAxLCBzcGFjZXMgPSAnICAnKSB7XG4gICAgaWYgKHRleHQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNwYWNlcyArIHRoaXMuaW5kZW50Tm90Rmlyc3QodGV4dCwgbmIsIHNwYWNlcylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHRcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgcmV2ZXJzZVN0ciAodHh0KSB7XG4gICAgcmV0dXJuIHR4dC5zcGxpdCgnJykucmV2ZXJzZSgpLmpvaW4oJycpXG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlQ2FycmV0ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIHtcbiAgICB2YXIgcmVDYXJyZXQsIHJlUXVvdGVkLCByZVRtcCwgdG1wXG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSdcbiAgICByZUNhcnJldCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciksICdnJylcbiAgICByZVF1b3RlZCA9IG5ldyBSZWdFeHAodGhpcy5lc2NhcGVSZWdFeHAoY2FycmV0Q2hhciArIGNhcnJldENoYXIpLCAnZycpXG4gICAgcmVUbXAgPSBuZXcgUmVnRXhwKHRoaXMuZXNjYXBlUmVnRXhwKHRtcCksICdnJylcbiAgICByZXR1cm4gdHh0LnJlcGxhY2UocmVRdW90ZWQsIHRtcCkucmVwbGFjZShyZUNhcnJldCwgJycpLnJlcGxhY2UocmVUbXAsIGNhcnJldENoYXIpXG4gIH1cblxuICBzdGF0aWMgZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQgKHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciBwb3NcbiAgICBwb3MgPSB0aGlzLmdldENhcnJldFBvcyh0eHQsIGNhcnJldENoYXIpXG5cbiAgICBpZiAocG9zICE9IG51bGwpIHtcbiAgICAgIHR4dCA9IHR4dC5zdWJzdHIoMCwgcG9zKSArIHR4dC5zdWJzdHIocG9zICsgY2FycmV0Q2hhci5sZW5ndGgpXG4gICAgICByZXR1cm4gW3BvcywgdHh0XVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXRDYXJyZXRQb3MgKHR4dCwgY2FycmV0Q2hhciA9ICd8Jykge1xuICAgIHZhciBpLCByZVF1b3RlZFxuICAgIHJlUXVvdGVkID0gbmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyICsgY2FycmV0Q2hhciksICdnJylcbiAgICB0eHQgPSB0eHQucmVwbGFjZShyZVF1b3RlZCwgJyAnKVxuXG4gICAgaWYgKChpID0gdHh0LmluZGV4T2YoY2FycmV0Q2hhcikpID4gLTEpIHtcbiAgICAgIHJldHVybiBpXG4gICAgfVxuICB9XG59XG5leHBvcnRzLlN0cmluZ0hlbHBlciA9IFN0cmluZ0hlbHBlclxuIiwiXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL1BvcycpLlBvc1xuXG5jb25zdCBTdHJpbmdIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL1N0cmluZ0hlbHBlcicpLlN0cmluZ0hlbHBlclxuXG5jb25zdCBQYWlyTWF0Y2ggPSByZXF1aXJlKCcuL1BhaXJNYXRjaCcpLlBhaXJNYXRjaFxuXG52YXIgUGFpciA9IGNsYXNzIFBhaXIge1xuICBjb25zdHJ1Y3RvciAob3BlbmVyLCBjbG9zZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHZhciBkZWZhdWx0cywga2V5LCB2YWxcbiAgICB0aGlzLm9wZW5lciA9IG9wZW5lclxuICAgIHRoaXMuY2xvc2VyID0gY2xvc2VyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9ubmFsX2VuZDogZmFsc2UsXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRzW2tleV1cblxuICAgICAgaWYgKGtleSBpbiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgdGhpc1trZXldID0gdGhpcy5vcHRpb25zW2tleV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5lclJlZyAoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wZW5lciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAodGhpcy5vcGVuZXIpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuZXJcbiAgICB9XG4gIH1cblxuICBjbG9zZXJSZWcgKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jbG9zZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKHRoaXMuY2xvc2VyKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2VyXG4gICAgfVxuICB9XG5cbiAgbWF0Y2hBbnlQYXJ0cyAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZW5lcjogdGhpcy5vcGVuZXJSZWcoKSxcbiAgICAgIGNsb3NlcjogdGhpcy5jbG9zZXJSZWcoKVxuICAgIH1cbiAgfVxuXG4gIG1hdGNoQW55UGFydEtleXMgKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLm1hdGNoQW55UGFydHMoKSlcbiAgfVxuXG4gIG1hdGNoQW55UmVnICgpIHtcbiAgICB2YXIgZ3JvdXBzLCBrZXksIHJlZiwgcmVnXG4gICAgZ3JvdXBzID0gW11cbiAgICByZWYgPSB0aGlzLm1hdGNoQW55UGFydHMoKVxuXG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICByZWcgPSByZWZba2V5XVxuICAgICAgZ3JvdXBzLnB1c2goJygnICsgcmVnLnNvdXJjZSArICcpJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlZ0V4cChncm91cHMuam9pbignfCcpKVxuICB9XG5cbiAgbWF0Y2hBbnkgKHRleHQsIG9mZnNldCA9IDApIHtcbiAgICB2YXIgbWF0Y2hcblxuICAgIHdoaWxlICgobWF0Y2ggPSB0aGlzLl9tYXRjaEFueSh0ZXh0LCBvZmZzZXQpKSAhPSBudWxsICYmICFtYXRjaC52YWxpZCgpKSB7XG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgIH1cblxuICAgIGlmIChtYXRjaCAhPSBudWxsICYmIG1hdGNoLnZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtYXRjaFxuICAgIH1cbiAgfVxuXG4gIF9tYXRjaEFueSAodGV4dCwgb2Zmc2V0ID0gMCkge1xuICAgIHZhciBtYXRjaFxuXG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKG9mZnNldClcbiAgICB9XG5cbiAgICBtYXRjaCA9IHRoaXMubWF0Y2hBbnlSZWcoKS5leGVjKHRleHQpXG5cbiAgICBpZiAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBQYWlyTWF0Y2godGhpcywgbWF0Y2gsIG9mZnNldClcbiAgICB9XG4gIH1cblxuICBtYXRjaEFueU5hbWVkICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuX21hdGNoQW55R2V0TmFtZSh0aGlzLm1hdGNoQW55KHRleHQpKVxuICB9XG5cbiAgbWF0Y2hBbnlMYXN0ICh0ZXh0LCBvZmZzZXQgPSAwKSB7XG4gICAgdmFyIG1hdGNoLCByZXNcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25kLWFzc2lnblxuICAgIHdoaWxlIChtYXRjaCA9IHRoaXMubWF0Y2hBbnkodGV4dCwgb2Zmc2V0KSkge1xuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKClcblxuICAgICAgaWYgKCFyZXMgfHwgcmVzLmVuZCgpICE9PSBtYXRjaC5lbmQoKSkge1xuICAgICAgICByZXMgPSBtYXRjaFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIGlkZW50aWNhbCAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVyID09PSB0aGlzLmNsb3NlciB8fCAoXG4gICAgICB0aGlzLm9wZW5lci5zb3VyY2UgIT0gbnVsbCAmJlxuICAgICAgdGhpcy5jbG9zZXIuc291cmNlICE9IG51bGwgJiZcbiAgICAgIHRoaXMub3BlbmVyLnNvdXJjZSA9PT0gdGhpcy5jbG9zZXIuc291cmNlXG4gICAgKVxuICB9XG5cbiAgd3JhcHBlclBvcyAocG9zLCB0ZXh0KSB7XG4gICAgdmFyIGVuZCwgc3RhcnRcbiAgICBzdGFydCA9IHRoaXMubWF0Y2hBbnlMYXN0KHRleHQuc3Vic3RyKDAsIHBvcy5zdGFydCkpXG5cbiAgICBpZiAoc3RhcnQgIT0gbnVsbCAmJiAodGhpcy5pZGVudGljYWwoKSB8fCBzdGFydC5uYW1lKCkgPT09ICdvcGVuZXInKSkge1xuICAgICAgZW5kID0gdGhpcy5tYXRjaEFueSh0ZXh0LCBwb3MuZW5kKVxuXG4gICAgICBpZiAoZW5kICE9IG51bGwgJiYgKHRoaXMuaWRlbnRpY2FsKCkgfHwgZW5kLm5hbWUoKSA9PT0gJ2Nsb3NlcicpKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIGVuZC5lbmQoKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25uYWxfZW5kKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksIHRleHQubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzV2FwcGVyT2YgKHBvcywgdGV4dCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZXJQb3MocG9zLCB0ZXh0KSAhPSBudWxsXG4gIH1cbn1cbmV4cG9ydHMuUGFpciA9IFBhaXJcbiIsIlxudmFyIFBhaXJNYXRjaCA9IGNsYXNzIFBhaXJNYXRjaCB7XG4gIGNvbnN0cnVjdG9yIChwYWlyLCBtYXRjaCwgb2Zmc2V0ID0gMCkge1xuICAgIHRoaXMucGFpciA9IHBhaXJcbiAgICB0aGlzLm1hdGNoID0gbWF0Y2hcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldFxuICB9XG5cbiAgbmFtZSAoKSB7XG4gICAgdmFyIF9uYW1lLCBncm91cCwgaSwgaiwgbGVuLCByZWZcblxuICAgIGlmICh0aGlzLm1hdGNoKSB7XG4gICAgICBpZiAodHlwZW9mIF9uYW1lID09PSAndW5kZWZpbmVkJyB8fCBfbmFtZSA9PT0gbnVsbCkge1xuICAgICAgICByZWYgPSB0aGlzLm1hdGNoXG5cbiAgICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgICBncm91cCA9IHJlZltpXVxuXG4gICAgICAgICAgaWYgKGkgPiAwICYmIGdyb3VwICE9IG51bGwpIHtcbiAgICAgICAgICAgIF9uYW1lID0gdGhpcy5wYWlyLm1hdGNoQW55UGFydEtleXMoKVtpIC0gMV1cbiAgICAgICAgICAgIHJldHVybiBfbmFtZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9uYW1lID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9uYW1lIHx8IG51bGxcbiAgICB9XG4gIH1cblxuICBzdGFydCAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2guaW5kZXggKyB0aGlzLm9mZnNldFxuICB9XG5cbiAgZW5kICgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaC5pbmRleCArIHRoaXMubWF0Y2hbMF0ubGVuZ3RoICsgdGhpcy5vZmZzZXRcbiAgfVxuXG4gIHZhbGlkICgpIHtcbiAgICByZXR1cm4gIXRoaXMucGFpci52YWxpZE1hdGNoIHx8IHRoaXMucGFpci52YWxpZE1hdGNoKHRoaXMpXG4gIH1cblxuICBsZW5ndGggKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoWzBdLmxlbmd0aFxuICB9XG59XG5leHBvcnRzLlBhaXJNYXRjaCA9IFBhaXJNYXRjaFxuIiwiXG52YXIgUG9zID0gY2xhc3MgUG9zIHtcbiAgY29uc3RydWN0b3IgKHN0YXJ0LCBlbmQpIHtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnRcbiAgICB0aGlzLmVuZCA9IGVuZFxuXG4gICAgaWYgKHRoaXMuZW5kID09IG51bGwpIHtcbiAgICAgIHRoaXMuZW5kID0gdGhpcy5zdGFydFxuICAgIH1cbiAgfVxuXG4gIGNvbnRhaW5zUHQgKHB0KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5lbmRcbiAgfVxuXG4gIGNvbnRhaW5zUG9zIChwb3MpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmVuZFxuICB9XG5cbiAgd3JhcHBlZEJ5IChwcmVmaXgsIHN1ZmZpeCkge1xuICAgIGNvbnN0IFdyYXBDbGFzcyA9IFBvcy53cmFwQ2xhc3NcbiAgICByZXR1cm4gbmV3IFdyYXBDbGFzcyh0aGlzLnN0YXJ0IC0gcHJlZml4Lmxlbmd0aCwgdGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMuZW5kICsgc3VmZml4Lmxlbmd0aClcbiAgfVxuXG4gIHdpdGhFZGl0b3IgKHZhbCkge1xuICAgIHRoaXMuX2VkaXRvciA9IHZhbFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBlZGl0b3IgKCkge1xuICAgIGlmICh0aGlzLl9lZGl0b3IgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0JylcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yXG4gIH1cblxuICBoYXNFZGl0b3IgKCkge1xuICAgIHJldHVybiB0aGlzLl9lZGl0b3IgIT0gbnVsbFxuICB9XG5cbiAgdGV4dCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZClcbiAgfVxuXG4gIGFwcGx5T2Zmc2V0IChvZmZzZXQpIHtcbiAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHByZXZFT0wgKCkge1xuICAgIGlmICh0aGlzLl9wcmV2RU9MID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3ByZXZFT0wgPSB0aGlzLmVkaXRvcigpLmZpbmRMaW5lU3RhcnQodGhpcy5zdGFydClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcHJldkVPTFxuICB9XG5cbiAgbmV4dEVPTCAoKSB7XG4gICAgaWYgKHRoaXMuX25leHRFT0wgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fbmV4dEVPTCA9IHRoaXMuZWRpdG9yKCkuZmluZExpbmVFbmQodGhpcy5lbmQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25leHRFT0xcbiAgfVxuXG4gIHRleHRXaXRoRnVsbExpbmVzICgpIHtcbiAgICBpZiAodGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGV4dFdpdGhGdWxsTGluZXMgPSB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5wcmV2RU9MKCksIHRoaXMubmV4dEVPTCgpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90ZXh0V2l0aEZ1bGxMaW5lc1xuICB9XG5cbiAgc2FtZUxpbmVzUHJlZml4ICgpIHtcbiAgICBpZiAodGhpcy5fc2FtZUxpbmVzUHJlZml4ID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NhbWVMaW5lc1ByZWZpeCA9IHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnByZXZFT0woKSwgdGhpcy5zdGFydClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzUHJlZml4XG4gIH1cblxuICBzYW1lTGluZXNTdWZmaXggKCkge1xuICAgIGlmICh0aGlzLl9zYW1lTGluZXNTdWZmaXggPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2FtZUxpbmVzU3VmZml4ID0gdGhpcy5lZGl0b3IoKS50ZXh0U3Vic3RyKHRoaXMuZW5kLCB0aGlzLm5leHRFT0woKSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc2FtZUxpbmVzU3VmZml4XG4gIH1cblxuICBjb3B5ICgpIHtcbiAgICB2YXIgcmVzXG4gICAgcmVzID0gbmV3IFBvcyh0aGlzLnN0YXJ0LCB0aGlzLmVuZClcblxuICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICByZXMud2l0aEVkaXRvcih0aGlzLmVkaXRvcigpKVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIHJhdyAoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnN0YXJ0LCB0aGlzLmVuZF1cbiAgfVxufVxuZXhwb3J0cy5Qb3MgPSBQb3NcbiIsIlxuY29uc3QgV3JhcHBpbmcgPSByZXF1aXJlKCcuL1dyYXBwaW5nJykuV3JhcHBpbmdcblxuY29uc3QgUmVwbGFjZW1lbnQgPSByZXF1aXJlKCcuL1JlcGxhY2VtZW50JykuUmVwbGFjZW1lbnRcblxuY29uc3QgQ29tbW9uSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9Db21tb25IZWxwZXInKS5Db21tb25IZWxwZXJcblxudmFyIFBvc0NvbGxlY3Rpb24gPSBjbGFzcyBQb3NDb2xsZWN0aW9uIHtcbiAgY29uc3RydWN0b3IgKGFycikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICBhcnIgPSBbYXJyXVxuICAgIH1cblxuICAgIENvbW1vbkhlbHBlci5hcHBseU1peGlucyhhcnIsIFtQb3NDb2xsZWN0aW9uXSlcblxuICAgIHJldHVybiBhcnJcbiAgfVxuXG4gIHdyYXAgKHByZWZpeCwgc3VmZml4KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gbmV3IFdyYXBwaW5nKHAuc3RhcnQsIHAuZW5kLCBwcmVmaXgsIHN1ZmZpeClcbiAgICB9KVxuICB9XG5cbiAgcmVwbGFjZSAodHh0KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gbmV3IFJlcGxhY2VtZW50KHAuc3RhcnQsIHAuZW5kLCB0eHQpXG4gICAgfSlcbiAgfVxufVxuZXhwb3J0cy5Qb3NDb2xsZWN0aW9uID0gUG9zQ29sbGVjdGlvblxuIiwiXG5jb25zdCBQb3MgPSByZXF1aXJlKCcuL1BvcycpLlBvc1xuXG5jb25zdCBDb21tb25IZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcicpLkNvbW1vbkhlbHBlclxuXG5jb25zdCBPcHRpb25PYmplY3QgPSByZXF1aXJlKCcuLi9PcHRpb25PYmplY3QnKS5PcHRpb25PYmplY3RcblxuY29uc3QgU3RyaW5nSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInKS5TdHJpbmdIZWxwZXJcblxudmFyIFJlcGxhY2VtZW50ID0gY2xhc3MgUmVwbGFjZW1lbnQgZXh0ZW5kcyBQb3Mge1xuICBjb25zdHJ1Y3RvciAoc3RhcnQxLCBlbmQsIHRleHQxLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0MVxuICAgIHRoaXMuZW5kID0gZW5kXG4gICAgdGhpcy50ZXh0ID0gdGV4dDFcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucywge1xuICAgICAgcHJlZml4OiAnJyxcbiAgICAgIHN1ZmZpeDogJycsXG4gICAgICBzZWxlY3Rpb25zOiBbXVxuICAgIH0pXG4gIH1cblxuICByZXNQb3NCZWZvcmVQcmVmaXggKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy50ZXh0Lmxlbmd0aFxuICB9XG5cbiAgcmVzRW5kICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydCArIHRoaXMuZmluYWxUZXh0KCkubGVuZ3RoXG4gIH1cblxuICBhcHBseSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkuc3BsaWNlVGV4dCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy5maW5hbFRleHQoKSlcbiAgfVxuXG4gIG5lY2Vzc2FyeSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmluYWxUZXh0KCkgIT09IHRoaXMub3JpZ2luYWxUZXh0KClcbiAgfVxuXG4gIG9yaWdpbmFsVGV4dCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yKCkudGV4dFN1YnN0cih0aGlzLnN0YXJ0LCB0aGlzLmVuZClcbiAgfVxuXG4gIGZpbmFsVGV4dCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy50ZXh0ICsgdGhpcy5zdWZmaXhcbiAgfVxuXG4gIG9mZnNldEFmdGVyICgpIHtcbiAgICByZXR1cm4gdGhpcy5maW5hbFRleHQoKS5sZW5ndGggLSAodGhpcy5lbmQgLSB0aGlzLnN0YXJ0KVxuICB9XG5cbiAgYXBwbHlPZmZzZXQgKG9mZnNldCkge1xuICAgIHZhciBpLCBsZW4sIHJlZiwgc2VsXG5cbiAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICB0aGlzLnN0YXJ0ICs9IG9mZnNldFxuICAgICAgdGhpcy5lbmQgKz0gb2Zmc2V0XG4gICAgICByZWYgPSB0aGlzLnNlbGVjdGlvbnNcblxuICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHNlbCA9IHJlZltpXVxuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHNlbGVjdENvbnRlbnQgKCkge1xuICAgIHRoaXMuc2VsZWN0aW9ucyA9IFtuZXcgUG9zKHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3RhcnQsIHRoaXMucHJlZml4Lmxlbmd0aCArIHRoaXMuc3RhcnQgKyB0aGlzLnRleHQubGVuZ3RoKV1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgY2FycmV0VG9TZWwgKCkge1xuICAgIHZhciBwb3MsIHJlcywgc3RhcnQsIHRleHRcbiAgICB0aGlzLnNlbGVjdGlvbnMgPSBbXVxuICAgIHRleHQgPSB0aGlzLmZpbmFsVGV4dCgpXG4gICAgdGhpcy5wcmVmaXggPSBTdHJpbmdIZWxwZXIucmVtb3ZlQ2FycmV0KHRoaXMucHJlZml4KVxuICAgIHRoaXMudGV4dCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodGhpcy50ZXh0KVxuICAgIHRoaXMuc3VmZml4ID0gU3RyaW5nSGVscGVyLnJlbW92ZUNhcnJldCh0aGlzLnN1ZmZpeClcbiAgICBzdGFydCA9IHRoaXMuc3RhcnRcblxuICAgIHdoaWxlICgocmVzID0gU3RyaW5nSGVscGVyLmdldEFuZFJlbW92ZUZpcnN0Q2FycmV0KHRleHQpKSAhPSBudWxsKSB7XG4gICAgICBbcG9zLCB0ZXh0XSA9IHJlc1xuICAgICAgdGhpcy5zZWxlY3Rpb25zLnB1c2gobmV3IFBvcyhzdGFydCArIHBvcywgc3RhcnQgKyBwb3MpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBjb3B5ICgpIHtcbiAgICB2YXIgcmVzXG4gICAgcmVzID0gbmV3IFJlcGxhY2VtZW50KHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnRleHQsIHRoaXMuZ2V0T3B0cygpKVxuXG4gICAgaWYgKHRoaXMuaGFzRWRpdG9yKCkpIHtcbiAgICAgIHJlcy53aXRoRWRpdG9yKHRoaXMuZWRpdG9yKCkpXG4gICAgfVxuXG4gICAgcmVzLnNlbGVjdGlvbnMgPSB0aGlzLnNlbGVjdGlvbnMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gcy5jb3B5KClcbiAgICB9KVxuICAgIHJldHVybiByZXNcbiAgfVxufVxuXG5Db21tb25IZWxwZXIuYXBwbHlNaXhpbnMoUmVwbGFjZW1lbnQucHJvdG90eXBlLCBbT3B0aW9uT2JqZWN0XSlcblxuZXhwb3J0cy5SZXBsYWNlbWVudCA9IFJlcGxhY2VtZW50XG4iLCJcbnZhciBTaXplID0gY2xhc3MgU2l6ZSB7XG4gIGNvbnN0cnVjdG9yICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgfVxufVxuZXhwb3J0cy5TaXplID0gU2l6ZVxuIiwiXG52YXIgU3RyUG9zID0gY2xhc3MgU3RyUG9zIHtcbiAgY29uc3RydWN0b3IgKHBvcywgc3RyKSB7XG4gICAgdGhpcy5wb3MgPSBwb3NcbiAgICB0aGlzLnN0ciA9IHN0clxuICB9XG5cbiAgZW5kICgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgKyB0aGlzLnN0ci5sZW5ndGhcbiAgfVxufVxuZXhwb3J0cy5TdHJQb3MgPSBTdHJQb3NcbiIsIlxuY29uc3QgUG9zID0gcmVxdWlyZSgnLi9Qb3MnKS5Qb3NcblxudmFyIFdyYXBwZWRQb3MgPSBjbGFzcyBXcmFwcGVkUG9zIGV4dGVuZHMgUG9zIHtcbiAgY29uc3RydWN0b3IgKHN0YXJ0LCBpbm5lclN0YXJ0LCBpbm5lckVuZCwgZW5kKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc3RhcnQgPSBzdGFydFxuICAgIHRoaXMuaW5uZXJTdGFydCA9IGlubmVyU3RhcnRcbiAgICB0aGlzLmlubmVyRW5kID0gaW5uZXJFbmRcbiAgICB0aGlzLmVuZCA9IGVuZFxuICB9XG5cbiAgaW5uZXJDb250YWluc1B0IChwdCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU3RhcnQgPD0gcHQgJiYgcHQgPD0gdGhpcy5pbm5lckVuZFxuICB9XG5cbiAgaW5uZXJDb250YWluc1BvcyAocG9zKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgJiYgcG9zLmVuZCA8PSB0aGlzLmlubmVyRW5kXG4gIH1cblxuICBpbm5lclRleHQgKCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcigpLnRleHRTdWJzdHIodGhpcy5pbm5lclN0YXJ0LCB0aGlzLmlubmVyRW5kKVxuICB9XG5cbiAgc2V0SW5uZXJMZW4gKGxlbikge1xuICAgIHJldHVybiB0aGlzLm1vdmVTdWZpeCh0aGlzLmlubmVyU3RhcnQgKyBsZW4pXG4gIH1cblxuICBtb3ZlU3VmZml4IChwdCkge1xuICAgIHZhciBzdWZmaXhMZW5cbiAgICBzdWZmaXhMZW4gPSB0aGlzLmVuZCAtIHRoaXMuaW5uZXJFbmRcbiAgICB0aGlzLmlubmVyRW5kID0gcHRcbiAgICB0aGlzLmVuZCA9IHRoaXMuaW5uZXJFbmQgKyBzdWZmaXhMZW5cbiAgfVxuXG4gIGNvcHkgKCkge1xuICAgIHJldHVybiBuZXcgV3JhcHBlZFBvcyh0aGlzLnN0YXJ0LCB0aGlzLmlubmVyU3RhcnQsIHRoaXMuaW5uZXJFbmQsIHRoaXMuZW5kKVxuICB9XG59XG5leHBvcnRzLldyYXBwZWRQb3MgPSBXcmFwcGVkUG9zXG4iLCJcbmNvbnN0IFJlcGxhY2VtZW50ID0gcmVxdWlyZSgnLi9SZXBsYWNlbWVudCcpLlJlcGxhY2VtZW50XG5cbnZhciBXcmFwcGluZyA9IGNsYXNzIFdyYXBwaW5nIGV4dGVuZHMgUmVwbGFjZW1lbnQge1xuICBjb25zdHJ1Y3RvciAoc3RhcnQsIGVuZCwgcHJlZml4ID0gJycsIHN1ZmZpeCA9ICcnLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0XG4gICAgdGhpcy5lbmQgPSBlbmRcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5zZXRPcHRzKHRoaXMub3B0aW9ucylcbiAgICB0aGlzLnRleHQgPSAnJ1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4XG4gICAgdGhpcy5zdWZmaXggPSBzdWZmaXhcbiAgfVxuXG4gIGFwcGx5ICgpIHtcbiAgICB0aGlzLmFkanVzdFNlbCgpXG4gICAgcmV0dXJuIHN1cGVyLmFwcGx5KClcbiAgfVxuXG4gIGFkanVzdFNlbCAoKSB7XG4gICAgdmFyIGksIGxlbiwgb2Zmc2V0LCByZWYsIHJlc3VsdHMsIHNlbFxuICAgIG9mZnNldCA9IHRoaXMub3JpZ2luYWxUZXh0KCkubGVuZ3RoXG4gICAgcmVmID0gdGhpcy5zZWxlY3Rpb25zXG4gICAgcmVzdWx0cyA9IFtdXG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNlbCA9IHJlZltpXVxuXG4gICAgICBpZiAoc2VsLnN0YXJ0ID4gdGhpcy5zdGFydCArIHRoaXMucHJlZml4Lmxlbmd0aCkge1xuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWwuZW5kID49IHRoaXMuc3RhcnQgKyB0aGlzLnByZWZpeC5sZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHNlbC5lbmQgKz0gb2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKG51bGwpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuXG4gIGZpbmFsVGV4dCAoKSB7XG4gICAgdmFyIHRleHRcblxuICAgIGlmICh0aGlzLmhhc0VkaXRvcigpKSB7XG4gICAgICB0ZXh0ID0gdGhpcy5vcmlnaW5hbFRleHQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gJydcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0ZXh0ICsgdGhpcy5zdWZmaXhcbiAgfVxuXG4gIG9mZnNldEFmdGVyICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXgubGVuZ3RoICsgdGhpcy5zdWZmaXgubGVuZ3RoXG4gIH1cblxuICBjb3B5ICgpIHtcbiAgICB2YXIgcmVzXG4gICAgcmVzID0gbmV3IFdyYXBwaW5nKHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnByZWZpeCwgdGhpcy5zdWZmaXgpXG4gICAgcmVzLnNlbGVjdGlvbnMgPSB0aGlzLnNlbGVjdGlvbnMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gcy5jb3B5KClcbiAgICB9KVxuICAgIHJldHVybiByZXNcbiAgfVxufVxuZXhwb3J0cy5XcmFwcGluZyA9IFdyYXBwaW5nXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuXG52YXIgTG9jYWxTdG9yYWdlRW5naW5lID0gY2xhc3MgTG9jYWxTdG9yYWdlRW5naW5lIHtcbiAgc2F2ZSAoa2V5LCB2YWwpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5mdWxsS2V5KGtleSksIEpTT04uc3RyaW5naWZ5KHZhbCkpXG4gICAgfVxuICB9XG5cbiAgc2F2ZUluUGF0aCAocGF0aCwga2V5LCB2YWwpIHtcbiAgICB2YXIgZGF0YVxuICAgIGRhdGEgPSB0aGlzLmxvYWQocGF0aClcblxuICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgIGRhdGEgPSB7fVxuICAgIH1cblxuICAgIGRhdGFba2V5XSA9IHZhbFxuICAgIHJldHVybiB0aGlzLnNhdmUocGF0aCwgZGF0YSlcbiAgfVxuXG4gIGxvYWQgKGtleSkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuZnVsbEtleShrZXkpKSlcbiAgICB9XG4gIH1cblxuICBmdWxsS2V5IChrZXkpIHtcbiAgICByZXR1cm4gJ0NvZGVXYXZlXycgKyBrZXlcbiAgfVxufVxuZXhwb3J0cy5Mb2NhbFN0b3JhZ2VFbmdpbmUgPSBMb2NhbFN0b3JhZ2VFbmdpbmVcbiIsIlxudmFyIENvbnRleHQgPSBjbGFzcyBDb250ZXh0IHtcbiAgY29uc3RydWN0b3IgKHBhcnNlciwgcGFyZW50KSB7XG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZXJcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudFxuICAgIHRoaXMuY29udGVudCA9ICcnXG4gIH1cblxuICBvblN0YXJ0ICgpIHtcbiAgICB0aGlzLnN0YXJ0QXQgPSB0aGlzLnBhcnNlci5wb3NcbiAgfVxuXG4gIG9uQ2hhciAoY2hhcikge31cblxuICBlbmQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlci5zZXRDb250ZXh0KHRoaXMucGFyZW50KVxuICB9XG5cbiAgb25FbmQgKCkge31cblxuICB0ZXN0Q29udGV4dCAoQ29udGV4dFR5cGUpIHtcbiAgICBpZiAoQ29udGV4dFR5cGUudGVzdCh0aGlzLnBhcnNlci5jaGFyLCB0aGlzKSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLnNldENvbnRleHQobmV3IENvbnRleHRUeXBlKHRoaXMucGFyc2VyLCB0aGlzKSlcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdGVzdCAoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbmV4cG9ydHMuQ29udGV4dCA9IENvbnRleHRcbiIsIlxuY29uc3QgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpLkNvbnRleHRcblxudmFyIEVzY2FwZUNvbnRleHQgPSBjbGFzcyBFc2NhcGVDb250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uQ2hhciAoY2hhcikge1xuICAgIHRoaXMucGFyZW50LmNvbnRlbnQgKz0gY2hhclxuICAgIHJldHVybiB0aGlzLmVuZCgpXG4gIH1cblxuICBzdGF0aWMgdGVzdCAoY2hhcikge1xuICAgIHJldHVybiBjaGFyID09PSAnXFxcXCdcbiAgfVxufVxuZXhwb3J0cy5Fc2NhcGVDb250ZXh0ID0gRXNjYXBlQ29udGV4dFxuIiwiXG5jb25zdCBQYXJhbUNvbnRleHQgPSByZXF1aXJlKCcuL1BhcmFtQ29udGV4dCcpLlBhcmFtQ29udGV4dFxuXG52YXIgTmFtZWRDb250ZXh0ID0gY2xhc3MgTmFtZWRDb250ZXh0IGV4dGVuZHMgUGFyYW1Db250ZXh0IHtcbiAgb25TdGFydCAoKSB7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5wYXJlbnQuY29udGVudFxuICB9XG5cbiAgb25FbmQgKCkge1xuICAgIHRoaXMucGFyc2VyLm5hbWVkW3RoaXMubmFtZV0gPSB0aGlzLmNvbnRlbnRcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0IChjaGFyLCBwYXJlbnQpIHtcbiAgICByZXR1cm4gY2hhciA9PT0gJzonICYmIChwYXJlbnQucGFyc2VyLm9wdGlvbnMuYWxsb3dlZE5hbWVkID09IG51bGwgfHwgcGFyZW50LnBhcnNlci5vcHRpb25zLmFsbG93ZWROYW1lZC5pbmRleE9mKHBhcmVudC5jb250ZW50KSA+PSAwKVxuICB9XG59XG5leHBvcnRzLk5hbWVkQ29udGV4dCA9IE5hbWVkQ29udGV4dFxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBTdHJpbmdDb250ZXh0ID0gcmVxdWlyZSgnLi9TdHJpbmdDb250ZXh0JykuU3RyaW5nQ29udGV4dFxuXG5jb25zdCBWYXJpYWJsZUNvbnRleHQgPSByZXF1aXJlKCcuL1ZhcmlhYmxlQ29udGV4dCcpLlZhcmlhYmxlQ29udGV4dFxuXG52YXIgUGFyYW1Db250ZXh0ID0gY2xhc3MgUGFyYW1Db250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uQ2hhciAoY2hhcikge1xuICAgIGlmICh0aGlzLnRlc3RDb250ZXh0KFN0cmluZ0NvbnRleHQpKSB7fSBlbHNlIGlmICh0aGlzLnRlc3RDb250ZXh0KFBhcmFtQ29udGV4dC5uYW1lZCkpIHt9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoVmFyaWFibGVDb250ZXh0KSkge30gZWxzZSBpZiAoY2hhciA9PT0gJyAnKSB7XG4gICAgICB0aGlzLnBhcnNlci5zZXRDb250ZXh0KG5ldyBQYXJhbUNvbnRleHQodGhpcy5wYXJzZXIpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRlbnQgKz0gY2hhclxuICAgIH1cbiAgfVxuXG4gIG9uRW5kICgpIHtcbiAgICB0aGlzLnBhcnNlci5wYXJhbXMucHVzaCh0aGlzLmNvbnRlbnQpXG4gIH1cbn1cbmV4cG9ydHMuUGFyYW1Db250ZXh0ID0gUGFyYW1Db250ZXh0XG4iLCJcbmNvbnN0IFBhcmFtQ29udGV4dCA9IHJlcXVpcmUoJy4vUGFyYW1Db250ZXh0JykuUGFyYW1Db250ZXh0XG5cbmNvbnN0IE5hbWVkQ29udGV4dCA9IHJlcXVpcmUoJy4vTmFtZWRDb250ZXh0JykuTmFtZWRDb250ZXh0XG5cblBhcmFtQ29udGV4dC5uYW1lZCA9IE5hbWVkQ29udGV4dFxudmFyIFBhcmFtUGFyc2VyID0gY2xhc3MgUGFyYW1QYXJzZXIge1xuICBjb25zdHJ1Y3RvciAocGFyYW1TdHJpbmcsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMucGFyYW1TdHJpbmcgPSBwYXJhbVN0cmluZ1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLnBhcnNlKClcbiAgfVxuXG4gIHNldENvbnRleHQgKGNvbnRleHQpIHtcbiAgICB2YXIgb2xkQ29udGV4dFxuICAgIG9sZENvbnRleHQgPSB0aGlzLmNvbnRleHRcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XG5cbiAgICBpZiAob2xkQ29udGV4dCAhPSBudWxsICYmIG9sZENvbnRleHQgIT09IChjb250ZXh0ICE9IG51bGwgPyBjb250ZXh0LnBhcmVudCA6IG51bGwpKSB7XG4gICAgICBvbGRDb250ZXh0Lm9uRW5kKClcbiAgICB9XG5cbiAgICBpZiAoY29udGV4dCAhPSBudWxsKSB7XG4gICAgICBjb250ZXh0Lm9uU3RhcnQoKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvbnRleHRcbiAgfVxuXG4gIHBhcnNlICgpIHtcbiAgICB0aGlzLnBhcmFtcyA9IFtdXG4gICAgdGhpcy5uYW1lZCA9IHt9XG5cbiAgICBpZiAodGhpcy5wYXJhbVN0cmluZy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0Q29udGV4dChuZXcgUGFyYW1Db250ZXh0KHRoaXMpKVxuICAgICAgdGhpcy5wb3MgPSAwXG5cbiAgICAgIHdoaWxlICh0aGlzLnBvcyA8IHRoaXMucGFyYW1TdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY2hhciA9IHRoaXMucGFyYW1TdHJpbmdbdGhpcy5wb3NdXG4gICAgICAgIHRoaXMuY29udGV4dC5vbkNoYXIodGhpcy5jaGFyKVxuICAgICAgICB0aGlzLnBvcysrXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNldENvbnRleHQobnVsbClcbiAgICB9XG4gIH1cblxuICB0YWtlIChuYikge1xuICAgIHJldHVybiB0aGlzLnBhcmFtU3RyaW5nLnN1YnN0cmluZyh0aGlzLnBvcywgdGhpcy5wb3MgKyBuYilcbiAgfVxuXG4gIHNraXAgKG5iID0gMSkge1xuICAgIHRoaXMucG9zICs9IG5iXG4gIH1cbn1cbmV4cG9ydHMuUGFyYW1QYXJzZXIgPSBQYXJhbVBhcnNlclxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG5jb25zdCBFc2NhcGVDb250ZXh0ID0gcmVxdWlyZSgnLi9Fc2NhcGVDb250ZXh0JykuRXNjYXBlQ29udGV4dFxuXG5jb25zdCBWYXJpYWJsZUNvbnRleHQgPSByZXF1aXJlKCcuL1ZhcmlhYmxlQ29udGV4dCcpLlZhcmlhYmxlQ29udGV4dFxuXG52YXIgU3RyaW5nQ29udGV4dCA9IGNsYXNzIFN0cmluZ0NvbnRleHQgZXh0ZW5kcyBDb250ZXh0IHtcbiAgb25DaGFyIChjaGFyKSB7XG4gICAgaWYgKHRoaXMudGVzdENvbnRleHQoRXNjYXBlQ29udGV4dCkpIHt9IGVsc2UgaWYgKHRoaXMudGVzdENvbnRleHQoVmFyaWFibGVDb250ZXh0KSkge30gZWxzZSBpZiAoU3RyaW5nQ29udGV4dC5pc0RlbGltaXRlcihjaGFyKSkge1xuICAgICAgdGhpcy5lbmQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRlbnQgKz0gY2hhclxuICAgIH1cbiAgfVxuXG4gIG9uRW5kICgpIHtcbiAgICB0aGlzLnBhcmVudC5jb250ZW50ICs9IHRoaXMuY29udGVudFxuICB9XG5cbiAgc3RhdGljIHRlc3QgKGNoYXIpIHtcbiAgICByZXR1cm4gdGhpcy5pc0RlbGltaXRlcihjaGFyKVxuICB9XG5cbiAgc3RhdGljIGlzRGVsaW1pdGVyIChjaGFyKSB7XG4gICAgcmV0dXJuIGNoYXIgPT09ICdcIicgfHwgY2hhciA9PT0gXCInXCJcbiAgfVxufVxuZXhwb3J0cy5TdHJpbmdDb250ZXh0ID0gU3RyaW5nQ29udGV4dFxuIiwiXG5jb25zdCBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0JykuQ29udGV4dFxuXG52YXIgVmFyaWFibGVDb250ZXh0ID0gY2xhc3MgVmFyaWFibGVDb250ZXh0IGV4dGVuZHMgQ29udGV4dCB7XG4gIG9uU3RhcnQgKCkge1xuICAgIHRoaXMucGFyc2VyLnNraXAoKVxuICB9XG5cbiAgb25DaGFyIChjaGFyKSB7XG4gICAgaWYgKGNoYXIgPT09ICd9Jykge1xuICAgICAgdGhpcy5lbmQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRlbnQgKz0gY2hhclxuICAgIH1cbiAgfVxuXG4gIG9uRW5kICgpIHtcbiAgICB2YXIgcmVmXG4gICAgdGhpcy5wYXJlbnQuY29udGVudCArPSAoKHJlZiA9IHRoaXMucGFyc2VyLm9wdGlvbnMudmFycykgIT0gbnVsbCA/IHJlZlt0aGlzLmNvbnRlbnRdIDogbnVsbCkgfHwgJydcbiAgfVxuXG4gIHN0YXRpYyB0ZXN0IChjaGFyLCBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50LnBhcnNlci50YWtlKDIpID09PSAnI3snXG4gIH1cbn1cbmV4cG9ydHMuVmFyaWFibGVDb250ZXh0ID0gVmFyaWFibGVDb250ZXh0XG4iLCIvKiFcbiAqIGluZmxlY3Rpb25cbiAqIENvcHlyaWdodChjKSAyMDExIEJlbiBMaW4gPGJlbkBkcmVhbWVyc2xhYi5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBBIHBvcnQgb2YgaW5mbGVjdGlvbi1qcyB0byBub2RlLmpzIG1vZHVsZS5cbiAqL1xuXG4oIGZ1bmN0aW9uICggcm9vdCwgZmFjdG9yeSApe1xuICBpZiggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICl7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5ICk7XG4gIH1lbHNlIGlmKCB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfWVsc2V7XG4gICAgcm9vdC5pbmZsZWN0aW9uID0gZmFjdG9yeSgpO1xuICB9XG59KCB0aGlzLCBmdW5jdGlvbiAoKXtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoaXMgaXMgYSBsaXN0IG9mIG5vdW5zIHRoYXQgdXNlIHRoZSBzYW1lIGZvcm0gZm9yIGJvdGggc2luZ3VsYXIgYW5kIHBsdXJhbC5cbiAgICogICAgICAgICAgICAgIFRoaXMgbGlzdCBzaG91bGQgcmVtYWluIGVudGlyZWx5IGluIGxvd2VyIGNhc2UgdG8gY29ycmVjdGx5IG1hdGNoIFN0cmluZ3MuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgdW5jb3VudGFibGVfd29yZHMgPSBbXG4gICAgLy8gJ2FjY2VzcycsXG4gICAgJ2FjY29tbW9kYXRpb24nLFxuICAgICdhZHVsdGhvb2QnLFxuICAgICdhZHZlcnRpc2luZycsXG4gICAgJ2FkdmljZScsXG4gICAgJ2FnZ3Jlc3Npb24nLFxuICAgICdhaWQnLFxuICAgICdhaXInLFxuICAgICdhaXJjcmFmdCcsXG4gICAgJ2FsY29ob2wnLFxuICAgICdhbmdlcicsXG4gICAgJ2FwcGxhdXNlJyxcbiAgICAnYXJpdGhtZXRpYycsXG4gICAgLy8gJ2FydCcsXG4gICAgJ2Fzc2lzdGFuY2UnLFxuICAgICdhdGhsZXRpY3MnLFxuICAgIC8vICdhdHRlbnRpb24nLFxuXG4gICAgJ2JhY29uJyxcbiAgICAnYmFnZ2FnZScsXG4gICAgLy8gJ2JhbGxldCcsXG4gICAgLy8gJ2JlYXV0eScsXG4gICAgJ2JlZWYnLFxuICAgIC8vICdiZWVyJyxcbiAgICAvLyAnYmVoYXZpb3InLFxuICAgICdiaW9sb2d5JyxcbiAgICAvLyAnYmlsbGlhcmRzJyxcbiAgICAnYmxvb2QnLFxuICAgICdib3RhbnknLFxuICAgIC8vICdib3dlbHMnLFxuICAgICdicmVhZCcsXG4gICAgLy8gJ2J1c2luZXNzJyxcbiAgICAnYnV0dGVyJyxcblxuICAgICdjYXJib24nLFxuICAgICdjYXJkYm9hcmQnLFxuICAgICdjYXNoJyxcbiAgICAnY2hhbGsnLFxuICAgICdjaGFvcycsXG4gICAgJ2NoZXNzJyxcbiAgICAnY3Jvc3Nyb2FkcycsXG4gICAgJ2NvdW50cnlzaWRlJyxcblxuICAgIC8vICdkYW1hZ2UnLFxuICAgICdkYW5jaW5nJyxcbiAgICAvLyAnZGFuZ2VyJyxcbiAgICAnZGVlcicsXG4gICAgLy8gJ2RlbGlnaHQnLFxuICAgIC8vICdkZXNzZXJ0JyxcbiAgICAnZGlnbml0eScsXG4gICAgJ2RpcnQnLFxuICAgIC8vICdkaXN0cmlidXRpb24nLFxuICAgICdkdXN0JyxcblxuICAgICdlY29ub21pY3MnLFxuICAgICdlZHVjYXRpb24nLFxuICAgICdlbGVjdHJpY2l0eScsXG4gICAgLy8gJ2VtcGxveW1lbnQnLFxuICAgIC8vICdlbmVyZ3knLFxuICAgICdlbmdpbmVlcmluZycsXG4gICAgJ2Vuam95bWVudCcsXG4gICAgLy8gJ2VudGVydGFpbm1lbnQnLFxuICAgICdlbnZ5JyxcbiAgICAnZXF1aXBtZW50JyxcbiAgICAnZXRoaWNzJyxcbiAgICAnZXZpZGVuY2UnLFxuICAgICdldm9sdXRpb24nLFxuXG4gICAgLy8gJ2ZhaWx1cmUnLFxuICAgIC8vICdmYWl0aCcsXG4gICAgJ2ZhbWUnLFxuICAgICdmaWN0aW9uJyxcbiAgICAvLyAnZmlzaCcsXG4gICAgJ2Zsb3VyJyxcbiAgICAnZmx1JyxcbiAgICAnZm9vZCcsXG4gICAgLy8gJ2ZyZWVkb20nLFxuICAgIC8vICdmcnVpdCcsXG4gICAgJ2Z1ZWwnLFxuICAgICdmdW4nLFxuICAgIC8vICdmdW5lcmFsJyxcbiAgICAnZnVybml0dXJlJyxcblxuICAgICdnYWxsb3dzJyxcbiAgICAnZ2FyYmFnZScsXG4gICAgJ2dhcmxpYycsXG4gICAgLy8gJ2dhcycsXG4gICAgJ2dlbmV0aWNzJyxcbiAgICAvLyAnZ2xhc3MnLFxuICAgICdnb2xkJyxcbiAgICAnZ29sZicsXG4gICAgJ2dvc3NpcCcsXG4gICAgJ2dyYW1tYXInLFxuICAgIC8vICdncmFzcycsXG4gICAgJ2dyYXRpdHVkZScsXG4gICAgJ2dyaWVmJyxcbiAgICAvLyAnZ3JvdW5kJyxcbiAgICAnZ3VpbHQnLFxuICAgICdneW1uYXN0aWNzJyxcblxuICAgIC8vICdoYWlyJyxcbiAgICAnaGFwcGluZXNzJyxcbiAgICAnaGFyZHdhcmUnLFxuICAgICdoYXJtJyxcbiAgICAnaGF0ZScsXG4gICAgJ2hhdHJlZCcsXG4gICAgJ2hlYWx0aCcsXG4gICAgJ2hlYXQnLFxuICAgIC8vICdoZWlnaHQnLFxuICAgICdoZWxwJyxcbiAgICAnaG9tZXdvcmsnLFxuICAgICdob25lc3R5JyxcbiAgICAnaG9uZXknLFxuICAgICdob3NwaXRhbGl0eScsXG4gICAgJ2hvdXNld29yaycsXG4gICAgJ2h1bW91cicsXG4gICAgJ2h1bmdlcicsXG4gICAgJ2h5ZHJvZ2VuJyxcblxuICAgICdpY2UnLFxuICAgICdpbXBvcnRhbmNlJyxcbiAgICAnaW5mbGF0aW9uJyxcbiAgICAnaW5mb3JtYXRpb24nLFxuICAgIC8vICdpbmp1c3RpY2UnLFxuICAgICdpbm5vY2VuY2UnLFxuICAgIC8vICdpbnRlbGxpZ2VuY2UnLFxuICAgICdpcm9uJyxcbiAgICAnaXJvbnknLFxuXG4gICAgJ2phbScsXG4gICAgLy8gJ2plYWxvdXN5JyxcbiAgICAvLyAnamVsbHknLFxuICAgICdqZXdlbHJ5JyxcbiAgICAvLyAnam95JyxcbiAgICAnanVkbycsXG4gICAgLy8gJ2p1aWNlJyxcbiAgICAvLyAnanVzdGljZScsXG5cbiAgICAna2FyYXRlJyxcbiAgICAvLyAna2luZG5lc3MnLFxuICAgICdrbm93bGVkZ2UnLFxuXG4gICAgLy8gJ2xhYm91cicsXG4gICAgJ2xhY2snLFxuICAgIC8vICdsYW5kJyxcbiAgICAnbGF1Z2h0ZXInLFxuICAgICdsYXZhJyxcbiAgICAnbGVhdGhlcicsXG4gICAgJ2xlaXN1cmUnLFxuICAgICdsaWdodG5pbmcnLFxuICAgICdsaW5ndWluZScsXG4gICAgJ2xpbmd1aW5pJyxcbiAgICAnbGluZ3Vpc3RpY3MnLFxuICAgICdsaXRlcmF0dXJlJyxcbiAgICAnbGl0dGVyJyxcbiAgICAnbGl2ZXN0b2NrJyxcbiAgICAnbG9naWMnLFxuICAgICdsb25lbGluZXNzJyxcbiAgICAvLyAnbG92ZScsXG4gICAgJ2x1Y2snLFxuICAgICdsdWdnYWdlJyxcblxuICAgICdtYWNhcm9uaScsXG4gICAgJ21hY2hpbmVyeScsXG4gICAgJ21hZ2ljJyxcbiAgICAvLyAnbWFpbCcsXG4gICAgJ21hbmFnZW1lbnQnLFxuICAgICdtYW5raW5kJyxcbiAgICAnbWFyYmxlJyxcbiAgICAnbWF0aGVtYXRpY3MnLFxuICAgICdtYXlvbm5haXNlJyxcbiAgICAnbWVhc2xlcycsXG4gICAgLy8gJ21lYXQnLFxuICAgIC8vICdtZXRhbCcsXG4gICAgJ21ldGhhbmUnLFxuICAgICdtaWxrJyxcbiAgICAnbWludXMnLFxuICAgICdtb25leScsXG4gICAgLy8gJ21vb3NlJyxcbiAgICAnbXVkJyxcbiAgICAnbXVzaWMnLFxuICAgICdtdW1wcycsXG5cbiAgICAnbmF0dXJlJyxcbiAgICAnbmV3cycsXG4gICAgJ25pdHJvZ2VuJyxcbiAgICAnbm9uc2Vuc2UnLFxuICAgICdudXJ0dXJlJyxcbiAgICAnbnV0cml0aW9uJyxcblxuICAgICdvYmVkaWVuY2UnLFxuICAgICdvYmVzaXR5JyxcbiAgICAvLyAnb2lsJyxcbiAgICAnb3h5Z2VuJyxcblxuICAgIC8vICdwYXBlcicsXG4gICAgLy8gJ3Bhc3Npb24nLFxuICAgICdwYXN0YScsXG4gICAgJ3BhdGllbmNlJyxcbiAgICAvLyAncGVybWlzc2lvbicsXG4gICAgJ3BoeXNpY3MnLFxuICAgICdwb2V0cnknLFxuICAgICdwb2xsdXRpb24nLFxuICAgICdwb3ZlcnR5JyxcbiAgICAvLyAncG93ZXInLFxuICAgICdwcmlkZScsXG4gICAgLy8gJ3Byb2R1Y3Rpb24nLFxuICAgIC8vICdwcm9ncmVzcycsXG4gICAgLy8gJ3Byb251bmNpYXRpb24nLFxuICAgICdwc3ljaG9sb2d5JyxcbiAgICAncHVibGljaXR5JyxcbiAgICAncHVuY3R1YXRpb24nLFxuXG4gICAgLy8gJ3F1YWxpdHknLFxuICAgIC8vICdxdWFudGl0eScsXG4gICAgJ3F1YXJ0eicsXG5cbiAgICAncmFjaXNtJyxcbiAgICAvLyAncmFpbicsXG4gICAgLy8gJ3JlY3JlYXRpb24nLFxuICAgICdyZWxheGF0aW9uJyxcbiAgICAncmVsaWFiaWxpdHknLFxuICAgICdyZXNlYXJjaCcsXG4gICAgJ3Jlc3BlY3QnLFxuICAgICdyZXZlbmdlJyxcbiAgICAncmljZScsXG4gICAgJ3J1YmJpc2gnLFxuICAgICdydW0nLFxuXG4gICAgJ3NhZmV0eScsXG4gICAgLy8gJ3NhbGFkJyxcbiAgICAvLyAnc2FsdCcsXG4gICAgLy8gJ3NhbmQnLFxuICAgIC8vICdzYXRpcmUnLFxuICAgICdzY2VuZXJ5JyxcbiAgICAnc2VhZm9vZCcsXG4gICAgJ3NlYXNpZGUnLFxuICAgICdzZXJpZXMnLFxuICAgICdzaGFtZScsXG4gICAgJ3NoZWVwJyxcbiAgICAnc2hvcHBpbmcnLFxuICAgIC8vICdzaWxlbmNlJyxcbiAgICAnc2xlZXAnLFxuICAgIC8vICdzbGFuZydcbiAgICAnc21va2UnLFxuICAgICdzbW9raW5nJyxcbiAgICAnc25vdycsXG4gICAgJ3NvYXAnLFxuICAgICdzb2Z0d2FyZScsXG4gICAgJ3NvaWwnLFxuICAgIC8vICdzb3Jyb3cnLFxuICAgIC8vICdzb3VwJyxcbiAgICAnc3BhZ2hldHRpJyxcbiAgICAvLyAnc3BlZWQnLFxuICAgICdzcGVjaWVzJyxcbiAgICAvLyAnc3BlbGxpbmcnLFxuICAgIC8vICdzcG9ydCcsXG4gICAgJ3N0ZWFtJyxcbiAgICAvLyAnc3RyZW5ndGgnLFxuICAgICdzdHVmZicsXG4gICAgJ3N0dXBpZGl0eScsXG4gICAgLy8gJ3N1Y2Nlc3MnLFxuICAgIC8vICdzdWdhcicsXG4gICAgJ3N1bnNoaW5lJyxcbiAgICAnc3ltbWV0cnknLFxuXG4gICAgLy8gJ3RlYScsXG4gICAgJ3Rlbm5pcycsXG4gICAgJ3RoaXJzdCcsXG4gICAgJ3RodW5kZXInLFxuICAgICd0aW1iZXInLFxuICAgIC8vICd0aW1lJyxcbiAgICAvLyAndG9hc3QnLFxuICAgIC8vICd0b2xlcmFuY2UnLFxuICAgIC8vICd0cmFkZScsXG4gICAgJ3RyYWZmaWMnLFxuICAgICd0cmFuc3BvcnRhdGlvbicsXG4gICAgLy8gJ3RyYXZlbCcsXG4gICAgJ3RydXN0JyxcblxuICAgIC8vICd1bmRlcnN0YW5kaW5nJyxcbiAgICAndW5kZXJ3ZWFyJyxcbiAgICAndW5lbXBsb3ltZW50JyxcbiAgICAndW5pdHknLFxuICAgIC8vICd1c2FnZScsXG5cbiAgICAndmFsaWRpdHknLFxuICAgICd2ZWFsJyxcbiAgICAndmVnZXRhdGlvbicsXG4gICAgJ3ZlZ2V0YXJpYW5pc20nLFxuICAgICd2ZW5nZWFuY2UnLFxuICAgICd2aW9sZW5jZScsXG4gICAgLy8gJ3Zpc2lvbicsXG4gICAgJ3ZpdGFsaXR5JyxcblxuICAgICd3YXJtdGgnLFxuICAgIC8vICd3YXRlcicsXG4gICAgJ3dlYWx0aCcsXG4gICAgJ3dlYXRoZXInLFxuICAgIC8vICd3ZWlnaHQnLFxuICAgICd3ZWxmYXJlJyxcbiAgICAnd2hlYXQnLFxuICAgIC8vICd3aGlza2V5JyxcbiAgICAvLyAnd2lkdGgnLFxuICAgICd3aWxkbGlmZScsXG4gICAgLy8gJ3dpbmUnLFxuICAgICd3aXNkb20nLFxuICAgIC8vICd3b29kJyxcbiAgICAvLyAnd29vbCcsXG4gICAgLy8gJ3dvcmsnLFxuXG4gICAgLy8gJ3llYXN0JyxcbiAgICAneW9nYScsXG5cbiAgICAnemluYycsXG4gICAgJ3pvb2xvZ3knXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBydWxlcyB0cmFuc2xhdGUgZnJvbSB0aGUgc2luZ3VsYXIgZm9ybSBvZiBhIG5vdW4gdG8gaXRzIHBsdXJhbCBmb3JtLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICB2YXIgcmVnZXggPSB7XG4gICAgcGx1cmFsIDoge1xuICAgICAgbWVuICAgICAgIDogbmV3IFJlZ0V4cCggJ14obXx3b20pZW4kJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBwZW9wbGUgICAgOiBuZXcgUmVnRXhwKCAnKHBlKW9wbGUkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNoaWxkcmVuICA6IG5ldyBSZWdFeHAoICcoY2hpbGQpcmVuJCcgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdGlhICAgICAgIDogbmV3IFJlZ0V4cCggJyhbdGldKWEkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBhbmFseXNlcyAgOiBuZXcgUmVnRXhwKCAnKChhKW5hbHl8KGIpYXwoZClpYWdub3wocClhcmVudGhlfChwKXJvZ25vfChzKXlub3B8KHQpaGUpc2VzJCcsJ2dpJyApLFxuICAgICAgaGl2ZXMgICAgIDogbmV3IFJlZ0V4cCggJyhoaXx0aSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjdXJ2ZXMgICAgOiBuZXcgUmVnRXhwKCAnKGN1cnZlKXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGxydmVzICAgICA6IG5ldyBSZWdFeHAoICcoW2xyXSl2ZXMkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYXZlcyAgICAgIDogbmV3IFJlZ0V4cCggJyhbYV0pdmVzJCcgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBmb3ZlcyAgICAgOiBuZXcgUmVnRXhwKCAnKFteZm9dKXZlcyQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1vdmllcyAgICA6IG5ldyBSZWdFeHAoICcobSlvdmllcyQnICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWVpb3V5aWVzIDogbmV3IFJlZ0V4cCggJyhbXmFlaW91eV18cXUpaWVzJCcgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzZXJpZXMgICAgOiBuZXcgUmVnRXhwKCAnKHMpZXJpZXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHhlcyAgICAgICA6IG5ldyBSZWdFeHAoICcoeHxjaHxzc3xzaCllcyQnICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWljZSAgICAgIDogbmV3IFJlZ0V4cCggJyhbbXxsXSlpY2UkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBidXNlcyAgICAgOiBuZXcgUmVnRXhwKCAnKGJ1cyllcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9lcyAgICAgICA6IG5ldyBSZWdFeHAoICcobyllcyQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc2hvZXMgICAgIDogbmV3IFJlZ0V4cCggJyhzaG9lKXMkJyAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjcmlzZXMgICAgOiBuZXcgUmVnRXhwKCAnKGNyaXN8YXh8dGVzdCllcyQnICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9jdG9waSAgICA6IG5ldyBSZWdFeHAoICcob2N0b3B8dmlyKWkkJyAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgYWxpYXNlcyAgIDogbmV3IFJlZ0V4cCggJyhhbGlhc3xjYW52YXN8c3RhdHVzfGNhbXB1cyllcyQnLCAnZ2knICksXG4gICAgICBzdW1tb25zZXMgOiBuZXcgUmVnRXhwKCAnXihzdW1tb25zKWVzJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG94ZW4gICAgICA6IG5ldyBSZWdFeHAoICdeKG94KWVuJyAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgbWF0cmljZXMgIDogbmV3IFJlZ0V4cCggJyhtYXRyKWljZXMkJyAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICB2ZXJ0aWNlcyAgOiBuZXcgUmVnRXhwKCAnKHZlcnR8aW5kKWljZXMkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZlZXQgICAgICA6IG5ldyBSZWdFeHAoICdeZmVldCQnICAgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgdGVldGggICAgIDogbmV3IFJlZ0V4cCggJ150ZWV0aCQnICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBnZWVzZSAgICAgOiBuZXcgUmVnRXhwKCAnXmdlZXNlJCcgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHF1aXp6ZXMgICA6IG5ldyBSZWdFeHAoICcocXVpeil6ZXMkJyAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgd2hlcmVhc2VzIDogbmV3IFJlZ0V4cCggJ14od2hlcmVhcyllcyQnICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBjcml0ZXJpYSAgOiBuZXcgUmVnRXhwKCAnXihjcml0ZXJpKWEkJyAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlbmVyYSAgICA6IG5ldyBSZWdFeHAoICdeZ2VuZXJhJCcgICAgICAgICAgICAgICAgICAgICAgICwgJ2dpJyApLFxuICAgICAgc3MgICAgICAgIDogbmV3IFJlZ0V4cCggJ3NzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgLCAnZ2knICksXG4gICAgICBzICAgICAgICAgOiBuZXcgUmVnRXhwKCAncyQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKVxuICAgIH0sXG5cbiAgICBzaW5ndWxhciA6IHtcbiAgICAgIG1hbiAgICAgICA6IG5ldyBSZWdFeHAoICdeKG18d29tKWFuJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHBlcnNvbiAgICA6IG5ldyBSZWdFeHAoICcocGUpcnNvbiQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNoaWxkICAgICA6IG5ldyBSZWdFeHAoICcoY2hpbGQpJCcgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG94ICAgICAgICA6IG5ldyBSZWdFeHAoICdeKG94KSQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGF4aXMgICAgICA6IG5ldyBSZWdFeHAoICcoYXh8dGVzdClpcyQnICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG9jdG9wdXMgICA6IG5ldyBSZWdFeHAoICcob2N0b3B8dmlyKXVzJCcgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFsaWFzICAgICA6IG5ldyBSZWdFeHAoICcoYWxpYXN8c3RhdHVzfGNhbnZhc3xjYW1wdXMpJCcsICdnaScgKSxcbiAgICAgIHN1bW1vbnMgICA6IG5ldyBSZWdFeHAoICdeKHN1bW1vbnMpJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1cyAgICAgICA6IG5ldyBSZWdFeHAoICcoYnUpcyQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGJ1ZmZhbG8gICA6IG5ldyBSZWdFeHAoICcoYnVmZmFsfHRvbWF0fHBvdGF0KW8kJyAgICAgICAsICdnaScgKSxcbiAgICAgIHRpdW0gICAgICA6IG5ldyBSZWdFeHAoICcoW3RpXSl1bSQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHNpcyAgICAgICA6IG5ldyBSZWdFeHAoICdzaXMkJyAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZmZSAgICAgICA6IG5ldyBSZWdFeHAoICcoPzooW15mXSlmZXwoW2xyXSlmKSQnICAgICAgICAsICdnaScgKSxcbiAgICAgIGhpdmUgICAgICA6IG5ldyBSZWdFeHAoICcoaGl8dGkpdmUkJyAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGFlaW91eXkgICA6IG5ldyBSZWdFeHAoICcoW15hZWlvdXldfHF1KXkkJyAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHggICAgICAgICA6IG5ldyBSZWdFeHAoICcoeHxjaHxzc3xzaCkkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1hdHJpeCAgICA6IG5ldyBSZWdFeHAoICcobWF0cilpeCQnICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHZlcnRleCAgICA6IG5ldyBSZWdFeHAoICcodmVydHxpbmQpZXgkJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIG1vdXNlICAgICA6IG5ldyBSZWdFeHAoICcoW218bF0pb3VzZSQnICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGZvb3QgICAgICA6IG5ldyBSZWdFeHAoICdeZm9vdCQnICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHRvb3RoICAgICA6IG5ldyBSZWdFeHAoICdedG9vdGgkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdvb3NlICAgICA6IG5ldyBSZWdFeHAoICdeZ29vc2UkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHF1aXogICAgICA6IG5ldyBSZWdFeHAoICcocXVpeikkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHdoZXJlYXMgICA6IG5ldyBSZWdFeHAoICdeKHdoZXJlYXMpJCcgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNyaXRlcmlvbiA6IG5ldyBSZWdFeHAoICdeKGNyaXRlcmkpb24kJyAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGdlbnVzICAgICA6IG5ldyBSZWdFeHAoICdeZ2VudXMkJyAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIHMgICAgICAgICA6IG5ldyBSZWdFeHAoICdzJCcgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKSxcbiAgICAgIGNvbW1vbiAgICA6IG5ldyBSZWdFeHAoICckJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAsICdnaScgKVxuICAgIH1cbiAgfTtcblxuICB2YXIgcGx1cmFsX3J1bGVzID0gW1xuXG4gICAgLy8gZG8gbm90IHJlcGxhY2UgaWYgaXRzIGFscmVhZHkgYSBwbHVyYWwgd29yZFxuICAgIFsgcmVnZXgucGx1cmFsLm1lbiAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnBlb3BsZSAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNoaWxkcmVuICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnRpYSAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFuYWx5c2VzICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmhpdmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmN1cnZlcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmxydmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZvdmVzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFlaW91eWllcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNlcmllcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1vdmllcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnhlcyAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1pY2UgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmJ1c2VzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9lcyAgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnNob2VzICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXNlcyAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9jdG9waSAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFsaWFzZXMgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnN1bW1vbnNlcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm94ZW4gICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1hdHJpY2VzICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZlZXQgICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnRlZXRoICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlZXNlICAgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnF1aXp6ZXMgICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLndoZXJlYXNlcyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNyaXRlcmlhICBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlbmVyYSAgICBdLFxuXG4gICAgLy8gb3JpZ2luYWwgcnVsZVxuICAgIFsgcmVnZXguc2luZ3VsYXIubWFuICAgICAgLCAnJDFlbicgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnBlcnNvbiAgICwgJyQxb3BsZScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmNoaWxkICAgICwgJyQxcmVuJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub3ggICAgICAgLCAnJDFlbicgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmF4aXMgICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5vY3RvcHVzICAsICckMWknIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hbGlhcyAgICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc3VtbW9ucyAgLCAnJDFlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmJ1cyAgICAgICwgJyQxc2VzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVmZmFsbyAgLCAnJDFvZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50aXVtICAgICAsICckMWEnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5zaXMgICAgICAsICdzZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5mZmUgICAgICAsICckMSQydmVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuaGl2ZSAgICAgLCAnJDF2ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5hZWlvdXl5ICAsICckMWllcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLm1hdHJpeCAgICwgJyQxaWNlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnZlcnRleCAgICwgJyQxaWNlcycgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLnggICAgICAgICwgJyQxZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5tb3VzZSAgICAsICckMWljZScgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmZvb3QgICAgICwgJ2ZlZXQnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci50b290aCAgICAsICd0ZWV0aCcgXSxcbiAgICBbIHJlZ2V4LnNpbmd1bGFyLmdvb3NlICAgICwgJ2dlZXNlJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucXVpeiAgICAgLCAnJDF6ZXMnIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci53aGVyZWFzICAsICckMWVzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY3JpdGVyaW9uLCAnJDFhJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ2VudXMgICAgLCAnZ2VuZXJhJyBdLFxuXG4gICAgWyByZWdleC5zaW5ndWxhci5zICAgICAsICdzJyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY29tbW9uLCAncycgXVxuICBdO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhlc2UgcnVsZXMgdHJhbnNsYXRlIGZyb20gdGhlIHBsdXJhbCBmb3JtIG9mIGEgbm91biB0byBpdHMgc2luZ3VsYXIgZm9ybS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhciBzaW5ndWxhcl9ydWxlcyA9IFtcblxuICAgIC8vIGRvIG5vdCByZXBsYWNlIGlmIGl0cyBhbHJlYWR5IGEgc2luZ3VsYXIgd29yZFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWFuICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucGVyc29uICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY2hpbGQgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub3ggICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYXhpcyAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIub2N0b3B1cyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYWxpYXMgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc3VtbW9ucyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVzICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYnVmZmFsbyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudGl1bSAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuc2lzICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZmZlICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuaGl2ZSAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuYWVpb3V5eSBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIueCAgICAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubWF0cml4ICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIubW91c2UgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZm9vdCAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIudG9vdGggICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuZ29vc2UgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIucXVpeiAgICBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIud2hlcmVhcyBdLFxuICAgIFsgcmVnZXguc2luZ3VsYXIuY3JpdGVyaW9uIF0sXG4gICAgWyByZWdleC5zaW5ndWxhci5nZW51cyBdLFxuXG4gICAgLy8gb3JpZ2luYWwgcnVsZVxuICAgIFsgcmVnZXgucGx1cmFsLm1lbiAgICAgICwgJyQxYW4nIF0sXG4gICAgWyByZWdleC5wbHVyYWwucGVvcGxlICAgLCAnJDFyc29uJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmNoaWxkcmVuICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmdlbmVyYSAgICwgJ2dlbnVzJ10sXG4gICAgWyByZWdleC5wbHVyYWwuY3JpdGVyaWEgLCAnJDFvbiddLFxuICAgIFsgcmVnZXgucGx1cmFsLnRpYSAgICAgICwgJyQxdW0nIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYW5hbHlzZXMgLCAnJDEkMnNpcycgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5oaXZlcyAgICAsICckMXZlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmN1cnZlcyAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmxydmVzICAgICwgJyQxZicgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5hdmVzICAgICAsICckMXZlJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZvdmVzICAgICwgJyQxZmUnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubW92aWVzICAgLCAnJDFvdmllJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmFlaW91eWllcywgJyQxeScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zZXJpZXMgICAsICckMWVyaWVzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnhlcyAgICAgICwgJyQxJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm1pY2UgICAgICwgJyQxb3VzZScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5idXNlcyAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5vZXMgICAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5zaG9lcyAgICAsICckMScgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC5jcmlzZXMgICAsICckMWlzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLm9jdG9waSAgICwgJyQxdXMnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuYWxpYXNlcyAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuc3VtbW9uc2VzLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwub3hlbiAgICAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwubWF0cmljZXMgLCAnJDFpeCcgXSxcbiAgICBbIHJlZ2V4LnBsdXJhbC52ZXJ0aWNlcyAsICckMWV4JyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLmZlZXQgICAgICwgJ2Zvb3QnIF0sXG4gICAgWyByZWdleC5wbHVyYWwudGVldGggICAgLCAndG9vdGgnIF0sXG4gICAgWyByZWdleC5wbHVyYWwuZ2Vlc2UgICAgLCAnZ29vc2UnIF0sXG4gICAgWyByZWdleC5wbHVyYWwucXVpenplcyAgLCAnJDEnIF0sXG4gICAgWyByZWdleC5wbHVyYWwud2hlcmVhc2VzLCAnJDEnIF0sXG5cbiAgICBbIHJlZ2V4LnBsdXJhbC5zcywgJ3NzJyBdLFxuICAgIFsgcmVnZXgucGx1cmFsLnMgLCAnJyBdXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGlzIGlzIGEgbGlzdCBvZiB3b3JkcyB0aGF0IHNob3VsZCBub3QgYmUgY2FwaXRhbGl6ZWQgZm9yIHRpdGxlIGNhc2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgbm9uX3RpdGxlY2FzZWRfd29yZHMgPSBbXG4gICAgJ2FuZCcsICdvcicsICdub3InLCAnYScsICdhbicsICd0aGUnLCAnc28nLCAnYnV0JywgJ3RvJywgJ29mJywgJ2F0JywnYnknLFxuICAgICdmcm9tJywgJ2ludG8nLCAnb24nLCAnb250bycsICdvZmYnLCAnb3V0JywgJ2luJywgJ292ZXInLCAnd2l0aCcsICdmb3InXG4gIF07XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGVzZSBhcmUgcmVndWxhciBleHByZXNzaW9ucyB1c2VkIGZvciBjb252ZXJ0aW5nIGJldHdlZW4gU3RyaW5nIGZvcm1hdHMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB2YXIgaWRfc3VmZml4ICAgICAgICAgPSBuZXcgUmVnRXhwKCAnKF9pZHN8X2lkKSQnLCAnZycgKTtcbiAgdmFyIHVuZGVyYmFyICAgICAgICAgID0gbmV3IFJlZ0V4cCggJ18nLCAnZycgKTtcbiAgdmFyIHNwYWNlX29yX3VuZGVyYmFyID0gbmV3IFJlZ0V4cCggJ1tcXCBfXScsICdnJyApO1xuICB2YXIgdXBwZXJjYXNlICAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFtBLVpdKScsICdnJyApO1xuICB2YXIgdW5kZXJiYXJfcHJlZml4ICAgPSBuZXcgUmVnRXhwKCAnXl8nICk7XG5cbiAgdmFyIGluZmxlY3RvciA9IHtcblxuICAvKipcbiAgICogQSBoZWxwZXIgbWV0aG9kIHRoYXQgYXBwbGllcyBydWxlcyBiYXNlZCByZXBsYWNlbWVudCB0byBhIFN0cmluZy5cbiAgICogQHByaXZhdGVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgU3RyaW5nIHRvIG1vZGlmeSBhbmQgcmV0dXJuIGJhc2VkIG9uIHRoZSBwYXNzZWQgcnVsZXMuXG4gICAqIEBwYXJhbSB7QXJyYXk6IFtSZWdFeHAsIFN0cmluZ119IHJ1bGVzIFJlZ2V4cCB0byBtYXRjaCBwYWlyZWQgd2l0aCBTdHJpbmcgdG8gdXNlIGZvciByZXBsYWNlbWVudFxuICAgKiBAcGFyYW0ge0FycmF5OiBbU3RyaW5nXX0gc2tpcCBTdHJpbmdzIHRvIHNraXAgaWYgdGhleSBtYXRjaFxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3ZlcnJpZGUgU3RyaW5nIHRvIHJldHVybiBhcyB0aG91Z2ggdGhpcyBtZXRob2Qgc3VjY2VlZGVkICh1c2VkIHRvIGNvbmZvcm0gdG8gQVBJcylcbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIHBhc3NlZCBTdHJpbmcgbW9kaWZpZWQgYnkgcGFzc2VkIHJ1bGVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdGhpcy5fYXBwbHlfcnVsZXMoICdjb3dzJywgc2luZ3VsYXJfcnVsZXMgKTsgLy8gPT09ICdjb3cnXG4gICAqL1xuICAgIF9hcHBseV9ydWxlcyA6IGZ1bmN0aW9uICggc3RyLCBydWxlcywgc2tpcCwgb3ZlcnJpZGUgKXtcbiAgICAgIGlmKCBvdmVycmlkZSApe1xuICAgICAgICBzdHIgPSBvdmVycmlkZTtcbiAgICAgIH1lbHNle1xuICAgICAgICB2YXIgaWdub3JlID0gKCBpbmZsZWN0b3IuaW5kZXhPZiggc2tpcCwgc3RyLnRvTG93ZXJDYXNlKCkpID4gLTEgKTtcblxuICAgICAgICBpZiggIWlnbm9yZSApe1xuICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICB2YXIgaiA9IHJ1bGVzLmxlbmd0aDtcblxuICAgICAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgICAgICBpZiggc3RyLm1hdGNoKCBydWxlc1sgaSBdWyAwIF0pKXtcbiAgICAgICAgICAgICAgaWYoIHJ1bGVzWyBpIF1bIDEgXSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoIHJ1bGVzWyBpIF1bIDAgXSwgcnVsZXNbIGkgXVsgMSBdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBsZXRzIHVzIGRldGVjdCBpZiBhbiBBcnJheSBjb250YWlucyBhIGdpdmVuIGVsZW1lbnQuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyciBUaGUgc3ViamVjdCBhcnJheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gT2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgQXJyYXkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tX2luZGV4IFN0YXJ0cyBjaGVja2luZyBmcm9tIHRoaXMgcG9zaXRpb24gaW4gdGhlIEFycmF5LihvcHRpb25hbClcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyZV9mdW5jIEZ1bmN0aW9uIHVzZWQgdG8gY29tcGFyZSBBcnJheSBpdGVtIHZzIHBhc3NlZCBpdGVtLihvcHRpb25hbClcbiAgICogQHJldHVybnMge051bWJlcn0gUmV0dXJuIGluZGV4IHBvc2l0aW9uIGluIHRoZSBBcnJheSBvZiB0aGUgcGFzc2VkIGl0ZW0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5pbmRleE9mKFsgJ2hpJywndGhlcmUnIF0sICdndXlzJyApOyAvLyA9PT0gLTFcbiAgICogICAgIGluZmxlY3Rpb24uaW5kZXhPZihbICdoaScsJ3RoZXJlJyBdLCAnaGknICk7IC8vID09PSAwXG4gICAqL1xuICAgIGluZGV4T2YgOiBmdW5jdGlvbiAoIGFyciwgaXRlbSwgZnJvbV9pbmRleCwgY29tcGFyZV9mdW5jICl7XG4gICAgICBpZiggIWZyb21faW5kZXggKXtcbiAgICAgICAgZnJvbV9pbmRleCA9IC0xO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgIHZhciBpICAgICA9IGZyb21faW5kZXg7XG4gICAgICB2YXIgaiAgICAgPSBhcnIubGVuZ3RoO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBpZiggYXJyWyBpIF0gID09PSBpdGVtIHx8IGNvbXBhcmVfZnVuYyAmJiBjb21wYXJlX2Z1bmMoIGFyclsgaSBdLCBpdGVtICkpe1xuICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBwbHVyYWxpemF0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwbHVyYWwgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFNpbmd1bGFyIEVuZ2xpc2ggbGFuZ3VhZ2Ugbm91bnMgYXJlIHJldHVybmVkIGluIHBsdXJhbCBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAncGVyc29uJyApOyAvLyA9PT0gJ3Blb3BsZSdcbiAgICogICAgIGluZmxlY3Rpb24ucGx1cmFsaXplKCAnb2N0b3B1cycgKTsgLy8gPT09ICdvY3RvcGknXG4gICAqICAgICBpbmZsZWN0aW9uLnBsdXJhbGl6ZSggJ0hhdCcgKTsgLy8gPT09ICdIYXRzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5wbHVyYWxpemUoICdwZXJzb24nLCAnZ3V5cycgKTsgLy8gPT09ICdndXlzJ1xuICAgKi9cbiAgICBwbHVyYWxpemUgOiBmdW5jdGlvbiAoIHN0ciwgcGx1cmFsICl7XG4gICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBwbHVyYWxfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBwbHVyYWwgKTtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHNpbmd1bGFyaXphdGlvbiBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2luZ3VsYXIgT3ZlcnJpZGVzIG5vcm1hbCBvdXRwdXQgd2l0aCBzYWlkIFN0cmluZy4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFBsdXJhbCBFbmdsaXNoIGxhbmd1YWdlIG5vdW5zIGFyZSByZXR1cm5lZCBpbiBzaW5ndWxhciBmb3JtLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uc2luZ3VsYXJpemUoICdwZW9wbGUnICk7IC8vID09PSAncGVyc29uJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ29jdG9waScgKTsgLy8gPT09ICdvY3RvcHVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ0hhdHMnICk7IC8vID09PSAnSGF0J1xuICAgKiAgICAgaW5mbGVjdGlvbi5zaW5ndWxhcml6ZSggJ2d1eXMnLCAncGVyc29uJyApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICovXG4gICAgc2luZ3VsYXJpemUgOiBmdW5jdGlvbiAoIHN0ciwgc2luZ3VsYXIgKXtcbiAgICAgIHJldHVybiBpbmZsZWN0b3IuX2FwcGx5X3J1bGVzKCBzdHIsIHNpbmd1bGFyX3J1bGVzLCB1bmNvdW50YWJsZV93b3Jkcywgc2luZ3VsYXIgKTtcbiAgICB9LFxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBwbHVyYWxpemUgb3Igc2luZ3VsYXJsaXplIGEgU3RyaW5nIGFwcHJvcHJpYXRlbHkgYmFzZWQgb24gYW4gaW50ZWdlciB2YWx1ZVxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IFRoZSBudW1iZXIgdG8gYmFzZSBwbHVyYWxpemF0aW9uIG9mZiBvZi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpbmd1bGFyIE92ZXJyaWRlcyBub3JtYWwgb3V0cHV0IHdpdGggc2FpZCBTdHJpbmcuKG9wdGlvbmFsKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGx1cmFsIE92ZXJyaWRlcyBub3JtYWwgb3V0cHV0IHdpdGggc2FpZCBTdHJpbmcuKG9wdGlvbmFsKVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBFbmdsaXNoIGxhbmd1YWdlIG5vdW5zIGFyZSByZXR1cm5lZCBpbiB0aGUgcGx1cmFsIG9yIHNpbmd1bGFyIGZvcm0gYmFzZWQgb24gdGhlIGNvdW50LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ3Blb3BsZScgMSApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ29jdG9waScgMSApOyAvLyA9PT0gJ29jdG9wdXMnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdIYXRzJyAxICk7IC8vID09PSAnSGF0J1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAnZ3V5cycsIDEgLCAncGVyc29uJyApOyAvLyA9PT0gJ3BlcnNvbidcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ3BlcnNvbicsIDIgKTsgLy8gPT09ICdwZW9wbGUnXG4gICAqICAgICBpbmZsZWN0aW9uLmluZmxlY3QoICdvY3RvcHVzJywgMiApOyAvLyA9PT0gJ29jdG9waSdcbiAgICogICAgIGluZmxlY3Rpb24uaW5mbGVjdCggJ0hhdCcsIDIgKTsgLy8gPT09ICdIYXRzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5pbmZsZWN0KCAncGVyc29uJywgMiwgbnVsbCwgJ2d1eXMnICk7IC8vID09PSAnZ3V5cydcbiAgICovXG4gICAgaW5mbGVjdCA6IGZ1bmN0aW9uICggc3RyLCBjb3VudCwgc2luZ3VsYXIsIHBsdXJhbCApe1xuICAgICAgY291bnQgPSBwYXJzZUludCggY291bnQsIDEwICk7XG5cbiAgICAgIGlmKCBpc05hTiggY291bnQgKSkgcmV0dXJuIHN0cjtcblxuICAgICAgaWYoIGNvdW50ID09PSAwIHx8IGNvdW50ID4gMSApe1xuICAgICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBwbHVyYWxfcnVsZXMsIHVuY291bnRhYmxlX3dvcmRzLCBwbHVyYWwgKTtcbiAgICAgIH1lbHNle1xuICAgICAgICByZXR1cm4gaW5mbGVjdG9yLl9hcHBseV9ydWxlcyggc3RyLCBzaW5ndWxhcl9ydWxlcywgdW5jb3VudGFibGVfd29yZHMsIHNpbmd1bGFyICk7XG4gICAgICB9XG4gICAgfSxcblxuXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBjYW1lbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBsb3dfZmlyc3RfbGV0dGVyIERlZmF1bHQgaXMgdG8gY2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSByZXN1bHRzLihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCBsb3dlcmNhc2UgaXQuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IExvd2VyIGNhc2UgdW5kZXJzY29yZWQgd29yZHMgd2lsbCBiZSByZXR1cm5lZCBpbiBjYW1lbCBjYXNlLlxuICAgKiAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxseSAnLycgaXMgdHJhbnNsYXRlZCB0byAnOjonXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5jYW1lbGl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlUHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uY2FtZWxpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZVByb3BlcnRpZXMnXG4gICAqL1xuICAgIGNhbWVsaXplIDogZnVuY3Rpb24gKCBzdHIsIGxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgIHZhciBzdHJfcGF0aCA9IHN0ci5zcGxpdCggJy8nICk7XG4gICAgICB2YXIgaSAgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgID0gc3RyX3BhdGgubGVuZ3RoO1xuICAgICAgdmFyIHN0cl9hcnIsIGluaXRfeCwgaywgbCwgZmlyc3Q7XG5cbiAgICAgIGZvciggOyBpIDwgajsgaSsrICl7XG4gICAgICAgIHN0cl9hcnIgPSBzdHJfcGF0aFsgaSBdLnNwbGl0KCAnXycgKTtcbiAgICAgICAgayAgICAgICA9IDA7XG4gICAgICAgIGwgICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcblxuICAgICAgICBmb3IoIDsgayA8IGw7IGsrKyApe1xuICAgICAgICAgIGlmKCBrICE9PSAwICl7XG4gICAgICAgICAgICBzdHJfYXJyWyBrIF0gPSBzdHJfYXJyWyBrIF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmaXJzdCA9IHN0cl9hcnJbIGsgXS5jaGFyQXQoIDAgKTtcbiAgICAgICAgICBmaXJzdCA9IGxvd19maXJzdF9sZXR0ZXIgJiYgaSA9PT0gMCAmJiBrID09PSAwXG4gICAgICAgICAgICA/IGZpcnN0LnRvTG93ZXJDYXNlKCkgOiBmaXJzdC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgIHN0cl9hcnJbIGsgXSA9IGZpcnN0ICsgc3RyX2FyclsgayBdLnN1YnN0cmluZyggMSApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyX3BhdGhbIGkgXSA9IHN0cl9hcnIuam9pbiggJycgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cl9wYXRoLmpvaW4oICc6OicgKTtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIHVuZGVyc2NvcmUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGxfdXBwZXJfY2FzZSBEZWZhdWx0IGlzIHRvIGxvd2VyY2FzZSBhbmQgYWRkIHVuZGVyc2NvcmUgcHJlZml4LihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCByZXR1cm4gYXMgZW50ZXJlZC5cbiAgICogQHJldHVybnMge1N0cmluZ30gQ2FtZWwgY2FzZWQgd29yZHMgYXJlIHJldHVybmVkIGFzIGxvd2VyIGNhc2VkIGFuZCB1bmRlcnNjb3JlZC5cbiAgICogICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsbHkgJzo6JyBpcyB0cmFuc2xhdGVkIHRvICcvJy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdNZXNzYWdlUHJvcGVydGllcycgKTsgLy8gPT09ICdtZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdtZXNzYWdlUHJvcGVydGllcycgKTsgLy8gPT09ICdtZXNzYWdlX3Byb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnVuZGVyc2NvcmUoICdNUCcsIHRydWUgKTsgLy8gPT09ICdNUCdcbiAgICovXG4gICAgdW5kZXJzY29yZSA6IGZ1bmN0aW9uICggc3RyLCBhbGxfdXBwZXJfY2FzZSApe1xuICAgICAgaWYoIGFsbF91cHBlcl9jYXNlICYmIHN0ciA9PT0gc3RyLnRvVXBwZXJDYXNlKCkpIHJldHVybiBzdHI7XG5cbiAgICAgIHZhciBzdHJfcGF0aCA9IHN0ci5zcGxpdCggJzo6JyApO1xuICAgICAgdmFyIGkgICAgICAgID0gMDtcbiAgICAgIHZhciBqICAgICAgICA9IHN0cl9wYXRoLmxlbmd0aDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgc3RyX3BhdGhbIGkgXSA9IHN0cl9wYXRoWyBpIF0ucmVwbGFjZSggdXBwZXJjYXNlLCAnXyQxJyApO1xuICAgICAgICBzdHJfcGF0aFsgaSBdID0gc3RyX3BhdGhbIGkgXS5yZXBsYWNlKCB1bmRlcmJhcl9wcmVmaXgsICcnICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJfcGF0aC5qb2luKCAnLycgKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgaHVtYW5pemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBsb3dfZmlyc3RfbGV0dGVyIERlZmF1bHQgaXMgdG8gY2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSByZXN1bHRzLihvcHRpb25hbClcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzaW5nIHRydWUgd2lsbCBsb3dlcmNhc2UgaXQuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IExvd2VyIGNhc2UgdW5kZXJzY29yZWQgd29yZHMgd2lsbCBiZSByZXR1cm5lZCBpbiBodW1hbml6ZWQgZm9ybS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmh1bWFuaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UgcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uaHVtYW5pemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZSBwcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICBodW1hbml6ZSA6IGZ1bmN0aW9uICggc3RyLCBsb3dfZmlyc3RfbGV0dGVyICl7XG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCBpZF9zdWZmaXgsICcnICk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSggdW5kZXJiYXIsICcgJyApO1xuXG4gICAgICBpZiggIWxvd19maXJzdF9sZXR0ZXIgKXtcbiAgICAgICAgc3RyID0gaW5mbGVjdG9yLmNhcGl0YWxpemUoIHN0ciApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgY2FwaXRhbGl6YXRpb24gc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gQWxsIGNoYXJhY3RlcnMgd2lsbCBiZSBsb3dlciBjYXNlIGFuZCB0aGUgZmlyc3Qgd2lsbCBiZSB1cHBlci5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgIHZhciBpbmZsZWN0aW9uID0gcmVxdWlyZSggJ2luZmxlY3Rpb24nICk7XG4gICAqXG4gICAqICAgICBpbmZsZWN0aW9uLmNhcGl0YWxpemUoICdtZXNzYWdlX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZV9wcm9wZXJ0aWVzJ1xuICAgKiAgICAgaW5mbGVjdGlvbi5jYXBpdGFsaXplKCAnbWVzc2FnZSBwcm9wZXJ0aWVzJywgdHJ1ZSApOyAvLyA9PT0gJ01lc3NhZ2UgcHJvcGVydGllcydcbiAgICovXG4gICAgY2FwaXRhbGl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcblxuICAgICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZyggMSApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHJlcGxhY2VzIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzIGluIHRoZSBzdHJpbmcuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXBsYWNlcyBhbGwgc3BhY2VzIG9yIHVuZGVyc2NvcmVzIHdpdGggZGFzaGVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24uZGFzaGVyaXplKCAnbWVzc2FnZV9wcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ21lc3NhZ2UtcHJvcGVydGllcydcbiAgICogICAgIGluZmxlY3Rpb24uZGFzaGVyaXplKCAnTWVzc2FnZSBQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ01lc3NhZ2UtUHJvcGVydGllcydcbiAgICovXG4gICAgZGFzaGVyaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSggc3BhY2Vfb3JfdW5kZXJiYXIsICctJyApO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGl0bGVpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gQ2FwaXRhbGl6ZXMgd29yZHMgYXMgeW91IHdvdWxkIGZvciBhIGJvb2sgdGl0bGUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50aXRsZWl6ZSggJ21lc3NhZ2VfcHJvcGVydGllcycgKTsgLy8gPT09ICdNZXNzYWdlIFByb3BlcnRpZXMnXG4gICAqICAgICBpbmZsZWN0aW9uLnRpdGxlaXplKCAnbWVzc2FnZSBwcm9wZXJ0aWVzIHRvIGtlZXAnICk7IC8vID09PSAnTWVzc2FnZSBQcm9wZXJ0aWVzIHRvIEtlZXAnXG4gICAqL1xuICAgIHRpdGxlaXplIDogZnVuY3Rpb24gKCBzdHIgKXtcbiAgICAgIHN0ciAgICAgICAgID0gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSggdW5kZXJiYXIsICcgJyApO1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICcgJyApO1xuICAgICAgdmFyIGkgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcbiAgICAgIHZhciBkLCBrLCBsO1xuXG4gICAgICBmb3IoIDsgaSA8IGo7IGkrKyApe1xuICAgICAgICBkID0gc3RyX2FyclsgaSBdLnNwbGl0KCAnLScgKTtcbiAgICAgICAgayA9IDA7XG4gICAgICAgIGwgPSBkLmxlbmd0aDtcblxuICAgICAgICBmb3IoIDsgayA8IGw7IGsrKyl7XG4gICAgICAgICAgaWYoIGluZmxlY3Rvci5pbmRleE9mKCBub25fdGl0bGVjYXNlZF93b3JkcywgZFsgayBdLnRvTG93ZXJDYXNlKCkpIDwgMCApe1xuICAgICAgICAgICAgZFsgayBdID0gaW5mbGVjdG9yLmNhcGl0YWxpemUoIGRbIGsgXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RyX2FyclsgaSBdID0gZC5qb2luKCAnLScgKTtcbiAgICAgIH1cblxuICAgICAgc3RyID0gc3RyX2Fyci5qb2luKCAnICcgKTtcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cmluZyggMSApO1xuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgZGVtb2R1bGl6ZSBzdXBwb3J0IHRvIGV2ZXJ5IFN0cmluZyBvYmplY3QuXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZW1vdmVzIG1vZHVsZSBuYW1lcyBsZWF2aW5nIG9ubHkgY2xhc3MgbmFtZXMuKFJ1Ynkgc3R5bGUpXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5kZW1vZHVsaXplKCAnTWVzc2FnZTo6QnVzOjpQcm9wZXJ0aWVzJyApOyAvLyA9PT0gJ1Byb3BlcnRpZXMnXG4gICAqL1xuICAgIGRlbW9kdWxpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICc6OicgKTtcblxuICAgICAgcmV0dXJuIHN0cl9hcnJbIHN0cl9hcnIubGVuZ3RoIC0gMSBdO1xuICAgIH0sXG5cblxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgdGFibGVpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIGNhbWVsIGNhc2VkIHdvcmRzIGludG8gdGhlaXIgdW5kZXJzY29yZWQgcGx1cmFsIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi50YWJsZWl6ZSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0aWVzJ1xuICAgKi9cbiAgICB0YWJsZWl6ZSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IudW5kZXJzY29yZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IucGx1cmFsaXplKCBzdHIgKTtcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNsYXNzaWZpY2F0aW9uIHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFVuZGVyc2NvcmVkIHBsdXJhbCBub3VucyBiZWNvbWUgdGhlIGNhbWVsIGNhc2VkIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5jbGFzc2lmeSggJ21lc3NhZ2VfYnVzX3Byb3BlcnRpZXMnICk7IC8vID09PSAnTWVzc2FnZUJ1c1Byb3BlcnR5J1xuICAgKi9cbiAgICBjbGFzc2lmeSA6IGZ1bmN0aW9uICggc3RyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IuY2FtZWxpemUoIHN0ciApO1xuICAgICAgc3RyID0gaW5mbGVjdG9yLnNpbmd1bGFyaXplKCBzdHIgKTtcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGZvcmVpZ24ga2V5IHN1cHBvcnQgdG8gZXZlcnkgU3RyaW5nIG9iamVjdC5cbiAgICogQHB1YmxpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3ViamVjdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZHJvcF9pZF91YmFyIERlZmF1bHQgaXMgdG8gc2VwZXJhdGUgaWQgd2l0aCBhbiB1bmRlcmJhciBhdCB0aGUgZW5kIG9mIHRoZSBjbGFzcyBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW91IGNhbiBwYXNzIHRydWUgdG8gc2tpcCBpdC4ob3B0aW9uYWwpXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFVuZGVyc2NvcmVkIHBsdXJhbCBub3VucyBiZWNvbWUgdGhlIGNhbWVsIGNhc2VkIHNpbmd1bGFyIGZvcm0uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgICB2YXIgaW5mbGVjdGlvbiA9IHJlcXVpcmUoICdpbmZsZWN0aW9uJyApO1xuICAgKlxuICAgKiAgICAgaW5mbGVjdGlvbi5mb3JlaWduX2tleSggJ01lc3NhZ2VCdXNQcm9wZXJ0eScgKTsgLy8gPT09ICdtZXNzYWdlX2J1c19wcm9wZXJ0eV9pZCdcbiAgICogICAgIGluZmxlY3Rpb24uZm9yZWlnbl9rZXkoICdNZXNzYWdlQnVzUHJvcGVydHknLCB0cnVlICk7IC8vID09PSAnbWVzc2FnZV9idXNfcHJvcGVydHlpZCdcbiAgICovXG4gICAgZm9yZWlnbl9rZXkgOiBmdW5jdGlvbiAoIHN0ciwgZHJvcF9pZF91YmFyICl7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IuZGVtb2R1bGl6ZSggc3RyICk7XG4gICAgICBzdHIgPSBpbmZsZWN0b3IudW5kZXJzY29yZSggc3RyICkgKyAoKCBkcm9wX2lkX3ViYXIgKSA/ICggJycgKSA6ICggJ18nICkpICsgJ2lkJztcblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG5cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBhZGRzIG9yZGluYWxpemUgc3VwcG9ydCB0byBldmVyeSBTdHJpbmcgb2JqZWN0LlxuICAgKiBAcHVibGljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdWJqZWN0IHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmluZ30gUmV0dXJuIGFsbCBmb3VuZCBudW1iZXJzIHRoZWlyIHNlcXVlbmNlIGxpa2UgJzIybmQnLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24ub3JkaW5hbGl6ZSggJ3RoZSAxIHBpdGNoJyApOyAvLyA9PT0gJ3RoZSAxc3QgcGl0Y2gnXG4gICAqL1xuICAgIG9yZGluYWxpemUgOiBmdW5jdGlvbiAoIHN0ciApe1xuICAgICAgdmFyIHN0cl9hcnIgPSBzdHIuc3BsaXQoICcgJyApO1xuICAgICAgdmFyIGkgICAgICAgPSAwO1xuICAgICAgdmFyIGogICAgICAgPSBzdHJfYXJyLmxlbmd0aDtcblxuICAgICAgZm9yKCA7IGkgPCBqOyBpKysgKXtcbiAgICAgICAgdmFyIGsgPSBwYXJzZUludCggc3RyX2FyclsgaSBdLCAxMCApO1xuXG4gICAgICAgIGlmKCAhaXNOYU4oIGsgKSl7XG4gICAgICAgICAgdmFyIGx0ZCA9IHN0cl9hcnJbIGkgXS5zdWJzdHJpbmcoIHN0cl9hcnJbIGkgXS5sZW5ndGggLSAyICk7XG4gICAgICAgICAgdmFyIGxkICA9IHN0cl9hcnJbIGkgXS5zdWJzdHJpbmcoIHN0cl9hcnJbIGkgXS5sZW5ndGggLSAxICk7XG4gICAgICAgICAgdmFyIHN1ZiA9ICd0aCc7XG5cbiAgICAgICAgICBpZiggbHRkICE9ICcxMScgJiYgbHRkICE9ICcxMicgJiYgbHRkICE9ICcxMycgKXtcbiAgICAgICAgICAgIGlmKCBsZCA9PT0gJzEnICl7XG4gICAgICAgICAgICAgIHN1ZiA9ICdzdCc7XG4gICAgICAgICAgICB9ZWxzZSBpZiggbGQgPT09ICcyJyApe1xuICAgICAgICAgICAgICBzdWYgPSAnbmQnO1xuICAgICAgICAgICAgfWVsc2UgaWYoIGxkID09PSAnMycgKXtcbiAgICAgICAgICAgICAgc3VmID0gJ3JkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdHJfYXJyWyBpIF0gKz0gc3VmO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJfYXJyLmpvaW4oICcgJyApO1xuICAgIH0sXG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gcGVyZm9ybXMgbXVsdGlwbGUgaW5mbGVjdGlvbiBtZXRob2RzIG9uIGEgc3RyaW5nXG4gICAqIEBwdWJsaWNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN1YmplY3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnIgQW4gYXJyYXkgb2YgaW5mbGVjdGlvbiBtZXRob2RzLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgdmFyIGluZmxlY3Rpb24gPSByZXF1aXJlKCAnaW5mbGVjdGlvbicgKTtcbiAgICpcbiAgICogICAgIGluZmxlY3Rpb24udHJhbnNmb3JtKCAnYWxsIGpvYicsIFsgJ3BsdXJhbGl6ZScsICdjYXBpdGFsaXplJywgJ2Rhc2hlcml6ZScgXSk7IC8vID09PSAnQWxsLWpvYnMnXG4gICAqL1xuICAgIHRyYW5zZm9ybSA6IGZ1bmN0aW9uICggc3RyLCBhcnIgKXtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHZhciBqID0gYXJyLmxlbmd0aDtcblxuICAgICAgZm9yKCA7aSA8IGo7IGkrKyApe1xuICAgICAgICB2YXIgbWV0aG9kID0gYXJyWyBpIF07XG5cbiAgICAgICAgaWYoIGluZmxlY3Rvci5oYXNPd25Qcm9wZXJ0eSggbWV0aG9kICkpe1xuICAgICAgICAgIHN0ciA9IGluZmxlY3RvclsgbWV0aG9kIF0oIHN0ciApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuICBpbmZsZWN0b3IudmVyc2lvbiA9ICcxLjEyLjAnO1xuXG4gIHJldHVybiBpbmZsZWN0b3I7XG59KSk7XG4iXX0=
