const neo4j = require('neo4j-driver').v1;
const logger = require('../core/logger');

const initDB = () =>
  new Promise((resolve, reject) => {
    try{
      const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic(process.env.DB_USERNAME, process.env.DB_PASSWORD));
      resolve(driver);

      driver.onCompleted = function(error) {
        // TODO: this seems to be invoked after a successful query execution
        logger.info(`Connected to the db`);
      };

      driver.onError = function(error) {
        logger.error(`Driver instantiation failed: ${error}`);
      };

    }
    catch(error) {
      reject(error);
    }
  });

module.exports = {initDB};
