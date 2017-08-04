import {createAction} from 'redux-actions';
import {fromJS} from 'immutable';
import {combine} from 'most';
import {btc$, eth$, xrp$, xtz$} from '../../../../common/sockets/streams';
import {calculateTotalPortfolioValue} from '../../../../common/aggregators';
import {setPortfolioValue} from '../portfolio/portfolioActions';
import {setPrices} from '../prices/priceActions';
import {getPartialInvestment$, getPriceObjFromStreamData} from './common';

export const SET_PORTFOLIO_SUBSCRIPTION = 'STREAM::SET_PORTFOLIO_SUBSCRIPTION';
const setPortfolioSubscription = createAction(SET_PORTFOLIO_SUBSCRIPTION);

export const startPortfolioStream = currency => dispatch => {
  const observer = {
    next: (dispatch) ['∘'] (setPortfolioValue),
    error: errorValue => console.log(`Error in the observer of the portfolio stream: ${errorValue}`)
  }

  const getPrices = (investments, btc, eth, xrp, xtz)  => {
    return {
      investments: fromJS(investments.result).filter(v => v.get('currency') === currency),
      prices: fromJS({
        BTX: getPriceObjFromStreamData(btc),
        ETH: getPriceObjFromStreamData(eth),
        XRP: getPriceObjFromStreamData(xrp),
        XTZ: getPriceObjFromStreamData(xtz)
      })
    }
  }

  const keepPrices = obj => obj.prices;

  const subscription = combine(getPrices, getPartialInvestment$(), btc$(currency), eth$(currency), xrp$(currency), xtz$(currency))
    .tap((dispatch) ['∘'] (setPrices) ['∘'] (keepPrices))
    .chain(calculateTotalPortfolioValue)
    .subscribe(observer);

  dispatch(setPortfolioSubscription(subscription));
};
