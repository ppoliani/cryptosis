const neo4j = require('neo4j-driver').v1
const {Map, List, fromJS} = require('immutable')
const omit = require('lodash.omit')
const Maybe = require('folktale/data/maybe')
const {flatten} = require('../core/fn')
const {entries} = require('../core/utils')

// CypherResult a -> Maybe a
const unwrapCypherResult = result => result && result[0]
  ? unwrapCypherListNodeResult(result[0]._fields)
  : Maybe.Nothing();

const unwrapCypherListNodeResult = fields => {
  try {
    return Maybe.fromNullable(
      fields.reduce((acc, field)=> acc.push(unwrapCypherNodeResult(field)), List())
    );
  }
  catch(_) {
    return Maybe.Nothing();
  }
}

const unwrapCypherNodeResult = field => normalize(field.properties || field);

// same as above but return a Map instead
const unwrapCypherResultToMap = records => {
  try {
    return Maybe.fromNullable(
      flatten(records.map(r => r._fields))
        .reduce(
          (acc, field) => acc.set(getInteger(field.id), unwrapCypherNodeResult(field)),
          Map()
        )
    );
  }
  catch(_) {
    return Maybe.Nothing();
  }
};

// normalize the data we get from neo4j
const normalize = entity => typeof(entity) === 'object'
  ? Map(entity)
    .map(v => neo4j.isInt(v) ? getInteger(v) : v)
  : entity;

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


const constructFilters = (node, filters=[]) => {
  const str = fromJS(filters)
    .reduce((acc, value, filter) => 
      acc.push(`${node}.${filter} =~ '.*${value}.*'`),
      List()
    )
    .join(' AND ');

    return str ? `WHERE ${str}` : '';
}

const contructCreateMatchString = (entity, omitProps=[]) =>
  [
    '{',
    createMatchString(omit(entity, omitProps)).join(','),
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
  unwrapCypherListNodeResult,
  unwrapCypherNodeResult,
  unwrapCypherResult,
  unwrapCypherResultToMap,
  contructCreateMatchString,
  contructUpdateMatchString,
  constructFilters,
  createMatchObj,
  getInteger
};

