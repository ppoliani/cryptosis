const {initDB} = require('./db');
const repositories = [
  require('./accountRepository')
];

const initRepositories = session => repositories.map(r => r.init(session));

module.exports = {initDB, initRepositories};
