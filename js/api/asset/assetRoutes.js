const {
  getAssetTypes,
  createAssetType,
  updateAssetType,
  deleteAssetType
} = require('./assetApi');

const routes = {
  '/assets/types': {
    method: 'get',
    // auth: true,
    fn: getAssetTypes
  },

  '/assets/types$': {
    method: 'post',
    // auth: true,
    fn: createAssetType
  },

  '/assets/types$$': {
    method: 'put',
    // auth: true,
    fn: updateAssetType
  },

  '/assets/types/:id$': {
    method: 'delete',
    // auth: true,
    fn: deleteAssetType
  }
  // '/assets/partial': {
  //   method: 'get',
  //   auth: true,
  //   fn: getPartialassets
  // },

  // '/assets': {
  //   method: 'get',
  //   auth: true,
  //   fn: getAssets
  // },

  // '/assets/count': {
  //   method: 'get',
  //   auth: true,
  //   fn: getAssetCount
  // },

  // '/assets/:id': {
  //   method: 'get',
  //   auth: true,
  //   fn: getAsset
  // },

  // '/assets$': {
  //   method: 'post',
  //   auth: true,
  //   fn: createAsset
  // },

  // '/assets/:id$': {
  //   method: 'put',
  //   auth: true,
  //   fn: updateAsset
  // },

  // '/assets/:id$$': {
  //   method: 'delete',
  //   auth: true,
  //   fn: deleteInvestment
  // },
};

module.exports = routes;
