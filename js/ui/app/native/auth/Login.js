import React, {Component} from 'react'
import {autobind} from 'core-decorators'
import {View, StyleSheet, AsyncStorage} from 'react-native'
import {Redirect} from 'react-router-native'
import {login} from '../../helpers/auth'
import {setItem} from '../../storage'


const {FBLogin, FBLoginManager} = require('react-native-facebook-login');

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
          <FBLogin
            loginBehavior={FBLoginManager.LoginBehaviors.Native}
            permissions={['email', 'public_profile']}
            onLogin={this.responseFacebook}
            onError={this.onError}
            onPermissionsMissing={this.onPermissionsMissing} />
        </View>;
  }
}

export default Login
