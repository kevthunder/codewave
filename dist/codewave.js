(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoxHelper = void 0;

var _StringHelper = require("./helpers/StringHelper");

var _ArrayHelper = require("./helpers/ArrayHelper");

var _Pair = require("./positioning/Pair");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{"./helpers/ArrayHelper":16,"./helpers/StringHelper":19,"./positioning/Pair":20}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CmdFinder = void 0;

var _Context = require("./Context");

var _NamespaceHelper = require("./helpers/NamespaceHelper");

var _Command = require("./Command");

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

        var _NamespaceHelper$spli = _NamespaceHelper.NamespaceHelper.splitFirst(name);

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

      var _NamespaceHelper$spli3 = _NamespaceHelper.NamespaceHelper.splitFirst(namespace, true);

      var _NamespaceHelper$spli4 = _slicedToArray(_NamespaceHelper$spli3, 2);

      space = _NamespaceHelper$spli4[0];
      rest = _NamespaceHelper$spli4[1];
      return this.names.map(function (name) {
        var cur_rest, cur_space;

        var _NamespaceHelper$spli5 = _NamespaceHelper.NamespaceHelper.splitFirst(name);

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

        var _NamespaceHelper$spli7 = _NamespaceHelper.NamespaceHelper.splitFirst(nspc, true);

        var _NamespaceHelper$spli8 = _slicedToArray(_NamespaceHelper$spli7, 2);

        nspcName = _NamespaceHelper$spli8[0];
        rest = _NamespaceHelper$spli8[1];
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

},{"./Command":5,"./Context":6,"./helpers/NamespaceHelper":18}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CmdInstance = void 0;

var _Context = require("./Context");

var _Codewave = require("./Codewave");

var _TextParser = require("./TextParser");

var _StringHelper = require("./helpers/StringHelper");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{"./Codewave":4,"./Context":6,"./TextParser":14,"./helpers/StringHelper":19}],4:[function(require,module,exports){
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

var _PosCollection = require("./positioning/PosCollection");

var _StringHelper = require("./helpers/StringHelper");

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

},{"./Command":5,"./Context":6,"./Logger":8,"./PositionedCmdInstance":10,"./Process":11,"./TextParser":14,"./helpers/StringHelper":19,"./positioning/PosCollection":22}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseCommand = exports.Command = void 0;

var _Context = require("./Context");

var _Storage = require("./Storage");

var _NamespaceHelper = require("./helpers/NamespaceHelper");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
        var cmd, j, len, name, ref, space;
        this.init();

        var _NamespaceHelper$spli = _NamespaceHelper.NamespaceHelper.splitFirst(fullname);

        var _NamespaceHelper$spli2 = _slicedToArray(_NamespaceHelper$spli, 2);

        space = _NamespaceHelper$spli2[0];
        name = _NamespaceHelper$spli2[1];

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

        var _NamespaceHelper$spli3 = _NamespaceHelper.NamespaceHelper.splitFirst(fullname);

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
        Command.cmds.setCmdData(fullname, data);
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
            results.push(Command.cmds.setCmdData(fullname, data));
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

},{"./Context":6,"./Storage":12,"./helpers/NamespaceHelper":18}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Context = void 0;

var _CmdFinder = require("./CmdFinder");

var _CmdInstance = require("./CmdInstance");

var _ArrayHelper = require("./helpers/ArrayHelper");

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

},{"./CmdFinder":2,"./CmdInstance":3,"./helpers/ArrayHelper":16}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = void 0;

var _Pos = require("./positioning/Pos");

var _StrPos = require("./positioning/StrPos");

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

},{"./positioning/Pos":21,"./positioning/StrPos":24}],8:[function(require,module,exports){
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
exports.OptionObject = void 0;

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

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PositionedCmdInstance = void 0;

var _CmdInstance2 = require("./CmdInstance");

var _BoxHelper = require("./BoxHelper");

var _Pos = require("./positioning/Pos");

var _StrPos = require("./positioning/StrPos");

var _Replacement = require("./positioning/Replacement");

var _StringHelper = require("./helpers/StringHelper");

var _NamespaceHelper = require("./helpers/NamespaceHelper");

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

      var _NamespaceHelper$spli = _NamespaceHelper.NamespaceHelper.split(this.cmdName);

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
      this.codewave.editor.applyReplacements(replacements);
      this.replaceStart = repl.start;
      return this.replaceEnd = repl.resEnd();
    }
  }]);

  return PositionedCmdInstance;
}(_CmdInstance2.CmdInstance);

exports.PositionedCmdInstance = PositionedCmdInstance;

},{"./BoxHelper":1,"./CmdInstance":3,"./helpers/NamespaceHelper":18,"./helpers/StringHelper":19,"./positioning/Pos":21,"./positioning/Replacement":23,"./positioning/StrPos":24}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextAreaEditor = exports.DomKeyListener = void 0;

var _TextParser2 = require("./TextParser");

var _Pos = require("./positioning/Pos");

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
  }(_TextParser2.TextParser);

  ;
  TextAreaEditor.prototype.startListening = DomKeyListener.prototype.startListening;
  return TextAreaEditor;
}.call(void 0);

exports.TextAreaEditor = TextAreaEditor;

},{"./TextParser":14,"./positioning/Pos":21}],14:[function(require,module,exports){
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

},{"./Editor":7}],15:[function(require,module,exports){
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

},{"./Codewave":4,"./TextAreaEditor":13}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrayHelper = void 0;

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

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommonHelper = void 0;

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

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NamespaceHelper = void 0;

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

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringHelper = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

      return new Size(w, lines.length - 1);
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

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pair = void 0;

var _Pos = require("./Pos");

var _StringHelper = require("../helpers/StringHelper");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{"../helpers/StringHelper":19,"./Pos":21}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pos = void 0;

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
      var WrappedPos;
      WrappedPos = require('./WrappedPos');
      return new WrappedPos(this.start - prefix.length, this.start, this.end, this.end + suffix.length);
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

},{"./WrappedPos":25}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PosCollection = void 0;

var _Wrapping = require("./Wrapping");

var _Replacement = require("./Replacement");

var _CommonHelper = require("../helpers/CommonHelper");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{"../helpers/CommonHelper":17,"./Replacement":23,"./Wrapping":26}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Replacement = void 0;

var _Pos2 = require("./Pos");

var _CommonHelper = require("../helpers/CommonHelper");

var _OptionObject = require("../OptionObject");

var _StringHelper = require("../helpers/StringHelper");

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
        this.selections = [new _Pos2.Pos(this.prefix.length + this.start, this.prefix.length + this.start + this.text.length)];
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
          this.selections.push(new _Pos2.Pos(start + pos, start + pos));
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
  }(_Pos2.Pos);

  ;

  _CommonHelper.CommonHelper.applyMixins(Replacement.prototype, [_OptionObject.OptionObject]);

  return Replacement;
}.call(void 0);

exports.Replacement = Replacement;

},{"../OptionObject":9,"../helpers/CommonHelper":17,"../helpers/StringHelper":19,"./Pos":21}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StrPos = void 0;

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

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WrappedPos = void 0;

var _Pos2 = require("./Pos");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
}(_Pos2.Pos);

exports.WrappedPos = WrappedPos;

},{"./Pos":21}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapping = void 0;

var _Replacement2 = require("./Replacement");

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
}(_Replacement2.Replacement);

