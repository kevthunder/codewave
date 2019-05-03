// [pawa python]
//   replace @Codewave.Command.cmdInitialisers command.cmdInitialisersBaseCommand
//   replace (BaseCommand (command.BaseCommand
//   replace EditCmd.props editCmdProps
//   replace EditCmd.setCmds editCmdSetCmds reparse
var initCmds;

initCmds = function() {
  var css, html;
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
  return css.addCmds({
    'fallback': {
      'aliasOf': 'core:emmet',
      'defaults': {
        'lang': 'css'
      },
      'nameToParam': 'abbr'
    }
  });
};

this.Codewave.Command.cmdInitialisers.push(initCmds);

//# sourceMappingURL=../maps/cmds/html.js.map
