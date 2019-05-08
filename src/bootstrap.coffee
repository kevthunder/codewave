import { Codewave } from './Codewave';
import { Command } from './Command';
import { CoreCommandProvider } from './cmds/CoreCommandProvider';
import { Pos } from './positioning/Pos';
import { WrappedPos } from './positioning/WrappedPos';

Pos.wrapClass = WrappedPos

Codewave.instances = []

Command.providers = [
  new CoreCommandProvider()
]

export { Codewave }