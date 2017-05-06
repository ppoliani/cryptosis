import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {login} from '../../helpers/auth';
import {setItem} from '../../storage';

import './login.scss';

import fetch from '../../helpers/api';

class Login extends Component {
  @autobind
  responseFacebook(response) {
    login('fb', response.accessToken)
      .bimap(
        error => {
          console.log('Could not login via fb', error)
        },
        ({token}) => {
          setItem('@investreck:access_token', token)
        }
      )
      .run();
  }

  componentClicked() { }

  @autobind
  responseGoogle(response) {
    if(response.error) {
      console.log(response.error);
    }

    login('google', response.accessToken)
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
        autoLoad={false}
        fields="name,email,picture"
        onClick={this.componentClicked}
        callback={this.responseFacebook} />
      <GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID}
        scope='openid email profile'
        buttonText="Login with Google"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}/>
    </section>
  }
}

export default Login;
