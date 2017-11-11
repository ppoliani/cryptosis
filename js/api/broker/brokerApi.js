const {partial} = require('../../common/core/fn');
const {createSimpleEndpoint, HTTP_NO_CONTENT} = require('../core/api');
const repository = require('../../common/data/repositories/brokerRepository');
const {unwrapCypherResult, unwrapCypherResultToMap} = require('../../common/data/utils');

const getBrokers = partial(
  createSimpleEndpoint,
  repository.getBrokers,
  unwrapCypherResultToMap,
  {
    errorMessage: 'Error fetching brokers for user'
  }
)

const createBroker = partial(
  createSimpleEndpoint,
  repository.createBroker,
  unwrapCypherResult,
  {
    errorMessage: 'Error saving broker for user'
  }
)

const updateBroker = partial(
  createSimpleEndpoint,
  repository.updateBroker,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating broker for user'
  }
)

const deleteBroker = partial(
  createSimpleEndpoint,
  repository.deleteBroker,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating broker for user',
    param: 'id',
    status: HTTP_NO_CONTENT
  }
)

module.exports = {
  getBrokers,
  createBroker,
  updateBroker,
  deleteBroker
}
