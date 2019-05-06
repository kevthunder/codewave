import {
  Codewave
} from './Codewave';

import {
  TextAreaEditor
} from './TextAreaEditor';

Codewave.instances = [];

Codewave.detect = function(target) {
  var cw;
  cw = new Codewave(new Codewave.TextAreaEditor(target));
  Codewave.instances.push(cw);
  return cw;
};

//# sourceMappingURL=maps/entry.js.map
