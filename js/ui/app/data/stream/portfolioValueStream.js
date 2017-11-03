import {createAction} from 'redux-actions'
import {fromJS, Map} from 'immutable'
import {fromPromise, combine, zip} from 'most'
import {partial, prop} from '../../../../common/core/fn'
import {priceStream$} from '../../../../common/sockets/streams'
import {calculateTotalPortfolioValue} from '../../../../common/aggregators'
import {changePriceToSelectedCurrency} from '../../../../common/fx'
import {setPortfolioValue} from '../portfolio/portfolioActions'
import {setPrices, setPrice} from '../prices/priceActions'
import {
  getPartialInvestment$, 
  getPriceObjFromStreamData, 
  createPriceStreams$,
  getDistinctInvestmentTypes,
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

  const getPriceStreams = async investments => {
    const distinctTypes = getDistinctInvestmentTypes(fromJS(investments.result));
    const streams = createPriceStreams$(currency, distinctTypes);
    const prices = await Promise.all(streams);

    // associate each symbol with the corresponding result of the xhr request for it's price
    // i.e. the first item in the prices array corresponds to the first request that was sent to the server
    // distinctTypes[0] -> prices[0]
    return distinctTypes
      .toList()
      .reduce((acc, symbol, index) => acc
        .set(symbol, fromJS({
          symbol,
          price: prices[index][currency],
          market: 'CCAGG' // default market from cryptocompare
        })),
        Map()
      )
  }

  const getPrices = (investments, price, fx)  => {
    const {prices} = getState(); 
    const priceData = getPriceObjFromStreamData(currency, fx, price);
    // map though investments and convert price of purchase into the currenlty selected currency
    const updatedInvestments = fromJS(investments.result)
      .map(partial(changePriceToSelectedCurrency, currency, fx.get(currency)));

    return {
      investments: updatedInvestments,
      price: fromJS(priceData),
      fx: prices
    }
  }

  const partialInvestments$ = getPartialInvestment$();
  const keepPrices = obj => obj.price;
  const streams$ = [priceStream$(currency), fx$(currency)];

  // load the prices for all available asset types using get requests
  partialInvestments$
    .chain((fromPromise) ['∘'] (getPriceStreams))
    .tap((dispatch) ['∘'] (setPrices))
    .drain();
  
  const subscription = combine(getPrices, partialInvestments$ , ...streams$)
      .tap((dispatch) ['∘'] (setPrice) ['∘'] (keepPrices))
      .throttle(10000)
      .map(calculateTotalPortfolioValue)
      .subscribe(observer);

  dispatch(setPortfolioSubscription(subscription));
}
