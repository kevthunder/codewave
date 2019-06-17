import { Context } from './Context';
import { StringContext } from './StringContext';
import { VariableContext } from './VariableContext';

export class ParamContext extends Context
  onChar: (char)->
    if @testContext(StringContext)
    else if @testContext(ParamContext.named)
    else if @testContext(VariableContext)
    else if char == ' '
      @parser.setContext(new ParamContext(@parser))
    else
      @content += char

  onEnd: ->
    @parser.params.push(@content)