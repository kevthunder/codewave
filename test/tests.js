require('../lib/bootstrap')

const Command = require('../lib/Command').Command

const TestCommandProvider = require('./testHelpers/TestCommandProvider')

require('./helpers/stringHelper')

require('./helpers/pathHelper')

require('./positioning/pair')

require('./positioning/wrapping')

require('./positioning/replacement')

require('./fileSystem/localFiles')

require('./storageEngines/fileStorageEngine')

require('./stringParsers/paramParser')

require('./box_helper')

require('./editor')

require('./codewave')

require('./cmds/core')

require('./cmds/string')

require('./cmds/cmd_authoring')

require('./cmds/file')

require('./cmds/php')

Command.providers.push(new TestCommandProvider.TestCommandProvider())
