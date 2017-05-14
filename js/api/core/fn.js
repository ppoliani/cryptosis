const partial = (fn, ...args) => (...restArgs) => fn.apply(this, args.concat(restArgs));
const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);
module.exports = {partial, flatten};
