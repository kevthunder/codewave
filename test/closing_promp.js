"use strict";

var _chai = require("chai");

var _bootstrap = require("../lib/bootstrap");

var _Logger = require("../lib/Logger");

var _TestEditor = require("./testHelpers/TestEditor");

var _TextParser = require("../lib/TextParser");

var _test_utils = require("./testHelpers/test_utils");

describe('ClosingPromp', function () {
  beforeEach(function () {
    _Logger.Logger.enabled = false;
    return this.codewave = new _bootstrap.Codewave(new _TestEditor.TestEditor());
  });
  afterEach(function () {
    return delete this.codewave;
  });
  it('should add listener', function () {
    (0, _chai.expect)(this.codewave.editor.changeListeners).property('length', 0);
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      return (0, _chai.expect)(this.codewave.editor.changeListeners).property('length', 1);
    });
  });
  it('should create ref in Codewave obj', function () {
    (0, _chai.expect)(this.codewave.editor.changeListeners).property('length', 0);
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      return (0, _chai.expect)(this.codewave.closingPromp).to.exist;
    });
  });
  it('should remove ref when stopping', function () {
    (0, _chai.expect)(this.codewave.editor.changeListeners).property('length', 0);
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      (0, _chai.expect)(this.codewave.closingPromp).to.exist;
      this.codewave.closingPromp.stop();
      return (0, _chai.expect)(this.codewave.closingPromp).to.not.exist;
    });
  });
  it('should remove listener when stopping', function () {
    (0, _chai.expect)(this.codewave.editor.changeListeners).property('length', 0);
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      (0, _chai.expect)(this.codewave.editor.changeListeners).property('length', 1);
      this.codewave.closingPromp.stop();
      return (0, _chai.expect)(this.codewave.editor.changeListeners).property('length', 0);
    });
  });
  it('should create 2 selections', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
    });
  });
  it('should revert when empty', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      return this.codewave.onActivationKey();
    }).then(() => {
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '|[lorem ipsum]');
    });
  });
  it('ref should stay the same', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      var closingPromp;
      closingPromp = this.codewave.closingPromp;
      (0, _chai.expect)(closingPromp).property('nbChanges', 0);
      (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, _test_utils.setEditorContent)(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~');
      this.codewave.editor.onAnyChange();
      return (0, _chai.expect)(this.codewave.closingPromp).to.eql(closingPromp);
    });
  });
  it('should react to change', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      var closingPromp;
      closingPromp = this.codewave.closingPromp;
      (0, _chai.expect)(closingPromp).property('nbChanges', 0);
      (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, _test_utils.setEditorContent)(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~');
      this.codewave.editor.onAnyChange();
      return (0, _chai.expect)(closingPromp).property('nbChanges', 1);
    });
  });
  it('should keep going after one letter', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      var closingPromp;
      closingPromp = this.codewave.closingPromp;
      (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, _test_utils.setEditorContent)(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/e|~~');
      this.codewave.editor.onAnyChange();
      return (0, _chai.expect)(closingPromp).to.exist;
    });
  });
  it('should detect typed text', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      var closingPromp;
      closingPromp = this.codewave.closingPromp;
      (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, _test_utils.setEditorContent)(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/test|~~');
      this.codewave.editor.onAnyChange();
      return (0, _chai.expect)(closingPromp.typed()).to.eql('test');
    });
  });
  it('should stop after space', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      var closingPromp;
      closingPromp = this.codewave.closingPromp;
      (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, _test_utils.setEditorContent)(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~');
      this.codewave.editor.onAnyChange();
      (0, _chai.expect)(closingPromp.shouldStop()).to.eql(true);
      return (0, _chai.expect)(closingPromp).property('started', false);
    });
  });
  return it('should remove space after stop', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      var closingPromp;
      closingPromp = this.codewave.closingPromp;
      (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, _test_utils.setEditorContent)(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test |~~');
      this.codewave.editor.onAnyChange();
      (0, _chai.expect)(closingPromp).property('started', false);
      return (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~');
    });
  });
});
describe.skip('SimulatedClosingPromp', function () {
  beforeEach(function () {
    _Logger.Logger.enabled = false;
    return this.codewave = new _bootstrap.Codewave(new _TextParser.TextParser());
  });
  afterEach(function () {
    return delete this.codewave;
  });
  it('should react to change', function (done) {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      var closingPromp;
      closingPromp = this.codewave.closingPromp;
      (0, _chai.expect)(closingPromp).property('nbChanges', 0);
      (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, _test_utils.setEditorContent)(this.codewave.editor, '~~e|~~\nlorem ipsum\n~~/~~');

      this.codewave.editor.onSkipedChange = () => {
        this.codewave.editor.onAnyChange();
        (0, _chai.expect)(closingPromp).property('nbChanges', 1);
        return done();
      };

      return this.codewave.editor.onAnyChange();
    });
  });
  it('should replicate changes', function (done) {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      var closingPromp;
      closingPromp = this.codewave.closingPromp;
      (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, _test_utils.setEditorContent)(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/~~');

      this.codewave.editor.onSkipedChange = () => {
        return this.codewave.editor.onAnyChange();
      };

      closingPromp.onTypeSimulated = () => {
        (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~test|~~\nlorem ipsum\n~~/test~~');
        return done();
      };

      return this.codewave.editor.onAnyChange();
    });
  });
  return it('should stop after space', function () {
    (0, _test_utils.setEditorContent)(this.codewave.editor, '|[lorem ipsum]');
    return this.codewave.onActivationKey().then(() => {
      var closingPromp;
      closingPromp = this.codewave.closingPromp;
      (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~|~~\nlorem ipsum\n~~/|~~');
      (0, _test_utils.setEditorContent)(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/~~');

      this.codewave.editor.onSkipedChange = () => {
        return this.codewave.editor.onAnyChange();
      };

      closingPromp.onTypeSimulated = () => {
        (0, _test_utils.assertEditorResult)(this.codewave.editor, '~~test |~~\nlorem ipsum\n~~/test~~');
        (0, _chai.expect)(closingPromp).property('started', false);
        return done();
      };

      return this.codewave.editor.onAnyChange();
    });
  });
});
//# sourceMappingURL=maps/closing_promp.js.map
