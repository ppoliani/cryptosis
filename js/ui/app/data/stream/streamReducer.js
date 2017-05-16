import {handleActions} from 'redux-actions';
import Maybe from 'folktale/data/maybe';
import {Map} from 'immutable';
import {SET_PORTFOLIO_SUBSCRIPTION} from './streamActions';

const handleSetPortfolioSubscription = (state, {payload: subscription}) =>
  state.set('portfolioSubscription', Maybe.fromNullable(subscription));

const streamData = Map({
  portfolioSubscription: Maybe.Nothing()
});

export default handleActions({
  [SET_PORTFOLIO_SUBSCRIPTION]: handleSetPortfolioSubscription
}, streamData);
