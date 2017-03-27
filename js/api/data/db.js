const neo4j = require('neo4j-driver').v1;
const {task} = require('folktale/data/task');

const init = () =>
  task(resolver => {
    try{
      const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic('asddas', process.env.DB_PASSWORD));
      const session = driver.session();

      resolver.resolve();
    }
    catch(error) {
      resolver.reject(error);
    }
  });

module.exports = {init};
