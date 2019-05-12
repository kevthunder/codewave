"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HtmlCommandProvider = void 0;

var _Command = require("../Command");

var HtmlCommandProvider = class HtmlCommandProvider {
  register(cmds) {
    var css, html;
    html = cmds.addCmd(new _Command.Command('html'));
    html.addCmds({
      'fallback': {
        'aliasOf': 'core:emmet',
        'defaults': {
          'lang': 'html'
        },
        'nameToParam': 'abbr'
      }
    });
    css = cmds.addCmd(new _Command.Command('css'));
    return css.addCmds({
      'fallback': {
        'aliasOf': 'core:emmet',
        'defaults': {
          'lang': 'css'
        },
        'nameToParam': 'abbr'
      }
    });
  }

};
exports.HtmlCommandProvider = HtmlCommandProvider;
//# sourceMappingURL=../maps/cmds/HtmlCommandProvider.js.map
