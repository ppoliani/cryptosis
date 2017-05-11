import {createAction} from 'redux-actions';
import compose from 'folktale/core/lambda/compose';
import {Map} from 'immutable';
import fetch, {constructUrl} from '../../helpers/api';
import {partial} from '../../helpers/fn';

import {task} from 'folktale/data/task';

const BROKER_ENDPOINT = `${process.env.API_URL}/brokers`;

export const GET_BROKERS = 'BROKER::GET_BROKERS';
export const SAVE_NEW_BROKER = 'BROKER::SAVE_NEW_BROKER';

const getBrokersRoot = fetch => {
  const getUrl = ({skip, limit}) => constructUrl(BROKER_ENDPOINT, Map({skip, limit}));
  const fetchData = compose(fetch, getUrl);

  return createAction(
    GET_BROKERS,
    fetchData
  );
};

const saveBrokerRoot = fetch => {
  const saveBrokerRequest = partial(fetch, BROKER_ENDPOINT, 'POST');

  return createAction(
    SAVE_NEW_BROKER,
    saveBrokerRequest
  );
}

export const saveBroker = saveBrokerRoot(fetch);
export const getBrokers = getBrokersRoot(fetch);
