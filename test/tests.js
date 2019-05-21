"use strict";

var _bootstrap = require("../lib/bootstrap");

var _Command = require("../lib/Command");

var _TestCommandProvider = require("./testHelpers/TestCommandProvider");

require("./stringHelper");

require("./pair");

require("./wrapping");

require("./replacement");

require("./fileStorageEngine");

require("./box_helper");

require("./codewave");

require("./cmd_authoring");

require("./php");

_Command.Command.providers.push(new _TestCommandProvider.TestCommandProvider());
//# sourceMappingURL=maps/tests.js.map
