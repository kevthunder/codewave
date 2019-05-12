# [pawa python]
#   replace @Codewave.Command.cmdInitialisers command.cmdInitialisersBaseCommand
#   replace (BaseCommand (command.BaseCommand
#   replace EditCmd.props editCmdProps
#   replace EditCmd.setCmds editCmdSetCmds reparse
import { Command } from '../../lib/Command';

export class TestCommandProvider
 register: (cmds)-> 
  test = cmds.addCmd(new Command('test'))
  test.addCmds({
    'replace_box': {
      'replaceBox' : true,
      'result' : '~~box~~Lorem ipsum~~/box~~'
    }
  })