
import { Pos } from './Pos';
import { StringHelper } from '../helpers/StringHelper';
import { PairMatch } from './PairMatch';

export class Pair
  constructor: (@opener,@closer,@options = {}) ->
    defaults = {
      optionnal_end: false
      validMatch: null
    }
    for key, val of defaults
      if key of @options
        this[key] = @options[key]
      else
        this[key] = val
  openerReg: ->
    if typeof @opener == 'string' 
      return new RegExp(StringHelper.escapeRegExp(@opener))
    else
      return @opener
  closerReg: ->
    if typeof @closer == 'string' 
      return new RegExp(StringHelper.escapeRegExp(@closer))
    else
      return @closer
  matchAnyParts: ->
    return {
      opener: @openerReg()
      closer: @closerReg()
    }
  matchAnyPartKeys: ->
    keys = []
    for key, reg of @matchAnyParts()
      keys.push(key)
    return keys
  matchAnyReg: ->
    groups = []
    for key, reg of @matchAnyParts()
      groups.push('('+reg.source+')')
    return new RegExp(groups.join('|'))
  matchAny: (text,offset=0) ->
    while (match = @_matchAny(text,offset))? and !match.valid()
      offset = match.end()
    return match if match? and match.valid()
  _matchAny: (text,offset=0) ->
    if offset
      text = text.substr(offset)
    match = @matchAnyReg().exec(text)
    if match?
      return new PairMatch(this,match,offset)
  matchAnyNamed: (text) ->
    return @_matchAnyGetName(@matchAny(text))
  matchAnyLast: (text,offset=0) ->
    while match = @matchAny(text,offset)
      offset = match.end()
      if !res or res.end() != match.end()
        res = match
    return res
  identical: ->
    @opener == @closer or (
      @opener.source? and 
      @closer.source? and 
      @opener.source == @closer.source
    )
  wrapperPos: (pos,text) ->
    start = @matchAnyLast(text.substr(0,pos.start))
    if start? and (@identical() or start.name() == 'opener')
      end = @matchAny(text,pos.end)
      if end? and (@identical() or end.name() == 'closer')
        return new Pos(start.start(),end.end())
      else if @optionnal_end
        return new Pos(start.start(),text.length)
  isWapperOf: (pos,text) ->
    return @wrapperPos(pos,text)?