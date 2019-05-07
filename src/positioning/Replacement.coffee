import { Pos } from './Pos';
import { CommonHelper } from '../helpers/CommonHelper';
import { OptionObject } from '../OptionObject';
import { StringHelper } from '../helpers/StringHelper';

export class Replacement extends Pos
  CommonHelper.applyMixins(this.prototype,[OptionObject])
  constructor: (@start, @end, @text, @options = {}) ->
    super()
    @setOpts(@options,{
      prefix: ''
      suffix: ''
      selections: []
    })
  resPosBeforePrefix: ->
    return @start+@prefix.length+@text.length
  resEnd: -> 
    return @start+@finalText().length
  apply: ->
    @editor().spliceText(@start, @end, @finalText())
  necessary: ->
    return @finalText() != @originalText()
  originalText: ->
    return @editor().textSubstr(@start, @end)
  finalText: ->
    return @prefix+@text+@suffix
  offsetAfter: () -> 
    return @finalText().length - (@end - @start)
  applyOffset: (offset)->
    if offset != 0
      @start += offset
      @end += offset
      for sel in @selections
        sel.start += offset
        sel.end += offset
    return this
  selectContent: -> 
    @selections = [new Pos(@prefix.length+@start, @prefix.length+@start+@text.length)]
    return this
  carretToSel: ->
    @selections = []
    text = @finalText()
    @prefix = StringHelper.removeCarret(@prefix)
    @text = StringHelper.removeCarret(@text)
    @suffix = StringHelper.removeCarret(@suffix)
    start = @start
    
    while (res = StringHelper.getAndRemoveFirstCarret(text))?
      [pos,text] = res
      @selections.push(new Pos(start+pos, start+pos))
      
    return this
  copy: -> 
    res = new Replacement(@start, @end, @text, @getOpts())
    if @hasEditor()
      res.withEditor(@editor())
    res.selections = @selections.map( (s)->s.copy() )
    return res