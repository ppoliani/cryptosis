import AsyncData from '../AsyncData';

const isTask = val => val && typeof val.run === 'function';

export default ({ dispatch }) => next => action =>
    isTask(action.payload)
      ? dispatch({ ...action, payload: AsyncData.Loading() }) && action.payload
        .bimap(
          error => dispatch({ ...action, payload: AsyncData.Failure(error), error: true }),
          result => dispatch({ ...action, payload: AsyncData.Success(result) })
        )
        .run()
      : next(action);
