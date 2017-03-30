import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {login} from '../../helpers/auth';

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

  click() {
     fetch(
        `${process.env.API_URL}/test`,
        'GET',
        {},
        {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDE1NDM2MzMzODMwMzMwOSIsIm5hbWUiOiJQYXZsb3MgUG9saWFuaWRpcyIsImlhdCI6MTQ5MDg3MzI4MCwiZXhwIjoxNDkxNDc4MDgwfQ.7soDjgl0MsCJ5GMBxGKtKxrM30GnYisU_5bgutrAxLg'
        }
      )
      .bimap(
        error => console.log(error)
      )
      .run()
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
      <button onClick={this.click}>test</button>
    </section>
  }
}

export default Login;
