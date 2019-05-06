export class PairMatch
  constructor: (@pair,@match,@offset = 0) ->
  name: ->
    if @match
      unless _name?
        for group, i in @match
          if i > 0 and group?
            _name = @pair.matchAnyPartKeys()[i-1]
            return _name
        _name = false
      return _name || null
  start: ->
    @match.index + @offset
  end: ->
    @match.index + @match[0].length + @offset
  valid: ->
    return !@pair.validMatch || @pair.validMatch(this)
  length: ->
    @match[0].length