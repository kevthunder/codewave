# [pawa]
#   replace 'replace(/\t/g' 'replace("\t"'

class @Codewave.CmdInstance
  constructor: (@cmd,@context = None) ->
  
  init: ->
    unless @isEmpty() or @inited
      @inited = true
      @_getCmdObj()
      @_initParams()
      if @cmdObj?
        @cmdObj.init()
    return this
  setParam:(name,val)->
    @named[name] = val
  pushParam:(val)->
    @params.push(val)
  getContext: ->
    unless @context?
      @context = new Codewave.Context()
    return @context or new Codewave.Context()
  getFinder: (cmdName)->
    finder = @getContext().getFinder(cmdName,@_getParentNamespaces())
    finder.instance = this
    return finder
  _getCmdObj: ->
    if @cmd?
      @cmd.init()
      cmd = @getAliased() or @cmd
      cmd.init()
      if cmd.cls?
        @cmdObj = new cmd.cls(this)
        return @cmdObj
  _initParams: ->
    @named = @getDefaults(this)
  _getParentNamespaces: ->
    return array()
  isEmpty: ->
    return @cmd?
  resultIsAvailable: ->
    if @cmd?
      if @cmdObj?
        return @cmdObj.resultIsAvailable()
      aliased = @getAliasedFinal()
      if aliased?
        return aliased.resultIsAvailable()
      return @cmd.resultIsAvailable()
    return false
  getDefaults: ->
    if @cmd?
      res = {}
      aliased = @getAliased()
      if aliased?
        res = Codewave.util.merge(res,aliased.getDefaults())
      res = Codewave.util.merge(res,cmd.defaults)
      if @cmdObj?
        res = Codewave.util.merge(res,@cmdObj.getDefaults())
      return res
  getAliased: ->
    if @cmd?
      unless @aliasedCmd?
        @getAliasedFinal()
      return @aliasedCmd or null
  getAliasedFinal: ->
    if @cmd?
      if @aliasedFinalCmd?
        return @aliasedFinalCmd or null
      if @cmd.aliasOf?
        aliased = @cmd
        while aliased? and aliased.aliasOf?
          [nspc, cmdName] = Codewave.util.splitNamespace(@cmdName)
          aliasOf = aliased.aliasOf.replace('%name%',cmdName)
          aliased = aliased._aliasedFromFinder(@getFinder(aliasOf))
          unless @aliasedCmd?
            @aliasedCmd = aliased or false
        @aliasedFinalCmd = aliased or false
        return aliased
  getOptions: ->
    if @cmd?
      if @cmdOptions?
        return @cmdOptions
      opt = @cmd._optionsForAliased(@getAliased())
      if @cmdObj?
        opt = Codewave.util.merge(opt,@cmdObj.getOptions())
      @cmdOptions = opt
      return opt
  getOption: (key) ->
    options = @getOptions()
    if options? and key of options
      return options[key]
  getParam: (names, defVal = null) ->
    names = [names] if (typeof names in ['string','number'])
    for n in names
      return @named[n] if @named[n]?
      return @params[n] if @params[n]?
    return defVal
  runExecuteFunct: ->
    if @cmd?
      if @cmdObj?
        return @cmdObj.execute()
      cmd = @getAliasedFinal() or @cmd
      cmd.init()
      if cmd.executeFunct?
        return cmd.executeFunct(this)
  rawResult: ->
    if @cmd?
      if @cmdObj?
        return @cmdObj.result()
      cmd = @getAliasedFinal() or @cmd
      cmd.init()
      if cmd.resultFunct?
        return cmd.resultFunct(this)
      if cmd.resultStr?
        return cmd.resultStr
  result: -> 
    @init()
    if @resultIsAvailable()
      if (res = @rawResult())?
        res = @formatIndent(res)
        if res.length > 0 and @getOption('parse',this) 
          parser = @getParserForText(res)
          res = parser.parseAll()
        if alterFunct = @getOption('alterResult',this)
          res = alterFunct(res,this)
        return res
  getParserForText: (txt='') ->
    parser = new Codewave(new Codewave.TextParser(txt), {inInstance:this})
    parser.checkCarret = false
    return parser
  getIndent: ->
    return 0
  formatIndent: (text) ->
    if text?
      return text.replace(/\t/g,'  ')
    else
      return text
  applyIndent: (text) ->
    if text?
      reg = /\n/g  # [pawa python] replace '/\n/g' "re.compile(r'\n',re.M)"
      return text.replace(reg, "\n" + Codewave.util.repeatToLength(" ", @getIndent()))
    else
      return text