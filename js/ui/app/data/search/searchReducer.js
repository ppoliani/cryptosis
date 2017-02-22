import { handleActions } from 'redux-actions';
import SearchData from './searchData';
import { GET_SEARCH_RESULTS } from './searchActions';

const handleGetSearchResults = (state, action) => state.set('searchResults', action.payload);

export default handleActions({
  [GET_SEARCH_RESULTS]: handleGetSearchResults
}, SearchData);
