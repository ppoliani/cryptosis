import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import {login} from '../../helpers/auth';
import {View, StyleSheet, AsyncStorage} from 'react-native';

const {FBLogin, FBLoginManager} = require('react-native-facebook-login');

class Login extends Component {
  @autobind
  responseFacebook(response) {
    login('fb', response.accessToken)
      .bimap(
        error => {
          console.log('Could not login via fb', error)
        },
        ({token}) => {
          //Todo: move this to a task bases utility function
          // await AsyncStorage.setItem('@BartrStore:accessToken', token);
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
        // onLogin={this.componentClicked}
        onLoginFound={this.responseFacebook}
        onError={this.onError}
        onPermissionsMissing={this.onPermissionsMissing} />
    </View>
  }
}

export default Login;
