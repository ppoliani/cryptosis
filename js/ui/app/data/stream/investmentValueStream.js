import {createAction} from 'redux-actions'
import {combine} from 'most'
import {fromJS} from 'immutable'
import {partial} from '../../../../common/core/fn'
import {priceStream$} from '../../../../common/sockets/streams'
import {calculateInvestmentValues} from '../../../../common/aggregators'
import {changePriceToSelectedCurrency} from '../../../../common/fx'
import {setInvestmentCurrentValue} from '../portfolio/portfolioActions'
import {setPrices} from '../prices/priceActions'
import {getPartialInvestment$, getPriceObjFromStreamData, fx$} from './common'

export const SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION= 'STREAM::SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION'
const setInvestmentCurrentValueSuscription = createAction(SET_INVESTMENT_CURRENT_VALUE_SUBSCRIPTION);


// value for each investment individually
export const startInvestmentCurrentValueStream = currency => (dispatch, getState) => {
  const observer = {
    next: (dispatch) ['∘'] (setInvestmentCurrentValue),
    error: errorValue => console.log(`Error in the observer of the investment values stream: ${errorValue}`)
  }

  const getPrices = (investments, price, fx)  => {
    const {prices} = getState();
    const priceData = getPriceObjFromStreamData(currency, fx, price);
    
    // map though investments and convert price of purchase into the currenlty selected currency
    const updatedInvestments = fromJS(investments.result)
      .map(partial(changePriceToSelectedCurrency, currency, fx.get(currency)))

    return {
      investments: updatedInvestments,
      price: fromJS(priceData),
      fx: prices
    }
  }

  const keepPrices = obj => obj.price;
  const streams$ = [priceStream$(currency), fx$(currency)];

  const subscription = combine(getPrices, getPartialInvestment$(), ...streams$)
    .throttle(30000)
    .tap((dispatch) ['∘'] (setPrices) ['∘'] (keepPrices))
    .map(calculateInvestmentValues)
    .subscribe(observer);

  dispatch(setInvestmentCurrentValueSuscription(subscription));
}
