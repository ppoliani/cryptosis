import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {compose} from 'folktale/core/lambda';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import {getSearchResults} from '../data/search/searchActions'
import Search from './search/Search';

const style = {
  height: '100vh',
  width: '100vw',
  textAlign: 'center',
  padding: '1rem',
  display: 'inline-block',
};

class App extends Component {
  render() {
    const {search, startSearch} = this.props;

    return <section>
      <AppBar title="Neuronise" />
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
    startSearch: compose(dispatch, getSearchResults)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
