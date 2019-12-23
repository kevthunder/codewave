"use strict";

const bootstrap = require("./bootstrap");

const TextAreaEditor = require("./TextAreaEditor");

bootstrap.Codewave.detect = function (target) {
  var cw;
  cw = new bootstrap.Codewave(new TextAreaEditor.TextAreaEditor(target));

  bootstrap.Codewave.instances.push(cw);

  return cw;
};

bootstrap.Codewave.require = require;
window.Codewave = bootstrap.Codewave;

