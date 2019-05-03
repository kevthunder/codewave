this.Codewave.storage = new class {
  constructor() {}

  save(key, val) {
    return localStorage.setItem(this.fullKey(key), JSON.stringify(val));
  }

  load(key) {
    return JSON.parse(localStorage.getItem(this.fullKey(key)));
  }

  fullKey(key) {
    return 'CodeWave_' + key;
  }

};

//# sourceMappingURL=maps/storage.js.map