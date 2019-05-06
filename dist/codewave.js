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

},{"./Codewave":4,"./Context":6,"./TextParser":12}],4:[function(require,module,exports){
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
    }

    _createClass(Codewave, [{
      key: "onActivationKey",
      value: function onActivationKey() {
        this.process = new _Process.Process();
        Codewave.logger.log('activation key');
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
            Codewave.logger.log(cmd);
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

},{"./Command":5,"./Context":6,"./PositionedCmdInstance":8,"./Process":9,"./TextParser":12}],5:[function(require,module,exports){
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
        ref = Codewave.Command.cmdInitialisers;
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

},{"./Context":6,"./Storage":10}],6:[function(require,module,exports){
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

},{"./BoxHelper":1,"./CmdInstance":3}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextAreaEditor = exports.DomKeyListener = void 0;

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
  }(TextParser);

  ;
  TextAreaEditor.prototype.startListening = DomKeyListener.prototype.startListening;
  return TextAreaEditor;
}.call(void 0);

exports.TextAreaEditor = TextAreaEditor;

},{}],12:[function(require,module,exports){
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

},{"./Editor":7}],13:[function(require,module,exports){
"use strict";

var _Codewave = require("./Codewave");

var _TextAreaEditor = require("./TextAreaEditor");

_Codewave.Codewave.instances = [];

_Codewave.Codewave.detect = function (target) {
  var cw;
  cw = new _Codewave.Codewave(new _Codewave.Codewave.TextAreaEditor(target));

  _Codewave.Codewave.instances.push(cw);

  return cw;
};

},{"./Codewave":4,"./TextAreaEditor":11}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmNvZmZlZSIsImxpYi9DbWRGaW5kZXIuY29mZmVlIiwibGliL0NtZEluc3RhbmNlLmNvZmZlZSIsImxpYi9Db2Rld2F2ZS5jb2ZmZWUiLCJsaWIvQ29tbWFuZC5jb2ZmZWUiLCJsaWIvQ29udGV4dC5jb2ZmZWUiLCJsaWIvRWRpdG9yLmNvZmZlZSIsImxpYi9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UuY29mZmVlIiwibGliL1Byb2Nlc3MuY29mZmVlIiwibGliL1N0b3JhZ2UuY29mZmVlIiwibGliL1RleHRBcmVhRWRpdG9yLmNvZmZlZSIsImxpYi9UZXh0UGFyc2VyLmNvZmZlZSIsImxpYi9lbnRyeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0FDQUE7O0FBR0EsSUFBYSxTQUFOO0FBQUE7QUFBQTtBQUNMLHFCQUFhLE9BQWIsRUFBYTtBQUFBLFFBQVcsT0FBWCx1RUFBQSxFQUFBOztBQUFBOztBQUNYLFFBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBO0FBRFksU0FBQyxPQUFELEdBQUMsT0FBRDtBQUNaLFNBQUEsUUFBQSxHQUFZO0FBQ1YsTUFBQSxJQUFBLEVBQU0sS0FBQyxPQUFELENBQVMsUUFBVCxDQURJLElBQUE7QUFFVixNQUFBLEdBQUEsRUFGVSxDQUFBO0FBR1YsTUFBQSxLQUFBLEVBSFUsRUFBQTtBQUlWLE1BQUEsTUFBQSxFQUpVLENBQUE7QUFLVixNQUFBLFFBQUEsRUFMVSxFQUFBO0FBTVYsTUFBQSxTQUFBLEVBTlUsRUFBQTtBQU9WLE1BQUEsTUFBQSxFQVBVLEVBQUE7QUFRVixNQUFBLE1BQUEsRUFSVSxFQUFBO0FBU1YsTUFBQSxNQUFBLEVBQVE7QUFURSxLQUFaO0FBV0EsSUFBQSxHQUFBLEdBQUEsS0FBQSxRQUFBOztBQUFBLFNBQUEsR0FBQSxJQUFBLEdBQUEsRUFBQTs7O0FBQ0UsVUFB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bGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIiMgW3Bhd2FdXG4jICAgcmVwbGFjZSAncmVwbGFjZSgvXFxyL2cnIFwicmVwbGFjZSgnXFxyJ1wiXG5cbmV4cG9ydCBjbGFzcyBCb3hIZWxwZXJcbiAgY29uc3RydWN0b3I6IChAY29udGV4dCwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIEBkZWZhdWx0cyA9IHtcbiAgICAgIGRlY286IEBjb250ZXh0LmNvZGV3YXZlLmRlY29cbiAgICAgIHBhZDogMlxuICAgICAgd2lkdGg6IDUwXG4gICAgICBoZWlnaHQ6IDNcbiAgICAgIG9wZW5UZXh0OiAnJ1xuICAgICAgY2xvc2VUZXh0OiAnJ1xuICAgICAgcHJlZml4OiAnJ1xuICAgICAgc3VmZml4OiAnJ1xuICAgICAgaW5kZW50OiAwXG4gICAgfVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgY2xvbmU6ICh0ZXh0KSAtPlxuICAgIG9wdCA9IHt9XG4gICAgZm9yIGtleSwgdmFsIG9mIEBkZWZhdWx0c1xuICAgICAgb3B0W2tleV0gPSB0aGlzW2tleV1cbiAgICByZXR1cm4gbmV3IEJveEhlbHBlcihAY29udGV4dCxvcHQpXG4gIGRyYXc6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAc3RhcnRTZXAoKSArIFwiXFxuXCIgKyBAbGluZXModGV4dCkgKyBcIlxcblwiKyBAZW5kU2VwKClcbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgcmV0dXJuIEBjb250ZXh0LndyYXBDb21tZW50KHN0cilcbiAgc2VwYXJhdG9yOiAtPlxuICAgIGxlbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGRlY29MaW5lKGxlbikpXG4gIHN0YXJ0U2VwOiAtPlxuICAgIGxuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoIC0gQG9wZW5UZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAcHJlZml4ICsgQHdyYXBDb21tZW50KEBvcGVuVGV4dCtAZGVjb0xpbmUobG4pKVxuICBlbmRTZXA6IC0+XG4gICAgbG4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGggLSBAY2xvc2VUZXh0Lmxlbmd0aFxuICAgIHJldHVybiBAd3JhcENvbW1lbnQoQGNsb3NlVGV4dCtAZGVjb0xpbmUobG4pKSArIEBzdWZmaXhcbiAgZGVjb0xpbmU6IChsZW4pIC0+XG4gICAgcmV0dXJuIENvZGV3YXZlLnV0aWwucmVwZWF0VG9MZW5ndGgoQGRlY28sIGxlbilcbiAgcGFkZGluZzogLT4gXG4gICAgcmV0dXJuIENvZGV3YXZlLnV0aWwucmVwZWF0VG9MZW5ndGgoXCIgXCIsIEBwYWQpXG4gIGxpbmVzOiAodGV4dCA9ICcnLCB1cHRvSGVpZ2h0PXRydWUpIC0+XG4gICAgdGV4dCA9IHRleHQgb3IgJydcbiAgICBsaW5lcyA9IHRleHQucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdChcIlxcblwiKVxuICAgIGlmIHVwdG9IZWlnaHRcbiAgICAgIHJldHVybiAoQGxpbmUobGluZXNbeF0gb3IgJycpIGZvciB4IGluIFswLi5AaGVpZ2h0XSkuam9pbignXFxuJykgXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIChAbGluZShsKSBmb3IgbCBpbiBsaW5lcykuam9pbignXFxuJykgXG4gIGxpbmU6ICh0ZXh0ID0gJycpIC0+XG4gICAgcmV0dXJuIChDb2Rld2F2ZS51dGlsLnJlcGVhdFRvTGVuZ3RoKFwiIFwiLEBpbmRlbnQpICtcbiAgICAgIEB3cmFwQ29tbWVudChcbiAgICAgICAgQGRlY28gK1xuICAgICAgICBAcGFkZGluZygpICtcbiAgICAgICAgdGV4dCArXG4gICAgICAgIENvZGV3YXZlLnV0aWwucmVwZWF0VG9MZW5ndGgoXCIgXCIsIEB3aWR0aCAtIEByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KS5sZW5ndGgpICsgXG4gICAgICAgIEBwYWRkaW5nKCkgK1xuICAgICAgICBAZGVjb1xuICAgICAgKSlcbiAgbGVmdDogLT5cbiAgICBAY29udGV4dC53cmFwQ29tbWVudExlZnQoQGRlY28gKyBAcGFkZGluZygpKVxuICByaWdodDogLT5cbiAgICBAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KEBwYWRkaW5nKCkgKyBAZGVjbylcbiAgcmVtb3ZlSWdub3JlZENvbnRlbnQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKEBjb250ZXh0LmNvZGV3YXZlLnJlbW92ZUNhcnJldCh0ZXh0KSlcbiAgdGV4dEJvdW5kczogKHRleHQpIC0+XG4gICAgcmV0dXJuIENvZGV3YXZlLnV0aWwuZ2V0VHh0U2l6ZShAcmVtb3ZlSWdub3JlZENvbnRlbnQodGV4dCkpXG4gIGdldEJveEZvclBvczogKHBvcykgLT5cbiAgICBkZXB0aCA9IEBnZXROZXN0ZWRMdmwocG9zLnN0YXJ0KVxuICAgIGlmIGRlcHRoID4gMFxuICAgICAgbGVmdCA9IEBsZWZ0KClcbiAgICAgIGN1ckxlZnQgPSBDb2Rld2F2ZS51dGlsLnJlcGVhdChsZWZ0LGRlcHRoLTEpXG4gICAgICBcbiAgICAgIGNsb25lID0gQGNsb25lKClcbiAgICAgIHBsYWNlaG9sZGVyID0gXCIjIyNQbGFjZUhvbGRlciMjI1wiXG4gICAgICBjbG9uZS53aWR0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aFxuICAgICAgY2xvbmUub3BlblRleHQgPSBjbG9uZS5jbG9zZVRleHQgPSBAZGVjbyArIEBkZWNvICsgcGxhY2Vob2xkZXIgKyBAZGVjbyArIEBkZWNvXG4gICAgICBcbiAgICAgIHN0YXJ0RmluZCA9IFJlZ0V4cChDb2Rld2F2ZS51dGlsLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuc3RhcnRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwnLionKSlcbiAgICAgIGVuZEZpbmQgPSBSZWdFeHAoQ29kZXdhdmUudXRpbC5lc2NhcGVSZWdFeHAoY3VyTGVmdCArIGNsb25lLmVuZFNlcCgpKS5yZXBsYWNlKHBsYWNlaG9sZGVyLCcuKicpKVxuICAgICAgXG4gICAgICBwYWlyID0gbmV3IENvZGV3YXZlLnV0aWwuUGFpcihzdGFydEZpbmQsZW5kRmluZCx7XG4gICAgICAgIHZhbGlkTWF0Y2g6IChtYXRjaCk9PlxuICAgICAgICAgICMgY29uc29sZS5sb2cobWF0Y2gsbGVmdClcbiAgICAgICAgICBmID0gQGNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQobWF0Y2guc3RhcnQoKSAsW2xlZnQsXCJcXG5cIixcIlxcclwiXSwtMSlcbiAgICAgICAgICByZXR1cm4gIWY/IG9yIGYuc3RyICE9IGxlZnRcbiAgICAgIH0pXG4gICAgICByZXMgPSBwYWlyLndyYXBwZXJQb3MocG9zLEBjb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG4gICAgICBpZiByZXM/XG4gICAgICAgIHJlcy5zdGFydCArPSBjdXJMZWZ0Lmxlbmd0aFxuICAgICAgICByZXR1cm4gcmVzXG4gICAgXG4gIGdldE5lc3RlZEx2bDogKGluZGV4KSAtPlxuICAgIGRlcHRoID0gMFxuICAgIGxlZnQgPSBAbGVmdCgpXG4gICAgd2hpbGUgKGYgPSBAY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCAsW2xlZnQsXCJcXG5cIixcIlxcclwiXSwtMSkpPyAmJiBmLnN0ciA9PSBsZWZ0XG4gICAgICBpbmRleCA9IGYucG9zXG4gICAgICBkZXB0aCsrXG4gICAgcmV0dXJuIGRlcHRoXG4gIGdldE9wdEZyb21MaW5lOiAobGluZSxnZXRQYWQ9dHJ1ZSkgLT5cbiAgICByU3RhcnQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIrQ29kZXdhdmUudXRpbC5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KEBkZWNvKSkrXCIpKFxcXFxzKilcIilcbiAgICByRW5kID0gbmV3IFJlZ0V4cChcIihcXFxccyopKFwiK0NvZGV3YXZlLnV0aWwuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoQGRlY28pKStcIikoXFxufCQpXCIpXG4gICAgcmVzU3RhcnQgPSByU3RhcnQuZXhlYyhsaW5lKVxuICAgIHJlc0VuZCA9IHJFbmQuZXhlYyhsaW5lKVxuICAgIGlmIHJlc1N0YXJ0PyBhbmQgcmVzRW5kP1xuICAgICAgaWYgZ2V0UGFkXG4gICAgICAgIEBwYWQgPSBNYXRoLm1pbihyZXNTdGFydFszXS5sZW5ndGgscmVzRW5kWzFdLmxlbmd0aClcbiAgICAgIEBpbmRlbnQgPSByZXNTdGFydFsxXS5sZW5ndGhcbiAgICAgIHN0YXJ0UG9zID0gcmVzU3RhcnQuaW5kZXggKyByZXNTdGFydFsxXS5sZW5ndGggKyByZXNTdGFydFsyXS5sZW5ndGggKyBAcGFkICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICdyZXNTdGFydC5pbmRleCArIHJlc1N0YXJ0WzFdLmxlbmd0aCArIHJlc1N0YXJ0WzJdLmxlbmd0aCcgcmVzU3RhcnQuZW5kKDIpXG4gICAgICBlbmRQb3MgPSByZXNFbmQuaW5kZXggKyByZXNFbmRbMV0ubGVuZ3RoIC0gQHBhZCAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAncmVzRW5kLmluZGV4ICsgcmVzRW5kWzFdLmxlbmd0aCcgcmVzRW5kLnN0YXJ0KDIpXG4gICAgICBAd2lkdGggPSBlbmRQb3MgLSBzdGFydFBvc1xuICAgIHJldHVybiB0aGlzXG4gIHJlZm9ybWF0TGluZXM6ICh0ZXh0LG9wdGlvbnM9e30pIC0+XG4gICAgcmV0dXJuIEBsaW5lcyhAcmVtb3ZlQ29tbWVudCh0ZXh0LG9wdGlvbnMpLGZhbHNlKVxuICByZW1vdmVDb21tZW50OiAodGV4dCxvcHRpb25zPXt9KS0+XG4gICAgaWYgdGV4dD9cbiAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgIH1cbiAgICAgIG9wdCA9IENvZGV3YXZlLnV0aWwubWVyZ2UoZGVmYXVsdHMsb3B0aW9ucylcbiAgICAgIGVjbCA9IENvZGV3YXZlLnV0aWwuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdCgpKVxuICAgICAgZWNyID0gQ29kZXdhdmUudXRpbC5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKVxuICAgICAgZWQgPSBDb2Rld2F2ZS51dGlsLmVzY2FwZVJlZ0V4cChAZGVjbylcbiAgICAgIGZsYWcgPSBpZiBvcHRpb25zWydtdWx0aWxpbmUnXSB0aGVuICdnbScgZWxzZSAnJyAgICAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBcIidnbSdcIiByZS5NXG4gICAgICByZTEgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKiN7ZWNsfSg/OiN7ZWR9KSpcXFxcc3swLCN7QHBhZH19XCIsIGZsYWcpICAgICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICN7QHBhZH0gJ1wiK3N0cihzZWxmLnBhZCkrXCInXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXFxcXHMqKD86I3tlZH0pKiN7ZWNyfVxcXFxzKiRcIiwgZmxhZylcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmUxLCcnKS5yZXBsYWNlKHJlMiwnJylcbiAgIFxuICAiLCIjIFtwYXdhXVxuIyAgIHJlcGxhY2UgQ29kZXdhdmUuQ21kRmluZGVyIENtZEZpbmRlclxuXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcblxuZXhwb3J0IGNsYXNzIENtZEZpbmRlclxuICBjb25zdHJ1Y3RvcjogKG5hbWVzLCBvcHRpb25zKSAtPlxuICAgICMgQ29kZXdhdmUubG9nZ2VyLnRvTW9uaXRvcih0aGlzLCdmaW5kSW4nKVxuICAgICMgQ29kZXdhdmUubG9nZ2VyLnRvTW9uaXRvcih0aGlzLCd0cmlnZ2VyRGV0ZWN0b3JzJylcbiAgICBpZiB0eXBlb2YgbmFtZXMgPT0gJ3N0cmluZydcbiAgICAgIG5hbWVzID0gW25hbWVzXVxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgcGFyZW50OiBudWxsXG4gICAgICBuYW1lc3BhY2VzOiBbXVxuICAgICAgcGFyZW50Q29udGV4dDogbnVsbFxuICAgICAgY29udGV4dDogbnVsbFxuICAgICAgcm9vdDogQ29kZXdhdmUuQ29tbWFuZC5jbWRzXG4gICAgICBtdXN0RXhlY3V0ZTogdHJ1ZVxuICAgICAgdXNlRGV0ZWN0b3JzOiB0cnVlXG4gICAgICB1c2VGYWxsYmFja3M6IHRydWVcbiAgICAgIGluc3RhbmNlOiBudWxsXG4gICAgICBjb2Rld2F2ZTogbnVsbFxuICAgIH1cbiAgICBAbmFtZXMgPSBuYW1lc1xuICAgIEBwYXJlbnQgPSBvcHRpb25zWydwYXJlbnQnXVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICBlbHNlIGlmIEBwYXJlbnQ/IGFuZCBrZXkgIT0gJ3BhcmVudCdcbiAgICAgICAgdGhpc1trZXldID0gQHBhcmVudFtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoQGNvZGV3YXZlKVxuICAgIGlmIEBwYXJlbnRDb250ZXh0P1xuICAgICAgQGNvbnRleHQucGFyZW50ID0gQHBhcmVudENvbnRleHRcbiAgICBpZiBAbmFtZXNwYWNlcz9cbiAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMoQG5hbWVzcGFjZXMpXG4gIGZpbmQ6IC0+XG4gICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuICAgIEBjbWQgPSBAZmluZEluKEByb290KVxuICAgIHJldHVybiBAY21kXG4jICBnZXRQb3NpYmlsaXRpZXM6IC0+XG4jICAgIEB0cmlnZ2VyRGV0ZWN0b3JzKClcbiMgICAgcGF0aCA9IGxpc3QoQHBhdGgpXG4jICAgIHJldHVybiBAZmluZFBvc2liaWxpdGllc0luKEByb290LHBhdGgpXG4gIGdldE5hbWVzV2l0aFBhdGhzOiAtPlxuICAgIHBhdGhzID0ge31cbiAgICBmb3IgbmFtZSBpbiBAbmFtZXMgXG4gICAgICBbc3BhY2UscmVzdF0gPSBDb2Rld2F2ZS51dGlsLnNwbGl0Rmlyc3ROYW1lc3BhY2UobmFtZSlcbiAgICAgIGlmIHNwYWNlPyBhbmQgIShzcGFjZSBpbiBAY29udGV4dC5nZXROYW1lU3BhY2VzKCkpXG4gICAgICAgIHVubGVzcyBzcGFjZSBvZiBwYXRocyBcbiAgICAgICAgICBwYXRoc1tzcGFjZV0gPSBbXVxuICAgICAgICBwYXRoc1tzcGFjZV0ucHVzaChyZXN0KVxuICAgIHJldHVybiBwYXRoc1xuICBhcHBseVNwYWNlT25OYW1lczogKG5hbWVzcGFjZSkgLT5cbiAgICBbc3BhY2UscmVzdF0gPSBDb2Rld2F2ZS51dGlsLnNwbGl0Rmlyc3ROYW1lc3BhY2UobmFtZXNwYWNlLHRydWUpXG4gICAgQG5hbWVzLm1hcCggKG5hbWUpIC0+XG4gICAgICBbY3VyX3NwYWNlLGN1cl9yZXN0XSA9IENvZGV3YXZlLnV0aWwuc3BsaXRGaXJzdE5hbWVzcGFjZShuYW1lKVxuICAgICAgaWYgY3VyX3NwYWNlPyBhbmQgY3VyX3NwYWNlID09IHNwYWNlXG4gICAgICAgIG5hbWUgPSBjdXJfcmVzdFxuICAgICAgaWYgcmVzdD9cbiAgICAgICAgbmFtZSA9IHJlc3QgKyAnOicgKyBuYW1lXG4gICAgICByZXR1cm4gbmFtZVxuICAgIClcbiAgZ2V0RGlyZWN0TmFtZXM6IC0+XG4gICAgcmV0dXJuIChuIGZvciBuIGluIEBuYW1lcyB3aGVuIG4uaW5kZXhPZihcIjpcIikgPT0gLTEpXG4gIHRyaWdnZXJEZXRlY3RvcnM6IC0+XG4gICAgaWYgQHVzZURldGVjdG9ycyBcbiAgICAgIEB1c2VEZXRlY3RvcnMgPSBmYWxzZVxuICAgICAgcG9zaWJpbGl0aWVzID0gbmV3IENtZEZpbmRlcihAY29udGV4dC5nZXROYW1lU3BhY2VzKCksIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKVxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBwb3NpYmlsaXRpZXMubGVuZ3RoXG4gICAgICAgIGNtZCA9IHBvc2liaWxpdGllc1tpXVxuICAgICAgICBmb3IgZGV0ZWN0b3IgaW4gY21kLmRldGVjdG9ycyBcbiAgICAgICAgICByZXMgPSBkZXRlY3Rvci5kZXRlY3QodGhpcylcbiAgICAgICAgICBpZiByZXM/XG4gICAgICAgICAgICBAY29udGV4dC5hZGROYW1lc3BhY2VzKHJlcylcbiAgICAgICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihyZXMsIHtwYXJlbnQ6IHRoaXMsIG11c3RFeGVjdXRlOiBmYWxzZSwgdXNlRmFsbGJhY2tzOiBmYWxzZX0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICAgICAgaSsrXG4gIGZpbmRJbjogKGNtZCxwYXRoID0gbnVsbCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIG51bGxcbiAgICBiZXN0ID0gQGJlc3RJblBvc2liaWxpdGllcyhAZmluZFBvc2liaWxpdGllcygpKVxuICAgIGlmIGJlc3Q/XG4gICAgICByZXR1cm4gYmVzdFxuICBmaW5kUG9zaWJpbGl0aWVzOiAtPlxuICAgIHVubGVzcyBAcm9vdD9cbiAgICAgIHJldHVybiBbXVxuICAgIEByb290LmluaXQoKVxuICAgIHBvc2liaWxpdGllcyA9IFtdXG4gICAgZm9yIHNwYWNlLCBuYW1lcyBvZiBAZ2V0TmFtZXNXaXRoUGF0aHMoKVxuICAgICAgbmV4dHMgPSBAZ2V0Q21kRm9sbG93QWxpYXMoc3BhY2UpXG4gICAgICBmb3IgbmV4dCBpbiBuZXh0c1xuICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIobmFtZXMsIHtwYXJlbnQ6IHRoaXMsIHJvb3Q6IG5leHR9KS5maW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgZm9yIG5zcGMgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpXG4gICAgICBbbnNwY05hbWUscmVzdF0gPSBDb2Rld2F2ZS51dGlsLnNwbGl0Rmlyc3ROYW1lc3BhY2UobnNwYyx0cnVlKVxuICAgICAgbmV4dHMgPSBAZ2V0Q21kRm9sbG93QWxpYXMobnNwY05hbWUpXG4gICAgICBmb3IgbmV4dCBpbiBuZXh0c1xuICAgICAgICBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXMuY29uY2F0KG5ldyBDbWRGaW5kZXIoQGFwcGx5U3BhY2VPbk5hbWVzKG5zcGMpLCB7cGFyZW50OiB0aGlzLCByb290OiBuZXh0fSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgIGZvciBuYW1lIGluIEBnZXREaXJlY3ROYW1lcygpXG4gICAgICBkaXJlY3QgPSBAcm9vdC5nZXRDbWQobmFtZSlcbiAgICAgIGlmIEBjbWRJc1ZhbGlkKGRpcmVjdClcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZGlyZWN0KVxuICAgIGlmIEB1c2VGYWxsYmFja3NcbiAgICAgIGZhbGxiYWNrID0gQHJvb3QuZ2V0Q21kKCdmYWxsYmFjaycpXG4gICAgICBpZiBAY21kSXNWYWxpZChmYWxsYmFjaylcbiAgICAgICAgcG9zaWJpbGl0aWVzLnB1c2goZmFsbGJhY2spXG4gICAgQHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllc1xuICAgIHJldHVybiBwb3NpYmlsaXRpZXNcbiAgZ2V0Q21kRm9sbG93QWxpYXM6IChuYW1lKSAtPlxuICAgIGNtZCA9IEByb290LmdldENtZChuYW1lKVxuICAgIGlmIGNtZD8gXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuYWxpYXNPZj9cbiAgICAgICAgcmV0dXJuIFtjbWQsY21kLmdldEFsaWFzZWQoKV1cbiAgICAgIHJldHVybiBbY21kXVxuICAgIHJldHVybiBbY21kXVxuICBjbWRJc1ZhbGlkOiAoY21kKSAtPlxuICAgIHVubGVzcyBjbWQ/XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBpZiBjbWQubmFtZSAhPSAnZmFsbGJhY2snICYmIGNtZCBpbiBAYW5jZXN0b3JzKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiAhQG11c3RFeGVjdXRlIG9yIEBjbWRJc0V4ZWN1dGFibGUoY21kKVxuICBhbmNlc3RvcnM6IC0+XG4gICAgaWYgQGNvZGV3YXZlPy5pbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBjb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKVxuICAgIHJldHVybiBbXVxuICBjbWRJc0V4ZWN1dGFibGU6IChjbWQpIC0+XG4gICAgbmFtZXMgPSBAZ2V0RGlyZWN0TmFtZXMoKVxuICAgIGlmIG5hbWVzLmxlbmd0aCA9PSAxXG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGVXaXRoTmFtZShuYW1lc1swXSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gY21kLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICBjbWRTY29yZTogKGNtZCkgLT5cbiAgICBzY29yZSA9IGNtZC5kZXB0aFxuICAgIGlmIGNtZC5uYW1lID09ICdmYWxsYmFjaycgXG4gICAgICAgIHNjb3JlIC09IDEwMDBcbiAgICByZXR1cm4gc2NvcmVcbiAgYmVzdEluUG9zaWJpbGl0aWVzOiAocG9zcykgLT5cbiAgICBpZiBwb3NzLmxlbmd0aCA+IDBcbiAgICAgIGJlc3QgPSBudWxsXG4gICAgICBiZXN0U2NvcmUgPSBudWxsXG4gICAgICBmb3IgcCBpbiBwb3NzXG4gICAgICAgIHNjb3JlID0gQGNtZFNjb3JlKHApXG4gICAgICAgIGlmICFiZXN0PyBvciBzY29yZSA+PSBiZXN0U2NvcmVcbiAgICAgICAgICBiZXN0U2NvcmUgPSBzY29yZVxuICAgICAgICAgIGJlc3QgPSBwXG4gICAgICByZXR1cm4gYmVzdDsiLCIjIFtwYXdhXVxuIyAgIHJlcGxhY2UgJ3JlcGxhY2UoL1xcdC9nJyAncmVwbGFjZShcIlxcdFwiJ1xuXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5pbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcblxuZXhwb3J0IGNsYXNzIENtZEluc3RhbmNlXG4gIGNvbnN0cnVjdG9yOiAoQGNtZCxAY29udGV4dCA9IE5vbmUpIC0+XG4gIFxuICBpbml0OiAtPlxuICAgIHVubGVzcyBAaXNFbXB0eSgpIG9yIEBpbml0ZWRcbiAgICAgIEBpbml0ZWQgPSB0cnVlXG4gICAgICBAX2dldENtZE9iaigpXG4gICAgICBAX2luaXRQYXJhbXMoKVxuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgQGNtZE9iai5pbml0KClcbiAgICByZXR1cm4gdGhpc1xuICBzZXRQYXJhbToobmFtZSx2YWwpLT5cbiAgICBAbmFtZWRbbmFtZV0gPSB2YWxcbiAgcHVzaFBhcmFtOih2YWwpLT5cbiAgICBAcGFyYW1zLnB1c2godmFsKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHVubGVzcyBAY29udGV4dD9cbiAgICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgIHJldHVybiBAY29udGV4dCBvciBuZXcgQ29udGV4dCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUpLT5cbiAgICBmaW5kZXIgPSBAZ2V0Q29udGV4dCgpLmdldEZpbmRlcihjbWROYW1lLEBfZ2V0UGFyZW50TmFtZXNwYWNlcygpKVxuICAgIGZpbmRlci5pbnN0YW5jZSA9IHRoaXNcbiAgICByZXR1cm4gZmluZGVyXG4gIF9nZXRDbWRPYmo6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIEBjbWQuaW5pdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5jbHM/XG4gICAgICAgIEBjbWRPYmogPSBuZXcgY21kLmNscyh0aGlzKVxuICAgICAgICByZXR1cm4gQGNtZE9ialxuICBfaW5pdFBhcmFtczogLT5cbiAgICBAbmFtZWQgPSBAZ2V0RGVmYXVsdHMoKVxuICBfZ2V0UGFyZW50TmFtZXNwYWNlczogLT5cbiAgICByZXR1cm4gW11cbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQGNtZD9cbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgIHJldHVybiBAY21kLnJlc3VsdElzQXZhaWxhYmxlKClcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIHJlcyA9IHt9XG4gICAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmVzID0gQ29kZXdhdmUudXRpbC5tZXJnZShyZXMsYWxpYXNlZC5nZXREZWZhdWx0cygpKVxuICAgICAgcmVzID0gQ29kZXdhdmUudXRpbC5tZXJnZShyZXMsQGNtZC5kZWZhdWx0cylcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJlcyA9IENvZGV3YXZlLnV0aWwubWVyZ2UocmVzLEBjbWRPYmouZ2V0RGVmYXVsdHMoKSlcbiAgICAgIHJldHVybiByZXNcbiAgZ2V0QWxpYXNlZDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICBAZ2V0QWxpYXNlZEZpbmFsKClcbiAgICAgIHJldHVybiBAYWxpYXNlZENtZCBvciBudWxsXG4gIGdldEFsaWFzZWRGaW5hbDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGFsaWFzZWRGaW5hbENtZD9cbiAgICAgICAgcmV0dXJuIEBhbGlhc2VkRmluYWxDbWQgb3IgbnVsbFxuICAgICAgaWYgQGNtZC5hbGlhc09mP1xuICAgICAgICBhbGlhc2VkID0gQGNtZFxuICAgICAgICB3aGlsZSBhbGlhc2VkPyBhbmQgYWxpYXNlZC5hbGlhc09mP1xuICAgICAgICAgIGFsaWFzZWQgPSBhbGlhc2VkLl9hbGlhc2VkRnJvbUZpbmRlcihAZ2V0RmluZGVyKEBhbHRlckFsaWFzT2YoYWxpYXNlZC5hbGlhc09mKSkpXG4gICAgICAgICAgdW5sZXNzIEBhbGlhc2VkQ21kP1xuICAgICAgICAgICAgQGFsaWFzZWRDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIEBhbGlhc2VkRmluYWxDbWQgPSBhbGlhc2VkIG9yIGZhbHNlXG4gICAgICAgIHJldHVybiBhbGlhc2VkXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBhbGlhc09mXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPcHRpb25zP1xuICAgICAgICByZXR1cm4gQGNtZE9wdGlvbnNcbiAgICAgIG9wdCA9IEBjbWQuX29wdGlvbnNGb3JBbGlhc2VkKEBnZXRBbGlhc2VkKCkpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBvcHQgPSBDb2Rld2F2ZS51dGlsLm1lcmdlKG9wdCxAY21kT2JqLmdldE9wdGlvbnMoKSlcbiAgICAgIEBjbWRPcHRpb25zID0gb3B0XG4gICAgICByZXR1cm4gb3B0XG4gIGdldE9wdGlvbjogKGtleSkgLT5cbiAgICBvcHRpb25zID0gQGdldE9wdGlvbnMoKVxuICAgIGlmIG9wdGlvbnM/IGFuZCBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBnZXRQYXJhbTogKG5hbWVzLCBkZWZWYWwgPSBudWxsKSAtPlxuICAgIG5hbWVzID0gW25hbWVzXSBpZiAodHlwZW9mIG5hbWVzIGluIFsnc3RyaW5nJywnbnVtYmVyJ10pXG4gICAgZm9yIG4gaW4gbmFtZXNcbiAgICAgIHJldHVybiBAbmFtZWRbbl0gaWYgQG5hbWVkW25dP1xuICAgICAgcmV0dXJuIEBwYXJhbXNbbl0gaWYgQHBhcmFtc1tuXT9cbiAgICByZXR1cm4gZGVmVmFsXG4gIGFuY2VzdG9yQ21kczogLT5cbiAgICBpZiBAY29udGV4dC5jb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29udGV4dC5jb2Rld2F2ZS5pbkluc3RhbmNlLmFuY2VzdG9yQ21kc0FuZFNlbGYoKVxuICAgIHJldHVybiBbXVxuICBhbmNlc3RvckNtZHNBbmRTZWxmOiAtPlxuICAgIHJldHVybiBAYW5jZXN0b3JDbWRzKCkuY29uY2F0KFtAY21kXSlcbiAgcnVuRXhlY3V0ZUZ1bmN0OiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICByZXR1cm4gQGNtZE9iai5leGVjdXRlKClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkRmluYWwoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQuZXhlY3V0ZUZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLmV4ZWN1dGVGdW5jdCh0aGlzKVxuICByYXdSZXN1bHQ6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLnJlc3VsdCgpXG4gICAgICBjbWQgPSBAZ2V0QWxpYXNlZEZpbmFsKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLnJlc3VsdEZ1bmN0P1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdEZ1bmN0KHRoaXMpXG4gICAgICBpZiBjbWQucmVzdWx0U3RyP1xuICAgICAgICByZXR1cm4gY21kLnJlc3VsdFN0clxuICByZXN1bHQ6IC0+IFxuICAgIEBpbml0KClcbiAgICBpZiBAcmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgaWYgKHJlcyA9IEByYXdSZXN1bHQoKSk/XG4gICAgICAgIHJlcyA9IEBmb3JtYXRJbmRlbnQocmVzKVxuICAgICAgICBpZiByZXMubGVuZ3RoID4gMCBhbmQgQGdldE9wdGlvbigncGFyc2UnLHRoaXMpIFxuICAgICAgICAgIHBhcnNlciA9IEBnZXRQYXJzZXJGb3JUZXh0KHJlcylcbiAgICAgICAgICByZXMgPSBwYXJzZXIucGFyc2VBbGwoKVxuICAgICAgICBpZiBhbHRlckZ1bmN0ID0gQGdldE9wdGlvbignYWx0ZXJSZXN1bHQnLHRoaXMpXG4gICAgICAgICAgcmVzID0gYWx0ZXJGdW5jdChyZXMsdGhpcylcbiAgICAgICAgcmV0dXJuIHJlc1xuICBnZXRQYXJzZXJGb3JUZXh0OiAodHh0PScnKSAtPlxuICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcih0eHQpLCB7aW5JbnN0YW5jZTp0aGlzfSlcbiAgICBwYXJzZXIuY2hlY2tDYXJyZXQgPSBmYWxzZVxuICAgIHJldHVybiBwYXJzZXJcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHJldHVybiAwXG4gIGZvcm1hdEluZGVudDogKHRleHQpIC0+XG4gICAgaWYgdGV4dD9cbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcdC9nLCcgICcpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYXBwbHlJbmRlbnQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBDb2Rld2F2ZS51dGlsLmluZGVudE5vdEZpcnN0KHRleHQsQGdldEluZGVudCgpLFwiIFwiKSIsIiMgW3Bhd2FdXG4jICAgcmVwbGFjZSAnY2xhc3MgQENvZGV3YXZlJyAnY2xhc3MgQ29kZXdhdmUoKTonXG4jICAgcmVwbGFjZSAvY3Bvcy4oXFx3KykvIGNwb3NbJyQxJ11cbiMgICByZXBsYWNlICduZXcgQ29kZXdhdmUoJyBDb2Rld2F2ZShcbiMgICByZXBsYWNlICdAQ29kZXdhdmUuaW5pdCA9IC0+JyAnZGVmIGluaXQoKTonXG5cbmltcG9ydCB7IFByb2Nlc3MgfSBmcm9tICcuL1Byb2Nlc3MnO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UgfSBmcm9tICcuL1Bvc2l0aW9uZWRDbWRJbnN0YW5jZSc7XG5pbXBvcnQgeyBUZXh0UGFyc2VyIH0gZnJvbSAnLi9UZXh0UGFyc2VyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgQ29kZXdhdmVcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBvcHRpb25zID0ge30pIC0+XG4gICAgQ29kZXdhdmUuaW5pdCgpXG4gICAgIyBDb2Rld2F2ZS5sb2dnZXIudG9Nb25pdG9yKHRoaXMsJ3J1bkF0Q3Vyc29yUG9zJylcbiAgICBAbWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSdcbiAgICBAdmFycyA9IHt9XG4gICAgXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAnYnJha2V0cycgOiAnfn4nLFxuICAgICAgJ2RlY28nIDogJ34nLFxuICAgICAgJ2Nsb3NlQ2hhcicgOiAnLycsXG4gICAgICAnbm9FeGVjdXRlQ2hhcicgOiAnIScsXG4gICAgICAnY2FycmV0Q2hhcicgOiAnfCcsXG4gICAgICAnY2hlY2tDYXJyZXQnIDogdHJ1ZSxcbiAgICAgICdpbkluc3RhbmNlJyA6IG51bGxcbiAgICB9XG4gICAgQHBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddXG4gICAgXG4gICAgQG5lc3RlZCA9IGlmIEBwYXJlbnQ/IHRoZW4gQHBhcmVudC5uZXN0ZWQrMSBlbHNlIDBcbiAgICBcbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZSBpZiBAcGFyZW50PyBhbmQga2V5ICE9ICdwYXJlbnQnXG4gICAgICAgIHRoaXNba2V5XSA9IEBwYXJlbnRba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICBAZWRpdG9yLmJpbmRlZFRvKHRoaXMpIGlmIEBlZGl0b3I/XG4gICAgXG4gICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzKVxuICAgIGlmIEBpbkluc3RhbmNlP1xuICAgICAgQGNvbnRleHQucGFyZW50ID0gQGluSW5zdGFuY2UuY29udGV4dFxuICBvbkFjdGl2YXRpb25LZXk6IC0+XG4gICAgQHByb2Nlc3MgPSBuZXcgUHJvY2VzcygpXG4gICAgQ29kZXdhdmUubG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKVxuICAgIEBydW5BdEN1cnNvclBvcygpXG4gICAgIyBDb2Rld2F2ZS5sb2dnZXIucmVzdW1lKClcbiAgICBAcHJvY2VzcyA9IG51bGxcbiAgcnVuQXRDdXJzb3JQb3M6IC0+XG4gICAgaWYgQGVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICAgIEBydW5BdE11bHRpUG9zKEBlZGl0b3IuZ2V0TXVsdGlTZWwoKSlcbiAgICBlbHNlXG4gICAgICBAcnVuQXRQb3MoQGVkaXRvci5nZXRDdXJzb3JQb3MoKSlcbiAgcnVuQXRQb3M6IChwb3MpLT5cbiAgICBAcnVuQXRNdWx0aVBvcyhbcG9zXSlcbiAgcnVuQXRNdWx0aVBvczogKG11bHRpUG9zKS0+XG4gICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMFxuICAgICAgY21kID0gQGNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpXG4gICAgICBpZiBjbWQ/XG4gICAgICAgIGlmIG11bHRpUG9zLmxlbmd0aCA+IDFcbiAgICAgICAgICBjbWQuc2V0TXVsdGlQb3MobXVsdGlQb3MpXG4gICAgICAgIGNtZC5pbml0KClcbiAgICAgICAgQ29kZXdhdmUubG9nZ2VyLmxvZyhjbWQpXG4gICAgICAgIGNtZC5leGVjdXRlKClcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbXVsdGlQb3NbMF0uc3RhcnQgPT0gbXVsdGlQb3NbMF0uZW5kXG4gICAgICAgICAgQGFkZEJyYWtldHMobXVsdGlQb3MpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcHJvbXB0Q2xvc2luZ0NtZChtdWx0aVBvcylcbiAgY29tbWFuZE9uUG9zOiAocG9zKSAtPlxuICAgIGlmIEBwcmVjZWRlZEJ5QnJha2V0cyhwb3MpIGFuZCBAZm9sbG93ZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAxIFxuICAgICAgcHJldiA9IHBvcy1AYnJha2V0cy5sZW5ndGhcbiAgICAgIG5leHQgPSBwb3NcbiAgICBlbHNlXG4gICAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGNvdW50UHJldkJyYWtldChwb3MpICUgMiA9PSAwXG4gICAgICAgIHBvcyAtPSBAYnJha2V0cy5sZW5ndGhcbiAgICAgIHByZXYgPSBAZmluZFByZXZCcmFrZXQocG9zKVxuICAgICAgdW5sZXNzIHByZXY/XG4gICAgICAgIHJldHVybiBudWxsIFxuICAgICAgbmV4dCA9IEBmaW5kTmV4dEJyYWtldChwb3MtMSlcbiAgICAgIGlmICFuZXh0PyBvciBAY291bnRQcmV2QnJha2V0KHByZXYpICUgMiAhPSAwIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiBuZXcgUG9zaXRpb25lZENtZEluc3RhbmNlKHRoaXMscHJldixAZWRpdG9yLnRleHRTdWJzdHIocHJldixuZXh0K0BicmFrZXRzLmxlbmd0aCkpXG4gIG5leHRDbWQ6IChzdGFydCA9IDApIC0+XG4gICAgcG9zID0gc3RhcnRcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyAsW0BicmFrZXRzLFwiXFxuXCJdKVxuICAgICAgcG9zID0gZi5wb3MgKyBmLnN0ci5sZW5ndGhcbiAgICAgIGlmIGYuc3RyID09IEBicmFrZXRzXG4gICAgICAgIGlmIGJlZ2lubmluZz9cbiAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLCBiZWdpbm5pbmcsIEBlZGl0b3IudGV4dFN1YnN0cihiZWdpbm5pbmcsIGYucG9zK0BicmFrZXRzLmxlbmd0aCkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBiZWdpbm5pbmcgPSBmLnBvc1xuICAgICAgZWxzZVxuICAgICAgICBiZWdpbm5pbmcgPSBudWxsXG4gICAgbnVsbFxuICBnZXRFbmNsb3NpbmdDbWQ6IChwb3MgPSAwKSAtPlxuICAgIGNwb3MgPSBwb3NcbiAgICBjbG9zaW5nUHJlZml4ID0gQGJyYWtldHMgKyBAY2xvc2VDaGFyXG4gICAgd2hpbGUgKHAgPSBAZmluZE5leHQoY3BvcyxjbG9zaW5nUHJlZml4KSk/XG4gICAgICBpZiBjbWQgPSBAY29tbWFuZE9uUG9zKHArY2xvc2luZ1ByZWZpeC5sZW5ndGgpXG4gICAgICAgIGNwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgICAgaWYgY21kLnBvcyA8IHBvc1xuICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgIGVsc2VcbiAgICAgICAgY3BvcyA9IHArY2xvc2luZ1ByZWZpeC5sZW5ndGhcbiAgICBudWxsXG4gIHByZWNlZGVkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLUBicmFrZXRzLmxlbmd0aCxwb3MpID09IEBicmFrZXRzXG4gIGZvbGxvd2VkQnlCcmFrZXRzOiAocG9zKSAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHRTdWJzdHIocG9zLHBvcytAYnJha2V0cy5sZW5ndGgpID09IEBicmFrZXRzXG4gIGNvdW50UHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICBpID0gMFxuICAgIHdoaWxlIChzdGFydCA9IEBmaW5kUHJldkJyYWtldChzdGFydCkpP1xuICAgICAgaSsrXG4gICAgcmV0dXJuIGlcbiAgaXNFbmRMaW5lOiAocG9zKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrMSkgPT0gXCJcXG5cIiBvciBwb3MgKyAxID49IEBlZGl0b3IudGV4dExlbigpXG4gIGZpbmRQcmV2QnJha2V0OiAoc3RhcnQpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHRCcmFrZXQoc3RhcnQsLTEpXG4gIGZpbmROZXh0QnJha2V0OiAoc3RhcnQsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW0BicmFrZXRzLFwiXFxuXCJdLCBkaXJlY3Rpb24pXG4gICAgXG4gICAgZi5wb3MgaWYgZiBhbmQgZi5zdHIgPT0gQGJyYWtldHNcbiAgZmluZFByZXY6IChzdGFydCxzdHJpbmcpIC0+IFxuICAgIHJldHVybiBAZmluZE5leHQoc3RhcnQsc3RyaW5nLC0xKVxuICBmaW5kTmV4dDogKHN0YXJ0LHN0cmluZyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBmID0gQGZpbmRBbnlOZXh0KHN0YXJ0ICxbc3RyaW5nXSwgZGlyZWN0aW9uKVxuICAgIGYucG9zIGlmIGZcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICByZXR1cm4gQGVkaXRvci5maW5kQW55TmV4dChzdGFydCxzdHJpbmdzLGRpcmVjdGlvbilcbiAgICBcbiAgZmluZE1hdGNoaW5nUGFpcjogKHN0YXJ0UG9zLG9wZW5pbmcsY2xvc2luZyxkaXJlY3Rpb24gPSAxKSAtPlxuICAgIHBvcyA9IHN0YXJ0UG9zXG4gICAgbmVzdGVkID0gMFxuICAgIHdoaWxlIGYgPSBAZmluZEFueU5leHQocG9zLFtjbG9zaW5nLG9wZW5pbmddLGRpcmVjdGlvbilcbiAgICAgIHBvcyA9IGYucG9zICsgKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBmLnN0ci5sZW5ndGggZWxzZSAwKVxuICAgICAgaWYgZi5zdHIgPT0gKGlmIGRpcmVjdGlvbiA+IDAgdGhlbiBjbG9zaW5nIGVsc2Ugb3BlbmluZylcbiAgICAgICAgaWYgbmVzdGVkID4gMFxuICAgICAgICAgIG5lc3RlZC0tXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZlxuICAgICAgZWxzZVxuICAgICAgICBuZXN0ZWQrK1xuICAgIG51bGxcbiAgYWRkQnJha2V0czogKHBvcykgLT5cbiAgICBwb3MgPSBDb2Rld2F2ZS51dGlsLnBvc0NvbGxlY3Rpb24ocG9zKVxuICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKEBicmFrZXRzLEBicmFrZXRzKS5tYXAoIChyKS0+ci5zZWxlY3RDb250ZW50KCkgKVxuICAgIEBlZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICBwcm9tcHRDbG9zaW5nQ21kOiAoc2VsZWN0aW9ucykgLT5cbiAgICBAY2xvc2luZ1Byb21wLnN0b3AoKSBpZiBAY2xvc2luZ1Byb21wP1xuICAgIEBjbG9zaW5nUHJvbXAgPSBDb2Rld2F2ZS5DbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsc2VsZWN0aW9ucykuYmVnaW4oKSAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAvXFwobmV3ICguKilcXCkuYmVnaW4vICQxLmJlZ2luIHJlcGFyc2VcbiAgcGFyc2VBbGw6IChyZWN1cnNpdmUgPSB0cnVlKSAtPlxuICAgIGlmIEBuZXN0ZWQgPiAxMDBcbiAgICAgIHRocm93IFwiSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb25cIlxuICAgIHBvcyA9IDBcbiAgICB3aGlsZSBjbWQgPSBAbmV4dENtZChwb3MpXG4gICAgICBwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgIEBlZGl0b3Iuc2V0Q3Vyc29yUG9zKHBvcylcbiAgICAgICMgY29uc29sZS5sb2coY21kKVxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgcmVjdXJzaXZlIGFuZCBjbWQuY29udGVudD8gYW5kICghY21kLmdldENtZCgpPyBvciAhY21kLmdldE9wdGlvbigncHJldmVudFBhcnNlQWxsJykpXG4gICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcihjbWQuY29udGVudCksIHtwYXJlbnQ6IHRoaXN9KVxuICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICBpZiBjbWQuZXhlY3V0ZSgpP1xuICAgICAgICBpZiBjbWQucmVwbGFjZUVuZD9cbiAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcG9zID0gQGVkaXRvci5nZXRDdXJzb3JQb3MoKS5lbmRcbiAgICByZXR1cm4gQGdldFRleHQoKVxuICBnZXRUZXh0OiAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHQoKVxuICBpc1Jvb3Q6IC0+XG4gICAgcmV0dXJuICFAcGFyZW50PyBhbmQgKCFAaW5JbnN0YW5jZT8gb3IgIUBpbkluc3RhbmNlLmZpbmRlcj8pXG4gIGdldFJvb3Q6IC0+XG4gICAgaWYgQGlzUm9vdFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICBlbHNlIGlmIEBwYXJlbnQ/XG4gICAgICByZXR1cm4gQHBhcmVudC5nZXRSb290KClcbiAgICBlbHNlIGlmIEBpbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBpbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICByZW1vdmVDYXJyZXQ6ICh0eHQpIC0+XG4gICAgcmV0dXJuIENvZGV3YXZlLnV0aWwucmVtb3ZlQ2FycmV0KHR4dCxAY2FycmV0Q2hhcilcbiAgZ2V0Q2FycmV0UG9zOiAodHh0KSAtPlxuICAgIHJldHVybiBDb2Rld2F2ZS51dGlsLmdldENhcnJldFBvcyh0eHQsQGNhcnJldENoYXIpXG4gIHJlZ01hcmtlcjogKGZsYWdzPVwiZ1wiKSAtPiAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSBmbGFncz1cImdcIiBmbGFncz0wIFxuICAgIHJldHVybiBuZXcgUmVnRXhwKENvZGV3YXZlLnV0aWwuZXNjYXBlUmVnRXhwKEBtYXJrZXIpLCBmbGFncylcbiAgcmVtb3ZlTWFya2VyczogKHRleHQpIC0+XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZShAcmVnTWFya2VyKCksJycpICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIEByZWdNYXJrZXIoKSBzZWxmLm1hcmtlciBcblxuICBAaW5pdDogLT5cbiAgICB1bmxlc3MgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIENvbW1hbmQuaW5pdENtZHMoKVxuICAgICAgQ29tbWFuZC5sb2FkQ21kcygpXG5cbiAgQGluaXRlZDogZmFsc2UiLCIjIFtwYXdhIHB5dGhvbl1cbiMgICByZXBsYWNlIENvZGV3YXZlLkNvbW1hbmQuY21kcyBjbWRzXG4jICAgcmVwbGFjZSBDb2Rld2F2ZS5Db21tYW5kIENvbW1hbmRcbiMgICByZXBsYWNlIEBDb2Rld2F2ZS5Db21tYW5kLiAnJ1xuXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCB7IFN0b3JhZ2UgfSBmcm9tICcuL1N0b3JhZ2UnO1xuXG5fb3B0S2V5ID0gKGtleSxkaWN0LGRlZlZhbCA9IG51bGwpIC0+XG4gICMgb3B0aW9uYWwgRGljdGlvbmFyeSBrZXlcbiAgcmV0dXJuIGlmIGtleSBvZiBkaWN0IHRoZW4gZGljdFtrZXldIGVsc2UgZGVmVmFsXG5cblxuZXhwb3J0IGNsYXNzIENvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAbmFtZSxAZGF0YT1udWxsLEBwYXJlbnQ9bnVsbCkgLT5cbiAgICBAY21kcyA9IFtdXG4gICAgQGRldGVjdG9ycyA9IFtdXG4gICAgQGV4ZWN1dGVGdW5jdCA9IEByZXN1bHRGdW5jdCA9IEByZXN1bHRTdHIgPSBAYWxpYXNPZiA9IEBjbHMgPSBudWxsXG4gICAgQGFsaWFzZWQgPSBudWxsXG4gICAgQGZ1bGxOYW1lID0gQG5hbWVcbiAgICBAZGVwdGggPSAwXG4gICAgW0BfcGFyZW50LCBAX2luaXRlZF0gPSBbbnVsbCwgZmFsc2VdXG4gICAgQHNldFBhcmVudChwYXJlbnQpXG4gICAgQGRlZmF1bHRzID0ge31cbiAgICBcbiAgICBAZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBuYW1lVG9QYXJhbTogbnVsbCxcbiAgICAgIGNoZWNrQ2FycmV0OiB0cnVlLFxuICAgICAgcGFyc2U6IGZhbHNlLFxuICAgICAgYmVmb3JlRXhlY3V0ZTogbnVsbCxcbiAgICAgIGFsdGVyUmVzdWx0OiBudWxsLFxuICAgICAgcHJldmVudFBhcnNlQWxsOiBmYWxzZSxcbiAgICAgIHJlcGxhY2VCb3g6IGZhbHNlLFxuICAgIH1cbiAgICBAb3B0aW9ucyA9IHt9XG4gICAgQGZpbmFsT3B0aW9ucyA9IG51bGxcbiAgcGFyZW50OiAtPlxuICAgIHJldHVybiBAX3BhcmVudFxuICBzZXRQYXJlbnQ6ICh2YWx1ZSkgLT5cbiAgICBpZiBAX3BhcmVudCAhPSB2YWx1ZVxuICAgICAgQF9wYXJlbnQgPSB2YWx1ZVxuICAgICAgQGZ1bGxOYW1lID0gKFxuICAgICAgICBpZiBAX3BhcmVudD8gYW5kIEBfcGFyZW50Lm5hbWU/XG4gICAgICAgICAgQF9wYXJlbnQuZnVsbE5hbWUgKyAnOicgKyBAbmFtZSBcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICBAbmFtZVxuICAgICAgKVxuICAgICAgQGRlcHRoID0gKFxuICAgICAgICBpZiBAX3BhcmVudD8gYW5kIEBfcGFyZW50LmRlcHRoP1xuICAgICAgICB0aGVuIEBfcGFyZW50LmRlcHRoICsgMVxuICAgICAgICBlbHNlIDBcbiAgICAgIClcbiAgaW5pdDogLT5cbiAgICBpZiAhQF9pbml0ZWRcbiAgICAgIEBfaW5pdGVkID0gdHJ1ZVxuICAgICAgQHBhcnNlRGF0YShAZGF0YSlcbiAgICByZXR1cm4gdGhpc1xuICB1bnJlZ2lzdGVyOiAtPlxuICAgIEBfcGFyZW50LnJlbW92ZUNtZCh0aGlzKVxuICBpc0VkaXRhYmxlOiAtPlxuICAgIHJldHVybiBAcmVzdWx0U3RyPyBvciBAYWxpYXNPZj9cbiAgaXNFeGVjdXRhYmxlOiAtPlxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgIGZvciBwIGluIFsncmVzdWx0U3RyJywncmVzdWx0RnVuY3QnLCdjbHMnLCdleGVjdXRlRnVuY3QnXVxuICAgICAgaWYgdGhpc1twXT9cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgaXNFeGVjdXRhYmxlV2l0aE5hbWU6IChuYW1lKSAtPlxuICAgIGlmIEBhbGlhc09mP1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgIGFsaWFzT2YgPSBAYWxpYXNPZi5yZXBsYWNlKCclbmFtZSUnLG5hbWUpXG4gICAgICBhbGlhc2VkID0gQF9hbGlhc2VkRnJvbUZpbmRlcihjb250ZXh0LmdldEZpbmRlcihhbGlhc09mKSlcbiAgICAgIGlmIGFsaWFzZWQ/XG4gICAgICAgIHJldHVybiBhbGlhc2VkLmluaXQoKS5pc0V4ZWN1dGFibGUoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIEBpc0V4ZWN1dGFibGUoKVxuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXR1cm4gYWxpYXNlZC5yZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgZm9yIHAgaW4gWydyZXN1bHRTdHInLCdyZXN1bHRGdW5jdCddXG4gICAgICBpZiB0aGlzW3BdP1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICBnZXREZWZhdWx0czogLT5cbiAgICByZXMgPSB7fVxuICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIHJlcyA9IENvZGV3YXZlLnV0aWwubWVyZ2UocmVzLGFsaWFzZWQuZ2V0RGVmYXVsdHMoKSlcbiAgICByZXMgPSBDb2Rld2F2ZS51dGlsLm1lcmdlKHJlcyxAZGVmYXVsdHMpXG4gICAgcmV0dXJuIHJlc1xuICBfYWxpYXNlZEZyb21GaW5kZXI6IChmaW5kZXIpIC0+XG4gICAgICBmaW5kZXIudXNlRmFsbGJhY2tzID0gZmFsc2VcbiAgICAgIGZpbmRlci5tdXN0RXhlY3V0ZSA9IGZhbHNlXG4gICAgICBmaW5kZXIudXNlRGV0ZWN0b3JzID0gZmFsc2VcbiAgICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIGdldEFsaWFzZWQ6IC0+XG4gICAgaWYgQGFsaWFzT2Y/XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKVxuICAgICAgcmV0dXJuIEBfYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoQGFsaWFzT2YpKVxuICBzZXRPcHRpb25zOiAoZGF0YSkgLT5cbiAgICBmb3Iga2V5LCB2YWwgb2YgZGF0YVxuICAgICAgaWYga2V5IG9mIEBkZWZhdWx0T3B0aW9uc1xuICAgICAgICBAb3B0aW9uc1trZXldID0gdmFsXG4gIF9vcHRpb25zRm9yQWxpYXNlZDogKGFsaWFzZWQpIC0+XG4gICAgb3B0ID0ge31cbiAgICBvcHQgPSBDb2Rld2F2ZS51dGlsLm1lcmdlKG9wdCxAZGVmYXVsdE9wdGlvbnMpXG4gICAgaWYgYWxpYXNlZD9cbiAgICAgIG9wdCA9IENvZGV3YXZlLnV0aWwubWVyZ2Uob3B0LGFsaWFzZWQuZ2V0T3B0aW9ucygpKVxuICAgIHJldHVybiBDb2Rld2F2ZS51dGlsLm1lcmdlKG9wdCxAb3B0aW9ucylcbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4gQF9vcHRpb25zRm9yQWxpYXNlZChAZ2V0QWxpYXNlZCgpKVxuICBnZXRPcHRpb246IChrZXkpIC0+XG4gICAgb3B0aW9ucyA9IEBnZXRPcHRpb25zKClcbiAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XVxuICBoZWxwOiAtPlxuICAgIGNtZCA9IEBnZXRDbWQoJ2hlbHAnKVxuICAgIGlmIGNtZD9cbiAgICAgIHJldHVybiBjbWQuaW5pdCgpLnJlc3VsdFN0clxuICBwYXJzZURhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gZGF0YVxuICAgIGlmIHR5cGVvZiBkYXRhID09ICdzdHJpbmcnXG4gICAgICBAcmVzdWx0U3RyID0gZGF0YVxuICAgICAgQG9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2UgaWYgZGF0YT8gIyBbcGF3YSBweXRob25dIHJlcGxhY2UgZGF0YT8gXCJpc2luc3RhbmNlKGRhdGEsZGljdClcIlxuICAgICAgcmV0dXJuIEBwYXJzZURpY3REYXRhKGRhdGEpXG4gICAgcmV0dXJuIGZhbHNlXG4gIHBhcnNlRGljdERhdGE6IChkYXRhKSAtPlxuICAgIHJlcyA9IF9vcHRLZXkoJ3Jlc3VsdCcsZGF0YSlcbiAgICBpZiB0eXBlb2YgcmVzID09IFwiZnVuY3Rpb25cIlxuICAgICAgQHJlc3VsdEZ1bmN0ID0gcmVzXG4gICAgZWxzZSBpZiByZXM/XG4gICAgICBAcmVzdWx0U3RyID0gcmVzXG4gICAgICBAb3B0aW9uc1sncGFyc2UnXSA9IHRydWVcbiAgICBleGVjdXRlID0gX29wdEtleSgnZXhlY3V0ZScsZGF0YSlcbiAgICBpZiB0eXBlb2YgZXhlY3V0ZSA9PSBcImZ1bmN0aW9uXCJcbiAgICAgIEBleGVjdXRlRnVuY3QgPSBleGVjdXRlXG4gICAgQGFsaWFzT2YgPSBfb3B0S2V5KCdhbGlhc09mJyxkYXRhKVxuICAgIEBjbHMgPSBfb3B0S2V5KCdjbHMnLGRhdGEpXG4gICAgQGRlZmF1bHRzID0gX29wdEtleSgnZGVmYXVsdHMnLGRhdGEsQGRlZmF1bHRzKVxuICAgIFxuICAgIEBzZXRPcHRpb25zKGRhdGEpXG4gICAgXG4gICAgaWYgJ2hlbHAnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2hlbHAnLGRhdGFbJ2hlbHAnXSx0aGlzKSlcbiAgICBpZiAnZmFsbGJhY2snIG9mIGRhdGFcbiAgICAgIEBhZGRDbWQobmV3IENvbW1hbmQoJ2ZhbGxiYWNrJyxkYXRhWydmYWxsYmFjayddLHRoaXMpKVxuICAgICAgXG4gICAgaWYgJ2NtZHMnIG9mIGRhdGFcbiAgICAgIEBhZGRDbWRzKGRhdGFbJ2NtZHMnXSlcbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDbWRzOiAoY21kcykgLT5cbiAgICBmb3IgbmFtZSwgZGF0YSBvZiBjbWRzXG4gICAgICBAYWRkQ21kKG5ldyBDb21tYW5kKG5hbWUsZGF0YSx0aGlzKSlcbiAgYWRkQ21kOiAoY21kKSAtPlxuICAgIGV4aXN0cyA9IEBnZXRDbWQoY21kLm5hbWUpXG4gICAgaWYgZXhpc3RzP1xuICAgICAgQHJlbW92ZUNtZChleGlzdHMpXG4gICAgY21kLnNldFBhcmVudCh0aGlzKVxuICAgIEBjbWRzLnB1c2goY21kKVxuICAgIHJldHVybiBjbWRcbiAgcmVtb3ZlQ21kOiAoY21kKSAtPlxuICAgIGlmIChpID0gQGNtZHMuaW5kZXhPZihjbWQpKSA+IC0xXG4gICAgICBAY21kcy5zcGxpY2UoaSwgMSlcbiAgICByZXR1cm4gY21kXG4gIGdldENtZDogKGZ1bGxuYW1lKSAtPlxuICAgIEBpbml0KClcbiAgICBbc3BhY2UsbmFtZV0gPSBDb2Rld2F2ZS51dGlsLnNwbGl0Rmlyc3ROYW1lc3BhY2UoZnVsbG5hbWUpXG4gICAgaWYgc3BhY2U/XG4gICAgICByZXR1cm4gQGdldENtZChzcGFjZSkuZ2V0Q21kKG5hbWUpXG4gICAgZm9yIGNtZCBpbiBAY21kc1xuICAgICAgaWYgY21kLm5hbWUgPT0gbmFtZVxuICAgICAgICByZXR1cm4gY21kXG4gIHNldENtZERhdGE6IChmdWxsbmFtZSxkYXRhKSAtPlxuICAgIEBzZXRDbWQoZnVsbG5hbWUsbmV3IENvbW1hbmQoZnVsbG5hbWUuc3BsaXQoJzonKS5wb3AoKSxkYXRhKSlcbiAgc2V0Q21kOiAoZnVsbG5hbWUsY21kKSAtPlxuICAgIFtzcGFjZSxuYW1lXSA9IENvZGV3YXZlLnV0aWwuc3BsaXRGaXJzdE5hbWVzcGFjZShmdWxsbmFtZSlcbiAgICBpZiBzcGFjZT9cbiAgICAgIG5leHQgPSBAZ2V0Q21kKHNwYWNlKVxuICAgICAgdW5sZXNzIG5leHQ/XG4gICAgICAgIG5leHQgPSBAYWRkQ21kKG5ldyBDb21tYW5kKHNwYWNlKSlcbiAgICAgIHJldHVybiBuZXh0LnNldENtZChuYW1lLGNtZClcbiAgICBlbHNlXG4gICAgICBAYWRkQ21kKGNtZClcbiAgICAgIHJldHVybiBjbWRcbiAgYWRkRGV0ZWN0b3I6IChkZXRlY3RvcikgLT5cbiAgICBAZGV0ZWN0b3JzLnB1c2goZGV0ZWN0b3IpXG4gICAgXG4gIEBjbWRJbml0aWFsaXNlcnMgPSBbXVxuXG4gIEBpbml0Q21kczogLT5cbiAgICBDb21tYW5kLmNtZHMgPSBuZXcgQ29tbWFuZChudWxsLHtcbiAgICAgICdjbWRzJzp7XG4gICAgICAgICdoZWxsbyc6e1xuICAgICAgICAgIGhlbHA6IFwiXCJcIlxuICAgICAgICAgIFwiSGVsbG8sIHdvcmxkIVwiIGlzIHR5cGljYWxseSBvbmUgb2YgdGhlIHNpbXBsZXN0IHByb2dyYW1zIHBvc3NpYmxlIGluXG4gICAgICAgICAgbW9zdCBwcm9ncmFtbWluZyBsYW5ndWFnZXMsIGl0IGlzIGJ5IHRyYWRpdGlvbiBvZnRlbiAoLi4uKSB1c2VkIHRvXG4gICAgICAgICAgdmVyaWZ5IHRoYXQgYSBsYW5ndWFnZSBvciBzeXN0ZW0gaXMgb3BlcmF0aW5nIGNvcnJlY3RseSAtd2lraXBlZGlhXG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgcmVzdWx0OiAnSGVsbG8sIFdvcmxkISdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgZm9yIGluaXRpYWxpc2VyIGluIENvZGV3YXZlLkNvbW1hbmQuY21kSW5pdGlhbGlzZXJzXG4gICAgICBpbml0aWFsaXNlcigpXG5cbiAgQHNhdmVDbWQ6IChmdWxsbmFtZSwgZGF0YSkgLT5cbiAgICBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICAgIENvZGV3YXZlLkNvbW1hbmQuY21kcy5zZXRDbWREYXRhKGZ1bGxuYW1lLGRhdGEpXG4gICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICB1bmxlc3Mgc2F2ZWRDbWRzP1xuICAgICAgc2F2ZWRDbWRzID0ge31cbiAgICBzYXZlZENtZHNbZnVsbG5hbWVdID0gZGF0YVxuICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycsc2F2ZWRDbWRzKVxuXG4gIEBsb2FkQ21kczogLT5cbiAgICBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICAgIHNhdmVkQ21kcyA9IHN0b3JhZ2UubG9hZCgnY21kcycpXG4gICAgaWYgc2F2ZWRDbWRzPyBcbiAgICAgIGZvciBmdWxsbmFtZSwgZGF0YSBvZiBzYXZlZENtZHNcbiAgICAgICAgQ29kZXdhdmUuQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsIGRhdGEpXG5cbiAgQHJlc2V0U2F2ZWQ6IC0+XG4gICAgc3RvcmFnZSA9IG5ldyBTdG9yYWdlKClcbiAgICBzdG9yYWdlLnNhdmUoJ2NtZHMnLHt9KVxuICBcblxuZXhwb3J0IGNsYXNzIEJhc2VDb21tYW5kXG4gIGNvbnN0cnVjdG9yOiAoQGluc3RhbmNlKSAtPlxuICBpbml0OiAtPlxuICAgICNcbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgcmV0dXJuIHRoaXNbXCJyZXN1bHRcIl0/ICMgW3Bhd2FdIHJlcGxhY2UgdGhpc1tcInJlc3VsdFwiXT8gJ2hhc2F0dHIoc2VsZixcInJlc3VsdFwiKSdcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgcmV0dXJuIHt9XG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIHt9XG4gICAgICAiLCJcbmltcG9ydCB7IENtZEZpbmRlciB9IGZyb20gJy4vQ21kRmluZGVyJztcbmltcG9ydCB7IENtZEluc3RhbmNlIH0gZnJvbSAnLi9DbWRJbnN0YW5jZSc7XG5cbmV4cG9ydCBjbGFzcyBDb250ZXh0XG4gIGNvbnN0cnVjdG9yOiAoQGNvZGV3YXZlKSAtPlxuICAgIEBuYW1lU3BhY2VzID0gW11cbiAgXG4gIGFkZE5hbWVTcGFjZTogKG5hbWUpIC0+XG4gICAgaWYgbmFtZSBub3QgaW4gQG5hbWVTcGFjZXMgXG4gICAgICBAbmFtZVNwYWNlcy5wdXNoKG5hbWUpXG4gICAgICBAX25hbWVzcGFjZXMgPSBudWxsXG4gIGFkZE5hbWVzcGFjZXM6IChzcGFjZXMpIC0+XG4gICAgaWYgc3BhY2VzIFxuICAgICAgaWYgdHlwZW9mIHNwYWNlcyA9PSAnc3RyaW5nJ1xuICAgICAgICBzcGFjZXMgPSBbc3BhY2VzXVxuICAgICAgZm9yIHNwYWNlIGluIHNwYWNlcyBcbiAgICAgICAgQGFkZE5hbWVTcGFjZShzcGFjZSlcbiAgcmVtb3ZlTmFtZVNwYWNlOiAobmFtZSkgLT5cbiAgICBAbmFtZVNwYWNlcyA9IEBuYW1lU3BhY2VzLmZpbHRlciAobikgLT4gbiBpc250IG5hbWVcblxuICBnZXROYW1lU3BhY2VzOiAtPlxuICAgIHVubGVzcyBAX25hbWVzcGFjZXM/XG4gICAgICBucGNzID0gWydjb3JlJ10uY29uY2F0KEBuYW1lU3BhY2VzKVxuICAgICAgaWYgQHBhcmVudD9cbiAgICAgICAgbnBjcyA9IG5wY3MuY29uY2F0KEBwYXJlbnQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgQF9uYW1lc3BhY2VzID0gQ29kZXdhdmUudXRpbC51bmlxdWUobnBjcylcbiAgICByZXR1cm4gQF9uYW1lc3BhY2VzXG4gIGdldENtZDogKGNtZE5hbWUsbmFtZVNwYWNlcyA9IFtdKSAtPlxuICAgIGZpbmRlciA9IEBnZXRGaW5kZXIoY21kTmFtZSxuYW1lU3BhY2VzKVxuICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUsbmFtZVNwYWNlcyA9IFtdKSAtPlxuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IG5hbWVTcGFjZXNcbiAgICAgIHVzZURldGVjdG9yczogQGlzUm9vdCgpXG4gICAgICBjb2Rld2F2ZTogQGNvZGV3YXZlXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSlcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD9cbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIGNjLmluZGV4T2YoJyVzJykgPiAtMVxuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJyxzdHIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgd3JhcENvbW1lbnRMZWZ0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLGkpICsgc3RyXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gIHdyYXBDb21tZW50UmlnaHQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkrMilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2NcbiAgY21kSW5zdGFuY2VGb3I6IChjbWQpIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsdGhpcylcbiAgZ2V0Q29tbWVudENoYXI6IC0+XG4gICAgaWYgQGNvbW1lbnRDaGFyP1xuICAgICAgcmV0dXJuIEBjb21tZW50Q2hhclxuICAgIGNtZCA9IEBnZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG4gICAgaWYgY21kP1xuICAgICAgaW5zdCA9IEBjbWRJbnN0YW5jZUZvcihjbWQpXG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnXG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICBAY29tbWVudENoYXIgPSBjaGFyXG4gICAgcmV0dXJuIEBjb21tZW50Q2hhciIsImV4cG9ydCBjbGFzcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQG5hbWVzcGFjZSA9IG51bGxcbiAgICBAX2xhbmcgPSBudWxsXG4gIGJpbmRlZFRvOiAoY29kZXdhdmUpIC0+XG4gICAgI1xuICB0ZXh0OiAodmFsKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dENoYXJBdDogKHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRMZW46IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHNwbGljZVRleHQ6IChzdGFydCwgZW5kLCB0ZXh0KSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCA9IG51bGwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBiZWdpblVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBlbmRVbmRvQWN0aW9uOiAtPlxuICAgICNcbiAgZ2V0TGFuZzogLT5cbiAgICByZXR1cm4gQF9sYW5nXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gIGdldEVtbWV0Q29udGV4dE9iamVjdDogLT5cbiAgICByZXR1cm4gbnVsbFxuICBhbGxvd011bHRpU2VsZWN0aW9uOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBzZXRNdWx0aVNlbDogKHNlbGVjdGlvbnMpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRNdWx0aVNlbDogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGNhbkxpc3RlblRvQ2hhbmdlOiAtPlxuICAgIHJldHVybiBmYWxzZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIFxuICBnZXRMaW5lQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIG5ldyBDb2Rld2F2ZS51dGlsLlBvcyhAZmluZExpbmVTdGFydChwb3MpLEBmaW5kTGluZUVuZChwb3MpKVxuICBmaW5kTGluZVN0YXJ0OiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCJdLCAtMSlcbiAgICByZXR1cm4gaWYgcCB0aGVuIHAucG9zKzEgZWxzZSAwXG4gIGZpbmRMaW5lRW5kOiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCIsXCJcXHJcIl0pXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcyBlbHNlIEB0ZXh0TGVuKClcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBpZiBkaXJlY3Rpb24gPiAwXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoc3RhcnQsQHRleHRMZW4oKSlcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoMCxzdGFydClcbiAgICBiZXN0UG9zID0gbnVsbFxuICAgIGZvciBzdHJpIGluIHN0cmluZ3NcbiAgICAgIHBvcyA9IGlmIGRpcmVjdGlvbiA+IDAgdGhlbiB0ZXh0LmluZGV4T2Yoc3RyaSkgZWxzZSB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpXG4gICAgICBpZiBwb3MgIT0gLTFcbiAgICAgICAgaWYgIWJlc3RQb3M/IG9yIGJlc3RQb3MqZGlyZWN0aW9uID4gcG9zKmRpcmVjdGlvblxuICAgICAgICAgIGJlc3RQb3MgPSBwb3NcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaVxuICAgIGlmIGJlc3RTdHI/XG4gICAgICByZXR1cm4gbmV3IENvZGV3YXZlLnV0aWwuU3RyUG9zKChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gYmVzdFBvcyArIHN0YXJ0IGVsc2UgYmVzdFBvcyksYmVzdFN0cilcbiAgICByZXR1cm4gbnVsbFxuICBcbiAgYXBwbHlSZXBsYWNlbWVudHM6IChyZXBsYWNlbWVudHMpIC0+XG4gICAgc2VsZWN0aW9ucyA9IFtdXG4gICAgb2Zmc2V0ID0gMFxuICAgIGZvciByZXBsIGluIHJlcGxhY2VtZW50c1xuICAgICAgcmVwbC53aXRoRWRpdG9yKHRoaXMpXG4gICAgICByZXBsLmFwcGx5T2Zmc2V0KG9mZnNldClcbiAgICAgIHJlcGwuYXBwbHkoKVxuICAgICAgb2Zmc2V0ICs9IHJlcGwub2Zmc2V0QWZ0ZXIodGhpcylcbiAgICAgIFxuICAgICAgc2VsZWN0aW9ucyA9IHNlbGVjdGlvbnMuY29uY2F0KHJlcGwuc2VsZWN0aW9ucylcbiAgICBAYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zKHNlbGVjdGlvbnMpXG4gICAgICBcbiAgYXBwbHlSZXBsYWNlbWVudHNTZWxlY3Rpb25zOiAoc2VsZWN0aW9ucykgLT5cbiAgICBpZiBzZWxlY3Rpb25zLmxlbmd0aCA+IDBcbiAgICAgIGlmIEBhbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICAgICAgQHNldE11bHRpU2VsKHNlbGVjdGlvbnMpXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRDdXJzb3JQb3Moc2VsZWN0aW9uc1swXS5zdGFydCxzZWxlY3Rpb25zWzBdLmVuZCkiLCIjIFtwYXdhXVxuIyAgIHJlcGxhY2UgJ3JlcGxhY2UoL1xcdC9nJyAncmVwbGFjZShcIlxcdFwiJ1xuXG5pbXBvcnQgeyBDbWRJbnN0YW5jZSB9IGZyb20gJy4vQ21kSW5zdGFuY2UnO1xuaW1wb3J0IHsgQm94SGVscGVyIH0gZnJvbSAnLi9Cb3hIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsQHBvcyxAc3RyKSAtPlxuICAgIHN1cGVyKClcbiAgICB1bmxlc3MgQGlzRW1wdHkoKVxuICAgICAgQF9jaGVja0Nsb3NlcigpXG4gICAgICBAb3BlbmluZyA9IEBzdHJcbiAgICAgIEBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICAgIEBfc3BsaXRDb21wb25lbnRzKClcbiAgICAgIEBfZmluZENsb3NpbmcoKVxuICAgICAgQF9jaGVja0Vsb25nYXRlZCgpXG4gIF9jaGVja0Nsb3NlcjogLT5cbiAgICBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICBpZiBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5jbG9zZUNoYXIgYW5kIGYgPSBAX2ZpbmRPcGVuaW5nUG9zKClcbiAgICAgIEBjbG9zaW5nUG9zID0gbmV3IENvZGV3YXZlLnV0aWwuU3RyUG9zKEBwb3MsIEBzdHIpXG4gICAgICBAcG9zID0gZi5wb3NcbiAgICAgIEBzdHIgPSBmLnN0clxuICBfZmluZE9wZW5pbmdQb3M6IC0+XG4gICAgY21kTmFtZSA9IEBfcmVtb3ZlQnJhY2tldChAc3RyKS5zdWJzdHJpbmcoQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpXG4gICAgb3BlbmluZyA9IEBjb2Rld2F2ZS5icmFrZXRzICsgY21kTmFtZVxuICAgIGNsb3NpbmcgPSBAc3RyXG4gICAgaWYgZiA9IEBjb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKEBwb3Msb3BlbmluZyxjbG9zaW5nLC0xKVxuICAgICAgZi5zdHIgPSBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZi5wb3MsQGNvZGV3YXZlLmZpbmROZXh0QnJha2V0KGYucG9zK2Yuc3RyLmxlbmd0aCkrQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZcbiAgX3NwbGl0Q29tcG9uZW50czogLT5cbiAgICBwYXJ0cyA9IEBub0JyYWNrZXQuc3BsaXQoXCIgXCIpO1xuICAgIEBjbWROYW1lID0gcGFydHMuc2hpZnQoKVxuICAgIEByYXdQYXJhbXMgPSBwYXJ0cy5qb2luKFwiIFwiKVxuICBfcGFyc2VQYXJhbXM6KHBhcmFtcykgLT5cbiAgICBAcGFyYW1zID0gW11cbiAgICBAbmFtZWQgPSBAZ2V0RGVmYXVsdHMoKVxuICAgIGlmIEBjbWQ/XG4gICAgICBuYW1lVG9QYXJhbSA9IEBnZXRPcHRpb24oJ25hbWVUb1BhcmFtJylcbiAgICAgIGlmIG5hbWVUb1BhcmFtPyBcbiAgICAgICAgQG5hbWVkW25hbWVUb1BhcmFtXSA9IEBjbWROYW1lXG4gICAgaWYgcGFyYW1zLmxlbmd0aFxuICAgICAgaWYgQGNtZD9cbiAgICAgICAgYWxsb3dlZE5hbWVkID0gQGdldE9wdGlvbignYWxsb3dlZE5hbWVkJykgXG4gICAgICBpblN0ciA9IGZhbHNlXG4gICAgICBwYXJhbSA9ICcnXG4gICAgICBuYW1lID0gZmFsc2VcbiAgICAgIGZvciBpIGluIFswLi4ocGFyYW1zLmxlbmd0aC0xKV1cbiAgICAgICAgY2hyID0gcGFyYW1zW2ldXG4gICAgICAgIGlmIGNociA9PSAnICcgYW5kICFpblN0clxuICAgICAgICAgIGlmKG5hbWUpXG4gICAgICAgICAgICBAbmFtZWRbbmFtZV0gPSBwYXJhbVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBwYXJhbXMucHVzaChwYXJhbSlcbiAgICAgICAgICBwYXJhbSA9ICcnXG4gICAgICAgICAgbmFtZSA9IGZhbHNlXG4gICAgICAgIGVsc2UgaWYgY2hyIGluIFsnXCInLFwiJ1wiXSBhbmQgKGkgPT0gMCBvciBwYXJhbXNbaS0xXSAhPSAnXFxcXCcpXG4gICAgICAgICAgaW5TdHIgPSAhaW5TdHJcbiAgICAgICAgZWxzZSBpZiBjaHIgPT0gJzonIGFuZCAhbmFtZSBhbmQgIWluU3RyIGFuZCAoIWFsbG93ZWROYW1lZD8gb3IgbmFtZSBpbiBhbGxvd2VkTmFtZWQpXG4gICAgICAgICAgbmFtZSA9IHBhcmFtXG4gICAgICAgICAgcGFyYW0gPSAnJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcGFyYW0gKz0gY2hyXG4gICAgICBpZiBwYXJhbS5sZW5ndGhcbiAgICAgICAgaWYobmFtZSlcbiAgICAgICAgICBAbmFtZWRbbmFtZV0gPSBwYXJhbVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHBhcmFtcy5wdXNoKHBhcmFtKVxuICBfZmluZENsb3Npbmc6IC0+XG4gICAgaWYgZiA9IEBfZmluZENsb3NpbmdQb3MoKVxuICAgICAgQGNvbnRlbnQgPSBDb2Rld2F2ZS51dGlsLnRyaW1FbXB0eUxpbmUoQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MrQHN0ci5sZW5ndGgsZi5wb3MpKVxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGYucG9zK2Yuc3RyLmxlbmd0aClcbiAgX2ZpbmRDbG9zaW5nUG9zOiAtPlxuICAgIHJldHVybiBAY2xvc2luZ1BvcyBpZiBAY2xvc2luZ1Bvcz9cbiAgICBjbG9zaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZE5hbWUgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjbWROYW1lXG4gICAgaWYgZiA9IEBjb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKEBwb3MrQHN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpXG4gICAgICByZXR1cm4gQGNsb3NpbmdQb3MgPSBmXG4gIF9jaGVja0Vsb25nYXRlZDogLT5cbiAgICBlbmRQb3MgPSBAZ2V0RW5kUG9zKClcbiAgICBtYXggPSBAY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKVxuICAgIHdoaWxlIGVuZFBvcyA8IG1heCBhbmQgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyxlbmRQb3MrQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PSBAY29kZXdhdmUuZGVjb1xuICAgICAgZW5kUG9zKz1AY29kZXdhdmUuZGVjby5sZW5ndGhcbiAgICBpZiBlbmRQb3MgPj0gbWF4IG9yIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIEBjb2Rld2F2ZS5kZWNvLmxlbmd0aCkgaW4gWycgJyxcIlxcblwiLFwiXFxyXCJdXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICBfY2hlY2tCb3g6IC0+XG4gICAgaWYgQGNvZGV3YXZlLmluSW5zdGFuY2U/IGFuZCBAY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PSAnY29tbWVudCdcbiAgICAgIHJldHVyblxuICAgIGNsID0gQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KClcbiAgICBjciA9IEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKVxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKSArIGNyLmxlbmd0aFxuICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zIC0gY2wubGVuZ3RoLEBwb3MpID09IGNsIGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLGVuZFBvcykgPT0gY3JcbiAgICAgIEBwb3MgPSBAcG9zIC0gY2wubGVuZ3RoXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICAgICAgQF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICAgIGVsc2UgaWYgQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgYW5kIEBnZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xXG4gICAgICBAaW5Cb3ggPSAxXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQ6IC0+XG4gICAgaWYgQGNvbnRlbnRcbiAgICAgIGVjbCA9IENvZGV3YXZlLnV0aWwuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdCgpKVxuICAgICAgZWNyID0gQ29kZXdhdmUudXRpbC5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRSaWdodCgpKVxuICAgICAgZWQgPSBDb2Rld2F2ZS51dGlsLmVzY2FwZVJlZ0V4cChAY29kZXdhdmUuZGVjbylcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86I3tlZH0pKyN7ZWNyfSRcIiwgXCJnbVwiKSAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAnXCJnbVwiJyByZS5NXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXHI/XFxuXCIpXG4gICAgICByZTMgPSBuZXcgUmVnRXhwKFwiXFxuXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzKiRcIilcbiAgICAgIEBjb250ZW50ID0gQGNvbnRlbnQucmVwbGFjZShyZTEsJyQxJykucmVwbGFjZShyZTIsJycpLnJlcGxhY2UocmUzLCcnKVxuICBfZ2V0UGFyZW50Q21kczogLT5cbiAgICBAcGFyZW50ID0gQGNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZChAZ2V0RW5kUG9zKCkpPy5pbml0KClcbiAgc2V0TXVsdGlQb3M6IChtdWx0aVBvcykgLT5cbiAgICBAbXVsdGlQb3MgPSBtdWx0aVBvc1xuICBfZ2V0Q21kT2JqOiAtPlxuICAgIEBnZXRDbWQoKVxuICAgIEBfY2hlY2tCb3goKVxuICAgIEBjb250ZW50ID0gQHJlbW92ZUluZGVudEZyb21Db250ZW50KEBjb250ZW50KVxuICAgIHN1cGVyKClcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQF9wYXJzZVBhcmFtcyhAcmF3UGFyYW1zKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHJldHVybiBAY29udGV4dCBvciBAY29kZXdhdmUuY29udGV4dFxuICBnZXRDbWQ6IC0+XG4gICAgdW5sZXNzIEBjbWQ/XG4gICAgICBAX2dldFBhcmVudENtZHMoKVxuICAgICAgaWYgQG5vQnJhY2tldC5zdWJzdHJpbmcoMCxAY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyXG4gICAgICAgIEBjbWQgPSBDb2Rld2F2ZS5Db21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKVxuICAgICAgICBAY29udGV4dCA9IEBjb2Rld2F2ZS5jb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIEBmaW5kZXIgPSBAZ2V0RmluZGVyKEBjbWROYW1lKVxuICAgICAgICBAY29udGV4dCA9IEBmaW5kZXIuY29udGV4dFxuICAgICAgICBAY21kID0gQGZpbmRlci5maW5kKClcbiAgICAgICAgaWYgQGNtZD9cbiAgICAgICAgICBAY29udGV4dC5hZGROYW1lU3BhY2UoQGNtZC5mdWxsTmFtZSlcbiAgICByZXR1cm4gQGNtZFxuICBnZXRGaW5kZXI6IChjbWROYW1lKS0+XG4gICAgZmluZGVyID0gQGNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsQF9nZXRQYXJlbnROYW1lc3BhY2VzKCkpXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgX2dldFBhcmVudE5hbWVzcGFjZXM6IC0+XG4gICAgbnNwY3MgPSBbXVxuICAgIG9iaiA9IHRoaXNcbiAgICB3aGlsZSBvYmoucGFyZW50P1xuICAgICAgb2JqID0gb2JqLnBhcmVudFxuICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKSBpZiBvYmouY21kPyBhbmQgb2JqLmNtZC5mdWxsTmFtZT9cbiAgICByZXR1cm4gbnNwY3NcbiAgX3JlbW92ZUJyYWNrZXQ6IChzdHIpLT5cbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyhAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgsc3RyLmxlbmd0aC1AY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBbbnNwYywgY21kTmFtZV0gPSBDb2Rld2F2ZS51dGlsLnNwbGl0TmFtZXNwYWNlKEBjbWROYW1lKVxuICAgIHJldHVybiBhbGlhc09mLnJlcGxhY2UoJyVuYW1lJScsY21kTmFtZSlcbiAgaXNFbXB0eTogLT5cbiAgICByZXR1cm4gQHN0ciA9PSBAY29kZXdhdmUuYnJha2V0cyArIEBjb2Rld2F2ZS5jbG9zZUNoYXIgKyBAY29kZXdhdmUuYnJha2V0cyBvciBAc3RyID09IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmJyYWtldHNcbiAgZXhlY3V0ZTogLT5cbiAgICBpZiBAaXNFbXB0eSgpXG4gICAgICBpZiBAY29kZXdhdmUuY2xvc2luZ1Byb21wPyBhbmQgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcC53aGl0aGluT3BlbkJvdW5kcyhAcG9zICsgQGNvZGV3YXZlLmJyYWtldHMubGVuZ3RoKT9cbiAgICAgICAgQGNvZGV3YXZlLmNsb3NpbmdQcm9tcC5jYW5jZWwoKVxuICAgICAgZWxzZVxuICAgICAgICBAcmVwbGFjZVdpdGgoJycpXG4gICAgZWxzZSBpZiBAY21kP1xuICAgICAgaWYgYmVmb3JlRnVuY3QgPSBAZ2V0T3B0aW9uKCdiZWZvcmVFeGVjdXRlJylcbiAgICAgICAgYmVmb3JlRnVuY3QodGhpcylcbiAgICAgIGlmIEByZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICAgIGlmIChyZXMgPSBAcmVzdWx0KCkpP1xuICAgICAgICAgIEByZXBsYWNlV2l0aChyZXMpXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gQHJ1bkV4ZWN1dGVGdW5jdCgpXG4gIGdldEVuZFBvczogLT5cbiAgICByZXR1cm4gQHBvcytAc3RyLmxlbmd0aFxuICBnZXRQb3M6IC0+XG4gICAgcmV0dXJuIG5ldyBDb2Rld2F2ZS51dGlsLlBvcyhAcG9zLEBwb3MrQHN0ci5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0T3BlbmluZ1BvczogLT5cbiAgICByZXR1cm4gbmV3IENvZGV3YXZlLnV0aWwuUG9zKEBwb3MsQHBvcytAb3BlbmluZy5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0SW5kZW50OiAtPlxuICAgIHVubGVzcyBAaW5kZW50TGVuP1xuICAgICAgaWYgQGluQm94P1xuICAgICAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgICAgICBAaW5kZW50TGVuID0gaGVscGVyLnJlbW92ZUNvbW1lbnQoQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpKS5sZW5ndGhcbiAgICAgIGVsc2VcbiAgICAgICAgQGluZGVudExlbiA9IEBwb3MgLSBAZ2V0UG9zKCkucHJldkVPTCgpXG4gICAgcmV0dXJuIEBpbmRlbnRMZW5cbiAgcmVtb3ZlSW5kZW50RnJvbUNvbnRlbnQ6ICh0ZXh0KSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZWcgPSBuZXcgUmVnRXhwKCdeXFxcXHN7JytAZ2V0SW5kZW50KCkrJ30nLCdnbScpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZywnJylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBhbHRlclJlc3VsdEZvckJveDogKHJlcGwpIC0+XG4gICAgb3JpZ2luYWwgPSByZXBsLmNvcHkoKVxuICAgIGhlbHBlciA9IG5ldyBCb3hIZWxwZXIoQGNvbnRleHQpXG4gICAgaGVscGVyLmdldE9wdEZyb21MaW5lKG9yaWdpbmFsLnRleHRXaXRoRnVsbExpbmVzKCksZmFsc2UpXG4gICAgaWYgQGdldE9wdGlvbigncmVwbGFjZUJveCcpXG4gICAgICBib3ggPSBoZWxwZXIuZ2V0Qm94Rm9yUG9zKG9yaWdpbmFsKVxuICAgICAgW3JlcGwuc3RhcnQsIHJlcGwuZW5kXSA9IFtib3guc3RhcnQsIGJveC5lbmRdXG4gICAgICBAaW5kZW50TGVuID0gaGVscGVyLmluZGVudFxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICBlbHNlXG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgICAgcmVwbC5zdGFydCA9IG9yaWdpbmFsLnByZXZFT0woKVxuICAgICAgcmVwbC5lbmQgPSBvcmlnaW5hbC5uZXh0RU9MKClcbiAgICAgIHJlcyA9IGhlbHBlci5yZWZvcm1hdExpbmVzKG9yaWdpbmFsLnNhbWVMaW5lc1ByZWZpeCgpICsgQGNvZGV3YXZlLm1hcmtlciArIHJlcGwudGV4dCArIEBjb2Rld2F2ZS5tYXJrZXIgKyBvcmlnaW5hbC5zYW1lTGluZXNTdWZmaXgoKSwge211bHRpbGluZTpmYWxzZX0pXG4gICAgICBbcmVwbC5wcmVmaXgscmVwbC50ZXh0LHJlcGwuc3VmZml4XSA9IHJlcy5zcGxpdChAY29kZXdhdmUubWFya2VyKVxuICAgIHJldHVybiByZXBsXG4gIGdldEN1cnNvckZyb21SZXN1bHQ6IChyZXBsKSAtPlxuICAgIGN1cnNvclBvcyA9IHJlcGwucmVzUG9zQmVmb3JlUHJlZml4KClcbiAgICBpZiBAY21kPyBhbmQgQGNvZGV3YXZlLmNoZWNrQ2FycmV0IGFuZCBAZ2V0T3B0aW9uKCdjaGVja0NhcnJldCcpXG4gICAgICBpZiAocCA9IEBjb2Rld2F2ZS5nZXRDYXJyZXRQb3MocmVwbC50ZXh0KSk/IFxuICAgICAgICBjdXJzb3JQb3MgPSByZXBsLnN0YXJ0K3JlcGwucHJlZml4Lmxlbmd0aCtwXG4gICAgICByZXBsLnRleHQgPSBAY29kZXdhdmUucmVtb3ZlQ2FycmV0KHJlcGwudGV4dClcbiAgICByZXR1cm4gY3Vyc29yUG9zXG4gIGNoZWNrTXVsdGk6IChyZXBsKSAtPlxuICAgIGlmIEBtdWx0aVBvcz8gYW5kIEBtdWx0aVBvcy5sZW5ndGggPiAxXG4gICAgICByZXBsYWNlbWVudHMgPSBbcmVwbF1cbiAgICAgIG9yaWdpbmFsVGV4dCA9IHJlcGwub3JpZ2luYWxUZXh0KClcbiAgICAgIGZvciBwb3MsIGkgaW4gQG11bHRpUG9zXG4gICAgICAgIGlmIGkgPT0gMFxuICAgICAgICAgIG9yaWdpbmFsUG9zID0gcG9zLnN0YXJ0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBuZXdSZXBsID0gcmVwbC5jb3B5KCkuYXBwbHlPZmZzZXQocG9zLnN0YXJ0LW9yaWdpbmFsUG9zKVxuICAgICAgICAgIGlmIG5ld1JlcGwub3JpZ2luYWxUZXh0KCkgPT0gb3JpZ2luYWxUZXh0XG4gICAgICAgICAgICByZXBsYWNlbWVudHMucHVzaChuZXdSZXBsKVxuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50c1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBbcmVwbF1cbiAgcmVwbGFjZVdpdGg6ICh0ZXh0KSAtPlxuICAgIEBhcHBseVJlcGxhY2VtZW50KG5ldyBDb2Rld2F2ZS51dGlsLlJlcGxhY2VtZW50KEBwb3MsQGdldEVuZFBvcygpLHRleHQpKVxuICBhcHBseVJlcGxhY2VtZW50OiAocmVwbCkgLT5cbiAgICByZXBsLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgICBpZiBAaW5Cb3g/XG4gICAgICBAYWx0ZXJSZXN1bHRGb3JCb3gocmVwbClcbiAgICBlbHNlXG4gICAgICByZXBsLnRleHQgPSBAYXBwbHlJbmRlbnQocmVwbC50ZXh0KVxuICAgIGN1cnNvclBvcyA9IEBnZXRDdXJzb3JGcm9tUmVzdWx0KHJlcGwpXG4gICAgcmVwbC5zZWxlY3Rpb25zID0gW25ldyBDb2Rld2F2ZS51dGlsLlBvcyhjdXJzb3JQb3MsIGN1cnNvclBvcyldXG4gICAgcmVwbGFjZW1lbnRzID0gQGNoZWNrTXVsdGkocmVwbClcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgICBcbiAgICBAcmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydFxuICAgIEByZXBsYWNlRW5kID0gcmVwbC5yZXNFbmQoKSIsImV4cG9ydCBjbGFzcyBQcm9jZXNzXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICMiLCJcbmV4cG9ydCBjbGFzcyBTdG9yYWdlXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShAZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKVxuICBsb2FkOiAoa2V5KSAtPlxuICAgIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oQGZ1bGxLZXkoa2V5KSkpXG4gIGZ1bGxLZXk6IChrZXkpIC0+XG4gICAgJ0NvZGVXYXZlXycra2V5IiwiZXhwb3J0IGNsYXNzIERvbUtleUxpc3RlbmVyXG4gIHN0YXJ0TGlzdGVuaW5nOiAodGFyZ2V0KSAtPlxuICBcbiAgICB0aW1lb3V0ID0gbnVsbFxuICAgIFxuICAgIG9ua2V5ZG93biA9IChlKSA9PiBcbiAgICAgIGlmIChDb2Rld2F2ZS5pbnN0YW5jZXMubGVuZ3RoIDwgMiBvciBAb2JqID09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIGFuZCBlLmtleUNvZGUgPT0gNjkgJiYgZS5jdHJsS2V5XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBpZiBAb25BY3RpdmF0aW9uS2V5P1xuICAgICAgICAgIEBvbkFjdGl2YXRpb25LZXkoKVxuICAgIG9ua2V5dXAgPSAoZSkgPT4gXG4gICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgIG9ua2V5cHJlc3MgPSAoZSkgPT4gXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCkgaWYgdGltZW91dD9cbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0ICg9PlxuICAgICAgICBpZiBAb25BbnlDaGFuZ2U/XG4gICAgICAgICAgQG9uQW55Q2hhbmdlKGUpXG4gICAgICApLCAxMDBcbiAgICAgICAgICAgIFxuICAgIGlmIHRhcmdldC5hZGRFdmVudExpc3RlbmVyXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuICAgIGVsc2UgaWYgdGFyZ2V0LmF0dGFjaEV2ZW50XG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBvbmtleWRvd24pXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5dXBcIiwgb25rZXl1cClcbiAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KFwib25rZXlwcmVzc1wiLCBvbmtleXByZXNzKVxuXG5pc0VsZW1lbnQgPSAob2JqKSAtPlxuICB0cnlcbiAgICAjIFVzaW5nIFczIERPTTIgKHdvcmtzIGZvciBGRiwgT3BlcmEgYW5kIENocm9tKVxuICAgIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gIGNhdGNoIGVcbiAgICAjIEJyb3dzZXJzIG5vdCBzdXBwb3J0aW5nIFczIERPTTIgZG9uJ3QgaGF2ZSBIVE1MRWxlbWVudCBhbmRcbiAgICAjIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gYW5kIHdlIGVuZCB1cCBoZXJlLiBUZXN0aW5nIHNvbWVcbiAgICAjIHByb3BlcnRpZXMgdGhhdCBhbGwgZWxlbWVudHMgaGF2ZS4gKHdvcmtzIG9uIElFNylcbiAgICByZXR1cm4gKHR5cGVvZiBvYmo9PVwib2JqZWN0XCIpICYmXG4gICAgICAob2JqLm5vZGVUeXBlPT0xKSAmJiAodHlwZW9mIG9iai5zdHlsZSA9PSBcIm9iamVjdFwiKSAmJlxuICAgICAgKHR5cGVvZiBvYmoub3duZXJEb2N1bWVudCA9PVwib2JqZWN0XCIpXG5cbiAgICAgICAgXG5leHBvcnQgY2xhc3MgVGV4dEFyZWFFZGl0b3IgZXh0ZW5kcyBUZXh0UGFyc2VyXG4gIGNvbnN0cnVjdG9yOiAoQHRhcmdldCkgLT5cbiAgICBzdXBlcigpXG4gICAgIyBDb2Rld2F2ZS5sb2dnZXIudG9Nb25pdG9yKHRoaXMsJ3RleHRFdmVudENoYW5nZScpXG4gICAgQG9iaiA9IGlmIGlzRWxlbWVudChAdGFyZ2V0KSB0aGVuIEB0YXJnZXQgZWxzZSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChAdGFyZ2V0KVxuICAgIHVubGVzcyBAb2JqP1xuICAgICAgdGhyb3cgXCJUZXh0QXJlYSBub3QgZm91bmRcIlxuICAgIEBuYW1lc3BhY2UgPSAndGV4dGFyZWEnXG4gICAgQGNoYW5nZUxpc3RlbmVycyA9IFtdXG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgPSAwXG4gIHN0YXJ0TGlzdGVuaW5nOiBEb21LZXlMaXN0ZW5lci5wcm90b3R5cGUuc3RhcnRMaXN0ZW5pbmdcbiAgb25BbnlDaGFuZ2U6IChlKSAtPlxuICAgIGlmIEBfc2tpcENoYW5nZUV2ZW50IDw9IDBcbiAgICAgIGZvciBjYWxsYmFjayBpbiBAY2hhbmdlTGlzdGVuZXJzXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICBlbHNlXG4gICAgICBAX3NraXBDaGFuZ2VFdmVudC0tXG4gICAgICBAb25Ta2lwZWRDaGFuZ2UoKSBpZiBAb25Ta2lwZWRDaGFuZ2U/XG4gIHNraXBDaGFuZ2VFdmVudDogKG5iID0gMSkgLT5cbiAgICBAX3NraXBDaGFuZ2VFdmVudCArPSBuYlxuICBiaW5kZWRUbzogKGNvZGV3YXZlKSAtPlxuICAgIEBvbkFjdGl2YXRpb25LZXkgPSAtPiBjb2Rld2F2ZS5vbkFjdGl2YXRpb25LZXkoKVxuICAgIEBzdGFydExpc3RlbmluZyhkb2N1bWVudClcbiAgc2VsZWN0aW9uUHJvcEV4aXN0czogLT5cbiAgICBcInNlbGVjdGlvblN0YXJ0XCIgb2YgQG9ialxuICBoYXNGb2N1czogLT4gXG4gICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpcyBAb2JqXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgaWYgdmFsP1xuICAgICAgdW5sZXNzIEB0ZXh0RXZlbnRDaGFuZ2UodmFsKVxuICAgICAgICBAb2JqLnZhbHVlID0gdmFsXG4gICAgQG9iai52YWx1ZVxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICBAdGV4dEV2ZW50Q2hhbmdlKHRleHQsIHN0YXJ0LCBlbmQpIG9yIHN1cGVyKHN0YXJ0LCBlbmQsIHRleHQpXG4gIHRleHRFdmVudENoYW5nZTogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUZXh0RXZlbnQnKSBpZiBkb2N1bWVudC5jcmVhdGVFdmVudD9cbiAgICBpZiBldmVudD8gYW5kIGV2ZW50LmluaXRUZXh0RXZlbnQ/XG4gICAgICBlbmQgPSBAdGV4dExlbigpIHVubGVzcyBlbmQ/XG4gICAgICBpZiB0ZXh0Lmxlbmd0aCA8IDFcbiAgICAgICAgaWYgc3RhcnQgIT0gMFxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihzdGFydC0xLHN0YXJ0KVxuICAgICAgICAgIHN0YXJ0LS1cbiAgICAgICAgZWxzZSBpZiBlbmQgIT0gQHRleHRMZW4oKVxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihlbmQsZW5kKzEpXG4gICAgICAgICAgZW5kKytcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSlcbiAgICAgICMgQHNldEN1cnNvclBvcyhzdGFydCxlbmQpXG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBAb2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgICBAc2tpcENoYW5nZUV2ZW50KClcbiAgICAgIHRydWVcbiAgICBlbHNlIFxuICAgICAgZmFsc2VcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdG1wQ3Vyc29yUG9zIGlmIEB0bXBDdXJzb3JQb3M/XG4gICAgaWYgQGhhc0ZvY3VzXG4gICAgICBpZiBAc2VsZWN0aW9uUHJvcEV4aXN0c1xuICAgICAgICBuZXcgQ29kZXdhdmUudXRpbC5Qb3MoQG9iai5zZWxlY3Rpb25TdGFydCxAb2JqLnNlbGVjdGlvbkVuZClcbiAgICAgIGVsc2VcbiAgICAgICAgQGdldEN1cnNvclBvc0ZhbGxiYWNrKClcbiAgZ2V0Q3Vyc29yUG9zRmFsbGJhY2s6IC0+XG4gICAgaWYgQG9iai5jcmVhdGVUZXh0UmFuZ2VcbiAgICAgIHNlbCA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpXG4gICAgICBpZiBzZWwucGFyZW50RWxlbWVudCgpIGlzIEBvYmpcbiAgICAgICAgcm5nID0gQG9iai5jcmVhdGVUZXh0UmFuZ2UoKVxuICAgICAgICBybmcubW92ZVRvQm9va21hcmsgc2VsLmdldEJvb2ttYXJrKClcbiAgICAgICAgbGVuID0gMFxuXG4gICAgICAgIHdoaWxlIHJuZy5jb21wYXJlRW5kUG9pbnRzKFwiRW5kVG9TdGFydFwiLCBybmcpID4gMFxuICAgICAgICAgIGxlbisrXG4gICAgICAgICAgcm5nLm1vdmVFbmQoXCJjaGFyYWN0ZXJcIiwgLTEpXG4gICAgICAgIHJuZy5zZXRFbmRQb2ludCBcIlN0YXJ0VG9TdGFydFwiLCBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHBvcyA9IG5ldyBDb2Rld2F2ZS51dGlsLlBvcygwLGxlbilcbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgcG9zLnN0YXJ0KytcbiAgICAgICAgICBwb3MuZW5kKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcmV0dXJuIHBvc1xuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kKSAtPlxuICAgIGVuZCA9IHN0YXJ0IGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgIEB0bXBDdXJzb3JQb3MgPSBuZXcgQ29kZXdhdmUudXRpbC5Qb3Moc3RhcnQsZW5kKVxuICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgc2V0VGltZW91dCAoPT5cbiAgICAgICAgQHRtcEN1cnNvclBvcyA9IG51bGxcbiAgICAgICAgQG9iai5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0XG4gICAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICApLCAxXG4gICAgZWxzZSBcbiAgICAgIEBzZXRDdXJzb3JQb3NGYWxsYmFjayhzdGFydCwgZW5kKVxuICAgIHJldHVyblxuICBzZXRDdXJzb3JQb3NGYWxsYmFjazogKHN0YXJ0LCBlbmQpIC0+XG4gICAgaWYgQG9iai5jcmVhdGVUZXh0UmFuZ2VcbiAgICAgIHJuZyA9IEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgIHJuZy5tb3ZlU3RhcnQgXCJjaGFyYWN0ZXJcIiwgc3RhcnRcbiAgICAgIHJuZy5jb2xsYXBzZSgpXG4gICAgICBybmcubW92ZUVuZCBcImNoYXJhY3RlclwiLCBlbmQgLSBzdGFydFxuICAgICAgcm5nLnNlbGVjdCgpXG4gIGdldExhbmc6IC0+XG4gICAgcmV0dXJuIEBfbGFuZyBpZiBAX2xhbmdcbiAgICBAb2JqLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJykgaWYgQG9iai5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpXG4gIHNldExhbmc6ICh2YWwpIC0+XG4gICAgQF9sYW5nID0gdmFsXG4gICAgQG9iai5zZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycsdmFsKVxuICBjYW5MaXN0ZW5Ub0NoYW5nZTogLT5cbiAgICByZXR1cm4gdHJ1ZVxuICBhZGRDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIEBjaGFuZ2VMaXN0ZW5lcnMucHVzaChjYWxsYmFjaylcbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBpZiAoaSA9IEBjaGFuZ2VMaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaykpID4gLTFcbiAgICAgIEBjaGFuZ2VMaXN0ZW5lcnMuc3BsaWNlKGksIDEpXG4gICAgICBcbiAgICAgIFxuICBhcHBseVJlcGxhY2VtZW50czogKHJlcGxhY2VtZW50cykgLT5cbiAgICBpZiByZXBsYWNlbWVudHMubGVuZ3RoID4gMCBhbmQgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMubGVuZ3RoIDwgMVxuICAgICAgcmVwbGFjZW1lbnRzWzBdLnNlbGVjdGlvbnMgPSBbQGdldEN1cnNvclBvcygpXVxuICAgIHN1cGVyKHJlcGxhY2VtZW50cyk7XG4gICAgICAiLCIjIFtwYXdhIHB5dGhvbl1cbiMgICByZXBsYWNlIChFZGl0b3IpIChlZGl0b3IuRWRpdG9yKVxuIyAgIHJlcGxhY2UgQHRleHQoKSAgc2VsZi50ZXh0XG5cbmltcG9ydCB7IEVkaXRvciB9IGZyb20gJy4vRWRpdG9yJztcblxuZXhwb3J0IGNsYXNzIFRleHRQYXJzZXIgZXh0ZW5kcyBFZGl0b3JcbiAgY29uc3RydWN0b3I6IChAX3RleHQpIC0+XG4gICAgc3VwZXIoKVxuICAgIHNlbGYubmFtZXNwYWNlID0gJ3RleHRfcGFyc2VyJ1xuICB0ZXh0OiAodmFsKSAtPlxuICAgIEBfdGV4dCA9IHZhbCBpZiB2YWw/XG4gICAgQF90ZXh0XG4gIHRleHRDaGFyQXQ6IChwb3MpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KClbcG9zXVxuICB0ZXh0TGVuOiAocG9zKSAtPlxuICAgIHJldHVybiBAdGV4dCgpLmxlbmd0aFxuICB0ZXh0U3Vic3RyOiAoc3RhcnQsIGVuZCkgLT5cbiAgICByZXR1cm4gQHRleHQoKS5zdWJzdHJpbmcoc3RhcnQsIGVuZClcbiAgaW5zZXJ0VGV4dEF0OiAodGV4dCwgcG9zKSAtPlxuICAgIEB0ZXh0KEB0ZXh0KCkuc3Vic3RyaW5nKDAsIHBvcykrdGV4dCtAdGV4dCgpLnN1YnN0cmluZyhwb3MsQHRleHQoKS5sZW5ndGgpKVxuICBzcGxpY2VUZXh0OiAoc3RhcnQsIGVuZCwgdGV4dCkgLT5cbiAgICBAdGV4dChAdGV4dCgpLnNsaWNlKDAsIHN0YXJ0KSArICh0ZXh0IHx8IFwiXCIpICsgQHRleHQoKS5zbGljZShlbmQpKVxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgcmV0dXJuIEB0YXJnZXRcbiAgc2V0Q3Vyc29yUG9zOiAoc3RhcnQsIGVuZCkgLT5cbiAgICBlbmQgPSBzdGFydCBpZiBhcmd1bWVudHMubGVuZ3RoIDwgMlxuICAgIEB0YXJnZXQgPSAoXG4gICAgICAgIHN0YXJ0OiBzdGFydFxuICAgICAgICBlbmQ6IGVuZFxuICAgICAgKSIsImltcG9ydCB7IENvZGV3YXZlIH0gZnJvbSAnLi9Db2Rld2F2ZSc7XG5pbXBvcnQgeyBUZXh0QXJlYUVkaXRvciB9IGZyb20gJy4vVGV4dEFyZWFFZGl0b3InO1xuXG5Db2Rld2F2ZS5pbnN0YW5jZXMgPSBbXVxuQ29kZXdhdmUuZGV0ZWN0ID0gKHRhcmdldCkgLT5cbiAgY3cgPSBuZXcgQ29kZXdhdmUobmV3IENvZGV3YXZlLlRleHRBcmVhRWRpdG9yKHRhcmdldCkpXG4gIENvZGV3YXZlLmluc3RhbmNlcy5wdXNoKGN3KVxuICBjd1xuICAiXX0=
