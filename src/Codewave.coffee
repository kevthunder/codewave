import { Process } from './Process';
import { Context } from './Context';
import { PositionedCmdInstance } from './PositionedCmdInstance';
import { TextParser } from './TextParser';
import { Command } from './Command';
import { Logger } from './Logger';
import { PosCollection } from './positioning/PosCollection';
import { StringHelper } from './helpers/StringHelper';
import { ClosingPromp } from './ClosingPromp';

export class Codewave
  constructor: (@editor, options = {}) ->
    Codewave.init()
    @marker = '[[[[codewave_marquer]]]]'
    @vars = {}
    
    defaults = {
      'brakets' : '~~',
      'deco' : '~',
      'closeChar' : '/',
      'noExecuteChar' : '!',
      'carretChar' : '|',
      'checkCarret' : true,
      'inInstance' : null
    }
    @parent = options['parent']
    
    @nested = if @parent? then @parent.nested+1 else 0
    
    for key, val of defaults
      if key of options
        this[key] = options[key]
      else if @parent? and key != 'parent'
        this[key] = @parent[key]
      else
        this[key] = val
    @editor.bindedTo(this) if @editor?
    
    @context = new Context(this)
    if @inInstance?
      @context.parent = @inInstance.context

    @logger = new Logger()

  onActivationKey: ->
    @process = new Process()
    @logger.log('activation key')
    @runAtCursorPos().then =>
      @process = null
  runAtCursorPos: ->
    if @editor.allowMultiSelection()
      @runAtMultiPos(@editor.getMultiSel())
    else
      @runAtPos(@editor.getCursorPos())
  runAtPos: (pos)->
    @runAtMultiPos([pos])
  runAtMultiPos: (multiPos)->
    Promise.resolve().then =>
      if multiPos.length > 0
        cmd = @commandOnPos(multiPos[0].end)
        if cmd?
          if multiPos.length > 1
            cmd.setMultiPos(multiPos)
          cmd.init()
          @logger.log(cmd)
          cmd.execute()
        else
          if multiPos[0].start == multiPos[0].end
            @addBrakets(multiPos)
          else
            @promptClosingCmd(multiPos)
  commandOnPos: (pos) ->
    if @precededByBrakets(pos) and @followedByBrakets(pos) and @countPrevBraket(pos) % 2 == 1 
      prev = pos-@brakets.length
      next = pos
    else
      if @precededByBrakets(pos) and @countPrevBraket(pos) % 2 == 0
        pos -= @brakets.length
      prev = @findPrevBraket(pos)
      unless prev?
        return null 
      next = @findNextBraket(pos-1)
      if !next? or @countPrevBraket(prev) % 2 != 0 
        return null
    return new PositionedCmdInstance(this,prev,@editor.textSubstr(prev,next+@brakets.length))
  nextCmd: (start = 0) ->
    pos = start
    while f = @findAnyNext(pos ,[@brakets,"\n"])
      pos = f.pos + f.str.length
      if f.str == @brakets
        if beginning?
          return new PositionedCmdInstance(this, beginning, @editor.textSubstr(beginning, f.pos+@brakets.length))
        else
          beginning = f.pos
      else
        beginning = null
    null
  getEnclosingCmd: (pos = 0) ->
    cpos = pos
    closingPrefix = @brakets + @closeChar
    while (p = @findNext(cpos,closingPrefix))?
      if cmd = @commandOnPos(p+closingPrefix.length)
        cpos = cmd.getEndPos()
        if cmd.pos < pos
          return cmd
      else
        cpos = p+closingPrefix.length
    null
  precededByBrakets: (pos) ->
    return @editor.textSubstr(pos-@brakets.length,pos) == @brakets
  followedByBrakets: (pos) ->
    return @editor.textSubstr(pos,pos+@brakets.length) == @brakets
  countPrevBraket: (start) -> 
    i = 0
    while (start = @findPrevBraket(start))?
      i++
    return i
  isEndLine: (pos) -> 
    return @editor.textSubstr(pos,pos+1) == "\n" or pos + 1 >= @editor.textLen()
  findPrevBraket: (start) -> 
    return @findNextBraket(start,-1)
  findNextBraket: (start,direction = 1) -> 
    f = @findAnyNext(start ,[@brakets,"\n"], direction)
    
    f.pos if f and f.str == @brakets
  findPrev: (start,string) -> 
    return @findNext(start,string,-1)
  findNext: (start,string,direction = 1) -> 
    f = @findAnyNext(start ,[string], direction)
    f.pos if f
  
  findAnyNext: (start,strings,direction = 1) -> 
    return @editor.findAnyNext(start,strings,direction)
    
  findMatchingPair: (startPos,opening,closing,direction = 1) ->
    pos = startPos
    nested = 0
    while f = @findAnyNext(pos,[closing,opening],direction)
      pos = f.pos + (if direction > 0 then f.str.length else 0)
      if f.str == (if direction > 0 then closing else opening)
        if nested > 0
          nested--
        else
          return f
      else
        nested++
    null
  addBrakets: (pos) ->
    pos = new PosCollection(pos)
    replacements = pos.wrap(@brakets,@brakets).map( (r)->r.selectContent() )
    @editor.applyReplacements(replacements)
  promptClosingCmd: (selections) ->
    @closingPromp.stop() if @closingPromp?
    @closingPromp = ClosingPromp.newFor(this,selections).begin() # [pawa python] replace /\(new (.*)\).begin/ $1.begin reparse
  parseAll: (recursive = true) ->
    if @nested > 100
      throw "Infinite parsing Recursion"
    pos = 0
    while cmd = @nextCmd(pos)
      pos = cmd.getEndPos()
      @editor.setCursorPos(pos)
      # console.log(cmd)
      cmd.init()
      if recursive and cmd.content? and (!cmd.getCmd()? or !cmd.getOption('preventParseAll'))
        parser = new Codewave(new TextParser(cmd.content), {parent: this})
        cmd.content = parser.parseAll()
      res =  cmd.execute()
      if res.then?
        throw new Error('Async nested commands are not supported')
      if res?
        if cmd.replaceEnd?
          pos = cmd.replaceEnd
        else
          pos = @editor.getCursorPos().end
    return @getText()
  getText: ->
    return @editor.text()
  isRoot: ->
    return !@parent? and (!@inInstance? or !@inInstance.finder?)
  getRoot: ->
    if @isRoot
      return this
    else if @parent?
      return @parent.getRoot()
    else if @inInstance?
      return @inInstance.codewave.getRoot()
  removeCarret: (txt) ->
    return StringHelper.removeCarret(txt,@carretChar)
  getCarretPos: (txt) ->
    return StringHelper.getCarretPos(txt,@carretChar)
  regMarker: (flags="g") -> # [pawa python] replace flags="g" flags=0 
    return new RegExp(StringHelper.escapeRegExp(@marker), flags)
  removeMarkers: (text) ->
    return text.replace(@regMarker(),'') # [pawa python] replace @regMarker() self.marker 

  @init: ->
    unless @inited
      @inited = true
      Command.initCmds()
      Command.loadCmds()

  @inited: false