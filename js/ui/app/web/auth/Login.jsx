import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { login } from '../../helpers/auth';

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
        token => {
          console.log(token)
          // store token in localstorage
        }
      )
      .run();
  }

  componentClicked() {

  }

  responseGoogle(response) {
    if(response.error) {
      console.log(error);
    }

    console.log(response);
  }

  render() {
    return <section>
      <FacebookLogin
        appId={process.env.FB_CLIENT_ID}
        autoLoad={true}
        fields="name,email,picture"
        onClick={this.componentClicked}
        callback={this.responseFacebook} />
      <GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID}
        buttonText="Login"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
      />
    </section>
  }
}

export default Login;
