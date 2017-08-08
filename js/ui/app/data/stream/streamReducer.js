import {handleActions} from 'redux-actions';
import Maybe from 'folktale/maybe';
import {Map} from 'immutable';
import {SET_PORTFOLIO_SUBSCRIPTION} from './portfolioValueStream';
import {SET_LAST_30_DAYS_SUBSCRIPTION} from './last30DaysStream';
import {SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION} from './investmentValueStream';

const handleSetPortfolioSubscription = (state, {payload: subscription}) =>
  state.set('portfolioSubscription', Maybe.fromNullable(subscription));

const handleSetLast30DaysSubscription = (state, {payload: subscription}) =>
  state.set('last30DaysSubscription', Maybe.fromNullable(subscription));

const handleSetInvestmentCurrentValueSubscription = (state, {payload: subscription}) =>
  state.set('investmentCurrentValueSubscription', Maybe.fromNullable(subscription));


const streamData = Map({
  portfolioSubscription: Maybe.Nothing(),
  last30DaysSubscription: Maybe.Nothing(),
  investmentCurrentValueSubscription: Maybe.Nothing()
});

export default handleActions({
  [SET_PORTFOLIO_SUBSCRIPTION]: handleSetPortfolioSubscription,
  [SET_LAST_30_DAYS_SUBSCRIPTION]: handleSetLast30DaysSubscription,
  [SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION]: handleSetInvestmentCurrentValueSubscription
}, streamData);
