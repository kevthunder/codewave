"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileCommandProvider = void 0;

var _Command = require("../Command");

var _Detector = require("../Detector");

var _BoxHelper = require("../BoxHelper");

var _EditCmdProp = require("../EditCmdProp");

var _StringHelper = require("../helpers/StringHelper");

var _PathHelper = require("../helpers/PathHelper");

var _Replacement = require("../positioning/Replacement");

var deleteCommand, readCommand, writeCommand;
var FileCommandProvider = class FileCommandProvider {
  register(cmds) {
    var core;
    core = cmds.addCmd(new _Command.Command('file'));
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
//# sourceMappingURL=../maps/cmds/FileCommandProvider.js.map
