import { Context } from './Context';
import { EscapeContext } from './EscapeContext';
import { VariableContext } from './VariableContext';

export class StringContext extends Context
  onChar: (char)->
    if @testContext(EscapeContext)
    else if @testContext(VariableContext)
    else if StringContext.isDelimiter(char)
      @end()
    else
      @content += char

  onEnd: ->
    @parent.content += @content

  @test: (char)->
    @isDelimiter(char)

  @isDelimiter:  (char)->
    char in ['"',"'"]