import {createAction} from 'redux-actions';
import fetch from '../../helpers/api';
import {partial} from '../../helpers/fn';

import {task} from 'folktale/data/task';

const POSITION_ENDPOINT = `${process.env.API_URL}/positions`;

export const SAVE_NEW_POSITION = 'POSITION::SAVE_NEW_POSITION';

const savePositionRoot = fetch => {
  const savePositionRequest = partial(fetch, POSITION_ENDPOINT, 'POST');

  return createAction(
    SAVE_NEW_POSITION,
    savePositionRequest
  );
}

const fakeFetch = () => task(resolver => {
  setTimeout(
    () => resolver.resolve({id: 1}),
    2000
  );
});

export const savePosition = savePositionRoot(fakeFetch);
