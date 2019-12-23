

const Command = require("../../lib/Command").Command;

var TestCommandProvider = class TestCommandProvider {
  register(cmds) {
    var test;
    test = cmds.addCmd(new Command('test'));
    return test.addCmds({
      'replace_box': {
        'replaceBox': true,
        'result': '~~box~~Lorem ipsum~~/box~~'
      }
    });
  }

};
exports.TestCommandProvider = TestCommandProvider;

