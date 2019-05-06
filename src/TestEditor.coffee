
import { Pos } from './positioning/Pos';
import { TextAreaEditor } from './TextAreaEditor';

export class TestEditor extends TextAreaEditor
  constructor: (target) ->
    super(target)
    @selections = []
  allowMultiSelection: ->
    return true
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