import { ParamContext } from './ParamContext';

export class NamedContext extends ParamContext
  onStart: ()->
    @name = @parent.content

  onEnd: ->
    @parser.named[@name] = @content

  @test: (char,parent)->
    char == ':' and (!parent.parser.options.allowedNamed? or parent.content in parent.parser.options.allowedNamed)
