import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import {View, StyleSheet, AsyncStorage} from 'react-native';
import {login} from '../../helpers/auth';
import {setItem} from '../../storage';


const {FBLogin, FBLoginManager} = require('react-native-facebook-login');

class Login extends Component {
  @autobind
  responseFacebook(response) {
    login('fb', response.credentials.token)
      .chain(token => setItem('@bartr:access_token'))
      .bimap(
        error => {
          console.log('Could not login via fb', error)
        },
        () => {
          // navigate to the main page
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
        onLogin={this.responseFacebook}
        onError={this.onError}
        onPermissionsMissing={this.onPermissionsMissing} />
    </View>
  }
}

export default Login;
