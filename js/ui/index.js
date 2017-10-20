import 'babel-polyfill'
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {
  AppRegistry,
  StyleSheet
} from 'react-native'
import {Container} from 'native-base'
import Router from './app/native/Router'
import configureStore from './app/data/'
import Layout from './app/native/layout/Layout'

const store = configureStore();

export default class Cryprosis extends Component {
  render() {
    const LayoutHOC = Layout(Router);
    return (
      <Provider store={store}>
        <Router />
      </Provider>
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
