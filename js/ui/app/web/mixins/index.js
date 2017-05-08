function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}
// ref: http://raganwald.com/2015/06/17/functional-mixins.html
export default function mixin(behaviour, sharedBehaviour = {}) {
  const instanceKeys = Reflect.ownKeys(behaviour);
  const sharedKeys = Reflect.ownKeys(sharedBehaviour);
  const typeTag = Symbol('isa');
  function _mixin(clazz) {
    for (let property of instanceKeys) {
      if (clazz.prototype.hasOwnProperty(property)) {
        Object.defineProperty(clazz.prototype, property, {
          value: createChainedFunction(clazz.prototype[property], behaviour[property]),
          writable: true
        });
      } else {
        Object.defineProperty(clazz.prototype, property, {
          value: behaviour[property],
          writable: true
        });
      }
    }
    Object.defineProperty(clazz.prototype, typeTag, {value: true});
    return clazz;
  }
  for (let property of sharedKeys) {
    Object.defineProperty(_mixin, property, {
      value: sharedBehaviour[property],
      enumerable: sharedBehaviour.propertyIsEnumerable(property)
    });
  }
  Object.defineProperty(_mixin, Symbol.hasInstance, {
    value: (i) => !!i[typeTag]
  });
  return _mixin;
};
