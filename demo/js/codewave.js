(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoxHelper = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// [pawa]
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
      return Codewave.util.repeatToLength(this.deco, len);
    }
  }, {
    key: "padding",
    value: function padding() {
      return Codewave.util.repeatToLength(" ", this.pad);
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
      return Codewave.util.repeatToLength(" ", this.indent) + this.wrapComment(this.deco + this.padding() + text + Codewave.util.repeatToLength(" ", this.width - this.removeIgnoredContent(text).length) + this.padding() + this.deco);
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
      return Codewave.util.getTxtSize(this.removeIgnoredContent(text));
    }
  }, {
    key: "getBoxForPos",
    value: function getBoxForPos(pos) {
      var _this = this;

      var clone, curLeft, depth, endFind, left, pair, placeholder, res, startFind;
      depth = this.getNestedLvl(pos.start);

      if (depth > 0) {
        left = this.left();
        curLeft = Codewave.util.repeat(left, depth - 1);
        clone = this.clone();
        placeholder = "###PlaceHolder###";
        clone.width = placeholder.length;
        clone.openText = clone.closeText = this.deco + this.deco + placeholder + this.deco + this.deco;
        startFind = RegExp(Codewave.util.escapeRegExp(curLeft + clone.startSep()).replace(placeholder, '.*'));
        endFind = RegExp(Codewave.util.escapeRegExp(curLeft + clone.endSep()).replace(placeholder, '.*'));
        pair = new Codewave.util.Pair(startFind, endFind, {
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
      rStart = new RegExp("(\\s*)(" + Codewave.util.escapeRegExp(this.context.wrapCommentLeft(this.deco)) + ")(\\s*)");
      rEnd = new RegExp("(\\s*)(" + Codewave.util.escapeRegExp(this.context.wrapCommentRight(this.deco)) + ")(\n|$)");
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
        opt = Codewave.util.merge(defaults, options);
        ecl = Codewave.util.escapeRegExp(this.context.wrapCommentLeft());
        ecr = Codewave.util.escapeRegExp(this.context.wrapCommentRight());
        ed = Codewave.util.escapeRegExp(this.deco);
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

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CmdFinder = void 0;

var _Context = require("./Context");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// [pawa]
//   replace Codewave.CmdFinder CmdFinder
var indexOf = [].indexOf;

var CmdFinder =
/*#__PURE__*/
function () {
  function CmdFinder(names, options) {
    _classCallCheck(this, CmdFinder);

    var defaults, key, val; // Codewave.logger.toMonitor(this,'findIn')
    // Codewave.logger.toMonitor(this,'triggerDetectors')

    if (typeof names === 'string') {
      names = [names];
    }

    defaults = {
      parent: null,
      namespaces: [],
      parentContext: null,
      context: null,
      root: Codewave.Command.cmds,
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

        var _Codewave$util$splitF = Codewave.util.splitFirstNamespace(name);

        var _Codewave$util$splitF2 = _slicedToArray(_Codewave$util$splitF, 2);

        space = _Codewave$util$splitF2[0];
        rest = _Codewave$util$splitF2[1];

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

      var _Codewave$util$splitF3 = Codewave.util.splitFirstNamespace(namespace, true);

      var _Codewave$util$splitF4 = _slicedToArray(_Codewave$util$splitF3, 2);

      space = _Codewave$util$splitF4[0];
      rest = _Codewave$util$splitF4[1];
      return this.names.map(function (name) {
        var cur_rest, cur_space;

        var _Codewave$util$splitF5 = Codewave.util.splitFirstNamespace(name);

        var _Codewave$util$splitF6 = _slicedToArray(_Codewave$util$splitF5, 2);

        cur_space = _Codewave$util$splitF6[0];
        cur_rest = _Codewave$util$splitF6[1];

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

        var _Codewave$util$splitF7 = Codewave.util.splitFirstNamespace(nspc, true);

        var _Codewave$util$splitF8 = _slicedToArray(_Codewave$util$splitF7, 2);

        nspcName = _Codewave$util$splitF8[0];
        rest = _Codewave$util$splitF8[1];
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

},{"./Context":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CmdInstance = void 0;

var _Context = require("./Context");

var _Codewave = require("./Codewave");

var _TextParser = require("./TextParser");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CmdInstance =
/*#__PURE__*/
function () {
  function CmdInstance(cmd1) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : None;

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
          res = _Codewave.Codewave.util.merge(res, aliased.getDefaults());
        }

        res = _Codewave.Codewave.util.merge(res, this.cmd.defaults);

        if (this.cmdObj != null) {
          res = _Codewave.Codewave.util.merge(res, this.cmdObj.getDefaults());
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
          opt = _Codewave.Codewave.util.merge(opt, this.cmdObj.getOptions());
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
      return _Codewave.Codewave.util.indentNotFirst(text, this.getIndent(), " ");
    }
  }]);

  return CmdInstance;
}();

exports.CmdInstance = CmdInstance;

},{"./Codewave":4,"./Context":6,"./TextParser":13}],4:[function(require,module,exports){
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
      Codewave.init(); // Codewave.logger.toMonitor(this,'runAtCursorPos')

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
        this.runAtCursorPos(); // Codewave.logger.resume()

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
        pos = Codewave.util.posCollection(pos);
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

        return this.closingPromp = Codewave.ClosingPromp.newFor(this, selections).begin(); // [pawa python] replace /\(new (.*)\).begin/ $1.begin reparse
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
        return Codewave.util.removeCarret(txt, this.carretChar);
      }
    }, {
      key: "getCarretPos",
      value: function getCarretPos(txt) {
        return Codewave.util.getCarretPos(txt, this.carretChar);
      }
    }, {
      key: "regMarker",
      value: function regMarker() {
        var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "g";
        // [pawa python] replace flags="g" flags=0 
        return new RegExp(Codewave.util.escapeRegExp(this.marker), flags);
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

},{"./Command":5,"./Context":6,"./Logger":8,"./PositionedCmdInstance":9,"./Process":10,"./TextParser":13}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseCommand = exports.Command = void 0;

var _Context = require("./Context");

var _Storage = require("./Storage");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// [pawa python]
//   replace Codewave.Command.cmds cmds
//   replace Codewave.Command Command
//   replace @Codewave.Command. ''
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
          res = Codewave.util.merge(res, aliased.getDefaults());
        }

        res = Codewave.util.merge(res, this.defaults);
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
        opt = Codewave.util.merge(opt, this.defaultOptions);

        if (aliased != null) {
          opt = Codewave.util.merge(opt, aliased.getOptions());
        }

        return Codewave.util.merge(opt, this.options);
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

        var _Codewave$util$splitF = Codewave.util.splitFirstNamespace(fullname);

        var _Codewave$util$splitF2 = _slicedToArray(_Codewave$util$splitF, 2);

        space = _Codewave$util$splitF2[0];
        name = _Codewave$util$splitF2[1];

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

        var _Codewave$util$splitF3 = Codewave.util.splitFirstNamespace(fullname);

        var _Codewave$util$splitF4 = _slicedToArray(_Codewave$util$splitF3, 2);

        space = _Codewave$util$splitF4[0];
        name = _Codewave$util$splitF4[1];

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
        var initialiser, j, len, ref, results;
        Command.cmds = new Command(null, {
          'cmds': {
            'hello': {
              help: "\"Hello, world!\" is typically one of the simplest programs possible in\nmost programming languages, it is by tradition often (...) used to\nverify that a language or system is operating correctly -wikipedia",
              result: 'Hello, World!'
            }
          }
        });
        ref = Command.cmdInitialisers;
        results = [];

        for (j = 0, len = ref.length; j < len; j++) {
          initialiser = ref[j];
          results.push(initialiser());
        }

        return results;
      }
    }, {
      key: "saveCmd",
      value: function saveCmd(fullname, data) {
        var savedCmds, storage;
        storage = new _Storage.Storage();
        Codewave.Command.cmds.setCmdData(fullname, data);
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
            results.push(Codewave.Command.cmds.setCmdData(fullname, data));
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
    }]);

    return Command;
  }();

  ;
  Command.cmdInitialisers = [];
  return Command;
}.call(void 0);

exports.Command = Command;

var BaseCommand =
/*#__PURE__*/
function () {
  function BaseCommand(instance) {
    _classCallCheck(this, BaseCommand);

    this.instance = instance;
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

},{"./Context":6,"./Storage":11}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = void 0;

var _CmdFinder = require("./CmdFinder");

var _CmdInstance = require("./CmdInstance");

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

        this._namespaces = Codewave.util.unique(npcs);
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

},{"./CmdFinder":2,"./CmdInstance":3}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = void 0;

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
      return new Codewave.util.Pos(this.findLineStart(pos), this.findLineEnd(pos));
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
        return new Codewave.util.StrPos(direction > 0 ? bestPos + start : bestPos, bestStr);
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PositionedCmdInstance = void 0;

var _CmdInstance2 = require("./CmdInstance");

var _BoxHelper = require("./BoxHelper");

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
        this.closingPos = new Codewave.util.StrPos(this.pos, this.str);
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
        this.content = Codewave.util.trimEmptyLine(this.codewave.editor.textSubstr(this.pos + this.str.length, f.pos));
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
        ecl = Codewave.util.escapeRegExp(this.context.wrapCommentLeft());
        ecr = Codewave.util.escapeRegExp(this.context.wrapCommentRight());
        ed = Codewave.util.escapeRegExp(this.codewave.deco);
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
          this.cmd = Codewave.Command.cmds.getCmd('core:no_execute');
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

      var _Codewave$util$splitN = Codewave.util.splitNamespace(this.cmdName);

      var _Codewave$util$splitN2 = _slicedToArray(_Codewave$util$splitN, 2);

      nspc = _Codewave$util$splitN2[0];
      cmdName = _Codewave$util$splitN2[1];
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
      return new Codewave.util.Pos(this.pos, this.pos + this.str.length).withEditor(this.codewave.editor);
    }
  }, {
    key: "getOpeningPos",
    value: function getOpeningPos() {
      return new Codewave.util.Pos(this.pos, this.pos + this.opening.length).withEditor(this.codewave.editor);
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
      return this.applyReplacement(new Codewave.util.Replacement(this.pos, this.getEndPos(), text));
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
      repl.selections = [new Codewave.util.Pos(cursorPos, cursorPos)];
      replacements = this.checkMulti(repl);
      this.codewave.editor.applyReplacements(replacements);
      this.replaceStart = repl.start;
      return this.replaceEnd = repl.resEnd();
    }
  }]);

  return PositionedCmdInstance;
}(_CmdInstance2.CmdInstance);

exports.PositionedCmdInstance = PositionedCmdInstance;

},{"./BoxHelper":1,"./CmdInstance":3}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextAreaEditor = exports.DomKeyListener = void 0;

