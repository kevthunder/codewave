@assertEditorResult = (editor,res)->
  expect(editor.text()).to.eql(res.replace('|',''))
  pos = res.indexOf('|')
  expect(editor.getCursorPos().raw()).to.eql([pos,pos])
  
@setEditorContent = (editor,val)->
  editor.text(val.replace('|',''))
  pos = val.indexOf('|')
  editor.setCursorPos(pos)

unless Function::bind?
  Function::bind = (thisp) ->
    =>
      @apply thisp, arguments
    
@createTextArea = (id) ->
  area = document.createElement('textarea')
  area.id = id
  document.body.appendChild(area);
  
@removeTextArea = (id) ->
  area = document.getElementById(id)
  area.parentElement.removeChild(area);