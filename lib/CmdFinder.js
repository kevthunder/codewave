var indexOf = [].indexOf;

import {
  Context
} from './Context';

import {
  NamespaceHelper
} from './helpers/NamespaceHelper';

import {
  Command
} from './Command';

export var CmdFinder = class CmdFinder {
  constructor(names, options) {
    var defaults, key, val;
    if (typeof names === 'string') {
      names = [names];
    }
    defaults = {
      parent: null,
      namespaces: [],
      parentContext: null,
      context: null,
      root: Command.cmds,
      mustExecute: true,
      useDetectors: true,
      useFallbacks: true,
      instance: null,
      codewave: null
    };
    this.names = names;
    this.parent = options['parent'];
    for (key in defaults) {
      val = defaults[key];
      if (key in options) {
        this[key] = options[key];
      } else if ((this.parent != null) && key !== 'parent') {
        this[key] = this.parent[key];
      } else {
        this[key] = val;
      }
    }
    if (this.context == null) {
      this.context = new Context(this.codewave);
    }
    if (this.parentContext != null) {
      this.context.parent = this.parentContext;
    }
    if (this.namespaces != null) {
      this.context.addNamespaces(this.namespaces);
    }
  }

  find() {
    this.triggerDetectors();
    this.cmd = this.findIn(this.root);
    return this.cmd;
  }

  //  getPosibilities: ->
  //    @triggerDetectors()
  //    path = list(@path)
  //    return @findPosibilitiesIn(@root,path)
  getNamesWithPaths() {
    var j, len, name, paths, ref, rest, space;
    paths = {};
    ref = this.names;
    for (j = 0, len = ref.length; j < len; j++) {
      name = ref[j];
      [space, rest] = NamespaceHelper.splitFirst(name);
      if ((space != null) && !(indexOf.call(this.context.getNameSpaces(), space) >= 0)) {
        if (!(space in paths)) {
          paths[space] = [];
        }
        paths[space].push(rest);
      }
    }
    return paths;
  }

  applySpaceOnNames(namespace) {
    var rest, space;
    [space, rest] = NamespaceHelper.splitFirst(namespace, true);
    return this.names.map(function(name) {
      var cur_rest, cur_space;
      [cur_space, cur_rest] = NamespaceHelper.splitFirst(name);
      if ((cur_space != null) && cur_space === space) {
        name = cur_rest;
      }
      if (rest != null) {
        name = rest + ':' + name;
      }
      return name;
    });
  }

  getDirectNames() {
    var n;
    return (function() {
      var j, len, ref, results;
      ref = this.names;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        n = ref[j];
        if (n.indexOf(":") === -1) {
          results.push(n);
        }
      }
      return results;
    }).call(this);
  }

  triggerDetectors() {
    var cmd, detector, i, j, len, posibilities, ref, res, results;
    if (this.useDetectors) {
      this.useDetectors = false;
      posibilities = new CmdFinder(this.context.getNameSpaces(), {
        parent: this,
        mustExecute: false,
        useFallbacks: false
      }).findPosibilities();
      i = 0;
      results = [];
      while (i < posibilities.length) {
        cmd = posibilities[i];
        ref = cmd.detectors;
        for (j = 0, len = ref.length; j < len; j++) {
          detector = ref[j];
          res = detector.detect(this);
          if (res != null) {
            this.context.addNamespaces(res);
            posibilities = posibilities.concat(new CmdFinder(res, {
              parent: this,
              mustExecute: false,
              useFallbacks: false
            }).findPosibilities());
          }
        }
        results.push(i++);
      }
      return results;
    }
  }

  findIn(cmd, path = null) {
    var best;
    if (cmd == null) {
      return null;
    }
    best = this.bestInPosibilities(this.findPosibilities());
    if (best != null) {
      return best;
    }
  }

  findPosibilities() {
    var direct, fallback, j, k, l, len, len1, len2, len3, m, name, names, next, nexts, nspc, nspcName, posibilities, ref, ref1, ref2, rest, space;
    if (this.root == null) {
      return [];
    }
    this.root.init();
    posibilities = [];
    ref = this.getNamesWithPaths();
    for (space in ref) {
      names = ref[space];
      nexts = this.getCmdFollowAlias(space);
      for (j = 0, len = nexts.length; j < len; j++) {
        next = nexts[j];
        posibilities = posibilities.concat(new CmdFinder(names, {
          parent: this,
          root: next
        }).findPosibilities());
      }
    }
    ref1 = this.context.getNameSpaces();
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      nspc = ref1[k];
      [nspcName, rest] = NamespaceHelper.splitFirst(nspc, true);
      nexts = this.getCmdFollowAlias(nspcName);
      for (l = 0, len2 = nexts.length; l < len2; l++) {
        next = nexts[l];
        posibilities = posibilities.concat(new CmdFinder(this.applySpaceOnNames(nspc), {
          parent: this,
          root: next
        }).findPosibilities());
      }
    }
    ref2 = this.getDirectNames();
    for (m = 0, len3 = ref2.length; m < len3; m++) {
      name = ref2[m];
      direct = this.root.getCmd(name);
      if (this.cmdIsValid(direct)) {
        posibilities.push(direct);
      }
    }
    if (this.useFallbacks) {
      fallback = this.root.getCmd('fallback');
      if (this.cmdIsValid(fallback)) {
        posibilities.push(fallback);
      }
    }
    this.posibilities = posibilities;
    return posibilities;
  }

  getCmdFollowAlias(name) {
    var cmd;
    cmd = this.root.getCmd(name);
    if (cmd != null) {
      cmd.init();
      if (cmd.aliasOf != null) {
        return [cmd, cmd.getAliased()];
      }
      return [cmd];
    }
    return [cmd];
  }

  cmdIsValid(cmd) {
    if (cmd == null) {
      return false;
    }
    if (cmd.name !== 'fallback' && indexOf.call(this.ancestors(), cmd) >= 0) {
      return false;
    }
    return !this.mustExecute || this.cmdIsExecutable(cmd);
  }

  ancestors() {
    var ref;
    if (((ref = this.codewave) != null ? ref.inInstance : void 0) != null) {
      return this.codewave.inInstance.ancestorCmdsAndSelf();
    }
    return [];
  }

  cmdIsExecutable(cmd) {
    var names;
    names = this.getDirectNames();
    if (names.length === 1) {
      return cmd.init().isExecutableWithName(names[0]);
    } else {
      return cmd.init().isExecutable();
    }
  }

  cmdScore(cmd) {
    var score;
    score = cmd.depth;
    if (cmd.name === 'fallback') {
      score -= 1000;
    }
    return score;
  }

  bestInPosibilities(poss) {
    var best, bestScore, j, len, p, score;
    if (poss.length > 0) {
      best = null;
      bestScore = null;
      for (j = 0, len = poss.length; j < len; j++) {
        p = poss[j];
        score = this.cmdScore(p);
        if ((best == null) || score >= bestScore) {
          bestScore = score;
          best = p;
        }
      }
      return best;
    }
  }

};

//# sourceMappingURL=maps/CmdFinder.js.map
