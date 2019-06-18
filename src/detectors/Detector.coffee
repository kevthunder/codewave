export class Detector
  constructor: (@data={}) ->
  detect: (finder) ->
    if @detected(finder)
      return @data.result if @data.result?
    else
      return @data.else if @data.else?
  detected: (finder) ->
    #
