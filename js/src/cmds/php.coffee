# [pawa python]
#   replace @Codewave.Command.cmdInitialisers command.cmdInitialisersBaseCommand
#   replace (BaseCommand (command.BaseCommand
#   replace EditCmd.props editCmdProps
#   replace EditCmd.setCmds editCmdSetCmds reparse

initCmds = ->
  php = Codewave.Command.cmds.addCmd(new Codewave.Command('php'))
  php.addDetector(new Codewave.PairDetector({
    result: 'php:inner',
    opener: '<?php',
    closer: '?>',
    'else': 'php:outer'
  })) 

  phpOuter = php.addCmd(new Codewave.Command('outer'))
  phpOuter.addCmds({
    'fallback':{
      'cmds' : {
        'any_content': ' ?>\n~~content~~\n<?php ',
      }
      aliasOf: 'php:inner:%name%',
      # beforeExecute: closePhpForContent
      alterResult: wrapWithPhp
    },
    'comment': '<?php /* ~~content~~ */ ?>',
    php: '<?php\n\t~~content~~|\n?>',
  })
  
  phpInner = php.addCmd(new Codewave.Command('inner'))
  phpInner.addCmds({
    'any_content': '~~content~~',
    'comment': '/* ~~content~~ */',
    'if':   'if(|){\n\t~~any_content~~\n}',
    'info': 'phpinfo();',
    'echo': 'echo ${id}',
    'e':{   aliasOf: 'php:inner:echo' },
    'class':"""
      class ~~param 0 class def:|~~ {
      \tfunction __construct() {
      \t\t~~content~~|
      \t}
      }
      """,
    'c':{     aliasOf: 'php:inner:class' },
    'function':	'function |() {\n\t~~content~~\n}',
    'funct':{ aliasOf: 'php:inner:function' },
    'f':{     aliasOf: 'php:inner:function' },
    'array':  '$| = array();',
    'a':	    'array()',
    'for': 		'for ($i = 0; $i < $|; $i++) {\n\t~~any_content~~\n}',
    'foreach':'foreach ($| as $key => $val) {\n\t~~any_content~~\n}',
    'each':{  aliasOf: 'php:inner:foreach' },
    'while':  'while(|) {\n\t~~any_content~~\n}',
    'whilei': '$i = 0;\nwhile(|) {\n\t~~any_content~~\n\t$i++;\n}',
    'ifelse': 'if( | ) {\n\t~~any_content~~\n} else {\n\t\n}',
    'ife':{   aliasOf: 'php:inner:ifelse' },
    'switch':	"""
      switch( | ) { 
      \tcase :
      \t\t~~any_content~~
      \t\tbreak;
      \tdefault :
      \t\t
      \t\tbreak;
      }
      """,
  })
  

@Codewave.Command.cmdInitialisers.push(initCmds)


wrapWithPhp = (result,instance) ->
  regOpen = /<\?php\s([\\n\\r\s]+)/g
  regClose = /([\n\r\s]+)\s\?>/g
  return '<?php ' + result.replace(regOpen, '$1<?php ').replace(regClose, ' ?>$1') + ' ?>'

closePhpForContent = (instance) ->
  instance.content = ' ?>'+(instance.content || '')+'<?php '