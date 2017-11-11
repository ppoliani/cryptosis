import {handleActions} from 'redux-actions'
import Maybe from 'folktale/maybe'
import {fromJS} from 'immutable'
import {
  SET_PORTFOLIO_TOTAL_VALUE,
  SET_LAST_30_DAYS,
  SET_TRANSACTIONS_CURRENT_VALUE
} from './portfolioActions'

const handleSetPortfolioTotalValue = (state, {payload: totalValue}) =>
  state
    .set('total', Maybe.fromNullable(totalValue));

const handleSetLast30Days = (state, {payload: last30Days}) =>
  state
    .set('last30Days', Maybe.fromNullable(last30Days))

const handleSetTransactionsCurrentValue = (state, {payload: transactionValues}) => state.set('transactionValues', Maybe.fromNullable(transactionValues))

const PortfolioModel = fromJS({
  total: Maybe.Nothing(),
  last30Days: Maybe.Nothing(),
  transactionValues: Maybe.Nothing()
});

export default handleActions({
  [SET_PORTFOLIO_TOTAL_VALUE]: handleSetPortfolioTotalValue,
  [SET_LAST_30_DAYS]: handleSetLast30Days,
  [SET_TRANSACTIONS_CURRENT_VALUE]: handleSetTransactionsCurrentValue
}, PortfolioModel)
