import { CmdInstance } from './CmdInstance';
import { BoxHelper } from './BoxHelper';
import { Pos } from './positioning/Pos';
import { StrPos } from './positioning/StrPos';
import { Replacement } from './positioning/Replacement';
import { StringHelper } from './helpers/StringHelper';
import { NamespaceHelper } from './helpers/NamespaceHelper';
import { Command } from './Command';

export class PositionedCmdInstance extends CmdInstance
  constructor: (@codewave,@pos,@str) ->
    super()
    unless @isEmpty()
      @_checkCloser()
      @opening = @str
      @noBracket = @_removeBracket(@str)
      @_splitComponents()
      @_findClosing()
      @_checkElongated()
  _checkCloser: ->
    noBracket = @_removeBracket(@str)
    if noBracket.substring(0,@codewave.closeChar.length) == @codewave.closeChar and f = @_findOpeningPos()
      @closingPos = new StrPos(@pos, @str)
      @pos = f.pos
      @str = f.str
  _findOpeningPos: ->
    cmdName = @_removeBracket(@str).substring(@codewave.closeChar.length)
    opening = @codewave.brakets + cmdName
    closing = @str
    if f = @codewave.findMatchingPair(@pos,opening,closing,-1)
      f.str = @codewave.editor.textSubstr(f.pos,@codewave.findNextBraket(f.pos+f.str.length)+@codewave.brakets.length)
      return f
  _splitComponents: ->
    parts = @noBracket.split(" ");
    @cmdName = parts.shift()
    @rawParams = parts.join(" ")
  _parseParams:(params) ->
    @params = []
    @named = @getDefaults()
    if @cmd?
      nameToParam = @getOption('nameToParam')
      if nameToParam? 
        @named[nameToParam] = @cmdName
    if params.length
      if @cmd?
        allowedNamed = @cmd.allowedNamed
      inStr = false
      param = ''
      name = false
      for i in [0..(params.length-1)]
        chr = params[i]
        if chr == ' ' and !inStr
          if(name)
            @named[name] = param
          else
            @params.push(param)
          param = ''
          name = false
        else if chr in ['"',"'"] and (i == 0 or params[i-1] != '\\')
          inStr = !inStr
        else if chr == ':' and !name and !inStr and (!allowedNamed? or name in allowedNamed)
          name = param
          param = ''
        else
          param += chr
      if param.length
        if(name)
          @named[name] = param
        else
          @params.push(param)
  _findClosing: ->
    if f = @_findClosingPos()
      @content = StringHelper.trimEmptyLine(@codewave.editor.textSubstr(@pos+@str.length,f.pos))
      @str = @codewave.editor.textSubstr(@pos,f.pos+f.str.length)
  _findClosingPos: ->
    return @closingPos if @closingPos?
    closing = @codewave.brakets + @codewave.closeChar + @cmdName + @codewave.brakets
    opening = @codewave.brakets + @cmdName
    if f = @codewave.findMatchingPair(@pos+@str.length, opening, closing)
      return @closingPos = f
  _checkElongated: ->
    endPos = @getEndPos()
    max = @codewave.editor.textLen()
    while endPos < max and @codewave.editor.textSubstr(endPos,endPos+@codewave.deco.length) == @codewave.deco
      endPos+=@codewave.deco.length
    if endPos >= max or @codewave.editor.textSubstr(endPos, endPos + @codewave.deco.length) in [' ',"\n","\r"]
      @str = @codewave.editor.textSubstr(@pos,endPos)
  _checkBox: ->
    if @codewave.inInstance? and @codewave.inInstance.cmd.name == 'comment'
      return
    cl = @context.wrapCommentLeft()
    cr = @context.wrapCommentRight()
    endPos = @getEndPos() + cr.length
    if @codewave.editor.textSubstr(@pos - cl.length,@pos) == cl and @codewave.editor.textSubstr(endPos - cr.length,endPos) == cr
      @pos = @pos - cl.length
      @str = @codewave.editor.textSubstr(@pos,endPos)
      @_removeCommentFromContent()
    else if @getPos().sameLinesPrefix().indexOf(cl) > -1 and @getPos().sameLinesSuffix().indexOf(cr) > -1
      @inBox = 1
      @_removeCommentFromContent()
  _removeCommentFromContent: ->
    if @content
      ecl = StringHelper.escapeRegExp(@context.wrapCommentLeft())
      ecr = StringHelper.escapeRegExp(@context.wrapCommentRight())
      ed = StringHelper.escapeRegExp(@codewave.deco)
      re1 = new RegExp("^\\s*#{ecl}(?:#{ed})+\\s*(.*?)\\s*(?:#{ed})+#{ecr}$", "gm")
      re2 = new RegExp("^\\s*(?:#{ed})*#{ecr}\r?\n")
      re3 = new RegExp("\n\\s*#{ecl}(?:#{ed})*\\s*$")
      @content = @content.replace(re1,'$1').replace(re2,'').replace(re3,'')
  _getParentCmds: ->
    @parent = @codewave.getEnclosingCmd(@getEndPos())?.init()
  setMultiPos: (multiPos) ->
    @multiPos = multiPos
  _getCmdObj: ->
    @getCmd()
    @_checkBox()
    @content = @removeIndentFromContent(@content)
    super()
  _initParams: ->
    @_parseParams(@rawParams)
  getContext: ->
    return @context or @codewave.context
  getCmd: ->
    unless @cmd?
      @_getParentCmds()
      if @noBracket.substring(0,@codewave.noExecuteChar.length) == @codewave.noExecuteChar
        @cmd = Command.cmds.getCmd('core:no_execute')
        @context = @codewave.context
      else
        @finder = @getFinder(@cmdName)
        @context = @finder.context
        @cmd = @finder.find()
        if @cmd?
          @context.addNameSpace(@cmd.fullName)
    return @cmd
  getFinder: (cmdName)->
    finder = @codewave.context.getFinder(cmdName,@_getParentNamespaces())
    finder.instance = this
    return finder
  _getParentNamespaces: ->
    nspcs = []
    obj = this
    while obj.parent?
      obj = obj.parent
      nspcs.push(obj.cmd.fullName) if obj.cmd? and obj.cmd.fullName?
    return nspcs
  _removeBracket: (str)->
    return str.substring(@codewave.brakets.length,str.length-@codewave.brakets.length)
  alterAliasOf: (aliasOf)->
    [nspc, cmdName] = NamespaceHelper.split(@cmdName)
    return aliasOf.replace('%name%',cmdName)
  isEmpty: ->
    return @str == @codewave.brakets + @codewave.closeChar + @codewave.brakets or @str == @codewave.brakets + @codewave.brakets
  execute: ->
    if @isEmpty()
      if @codewave.closingPromp? and @codewave.closingPromp.whithinOpenBounds(@pos + @codewave.brakets.length)?
        @codewave.closingPromp.cancel()
      else
        @replaceWith('')
    else if @cmd?
      if beforeFunct = @getOption('beforeExecute')
        beforeFunct(this)
      if @resultIsAvailable()
        if (res = @result())?
          @replaceWith(res)
      else
          return @runExecuteFunct()
  getEndPos: ->
    return @pos+@str.length
  getPos: ->
    return new Pos(@pos,@pos+@str.length).withEditor(@codewave.editor)
  getOpeningPos: ->
    return new Pos(@pos,@pos+@opening.length).withEditor(@codewave.editor)
  getIndent: ->
    unless @indentLen?
      if @inBox?
        helper = new BoxHelper(@context)
        @indentLen = helper.removeComment(@getPos().sameLinesPrefix()).length
      else
        @indentLen = @pos - @getPos().prevEOL()
    return @indentLen
  removeIndentFromContent: (text) ->
    if text?
      reg = new RegExp('^\\s{'+@getIndent()+'}','gm')
      return text.replace(reg,'')
    else
      return text
  alterResultForBox: (repl) ->
    original = repl.copy()
    helper = new BoxHelper(@context)
    helper.getOptFromLine(original.textWithFullLines(),false)
    if @getOption('replaceBox')
      box = helper.getBoxForPos(original)
      [repl.start, repl.end] = [box.start, box.end]
      @indentLen = helper.indent
      repl.text = @applyIndent(repl.text)
    else
      repl.text = @applyIndent(repl.text)
      repl.start = original.prevEOL()
      repl.end = original.nextEOL()
      res = helper.reformatLines(original.sameLinesPrefix() + @codewave.marker + repl.text + @codewave.marker + original.sameLinesSuffix(), {multiline:false})
      [repl.prefix,repl.text,repl.suffix] = res.split(@codewave.marker)
    return repl
  getCursorFromResult: (repl) ->
    cursorPos = repl.resPosBeforePrefix()
    if @cmd? and @codewave.checkCarret and @getOption('checkCarret')
      if (p = @codewave.getCarretPos(repl.text))? 
        cursorPos = repl.start+repl.prefix.length+p
      repl.text = @codewave.removeCarret(repl.text)
    return cursorPos
  checkMulti: (repl) ->
    if @multiPos? and @multiPos.length > 1
      replacements = [repl]
      originalText = repl.originalText()
      for pos, i in @multiPos
        if i == 0
          originalPos = pos.start
        else
          newRepl = repl.copy().applyOffset(pos.start-originalPos)
          if newRepl.originalText() == originalText
            replacements.push(newRepl)
      return replacements
    else
      return [repl]
  replaceWith: (text) ->
    @applyReplacement(new Replacement(@pos,@getEndPos(),text))
  applyReplacement: (repl) ->
    repl.withEditor(@codewave.editor)
    if @inBox?
      @alterResultForBox(repl)
    else
      repl.text = @applyIndent(repl.text)
    cursorPos = @getCursorFromResult(repl)
    repl.selections = [new Pos(cursorPos, cursorPos)]
    replacements = @checkMulti(repl)
    @replaceStart = repl.start
    @replaceEnd = repl.resEnd()
    @codewave.editor.applyReplacements(replacements)
    