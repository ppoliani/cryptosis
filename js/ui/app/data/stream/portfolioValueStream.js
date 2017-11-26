import {createAction} from 'redux-actions'
import {fromJS, Map} from 'immutable'
import {fromPromise, combine, zip} from 'most'
import {partial, prop} from '../../../../common/core/fn'
import {priceStream$} from '../../../../common/sockets/streams'
import {calculateTotalPortfolioValue} from '../../../../common/aggregators'
import {MINUTE} from '../../../../common/constants/time'
import {setPortfolioValue} from '../portfolio/portfolioActions'
import {setPrice} from '../prices/priceActions'
import {
  getPartialTransactions$, 
  getPriceObjFromStreamData, 
  streamInitialPrice,
  fx$
} from './common'

export const SET_PORTFOLIO_SUBSCRIPTION = 'STREAM::SET_PORTFOLIO_SUBSCRIPTION'
const setPortfolioSubscription = createAction(SET_PORTFOLIO_SUBSCRIPTION);

export const startPortfolioStream = currency => (dispatch, getState) => {
  const observer = {
    next: (dispatch) ['∘'] (setPortfolioValue),
    error: errorValue => {
      console.log(`Error in the observer of the portfolio stream: ${errorValue}`)
    }
  }
 
  const getPrices = (transactions, price, fx)  => {
    const {prices} = getState(); 
    const priceData = getPriceObjFromStreamData(currency, fx, price);

    return {
      transactions: fromJS(transactions.result),
      price: fromJS(priceData),
      fx: prices
    }
  }
  
  const streams$ = [getPartialTransactions$(), priceStream$(currency), fx$(currency)];

  const streamPrices = () => {
    const subscription = combine(getPrices, ...streams$)
      .throttle(MINUTE)
      .tap((dispatch) ['∘'] (setPrice) ['∘'] (prop('price')))
      .map(calculateTotalPortfolioValue)
      .subscribe(observer);

    dispatch(setPortfolioSubscription(subscription));
  }
  
  streamPrices();
  streamInitialPrice(dispatch, currency)
    .map(calculateTotalPortfolioValue)
    .subscribe(observer);
}
