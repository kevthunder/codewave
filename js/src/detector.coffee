class @Codewave.Detector
  constructor: (@data={}) ->
    #
  detect: (finder) ->
    #
    
class @Codewave.LangDetector extends Codewave.Detector
  detect: (finder) ->
    if finder.codewave? 
      lang = finder.codewave.editor.getLang()
      if lang? 
        return lang.lower()