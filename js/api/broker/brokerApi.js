const {partial} = require('../core/fn');
const {createSimpleEnpoint, HTTP_NO_CONTENT} = require('../core/api');
const repository = require('../data/brokerRepository');
const {unwrapCypherResult} = require('../data');
const logger = require('../core/logger');

const createBroker = partial(
  createSimpleEnpoint,
  repository.saveBroker,
  unwrapCypherResult,
  {
    errorMessage: 'Error saving broker for user'
  }
)

const updateBroker = partial(
  createSimpleEnpoint,
  repository.updateBroker,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating broker for user'
  }
)

const deleteBroker = partial(
  createSimpleEnpoint,
  repository.deleteBroker,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating broker for user',
    param: 'id',
    status: HTTP_NO_CONTENT
  }
)

module.exports = {createBroker, updateBroker, deleteBroker};
