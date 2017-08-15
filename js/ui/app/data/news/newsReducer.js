import {handleActions} from 'redux-actions'
import {Map} from 'immutable'
import {LOAD_NEWS} from './newsActions'
import AsyncData from '../core/AsyncData'

const handleSetFeeds = (state, action) => state.set('feeds', action.payload);

const NewsModel = Map({
  feeds: AsyncData.Empty()
});

export default handleActions({
  [LOAD_NEWS]: handleSetFeeds
}, NewsModel)
