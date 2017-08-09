import {createAction} from 'redux-actions'
import {Map} from 'immutable'
import fetch, {constructUrl} from '../../services/api'
import {partial} from '../../../../common/core/fn'
import {task} from 'folktale/concurrency/task'

export const GET_BROKERS = 'BROKER::GET_BROKERS'
export const SAVE_NEW_BROKER = 'BROKER::SAVE_NEW_BROKER'
export const UPDATE_BROKER = 'BROKER::UPDATE_BROKER'
export const DELETE_BROKER = 'BROKER::DELETE_BROKER'

const BROKER_ENDPOINT = `${process.env.API_URL}/brokers`;

const getUrl = broker => `${BROKER_ENDPOINT}/${broker.get('id')}`;

const getBrokersRoot = fetch => {
  const getUrl = ({skip, limit}) => constructUrl(BROKER_ENDPOINT, Map({skip, limit}));
  const fetchData = (partial(fetch, 'GET')) ['∘'] (getUrl);

  return createAction(
    GET_BROKERS,
    fetchData
  );
}

const saveBrokerRoot = fetch => {
  const saveBrokerRequest = partial(fetch, 'POST', BROKER_ENDPOINT);

  return createAction(
    SAVE_NEW_BROKER,
    saveBrokerRequest
  );
}

const updateBrokerRoot = fetch => {
  const fetchData = broker => fetch('PUT', getUrl(broker), broker);

  return createAction(
    UPDATE_BROKER,
    fetchData
  );
}

const deleteBrokerRoot = fetch => {
  const fetchData = broker => fetch('DELETE', getUrl(broker), broker.toJS());

  return createAction(
    DELETE_BROKER,
    fetchData
  );
}

export const getBrokers = getBrokersRoot(fetch)
export const saveBroker = saveBrokerRoot(fetch)
export const updateBroker = updateBrokerRoot(fetch)
export const deleteBroker = deleteBrokerRoot(fetch)

