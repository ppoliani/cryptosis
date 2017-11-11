import {createAction} from 'redux-actions'
import {combine} from 'most'
import {fromJS} from 'immutable'
import {partial, prop} from '../../../../common/core/fn'
import {priceStream$} from '../../../../common/sockets/streams'
import {MINUTE} from '../../../../common/constants/time'
import {calculateInvestmentValues} from '../../../../common/aggregators'
import {changePriceToSelectedCurrency} from '../../../../common/fx'
import {setTransactionsCurrentValue} from '../portfolio/portfolioActions'
import {setPrices} from '../prices/priceActions'
import {getPartialTransactions$, getPriceObjFromStreamData, streamInitialPrice, fx$} from './common'

export const SET_TRANSACTION_CURRENT_VALUE_SUBSCRIPTION= 'STREAM::SET_TRANSACTION_CURRENT_VALUE_SUBSCRIPTION'
const setTransactionCurrentValueSubscription = createAction(SET_TRANSACTION_CURRENT_VALUE_SUBSCRIPTION);


// value for each transaction individually
export const startTransactionCurrentValueStream = currency => (dispatch, getState) => {
  const observer = {
    next: (dispatch) ['∘'] (setTransactionsCurrentValue),
    error: errorValue => console.log(`Error in the observer of the transaction values stream: ${errorValue}`)
  }

  const getPrices = (txns, price, fx)  => {
    const {prices} = getState();
    const priceData = getPriceObjFromStreamData(currency, fx, price);
    
    // map though transactions and convert price of purchase into the currenlty selected currency
    const updatedTxns = fromJS(txns.result)
      .map(partial(changePriceToSelectedCurrency, currency, fx.get(currency)))

    return {
      transactions: updatedTxns,
      price: fromJS(priceData),
      fx: prices
    }
  }

  const streams$ = [getPartialTransactions$(), priceStream$(currency), fx$(currency)];

  const streamPrices = () => {
    const subscription = combine(getPrices, ...streams$)
      .throttle(MINUTE)
      .tap((dispatch) ['∘'] (setPrices) ['∘'] (prop('price')))
      .map(calculateInvestmentValues)
      .subscribe(observer);

    dispatch(setTransactionCurrentValueSubscription(subscription)); 
  }

  streamPrices();
  streamInitialPrice(dispatch, currency)
    .map(calculateInvestmentValues)
    .subscribe(observer);
}
