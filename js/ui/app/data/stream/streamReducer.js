import {handleActions} from 'redux-actions';
import Maybe from 'folktale/data/maybe';
import {Map} from 'immutable';
import {
  SET_PORTFOLIO_SUBSCRIPTION,
  SET_LAST_30_DAYS_SUBSCRIPTION
} from './streamActions';

const handleSetPortfolioSubscription = (state, {payload: subscription}) =>
  state.set('portfolioSubscription', Maybe.fromNullable(subscription));

const handleSetLast30DaysSubscription = (state, {payload: subscription}) =>
  state.set('last30DaysSubscription', Maybe.fromNullable(subscription));

const streamData = Map({
  portfolioSubscription: Maybe.Nothing(),
  last30DaysSubscription: Maybe.Nothing()
});

export default handleActions({
  [SET_PORTFOLIO_SUBSCRIPTION]: handleSetPortfolioSubscription,
  [SET_LAST_30_DAYS_SUBSCRIPTION]: handleSetLast30DaysSubscription
}, streamData);
