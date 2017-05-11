const neo4j = require('neo4j-driver').v1;
const {Map} = require('immutable');
const Maybe = require('folktale/data/maybe');
const {entries} = require('../core/utils');

// CypherResult a -> Maybe a
const unwrapCypherResult = result => {
  try {
    return Maybe.fromNullable(
      result[0]._fields.reduce((acc, field)=> {
        return [...acc, normalize(field.properties) || field]
      }, [])
    );
  }
  catch(_) {
    return Maybe.Nothing();
  }
};

// normalize the data we get from neo4j
const normalize = entity => Map(entity)
  .map(v => neo4j.isInt(v) ? getInteger(v) : v)
  .toObject();

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

