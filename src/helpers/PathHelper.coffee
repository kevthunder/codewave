export class PathHelper
  @getPath: (obj,path,sep='.') ->
    parts = path.split(sep)
    cur = obj
    parts.find (part) =>
      cur = cur[part]
      typeof cur == "undefined"
    cur
    
  
  @setPath: (obj,path,val,sep='.') ->
    parts = path.split(sep)
    last = parts.pop()
    parts.reduce((cur,part) =>
      if cur[part]?
        cur[part]
      else
        cur[part] = {}
    , obj)[last] = val
    