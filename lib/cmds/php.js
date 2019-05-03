// [pawa python]
//   replace @Codewave.Command.cmdInitialisers command.cmdInitialisersBaseCommand
//   replace (BaseCommand (command.BaseCommand
//   replace EditCmd.props editCmdProps
//   replace EditCmd.setCmds editCmdSetCmds reparse
var initCmds, wrapWithPhp;

initCmds = function() {
  var php, phpInner, phpOuter;
  php = Codewave.Command.cmds.addCmd(new Codewave.Command('php'));
  php.addDetector(new Codewave.PairDetector({
    result: 'php:inner',
    opener: '<?php',
    closer: '?>',
    optionnal_end: true,
    'else': 'php:outer'
  }));
  phpOuter = php.addCmd(new Codewave.Command('outer'));
  phpOuter.addCmds({
    'fallback': {
      'cmds': {
        'any_content': {
          aliasOf: 'core:content',
          defaults: {
            prefix: ' ?>\n',
            suffix: '\n<?php ',
            affixes_empty: true
          }
        }
      },
      aliasOf: 'php:inner:%name%',
      alterResult: wrapWithPhp
    },
    'box': {
      aliasOf: 'core:box',
      defaults: {
        prefix: '<?php\n',
        suffix: '\n?>'
      }
    },
    'comment': '/* ~~content~~ */',
    php: '<?php\n\t~~content~~|\n?>'
  });
  phpInner = php.addCmd(new Codewave.Command('inner'));
  return phpInner.addCmds({
    'any_content': {
      aliasOf: 'core:content'
    },
    'comment': '/* ~~content~~ */',
    'if': 'if(|){\n\t~~any_content~~\n}',
    'info': 'phpinfo();',
    'echo': 'echo |',
    'e': {
      aliasOf: 'php:inner:echo'
    },
    'class': {
      result: "class ~~param 0 class def:|~~ {\n\tfunction __construct() {\n\t\t~~content~~|\n\t}\n}",
      defaults: {
        inline: false
      }
    },
    'c': {
      aliasOf: 'php:inner:class'
    },
    'function': {
      result: 'function |() {\n\t~~content~~\n}',
      defaults: {
        inline: false
      }
    },
    'funct': {
      aliasOf: 'php:inner:function'
    },
    'f': {
      aliasOf: 'php:inner:function'
    },
    'array': '$| = array();',
    'a': 'array()',
    'for': 'for ($i = 0; $i < $|; $i++) {\n\t~~any_content~~\n}',
    'foreach': 'foreach ($| as $key => $val) {\n\t~~any_content~~\n}',
    'each': {
      aliasOf: 'php:inner:foreach'
    },
    'while': 'while(|) {\n\t~~any_content~~\n}',
    'whilei': {
      result: '$i = 0;\nwhile(|) {\n\t~~any_content~~\n\t$i++;\n}',
      defaults: {
        inline: false
      }
    },
    'ifelse': 'if( | ) {\n\t~~any_content~~\n} else {\n\t\n}',
    'ife': {
      aliasOf: 'php:inner:ifelse'
    },
    'switch': {
      result: "switch( | ) { \n\tcase :\n\t\t~~any_content~~\n\t\tbreak;\n\tdefault :\n\t\t\n\t\tbreak;\n}",
      defaults: {
        inline: false
      }
    },
    'close': {
      aliasOf: 'core:close',
      defaults: {
        prefix: '<?php\n',
        suffix: '\n?>',
        required_affixes: false
      }
    }
  });
};

this.Codewave.Command.cmdInitialisers.push(initCmds);

wrapWithPhp = function(result, instance) {
  var inline, regClose, regOpen;
  inline = instance.getParam(['php_inline', 'inline'], true);
  if (inline) {
    regOpen = /<\?php\s([\\n\\r\s]+)/g;
    regClose = /([\n\r\s]+)\s\?>/g;
    return '<?php ' + result.replace(regOpen, '$1<?php ').replace(regClose, ' ?>$1') + ' ?>';
  } else {
    return '<?php\n' + Codewave.util.indent(result) + '\n?>';
  }
};

// closePhpForContent = (instance) ->
//   instance.content = ' ?>'+(instance.content || '')+'<?php '

//# sourceMappingURL=../maps/cmds/php.js.map