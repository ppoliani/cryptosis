const logger = require('../core/logger');

const runQuery = async (driver, query, params) => {
  try {
    const result = await driver
      .session()
      .run(query, params);

    return result;
  }
  catch(error) {
    const msg = `Error running a query: ${error.message}`;
    logger.error(msg);
    throw new Error(msg);
  }
}

module.exports = {runQuery};
