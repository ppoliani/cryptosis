import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import { compose } from 'folktale/core/lambda';
import Logged from './Auth/Logged';
import Login from './Auth/Login';
import { getSearchResults } from '../data/search/searchActions';

class App extends Component {
  // ToDo(Pavlos): remove state and use redux instead
  constructor(props, state) {
    super(props, state);

    this.state = {
      logged: false
    };

  }

  componentDidMount() {
    this.props.startSearch({});
  }

  handleChange = (event, logged) => {
    this.setState({logged: logged});
  }

  getIconElementLeft() {
    return this.state.logged
      ? <Logged />
      : <Login />
  }

  render() {
    const { search } = this.props;

    return (
      <div>
        {
          search.get('searchResults').cata({
            Empty: () => <div>Search Results</div>,
            Loading: () => <div>Loading...</div>,
            Success: searchResults => <div>{searchResults.title}</div>,
            Failure: error => <div>{error}</div>
          })
        }

        <AppBar
          title="Tagonize"
          iconElementRight={this.getIconElementLeft()}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
};
const mapDispatchToProps = dispatch => ({
    startSearch: compose(dispatch, getSearchResults)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
