import { Codewave } from './Codewave';
import { Command } from './Command';
import { CoreCommandProvider } from './cmds/CoreCommandProvider';
import { JsCommandProvider } from './cmds/JsCommandProvider';
import { PhpCommandProvider } from './cmds/PhpCommandProvider';
import { HtmlCommandProvider } from './cmds/HtmlCommandProvider';
import { Pos } from './positioning/Pos';
import { WrappedPos } from './positioning/WrappedPos';
import { LocalStorageEngine } from './storageEngines/LocalStorageEngine';

Pos.wrapClass = WrappedPos

Codewave.instances = []

Command.providers = [
  new CoreCommandProvider()
  new JsCommandProvider()
  new PhpCommandProvider()
  new HtmlCommandProvider()
]

if localStorage?
  Command.storage = new LocalStorageEngine()

export { Codewave }