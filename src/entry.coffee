import { Codewave } from './Codewave';
import { TextAreaEditor } from './TextAreaEditor';

Codewave.instances = []
Codewave.detect = (target) ->
  cw = new Codewave(new TextAreaEditor(target))
  Codewave.instances.push(cw)
  cw

window.Codewave = Codewave
  