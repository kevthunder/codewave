
import { StringHelper } from '../helpers/StringHelper';
import { Command } from '../Command';
import { PairDetector } from '../Detector';

export class PhpCommandProvider
 register: (cmds)-> 
  php = cmds.addCmd(new Command('php'))
  php.addDetector(new PairDetector({
    result: 'php:inner',
    opener: '<?php',
    closer: '?>',
    optionnal_end: true,
    'else': 'php:outer'
  })) 

  phpOuter = php.addCmd(new Command('outer'))
  phpOuter.addCmds({
    'fallback':{
      'cmds' : {
        'any_content': { 
          aliasOf: 'core:content' 
          defaults: {
            prefix: ' ?>\n'
            suffix: '\n<?php '
            affixes_empty: true
          }
        },
      }
      aliasOf: 'php:inner:%name%',
      alterResult: wrapWithPhp
    },
    'box': { 
      aliasOf: 'core:box' 
      defaults: {
        prefix: '<?php\n'
        suffix: '\n?>'
      }
    },
    'comment': '/* ~~content~~ */',
    php: '<?php\n\t~~content~~|\n?>',
  })
  
  phpInner = php.addCmd(new Command('inner'))
  phpInner.addCmds({
    'any_content': { aliasOf: 'core:content' },
    'comment': '/* ~~content~~ */',
    'if':   'if(|){\n\t~~any_content~~\n}',
    'info': 'phpinfo();',
    'echo': 'echo |',
    'e':{   aliasOf: 'php:inner:echo' },
    'class':{
      result : """
        class ~~param 0 class def:|~~ {
        \tfunction __construct() {
        \t\t~~content~~|
        \t}
        }
        """,
      defaults: {
        inline: false
      }
    },
    'c':{     aliasOf: 'php:inner:class' },
    'function':	{
      result : 'function |() {\n\t~~content~~\n}'
      defaults: {
        inline: false
      }
    },
    'funct':{ aliasOf: 'php:inner:function' },
    'f':{     aliasOf: 'php:inner:function' },
    'array':  '$| = array();',
    'a':	    'array()',
    'for': 		'for ($i = 0; $i < $|; $i++) {\n\t~~any_content~~\n}',
    'foreach':'foreach ($| as $key => $val) {\n\t~~any_content~~\n}',
    'each':{  aliasOf: 'php:inner:foreach' },
    'while':  'while(|) {\n\t~~any_content~~\n}',
    'whilei': {
      result : '$i = 0;\nwhile(|) {\n\t~~any_content~~\n\t$i++;\n}',
      defaults: {
        inline: false
      }
    },
    'ifelse': 'if( | ) {\n\t~~any_content~~\n} else {\n\t\n}',
    'ife':{   aliasOf: 'php:inner:ifelse' },
    'switch':	{
      result : """
        switch( | ) { 
        \tcase :
        \t\t~~any_content~~
        \t\tbreak;
        \tdefault :
        \t\t
        \t\tbreak;
        }
        """,
      defaults: {
        inline: false
      }
    }
    'close': { 
      aliasOf: 'core:close' 
      defaults: {
        prefix: '<?php\n'
        suffix: '\n?>'
        required_affixes: false
      }
    },
  })
  

wrapWithPhp = (result,instance) ->
  inline = instance.getParam(['php_inline','inline'],true)
  if inline
    regOpen = /<\?php\s([\\n\\r\s]+)/g
    regClose = /([\n\r\s]+)\s\?>/g
    return '<?php ' + result.replace(regOpen, '$1<?php ').replace(regClose, ' ?>$1') + ' ?>'
  else
    '<?php\n' + StringHelper.indent(result) + '\n?>'

# closePhpForContent = (instance) ->
#   instance.content = ' ?>'+(instance.content || '')+'<?php '