
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