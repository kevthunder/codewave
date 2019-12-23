

const Context = require("./Context");

const Storage = require("./Storage").Storage;

const NamespaceHelper = require("./helpers/NamespaceHelper").NamespaceHelper;

var _optKey;

_optKey = function (key, dict, defVal = null) {
  // optional Dictionary key
  if (key in dict) {
    return dict[key];
  } else {
    return defVal;
  }
};

var Command = function () {
  class Command {
    constructor(name1, data1 = null, parent = null) {
      this.name = name1;
      this.data = data1;
      this.cmds = [];
      this.detectors = [];
      this.executeFunct = this.resultFunct = this.resultStr = this.aliasOf = this.cls = null;
      this.aliased = null;
      this.fullName = this.name;
      this.depth = 0;
      [this._parent, this._inited] = [null, false];
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

    parent() {
      return this._parent;
    }

    setParent(value) {
      if (this._parent !== value) {
        this._parent = value;
        this.fullName = this._parent != null && this._parent.name != null ? this._parent.fullName + ':' + this.name : this.name;
        return this.depth = this._parent != null && this._parent.depth != null ? this._parent.depth + 1 : 0;
      }
    }

    init() {
      if (!this._inited) {
        this._inited = true;
        this.parseData(this.data);
      }

      return this;
    }

    unregister() {
      return this._parent.removeCmd(this);
    }

    isEditable() {
      return this.resultStr != null || this.aliasOf != null;
    }

    isExecutable() {
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

    isExecutableWithName(name) {
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

    resultIsAvailable() {
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

    getDefaults() {
      var aliased, res;
      res = {};
      aliased = this.getAliased();

      if (aliased != null) {
        res = Object.assign(res, aliased.getDefaults());
      }

      res = Object.assign(res, this.defaults);
      return res;
    }

    _aliasedFromFinder(finder) {
      finder.useFallbacks = false;
      finder.mustExecute = false;
      finder.useDetectors = false;
      return finder.find();
    }

    getAliased() {
      var context;

      if (this.aliasOf != null) {
        context = new Context.Context();
        return this._aliasedFromFinder(context.getFinder(this.aliasOf));
      }
    }

    getAliasedOrThis() {
      return this.getAliased() || this;
    }

    setOptions(data) {
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

    _optionsForAliased(aliased) {
      var opt;
      opt = {};
      opt = Object.assign(opt, this.defaultOptions);

      if (aliased != null) {
        opt = Object.assign(opt, aliased.getOptions());
      }

      return Object.assign(opt, this.options);
    }

    getOptions() {
      return this._optionsForAliased(this.getAliased());
    }

    getOption(key) {
      var options;
      options = this.getOptions();

      if (key in options) {
        return options[key];
      }
    }

    help() {
      var cmd;
      cmd = this.getCmd('help');

      if (cmd != null) {
        return cmd.init().resultStr;
      }
    }

    parseData(data) {
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

    parseDictData(data) {
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

    addCmds(cmds) {
      var data, name, results;
      results = [];

      for (name in cmds) {
        data = cmds[name];
        results.push(this.addCmd(new Command(name, data, this)));
      }

      return results;
    }

    addCmd(cmd) {
      var exists;
      exists = this.getCmd(cmd.name);

      if (exists != null) {
        this.removeCmd(exists);
      }

      cmd.setParent(this);
      this.cmds.push(cmd);
      return cmd;
    }

    removeCmd(cmd) {
      var i;

      if ((i = this.cmds.indexOf(cmd)) > -1) {
        this.cmds.splice(i, 1);
      }

      return cmd;
    }

    getCmd(fullname) {
      var cmd, j, len, name, ref, ref1, space;
      this.init();
      [space, name] = NamespaceHelper.splitFirst(fullname);

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

    setCmdData(fullname, data) {
      return this.setCmd(fullname, new Command(fullname.split(':').pop(), data));
    }

    setCmd(fullname, cmd) {
      var name, next, space;
      [space, name] = NamespaceHelper.splitFirst(fullname);

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

    addDetector(detector) {
      return this.detectors.push(detector);
    }

    static initCmds() {
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

    static saveCmd(fullname, data) {
      return Promise.resolve().then(() => {
        return Command.cmds.setCmdData(fullname, data);
      }).then(() => {
        return this.storage.saveInPath('cmds', fullname, data);
      });
    }

    static loadCmds() {
      return Promise.resolve().then(() => {
        var savedCmds;
        return savedCmds = this.storage.load('cmds');
      }).then(savedCmds => {
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

    static resetSaved() {
      return this.storage.save('cmds', {});
    }

    static makeVarCmd(name, base = {}) {
      base.execute = function (instance) {
        var p, val;
        val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : void 0;

        if (val != null) {
          return instance.codewave.vars[name] = val;
        }
      };

      return base;
    }

    static makeBoolVarCmd(name, base = {}) {
      base.execute = function (instance) {
        var p, val;
        val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : void 0;

        if (!(val != null && (val === '0' || val === 'false' || val === 'no'))) {
          return instance.codewave.vars[name] = true;
        }
      };

      return base;
    }

  }

  ;
  Command.providers = [];
  Command.storage = new Storage();
  return Command;
}.call(void 0);

exports.Command = Command;
var BaseCommand = class BaseCommand {
  constructor(instance1) {
    this.instance = instance1;
  }

  init() {}

  resultIsAvailable() {
    return this["result"] != null;
  }

  getDefaults() {
    return {};
  }

  getOptions() {
    return {};
  }

};
exports.BaseCommand = BaseCommand;

