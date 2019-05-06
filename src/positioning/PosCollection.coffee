import { Wrapping } from './Wrapping';
import { Replacement } from './Replacement';

export class PosCollection
  constructor: (arr) ->
    if !Array.isArray(arr)
      arr = [arr]
    Object.assign(arr, PosCollection.prototype)
    return arr
    
  wrap: (prefix,suffix)->
      return @map( (p) -> new Wrapping(p.start, p.end, prefix, suffix))
  replace: (txt)->
      return @map( (p) -> new Replacement(p.start, p.end, txt))