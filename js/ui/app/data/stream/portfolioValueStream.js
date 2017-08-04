import {createAction} from 'redux-actions';
import {combine, concat} from 'most';
import {fromJS} from 'immutable';
import io from 'socket.io-client';
import {connect} from '../../../../common/sockets/cryptoCompare';
import {calculateTotalPortfolioValue} from '../../../../common/aggregators';
import {setPortfolioValue} from '../portfolio/portfolioActions';
import {setPrices} from '../prices/priceActions';
import {getPartialInvestment$, getPriceObjFromStreamData} from './common';

export const SET_PORTFOLIO_SUBSCRIPTION = 'STREAM::SET_PORTFOLIO_SUBSCRIPTION';
const setPortfolioSubscription = createAction(SET_PORTFOLIO_SUBSCRIPTION);

export const startPortfolioStream = currency => dispatch => {
  const btc$ = concat(
    connect(io, 'BTC', 'Coinfloor', currency),
    connect(io, 'BTC', 'Kraken', currency),
    connect(io, 'BTC', 'Coinbase', currency)
  );
  const eth$ = connect(io, 'ETH', 'Kraken', currency);
  const xrp$ = connect(io, 'XRP', 'Bitstamp', currency);
  const xtz$ = connect(io, 'XTZ', 'HitBTC', currency);

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

  const subscription = combine(getPrices, getPartialInvestment$(), btc$, eth$, xrp$, xtz$)
    .tap((dispatch) ['∘'] (setPrices) ['∘'] (keepPrices))
    .chain(calculateTotalPortfolioValue)
    .subscribe(observer);

  dispatch(setPortfolioSubscription(subscription));
};
