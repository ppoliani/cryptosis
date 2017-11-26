const {create} = require('@most/create');

const partial = (fn, ...args) => (...restArgs) => fn.apply(this, args.concat(restArgs));
const pipe = (...fns) => fns.reverse().reduce((res, fn) => fn(res));
const noop = () => {};
const prop = key => obj => obj[key];
const True = () => true;
const False = () => false;
const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

// composition hack
Function.prototype['∘'] = function(f) {
  return x => this(f(x))
}

const debouncedCallback = (callback, time) => (...args) =>
  create((add, end, error) => add(...args))
  .debounce(time)
  .skipRepeats()
  .observe(callback);

const every = (...conditions) => item => conditions.every(c => c(item))

module.exports = {partial, pipe, prop, flatten, every, noop, True, False, debouncedCallback}
