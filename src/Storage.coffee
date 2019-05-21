
import { Logger } from './Logger';

export class Storage
  constructor: (@engine) ->

  save: (key,val) ->
    if @engineAvailable()
      @engine.save(key,val)

  saveInPath: (path, key, val) ->
    if @engineAvailable()
      @engine.saveInPath(path, key, val)

  load: (key) ->
    if @engine?
      @engine.load(key)

  engineAvailable: () ->
    if @engine?
      true
    else
      @logger = @logger || new Logger()
      @logger.log('No storage engine available')
      false
    