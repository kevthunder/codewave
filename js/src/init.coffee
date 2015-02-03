saved = Codewave.storage.load('saved')
if saved?
  for fullname, data of saved
    Codewave.setCmd(fullname, data, false)
