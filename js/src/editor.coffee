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
  
  applyReplacements: (replacements) ->
    selections = []
    offset = 0
    for repl in replacements
      repl.applyOffset(offset)
      repl.applyToEditor(this)
      offset += repl.offsetAfter(this)
      
      selections = selections.concat(repl.selections)
    @applyReplacementsSelections(selections)
      
  applyReplacementsSelections: (selections) ->
    if selections.length > 0
      if @allowMultiSelection()
        @setMultiSel(selections)
      else
        @setCursorPos(selections[0].start,selections[0].end)