
import { Pos } from '../../lib/positioning/Pos';
import { TextParser } from '../../lib/TextParser';

export class TestMultiEditor extends TextParser
  constructor: (target) ->
    super(target)
    @selections = []
    @changeListeners = []
  allowMultiSelection: ->
    return true
  getCursorPos: ->
    res = super()
    if res?
      res
    else
      new Pos(0, 0)
  setCursorPos: (start, end) ->
    end = start if arguments.length < 2
    old = @getCursorPos()
    if start != old.start or end != old.end
      super(start, end)
      @selections = [new Pos(start, end)]
  setMultiSel: (selections) ->
    if selections.length > 0
      @setCursorPos(selections[0].start, selections[0].end)
    @selections = selections.map (s)-> s.copy()
  textEventChange: ->
    return false
  getMultiSel: ->
    selections = @selections
    selections[0] = @getCursorPos()
    selections
  addSel: (start, end) ->
    @selections.push(new Pos(start, end))
  resetSel: (start, end) ->
    @selections = [@getCursorPos()]
  canListenToChange: ->
    return true
  addChangeListener: (callback) ->
    @changeListeners.push(callback)
  removeChangeListener: (callback) ->
    if (i = @changeListeners.indexOf(callback)) > -1
      @changeListeners.splice(i, 1)
  onAnyChange: (e) ->
    for callback in @changeListeners
      callback()