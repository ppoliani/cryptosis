import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {cyan500} from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Router from './core/Router';
import configureStore from '../core/data/';

import './index.html';
import './app.scss';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    textColor: cyan500,
  },
  appBar: {
    height: 50,
  },
});

ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <Provider store={configureStore()}>
      <Router />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
