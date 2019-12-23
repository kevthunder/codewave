"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Codewave", {
  enumerable: true,
  get: function () {
    return Codewave;
  }
});

const Codewave = require("./Codewave").Codewave;

const Command = require("./Command").Command;

const CoreCommandProvider = require("./cmds/CoreCommandProvider").CoreCommandProvider;

const JsCommandProvider = require("./cmds/JsCommandProvider").JsCommandProvider;

const PhpCommandProvider = require("./cmds/PhpCommandProvider").PhpCommandProvider;

const HtmlCommandProvider = require("./cmds/HtmlCommandProvider").HtmlCommandProvider;

const FileCommandProvider = require("./cmds/FileCommandProvider").FileCommandProvider;

const StringCommandProvider = require("./cmds/StringCommandProvider").StringCommandProvider;

const Pos = require("./positioning/Pos").Pos;

const WrappedPos = require("./positioning/WrappedPos").WrappedPos;

const LocalStorageEngine = require("./storageEngines/LocalStorageEngine").LocalStorageEngine;

const Context = require("./Context").Context;

const CmdInstance = require("./CmdInstance").CmdInstance;

const CmdFinder = require("./CmdFinder").CmdFinder;

Context.cmdInstanceClass = CmdInstance
Context.cmdFinderClass = CmdFinder

Pos.wrapClass = WrappedPos;
Codewave.instances = [];
Command.providers = [new CoreCommandProvider(), new JsCommandProvider(), new PhpCommandProvider(), new HtmlCommandProvider(), new FileCommandProvider(), new StringCommandProvider()];

if (typeof localStorage !== "undefined" && localStorage !== null) {
  Command.storage = new LocalStorageEngine();
}

