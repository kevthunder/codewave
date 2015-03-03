// Generated by CoffeeScript 1.8.0
(function() {
  var BoxCmd, CloseCmd, EditCmd, EmmetCmd, NameSpaceCmd, exec_parent, initCmds, no_execute, quote_carret, setVarCmd,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  initCmds = function() {
    var core, html;
    core = Codewave.Command.cmds.addCmd(new Codewave.Command('core'));
    core.addDetector(new Codewave.LangDetector());
    core.addCmds({
      'help': {
        'result': "~~box~~\n~~quote_carret~~\n  ___         _   __      __\n / __|___  __| |__\ \    / /_ ___ ______\n/ /__/ _ \/ _` / -_\ \/\/ / _` \ V / -_/\n\____\___/\__,_\___|\_/\_/\__,_|\_/\___|\nThe text editor helper\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
      },
      'no_execute': {
        'result': no_execute
      },
      'quote_carret': {
        'result': quote_carret,
        'checkCarret': false
      },
      'exec_parent': {
        'execute': exec_parent
      },
      'box': {
        'cls': BoxCmd
      },
      'close': {
        'cls': CloseCmd
      },
      'edit': {
        'cmds': {
          'source': setVarCmd('source'),
          'save': {
            'aliasOf': 'core:exec_parent'
          }
        },
        'cls': EditCmd
      },
      'namespace': {
        'cls': NameSpaceCmd
      },
      'nspc': {
        'aliasOf': 'core:namespace'
      },
      'emmet': {
        'cls': EmmetCmd
      }
    });
    html = Codewave.Command.cmds.addCmd(new Codewave.Command('html'));
    return html.addCmds({
      'fallback': {
        'aliasOf': 'core:emmet',
        'defaults': {
          'lang': 'html'
        },
        'nameToParam': 'abbr'
      }
    });
  };

  this.Codewave.Command.cmdInitialisers.push(initCmds);

  setVarCmd = function(name) {
    return {
      execute: function(instance) {
        var p, val;
        val = (p = instance.getParam(0)) != null ? p : instance.content ? instance.content : void 0;
        if (val != null) {
          return instance.codewave.vars[name] = val;
        }
      }
    };
  };

  no_execute = function(instance) {
    var re;
    re = new RegExp("^" + Codewave.util.escapeRegExp(instance.codewave.brakets) + Codewave.util.escapeRegExp(instance.codewave.noExecuteChar), "");
    return instance.str.replace(re, instance.codewave.brakets);
  };

  quote_carret = function(instance) {
    return instance.content.replace(/\|/g, '||');
  };

  exec_parent = function(instance) {
    var res;
    if (instance.parent != null) {
      res = instance.parent.execute();
      instance.replaceStart = instance.parent.replaceStart;
      instance.replaceEnd = instance.parent.replaceEnd;
      return res;
    }
  };

  BoxCmd = (function(_super) {
    __extends(BoxCmd, _super);

    function BoxCmd(instance) {
      var bounds, params, _ref;
      this.instance = instance;
      if (this.instance.content) {
        bounds = this.textBounds(this.instance.content);
        _ref = [bounds.width, bounds.height], this.width = _ref[0], this.height = _ref[1];
      } else {
        this.width = 50;
        this.height = 3;
      }
      params = ['width'];
      if (this.instance.params.length > 1) {
        params.push(0);
      }
      this.width = this.instance.getParam(params, this.width);
      params = ['height'];
      if (this.instance.params.length > 1) {
        params.push(1);
      } else if (this.instance.params.length > 0) {
        params.push(0);
      }
      this.height = this.instance.getParam(params, this.height);
      this.cmd = this.instance.getParam(['cmd']);
      this.deco = this.instance.codewave.deco;
      this.pad = 2;
    }

    BoxCmd.prototype.result = function() {
      return this.startSep() + "\n" + this.lines(this.instance.content) + "\n" + this.endSep();
    };

    BoxCmd.prototype.wrapComment = function(str) {
      return this.instance.codewave.wrapComment(str);
    };

    BoxCmd.prototype.separator = function() {
      var len;
      len = this.width + 2 * this.pad + 2 * this.deco.length;
      return this.wrapComment(this.decoLine(len));
    };

    BoxCmd.prototype.startSep = function() {
      var cmd, ln;
      cmd = '';
      if (this.cmd != null) {
        cmd = this.instance.codewave.brakets + this.cmd + this.instance.codewave.brakets;
      }
      ln = this.width + 2 * this.pad + 2 * this.deco.length - cmd.length;
      return this.wrapComment(cmd + this.decoLine(ln));
    };

    BoxCmd.prototype.endSep = function() {
      var closing, ln;
      closing = '';
      if (this.cmd != null) {
        closing = this.instance.codewave.brakets + this.instance.codewave.closeChar + this.cmd.split(" ")[0] + this.instance.codewave.brakets;
      }
      ln = this.width + 2 * this.pad + 2 * this.deco.length - closing.length;
      return this.wrapComment(closing + this.decoLine(ln));
    };

    BoxCmd.prototype.decoLine = function(len) {
      return Array(Math.ceil(len / this.deco.length) + 1).join(this.deco).substring(0, len);
    };

    BoxCmd.prototype.padding = function() {
      return Codewave.util.repeatToLength(" ", this.pad);
    };

    BoxCmd.prototype.lines = function(text) {
      var lines, x;
      if (text == null) {
        text = '';
      }
      text = text || '';
      lines = text.replace(/\r/g, '').split("\n");
      return ((function() {
        var _i, _ref, _results;
        _results = [];
        for (x = _i = 0, _ref = this.height; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
          _results.push(this.line(lines[x] || ''));
        }
        return _results;
      }).call(this)).join('\n');
    };

    BoxCmd.prototype.line = function(text) {
      if (text == null) {
        text = '';
      }
      return this.wrapComment(this.deco + this.padding() + text + Codewave.util.repeatToLength(" ", this.width - this.instance.codewave.removeCarret(text).length) + this.padding() + this.deco);
    };

    BoxCmd.prototype.textBounds = function(text) {
      return Codewave.util.getTxtSize(this.instance.codewave.removeCarret(text));
    };

    return BoxCmd;

  })(this.Codewave.BaseCommand);

  CloseCmd = (function(_super) {
    __extends(CloseCmd, _super);

    function CloseCmd(instance) {
      this.instance = instance;
      this.deco = this.instance.codewave.deco;
    }

    CloseCmd.prototype.startFind = function() {
      return this.instance.codewave.wrapCommentLeft(this.deco + this.deco);
    };

    CloseCmd.prototype.endFind = function() {
      return this.instance.codewave.wrapCommentRight(this.deco + this.deco);
    };

    CloseCmd.prototype.execute = function() {
      var end, endFind, start, startFind;
      startFind = this.startFind();
      endFind = this.endFind();
      start = this.instance.codewave.findPrev(this.instance.pos, startFind);
      end = this.instance.codewave.findNext(this.instance.getEndPos(), endFind);
      if ((start != null) && (end != null)) {
        this.instance.codewave.editor.spliceText(start, end + endFind.length, '');
        return this.instance.codewave.editor.setCursorPos(start);
      } else {
        return this.instance.replaceWith('');
      }
    };

    return CloseCmd;

  })(this.Codewave.BaseCommand);

  EditCmd = (function(_super) {
    __extends(EditCmd, _super);

    function EditCmd(instance) {
      var _ref;
      this.instance = instance;
      this.cmdName = this.instance.getParam([0, 'cmd']);
      this.verbalize = (_ref = this.instance.getParam([1])) === 'v' || _ref === 'verbalize';
      this.cmd = this.cmdName != null ? this.instance.codewave.getCmd(this.cmdName) : null;
      this.editable = this.cmd != null ? this.cmd.isEditable() : true;
      this.content = this.instance.content;
    }

    EditCmd.prototype.result = function() {
      if (this.content) {
        return this.resultWithContent();
      } else {
        return this.resultWithoutContent();
      }
    };

    EditCmd.prototype.resultWithContent = function() {
      var parser;
      parser = this.instance.getParserForText(this.content);
      parser.parseAll();
      Codewave.Command.saveCmd(this.cmdName, {
        result: parser.vars.source
      });
      return '';
    };

    EditCmd.prototype.resultWithoutContent = function() {
      var name, parser, source;
      if (!this.cmd || this.editable) {
        source = this.cmd ? this.cmd.resultStr : '|';
        name = this.cmd ? this.cmd.fullName : this.cmdName;
        parser = this.instance.getParserForText("~~box cmd:\"" + this.instance.cmd.fullName + " " + name + "\"~~\n~~source~~\n" + source + "|\n~~/source~~\n~~save~~ ~~!close~~\n~~/box~~");
        parser.checkCarret = false;
        if (this.verbalize) {
          return parser.getText();
        } else {
          return parser.parseAll();
        }
      }
    };

    return EditCmd;

  })(this.Codewave.BaseCommand);

  NameSpaceCmd = (function(_super) {
    __extends(NameSpaceCmd, _super);

    function NameSpaceCmd(instance) {
      this.instance = instance;
    }

    NameSpaceCmd.prototype.result = function() {
      var namespaces, nspc, parser, txt, _i, _len;
      namespaces = this.instance.finder.namespaces;
      txt = '~~box~~\n';
      for (_i = 0, _len = namespaces.length; _i < _len; _i++) {
        nspc = namespaces[_i];
        txt += nspc + '\n';
      }
      txt += '~~!close|~~\n~~/box~~';
      parser = this.instance.getParserForText(txt);
      return parser.parseAll();
    };

    return NameSpaceCmd;

  })(this.Codewave.BaseCommand);

  EmmetCmd = (function(_super) {
    __extends(EmmetCmd, _super);

    function EmmetCmd(instance) {
      this.instance = instance;
      this.abbr = this.instance.getParam([0, 'abbr', 'abbreviation']);
      this.lang = this.instance.getParam([1, 'lang', 'language']);
    }

    EmmetCmd.prototype.result = function() {
      throw "Not Implemented";
    };

    return EmmetCmd;

  })(this.Codewave.BaseCommand);

}).call(this);

//# sourceMappingURL=core_cmds.js.map
