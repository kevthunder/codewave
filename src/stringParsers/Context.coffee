
export class Context
  constructor: (@parser, @parent) ->
    @content = ""

  onStart: ->
    @startAt = @parser.pos

  onChar: (char)->

  end: ->
    @parser.setContext(@parent)

  onEnd: ->

  testContext: (contextType)->
    if contextType.test(@parser.char, this)
      @parser.setContext(new contextType(@parser,this))

  @test: -> false
