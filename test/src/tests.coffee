import {Codewave} from '../lib/bootstrap'
import { Command } from '../lib/Command'
import { TestCommandProvider } from './testHelpers/TestCommandProvider'
Command.providers.push(new TestCommandProvider())


import './stringHelper'
import './pair'
import './wrapping'
import './replacement'
import './box_helper'
import './codewave'
import './cmd_authoring'