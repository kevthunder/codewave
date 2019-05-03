class @Codewave.Editor
  constructor: ->
    @namespace = null
    @_lang = null
  bindedTo: (codewave) ->
    #
  text: (val) ->
    throw "Not Implemented"
  textCharAt: (pos) ->
    throw "Not Implemented"
  textLen: ->
    throw "Not Implemented"
  textSubstr: (start, end) ->
    throw "Not Implemented"
  insertTextAt: (text, pos) ->
    throw "Not Implemented"
  spliceText: (start, end, text) ->
    throw "Not Implemented"
  getCursorPos: ->
    throw "Not Implemented"
  setCursorPos: (start, end = null) ->
    throw "Not Implemented"
  beginUndoAction: ->
    #
  endUndoAction: ->
    #
  getLang: ->
    return @_lang
  setLang: (val) ->
    @_lang = val
  getEmmetContextObject: ->
    return null
  allowMultiSelection: ->
    return false
  setMultiSel: (selections) ->
    throw "Not Implemented"
  getMultiSel: ->
    throw "Not Implemented"
  canListenToChange: ->
    return false
  addChangeListener: (callback) ->
    throw "Not Implemented"
  removeChangeListener: (callback) ->
    throw "Not Implemented"
  
  getLineAt: (pos) ->
    return new Codewave.util.Pos(@findLineStart(pos),@findLineEnd(pos))
  findLineStart: (pos) -> 
    p = @findAnyNext(pos ,["\n"], -1)
    return if p then p.pos+1 else 0
  findLineEnd: (pos) -> 
    p = @findAnyNext(pos ,["\n","\r"])
    return if p then p.pos else @textLen()
  
  findAnyNext: (start,strings,direction = 1) -> 
    if direction > 0
      text = @textSubstr(start,@textLen())
    else
      text = @textSubstr(0,start)
    bestPos = null
    for stri in strings
      pos = if direction > 0 then text.indexOf(stri) else text.lastIndexOf(stri)
      if pos != -1
        if !bestPos? or bestPos*direction > pos*direction
          bestPos = pos
          bestStr = stri
    if bestStr?
      return new Codewave.util.StrPos((if direction > 0 then bestPos + start else bestPos),bestStr)
    return null
  
  applyReplacements: (replacements) ->
    selections = []
    offset = 0
    for repl in replacements
      repl.withEditor(this)
      repl.applyOffset(offset)
      repl.apply()
      offset += repl.offsetAfter(this)
      
      selections = selections.concat(repl.selections)
    @applyReplacementsSelections(selections)
      
  applyReplacementsSelections: (selections) ->
    if selections.length > 0
      if @allowMultiSelection()
        @setMultiSel(selections)
      else
        @setCursorPos(selections[0].start,selections[0].end)