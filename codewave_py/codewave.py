import codewave_core.logger as logger

import codewave_core.util as util

import codewave_core.cmd_instance as cmd_instance
import codewave_core.cmd_finder as cmd_finder
import codewave_core.text_parser as text_parser
import codewave_core.closing_promp as closing_promp
import codewave_core.command as command

def init():
	command.initCmds()
	command.loadCmds()

class Codewave():
	def __init__(self,editor,parent = None, **keywords):
		self.editor,self.parent = editor,parent
		self.closingPromp = self.context = None
		self.nameSpaces = []
		self.vars = {}
		
		defaults = {
			'brakets' : '~~',
			'deco' : '~',
			'closeChar' : '/',
			'noExecuteChar' : '!',
			'carretChar' : '|',
			'checkCarret' : True
		}
		
		for key, val in defaults.items():
			if key in keywords:
				setattr(self,key,keywords[key])
			elif parent is not None :
				setattr(self,key,getattr(parent,key))
			else:
				setattr(self,key,val)
		
	def onActivationKey(self):
		logger.log('activation key')
		cmd = self.commandOnCursorPos()
		if cmd is not None :
			cmd.init()
			logger.log(cmd)
			cmd.execute()
		else:
			cpos = self.editor.getCursorPos()
			if cpos['start'] == cpos['end'] :
				self.addBrakets(cpos['start'],cpos['end'])
			else:
				self.promptClosingCmd(cpos['start'],cpos['end'])
	def commandOnCursorPos(self):
		cpos = self.editor.getCursorPos()
		return self.commandOnPos(cpos['end'])
	def commandOnPos(self,pos):
		if self.precededByBrakets(pos) and self.followedByBrakets(pos) and self.countPrevBraket(pos) % 2 == 1 :
			prev = pos-len(self.brakets)
			next = pos
		else :
			if self.precededByBrakets(pos) and self.countPrevBraket(pos) % 2 == 0:
				pos -= len(self.brakets)
			prev = self.findPrevBraket(pos)
			if prev is None :
				return None 
			next = self.findNextBraket(pos-1)
			if next is None or self.countPrevBraket(prev) % 2 != 0 :
				return None
		return cmd_instance.CmdInstance(self,prev,self.editor.textSubstr(prev,next+len(self.brakets)))
	def nextCmd(self,start = 0):
		pos = start
		beginning = None
		while True:
			f = self.findAnyNext(pos ,[self.brakets,"\n"])
			if f is None:
				break
			pos = f.pos + len(f.str)
			if f.str == self.brakets:
				if beginning is not None:
					return cmd_instance.CmdInstance(self,beginning,self.editor.textSubstr(beginning,f.pos+len(self.brakets)))
				else:
					beginning = f.pos
			else:
				beginning = None
		None
	def getEnclosingCmd(self,pos = 0):
		cpos = pos
		closingPrefix = self.brakets + self.closeChar
		while True:
			p = self.findNext(cpos,closingPrefix)
			if p is None:
				return None
			cmd = self.commandOnPos(p+len(closingPrefix))
			if cmd is not None:
				cpos = cmd.getEndPos()
				if cmd.pos < pos:
					return cmd
			else:
				cpos = p+len(losingPrefix)
	def precededByBrakets(self,pos):
		return self.editor.textSubstr(pos-len(self.brakets),pos) == self.brakets
	def followedByBrakets(self,pos):
		return self.editor.textSubstr(pos,pos+len(self.brakets)) == self.brakets
	def countPrevBraket(self,start):
		i = 0
		start = self.findPrevBraket(start)
		while start is not None :
			start = self.findPrevBraket(start)
			i += 1
		return i
	def isEndLine(self,pos):
		return self.editor.textSubstr(pos,pos+1) == "\n" or pos + 1 >= self.editor.textLen()
	def findLineStart(self,pos):
		p = self.findAnyNext(pos ,["\n"], -1)
		return p.pos+1 if p is not None else 0
	def findPrevBraket(self,start):
		return self.findNextBraket(start,-1)
	def findNextBraket(self,start,direction = 1):
		f = self.findAnyNext(start ,[self.brakets,"\n"], direction)
		if f is not None and f.str == self.brakets :
			return f.pos
	def findPrev(self,start,string):
		return self.findNext(start,string,-1)
	def findNext(self,start,string,direction = 1):
		f = self.findAnyNext(start ,[string], direction)
		if f is not None:
			return f.pos 
	def findAnyNext(self,start,strings,direction = 1):
		pos = start
		while True :
			if 0 > pos or pos >= self.editor.textLen() :
				return None
			for stri in strings :
			
				start, end = pos, pos + len(stri) * direction
				if end < start :
					start, end = end, start
				if stri == self.editor.textSubstr(start,end) :
					return util.StrPos(pos-len(stri) if direction < 0 else pos,stri)
			pos += direction
	def findMatchingPair(self,startPos,opening,closing,direction = 1):
		pos = startPos
		nested = 0
		while True:
			f = self.findAnyNext(pos,[closing,opening],direction)
			if f is None:
				break
			pos = f.pos + (len(f.str) if direction > 0 else 0)
			if f.str == (closing if direction > 0 else opening):
				if nested > 0:
					nested-=1
				else:
					return f
			else:
				nested+=1
		return None
	def addBrakets(self,start, end):
		if start == end :
			self.editor.insertTextAt(self.brakets+self.brakets,start)
		else :
			self.editor.insertTextAt(self.brakets,end)
			self.editor.insertTextAt(self.brakets,start)
		self.editor.setCursorPos(end+len(self.brakets))
	def promptClosingCmd(self,start, end):
		if self.closingPromp is not None:
			self.closingPromp.stop()
		self.closingPromp = closing_promp.ClosingPromp(self,start, end).begin()
	def parseAll(self,recursive = True):
		pos = 0
		while True:
			cmd = self.nextCmd(pos)
			if cmd is None:
				break
			pos = cmd.getEndPos()
			self.editor.setCursorPos(pos)
			if recursive and cmd.content is not None :
				parser = Codewave(text_parser.TextParser(cmd.content),parent=self)
				cmd.content = parser.parseAll()
			if cmd.init().execute() is not None:
				if cmd.replaceEnd is not None:
					pos = cmd.replaceEnd
				else:
					pos = self.editor.getCursorPos().end
		return self.getText()
	def getText(self):
		return self.editor.text
	def getNameSpaces(self):
		npcs = set(['core']).union(self.nameSpaces)
		if self.parent is not None:
			npcs = npcs.union(self.parent.getNameSpaces())
		if self.context is not None:
			if self.context.finder is not None:
				npcs = npcs.union(self.context.finder.namespaces)
			npcs = npcs.union([self.context.cmd.fullName])
		return list(npcs)
	def addNameSpace(self,name):
		self.nameSpaces.append(name)
	def removeNameSpace(self,name):
		self.nameSpaces = [ n for n in self.nameSpaces if n != name]
	def getCmd(self,cmdName,nameSpaces = []) :
		finder = self.getFinder(cmdName,nameSpaces)
		found = finder.find()
		return found
	def getFinder(self,cmdName,nameSpaces = []) :
		return cmd_finder.CmdFinder(cmdName,self.getNameSpaces() + nameSpaces,
			useDetectors = self.isRoot(),
			codewave = self
		)
	def isRoot(self):
		return self.parent is None and (self.context is None or self.context.finder is None)
	def getCommentChar(self):
		return '<!-- %s -->'
	def wrapComment(self,str):
		cc = self.getCommentChar()
		if '%s' in cc :
			return cc.replace('%s',str)
		else:
			return cc + ' ' + str + ' ' + cc
	def wrapCommentLeft(self,str = ''):
		cc = self.getCommentChar()
		i = cc.index('%s') if '%s' in cc else None
		if i is not None:
			return cc[0:i] + str
		else:
			return cc + ' ' + str
	def wrapCommentRight(self,str = ''):
		cc = self.getCommentChar()
		i = cc.index('%s') if '%s' in cc else None
		if i is not None:
			return str + cc[i+2:]
		else:
			return str + ' ' + cc
	def removeCarret(self,txt):
		return txt.replace(self.carretChar+self.carretChar, '[[[[quoted_carret]]]]') \
							.replace(self.carretChar, '') \
							.replace('[[[[quoted_carret]]]]', self.carretChar)
	def getCarretPos(self,txt):
		txt = txt.replace(self.carretChar+self.carretChar, ' ')
		if self.carretChar in txt :
			return txt.index(self.carretChar)