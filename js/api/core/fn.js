const partial = (fn, ...args) => (...restArgs) => fn.apply(this, args.concat(restArgs));

module.exports = {partial};
