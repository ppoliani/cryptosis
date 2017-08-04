import {createAction} from 'redux-actions';
import {combine} from 'most';
import {fromJS} from 'immutable';
import {btc$, eth$, xrp$, xtz$} from '../../../../common/sockets/streams';
import {calculateInvestmentValues} from '../../../../common/aggregators';
import {setInvestmentCurrentValue} from '../portfolio/portfolioActions';
import {getPartialInvestment$, getPriceObjFromStreamData} from './common';

export const SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION= 'STREAM::SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION';
const setInvestmentCurrentValueSuscription = createAction(SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION);


// value for each investment individually
export const startInvestmentCurrentValueStream = currency => dispatch => {
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

  const subscription = combine(getPrices, getPartialInvestment$(), btc$(currency), eth$(currency), xrp$(currency), xtz$(currency))
    .chain(calculateInvestmentValues)
    .subscribe(observer);

  dispatch(setInvestmentCurrentValueSuscription(subscription));
}
