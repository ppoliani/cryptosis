import 'babel-polyfill'
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {
  AppRegistry,
  StyleSheet
} from 'react-native'
import {StyleProvider} from 'native-base'
import getTheme from './native-base-theme/components'
import commonTheme from './native-base-theme/variables/commonColor';
import Router from './app/native/Router'
import configureStore from './app/data/'
import Layout from './app/native/layout/Layout'

const store = configureStore();

export default class Cryprosis extends Component {
  render() {
    const LayoutHOC = Layout(Router);
    return (
      <StyleProvider  style={getTheme(commonTheme)}> 
        <Provider store={store}>
          <Router />
        </Provider>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('cryptosis', () => Cryprosis)
