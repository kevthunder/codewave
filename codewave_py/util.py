import re
def trimEmptyLine(txt) :
	return re.sub(r'^\r?\n', '', re.sub(r'\r?\n$', '', txt))
def escapeRegExp(txt) :
	return re.escape(txt)
def repeatToLength(txt, length):
   return (txt * (int(length/len(txt))+1))[:length]
		
class StrPos():
	def __init__(self,pos,str):
		self.pos,self.str = pos,str
	def end(self) :
		self.pos + len(self.str)

class Pos():
	def __init__(self,start,end):
		self.start,self.end = start,end
	def containsPt(self,pt):
		return self.start <= pt and pt <= self.end
	def containsPos(self,pos):
		return self.start <= pos.start and pos.end <= self.end
class wrappedPos(Pos):
	def __init__(self,start,innerStart,innerEnd,end):
		self.start,self.innerStart,self.innerEnd,self.end = start,innerStart,innerEnd,end
	def innerContainsPt(self,pt):
		return self.innerStart <= pt and pt <= self.innerEnd
	def innerContainsPos(self,pos):
		return self.innerStart <= pos.start and pos.end <= self.innerEnd
def getTxtSize(txt):
	lines = txt.replace('\r','').split("\n")
	w = 0
	for l in lines:
		w = max(w,len(l))
	return Size(w,len(lines))
		
class Size():
	def __init__(self,width,height):
		self.width,self.height = width,height
