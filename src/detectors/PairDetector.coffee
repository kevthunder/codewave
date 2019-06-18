import { Pair } from '../positioning/Pair';
import { Detector } from './Detector';

export class PairDetector extends Detector
  detected: (finder) ->
    if @data.opener? and @data.closer? and finder.instance?
      pair = new Pair(@data.opener, @data.closer, @data)
      if pair.isWapperOf(finder.instance.getPos(), finder.codewave.editor.text())
        return true
    return false
      