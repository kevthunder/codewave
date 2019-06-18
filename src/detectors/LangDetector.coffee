import { Detector } from './Detector';

export class LangDetector extends Detector
  detect: (finder) ->
    if finder.codewave? 
      lang = finder.codewave.editor.getLang()
      if lang? 
        return lang.toLowerCase()