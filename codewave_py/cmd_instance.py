import re
import codewave_core.codewave
import codewave_core.util as util
import codewave_core.logger as logger
import codewave_core.command as command
import codewave_core.text_parser as text_parser

class CmdInstance():
	def __init__(self,codewave,pos,str):
		self.codewave,self.pos,self.str = codewave,pos,str
		self.content = self.cmdObj = self.closingPos = None
		self.replaceStart = self.replaceEnd = None
		self.cmd = self.aliasedCmd = self.cmdOptions = None
		if not self.isEmpty():
			self._checkCloser()
			self.opening = self.str
			self.noBracket = self._removeBracket(self.str)
			self._splitComponents()
			self._findClosing()
			self._checkElongated()
			self._checkBox()
	def init(self):
		if not self.isEmpty():
			self._getParentCmds()
			self._getCmd()
			self._parseParams(self.rawParams)
			self._getCmdObj()
		return self
	def _checkCloser(self):
		noBracket = self._removeBracket(self.str)
		if noBracket[0:len(self.codewave.closeChar)] == self.codewave.closeChar :
			f = self._findOpeningPos()
			if f is not None :
				self.closingPos = util.StrPos(self.pos, self.str)
				self.pos = f.pos
				self.str = f.str
	def _findOpeningPos(self):
		cmdName = self._removeBracket(self.str)[len(self.codewave.closeChar):]
		opening = self.codewave.brakets + cmdName
		closing = self.str
		f = self.codewave.findMatchingPair(self.pos,opening,closing,-1)
		if f is not None :
			f.str = self.codewave.editor.textSubstr(f.pos,self.codewave.findNextBraket(f.pos+len(f.str))+len(self.codewave.brakets))
			return f
	def _splitComponents(self):
		parts = self.noBracket.split(" ");
		self.cmdName = parts.pop(0)
		self.rawParams = " ".join(parts)
	def _parseParams(self,params):
		self.params = []
		self.named = {}
		if self.cmd is not None : 
			self.named.update(self.cmd.getDefaults(self))
			nameToParam = self.cmd.getOption('nameToParam',self)
			if nameToParam is not None :
				self.named[nameToParam] = self.cmdName
		if len(params):
			inStr = False
			param = ''
			name = False
			for i in range(0,len(params)):
				chr = params[i]
				if chr == ' ' and not inStr:
					if(name):
						self.named[name] = param
					else:
						self.params.append(param)
					param = ''
					name = False
				elif chr == '"' and (i == 0 or params[i-1] != '\\'):
					inStr = not inStr
				elif chr == ':' and not name and not inStr:
					name = param
					param = ''
				else:
					param += chr
			if len(param):
				if(name):
					self.named[name] = param
				else:
					self.params.append(param)
	def _findClosing(self):
		f = self._findClosingPos()
		if f is not None:
			self.content = util.trimEmptyLine(self.codewave.editor.textSubstr(self.pos+len(self.str),f.pos))
			self.str = self.codewave.editor.textSubstr(self.pos,f.pos+len(f.str))
	def _findClosingPos(self):
		if self.closingPos is not None :
			return self.closingPos
		closing = self.codewave.brakets + self.codewave.closeChar + self.cmdName + self.codewave.brakets
		opening = self.codewave.brakets + self.cmdName
		f = self.codewave.findMatchingPair(self.pos+len(self.str),opening,closing)
		if f is not None:
			self.closingPos = f
			return self.closingPos
	def _checkElongated(self):
		endPos = self.getEndPos()
		max = self.codewave.editor.textLen()
		while endPos < max and self.codewave.editor.textSubstr(endPos,endPos+len(self.codewave.deco)) == self.codewave.deco:
			endPos+=len(self.codewave.deco)
		if endPos >= max or self.codewave.editor.textSubstr(endPos,endPos+1) in [' ',"\n","\r"]:
			self.str = self.codewave.editor.textSubstr(self.pos,endPos)
	def _checkBox(self):
		cl = self.codewave.wrapCommentLeft()
		cr = self.codewave.wrapCommentRight()
		endPos = self.getEndPos() + len(cr)
		if self.codewave.editor.textSubstr(self.pos - len(cl),self.pos) == cl and self.codewave.editor.textSubstr(endPos - len(cr),endPos) == cr:
			self.pos = self.pos - len(cl)
			self.str = self.codewave.editor.textSubstr(self.pos,endPos)
			self._removeCommentFromContent()
	def _removeCommentFromContent(self):
		if self.content:
			ecl = util.escapeRegExp(self.codewave.wrapCommentLeft())
			ecr = util.escapeRegExp(self.codewave.wrapCommentRight())
			ed = util.escapeRegExp(self.codewave.deco)
			re1 = re.compile('^\\s*'+ecl+'(?:'+ed+')+\\s*(.*?)\\s*(?:'+ed+')+'+ecr+'$',re.M)
			re2 = re.compile('^(?:'+ed+')*'+ecr+'\n')
			re3 = re.compile('\n\\s*'+ecl+'(?:'+ed+')*$')
			self.content = re.sub(re3,'',re.sub(re2,'',re.sub(re1,r'\1',self.content)))
	def _getParentCmds(self):
		p = self.codewave.getEnclosingCmd(self.getEndPos())
		self.parent = p.init() if p is not None else None
	def _getCmd(self):
		if self.noBracket[0:len(self.codewave.noExecuteChar)] == self.codewave.noExecuteChar:
			self.cmd = command.cmds.getCmd('core:no_execute')
		else:
			self.finder = self.codewave.getFinder(self.cmdName,self._getParentNamespaces())
			self.finder.instance = self
			self.cmd = self.finder.find()
		return self.cmd
	def _getCmdObj(self):
		if self.cmd is not None:
			self.cmdObj = self.cmd.getExecutableObj(self)
	def _getParentNamespaces(self):
		nspcs = []
		obj = self
		while obj.parent is not None:
			obj = obj.parent
			if obj.cmd is not None and obj.cmd.fullName is not None:
				nspcs.append(obj.cmd.fullName) 
		return nspcs
	def _removeBracket(self,str):
		return str[len(self.codewave.brakets):len(str)-len(self.codewave.brakets)]
	def isEmpty(self):
		return self.str == self.codewave.brakets + self.codewave.closeChar + self.codewave.brakets or self.str == self.codewave.brakets + self.codewave.brakets
	def getParam(self,names, defVal = None):
		if type(names) is not list :
			names = [names]
		for n in names:
			if isinstance( n, int ) and n < len(self.params) :
				return self.params[n] 
			if n in self.named :
				return self.named[n] 
		return defVal
	def execute(self):
		if self.isEmpty():
			if self.codewave.closingPromp is not None and self.codewave.closingPromp.whithinOpenBounds(self.pos+len(self.codewave.brakets)) is not None:
				self.codewave.closingPromp.cancel()
			else:
				self.replaceWith('')
		elif self.cmd is not None:
			if self.cmd.resultIsAvailable(self):
				res = self.cmd.result(self)
				if res is not None:
					if self.cmd.getOption('parse',self) :
						parser = self.getParserForText(res)
						res = parser.parseAll()
					self.replaceWith(res)
					return True
			else:
				return self.cmd.execute(self)
	def result(self): 
			if self.cmd.resultIsAvailable():
				self.cmd.result(self)
	def getParserForText(self,txt):
		parser = codewave_core.codewave.Codewave(text_parser.TextParser(txt))
		parser.context = self
		parser.checkCarret = False
		return parser
	def getEndPos(self):
		return self.pos+len(self.str)
	def getIndent(self):
		return self.pos - self.codewave.findLineStart(self.pos)
	def applyIndent(self,text):
		reg = re.compile(r'\n',re.M)
		return re.sub(reg, '\n'+util.repeatToLength(" ",self.getIndent()),text)
	def replaceWith(self,text):
		text = self.applyIndent(text)
		
		cursorPos = self.pos+len(text)
		if self.cmd is not None and self.codewave.checkCarret and self.cmd.getOption('checkCarret',self):
			p = self.codewave.getCarretPos(text)
			if p is not None :
				cursorPos = self.pos+p
			text = self.codewave.removeCarret(text)
			
			
		self.codewave.editor.spliceText(self.pos,self.getEndPos(),text)
		self.codewave.editor.setCursorPos(cursorPos)
		self.replaceStart = self.pos
		self.replaceEnd = self.pos+len(text)