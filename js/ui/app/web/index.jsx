import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';

import App from './App';
import configureStore from '../data/';

import './index.html';

ReactDOM.render(
    <Provider store={configureStore()}>
      <App />
    </Provider>,
  document.getElementById('root')
);
