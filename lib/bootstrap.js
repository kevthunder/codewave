"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Codewave", {
  enumerable: true,
  get: function () {
    return Codewave.Codewave;
  }
});

const Codewave = require("./Codewave");

const Command = require("./Command");

const CoreCommandProvider = require("./cmds/CoreCommandProvider");

const JsCommandProvider = require("./cmds/JsCommandProvider");

const PhpCommandProvider = require("./cmds/PhpCommandProvider");

const HtmlCommandProvider = require("./cmds/HtmlCommandProvider");

const FileCommandProvider = require("./cmds/FileCommandProvider");

const StringCommandProvider = require("./cmds/StringCommandProvider");

const Pos = require("./positioning/Pos");

const WrappedPos = require("./positioning/WrappedPos");

const LocalStorageEngine = require("./storageEngines/LocalStorageEngine");

Pos.Pos.wrapClass = WrappedPos.WrappedPos;
Codewave.Codewave.instances = [];
Command.Command.providers = [new CoreCommandProvider.CoreCommandProvider(), new JsCommandProvider.JsCommandProvider(), new PhpCommandProvider.PhpCommandProvider(), new HtmlCommandProvider.HtmlCommandProvider(), new FileCommandProvider.FileCommandProvider(), new StringCommandProvider.StringCommandProvider()];

if (typeof localStorage !== "undefined" && localStorage !== null) {
  Command.Command.storage = new LocalStorageEngine.LocalStorageEngine();
}

