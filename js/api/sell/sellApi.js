const {partial} = require('../../common/core/fn');
const {createSimpleEndpoint, HTTP_NO_CONTENT} = require('../core/api');
const repository = require('../../common/data/repositories/sellRepository');
const {unwrapCypherResult, unwrapCypherResultToMap} = require('../../common/data/utils');

const getSells = partial(
  createSimpleEndpoint,
  repository.getSells,
  unwrapCypherResultToMap,
  {
    errorMessage: 'Error fetching sells for user'
  }
)

const getSell = partial(
  createSimpleEndpoint,
  repository.getSell,
  unwrapCypherResult,
  {
    errorMessage: 'Error fetching sell for user',
    param: 'id'
  }
)

const createSell = partial(
  createSimpleEndpoint,
  repository.createSell,
  unwrapCypherResult,
  {
    errorMessage: 'Error creating new sell for user'
  }
)

const updateSell = partial(
  createSimpleEndpoint,
  repository.updateSell,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating sell for user'
  }
)

const deleteSell = partial(
  createSimpleEndpoint,
  repository.deleteSell,
  unwrapCypherResult,
  {
    errorMessage: 'Error deleting sell for user',
    param: 'id',
    status: HTTP_NO_CONTENT
  }
)

module.exports = {
  getSells,
  getSell,
  createSell,
  updateSell,
  deleteSell
}
