import RemoteData from '../RemoteData';

const isTask = val => val && typeof val.run === 'function';

export default ({ dispatch }) => next => action =>
    isTask(action.payload)
      ? dispatch({ ...action, payload: RemoteData.Loading }) && action.payload
        .bimap(
          error => dispatch({ ...action, payload: error, error: true }),
          result => dispatch({ ...action, payload: result })
        )
        .run()
      : next(action);
