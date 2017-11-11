import {createAction} from 'redux-actions'
import {map} from 'folktale/core/lambda'
import {Map} from 'immutable'
import fetch, {constructUrl} from '../../services/api'
import {partial} from '../../../../common/core/fn'
import config from '../../services/config'

const ASSET_ENDPOINT = `${config.API_URL}/assets`;

export const GET_ASSET_TYPES = 'ASSET::GET_ASSET_TYPES'
export const CREATE_NEW_ASSET_TYPE = 'ASSET::CREATE_NEW_ASSET_TYPE'
export const UPDATE_ASSET_TYPE = 'ASSET::UPDATE_ASSET_TYPE'
export const DELETE_ASSET_TYPE = 'ASSET::DELETE_ASSET_TYPE'

const getAssetUrl = asset => `${ASSET_ENDPOINT}/${asset.get('id')}`;

const getAssetsRoot = fetch => {
  const getUrl = ({skip, limit} = {}) => constructUrl(ASSET_ENDPOINT, Map({skip, limit}));
  const fetchData = (partial(fetch, 'GET')) ['∘'] (getUrl);

  return createAction(
    GET_ASSET_TYPES,
    fetchData
  );
}

const createNewAssetRoot = fetch => {
  const createAssetResult = partial(fetch, 'POST', ASSET_ENDPOINT);

  return createAction(
    CREATE_NEW_ASSET_TYPE,
    createAssetResult
  );
}

const updateAssetRoot = fetch => {
  const fetchData = asset => fetch('PUT', getAssetUrl(asset), asset);

  return createAction(
    UPDATE_ASSET_TYPE,
    fetchData
  );
}

const deleteAssetRoot = fetch => {
  const fetchData = asset => fetch('DELETE', getAssetUrl(asset), asset.toJS());

  return createAction(
    DELETE_ASSET_TYPE,
    fetchData
  );
}

export const getAssets = getAssetsRoot(fetch)
export const createNewAsset = createNewAssetRoot(fetch)
export const updateAsset = updateAssetRoot(fetch)
export const deleteAsset = deleteAssetRoot(fetch)
