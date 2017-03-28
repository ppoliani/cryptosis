const Result = require('folktale/data/result');
const {of: futureOf} = require('folktale/data/future')
const Future = require('folktale/data/future/_future')

const asyncBindSeq = (...fns) => fns.reduce((res, fn) => asyncBind(res, fn));

// Future a b -> (a -> Result a b) -> Future a
const asyncBind = (f, next) => {
  return f.chain(result => {
    if(result instanceof Future) {
      return result.bimap(
        ({value: error}) => {
          return Result.Error(error.message)
        },
        result => {
          return futureOf(next(result))
        }
      );
    }

    return result.matchWith({
      Ok: ({value}) => futureOf(next(value)),
      Error: ({value}) => futureOf(Result.Error(value))
    })
  });
}

module.exports = {asyncBindSeq, asyncBind};
