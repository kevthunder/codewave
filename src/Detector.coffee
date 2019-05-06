# [pawa python]
#   replace /data.(\w+)/ data['$1']
#   replace codewave.editor.text() codewave.editor.text

import { Pair } from './positioning/Pair';

export class Detector
  constructor: (@data={}) ->
  detect: (finder) ->
    if @detected(finder)
      return @data.result if @data.result?
    else
      return @data.else if @data.else?
  detected: (finder) ->
    #

class LangDetector extends Detector
  detect: (finder) ->
    if finder.codewave? 
      lang = finder.codewave.editor.getLang()
      if lang? 
        return lang.toLowerCase()
        
class PairDetector extends Detector
  detected: (finder) ->
    if @data.opener? and @data.closer? and finder.instance?
      pair = new Pair(@data.opener, @data.closer, @data)
      if pair.isWapperOf(finder.instance.getPos(), finder.codewave.editor.text())
        return true
    return false
      