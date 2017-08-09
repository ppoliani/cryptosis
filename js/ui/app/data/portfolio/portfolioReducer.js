import {handleActions} from 'redux-actions'
import Maybe from 'folktale/maybe'
import {fromJS} from 'immutable'
import {
  SET_PORTFOLIO_TOTAL_VALUE,
  SET_LAST_30_DAYS,
  SET_INVESTMENT_CURRENT_VALUE
} from './portfolioActions'

const handleSetPortfolioTotalValue = (state, {payload: totalValue}) =>
  state
    .setIn(['total', 'longTerm'], Maybe.fromNullable(totalValue.get('longTerm')))
    .setIn(['total', 'shortTerm'], Maybe.fromNullable(totalValue.get('shortTerm')))

const handleSetLast30Days = (state, {payload: last30Days}) =>
  state
    .setIn(['last30Days', 'longTerm'], Maybe.fromNullable(last30Days.get('longTerm')))
    .setIn(['last30Days', 'shortTerm'], Maybe.fromNullable(last30Days.get('shortTerm')))

const handleSetInvestmentCurrentValue = (state, {payload: investmentValues}) => state.set('investmentValues', Maybe.fromNullable(investmentValues))

const portfolioData = fromJS({
  total: {
    longTerm: Maybe.Nothing(),
    shortTerm: Maybe.Nothing()
  },
  last30Days: {
    longTerm: Maybe.Nothing(),
    shortTerm: Maybe.Nothing()
  },
  investmentValues: Maybe.Nothing()
});

export default handleActions({
  [SET_PORTFOLIO_TOTAL_VALUE]: handleSetPortfolioTotalValue,
  [SET_LAST_30_DAYS]: handleSetLast30Days,
  [SET_INVESTMENT_CURRENT_VALUE]: handleSetInvestmentCurrentValue
}, portfolioData)
