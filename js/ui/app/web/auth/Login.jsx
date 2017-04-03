import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {login} from '../../helpers/auth';
import './login.css';

import fetch from '../../helpers/api';

class Login extends Component {
  createAuthResponse(response) {
    return {
      email: response.email,
      name: response.name,
      userId: response.userID,
      picture: response.picture.data.url
    };
  }

  createGoogleAuthResponse({profileObj}){
    return {
      email: profileObj.email,
      name: profileObj.name,
      userId: profileObj.googleId,
      picture: profileObj.imageUrl
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

  componentClicked() {

  }

  @autobind
  responseGoogle(response) {
    if(response.error) {
      console.log(response.error);
    }

    login('google', response.accessToken, this.createGoogleAuthResponse(response))
      .bimap(
        error => {
          console.log('Could not login via google', error)
        },
        ({token}) => {
          window.localStorage.setItem('bartr_access_token', token)
        }
      )
      .run();
  }

  render() {
    return  <section className='login-section page-center'>
      <FacebookLogin
        appId={process.env.FB_CLIENT_ID}
        autoLoad={true}
        fields="name,email,picture"
        onClick={this.componentClicked}
        callback={this.responseFacebook} />
      <GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}/>
    </section>
  }
}

export default Login;
