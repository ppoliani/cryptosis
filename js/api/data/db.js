const neo4j = require('neo4j-driver').v1;
const {task} = require('folktale/data/task');

const initDB = () =>
  task(resolver => {
    try{
      const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic(process.env.DB_USERNAME, process.env.DB_PASSWORD));
      resolver.resolve(driver);
    }
    catch(error) {
      resolver.reject(error);
    }
  });

module.exports = {initDB};
