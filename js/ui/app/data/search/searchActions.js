import { curry } from 'folktale/core/lambda';
import compose from 'folktale/core/lambda/compose';
import map  from 'folktale/core/fantasy-land/map';
import { createAction } from 'redux-actions';
import fetch from '../../helpers/api';
import { pipe, toFuture } from '../../helpers/fn';

export const SET_IS_LOADING= 'SEARCH::SET_IS_LOADING';
export const GET_SEARCH_RESULTS= 'SEARCH::GET_SEARCH_RESULTS';

export const setIsLoading = createAction(SET_IS_LOADING);

const DUMMY_URL = 'https://jsonplaceholder.typicode.com/posts/1';

export const getSearchResultsRoot = (fetch) => {
  // ToDo(Pavlos): construct the url with the search criteria
  const getUrl = searchCriteria => DUMMY_URL;
  const fetchData = compose(fetch, getUrl);

  const transformData = searchResults => {
    //Todo(Pavlos): implement the real transformation function
    return searchResults;
  }

  return createAction(
    GET_SEARCH_RESULTS,
    compose(
      map.curried(transformData),
      fetchData
    )
  );
};

export const getSearchResults = curry(1, getSearchResultsRoot)(fetch);
