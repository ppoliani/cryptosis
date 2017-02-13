import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class App extends Component {

  render() {
    const { search } = this.props;

    return <div>isLoading - {search.isLoading.toString()}</div>
  }
}

const mapStateToProps = state => state;

export default connect(
  mapStateToProps
)(App);
