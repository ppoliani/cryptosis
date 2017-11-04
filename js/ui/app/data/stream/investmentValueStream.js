import {createAction} from 'redux-actions'
import {combine} from 'most'
import {fromJS} from 'immutable'
import {partial, prop} from '../../../../common/core/fn'
import {priceStream$} from '../../../../common/sockets/streams'
import {MINUTE} from '../../../../common/constants/time'
import {calculateInvestmentValues} from '../../../../common/aggregators'
import {changePriceToSelectedCurrency} from '../../../../common/fx'
import {setInvestmentCurrentValue} from '../portfolio/portfolioActions'
import {setPrices} from '../prices/priceActions'
import {getPartialInvestment$, getPriceObjFromStreamData, streamInitialPrice, fx$} from './common'

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

  const streams$ = [getPartialInvestment$(), priceStream$(currency), fx$(currency)];

  const streamPrices = () => {
    const subscription = combine(getPrices, ...streams$)
      .throttle(MINUTE)
      .tap((dispatch) ['∘'] (setPrices) ['∘'] (prop('price')))
      .map(calculateInvestmentValues)
      .subscribe(observer);

    dispatch(setInvestmentCurrentValueSuscription(subscription)); 
  }

  streamPrices();
  streamInitialPrice(dispatch, currency)
    .map(calculateInvestmentValues)
    .subscribe(observer);
}
