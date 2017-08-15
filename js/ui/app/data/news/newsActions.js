import {createAction} from 'redux-actions'
import map from 'folktale/fantasy-land/map'
import {Map, fromJS} from 'immutable'
import {loadFeeds} from '../../services/rss'
import {partial} from '../../../../common/core/fn'

const RSS_FEED_URL = 'http://cryptscout.com/cryptocurrency-news-rss.php';

export const LOAD_NEWS = 'NEWS::LOAD_NEWS'

const loadNewsRoot = loadFeeds => createAction(
  LOAD_NEWS,
  (map.curried(fromJS)) ['∘'] (partial(loadFeeds, RSS_FEED_URL))
);

export const loadNews = loadNewsRoot(loadFeeds)
