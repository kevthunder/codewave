"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestCommandProvider = void 0;

var _Command = require("../../lib/Command");

var TestCommandProvider = class TestCommandProvider {
  register(cmds) {
    var test;
    test = cmds.addCmd(new _Command.Command('test'));
    return test.addCmds({
      'replace_box': {
        'replaceBox': true,
        'result': '~~box~~Lorem ipsum~~/box~~'
      }
    });
  }

};
exports.TestCommandProvider = TestCommandProvider;
//# sourceMappingURL=../maps/testHelpers/TestCommandProvider.js.map
