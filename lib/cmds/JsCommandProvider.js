

const Command = require("../Command").Command;

var JsCommandProvider = class JsCommandProvider {
  register(cmds) {
    var js;
    js = cmds.addCmd(new Command('js'));
    cmds.addCmd(new Command('javascript', {
      aliasOf: 'js'
    }));
    return js.addCmds({
      'comment': '/* ~~content~~ */',
      'if': 'if(|){\n\t~~content~~\n}',
      'log': 'if(window.console){\n\tconsole.log(~~content~~|)\n}',
      'function': 'function |() {\n\t~~content~~\n}',
      'funct': {
        aliasOf: 'js:function'
      },
      'f': {
        aliasOf: 'js:function'
      },
      'for': 'for (var i = 0; i < |; i++) {\n\t~~content~~\n}',
      'forin': 'for (var val in |) {\n\t~~content~~\n}',
      'each': {
        aliasOf: 'js:forin'
      },
      'foreach': {
        aliasOf: 'js:forin'
      },
      'while': 'while(|) {\n\t~~content~~\n}',
      'whilei': 'var i = 0;\nwhile(|) {\n\t~~content~~\n\ti++;\n}',
      'ifelse': 'if( | ) {\n\t~~content~~\n} else {\n\t\n}',
      'ife': {
        aliasOf: 'js:ifelse'
      },
      'switch': "switch( | ) { \n\tcase :\n\t\t~~content~~\n\t\tbreak;\n\tdefault :\n\t\t\n\t\tbreak;\n}"
    });
  }

};
exports.JsCommandProvider = JsCommandProvider;

