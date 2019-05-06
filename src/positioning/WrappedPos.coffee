import { Pos } from './Pos';

export class WrappedPos extends Pos
  constructor: (@start,@innerStart,@innerEnd,@end) ->
    super()
  innerContainsPt: (pt) ->
    return @innerStart <= pt and pt <= @innerEnd
  innerContainsPos: (pos) ->
    return @innerStart <= pos.start and pos.end <= @innerEnd
  innerText: ->
    @editor().textSubstr(@innerStart, @innerEnd)
  setInnerLen: (len) ->
    @moveSufix(@innerStart + len)
  moveSuffix: (pt) ->
    suffixLen = @end - @innerEnd
    @innerEnd = pt
    @end = @innerEnd + suffixLen
  copy: ->
    return new WrappedPos(@start,@innerStart,@innerEnd,@end)