import codewave_core.util as util
import codewave_core.editor as editor

class TextParser(editor.Editor):
	def __init__(self,text):
		self.namespace = 'text_parser'
		self._text = text
		self.target = None
	@property
	def text(self):
		return self._text
	@text.setter
	def text(self, val):
		self._text = val
	def textCharAt(self,pos):
		return self.text[pos]
	def textLen(self):
		return len(self.text)
	def textSubstr(self,start, end):
		return self.text[start:end]
	def insertTextAt(self,text, pos):
		self.text = self.text[:pos]+text+self.text[pos:]
	def spliceText(self,start, end, text):
		self.text = self.text[:start]+(text or "")+self.text[end:]
	def getCursorPos(self):
		return self.target
	def setCursorPos(self,start, end = None):
		if end is None:
			end = start
		self.target = util.Pos(start, end)