exports.Wrapping = Wrapping;

},{"./Replacement":23}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQm94SGVscGVyLmNvZmZlZSIsImxpYi9DbWRGaW5kZXIuY29mZmVlIiwibGliL0NtZEluc3RhbmNlLmNvZmZlZSIsImxpYi9Db2Rld2F2ZS5jb2ZmZWUiLCJsaWIvQ29tbWFuZC5jb2ZmZWUiLCJsaWIvQ29udGV4dC5jb2ZmZWUiLCJsaWIvRWRpdG9yLmNvZmZlZSIsImxpYi9Mb2dnZXIuY29mZmVlIiwibGliL09wdGlvbk9iamVjdC5jb2ZmZWUiLCJsaWIvUG9zaXRpb25lZENtZEluc3RhbmNlLmNvZmZlZSIsImxpYi9Qcm9jZXNzLmNvZmZlZSIsImxpYi9TdG9yYWdlLmNvZmZlZSIsImxpYi9UZXh0QXJlYUVkaXRvci5jb2ZmZWUiLCJsaWIvVGV4dFBhcnNlci5jb2ZmZWUiLCJsaWIvZW50cnkuY29mZmVlIiwibGliL2hlbHBlcnMvaGVscGVycy9BcnJheUhlbHBlci5jb2ZmZWUiLCJsaWIvaGVscGVycy9oZWxwZXJzL0NvbW1vbkhlbHBlci5jb2ZmZWUiLCJsaWIvaGVscGVycy9oZWxwZXJzL05hbWVzcGFjZUhlbHBlci5jb2ZmZWUiLCJsaWIvaGVscGVycy9oZWxwZXJzL1N0cmluZ0hlbHBlci5jb2ZmZWUiLCJsaWIvcG9zaXRpb25pbmcvcG9zaXRpb25pbmcvUGFpci5jb2ZmZWUiLCJsaWIvcG9zaXRpb25pbmcvcG9zaXRpb25pbmcvUG9zLmNvZmZlZSIsImxpYi9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy9Qb3NDb2xsZWN0aW9uLmNvZmZlZSIsImxpYi9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy9SZXBsYWNlbWVudC5jb2ZmZWUiLCJsaWIvcG9zaXRpb25pbmcvcG9zaXRpb25pbmcvU3RyUG9zLmNvZmZlZSIsImxpYi9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy9XcmFwcGVkUG9zLmNvZmZlZSIsImxpYi9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy9XcmFwcGluZy5jb2Zm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dGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIjIFtwYXdhXVxuIyAgIHJlcGxhY2UgJ3JlcGxhY2UoL1xcci9nJyBcInJlcGxhY2UoJ1xccidcIlxuXG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcbmltcG9ydCB7IFBhaXIgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1BhaXInO1xuXG5leHBvcnQgY2xhc3MgQm94SGVscGVyXG4gIGNvbnN0cnVjdG9yOiAoQGNvbnRleHQsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBAZGVmYXVsdHMgPSB7XG4gICAgICBkZWNvOiBAY29udGV4dC5jb2Rld2F2ZS5kZWNvXG4gICAgICBwYWQ6IDJcbiAgICAgIHdpZHRoOiA1MFxuICAgICAgaGVpZ2h0OiAzXG4gICAgICBvcGVuVGV4dDogJydcbiAgICAgIGNsb3NlVGV4dDogJydcbiAgICAgIHByZWZpeDogJydcbiAgICAgIHN1ZmZpeDogJydcbiAgICAgIGluZGVudDogMFxuICAgIH1cbiAgICBmb3Iga2V5LCB2YWwgb2YgQGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gIGNsb25lOiAodGV4dCkgLT5cbiAgICBvcHQgPSB7fVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIG9wdFtrZXldID0gdGhpc1trZXldXG4gICAgcmV0dXJuIG5ldyBCb3hIZWxwZXIoQGNvbnRleHQsb3B0KVxuICBkcmF3OiAodGV4dCkgLT5cbiAgICByZXR1cm4gQHN0YXJ0U2VwKCkgKyBcIlxcblwiICsgQGxpbmVzKHRleHQpICsgXCJcXG5cIisgQGVuZFNlcCgpXG4gIHdyYXBDb21tZW50OiAoc3RyKSAtPlxuICAgIHJldHVybiBAY29udGV4dC53cmFwQ29tbWVudChzdHIpXG4gIHNlcGFyYXRvcjogLT5cbiAgICBsZW4gPSBAd2lkdGggKyAyICogQHBhZCArIDIgKiBAZGVjby5sZW5ndGhcbiAgICByZXR1cm4gQHdyYXBDb21tZW50KEBkZWNvTGluZShsZW4pKVxuICBzdGFydFNlcDogLT5cbiAgICBsbiA9IEB3aWR0aCArIDIgKiBAcGFkICsgMiAqIEBkZWNvLmxlbmd0aCAtIEBvcGVuVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gQHByZWZpeCArIEB3cmFwQ29tbWVudChAb3BlblRleHQrQGRlY29MaW5lKGxuKSlcbiAgZW5kU2VwOiAtPlxuICAgIGxuID0gQHdpZHRoICsgMiAqIEBwYWQgKyAyICogQGRlY28ubGVuZ3RoIC0gQGNsb3NlVGV4dC5sZW5ndGhcbiAgICByZXR1cm4gQHdyYXBDb21tZW50KEBjbG9zZVRleHQrQGRlY29MaW5lKGxuKSkgKyBAc3VmZml4XG4gIGRlY29MaW5lOiAobGVuKSAtPlxuICAgIHJldHVybiBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoQGRlY28sIGxlbilcbiAgcGFkZGluZzogLT4gXG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIiwgQHBhZClcbiAgbGluZXM6ICh0ZXh0ID0gJycsIHVwdG9IZWlnaHQ9dHJ1ZSkgLT5cbiAgICB0ZXh0ID0gdGV4dCBvciAnJ1xuICAgIGxpbmVzID0gdGV4dC5yZXBsYWNlKC9cXHIvZywgJycpLnNwbGl0KFwiXFxuXCIpXG4gICAgaWYgdXB0b0hlaWdodFxuICAgICAgcmV0dXJuIChAbGluZShsaW5lc1t4XSBvciAnJykgZm9yIHggaW4gWzAuLkBoZWlnaHRdKS5qb2luKCdcXG4nKSBcbiAgICBlbHNlXG4gICAgICByZXR1cm4gKEBsaW5lKGwpIGZvciBsIGluIGxpbmVzKS5qb2luKCdcXG4nKSBcbiAgbGluZTogKHRleHQgPSAnJykgLT5cbiAgICByZXR1cm4gKFN0cmluZ0hlbHBlci5yZXBlYXRUb0xlbmd0aChcIiBcIixAaW5kZW50KSArXG4gICAgICBAd3JhcENvbW1lbnQoXG4gICAgICAgIEBkZWNvICtcbiAgICAgICAgQHBhZGRpbmcoKSArXG4gICAgICAgIHRleHQgK1xuICAgICAgICBTdHJpbmdIZWxwZXIucmVwZWF0VG9MZW5ndGgoXCIgXCIsIEB3aWR0aCAtIEByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KS5sZW5ndGgpICsgXG4gICAgICAgIEBwYWRkaW5nKCkgK1xuICAgICAgICBAZGVjb1xuICAgICAgKSlcbiAgbGVmdDogLT5cbiAgICBAY29udGV4dC53cmFwQ29tbWVudExlZnQoQGRlY28gKyBAcGFkZGluZygpKVxuICByaWdodDogLT5cbiAgICBAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KEBwYWRkaW5nKCkgKyBAZGVjbylcbiAgcmVtb3ZlSWdub3JlZENvbnRlbnQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAY29udGV4dC5jb2Rld2F2ZS5yZW1vdmVNYXJrZXJzKEBjb250ZXh0LmNvZGV3YXZlLnJlbW92ZUNhcnJldCh0ZXh0KSlcbiAgdGV4dEJvdW5kczogKHRleHQpIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRUeHRTaXplKEByZW1vdmVJZ25vcmVkQ29udGVudCh0ZXh0KSlcbiAgZ2V0Qm94Rm9yUG9zOiAocG9zKSAtPlxuICAgIGRlcHRoID0gQGdldE5lc3RlZEx2bChwb3Muc3RhcnQpXG4gICAgaWYgZGVwdGggPiAwXG4gICAgICBsZWZ0ID0gQGxlZnQoKVxuICAgICAgY3VyTGVmdCA9IFN0cmluZ0hlbHBlci5yZXBlYXQobGVmdCxkZXB0aC0xKVxuICAgICAgXG4gICAgICBjbG9uZSA9IEBjbG9uZSgpXG4gICAgICBwbGFjZWhvbGRlciA9IFwiIyMjUGxhY2VIb2xkZXIjIyNcIlxuICAgICAgY2xvbmUud2lkdGggPSBwbGFjZWhvbGRlci5sZW5ndGhcbiAgICAgIGNsb25lLm9wZW5UZXh0ID0gY2xvbmUuY2xvc2VUZXh0ID0gQGRlY28gKyBAZGVjbyArIHBsYWNlaG9sZGVyICsgQGRlY28gKyBAZGVjb1xuICAgICAgXG4gICAgICBzdGFydEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuc3RhcnRTZXAoKSkucmVwbGFjZShwbGFjZWhvbGRlciwnLionKSlcbiAgICAgIGVuZEZpbmQgPSBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChjdXJMZWZ0ICsgY2xvbmUuZW5kU2VwKCkpLnJlcGxhY2UocGxhY2Vob2xkZXIsJy4qJykpXG4gICAgICBcbiAgICAgIHBhaXIgPSBuZXcgUGFpcihzdGFydEZpbmQsZW5kRmluZCx7XG4gICAgICAgIHZhbGlkTWF0Y2g6IChtYXRjaCk9PlxuICAgICAgICAgICMgY29uc29sZS5sb2cobWF0Y2gsbGVmdClcbiAgICAgICAgICBmID0gQGNvbnRleHQuY29kZXdhdmUuZmluZEFueU5leHQobWF0Y2guc3RhcnQoKSAsW2xlZnQsXCJcXG5cIixcIlxcclwiXSwtMSlcbiAgICAgICAgICByZXR1cm4gIWY/IG9yIGYuc3RyICE9IGxlZnRcbiAgICAgIH0pXG4gICAgICByZXMgPSBwYWlyLndyYXBwZXJQb3MocG9zLEBjb250ZXh0LmNvZGV3YXZlLmVkaXRvci50ZXh0KCkpXG4gICAgICBpZiByZXM/XG4gICAgICAgIHJlcy5zdGFydCArPSBjdXJMZWZ0Lmxlbmd0aFxuICAgICAgICByZXR1cm4gcmVzXG4gICAgXG4gIGdldE5lc3RlZEx2bDogKGluZGV4KSAtPlxuICAgIGRlcHRoID0gMFxuICAgIGxlZnQgPSBAbGVmdCgpXG4gICAgd2hpbGUgKGYgPSBAY29udGV4dC5jb2Rld2F2ZS5maW5kQW55TmV4dChpbmRleCAsW2xlZnQsXCJcXG5cIixcIlxcclwiXSwtMSkpPyAmJiBmLnN0ciA9PSBsZWZ0XG4gICAgICBpbmRleCA9IGYucG9zXG4gICAgICBkZXB0aCsrXG4gICAgcmV0dXJuIGRlcHRoXG4gIGdldE9wdEZyb21MaW5lOiAobGluZSxnZXRQYWQ9dHJ1ZSkgLT5cbiAgICByU3RhcnQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIrU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudExlZnQoQGRlY28pKStcIikoXFxcXHMqKVwiKVxuICAgIHJFbmQgPSBuZXcgUmVnRXhwKFwiKFxcXFxzKikoXCIrU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KEBkZWNvKSkrXCIpKFxcbnwkKVwiKVxuICAgIHJlc1N0YXJ0ID0gclN0YXJ0LmV4ZWMobGluZSlcbiAgICByZXNFbmQgPSByRW5kLmV4ZWMobGluZSlcbiAgICBpZiByZXNTdGFydD8gYW5kIHJlc0VuZD9cbiAgICAgIGlmIGdldFBhZFxuICAgICAgICBAcGFkID0gTWF0aC5taW4ocmVzU3RhcnRbM10ubGVuZ3RoLHJlc0VuZFsxXS5sZW5ndGgpXG4gICAgICBAaW5kZW50ID0gcmVzU3RhcnRbMV0ubGVuZ3RoXG4gICAgICBzdGFydFBvcyA9IHJlc1N0YXJ0LmluZGV4ICsgcmVzU3RhcnRbMV0ubGVuZ3RoICsgcmVzU3RhcnRbMl0ubGVuZ3RoICsgQHBhZCAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAncmVzU3RhcnQuaW5kZXggKyByZXNTdGFydFsxXS5sZW5ndGggKyByZXNTdGFydFsyXS5sZW5ndGgnIHJlc1N0YXJ0LmVuZCgyKVxuICAgICAgZW5kUG9zID0gcmVzRW5kLmluZGV4ICsgcmVzRW5kWzFdLmxlbmd0aCAtIEBwYWQgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgJ3Jlc0VuZC5pbmRleCArIHJlc0VuZFsxXS5sZW5ndGgnIHJlc0VuZC5zdGFydCgyKVxuICAgICAgQHdpZHRoID0gZW5kUG9zIC0gc3RhcnRQb3NcbiAgICByZXR1cm4gdGhpc1xuICByZWZvcm1hdExpbmVzOiAodGV4dCxvcHRpb25zPXt9KSAtPlxuICAgIHJldHVybiBAbGluZXMoQHJlbW92ZUNvbW1lbnQodGV4dCxvcHRpb25zKSxmYWxzZSlcbiAgcmVtb3ZlQ29tbWVudDogKHRleHQsb3B0aW9ucz17fSktPlxuICAgIGlmIHRleHQ/XG4gICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgbXVsdGlsaW5lOiB0cnVlXG4gICAgICB9XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKHt9LGRlZmF1bHRzLG9wdGlvbnMpXG4gICAgICBlY2wgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50TGVmdCgpKVxuICAgICAgZWNyID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29udGV4dC53cmFwQ29tbWVudFJpZ2h0KCkpXG4gICAgICBlZCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGRlY28pXG4gICAgICBmbGFnID0gaWYgb3B0aW9uc1snbXVsdGlsaW5lJ10gdGhlbiAnZ20nIGVsc2UgJycgICAgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgXCInZ20nXCIgcmUuTVxuICAgICAgcmUxID0gbmV3IFJlZ0V4cChcIl5cXFxccyoje2VjbH0oPzoje2VkfSkqXFxcXHN7MCwje0BwYWR9fVwiLCBmbGFnKSAgICAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAje0BwYWR9ICdcIitzdHIoc2VsZi5wYWQpK1wiJ1xuICAgICAgcmUyID0gbmV3IFJlZ0V4cChcIlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXFxccyokXCIsIGZsYWcpXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlMSwnJykucmVwbGFjZShyZTIsJycpXG4gICBcbiAgIiwiIyBbcGF3YV1cbiMgICByZXBsYWNlIENvZGV3YXZlLkNtZEZpbmRlciBDbWRGaW5kZXJcblxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xuXG5leHBvcnQgY2xhc3MgQ21kRmluZGVyXG4gIGNvbnN0cnVjdG9yOiAobmFtZXMsIG9wdGlvbnMpIC0+XG4gICAgIyBDb2Rld2F2ZS5sb2dnZXIudG9Nb25pdG9yKHRoaXMsJ2ZpbmRJbicpXG4gICAgIyBDb2Rld2F2ZS5sb2dnZXIudG9Nb25pdG9yKHRoaXMsJ3RyaWdnZXJEZXRlY3RvcnMnKVxuICAgIGlmIHR5cGVvZiBuYW1lcyA9PSAnc3RyaW5nJ1xuICAgICAgbmFtZXMgPSBbbmFtZXNdXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwYXJlbnQ6IG51bGxcbiAgICAgIG5hbWVzcGFjZXM6IFtdXG4gICAgICBwYXJlbnRDb250ZXh0OiBudWxsXG4gICAgICBjb250ZXh0OiBudWxsXG4gICAgICByb290OiBDb21tYW5kLmNtZHNcbiAgICAgIG11c3RFeGVjdXRlOiB0cnVlXG4gICAgICB1c2VEZXRlY3RvcnM6IHRydWVcbiAgICAgIHVzZUZhbGxiYWNrczogdHJ1ZVxuICAgICAgaW5zdGFuY2U6IG51bGxcbiAgICAgIGNvZGV3YXZlOiBudWxsXG4gICAgfVxuICAgIEBuYW1lcyA9IG5hbWVzXG4gICAgQHBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddXG4gICAgZm9yIGtleSwgdmFsIG9mIGRlZmF1bHRzXG4gICAgICBpZiBrZXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIGVsc2UgaWYgQHBhcmVudD8gYW5kIGtleSAhPSAncGFyZW50J1xuICAgICAgICB0aGlzW2tleV0gPSBAcGFyZW50W2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dChAY29kZXdhdmUpXG4gICAgaWYgQHBhcmVudENvbnRleHQ/XG4gICAgICBAY29udGV4dC5wYXJlbnQgPSBAcGFyZW50Q29udGV4dFxuICAgIGlmIEBuYW1lc3BhY2VzP1xuICAgICAgQGNvbnRleHQuYWRkTmFtZXNwYWNlcyhAbmFtZXNwYWNlcylcbiAgZmluZDogLT5cbiAgICBAdHJpZ2dlckRldGVjdG9ycygpXG4gICAgQGNtZCA9IEBmaW5kSW4oQHJvb3QpXG4gICAgcmV0dXJuIEBjbWRcbiMgIGdldFBvc2liaWxpdGllczogLT5cbiMgICAgQHRyaWdnZXJEZXRlY3RvcnMoKVxuIyAgICBwYXRoID0gbGlzdChAcGF0aClcbiMgICAgcmV0dXJuIEBmaW5kUG9zaWJpbGl0aWVzSW4oQHJvb3QscGF0aClcbiAgZ2V0TmFtZXNXaXRoUGF0aHM6IC0+XG4gICAgcGF0aHMgPSB7fVxuICAgIGZvciBuYW1lIGluIEBuYW1lcyBcbiAgICAgIFtzcGFjZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG4gICAgICBpZiBzcGFjZT8gYW5kICEoc3BhY2UgaW4gQGNvbnRleHQuZ2V0TmFtZVNwYWNlcygpKVxuICAgICAgICB1bmxlc3Mgc3BhY2Ugb2YgcGF0aHMgXG4gICAgICAgICAgcGF0aHNbc3BhY2VdID0gW11cbiAgICAgICAgcGF0aHNbc3BhY2VdLnB1c2gocmVzdClcbiAgICByZXR1cm4gcGF0aHNcbiAgYXBwbHlTcGFjZU9uTmFtZXM6IChuYW1lc3BhY2UpIC0+XG4gICAgW3NwYWNlLHJlc3RdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QobmFtZXNwYWNlLHRydWUpXG4gICAgQG5hbWVzLm1hcCggKG5hbWUpIC0+XG4gICAgICBbY3VyX3NwYWNlLGN1cl9yZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5hbWUpXG4gICAgICBpZiBjdXJfc3BhY2U/IGFuZCBjdXJfc3BhY2UgPT0gc3BhY2VcbiAgICAgICAgbmFtZSA9IGN1cl9yZXN0XG4gICAgICBpZiByZXN0P1xuICAgICAgICBuYW1lID0gcmVzdCArICc6JyArIG5hbWVcbiAgICAgIHJldHVybiBuYW1lXG4gICAgKVxuICBnZXREaXJlY3ROYW1lczogLT5cbiAgICByZXR1cm4gKG4gZm9yIG4gaW4gQG5hbWVzIHdoZW4gbi5pbmRleE9mKFwiOlwiKSA9PSAtMSlcbiAgdHJpZ2dlckRldGVjdG9yczogLT5cbiAgICBpZiBAdXNlRGV0ZWN0b3JzIFxuICAgICAgQHVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICBwb3NpYmlsaXRpZXMgPSBuZXcgQ21kRmluZGVyKEBjb250ZXh0LmdldE5hbWVTcGFjZXMoKSwge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IHBvc2liaWxpdGllcy5sZW5ndGhcbiAgICAgICAgY21kID0gcG9zaWJpbGl0aWVzW2ldXG4gICAgICAgIGZvciBkZXRlY3RvciBpbiBjbWQuZGV0ZWN0b3JzIFxuICAgICAgICAgIHJlcyA9IGRldGVjdG9yLmRldGVjdCh0aGlzKVxuICAgICAgICAgIGlmIHJlcz9cbiAgICAgICAgICAgIEBjb250ZXh0LmFkZE5hbWVzcGFjZXMocmVzKVxuICAgICAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKHJlcywge3BhcmVudDogdGhpcywgbXVzdEV4ZWN1dGU6IGZhbHNlLCB1c2VGYWxsYmFja3M6IGZhbHNlfSkuZmluZFBvc2liaWxpdGllcygpKVxuICAgICAgICBpKytcbiAgZmluZEluOiAoY21kLHBhdGggPSBudWxsKSAtPlxuICAgIHVubGVzcyBjbWQ/XG4gICAgICByZXR1cm4gbnVsbFxuICAgIGJlc3QgPSBAYmVzdEluUG9zaWJpbGl0aWVzKEBmaW5kUG9zaWJpbGl0aWVzKCkpXG4gICAgaWYgYmVzdD9cbiAgICAgIHJldHVybiBiZXN0XG4gIGZpbmRQb3NpYmlsaXRpZXM6IC0+XG4gICAgdW5sZXNzIEByb290P1xuICAgICAgcmV0dXJuIFtdXG4gICAgQHJvb3QuaW5pdCgpXG4gICAgcG9zaWJpbGl0aWVzID0gW11cbiAgICBmb3Igc3BhY2UsIG5hbWVzIG9mIEBnZXROYW1lc1dpdGhQYXRocygpXG4gICAgICBuZXh0cyA9IEBnZXRDbWRGb2xsb3dBbGlhcyhzcGFjZSlcbiAgICAgIGZvciBuZXh0IGluIG5leHRzXG4gICAgICAgIHBvc2liaWxpdGllcyA9IHBvc2liaWxpdGllcy5jb25jYXQobmV3IENtZEZpbmRlcihuYW1lcywge3BhcmVudDogdGhpcywgcm9vdDogbmV4dH0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICBmb3IgbnNwYyBpbiBAY29udGV4dC5nZXROYW1lU3BhY2VzKClcbiAgICAgIFtuc3BjTmFtZSxyZXN0XSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KG5zcGMsdHJ1ZSlcbiAgICAgIG5leHRzID0gQGdldENtZEZvbGxvd0FsaWFzKG5zcGNOYW1lKVxuICAgICAgZm9yIG5leHQgaW4gbmV4dHNcbiAgICAgICAgcG9zaWJpbGl0aWVzID0gcG9zaWJpbGl0aWVzLmNvbmNhdChuZXcgQ21kRmluZGVyKEBhcHBseVNwYWNlT25OYW1lcyhuc3BjKSwge3BhcmVudDogdGhpcywgcm9vdDogbmV4dH0pLmZpbmRQb3NpYmlsaXRpZXMoKSlcbiAgICBmb3IgbmFtZSBpbiBAZ2V0RGlyZWN0TmFtZXMoKVxuICAgICAgZGlyZWN0ID0gQHJvb3QuZ2V0Q21kKG5hbWUpXG4gICAgICBpZiBAY21kSXNWYWxpZChkaXJlY3QpXG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGRpcmVjdClcbiAgICBpZiBAdXNlRmFsbGJhY2tzXG4gICAgICBmYWxsYmFjayA9IEByb290LmdldENtZCgnZmFsbGJhY2snKVxuICAgICAgaWYgQGNtZElzVmFsaWQoZmFsbGJhY2spXG4gICAgICAgIHBvc2liaWxpdGllcy5wdXNoKGZhbGxiYWNrKVxuICAgIEBwb3NpYmlsaXRpZXMgPSBwb3NpYmlsaXRpZXNcbiAgICByZXR1cm4gcG9zaWJpbGl0aWVzXG4gIGdldENtZEZvbGxvd0FsaWFzOiAobmFtZSkgLT5cbiAgICBjbWQgPSBAcm9vdC5nZXRDbWQobmFtZSlcbiAgICBpZiBjbWQ/IFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmFsaWFzT2Y/XG4gICAgICAgIHJldHVybiBbY21kLGNtZC5nZXRBbGlhc2VkKCldXG4gICAgICByZXR1cm4gW2NtZF1cbiAgICByZXR1cm4gW2NtZF1cbiAgY21kSXNWYWxpZDogKGNtZCkgLT5cbiAgICB1bmxlc3MgY21kP1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgaWYgY21kLm5hbWUgIT0gJ2ZhbGxiYWNrJyAmJiBjbWQgaW4gQGFuY2VzdG9ycygpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gIUBtdXN0RXhlY3V0ZSBvciBAY21kSXNFeGVjdXRhYmxlKGNtZClcbiAgYW5jZXN0b3JzOiAtPlxuICAgIGlmIEBjb2Rld2F2ZT8uaW5JbnN0YW5jZT9cbiAgICAgIHJldHVybiBAY29kZXdhdmUuaW5JbnN0YW5jZS5hbmNlc3RvckNtZHNBbmRTZWxmKClcbiAgICByZXR1cm4gW11cbiAgY21kSXNFeGVjdXRhYmxlOiAoY21kKSAtPlxuICAgIG5hbWVzID0gQGdldERpcmVjdE5hbWVzKClcbiAgICBpZiBuYW1lcy5sZW5ndGggPT0gMVxuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlV2l0aE5hbWUobmFtZXNbMF0pXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNtZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgY21kU2NvcmU6IChjbWQpIC0+XG4gICAgc2NvcmUgPSBjbWQuZGVwdGhcbiAgICBpZiBjbWQubmFtZSA9PSAnZmFsbGJhY2snIFxuICAgICAgICBzY29yZSAtPSAxMDAwXG4gICAgcmV0dXJuIHNjb3JlXG4gIGJlc3RJblBvc2liaWxpdGllczogKHBvc3MpIC0+XG4gICAgaWYgcG9zcy5sZW5ndGggPiAwXG4gICAgICBiZXN0ID0gbnVsbFxuICAgICAgYmVzdFNjb3JlID0gbnVsbFxuICAgICAgZm9yIHAgaW4gcG9zc1xuICAgICAgICBzY29yZSA9IEBjbWRTY29yZShwKVxuICAgICAgICBpZiAhYmVzdD8gb3Igc2NvcmUgPj0gYmVzdFNjb3JlXG4gICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmVcbiAgICAgICAgICBiZXN0ID0gcFxuICAgICAgcmV0dXJuIGJlc3Q7IiwiIyBbcGF3YV1cbiMgICByZXBsYWNlICdyZXBsYWNlKC9cXHQvZycgJ3JlcGxhY2UoXCJcXHRcIidcblxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vQ29kZXdhdmUnO1xuaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuZXhwb3J0IGNsYXNzIENtZEluc3RhbmNlXG4gIGNvbnN0cnVjdG9yOiAoQGNtZCxAY29udGV4dCkgLT5cbiAgXG4gIGluaXQ6IC0+XG4gICAgdW5sZXNzIEBpc0VtcHR5KCkgb3IgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIEBfZ2V0Q21kT2JqKClcbiAgICAgIEBfaW5pdFBhcmFtcygpXG4gICAgICBpZiBAY21kT2JqP1xuICAgICAgICBAY21kT2JqLmluaXQoKVxuICAgIHJldHVybiB0aGlzXG4gIHNldFBhcmFtOihuYW1lLHZhbCktPlxuICAgIEBuYW1lZFtuYW1lXSA9IHZhbFxuICBwdXNoUGFyYW06KHZhbCktPlxuICAgIEBwYXJhbXMucHVzaCh2YWwpXG4gIGdldENvbnRleHQ6IC0+XG4gICAgdW5sZXNzIEBjb250ZXh0P1xuICAgICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgcmV0dXJuIEBjb250ZXh0IG9yIG5ldyBDb250ZXh0KClcbiAgZ2V0RmluZGVyOiAoY21kTmFtZSktPlxuICAgIGZpbmRlciA9IEBnZXRDb250ZXh0KCkuZ2V0RmluZGVyKGNtZE5hbWUsQF9nZXRQYXJlbnROYW1lc3BhY2VzKCkpXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgX2dldENtZE9iajogLT5cbiAgICBpZiBAY21kP1xuICAgICAgQGNtZC5pbml0KClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkKCkgb3IgQGNtZFxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgY21kLmNscz9cbiAgICAgICAgQGNtZE9iaiA9IG5ldyBjbWQuY2xzKHRoaXMpXG4gICAgICAgIHJldHVybiBAY21kT2JqXG4gIF9pbml0UGFyYW1zOiAtPlxuICAgIEBuYW1lZCA9IEBnZXREZWZhdWx0cygpXG4gIF9nZXRQYXJlbnROYW1lc3BhY2VzOiAtPlxuICAgIHJldHVybiBbXVxuICBpc0VtcHR5OiAtPlxuICAgIHJldHVybiBAY21kP1xuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmV0dXJuIEBjbWRPYmoucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkRmluYWwoKVxuICAgICAgaWYgYWxpYXNlZD9cbiAgICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgICAgcmV0dXJuIEBjbWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgIHJldHVybiBmYWxzZVxuICBnZXREZWZhdWx0czogLT5cbiAgICBpZiBAY21kP1xuICAgICAgcmVzID0ge31cbiAgICAgIGFsaWFzZWQgPSBAZ2V0QWxpYXNlZCgpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxAY21kLmRlZmF1bHRzKVxuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGNtZE9iai5nZXREZWZhdWx0cygpKVxuICAgICAgcmV0dXJuIHJlc1xuICBnZXRBbGlhc2VkOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICB1bmxlc3MgQGFsaWFzZWRDbWQ/XG4gICAgICAgIEBnZXRBbGlhc2VkRmluYWwoKVxuICAgICAgcmV0dXJuIEBhbGlhc2VkQ21kIG9yIG51bGxcbiAgZ2V0QWxpYXNlZEZpbmFsOiAtPlxuICAgIGlmIEBjbWQ/XG4gICAgICBpZiBAYWxpYXNlZEZpbmFsQ21kP1xuICAgICAgICByZXR1cm4gQGFsaWFzZWRGaW5hbENtZCBvciBudWxsXG4gICAgICBpZiBAY21kLmFsaWFzT2Y/XG4gICAgICAgIGFsaWFzZWQgPSBAY21kXG4gICAgICAgIHdoaWxlIGFsaWFzZWQ/IGFuZCBhbGlhc2VkLmFsaWFzT2Y/XG4gICAgICAgICAgYWxpYXNlZCA9IGFsaWFzZWQuX2FsaWFzZWRGcm9tRmluZGVyKEBnZXRGaW5kZXIoQGFsdGVyQWxpYXNPZihhbGlhc2VkLmFsaWFzT2YpKSlcbiAgICAgICAgICB1bmxlc3MgQGFsaWFzZWRDbWQ/XG4gICAgICAgICAgICBAYWxpYXNlZENtZCA9IGFsaWFzZWQgb3IgZmFsc2VcbiAgICAgICAgQGFsaWFzZWRGaW5hbENtZCA9IGFsaWFzZWQgb3IgZmFsc2VcbiAgICAgICAgcmV0dXJuIGFsaWFzZWRcbiAgYWx0ZXJBbGlhc09mOiAoYWxpYXNPZiktPlxuICAgIGFsaWFzT2ZcbiAgZ2V0T3B0aW9uczogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9wdGlvbnM/XG4gICAgICAgIHJldHVybiBAY21kT3B0aW9uc1xuICAgICAgb3B0ID0gQGNtZC5fb3B0aW9uc0ZvckFsaWFzZWQoQGdldEFsaWFzZWQoKSlcbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIG9wdCA9IE9iamVjdC5hc3NpZ24ob3B0LEBjbWRPYmouZ2V0T3B0aW9ucygpKVxuICAgICAgQGNtZE9wdGlvbnMgPSBvcHRcbiAgICAgIHJldHVybiBvcHRcbiAgZ2V0T3B0aW9uOiAoa2V5KSAtPlxuICAgIG9wdGlvbnMgPSBAZ2V0T3B0aW9ucygpXG4gICAgaWYgb3B0aW9ucz8gYW5kIGtleSBvZiBvcHRpb25zXG4gICAgICByZXR1cm4gb3B0aW9uc1trZXldXG4gIGdldFBhcmFtOiAobmFtZXMsIGRlZlZhbCA9IG51bGwpIC0+XG4gICAgbmFtZXMgPSBbbmFtZXNdIGlmICh0eXBlb2YgbmFtZXMgaW4gWydzdHJpbmcnLCdudW1iZXInXSlcbiAgICBmb3IgbiBpbiBuYW1lc1xuICAgICAgcmV0dXJuIEBuYW1lZFtuXSBpZiBAbmFtZWRbbl0/XG4gICAgICByZXR1cm4gQHBhcmFtc1tuXSBpZiBAcGFyYW1zW25dP1xuICAgIHJldHVybiBkZWZWYWxcbiAgYW5jZXN0b3JDbWRzOiAtPlxuICAgIGlmIEBjb250ZXh0LmNvZGV3YXZlPy5pbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBjb250ZXh0LmNvZGV3YXZlLmluSW5zdGFuY2UuYW5jZXN0b3JDbWRzQW5kU2VsZigpXG4gICAgcmV0dXJuIFtdXG4gIGFuY2VzdG9yQ21kc0FuZFNlbGY6IC0+XG4gICAgcmV0dXJuIEBhbmNlc3RvckNtZHMoKS5jb25jYXQoW0BjbWRdKVxuICBydW5FeGVjdXRlRnVuY3Q6IC0+XG4gICAgaWYgQGNtZD9cbiAgICAgIGlmIEBjbWRPYmo/XG4gICAgICAgIHJldHVybiBAY21kT2JqLmV4ZWN1dGUoKVxuICAgICAgY21kID0gQGdldEFsaWFzZWRGaW5hbCgpIG9yIEBjbWRcbiAgICAgIGNtZC5pbml0KClcbiAgICAgIGlmIGNtZC5leGVjdXRlRnVuY3Q/XG4gICAgICAgIHJldHVybiBjbWQuZXhlY3V0ZUZ1bmN0KHRoaXMpXG4gIHJhd1Jlc3VsdDogLT5cbiAgICBpZiBAY21kP1xuICAgICAgaWYgQGNtZE9iaj9cbiAgICAgICAgcmV0dXJuIEBjbWRPYmoucmVzdWx0KClcbiAgICAgIGNtZCA9IEBnZXRBbGlhc2VkRmluYWwoKSBvciBAY21kXG4gICAgICBjbWQuaW5pdCgpXG4gICAgICBpZiBjbWQucmVzdWx0RnVuY3Q/XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0RnVuY3QodGhpcylcbiAgICAgIGlmIGNtZC5yZXN1bHRTdHI/XG4gICAgICAgIHJldHVybiBjbWQucmVzdWx0U3RyXG4gIHJlc3VsdDogLT4gXG4gICAgQGluaXQoKVxuICAgIGlmIEByZXN1bHRJc0F2YWlsYWJsZSgpXG4gICAgICBpZiAocmVzID0gQHJhd1Jlc3VsdCgpKT9cbiAgICAgICAgcmVzID0gQGZvcm1hdEluZGVudChyZXMpXG4gICAgICAgIGlmIHJlcy5sZW5ndGggPiAwIGFuZCBAZ2V0T3B0aW9uKCdwYXJzZScsdGhpcykgXG4gICAgICAgICAgcGFyc2VyID0gQGdldFBhcnNlckZvclRleHQocmVzKVxuICAgICAgICAgIHJlcyA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICAgIGlmIGFsdGVyRnVuY3QgPSBAZ2V0T3B0aW9uKCdhbHRlclJlc3VsdCcsdGhpcylcbiAgICAgICAgICByZXMgPSBhbHRlckZ1bmN0KHJlcyx0aGlzKVxuICAgICAgICByZXR1cm4gcmVzXG4gIGdldFBhcnNlckZvclRleHQ6ICh0eHQ9JycpIC0+XG4gICAgcGFyc2VyID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0UGFyc2VyKHR4dCksIHtpbkluc3RhbmNlOnRoaXN9KVxuICAgIHBhcnNlci5jaGVja0NhcnJldCA9IGZhbHNlXG4gICAgcmV0dXJuIHBhcnNlclxuICBnZXRJbmRlbnQ6IC0+XG4gICAgcmV0dXJuIDBcbiAgZm9ybWF0SW5kZW50OiAodGV4dCkgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx0L2csJyAgJylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBhcHBseUluZGVudDogKHRleHQpIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5pbmRlbnROb3RGaXJzdCh0ZXh0LEBnZXRJbmRlbnQoKSxcIiBcIikiLCIjIFtwYXdhXVxuIyAgIHJlcGxhY2UgJ2NsYXNzIEBDb2Rld2F2ZScgJ2NsYXNzIENvZGV3YXZlKCk6J1xuIyAgIHJlcGxhY2UgL2Nwb3MuKFxcdyspLyBjcG9zWyckMSddXG4jICAgcmVwbGFjZSAnbmV3IENvZGV3YXZlKCcgQ29kZXdhdmUoXG4jICAgcmVwbGFjZSAnQENvZGV3YXZlLmluaXQgPSAtPicgJ2RlZiBpbml0KCk6J1xuXG5pbXBvcnQgeyBQcm9jZXNzIH0gZnJvbSAnLi9Qcm9jZXNzJztcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgUG9zaXRpb25lZENtZEluc3RhbmNlIH0gZnJvbSAnLi9Qb3NpdGlvbmVkQ21kSW5zdGFuY2UnO1xuaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4vTG9nZ2VyJztcbmltcG9ydCB7IFBvc0NvbGxlY3Rpb24gfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvc0NvbGxlY3Rpb24nO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL1N0cmluZ0hlbHBlcic7XG5cbmV4cG9ydCBjbGFzcyBDb2Rld2F2ZVxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBDb2Rld2F2ZS5pbml0KClcbiAgICBAbWFya2VyID0gJ1tbW1tjb2Rld2F2ZV9tYXJxdWVyXV1dXSdcbiAgICBAdmFycyA9IHt9XG4gICAgXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICAnYnJha2V0cycgOiAnfn4nLFxuICAgICAgJ2RlY28nIDogJ34nLFxuICAgICAgJ2Nsb3NlQ2hhcicgOiAnLycsXG4gICAgICAnbm9FeGVjdXRlQ2hhcicgOiAnIScsXG4gICAgICAnY2FycmV0Q2hhcicgOiAnfCcsXG4gICAgICAnY2hlY2tDYXJyZXQnIDogdHJ1ZSxcbiAgICAgICdpbkluc3RhbmNlJyA6IG51bGxcbiAgICB9XG4gICAgQHBhcmVudCA9IG9wdGlvbnNbJ3BhcmVudCddXG4gICAgXG4gICAgQG5lc3RlZCA9IGlmIEBwYXJlbnQ/IHRoZW4gQHBhcmVudC5uZXN0ZWQrMSBlbHNlIDBcbiAgICBcbiAgICBmb3Iga2V5LCB2YWwgb2YgZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgZWxzZSBpZiBAcGFyZW50PyBhbmQga2V5ICE9ICdwYXJlbnQnXG4gICAgICAgIHRoaXNba2V5XSA9IEBwYXJlbnRba2V5XVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICBAZWRpdG9yLmJpbmRlZFRvKHRoaXMpIGlmIEBlZGl0b3I/XG4gICAgXG4gICAgQGNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzKVxuICAgIGlmIEBpbkluc3RhbmNlP1xuICAgICAgQGNvbnRleHQucGFyZW50ID0gQGluSW5zdGFuY2UuY29udGV4dFxuXG4gICAgQGxvZ2dlciA9IG5ldyBMb2dnZXIoKVxuXG4gIG9uQWN0aXZhdGlvbktleTogLT5cbiAgICBAcHJvY2VzcyA9IG5ldyBQcm9jZXNzKClcbiAgICBAbG9nZ2VyLmxvZygnYWN0aXZhdGlvbiBrZXknKVxuICAgIEBydW5BdEN1cnNvclBvcygpXG4gICAgIyBDb2Rld2F2ZS5sb2dnZXIucmVzdW1lKClcbiAgICBAcHJvY2VzcyA9IG51bGxcbiAgcnVuQXRDdXJzb3JQb3M6IC0+XG4gICAgaWYgQGVkaXRvci5hbGxvd011bHRpU2VsZWN0aW9uKClcbiAgICAgIEBydW5BdE11bHRpUG9zKEBlZGl0b3IuZ2V0TXVsdGlTZWwoKSlcbiAgICBlbHNlXG4gICAgICBAcnVuQXRQb3MoQGVkaXRvci5nZXRDdXJzb3JQb3MoKSlcbiAgcnVuQXRQb3M6IChwb3MpLT5cbiAgICBAcnVuQXRNdWx0aVBvcyhbcG9zXSlcbiAgcnVuQXRNdWx0aVBvczogKG11bHRpUG9zKS0+XG4gICAgaWYgbXVsdGlQb3MubGVuZ3RoID4gMFxuICAgICAgY21kID0gQGNvbW1hbmRPblBvcyhtdWx0aVBvc1swXS5lbmQpXG4gICAgICBpZiBjbWQ/XG4gICAgICAgIGlmIG11bHRpUG9zLmxlbmd0aCA+IDFcbiAgICAgICAgICBjbWQuc2V0TXVsdGlQb3MobXVsdGlQb3MpXG4gICAgICAgIGNtZC5pbml0KClcbiAgICAgICAgQGxvZ2dlci5sb2coY21kKVxuICAgICAgICBjbWQuZXhlY3V0ZSgpXG4gICAgICBlbHNlXG4gICAgICAgIGlmIG11bHRpUG9zWzBdLnN0YXJ0ID09IG11bHRpUG9zWzBdLmVuZFxuICAgICAgICAgIEBhZGRCcmFrZXRzKG11bHRpUG9zKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHByb21wdENsb3NpbmdDbWQobXVsdGlQb3MpXG4gIGNvbW1hbmRPblBvczogKHBvcykgLT5cbiAgICBpZiBAcHJlY2VkZWRCeUJyYWtldHMocG9zKSBhbmQgQGZvbGxvd2VkQnlCcmFrZXRzKHBvcykgYW5kIEBjb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT0gMSBcbiAgICAgIHByZXYgPSBwb3MtQGJyYWtldHMubGVuZ3RoXG4gICAgICBuZXh0ID0gcG9zXG4gICAgZWxzZVxuICAgICAgaWYgQHByZWNlZGVkQnlCcmFrZXRzKHBvcykgYW5kIEBjb3VudFByZXZCcmFrZXQocG9zKSAlIDIgPT0gMFxuICAgICAgICBwb3MgLT0gQGJyYWtldHMubGVuZ3RoXG4gICAgICBwcmV2ID0gQGZpbmRQcmV2QnJha2V0KHBvcylcbiAgICAgIHVubGVzcyBwcmV2P1xuICAgICAgICByZXR1cm4gbnVsbCBcbiAgICAgIG5leHQgPSBAZmluZE5leHRCcmFrZXQocG9zLTEpXG4gICAgICBpZiAhbmV4dD8gb3IgQGNvdW50UHJldkJyYWtldChwcmV2KSAlIDIgIT0gMCBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uZWRDbWRJbnN0YW5jZSh0aGlzLHByZXYsQGVkaXRvci50ZXh0U3Vic3RyKHByZXYsbmV4dCtAYnJha2V0cy5sZW5ndGgpKVxuICBuZXh0Q21kOiAoc3RhcnQgPSAwKSAtPlxuICAgIHBvcyA9IHN0YXJ0XG4gICAgd2hpbGUgZiA9IEBmaW5kQW55TmV4dChwb3MgLFtAYnJha2V0cyxcIlxcblwiXSlcbiAgICAgIHBvcyA9IGYucG9zICsgZi5zdHIubGVuZ3RoXG4gICAgICBpZiBmLnN0ciA9PSBAYnJha2V0c1xuICAgICAgICBpZiBiZWdpbm5pbmc/XG4gICAgICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbmVkQ21kSW5zdGFuY2UodGhpcywgYmVnaW5uaW5nLCBAZWRpdG9yLnRleHRTdWJzdHIoYmVnaW5uaW5nLCBmLnBvcytAYnJha2V0cy5sZW5ndGgpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYmVnaW5uaW5nID0gZi5wb3NcbiAgICAgIGVsc2VcbiAgICAgICAgYmVnaW5uaW5nID0gbnVsbFxuICAgIG51bGxcbiAgZ2V0RW5jbG9zaW5nQ21kOiAocG9zID0gMCkgLT5cbiAgICBjcG9zID0gcG9zXG4gICAgY2xvc2luZ1ByZWZpeCA9IEBicmFrZXRzICsgQGNsb3NlQ2hhclxuICAgIHdoaWxlIChwID0gQGZpbmROZXh0KGNwb3MsY2xvc2luZ1ByZWZpeCkpP1xuICAgICAgaWYgY21kID0gQGNvbW1hbmRPblBvcyhwK2Nsb3NpbmdQcmVmaXgubGVuZ3RoKVxuICAgICAgICBjcG9zID0gY21kLmdldEVuZFBvcygpXG4gICAgICAgIGlmIGNtZC5wb3MgPCBwb3NcbiAgICAgICAgICByZXR1cm4gY21kXG4gICAgICBlbHNlXG4gICAgICAgIGNwb3MgPSBwK2Nsb3NpbmdQcmVmaXgubGVuZ3RoXG4gICAgbnVsbFxuICBwcmVjZWRlZEJ5QnJha2V0czogKHBvcykgLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcy1AYnJha2V0cy5sZW5ndGgscG9zKSA9PSBAYnJha2V0c1xuICBmb2xsb3dlZEJ5QnJha2V0czogKHBvcykgLT5cbiAgICByZXR1cm4gQGVkaXRvci50ZXh0U3Vic3RyKHBvcyxwb3MrQGJyYWtldHMubGVuZ3RoKSA9PSBAYnJha2V0c1xuICBjb3VudFByZXZCcmFrZXQ6IChzdGFydCkgLT4gXG4gICAgaSA9IDBcbiAgICB3aGlsZSAoc3RhcnQgPSBAZmluZFByZXZCcmFrZXQoc3RhcnQpKT9cbiAgICAgIGkrK1xuICAgIHJldHVybiBpXG4gIGlzRW5kTGluZTogKHBvcykgLT4gXG4gICAgcmV0dXJuIEBlZGl0b3IudGV4dFN1YnN0cihwb3MscG9zKzEpID09IFwiXFxuXCIgb3IgcG9zICsgMSA+PSBAZWRpdG9yLnRleHRMZW4oKVxuICBmaW5kUHJldkJyYWtldDogKHN0YXJ0KSAtPiBcbiAgICByZXR1cm4gQGZpbmROZXh0QnJha2V0KHN0YXJ0LC0xKVxuICBmaW5kTmV4dEJyYWtldDogKHN0YXJ0LGRpcmVjdGlvbiA9IDEpIC0+IFxuICAgIGYgPSBAZmluZEFueU5leHQoc3RhcnQgLFtAYnJha2V0cyxcIlxcblwiXSwgZGlyZWN0aW9uKVxuICAgIFxuICAgIGYucG9zIGlmIGYgYW5kIGYuc3RyID09IEBicmFrZXRzXG4gIGZpbmRQcmV2OiAoc3RhcnQsc3RyaW5nKSAtPiBcbiAgICByZXR1cm4gQGZpbmROZXh0KHN0YXJ0LHN0cmluZywtMSlcbiAgZmluZE5leHQ6IChzdGFydCxzdHJpbmcsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgZiA9IEBmaW5kQW55TmV4dChzdGFydCAsW3N0cmluZ10sIGRpcmVjdGlvbilcbiAgICBmLnBvcyBpZiBmXG4gIFxuICBmaW5kQW55TmV4dDogKHN0YXJ0LHN0cmluZ3MsZGlyZWN0aW9uID0gMSkgLT4gXG4gICAgcmV0dXJuIEBlZGl0b3IuZmluZEFueU5leHQoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24pXG4gICAgXG4gIGZpbmRNYXRjaGluZ1BhaXI6IChzdGFydFBvcyxvcGVuaW5nLGNsb3NpbmcsZGlyZWN0aW9uID0gMSkgLT5cbiAgICBwb3MgPSBzdGFydFBvc1xuICAgIG5lc3RlZCA9IDBcbiAgICB3aGlsZSBmID0gQGZpbmRBbnlOZXh0KHBvcyxbY2xvc2luZyxvcGVuaW5nXSxkaXJlY3Rpb24pXG4gICAgICBwb3MgPSBmLnBvcyArIChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gZi5zdHIubGVuZ3RoIGVsc2UgMClcbiAgICAgIGlmIGYuc3RyID09IChpZiBkaXJlY3Rpb24gPiAwIHRoZW4gY2xvc2luZyBlbHNlIG9wZW5pbmcpXG4gICAgICAgIGlmIG5lc3RlZCA+IDBcbiAgICAgICAgICBuZXN0ZWQtLVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGZcbiAgICAgIGVsc2VcbiAgICAgICAgbmVzdGVkKytcbiAgICBudWxsXG4gIGFkZEJyYWtldHM6IChwb3MpIC0+XG4gICAgcG9zID0gbmV3IFBvc0NvbGxlY3Rpb24ocG9zKVxuICAgIHJlcGxhY2VtZW50cyA9IHBvcy53cmFwKEBicmFrZXRzLEBicmFrZXRzKS5tYXAoIChyKS0+ci5zZWxlY3RDb250ZW50KCkgKVxuICAgIEBlZGl0b3IuYXBwbHlSZXBsYWNlbWVudHMocmVwbGFjZW1lbnRzKVxuICBwcm9tcHRDbG9zaW5nQ21kOiAoc2VsZWN0aW9ucykgLT5cbiAgICBAY2xvc2luZ1Byb21wLnN0b3AoKSBpZiBAY2xvc2luZ1Byb21wP1xuICAgIEBjbG9zaW5nUHJvbXAgPSBDb2Rld2F2ZS5DbG9zaW5nUHJvbXAubmV3Rm9yKHRoaXMsc2VsZWN0aW9ucykuYmVnaW4oKSAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAvXFwobmV3ICguKilcXCkuYmVnaW4vICQxLmJlZ2luIHJlcGFyc2VcbiAgcGFyc2VBbGw6IChyZWN1cnNpdmUgPSB0cnVlKSAtPlxuICAgIGlmIEBuZXN0ZWQgPiAxMDBcbiAgICAgIHRocm93IFwiSW5maW5pdGUgcGFyc2luZyBSZWN1cnNpb25cIlxuICAgIHBvcyA9IDBcbiAgICB3aGlsZSBjbWQgPSBAbmV4dENtZChwb3MpXG4gICAgICBwb3MgPSBjbWQuZ2V0RW5kUG9zKClcbiAgICAgIEBlZGl0b3Iuc2V0Q3Vyc29yUG9zKHBvcylcbiAgICAgICMgY29uc29sZS5sb2coY21kKVxuICAgICAgY21kLmluaXQoKVxuICAgICAgaWYgcmVjdXJzaXZlIGFuZCBjbWQuY29udGVudD8gYW5kICghY21kLmdldENtZCgpPyBvciAhY21kLmdldE9wdGlvbigncHJldmVudFBhcnNlQWxsJykpXG4gICAgICAgIHBhcnNlciA9IG5ldyBDb2Rld2F2ZShuZXcgVGV4dFBhcnNlcihjbWQuY29udGVudCksIHtwYXJlbnQ6IHRoaXN9KVxuICAgICAgICBjbWQuY29udGVudCA9IHBhcnNlci5wYXJzZUFsbCgpXG4gICAgICBpZiBjbWQuZXhlY3V0ZSgpP1xuICAgICAgICBpZiBjbWQucmVwbGFjZUVuZD9cbiAgICAgICAgICBwb3MgPSBjbWQucmVwbGFjZUVuZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcG9zID0gQGVkaXRvci5nZXRDdXJzb3JQb3MoKS5lbmRcbiAgICByZXR1cm4gQGdldFRleHQoKVxuICBnZXRUZXh0OiAtPlxuICAgIHJldHVybiBAZWRpdG9yLnRleHQoKVxuICBpc1Jvb3Q6IC0+XG4gICAgcmV0dXJuICFAcGFyZW50PyBhbmQgKCFAaW5JbnN0YW5jZT8gb3IgIUBpbkluc3RhbmNlLmZpbmRlcj8pXG4gIGdldFJvb3Q6IC0+XG4gICAgaWYgQGlzUm9vdFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICBlbHNlIGlmIEBwYXJlbnQ/XG4gICAgICByZXR1cm4gQHBhcmVudC5nZXRSb290KClcbiAgICBlbHNlIGlmIEBpbkluc3RhbmNlP1xuICAgICAgcmV0dXJuIEBpbkluc3RhbmNlLmNvZGV3YXZlLmdldFJvb3QoKVxuICByZW1vdmVDYXJyZXQ6ICh0eHQpIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQodHh0LEBjYXJyZXRDaGFyKVxuICBnZXRDYXJyZXRQb3M6ICh0eHQpIC0+XG4gICAgcmV0dXJuIFN0cmluZ0hlbHBlci5nZXRDYXJyZXRQb3ModHh0LEBjYXJyZXRDaGFyKVxuICByZWdNYXJrZXI6IChmbGFncz1cImdcIikgLT4gIyBbcGF3YSBweXRob25dIHJlcGxhY2UgZmxhZ3M9XCJnXCIgZmxhZ3M9MCBcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBtYXJrZXIpLCBmbGFncylcbiAgcmVtb3ZlTWFya2VyczogKHRleHQpIC0+XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZShAcmVnTWFya2VyKCksJycpICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIEByZWdNYXJrZXIoKSBzZWxmLm1hcmtlciBcblxuICBAaW5pdDogLT5cbiAgICB1bmxlc3MgQGluaXRlZFxuICAgICAgQGluaXRlZCA9IHRydWVcbiAgICAgIENvbW1hbmQuaW5pdENtZHMoKVxuICAgICAgQ29tbWFuZC5sb2FkQ21kcygpXG5cbiAgQGluaXRlZDogZmFsc2UiLCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgU3RvcmFnZSB9IGZyb20gJy4vU3RvcmFnZSc7XG5pbXBvcnQgeyBOYW1lc3BhY2VIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvTmFtZXNwYWNlSGVscGVyJztcblxuX29wdEtleSA9IChrZXksZGljdCxkZWZWYWwgPSBudWxsKSAtPlxuICAjIG9wdGlvbmFsIERpY3Rpb25hcnkga2V5XG4gIHJldHVybiBpZiBrZXkgb2YgZGljdCB0aGVuIGRpY3Rba2V5XSBlbHNlIGRlZlZhbFxuXG5cbmV4cG9ydCBjbGFzcyBDb21tYW5kXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsQGRhdGE9bnVsbCxAcGFyZW50PW51bGwpIC0+XG4gICAgQGNtZHMgPSBbXVxuICAgIEBkZXRlY3RvcnMgPSBbXVxuICAgIEBleGVjdXRlRnVuY3QgPSBAcmVzdWx0RnVuY3QgPSBAcmVzdWx0U3RyID0gQGFsaWFzT2YgPSBAY2xzID0gbnVsbFxuICAgIEBhbGlhc2VkID0gbnVsbFxuICAgIEBmdWxsTmFtZSA9IEBuYW1lXG4gICAgQGRlcHRoID0gMFxuICAgIFtAX3BhcmVudCwgQF9pbml0ZWRdID0gW251bGwsIGZhbHNlXVxuICAgIEBzZXRQYXJlbnQocGFyZW50KVxuICAgIEBkZWZhdWx0cyA9IHt9XG4gICAgXG4gICAgQGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgbmFtZVRvUGFyYW06IG51bGwsXG4gICAgICBjaGVja0NhcnJldDogdHJ1ZSxcbiAgICAgIHBhcnNlOiBmYWxzZSxcbiAgICAgIGJlZm9yZUV4ZWN1dGU6IG51bGwsXG4gICAgICBhbHRlclJlc3VsdDogbnVsbCxcbiAgICAgIHByZXZlbnRQYXJzZUFsbDogZmFsc2UsXG4gICAgICByZXBsYWNlQm94OiBmYWxzZSxcbiAgICB9XG4gICAgQG9wdGlvbnMgPSB7fVxuICAgIEBmaW5hbE9wdGlvbnMgPSBudWxsXG4gIHBhcmVudDogLT5cbiAgICByZXR1cm4gQF9wYXJlbnRcbiAgc2V0UGFyZW50OiAodmFsdWUpIC0+XG4gICAgaWYgQF9wYXJlbnQgIT0gdmFsdWVcbiAgICAgIEBfcGFyZW50ID0gdmFsdWVcbiAgICAgIEBmdWxsTmFtZSA9IChcbiAgICAgICAgaWYgQF9wYXJlbnQ/IGFuZCBAX3BhcmVudC5uYW1lP1xuICAgICAgICAgIEBfcGFyZW50LmZ1bGxOYW1lICsgJzonICsgQG5hbWUgXG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgQG5hbWVcbiAgICAgIClcbiAgICAgIEBkZXB0aCA9IChcbiAgICAgICAgaWYgQF9wYXJlbnQ/IGFuZCBAX3BhcmVudC5kZXB0aD9cbiAgICAgICAgdGhlbiBAX3BhcmVudC5kZXB0aCArIDFcbiAgICAgICAgZWxzZSAwXG4gICAgICApXG4gIGluaXQ6IC0+XG4gICAgaWYgIUBfaW5pdGVkXG4gICAgICBAX2luaXRlZCA9IHRydWVcbiAgICAgIEBwYXJzZURhdGEoQGRhdGEpXG4gICAgcmV0dXJuIHRoaXNcbiAgdW5yZWdpc3RlcjogLT5cbiAgICBAX3BhcmVudC5yZW1vdmVDbWQodGhpcylcbiAgaXNFZGl0YWJsZTogLT5cbiAgICByZXR1cm4gQHJlc3VsdFN0cj8gb3IgQGFsaWFzT2Y/XG4gIGlzRXhlY3V0YWJsZTogLT5cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICBmb3IgcCBpbiBbJ3Jlc3VsdFN0cicsJ3Jlc3VsdEZ1bmN0JywnY2xzJywnZXhlY3V0ZUZ1bmN0J11cbiAgICAgIGlmIHRoaXNbcF0/XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIGlzRXhlY3V0YWJsZVdpdGhOYW1lOiAobmFtZSkgLT5cbiAgICBpZiBAYWxpYXNPZj9cbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpXG4gICAgICBhbGlhc09mID0gQGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJyxuYW1lKVxuICAgICAgYWxpYXNlZCA9IEBfYWxpYXNlZEZyb21GaW5kZXIoY29udGV4dC5nZXRGaW5kZXIoYWxpYXNPZikpXG4gICAgICBpZiBhbGlhc2VkP1xuICAgICAgICByZXR1cm4gYWxpYXNlZC5pbml0KCkuaXNFeGVjdXRhYmxlKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBAaXNFeGVjdXRhYmxlKClcbiAgcmVzdWx0SXNBdmFpbGFibGU6IC0+XG4gICAgYWxpYXNlZCA9IEBnZXRBbGlhc2VkKClcbiAgICBpZiBhbGlhc2VkP1xuICAgICAgcmV0dXJuIGFsaWFzZWQucmVzdWx0SXNBdmFpbGFibGUoKVxuICAgIGZvciBwIGluIFsncmVzdWx0U3RyJywncmVzdWx0RnVuY3QnXVxuICAgICAgaWYgdGhpc1twXT9cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgZ2V0RGVmYXVsdHM6IC0+XG4gICAgcmVzID0ge31cbiAgICBhbGlhc2VkID0gQGdldEFsaWFzZWQoKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICByZXMgPSBPYmplY3QuYXNzaWduKHJlcyxhbGlhc2VkLmdldERlZmF1bHRzKCkpXG4gICAgcmVzID0gT2JqZWN0LmFzc2lnbihyZXMsQGRlZmF1bHRzKVxuICAgIHJldHVybiByZXNcbiAgX2FsaWFzZWRGcm9tRmluZGVyOiAoZmluZGVyKSAtPlxuICAgICAgZmluZGVyLnVzZUZhbGxiYWNrcyA9IGZhbHNlXG4gICAgICBmaW5kZXIubXVzdEV4ZWN1dGUgPSBmYWxzZVxuICAgICAgZmluZGVyLnVzZURldGVjdG9ycyA9IGZhbHNlXG4gICAgICByZXR1cm4gZmluZGVyLmZpbmQoKVxuICBnZXRBbGlhc2VkOiAtPlxuICAgIGlmIEBhbGlhc09mP1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KClcbiAgICAgIHJldHVybiBAX2FsaWFzZWRGcm9tRmluZGVyKGNvbnRleHQuZ2V0RmluZGVyKEBhbGlhc09mKSlcbiAgc2V0T3B0aW9uczogKGRhdGEpIC0+XG4gICAgZm9yIGtleSwgdmFsIG9mIGRhdGFcbiAgICAgIGlmIGtleSBvZiBAZGVmYXVsdE9wdGlvbnNcbiAgICAgICAgQG9wdGlvbnNba2V5XSA9IHZhbFxuICBfb3B0aW9uc0ZvckFsaWFzZWQ6IChhbGlhc2VkKSAtPlxuICAgIG9wdCA9IHt9XG4gICAgb3B0ID0gT2JqZWN0LmFzc2lnbihvcHQsQGRlZmF1bHRPcHRpb25zKVxuICAgIGlmIGFsaWFzZWQ/XG4gICAgICBvcHQgPSBPYmplY3QuYXNzaWduKG9wdCxhbGlhc2VkLmdldE9wdGlvbnMoKSlcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihvcHQsQG9wdGlvbnMpXG4gIGdldE9wdGlvbnM6IC0+XG4gICAgcmV0dXJuIEBfb3B0aW9uc0ZvckFsaWFzZWQoQGdldEFsaWFzZWQoKSlcbiAgZ2V0T3B0aW9uOiAoa2V5KSAtPlxuICAgIG9wdGlvbnMgPSBAZ2V0T3B0aW9ucygpXG4gICAgaWYga2V5IG9mIG9wdGlvbnNcbiAgICAgIHJldHVybiBvcHRpb25zW2tleV1cbiAgaGVscDogLT5cbiAgICBjbWQgPSBAZ2V0Q21kKCdoZWxwJylcbiAgICBpZiBjbWQ/XG4gICAgICByZXR1cm4gY21kLmluaXQoKS5yZXN1bHRTdHJcbiAgcGFyc2VEYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IGRhdGFcbiAgICBpZiB0eXBlb2YgZGF0YSA9PSAnc3RyaW5nJ1xuICAgICAgQHJlc3VsdFN0ciA9IGRhdGFcbiAgICAgIEBvcHRpb25zWydwYXJzZSddID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlIGlmIGRhdGE/ICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlIGRhdGE/IFwiaXNpbnN0YW5jZShkYXRhLGRpY3QpXCJcbiAgICAgIHJldHVybiBAcGFyc2VEaWN0RGF0YShkYXRhKVxuICAgIHJldHVybiBmYWxzZVxuICBwYXJzZURpY3REYXRhOiAoZGF0YSkgLT5cbiAgICByZXMgPSBfb3B0S2V5KCdyZXN1bHQnLGRhdGEpXG4gICAgaWYgdHlwZW9mIHJlcyA9PSBcImZ1bmN0aW9uXCJcbiAgICAgIEByZXN1bHRGdW5jdCA9IHJlc1xuICAgIGVsc2UgaWYgcmVzP1xuICAgICAgQHJlc3VsdFN0ciA9IHJlc1xuICAgICAgQG9wdGlvbnNbJ3BhcnNlJ10gPSB0cnVlXG4gICAgZXhlY3V0ZSA9IF9vcHRLZXkoJ2V4ZWN1dGUnLGRhdGEpXG4gICAgaWYgdHlwZW9mIGV4ZWN1dGUgPT0gXCJmdW5jdGlvblwiXG4gICAgICBAZXhlY3V0ZUZ1bmN0ID0gZXhlY3V0ZVxuICAgIEBhbGlhc09mID0gX29wdEtleSgnYWxpYXNPZicsZGF0YSlcbiAgICBAY2xzID0gX29wdEtleSgnY2xzJyxkYXRhKVxuICAgIEBkZWZhdWx0cyA9IF9vcHRLZXkoJ2RlZmF1bHRzJyxkYXRhLEBkZWZhdWx0cylcbiAgICBcbiAgICBAc2V0T3B0aW9ucyhkYXRhKVxuICAgIFxuICAgIGlmICdoZWxwJyBvZiBkYXRhXG4gICAgICBAYWRkQ21kKG5ldyBDb21tYW5kKCdoZWxwJyxkYXRhWydoZWxwJ10sdGhpcykpXG4gICAgaWYgJ2ZhbGxiYWNrJyBvZiBkYXRhXG4gICAgICBAYWRkQ21kKG5ldyBDb21tYW5kKCdmYWxsYmFjaycsZGF0YVsnZmFsbGJhY2snXSx0aGlzKSlcbiAgICAgIFxuICAgIGlmICdjbWRzJyBvZiBkYXRhXG4gICAgICBAYWRkQ21kcyhkYXRhWydjbWRzJ10pXG4gICAgcmV0dXJuIHRydWVcbiAgYWRkQ21kczogKGNtZHMpIC0+XG4gICAgZm9yIG5hbWUsIGRhdGEgb2YgY21kc1xuICAgICAgQGFkZENtZChuZXcgQ29tbWFuZChuYW1lLGRhdGEsdGhpcykpXG4gIGFkZENtZDogKGNtZCkgLT5cbiAgICBleGlzdHMgPSBAZ2V0Q21kKGNtZC5uYW1lKVxuICAgIGlmIGV4aXN0cz9cbiAgICAgIEByZW1vdmVDbWQoZXhpc3RzKVxuICAgIGNtZC5zZXRQYXJlbnQodGhpcylcbiAgICBAY21kcy5wdXNoKGNtZClcbiAgICByZXR1cm4gY21kXG4gIHJlbW92ZUNtZDogKGNtZCkgLT5cbiAgICBpZiAoaSA9IEBjbWRzLmluZGV4T2YoY21kKSkgPiAtMVxuICAgICAgQGNtZHMuc3BsaWNlKGksIDEpXG4gICAgcmV0dXJuIGNtZFxuICBnZXRDbWQ6IChmdWxsbmFtZSkgLT5cbiAgICBAaW5pdCgpXG4gICAgW3NwYWNlLG5hbWVdID0gTmFtZXNwYWNlSGVscGVyLnNwbGl0Rmlyc3QoZnVsbG5hbWUpXG4gICAgaWYgc3BhY2U/XG4gICAgICByZXR1cm4gQGdldENtZChzcGFjZSkuZ2V0Q21kKG5hbWUpXG4gICAgZm9yIGNtZCBpbiBAY21kc1xuICAgICAgaWYgY21kLm5hbWUgPT0gbmFtZVxuICAgICAgICByZXR1cm4gY21kXG4gIHNldENtZERhdGE6IChmdWxsbmFtZSxkYXRhKSAtPlxuICAgIEBzZXRDbWQoZnVsbG5hbWUsbmV3IENvbW1hbmQoZnVsbG5hbWUuc3BsaXQoJzonKS5wb3AoKSxkYXRhKSlcbiAgc2V0Q21kOiAoZnVsbG5hbWUsY21kKSAtPlxuICAgIFtzcGFjZSxuYW1lXSA9IE5hbWVzcGFjZUhlbHBlci5zcGxpdEZpcnN0KGZ1bGxuYW1lKVxuICAgIGlmIHNwYWNlP1xuICAgICAgbmV4dCA9IEBnZXRDbWQoc3BhY2UpXG4gICAgICB1bmxlc3MgbmV4dD9cbiAgICAgICAgbmV4dCA9IEBhZGRDbWQobmV3IENvbW1hbmQoc3BhY2UpKVxuICAgICAgcmV0dXJuIG5leHQuc2V0Q21kKG5hbWUsY21kKVxuICAgIGVsc2VcbiAgICAgIEBhZGRDbWQoY21kKVxuICAgICAgcmV0dXJuIGNtZFxuICBhZGREZXRlY3RvcjogKGRldGVjdG9yKSAtPlxuICAgIEBkZXRlY3RvcnMucHVzaChkZXRlY3RvcilcbiAgICBcbiAgQGNtZEluaXRpYWxpc2VycyA9IFtdXG5cbiAgQGluaXRDbWRzOiAtPlxuICAgIENvbW1hbmQuY21kcyA9IG5ldyBDb21tYW5kKG51bGwse1xuICAgICAgJ2NtZHMnOntcbiAgICAgICAgJ2hlbGxvJzp7XG4gICAgICAgICAgaGVscDogXCJcIlwiXG4gICAgICAgICAgXCJIZWxsbywgd29ybGQhXCIgaXMgdHlwaWNhbGx5IG9uZSBvZiB0aGUgc2ltcGxlc3QgcHJvZ3JhbXMgcG9zc2libGUgaW5cbiAgICAgICAgICBtb3N0IHByb2dyYW1taW5nIGxhbmd1YWdlcywgaXQgaXMgYnkgdHJhZGl0aW9uIG9mdGVuICguLi4pIHVzZWQgdG9cbiAgICAgICAgICB2ZXJpZnkgdGhhdCBhIGxhbmd1YWdlIG9yIHN5c3RlbSBpcyBvcGVyYXRpbmcgY29ycmVjdGx5IC13aWtpcGVkaWFcbiAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICByZXN1bHQ6ICdIZWxsbywgV29ybGQhJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBmb3IgaW5pdGlhbGlzZXIgaW4gQ29tbWFuZC5jbWRJbml0aWFsaXNlcnNcbiAgICAgIGluaXRpYWxpc2VyKClcblxuICBAc2F2ZUNtZDogKGZ1bGxuYW1lLCBkYXRhKSAtPlxuICAgIHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG4gICAgQ29tbWFuZC5jbWRzLnNldENtZERhdGEoZnVsbG5hbWUsZGF0YSlcbiAgICBzYXZlZENtZHMgPSBzdG9yYWdlLmxvYWQoJ2NtZHMnKVxuICAgIHVubGVzcyBzYXZlZENtZHM/XG4gICAgICBzYXZlZENtZHMgPSB7fVxuICAgIHNhdmVkQ21kc1tmdWxsbmFtZV0gPSBkYXRhXG4gICAgc3RvcmFnZS5zYXZlKCdjbWRzJyxzYXZlZENtZHMpXG5cbiAgQGxvYWRDbWRzOiAtPlxuICAgIHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpXG4gICAgc2F2ZWRDbWRzID0gc3RvcmFnZS5sb2FkKCdjbWRzJylcbiAgICBpZiBzYXZlZENtZHM/IFxuICAgICAgZm9yIGZ1bGxuYW1lLCBkYXRhIG9mIHNhdmVkQ21kc1xuICAgICAgICBDb21tYW5kLmNtZHMuc2V0Q21kRGF0YShmdWxsbmFtZSwgZGF0YSlcblxuICBAcmVzZXRTYXZlZDogLT5cbiAgICBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKVxuICAgIHN0b3JhZ2Uuc2F2ZSgnY21kcycse30pXG4gIFxuXG5leHBvcnQgY2xhc3MgQmFzZUNvbW1hbmRcbiAgY29uc3RydWN0b3I6IChAaW5zdGFuY2UpIC0+XG4gIGluaXQ6IC0+XG4gICAgI1xuICByZXN1bHRJc0F2YWlsYWJsZTogLT5cbiAgICByZXR1cm4gdGhpc1tcInJlc3VsdFwiXT8gIyBbcGF3YV0gcmVwbGFjZSB0aGlzW1wicmVzdWx0XCJdPyAnaGFzYXR0cihzZWxmLFwicmVzdWx0XCIpJ1xuICBnZXREZWZhdWx0czogLT5cbiAgICByZXR1cm4ge31cbiAgZ2V0T3B0aW9uczogLT5cbiAgICByZXR1cm4ge31cbiAgICAgICIsIlxuaW1wb3J0IHsgQ21kRmluZGVyIH0gZnJvbSAnLi9DbWRGaW5kZXInO1xuaW1wb3J0IHsgQ21kSW5zdGFuY2UgfSBmcm9tICcuL0NtZEluc3RhbmNlJztcbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSAnLi9oZWxwZXJzL0FycmF5SGVscGVyJztcblxuZXhwb3J0IGNsYXNzIENvbnRleHRcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUpIC0+XG4gICAgQG5hbWVTcGFjZXMgPSBbXVxuICBcbiAgYWRkTmFtZVNwYWNlOiAobmFtZSkgLT5cbiAgICBpZiBuYW1lIG5vdCBpbiBAbmFtZVNwYWNlcyBcbiAgICAgIEBuYW1lU3BhY2VzLnB1c2gobmFtZSlcbiAgICAgIEBfbmFtZXNwYWNlcyA9IG51bGxcbiAgYWRkTmFtZXNwYWNlczogKHNwYWNlcykgLT5cbiAgICBpZiBzcGFjZXMgXG4gICAgICBpZiB0eXBlb2Ygc3BhY2VzID09ICdzdHJpbmcnXG4gICAgICAgIHNwYWNlcyA9IFtzcGFjZXNdXG4gICAgICBmb3Igc3BhY2UgaW4gc3BhY2VzIFxuICAgICAgICBAYWRkTmFtZVNwYWNlKHNwYWNlKVxuICByZW1vdmVOYW1lU3BhY2U6IChuYW1lKSAtPlxuICAgIEBuYW1lU3BhY2VzID0gQG5hbWVTcGFjZXMuZmlsdGVyIChuKSAtPiBuIGlzbnQgbmFtZVxuXG4gIGdldE5hbWVTcGFjZXM6IC0+XG4gICAgdW5sZXNzIEBfbmFtZXNwYWNlcz9cbiAgICAgIG5wY3MgPSBbJ2NvcmUnXS5jb25jYXQoQG5hbWVTcGFjZXMpXG4gICAgICBpZiBAcGFyZW50P1xuICAgICAgICBucGNzID0gbnBjcy5jb25jYXQoQHBhcmVudC5nZXROYW1lU3BhY2VzKCkpXG4gICAgICBAX25hbWVzcGFjZXMgPSBBcnJheUhlbHBlci51bmlxdWUobnBjcylcbiAgICByZXR1cm4gQF9uYW1lc3BhY2VzXG4gIGdldENtZDogKGNtZE5hbWUsbmFtZVNwYWNlcyA9IFtdKSAtPlxuICAgIGZpbmRlciA9IEBnZXRGaW5kZXIoY21kTmFtZSxuYW1lU3BhY2VzKVxuICAgIHJldHVybiBmaW5kZXIuZmluZCgpXG4gIGdldEZpbmRlcjogKGNtZE5hbWUsbmFtZVNwYWNlcyA9IFtdKSAtPlxuICAgIHJldHVybiBuZXcgQ21kRmluZGVyKGNtZE5hbWUsIHtcbiAgICAgIG5hbWVzcGFjZXM6IG5hbWVTcGFjZXNcbiAgICAgIHVzZURldGVjdG9yczogQGlzUm9vdCgpXG4gICAgICBjb2Rld2F2ZTogQGNvZGV3YXZlXG4gICAgICBwYXJlbnRDb250ZXh0OiB0aGlzXG4gICAgfSlcbiAgaXNSb290OiAtPlxuICAgIHJldHVybiAhQHBhcmVudD9cbiAgd3JhcENvbW1lbnQ6IChzdHIpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIGNjLmluZGV4T2YoJyVzJykgPiAtMVxuICAgICAgcmV0dXJuIGNjLnJlcGxhY2UoJyVzJyxzdHIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyICsgJyAnICsgY2NcbiAgd3JhcENvbW1lbnRMZWZ0OiAoc3RyID0gJycpIC0+XG4gICAgY2MgPSBAZ2V0Q29tbWVudENoYXIoKVxuICAgIGlmIChpID0gY2MuaW5kZXhPZignJXMnKSkgPiAtMVxuICAgICAgcmV0dXJuIGNjLnN1YnN0cigwLGkpICsgc3RyXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNjICsgJyAnICsgc3RyXG4gIHdyYXBDb21tZW50UmlnaHQ6IChzdHIgPSAnJykgLT5cbiAgICBjYyA9IEBnZXRDb21tZW50Q2hhcigpXG4gICAgaWYgKGkgPSBjYy5pbmRleE9mKCclcycpKSA+IC0xXG4gICAgICByZXR1cm4gc3RyICsgY2Muc3Vic3RyKGkrMilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gc3RyICsgJyAnICsgY2NcbiAgY21kSW5zdGFuY2VGb3I6IChjbWQpIC0+XG4gICAgcmV0dXJuIG5ldyBDbWRJbnN0YW5jZShjbWQsdGhpcylcbiAgZ2V0Q29tbWVudENoYXI6IC0+XG4gICAgaWYgQGNvbW1lbnRDaGFyP1xuICAgICAgcmV0dXJuIEBjb21tZW50Q2hhclxuICAgIGNtZCA9IEBnZXRDbWQoJ2NvbW1lbnQnKVxuICAgIGNoYXIgPSAnPCEtLSAlcyAtLT4nXG4gICAgaWYgY21kP1xuICAgICAgaW5zdCA9IEBjbWRJbnN0YW5jZUZvcihjbWQpXG4gICAgICBpbnN0LmNvbnRlbnQgPSAnJXMnXG4gICAgICByZXMgPSBpbnN0LnJlc3VsdCgpXG4gICAgICBpZiByZXM/XG4gICAgICAgIGNoYXIgPSByZXNcbiAgICBAY29tbWVudENoYXIgPSBjaGFyXG4gICAgcmV0dXJuIEBjb21tZW50Q2hhciIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IFN0clBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcblxuZXhwb3J0IGNsYXNzIEVkaXRvclxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAbmFtZXNwYWNlID0gbnVsbFxuICAgIEBfbGFuZyA9IG51bGxcbiAgYmluZGVkVG86IChjb2Rld2F2ZSkgLT5cbiAgICAjXG4gIHRleHQ6ICh2YWwpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgdGV4dExlbjogLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIHRleHRTdWJzdHI6IChzdGFydCwgZW5kKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgaW5zZXJ0VGV4dEF0OiAodGV4dCwgcG9zKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBnZXRDdXJzb3JQb3M6IC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kID0gbnVsbCkgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGJlZ2luVW5kb0FjdGlvbjogLT5cbiAgICAjXG4gIGVuZFVuZG9BY3Rpb246IC0+XG4gICAgI1xuICBnZXRMYW5nOiAtPlxuICAgIHJldHVybiBAX2xhbmdcbiAgc2V0TGFuZzogKHZhbCkgLT5cbiAgICBAX2xhbmcgPSB2YWxcbiAgZ2V0RW1tZXRDb250ZXh0T2JqZWN0OiAtPlxuICAgIHJldHVybiBudWxsXG4gIGFsbG93TXVsdGlTZWxlY3Rpb246IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIHNldE11bHRpU2VsOiAoc2VsZWN0aW9ucykgLT5cbiAgICB0aHJvdyBcIk5vdCBJbXBsZW1lbnRlZFwiXG4gIGdldE11bHRpU2VsOiAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgY2FuTGlzdGVuVG9DaGFuZ2U6IC0+XG4gICAgcmV0dXJuIGZhbHNlXG4gIGFkZENoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgdGhyb3cgXCJOb3QgSW1wbGVtZW50ZWRcIlxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcjogKGNhbGxiYWNrKSAtPlxuICAgIHRocm93IFwiTm90IEltcGxlbWVudGVkXCJcbiAgXG4gIGdldExpbmVBdDogKHBvcykgLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAZmluZExpbmVTdGFydChwb3MpLEBmaW5kTGluZUVuZChwb3MpKVxuICBmaW5kTGluZVN0YXJ0OiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCJdLCAtMSlcbiAgICByZXR1cm4gaWYgcCB0aGVuIHAucG9zKzEgZWxzZSAwXG4gIGZpbmRMaW5lRW5kOiAocG9zKSAtPiBcbiAgICBwID0gQGZpbmRBbnlOZXh0KHBvcyAsW1wiXFxuXCIsXCJcXHJcIl0pXG4gICAgcmV0dXJuIGlmIHAgdGhlbiBwLnBvcyBlbHNlIEB0ZXh0TGVuKClcbiAgXG4gIGZpbmRBbnlOZXh0OiAoc3RhcnQsc3RyaW5ncyxkaXJlY3Rpb24gPSAxKSAtPiBcbiAgICBpZiBkaXJlY3Rpb24gPiAwXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoc3RhcnQsQHRleHRMZW4oKSlcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gQHRleHRTdWJzdHIoMCxzdGFydClcbiAgICBiZXN0UG9zID0gbnVsbFxuICAgIGZvciBzdHJpIGluIHN0cmluZ3NcbiAgICAgIHBvcyA9IGlmIGRpcmVjdGlvbiA+IDAgdGhlbiB0ZXh0LmluZGV4T2Yoc3RyaSkgZWxzZSB0ZXh0Lmxhc3RJbmRleE9mKHN0cmkpXG4gICAgICBpZiBwb3MgIT0gLTFcbiAgICAgICAgaWYgIWJlc3RQb3M/IG9yIGJlc3RQb3MqZGlyZWN0aW9uID4gcG9zKmRpcmVjdGlvblxuICAgICAgICAgIGJlc3RQb3MgPSBwb3NcbiAgICAgICAgICBiZXN0U3RyID0gc3RyaVxuICAgIGlmIGJlc3RTdHI/XG4gICAgICByZXR1cm4gbmV3IFN0clBvcygoaWYgZGlyZWN0aW9uID4gMCB0aGVuIGJlc3RQb3MgKyBzdGFydCBlbHNlIGJlc3RQb3MpLGJlc3RTdHIpXG4gICAgcmV0dXJuIG51bGxcbiAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzOiAocmVwbGFjZW1lbnRzKSAtPlxuICAgIHNlbGVjdGlvbnMgPSBbXVxuICAgIG9mZnNldCA9IDBcbiAgICBmb3IgcmVwbCBpbiByZXBsYWNlbWVudHNcbiAgICAgIHJlcGwud2l0aEVkaXRvcih0aGlzKVxuICAgICAgcmVwbC5hcHBseU9mZnNldChvZmZzZXQpXG4gICAgICByZXBsLmFwcGx5KClcbiAgICAgIG9mZnNldCArPSByZXBsLm9mZnNldEFmdGVyKHRoaXMpXG4gICAgICBcbiAgICAgIHNlbGVjdGlvbnMgPSBzZWxlY3Rpb25zLmNvbmNhdChyZXBsLnNlbGVjdGlvbnMpXG4gICAgQGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9ucyhzZWxlY3Rpb25zKVxuICAgICAgXG4gIGFwcGx5UmVwbGFjZW1lbnRzU2VsZWN0aW9uczogKHNlbGVjdGlvbnMpIC0+XG4gICAgaWYgc2VsZWN0aW9ucy5sZW5ndGggPiAwXG4gICAgICBpZiBAYWxsb3dNdWx0aVNlbGVjdGlvbigpXG4gICAgICAgIEBzZXRNdWx0aVNlbChzZWxlY3Rpb25zKVxuICAgICAgZWxzZVxuICAgICAgICBAc2V0Q3Vyc29yUG9zKHNlbGVjdGlvbnNbMF0uc3RhcnQsc2VsZWN0aW9uc1swXS5lbmQpIiwiZXhwb3J0IGNsYXNzIExvZ2dlclxuICBsb2c6IChhcmdzLi4uKSAtPlxuICAgIGlmIHdpbmRvdy5jb25zb2xlIGFuZCB0aGlzLmVuYWJsZWRcbiAgICAgIGZvciBtc2cgaW4gYXJnc1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpXG4gIGVuYWJsZWQ6IHRydWVcbiAgcnVudGltZTogKGZ1bmN0LG5hbWUgPSBcImZ1bmN0aW9uXCIpIC0+XG4gICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlcyA9IGZ1bmN0KClcbiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgY29uc29sZS5sb2coXCIje25hbWV9IHRvb2sgI3t0MSAtIHQwfSBtaWxsaXNlY29uZHMuXCIpXG4gICAgcmVzXG4gIG1vbml0b3JEYXRhOiB7fVxuICB0b01vbml0b3I6IChvYmosbmFtZSxwcmVmaXg9JycpIC0+XG4gICAgZnVuY3QgPSBvYmpbbmFtZV1cbiAgICBvYmpbbmFtZV0gPSAtPiBcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICAgIHRoaXMubW9uaXRvcigoLT4gZnVuY3QuYXBwbHkob2JqLGFyZ3MpKSxwcmVmaXgrbmFtZSlcbiAgbW9uaXRvcjogKGZ1bmN0LG5hbWUpIC0+XG4gICAgdDAgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlcyA9IGZ1bmN0KClcbiAgICB0MSA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgaWYgdGhpcy5tb25pdG9yRGF0YVtuYW1lXT9cbiAgICAgIHRoaXMubW9uaXRvckRhdGFbbmFtZV0uY291bnQrK1xuICAgICAgdGhpcy5tb25pdG9yRGF0YVtuYW1lXS50b3RhbCs9IHQxIC0gdDBcbiAgICBlbHNlXG4gICAgICB0aGlzLm1vbml0b3JEYXRhW25hbWVdID0ge1xuICAgICAgICBjb3VudDogMVxuICAgICAgICB0b3RhbDogdDEgLSB0MFxuICAgICAgfVxuICAgIHJlc1xuICByZXN1bWU6IC0+XG4gICAgY29uc29sZS5sb2codGhpcy5tb25pdG9yRGF0YSlcbiIsImV4cG9ydCBjbGFzcyBPcHRpb25PYmplY3RcbiAgc2V0T3B0czogKG9wdGlvbnMsZGVmYXVsdHMpLT5cbiAgICBAZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIGlmIGtleSBvZiBvcHRpb25zXG4gICAgICAgIEBzZXRPcHQoa2V5LG9wdGlvbnNba2V5XSlcbiAgICAgIGVsc2VcbiAgICAgICAgQHNldE9wdChrZXksdmFsKVxuICAgICAgICBcbiAgc2V0T3B0OiAoa2V5LCB2YWwpLT5cbiAgICBpZiB0aGlzW2tleV0/LmNhbGw/XG4gICAgICB0aGlzW2tleV0odmFsKVxuICAgIGVsc2VcbiAgICAgIHRoaXNba2V5XT0gdmFsXG4gICAgICAgIFxuICBnZXRPcHQ6IChrZXkpLT5cbiAgICBpZiB0aGlzW2tleV0/LmNhbGw/XG4gICAgICByZXR1cm4gdGhpc1trZXldKClcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGhpc1trZXldXG4gIFxuICBnZXRPcHRzOiAtPlxuICAgIG9wdHMgPSB7fVxuICAgIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICAgIG9wdHNba2V5XSA9IEBnZXRPcHQoa2V5KVxuICAgIHJldHVybiBvcHRzIiwiIyBbcGF3YV1cbiMgICByZXBsYWNlICdyZXBsYWNlKC9cXHQvZycgJ3JlcGxhY2UoXCJcXHRcIidcblxuaW1wb3J0IHsgQ21kSW5zdGFuY2UgfSBmcm9tICcuL0NtZEluc3RhbmNlJztcbmltcG9ydCB7IEJveEhlbHBlciB9IGZyb20gJy4vQm94SGVscGVyJztcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvUG9zJztcbmltcG9ydCB7IFN0clBvcyB9IGZyb20gJy4vcG9zaXRpb25pbmcvU3RyUG9zJztcbmltcG9ydCB7IFJlcGxhY2VtZW50IH0gZnJvbSAnLi9wb3NpdGlvbmluZy9SZXBsYWNlbWVudCc7XG5pbXBvcnQgeyBTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcbmltcG9ydCB7IE5hbWVzcGFjZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9OYW1lc3BhY2VIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb25lZENtZEluc3RhbmNlIGV4dGVuZHMgQ21kSW5zdGFuY2VcbiAgY29uc3RydWN0b3I6IChAY29kZXdhdmUsQHBvcyxAc3RyKSAtPlxuICAgIHN1cGVyKClcbiAgICB1bmxlc3MgQGlzRW1wdHkoKVxuICAgICAgQF9jaGVja0Nsb3NlcigpXG4gICAgICBAb3BlbmluZyA9IEBzdHJcbiAgICAgIEBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICAgIEBfc3BsaXRDb21wb25lbnRzKClcbiAgICAgIEBfZmluZENsb3NpbmcoKVxuICAgICAgQF9jaGVja0Vsb25nYXRlZCgpXG4gIF9jaGVja0Nsb3NlcjogLT5cbiAgICBub0JyYWNrZXQgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cilcbiAgICBpZiBub0JyYWNrZXQuc3Vic3RyaW5nKDAsQGNvZGV3YXZlLmNsb3NlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5jbG9zZUNoYXIgYW5kIGYgPSBAX2ZpbmRPcGVuaW5nUG9zKClcbiAgICAgIEBjbG9zaW5nUG9zID0gbmV3IFN0clBvcyhAcG9zLCBAc3RyKVxuICAgICAgQHBvcyA9IGYucG9zXG4gICAgICBAc3RyID0gZi5zdHJcbiAgX2ZpbmRPcGVuaW5nUG9zOiAtPlxuICAgIGNtZE5hbWUgPSBAX3JlbW92ZUJyYWNrZXQoQHN0cikuc3Vic3RyaW5nKEBjb2Rld2F2ZS5jbG9zZUNoYXIubGVuZ3RoKVxuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIGNtZE5hbWVcbiAgICBjbG9zaW5nID0gQHN0clxuICAgIGlmIGYgPSBAY29kZXdhdmUuZmluZE1hdGNoaW5nUGFpcihAcG9zLG9wZW5pbmcsY2xvc2luZywtMSlcbiAgICAgIGYuc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGYucG9zLEBjb2Rld2F2ZS5maW5kTmV4dEJyYWtldChmLnBvcytmLnN0ci5sZW5ndGgpK0Bjb2Rld2F2ZS5icmFrZXRzLmxlbmd0aClcbiAgICAgIHJldHVybiBmXG4gIF9zcGxpdENvbXBvbmVudHM6IC0+XG4gICAgcGFydHMgPSBAbm9CcmFja2V0LnNwbGl0KFwiIFwiKTtcbiAgICBAY21kTmFtZSA9IHBhcnRzLnNoaWZ0KClcbiAgICBAcmF3UGFyYW1zID0gcGFydHMuam9pbihcIiBcIilcbiAgX3BhcnNlUGFyYW1zOihwYXJhbXMpIC0+XG4gICAgQHBhcmFtcyA9IFtdXG4gICAgQG5hbWVkID0gQGdldERlZmF1bHRzKClcbiAgICBpZiBAY21kP1xuICAgICAgbmFtZVRvUGFyYW0gPSBAZ2V0T3B0aW9uKCduYW1lVG9QYXJhbScpXG4gICAgICBpZiBuYW1lVG9QYXJhbT8gXG4gICAgICAgIEBuYW1lZFtuYW1lVG9QYXJhbV0gPSBAY21kTmFtZVxuICAgIGlmIHBhcmFtcy5sZW5ndGhcbiAgICAgIGlmIEBjbWQ/XG4gICAgICAgIGFsbG93ZWROYW1lZCA9IEBnZXRPcHRpb24oJ2FsbG93ZWROYW1lZCcpIFxuICAgICAgaW5TdHIgPSBmYWxzZVxuICAgICAgcGFyYW0gPSAnJ1xuICAgICAgbmFtZSA9IGZhbHNlXG4gICAgICBmb3IgaSBpbiBbMC4uKHBhcmFtcy5sZW5ndGgtMSldXG4gICAgICAgIGNociA9IHBhcmFtc1tpXVxuICAgICAgICBpZiBjaHIgPT0gJyAnIGFuZCAhaW5TdHJcbiAgICAgICAgICBpZihuYW1lKVxuICAgICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGFyYW1zLnB1c2gocGFyYW0pXG4gICAgICAgICAgcGFyYW0gPSAnJ1xuICAgICAgICAgIG5hbWUgPSBmYWxzZVxuICAgICAgICBlbHNlIGlmIGNociBpbiBbJ1wiJyxcIidcIl0gYW5kIChpID09IDAgb3IgcGFyYW1zW2ktMV0gIT0gJ1xcXFwnKVxuICAgICAgICAgIGluU3RyID0gIWluU3RyXG4gICAgICAgIGVsc2UgaWYgY2hyID09ICc6JyBhbmQgIW5hbWUgYW5kICFpblN0ciBhbmQgKCFhbGxvd2VkTmFtZWQ/IG9yIG5hbWUgaW4gYWxsb3dlZE5hbWVkKVxuICAgICAgICAgIG5hbWUgPSBwYXJhbVxuICAgICAgICAgIHBhcmFtID0gJydcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBhcmFtICs9IGNoclxuICAgICAgaWYgcGFyYW0ubGVuZ3RoXG4gICAgICAgIGlmKG5hbWUpXG4gICAgICAgICAgQG5hbWVkW25hbWVdID0gcGFyYW1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBwYXJhbXMucHVzaChwYXJhbSlcbiAgX2ZpbmRDbG9zaW5nOiAtPlxuICAgIGlmIGYgPSBAX2ZpbmRDbG9zaW5nUG9zKClcbiAgICAgIEBjb250ZW50ID0gU3RyaW5nSGVscGVyLnRyaW1FbXB0eUxpbmUoQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MrQHN0ci5sZW5ndGgsZi5wb3MpKVxuICAgICAgQHN0ciA9IEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zLGYucG9zK2Yuc3RyLmxlbmd0aClcbiAgX2ZpbmRDbG9zaW5nUG9zOiAtPlxuICAgIHJldHVybiBAY2xvc2luZ1BvcyBpZiBAY2xvc2luZ1Bvcz9cbiAgICBjbG9zaW5nID0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuY2xvc2VDaGFyICsgQGNtZE5hbWUgKyBAY29kZXdhdmUuYnJha2V0c1xuICAgIG9wZW5pbmcgPSBAY29kZXdhdmUuYnJha2V0cyArIEBjbWROYW1lXG4gICAgaWYgZiA9IEBjb2Rld2F2ZS5maW5kTWF0Y2hpbmdQYWlyKEBwb3MrQHN0ci5sZW5ndGgsIG9wZW5pbmcsIGNsb3NpbmcpXG4gICAgICByZXR1cm4gQGNsb3NpbmdQb3MgPSBmXG4gIF9jaGVja0Vsb25nYXRlZDogLT5cbiAgICBlbmRQb3MgPSBAZ2V0RW5kUG9zKClcbiAgICBtYXggPSBAY29kZXdhdmUuZWRpdG9yLnRleHRMZW4oKVxuICAgIHdoaWxlIGVuZFBvcyA8IG1heCBhbmQgQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKGVuZFBvcyxlbmRQb3MrQGNvZGV3YXZlLmRlY28ubGVuZ3RoKSA9PSBAY29kZXdhdmUuZGVjb1xuICAgICAgZW5kUG9zKz1AY29kZXdhdmUuZGVjby5sZW5ndGhcbiAgICBpZiBlbmRQb3MgPj0gbWF4IG9yIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihlbmRQb3MsIGVuZFBvcyArIEBjb2Rld2F2ZS5kZWNvLmxlbmd0aCkgaW4gWycgJyxcIlxcblwiLFwiXFxyXCJdXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICBfY2hlY2tCb3g6IC0+XG4gICAgaWYgQGNvZGV3YXZlLmluSW5zdGFuY2U/IGFuZCBAY29kZXdhdmUuaW5JbnN0YW5jZS5jbWQubmFtZSA9PSAnY29tbWVudCdcbiAgICAgIHJldHVyblxuICAgIGNsID0gQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KClcbiAgICBjciA9IEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKVxuICAgIGVuZFBvcyA9IEBnZXRFbmRQb3MoKSArIGNyLmxlbmd0aFxuICAgIGlmIEBjb2Rld2F2ZS5lZGl0b3IudGV4dFN1YnN0cihAcG9zIC0gY2wubGVuZ3RoLEBwb3MpID09IGNsIGFuZCBAY29kZXdhdmUuZWRpdG9yLnRleHRTdWJzdHIoZW5kUG9zIC0gY3IubGVuZ3RoLGVuZFBvcykgPT0gY3JcbiAgICAgIEBwb3MgPSBAcG9zIC0gY2wubGVuZ3RoXG4gICAgICBAc3RyID0gQGNvZGV3YXZlLmVkaXRvci50ZXh0U3Vic3RyKEBwb3MsZW5kUG9zKVxuICAgICAgQF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQoKVxuICAgIGVsc2UgaWYgQGdldFBvcygpLnNhbWVMaW5lc1ByZWZpeCgpLmluZGV4T2YoY2wpID4gLTEgYW5kIEBnZXRQb3MoKS5zYW1lTGluZXNTdWZmaXgoKS5pbmRleE9mKGNyKSA+IC0xXG4gICAgICBAaW5Cb3ggPSAxXG4gICAgICBAX3JlbW92ZUNvbW1lbnRGcm9tQ29udGVudCgpXG4gIF9yZW1vdmVDb21tZW50RnJvbUNvbnRlbnQ6IC0+XG4gICAgaWYgQGNvbnRlbnRcbiAgICAgIGVjbCA9IFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQGNvbnRleHQud3JhcENvbW1lbnRMZWZ0KCkpXG4gICAgICBlY3IgPSBTdHJpbmdIZWxwZXIuZXNjYXBlUmVnRXhwKEBjb250ZXh0LndyYXBDb21tZW50UmlnaHQoKSlcbiAgICAgIGVkID0gU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY29kZXdhdmUuZGVjbylcbiAgICAgIHJlMSA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqI3tlY2x9KD86I3tlZH0pK1xcXFxzKiguKj8pXFxcXHMqKD86I3tlZH0pKyN7ZWNyfSRcIiwgXCJnbVwiKSAjIFtwYXdhIHB5dGhvbl0gcmVwbGFjZSAnXCJnbVwiJyByZS5NXG4gICAgICByZTIgPSBuZXcgUmVnRXhwKFwiXlxcXFxzKig/OiN7ZWR9KSoje2Vjcn1cXHI/XFxuXCIpXG4gICAgICByZTMgPSBuZXcgUmVnRXhwKFwiXFxuXFxcXHMqI3tlY2x9KD86I3tlZH0pKlxcXFxzKiRcIilcbiAgICAgIEBjb250ZW50ID0gQGNvbnRlbnQucmVwbGFjZShyZTEsJyQxJykucmVwbGFjZShyZTIsJycpLnJlcGxhY2UocmUzLCcnKVxuICBfZ2V0UGFyZW50Q21kczogLT5cbiAgICBAcGFyZW50ID0gQGNvZGV3YXZlLmdldEVuY2xvc2luZ0NtZChAZ2V0RW5kUG9zKCkpPy5pbml0KClcbiAgc2V0TXVsdGlQb3M6IChtdWx0aVBvcykgLT5cbiAgICBAbXVsdGlQb3MgPSBtdWx0aVBvc1xuICBfZ2V0Q21kT2JqOiAtPlxuICAgIEBnZXRDbWQoKVxuICAgIEBfY2hlY2tCb3goKVxuICAgIEBjb250ZW50ID0gQHJlbW92ZUluZGVudEZyb21Db250ZW50KEBjb250ZW50KVxuICAgIHN1cGVyKClcbiAgX2luaXRQYXJhbXM6IC0+XG4gICAgQF9wYXJzZVBhcmFtcyhAcmF3UGFyYW1zKVxuICBnZXRDb250ZXh0OiAtPlxuICAgIHJldHVybiBAY29udGV4dCBvciBAY29kZXdhdmUuY29udGV4dFxuICBnZXRDbWQ6IC0+XG4gICAgdW5sZXNzIEBjbWQ/XG4gICAgICBAX2dldFBhcmVudENtZHMoKVxuICAgICAgaWYgQG5vQnJhY2tldC5zdWJzdHJpbmcoMCxAY29kZXdhdmUubm9FeGVjdXRlQ2hhci5sZW5ndGgpID09IEBjb2Rld2F2ZS5ub0V4ZWN1dGVDaGFyXG4gICAgICAgIEBjbWQgPSBDb21tYW5kLmNtZHMuZ2V0Q21kKCdjb3JlOm5vX2V4ZWN1dGUnKVxuICAgICAgICBAY29udGV4dCA9IEBjb2Rld2F2ZS5jb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIEBmaW5kZXIgPSBAZ2V0RmluZGVyKEBjbWROYW1lKVxuICAgICAgICBAY29udGV4dCA9IEBmaW5kZXIuY29udGV4dFxuICAgICAgICBAY21kID0gQGZpbmRlci5maW5kKClcbiAgICAgICAgaWYgQGNtZD9cbiAgICAgICAgICBAY29udGV4dC5hZGROYW1lU3BhY2UoQGNtZC5mdWxsTmFtZSlcbiAgICByZXR1cm4gQGNtZFxuICBnZXRGaW5kZXI6IChjbWROYW1lKS0+XG4gICAgZmluZGVyID0gQGNvZGV3YXZlLmNvbnRleHQuZ2V0RmluZGVyKGNtZE5hbWUsQF9nZXRQYXJlbnROYW1lc3BhY2VzKCkpXG4gICAgZmluZGVyLmluc3RhbmNlID0gdGhpc1xuICAgIHJldHVybiBmaW5kZXJcbiAgX2dldFBhcmVudE5hbWVzcGFjZXM6IC0+XG4gICAgbnNwY3MgPSBbXVxuICAgIG9iaiA9IHRoaXNcbiAgICB3aGlsZSBvYmoucGFyZW50P1xuICAgICAgb2JqID0gb2JqLnBhcmVudFxuICAgICAgbnNwY3MucHVzaChvYmouY21kLmZ1bGxOYW1lKSBpZiBvYmouY21kPyBhbmQgb2JqLmNtZC5mdWxsTmFtZT9cbiAgICByZXR1cm4gbnNwY3NcbiAgX3JlbW92ZUJyYWNrZXQ6IChzdHIpLT5cbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZyhAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgsc3RyLmxlbmd0aC1AY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpXG4gIGFsdGVyQWxpYXNPZjogKGFsaWFzT2YpLT5cbiAgICBbbnNwYywgY21kTmFtZV0gPSBOYW1lc3BhY2VIZWxwZXIuc3BsaXQoQGNtZE5hbWUpXG4gICAgcmV0dXJuIGFsaWFzT2YucmVwbGFjZSgnJW5hbWUlJyxjbWROYW1lKVxuICBpc0VtcHR5OiAtPlxuICAgIHJldHVybiBAc3RyID09IEBjb2Rld2F2ZS5icmFrZXRzICsgQGNvZGV3YXZlLmNsb3NlQ2hhciArIEBjb2Rld2F2ZS5icmFrZXRzIG9yIEBzdHIgPT0gQGNvZGV3YXZlLmJyYWtldHMgKyBAY29kZXdhdmUuYnJha2V0c1xuICBleGVjdXRlOiAtPlxuICAgIGlmIEBpc0VtcHR5KClcbiAgICAgIGlmIEBjb2Rld2F2ZS5jbG9zaW5nUHJvbXA/IGFuZCBAY29kZXdhdmUuY2xvc2luZ1Byb21wLndoaXRoaW5PcGVuQm91bmRzKEBwb3MgKyBAY29kZXdhdmUuYnJha2V0cy5sZW5ndGgpP1xuICAgICAgICBAY29kZXdhdmUuY2xvc2luZ1Byb21wLmNhbmNlbCgpXG4gICAgICBlbHNlXG4gICAgICAgIEByZXBsYWNlV2l0aCgnJylcbiAgICBlbHNlIGlmIEBjbWQ/XG4gICAgICBpZiBiZWZvcmVGdW5jdCA9IEBnZXRPcHRpb24oJ2JlZm9yZUV4ZWN1dGUnKVxuICAgICAgICBiZWZvcmVGdW5jdCh0aGlzKVxuICAgICAgaWYgQHJlc3VsdElzQXZhaWxhYmxlKClcbiAgICAgICAgaWYgKHJlcyA9IEByZXN1bHQoKSk/XG4gICAgICAgICAgQHJlcGxhY2VXaXRoKHJlcylcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBAcnVuRXhlY3V0ZUZ1bmN0KClcbiAgZ2V0RW5kUG9zOiAtPlxuICAgIHJldHVybiBAcG9zK0BzdHIubGVuZ3RoXG4gIGdldFBvczogLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAcG9zLEBwb3MrQHN0ci5sZW5ndGgpLndpdGhFZGl0b3IoQGNvZGV3YXZlLmVkaXRvcilcbiAgZ2V0T3BlbmluZ1BvczogLT5cbiAgICByZXR1cm4gbmV3IFBvcyhAcG9zLEBwb3MrQG9wZW5pbmcubGVuZ3RoKS53aXRoRWRpdG9yKEBjb2Rld2F2ZS5lZGl0b3IpXG4gIGdldEluZGVudDogLT5cbiAgICB1bmxlc3MgQGluZGVudExlbj9cbiAgICAgIGlmIEBpbkJveD9cbiAgICAgICAgaGVscGVyID0gbmV3IEJveEhlbHBlcihAY29udGV4dClcbiAgICAgICAgQGluZGVudExlbiA9IGhlbHBlci5yZW1vdmVDb21tZW50KEBnZXRQb3MoKS5zYW1lTGluZXNQcmVmaXgoKSkubGVuZ3RoXG4gICAgICBlbHNlXG4gICAgICAgIEBpbmRlbnRMZW4gPSBAcG9zIC0gQGdldFBvcygpLnByZXZFT0woKVxuICAgIHJldHVybiBAaW5kZW50TGVuXG4gIHJlbW92ZUluZGVudEZyb21Db250ZW50OiAodGV4dCkgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmVnID0gbmV3IFJlZ0V4cCgnXlxcXFxzeycrQGdldEluZGVudCgpKyd9JywnZ20nKVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsJycpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRleHRcbiAgYWx0ZXJSZXN1bHRGb3JCb3g6IChyZXBsKSAtPlxuICAgIG9yaWdpbmFsID0gcmVwbC5jb3B5KClcbiAgICBoZWxwZXIgPSBuZXcgQm94SGVscGVyKEBjb250ZXh0KVxuICAgIGhlbHBlci5nZXRPcHRGcm9tTGluZShvcmlnaW5hbC50ZXh0V2l0aEZ1bGxMaW5lcygpLGZhbHNlKVxuICAgIGlmIEBnZXRPcHRpb24oJ3JlcGxhY2VCb3gnKVxuICAgICAgYm94ID0gaGVscGVyLmdldEJveEZvclBvcyhvcmlnaW5hbClcbiAgICAgIFtyZXBsLnN0YXJ0LCByZXBsLmVuZF0gPSBbYm94LnN0YXJ0LCBib3guZW5kXVxuICAgICAgQGluZGVudExlbiA9IGhlbHBlci5pbmRlbnRcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgZWxzZVxuICAgICAgcmVwbC50ZXh0ID0gQGFwcGx5SW5kZW50KHJlcGwudGV4dClcbiAgICAgIHJlcGwuc3RhcnQgPSBvcmlnaW5hbC5wcmV2RU9MKClcbiAgICAgIHJlcGwuZW5kID0gb3JpZ2luYWwubmV4dEVPTCgpXG4gICAgICByZXMgPSBoZWxwZXIucmVmb3JtYXRMaW5lcyhvcmlnaW5hbC5zYW1lTGluZXNQcmVmaXgoKSArIEBjb2Rld2F2ZS5tYXJrZXIgKyByZXBsLnRleHQgKyBAY29kZXdhdmUubWFya2VyICsgb3JpZ2luYWwuc2FtZUxpbmVzU3VmZml4KCksIHttdWx0aWxpbmU6ZmFsc2V9KVxuICAgICAgW3JlcGwucHJlZml4LHJlcGwudGV4dCxyZXBsLnN1ZmZpeF0gPSByZXMuc3BsaXQoQGNvZGV3YXZlLm1hcmtlcilcbiAgICByZXR1cm4gcmVwbFxuICBnZXRDdXJzb3JGcm9tUmVzdWx0OiAocmVwbCkgLT5cbiAgICBjdXJzb3JQb3MgPSByZXBsLnJlc1Bvc0JlZm9yZVByZWZpeCgpXG4gICAgaWYgQGNtZD8gYW5kIEBjb2Rld2F2ZS5jaGVja0NhcnJldCBhbmQgQGdldE9wdGlvbignY2hlY2tDYXJyZXQnKVxuICAgICAgaWYgKHAgPSBAY29kZXdhdmUuZ2V0Q2FycmV0UG9zKHJlcGwudGV4dCkpPyBcbiAgICAgICAgY3Vyc29yUG9zID0gcmVwbC5zdGFydCtyZXBsLnByZWZpeC5sZW5ndGgrcFxuICAgICAgcmVwbC50ZXh0ID0gQGNvZGV3YXZlLnJlbW92ZUNhcnJldChyZXBsLnRleHQpXG4gICAgcmV0dXJuIGN1cnNvclBvc1xuICBjaGVja011bHRpOiAocmVwbCkgLT5cbiAgICBpZiBAbXVsdGlQb3M/IGFuZCBAbXVsdGlQb3MubGVuZ3RoID4gMVxuICAgICAgcmVwbGFjZW1lbnRzID0gW3JlcGxdXG4gICAgICBvcmlnaW5hbFRleHQgPSByZXBsLm9yaWdpbmFsVGV4dCgpXG4gICAgICBmb3IgcG9zLCBpIGluIEBtdWx0aVBvc1xuICAgICAgICBpZiBpID09IDBcbiAgICAgICAgICBvcmlnaW5hbFBvcyA9IHBvcy5zdGFydFxuICAgICAgICBlbHNlXG4gICAgICAgICAgbmV3UmVwbCA9IHJlcGwuY29weSgpLmFwcGx5T2Zmc2V0KHBvcy5zdGFydC1vcmlnaW5hbFBvcylcbiAgICAgICAgICBpZiBuZXdSZXBsLm9yaWdpbmFsVGV4dCgpID09IG9yaWdpbmFsVGV4dFxuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2gobmV3UmVwbClcbiAgICAgIHJldHVybiByZXBsYWNlbWVudHNcbiAgICBlbHNlXG4gICAgICByZXR1cm4gW3JlcGxdXG4gIHJlcGxhY2VXaXRoOiAodGV4dCkgLT5cbiAgICBAYXBwbHlSZXBsYWNlbWVudChuZXcgUmVwbGFjZW1lbnQoQHBvcyxAZ2V0RW5kUG9zKCksdGV4dCkpXG4gIGFwcGx5UmVwbGFjZW1lbnQ6IChyZXBsKSAtPlxuICAgIHJlcGwud2l0aEVkaXRvcihAY29kZXdhdmUuZWRpdG9yKVxuICAgIGlmIEBpbkJveD9cbiAgICAgIEBhbHRlclJlc3VsdEZvckJveChyZXBsKVxuICAgIGVsc2VcbiAgICAgIHJlcGwudGV4dCA9IEBhcHBseUluZGVudChyZXBsLnRleHQpXG4gICAgY3Vyc29yUG9zID0gQGdldEN1cnNvckZyb21SZXN1bHQocmVwbClcbiAgICByZXBsLnNlbGVjdGlvbnMgPSBbbmV3IFBvcyhjdXJzb3JQb3MsIGN1cnNvclBvcyldXG4gICAgcmVwbGFjZW1lbnRzID0gQGNoZWNrTXVsdGkocmVwbClcbiAgICBAY29kZXdhdmUuZWRpdG9yLmFwcGx5UmVwbGFjZW1lbnRzKHJlcGxhY2VtZW50cylcbiAgICBcbiAgICBAcmVwbGFjZVN0YXJ0ID0gcmVwbC5zdGFydFxuICAgIEByZXBsYWNlRW5kID0gcmVwbC5yZXNFbmQoKSIsImV4cG9ydCBjbGFzcyBQcm9jZXNzXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICMiLCJcbmV4cG9ydCBjbGFzcyBTdG9yYWdlXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICBzYXZlOiAoa2V5LHZhbCkgLT5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShAZnVsbEtleShrZXkpLCBKU09OLnN0cmluZ2lmeSh2YWwpKVxuICBsb2FkOiAoa2V5KSAtPlxuICAgIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oQGZ1bGxLZXkoa2V5KSkpXG4gIGZ1bGxLZXk6IChrZXkpIC0+XG4gICAgJ0NvZGVXYXZlXycra2V5IiwiaW1wb3J0IHsgVGV4dFBhcnNlciB9IGZyb20gJy4vVGV4dFBhcnNlcic7XG5pbXBvcnQgeyBQb3MgfSBmcm9tICcuL3Bvc2l0aW9uaW5nL1Bvcyc7XG5cbmV4cG9ydCBjbGFzcyBEb21LZXlMaXN0ZW5lclxuICBzdGFydExpc3RlbmluZzogKHRhcmdldCkgLT5cbiAgXG4gICAgdGltZW91dCA9IG51bGxcbiAgICBcbiAgICBvbmtleWRvd24gPSAoZSkgPT4gXG4gICAgICBpZiAoQ29kZXdhdmUuaW5zdGFuY2VzLmxlbmd0aCA8IDIgb3IgQG9iaiA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSBhbmQgZS5rZXlDb2RlID09IDY5ICYmIGUuY3RybEtleVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgQG9uQWN0aXZhdGlvbktleT9cbiAgICAgICAgICBAb25BY3RpdmF0aW9uS2V5KClcbiAgICBvbmtleXVwID0gKGUpID0+IFxuICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICBAb25BbnlDaGFuZ2UoZSlcbiAgICBvbmtleXByZXNzID0gKGUpID0+IFxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpIGlmIHRpbWVvdXQ/XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCAoPT5cbiAgICAgICAgaWYgQG9uQW55Q2hhbmdlP1xuICAgICAgICAgIEBvbkFueUNoYW5nZShlKVxuICAgICAgKSwgMTAwXG4gICAgICAgICAgICBcbiAgICBpZiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lclxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgb25rZXlwcmVzcylcbiAgICBlbHNlIGlmIHRhcmdldC5hdHRhY2hFdmVudFxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleWRvd25cIiwgb25rZXlkb3duKVxuICAgICAgICB0YXJnZXQuYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIG9ua2V5dXApXG4gICAgICAgIHRhcmdldC5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgb25rZXlwcmVzcylcblxuaXNFbGVtZW50ID0gKG9iaikgLT5cbiAgdHJ5XG4gICAgIyBVc2luZyBXMyBET00yICh3b3JrcyBmb3IgRkYsIE9wZXJhIGFuZCBDaHJvbSlcbiAgICBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICBjYXRjaCBlXG4gICAgIyBCcm93c2VycyBub3Qgc3VwcG9ydGluZyBXMyBET00yIGRvbid0IGhhdmUgSFRNTEVsZW1lbnQgYW5kXG4gICAgIyBhbiBleGNlcHRpb24gaXMgdGhyb3duIGFuZCB3ZSBlbmQgdXAgaGVyZS4gVGVzdGluZyBzb21lXG4gICAgIyBwcm9wZXJ0aWVzIHRoYXQgYWxsIGVsZW1lbnRzIGhhdmUuICh3b3JrcyBvbiBJRTcpXG4gICAgcmV0dXJuICh0eXBlb2Ygb2JqPT1cIm9iamVjdFwiKSAmJlxuICAgICAgKG9iai5ub2RlVHlwZT09MSkgJiYgKHR5cGVvZiBvYmouc3R5bGUgPT0gXCJvYmplY3RcIikgJiZcbiAgICAgICh0eXBlb2Ygb2JqLm93bmVyRG9jdW1lbnQgPT1cIm9iamVjdFwiKVxuXG4gICAgICAgIFxuZXhwb3J0IGNsYXNzIFRleHRBcmVhRWRpdG9yIGV4dGVuZHMgVGV4dFBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEB0YXJnZXQpIC0+XG4gICAgc3VwZXIoKVxuICAgIEBvYmogPSBpZiBpc0VsZW1lbnQoQHRhcmdldCkgdGhlbiBAdGFyZ2V0IGVsc2UgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQHRhcmdldClcbiAgICB1bmxlc3MgQG9iaj9cbiAgICAgIHRocm93IFwiVGV4dEFyZWEgbm90IGZvdW5kXCJcbiAgICBAbmFtZXNwYWNlID0gJ3RleHRhcmVhJ1xuICAgIEBjaGFuZ2VMaXN0ZW5lcnMgPSBbXVxuICAgIEBfc2tpcENoYW5nZUV2ZW50ID0gMFxuICBzdGFydExpc3RlbmluZzogRG9tS2V5TGlzdGVuZXIucHJvdG90eXBlLnN0YXJ0TGlzdGVuaW5nXG4gIG9uQW55Q2hhbmdlOiAoZSkgLT5cbiAgICBpZiBAX3NraXBDaGFuZ2VFdmVudCA8PSAwXG4gICAgICBmb3IgY2FsbGJhY2sgaW4gQGNoYW5nZUxpc3RlbmVyc1xuICAgICAgICBjYWxsYmFjaygpXG4gICAgZWxzZVxuICAgICAgQF9za2lwQ2hhbmdlRXZlbnQtLVxuICAgICAgQG9uU2tpcGVkQ2hhbmdlKCkgaWYgQG9uU2tpcGVkQ2hhbmdlP1xuICBza2lwQ2hhbmdlRXZlbnQ6IChuYiA9IDEpIC0+XG4gICAgQF9za2lwQ2hhbmdlRXZlbnQgKz0gbmJcbiAgYmluZGVkVG86IChjb2Rld2F2ZSkgLT5cbiAgICBAb25BY3RpdmF0aW9uS2V5ID0gLT4gY29kZXdhdmUub25BY3RpdmF0aW9uS2V5KClcbiAgICBAc3RhcnRMaXN0ZW5pbmcoZG9jdW1lbnQpXG4gIHNlbGVjdGlvblByb3BFeGlzdHM6IC0+XG4gICAgXCJzZWxlY3Rpb25TdGFydFwiIG9mIEBvYmpcbiAgaGFzRm9jdXM6IC0+IFxuICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaXMgQG9ialxuICB0ZXh0OiAodmFsKSAtPlxuICAgIGlmIHZhbD9cbiAgICAgIHVubGVzcyBAdGV4dEV2ZW50Q2hhbmdlKHZhbClcbiAgICAgICAgQG9iai52YWx1ZSA9IHZhbFxuICAgIEBvYmoudmFsdWVcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHRFdmVudENoYW5nZSh0ZXh0LCBzdGFydCwgZW5kKSBvciBAc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZCh0ZXh0LCBzdGFydCwgZW5kKSBvciBzdXBlcihzdGFydCwgZW5kLCB0ZXh0KVxuICB0ZXh0RXZlbnRDaGFuZ2U6ICh0ZXh0LCBzdGFydCA9IDAsIGVuZCA9IG51bGwpIC0+XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnVGV4dEV2ZW50JykgaWYgZG9jdW1lbnQuY3JlYXRlRXZlbnQ/XG4gICAgaWYgZXZlbnQ/IGFuZCBldmVudC5pbml0VGV4dEV2ZW50PyBhbmQgZXZlbnQuaXNUcnVzdGVkICE9IGZhbHNlXG4gICAgICBlbmQgPSBAdGV4dExlbigpIHVubGVzcyBlbmQ/XG4gICAgICBpZiB0ZXh0Lmxlbmd0aCA8IDFcbiAgICAgICAgaWYgc3RhcnQgIT0gMFxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihzdGFydC0xLHN0YXJ0KVxuICAgICAgICAgIHN0YXJ0LS1cbiAgICAgICAgZWxzZSBpZiBlbmQgIT0gQHRleHRMZW4oKVxuICAgICAgICAgIHRleHQgPSBAdGV4dFN1YnN0cihlbmQsZW5kKzEpXG4gICAgICAgICAgZW5kKytcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgZXZlbnQuaW5pdFRleHRFdmVudCgndGV4dElucHV0JywgdHJ1ZSwgdHJ1ZSwgbnVsbCwgdGV4dCwgOSlcbiAgICAgICMgQHNldEN1cnNvclBvcyhzdGFydCxlbmQpXG4gICAgICBAb2JqLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRcbiAgICAgIEBvYmouc2VsZWN0aW9uRW5kID0gZW5kXG4gICAgICBAb2JqLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgICBAc2tpcENoYW5nZUV2ZW50KClcbiAgICAgIHRydWVcbiAgICBlbHNlIFxuICAgICAgZmFsc2VcbiAgc3BsaWNlVGV4dFdpdGhFeGVjQ29tbWFuZDogKHRleHQsIHN0YXJ0ID0gMCwgZW5kID0gbnVsbCkgLT5cbiAgICBpZiBkb2N1bWVudC5leGVjQ29tbWFuZD9cbiAgICAgIGVuZCA9IEB0ZXh0TGVuKCkgdW5sZXNzIGVuZD9cbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpO1xuICAgIGVsc2UgXG4gICAgICBmYWxzZVxuXG4gIGdldEN1cnNvclBvczogLT5cbiAgICByZXR1cm4gQHRtcEN1cnNvclBvcyBpZiBAdG1wQ3Vyc29yUG9zP1xuICAgIGlmIEBoYXNGb2N1c1xuICAgICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgICAgbmV3IFBvcyhAb2JqLnNlbGVjdGlvblN0YXJ0LEBvYmouc2VsZWN0aW9uRW5kKVxuICAgICAgZWxzZVxuICAgICAgICBAZ2V0Q3Vyc29yUG9zRmFsbGJhY2soKVxuICBnZXRDdXJzb3JQb3NGYWxsYmFjazogLT5cbiAgICBpZiBAb2JqLmNyZWF0ZVRleHRSYW5nZVxuICAgICAgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKClcbiAgICAgIGlmIHNlbC5wYXJlbnRFbGVtZW50KCkgaXMgQG9ialxuICAgICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICAgIHJuZy5tb3ZlVG9Cb29rbWFyayBzZWwuZ2V0Qm9va21hcmsoKVxuICAgICAgICBsZW4gPSAwXG5cbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgbGVuKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcm5nLnNldEVuZFBvaW50IFwiU3RhcnRUb1N0YXJ0XCIsIEBvYmouY3JlYXRlVGV4dFJhbmdlKClcbiAgICAgICAgcG9zID0gbmV3IFBvcygwLGxlbilcbiAgICAgICAgd2hpbGUgcm5nLmNvbXBhcmVFbmRQb2ludHMoXCJFbmRUb1N0YXJ0XCIsIHJuZykgPiAwXG4gICAgICAgICAgcG9zLnN0YXJ0KytcbiAgICAgICAgICBwb3MuZW5kKytcbiAgICAgICAgICBybmcubW92ZUVuZChcImNoYXJhY3RlclwiLCAtMSlcbiAgICAgICAgcmV0dXJuIHBvc1xuICBzZXRDdXJzb3JQb3M6IChzdGFydCwgZW5kKSAtPlxuICAgIGVuZCA9IHN0YXJ0IGlmIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgaWYgQHNlbGVjdGlvblByb3BFeGlzdHNcbiAgICAgIEB0bXBDdXJzb3JQb3MgPSBuZXcgUG9zKHN0YXJ0LGVuZClcbiAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgQG9iai5zZWxlY3Rpb25FbmQgPSBlbmRcbiAgICAgIHNldFRpbWVvdXQgKD0+XG4gICAgICAgIEB0bXBDdXJzb3JQb3MgPSBudWxsXG4gICAgICAgIEBvYmouc2VsZWN0aW9uU3RhcnQgPSBzdGFydFxuICAgICAgICBAb2JqLnNlbGVjdGlvbkVuZCA9IGVuZFxuICAgICAgKSwgMVxuICAgIGVsc2UgXG4gICAgICBAc2V0Q3Vyc29yUG9zRmFsbGJhY2soc3RhcnQsIGVuZClcbiAgICByZXR1cm5cbiAgc2V0Q3Vyc29yUG9zRmFsbGJhY2s6IChzdGFydCwgZW5kKSAtPlxuICAgIGlmIEBvYmouY3JlYXRlVGV4dFJhbmdlXG4gICAgICBybmcgPSBAb2JqLmNyZWF0ZVRleHRSYW5nZSgpXG4gICAgICBybmcubW92ZVN0YXJ0IFwiY2hhcmFjdGVyXCIsIHN0YXJ0XG4gICAgICBybmcuY29sbGFwc2UoKVxuICAgICAgcm5nLm1vdmVFbmQgXCJjaGFyYWN0ZXJcIiwgZW5kIC0gc3RhcnRcbiAgICAgIHJuZy5zZWxlY3QoKVxuICBnZXRMYW5nOiAtPlxuICAgIHJldHVybiBAX2xhbmcgaWYgQF9sYW5nXG4gICAgQG9iai5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpIGlmIEBvYmouaGFzQXR0cmlidXRlKCdkYXRhLWxhbmcnKVxuICBzZXRMYW5nOiAodmFsKSAtPlxuICAgIEBfbGFuZyA9IHZhbFxuICAgIEBvYmouc2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnLHZhbClcbiAgY2FuTGlzdGVuVG9DaGFuZ2U6IC0+XG4gICAgcmV0dXJuIHRydWVcbiAgYWRkQ2hhbmdlTGlzdGVuZXI6IChjYWxsYmFjaykgLT5cbiAgICBAY2hhbmdlTGlzdGVuZXJzLnB1c2goY2FsbGJhY2spXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyOiAoY2FsbGJhY2spIC0+XG4gICAgaWYgKGkgPSBAY2hhbmdlTGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spKSA+IC0xXG4gICAgICBAY2hhbmdlTGlzdGVuZXJzLnNwbGljZShpLCAxKVxuICAgICAgXG4gICAgICBcbiAgYXBwbHlSZXBsYWNlbWVudHM6IChyZXBsYWNlbWVudHMpIC0+XG4gICAgaWYgcmVwbGFjZW1lbnRzLmxlbmd0aCA+IDAgYW5kIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zLmxlbmd0aCA8IDFcbiAgICAgIHJlcGxhY2VtZW50c1swXS5zZWxlY3Rpb25zID0gW0BnZXRDdXJzb3JQb3MoKV1cbiAgICBzdXBlcihyZXBsYWNlbWVudHMpO1xuICAgICAgIiwiIyBbcGF3YSBweXRob25dXG4jICAgcmVwbGFjZSAoRWRpdG9yKSAoZWRpdG9yLkVkaXRvcilcbiMgICByZXBsYWNlIEB0ZXh0KCkgIHNlbGYudGV4dFxuXG5pbXBvcnQgeyBFZGl0b3IgfSBmcm9tICcuL0VkaXRvcic7XG5cbmV4cG9ydCBjbGFzcyBUZXh0UGFyc2VyIGV4dGVuZHMgRWRpdG9yXG4gIGNvbnN0cnVjdG9yOiAoQF90ZXh0KSAtPlxuICAgIHN1cGVyKClcbiAgICBzZWxmLm5hbWVzcGFjZSA9ICd0ZXh0X3BhcnNlcidcbiAgdGV4dDogKHZhbCkgLT5cbiAgICBAX3RleHQgPSB2YWwgaWYgdmFsP1xuICAgIEBfdGV4dFxuICB0ZXh0Q2hhckF0OiAocG9zKSAtPlxuICAgIHJldHVybiBAdGV4dCgpW3Bvc11cbiAgdGV4dExlbjogKHBvcykgLT5cbiAgICByZXR1cm4gQHRleHQoKS5sZW5ndGhcbiAgdGV4dFN1YnN0cjogKHN0YXJ0LCBlbmQpIC0+XG4gICAgcmV0dXJuIEB0ZXh0KCkuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gIGluc2VydFRleHRBdDogKHRleHQsIHBvcykgLT5cbiAgICBAdGV4dChAdGV4dCgpLnN1YnN0cmluZygwLCBwb3MpK3RleHQrQHRleHQoKS5zdWJzdHJpbmcocG9zLEB0ZXh0KCkubGVuZ3RoKSlcbiAgc3BsaWNlVGV4dDogKHN0YXJ0LCBlbmQsIHRleHQpIC0+XG4gICAgQHRleHQoQHRleHQoKS5zbGljZSgwLCBzdGFydCkgKyAodGV4dCB8fCBcIlwiKSArIEB0ZXh0KCkuc2xpY2UoZW5kKSlcbiAgZ2V0Q3Vyc29yUG9zOiAtPlxuICAgIHJldHVybiBAdGFyZ2V0XG4gIHNldEN1cnNvclBvczogKHN0YXJ0LCBlbmQpIC0+XG4gICAgZW5kID0gc3RhcnQgaWYgYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICBAdGFyZ2V0ID0gKFxuICAgICAgICBzdGFydDogc3RhcnRcbiAgICAgICAgZW5kOiBlbmRcbiAgICAgICkiLCJpbXBvcnQgeyBDb2Rld2F2ZSB9IGZyb20gJy4vQ29kZXdhdmUnO1xuaW1wb3J0IHsgVGV4dEFyZWFFZGl0b3IgfSBmcm9tICcuL1RleHRBcmVhRWRpdG9yJztcblxuQ29kZXdhdmUuaW5zdGFuY2VzID0gW11cbkNvZGV3YXZlLmRldGVjdCA9ICh0YXJnZXQpIC0+XG4gIGN3ID0gbmV3IENvZGV3YXZlKG5ldyBUZXh0QXJlYUVkaXRvcih0YXJnZXQpKVxuICBDb2Rld2F2ZS5pbnN0YW5jZXMucHVzaChjdylcbiAgY3dcblxud2luZG93LkNvZGV3YXZlID0gQ29kZXdhdmVcbiAgIiwiZXhwb3J0IGNsYXNzIEFycmF5SGVscGVyXG4gIEBpc0FycmF5OiAoYXJyKSAtPlxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIGFyciApID09ICdbb2JqZWN0IEFycmF5XSdcbiAgXG4gIEB1bmlvbjogKGExLGEyKSAtPlxuICAgIEB1bmlxdWUoYTEuY29uY2F0KGEyKSlcbiAgICBcbiAgQHVuaXF1ZTogKGFycmF5KSAtPlxuICAgIGEgPSBhcnJheS5jb25jYXQoKVxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IGEubGVuZ3RoXG4gICAgICBqID0gaSArIDFcbiAgICAgIHdoaWxlIGogPCBhLmxlbmd0aFxuICAgICAgICBpZiBhW2ldID09IGFbal1cbiAgICAgICAgICBhLnNwbGljZShqLS0sIDEpXG4gICAgICAgICsralxuICAgICAgKytpXG4gICAgYSIsImV4cG9ydCBjbGFzcyBDb21tb25IZWxwZXJcblxuICBAbWVyZ2U6ICh4cy4uLikgLT5cbiAgICBpZiB4cz8ubGVuZ3RoID4gMFxuICAgICAgQHRhcCB7fSwgKG0pIC0+IG1ba10gPSB2IGZvciBrLCB2IG9mIHggZm9yIHggaW4geHNcbiBcbiAgQHRhcDogKG8sIGZuKSAtPiBcbiAgICBmbihvKVxuICAgIG9cblxuICBAYXBwbHlNaXhpbnM6IChkZXJpdmVkQ3RvciwgYmFzZUN0b3JzKSAtPiBcbiAgICBiYXNlQ3RvcnMuZm9yRWFjaCAoYmFzZUN0b3IpID0+IFxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoIChuYW1lKT0+IFxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXJpdmVkQ3RvciwgbmFtZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ3Rvci5wcm90b3R5cGUsIG5hbWUpKSIsIlxuZXhwb3J0IGNsYXNzIE5hbWVzcGFjZUhlbHBlclxuXG4gIEBzcGxpdEZpcnN0OiAoZnVsbG5hbWUsaXNTcGFjZSA9IGZhbHNlKSAtPlxuICAgIGlmIGZ1bGxuYW1lLmluZGV4T2YoXCI6XCIpID09IC0xIGFuZCAhaXNTcGFjZVxuICAgICAgcmV0dXJuIFtudWxsLGZ1bGxuYW1lXVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIHJldHVybiBbcGFydHMuc2hpZnQoKSxwYXJ0cy5qb2luKCc6JykgfHwgbnVsbF1cblxuICBAc3BsaXQ6IChmdWxsbmFtZSkgLT5cbiAgICBpZiBmdWxsbmFtZS5pbmRleE9mKFwiOlwiKSA9PSAtMVxuICAgICAgcmV0dXJuIFtudWxsLGZ1bGxuYW1lXVxuICAgIHBhcnRzID0gZnVsbG5hbWUuc3BsaXQoJzonKVxuICAgIG5hbWUgPSBwYXJ0cy5wb3AoKVxuICAgIFtwYXJ0cy5qb2luKCc6JyksbmFtZV0iLCJleHBvcnQgY2xhc3MgU3RyaW5nSGVscGVyXG4gIEB0cmltRW1wdHlMaW5lOiAodHh0KSAtPlxuICAgIHJldHVybiB0eHQucmVwbGFjZSgvXlxccypcXHI/XFxuLywgJycpLnJlcGxhY2UoL1xccj9cXG5cXHMqJC8sICcnKVxuXG4gIEBlc2NhcGVSZWdFeHA6IChzdHIpIC0+XG4gICAgc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKVxuXG4gIEByZXBlYXRUb0xlbmd0aDogKHR4dCwgbGVuZ3RoKSAtPlxuICAgIHJldHVybiAnJyBpZiBsZW5ndGggPD0gMFxuICAgIEFycmF5KE1hdGguY2VpbChsZW5ndGgvdHh0Lmxlbmd0aCkrMSkuam9pbih0eHQpLnN1YnN0cmluZygwLGxlbmd0aClcbiAgICBcbiAgQHJlcGVhdDogKHR4dCwgbmIpIC0+XG4gICAgQXJyYXkobmIrMSkuam9pbih0eHQpXG4gICAgXG4gIEBnZXRUeHRTaXplOiAodHh0KSAtPlxuICAgIGxpbmVzID0gdHh0LnJlcGxhY2UoL1xcci9nLCcnKS5zcGxpdChcIlxcblwiKSAgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgJy9cXHIvZycgXCInXFxyJ1wiXG4gICAgdyA9IDBcbiAgICBmb3IgbCBpbiBsaW5lc1xuICAgICAgdyA9IE1hdGgubWF4KHcsbC5sZW5ndGgpXG4gICAgcmV0dXJuIG5ldyBTaXplKHcsbGluZXMubGVuZ3RoLTEpXG5cbiAgQGluZGVudE5vdEZpcnN0OiAodGV4dCxuYj0xLHNwYWNlcz0nICAnKSAtPlxuICAgIGlmIHRleHQ/XG4gICAgICByZWcgPSAvXFxuL2cgICMgW3Bhd2EgcHl0aG9uXSByZXBsYWNlICcvXFxuL2cnIFwicmUuY29tcGlsZShyJ1xcbicscmUuTSlcIlxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWcsIFwiXFxuXCIgKyBAcmVwZWF0KHNwYWNlcywgbmIpKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgICBcbiAgQGluZGVudDogKHRleHQsbmI9MSxzcGFjZXM9JyAgJykgLT5cbiAgICBpZiB0ZXh0P1xuICAgICAgcmV0dXJuIHNwYWNlcyArIEBpbmRlbnROb3RGaXJzdCh0ZXh0LG5iLHNwYWNlcylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGV4dFxuICBcbiAgQHJldmVyc2VTdHI6ICh0eHQpIC0+XG4gICAgcmV0dXJuIHR4dC5zcGxpdChcIlwiKS5yZXZlcnNlKCkuam9pbihcIlwiKVxuICBcbiAgXG4gIEByZW1vdmVDYXJyZXQ6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgdG1wID0gJ1tbW1txdW90ZWRfY2FycmV0XV1dXSdcbiAgICByZUNhcnJldCA9IG5ldyBSZWdFeHAoQGVzY2FwZVJlZ0V4cChjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhcitjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgcmVUbXAgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAodG1wKSwgXCJnXCIpXG4gICAgdHh0LnJlcGxhY2UocmVRdW90ZWQsdG1wKS5yZXBsYWNlKHJlQ2FycmV0LCcnKS5yZXBsYWNlKHJlVG1wLCBjYXJyZXRDaGFyKVxuICAgIFxuICBAZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQ6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgcG9zID0gQGdldENhcnJldFBvcyh0eHQsY2FycmV0Q2hhcilcbiAgICBpZiBwb3M/XG4gICAgICB0eHQgPSB0eHQuc3Vic3RyKDAscG9zKSArIHR4dC5zdWJzdHIocG9zK2NhcnJldENoYXIubGVuZ3RoKVxuICAgICAgcmV0dXJuIFtwb3MsdHh0XVxuICAgICAgXG4gIEBnZXRDYXJyZXRQb3M6ICh0eHQsIGNhcnJldENoYXIgPSAnfCcpIC0+XG4gICAgcmVRdW90ZWQgPSBuZXcgUmVnRXhwKEBlc2NhcGVSZWdFeHAoY2FycmV0Q2hhcitjYXJyZXRDaGFyKSwgXCJnXCIpXG4gICAgdHh0ID0gdHh0LnJlcGxhY2UocmVRdW90ZWQsICcgJykgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgcmVRdW90ZWQgY2FycmV0Q2hhcitjYXJyZXRDaGFyXG4gICAgaWYgKGkgPSB0eHQuaW5kZXhPZihjYXJyZXRDaGFyKSkgPiAtMVxuICAgICAgcmV0dXJuIGkiLCJcbmltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcbmltcG9ydCB7IFN0cmluZ0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvU3RyaW5nSGVscGVyJztcblxuZXhwb3J0IGNsYXNzIFBhaXJcbiAgY29uc3RydWN0b3I6IChAb3BlbmVyLEBjbG9zZXIsQG9wdGlvbnMgPSB7fSkgLT5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG9wdGlvbm5hbF9lbmQ6IGZhbHNlXG4gICAgICB2YWxpZE1hdGNoOiBudWxsXG4gICAgfVxuICAgIGZvciBrZXksIHZhbCBvZiBkZWZhdWx0c1xuICAgICAgaWYga2V5IG9mIEBvcHRpb25zXG4gICAgICAgIHRoaXNba2V5XSA9IEBvcHRpb25zW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpc1trZXldID0gdmFsXG4gIG9wZW5lclJlZzogLT5cbiAgICBpZiB0eXBlb2YgQG9wZW5lciA9PSAnc3RyaW5nJyBcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFN0cmluZ0hlbHBlci5lc2NhcGVSZWdFeHAoQG9wZW5lcikpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBvcGVuZXJcbiAgY2xvc2VyUmVnOiAtPlxuICAgIGlmIHR5cGVvZiBAY2xvc2VyID09ICdzdHJpbmcnIFxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoU3RyaW5nSGVscGVyLmVzY2FwZVJlZ0V4cChAY2xvc2VyKSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQGNsb3NlclxuICBtYXRjaEFueVBhcnRzOiAtPlxuICAgIHJldHVybiB7XG4gICAgICBvcGVuZXI6IEBvcGVuZXJSZWcoKVxuICAgICAgY2xvc2VyOiBAY2xvc2VyUmVnKClcbiAgICB9XG4gIG1hdGNoQW55UGFydEtleXM6IC0+XG4gICAga2V5cyA9IFtdXG4gICAgZm9yIGtleSwgcmVnIG9mIEBtYXRjaEFueVBhcnRzKClcbiAgICAgIGtleXMucHVzaChrZXkpXG4gICAgcmV0dXJuIGtleXNcbiAgbWF0Y2hBbnlSZWc6IC0+XG4gICAgZ3JvdXBzID0gW11cbiAgICBmb3Iga2V5LCByZWcgb2YgQG1hdGNoQW55UGFydHMoKVxuICAgICAgZ3JvdXBzLnB1c2goJygnK3JlZy5zb3VyY2UrJyknKSAgIyBbcGF3YSBweXRob25dIHJlcGxhY2UgcmVnLnNvdXJjZSByZWcucGF0dGVyblxuICAgIHJldHVybiBuZXcgUmVnRXhwKGdyb3Vwcy5qb2luKCd8JykpXG4gIG1hdGNoQW55OiAodGV4dCxvZmZzZXQ9MCkgLT5cbiAgICB3aGlsZSAobWF0Y2ggPSBAX21hdGNoQW55KHRleHQsb2Zmc2V0KSk/IGFuZCAhbWF0Y2gudmFsaWQoKVxuICAgICAgb2Zmc2V0ID0gbWF0Y2guZW5kKClcbiAgICByZXR1cm4gbWF0Y2ggaWYgbWF0Y2g/IGFuZCBtYXRjaC52YWxpZCgpXG4gIF9tYXRjaEFueTogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgaWYgb2Zmc2V0XG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIob2Zmc2V0KVxuICAgIG1hdGNoID0gQG1hdGNoQW55UmVnKCkuZXhlYyh0ZXh0KVxuICAgIGlmIG1hdGNoP1xuICAgICAgcmV0dXJuIG5ldyBQYWlyTWF0Y2godGhpcyxtYXRjaCxvZmZzZXQpXG4gIG1hdGNoQW55TmFtZWQ6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAX21hdGNoQW55R2V0TmFtZShAbWF0Y2hBbnkodGV4dCkpXG4gIG1hdGNoQW55TGFzdDogKHRleHQsb2Zmc2V0PTApIC0+XG4gICAgd2hpbGUgbWF0Y2ggPSBAbWF0Y2hBbnkodGV4dCxvZmZzZXQpXG4gICAgICBvZmZzZXQgPSBtYXRjaC5lbmQoKVxuICAgICAgaWYgIXJlcyBvciByZXMuZW5kKCkgIT0gbWF0Y2guZW5kKClcbiAgICAgICAgcmVzID0gbWF0Y2hcbiAgICByZXR1cm4gcmVzXG4gIGlkZW50aWNhbDogLT5cbiAgICBAb3BlbmVyID09IEBjbG9zZXIgb3IgKFxuICAgICAgQG9wZW5lci5zb3VyY2U/IGFuZCBcbiAgICAgIEBjbG9zZXIuc291cmNlPyBhbmQgXG4gICAgICBAb3BlbmVyLnNvdXJjZSA9PSBAY2xvc2VyLnNvdXJjZVxuICAgIClcbiAgd3JhcHBlclBvczogKHBvcyx0ZXh0KSAtPlxuICAgIHN0YXJ0ID0gQG1hdGNoQW55TGFzdCh0ZXh0LnN1YnN0cigwLHBvcy5zdGFydCkpXG4gICAgaWYgc3RhcnQ/IGFuZCAoQGlkZW50aWNhbCgpIG9yIHN0YXJ0Lm5hbWUoKSA9PSAnb3BlbmVyJylcbiAgICAgIGVuZCA9IEBtYXRjaEFueSh0ZXh0LHBvcy5lbmQpXG4gICAgICBpZiBlbmQ/IGFuZCAoQGlkZW50aWNhbCgpIG9yIGVuZC5uYW1lKCkgPT0gJ2Nsb3NlcicpXG4gICAgICAgIHJldHVybiBuZXcgUG9zKHN0YXJ0LnN0YXJ0KCksZW5kLmVuZCgpKVxuICAgICAgZWxzZSBpZiBAb3B0aW9ubmFsX2VuZFxuICAgICAgICByZXR1cm4gbmV3IFBvcyhzdGFydC5zdGFydCgpLHRleHQubGVuZ3RoKVxuICBpc1dhcHBlck9mOiAocG9zLHRleHQpIC0+XG4gICAgcmV0dXJuIEB3cmFwcGVyUG9zKHBvcyx0ZXh0KT8iLCJleHBvcnQgY2xhc3MgUG9zXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXJ0LEBlbmQpIC0+XG4gICAgQGVuZCA9IEBzdGFydCB1bmxlc3MgQGVuZD9cbiAgY29udGFpbnNQdDogKHB0KSAtPlxuICAgIHJldHVybiBAc3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBlbmRcbiAgY29udGFpbnNQb3M6IChwb3MpIC0+XG4gICAgcmV0dXJuIEBzdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGVuZFxuICB3cmFwcGVkQnk6IChwcmVmaXgsc3VmZml4KSAtPlxuICAgIFdyYXBwZWRQb3MgPSByZXF1aXJlKCcuL1dyYXBwZWRQb3MnKTtcbiAgICByZXR1cm4gbmV3IFdyYXBwZWRQb3MoQHN0YXJ0LXByZWZpeC5sZW5ndGgsQHN0YXJ0LEBlbmQsQGVuZCtzdWZmaXgubGVuZ3RoKVxuICB3aXRoRWRpdG9yOiAodmFsKS0+XG4gICAgQF9lZGl0b3IgPSB2YWxcbiAgICByZXR1cm4gdGhpc1xuICBlZGl0b3I6IC0+XG4gICAgdW5sZXNzIEBfZWRpdG9yP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlZGl0b3Igc2V0JylcbiAgICByZXR1cm4gQF9lZGl0b3JcbiAgaGFzRWRpdG9yOiAtPlxuICAgIHJldHVybiBAX2VkaXRvcj9cbiAgdGV4dDogLT5cbiAgICBAZWRpdG9yKCkudGV4dFN1YnN0cihAc3RhcnQsIEBlbmQpXG4gIGFwcGx5T2Zmc2V0OiAob2Zmc2V0KS0+XG4gICAgaWYgb2Zmc2V0ICE9IDBcbiAgICAgIEBzdGFydCArPSBvZmZzZXRcbiAgICAgIEBlbmQgKz0gb2Zmc2V0XG4gICAgcmV0dXJuIHRoaXNcbiAgcHJldkVPTDogLT5cbiAgICB1bmxlc3MgQF9wcmV2RU9MP1xuICAgICAgQF9wcmV2RU9MID0gQGVkaXRvcigpLmZpbmRMaW5lU3RhcnQoQHN0YXJ0KVxuICAgIHJldHVybiBAX3ByZXZFT0xcbiAgbmV4dEVPTDogLT5cbiAgICB1bmxlc3MgQF9uZXh0RU9MP1xuICAgICAgQF9uZXh0RU9MID0gQGVkaXRvcigpLmZpbmRMaW5lRW5kKEBlbmQpXG4gICAgcmV0dXJuIEBfbmV4dEVPTFxuICB0ZXh0V2l0aEZ1bGxMaW5lczogLT5cbiAgICB1bmxlc3MgQF90ZXh0V2l0aEZ1bGxMaW5lcz9cbiAgICAgIEBfdGV4dFdpdGhGdWxsTGluZXMgPSBAZWRpdG9yKCkudGV4dFN1YnN0cihAcHJldkVPTCgpLEBuZXh0RU9MKCkpXG4gICAgcmV0dXJuIEBfdGV4dFdpdGhGdWxsTGluZXNcbiAgc2FtZUxpbmVzUHJlZml4OiAtPlxuICAgIHVubGVzcyBAX3NhbWVMaW5lc1ByZWZpeD9cbiAgICAgIEBfc2FtZUxpbmVzUHJlZml4ID0gQGVkaXRvcigpLnRleHRTdWJzdHIoQHByZXZFT0woKSxAc3RhcnQpXG4gICAgcmV0dXJuIEBfc2FtZUxpbmVzUHJlZml4XG4gIHNhbWVMaW5lc1N1ZmZpeDogLT5cbiAgICB1bmxlc3MgQF9zYW1lTGluZXNTdWZmaXg/XG4gICAgICBAX3NhbWVMaW5lc1N1ZmZpeCA9IEBlZGl0b3IoKS50ZXh0U3Vic3RyKEBlbmQsQG5leHRFT0woKSlcbiAgICByZXR1cm4gQF9zYW1lTGluZXNTdWZmaXhcbiAgY29weTogLT5cbiAgICByZXMgPSBuZXcgUG9zKEBzdGFydCxAZW5kKVxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgcmVzLndpdGhFZGl0b3IoQGVkaXRvcigpKVxuICAgIHJldHVybiByZXNcbiAgcmF3OiAtPlxuICAgIFtAc3RhcnQsQGVuZF0iLCJpbXBvcnQgeyBXcmFwcGluZyB9IGZyb20gJy4vV3JhcHBpbmcnO1xuaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL1JlcGxhY2VtZW50JztcbmltcG9ydCB7IENvbW1vbkhlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvQ29tbW9uSGVscGVyJztcblxuZXhwb3J0IGNsYXNzIFBvc0NvbGxlY3Rpb25cbiAgY29uc3RydWN0b3I6IChhcnIpIC0+XG4gICAgaWYgIUFycmF5LmlzQXJyYXkoYXJyKVxuICAgICAgYXJyID0gW2Fycl1cbiAgICBDb21tb25IZWxwZXIuYXBwbHlNaXhpbnMoYXJyLFtQb3NDb2xsZWN0aW9uXSlcbiAgICByZXR1cm4gYXJyXG4gICAgXG4gIHdyYXA6IChwcmVmaXgsc3VmZml4KS0+XG4gICAgICByZXR1cm4gQG1hcCggKHApIC0+IG5ldyBXcmFwcGluZyhwLnN0YXJ0LCBwLmVuZCwgcHJlZml4LCBzdWZmaXgpKVxuICByZXBsYWNlOiAodHh0KS0+XG4gICAgICByZXR1cm4gQG1hcCggKHApIC0+IG5ldyBSZXBsYWNlbWVudChwLnN0YXJ0LCBwLmVuZCwgdHh0KSkiLCJpbXBvcnQgeyBQb3MgfSBmcm9tICcuL1Bvcyc7XG5pbXBvcnQgeyBDb21tb25IZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL0NvbW1vbkhlbHBlcic7XG5pbXBvcnQgeyBPcHRpb25PYmplY3QgfSBmcm9tICcuLi9PcHRpb25PYmplY3QnO1xuaW1wb3J0IHsgU3RyaW5nSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9TdHJpbmdIZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgUmVwbGFjZW1lbnQgZXh0ZW5kcyBQb3NcbiAgQ29tbW9uSGVscGVyLmFwcGx5TWl4aW5zKHRoaXMucHJvdG90eXBlLFtPcHRpb25PYmplY3RdKVxuICBjb25zdHJ1Y3RvcjogKEBzdGFydCwgQGVuZCwgQHRleHQsIEBvcHRpb25zID0ge30pIC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRPcHRzKEBvcHRpb25zLHtcbiAgICAgIHByZWZpeDogJydcbiAgICAgIHN1ZmZpeDogJydcbiAgICAgIHNlbGVjdGlvbnM6IFtdXG4gICAgfSlcbiAgcmVzUG9zQmVmb3JlUHJlZml4OiAtPlxuICAgIHJldHVybiBAc3RhcnQrQHByZWZpeC5sZW5ndGgrQHRleHQubGVuZ3RoXG4gIHJlc0VuZDogLT4gXG4gICAgcmV0dXJuIEBzdGFydCtAZmluYWxUZXh0KCkubGVuZ3RoXG4gIGFwcGx5OiAtPlxuICAgIEBlZGl0b3IoKS5zcGxpY2VUZXh0KEBzdGFydCwgQGVuZCwgQGZpbmFsVGV4dCgpKVxuICBuZWNlc3Nhcnk6IC0+XG4gICAgcmV0dXJuIEBmaW5hbFRleHQoKSAhPSBAb3JpZ2luYWxUZXh0KClcbiAgb3JpZ2luYWxUZXh0OiAtPlxuICAgIHJldHVybiBAZWRpdG9yKCkudGV4dFN1YnN0cihAc3RhcnQsIEBlbmQpXG4gIGZpbmFsVGV4dDogLT5cbiAgICByZXR1cm4gQHByZWZpeCtAdGV4dCtAc3VmZml4XG4gIG9mZnNldEFmdGVyOiAoKSAtPiBcbiAgICByZXR1cm4gQGZpbmFsVGV4dCgpLmxlbmd0aCAtIChAZW5kIC0gQHN0YXJ0KVxuICBhcHBseU9mZnNldDogKG9mZnNldCktPlxuICAgIGlmIG9mZnNldCAhPSAwXG4gICAgICBAc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBAZW5kICs9IG9mZnNldFxuICAgICAgZm9yIHNlbCBpbiBAc2VsZWN0aW9uc1xuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICAgIHNlbC5lbmQgKz0gb2Zmc2V0XG4gICAgcmV0dXJuIHRoaXNcbiAgc2VsZWN0Q29udGVudDogLT4gXG4gICAgQHNlbGVjdGlvbnMgPSBbbmV3IFBvcyhAcHJlZml4Lmxlbmd0aCtAc3RhcnQsIEBwcmVmaXgubGVuZ3RoK0BzdGFydCtAdGV4dC5sZW5ndGgpXVxuICAgIHJldHVybiB0aGlzXG4gIGNhcnJldFRvU2VsOiAtPlxuICAgIEBzZWxlY3Rpb25zID0gW11cbiAgICB0ZXh0ID0gQGZpbmFsVGV4dCgpXG4gICAgQHByZWZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHByZWZpeClcbiAgICBAdGV4dCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHRleHQpXG4gICAgQHN1ZmZpeCA9IFN0cmluZ0hlbHBlci5yZW1vdmVDYXJyZXQoQHN1ZmZpeClcbiAgICBzdGFydCA9IEBzdGFydFxuICAgIFxuICAgIHdoaWxlIChyZXMgPSBTdHJpbmdIZWxwZXIuZ2V0QW5kUmVtb3ZlRmlyc3RDYXJyZXQodGV4dCkpP1xuICAgICAgW3Bvcyx0ZXh0XSA9IHJlc1xuICAgICAgQHNlbGVjdGlvbnMucHVzaChuZXcgUG9zKHN0YXJ0K3Bvcywgc3RhcnQrcG9zKSlcbiAgICAgIFxuICAgIHJldHVybiB0aGlzXG4gIGNvcHk6IC0+IFxuICAgIHJlcyA9IG5ldyBSZXBsYWNlbWVudChAc3RhcnQsIEBlbmQsIEB0ZXh0LCBAZ2V0T3B0cygpKVxuICAgIGlmIEBoYXNFZGl0b3IoKVxuICAgICAgcmVzLndpdGhFZGl0b3IoQGVkaXRvcigpKVxuICAgIHJlcy5zZWxlY3Rpb25zID0gQHNlbGVjdGlvbnMubWFwKCAocyktPnMuY29weSgpIClcbiAgICByZXR1cm4gcmVzIiwiZXhwb3J0IGNsYXNzIFN0clBvc1xuICBjb25zdHJ1Y3RvcjogKEBwb3MsQHN0cikgLT5cbiAgZW5kOiAtPlxuICAgIEBwb3MgKyBAc3RyLmxlbmd0aCIsImltcG9ydCB7IFBvcyB9IGZyb20gJy4vUG9zJztcblxuZXhwb3J0IGNsYXNzIFdyYXBwZWRQb3MgZXh0ZW5kcyBQb3NcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIC0+XG4gICAgc3VwZXIoKVxuICBpbm5lckNvbnRhaW5zUHQ6IChwdCkgLT5cbiAgICByZXR1cm4gQGlubmVyU3RhcnQgPD0gcHQgYW5kIHB0IDw9IEBpbm5lckVuZFxuICBpbm5lckNvbnRhaW5zUG9zOiAocG9zKSAtPlxuICAgIHJldHVybiBAaW5uZXJTdGFydCA8PSBwb3Muc3RhcnQgYW5kIHBvcy5lbmQgPD0gQGlubmVyRW5kXG4gIGlubmVyVGV4dDogLT5cbiAgICBAZWRpdG9yKCkudGV4dFN1YnN0cihAaW5uZXJTdGFydCwgQGlubmVyRW5kKVxuICBzZXRJbm5lckxlbjogKGxlbikgLT5cbiAgICBAbW92ZVN1Zml4KEBpbm5lclN0YXJ0ICsgbGVuKVxuICBtb3ZlU3VmZml4OiAocHQpIC0+XG4gICAgc3VmZml4TGVuID0gQGVuZCAtIEBpbm5lckVuZFxuICAgIEBpbm5lckVuZCA9IHB0XG4gICAgQGVuZCA9IEBpbm5lckVuZCArIHN1ZmZpeExlblxuICBjb3B5OiAtPlxuICAgIHJldHVybiBuZXcgV3JhcHBlZFBvcyhAc3RhcnQsQGlubmVyU3RhcnQsQGlubmVyRW5kLEBlbmQpIiwiaW1wb3J0IHsgUmVwbGFjZW1lbnQgfSBmcm9tICcuL1JlcGxhY2VtZW50JztcblxuZXhwb3J0IGNsYXNzIFdyYXBwaW5nIGV4dGVuZHMgUmVwbGFjZW1lbnRcbiAgY29uc3RydWN0b3I6IChAc3RhcnQsIEBlbmQsIHByZWZpeCA9JycsIHN1ZmZpeCA9ICcnLCBAb3B0aW9ucyA9IHt9KSAtPlxuICAgIHN1cGVyKClcbiAgICBAc2V0T3B0cyhAb3B0aW9ucylcbiAgICBAdGV4dCA9ICcnXG4gICAgQHByZWZpeCA9IHByZWZpeFxuICAgIEBzdWZmaXggPSBzdWZmaXhcbiAgYXBwbHk6IC0+XG4gICAgQGFkanVzdFNlbCgpXG4gICAgc3VwZXIoKVxuICBhZGp1c3RTZWw6IC0+XG4gICAgb2Zmc2V0ID0gQG9yaWdpbmFsVGV4dCgpLmxlbmd0aFxuICAgIGZvciBzZWwgaW4gQHNlbGVjdGlvbnNcbiAgICAgIGlmIHNlbC5zdGFydCA+IEBzdGFydCtAcHJlZml4Lmxlbmd0aFxuICAgICAgICBzZWwuc3RhcnQgKz0gb2Zmc2V0XG4gICAgICBpZiBzZWwuZW5kID49IEBzdGFydCtAcHJlZml4Lmxlbmd0aFxuICAgICAgICBzZWwuZW5kICs9IG9mZnNldFxuICBmaW5hbFRleHQ6IC0+XG4gICAgaWYgQGhhc0VkaXRvcigpXG4gICAgICB0ZXh0ID0gQG9yaWdpbmFsVGV4dCgpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9ICcnXG4gICAgcmV0dXJuIEBwcmVmaXgrdGV4dCtAc3VmZml4XG4gIG9mZnNldEFmdGVyOiAoKSAtPiBcbiAgICByZXR1cm4gQHByZWZpeC5sZW5ndGgrQHN1ZmZpeC5sZW5ndGhcbiAgICAgICAgICBcbiAgY29weTogLT4gXG4gICAgcmVzID0gbmV3IFdyYXBwaW5nKEBzdGFydCwgQGVuZCwgQHByZWZpeCwgQHN1ZmZpeClcbiAgICByZXMuc2VsZWN0aW9ucyA9IEBzZWxlY3Rpb25zLm1hcCggKHMpLT5zLmNvcHkoKSApXG4gICAgcmV0dXJuIHJlcyJdfQ==
