import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import configureStore from '../data/';

import './index.html';
import './app.css';

injectTapEventPlugin();



ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <Provider store={configureStore()}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
