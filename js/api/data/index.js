const {initDB} = require('./db');

const repositories = [
  require('./accountRepository')
];

const unwrapCypherResult = result => {
  return result[0]._fields[0].properties || result[0]._fields[0];
};

const initRepositories = session => repositories.map(r => r.init(session));

module.exports = {initDB, initRepositories, unwrapCypherResult};
