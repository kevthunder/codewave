

const CmdFinder = require("./CmdFinder");

const CmdInstance = require("./CmdInstance");

const ArrayHelper = require("./helpers/ArrayHelper");

var indexOf = [].indexOf;
var Context = class Context {
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
    return this.nameSpaces = this.nameSpaces.filter(function (n) {
      return n !== name;
    });
  }

  getNameSpaces() {
    var npcs;

    if (this._namespaces == null) {
      npcs = this.nameSpaces;

      if (this.parent != null) {
        npcs = npcs.concat(this.parent.getNameSpaces());
      }

      this._namespaces = ArrayHelper.ArrayHelper.unique(npcs);
    }

    return this._namespaces;
  }

  getCmd(cmdName, options = {}) {
    var finder;
    finder = this.getFinder(cmdName, options);
    return finder.find();
  }

  getFinder(cmdName, options = {}) {
    return new CmdFinder.CmdFinder(cmdName, Object.assign({
      namespaces: [],
      useDetectors: this.isRoot(),
      codewave: this.codewave,
      parentContext: this
    }, options));
  }

  isRoot() {
    return this.parent == null;
  }

  getParentOrRoot() {
    if (this.parent != null) {
      return this.parent;
    } else {
      return this;
    }
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
    return new CmdInstance.CmdInstance(cmd, this);
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
exports.Context = Context;

