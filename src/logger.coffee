@Codewave.logger = ( 
  log: (args...) ->
    if window.console and Codewave.logger.enabled
      for msg in args
        console.log(msg)
  enabled: true
  runtime: (funct,name = "function") ->
    t0 = performance.now()
    res = funct()
    t1 = performance.now()
    console.log("#{name} took #{t1 - t0} milliseconds.")
    res
  minitorData: {}
  toMonitor: (obj,name,prefix='') ->
    funct = obj[name]
    obj[name] = -> 
      args = arguments
      Codewave.logger.monitor((-> funct.apply(obj,args)),prefix+name)
  monitor: (funct,name) ->
    t0 = performance.now()
    res = funct()
    t1 = performance.now()
    if Codewave.logger.minitorData[name]?
      Codewave.logger.minitorData[name].count++
      Codewave.logger.minitorData[name].total+= t1 - t0
    else
      Codewave.logger.minitorData[name] = {
        count: 1
        total: t1 - t0
      }
    res
  resume: ->
    console.log(Codewave.logger.minitorData)
)