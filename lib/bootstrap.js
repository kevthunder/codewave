import {
  Codewave
} from './Codewave';

import {
  Command
} from './Command';

import {
  CoreCommandProvider
} from './cmds/CoreCommandProvider';

import {
  JsCommandProvider
} from './cmds/JsCommandProvider';

import {
  PhpCommandProvider
} from './cmds/PhpCommandProvider';

import {
  Pos
} from './positioning/Pos';

import {
  WrappedPos
} from './positioning/WrappedPos';

Pos.wrapClass = WrappedPos;

Codewave.instances = [];

Command.providers = [new CoreCommandProvider(), new JsCommandProvider(), new PhpCommandProvider()];

export {
  Codewave
};

//# sourceMappingURL=maps/bootstrap.js.map
