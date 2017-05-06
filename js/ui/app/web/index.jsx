import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/theme';
import createPalette from 'material-ui/styles/palette';
import {blue, pink} from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Router from './core/Router';
import configureStore from '../data/';

import './index.html';
import './app.scss';

injectTapEventPlugin();

const palette = createPalette({
  primary: blue,
  accent: pink,
  type: 'dark',
});

ReactDOM.render(
  <MuiThemeProvider theme={createMuiTheme({ palette })}>
    <Provider store={configureStore()}>
      <Router />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
