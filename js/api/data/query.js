const logger = require('../core/logger');

const runQuery = async (driver, query, params) => {
  let session;

  try {
    session = driver.session();
    const result = await session.run(query, params);

    return result.records;
  }
  catch(error) {
    const msg = `Error running a query: ${error.message}`;
    logger.error(msg);
    throw new Error(msg);
  }
  finally {
    session.close();
  }
}

module.exports = {runQuery};
