const Result = require('folktale/data/result');
const {of: futureOf} = require('folktale/data/future')

const asyncBindSeq = (...fns) => fns.reduce((res, fn) => asyncBind(res, fn));

// Future a b -> (a -> Result a b) -> Future a
const asyncBind = (f, next) => {
  return f.chain(result =>
    result.matchWith({
      Ok: ({value}) => futureOf(next(value)),
      Error: ({value}) => futureOf(Result.Error(value))
    })
  );
}

module.exports = {asyncBindSeq, asyncBind};
