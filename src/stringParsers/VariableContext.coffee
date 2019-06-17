import { Context } from './Context';

export class VariableContext extends Context
  onStart: ()->
    @parser.skip()

  onChar: (char)->
    if char == '}'
      @end()
    else
      @content += char

  onEnd: ->
    @parent.content += @parser.options.vars?[@content] or ''

  @test: (char,parent)->
    parent.parser.take(2) == '#{'