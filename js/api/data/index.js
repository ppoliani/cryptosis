const Maybe = require('folktale/data/maybe');
const {initDB} = require('./db');

const repositories = [
  require('./accountRepository'),
  require('./brokerRepository'),
  require('./investmentRepository')
];

// CypherResult a -> Maybe a
const unwrapCypherResult = result => {
  try {
    return Maybe.fromNullable(
      result[0]._fields.reduce((acc, field)=> {
        return [...acc, field.properties || field]
      }, [])
    );
  }
  catch(_) {
    return Maybe.Nothing();
  }
};

const initRepositories = session => repositories.map(r => r.init(session));

module.exports = {initDB, initRepositories, unwrapCypherResult};
