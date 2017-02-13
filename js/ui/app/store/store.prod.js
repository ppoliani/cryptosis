import { createStore, applyMiddleware } from 'redux';
import futureMiddleware from 'redux-future';
import reducer from './reducer';

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(
  futureMiddleware
)(createStore);

export default function configureStore() {
  return createStoreWithMiddleware(reducer);
}
