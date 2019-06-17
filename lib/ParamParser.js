"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParamParser = void 0;
var indexOf = [].indexOf;
var ParamParser = class ParamParser {
  constructor(paramString, options = {}) {
    this.paramString = paramString;
    this.options = options;
    this.parse();
  }

  parse() {
    var allowedNamed, chr, i, inStr, j, name, param, ref;
    this.params = [];
    this.named = {};

    if (this.paramString.length) {
      allowedNamed = this.options.allowedNamed;
      inStr = false;
      param = '';
      name = false;

      for (i = j = 0, ref = this.paramString.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        chr = this.paramString[i];

        if (chr === ' ' && !inStr) {
          if (name) {
            this.named[name] = param;
          } else {
            this.params.push(param);
          }

          param = '';
          name = false;
        } else if ((chr === '"' || chr === "'") && (i === 0 || this.paramString[i - 1] !== '\\')) {
          inStr = !inStr;
        } else if (chr === ':' && !name && !inStr && (allowedNamed == null || indexOf.call(allowedNamed, param) >= 0)) {
          name = param;
          param = '';
        } else {
          param += chr;
        }
      }

      if (param.length) {
        if (name) {
          return this.named[name] = param;
        } else {
          return this.params.push(param);
        }
      }
    }
  }

};
exports.ParamParser = ParamParser;
//# sourceMappingURL=maps/ParamParser.js.map
