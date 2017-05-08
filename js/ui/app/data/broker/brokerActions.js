import {createAction} from 'redux-actions';
import fetch from '../../helpers/api';
import {partial} from '../../helpers/fn';

const BROKER_ENDPOINT = `${process.env.API_URL}/brokers`;

export const SAVE_NEW_BROKER = 'BROKER::SAVE_NEW_BROKER';

const saveNewBrokerRoot = (fetch, data) => createAction(
  SAVE_NEW_BROKER,
  fetch(data)
);

export const saveNewBroker = partial(saveNewBrokerRoot, fetch);
