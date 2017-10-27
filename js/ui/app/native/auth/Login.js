import React, {Component} from 'react'
import {autobind} from 'core-decorators'
import {View, StyleSheet, AsyncStorage} from 'react-native'
import {Redirect} from 'react-router-native'
import {login} from '../../services/auth'
import {setItem} from '../../services/storage'
import {fromPromised} from 'folktale/concurrency/task'
import Config from 'react-native-config'

const FBSDK = require('react-native-fbsdk');
const {LoginButton, AccessToken} = FBSDK;

class Login extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {isAuthenticated: false};
  }

  @autobind
  responseFacebook(error, result) {
    if (error) {
      console.log('Could not login via fb', error);
      this.state = {isAuthenticated: false};
    } 
    else { 
      fromPromised(AccessToken.getCurrentAccessToken)()
        .chain(({accessToken}) => setItem(Config.ACCESS_TOKEN_KEY, accessToken)) 
        .bimap(
          error => {
            console.log('Could not store the token in the localstorage', error);
          },
          () => {
            this.setState({isAuthenticated: true})
          }
        )
        .run()
    } 
  } 

  render() {
    return this.state.isAuthenticated
      ? <Redirect to={this.props.location.state.from || ''}/>
      : <View>
          <LoginButton
            readPermissions={['email', 'public_profile']}
            onLoginFinished={this.responseFacebook} />
        </View>;
  }
}

export default Login
