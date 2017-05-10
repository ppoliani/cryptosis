const neo4j = require('neo4j-driver').v1;
const Maybe = require('folktale/data/maybe');
const {entries} = require('../core/utils');

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

// creates a string that will be used in Cypher
const createMatchString = entity =>
  [...entries(entity)]
      .reduce((acc, [key]) => [...acc, `${key}:{${key}}`], []);

const createMatchObj = entity =>
  [...entries(entity)]
    .reduce(
      (acc, [key, value]) => {
        acc[key] = Number.isInteger(value)
          ? neo4j.int(value)
          : value;

          return acc;
      },
      {}
    );

const contructCreateMatchString = entity =>
  [
    '{',
    createMatchString(entity).join(','),
    ',created:timestamp(),updated:timestamp()',
    '}'
  ]
  .join('')

const contructUpdateMatchString = entity =>
  [
    '{',
    createMatchString(entity).join(','),
    ',updated:timestamp()',
    '}'
  ]
  .join('')

const getInteger = int => int.toNumber();

module.exports = {
  unwrapCypherResult,
  contructCreateMatchString,
  contructUpdateMatchString,
  createMatchObj,
  getInteger
};

