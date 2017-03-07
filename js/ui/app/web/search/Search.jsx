import React, {Component, PropTypes} from 'react';
import {Spinner, SpinnerType} from 'office-ui-fabric-react/lib/Spinner';
import {SearchBox} from 'office-ui-fabric-react/lib/SearchBox';
import {autobind} from 'core-decorators';

class Search extends Component {
  @autobind
  handleSearch(searchCriteria) {
    this.props.startSearch(searchCriteria);
  }

  renderSearchBox() {
    return <SearchBox onSearch={this.handleSearch} />
  }

  renderSearchResults() {
    const {search} = this.props;

    return <div>
        {
          search.get('searchResults').cata({
            Empty: () => <div></div>,
            Loading: () => <div><Spinner type={ SpinnerType.large } label="It's comming..." /></div>,
            Success: searchResults => <div>{searchResults.title}</div>,
            Failure: error => <div>{error}</div>
          })
        }
      </div>
  }

  render() {
    return <section>
      {this.renderSearchBox()}
      {this.renderSearchResults()}
    </section>
  }
}

export default Search;
