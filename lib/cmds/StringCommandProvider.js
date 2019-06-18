"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringCommandProvider = void 0;

var _Command = require("../Command");

var _AlwaysEnabled = require("../detectors/AlwaysEnabled");

var inflection = _interopRequireWildcard(require("inflection"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var StringCommandProvider = class StringCommandProvider {
  register(root) {
    var cmds;
    cmds = root.addCmd(new _Command.Command('string'));
    root.addCmd(new _Command.Command('str', {
      aliasOf: 'string'
    }));
    root.addDetector(new _AlwaysEnabled.AlwaysEnabled('string'));
    return cmds.addCmds({
      'pluralize': {
        'result': function (instance) {
          return inflection.pluralize(instance.getParam([0, 'str']));
        },
        'allowedNamed': ['str'],
        'help': "Pluralize a string"
      },
      'singularize': {
        'result': function (instance) {
          return inflection.singularize(instance.getParam([0, 'str']));
        },
        'allowedNamed': ['str'],
        'help': "Singularize a string"
      },
      'camelize': {
        'result': function (instance) {
          return inflection.camelize(instance.getParam([0, 'str']), instance.getBoolParam([1, 'first']));
        },
        'allowedNamed': ['str', 'first'],
        'help': "Transforms a String from underscore to camelcase"
      },
      'underscore': {
        'result': function (instance) {
          return inflection.underscore(instance.getParam([0, 'str']), instance.getBoolParam([1, 'upper']));
        },
        'allowedNamed': ['str', 'upper'],
        'help': "Transforms a String from camelcase to underscore."
      },
      'humanize': {
        'result': function (instance) {
          return inflection.humanize(instance.getParam([0, 'str']), instance.getBoolParam([1, 'first']));
        },
        'allowedNamed': ['str', 'first'],
        'help': "Transforms a String to a human readable format"
      },
      'capitalize': {
        'result': function (instance) {
          return inflection.capitalize(instance.getParam([0, 'str']));
        },
        'allowedNamed': ['str'],
        'help': "Make the first letter of a string upper"
      },
      'dasherize': {
        'result': function (instance) {
          return inflection.dasherize(instance.getParam([0, 'str']));
        },
        'allowedNamed': ['str'],
        'help': "Replaces underscores with dashes in a string."
      },
      'titleize': {
        'result': function (instance) {
          return inflection.titleize(instance.getParam([0, 'str']));
        },
        'allowedNamed': ['str'],
        'help': "Transforms a String to a human readable format with most words capitalized"
      },
      'tableize': {
        'result': function (instance) {
          return inflection.tableize(instance.getParam([0, 'str']));
        },
        'allowedNamed': ['str'],
        'help': "Transforms a String to a table format"
      },
      'classify': {
        'result': function (instance) {
          return inflection.classify(instance.getParam([0, 'str']));
        },
        'allowedNamed': ['str'],
        'help': "Transforms a String to a class format"
      }
    });
  }

};
exports.StringCommandProvider = StringCommandProvider;
//# sourceMappingURL=../maps/cmds/StringCommandProvider.js.map
