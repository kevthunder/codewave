import { Replacement } from './Replacement';

export class Wrapping extends Replacement
  constructor: (@start, @end, prefix ='', suffix = '', @options = {}) ->
    super()
    @setOpts(@options)
    @text = ''
    @prefix = prefix
    @suffix = suffix
  apply: ->
    @adjustSel()
    super()
  adjustSel: ->
    offset = @originalText().length
    for sel in @selections
      if sel.start > @start+@prefix.length
        sel.start += offset
      if sel.end >= @start+@prefix.length
        sel.end += offset
  finalText: ->
    if @hasEditor()
      text = @originalText()
    else
      text = ''
    return @prefix+text+@suffix
  offsetAfter: () -> 
    return @prefix.length+@suffix.length
          
  copy: -> 
    res = new Wrapping(@start, @end, @prefix, @suffix)
    res.selections = @selections.map( (s)->s.copy() )
    return res