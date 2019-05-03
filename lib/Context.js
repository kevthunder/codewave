var indexOf = [].indexOf;

export var Context = class Context {
  constructor(codewave) {
    this.codewave = codewave;
    this.nameSpaces = [];
  }

  addNameSpace(name) {
    if (indexOf.call(this.nameSpaces, name) < 0) {
      this.nameSpaces.push(name);
      return this._namespaces = null;
    }
  }

  addNamespaces(spaces) {
    var j, len, results, space;
    if (spaces) {
      if (typeof spaces === 'string') {
        spaces = [spaces];
      }
      results = [];
      for (j = 0, len = spaces.length; j < len; j++) {
        space = spaces[j];
        results.push(this.addNameSpace(space));
      }
      return results;
    }
  }

  removeNameSpace(name) {
    return this.nameSpaces = this.nameSpaces.filter(function(n) {
      return n !== name;
    });
  }

  getNameSpaces() {
    var npcs;
    if (this._namespaces == null) {
      npcs = ['core'].concat(this.nameSpaces);
      if (this.parent != null) {
        npcs = npcs.concat(this.parent.getNameSpaces());
      }
      this._namespaces = Codewave.util.unique(npcs);
    }
    return this._namespaces;
  }

  getCmd(cmdName, nameSpaces = []) {
    var finder;
    finder = this.getFinder(cmdName, nameSpaces);
    return finder.find();
  }

  getFinder(cmdName, nameSpaces = []) {
    return new Codewave.CmdFinder(cmdName, {
      namespaces: nameSpaces,
      useDetectors: this.isRoot(),
      codewave: this.codewave,
      parentContext: this
    });
  }

  isRoot() {
    return this.parent == null;
  }

  wrapComment(str) {
    var cc;
    cc = this.getCommentChar();
    if (cc.indexOf('%s') > -1) {
      return cc.replace('%s', str);
    } else {
      return cc + ' ' + str + ' ' + cc;
    }
  }

  wrapCommentLeft(str = '') {
    var cc, i;
    cc = this.getCommentChar();
    if ((i = cc.indexOf('%s')) > -1) {
      return cc.substr(0, i) + str;
    } else {
      return cc + ' ' + str;
    }
  }

  wrapCommentRight(str = '') {
    var cc, i;
    cc = this.getCommentChar();
    if ((i = cc.indexOf('%s')) > -1) {
      return str + cc.substr(i + 2);
    } else {
      return str + ' ' + cc;
    }
  }

  cmdInstanceFor(cmd) {
    return new Codewave.CmdInstance(cmd, this);
  }

  getCommentChar() {
    var char, cmd, inst, res;
    if (this.commentChar != null) {
      return this.commentChar;
    }
    cmd = this.getCmd('comment');
    char = '<!-- %s -->';
    if (cmd != null) {
      inst = this.cmdInstanceFor(cmd);
      inst.content = '%s';
      res = inst.result();
      if (res != null) {
        char = res;
      }
    }
    this.commentChar = char;
    return this.commentChar;
  }

};

//# sourceMappingURL=maps/Context.js.map
