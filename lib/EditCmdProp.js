"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditCmdProp = void 0;

var _Command = require("./Command");

// [pawa]
//   replace Codewave.Command.set codewave_core.core_cmds.set
var EditCmdProp = class EditCmdProp {
  constructor(name, options) {
    var defaults, i, key, len, ref, val;
    this.name = name;
    defaults = {
      'var': null,
      'opt': null,
      'funct': null,
      'dataName': null,
      'showEmpty': false,
      'carret': false
    };
    ref = ['var', 'opt', 'funct'];

    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];

      if (key in options) {
        defaults['dataName'] = options[key];
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

  setCmd(cmds) {
    return cmds[this.name] = _Command.Command.makeVarCmd(this.name);
  }

  writeFor(parser, obj) {
    if (parser.vars[this.name] != null) {
      return obj[this.dataName] = parser.vars[this.name];
    }
  }

  valFromCmd(cmd) {
    if (cmd != null) {
      if (this.opt != null) {
        return cmd.getOption(this.opt);
      }

      if (this.funct != null) {
        return cmd[this.funct]();
      }

      if (this.var != null) {
        return cmd[this.var];
      }
    }
  }

  showForCmd(cmd) {
    var val;
    val = this.valFromCmd(cmd);
    return this.showEmpty || val != null;
  }

  display(cmd) {
    if (this.showForCmd(cmd)) {
      return `~~${this.name}~~\n${this.valFromCmd(cmd) || ""}${this.carret ? "|" : ""}\n~~/${this.name}~~`;
    }
  }

};
exports.EditCmdProp = EditCmdProp;
EditCmdProp.source = class source extends EditCmdProp {
  valFromCmd(cmd) {
    var res;
    res = super.valFromCmd(cmd);

    if (res != null) {
      res = res.replace(/\|/g, '||'); // [pawa python] replace '/\|/g' "'|'"
    }

    return res;
  }

  setCmd(cmds) {
    return cmds[this.name] = _Command.Command.makeVarCmd(this.name, {
      'preventParseAll': true
    });
  }

  showForCmd(cmd) {
    var val;
    val = this.valFromCmd(cmd);
    return this.showEmpty && !(cmd != null && cmd.aliasOf != null) || val != null;
  }

};
EditCmdProp.string = class string extends EditCmdProp {
  display(cmd) {
    if (this.valFromCmd(cmd) != null) {
      return `~~!${this.name} '${this.valFromCmd(cmd)}${this.carret ? "|" : ""}'~~`;
    }
  }

};
EditCmdProp.revBool = class revBool extends EditCmdProp {
  setCmd(cmds) {
    return cmds[this.name] = _Command.Command.makeBoolVarCmd(this.name);
  }

  writeFor(parser, obj) {
    if (parser.vars[this.name] != null) {
      return obj[this.dataName] = !parser.vars[this.name];
    }
  }

  display(cmd) {
    var val;
    val = this.valFromCmd(cmd);

    if (val != null && !val) {
      return `~~!${this.name}~~`;
    }
  }

};
EditCmdProp.bool = class bool extends EditCmdProp {
  setCmd(cmds) {
    return cmds[this.name] = _Command.Command.makeBoolVarCmd(this.name);
  }

  display(cmd) {
    if (this.valFromCmd(cmd)) {
      return `~~!${this.name}~~`;
    }
  }

};
//# sourceMappingURL=maps/EditCmdProp.js.map
