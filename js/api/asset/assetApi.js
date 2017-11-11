const {partial} = require('../../common/core/fn');
const {createSimpleEndpoint, HTTP_NO_CONTENT} = require('../core/api');
const repository = require('../../common/data/repositories/assetRepository');
const {unwrapCypherResult, unwrapCypherResultToMap} = require('../../common/data/utils');
const logger = require('../../common/core/logger');

const getAsset = partial(
  createSimpleEndpoint,
  repository.getAsset,
  unwrapCypherResultToMap,
  {
    errorMessage: 'Error fetching asset  for user'
  }
)

const createAsset = partial(
  createSimpleEndpoint,
  repository.createAsset,
  unwrapCypherResult,
  {
    errorMessage: 'Error saving asset type for user:'
  }
)

const updateAsset = partial(
  createSimpleEndpoint,
  repository.updateAsset,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating asset type for user:'
  }
)

const deleteAsset = partial(
  createSimpleEndpoint,
  repository.deleteAsset,
  unwrapCypherResult,
  {
    errorMessage: 'Error deleting asset type for user',
    param: 'id',
    status: HTTP_NO_CONTENT
  }
)


module.exports = {
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset
};
