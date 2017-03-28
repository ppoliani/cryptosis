const neo4j = require('neo4j-driver').v1;

const initDB = () =>
  new Promise((resolve, reject) => {
    try{
      const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic(process.env.DB_USERNAME, process.env.DB_PASSWORD));
      resolve(driver);
    }
    catch(error) {
      reject(error);
    }
  });

module.exports = {initDB};
