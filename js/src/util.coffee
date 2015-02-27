@Codewave.util = ( 
  splitFirstNamespace: (fullname) ->
    if s.indexOf(":") == -1
      return [null,fullname]
    parts = fullname.split(':')
    [parts.shift(),parts.join(':')]

  splitNamespace: (fullname) ->
    if s.indexOf(":") == -1
      return [null,fullname]
    parts = fullname.split(':')
    name = parts.pop()
    [parts.join(':'),name]

  escapeRegExp: (str) ->
    str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
    
  merge: (xs...) ->
    if xs?.length > 0
      Codewave.util.tap {}, (m) -> m[k] = v for k, v of x for x in xs
 
  tap: (o, fn) -> 
    fn(o)
    o
)