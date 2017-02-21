import { createStore, applyMiddleware } from 'redux';
import taskMiddleware from './middlewares/taskMiddleware';
import reducer from './reducer';

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(
  taskMiddleware
)(createStore);

export default function configureStore() {
  return createStoreWithMiddleware(reducer);
}
