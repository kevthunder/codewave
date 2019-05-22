
import { Command } from '../Command';

export class JsCommandProvider
 register: (cmds)-> 
  js = cmds.addCmd(new Command('js'))
  cmds.addCmd(new Command('javascript',{ aliasOf: 'js' }))
  js.addCmds({
    'comment': '/* ~~content~~ */',
    'if':  'if(|){\n\t~~content~~\n}',
    'log':  'if(window.console){\n\tconsole.log(~~content~~|)\n}',
    'function':	'function |() {\n\t~~content~~\n}',
    'funct':{ aliasOf: 'js:function' },
    'f':{     aliasOf: 'js:function' },
    'for': 		'for (var i = 0; i < |; i++) {\n\t~~content~~\n}',
    'forin':'for (var val in |) {\n\t~~content~~\n}',
    'each':{  aliasOf: 'js:forin' },
    'foreach':{  aliasOf: 'js:forin' },
    'while':  'while(|) {\n\t~~content~~\n}',
    'whilei': 'var i = 0;\nwhile(|) {\n\t~~content~~\n\ti++;\n}',
    'ifelse': 'if( | ) {\n\t~~content~~\n} else {\n\t\n}',
    'ife':{   aliasOf: 'js:ifelse' },
    'switch':	"""
      switch( | ) { 
      \tcase :
      \t\t~~content~~
      \t\tbreak;
      \tdefault :
      \t\t
      \t\tbreak;
      }
      """,
  })
