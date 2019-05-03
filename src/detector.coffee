# [pawa python]
#   replace /data.(\w+)/ data['$1']
#   replace codewave.editor.text() codewave.editor.text

class @Codewave.Detector
  constructor: (@data={}) ->
  detect: (finder) ->
    if @detected(finder)
      return @data.result if @data.result?
    else
      return @data.else if @data.else?
  detected: (finder) ->
    #

class @Codewave.LangDetector extends Codewave.Detector
  detect: (finder) ->
    if finder.codewave? 
      lang = finder.codewave.editor.getLang()
      if lang? 
        return lang.toLowerCase()
        
class @Codewave.PairDetector extends Codewave.Detector
  detected: (finder) ->
    if @data.opener? and @data.closer? and finder.instance?
      pair = new Codewave.util.Pair(@data.opener, @data.closer, @data)
      if pair.isWapperOf(finder.instance.getPos(), finder.codewave.editor.text())
        return true
    return false
      