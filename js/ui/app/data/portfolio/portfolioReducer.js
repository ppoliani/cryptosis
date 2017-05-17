import {handleActions} from 'redux-actions';
import Maybe from 'folktale/data/maybe'
import {Map} from 'immutable';
import {
  SET_PORTFOLIO_TOTAL_VALUE,
  SET_LAST_30_DAYS,
  SET_INVESTMENT_CURRENT_VALUE
} from './portfolioActions';

const handleSetPortfolioTotalValue = (state, {payload: totalValue}) => state.set('total', Maybe.fromNullable(totalValue))
const handleSetLast30Days = (state, {payload: last30Days}) => state.set('last30Days', Maybe.fromNullable(last30Days))
const handleSetInvestmentCurrentValue = (state, {payload: investmentValues}) => state.set('investmentValues', Maybe.fromNullable(investmentValues))

const portfolioData = Map({
  total: Maybe.Nothing(),
  last30Days: Maybe.Nothing(),
  investmentValues: Maybe.Nothing()
});

export default handleActions({
  [SET_PORTFOLIO_TOTAL_VALUE]: handleSetPortfolioTotalValue,
  [SET_LAST_30_DAYS]: handleSetLast30Days,
  [SET_INVESTMENT_CURRENT_VALUE]: handleSetInvestmentCurrentValue
}, portfolioData);
