import {handleActions} from 'redux-actions';
import Maybe from 'folktale/data/maybe'
import {Map} from 'immutable';
import {SET_PORTFOLIO_TOTAL_VALUE} from './portfolioActions';

const handleSetPortfolioTotalValue = (state, {payload: totalValue}) => state.set('total', Maybe.fromNullable(totalValue))

const portfolioData = Map({
  total: Maybe.Nothing()
});

export default handleActions({
  [SET_PORTFOLIO_TOTAL_VALUE]: handleSetPortfolioTotalValue
}, portfolioData);
