const partial = (fn, ...args) => (...restArgs) => fn.apply(this, args.concat(restArgs));
const pipe = (...fns) => fns.reverse().reduce((res, fn) => fn(res));

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

// composition hack
Function.prototype['∘'] = function(f){
  return x => this(f(x))
}


const predicate = (...conditions) => item => conditions.every(c => c(item))

module.exports = {partial, pipe, flatten, predicate}
