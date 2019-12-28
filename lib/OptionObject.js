
var OptionObject = class OptionObject {
  setOpts (options, defaults) {
    var key, ref, results, val
    this.defaults = defaults
    ref = this.defaults
    results = []

    for (key in ref) {
      val = ref[key]

      if (key in options) {
        results.push(this.setOpt(key, options[key]))
      } else {
        results.push(this.setOpt(key, val))
      }
    }

    return results
  }

  setOpt (key, val) {
    var ref

    if (((ref = this[key]) != null ? ref.call : void 0) != null) {
      return this[key](val)
    } else {
      return this[key] = val
    }
  }

  getOpt (key) {
    var ref

    if (((ref = this[key]) != null ? ref.call : void 0) != null) {
      return this[key]()
    } else {
      return this[key]
    }
  }

  getOpts () {
    var key, opts, ref, val
    opts = {}
    ref = this.defaults

    for (key in ref) {
      val = ref[key]
      opts[key] = this.getOpt(key)
    }

    return opts
  }
}
exports.OptionObject = OptionObject
