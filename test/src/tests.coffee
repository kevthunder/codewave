import {Codewave} from '../lib/bootstrap'
import { Command } from '../lib/Command'
import { TestCommandProvider } from './testHelpers/TestCommandProvider'
Command.providers.push(new TestCommandProvider())


import './helpers/stringHelper'
import './helpers/pathHelper'
import './positioning/pair'
import './positioning/wrapping'
import './positioning/replacement'
import './fileSystem/localFiles'
import './storageEngines/fileStorageEngine'
import './box_helper'
import './codewave'
import './cmds/core'
import './cmds/cmd_authoring'
import './cmds/file'
import './cmds/php'