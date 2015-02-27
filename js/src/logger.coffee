@Codewave.logger = ( 
  log: (args...) ->
    if window.console
      for msg in args
        console.log(msg)
)