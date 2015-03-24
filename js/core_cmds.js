// Generated by CoffeeScript 1.9.0
(function() {
  var BoxCmd, CloseCmd, EditCmd, EmmetCmd, NameSpaceCmd, closePhpForContent, exec_parent, getContent, initCmds, no_execute, quote_carret, setVarCmd, wrapWithPhp,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  initCmds = function() {
    var core, css, html, js, php, phpInner, phpOuter;
    core = Codewave.Command.cmds.addCmd(new Codewave.Command('core'));
    core.addDetector(new Codewave.LangDetector());
    core.addCmds({
      'help': {
        'replaceBox': true,
        'result': "~~box~~\n~~quote_carret~~\n  ___         _   __      __\n / __|___  __| |__\\ \\    / /_ ___ ______\n/ /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/\n\\____\\___/\\__,_\\___|\\_/\\_/\\__,_|\\_/\\___|\nThe text editor helper\n~~/quote_carret~~\n\nWhen using Codewave you will be writing commands directly within \nyour text editor editing windows. These commands must be placed\nbetween two pairs of \"~\" (tilde) and then with you text either \ninside or at the command, they can be executed by pressing \n\"ctrl\"+\"shift\"+\"e\".\nEx: ~~!hello~~\n\nOne good thing about codewave is that you dont need to actually\ntype any \"~\" (tilde), because pressing \"ctrl\"+\"shift\"+\"e\" will\nadd them if you are not allready within a command\n\nCodewave does not relly use UI to display any information. \ninstead, it uses text within code comments to mimic UIs. The \ngenerated comment blocks will be refered as windows in the help\nsections.\n\nTo close this window (ie. remove this comment bloc), press \n\"ctrl\"+\"shift\"+\"e\" with you cursor on the line bellow.\n~~!close|~~\n\nUse the following command for a walkthrough of some of many\nfeatures of codewave\n~~!help:get_started~~ or ~~!help:demo~~\n\nList of all helps subjects \n~~!help:subjects~~ or ~~!help:sub~~ \n\n~~!close~~\n~~/box~~",
        'cmds': {
          'subjects': {
            'replaceBox': true,
            'result': "~~box~~\n~~!help~~\n~~!help:get_started~~ (~~!help:demo~~)\n~~!help:subjects~~ (~~!help:sub~~)\n~~!help:editing~~ (~~!help:edit~~)\n~~!close|~~\n~~/box~~"
          },
          'sub': {
            'aliasOf': 'help:subjects'
          },
          'get_started': {
            'replaceBox': true,
            'result': "~~box~~\nThe classic Hello World.\n~~!hello|~~\n\n~~help:editing:intro~~\n~~quote_carret~~\n\nfor more information on creating your own commands, see:\n~~!help:editing~~\n\nCodewave come with many prexisting commands. Here an example of \njavascript abreviations\n~~!js:f~~\n~~!js:if~~\n  ~~!js:log~~\"~~!hello~~\"~~!/js:log~~\n~~!/js:if~~\n~~!/js:f~~\n\nCodeWave come with the exellent Emmet ( http://emmet.io/ ) to \nprovide event more abreviations. Emmet will fire automaticaly if\nyou are in a html or css file and no other command of the same \nname were defined.\n~~!ul>li~~ (if you are in a html doccument)\n~~!emmet ul>li~~\n~~!emmet m2 css~~\n\nCommands are stored in name spaces and some of the namespaces are\nactive depending of the context or they can be called explicitly. \nThe two following commands are the same and will display the \ncurrently  active namespace. The first command command works \nbecause the core namespace is active.\n~~!namespace~~\n~~!core:namespace~~\n\nyou can make an namespace active with the following command.\n~~!namespace php~~\n\nCheck the namespaces again\n~~!namespace~~\n\nAll the dialogs(windows) of codewave are made with the command \n\"box\" and you can use it in your own commands. you can also use a\n\"close\" command to make it easy to get rid of the window.\n~~!box~~\nThe box will scale with the content you put in it\n~~!close|~~\n~~!/box~~\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
          },
          'demo': {
            'aliasOf': 'help:get_started'
          },
          'editing': {
            'cmds': {
              'intro': {
                'result': "Codewave allows you to make you own commands (or abbreviations) \nput your content inside \"source\" the do \"save\". Try adding any \ntext that is on your mind.\n~~!edit my_new_command|~~\n\nIf you did the last step right, you should see your text when you\ndo the following command. It is now saved and you can use it \nwhenever you want.\n~~!my_new_command~~"
              }
            },
            'replaceBox': true,
            'result': "~~box~~\n~~help:editing:intro~~\n\n~~quote_carret~~\nWhen you make your command you may need to tell where the text cursor \nwill be located once the command is executed. To do that, use a \"|\" \n(Vertical bar). Use 2 of them if you want to print the actual \ncharacter.\n~~!box~~\none : | \ntwo : ||\n~~!/box~~\n\nIf you want to print a command without having it evalute when \nthe command is executed, use a \"!\" exclamation mark.\n~~!!hello~~\n\nfor commands that have both a openig and a closing tag, you can use\nthe \"content\" command. \"content\" will be replaced with the text\nthat is between tha tags. Look at the code of the following command\nfor en example of how it can be used.\n~~!edit php:inner:if~~\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
          },
          'edit': {
            'aliasOf': 'help:editing'
          }
        }
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
      'content': {
        'result': getContent
      },
      'box': {
        'cls': BoxCmd
      },
      'close': {
        'cls': CloseCmd
      },
      'edit': {
        'cmds': {
          'source': Codewave.util.merge(setVarCmd('source'), {
            'preventParseAll': true
          }),
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
    html.addCmds({
      'fallback': {
        'aliasOf': 'core:emmet',
        'defaults': {
          'lang': 'html'
        },
        'nameToParam': 'abbr'
      }
    });
    css = Codewave.Command.cmds.addCmd(new Codewave.Command('css'));
    css.addCmds({
      'fallback': {
        'aliasOf': 'core:emmet',
        'defaults': {
          'lang': 'css'
        },
        'nameToParam': 'abbr'
      }
    });
    php = Codewave.Command.cmds.addCmd(new Codewave.Command('php'));
    php.addDetector(new Codewave.PairDetector({
      result: 'php:inner',
      opener: '<?php',
      closer: '?>',
      'else': 'php:outer'
    }));
    phpOuter = php.addCmd(new Codewave.Command('outer'));
    phpOuter.addCmds({
      'fallback': {
        aliasOf: 'php:inner:%name%',
        beforeExecute: closePhpForContent,
        alterResult: wrapWithPhp
      },
      'comment': '<?php /* ~~content~~ */ ?>',
      php: '<?php\n\t~~content~~|\n?>'
    });
    phpInner = php.addCmd(new Codewave.Command('inner'));
    phpInner.addCmds({
      'comment': '/* ~~content~~ */',
      'if': 'if(|){\n\t~~content~~\n}',
      'info': 'phpinfo();',
      'echo': 'echo ${id}',
      'e': {
        aliasOf: 'php:inner:echo'
      },
      'class': "class | {\n\tfunction __construct() {\n\t\t~~content~~\n\t}\n}",
      'c': {
        aliasOf: 'php:inner:class'
      },
      'function': 'function |() {\n\t~~content~~\n}',
      'funct': {
        aliasOf: 'php:inner:function'
      },
      'f': {
        aliasOf: 'php:inner:function'
      },
      'array': '$| = array();',
      'a': 'array()',
      'for': 'for ($i = 0; $i < $|; $i++) {\n\t~~content~~\n}',
      'foreach': 'foreach ($| as $key => $val) {\n\t~~content~~\n}',
      'each': {
        aliasOf: 'php:inner:foreach'
      },
      'while': 'while(|) {\n\t~~content~~\n}',
      'whilei': '$i = 0;\nwhile(|) {\n\t~~content~~\n\t$i++;\n}',
      'ifelse': 'if( | ) {\n\t~~content~~\n} else {\n\t\n}',
      'ife': {
        aliasOf: 'php:inner:ifelse'
      },
      'switch': "switch( | ) { \n\tcase :\n\t\t~~content~~\n\t\tbreak;\n\tdefault :\n\t\t\n\t\tbreak;\n}"
    });
    js = Codewave.Command.cmds.addCmd(new Codewave.Command('js'));
    return js.addCmds({
      'comment': '/* ~~content~~ */',
      'if': 'if(|){\n\t~~content~~\n}',
      'log': 'if(window.console){\n\tconsole.log(~~content~~|)\n}',
      'function': 'function |() {\n\t~~content~~\n}',
      'funct': {
        aliasOf: 'js:function'
      },
      'f': {
        aliasOf: 'js:function'
      },
      'for': 'for (var i = 0; i < |; i++) {\n\t~~content~~\n}',
      'forin': 'foreach (var val in |) {\n\t~~content~~\n}',
      'each': {
        aliasOf: 'js:forin'
      },
      'foreach': {
        aliasOf: 'js:forin'
      },
      'while': 'while(|) {\n\t~~content~~\n}',
      'whilei': 'var i = 0;\nwhile(|) {\n\t~~content~~\n\ti++;\n}',
      'ifelse': 'if( | ) {\n\t~~content~~\n} else {\n\t\n}',
      'ife': {
        aliasOf: 'js:ifelse'
      },
      'switch': "switch( | ) { \n\tcase :\n\t\t~~content~~\n\t\tbreak;\n\tdefault :\n\t\t\n\t\tbreak;\n}"
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
    var reg;
    reg = new RegExp("^(" + Codewave.util.escapeRegExp(instance.codewave.brakets) + ')' + Codewave.util.escapeRegExp(instance.codewave.noExecuteChar));
    return instance.str.replace(reg, '$1');
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

  getContent = function(instance) {
    if (instance.codewave.inInstance != null) {
      return instance.codewave.inInstance.content || '';
    }
  };

  wrapWithPhp = function(result) {
    var regClose, regOpen;
    regOpen = /<\?php\s([\\n\\r\s]+)/g;
    regClose = /([\n\r\s]+)\s\?>/g;
    return '<?php ' + result.replace(regOpen, '$1<?php ').replace(regClose, ' ?>$1') + ' ?>';
  };

  closePhpForContent = function(instance) {
    return instance.content = ' ?>' + (instance.content || '') + '<?php ';
  };

  BoxCmd = (function(_super) {
    __extends(BoxCmd, _super);

    function BoxCmd() {
      return BoxCmd.__super__.constructor.apply(this, arguments);
    }

    BoxCmd.prototype.init = function() {
      var bounds, height, params, width, _ref;
      this.helper = new Codewave.util.BoxHelper(this.instance.context);
      this.cmd = this.instance.getParam(['cmd']);
      if (this.cmd != null) {
        this.helper.openText = this.instance.codewave.brakets + this.cmd + this.instance.codewave.brakets;
        this.helper.closeText = this.instance.codewave.brakets + this.instance.codewave.closeChar + this.cmd.split(" ")[0] + this.instance.codewave.brakets;
      }
      this.helper.deco = this.instance.codewave.deco;
      this.helper.pad = 2;
      if (this.instance.content) {
        bounds = this.helper.textBounds(this.instance.content);
        _ref = [bounds.width, bounds.height], width = _ref[0], height = _ref[1];
      } else {
        width = 50;
        height = 3;
      }
      params = ['width'];
      if (this.instance.params.length > 1) {
        params.push(0);
      }
      this.helper.width = Math.max(this.minWidth(), this.instance.getParam(params, width));
      params = ['height'];
      if (this.instance.params.length > 1) {
        params.push(1);
      } else if (this.instance.params.length > 0) {
        params.push(0);
      }
      return this.helper.height = this.instance.getParam(params, height);
    };

    BoxCmd.prototype.result = function() {
      return this.helper.draw(this.instance.content);
    };

    BoxCmd.prototype.minWidth = function() {
      if (this.cmd != null) {
        return this.cmd.length;
      } else {
        return 0;
      }
    };

    return BoxCmd;

  })(this.Codewave.BaseCommand);

  CloseCmd = (function(_super) {
    __extends(CloseCmd, _super);

    function CloseCmd() {
      return CloseCmd.__super__.constructor.apply(this, arguments);
    }

    CloseCmd.prototype.init = function() {
      return this.helper = new Codewave.util.BoxHelper(this.instance.context);
    };

    CloseCmd.prototype.execute = function() {
      var box;
      box = this.helper.getBoxForPos(this.instance.getPos());
      if (box != null) {
        this.instance.codewave.editor.spliceText(box.start, box.end, '');
        return this.instance.codewave.editor.setCursorPos(box.start);
      } else {
        return this.instance.replaceWith('');
      }
    };

    return CloseCmd;

  })(this.Codewave.BaseCommand);

  EditCmd = (function(_super) {
    __extends(EditCmd, _super);

    function EditCmd() {
      return EditCmd.__super__.constructor.apply(this, arguments);
    }

    EditCmd.prototype.init = function() {
      var _ref;
      this.cmdName = this.instance.getParam([0, 'cmd']);
      this.verbalize = (_ref = this.instance.getParam([1])) === 'v' || _ref === 'verbalize';
      if (this.cmdName != null) {
        this.finder = this.instance.context.getFinder(this.cmdName);
        this.finder.useFallbacks = false;
        this.cmd = this.finder.find();
      }
      this.editable = this.cmd != null ? this.cmd.isEditable() : true;
      return this.content = this.instance.content;
    };

    EditCmd.prototype.getOptions = function() {
      return {
        allowedNamed: ['cmd']
      };
    };

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
        source = this.cmd ? this.cmd.resultStr : '';
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

    function NameSpaceCmd() {
      return NameSpaceCmd.__super__.constructor.apply(this, arguments);
    }

    NameSpaceCmd.prototype.init = function() {
      return this.name = this.instance.getParam([0]);
    };

    NameSpaceCmd.prototype.result = function() {
      var namespaces, nspc, parser, txt, _i, _len;
      if (this.name != null) {
        this.instance.codewave.getRoot().context.addNameSpace(this.name);
        return '';
      } else {
        namespaces = this.instance.context.getNameSpaces();
        txt = '~~box~~\n';
        for (_i = 0, _len = namespaces.length; _i < _len; _i++) {
          nspc = namespaces[_i];
          if (nspc !== this.instance.cmd.fullName) {
            txt += nspc + '\n';
          }
        }
        txt += '~~!close|~~\n~~/box~~';
        parser = this.instance.getParserForText(txt);
        return parser.parseAll();
      }
    };

    return NameSpaceCmd;

  })(this.Codewave.BaseCommand);

  EmmetCmd = (function(_super) {
    __extends(EmmetCmd, _super);

    function EmmetCmd() {
      return EmmetCmd.__super__.constructor.apply(this, arguments);
    }

    EmmetCmd.prototype.init = function() {
      this.abbr = this.instance.getParam([0, 'abbr', 'abbreviation']);
      return this.lang = this.instance.getParam([1, 'lang', 'language']);
    };

    EmmetCmd.prototype.result = function() {
      var res;
      if (typeof emmet !== "undefined" && emmet !== null) {
        res = emmet.expandAbbreviation(this.abbr, this.lang);
        return res.replace(/\$\{0\}/g, '|');
      }
    };

    return EmmetCmd;

  })(this.Codewave.BaseCommand);

}).call(this);

//# sourceMappingURL=core_cmds.js.map
