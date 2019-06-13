import { Context } from './Context';
import { Codewave } from './Codewave';
import { TextParser } from './TextParser';
import { StringHelper } from './helpers/StringHelper';
import { optionalPromise } from './helpers/OptionalPromise';

export class CmdInstance
  constructor: (@cmd,@context) ->
  
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
      @context = new Context()
    return @context or new Context()
  getFinder: (cmdName)->
    finder = @getContext().getFinder(cmdName,namespaces:@_getParentNamespaces())
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
    @named = @getDefaults()
  _getParentNamespaces: ->
    return []
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
        res = Object.assign(res,aliased.getDefaults())
      res = Object.assign(res,@cmd.defaults)
      if @cmdObj?
        res = Object.assign(res,@cmdObj.getDefaults())
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
          aliased = aliased._aliasedFromFinder(@getFinder(@alterAliasOf(aliased.aliasOf)))
          unless @aliasedCmd?
            @aliasedCmd = aliased or false
        @aliasedFinalCmd = aliased or false
        return aliased
  alterAliasOf: (aliasOf)->
    aliasOf
  getOptions: ->
    if @cmd?
      if @cmdOptions?
        return @cmdOptions
      opt = @cmd._optionsForAliased(@getAliased())
      if @cmdObj?
        opt = Object.assign(opt,@cmdObj.getOptions())
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
  getBoolParam: (names, defVal = null) ->
    falseVals = ["","0","false","no","none",false,null,0]
    val = @getParam(names, defVal)
    !falseVals.includes(val)
  ancestorCmds: ->
    if @context.codewave?.inInstance?
      return @context.codewave.inInstance.ancestorCmdsAndSelf()
    return []
  ancestorCmdsAndSelf: ->
    return @ancestorCmds().concat([@cmd])
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
      optionalPromise(@rawResult()).then (res)=>
        if res?
          res = @formatIndent(res)
          if res.length > 0 and @getOption('parse',this) 
            parser = @getParserForText(res)
            res = parser.parseAll()
          if alterFunct = @getOption('alterResult',this)
            res = alterFunct(res,this)
          return res
      .result()
  getParserForText: (txt='') ->
    parser = new Codewave(new TextParser(txt), {inInstance:this})
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
    return StringHelper.indentNotFirst(text,@getIndent()," ")