import { Codewave } from './bootstrap';
import { TextAreaEditor } from './TextAreaEditor';

Codewave.detect = (target) ->
  cw = new Codewave(new TextAreaEditor(target))
  Codewave.instances.push(cw)
  cw

Codewave.require = require

window.Codewave = Codewave
  