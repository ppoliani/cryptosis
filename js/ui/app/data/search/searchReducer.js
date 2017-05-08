import {Map} from 'immutable';
import {handleActions} from 'redux-actions';
import SearchData from './searchData';
import {GET_SEARCH_RESULTS} from './searchActions';
import AsyncData from '../AsyncData';

const SearchData = Map({
  searchResults: AsyncData.Empty()
});

const handleGetSearchResults = (state, action) => state.set('searchResults', action.payload);

export default handleActions({
  [GET_SEARCH_RESULTS]: handleGetSearchResults
}, SearchData);
