import {Codewave} from '../lib/bootstrap'
import { Command } from '../lib/Command'
import { TestCommandProvider } from './testHelpers/TestCommandProvider'
Command.providers.push(new TestCommandProvider())


import './codewave'