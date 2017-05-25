export const partial = (fn, ...args) => (...restArgs) => fn.apply(this, args.concat(restArgs));
export const pipe = (...fns) => fns.reverse().reduce((res, fn) => fn(res));

export const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);
