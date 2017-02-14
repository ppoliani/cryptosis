import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';

class Login extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton {...this.props} label="Login" />
    );
  }
}

export default Login;
