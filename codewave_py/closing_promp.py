import codewave_core.logger as logger
import codewave_core.util as util

class ClosingPromp():
	def __init__(self,codewave,start,end):
		self.codewave,self.start,self.end = codewave,start,end
		self.len = self.end - self.start
		self.found = False
		self.openBounds = self.closeBounds = None
	def begin(self):
		self.codewave.editor.beginUndoAction()
		self.codewave.editor.insertTextAt("\n"+self.codewave.brakets+self.codewave.closeChar+self.codewave.brakets,self.end)
		self.codewave.editor.insertTextAt(self.codewave.brakets+self.codewave.brakets+"\n",self.start)
		self.codewave.editor.endUndoAction()
		
		self.found = True
		p1 = self.start+len(self.codewave.brakets)
		p2 = self.end+len(self.codewave.brakets)*3+len(self.codewave.closeChar)+2
		self.openBounds = util.wrappedPos(  self.start, p1, p1, p1+len(self.codewave.brakets))
		self.closeBounds = util.wrappedPos( self.end, p2, p2, p2+len(self.codewave.brakets))
		if self.codewave.editor.allowMultiSelection() :
			self.codewave.editor.setMultiSel([util.Pos(p2,p2),util.Pos(p1,p1)])
			if self.codewave.editor.canListenToChange() :
				self.codewave.editor.addChangeListener(self.onChange)
		else : 
			self.codewave.editor.setCursorPos(p1)
		return self
	def onChange(self,ch = None):
		if ch is None or ch['ch'] ==  32:
			if self.shouldStop() :
				self.stop()
				self.cleanClose()
	def shouldStop(self):
		if not self.updateBounds() :
			return True
		else : 
			closeStr = self.codewave.editor.textSubstr(self.closeBounds.innerStart,self.closeBounds.innerEnd)
			if ' ' in closeStr :
				return True
		return False
	def cleanClose(self):
		if self.found :
			closeStr = self.codewave.editor.textSubstr(self.closeBounds.innerStart,self.closeBounds.innerEnd)
			self.codewave.editor.spliceText(self.closeBounds.innerStart,self.closeBounds.innerEnd,closeStr.strip())
			sels = self.codewave.editor.getMultiSel()
			change = False
			for sel in sels:
				if self.closeBounds.containsPos(sel) :
					sels.remove(sel)
					change = True
			if change :
				self.codewave.editor.setMultiSel(sels)
	def stop(self):
		if self.codewave.closingPromp == self :
			self.codewave.closingPromp = None
		self.codewave.editor.removeChangeListener(self.onChange)
	def cancel(self):
		if self.updateBounds() :
			self.codewave.editor.beginUndoAction()
			self.codewave.editor.spliceText(self.closeBounds.start-1,self.closeBounds.end,'')
			self.codewave.editor.spliceText(self.openBounds.start,self.openBounds.end+1,'')
			self.codewave.editor.endUndoAction()
		
			self.codewave.editor.setCursorPos(self.start,self.end)
		self.stop()
	def updateBounds(self):
		self.found = False
		self.openBounds = self.whithinOpenBounds(self.start+len(self.codewave.brakets))
		if self.openBounds is not None :
			self.closeBounds = self.whithinCloseBounds(self.openBounds)
			if self.closeBounds is not None :
				self.found = True
		return self.found;
	def whithinOpenBounds(self,pos):
		innerStart = self.start+len(self.codewave.brakets)
		if self.codewave.findPrevBraket(pos) == self.start and self.codewave.editor.textSubstr(self.start,innerStart) == self.codewave.brakets :
			innerEnd = self.codewave.findNextBraket(innerStart)
			if innerEnd is not None :
				return util.wrappedPos( self.start, innerStart, innerEnd, innerEnd+len(self.codewave.brakets))
	def whithinCloseBounds(self,openBounds):
		start = openBounds.end+self.len+2
		innerStart = start+len(self.codewave.brakets)+len(self.codewave.closeChar)
		if self.codewave.editor.textSubstr(start,innerStart) == self.codewave.brakets+self.codewave.closeChar :
			innerEnd = self.codewave.findNextBraket(innerStart)
			if innerEnd is not None :
				return util.wrappedPos( start, innerStart, innerEnd, innerEnd+len(self.codewave.brakets))