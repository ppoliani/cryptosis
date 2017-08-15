import {createAction} from 'redux-actions'
import map from 'folktale/fantasy-land/map'
import {fromJS} from 'immutable'
import {loadFeeds} from '../../services/rss'
import {partial} from '../../../../common/core/fn'

const RSS_FEED_URL = 'http://bitcoin.worldnewsoffice.com/rss/category/1/';

export const LOAD_NEWS = 'NEWS::LOAD_NEWS'

const loadNewsRoot = loadFeeds => {
  return createAction(
    LOAD_NEWS,
    (map.curried(fromJS)) ['∘'] (partial(loadFeeds, RSS_FEED_URL))
  );
}


export const loadNews = loadNewsRoot(loadFeeds)
