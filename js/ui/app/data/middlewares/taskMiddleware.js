import { isFSA } from 'flux-standard-action';

const isTask = val => val && typeof val.run === 'function';

export default ({ dispatch }) => next => action =>
    isTask(action.payload)
      ? action.payload
        .bimap(
          error => dispatch({ ...action, payload: error, error: true }),
          result => dispatch({ ...action, payload: result })
        )
        .run()
      : next(action);
