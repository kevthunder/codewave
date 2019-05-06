export class OptionObject
  setOpts: (options,defaults)->
    @defaults = defaults
    for key, val of @defaults
      if key of options
        @setOpt(key,options[key])
      else
        @setOpt(key,val)
        
  setOpt: (key, val)->
    if this[key]?.call?
      this[key](val)
    else
      this[key]= val
        
  getOpt: (key)->
    if this[key]?.call?
      return this[key]()
    else
      return this[key]
  
  getOpts: ->
    opts = {}
    for key, val of @defaults
      opts[key] = @getOpt(key)
    return opts