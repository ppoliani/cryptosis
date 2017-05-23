import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {compose} from 'folktale/core/lambda';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import {setUserProfile} from '../data/profile/profileActions';

import {getItem} from '../../storage';

const style = {
  height: '100vh',
  width: '100vw',
  textAlign: 'center',
  padding: '1rem',
  display: 'inline-block',
};

class App extends Component {
  componenentWillMount() {
    this.props.setUserProfile(getItem('@investreck:user'))
  }

  render() {
    const {search, startSearch} = this.props;

    return <section>
      <AppBar title="Investeck" />
      <Paper style={style}>
        <Search
          startSearch={startSearch}
          search={search} />
      </Paper>
    </section>
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  startSearch: compose(dispatch, getSearchResults),
  setUserProfile: compose(dispatch, setUserProfile)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
