import {createAction} from 'redux-actions';
import {combine, concat} from 'most';
import {fromJS} from 'immutable';
import io from 'socket.io-client';
import {connect} from '../../../../common/sockets/cryptoCompare';
import {calculateInvestmentValues} from '../../../../common/aggregators';
import {setInvestmentCurrentValue} from '../portfolio/portfolioActions';
import {getPartialInvestment$, getPriceObjFromStreamData} from './common';

export const SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION= 'STREAM::SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION';
const setInvestmentCurrentValueSuscription = createAction(SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION);


// value for each investment individually
export const startInvestmentCurrentValueStream = currency => dispatch => {
  const btc$ = concat(
    connect(io, 'BTC', 'Coinfloor', currency),
    connect(io, 'BTC', 'Kraken', currency),
    connect(io, 'BTC', 'Coinbase', currency)
  );
  const eth$ = connect(io, 'ETH', 'Kraken', currency);
  const xrp$ = connect(io, 'XRP', 'Bitstamp', currency);
  const xtz$ = connect(io, 'XTZ', 'HitBTC', currency);

  const observer = {
    next: (dispatch) ['∘'] (setInvestmentCurrentValue),
    error: errorValue => console.log(`Error in the observer of the investment values stream: ${errorValue}`)
  }

  const getPrices = (investments, btc, eth, xrp, xtz)  => ({
    investments: fromJS(investments.result).filter(v => v.get('currency') === currency),
    prices: fromJS({
      BTX: getPriceObjFromStreamData(btc),
      ETH: getPriceObjFromStreamData(eth),
      XRP: getPriceObjFromStreamData(xrp),
      XTZ: getPriceObjFromStreamData(xtz)
    })
  })

  const subscription = combine(getPrices, getPartialInvestment$(), btc$, eth$, xrp$, xtz$)
    .chain(calculateInvestmentValues)
    .subscribe(observer);

  dispatch(setInvestmentCurrentValueSuscription(subscription));
}
