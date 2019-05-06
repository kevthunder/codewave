
export class NamespaceHelper

  @splitFirst: (fullname,isSpace = false) ->
    if fullname.indexOf(":") == -1 and !isSpace
      return [null,fullname]
    parts = fullname.split(':')
    return [parts.shift(),parts.join(':') || null]

  @split: (fullname) ->
    if fullname.indexOf(":") == -1
      return [null,fullname]
    parts = fullname.split(':')
    name = parts.pop()
    [parts.join(':'),name]