import {createAction} from 'redux-actions';
import {combine} from 'most';
import {fromJS} from 'immutable';
import compose from 'folktale/core/lambda/compose';
import {connect} from '../../services/sockets/cryptoCompare';
import {calculateTotalPortfolioValue} from '../../services/aggregators';
import {setPortfolioValue} from '../portfolio/portfolioActions';
import {getPartialInvestment$, getPriceObjFromStreamData} from './common';

export const SET_PORTFOLIO_SUBSCRIPTION = 'STREAM::SET_PORTFOLIO_SUBSCRIPTION';
export const setPortfolioSubscription = createAction(SET_PORTFOLIO_SUBSCRIPTION);

export const startPortfolioStream = () => dispatch => {
  const btc$ = connect('BTC', 'Coinfloor');
  const eth$ = connect('ETH', 'Kraken');

  const observer = {
    next: compose(dispatch, setPortfolioValue),
    error: errorValue => console.log(`Error in the observer of the portfolio stream: ${errorValue}`)
  }

  const getPrices = (investments, btc, eth)  => {
    return {
      investments: fromJS(investments.result),
      prices: fromJS({
        BTX: getPriceObjFromStreamData(btc),
        ETH: getPriceObjFromStreamData(eth)
      })
    }
  }

  const subscription = combine(getPrices, getPartialInvestment$(), btc$, eth$)
    .chain(calculateTotalPortfolioValue)
    .subscribe(observer);

  dispatch(setPortfolioSubscription(subscription));
};
