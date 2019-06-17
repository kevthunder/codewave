
export class ParamParser
  constructor: (@paramString, @options={}) ->
    @parse()

  parse: ->
    @params = []
    @named = {}
    if @paramString.length
      allowedNamed = @options.allowedNamed
      inStr = false
      param = ''
      name = false
      for i in [0..(@paramString.length-1)]
        chr = @paramString[i]
        if chr == ' ' and !inStr
          if(name)
            @named[name] = param
          else
            @params.push(param)
          param = ''
          name = false
        else if chr in ['"',"'"] and (i == 0 or @paramString[i-1] != '\\')
          inStr = !inStr
        else if chr == ':' and !name and !inStr and (!allowedNamed? or param in allowedNamed)
          name = param
          param = ''
        else
          param += chr
      if param.length
        if(name)
          @named[name] = param
        else
          @params.push(param)
