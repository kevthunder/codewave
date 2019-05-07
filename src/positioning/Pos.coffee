export class Pos
  constructor: (@start,@end) ->
    @end = @start unless @end?
  containsPt: (pt) ->
    return @start <= pt and pt <= @end
  containsPos: (pos) ->
    return @start <= pos.start and pos.end <= @end
  wrappedBy: (prefix,suffix) ->
    WrappedPos = require('./WrappedPos');
    return new WrappedPos(@start-prefix.length,@start,@end,@end+suffix.length)
  withEditor: (val)->
    @_editor = val
    return this
  editor: ->
    unless @_editor?
      throw new Error('No editor set')
    return @_editor
  hasEditor: ->
    return @_editor?
  text: ->
    @editor().textSubstr(@start, @end)
  applyOffset: (offset)->
    if offset != 0
      @start += offset
      @end += offset
    return this
  prevEOL: ->
    unless @_prevEOL?
      @_prevEOL = @editor().findLineStart(@start)
    return @_prevEOL
  nextEOL: ->
    unless @_nextEOL?
      @_nextEOL = @editor().findLineEnd(@end)
    return @_nextEOL
  textWithFullLines: ->
    unless @_textWithFullLines?
      @_textWithFullLines = @editor().textSubstr(@prevEOL(),@nextEOL())
    return @_textWithFullLines
  sameLinesPrefix: ->
    unless @_sameLinesPrefix?
      @_sameLinesPrefix = @editor().textSubstr(@prevEOL(),@start)
    return @_sameLinesPrefix
  sameLinesSuffix: ->
    unless @_sameLinesSuffix?
      @_sameLinesSuffix = @editor().textSubstr(@end,@nextEOL())
    return @_sameLinesSuffix
  copy: ->
    res = new Pos(@start,@end)
    if @hasEditor()
      res.withEditor(@editor())
    return res
  raw: ->
    [@start,@end]