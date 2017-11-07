import React, {Component} from 'react'
import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {View, StyleSheet, AsyncStorage} from 'react-native'
import {Redirect} from 'react-router-native'
import {setUserProfile} from '../../data/profile/profileActions'
import {login} from '../../services/auth'
import {setItem} from '../../services/storage'
import {fromPromised, waitAll} from 'folktale/concurrency/task'
import config from '../../services/config';

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
        .chain(({accessToken}) => login('fb', accessToken))
        .chain(({token, account}) => {
          this.props.setUserProfile(account);

          return waitAll([
            setItem(config.ACCESS_TOKEN_KEY, token),
            setItem(config.USER_INFO, JSON.stringify(account))
          ]);
        }) 
        .bimap(
          error => {
            console.log('Could not login', error);
          },
          () => {
            this.setState({isAuthenticated: true});
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

const mapStateToProps = state => ({
  userProfile: state.userProfile
})

const mapDispatchToProps = dispatch => ({
  setUserProfile: (dispatch) ['∘'] (setUserProfile)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

