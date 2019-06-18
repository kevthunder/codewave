
import { Command, BaseCommand } from '../Command';
import { AlwaysEnabled } from '../detectors/AlwaysEnabled';
import * as inflection from 'inflection';

export class StringCommandProvider
 register: (root)-> 
  cmds = root.addCmd(new Command('string'))

  root.addCmd(new Command('str',{ aliasOf: 'string' }))
  root.addDetector(new AlwaysEnabled('string'))
  
  cmds.addCmds({
    'pluralize':{
      'result' : (instance) -> inflection.pluralize(instance.getParam([0,'str']))
      'allowedNamed':['str']
      'help': """
        Pluralize a string
        """
    },
    'singularize':{
      'result' : (instance) -> inflection.singularize(instance.getParam([0,'str']))
      'allowedNamed':['str']
      'help': """
        Singularize a string
        """
    },
    'camelize':{
      'result' : (instance) -> inflection.camelize(instance.getParam([0,'str']),instance.getBoolParam([1,'first']))
      'allowedNamed':['str','first']
      'help': """
        Transforms a String from underscore to camelcase
        """
    },
    'underscore':{
      'result' : (instance) -> inflection.underscore(instance.getParam([0,'str']),instance.getBoolParam([1,'upper']))
      'allowedNamed':['str','upper']
      'help': """
        Transforms a String from camelcase to underscore.
        """
    },
    'humanize':{
      'result' : (instance) -> inflection.humanize(instance.getParam([0,'str']),instance.getBoolParam([1,'first']))
      'allowedNamed':['str','first']
      'help': """
        Transforms a String to a human readable format
        """
    },
    'capitalize':{
      'result' : (instance) -> inflection.capitalize(instance.getParam([0,'str']))
      'allowedNamed':['str']
      'help': """
        Make the first letter of a string upper
        """
    },
    'dasherize':{
      'result' : (instance) -> inflection.dasherize(instance.getParam([0,'str']))
      'allowedNamed':['str']
      'help': """
        Replaces underscores with dashes in a string.
        """
    },
    'titleize':{
      'result' : (instance) -> inflection.titleize(instance.getParam([0,'str']))
      'allowedNamed':['str']
      'help': """
        Transforms a String to a human readable format with most words capitalized
        """
    },
    'tableize':{
      'result' : (instance) -> inflection.tableize(instance.getParam([0,'str']))
      'allowedNamed':['str']
      'help': """
        Transforms a String to a table format
        """
    },
    'classify':{
      'result' : (instance) -> inflection.classify(instance.getParam([0,'str']))
      'allowedNamed':['str']
      'help': """
        Transforms a String to a class format
        """
    },
  })
  