var _TextParser2 = require("./TextParser");

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
      _this2.target = target1; // Codewave.logger.toMonitor(this,'textEventChange')

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
        return this.textEventChange(text, start, end) || _get(_getPrototypeOf(TextAreaEditor.prototype), "spliceText", this).call(this, start, end, text);
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

        if (event != null && event.initTextEvent != null) {
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
      key: "getCursorPos",
      value: function getCursorPos() {
        if (this.tmpCursorPos != null) {
          return this.tmpCursorPos;
        }

        if (this.hasFocus) {
          if (this.selectionPropExists) {
            return new Codewave.util.Pos(this.obj.selectionStart, this.obj.selectionEnd);
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
            pos = new Codewave.util.Pos(0, len);

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
          this.tmpCursorPos = new Codewave.util.Pos(start, end);
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

},{"./TextParser":13}],13:[function(require,module,exports){
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

},{"./Editor":7}],14:[function(require,module,exports){
"use strict";

var _Codewave = require("./Codewave");

var _TextAreaEditor = require("./TextAreaEditor");

_Codewave.Codewave.instances = [];

_Codewave.Codewave.detect = function (target) {
  var cw;
  cw = new _Codewave.Codewave(new _TextAreaEditor.TextAreaEditor(target));

  _Codewave.Codewave.instances.push(cw);

  return cw;
};

window.Codewave = _Codewave.Codewave;

},{"./Codewave":4,"./TextAreaEditor":12}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmNvZmZlZSIsImxpYi9DbWRGaW5kZXIuY29mZmVlIiwibGliL0NtZEluc3RhbmNlLmNvZmZlZSIsImxpYi9Db2Rld2F2ZS5jb2ZmZWUiLCJsaWIvQ29tbWFuZC5jb2ZmZWUiLCJsaWIvQ29udGV4dC5jb2ZmZWUiLCJsaWIvRWRpdG9yLmNvZmZlZSIsImxpYi9Mb2dnZXIuY29mZmVlIiwibGliL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZS5jb2ZmZWUiLCJsaWIvUHJvY2Vzcy5jb2ZmZWUiLCJsaWIvU3RvcmFnZS5jb2ZmZWUiLCJsaWIvVGV4dEFyZWFFZGl0b3IuY29mZmVlIiwibGliL1RleHRQYXJzZXIuY29mZmVlIiwibGliL2VudHJ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7QUFHQSxJQUFhLFNBQU47QUFBQTtBQUFBO0FBQ0wscUJBQWEsT0FBYixFQUFhO0FBQUEsUUFBVyxPQUFYLHVFQUFBLEVBQUE7O0FBQUE7O0FBQ1gsUUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUE7QUFEWSxTQUFDLE9BQUQsR0FBQyxPQUFEO0FBQ1osU0FBQSxRQUFBLEdBQVk7QUFDVixNQUFBLElBQUEsRUFBTSxLQUFDLE9BQUQsQ0FBUyxRQUFULENBREksSUFBQTtBQUVWLE1BQUEsR0FBQSxFQUZVLENBQUE7QUFHVixNQUFBLEtBQUEsRUFIVSxFQUFBO0FBSVYsTUFBQSxNQUFBLEVBSlUsQ0FBQTtBQUtWLE1BQUEsUUFBQSxFQUxVLEVBQUE7QUFNVixNQUFBLFNBQUEsRUFOVSxFQUFBO0FBT1YsTUFBQSxNQUFBLEVBUFUsRUFBQTtBQVFWLE1BQUEsTUFBQSxFQVJVLEVBQUE7QUFTVixNQUFBLE1BQUEsRUFBUTtBQVRFLEtBQVo7QUFXQSxJQUFBLEdBQUEsR0FBQSxLQUFBLFFBQUE7O0FBQUEsU0FBQSxHQUFBLElBQUEs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QUFBLEVBQXNCLEtBQUEsSUFBQSxHQUEzRCxNQUFxQyxDQUFyQyxDO0FBRFk7QUFiVDtBQUFBO0FBQUEsK0JBZU8sS0FmUCxFQWVPLEdBZlAsRUFlTyxJQWZQLEVBZU87YUFDVixLQUFBLElBQUEsQ0FBTSxLQUFBLElBQUEsR0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLEtBQUEsS0FBMkIsSUFBQSxJQUEzQixFQUFBLElBQXlDLEtBQUEsSUFBQSxHQUFBLEtBQUEsQ0FBL0MsR0FBK0MsQ0FBL0MsQztBQURVO0FBZlA7QUFBQTtBQUFBLG1DQWlCUztBQUNaLGFBQU8sS0FBQyxNQUFSO0FBRFk7QUFqQlQ7QUFBQTtBQUFBLGlDQW1CUyxLQW5CVCxFQW1CUyxHQW5CVCxFQW1CUztBQUNaLFVBQWUsU0FBUyxDQUFULE1BQUEsR0FBZixDQUFBLEVBQUE7QUFBQSxRQUFBLEdBQUEsR0FBQSxLQUFBOzs7YUFDQSxLQUFBLE1BQUEsR0FDSTtBQUFBLFFBQUEsS0FBQSxFQUFBLEtBQUE7QUFDQSxRQUFBLEdBQUEsRUFBSztBQURMLE87QUFIUTtBQW5CVDs7QUFBQTtBQUFBLEVBQUEsZUFBQSxDQUFQOzs7Ozs7O0FDTkE7O0FBQ0E7O0FBRUEsbUJBQUEsU0FBQSxHQUFxQixFQUFyQjs7QUFDQSxtQkFBQSxNQUFBLEdBQWtCLFVBQUEsTUFBQSxFQUFBO0FBQ2hCLE1BQUEsRUFBQTtBQUFBLEVBQUEsRUFBQSxHQUFLLElBQUEsa0JBQUEsQ0FBYSxJQUFBLDhCQUFBLENBQWIsTUFBYSxDQUFiLENBQUw7O0FBQ0EscUJBQVMsU0FBVCxDQUFBLElBQUEsQ0FBQSxFQUFBOztTQUNBLEU7QUFIZ0IsQ0FBbEI7O0FBS0EsTUFBTSxDQUFOLFFBQUEsR0FBa0Isa0JBQWxCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiIyBbcGF3YV1cbiMgICByZXBsYWNlICdyZXBsYWNlKC9cXHIvZycgXCJyZXBsYWNlKCdcXHInXCJcblxuZXhwb3J0IGNsYXNzIEJveEhlbHBlclxuICBjb25zdHJ1Y3RvcjogKEBjb250ZXh0LCBvcHRpb25zID0ge30pIC0+XG4gICAgQGRlZmF1bHRzID0ge1xuICAgICAgZGVjbzogQGNvbnRleHQuY29kZXdhdmUuZGVjb1xuICAgICAgcGFkOiAyXG4gICAgICB3aWR0aDogNTBcbiAgICAgIGhlaWdodDogM1xuICAgICAgb3BlblRleHQ6ICcnXG4gICAgICBjbG9zZVRleHQ6ICcnXG4gICAgICBwcmVmaXg6ICcnXG4gICAgICBzdWZmaXg6ICcnXG4gICAgICBpbmRlbnQ6IDBcbiAgICB9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICBjbG9uZTogKHRleHQpIC0+XG4gICAgb3B0ID0ge31cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBvcHRba2V5XSA9IHRoaXNba2V5XVxuICAgIHJldHVybiBuZXcgQm94SGVscGVyKEBjb250ZXh0LG9wdClcbiAgZHJhdzogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBzdGFydFNlcCgpICsgXCJcXG5cIiArIEBsaW5lcyh0ZXh0KSArIFwiXFxuXCIrIEBlbmRTZXAoKVxuICB3cmFwQ29tbWVudDogKHN0cikgLT5cbiAgICByZXR1cm4gQGNvbnRleHQud3JhcENvbW1lbnQoc3RyKVxuICBzZXBhcmF0b3I6IC0+XG4gICAgbGVuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAZGVjb0xpbmUobGVuKSlcbiAgc3RhcnRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAb3BlblRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEBwcmVmaXggKyBAd3JhcENvbW1lbnQoQG9wZW5UZXh0K0BkZWNvTGluZShsbikpXG4gIGVuZFNlcDogLT5cbiAgICBsbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aCAtIEBjbG9zZVRleHQubGVuZ3RoXG4gICAgcmV0dXJuIEB3cmFwQ29tbWVudChAY2xvc2VUZXh0K0BkZWNvTGluZShsbikpICsgQHN1ZmZpeFxuICBkZWNvTGluZTogKGxlbikgLT5cbiAgICByZXR1cm4gQ29kZXdhdmUudXRpbC5yZXBlYXRUb0xlbmd0aChAZGVjbywgbGVuKVxuICBwYWRkaW5nOiAtPiBcbiAgICByZXR1cm4gQ29kZXdhdmUudXRpbC5yZXBlYXRUb0xlbmd0aChcIiBcIiwgQHBhZClcbiAgbGluZXM6ICh0ZXh0ID0gJycsIHVwdG9IZWlnaHQ9dHJ1ZSkgLT5cbiAgICB0ZXh0ID0gdGV4dCBvciAnJ1xuICAgIGxpbmVzID0gdGV4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpXG4gICAgaWYgdXB0b0hlaWdodFxuICAgICAgcmV0dXJuIChAbGluZShsaW5lc1t4XSBvciAnJykgZm9yIHggaW4gWzAuLkBoZWlnaHRdKS5qb2luKCdcXG4nKSBcbiAgICBlbHNlXG4gICAgICByZXR1cm4gKEBsaW5lKGwpIGZvciBsIGluIGxpbmVzKS5qb2luKCdcXG4nKSBcbiAgbGluZTogKHRleHQgPSAnJykgLT5cbiAgICByZXR1cm4gKENvZGV3YXZlLnV0aWwucmVwZWF0VG9MZW5ndGgoXCIgXCIsQGluZGVudCkgK1xuICAgICAgQHdyYXBDb21tZW50KFxuICAgICAgICBAZGVjbyArXG4gICAgICAgIEBwYWRkaW5nKCkgK1xuICAgICAgICB0ZXh0ICtcbiAgICAgICAgQ29kZXdhdmUudXRpbC5yZXBlYXRUb0xlbmd0aChcIiBcIiwgQHdpZHRoIC0gQHJlbW92ZUlnbm9yZWRDb250ZW50KHRleHQpLmxlbmd0aCkgKyBcbiAgICAgICAgQHBhZGRpbmcoKSArXG4gICAgICAgIEBkZWNvXG4gICAgICApKVxuICBsZWZ0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50TGVmdChAZGVjbyArIEBwYWRkaW5nKCkpXG4gIHJpZ2h0OiAtPlxuICAgIEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQHBhZGRpbmcoKSArIEBkZWNvKVxuICByZW1vdmVJZ25vcmVkQ29udGVudDogKHRleHQpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LmNvZGV3YXZlLnJlbW92ZU1hcmtlcnMoQGNvbnRleHQuY29kZXdhdmUucmVtb3ZlQ2FycmV0KHRleHQpKVxuICB0ZXh0Qm91bmRzOiAodGV4dCkgLT5cbiAgICByZXR1cm4gQ29kZXdhdmUudXRpbC5nZXRUeHRTaXplKEByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSlcbiAgZ2V0Qm94Rm9yUG9zOiAocG9zKSAtPlxuICAgIGRlcHRoID0gQGdldE5lc3RlZEx2bChwb3Muc3RhcnQpXG4gICAgaWYgZGVwdGggPiAwXG4gICAgICBsZWZ0ID0gQGxlZnQoKVxuICAgICAgY3VyTGVmdCA9IENvZGV3YXZlLnV0aWwucmVwZWF0KGxlZnQsZGVwdGgtMSlcbiAgICAgIFxuICAgICAgY2xvbmUgPSBAY2xvbmUoKVxuICAgICAgcGxhY2Vob2xkZXIgPSBcIiMjI1BsYWNlSG9sZGVyIyMjXCJcbiAgICAgIGNsb25lLndpZHRoID0gcGxhY2Vob2xkZXIubGVuZ3RoXG4gICAgICBjbG9uZS5vcGVuVGV4dCA9IGNsb25lLmNsb3NlVGV4dCA9IEBkZWNvICsgQGRlY28gKyBwbGFjZWhvbGRlciArIEBkZWNvICsgQGRlY29cbiAgICAgIFxuICAgICAgc3RhcnRGaW5kID0gUmVnRXhwKENvZGV3YXZlLnV0aWwuZXNjYXBlUmVnRXhwKGN1ckxlZnQgKyBjbG9uZS5zdGFydFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgZW5kRmluZCA9IFJlZ0V4cChDb2Rld2F2ZS51dGlsLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuZW5kU2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsJy4qJykpXG4gICAgICBcbiAgICAgIHBhaXIgPSBuZXcgQ29kZXdhdmUudXRpbC5QYWlyKHN0YXJ0RmluZCxlbmRGaW5kLHtcbiAgICAgICAgdmFsaWRNYXRjaDogKG1hdGNoKT0+XG4gICAgICAgICAgIyBjb25zb2xlLmxvZyhtYXRjaCxsZWZ0KVxuICAgICAgICAgIGYgPSBAY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChtYXRjaC5zdGFydCgpICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKVxuICAgICAgICAgIHJldHVybiAhZj8gb3IgZi5zdHIgIT0gbGVmdFxuICAgICAgfSlcbiAgICAgIHJlcyA9IHBhaXIud3JhcHBlclBvcyhwb3MsQGNvbnRleHQuY29kZXdhdmUuZWRpdG9yLnRleHQoKSlcbiAgICAgIGlmIHJlcz9cbiAgICAgICAgcmVzLnN0YXJ0ICs9IGN1ckxlZnQubGVuZ3RoXG4gICAgICAgIHJldHVybiByZXNcbiAgICBcbiAgZ2V0TmVzdGVkTHZsOiAoaW5kZXgpIC0+XG4gICAgZGVwdGggPSAwXG4gICAgbGVmdCA9IEBsZWZ0KClcbiAgICB3aGlsZSAoZiA9IEBjb250ZXh0LmNvZGV3YXZlLmZpbmRBbnlOZXh0KGluZGV4ICxbbGVmdCxcIlxcblwiLFwiXFxyXCJdLC0xKSk/ICYmIGYuc3RyID09IGxlZnRcbiAgICAgIGluZGV4ID0gZi5wb3NcbiAgICAgIGRlcHRoKytcbiAgICByZXR1cm4gZGVwdGhcbiAgZ2V0T3B0RnJvbUxpbmU6IChsaW5lLGdldFBhZD10cnVlKSAtPlxuICAgIHJTdGFydCA9IG5ldyBSZWdFeHAoXCIoXFxcXHMqKShcIitDb2Rld2F2ZS51dGlsLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoQGRlY28pKStcIikoXFxcXHMqKVwiKVxuICAgIHJFbmQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIrQ29kZXdhdmUudXRpbC5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodChAZGVjbykpK1wiKShcXG58JClcIilcbiAgICByZXNTdGFydCA9IHJTdGFydC5leGVjKGxpbmUpXG4gICAgcmVzRW5kID0gckVuZC5leGVjKGxpbmUpXG4gICAgaWYgcmVzU3RhcnQ/IGFuZCByZXNFbmQ/XG4gICAgICBpZiBnZXRQYWRcbiAgICAgICAgQHBhZCA9IE1hdGgubWluKHJlc1N0YXJ0WzNdLmxlbmd0aCxyZXNFbmRbMV0ubGVuZ3RoKVxuICAgICAgQGluZGVudCA9IHJlc1N0YXJ0WzFdLmxlbmd0aFxuICAgICAgc3RhcnRQb3MgPSByZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCArIEBwYWQgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgJ3Jlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoJyByZXNTdGFydC5lbmQoMilcbiAgICAgIGVuZFBvcyA9IHJlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGggLSBAcGFkICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICdyZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoJyByZXNFbmQuc3RhcnQoMilcbiAgICAgIEB3aWR0aCA9IGVuZFBvcyAtIHN0YXJ0UG9zXG4gICAgcmV0dXJuIHRoaXNcbiAgcmVmb3JtYXRMaW5lczogKHRleHQsb3B0aW9ucz17fSkgLT5cbiAgICByZXR1cm4gQGxpbmVzKEByZW1vdmVDb21tZW50KHRleHQsb3B0aW9ucyksZmFsc2UpXG4gIHJlbW92ZUNvbW1lbnQ6ICh0ZXh0LG9wdGlvbnM9e30pLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgIG11bHRpbGluZTogdHJ1ZVxuICAgICAgfVxuICAgICAgb3B0ID0gQ29kZXdhdmUudXRpbC5tZXJnZShkZWZhdWx0cyxvcHRpb25zKVxuICAgICAgZWNsID0gQ29kZXdhdmUudXRpbC5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBDb2Rld2F2ZS51dGlsLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpXG4gICAgICBlZCA9IENvZGV3YXZlLnV0aWwuZXNjYXBlUmVnRXhwKEBkZWNvKVxuICAgICAgZmxhZyA9IGlmIG9wdGlvbnNbJ211bHRpbGluZSddIHRoZW4gJ2dtJyBlbHNlICcnICAgICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIFwiJ2dtJ1wiIHJlLk1cbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzezAsI3tAcGFkfX1cIiwgZmxhZykgICAgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgI3tAcGFkfSAnXCIrc3RyKHNlbGYucGFkKStcIidcbiAgICAgIHJlMiA9IG5ldyBSZWdFeHAoXCJcXFxccyooPzoje2VkfSkqI3tlY3J9XFxcXHMqJFwiLCBmbGFnKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZTEsJycpLnJlcGxhY2UocmUyLCcnKVxuICAgXG4gICIsIiMgW3Bhd2FdXG4jICAgcmVwbGFjZSBDb2Rld2F2ZS5DbWRGaW5kZXIgQ21kRmluZGVyXG5cbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgQ21kRmluZGVyXG4gIGNvbnN0cnVjdG9yOiAobmFtZXMsIG9wdGlvbnMpIC0+XG4gICAgIyBDb2Rld2F2ZS5sb2dnZXIudG9Nb25pdG9yKHRoaXMsJ2ZpbmRJbicpXG4gICAgIyBDb2Rld2F2ZS5sb2dnZXIudG9Nb25pdG9yKHRoaXMsJ3RyaWdnZXJEZXRlY3RvcnMnKVxuICAgIGlmIHR5cGVvZiBuYW1lcyA9PSAnc3RyaW5nJ1xuICAgICAgbmFtZXMgPSBbbmFtZXNdXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGxcbiAgICAgIG5hbWVzcGFjZXM6IFtdXG4gICAgICBwYXJlbnRDb250ZXh0OiBudWxsXG4gICAgICBjb250ZXh0OiBudWxsXG4gICAgICByb290OiBDb2Rld2F2ZS5Db21tYW5kLmNtZHNcbiAgICAgIG11c3RFeGVjdXRlOiB0cnVlXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWVcbiAgICAgIHVzZUZhbGxiYWNrczogdHJ1ZVxuICAgICAgaW5zdGFuY2U6IG51bGxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfVxuICAgIEBuYW1lcyA9IG5hbWVzXG4gICAgQHBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dChAY29kZXdhdmUpXG4gICAgaWYgQHBhcmVudENvbnRleHQ/XG4gICAgICBAY29udGV4dC5wYXJlbnQgPSBAcGFyZW50Q29udGV4dFxuICAgIGlmIEBuYW1lc3BhY2VzP1xuICAgICAgQGNvbnRleHQuYWRkTmFtZXNwYWNlcyhAbmFtZXNwYWNlcylcbiAgZmluZDogLT5cbiAgICBAdHJpZ2dlckRldGVjdG9ycygpXG4gICAgQGNtZCA9IEBmaW5kSW4oQHJvb3QpXG4gICAgcmV0dXJuIEBjbWRcbiMgIGdldFBvc2liaWxpdGllczogLT5cbiMgICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuIyAgICBwYXRoID0gbGlzdChAcGF0aClcbiMgICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcbiAgZ2V0TmFtZXNXaXRoUGF0aHM6IC0+XG4gICAgcGF0aHMgPSB7fVxuICAgIGZvciBuYW1lIGluIEBuYW1lcyBcbiAgICAgIFtzcGFjZSxyZXN0XSA9IENvZGV3YXZlLnV0aWwuc3BsaXRGaXJzdE5hbWVzcGFjZShuYW1lKVxuICAgICAgaWYgc3BhY2U/IGFuZCAhKHNwYWNlIGluIEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSlcbiAgICAgICAgdW5sZXNzIHNwYWNlIG9mIHBhdGhzIFxuICAgICAgICAgIHBhdGhzW3NwYWNlXSA9IFtdXG4gICAgICAgIHBhdGhzW3NwYWNlXS5wdXNoKHJlc3QpXG4gICAgcmV0dXJuIHBhdGhzXG4gIGFwcGx5U3BhY2VPbk5hbWVzOiAobmFtZXNwYWNlKSAtPlxuICAgIFtzcGFjZSxyZXN0XSA9IENvZGV3YXZlLnV0aWwuc3BsaXRGaXJzdE5hbWVzcGFjZShuYW1lc3BhY2UsdHJ1ZSlcbiAgICBAbmFtZXMubWFwKCAobmFtZSkgLT5cbiAgICAgIFtjdXJfc3BhY2UsY3VyX3Jlc3RdID0gQ29kZXdhdmUudXRpbC5zcGxpdEZpcnN0TmFtZXNwYWNlKG5hbWUpXG4gICAgICBpZiBjdXJfc3BhY2U/IGFuZCBjdXJfc3BhY2UgPT0gc3BhY2VcbiAgICAgICAgbmFtZSA9IGN1cl9yZXN0XG4gICAgICBpZiByZXN0P1xuICAgICAgICBuYW1lID0gcmVzdCArICc6JyArIG5hbWVcbiAgICAgIHJldHVybiBuYW1lXG4gICAgKVxuICBnZXREaXJlY3ROYW1lczogLT5cbiAgICByZXR1cm4gKG4gZm9yIG4gaW4gQG5hbWVzIHdoZW4gbi5pbmRleE9mKFwiOlwiKSA9PSAtMSlcbiAgdHJpZ2dlckRldGVjdG9yczogLT5cbiAgICBpZiBAdXNlRGV0ZWN0b3JzIFxuICAgICAgQHVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICBwb3NpYmlsaXRpZXMgPSBuZXcgQ21kRmluZGVyKEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IHBvc2liaWxpdGllcy5sZW5ndGhcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldXG4gICAgICAgIGZvciBkZXRlY3RvciBpbiBjbWQuZGV0ZWN0b3JzIFxuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKVxuICAgICAgICAgIGlmIHJlcz9cbiAgICAgICAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMocmVzKVxuICAgICAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKHJlcywge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgICAgICBpKytcbiAgZmluZEluOiAoY21kLHBhdGggPSBudWxsKSAtPlxuICAgIHVubGVzcyBjbWQ/XG4gICAgICByZXR1cm4gbnVsbFxuICAgIGJlc3QgPSBAYmVzdEluUG9zaWJpbGl0aWVzKEBmaW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgaWYgYmVzdD9cbiAgICAgIHJldHVybiBiZXN0XG4gIGZpbmRQb3NpYmlsaXRpZXM6IC0+XG4gICAgdW5sZXNzIEByb290P1xuICAgICAgcmV0dXJuIFtdXG4gICAgQHJvb3QuaW5pdCgpXG4gICAgcG9zaWJpbGl0aWVzID0gW11cbiAgICBmb3Igc3BhY2UsIG5hbWVzIG9mIEBnZXROYW1lc1dpdGhQYXRocygpXG4gICAgICBuZXh0cyA9IEBnZXRDbWRGb2xsb3dBbGlhcyhzcGFjZSlcbiAgICAgIGZvciBuZXh0IGluIG5leHRzXG4gICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge3BhcmVudDogdGhpcywgcm9vdDogbmV4dH0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICBmb3IgbnNwYyBpbiBAY29udGV4dC5nZXROYW1lU3BhY2VzKClcbiAgICAgIFtuc3BjTmFtZSxyZXN0XSA9IENvZGV3YXZlLnV0aWwuc3BsaXRGaXJzdE5hbWVzcGFjZShuc3BjLHRydWUpXG4gICAgICBuZXh0cyA9IEBnZXRDbWRGb2xsb3dBbGlhcyhuc3BjTmFtZSlcbiAgICAgIGZvciBuZXh0IGluIG5leHRzXG4gICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihAYXBwbHlTcGFjZU9uTmFtZXMobnNwYyksIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgZm9yIG5hbWUgaW4gQGdldERpcmVjdE5hbWVzKClcbiAgICAgIGRpcmVjdCA9IEByb290LmdldENtZChuYW1lKVxuICAgICAgaWYgQGNtZElzVmFsaWQoZGlyZWN0KVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChkaXJlY3QpXG4gICAgaWYgQHVzZUZhbGxiYWNrc1xuICAgICAgZmFsbGJhY2sgPSBAcm9vdC5nZXRDbWQoJ2ZhbGxiYWNrJylcbiAgICAgIGlmIEBjbWRJc1ZhbGlkKGZhbGxiYWNrKVxuICAgICAgICBwb3NpYmlsaXRpZXMucHVzaChmYWxsYmFjaylcbiAgICBAcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzXG4gICAgcmV0dXJuIHBvc2liaWxpdGllc1xuICBnZXRDbWRGb2xsb3dBbGlhczogKG5hbWUpIC0+XG4gICAgY21kID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgaWYgY21kPyBcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5hbGlhc09mP1xuICAgICAgICByZXR1cm4gW2NtZCxjbWQuZ2V0QWxpYXNlZCgpXVxuICAgICAgcmV0dXJuIFtjbWRdXG4gICAgcmV0dXJuIFtjbWRdXG4gIGNtZElzVmFsaWQ6IChjbWQpIC0+XG4gICAgdW5sZXNzIGNtZD9cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIGNtZC5uYW1lICE9ICdmYWxsYmFjaycgJiYgY21kIGluIEBhbmNlc3RvcnMoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuICFAbXVzdEV4ZWN1dGUgb3IgQGNtZElzRXhlY3V0YWJsZShjbWQpXG4gIGFuY2VzdG9yczogLT5cbiAgICBpZiBAY29kZXdhdmU/LmluSW5zdGFuY2U/XG4gICAgICByZXR1cm4gQGNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGNtZElzRXhlY3V0YWJsZTogKGNtZCkgLT5cbiAgICBuYW1lcyA9IEBnZXREaXJlY3ROYW1lcygpXG4gICAgaWYgbmFtZXMubGVuZ3RoID09IDFcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZVdpdGhOYW1lKG5hbWVzWzBdKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLmlzRXhlY3V0YWJsZSgpXG4gIGNtZFNjb3JlOiAoY21kKSAtPlxuICAgIHNjb3JlID0gY21kLmRlcHRoXG4gICAgaWYgY21kLm5hbWUgPT0gJ2ZhbGxiYWNrJyBcbiAgICAgICAgc2NvcmUgLT0gMTAwMFxuICAgIHJldHVybiBzY29yZVxuICBiZXN0SW5Qb3NpYmlsaXRpZXM6IChwb3NzKSAtPlxuICAgIGlmIHBvc3MubGVuZ3RoID4gMFxuICAgICAgYmVzdCA9IG51bGxcbiAgICAgIGJlc3RTY29yZSA9IG51bGxcbiAgICAgIGZvciBwIGluIHBvc3NcbiAgICAgICAgc2NvcmUgPSBAY21kU2NvcmUocClcbiAgICAgICAgaWYgIWJlc3Q/IG9yIHNjb3JlID49IGJlc3RTY29yZVxuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlXG4gICAgICAgICAgYmVzdCA9IHBcbiAgICAgIHJldHVybiBiZXN0OyIsIiMgW3Bhd2FdXG4jICAgcmVwbGFjZSAncmVwbGFjZSgvXFx0L2cnICdyZXBsYWNlKFwiXFx0XCInXG5cbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5leHBvcnQgY2xhc3MgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY21kLEBjb250ZXh0ID0gTm9uZSkgLT5cbiAgXG4gIGluaXQ6IC0+XG4gICAgdW5sZXNzIEBpc0VtcHR5KCkgb3IgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIEBfZ2V0Q21kT2JqKClcbiAgICAgIEBfaW5pdFBhcmFtcygpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBAY21kT2JqLmluaXQoKVxuICAgIHJldHVybiB0aGlzXG4gIHNldFBhcmFtOihuYW1lLHZhbCktPlxuICAgIEBuYW1lZFtuYW1lXSA9IHZhbFxuICBwdXNoUGFyYW06KHZhbCktPlxuICAgIEBwYXJhbXMucHVzaCh2YWwpXG4gIGdldENvbnRleHQ6IC0+XG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgcmV0dXJuIEBjb250ZXh0IG9yIG5ldyBDb250ZXh0KClcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBnZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsQF9nZXRQYXJlbnROYW1lc3BhY2VzKCkpXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgX2dldENtZE9iajogLT5cbiAgICBpZiBAY21kP1xuICAgICAgQGNtZC5pbml0KClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmNscz9cbiAgICAgICAgQGNtZE9iaiA9IG5ldyBjbWQuY2xzKHRoaXMpXG4gICAgICAgIHJldHVybiBAY21kT2JqXG4gIF9pbml0UGFyYW1zOiAtPlxuICAgIEBuYW1lZCA9IEBnZXREZWZhdWx0cygpXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzOiAtPlxuICAgIHJldHVybiBbXVxuICBpc0VtcHR5OiAtPlxuICAgIHJldHVybiBAY21kP1xuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmV0dXJuIEBjbWRPYmoucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkRmluYWwoKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgcmV0dXJuIEBjbWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgIHJldHVybiBmYWxzZVxuICBnZXREZWZhdWx0czogLT5cbiAgICBpZiBAY21kP1xuICAgICAgcmVzID0ge31cbiAgICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXMgPSBDb2Rld2F2ZS51dGlsLm1lcmdlKHJlcyxhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgICByZXMgPSBDb2Rld2F2ZS51dGlsLm1lcmdlKHJlcyxAY21kLmRlZmF1bHRzKVxuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmVzID0gQ29kZXdhdmUudXRpbC5tZXJnZShyZXMsQGNtZE9iai5nZXREZWZhdWx0cygpKVxuICAgICAgcmV0dXJuIHJlc1xuICBnZXRBbGlhc2VkOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICB1bmxlc3MgQGFsaWFzZWRDbWQ/XG4gICAgICAgIEBnZXRBbGlhc2VkRmluYWwoKVxuICAgICAgcmV0dXJuIEBhbGlhc2VkQ21kIG9yIG51bGxcbiAgZ2V0QWxpYXNlZEZpbmFsOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAYWxpYXNlZEZpbmFsQ21kP1xuICAgICAgICByZXR1cm4gQGFsaWFzZWRGaW5hbENtZCBvciBudWxsXG4gICAgICBpZiBAY21kLmFsaWFzT2Y/XG4gICAgICAgIGFsaWFzZWQgPSBAY21kXG4gICAgICAgIHdoaWxlIGFsaWFzZWQ/IGFuZCBhbGlhc2VkLmFsaWFzT2Y/XG4gICAgICAgICAgYWxpYXNlZCA9IGFsaWFzZWQuX2FsaWFzZWRGcm9tRmluZGVyKEBnZXRGaW5kZXIoQGFsdGVyQWxpYXNPZihhbGlhc2VkLmFsaWFzT2YpKSlcbiAgICAgICAgICB1bmxlc3MgQGFsaWFzZWRDbWQ/XG4gICAgICAgICAgICBAYWxpYXNlZENtZCA9IGFsaWFzZWQgb3IgZmFsc2VcbiAgICAgICAgQGFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgb3IgZmFsc2VcbiAgICAgICAgcmV0dXJuIGFsaWFzZWRcbiAgYWx0ZXJBbGlhc09mOiAoYWxpYXNPZiktPlxuICAgIGFsaWFzT2ZcbiAgZ2V0T3B0aW9uczogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9wdGlvbnM/XG4gICAgICAgIHJldHVybiBAY21kT3B0aW9uc1xuICAgICAgb3B0ID0gQGNtZC5fb3B0aW9uc0ZvckFsaWFzZWQoQGdldEFsaWFzZWQoKSlcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIG9wdCA9IENvZGV3YXZlLnV0aWwubWVyZ2Uob3B0LEBjbWRPYmouZ2V0T3B0aW9ucygpKVxuICAgICAgQGNtZE9wdGlvbnMgPSBvcHRcbiAgICAgIHJldHVybiBvcHRcbiAgZ2V0T3B0aW9uOiAoa2V5KSAtPlxuICAgIG9wdGlvbnMgPSBAZ2V0T3B0aW9ucygpXG4gICAgaWYgb3B0aW9ucz8gYW5kIGtleSBvZiBvcHRpb25zXG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gIGdldFBhcmFtOiAobmFtZXMsIGRlZlZhbCA9IG51bGwpIC0+XG4gICAgbmFtZXMgPSBbbmFtZXNdIGlmICh0eXBlb2YgbmFtZXMgaW4gWydzdHJpbmcnLCdudW1iZXInXSlcbiAgICBmb3IgbiBpbiBuYW1lc1xuICAgICAgcmV0dXJuIEBuYW1lZFtuXSBpZiBAbmFtZWRbbl0/XG4gICAgICByZXR1cm4gQHBhcmFtc1tuXSBpZiBAcGFyYW1zW25dP1xuICAgIHJldHVybiBkZWZWYWxcbiAgYW5jZXN0b3JDbWRzOiAtPlxuICAgIGlmIEBjb250ZXh0LmNvZGV3YXZlPy5pbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBjb250ZXh0LmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGFuY2VzdG9yQ21kc0FuZFNlbGY6IC0+XG4gICAgcmV0dXJuIEBhbmNlc3RvckNtZHMoKS5jb25jYXQoW0BjbWRdKVxuICBydW5FeGVjdXRlRnVuY3Q6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLmV4ZWN1dGUoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWRGaW5hbCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5leGVjdXRlRnVuY3Q/XG4gICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZUZ1bmN0KHRoaXMpXG4gIHJhd1Jlc3VsdDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmV0dXJuIEBjbWRPYmoucmVzdWx0KClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkRmluYWwoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQucmVzdWx0RnVuY3Q/XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0RnVuY3QodGhpcylcbiAgICAgIGlmIGNtZC5yZXN1bHRTdHI/XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0U3RyXG4gIHJlc3VsdDogLT4gXG4gICAgQGluaXQoKVxuICAgIGlmIEByZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICBpZiAocmVzID0gQHJhd1Jlc3VsdCgpKT9cbiAgICAgICAgcmVzID0gQGZvcm1hdEluZGVudChyZXMpXG4gICAgICAgIGlmIHJlcy5sZW5ndGggPiAwIGFuZCBAZ2V0T3B0aW9uKCdwYXJzZScsdGhpcykgXG4gICAgICAgICAgcGFyc2VyID0gQGdldFBhcnNlckZvclRleHQocmVzKVxuICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICAgIGlmIGFsdGVyRnVuY3QgPSBAZ2V0T3B0aW9uKCdhbHRlclJlc3VsdCcsdGhpcylcbiAgICAgICAgICByZXMgPSBhbHRlckZ1bmN0KHJlcyx0aGlzKVxuICAgICAgICByZXR1cm4gcmVzXG4gIGdldFBhcnNlckZvclRleHQ6ICh0eHQ9JycpIC0+XG4gICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKHR4dCksIHtpbkluc3RhbmNlOnRoaXN9KVxuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlXG4gICAgcmV0dXJuIHBhcnNlclxuICBnZXRJbmRlbnQ6IC0+XG4gICAgcmV0dXJuIDBcbiAgZm9ybWF0SW5kZW50OiAodGV4dCkgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx0L2csJyAgJylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBhcHBseUluZGVudDogKHRleHQpIC0+XG4gICAgcmV0dXJuIENvZGV3YXZlLnV0aWwuaW5kZW50Tm90Rmlyc3QodGV4dCxAZ2V0SW5kZW50KCksXCIgXCIpIiwiIyBbcGF3YV1cbiMgICByZXBsYWNlICdjbGFzcyBAQ29kZXdhdmUnICdjbGFzcyBDb2Rld2F2ZSgpOidcbiMgICByZXBsYWNlIC9jcG9zLihcXHcrKS8gY3Bvc1snJDEnXVxuIyAgIHJlcGxhY2UgJ25ldyBDb2Rld2F2ZSgnIENvZGV3YXZlKFxuIyAgIHJlcGxhY2UgJ0BDb2Rld2F2ZS5pbml0ID0gLT4nICdkZWYgaW5pdCgpOidcblxuaW1wb3J0IHsgUHJvY2VzcyB9IGZyb20gJy4vUHJvY2Vzcyc7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSB9IGZyb20gJy4vUG9zaXRpb25lZENtZEluc3RhbmNlJztcbmltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL0xvZ2dlcic7XG5cbmV4cG9ydCBjbGFzcyBDb2Rld2F2ZVxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBDb2Rld2F2ZS5pbml0KClcbiAgICAjIENvZGV3YXZlLmxvZ2dlci50b01vbml0b3IodGhpcywncnVuQXRDdXJzb3JQb3MnKVxuICAgIEBtYXJrZXIgPSAnW1tbW2NvZGV3YXZlX21hcnF1ZXJdXV1dJ1xuICAgIEB2YXJzID0ge31cbiAgICBcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgICdicmFrZXRzJyA6ICd+ficsXG4gICAgICAnZGVjbycgOiAnficsXG4gICAgICAnY2xvc2VDaGFyJyA6ICcvJyxcbiAgICAgICdub0V4ZWN1dGVDaGFyJyA6ICchJyxcbiAgICAgICdjYXJyZXRDaGFyJyA6ICd8JyxcbiAgICAgICdjaGVja0NhcnJldCcgOiB0cnVlLFxuICAgICAgJ2luSW5zdGFuY2UnIDogbnVsbFxuICAgIH1cbiAgICBAcGFyZW50ID0gb3B0aW9uc1sncGFyZW50J11cbiAgICBcbiAgICBAbmVzdGVkID0gaWYgQHBhcmVudD8gdGhlbiBAcGFyZW50Lm5lc3RlZCsxIGVsc2UgMFxuICAgIFxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIEBlZGl0b3IuYmluZGVkVG8odGhpcykgaWYgQGVkaXRvcj9cbiAgICBcbiAgICBAY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMpXG4gICAgaWYgQGluSW5zdGFuY2U/XG4gICAgICBAY29udGV4dC5wYXJlbnQgPSBAaW5JbnN0YW5jZS5jb250ZXh0XG5cbiAgICBAbG9nZ2VyID0gbmV3IExvZ2dlcigpXG5cbiAgb25BY3RpdmF0aW9uS2V5OiAtPlxuICAgIEBwcm9jZXNzID0gbmV3IFByb2Nlc3MoKVxuICAgIEBsb2dnZXIubG9nKCdhY3RpdmF0aW9uIGtleScpXG4gICAgQHJ1bkF0Q3Vyc29yUG9zKClcbiAgICAjIENvZGV3YXZlLmxvZ2dlci5yZXN1bWUoKVxuICAgIEBwcm9jZXNzID0gbnVsbFxuICBydW5BdEN1cnNvclBvczogLT5cbiAgICBpZiBAZWRpdG9yLmFsbG93TXVsdGlTZWxlY3Rpb24oKVxuICAgICAgQHJ1bkF0TXVsdGlQb3MoQGVkaXRvci5nZXRNdWx0aVNlbCgpKVxuICAgIGVsc2VcbiAgICAgIEBydW5BdFBvcyhAZWRpdG9yLmdldEN1cnNvclBvcygpKVxuICBydW5BdFBvczogKHBvcyktPlxuICAgIEBydW5BdE11bHRpUG9zKFtwb3NdKVxuICBydW5BdE11bHRpUG9zOiAobXVsdGlQb3MpLT5cbiAgICBpZiBtdWx0aVBvcy5sZW5ndGggPiAwXG4gICAgICBjbWQgPSBAY29tbWFuZE9uUG9zKG11bHRpUG9zWzBdLmVuZClcbiAgICAgIGlmIGNtZD9cbiAgICAgICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgICAgIGNtZC5zZXRNdWx0aVBvcyhtdWx0aVBvcylcbiAgICAgICAgY21kLmluaXQoKVxuICAgICAgICBAbG9nZ2VyLmxvZyhjbWQpXG4gICAgICAgIGNtZC5leGVjdXRlKClcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbXVsdGlQb3NbMF0uc3RhcnQgPT0gbXVsdGlQb3NbMF0uZW5kXG4gICAgICAgICAgQGFkZEJyYWtldHMobXVsdGlQb3MpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcylcbiAgY29tbWFuZE9uUG9zOiAocG9zKSAtPlxuICAgIGlmIEBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIGFuZCBAZm9sbG93ZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAxIFxuICAgICAgcHJldiA9IHBvcy1AYnJha2V0cy5sZW5ndGhcbiAgICAgIG5leHQgPSBwb3NcbiAgICBlbHNlXG4gICAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAwXG4gICAgICAgIHBvcyAtPSBAYnJha2V0cy5sZW5ndGhcbiAgICAgIHByZXYgPSBAZmluZFByZXZCcmFrZXQocG9zKVxuICAgICAgdW5sZXNzIHByZXY/XG4gICAgICAgIHJldHVybiBudWxsIFxuICAgICAgbmV4dCA9IEBmaW5kTmV4dEJyYWtldChwb3MtMSlcbiAgICAgIGlmICFuZXh0PyBvciBAY291bnRQcmV2QnJha2V0KHByZXYpICUgMiAhPSAwIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMscHJldixAZWRpdG9yLnRleHRTdWJzdHIocHJldixuZXh0K0BicmFrZXRzLmxlbmd0aCkpXG4gIG5leHRDbWQ6IChzdGFydCA9IDApIC0+XG4gICAgcG9zID0gc3RhcnRcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyAsW0BicmFrZXRzLFwiXFxuXCJdKVxuICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGhcbiAgICAgIGlmIGYuc3RyID09IEBicmFrZXRzXG4gICAgICAgIGlmIGJlZ2lubmluZz9cbiAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIEBlZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zK0BicmFrZXRzLmxlbmd0aCkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvc1xuICAgICAgZWxzZVxuICAgICAgICBiZWdpbm5pbmcgPSBudWxsXG4gICAgbnVsbFxuICBnZXRFbmNsb3NpbmdDbWQ6IChwb3MgPSAwKSAtPlxuICAgIGNwb3MgPSBwb3NcbiAgICBjbG9zaW5nUHJlZml4ID0gQGJyYWtldHMgKyBAY2xvc2VDaGFyXG4gICAgd2hpbGUgKHAgPSBAZmluZE5leHQoY3BvcyxjbG9zaW5nUHJlZml4KSk/XG4gICAgICBpZiBjbWQgPSBAY29tbWFuZE9uUG9zKHArY2xvc2luZ1ByZWZpeC5sZW5ndGgpXG4gICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgICAgaWYgY21kLnBvcyA8IHBvc1xuICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgIGVsc2VcbiAgICAgICAgY3BvcyA9IHArY2xvc2luZ1ByZWZpeC5sZW5ndGhcbiAgICBudWxsXG4gIHByZWNlZGVkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLUBicmFrZXRzLmxlbmd0aCxwb3MpID09IEBicmFrZXRzXG4gIGZvbGxvd2VkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLHBvcytAYnJha2V0cy5sZW5ndGgpID09IEBicmFrZXRzXG4gIGNvdW50UHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICBpID0gMFxuICAgIHdoaWxlIChzdGFydCA9IEBmaW5kUHJldkJyYWtldChzdGFydCkpP1xuICAgICAgaSsrXG4gICAgcmV0dXJuIGlcbiAgaXNFbmRMaW5lOiAocG9zKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrMSkgPT0gXCJcXG5cIiBvciBwb3MgKyAxID49IEBlZGl0b3IudGV4dExlbigpXG4gIGZpbmRQcmV2QnJha2V0OiAoc3RhcnQpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHRCcmFrZXQoc3RhcnQsLTEpXG4gIGZpbmROZXh0QnJha2V0OiAoc3RhcnQsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW0BicmFrZXRzLFwiXFxuXCJdLCBkaXJlY3Rpb24pXG4gICAgXG4gICAgZi5wb3MgaWYgZiBhbmQgZi5zdHIgPT0gQGJyYWtldHNcbiAgZmluZFByZXY6IChzdGFydCxzdHJpbmcpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHQoc3RhcnQsc3RyaW5nLC0xKVxuICBmaW5kTmV4dDogKHN0YXJ0LHN0cmluZyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBmID0gQGZpbmRBbnlOZXh0KHN0YXJ0ICxbc3RyaW5nXSwgZGlyZWN0aW9uKVxuICAgIGYucG9zIGlmIGZcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci5maW5kQW55TmV4dChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbilcbiAgICBcbiAgZmluZE1hdGNoaW5nUGFpcjogKHN0YXJ0UG9zLG9wZW5pbmcsY2xvc2luZyxkaXJlY3Rpb24gPSAxKSAtPlxuICAgIHBvcyA9IHN0YXJ0UG9zXG4gICAgbmVzdGVkID0gMFxuICAgIHdoaWxlIGYgPSBAZmluZEFueU5leHQocG9zLFtjbG9zaW5nLG9wZW5pbmddLGRpcmVjdGlvbilcbiAgICAgIHBvcyA9IGYucG9zICsgKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBmLnN0ci5sZW5ndGggZWxzZSAwKVxuICAgICAgaWYgZi5zdHIgPT0gKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBjbG9zaW5nIGVsc2Ugb3BlbmluZylcbiAgICAgICAgaWYgbmVzdGVkID4gMFxuICAgICAgICAgIG5lc3RlZC0tXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZlxuICAgICAgZWxzZVxuICAgICAgICBuZXN0ZWQrK1xuICAgIG51bGxcbiAgYWRkQnJha2V0czogKHBvcykgLT5cbiAgICBwb3MgPSBDb2Rld2F2ZS51dGlsLnBvc0NvbGxlY3Rpb24ocG9zKVxuICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKEBicmFrZXRzLEBicmFrZXRzKS5tYXAoIChyKS0+ci5zZWxlY3RDb250ZW50KCkgKVxuICAgIEBlZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICBwcm9tcHRDbG9zaW5nQ21kOiAoc2VsZWN0aW9ucykgLT5cbiAgICBAY2xvc2luZ1Byb21wLnN0b3AoKSBpZiBAY2xvc2luZ1Byb21wP1xuICAgIEBjbG9zaW5nUHJvbXAgPSBDb2Rld2F2ZS5DbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsc2VsZWN0aW9ucykuYmVnaW4oKSAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAvXFwobmV3ICguKilcXCkuYmVnaW4vICQxLmJlZ2luIHJlcGFyc2VcbiAgcGFyc2VBbGw6IChyZWN1cnNpdmUgPSB0cnVlKSAtPlxuICAgIGlmIEBuZXN0ZWQgPiAxMDBcbiAgICAgIHRocm93IFwiSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb25cIlxuICAgIHBvcyA9IDBcbiAgICB3aGlsZSBjbWQgPSBAbmV4dENtZChwb3MpXG4gICAgICBwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgIEBlZGl0b3Iuc2V0Q3Vyc29yUG9zKHBvcylcbiAgICAgICMgY29uc29sZS5sb2coY21kKVxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgcmVjdXJzaXZlIGFuZCBjbWQuY29udGVudD8gYW5kICghY21kLmdldENtZCgpPyBvciAhY21kLmdldE9wdGlvbigncHJldmVudFBhcnNlQWxsJykpXG4gICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcihjbWQuY29udGVudCksIHtwYXJlbnQ6IHRoaXN9KVxuICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICBpZiBjbWQuZXhlY3V0ZSgpP1xuICAgICAgICBpZiBjbWQucmVwbGFjZUVuZD9cbiAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcG9zID0gQGVkaXRvci5nZXRDdXJzb3JQb3MoKS5lbmRcbiAgICByZXR1cm4gQGdldFRleHQoKVxuICBnZXRUZXh0OiAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHQoKVxuICBpc1Jvb3Q6IC0+XG4gICAgcmV0dXJuICFAcGFyZW50PyBhbmQgKCFAaW5JbnN0YW5jZT8gb3IgIUBpbkluc3RhbmNlLmZpbmRlcj8pXG4gIGdldFJvb3Q6IC0+XG4gICAgaWYgQGlzUm9vdFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICBlbHNlIGlmIEBwYXJlbnQ/XG4gICAgICByZXR1cm4gQHBhcmVudC5nZXRSb290KClcbiAgICBlbHNlIGlmIEBpbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBpbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICByZW1vdmVDYXJyZXQ6ICh0eHQpIC0+XG4gICAgcmV0dXJuIENvZGV3YXZlLnV0aWwucmVtb3ZlQ2FycmV0KHR4dCxAY2FycmV0Q2hhcilcbiAgZ2V0Q2FycmV0UG9zOiAodHh0KSAtPlxuICAgIHJldHVybiBDb2Rld2F2ZS51dGlsLmdldENhcnJldFBvcyh0eHQsQGNhcnJldENoYXIpXG4gIHJlZ01hcmtlcjogKGZsYWdzPVwiZ1wiKSAtPiAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBmbGFncz1cImdcIiBmbGFncz0wIFxuICAgIHJldHVybiBuZXcgUmVnRXhwKENvZGV3YXZlLnV0aWwuZXNjYXBlUmVnRXhwKEBtYXJrZXIpLCBmbGFncylcbiAgcmVtb3ZlTWFya2VyczogKHRleHQpIC0+XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZShAcmVnTWFya2VyKCksJycpICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIEByZWdNYXJrZXIoKSBzZWxmLm1hcmtlciBcblxuICBAaW5pdDogLT5cbiAgICB1bmxlc3MgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIENvbW1hbmQuaW5pdENtZHMoKVxuICAgICAgQ29tbWFuZC5sb2FkQ21kcygpXG5cbiAgQGluaXRlZDogZmFsc2UiLCIjIFtwYXdhIHB5dGhvbl1cbiMgICByZXBsYWNlIENvZGV3YXZlLkNvbW1hbmQuY21kcyBjbWRzXG4jICAgcmVwbGFjZSBDb2Rld2F2ZS5Db21tYW5kIENvbW1hbmRcbiMgICByZXBsYWNlIEBDb2Rld2F2ZS5Db21tYW5kLiAnJ1xuXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFN0b3JhZ2UgfSBmcm9tICcuL1N0b3JhZ2UnO1xuXG5fb3B0S2V5ID0gKGtleSxkaWN0LGRlZlZhbCA9IG51bGwpIC0+XG4gICMgb3B0aW9uYWwgRGljdGlvbmFyeSBrZXlcbiAgcmV0dXJuIGlmIGtleSBvZiBkaWN0IHRoZW4gZGljdFtrZXldIGVsc2UgZGVmVmFsXG5cblxuZXhwb3J0IGNsYXNzIENvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAbmFtZSxAZGF0YT1udWxsLEBwYXJlbnQ9bnVsbCkgLT5cbiAgICBAY21kcyA9IFtdXG4gICAgQGRldGVjdG9ycyA9IFtdXG4gICAgQGV4ZWN1dGVGdW5jdCA9IEByZXN1bHRGdW5jdCA9IEByZXN1bHRTdHIgPSBAYWxpYXNPZiA9IEBjbHMgPSBudWxsXG4gICAgQGFsaWFzZWQgPSBudWxsXG4gICAgQGZ1bGxOYW1lID0gQG5hbWVcbiAgICBAZGVwdGggPSAwXG4gICAgW0BfcGFyZW50LCBAX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdXG4gICAgQHNldFBhcmVudChwYXJlbnQpXG4gICAgQGRlZmF1bHRzID0ge31cbiAgICBcbiAgICBAZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBuYW1lVG9QYXJhbTogbnVsbCxcbiAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgYmVmb3JlRXhlY3V0ZTogbnVsbCxcbiAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgIHJlcGxhY2VCb3g6IGZhbHNlLFxuICAgIH1cbiAgICBAb3B0aW9ucyA9IHt9XG4gICAgQGZpbmFsT3B0aW9ucyA9IG51bGxcbiAgcGFyZW50OiAtPlxuICAgIHJldHVybiBAX3BhcmVudFxuICBzZXRQYXJlbnQ6ICh2YWx1ZSkgLT5cbiAgICBpZiBAX3BhcmVudCAhPSB2YWx1ZVxuICAgICAgQF9wYXJlbnQgPSB2YWx1ZVxuICAgICAgQGZ1bGxOYW1lID0gKFxuICAgICAgICBpZiBAX3BhcmVudD8gYW5kIEBfcGFyZW50Lm5hbWU/XG4gICAgICAgICAgQF9wYXJlbnQuZnVsbE5hbWUgKyAnOicgKyBAbmFtZSBcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICBAbmFtZVxuICAgICAgKVxuICAgICAgQGRlcHRoID0gKFxuICAgICAgICBpZiBAX3BhcmVudD8gYW5kIEBfcGFyZW50LmRlcHRoP1xuICAgICAgICB0aGVuIEBfcGFyZW50LmRlcHRoICsgMVxuICAgICAgICBlbHNlIDBcbiAgICAgIClcbiAgaW5pdDogLT5cbiAgICBpZiAhQF9pbml0ZWRcbiAgICAgIEBfaW5pdGVkID0gdHJ1ZVxuICAgICAgQHBhcnNlRGF0YShAZGF0YSlcbiAgICByZXR1cm4gdGhpc1xuICB1bnJlZ2lzdGVyOiAtPlxuICAgIEBfcGFyZW50LnJlbW92ZUNtZCh0aGlzKVxuICBpc0VkaXRhYmxlOiAtPlxuICAgIHJldHVybiBAcmVzdWx0U3RyPyBvciBAYWxpYXNPZj9cbiAgaXNFeGVjdXRhYmxlOiAtPlxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgIGZvciBwIGluIFsncmVzdWx0U3RyJywncmVzdWx0RnVuY3QnLCdjbHMnLCdleGVjdXRlRnVuY3QnXVxuICAgICAgaWYgdGhpc1twXT9cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgaXNFeGVjdXRhYmxlV2l0aE5hbWU6IChuYW1lKSAtPlxuICAgIGlmIEBhbGlhc09mP1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgIGFsaWFzT2YgPSBAYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLG5hbWUpXG4gICAgICBhbGlhc2VkID0gQF9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihhbGlhc09mKSlcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIEBpc0V4ZWN1dGFibGUoKVxuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgZm9yIHAgaW4gWydyZXN1bHRTdHInLCdyZXN1bHRGdW5jdCddXG4gICAgICBpZiB0aGlzW3BdP1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICBnZXREZWZhdWx0czogLT5cbiAgICByZXMgPSB7fVxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJlcyA9IENvZGV3YXZlLnV0aWwubWVyZ2UocmVzLGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSlcbiAgICByZXMgPSBDb2Rld2F2ZS51dGlsLm1lcmdlKHJlcyxAZGVmYXVsdHMpXG4gICAgcmV0dXJuIHJlc1xuICBfYWxpYXNlZEZyb21GaW5kZXI6IChmaW5kZXIpIC0+XG4gICAgICBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2VcbiAgICAgIGZpbmRlci5tdXN0RXhlY3V0ZSA9IGZhbHNlXG4gICAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2VcbiAgICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIGdldEFsaWFzZWQ6IC0+XG4gICAgaWYgQGFsaWFzT2Y/XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgcmV0dXJuIEBfYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoQGFsaWFzT2YpKVxuICBzZXRPcHRpb25zOiAoZGF0YSkgLT5cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGF0YVxuICAgICAgaWYga2V5IG9mIEBkZWZhdWx0T3B0aW9uc1xuICAgICAgICBAb3B0aW9uc1trZXldID0gdmFsXG4gIF9vcHRpb25zRm9yQWxpYXNlZDogKGFsaWFzZWQpIC0+XG4gICAgb3B0ID0ge31cbiAgICBvcHQgPSBDb2Rld2F2ZS51dGlsLm1lcmdlKG9wdCxAZGVmYXVsdE9wdGlvbnMpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIG9wdCA9IENvZGV3YXZlLnV0aWwubWVyZ2Uob3B0LGFsaWFzZWQuZ2V0T3B0aW9ucygpKVxuICAgIHJldHVybiBDb2Rld2F2ZS51dGlsLm1lcmdlKG9wdCxAb3B0aW9ucylcbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4gQF9vcHRpb25zRm9yQWxpYXNlZChAZ2V0QWxpYXNlZCgpKVxuICBnZXRPcHRpb246IChrZXkpIC0+XG4gICAgb3B0aW9ucyA9IEBnZXRPcHRpb25zKClcbiAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBoZWxwOiAtPlxuICAgIGNtZCA9IEBnZXRDbWQoJ2hlbHAnKVxuICAgIGlmIGNtZD9cbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLnJlc3VsdFN0clxuICBwYXJzZURhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gZGF0YVxuICAgIGlmIHR5cGVvZiBkYXRhID09ICdzdHJpbmcnXG4gICAgICBAcmVzdWx0U3RyID0gZGF0YVxuICAgICAgQG9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2UgaWYgZGF0YT8gIyBbcGF3YSBweXRob25dIHJlcGxhY2UgZGF0YT8gXCJpc2luc3RhbmNlKGRhdGEsZGljdClcIlxuICAgICAgcmV0dXJuIEBwYXJzZURpY3REYXRhKGRhdGEpXG4gICAgcmV0dXJuIGZhbHNlXG4gIHBhcnNlRGljdERhdGE6IChkYXRhKSAtPlxuICAgIHJlcyA9IF9vcHRLZXkoJ3Jlc3VsdCcsZGF0YSlcbiAgICBpZiB0eXBlb2YgcmVzID09IFwiZnVuY3Rpb25cIlxuICAgICAgQHJlc3VsdEZ1bmN0ID0gcmVzXG4gICAgZWxzZSBpZiByZXM/XG4gICAgICBAcmVzdWx0U3RyID0gcmVzXG4gICAgICBAb3B0aW9uc1sncGFyc2UnXSA9IHRydWVcbiAgICBleGVjdXRlID0gX29wdEtleSgnZXhlY3V0ZScsZGF0YSlcbiAgICBpZiB0eXBlb2YgZXhlY3V0ZSA9PSBcImZ1bmN0aW9uXCJcbiAgICAgIEBleGVjdXRlRnVuY3QgPSBleGVjdXRlXG4gICAgQGFsaWFzT2YgPSBfb3B0S2V5KCdhbGlhc09mJyxkYXRhKVxuICAgIEBjbHMgPSBfb3B0S2V5KCdjbHMnLGRhdGEpXG4gICAgQGRlZmF1bHRzID0gX29wdEtleSgnZGVmYXVsdHMnLGRhdGEsQGRlZmF1bHRzKVxuICAgIFxuICAgIEBzZXRPcHRpb25zKGRhdGEpXG4gICAgXG4gICAgaWYgJ2hlbHAnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLGRhdGFbJ2hlbHAnXSx0aGlzKSlcbiAgICBpZiAnZmFsbGJhY2snIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2ZhbGxiYWNrJyxkYXRhWydmYWxsYmFjayddLHRoaXMpKVxuICAgICAgXG4gICAgaWYgJ2NtZHMnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWRzKGRhdGFbJ2NtZHMnXSlcbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDbWRzOiAoY21kcykgLT5cbiAgICBmb3IgbmFtZSwgZGF0YSBvZiBjbWRzXG4gICAgICBAYWRkQ21kKG5ldyBDb21tYW5kKG5hbWUsZGF0YSx0aGlzKSlcbiAgYWRkQ21kOiAoY21kKSAtPlxuICAgIGV4aXN0cyA9IEBnZXRDbWQoY21kLm5hbWUpXG4gICAgaWYgZXhpc3RzP1xuICAgICAgQHJlbW92ZUNtZChleGlzdHMpXG4gICAgY21kLnNldFBhcmVudCh0aGlzKVxuICAgIEBjbWRzLnB1c2goY21kKVxuICAgIHJldHVybiBjbWRcbiAgcmVtb3ZlQ21kOiAoY21kKSAtPlxuICAgIGlmIChpID0gQGNtZHMuaW5kZXhPZihjbWQpKSA+IC0xXG4gICAgICBAY21kcy5zcGxpY2UoaSwgMSlcbiAgICByZXR1cm4gY21kXG4gIGdldENtZDogKGZ1bGxuYW1lKSAtPlxuICAgIEBpbml0KClcbiAgICBbc3BhY2UsbmFtZV0gPSBDb2Rld2F2ZS51dGlsLnNwbGl0Rmlyc3ROYW1lc3BhY2UoZnVsbG5hbWUpXG4gICAgaWYgc3BhY2U/XG4gICAgICByZXR1cm4gQGdldENtZChzcGFjZSkuZ2V0Q21kKG5hbWUpXG4gICAgZm9yIGNtZCBpbiBAY21kc1xuICAgICAgaWYgY21kLm5hbWUgPT0gbmFtZVxuICAgICAgICByZXR1cm4gY21kXG4gIHNldENtZERhdGE6IChmdWxsbmFtZSxkYXRhKSAtPlxuICAgIEBzZXRDbWQoZnVsbG5hbWUsbmV3IENvbW1hbmQoZnVsbG5hbWUuc3BsaXQoJzonKS5wb3AoKSxkYXRhKSlcbiAgc2V0Q21kOiAoZnVsbG5hbWUsY21kKSAtPlxuICAgIFtzcGFjZSxuYW1lXSA9IENvZGV3YXZlLnV0aWwuc3BsaXRGaXJzdE5hbWVzcGFjZShmdWxsbmFtZSlcbiAgICBpZiBzcGFjZT9cbiAgICAgIG5leHQgPSBAZ2V0Q21kKHNwYWNlKVxuICAgICAgdW5sZXNzIG5leHQ/XG4gICAgICAgIG5leHQgPSBAYWRkQ21kKG5ldyBDb21tYW5kKHNwYWNlKSlcbiAgICAgIHJldHVybiBuZXh0LnNldENtZChuYW1lLGNtZClcbiAgICBlbHNlXG4gICAgICBAYWRkQ21kKGNtZClcbiAgICAgIHJldHVybiBjbWRcbiAgYWRkRGV0ZWN0b3I6IChkZXRlY3RvcikgLT5cbiAgICBAZGV0ZWN0b3JzLnB1c2goZGV0ZWN0b3IpXG4gICAgXG4gIEBjbWRJbml0aWFsaXNlcnMgPSBbXVxuXG4gIEBpbml0Q21kczogLT5cbiAgICBDb21tYW5kLmNtZHMgPSBuZXcgQ29tbWFuZChudWxsLHtcbiAgICAgICdjbWRzJzp7XG4gICAgICAgICdoZWxsbyc6e1xuICAgICAgICAgIGhlbHA6IFwiXCJcIlxuICAgICAgICAgIFwiSGVsbG8sIHdvcmxkIVwiIGlzIHR5cGljYWxseSBvbmUgb2YgdGhlIHNpbXBsZXN0IHByb2dyYW1zIHBvc3NpYmxlIGluXG4gICAgICAgICAgbW9zdCBwcm9ncmFtbWluZyBsYW5ndWFnZXMsIGl0IGlzIGJ5IHRyYWRpdGlvbiBvZnRlbiAoLi4uKSB1c2VkIHRvXG4gICAgICAgICAgdmVyaWZ5IHRoYXQgYSBsYW5ndWFnZSBvciBzeXN0ZW0gaXMgb3BlcmF0aW5nIGNvcnJlY3RseSAtd2lraXBlZGlhXG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgcmVzdWx0OiAnSGVsbG8sIFdvcmxkISdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgZm9yIGluaXRpYWxpc2VyIGluIENvbW1hbmQuY21kSW5pdGlhbGlzZXJzXG4gICAgICBpbml0aWFsaXNlcigpXG5cbiAgQHNhdmVDbWQ6IChmdWxsbmFtZSwgZGF0YSkgLT5cbiAgICBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICAgIENvZGV3YXZlLkNvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLGRhdGEpXG4gICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICB1bmxlc3Mgc2F2ZWRDbWRzP1xuICAgICAgc2F2ZWRDbWRzID0ge31cbiAgICBzYXZlZENtZHNbZnVsbG5hbWVdID0gZGF0YVxuICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuXG4gIEBsb2FkQ21kczogLT5cbiAgICBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICAgIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpXG4gICAgaWYgc2F2ZWRDbWRzPyBcbiAgICAgIGZvciBmdWxsbmFtZSwgZGF0YSBvZiBzYXZlZENtZHNcbiAgICAgICAgQ29kZXdhdmUuQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpXG5cbiAgQHJlc2V0U2F2ZWQ6IC0+XG4gICAgc3RvcmFnZSA9IG5ldyBTdG9yYWdlKClcbiAgICBzdG9yYWdlLnNhdmUoJ2NtZHMnLHt9KVxuICBcblxuZXhwb3J0IGNsYXNzIEJhc2VDb21tYW5kXG4gIGNvbnN0cnVjdG9yOiAoQGluc3RhbmNlKSAtPlxuICBpbml0OiAtPlxuICAgICNcbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgcmV0dXJuIHRoaXNbXCJyZXN1bHRcIl0/ICMgW3Bhd2FdIHJlcGxhY2UgdGhpc1tcInJlc3VsdFwiXT8gJ2hhc2F0dHIoc2VsZixcInJlc3VsdFwiKSdcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgcmV0dXJuIHt9XG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIHt9XG4gICAgICAiLCJcbmltcG9ydCB7IENtZEZpbmRlciB9IGZyb20gJy4vQ21kRmluZGVyJztcbmltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5cbmV4cG9ydCBjbGFzcyBDb250ZXh0XG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlKSAtPlxuICAgIEBuYW1lU3BhY2VzID0gW11cbiAgXG4gIGFkZE5hbWVTcGFjZTogKG5hbWUpIC0+XG4gICAgaWYgbmFtZSBub3QgaW4gQG5hbWVTcGFjZXMgXG4gICAgICBAbmFtZVNwYWNlcy5wdXNoKG5hbWUpXG4gICAgICBAX25hbWVzcGFjZXMgPSBudWxsXG4gIGFkZE5hbWVzcGFjZXM6IChzcGFjZXMpIC0+XG4gICAgaWYgc3BhY2VzIFxuICAgICAgaWYgdHlwZW9mIHNwYWNlcyA9PSAnc3RyaW5nJ1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXVxuICAgICAgZm9yIHNwYWNlIGluIHNwYWNlcyBcbiAgICAgICAgQGFkZE5hbWVTcGFjZShzcGFjZSlcbiAgcmVtb3ZlTmFtZVNwYWNlOiAobmFtZSkgLT5cbiAgICBAbmFtZVNwYWNlcyA9IEBuYW1lU3BhY2VzLmZpbHRlciAobikgLT4gbiBpc250IG5hbWVcblxuICBnZXROYW1lU3BhY2VzOiAtPlxuICAgIHVubGVzcyBAX25hbWVzcGFjZXM/XG4gICAgICBucGNzID0gWydjb3JlJ10uY29uY2F0KEBuYW1lU3BhY2VzKVxuICAgICAgaWYgQHBhcmVudD9cbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KEBwYXJlbnQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgQF9uYW1lc3BhY2VzID0gQ29kZXdhdmUudXRpbC51bmlxdWUobnBjcylcbiAgICByZXR1cm4gQF9uYW1lc3BhY2VzXG4gIGdldENtZDogKGNtZE5hbWUsbmFtZVNwYWNlcyA9IFtdKSAtPlxuICAgIGZpbmRlciA9IEBnZXRGaW5kZXIoY21kTmFtZSxuYW1lU3BhY2VzKVxuICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUsbmFtZVNwYWNlcyA9IFtdKSAtPlxuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IG5hbWVTcGFjZXNcbiAgICAgIHVzZURldGVjdG9yczogQGlzUm9vdCgpXG4gICAgICBjb2Rld2F2ZTogQGNvZGV3YXZlXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSlcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD9cbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIGNjLmluZGV4T2YoJyVzJykgPiAtMVxuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJyxzdHIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgd3JhcENvbW1lbnRMZWZ0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLGkpICsgc3RyXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gIHdyYXBDb21tZW50UmlnaHQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkrMilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2NcbiAgY21kSW5zdGFuY2VGb3I6IChjbWQpIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsdGhpcylcbiAgZ2V0Q29tbWVudENoYXI6IC0+XG4gICAgaWYgQGNvbW1lbnRDaGFyP1xuICAgICAgcmV0dXJuIEBjb21tZW50Q2hhclxuICAgIGNtZCA9IEBnZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG4gICAgaWYgY21kP1xuICAgICAgaW5zdCA9IEBjbWRJbnN0YW5jZUZvcihjbWQpXG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnXG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICBAY29tbWVudENoYXIgPSBjaGFyXG4gICAgcmV0dXJuIEBjb21tZW50Q2hhciIsImV4cG9ydCBjbGFzcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQG5hbWVzcGFjZSA9IG51bGxcbiAgICBAX2xhbmcgPSBudWxsXG4gIGJpbmRlZFRvOiAoY29kZXdhdmUpIC0+XG4gICAgI1xuICB0ZXh0OiAodmFsKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRMZW46IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCA9IG51bGwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBiZWdpblVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBlbmRVbmRvQWN0aW9uOiAtPlxuICAgICNcbiAgZ2V0TGFuZzogLT5cbiAgICByZXR1cm4gQF9sYW5nXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdDogLT5cbiAgICByZXR1cm4gbnVsbFxuICBhbGxvd011bHRpU2VsZWN0aW9uOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBzZXRNdWx0aVNlbDogKHNlbGVjdGlvbnMpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRNdWx0aVNlbDogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGNhbkxpc3RlblRvQ2hhbmdlOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIFxuICBnZXRMaW5lQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIG5ldyBDb2Rld2F2ZS51dGlsLlBvcyhAZmluZExpbmVTdGFydChwb3MpLEBmaW5kTGluZUVuZChwb3MpKVxuICBmaW5kTGluZVN0YXJ0OiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCJdLCAtMSlcbiAgICByZXR1cm4gaWYgcCB0aGVuIHAucG9zKzEgZWxzZSAwXG4gIGZpbmRMaW5lRW5kOiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCIsXCJcXHJcIl0pXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcyBlbHNlIEB0ZXh0TGVuKClcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBpZiBkaXJlY3Rpb24gPiAwXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoc3RhcnQsQHRleHRMZW4oKSlcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoMCxzdGFydClcbiAgICBiZXN0UG9zID0gbnVsbFxuICAgIGZvciBzdHJpIGluIHN0cmluZ3NcbiAgICAgIHBvcyA9IGlmIGRpcmVjdGlvbiA+IDAgdGhlbiB0ZXh0LmluZGV4T2Yoc3RyaSkgZWxzZSB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpXG4gICAgICBpZiBwb3MgIT0gLTFcbiAgICAgICAgaWYgIWJlc3RQb3M/IG9yIGJlc3RQb3MqZGlyZWN0aW9uID4gcG9zKmRpcmVjdGlvblxuICAgICAgICAgIGJlc3RQb3MgPSBwb3NcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaVxuICAgIGlmIGJlc3RTdHI/XG4gICAgICByZXR1cm4gbmV3IENvZGV3YXZlLnV0aWwuU3RyUG9zKChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gYmVzdFBvcyArIHN0YXJ0IGVsc2UgYmVzdFBvcyksYmVzdFN0cilcbiAgICByZXR1cm4gbnVsbFxuICBcbiAgYXBwbHlSZXBsYWNlbWVudHM6IChyZXBsYWNlbWVudHMpIC0+XG4gICAgc2VsZWN0aW9ucyA9IFtdXG4gICAgb2Zmc2V0ID0gMFxuICAgIGZvciByZXBsIGluIHJlcGxhY2VtZW50c1xuICAgICAgcmVwbC53aXRoRWRpdG9yKHRoaXMpXG4gICAgICByZXBsLmFwcGx5T2Zmc2V0KG9mZnNldClcbiAgICAgIHJlcGwuYXBwbHkoKVxuICAgICAgb2Zmc2V0ICs9IHJlcGwub2Zmc2V0QWZ0ZXIodGhpcylcbiAgICAgIFxuICAgICAgc2VsZWN0aW9ucyA9IHNlbGVjdGlvbnMuY29uY2F0KHJlcGwuc2VsZWN0aW9ucylcbiAgICBAYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKHNlbGVjdGlvbnMpXG4gICAgICBcbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zOiAoc2VsZWN0aW9ucykgLT5cbiAgICBpZiBzZWxlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgIGlmIEBhbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICAgICAgQHNldE11bHRpU2VsKHNlbGVjdGlvbnMpXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCxzZWxlY3Rpb25zWzBdLmVuZCkiLCJleHBvcnQgY2xhc3MgTG9nZ2VyXG4gIGxvZzogKGFyZ3MuLi4pIC0+XG4gICAgaWYgd2luZG93LmNvbnNvbGUgYW5kIHRoaXMuZW5hYmxlZFxuICAgICAgZm9yIG1zZyBpbiBhcmdzXG4gICAgICAgIGNvbnNvbGUubG9nKG1zZylcbiAgZW5hYmxlZDogdHJ1ZVxuICBydW50aW1lOiAoZnVuY3QsbmFtZSA9IFwiZnVuY3Rpb25cIikgLT5cbiAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgcmVzID0gZnVuY3QoKVxuICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICBjb25zb2xlLmxvZyhcIiN7bmFtZX0gdG9vayAje3QxIC0gdDB9IG1pbGxpc2Vjb25kcy5cIilcbiAgICByZXNcbiAgbW9uaXRvckRhdGE6IHt9XG4gIHRvTW9uaXRvcjogKG9iaixuYW1lLHByZWZpeD0nJykgLT5cbiAgICBmdW5jdCA9IG9ialtuYW1lXVxuICAgIG9ialtuYW1lXSA9IC0+IFxuICAgICAgYXJncyA9IGFyZ3VtZW50c1xuICAgICAgdGhpcy5tb25pdG9yKCgtPiBmdW5jdC5hcHBseShvYmosYXJncykpLHByZWZpeCtuYW1lKVxuICBtb25pdG9yOiAoZnVuY3QsbmFtZSkgLT5cbiAgICB0MCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgcmVzID0gZnVuY3QoKVxuICAgIHQxID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICBpZiB0aGlzLm1vbml0b3JEYXRhW25hbWVdP1xuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS5jb3VudCsrXG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdLnRvdGFsKz0gdDEgLSB0MFxuICAgIGVsc2VcbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0gPSB7XG4gICAgICAgIGNvdW50OiAxXG4gICAgICAgIHRvdGFsOiB0MSAtIHQwXG4gICAgICB9XG4gICAgcmVzXG4gIHJlc3VtZTogLT5cbiAgICBjb25zb2xlLmxvZyh0aGlzLm1vbml0b3JEYXRhKVxuIiwiIyBbcGF3YV1cbiMgICByZXBsYWNlICdyZXBsYWNlKC9cXHQvZycgJ3JlcGxhY2UoXCJcXHRcIidcblxuaW1wb3J0IHsgQ21kSW5zdGFuY2UgfSBmcm9tICcuL0NtZEluc3RhbmNlJztcbmltcG9ydCB7IEJveEhlbHBlciB9IGZyb20gJy4vQm94SGVscGVyJztcblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uZWRDbWRJbnN0YW5jZSBleHRlbmRzIENtZEluc3RhbmNlXG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlLEBwb3MsQHN0cikgLT5cbiAgICBzdXBlcigpXG4gICAgdW5sZXNzIEBpc0VtcHR5KClcbiAgICAgIEBfY2hlY2tDbG9zZXIoKVxuICAgICAgQG9wZW5pbmcgPSBAc3RyXG4gICAgICBAbm9CcmFja2V0ID0gQF9yZW1vdmVCcmFja2V0KEBzdHIpXG4gICAgICBAX3NwbGl0Q29tcG9uZW50cygpXG4gICAgICBAX2ZpbmRDbG9zaW5nKClcbiAgICAgIEBfY2hlY2tFbG9uZ2F0ZWQoKVxuICBfY2hlY2tDbG9zZXI6IC0+XG4gICAgbm9CcmFja2V0ID0gQF9yZW1vdmVCcmFja2V0KEBzdHIpXG4gICAgaWYgbm9CcmFja2V0LnN1YnN0cmluZygwLEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKSA9PSBAY29kZXdhdmUuY2xvc2VDaGFyIGFuZCBmID0gQF9maW5kT3BlbmluZ1BvcygpXG4gICAgICBAY2xvc2luZ1BvcyA9IG5ldyBDb2Rld2F2ZS51dGlsLlN0clBvcyhAcG9zLCBAc3RyKVxuICAgICAgQHBvcyA9IGYucG9zXG4gICAgICBAc3RyID0gZi5zdHJcbiAgX2ZpbmRPcGVuaW5nUG9zOiAtPlxuICAgIGNtZE5hbWUgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cikuc3Vic3RyaW5nKEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKVxuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWVcbiAgICBjbG9zaW5nID0gQHN0clxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zLG9wZW5pbmcsY2xvc2luZywtMSlcbiAgICAgIGYuc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcytmLnN0ci5sZW5ndGgpK0Bjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgICAgIHJldHVybiBmXG4gIF9zcGxpdENvbXBvbmVudHM6IC0+XG4gICAgcGFydHMgPSBAbm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICBAY21kTmFtZSA9IHBhcnRzLnNoaWZ0KClcbiAgICBAcmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIilcbiAgX3BhcnNlUGFyYW1zOihwYXJhbXMpIC0+XG4gICAgQHBhcmFtcyA9IFtdXG4gICAgQG5hbWVkID0gQGdldERlZmF1bHRzKClcbiAgICBpZiBAY21kP1xuICAgICAgbmFtZVRvUGFyYW0gPSBAZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpXG4gICAgICBpZiBuYW1lVG9QYXJhbT8gXG4gICAgICAgIEBuYW1lZFtuYW1lVG9QYXJhbV0gPSBAY21kTmFtZVxuICAgIGlmIHBhcmFtcy5sZW5ndGhcbiAgICAgIGlmIEBjbWQ/XG4gICAgICAgIGFsbG93ZWROYW1lZCA9IEBnZXRPcHRpb24oJ2FsbG93ZWROYW1lZCcpIFxuICAgICAgaW5TdHIgPSBmYWxzZVxuICAgICAgcGFyYW0gPSAnJ1xuICAgICAgbmFtZSA9IGZhbHNlXG4gICAgICBmb3IgaSBpbiBbMC4uKHBhcmFtcy5sZW5ndGgtMSldXG4gICAgICAgIGNociA9IHBhcmFtc1tpXVxuICAgICAgICBpZiBjaHIgPT0gJyAnIGFuZCAhaW5TdHJcbiAgICAgICAgICBpZihuYW1lKVxuICAgICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGFyYW1zLnB1c2gocGFyYW0pXG4gICAgICAgICAgcGFyYW0gPSAnJ1xuICAgICAgICAgIG5hbWUgPSBmYWxzZVxuICAgICAgICBlbHNlIGlmIGNociBpbiBbJ1wiJyxcIidcIl0gYW5kIChpID09IDAgb3IgcGFyYW1zW2ktMV0gIT0gJ1xcXFwnKVxuICAgICAgICAgIGluU3RyID0gIWluU3RyXG4gICAgICAgIGVsc2UgaWYgY2hyID09ICc6JyBhbmQgIW5hbWUgYW5kICFpblN0ciBhbmQgKCFhbGxvd2VkTmFtZWQ/IG9yIG5hbWUgaW4gYWxsb3dlZE5hbWVkKVxuICAgICAgICAgIG5hbWUgPSBwYXJhbVxuICAgICAgICAgIHBhcmFtID0gJydcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBhcmFtICs9IGNoclxuICAgICAgaWYgcGFyYW0ubGVuZ3RoXG4gICAgICAgIGlmKG5hbWUpXG4gICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBwYXJhbXMucHVzaChwYXJhbSlcbiAgX2ZpbmRDbG9zaW5nOiAtPlxuICAgIGlmIGYgPSBAX2ZpbmRDbG9zaW5nUG9zKClcbiAgICAgIEBjb250ZW50ID0gQ29kZXdhdmUudXRpbC50cmltRW1wdHlMaW5lKEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zK0BzdHIubGVuZ3RoLGYucG9zKSlcbiAgICAgIEBzdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyxmLnBvcytmLnN0ci5sZW5ndGgpXG4gIF9maW5kQ2xvc2luZ1BvczogLT5cbiAgICByZXR1cm4gQGNsb3NpbmdQb3MgaWYgQGNsb3NpbmdQb3M/XG4gICAgY2xvc2luZyA9IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjbWROYW1lICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgICBvcGVuaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY21kTmFtZVxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zK0BzdHIubGVuZ3RoLCBvcGVuaW5nLCBjbG9zaW5nKVxuICAgICAgcmV0dXJuIEBjbG9zaW5nUG9zID0gZlxuICBfY2hlY2tFbG9uZ2F0ZWQ6IC0+XG4gICAgZW5kUG9zID0gQGdldEVuZFBvcygpXG4gICAgbWF4ID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0TGVuKClcbiAgICB3aGlsZSBlbmRQb3MgPCBtYXggYW5kIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsZW5kUG9zK0Bjb2Rld2F2ZS5kZWNvLmxlbmd0aCkgPT0gQGNvZGV3YXZlLmRlY29cbiAgICAgIGVuZFBvcys9QGNvZGV3YXZlLmRlY28ubGVuZ3RoXG4gICAgaWYgZW5kUG9zID49IG1heCBvciBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zLCBlbmRQb3MgKyBAY29kZXdhdmUuZGVjby5sZW5ndGgpIGluIFsnICcsXCJcXG5cIixcIlxcclwiXVxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGVuZFBvcylcbiAgX2NoZWNrQm94OiAtPlxuICAgIGlmIEBjb2Rld2F2ZS5pbkluc3RhbmNlPyBhbmQgQGNvZGV3YXZlLmluSW5zdGFuY2UuY21kLm5hbWUgPT0gJ2NvbW1lbnQnXG4gICAgICByZXR1cm5cbiAgICBjbCA9IEBjb250ZXh0LndyYXBDb21tZW50TGVmdCgpXG4gICAgY3IgPSBAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KClcbiAgICBlbmRQb3MgPSBAZ2V0RW5kUG9zKCkgKyBjci5sZW5ndGhcbiAgICBpZiBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoQHBvcyAtIGNsLmxlbmd0aCxAcG9zKSA9PSBjbCBhbmQgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyAtIGNyLmxlbmd0aCxlbmRQb3MpID09IGNyXG4gICAgICBAcG9zID0gQHBvcyAtIGNsLmxlbmd0aFxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGVuZFBvcylcbiAgICAgIEBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50KClcbiAgICBlbHNlIGlmIEBnZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKS5pbmRleE9mKGNsKSA+IC0xIGFuZCBAZ2V0UG9zKCkuc2FtZUxpbmVzU3VmZml4KCkuaW5kZXhPZihjcikgPiAtMVxuICAgICAgQGluQm94ID0gMVxuICAgICAgQF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICBfcmVtb3ZlQ29tbWVudEZyb21Db250ZW50OiAtPlxuICAgIGlmIEBjb250ZW50XG4gICAgICBlY2wgPSBDb2Rld2F2ZS51dGlsLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoKSlcbiAgICAgIGVjciA9IENvZGV3YXZlLnV0aWwuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gQ29kZXdhdmUudXRpbC5lc2NhcGVSZWdFeHAoQGNvZGV3YXZlLmRlY28pXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKiN7ZWNsfSg/OiN7ZWR9KStcXFxccyooLio/KVxcXFxzKig/OiN7ZWR9KSsje2Vjcn0kXCIsIFwiZ21cIikgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgJ1wiZ21cIicgcmUuTVxuICAgICAgcmUyID0gbmV3IFJlZ0V4cChcIl5cXFxccyooPzoje2VkfSkqI3tlY3J9XFxyP1xcblwiKVxuICAgICAgcmUzID0gbmV3IFJlZ0V4cChcIlxcblxcXFxzKiN7ZWNsfSg/OiN7ZWR9KSpcXFxccyokXCIpXG4gICAgICBAY29udGVudCA9IEBjb250ZW50LnJlcGxhY2UocmUxLCckMScpLnJlcGxhY2UocmUyLCcnKS5yZXBsYWNlKHJlMywnJylcbiAgX2dldFBhcmVudENtZHM6IC0+XG4gICAgQHBhcmVudCA9IEBjb2Rld2F2ZS5nZXRFbmNsb3NpbmdDbWQoQGdldEVuZFBvcygpKT8uaW5pdCgpXG4gIHNldE11bHRpUG9zOiAobXVsdGlQb3MpIC0+XG4gICAgQG11bHRpUG9zID0gbXVsdGlQb3NcbiAgX2dldENtZE9iajogLT5cbiAgICBAZ2V0Q21kKClcbiAgICBAX2NoZWNrQm94KClcbiAgICBAY29udGVudCA9IEByZW1vdmVJbmRlbnRGcm9tQ29udGVudChAY29udGVudClcbiAgICBzdXBlcigpXG4gIF9pbml0UGFyYW1zOiAtPlxuICAgIEBfcGFyc2VQYXJhbXMoQHJhd1BhcmFtcylcbiAgZ2V0Q29udGV4dDogLT5cbiAgICByZXR1cm4gQGNvbnRleHQgb3IgQGNvZGV3YXZlLmNvbnRleHRcbiAgZ2V0Q21kOiAtPlxuICAgIHVubGVzcyBAY21kP1xuICAgICAgQF9nZXRQYXJlbnRDbWRzKClcbiAgICAgIGlmIEBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLm5vRXhlY3V0ZUNoYXIubGVuZ3RoKSA9PSBAY29kZXdhdmUubm9FeGVjdXRlQ2hhclxuICAgICAgICBAY21kID0gQ29kZXdhdmUuQ29tbWFuZC5jbWRzLmdldENtZCgnY29yZTpub19leGVjdXRlJylcbiAgICAgICAgQGNvbnRleHQgPSBAY29kZXdhdmUuY29udGV4dFxuICAgICAgZWxzZVxuICAgICAgICBAZmluZGVyID0gQGdldEZpbmRlcihAY21kTmFtZSlcbiAgICAgICAgQGNvbnRleHQgPSBAZmluZGVyLmNvbnRleHRcbiAgICAgICAgQGNtZCA9IEBmaW5kZXIuZmluZCgpXG4gICAgICAgIGlmIEBjbWQ/XG4gICAgICAgICAgQGNvbnRleHQuYWRkTmFtZVNwYWNlKEBjbWQuZnVsbE5hbWUpXG4gICAgcmV0dXJuIEBjbWRcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBjb2Rld2F2ZS5jb250ZXh0LmdldEZpbmRlcihjbWROYW1lLEBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzOiAtPlxuICAgIG5zcGNzID0gW11cbiAgICBvYmogPSB0aGlzXG4gICAgd2hpbGUgb2JqLnBhcmVudD9cbiAgICAgIG9iaiA9IG9iai5wYXJlbnRcbiAgICAgIG5zcGNzLnB1c2gob2JqLmNtZC5mdWxsTmFtZSkgaWYgb2JqLmNtZD8gYW5kIG9iai5jbWQuZnVsbE5hbWU/XG4gICAgcmV0dXJuIG5zcGNzXG4gIF9yZW1vdmVCcmFja2V0OiAoc3RyKS0+XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoLHN0ci5sZW5ndGgtQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKVxuICBhbHRlckFsaWFzT2Y6IChhbGlhc09mKS0+XG4gICAgW25zcGMsIGNtZE5hbWVdID0gQ29kZXdhdmUudXRpbC5zcGxpdE5hbWVzcGFjZShAY21kTmFtZSlcbiAgICByZXR1cm4gYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLGNtZE5hbWUpXG4gIGlzRW1wdHk6IC0+XG4gICAgcmV0dXJuIEBzdHIgPT0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNvZGV3YXZlLmJyYWtldHMgb3IgQHN0ciA9PSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5icmFrZXRzXG4gIGV4ZWN1dGU6IC0+XG4gICAgaWYgQGlzRW1wdHkoKVxuICAgICAgaWYgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcD8gYW5kIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAud2hpdGhpbk9wZW5Cb3VuZHMoQHBvcyArIEBjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aCk/XG4gICAgICAgIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXAuY2FuY2VsKClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlcGxhY2VXaXRoKCcnKVxuICAgIGVsc2UgaWYgQGNtZD9cbiAgICAgIGlmIGJlZm9yZUZ1bmN0ID0gQGdldE9wdGlvbignYmVmb3JlRXhlY3V0ZScpXG4gICAgICAgIGJlZm9yZUZ1bmN0KHRoaXMpXG4gICAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgICBpZiAocmVzID0gQHJlc3VsdCgpKT9cbiAgICAgICAgICBAcmVwbGFjZVdpdGgocmVzKVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIEBydW5FeGVjdXRlRnVuY3QoKVxuICBnZXRFbmRQb3M6IC0+XG4gICAgcmV0dXJuIEBwb3MrQHN0ci5sZW5ndGhcbiAgZ2V0UG9zOiAtPlxuICAgIHJldHVybiBuZXcgQ29kZXdhdmUudXRpbC5Qb3MoQHBvcyxAcG9zK0BzdHIubGVuZ3RoKS53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gIGdldE9wZW5pbmdQb3M6IC0+XG4gICAgcmV0dXJuIG5ldyBDb2Rld2F2ZS51dGlsLlBvcyhAcG9zLEBwb3MrQG9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gIGdldEluZGVudDogLT5cbiAgICB1bmxlc3MgQGluZGVudExlbj9cbiAgICAgIGlmIEBpbkJveD9cbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcihAY29udGV4dClcbiAgICAgICAgQGluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KEBnZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKSkubGVuZ3RoXG4gICAgICBlbHNlXG4gICAgICAgIEBpbmRlbnRMZW4gPSBAcG9zIC0gQGdldFBvcygpLnByZXZFT0woKVxuICAgIHJldHVybiBAaW5kZW50TGVuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50OiAodGV4dCkgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycrQGdldEluZGVudCgpKyd9JywnZ20nKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsJycpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYWx0ZXJSZXN1bHRGb3JCb3g6IChyZXBsKSAtPlxuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KClcbiAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLGZhbHNlKVxuICAgIGlmIEBnZXRPcHRpb24oJ3JlcGxhY2VCb3gnKVxuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbClcbiAgICAgIFtyZXBsLnN0YXJ0LCByZXBsLmVuZF0gPSBbYm94LnN0YXJ0LCBib3guZW5kXVxuICAgICAgQGluZGVudExlbiA9IGhlbHBlci5pbmRlbnRcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKClcbiAgICAgIHJlcGwuZW5kID0gb3JpZ2luYWwubmV4dEVPTCgpXG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIEBjb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyBAY29kZXdhdmUubWFya2VyICsgb3JpZ2luYWwuc2FtZUxpbmVzU3VmZml4KCksIHttdWx0aWxpbmU6ZmFsc2V9KVxuICAgICAgW3JlcGwucHJlZml4LHJlcGwudGV4dCxyZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQoQGNvZGV3YXZlLm1hcmtlcilcbiAgICByZXR1cm4gcmVwbFxuICBnZXRDdXJzb3JGcm9tUmVzdWx0OiAocmVwbCkgLT5cbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpXG4gICAgaWYgQGNtZD8gYW5kIEBjb2Rld2F2ZS5jaGVja0NhcnJldCBhbmQgQGdldE9wdGlvbignY2hlY2tDYXJyZXQnKVxuICAgICAgaWYgKHAgPSBAY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpPyBcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCtyZXBsLnByZWZpeC5sZW5ndGgrcFxuICAgICAgcmVwbC50ZXh0ID0gQGNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpXG4gICAgcmV0dXJuIGN1cnNvclBvc1xuICBjaGVja011bHRpOiAocmVwbCkgLT5cbiAgICBpZiBAbXVsdGlQb3M/IGFuZCBAbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgcmVwbGFjZW1lbnRzID0gW3JlcGxdXG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpXG4gICAgICBmb3IgcG9zLCBpIGluIEBtdWx0aVBvc1xuICAgICAgICBpZiBpID09IDBcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydFxuICAgICAgICBlbHNlXG4gICAgICAgICAgbmV3UmVwbCA9IHJlcGwuY29weSgpLmFwcGx5T2Zmc2V0KHBvcy5zdGFydC1vcmlnaW5hbFBvcylcbiAgICAgICAgICBpZiBuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09IG9yaWdpbmFsVGV4dFxuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbClcbiAgICAgIHJldHVybiByZXBsYWNlbWVudHNcbiAgICBlbHNlXG4gICAgICByZXR1cm4gW3JlcGxdXG4gIHJlcGxhY2VXaXRoOiAodGV4dCkgLT5cbiAgICBAYXBwbHlSZXBsYWNlbWVudChuZXcgQ29kZXdhdmUudXRpbC5SZXBsYWNlbWVudChAcG9zLEBnZXRFbmRQb3MoKSx0ZXh0KSlcbiAgYXBwbHlSZXBsYWNlbWVudDogKHJlcGwpIC0+XG4gICAgcmVwbC53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gICAgaWYgQGluQm94P1xuICAgICAgQGFsdGVyUmVzdWx0Rm9yQm94KHJlcGwpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBjdXJzb3JQb3MgPSBAZ2V0Q3Vyc29yRnJvbVJlc3VsdChyZXBsKVxuICAgIHJlcGwuc2VsZWN0aW9ucyA9IFtuZXcgQ29kZXdhdmUudXRpbC5Qb3MoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXVxuICAgIHJlcGxhY2VtZW50cyA9IEBjaGVja011bHRpKHJlcGwpXG4gICAgQGNvZGV3YXZlLmVkaXRvci5hcHBseVJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpXG4gICAgXG4gICAgQHJlcGxhY2VTdGFydCA9IHJlcGwuc3RhcnRcbiAgICBAcmVwbGFjZUVuZCA9IHJlcGwucmVzRW5kKCkiLCJleHBvcnQgY2xhc3MgUHJvY2Vzc1xuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAjIiwiXG5leHBvcnQgY2xhc3MgU3RvcmFnZVxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgc2F2ZTogKGtleSx2YWwpIC0+XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oQGZ1bGxLZXkoa2V5KSwgSlNPTi5zdHJpbmdpZnkodmFsKSlcbiAgbG9hZDogKGtleSkgLT5cbiAgICBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKEBmdWxsS2V5KGtleSkpKVxuICBmdWxsS2V5OiAoa2V5KSAtPlxuICAgICdDb2RlV2F2ZV8nK2tleSIsImltcG9ydCB7IFRleHRQYXJzZXIgfSBmcm9tICcuL1RleHRQYXJzZXInO1xuXG5leHBvcnQgY2xhc3MgRG9tS2V5TGlzdGVuZXJcbiAgc3RhcnRMaXN0ZW5pbmc6ICh0YXJnZXQpIC0+XG4gIFxuICAgIHRpbWVvdXQgPSBudWxsXG4gICAgXG4gICAgb25rZXlkb3duID0gKGUpID0+IFxuICAgICAgaWYgKENvZGV3YXZlLmluc3RhbmNlcy5sZW5ndGggPCAyIG9yIEBvYmogPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgYW5kIGUua2V5Q29kZSA9PSA2OSAmJiBlLmN0cmxLZXlcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGlmIEBvbkFjdGl2YXRpb25LZXk/XG4gICAgICAgICAgQG9uQWN0aXZhdGlvbktleSgpXG4gICAgb25rZXl1cCA9IChlKSA9PiBcbiAgICAgIGlmIEBvbkFueUNoYW5nZT9cbiAgICAgICAgQG9uQW55Q2hhbmdlKGUpXG4gICAgb25rZXlwcmVzcyA9IChlKSA9PiBcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KSBpZiB0aW1lb3V0P1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQgKD0+XG4gICAgICAgIGlmIEBvbkFueUNoYW5nZT9cbiAgICAgICAgICBAb25BbnlDaGFuZ2UoZSlcbiAgICAgICksIDEwMFxuICAgICAgICAgICAgXG4gICAgaWYgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXJcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9ua2V5ZG93bilcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBvbmtleXVwKVxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIG9ua2V5cHJlc3MpXG4gICAgZWxzZSBpZiB0YXJnZXQuYXR0YWNoRXZlbnRcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlkb3duXCIsIG9ua2V5ZG93bilcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXl1cFwiLCBvbmtleXVwKVxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXByZXNzXCIsIG9ua2V5cHJlc3MpXG5cbmlzRWxlbWVudCA9IChvYmopIC0+XG4gIHRyeVxuICAgICMgVXNpbmcgVzMgRE9NMiAod29ya3MgZm9yIEZGLCBPcGVyYSBhbmQgQ2hyb20pXG4gICAgb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcbiAgY2F0Y2ggZVxuICAgICMgQnJvd3NlcnMgbm90IHN1cHBvcnRpbmcgVzMgRE9NMiBkb24ndCBoYXZlIEhUTUxFbGVtZW50IGFuZFxuICAgICMgYW4gZXhjZXB0aW9uIGlzIHRocm93biBhbmQgd2UgZW5kIHVwIGhlcmUuIFRlc3Rpbmcgc29tZVxuICAgICMgcHJvcGVydGllcyB0aGF0IGFsbCBlbGVtZW50cyBoYXZlLiAod29ya3Mgb24gSUU3KVxuICAgIHJldHVybiAodHlwZW9mIG9iaj09XCJvYmplY3RcIikgJiZcbiAgICAgIChvYmoubm9kZVR5cGU9PTEpICYmICh0eXBlb2Ygb2JqLnN0eWxlID09IFwib2JqZWN0XCIpICYmXG4gICAgICAodHlwZW9mIG9iai5vd25lckRvY3VtZW50ID09XCJvYmplY3RcIilcblxuICAgICAgICBcbmV4cG9ydCBjbGFzcyBUZXh0QXJlYUVkaXRvciBleHRlbmRzIFRleHRQYXJzZXJcbiAgY29uc3RydWN0b3I6IChAdGFyZ2V0KSAtPlxuICAgIHN1cGVyKClcbiAgICAjIENvZGV3YXZlLmxvZ2dlci50b01vbml0b3IodGhpcywndGV4dEV2ZW50Q2hhbmdlJylcbiAgICBAb2JqID0gaWYgaXNFbGVtZW50KEB0YXJnZXQpIHRoZW4gQHRhcmdldCBlbHNlIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEB0YXJnZXQpXG4gICAgdW5sZXNzIEBvYmo/XG4gICAgICB0aHJvdyBcIlRleHRBcmVhIG5vdCBmb3VuZFwiXG4gICAgQG5hbWVzcGFjZSA9ICd0ZXh0YXJlYSdcbiAgICBAY2hhbmdlTGlzdGVuZXJzID0gW11cbiAgICBAX3NraXBDaGFuZ2VFdmVudCA9IDBcbiAgc3RhcnRMaXN0ZW5pbmc6IERvbUtleUxpc3RlbmVyLnByb3RvdHlwZS5zdGFydExpc3RlbmluZ1xuICBvbkFueUNoYW5nZTogKGUpIC0+XG4gICAgaWYgQF9za2lwQ2hhbmdlRXZlbnQgPD0gMFxuICAgICAgZm9yIGNhbGxiYWNrIGluIEBjaGFuZ2VMaXN0ZW5lcnNcbiAgICAgICAgY2FsbGJhY2soKVxuICAgIGVsc2VcbiAgICAgIEBfc2tpcENoYW5nZUV2ZW50LS1cbiAgICAgIEBvblNraXBlZENoYW5nZSgpIGlmIEBvblNraXBlZENoYW5nZT9cbiAgc2tpcENoYW5nZUV2ZW50OiAobmIgPSAxKSAtPlxuICAgIEBfc2tpcENoYW5nZUV2ZW50ICs9IG5iXG4gIGJpbmRlZFRvOiAoY29kZXdhdmUpIC0+XG4gICAgQG9uQWN0aXZhdGlvbktleSA9IC0+IGNvZGV3YXZlLm9uQWN0aXZhdGlvbktleSgpXG4gICAgQHN0YXJ0TGlzdGVuaW5nKGRvY3VtZW50KVxuICBzZWxlY3Rpb25Qcm9wRXhpc3RzOiAtPlxuICAgIFwic2VsZWN0aW9uU3RhcnRcIiBvZiBAb2JqXG4gIGhhc0ZvY3VzOiAtPiBcbiAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGlzIEBvYmpcbiAgdGV4dDogKHZhbCkgLT5cbiAgICBpZiB2YWw/XG4gICAgICB1bmxlc3MgQHRleHRFdmVudENoYW5nZSh2YWwpXG4gICAgICAgIEBvYmoudmFsdWUgPSB2YWxcbiAgICBAb2JqLnZhbHVlXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIEB0ZXh0RXZlbnRDaGFuZ2UodGV4dCwgc3RhcnQsIGVuZCkgb3Igc3VwZXIoc3RhcnQsIGVuZCwgdGV4dClcbiAgdGV4dEV2ZW50Q2hhbmdlOiAodGV4dCwgc3RhcnQgPSAwLCBlbmQgPSBudWxsKSAtPlxuICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RleHRFdmVudCcpIGlmIGRvY3VtZW50LmNyZWF0ZUV2ZW50P1xuICAgIGlmIGV2ZW50PyBhbmQgZXZlbnQuaW5pdFRleHRFdmVudD9cbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIGlmIHRleHQubGVuZ3RoIDwgMVxuICAgICAgICBpZiBzdGFydCAhPSAwXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKHN0YXJ0LTEsc3RhcnQpXG4gICAgICAgICAgc3RhcnQtLVxuICAgICAgICBlbHNlIGlmIGVuZCAhPSBAdGV4dExlbigpXG4gICAgICAgICAgdGV4dCA9IEB0ZXh0U3Vic3RyKGVuZCxlbmQrMSlcbiAgICAgICAgICBlbmQrK1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICBldmVudC5pbml0VGV4dEV2ZW50KCd0ZXh0SW5wdXQnLCB0cnVlLCB0cnVlLCBudWxsLCB0ZXh0LCA5KVxuICAgICAgIyBAc2V0Q3Vyc29yUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIEBvYmouZGlzcGF0Y2hFdmVudChldmVudClcbiAgICAgIEBza2lwQ2hhbmdlRXZlbnQoKVxuICAgICAgdHJ1ZVxuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgcmV0dXJuIEB0bXBDdXJzb3JQb3MgaWYgQHRtcEN1cnNvclBvcz9cbiAgICBpZiBAaGFzRm9jdXNcbiAgICAgIGlmIEBzZWxlY3Rpb25Qcm9wRXhpc3RzXG4gICAgICAgIG5ldyBDb2Rld2F2ZS51dGlsLlBvcyhAb2JqLnNlbGVjdGlvblN0YXJ0LEBvYmouc2VsZWN0aW9uRW5kKVxuICAgICAgZWxzZVxuICAgICAgICBAZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKVxuICBnZXRDdXJzb3JQb3NGYWxsYmFjazogLT5cbiAgICBpZiBAb2JqLmNyZWF0ZVRleHRSYW5nZVxuICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKClcbiAgICAgIGlmIHNlbC5wYXJlbnRFbGVtZW50KCkgaXMgQG9ialxuICAgICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayBzZWwuZ2V0Qm9va21hcmsoKVxuICAgICAgICBsZW4gPSAwXG5cbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgbGVuKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcm5nLnNldEVuZFBvaW50IFwiU3RhcnRUb1N0YXJ0XCIsIEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcG9zID0gbmV3IENvZGV3YXZlLnV0aWwuUG9zKDAsbGVuKVxuICAgICAgICB3aGlsZSBybmcuY29tcGFyZUVuZFBvaW50cyhcIkVuZFRvU3RhcnRcIiwgcm5nKSA+IDBcbiAgICAgICAgICBwb3Muc3RhcnQrK1xuICAgICAgICAgIHBvcy5lbmQrK1xuICAgICAgICAgIHJuZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIC0xKVxuICAgICAgICByZXR1cm4gcG9zXG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgQHRtcEN1cnNvclBvcyA9IG5ldyBDb2Rld2F2ZS51dGlsLlBvcyhzdGFydCxlbmQpXG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBzZXRUaW1lb3V0ICg9PlxuICAgICAgICBAdG1wQ3Vyc29yUG9zID0gbnVsbFxuICAgICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgICksIDFcbiAgICBlbHNlIFxuICAgICAgQHNldEN1cnNvclBvc0ZhbGxiYWNrKHN0YXJ0LCBlbmQpXG4gICAgcmV0dXJuXG4gIHNldEN1cnNvclBvc0ZhbGxiYWNrOiAoc3RhcnQsIGVuZCkgLT5cbiAgICBpZiBAb2JqLmNyZWF0ZVRleHRSYW5nZVxuICAgICAgcm5nID0gQG9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgcm5nLm1vdmVTdGFydCBcImNoYXJhY3RlclwiLCBzdGFydFxuICAgICAgcm5nLmNvbGxhcHNlKClcbiAgICAgIHJuZy5tb3ZlRW5kIFwiY2hhcmFjdGVyXCIsIGVuZCAtIHN0YXJ0XG4gICAgICBybmcuc2VsZWN0KClcbiAgZ2V0TGFuZzogLT5cbiAgICByZXR1cm4gQF9sYW5nIGlmIEBfbGFuZ1xuICAgIEBvYmouZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKSBpZiBAb2JqLmhhc0F0dHJpYnV0ZSgnZGF0YS1sYW5nJylcbiAgc2V0TGFuZzogKHZhbCkgLT5cbiAgICBAX2xhbmcgPSB2YWxcbiAgICBAb2JqLnNldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJyx2YWwpXG4gIGNhbkxpc3RlblRvQ2hhbmdlOiAtPlxuICAgIHJldHVybiB0cnVlXG4gIGFkZENoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgQGNoYW5nZUxpc3RlbmVycy5wdXNoKGNhbGxiYWNrKVxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIGlmIChpID0gQGNoYW5nZUxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKSkgPiAtMVxuICAgICAgQGNoYW5nZUxpc3RlbmVycy5zcGxpY2UoaSwgMSlcbiAgICAgIFxuICAgICAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzOiAocmVwbGFjZW1lbnRzKSAtPlxuICAgIGlmIHJlcGxhY2VtZW50cy5sZW5ndGggPiAwIGFuZCByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucy5sZW5ndGggPCAxXG4gICAgICByZXBsYWNlbWVudHNbMF0uc2VsZWN0aW9ucyA9IFtAZ2V0Q3Vyc29yUG9zKCldXG4gICAgc3VwZXIocmVwbGFjZW1lbnRzKTtcbiAgICAgICIsIiMgW3Bhd2EgcHl0aG9uXVxuIyAgIHJlcGxhY2UgKEVkaXRvcikgKGVkaXRvci5FZGl0b3IpXG4jICAgcmVwbGFjZSBAdGV4dCgpICBzZWxmLnRleHRcblxuaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSAnLi9FZGl0b3InO1xuXG5leHBvcnQgY2xhc3MgVGV4dFBhcnNlciBleHRlbmRzIEVkaXRvclxuICBjb25zdHJ1Y3RvcjogKEBfdGV4dCkgLT5cbiAgICBzdXBlcigpXG4gICAgc2VsZi5uYW1lc3BhY2UgPSAndGV4dF9wYXJzZXInXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgQF90ZXh0ID0gdmFsIGlmIHZhbD9cbiAgICBAX3RleHRcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICByZXR1cm4gQHRleHQoKVtwb3NdXG4gIHRleHRMZW46IChwb3MpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KCkubGVuZ3RoXG4gIHRleHRTdWJzdHI6IChzdGFydCwgZW5kKSAtPlxuICAgIHJldHVybiBAdGV4dCgpLnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICBpbnNlcnRUZXh0QXQ6ICh0ZXh0LCBwb3MpIC0+XG4gICAgQHRleHQoQHRleHQoKS5zdWJzdHJpbmcoMCwgcG9zKSt0ZXh0K0B0ZXh0KCkuc3Vic3RyaW5nKHBvcyxAdGV4dCgpLmxlbmd0aCkpXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIEB0ZXh0KEB0ZXh0KCkuc2xpY2UoMCwgc3RhcnQpICsgKHRleHQgfHwgXCJcIikgKyBAdGV4dCgpLnNsaWNlKGVuZCkpXG4gIGdldEN1cnNvclBvczogLT5cbiAgICByZXR1cm4gQHRhcmdldFxuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kKSAtPlxuICAgIGVuZCA9IHN0YXJ0IGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgQHRhcmdldCA9IChcbiAgICAgICAgc3RhcnQ6IHN0YXJ0XG4gICAgICAgIGVuZDogZW5kXG4gICAgICApIiwiaW1wb3J0IHsgQ29kZXdhdmUgfSBmcm9tICcuL0NvZGV3YXZlJztcbmltcG9ydCB7IFRleHRBcmVhRWRpdG9yIH0gZnJvbSAnLi9UZXh0QXJlYUVkaXRvcic7XG5cbkNvZGV3YXZlLmluc3RhbmNlcyA9IFtdXG5Db2Rld2F2ZS5kZXRlY3QgPSAodGFyZ2V0KSAtPlxuICBjdyA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dEFyZWFFZGl0b3IodGFyZ2V0KSlcbiAgQ29kZXdhdmUuaW5zdGFuY2VzLnB1c2goY3cpXG4gIGN3XG5cbndpbmRvdy5Db2Rld2F2ZSA9IENvZGV3YXZlXG4gICJdfQ==
