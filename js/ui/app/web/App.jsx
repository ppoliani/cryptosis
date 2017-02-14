import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Logged from './Auth/Logged';
import Login from './Auth/Login';

class App extends Component {
  // ToDo(Pavlos): remove state and use redux instead
  constructor(props, state) {
    super(props, state);

    this.state = {
      logged: false
    };

  }

  handleChange = (event, logged) => {
    this.setState({logged: logged});
  };

  getIconElementLeft() {
    return this.state.logged
      ? <Logged />
      : <Login />
  }

  render() {
    const { search } = this.props;

    return <div>
        <AppBar
          title="Tagonize"
          iconElementRight={this.getIconElementLeft()}
        />
      </div>
  }
}

const mapStateToProps = state => state;

export default connect(
  mapStateToProps
)(App);
