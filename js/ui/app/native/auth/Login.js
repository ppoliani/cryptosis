import React, {Component} from 'react'
import {autobind} from 'core-decorators'
import {View, StyleSheet, AsyncStorage} from 'react-native'
import {Redirect} from 'react-router-native'
import {login} from '../../services/auth'
import {setItem} from '../../services/storage'

const FBSDK = require('react-native-fbsdk');
const {LoginButton, AccessToken} = FBSDK;

class Login extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {isAuthenticated: false};
  }

  @autobind
  responseFacebook(response) {
    login('fb', response.credentials.token)
      .chain(({token}) => setItem(process.env.ACCESS_TOKEN_KEY, token))
      .bimap(
        error => {
          console.log('Could not login via fb', error);
          this.state = {isAuthenticated: false};
        },
        () => this.setState({isAuthenticated: true})
      )
      .run();
  }

  onError(data) {
    console.log("Error");
    console.log(data);
  }

  onPermissionsMissing(data) {
    console.log("Check permissions!");
    console.log(data);
  }

  render() {
    return this.state.isAuthenticated
      ? <Redirect to={this.props.location.state.from || ''}/>
      : <View>
          <LoginButton
            publishPermissions={['email', 'public_profile']}
            onLoginFinished={this.responseFacebook} />
        </View>;
  }
}

export default Login
