const {task} = require('folktale/data/task');
const Result = require('folktale/data/result');
const logger = require('../core/logger');

const neo4jQueryToFuture = queryResult => task(
  async resolver => {
    try {
      const result = await queryResult;
      resolver.resolve(Result.Ok(result.records));
    }
    catch(error) {
      resolver.reject(Result.Error(error));
    }
});

const sessionUndefinedError = () => {
  const msg = 'session object is undefined';
  logger.error(msg);
  return Result.Error(msg);
};

const runQuery = (driver, query, params) =>
  neo4jQueryToFuture(
    driver
      .session()
      .run(query, params)
  )
  .bimap(
    error => {
      logger.error(`Error while runing a query: ${error}`);
      Result.Error(error);
    },
    records => Result.Ok(records)
  )
  .run()
  .future()

module.exports = {runQuery};
