import {
  Codewave
} from './Codewave';

import {
  TextAreaEditor
} from './TextAreaEditor';

Codewave.instances = [];

Codewave.detect = function(target) {
  var cw;
  cw = new Codewave(new TextAreaEditor(target));
  Codewave.instances.push(cw);
  return cw;
};

window.Codewave = Codewave;

//# sourceMappingURL=maps/entry.js.map
