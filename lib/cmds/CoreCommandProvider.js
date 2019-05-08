var BoxCmd, CloseCmd, EditCmd, EmmetCmd, NameSpaceCmd, aliasCommand, exec_parent, getContent, getParam, no_execute, quote_carret, removeCommand, renameCommand;

import {
  Command,
  BaseCommand
} from '../Command';

import {
  LangDetector
} from '../Detector';

import {
  BoxHelper
} from '../BoxHelper';

import {
  EditCmdProp
} from '../EditCmdProp';

import {
  StringHelper
} from '../helpers/StringHelper';

import {
  Replacement
} from '../positioning/Replacement';

export var CoreCommandProvider = class CoreCommandProvider {
  register(cmds) {
    var core;
    core = cmds.addCmd(new Command('core'));
    core.addDetector(new LangDetector());
    return core.addCmds({
      'help': {
        'replaceBox': true,
        'result': "~~box~~\n~~quote_carret~~\n  ___         _   __      __\n / __|___  __| |__\\ \\    / /_ ___ ______\n/ /__/ _ \\/ _` / -_\\ \\/\\/ / _` \\ V / -_/\n\\____\\___/\\__,_\\___|\\_/\\_/\\__,_|\\_/\\___|\nThe text editor helper\n~~/quote_carret~~\n\nWhen using Codewave you will be writing commands within \nyour text editor. These commands must be placed between two \npairs of \"~\" (tilde) and then, they can be executed by pressing \n\"ctrl\"+\"shift\"+\"e\", with your cursor inside the command\nEx: ~~!hello~~\n\nYou dont need to actually type any \"~\" (tilde). \nPressing \"ctrl\"+\"shift\"+\"e\" will add them if you are not already\nwithin a command.\n\nCodewave does not use UI to display any information. \nInstead, it uses text within code comments to mimic UIs. \nThe generated comment blocks will be referred to as windows \nin the help sections.\n\nTo close this window (i.e. remove this comment block), press \n\"ctrl\"+\"shift\"+\"e\" with your cursor on the line bellow.\n~~!close|~~\n\nUse the following command for a walkthrough of some of the many\nfeatures of Codewave\n~~!help:get_started~~ or ~~!help:demo~~\n\nList of all help subjects \n~~!help:subjects~~ or ~~!help:sub~~ \n\n~~!close~~\n~~/box~~",
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
            'result': "~~box~~\nThe classic Hello World.\n~~!hello|~~\n\n~~help:editing:intro~~\n~~quote_carret~~\n\nFor more information on creating your own commands, see:\n~~!help:editing~~\n\nCodewave comes with many pre-existing commands. Here is an example\nof JavaScript abbreviations\n~~!js:f~~\n~~!js:if~~\n  ~~!js:log~~\"~~!hello~~\"~~!/js:log~~\n~~!/js:if~~\n~~!/js:f~~\n\nCodeWave comes with the excellent Emmet ( http://emmet.io/ ) to \nprovide event more abbreviations. Emmet abbreviations will be \nused automatically if you are in a HTML or CSS file.\n~~!ul>li~~ (if you are in a html doccument)\n~~!emmet ul>li~~\n~~!emmet m2 css~~\n\nCommands are stored in namespaces. The same command can have \ndifferent results depending on the namespace.\n~~!js:each~~\n~~!php:outer:each~~\n~~!php:inner:each~~\n\nSome of the namespaces are active depending on the context. The\nfollowing commands are the same and will display the currently\nactive namespace. The first command command works because the \ncore namespace is active.\n~~!namespace~~\n~~!core:namespace~~\n\nYou can make a namespace active with the following command.\n~~!namespace php~~\n\nCheck the namespaces again\n~~!namespace~~\n\nIn addition to detecting the document type, Codewave can detect the\ncontext from the surrounding text. In a PHP file, it means Codewave \nwill add the PHP tags when you need them.\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
          },
          'demo': {
            'aliasOf': 'help:get_started'
          },
          'editing': {
            'cmds': {
              'intro': {
                'result': "Codewave allows you to make your own commands (or abbreviations) \nput your content inside \"source\" the do \"save\". Try adding any \ntext that is on your mind.\n~~!edit my_new_command|~~\n\nIf you did the last step right, you should see your text when you\ndo the following command. It is now saved and you can use it \nwhenever you want.\n~~!my_new_command~~"
              }
            },
            'replaceBox': true,
            'result': "~~box~~\n~~help:editing:intro~~\n\nAll the windows of Codewave are made with the command \"box\". \nThey are meant to display text that should not remain in your code. \nThey are valid comments so they won't break your code and the command \n\"close\" can be used to remove them rapidly. You can make your own \ncommands with them if you need to display some text temporarily.\n~~!box~~\nThe box will scale with the content you put in it\n~~!close|~~\n~~!/box~~\n\n~~quote_carret~~\nWhen you create a command, you may want to specify where the cursor \nwill be located once the command is expanded. To do that, use a \"|\" \n(Vertical bar). Use 2 of them if you want to print the actual \ncharacter.\n~~!box~~\none : | \ntwo : ||\n~~!/box~~\n\nYou can also use the \"escape_pipes\" command that will escape any \nvertical bars that are between its opening and closing tags\n~~!escape_pipes~~\n|\n~~!/escape_pipes~~\n\nCommands inside other commands will be expanded automatically.\nIf you want to print a command without having it expand when \nthe parent command is expanded, use a \"!\" (exclamation mark).\n~~!!hello~~\n\nFor commands that have both an opening and a closing tag, you can use\nthe \"content\" command. \"content\" will be replaced with the text\nthat is between the tags. Here is an example of how it can be used.\n~~!edit php:inner:if~~\n\n~~/quote_carret~~\n~~!close|~~\n~~/box~~"
          },
          'edit': {
            'aliasOf': 'help:editing'
          }
        }
      },
      'no_execute': {
        'result': no_execute
      },
      'escape_pipes': {
        'result': quote_carret,
        'checkCarret': false
      },
      'quote_carret': {
        'aliasOf': 'core:escape_pipes'
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
      'param': {
        'result': getParam
      },
      'edit': {
        'cmds': EditCmd.setCmds({
          'save': {
            'aliasOf': 'core:exec_parent'
          }
        }),
        'cls': EditCmd
      },
      'rename': {
        'cmds': {
          'not_applicable': "~~box~~\nYou can only rename commands that you created yourself.\n~~!close|~~\n~~/box~~",
          'not_found': "~~box~~\nCommand not found\n~~!close|~~\n~~/box~~"
        },
        'result': renameCommand,
        'parse': true
      },
      'remove': {
        'cmds': {
          'not_applicable': "~~box~~\nYou can only remove commands that you created yourself.\n~~!close|~~\n~~/box~~",
          'not_found': "~~box~~\nCommand not found\n~~!close|~~\n~~/box~~"
        },
        'result': removeCommand,
        'parse': true
      },
      'alias': {
        'cmds': {
          'not_found': "~~box~~\nCommand not found\n~~!close|~~\n~~/box~~"
        },
        'result': aliasCommand,
        'parse': true
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
  }

};

no_execute = function(instance) {
  var reg;
  reg = new RegExp("^(" + StringHelper.escapeRegExp(instance.codewave.brakets) + ')' + StringHelper.escapeRegExp(instance.codewave.noExecuteChar));
  return instance.str.replace(reg, '$1');
};

quote_carret = function(instance) {
  return instance.content.replace(/\|/g, '||'); // [pawa python] replace '/\|/g' "'|'"
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

renameCommand = function(instance) {
  var cmd, cmdData, newName, origninalName, savedCmds, storage;
  storage = new Storage();
  savedCmds = storage.load('cmds');
  origninalName = instance.getParam([0, 'from']);
  newName = instance.getParam([1, 'to']);
  if ((origninalName != null) && (newName != null)) {
    cmd = instance.context.getCmd(origninalName);
    if ((savedCmds[origninalName] != null) && (cmd != null)) {
      if (!(newName.indexOf(':') > -1)) {
        newName = cmd.fullName.replace(origninalName, '') + newName;
      }
      cmdData = savedCmds[origninalName];
      Command.cmds.setCmdData(newName, cmdData);
      cmd.unregister();
      savedCmds[newName] = cmdData;
      delete savedCmds[origninalName];
      storage.save('cmds', savedCmds);
      return "";
    } else if (cmd != null) {
      return "~~not_applicable~~";
    } else {
      return "~~not_found~~";
    }
  }
};

removeCommand = function(instance) {
  var cmd, cmdData, name, savedCmds, storage;
  name = instance.getParam([0, 'name']);
  if (name != null) {
    storage = new Storage();
    savedCmds = storage.load('cmds');
    cmd = instance.context.getCmd(name);
    if ((savedCmds[name] != null) && (cmd != null)) {
      cmdData = savedCmds[name];
      cmd.unregister();
      delete savedCmds[name];
      storage.save('cmds', savedCmds);
      return "";
    } else if (cmd != null) {
      return "~~not_applicable~~";
    } else {
      return "~~not_found~~";
    }
  }
};

aliasCommand = function(instance) {
  var alias, cmd, name;
  name = instance.getParam([0, 'name']);
  alias = instance.getParam([1, 'alias']);
  if ((name != null) && (alias != null)) {
    cmd = instance.context.getCmd(name);
    if (cmd != null) {
      cmd = cmd.getAliased() || cmd;
      // unless alias.indexOf(':') > -1
      // alias = cmd.fullName.replace(name,'') + alias
      Command.saveCmd(alias, {
        aliasOf: cmd.fullName
      });
      return "";
    } else {
      return "~~not_found~~";
    }
  }
};

getParam = function(instance) {
  if (instance.codewave.inInstance != null) {
    return instance.codewave.inInstance.getParam(instance.params, instance.getParam(['def', 'default']));
  }
};

BoxCmd = class BoxCmd extends BaseCommand {
  init() {
    this.helper = new BoxHelper(this.instance.context);
    this.cmd = this.instance.getParam(['cmd']);
    if (this.cmd != null) {
      this.helper.openText = this.instance.codewave.brakets + this.cmd + this.instance.codewave.brakets;
      this.helper.closeText = this.instance.codewave.brakets + this.instance.codewave.closeChar + this.cmd.split(" ")[0] + this.instance.codewave.brakets;
    }
    this.helper.deco = this.instance.codewave.deco;
    this.helper.pad = 2;
    this.helper.prefix = this.instance.getParam(['prefix'], '');
    return this.helper.suffix = this.instance.getParam(['suffix'], '');
  }

  height() {
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

  width() {
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

  bounds() {
    if (this.instance.content) {
      if (this._bounds == null) {
        this._bounds = this.helper.textBounds(this.instance.content);
      }
      return this._bounds;
    }
  }

  result() {
    this.helper.height = this.height();
    this.helper.width = this.width();
    return this.helper.draw(this.instance.content);
  }

  minWidth() {
    if (this.cmd != null) {
      return this.cmd.length;
    } else {
      return 0;
    }
  }

};

CloseCmd = class CloseCmd extends BaseCommand {
  init() {
    return this.helper = new BoxHelper(this.instance.context);
  }

  execute() {
    var box, box2, depth, prefix, required_affixes, suffix;
    prefix = this.helper.prefix = this.instance.getParam(['prefix'], '');
    suffix = this.helper.suffix = this.instance.getParam(['suffix'], '');
    box = this.helper.getBoxForPos(this.instance.getPos());
    required_affixes = this.instance.getParam(['required_affixes'], true);
    if (!required_affixes) {
      this.helper.prefix = this.helper.suffix = '';
      box2 = this.helper.getBoxForPos(this.instance.getPos());
      if ((box2 != null) && ((box == null) || box.start < box2.start - prefix.length || box.end > box2.end + suffix.length)) {
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

};

EditCmd = class EditCmd extends BaseCommand {
  init() {
    var ref;
    this.cmdName = this.instance.getParam([0, 'cmd']);
    this.verbalize = (ref = this.instance.getParam([1])) === 'v' || ref === 'verbalize';
    if (this.cmdName != null) {
      this.finder = this.instance.context.getFinder(this.cmdName);
      this.finder.useFallbacks = false;
      this.cmd = this.finder.find();
    }
    return this.editable = this.cmd != null ? this.cmd.isEditable() : true;
  }

  getOptions() {
    return {
      allowedNamed: ['cmd']
    };
  }

  result() {
    if (this.instance.content) {
      return this.resultWithContent();
    } else {
      return this.resultWithoutContent();
    }
  }

  resultWithContent() {
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

  propsDisplay() {
    var cmd;
    cmd = this.cmd;
    return EditCmd.props.map(function(p) {
      return p.display(cmd);
    }).filter(function(p) {
      return p != null;
    }).join("\n");
  }

  resultWithoutContent() {
    var name, parser;
    if (!this.cmd || this.editable) {
      name = this.cmd ? this.cmd.fullName : this.cmdName;
      parser = this.instance.getParserForText(`~~box cmd:"${this.instance.cmd.fullName} ${name}"~~\n${this.propsDisplay()}\n~~save~~ ~~!close~~\n~~/box~~`);
      parser.checkCarret = false;
      if (this.verbalize) {
        return parser.getText();
      } else {
        return parser.parseAll();
      }
    }
  }

};

EditCmd.setCmds = function(base) {
  var i, len, p, ref;
  ref = EditCmd.props;
  for (i = 0, len = ref.length; i < len; i++) {
    p = ref[i];
    p.setCmd(base);
  }
  return base;
};

EditCmd.props = [
  new EditCmdProp.revBool('no_carret',
  {
    opt: 'checkCarret'
  }),
  new EditCmdProp.revBool('no_parse',
  {
    opt: 'parse'
  }),
  new EditCmdProp.bool('prevent_parse_all',
  {
    opt: 'preventParseAll'
  }),
  new EditCmdProp.bool('replace_box',
  {
    opt: 'replaceBox'
  }),
  new EditCmdProp.string('name_to_param',
  {
    opt: 'nameToParam'
  }),
  new EditCmdProp.string('alias_of',
  {
    var: 'aliasOf',
    carret: true
  }),
  new EditCmdProp.source('help',
  {
    funct: 'help',
    showEmpty: true
  }),
  new EditCmdProp.source('source',
  {
    var: 'resultStr',
    dataName: 'result',
    showEmpty: true,
    carret: true
  })
];

NameSpaceCmd = class NameSpaceCmd extends BaseCommand {
  init() {
    return this.name = this.instance.getParam([0]);
  }

  result() {
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

};

EmmetCmd = class EmmetCmd extends BaseCommand {
  init() {
    this.abbr = this.instance.getParam([0, 'abbr', 'abbreviation']);
    return this.lang = this.instance.getParam([1, 'lang', 'language']);
  }

  result() {
    var emmet, ref, ref1, res;
    emmet = window.emmet != null ? window.emmet : ((ref = window.self) != null ? ref.emmet : void 0) != null ? window.self.emmet : ((ref1 = window.global) != null ? ref1.emmet : void 0) != null ? window.global.emmet : void 0;
    if (emmet != null) {
      // emmet.require('./parser/abbreviation').expand('ul>li', {pastedContent:'lorem'})
      res = emmet.expandAbbreviation(this.abbr, this.lang);
      return res.replace(/\$\{0\}/g, '|');
    }
  }

};

//# sourceMappingURL=../maps/cmds/CoreCommandProvider.js.map
