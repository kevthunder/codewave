# [pawa python]
#   replace @Codewave.Command.cmdInitialisers command.cmdInitialisersBaseCommand
#   replace (BaseCommand (command.BaseCommand
#   replace EditCmd.props editCmdProps
#   replace EditCmd.setCmds editCmdSetCmds reparse
import { Command } from '../Command';

initCmds = ->
  html = Codewave.Command.cmds.addCmd(new Command('html'))
  html.addCmds({
    'fallback':{
      'aliasOf' : 'core:emmet',
      'defaults' : {'lang':'html'},
      'nameToParam' : 'abbr'
    },
  })
  
  css = Codewave.Command.cmds.addCmd(new Command('css'))
  css.addCmds({
    'fallback':{
      'aliasOf' : 'core:emmet',
      'defaults' : {'lang':'css'},
      'nameToParam' : 'abbr'
    },
  })

@Codewave.Command.cmdInitialisers.push(initCmds)
