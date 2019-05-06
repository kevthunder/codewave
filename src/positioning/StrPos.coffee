export class StrPos
  constructor: (@pos,@str) ->
  end: ->
    @pos + @str.length