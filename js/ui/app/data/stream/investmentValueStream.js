import {createAction} from 'redux-actions';
import {combine} from 'most';
import {fromJS} from 'immutable';
import compose from 'folktale/core/lambda/compose';
import io from 'socket.io-client';
import {connect} from '../../../../common/sockets/cryptoCompare';
import {calculateInvestmentValues} from '../../../../common/aggregators';
import {setInvestmentCurrentValue} from '../portfolio/portfolioActions';
import {getPartialInvestment$, getPriceObjFromStreamData} from './common';

export const SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION= 'STREAM::SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION';
const setInvestmentCurrentValueSuscription = createAction(SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION);


// value for each investment individually
export const startInvestmentCurrentValueStream = currency => dispatch => {
  const btc$ = connect(io, 'BTC', 'Coinfloor', currency);
  const eth$ = connect(io, 'ETH', 'Kraken', currency);

  const observer = {
    next: compose(dispatch, setInvestmentCurrentValue),
    error: errorValue => console.log(`Error in the observer of the investment values stream: ${errorValue}`)
  }

  const getPrices = (investments, btc, eth)  => ({
    investments: fromJS(investments.result).filter(v => v.get('currency') === currency),
    prices: fromJS({
      BTX: getPriceObjFromStreamData(btc),
      ETH: getPriceObjFromStreamData(eth)
    })
  })

  const subscription = combine(getPrices, getPartialInvestment$(), btc$, eth$)
    .chain(calculateInvestmentValues)
    .subscribe(observer);

  dispatch(setInvestmentCurrentValueSuscription(subscription));
}
