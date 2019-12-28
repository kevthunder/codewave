
const Logger = require('./Logger').Logger

var Storage = class Storage {
  constructor (engine) {
    this.engine = engine
  }

  save (key, val) {
    if (this.engineAvailable()) {
      return this.engine.save(key, val)
    }
  }

  saveInPath (path, key, val) {
    if (this.engineAvailable()) {
      return this.engine.saveInPath(path, key, val)
    }
  }

  load (key) {
    if (this.engine != null) {
      return this.engine.load(key)
    }
  }

  engineAvailable () {
    if (this.engine != null) {
      return true
    } else {
      this.logger = this.logger || new Logger()
      this.logger.log('No storage engine available')
      return false
    }
  }
}
exports.Storage = Storage
