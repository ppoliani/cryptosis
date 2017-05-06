import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import withTheme from 'material-ui/styles/withTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Router from './core/Router';
import configureStore from '../data/';

import './index.html';
import './app.scss';

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider muiTheme={withTheme()}>
    <Provider store={configureStore()}>
      <Router />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
