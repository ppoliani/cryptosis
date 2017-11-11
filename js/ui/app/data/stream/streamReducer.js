import {handleActions} from 'redux-actions'
import Maybe from 'folktale/maybe'
import {Map} from 'immutable'
import {SET_PORTFOLIO_SUBSCRIPTION} from './portfolioValueStream'
import {SET_LAST_30_DAYS_SUBSCRIPTION} from './last30DaysStream'
import {SET_TRANSACTION_CURRENT_VALUE_SUBSCRIPTION} from './transactionValueStream'

const handleSetPortfolioSubscription = (state, {payload: subscription}) =>
  state.set('portfolioSubscription', Maybe.fromNullable(subscription));

const handleSetLast30DaysSubscription = (state, {payload: subscription}) =>
  state.set('last30DaysSubscription', Maybe.fromNullable(subscription));

const handleSetTransactionCurrentValueSubscription = (state, {payload: subscription}) =>
  state.set('transactionCurrentValueSubscription', Maybe.fromNullable(subscription));


const streamData = Map({
  portfolioSubscription: Maybe.Nothing(),
  last30DaysSubscription: Maybe.Nothing(),
  transactionCurrentValueSubscription: Maybe.Nothing()
});

export default handleActions({
  [SET_PORTFOLIO_SUBSCRIPTION]: handleSetPortfolioSubscription,
  [SET_LAST_30_DAYS_SUBSCRIPTION]: handleSetLast30DaysSubscription,
  [SET_TRANSACTION_CURRENT_VALUE_SUBSCRIPTION]: handleSetTransactionCurrentValueSubscription
}, streamData)
