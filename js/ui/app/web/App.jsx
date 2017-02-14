import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Toggle from 'material-ui/Toggle';
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

  render() {
    const { search } = this.props;


  return <div>
      <Toggle
          label="Logged"
          defaultToggled={true}
          onToggle={this.handleChange}
          labelPosition="right"
          style={{margin: 20}}
        />
      <AppBar
        title="My AppBar"
        iconElementRight={this.state.logged ? <Logged /> : <Login />}
      />
    </div>
  }
}

const mapStateToProps = state => state;

export default connect(
  mapStateToProps
)(App);
