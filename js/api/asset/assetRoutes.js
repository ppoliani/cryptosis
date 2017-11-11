const {
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset
} = require('./assetApi');

const routes = {
  '/assets': {
    method: 'get',
    auth: true,
    fn: getAsset
  },

  '/assets$': {
    method: 'post',
    auth: true,
    fn: createAsset
  },

'/assets/:id': {
    method: 'put',
    auth: true,
    fn: updateAsset
  },

  '/assets/:id$': {
    method: 'delete',
    auth: true,
    fn: deleteAsset
  }
};

module.exports = routes;
