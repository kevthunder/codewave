export Logger = ( 
  log: (args...) ->
    if window.console and this.enabled
      for msg in args
        console.log(msg)
  enabled: true
  runtime: (funct,name = "function") ->
    t0 = performance.now()
    res = funct()
    t1 = performance.now()
    console.log("#{name} took #{t1 - t0} milliseconds.")
    res
  monitorData: {}
  toMonitor: (obj,name,prefix='') ->
    funct = obj[name]
    obj[name] = -> 
      args = arguments
      this.monitor((-> funct.apply(obj,args)),prefix+name)
  monitor: (funct,name) ->
    t0 = performance.now()
    res = funct()
    t1 = performance.now()
    if this.monitorData[name]?
      this.monitorData[name].count++
      this.monitorData[name].total+= t1 - t0
    else
      this.monitorData[name] = {
        count: 1
        total: t1 - t0
      }
    res
  resume: ->
    console.log(this.monitorData)
)