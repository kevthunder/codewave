import { Detector } from './Detector';

export class AlwaysEnabled extends Detector
  constructor: (@namespace) ->
    super()
  detect: (finder) ->
    return @namespace