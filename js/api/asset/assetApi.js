const {partial} = require('../../common/core/fn');
const {createSimpleEndpoint, HTTP_NO_CONTENT} = require('../core/api');
const repository = require('../../common/data/repositories/assetRepository');
const {unwrapCypherResult, unwrapCypherResultToMap} = require('../../common/data/utils');
const logger = require('../../common/core/logger');

const getAssetTypes = partial(
  createSimpleEndpoint,
  repository.getAssetTypes,
  unwrapCypherResultToMap,
  {
    errorMessage: 'Error fetching asset types for user'
  }
)

const createAssetType = partial(
  createSimpleEndpoint,
  repository.createAssetType,
  unwrapCypherResult,
  {
    errorMessage: 'Error saving asset type for user:'
  }
)

const updateAssetType = partial(
  createSimpleEndpoint,
  repository.updateAssetType,
  unwrapCypherResult,
  {
    errorMessage: 'Error updating asset type for user:'
  }
)

const deleteAssetType = partial(
  createSimpleEndpoint,
  repository.deleteAssetType,
  unwrapCypherResult,
  {
    errorMessage: 'Error deleting asset type for user',
    param: 'id',
    status: HTTP_NO_CONTENT
  }
)


module.exports = {
  getAssetTypes,
  createAssetType,
  updateAssetType,
  deleteAssetType
};
