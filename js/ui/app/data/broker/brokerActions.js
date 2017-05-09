import {createAction} from 'redux-actions';
import fetch from '../../helpers/api';
import {partial} from '../../helpers/fn';

import {task} from 'folktale/data/task';

const BROKER_ENDPOINT = `${process.env.API_URL}/brokers`;

export const SAVE_NEW_BROKER = 'BROKER::SAVE_NEW_BROKER';

const saveBrokerRoot = fetch => {
  const saveBrokerRequest = partial(fetch, BROKER_ENDPOINT, 'POST');

  return createAction(
    SAVE_NEW_BROKER,
    saveBrokerRequest
  );
}

export const saveBroker = saveBrokerRoot(fetch);
