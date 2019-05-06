export class CommonHelper

  @merge: (xs...) ->
    if xs?.length > 0
      @tap {}, (m) -> m[k] = v for k, v of x for x in xs
 
  @tap: (o, fn) -> 
    fn(o)
    o

  @applyMixins(derivedCtor, baseCtors) -> 
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}

)
