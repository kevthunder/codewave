import re
import textwrap
import codewave_core.command as command
import codewave_core.util as util
import codewave_core.logger as logger
import codewave_core.detector as detector


def initCmds():
	core = command.cmds.addCmd(command.Command('core'))
	core.addDetector(detector.LangDetector())
	
	core.addCmds({
		'help':{
			'result' : textwrap.dedent(
				"""
				~~box~~
				~~quote_carret~~
				  ___         _   __      __
				 / __|___  __| |__\ \    / /_ ___ ______
				/ /__/ _ \/ _` / -_\ \/\/ / _` \ V / -_/
				\____\___/\__,_\___|\_/\_/\__,_|\_/\___|
				The text editor helper
				~~/quote_carret~~
				~~!close|~~
				~~/box~~
				""")
		},
		'no_execute':{
			'result' : no_execute
		},
		'quote_carret':{
			'result' : quote_carret,
			'checkCarret' : False
		},
		'exec_parent':{
			'execute' : exec_parent
		},
		'box':{
			'cls' : BoxCmd
		},
		'close':{
			'cls' : CloseCmd
		},
		'edit':{
			'cmds' : {
				'source': makeVarCmd('source'),
				'save':{
					'aliasOf': 'core:exec_parent'
				}
			},
			'cls' : EditCmd
		},
		'namespace':{
			'cls' : NameSpaceCmd
		},
		'nspc':{
			'aliasOf' : 'core:namespace'
		},
		'emmet':{
			'cls' : EmmetCmd
		},
		
	})
	
	html = command.cmds.addCmd(command.Command('html'))
	html.addCmds({
		'fallback':{
			'aliasOf' : 'core:emmet',
			'defaults' : {'lang':'html'},
			'nameToParam' : 'abbr'
		},
	})
	
command.cmdInitialisers.add(initCmds)

def set_var(name,instance):
	val = None
	p = instance.getParam(0)
	if p is not None :
		val = p
	elif instance.content :
		val = instance.content
	if val is not None :
		instance.codewave.vars[name] = val
		return val
def makeVarCmd(name) :
	return {
		'execute': (lambda instance: set_var(name,instance))
	}

def no_execute(instance):
	reg = re.compile("^("+util.escapeRegExp(instance.codewave.brakets) + ')' + util.escapeRegExp(instance.codewave.noExecuteChar))
	return re.sub(reg, r'\1', instance.str)

def quote_carret(instance):
	return instance.content.replace('|', '||')
def exec_parent(instance):
	if instance.parent is not None:
		res = instance.parent.execute()
		instance.replaceStart = instance.parent.replaceStart
		instance.replaceEnd = instance.parent.replaceEnd
		return res
		

class BoxCmd(command.BaseCommand):
	def __init__(self,instance):
		self.instance = instance
		
		if self.instance.content:
			bounds = self.textBounds(self.instance.content)
			self.width,self.height = bounds.width, bounds.height
		else:
			self.width = 50
			self.height = 3
		
		params = ['width']
		if len(self.instance.params) > 1 :
			params.append(0)
		self.width = self.instance.getParam(params,self.width)
			
		params = ['height']
		if len(self.instance.params) > 1 :
			params.append(1)
		elif len(self.instance.params) > 0:
			params.append(0)
		self.height = self.instance.getParam(params,self.height)
		
		self.cmd = self.instance.getParam(['cmd'])
		self.deco = self.instance.codewave.deco
		self.pad = 2
	def result(self):
		return self.startSep() + "\n" + self.lines(self.instance.content) + "\n"+ self.endSep()
	def wrapComment(self,str):
		return self.instance.codewave.wrapComment(str)
	def separator(self):
		len = self.width + 2 * self.pad + 2 * len(self.deco)
		return self.wrapComment(self.decoLine(len))
	def startSep(self):
		cmd = ''
		if self.cmd is not None:
			cmd = self.instance.codewave.brakets+self.cmd+self.instance.codewave.brakets
		ln = self.width + 2 * self.pad + 2 * len(self.deco) - len(cmd)
		return self.wrapComment(cmd+self.decoLine(ln))
	def endSep(self):
		closing = ''
		if self.cmd is not None:
			closing = self.instance.codewave.brakets+self.instance.codewave.closeChar+self.cmd.split(" ")[0]+self.instance.codewave.brakets
		ln = self.width + 2 * self.pad + 2 * len(self.deco) - len(closing)
		return self.wrapComment(closing+self.decoLine(ln))
	def decoLine(self,len):
		return util.repeatToLength(self.deco, len)
	def padding(self): 
		return util.repeatToLength(" ", self.pad)
	def lines(self,text = ''):
		text = text or ''
		lines = text.replace('\r','').split("\n")
		return "\n".join([self.line(lines[x] if x < len(lines) else '') for x in range(0,self.height)]) 
	def line(self,text = ''):
		return self.wrapComment(
				self.deco + 
				self.padding() + 
				text + 
				util.repeatToLength(" ", self.width-len(self.instance.codewave.removeCarret(text))) + 
				self.padding() + 
				self.deco
			)
	def textBounds(self,text):
		return util.getTxtSize(self.instance.codewave.removeCarret(text))
		

