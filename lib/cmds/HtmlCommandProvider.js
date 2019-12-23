

const Command = require("../Command");

var HtmlCommandProvider = class HtmlCommandProvider {
  register(cmds) {
    var css, html;
    html = cmds.addCmd(new Command.Command('html'));
    html.addCmds({
      'fallback': {
        'aliasOf': 'core:emmet',
        'defaults': {
          'lang': 'html'
        },
        'nameToParam': 'abbr'
      }
    });
    css = cmds.addCmd(new Command.Command('css'));
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

