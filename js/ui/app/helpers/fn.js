export const pipe = (...fns) => fns.reverse().reduce((res, fn) => fn(res));
