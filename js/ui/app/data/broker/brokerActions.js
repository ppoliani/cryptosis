import {createAction} from 'redux-actions';
import compose from 'folktale/core/lambda/compose';
import {Map} from 'immutable';
import fetch, {constructUrl} from '../../helpers/api';
import {partial} from '../../helpers/fn';

import {task} from 'folktale/data/task';

const BROKER_ENDPOINT = `${process.env.API_URL}/brokers`;

export const GET_BROKERS = 'BROKER::GET_BROKERS';
export const SAVE_NEW_BROKER = 'BROKER::SAVE_NEW_BROKER';
export const UPDATE_BROKER = 'BROKER::UPDATE_BROKER';

const getBrokersRoot = fetch => {
  const getUrl = ({skip, limit}) => constructUrl(BROKER_ENDPOINT, Map({skip, limit}));
  const fetchData = compose(partial(fetch, 'GET'), getUrl);

  return createAction(
    GET_BROKERS,
    fetchData
  );
};

const saveBrokerRoot = fetch => {
  const saveBrokerRequest = partial(fetch, 'POST', BROKER_ENDPOINT);

  return createAction(
    SAVE_NEW_BROKER,
    saveBrokerRequest
  );
}

const updateBrokerRoot = fetch => {
  const getUrl = broker => `${BROKER_ENDPOINT}/${broker.id}`;
  const fetchData = broker => fetch('PUT', getUrl(broker), broker);

  return createAction(
    UPDATE_BROKER,
    fetchData
  );
}

export const getBrokers = getBrokersRoot(fetch);
export const saveBroker = saveBrokerRoot(fetch);
export const updateBroker = updateBrokerRoot(fetch);

