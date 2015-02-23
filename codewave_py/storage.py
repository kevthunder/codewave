import os.path
import json
import codewave_core.logger as logger
 
CONFIG_FOLDER = None

def save(key,val):
	configFile = getConfigFile()
	if configFile is None :
		return None
	f = None
	try:
		if os.path.isfile(configFile) : 
			f = open(configFile, 'r+')
			data = _getData(f)
			f.seek(0)
			if data is None :
				data = {}
		else :
			if not os.path.exists(os.path.dirname(configFile)):
				os.makedirs(os.path.dirname(configFile))
			f = open(configFile, 'w')
			data = {}
		data[key] = val
		f.write(json.dumps(data, indent=2, separators=(',', ': ')))
		f.truncate()
	finally:
		if f is not None :
			f.close()
	
def load(key):
	configFile = getConfigFile()
	if configFile is None :
		return None
	if os.path.isfile(configFile) : 
		f = open(configFile, 'r')
		try:
			data = _getData(f)
		finally:
			f.close()
		if data is not None and key in data :
			return data[key]
			
def _getData(f):
	raw = f.read()
	if len(raw) :
	  return json.loads(raw)
		
def getConfigFile():
	if CONFIG_FOLDER is not None :
		return os.path.join(CONFIG_FOLDER, 'config.json')
	else :
		logger.log('Config file path is not setted')