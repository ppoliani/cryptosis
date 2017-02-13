import { createStore, applyMiddleware, compose } from 'redux';
import futureMiddleware from 'redux-future';
import state from './state';
import reducer from './reducer';

const createDevStoreWithMiddleware = applyMiddleware(
  futureMiddleware
)(createStore);

const configureStore = () => {
  const store = createDevStoreWithMiddleware(reducer, state, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

  // enable webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}


export default configureStore;
