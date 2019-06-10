"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CmdInstance = void 0;

var _Context = require("./Context");

var _Codewave = require("./Codewave");

var _TextParser = require("./TextParser");

var _StringHelper = require("./helpers/StringHelper");

var CmdInstance = class CmdInstance {
  constructor(cmd1, context) {
    this.cmd = cmd1;
    this.context = context;
  }

  init() {
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

  setParam(name, val) {
    return this.named[name] = val;
  }

  pushParam(val) {
    return this.params.push(val);
  }

  getContext() {
    if (this.context == null) {
      this.context = new _Context.Context();
    }

    return this.context || new _Context.Context();
  }

  getFinder(cmdName) {
    var finder;
    finder = this.getContext().getFinder(cmdName, {
      namespaces: this._getParentNamespaces()
    });
    finder.instance = this;
    return finder;
  }

  _getCmdObj() {
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

  _initParams() {
    return this.named = this.getDefaults();
  }

  _getParentNamespaces() {
    return [];
  }

  isEmpty() {
    return this.cmd != null;
  }

  resultIsAvailable() {
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

  getDefaults() {
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

  getAliased() {
    if (this.cmd != null) {
      if (this.aliasedCmd == null) {
        this.getAliasedFinal();
      }

      return this.aliasedCmd || null;
    }
  }

  getAliasedFinal() {
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

  alterAliasOf(aliasOf) {
    return aliasOf;
  }

  getOptions() {
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

  getOption(key) {
    var options;
    options = this.getOptions();

    if (options != null && key in options) {
      return options[key];
    }
  }

  getParam(names, defVal = null) {
    var i, len, n, ref;

    if ((ref = typeof names) === 'string' || ref === 'number') {
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

  getBoolParam(names, defVal = null) {
    var falseVals, val;
    falseVals = ["", "0", "false", "no", "none", false, null, 0];
    val = this.getParam(names, defVal);
    return !falseVals.includes(val);
  }

  ancestorCmds() {
    var ref;

    if (((ref = this.context.codewave) != null ? ref.inInstance : void 0) != null) {
      return this.context.codewave.inInstance.ancestorCmdsAndSelf();
    }

    return [];
  }

  ancestorCmdsAndSelf() {
    return this.ancestorCmds().concat([this.cmd]);
  }

  runExecuteFunct() {
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

  rawResult() {
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

  result() {
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

  getParserForText(txt = '') {
    var parser;
    parser = new _Codewave.Codewave(new _TextParser.TextParser(txt), {
      inInstance: this
    });
    parser.checkCarret = false;
    return parser;
  }

  getIndent() {
    return 0;
  }

  formatIndent(text) {
    if (text != null) {
      return text.replace(/\t/g, '  ');
    } else {
      return text;
    }
  }

  applyIndent(text) {
    return _StringHelper.StringHelper.indentNotFirst(text, this.getIndent(), " ");
  }

};
exports.CmdInstance = CmdInstance;
//# sourceMappingURL=maps/CmdInstance.js.map
