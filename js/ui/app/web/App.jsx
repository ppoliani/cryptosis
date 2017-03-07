import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {compose} from 'folktale/core/lambda';
import {getSearchResults} from '../data/search/searchActions'
import Search from './search/Search';

class App extends Component {
  render() {
    const {search, startSearch} = this.props;

    return <section>
      <Search
        startSearch={startSearch}
        search={search} />
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
