const {
  getAssetTypes,
  createAssetType,
  updateAssetType,
  deleteAssetType
} = require('./assetApi');

const routes = {
  '/assets/types': {
    method: 'get',
    auth: true,
    fn: getAssetTypes
  },

  '/assets/types$': {
    method: 'post',
    auth: true,
    fn: createAssetType
  },

  '/assets/types/:id': {
    method: 'put',
    auth: true,
    fn: updateAssetType
  },

  '/assets/types/:id$': {
    method: 'delete',
    auth: true,
    fn: deleteAssetType
  }
};

module.exports = routes;
