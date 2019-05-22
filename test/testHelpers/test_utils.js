"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeTextArea = exports.createTextArea = exports.extractSelections = exports.setEditorContent = exports.assertEditorResult = void 0;

var _chai = require("chai");

var _Pos = require("../../lib/positioning/Pos");

var assertEditorResult = function (editor, res) {
  var realText, sels;
  [realText, sels] = extractSelections(res);
  (0, _chai.expect)(editor.text()).to.eql(realText);

  if (sels.length) {
    if (editor.allowMultiSelection()) {
      return (0, _chai.expect)(editor.getMultiSel().map(function (s) {
        return s.raw();
      })).to.eql(sels.map(function (s) {
        return s.raw();
      }));
    } else {
      return (0, _chai.expect)(editor.getCursorPos().raw()).to.eql(sels[0].raw());
    }
  }
};

exports.assertEditorResult = assertEditorResult;

var setEditorContent = function (editor, val) {
  var realText, sels;
  [realText, sels] = extractSelections(val);

  if (sels.length) {
    if (editor.allowMultiSelection()) {
      editor.setMultiSel(sels);
    } else {
      editor.setCursorPos(sels[0].start, sels[0].end);
    }
  }

  return editor.text(realText);
};

exports.setEditorContent = setEditorContent;

var extractSelections = function (text) {
  var finalText, match, pos, sels;
  sels = [];
  finalText = text;

  while (true) {
    if (match = finalText.match(/\|\[(.*)\]/)) {
      sels.push(new _Pos.Pos(match.index, match.index + match[1].length));
      finalText = finalText.replace(/\|\[(.*)\]/, '$1');
    } else if ((pos = finalText.indexOf('|')) > -1) {
      sels.push(new _Pos.Pos(pos));
      finalText = finalText.replace('|', '');
    } else {
      break;
    }
  }

  return [finalText, sels];
};

exports.extractSelections = extractSelections;

var createTextArea = function (id) {
  var area;
  area = document.createElement('textarea');
  area.id = id;
  return document.body.appendChild(area);
};

exports.createTextArea = createTextArea;

var removeTextArea = function (id) {
  var area;
  area = document.getElementById(id);
  return area.parentElement.removeChild(area);
};

exports.removeTextArea = removeTextArea;
//# sourceMappingURL=../maps/testHelpers/test_utils.js.map