class CloseCmd(command.BaseCommand):
	def __init__(self,instance):
		self.instance = instance
		self.deco = self.instance.codewave.deco
	def startFind(self):
		return self.instance.codewave.wrapCommentLeft(self.deco + self.deco)
	def endFind(self):
		return self.instance.codewave.wrapCommentRight(self.deco + self.deco)
	def execute(self):
		startFind = self.startFind()
		endFind = self.endFind()
		start = self.instance.codewave.findPrev(self.instance.pos, startFind)
		end = self.instance.codewave.findNext(self.instance.getEndPos(), endFind) 
		if start is not None and end is not None :
			self.instance.codewave.editor.spliceText(start,end + len(endFind),'')
			self.instance.codewave.editor.setCursorPos(start)
		else:
			self.instance.replaceWith('')



class EditCmd(command.BaseCommand):
	def __init__(self,instance):
		self.instance = instance
		self.cmdName = self.instance.getParam([0,'cmd'])
		self.verbalize = self.instance.getParam([1]) in ['v','verbalize']
		self.cmd = self.instance.codewave.getCmd(self.cmdName) if self.cmdName is not None else None
		self.editable = self.cmd.isEditable() if self.cmd is not None else True
		self.content = self.instance.content
	def result(self):
		if self.content:
			return self.resultWithContent()
		else:
			return self.resultWithoutContent()
	def resultWithContent(self):
			parser = self.instance.getParserForText(self.content)
			parser.parseAll()
			command.saveCmd(self.cmdName,{
				'result': parser.vars['source']
			})
			return ''
	def resultWithoutContent(self):
		if not self.cmd or self.editable:
			source = self.cmd.resultStr if self.cmd else '|'
			name = self.cmd.fullName if self.cmd else self.cmdName
			parser = self.instance.getParserForText(textwrap.dedent(
				"""
				~~box cmd:"%(cmd)s"~~
				~~!source~~
				%(source)s
				~~/source~~
				~~!save~~ ~~!close~~
				~~/box~~
				""") % {'cmd': self.instance.cmd.fullName + ' ' +name, 'source': source})
			return parser.getText() if self.verbalize else parser.parseAll()



class NameSpaceCmd(command.BaseCommand):
	def __init__(self,instance):
		self.instance = instance
	def result(self):
		namespaces = self.instance.finder.namespaces
		txt = '~~box~~\n'
		for nspc in namespaces :
			txt += nspc+'\n'
		txt += '~~!close|~~\n~~/box~~'
		parser = self.instance.getParserForText(txt)
		return parser.parseAll()



class EmmetCmd(command.BaseCommand):
	def __init__(self,instance):
		self.instance = instance
		self.abbr = self.instance.getParam([0,'abbr','abbreviation'])
		self.lang = self.instance.getParam([1,'lang','language'])
	def result(self):
		emmet_ctx = self.instance.codewave.editor.getEmmetContextObject()
		if emmet_ctx is not None :
			with emmet_ctx.js() as c:
				res = c.locals.emmet.expandAbbreviation(self.abbr)
				if res is not None :
					if '${0}' in res :
						res = res.replace('${0}','|')
					return res

