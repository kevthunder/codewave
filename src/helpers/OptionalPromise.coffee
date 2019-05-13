
export class OptionalPromise
    constructor: (@val) ->
        if @val.then? and @val.result?
            @val = @val.result()
    then: (cb) ->
        if @val.then?
            new OptionalPromise(@val.then(cb))
        else
            new OptionalPromise(cb(@val))
    result: ->
        @val

export optionalPromise = (val)-> 
    new OptionalPromise(val)


