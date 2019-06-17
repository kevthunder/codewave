import { Context } from './Context';

export class EscapeContext extends Context
  onChar: (char)->
    @parent.content += char
    @end()

  @test: (char)->
    char == '\\'