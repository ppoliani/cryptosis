import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import {login} from '../../helpers/auth';
import {View, StyleSheet} from 'react-native';
// import './login.css';

const {FBLogin, FBLoginManager} = require('react-native-facebook-login');

class Login extends Component {
  createAuthResponse(response) {
    return {
      email: response.email,
      name: response.name,
      userId: response.userID,
      picture: response.picture.data.url
    };
  }

  @autobind
  responseFacebook(response) {
    login('fb', response.accessToken, this.createAuthResponse(response))
      .bimap(
        error => {
          console.log('Could not login via fb', error)
        },
        ({token}) => {
          window.localStorage.setItem('bartr_access_token', token)
        }
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
    return  <View>
      <FBLogin
        loginBehavior={FBLoginManager.LoginBehaviors.Native}
        permissions={['email', 'public_profile']}
        onLogin={this.componentClicked}
        onLoginFound={this.responseFacebook}
        onError={this.onError}
        onPermissionsMissing={this.onPermissionsMissing} />
    </View>
  }
}

export default Login;
