"use strict";

var _bootstrap = require("../lib/bootstrap");

var _Command = require("../lib/Command");

var _TestCommandProvider = require("./testHelpers/TestCommandProvider");

require("./helpers/stringHelper");

require("./helpers/pathHelper");

require("./positioning/pair");

require("./positioning/wrapping");

require("./positioning/replacement");

require("./fileSystem/localFiles");

require("./storageEngines/fileStorageEngine");

require("./stringParsers/paramParser");

require("./box_helper");

require("./codewave");

require("./cmds/core");

require("./cmds/cmd_authoring");

require("./cmds/file");

require("./cmds/php");

_Command.Command.providers.push(new _TestCommandProvider.TestCommandProvider());
//# sourceMappingURL=maps/tests.js.map
