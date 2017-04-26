import React from 'react';
import {View} from 'react-native';
import {NativeRouter, Route, Link} from 'react-router-native';
import Home from './Home';
import Login from './auth/Login';

export default () =>
  <NativeRouter>
    <View>
      <Route exact path="/" component={Home}/>
      <Route path="/login" component={Login}/>
    </View>
  </NativeRouter>;
