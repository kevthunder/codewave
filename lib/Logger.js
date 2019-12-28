/* eslint-disable no-undef */

const Logger = class Logger {
  log (...args) {
    var i, len, msg, results

    if (this.isEnabled()) {
      results = []

      for (i = 0, len = args.length; i < len; i++) {
        msg = args[i]
        results.push(console.log(msg))
      }

      return results
    }
  }

  isEnabled () {
    return (typeof console !== 'undefined' && console !== null ? console.log : null) != null && this.enabled && Logger.enabled
  }

  runtime (funct, name = 'function') {
    var res, t0, t1
    t0 = performance.now()
    res = funct()
    t1 = performance.now()
    console.log(`${name} took ${t1 - t0} milliseconds.`)
    return res
  }

  toMonitor (obj, name, prefix = '') {
    var funct
    funct = obj[name]
    obj[name] = function () {
      var args
      args = arguments
      return this.monitor(function () {
        return funct.apply(obj, args)
      }, prefix + name)
    }
  }

  monitor (funct, name) {
    var res, t0, t1
    t0 = performance.now()
    res = funct()
    t1 = performance.now()

    if (this.monitorData[name] != null) {
      this.monitorData[name].count++
      this.monitorData[name].total += t1 - t0
    } else {
      this.monitorData[name] = {
        count: 1,
        total: t1 - t0
      }
    }

    return res
  }

  resume () {
    return console.log(this.monitorData)
  }
}

Logger.enabled = true
Logger.prototype.enabled = true
Logger.prototype.monitorData = {}

exports.Logger = Logger
