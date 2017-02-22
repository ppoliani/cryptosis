import RemoteData from '../RemoteData';

const isTask = val => val && typeof val.run === 'function';

export default ({ dispatch }) => next => action =>
    isTask(action.payload)
      ? dispatch({ ...action, payload: RemoteData.Loading }) && action.payload
        .bimap(
          error => dispatch({ ...action, payload: RemoteData.Failure(error), error: true }),
          result => dispatch({ ...action, payload: RemoteData.Success(result) })
        )
        .run()
      : next(action);
