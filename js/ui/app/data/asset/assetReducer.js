import {handleActions} from 'redux-actions'
import {Map, fromJS} from 'immutable'
import identity from 'folktale/core/lambda/identity'
import {
  GET_ASSET_TYPES,
  CREATE_NEW_ASSET_TYPE,
  UPDATE_ASSET_TYPE,
  DELETE_ASSET_TYPE
} from './assetActions'
import AsyncData from '../core/AsyncData'

const handleGetAssets = (state, {payload: assetResult}) =>
  assetResult.matchWith({
    Empty: identity,
    Loading: () => state.set('fetchAssetsResult', assetResult),
    Success: ({data: {result}}) => state
      .set('fetchAssetsResult', assetResult)
      .set('assets', fromJS(result)),
    Failure: () => state.set('fetchAssetsResult', assetResult),
  });

const handleSaveAsset = (state, {payload: saveAssetResult}) =>
  saveAssetResult.matchWith({
    Empty: identity,
    Loading: () => state.set('saveAssetResult', saveAssetResult),
    Success: ({data: {result: [result]}}) => state
      .set('saveAssetResult', saveAssetResult)
      .updateIn(['assets'], assets => assets.set(result.id, fromJS(result))),
    Failure: () => state.set('saveAssetResult', saveAssetResult),
  });

const handleDeleteAsset = (state, {payload: deleteAssetResult}) =>
  deleteAssetResult.matchWith({
    Empty: identity,
    Loading: () => state.set('deleteAssetResult', deleteAssetResult),
    Success: ({data: {result}}) => state
      .set('deleteAssetResult', deleteAssetResult)
      .updateIn(['assets'], assets => assets.delete(`${result.id}`)),
    Failure: () => state.set('deleteAssetResult', deleteAssetResult),
  });

const AssetModel = Map({
  fetchAssetsResult: AsyncData.Empty(),
  saveAssetResult: AsyncData.Empty(),
  deleteAssetResult: AsyncData.Empty(),
  count: 0,
  assets: Map()
});

export default handleActions({
  [GET_ASSET_TYPES]: handleGetAssets,
  [CREATE_NEW_ASSET_TYPE]: handleSaveAsset,
  [UPDATE_ASSET_TYPE]: handleSaveAsset,
  [DELETE_ASSET_TYPE]: handleDeleteAsset
}, AssetModel)

