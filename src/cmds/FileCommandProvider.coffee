
import { Command, BaseCommand } from '../Command';
import { LangDetector } from '../Detector';
import { BoxHelper } from '../BoxHelper';
import { EditCmdProp } from '../EditCmdProp';
import { StringHelper } from '../helpers/StringHelper';
import { PathHelper } from '../helpers/PathHelper';
import { Replacement } from '../positioning/Replacement';

export class FileCommandProvider
 register: (cmds)-> 
  core = cmds.addCmd(new Command('file'))
  
  core.addCmds({
    "read": {
      'result' : readCommand
      'allowedNamed':['file']
      'help': """
        read the content of a file
        """
    }
    "write": {
      'result' : writeCommand
      'allowedNamed':['file','content']
      'help': """
        save into a file
        """
    }
    "delete": {
      'result' : deleteCommand
      'allowedNamed':['file']
      'help': """
        delete a file
        """
    }
  })

readCommand = (instance) ->
  fileSystem = instance.codewave.getFileSystem()
  file = instance.getParam([0,'file'])
  if fileSystem
    fileSystem.readFile(file)

writeCommand = (instance) ->
  fileSystem = instance.codewave.getFileSystem()
  file = instance.getParam([0,'file'])
  content = instance.content or instance.getParam([1,'content'])
  if fileSystem
    fileSystem.writeFile(file,content)
      
deleteCommand = (instance) ->
  fileSystem = instance.codewave.getFileSystem()
  file = instance.getParam([0,'file'])
  if fileSystem
    fileSystem.deleteFile(file)