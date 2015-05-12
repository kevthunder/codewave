@assertEditorResult = (editor,res)->
  expect(editor.text()).to.eql(res.replace('|',''))
  pos = res.indexOf('|')
  expect(editor.getCursorPos().raw()).to.eql([pos,pos])
  
@setEditorContent = (editor,val)->
  editor.text(val.replace('|',''))
  pos = val.indexOf('|')
  editor.setCursorPos(pos)