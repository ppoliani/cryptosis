/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import 'babel-polyfill';
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import configureStore from './app/data/';
import Router from './app/native/Router';

export default class Bartr extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <View style={styles.container}>
          <Router />
        </View>
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

AppRegistry.registerComponent('bartr', () => Bartr);
