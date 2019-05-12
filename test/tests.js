"use strict";

var _bootstrap = require("../lib/bootstrap");

var _Command = require("../lib/Command");

var _TestCommandProvider = require("./testHelpers/TestCommandProvider");

require("./codewave");

_Command.Command.providers.push(new _TestCommandProvider.TestCommandProvider());
//# sourceMappingURL=maps/tests.js.map
