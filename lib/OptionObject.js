
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

    if (((ref = this[key]) != null ? ref.call : null) != null) {
      this[key](val)
    } else {
      this[key] = val
    }
  }

  getOpt (key) {
    var ref

    if (((ref = this[key]) != null ? ref.call : null) != null) {
      return this[key]()
    } else {
      return this[key]
    }
  }

  getOpts () {
    return Object.keys(this.defaults).reduce((opts, key) => {
      opts[key] = this.getOpt(key)
      return opts
    }, {})
  }
}
exports.OptionObject = OptionObject
