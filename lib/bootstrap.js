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

const CoreCommandProvider = require("./cmds/CoreCommandProvider").CoreCommandProvider;

const JsCommandProvider = require("./cmds/JsCommandProvider").JsCommandProvider;

const PhpCommandProvider = require("./cmds/PhpCommandProvider").PhpCommandProvider;

const HtmlCommandProvider = require("./cmds/HtmlCommandProvider").HtmlCommandProvider;

const FileCommandProvider = require("./cmds/FileCommandProvider").FileCommandProvider;

const StringCommandProvider = require("./cmds/StringCommandProvider").StringCommandProvider;

const Pos = require("./positioning/Pos").Pos;

const WrappedPos = require("./positioning/WrappedPos").WrappedPos;

const LocalStorageEngine = require("./storageEngines/LocalStorageEngine").LocalStorageEngine;

Pos.wrapClass = WrappedPos;
Codewave.Codewave.instances = [];
Command.Command.providers = [new CoreCommandProvider(), new JsCommandProvider(), new PhpCommandProvider(), new HtmlCommandProvider(), new FileCommandProvider(), new StringCommandProvider()];

if (typeof localStorage !== "undefined" && localStorage !== null) {
  Command.Command.storage = new LocalStorageEngine();
}

