
class Detector():
	def __init__(self,data={}):
		self.data = data
	def detect(self,finder):
		pass
		

class LangDetector(Detector):
	def detect(self,finder):
		if finder.codewave is not None :
			lang = finder.codewave.editor.getLang()
			if lang is not None :
				return lang.lower()