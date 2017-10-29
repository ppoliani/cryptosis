import {createAction} from 'redux-actions'
import {combine} from 'most'
import {fromJS} from 'immutable'
import {partial} from '../../../../common/core/fn'
import {priceStream$} from '../../../../common/sockets/streams'
import {calculateInvestmentValues} from '../../../../common/aggregators'
import {changePriceToSelectedCurrency} from '../../../../common/fx'
import {setInvestmentCurrentValue} from '../portfolio/portfolioActions'
import {getPartialInvestment$, getPriceObjFromStreamData, fx$} from './common'

export const SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION= 'STREAM::SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION'
const setInvestmentCurrentValueSuscription = createAction(SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION);


// value for each investment individually
export const startInvestmentCurrentValueStream = currency => dispatch => {
  const observer = {
    next: (dispatch) ['∘'] (setInvestmentCurrentValue),
    error: errorValue => console.log(`Error in the observer of the investment values stream: ${errorValue}`)
  }

  const getPrices = (investments, prices, fx)  => {
    const priceData = getPriceObjFromStreamData(currency, fx, prices);
    
    return {
      investments: fromJS(investments.result).map(partial(changePriceToSelectedCurrency, currency, fx.get(currency))),
      prices: fromJS(priceData)
    }
  }

  const streams$ = [priceStream$(currency), fx$()];
  const subscription = combine(getPrices, getPartialInvestment$(), ...streams$)
    .map(calculateInvestmentValues)
    .subscribe(observer);

  dispatch(setInvestmentCurrentValueSuscription(subscription));
}
