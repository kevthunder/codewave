import { ParamContext } from './ParamContext';
import { NamedContext } from './NamedContext';

ParamContext.named = NamedContext

export class ParamParser
  constructor: (@paramString, @options={}) ->
    @parse()

  setContext: (context)->
    oldContext = @context
    @context = context
    if oldContext? and oldContext != context?.parent
      oldContext.onEnd()
    if context?
      context.onStart()
    @context

  parse: ->
    @params = []
    @named = {}
    if @paramString.length
      @setContext(new ParamContext(this))
      @pos = 0
      while @pos < @paramString.length
        @char = @paramString[@pos]
        @context.onChar(@char)
        @pos++
      @setContext(null)

  take:(nb)->
    @paramString.substring(@pos, @pos + nb)

  skip:(nb=1)->
    @pos += nb

      
