const test = require('ava');
const {unwrapCypherResult} = require('./utils');

test('unwrapCypherResult should return Nothing if is an empty array', t => {
  unwrapCypherResult([]).matchWith({
    Nothing: () => t.truthy(true)
  });
});

test('unwrapCypherResult should return Nothing if result is undefined', t => {
  unwrapCypherResult().matchWith({
    Nothing: () => t.truthy(true)
  })
});

test('unwrapCypherResult should return Nothing if array has not fields property', t => {
  unwrapCypherResult([{}]).matchWith({
    Nothing: () => t.truthy(true)
  });
});

test('unwrapCypherResult should return Just if fields exist and its an empty array', t => {
  unwrapCypherResult([{ _fields: [] }]).matchWith({
    Just: ({value}) => t.deepEqual(value.toJS(), [])
  });
});

test('unwrapCypherResult should return Just including the properties of the fields', t => {
  unwrapCypherResult([{ _fields: [{ properties: {name: 'pavlos'} }] }]).matchWith({
    Just: ({value}) => t.deepEqual(value.toJS(), [{ 'name': 'pavlos' }])
  });
});
