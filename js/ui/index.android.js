import 'babel-polyfill';
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Container, Content} from 'native-base';
import {AppRegistry} from 'react-native';
import configureStore from './app/data/';
import AppHeader from './app/native/layout/Header';
import AppFooter from './app/native/layout/Footer';
import Router from './app/native/Router';

export default class Investreck extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <Container>
          <AppHeader />
          <Content scrollEnabled={false}>
            <Router />
          </Content>
          <AppFooter />
        </Container>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('investreck', () => Investreck);
