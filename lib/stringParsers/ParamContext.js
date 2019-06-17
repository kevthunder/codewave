"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParamContext = void 0;

var _Context = require("./Context");

var _StringContext = require("./StringContext");

var _VariableContext = require("./VariableContext");

var ParamContext = class ParamContext extends _Context.Context {
  onChar(char) {
    if (this.testContext(_StringContext.StringContext)) {} else if (this.testContext(ParamContext.named)) {} else if (this.testContext(_VariableContext.VariableContext)) {} else if (char === ' ') {
      return this.parser.setContext(new ParamContext(this.parser));
    } else {
      return this.content += char;
    }
  }

  onEnd() {
    return this.parser.params.push(this.content);
  }

};
exports.ParamContext = ParamContext;
//# sourceMappingURL=../maps/stringParsers/ParamContext.js.map
