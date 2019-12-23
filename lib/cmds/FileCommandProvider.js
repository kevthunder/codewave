

const Command = require("../Command");

const BoxHelper = require("../BoxHelper");

const EditCmdProp = require("../EditCmdProp");

const StringHelper = require("../helpers/StringHelper");

const PathHelper = require("../helpers/PathHelper");

const Replacement = require("../positioning/Replacement");

var deleteCommand, readCommand, writeCommand;
var FileCommandProvider = class FileCommandProvider {
  register(cmds) {
    var core;
    core = cmds.addCmd(new Command.Command('file'));
    return core.addCmds({
      "read": {
        'result': readCommand,
        'allowedNamed': ['file'],
        'help': "read the content of a file"
      },
      "write": {
        'result': writeCommand,
        'allowedNamed': ['file', 'content'],
        'help': "save into a file"
      },
      "delete": {
        'result': deleteCommand,
        'allowedNamed': ['file'],
        'help': "delete a file"
      }
    });
  }

};
exports.FileCommandProvider = FileCommandProvider;

readCommand = function (instance) {
  var file, fileSystem;
  fileSystem = instance.codewave.getFileSystem();
  file = instance.getParam([0, 'file']);

  if (fileSystem) {
    return fileSystem.readFile(file);
  }
};

writeCommand = function (instance) {
  var content, file, fileSystem;
  fileSystem = instance.codewave.getFileSystem();
  file = instance.getParam([0, 'file']);
  content = instance.content || instance.getParam([1, 'content']);

  if (fileSystem) {
    return fileSystem.writeFile(file, content);
  }
};

deleteCommand = function (instance) {
  var file, fileSystem;
  fileSystem = instance.codewave.getFileSystem();
  file = instance.getParam([0, 'file']);

  if (fileSystem) {
    return fileSystem.deleteFile(file);
  }
};

