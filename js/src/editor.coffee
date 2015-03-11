class @Codewave.Editor
  constructor: ->
    @namespace = null
    
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
    return null
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