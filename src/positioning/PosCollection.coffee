import { Wrapping } from './Wrapping';
import { Replacement } from './Replacement';
import { CommonHelper } from '../helpers/CommonHelper';

export class PosCollection
  constructor: (arr) ->
    if !Array.isArray(arr)
      arr = [arr]
    CommonHelper.applyMixins(arr,[PosCollection])
    return arr
    
  wrap: (prefix,suffix)->
      return @map( (p) -> new Wrapping(p.start, p.end, prefix, suffix))
  replace: (txt)->
      return @map( (p) -> new Replacement(p.start, p.end, txt))