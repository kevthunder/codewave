
import { Pos } from '../../lib/positioning/Pos';
import { TextParser } from '../../lib/TextParser';

export class TestMonoEditor extends TextParser
  constructor: (target) ->
    super(target)
    @changeListeners = []
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