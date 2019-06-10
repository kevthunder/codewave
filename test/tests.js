"use strict";

var _bootstrap = require("../lib/bootstrap");

var _Command = require("../lib/Command");

var _TestCommandProvider = require("./testHelpers/TestCommandProvider");

require("./helpers/stringHelper");

require("./positioning/pair");

require("./positioning/wrapping");

require("./positioning/replacement");

require("./storageEngines/fileStorageEngine");

require("./box_helper");

require("./codewave");

require("./cmds/core");

require("./cmds/cmd_authoring");

require("./cmds/php");

_Command.Command.providers.push(new _TestCommandProvider.TestCommandProvider());
//# sourceMappingURL=maps/tests.js.map
