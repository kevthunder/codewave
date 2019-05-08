import {
  Codewave
} from './bootstrap';

import {
  TextAreaEditor
} from './TextAreaEditor';

Codewave.detect = function(target) {
  var cw;
  cw = new Codewave(new TextAreaEditor(target));
  Codewave.instances.push(cw);
  return cw;
};

Codewave.require = require;

window.Codewave = Codewave;

//# sourceMappingURL=maps/entry.js.map
